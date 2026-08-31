import React, { useState } from 'react';
import { 
  Globe2, Building2, UploadCloud, FileText, CheckCircle2, 
  Clock, DollarSign, Search, Plus, Filter, Download, 
  Sparkles, ShieldCheck, Eye, MessageCircle, AlertCircle,
  FileSpreadsheet, ArrowUpRight, Check, X, Plane
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { KasKpiCard, KasSupplierCard } from '../components/kas/KasCards';

interface AgencyCandidate {
  id: string;
  maidName: string;
  passportNumber: string;
  nationality: string;
  age: number;
  profession: string;
  medicalStatus: 'FIT' | 'PENDING' | 'UNFIT';
  visaStatus: 'ISSUED' | 'APPLIED' | 'READY';
  ticketStatus: 'BOOKED' | 'PENDING';
  commissionUsd: number;
  paymentStatus: 'PAID' | 'UNPAID';
  uploadedAt: string;
}

export const ForeignAgencyPortalPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [activeAgency, setActiveAgency] = useState('DAMAS ETHIOPIA');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [candidates, setCandidates] = useState<AgencyCandidate[]>([
    {
      id: 'cand-1',
      maidName: 'مريم أديس تيجيست',
      passportNumber: 'EP8894120',
      nationality: 'إثيوبيا',
      age: 26,
      profession: 'عاملة منزلية',
      medicalStatus: 'FIT',
      visaStatus: 'ISSUED',
      ticketStatus: 'BOOKED',
      commissionUsd: 1100,
      paymentStatus: 'PAID',
      uploadedAt: '2026-08-10',
    },
    {
      id: 'cand-2',
      maidName: 'حليمة كيبيدي',
      passportNumber: 'EP9920140',
      nationality: 'إثيوبيا',
      age: 24,
      profession: 'عاملة منزلية',
      medicalStatus: 'FIT',
      visaStatus: 'READY',
      ticketStatus: 'PENDING',
      commissionUsd: 1100,
      paymentStatus: 'UNPAID',
      uploadedAt: '2026-08-22',
    },
    {
      id: 'cand-3',
      maidName: 'فاطمة محمد نور',
      passportNumber: 'EP7731209',
      nationality: 'إثيوبيا',
      age: 29,
      profession: 'طباخة منزلية',
      medicalStatus: 'PENDING',
      visaStatus: 'APPLIED',
      ticketStatus: 'PENDING',
      commissionUsd: 1200,
      paymentStatus: 'UNPAID',
      uploadedAt: '2026-08-28',
    },
  ]);

  const totalUsdBalance = candidates.reduce((sum, c) => c.paymentStatus === 'UNPAID' ? sum + c.commissionUsd : sum, 0);
  const totalPaidUsd = candidates.reduce((sum, c) => c.paymentStatus === 'PAID' ? sum + c.commissionUsd : sum, 0);

  const filteredCandidates = candidates.filter(c => 
    c.maidName.includes(searchQuery) ||
    c.passportNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cinematic Header */}
      <div className="card-feature-cinematic bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3 backdrop-blur-md">
              <Globe2 className="w-3.5 h-3.5" />
              <span>بوابة الوكلاء والمكاتب الخارجية المعتمدة دولياً</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              بوابة الوكيل الدولي: {activeAgency}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              رفع وتدقيق السير الذاتية بالدفعة، الفحوصات الطبية، حجوزات الطيران، ومطابقة الحسابات بالدولار ($ USD)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ رفع دفعة سير ذاتية (Batch CV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KasKpiCard
          title="إجمالي السير المرفوعة"
          value={candidates.length}
          subtitle="سجل معتمد ومدقق"
          icon={FileText}
          trend={{ value: '+3 سير جديدة هذا الأسبوع', isPositive: true }}
          variant="emerald"
        />
        <KasKpiCard
          title="سير جاهزة للتفييز والحجز"
          value={candidates.filter(c => c.visaStatus === 'READY' || c.visaStatus === 'ISSUED').length}
          subtitle="فحص طبي FIT معتمد"
          icon={CheckCircle2}
          trend={{ value: 'مطابق لاشتراطات مساند', isPositive: true }}
          variant="sky"
        />
        <KasKpiCard
          title="مستحقات معلقة بالدولار"
          value={`$${totalUsdBalance.toLocaleString()}`}
          subtitle={`ما يعادل ${(totalUsdBalance * 3.75).toLocaleString()} ر.س`}
          icon={DollarSign}
          trend={{ value: 'بانتظار وصول الرحلة والتسليم', isPositive: false }}
          variant="gold"
        />
        <KasKpiCard
          title="إجمالي الحوالات المحولة"
          value={`$${totalPaidUsd.toLocaleString()}`}
          subtitle="حوالات بنكية دولية Swift"
          icon={ShieldCheck}
          trend={{ value: 'حساب بنكي مسوى 100%', isPositive: true }}
          variant="purple"
        />
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم العاملة أو رقم الجواز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير كشف الحساب ($)</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">المرشح / العاملة</th>
                <th className="p-3.5">رقم الجواز</th>
                <th className="p-3.5">المهنة والجنسية</th>
                <th className="p-3.5">الفحص الطبي</th>
                <th className="p-3.5">حالة التأشيرة</th>
                <th className="p-3.5">تذكرة الطيران</th>
                <th className="p-3.5">العمولة ($ USD)</th>
                <th className="p-3.5">حالة السداد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {cand.maidName}
                  </td>
                  <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {cand.passportNumber}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {cand.profession} ({cand.nationality})
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cand.medicalStatus === 'FIT' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {cand.medicalStatus === 'FIT' ? '✓ لائق طبياً' : '⏳ قيد الفحص'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 text-[11px] font-bold">
                      {cand.visaStatus === 'ISSUED' ? '✓ صادرة' : cand.visaStatus === 'READY' ? 'جاهز للتفييز' : 'قيد المعالجة'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cand.ticketStatus === 'BOOKED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {cand.ticketStatus === 'BOOKED' ? '✈️ مؤكد الحجز' : 'بانتظار الحجز'}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-white">
                    ${cand.commissionUsd.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cand.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                      {cand.paymentStatus === 'PAID' ? '✓ مسدد' : 'مستحق'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
