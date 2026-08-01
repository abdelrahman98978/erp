import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface Custody {
  id: string;
  item_name: string;
  employee_name: string;
  location: string;
  received_date: string;
  status: 'في حوزة الموظف' | 'تم الاسترجاع' | 'صيانة';
}

const MOCK_CUSTODIES: Custody[] = [
  { id: 'CUST-01', item_name: 'جهاز لاب توب MacBook Pro M2', employee_name: 'محمد مصطفي', location: 'مقر الإدارة العليا', received_date: '2024-06-01', status: 'في حوزة الموظف' },
  { id: 'CUST-02', item_name: 'سيارة تويوتا كامري 2025 (استقبال مطار)', employee_name: 'سائق الاستقبال - أحمد', location: 'فرع مطار الملك خالد', received_date: '2025-01-15', status: 'في حوزة الموظف' }
];

export const CustodiesPage: React.FC = () => {
  const columns: Column<Custody>[] = [
    { header: 'رمز العُهدة', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span> },
    { header: 'اسم العُهدة والأصل', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.item_name}</span> },
    { header: 'الموظف المسؤول', accessor: (row) => <span style={{ fontWeight: '600' }}>{row.employee_name}</span> },
    { header: 'مقر العُهدة', accessor: (row) => <Badge text={row.location} type="purple" /> },
    { header: 'تاريخ الاستلام', accessor: (row) => <span>{row.received_date}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type={row.status === 'في حوزة الموظف' ? 'success' : 'warning'} /> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-box text-primary ml-2"></i> إدارة عُهد الموظفين والمقرات المخصصة (HR Custodies)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تسليم ومتابعة أصول وعُهد الموظفين والسيارات ومقرات الاستلام</p>
        </div>
        <button className="btn-odoo btn-odoo-primary"><i className="fa-solid fa-plus"></i> إضافة عُهدة جديدة</button>
      </div>
      <DataTable columns={columns} data={MOCK_CUSTODIES} searchPlaceholder="ابحث باسم العُهدة، الموظف، أو المقر..." addLabel="إضافة عُهدة" />
    </div>
  );
};
