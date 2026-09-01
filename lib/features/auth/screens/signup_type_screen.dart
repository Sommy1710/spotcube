import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/option_card.dart';
import '../../../core/widgets/terms_footer.dart';

class SignupTypeScreen extends StatelessWidget {
  const SignupTypeScreen({super.key});

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
                onPressed: () => context.go(AppRoutes.authEntry),
                icon: const Icon(Icons.close, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 8),
              Text('Sign up', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 24),
              OptionCard(
                icon: Icons.person_outline,
                title: 'Create an account',
                subtitle: 'Discover and reserve your ideal Spot nearby',
                onTap: () => context.push(AppRoutes.customerSignup),
              ),
              const SizedBox(height: 16),
              OptionCard(
                icon: Icons.storefront_outlined,
                title: 'Become a Spot owner',
                subtitle: 'Got a spot? put it on the map and host your community',
                onTap: () => context.push(AppRoutes.spotOwnerSignupStep1),
              ),
              const Spacer(),
              const Padding(
                padding: EdgeInsets.only(bottom: 24),
                child: TermsFooter(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
