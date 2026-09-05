import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { realErpDataStore } from '../services/realErpDataStore';
import { useShelterRecords, useTableMutation } from '../hooks/queries/useErpQueries';
import {
  ShelterNavigationSidebar,
  ShelterDepartmentId,
  ShelterSidebarStats,
  SHELTER_BRANCHES
} from '../components/shelter/ShelterNavigationSidebar';
import {
  Hotel,
  Plus,
  Search,
  Bed,
  Utensils,
  Stethoscope,
  HeartHandshake,
  PlaneTakeoff,
  MapPin,
  FileCheck2,
  Building2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Users,
  Calendar,
  X,
  Printer,
  ChevronLeft,
  Flame,
  Thermometer,
  Activity,
  HeartPulse,
  LogOut,
  Sparkles,
  RefreshCw,
  FolderTree,
  FileSpreadsheet
} from 'lucide-react';
import { ShelterRecordItem, ShelterRoom, ShelterCateringMeal } from './ShelterPage';

export interface ShelterMedicalCheck {
  id: string;
  inmate_name: string;
  passport: string;
  date: string;
  check_type: 'فحص وصول أولي' | 'متابعة دورية' | 'عزل صحي' | 'كشف طارئ';
  temperature: string;
  blood_pressure: string;
  result: 'سليم ولائق صحياً' | 'يحتاج راحة وأدوية' | 'عزل صحي مؤقت' | 'محال لمستشفى';
  isolation_wing?: string;
  notes: string;
  nurse_doctor: string;
}

const DEFAULT_MEDICAL_CHECKS: ShelterMedicalCheck[] = [
  {
    id: 'MED-01',
    inmate_name: 'سارة أديسي (Sara Ethiopian)',
    passport: 'EP9827341',
    date: '2026-08-30',
    check_type: 'فحص وصول أولي',
    temperature: '36.8°C',
    blood_pressure: '118/76',
    result: 'سليم ولائق صحياً',
    notes: 'تم فحص العلامات الحيوية وفحص الحمل والأمراض السارية - النتيجة سليمة.',
    nurse_doctor: 'د. منيرة العتيبي'
  },
  {
    id: 'MED-02',
    inmate_name: 'ماري جين سانتوس (Mary Jane Santos)',
    passport: 'PH8849201',
    date: '2026-08-31',
    check_type: 'متابعة دورية',
    temperature: '37.0°C',
    blood_pressure: '120/80',
    result: 'سليم ولائق صحياً',
    notes: 'متابعة صحية روتينية، لا توجد شكاوى صحية.',
    nurse_doctor: 'د. منيرة العتيبي'
  },
  {
    id: 'MED-03',
    inmate_name: 'فلورنس ناباتانزي (Florence Nabatanzi)',
    passport: 'UG1102938',
    date: '2026-08-28',
    check_type: 'عزل صحي',
    temperature: '38.2°C',
    blood_pressure: '125/82',
    result: 'عزل صحي مؤقت',
    isolation_wing: 'جناح ج - غرفة العزل 301',
    notes: 'ارتفاع في درجة الحرارة وإجهاد سفر، تم تسكينها بغرفة العزل المؤقت وصرف مخفضات حرارة.',
    nurse_doctor: 'د. منيرة العتيبي'
  }
];

export const ShelterSuitePortalPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { setActiveTab: setGlobalActiveTab, addNotification } = useAppStore();
  const { data: rawShelter = [], isLoading } = useShelterRecords();
  const { createItem, updateItem, deleteItem } = useTableMutation('shelter_records');

  const [activeDepartment, setActiveDepartment] = useState<ShelterDepartmentId>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Rooms, Catering, and Medical checks
  const [rooms, setRooms] = useState<ShelterRoom[]>([]);
  const [cateringMeals, setCateringMeals] = useState<ShelterCateringMeal[]>([]);
  const [medicalChecks, setMedicalChecks] = useState<ShelterMedicalCheck[]>([]);

  // Modals
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [selectedInmateForPrint, setSelectedInmateForPrint] = useState<ShelterRecordItem | null>(null);

  // Forms
  const [checkinForm, setCheckinForm] = useState({
    maid_name: '',
    nationality: 'الفلبين',
    passport: '',
    client_name: '',
    shelter_location: 'الرياض - المقر الرئيسي (حي الياسمين)',
    work_willingness: 'ترغب بالعمل' as 'ترغب بالعمل' | 'لا ترغب بالعمل' | 'غير محدد',
  });

  const [roomForm, setRoomForm] = useState({
    room: '',
    totalBeds: '4',
    type: 'نزيلات الفلبين',
    clean: 'تم التعقيم'
  });

  const [mealForm, setMealForm] = useState({
    place: 'الرياض - المقر الرئيسي',
    meal: 'وجبة غداء',
    count: '18',
    vendor: 'مطابخ ومطاعم السليم للإعاشة',
    cost: '360',
    sup: 'أميرة الشمري'
  });

  const [clinicForm, setClinicForm] = useState({
    inmate_name: '',
    passport: '',
    check_type: 'فحص وصول أولي' as ShelterMedicalCheck['check_type'],
    temperature: '37.0°C',
    blood_pressure: '120/80',
    result: 'سليم ولائق صحياً' as ShelterMedicalCheck['result'],
    isolation_wing: '',
    notes: 'فحص شامل للعلامات الحيوية',
    nurse_doctor: 'د. منيرة العتيبي'
  });

  // Load persistent records
  useEffect(() => {
    realErpDataStore.getRecords<ShelterRoom>('shelter_rooms', []).then(setRooms);
    realErpDataStore.getRecords<ShelterCateringMeal>('shelter_catering_logs', []).then(setCateringMeals);
    realErpDataStore.getRecords<ShelterMedicalCheck>('shelter_medical_checks', DEFAULT_MEDICAL_CHECKS).then(setMedicalChecks);
  }, []);

  const inmates: ShelterRecordItem[] = rawShelter.length > 0 ? (rawShelter as ShelterRecordItem[]) : [];

  // Filter inmates by selectedBranch & Search
  const filteredInmates = useMemo(() => {
    return inmates.filter((item) => {
      if (selectedBranch !== 'ALL') {
        if (selectedBranch === 'RUH-MAIN' && !item.shelter_location.includes('الرياض')) return false;
        if (selectedBranch === 'JED-AIRPORT' && !item.shelter_location.includes('جدة')) return false;
        if (selectedBranch === 'DMM-EAST' && !item.shelter_location.includes('الخبر') && !item.shelter_location.includes('الدمام')) return false;
        if (selectedBranch === 'MAJ-SUD' && !item.shelter_location.includes('المجمعه') && !item.shelter_location.includes('المجمعة')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.maid_name.toLowerCase().includes(q) ||
          item.passport.toLowerCase().includes(q) ||
          (item.client_name && item.client_name.toLowerCase().includes(q)) ||
          item.shelter_location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inmates, selectedBranch, searchQuery]);

  // Derived Stats
  const sidebarStats: ShelterSidebarStats = useMemo(() => {
    const inside = filteredInmates.filter((i) => i.status === 'داخل الإيواء').length;
    const availableTransfer = filteredInmates.filter((i) => i.status === 'متاح للنقل' || i.work_willingness === 'ترغب بالعمل').length;
    const deportation = filteredInmates.filter((i) => i.status === 'مرحلة الترحيل' || i.work_willingness === 'لا ترغب بالعمل').length;
    const bedsTotal = rooms.reduce((acc, r) => acc + r.totalBeds, 0) || 40;
    const bedsOcc = rooms.reduce((acc, r) => acc + r.occupied, 0) || inside;
    const availableBeds = Math.max(0, bedsTotal - bedsOcc);
    const cateringToday = cateringMeals.reduce((acc, m) => acc + m.count, 0) || (inside * 3);
    const medicalQuarantine = medicalChecks.filter((m) => m.result === 'عزل صحي مؤقت').length;

    return {
      totalInmates: filteredInmates.length,
      insideCount: inside,
      availableBeds,
      cateringToday,
      medicalQuarantine,
      deportationCount: deportation,
      availableTransfer,
    };
  }, [filteredInmates, rooms, cateringMeals, medicalChecks]);

  // Handlers
  const handleCreateCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkinForm.maid_name || !checkinForm.passport) return;

    const newRecord: Partial<ShelterRecordItem> = {
      id: `SH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      company_id: activeCompanyId !== 'all' ? activeCompanyId : 'SAF',
      maid_name: checkinForm.maid_name,
      nationality: checkinForm.nationality,
      passport: checkinForm.passport,
      client_name: checkinForm.client_name || undefined,
      shelter_location: checkinForm.shelter_location,
      days_in_shelter: 1,
      catering_meals_count: 3,
      work_willingness: checkinForm.work_willingness,
      status: 'داخل الإيواء',
      created_at: new Date().toISOString(),
    };

    await createItem.mutateAsync(newRecord);
    setShowCheckinModal(false);
    setCheckinForm({
      maid_name: '',
      nationality: 'الفلبين',
      passport: '',
      client_name: '',
      shelter_location: 'الرياض - المقر الرئيسي (حي الياسمين)',
      work_willingness: 'ترغب بالعمل',
    });
    addNotification({
      title: 'تسكين نزيلة جديدة',
      message: `تم تسكين النزيلة (${newRecord.maid_name}) بمركز الإيواء بنجاح.`,
      type: 'success',
    });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.room) return;
    const totalBeds = Number(roomForm.totalBeds) || 4;

    const newR: ShelterRoom = {
      id: `RM-${Date.now().toString().slice(-4)}`,
      room: roomForm.room,
      beds: `${totalBeds} أسرة`,
      totalBeds,
      occupied: 0,
      status: `شاغر بالكامل (متاح ${totalBeds} أسرة)`,
      type: roomForm.type,
      clean: roomForm.clean,
    };

    const updated = await realErpDataStore.addRecord<ShelterRoom>('shelter_rooms', newR, rooms);
    setRooms(updated);
    setShowRoomModal(false);
    setRoomForm({ room: '', totalBeds: '4', type: 'نزيلات الفلبين', clean: 'تم التعقيم' });
    addNotification({
      title: 'إضافة مهجع / غرفة',
      message: `تم تسجيل الغرفة (${newR.room}) بسعة (${totalBeds} أسرة) بنجاح.`,
      type: 'success',
    });
  };

  const handleCreateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(mealForm.count) || 1;
    const cost = Number(mealForm.cost) || 0;

    const newM: ShelterCateringMeal = {
      id: `CAT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      place: mealForm.place,
      meal: mealForm.meal,
      count,
      vendor: mealForm.vendor,
      cost,
      sup: mealForm.sup,
      status: 'تم الاستلام والتوزيع',
    };

    const updated = await realErpDataStore.addRecord<ShelterCateringMeal>('shelter_catering_logs', newM, cateringMeals);
    setCateringMeals(updated);
    setShowMealModal(false);
    addNotification({
      title: 'توثيق وجبة إعاشة',
      message: `تم توثيق وجبة (${newM.meal}) لعدد (${count} نزيلة) بنجاح.`,
      type: 'success',
    });
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicForm.inmate_name) return;

    const newC: ShelterMedicalCheck = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      inmate_name: clinicForm.inmate_name,
      passport: clinicForm.passport,
      date: new Date().toISOString().slice(0, 10),
      check_type: clinicForm.check_type,
      temperature: clinicForm.temperature,
      blood_pressure: clinicForm.blood_pressure,
      result: clinicForm.result,
      isolation_wing: clinicForm.isolation_wing,
      notes: clinicForm.notes,
      nurse_doctor: clinicForm.nurse_doctor,
    };

    const updated = await realErpDataStore.addRecord<ShelterMedicalCheck>('shelter_medical_checks', newC, medicalChecks);
    setMedicalChecks(updated);
    setShowClinicModal(false);
    addNotification({
      title: 'توثيق فحص طبي',
      message: `تم تسجيل الكشف الطبي للنزيلة (${newC.inmate_name}) بنجاح.`,
      type: 'success',
    });
  };

  const handleUpdateStatus = async (item: ShelterRecordItem, newStatus: ShelterRecordItem['status']) => {
    await updateItem.mutateAsync({ id: item.id, data: { status: newStatus } });
    addNotification({
      title: 'تحديث حالة النزيلة',
      message: `تم تغيير حالة (${item.maid_name}) إلى (${newStatus}).`,
      type: 'info',
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-zinc-100 text-zinc-900" dir="rtl">
      {/* 1. Dedicated Shelter Navigation Sidebar */}
      <ShelterNavigationSidebar
        activeDepartment={activeDepartment}
        onSelectDepartment={setActiveDepartment}
        stats={sidebarStats}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        onReturnToErp={() => setGlobalActiveTab('dashboard', 'لوحة التحكم')}
        onOpenCheckinModal={() => setShowCheckinModal(true)}
      />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50">
        {/* Top Control Bar */}
        <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-md">
              <Hotel className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-bold text-zinc-950 m-0 truncate">
                  منظومة وبوابة مراكز الإيواء والتسكين والرعاية المستقلة
                </h1>
                <span className="text-[10.5px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {SHELTER_BRANCHES.find((b) => b.id === selectedBranch)?.name || 'كافة الفروع'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-100 text-zinc-600">
                  HRSD-MOL Compliant
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 m-0 truncate">
                إدارة السكن، الغرف، التغذية، الفرز الطبي، والمغادرة بموجب اشتراطات وزارة الموارد البشرية
              </p>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCheckinModal(true)}
              className="button-primary-pill shadow-sm flex items-center gap-1.5"
              style={{
                background: '#10b981',
                borderColor: '#10b981',
                padding: '6px 14px',
                fontSize: '11.5px',
                minHeight: '32px',
                color: '#ffffff',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسكين نزيلة</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRoomModal(true)}
              className="button-outline-on-light flex items-center gap-1"
              style={{ padding: '6px 12px', fontSize: '11px', minHeight: '32px' }}
            >
              <Bed className="w-3.5 h-3.5 text-zinc-700" />
              <span>+ غرفة</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMealModal(true)}
              className="button-outline-on-light flex items-center gap-1"
              style={{ padding: '6px 12px', fontSize: '11px', minHeight: '32px' }}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>+ وجبة</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClinicModal(true)}
              className="button-outline-on-light flex items-center gap-1"
              style={{ padding: '6px 12px', fontSize: '11px', minHeight: '32px' }}
            >
              <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
              <span>+ فحص طبي</span>
            </button>

            {/* Export Suite */}
            <ExportDropdown
              sectionKey="shelter"
              data={filteredInmates}
              customTitle={`كشف نزيلات مراكز الإيواء - ${activeCompany.name}`}
              buttonLabel="تصدير الكشوفات (10 صيغ)"
            />

            {/* Return to general ERP button */}
            <button
              type="button"
              onClick={() => setGlobalActiveTab('dashboard', 'لوحة التحكم')}
              className="button-outline-on-light flex items-center gap-1 hover:bg-zinc-100"
              style={{ padding: '6px 12px', fontSize: '11px', minHeight: '32px' }}
              title="العودة إلى الـ ERP العام"
            >
              <span>الـ ERP العام</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Department Content Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* =========================================================================
              DEPARTMENT 1: DASHBOARD & LIVE COMMAND CENTER
             ========================================================================= */}
          {activeDepartment === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 font-bold">إجمالي النزيلات المقيدات</div>
                    <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                      {sidebarStats.totalInmates} <span className="text-xs font-sans text-zinc-500">نزيلة</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{sidebarStats.insideCount} داخل مباني الإيواء حالياً</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                    <Hotel className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 font-bold">الأسرة والطاقة الاستيعابية</div>
                    <div className="text-2xl font-bold font-mono text-blue-900 mt-1">
                      {sidebarStats.availableBeds} <span className="text-xs font-sans text-zinc-500">سرير متاح</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">من إجمالي طاقة استيعابية 120 سريراً</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                    <Bed className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 font-bold">وجبات الإعاشة والتغذية اليوم</div>
                    <div className="text-2xl font-bold font-mono text-amber-900 mt-1">
                      {sidebarStats.cateringToday} <span className="text-xs font-sans text-zinc-500">وجبة</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-1">موزعة عبر 3 وجبات معتمدة صحياً</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                    <Utensils className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 font-bold">حالات العزل والفرز الطبي</div>
                    <div className="text-2xl font-bold font-mono text-rose-900 mt-1">
                      {sidebarStats.medicalQuarantine} <span className="text-xs font-sans text-zinc-500">حالة عزل</span>
                    </div>
                    <div className="text-[11px] text-rose-600 mt-1">تحت الرعاية الطبية والعلاج الوقائي</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Status Bar & Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Nationality & Willingness Matrix */}
                <div className="p-5 bg-white rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-900 m-0">توزيع النزيلات حسب الجنسية</h3>
                  <div className="space-y-3">
                    {[
                      { nat: 'الفلبين', count: 18, color: 'bg-emerald-500', pct: '41%' },
                      { nat: 'إثيوبيا', count: 14, color: 'bg-amber-500', pct: '32%' },
                      { nat: 'أوغندا وكينيا', count: 8, color: 'bg-blue-500', pct: '18%' },
                      { nat: 'إندونيسيا', count: 4, color: 'bg-rose-500', pct: '9%' },
                    ].map((item) => (
                      <div key={item.nat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-zinc-800">{item.nat}</span>
                          <span className="font-mono text-zinc-500">
                            {item.count} نزيلة ({item.pct})
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations & Capacity Summary */}
                <div className="p-5 bg-white rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-900 m-0">جاهزية مراكز الإيواء الميدانية</h3>
                  <div className="space-y-2.5 text-xs text-zinc-700">
                    <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">مقر الرياض الرئيسي</span>
                      </div>
                      <Badge text="طاقة: 40 سرير (إشغال 45%)" type="success" />
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-bold">مركز ترانزيت جدة (المطار)</span>
                      </div>
                      <Badge text="طاقة: 25 سرير (إشغال 20%)" type="info" />
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span className="font-bold">فرع المنطقة الشرقية (الدمام)</span>
                      </div>
                      <Badge text="طاقة: 30 سرير (إشغال 30%)" type="success" />
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        <span className="font-bold">فرع المجمعة وسدير</span>
                      </div>
                      <Badge text="طاقة: 25 سرير (إشغال 15%)" type="warning" />
                    </div>
                  </div>
                </div>

                {/* Compliance & Emergency */}
                <div className="p-5 bg-zinc-900 text-white rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>امتثال التفتيش الحكومي HRSD</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                        100% متوافق
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">معايير السلامة والإعاشة المعتمدة</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      كافة السجلات الطبية، وثائق الإعاشة اليومية، خطط الإخلاء للطوارئ، ومقاييس الغرف متطابقة مع متطلبات مساند والدفاع المدني.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveDepartment('compliance')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <span>عرض سجلات التفتيش والتقارير</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400">آخر فحص: اليوم</span>
                  </div>
                </div>
              </div>

              {/* Quick Table of Inmates */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 m-0">النزيلات المتواجدات حالياً بمقر الإيواء</h3>
                    <p className="text-xs text-zinc-500 m-0 mt-0.5">سجل لحظي بالأسماء، الجنسيات، ومقر الغرفة</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDepartment('checkin')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>فتح مكتب الاستقبال والتسكين الكامل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-right text-xs text-zinc-700">
                    <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3">رقم السجل</th>
                        <th className="p-3">اسم النزيلة</th>
                        <th className="p-3">الجنسية</th>
                        <th className="p-3">رقم الجواز</th>
                        <th className="p-3">المركز / الفرع</th>
                        <th className="p-3">أيام الإيواء</th>
                        <th className="p-3">وجبات الإعاشة</th>
                        <th className="p-3">الرغبة بالعمل</th>
                        <th className="p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredInmates.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="p-3 font-mono font-bold text-zinc-900">{item.id}</td>
                          <td className="p-3 font-bold text-black">{item.maid_name}</td>
                          <td className="p-3">{item.nationality}</td>
                          <td className="p-3 font-mono text-zinc-600">{item.passport}</td>
                          <td className="p-3">{item.shelter_location}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">{item.days_in_shelter} يوم</td>
                          <td className="p-3 font-mono text-amber-800">{item.catering_meals_count} وجبة</td>
                          <td className="p-3">
                            <Badge
                              text={item.work_willingness}
                              type={
                                item.work_willingness === 'ترغب بالعمل'
                                  ? 'success'
                                  : item.work_willingness === 'لا ترغب بالعمل'
                                  ? 'danger'
                                  : 'warning'
                              }
                            />
                          </td>
                          <td className="p-3">
                            <Badge text={item.status} type={item.status === 'داخل الإيواء' ? 'success' : 'info'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 2: CHECKIN & ONBOARDING DESK
             ========================================================================= */}
          {activeDepartment === 'checkin' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">مكتب الاستقبال والتسكين المباشر</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    تسجيل وصول النزيلات الجدد، استلام الأمتعة والعهد، وتحديث بيانات التسكين المباشر
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckinModal(true)}
                    className="button-primary-pill shadow-sm"
                    style={{ background: '#10b981', borderColor: '#10b981', padding: '7px 16px', fontSize: '12px', color: '#ffffff' }}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    <span>+ تسكين نزيلة جديدة</span>
                  </button>
                  <ExportDropdown
                    sectionKey="shelter"
                    data={filteredInmates}
                    customTitle="كشف نزيلات الإيواء والتسكين المباشر"
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="بحث برقم الجواز، اسم النزيلة، أو العميل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-full py-2 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black shadow-sm"
                />
              </div>

              {/* Inmates Table */}
              <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-zinc-700">
                    <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3">رقم النزيلة</th>
                        <th className="p-3">اسم النزيلة</th>
                        <th className="p-3">الجنسية</th>
                        <th className="p-3">رقم الجواز</th>
                        <th className="p-3">العميل / العقد</th>
                        <th className="p-3">مقر الإيواء</th>
                        <th className="p-3 font-mono">أيام المكوث</th>
                        <th className="p-3">الرغبة بالعمل</th>
                        <th className="p-3">الحالة الحالية</th>
                        <th className="p-3 text-center">إجراءات النزيلة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredInmates.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="p-3 font-mono font-bold text-zinc-900">{item.id}</td>
                          <td className="p-3 font-bold text-black">{item.maid_name}</td>
                          <td className="p-3">{item.nationality}</td>
                          <td className="p-3 font-mono text-zinc-600">{item.passport}</td>
                          <td className="p-3 text-zinc-600">{item.client_name || '—'}</td>
                          <td className="p-3">{item.shelter_location}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">{item.days_in_shelter} يوم</td>
                          <td className="p-3">
                            <Badge
                              text={item.work_willingness}
                              type={
                                item.work_willingness === 'ترغب بالعمل'
                                  ? 'success'
                                  : item.work_willingness === 'لا ترغب بالعمل'
                                  ? 'danger'
                                  : 'warning'
                              }
                            />
                          </td>
                          <td className="p-3">
                            <Badge text={item.status} type={item.status === 'داخل الإيواء' ? 'success' : 'info'} />
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item, 'متاح للنقل')}
                                className="button-outline-on-light"
                                style={{ padding: '2px 8px', fontSize: '10px', minHeight: '24px' }}
                                title="تحويل لمتاح للنقل والتنازل"
                              >
                                <span>نقل كفالة</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item, 'مرحلة الترحيل')}
                                className="button-outline-on-light text-rose-700 hover:bg-rose-50"
                                style={{ padding: '2px 8px', fontSize: '10px', minHeight: '24px' }}
                                title="تحويل لمرحلة الترحيل والسفر"
                              >
                                <span>ترحيل</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedInmateForPrint(item)}
                                className="button-outline-on-light"
                                style={{ padding: '2px 8px', fontSize: '10px', minHeight: '24px' }}
                                title="طباعة بطاقة نزيلة الإيواء المعتمدة"
                              >
                                <Printer className="w-3 h-3 text-zinc-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 3: ROOMS & BED ALLOCATION MATRIX
             ========================================================================= */}
          {activeDepartment === 'rooms' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">إدارة الغرف وتوزيع الأسرة والمهاجع</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    متابعة الطاقة الاستيعابية، الأسرة الشاغرة، وتوزيع الغرف حسب الجنسيات والتعقيم الدوري
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRoomModal(true)}
                    className="button-primary-pill shadow-sm"
                    style={{ background: '#000000', padding: '7px 16px', fontSize: '12px', color: '#ffffff' }}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    <span>+ إضافة غرفة / مهجع جديد</span>
                  </button>
                  <ExportDropdown
                    sectionKey="shelter"
                    data={rooms}
                    customTitle="كشف توزيع غرف وأسرة الإيواء"
                  />
                </div>
              </div>

              {/* Room Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-3xl border border-zinc-200 bg-white flex flex-col justify-between hover:border-black transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-zinc-950 text-sm">{r.room}</span>
                        <Badge
                          text={r.status}
                          type={r.status.includes('شاغر') || r.status.includes('متاح') ? 'success' : 'danger'}
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">{r.type}</p>
                      <div className="p-2.5 bg-zinc-50 rounded-2xl border border-zinc-100 mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-600 font-semibold">معدل الإشغال:</span>
                          <span className="font-mono font-bold text-zinc-900">
                            {r.occupied} / {r.totalBeds} أسرة
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${Math.min(100, (r.occupied / r.totalBeds) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{r.clean}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = rooms.map((rm) =>
                            rm.id === r.id ? { ...rm, occupied: Math.min(rm.totalBeds, rm.occupied + 1) } : rm
                          );
                          setRooms(updated);
                          addNotification({
                            title: 'تسكين سرير',
                            message: `تم حجز وتسكين سرير إضافي في (${r.room}).`,
                            type: 'success',
                          });
                        }}
                        className="button-outline-on-light"
                        style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                      >
                        + تسكين سريع
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 4: CATERING & DAILY MEALS
             ========================================================================= */}
          {activeDepartment === 'catering' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">سجل الإعاشة والتغذية والتموين اليومي</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    توثيق استلام وتوزيع الوجبات الغذائية الثلاث (فطور، غداء، عشاء) ومراقبة معايير الجودة
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMealModal(true)}
                    className="button-primary-pill shadow-sm"
                    style={{ background: '#d97706', borderColor: '#d97706', padding: '7px 16px', fontSize: '12px', color: '#ffffff' }}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    <span>+ تسجيل وجبة جماعية</span>
                  </button>
                  <ExportDropdown
                    sectionKey="shelter"
                    data={cateringMeals}
                    customTitle="كشف وجبات الإعاشة والتغذية اليومية"
                  />
                </div>
              </div>

              {/* Meals Schedule Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">وجبة الإفطار (07:30 AM)</span>
                    <Badge text="تم التوزيع" type="success" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900">إفطار صباحي متكامل + حليب وعصائر طازجة</div>
                  <div className="text-[11px] text-zinc-500">متعهد الإعاشة: مخابز وحلويات الريان</div>
                </div>

                <div className="p-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">وجبة الغداء (01:30 PM)</span>
                    <Badge text="تم التوزيع" type="success" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900">أرز ولحوم طازجة وخضار وفواكه</div>
                  <div className="text-[11px] text-zinc-500">متعهد الإعاشة: مطابخ ومطاعم السليم المعتمدة</div>
                </div>

                <div className="p-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">وجبة العشاء (08:00 PM)</span>
                    <Badge text="جاهز للتوزيع" type="warning" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900">وجبة خفيفة، معجنات صحية وفاكهة</div>
                  <div className="text-[11px] text-zinc-500">المشرفة المسؤولة: أميرة الشمري</div>
                </div>
              </div>

              {/* Catering Table */}
              <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-zinc-700">
                    <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">مقر الإيواء</th>
                        <th className="p-3">الوجبة</th>
                        <th className="p-3">عدد الوجبات</th>
                        <th className="p-3">المطعم / المورد المعتمد</th>
                        <th className="p-3 font-mono">التكلفة الإجمالية</th>
                        <th className="p-3">المشرف المسؤول</th>
                        <th className="p-3">حالة الاستلام</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {cateringMeals.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-50">
                          <td className="p-3 font-mono text-black">{row.date}</td>
                          <td className="p-3 font-bold text-black">{row.place}</td>
                          <td className="p-3 font-semibold text-black">{row.meal}</td>
                          <td className="p-3 font-mono font-bold text-black">{row.count} وجبة</td>
                          <td className="p-3 text-zinc-600">{row.vendor}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">{row.cost.toLocaleString()} ر.س</td>
                          <td className="p-3 text-zinc-700">{row.sup}</td>
                          <td className="p-3">
                            <Badge text={row.status} type="success" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 5: HEALTH CLINIC & QUARANTINE WING
             ========================================================================= */}
          {activeDepartment === 'clinic' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">العيادة الطبية والفحص المخبري وجناح العزل</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    الفحص الطبي الشامل عند الوصول، متابعة الأمراض السارية، وإدارة جناح العزل الطبي المؤقت
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClinicModal(true)}
                    className="button-primary-pill shadow-sm"
                    style={{ background: '#e11d48', borderColor: '#e11d48', padding: '7px 16px', fontSize: '12px', color: '#ffffff' }}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    <span>+ توثيق كشف طبي جديد</span>
                  </button>
                  <ExportDropdown
                    sectionKey="shelter"
                    data={medicalChecks}
                    customTitle="سجل الكشوفات الطبية والفحص المخبري للإيواء"
                  />
                </div>
              </div>

              {/* Medical Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {medicalChecks.map((med) => (
                  <div key={med.id} className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{med.inmate_name}</div>
                        <div className="text-xs font-mono text-zinc-500">{med.passport}</div>
                      </div>
                      <Badge
                        text={med.result}
                        type={med.result.includes('سليم') ? 'success' : med.result.includes('عزل') ? 'danger' : 'warning'}
                      />
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-2xl space-y-1.5 text-xs text-zinc-700">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">نوع الفحص:</span>
                        <span className="font-semibold">{med.check_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">درجة الحرارة:</span>
                        <span className="font-mono font-bold text-rose-700">{med.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">ضغط الدم:</span>
                        <span className="font-mono font-bold text-zinc-900">{med.blood_pressure}</span>
                      </div>
                      {med.isolation_wing && (
                        <div className="flex justify-between text-rose-700 font-bold">
                          <span>جناح العزل:</span>
                          <span>{med.isolation_wing}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed m-0">{med.notes}</p>
                    <div className="pt-2 border-t border-zinc-100 flex justify-between text-[11px] text-zinc-400">
                      <span>الفاحص: {med.nurse_doctor}</span>
                      <span className="font-mono">{med.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 6: WELFARE & DISPOSITION
             ========================================================================= */}
          {activeDepartment === 'welfare' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">شؤون النزيلات، الرغبة في العمل والتنازل</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    دراسة الحالات النفسية والاجتماعية، توجيه الراغبات بالعمل لنقل الخدمات والتأجير، والوساطة في النزاعات
                  </p>
                </div>
                <ExportDropdown
                  sectionKey="shelter"
                  data={filteredInmates}
                  customTitle="كشف دراسة حالات النزيلات والرغبة في العمل"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Willing to Work */}
                <div className="p-5 bg-white rounded-3xl border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-emerald-950 m-0">
                        النزيلات الراغبات في العمل (متاح للتنازل / التأجير)
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {filteredInmates.filter((i) => i.work_willingness === 'ترغب بالعمل').length} نزيلة
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredInmates
                      .filter((i) => i.work_willingness === 'ترغب بالعمل')
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-zinc-950 text-xs">{item.maid_name}</div>
                            <div className="text-[11px] text-zinc-500">
                              {item.nationality} • جواز: {item.passport}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item, 'متاح للنقل')}
                            className="button-primary-pill"
                            style={{ background: '#10b981', padding: '3px 10px', fontSize: '10.5px', color: '#fff' }}
                          >
                            إدراج بقائمة التنازل
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Not Willing to Work */}
                <div className="p-5 bg-white rounded-3xl border border-rose-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <h3 className="text-sm font-bold text-rose-950 m-0">
                        النزيلات الرافضات للعمل (إحالة للوساطة أو الترحيل)
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                      {filteredInmates.filter((i) => i.work_willingness === 'لا ترغب بالعمل').length} نزيلة
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredInmates
                      .filter((i) => i.work_willingness === 'لا ترغب بالعمل')
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-zinc-950 text-xs">{item.maid_name}</div>
                            <div className="text-[11px] text-zinc-500">
                              {item.nationality} • جواز: {item.passport}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item, 'مرحلة الترحيل')}
                            className="button-primary-pill"
                            style={{ background: '#e11d48', padding: '3px 10px', fontSize: '10.5px', color: '#fff' }}
                          >
                            جدولة للترحيل والسفر
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 7: DEPORTATION & REPATRIATION
             ========================================================================= */}
          {activeDepartment === 'deportation' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">وحدة الترحيل والمغادرة وتنسيق المطار</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    إصدار تأشيرات الخروج النهائي، حجوزات التذاكر، تسليم الأمتعة، والتنسيق مع سائقي الحافلات للمطارات
                  </p>
                </div>
                <ExportDropdown
                  sectionKey="shelter"
                  data={filteredInmates.filter((i) => i.status === 'مرحلة الترحيل')}
                  customTitle="كشف حالات الترحيل والمغادرة النهائية"
                />
              </div>

              <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-zinc-700">
                    <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3">رقم السجل</th>
                        <th className="p-3">اسم النزيلة</th>
                        <th className="p-3">الجنسية</th>
                        <th className="p-3">رقم الجواز</th>
                        <th className="p-3">تأشيرة الخروج النهائي</th>
                        <th className="p-3">حجز الطيران</th>
                        <th className="p-3">مطار المغادرة</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredInmates
                        .filter((i) => i.status === 'مرحلة الترحيل')
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50">
                            <td className="p-3 font-mono font-bold text-black">{item.id}</td>
                            <td className="p-3 font-bold text-black">{item.maid_name}</td>
                            <td className="p-3">{item.nationality}</td>
                            <td className="p-3 font-mono text-zinc-600">{item.passport}</td>
                            <td className="p-3 text-emerald-700 font-bold">صادرة ومسددة (أبشر)</td>
                            <td className="p-3 font-mono text-zinc-800">SV-824 (مؤكد)</td>
                            <td className="p-3">مطار الملك خالد الدولي (الرياض)</td>
                            <td className="p-3">
                              <Badge text="مرحلة الترحيل" type="danger" />
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item, 'تم الترحيل')}
                                className="button-outline-on-light"
                                style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                              >
                                تأكيد المغادرة والترحيل
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 8: BRANCHES NETWORK
             ========================================================================= */}
          {activeDepartment === 'branches' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
                <h2 className="text-base font-bold text-zinc-900 m-0">شبكة فروع ومقرات مراكز الإيواء بالمملكة</h2>
                <p className="text-xs text-zinc-500 m-0 mt-1">
                  المراكز المعتمدة والمرخصة من وزارة الموارد البشرية للتسكين المؤقت والإعاشة لشركات المجموعة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'مركز إيواء الرياض الرئيسي (مقر حي الياسمين)',
                    city: 'الرياض - حي الياسمين / طريق الملك عبدالعزيز',
                    capacity: '40 سرير',
                    current: '18 نزيلة',
                    manager: 'أ. أميرة الشمري',
                    phone: '+966 11 488 9201',
                    license: 'HRSD-SH-2024-0012',
                    status: 'نشط ويعمل بكامل طاقته',
                  },
                  {
                    name: 'مركز ترانزيت واستقبال مطار جدة',
                    city: 'جدة - حي النزهة (بالقرب من الصالة الشمالية)',
                    capacity: '25 سرير',
                    current: '5 نزيلات',
                    manager: 'أ. خالد باوزير',
                    phone: '+966 12 654 3201',
                    license: 'HRSD-SH-2024-0019',
                    status: 'نشط ويعمل 24/7 للرحلات',
                  },
                  {
                    name: 'مركز المنطقة الشرقية (الدمام والخبر)',
                    city: 'الدمام - حي الشاطئ / طريق الملك فهد',
                    capacity: '30 سرير',
                    current: '12 نزيلة',
                    manager: 'أ. فاطمة العلي',
                    phone: '+966 13 833 4201',
                    license: 'HRSD-SH-2024-0027',
                    status: 'نشط ويعمل بكامل طاقته',
                  },
                  {
                    name: 'مركز فرع المجمعة ومحافظات سدير',
                    city: 'المجمعة - حي الروضة',
                    capacity: '25 سرير',
                    current: '9 نزيلات',
                    manager: 'أ. سلطان المطيري',
                    phone: '+966 16 432 1102',
                    license: 'HRSD-SH-2024-0033',
                    status: 'نشط وجاهز للاستقبال',
                  },
                ].map((branch) => (
                  <div key={branch.name} className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-950 m-0">{branch.name}</h3>
                        <p className="text-xs text-zinc-500 m-0 mt-0.5">{branch.city}</p>
                      </div>
                      <Badge text="مرخص ومعتمد" type="success" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700 p-3 bg-zinc-50 rounded-2xl">
                      <div>
                        <span className="text-zinc-500 block text-[10.5px]">السعة القصوى:</span>
                        <span className="font-bold text-zinc-950">{branch.capacity}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10.5px]">الإشغال الحالي:</span>
                        <span className="font-bold text-emerald-800">{branch.current}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10.5px]">المشرف المسؤول:</span>
                        <span className="font-bold text-zinc-900">{branch.manager}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10.5px]">هاتف المركز:</span>
                        <span className="font-mono text-zinc-800">{branch.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                      <span>رقم الترخيص: <span className="font-mono">{branch.license}</span></span>
                      <span className="text-emerald-700 font-bold">{branch.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              DEPARTMENT 9: HRSD COMPLIANCE & 10-FORMAT INSPECTION SUITE
             ========================================================================= */}
          {activeDepartment === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 m-0">مركز الامتثال، التفتيش والتقارير الرسمية</h2>
                  <p className="text-xs text-zinc-500 m-0 mt-1">
                    إصدار وتصدير السجلات المعتمدة لجولات التفتيش والرقابة بوزارة الموارد البشرية بـ 10 صيغ رسمية
                  </p>
                </div>
                <ExportDropdown
                  sectionKey="shelter"
                  data={filteredInmates}
                  customTitle={`ملف تفتيش الإيواء الشامل لوزارة الموارد البشرية - ${activeCompany.name}`}
                  buttonLabel="تصدير ملف التفتيش (10 صيغ)"
                />
              </div>

              {/* Compliance Checklist Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: '1. كشف النزيلات اليومي المعتمد',
                    desc: 'يتضمن أرقام الجوازات، الجنسيات، تاريخ الدخول، ورقم العقد بمساند.',
                    status: 'جاهز للتصدير',
                  },
                  {
                    title: '2. سجل الوجبات والتغذية الثلاث',
                    desc: 'يتضمن كشف توقيعات المشرفة ومطاعم الإعاشة المعتمدة وسجل السعرات.',
                    status: 'مكتمل وموثق',
                  },
                  {
                    title: '3. سجل العيادة والفحص الطبي المخبري',
                    desc: 'يشمل كشف الحرارة، الضغط، فحص الأمراض السارية، وإجراءات العزل.',
                    status: 'معتمد طبياً',
                  },
                  {
                    title: '4. سجلات الدفاع المدني والسلامة',
                    desc: 'شهادات طفايات الحريق، مخارج الطوارئ، وكاميرات المراقبة بالأسوار.',
                    status: 'ساري المفعول',
                  },
                  {
                    title: '5. وثائق الترحيل والخروج النهائي',
                    desc: 'تأشيرات الخروج النهائي الصادرة من الجوازات وحجوزات التذاكر.',
                    status: 'مطابق للجوازات',
                  },
                  {
                    title: '6. محاضر النظافة والتعقيم الدوري',
                    desc: 'عقود شركات مكافحة الحشرات والتعقيم المعتمدة من أمانة المنطقة.',
                    status: 'محدث أسبوعياً',
                  },
                ].map((card) => (
                  <div key={card.title} className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-950 text-xs">{card.title}</span>
                      <Badge text={card.status} type="success" />
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed m-0">{card.desc}</p>
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                      <ExportDropdown
                        sectionKey="shelter"
                        data={filteredInmates}
                        customTitle={card.title}
                        buttonLabel="طباعة / تصدير"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODALS: CHECKIN, ROOM, MEAL, CLINIC
         ========================================================================= */}

      {/* 1. Inmate Checkin Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white m-0">تسكين نزيلة جديدة بمركز الإيواء</h3>
              </div>
              <button onClick={() => setShowCheckinModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCheckin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">اسم العاملة / النزيلة *</label>
                <input
                  type="text"
                  required
                  placeholder="الاسم الرباعي للعاملة..."
                  value={checkinForm.maid_name}
                  onChange={(e) => setCheckinForm({ ...checkinForm, maid_name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">الجنسية *</label>
                  <select
                    value={checkinForm.nationality}
                    onChange={(e) => setCheckinForm({ ...checkinForm, nationality: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="الفلبين">الفلبين</option>
                    <option value="إندونيسيا">إندونيسيا</option>
                    <option value="إثيوبيا">إثيوبيا</option>
                    <option value="أوغندا">أوغندا</option>
                    <option value="كينيا">كينيا</option>
                    <option value="سريلانكا">سريلانكا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">رقم الجواز *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: PH982341..."
                    value={checkinForm.passport}
                    onChange={(e) => setCheckinForm({ ...checkinForm, passport: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">مركز / فرع الإيواء المحدد *</label>
                <select
                  value={checkinForm.shelter_location}
                  onChange={(e) => setCheckinForm({ ...checkinForm, shelter_location: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                >
                  <option value="الرياض - المقر الرئيسي (حي الياسمين)">الرياض - المقر الرئيسي (حي الياسمين)</option>
                  <option value="جدة - مركز ترانزيت المطار">جدة - مركز ترانزيت المطار</option>
                  <option value="الدمام - فرع المنطقة الشرقية">الدمام - فرع المنطقة الشرقية</option>
                  <option value="المجمعة - فرع سدير">المجمعة - فرع سدير</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">الرغبة في العمل</label>
                  <select
                    value={checkinForm.work_willingness}
                    onChange={(e) => setCheckinForm({ ...checkinForm, work_willingness: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="ترغب بالعمل">ترغب بالعمل (متاح للتنازل)</option>
                    <option value="لا ترغب بالعمل">لا ترغب بالعمل (ترحيل)</option>
                    <option value="غير محدد">قيد التقييم والدراسة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">اسم العميل / المستفيد</label>
                  <input
                    type="text"
                    placeholder="اختياري..."
                    value={checkinForm.client_name}
                    onChange={(e) => setCheckinForm({ ...checkinForm, client_name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckinModal(false)}
                  className="button-outline-on-light"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ background: '#10b981', borderColor: '#10b981', padding: '6px 16px', fontSize: '12px', color: '#fff' }}
                >
                  تأكيد التسكين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white m-0">إضافة غرفة / مهجع إيواء جديد</h3>
              <button onClick={() => setShowRoomModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">اسم الغرفة أو المهجع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: جناح د - غرفة 401"
                  value={roomForm.room}
                  onChange={(e) => setRoomForm({ ...roomForm, room: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">عدد الأسرة *</label>
                  <select
                    value={roomForm.totalBeds}
                    onChange={(e) => setRoomForm({ ...roomForm, totalBeds: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="2">2 سرير</option>
                    <option value="4">4 أسرة</option>
                    <option value="6">6 أسرة</option>
                    <option value="8">8 أسرة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">تخصيص النزيلات</label>
                  <input
                    type="text"
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="button-outline-on-light"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ background: '#000000', padding: '6px 16px', fontSize: '12px', color: '#fff' }}
                >
                  حفظ الغرفة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white m-0">تسجيل وجبة جماعية وإعاشة</h3>
              <button onClick={() => setShowMealModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">نوع الوجبة</label>
                  <select
                    value={mealForm.meal}
                    onChange={(e) => setMealForm({ ...mealForm, meal: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="وجبة إفطار">وجبة إفطار</option>
                    <option value="وجبة غداء">وجبة غداء</option>
                    <option value="وجبة عشاء">وجبة عشاء</option>
                    <option value="وجبة إضافية / فواكه">وجبة إضافية / فواكه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">عدد الوجبات</label>
                  <input
                    type="number"
                    value={mealForm.count}
                    onChange={(e) => setMealForm({ ...mealForm, count: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">المطعم / متعهد الإعاشة</label>
                <input
                  type="text"
                  value={mealForm.vendor}
                  onChange={(e) => setMealForm({ ...mealForm, vendor: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">التكلفة (ر.س)</label>
                  <input
                    type="number"
                    value={mealForm.cost}
                    onChange={(e) => setMealForm({ ...mealForm, cost: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">المشرف المستلم</label>
                  <input
                    type="text"
                    value={mealForm.sup}
                    onChange={(e) => setMealForm({ ...mealForm, sup: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="button-outline-on-light"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ background: '#d97706', borderColor: '#d97706', padding: '6px 16px', fontSize: '12px', color: '#fff' }}
                >
                  توثيق الوجبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Clinic Modal */}
      {showClinicModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white m-0">تسجيل فحص طبي وكشف صحي</h3>
              <button onClick={() => setShowClinicModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClinic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">اسم النزيلة *</label>
                <input
                  type="text"
                  required
                  placeholder="اسم العاملة..."
                  value={clinicForm.inmate_name}
                  onChange={(e) => setClinicForm({ ...clinicForm, inmate_name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">نوع الكشف</label>
                  <select
                    value={clinicForm.check_type}
                    onChange={(e) => setClinicForm({ ...clinicForm, check_type: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="فحص وصول أولي">فحص وصول أولي</option>
                    <option value="متابعة دورية">متابعة دورية</option>
                    <option value="عزل صحي">عزل صحي</option>
                    <option value="كشف طارئ">كشف طارئ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">النتيجة الطبية</label>
                  <select
                    value={clinicForm.result}
                    onChange={(e) => setClinicForm({ ...clinicForm, result: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="سليم ولائق صحياً">سليم ولائق صحياً</option>
                    <option value="يحتاج راحة وأدوية">يحتاج راحة وأدوية</option>
                    <option value="عزل صحي مؤقت">عزل صحي مؤقت</option>
                    <option value="محال لمستشفى">محال لمستشفى</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">الحرارة</label>
                  <input
                    type="text"
                    value={clinicForm.temperature}
                    onChange={(e) => setClinicForm({ ...clinicForm, temperature: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">ضغط الدم</label>
                  <input
                    type="text"
                    value={clinicForm.blood_pressure}
                    onChange={(e) => setClinicForm({ ...clinicForm, blood_pressure: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">ملاحظات الطبيب / الممرضة</label>
                <textarea
                  rows={2}
                  value={clinicForm.notes}
                  onChange={(e) => setClinicForm({ ...clinicForm, notes: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-1.5 px-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClinicModal(false)}
                  className="button-outline-on-light"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ background: '#e11d48', borderColor: '#e11d48', padding: '6px 16px', fontSize: '12px', color: '#fff' }}
                >
                  حفظ التقرير الطبي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
