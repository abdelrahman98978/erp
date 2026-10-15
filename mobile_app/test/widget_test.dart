import 'package:flutter_test/flutter_test.dart';
import 'package:alsulaim_erp_mobile/main.dart';

void main() {
  testWidgets('Alsulaim ERP Mobile App renders sovereign company portals and enforces tenant isolation', (WidgetTester tester) async {
    await tester.pumpWidget(const AlsulaimErpMobileApp());
    await tester.pump();

    // Verify sovereign company portals render
    expect(find.text('مجموعة خالد السليم'), findsOneWidget);
    expect(find.text('شركة ساف للاستقدام'), findsOneWidget);
    expect(find.text('شركة ياقوت للتشغيل'), findsOneWidget);

    // Verify strict per-company login isolation logic
    final safPortal = kCompanyPortals.firstWhere((p) => p.id == 'SAF');
    final yaqPortal = kCompanyPortals.firstWhere((p) => p.id == 'YAQ');

    final validSaf = TenantAccessValidator.validateCompanyLogin(
      email: 'ahmed@saf-rec.sa',
      targetPortal: safPortal,
    );
    expect(validSaf.allowed, isTrue);

    final crossTenantAttempt = TenantAccessValidator.validateCompanyLogin(
      email: 'ahmed@saf-rec.sa',
      targetPortal: yaqPortal,
    );
    expect(crossTenantAttempt.allowed, isFalse);
    expect(crossTenantAttempt.reason, contains('رفض أمني (عزل الشركات)'));
  });
}
