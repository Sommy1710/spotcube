import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// App-wide [ThemeData]. Helvetica Neue is the brand's primary typeface
/// (headings, titles, buttons); Montserrat is the secondary typeface used
/// for body copy and hints.
///
/// Helvetica Neue is an Apple system font and can't be legally bundled as
/// an asset, so it only renders natively on iOS/macOS. Everywhere else
/// (Android, web, Windows, Linux) falls back to Arimo, a Google Font that's
/// metrically near-identical to Helvetica/Arial, so the app still looks the
/// same shape across platforms.
class AppTheme {
  AppTheme._();

  static final primaryFontFamily = switch (defaultTargetPlatform) {
    TargetPlatform.iOS || TargetPlatform.macOS => 'Helvetica Neue',
    _ => GoogleFonts.arimo().fontFamily!,
  };
  static final secondaryFontFamily = GoogleFonts.montserrat().fontFamily;

  static ThemeData get light {
    final base = ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        surface: AppColors.background,
      ),
      fontFamily: primaryFontFamily,
    );

    return base.copyWith(
      textTheme: base.textTheme.apply(fontFamily: primaryFontFamily).copyWith(
        headlineMedium: TextStyle(
          fontFamily: primaryFontFamily,
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        headlineSmall: TextStyle(
          fontFamily: primaryFontFamily,
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        titleLarge: TextStyle(
          fontFamily: primaryFontFamily,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        bodyLarge: TextStyle(
          fontFamily: secondaryFontFamily,
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: AppColors.textPrimary,
        ),
        bodyMedium: TextStyle(
          fontFamily: secondaryFontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AppColors.textMuted,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.textPrimary,
          minimumSize: const Size.fromHeight(56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(32),
          ),
          textStyle: TextStyle(
            fontFamily: primaryFontFamily,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
          elevation: 2,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.inputFill,
        hintStyle: TextStyle(
          fontFamily: secondaryFontFamily,
          color: AppColors.textPlaceholder,
          fontSize: 15,
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(32),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(32),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(32),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.textPrimary
              : Colors.transparent,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),
    );
  }
}
