import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useShelterRecords, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';

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

  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            تسكين عاملة جديدة بالإيواء
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'excel', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'csv', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'pdf', `سجل الإيواء والإعاشة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('shelter', filteredItems, 'print', `سجل مركز الإيواء والإعاشة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي النزيلات حالياً</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{insideCount} عاملة</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">تسكين وإعاشة نشطة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">متاحات لنقل الكفالة / التأجير</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{transferCount} عاملة</div>
          <span className="text-xs text-purple-600 font-bold mt-1 inline-block">جاهزات للعمل الفوري</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">في مرحلة المغادرة / الترحيل</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{deportationCount} عاملة</div>
          <span className="text-xs text-slate-400 font-medium">بانتظار إصدار تذاكر السفر</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي الوجبات الموثقة</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalMeals} وجبة</div>
          <span className="text-xs text-slate-400 font-medium">سجل التموين والإعاشة</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'جميع النزيلات', count: shelterItems.length },
          { id: 'inside', label: 'داخل الإيواء', count: insideCount },
          { id: 'transfer', label: 'متاح للنقل والتأجير', count: transferCount },
          { id: 'deportation', label: 'مرحلة الترحيل', count: deportationCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubTab === tab.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="ابحث باسم العاملة، رقم الجواز، أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">كود النزيلة / الجواز</th>
                <th className="py-3.5 px-4">اسم العاملة والجنسية</th>
                <th className="py-3.5 px-4">العميل / مرجع العقد</th>
                <th className="py-3.5 px-4">مقر الإيواء</th>
                <th className="py-3.5 px-4">أيام الإقامة والوجبات</th>
                <th className="py-3.5 px-4">الرغبة في العمل</th>
                <th className="py-3.5 px-4">الحالة الحالية</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
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
