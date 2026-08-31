import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, ShieldCheck, Download, 
  Search, Eye, MessageCircle, AlertCircle, Sparkles, 
  Building2, Phone, Calendar, ArrowRight, UserCheck, Check,
  CreditCard, Landmark, Plane, User, Lock, Award
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { KasKpiCard } from '../components/kas/KasCards';

interface ClientContract {
  id: string;
  contractNumber: string;
  workerName: string;
  profession: string;
  nationality: string;
  passportNumber: string;
  status: 'تم التوثيق بمساند' | 'تفويض إنجاز' | 'فحص السفارة' | 'تم إصدار التأشيرة' | 'حجز الطيران' | 'وصلت المملكة' | 'مكتمل ومسلم';
  progressPct: number;
  startDate: string;
  expectedArrival: string;
  amount: number;
  paidAmount: number;
  guaranteeDaysLeft: number;
  agencyName: string;
  flightDetails?: string;
}

export const ClientPortalPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [nationalIdOrPhone, setNationalIdOrPhone] = useState('');
  const [authenticated, setAuthenticated] = useState(true); // Demo mode active
  const [selectedContract, setSelectedContract] = useState<ClientContract | null>(null);

  const [contracts] = useState<ClientContract[]>([
    {
      id: 'c-101',
      contractNumber: 'MSN-2026-8941',
      workerName: 'مريم أديس تيجيست',
      profession: 'عاملة منزلية',
      nationality: 'إثيوبيا',
      passportNumber: 'EP8894120',
      status: 'حجز الطيران',
      progressPct: 85,
      startDate: '2026-07-15',
      expectedArrival: '2026-09-05',
      amount: 14500,
      paidAmount: 14500,
      guaranteeDaysLeft: 90,
      agencyName: 'وكالة دماس الدولية (DAMAS ETH)',
      flightDetails: 'الخطوط السعودية SV-840 - الوصول: مطار الملك خالد الدولي بالرياض',
    },
    {
      id: 'c-102',
      contractNumber: 'MSN-2026-7730',
      workerName: 'جويسانتي فلوريس',
      profession: 'عاملة منزلية ورعاية كبار سن',
      nationality: 'الفلبين',
      passportNumber: 'P9920145',
      status: 'مكتمل ومسلم',
      progressPct: 100,
      startDate: '2026-05-10',
      expectedArrival: '2026-07-20',
      amount: 18500,
      paidAmount: 18500,
      guaranteeDaysLeft: 48,
      agencyName: 'بلاتينيوم مانيلا (PLATINUM PH)',
      flightDetails: 'تم الوصول والتسليم بنجاح',
    },
  ]);

  const activeContracts = contracts.filter(c => c.status !== 'مكتمل ومسلم');
  const completedContracts = contracts.filter(c => c.status === 'مكتمل ومسلم');

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="card-feature-cinematic bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بوابة الخدمة الذاتية وتتبع العقود للعملاء</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              بوابة عملاء {activeCompany.name}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              متابعة مباشرة ومؤتمتة لخطوات الاستقدام، توثيق مساند، بوالص التأمين، وخدمة العملاء على مدار الساعة
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>خدمة العملاء (واتساب)</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KasKpiCard
          title="العقود النشطة تحت التنفيذ"
          value={activeContracts.length}
          subtitle="متابعة عبر منصة مساند"
          icon={FileText}
          trend={{ value: '+1 عقد جديد هذا الشهر', isPositive: true }}
          variant="emerald"
        />
        <KasKpiCard
          title="العقود المنجزة والمسلمة"
          value={completedContracts.length}
          subtitle="تحت فترة الضمان النظامي"
          icon={CheckCircle2}
          trend={{ value: '100% نسبة رضا العملاء', isPositive: true }}
          variant="sky"
        />
        <KasKpiCard
          title="إجمالي المدفوعات الموثقة"
          value="33,000 ر.س"
          subtitle="سداد عبر مساند وحساب الأمانات"
          icon={CreditCard}
          trend={{ value: 'فواتير ZATCA معتمدة', isPositive: true }}
          variant="gold"
        />
        <KasKpiCard
          title="سريان الضمان والحماية"
          value="90 يوماً"
          subtitle="ضمان شامل وإعادة استقدام"
          icon={ShieldCheck}
          trend={{ value: 'متوافق مع وزارة الموارد', isPositive: true }}
          variant="purple"
        />
      </div>

      {/* Contract Lifecycle Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-emerald-600" />
            <span>العقود السارية ومراحل الوصول الحية</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">محدث لحظياً عبر مساند</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contracts.map((contract) => (
            <div 
              key={contract.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                    {contract.nationality === 'إثيوبيا' ? '🇪🇹' : '🇵🇭'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {contract.workerName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>رقم العقد: <strong className="text-slate-800 dark:text-slate-200">{contract.contractNumber}</strong></span>
                      <span>•</span>
                      <span>{contract.profession}</span>
                      <span>•</span>
                      <span>{contract.nationality}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    contract.status === 'مكتمل ومسلم' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                  }`}>
                    {contract.status}
                  </span>
                  <button 
                    onClick={() => setSelectedContract(contract)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>تفاصيل العقد</span>
                  </button>
                </div>
              </div>

              {/* 8-Stage Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>نسبة الإنجاز: {contract.progressPct}%</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    الوصول المتوقع: {contract.expectedArrival}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                    style={{ width: `${contract.progressPct}%` }}
                  />
                </div>
                
                {contract.flightDetails && (
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>بيانات الرحلة:</strong> {contract.flightDetails}</span>
                  </div>
                )}
              </div>

              {/* Bottom Metadata & Guarantee */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400 block text-[11px]">قيمة العقد الإجمالية</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{contract.amount.toLocaleString()} ر.س</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">المبلغ المسدد</span>
                  <strong className="text-emerald-600 font-bold">{contract.paidAmount.toLocaleString()} ر.س</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الوكيل الخارجي</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-medium">{contract.agencyName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">فترة الضمان المتبقية</span>
                  <strong className="text-purple-600 font-bold">{contract.guaranteeDaysLeft} يوماً</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  سجل العقد المعتمد #{selectedContract.contractNumber}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedContract(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم العامل/ة:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedContract.workerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم جواز السفر:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedContract.passportNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المهنة والجنسية:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedContract.profession} - {selectedContract.nationality}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl space-y-1.5 border border-emerald-200/50 dark:border-emerald-800/40">
                <div className="flex justify-between">
                  <span className="text-emerald-800 dark:text-emerald-300">حالة العقد عبر مساند:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedContract.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-800 dark:text-emerald-300">فترة الضمان النظامي:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedContract.guaranteeDaysLeft} يوماً (سارية)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
