import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { Building, Plus, FileSpreadsheet, FileText, Search, FileSignature, Key, X, DollarSign } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
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
    const matchesCountry = countryFilter === 'الكل' || o.nationality === countryFilter;
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.manager.includes(searchQuery) ||
      o.account_code.includes(searchQuery);
    return matchesCountry && matchesSearch;
  });

  const totalCvs = offices.reduce((sum, o) => sum + o.cvs_count, 0);
  const totalContracts = offices.reduce((sum, o) => sum + o.contracts_count, 0);
  const totalBalanceUsd = offices.reduce((sum, o) => sum + o.balance_usd, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                INTERNATIONAL AGENCIES
              </span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: 0, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
              إدارة المكاتب والوكلاء الخارجيين
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
              إدارة عقود واتفاقيات المكاتب الخارجية، ميزانيات السير، تسوية الدفعات بالدولار، وحسابات الدخول
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة مكتب خارجي جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>إجمالي الوكلاء الدوليين</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{offices.length} وكالات</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>مرخصة لدى مساند</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>إجمالي السير المرفوعة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalCvs} سيرة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>جاهزة للتعاقد الفوري</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#a1a1aa' }}>عقود الاستقدام المنجزة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalContracts} عقد</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>تم التفييز والتذاكر</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>أرصدة المحافظ والحسابات</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>${totalBalanceUsd.toLocaleString()}</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>رصيد دائن بالدولار</span>
        </div>
      </div>

      {/* Country Filter Bar & Export */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {countries.map(c => {
            const isActive = countryFilter === c;
            return (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: isActive ? '#000000' : '#e4e4e7',
                  backgroundColor: isActive ? '#000000' : '#ffffff',
                  color: isActive ? '#ffffff' : '#27272a',
                  fontWeight: isActive ? 550 : 420,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button className="button-outline-on-light" onClick={() => exportData('offices', filteredOffices, 'excel')} style={{ padding: '6px 14px', fontSize: '12px', minHeight: '36px' }}>
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('offices', filteredOffices, 'pdf')} style={{ padding: '6px 14px', fontSize: '12px', minHeight: '36px' }}>
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث باسم المكتب، كود الحساب، أو المدير..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد: {filteredOffices.length} وكالة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">كود المكتب</th>
                <th className="p-3.5">اسم المكتب والمدير</th>
                <th className="p-3.5">دولة المصدر</th>
                <th className="p-3.5">الحساب المحاسبي</th>
                <th className="p-3.5">السير والعقود</th>
                <th className="p-3.5">التكلفة بالدولار</th>
                <th className="p-3.5">رصيد المحفظة ($)</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOffices.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono font-bold text-black">{row.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{row.name}</div>
                    <div className="text-[11px] text-zinc-500">المدير: {row.manager} | ترخيص: {row.license_no}</div>
                  </td>
                  <td className="p-3.5">
                    <Badge text={row.nationality} type="info" />
                  </td>
                  <td className="p-3.5">
                    <span className="pill-tag-shade" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                      {row.account_code}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">سير: {row.cvs_count ?? 0}</div>
                    <div className="text-[11px] text-emerald-700 font-bold">عقود: {row.contracts_count ?? 0}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-amber-700">${(row.cost_usd ?? 0).toLocaleString()}</div>
                    <div className="text-[10.5px] text-zinc-400">~{(row.commission_sar ?? 0).toLocaleString()} ر.س</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    ${(row.balance_usd ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} />
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        className="button-outline-on-light"
                        style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        onClick={() => setSelectedOfficeStatement(row)}
                      >
                        <DollarSign className="w-3 h-3 ml-1 text-emerald-600" />
                        <span>كشف حساب</span>
                      </button>
                      <button
                        className="button-outline-on-light"
                        style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                        onClick={() => alert(`إعادة ضبط وتفعيل بوابة الوكيل لـ ${row.name}`)}
                        title="البوابة"
                      >
                        <Key className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD OFFICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>تسجيل وكالة استقدام خارجية جديدة</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffice} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم المكتب الخارجي (الرسمي) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: MANILA ELITE RECRUITMENT CORP"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">دولة المصدر</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
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
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم المدير المسؤول</label>
                  <input
                    type="text"
                    placeholder="مثال: مارك أنتوني"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الترخيص الخارجي</label>
                  <input
                    type="text"
                    placeholder="POEA-XXX-2026"
                    value={formData.license_no}
                    onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">كود الحساب المحاسبي (ERP)</label>
                  <input
                    type="text"
                    value={formData.account_code}
                    onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهاتف الدولي</label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="agency@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">تكلفة العقد بالدولار ($ USD)</label>
                <input
                  type="number"
                  value={formData.cost_usd}
                  onChange={(e) => setFormData({ ...formData, cost_usd: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">كشف حساب المعاملات: {selectedOfficeStatement.name}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">كود الحساب: {selectedOfficeStatement.account_code} | الدولة: {selectedOfficeStatement.nationality}</p>
              </div>
              <button onClick={() => setSelectedOfficeStatement(null)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white text-black">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[11px] text-zinc-500">الرصيد الدائن المستحق</div>
                  <div className="text-base font-mono font-bold text-emerald-700">${(selectedOfficeStatement.balance_usd ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500">العقود المنجزة</div>
                  <div className="text-base font-mono font-bold text-black">{selectedOfficeStatement.contracts_count ?? 0} عقود</div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500">متوسط العمولة</div>
                  <div className="text-base font-mono font-bold text-amber-700">${(selectedOfficeStatement.cost_usd ?? 0).toLocaleString()}</div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                • تم إجراء آخر تسوية نقدية عبر التحويل البنكي الخارجي بتاريخ 2026-08-10 بمبلغ $5,000.<br />
                • توجد 3 إرساليات قيد إجراءات إصدار تذاكر الطيران للوصول إلى مطار الملك خالد الدولي.
              </p>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  className="button-outline-on-light"
                  onClick={() => exportData('offices', [selectedOfficeStatement], 'pdf')}
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  <FileText className="w-4 h-4 ml-1 text-rose-600" />
                  <span>طباعة كشف الحساب</span>
                </button>
                <button
                  className="button-primary-pill"
                  onClick={() => setSelectedOfficeStatement(null)}
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficesPage;
