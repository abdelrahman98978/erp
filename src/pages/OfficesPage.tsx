import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

export interface ForeignOffice {
  id: string;
  name: string;
  manager: string;
  nationality: string;
  license_no: string;
  account_code: string;
  phone: string;
  email: string;
  cvs_count: number;
  contracts_count: number;
  cost_usd: number;
  commission_sar: number;
  balance_usd: number;
  status: 'نشط' | 'متوقف' | 'تحت المراجعة';
}

const MOCK_OFFICES: ForeignOffice[] = [
  {
    id: 'OFF-101',
    name: 'AILEEN FOREIGN EMPLOYMENT AGENT PLC',
    manager: 'أيلين تسفاي',
    nationality: 'إثيوبيا',
    license_no: 'ETH-MOL-8841',
    account_code: '22117',
    phone: '+251911223344',
    email: 'info@aileen-agency.et',
    cvs_count: 28,
    contracts_count: 19,
    cost_usd: 950,
    commission_sar: 3562,
    balance_usd: 12400,
    status: 'نشط'
  },
  {
    id: 'OFF-102',
    name: 'DAMAS FOREIGN EMPLOYMENT AGENCY',
    manager: 'داويت برهاني',
    nationality: 'إثيوبيا',
    license_no: 'ETH-MOL-7712',
    account_code: '22105',
    phone: '+251922556677',
    email: 'damas@recruit-eth.com',
    cvs_count: 42,
    contracts_count: 31,
    cost_usd: 1000,
    commission_sar: 3750,
    balance_usd: 8500,
    status: 'نشط'
  },
  {
    id: 'OFF-103',
    name: "PLATINUM BROTHERS INT'L MANPOWER",
    manager: 'إدواردو سانشيز',
    nationality: 'الفلبين',
    license_no: 'POEA-041-LB-2024',
    account_code: '22109',
    phone: '+639178889900',
    email: 'contact@platinumbrothers.ph',
    cvs_count: 64,
    contracts_count: 48,
    cost_usd: 1450,
    commission_sar: 5437,
    balance_usd: 24800,
    status: 'نشط'
  },
  {
    id: 'OFF-104',
    name: 'AL-MANAR INTERNATIONAL RECRUITMENT',
    manager: 'جون أوكوت',
    nationality: 'أوغندا',
    license_no: 'UG-MGLSD-552',
    account_code: '22112',
    phone: '+256772112233',
    email: 'almanar@manpower-ug.com',
    cvs_count: 35,
    contracts_count: 22,
    cost_usd: 1100,
    commission_sar: 4125,
    balance_usd: 15200,
    status: 'نشط'
  },
  {
    id: 'OFF-105',
    name: 'ROYAL LANKA GLOBAL SERVICES',
    manager: 'كومارا ويجيراتني',
    nationality: 'سيريلانكا',
    license_no: 'SLBFE-990-2024',
    account_code: '22115',
    phone: '+94771234567',
    email: 'operations@royallanka.lk',
    cvs_count: 18,
    contracts_count: 14,
    cost_usd: 1600,
    commission_sar: 6000,
    balance_usd: 9600,
    status: 'نشط'
  },
  {
    id: 'OFF-106',
    name: 'NAIROBI PRIME SKILLS LTD',
    manager: 'بيتر موانجي',
    nationality: 'كينيا',
    license_no: 'KE-NEA-3341',
    account_code: '22119',
    phone: '+254722998877',
    email: 'prime@kenya-manpower.co.ke',
    cvs_count: 25,
    contracts_count: 16,
    cost_usd: 1050,
    commission_sar: 3937,
    balance_usd: 7200,
    status: 'نشط'
  }
];

export const OfficesPage: React.FC = () => {
  const [offices, setOffices] = useState<ForeignOffice[]>([]);
  const [countryFilter, setCountryFilter] = useState<string>('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOfficeStatement, setSelectedOfficeStatement] = useState<ForeignOffice | null>(null);

  // New Office Form State
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    nationality: 'الفلبين',
    license_no: '',
    account_code: '22120',
    phone: '',
    email: '',
    cost_usd: 1200
  });

  useEffect(() => {
    realErpDataStore.getRecords<ForeignOffice>('offices', MOCK_OFFICES).then(data => setOffices(data));
  }, []);

  const handleCreateOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOffice: ForeignOffice = {
      id: `OFF-${Date.now().toString().slice(-3)}`,
      name: formData.name,
      manager: formData.manager || 'مدير معتمد',
      nationality: formData.nationality,
      license_no: formData.license_no || `LIC-${Date.now().toString().slice(-4)}`,
      account_code: formData.account_code,
      phone: formData.phone,
      email: formData.email,
      cvs_count: 0,
      contracts_count: 0,
      cost_usd: Number(formData.cost_usd) || 1200,
      commission_sar: Math.round(Number(formData.cost_usd) * 3.75),
      balance_usd: 0,
      status: 'نشط'
    };

    const updated = await realErpDataStore.addRecord<ForeignOffice>('offices', newOffice, MOCK_OFFICES);
    setOffices(updated);
    setShowAddModal(false);
    setFormData({
      name: '',
      manager: '',
      nationality: 'الفلبين',
      license_no: '',
      account_code: '22120',
      phone: '',
      email: '',
      cost_usd: 1200
    });
  };

  const countries = ['الكل', 'الفلبين', 'إثيوبيا', 'أوغندا', 'سيريلانكا', 'كينيا'];

  const filteredOffices = offices.filter(o => {
    if (countryFilter !== 'الكل' && o.nationality !== countryFilter) return false;
    return true;
  });

  const totalCvs = offices.reduce((sum, o) => sum + o.cvs_count, 0);
  const totalContracts = offices.reduce((sum, o) => sum + o.contracts_count, 0);
  const totalBalanceUsd = offices.reduce((sum, o) => sum + o.balance_usd, 0);

  const columns: Column<ForeignOffice>[] = [
    {
      header: 'كود المكتب',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)', fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'اسم المكتب الخارجي والمدير',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#1E293B' }}>{row.name}</span>
          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
            <i className="fa-solid fa-user-tie ml-1 text-slate-400"></i> المدير: {row.manager} | ترخيص: {row.license_no}
          </div>
        </div>
      )
    },
    {
      header: 'دولة المصدر',
      accessor: (row) => (
        <Badge
          text={row.nationality}
          type="info"
          icon="fa-solid fa-earth-americas"
        />
      )
    },
    {
      header: 'الحساب المحاسبي',
      accessor: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px' }}>
          {row.account_code}
        </span>
      )
    },
    {
      header: 'السير والعقود',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#0F172A' }}>سير: {row.cvs_count ?? 0}</span>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>عقود نشطة: {row.contracts_count ?? 0}</div>
        </div>
      )
    },
    {
      header: 'التكلفة بالدولار ($)',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#D97706', fontSize: '13px' }}>
            ${(row.cost_usd ?? 0).toLocaleString()}
          </span>
          <div style={{ fontSize: '10.5px', color: '#64748B' }}>
            (~{(row.commission_sar ?? 0).toLocaleString()} ر.س)
          </div>
        </div>
      )
    },
    {
      header: 'رصيد المحفظة ($)',
      accessor: (row) => (
        <span style={{ fontWeight: '800', color: '#059669', fontFamily: 'monospace', fontSize: '13px' }}>
          ${(row.balance_usd ?? 0).toLocaleString()}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} />
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', height: '28px', fontSize: '11px' }}
            onClick={() => setSelectedOfficeStatement(row)}
            title="كشف حساب المعاملات"
          >
            <i className="fa-solid fa-file-invoice-dollar ml-1"></i> كشف حساب
          </button>
          <button
            className="btn-odoo btn-odoo-purple"
            style={{ padding: '4px 8px', height: '28px', fontSize: '11px' }}
            title="إعادة تعيين بيانات الدخول"
          >
            <i className="fa-solid fa-key ml-1"></i> البوابة
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#3B82F6', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              INTERNATIONAL AGENCIES
            </span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>شبكة الوكلاء المعتمدين دولياً</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            إدارة المكاتب والوكلاء الخارجيين (Overseas Manpower Agencies)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#CBD5E1' }}>
            إدارة عقود واتفاقيات المكاتب الخارجية، ميزانيات السير، تسوية الدفعات بالدولار، وحسابات الدخول
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 18px', fontSize: '13px', background: '#059669', borderColor: '#059669' }}
          >
            <i className="fa-solid fa-plus ml-1"></i> إضافة مكتب خارجي جديد
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي الوكلاء الدوليين"
          value={`${offices.length} وكالات`}
          icon="fa-solid fa-earth-americas"
          subtext="مرخصة ومعتمدة لدى مساند"
          variant="teal"
        />
        <StatCard
          title="إجمالي السير المرفوعة"
          value={`${totalCvs} سيرة ذاتية`}
          icon="fa-solid fa-file-lines"
          subtext="جاهزة للتعاقد الفوري"
          variant="purple"
        />
        <StatCard
          title="عقود الاستقدام المنجزة"
          value={`${totalContracts} عقد`}
          icon="fa-solid fa-file-circle-check"
          subtext="تم التفييز وإصدار التذاكر"
          variant="info"
        />
        <StatCard
          title="أرصدة المحافظ والحسابات"
          value={`$${totalBalanceUsd.toLocaleString()}`}
          icon="fa-solid fa-dollar-sign"
          subtext="أمانات وتسويات مكاتب خارجية"
          variant="warning"
        />
      </div>

      {/* Country Filter Bar & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid #CBD5E1',
                background: countryFilter === c ? '#0F172A' : '#FFF',
                color: countryFilter === c ? '#FFF' : '#334155',
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('offices', filteredOffices, 'excel')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('offices', filteredOffices, 'pdf')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOffices}
        searchPlaceholder="ابحث باسم المكتب الخارجي، كود الحساب، الترخيص، أو اسم المدير..."
        onAddClick={() => setShowAddModal(true)}
        addLabel="إضافة وكالة خارجية جديدة"
      />

      {/* ADD OFFICE MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                <i className="fa-solid fa-building-circle-plus text-emerald-600 ml-2"></i> تسجيل وكالة استقدام خارجية جديدة
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateOffice} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>اسم المكتب الخارجي (الرسمي)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: MANILA ELITE RECRUITMENT CORP"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>دولة المصدر</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="الفلبين">الفلبين</option>
                    <option value="إثيوبيا">إثيوبيا</option>
                    <option value="أوغندا">أوغندا</option>
                    <option value="سيريلانكا">سيريلانكا</option>
                    <option value="كينيا">كينيا</option>
                    <option value="بنجلاديش">بنجلاديش</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>اسم المدير المسؤول</label>
                  <input
                    type="text"
                    placeholder="مثال: مارك أنتوني"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>رقم الترخيص الخارجي</label>
                  <input
                    type="text"
                    placeholder="POEA-XXX-2026"
                    value={formData.license_no}
                    onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>كود الحساب المحاسبي (ERP)</label>
                  <input
                    type="text"
                    value={formData.account_code}
                    onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>رقم هاتف الوكالة الدولي</label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>البريد الإلكتروني للوكالة</label>
                  <input
                    type="email"
                    placeholder="agency@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', direction: 'ltr', textAlign: 'right' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>تكلفة العقد بالدولار ($ USD)</label>
                <input
                  type="number"
                  value={formData.cost_usd}
                  onChange={(e) => setFormData({ ...formData, cost_usd: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-odoo btn-odoo-secondary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-odoo btn-odoo-primary"
                  style={{ padding: '8px 20px', fontSize: '13px', background: '#0F172A', borderColor: '#0F172A' }}
                >
                  حفظ واعتماد الوكالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATEMENT MODAL */}
      {selectedOfficeStatement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                  كشف حساب المعاملات: {selectedOfficeStatement.name}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748B' }}>كود الحساب: {selectedOfficeStatement.account_code} | الدولة: {selectedOfficeStatement.nationality}</span>
              </div>
              <button onClick={() => setSelectedOfficeStatement(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>الرصيد الدائن المستحق</div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#059669' }}>${(selectedOfficeStatement.balance_usd ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>إجمالي العقود المنجزة</div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#2563EB' }}>{selectedOfficeStatement.contracts_count ?? 0} عقود</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>متوسط العمولة للعقد</div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#D97706' }}>${(selectedOfficeStatement.cost_usd ?? 0).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.6' }}>
              • تم إجراء آخر تسوية نقدية عبر التحويل البنكي الخارجي بتاريخ 2026-08-10 بمبلغ $5,000.<br />
              • توجد 3 إرساليات قيد إجراءات إصدار تذاكر الطيران للوصول إلى مطار الملك خالد الدولي.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                className="btn-odoo btn-odoo-secondary"
                onClick={() => exportData('offices', [selectedOfficeStatement], 'pdf')}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> طباعة كشف الحساب
              </button>
              <button
                className="btn-odoo btn-odoo-primary"
                onClick={() => setSelectedOfficeStatement(null)}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
