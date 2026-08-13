import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { realErpDataStore } from '../services/realErpDataStore';

interface Visitor {
  id: string;
  ip_address: string;
  country: string;
  city: string;
  device: string;
  page_visited: string;
  visit_time: string;
}

const MOCK_VISITORS: Visitor[] = [
  { id: '1', ip_address: '185.220.101.5', country: 'المملكة العربية السعودية', city: 'الرياض', device: 'iPhone / Safari', page_visited: 'صفحة اختيار العمالة (/select-workers)', visit_time: 'منذ 5 دقائق' },
  { id: '2', ip_address: '94.200.12.88', country: 'المملكة العربية السعودية', city: 'جدة', device: 'Windows / Chrome', page_visited: 'تفاصيل السيرة الذاتية (#ETH-887711)', visit_time: 'منذ 12 دقيقة' },
  { id: '3', ip_address: '213.166.140.2', country: 'الإمارات العربية المتحدة', city: 'دبي', device: 'Android / Chrome', page_visited: 'الرئيسية والعروض (/offers)', visit_time: 'منذ 25 دقيقة' }
];

export const WebsiteVisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<Visitor>('website_visitors', MOCK_VISITORS).then(data => setVisitors(data));
  }, []);

  const columns: Column<Visitor>[] = [
    { header: '#', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span> },
    { header: 'عنوان الـ IP', accessor: (row) => <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{row.ip_address}</span> },
    { header: 'الدولة والمدينة', accessor: (row) => <div><span style={{ fontWeight: '700' }}>{row.country}</span><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.city}</div></div> },
    { header: 'الجهاز والمتصفح', accessor: (row) => <Badge text={row.device} type="info" icon="fa-solid fa-mobile-screen" /> },
    { header: 'الصفحة التي تمت زيارتها', accessor: (row) => <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--odoo-teal-dark)' }}>{row.page_visited}</span> },
    { header: 'توقيت الزيارة', accessor: (row) => <span style={{ fontSize: '11.5px', color: 'var(--status-warning)', fontWeight: '700' }}>{row.visit_time}</span> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-eye text-primary ml-2"></i> زوار المنصة الخارجية ومتابعة التفاعل الحقيقي
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تتبع الزيارات المباشرة، العمالة الأكثر مشاهدة، ومصادر الزيارات</p>
        </div>
      </div>

      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="إجمالي الزيارات اليوم" value="1,420" icon="fa-solid fa-eye" subtext="معدل بقاء 4.2 دقيقة" variant="teal" />
        <StatCard title="السير الأكثر مشاهدة" value="384" icon="fa-solid fa-fire" subtext="سير العاملات الإثيوبيات" variant="purple" />
        <StatCard title="الحجوزات المباشرة" value="12" icon="fa-solid fa-cart-check" subtext="تحول 8.5% إلى طلبات" variant="info" />
      </div>

      <DataTable columns={columns} data={visitors.length > 0 ? visitors : MOCK_VISITORS} searchPlaceholder="ابحث بالـ IP، المدينة، أو الصفحة..." />
    </div>
  );
};
