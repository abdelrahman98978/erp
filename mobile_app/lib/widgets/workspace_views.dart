import 'package:flutter/material.dart';
import '../data/erp_system_data.dart';
import '../theme/erp_tokens.dart';

/// Exact Replica of `src/components/smacc/SmaccDashboardWidget.tsx`
class SmaccDashboardWidgetReplica extends StatefulWidget {
  const SmaccDashboardWidgetReplica({super.key});

  @override
  State<SmaccDashboardWidgetReplica> createState() => _SmaccDashboardWidgetReplicaState();
}

class _SmaccDashboardWidgetReplicaState extends State<SmaccDashboardWidgetReplica> {
  String _periodFilter = 'الأيام الأخيرة';
  static const List<String> _periods = [
    'الأيام الأخيرة',
    'هذا الشهر',
    'الربع الحالي',
    'السنة المالية 2026',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1. Top Banner Header (`SmaccDashboardWidget.tsx` lines 21-51)
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: ErpTokens.cardPricingDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: ErpTokens.primary,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'SMACC',
                      style: TextStyle(
                        color: ErpTokens.onPrimary,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Wrap(
                          spacing: 6,
                          runSpacing: 4,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            const Text(
                              'لوحة التحكم الهيكلية (نظام SMACC للمحاسبة)',
                              style: TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: ErpTokens.ink,
                              ),
                            ),
                            ErpTokens.pillTagMint('مطابق 100%', fontSize: 10),
                          ],
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'الصفحة الرئيسية • متابعة الحركة المالية والأقسام التشغيلية',
                          style: TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFF71717A),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'الفترة الزمنية:',
                    style: TextStyle(fontSize: 11.5, color: Color(0xFF71717A), fontWeight: FontWeight.w600),
                  ),
                  Container(
                    height: 34,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: ErpTokens.canvasLight,
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      border: Border.all(color: ErpTokens.hairlineLight),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _periodFilter,
                        icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: ErpTokens.ink),
                        style: const TextStyle(fontSize: 11.5, color: ErpTokens.ink, fontWeight: FontWeight.w600),
                        items: _periods
                            .map((p) => DropdownMenuItem<String>(
                                  value: p,
                                  child: Text(p),
                                ))
                            .toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _periodFilter = val);
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 2. Top 3 Stat Counter Cards (`SmaccDashboardWidget.tsx` lines 54-87)
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: ErpTokens.cardPricingDecoration(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Text(
                            'عدد البائعين',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF71717A)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          width: 30,
                          height: 30,
                          decoration: const BoxDecoration(color: ErpTokens.primary, shape: BoxShape.circle),
                          child: const Icon(Icons.people_outline_rounded, size: 15, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      '2',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.w300, color: ErpTokens.ink),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: ErpTokens.cardPistachioDecoration(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Text(
                            'عدد العملاء',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.black12),
                          ),
                          child: const Icon(Icons.verified_user_outlined, size: 15, color: ErpTokens.ink),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      '4',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.w300, color: ErpTokens.ink),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: ErpTokens.cardPricingDecoration(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Text(
                            'محصلين المبيعات',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF71717A)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF4F4F5),
                            shape: BoxShape.circle,
                            border: Border.all(color: ErpTokens.hairlineLight),
                          ),
                          child: const Icon(Icons.credit_card_rounded, size: 15, color: ErpTokens.ink),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      '1',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.w300, color: ErpTokens.ink),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // 3. Financial Movement Boxes (`مدفوعات` & `ايصالات استلام`)
        _buildSmaccMovementBox(
          title: 'مدفوعات (Payment Summary)',
          period: _periodFilter,
          isMintBadge: false,
          items: const [
            MapEntry('إجمالي الدفعات', '0.00 ر.س'),
            MapEntry('المدفوعات النقدية', '0.00 ر.س'),
            MapEntry('مدفوعات الشيك', '0.00 ر.س'),
            MapEntry('الدفعات المحولة', '0.00 ر.س'),
          ],
          emptyCaption: 'السجل غير موجود (جاهز لاستقبال سندات الصرف الجديدة)',
        ),
        const SizedBox(height: 12),
        _buildSmaccMovementBox(
          title: 'ايصالات استلام (Receipt Vouchers)',
          period: _periodFilter,
          isMintBadge: true,
          items: const [
            MapEntry('إجمالي الايصالات', '0.00 ر.س'),
            MapEntry('سند استلام نقدي', '0.00 ر.س'),
            MapEntry('ايصالات الشيك', '0.00 ر.س'),
            MapEntry('الايصالات المحولة', '0.00 ر.س'),
          ],
          emptyCaption: 'السجل غير موجود (جاهز لاستقبال سندات القبض والإيداعات)',
        ),
      ],
    );
  }

  Widget _buildSmaccMovementBox({
    required String title,
    required String period,
    required bool isMintBadge,
    required List<MapEntry<String, String>> items,
    required String emptyCaption,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: ErpTokens.cardPricingDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(color: ErpTokens.primary, shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                  ),
                ],
              ),
              isMintBadge
                  ? ErpTokens.pillTagMint(period, fontSize: 10)
                  : ErpTokens.pillTagShade(period, fontSize: 10),
            ],
          ),
          const Divider(height: 20, color: ErpTokens.hairlineLight),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            childAspectRatio: 2.55,
            children: items
                .map(
                  (entry) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: ErpTokens.surfaceSubtle,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: ErpTokens.hairlineLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          entry.key,
                          style: const TextStyle(fontSize: 10.5, color: Color(0xFF71717A)),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          entry.value,
                          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                        ),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 9, horizontal: 12),
            decoration: BoxDecoration(
              color: ErpTokens.surfaceSubtle,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: ErpTokens.hairlineLight),
            ),
            alignment: Alignment.center,
            child: Text(
              emptyCaption,
              style: const TextStyle(fontSize: 11, color: Color(0xFF71717A)),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

/// Exact Replica of `src/pages/DashboardPage.tsx`
class DashboardViewReplica extends StatefulWidget {
  final SystemPortalOption activePortal;
  final String currentUserName;
  final String currentUserRole;
  final List<ErpOperationalRecord> records;
  final void Function(String href, String title) onNavigate;
  final VoidCallback onOpenAddRecordModal;

  const DashboardViewReplica({
    super.key,
    required this.activePortal,
    required this.currentUserName,
    required this.currentUserRole,
    required this.records,
    required this.onNavigate,
    required this.onOpenAddRecordModal,
  });

  @override
  State<DashboardViewReplica> createState() => _DashboardViewReplicaState();
}

class _DashboardViewReplicaState extends State<DashboardViewReplica> {
  String _selectedPeriod = 'today'; // 'today' | 'week' | 'month' | 'all'

  int _scaleByPeriod(int base) {
    switch (_selectedPeriod) {
      case 'today':
        return base;
      case 'week':
        return (base * 1.4).round();
      case 'month':
        return (base * 2.1).round();
      default:
        return (base * 3.0).round();
    }
  }

  @override
  Widget build(BuildContext context) {
    final totalContracts = _scaleByPeriod(115);
    final totalOrders = _scaleByPeriod(42);
    final totalRent = _scaleByPeriod(24);
    final totalCvs = _scaleByPeriod(86);
    final totalClients = _scaleByPeriod(142);
    final totalShelter = _scaleByPeriod(44);
    final totalComplaints = _scaleByPeriod(8);
    final totalTransfers = _scaleByPeriod(17);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1. SMACC Structural Dashboard Replica (`<SmaccDashboardWidget />` at top of `DashboardPage.tsx`)
        const SmaccDashboardWidgetReplica(),
        const SizedBox(height: 16),

        // 2. Top Welcome Hero Banner with Period Filter (`card-feature-cinematic` in `DashboardPage.tsx` lines 164-302)
        Container(
          padding: const EdgeInsets.all(20),
          decoration: ErpTokens.cardFeatureCinematicDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.14),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.apartment_rounded, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            ErpTokens.pillTagMint('مؤشرات فورية', fontSize: 10.5),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: ErpTokens.champagneGold,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 5),
                                const Text(
                                  'محدث الآن - آخر تحديث اليوم',
                                  style: TextStyle(fontSize: 11, color: Color(0xFFA1A1AA)),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'مرحباً مجموعة خالد السليم 👋',
                          style: TextStyle(
                            fontSize: 21,
                            fontWeight: FontWeight.w400,
                            color: Colors.white,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'تابع أداء العقود والطلبات والإيرادات لحظة بلحظة مع إمكانية التحكم الكامل في الأقسام والعمليات التشغيلية.',
                          style: TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFFA1A1AA),
                            height: 1.45,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Quick Action Navigation Pills (`DashboardPage.tsx` lines 211-248)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  InkWell(
                    onTap: widget.onOpenAddRecordModal,
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.add_rounded, size: 15, color: ErpTokens.ink),
                          SizedBox(width: 4),
                          Text(
                            'عقد جديد',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                          ),
                        ],
                      ),
                    ),
                  ),
                  _buildOutlineOnDarkPill(
                    label: 'الطلبات المباشرة',
                    onTap: () => widget.onNavigate('orders', 'الطلبات المباشرة'),
                  ),
                  _buildOutlineOnDarkPill(
                    label: 'إدارة الفرق',
                    onTap: () => widget.onNavigate('employees', 'سجل الموظفين والكادر الوظيفي'),
                  ),
                  _buildOutlineOnDarkPill(
                    label: 'التقارير',
                    onTap: () => widget.onNavigate('reports', 'مركز التقارير'),
                  ),
                  _buildOutlineOnDarkPill(
                    label: 'المالية',
                    onTap: () => widget.onNavigate('finance-home', 'لوحة التحكم المالية'),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(color: Colors.white12, height: 1),
              const SizedBox(height: 12),

              // Live Period Filter Buttons & Today Sub-cards (`DashboardPage.tsx` lines 252-301)
              Wrap(
                spacing: 10,
                runSpacing: 10,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildPeriodTab('today', 'اليوم'),
                        _buildPeriodTab('week', 'هذا الأسبوع'),
                        _buildPeriodTab('month', 'هذا الشهر'),
                        _buildPeriodTab('all', 'الإجمالي'),
                      ],
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.description_outlined, size: 14, color: ErpTokens.goldLight),
                            const SizedBox(width: 5),
                            const Text('عقود اليوم: ', style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600)),
                            Text(
                              '${(totalContracts / 12).ceil()}',
                              style: const TextStyle(fontSize: 11.5, color: ErpTokens.goldLight, fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.shopping_bag_outlined, size: 14, color: Color(0xFF93C5FD)),
                            const SizedBox(width: 5),
                            const Text('طلبات اليوم: ', style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600)),
                            Text(
                              '${(totalOrders / 8).ceil()}',
                              style: const TextStyle(fontSize: 11.5, color: Color(0xFF93C5FD), fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 3. IAM Multi-Entity Access Scope HUD (`DashboardPage.tsx` lines 305-335)
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: ErpTokens.charcoalDark,
            borderRadius: BorderRadius.circular(ErpTokens.radiusLg),
            border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.35)),
            boxShadow: ErpTokens.elevation3Shadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: ErpTokens.champagneGold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.4)),
                    ),
                    child: const Icon(Icons.verified_user_rounded, color: ErpTokens.goldLight, size: 19),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Wrap(
                          spacing: 6,
                          runSpacing: 4,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            Text(
                              'جلسة الوصول المعتمدة: ${widget.currentUserName} (${widget.currentUserRole})',
                              style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: ErpTokens.champagneGold,
                                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              ),
                              child: Text(
                                '${widget.activePortal.companyId == 'all' ? 'GRP' : widget.activePortal.companyId}: ${widget.activePortal.nameAr}',
                                style: const TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w800,
                                  color: ErpTokens.charcoalDark,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'نطاق البيانات التشغيلي: Level 1 — عزل كامل للشركة • الفروع المصرح بها: [الكل] • نظام العزل: فعال ومفعل 100%',
                          style: TextStyle(fontSize: 10.5, color: Color(0xFFD4D4D8)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Align(
                alignment: AlignmentDirectional.centerEnd,
                child: _buildOutlineOnDarkPill(
                  label: '🔒 مصفوفة الصلاحيات (IAM)',
                  onTap: () => widget.onNavigate('iam-matrix', 'مصفوفة الصلاحيات والعزل السيادي'),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 4. Quick Navigation 3-Card Portal Hub (`DashboardPage.tsx` lines 338-389)
        _buildQuickPortalCard(
          icon: Icons.home_work_outlined,
          iconColor: ErpTokens.ink,
          title: 'إدارة الإيواء',
          subtitle: 'الداخل والخارج والجاهز للنقل ومرحلة الترحيل',
          onTap: () => widget.onNavigate('shelter-suite', 'إدارة الإيواء والتسكين'),
        ),
        const SizedBox(height: 10),
        _buildQuickPortalCard(
          icon: Icons.attach_money_rounded,
          iconColor: const Color(0xFF047857),
          title: 'لوحة التحكم المالية',
          subtitle: 'ملخص الحسابات والفواتير والحركات المالية',
          onTap: () => widget.onNavigate('finance-home', 'لوحة التحكم المالية'),
        ),
        const SizedBox(height: 10),
        _buildQuickPortalCard(
          icon: Icons.pie_chart_outline_rounded,
          iconColor: ErpTokens.ink,
          title: 'مركز التقارير',
          subtitle: 'تقارير العقود والطلبات والإيواء والتصدير',
          onTap: () => widget.onNavigate('reports', 'مركز التقارير الموحدة'),
        ),
        const SizedBox(height: 16),

        // 5. Main KPI Metrics Cards Grid (`DashboardPage.tsx` lines 392-580)
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 1.22,
          children: [
            _buildKpiMetricCard(
              title: 'جميع عقود الاستقدام',
              value: '$totalContracts',
              icon: Icons.handshake_outlined,
              progress: 0.76,
              progressColor: ErpTokens.ink,
              footerText: 'قبل الوصول: 18 | وصول: 7 | ضمان: 27',
              onTap: () => widget.onNavigate('recruitment-contracts', 'عقود الاستقدام الموثقة (مساند)'),
            ),
            _buildKpiMetricCard(
              title: 'طلبات الاستقدام',
              value: '$totalOrders',
              icon: Icons.shopping_cart_outlined,
              progress: 0.82,
              progressColor: const Color(0xFF059669),
              footerText: 'جديدة: 12 | إجراء: 18 | مكتملة: 12',
              onTap: () => widget.onNavigate('orders', 'طلبات الاستقدام والحجوزات'),
            ),
            _buildKpiMetricCard(
              title: 'عقود الإيجار',
              value: '$totalRent',
              icon: Icons.fact_check_outlined,
              progress: 0.55,
              progressColor: ErpTokens.ink,
              footerText: 'نشطة: 16 | مرسلة: 6 | مكتملة: 8',
              onTap: () => widget.onNavigate('rent-contracts', 'عقود التأجير والتشغيل المرن'),
            ),
            _buildKpiMetricCard(
              title: 'السير الذاتية (CVs)',
              value: '$totalCvs',
              icon: Icons.badge_outlined,
              progress: 0.68,
              progressColor: ErpTokens.champagneGold,
              footerText: 'متاحة: 54 | محجوزة: 32',
              onTap: () => widget.onNavigate('cvs-recruitment', 'بنك السير الذاتية (CVs)'),
            ),
            _buildKpiMetricCard(
              title: 'العملاء المسجلين',
              value: '$totalClients',
              icon: Icons.people_outline_rounded,
              progress: 0.88,
              progressColor: const Color(0xFF0284C7),
              footerText: 'نشط: 128 | بطلبات سارية: 99',
              onTap: () => widget.onNavigate('clients', 'إدارة علاقات العملاء (CRM)'),
            ),
            _buildKpiMetricCard(
              title: 'دار الإيواء والتسكين',
              value: '$totalShelter',
              icon: Icons.hotel_outlined,
              progress: 0.72,
              progressColor: const Color(0xFF0D9488),
              footerText: 'داخل الإيواء: 39 | خارج: 5',
              onTap: () => widget.onNavigate('shelter-suite', 'منظومة مراكز الإيواء والتسكين'),
            ),
            _buildKpiMetricCard(
              title: 'الشكاوى والتذاكر',
              value: '$totalComplaints',
              icon: Icons.headset_mic_outlined,
              progress: 0.40,
              progressColor: const Color(0xFFD97706),
              footerText: 'مفتوحة: 3 | محلولة: 5',
              onTap: () => widget.onNavigate('complaints', 'إدارة الشكاوى والنزاعات'),
            ),
            _buildKpiMetricCard(
              title: 'نقل الكفالة والتنازل',
              value: '$totalTransfers',
              icon: Icons.sync_alt_rounded,
              progress: 0.64,
              progressColor: ErpTokens.ink,
              footerText: 'تحت التجربة: 5 | مكتملة: 12',
              onTap: () => widget.onNavigate('sponsorship-transfer', 'نقل الكفالة والتنازل'),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // 6. Recent Tenant-Scoped Operational Records Table Card (`.table-card` in `components.css`)
        Container(
          decoration: ErpTokens.cardPricingDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.bolt_rounded, size: 18, color: ErpTokens.goldDark),
                        const SizedBox(width: 6),
                        Text(
                          'أحدث العمليات المعزولة (${widget.activePortal.companyId == 'all' ? 'جميع الشركات' : widget.activePortal.companyId})',
                          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                        ),
                      ],
                    ),
                    ErpTokens.pillTagMint('${widget.records.length} سجل نشط', fontSize: 10),
                  ],
                ),
              ),
              const Divider(height: 1, color: ErpTokens.hairlineLight),
              ...widget.records.map(
                (rec) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: const BoxDecoration(
                    border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              rec.title,
                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                            ),
                          ),
                          const SizedBox(width: 8),
                          ErpTokens.pillTagMint(rec.badgeText, fontSize: 10),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        rec.subtitle,
                        style: const TextStyle(fontSize: 11, color: ErpTokens.shade50, height: 1.35),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'الحالة: ${rec.status}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF047857)),
                          ),
                          Text(
                            '${rec.amountOrMetric} • ${rec.updatedAt}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOutlineOnDarkPill({required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
          border: Border.all(color: Colors.white24),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildPeriodTab(String key, String label) {
    final isSelected = _selectedPeriod == key;
    return GestureDetector(
      onTap: () => setState(() => _selectedPeriod = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? ErpTokens.ink : Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildQuickPortalCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(ErpTokens.radiusLg),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: ErpTokens.cardPricingDecoration(),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: ErpTokens.surfaceSubtle,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: ErpTokens.hairlineLight),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF71717A)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_back_ios_new_rounded, size: 14, color: Color(0xFFA1A1AA)),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiMetricCard({
    required String title,
    required String value,
    required IconData icon,
    required double progress,
    required Color progressColor,
    required String footerText,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(ErpTokens.radiusLg),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: ErpTokens.cardPricingDecoration(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Color(0xFF71717A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4F4F5),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, size: 15, color: ErpTokens.ink),
                ),
              ],
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 23, fontWeight: FontWeight.w900, color: ErpTokens.ink),
            ),
            ClipRRect(
              borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 4,
                backgroundColor: const Color(0xFFF4F4F5),
                valueColor: AlwaysStoppedAnimation<Color>(progressColor),
              ),
            ),
            Text(
              footerText,
              style: const TextStyle(fontSize: 9.8, color: Color(0xFF71717A), fontWeight: FontWeight.w600),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

/// Dedicated Interactive Module Page View inside `AppShell` (matches `.table-card`, `.stat-card`, `.btn-odoo-primary`)
class EnterpriseModuleWorkspaceView extends StatefulWidget {
  final String activeTab;
  final String activeTabTitle;
  final SystemPortalOption activePortal;
  final List<ErpOperationalRecord> records;
  final VoidCallback onAddRecord;
  final VoidCallback onTriggerInstantNotification;
  final VoidCallback onScheduleBackgroundNotification;
  final void Function(String href, String title) onNavigate;

  const EnterpriseModuleWorkspaceView({
    super.key,
    required this.activeTab,
    required this.activeTabTitle,
    required this.activePortal,
    required this.records,
    required this.onAddRecord,
    required this.onTriggerInstantNotification,
    required this.onScheduleBackgroundNotification,
    required this.onNavigate,
  });

  @override
  State<EnterpriseModuleWorkspaceView> createState() => _EnterpriseModuleWorkspaceViewState();
}

class _EnterpriseModuleWorkspaceViewState extends State<EnterpriseModuleWorkspaceView> {
  String _searchQuery = '';
  String _statusFilter = 'الكل';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.records.where((r) {
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.trim().toLowerCase();
        return r.title.toLowerCase().contains(q) ||
            r.subtitle.toLowerCase().contains(q) ||
            r.id.toLowerCase().contains(q);
      }
      return true;
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Module Cinematic Header Banner
        Container(
          padding: const EdgeInsets.all(18),
          decoration: ErpTokens.cardFeatureCinematicDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ErpTokens.pillTagMint(
                    'كيان معزول: ${widget.activePortal.companyId == 'all' ? 'GRP-ALL' : widget.activePortal.companyId}',
                    icon: Icons.verified_user_rounded,
                    fontSize: 10.5,
                  ),
                  Text(
                    widget.activePortal.license,
                    style: const TextStyle(fontSize: 10, color: ErpTokens.goldLight, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                widget.activeTabTitle,
                style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w700, color: Colors.white),
              ),
              const SizedBox(height: 4),
              Text(
                'إدارة ومعالجة سجلات ${widget.activeTabTitle} ضمن بيئة ${widget.activePortal.nameAr} المعزولة مع المزامنة اللحظية وإشعارات الهاتف الأصلية.',
                style: const TextStyle(fontSize: 11.5, color: Color(0xFFA1A1AA), height: 1.4),
              ),
              const SizedBox(height: 14),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  InkWell(
                    onTap: widget.onAddRecord,
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.add_circle_outline_rounded, size: 15, color: ErpTokens.ink),
                          SizedBox(width: 5),
                          Text(
                            'إضافة سجل جديد + إشعار فوري',
                            style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                          ),
                        ],
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: widget.onScheduleBackgroundNotification,
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: ErpTokens.champagneGold.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                        border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.5)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.notifications_active_rounded, size: 14, color: ErpTokens.goldLight),
                          SizedBox(width: 5),
                          Text(
                            'تجربة إشعار بالخلفية (5 ثوانٍ)',
                            style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: ErpTokens.goldLight),
                          ),
                        ],
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () => widget.onNavigate('dashboard', 'الرئيسية والمؤشرات التشغيلية'),
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white10,
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: const Text(
                        'العودة للرئيسية',
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Search & Filter Bar inside `.table-card`
        Container(
          padding: const EdgeInsets.all(14),
          decoration: ErpTokens.cardPricingDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                onChanged: (v) => setState(() => _searchQuery = v),
                style: const TextStyle(fontSize: 13, color: ErpTokens.ink),
                decoration: InputDecoration(
                  hintText: 'ابحث برقم المرجع، اسم العميل، أو الحالة في ${widget.activeTabTitle}...',
                  hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF71717A)),
                  prefixIcon: const Icon(Icons.search_rounded, size: 18, color: Color(0xFF71717A)),
                  filled: true,
                  fillColor: ErpTokens.surfaceSubtle,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    borderSide: const BorderSide(color: ErpTokens.hairlineLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    borderSide: const BorderSide(color: ErpTokens.hairlineLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    borderSide: const BorderSide(color: ErpTokens.ink, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: ['الكل', 'ساري / نشط', 'تحت الضمان', 'مكتمل / موثق ZATCA'].map((status) {
                    final active = _statusFilter == status;
                    return Padding(
                      padding: const EdgeInsetsDirectional.only(end: 6),
                      child: ChoiceChip(
                        label: Text(status),
                        selected: active,
                        onSelected: (_) => setState(() => _statusFilter = status),
                        selectedColor: ErpTokens.primary,
                        backgroundColor: ErpTokens.surfaceSubtle,
                        labelStyle: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: active ? Colors.white : ErpTokens.ink,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                          side: BorderSide(color: active ? ErpTokens.primary : ErpTokens.hairlineLight),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Records Table Card (`.table-card` in `components.css`)
        Container(
          decoration: ErpTokens.cardPricingDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'سجلات ${widget.activeTabTitle}',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                    ),
                    ErpTokens.pillTagMint('${filtered.length} سجل مطابق', fontSize: 10.5),
                  ],
                ),
              ),
              const Divider(height: 1, color: ErpTokens.hairlineLight),
              if (filtered.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(28),
                  child: Center(
                    child: Text(
                      'لا توجد سجلات مطابقة لمعايير البحث الحالية.',
                      style: TextStyle(fontSize: 12.5, color: Color(0xFF71717A)),
                    ),
                  ),
                )
              else
                ...filtered.map(
                  (rec) => Container(
                    padding: const EdgeInsets.all(16),
                    decoration: const BoxDecoration(
                      border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF4F4F5),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '#${rec.id}',
                                style: const TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w800,
                                  color: ErpTokens.ink,
                                ),
                              ),
                            ),
                            ErpTokens.pillTagMint(rec.badgeText, fontSize: 10),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          rec.title,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          rec.subtitle,
                          style: const TextStyle(fontSize: 11.5, color: ErpTokens.shade50, height: 1.4),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: ErpTokens.statusSuccessBg,
                                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                                border: Border.all(color: ErpTokens.statusSuccessBorder),
                              ),
                              child: Text(
                                rec.status,
                                style: const TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF065F46),
                                ),
                              ),
                            ),
                            Text(
                              rec.amountOrMetric,
                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
