import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// The "By clicking ..., you agree to our Terms of Service and Privacy
/// Policy" text repeated at the bottom of every auth screen.
class TermsFooter extends StatelessWidget {
  const TermsFooter({super.key, this.actionVerb = 'continue'});

  final String actionVerb;

  @override
  Widget build(BuildContext context) {
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: const TextStyle(
          color: AppColors.textPrimary,
          fontSize: 13,
        ),
        children: [
          TextSpan(text: 'By clicking $actionVerb, you agree to our '),
          const TextSpan(
            text: 'Terms of Service',
            style: TextStyle(
              color: AppColors.linkOrange,
              fontWeight: FontWeight.w600,
            ),
          ),
          const TextSpan(text: ' and '),
          const TextSpan(
            text: 'Privacy Policy',
            style: TextStyle(
              color: AppColors.linkOrange,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
