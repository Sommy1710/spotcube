import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/spot.dart';
import '../../../data/repositories/providers.dart';
import '../../../data/repositories/spot_repository.dart';

class SpotListNotifier extends AsyncNotifier<List<Spot>> {
  SpotListNotifier(this._loader);

  final Future<List<Spot>> Function(SpotRepository repo) _loader;

  @override
  Future<List<Spot>> build() {
    return _loader(ref.read(spotRepositoryProvider));
  }

  void toggleFavorite(String spotId) {
    final current = state.value;
    if (current == null) return;
    state = AsyncData([
      for (final spot in current)
        if (spot.id == spotId) spot.copyWith(isFavorite: !spot.isFavorite) else spot,
    ]);
  }
}

final recentSpotsProvider = AsyncNotifierProvider<SpotListNotifier, List<Spot>>(
  () => SpotListNotifier((repo) => repo.getRecentSpots()),
);

final nearbySpotsProvider = AsyncNotifierProvider<SpotListNotifier, List<Spot>>(
  () => SpotListNotifier((repo) => repo.getNearbySpots()),
);
