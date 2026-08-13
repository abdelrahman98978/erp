import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';

interface Flight {
  id: string;
  client_name: string;
  maid_name: string;
  nationality: string;
  travel_type: 'وصول' | 'ترحيل' | 'داخلي';
  airline: string;
  flight_number: string;
  airport: string;
  flight_date: string;
  status: 'مؤكد' | 'معلق' | 'مكتمل' | 'مجدول';
}

const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'FL-801',
    client_name: 'سهام الشاذلى',
    maid_name: 'عاملة وصول سهام',
    nationality: 'اثيوبيا',
    travel_type: 'وصول',
    airline: 'الخطوط السعودية (SAUDIA)',
    flight_number: 'SV-412',
    airport: 'مطار الملك خالد الدولي - الرياض',
    flight_date: '2026-07-30 09:57',
    status: 'مكتمل'
  },
  {
    id: 'FL-802',
    client_name: 'عميل الترحيل التجريبي',
    maid_name: 'sara deportation',
    nationality: 'كينيا',
    travel_type: 'ترحيل',
    airline: 'الخطوط الإثيوبية (Ethiopian)',
    flight_number: 'ET-602',
    airport: 'مطار الملك عبدالعزيز - جدة',
    flight_date: '2026-08-02 14:00',
    status: 'مجدول'
  }
];

export const TravelPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<Flight>('travel_flights', MOCK_FLIGHTS).then(data => setFlights(data));
  }, []);

  const columns: Column<Flight>[] = [
    {
      header: '#',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span>
    },
    {
      header: 'نوع السفر والرحلة',
      accessor: (row) => <Badge text={row.travel_type} type={row.travel_type === 'وصول' ? 'success' : 'danger'} icon="fa-solid fa-plane" />
    },
    {
      header: 'العميل والعاملة',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>العميل: {row.client_name} • {row.nationality}</div>
        </div>
      )
    },
    {
      header: 'شركة الطيران ورقم الرحلة',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.airline}</span>
          <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>رقم: {row.flight_number}</div>
        </div>
      )
    },
    {
      header: 'مطار الوصول / المغادرة',
      accessor: (row) => <span style={{ fontSize: '12px' }}>{row.airport}</span>
    },
    {
      header: 'تاريخ وتوقيت الرحلة',
      accessor: (row) => <span style={{ fontWeight: '700', color: 'var(--status-warning)' }}>{row.flight_date}</span>
    },
    {
      header: 'الحالة',
      accessor: (row) => <Badge text={row.status} type={row.status === 'مكتمل' ? 'success' : 'warning'} />
    },
    {
      header: 'الإجراءات',
      accessor: () => (
        <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
          إسناد سائق استقبال
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-plane-departure text-primary ml-2"></i> جدول رحلات الاستقدام والوصول والترحيل
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            متابعة خطوط الطيران والمطارات والتنبيهات المباشرة لسائقي الاستقبال
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn-odoo ${viewMode === 'calendar' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`} onClick={() => setViewMode('calendar')}>
            <i className="fa-solid fa-calendar-days"></i> عرض التقويم
          </button>
          <button className={`btn-odoo ${viewMode === 'table' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`} onClick={() => setViewMode('table')}>
            <i className="fa-solid fa-list"></i> عرض الجدول
          </button>
        </div>
      </div>

      {viewMode === 'calendar' && (
        <div className="table-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>تقويم رحلات يوليو / أغسطس 2026</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 10px', height: '30px' }}>اليوم</button>
              <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 10px', height: '30px' }}>شهر</button>
              <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 10px', height: '30px' }}>أسبوع</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: '700', fontSize: '13px', marginBottom: '8px' }}>
            <div>الأحد</div><div>الاثنين</div><div>الثلاثاء</div><div>الأربعاء</div><div>الخميس</div><div>الجمعة</div><div>السبت</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {[...Array(31)].map((_, i) => (
              <div key={i} style={{ minHeight: '80px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', padding: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>{i + 1}</span>
                {i === 29 && (
                  <div style={{ background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: '4px', padding: '2px 4px', fontSize: '10px', marginTop: '4px', color: 'var(--status-success)', fontWeight: '800' }}>
                    وصول - سهام (SV-412)
                  </div>
                )}
                {i === 1 && (
                  <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: '4px', padding: '2px 4px', fontSize: '10px', marginTop: '4px', color: 'var(--status-warning)', fontWeight: '800' }}>
                    ترحيل - سارة (ET-602)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={MOCK_FLIGHTS}
        searchPlaceholder="ابحث برقم الرحلة، اسم العاملة، المطار، أو خط الطيران..."
        addLabel="إضافة رحلة سفر جديدة"
        exportConfig={{ sectionKey: 'travel', rawData: MOCK_FLIGHTS }}
      />
    </div>
  );
};
