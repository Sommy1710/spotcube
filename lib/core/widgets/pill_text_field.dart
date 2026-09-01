import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// The rounded, filled text field used across every auth screen in the
/// designs (email, password, spot name, address, etc.).
class PillTextField extends StatelessWidget {
  const PillTextField({
    super.key,
    required this.hintText,
    this.controller,
    this.leadingIcon,
    this.obscureText = false,
    this.keyboardType,
    this.suffixIcon,
    this.maxLines = 1,
    this.readOnly = false,
    this.onTap,
    this.validator,
  });

  final String hintText;
  final TextEditingController? controller;
  final IconData? leadingIcon;
  final bool obscureText;
  final TextInputType? keyboardType;
  final Widget? suffixIcon;
  final int maxLines;
  final bool readOnly;
  final VoidCallback? onTap;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      maxLines: maxLines,
      readOnly: readOnly,
      onTap: onTap,
      validator: validator,
      style: const TextStyle(color: AppColors.textPrimary, fontSize: 15),
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: leadingIcon != null
            ? Icon(leadingIcon, color: AppColors.textMuted, size: 20)
            : null,
        suffixIcon: suffixIcon,
      ),
    );
  }
}
