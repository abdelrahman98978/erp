import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useOrders, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { ShoppingBag, Plus, FileSpreadsheet, FileText, Search, Clock, CheckCheck, Eye, X, ArrowLeft } from 'lucide-react';

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
    office_name: "PLATINUM BROTHERS INT'L",
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
  const [officeName, setOfficeName] = useState("PLATINUM BROTHERS INT'L");
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
      {/* Header Banner */}
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
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>ORDERS & SLA PIPELINE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة طلبات العملاء والعمليات
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              متابعة طلبات الاستقدام الجديدة، مؤقتات الـ SLA، والتحويل إلى عقود مساند لـ {activeCompany.name}
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
            <span>+ تسجيل طلب عميل جديد</span>
          </button>
          <button
            onClick={() => exportData('orders', filteredOrders, 'excel', `طلبات الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportData('orders', filteredOrders, 'pdf', `طلبات الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
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
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="p-4 border-b border-zinc-100 bg-white">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب، اسم العميل، أو الجوال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">رقم الطلب</th>
                <th className="p-3.5">بيانات العميل</th>
                <th className="p-3.5">المواصفات والجنسية</th>
                <th className="p-3.5">المكتب الخارجي</th>
                <th className="p-3.5">نوع الطلب</th>
                <th className="p-3.5">مهلة المعالجة</th>
                <th className="p-3.5">حالة العقد</th>
                <th className="p-3.5 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    جاري استرجاع الطلبات...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-zinc-400">
                    لا توجد طلبات مسجلة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">#{ord.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{ord.client_name}</div>
                      <div className="text-zinc-500 font-mono">{ord.client_phone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{ord.maid_name}</div>
                      <div className="text-zinc-500">{ord.nationality}</div>
                    </td>
                    <td className="p-3.5 text-zinc-600 font-semibold">{ord.office_name || 'مكتب مانيلا'}</td>
                    <td className="p-3.5">
                      <Badge text={ord.request_type} type="purple" />
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-black flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {ord.deadline}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        text={ord.contract_status}
                        type={ord.contract_status === 'تم التعاقد' ? 'success' : 'warning'}
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      {ord.contract_status !== 'تم التعاقد' ? (
                        <button
                          onClick={() => handleConvertToContract(ord)}
                          className="button-primary-pill"
                          style={{ padding: '3px 12px', fontSize: '11px', minHeight: '28px' }}
                        >
                          <span>تحويل لعقد</span>
                          <ArrowLeft className="w-3 h-3 mr-1" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>موثق</span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>تسجيل طلب استقدام جديد</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم العميل *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسم العميل الرباعي..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم جوال العميل *</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+9665..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الجنسية المطلوبة</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>الفلبين</option>
                    <option>إندونيسيا</option>
                    <option>إثيوبيا</option>
                    <option>كينيا</option>
                    <option>أوغندا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">نوع الطلب</label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="حسب المواصفات">حسب المواصفات</option>
                    <option value="معينة">معينة بالاسم</option>
                    <option value="معروفة">معروفة لدى العميل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم السيرة الذاتية (إن وجدت)</label>
                <input
                  type="text"
                  value={maidName}
                  onChange={(e) => setMaidName(e.target.value)}
                  placeholder="اسم العاملة أو كود السيرة الذاتية..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
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
