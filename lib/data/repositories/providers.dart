import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_client.dart';
import '../../core/network/auth_token_store.dart';
import '../models/app_user.dart';
import 'auth_repository.dart';
import 'spot_repository.dart';

/// Holds the customer-auth Bearer token (see [AuthTokenStore] for why
/// customer and spot owner sessions use different transports).
final authTokenStoreProvider = Provider<AuthTokenStore>((ref) => AuthTokenStore());

/// Shared Dio client for every remote repository, pointed at the deployed
/// backend (see [apiBaseUrl]).
final dioProvider = Provider<Dio>(
  (ref) => createApiClient(ref.watch(authTokenStoreProvider)),
);

/// Auth is wired to the live backend. Spot browsing (recent/nearby) stays on
/// [MockSpotRepository] for now — the backend has no public "browse spots"
/// endpoint yet, only a spot owner's own listings and an authenticated
/// keyword search. Swap it for a `RemoteSpotRepository` once that exists.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return RemoteAuthRepository(ref.watch(dioProvider), ref.watch(authTokenStoreProvider));
});

final spotRepositoryProvider = Provider<SpotRepository>((ref) {
  return MockSpotRepository();
});

final currentUserProvider = StateProvider<AppUser?>((ref) => null);
