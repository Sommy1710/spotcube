import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart';

import 'auth_token_store.dart';
import 'with_credentials.dart';

/// The deployed backend on Render. Override at build time with
/// `--dart-define=API_BASE_URL=http://localhost:3000/api` when pointing at
/// a local server instead.
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'https://spotcube.onrender.com/api',
);

/// Builds the shared Dio client used by every remote repository.
///
/// Both customer and spot owner login return a JWT in the response body,
/// expected back as `Authorization: Bearer <token>` — hence [tokenStore],
/// read on every outgoing request. It doesn't persist across an app restart
/// yet. [CookieManager] is kept around for any remaining cookie-based
/// endpoints but auth no longer relies on it.
Dio createApiClient(AuthTokenStore tokenStore) {
  final dio = Dio(
    BaseOptions(
      baseUrl: apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: const {'Accept': 'application/json'},
    ),
  );
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = tokenStore.token;
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ),
  );
  // dio_cookie_manager explicitly doesn't support web (its own source
  // asserts `!_kIsWeb`) — on web, `Cookie` is a forbidden header no script
  // can set, so this would just fail silently in release builds. Auth no
  // longer depends on cookies for either role, but this stays in case other
  // endpoints still set them.
  if (!kIsWeb) {
    dio.interceptors.add(CookieManager(CookieJar()));
  }
  enableCrossOriginCookies(dio);
  if (kDebugMode) {
    dio.interceptors.add(
      LogInterceptor(requestBody: true, responseBody: true, error: true),
    );
  }
  return dio;
}

/// Turns a [DioException] from the SpotCube API into a message safe to show
/// a user, preferring the backend's own `message` field when present.
Exception apiErrorToException(DioException error) {
  final data = error.response?.data;
  if (data is Map && data['message'] is String) {
    return Exception(data['message'] as String);
  }
  if (error.type == DioExceptionType.connectionTimeout ||
      error.type == DioExceptionType.receiveTimeout ||
      error.type == DioExceptionType.sendTimeout) {
    return Exception(
      'The server is taking too long to respond. Please try again.',
    );
  }
  if (error.type == DioExceptionType.connectionError) {
    return Exception('Could not reach the server. Check your connection.');
  }
  return Exception('Something went wrong. Please try again.');
}
