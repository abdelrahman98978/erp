import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'data/erp_system_data.dart';
import 'theme/erp_tokens.dart';
import 'widgets/workspace_views.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: ErpTokens.canvasLight,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const AlsulaimErpMobileApp());
}

class ErpNotificationItem {
  final String id;
  final String title;
  final String message;
  final String timestamp;
  final String companyCode;
  final String tabKey;
  final String tabTitle;
  bool read;

  ErpNotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.companyCode,
    this.tabKey = 'dashboard',
    this.tabTitle = 'الرئيسية والمؤشرات التشغيلية',
    this.read = false,
  });
}

class OfflineQueueAction {
  final String id;
  final String actionType;
  final String description;
  final String companyCode;
  final String createdAt;

  const OfflineQueueAction({
    required this.id,
    required this.actionType,
    required this.description,
    required this.companyCode,
    required this.createdAt,
  });
}

class AlsulaimErpMobileApp extends StatelessWidget {
  const AlsulaimErpMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'مجموعة خالد السليم ERP',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: ErpTokens.canvasCream,
        colorScheme: ColorScheme.fromSeed(
          seedColor: ErpTokens.champagneGold,
          primary: ErpTokens.primary,
          secondary: ErpTokens.champagneGold,
          surface: ErpTokens.canvasLight,
        ),
        fontFamily: 'Roboto',
      ),
      builder: (context, child) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: const ErpMasterFlowHost(),
    );
  }
}

/// Exact 4-Stage Flow Host matching `src/App.tsx` (`landing` -> `login` -> `launcher` -> `workspace`)
class ErpMasterFlowHost extends StatefulWidget {
  const ErpMasterFlowHost({super.key});

  @override
  State<ErpMasterFlowHost> createState() => _ErpMasterFlowHostState();
}

class _ErpMasterFlowHostState extends State<ErpMasterFlowHost> with WidgetsBindingObserver {
  static const MethodChannel _nativeChannel = MethodChannel('sa.alsulaim.erp/native_mobile');
  final GlobalKey<ScaffoldState> _workspaceScaffoldKey = GlobalKey<ScaffoldState>();

  // 1. Flow State (`landing` | `login` | `launcher` | `workspace`)
  String _flowState = 'landing';
  SystemPortalOption _selectedPortal = ErpSystemData.systemPortals.first;
  String _activeTab = 'dashboard';
  String _activeTabTitle = 'الرئيسية والمؤشرات التشغيلية';
  ErpBranchOption _selectedBranch = ErpSystemData.branches.first;

  // 2. Assistant Persona (`faris` | `noura`) & Mood (`😊`)
  String _persona = 'faris';
  String _userMoodEmoji = '😊';

  // 3. Auth Form State (`LoginPage.tsx`)
  String _authMode = 'signin'; // 'signin' | 'register'
  bool _portalSwitcherExpanded = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;
  String? _authError;
  String _authenticatedUserName = 'م. سلطان خالد السليم';
  String _authenticatedUserRole = 'مدير عمليات الاستقدام ومساند';

  // 3-Step Registration Wizard State (`LoginPage.tsx`)
  int _regStep = 1; // 1..3
  String _regAccountType = 'client'; // 'client' | 'employee' | 'agency'
  final TextEditingController _regFullNameController = TextEditingController();
  final TextEditingController _regNationalIdController = TextEditingController();
  final TextEditingController _regPhoneController = TextEditingController();
  final TextEditingController _regEmailController = TextEditingController();
  final TextEditingController _regPasswordController = TextEditingController();
  String? _regReferenceNumber;

  // 4. AppLauncher & Sidebar State
  String _launcherCategory = 'all';
  String _launcherSearch = '';
  String _sidebarSearch = '';
  final Map<String, bool> _expandedSidebarGroups = {
    'crm-section': true,
    'operations-section': true,
    'hr-section': false,
    'finance-section': true,
    'governance-section': true,
  };

  // 5. Native Mobile Notifications, Background Execution & Offline Queue
  bool _bgServiceRunning = true;
  bool _wakeLockEnabled = false;
  bool _simulatedOfflineMode = false;
  int _heartbeatCount = 1;
  String _lastSyncTime = 'الآن';
  Timer? _uiPoller;

  late List<ErpOperationalRecord> _allRecords;
  final List<ErpNotificationItem> _notifications = [];
  final List<OfflineQueueAction> _offlineQueue = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _allRecords = List<ErpOperationalRecord>.from(ErpSystemData.buildInitialRecords());
    _applyPortalDefaults(_selectedPortal);
    _seedInitialNotifications(_selectedPortal);
    _initializeNativeMobileEngine();

    _uiPoller = Timer.periodic(const Duration(seconds: 6), (_) {
      _refreshBackgroundStatus();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _uiPoller?.cancel();
    _emailController.dispose();
    _passwordController.dispose();
    _regFullNameController.dispose();
    _regNationalIdController.dispose();
    _regPhoneController.dispose();
    _regEmailController.dispose();
    _regPasswordController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _refreshBackgroundStatus();
      if (!_simulatedOfflineMode && _offlineQueue.isNotEmpty) {
        _flushOfflineQueue(reason: 'استعادة التطبيق من الخلفية');
      }
    }
  }

  void _applyPortalDefaults(SystemPortalOption portal) {
    _emailController.text = portal.demoEmail;
    _passwordController.text = 'Alsulaim@2026';
    _authError = null;
  }

  void _seedInitialNotifications(SystemPortalOption portal) {
    final co = portal.companyId == 'all' ? 'GRP' : portal.companyId;
    _notifications
      ..clear()
      ..addAll([
        ErpNotificationItem(
          id: 'NTF-101',
          title: 'توثيق عقد استقدام مساند #MSN-8841',
          message: 'تم ربط وتوثيق العقد إلكترونياً وتفعيل ضمان الـ 90 يوماً في [$co].',
          timestamp: 'منذ دقيقتين',
          companyCode: co,
          tabKey: 'recruitment-contracts',
          tabTitle: 'عقود الاستقدام الموثقة (مساند)',
        ),
        ErpNotificationItem(
          id: 'NTF-102',
          title: 'اعتماد فاتورة ZATCA المرحلة الثانية',
          message: 'تم التوقيع التشفيري ECDSA وربط الهاش التسلسلي PIH بنجاح.',
          timestamp: 'منذ 10 دقائق',
          companyCode: co,
          tabKey: 'zatca',
          tabTitle: 'الفاتورة الإلكترونية ZATCA المرحلة 2',
        ),
      ]);
  }

  Future<void> _initializeNativeMobileEngine() async {
    try {
      await _nativeChannel.invokeMethod('requestNotificationPermission');
      await _nativeChannel.invokeMethod('startBackgroundService', {
        'companyName': _selectedPortal.nameAr,
      });
      await _refreshBackgroundStatus();
    } catch (_) {
      // Safe fallback in widget tests
    }
  }

  Future<void> _refreshBackgroundStatus() async {
    try {
      final res = await _nativeChannel.invokeMethod<Map<dynamic, dynamic>>('getBackgroundServiceStatus');
      if (res != null && mounted) {
        setState(() {
          _bgServiceRunning = (res['isRunning'] as bool?) ?? _bgServiceRunning;
          final hb = (res['heartbeatCount'] as int?) ?? _heartbeatCount;
          if (hb > 0) _heartbeatCount = hb;
          final ts = (res['lastSyncTimestamp'] as String?) ?? '';
          if (ts.isNotEmpty) _lastSyncTime = ts;
        });
      }
    } catch (_) {}
  }

  Future<void> _triggerInstantNativeNotification({
    String? customTitle,
    String? customBody,
    String tabKey = 'dashboard',
    String tabTitle = 'الرئيسية والمؤشرات التشغيلية',
  }) async {
    final co = _selectedPortal.companyId == 'all' ? 'GRP' : _selectedPortal.companyId;
    final title = customTitle ?? 'تنبيه فوري — ${_selectedPortal.nameAr}';
    final body = customBody ??
        'تم تنفيذ العملية بنجاح وتحديث السجلات السحابية للكيان [$co] في الخلفية.';

    setState(() {
      _notifications.insert(
        0,
        ErpNotificationItem(
          id: 'NTF-${DateTime.now().millisecondsSinceEpoch}',
          title: title,
          message: body,
          timestamp: 'الآن',
          companyCode: co,
          tabKey: tabKey,
          tabTitle: tabTitle,
        ),
      );
    });

    try {
      await _nativeChannel.invokeMethod('showSystemNotification', {
        'title': title,
        'body': body,
        'companyName': _selectedPortal.nameAr,
      });
    } catch (_) {}

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: ErpTokens.primary,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        content: Text('🔔 $title', style: const TextStyle(color: Colors.white, fontSize: 12.5)),
      ),
    );
  }

  Future<void> _scheduleBackgroundNotification5s() async {
    final co = _selectedPortal.companyId == 'all' ? 'GRP' : _selectedPortal.companyId;
    final title = 'إشعار خلفي مجدول — ${_selectedPortal.nameAr}';
    final body = 'تم تنفيذ المزامنة الخلفية للكيان [$co] حتى مع إغلاق الشاشة.';

    try {
      await _nativeChannel.invokeMethod('scheduleBackgroundNotification', {
        'delayMs': 5000,
        'title': title,
        'body': body,
        'companyName': _selectedPortal.nameAr,
      });
    } catch (_) {}

    Future.delayed(const Duration(seconds: 5), () {
      if (!mounted) return;
      setState(() {
        _notifications.insert(
          0,
          ErpNotificationItem(
            id: 'NTF-BG-${DateTime.now().millisecondsSinceEpoch}',
            title: title,
            message: body,
            timestamp: 'الآن (خلفي)',
            companyCode: co,
          ),
        );
      });
    });

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: ErpTokens.charcoalDark,
        behavior: SnackBarBehavior.floating,
        content: Text(
          '⏳ تم جدولة إشعار بعد 5 ثوانٍ — يمكنك قفل الشاشة أو الخروج للتحقق من وصوله!',
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      ),
    );
  }

  Future<void> _flushOfflineQueue({required String reason}) async {
    if (_offlineQueue.isEmpty) return;
    final count = _offlineQueue.length;
    setState(() {
      _offlineQueue.clear();
      _heartbeatCount += 1;
      _lastSyncTime = 'الآن';
    });
    await _triggerInstantNativeNotification(
      customTitle: 'اكتملت مزامنة طابور الأوفلاين ($count عمليات)',
      customBody: 'تم ترحيل العمليات المعلقة ($reason) للكيان [${_selectedPortal.companyId}].',
    );
  }

  int get _unreadCount => _notifications.where((n) => !n.read).length;

  List<ErpOperationalRecord> get _scopedRecords {
    final co = _selectedPortal.companyId;
    if (co == 'all') return _allRecords;
    final matching = _allRecords.where((r) => r.companyId == co).toList();
    return matching.isNotEmpty ? matching : _allRecords.take(3).toList();
  }

  // Navigation & Portal Isolation Handlers
  void _navigateToCompanyLogin(String rawCode) {
    final resolved = ErpSystemData.resolvePortalByCode(rawCode);
    setState(() {
      _selectedPortal = resolved;
      _applyPortalDefaults(resolved);
      _flowState = 'login';
      _authMode = 'signin';
      _portalSwitcherExpanded = false;
    });
  }

  void _handleSignIn() {
    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text.trim();

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _authError = 'يرجى إدخال البريد الإلكتروني المؤسسي بشكل صحيح.');
      return;
    }
    if (password.length < 4) {
      setState(() => _authError = 'يرجى إدخال كلمة المرور المعتمدة.');
      return;
    }

    // Strict Cross-Company Tenant Isolation Check (`validateCompanyAccess` in `authService.ts`)
    final otherPortal = ErpSystemData.mainSubsidiaryCompanies.where(
      (p) =>
          p.companyId != _selectedPortal.companyId &&
          _selectedPortal.companyId != 'all' &&
          email.endsWith('@${p.emailDomain}'),
    );
    if (otherPortal.isNotEmpty) {
      final other = otherPortal.first;
      setState(() {
        _authError =
            'عذراً، هذا الحساب يتبع (${other.nameAr} - @${other.emailDomain}) ولا يمكنه الدخول عبر بوابة (${_selectedPortal.nameAr}) المعزولة.';
      });
      return;
    }

    setState(() {
      _authError = null;
      _authenticatedUserName = _selectedPortal.demoEmployeeName;
      _authenticatedUserRole = _selectedPortal.demoRole;
      _activeTab = _selectedPortal.targetTab;
      _activeTabTitle = _selectedPortal.targetTitle;
      _seedInitialNotifications(_selectedPortal);
      _flowState = 'workspace';
    });

    _initializeNativeMobileEngine();
  }

  void _handleSelectTab(String href, String title) {
    if (href == 'logout') {
      _handleLogout();
      return;
    }

    // Strict KAS Exclusive Guard (`App.tsx` lines 217-222)
    const kasExclusiveTabs = [
      'kas-suite',
      'kas-portal',
      'kas-standalone',
      'kas-company',
      'kas-etmad',
      'tenders-boq',
    ];
    if (_selectedPortal.companyId != 'all' &&
        _selectedPortal.companyId != 'KAS' &&
        kasExclusiveTabs.contains(href)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: ErpTokens.statusDanger,
          content: Text('🔒 عذراً، جناح منافسات كاس (KAS Suite) معزول ومقفل لشركة كاس فقط.'),
        ),
      );
      return;
    }

    setState(() {
      _activeTab = href;
      _activeTabTitle = title.isNotEmpty ? title : href;
      _flowState = 'workspace';
    });
  }

  void _handleLogout() {
    setState(() {
      _flowState = 'login';
      _authError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_flowState) {
      case 'landing':
        return _buildLandingPageReplica();
      case 'login':
        return _buildLoginPageReplica();
      case 'launcher':
        return _buildAppLauncherPageReplica();
      case 'workspace':
      default:
        return _buildWorkspaceAppShellReplica();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 1: LANDING PAGE REPLICA (`src/pages/LandingPage.tsx`)
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildLandingPageReplica() {
    return Scaffold(
      backgroundColor: ErpTokens.canvasLight,
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -0.8),
            radius: 1.4,
            colors: [
              ErpTokens.canvasCream,
              ErpTokens.canvasLight,
              Color(0xFFF4F6F9),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // 1. Sticky Luxury White Frosted Top Header (`LandingPage.tsx` lines 156-223)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.94),
                  border: const Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.65)),
                          ),
                          child: ClipOval(
                            child: Image.asset(
                              'assets/logo.png',
                              fit: BoxFit.contain,
                              errorBuilder: (_, _, _) => const Icon(Icons.apartment_rounded, size: 20),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'مجموعة خالد السليم',
                              style: TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w800,
                                color: ErpTokens.ink,
                              ),
                            ),
                            Text(
                              'KHALID AL-SULAIM GROUP • ERP',
                              style: TextStyle(
                                fontSize: 9.5,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF71717A),
                                letterSpacing: 0.4,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        InkWell(
                          onTap: () => _navigateToCompanyLogin('admin'),
                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              border: Border.all(color: ErpTokens.hairlineLight),
                            ),
                            child: const Text(
                              'الإدارة المركزية',
                              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: ErpTokens.ink),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        InkWell(
                          onTap: () => _navigateToCompanyLogin('saf'),
                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                            decoration: BoxDecoration(
                              color: ErpTokens.primary,
                              borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.login_rounded, size: 13, color: Colors.white),
                                SizedBox(width: 4),
                                Text(
                                  'بوابات الشركات',
                                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Colors.white),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // 2. Scrollable Landing Body (`Hero` + `Faris & Noura` + `Companies Grid`)
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
                  children: [
                    // Eyebrow Badge (`LandingPage.tsx` lines 302-307)
                    Align(
                      alignment: AlignmentDirectional.centerStart,
                      child: ErpTokens.pillTagMint(
                        'منظومة أعمال متكاملة • KHALID AL-SULAIM GROUP',
                        icon: Icons.auto_awesome_rounded,
                        fontSize: 10.5,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Official Flag Slogan (`LandingPage.tsx` lines 310-315)
                    const Text(
                      'نستثمر في الفرص..',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: ErpTokens.ink,
                        height: 1.15,
                      ),
                    ),
                    const Text(
                      'نصنع المستقبل.',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: ErpTokens.goldDark,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'بوابة التشغيل الذكي والحوكمة الرقمية لمجموعة خالد السليم: تنوع في القطاعات، قوة في التنفيذ، واستدامة في النمو. منظومة سحابية متقدمة تدير شركات المجموعة والمراكز المستقلة ببيئات عمل معزولة ومركز قيادة موحد للأداء والمالية والربط الحكومي.',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF52525B),
                        height: 1.55,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Primary & Secondary CTA Pills (`LandingPage.tsx` lines 323-342)
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => _navigateToCompanyLogin('saf'),
                            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 13),
                              decoration: BoxDecoration(
                                color: ErpTokens.primary,
                                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.login_rounded, size: 16, color: Colors.white),
                                  SizedBox(width: 6),
                                  Text(
                                    'بوابات دخول الشركات المستقلة',
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () => _navigateToCompanyLogin('admin'),
                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              border: Border.all(color: ErpTokens.hairlineLight),
                            ),
                            child: const Text(
                              'Super Admin',
                              style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Compliance & Vision 2030 Badges (`LandingPage.tsx` lines 345-357)
                    Wrap(
                      spacing: 10,
                      runSpacing: 6,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: const [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.verified_user_rounded, size: 14, color: Color(0xFF059669)),
                            SizedBox(width: 4),
                            Text('الفوترة المشفرة ZATCA المرحلة الثانية', style: TextStyle(fontSize: 11, color: Color(0xFF3F3F46), fontWeight: FontWeight.w600)),
                          ],
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle_rounded, size: 14, color: Color(0xFF0284C7)),
                            SizedBox(width: 4),
                            Text('منصة مساند و HRSD', style: TextStyle(fontSize: 11, color: Color(0xFF3F3F46), fontWeight: FontWeight.w600)),
                          ],
                        ),
                        Text('• رؤية المملكة 2030', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: ErpTokens.ink)),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // 3D Saudi Assistant Card (Faris & Noura — `LandingPage.tsx` lines 360-510)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: ErpTokens.cardPricingDecoration(
                        borderColor: ErpTokens.champagneGold.withValues(alpha: 0.45),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(color: ErpTokens.statusSuccess, shape: BoxShape.circle),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    _persona == 'noura' ? 'نُورة • المرشدة الرقمية' : 'فارس • المرشد الرقمي',
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF4F4F5),
                                  borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                                  border: Border.all(color: ErpTokens.hairlineLight),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    GestureDetector(
                                      onTap: () => setState(() => _persona = 'faris'),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: _persona == 'faris' ? Colors.white : Colors.transparent,
                                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                                        ),
                                        child: Text(
                                          '👨 فارس',
                                          style: TextStyle(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w800,
                                            color: _persona == 'faris' ? ErpTokens.ink : const Color(0xFF71717A),
                                          ),
                                        ),
                                      ),
                                    ),
                                    GestureDetector(
                                      onTap: () => setState(() => _persona = 'noura'),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: _persona == 'noura' ? Colors.white : Colors.transparent,
                                          borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                                        ),
                                        child: Text(
                                          '👩 نُورة',
                                          style: TextStyle(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w800,
                                            color: _persona == 'noura' ? ErpTokens.goldDark : const Color(0xFF71717A),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 18, color: ErpTokens.hairlineLight),
                          Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: Container(
                                  width: 68,
                                  height: 68,
                                  color: ErpTokens.goldPale,
                                  child: Image.asset(
                                    _persona == 'noura' ? 'assets/noura.png' : 'assets/mascot.png',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, _, _) => const Icon(Icons.support_agent_rounded, size: 36, color: ErpTokens.goldDark),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  _persona == 'noura'
                                      ? 'أهلاً بك! أنا نُورة، مرشدتك الرقمية في مجموعة خالد السليم. اختر شركتك أدناه للدخول المباشر لبوابتها المعزولة.'
                                      : 'مرحباً بك! أنا فارس، مرشدك الرقمي في منظومة خالد السليم ERP. جميع الشركات تعمل ببيئات معزولة وإشعارات لحظية.',
                                  style: const TextStyle(fontSize: 11.5, color: ErpTokens.ink, height: 1.45),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Section Title: الشركات التابعة للمجموعة (`LandingPage.tsx` `#companies`)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'الشركات التابعة للمجموعة (بوابات معزولة)',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: ErpTokens.ink),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'كل شركة تمتلك مسار دخول مستقل وعزل كامل للبيانات (Strict RLS)',
                                style: TextStyle(fontSize: 11, color: Color(0xFF71717A)),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        ErpTokens.pillTagMint('5 كيانات', fontSize: 10.5),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // 5 Main Subsidiary Company Cards (`SAF`, `YAQ`, `TOP`, `KAS`, `DAR`)
                    ...ErpSystemData.mainSubsidiaryCompanies.map((comp) => _buildLandingCompanyCard(comp)),

                    const SizedBox(height: 20),
                    const Text(
                      'البوابات الرقمية والإدارة المركزية',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: ErpTokens.ink),
                    ),
                    const SizedBox(height: 10),
                    ...ErpSystemData.systemPortals
                        .where((p) => p.category != 'شركات المجموعة')
                        .map((portal) => _buildDigitalPortalCompactRow(portal)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLandingCompanyCard(SystemPortalOption comp) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: ErpTokens.cardPricingDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 46,
                height: 46,
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: ErpTokens.surfaceSubtle,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: ErpTokens.hairlineLight),
                ),
                child: Image.asset(
                  comp.assetLogo,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => Icon(comp.icon, color: comp.themeColor),
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: comp.themeColor.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            comp.companyCodeBadge,
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: comp.themeColor,
                            ),
                          ),
                        ),
                        ErpTokens.pillTagMint(comp.stats, fontSize: 9.5),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      comp.nameAr,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                    ),
                    Text(
                      comp.nameEn,
                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF71717A)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            comp.desc,
            style: const TextStyle(fontSize: 11.5, color: Color(0xFF52525B), height: 1.45),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  comp.license,
                  style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Color(0xFF71717A)),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => _navigateToCompanyLogin(comp.key),
                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: ErpTokens.primary,
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'دخول البوابة (${comp.routePath})',
                        style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_back_rounded, size: 13, color: ErpTokens.goldLight),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDigitalPortalCompactRow(SystemPortalOption portal) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: ErpTokens.cardPricingDecoration(),
      child: ListTile(
        onTap: () => _navigateToCompanyLogin(portal.key),
        leading: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: ErpTokens.goldPale,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(portal.icon, color: ErpTokens.goldDark, size: 20),
        ),
        title: Text(
          portal.nameAr,
          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
        ),
        subtitle: Text(
          '${portal.license} • ${portal.routePath}',
          style: const TextStyle(fontSize: 10.5, color: Color(0xFF71717A)),
        ),
        trailing: const Icon(Icons.arrow_back_ios_new_rounded, size: 14, color: ErpTokens.ink),
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 2: LOGIN & REGISTRATION PAGE REPLICA (`src/pages/LoginPage.tsx`)
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildLoginPageReplica() {
    final portal = _selectedPortal;
    return Scaffold(
      backgroundColor: ErpTokens.loginAuthSurface,
      body: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // 1. Mobile Top Bar (`LoginPage.tsx` lines 886-940)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () => setState(() => _flowState = 'landing'),
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.home_rounded, size: 14, color: ErpTokens.goldLight),
                          SizedBox(width: 5),
                          Text(
                            'الرئيسية',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.circle, size: 7, color: Color(0xFF10B981)),
                        SizedBox(width: 5),
                        Text(
                          'الربط الحكومي: مساند • ZATCA • قوى (متصل)',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF065F46)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 2. Authentication Card (`RIGHT SECTION` on mobile first due to `flex-col-reverse` in `LoginPage.tsx`!)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Locked Sovereign Company Identity Header Card (`LoginPage.tsx` lines 955-1035)
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: portal.themeColor.withValues(alpha: 0.45), width: 1.5),
                      boxShadow: ErpTokens.elevation3Shadow,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              padding: const EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                color: ErpTokens.surfaceSubtle,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: ErpTokens.hairlineLight),
                              ),
                              child: Image.asset(
                                portal.assetLogo,
                                fit: BoxFit.contain,
                                errorBuilder: (_, _, _) => Icon(portal.icon, color: portal.themeColor),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Wrap(
                                    spacing: 6,
                                    runSpacing: 4,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: portal.themeColor,
                                          borderRadius: BorderRadius.circular(5),
                                        ),
                                        child: Text(
                                          portal.companyId == 'all' ? 'GRP-ALL' : portal.companyId,
                                          style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: Colors.white),
                                        ),
                                      ),
                                      Text(
                                        '@${portal.emailDomain}',
                                        style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: portal.themeColor),
                                      ),
                                      Text(
                                        portal.routePath,
                                        style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFF71717A)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    portal.nameAr,
                                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                                  ),
                                ],
                              ),
                            ),
                            TextButton(
                              onPressed: () => setState(() => _portalSwitcherExpanded = !_portalSwitcherExpanded),
                              child: Text(
                                _portalSwitcherExpanded ? 'إخفاء' : 'تغيير البوابة',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: ErpTokens.goldDark),
                              ),
                            ),
                          ],
                        ),
                        if (_portalSwitcherExpanded) ...[
                          const Divider(height: 16, color: ErpTokens.hairlineLight),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: ErpSystemData.systemPortals.map((p) {
                              final selected = p.id == portal.id;
                              return ChoiceChip(
                                label: Text(p.nameAr, style: const TextStyle(fontSize: 10.5)),
                                selected: selected,
                                selectedColor: ErpTokens.primary,
                                labelStyle: TextStyle(
                                  color: selected ? Colors.white : ErpTokens.ink,
                                  fontWeight: FontWeight.w700,
                                ),
                                onSelected: (_) => _navigateToCompanyLogin(p.key),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Mode Switcher Tabs (`تسجيل الدخول` vs `إنشاء حساب جديد`)
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE4E4E7).withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _authMode = 'signin'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _authMode == 'signin' ? ErpTokens.primary : Colors.transparent,
                                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'تسجيل الدخول لبوابة الشركة',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: _authMode == 'signin' ? Colors.white : ErpTokens.ink,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _authMode = 'register'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _authMode == 'register' ? ErpTokens.primary : Colors.transparent,
                                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'إنشاء حساب جديد (3 خطوات)',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: _authMode == 'register' ? Colors.white : ErpTokens.ink,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  if (_authError != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: ErpTokens.statusDangerBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: ErpTokens.statusDangerBorder),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline_rounded, color: ErpTokens.statusDanger, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _authError!,
                              style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: ErpTokens.statusDanger),
                            ),
                          ),
                        ],
                      ),
                    ),

                  if (_authMode == 'signin')
                    _buildSignInFormCard(portal)
                  else
                    _buildRegistrationWizardCard(portal),
                ],
              ),
            ),

            // 3. Sovereign KAFD Architectural Hero & Telemetry (`LEFT SECTION` in `LoginPage.tsx` lines 663-872)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: ErpTokens.kafdHeroBg,
                image: DecorationImage(
                  image: const AssetImage('assets/login-hero-pro.jpg'),
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(
                    ErpTokens.kafdHeroBg.withValues(alpha: 0.82),
                    BlendMode.darken,
                  ),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: ErpTokens.champagneGold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.4)),
                    ),
                    child: Text(
                      '✨ بوابة الدخول السيادي المستقلة • ${portal.routePath}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: ErpTokens.goldLight),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    portal.nameAr,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    portal.sectorTagAr,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: ErpTokens.goldLight),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'بوابة دخول مستقلة ومعزولة كلياً لمنسوبي ومستفيدي ${portal.nameAr}، محمية بمعايير العزل المؤسسي الصارم (Strict Tenant RLS) والتكامل الحكومي الفوري.',
                    style: const TextStyle(fontSize: 11.5, color: Color(0xFFCBD5E1), height: 1.45),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            Text('العمليات ومساند', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white)),
                            Text('8 مراحل • ضمان 90 يوم', style: TextStyle(fontSize: 9.5, color: Color(0xFF94A3B8))),
                          ],
                        ),
                        Column(
                          children: [
                            Text('المالية و ZATCA 2', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white)),
                            Text('UBL 2.1 • تشفير PIH', style: TextStyle(fontSize: 9.5, color: Color(0xFF94A3B8))),
                          ],
                        ),
                        Column(
                          children: [
                            Text('اعتماد و WPS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white)),
                            Text('كاس BOQ • PDPL', style: TextStyle(fontSize: 9.5, color: Color(0xFF94A3B8))),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSignInFormCard(SystemPortalOption portal) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: ErpTokens.cardPricingDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'البريد الإلكتروني المؤسسي أو اسم المستخدم',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: ErpTokens.ink),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(fontSize: 13.5, color: ErpTokens.ink, fontWeight: FontWeight.w600),
            decoration: InputDecoration(
              hintText: 'user@${portal.emailDomain}',
              prefixIcon: const Icon(Icons.alternate_email_rounded, size: 18, color: Color(0xFF71717A)),
              filled: true,
              fillColor: ErpTokens.surfaceSubtle,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: ErpTokens.hairlineLight),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: ErpTokens.hairlineLight),
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'كلمة المرور المشفرة',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: ErpTokens.ink),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: _passwordController,
            obscureText: _obscurePassword,
            style: const TextStyle(fontSize: 13.5, color: ErpTokens.ink),
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.lock_outline_rounded, size: 18, color: Color(0xFF71717A)),
              suffixIcon: IconButton(
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                icon: Icon(
                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                  size: 18,
                  color: const Color(0xFF71717A),
                ),
              ),
              filled: true,
              fillColor: ErpTokens.surfaceSubtle,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: ErpTokens.hairlineLight),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: ErpTokens.hairlineLight),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Primary Sign In Button (`.btn-odoo-primary` pure `#000000` pill)
          ElevatedButton.icon(
            onPressed: _handleSignIn,
            style: ElevatedButton.styleFrom(
              backgroundColor: ErpTokens.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
              ),
            ),
            icon: const Icon(Icons.login_rounded, size: 18, color: ErpTokens.goldLight),
            label: Text(
              'دخول بوابة ${portal.nameAr}',
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(height: 10),

          // Biometric Auth & Quick Demo Fill Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    _applyPortalDefaults(portal);
                    _handleSignIn();
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: ErpTokens.ink,
                    side: const BorderSide(color: ErpTokens.hairlineLight),
                    padding: const EdgeInsets.symmetric(vertical: 11),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    ),
                  ),
                  icon: const Icon(Icons.fingerprint_rounded, size: 18, color: ErpTokens.goldDark),
                  label: const Text(
                    'الدخول بالبصمة البيومترية',
                    style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              OutlinedButton(
                onPressed: () => setState(() => _applyPortalDefaults(portal)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: ErpTokens.goldDark,
                  side: BorderSide(color: ErpTokens.champagneGold.withValues(alpha: 0.5)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                  ),
                ),
                child: const Text(
                  'تعبئة تلقائية',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// 3-Step Registration Wizard (`LoginPage.tsx` Stage 7)
  Widget _buildRegistrationWizardCard(SystemPortalOption portal) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: ErpTokens.cardPricingDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'معالج التسجيل الموحد — خطوة $_regStep من 3',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: ErpTokens.ink),
              ),
              ErpTokens.pillTagMint(portal.companyId == 'all' ? 'GRP' : portal.companyId, fontSize: 10),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
            child: LinearProgressIndicator(
              value: _regStep / 3.0,
              minHeight: 5,
              backgroundColor: const Color(0xFFF4F4F5),
              valueColor: const AlwaysStoppedAnimation<Color>(ErpTokens.champagneGold),
            ),
          ),
          const SizedBox(height: 14),
          if (_regStep == 1) ...[
            const Text('اختر نوع الحساب في الكيان:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            ...[
              const MapEntry('client', 'حساب عميل / مستفيد (متابعة العقود والضمان)'),
              const MapEntry('employee', 'حساب موظف منسوبي الشركة'),
              const MapEntry('agency', 'حساب وكالة خارجية / شريك دولي'),
            ].map((item) {
              final active = _regAccountType == item.key;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  onTap: () => setState(() => _regAccountType = item.key),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(color: active ? ErpTokens.primary : ErpTokens.hairlineLight, width: active ? 1.5 : 1),
                  ),
                  tileColor: active ? ErpTokens.goldPale.withValues(alpha: 0.45) : ErpTokens.surfaceSubtle,
                  leading: Icon(
                    active ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                    color: active ? ErpTokens.primary : const Color(0xFF71717A),
                  ),
                  title: Text(item.value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                ),
              );
            }),
          ] else if (_regStep == 2) ...[
            TextField(
              controller: _regFullNameController,
              decoration: const InputDecoration(
                labelText: 'الاسم الرباعي الكامل',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _regNationalIdController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'رقم الهوية الوطنية / الإقامة (10 أرقام)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _regPhoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'رقم الجوال الموثق (05XXXXXXXX)',
                border: OutlineInputBorder(),
              ),
            ),
          ] else ...[
            TextField(
              controller: _regEmailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'البريد الإلكتروني (@${portal.emailDomain})',
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _regPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'كلمة المرور القوية',
                border: OutlineInputBorder(),
              ),
            ),
            if (_regReferenceNumber != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: ErpTokens.statusSuccessBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: ErpTokens.statusSuccessBorder),
                ),
                child: Text(
                  '✅ تم إصدار الهوية الرقمية بنجاح! الرقم المرجعي: $_regReferenceNumber',
                  style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF065F46)),
                ),
              ),
            ],
          ],
          const SizedBox(height: 14),
          Row(
            children: [
              if (_regStep > 1)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _regStep -= 1),
                    child: const Text('السابق'),
                  ),
                ),
              if (_regStep > 1) const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ErpTokens.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(ErpTokens.radiusPill)),
                  ),
                  onPressed: () {
                    if (_regStep < 3) {
                      setState(() => _regStep += 1);
                    } else {
                      final ref = 'REG-${portal.companyId}-${DateTime.now().millisecondsSinceEpoch % 10000}';
                      setState(() => _regReferenceNumber = ref);
                      _triggerInstantNativeNotification(
                        customTitle: 'اكتمال التسجيل الرقمي ($ref)',
                        customBody: 'تم تفعيل حسابك في ${portal.nameAr} بنجاح.',
                      );
                    }
                  },
                  child: Text(_regStep < 3 ? 'الخطوة التالية' : 'إصدار الهوية الرقمية وتفعيل الحساب'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 3: APP LAUNCHER PAGE REPLICA (`src/pages/AppLauncherPage.tsx`)
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildAppLauncherPageReplica() {
    final co = _selectedPortal.companyId;
    final visibleApps = ErpSystemData.allSystemApps.where((app) {
      if (app.exclusiveToCompany != null && co != 'all' && co != app.exclusiveToCompany) {
        return false;
      }
      if (_launcherCategory != 'all' && app.category != _launcherCategory) {
        return false;
      }
      if (_launcherSearch.trim().isNotEmpty) {
        final q = _launcherSearch.trim().toLowerCase();
        return app.title.toLowerCase().contains(q) || app.subtitle.toLowerCase().contains(q);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: ErpTokens.canvasCream,
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: ErpTokens.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.grid_view_rounded, color: ErpTokens.goldLight, size: 18),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'بوابة الأقسام والتطبيقات المؤسسية',
                            style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                          ),
                          Text(
                            _selectedPortal.nameAr,
                            style: const TextStyle(fontSize: 10.5, color: Color(0xFF71717A)),
                          ),
                        ],
                      ),
                    ],
                  ),
                  InkWell(
                    onTap: () => setState(() => _flowState = 'workspace'),
                    borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: ErpTokens.primary,
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      ),
                      child: const Text(
                        'العودة للوحة العمل',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Search & Category Filter Pills
            Container(
              padding: const EdgeInsets.all(14),
              color: Colors.white,
              child: Column(
                children: [
                  TextField(
                    onChanged: (v) => setState(() => _launcherSearch = v),
                    decoration: InputDecoration(
                      hintText: 'ابحث في أقسام وتطبيقات المنظومة...',
                      prefixIcon: const Icon(Icons.search_rounded, size: 18),
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
                    ),
                  ),
                  const SizedBox(height: 10),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: const [
                        MapEntry('all', 'جميع الأقسام'),
                        MapEntry('operations', 'العمليات والعقود'),
                        MapEntry('finance', 'المالية و ZATCA'),
                        MapEntry('crm', 'العملاء والتواصل'),
                        MapEntry('hr', 'الموارد البشرية WPS'),
                        MapEntry('governance', 'الحوكمة والقيادة'),
                      ].map((cat) {
                        final selected = _launcherCategory == cat.key;
                        return Padding(
                          padding: const EdgeInsetsDirectional.only(end: 6),
                          child: ChoiceChip(
                            label: Text(cat.value),
                            selected: selected,
                            selectedColor: ErpTokens.primary,
                            labelStyle: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: selected ? Colors.white : ErpTokens.ink,
                            ),
                            onSelected: (_) => setState(() => _launcherCategory = cat.key),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),

            // Apps Grid
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(14),
                itemCount: visibleApps.length,
                itemBuilder: (context, idx) {
                  final app = visibleApps[idx];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: ErpTokens.cardPricingDecoration(),
                    child: ListTile(
                      onTap: () => _handleSelectTab(app.href, app.title),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      leading: Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: ErpTokens.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(app.icon, color: ErpTokens.goldLight, size: 20),
                      ),
                      title: Row(
                        children: [
                          Expanded(
                            child: Text(
                              app.title,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                            ),
                          ),
                          if (app.metricBadge != null)
                            ErpTokens.pillTagMint(app.metricBadge!, fontSize: 9.5),
                        ],
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          app.subtitle,
                          style: const TextStyle(fontSize: 11, color: Color(0xFF71717A), height: 1.35),
                        ),
                      ),
                      trailing: const Icon(Icons.arrow_back_ios_new_rounded, size: 14, color: ErpTokens.ink),
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

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 4: WORKSPACE APPSHELL (`AppShell.tsx` + `Header.tsx` + `Sidebar.tsx` + `MobileBottomNav.tsx`)
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildWorkspaceAppShellReplica() {
    return Scaffold(
      key: _workspaceScaffoldKey,
      backgroundColor: ErpTokens.canvasCream,
      drawer: _buildSidebarDrawerReplica(),
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // 1. Sticky White Top Header (`src/components/layout/Header.tsx`)
            _buildTopHeaderReplica(),

            // 2. Main Scrollable Workspace Content Body (`.content-body` in `layout.css`)
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(14, 14, 14, 96),
                children: [
                  if (_activeTab == 'dashboard')
                    DashboardViewReplica(
                      activePortal: _selectedPortal,
                      currentUserName: _authenticatedUserName,
                      currentUserRole: _authenticatedUserRole,
                      records: _scopedRecords,
                      onNavigate: _handleSelectTab,
                      onOpenAddRecordModal: _openCreateRecordSheet,
                    )
                  else
                    EnterpriseModuleWorkspaceView(
                      activeTab: _activeTab,
                      activeTabTitle: _activeTabTitle,
                      activePortal: _selectedPortal,
                      records: _scopedRecords,
                      onAddRecord: _openCreateRecordSheet,
                      onTriggerInstantNotification: () => _triggerInstantNativeNotification(
                        tabKey: _activeTab,
                        tabTitle: _activeTabTitle,
                      ),
                      onScheduleBackgroundNotification: _scheduleBackgroundNotification5s,
                      onNavigate: _handleSelectTab,
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
      // Floating Faris & Noura AI Copilot Button (`<AICopilotWidget />` in `App.tsx`)
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 66),
        child: FloatingActionButton.extended(
          onPressed: _openFarisNouraCopilotSheet,
          backgroundColor: ErpTokens.primary,
          foregroundColor: Colors.white,
          elevation: 6,
          icon: const Icon(Icons.auto_awesome_rounded, color: ErpTokens.goldLight, size: 18),
          label: Text(
            _persona == 'noura' ? 'نُورة AI' : 'فارس AI',
            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800),
          ),
        ),
      ),
      bottomNavigationBar: _buildMobileBottomNavReplica(),
    );
  }

  /// Exact Replica of `src/components/layout/Header.tsx`
  Widget _buildTopHeaderReplica() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(
        color: ErpTokens.canvasLight,
        border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
      ),
      child: Row(
        children: [
          // Hamburger Button (`Header.tsx` lines 171-178)
          InkWell(
            onTap: () => _workspaceScaffoldKey.currentState?.openDrawer(),
            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: ErpTokens.hairlineLight),
              ),
              child: const Icon(Icons.menu_rounded, size: 18, color: ErpTokens.ink),
            ),
          ),
          const SizedBox(width: 8),

          // Current Page Title (`Header.tsx` lines 190-194)
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _activeTabTitle,
                  style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                GestureDetector(
                  onTap: _openBranchPickerSheet,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.location_on_outlined, size: 11, color: ErpTokens.goldDark),
                      const SizedBox(width: 3),
                      Text(
                        _selectedBranch.name,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF71717A)),
                      ),
                      const Icon(Icons.keyboard_arrow_down_rounded, size: 12, color: Color(0xFF71717A)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Mood Pulse Check-in Button (`Header.tsx` `userMoodEmoji`)
          InkWell(
            onTap: _openMoodCheckInModal,
            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
              decoration: BoxDecoration(
                color: ErpTokens.surfaceSubtle,
                borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                border: Border.all(color: ErpTokens.hairlineLight),
              ),
              child: Text(_userMoodEmoji, style: const TextStyle(fontSize: 14)),
            ),
          ),
          const SizedBox(width: 6),

          // Notification Bell with Unread Badge (`Header.tsx`)
          InkWell(
            onTap: _openNotificationsAndBackgroundSheet,
            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: ErpTokens.surfaceSubtle,
                    shape: BoxShape.circle,
                    border: Border.all(color: ErpTokens.hairlineLight),
                  ),
                  child: const Icon(Icons.notifications_none_rounded, size: 18, color: ErpTokens.ink),
                ),
                if (_unreadCount > 0)
                  Positioned(
                    top: -2,
                    left: -2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE11D48),
                        borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                      ),
                      child: Text(
                        '$_unreadCount',
                        style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 6),

          // Logout to Isolated Company Portal (`Header.tsx`)
          InkWell(
            onTap: _handleLogout,
            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: ErpTokens.statusDangerBg.withValues(alpha: 0.6),
                shape: BoxShape.circle,
                border: Border.all(color: ErpTokens.statusDangerBorder),
              ),
              child: const Icon(Icons.logout_rounded, size: 16, color: ErpTokens.statusDanger),
            ),
          ),
        ],
      ),
    );
  }

  /// Exact Replica of `src/components/layout/Sidebar.tsx` (`SIDEBAR_MENU` Tree Drawer)
  Widget _buildSidebarDrawerReplica() {
    final co = _selectedPortal.companyId;
    return Drawer(
      width: 300,
      backgroundColor: ErpTokens.canvasLight,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Sidebar Brand Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: ErpTokens.champagneGold),
                    ),
                    child: Image.asset(
                      _selectedPortal.assetLogo,
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => const Icon(Icons.apartment_rounded),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _selectedPortal.nameAr,
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          '${_selectedPortal.companyCodeBadge} • عزل نشط',
                          style: const TextStyle(fontSize: 10, color: ErpTokens.goldDark, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded, size: 20),
                  ),
                ],
              ),
            ),

            // Quick Search inside Sidebar (`Sidebar.tsx`)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 6),
              child: TextField(
                onChanged: (v) => setState(() => _sidebarSearch = v),
                style: const TextStyle(fontSize: 12),
                decoration: InputDecoration(
                  hintText: 'بحث سريع في القائمة الجانبية...',
                  prefixIcon: const Icon(Icons.search_rounded, size: 17),
                  filled: true,
                  fillColor: ErpTokens.surfaceSubtle,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: ErpTokens.hairlineLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: ErpTokens.hairlineLight),
                  ),
                ),
              ),
            ),

            // Tree Items (`Sidebar.tsx` lines 161-265)
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                children: ErpSystemData.sidebarMenu.map((item) {
                  // Strict Tenant Isolation Gate
                  if (item.exclusiveToCompany != null && co != 'all' && co != item.exclusiveToCompany) {
                    return const SizedBox.shrink();
                  }

                  if (item.children.isEmpty) {
                    final isActive = _activeTab == item.href;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      child: ListTile(
                        dense: true,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        tileColor: isActive ? ErpTokens.primary : Colors.transparent,
                        leading: Icon(
                          item.icon,
                          size: 18,
                          color: isActive ? ErpTokens.goldLight : ErpTokens.ink,
                        ),
                        title: Text(
                          item.title,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: isActive ? Colors.white : ErpTokens.ink,
                          ),
                        ),
                        onTap: () {
                          Navigator.of(context).pop();
                          if (item.href != null) _handleSelectTab(item.href!, item.title);
                        },
                      ),
                    );
                  }

                  final visibleChildren = item.children.where((c) {
                    if (c.exclusiveToCompany != null && co != 'all' && co != c.exclusiveToCompany) {
                      return false;
                    }
                    if (_sidebarSearch.trim().isNotEmpty) {
                      return c.title.toLowerCase().contains(_sidebarSearch.trim().toLowerCase());
                    }
                    return true;
                  }).toList();

                  if (visibleChildren.isEmpty) return const SizedBox.shrink();

                  final expanded = _sidebarSearch.trim().isNotEmpty || (_expandedSidebarGroups[item.id] ?? false);

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      InkWell(
                        onTap: () => setState(() => _expandedSidebarGroups[item.id] = !expanded),
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
                          decoration: BoxDecoration(
                            color: expanded ? const Color(0xFFF4F4F5) : Colors.transparent,
                            borderRadius: BorderRadius.circular(14),
                            border: expanded ? Border.all(color: ErpTokens.hairlineLight) : null,
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  color: ErpTokens.primary,
                                  borderRadius: BorderRadius.circular(9),
                                ),
                                child: Icon(item.icon, size: 15, color: Colors.white),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  item.title,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                                ),
                              ),
                              Icon(
                                expanded ? Icons.keyboard_arrow_down_rounded : Icons.keyboard_arrow_left_rounded,
                                size: 18,
                                color: const Color(0xFF71717A),
                              ),
                            ],
                          ),
                        ),
                      ),
                      if (expanded)
                        Padding(
                          padding: const EdgeInsetsDirectional.only(start: 14, bottom: 8),
                          child: Column(
                            children: visibleChildren.map((child) {
                              final isDirectActive = _activeTab == child.href;
                              return InkWell(
                                onTap: () {
                                  Navigator.of(context).pop();
                                  if (child.href != null) _handleSelectTab(child.href!, child.title);
                                },
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 3),
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isDirectActive ? ErpTokens.primary : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        child.icon,
                                        size: 15,
                                        color: isDirectActive ? ErpTokens.goldLight : const Color(0xFF71717A),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          child.title,
                                          style: TextStyle(
                                            fontSize: 11.5,
                                            fontWeight: isDirectActive ? FontWeight.w800 : FontWeight.w600,
                                            color: isDirectActive ? Colors.white : const Color(0xFF3F3F46),
                                          ),
                                        ),
                                      ),
                                      if (child.badge != null)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: isDirectActive ? const Color(0xFF18181B) : const Color(0xFFF4F4F5),
                                            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                                          ),
                                          child: Text(
                                            child.badge!,
                                            style: TextStyle(
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w800,
                                              color: isDirectActive ? ErpTokens.goldLight : ErpTokens.ink,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Exact Replica of `src/components/layout/MobileBottomNav.tsx`
  Widget _buildMobileBottomNavReplica() {
    final co = _selectedPortal.companyId;
    // Resolve primary operations tab dynamically per company (`MobileBottomNav.tsx` lines 53-85)
    String opsHref = 'recruitment-contracts';
    String opsLabel = 'العقود';
    String opsTitle = 'عقود الاستقدام ومساند';
    IconData opsIcon = Icons.work_outline_rounded;

    if (co == 'KAS') {
      opsHref = 'kas-suite';
      opsLabel = 'منافسات كاس';
      opsTitle = 'البوابة المستقلة لشركة كاس (KAS Suite)';
      opsIcon = Icons.apartment_rounded;
    } else if (co == 'DAR') {
      opsHref = 'shelter-suite';
      opsLabel = 'الإيواء';
      opsTitle = 'بوابة مراكز الإيواء والتسكين (DAR)';
      opsIcon = Icons.favorite_border_rounded;
    } else if (co == 'YAQ') {
      opsHref = 'rent-contracts';
      opsLabel = 'عقود التأجير';
      opsTitle = 'عقود التأجير والتشغيل (YAQ)';
      opsIcon = Icons.work_outline_rounded;
    } else if (co == 'TOP') {
      opsHref = 'ats-pipeline';
      opsLabel = 'التوظيف ATS';
      opsTitle = 'منظومة الفرز والتوظيف الذكي (ATS)';
      opsIcon = Icons.psychology_outlined;
    }

    final isHomeActive = _activeTab == 'dashboard';
    final isOpsActive = _activeTab == opsHref ||
        _activeTab.contains('contract') ||
        _activeTab.contains('kas') ||
        _activeTab.contains('shelter');

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.97),
        border: const Border(top: BorderSide(color: ErpTokens.hairlineLight)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14091725),
            blurRadius: 24,
            offset: Offset(0, -8),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Top Micro Status Strip when Offline or Pending Queue (`MobileBottomNav.tsx` lines 116-153)
            if (_simulatedOfflineMode || _offlineQueue.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: _simulatedOfflineMode
                      ? ErpTokens.statusWarning.withValues(alpha: 0.15)
                      : ErpTokens.statusSuccess.withValues(alpha: 0.15),
                  border: const Border(bottom: BorderSide(color: ErpTokens.hairlineLight)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        _simulatedOfflineMode
                            ? 'وضع عدم الاتصال • العمل في الخلفية نشط (${_offlineQueue.length} بالانتظار)'
                            : 'طابور المزامنة الخلفية (${_offlineQueue.length} عمليات جاهزة للمزامنة)',
                        style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (!_simulatedOfflineMode && _offlineQueue.isNotEmpty)
                      InkWell(
                        onTap: () => _flushOfflineQueue(reason: 'شريط الهاتف السفلي'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: ErpTokens.statusSuccess,
                            borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                          ),
                          child: const Text(
                            'مزامنة الآن',
                            style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ),
                      ),
                  ],
                ),
              ),

            // 5-Column Ergonomic Bar (`MobileBottomNav.tsx` lines 156-240)
            SizedBox(
              height: 64,
              child: Row(
                children: [
                  // 1. الرئيسية
                  Expanded(
                    child: _buildBottomNavButton(
                      icon: Icons.home_outlined,
                      label: 'الرئيسية',
                      active: isHomeActive,
                      onTap: () => _handleSelectTab('dashboard', 'الرئيسية والمؤشرات التشغيلية'),
                    ),
                  ),
                  // 2. العمليات (حسب الشركة)
                  Expanded(
                    child: _buildBottomNavButton(
                      icon: opsIcon,
                      label: opsLabel,
                      active: isOpsActive,
                      onTap: () => _handleSelectTab(opsHref, opsTitle),
                    ),
                  ),
                  // 3. Center Elevated Action Button: الأقسام (`MobileBottomNav.tsx` lines 194-204)
                  Expanded(
                    child: Center(
                      child: InkWell(
                        onTap: () => setState(() => _flowState = 'launcher'),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              begin: Alignment.bottomLeft,
                              end: Alignment.topRight,
                              colors: [Color(0xFF091725), Color(0xFF1C3C60)],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: const Color(0xFFFBBF24).withValues(alpha: 0.65),
                              width: 1.8,
                            ),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x3F18181B),
                                blurRadius: 12,
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.grid_view_rounded, size: 18, color: Color(0xFFFBBF24)),
                              SizedBox(height: 1),
                              Text(
                                'الأقسام',
                                style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: Colors.white),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  // 4. الإشعارات والعمل في الخلفية
                  Expanded(
                    child: _buildBottomNavButton(
                      icon: Icons.notifications_none_rounded,
                      label: 'الإشعارات',
                      active: false,
                      badgeCount: _unreadCount,
                      onTap: _openNotificationsAndBackgroundSheet,
                    ),
                  ),
                  // 5. القائمة الجانبية الكاملة
                  Expanded(
                    child: _buildBottomNavButton(
                      icon: Icons.menu_rounded,
                      label: 'القائمة',
                      active: false,
                      onTap: () => _workspaceScaffoldKey.currentState?.openDrawer(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNavButton({
    required IconData icon,
    required String label,
    required bool active,
    int badgeCount = 0,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 36,
                height: 26,
                decoration: BoxDecoration(
                  color: active ? const Color(0xFFFBBF24).withValues(alpha: 0.25) : Colors.transparent,
                  borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                ),
                child: Icon(
                  icon,
                  size: 18,
                  color: active ? const Color(0xFF78350F) : const Color(0xFF71717A),
                ),
              ),
              if (badgeCount > 0)
                Positioned(
                  top: -4,
                  right: -4,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4.5, vertical: 1),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE11D48),
                      borderRadius: BorderRadius.circular(ErpTokens.radiusPill),
                    ),
                    child: Text(
                      badgeCount > 99 ? '99+' : '$badgeCount',
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: active ? FontWeight.w900 : FontWeight.w600,
              color: active ? ErpTokens.ink : const Color(0xFF71717A),
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODALS & INTERACTIVE SHEETS (Notifications, Background Engine, AI Copilot, Add Record)
  // ═══════════════════════════════════════════════════════════════════════════
  void _openNotificationsAndBackgroundSheet() {
    setState(() {
      for (final n in _notifications) {
        n.read = true;
      }
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return DraggableScrollableSheet(
              expand: false,
              initialChildSize: 0.78,
              maxChildSize: 0.94,
              minChildSize: 0.5,
              builder: (_, scrollController) {
                return ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(18),
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'مركز الإشعارات والعمل في الخلفية الأصلي',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: ErpTokens.ink),
                        ),
                        IconButton(
                          onPressed: () => Navigator.of(ctx).pop(),
                          icon: const Icon(Icons.close_rounded),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Native Background Engine Status Card
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: ErpTokens.charcoalDark,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: ErpTokens.champagneGold.withValues(alpha: 0.45)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'محرك الخلفية الأصلي (Android & iOS)',
                                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Colors.white),
                              ),
                              ErpTokens.pillTagMint(
                                _bgServiceRunning ? 'نشط ($_heartbeatCount نبضة)' : 'متوقف',
                                fontSize: 10,
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'آخر مزامنة: $_lastSyncTime • الطابور غير المتصل: ${_offlineQueue.length} عملية',
                            style: const TextStyle(fontSize: 11, color: Color(0xFFD4D4D8)),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    Navigator.of(ctx).pop();
                                    _triggerInstantNativeNotification();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: ErpTokens.champagneGold,
                                    foregroundColor: ErpTokens.charcoalDark,
                                  ),
                                  icon: const Icon(Icons.notifications_active_rounded, size: 16),
                                  label: const Text('إشعار فوري الآن', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () {
                                    Navigator.of(ctx).pop();
                                    _scheduleBackgroundNotification5s();
                                  },
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    side: const BorderSide(color: Colors.white38),
                                  ),
                                  icon: const Icon(Icons.timer_outlined, size: 16),
                                  label: const Text('إشعار بعد 5 ثوانٍ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          SwitchListTile(
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            title: const Text('منع قفل الشاشة أثناء العمليات (WakeLock)', style: TextStyle(fontSize: 11.5, color: Colors.white)),
                            value: _wakeLockEnabled,
                            activeThumbColor: ErpTokens.champagneGold,
                            onChanged: (v) async {
                              setState(() => _wakeLockEnabled = v);
                              setModalState(() {});
                              try {
                                await _nativeChannel.invokeMethod('setWakeLock', {'enable': v});
                              } catch (_) {}
                            },
                          ),
                          SwitchListTile(
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            title: const Text('محاكاة انقطاع الإنترنت (Offline Queue Mode)', style: TextStyle(fontSize: 11.5, color: Colors.white)),
                            value: _simulatedOfflineMode,
                            activeThumbColor: ErpTokens.statusWarning,
                            onChanged: (v) {
                              setState(() => _simulatedOfflineMode = v);
                              setModalState(() {});
                              if (!v && _offlineQueue.isNotEmpty) {
                                _flushOfflineQueue(reason: 'عودة الاتصال');
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'سجل الإشعارات والتنبيهات الفورية',
                      style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: ErpTokens.ink),
                    ),
                    const SizedBox(height: 8),
                    ..._notifications.map(
                      (n) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: ErpTokens.cardPricingDecoration(),
                        child: ListTile(
                          onTap: () {
                            Navigator.of(ctx).pop();
                            _handleSelectTab(n.tabKey, n.tabTitle);
                          },
                          leading: Container(
                            width: 36,
                            height: 36,
                            decoration: const BoxDecoration(color: ErpTokens.goldPale, shape: BoxShape.circle),
                            child: const Icon(Icons.notifications_rounded, size: 18, color: ErpTokens.goldDark),
                          ),
                          title: Text(n.title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                          subtitle: Text('${n.message}\n${n.timestamp}', style: const TextStyle(fontSize: 11)),
                          isThreeLine: true,
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }

  void _openCreateRecordSheet() {
    final titleCtrl = TextEditingController();
    final amountCtrl = TextEditingController(text: '17,250 ر.س');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.fromLTRB(18, 18, 18, MediaQuery.of(ctx).viewInsets.bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'إضافة سجل جديد في ${_selectedPortal.nameAr}',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: ErpTokens.ink),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: titleCtrl,
                decoration: const InputDecoration(
                  labelText: 'عنوان العقد / الطلب / القيد',
                  hintText: 'مثال: عقد استقدام مساند — الفلبين',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amountCtrl,
                decoration: const InputDecoration(
                  labelText: 'القيمة المالية أو المؤشر',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: ErpTokens.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(ErpTokens.radiusPill)),
                ),
                onPressed: () {
                  final co = _selectedPortal.companyId == 'all' ? 'SAF' : _selectedPortal.companyId;
                  final newId = '$co-${DateTime.now().millisecondsSinceEpoch % 10000}';
                  final recTitle = titleCtrl.text.trim().isEmpty
                      ? 'عملية جديدة #$newId — $_activeTabTitle'
                      : titleCtrl.text.trim();

                  setState(() {
                    _allRecords.insert(
                      0,
                      ErpOperationalRecord(
                        id: newId,
                        companyId: co,
                        moduleKey: 'contracts',
                        title: recTitle,
                        subtitle: 'تم الإنشاء عبر تطبيق الهاتف • الفرع: ${_selectedBranch.name}',
                        status: _simulatedOfflineMode ? 'في طابور الأوفلاين' : 'ساري وموثق',
                        badgeText: 'جديد ($co)',
                        amountOrMetric: amountCtrl.text.trim(),
                        updatedAt: 'الآن',
                      ),
                    );
                    if (_simulatedOfflineMode) {
                      _offlineQueue.add(
                        OfflineQueueAction(
                          id: newId,
                          actionType: 'CREATE_RECORD',
                          description: recTitle,
                          companyCode: co,
                          createdAt: 'الآن',
                        ),
                      );
                    }
                  });
                  Navigator.of(ctx).pop();
                  _triggerInstantNativeNotification(
                    customTitle: 'تم حفظ العملية #$newId (${_selectedPortal.companyId})',
                    customBody: recTitle,
                    tabKey: _activeTab,
                    tabTitle: _activeTabTitle,
                  );
                },
                icon: const Icon(Icons.check_circle_outline_rounded, color: ErpTokens.goldLight),
                label: const Text('حفظ وإرسال إشعار للهاتف', style: TextStyle(fontWeight: FontWeight.w800)),
              ),
            ],
          ),
        );
      },
    );
  }

  void _openBranchPickerSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return ListView(
          shrinkWrap: true,
          padding: const EdgeInsets.all(16),
          children: [
            const Text('اختر الفرع التشغيلي النشط', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
            const SizedBox(height: 10),
            ...ErpSystemData.branches.map(
              (b) => ListTile(
                leading: const Icon(Icons.location_on_rounded, color: ErpTokens.goldDark),
                title: Text(b.name, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800)),
                subtitle: Text(b.city, style: const TextStyle(fontSize: 11)),
                trailing: _selectedBranch.id == b.id ? const Icon(Icons.check_circle_rounded, color: ErpTokens.statusSuccess) : null,
                onTap: () {
                  setState(() => _selectedBranch = b);
                  Navigator.of(ctx).pop();
                },
              ),
            ),
          ],
        );
      },
    );
  }

  void _openMoodCheckInModal() {
    const moods = [
      MapEntry('😊', 'ممتاز ومتحمس'),
      MapEntry('🚀', 'إنتاجية عالية'),
      MapEntry('😌', 'هادئ ومستقر'),
      MapEntry('☕', 'أحتاج قهوة'),
    ];
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('نبض الموظف اليومي (Employee Pulse)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: moods.map((m) {
                  return ChoiceChip(
                    label: Text('${m.key} ${m.value}'),
                    selected: _userMoodEmoji == m.key,
                    onSelected: (_) {
                      setState(() => _userMoodEmoji = m.key);
                      Navigator.of(ctx).pop();
                    },
                  );
                }).toList(),
              ),
            ],
          ),
        );
      },
    );
  }

  void _openFarisNouraCopilotSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      _persona == 'noura' ? 'assets/noura.png' : 'assets/mascot.png',
                      width: 48,
                      height: 48,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Icon(Icons.auto_awesome_rounded, size: 32),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _persona == 'noura' ? 'نُورة • المساعد الذكي للمجموعة' : 'فارس • المساعد الذكي للمجموعة',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                        ),
                        Text(
                          'متصل ببيانات ${_selectedPortal.nameAr} المعزولة',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF71717A)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: ErpTokens.goldPale,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'مرحباً $_authenticatedUserName! جميع مؤشرات ${_selectedPortal.nameAr} تعمل بكفاءة 100%، وخدمة المزامنة الخلفية نشطة ($_heartbeatCount نبضة). اختر إجراءً سريعاً:',
                  style: const TextStyle(fontSize: 12, height: 1.45),
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ActionChip(
                    label: const Text('فتح عقود مساند'),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      _handleSelectTab('recruitment-contracts', 'عقود الاستقدام الموثقة (مساند)');
                    },
                  ),
                  ActionChip(
                    label: const Text('الفوترة الإلكترونية ZATCA'),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      _handleSelectTab('zatca', 'الفاتورة الإلكترونية ZATCA المرحلة 2');
                    },
                  ),
                  ActionChip(
                    label: const Text('تجربة إشعار الهاتف الأصلي'),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      _triggerInstantNativeNotification();
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
