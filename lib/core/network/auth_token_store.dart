/// Holds the auth Bearer token in memory for the app's lifetime.
///
/// Both `POST /api/auth/login` (customer) and `POST /api/spotOwner/login`
/// (owner) return a JWT in the response body, expected back as
/// `Authorization: Bearer <token>`. This store is read by a Dio interceptor
/// and written by [RemoteAuthRepository].
class AuthTokenStore {
  String? _token;

  String? get token => _token;

  void set(String? token) => _token = token;

  void clear() => _token = null;
}
