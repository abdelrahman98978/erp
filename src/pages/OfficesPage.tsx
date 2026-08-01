import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface ForeignOffice {
  id: string;
  name: string;
  manager: string;
  nationality: string;
  account_code: string;
  cvs_count: number;
  contracts_count: number;
  cost_usd: number;
  status: 'نشط' | 'متوقف';
}

const MOCK_OFFICES: ForeignOffice[] = [
  {
    id: '1',
    name: 'AILEEN FOREIGN EMPLOYMENT AGENT PLC',
    manager: 'لديه مدير',
    nationality: 'اثيوبيا',
    account_code: '22117',
    cvs_count: 2,
    contracts_count: 3,
    cost_usd: 0,
    status: 'نشط'
  },
  {
    id: '2',
    name: 'DAMAS FOREIGN EMPLOYMENT AGENCY',
    manager: 'بدون مدير',
    nationality: 'اثيوبيا',
    account_code: '22105',
    cvs_count: 5,
    contracts_count: 4,
    cost_usd: 1000,
    status: 'متوقف'
  },
  {
    id: '3',
    name: "PLATINUM BROTHERS INT'L MANPOWER",
    manager: 'لديه مدير',
    nationality: 'الفلبين',
    account_code: '22109',
    cvs_count: 18,
    contracts_count: 12,
    cost_usd: 1450,
    status: 'نشط'
  }
];

export const OfficesPage: React.FC = () => {
  const columns: Column<ForeignOffice>[] = [
    {
      header: '#',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span>
    },
    {
      header: 'اسم المكتب الخارجي والمدير',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.manager}</div>
        </div>
      )
    },
    {
      header: 'دولة المصدر والجنسية',
      accessor: (row) => <Badge text={row.nationality} type="info" />
    },
    {
      header: 'كود الحساب المحاسبي',
      accessor: (row) => <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{row.account_code}</span>
    },
    {
      header: 'السير والعقود المرتبطة',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>سير: {row.cvs_count}</span>
          <div style={{ fontSize: '11px', color: 'var(--odoo-teal-dark)' }}>عقود: {row.contracts_count}</div>
        </div>
      )
    },
    {
      header: 'التكلفة بالدولار ($)',
      accessor: (row) => (
        <span style={{ fontWeight: '800', color: 'var(--status-warning)' }}>
          {row.cost_usd ? `$${row.cost_usd.toLocaleString()}` : '-'}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} />
    },
    {
      header: 'الإجراءات',
      accessor: () => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
            تعديل
          </button>
          <button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
            استعادة كلمة السر
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-globe text-primary ml-2"></i> إدارة الوكلاء والمكاتب الخارجية (Foreign Agencies)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ربط رخص المكاتب، ميزانيات السير المرفوعة، وحسابات الدخول لدول المصدر
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_OFFICES}
        searchPlaceholder="ابحث باسم المكتب، كود الحساب، الجنسية، أو اسم المدير..."
        addLabel="إضافة مكتب خارجي جديد"
      />
    </div>
  );
};
