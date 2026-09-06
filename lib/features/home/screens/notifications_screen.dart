import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

class _NotificationItem {
  const _NotificationItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.time,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final String time;
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  static const _notifications = [
    _NotificationItem(
      icon: Icons.favorite_rounded,
      title: 'New favorite spot',
      subtitle: 'Zayda Lagos was added to your favorites.',
      time: '2h ago',
    ),
    _NotificationItem(
      icon: Icons.local_offer_rounded,
      title: 'Weekend offer',
      subtitle: 'Slice Social House has a new discount for you.',
      time: '5h ago',
    ),
    _NotificationItem(
      icon: Icons.star_rounded,
      title: 'Rate your visit',
      subtitle: 'How was your experience at Chicken Republic?',
      time: '1d ago',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 20, 0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).maybePop(),
                    icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
                  ),
                  const SizedBox(width: 4),
                  Text('Notifications', style: Theme.of(context).textTheme.titleLarge),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                itemCount: _notifications.length,
                separatorBuilder: (_, __) => const SizedBox(height: 14),
                itemBuilder: (context, index) {
                  final item = _notifications[index];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          decoration: const BoxDecoration(
                            color: AppColors.background,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(item.icon, color: AppColors.primary, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title, style: Theme.of(context).textTheme.bodyLarge),
                              const SizedBox(height: 4),
                              Text(
                                item.subtitle,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          item.time,
                          style: const TextStyle(color: AppColors.textPlaceholder, fontSize: 12),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
