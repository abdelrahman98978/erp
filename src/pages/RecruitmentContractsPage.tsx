import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRecruitmentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';
import { useAppStore } from '../stores/appStore';
import { FileSignature, Plus, FileSpreadsheet, FileText, Search, ArrowLeft, Printer, X, LayoutGrid, List } from 'lucide-react';

export interface RecruitmentContractItem {
  id: string;
  company_id: string;
  contract_number: string;
  musaned_number?: string;
  client_name: string;
  client_phone: string;
  client_national_id?: string;
  client_type?: 'شخص' | 'شركة';
  delivery_city?: string;
  maid_name: string;
  maid_passport?: string;
  nationality: string;
  external_office?: string;
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  stage: 'عقود جديدة' | 'مساند' | 'تفويض' | 'تفييز' | 'تذكرة' | 'وصول' | 'مكتمل' | 'مرتجع';
  warranty_status: string;
  payment_status: string;
  branch: string;
  created_at: string;
}

interface DispatchRecord {
  id: string;
  contract_number: string;
  client_name: string;
  maid_name: string;
  nationality: string;
  office_name: string;
  contract_status: string;
  dispatch_status: string;
  dispatch_date: string;
  arrival_station: string;
  cost_usd: number;
}

interface ExtensionRequest {
  id: string;
  contract_number: string;
  client_name: string;
  maid_name: string;
  extension_years: number;
  applicant: string;
  request_date: string;
  status: string;
}

interface ReturnRequest {
  id: string;
  contract_number: string;
  client_name: string;
  maid_name: string;
  notes: string;
  status: string;
  request_date: string;
}

const STAGES_LIST: RecruitmentContractItem['stage'][] = [
  'عقود جديدة',
  'مساند',
  'تفويض',
  'تفييز',
  'تذكرة',
  'وصول',
  'مكتمل',
];

const MOCK_DISPATCHES: DispatchRecord[] = [
  {
    id: 'DISP-01',
    contract_number: 'SAF-RC-2026-0001',
    client_name: 'بندر صالح الهويريني',
    maid_name: 'MARIA SANTOS',
    nationality: 'الفلبين',
    office_name: "PLATINUM BROTHERS INT'L",
    contract_status: 'ساري',
    dispatch_status: 'تم إرسال الجواز للسفارة',
    dispatch_date: '2026-08-10',
    arrival_station: 'مطار الملك خالد الدولي بالرياض',
    cost_usd: 1200,
  },
  {
    id: 'DISP-02',
    contract_number: 'SAF-RC-2026-0002',
    client_name: 'سارة خالد الدوسري',
    maid_name: 'ALEMITU BEKELE',
    nationality: 'إثيوبيا',
    office_name: 'DAMAS FOREIGN AGENCY',
    contract_status: 'ساري',
    dispatch_status: 'حجز تذكرة طيران',
    dispatch_date: '2026-08-12',
    arrival_station: 'مطار الملك عبدالعزيز بجدة',
    cost_usd: 950,
  },
];

const MOCK_EXTENSIONS: ExtensionRequest[] = [
  {
    id: 'EXT-01',
    contract_number: 'SAF-RC-2025-0890',
    client_name: 'محمد عبدالله العتيبي',
    maid_name: 'JOYCE MWANGI',
    extension_years: 2,
    applicant: 'العميل مباشرة عبر مساند',
    request_date: '2026-08-05',
    status: 'معتمد',
  },
];

const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: 'RET-01',
    contract_number: 'SAF-RC-2026-0033',
    client_name: 'فهد إبراهيم السبيعي',
    maid_name: 'FATIMA BEGUM',
    notes: 'عدم اجتياز الفحص الطبي في بلد المصدر',
    status: 'تم الاسترجاع المالي',
    request_date: '2026-08-08',
  },
];

export const RecruitmentContractsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawContracts = [] } = useRecruitmentContracts();
  const { createItem, updateItem, deleteItem } = useTableMutation('contracts');
  const { addNotification } = useAppStore();

  const contracts: RecruitmentContractItem[] = rawContracts as RecruitmentContractItem[];

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): 'all' | 'active' | 'completed' | 'returned' | 'dispatches' | 'extensions' | 'returns' => {
    switch (tabKey) {
      case 'current-contracts': return 'active';
      case 'completed-contracts': return 'completed';
      case 'returned-contracts': return 'returned';
      case 'dispatches': return 'dispatches';
      case 'contract-extension-requests': return 'extensions';
      case 'contract-return-requests': return 'returns';
      default: return 'all';
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'returned' | 'dispatches' | 'extensions' | 'returns'>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveTab(getMappedTab(storeActiveTab));
    if (storeActiveTab === 'create-contract') {
      setShowAddModal(true);
    }
  }, [storeActiveTab]);

  const [activeStage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(() => storeActiveTab === 'create-contract');
  const [editingContract, setEditingContract] = useState<RecruitmentContractItem | null>(null);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RecruitmentContractItem | null>(null);

  // Add Contract Form State
  const [clientType] = useState<'شخص' | 'شركة'>('شخص');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNationalId, setClientNationalId] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('الرياض');
  const [maidName, setMaidName] = useState('');
  const [maidPassport, setMaidPassport] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [externalOffice] = useState("PLATINUM BROTHERS INT'L");
  const [amountInput, setAmountInput] = useState('14500');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const handleAddContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !maidName) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const contractNumber = `${companyCode}-RC-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(4, '0')}`;
    const musanedNumber = `MSN-${Date.now().toString().slice(-6)}`;
    const amt = parseFloat(amountInput) || 14500;
    const tax = amt * 0.15;

    const newRecord = {
      id: contractNumber,
      company_id: companyCode,
      contract_number: contractNumber,
      musaned_number: musanedNumber,
      client_name: clientName,
      client_phone: clientPhone,
      client_national_id: clientNationalId,
      client_type: clientType,
      delivery_city: deliveryCity,
      maid_name: maidName,
      maid_passport: maidPassport || 'PHL-998201',
      nationality,
      external_office: externalOffice,
      amount: amt,
      tax_amount: tax,
      total_amount: amt + tax,
      stage: 'عقود جديدة' as const,
      warranty_status: 'نشط (90 يوماً)',
      payment_status: 'تم الدفع',
      branch,
    };

    await createItem.mutateAsync(newRecord);
    addNotification({
      title: 'إضافة عقد استقدام جديد',
      message: `تم توثيق العقد #${contractNumber} للعميل (${clientName}) بنجاح.`,
      type: 'success',
    });
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
    setMaidPassport('');
  };

  const handleUpdateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;

    await updateItem.mutateAsync({
      id: editingContract.id,
      data: editingContract,
    });
    addNotification({
      title: 'تحديث بيانات العقد',
      message: `تم تحديث العقد #${editingContract.contract_number} بنجاح.`,
      type: 'info',
    });
    setEditingContract(null);
  };

  const handleDeleteContract = async (contract: RecruitmentContractItem) => {
    if (window.confirm(`هل أنت متأكد من حذف العقد #${contract.contract_number}؟`)) {
      await deleteItem.mutateAsync(contract.id);
      addNotification({
        title: 'حذف العقد',
        message: `تم حذف العقد #${contract.contract_number} بنجاح.`,
        type: 'error',
      });
    }
  };

  const handleAdvanceStage = async (contract: RecruitmentContractItem) => {
    const currIdx = STAGES_LIST.indexOf(contract.stage);
    if (currIdx < STAGES_LIST.length - 1) {
      const nextStage = STAGES_LIST[currIdx + 1];
      await updateItem.mutateAsync({
        id: contract.id,
        data: { stage: nextStage },
      });
      addNotification({
        title: 'تقدم مرحلة العقد',
        message: `تم نقل العقد #${contract.contract_number} إلى مرحلة (${nextStage}).`,
        type: 'success',
      });
    }
  };

  const getFilteredContracts = () => {
    return contracts.filter((c) => {
      const matchesSearch =
        c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client_name.includes(searchQuery) ||
        c.maid_name.includes(searchQuery) ||
        (c.maid_passport && c.maid_passport.includes(searchQuery));

      if (!matchesSearch) return false;

      if (activeTab === 'active') return c.stage !== 'مكتمل' && c.stage !== 'مرتجع';
      if (activeTab === 'completed') return c.stage === 'مكتمل';
      if (activeTab === 'returned') return c.stage === 'مرتجع';

      const matchesStage = activeStage === 'all' || c.stage === activeStage;
      return matchesStage;
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
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>MUSANED RECRUITMENT PIPELINE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              عقود الاستقدام المباشرة
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              متابعة مراحل عقود مساند، التفييز، الإرساليات الخارجية، وحجوزات الطيران لـ {activeCompany.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-full flex gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>جدول</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة عقد استقدام</span>
          </button>

          <button
            onClick={() => exportData('recruitment_contracts', currentDisplayList, 'excel', `عقود الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportData('recruitment_contracts', currentDisplayList, 'pdf', `عقود الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'all', label: `جميع عقود الاستقدام (${contracts.length || 115})` },
          { id: 'active', label: 'العقود السارية (27)' },
          { id: 'completed', label: 'العقود المكتملة (2)' },
          { id: 'returned', label: 'العقود المرتجعة (11)' },
          { id: 'dispatches', label: `إرساليات المكتب الخارجي (${MOCK_DISPATCHES.length || 26})` },
          { id: 'extensions', label: `طلبات تمديد العقود (${MOCK_EXTENSIONS.length || 1})` },
          { id: 'returns', label: `طلبات استرجاع العقود (${MOCK_RETURNS.length || 1})` },
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

      {/* Contracts Table / Kanban View */}
      {['all', 'active', 'completed', 'returned'].includes(activeTab) && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث برقم العقد، اسم العميل، اسم العاملة، أو الجواز..."
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

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">رقم العقد</th>
                    <th className="p-3.5">توثيق مساند</th>
                    <th className="p-3.5">العميل</th>
                    <th className="p-3.5">العاملة</th>
                    <th className="p-3.5">الجنسية والمكتب</th>
                    <th className="p-3.5">مبلغ العقد</th>
                    <th className="p-3.5">المرحلة الحالية</th>
                    <th className="p-3.5">الضمان</th>
                    <th className="p-3.5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {currentDisplayList.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50">
                      <td className="p-3.5 font-mono font-bold text-black">{c.contract_number}</td>
                      <td className="p-3.5">
                        <span className="pill-tag-shade" style={{ fontFamily: 'monospace', fontSize: '10.5px' }}>
                          {c.musaned_number || 'MSN-9982'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-black">{c.client_name}</div>
                        <div className="text-zinc-500 font-mono">{c.client_phone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-black">{c.maid_name}</div>
                        <div className="text-zinc-500 font-mono">{c.maid_passport}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-black">{c.nationality}</div>
                        <div className="text-zinc-500 text-[11px]">{c.external_office || 'مكتب خارجي معتمد'}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{(c.amount ?? 0).toLocaleString()} ر.س</td>
                      <td className="p-3.5"><Badge text={c.stage} type="primary" /></td>
                      <td className="p-3.5"><Badge text={c.warranty_status} type="success" /></td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleAdvanceStage(c)}
                            className="button-outline-on-light"
                            style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                            title="نقل للمرحلة التالية"
                          >
                            <span>تقدم</span>
                            <ArrowLeft className="w-3 h-3 mr-1" />
                          </button>
                          <button
                            onClick={() => setSelectedContractForPrint(c)}
                            className="button-outline-on-light"
                            style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                            title="طباعة العقد"
                          >
                            <Printer className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {currentDisplayList.map((c) => (
                <div key={c.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-zinc-500">{c.contract_number}</span>
                      <Badge text={c.stage} type="primary" />
                    </div>
                    <h4 className="font-bold text-black text-sm mb-1">{c.client_name}</h4>
                    <p className="text-xs text-zinc-600 mb-3">{c.maid_name} - {c.nationality}</p>
                    <div className="py-2 px-3 bg-white rounded-xl text-xs font-mono font-bold text-emerald-700 mb-3 border border-zinc-200">
                      {(c.amount ?? 0).toLocaleString()} ر.س
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-zinc-200">
                    <button
                      onClick={() => handleAdvanceStage(c)}
                      className="button-primary-pill flex-1"
                      style={{ fontSize: '11px', minHeight: '28px', padding: '2px 8px' }}
                    >
                      المرحلة التالية
                    </button>
                    <button
                      onClick={() => setSelectedContractForPrint(c)}
                      className="button-outline-on-light"
                      style={{ fontSize: '11px', minHeight: '28px', padding: '2px 8px' }}
                    >
                      <Printer className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
          <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>إضافة عقد استقدام جديد (Musaned Form)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContract} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-white text-black">
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
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم الهوية / الإقامة</label>
                  <input
                    type="text"
                    value={clientNationalId}
                    onChange={(e) => setClientNationalId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">مدينة التوصيل</label>
                  <select
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>الرياض</option>
                    <option>جدة</option>
                    <option>الدمام</option>
                    <option>المدينة المنورة</option>
                    <option>أبها</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم العاملة *</label>
                  <input
                    type="text"
                    required
                    value={maidName}
                    onChange={(e) => setMaidName(e.target.value)}
                    placeholder="MARIA SANTOS"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم الجواز</label>
                  <input
                    type="text"
                    value={maidPassport}
                    onChange={(e) => setMaidPassport(e.target.value)}
                    placeholder="P1234567"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">الجنسية</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>الفلبين</option>
                    <option>إثيوبيا</option>
                    <option>كينيا</option>
                    <option>أوغندا</option>
                    <option>سريلانكا</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">مبلغ الاستقدام (ر.س)</label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">الفرع المسؤول</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>فرع الرياض الرئيسي</option>
                    <option>فرع جدة</option>
                    <option>فرع الدمام</option>
                    <option>فرع خميس مشيط</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-4">
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
              <h3 className="font-bold text-black text-base">طباعة عقد الاستقدام المعتمد</h3>
              <button
                onClick={() => setSelectedContractForPrint(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DualBrandingDocumentGenerator
              documentTitle="عقد توسط في استقدام عمالة منزلية"
              documentNumber={selectedContractForPrint.contract_number}
              date={new Date().toISOString().slice(0, 10)}
            >
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">اسم العميل:</span>
                  <strong className="text-black">{selectedContractForPrint.client_name}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">رقم توثيق مساند:</span>
                  <strong className="text-purple-700 font-mono font-bold">{selectedContractForPrint.musaned_number || 'MSN-992011'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">العاملة والجنسية:</span>
                  <strong className="text-black">{selectedContractForPrint.maid_name} ({selectedContractForPrint.nationality})</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500 font-semibold">إجمالي المبلغ:</span>
                  <strong className="text-emerald-700 font-mono font-bold">{(selectedContractForPrint.amount ?? 0).toLocaleString()} ر.س</strong>
                </div>
              </div>
            </DualBrandingDocumentGenerator>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentContractsPage;
