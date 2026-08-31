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
              className="button-aloe-pill text-xs font-bold flex items-center gap-2 shadow-lg"
              style={{ minHeight: '38px', padding: '8px 20px' }}
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم العاملة أو رقم الجواز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            className="button-outline-on-light text-xs font-bold flex items-center gap-1.5"
            style={{ minHeight: '36px', padding: '6px 18px' }}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير كشف الحساب ($)</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="table-card bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="p-4">المرشح / العاملة</th>
                <th className="p-4">رقم الجواز</th>
                <th className="p-4">المهنة والجنسية</th>
                <th className="p-4">الفحص الطبي</th>
                <th className="p-4">حالة التأشيرة</th>
                <th className="p-4">تذكرة الطيران</th>
                <th className="p-4">العمولة ($ USD)</th>
                <th className="p-4">حالة السداد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {cand.maidName}
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {cand.passportNumber}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {cand.profession} ({cand.nationality})
                  </td>
                  <td className="p-4">
                    <span className={cand.medicalStatus === 'FIT' ? 'pill-tag-mint text-xs' : 'pill-tag-shade text-xs'}>
                      {cand.medicalStatus === 'FIT' ? '✓ لائق طبياً' : '⏳ قيد الفحص'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="pill-tag-mint text-xs font-bold">
                      {cand.visaStatus === 'ISSUED' ? '✓ صادرة' : cand.visaStatus === 'READY' ? 'جاهز للتفييز' : 'قيد المعالجة'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cand.ticketStatus === 'BOOKED' ? 'pill-tag-mint text-xs' : 'pill-tag-shade text-xs'}>
                      {cand.ticketStatus === 'BOOKED' ? '✈️ مؤكد الحجز' : 'بانتظار الحجز'}
                    </span>
                  </td>
                  <td className="p-4 font-bold font-mono text-slate-900 dark:text-white text-sm">
                    ${cand.commissionUsd.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={cand.paymentStatus === 'PAID' ? 'pill-tag-mint text-xs' : 'pill-tag-shade text-xs'}>
                      {cand.paymentStatus === 'PAID' ? '✓ مسدد' : 'مستحق'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Batch CV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="card-pricing bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  رفع دفعة سير ذاتية جديدة (Batch Upload)
                </h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 text-center space-y-3 bg-zinc-50/50 dark:bg-zinc-800/20">
              <UploadCloud className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  اسحب وأفلت ملف إكسيل السير أو ملفات الـ PDF هنا
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  يدعم ملفات .xlsx, .csv, وصور الجوازات والفحوصات الطبية
                </p>
              </div>
              <button className="button-primary-pill text-xs font-bold" style={{ padding: '8px 22px' }}>
                اختيار ملفات من الجهاز
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="button-outline-on-light text-xs font-bold"
                style={{ padding: '8px 20px' }}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  alert('تم استلام دفعة السير الذاتية وجاري تدقيقها ومطابقتها مع مساند!');
                }}
                className="button-primary-pill text-xs font-bold"
                style={{ padding: '8px 22px' }}
              >
                بدء الرفع والتدقيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
