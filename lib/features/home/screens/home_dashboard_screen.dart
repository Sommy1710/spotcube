import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/app_user.dart';
import '../../../data/models/spot.dart';
import '../../../data/repositories/providers.dart';
import '../providers/spot_list_providers.dart';
import '../widgets/spot_filter_sheet.dart';
import '../widgets/spot_nearby_card.dart';
import '../widgets/spot_recent_card.dart';

class HomeDashboardScreen extends ConsumerStatefulWidget {
  const HomeDashboardScreen({super.key});

  @override
  ConsumerState<HomeDashboardScreen> createState() =>
      _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends ConsumerState<HomeDashboardScreen> {
  final _searchController = TextEditingController();
  String _query = '';
  SpotFilterResult _filter = SpotFilterResult.empty;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool get _hasActiveFilter => _filter.tags.isNotEmpty || _filter.minRating > 0;

  List<Spot> _applyFilters(List<Spot> spots) {
    final query = _query.trim().toLowerCase();
    return spots.where((spot) {
      final matchesQuery =
          query.isEmpty ||
          spot.name.toLowerCase().contains(query) ||
          spot.address.toLowerCase().contains(query);
      final matchesTags =
          _filter.tags.isEmpty || spot.tags.any(_filter.tags.contains);
      final matchesRating = spot.rating >= _filter.minRating;
      return matchesQuery && matchesTags && matchesRating;
    }).toList();
  }

  Future<void> _openFilterSheet(List<Spot> allSpots) async {
    final availableTags =
        allSpots.expand((spot) => spot.tags).toSet().toList()..sort();
    final result = await showSpotFilterSheet(
      context: context,
      availableTags: availableTags,
      current: _filter,
    );
    if (result != null) {
      setState(() => _filter = result);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final recentAsync = ref.watch(recentSpotsProvider);
    final nearbyAsync = ref.watch(nearbySpotsProvider);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Hi ${user?.name ?? 'there'},\nWelcome Back!!',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Row(
                children: [
                  IconButton(
                    onPressed: () => _logout(context, ref),
                    icon: const Icon(Icons.logout_rounded, size: 24),
                  ),
                  GestureDetector(
                    onTap: () => context.push(AppRoutes.notifications),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(Icons.notifications_none_rounded, size: 28),
                        Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.badgeDot,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(
                Icons.location_on_outlined,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 4),
              Text(
                user?.location ?? 'Set your location',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (value) => setState(() => _query = value),
                    decoration: InputDecoration(
                      hintText: 'Find new spot',
                      prefixIcon: const Icon(
                        Icons.search,
                        color: AppColors.textMuted,
                      ),
                      suffixIcon:
                          _query.isEmpty
                              ? null
                              : IconButton(
                                icon: const Icon(
                                  Icons.close,
                                  color: AppColors.textMuted,
                                ),
                                onPressed:
                                    () => setState(() {
                                      _searchController.clear();
                                      _query = '';
                                    }),
                              ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap:
                    () => _openFilterSheet([
                      ...recentAsync.value ?? const [],
                      ...nearbyAsync.value ?? const [],
                    ]),
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(26),
                    border:
                        _hasActiveFilter
                            ? Border.all(color: AppColors.primary, width: 2)
                            : null,
                  ),
                  child: Icon(
                    Icons.tune_rounded,
                    color:
                        _hasActiveFilter
                            ? AppColors.primary
                            : AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _SectionHeader(title: 'Recent', onSeeAll: () {}),
          const SizedBox(height: 12),
          recentAsync.when(
            data: (spots) {
              final filtered = _applyFilters(spots);
              if (filtered.isEmpty) {
                return const _EmptyState(
                  message: 'No recent spots match your search.',
                );
              }
              return SizedBox(
                height: 180,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final spot = filtered[index];
                    return SpotRecentCard(
                      spot: spot,
                      onFavoriteToggle:
                          () => ref
                              .read(recentSpotsProvider.notifier)
                              .toggleFavorite(spot.id),
                    );
                  },
                ),
              );
            },
            loading:
                () => const SizedBox(
                  height: 180,
                  child: Center(child: CircularProgressIndicator()),
                ),
            error: (error, _) => Text('Could not load recent spots: $error'),
          ),
          const SizedBox(height: 24),
          _SectionHeader(title: 'Spots Nearby', onSeeAll: () {}),
          const SizedBox(height: 12),
          nearbyAsync.when(
            data: (spots) {
              final filtered = _applyFilters(spots);
              if (filtered.isEmpty) {
                return const _EmptyState(
                  message: 'No spots match your search or filters.',
                );
              }
              return Column(
                children: [
                  for (final spot in filtered) ...[
                    SpotNearbyCard(
                      spot: spot,
                      onFavoriteToggle:
                          () => ref
                              .read(nearbySpotsProvider.notifier)
                              .toggleFavorite(spot.id),
                    ),
                    const SizedBox(height: 20),
                  ],
                ],
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Could not load nearby spots: $error'),
          ),
        ],
      ),
    );
  }

  void _logout(BuildContext context, WidgetRef ref) {
    final role = ref.read(currentUserProvider)?.role ?? UserRole.customer;
    ref.read(authRepositoryProvider).logout(role: role);
    ref.read(currentUserProvider.notifier).state = null;
    context.go(
      role == UserRole.owner
          ? AppRoutes.spotOwnerLogin
          : AppRoutes.customerLogin,
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, required this.onSeeAll});

  final String title;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        GestureDetector(
          onTap: onSeeAll,
          child: Row(
            children: [
              Text('See all', style: Theme.of(context).textTheme.bodyMedium),
              const Icon(
                Icons.arrow_forward,
                size: 16,
                color: AppColors.textMuted,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Text(message, style: const TextStyle(color: AppColors.textMuted)),
    );
  }
}
