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
  MessageSquare, Send, Globe, PackageCheck, LucideIcon
} from 'lucide-react';

interface AppTile {
  id: string;
  titleKey: string;
  defaultTitle: string;
  subKey: string;
  defaultSubtitle: string;
  icon: LucideIcon;
  href: string;
  theme?: 'dark' | 'pistachio' | 'white';
  category: 'operations' | 'finance' | 'crm' | 'hr' | 'governance' | 'tech';
  categoryLabel: string;
  metricBadge?: string;
}

interface AppLauncherPageProps {
  onSelectApp: (href: string, title: string) => void;
}

const ALL_SYSTEM_APPS: AppTile[] = [
  // 1. Operations & Recruitment
  {
    id: 'recruitment-contracts',
    titleKey: 'recruitment-contracts',
    defaultTitle: 'عقود الاستقدام الموثقة (مساند)',
    subKey: 'recruitmentContractsSub',
    defaultSubtitle: 'إدارة عقود الاستقدام، الربط الحي مع مساند، وتتبع مراحل التفييز والتذاكر.',
    icon: Handshake,
    href: 'recruitment-contracts',
    theme: 'dark',
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
    theme: 'pistachio',
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
    theme: 'white',
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
    theme: 'white',
    category: 'operations',
    categoryLabel: 'التأجير والتشغيل',
    metricBadge: '34 عقد إيجار'
  },
  {
    id: 'rent-packages',
    titleKey: 'rent-packages',
    defaultTitle: 'باقات وأسعار التأجير',
    subKey: 'rentPackagesSub',
    defaultSubtitle: 'تسعير مدد التأجير (شهر، 3 أشهر، سنة) واحتساب ضريبة القيمة المضافة.',
    icon: PackageCheck,
    href: 'rent-packages',
    theme: 'white',
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
    theme: 'white',
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
    theme: 'pistachio',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
    category: 'operations',
    categoryLabel: 'المكاتب الخارجية',
    metricBadge: '5 دفعات معلقة'
  },

  // 2. Finance & Accounting
  {
    id: 'finance',
    titleKey: 'finance',
    defaultTitle: 'المحاسبة العامة (General Ledger)',
    subKey: 'financeSub',
    defaultSubtitle: 'دليل الحسابات الشجري، قيود اليومية، موازين المراجعة، والقوائم الختامية.',
    icon: Wallet,
    href: 'finance-home',
    theme: 'dark',
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
    theme: 'pistachio',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
    category: 'finance',
    categoryLabel: 'المالية والمصروفات',
    metricBadge: '6 عهد جارية'
  },

  // 3. CRM & Communication
  {
    id: 'crm',
    titleKey: 'crm',
    defaultTitle: 'إدارة علاقات العملاء (CRM)',
    subKey: 'crmSub',
    defaultSubtitle: 'سجل العملاء، التصنيفات، التقييم الائتماني، وتاريخ المعاملات الموحد.',
    icon: Users,
    href: 'clients',
    theme: 'dark',
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
    theme: 'pistachio',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
    category: 'crm',
    categoryLabel: 'التسويق الرقمي',
    metricBadge: '52 زيارة اليوم'
  },

  // 4. HR & External Agencies
  {
    id: 'hr',
    titleKey: 'hr',
    defaultTitle: 'الموارد البشرية والرواتب (HR)',
    subKey: 'hrSub',
    defaultSubtitle: 'ملفات الموظفين، الحضور، الإجازات، والمسيرات المتوافقة مع نظام حماية الأجور.',
    icon: IdCard,
    href: 'employees',
    theme: 'dark',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
    category: 'hr',
    categoryLabel: 'الوكلاء الخارجيين',
    metricBadge: '5 دول معتمدة'
  },

  // 5. Governance & Executive
  {
    id: 'dashboard',
    titleKey: 'dashboard',
    defaultTitle: 'لوحة القيادة والمؤشرات',
    subKey: 'dashboardSub',
    defaultSubtitle: 'نظرة شاملة ومؤشرات أداء KPI لعمليات الاستقدام والمالية والعملاء في لمحة واحدة.',
    icon: LayoutDashboard,
    href: 'dashboard',
    theme: 'dark',
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
    theme: 'dark',
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
    theme: 'white',
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
    theme: 'pistachio',
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
    theme: 'pistachio',
    category: 'governance',
    categoryLabel: 'التحليلات والمؤشرات',
    metricBadge: 'تقارير فورية'
  },

  // 6. Integrations & Technology
  {
    id: 'branch-communication',
    titleKey: 'branch-communication',
    defaultTitle: 'مركز اتصالات ومراسلات الفروع',
    subKey: 'branchCommunicationSub',
    defaultSubtitle: 'التواصل الفوري والتعاميم الإدارية بين الفرع الرئيسي والفروع الخارجية.',
    icon: Radio,
    href: 'branch-communication',
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
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
    theme: 'white',
    category: 'tech',
    categoryLabel: 'الأمان والرقابة',
    metricBadge: 'RBAC Security'
  },
  {
    id: 'master-constants',
    titleKey: 'master-constants',
    defaultTitle: 'الثوابت وإعدادات النظام',
    subKey: 'masterConstantsSub',
    defaultSubtitle: 'إعدادات المنشأة، الشعار، اللغات، الهوية البصرية، والربط الحكومي API.',
    icon: Settings,
    href: 'master-constants',
    theme: 'white',
    category: 'tech',
    categoryLabel: 'إعدادات النظام',
    metricBadge: 'تهيئة عامة'
  }
];

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
        
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            const count = countsByCategory[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive 
                    ? 'bg-black text-white border-black shadow-xs' 
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <span>{cat.label}</span>
                <span 
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-zinc-800 text-emerald-300' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Seamless Gapless Connected Bento Grid */}
        <div className="bg-zinc-200/90 border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-[1px]">
          {filteredApps.map((app) => {
            const title = t(app.titleKey, app.defaultTitle);
            const subtitle = t(app.subKey, app.defaultSubtitle);
            const Icon = app.icon;

            const isDark = app.theme === 'dark';
            const isPistachio = app.theme === 'pistachio';

            let cellBg = "bg-white text-zinc-900 hover:bg-zinc-50/90";
            if (isDark) {
              cellBg = "bg-[#09090b] text-white hover:bg-zinc-900";
            } else if (isPistachio) {
              cellBg = "bg-[#f4fbf6] text-zinc-900 hover:bg-[#e8f7ec]";
            }

            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.href, title)}
                className={`p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 group relative min-h-[225px] ${cellBg}`}
              >
                <div className="space-y-3">
                  {/* Top Badges & Metric Row */}
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isDark
                          ? 'bg-zinc-900 text-emerald-300 border border-zinc-800 group-hover:scale-105' 
                          : isPistachio
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 group-hover:scale-105'
                            : 'bg-zinc-100 text-black border border-zinc-200 group-hover:bg-black group-hover:text-white group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {app.metricBadge && (
                        <span 
                          className={`text-[9.5px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                            isDark 
                              ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' 
                              : isPistachio
                                ? 'bg-emerald-200/80 text-emerald-950 font-bold'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {app.metricBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      {app.categoryLabel}
                    </div>
                    <h3 className={`text-base font-bold font-display mb-1.5 leading-snug line-clamp-1 ${isDark ? 'text-white' : 'text-black'}`}>
                      {title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs font-bold ${isDark ? 'border-zinc-800/80 text-zinc-300' : isPistachio ? 'border-emerald-200/80 text-emerald-900' : 'border-zinc-100 text-zinc-700'}`}>
                  <span className="inline-flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                    <span>فتح القسم</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </span>
                  <span className={`text-[10px] font-mono font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
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
