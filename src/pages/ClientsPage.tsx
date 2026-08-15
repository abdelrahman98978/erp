import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useClients, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';

export const ClientsPage: React.FC = () => {
  const { data: clients = [], isLoading } = useClients();
  const { createItem } = useTableMutation('clients');
  const { activeCompanyId } = useCompany();
  const { setActiveTab } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    national_id: '',
    branch: 'فرع الرياض',
    type: 'شخص',
  });

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone || !addForm.national_id) return;

    const newRecord = {
      company_id: activeCompanyId !== 'all' ? activeCompanyId : 'SAF',
      client_no: `CLI-2026-${String(242 + clients.length).padStart(4, '0')}`,
      name: addForm.name,
      phone: addForm.phone,
      national_id: addForm.national_id,
      account_code: `11020${clients.length + 5}`,
      client_activity: 'عميل جديد - بانتظار التعاقد',
      last_activity: 'إنشاء ملف العميل بالنظام',
      added_by: 'المستخدم الحالي',
      branch: addForm.branch,
      type: addForm.type,
      status: 'نشط',
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setAddForm({ name: '', phone: '', national_id: '', branch: 'فرع الرياض', type: 'شخص' });
  };

  const filteredClients = clients.filter((c: any) =>
    (c.client_no && c.client_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.name && c.name.includes(searchQuery)) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.national_id && c.national_id.includes(searchQuery))
  );

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-users text-purple ml-2"></i> إدارة العملاء والعلاقات (CRM - 241 عميل)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            سجل العملاء المعتمد المربوط بالدليل المحاسبي وعقود الاستقدام والتأجير والواتساب
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-user-plus ml-1"></i> إضافة عميل جديد
          </button>
          <button
            className="btn-odoo btn-odoo-primary"
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            title="استيراد عملاء من ملف Excel / CSV"
          >
            <i className="fa-solid fa-file-import ml-1"></i> استيراد Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('clients', filteredClients, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> تصدير
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('clients', filteredClients, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('clients', filteredClients, 'print')} title="طباعة التقرير">
            <i className="fa-solid fa-print text-purple ml-1"></i> طباعة
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '18px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي العملاء الموثقين</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>241 عميلاً</div>
          <span style={{ fontSize: '11.5px', color: 'var(--status-success)' }}>تغطية جميع الفروع</span>
        </div>

        <div style={{ background: 'white', padding: '18px', borderRadius: '12px', borderRight: '4px solid #10B981', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>عملاء العقود السارية</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>198 عميلاً</div>
          <span style={{ fontSize: '11.5px', color: '#10B981' }}>استقدام وتأجير</span>
        </div>

        <div style={{ background: 'white', padding: '18px', borderRadius: '12px', borderRight: '4px solid #714B67', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>محادثات الواتساب النشطة</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#714B67', marginTop: '4px' }}>43 محادثة</div>
          <span style={{ fontSize: '11.5px', color: '#714B67' }}>متابعة حية مع خدمة العملاء</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث برقم العميل، الاسم، الجوال، أو رقم الهوية..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="odoo-data-table">
          <thead>
            <tr>
              <th>رقم العميل</th>
              <th>الاسم والبيانات</th>
              <th>رقم الحساب المحاسبي</th>
              <th>نشاط العميل الحالي</th>
              <th>آخر نشاط مسجل</th>
              <th>أضيف بواسطة</th>
              <th>الفرع</th>
              <th>تاريخ الإنشاء</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                  <i className="fa-solid fa-spinner fa-spin ml-2 text-primary"></i> جاري استرجاع سجلات العملاء من قاعدة بيانات سوبابيس المباشرة...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                  <i className="fa-regular fa-folder-open ml-2"></i> لا يوجد عملاء مطابقين للبحث
                </td>
              </tr>
            ) : (
              filteredClients.map((c: any) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{c.client_no || c.client_number || `#${c.id.slice(0, 6)}`}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.phone} • هوية: {c.national_id || 'غير مسجلة'}</div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#005154' }}>{c.account_code || '110201'}</td>
                  <td style={{ fontWeight: '700', fontSize: '12.5px' }}>{c.client_activity || 'عميل مسجل'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.last_activity || 'نشاط حديث'}</td>
                  <td style={{ fontSize: '12px' }}>{c.added_by || 'النظام'}</td>
                  <td><Badge text={c.branch || 'الفرع الرئيسي'} type="purple" /></td>
                  <td style={{ fontSize: '12px' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : 'اليوم'}</td>
                  <td><Badge text={c.status || 'نشط'} type="success" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                تسجيل عميل جديد بالدليل المحاسبي
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>

            <form onSubmit={handleAddClient}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم العميل بالكامل *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="الاسم الثلاثي أو اسم الشركة..."
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">رقم الجوال *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="+9665..."
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">رقم الهوية الوطنية / السجل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="10 أرقام..."
                    value={addForm.national_id}
                    onChange={e => setAddForm({ ...addForm, national_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">الفرع المربوط *</label>
                <select
                  className="filter-select"
                  value={addForm.branch}
                  onChange={e => setAddForm({ ...addForm, branch: e.target.value })}
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر</option>
                  <option>الإدارة العامة</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إنشاء الحساب وحفظ العميل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
