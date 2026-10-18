import React from 'react';
import { Sparkles, ShieldCheck, Building2, Layers, ArrowUpLeft } from 'lucide-react';
import { BusinessIllustration } from './BusinessIllustration';
import { CorporateAvatar } from './CorporateAvatar';
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

interface DepartmentModuleBannerProps {
  activeTab: string;
  activeTabTitle?: string;
  onSelectTab: (href: string, title: string) => void;
}

const DEPARTMENT_QUICK_TABS: Record<DepartmentId, Array<{ key: string; label: string }>> = {
  finance: [
    { key: 'smacc-accounting', label: 'محاسبة سماك SMACC' },
    { key: 'finance-home', label: 'الإدارة المالية والقوائم' },
    { key: 'zatca', label: 'الفوترة الإلكترونية ZATCA' },
    { key: 'journals', label: 'قيود اليومية' },
    { key: 'financial-requests', label: 'العهد وطلبات الصرف' },
    { key: 'cost-centers', label: 'مراكز التكلفة' },
    { key: 'smacc-inventory', label: 'المخزون والأصول' },
    { key: 'data-import', label: 'مستخرج الـ 100 فاتورة' },
  ],
  recruitment: [
    { key: 'recruitment-contracts', label: 'عقود الاستقدام (مساند)' },
    { key: 'orders', label: 'طلبات الاستقدام والحجوزات' },
    { key: 'ingaz', label: 'تفاويض إنجاز والتأشيرات' },
    { key: 'sponsorship-transfer', label: 'نقل الخدمات والكفالة' },
    { key: 'travel', label: 'الرحلات واستقبال المطار' },
    { key: 'musaned-master-plan', label: 'الربط المباشر مع مساند' },
  ],
  rental: [
    { key: 'rent-contracts', label: 'عقود التأجير المرن' },
    { key: 'rent-packages', label: 'باقات وأسعار التأجير' },
    { key: 'rental-drivers', label: 'تشغيل السائقين' },
    { key: 'rental-domestic', label: 'تشغيل العمالة المنزلية' },
    { key: 'cvs-rental', label: 'سير التأجير الجاهزة' },
  ],
  ats: [
    { key: 'cvs-recruitment', label: 'بنك السير الذاتية' },
    { key: 'ats-pipeline', label: 'مسار الفرز الذكي ATS' },
    { key: 'create-cv', label: 'إضافة سيرة ذاتية' },
    { key: 'offices', label: 'المكاتب والوكالات الخارجية' },
    { key: 'external-offices', label: 'عقود وحصص الوكلاء' },
    { key: 'foreign-agency-portal', label: 'بوابة الوكيل الخارجي' },
    { key: 'agent-imports', label: 'استيراد دفعات السير' },
  ],
  hr: [
    { key: 'employees', label: 'شؤون الموظفين والرواتب' },
    { key: 'attendances', label: 'الحضور والانصراف الذكي' },
    { key: 'employee-monitoring', label: 'مراقبة الأداء والإنتاجية' },
    { key: 'custodies', label: 'العهد العينية للموظفين' },
    { key: 'branch-departments', label: 'هيكل الفروع والأقسام' },
    { key: 'smacc-employees', label: 'إعدادات موظفي سماك' },
  ],
  crm: [
    { key: 'clients', label: 'سجل العملاء والمبيعات' },
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
    { key: 'deportation-stage', label: 'إجراءات الترحيل النظامي' },
  ],
  tenders: [
    { key: 'kas-suite', label: 'بوابة شركة كاس المستقلة' },
    { key: 'tenders-boq', label: 'منافسات اعتماد وجداول BOQ' },
    { key: 'kas-etmad-cloud', label: 'سحابة اعتماد (2,650+ منافسة)' },
  ],
  executive: [
    { key: 'dashboard', label: 'لوحة القيادة التنفيذية' },
    { key: 'group-command-center', label: 'مركز قيادة المجموعة' },
    { key: 'admin-dashboard', label: 'لوحة الرقابة العليا' },
    { key: 'reports', label: 'التقارير التحليلية BI' },
    { key: 'iam', label: 'الهوية والصلاحيات IAM' },
    { key: 'legal-compliance', label: 'الحوكمة والامتثال القانوني' },
    { key: 'activity-logs', label: 'سجل التدقيق والعمليات' },
    { key: 'settings', label: 'إعدادات النظام والربط' },
  ],
};

// Tabs that already render their own full-width hero banner inside the page component
const TABS_WITH_INTERNAL_HERO = new Set([
  'dashboard',
]);

export const DepartmentModuleBanner: React.FC<DepartmentModuleBannerProps> = ({
  activeTab,
  activeTabTitle,
  onSelectTab,
}) => {
  const { activeCompany } = useCompany();
  const currentUser = authService.getCurrentUser();
  const scope = resolveDepartmentAndCompany(
    currentUser?.email || currentUser?.username || '',
    currentUser?.role,
    currentUser?.company_id || activeCompany?.id,
    currentUser?.department_id
  );

  // Determine which department owns the current tab so Executive users see the exact department context of the open module
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

  if (TABS_WITH_INTERNAL_HERO.has(activeTab)) {
    return null;
  }

  return (
    <div className="mb-5 rounded-2xl bg-gradient-to-l from-[#1D2428] via-[#232B30] to-[#161B1E] text-white border border-[#CFA64A]/35 shadow-md overflow-hidden">
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
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white/10 text-zinc-200 border border-white/15">
                <Building2 className="w-3 h-3 text-[#CFA64A]" />
                <span>{activeCompany?.name || 'مجموعة خالد السليم القابضة'}</span>
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white truncate">
              {activeTabTitle || meta.titleAr}
            </h2>
            <p className="text-xs text-zinc-300 line-clamp-1">
              {meta.subtitleAr}
            </p>
          </div>
        </div>

        {/* Left: Responsible Specialist Avatar & Faris/Noura Instant Departmental Copilot */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
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
              <div className="text-[10px] text-[#E6D3A7] font-semibold">
                {deptDef.nameAr}
              </div>
            </div>
          </div>

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
                    prompt: `أهلاً بك، أحتاج مساعدتك في (${activeTabTitle || meta.titleAr}) ضمن ${deptDef.nameAr}. ما أهم المهام والإجراءات المتاحة لي الآن؟`,
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

      {/* Department Sub-Modules Quick Switcher Bar */}
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
      </div>
    </div>
  );
};

export default DepartmentModuleBanner;
