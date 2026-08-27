import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { DASHBOARD_STATS_BY_PERIOD, MOCK_RECRUITMENT_CONTRACTS } from '../data/mockData';
import { SmaccDashboardWidget } from '../components/smacc/SmaccDashboardWidget';
import { 
  Building2, Plus, FileText, ShoppingBag, Users, BarChart3, 
  ArrowLeft, Home, DollarSign, PieChart, Handshake, ShoppingCart, 
  UserCheck, UserPlus, FileCheck, Headphones, Repeat, Hotel, 
  Radio, CheckCircle2, MessageSquare
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (href: string, title: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const stats = DASHBOARD_STATS_BY_PERIOD[selectedPeriod];

  return (
    <div className="space-y-6">
      {/* SMACC Structural Dashboard Replica */}
      <SmaccDashboardWidget />

      {/* Top Welcome Hero Banner with Period Filter */}
      <div
        className="card-feature-cinematic"
        style={{
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          background: '#000000',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          {/* Right Header Title & Greeting */}
          <div className="flex items-center gap-4">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                  مؤشرات فورية
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  محدث الآن - آخر تحديث اليوم
                </span>
              </div>
              <h2 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: 0, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
                مرحباً مجموعة خالد السليم 👋
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl font-sans leading-relaxed">
                تابع أداء العقود والطلبات والإيرادات لحظة بلحظة مع إمكانية التحكم الكامل في الأقسام والعمليات التشغيلية.
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('create-contract', 'إضافة عقد استقدام')}
              className="button-white-pill"
              style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
            >
              <Plus className="w-3.5 h-3.5 ml-1" />
              <span>عقد جديد</span>
            </button>
            <button
              onClick={() => onNavigate('orders', 'الطلبات المباشرة')}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              الطلبات المباشرة
            </button>
            <button
              onClick={() => onNavigate('branch-departments', 'إدارة الفرق')}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              إدارة الفرق
            </button>
            <button
              onClick={() => onNavigate('reports', 'مركز التقارير')}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              التقارير
            </button>
            <button
              onClick={() => onNavigate('finance-home', 'لوحة التحكم المالية')}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              المالية
            </button>
          </div>
        </div>

        {/* Live Period Filter Buttons & Today Sub-cards */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">تحديث القيم فوراً:</span>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
              {(['today', 'week', 'month', 'all'] as const).map((period) => {
                const labels: Record<string, string> = {
                  today: 'اليوم',
                  week: 'هذا الأسبوع',
                  month: 'هذا الشهر',
                  all: 'الإجمالي',
                };
                const isActive = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      border: 'none',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#000000' : '#ffffff',
                      fontWeight: isActive ? 600 : 420,
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {labels[period]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs">
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold">عقود اليوم:</span>
              <span className="font-mono font-bold text-emerald-300">{stats.todayContractsCount}</span>
            </div>

            <div className="bg-white/10 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-bold">طلبات اليوم:</span>
              <span className="font-mono font-bold text-blue-300">{stats.todayOrdersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation 3-Card Portal Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('shelter', 'إدارة الإيواء')}
          className="card-pricing flex items-center justify-between cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px 20px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 text-black flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black m-0">إدارة الإيواء</h4>
              <p className="text-[11px] text-zinc-500 m-0">الداخل والخارج والجاهز للنقل ومرحلة الترحيل</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </div>

        <div
          onClick={() => onNavigate('finance-home', 'لوحة التحكم المالية')}
          className="card-pricing flex items-center justify-between cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px 20px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 text-black flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black m-0">لوحة التحكم المالية</h4>
              <p className="text-[11px] text-zinc-500 m-0">ملخص الحسابات والفواتير والحركات المالية</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </div>

        <div
          onClick={() => onNavigate('reports', 'مركز التقارير')}
          className="card-pricing flex items-center justify-between cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px 20px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 text-black flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black m-0">مركز التقارير</h4>
              <p className="text-[11px] text-zinc-500 m-0">تقارير العقود والطلبات والإيواء والتصدير</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* 10 Main KPI Metrics Cards Grid */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {/* 1. جميع عقود الاستقدام */}
        <div
          onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">جميع عقود الاستقدام</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Handshake className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.recruitmentContracts.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-3/4 h-full bg-black rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>قبل الوصول: <strong className="text-black font-mono">{stats.recruitmentContracts.beforeArrival}</strong></span>
            <span>|</span>
            <span>وصول: <strong className="text-black font-mono">{stats.recruitmentContracts.arrivalStage}</strong></span>
            <span>|</span>
            <span>ضمان: <strong className="text-emerald-700 font-mono">{stats.recruitmentContracts.underGuarantee}</strong></span>
          </div>
        </div>

        {/* 2. طلبات الاستقدام (الحجوزات) */}
        <div
          onClick={() => onNavigate('orders', 'طلبات الاستقدام')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">طلبات الاستقدام</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.orders.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-4/5 h-full bg-emerald-600 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>جديدة: <strong className="text-emerald-700 font-mono">{stats.orders.newOrders}</strong></span>
            <span>|</span>
            <span>إجراء: <strong className="text-amber-700 font-mono">{stats.orders.inProgress}</strong></span>
            <span>|</span>
            <span>مكتملة: <strong className="text-black font-mono">{stats.orders.completed}</strong></span>
          </div>
        </div>

        {/* 3. عقود الإيجار */}
        <div
          onClick={() => onNavigate('rent-contracts', 'عقود التأجير')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">عقود الإيجار</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.rentContracts.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-1/2 h-full bg-black rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>نشطة: <strong className="text-emerald-700 font-mono">{stats.rentContracts.active}</strong></span>
            <span>|</span>
            <span>مرسلة: <strong className="text-black font-mono">{stats.rentContracts.sent}</strong></span>
            <span>|</span>
            <span>مكتملة: <strong className="text-zinc-600 font-mono">{stats.rentContracts.completed}</strong></span>
          </div>
        </div>

        {/* 4. سير عاملات الإيجار */}
        <div
          onClick={() => onNavigate('cvs-rental', 'سير عاملات الإيجار')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">سير عاملات الإيجار</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.rentMaids.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-1/2 h-full bg-amber-500 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>متاحة: <strong className="text-emerald-700 font-mono">{stats.rentMaids.available}</strong></span>
            <span>|</span>
            <span>في سير نشط: <strong className="text-amber-700 font-mono">{stats.rentMaids.activeRent}</strong></span>
          </div>
        </div>

        {/* 5. السير الذاتية */}
        <div
          onClick={() => onNavigate('create-cv', 'بنك السير الذاتية')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">السير الذاتية (CVs)</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.cvs.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-2/3 h-full bg-black rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>متاحة: <strong className="text-emerald-700 font-mono">{stats.cvs.available}</strong></span>
            <span>|</span>
            <span>محجوزة: <strong className="text-rose-700 font-mono">{stats.cvs.reserved}</strong></span>
          </div>
        </div>

        {/* 6. العملاء */}
        <div
          onClick={() => onNavigate('clients', 'جميع العملاء')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">العملاء</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.clients.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-1/3 h-full bg-zinc-800 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>لديهم طلبات: <strong className="text-emerald-700 font-mono">{stats.clients.withOrders}</strong></span>
            <span>|</span>
            <span>بدون طلبات: <strong className="text-zinc-600 font-mono">{stats.clients.withoutOrders}</strong></span>
          </div>
        </div>

        {/* 7. تفاويض إنجاز */}
        <div
          onClick={() => onNavigate('ingaz', 'تفاويض الإنجاز')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">تفاويض إنجاز</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.ingaz.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-full h-full bg-amber-500 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>تحت الإجراء: <strong className="text-amber-700 font-mono">{stats.ingaz.inProgress}</strong></span>
            <span>|</span>
            <span>معتمدة: <strong className="text-emerald-700 font-mono">{stats.ingaz.approved}</strong></span>
          </div>
        </div>

        {/* 8. الشكاوى */}
        <div
          onClick={() => onNavigate('complaints', 'إدارة الشكاوى')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">الشكاوى</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.complaints.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-1/2 h-full bg-rose-600 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>مفتوحة: <strong className="text-rose-700 font-mono">{stats.complaints.open}</strong></span>
            <span>|</span>
            <span>مغلقة: <strong className="text-emerald-700 font-mono">{stats.complaints.closed}</strong></span>
          </div>
        </div>

        {/* 9. طلبات نقل الكفالة */}
        <div
          onClick={() => onNavigate('sponsorship-transfer', 'نقل الكفالة')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">طلبات نقل الكفالة</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Repeat className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.sponsorshipTransfers.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-1/4 h-full bg-emerald-600 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>تجربة: <strong className="text-amber-700 font-mono">{stats.sponsorshipTransfers.trialPeriod}</strong></span>
            <span>|</span>
            <span>تم النقل: <strong className="text-emerald-700 font-mono">{stats.sponsorshipTransfers.transferred}</strong></span>
          </div>
        </div>

        {/* 10. داخل الإيواء */}
        <div
          onClick={() => onNavigate('shelter', 'إدارة الإيواء')}
          className="card-pricing cursor-pointer hover:border-black transition-all"
          style={{ padding: '18px', borderRadius: '16px', background: '#ffffff' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">داخل الإيواء</span>
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
              <Hotel className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-black mb-2 font-mono">
            {stats.shelter.total}
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <div className="w-3/4 h-full bg-black rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1">
            <span>بالداخل: <strong className="text-black font-mono">{stats.shelter.inside}</strong></span>
            <span>|</span>
            <span>بالخارج: <strong className="text-zinc-600 font-mono">{stats.shelter.outside}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Contracts Table & Operations Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Contracts Live View */}
        <div className="md:col-span-2 card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-black flex items-center gap-2 m-0">
                <Handshake className="w-4 h-4 text-emerald-600" />
                <span>أحدث عقود الاستقدام المعتمدة (مساند)</span>
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5 mb-0">
                متابعة فورية لمراحل الاستقدام، المكاتب الخارجية، والوصول
              </p>
            </div>
            <button
              className="button-outline-on-light"
              style={{ fontSize: '11px', padding: '4px 12px', minHeight: '28px' }}
              onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
            >
              <span>عرض جميع العقود</span>
              <ArrowLeft className="w-3 h-3 mr-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رقم العقد</th>
                  <th className="p-3.5">معلومات العميل</th>
                  <th className="p-3.5">العاملة</th>
                  <th className="p-3.5">المكتب الخارجي</th>
                  <th className="p-3.5">الفرع</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_RECRUITMENT_CONTRACTS.map((contract) => (
                  <tr key={contract.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5">
                      <strong className="font-mono text-black">{contract.contract_number}</strong>
                      <div className="text-[10px] text-zinc-400 font-mono">مساند: {contract.musaned_number}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{contract.client_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{contract.client_phone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{contract.maid_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{contract.nationality} • {contract.maid_passport}</div>
                    </td>
                    <td className="p-3.5 text-zinc-700 font-semibold">{contract.external_office}</td>
                    <td className="p-3.5">
                      <span className="pill-tag-shade" style={{ fontSize: '10px' }}>{contract.branch}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          contract.stage === 'مكتمل'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : contract.stage === 'وصول'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : contract.stage === 'تفييز'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {contract.stage}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
                        className="button-outline-on-light"
                        style={{ padding: '2px 8px', fontSize: '10.5px', minHeight: '24px' }}
                      >
                        التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operations & Alerts Feed */}
        <div className="space-y-4">
          {/* Quick Musaned Status Tracker */}
          <div className="card-pricing" style={{ padding: '20px', borderRadius: '24px', background: '#ffffff' }}>
            <h4 className="text-xs font-bold text-black mb-3 flex items-center gap-2 m-0">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>حالة الربط مع المنصات الحكومية</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs font-bold text-black">منصة مساند الحكومية</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">متصل وموثق</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs font-bold text-black">هيئة الزكاة (ZATCA Phase 2)</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">Fatoora نشط</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs font-bold text-black">منصة إنجاز والتأشيرات</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">جاهز للتفويض</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Portal */}
          <div className="card-pricing" style={{ padding: '20px', borderRadius: '24px', background: '#ffffff' }}>
            <h4 className="text-xs font-bold text-black mb-3 m-0">
              إجراءات تشغيلية سريعة
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('create-cv', 'إضافة سيرة ذاتية')}
                className="w-full text-right p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-black cursor-pointer flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                <span>إضافة سيرة ذاتية جديدة للبنك (136 حقل)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sponsorship-transfer', 'طلبات نقل الكفالة')}
                className="w-full text-right p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-black cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Repeat className="w-3.5 h-3.5 text-black" />
                <span>تسجيل طلب نقل كفالة وتنازل</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('whatsapp-inbox', 'محادثات واتساب')}
                className="w-full text-right p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-black cursor-pointer flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>فتح شات الواتساب والمحادثات الحية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
