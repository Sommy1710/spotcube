import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/constants/nigerian_locations.dart';
import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/pill_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../data/repositories/providers.dart';
import '../spotowner_signup_draft.dart';

class SpotOwnerSignupStep2Screen extends ConsumerStatefulWidget {
  const SpotOwnerSignupStep2Screen({super.key});

  @override
  ConsumerState<SpotOwnerSignupStep2Screen> createState() =>
      _SpotOwnerSignupStep2ScreenState();
}

class _SpotOwnerSignupStep2ScreenState extends ConsumerState<SpotOwnerSignupStep2Screen> {
  final _bioController = TextEditingController();
  final _referralController = TextEditingController();
  final _picker = ImagePicker();

  XFile? _profileImage;
  Uint8List? _profileImageBytes;
  String? _hearAboutUs;
  bool _isLoading = false;

  @override
  void dispose() {
    _bioController.dispose();
    _referralController.dispose();
    super.dispose();
  }

  Future<void> _pickProfileImage() async {
    final image = await _picker.pickImage(source: ImageSource.gallery);
    if (image == null) return;
    final bytes = await image.readAsBytes();
    setState(() {
      _profileImage = image;
      _profileImageBytes = bytes;
    });
  }

  Future<void> _handleSignUp(SpotOwnerSignupDraft draft) async {
    setState(() => _isLoading = true);
    try {
      await ref.read(authRepositoryProvider).signUpOwner(
            username: draft.spotName,
            email: draft.email,
            password: draft.password,
            state: draft.state,
            location: '${draft.address}, ${draft.location}',
            bio: _bioController.text,
            heardAboutUs: _hearAboutUs,
            referralCode: _referralController.text,
            profilePhoto: _profileImage,
          );
      if (mounted) {
        context.push(
          '${AppRoutes.otp}?email=${Uri.encodeComponent(draft.email)}&role=owner',
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
    final draft = GoRouterState.of(context).extra as SpotOwnerSignupDraft?;

    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: GestureDetector(
                  onTap: _pickProfileImage,
                  child: Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.textPrimary, width: 1.5),
                      image: _profileImageBytes != null
                          ? DecorationImage(
                              image: MemoryImage(_profileImageBytes!),
                              fit: BoxFit.cover,
                            )
                          : null,
                    ),
                    child: _profileImageBytes == null
                        ? const Icon(Icons.person_outline, size: 40, color: AppColors.textPrimary)
                        : null,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Center(child: Text('Upload your profile picture')),
              const SizedBox(height: 24),
              Text('Bio', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              PillTextField(
                hintText: '',
                controller: _bioController,
                maxLines: 4,
              ),
              const SizedBox(height: 20),
              Text('How did you hear about us?', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _hearAboutUs,
                decoration: const InputDecoration(hintText: 'Select an option'),
                items: heardAboutUsOptions
                    .map((option) => DropdownMenuItem(value: option, child: Text(option)))
                    .toList(),
                onChanged: (value) => setState(() => _hearAboutUs = value),
              ),
              const SizedBox(height: 20),
              Text('Referral code (Optional)', style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 8),
              PillTextField(hintText: '', controller: _referralController),
              const SizedBox(height: 24),
              PrimaryButton(
                label: 'Sign up',
                isLoading: _isLoading,
                onPressed: draft == null ? null : () => _handleSignUp(draft),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
