import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/nigerian_locations.dart';
import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
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
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _locationController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String? _selectedState;
  bool _isLoading = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _locationController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedState == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select a state')));
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref
          .read(authRepositoryProvider)
          .signUpCustomer(
            firstname: _firstNameController.text.trim(),
            lastname: _lastNameController.text.trim(),
            username: _usernameController.text.trim(),
            email: _emailController.text.trim(),
            password: _passwordController.text,
            state: _selectedState!,
            location: _locationController.text.trim(),
          );
      if (mounted) {
        context.push(
          '${AppRoutes.otp}?email=${Uri.encodeComponent(_emailController.text.trim())}',
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
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
                  hintText: 'Enter your first name',
                  controller: _firstNameController,
                  leadingIcon: Icons.person_outline,
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'First name is required'
                              : null,
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Enter your last name',
                  controller: _lastNameController,
                  leadingIcon: Icons.person_outline,
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Last name is required'
                              : null,
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Choose a username',
                  controller: _usernameController,
                  leadingIcon: Icons.alternate_email,
                  validator: (value) {
                    if (value == null || value.trim().length < 3) {
                      return 'Username must be at least 3 characters';
                    }
                    return null;
                  },
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
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text('State', style: Theme.of(context).textTheme.bodyLarge),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedState,
                  decoration: const InputDecoration(hintText: 'Select your state'),
                  icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.textMuted),
                  items: nigerianStates
                      .map((state) => DropdownMenuItem(value: state, child: Text(state)))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedState = value),
                ),
                const SizedBox(height: 16),
                PillTextField(
                  hintText: 'Enter your city / area',
                  controller: _locationController,
                  leadingIcon: Icons.location_on_outlined,
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Location is required'
                              : null,
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
