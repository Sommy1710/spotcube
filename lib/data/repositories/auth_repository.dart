import 'dart:io';

import 'package:dio/dio.dart';

import '../../core/network/api_client.dart';
import '../../core/network/auth_token_store.dart';
import '../models/app_user.dart';

/// Contract the UI codes against. [RemoteAuthRepository] backs it against
/// the live API (https://spotcube.onrender.com); [MockAuthRepository] is
/// kept around for offline UI work — swap which one `providers.dart` wires
/// up, no screen code needs to change either way.
///
/// The backend exposes separate route trees for customers (`/api/auth`) and
/// spot owners (`/api/spotOwner`), so every method takes a [UserRole] to
/// pick the right one.
abstract class AuthRepository {
  Future<AppUser> login({
    required UserRole role,
    required String email,
    required String password,
  });

  Future<void> signUpCustomer({
    required String firstname,
    required String lastname,
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? referralCode,
    String? heardAboutUs,
    String? country,
    File? profilePhoto,
  });

  Future<void> signUpOwner({
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? heardAboutUs,
    String? referralCode,
    File? profilePhoto,
  });

  Future<void> requestPasswordReset({
    required UserRole role,
    required String email,
  });

  /// Confirms the OTP sent on signup so the account's email is marked
  /// verified. Not usable for the forgot-password flow — see
  /// [resetPassword], which carries its own OTP check server-side.
  Future<void> verifyOtp({
    required UserRole role,
    required String email,
    required String otp,
  });

  /// Confirms the OTP sent by [requestPasswordReset] and sets [newPassword]
  /// in the same request — the backend has no separate "verify then reset"
  /// step for this flow.
  Future<void> resetPassword({
    required UserRole role,
    required String email,
    required String otp,
    required String newPassword,
  });

  Future<void> logout({required UserRole role});
}

class RemoteAuthRepository implements AuthRepository {
  RemoteAuthRepository(this._dio, this._tokenStore);

  final Dio _dio;
  final AuthTokenStore _tokenStore;

  String _base(UserRole role) =>
      role == UserRole.owner ? '/spotOwner' : '/auth';

  /// Runs [request], converting any [DioException] into the readable
  /// [Exception] every screen's catch block expects.
  Future<T> _guard<T>(Future<T> Function() request) async {
    try {
      return await request();
    } on DioException catch (e) {
      throw apiErrorToException(e);
    }
  }

  @override
  Future<AppUser> login({
    required UserRole role,
    required String email,
    required String password,
  }) async {
    final base = _base(role);
    // Clear any token from a previous session first — dualAuthMiddleware
    // tries the Bearer token before falling back to the cookie, so a stale
    // token here would silently authenticate the wrong account on the
    // fetch-profile call below.
    _tokenStore.clear();
    try {
      final loginResp = await _dio.post(
        '$base/login',
        data: {'email': email, 'password': password},
      );

      // Spot owner login still sets an httpOnly cookie (carried
      // automatically by CookieManager). Customer login instead returns the
      // JWT in the body — store it so the interceptor can attach it as
      // Authorization: Bearer on the calls below and afterwards.
      if (role == UserRole.customer) {
        final token = (loginResp.data['data'] as Map?)?['token'] as String?;
        if (token != null) _tokenStore.set(token);
      }

      final whoAmI = await _dio.get('$base/user');
      final account =
          (whoAmI.data['data'][role == UserRole.owner ? 'spotOwner' : 'user']
              as Map)['id'];

      final profileResp = await _dio.get('/spotOwner/fetch-profile/$account');
      final profile =
          (profileResp.data['data']['profile'] as Map).cast<String, dynamic>();

      return AppUser.fromProfileJson(profile, role: role, email: email);
    } on DioException catch (e) {
      _tokenStore.clear();
      throw apiErrorToException(e);
    }
  }

  @override
  Future<void> signUpCustomer({
    required String firstname,
    required String lastname,
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? referralCode,
    String? heardAboutUs,
    String? country,
    File? profilePhoto,
  }) async {
    final form = FormData.fromMap({
      'firstname': firstname,
      'lastname': lastname,
      'username': username,
      'email': email,
      'password': password,
      'state': state,
      'location': location,
      if (bio != null && bio.trim().isNotEmpty) 'bio': bio.trim(),
      if (referralCode != null && referralCode.trim().isNotEmpty)
        'referralCode': referralCode.trim(),
      if (heardAboutUs != null && heardAboutUs.trim().isNotEmpty)
        'heardAboutUs': heardAboutUs.trim(),
      if (country != null && country.trim().isNotEmpty) 'country': country.trim(),
      if (profilePhoto != null)
        'profilePhoto': await MultipartFile.fromFile(profilePhoto.path),
    });
    return _guard(() => _dio.post('/auth/register', data: form));
  }

  @override
  Future<void> signUpOwner({
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? heardAboutUs,
    String? referralCode,
    File? profilePhoto,
  }) async {
    final form = FormData.fromMap({
      'username': username,
      'email': email,
      'password': password,
      'state': state,
      'location': location,
      if (bio != null && bio.trim().isNotEmpty) 'bio': bio.trim(),
      if (heardAboutUs != null && heardAboutUs.trim().isNotEmpty)
        'heardAboutUs': heardAboutUs.trim(),
      if (referralCode != null && referralCode.trim().isNotEmpty)
        'referralCode': referralCode.trim(),
      if (profilePhoto != null)
        'profilePhoto': await MultipartFile.fromFile(profilePhoto.path),
    });
    return _guard(() => _dio.post('/spotOwner/register', data: form));
  }

  @override
  Future<void> requestPasswordReset({required UserRole role, required String email}) {
    return _guard(
      () => _dio.post('${_base(role)}/forgot-password', data: {'email': email}),
    );
  }

  @override
  Future<void> verifyOtp({
    required UserRole role,
    required String email,
    required String otp,
  }) {
    return _guard(
      () => _dio.post('${_base(role)}/verify', data: {'email': email, 'otp': otp}),
    );
  }

  @override
  Future<void> resetPassword({
    required UserRole role,
    required String email,
    required String otp,
    required String newPassword,
  }) {
    return _guard(
      () => _dio.post(
        '${_base(role)}/reset-password',
        data: {'email': email, 'otp': otp, 'newPassword': newPassword},
      ),
    );
  }

  @override
  Future<void> logout({required UserRole role}) async {
    try {
      await _dio.post('${_base(role)}/logout');
    } on DioException {
      // Local session state is cleared regardless; a failed server-side
      // logout isn't worth blocking the user over.
    } finally {
      _tokenStore.clear();
    }
  }
}

class MockAuthRepository implements AuthRepository {
  @override
  Future<AppUser> login({
    required UserRole role,
    required String email,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
    return AppUser(id: 'mock-user-1', name: 'Manuel', email: email, role: role, location: 'Ikeja, Lagos');
  }

  @override
  Future<void> signUpCustomer({
    required String firstname,
    required String lastname,
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? referralCode,
    String? heardAboutUs,
    String? country,
    File? profilePhoto,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> signUpOwner({
    required String username,
    required String email,
    required String password,
    required String state,
    required String location,
    String? bio,
    String? heardAboutUs,
    String? referralCode,
    File? profilePhoto,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> requestPasswordReset({
    required UserRole role,
    required String email,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> verifyOtp({
    required UserRole role,
    required String email,
    required String otp,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> resetPassword({
    required UserRole role,
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> logout({required UserRole role}) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }
}
