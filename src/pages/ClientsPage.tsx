import React, { useState } from 'react';
import { exportData } from '../services/exportService';
import { useClients, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { UserCheck, Plus, FileSpreadsheet, FileText, Printer, Search, Upload, X, Check } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>CRM & CLIENT DIRECTORY</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة العملاء والعلاقات (CRM)
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              سجل العملاء المعتمد المربوط بالدليل المحاسبي، عقود الاستقدام، والتأجير والواتساب
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="button-white-pill"
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>إضافة عميل جديد</span>
          </button>

          <button
            className="button-outline-on-dark"
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <Upload className="w-4 h-4 ml-1 text-emerald-400" />
            <span>استيراد Excel</span>
          </button>

          <button
            className="button-outline-on-dark"
            onClick={() => exportData('clients', filteredClients, 'excel')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-400" />
            <span>Excel</span>
          </button>

          <button
            className="button-outline-on-dark"
            onClick={() => exportData('clients', filteredClients, 'pdf')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-400" />
            <span>PDF</span>
          </button>

          <button
            className="button-outline-on-dark"
            onClick={() => exportData('clients', filteredClients, 'print')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <Printer className="w-4 h-4 ml-1" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>إجمالي العملاء الموثقين</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>241 عميلاً</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>مربوط بالدليل المحاسبي</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>عملاء العقود السارية</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>198 عميلاً</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>استقدام وتأجير</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>محادثات الواتساب النشطة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>43 محادثة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>لايف شات CRM</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث برقم العميل، الاسم، الجوال، أو رقم الهوية..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>

          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            إجمالي النتائج: {filteredClients.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">رقم العميل</th>
                <th className="p-3.5">الاسم والبيانات</th>
                <th className="p-3.5">رقم الحساب المحاسبي</th>
                <th className="p-3.5">نشاط العميل الحالي</th>
                <th className="p-3.5">آخر نشاط مسجل</th>
                <th className="p-3.5">أضيف بواسطة</th>
                <th className="p-3.5">الفرع</th>
                <th className="p-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    جاري استرجاع سجلات العملاء المباشرة...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    لا يوجد عملاء مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredClients.map((c: any) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">
                      {c.client_no || c.client_number || `#${c.id.slice(0, 6)}`}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{c.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{c.phone} • هوية: {c.national_id || 'غير مسجلة'}</div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-600 font-bold">
                      {c.account_code || '110201'}
                    </td>
                    <td className="p-3.5 font-semibold text-zinc-800">
                      {c.client_activity || 'عميل مسجل'}
                    </td>
                    <td className="p-3.5 text-zinc-500">
                      {c.last_activity || 'نشاط حديث'}
                    </td>
                    <td className="p-3.5 text-zinc-600 font-medium">
                      {c.added_by || 'النظام'}
                    </td>
                    <td className="p-3.5">
                      <span className="pill-tag-shade text-[11px]">{c.branch || 'الفرع الرئيسي'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="pill-tag-mint text-[11px]">{c.status || 'نشط'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>تسجيل عميل جديد بالدليل المحاسبي</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم العميل بالكامل *</label>
                <input
                  type="text"
                  placeholder="الاسم الثلاثي أو اسم الشركة..."
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الجوال *</label>
                  <input
                    type="text"
                    placeholder="+9665..."
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs font-mono text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهوية / السجل *</label>
                  <input
                    type="text"
                    placeholder="10 أرقام..."
                    value={addForm.national_id}
                    onChange={e => setAddForm({ ...addForm, national_id: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs font-mono text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الفرع المربوط *</label>
                <select
                  value={addForm.branch}
                  onChange={e => setAddForm({ ...addForm, branch: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر</option>
                  <option>الإدارة العامة</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                <button type="button" className="button-outline-on-light" onClick={() => setShowAddModal(false)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                  إلغاء
                </button>
                <button type="submit" className="button-primary-pill" style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                  <Check className="w-4 h-4 ml-1" />
                  <span>إنشاء الحساب وحفظ العميل</span>
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
