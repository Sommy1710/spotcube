import '../models/app_user.dart';

/// Contract the UI codes against. `MockAuthRepository` backs it today;
/// once the backend dev shares the live Swagger spec, add a
/// `RemoteAuthRepository implements AuthRepository` that calls the real
/// endpoints and swap the provider in `lib/data/repositories/providers.dart`
/// — no screen code needs to change.
abstract class AuthRepository {
  Future<AppUser> login({required String email, required String password});

  Future<AppUser> signUpCustomer({
    required String name,
    required String email,
    required String password,
  });

  Future<AppUser> signUpOwner({
    required String spotName,
    required String location,
    required String address,
    required String password,
  });

  Future<void> requestPasswordReset({required String email});

  Future<void> verifyOtp({required String email, required String otp});
}

class MockAuthRepository implements AuthRepository {
  @override
  Future<AppUser> login({required String email, required String password}) async {
    await Future.delayed(const Duration(milliseconds: 600));
    return AppUser(
      id: 'mock-user-1',
      name: 'Manuel',
      email: email,
      role: UserRole.customer,
      location: 'Ikeja, Lagos',
    );
  }

  @override
  Future<AppUser> signUpCustomer({
    required String name,
    required String email,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
    return AppUser(id: 'mock-user-2', name: name, email: email, role: UserRole.customer);
  }

  @override
  Future<AppUser> signUpOwner({
    required String spotName,
    required String location,
    required String address,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
    return AppUser(
      id: 'mock-owner-1',
      name: spotName,
      email: '',
      role: UserRole.owner,
      location: location,
    );
  }

  @override
  Future<void> requestPasswordReset({required String email}) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<void> verifyOtp({required String email, required String otp}) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }
}
