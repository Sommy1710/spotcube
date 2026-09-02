import 'package:go_router/go_router.dart';

import '../../data/models/app_user.dart';
import '../../features/auth/screens/auth_entry_screen.dart';
import '../../features/auth/screens/customer_login_screen.dart';
import '../../features/auth/screens/customer_signup_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/auth/screens/login_type_screen.dart';
import '../../features/auth/screens/otp_screen.dart';
import '../../features/auth/screens/signup_type_screen.dart';
import '../../features/auth/screens/spotowner_login_screen.dart';
import '../../features/auth/screens/spotowner_signup_step1_screen.dart';
import '../../features/auth/screens/spotowner_signup_step2_screen.dart';
import '../../features/home/screens/home_shell_screen.dart';
import '../../features/home/screens/notifications_screen.dart';
import '../../features/splash/splash_screen.dart';

abstract class AppRoutes {
  static const splash = '/';
  static const authEntry = '/auth-entry';
  static const loginType = '/login-type';
  static const customerLogin = '/customer-login';
  static const spotOwnerLogin = '/spot-owner-login';
  static const forgotPassword = '/forgot-password';
  static const otp = '/otp';
  static const signupType = '/signup-type';
  static const customerSignup = '/customer-signup';
  static const spotOwnerSignupStep1 = '/spot-owner-signup/step1';
  static const spotOwnerSignupStep2 = '/spot-owner-signup/step2';
  static const home = '/home';
  static const notifications = '/notifications';
}

final appRouter = GoRouter(
  initialLocation: AppRoutes.splash,
  routes: [
    GoRoute(
      path: AppRoutes.splash,
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: AppRoutes.authEntry,
      builder: (context, state) => const AuthEntryScreen(),
    ),
    GoRoute(
      path: AppRoutes.loginType,
      builder: (context, state) => const LoginTypeScreen(),
    ),
    GoRoute(
      path: AppRoutes.customerLogin,
      builder: (context, state) => const CustomerLoginScreen(),
    ),
    GoRoute(
      path: AppRoutes.spotOwnerLogin,
      builder: (context, state) => const SpotOwnerLoginScreen(),
    ),
    GoRoute(
      path: AppRoutes.forgotPassword,
      builder: (context, state) {
        final role =
            state.extra is UserRole
                ? state.extra as UserRole
                : UserRole.customer;
        return ForgotPasswordScreen(role: role);
      },
    ),
    GoRoute(
      path: AppRoutes.otp,
      builder: (context, state) {
        final email = state.uri.queryParameters['email'] ?? '';
        final role =
            state.uri.queryParameters['role'] == 'owner'
                ? UserRole.owner
                : UserRole.customer;
        final isPasswordReset = state.uri.queryParameters['mode'] == 'reset';
        return OtpScreen(email: email, role: role, isPasswordReset: isPasswordReset);
      },
    ),
    GoRoute(
      path: AppRoutes.signupType,
      builder: (context, state) => const SignupTypeScreen(),
    ),
    GoRoute(
      path: AppRoutes.customerSignup,
      builder: (context, state) => const CustomerSignupScreen(),
    ),
    GoRoute(
      path: AppRoutes.spotOwnerSignupStep1,
      builder: (context, state) => const SpotOwnerSignupStep1Screen(),
    ),
    GoRoute(
      path: AppRoutes.spotOwnerSignupStep2,
      builder: (context, state) => const SpotOwnerSignupStep2Screen(),
    ),
    GoRoute(
      path: AppRoutes.home,
      builder: (context, state) => const HomeShellScreen(),
    ),
    GoRoute(
      path: AppRoutes.notifications,
      builder: (context, state) => const NotificationsScreen(),
    ),
  ],
);
