import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/models/spot.dart';
import 'favorite_heart_button.dart';

class SpotNearbyCard extends StatelessWidget {
  const SpotNearbyCard({
    super.key,
    required this.spot,
    required this.onFavoriteToggle,
    this.onTap,
  });

  final Spot spot;
  final VoidCallback onFavoriteToggle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 10,
                  child: Image.asset(spot.imageAsset, fit: BoxFit.cover, width: double.infinity),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: FavoriteHeartButton(
                    isFavorite: spot.isFavorite,
                    onTap: onFavoriteToggle,
                  ),
                ),
                if (spot.tags.isNotEmpty)
                  Positioned(
                    left: 10,
                    bottom: 10,
                    child: Row(
                      children: spot.tags
                          .map(
                            (tag) => Container(
                              margin: const EdgeInsets.only(right: 6),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.55),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                tag,
                                style: const TextStyle(color: Colors.white, fontSize: 11),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            spot.name,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 2),
          Text(
            spot.address,
            style: const TextStyle(color: AppColors.linkOrange, fontSize: 13),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.star_rounded, size: 18, color: AppColors.starGold),
              const SizedBox(width: 4),
              Text('${spot.rating}', style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(width: 12),
              const Icon(Icons.directions_walk_rounded, size: 18, color: AppColors.textMuted),
              const SizedBox(width: 4),
              Text(spot.walkLabel, style: Theme.of(context).textTheme.bodyMedium),
            ],
          ),
        ],
      ),
    );
  }
}
