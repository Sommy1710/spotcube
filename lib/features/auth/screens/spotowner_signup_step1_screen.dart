import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/pill_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../core/widgets/role_badge.dart';
import '../../../core/widgets/spotcube_logo.dart';
import '../../../core/widgets/terms_footer.dart';
import '../spotowner_signup_draft.dart';

/// Placeholder list until the backend exposes a real locations endpoint
/// (or this is swapped for a Places-style autocomplete).
const _lagosAreas = [
  'Ikeja',
  'Lekki',
  'Victoria Island',
  'Yaba',
  'Surulere',
  'Ikoyi',
];

class SpotOwnerSignupStep1Screen extends StatefulWidget {
  const SpotOwnerSignupStep1Screen({super.key});

  @override
  State<SpotOwnerSignupStep1Screen> createState() =>
      _SpotOwnerSignupStep1ScreenState();
}

class _SpotOwnerSignupStep1ScreenState
    extends State<SpotOwnerSignupStep1Screen> {
  final _formKey = GlobalKey<FormState>();
  final _spotNameController = TextEditingController();
  final _addressController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String? _selectedLocation;

  @override
  void dispose() {
    _spotNameController.dispose();
    _addressController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleContinue() {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedLocation == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select a location')));
      return;
    }
    context.push(
      AppRoutes.spotOwnerSignupStep2,
      extra: SpotOwnerSignupDraft(
        spotName: _spotNameController.text.trim(),
        location: _selectedLocation!,
        address: _addressController.text.trim(),
        password: _passwordController.text,
      ),
    );
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
                  icon: Icons.storefront_outlined,
                  label: 'Signing up as a spot owner',
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
                  hintText: 'Enter your Spot name',
                  controller: _spotNameController,
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Spot name is required'
                              : null,
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Location',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedLocation,
                  decoration: const InputDecoration(
                    hintText: 'Enter your Spot Location',
                  ),
                  icon: const Icon(
                    Icons.keyboard_arrow_down,
                    color: AppColors.textMuted,
                  ),
                  items:
                      _lagosAreas
                          .map(
                            (area) => DropdownMenuItem(
                              value: area,
                              child: Text(area),
                            ),
                          )
                          .toList(),
                  onChanged:
                      (value) => setState(() => _selectedLocation = value),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Address',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
                const SizedBox(height: 8),
                PillTextField(
                  hintText: 'Enter your Spot address',
                  controller: _addressController,
                  suffixIcon: const Icon(
                    Icons.keyboard_arrow_down,
                    color: AppColors.textMuted,
                  ),
                  validator:
                      (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Address is required'
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
                PrimaryButton(label: 'Continue', onPressed: _handleContinue),
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
