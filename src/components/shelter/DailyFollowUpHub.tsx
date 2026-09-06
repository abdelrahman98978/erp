import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Clock, AlertTriangle, CheckCircle2, 
  RotateCcw, Search, Filter, Building2, Calendar, User, 
  ExternalLink, ArrowRight, ShieldCheck, ChevronDown, DollarSign
} from 'lucide-react';
import { 
  TransferCase, 
  ClientFollowUp, 
  GROUP_OFFICES, 
  GroupOfficeId,
  FollowUpAlertLevel 
} from '../../types/shelterTransferSuite';
import { shelterTransferStore } from '../../services/shelterTransferStore';

interface DailyFollowUpHubProps {
  onRefresh: () => void;
  onOpenWorkerProfile: (workerId: string) => void;
}

export const DailyFollowUpHub: React.FC<DailyFollowUpHubProps> = ({ onRefresh, onOpenWorkerProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('ALL');
  const [filterAlert, setFilterAlert] = useState<'ALL' | 'red' | 'yellow' | 'green'>('ALL');
  
  // Modals state
  const [selectedTransfer, setSelectedTransfer] = useState<TransferCase | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Form states for contact modal
  const [contactResult, setContactResult] = useState<ClientFollowUp['contactResult']>('راضي ومستمر بالتجربة');
  const [contactFeedback, setContactFeedback] = useState('');
  const [requiredActionToday, setRequiredActionToday] = useState('');
  const [nextContactDate, setNextContactDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [employeeName, setEmployeeName] = useState('سارة القحطاني');

  // Form states for approval modal
  const [govRefNo, setGovRefNo] = useState('');
  const [transferRequestDate, setTransferRequestDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Form states for return modal
  const [returnReason, setReturnReason] = useState('عدم رغبة العميل في الاستمرار');
  const [actualTrialDays, setActualTrialDays] = useState(3);
  const [deductionAmount, setDeductionAmount] = useState(450);
  const [refundAmount, setRefundAmount] = useState(4550);
  const [settlementStatus, setSettlementStatus] = useState<'تمت التسوية' | 'معلق' | 'نزاع'>('تمت التسوية');
  const [nextAction, setNextAction] = useState<'متاحة لنقل الخدمات' | 'تحت التقييم' | 'مرحلة الترحيل'>('متاحة لنقل الخدمات');

  const allTransfers = shelterTransferStore.getTransferCases();
  const activeTrials = allTransfers.filter(t => t.transferStatus === 'خرجت للعميل' || t.transferStatus === 'بانتظار نقل الخدمات');

  // Filter transfers
  const filteredTrials = activeTrials.filter(t => {
    const worker = shelterTransferStore.getWorkerById(t.workerId);
    const workerName = worker?.fullNameAr || '';
    const matchSearch = 
      workerName.includes(searchQuery) ||
      t.newClientName.includes(searchQuery) ||
      t.newClientPhone.includes(searchQuery) ||
      t.transferCode.includes(searchQuery);

    const matchOffice = selectedOffice === 'ALL' || t.executingOfficeId === selectedOffice;
    const { alertLevel } = shelterTransferStore.calculateFollowupStatus(t);
    const matchAlert = filterAlert === 'ALL' || alertLevel === filterAlert;

    return matchSearch && matchOffice && matchAlert;
  });

  // Handle logging contact
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransfer) return;

    shelterTransferStore.recordFollowUp({
      transferCaseId: selectedTransfer.id,
      contactedPerson: selectedTransfer.newClientName,
      contactChannel: 'اتصال هاتفي',
      contactResult,
      clientFeedback: contactFeedback,
      requiredActionToday,
      nextContactDate,
      actorEmployee: employeeName,
    });

    setShowContactModal(false);
    onRefresh();
  };

  // Handle client approval -> government transfer
  const handleApproveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransfer) return;

    shelterTransferStore.approveAndCompleteTransfer({
      transferCaseId: selectedTransfer.id,
      transferRequestDate,
      govRefNo,
      actorEmployee: employeeName,
    });

    setShowApprovalModal(false);
    onRefresh();
  };

  // Handle return to shelter & settlement
  const handleReturnToShelter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransfer) return;

    shelterTransferStore.returnWorkerToShelter({
      transferCaseId: selectedTransfer.id,
      returnReason,
      actualTrialDays,
      deductionAmount,
      refundAmount,
      settlementStatus,
      nextAction,
      actorEmployee: employeeName,
    });

    setShowReturnModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Strategy Summary */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-300/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black text-zinc-900 m-0">
              مركز المتابعة اليومي للعاملات الخارجات للعملاء (Daily Client Tracking Hub)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 m-0">
            تنبيهات فورية ملونة لحالات التجربة لضمان التواصل اليومي قبل انتهاء المهلة، وتوثيق قرارات النقل أو الإرجاع.
          </p>
        </div>

        {/* Priority Counts Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterAlert('red')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterAlert === 'red'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>حالات متأخرة ({activeTrials.filter(t => shelterTransferStore.calculateFollowupStatus(t).alertLevel === 'red').length})</span>
          </button>

          <button
            onClick={() => setFilterAlert('yellow')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterAlert === 'yellow'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>تنتهي قريباً ({activeTrials.filter(t => shelterTransferStore.calculateFollowupStatus(t).alertLevel === 'yellow').length})</span>
          </button>

          <button
            onClick={() => setFilterAlert('green')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterAlert === 'green'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>جارية طبيعية ({activeTrials.filter(t => shelterTransferStore.calculateFollowupStatus(t).alertLevel === 'green').length})</span>
          </button>

          {filterAlert !== 'ALL' && (
            <button
              onClick={() => setFilterAlert('ALL')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              عرض الكل
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث باسم العاملة، العميل، الجوال، كود العملية..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Office Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-zinc-500 whitespace-nowrap">المكتب المنفذ:</span>
          <select
            value={selectedOffice}
            onChange={e => setSelectedOffice(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 outline-none font-bold text-zinc-800 cursor-pointer"
          >
            <option value="ALL">جميع المكاتب الأربعة</option>
            <option value="SAF">مكتب السفير / الصفا</option>
            <option value="DAR">دار الرواد</option>
            <option value="TOP">توباز / توب تالنت</option>
            <option value="YAQ">ياقوت الشرقية</option>
          </select>
        </div>
      </div>

      {/* Table of Active Cases */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-extrabold text-zinc-500">
                <th className="p-3.5">حالة التنبيه والمهلة</th>
                <th className="p-3.5">العاملة والمكتب الأصلي</th>
                <th className="p-3.5">العميل والتواصل</th>
                <th className="p-3.5">المكتب المنفذ والقيمة</th>
                <th className="p-3.5">تاريخ التسليم والنهاية</th>
                <th className="p-3.5">آخر تواصل والمطلوب</th>
                <th className="p-3.5 text-center">الإجراءات التشغيلية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredTrials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-sm text-zinc-700 m-0">لا توجد حالات مطابقة للبحث أو الفلتر المختار</p>
                    <p className="text-xs text-zinc-400 mt-1 m-0">جميع العاملات الخارجات للعملاء متابعة ومحدثة بالكامل.</p>
                  </td>
                </tr>
              ) : (
                filteredTrials.map(transfer => {
                  const worker = shelterTransferStore.getWorkerById(transfer.workerId);
                  const followups = shelterTransferStore.getClientFollowUps(transfer.id);
                  const latestFollowup = followups[0];
                  const { remainingDays, alertLevel, statusLabel, isOverdue } = shelterTransferStore.calculateFollowupStatus(transfer);
                  const origOffice = GROUP_OFFICES[transfer.originalOfficeId];
                  const execOffice = GROUP_OFFICES[transfer.executingOfficeId];

                  return (
                    <tr 
                      key={transfer.id}
                      className={`hover:bg-amber-50/20 transition-colors ${
                        alertLevel === 'red' ? 'bg-rose-50/30' : (alertLevel === 'yellow' ? 'bg-amber-50/20' : '')
                      }`}
                    >
                      {/* Alert status & Remaining Days */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-extrabold text-[11px] w-fit shadow-2xs ${
                            alertLevel === 'red'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : (alertLevel === 'yellow'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              alertLevel === 'red' ? 'bg-rose-600 animate-ping' : (alertLevel === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500')
                            }`} />
                            <span>{statusLabel}</span>
                          </span>

                          <span className="text-[10px] text-zinc-400">
                            {transfer.transferStatus === 'بانتظار نقل الخدمات'
                              ? '⚡ موافقة العميل (طلب مساند)'
                              : `تجربة ${transfer.followupDaysDuration} أيام`}
                          </span>
                        </div>
                      </td>

                      {/* Worker Info */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={worker?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={worker?.fullNameAr}
                            className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <button
                              onClick={() => onOpenWorkerProfile(transfer.workerId)}
                              className="font-bold text-zinc-900 hover:text-amber-700 transition-colors cursor-pointer text-right block truncate"
                            >
                              {worker?.fullNameAr}
                            </button>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-zinc-500 font-mono">{worker?.workerCode}</span>
                              <span className="text-[10px] text-zinc-400">• {worker?.nationality}</span>
                            </div>
                            <div className="mt-1">
                              <span 
                                className="px-2 py-0.2 rounded-md text-[9.5px] font-bold inline-block"
                                style={{ background: `${origOffice.primaryColor}15`, color: origOffice.primaryColor, border: `1px solid ${origOffice.primaryColor}40` }}
                                title="المكتب الأصلي للعاملة"
                              >
                                الأصلي: {origOffice.shortName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Client Info & Direct Contact */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-zinc-900">{transfer.newClientName}</span>
                          <span className="text-[10px] text-zinc-500">{transfer.newClientCity}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:${transfer.newClientPhone}`}
                              className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10.5px] font-mono flex items-center gap-1"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{transfer.newClientPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/966${transfer.newClientPhone.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-6 h-6 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center"
                              title="محادثة واتساب سريعة"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Executing Office & Price */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span 
                            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold w-fit"
                            style={{ background: `${execOffice.primaryColor}15`, color: execOffice.primaryColor, border: `1px solid ${execOffice.primaryColor}40` }}
                          >
                            المنفذ: {execOffice.shortName}
                          </span>
                          <span className="font-mono font-bold text-zinc-900">
                            {transfer.transferFee.toLocaleString()} ر.س
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            مسدد: {transfer.downPayment.toLocaleString()} ر.س
                          </span>
                        </div>
                      </td>

                      {/* Delivery Date & End Date */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span className="text-zinc-700">
                            <strong>التسليم:</strong> {transfer.deliveryDateTime ? new Date(transfer.deliveryDateTime).toLocaleDateString('ar-SA') : '—'}
                          </span>
                          <span className="text-zinc-700">
                            <strong>النهاية:</strong> {transfer.followupEndDate || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Latest Followup Note */}
                      <td className="p-3.5 max-w-[200px]">
                        {latestFollowup ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-zinc-800 text-[11px] truncate">
                              {latestFollowup.contactResult}
                            </span>
                            <span className="text-[10.5px] text-zinc-500 line-clamp-2 leading-relaxed">
                              {latestFollowup.clientFeedback}
                            </span>
                            <span className="text-[9.5px] text-zinc-400 mt-0.5">
                              المسؤول: {latestFollowup.employeeName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[10.5px] italic">لم تسجل متابعة بعد</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col gap-1.5 items-center">
                          {/* 1. Log Contact */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setShowContactModal(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Phone className="w-3.5 h-3.5 text-amber-600" />
                            <span>تسجيل متابعة</span>
                          </button>

                          {/* 2. Client Approval */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setShowApprovalModal(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>موافقة النقل</span>
                          </button>

                          {/* 3. Return to Shelter */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setShowReturnModal(true);
                            }}
                            className="w-full px-3 py-1 rounded-xl text-zinc-500 hover:text-rose-700 hover:bg-rose-50 text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-500" />
                            <span>إرجاع وتسوية</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: RECORD DAILY CONTACT & FOLLOW-UP                                  */}
      {/* ========================================================================= */}
      {showContactModal && selectedTransfer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-zinc-900 m-0">
                  تسجيل نتيجة اتصال ومتابعة مع العميل
                </h4>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  العميل: <strong>{selectedTransfer.newClientName}</strong> ({selectedTransfer.newClientPhone})
                </p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">نتيجة التواصل:</label>
                <select
                  value={contactResult}
                  onChange={e => setContactResult(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-bold"
                >
                  <option value="راضي ومستمر بالتجربة">راضي ومستمر بالتجربة</option>
                  <option value="ملاحظات تدريبية بسيطة">ملاحظات تدريبية بسيطة</option>
                  <option value="موافق تماماً على نقل الخدمات">موافق تماماً على نقل الخدمات</option>
                  <option value="يرغب بإرجاع العاملة">يرغب بإرجاع العاملة</option>
                  <option value="لم يرد / معاودة الاتصال">لم يرد / معاودة الاتصال</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">تفاصيل وملاحظات العميل بالتفصيل:</label>
                <textarea
                  rows={3}
                  value={contactFeedback}
                  onChange={e => setContactFeedback(e.target.value)}
                  placeholder="سجل ما ذكره العميل خلال المكالمة بدقة..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">الإجراء المطلوب تنفيذه اليوم:</label>
                <input
                  type="text"
                  value={requiredActionToday}
                  onChange={e => setRequiredActionToday(e.target.value)}
                  placeholder="مثال: متابعة حسم القرار قبل الغد، أو توفير رقم الحساب..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">موعد الاتصال القادم:</label>
                  <input
                    type="date"
                    value={nextContactDate}
                    onChange={e => setNextContactDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">الموظف المسؤول:</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={e => setEmployeeName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black shadow-md"
                >
                  حفظ نتيجة المتابعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: APPROVE SPONSORSHIP TRANSFER                                     */}
      {/* ========================================================================= */}
      {showApprovalModal && selectedTransfer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-emerald-800 m-0">
                  توثيق موافقة العميل ونقل الخدمات
                </h4>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  تحويل الحالة إلى "بانتظار نقل الخدمات" عبر منصة مساند
                </p>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApproveTransfer} className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                <p className="font-bold m-0">العميل: {selectedTransfer.newClientName}</p>
                <p className="m-0 text-[11px] mt-1">
                  إجمالي قيمة نقل الخدمات: <strong>{selectedTransfer.transferFee.toLocaleString()} ر.س</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">رقم طلب مساند / المرجع الحكومي:</label>
                <input
                  type="text"
                  value={govRefNo}
                  onChange={e => setGovRefNo(e.target.value)}
                  placeholder="مثال: MUS-TRF-2026-9901"
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-mono outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">تاريخ تقديم الطلب:</label>
                <input
                  type="date"
                  value={transferRequestDate}
                  onChange={e => setTransferRequestDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد اعتماد النقل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RETURN WORKER TO SHELTER & SETTLEMENT                           */}
      {/* ========================================================================= */}
      {showReturnModal && selectedTransfer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-rose-700 m-0">
                  إرجاع العاملة للسكن والتسوية المالية مع العميل
                </h4>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  توثيق العودة للسكن المشترك، التسوية المالية، وزيادة عداد تجارب العاملة
                </p>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReturnToShelter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">سبب إرجاع العاملة:</label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  placeholder="مثال: لم تتوافق مع نظام العائلة، حساسية من الحيوانات الأليفة..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-zinc-50"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">الأيام عند العميل:</label>
                  <input
                    type="number"
                    value={actualTrialDays}
                    onChange={e => setActualTrialDays(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">مبلغ الخصم (ر.س):</label>
                  <input
                    type="number"
                    value={deductionAmount}
                    onChange={e => setDeductionAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">مبلغ الاسترداد (ر.س):</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">حالة التسوية المالية:</label>
                  <select
                    value={settlementStatus}
                    onChange={e => setSettlementStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold"
                  >
                    <option value="تمت التسوية">تمت التسوية وتحويل المبلغ</option>
                    <option value="معلق">معلق بانتظار تحويل الحسابات</option>
                    <option value="نزاع">يوجد نزاع مالي قائم</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">حالة العاملة بعد الإرجاع:</label>
                  <select
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold text-amber-900"
                  >
                    <option value="متاحة لنقل الخدمات">متاحة للنقل فوراً (إعادة عرض)</option>
                    <option value="تحت التقييم">تحت التقييم بالسكن</option>
                    <option value="مرحلة الترحيل">مرحلة الترحيل والسفر</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px]">
                💡 <strong>ملاحظة برمجية:</strong> سيتم حفظ كافة تفاصيل تجربة العميل <strong>{selectedTransfer.newClientName}</strong> في سجل العاملة ولن تحذف، كما سيزيد عداد تجارب العاملة تلقائياً.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تأكيد الإرجاع للسكن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyFollowUpHub;
