import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRecruitmentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';
import { useAppStore } from '../stores/appStore';

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
  const { data: rawContracts = [], isLoading } = useRecruitmentContracts();
  const { createItem, updateItem } = useTableMutation('contracts');

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

  const [activeStage, setActiveStage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(() => storeActiveTab === 'create-contract');
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RecruitmentContractItem | null>(null);

  // Add Contract Form State (Full ClickERP fields)
  const [clientType, setClientType] = useState<'شخص' | 'شركة'>('شخص');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNationalId, setClientNationalId] = useState('');
  const [clientBirthDate, setClientBirthDate] = useState('');
  const [clientAltPhone, setClientAltPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('الرياض');
  const [roomsCount, setRoomsCount] = useState('');
  const [familyMembersCount, setFamilyMembersCount] = useState('');
  const [childrenUnder12, setChildrenUnder12] = useState('');
  const [clientJob, setClientJob] = useState('');
  const [addMaidMode, setAddMaidMode] = useState<'عامل/ة موجودة' | 'عامل/ة مختصرة'>('عامل/ة موجودة');
  const [maidName, setMaidName] = useState('');
  const [maidPassport, setMaidPassport] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [externalOffice, setExternalOffice] = useState("PLATINUM BROTHERS INT'L");
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
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
    setMaidPassport('');
  };

  const handleAdvanceStage = async (contract: RecruitmentContractItem) => {
    const currIdx = STAGES_LIST.indexOf(contract.stage);
    if (currIdx < STAGES_LIST.length - 1) {
      const nextStage = STAGES_LIST[currIdx + 1];
      await updateItem.mutateAsync({
        id: contract.id,
        data: { stage: nextStage },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-file-signature text-purple-700"></i>
            عقود الاستقدام المباشرة (Musaned Pipeline)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            متابعة مراحل عقود مساند، التفييز، الإرساليات الخارجية، وحجوزات الطيران لـ{' '}
            <strong style={{ color: '#005154' }}>{activeCompany.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#f4f4f5', padding: '3px', borderRadius: '9999px', display: 'flex', gap: '2px', border: '1px solid #e4e4e7' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#000000' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#71717a',
                fontWeight: 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-table-list ml-1"></i> جدول
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? '#000000' : 'transparent',
                color: viewMode === 'kanban' ? '#ffffff' : '#71717a',
                fontWeight: 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-columns ml-1"></i> مسار Kanban
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            + إضافة عقد استقدام جديد
          </button>

          <button
            onClick={() => exportData('recruitment_contracts', currentDisplayList, 'excel', `عقود الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button
            onClick={() => exportData('recruitment_contracts', currentDisplayList, 'pdf', `عقود الاستقدام - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Main Sub-Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: `جميع عقود الاستقدام (${contracts.length || 115})`, icon: 'fa-folder-open' },
          { id: 'active', label: 'العقود السارية (27)', icon: 'fa-clock' },
          { id: 'completed', label: 'العقود المكتملة (2)', icon: 'fa-circle-check' },
          { id: 'returned', label: 'العقود المرتجعة (11)', icon: 'fa-rotate-left' },
          { id: 'dispatches', label: `إرساليات المكتب الخارجي (${MOCK_DISPATCHES.length || 26})`, icon: 'fa-paper-plane' },
          { id: 'extensions', label: `طلبات تمديد العقود (${MOCK_EXTENSIONS.length || 1})`, icon: 'fa-calendar-plus' },
          { id: 'returns', label: `طلبات استرجاع العقود (${MOCK_RETURNS.length || 1})`, icon: 'fa-hand-holding-dollar' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contracts Table / Kanban View */}
      {['all', 'active', 'completed', 'returned'].includes(activeTab) && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
              <input
                type="text"
                placeholder="البحث برقم العقد، اسم العميل، اسم العاملة، أو الجواز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ borderRadius: '9999px', paddingRight: '36px', paddingLeft: '16px', height: '38px', minHeight: '38px', width: '320px', fontSize: '13px' }}
              />
            </div>
            <span className="pill-tag-mint" style={{ fontSize: '12px' }}>
              العدد المعروض: {currentDisplayList.length} عقد
            </span>
          </div>

          {viewMode === 'table' ? (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="odoo-data-table" style={{ width: '100%', textAlign: 'right' }}>
                <thead>
                  <tr>
                    <th>رقم العقد</th>
                    <th>توثيق مساند</th>
                    <th>العميل</th>
                    <th>العاملة</th>
                    <th>الجنسية والمكتب</th>
                    <th>مبلغ العقد</th>
                    <th>المرحلة الحالية</th>
                    <th>الضمان</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDisplayList.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 550, color: '#000000', fontFamily: 'monospace' }}>{c.contract_number}</td>
                      <td><span className="pill-tag-shade" style={{ fontFamily: 'monospace', fontSize: '11px' }}>{c.musaned_number || 'MSN-9982'}</span></td>
                      <td>
                        <div style={{ fontWeight: 550, color: '#000000' }}>{c.client_name}</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>{c.client_phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 550, color: '#000000' }}>{c.maid_name}</div>
                        <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>{c.maid_passport}</div>
                      </td>
                      <td>
                        <div>{c.nationality}</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>{c.external_office || 'مكتب خارجي معتمد'}</div>
                      </td>
                      <td style={{ fontWeight: 550, color: '#000000' }}>{(c.amount ?? 0).toLocaleString()} ر.س</td>
                      <td><Badge text={c.stage} type="primary" /></td>
                      <td><Badge text={c.warranty_status} type="success" /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleAdvanceStage(c)}
                            className="button-outline-on-light"
                            style={{ padding: '4px 10px', fontSize: '11.5px', minHeight: '28px' }}
                            title="نقل للمرحلة التالية"
                          >
                            تقدم المرحلة <i className="fa-solid fa-arrow-left text-xs"></i>
                          </button>
                          <button
                            onClick={() => setSelectedContractForPrint(c)}
                            className="button-outline-on-light"
                            style={{ padding: '4px 10px', fontSize: '11.5px', minHeight: '28px' }}
                            title="طباعة العقد"
                          >
                          <i className="fa-solid fa-print"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {currentDisplayList.map((c) => (
                <div key={c.id} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#005154', fontSize: '13px' }}>{c.contract_number}</strong>
                    <Badge text={c.stage} type="primary" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#0F172A' }}>{c.client_name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>العاملة: {c.maid_name} ({c.nationality})</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                    <strong style={{ color: '#047857', fontSize: '13px' }}>{(c.amount ?? 0).toLocaleString()} ر.س</strong>
                    <button
                      onClick={() => setSelectedContractForPrint(c)}
                      style={{ backgroundColor: '#005154', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                    >
                      طباعة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: External Office Dispatches */}
      {activeTab === 'dispatches' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>إرساليات المكتب الخارجي</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>رقم العقد</th>
                <th>العميل</th>
                <th>العاملة</th>
                <th>الجنسية</th>
                <th>المكتب الخارجي</th>
                <th>حالة العقد</th>
                <th>حالة الإرسالية</th>
                <th>تاريخ الإرسالية</th>
                <th>محطة الوصول</th>
                <th>التكلفة ($)</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DISPATCHES.map((disp) => (
                <tr key={disp.id}>
                  <td><strong>{disp.contract_number}</strong></td>
                  <td style={{ fontWeight: '800' }}>{disp.client_name}</td>
                  <td>{disp.maid_name}</td>
                  <td>{disp.nationality}</td>
                  <td>{disp.office_name}</td>
                  <td><Badge text={disp.contract_status} type="success" /></td>
                  <td><Badge text={disp.dispatch_status} type="purple" /></td>
                  <td>{disp.dispatch_date}</td>
                  <td>{disp.arrival_station}</td>
                  <td><strong style={{ color: '#047857' }}>${disp.cost_usd}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Extension Requests */}
      {activeTab === 'extensions' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات تمديد عقود الاستقدام</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>رقم العقد</th>
                <th>العميل</th>
                <th>العاملة</th>
                <th>سنوات التمديد</th>
                <th>مقدم الطلب</th>
                <th>تاريخ الطلب</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXTENSIONS.map((ext) => (
                <tr key={ext.id}>
                  <td><strong>{ext.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{ext.contract_number}</td>
                  <td>{ext.client_name}</td>
                  <td>{ext.maid_name}</td>
                  <td><strong>{ext.extension_years} سنوات</strong></td>
                  <td>{ext.applicant}</td>
                  <td>{ext.request_date}</td>
                  <td><Badge text={ext.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Return Requests */}
      {activeTab === 'returns' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات استرجاع العقود والمبالغ</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>رقم العقد</th>
                <th>اسم العميل</th>
                <th>اسم العاملة</th>
                <th>الملاحظات والسبب</th>
                <th>تاريخ الطلب</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RETURNS.map((ret) => (
                <tr key={ret.id}>
                  <td><strong>{ret.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{ret.contract_number}</td>
                  <td>{ret.client_name}</td>
                  <td>{ret.maid_name}</td>
                  <td style={{ fontSize: '11px', color: '#64748B' }}>{ret.notes}</td>
                  <td>{ret.request_date}</td>
                  <td><Badge text={ret.status} type="danger" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Comprehensive Add Contract Modal (Full ClickERP fields) */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-plus-circle text-emerald-600"></i>
                إضافة عقد استقدام جديد (ClickERP Complete Form)
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddContract} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Section 1: Client Information */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#005154' }}>
                  1. بيانات العميل صاحب الطلب
                </h4>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="clientType" checked={clientType === 'شخص'} onChange={() => setClientType('شخص')} />
                    شخص (أفراد)
                  </label>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="clientType" checked={clientType === 'شركة'} onChange={() => setClientType('شركة')} />
                    شركة (قطاع أعمال)
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>اسم العميل *</label>
                    <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الجوال *</label>
                    <input type="text" required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+9665..." style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الهوية الوطنية *</label>
                    <input type="text" value={clientNationalId} onChange={(e) => setClientNationalId(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>مدينة تسليم العميل *</label>
                    <input type="text" value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>تاريخ الميلاد (اختياري)</label>
                    <input type="date" value={clientBirthDate} onChange={(e) => setClientBirthDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الجوال الآخر (اختياري)</label>
                    <input type="text" value={clientAltPhone} onChange={(e) => setClientAltPhone(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>عدد الغرف (اختياري)</label>
                    <input type="number" value={roomsCount} onChange={(e) => setRoomsCount(e.target.value)} placeholder="مثال: 5" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>أفراد الأسرة (اختياري)</label>
                    <input type="number" value={familyMembersCount} onChange={(e) => setFamilyMembersCount(e.target.value)} placeholder="مثال: 4" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>أطفال تحت سن 12</label>
                    <input type="number" value={childrenUnder12} onChange={(e) => setChildrenUnder12(e.target.value)} placeholder="مثال: 2" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Maid & Office Information */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#005154' }}>
                  2. بيانات العاملة والمكتب الخارجي
                </h4>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="maidMode" checked={addMaidMode === 'عامل/ة موجودة'} onChange={() => setAddMaidMode('عامل/ة موجودة')} />
                    عامل/ة موجودة بالبنك
                  </label>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="maidMode" checked={addMaidMode === 'عامل/ة مختصرة'} onChange={() => setAddMaidMode('عامل/ة مختصرة')} />
                    عامل/ة مختصرة
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>اسم العاملة *</label>
                    <input type="text" required value={maidName} onChange={(e) => setMaidName(e.target.value)} placeholder="مثال: MARIA SANTOS" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم جواز السفر</label>
                    <input type="text" value={maidPassport} onChange={(e) => setMaidPassport(e.target.value)} placeholder="PH882910" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الجنسية *</label>
                    <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                      <option>الفلبين</option>
                      <option>إثيوبيا</option>
                      <option>أوغندا</option>
                      <option>كينيا</option>
                      <option>سريلانكا</option>
                      <option>الهند</option>
                      <option>بنغلاديش</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>المكتب الخارجي الشريك *</label>
                    <select value={externalOffice} onChange={(e) => setExternalOffice(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                      <option>PLATINUM BROTHERS INT'L</option>
                      <option>DAMAS FOREIGN AGENCY</option>
                      <option>VERSATILE OVERSEAS</option>
                      <option>MANILA RECRUITMENT HUB</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>مبلغ العقد قبل الضريبة *</label>
                    <input type="number" required value={amountInput} onChange={(e) => setAmountInput(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الفرع المسؤول</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                      <option>فرع الرياض الرئيسي</option>
                      <option>فرع جدة</option>
                      <option>فرع الدمام</option>
                      <option>فرع خميس مشيط</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,81,84,0.25)' }}
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>طباعة عقد الاستقدام المعتمد</h3>
              <button onClick={() => setSelectedContractForPrint(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <DualBrandingDocumentGenerator
              documentTitle="عقد توسط في استقدام عمالة منزلية"
              documentNumber={selectedContractForPrint.contract_number}
              date={new Date().toISOString().slice(0, 10)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>اسم العميل:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedContractForPrint.client_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>رقم توثيق مساند:</span>
                  <strong style={{ color: '#6D28D9', fontFamily: 'monospace' }}>{selectedContractForPrint.musaned_number || 'MSN-992011'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>العاملة والجنسية:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedContractForPrint.maid_name} ({selectedContractForPrint.nationality})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>إجمالي المبلغ:</span>
                  <strong style={{ color: '#047857' }}>{(selectedContractForPrint.amount ?? 0).toLocaleString()} ر.س</strong>
                </div>
              </div>
            </DualBrandingDocumentGenerator>
          </div>
        </div>
      )}
    </div>
  );
};
