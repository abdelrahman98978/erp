import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

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

  useEffect(() => {
    realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS).then(data => setVisitors(data));
  }, []);

  const totalViewsToday = 1420;
  const activeLeadsCount = visitors.filter(v => v.is_lead).length;

  const columns: Column<Visitor>[] = [
    {
      header: 'كود الجلسة',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)', fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'الموقع الجغرافي والـ IP',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#1E293B' }}>{row.city}</span>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
            IP: {row.ip_address} | {row.country}
          </div>
        </div>
      )
    },
    {
      header: 'الجهاز والمتصفح',
      accessor: (row) => (
        <Badge
          text={`${row.device}`}
          type="info"
          icon={row.device.includes('iPhone') || row.device.includes('Samsung') ? 'fa-solid fa-mobile-screen' : 'fa-solid fa-laptop'}
        />
      )
    },
    {
      header: 'مصدر الزيارة (Referrer)',
      accessor: (row) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: '700',
          background: row.source === 'TikTok Ads' ? '#000' : row.source === 'Google Search' ? '#DBEAFE' : row.source === 'Musaned Direct' ? '#DCFCE7' : '#F1F5F9',
          color: row.source === 'TikTok Ads' ? '#FFF' : row.source === 'Google Search' ? '#1E40AF' : row.source === 'Musaned Direct' ? '#166534' : '#334155'
        }}>
          {row.source}
        </span>
      )
    },
    {
      header: 'الصفحة التي يتصفحها',
      accessor: (row) => (
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#047857' }}>
          {row.page_visited}
        </span>
      )
    },
    {
      header: 'مدة البقاء',
      accessor: (row) => (
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#334155' }}>
          {Math.floor(row.duration_sec / 60)} د و {row.duration_sec % 60} ث
        </span>
      )
    },
    {
      header: 'التوقيت',
      accessor: (row) => (
        <span style={{ fontSize: '11.5px', color: '#D97706', fontWeight: '800' }}>
          <i className="fa-solid fa-circle text-emerald-500 animate-pulse ml-1" style={{ fontSize: '8px' }}></i> {row.visit_time}
        </span>
      )
    },
    {
      header: 'تواصل فوري (CRM)',
      accessor: (row) => (
        <div>
          {row.phone ? (
            <a
              href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً بك في مجموعة السليم للاستقدام، نود مساعدتك في اختيار السيرة الذاتية المناسبة.')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#10B981',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              <i className="fa-brands fa-whatsapp"></i> واتساب فوري
            </a>
          ) : (
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>زائر مجهول</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              REALTIME WEB TRAFFIC
            </span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>تحليلات زيارات بوابة المجموعة الخارجية</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            زوار المنصة الخارجية ومتابعة العملاء المحتملين (Web Traffic & Lead Stream)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#CBD5E1' }}>
            تتبع التفاعل المباشر للزوار، السير الذاتية الأكثر مشاهدة، ومعدلات التحويل إلى حجوزات مساند
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('website_visitors', visitors, 'excel')} style={{ padding: '8px 16px', fontSize: '13px', background: '#059669', borderColor: '#059669' }}>
            <i className="fa-solid fa-file-excel ml-1"></i> تصدير تقرير الزيارات
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي الزيارات اليوم"
          value={`${totalViewsToday.toLocaleString()} زائر`}
          icon="fa-solid fa-eye"
          subtext="متوسط بقاء 4.2 دقيقة"
          variant="teal"
        />
        <StatCard
          title="العملاء المحتملون (Leads)"
          value={`${activeLeadsCount} عملاء`}
          icon="fa-solid fa-user-check"
          subtext="جاهزون للتواصل المباشر"
          variant="purple"
        />
        <StatCard
          title="معدل التحويل لحجوزات"
          value="8.4%"
          icon="fa-solid fa-cart-check"
          subtext="أعلى من المتوسط بنسبة 2.1%"
          variant="info"
        />
        <StatCard
          title="السير الأكثر طلباً"
          value="الفلبين وإثيوبيا"
          icon="fa-solid fa-fire"
          subtext="85% من إجمالي المشاهدات"
          variant="warning"
        />
      </div>

      {/* Sub Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('live')}
          className={`btn-odoo ${activeTab === 'live' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-tower-broadcast ml-1"></i> البث المباشر للزيارات ({visitors.length})
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`btn-odoo ${activeTab === 'popular' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-fire ml-1"></i> السير الذاتية الأكثر مشاهدة ({MOCK_POPULAR_CVS.length})
        </button>
        <button
          onClick={() => setActiveTab('traffic-sources')}
          className={`btn-odoo ${activeTab === 'traffic-sources' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-chart-pie ml-1"></i> مصادر الزيارات والحملات
        </button>
      </div>

      {/* TAB 1: LIVE STREAM */}
      {activeTab === 'live' && (
        <DataTable
          columns={columns}
          data={visitors.length > 0 ? visitors : MOCK_VISITORS}
          searchPlaceholder="ابحث بالـ IP، المدينة، مصدر الزيارة، أو الصفحة..."
        />
      )}

      {/* TAB 2: POPULAR CVS LEADERBOARD */}
      {activeTab === 'popular' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {MOCK_POPULAR_CVS.map((cv, idx) => (
            <div key={cv.id} style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', position: 'relative' }}>
              <span style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: idx === 0 ? '#FEF08A' : idx === 1 ? '#E2E8F0' : '#FFEDD5',
                color: idx === 0 ? '#854D0E' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '13px'
              }}>
                #{idx + 1}
              </span>

              <Badge text={cv.nationality} type="info" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '8px', marginBottom: '2px' }}>{cv.name}</h3>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>كود السيرة: <strong style={{ fontFamily: 'monospace' }}>{cv.cv_code}</strong> | {cv.profession}</div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>المشاهدات</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A' }}>{cv.views_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>الحجوزات</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#047857' }}>{cv.reservation_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>التحويل</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#2563EB' }}>{cv.conversion_rate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TRAFFIC SOURCES */}
      {activeTab === 'traffic-sources' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
              <i className="fa-solid fa-share-nodes text-blue-600 ml-2"></i> القنوات ومصادر الزيارات الرئيسية
            </h3>
            <div className="space-y-3">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>حملات تيك توك (TikTok Ads)</span>
                  <strong>42% (596 زيارة)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', background: '#000' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>محرك بحث جوجل (Google Search & SEO)</span>
                  <strong>30% (426 زيارة)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', background: '#3B82F6' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>الإحالات المباشرة من منصة مساند (Musaned)</span>
                  <strong>18% (255 زيارة)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: '#10B981' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>الزيارات المباشرة (Direct Traffic)</span>
                  <strong>10% (143 زيارة)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '10%', height: '100%', background: '#64748B' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
              <i className="fa-solid fa-mobile-screen-button text-purple-600 ml-2"></i> توزيع الأجهزة والمتصفحات
            </h3>
            <div className="space-y-3">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>الهواتف الذكية (iOS Safari & Android)</span>
                  <strong>78%</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: '#8B5CF6' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>أجهزة الكمبيوتر المكتبية (Desktop)</span>
                  <strong>22%</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '22%', height: '100%', background: '#0F172A' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
