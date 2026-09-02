import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/pill_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../data/models/app_user.dart';
import '../../../data/repositories/providers.dart';

class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({
    super.key,
    required this.email,
    this.role = UserRole.customer,
    this.isPasswordReset = false,
  });

  final String email;

  /// Which login screen to return to once the code is verified.
  final UserRole role;

  /// True when this screen was reached from "Forgot your password?" — the
  /// backend confirms that OTP and sets a new password in one call
  /// (`AuthRepository.resetPassword`), rather than the plain email-verify
  /// call used right after signup (`AuthRepository.verifyOtp`).
  final bool isPasswordReset;

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  static const _codeLength = 5;
  final List<TextEditingController> _controllers = List.generate(
    _codeLength,
    (_) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(
    _codeLength,
    (_) => FocusNode(),
  );
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  Timer? _timer;
  int _secondsLeft = 299;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _secondsLeft = 299;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft == 0) {
        timer.cancel();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  String get _formattedTime {
    final minutes = _secondsLeft ~/ 60;
    final seconds = _secondsLeft % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  Future<void> _handleContinue() async {
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length != _codeLength) return;
    if (widget.isPasswordReset) {
      if (_newPasswordController.text.length < 6) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Password must be at least 6 characters')),
        );
        return;
      }
      if (_newPasswordController.text != _confirmPasswordController.text) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Passwords do not match')),
        );
        return;
      }
    }

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(authRepositoryProvider);
      if (widget.isPasswordReset) {
        await repo.resetPassword(
          role: widget.role,
          email: widget.email,
          otp: otp,
          newPassword: _newPasswordController.text,
        );
      } else {
        await repo.verifyOtp(role: widget.role, email: widget.email, otp: otp);
      }
      if (mounted) {
        context.go(
          widget.role == UserRole.owner
              ? AppRoutes.spotOwnerLogin
              : AppRoutes.customerLogin,
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
  void dispose() {
    _timer?.cancel();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 40),
              Text(
                widget.isPasswordReset ? 'Reset Your Password' : 'Verify Your Email',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Enter the OTP sent to your Email Account',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Enter OTP',
                    style: TextStyle(
                      color: AppColors.linkOrange,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        _formattedTime,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: _secondsLeft == 0 ? _startTimer : null,
                        child: Text(
                          'Resend OTP',
                          style: TextStyle(
                            color:
                                _secondsLeft == 0
                                    ? AppColors.textPrimary
                                    : AppColors.textMuted,
                            decoration: TextDecoration.underline,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(_codeLength, (index) {
                  return SizedBox(
                    width: 56,
                    height: 56,
                    child: TextField(
                      controller: _controllers[index],
                      focusNode: _focusNodes[index],
                      textAlign: TextAlign.center,
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                      decoration: const InputDecoration(counterText: ''),
                      onChanged: (value) {
                        if (value.isNotEmpty && index < _codeLength - 1) {
                          _focusNodes[index + 1].requestFocus();
                        } else if (value.isEmpty && index > 0) {
                          _focusNodes[index - 1].requestFocus();
                        }
                      },
                    ),
                  );
                }),
              ),
              if (widget.isPasswordReset) ...[
                const SizedBox(height: 24),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text('New password', style: Theme.of(context).textTheme.bodyLarge),
                ),
                const SizedBox(height: 8),
                PillTextField(
                  hintText: 'Enter your new password',
                  controller: _newPasswordController,
                  leadingIcon: Icons.lock_outline,
                  obscureText: true,
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text('Confirm password', style: Theme.of(context).textTheme.bodyLarge),
                ),
                const SizedBox(height: 8),
                PillTextField(
                  hintText: 'Confirm your new password',
                  controller: _confirmPasswordController,
                  leadingIcon: Icons.lock_outline,
                  obscureText: true,
                ),
              ],
              const SizedBox(height: 24),
              PrimaryButton(
                label: 'Continue',
                isLoading: _isLoading,
                onPressed: _handleContinue,
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
