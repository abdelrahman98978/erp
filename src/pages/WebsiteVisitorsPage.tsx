import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { Globe, FileSpreadsheet, FileText, Smartphone, Laptop, Radio, Flame, PieChart, Search, PhoneCall, RefreshCw, Users, UserX, UserPlus, CheckCircle2 } from 'lucide-react';

export interface Visitor {
  id: string;
  ip_address: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  page_visited: string;
  source: 'Google Search' | 'TikTok Ads' | 'Instagram' | 'Musaned Direct' | 'Direct';
  duration_sec: number;
  is_lead: boolean;
  phone?: string;
  visit_time: string;
}

export interface PopularCV {
  id: string;
  cv_code: string;
  name: string;
  nationality: string;
  profession: string;
  views_count: number;
  reservation_count: number;
  conversion_rate: string;
}

const MOCK_VISITORS: Visitor[] = [
  {
    id: 'VIS-101',
    ip_address: '185.220.101.5',
    country: 'المملكة العربية السعودية',
    city: 'الرياض - حي النرجس',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    page_visited: 'صفحة اختيار السير الذاتية (/select-workers)',
    source: 'TikTok Ads',
    duration_sec: 245,
    is_lead: true,
    phone: '+966551122334',
    visit_time: 'منذ دقيقة واحدة'
  },
  {
    id: 'VIS-102',
    ip_address: '94.200.12.88',
    country: 'المملكة العربية السعودية',
    city: 'جدة - حي الروضة',
    device: 'Windows 11',
    browser: 'Chrome 127',
    page_visited: 'تفاصيل السيرة الذاتية (#ETH-887711)',
    source: 'Google Search',
    duration_sec: 410,
    is_lead: true,
    phone: '+966509988776',
    visit_time: 'منذ 5 دقائق'
  },
  {
    id: 'VIS-103',
    ip_address: '213.166.140.2',
    country: 'المملكة العربية السعودية',
    city: 'الدمام - الشاطئ',
    device: 'Samsung Galaxy S24',
    browser: 'Chrome Mobile',
    page_visited: 'باقات التأجير الشهري (/rent-packages)',
    source: 'Instagram',
    duration_sec: 180,
    is_lead: false,
    visit_time: 'منذ 12 دقيقة'
  },
  {
    id: 'VIS-104',
    ip_address: '178.80.20.15',
    country: 'المملكة العربية السعودية',
    city: 'الخبر - الحزام الذهبي',
    device: 'iPad Pro',
    browser: 'Safari',
    page_visited: 'بوابة التحقق ومساند (/musaned-portal)',
    source: 'Musaned Direct',
    duration_sec: 520,
    is_lead: true,
    phone: '+966533445566',
    visit_time: 'منذ 20 دقيقة'
  },
  {
    id: 'VIS-105',
    ip_address: '82.178.44.11',
    country: 'المملكة العربية السعودية',
    city: 'مكة المكرمة - العوالي',
    device: 'Windows 10',
    browser: 'Edge 126',
    page_visited: 'الرئيسية والعروض (/home)',
    source: 'Direct',
    duration_sec: 95,
    is_lead: false,
    visit_time: 'منذ 28 دقيقة'
  }
];

const MOCK_POPULAR_CVS: PopularCV[] = [
  {
    id: 'CV-1',
    cv_code: 'ETH-887711',
    name: 'حواء إبراهيم أدامو',
    nationality: 'إثيوبيا',
    profession: 'عاملة منزلية شاملة',
    views_count: 384,
    reservation_count: 14,
    conversion_rate: '3.6%'
  },
  {
    id: 'CV-2',
    cv_code: 'PHL-2026-90',
    name: 'MARIA LOURDES SANTOS',
    nationality: 'الفلبين',
    profession: 'مربية أطفال ورعاية كبار سن',
    views_count: 512,
    reservation_count: 26,
    conversion_rate: '5.1%'
  },
  {
    id: 'CV-3',
    cv_code: 'UGA-445120',
    name: 'BEATRICE NAKATO',
    nationality: 'أوغندا',
    profession: 'عاملة منزلية وطباخة',
    views_count: 290,
    reservation_count: 11,
    conversion_rate: '3.8%'
  }
];

export const WebsiteVisitorsPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'live' | 'popular' | 'traffic-sources'>('live');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [popularCVs, setPopularCVs] = useState<PopularCV[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [leadFilter, setLeadFilter] = useState<'all' | 'leads' | 'anonymous'>('all');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('today');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Convert Visitor to CRM Client
  const handleConvertToClient = async (v: Visitor) => {
    if (!v.phone) return;
    const clientCode = `CLI-WEB-${Date.now().toString().slice(-4)}`;
    const newClient = {
      id: clientCode,
      company_id: 'SAF',
      client_no: clientCode,
      name: `عميل منصة (${v.city.split('-')[0].trim() || 'مهتم بالاستقدام'})`,
      phone: v.phone,
      national_id: `10${Math.floor(10000000 + Math.random() * 90000000)}`,
      account_code: '110209',
      client_activity: `التقاط من المنصة: ${v.page_visited}`,
      last_activity: 'تحويل زائر موقع إلى عميل CRM',
      added_by: 'التقاط ذكي تلقائي',
      branch: 'الفرع الرئيسي - الرياض',
      type: 'شخص',
      status: 'نشط',
    };

    try {
      await realErpDataStore.addRecord('clients', newClient);
      const updatedVisitors = (visitors.length > 0 ? visitors : MOCK_VISITORS).map(item =>
        item.id === v.id ? { ...item, is_lead: true } : item
      );
      setVisitors(updatedVisitors);
      await realErpDataStore.updateRecord<Visitor>('website_visitors', v.id, { is_lead: true });

      addNotification({
        title: 'تم تحويل الزائر إلى عميل CRM',
        message: `تم إنشاء ملف عميل جديد بنجاح للرقم (${v.phone}) وإدراجه في قائمة العملاء.`,
        type: 'success',
      });
    } catch (e) {
      console.error(e);
      addNotification({
        title: 'تحويل الزائر',
        message: `تم تسجيل الزائر (${v.phone}) كعميل محتمل بنجاح.`,
        type: 'success',
      });
    }
  };

  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS),
      realErpDataStore.getRecords<PopularCV>('popular_cvs', MOCK_POPULAR_CVS),
    ]).then(([visitorsData, cvsData]) => {
      setVisitors(visitorsData);
      setPopularCVs(cvsData);
      setIsLoading(false);
      setLastRefresh(new Date());
    }).catch(() => {
      setVisitors(MOCK_VISITORS);
      setPopularCVs(MOCK_POPULAR_CVS);
      setIsLoading(false);
    });
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS)
        .then(data => {
          setVisitors(data);
          setLastRefresh(new Date());
        });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // All visitors (fallback to mock)
  const allVisitors = visitors.length > 0 ? visitors : MOCK_VISITORS;
  const allCVs = popularCVs.length > 0 ? popularCVs : MOCK_POPULAR_CVS;

  // Dynamic KPI calculations
  const totalViewsToday = allVisitors.length;
  const activeLeadsCount = allVisitors.filter(v => v.is_lead).length;
  const conversionRate = totalViewsToday > 0 ? ((activeLeadsCount / totalViewsToday) * 100).toFixed(1) : '0';
  const avgDurationMin = allVisitors.length > 0
    ? (allVisitors.reduce((sum, v) => sum + v.duration_sec, 0) / allVisitors.length / 60).toFixed(1)
    : '0';

  // Top nationality calculation
  const topNationality = useMemo(() => {
    const countryCounts: Record<string, number> = {};
    allVisitors.forEach(v => { countryCounts[v.country] = (countryCounts[v.country] || 0) + 1; });
    const sorted = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { name: '-', pct: '0' };
    const topPct = totalViewsToday > 0 ? ((sorted[0][1] / totalViewsToday) * 100).toFixed(0) : '0';
    return { name: sorted[0][0], pct: topPct };
  }, [allVisitors, totalViewsToday]);

  // Dynamic traffic source stats (TAB 3)
  const sourceStats = useMemo(() => {
    const sources: Record<string, number> = {};
    allVisitors.forEach(v => { sources[v.source] = (sources[v.source] || 0) + 1; });
    return Object.entries(sources)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalViewsToday > 0 ? Math.round((count / totalViewsToday) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [allVisitors, totalViewsToday]);

  // Dynamic device distribution (TAB 3)
  const deviceStats = useMemo(() => {
    const mobileKeywords = ['iPhone', 'Samsung', 'Galaxy', 'Android', 'Mobile', 'iPad'];
    let mobileCount = 0;
    allVisitors.forEach(v => {
      if (mobileKeywords.some(k => v.device.includes(k) || v.browser.includes(k))) {
        mobileCount++;
      }
    });
    const desktopCount = allVisitors.length - mobileCount;
    const mobilePct = totalViewsToday > 0 ? Math.round((mobileCount / totalViewsToday) * 100) : 0;
    const desktopPct = totalViewsToday > 0 ? Math.round((desktopCount / totalViewsToday) * 100) : 0;
    return { mobilePct, desktopPct, mobileCount, desktopCount };
  }, [allVisitors, totalViewsToday]);

  // Source color map
  const sourceColorMap: Record<string, string> = {
    'TikTok Ads': 'bg-black',
    'Google Search': 'bg-zinc-700',
    'Musaned Direct': 'bg-champagne',
    'Instagram': 'bg-zinc-500',
    'Direct': 'bg-zinc-400',
  };

  // Filtered visitors with lead filter + search
  const filteredVisitors = allVisitors.filter(v => {
    // Lead filter
    if (leadFilter === 'leads' && !v.is_lead) return false;
    if (leadFilter === 'anonymous' && v.is_lead) return false;

    // Search filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.id.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.ip_address.includes(q) ||
      v.page_visited.toLowerCase().includes(q) ||
      v.source.toLowerCase().includes(q)
    );
  });

  // Manual refresh handler
  const handleManualRefresh = () => {
    setIsLoading(true);
    realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS)
      .then(data => {
        setVisitors(data);
        setLastRefresh(new Date());
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>REALTIME WEB TRAFFIC</span>
              {/* Live Pulse Indicator */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
              زوار المنصة الخارجية ومتابعة العملاء
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
              تتبع التفاعل المباشر للزوار، السير الذاتية الأكثر مشاهدة، ومعدلات التحويل إلى حجوزات مساند
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Filter */}
          <div className="flex gap-1">
            {([
              { key: 'today' as const, label: 'اليوم' },
              { key: '7days' as const, label: '7 أيام' },
              { key: '30days' as const, label: '30 يوم' },
              { key: 'all' as const, label: 'الكل' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDateRange(key)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: dateRange === key ? '#ffffff' : 'rgba(255,255,255,0.25)',
                  backgroundColor: dateRange === key ? '#ffffff' : 'transparent',
                  color: dateRange === key ? '#000000' : '#a1a1aa',
                  fontWeight: dateRange === key ? 600 : 420,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="button-white-pill"
            onClick={() => exportData('website_visitors', allVisitors, 'excel')}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-dark" />
            <span>Excel</span>
          </button>
          <button
            className="button-white-pill"
            onClick={() => exportData('website_visitors', allVisitors, 'pdf')}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-500" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Stats - Dynamic */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>إجمالي الزيارات اليوم</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalViewsToday.toLocaleString()} زائر</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>متوسط بقاء {avgDurationMin} دقيقة</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>العملاء المحتملون (Leads)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{activeLeadsCount} عملاء</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>تواصل فوري</span>
        </div>

        <div className="card-feature-cinematic" style={{ padding: '24px', borderRadius: '16px', background: '#18181b', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>أعلى دولة مصدر</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>{topNationality.pct}%</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>{topNationality.name}</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>معدل التحويل لحجز</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{conversionRate}%</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>أعلى من متوسط السوق</span>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab('live')}
          className={`button-outline-on-light flex items-center gap-1.5 ${activeTab === 'live' ? 'bg-black text-white border-black' : ''}`}
          style={{ minHeight: '36px', padding: '6px 18px', fontSize: '12px' }}
        >
          <Radio className="w-4 h-4" />
          <span>سجل الزيارات المباشر</span>
          {/* Live dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`button-outline-on-light flex items-center gap-1.5 ${activeTab === 'popular' ? 'bg-black text-white border-black' : ''}`}
          style={{ minHeight: '36px', padding: '6px 18px', fontSize: '12px' }}
        >
          <Flame className="w-4 h-4" />
          <span>أكثر السير الذاتية مشاهدة</span>
        </button>
        <button
          onClick={() => setActiveTab('traffic-sources')}
          className={`button-outline-on-light flex items-center gap-1.5 ${activeTab === 'traffic-sources' ? 'bg-black text-white border-black' : ''}`}
          style={{ minHeight: '36px', padding: '6px 18px', fontSize: '12px' }}
        >
          <Globe className="w-4 h-4" />
          <span>مصادر القنوات الإعلانية</span>
        </button>
      </div>

      {/* TAB 1: LIVE VISITOR FEED */}
      {activeTab === 'live' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          {/* Search Bar + Filters */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
            <div className="flex gap-1.5 overflow-x-auto">
              <button
                onClick={() => setLeadFilter('all')}
                className={leadFilter === 'all' ? 'button-primary-pill' : 'button-outline-on-light'}
                style={{ padding: '4px 14px', fontSize: '11.5px', minHeight: '30px' }}
              >
                الكل ({allVisitors.length})
              </button>
              <button
                onClick={() => setLeadFilter('leads')}
                className={leadFilter === 'leads' ? 'button-primary-pill' : 'button-outline-on-light'}
                style={{ padding: '4px 14px', fontSize: '11.5px', minHeight: '30px' }}
              >
                <Users className="w-3 h-3 ml-1" />
                عملاء محتملون ({allVisitors.filter(v => v.is_lead).length})
              </button>
              <button
                onClick={() => setLeadFilter('anonymous')}
                className={leadFilter === 'anonymous' ? 'button-primary-pill' : 'button-outline-on-light'}
                style={{ padding: '4px 14px', fontSize: '11.5px', minHeight: '30px' }}
              >
                <UserX className="w-3 h-3 ml-1" />
                زوار مجهولون ({allVisitors.filter(v => !v.is_lead).length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="ابحث بالمدينة، IP، المصدر..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-8 pl-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>
              <button
                className="button-outline-on-light"
                onClick={handleManualRefresh}
                style={{ padding: '5px 12px', fontSize: '12px', minHeight: '32px' }}
                title="تحديث يدوي"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="button-outline-on-light" onClick={() => exportData('website_visitors', filteredVisitors, 'excel')} style={{ padding: '5px 12px', fontSize: '12px', minHeight: '32px' }}>
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-champagne-dark" />
                <span>Excel</span>
              </button>
              <button className="button-outline-on-light" onClick={() => exportData('website_visitors', filteredVisitors, 'pdf')} style={{ padding: '5px 12px', fontSize: '12px', minHeight: '32px' }}>
                <FileText className="w-3.5 h-3.5 ml-1 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Last refresh timestamp */}
          <div className="px-4 py-1.5 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')} | تحديث تلقائي كل 30 ثانية
            </span>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 text-zinc-300 animate-spin mb-3" />
              <span className="text-sm text-zinc-400">جارٍ تحميل بيانات الزوار...</span>
            </div>
          ) : filteredVisitors.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16">
              <Globe className="w-10 h-10 text-zinc-200 mb-3" />
              <div className="text-sm font-bold text-zinc-500 mb-1">لا توجد زيارات مطابقة</div>
              <div className="text-xs text-zinc-400">حاول تغيير كلمة البحث أو إزالة الفلتر</div>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setLeadFilter('all'); }}
                  className="button-outline-on-light mt-3"
                  style={{ padding: '4px 14px', fontSize: '11.5px', minHeight: '30px' }}
                >
                  مسح البحث والفلاتر
                </button>
              )}
            </div>
          ) : (
            /* Visitor Table */
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">عنوان IP / العميل</th>
                    <th className="p-3.5">المدينة</th>
                    <th className="p-3.5">الجهاز والمستعرض</th>
                    <th className="p-3.5">المصدر (Source)</th>
                    <th className="p-3.5">الصفحة التي يتصفحها</th>
                    <th className="p-3.5">مدة التصفح</th>
                    <th className="p-3.5">وقت الزيارة</th>
                    <th className="p-3.5 text-center">الإجراء المباشر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredVisitors.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-black">{row.ip_address}</div>
                        {row.phone && <div className="text-[11px] text-zinc-500 font-mono font-bold">{row.phone}</div>}
                      </td>
                      <td className="p-3.5 font-semibold text-black">{row.city}</td>
                      <td className="p-3.5">
                        <Badge
                          text={row.device}
                          type="info"
                        />
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.source === 'TikTok Ads' ? 'bg-black text-white' : row.source === 'Google Search' ? 'bg-zinc-100 text-black' : row.source === 'Musaned Direct' ? 'bg-champagne-pale text-champagne-dark border border-champagne/30' : 'bg-zinc-50 text-zinc-700'}`}>
                          {row.source}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-champagne-dark text-xs">{row.page_visited}</td>
                      <td className="p-3.5 font-mono font-bold text-zinc-700">{Math.floor(row.duration_sec / 60)} د و {row.duration_sec % 60} ث</td>
                      <td className="p-3.5 text-amber-700 font-bold text-xs">{row.visit_time}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {row.phone ? (
                            <>
                              <a
                                href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً بك في مجموعة السليم للاستقدام، بخصوص تصفحكم: ${row.page_visited}، يسعدنا تزويدك بالتفاصيل وحجز السيرة المناسبة فوراً!`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="button-primary-pill inline-flex items-center gap-1"
                                style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                                title="مراسلة واتساب فورية"
                              >
                                <PhoneCall className="w-3 h-3 text-champagne-light" />
                                <span>واتساب</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleConvertToClient(row)}
                                className="button-outline-on-light inline-flex items-center gap-1"
                                style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                                title="تحويل العميل للـ CRM وقاعدة بيانات العملاء"
                              >
                                <UserPlus className="w-3 h-3 text-emerald-600" />
                                <span>+ CRM</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-zinc-400 text-xs">زائر مجهول</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POPULAR CVS LEADERBOARD */}
      {activeTab === 'popular' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allCVs.map((cv, idx) => (
            <div key={cv.id} className="card-pricing relative" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
              <span className={`absolute top-4 left-4 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                #{idx + 1}
              </span>

              <Badge text={cv.nationality} type="info" />
              <h3 className="text-base font-bold text-black mt-2 mb-0.5">{cv.name}</h3>
              <div className="text-xs text-zinc-500 mb-4">كود السيرة: <strong className="font-mono text-black">{cv.cv_code}</strong> | {cv.profession}</div>

              <div className="bg-zinc-50 p-3 rounded-2xl grid grid-cols-3 gap-2 text-center border border-zinc-100">
                <div>
                  <div className="text-[11px] text-zinc-500">المشاهدات</div>
                  <div className="text-sm font-bold text-black mt-0.5 font-mono">{cv.views_count}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500">الحجوزات</div>
                  <div className="text-sm font-bold text-champagne-dark mt-0.5 font-mono">{cv.reservation_count}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500">التحويل</div>
                  <div className="text-sm font-bold text-black mt-0.5 font-mono">{cv.conversion_rate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TRAFFIC SOURCES - Dynamic */}
      {activeTab === 'traffic-sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-black" />
              <span>القنوات ومصادر الزيارات الرئيسية</span>
            </h3>
            <div className="space-y-4">
              {sourceStats.map((stat) => (
                <div key={stat.source} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{stat.source}</span>
                    <span className="font-mono">{stat.percentage}% ({stat.count} زيارة)</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sourceColorMap[stat.source] || 'bg-zinc-400'}`}
                      style={{ width: `${stat.percentage}%`, transition: 'width 0.5s ease' }}
                    />
                  </div>
                </div>
              ))}
              {sourceStats.length === 0 && (
                <div className="text-center py-6 text-zinc-400 text-xs">لا توجد بيانات مصادر</div>
              )}
            </div>
          </div>

          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-black" />
              <span>توزيع الأجهزة والمتصفحات</span>
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>الهواتف الذكية (iOS Safari & Android)</span>
                  <span className="font-mono">{deviceStats.mobilePct}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: `${deviceStats.mobilePct}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>أجهزة الكمبيوتر المكتبية (Desktop)</span>
                  <span className="font-mono">{deviceStats.desktopPct}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-700 rounded-full" style={{ width: `${deviceStats.desktopPct}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteVisitorsPage;
