import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Users, FileText, Handshake, Hotel, IdCard, 
  TrendingUp, Sliders, Wallet, Search, ArrowLeft, 
  Layers, Sparkles, Building2, CheckCircle2, ShieldCheck, 
  LayoutDashboard, ShoppingBag, Stamp, RefreshCw, Plane,
  Headphones, Building, QrCode, BookOpen, Network, 
  CreditCard, PiggyBank, UserCheck, MapPin, 
  SlidersHorizontal, GitPullRequest, Radio, FolderSync,
  Cloud, UploadCloud, Clock, UserCog, Settings,
  MessageSquare, Send, Globe, PackageCheck, LucideIcon, Scale
} from 'lucide-react';

interface AppTile {
  id: string;
  titleKey: string;
  defaultTitle: string;
  subKey: string;
  defaultSubtitle: string;
  icon: LucideIcon;
  href: string;
  category: 'operations' | 'finance' | 'crm' | 'hr' | 'governance' | 'tech';
  categoryLabel: string;
  metricBadge?: string;
}

interface AppLauncherPageProps {
  onSelectApp: (href: string, title: string) => void;
}

const ALL_SYSTEM_APPS: AppTile[] = [
  // 1. Operations & Recruitment (Emerald Theme)
  {
    id: 'recruitment-contracts',
    titleKey: 'recruitment-contracts',
    defaultTitle: 'عقود الاستقدام الموثقة (مساند)',
    subKey: 'recruitmentContractsSub',
    defaultSubtitle: 'إدارة عقود الاستقدام، الربط الحي مع مساند، وتتبع مراحل التفييز والتذاكر.',
    icon: Handshake,
    href: 'recruitment-contracts',
    category: 'operations',
    categoryLabel: 'العمليات والعقود',
    metricBadge: '121 عقد نشط'
  },
  {
    id: 'orders',
    titleKey: 'orders',
    defaultTitle: 'طلبات العملاء والعمليات (SLA)',
    subKey: 'ordersSub',
    defaultSubtitle: 'استقبال طلبات الاستقدام الجديدة، مؤقتات الـ SLA، والتحويل الفوري لعقود.',
    icon: ShoppingBag,
    href: 'orders',
    category: 'operations',
    categoryLabel: 'العمليات والعقود',
    metricBadge: '48 طلب جديد'
  },
  {
    id: 'cvs',
    titleKey: 'cvs',
    defaultTitle: 'بنك السير الذاتية (CVs)',
    subKey: 'cvsSub',
    defaultSubtitle: 'فلترة وتصنيف الكوادر البشرية، السير المحجوزة، والمتاحة للاختيار.',
    icon: FileText,
    href: 'cvs-recruitment',
    category: 'operations',
    categoryLabel: 'الكوادر والتشغيل',
    metricBadge: '163 سيرة جاهزة'
  },
  {
    id: 'rent-contracts',
    titleKey: 'rent-contracts',
    defaultTitle: 'عقود التأجير والتشغيل المرن',
    subKey: 'rentContractsSub',
    defaultSubtitle: 'إدارة عقود الإيجار الشهرية والسنوية ومتابعة التسليم والدفعات.',
    icon: Layers,
    href: 'rent-contracts',
    category: 'operations',
    categoryLabel: 'التأجير والتشغيل',
    metricBadge: '34 عقد إيجار'
  },
  {
    id: 'tenders-boq',
    titleKey: 'tenders-boq',
    defaultTitle: 'المناقصات وجداول الكميات (BOQ)',
    subKey: 'tendersBoqSub',
    defaultSubtitle: 'محاكاة إكسيل الذكية، التسعير، الضريبة 15%، التفقيط التلقائي، ومنافسات كاس للتجارة.',
    icon: Building2,
    href: 'tenders-boq',
    category: 'operations',
    categoryLabel: 'المناقصات والتوريدات',
    metricBadge: 'شركة كاس للتجارة'
  },
  {
    id: 'rent-packages',
    titleKey: 'rent-packages',
    defaultTitle: 'باقات وأسعار التأجير',
    subKey: 'rentPackagesSub',
    defaultSubtitle: 'تسعير مدد التأجير (شهر، 3 أشهر، سنة) واحتساب ضريبة القيمة المضافة.',
    icon: PackageCheck,
    href: 'rent-packages',
    category: 'operations',
    categoryLabel: 'التأجير والتشغيل',
    metricBadge: '12 باقة نشطة'
  },
  {
    id: 'ingaz',
    titleKey: 'ingaz',
    defaultTitle: 'تفاويض الإنجاز والتأشيرات',
    subKey: 'ingazSub',
    defaultSubtitle: 'إصدار وتوثيق تفاويض إنجاز الإلكترونية والربط مع السفارات الخارجية.',
    icon: Stamp,
    href: 'ingaz',
    category: 'operations',
    categoryLabel: 'التأشيرات والربط',
    metricBadge: '29 تفويض موثق'
  },
  {
    id: 'shelter',
    titleKey: 'shelter',
    defaultTitle: 'مراكز الإيواء والتغذية',
    subKey: 'shelterSub',
    defaultSubtitle: 'متابعة السكن، التغذية اليومية، الفرز الطبي، وإدارة الطاقة الاستيعابية.',
    icon: Hotel,
    href: 'shelter',
    category: 'operations',
    categoryLabel: 'الخدمات اللوجستية',
    metricBadge: '18 نزيلة بالإيواء'
  },
  {
    id: 'sponsorship-transfer',
    titleKey: 'sponsorship-transfer',
    defaultTitle: 'نقل الكفالة والتنازل والتجربة',
    subKey: 'sponsorshipTransferSub',
    defaultSubtitle: 'إدارة عقود التنازل ونقل الخدمات، فترات التجربة، والتسويات المالية.',
    icon: RefreshCw,
    href: 'sponsorship-transfer',
    category: 'operations',
    categoryLabel: 'نقل الكفالة',
    metricBadge: '8 تحت التجربة'
  },
  {
    id: 'travel',
    titleKey: 'travel',
    defaultTitle: 'الرحلات الجوية واللوجستيات',
    subKey: 'travelSub',
    defaultSubtitle: 'جدولة رحلات الوصول والاستقبال بالمطار، حجوزات التذاكر، وتتبع الترحيل.',
    icon: Plane,
    href: 'travel',
    category: 'operations',
    categoryLabel: 'الخدمات اللوجستية',
    metricBadge: '14 رحلة قادمة'
  },
  {
    id: 'agent-imports',
    titleKey: 'agent-imports',
    defaultTitle: 'ملفات السير الذاتية بالدفعة',
    subKey: 'agentImportsSub',
    defaultSubtitle: 'استعراض الدفعات المرفوعة من المكاتب الدولية واعتمادها في بنك السير.',
    icon: FolderSync,
    href: 'agent-imports',
    category: 'operations',
    categoryLabel: 'المكاتب الخارجية',
    metricBadge: '5 دفعات معلقة'
  },

  // 2. Finance & Accounting (Amber Theme)
  {
    id: 'finance',
    titleKey: 'finance',
    defaultTitle: 'المحاسبة العامة (General Ledger)',
    subKey: 'financeSub',
    defaultSubtitle: 'دليل الحسابات الشجري، قيود اليومية، موازين المراجعة، والقوائم الختامية.',
    icon: Wallet,
    href: 'finance-home',
    category: 'finance',
    categoryLabel: 'المالية والمحاسبة',
    metricBadge: 'محدث لحظياً'
  },
  {
    id: 'zatca',
    titleKey: 'zatca',
    defaultTitle: 'الفوترة الإلكترونية (ZATCA)',
    subKey: 'zatcaSub',
    defaultSubtitle: 'إصدار الفواتير الضريبية والمبسطة المتوافقة مع متطلبات المرحلة الثانية لهيئة الزكاة.',
    icon: QrCode,
    href: 'zatca',
    category: 'finance',
    categoryLabel: 'الفوترة والزكاة',
    metricBadge: '100% امتثال'
  },
  {
    id: 'journals',
    titleKey: 'journals',
    defaultTitle: 'قيود اليومية والسندات',
    subKey: 'journalsSub',
    defaultSubtitle: 'إنشاء ومراجعة القيود المحاسبية وسندات القبض والصرف وترحيلها.',
    icon: BookOpen,
    href: 'journals',
    category: 'finance',
    categoryLabel: 'المالية والمحاسبة',
    metricBadge: '1,420 قيد'
  },
  {
    id: 'cost-centers',
    titleKey: 'cost-centers',
    defaultTitle: 'مراكز التكلفة والأرباح',
    subKey: 'costCentersSub',
    defaultSubtitle: 'توزيع المصروفات والإيرادات على الفروع والمشاريع واستخراج تقارير الربحية.',
    icon: Network,
    href: 'cost-centers',
    category: 'finance',
    categoryLabel: 'المالية والمحاسبة',
    metricBadge: '8 مراكز تكلفة'
  },
  {
    id: 'financial-requests',
    titleKey: 'financial-requests',
    defaultTitle: 'الطلبات المالية والتشغيلية',
    subKey: 'financialRequestsSub',
    defaultSubtitle: 'طلبات سداد مساند، رسوم الإقامات والجوازات، ودفعات الوكلاء الخارجيين.',
    icon: CreditCard,
    href: 'financial-requests',
    category: 'finance',
    categoryLabel: 'المالية والمدفوعات',
    metricBadge: '16 طلب سداد'
  },
  {
    id: 'custodies',
    titleKey: 'custodies',
    defaultTitle: 'العهد النقدية والأصول',
    subKey: 'custodiesSub',
    defaultSubtitle: 'متابعة العهد المسلمة للموظفين والمشرفين وتسويتها مع الحسابات.',
    icon: PiggyBank,
    href: 'custodies',
    category: 'finance',
    categoryLabel: 'المالية والمصروفات',
    metricBadge: '6 عهد جارية'
  },

  // 3. CRM & Communication (Sky Theme)
  {
    id: 'crm',
    titleKey: 'crm',
    defaultTitle: 'إدارة علاقات العملاء (CRM)',
    subKey: 'crmSub',
    defaultSubtitle: 'سجل العملاء، التصنيفات، التقييم الائتماني، وتاريخ المعاملات الموحد.',
    icon: Users,
    href: 'clients',
    category: 'crm',
    categoryLabel: 'العملاء والتسويق',
    metricBadge: '241 عميل نشط'
  },
  {
    id: 'complaints',
    titleKey: 'complaints',
    defaultTitle: 'إدارة الشكاوى والدعم الفني',
    subKey: 'complaintsSub',
    defaultSubtitle: 'إدارة بلاغات رفض العمل، تأخير الاستقدام، تذاكر SLA، والنزاعات البينية.',
    icon: Headphones,
    href: 'complaints',
    category: 'crm',
    categoryLabel: 'خدمة العملاء',
    metricBadge: '3 تذاكر حرجة'
  },
  {
    id: 'whatsapp-inbox',
    titleKey: 'whatsapp-inbox',
    defaultTitle: 'صندوق الواتساب والرد الآلي',
    subKey: 'whatsappInboxSub',
    defaultSubtitle: 'مراسلة العملاء عبر قنوات واتساب الرسمية، الردود التلقائية، وإرسال العقود.',
    icon: MessageSquare,
    href: 'whatsapp-inbox',
    category: 'crm',
    categoryLabel: 'قنوات التواصل',
    metricBadge: 'متصل ومفعل'
  },
  {
    id: 'sent-messages',
    titleKey: 'sent-messages',
    defaultTitle: 'سجل الرسائل والحملات',
    subKey: 'sentMessagesSub',
    defaultSubtitle: 'سجل إرسال الإشعارات التلقائية عبر SMS والواتساب، وحملات العروض.',
    icon: Send,
    href: 'sent-messages',
    category: 'crm',
    categoryLabel: 'قنوات التواصل',
    metricBadge: '3,890 مرسلة'
  },
  {
    id: 'website-visitors',
    titleKey: 'website-visitors',
    defaultTitle: 'زوار الموقع والطلبات',
    subKey: 'websiteVisitorsSub',
    defaultSubtitle: 'تتبع طلبات الاستقدام والتأجير القادمة من البوابة الإلكترونية وتحويلها لـ Leads.',
    icon: Globe,
    href: 'website-visitors',
    category: 'crm',
    categoryLabel: 'التسويق الرقمي',
    metricBadge: '52 زيارة اليوم'
  },

  // 4. HR & External Agencies (Purple Theme)
  {
    id: 'hr',
    titleKey: 'hr',
    defaultTitle: 'الموارد البشرية والرواتب (HR)',
    subKey: 'hrSub',
    defaultSubtitle: 'ملفات الموظفين، الحضور، الإجازات، والمسيرات المتوافقة مع نظام حماية الأجور.',
    icon: IdCard,
    href: 'employees',
    category: 'hr',
    categoryLabel: 'الموارد البشرية',
    metricBadge: '32 موظف'
  },
  {
    id: 'attendances',
    titleKey: 'attendances',
    defaultTitle: 'الحضور والانصراف والبصمة',
    subKey: 'attendancesSub',
    defaultSubtitle: 'مزامنة سجلات البصمة الحيوية، التأخيرات، ساعات العمل الإضافية، والغياب.',
    icon: UserCheck,
    href: 'attendances',
    category: 'hr',
    categoryLabel: 'الموارد البشرية',
    metricBadge: 'مباشر'
  },
  {
    id: 'offices',
    titleKey: 'offices',
    defaultTitle: 'المكاتب والوكلاء الدوليين',
    subKey: 'officesSub',
    defaultSubtitle: 'إدارة المكاتب المصدرة في الفلبين وإثيوبيا وأوغندا وسريلانكا وحساباتها.',
    icon: Building,
    href: 'offices',
    category: 'hr',
    categoryLabel: 'الوكلاء الخارجيين',
    metricBadge: '14 مكتب خارجي'
  },
  {
    id: 'external-offices',
    titleKey: 'external-offices',
    defaultTitle: 'تراخيص وعقود الوكلاء بالخارج',
    subKey: 'externalOfficesSub',
    defaultSubtitle: 'تتبع تراخيص المكاتب الخارجية، أسعار التوريد، ونسب الإنجاز والامتثال.',
    icon: MapPin,
    href: 'external-offices',
    category: 'hr',
    categoryLabel: 'الوكلاء الخارجيين',
    metricBadge: '5 دول معتمدة'
  },

  // 5. Governance & Executive (Luxury Dark Carbon Theme)
  {
    id: 'dashboard',
    titleKey: 'dashboard',
    defaultTitle: 'لوحة القيادة والمؤشرات',
    subKey: 'dashboardSub',
    defaultSubtitle: 'نظرة شاملة ومؤشرات أداء KPI لعمليات الاستقدام والمالية والعملاء في لمحة واحدة.',
    icon: LayoutDashboard,
    href: 'dashboard',
    category: 'governance',
    categoryLabel: 'القيادة والمؤشرات',
    metricBadge: 'الرئيسية'
  },
  {
    id: 'group-command-center',
    titleKey: 'group-command-center',
    defaultTitle: 'مركز قيادة المجموعة والحوكمة',
    subKey: 'groupCommandCenterSub',
    defaultSubtitle: 'الرقابة الموحدة على الشركات الأربعة، مقارنة الإيرادات، ومؤشرات الأداء.',
    icon: Building2,
    href: 'group-command-center',
    category: 'governance',
    categoryLabel: 'الحوكمة المركزية',
    metricBadge: 'إشراف مركزي'
  },
  {
    id: 'company-selector',
    titleKey: 'company-selector',
    defaultTitle: 'بوابة اختيار وتبديل الشركات',
    subKey: 'companySelectorSub',
    defaultSubtitle: 'التبديل بين شركة خالد السليم، شركة الرائد، شركة إنجاز، وشركة المساند.',
    icon: SlidersHorizontal,
    href: 'company-selector',
    category: 'governance',
    categoryLabel: 'الحوكمة المركزية',
    metricBadge: '4 شركات'
  },
  {
    id: 'ats-pipeline',
    titleKey: 'ats-pipeline',
    defaultTitle: 'نظام ATS لفرز وتدقيق المرشحات',
    subKey: 'atsPipelineSub',
    defaultSubtitle: '12 مرحلة مؤتمتة لفرز وتدقيق المرشحات من مرحلة الاستقبال وحتى التوثيق.',
    icon: GitPullRequest,
    href: 'ats-pipeline',
    category: 'governance',
    categoryLabel: 'الحوكمة والفرز',
    metricBadge: '12 مرحلة ATS'
  },
  {
    id: 'reports',
    titleKey: 'reports',
    defaultTitle: 'مركز التقارير والذكاء المالي',
    subKey: 'reportsSub',
    defaultSubtitle: 'استخراج تقارير الأداء المالي، معدلات وصول العمالة، ونسب الربحية لكل فرع.',
    icon: TrendingUp,
    href: 'reports',
    category: 'governance',
    categoryLabel: 'التحليلات والمؤشرات',
    metricBadge: 'تقارير فورية'
  },

  // 6. Integrations & Technology (Rose & Ruby Theme)
  {
    id: 'branch-communication',
    titleKey: 'branch-communication',
    defaultTitle: 'مركز اتصالات ومراسلات الفروع',
    subKey: 'branchCommunicationSub',
    defaultSubtitle: 'التواصل الفوري والتعاميم الإدارية بين الفرع الرئيسي والفروع الخارجية.',
    icon: Radio,
    href: 'branch-communication',
    category: 'tech',
    categoryLabel: 'الربط والشبكات',
    metricBadge: 'بث مباشر'
  },
  {
    id: 'group-dispatch',
    titleKey: 'group-dispatch',
    defaultTitle: 'الترحيل والمناقلة بين الشركات',
    subKey: 'groupDispatchSub',
    defaultSubtitle: 'نقل وتوزيع السير الذاتية والطلبات والموظفين بين كيانات المجموعة الأربعة.',
    icon: FolderSync,
    href: 'group-dispatch',
    category: 'tech',
    categoryLabel: 'الربط والشبكات',
    metricBadge: 'مزامنة سحابية'
  },
  {
    id: 'microsoft-center',
    titleKey: 'microsoft-center',
    defaultTitle: 'مركز التكامل مع Microsoft 365',
    subKey: 'microsoftCenterSub',
    defaultSubtitle: 'الربط مع بريد Outlook السحابي، تقويم الفرق، ومزامنة المستندات مع OneDrive.',
    icon: Cloud,
    href: 'microsoft-center',
    category: 'tech',
    categoryLabel: 'الربط السحابي',
    metricBadge: 'Azure & M365'
  },
  {
    id: 'data-import',
    titleKey: 'data-import',
    defaultTitle: 'معالج استيراد البيانات (Excel / CSV)',
    subKey: 'dataImportSub',
    defaultSubtitle: 'استيراد وترحيل قواعد البيانات القديمة، السير، العملاء، والعقود دفعة واحدة.',
    icon: UploadCloud,
    href: 'data-import',
    category: 'tech',
    categoryLabel: 'أدوات النظام',
    metricBadge: 'ترحيل ذكي'
  },
  {
    id: 'activity-log',
    titleKey: 'activity-log',
    defaultTitle: 'سجل النشاط وتدقيق الأمان',
    subKey: 'activityLogSub',
    defaultSubtitle: 'تتبع كافة الحركات التشغيلية والمالية مع تسجيل IP والمستخدم والوقت بالتفصيل.',
    icon: Clock,
    href: 'activity-log',
    category: 'tech',
    categoryLabel: 'الأمان والرقابة',
    metricBadge: 'Audit Trail'
  },
  {
    id: 'users',
    titleKey: 'users',
    defaultTitle: 'إدارة المستخدمين والمصادقة',
    subKey: 'usersSub',
    defaultSubtitle: 'إنشاء حسابات الموظفين، تعيين الأدوار، وإدارة كلمات المرور والمصادقة الثنائية.',
    icon: UserCog,
    href: 'users',
    category: 'tech',
    categoryLabel: 'الأمان والرقابة',
    metricBadge: 'RBAC Security'
  },
  {
    id: 'master-constants',
    titleKey: 'master-constants',
    defaultTitle: 'الثوابت والمتغيرات العامة',
    subKey: 'masterConstantsSub',
    defaultSubtitle: 'إدارة الجنسيات، المهن، المطارات، والمهارات المعتمدة للاستقدام.',
    icon: Settings,
    href: 'master-constants',
    category: 'tech',
    categoryLabel: 'ثوابت النظام',
    metricBadge: '7 قوائم'
  },
  {
    id: 'legal-compliance',
    titleKey: 'legal-compliance',
    defaultTitle: 'الامتثال القانوني والتبرئة والتواقيع الرقمية',
    subKey: 'legalComplianceSub',
    defaultSubtitle: 'سياسات استخدام النظام المخصصة لكل قسم، التواقيع الإلكترونية، وإقرارات إبراء الذمة وفق الأنظمة السعودية.',
    icon: Scale,
    href: 'legal-compliance',
    category: 'tech',
    categoryLabel: 'الأمان والامتثال',
    metricBadge: 'أنظمة وقوانين KSA'
  },
  {
    id: 'settings',
    titleKey: 'settings',
    defaultTitle: 'إعدادات النظام ومحتوى المنصة والأمان',
    subKey: 'settingsSub',
    defaultSubtitle: 'ضبط سياسات 2FA، بيانات المنشأة، الروابط السريعة، SEO، واللايف شات Zoho.',
    icon: Sliders,
    href: 'settings',
    category: 'tech',
    categoryLabel: 'إعدادات المنظومة',
    metricBadge: '10 أقسام'
  }
];

interface CategoryMeta {
  id: string;
  label: string;
  colorName: string;
  cellBg: string;
  cellHover: string;
  titleColor: string;
  subColor: string;
  iconBg: string;
  iconColor: string;
  categoryTagBg: string;
  categoryTagColor: string;
  metricTagBg: string;
  metricTagColor: string;
  footerBorder: string;
  actionColor: string;
  activePillBg: string;
  activePillText: string;
  isDark?: boolean;
}

const CATEGORY_STYLES: Record<string, CategoryMeta> = {
  operations: {
    id: 'operations',
    label: 'العمليات والاستقدام',
    colorName: 'أخضر زمردي',
    cellBg: 'bg-[#f4fbf7]',
    cellHover: 'hover:bg-[#e6f7ec]',
    titleColor: 'text-[#064e3b]',
    subColor: 'text-[#065f46]/80',
    iconBg: 'bg-[#059669]',
    iconColor: 'text-white',
    categoryTagBg: 'bg-[#d1fae5]',
    categoryTagColor: 'text-[#065f46]',
    metricTagBg: 'bg-[#a7f3d0]',
    metricTagColor: 'text-[#064e3b]',
    footerBorder: 'border-[#a7f3d0]/60',
    actionColor: 'text-[#059669] group-hover:text-[#064e3b]',
    activePillBg: 'bg-[#059669] border-[#059669]',
    activePillText: 'text-white'
  },
  finance: {
    id: 'finance',
    label: 'المالية والمحاسبة',
    colorName: 'كهرماني ذهبي',
    cellBg: 'bg-[#fdfaf3]',
    cellHover: 'hover:bg-[#fbf1dc]',
    titleColor: 'text-[#78350f]',
    subColor: 'text-[#92400e]/80',
    iconBg: 'bg-[#d97706]',
    iconColor: 'text-white',
    categoryTagBg: 'bg-[#fef3c7]',
    categoryTagColor: 'text-[#92400e]',
    metricTagBg: 'bg-[#fde68a]',
    metricTagColor: 'text-[#78350f]',
    footerBorder: 'border-[#fde68a]/60',
    actionColor: 'text-[#d97706] group-hover:text-[#78350f]',
    activePillBg: 'bg-[#d97706] border-[#d97706]',
    activePillText: 'text-white'
  },
  crm: {
    id: 'crm',
    label: 'العملاء والتسويق',
    colorName: 'أزرق سماوي',
    cellBg: 'bg-[#f4f9fd]',
    cellHover: 'hover:bg-[#e5f3fc]',
    titleColor: 'text-[#0c4a6e]',
    subColor: 'text-[#0369a1]/80',
    iconBg: 'bg-[#0284c7]',
    iconColor: 'text-white',
    categoryTagBg: 'bg-[#e0f2fe]',
    categoryTagColor: 'text-[#0369a1]',
    metricTagBg: 'bg-[#bae6fd]',
    metricTagColor: 'text-[#0c4a6e]',
    footerBorder: 'border-[#bae6fd]/60',
    actionColor: 'text-[#0284c7] group-hover:text-[#0c4a6e]',
    activePillBg: 'bg-[#0284c7] border-[#0284c7]',
    activePillText: 'text-white'
  },
  hr: {
    id: 'hr',
    label: 'الموارد البشرية والوكلاء',
    colorName: 'بنفسجي ملكي',
    cellBg: 'bg-[#fbf6fd]',
    cellHover: 'hover:bg-[#f4e6fb]',
    titleColor: 'text-[#581c87]',
    subColor: 'text-[#6b21a8]/80',
    iconBg: 'bg-[#9333ea]',
    iconColor: 'text-white',
    categoryTagBg: 'bg-[#f3e8ff]',
    categoryTagColor: 'text-[#6b21a8]',
    metricTagBg: 'bg-[#e9d5ff]',
    metricTagColor: 'text-[#581c87]',
    footerBorder: 'border-[#e9d5ff]/60',
    actionColor: 'text-[#9333ea] group-hover:text-[#581c87]',
    activePillBg: 'bg-[#9333ea] border-[#9333ea]',
    activePillText: 'text-white'
  },
  governance: {
    id: 'governance',
    label: 'الحوكمة والقيادة',
    colorName: 'أسود كربوني فاخر',
    cellBg: 'bg-[#09090b]',
    cellHover: 'hover:bg-[#18181b]',
    titleColor: 'text-white',
    subColor: 'text-zinc-400',
    iconBg: 'bg-zinc-800',
    iconColor: 'text-emerald-300',
    categoryTagBg: 'bg-zinc-800',
    categoryTagColor: 'text-zinc-300',
    metricTagBg: 'bg-zinc-800',
    metricTagColor: 'text-emerald-300',
    footerBorder: 'border-zinc-800',
    actionColor: 'text-zinc-300 group-hover:text-white',
    activePillBg: 'bg-black border-black',
    activePillText: 'text-white',
    isDark: true
  },
  tech: {
    id: 'tech',
    label: 'الربط والتقنية والأمان',
    colorName: 'وردي ياقوتي',
    cellBg: 'bg-[#fdf4f5]',
    cellHover: 'hover:bg-[#fbe4e7]',
    titleColor: 'text-[#881337]',
    subColor: 'text-[#9f1239]/80',
    iconBg: 'bg-[#e11d48]',
    iconColor: 'text-white',
    categoryTagBg: 'bg-[#ffe4e6]',
    categoryTagColor: 'text-[#9f1239]',
    metricTagBg: 'bg-[#fecdd3]',
    metricTagColor: 'text-[#881337]',
    footerBorder: 'border-[#fecdd3]/60',
    actionColor: 'text-[#e11d48] group-hover:text-[#881337]',
    activePillBg: 'bg-[#e11d48] border-[#e11d48]',
    activePillText: 'text-white'
  }
};

const CATEGORIES = [
  { id: 'all', label: 'كافة الأقسام والأنظمة' },
  { id: 'operations', label: 'العمليات والاستقدام' },
  { id: 'finance', label: 'المالية والمحاسبة' },
  { id: 'crm', label: 'العملاء والتسويق' },
  { id: 'hr', label: 'الموارد البشرية والوكلاء' },
  { id: 'governance', label: 'الحوكمة والقيادة' },
  { id: 'tech', label: 'الربط والتقنية والأمان' },
];

export const AppLauncherPage: React.FC<AppLauncherPageProps> = ({ onSelectApp }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredApps = useMemo(() => {
    return ALL_SYSTEM_APPS.filter(app => {
      const title = t(app.titleKey, app.defaultTitle);
      const subtitle = t(app.subKey, app.defaultSubtitle);
      const categoryMatch = selectedCategory === 'all' || app.category === selectedCategory;
      const searchMatch = !search || 
        title.toLowerCase().includes(search.toLowerCase()) || 
        subtitle.toLowerCase().includes(search.toLowerCase()) ||
        app.categoryLabel.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [search, selectedCategory, t]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_SYSTEM_APPS.length };
    ALL_SYSTEM_APPS.forEach(app => {
      counts[app.category] = (counts[app.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen min-h-[100dvh] w-full bg-[#fbfbf5] text-zinc-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="ALSALIM GROUP LOGO"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black p-0.5 bg-white object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-sm sm:text-lg text-black font-display leading-tight">
              مستكشف الأقسام والأنظمة التشغيلية
            </div>
            <div className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              Enterprise Application Launcher • Multi-Entity Edition • 37 وحدة متكاملة
            </div>
          </div>
        </div>

        {/* Search Bar & Action Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchAppPlaceholder', 'ابحث عن أي قسم أو موديول...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-full pr-9 pl-4 py-1.5 text-xs text-black placeholder-zinc-400 outline-none w-36 sm:w-72 focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <button
            type="button"
            className="button-primary-pill flex items-center gap-1 text-xs px-4 py-2 rounded-full font-bold min-h-[36px]"
            onClick={() => onSelectApp('dashboard', 'لوحة المؤشرات التشغيلية')}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">لوحة القيادة والمؤشرات</span>
          </button>
        </div>
      </header>

      {/* Explorer Content Container - Full Widescreen Width */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex-1 space-y-6">
        
        {/* Category Filter Pills with distinct active colors */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            const count = countsByCategory[cat.id] || 0;
            const catStyle = CATEGORY_STYLES[cat.id];

            let activeClass = "bg-black text-white border-black shadow-xs";
            let activeCountBadge = "bg-zinc-800 text-emerald-300";
            if (isActive && catStyle) {
              activeClass = `${catStyle.activePillBg} ${catStyle.activePillText} shadow-xs`;
              activeCountBadge = "bg-black/20 text-white";
            }

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive 
                    ? activeClass
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <span>{cat.label}</span>
                <span 
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? activeCountBadge : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Seamless Gapless Connected Bento Grid with Distinct Category Color Palette */}
        <div className="bg-zinc-200/90 border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-[1px]">
          {filteredApps.map((app) => {
            const title = t(app.titleKey, app.defaultTitle);
            const subtitle = t(app.subKey, app.defaultSubtitle);
            const Icon = app.icon;
            const style = CATEGORY_STYLES[app.category] || CATEGORY_STYLES.operations;

            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.href, title)}
                className={`p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 group relative min-h-[225px] ${style.cellBg} ${style.cellHover}`}
              >
                <div className="space-y-3">
                  {/* Top Badges & Metric Row */}
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xs group-hover:scale-105 ${style.iconBg} ${style.iconColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {app.metricBadge && (
                        <span 
                          className={`text-[9.5px] px-2.5 py-0.5 rounded-full font-bold font-mono ${style.metricTagBg} ${style.metricTagColor}`}
                        >
                          {app.metricBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9.5px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${style.categoryTagBg} ${style.categoryTagColor}`}>
                        {app.categoryLabel}
                      </span>
                    </div>
                    <h3 className={`text-base font-bold font-display mb-1.5 leading-snug line-clamp-1 ${style.titleColor}`}>
                      {title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${style.subColor}`}>
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs font-bold ${style.footerBorder}`}>
                  <span className={`inline-flex items-center gap-1.5 transition-colors ${style.actionColor}`}>
                    <span>فتح القسم</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </span>
                  <span className={`text-[10px] font-mono font-medium opacity-60 ${style.titleColor}`}>
                    مزامنة فورية
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center text-zinc-500">
            <Search className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="font-bold text-black text-sm">لم يتم العثور على أي قسم يطابق بحثك</p>
            <p className="text-xs text-zinc-400 mt-1">جرب البحث بكلمات أخرى أو اختر "كافة الأقسام والأنظمة"</p>
          </div>
        )}
      </div>

      {/* Footer - Full Widescreen Width */}
      <footer className="bg-white border-t border-zinc-200 py-4 px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 mt-auto">
        <span>
          مجموعة خالد السليم للاستقدام والتشغيل • المنظومة السحابية الموحدة لخدمات قطاع الأفراد وقطاع الأعمال
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="pill-tag-mint text-[10px]">4 شركات مرتبطة</span>
          <span className="pill-tag-shade text-[10px]">قواعد بيانات سحابية مستقلة</span>
          <span className="pill-tag-shade text-[10px]">ZATCA Phase 2</span>
        </div>
      </footer>
    </main>
  );
};

export default AppLauncherPage;
