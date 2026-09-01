import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

class FavoriteHeartButton extends StatelessWidget {
  const FavoriteHeartButton({
    super.key,
    required this.isFavorite,
    required this.onTap,
  });

  final bool isFavorite;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
        child: Icon(
          isFavorite ? Icons.favorite : Icons.favorite_border,
          size: 18,
          color: isFavorite ? AppColors.favoriteRed : AppColors.textMuted,
        ),
      ),
    );
  }
}
