import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart';

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
/// The backend authenticates via an httpOnly `authentication` cookie set on
/// login (see `res.cookie(...)` in the Express auth controllers) rather than
/// a bearer token in the response body, so [CookieManager] is required to
/// carry that cookie on subsequent requests. The jar is in-memory only: the
/// session does not survive an app restart yet.
Dio createApiClient() {
  final dio = Dio(
    BaseOptions(
      baseUrl: apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: const {'Accept': 'application/json'},
    ),
  );
  dio.interceptors.add(CookieManager(CookieJar()));
  enableCrossOriginCookies(dio);
  if (kDebugMode) {
    dio.interceptors.add(_CookieDebugInterceptor());
    dio.interceptors.add(
      LogInterceptor(requestBody: true, responseBody: true, error: true),
    );
  }
  return dio;
}

/// TEMPORARY diagnostic: prints exactly what's coming in on `set-cookie` and
/// what's going out on `cookie`, so a login failure can be traced without
/// digging through full request/response logs. Safe to delete once the
/// cross-request cookie handoff is confirmed working.
class _CookieDebugInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    debugPrint('🍪 OUTGOING ${options.method} ${options.path} '
        'cookie header: ${options.headers['cookie'] ?? '(none)'}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    final setCookie = response.headers['set-cookie'];
    debugPrint('🍪 INCOMING ${response.requestOptions.method} '
        '${response.requestOptions.path} -> ${response.statusCode} '
        'set-cookie: ${setCookie ?? '(none)'}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final setCookie = err.response?.headers['set-cookie'];
    debugPrint('🍪 ERROR ${err.requestOptions.method} '
        '${err.requestOptions.path} -> ${err.response?.statusCode} '
        'set-cookie: ${setCookie ?? '(none)'}');
    handler.next(err);
  }
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
