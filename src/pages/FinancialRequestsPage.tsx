import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface FinancialReq {
  id: string;
  request_number: string;
  type: string;
  client_name: string;
  contract_number: string;
  amount: number;
  status: 'تجهيز' | 'بانتظار الاعتماد' | 'تم السداد' | 'طلب إقفال';
  priority: 'عادي' | 'هام' | 'شديد الأهمية';
  applicant: string;
  created_at: string;
}

const MOCK_FIN_REQUESTS: FinancialReq[] = [
  {
    id: '1',
    request_number: '#FIN-2026-001',
    type: 'سداد مساند',
    client_name: 'نايف القحطاني',
    contract_number: '#RC-2026-0592',
    amount: 150.00,
    status: 'تم السداد',
    priority: 'هام',
    applicant: 'Mohameed',
    created_at: '2026-07-28'
  },
  {
    id: '2',
    request_number: '#FIN-2026-002',
    type: 'رسوم إقامة',
    client_name: 'عميل التجريبي',
    contract_number: '#RC-2026-0594',
    amount: 650.00,
    status: 'بانتظار الاعتماد',
    priority: 'شديد الأهمية',
    applicant: 'سهام',
    created_at: '2026-07-29'
  }
];

export const FinancialRequestsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const columns: Column<FinancialReq>[] = [
    {
      header: 'رقم الطلب',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.request_number}</span>
    },
    {
      header: 'نوع الطلب المالي',
      accessor: (row) => <Badge text={row.type} type="purple" icon="fa-solid fa-coins" />
    },
    {
      header: 'العميل ورقم العقد',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.client_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--odoo-teal-dark)' }}>{row.contract_number}</div>
        </div>
      )
    },
    {
      header: 'المبلغ المطلوب',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-teal-dark)' }}>{row.amount.toFixed(2)} ر.س</span>
    },
    {
      header: 'الأولوية',
      accessor: (row) => <Badge text={row.priority} type={row.priority === 'شديد الأهمية' ? 'danger' : 'warning'} />
    },
    {
      header: 'حالة الاعتماد والسداد',
      accessor: (row) => <Badge text={row.status} type={row.status === 'تم السداد' ? 'success' : 'warning'} />
    },
    {
      header: 'مقدم الطلب',
      accessor: (row) => <span style={{ fontSize: '12px', fontWeight: '600' }}>{row.applicant}</span>
    },
    {
      header: 'الإجراءات',
      accessor: () => (
        <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
          اعتماد وسداد
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-money-bill-transfer text-teal ml-2"></i> إدارة الطلبات المالية التشغيلية
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            متابعة رسوم التأشيرات، سداد منصة مساند، رسوم إنجاز، الإقامة، وتأمين العيوب
          </p>
        </div>
        <button className="btn-odoo btn-odoo-primary" onClick={() => setShowCreateModal(true)}>
          <i className="fa-solid fa-plus"></i> طلب مالي جديد
        </button>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_FIN_REQUESTS}
        searchPlaceholder="ابحث برقم الطلب المالي، نوع الطلب، اسم العميل، أو رقم العقد..."
        addLabel="طلب مالي جديد"
      />

      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
                تقديم طلب مالي تشغيلي جديد
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => setShowCreateModal(false)}></i>
            </div>
            
            <div className="filter-group" style={{ marginBottom: '12px' }}>
              <label className="filter-label">نوع الطلب المالي *</label>
              <select className="filter-select">
                <option>سداد مساند</option>
                <option>رسوم تأشيرة</option>
                <option>رسوم إنجاز</option>
                <option>رسوم إقامة</option>
                <option>رسوم رخصة عمل</option>
                <option>تأمين طبي</option>
                <option>صرف راتب عاملة</option>
                <option>استرداد عميل</option>
                <option>طلب مالي آخر</option>
              </select>
            </div>

            <div className="filter-group" style={{ marginBottom: '12px' }}>
              <label className="filter-label">المبلغ المطلوب (ر.س) *</label>
              <input type="number" className="filter-input" placeholder="0.00" />
            </div>

            <div className="filter-group" style={{ marginBottom: '16px' }}>
              <label className="filter-label">درجة الأولوية</label>
              <select className="filter-select">
                <option>عادي</option>
                <option>هام</option>
                <option>شديد الأهمية</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowCreateModal(false)}>إلغاء</button>
              <button className="btn-odoo btn-odoo-primary" onClick={() => { alert('تم رفع الطلب المالي وهو بانتظار اعتماد المدير المالي!'); setShowCreateModal(false); }}>
                رفع الطلب المالي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
