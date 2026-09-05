import React from 'react';
import { 
  Building2, Briefcase, FileSpreadsheet, Layers, ShieldCheck, 
  Users, Truck, Receipt, CloudLightning, ShieldAlert, ArrowRight,
  ChevronLeft, Award, Sparkles, MapPin, PhoneCall, ExternalLink,
  CheckCircle2, Flame, Calculator, Store
} from 'lucide-react';

export type KasDepartmentId = 
  | 'command-center'
  | 'monafasat'
  | 'boq-editor'
  | 'suppliers'
  | 'purchase-orders'
  | 'contracts-projects'
  | 'zatca-invoices'
  | 'etmad-cloud-api'
  | 'audit-security';

interface KasNavigationSidebarProps {
  activeDept: KasDepartmentId;
  onSelectDept: (dept: KasDepartmentId) => void;
  onReturnToErp?: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
}

export const KAS_DEPARTMENTS: {
  id: KasDepartmentId;
  title: string;
  titleEn: string;
  badge?: string;
  badgeColor?: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}[] = [
  {
    id: 'command-center',
    title: 'مركز العمليات والمؤشرات التنفيذية',
    titleEn: 'Command Center & Executive KPIs',
    badge: 'لحظي',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    icon: Building2,
    description: 'مؤشرات الترسية، مبيعات ZATCA، كراسات BOQ، ونسب الإنجاز',
  },
  {
    id: 'monafasat',
    title: 'منصة اعتماد والمنافسات الحكومية',
    titleEn: 'Etmad Competitions Directory',
    badge: '2,651 منافسة',
    badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    icon: Layers,
    description: 'استعراض المنافسات المطروحة، مواعيد الإغلاق، والضمانات البنكية',
  },
  {
    id: 'boq-editor',
    title: 'محرر جداول الكميات الذكي (BOQ)',
    titleEn: 'Live Excel-Style BOQ Editor',
    badge: 'Excel Live',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    icon: Calculator,
    description: 'تسعير البنود، حساب الهامش، الضريبة 15%، التفقيط، والتصدير 10 صيغ',
  },
  {
    id: 'suppliers',
    title: 'سجل الموردين والمقاولين المعتمدين',
    titleEn: 'Approved Suppliers & Subcontractors',
    badge: '48 مورد',
    badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    icon: Store,
    description: 'مقارنة عروض الأسعار، سجل الأسعار التاريخي، والتقييم الفني',
  },
  {
    id: 'purchase-orders',
    title: 'أوامر التوريد وصرف المستودعات',
    titleEn: 'Purchase Orders & Warehousing',
    badge: '18 أمر صرف',
    badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    icon: Truck,
    description: 'إصدار أوامر الصرف لمستودعات كاس المركزية للمشاريع المعتمدة',
  },
  {
    id: 'contracts-projects',
    title: 'ترسية المشاريع والعقود الحكومية',
    titleEn: 'Awards, Projects & Contracts',
    badge: '12 مشروع',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    icon: Award,
    description: 'مشاريع اليوم الوطني، الموانئ، الوزارات، والمستخلصات الدورية',
  },
  {
    id: 'zatca-invoices',
    title: 'الفوترة الإلكترونية ZATCA المرحلة 2',
    titleEn: 'E-Invoicing & Tax Compliance',
    badge: 'QR مشفر',
    badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    icon: Receipt,
    description: 'فواتير ضريبية معتمدة، إشعارات دائنة/مدينة، وربط هيئة الزكاة',
  },
  {
    id: 'etmad-cloud-api',
    title: 'مركز تكامل سحابة اعتماد (API)',
    titleEn: 'Etmad Cloud Hub & Webhooks',
    badge: 'Active Hub',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    icon: CloudLightning,
    description: 'المزامنة السحابية اللحظية للمنافسات والبيانات والمستندات الرسمية',
  },
  {
    id: 'audit-security',
    title: 'الأمان وسجل التدقيق وعزل البيانات',
    titleEn: 'KAS Audit Log & Zero Leakage',
    badge: 'عزل تام 100%',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    icon: ShieldCheck,
    description: 'سجل حركات الفريق، تشفير المعاملات، ومنع التسريب المشترك',
  },
];

export const KAS_BRANCHES = [
  { id: 'riyadh', name: 'المقر الرئيسي — الرياض (طريق الملك فهد)', code: 'RUH-HQ' },
  { id: 'jeddah', name: 'فرع المشاريع الغربية — جدة (الميناء)', code: 'JED-PRJ' },
  { id: 'dammam', name: 'فرع التوريدات الشرقية — الدمام (الصناعية)', code: 'DMM-SUP' },
];

export const KasNavigationSidebar: React.FC<KasNavigationSidebarProps> = ({
  activeDept,
  onSelectDept,
  onReturnToErp,
  selectedBranch,
  onSelectBranch,
}) => {
  return (
    <aside 
      className="w-72 bg-[#121619] text-zinc-200 border-l border-white/10 flex flex-col h-full select-none shrink-0 shadow-2xl overflow-hidden"
      dir="rtl"
    >
      {/* Brand & Entity Header */}
      <div className="p-4 border-b border-white/10 bg-[#171c20]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/20 shrink-0">
            KAS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                منظومة معزولة
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">RC04</span>
            </div>
            <h2 className="text-sm font-bold text-white truncate m-0 mt-0.5">
              مؤسسة كاس للتجارة والمنافسات
            </h2>
            <p className="text-[10px] text-zinc-400 truncate m-0 font-sans">
              سحابة اعتماد وجداول الكميات الذكية (BOQ)
            </p>
          </div>
        </div>

        {/* Commercial Registration & Tax Number Pill */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono">
          <div>
            <span className="text-zinc-500 block">السجل التجاري:</span>
            <span className="text-zinc-200 font-bold">1010789234</span>
          </div>
          <div>
            <span className="text-zinc-500 block">الرقم الضريبي ZATCA:</span>
            <span className="text-emerald-400 font-bold truncate block">310284759200003</span>
          </div>
        </div>

        {/* Branch Quick Switcher */}
        <div className="mt-3">
          <label className="text-[10.5px] font-bold text-zinc-400 block mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>نطاق الفرع التشغيلي لكاس:</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-400 cursor-pointer font-sans"
          >
            {KAS_BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.name} className="bg-[#171c20] text-white">
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 9 Specialized Departments Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-2 py-1 text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">
          أقسام منظومة كاس المستقلة (9 أقسام):
        </div>

        {KAS_DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const isActive = activeDept === dept.id;

          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectDept(dept.id)}
              className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-start gap-3 relative group ${
                isActive
                  ? 'bg-gradient-to-l from-amber-500/20 to-amber-500/5 text-white border border-amber-500/40 shadow-md shadow-amber-900/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/30 font-bold' 
                    : 'bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-zinc-200'}`}>
                    {dept.title}
                  </span>
                  {dept.badge && (
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${dept.badgeColor || 'bg-zinc-800 text-zinc-300'}`}>
                      {dept.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 leading-tight">
                  {dept.description}
                </p>
              </div>

              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1 bg-amber-400 rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer: Emergency Support & Return to Central ERP */}
      <div className="p-3 border-t border-white/10 bg-[#171c20] space-y-2">
        {/* Quick Hotline & Security Status */}
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10.5px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">العزل مفعل (Zero Cross-Leakage)</span>
          </div>
          <span className="text-zinc-500 text-[9.5px] font-mono">v2026.9</span>
        </div>

        {onReturnToErp && (
          <button
            type="button"
            onClick={onReturnToErp}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span>العودة لمنظومة المجموعة الرئيسية (ERP)</span>
          </button>
        )}
      </div>
    </aside>
  );
};
