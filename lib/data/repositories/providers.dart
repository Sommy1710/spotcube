import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_client.dart';
import '../models/app_user.dart';
import 'auth_repository.dart';
import 'spot_repository.dart';

/// Shared Dio client for every remote repository, pointed at the deployed
/// backend (see [apiBaseUrl]).
final dioProvider = Provider<Dio>((ref) => createApiClient());

/// Auth is wired to the live backend. Spot browsing (recent/nearby) stays on
/// [MockSpotRepository] for now — the backend has no public "browse spots"
/// endpoint yet, only a spot owner's own listings and an authenticated
/// keyword search. Swap it for a `RemoteSpotRepository` once that exists.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return RemoteAuthRepository(ref.watch(dioProvider));
});

final spotRepositoryProvider = Provider<SpotRepository>((ref) {
  return MockSpotRepository();
});

final currentUserProvider = StateProvider<AppUser?>((ref) => null);
