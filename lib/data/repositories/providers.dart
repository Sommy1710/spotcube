import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_user.dart';
import 'auth_repository.dart';
import 'spot_repository.dart';

/// Swap `MockAuthRepository()` / `MockSpotRepository()` for the real
/// implementations here once the backend's Swagger spec is available.
/// Every screen reads through these providers, never the mock classes
/// directly, so this is the only file that needs to change.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return MockAuthRepository();
});

final spotRepositoryProvider = Provider<SpotRepository>((ref) {
  return MockSpotRepository();
});

final currentUserProvider = StateProvider<AppUser?>((ref) => null);
