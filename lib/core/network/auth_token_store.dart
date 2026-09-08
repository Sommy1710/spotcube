/// Holds the customer-auth Bearer token in memory for the app's lifetime.
///
/// The backend splits auth by role: spot owners still authenticate via an
/// httpOnly cookie (see [CookieManager] in `api_client.dart`), but customer
/// login (`POST /api/auth/login`) now returns a JWT in the response body
/// instead, expected back as `Authorization: Bearer <token>`. This store is
/// read by a Dio interceptor and written by [RemoteAuthRepository].
class AuthTokenStore {
  String? _token;

  String? get token => _token;

  void set(String? token) => _token = token;

  void clear() => _token = null;
}
