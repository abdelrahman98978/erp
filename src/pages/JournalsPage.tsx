import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface JournalEntry {
  id: string;
  entry_number: string;
  type: 'قيد يومية' | 'سند قبض' | 'سند صرف';
  debit: number;
  credit: number;
  description: string;
  status: 'معتمد' | 'بانتظار الاعتماد';
  created_at: string;
}

const MOCK_JOURNALS: JournalEntry[] = [
  { id: '1', entry_number: '#JV-2026-0120', type: 'سند قبض', debit: 14500.00, credit: 14500.00, description: 'تحصيل مبلغ عقد استقدام العميل نايف القحطاني', status: 'معتمد', created_at: '2026-07-29 14:00' },
  { id: '2', entry_number: '#JV-2026-0121', type: 'سند صرف', debit: 1500.00, credit: 1500.00, description: 'صرف رسوم استقدام مساند برو للمكتب الخارجي', status: 'معتمد', created_at: '2026-07-30 09:30' }
];

export const JournalsPage: React.FC = () => {
  const columns: Column<JournalEntry>[] = [
    { header: 'رقم القيد / السند', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.entry_number}</span> },
    { header: 'نوع المستند المحاسبي', accessor: (row) => <Badge text={row.type} type={row.type === 'سند قبض' ? 'success' : 'purple'} /> },
    { header: 'المدين (Debit)', accessor: (row) => <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.debit.toLocaleString()} ر.س</span> },
    { header: 'الدائن (Credit)', accessor: (row) => <span style={{ fontWeight: '700', color: 'var(--status-danger)' }}>{row.credit.toLocaleString()} ر.س</span> },
    { header: 'البيان والتوضيح', accessor: (row) => <span style={{ fontSize: '12.5px' }}>{row.description}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type="success" /> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-book-journal-whills text-purple ml-2"></i> القيود المحاسبية وسندات الصرف والقبض (Journal Vouchers)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>إضافة قيد محاسبي مزدوج، سندات الصرف والقبض العامة، والتحويلات الخزينة</p>
        </div>
        <button className="btn-odoo btn-odoo-purple"><i className="fa-solid fa-plus"></i> إضافة قيد يومية متوازن</button>
      </div>
      <DataTable columns={columns} data={MOCK_JOURNALS} searchPlaceholder="ابحث برقم القيد، البيان، أو نوع السند..." addLabel="سند قبض / صرف جديد" />
    </div>
  );
};
