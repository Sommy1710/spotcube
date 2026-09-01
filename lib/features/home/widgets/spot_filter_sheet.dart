import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

class SpotFilterResult {
  const SpotFilterResult({required this.tags, required this.minRating});

  final Set<String> tags;
  final double minRating;

  static const empty = SpotFilterResult(tags: {}, minRating: 0);
}

Future<SpotFilterResult?> showSpotFilterSheet({
  required BuildContext context,
  required List<String> availableTags,
  required SpotFilterResult current,
}) {
  return showModalBottomSheet<SpotFilterResult>(
    context: context,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder:
        (context) =>
            _SpotFilterSheet(availableTags: availableTags, current: current),
  );
}

class _SpotFilterSheet extends StatefulWidget {
  const _SpotFilterSheet({required this.availableTags, required this.current});

  final List<String> availableTags;
  final SpotFilterResult current;

  @override
  State<_SpotFilterSheet> createState() => _SpotFilterSheetState();
}

class _SpotFilterSheetState extends State<_SpotFilterSheet> {
  late Set<String> _selectedTags = {...widget.current.tags};
  late double _minRating = widget.current.minRating;

  static const _ratingOptions = [0.0, 4.0, 4.5];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(
          20,
          16,
          20,
          16 + MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.divider,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Filter spots',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                TextButton(
                  onPressed:
                      () => setState(() {
                        _selectedTags = {};
                        _minRating = 0;
                      }),
                  child: const Text(
                    'Clear',
                    style: TextStyle(color: AppColors.linkOrange),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text('Category', style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children:
                  widget.availableTags.map((tag) {
                    final selected = _selectedTags.contains(tag);
                    return ChoiceChip(
                      label: Text(tag),
                      selected: selected,
                      onSelected:
                          (value) => setState(() {
                            if (value) {
                              _selectedTags.add(tag);
                            } else {
                              _selectedTags.remove(tag);
                            }
                          }),
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: selected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                      backgroundColor: AppColors.background,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide.none,
                      ),
                    );
                  }).toList(),
            ),
            const SizedBox(height: 20),
            Text(
              'Minimum rating',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children:
                  _ratingOptions.map((rating) {
                    final selected = _minRating == rating;
                    return ChoiceChip(
                      label: Text(rating == 0 ? 'Any' : '$rating+'),
                      selected: selected,
                      onSelected: (_) => setState(() => _minRating = rating),
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: selected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                      backgroundColor: AppColors.background,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide.none,
                      ),
                    );
                  }).toList(),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed:
                    () => Navigator.of(context).pop(
                      SpotFilterResult(
                        tags: _selectedTags,
                        minRating: _minRating,
                      ),
                    ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(26),
                  ),
                ),
                child: const Text(
                  'Apply filters',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
