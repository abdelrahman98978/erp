import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface SharedInvoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  tax: number;
  zatca_status: 'تمت المشاركة (Clearance)' | 'معلق' | 'مرفوض';
  uuid: string;
  created_at: string;
}

const MOCK_SHARED_INVOICES: SharedInvoice[] = [
  { id: '1', invoice_number: '#INV-Z-2026-001', client_name: 'عميل المالية التجريبي', amount: 3750.00, tax: 36.30, zatca_status: 'تمت المشاركة (Clearance)', uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', created_at: '2026-07-29 20:23' },
  { id: '2', invoice_number: '#INV-Z-2026-002', client_name: 'نايف القحطاني', amount: 14500.00, tax: 1891.30, zatca_status: 'تمت المشاركة (Clearance)', uuid: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', created_at: '2026-07-30 11:10' }
];

export const ZATCAPage: React.FC = () => {
  const columns: Column<SharedInvoice>[] = [
    { header: 'رقم الفاتورة الضريبية', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.invoice_number}</span> },
    { header: 'اسم العميل', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.client_name}</span> },
    { header: 'المبلغ الإجمالي', accessor: (row) => <span style={{ fontWeight: '800' }}>{row.amount.toLocaleString()} ر.س</span> },
    { header: 'ضريبة القيمة المضافة (15%)', accessor: (row) => <span style={{ color: 'var(--status-warning)', fontWeight: '700' }}>{row.tax.toLocaleString()} ر.س</span> },
    { header: 'حالة الربط مع ZATCA', accessor: (row) => <Badge text={row.zatca_status} type="success" icon="fa-solid fa-qrcode" /> },
    { header: 'الرمز الفريد UUID', accessor: (row) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{row.uuid.slice(0, 18)}...</span> },
    {
      header: 'الإجراءات',
      accessor: () => <button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>تحميل الفاتورة PDF</button>
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-qrcode text-purple ml-2"></i> هيئة الزكاة والضريبة والجمارك (ZATCA Integration Phase 2)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>إدارة الفواتير الإلكترونية المعتمدة، الختم التشفيري (CSID)، وربط الفواتير المعتمدة</p>
        </div>
      </div>

      <DataTable columns={columns} data={MOCK_SHARED_INVOICES} searchPlaceholder="ابحث برقم الفاتورة، اسم العميل، أو الـ UUID..." addLabel="مشاركة فاتورة مع ZATCA" />
    </div>
  );
};
