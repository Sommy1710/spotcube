import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/option_card.dart';
import '../../../core/widgets/spotcube_logo.dart';
import '../../../core/widgets/terms_footer.dart';

/// Shown right after "Explore Now" on the splash screen. Lets a visitor
/// choose whether they already have a Spot account (Login) or need to
/// create one (Sign up), before either path asks whether they're a customer
/// or a Spot owner.
class AuthEntryScreen extends StatelessWidget {
  const AuthEntryScreen({super.key});

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
                onPressed: () => context.go(AppRoutes.splash),
                icon: const Icon(Icons.close, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 8),
              const Center(child: SpotCubeLogo(size: 72)),
              const SizedBox(height: 24),
              Text(
                'Welcome to Spotcube',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Login to your account or create a new one to get started',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              OptionCard(
                icon: Icons.login,
                title: 'Login',
                subtitle: 'Already have a Spot account? Welcome back',
                onTap: () => context.push(AppRoutes.loginType),
              ),
              const SizedBox(height: 16),
              OptionCard(
                icon: Icons.person_add_alt_outlined,
                title: 'Sign up',
                subtitle: 'New here? Create an account to get started',
                onTap: () => context.push(AppRoutes.signupType),
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
