import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface ImportBatch {
  id: string;
  batch_code: string;
  office_name: string;
  country: string;
  cvs_count: number;
  status: 'بانتظار الاعتماد' | 'مستوردة بالكامل' | 'مرفوضة';
  created_at: string;
}

const MOCK_BATCHES: ImportBatch[] = [
  { id: '1', batch_code: '#IMP-2026-08', office_name: 'DAMAS FOREIGN AGENCY', country: 'اثيوبيا', cvs_count: 15, status: 'بانتظار الاعتماد', created_at: '2026-07-29' },
  { id: '2', batch_code: '#IMP-2026-07', office_name: "PLATINUM BROTHERS INT'L", country: 'الفلبين', cvs_count: 22, status: 'مستوردة بالكامل', created_at: '2026-07-20' }
];

export const AgentImportsPage: React.FC = () => {
  const columns: Column<ImportBatch>[] = [
    { header: 'كود الدفعة', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.batch_code}</span> },
    { header: 'المكتب الخارجي والدولة', accessor: (row) => <div><span style={{ fontWeight: '700' }}>{row.office_name}</span><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.country}</div></div> },
    { header: 'عدد السير المرفوعة', accessor: (row) => <Badge text={`${row.cvs_count} سيرة ذاتية`} type="purple" /> },
    { header: 'التاريخ', accessor: (row) => <span style={{ fontSize: '12px' }}>{row.created_at}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type={row.status === 'مستوردة بالكامل' ? 'success' : 'warning'} /> },
    {
      header: 'الإجراءات',
      accessor: () => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>اعتماد ونشر السير</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-file-import text-purple ml-2"></i> ملفات السير المرفوعة من الوكلاء بالخارج
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>مراجعة السير الذاتية المرفوعة بالجملة من مكاتب الاستقدام الخارجية قبل النشر</p>
        </div>
      </div>
      <DataTable columns={columns} data={MOCK_BATCHES} searchPlaceholder="ابحث بكود الدفعة، المكتب، أو الدولة..." addLabel="استيراد دُفعة سير ذاتية" />
    </div>
  );
};
