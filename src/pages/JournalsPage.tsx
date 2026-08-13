import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';

interface JournalEntryItem {
  id: string;
  entry_number: string;
  type: 'قيد يومية' | 'سند قبض' | 'سند صرف';
  debit: number;
  credit: number;
  description: string;
  status: 'معتمد' | 'بانتظار الاعتماد';
  branch: string;
  created_at: string;
}

const INITIAL_JOURNALS: JournalEntryItem[] = [
  { id: '1', entry_number: 'SAF-JV-2026-0001', type: 'قيد يومية', debit: 1150.00, credit: 1150.00, description: 'قيد فاتورة عقد تأجير رقم RC-2026-0014 / العميل أبو إياد', status: 'معتمد', branch: 'فرع الرياض الرئيسي', created_at: '2026-08-12 11:30' },
  { id: '2', entry_number: 'SAF-JV-2026-0002', type: 'سند قبض', debit: 14500.00, credit: 14500.00, description: 'تحصيل مبلغ عقد استقدام العميل نايف القحطاني عبر بنك الراجحي', status: 'معتمد', branch: 'فرع الرياض الرئيسي', created_at: '2026-08-12 14:00' },
  { id: '3', entry_number: 'SAF-JV-2026-0003', type: 'سند صرف', debit: 1500.00, credit: 1500.00, description: 'صرف رسوم استقدام مساند برو للمكتب الخارجي داماس', status: 'معتمد', branch: 'الإدارة العامة', created_at: '2026-08-13 09:30' }
];

export const JournalsPage: React.FC = () => {
  const [journals, setJournals] = useState<JournalEntryItem[]>(INITIAL_JOURNALS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    type: 'قيد يومية' as 'قيد يومية' | 'سند قبض' | 'سند صرف',
    description: '',
    debit_account: '11010 - الصندوق الرئيسي',
    credit_account: '41100 - إيرادات الاستقدام',
    amount: '',
    branch: 'فرع الرياض الرئيسي'
  });

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount) || 0;
    if (!form.description || amt <= 0) return;

    const newJ: JournalEntryItem = {
      id: String(Date.now()),
      entry_number: `SAF-JV-2026-${String(journals.length + 4).padStart(4, '0')}`,
      type: form.type,
      debit: amt,
      credit: amt,
      description: `${form.description} [من: ${form.debit_account} إلى: ${form.credit_account}]`,
      status: 'معتمد',
      branch: form.branch,
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setJournals([newJ, ...journals]);
    setShowAddModal(false);
    setForm({ type: 'قيد يومية', description: '', debit_account: '11010 - الصندوق الرئيسي', credit_account: '41100 - إيرادات الاستقدام', amount: '', branch: 'فرع الرياض الرئيسي' });
  };

  const columns: Column<JournalEntryItem>[] = [
    { header: 'رقم القيد / السند', accessor: (row) => <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--odoo-purple)' }}>{row.entry_number}</span> },
    { header: 'نوع المستند المحاسبي', accessor: (row) => <Badge text={row.type} type={row.type === 'سند قبض' ? 'success' : row.type === 'سند صرف' ? 'danger' : 'purple'} /> },
    { header: 'المدين (Debit)', accessor: (row) => <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.debit.toLocaleString()} ر.س</span> },
    { header: 'الدائن (Credit)', accessor: (row) => <span style={{ fontWeight: '700', color: 'var(--status-danger)' }}>{row.credit.toLocaleString()} ر.س</span> },
    { header: 'البيان والتوضيح', accessor: (row) => <span style={{ fontSize: '12.5px' }}>{row.description}</span> },
    { header: 'الفرع', accessor: (row) => <Badge text={row.branch} type="purple" /> },
    { header: 'التاريخ', accessor: (row) => <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{row.created_at}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type="success" /> }
  ];

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-book-journal-whills text-purple ml-2"></i> دفتر اليومية والقيود المزدوجة (Double Entry Ledger)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إضافة وتدقيق قيود اليومية العامة، سندات القبض والصرف، والتأكد من التوازن المحاسبي الآلي
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> إضافة قيد يومية متوازن
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('journals', journals, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('journals', journals, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={journals}
        searchPlaceholder="ابحث برقم القيد، البيان، أو نوع السند..."
        onAddClick={() => setShowAddModal(true)}
        addLabel="إضافة قيد يومية"
      />

      {/* Add Journal Entry Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '540px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>إصدار قيد محاسبي مزدوج جديد</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>
            <form onSubmit={handleAddJournal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">نوع المستند المحاسبي *</label>
                  <select
                    className="filter-select"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                  >
                    <option value="قيد يومية">قيد يومية عام</option>
                    <option value="سند قبض">سند قبض</option>
                    <option value="سند صرف">سند صرف</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">المبلغ الساري (ر.س) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="filter-input"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الطرف المدين (Debit Account) *</label>
                <select
                  className="filter-select"
                  value={form.debit_account}
                  onChange={e => setForm({ ...form, debit_account: e.target.value })}
                >
                  <option>11010 - الصندوق الرئيسي</option>
                  <option>11020 - بنك الراجحي التشغيلي</option>
                  <option>11030 - حساب أمانات مساند</option>
                  <option>51100 - مصروفات المكاتب الخارجية</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الطرف الدائن (Credit Account) *</label>
                <select
                  className="filter-select"
                  value={form.credit_account}
                  onChange={e => setForm({ ...form, credit_account: e.target.value })}
                >
                  <option>41100 - إيرادات عقود استقدام مساند</option>
                  <option>41200 - إيرادات عقود التأجير والتشغيل</option>
                  <option>21010 - دائنو عقود الاستقدام</option>
                  <option>21050 - ضريبة القيمة المضافة المستحقة (15%)</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">البيان والوصف الشامل *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="وصف العملية المحاسبية والمرجع..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '8px', border: '1px solid #A7F3D0', marginBottom: '16px', fontSize: '12px', color: '#065F46' }}>
                <i className="fa-solid fa-scale-balanced ml-1"></i> توازن القيد المحاسبي: <strong>المدين ({form.amount || 0} ر.س) = الدائن ({form.amount || 0} ر.س)</strong> ✅
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">حفظ وتثبيت القيد</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalsPage;
