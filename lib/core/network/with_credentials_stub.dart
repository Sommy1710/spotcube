import 'package:dio/dio.dart';

/// No-op on non-web platforms — native HTTP clients aren't subject to the
/// browser's same-origin cookie policy, so there's nothing to enable.
void enableCrossOriginCookies(Dio dio) {}
