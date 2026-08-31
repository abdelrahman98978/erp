import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';
import { useAppStore } from '../stores/appStore';
import { Plus, FileSpreadsheet, Search, Handshake, X } from 'lucide-react';

export interface RentContractRecord {
  id: string;
  company_id: string;
  contract_number: string;
  client_name: string;
  client_phone: string;
  client_national_id?: string;
  maid_name: string;
  nationality: string;
  package_name?: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  tax_amount?: number;
  total_amount: number;
  status: 'جديد' | 'نشط' | 'مرسل' | 'موصد' | 'تم التسليم' | 'مكتمل' | 'ملغي';
  payment_status: 'معلق' | 'تم الدفع' | 'بانتظار التحويل';
  marketer?: string;
  branch: string;
  created_at: string;
}

interface RentPackage {
  id: string;
  title: string;
  nationality: string;
  order: number;
  rent_type: string;
  duration: string;
  price_before_tax: number;
  tax: number;
  total_price: number;
  days_count: number;
  is_visible: boolean;
}

const MOCK_PACKAGES: RentPackage[] = [
  {
    id: 'PKG-01',
    title: 'باقة الشهر - عمالة منزلية إندونيسية',
    nationality: 'إندونيسيا',
    order: 1,
    rent_type: 'شهري',
    duration: 'شهر واحد',
    price_before_tax: 3000,
    tax: 450,
    total_price: 3450,
    days_count: 30,
    is_visible: true,
  },
  {
    id: 'PKG-02',
    title: 'باقة الثلاثة أشهر - عمالة منزلية إثيوبية',
    nationality: 'إثيوبيا',
    order: 2,
    rent_type: '3 أشهر',
    duration: '3 أشهر',
    price_before_tax: 4500,
    tax: 675,
    total_price: 5175,
    days_count: 90,
    is_visible: true,
  },
];

const DEFAULT_MOCK_RENT_CONTRACTS: RentContractRecord[] = [
  {
    id: 'rent-1',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0014',
    client_name: 'ابو عبدالله',
    client_phone: '+966535666840',
    client_national_id: '1088273619',
    maid_name: 'Rental A21221 (سيتي نورعيني)',
    nationality: 'إندونيسيا',
    package_name: 'باقة الشهر الإندونيسي',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 1,
    monthly_cost: 3000.0,
    tax_amount: 450.0,
    total_amount: 3450.0,
    status: 'نشط',
    payment_status: 'تم الدفع',
    marketer: 'سارة خالد (مشرفة التأجير)',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rent-2',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0016',
    client_name: 'ابو اياد',
    client_phone: '+966562404213',
    client_national_id: '1099281726',
    maid_name: 'Rental A2122121 (رحمة أديسي)',
    nationality: 'إثيوبيا',
    package_name: 'باقة الشهر الإثيوبي',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 2,
    monthly_cost: 1500.0,
    tax_amount: 450.0,
    total_amount: 3450.0,
    status: 'نشط',
    payment_status: 'معلق',
    marketer: 'فهد العتيبي',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
];

export const RentContractsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawRentContracts = [] } = useRentContracts();
  const { createItem, updateItem, deleteItem } = useTableMutation('rent_contracts');
  const { addNotification } = useAppStore();

  const rentContracts: RentContractRecord[] =
    rawRentContracts.length > 0 ? (rawRentContracts as RentContractRecord[]) : DEFAULT_MOCK_RENT_CONTRACTS;

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): 'all' | 'active' | 'sent' | 'locked' | 'delivered' | 'completed' | 'packages' | 'drivers' | 'domestic' | 'orders' | 'terms' => {
    switch (tabKey) {
      case 'active-rent': return 'active';
      case 'transferred-rent': return 'delivered';
      case 'completed-rent': return 'completed';
      case 'rent-packages': return 'packages';
      case 'rental-drivers': return 'drivers';
      case 'rental-domestic': return 'domestic';
      case 'rental-orders': return 'orders';
      case 'rent-contract-terms': return 'terms';
      default: return 'all';
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sent' | 'locked' | 'delivered' | 'completed' | 'packages' | 'drivers' | 'domestic' | 'orders' | 'terms'>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveTab(getMappedTab(storeActiveTab));
    if (storeActiveTab === 'create-rent') {
      setShowAddModal(true);
    }
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(() => storeActiveTab === 'create-rent');
  const [editingContract, setEditingContract] = useState<RentContractRecord | null>(null);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RentContractRecord | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNationalId, setClientNationalId] = useState('');
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('إندونيسيا');
  const [durationMonths, setDurationMonths] = useState('1');
  const [monthlyCost, setMonthlyCost] = useState('3000');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const months = parseInt(durationMonths) || 1;
  const monthly = parseFloat(monthlyCost) || 3000;
  const tax = monthly * months * 0.15;
  const totalAmount = monthly * months + tax;

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !maidName) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const contractNumber = `${companyCode}-RENT-${new Date().getFullYear()}-${String(rentContracts.length + 1).padStart(4, '0')}`;

    const newRecord = {
      id: contractNumber,
      company_id: companyCode,
      contract_number: contractNumber,
      client_name: clientName,
      client_phone: clientPhone,
      client_national_id: clientNationalId,
      maid_name: maidName,
      nationality,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      duration_months: months,
      monthly_cost: monthly,
      tax_amount: tax,
      total_amount: totalAmount,
      status: 'نشط' as const,
      payment_status: 'تم الدفع' as const,
      branch,
    };

    await createItem.mutateAsync(newRecord);
    addNotification({
      title: 'إضافة عقد تأجير جديد',
      message: `تم إنشاء عقد التأجير #${contractNumber} للعميل (${clientName}) بنجاح.`,
      type: 'success',
    });
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
  };

  const handleDeleteContract = async (contract: RentContractRecord) => {
    if (window.confirm(`هل أنت متأكد من حذف عقد التأجير #${contract.contract_number}؟`)) {
      await deleteItem.mutateAsync(contract.id);
      addNotification({
        title: 'حذف عقد التأجير',
        message: `تم حذف عقد التأجير #${contract.contract_number} بنجاح.`,
        type: 'error',
      });
    }
  };

  const getFilteredContracts = () => {
    return rentContracts.filter((c) => {
      const matchesSearch =
        c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client_name.includes(searchQuery) ||
        c.maid_name.includes(searchQuery);

      if (!matchesSearch) return false;

      if (activeTab === 'active') return c.status === 'نشط';
      if (activeTab === 'sent') return c.status === 'مرسل';
      if (activeTab === 'locked') return c.status === 'موصد';
      if (activeTab === 'delivered') return c.status === 'تم التسليم';
      if (activeTab === 'completed') return c.status === 'مكتمل';

      return true;
    });
  };

  const currentDisplayList = getFilteredContracts();

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
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>RENTAL CONTRACTS SUITE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              عقود التأجير وباقات التشغيل
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              إدارة عقود التأجير الشهري واليومي، باقات الأسعار، وتوثيق السندات لـ {activeCompany.name}
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
            <span>+ إضافة عقد تأجير جديد</span>
          </button>
          <button
            onClick={() => exportData('rent_contracts', currentDisplayList, 'excel', `عقود التأجير - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* 4 Signature KPI Cards Row matching exact design screenshot */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: White Card */}
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي عقود التأجير</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {rentContracts.length || 13} عقد
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>شهري وسنوي وخدمة معروف</span>
        </div>

        {/* Card 2: Pistachio Band Card */}
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>العقود النشطة ومسيرات الخدمة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {rentContracts.filter(c => c.status === 'نشط').length || 4} نشط
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>عمالة منزلية وسائقين</span>
        </div>

        {/* Card 3: Pitch Black Featured Card */}
        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>إجمالي المبيعات الشهرية المحققة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {((rentContracts.reduce((sum, c) => sum + (c.total_amount || 0), 0) || 128500) / 1000).toFixed(1)}k ر.س
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>سداد آلي شامل الضريبة 15%</span>
        </div>

        {/* Card 4: White Card */}
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>نسبة الجاهزية والتسليم</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            100%
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-emerald-500 rounded-full" />
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>تغطية تأمينية وبدائل فورية</span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 pb-3">
        {[
          { id: 'all', label: `جميع عقود التأجير (${rentContracts.length || 13})` },
          { id: 'active', label: 'عقود نشطة (2)' },
          { id: 'orders', label: 'طلبات وحجوزات الإيجار (3) 📝' },
          { id: 'drivers', label: 'سائقين خاصين بنظام التأجير (4) 🚗' },
          { id: 'domestic', label: 'عاملات منزليات بنظام التأجير (6) 🏠' },
          { id: 'packages', label: `باقات التأجير (${MOCK_PACKAGES.length || 2})` },
          { id: 'terms', label: 'بنود وشروط عقد الإيجار ⚖️' },
          { id: 'sent', label: 'عقود مرسلة (1)' },
          { id: 'locked', label: 'عقود موصدة (2)' },
          { id: 'delivered', label: 'تم التسليم (0)' },
          { id: 'completed', label: 'عقود مكتملة (7)' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
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
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Rental Orders View */}
      {activeTab === 'orders' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h2 className="display-sm" style={{ fontSize: '18px', fontWeight: 330, color: '#000000', margin: 0 }}>
              طلبات وحجوزات عقود الإيجار الواردة
            </h2>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>3 طلبات جديدة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رقم الحجز</th>
                  <th className="p-3.5">اسم العميل</th>
                  <th className="p-3.5">المهنة المطلوبة</th>
                  <th className="p-3.5">الجنسية المفضلة</th>
                  <th className="p-3.5">المدة المطلوبة</th>
                  <th className="p-3.5">تاريخ البدء</th>
                  <th className="p-3.5">مبلغ العربون</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { id: 'ORD-R-101', client: 'عبدالله بن سعد الدوسري', job: 'عاملة منزلية بالشهر', nat: 'الفلبين', dur: '3 أشهر', date: '2026-09-01', deposit: 1000, status: 'بانتظار التعميد' },
                  { id: 'ORD-R-102', client: 'شركة الأفق للمقاولات', job: 'سائق خاص', nat: 'الهند', dur: '12 شهر', date: '2026-08-25', deposit: 2500, status: 'تم الفحص والموافقة' },
                  { id: 'ORD-R-103', client: 'نورة بنت محمد آل الشيخ', job: 'مربية أطفال', nat: 'إندونيسيا', dur: '6 أشهر', date: '2026-09-05', deposit: 1500, status: 'بانتظار التعميد' },
                ].map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{ord.id}</td>
                    <td className="p-3.5 font-bold text-black">{ord.client}</td>
                    <td className="p-3.5">{ord.job}</td>
                    <td className="p-3.5">{ord.nat}</td>
                    <td className="p-3.5 font-bold text-black">{ord.dur}</td>
                    <td className="p-3.5 font-mono text-zinc-500">{ord.date}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{ord.deposit} ر.س</td>
                    <td className="p-3.5"><Badge text={ord.status} type={ord.status.includes('تم') ? 'success' : 'warning'} /></td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          addNotification({
                            title: 'تحويل الحجز لعقد إيجار',
                            message: `تم تحويل الطلب #${ord.id} إلى عقد إيجار وتوجيهه للتوقيع.`,
                            type: 'success',
                          });
                        }}
                        className="button-primary-pill"
                        style={{ fontSize: '11px', padding: '2px 10px', minHeight: '26px' }}
                      >
                        تحويل لعقد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Rental Drivers View */}
      {activeTab === 'drivers' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h2 className="display-sm" style={{ fontSize: '18px', fontWeight: 330, color: '#000000', margin: 0 }}>
              سائقين خاصين بنظام التأجير والتشغيل المرن
            </h2>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>4 سائقين متاحين ومعينين</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">كود السائق</th>
                  <th className="p-3.5">اسم السائق</th>
                  <th className="p-3.5">الجنسية</th>
                  <th className="p-3.5">رقم رخصة القيادة</th>
                  <th className="p-3.5">حالة الرخصة</th>
                  <th className="p-3.5">المركبة المسندة</th>
                  <th className="p-3.5">العميل الحالي</th>
                  <th className="p-3.5">الراتب الشهري</th>
                  <th className="p-3.5">حالة التشغيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { id: 'DRV-01', name: 'RAJESH KUMAR', nat: 'الهند', lic: 'DL-992810', lic_status: 'سارية', car: 'تويوتا كامري 2024 (لوحة 4410)', client: 'عبدالرحمن السليم', salary: 2200, status: 'مؤجر ونشط' },
                  { id: 'DRV-02', name: 'MOHAMMED ISLAM', nat: 'بنغلاديش', lic: 'DL-882711', lic_status: 'سارية', car: 'هيونداي H1 (لوحة 7721)', client: 'حساب مجموعة السليم', salary: 2000, status: 'مؤجر ونشط' },
                  { id: 'DRV-03', name: 'ALI HASSAN', nat: 'باكستان', lic: 'DL-119283', lic_status: 'سارية', car: 'نيسان صني (لوحة 3312)', client: 'غير معين (متاح للتأجير)', salary: 2000, status: 'متاح للتعاقد' },
                  { id: 'DRV-04', name: 'SURESH PATEL', nat: 'الهند', lic: 'DL-773829', lic_status: 'سارية', car: 'غير معين', client: 'غير معين (متاح للتأجير)', salary: 2200, status: 'متاح للتعاقد' },
                ].map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{d.id}</td>
                    <td className="p-3.5 font-bold text-black">{d.name}</td>
                    <td className="p-3.5">{d.nat}</td>
                    <td className="p-3.5 font-mono text-zinc-600">{d.lic}</td>
                    <td className="p-3.5"><Badge text={d.lic_status} type="success" /></td>
                    <td className="p-3.5 font-semibold text-black">{d.car}</td>
                    <td className="p-3.5 text-zinc-600">{d.client}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{d.salary} ر.س</td>
                    <td className="p-3.5"><Badge text={d.status} type={d.status.includes('نشط') ? 'purple' : 'success'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Rental Domestic Maids View */}
      {activeTab === 'domestic' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h2 className="display-sm" style={{ fontSize: '18px', fontWeight: 330, color: '#000000', margin: 0 }}>
              عاملات منزليات بنظام التأجير الشهري والسنوي
            </h2>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>6 عاملات مسجلات</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">اسم العاملة</th>
                  <th className="p-3.5">الجنسية</th>
                  <th className="p-3.5">رقم الإقامة / الجواز</th>
                  <th className="p-3.5">المهنة والمهارات</th>
                  <th className="p-3.5">العميل الحالي</th>
                  <th className="p-3.5">تاريخ نهاية عقد التأجير</th>
                  <th className="p-3.5">سعر الإيجار الشهري</th>
                  <th className="p-3.5">حالة التوفر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { id: 'DOM-01', name: 'SITI NURHALIZA', nat: 'إندونيسيا', pass: 'IQ-22910481', skill: 'عاملة منزلية + طبخ سعودي', client: 'سعود بن فهد التميمي', end: '2026-11-15', price: 3200, status: 'مؤجرة حالياً' },
                  { id: 'DOM-02', name: 'MARITESS SANTOS', nat: 'الفلبين', pass: 'IQ-23491029', skill: 'رعاية أطفال + إتقان الإنجليزية', client: 'د. منيرة القحطاني', end: '2026-10-30', price: 3500, status: 'مؤجرة حالياً' },
                  { id: 'DOM-03', name: 'TIGIST ALEMU', nat: 'إثيوبيا', pass: 'IQ-24810293', skill: 'نظافة وغسيل ورعاية منزلية', client: 'متاح للتعاقد الفوري', end: '-', price: 2800, status: 'متاح للتأجير' },
                  { id: 'DOM-04', name: 'FATIMA NABATANZI', nat: 'أوغندا', pass: 'IQ-25910284', skill: 'عاملة منزلية ورعاية كبار سن', client: 'متاح للتعاقد الفوري', end: '-', price: 2700, status: 'متاح للتأجير' },
                ].map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{m.id}</td>
                    <td className="p-3.5 font-bold text-black">{m.name}</td>
                    <td className="p-3.5">{m.nat}</td>
                    <td className="p-3.5 font-mono text-zinc-600">{m.pass}</td>
                    <td className="p-3.5 text-zinc-700">{m.skill}</td>
                    <td className="p-3.5 font-bold text-black">{m.client}</td>
                    <td className="p-3.5 font-mono text-zinc-500">{m.end}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{m.price} ر.س</td>
                    <td className="p-3.5"><Badge text={m.status} type={m.status.includes('مؤجرة') ? 'primary' : 'success'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Contract Terms View */}
      {activeTab === 'terms' && (
        <div className="card-pricing" style={{ padding: '28px', borderRadius: '24px', background: '#ffffff' }}>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
            <div>
              <h2 className="display-sm" style={{ fontSize: '20px', fontWeight: 330, color: '#000000', margin: 0 }}>
                بنود وضوابط وشروط عقد التأجير الموحد
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                الشروط والالتزامات النظامية المتوافقة مع لوائح وزارة الموارد البشرية والتنمية الاجتماعية
              </p>
            </div>
            <button
              onClick={() => {
                addNotification({
                  title: 'حفظ الشروط المحدثة',
                  message: 'تم حفظ وتحديث بنود عقد التأجير بنجاح.',
                  type: 'success',
                });
              }}
              className="button-primary-pill"
              style={{ fontSize: '12px', padding: '6px 18px', minHeight: '36px' }}
            >
              حفظ التعديلات
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="font-bold text-black text-sm mb-2">البند الأول: موضوع العقد وطبيعة التشغيل</h3>
              <p className="text-zinc-700 leading-relaxed">
                يلتزم الطرف الأول (الشركة المؤجرة) بتوفير خدمات العامل/العاملة المنزلية للطرف الثاني (المستأجر) خلال مدة العقد المحددة، وتبقى كفالة العامل/العاملة تحت مظلة الشركة طوال مدة التشغيل.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="font-bold text-black text-sm mb-2">البند الثاني: التزامات الشركة (الطرف الأول)</h3>
              <p className="text-zinc-700 leading-relaxed">
                تلتزم الشركة بصرف رواتب العاملة في مواعيدها النظامية، وتوفير التغطية التأمينية الطبية الشاملة، واستبدال العاملة في حال رفض العمل أو العجز الصحي خلال 48 ساعة دون رسوم إضافية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="font-bold text-black text-sm mb-2">البند الثالث: التزامات المستأجر (الطرف الثاني)</h3>
              <p className="text-zinc-700 leading-relaxed">
                يلتزم المستأجر بتوفير بيئة سكنية ومعيشية لائقة ومناسبة، وتأمين الوجبات الغذائية، وساعات راحة يومية لا تقل عن 9 ساعات، وعدم تشغيل العاملة لدى أي طرف ثالث أو تكليفها بأعمال خطرة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="font-bold text-black text-sm mb-2">البند الرابع: الشروط الجزائية والتسوية المالية</h3>
              <p className="text-zinc-700 leading-relaxed">
                في حال رغبة المستأجر بإنهاء العقد قبل انقضاء مدته يتم خصم قيمة الأيام الفعلية بالإضافة إلى رسوم إدارية بنسبة 10% من قيمة المدة المتبقية، مع إعادة كامل مبلغ التأمين بعد تسليم العاملة واستلام براءة الذمة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      {['all', 'active', 'sent', 'locked', 'delivered', 'completed'].includes(activeTab) && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث برقم العقد، اسم العميل، أو العاملة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
              />
            </div>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              العدد المعروض: {currentDisplayList.length} عقد
            </span>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رقم العقد</th>
                  <th className="p-3.5">اسم العميل</th>
                  <th className="p-3.5">العاملة والجنسية</th>
                  <th className="p-3.5">مدة الإيجار</th>
                  <th className="p-3.5">تاريخ البداية والنهاية</th>
                  <th className="p-3.5">التكلفة الشهرية</th>
                  <th className="p-3.5">الإجمالي شامل الضريبة</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {currentDisplayList.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono text-black font-bold">{c.contract_number}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{c.client_name}</div>
                      <div className="text-zinc-500 font-mono">{c.client_phone}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{c.maid_name}</div>
                      <div className="text-zinc-500">{c.nationality}</div>
                    </td>
                    <td className="p-3.5 font-bold text-black">{c.duration_months} شهر</td>
                    <td className="p-3.5 text-zinc-500 font-mono">
                      {c.start_date} إلى {c.end_date}
                    </td>
                    <td className="p-3.5 font-mono">{(c.monthly_cost ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{(c.total_amount ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3.5">
                      <Badge text={c.status} type={c.status === 'نشط' ? 'success' : 'primary'} />
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedContractForPrint(c)}
                        className="button-outline-on-light"
                        style={{ padding: '3px 12px', fontSize: '11px', minHeight: '28px' }}
                      >
                        طباعة العقد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
          <h3 className="text-base font-bold text-black mb-4">باقات التأجير المعتمدة</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">عنوان الباقة</th>
                  <th className="p-3">الجنسية</th>
                  <th className="p-3">نوع الإيجار</th>
                  <th className="p-3">المدة</th>
                  <th className="p-3">السعر بدون ضريبة</th>
                  <th className="p-3">الضريبة (15%)</th>
                  <th className="p-3">الإجمالي بعد الضريبة</th>
                  <th className="p-3">عدد الأيام</th>
                  <th className="p-3">الظهور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_PACKAGES.map((pkg, idx) => (
                  <tr key={pkg.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-black">{idx + 1}</td>
                    <td className="p-3 font-bold text-black">{pkg.title}</td>
                    <td className="p-3 text-zinc-600">{pkg.nationality}</td>
                    <td className="p-3">
                      <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>{pkg.rent_type}</span>
                    </td>
                    <td className="p-3">{pkg.duration}</td>
                    <td className="p-3 font-mono">{(pkg.price_before_tax ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono text-zinc-500">{(pkg.tax ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{(pkg.total_price ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono">{pkg.days_count} يوم</td>
                    <td className="p-3">
                      <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>مفعل وظاهر</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Rent Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
          <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">إضافة عقد تأجير جديد</h3>
                <p className="text-xs text-zinc-400 mt-0.5">تسجيل بيانات العميل والعاملة والمدة الإيجارية</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                type="button"
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-white text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم العميل *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم الجوال *</label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+9665..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">العاملة المطلوبة للتأجير *</label>
                    <input
                      type="text"
                      required
                      value={maidName}
                      onChange={(e) => setMaidName(e.target.value)}
                      placeholder="سيتي نورعيني (سير تأجير نشطة)"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">الجنسية *</label>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    >
                      <option>إندونيسيا</option>
                      <option>إثيوبيا</option>
                      <option>الفلبين</option>
                      <option>أوغندا</option>
                      <option>كينيا</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">المدة (بالشهور) *</label>
                    <input
                      type="number"
                      required
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">السعر الشهري قبل الضريبة *</label>
                    <input
                      type="number"
                      required
                      value={monthlyCost}
                      onChange={(e) => setMonthlyCost(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-700 block mb-1 font-semibold">الإجمالي بعد الضريبة</label>
                    <div className="py-2 px-3 bg-zinc-100 rounded-2xl font-bold font-mono text-emerald-700 text-xs">
                      {totalAmount.toLocaleString()} ر.س
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
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
                  اعتماد وحفظ العقد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Print Modal */}
      {selectedContractForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
          <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-black text-base">طباعة عقد التأجير المعتمد</h3>
              <button
                onClick={() => setSelectedContractForPrint(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DualBrandingDocumentGenerator
              documentTitle="عقد تقديم خدمات تأجير عمالة منزلية"
              documentNumber={selectedContractForPrint.contract_number}
              date={new Date().toISOString().slice(0, 10)}
            >
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">اسم العميل:</span>
                  <strong className="text-black">{selectedContractForPrint.client_name}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">العاملة المؤجرة:</span>
                  <strong className="text-black">{selectedContractForPrint.maid_name}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">مدة العقد:</span>
                  <strong className="text-black">{selectedContractForPrint.duration_months} شهر ({selectedContractForPrint.start_date} إلى {selectedContractForPrint.end_date})</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">الإجمالي شامل الضريبة:</span>
                  <strong className="text-emerald-700 font-mono font-bold">{(selectedContractForPrint.total_amount ?? 0).toLocaleString()} ر.س</strong>
                </div>
              </div>
            </DualBrandingDocumentGenerator>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentContractsPage;
