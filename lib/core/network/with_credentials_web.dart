import 'package:dio/browser.dart';
import 'package:dio/dio.dart';

/// The browser only attaches/stores cookies on a cross-origin XHR when
/// `withCredentials` is set — required for the Vercel-hosted web build to
/// carry the backend's `authentication` cookie to spotcube.onrender.com.
void enableCrossOriginCookies(Dio dio) {
  final adapter = dio.httpClientAdapter;
  if (adapter is BrowserHttpClientAdapter) {
    adapter.withCredentials = true;
  }
}
