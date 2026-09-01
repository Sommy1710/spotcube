import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/option_card.dart';
import '../../../core/widgets/terms_footer.dart';

/// Mirrors [SignupTypeScreen]'s sign-up choice, but for logging back in:
/// a returning visitor picks whether they're logging in as a customer (on
/// [CustomerLoginScreen]) or as a Spot owner (on [SpotOwnerLoginScreen]).
class LoginTypeScreen extends StatelessWidget {
  const LoginTypeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              IconButton(
                onPressed: () => context.pop(),
                icon: const Icon(
                  Icons.arrow_back,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text('Login', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 24),
              OptionCard(
                icon: Icons.person_outline,
                title: 'Login to find a chill spot',
                subtitle: 'Continue to discover and reserve Spots nearby',
                onTap: () => context.push(AppRoutes.customerLogin),
              ),
              const SizedBox(height: 16),
              OptionCard(
                icon: Icons.storefront_outlined,
                title: 'Login as a Spot owner',
                subtitle: 'Continue to manage your Spot and bookings',
                onTap: () => context.push(AppRoutes.spotOwnerLogin),
              ),
              const Spacer(),
              const Padding(
                padding: EdgeInsets.only(bottom: 24),
                child: TermsFooter(actionVerb: 'Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
