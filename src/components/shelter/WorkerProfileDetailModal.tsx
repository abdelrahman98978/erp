import React, { useState } from 'react';
import { 
  WorkerProfile, 
  WorkerMovementTimeline, 
  TransferCase, 
  WorkerFirstSponsor,
  GROUP_COMPANIES 
} from '../../types/shelterTransferSuite';
import { shelterTransferStore } from '../../services/shelterTransferStore';
import { 
  X, 
  Printer, 
  User, 
  FileText, 
  Briefcase, 
  History, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  DollarSign, 
  Sparkles,
  MapPin,
  IdCard,
  Languages,
  Award
} from 'lucide-react';

interface WorkerProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerProfile | null;
  onBookTransfer?: (worker: WorkerProfile) => void;
}

export const WorkerProfileDetailModal: React.FC<WorkerProfileDetailModalProps> = ({
  isOpen,
  onClose,
  worker,
  onBookTransfer,
}) => {
  if (!isOpen || !worker) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'sponsor' | 'timeline' | 'trials'>('info');

  const state = shelterTransferStore.getState();
  const firstSponsor = state.firstSponsors.find((s: WorkerFirstSponsor) => s.workerId === worker.id);
  const movementTimeline = shelterTransferStore.getWorkerTimeline(worker.id);
  const transferTrials = state.transferCases.filter((t: TransferCase) => t.workerId === worker.id);

  const originalOffice = GROUP_COMPANIES.find(c => c.id === worker.originalOfficeId);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col"
        dir="rtl"
      >
        {/* Header with Photo and Quick Badges */}
        <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute left-6 top-6 p-2 rounded-xl bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-5 flex-wrap">
            {/* Worker Photo */}
            <div className="relative">
              {worker.photoUrl ? (
                <img 
                  src={worker.photoUrl} 
                  alt={worker.fullNameAr} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-zinc-700 text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-amber-400/50 shadow-lg">
                  {(worker.fullNameAr || 'ع').slice(0, 2)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight font-display text-white">
                  {worker.fullNameAr}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {worker.operationalStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans dir-ltr text-right">
                {worker.fullNameEn}
              </p>

              <div className="flex items-center gap-3 mt-3 text-xs text-zinc-300 flex-wrap">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                  الجنسية: <strong className="text-white">{worker.nationality}</strong>
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                  جواز: <strong className="text-white font-mono">{worker.passportNumber}</strong>
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-lg font-bold">
                  المكتب الأصلي: {originalOffice?.name || worker.originalOfficeId}
                </span>
                <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-bold">
                  تجارب العملاء السابقة: {worker.clientTrialsCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-200 bg-zinc-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>الملف الشامل والمهارات</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsor')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sponsor'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>بيانات الكفيل الأول {firstSponsor ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>المخطط الزمني للحركات ({movementTimeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('trials')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'trials'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>سجل تجارب العملاء ({transferTrials.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: General Info & Skills */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  <div className="text-[11px] text-zinc-400 font-bold">الراتب الشهري</div>
                  <div className="text-base font-black text-zinc-900 mt-1">
                    {worker.requestedSalary?.toLocaleString('ar-SA')} ر.س
                  </div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  <div className="text-[11px] text-zinc-400 font-bold">العمر / الميلاد</div>
                  <div className="text-base font-black text-zinc-900 mt-1">
                    {worker.age ? `${worker.age} سنة` : 'غير محدد'}
                  </div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  <div className="text-[11px] text-zinc-400 font-bold">الديانة</div>
                  <div className="text-base font-black text-zinc-900 mt-1">
                    {worker.religion || 'غير محدد'}
                  </div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  <div className="text-[11px] text-zinc-400 font-bold">رقم الإقامة (إن وجد)</div>
                  <div className="text-base font-black text-zinc-900 mt-1 font-mono">
                    {worker.iqamaNumber || 'لا توجد إقامة بعد'}
                  </div>
                </div>
              </div>

              {/* Skills and Languages */}
              <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>المهارات والخبرات الموثقة:</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-200 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400">لا توجد مهارات مسجلة</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200">
                  <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2 mb-2">
                    <Languages className="w-4 h-4 text-indigo-600" />
                    <span>اللغات التي تجيدها:</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.languages && worker.languages.length > 0 ? (
                      worker.languages.map((lang, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-indigo-800 border border-indigo-200 shadow-sm"
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400">العربية (أساسي)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal & Medical Status */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">الحالة النظامية والطبية: </span>
                  <span>العاملة مفحوصة طبياً، سليمة ولائقة صحياً، وجاهزة للتسليم المباشر لفترة التجربة ونقل الكفالة عبر منصة مساند فور اعتماد العميل.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: First Sponsor Section (الكفيل الأول) */}
          {activeTab === 'sponsor' && (
            <div className="space-y-4">
              {firstSponsor ? (
                <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-black text-zinc-900">
                        سجل بيانات الكفيل الأول (المستقدم السابق)
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {firstSponsor.warrantyStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block font-bold">اسم الكفيل الأول:</span>
                      <span className="text-zinc-900 font-extrabold text-sm">{firstSponsor.sponsorName}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-bold">رقم الهوية الوطنية:</span>
                      <span className="text-zinc-900 font-mono font-bold">{firstSponsor.nationalIdOrIqama || 'غير متوفر'}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-bold">رقم الجوال:</span>
                      <span className="text-zinc-900 font-mono font-bold">{firstSponsor.phoneNumber || 'غير متوفر'}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-bold">رقم عقد الاستقدام الأصلي:</span>
                      <span className="text-zinc-900 font-mono font-bold">{firstSponsor.contractRefNo || 'RC-2026-PREV'}</span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-bold">المطالبة المالية للكفيل:</span>
                      <span className="text-emerald-700 font-extrabold text-sm">
                        {firstSponsor.financialClaimAmount ? `${firstSponsor.financialClaimAmount.toLocaleString('ar-SA')} ر.س` : 'لا توجد'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-400 block font-bold">حالة التسوية المالية:</span>
                      <span className="font-bold text-zinc-800">{firstSponsor.settlementStatus}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs mt-3">
                    <span className="text-zinc-400 font-bold block mb-1">سبب التنازل / ملاحظات الكفيل الأول:</span>
                    <p className="text-zinc-800 leading-relaxed font-medium">
                      {firstSponsor.returnReason || 'تنازل ودي لعدم الحاجة أو عدم التوافق مع طبيعة الأعمال المنزلية.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-700">لا توجد بيانات كفيل أول مسجلة</h4>
                  <p className="text-xs text-zinc-400 mt-1">العاملة قد تكون استقدام جديد لم تستلم من قبل أي كفيل سابق.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Movement History Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>سجل المخطط الزمني الكامل للحركات والعمليات:</span>
              </h3>

              {movementTimeline.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-2xl text-xs text-zinc-400">
                  لا توجد حركات موثقة بعد
                </div>
              ) : (
                <div className="relative pr-6 border-r-2 border-zinc-200 space-y-6">
                  {movementTimeline.map((item, idx) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-emerald-600 group-hover:scale-125 transition-transform" />

                      <div className="bg-zinc-50 hover:bg-zinc-100/80 transition-colors p-4 rounded-2xl border border-zinc-200/90 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-extrabold text-xs text-zinc-900">
                            {item.movementType}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {new Date(item.eventDateTime).toLocaleString('ar-SA')}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-[11px] text-zinc-400 border-t border-zinc-200/60">
                          <span>الموظف المسؤول: <strong>{item.actorEmployee}</strong></span>
                          {item.fromStatus && item.toStatus && (
                            <span>
                              الحالة: <span className="line-through">{item.fromStatus}</span> ➔ <strong className="text-emerald-700">{item.toStatus}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Client Trials History */}
          {activeTab === 'trials' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>سجل تجارب العملاء ونقل الخدمات:</span>
              </h3>

              {transferTrials.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-2xl text-xs text-zinc-400">
                  لم تخض هذه العاملة أي تجارب عملاء سابقة حتى الآن (0 تجارب).
                </div>
              ) : (
                <div className="space-y-3">
                  {transferTrials.map((t: TransferCase) => {
                    const execOffice = GROUP_COMPANIES.find(c => c.id === t.executingOfficeId);
                    return (
                      <div key={t.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-zinc-900">{t.newClientName}</span>
                            <span className="font-mono text-[11px] text-zinc-500">({t.newClientPhone})</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            t.transferStatus === 'تم نقل الخدمات' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : t.transferStatus === 'عادت من العميل' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.transferStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-600">
                          <div>المكتب المنفذ: <strong className="text-zinc-900">{execOffice?.name || t.executingOfficeId}</strong></div>
                          <div>التكلفة المتفق عليها: <strong>{t.transferFee.toLocaleString('ar-SA')} ر.س</strong></div>
                          <div>مدة التجربة: <strong>{t.followupDaysDuration} أيام</strong></div>
                          <div>القرار: <strong className="text-indigo-700">{t.clientDecision}</strong></div>
                        </div>

                        {t.returnReason && (
                          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900 text-xs border border-rose-100">
                            <strong>سبب الإرجاع:</strong> {t.returnReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-zinc-500" />
            <span>طباعة السيرة الذاتية (CV)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              إغلاق
            </button>

            {worker.operationalStatus === 'متاحة لنقل الخدمات' && onBookTransfer && (
              <button
                onClick={() => {
                  onClose();
                  onBookTransfer(worker);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>بدء حجز ونقل خدمات لعميل</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
