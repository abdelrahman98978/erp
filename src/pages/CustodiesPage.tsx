import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

interface Custody {
  id: string;
  item_name: string;
  employee_name: string;
  location: string;
  received_date: string;
  serial_number: string;
  estimated_value: number;
  status: 'في حوزة الموظف' | 'تم الاسترجاع' | 'صيانة';
}

const INITIAL_CUSTODIES: Custody[] = [
  { id: 'CUST-01', item_name: 'جهاز لاب توب MacBook Pro M2', employee_name: 'محمد مصطفي', location: 'مقر الإدارة العليا', received_date: '2024-06-01', serial_number: 'C02GX891Q6L4', estimated_value: 8500, status: 'في حوزة الموظف' },
  { id: 'CUST-02', item_name: 'سيارة تويوتا كامري 2025 (استقبال مطار)', employee_name: 'سائق الاستقبال - أحمد', location: 'فرع مطار الملك خالد', received_date: '2025-01-15', serial_number: 'KSA-9941-KSA', estimated_value: 95000, status: 'في حوزة الموظف' },
  { id: 'CUST-03', item_name: 'جهاز ايفون 15 بروماكس (هاتف خدمة العملاء)', employee_name: 'سارة خالد', location: 'فرع الرياض الرئيسي', received_date: '2025-03-10', serial_number: 'IPH-99281-2025', estimated_value: 5200, status: 'في حوزة الموظف' },
  { id: 'CUST-04', item_name: 'طابعة ملونة ليزر HP Enterprise', employee_name: 'فهد العتيبي', location: 'فرع جدة', received_date: '2024-11-20', serial_number: 'HP-ENT-44102', estimated_value: 4100, status: 'صيانة' }
];

export const CustodiesPage: React.FC = () => {
  const [custodies, setCustodies] = useState<Custody[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustodyForDoc, setSelectedCustodyForDoc] = useState<Custody | null>(null);

  useEffect(() => {
    realErpDataStore.getRecords<Custody>('custodies', INITIAL_CUSTODIES).then(data => setCustodies(data));
  }, []);

  const [addForm, setAddForm] = useState({
    item_name: '',
    employee_name: '',
    location: 'فرع الرياض الرئيسي',
    serial_number: '',
    estimated_value: ''
  });

  const handleAddCustody = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.item_name || !addForm.employee_name) return;

    const newC: Custody = {
      id: `CUST-0${custodies.length + 1}`,
      item_name: addForm.item_name,
      employee_name: addForm.employee_name,
      location: addForm.location,
      received_date: new Date().toISOString().slice(0, 10),
      serial_number: addForm.serial_number || 'N/A',
      estimated_value: parseFloat(addForm.estimated_value) || 0,
      status: 'في حوزة الموظف'
    };

    const updated = await realErpDataStore.addRecord('custodies', newC, INITIAL_CUSTODIES);
    setCustodies(updated);
    setShowAddModal(false);
    setAddForm({ item_name: '', employee_name: '', location: 'فرع الرياض الرئيسي', serial_number: '', estimated_value: '' });
  };

  const toggleCustodyStatus = (id: string) => {
    setCustodies(custodies.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'في حوزة الموظف' ? 'تم الاسترجاع' : 'في حوزة الموظف';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const columns: Column<Custody>[] = [
    { header: 'رمز العُهدة', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span> },
    {
      header: 'اسم العُهدة والرقم التسلسلي',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.item_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>S/N: {row.serial_number}</div>
        </div>
      )
    },
    { header: 'الموظف المستلم', accessor: (row) => <span style={{ fontWeight: '600' }}>{row.employee_name}</span> },
    { header: 'المقر / الفرع', accessor: (row) => <Badge text={row.location} type="purple" /> },
    { header: 'القيمة التقديرية', accessor: (row) => <span style={{ fontWeight: '700', color: '#005154' }}>{row.estimated_value.toLocaleString()} ر.س</span> },
    { header: 'تاريخ التسليم', accessor: (row) => <span style={{ fontSize: '12px' }}>{row.received_date}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type={row.status === 'في حوزة الموظف' ? 'success' : row.status === 'تم الاسترجاع' ? 'purple' : 'warning'} /> },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', fontSize: '11.5px' }}
            onClick={() => toggleCustodyStatus(row.id)}
          >
            {row.status === 'في حوزة الموظف' ? 'استرجاع' : 'إعادة تسليم'}
          </button>
          <button
            className="btn-odoo btn-odoo-purple"
            style={{ padding: '4px 8px', fontSize: '11.5px' }}
            onClick={() => setSelectedCustodyForDoc(row)}
          >
            سند التسليم
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-vault text-purple ml-2"></i> إدارة عُهد وأصول الموظفين (HR Assets & Custodies)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            تسليم الأصول، السيارات، الأجهزة الذكية، وتوليد سندات الاستلام الرسمية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> تسليم عُهدة جديدة
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('employees', custodies, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('employees', custodies, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={custodies}
        searchPlaceholder="ابحث باسم العُهدة، الموظف، أو الرقم التسلسلي..."
        onAddClick={() => setShowAddModal(true)}
        addLabel="إضافة عُهدة جديدة"
      />

      {/* Add Custody Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>تسليم عُهدة جديدة لموظف</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>
            <form onSubmit={handleAddCustody}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم الأصل / العُهدة *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="مثال: لاب توب، سيارة، هاتف..."
                  value={addForm.item_name}
                  onChange={e => setAddForm({ ...addForm, item_name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم الموظف المستلم *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="الاسم الثلاثي..."
                    value={addForm.employee_name}
                    onChange={e => setAddForm({ ...addForm, employee_name: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">الرقم التسلسلي (S/N)</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Serial Number..."
                    value={addForm.serial_number}
                    onChange={e => setAddForm({ ...addForm, serial_number: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">القيمة التقديرية (ر.س)</label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="0.00"
                    value={addForm.estimated_value}
                    onChange={e => setAddForm({ ...addForm, estimated_value: e.target.value })}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">المقر المخصص</label>
                  <select
                    className="filter-select"
                    value={addForm.location}
                    onChange={e => setAddForm({ ...addForm, location: e.target.value })}
                  >
                    <option>فرع الرياض الرئيسي</option>
                    <option>فرع جدة</option>
                    <option>مقر الإدارة العليا</option>
                    <option>مركز الإيواء - الرمال</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">تسليم الأصل وحفظ العُهدة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover Document Modal */}
      {selectedCustodyForDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '560px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #005154', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#005154', margin: 0 }}>مجموعة خالد السليم التجارية</h3>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#714B67' }}>سند تسلم واستلام عُهدة موظف رسمية</span>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '20px' }}>
              <p>أقر أنا الموظف / <strong>{selectedCustodyForDoc.employee_name}</strong> بأنني استلمت العُهدة المبينة أدنها بحالة جيدة وأتعهد بالحفاظ عليها وإعادتها فور طلب الإدارة:</p>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                <div>🔹 <strong>اسم الأصل:</strong> {selectedCustodyForDoc.item_name}</div>
                <div>🔹 <strong>الرقم التسلسلي:</strong> {selectedCustodyForDoc.serial_number}</div>
                <div>🔹 <strong>تاريخ الاستلام:</strong> {selectedCustodyForDoc.received_date}</div>
                <div>🔹 <strong>القيمة التقديرية:</strong> {selectedCustodyForDoc.estimated_value.toLocaleString()} ر.س</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px dashed #CBD5E1', paddingTop: '16px', fontSize: '12px' }}>
              <div>توقيع الموظف المستلم: ____________</div>
              <div>اعتماد الموارد البشرية: ____________</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setSelectedCustodyForDoc(null)}>إغلاق</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => window.print()}>
                <i className="fa-solid fa-print ml-1"></i> طباعة السند الرسمية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustodiesPage;
