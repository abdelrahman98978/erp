import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useShelterRecords, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';

export interface ShelterRecordItem {
  id: string;
  company_id: string;
  maid_name: string;
  nationality: string;
  passport: string;
  client_name?: string;
  contract_ref?: string;
  shelter_location: string;
  days_in_shelter: number;
  catering_meals_count: number;
  work_willingness: 'ترغب بالعمل' | 'لا ترغب بالعمل' | 'غير محدد';
  status: 'داخل الإيواء' | 'متاح للنقل' | 'مرحلة الترحيل' | 'خارج الإيواء' | 'تم الترحيل';
  created_at: string;
}

const DEFAULT_MOCK_SHELTER: ShelterRecordItem[] = [
  {
    id: 'SH-2026-001',
    company_id: 'SAF',
    maid_name: 'سارة أديسي (Sara Ethiopian)',
    nationality: 'إثيوبيا',
    passport: 'EP9827341',
    client_name: 'شركة توباز للتأجير',
    contract_ref: 'RC-2026-0014',
    shelter_location: 'مقر الإيواء الرئيسي - الرياض',
    days_in_shelter: 12,
    catering_meals_count: 36,
    work_willingness: 'ترغب بالعمل',
    status: 'داخل الإيواء',
    created_at: new Date().toISOString(),
  },
  {
    id: 'SH-2026-002',
    company_id: 'SAF',
    maid_name: 'ماري جين سانتوس (Mary Jane Santos)',
    nationality: 'الفلبين',
    passport: 'PH8849201',
    client_name: 'دار الرواد للمقاولات',
    contract_ref: 'RC-2026-0012',
    shelter_location: 'مقر الإيواء - جدة',
    days_in_shelter: 4,
    catering_meals_count: 12,
    work_willingness: 'ترغب بالعمل',
    status: 'متاح للنقل',
    created_at: new Date().toISOString(),
  },
  {
    id: 'SH-2026-003',
    company_id: 'SAF',
    maid_name: 'فلورنس ناباتانزي (Florence Nabatanzi)',
    nationality: 'أوغندا',
    passport: 'UG1102938',
    client_name: 'السفير للخدمات',
    contract_ref: 'RC-2026-0009',
    shelter_location: 'مقر الإيواء - الخبر',
    days_in_shelter: 28,
    catering_meals_count: 84,
    work_willingness: 'لا ترغب بالعمل',
    status: 'مرحلة الترحيل',
    created_at: new Date().toISOString(),
  },
];

export const ShelterPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawShelter = [], isLoading } = useShelterRecords();
  const { createItem, updateItem } = useTableMutation('shelter_records');

  const shelterItems: ShelterRecordItem[] = rawShelter.length > 0 ? (rawShelter as ShelterRecordItem[]) : DEFAULT_MOCK_SHELTER;

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): string => {
    switch (tabKey) {
      case 'inside-shelter': return 'inside';
      case 'outside-shelter': return 'outside';
      case 'available-transfer': return 'available';
      case 'deportation-stage': return 'deportation';
      case 'shelter-places': return 'places';
      default: return 'all';
    }
  };

  const [activeSubTab, setActiveSubTab] = useState<string>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveSubTab(getMappedTab(storeActiveTab));
    if (storeActiveTab === 'create-shelter') {
      setShowAddModal(true);
    }
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(() => storeActiveTab === 'create-shelter');

  // Add Form State
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('إثيوبيا');
  const [passport, setPassport] = useState('');
  const [clientName, setClientName] = useState('');
  const [shelterLocation, setShelterLocation] = useState('مقر الإيواء الرئيسي - الرياض');
  const [workWillingness, setWorkWillingness] = useState<'ترغب بالعمل' | 'لا ترغب بالعمل' | 'غير محدد'>('ترغب بالعمل');

  const handleAddShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maidName || !passport) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const id = `SH-${Date.now().toString().slice(-6)}`;

    const newRecord = {
      id,
      company_id: companyCode,
      maid_name: maidName,
      nationality,
      passport,
      client_name: clientName || 'تحت التسكين المؤقت',
      shelter_location: shelterLocation,
      days_in_shelter: 1,
      catering_meals_count: 3,
      work_willingness: workWillingness,
      status: 'داخل الإيواء',
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setMaidName('');
    setPassport('');
    setClientName('');
  };

  const handleUpdateStatus = async (item: ShelterRecordItem, newStatus: ShelterRecordItem['status']) => {
    await updateItem.mutateAsync({
      id: item.id,
      data: { status: newStatus },
    });
  };

  const handleAddMeal = async (item: ShelterRecordItem) => {
    await updateItem.mutateAsync({
      id: item.id,
      data: { catering_meals_count: (item.catering_meals_count || 0) + 1 },
    });
  };

  const filteredItems = shelterItems.filter((item) => {
    const matchesSearch =
      item.maid_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.passport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client_name && item.client_name.includes(searchQuery));
    const matchesTab =
      activeSubTab === 'all' ||
      (activeSubTab === 'inside' && item.status === 'داخل الإيواء') ||
      (activeSubTab === 'transfer' && item.status === 'متاح للنقل') ||
      (activeSubTab === 'deportation' && item.status === 'مرحلة الترحيل') ||
      (activeSubTab === 'outside' && item.status === 'خارج الإيواء');
    return matchesSearch && matchesTab;
  });

  const insideCount = shelterItems.filter((i) => i.status === 'داخل الإيواء').length;
  const transferCount = shelterItems.filter((i) => i.status === 'متاح للنقل').length;
  const deportationCount = shelterItems.filter((i) => i.status === 'مرحلة الترحيل').length;
  const totalMeals = shelterItems.reduce((acc, i) => acc + (i.catering_meals_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-hotel text-emerald-600"></i>
            مركز الإيواء، الإعاشة، والرعاية (Shelter Hub)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة تسكين العمالة، تتبع الإعاشة والوجبات اليومية، وطلبات نقل الكفالة والترحيل لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-bed ml-1.5"></i>
            + تسكين نزيلة جديدة
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'excel', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'csv', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-csv ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'pdf', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#000000' }}>إجمالي النزيلات حالياً</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{insideCount} عاملة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>تسكين وإعاشة نشطة</span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a' }}>متاحات لنقل الكفالة / التأجير</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{transferCount} عاملة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '8px' }}>جاهزات للعمل الفوري</span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a' }}>في مرحلة المغادرة / الترحيل</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{deportationCount} عاملة</div>
          <span style={{ fontSize: '11.5px', color: '#71717a', marginTop: '6px', display: 'block' }}>بانتظار إصدار تذاكر السفر</span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a' }}>إجمالي الوجبات الموثقة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{totalMeals} وجبة</div>
          <span style={{ fontSize: '11.5px', color: '#71717a', marginTop: '6px', display: 'block' }}>سجل التموين والإعاشة</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: 'جميع النزيلات', count: shelterItems.length },
          { id: 'inside', label: 'داخل الإيواء', count: insideCount },
          { id: 'transfer', label: 'متاح للنقل والتأجير', count: transferCount },
          { id: 'deportation', label: 'مرحلة الترحيل', count: deportationCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeSubTab === tab.id ? '#000000' : '#e4e4e7',
              backgroundColor: activeSubTab === tab.id ? '#000000' : '#ffffff',
              color: activeSubTab === tab.id ? '#ffffff' : '#27272a',
              fontWeight: activeSubTab === tab.id ? 550 : 420,
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
            <input
              type="text"
              placeholder="ابحث باسم العاملة، رقم الجواز، أو اسم العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ borderRadius: '9999px', paddingRight: '36px', paddingLeft: '16px', height: '38px', minHeight: '38px', width: '320px', fontSize: '13px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '12px' }}>
            العدد المعروض: {filteredItems.length} نزيلة
          </span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="odoo-data-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>كود النزيلة / الجواز</th>
                <th>اسم العاملة والجنسية</th>
                <th>العميل / مرجع العقد</th>
                <th>مقر الإيواء</th>
                <th>أيام الإقامة والوجبات</th>
                <th>الرغبة في العمل</th>
                <th>الحالة الحالية</th>
                <th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع سجلات الإيواء...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-emerald-800">{item.id}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.passport}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.maid_name}</div>
                      <div className="text-xs text-slate-500">{item.nationality}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-bold text-slate-800">{item.client_name || 'تسكين عام'}</div>
                      <div className="text-slate-400">{item.contract_ref || 'بدون عقد'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                      {item.shelter_location}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-bold text-slate-900">{item.days_in_shelter} يوم</div>
                      <div className="text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{item.catering_meals_count} وجبة</span>
                        <button
                          onClick={() => handleAddMeal(item)}
                          className="px-1.5 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[10px]"
                          title="تسجيل وجبة إضافية"
                        >
                          + وجبة
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.work_willingness === 'ترغب بالعمل' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.work_willingness}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        text={item.status}
                        type={item.status === 'داخل الإيواء' ? 'purple' : item.status === 'متاح للنقل' ? 'success' : 'danger'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item, e.target.value as any)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
                      >
                        <option value="داخل الإيواء">داخل الإيواء</option>
                        <option value="متاح للنقل">متاح للنقل</option>
                        <option value="مرحلة الترحيل">مرحلة الترحيل</option>
                        <option value="خارج الإيواء">خارج الإيواء (تسليم)</option>
                        <option value="تم الترحيل">تم الترحيل</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inmate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-hotel text-emerald-400"></i>
                <h3 className="font-bold text-base">تسكين عاملة جديدة بمركز الإيواء</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddShelter} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العاملة بالكامل *</label>
                <input
                  type="text"
                  value={maidName}
                  onChange={(e) => setMaidName(e.target.value)}
                  placeholder="اسم العاملة حسب الجواز..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الجنسية *</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>إندونيسيا</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم جواز السفر *</label>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="Passport..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">مقر مركز الإيواء *</label>
                <select
                  value={shelterLocation}
                  onChange={(e) => setShelterLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                >
                  <option>مقر الإيواء الرئيسي - الرياض</option>
                  <option>مقر الإيواء - جدة</option>
                  <option>مقر الإيواء - الخبر والدمام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الرغبة في العمل</label>
                <select
                  value={workWillingness}
                  onChange={(e) => setWorkWillingness(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                >
                  <option value="ترغب بالعمل">ترغب بالعمل (متاحة لنقل الكفالة والتأجير)</option>
                  <option value="لا ترغب بالعمل">لا ترغب بالعمل (مرحلة الترحيل)</option>
                  <option value="غير محدد">غير محدد (تحت الفحص)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  تأكيد التسكين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterPage;
