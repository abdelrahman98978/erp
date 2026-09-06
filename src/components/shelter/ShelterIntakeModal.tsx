import React, { useState } from 'react';
import { 
  WorkerProfile, 
  GroupOfficeId, 
  GROUP_COMPANIES 
} from '../../types/shelterTransferSuite';
import { shelterTransferStore } from '../../services/shelterTransferStore';
import { notificationPopupEngine } from '../../services/notificationPopupEngine';
import { 
  X, 
  Hotel, 
  UserPlus, 
  Building2, 
  User, 
  Phone, 
  IdCard, 
  Calendar, 
  Bed, 
  FileText, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Stethoscope,
  Briefcase
} from 'lucide-react';

interface ShelterIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accommodationCaseId: string) => void;
}

export const ShelterIntakeModal: React.FC<ShelterIntakeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const state = shelterTransferStore.getState();
  const existingWorkers = state.workers;

  // Mode: existing worker check-in vs new worker registration
  const [isNewWorker, setIsNewWorker] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(existingWorkers[0]?.id || '');

  // New worker fields
  const [fullNameAr, setFullNameAr] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [originalOfficeId, setOriginalOfficeId] = useState<GroupOfficeId>('SAF');
  const [monthlySalary, setMonthlySalary] = useState<number>(1500);
  const [skillsStr, setSkillsStr] = useState('تنظيف شامل، غسيل وكوي');
  const [religion, setReligion] = useState('مسلمة');

  // Intake details
  const [shelterBranch, setShelterBranch] = useState('مقر الإيواء الرئيسي - الرياض');
  const [intakeDateTime, setIntakeDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [intakeReason, setIntakeReason] = useState<string>('تنازل كفيل أول');
  const [assignedRoom, setAssignedRoom] = useState('جناح أ - غرفة 101');
  const [assignedBed, setAssignedBed] = useState('سرير 2');
  const [workWillingness, setWorkWillingness] = useState<'ترغب بالعمل' | 'لا ترغب بالعمل' | 'مشروطة'>('ترغب بالعمل');

  // First Sponsor Dedicated Section (الكفيل الأول)
  const [hasFirstSponsor, setHasFirstSponsor] = useState(true);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorNationalId, setSponsorNationalId] = useState('');
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [originalContractRef, setOriginalContractRef] = useState('');
  const [sponsorReturnReason, setSponsorReturnReason] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState<'ساري (ضمن 90 يوم)' | 'منتهي' | 'تنازل اختياري'>('ساري (ضمن 90 يوم)');
  const [financialClaimAmount, setFinancialClaimAmount] = useState<number>(0);

  // Health and Belongings
  const [medicalCheckPassed, setMedicalCheckPassed] = useState(true);
  const [luggageInspected, setLuggageInspected] = useState(true);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let targetWorkerId = selectedWorkerId;

    // Validate new worker if needed
    if (isNewWorker) {
      if (!fullNameAr.trim()) {
        setErrorMsg('يرجى إدخال اسم العاملة بالعربية');
        return;
      }
      if (!passportNumber.trim()) {
        setErrorMsg('يرجى إدخال رقم جواز السفر');
        return;
      }

      setIsSubmitting(true);
      try {
        const newWorkerResult = await shelterTransferStore.addWorker({
          fullNameAr: fullNameAr.trim(),
          fullNameEn: fullNameEn.trim() || fullNameAr.trim(),
          passportNumber: passportNumber.trim().toUpperCase(),
          nationality,
          religion,
          requestedSalary: monthlySalary,
          skills: skillsStr.split('،').map(s => s.trim()).filter(Boolean),
          originalOfficeId,
          operationalStatus: 'داخل السكن',
          clientTrialsCount: 0,
        });

        if (!newWorkerResult.success || !newWorkerResult.worker) {
          setErrorMsg(newWorkerResult.error || 'فشل تسجيل العاملة الجديدة');
          setIsSubmitting(false);
          return;
        }

        targetWorkerId = newWorkerResult.worker.id;
      } catch (err: any) {
        setErrorMsg(err.message || 'حدث خطأ أثناء حفظ بيانات العاملة');
        setIsSubmitting(false);
        return;
      }
    }

    if (!targetWorkerId) {
      setErrorMsg('يرجى اختيار العاملة المراد تسكينها');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. If hasFirstSponsor, record first sponsor details
      if (hasFirstSponsor && sponsorName.trim()) {
        await shelterTransferStore.recordFirstSponsor({
          workerId: targetWorkerId,
          sponsorName: sponsorName.trim(),
          sponsorNationalId: sponsorNationalId.trim(),
          sponsorPhone: sponsorPhone.trim(),
          originalContractRef: originalContractRef.trim(),
          reasonForReturn: sponsorReturnReason.trim(),
          warrantyStatus,
          financialClaimAmount,
          settlementStatus: financialClaimAmount > 0 ? 'معلق' : 'تمت التسوية',
        });
      }

      // 2. Create accommodation case
      const accResult = await shelterTransferStore.createAccommodationCase({
        workerId: targetWorkerId,
        originalOfficeId: isNewWorker ? originalOfficeId : (existingWorkers.find((w: WorkerProfile) => w.id === targetWorkerId)?.originalOfficeId || 'SAF'),
        shelterBranch,
        intakeDateTime: new Date(intakeDateTime).toISOString(),
        intakeReason,
        assignedRoom,
        assignedBed,
        workWillingness,
        medicalStatus: medicalCheckPassed ? 'لائقة طبياً' : 'تحت الفحص / العزل',
        luggageReceived: luggageInspected,
        notes: notes.trim(),
      });

      if (accResult.success && accResult.accommodationCase) {
        notificationPopupEngine.show({
          title: 'تم تسجيل وتسكين النزيلة بنجاح',
          message: `تم تسكين العاملة في (${shelterBranch} - ${assignedRoom}) وفتح ملف حالة إيواء جديدة.`,
          type: 'success',
        });
        onSuccess(accResult.accommodationCase.id);
        onClose();
      } else {
        setErrorMsg(accResult.error || 'حدث خطأ أثناء فتح ملف التسكين');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 font-display">
                تسجيل دخول وتسكين نزيلة جديدة بالسكن المشترك
              </h2>
              <p className="text-xs text-zinc-500">
                توثيق حالة الدخول، بيانات الكفيل الأول (إن وجد)، وتخصيص الغرفة والسرير
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Selector */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setIsNewWorker(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isNewWorker ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              عاملة مسجلة مسبقاً بالنظام ({existingWorkers.length})
            </button>
            <button
              type="button"
              onClick={() => setIsNewWorker(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isNewWorker ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              + تسجيل ملف عاملة جديدة لأول مرة
            </button>
          </div>

          {/* Existing Worker Picker */}
          {!isNewWorker ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 block">اختر العاملة المراد إدخالها للسكن:</label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {existingWorkers.map((w: WorkerProfile) => (
                  <option key={w.id} value={w.id}>
                    {w.fullNameAr} ({w.nationality}) - جواز: {w.passportNumber} - المكتب: {w.originalOfficeId} - الحالة: [{w.operationalStatus}]
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* New Worker Registration Section */
            <div className="space-y-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>البيانات الأساسية للعاملة الجديدة:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={fullNameAr}
                    onChange={(e) => setFullNameAr(e.target.value)}
                    placeholder="مثال: مريم ديسالي غيتاتشو"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    placeholder="Maryam Desale Getachew"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-left"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">رقم جواز السفر *</label>
                  <input
                    type="text"
                    required
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="EP1234567"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">الجنسية *</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200 focus:outline-none"
                  >
                    <option value="الفلبين">الفلبين</option>
                    <option value="إندونيسيا">إندونيسيا</option>
                    <option value="إثيوبيا">إثيوبيا</option>
                    <option value="أوغندا">أوغندا</option>
                    <option value="كينيا">كينيا</option>
                    <option value="سيريلانكا">سيريلانكا</option>
                    <option value="بنجلاديش">بنجلاديش</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">مكتب الاستقدام الأصلي التابعة له *</label>
                  <select
                    value={originalOfficeId}
                    onChange={(e) => setOriginalOfficeId(e.target.value as GroupOfficeId)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white border border-zinc-200 focus:outline-none"
                  >
                    {GROUP_COMPANIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">الراتب الشهري المطلوب (ر.س)</label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">المهارات والخبرات (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="طبخ، رعاية أطفال، تنظيف، غسيل"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200"
                />
              </div>
            </div>
          )}

          {/* Intake Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-zinc-800 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Hotel className="w-4 h-4 text-emerald-600" />
              <span>تفاصيل الدخول وتخصيص السكن:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">مقر الإيواء *</label>
                <select
                  value={shelterBranch}
                  onChange={(e) => setShelterBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-50 border border-zinc-200"
                >
                  <option value="مقر الإيواء الرئيسي - الرياض">مقر الإيواء الرئيسي - الرياض</option>
                  <option value="مقر الإيواء - جدة">مقر الإيواء - جدة</option>
                  <option value="مقر الإيواء - الخبر">مقر الإيواء - الخبر</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">تاريخ ووقت الدخول *</label>
                <input
                  type="datetime-local"
                  required
                  value={intakeDateTime}
                  onChange={(e) => setIntakeDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">سبب دخول السكن *</label>
                <select
                  value={intakeReason}
                  onChange={(e) => setIntakeReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-50 border border-zinc-200"
                >
                  <option value="تنازل كفيل أول">تنازل كفيل أول</option>
                  <option value="استقدام جديد (لم يستلم الكفيل)">استقدام جديد (لم يستلم الكفيل)</option>
                  <option value="إرجاع من تجربة نقل خدمات">إرجاع من تجربة نقل خدمات</option>
                  <option value="نقل من مقر إيواء فرعي">نقل من مقر إيواء فرعي</option>
                  <option value="انتهاء عقد وطلب ترحيل">انتهاء عقد وطلب ترحيل</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">الغرفة / الجناح</label>
                <input
                  type="text"
                  value={assignedRoom}
                  onChange={(e) => setAssignedRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">رقم السرير</label>
                <input
                  type="text"
                  value={assignedBed}
                  onChange={(e) => setAssignedBed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">الرغبة بالعمل</label>
                <select
                  value={workWillingness}
                  onChange={(e) => setWorkWillingness(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-50 border border-zinc-200"
                >
                  <option value="ترغب بالعمل">ترغب بالعمل (جاهزة للنقل)</option>
                  <option value="مشروطة">ترغب بشروط معينة</option>
                  <option value="لا ترغب بالعمل">لا ترغب بالعمل (ترحيل)</option>
                </select>
              </div>
            </div>
          </div>

          {/* DEDICATED FIRST SPONSOR SECTION (Crucial BRD Requirement) */}
          <div className="space-y-3 p-4 rounded-3xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-blue-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>قسم بيانات الكفيل الأول (المتنازل أو المستقدم الأصلي):</span>
              </h3>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-blue-800">
                <input
                  type="checkbox"
                  checked={hasFirstSponsor}
                  onChange={(e) => setHasFirstSponsor(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>تضمين بيانات الكفيل الأول</span>
              </label>
            </div>

            {hasFirstSponsor && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">اسم الكفيل الأول</label>
                    <input
                      type="text"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      placeholder="اسم صاحب العمل السابق"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">هوية الكفيل الأول</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={sponsorNationalId}
                      onChange={(e) => setSponsorNationalId(e.target.value)}
                      placeholder="10XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">جوال الكفيل الأول</label>
                    <input
                      type="tel"
                      value={sponsorPhone}
                      onChange={(e) => setSponsorPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200 font-mono text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">رقم عقد الاستقدام الأصلي</label>
                    <input
                      type="text"
                      value={originalContractRef}
                      onChange={(e) => setOriginalContractRef(e.target.value)}
                      placeholder="RC-2026-XXXX"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">سريان الضمان</label>
                    <select
                      value={warrantyStatus}
                      onChange={(e) => setWarrantyStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white border border-blue-200"
                    >
                      <option value="ساري (ضمن 90 يوم)">ساري (ضمن فترة ضمان 90 يوم)</option>
                      <option value="منتهي">منتهي الضمان</option>
                      <option value="تنازل اختياري">تنازل اختياري بعد انتهاء الضمان</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">المطالبة المالية للكفيل (ر.س)</label>
                    <input
                      type="number"
                      value={financialClaimAmount}
                      onChange={(e) => setFinancialClaimAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">سبب الإرجاع / التنازل حسب إفادة الكفيل</label>
                  <textarea
                    rows={2}
                    value={sponsorReturnReason}
                    onChange={(e) => setSponsorReturnReason(e.target.value)}
                    placeholder="عدم التوافق مع متطلبات المنزل، رفض الطبخ، رغبة العاملة في العمل لدى عائلة صغيرة، إلخ..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-blue-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Checklist Checks */}
          <div className="flex items-center gap-6 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
              <input
                type="checkbox"
                checked={medicalCheckPassed}
                onChange={(e) => setMedicalCheckPassed(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>تم الفحص الطبي الأولي (لائقة)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
              <input
                type="checkbox"
                checked={luggageInspected}
                onChange={(e) => setLuggageInspected(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>تم استلام وتفتيش الأمتعة</span>
            </label>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">ملاحظات عامة</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل خاصة بالحالة الصحية أو النفسية أو التسكين..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التسكين والحفظ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد التسكين وفتح ملف الإيواء</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
