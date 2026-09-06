import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:spotcube/main.dart';

void main() {
  testWidgets('App boots to the splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: SpotCubeApp()));
    await tester.pumpAndSettle();

    expect(find.text('Explore Now'), findsOneWidget);
  });
}
