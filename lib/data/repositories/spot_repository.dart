import '../models/spot.dart';

/// Same pattern as [AuthRepository]: UI depends on this abstraction, a
/// `RemoteSpotRepository` gets added later without touching screen code.
abstract class SpotRepository {
  Future<List<Spot>> getRecentSpots();
  Future<List<Spot>> getNearbySpots();
}

class MockSpotRepository implements SpotRepository {
  static final List<Spot> _spots = [
    const Spot(
      id: 'chicken-republic',
      name: 'Chicken Republic',
      address: 'Adeniran Ogunsanya St, Surulere',
      imageAsset: 'assets/images/spots/chicken_republic_grill.jpeg',
      rating: 4.4,
      walkLabel: '0.8km',
      tags: ['Fast food', 'Takeout'],
      isFavorite: true,
    ),
    const Spot(
      id: 'slice-social-house',
      name: 'Slice Social House',
      address: 'Slice Lagos, Victoria Island',
      imageAsset: 'assets/images/spots/slice_social_house.jpeg',
      rating: 4.7,
      walkLabel: '1.5km',
      tags: ['Café', 'Outdoor'],
    ),
    const Spot(
      id: 'zayda-lagos',
      name: 'Zayda Lagos',
      address: 'Zayda Lounge, Victoria Island',
      imageAsset: 'assets/images/spots/zayda_lagos.jpeg',
      rating: 4.6,
      walkLabel: '2.2km',
      tags: ['Lounge', 'Bar'],
    ),
  ];

  @override
  Future<List<Spot>> getRecentSpots() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _spots;
  }

  @override
  Future<List<Spot>> getNearbySpots() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _spots;
  }
}
