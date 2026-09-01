import 'package:flutter/material.dart';

import '../../../data/models/spot.dart';
import 'favorite_heart_button.dart';

class SpotRecentCard extends StatelessWidget {
  const SpotRecentCard({
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
      child: SizedBox(
        width: 200,
        height: 180,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(spot.imageAsset, fit: BoxFit.cover),
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.0),
                        Colors.black.withValues(alpha: 0.45),
                      ],
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 12,
                bottom: 12,
                right: 12,
                child: Text(
                  spot.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: FavoriteHeartButton(
                  isFavorite: spot.isFavorite,
                  onTap: onFavoriteToggle,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
