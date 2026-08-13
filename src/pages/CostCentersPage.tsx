import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

interface CostCenter {
  id: string;
  code: string;
  name: string;
  parent: string;
  total_expenses: number;
  total_revenues: number;
  budget_limit: number;
  status: 'نشط' | 'مكتمل' | 'تجاوز الميزانية';
}

const INITIAL_COST_CENTERS: CostCenter[] = [
  { id: '1', code: 'CC-101', name: 'مركز تكلفة عقود الاستقدام - الفرع الرئيسي', parent: 'الإدارة العامة', total_expenses: 42500.00, total_revenues: 410000.00, budget_limit: 100000.00, status: 'نشط' },
  { id: '2', code: 'CC-102', name: 'مركز تكلفة عقود التأجير والتشغيل', parent: 'إدارة التأجير', total_expenses: 18400.00, total_revenues: 115471.20, budget_limit: 50000.00, status: 'نشط' },
  { id: '3', code: 'CC-103', name: 'مركز إيواء وتغذية حي الرمال', parent: 'إدارة الإيواء', total_expenses: 64500.00, total_revenues: 12000.00, budget_limit: 60000.00, status: 'تجاوز الميزانية' },
  { id: '4', code: 'CC-104', name: 'مركز شحنات الطيران والخدمات اللوجستية', parent: 'إدارة السفر', total_expenses: 12800.00, total_revenues: 45000.00, budget_limit: 30000.00, status: 'نشط' }
];

export const CostCentersPage: React.FC = () => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<CostCenter>('cost_centers', INITIAL_COST_CENTERS).then(data => setCostCenters(data));
  }, []);

  const [addForm, setAddForm] = useState({
    name: '',
    parent: 'الإدارة العامة',
    budget_limit: ''
  });

  const handleAddCostCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name) return;

    const newCC: CostCenter = {
      id: String(Date.now()),
      code: `CC-10${costCenters.length + 1}`,
      name: addForm.name,
      parent: addForm.parent,
      total_expenses: 0,
      total_revenues: 0,
      budget_limit: parseFloat(addForm.budget_limit) || 50000,
      status: 'نشط'
    };

    const updated = await realErpDataStore.addRecord('cost_centers', newCC, INITIAL_COST_CENTERS);
    setCostCenters(updated);
    setShowAddModal(false);
    setAddForm({ name: '', parent: 'الإدارة العامة', budget_limit: '' });
  };

  const columns: Column<CostCenter>[] = [
    { header: 'كود المركز', accessor: (row) => <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--odoo-purple)' }}>{row.code}</span> },
    { header: 'اسم مركز التكلفة', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.name}</span> },
    { header: 'المركز الرئيسي التابع', accessor: (row) => <Badge text={row.parent} type="purple" /> },
    { header: 'الميزانية المعتمدة', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.budget_limit.toLocaleString()} ر.س</span> },
    { header: 'مصروفات المركز', accessor: (row) => <span style={{ color: 'var(--status-danger)', fontWeight: '700' }}>{row.total_expenses.toLocaleString()} ر.س</span> },
    { header: 'إيرادات المركز', accessor: (row) => <span style={{ color: 'var(--odoo-teal-dark)', fontWeight: '700' }}>{row.total_revenues.toLocaleString()} ر.س</span> },
    {
      header: 'صافي المركز',
      accessor: (row) => {
        const net = row.total_revenues - row.total_expenses;
        return <span style={{ fontWeight: '800', color: net >= 0 ? 'var(--status-success)' : 'var(--status-danger)' }}>{net.toLocaleString()} ر.س</span>;
      }
    },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} /> }
  ];

  const totalRevenues = costCenters.reduce((sum, c) => sum + c.total_revenues, 0);
  const totalExpenses = costCenters.reduce((sum, c) => sum + c.total_expenses, 0);

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-diagram-project text-purple ml-2"></i> مراكز التكلفة وشجرة التوزيع المحاسبي (Cost Centers Engine)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ربط وتخصيص الإيرادات والمصروفات على العقود، المشاريع، ومقرات الإيواء وحساب الربحية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> إضافة مركز تكلفة جديد
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('journals', costCenters, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('journals', costCenters, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Analytics KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي إيرادات مراكز التكلفة</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>{totalRevenues.toLocaleString()} ر.س</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #EF4444', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي مصروفات مراكز التكلفة</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#EF4444', marginTop: '4px' }}>{totalExpenses.toLocaleString()} ر.س</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>صافي الأرباح التشغيلية</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>{(totalRevenues - totalExpenses).toLocaleString()} ر.س</div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={costCenters}
        searchPlaceholder="ابحث بكود مركز التكلفة، الاسم، أو المركز الرئيسي..."
        onAddClick={() => setShowAddModal(true)}
        addLabel="إضافة مركز تكلفة"
      />

      {/* Add Cost Center Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '480px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>إضافة مركز تكلفة فرعي جديد</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>
            <form onSubmit={handleAddCostCenter}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم مركز التكلفة *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="مثال: مشروع استقدام عمالة شركة توباز..."
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">المركز الرئيسي التابع *</label>
                  <select
                    className="filter-select"
                    value={addForm.parent}
                    onChange={e => setAddForm({ ...addForm, parent: e.target.value })}
                  >
                    <option>الإدارة العامة</option>
                    <option>إدارة التأجير والخدمات</option>
                    <option>إدارة الإيواء والإعاشة</option>
                    <option>إدارة السفر واللوجستيات</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">سقف الميزانية (ر.س)</label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="50000"
                    value={addForm.budget_limit}
                    onChange={e => setAddForm({ ...addForm, budget_limit: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إنشاء وحفظ مركز التكلفة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCentersPage;
