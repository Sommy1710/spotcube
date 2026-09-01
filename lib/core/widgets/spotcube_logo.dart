import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../theme/app_colors.dart';

/// The SPOTCUBE brush-mark logo, rendered from the real vector artwork at
/// `assets/images/logo/logo_mark.svg`.
class SpotCubeLogo extends StatelessWidget {
  const SpotCubeLogo({super.key, this.size = 96, this.color});

  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final markColor = color ?? AppColors.textPrimary;
    return SvgPicture.asset(
      'assets/images/logo/logo_mark.svg',
      width: size,
      height: size,
      fit: BoxFit.contain,
      colorFilter: ColorFilter.mode(markColor, BlendMode.srcIn),
    );
  }
}
