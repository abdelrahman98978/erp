import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useShelterRecords, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { Hotel, Plus, FileSpreadsheet, FileText, Search, Utensils, X, Trash2 } from 'lucide-react';

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
  const { createItem, updateItem, deleteItem } = useTableMutation('shelter_records');
  const { addNotification } = useAppStore();

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
    addNotification({
      title: 'تسكين نزيلة جديدة',
      message: `تم تسكين النزيلة (${maidName}) بمقر (${shelterLocation}) بنجاح.`,
      type: 'success',
    });
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
    addNotification({
      title: 'تحديث حالة النزيلة',
      message: `تم تغيير حالة (${item.maid_name}) إلى (${newStatus}).`,
      type: 'info',
    });
  };

  const handleAddMeal = async (item: ShelterRecordItem) => {
    const newCount = (item.catering_meals_count || 0) + 1;
    await updateItem.mutateAsync({
      id: item.id,
      data: { catering_meals_count: newCount },
    });
    addNotification({
      title: 'تسجيل وجبة إعاشة',
      message: `تم تسجيل وجبة إضافية للنزيلة (${item.maid_name}) - الإجمالي: ${newCount} وجبة.`,
      type: 'success',
    });
  };

  const handleDeleteShelter = async (item: ShelterRecordItem) => {
    if (window.confirm(`هل أنت متأكد من حذف سجل تسكين (${item.maid_name})؟`)) {
      await deleteItem.mutateAsync(item.id);
      addNotification({
        title: 'حذف سجل الإيواء',
        message: `تم حذف السجل #${item.id} بنجاح.`,
        type: 'error',
      });
    }
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
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SHELTER & CATERING HUB</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              مركز الإيواء، الإعاشة، والرعاية
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              إدارة تسكين العمالة، تتبع الإعاشة والوجبات اليومية، وطلبات نقل الكفالة والترحيل لـ {activeCompany.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ تسكين نزيلة جديدة</span>
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'excel', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'pdf', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>إجمالي النزيلات حالياً</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{insideCount} عاملة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>تسكين وإعاشة نشطة</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>متاحات لنقل الكفالة / التأجير</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{transferCount} عاملة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>جاهزات للعمل الفوري</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>في مرحلة المغادرة / الترحيل</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{deportationCount} عاملة</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>بانتظار إصدار تذاكر السفر</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#a1a1aa' }}>إجمالي الوجبات الموثقة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalMeals} وجبة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>سجل التموين والإعاشة</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 pb-3">
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
              whiteSpace: 'nowrap'
            }}
          >
            <span>{tab.label}</span>
            <span className={activeSubTab === tab.id ? "pill-tag-mint" : "pill-tag-shade"} style={{ fontSize: '10px' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث باسم العاملة، رقم الجواز، أو اسم العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد المعروض: {filteredItems.length} نزيلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">كود النزيلة / الجواز</th>
                <th className="p-3.5">اسم العاملة والجنسية</th>
                <th className="p-3.5">العميل / مرجع العقد</th>
                <th className="p-3.5">مقر الإيواء</th>
                <th className="p-3.5">أيام الإقامة والوجبات</th>
                <th className="p-3.5">الرغبة في العمل</th>
                <th className="p-3.5">الحالة الحالية</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    جاري استرجاع سجلات الإيواء...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-black">{item.id}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{item.passport}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{item.maid_name}</div>
                      <div className="text-zinc-500">{item.nationality}</div>
                    </td>
                    <td className="p-3.5 text-xs">
                      <div className="font-bold text-black">{item.client_name || 'تسكين عام'}</div>
                      <div className="text-zinc-400">{item.contract_ref || 'بدون عقد'}</div>
                    </td>
                    <td className="p-3.5 font-bold text-zinc-700">
                      {item.shelter_location}
                    </td>
                    <td className="p-3.5 text-xs">
                      <div className="font-bold text-black">{item.days_in_shelter} يوم</div>
                      <div className="text-emerald-700 font-bold flex items-center gap-1.5 mt-0.5">
                        <span>{item.catering_meals_count} وجبة</span>
                        <button
                          onClick={() => handleAddMeal(item)}
                          className="button-outline-on-light"
                          style={{ padding: '1px 8px', fontSize: '10px', minHeight: '22px' }}
                          title="تسجيل وجبة إضافية"
                        >
                          <Utensils className="w-2.5 h-2.5 ml-1" />
                          <span>+ وجبة</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.work_willingness === 'ترغب بالعمل' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {item.work_willingness}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        text={item.status}
                        type={item.status === 'داخل الإيواء' ? 'purple' : item.status === 'متاح للنقل' ? 'success' : 'danger'}
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item, e.target.value as any)}
                          className="bg-zinc-50 border border-zinc-200 rounded-2xl py-1 px-2.5 text-xs font-bold text-black focus:border-black focus:outline-none"
                        >
                          <option value="داخل الإيواء">داخل الإيواء</option>
                          <option value="متاح للنقل">متاح للنقل</option>
                          <option value="مرحلة الترحيل">مرحلة الترحيل</option>
                          <option value="خارج الإيواء">خارج الإيواء (تسليم)</option>
                          <option value="تم الترحيل">تم الترحيل</option>
                        </select>
                        <button
                          onClick={() => handleDeleteShelter(item)}
                          className="p-1 rounded-full hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Hotel className="w-4 h-4 text-emerald-400" />
                <span>تسكين عاملة جديدة بمركز الإيواء</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShelter} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم العاملة بالكامل *</label>
                <input
                  type="text"
                  value={maidName}
                  onChange={(e) => setMaidName(e.target.value)}
                  placeholder="اسم العاملة حسب الجواز..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الجنسية *</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>إندونيسيا</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم جواز السفر *</label>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="Passport..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">مقر مركز الإيواء *</label>
                <select
                  value={shelterLocation}
                  onChange={(e) => setShelterLocation(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>مقر الإيواء الرئيسي - الرياض</option>
                  <option>مقر الإيواء - جدة</option>
                  <option>مقر الإيواء - الخبر والدمام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الرغبة في العمل</label>
                <select
                  value={workWillingness}
                  onChange={(e) => setWorkWillingness(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value="ترغب بالعمل">ترغب بالعمل (متاحة لنقل الكفالة والتأجير)</option>
                  <option value="لا ترغب بالعمل">لا ترغب بالعمل (مرحلة الترحيل)</option>
                  <option value="غير محدد">غير محدد (تحت الفحص)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
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
