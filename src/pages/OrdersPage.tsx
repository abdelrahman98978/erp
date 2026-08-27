import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useOrders, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';

export interface OrderRecord {
  id: string;
  company_id: string;
  client_id?: string;
  client_name: string;
  client_phone: string;
  maid_name?: string;
  nationality?: string;
  passport_number?: string;
  request_type: 'معروفة' | 'معينة' | 'حسب المواصفات';
  status: 'جديد' | 'تحت الإجراء' | 'تم التعاقد' | 'ملغي';
  timer_status: 'عادي' | 'حرج' | 'منتهي';
  deadline: string;
  contract_status: 'بدون عقد' | 'تم التعاقد';
  responsible_employee?: string;
  branch: string;
  office_name?: string;
  created_at: string;
}

const DEFAULT_MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-2026-001',
    company_id: 'SAF',
    client_name: 'بندر صالح الهويريني',
    client_phone: '+966555774494',
    maid_name: 'KIMBERLY (سيرة ذاتية مختارة)',
    nationality: 'الفلبين',
    passport_number: 'P882910',
    request_type: 'معينة',
    status: 'جديد',
    timer_status: 'عادي',
    deadline: '24 ساعة',
    contract_status: 'بدون عقد',
    responsible_employee: 'فهد العتيبي (مسوق)',
    branch: 'فرع الرياض الرئيسي',
    office_name: 'PLATINUM BROTHERS INT’L',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ORD-2026-002',
    company_id: 'SAF',
    client_name: 'سارة خالد الدوسري',
    client_phone: '+966559876543',
    maid_name: 'طلب عمالة إثيوبية مواصفات خاصة',
    nationality: 'إثيوبيا',
    passport_number: 'PENDING',
    request_type: 'حسب المواصفات',
    status: 'تحت الإجراء',
    timer_status: 'حرج',
    deadline: '12 ساعة',
    contract_status: 'بدون عقد',
    responsible_employee: 'فهد العتيبي (مسوق)',
    branch: 'فرع الرياض الرئيسي',
    office_name: 'DAMAS FOREIGN AGENCY',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ORD-2026-003',
    company_id: 'SAF',
    client_name: 'محمد عبدالله العتيبي',
    client_phone: '+966551234567',
    maid_name: 'FLORENCE NABATANZI',
    nationality: 'أوغندا',
    passport_number: 'UG99281',
    request_type: 'معروفة',
    status: 'تم التعاقد',
    timer_status: 'عادي',
    deadline: 'منتهي',
    contract_status: 'تم التعاقد',
    responsible_employee: 'سارة خالد (خدمة عملاء)',
    branch: 'فرع جدة',
    office_name: 'JAKARTA GLOBAL AGENCY',
    created_at: new Date().toISOString(),
  },
];

export const OrdersPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawOrders = [], isLoading } = useOrders();
  const { createItem, updateItem } = useTableMutation('orders');

  const orders: OrderRecord[] = rawOrders.length > 0 ? (rawOrders as OrderRecord[]) : DEFAULT_MOCK_ORDERS;

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedFilter = (tabKey: string) => {
    switch (tabKey) {
      case 'new-orders': return 'new';
      case 'contracted-orders': return 'contracted';
      case 'incomplete-orders': return 'incomplete';
      case 'professional-requests': return 'professional';
      case 'special-requests': return 'special';
      case 'renew-contracts': return 'renew';
      case 'known-service': return 'known';
      case 'contact-requests': return 'contact';
      default: return 'all';
    }
  };

  const [activeFilter, setActiveFilter] = useState(() => getMappedFilter(storeActiveTab));

  useEffect(() => {
    setActiveFilter(getMappedFilter(storeActiveTab));
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [requestType, setRequestType] = useState<'معروفة' | 'معينة' | 'حسب المواصفات'>('حسب المواصفات');
  const [officeName, setOfficeName] = useState('PLATINUM BROTHERS INT’L');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const id = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;

    const newRecord = {
      id,
      company_id: companyCode,
      client_name: clientName,
      client_phone: clientPhone,
      maid_name: maidName || 'حسب المواصفات المختارة',
      nationality,
      passport_number: 'PENDING',
      request_type: requestType,
      status: 'جديد',
      timer_status: 'عادي',
      deadline: '24 ساعة',
      contract_status: 'بدون عقد',
      responsible_employee: 'المستخدم الحالي',
      branch,
      office_name: officeName,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
  };

  const handleConvertToContract = async (order: OrderRecord) => {
    await updateItem.mutateAsync({
      id: order.id,
      data: {
        status: 'تم التعاقد',
        contract_status: 'تم التعاقد',
      },
    });
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.client_name.includes(searchQuery) ||
      ord.client_phone.includes(searchQuery);
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'new' && ord.status === 'جديد') ||
      (activeFilter === 'contracted' && ord.contract_status === 'تم التعاقد');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-cart-flatbed-suitcase text-purple-700"></i>
            إدارة طلبات العملاء والعمليات (Orders & Leads)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            متابعة طلبات الاستقدام الجديدة، مؤقتات الـ SLA، والتحويل إلى عقود مساند لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            + تسجيل طلب عميل جديد
          </button>
          <button
            onClick={() => exportData('orders', filteredOrders, 'excel', `طلبات الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('orders', filteredOrders, 'pdf', `طلبات الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i>
            PDF
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'جميع الطلبات', count: orders.length },
          { id: 'new', label: 'طلبات جديدة بانتظار العقد', count: orders.filter((o) => o.status === 'جديد').length },
          { id: 'contracted', label: 'تم التعاقد معهم', count: orders.filter((o) => o.contract_status === 'تم التعاقد').length },
        ].map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              <span className={isActive ? "pill-tag-mint" : "pill-tag-shade"} style={{ fontSize: '10px' }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff' }}>
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، أو الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-input"
            style={{ borderRadius: '9999px', padding: '0 16px', height: '38px', minHeight: '38px', width: '320px', fontSize: '13px' }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">رقم الطلب</th>
                <th className="py-3.5 px-4">بيانات العميل</th>
                <th className="py-3.5 px-4">المواصفات والجنسية</th>
                <th className="py-3.5 px-4">المكتب الخارجي</th>
                <th className="py-3.5 px-4">نوع الطلب</th>
                <th className="py-3.5 px-4">مهلة المعالجة</th>
                <th className="py-3.5 px-4">حالة العقد</th>
                <th className="py-3.5 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع الطلبات...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    لا توجد طلبات مسجلة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-purple-700">#{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ord.client_name}</div>
                      <div className="text-xs text-slate-400 font-mono">{ord.client_phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ord.maid_name}</div>
                      <div className="text-xs text-slate-500">{ord.nationality}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-600">{ord.office_name || 'مكتب مانيلا'}</td>
                    <td className="py-3.5 px-4">
                      <Badge text={ord.request_type} type="purple" />
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i> {ord.deadline}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        text={ord.contract_status}
                        type={ord.contract_status === 'تم التعاقد' ? 'success' : 'warning'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ord.contract_status !== 'تم التعاقد' ? (
                        <button
                          onClick={() => handleConvertToContract(ord)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto"
                        >
                          <i className="fa-solid fa-file-contract"></i>
                          تحويل لعقد
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <i className="fa-solid fa-check-double"></i> موثق
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-cart-plus text-purple-400"></i>
                <h3 className="font-bold text-base">تسجيل طلب استقدام جديد</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسم العميل الرباعي..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم جوال العميل *</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+9665..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الجنسية المطلوبة</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>الفلبين</option>
                    <option>إندونيسيا</option>
                    <option>إثيوبيا</option>
                    <option>كينيا</option>
                    <option>أوغندا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الطلب</label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="حسب المواصفات">حسب المواصفات</option>
                    <option value="معينة">معينة بالاسم</option>
                    <option value="معروفة">معروفة لدى العميل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم السيرة الذاتية (إن وجدت)</label>
                <input
                  type="text"
                  value={maidName}
                  onChange={(e) => setMaidName(e.target.value)}
                  placeholder="اسم العاملة أو كود السيرة الذاتية..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                />
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
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  تسجيل الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
