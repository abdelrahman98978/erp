import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, ShieldCheck, HeartHandshake, AlertTriangle, 
  MousePointerClick, Smile, RefreshCw, Download, 
  Flame, Clock, CheckCircle2, User, Search, Filter, 
  Sparkles, Layers, ShieldAlert, FileSpreadsheet, Eye, 
  Info, BellRing, Settings, Sliders, MessageSquare, 
  BarChart3, ChevronRight, Zap
} from 'lucide-react';
import { 
  employeeMonitoringService, 
  DailyMoodRecord, 
  ActivityTelemetryEvent, 
  EmployeeMonitoringSummary, 
  MOOD_META, 
  REASON_CATEGORIES, 
  MoodType 
} from '../services/employeeMonitoringService';
import { DailyMoodCheckInModal } from '../components/monitoring/DailyMoodCheckInModal';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { useAppStore } from '../stores/appStore';
import { Badge } from '../components/ui/Badge';

export const EmployeeMonitoringPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'matrix' | 'mood_stream' | 'telemetry' | 'rules'>('matrix');
  const [summaries, setSummaries] = useState<EmployeeMonitoringSummary[]>([]);
  const [moodLogs, setMoodLogs] = useState<DailyMoodRecord[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<ActivityTelemetryEvent[]>([]);
  const [metrics, setMetrics] = useState({
    teamMoodScore: 4.2,
    activeRatio: 88,
    totalRageClicks: 3,
    securityAlertsCount: 2,
    activeEmployeesCount: 7
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('الكل');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('الكل');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Settings State for Rules Tab
  const [rulesConfig, setRulesConfig] = useState({
    rageClickThreshold: 3,
    idleAlertMinutes: 20,
    exportSecurityLimit: 50,
    consecutiveStressedDays: 3,
    notifyManagerOnBurnout: true,
    enableSelfDashboard: true,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sums, moods, tele, met] = await Promise.all([
        employeeMonitoringService.getMonitoringSummaries(),
        employeeMonitoringService.getMoodLogs(),
        employeeMonitoringService.getTelemetryEvents(),
        employeeMonitoringService.getOverallMetrics(),
      ]);
      setSummaries(sums);
      setMoodLogs(moods);
      setTelemetryEvents(tele);
      setMetrics(met);
    } catch (e) {
      console.error('Error loading monitoring data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // الاستماع لأي تحديثات حية
    const handleMoodUpdate = () => loadData();
    const handleTelemetryUpdate = () => loadData();

    window.addEventListener('employee-mood-updated', handleMoodUpdate);
    window.addEventListener('telemetry-event-added', handleTelemetryUpdate);

    return () => {
      window.removeEventListener('employee-mood-updated', handleMoodUpdate);
      window.removeEventListener('telemetry-event-added', handleTelemetryUpdate);
    };
  }, []);

  const handleSimulateRageClick = async () => {
    await employeeMonitoringService.recordTelemetryEvent({
      user_id: 'USR-CURRENT',
      user_name: 'موظف تجريبي (محاكاة)',
      role: 'أخصائي عمليات',
      branch: 'فرع الرياض',
      event_type: 'rage_click',
      target_element: 'button#simulated-action',
      target_label: 'محاكاة نقرة عصبية تجريبية',
      module: 'شاشة العقود',
      details: 'تم رصد 4 نقرات متتالية وسريعة خلال 0.6 ثانية نتيجة تجربة محاكاة الرصد الذكي.',
      severity: 'warning'
    });
    addNotification({
      title: 'رصد نقرة عصبية (Rage Click Alert)',
      message: 'تم التقاط محاكاة نقرات عصبية سريعة بنجاح وتوثيقها في رادار المراقبة.',
      type: 'warning',
    });
    loadData();
  };

  const filteredSummaries = useMemo(() => {
    return summaries.filter(s => {
      const matchSearch = s.user_name.includes(searchQuery) || s.role.includes(searchQuery) || s.branch.includes(searchQuery);
      const matchBranch = selectedBranch === 'الكل' || s.branch === selectedBranch;
      const matchMood = selectedMoodFilter === 'الكل' || s.latest_mood === selectedMoodFilter;
      return matchSearch && matchBranch && matchMood;
    });
  }, [summaries, searchQuery, selectedBranch, selectedMoodFilter]);

  const filteredMoodLogs = useMemo(() => {
    return moodLogs.filter(m => {
      const matchSearch = m.user_name.includes(searchQuery) || (m.note && m.note.includes(searchQuery));
      const matchBranch = selectedBranch === 'الكل' || m.branch === selectedBranch;
      const matchMood = selectedMoodFilter === 'الكل' || m.mood === selectedMoodFilter;
      return matchSearch && matchBranch && matchMood;
    });
  }, [moodLogs, searchQuery, selectedBranch, selectedMoodFilter]);

  const branches = ['الكل', 'المقر الرئيسي', 'فرع الرياض الرئيسي', 'فرع الرياض', 'فرع جدة', 'فرع الدمام', 'فرع الخبر', 'مركز إيواء الرياض الرئيسي'];

  return (
    <div className="space-y-6">
      {/* 1. Cinematic Hero Header */}
      <div
        className="card-feature-cinematic"
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #111827 50%, #064e3b 100%)',
          borderRadius: '18px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div 
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Activity className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CLICKSTREAM & EMOTION INTELLIGENCE
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                  رصد الإنتاجية ونبض المشاعر
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white m-0">
                منظومة متابعة النقرات والمشاعر والمراقبة الذكية
              </h1>
              <p className="text-xs text-zinc-300 mt-1 max-w-2xl font-sans">
                تتبع متوازن لنشاط الموظفين داخل النظام، كشف فترات الخمول والإنهاك، رصد النقرات العصبية (Rage Clicks)، وحماية أمن البيانات (DLP).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsMoodModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-all transform active:scale-95"
            >
              <Smile className="w-4 h-4" />
              <span>تسجيل حالتي اليوم 😊</span>
            </button>
            <button
              onClick={handleSimulateRageClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 rounded-xl transition-all"
              title="محاكاة نقرة عصبية لاختبار استجابة الرادار"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>محاكاة نقرة عصبية</span>
            </button>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>تحديث</span>
            </button>
            <ExportDropdown
              sectionKey="employee_monitoring"
              data={summaries}
              customTitle="تقرير مراقبة وإنتاجية الموظفين ونبض المشاعر"
              variant="outline-dark"
              buttonLabel="تصدير التقرير الرقابي"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Mood Index */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              مؤشر عافية ورضا الفريق
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {metrics.teamMoodScore}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              من 5.0 (مرتفع وإيجابي)
            </span>
          </div>
          <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
              style={{ width: `${(metrics.teamMoodScore / 5) * 100}%` }} 
            />
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            بناءً على تقييمات نبض الدوام الصباحي
          </span>
        </div>

        {/* Metric 2: Active vs Idle Ratio */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              معدل النشاط الفعّال (Active Rate)
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {metrics.activeRatio}%
            </span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              مقابل 12% فترات خمول
            </span>
          </div>
          <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
              style={{ width: `${metrics.activeRatio}%` }} 
            />
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            حركة إدخال وتفاعل بالماوس والكيبورد بالـ ERP
          </span>
        </div>

        {/* Metric 3: Rage Clicks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              رادار النقرات العصبية (Rage Clicks)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {metrics.totalRageClicks}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              حالات رُصدت اليوم
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>معظمها في شاشة مزامنة منصة مساند</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            إشارة لحاجة النظام لتسريع السيرفر أو تبسيط الزر
          </span>
        </div>

        {/* Metric 4: Security & DLP Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              تنبيهات أمن البيانات (DLP Alerts)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-500">
              {metrics.securityAlertsCount}
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              تصدير بيانات حساسة
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>تم التوثيق وتحديد عناوين الـ IP للمستخدمين</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            رصد تصدير أكثر من 50 عميل في دفعة واحدة
          </span>
        </div>
      </div>

      {/* 3. Filter Bar & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>رادار الفريق والإنتاجية ({filteredSummaries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('mood_stream')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'mood_stream'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-cyan-500" />
            <span>سجل النبض والمشاعر ({filteredMoodLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'telemetry'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
            <span>تتبع النقرات والتنبيهات الحية ({telemetryEvents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'rules'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>قواعد وضوابط المراقبة</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث بالموظف، الدور، أو الفرع..."
              className="pl-3 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedMoodFilter}
            onChange={e => setSelectedMoodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="الكل">جميع الحالات المزاجية</option>
            <option value="thrilled">🤩 متحمس ومنجز</option>
            <option value="happy">😊 مرتاح ومستقر</option>
            <option value="neutral">😐 عادي / روتيني</option>
            <option value="stressed">😫 مضغوط ومشتت</option>
            <option value="frustrated">😡 محبط / يواجه عقبات</option>
          </select>
        </div>
      </div>

      {/* TAB 1: Team Monitoring Matrix */}
      {activeTab === 'matrix' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                مصفوفة إنتاجية الموظفين ورصد الاحتراق الوظيفي
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                مقارنة دقيقة تجمع بين زمن النشاط الفعلي، النقرات العصبية، ومعدل إنجاز المعاملات.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              تحديث حي مستمر
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-850/60 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-3.5">الموظف / الدور</th>
                  <th className="p-3.5">الفرع</th>
                  <th className="p-3.5">الحالة المزاجية اليوم</th>
                  <th className="p-3.5">النشاط الفعّال مقابل الخمول</th>
                  <th className="p-3.5">إجمالي النقرات</th>
                  <th className="p-3.5">النقرات العصبية</th>
                  <th className="p-3.5">سرعة الإنجاز (معاملات)</th>
                  <th className="p-3.5">خطر الاحتراق الوظيفي</th>
                  <th className="p-3.5 text-center">إجراء المتابعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredSummaries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-zinc-400">
                      لا توجد سجلات موظفين تطابق معايير البحث المحددة.
                    </td>
                  </tr>
                ) : (
                  filteredSummaries.map(emp => {
                    const moodItem = MOOD_META[emp.latest_mood];
                    const totalMins = emp.active_time_mins + emp.idle_time_mins;
                    const activePct = Math.round((emp.active_time_mins / (totalMins || 1)) * 100);

                    return (
                      <tr key={emp.user_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {emp.user_name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900 dark:text-white">
                                {emp.user_name}
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                {emp.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-zinc-600 dark:text-zinc-300">
                          {emp.branch}
                        </td>

                        <td className="p-3.5">
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                            style={{ 
                              background: `${moodItem.color}15`, 
                              color: moodItem.color,
                              border: `1px solid ${moodItem.color}35`
                            }}
                          >
                            <span>{moodItem.emoji}</span>
                            <span>{moodItem.label}</span>
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="w-36">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {Math.floor(emp.active_time_mins / 60)}س {emp.active_time_mins % 60}د
                              </span>
                              <span className="text-zinc-400">
                                خمول: {emp.idle_time_mins}د
                              </span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-emerald-500 rounded-l-full" 
                                style={{ width: `${activePct}%` }}
                                title={`نشاط: ${activePct}%`}
                              />
                              <div 
                                className="h-full bg-amber-400 rounded-r-full" 
                                style={{ width: `${100 - activePct}%` }}
                                title={`خمول: ${100 - activePct}%`}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono text-zinc-700 dark:text-zinc-300">
                          {emp.total_clicks.toLocaleString()}
                        </td>

                        <td className="p-3.5">
                          {emp.rage_clicks_count > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                              <Zap className="w-3 h-3" />
                              {emp.rage_clicks_count}
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-mono">0</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 font-bold text-zinc-900 dark:text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                            {emp.tasks_velocity} معاملة
                          </span>
                        </td>

                        <td className="p-3.5">
                          {emp.burnout_risk === 'مرتفع' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                              مرتفع (بحاجة مساندة)
                            </span>
                          )}
                          {emp.burnout_risk === 'متوسط' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                              متوسط (تحت المتابعة)
                            </span>
                          )}
                          {emp.burnout_risk === 'منخفض' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              مستقر ومريح
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              addNotification({
                                title: `جلسة استماع 1-on-1 مع ${emp.user_name}`,
                                message: `تم جدولة إشعار للدعم والمساعدة الإدارية مع الموظف في ${emp.branch}.`,
                                type: 'info',
                              });
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg border border-emerald-500/30 transition-colors"
                          >
                            جلسة مساندة
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Mood Pulse Stream */}
      {activeTab === 'mood_stream' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMoodLogs.map(log => {
              const moodItem = MOOD_META[log.mood];
              return (
                <div 
                  key={log.id} 
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <div 
                    className="absolute top-0 inset-x-0 h-1" 
                    style={{ background: moodItem.color }} 
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {moodItem.emoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                          {log.user_name}
                        </h4>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {log.role} — {log.branch}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold" style={{ color: moodItem.color }}>
                        {moodItem.label}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md">
                        {REASON_CATEGORIES[log.reason_category]}
                      </span>
                    </div>

                    {log.note ? (
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 leading-relaxed font-sans">
                        "{log.note}"
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        لم يتم تدوين ملاحظات إضافية.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Telemetry Stream */}
      {activeTab === 'telemetry' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                سجل تدفق الأحداث الحية والنقرات والتنبيهات
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                تسجيل مستمر لأحداث النقرات المتكررة، فترات الخمول، وتصدير الملفات الضخمة.
              </p>
            </div>
            <button
              onClick={handleSimulateRageClick}
              className="px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              + محاكاة حدث
            </button>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[500px] overflow-y-auto">
            {telemetryEvents.map(evt => (
              <div key={evt.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {evt.event_type === 'rage_click' && (
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                    )}
                    {evt.event_type === 'data_export' && (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                    )}
                    {evt.event_type === 'prolonged_idle' && (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                    )}
                    {evt.event_type !== 'rage_click' && evt.event_type !== 'data_export' && evt.event_type !== 'prolonged_idle' && (
                      <div className="w-8 h-8 rounded-lg bg-zinc-500/15 text-zinc-400 flex items-center justify-center">
                        <MousePointerClick className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {evt.user_name}
                      </span>
                      <span className="text-zinc-400 text-xs">({evt.role} — {evt.branch})</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        evt.severity === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                        evt.severity === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {evt.target_label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed font-sans">
                      {evt.details}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                      الوحدة: {evt.module} | المعرف: {evt.id}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono text-zinc-400 shrink-0">
                  {evt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Rules & Monitoring Governance */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                إعدادات عتبات التنبيه الرقابي التلقائي
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                تخصيص قواعد استشعار الضغط الوظيفي وحماية أمن البيانات في المنظومة.
              </p>

              <div className="space-y-4">
                {/* Rule 1: Rage Click Threshold */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      عتبة رصد النقرات العصبية (Rage Click Threshold)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      عدد النقرات المتتالية على نفس الزر في ثانية واحدة لإطلاق تنبيه بطء/تعثر.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={rulesConfig.rageClickThreshold}
                      onChange={e => setRulesConfig({ ...rulesConfig, rageClickThreshold: Number(e.target.value) })}
                      className="w-16 px-2 py-1 text-xs text-center font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                    />
                    <span className="text-xs text-zinc-500">نقرات/ثانية</span>
                  </div>
                </div>

                {/* Rule 2: Idle Alert Minutes */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      مهلة تسجيل الخمول المطول (Idle Inactivity Threshold)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      المدة الزمنية التي إذا توقف فيها تفاعل الموظف يتم احتسابها كفترة خمول.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={rulesConfig.idleAlertMinutes}
                      onChange={e => setRulesConfig({ ...rulesConfig, idleAlertMinutes: Number(e.target.value) })}
                      className="w-16 px-2 py-1 text-xs text-center font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                    />
                    <span className="text-xs text-zinc-500">دقيقة</span>
                  </div>
                </div>

                {/* Rule 3: Export DLP Limit */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      حد الأمان لمنع تسريب البيانات (DLP Export Limit)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      عدد السجلات المصدرة في ملف واحد التي تستوجب إشعاراً أمنياً للمدير.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={500}
                      value={rulesConfig.exportSecurityLimit}
                      onChange={e => setRulesConfig({ ...rulesConfig, exportSecurityLimit: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-xs text-center font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                    />
                    <span className="text-xs text-zinc-500">سجل</span>
                  </div>
                </div>

                {/* Toggle: Burnout Notification */}
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      التنبيه التلقائي للمدير عند تكرار مشاعر الضغط (Burnout Alert)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      إرسال إشعار فوري لجدولة جلسة دعم 1-on-1 إذا سجل الموظف إجهاداً لـ 3 أيام متتالية.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={rulesConfig.notifyManagerOnBurnout}
                    onChange={e => setRulesConfig({ ...rulesConfig, notifyManagerOnBurnout: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    addNotification({
                      title: 'حفظ قواعد وضوابط المراقبة',
                      message: 'تم تحديث عتبات الاستشعار الرقابي وتطبيقها على جميع شاشات المجموعة.',
                      type: 'success',
                    });
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition-colors"
                >
                  حفظ وتفعيل القواعد
                </button>
              </div>
            </div>
          </div>

          {/* Ethics & Legal Governance Card */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">
                ميثاق المراقبة الأخلاقية والمهنية
              </h3>
            </div>
            
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              تم تصميم هذه المنظومة وفق معايير الحوكمة الرشيدة التي تضمن زيادة كفاءة العمل وحماية صحة الموظفين:
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>منع الكيلوجر (No Keylogging):</strong> لا يتم تسجيل ضربات المفاتيح الشخصية للمحافظة على سرية الموظف.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>التركيز على المخرجات:</strong> المراقبة تقيس المعاملات المنجزة والتعثر التقني وليس العقاب على الحركة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>حماية أمن المؤسسة:</strong> رصد فوري لتسريب قوائم العملاء والعقود حمايةً للأصول الرقمية.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>التدخل الداعم:</strong> تحويل إشارات الإجهاد إلى جلسات مساندة وتخفيف للأعباء بدلاً من التوبيخ.</span>
              </li>
            </ul>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-zinc-300">
              💡 <em>"المراقبة الذكية تُبنى على تعزيز الثقة وتذليل العقبات، لا على التجسس وهدم المعنويات."</em>
            </div>
          </div>
        </div>
      )}

      {/* Mood Check-In Modal */}
      <DailyMoodCheckInModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        currentUser={{
          id: 'USR-ADMIN-01',
          full_name: 'مشرف الإدارة المركزية (خالد السليم)',
          role: 'المدير العام',
          branch: 'المقر الرئيسي',
        }}
        onSaved={() => {
          loadData();
          addNotification({
            title: 'تم تسجيل النبض والمشاعر بنجاح',
            message: 'شكراً لمشاركتك حالتك اليوم، تم تحديث رادار عافية الفريق فوراً.',
            type: 'success',
          });
        }}
      />
    </div>
  );
};

export default EmployeeMonitoringPage;
