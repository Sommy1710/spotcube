import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/spotcube_logo.dart';

class SpotCubeBottomNav extends StatelessWidget {
  const SpotCubeBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.hasUnreadMessages = true,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool hasUnreadMessages;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      decoration: const BoxDecoration(
        color: AppColors.background,
        border: Border(top: BorderSide(color: AppColors.divider)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavIcon(
              icon: Icons.home_rounded,
              isActive: currentIndex == 0,
              onTap: () => onTap(0),
            ),
            _NavIcon(
              icon: Icons.mail_outline_rounded,
              isActive: currentIndex == 1,
              showBadge: hasUnreadMessages,
              onTap: () => onTap(1),
            ),
            GestureDetector(
              onTap: () => onTap(2),
              child: SpotCubeLogo(
                size: 28,
                color: currentIndex == 2 ? AppColors.primary : AppColors.textPrimary,
              ),
            ),
            _NavIcon(
              icon: Icons.favorite_border_rounded,
              isActive: currentIndex == 3,
              onTap: () => onTap(3),
            ),
            _NavIcon(
              icon: Icons.person_outline_rounded,
              isActive: currentIndex == 4,
              onTap: () => onTap(4),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavIcon extends StatelessWidget {
  const _NavIcon({
    required this.icon,
    required this.isActive,
    required this.onTap,
    this.showBadge = false,
  });

  final IconData icon;
  final bool isActive;
  final bool showBadge;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isActive ? AppColors.primary : Colors.transparent,
            ),
            child: Icon(
              icon,
              color: isActive ? Colors.white : AppColors.textPrimary,
              size: 22,
            ),
          ),
          if (showBadge)
            Positioned(
              right: 6,
              top: 4,
              child: Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.badgeDot,
                  shape: BoxShape.circle,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
