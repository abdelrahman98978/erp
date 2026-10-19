import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  Layers,
  ArrowUpLeft,
  Star,
  ChevronLeft,
  Minimize2,
  Maximize2,
  Lightbulb,
  Search,
  UploadCloud,
  CheckCircle2,
  X,
} from 'lucide-react';
import { BusinessIllustration } from './BusinessIllustration';
import { CorporateAvatar } from './CorporateAvatar';
import { DynamicActionButton, DynamicButtonPreset } from './DynamicActionButton';
import {
  resolveIllustrationForTab,
  getIllustrationMetadata,
} from '../../services/visualAssetsRegistry';
import {
  authService,
  CORPORATE_DEPARTMENTS,
  DepartmentId,
  resolveDepartmentAndCompany,
} from '../../services/authService';
import { useCompany } from '../../contexts/CompanyContext';
import { useAppStore } from '../../stores/appStore';
import { getPinnedTabs, togglePinnedTab, PinnedTabItem } from './QuickSearchModal';

interface DepartmentModuleBannerProps {
  activeTab: string;
  activeTabTitle?: string;
  onSelectTab: (href: string, title: string) => void;
}

const SLIM_BANNER_STORAGE_KEY = 'alsulaim_banner_slim_mode_v1';

const DEPARTMENT_QUICK_TABS: Record<DepartmentId, Array<{ key: string; label: string }>> = {
  finance: [
    { key: 'smacc-accounting', label: 'محاسبة سماك SMACC' },
    { key: 'smacc-gl-tree', label: 'شجرة الحسابات (GL)' },
    { key: 'smacc-vouchers', label: 'سندات القبض والصرف' },
    { key: 'finance-home', label: 'القوائم المالية' },
    { key: 'trial-balance', label: 'ميزان المراجعة' },
    { key: 'income-statement', label: 'قائمة الدخل' },
    { key: 'zatca', label: 'الفوترة الإلكترونية ZATCA' },
    { key: 'invoices', label: 'فواتير المبيعات والعقود' },
    { key: 'journals', label: 'قيود اليومية' },
    { key: 'financial-requests', label: 'العهد وطلبات الصرف' },
    { key: 'cost-centers', label: 'مراكز التكلفة' },
    { key: 'smacc-inventory', label: 'المخزون والأصول' },
    { key: 'smacc-modules', label: 'الأقسام الـ 6 لسماك' },
    { key: 'universal-extractor', label: 'مستخرج الـ 100 فاتورة' },
  ],
  recruitment: [
    { key: 'recruitment-contracts', label: 'عقود الاستقدام (مساند)' },
    { key: 'new-recruitment-contract', label: '+ عقد استقدام جديد' },
    { key: 'orders', label: 'طلبات الاستقدام والحجوزات' },
    { key: 'pending-orders', label: 'طلبات قيد الإجراء' },
    { key: 'ingaz', label: 'تفاويض إنجاز والتأشيرات' },
    { key: 'sponsorship-transfer', label: 'نقل الخدمات والكفالة' },
    { key: 'probation-transfer', label: 'فترة التجربة (90 يوم)' },
    { key: 'travel', label: 'الرحلات واستقبال المطار' },
    { key: 'group-dispatch', label: 'تفويج العاملات الجماعي' },
    { key: 'musaned-master-plan', label: 'الربط المباشر مع مساند' },
  ],
  rental: [
    { key: 'rent-contracts', label: 'عقود التأجير المرن' },
    { key: 'new-rent-contract', label: '+ عقد تأجير جديد' },
    { key: 'rent-packages', label: 'باقات وأسعار التأجير' },
    { key: 'rental-drivers', label: 'تشغيل السائقين' },
    { key: 'rental-domestic', label: 'تشغيل العمالة المنزلية' },
    { key: 'cvs-rental', label: 'سير التأجير الجاهزة' },
    { key: 'returned-rent', label: 'عقود التأجير المرتجعة' },
  ],
  ats: [
    { key: 'cvs-recruitment', label: 'بنك السير الذاتية' },
    { key: 'ats-pipeline', label: 'مسار الفرز الذكي ATS' },
    { key: 'create-cv', label: '+ إضافة سيرة ذاتية' },
    { key: 'offices', label: 'المكاتب والوكالات الخارجية' },
    { key: 'agent-accounts', label: 'كشوف حسابات الوكلاء' },
    { key: 'office-transfers', label: 'حوالات المكاتب الخارجية' },
    { key: 'external-offices', label: 'عقود وحصص الوكلاء' },
    { key: 'foreign-agency-portal', label: 'بوابة الوكيل الخارجي' },
    { key: 'agent-imports', label: 'استيراد دفعات السير' },
  ],
  hr: [
    { key: 'employees', label: 'شؤون الموظفين والرواتب' },
    { key: 'employee-salaries', label: 'مسيرات الرواتب WPS' },
    { key: 'employee-contracts', label: 'عقود قوى والتأمينات' },
    { key: 'employee-leaves', label: 'الإجازات والاستحقاقات' },
    { key: 'attendances', label: 'الحضور والانصراف الذكي' },
    { key: 'employee-monitoring', label: 'مراقبة الأداء والإنتاجية' },
    { key: 'custodies', label: 'العهد العينية للموظفين' },
    { key: 'branch-departments', label: 'هيكل الفروع والأقسام' },
    { key: 'smacc-employees', label: 'إعدادات موظفي سماك' },
  ],
  crm: [
    { key: 'clients', label: 'سجل العملاء والمبيعات' },
    { key: 'vip-clients', label: 'كبار العملاء VIP' },
    { key: 'corporate-clients', label: 'عملاء الشركات B2B' },
    { key: 'complaints', label: 'الشكاوى ومؤشر SLA' },
    { key: 'whatsapp-inbox', label: 'صندوق واتساب الموحد' },
    { key: 'unified-communication', label: 'مركز الاتصال الموحد' },
    { key: 'sent-messages', label: 'حملات الرسائل والإشعارات' },
    { key: 'client-portal', label: 'بوابة الخدمة الذاتية للعميل' },
    { key: 'website-visitors', label: 'تحليلات زوار المنصة' },
  ],
  shelter: [
    { key: 'shelter-suite', label: 'بوابة دار الرواد للإيواء' },
    { key: 'inside-shelter', label: 'العاملات داخل الإيواء' },
    { key: 'room-management', label: 'إدارة الغرف والأسرة' },
    { key: 'food-catering', label: 'الإعاشة والرعاية الصحية' },
    { key: 'available-transfer', label: 'جاهزات لنقل الكفالة' },
    { key: 'deportation-stage', label: 'إجراءات الترحيل النظامي' },
    { key: 'shelter-archive', label: 'أرشيف الخروج النهائي' },
  ],
  tenders: [
    { key: 'kas-suite', label: 'بوابة شركة كاس المستقلة' },
    { key: 'tenders-boq', label: 'منافسات اعتماد وجداول BOQ' },
    { key: 'kas-etmad-cloud', label: 'سحابة اعتماد (2,650+ منافسة)' },
    { key: 'purchase-orders', label: 'أوامر الشراء والتوريد' },
    { key: 'project-guarantees', label: 'الضمانات البنكية للمشاريع' },
  ],
  executive: [
    { key: 'dashboard', label: 'لوحة القيادة التنفيذية' },
    { key: 'group-command-center', label: 'مركز قيادة المجموعة (5 شركات)' },
    { key: 'admin-dashboard', label: 'لوحة الرقابة العليا' },
    { key: 'reports', label: 'التقارير التحليلية BI' },
    { key: 'iam', label: 'الهوية والصلاحيات IAM' },
    { key: 'users', label: 'إدارة المستخدمين' },
    { key: 'legal-compliance', label: 'الحوكمة والامتثال القانوني' },
    { key: 'master-constants', label: 'ثوابت النظام المرجعية' },
    { key: 'activity-logs', label: 'سجل التدقيق والعمليات' },
    { key: 'settings', label: 'إعدادات النظام والربط' },
  ],
};

const DEPARTMENT_GUIDED_PLAYBOOKS: Record<
  DepartmentId,
  Array<{ title: string; desc: string; targetTab: string; badge: string }>
> = {
  finance: [
    {
      title: 'استخلاص 100+ فاتورة وترحيلها لدفتر سماك',
      desc: 'ارفع ملفات PDF أو صور الفواتير ليقوم الماسح الذكي بتوليد قيود اليومية تلقائياً.',
      targetTab: 'universal-extractor',
      badge: 'OCR ذكي',
    },
    {
      title: 'مراجعة ميزان المراجعة والأقسام الـ 6 لسماك',
      desc: 'افحص توازن المدين والدائن وحسابات الصندوق والبنوك والذمم.',
      targetTab: 'smacc-accounting',
      badge: 'SMACC',
    },
    {
      title: 'إصدار وتوثيق فاتورة ضريبية ZATCA',
      desc: 'توليد فاتورة المرحلة الثانية بصيغة XML UBL 2.1 مع ختم QR المشفر.',
      targetTab: 'zatca',
      badge: 'فاتورة ZATCA',
    },
    {
      title: 'اعتماد طلبات الصرف والعهد المالية',
      desc: 'مراجعة طلبات السلف والعهد المرفوعة من الفروع وإصدار سندات الصرف.',
      targetTab: 'financial-requests',
      badge: 'سندات',
    },
  ],
  recruitment: [
    {
      title: 'إنشاء وتوثيق عقد استقدام مساند جديد',
      desc: 'تسجيل بيانات العميل والتأشيرة والمرشحة وإصدار العقد الموحد.',
      targetTab: 'recruitment-contracts',
      badge: 'مساند',
    },
    {
      title: 'متابعة تفاويض التأشيرات في منصة إنجاز',
      desc: 'ربط رقم التأشيرة بالوكالة الخارجية ومتابعة التفييز بالسفارة.',
      targetTab: 'ingaz',
      badge: 'إنجاز',
    },
    {
      title: 'جدولة رحلات الوصول واستقبال المطار',
      desc: 'متابعة بوليصات الطيران وتوجيه السائقين لاستلام العاملات من المطار.',
      targetTab: 'travel',
      badge: 'المطار',
    },
    {
      title: 'إدارة إجراءات نقل الخدمات وفترة التجربة',
      desc: 'تقييم الـ 90 يوماً وإتمام نقل الكفالة والمقاصة المالية.',
      targetTab: 'sponsorship-transfer',
      badge: 'نقل خدمات',
    },
  ],
  rental: [
    {
      title: 'تحرير عقد تأجير مرن (شهري / موسمي / بالساعة)',
      desc: 'اختيار الكادر المتاح والباقة المناسبة وجدولة دفعات الإيجار.',
      targetTab: 'rent-contracts',
      badge: 'عقد إيجار',
    },
    {
      title: 'تحديث باقات وأسعار التأجير والعروض',
      desc: 'إدارة تسعير الباقات والخصومات الموسمية لشركة الياقوت.',
      targetTab: 'rent-packages',
      badge: 'الباقات',
    },
    {
      title: 'جدولة تشغيل السائقين والعمالة المنزلية',
      desc: 'متابعة العقود النشطة وتواريخ التجديد والاستبدال.',
      targetTab: 'rental-drivers',
      badge: 'التشغيل',
    },
    {
      title: 'فرز السير الذاتية الجاهزة للتأجير الفوري',
      desc: 'استعراض الكوادر المتوفرة داخل المملكة والجاهزة للتسليم.',
      targetTab: 'cvs-rental',
      badge: 'جاهز للتسليم',
    },
  ],
  ats: [
    {
      title: 'إضافة سيرة ذاتية أو مسح جواز سفر مرشح',
      desc: 'إنشاء بطاقة مرشح احترافية مع معاينة الأفاتار واستخلاص بيانات الجواز.',
      targetTab: 'create-cv',
      badge: 'إنشاء سيرة',
    },
    {
      title: 'تحريك المرشحين عبر مسار الفرز ATS (12 مرحلة)',
      desc: 'متابعة الفحص الطبي، المقابلة، التدريب، وإصدار التذكرة.',
      targetTab: 'ats-pipeline',
      badge: 'ATS Kanban',
    },
    {
      title: 'إدارة عقود وحوالات الوكالات والمكاتب الخارجية',
      desc: 'ضبط حصص المكاتب في 14 دولة ومتابعة العمولات والحوالات الدولية.',
      targetTab: 'offices',
      badge: 'الوكلاء',
    },
    {
      title: 'استيراد دفعة سير ذاتية من الوكيل الخارجي',
      desc: 'فحص وقبول دفعات المرشحين المرسلة من الوكالات المعتمدة.',
      targetTab: 'agent-imports',
      badge: 'استيراد دفعات',
    },
  ],
  hr: [
    {
      title: 'إصدار مسير الرواتب وملف حماية الأجور WPS',
      desc: 'احتساب الرواتب، البدلات، التأمينات GOSI، وتصدير ملف البنك.',
      targetTab: 'employees',
      badge: 'WPS & GOSI',
    },
    {
      title: 'مراقبة البصمة الجغرافية والحضور والانصراف',
      desc: 'متابعة الالتزام اليومي وساعات العمل الإضافي والاستئذان.',
      targetTab: 'attendances',
      badge: 'الحضور',
    },
    {
      title: 'رادار الإنتاجية والنبض الوظيفي الذكي',
      desc: 'تحليل مؤشرات الإنجاز والوقاية من الاحتراق الوظيفي وجلسات 1-on-1.',
      targetTab: 'employee-monitoring',
      badge: 'الإنتاجية',
    },
    {
      title: 'إدارة العهد العينية وهيكل الفروع والأقسام',
      desc: 'توثيق تسليم الأجهزة والسيارات وتوزيع الإدارات عبر الشركات الخمس.',
      targetTab: 'custodies',
      badge: 'العهد والفروع',
    },
  ],
  crm: [
    {
      title: 'إدارة سجل العملاء وتصنيفات VIP والشركات',
      desc: 'متابعة ملفات العملاء، العقود المرتبطة، وسجل التواصل.',
      targetTab: 'clients',
      badge: 'العملاء',
    },
    {
      title: 'معالجة الشكاوى والمطالبات ضمن مؤشر SLA',
      desc: 'حل بلاغات العملاء وإصدار التسويات والحوالات البنكية المعتمدة.',
      targetTab: 'complaints',
      badge: 'SLA الشكاوى',
    },
    {
      title: 'الرد الفوري عبر صندوق واتساب المؤسسي الموحد',
      desc: 'محادثات العملاء الفورية وقوالب الرد السريع المعتمدة.',
      targetTab: 'whatsapp-inbox',
      badge: 'واتساب',
    },
    {
      title: 'متابعة بوابة العميل وتحليلات زوار المنصة',
      desc: 'رصد الطلبات الرقمية الواردة من الموقع وتحويل الزوار إلى عقود.',
      targetTab: 'website-visitors',
      badge: 'زوار المنصة',
    },
  ],
  shelter: [
    {
      title: 'تسكين عاملة جديدة وإدارة الغرف والأسرة',
      desc: 'توثيق دخول العاملة لمركز دار الرواد وتخصيص الغرفة والجناح.',
      targetTab: 'shelter-suite',
      badge: 'دار الرواد',
    },
    {
      title: 'متابعة الإعاشة اليومية والرعاية الصحية والنفسية',
      desc: 'جدولة الوجبات والفحوصات الدورية للنزيلات داخل الإيواء.',
      targetTab: 'food-catering',
      badge: 'الإعاشة والرعاية',
    },
    {
      title: 'تجهيز العاملات المتاحات لنقل الخدمات الفوري',
      desc: 'عرض ملفات العاملات الجاهزات للتجربة ونقل الكفالة.',
      targetTab: 'available-transfer',
      badge: 'نقل الكفالة',
    },
    {
      title: 'إتمام إجراءات السفر والترحيل النظامي النهائي',
      desc: 'إصدار تأشيرة الخروج النهائي وحجز تذكرة العودة وتوثيق المخالصة.',
      targetTab: 'deportation-stage',
      badge: 'الترحيل',
    },
  ],
  tenders: [
    {
      title: 'استعراض سحابة منافسات اعتماد (2,650+ منافسة)',
      desc: 'تحليل المنافسات الحكومية ونسب التطابق والفرص الاستثمارية.',
      targetTab: 'kas-etmad-cloud',
      badge: 'سحابة اعتماد',
    },
    {
      title: 'تسعير جداول الكميات BOQ وإصدار أوامر الشراء',
      desc: 'حساب التكاليف المباشرة وهوامش الربح والضمانات البنكية.',
      targetTab: 'tenders-boq',
      badge: 'BOQ & PO',
    },
    {
      title: 'إدارة محفظة المشاريع في بوابة شركة كاس المستقلة',
      desc: 'متابعة نسب الإنجاز، المستخلصات المالية، والجدول الزمني للمشاريع.',
      targetTab: 'kas-suite',
      badge: 'بوابة كاس',
    },
    {
      title: 'استخلاص كراسة الشروط وجداول الكميات بالذكاء الاصطناعي',
      desc: 'رفع ملف المنافسة PDF/Excel لتحليله واستخراج البنود تلقائياً.',
      targetTab: 'universal-extractor',
      badge: 'ماسح الكراسات',
    },
  ],
  executive: [
    {
      title: 'مراقبة أداء الشركات الـ 5 في مركز قيادة المجموعة',
      desc: 'مقارنة الإيرادات، التدفقات النقدية، والعقود النشطة لكل كيان.',
      targetTab: 'group-command-center',
      badge: 'قيادة المجموعة',
    },
    {
      title: 'ضبط الهوية والصلاحيات ومصفوفة الأدوار IAM',
      desc: 'إدارة الـ 28 حساباً، فصل المهام SoD، والتفويضات الإدارية.',
      targetTab: 'iam',
      badge: 'IAM & RBAC',
    },
    {
      title: 'استعراض القوائم المالية الموحدة وتقارير BI',
      desc: 'تحليل قائمة الدخل والميزانية العمومية المجمعة للمجموعة.',
      targetTab: 'reports',
      badge: 'تقارير BI',
    },
    {
      title: 'فحص سجل الرقابة والتدقيق الأمني والامتثال القانوني',
      desc: 'متابعة كافة العمليات الحساسة والتعهدات النظامية.',
      targetTab: 'activity-logs',
      badge: 'التدقيق الأمني',
    },
  ],
};

// Tabs that already render their own full-width hero banner inside the page component
const TABS_WITH_INTERNAL_HERO = new Set(['dashboard']);

export const DepartmentModuleBanner: React.FC<DepartmentModuleBannerProps> = ({
  activeTab,
  activeTabTitle,
  onSelectTab,
}) => {
  const { activeCompany } = useCompany();
  const { setQuickSearchOpen } = useAppStore();
  const currentUser = authService.getCurrentUser();
  const scope = resolveDepartmentAndCompany(
    currentUser?.email || currentUser?.username || '',
    currentUser?.role,
    currentUser?.company_id || activeCompany?.id,
    currentUser?.department_id
  );

  const [isSlimMode, setIsSlimMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SLIM_BANNER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [pinnedTabs, setPinnedTabs] = useState<PinnedTabItem[]>(() => getPinnedTabs());
  const [showPlaybook, setShowPlaybook] = useState<boolean>(false);

  useEffect(() => {
    const handleToggleSlim = () => {
      setIsSlimMode((prev) => {
        const next = !prev;
        try {
          localStorage.setItem(SLIM_BANNER_STORAGE_KEY, String(next));
        } catch {
          // ignore
        }
        return next;
      });
    };
    const handleFavoritesUpdated = (e: Event) => {
      const custom = e as CustomEvent<PinnedTabItem[]>;
      if (custom.detail) {
        setPinnedTabs(custom.detail);
      } else {
        setPinnedTabs(getPinnedTabs());
      }
    };
    window.addEventListener('alsulaim-toggle-slim-banner', handleToggleSlim);
    window.addEventListener('alsulaim-favorites-updated', handleFavoritesUpdated);
    return () => {
      window.removeEventListener('alsulaim-toggle-slim-banner', handleToggleSlim);
      window.removeEventListener('alsulaim-favorites-updated', handleFavoritesUpdated);
    };
  }, []);

  const toggleSlim = () => {
    const next = !isSlimMode;
    setIsSlimMode(next);
    try {
      localStorage.setItem(SLIM_BANNER_STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  // Determine which department owns the current tab
  const resolvedDeptId: DepartmentId = React.useMemo(() => {
    const t = (activeTab || '').toLowerCase();
    for (const [deptKey, def] of Object.entries(CORPORATE_DEPARTMENTS)) {
      if (deptKey !== 'executive' && def.allowedTabs.includes(t)) {
        return deptKey as DepartmentId;
      }
    }
    return (scope.departmentId as DepartmentId) || 'executive';
  }, [activeTab, scope.departmentId]);

  const deptDef = CORPORATE_DEPARTMENTS[resolvedDeptId] || CORPORATE_DEPARTMENTS.executive;
  const illustrationKey = resolveIllustrationForTab(activeTab, resolvedDeptId);
  const meta = getIllustrationMetadata(illustrationKey);
  const quickTabs = DEPARTMENT_QUICK_TABS[resolvedDeptId] || DEPARTMENT_QUICK_TABS.executive;
  const playbookItems =
    DEPARTMENT_GUIDED_PLAYBOOKS[resolvedDeptId] || DEPARTMENT_GUIDED_PLAYBOOKS.executive;

  const currentTitle = activeTabTitle || meta.titleAr;
  const isPinned = pinnedTabs.some((t) => t.href === activeTab);

  const handleTogglePin = () => {
    const next = togglePinnedTab({
      href: activeTab,
      title: currentTitle,
      category: deptDef.nameAr,
    });
    setPinnedTabs(next);
  };

  const isInternalHeroTab = TABS_WITH_INTERNAL_HERO.has(activeTab);

  return (
    <div className="mb-5 rounded-2xl bg-gradient-to-l from-[#1D2428] via-[#232B30] to-[#161B1E] text-white border border-[#CFA64A]/35 shadow-md overflow-hidden transition-all">
      {/* 1-Click 9-Departments Switcher Strip (الأقسام الإدارية الـ 9) */}
      <div className="px-3.5 py-2 bg-[#14181B] border-b border-[#CFA64A]/25 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10.5px] font-black text-[#CFA64A] shrink-0 pl-2 border-l border-white/15">
          الأقسام الـ 9:
        </span>
        {(Object.values(CORPORATE_DEPARTMENTS) as Array<(typeof CORPORATE_DEPARTMENTS)[DepartmentId]>).map(
          (dept) => {
            const isActiveDept = resolvedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => onSelectTab(dept.defaultTab, dept.nameAr)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold inline-flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                  isActiveDept
                    ? 'bg-[#CFA64A] text-[#1D2428] font-black shadow-2xs'
                    : 'bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10'
                }`}
              >
                <span>{dept.emoji}</span>
                <span>{dept.nameAr}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Top Interactive Breadcrumb & Workspace Ergonomics Strip */}
      <div className="px-4 py-2 bg-black/30 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Right: Interactive Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard', 'الرئيسية ولوحة القيادة')}
            className="text-zinc-300 hover:text-[#CFA64A] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#CFA64A]" />
            <span className="truncate max-w-[180px]">
              {activeCompany?.name || 'مجموعة خالد السليم القابضة'}
            </span>
          </button>
          <ChevronLeft className="w-3 h-3 text-zinc-500 shrink-0" />
          <button
            type="button"
            onClick={() => onSelectTab(deptDef.defaultTab, deptDef.nameAr)}
            className="text-[#E6D3A7] hover:text-white font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{deptDef.emoji}</span>
            <span>{deptDef.nameAr}</span>
          </button>
          <ChevronLeft className="w-3 h-3 text-zinc-500 shrink-0" />
          <span className="text-white font-black truncate max-w-[240px]">{currentTitle}</span>
        </div>

        {/* Left: Quick Ergonomic Controls (Pin, Playbook, Command Palette, Slim Mode) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleTogglePin}
            title={isPinned ? 'إزالة الشاشة من المفضلة' : 'تثبيت الشاشة في المفضلة السريعة'}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold inline-flex items-center gap-1 transition-all cursor-pointer border ${
              isPinned
                ? 'bg-[#CFA64A]/25 text-[#E6D3A7] border-[#CFA64A]/60'
                : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
            }`}
          >
            <Star
              className={`w-3 h-3 ${isPinned ? 'fill-[#CFA64A] text-[#CFA64A]' : 'text-zinc-400'}`}
            />
            <span>{isPinned ? 'مثبتة بالمفضلة' : 'تثبيت ⭐'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPlaybook((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold inline-flex items-center gap-1 transition-all cursor-pointer border ${
              showPlaybook
                ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50'
                : 'bg-white/5 hover:bg-white/15 text-zinc-200 border-white/10'
            }`}
          >
            <Lightbulb className="w-3 h-3 text-[#CFA64A]" />
            <span>دليل مهام القسم</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickSearchOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold bg-white/5 hover:bg-white/15 text-zinc-200 border border-white/10 cursor-pointer"
            title="فتح لوحة الأوامر والبحث الشامل (Ctrl+K)"
          >
            <Search className="w-3 h-3 text-[#CFA64A]" />
            <span>أوامر سريعة</span>
            <kbd className="text-[9.5px] text-[#E6D3A7] font-mono">Ctrl+K</kbd>
          </button>

          <button
            type="button"
            onClick={toggleSlim}
            className="px-2 py-1 rounded-lg text-[10.5px] font-bold bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10 inline-flex items-center gap-1 cursor-pointer"
            title={isSlimMode ? 'توسيع بانر القسم (Alt+M)' : 'الوضع المدمج لتوسيع مساحة الجدول (Alt+M)'}
          >
            {isSlimMode ? (
              <>
                <Maximize2 className="w-3 h-3 text-[#CFA64A]" />
                <span className="hidden md:inline">توسيع البانر</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3 text-zinc-400" />
                <span className="hidden md:inline">وضع مدمج</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Departmental Guided Playbook Drawer (when toggled) */}
      {showPlaybook && (
        <div className="p-4 bg-[#161B1E] border-b border-[#CFA64A]/30 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#CFA64A]/20 border border-[#CFA64A]/40 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-[#CFA64A]" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  دليل المهام اليومية السريعة — {deptDef.nameAr}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  اختر أي مهمة للانتقال الفوري إليها أو تشغيل الأداة الذكية المرتبطة بها
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPlaybook(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {playbookItems.map((task, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setShowPlaybook(false);
                  if (task.targetTab === 'universal-extractor') {
                    window.dispatchEvent(new CustomEvent('open-universal-extractor'));
                  } else {
                    onSelectTab(task.targetTab, task.title);
                  }
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CFA64A]/60 transition-all cursor-pointer flex flex-col justify-between gap-2 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#CFA64A]/20 text-[#E6D3A7] border border-[#CFA64A]/30">
                      {task.badge}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 opacity-75 group-hover:opacity-100" />
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-[#CFA64A] transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {task.desc}
                  </p>
                </div>
                <div className="text-[10.5px] font-extrabold text-[#CFA64A] inline-flex items-center gap-1 pt-1">
                  <span>بدء المهمة الآن</span>
                  <ArrowUpLeft className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Banner Body (Hidden when Slim / Zen Mode is active or when page has internal hero) */}
      {!isSlimMode && !isInternalHeroTab && (
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Right: Funkyways Brand-Recolored Illustration + Module Context */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <BusinessIllustration
              type={illustrationKey}
              size="sm"
              showBackground={false}
              className="!w-16 !h-16 sm:!w-20 sm:!h-20 rounded-2xl bg-[#FBFBF5] border border-[#CFA64A]/50 p-1.5 shadow-sm shrink-0"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#CFA64A]/20 text-[#E6D3A7] border border-[#CFA64A]/40">
                  <span>{deptDef.emoji}</span>
                  <span>{deptDef.badgeText}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{meta.badgeAr}</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-white truncate">
                {currentTitle}
              </h2>
              <p className="text-xs text-zinc-300 line-clamp-1">{meta.subtitleAr}</p>
            </div>
          </div>

          {/* Left: Responsible Specialist Avatar & Faris/Noura Instant Departmental Copilot */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <CorporateAvatar
                name={currentUser?.full_name || 'مسؤول القسم'}
                role={currentUser?.role || deptDef.nameAr}
                email={currentUser?.email}
                departmentId={resolvedDeptId}
                size="sm"
                status="verified"
              />
              <div className="text-right">
                <div className="text-[11px] font-black text-white leading-tight">
                  {currentUser?.full_name || 'المختص المعتمد'}
                </div>
                <div className="text-[10px] text-[#E6D3A7] font-semibold">{deptDef.nameAr}</div>
              </div>
            </div>

            <DynamicActionButton
              preset={
                activeTab === 'zatca'
                  ? 'zatca-clearance'
                  : resolvedDeptId === 'finance'
                    ? 'payment'
                    : resolvedDeptId === 'hr'
                      ? 'wps-payroll'
                      : resolvedDeptId === 'recruitment'
                        ? 'musaned-auth'
                        : resolvedDeptId === 'rental'
                          ? 'receipt'
                          : 'approval'
              }
              variant={resolvedDeptId === 'finance' || activeTab === 'zatca' ? 'emerald' : 'gold'}
              size="sm"
            />

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-universal-extractor'));
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="استخلاص 100+ فاتورة أو مستند آلياً (Alt+I)"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#CFA64A]" />
              <span className="hidden sm:inline">مستخرج المستندات</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const persona =
                  resolvedDeptId === 'shelter' ||
                  resolvedDeptId === 'hr' ||
                  resolvedDeptId === 'crm' ||
                  resolvedDeptId === 'ats'
                    ? 'noura'
                    : 'faris';
                window.dispatchEvent(
                  new CustomEvent('open-faris-assistant', {
                    detail: {
                      persona,
                      prompt: `أهلاً بك، أحتاج مساعدتك في (${currentTitle}) ضمن ${deptDef.nameAr}. ما أهم المهام والإجراءات المتاحة لي الآن؟`,
                    },
                  })
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-[#CFA64A] hover:bg-[#d8b159] text-[#1D2428] font-black text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>مساعدة فارس ونُورة</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Department Sub-Modules & Pinned Favorites Quick Switcher Bar */}
      <div className="px-4 py-2 bg-black/25 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[#CFA64A] shrink-0 pl-2 border-l border-white/15">
          <Layers className="w-3 h-3" />
          <span>شاشات القسم:</span>
        </span>
        {quickTabs.map((item) => {
          const isCurrent = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key, item.label)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-[#CFA64A] text-[#1D2428] font-black shadow-2xs'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-200 border border-white/10'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {pinnedTabs.length > 0 && (
          <>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[#E6D3A7] shrink-0 pr-2 pl-1 border-r border-white/15">
              <Star className="w-3 h-3 fill-[#CFA64A] text-[#CFA64A]" />
              <span>مفضلاتي:</span>
            </span>
            {pinnedTabs.slice(0, 4).map((pin) => (
              <button
                key={`pin-${pin.href}`}
                type="button"
                onClick={() => onSelectTab(pin.href, pin.title)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === pin.href
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                    : 'bg-white/5 hover:bg-white/15 text-[#E6D3A7] border border-[#CFA64A]/30'
                }`}
              >
                ⭐ {pin.title}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentModuleBanner;
