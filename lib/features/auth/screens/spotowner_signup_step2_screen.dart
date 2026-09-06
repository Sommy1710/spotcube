import 'dart:io';

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

  File? _profileImage;
  final List<File> _spotImages = [];
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
    if (image != null) setState(() => _profileImage = File(image.path));
  }

  Future<void> _pickSpotImage() async {
    if (_spotImages.length >= 3) return;
    final image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) setState(() => _spotImages.add(File(image.path)));
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
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.textPrimary, width: 1.5),
                      image: _profileImage != null
                          ? DecorationImage(
                              image: FileImage(_profileImage!),
                              fit: BoxFit.cover,
                            )
                          : null,
                    ),
                    child: _profileImage == null
                        ? const Icon(Icons.person_outline, size: 40, color: AppColors.textPrimary)
                        : null,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Center(child: Text('Upload your profile picture')),
              const SizedBox(height: 24),
              Row(
                children: [
                  const Text('Upload your Spot pictures'),
                  const SizedBox(width: 6),
                  const Icon(Icons.file_download_outlined, size: 16),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  for (final image in _spotImages) ...[
                    _SpotImageTile(file: image),
                    const SizedBox(width: 12),
                  ],
                  if (_spotImages.length < 3)
                    GestureDetector(
                      onTap: _pickSpotImage,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.fromBorderSide(
                            BorderSide(color: AppColors.textPrimary),
                          ),
                        ),
                        child: const Icon(Icons.add, size: 18, color: AppColors.textPrimary),
                      ),
                    ),
                ],
              ),
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

class _SpotImageTile extends StatelessWidget {
  const _SpotImageTile({required this.file});

  final File file;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.file(file, width: 64, height: 80, fit: BoxFit.cover),
    );
  }
}
