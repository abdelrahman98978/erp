import 'package:flutter/material.dart';

/// Exact Portal Model from `src/pages/LoginPage.tsx` (`SYSTEM_PORTALS`) & `src/pages/LandingPage.tsx` (`companies`)
class SystemPortalOption {
  final String id;
  final String key;
  final String companyId; // 'SAF' | 'YAQ' | 'TOP' | 'KAS' | 'DAR' | 'all'
  final String companyCodeBadge; // e.g. 'COMPANY 01 [SAF]'
  final String nameAr;
  final String nameEn;
  final String category; // 'شركات المجموعة' | 'البوابات الرقمية' | 'الإدارة والسيطرة'
  final String license;
  final String sectorTagAr;
  final String badge;
  final String desc;
  final String stats;
  final Color themeColor;
  final String emailDomain;
  final String routePath;
  final String assetLogo;
  final String targetTab;
  final String targetTitle;
  final String demoEmail;
  final String demoEmployeeName;
  final String demoRole;
  final IconData icon;

  const SystemPortalOption({
    required this.id,
    required this.key,
    required this.companyId,
    required this.companyCodeBadge,
    required this.nameAr,
    required this.nameEn,
    required this.category,
    required this.license,
    required this.sectorTagAr,
    required this.badge,
    required this.desc,
    required this.stats,
    required this.themeColor,
    required this.emailDomain,
    required this.routePath,
    required this.assetLogo,
    required this.targetTab,
    required this.targetTitle,
    required this.demoEmail,
    required this.demoEmployeeName,
    required this.demoRole,
    required this.icon,
  });
}

/// Exact App Tile Model from `src/pages/AppLauncherPage.tsx` (`ALL_SYSTEM_APPS`)
class ErpAppTile {
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final String href;
  final String category; // 'operations' | 'finance' | 'crm' | 'hr' | 'governance'
  final String categoryLabel;
  final String? metricBadge;
  final String? exclusiveToCompany;

  const ErpAppTile({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.href,
    required this.category,
    required this.categoryLabel,
    this.metricBadge,
    this.exclusiveToCompany,
  });
}

/// Exact Sidebar Tree Item Model from `src/data/sidebarMenu.ts` (`SIDEBAR_MENU`)
class ErpSidebarItem {
  final String id;
  final String title;
  final IconData icon;
  final String? href;
  final String? badge;
  final String? badgeType; // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  final String? exclusiveToCompany;
  final List<ErpSidebarItem> children;

  const ErpSidebarItem({
    required this.id,
    required this.title,
    required this.icon,
    this.href,
    this.badge,
    this.badgeType,
    this.exclusiveToCompany,
    this.children = const [],
  });
}

class ErpBranchOption {
  final String id;
  final String name;
  final String city;

  const ErpBranchOption({
    required this.id,
    required this.name,
    required this.city,
  });
}

class ErpOperationalRecord {
  final String id;
  final String companyId;
  final String moduleKey; // 'contracts' | 'orders' | 'rent' | 'cvs' | 'shelter' | 'kas' | 'finance' | 'clients' | 'hr' | 'complaints'
  final String title;
  final String subtitle;
  final String status;
  final String badgeText;
  final String amountOrMetric;
  final String updatedAt;

  const ErpOperationalRecord({
    required this.id,
    required this.companyId,
    required this.moduleKey,
    required this.title,
    required this.subtitle,
    required this.status,
    required this.badgeText,
    required this.amountOrMetric,
    required this.updatedAt,
  });
}

class ErpSystemData {
  ErpSystemData._();

  /// Exact `SYSTEM_PORTALS` from `src/pages/LoginPage.tsx` & `LandingPage.tsx`
  static const List<SystemPortalOption> systemPortals = [
    SystemPortalOption(
      id: 'saf',
      key: 'saf',
      companyId: 'SAF',
      companyCodeBadge: 'COMPANY 01 [SAF]',
      nameAr: 'شركة السفير الماسي للاستقدام',
      nameEn: 'Al-Safeer Al-Masi Recruitment Co.',
      category: 'شركات المجموعة',
      license: 'ترخيص مساند RC01 • س.ت 1010123456',
      sectorTagAr: 'استقدام العمالة المنزلية والمهنية',
      badge: 'عقود الاستقدام مساند',
      desc: 'بوابة متكاملة لإدارة عقود استقدام الأفراد، إصدار التأشيرات الفورية، التوثيق عبر مساند، وبوالص التأمين الشاملة.',
      stats: '1,420+ عقد نشط',
      themeColor: Color(0xFF0284C7),
      emailDomain: 'saf-rec.sa',
      routePath: '/login/saf',
      assetLogo: 'assets/alsulaim-gold-emblem.png',
      targetTab: 'recruitment-contracts',
      targetTitle: 'عقود استقدام مساند - شركة السفير الماسي',
      demoEmail: 'admin@saf-rec.sa',
      demoEmployeeName: 'م. سلطان خالد السليم',
      demoRole: 'مدير عمليات الاستقدام ومساند',
      icon: Icons.verified_user_rounded,
    ),
    SystemPortalOption(
      id: 'yaq',
      key: 'yaq',
      companyId: 'YAQ',
      companyCodeBadge: 'COMPANY 02 [YAQ]',
      nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
      nameEn: 'Yaqoot Eastern Operation & Rental Co.',
      category: 'شركات المجموعة',
      license: 'ترخيص مساند RC02 • س.ت 1010543210',
      sectorTagAr: 'باقات التأجير المرن بالساعة والشهر',
      badge: 'التأجير والتشغيل المرن',
      desc: 'حلول تشغيلية مرنة لقطاع الأعمال وباقات تأجير الكوادر المهنية والعمالة المنزلية المعتمدة.',
      stats: '890+ عقد إيجار',
      themeColor: Color(0xFFE11D48),
      emailDomain: 'yaqoot-ops.sa',
      routePath: '/login/yaq',
      assetLogo: 'assets/logos/yaqoot.png',
      targetTab: 'rent-contracts',
      targetTitle: 'عقود التأجير والتشغيل - شركة الياقوت',
      demoEmail: 'ops@yaqoot-ops.sa',
      demoEmployeeName: 'أ. فيصل الدوسري',
      demoRole: 'مدير التشغيل والأسطول المرن',
      icon: Icons.directions_car_filled_rounded,
    ),
    SystemPortalOption(
      id: 'top',
      key: 'top',
      companyId: 'TOP',
      companyCodeBadge: 'COMPANY 03 [TOP]',
      nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
      nameEn: 'Top Talent ATS & Recruitment Co.',
      category: 'شركات المجموعة',
      license: 'ترخيص مساند RC03 • س.ت 1010776543',
      sectorTagAr: 'استقطاب الكفاءات التنفيذية والتوظيف',
      badge: 'التوظيف الذكي و ATS',
      desc: 'منظومة الفرز والتوظيف الذكي ATS، استيراد السير بالدفعة، وشبكة مكاتب التوظيف في 14 دولة.',
      stats: '3,250+ سيرة ذاتية',
      themeColor: Color(0xFF7C3AED),
      emailDomain: 'topaz-rec.sa',
      routePath: '/login/top',
      assetLogo: 'assets/logos/topaz.png',
      targetTab: 'ats-pipeline',
      targetTitle: 'منظومة ATS والفرز الوظيفي - توب تالنت',
      demoEmail: 'talent@topaz-rec.sa',
      demoEmployeeName: 'أ. نورة العتيبي',
      demoRole: 'مديرة استقطاب الكفاءات والـ ATS',
      icon: Icons.psychology_alt_rounded,
    ),
    SystemPortalOption(
      id: 'kas',
      key: 'kas',
      companyId: 'KAS',
      companyCodeBadge: 'COMPANY 04 [KAS]',
      nameAr: 'شركة كاس للمنافسات والتشغيل',
      nameEn: 'KAS Trading & Etmad Enterprise Suite',
      category: 'شركات المجموعة',
      license: 'سجل تجاري 1010789234 • ضريبي 310284759200003',
      sectorTagAr: 'منافسات اعتماد وجداول الكميات BOQ',
      badge: 'منافسات اعتماد وجداول BOQ',
      desc: 'بوابة مستقلة ومعزولة كلياً لإدارة منافسات اعتماد، جداول الكميات الذكية BOQ، الفوترة المشفرة ZATCA، وسجل الموردين.',
      stats: '2,650+ منافسة اعتماد',
      themeColor: Color(0xFFD97706),
      emailDomain: 'kas-etimad.sa',
      routePath: '/login/kas',
      assetLogo: 'assets/logo.png',
      targetTab: 'kas-suite',
      targetTitle: 'البوابة المستقلة لشركة كاس (KAS Suite)',
      demoEmail: 'tenders@kas-etimad.sa',
      demoEmployeeName: 'م. عبدالرحمن القحطاني',
      demoRole: 'مدير منافسات اعتماد وجداول BOQ',
      icon: Icons.account_balance_rounded,
    ),
    SystemPortalOption(
      id: 'shelter',
      key: 'shelter',
      companyId: 'DAR',
      companyCodeBadge: 'FACILITY 05 [SHELTER]',
      nameAr: 'دار الرواد لمراكز الإيواء والتسكين والرعاية',
      nameEn: 'Dar Al-Ruwad Shelter, Housing & Care Suite (HRSD)',
      category: 'شركات المجموعة',
      license: 'ترخيص مراكز الإيواء HRSD-MOL • س.ت 1010642918',
      sectorTagAr: 'إدارة الإيواء والإعاشة والترحيل النظامي',
      badge: 'ترخيص مراكز الإيواء HRSD',
      desc: 'بوابة إدارة غرف وأسرة الإيواء والضيافة، المتابعة الصحية والغذائية، وإجراءات الترحيل الممتثلة لمعايير وزارة الموارد البشرية.',
      stats: '120 سرير • امتثال 100%',
      themeColor: Color(0xFF0D9488),
      emailDomain: 'alruwad.sa',
      routePath: '/login/shelter',
      assetLogo: 'assets/logos/ruwad.png',
      targetTab: 'shelter-suite',
      targetTitle: 'منظومة وبوابة مراكز الإيواء والتسكين المستقلة',
      demoEmail: 'warden@alruwad.sa',
      demoEmployeeName: 'أ. سارة الشهري',
      demoRole: 'مشرفة مركز الإيواء والرعاية HRSD',
      icon: Icons.night_shelter_rounded,
    ),
    SystemPortalOption(
      id: 'admin',
      key: 'admin',
      companyId: 'all',
      companyCodeBadge: 'EXECUTIVE [GROUP]',
      nameAr: 'الإدارة المركزية والسيطرة العليا',
      nameEn: 'Executive Command & Super Admin',
      category: 'الإدارة والسيطرة',
      license: 'مجموعة خالد السليم القابضة الموحدة',
      sectorTagAr: 'الحوكمة المركزية والمراقبة المالية الشاملة',
      badge: 'القيادة المركزية الموحدة',
      desc: 'مركز القيادة الموحد لمجلس الإدارة والرقابة المالية الشاملة عبر كافة شركات المجموعة.',
      stats: '5 شركات • حوكمة 100%',
      themeColor: Color(0xFFC5A059),
      emailDomain: 'alsulaim.sa',
      routePath: '/login/admin',
      assetLogo: 'assets/alsulaim-gold-emblem.png',
      targetTab: 'dashboard',
      targetTitle: 'الرئيسية والمؤشرات التشغيلية',
      demoEmail: 'chairman@alsulaim.sa',
      demoEmployeeName: 'الشيخ خالد السليم',
      demoRole: 'رئيس مجلس الإدارة (Group Super Admin)',
      icon: Icons.shield_rounded,
    ),
    SystemPortalOption(
      id: 'client',
      key: 'client',
      companyId: 'SAF',
      companyCodeBadge: 'PORTAL [CLIENT]',
      nameAr: 'بوابة العملاء والخدمة الذاتية',
      nameEn: 'Client Self-Service Portal',
      category: 'البوابات الرقمية',
      license: 'بوابة المستفيدين والمتابعة 24/7',
      sectorTagAr: 'تتبع العقود والفواتير والضمان الذاتي',
      badge: 'بوابة المستفيدين 24/7',
      desc: 'متابعة حالة العقد، الفواتير الضريبية، وشهادة ضمان الـ 90 يوماً مباشرة.',
      stats: 'خدمة ذاتية فورية',
      themeColor: Color(0xFF0284C7),
      emailDomain: 'saf-rec.sa',
      routePath: '/login/client',
      assetLogo: 'assets/alsulaim-gold-emblem.png',
      targetTab: 'client-portal',
      targetTitle: 'بوابة خدمة وتتبع عقود العملاء',
      demoEmail: 'client@saf-rec.sa',
      demoEmployeeName: 'أ. محمد بن عبدالعزيز',
      demoRole: 'عميل مستفيد موثق',
      icon: Icons.person_pin_rounded,
    ),
    SystemPortalOption(
      id: 'agent',
      key: 'agent',
      companyId: 'SAF',
      companyCodeBadge: 'PORTAL [AGENT]',
      nameAr: 'بوابة الوكلاء والمكاتب الخارجية الدولية',
      nameEn: 'International Agency & Partner Portal',
      category: 'البوابات الرقمية',
      license: 'بوابة الوكالات والشركاء المعتمدين',
      sectorTagAr: 'رفع السير الذاتية والفحص الطبي والتفييز',
      badge: '14 دولة شريكة',
      desc: 'رفع دفعات السير الذاتية، مطابقة الفحص الطبي، وتحديث بيانات تذاكر الطيران.',
      stats: '48 مكتب دولي',
      themeColor: Color(0xFF2563EB),
      emailDomain: 'saf-rec.sa',
      routePath: '/login/agent',
      assetLogo: 'assets/logos/saf.png',
      targetTab: 'foreign-agency-portal',
      targetTitle: 'بوابة الوكلاء والمكاتب الخارجية',
      demoEmail: 'partner@saf-rec.sa',
      demoEmployeeName: 'Manila Global Agency',
      demoRole: 'وكيل خارجي معتمد',
      icon: Icons.public_rounded,
    ),
    SystemPortalOption(
      id: 'ecommerce',
      key: 'ecommerce',
      companyId: 'SAF',
      companyCodeBadge: 'PORTAL [STORES]',
      nameAr: 'بوابة المتاجر الإلكترونية وقنوات البيع',
      nameEn: 'E-Commerce & Omnichannel Stores Hub',
      category: 'البوابات الرقمية',
      license: 'سلة • زد • شوبيفاي • ووكومرس • ميسر',
      sectorTagAr: 'المزامنة الفورية للباقات والمدفوعات',
      badge: 'سلة • زد • شوبيفاي',
      desc: 'ربط ومزامنة الباقات والمدفوعات الإلكترونية مع متاجر سلة وزد وشوبيفاي.',
      stats: 'مزامنة لحظية',
      themeColor: Color(0xFF059669),
      emailDomain: 'saf-rec.sa',
      routePath: '/login/ecommerce',
      assetLogo: 'assets/alsulaim-gold-emblem.png',
      targetTab: 'smacc-modules',
      targetTitle: 'ربط وتزامن المتاجر الإلكترونية',
      demoEmail: 'stores@saf-rec.sa',
      demoEmployeeName: 'م. طارق الشمري',
      demoRole: 'مسؤول التجارة الإلكترونية وبوابات الدفع',
      icon: Icons.storefront_rounded,
    ),
  ];

  static List<SystemPortalOption> get mainSubsidiaryCompanies =>
      systemPortals.where((p) => p.category == 'شركات المجموعة').toList();

  static SystemPortalOption resolvePortalByCode(String? rawCode) {
    if (rawCode == null || rawCode.trim().isEmpty) return systemPortals.first;
    final clean = rawCode.trim().toLowerCase();
    if (clean == 'all' || clean == 'group') {
      return systemPortals.firstWhere((p) => p.id == 'admin', orElse: () => systemPortals.first);
    }
    if (clean == 'dar') {
      return systemPortals.firstWhere((p) => p.id == 'shelter', orElse: () => systemPortals.first);
    }
    return systemPortals.firstWhere(
      (p) =>
          p.id.toLowerCase() == clean ||
          p.key.toLowerCase() == clean ||
          p.companyId.toLowerCase() == clean,
      orElse: () => systemPortals.first,
    );
  }

  /// Branches from `src/components/layout/Header.tsx`
  static const List<ErpBranchOption> branches = [
    ErpBranchOption(id: 'main', name: 'الفرع الرئيسي', city: 'الرياض - طريق الملك فهد'),
    ErpBranchOption(id: 'riyadh_takhassusi', name: 'فرع الرياض (التخصصي)', city: 'الرياض'),
    ErpBranchOption(id: 'jeddah', name: 'فرع جدة', city: 'طريق المدينة المنورة'),
    ErpBranchOption(id: 'dammam', name: 'فرع الدمام', city: 'شارع الملك سعود'),
    ErpBranchOption(id: 'khamis', name: 'فرع خميس مشيط', city: 'طريق الملك فهد'),
    ErpBranchOption(id: 'online', name: 'الموقع الخارجي (البوابة)', city: 'أونلاين'),
  ];

  /// Exact `ALL_SYSTEM_APPS` from `src/pages/AppLauncherPage.tsx`
  static const List<ErpAppTile> allSystemApps = [
    ErpAppTile(
      id: 'dashboard',
      title: 'الرئيسية (لوحة المؤشرات و SMACC)',
      subtitle: 'لوحة التحكم الهيكلية SMACC والمؤشرات الفورية للعقود والطلبات.',
      icon: Icons.dashboard_rounded,
      href: 'dashboard',
      category: 'operations',
      categoryLabel: 'القيادة والمؤشرات',
      metricBadge: 'مباشر الآن',
    ),
    ErpAppTile(
      id: 'recruitment-contracts',
      title: 'عقود الاستقدام الموثقة (مساند)',
      subtitle: 'إدارة عقود الاستقدام، الربط الحي مع مساند، وتتبع مراحل التفييز والتذاكر.',
      icon: Icons.handshake_rounded,
      href: 'recruitment-contracts',
      category: 'operations',
      categoryLabel: 'العمليات والعقود',
      metricBadge: '121 عقد نشط',
    ),
    ErpAppTile(
      id: 'orders',
      title: 'طلبات العملاء والعمليات (SLA)',
      subtitle: 'استقبال طلبات الاستقدام الجديدة، مؤقتات الـ SLA، والتحويل الفوري لعقود.',
      icon: Icons.shopping_bag_rounded,
      href: 'orders',
      category: 'operations',
      categoryLabel: 'العمليات والعقود',
      metricBadge: '48 طلب جديد',
    ),
    ErpAppTile(
      id: 'cvs',
      title: 'بنك السير الذاتية (CVs)',
      subtitle: 'فلترة وتصنيف الكوادر البشرية، السير المحجوزة، والمتاحة للاختيار.',
      icon: Icons.badge_rounded,
      href: 'cvs-recruitment',
      category: 'operations',
      categoryLabel: 'الكوادر والتشغيل',
      metricBadge: '163 سيرة جاهزة',
    ),
    ErpAppTile(
      id: 'rent-contracts',
      title: 'عقود التأجير والتشغيل المرن',
      subtitle: 'إدارة عقود الإيجار الشهرية والسنوية ومتابعة التسليم والدفعات.',
      icon: Icons.layers_rounded,
      href: 'rent-contracts',
      category: 'operations',
      categoryLabel: 'التأجير والتشغيل',
      metricBadge: '34 عقد إيجار',
    ),
    ErpAppTile(
      id: 'kas-suite',
      title: 'البوابة المستقلة لشركة كاس (KAS Suite)',
      subtitle: 'منظومة معزولة كلياً: منصة اعتماد، جداول الكميات BOQ، سجل الموردين، والفوترة ZATCA.',
      icon: Icons.business_center_rounded,
      href: 'kas-suite',
      category: 'governance',
      categoryLabel: 'الأجنحة المستقلة والمنافسات',
      metricBadge: 'جناح مستقل KAS',
      exclusiveToCompany: 'KAS',
    ),
    ErpAppTile(
      id: 'rent-packages',
      title: 'باقات وأسعار التأجير',
      subtitle: 'تسعير مدد التأجير (شهر، 3 أشهر، سنة) واحتساب ضريبة القيمة المضافة.',
      icon: Icons.inventory_2_rounded,
      href: 'rent-packages',
      category: 'operations',
      categoryLabel: 'التأجير والتشغيل',
      metricBadge: '12 باقة نشطة',
    ),
    ErpAppTile(
      id: 'ingaz',
      title: 'تفاويض الإنجاز والتأشيرات',
      subtitle: 'إصدار وتوثيق تفاويض إنجاز الإلكترونية والربط مع السفارات الخارجية.',
      icon: Icons.verified_rounded,
      href: 'ingaz',
      category: 'operations',
      categoryLabel: 'التأشيرات والربط',
      metricBadge: '29 تفويض موثق',
    ),
    ErpAppTile(
      id: 'shelter',
      title: 'منظومة مراكز الإيواء والسكن المستقلة',
      subtitle: 'بوابة متكاملة مستقلة: إدارة الغرف، الأسرة، التغذية، العيادة الطبية، والترحيل (HRSD).',
      icon: Icons.hotel_rounded,
      href: 'shelter-suite',
      category: 'operations',
      categoryLabel: 'الخدمات اللوجستية والإيواء',
      metricBadge: 'منظومة مستقلة • 9 أقسام',
    ),
    ErpAppTile(
      id: 'sponsorship-transfer',
      title: 'نقل الخدمات والتنازل وفترة التجربة',
      subtitle: 'إدارة عقود التنازل ونقل الخدمات المعتمدة، فترات التجربة النظامية، والتسويات المالية.',
      icon: Icons.sync_alt_rounded,
      href: 'sponsorship-transfer',
      category: 'operations',
      categoryLabel: 'نقل الخدمات والتنازل',
      metricBadge: '8 قيد فترة التجربة',
    ),
    ErpAppTile(
      id: 'travel',
      title: 'الرحلات الجوية واللوجستيات',
      subtitle: 'جدولة رحلات الوصول والاستقبال بالمطار، حجوزات التذاكر، وتتبع الترحيل.',
      icon: Icons.flight_land_rounded,
      href: 'travel',
      category: 'operations',
      categoryLabel: 'الخدمات اللوجستية',
      metricBadge: '14 رحلة قادمة',
    ),
    ErpAppTile(
      id: 'ats-pipeline',
      title: 'منظومة الفرز والتوظيف الذكي (ATS)',
      subtitle: 'تقييم المرشحين بالذكاء الاصطناعي ومطابقة المهارات الوظيفية.',
      icon: Icons.psychology_rounded,
      href: 'ats-pipeline',
      category: 'operations',
      categoryLabel: 'التوظيف الذكي',
      metricBadge: 'فرز ذكي AI',
    ),
    // 2. Finance & Accounting
    ErpAppTile(
      id: 'finance',
      title: 'المحاسبة العامة (General Ledger)',
      subtitle: 'دليل الحسابات الشجري، قيود اليومية، موازين المراجعة، والقوائم الختامية.',
      icon: Icons.account_balance_wallet_rounded,
      href: 'finance-home',
      category: 'finance',
      categoryLabel: 'المالية والمحاسبة',
      metricBadge: 'محدث لحظياً',
    ),
    ErpAppTile(
      id: 'zatca',
      title: 'الفوترة الإلكترونية (ZATCA Phase 2)',
      subtitle: 'إصدار الفواتير الضريبية والمبسطة المتوافقة مع المرحلة الثانية لهيئة الزكاة.',
      icon: Icons.qr_code_2_rounded,
      href: 'zatca',
      category: 'finance',
      categoryLabel: 'الفوترة والزكاة',
      metricBadge: '100% امتثال',
    ),
    ErpAppTile(
      id: 'journals',
      title: 'قيود اليومية والسندات (Append-Only)',
      subtitle: 'إنشاء ومراجعة القيود المحاسبية وسندات القبض والصرف والقيود العكسية.',
      icon: Icons.menu_book_rounded,
      href: 'journals',
      category: 'finance',
      categoryLabel: 'المالية والمحاسبة',
      metricBadge: '1,420 قيد',
    ),
    ErpAppTile(
      id: 'cost-centers',
      title: 'مراكز التكلفة والأرباح',
      subtitle: 'توزيع المصروفات والإيرادات على الفروع والمشاريع واستخراج تقارير الربحية.',
      icon: Icons.hub_rounded,
      href: 'cost-centers',
      category: 'finance',
      categoryLabel: 'المالية والمحاسبة',
      metricBadge: '8 مراكز تكلفة',
    ),
    ErpAppTile(
      id: 'financial-requests',
      title: 'الطلبات المالية والتشغيلية والعهد',
      subtitle: 'طلبات سداد مساند، رسوم الإقامات والجوازات، ودفعات الوكلاء الخارجيين.',
      icon: Icons.credit_card_rounded,
      href: 'financial-requests',
      category: 'finance',
      categoryLabel: 'المالية والمدفوعات',
      metricBadge: '16 طلب سداد',
    ),
    // 3. CRM & Communication
    ErpAppTile(
      id: 'crm',
      title: 'إدارة علاقات العملاء (CRM)',
      subtitle: 'سجل العملاء، التصنيفات، التقييم الائتماني، وتاريخ المعاملات الموحد.',
      icon: Icons.people_alt_rounded,
      href: 'clients',
      category: 'crm',
      categoryLabel: 'العملاء والمبيعات',
      metricBadge: '241 عميل نشط',
    ),
    ErpAppTile(
      id: 'whatsapp-inbox',
      title: 'صندوق واتساب الموحد واللايف شات',
      subtitle: 'الرد الفوري على العملاء وتوزيع المحادثات على موظفي خدمة العملاء.',
      icon: Icons.chat_rounded,
      href: 'whatsapp-inbox',
      category: 'crm',
      categoryLabel: 'التواصل الموحد',
      metricBadge: '8 محادثات نشطة',
    ),
    ErpAppTile(
      id: 'complaints',
      title: 'إدارة الشكاوى والنزاعات والتعويضات',
      subtitle: 'تذاكر الدعم الفني، تسوية النزاعات، واحتساب تعويضات ضمان الـ 90 يوماً.',
      icon: Icons.support_agent_rounded,
      href: 'complaints',
      category: 'crm',
      categoryLabel: 'خدمة العملاء',
      metricBadge: '4 تذاكر مفتوحة',
    ),
    // 4. HR & WPS
    ErpAppTile(
      id: 'employees',
      title: 'الموارد البشرية ومسير الرواتب (WPS)',
      subtitle: 'سجل الموظفين، حماية الأجور، الإجازات، ومكافأة نهاية الخدمة.',
      icon: Icons.badge_outlined,
      href: 'employees',
      category: 'hr',
      categoryLabel: 'الموارد البشرية',
      metricBadge: 'حماية الأجور WPS',
    ),
    ErpAppTile(
      id: 'attendances',
      title: 'الحضور والانصراف والبصمة الذكية',
      subtitle: 'تسجيل الحضور الجغرافي والبيومتري وتقارير الدوام اليومية.',
      icon: Icons.fingerprint_rounded,
      href: 'attendances',
      category: 'hr',
      categoryLabel: 'الموارد البشرية',
      metricBadge: 'بصمة ذكية',
    ),
    ErpAppTile(
      id: 'employee-monitoring',
      title: 'مراقبة الأداء والنشاط والمشاعر (Pulse)',
      subtitle: 'نبض سعادة الموظفين ومؤشرات الإنتاجية اللحظية.',
      icon: Icons.monitor_heart_rounded,
      href: 'employee-monitoring',
      category: 'hr',
      categoryLabel: 'الموارد البشرية',
      metricBadge: 'نبض حي',
    ),
    // 5. Governance & Executive
    ErpAppTile(
      id: 'group-command-center',
      title: 'مركز القيادة الموحد للمجموعة',
      subtitle: 'مراقبة حية لكافة الشركات والفروع والربط الحكومي المركزي.',
      icon: Icons.radar_rounded,
      href: 'group-command-center',
      category: 'governance',
      categoryLabel: 'الحوكمة والقيادة',
      metricBadge: 'سيطرة مركزية',
    ),
    ErpAppTile(
      id: 'iam-matrix',
      title: 'مصفوفة الصلاحيات والعزل السيادي (IAM)',
      subtitle: 'إدارة الأدوار، عزل الشركات Strict RLS، وحماية البيانات الشخصية PDPL.',
      icon: Icons.admin_panel_settings_rounded,
      href: 'iam-matrix',
      category: 'governance',
      categoryLabel: 'الأمان والحوكمة',
      metricBadge: 'RLS 100%',
    ),
    ErpAppTile(
      id: 'reports',
      title: 'مركز التقارير الموحدة والتصدير',
      subtitle: 'التقارير التنفيذية، تقارير المبيعات، الاستقدام، والقوائم المالية.',
      icon: Icons.analytics_rounded,
      href: 'reports',
      category: 'governance',
      categoryLabel: 'التقارير والتحليلات',
      metricBadge: 'تصدير فوري',
    ),
  ];

  /// Exact `SIDEBAR_MENU` from `src/data/sidebarMenu.ts`
  static const List<ErpSidebarItem> sidebarMenu = [
    ErpSidebarItem(
      id: 'dashboard',
      title: 'الرئيسية (لوحة المؤشرات)',
      icon: Icons.dashboard_rounded,
      href: 'dashboard',
    ),
    ErpSidebarItem(
      id: 'crm-section',
      title: 'إدارة العملاء (CRM)',
      icon: Icons.contacts_rounded,
      children: [
        ErpSidebarItem(id: 'clients', title: 'جميع العملاء', icon: Icons.people_alt_rounded, href: 'clients', badge: '241'),
        ErpSidebarItem(id: 'client-portal', title: 'بوابة تتبع العقود للعملاء', icon: Icons.verified_user_rounded, href: 'client-portal', badge: 'جديد'),
        ErpSidebarItem(id: 'whatsapp-inbox', title: 'محادثات واتساب واللايف شات', icon: Icons.chat_bubble_rounded, href: 'whatsapp-inbox', badge: '8'),
        ErpSidebarItem(id: 'sent-messages', title: 'سجل الرسائل والتعميمات', icon: Icons.mark_email_read_rounded, href: 'sent-messages'),
      ],
    ),
    ErpSidebarItem(
      id: 'operations-section',
      title: 'إدارة التشغيل للعمليات',
      icon: Icons.layers_rounded,
      children: [
        ErpSidebarItem(
          id: 'recruitment-contracts',
          title: 'عقود الاستقدام الموثقة (مساند)',
          icon: Icons.description_rounded,
          href: 'recruitment-contracts',
          badge: '27',
        ),
        ErpSidebarItem(
          id: 'musaned-sync',
          title: 'مزامنة منصة مساند الرقمية',
          icon: Icons.sync_rounded,
          href: 'musaned-sync',
        ),
        ErpSidebarItem(
          id: 'orders',
          title: 'جميع الطلبات والحجوزات (SLA)',
          icon: Icons.shopping_cart_checkout_rounded,
          href: 'orders',
          badge: '121',
        ),
        ErpSidebarItem(
          id: 'cvs-recruitment',
          title: 'بنك السير الذاتية (استقدام وتأجير)',
          icon: Icons.badge_rounded,
          href: 'cvs-recruitment',
          badge: '163',
        ),
        ErpSidebarItem(
          id: 'rent-contracts',
          title: 'عقود التأجير والتشغيل المرن',
          icon: Icons.handshake_rounded,
          href: 'rent-contracts',
          badge: '13',
        ),
        ErpSidebarItem(
          id: 'ats-pipeline',
          title: 'منظومة التوظيف الذكي (ATS)',
          icon: Icons.psychology_rounded,
          href: 'ats-pipeline',
          badge: 'AI',
        ),
        ErpSidebarItem(
          id: 'ingaz',
          title: 'تفاويض الإنجاز والتأشيرات',
          icon: Icons.approval_rounded,
          href: 'ingaz',
          badge: '2',
        ),
        ErpSidebarItem(
          id: 'shelter-suite',
          title: 'إدارة مراكز الإيواء والتسكين (HRSD)',
          icon: Icons.hotel_rounded,
          href: 'shelter-suite',
          badge: '44',
        ),
        ErpSidebarItem(
          id: 'sponsorship-transfer',
          title: 'نقل الكفالة والتنازل وفترة التجربة',
          icon: Icons.swap_horiz_rounded,
          href: 'sponsorship-transfer',
          badge: '17',
        ),
        ErpSidebarItem(
          id: 'travel',
          title: 'الخدمات اللوجستية ورحلات الوصول',
          icon: Icons.flight_land_rounded,
          href: 'travel',
        ),
        ErpSidebarItem(
          id: 'complaints',
          title: 'إدارة الشكاوى والنزاعات والتعويضات',
          icon: Icons.headset_mic_rounded,
          href: 'complaints',
          badge: '4',
        ),
      ],
    ),
    ErpSidebarItem(
      id: 'hr-section',
      title: 'إدارة الموارد البشرية (HR & WPS)',
      icon: Icons.groups_rounded,
      children: [
        ErpSidebarItem(id: 'employees', title: 'سجل الموظفين والكادر الوظيفي', icon: Icons.person_search_rounded, href: 'employees'),
        ErpSidebarItem(id: 'payrolls', title: 'مسير الرواتب وحماية الأجور (WPS)', icon: Icons.payments_rounded, href: 'payrolls'),
        ErpSidebarItem(id: 'attendances', title: 'الحضور والانصراف والبصمة الذكية', icon: Icons.access_time_filled_rounded, href: 'attendances'),
        ErpSidebarItem(id: 'employee-monitoring', title: 'مراقبة الأداء والمشاعر (Pulse)', icon: Icons.monitor_heart_rounded, href: 'employee-monitoring', badge: 'جديد'),
      ],
    ),
    ErpSidebarItem(
      id: 'finance-section',
      title: 'الماليات والمحاسبة (SMACC & ZATCA)',
      icon: Icons.account_balance_wallet_rounded,
      children: [
        ErpSidebarItem(id: 'finance-home', title: 'لوحة التحكم المالية الموحدة', icon: Icons.bar_chart_rounded, href: 'finance-home'),
        ErpSidebarItem(id: 'journals', title: 'القيود المحاسبية والترحيل المزدوج', icon: Icons.menu_book_rounded, href: 'journals'),
        ErpSidebarItem(id: 'zatca', title: 'الفاتورة الإلكترونية ZATCA المرحلة 2', icon: Icons.qr_code_scanner_rounded, href: 'zatca', badge: 'Phase 2'),
        ErpSidebarItem(id: 'cost-centers', title: 'شجرة مراكز التكلفة التحليلية', icon: Icons.account_tree_rounded, href: 'cost-centers'),
        ErpSidebarItem(id: 'financial-requests', title: 'الطلبات المالية والعهد النقدية', icon: Icons.receipt_long_rounded, href: 'financial-requests'),
      ],
    ),
    ErpSidebarItem(
      id: 'governance-section',
      title: 'الإدارة المركزية والحوكمة للمجموعة',
      icon: Icons.account_balance_rounded,
      children: [
        ErpSidebarItem(id: 'group-command-center', title: 'مركز القيادة الموحد للمجموعة', icon: Icons.radar_rounded, href: 'group-command-center'),
        ErpSidebarItem(
          id: 'kas-suite',
          title: 'البوابة المستقلة لشركة كاس (KAS Suite)',
          icon: Icons.business_center_rounded,
          href: 'kas-suite',
          badge: 'جناح مستقل',
          exclusiveToCompany: 'KAS',
        ),
        ErpSidebarItem(
          id: 'tenders-boq',
          title: 'منافسات كاس وجداول الكميات (BOQ)',
          icon: Icons.gavel_rounded,
          href: 'tenders-boq',
          exclusiveToCompany: 'KAS',
        ),
        ErpSidebarItem(id: 'iam-matrix', title: 'مصفوفة الصلاحيات والعزل (IAM)', icon: Icons.security_rounded, href: 'iam-matrix'),
        ErpSidebarItem(id: 'reports', title: 'مركز التقارير الموحدة والتصدير', icon: Icons.pie_chart_rounded, href: 'reports'),
        ErpSidebarItem(id: 'settings', title: 'الإعدادات والعمل في الخلفية', icon: Icons.settings_rounded, href: 'settings'),
      ],
    ),
  ];

  /// Initial Tenant-Scoped Operational Records
  static List<ErpOperationalRecord> buildInitialRecords() {
    return const [
      // SAF Records
      ErpOperationalRecord(
        id: 'MSN-2026-8841',
        companyId: 'SAF',
        moduleKey: 'contracts',
        title: 'عقد استقدام مساند #MSN-2026-8841 — الفلبين',
        subtitle: 'العميل: عبدالله بن محمد العتيبي • المرحلة: التفييز وإصدار التذكرة (5/8)',
        status: 'ساري • ضمان 90 يوم',
        badgeText: 'موثق بمساند',
        amountOrMetric: '17,250 ر.س',
        updatedAt: 'منذ 5 دقائق',
      ),
      ErpOperationalRecord(
        id: 'MSN-2026-8842',
        companyId: 'SAF',
        moduleKey: 'contracts',
        title: 'عقد استقدام مساند #MSN-2026-8842 — أوغندا',
        subtitle: 'العميل: فهد بن عبدالعزيز الشمري • المرحلة: وصول للمطار (7/8)',
        status: 'وصول مطار الملك خالد',
        badgeText: 'تحت الضمان (82 يوم متبقي)',
        amountOrMetric: '9,890 ر.س',
        updatedAt: 'منذ 18 دقيقة',
      ),
      ErpOperationalRecord(
        id: 'ORD-SAF-409',
        companyId: 'SAF',
        moduleKey: 'orders',
        title: 'طلب حجز سيرة ذاتية #ORD-SAF-409 — عاملة منزلية',
        subtitle: 'قفل حجز مؤقت 15 دقيقة (Soft Lease Lock) • بانتظار سداد دفعة الضمان',
        status: 'جديد • SLA نشط',
        badgeText: 'حجز 15 دقيقة',
        amountOrMetric: '16,500 ر.س',
        updatedAt: 'الآن',
      ),
      // YAQ Records
      ErpOperationalRecord(
        id: 'RNT-YAQ-512',
        companyId: 'YAQ',
        moduleKey: 'rent',
        title: 'عقد تأجير شهري مرن #RNT-YAQ-512 — باقة 3 أشهر',
        subtitle: 'العميل: شركة المدار للضيافة • السائق: سليم خان • رمز التسليم OTP: 4829',
        status: 'نشط تحت التشغيل',
        badgeText: 'تم التحقق OTP',
        amountOrMetric: '8,400 ر.س',
        updatedAt: 'منذ 10 دقائق',
      ),
      ErpOperationalRecord(
        id: 'RNT-YAQ-519',
        companyId: 'YAQ',
        moduleKey: 'rent',
        title: 'عقد تأجير بالساعة #RNT-YAQ-519 — الفترة الصباحية',
        subtitle: 'الحي: الملقا - الرياض • المسار الجغرافي: نشط عبر الأسطول',
        status: 'جاري التوصيل',
        badgeText: 'توجيه جغرافي',
        amountOrMetric: '450 ر.س',
        updatedAt: 'منذ 22 دقيقة',
      ),
      // TOP Records
      ErpOperationalRecord(
        id: 'ATS-TOP-901',
        companyId: 'TOP',
        moduleKey: 'cvs',
        title: 'مرشح تنفيذي #ATS-TOP-901 — مهندس نظم سحابية أول',
        subtitle: 'نتيجة الفرز الذكي AI: 94/100 • الخبرة: 8 سنوات • جاهز للمقابلة النهائية',
        status: 'توصية توظيف فورية',
        badgeText: 'تقييم 94%',
        amountOrMetric: '28,000 ر.س/شهر',
        updatedAt: 'منذ 12 دقيقة',
      ),
      // KAS Records
      ErpOperationalRecord(
        id: 'ETM-KAS-770',
        companyId: 'KAS',
        moduleKey: 'kas',
        title: 'منافسة منصة اعتماد #ETM-KAS-770 — تشغيل وصيانة المرافق',
        subtitle: 'جدول الكميات BOQ: 42 بنداً مسعراً • الضمان الابتدائي البنكي: 5% جاهز',
        status: 'معتمد للترسية',
        badgeText: 'هامش ربح 18.4%',
        amountOrMetric: '4,850,000 ر.س',
        updatedAt: 'منذ 8 دقائق',
      ),
      ErpOperationalRecord(
        id: 'ETM-KAS-774',
        companyId: 'KAS',
        moduleKey: 'kas',
        title: 'منافسة اعتماد #ETM-KAS-774 — توريد كوادر تشغيلية متخصصة',
        subtitle: 'الضمان النهائي: 10% • مطابقة التسعير التاريخي: ممتازة',
        status: 'قيد المراجعة الفنية',
        badgeText: 'ضمان بنكي ساري',
        amountOrMetric: '2,190,000 ر.س',
        updatedAt: 'منذ 35 دقيقة',
      ),
      // DAR Shelter Records
      ErpOperationalRecord(
        id: 'SHL-DAR-302',
        companyId: 'DAR',
        moduleKey: 'shelter',
        title: 'سجل إيواء وتسكين #SHL-DAR-302 — الجناح B • غرفة 204',
        subtitle: 'الفحص الطبي: مكتمل • الإعاشة اليومية: معتمدة • الحالة: بانتظار رحلة المغادرة',
        status: 'داخل الإيواء • ممتثل HRSD',
        badgeText: 'سرير B-204-2',
        amountOrMetric: 'امتثال 100%',
        updatedAt: 'منذ 14 دقيقة',
      ),
      // Finance & ZATCA Records (Scoped dynamically)
      ErpOperationalRecord(
        id: 'ZAT-2026-9920',
        companyId: 'SAF',
        moduleKey: 'finance',
        title: 'فاتورة ضريبية إلكترونية ZATCA #ZAT-2026-9920 (Phase 2)',
        subtitle: 'UBL 2.1 XML • التوقيع التشفيري ECDSA • الهاش التسلسلي PIH موثق',
        status: 'معتمدة من فاتورة ZATCA',
        badgeText: 'QR + PIH Verified',
        amountOrMetric: '17,250 ر.س (شامل 15% VAT)',
        updatedAt: 'منذ 6 دقائق',
      ),
    ];
  }
}
