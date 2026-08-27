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
    branch: 'فرع الرياض الرئيسي',
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
    setAddForm({ name: '', phone: '', national_id: '', branch: 'فرع الرياض الرئيسي', type: 'شخص' });
  };

  const filteredClients = clients.filter((c: any) =>
    (c.client_no && c.client_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.name && c.name.includes(searchQuery)) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.national_id && c.national_id.includes(searchQuery))
  );

  return (
    <div style={{ fontFamily: 'var(--font-family-ui)', fontFeatureSettings: '"ss03" 1' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '11.5px' }}>CRM & CLIENT DIRECTORY</span>
            <span className="caption" style={{ color: '#71717a' }}>• الربط المحاسبي المباشر</span>
          </div>
          <h1 className="heading-xl" style={{ fontSize: '24px', fontWeight: 500, color: '#000000', margin: 0, fontFamily: 'var(--font-family-display)' }}>
            إدارة العملاء والعلاقات (CRM)
          </h1>
          <p className="caption" style={{ color: '#71717a', margin: '4px 0 0 0' }}>
            سجل العملاء المعتمد المربوط بالدليل المحاسبي، عقود الاستقدام، والتأجير والواتساب
          </p>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="button-primary-pill" onClick={() => setShowAddModal(true)} style={{ fontSize: '13px', padding: '7px 20px', minHeight: '40px' }}>
            <i className="fa-solid fa-plus"></i>
            <span>إضافة عميل جديد</span>
          </button>

          <button
            className="button-outline-on-light"
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            title="استيراد عملاء من ملف Excel / CSV"
            style={{ fontSize: '13px', padding: '7px 16px', minHeight: '40px' }}
          >
            <i className="fa-solid fa-file-import"></i>
            <span>استيراد Excel</span>
          </button>

          <button className="button-outline-on-light" onClick={() => exportData('clients', filteredClients, 'excel')} title="تصدير Excel" style={{ fontSize: '13px', padding: '7px 14px', minHeight: '40px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600"></i>
            <span>تصدير</span>
          </button>

          <button className="button-outline-on-light" onClick={() => exportData('clients', filteredClients, 'pdf')} title="تصدير PDF" style={{ fontSize: '13px', padding: '7px 14px', minHeight: '40px' }}>
            <i className="fa-solid fa-file-pdf text-rose-600"></i>
            <span>PDF</span>
          </button>

          <button className="button-outline-on-light" onClick={() => exportData('clients', filteredClients, 'print')} title="طباعة التقرير" style={{ fontSize: '13px', padding: '7px 14px', minHeight: '40px' }}>
            <i className="fa-solid fa-print"></i>
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Stats Bar: 3 Shopifi Metric Cards with Level 3 Stacked Shadows and Thin 330 Display Numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Card 1: Featured / Highlighted */}
        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px', opacity: 0.8 }}>
              إجمالي العملاء الموثقين
            </span>
            <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              تغطية شاملة
            </span>
          </div>
          <div className="display-md" style={{ fontSize: '42px', fontWeight: 330, letterSpacing: '-0.02em', margin: '4px 0 8px 0', color: '#ffffff' }}>
            241
            <span style={{ fontSize: '15px', fontWeight: 420, marginRight: '6px', opacity: 0.7 }}>عميلاً</span>
          </div>
          <div className="caption" style={{ fontSize: '12px', opacity: 0.7 }}>
            مربوط بالدليل المحاسبي
          </div>
        </div>

        {/* Card 2: Pistachio Band Card */}
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="eyebrow-cap" style={{ color: '#000000', fontWeight: 550 }}>
              عملاء العقود السارية
            </span>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              استقدام وتأجير
            </span>
          </div>
          <div className="display-md" style={{ fontSize: '42px', fontWeight: 330, letterSpacing: '-0.02em', margin: '4px 0 8px 0', color: '#000000' }}>
            198
            <span style={{ fontSize: '15px', fontWeight: 420, marginRight: '6px', color: '#52525b' }}>عميلاً</span>
          </div>
          <div className="caption" style={{ fontSize: '12px', color: '#52525b' }}>
            عقود نشطة عبر مساند
          </div>
        </div>

        {/* Card 3: White Pricing Card */}
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="eyebrow-cap" style={{ color: '#71717a' }}>
              محادثات الواتساب النشطة
            </span>
            <span className="pill-tag-shade" style={{ fontSize: '11px' }}>
              لايف شات
            </span>
          </div>
          <div className="display-md" style={{ fontSize: '42px', fontWeight: 330, letterSpacing: '-0.02em', margin: '4px 0 8px 0', color: '#000000' }}>
            43
            <span style={{ fontSize: '15px', fontWeight: 420, marginRight: '6px', color: '#71717a' }}>محادثة</span>
          </div>
          <div className="caption" style={{ fontSize: '12px', color: '#71717a' }}>
            متابعة حية مع خدمة العملاء
          </div>
        </div>
      </div>

      {/* Main Table Container: Shopifi Card with Search and Hairline Rows */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
        {/* Search & Filter Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#ffffff' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
            <input
              type="text"
              className="text-input"
              style={{
                borderRadius: '9999px',
                paddingRight: '36px',
                paddingLeft: '16px',
                height: '40px',
                minHeight: '40px',
                width: '100%',
                fontSize: '13px'
              }}
              placeholder="ابحث برقم العميل، الاسم، الجوال، أو رقم الهوية..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '12px' }}>
              إجمالي النتائج: {filteredClients.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontFamily: 'var(--font-family-ui)' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>رقم العميل</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>الاسم والبيانات</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>رقم الحساب المحاسبي</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>نشاط العميل الحالي</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>آخر نشاط مسجل</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>أضيف بواسطة</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>الفرع</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>تاريخ الإنشاء</th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 16px', color: '#71717a' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}></i>
                    جاري استرجاع سجلات العملاء المباشرة...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 16px', color: '#71717a' }}>
                    <i className="fa-regular fa-folder-open" style={{ fontSize: '32px', marginBottom: '8px', display: 'block', opacity: 0.3 }}></i>
                    لا يوجد عملاء مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredClients.map((c: any) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid #e4e4e7',
                      backgroundColor: '#ffffff',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f4f5'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 550, color: '#000000', fontSize: '13.5px', fontFamily: 'monospace' }}>
                      {c.client_no || c.client_number || `#${c.id.slice(0, 6)}`}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 550, color: '#000000', fontSize: '13.5px' }}>{c.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#71717a', marginTop: '2px' }}>{c.phone} • هوية: {c.national_id || 'غير مسجلة'}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 500, color: '#000000', fontSize: '13.5px', fontFamily: 'monospace' }}>
                      {c.account_code || '110201'}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 420, fontSize: '13px', color: '#27272a' }}>
                      {c.client_activity || 'عميل مسجل'}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12px', color: '#71717a' }}>
                      {c.last_activity || 'نشاط حديث'}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12.5px', color: '#52525b' }}>
                      {c.added_by || 'النظام'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="pill-tag-shade" style={{ fontSize: '11.5px' }}>{c.branch || 'الفرع الرئيسي'}</span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12px', color: '#71717a' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : 'اليوم'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="pill-tag-mint" style={{ fontSize: '11.5px' }}>{c.status || 'نشط'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#fafafa', borderTop: '1px solid #e4e4e7', fontSize: '12.5px', color: '#71717a' }}>
          <div>
            إجمالي السجلات: <strong style={{ color: '#000000' }}>{filteredClients.length}</strong> عميل
          </div>
          <div>
            نظام خالد السليم الموحد • Odoo 18 Multi-Entity
          </div>
        </div>
      </div>

      {/* Add Client Modal with Shopifi Card & Pill Buttons */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-pricing" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="pill-tag-mint" style={{ fontSize: '11px', marginBottom: '6px' }}>NEW RECORD</span>
                <h3 className="heading-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: '#000000', fontFamily: 'var(--font-family-display)' }}>
                  تسجيل عميل جديد بالدليل المحاسبي
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', fontSize: '18px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>اسم العميل بالكامل *</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="الاسم الثلاثي أو اسم الشركة..."
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>رقم الجوال *</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="+9665..."
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>رقم الهوية / السجل *</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="10 أرقام..."
                    value={addForm.national_id}
                    onChange={e => setAddForm({ ...addForm, national_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>الفرع المربوط *</label>
                <select
                  className="text-input"
                  value={addForm.branch}
                  onChange={e => setAddForm({ ...addForm, branch: e.target.value })}
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر</option>
                  <option>الإدارة العامة</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="button-outline-on-light" onClick={() => setShowAddModal(false)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
                  إلغاء
                </button>
                <button type="submit" className="button-primary-pill" style={{ fontSize: '13px', padding: '6px 22px', minHeight: '38px' }}>
                  إنشاء الحساب وحفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;

