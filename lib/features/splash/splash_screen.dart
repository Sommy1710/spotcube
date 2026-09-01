import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/spotcube_logo.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.splashBackground,
      body: SafeArea(
        child: Column(
          children: [
            const Expanded(
              child: Center(
                child: SpotCubeLogo(size: 140, color: AppColors.textPrimary),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: _SlideToExploreButton(
                onComplete: () => context.go(AppRoutes.authEntry),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// A slide-to-act control: the circular icon must be dragged all the way to
/// the arrow before [onComplete] fires, so exploring can't happen from an
/// accidental tap.
class _SlideToExploreButton extends StatefulWidget {
  const _SlideToExploreButton({required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<_SlideToExploreButton> createState() => _SlideToExploreButtonState();
}

class _SlideToExploreButtonState extends State<_SlideToExploreButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 220),
    value: 0,
  );

  static const _thumbSize = 48.0;
  static const _completeThreshold = 0.82;

  bool _navigated = false;
  double _maxDrag = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    if (_navigated || _maxDrag <= 0) return;
    final next = _controller.value + details.delta.dx / _maxDrag;
    _controller.value = next.clamp(0.0, 1.0);
  }

  Future<void> _handleDragEnd(DragEndDetails details) async {
    if (_navigated) return;
    if (_controller.value >= _completeThreshold) {
      _navigated = true;
      await _controller.animateTo(1, curve: Curves.easeOut);
      widget.onComplete();
    } else {
      await _controller.animateTo(0, curve: Curves.easeOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.textPrimary.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(32),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: LayoutBuilder(
          builder: (context, constraints) {
            _maxDrag = constraints.maxWidth - _thumbSize;
            return SizedBox(
              height: _thumbSize,
              child: Stack(
                alignment: Alignment.centerLeft,
                children: [
                  Row(
                    children: [
                      const SizedBox(width: _thumbSize + 8),
                      const Expanded(
                        child: Center(
                          child: Text(
                            'Explore Now',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.only(right: 8),
                        child: Icon(
                          Icons.keyboard_double_arrow_right,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) {
                      final maxDrag = _maxDrag < 0 ? 0.0 : _maxDrag;
                      return Positioned(
                        left: _controller.value * maxDrag,
                        child: child!,
                      );
                    },
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onHorizontalDragUpdate: _handleDragUpdate,
                      onHorizontalDragEnd: _handleDragEnd,
                      child: const CircleAvatar(
                        radius: _thumbSize / 2,
                        backgroundColor: AppColors.textPrimary,
                        child: Icon(
                          Icons.near_me,
                          color: AppColors.background,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
