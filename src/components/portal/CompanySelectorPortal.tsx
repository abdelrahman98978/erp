import React from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { CompanyId } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';
import { 
  Building2, Users, FileText, CheckCircle2, ArrowLeft, 
  Sparkles, Layers, ShieldCheck, ArrowUpRight, Landmark,
  Receipt, Briefcase, ChevronLeft, Globe
} from 'lucide-react';

interface CompanySelectorPortalProps {
  onSelectCompany: (companyId: CompanyId) => void;
}

export const CompanySelectorPortal: React.FC<CompanySelectorPortalProps> = ({ onSelectCompany }) => {
  const { companies, activeCompanyId, setActiveCompanyId } = useCompany();

  const handleChoose = (id: CompanyId) => {
    setActiveCompanyId(id);
    onSelectCompany(id);
  };

  const kasCompany = companies.find(c => c.id === 'KAS' || c.id === 'kas');
  const recruitmentCompanies = companies.filter(c => c.id !== 'KAS' && c.id !== 'kas' && c.id !== 'all');

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 lg:p-8 bg-slate-50/60 dark:bg-slate-950/40 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Enterprise Multi-Company Scope</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">مجموعة شركات خالد السليم</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              بوابة اختيار الكيانات التشغيلية والشركات المستقلة
            </h1>
            <p className="text-sm text-slate-300/80 max-w-2xl leading-relaxed">
              اختر بيئة العمل الخاصة بكل كيان قانوني للوصول إلى السجلات المحاسبية المستقلة، المنافسات الحكومية، عقود الاستقدام، والتقارير التنفيذية مع الحفاظ التام على عزل البيانات.
            </p>
          </div>

          {/* Global Group Admin Button */}
          <button
            type="button"
            onClick={() => handleChoose('all')}
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2.5 backdrop-blur-md border border-white/15 shadow-lg transition-all hover:scale-[1.02] cursor-pointer self-start lg:self-center"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>الدخول للإدارة المركزية للمجموعة (All Companies)</span>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FEATURED MASTER CARD: KAS TRADING & ETMAD SUITE */}
      {/* ========================================================================= */}
      {kasCompany && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>قطاع التجارة والمقاولات والمنافسات الحكومية (Featured Entity):</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              سحابة اعتماد + BOQ
            </span>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/50 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Details */}
              <div className="space-y-4 flex-1">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 p-2 flex items-center justify-center shadow-lg backdrop-blur-md">
                    <CompanyLogo companyId={kasCompany.id as CompanyId} size={50} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-black font-mono font-black text-xs">
                        {kasCompany.code || 'KAS'}
                      </span>
                      <span className="text-xs font-bold text-emerald-300 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                        CR: {kasCompany.crNumber || '1010567890'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-emerald-200 text-xs font-medium">
                        منظومة سحابة اعتماد كاس
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                      {kasCompany.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5 font-medium">
                      KAS Trading & Contracting • إدارة المنافسات الحكومية، الفواتير الإلكترونية ZATCA، عروض الأسعار، وكراسات الكميات
                    </p>
                  </div>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl pt-2">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
                    <span className="text-[11px] text-emerald-300 block font-medium">المنافسات الحكومية</span>
                    <span className="text-lg font-black text-white block mt-0.5">2,651 منافسة</span>
                    <span className="text-[10px] text-emerald-400/80">مسجلة بشيت كاس</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
                    <span className="text-[11px] text-emerald-300 block font-medium">المبيعات المعتمدة</span>
                    <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">106,006 ر.س</span>
                    <span className="text-[10px] text-emerald-400/80">فواتير ZATCA</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
                    <span className="text-[11px] text-emerald-300 block font-medium">فريق العمل</span>
                    <span className="text-lg font-black text-white block mt-0.5">4 أعضاء</span>
                    <span className="text-[10px] text-emerald-400/80">طاقم إدارة المنافسات</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
                    <span className="text-[11px] text-emerald-300 block font-medium">الرقم الضريبي</span>
                    <span className="text-xs font-bold text-white font-mono block mt-1.5">310245879600003</span>
                    <span className="text-[10px] text-emerald-400/80">هيئة الزكاة والضريبة</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
                <button
                  type="button"
                  onClick={() => handleChoose(kasCompany.id as CompanyId)}
                  className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>دخول سحابة اعتماد كاس</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RECRUITMENT & OPERATING ENTITIES GRID */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span>شركات الاستقدام والكيانات التشغيلية المعتمدة (Recruitment Entities):</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recruitmentCompanies.map((comp) => {
            const isCurrent = activeCompanyId === comp.id;

            return (
              <div
                key={comp.id}
                className={`relative rounded-3xl bg-white dark:bg-slate-900 border p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                  isCurrent 
                    ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10' 
                    : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center shadow-xs">
                        <CompanyLogo companyId={comp.id as CompanyId} size={42} />
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-800 text-sky-400 font-mono font-bold text-xs">
                        {comp.code}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      CR: {comp.crNumber}
                    </span>
                  </div>

                  {/* Company Titles */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {comp.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {comp.nameEn}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mt-4 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">الفروع النشطة</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{comp.branchesCount} فروع</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">إجمالي الكادر</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{comp.employeesCount} موظف</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">الطلبات السارية</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 block mt-0.5">{comp.activeOrdersCount} طلب</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">الرقم الضريبي</span>
                      <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300 block mt-0.5">{comp.taxNumber.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                {/* Choose Button */}
                <button
                  type="button"
                  onClick={() => handleChoose(comp.id as CompanyId)}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{isCurrent ? 'الشركة الحالية (مفعلة)' : 'دخول بيئة العمل'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
