import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../widgets/spotcube_bottom_nav.dart';
import 'home_dashboard_screen.dart';

/// Only the "Home" tab has a design behind it so far. The other four are
/// placeholders wired into navigation now so they're one screen-file away
/// from being filled in once those designs are shared.
class HomeShellScreen extends StatefulWidget {
  const HomeShellScreen({super.key});

  @override
  State<HomeShellScreen> createState() => _HomeShellScreenState();
}

class _HomeShellScreenState extends State<HomeShellScreen> {
  int _index = 0;

  static const _placeholderTitles = [
    'Home',
    'Messages',
    'Explore',
    'Favorites',
    'Profile',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: [
          const HomeDashboardScreen(),
          for (final title in _placeholderTitles.skip(1))
            _PlaceholderTab(title: title),
        ],
      ),
      bottomNavigationBar: SpotCubeBottomNav(
        currentIndex: _index,
        onTap: (index) => setState(() => _index = index),
      ),
    );
  }
}

class _PlaceholderTab extends StatelessWidget {
  const _PlaceholderTab({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Text(
          title,
          textAlign: TextAlign.center,
          style: const TextStyle(color: AppColors.textMuted),
        ),
      ),
    );
  }
}
