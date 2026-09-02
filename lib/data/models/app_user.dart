enum UserRole { customer, owner }

class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.location,
    this.username,
    this.profilePhoto,
  });

  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String? location;
  final String? username;
  final String? profilePhoto;

  /// Builds an [AppUser] from the `profile` object returned by
  /// `GET /api/spotOwner/fetch-profile/:id` (used for both account types via
  /// `dualAuthMiddleware`). That endpoint never includes `email`, so it's
  /// threaded through separately from whatever the caller signed in with.
  factory AppUser.fromProfileJson(
    Map<String, dynamic> json, {
    required UserRole role,
    required String email,
  }) {
    final id = (json['_id'] ?? json['id']).toString();
    final username = json['username'] as String?;
    final firstname = json['firstname'] as String?;
    final lastname = json['lastname'] as String?;
    final fullName = [
      firstname,
      lastname,
    ].where((part) => part != null && part.trim().isNotEmpty).join(' ');

    final displayName =
        role == UserRole.owner
            ? (username ?? email)
            : (fullName.isNotEmpty ? fullName : (username ?? email));

    return AppUser(
      id: id,
      name: displayName,
      email: email,
      role: role,
      location: json['location'] as String?,
      username: username,
      profilePhoto: json['profilePhoto'] as String?,
    );
  }
}
