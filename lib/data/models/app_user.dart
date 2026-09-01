enum UserRole { customer, owner }

class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.location,
  });

  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String? location;
}
