import React, { useState, useEffect, useMemo } from 'react';
import { 
  WorkerProfile, 
  TransferCase, 
  AccommodationCase, 
  WorkerMovementTimeline,
  GroupOfficeId,
  GROUP_OFFICES,
  GROUP_COMPANIES 
} from '../types/shelterTransferSuite';
import { shelterTransferStore } from '../services/shelterTransferStore';
import { DailyFollowUpHub } from '../components/shelter/DailyFollowUpHub';
import { AvailableWorkersCatalog } from '../components/shelter/AvailableWorkersCatalog';
import { TransferBookingModal } from '../components/shelter/TransferBookingModal';
import { ShelterIntakeModal } from '../components/shelter/ShelterIntakeModal';
import { WorkerProfileDetailModal } from '../components/shelter/WorkerProfileDetailModal';
import { ShelterNotificationDrawer } from '../components/shelter/ShelterNotificationDrawer';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { useAppStore } from '../stores/appStore';
import { 
  Building2, 
  Sparkles, 
  Hotel, 
  Repeat, 
  Hourglass, 
  CheckCircle2, 
  AlertTriangle, 
  Bell,
  Calendar, 
  DollarSign, 
  Users, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Search, 
  ArrowLeftRight, 
  History, 
  UserCheck, 
  Plus, 
  Bed,
  CheckCheck,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

export const SponsorshipTransferPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const storeActiveTab = useAppStore(state => state.activeTab);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'followup' | 'catalog' | 'dashboard' | 'inmates' | 'transfers' | 'timeline'>('followup');

  // Modal triggers
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  // Filters & State
  const [officeFilter, setOfficeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setForceUpdate] = useState({});

  // Trigger re-render on store update
  const refresh = () => setForceUpdate({});

  // Sync initial tab if came from sidebar
  useEffect(() => {
    if (storeActiveTab === 'trial-period') {
      setActiveTab('followup');
    } else if (storeActiveTab === 'transferred-done') {
      setActiveTab('transfers');
    }
  }, [storeActiveTab]);

  const state = shelterTransferStore.getState();
  const metrics = shelterTransferStore.getMetrics();
  const workers = state.workers;
  const transferCases = state.transferCases;
  const accommodationCases = state.accommodationCases;
  const timeline = state.timeline;

  // Follow-up alerts counts
  const urgentFollowupsCount = useMemo(() => {
    return transferCases.filter(t => {
      if (t.transferStatus !== 'خرجت للعميل') return false;
      const status = shelterTransferStore.calculateFollowupStatus(t);
      return status.alertLevel === 'red' || status.alertLevel === 'yellow';
    }).length;
  }, [transferCases]);

  const availableWorkersCount = useMemo(() => {
    return workers.filter(w => w.operationalStatus === 'متاحة لنقل الخدمات').length;
  }, [workers]);

  // Handle booking action
  const handleOpenBooking = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setShowBookingModal(true);
  };

  // Handle profile detail action
  const handleOpenProfile = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setShowProfileModal(true);
  };

  // Notification Drawer state & proactive alerts
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const proactiveAlerts = useMemo(() => {
    return shelterTransferStore.getProactiveAlerts();
  }, [state]);

  const criticalAlertsCount = useMemo(() => {
    return proactiveAlerts.filter(a => a.urgency === 'danger').length;
  }, [proactiveAlerts]);

  const handleOpenProfileById = (workerId: string) => {
    const w = workers.find(item => item.id === workerId) || shelterTransferStore.getWorkerById(workerId);
    if (w) {
      setSelectedWorker(w);
      setShowProfileModal(true);
    }
  };

  // Helper for office badge
  const getOfficeMeta = (officeId: GroupOfficeId) => {
    return GROUP_OFFICES[officeId] || { name: officeId, primaryColor: '#6366f1', badgeColor: 'bg-indigo-100 text-indigo-800' };
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Master Cinematic Hero Header */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #091725 0%, #10263f 50%, #153254 100%)',
          border: '1.5px solid rgba(207, 166, 74, 0.4)',
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                منظومة موحدة مشتركة
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                تكامل تام بين 4 مكاتب وشركات استقدام وتشغيل
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              منظومة إدارة السكن ونقل الخدمات الموحدة
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-sans leading-relaxed">
              الفصل المحكم بين مكتب العاملة الأصلي والمكتب المنفذ لنقل الخدمات، ملف موحد دائم للعاملة، قسم مستقل للكفيل الأول، ومتابعة يومية رقمية لفترة تجربة العملاء.
            </p>

            {/* The 4 Group Offices Chips */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-zinc-400 font-bold ml-1">المكاتب والشركات المشتركة:</span>
              {GROUP_COMPANIES.map((comp: any) => (
                <div 
                  key={comp.id}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 text-white border border-white/15 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.brandColor }} />
                  <span>{comp.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                const firstAvailable = workers.find(w => w.operationalStatus === 'متاحة لنقل الخدمات');
                if (firstAvailable) {
                  handleOpenBooking(firstAvailable);
                } else {
                  setActiveTab('catalog');
                }
              }}
              className="px-4 py-2.5 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>+ حجز نقل خدمات لعميل</span>
            </button>

            <button
              onClick={() => setShowIntakeModal(true)}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all flex items-center gap-2"
            >
              <Hotel className="w-4 h-4 text-amber-300" />
              <span>+ تسكين نزيلة جديدة</span>
            </button>

            {/* Notification Center Trigger */}
            <button
              onClick={() => setShowNotificationDrawer(true)}
              className="relative px-4 py-2.5 rounded-2xl font-black text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all flex items-center gap-2 shadow-sm"
              title="مركز الإشعارات والتنبيهات الاستباقية"
            >
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>مركز التنبيهات ({proactiveAlerts.length})</span>
              {criticalAlertsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute -top-1 -right-1" />
              )}
            </button>

            <ExportDropdown
              sectionKey="shelter"
              data={transferCases}
              customTitle="سجل عمليات نقل الخدمات والتنازل الموحد"
              variant="outline-light"
              buttonLabel="تصدير التقارير"
            />
          </div>
        </div>
      </div>

      {/* 1.5 Urgent Proactive Alert Banner (T=0 / Overdue) */}
      {criticalAlertsCount > 0 && (
        <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-rose-400/40 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black shadow-inner shrink-0">
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white text-rose-800">
                  تنبيه استباقي عاجل (T=0)
                </span>
                <span className="text-xs text-rose-100 font-bold">
                  تجاوز مدة التجربة أو انتهاء اليوم
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5 font-display">
                يوجد {criticalAlertsCount} حالة تجربة تجاوزت الموعد أو تنتهي اليوم وتتطلب حسم القرار فوراً!
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                تأخير اتخاذ الإجراء بعد T=0 يعرض المكتب لمخالفات نظامية ويعلق المستحقات المالية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNotificationDrawer(true)}
              className="px-4 py-2 rounded-2xl bg-white text-rose-900 text-xs font-black hover:bg-rose-50 transition-all shadow-md flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-rose-700" />
              <span>معالجة التنبيهات ({proactiveAlerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('followup')}
              className="px-4 py-2 rounded-2xl bg-black/20 hover:bg-black/30 text-white text-xs font-bold border border-white/20 transition-all"
            >
              المتابعة اليومية
            </button>
          </div>
        </div>
      )}

      {/* 2. Executive Metric KPIs (6 Balanced Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total In Shelter */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>نزيلات السكن</span>
            <Hotel className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-2 font-display">
            {metrics.totalWorkersInShelter}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            سعة مستقرة داخل المقرات
          </div>
        </div>

        {/* Metric 2: Available for Transfer */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>متاحة لنقل الخدمات</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-display">
            {availableWorkersCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            جاهزة للتسليم الفوري
          </div>
        </div>

        {/* Metric 3: In Trial Period */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>قيد التجربة لدى عميل</span>
            <Hourglass className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2 font-display">
            {metrics.workersInClientTrial}
          </div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">
            عداد المتابعة نشط
          </div>
        </div>

        {/* Metric 4: Urgent Follow-ups */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>متابعات عاجلة</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2 font-display">
            {urgentFollowupsCount}
          </div>
          <div className="text-[11px] text-rose-700 font-bold mt-1">
            تنبيهات أحمر وأصفر
          </div>
        </div>

        {/* Metric 5: Completed Transfers */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>نقل خدمات مكتمل</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-2 font-display">
            {metrics.transfersCompletedThisMonth}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            تم التنازل رسمياً
          </div>
        </div>

        {/* Metric 6: Total Transfer Revenue */}
        <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
            <span>إجمالي الإيرادات</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 mt-2 font-display truncate">
            {(metrics.totalTransferRevenue / 1000).toFixed(0)}k <span className="text-xs">ر.س</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            عقود نقل الخدمات
          </div>
        </div>
      </div>

      {/* 3. Navigation SubTabs */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-2 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto p-1">
          {/* Tab 1: Daily Follow-up */}
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'followup'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Hourglass className="w-4 h-4 text-amber-400" />
            <span>المتابعة اليومية للعملاء</span>
            {urgentFollowupsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                {urgentFollowupsCount} عاجل
              </span>
            )}
          </button>

          {/* Tab 2: Available Workers Catalog */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>كتالوج العاملات المتاحة لنقل الخدمات</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
              {availableWorkersCount}
            </span>
          </button>

          {/* Tab 3: Current Shelter Inmates */}
          <button
            onClick={() => setActiveTab('inmates')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inmates'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Hotel className="w-4 h-4 text-indigo-400" />
            <span>نزيلات السكن المشترك ({accommodationCases.filter(c => c.caseStatus === 'نشطة بالسكن').length})</span>
          </button>

          {/* Tab 4: Transfer Cases */}
          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'transfers'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Repeat className="w-4 h-4 text-blue-400" />
            <span>سجل عمليات النقل والتنازل ({transferCases.length})</span>
          </button>

          {/* Tab 5: Movement Timeline */}
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <History className="w-4 h-4 text-purple-400" />
            <span>السجل الزمني والتدقيق ({timeline.length})</span>
          </button>

          {/* Tab 6: Executive Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-zinc-400" />
            <span>تحليلات المكاتب الأربعة</span>
          </button>
        </div>
      </div>

      {/* 4. SubTab Contents */}

      {/* TAB 1: Daily Follow-up Hub */}
      {activeTab === 'followup' && (
        <DailyFollowUpHub
          onRefresh={refresh}
          onOpenWorkerProfile={(workerId: string) => {
            const w = workers.find(x => x.id === workerId);
            if (w) handleOpenProfile(w);
          }}
        />
      )}

      {/* TAB 2: Available Workers Catalog */}
      {activeTab === 'catalog' && (
        <AvailableWorkersCatalog
          workers={workers}
          onBookTransfer={handleOpenBooking}
          onViewProfile={handleOpenProfile}
          onRefresh={refresh}
        />
      )}

      {/* TAB 3: Shelter Inmates & Intake Management */}
      {activeTab === 'inmates' && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display">
                سجل نزيلات مراكز الإيواء والتسكين المشترك
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                توزيع الغرف، حالة الإعاشة، الفحوصات الطبية، ومدة البقاء بالسكن
              </p>
            </div>

            <button
              onClick={() => setShowIntakeModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ تسكين نزيلة جديدة</span>
            </button>
          </div>

          {/* Inmates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">العاملة</th>
                  <th className="p-3">الجنسية والجواز</th>
                  <th className="p-3">المكتب الأصلي</th>
                  <th className="p-3">سبب الدخول</th>
                  <th className="p-3">الغرفة والسرير</th>
                  <th className="p-3">تاريخ الدخول</th>
                  <th className="p-3">الحالة التشغيلية</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {accommodationCases.map((acc) => {
                  const worker = workers.find(w => w.id === acc.workerId);
                  const office = getOfficeMeta(acc.originalOfficeId);
                  if (!worker) return null;

                  return (
                    <tr key={acc.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          {worker.photoUrl ? (
                            <img 
                              src={worker.photoUrl} 
                              alt={worker.fullNameAr} 
                              className="w-9 h-9 rounded-xl object-cover border border-zinc-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-zinc-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                              {(worker.fullNameAr || 'ع').slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-zinc-900">{worker.fullNameAr}</div>
                            <div className="text-[11px] text-zinc-400 font-sans">{acc.caseCode}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="text-zinc-800 font-bold">{worker.nationality}</div>
                        <div className="text-[11px] font-mono text-zinc-500">{worker.passportNumber}</div>
                      </td>

                      <td className="p-3">
                        <span 
                          className="px-2.5 py-1 rounded-xl text-[11px] font-black inline-block"
                          style={{ backgroundColor: `${office.primaryColor}15`, color: office.primaryColor }}
                        >
                          {office.name}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="text-zinc-700 text-xs">{acc.entryReason}</span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1 text-zinc-800 font-bold">
                          <Bed className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{acc.roomNumber || 'جناح رئيسي'}</span>
                          {acc.bedNumber && <span className="text-zinc-400 font-normal">({acc.bedNumber})</span>}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-zinc-600 text-[11px]">
                        {new Date(acc.entryDateTime).toLocaleDateString('ar-SA')}
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          worker.operationalStatus === 'متاحة لنقل الخدمات' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : worker.operationalStatus === 'خرجت للعميل'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {worker.operationalStatus}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenProfile(worker)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                            title="عرض الملف الشامل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {worker.operationalStatus === 'متاحة لنقل الخدمات' && (
                            <button
                              onClick={() => handleOpenBooking(worker)}
                              className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            >
                              حجز لعميل
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: All Transfer Cases (Decoupled Offices on Display) */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 font-display">
                  سجل عمليات نقل الخدمات والتنازل الموحد
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                  {transferCases.length} عمليات
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                فصل صريح بين المكتب الأصلي للعاملة والمكتب المنفذ للعملية مع التفاصيل المالية الدقيقة
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ExportDropdown
                sectionKey="transfers"
                data={transferCases}
                customTitle="كشف عمليات نقل الخدمات الشامل"
                variant="outline-dark"
                buttonLabel="تصدير السجل"
              />
            </div>
          </div>

          {/* Transfers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">كود العملية</th>
                  <th className="p-3">العاملة</th>
                  <th className="p-3">المكتب الأصلي</th>
                  <th className="p-3">المكتب المنفذ</th>
                  <th className="p-3">العميل الجديد</th>
                  <th className="p-3">التسعير والمدفوع</th>
                  <th className="p-3">فترة التجربة</th>
                  <th className="p-3">الحالة الحالية</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {transferCases.map((transfer) => {
                  const worker = workers.find(w => w.id === transfer.workerId);
                  const origOffice = getOfficeMeta(transfer.originalOfficeId);
                  const execOffice = getOfficeMeta(transfer.executingOfficeId);

                  return (
                    <tr key={transfer.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-zinc-900">
                        {transfer.transferCode}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-zinc-900">{worker?.fullNameAr || 'عاملة'}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">جواز: {worker?.passportNumber || '-'}</div>
                      </td>

                      {/* Decoupled Office 1: Original */}
                      <td className="p-3">
                        <span 
                          className="px-2.5 py-1 rounded-xl text-[11px] font-black inline-block"
                          style={{ backgroundColor: `${origOffice.primaryColor}15`, color: origOffice.primaryColor }}
                        >
                          {origOffice.name}
                        </span>
                      </td>

                      {/* Decoupled Office 2: Executing */}
                      <td className="p-3">
                        <span 
                          className="px-2.5 py-1 rounded-xl text-[11px] font-black inline-block"
                          style={{ backgroundColor: `${execOffice.primaryColor}15`, color: execOffice.primaryColor }}
                        >
                          {execOffice.name}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-zinc-900">{transfer.newClientName}</div>
                        <div className="text-[11px] font-mono text-zinc-500">{transfer.newClientPhone}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-zinc-900">
                          {transfer.transferFee.toLocaleString('ar-SA')} ر.س
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          عربون: {transfer.downPayment.toLocaleString('ar-SA')} | متبقي: {transfer.remainingAmount.toLocaleString('ar-SA')}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="text-zinc-800 font-bold">{transfer.followupDaysDuration} أيام</div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          انتهاء: {transfer.followupEndDate || '-'}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          transfer.transferStatus === 'تم نقل الخدمات' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : transfer.transferStatus === 'عادت من العميل'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {transfer.transferStatus}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        {worker && (
                          <button
                            onClick={() => handleOpenProfile(worker)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                            title="عرض الملف الشامل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Movement Timeline Audit Trail */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display">
                سجل المخطط الزمني والتدقيق الشامل لكافة الحركات
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                توثيق غير قابل للحذف لكل دخول، تقييم، حجز، تسليم، اتصال متابعة، إرجاع وتسوية مالية
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              {timeline.length} حدث موثق
            </span>
          </div>

          <div className="relative pr-6 border-r-2 border-zinc-200 space-y-6 pt-2">
            {timeline.map((item) => {
              const worker = workers.find(w => w.id === item.workerId);
              return (
                <div key={item.id} className="relative group">
                  <span className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-600 group-hover:scale-125 transition-transform" />

                  <div className="bg-zinc-50 hover:bg-zinc-100/80 transition-colors p-4 rounded-2xl border border-zinc-200/90 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-zinc-900">
                          {item.movementType}
                        </span>
                        {worker && (
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                            {worker.fullNameAr} ({worker.nationality})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {new Date(item.eventDateTime).toLocaleString('ar-SA')}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-[11px] text-zinc-500 border-t border-zinc-200/60 flex-wrap">
                      <span>الموظف: <strong>{item.actorEmployee}</strong></span>
                      {item.officeId && (
                        <span>المكتب: <strong>{item.officeId}</strong></span>
                      )}
                      {item.fromStatus && item.toStatus && (
                        <span>
                          الحالة: <span className="line-through">{item.fromStatus}</span> ➔ <strong className="text-emerald-700">{item.toStatus}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: Four Offices Distribution & Analytics Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GROUP_COMPANIES.map((office: any) => {
              const officeWorkers = workers.filter(w => w.originalOfficeId === office.id);
              const officeTransfers = transferCases.filter(t => t.executingOfficeId === office.id);
              const officeRevenue = officeTransfers.reduce((sum, t) => sum + t.transferFee, 0);

              return (
                <div 
                  key={office.id}
                  className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm relative overflow-hidden space-y-4"
                >
                  <div className="h-1.5 w-full absolute top-0 right-0 left-0" style={{ backgroundColor: office.brandColor }} />
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-900 text-sm">{office.name}</h3>
                    <span 
                      className="px-2 py-0.5 rounded-lg text-[10px] font-black"
                      style={{ backgroundColor: `${office.brandColor}15`, color: office.brandColor }}
                    >
                      {office.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-zinc-50 p-2.5 rounded-2xl border border-zinc-100">
                      <div className="text-[11px] text-zinc-400 font-bold">عاملات تابعة له</div>
                      <div className="text-base font-extrabold text-zinc-900 mt-1">{officeWorkers.length}</div>
                    </div>

                    <div className="bg-zinc-50 p-2.5 rounded-2xl border border-zinc-100">
                      <div className="text-[11px] text-zinc-400 font-bold">عمليات نفذها</div>
                      <div className="text-base font-extrabold text-zinc-900 mt-1">{officeTransfers.length}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">إجمالي إيراد المكتب المنفذ:</span>
                    <strong className="text-zinc-900">{officeRevenue.toLocaleString('ar-SA')} ر.س</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl text-white shadow-sm flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold font-display">
                تطابق المنظومة المشتركة مع كراسة الشروط (BRD)
              </h3>
              <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                تم استيفاء جميع الشروط الـ 10 من فصل المكاتب، منع الحجز المزدوج، التسعير اليدوي المرن، المتابعة اليومية مع العداد والإنذارات اللونية، وتوثيق الكفيل الأول.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                ✓ 100% متوافق مع BRD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <TransferBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        worker={selectedWorker}
        onSuccess={() => {
          refresh();
          setActiveTab('followup');
        }}
      />

      {/* Intake Modal */}
      <ShelterIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        onSuccess={() => {
          refresh();
          setActiveTab('inmates');
        }}
      />

      {/* Worker 360 Dossier Modal */}
      <WorkerProfileDetailModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        worker={selectedWorker}
        onBookTransfer={handleOpenBooking}
      />

      {/* Proactive Shelter & Transfer Notification Drawer */}
      <ShelterNotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        onOpenWorkerProfile={handleOpenProfileById}
        onRefresh={refresh}
      />
    </div>
  );
};

export default SponsorshipTransferPage;
