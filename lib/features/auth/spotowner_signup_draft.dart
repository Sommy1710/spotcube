/// Data collected on step 1 of the spot owner signup flow, carried forward
/// to step 2 via the router's `extra` parameter.
class SpotOwnerSignupDraft {
  const SpotOwnerSignupDraft({
    required this.spotName,
    required this.email,
    required this.state,
    required this.location,
    required this.address,
    required this.password,
  });

  final String spotName;
  final String email;

  /// Nigerian state, required by the backend's `CreateSpotOwnerRequest`.
  final String state;
  final String location;
  final String address;
  final String password;
}
