import React, { useState } from 'react';
import { 
  Globe2, Building2, UploadCloud, FileText, CheckCircle2, 
  Clock, DollarSign, Search, Plus, Filter, Download, 
  Sparkles, ShieldCheck, Eye, MessageCircle, AlertCircle,
  FileSpreadsheet, ArrowUpRight, Check, X, Plane
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { KasKpiCard, KasSupplierCard } from '../components/kas/KasCards';
import { useAppStore } from '../stores/appStore';
import { exportData } from '../services/exportService';

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
  const { addNotification } = useAppStore();
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
      {/* Top Banner - Pitch Black Cinematic Header matching ActivityLog/Master Design */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Globe2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                  INTERNATIONAL AGENCY PORTAL
                </span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                  {activeAgency}
                </span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                بوابة الوكلاء والمكاتب الخارجية المعتمدة دولياً
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                رفع وتدقيق السير الذاتية بالدفعة، الفحوصات الطبية، حجوزات الطيران، ومطابقة الحسابات بالدولار ($ USD)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="button-white-pill text-xs font-bold flex items-center gap-2 shadow-lg"
              style={{ minHeight: '38px', padding: '8px 20px', backgroundColor: '#ffffff', color: '#000000', fontWeight: '700' }}
            >
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>+ رفع دفعة سير ذاتية (Batch CV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Signature KPI Cards Row matching exact design screenshot */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: White Card */}
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي السير المرفوعة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {candidates.length} سيرة
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>سجل معتمد ومدقق</span>
        </div>

        {/* Card 2: Pistachio Band Card */}
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>سير جاهزة للتفييز والحجز</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {candidates.filter(c => c.visaStatus === 'READY' || c.visaStatus === 'ISSUED').length} جاهزة
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>فحص طبي FIT معتمد</span>
        </div>

        {/* Card 3: Pitch Black Featured Card */}
        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>مستحقات معلقة بالدولار</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            ${totalUsdBalance.toLocaleString()}
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>ما يعادل {(totalUsdBalance * 3.75).toLocaleString()} ر.س</span>
        </div>

        {/* Card 4: White Card */}
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي الحوالات المحولة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            ${totalPaidUsd.toLocaleString()}
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-emerald-500 rounded-full" />
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>حساب بنكي مسوى 100%</span>
        </div>
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
            onClick={() => {
              exportData('operations', filteredCandidates.map(c => ({
                'الاسم': c.maidName,
                'رقم الجواز': c.passportNumber,
                'المهنة': c.profession,
                'الجنسية': c.nationality,
                'الفحص الطبي': c.medicalStatus,
                'حالة التأشيرة': c.visaStatus,
                'تذكرة الطيران': c.ticketStatus,
                'العمولة ($)': c.commissionUsd,
                'حالة السداد': c.paymentStatus,
                'تاريخ الرفع': c.uploadedAt,
              })), 'excel', `كشف حساب السير والمستحقات - ${activeAgency}`);
              addNotification({
                title: 'تصدير كشف الحساب',
                message: `تم تصدير كشف حساب السير والعمولات بالدولار لـ (${activeAgency}) بنجاح.`,
                type: 'success',
              });
            }}
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
              <button 
                onClick={() => {
                  const simulatedCand: AgencyCandidate = {
                    id: `cand-${Date.now()}`,
                    maidName: 'سارة ألمو ديستا (سيرة جديدة)',
                    passportNumber: `EP${Math.floor(1000000 + Math.random() * 9000000)}`,
                    nationality: 'إثيوبيا',
                    age: 25,
                    profession: 'عاملة منزلية',
                    medicalStatus: 'FIT',
                    visaStatus: 'READY',
                    ticketStatus: 'PENDING',
                    commissionUsd: 1100,
                    paymentStatus: 'UNPAID',
                    uploadedAt: new Date().toISOString().slice(0, 10),
                  };
                  setCandidates([simulatedCand, ...candidates]);
                  setShowUploadModal(false);
                  addNotification({
                    title: 'استيراد وتدقيق السير الذاتية',
                    message: `تم رفع السيرة الذاتية (${simulatedCand.maidName}) ومطابقتها فورياً مع متطلبات مساند.`,
                    type: 'success',
                  });
                }}
                className="button-primary-pill text-xs font-bold" 
                style={{ padding: '8px 22px' }}
              >
                اختيار ملفات ومطابقة السير الذاتية
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
                  addNotification({
                    title: 'استلام دفعة السير الذاتية',
                    message: 'تم استلام دفعة السير الذاتية وجاري تدقيقها ومطابقتها مع مساند بنجاح.',
                    type: 'success',
                  });
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
