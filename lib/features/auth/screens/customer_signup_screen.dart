import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/widgets/pill_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../core/widgets/role_badge.dart';
import '../../../core/widgets/spotcube_logo.dart';
import '../../../core/widgets/terms_footer.dart';
import '../../../data/repositories/providers.dart';

/// Placeholder screen: no Figma design has been shared yet for the customer
/// signup form. Mirrors the visual language of the other auth screens
/// (owner signup, login) so it's ready to be reworked once the real
/// design arrives.
class CustomerSignupScreen extends ConsumerStatefulWidget {
  const CustomerSignupScreen({super.key});

  @override
  ConsumerState<CustomerSignupScreen> createState() =>
      _CustomerSignupScreenState();
}

class _CustomerSignupScreenState extends ConsumerState<CustomerSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref
          .read(authRepositoryProvider)
          .signUpCustomer(
            name: _nameController.text.trim(),
            email: _emailController.text.trim(),
            password: _passwordController.text,
          );
      if (mounted) {
        context.push(
          '${AppRoutes.otp}?email=${Uri.encodeComponent(_emailController.text.trim())}',
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const SpotCubeLogo(size: 80),
                const SizedBox(height: 16),
                const RoleBadge(
                  icon: Icons.person_outline,
                  label: 'Signing up as a customer',
                ),
                const SizedBox(height: 16),
                Text(
                  'Sign up',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  'Create your Spot account',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 24),
                PillTextField(
                  hintText: 'Enter your full name',
                  controller: _nameController,
                  leadingIcon: Icons.person_outline,
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Name is required'
                              : null,
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Enter your email',
                  controller: _emailController,
                  leadingIcon: Icons.mail_outline,
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Email is required';
                    }
                    if (!value.contains('@')) return 'Enter a valid email';
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Enter your password',
                  controller: _passwordController,
                  leadingIcon: Icons.lock_outline,
                  obscureText: true,
                  validator:
                      (value) =>
                          (value == null || value.length < 6)
                              ? 'Password must be at least 6 characters'
                              : null,
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Confirm your password',
                  controller: _confirmPasswordController,
                  leadingIcon: Icons.lock_outline,
                  obscureText: true,
                  validator:
                      (value) =>
                          value != _passwordController.text
                              ? 'Passwords do not match'
                              : null,
                ),
                const SizedBox(height: 24),
                PrimaryButton(
                  label: 'Continue',
                  isLoading: _isLoading,
                  onPressed: _handleSignUp,
                ),
                const SizedBox(height: 24),
                const TermsFooter(actionVerb: 'Login'),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
