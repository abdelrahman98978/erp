import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';

export interface ClientRecord {
  id: string;
  client_no: string;
  name: string;
  phone: string;
  national_id: string;
  account_code: string;
  client_activity: string;
  last_activity: string;
  added_by: string;
  branch: string;
  created_at: string;
  status: 'نشط' | 'موقوف' | 'جديد';
}

const MOCK_CLIENTS: ClientRecord[] = [
  {
    id: 'c-1',
    client_no: 'CLI-2026-0241',
    name: 'بندر صالح الهويريني',
    phone: '+966555774494',
    national_id: '1092837410',
    account_code: '1102001',
    client_activity: 'عقد استقدام ساري',
    last_activity: 'سدد سند قبض #59 بقيمة 138 ر.س',
    added_by: 'سارة خالد (فرع الرياض)',
    branch: 'فرع الرياض',
    created_at: '2026-07-28',
    status: 'نشط'
  },
  {
    id: 'c-2',
    client_no: 'CLI-2026-0240',
    name: 'سارة أحمد محمد',
    phone: '+966558025628',
    national_id: '1088273641',
    account_code: '1102002',
    client_activity: 'عقد تأجير تشغيلي',
    last_activity: 'إصدار فاتورة إيجار #12',
    added_by: 'فهد العتيبي (فرع جدة)',
    branch: 'فرع جدة',
    created_at: '2026-07-25',
    status: 'نشط'
  },
  {
    id: 'c-3',
    client_no: 'CLI-2026-0239',
    name: 'شركة دار الرواد للمقاولات',
    phone: '+966114889200',
    national_id: '7001234567',
    account_code: '1102003',
    client_activity: 'حجز 5 عمالة مهنية',
    last_activity: 'تقديم طلب استرجاع تأمين سكن',
    added_by: 'عبدالفتح (الإدارة العامة)',
    branch: 'الإدارة العامة',
    created_at: '2026-07-15',
    status: 'نشط'
  },
  {
    id: 'c-4',
    client_no: 'CLI-2026-0238',
    name: 'ابو اياد',
    phone: '+966562404213',
    national_id: '1055273940',
    account_code: '1102004',
    client_activity: 'عقد نقل كفالة',
    last_activity: 'تأكيد فترة التجربة 7 أيام',
    added_by: 'سارة خالد (فرع الرياض)',
    branch: 'فرع الرياض',
    created_at: '2026-07-10',
    status: 'نشط'
  }
];

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientRecord[]>(MOCK_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    national_id: '',
    branch: 'فرع الرياض'
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone || !addForm.national_id) return;

    const newC: ClientRecord = {
      id: `c-${Date.now()}`,
      client_no: `CLI-2026-0${242 + clients.length}`,
      name: addForm.name,
      phone: addForm.phone,
      national_id: addForm.national_id,
      account_code: `11020${clients.length + 5}`,
      client_activity: 'عميل جديد - بانتظار التعاقد',
      last_activity: 'إنشاء ملف العميل بالنظام',
      added_by: 'المستخدم الحالي',
      branch: addForm.branch,
      created_at: new Date().toISOString().slice(0, 10),
      status: 'نشط'
    };

    setClients([newC, ...clients]);
    setShowAddModal(false);
    setAddForm({ name: '', phone: '', national_id: '', branch: 'فرع الرياض' });
    alert(`تمت إضافة العميل الجديد (${newC.name}) وإنشاء رقم الحساب المحاسبي (${newC.account_code}) بنجاح!`);
  };

  const filteredClients = clients.filter(c =>
    c.client_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.includes(searchQuery) ||
    c.phone.includes(searchQuery) ||
    c.national_id.includes(searchQuery)
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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-user-plus ml-1"></i> إضافة عميل جديد
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('clients', filteredClients, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('clients', filteredClients, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('clients', filteredClients, 'csv')} title="تصدير CSV">
            <i className="fa-solid fa-file-csv text-primary ml-1"></i> CSV
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
            {filteredClients.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{c.client_no}</td>
                <td>
                  <div style={{ fontWeight: '700' }}>{c.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.phone} • هوية: {c.national_id}</div>
                </td>
                <td style={{ fontWeight: '800', color: '#005154' }}>{c.account_code}</td>
                <td style={{ fontWeight: '700', fontSize: '12.5px' }}>{c.client_activity}</td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.last_activity}</td>
                <td style={{ fontSize: '12px' }}>{c.added_by}</td>
                <td><Badge text={c.branch} type="purple" /></td>
                <td style={{ fontSize: '12px' }}>{c.created_at}</td>
                <td><Badge text={c.status} type="success" /></td>
              </tr>
            ))}
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
