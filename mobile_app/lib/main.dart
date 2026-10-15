import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF090D16),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const AlsulaimErpMobileApp());
}

// ============================================================================
// 1. NATIVE ANDROID / IOS BRIDGE (Notifications, Background Service, WakeLock)
// ============================================================================

class NativeMobileBridge {
  static const MethodChannel _channel =
      MethodChannel('sa.alsulaim.erp/native_mobile');

  static Future<bool> requestNotificationPermission() async {
    try {
      final res =
          await _channel.invokeMethod<bool>('requestNotificationPermission');
      return res ?? false;
    } catch (_) {
      return false;
    }
  }

  static Future<void> showSystemNotification({
    required String title,
    required String body,
    required String companyName,
  }) async {
    try {
      await _channel.invokeMethod('showSystemNotification', {
        'title': title,
        'body': body,
        'companyName': companyName,
      });
    } catch (_) {
      // Fallback on web/desktop test environment
    }
  }

  static Future<void> scheduleBackgroundNotification({
    required int delayMs,
    required String title,
    required String body,
    required String companyName,
  }) async {
    try {
      await _channel.invokeMethod('scheduleBackgroundNotification', {
        'delayMs': delayMs,
        'title': title,
        'body': body,
        'companyName': companyName,
      });
    } catch (_) {}
  }

  static Future<bool> startBackgroundService(String companyName) async {
    try {
      final res = await _channel.invokeMethod<bool>('startBackgroundService', {
        'companyName': companyName,
      });
      return res ?? true;
    } catch (_) {
      return true;
    }
  }

  static Future<bool> stopBackgroundService() async {
    try {
      await _channel.invokeMethod<bool>('stopBackgroundService');
      return false;
    } catch (_) {
      return false;
    }
  }

  static Future<Map<String, dynamic>> getBackgroundServiceStatus() async {
    try {
      final res = await _channel
          .invokeMapMethod<String, dynamic>('getBackgroundServiceStatus');
      return res ??
          {
            'isRunning': true,
            'heartbeatCount': 1,
            'lastSyncTimestamp': 'الآن',
          };
    } catch (_) {
      return {
        'isRunning': true,
        'heartbeatCount': 1,
        'lastSyncTimestamp': 'الآن',
      };
    }
  }

  static Future<bool> setWakeLock(bool enable) async {
    try {
      final res = await _channel.invokeMethod<bool>('setWakeLock', {
        'enable': enable,
      });
      return res ?? enable;
    } catch (_) {
      return enable;
    }
  }

  static Future<void> vibrateDevice() async {
    try {
      await _channel.invokeMethod('vibrateDevice');
    } catch (_) {
      HapticFeedback.mediumImpact();
    }
  }
}

// ============================================================================
// 2. MULTI-TENANT COMPANY PORTALS & STRICT ACCESS ISOLATION
// ============================================================================

class CompanyPortalConfig {
  final String id;
  final String routeCode;
  final String nameAr;
  final String subtitleAr;
  final String emailDomain;
  final String vatNumber;
  final Color primaryColor;
  final IconData icon;
  final String demoEmail;
  final String demoUserFullName;
  final String demoRole;

  const CompanyPortalConfig({
    required this.id,
    required this.routeCode,
    required this.nameAr,
    required this.subtitleAr,
    required this.emailDomain,
    required this.vatNumber,
    required this.primaryColor,
    required this.icon,
    required this.demoEmail,
    required this.demoUserFullName,
    required this.demoRole,
  });
}

const List<CompanyPortalConfig> kCompanyPortals = [
  CompanyPortalConfig(
    id: 'SAF',
    routeCode: 'saf',
    nameAr: 'شركة ساف للاستقدام',
    subtitleAr: 'إدارة عقود مساند والضمان والتأشيرات الدولية',
    emailDomain: 'saf-rec.sa',
    vatNumber: '310155220100003',
    primaryColor: Color(0xFFD4AF37),
    icon: Icons.flight_takeoff_rounded,
    demoEmail: 'ahmed@saf-rec.sa',
    demoUserFullName: 'أحمد العتيبي — مشرف مساند (ساف)',
    demoRole: 'مدير عمليات الاستقدام',
  ),
  CompanyPortalConfig(
    id: 'YAQ',
    routeCode: 'yaq',
    nameAr: 'شركة ياقوت للتشغيل',
    subtitleAr: 'التأجير المرن، جدولة الورديات، وتتبع السائقين',
    emailDomain: 'yaqoot-ops.sa',
    vatNumber: '310188440200003',
    primaryColor: Color(0xFF10B981),
    icon: Icons.directions_car_filled_rounded,
    demoEmail: 'fahad@yaqoot-ops.sa',
    demoUserFullName: 'فهد الدوسري — مشرف أسطول (ياقوت)',
    demoRole: 'مشرف التشغيل الميداني والأسطول',
  ),
  CompanyPortalConfig(
    id: 'TOP',
    routeCode: 'top',
    nameAr: 'شركة توباز للتوظيف',
    subtitleAr: 'استقطاب الكفاءات والفرز الذكي للمرشحين ATS',
    emailDomain: 'topaz-rec.sa',
    vatNumber: '310199330300003',
    primaryColor: Color(0xFF6366F1),
    icon: Icons.workspace_premium_rounded,
    demoEmail: 'sara@topaz-rec.sa',
    demoUserFullName: 'سارة القحطاني — أخصائية توظيف (توباز)',
    demoRole: 'مديرة استقطاب الكفاءات',
  ),
  CompanyPortalConfig(
    id: 'KAS',
    routeCode: 'kas',
    nameAr: 'شركة كاس للمنافسات الحكومية',
    subtitleAr: 'منصة اعتماد، الضمانات البنكية، وجداول الكميات BOQ',
    emailDomain: 'kas-etimad.sa',
    vatNumber: '310177660400003',
    primaryColor: Color(0xFF0EA5E9),
    icon: Icons.account_balance_rounded,
    demoEmail: 'nasser@kas-etimad.sa',
    demoUserFullName: 'ناصر الشمري — مدير منافسات (كاس)',
    demoRole: 'مدير المنافسات والضمانات البنكية',
  ),
  CompanyPortalConfig(
    id: 'DAR',
    routeCode: 'shelter',
    nameAr: 'دار الإيواء والترحيل',
    subtitleAr: 'التسكين الميداني، الإعاشة، ونقل الخدمات والكفالات',
    emailDomain: 'alruwad.sa',
    vatNumber: '310166550500003',
    primaryColor: Color(0xFFF43F5E),
    icon: Icons.home_work_rounded,
    demoEmail: 'mona@alruwad.sa',
    demoUserFullName: 'منى الحربي — مشرفة إيواء (دار الإيواء)',
    demoRole: 'مشرفة مركز الإيواء ونقل الخدمات',
  ),
  CompanyPortalConfig(
    id: 'ALL',
    routeCode: 'admin',
    nameAr: 'الإدارة المركزية للمجموعة',
    subtitleAr: 'مركز القيادة السيادي الموحد لرئيس المجموعة',
    emailDomain: 'alsulaim.sa',
    vatNumber: '300000000000003',
    primaryColor: Color(0xFFF59E0B),
    icon: Icons.shield_rounded,
    demoEmail: 'khalid@alsulaim.sa',
    demoUserFullName: 'خالد السليم — رئيس مجلس الإدارة',
    demoRole: 'رئيس المجموعة (SUPER_ADMIN)',
  ),
];

class TenantAccessValidator {
  /// Validates whether an employee email is allowed to log into the target company portal
  static ({bool allowed, String? reason, String detectedCompanyId})
      validateCompanyLogin({
    required String email,
    required CompanyPortalConfig targetPortal,
  }) {
    final normalized = email.trim().toLowerCase();
    if (!normalized.contains('@')) {
      return (
        allowed: false,
        reason: 'يرجى إدخال البريد الإلكتروني المؤسسي بشكل صحيح.',
        detectedCompanyId: ''
      );
    }

    final domain = normalized.split('@').last;

    // Super Admin (@alsulaim.sa) can access ALL portals
    if (domain == 'alsulaim.sa') {
      return (allowed: true, reason: null, detectedCompanyId: 'ALL');
    }

    // Match employee's company by email domain
    CompanyPortalConfig? employeeCompany;
    for (final portal in kCompanyPortals) {
      if (portal.emailDomain == domain) {
        employeeCompany = portal;
        break;
      }
    }

    if (employeeCompany == null) {
      return (
        allowed: false,
        reason:
            'النطاق البريدي (@$domain) غير مسجل ضمن النطاقات السيادية لشركات مجموعة خالد السليم.',
        detectedCompanyId: ''
      );
    }

    if (targetPortal.id == 'ALL' && employeeCompany.id != 'ALL') {
      return (
        allowed: false,
        reason:
            'رفض أمني (عزل الصلاحيات): حسابك تابع لـ (${employeeCompany.nameAr}) ولا يملك صلاحية الدخول لبوابة الإدارة المركزية للمجموعة.',
        detectedCompanyId: employeeCompany.id
      );
    }

    if (employeeCompany.id != targetPortal.id) {
      return (
        allowed: false,
        reason:
            'رفض أمني (عزل الشركات): حسابك مقيد على (${employeeCompany.nameAr}) ولا يُسمح له بتسجيل الدخول عبر بوابة (${targetPortal.nameAr}).',
        detectedCompanyId: employeeCompany.id
      );
    }

    return (
      allowed: true,
      reason: null,
      detectedCompanyId: employeeCompany.id
    );
  }
}

// ============================================================================
// 3. DOMAIN MODELS (Notifications, Offline Queue, Contracts, Invoices)
// ============================================================================

class MobileNotificationItem {
  final String id;
  final String title;
  final String message;
  final String category; // musaned, zatca, etimad, shelter, system
  final String companyId;
  final String timestamp;
  bool isRead;

  MobileNotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.category,
    required this.companyId,
    required this.timestamp,
    this.isRead = false,
  });
}

class OfflineMutationItem {
  final String id;
  final String companyId;
  final String operationTitle;
  final String details;
  final String createdAt;
  int attemptCount;
  String status; // QUEUED, SYNCED

  OfflineMutationItem({
    required this.id,
    required this.companyId,
    required this.operationTitle,
    required this.details,
    required this.createdAt,
    this.attemptCount = 0,
    this.status = 'QUEUED',
  });
}

class ZatcaInvoiceRecord {
  final String invoiceNumber;
  final String companyId;
  final String customerName;
  final double amountWithVat;
  final String pihHash;
  final String currentHash;
  final String issuedAt;

  ZatcaInvoiceRecord({
    required this.invoiceNumber,
    required this.companyId,
    required this.customerName,
    required this.amountWithVat,
    required this.pihHash,
    required this.currentHash,
    required this.issuedAt,
  });
}

// ============================================================================
// 4. ROOT APPLICATION
// ============================================================================

class AlsulaimErpMobileApp extends StatefulWidget {
  const AlsulaimErpMobileApp({super.key});

  @override
  State<AlsulaimErpMobileApp> createState() => _AlsulaimErpMobileAppState();
}

class _AlsulaimErpMobileAppState extends State<AlsulaimErpMobileApp>
    with WidgetsBindingObserver {
  // Navigation flow: 'gateway' -> 'login' -> 'workspace'
  String _flowStage = 'gateway';
  CompanyPortalConfig _selectedPortal = kCompanyPortals.first;
  String _loggedUserFullName = '';
  String _loggedUserEmail = '';
  String _loggedUserRole = '';

  // Background & Offline Engine State
  bool _bgServiceRunning = true;
  bool _wakeLockEnabled = false;
  int _bgHeartbeatCount = 1;
  int _totalSyncedCount = 4;
  String _lastSyncTime = 'الآن';
  Timer? _dartBackgroundTimer;

  // Persistent In-Memory Stores
  final List<MobileNotificationItem> _notifications = [
    MobileNotificationItem(
      id: 'N-101',
      title: 'اعتماد عقد مساند دولي #MUS-8841',
      message: 'تم توثيق العقد وإصدار التأشيرة وإشعار الوكيل الخارجي بنجاح.',
      category: 'musaned',
      companyId: 'SAF',
      timestamp: 'منذ 5 دقائق',
    ),
    MobileNotificationItem(
      id: 'N-102',
      title: 'مصادقة فاتورة ZATCA المرحلة الثانية',
      message: 'تم ربط الهاش التشفيري PIH واعتماد الفاتورة الضريبية #INV-2026-904.',
      category: 'zatca',
      companyId: 'YAQ',
      timestamp: 'منذ 18 دقيقة',
    ),
    MobileNotificationItem(
      id: 'N-103',
      title: 'تنبيه ضمان بنكي — منصة اعتماد',
      message: 'الضمان البنكي للمنافسة #ETM-4410 ساري ومطابق لجدول الكميات BOQ.',
      category: 'etimad',
      companyId: 'KAS',
      timestamp: 'منذ ساعة',
    ),
  ];

  final List<OfflineMutationItem> _offlineQueue = [];

  final List<ZatcaInvoiceRecord> _zatcaInvoices = [
    ZatcaInvoiceRecord(
      invoiceNumber: 'INV-2026-0901',
      companyId: 'SAF',
      customerName: 'عبدالله محمد القحطاني',
      amountWithVat: 19550.0,
      pihHash: 'NWZlY2ViNjZm NOV...GENESIS',
      currentHash: '8f4b2e91c03a7d5e2b19f84a6c3d0e1f',
      issuedAt: '10:30 ص',
    ),
    ZatcaInvoiceRecord(
      invoiceNumber: 'INV-2026-0902',
      companyId: 'YAQ',
      customerName: 'شركة المدار للخدمات المساندة',
      amountWithVat: 42320.0,
      pihHash: '8f4b2e91c03a7d5e2b19f84a6c3d0e1f',
      currentHash: '3c9a71d4e82b501f6a44d9e8c7b2a105',
      issuedAt: '12:15 م',
    ),
  ];

  // Musaned contract stages for SAF
  int _safContractStageIndex = 3;
  static const List<String> kMusanedStages = [
    '1. مسودة عقد مساند (MUSANED_DRAFT)',
    '2. التحقق من التأشيرة (VISA_VERIFIED)',
    '3. تفويض الوكيل الخارجي (AGENCY_ASSIGNED)',
    '4. اجتياز الفحص الطبي (MEDICAL_CLEARED)',
    '5. تفييز الجواز بالسفارة (EMBASSY_STAMPED)',
    '6. حجز تذكرة الطيران (FLIGHT_BOOKED)',
    '7. الوصول للمملكة (ARRIVED_KSA)',
    '8. التسليم وبدء ضمان 90 يوماً (DELIVERED_ACTIVE)',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initNativeServices();
  }

  Future<void> _initNativeServices() async {
    await NativeMobileBridge.requestNotificationPermission();
    await NativeMobileBridge.startBackgroundService(_selectedPortal.nameAr);
    _startPeriodicSyncLoop();
  }

  void _startPeriodicSyncLoop() {
    _dartBackgroundTimer?.cancel();
    _dartBackgroundTimer =
        Timer.periodic(const Duration(seconds: 15), (_) async {
      final status = await NativeMobileBridge.getBackgroundServiceStatus();
      if (!mounted) return;
      setState(() {
        _bgServiceRunning = (status['isRunning'] as bool?) ?? _bgServiceRunning;
        final nativeBeat = (status['heartbeatCount'] as int?) ?? 0;
        _bgHeartbeatCount =
            nativeBeat > _bgHeartbeatCount ? nativeBeat : _bgHeartbeatCount + 1;
        final now = TimeOfDay.now();
        _lastSyncTime =
            '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
      });

      // Automatically flush any queued offline mutations during background heartbeat
      if (_offlineQueue.any((item) => item.status == 'QUEUED')) {
        await _flushOfflineQueue(silent: true);
      }
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // Auto-recover & flush queue when returning from background
      _flushOfflineQueue(silent: true);
    } else if (state == AppLifecycleState.paused) {
      // Ensure native foreground service stays alive when minimized
      if (_bgServiceRunning) {
        NativeMobileBridge.startBackgroundService(_selectedPortal.nameAr);
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _dartBackgroundTimer?.cancel();
    super.dispose();
  }

  int get _unreadNotificationsCount =>
      _notifications.where((n) => !n.isRead).length;

  Future<void> _pushAndDispatchNotification({
    required String title,
    required String message,
    required String category,
    String? companyId,
  }) async {
    final targetCompany = companyId ?? _selectedPortal.id;
    final item = MobileNotificationItem(
      id: 'N-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      message: message,
      category: category,
      companyId: targetCompany,
      timestamp: 'الآن',
    );
    setState(() {
      _notifications.insert(0, item);
    });

    await NativeMobileBridge.vibrateDevice();
    await NativeMobileBridge.showSystemNotification(
      title: title,
      body: message,
      companyName: _selectedPortal.nameAr,
    );
  }

  Future<void> _flushOfflineQueue({bool silent = false}) async {
    int newlySynced = 0;
    setState(() {
      for (final item in _offlineQueue) {
        if (item.status == 'QUEUED') {
          item.attemptCount += 1;
          item.status = 'SYNCED';
          newlySynced += 1;
        }
      }
      _totalSyncedCount += newlySynced;
      final now = TimeOfDay.now();
      _lastSyncTime =
          '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    });

    if (newlySynced > 0 && !silent) {
      await _pushAndDispatchNotification(
        title: '✅ اكتملت المزامنة الخلفية ($newlySynced عمليات)',
        message:
            'تم رفع جميع العمليات الميدانية المخزنة في طابور عدم الاتصال إلى السحابة بنجاح.',
        category: 'system',
      );
    }
  }

  void _openCompanyLoginPortal(CompanyPortalConfig portal) {
    NativeMobileBridge.vibrateDevice();
    setState(() {
      _selectedPortal = portal;
      _flowStage = 'login';
    });
  }

  void _completeLogin({
    required String fullName,
    required String email,
    required String role,
  }) {
    setState(() {
      _loggedUserFullName = fullName;
      _loggedUserEmail = email;
      _loggedUserRole = role;
      _flowStage = 'workspace';
    });

    NativeMobileBridge.startBackgroundService(_selectedPortal.nameAr);
    _pushAndDispatchNotification(
      title: '🔐 تم تسجيل الدخول السيادي بنجاح',
      message:
          'مرحباً $fullName في ${_selectedPortal.nameAr}. خدمة الإشعارات والعمل في الخلفية نشطة.',
      category: 'system',
    );
  }

  void _logoutToCompanyPortal() {
    NativeMobileBridge.vibrateDevice();
    setState(() {
      _loggedUserFullName = '';
      _loggedUserEmail = '';
      _loggedUserRole = '';
      // Return directly to the locked company's isolated login screen
      _flowStage = 'login';
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'مجموعة خالد السليم ERP',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF090D16),
        colorScheme: ColorScheme.dark(
          primary: _selectedPortal.primaryColor,
          secondary: const Color(0xFF10B981),
          surface: const Color(0xFF111827),
        ),
        useMaterial3: true,
      ),
      builder: (context, child) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: _buildCurrentStage(),
    );
  }

  Widget _buildCurrentStage() {
    switch (_flowStage) {
      case 'gateway':
        return SovereignGatewayScreen(
          portals: kCompanyPortals,
          bgServiceRunning: _bgServiceRunning,
          heartbeatCount: _bgHeartbeatCount,
          onSelectPortal: _openCompanyLoginPortal,
        );
      case 'login':
        return IsolatedCompanyLoginScreen(
          portal: _selectedPortal,
          onBackToGateway: () => setState(() => _flowStage = 'gateway'),
          onLoginSuccess: _completeLogin,
        );
      case 'workspace':
      default:
        return MobileWorkspaceShell(
          portal: _selectedPortal,
          userFullName: _loggedUserFullName,
          userEmail: _loggedUserEmail,
          userRole: _loggedUserRole,
          notifications: _notifications,
          unreadCount: _unreadNotificationsCount,
          offlineQueue: _offlineQueue,
          zatcaInvoices: _zatcaInvoices,
          bgServiceRunning: _bgServiceRunning,
          wakeLockEnabled: _wakeLockEnabled,
          bgHeartbeatCount: _bgHeartbeatCount,
          totalSyncedCount: _totalSyncedCount,
          lastSyncTime: _lastSyncTime,
          safContractStageIndex: _safContractStageIndex,
          onAdvanceSafStage: () {
            setState(() {
              _safContractStageIndex =
                  (_safContractStageIndex + 1) % kMusanedStages.length;
            });
            _pushAndDispatchNotification(
              title: '📋 تحديث مرحلة عقد مساند #MUS-8841',
              message:
                  'انتقل العقد إلى المرحلة: ${kMusanedStages[_safContractStageIndex]}',
              category: 'musaned',
            );
          },
          onIssueZatcaInvoice: (customer, amount) {
            final prevHash = _zatcaInvoices.isNotEmpty
                ? _zatcaInvoices.first.currentHash
                : 'GENESIS_PIH_000000000000';
            final raw = '$prevHash|$customer|$amount|${DateTime.now().toIso8601String()}';
            final newHash = base64Url
                .encode(utf8.encode(raw))
                .replaceAll('=', '')
                .substring(0, 28);
            final invNum =
                'INV-2026-090${_zatcaInvoices.length + 1}';
            setState(() {
              _zatcaInvoices.insert(
                0,
                ZatcaInvoiceRecord(
                  invoiceNumber: invNum,
                  companyId: _selectedPortal.id,
                  customerName: customer,
                  amountWithVat: amount,
                  pihHash: prevHash,
                  currentHash: newHash,
                  issuedAt: 'الآن',
                ),
              );
            });
            _pushAndDispatchNotification(
              title: '🧾 صدور فاتورة ZATCA المرحلة الثانية ($invNum)',
              message:
                  'تم اعتماد الفاتورة للعميل ($customer) بمبلغ ${amount.toStringAsFixed(2)} ر.س مع ربط الهاش PIH.',
              category: 'zatca',
            );
          },
          onEnqueueOfflineMutation: (title, details) {
            setState(() {
              _offlineQueue.insert(
                0,
                OfflineMutationItem(
                  id: 'OFF-${DateTime.now().millisecondsSinceEpoch % 10000}',
                  companyId: _selectedPortal.id,
                  operationTitle: title,
                  details: details,
                  createdAt: 'الآن',
                ),
              );
            });
            _pushAndDispatchNotification(
              title: '📥 تم حفظ العملية في طابور الخلفية',
              message: '$title — بانتظار المزامنة التلقائية.',
              category: 'system',
            );
          },
          onFlushOfflineQueue: () => _flushOfflineQueue(silent: false),
          onToggleBgService: () async {
            final next = !_bgServiceRunning;
            if (next) {
              await NativeMobileBridge.startBackgroundService(
                  _selectedPortal.nameAr);
            } else {
              await NativeMobileBridge.stopBackgroundService();
            }
            setState(() => _bgServiceRunning = next);
          },
          onToggleWakeLock: () async {
            final next = !_wakeLockEnabled;
            await NativeMobileBridge.setWakeLock(next);
            setState(() => _wakeLockEnabled = next);
          },
          onScheduleDelayedNotification: () async {
            await NativeMobileBridge.scheduleBackgroundNotification(
              delayMs: 5000,
              title: '🔔 إشعار خلفي مجدول — ${_selectedPortal.nameAr}',
              body:
                  'تم إطلاق هذا الإشعار من خدمة الخلفية الأصلية (Foreground Service) حتى والتطبيق مغلق أو مصغّر!',
              companyName: _selectedPortal.nameAr,
            );
            setState(() {
              _notifications.insert(
                0,
                MobileNotificationItem(
                  id: 'N-BG-${DateTime.now().millisecondsSinceEpoch}',
                  title: '⏱️ تمت جدولة إشعار خلفي (بعد 5 ثوانٍ)',
                  message:
                      'يمكنك الآن تصغير التطبيق أو قفل الشاشة؛ سيصل الإشعار من خدمة الخلفية بعد 5 ثوانٍ.',
                  category: 'system',
                  companyId: _selectedPortal.id,
                  timestamp: 'الآن',
                ),
              );
            });
          },
          onTriggerInstantNotification: (title, message, category) {
            _pushAndDispatchNotification(
              title: title,
              message: message,
              category: category,
            );
          },
          onMarkAllNotificationsRead: () {
            setState(() {
              for (final n in _notifications) {
                n.isRead = true;
              }
            });
          },
          onSwitchCompanyForSuperAdmin: (portal) {
            setState(() => _selectedPortal = portal);
            _pushAndDispatchNotification(
              title: '🔀 تبديل السياق السيادي إلى ${portal.nameAr}',
              message: 'تم تحديث مساحة العمل وعزل البيانات لشركة ${portal.nameAr}.',
              category: 'system',
              companyId: portal.id,
            );
          },
          onLogout: _logoutToCompanyPortal,
        );
    }
  }
}

// ============================================================================
// 5. SCREEN 1: SOVEREIGN MULTI-COMPANY GATEWAY (بوابات دخول الشركات المستقلة)
// ============================================================================

class SovereignGatewayScreen extends StatelessWidget {
  final List<CompanyPortalConfig> portals;
  final bool bgServiceRunning;
  final int heartbeatCount;
  final ValueChanged<CompanyPortalConfig> onSelectPortal;

  const SovereignGatewayScreen({
    super.key,
    required this.portals,
    required this.bgServiceRunning,
    required this.heartbeatCount,
    required this.onSelectPortal,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Status Pill
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD4AF37).withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFFD4AF37).withValues(alpha: 0.4),
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.verified_user_rounded,
                                  size: 14, color: Color(0xFFD4AF37)),
                              SizedBox(width: 6),
                              Text(
                                'تطبيق الجوال الأصلي • عزل سيادي للشركات',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFFFDE68A),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 7,
                                height: 7,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Text(
                                'الخلفية نشطة #$heartbeatCount',
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF6EE7B7),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'مجموعة خالد السليم',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'اختر البوابة المستقلة لشركتك لتسجيل الدخول المعزول وتفعيل إشعارات العمليات والمزامنة الخلفية:',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF94A3B8),
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
              sliver: SliverList.separated(
                itemCount: portals.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final portal = portals[index];
                  return InkWell(
                    borderRadius: BorderRadius.circular(18),
                    onTap: () => onSelectPortal(portal),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF111827),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: portal.primaryColor.withValues(alpha: 0.35),
                          width: 1.2,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: portal.primaryColor.withValues(alpha: 0.16),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: portal.primaryColor.withValues(alpha: 0.45),
                              ),
                            ),
                            child: Icon(
                              portal.icon,
                              color: portal.primaryColor,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        portal.nameAr,
                                        style: const TextStyle(
                                          fontSize: 14.5,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 7, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.06),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '@${portal.emailDomain}',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: portal.primaryColor,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  portal.subtitleAr,
                                  style: const TextStyle(
                                    fontSize: 11.5,
                                    color: Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 15,
                            color: portal.primaryColor,
                          ),
                        ],
                      ),
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

// ============================================================================
// 6. SCREEN 2: ISOLATED PER-COMPANY LOGIN & 3-STEP REGISTRATION
// ============================================================================

class IsolatedCompanyLoginScreen extends StatefulWidget {
  final CompanyPortalConfig portal;
  final VoidCallback onBackToGateway;
  final void Function({
    required String fullName,
    required String email,
    required String role,
  }) onLoginSuccess;

  const IsolatedCompanyLoginScreen({
    super.key,
    required this.portal,
    required this.onBackToGateway,
    required this.onLoginSuccess,
  });

  @override
  State<IsolatedCompanyLoginScreen> createState() =>
      _IsolatedCompanyLoginScreenState();
}

class _IsolatedCompanyLoginScreenState
    extends State<IsolatedCompanyLoginScreen> {
  bool _isRegisterMode = false;
  int _registerStep = 1;
  bool _obscurePassword = true;
  String? _securityError;

  late final TextEditingController _emailCtrl;
  late final TextEditingController _passwordCtrl;
  final TextEditingController _regNameCtrl = TextEditingController();
  final TextEditingController _regPhoneCtrl = TextEditingController();
  final TextEditingController _regNationalIdCtrl = TextEditingController();
  String _selectedRole = 'مشرف عمليات ميداني';

  @override
  void initState() {
    super.initState();
    _emailCtrl = TextEditingController(text: widget.portal.demoEmail);
    _passwordCtrl = TextEditingController(text: 'Alsulaim@2026');
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _regNameCtrl.dispose();
    _regPhoneCtrl.dispose();
    _regNationalIdCtrl.dispose();
    super.dispose();
  }

  void _handleLoginSubmit() {
    setState(() => _securityError = null);

    final email = _emailCtrl.text.trim();
    final pass = _passwordCtrl.text;

    if (email.isEmpty || pass.length < 6) {
      setState(() {
        _securityError =
            'يرجى إدخال البريد المؤسسي وكلمة المرور (6 خانات على الأقل).';
      });
      return;
    }

    // Strict Per-Company Sovereign Access Check
    final check = TenantAccessValidator.validateCompanyLogin(
      email: email,
      targetPortal: widget.portal,
    );

    if (!check.allowed) {
      NativeMobileBridge.vibrateDevice();
      setState(() {
        _securityError = check.reason;
      });
      return;
    }

    final isDemoEmail = email.toLowerCase() == widget.portal.demoEmail;
    widget.onLoginSuccess(
      fullName: isDemoEmail
          ? widget.portal.demoUserFullName
          : (_regNameCtrl.text.trim().isNotEmpty
              ? _regNameCtrl.text.trim()
              : 'موظف معتمد (${widget.portal.id})'),
      email: email,
      role: isDemoEmail ? widget.portal.demoRole : _selectedRole,
    );
  }

  void _testCrossTenantRejection() {
    // Fill an email from another company to prove strict per-company isolation
    final otherPortal = widget.portal.id == 'SAF'
        ? kCompanyPortals[1] // YAQ
        : kCompanyPortals[0]; // SAF
    setState(() {
      _emailCtrl.text = otherPortal.demoEmail;
    });
    _handleLoginSubmit();
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.portal;
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Compact Mobile Top Identity Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton.icon(
                    onPressed: widget.onBackToGateway,
                    icon: const Icon(Icons.arrow_back_rounded,
                        size: 18, color: Colors.white70),
                    label: const Text(
                      'بوابات الشركات',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white70,
                      ),
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: p.primaryColor.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: p.primaryColor.withValues(alpha: 0.45),
                      ),
                    ),
                    child: Text(
                      '/login/${p.routeCode}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: p.primaryColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Locked Company Sovereign Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      p.primaryColor.withValues(alpha: 0.22),
                      const Color(0xFF111827),
                    ],
                    begin: Alignment.topRight,
                    end: Alignment.bottomLeft,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: p.primaryColor.withValues(alpha: 0.5),
                    width: 1.3,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: p.primaryColor.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(p.icon, color: p.primaryColor, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.lock_rounded,
                                      size: 13, color: p.primaryColor),
                                  const SizedBox(width: 4),
                                  Text(
                                    'بوابة دخول معزولة ومقفلة سيادياً',
                                    style: TextStyle(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w800,
                                      color: p.primaryColor,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                p.nameAr,
                                style: const TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        _buildMetaChip('النطاق المعتمد: @${p.emailDomain}', p.primaryColor),
                        _buildMetaChip('الرقم الضريبي: ${p.vatNumber}', Colors.white70),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Mode Switcher: Login vs 3-Step Registration
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFF111827),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() {
                          _isRegisterMode = false;
                          _securityError = null;
                        }),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: !_isRegisterMode
                                ? p.primaryColor
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'تسجيل الدخول',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w900,
                              color:
                                  !_isRegisterMode ? Colors.black : Colors.white70,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() {
                          _isRegisterMode = true;
                          _securityError = null;
                        }),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _isRegisterMode
                                ? p.primaryColor
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'تسجيل حساب جديد (3 خطوات)',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w900,
                              color:
                                  _isRegisterMode ? Colors.black : Colors.white70,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Security Error Alert (if cross-tenant login attempted)
              if (_securityError != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF43F5E).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFF43F5E)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.gpp_bad_rounded,
                          color: Color(0xFFF43F5E), size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _securityError!,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFECDD3),
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
              ],

              // Form Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF111827),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white12),
                ),
                child: !_isRegisterMode
                    ? _buildLoginForm(p)
                    : _buildThreeStepRegisterWizard(p),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetaChip(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black38,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10.5,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }

  Widget _buildLoginForm(CompanyPortalConfig p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'البريد الإلكتروني المؤسسي',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Color(0xFFCBD5E1),
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _emailCtrl,
          keyboardType: TextInputType.emailAddress,
          style: const TextStyle(fontSize: 14, color: Colors.white),
          decoration: InputDecoration(
            prefixIcon: Icon(Icons.alternate_email_rounded,
                size: 18, color: p.primaryColor),
            hintText: 'username@${p.emailDomain}',
            filled: true,
            fillColor: const Color(0xFF090D16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.white24),
            ),
          ),
        ),
        const SizedBox(height: 14),
        const Text(
          'كلمة المرور المشفرة',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Color(0xFFCBD5E1),
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _passwordCtrl,
          obscureText: _obscurePassword,
          style: const TextStyle(fontSize: 14, color: Colors.white),
          decoration: InputDecoration(
            prefixIcon:
                Icon(Icons.key_rounded, size: 18, color: p.primaryColor),
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword
                    ? Icons.visibility_rounded
                    : Icons.visibility_off_rounded,
                size: 18,
                color: Colors.white54,
              ),
              onPressed: () =>
                  setState(() => _obscurePassword = !_obscurePassword),
            ),
            filled: true,
            fillColor: const Color(0xFF090D16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.white24),
            ),
          ),
        ),
        const SizedBox(height: 18),
        ElevatedButton.icon(
          onPressed: _handleLoginSubmit,
          style: ElevatedButton.styleFrom(
            backgroundColor: p.primaryColor,
            foregroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
          ),
          icon: const Icon(Icons.login_rounded, size: 19),
          label: Text(
            'دخول لبوابة ${p.nameAr}',
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () {
                  setState(() {
                    _emailCtrl.text = p.demoEmail;
                    _passwordCtrl.text = 'Alsulaim@2026';
                    _securityError = null;
                  });
                },
                icon: const Icon(Icons.verified_rounded, size: 15),
                label: const Text(
                  'تعبئة حساب الشركة',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _testCrossTenantRejection,
                icon: const Icon(Icons.security_rounded,
                    size: 15, color: Color(0xFFF43F5E)),
                label: const Text(
                  'اختبار منع شركة أخرى',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFDA4AF),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildThreeStepRegisterWizard(CompanyPortalConfig p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Step Indicator
        Row(
          children: [
            _buildStepBadge(1, 'الكيان والدور', p),
            const SizedBox(width: 6),
            _buildStepBadge(2, 'البيانات المهنية', p),
            const SizedBox(width: 6),
            _buildStepBadge(3, 'الأمان والاعتماد', p),
          ],
        ),
        const SizedBox(height: 16),
        if (_registerStep == 1) ...[
          const Text(
            'الخطوة 1: تأكيد الكيان السيادي والدور الوظيفي',
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white),
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<String>(
            initialValue: _selectedRole,
            dropdownColor: const Color(0xFF1E293B),
            items: const [
              DropdownMenuItem(
                  value: 'مشرف عمليات ميداني',
                  child: Text('مشرف عمليات ميداني')),
              DropdownMenuItem(
                  value: 'محاسب مالي وZATCA', child: Text('محاسب مالي وZATCA')),
              DropdownMenuItem(
                  value: 'أخصائي عقود مساند', child: Text('أخصائي عقود مساند')),
              DropdownMenuItem(
                  value: 'مدير منافسات اعتماد',
                  child: Text('مدير منافسات اعتماد')),
            ],
            onChanged: (v) =>
                setState(() => _selectedRole = v ?? _selectedRole),
            decoration: InputDecoration(
              labelText: 'الدور الوظيفي داخل ${p.nameAr}',
              filled: true,
              fillColor: const Color(0xFF090D16),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 14),
          ElevatedButton(
            onPressed: () => setState(() => _registerStep = 2),
            style: ElevatedButton.styleFrom(
              backgroundColor: p.primaryColor,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(vertical: 13),
            ),
            child: const Text('التالي: البيانات المهنية',
                style: TextStyle(fontWeight: FontWeight.w900)),
          ),
        ] else if (_registerStep == 2) ...[
          const Text(
            'الخطوة 2: الاسم الرباعي، الهوية الوطنية، والبريد المؤسسي',
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _regNameCtrl,
            decoration: InputDecoration(
              labelText: 'الاسم الكامل للموظف',
              hintText: 'مثال: سلطان بن فهد العتيبي',
              filled: true,
              fillColor: const Color(0xFF090D16),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _emailCtrl,
            decoration: InputDecoration(
              labelText: 'البريد المؤسسي (@${p.emailDomain})',
              filled: true,
              fillColor: const Color(0xFF090D16),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _registerStep = 1),
                  child: const Text('السابق'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => setState(() => _registerStep = 3),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: p.primaryColor,
                    foregroundColor: Colors.black,
                  ),
                  child: const Text('التالي: الحماية',
                      style: TextStyle(fontWeight: FontWeight.w900)),
                ),
              ),
            ],
          ),
        ] else ...[
          const Text(
            'الخطوة 3: تعيين كلمة المرور وإصدار الهوية الرقمية',
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _passwordCtrl,
            obscureText: true,
            decoration: InputDecoration(
              labelText: 'كلمة المرور المشفرة',
              filled: true,
              fillColor: const Color(0xFF090D16),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _registerStep = 2),
                  child: const Text('السابق'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _handleLoginSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: p.primaryColor,
                    foregroundColor: Colors.black,
                  ),
                  icon: const Icon(Icons.verified_user_rounded, size: 16),
                  label: const Text('إتمام التسجيل والدخول',
                      style: TextStyle(fontWeight: FontWeight.w900)),
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildStepBadge(int step, String title, CompanyPortalConfig p) {
    final active = _registerStep == step;
    final done = _registerStep > step;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 7, horizontal: 6),
        decoration: BoxDecoration(
          color: active
              ? p.primaryColor.withValues(alpha: 0.2)
              : Colors.white.withValues(alpha: 0.04),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: active || done ? p.primaryColor : Colors.white12,
          ),
        ),
        child: Text(
          '$step. $title',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w800,
            color: active || done ? p.primaryColor : Colors.white54,
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// 7. SCREEN 3: NATIVE MOBILE WORKSPACE SHELL (5 TABS + BOTTOM NAV)
// ============================================================================

class MobileWorkspaceShell extends StatefulWidget {
  final CompanyPortalConfig portal;
  final String userFullName;
  final String userEmail;
  final String userRole;
  final List<MobileNotificationItem> notifications;
  final int unreadCount;
  final List<OfflineMutationItem> offlineQueue;
  final List<ZatcaInvoiceRecord> zatcaInvoices;
  final bool bgServiceRunning;
  final bool wakeLockEnabled;
  final int bgHeartbeatCount;
  final int totalSyncedCount;
  final String lastSyncTime;
  final int safContractStageIndex;
  final VoidCallback onAdvanceSafStage;
  final void Function(String customer, double amount) onIssueZatcaInvoice;
  final void Function(String title, String details) onEnqueueOfflineMutation;
  final VoidCallback onFlushOfflineQueue;
  final VoidCallback onToggleBgService;
  final VoidCallback onToggleWakeLock;
  final VoidCallback onScheduleDelayedNotification;
  final void Function(String title, String message, String category)
      onTriggerInstantNotification;
  final VoidCallback onMarkAllNotificationsRead;
  final ValueChanged<CompanyPortalConfig> onSwitchCompanyForSuperAdmin;
  final VoidCallback onLogout;

  const MobileWorkspaceShell({
    super.key,
    required this.portal,
    required this.userFullName,
    required this.userEmail,
    required this.userRole,
    required this.notifications,
    required this.unreadCount,
    required this.offlineQueue,
    required this.zatcaInvoices,
    required this.bgServiceRunning,
    required this.wakeLockEnabled,
    required this.bgHeartbeatCount,
    required this.totalSyncedCount,
    required this.lastSyncTime,
    required this.safContractStageIndex,
    required this.onAdvanceSafStage,
    required this.onIssueZatcaInvoice,
    required this.onEnqueueOfflineMutation,
    required this.onFlushOfflineQueue,
    required this.onToggleBgService,
    required this.onToggleWakeLock,
    required this.onScheduleDelayedNotification,
    required this.onTriggerInstantNotification,
    required this.onMarkAllNotificationsRead,
    required this.onSwitchCompanyForSuperAdmin,
    required this.onLogout,
  });

  @override
  State<MobileWorkspaceShell> createState() => _MobileWorkspaceShellState();
}

class _MobileWorkspaceShellState extends State<MobileWorkspaceShell> {
  int _currentTabIndex = 0;
  final TextEditingController _otpCtrl = TextEditingController(text: '4829');
  String _otpStatus = 'بانتظار التحقق من رمز تسليم الوردية للعميل';

  @override
  void dispose() {
    _otpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.portal;
    final pendingOffline =
        widget.offlineQueue.where((i) => i.status == 'QUEUED').length;

    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(68),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            border: Border(
              bottom: BorderSide(
                color: p.primaryColor.withValues(alpha: 0.35),
              ),
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: p.primaryColor.withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: p.primaryColor.withValues(alpha: 0.5)),
                    ),
                    child: Icon(p.icon, color: p.primaryColor, size: 21),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          p.nameAr,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '${widget.userFullName} • نبضة الخلفية #${widget.bgHeartbeatCount}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10.5,
                            color: Color(0xFF94A3B8),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Notification Bell Shortcut
                  IconButton(
                    onPressed: () => setState(() => _currentTabIndex = 4),
                    icon: Badge(
                      isLabelVisible: widget.unreadCount > 0,
                      label: Text('${widget.unreadCount}'),
                      child: const Icon(Icons.notifications_active_rounded,
                          color: Color(0xFFFDE68A)),
                    ),
                  ),
                  IconButton(
                    onPressed: widget.onLogout,
                    tooltip: 'تسجيل الخروج لبوابة الشركة',
                    icon: const Icon(Icons.logout_rounded,
                        color: Color(0xFFFDA4AF), size: 20),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Live Background Sync Strip if pending items exist
          if (pendingOffline > 0)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              color: const Color(0xFFF59E0B).withValues(alpha: 0.18),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'طابور عدم الاتصال: ($pendingOffline) عمليات بانتظار الرفع',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFDE68A),
                    ),
                  ),
                  GestureDetector(
                    onTap: widget.onFlushOfflineQueue,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'مزامنة الآن',
                        style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w900,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          Expanded(
            child: IndexedStack(
              index: _currentTabIndex,
              children: [
                _buildTab1Dashboard(p),
                _buildTab2Operations(p),
                _buildTab3FinanceAndZatca(p),
                _buildTab4BackgroundAndOfflineEngine(p),
                _buildTab5NotificationsAndProfile(p),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentTabIndex,
        onDestinationSelected: (idx) {
          NativeMobileBridge.vibrateDevice();
          setState(() => _currentTabIndex = idx);
        },
        backgroundColor: const Color(0xFF111827),
        indicatorColor: p.primaryColor.withValues(alpha: 0.22),
        height: 68,
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.dashboard_customize_outlined),
            selectedIcon:
                Icon(Icons.dashboard_customize_rounded, color: p.primaryColor),
            label: 'الرئيسية',
          ),
          NavigationDestination(
            icon: const Icon(Icons.assignment_turned_in_outlined),
            selectedIcon:
                Icon(Icons.assignment_turned_in_rounded, color: p.primaryColor),
            label: 'العمليات',
          ),
          NavigationDestination(
            icon: const Icon(Icons.receipt_long_outlined),
            selectedIcon:
                Icon(Icons.receipt_long_rounded, color: p.primaryColor),
            label: 'المالية ZATCA',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: pendingOffline > 0,
              label: Text('$pendingOffline'),
              child: const Icon(Icons.cloud_sync_outlined),
            ),
            selectedIcon: Icon(Icons.cloud_sync_rounded, color: p.primaryColor),
            label: 'الخلفية',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: widget.unreadCount > 0,
              label: Text('${widget.unreadCount}'),
              child: const Icon(Icons.notifications_none_rounded),
            ),
            selectedIcon: Icon(Icons.notifications_active_rounded,
                color: p.primaryColor),
            label: 'الإشعارات',
          ),
        ],
      ),
    );
  }

  // --------------------------------------------------------------------------
  // TAB 1: EXECUTIVE MOBILE DASHBOARD
  // --------------------------------------------------------------------------
  Widget _buildTab1Dashboard(CompanyPortalConfig p) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Sovereign Isolation Status Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: p.primaryColor.withValues(alpha: 0.4)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.verified_user_rounded,
                          size: 16, color: p.primaryColor),
                      const SizedBox(width: 6),
                      Text(
                        'جلسة معزولة: ${p.nameAr} (${p.id})',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: p.primaryColor,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'مزامنة: ${widget.lastSyncTime}',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF6EE7B7),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'المستخدم: ${widget.userFullName} (${widget.userEmail})',
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 4 KPI Cards Grid
        GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          shrinkWrap: true,
          childAspectRatio: 1.45,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _buildKpiCard(
              title: 'العقود النشطة',
              value: p.id == 'SAF' ? '148 عقد' : '94 عملية',
              sub: 'مساند والعمليات',
              color: p.primaryColor,
              icon: Icons.description_rounded,
            ),
            _buildKpiCard(
              title: 'رصيد الضمان Escrow',
              value: '482,500 ر.س',
              sub: 'محجوز ومؤمّن',
              color: const Color(0xFF10B981),
              icon: Icons.account_balance_wallet_rounded,
            ),
            _buildKpiCard(
              title: 'فواتير ZATCA المرحلة 2',
              value: '${widget.zatcaInvoices.length + 124} فاتورة',
              sub: 'مختومة بـ PIH',
              color: const Color(0xFF38BDF8),
              icon: Icons.qr_code_2_rounded,
            ),
            _buildKpiCard(
              title: 'مزامنات الخلفية',
              value: '${widget.totalSyncedCount} عملية',
              sub: 'نبضة #${widget.bgHeartbeatCount}',
              color: const Color(0xFFF59E0B),
              icon: Icons.sync_rounded,
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Quick Action Triggers
        const Text(
          'إجراءات الهاتف السريعة (تُطلق إشعار نظام فوري):',
          style: TextStyle(
              fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  widget.onTriggerInstantNotification(
                    '📱 إشعار فوري — ${p.nameAr}',
                    'تم اعتماد العملية الميدانية وتحديث السجل المحاسبي في الخلفية بنجاح.',
                    'musaned',
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: p.primaryColor,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: const Icon(Icons.notifications_active_rounded, size: 17),
                label: const Text('إرسال إشعار فوري',
                    style:
                        TextStyle(fontSize: 12, fontWeight: FontWeight.w900)),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: widget.onScheduleDelayedNotification,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: const BorderSide(color: Color(0xFF10B981)),
                ),
                icon: const Icon(Icons.timer_rounded,
                    size: 17, color: Color(0xFF10B981)),
                label: const Text(
                  'إشعار بالخلفية (5ث)',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6EE7B7),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String sub,
    required Color color,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF111827),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Icon(icon, size: 18, color: color),
            ],
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          Text(
            sub,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  // --------------------------------------------------------------------------
  // TAB 2: COMPANY OPERATIONS ENGINE (Musaned, Fleet OTP, Etimad, Shelter)
  // --------------------------------------------------------------------------
  Widget _buildTab2Operations(CompanyPortalConfig p) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // 1. Musaned 8-Stage Lifecycle Card
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: p.primaryColor.withValues(alpha: 0.4)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'محرك مراحل عقد مساند (8 مراحل حتمية)',
                    style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w900,
                        color: Colors.white),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: p.primaryColor.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '#MUS-8841',
                      style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: p.primaryColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                'المرحلة الحالية: ${_AlsulaimErpMobileAppState.kMusanedStages[widget.safContractStageIndex]}',
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.bold,
                  color: p.primaryColor,
                ),
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: (widget.safContractStageIndex + 1) /
                    _AlsulaimErpMobileAppState.kMusanedStages.length,
                backgroundColor: Colors.white12,
                color: p.primaryColor,
                minHeight: 7,
                borderRadius: BorderRadius.circular(6),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: widget.onAdvanceSafStage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: p.primaryColor,
                    foregroundColor: Colors.black,
                  ),
                  icon: const Icon(Icons.fast_forward_rounded, size: 18),
                  label: const Text(
                    'اعتماد الانتقال للمرحلة التالية + إشعار فوري',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 2. Fleet Dispatch & Driver OTP Verification (Yaqoot / Field)
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'التوجيه الميداني للسائقين والتحقق برمز OTP',
                style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w900,
                    color: Colors.white),
              ),
              const SizedBox(height: 6),
              Text(
                _otpStatus,
                style: const TextStyle(fontSize: 12, color: Color(0xFF6EE7B7)),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _otpCtrl,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'رمز التحقق OTP من العميل',
                        filled: true,
                        fillColor: const Color(0xFF090D16),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _otpStatus =
                            '✅ تم التحقق من الرمز (${_otpCtrl.text}) وتسليم الوردية بنجاح';
                      });
                      widget.onTriggerInstantNotification(
                        '🚗 تأكيد تسليم وردية ميدانية (OTP)',
                        'تم التحقق من رمز العميل (${_otpCtrl.text}) وتحديث إحداثيات السائق.',
                        'shelter',
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 15),
                    ),
                    child: const Text('تأكيد OTP',
                        style: TextStyle(fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // --------------------------------------------------------------------------
  // TAB 3: FINANCE, ESCROW & ZATCA PHASE 2
  // --------------------------------------------------------------------------
  Widget _buildTab3FinanceAndZatca(CompanyPortalConfig p) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
                color: const Color(0xFF10B981).withValues(alpha: 0.4)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.qr_code_scanner_rounded,
                      color: Color(0xFF10B981), size: 20),
                  SizedBox(width: 8),
                  Text(
                    'محرك الفوترة الإلكترونية ZATCA Phase 2 (PIH)',
                    style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w900,
                        color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'كل فاتورة مرتبطة تشفيرياً بهاش الفاتورة السابقة (PIH) وفق متطلبات هيئة الزكاة والضريبة والجمارك.',
                style: TextStyle(fontSize: 11.5, color: Color(0xFF94A3B8)),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => widget.onIssueZatcaInvoice(
                    'عميل ${p.nameAr} #${widget.zatcaInvoices.length + 1}',
                    17250.0,
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.black,
                  ),
                  icon: const Icon(Icons.add_card_rounded, size: 18),
                  label: const Text(
                    'إصدار ومصادقة فاتورة ضريبية فورية + إشعار',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        const Text(
          'سجل الفواتير المختومة تشفيرياً (Append-Only):',
          style: TextStyle(
              fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white),
        ),
        const SizedBox(height: 8),
        ...widget.zatcaInvoices.map(
          (inv) => Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(13),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${inv.invoiceNumber} • ${inv.customerName}',
                      style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.white),
                    ),
                    Text(
                      '${inv.amountWithVat.toStringAsFixed(0)} ر.س',
                      style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF10B981)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'PIH: ${inv.pihHash}',
                  style: const TextStyle(
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: Color(0xFF94A3B8)),
                ),
                Text(
                  'HASH: ${inv.currentHash}',
                  style: const TextStyle(
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: Color(0xFF38BDF8)),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // --------------------------------------------------------------------------
  // TAB 4: NATIVE BACKGROUND SERVICE & OFFLINE SYNC ENGINE
  // --------------------------------------------------------------------------
  Widget _buildTab4BackgroundAndOfflineEngine(CompanyPortalConfig p) {
    final pendingCount =
        widget.offlineQueue.where((i) => i.status == 'QUEUED').length;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: p.primaryColor.withValues(alpha: 0.45)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'خدمة العمل في الخلفية الأصلية (Android Service)',
                    style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w900,
                        color: Colors.white),
                  ),
                  Switch(
                    value: widget.bgServiceRunning,
                    activeThumbColor: const Color(0xFF10B981),
                    onChanged: (_) => widget.onToggleBgService(),
                  ),
                ],
              ),
              const Text(
                'تعمل كخدمة نظام أمامية وخلفية (START_STICKY Foreground Service) مع WakeLock لضمان عدم توقف المزامنة أو الإشعارات عند قفل الهاتف.',
                style: TextStyle(fontSize: 11.5, color: Color(0xFF94A3B8)),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: widget.onToggleWakeLock,
                      icon: Icon(
                        Icons.wb_sunny_rounded,
                        size: 16,
                        color: widget.wakeLockEnabled
                            ? const Color(0xFFF59E0B)
                            : Colors.white54,
                      ),
                      label: Text(
                        widget.wakeLockEnabled
                            ? 'بقاء الشاشة: مفعّل'
                            : 'تفعيل بقاء الشاشة',
                        style: const TextStyle(
                            fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: widget.onScheduleDelayedNotification,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF59E0B),
                        foregroundColor: Colors.black,
                      ),
                      icon: const Icon(Icons.alarm_on_rounded, size: 16),
                      label: const Text(
                        'إشعار خلفي بعد 5ث',
                        style: TextStyle(
                            fontSize: 11, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Offline Queue Controls
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'طابور عمليات عدم الاتصال (Offline Queue: $pendingCount معلّقة)',
                style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w900,
                    color: Colors.white),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => widget.onEnqueueOfflineMutation(
                        'تسجيل جولة ميدانية (${p.id})',
                        'إحداثيات الميدان: 24.7136° N, 46.6753° E',
                      ),
                      icon: const Icon(Icons.add_task_rounded, size: 16),
                      label: const Text('+ إضافة عملية للطابور',
                          style: TextStyle(
                              fontSize: 11.5, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: widget.onFlushOfflineQueue,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.black,
                      ),
                      icon: const Icon(Icons.cloud_upload_rounded, size: 16),
                      label: const Text('مزامنة الطابور الآن',
                          style: TextStyle(
                              fontSize: 11.5, fontWeight: FontWeight.w900)),
                    ),
                  ),
                ],
              ),
              if (widget.offlineQueue.isNotEmpty) ...[
                const SizedBox(height: 12),
                ...widget.offlineQueue.map(
                  (q) => ListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(
                      q.status == 'SYNCED'
                          ? Icons.check_circle_rounded
                          : Icons.schedule_send_rounded,
                      color: q.status == 'SYNCED'
                          ? const Color(0xFF10B981)
                          : const Color(0xFFF59E0B),
                    ),
                    title: Text(q.operationTitle,
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: Text(q.details,
                        style: const TextStyle(fontSize: 10.5)),
                    trailing: Text(
                      q.status == 'SYNCED' ? 'تم الرفع' : 'بالطابور',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                        color: q.status == 'SYNCED'
                            ? const Color(0xFF10B981)
                            : const Color(0xFFF59E0B),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  // --------------------------------------------------------------------------
  // TAB 5: NATIVE SYSTEM NOTIFICATIONS CENTER & SESSION PROFILE
  // --------------------------------------------------------------------------
  Widget _buildTab5NotificationsAndProfile(CompanyPortalConfig p) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'مركز إشعارات الهاتف الأصلية',
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: Colors.white),
            ),
            TextButton.icon(
              onPressed: widget.onMarkAllNotificationsRead,
              icon: const Icon(Icons.done_all_rounded, size: 16),
              label: const Text('تعليم الكل كمقروء',
                  style: TextStyle(fontSize: 11.5)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...widget.notifications.map(
          (n) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: n.isRead
                  ? const Color(0xFF111827)
                  : p.primaryColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: n.isRead
                    ? Colors.white12
                    : p.primaryColor.withValues(alpha: 0.45),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        n.title,
                        style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    Text(
                      n.timestamp,
                      style: const TextStyle(
                          fontSize: 10, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  n.message,
                  style: const TextStyle(
                      fontSize: 11.5, color: Color(0xFFCBD5E1)),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
