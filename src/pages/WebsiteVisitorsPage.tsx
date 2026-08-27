import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { Globe, FileSpreadsheet, FileText, Smartphone, Laptop, Radio, Flame, PieChart, Search, PhoneCall } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'live' | 'popular' | 'traffic-sources'>('live');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS).then(data => setVisitors(data));
  }, []);

  const totalViewsToday = 1420;
  const activeLeadsCount = visitors.filter(v => v.is_lead).length;

  const filteredVisitors = (visitors.length > 0 ? visitors : MOCK_VISITORS).filter(v => {
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
          <button
            className="button-white-pill"
            onClick={() => exportData('website_visitors', visitors, 'excel')}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>تصدير تقرير الزيارات</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>إجمالي الزيارات اليوم</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalViewsToday.toLocaleString()} زائر</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>متوسط بقاء 4.2 دقيقة</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>العملاء المحتملون (Leads)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{activeLeadsCount} عملاء</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>تواصل فوري</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>معدل التحويل لحجوزات</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>4.8%</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>أعلى من المتوسط</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>حجوزات السير الذاتية</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>26 سيرة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>تم اختيارها اليوم</span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'live', label: `البث المباشر للزيارات (${visitors.length})`, icon: Radio },
          { id: 'popular', label: `السير الذاتية الأكثر مشاهدة (${MOCK_POPULAR_CVS.length})`, icon: Flame },
          { id: 'traffic-sources', label: 'مصادر الزيارات والحملات', icon: PieChart },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE STREAM */}
      {activeTab === 'live' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث بالـ IP، المدينة، مصدر الزيارة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-8 pl-3 text-xs text-black focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">كود الجلسة</th>
                  <th className="p-3.5">الموقع الجغرافي والـ IP</th>
                  <th className="p-3.5">الجهاز والمتصفح</th>
                  <th className="p-3.5">مصدر الزيارة (Referrer)</th>
                  <th className="p-3.5">الصفحة التي يتصفحها</th>
                  <th className="p-3.5">مدة البقاء</th>
                  <th className="p-3.5">التوقيت</th>
                  <th className="p-3.5 text-center">تواصل فوري (CRM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredVisitors.map(row => (
                  <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">{row.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{row.city}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">IP: {row.ip_address} | {row.country}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        text={row.device}
                        type="info"
                      />
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.source === 'TikTok Ads' ? 'bg-black text-white' : row.source === 'Google Search' ? 'bg-zinc-100 text-black' : row.source === 'Musaned Direct' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-50 text-zinc-700'}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-800 text-xs">{row.page_visited}</td>
                    <td className="p-3.5 font-mono font-bold text-zinc-700">{Math.floor(row.duration_sec / 60)} د و {row.duration_sec % 60} ث</td>
                    <td className="p-3.5 text-amber-700 font-bold text-xs">{row.visit_time}</td>
                    <td className="p-3.5 text-center">
                      {row.phone ? (
                        <a
                          href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً بك في مجموعة السليم للاستقدام، نود مساعدتك في اختيار السيرة الذاتية المناسبة.')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="button-primary-pill inline-flex items-center gap-1"
                          style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>واتساب فوري</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400 text-xs">زائر مجهول</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: POPULAR CVS LEADERBOARD */}
      {activeTab === 'popular' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_POPULAR_CVS.map((cv, idx) => (
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
                  <div className="text-sm font-bold text-emerald-700 mt-0.5 font-mono">{cv.reservation_count}</div>
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

      {/* TAB 3: TRAFFIC SOURCES */}
      {activeTab === 'traffic-sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-black" />
              <span>القنوات ومصادر الزيارات الرئيسية</span>
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>حملات تيك توك (TikTok Ads)</span>
                  <span className="font-mono">42% (596 زيارة)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>محرك بحث جوجل (Google Search & SEO)</span>
                  <span className="font-mono">30% (426 زيارة)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-700 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>الإحالات المباشرة من منصة مساند (Musaned)</span>
                  <span className="font-mono">18% (255 زيارة)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>الزيارات المباشرة (Direct Traffic)</span>
                  <span className="font-mono">10% (143 زيارة)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-400 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
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
                  <span className="font-mono">78%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>أجهزة الكمبيوتر المكتبية (Desktop)</span>
                  <span className="font-mono">22%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-700 rounded-full" style={{ width: '22%' }} />
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
