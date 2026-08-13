import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusFlow } from '../components/ui/StatusFlow';
import { Badge } from '../components/ui/Badge';
import { MOCK_RECRUITMENT_CONTRACTS } from '../data/mockData';
import { RecruitmentContract } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { realErpDataStore } from '../services/realErpDataStore';

export const RecruitmentContractsPage: React.FC = () => {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<RecruitmentContract[]>([]);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RecruitmentContract | null>(null);

  useEffect(() => {
    realErpDataStore.getRecords<RecruitmentContract>('recruitment-contracts', MOCK_RECRUITMENT_CONTRACTS).then(data => setContracts(data));
  }, []);

  const [addForm, setAddForm] = useState({
    client_name: '',
    client_phone: '',
    maid_name: '',
    maid_passport: '',
    nationality: 'إثيوبيا',
    external_office: 'DAMAS AGENCY',
    amount: '14500'
  });

  const handleAddContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.client_name || !addForm.maid_name) return;

    const newContract: RecruitmentContract = {
      id: `RC-2026-0${contracts.length + 15}`,
      contract_number: `RC-2026-00${contracts.length + 15}`,
      musaned_number: `MS-9920${contracts.length + 10}`,
      client_name: addForm.client_name,
      client_phone: addForm.client_phone,
      maid_name: addForm.maid_name,
      maid_passport: addForm.maid_passport || 'EP-992019',
      nationality: addForm.nationality,
      external_office: addForm.external_office,
      stage: 'عقود جديدة',
      warranty_status: 'نشط',
      payment_status: 'تم الدفع',
      amount: parseFloat(addForm.amount) || 14500,
      created_at: new Date().toISOString().slice(0, 10),
      branch: 'فرع الرياض'
    };

    const updated = await realErpDataStore.addRecord('recruitment-contracts', newContract, MOCK_RECRUITMENT_CONTRACTS);
    setContracts(updated);
    setShowAddModal(false);
    setAddForm({ client_name: '', client_phone: '', maid_name: '', maid_passport: '', nationality: 'إثيوبيا', external_office: 'DAMAS AGENCY', amount: '14500' });
  };

  const handleAdvanceStage = async (contract: RecruitmentContract) => {
    const stageFlow: RecruitmentContract['stage'][] = ['عقود جديدة', 'مساند', 'تفويض', 'تفييز', 'تذكرة', 'وصول', 'مكتمل'];
    const currIdx = stageFlow.indexOf(contract.stage);
    if (currIdx < stageFlow.length - 1) {
      const nextStage = stageFlow[currIdx + 1];
      const updated = await realErpDataStore.updateRecord('recruitment-contracts', contract.id, { stage: nextStage }, MOCK_RECRUITMENT_CONTRACTS);
      setContracts(updated);
    }
  };

  const contractStages = [
    { id: 'all', name: t('stageAll', `جميع العقود (${contracts.length})`) },
    { id: 'new', name: t('stageNew', `عقود جديدة (${contracts.filter(c => c.stage === 'عقود جديدة').length})`) },
    { id: 'musaned', name: t('stageMusaned', `مساند (${contracts.filter(c => c.stage === 'مساند').length})`) },
    { id: 'tafweed', name: t('stageTafweed', `تفويض (${contracts.filter(c => c.stage === 'تفويض').length})`) },
    { id: 'tafeez', name: t('stageTafeez', `تفييز (${contracts.filter(c => c.stage === 'تفييز').length})`) },
    { id: 'ticket', name: t('stageTicket', `تذكرة (${contracts.filter(c => c.stage === 'تذكرة').length})`) },
    { id: 'arrival', name: t('stageArrival', `وصول (${contracts.filter(c => c.stage === 'وصول').length})`) },
    { id: 'completed', name: t('stageCompleted', `مكتمل (${contracts.filter(c => c.stage === 'مكتمل').length})`) }
  ];

  const filteredContracts = contracts.filter(c => {
    if (activeStage === 'all') return true;
    if (activeStage === 'new') return c.stage === 'عقود جديدة';
    if (activeStage === 'musaned') return c.stage === 'مساند';
    if (activeStage === 'tafweed') return c.stage === 'تفويض';
    if (activeStage === 'tafeez') return c.stage === 'تفييز';
    if (activeStage === 'ticket') return c.stage === 'تذكرة';
    if (activeStage === 'arrival') return c.stage === 'وصول';
    if (activeStage === 'completed') return c.stage === 'مكتمل';
    return true;
  });

  const columns: Column<RecruitmentContract>[] = [
    {
      header: t('contractNo', 'رقم العقد'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-purple)' }}>{row.contract_number}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('stageMusaned', 'مساند')}: {row.musaned_number}</div>
        </div>
      )
    },
    {
      header: t('clientData', 'بيانات العميل'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.client_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.client_phone}</div>
        </div>
      )
    },
    {
      header: t('workerData', 'بيانات العاملة'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.nationality} • {row.maid_passport}</div>
        </div>
      )
    },
    {
      header: t('agency', 'المكتب الخارجي'),
      accessor: (row) => <span style={{ fontSize: '13px', fontWeight: '600' }}>{row.external_office}</span>
    },
    {
      header: t('stageStatus', 'المرحلة والحالة'),
      accessor: (row) => (
        <div>
          <Badge text={row.stage} type="purple" />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{row.warranty_status}</div>
        </div>
      )
    },
    {
      header: t('amountWarranty', 'المبلغ والضمان'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.amount.toLocaleString()} {t('currency', 'ر.س')}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>دفع: {row.payment_status}</div>
        </div>
      )
    },
    {
      header: t('actions', 'الإجراءات'),
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => handleAdvanceStage(row)}
          >
            نقل للمرحلة التالية ➔
          </button>
          <button
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => setSelectedContractForPrint(row)}
          >
            {t('printContract', 'طباعة العقد')}
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-file-signature text-purple ml-2"></i> {t('recruitmentContractsTitle', 'إدارة عقود الاستقدام المباشرة (Musaned Pipeline)')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('recruitmentContractsSub', 'متابعة وتحديث حالات العقود من مساند والتفويض وحتى الوصول والمطابقة')}
          </p>
        </div>

        <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
          <i className="fa-solid fa-plus ml-1"></i> {t('addNewContract', 'إضافة عقد استقدام جديد')}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <StatusFlow
          stages={contractStages}
          activeStageId={activeStage}
          onStageClick={(id) => setActiveStage(id)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredContracts}
        searchPlaceholder={t('searchContractPlaceholder', 'ابحث برقم العقد، اسم العميل، اسم العاملة، أو رقم جواز السفر...')}
        exportConfig={{ sectionKey: 'recruitment-contracts', rawData: filteredContracts }}
      />

      {/* Add Contract Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>إضافة عقد استقدام مساند جديد</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>
            <form onSubmit={handleAddContract}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العميل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="الاسم..."
                    value={addForm.client_name}
                    onChange={e => setAddForm({ ...addForm, client_name: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">جوال العميل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="+9665..."
                    value={addForm.client_phone}
                    onChange={e => setAddForm({ ...addForm, client_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العاملة *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="اسم العاملة..."
                    value={addForm.maid_name}
                    onChange={e => setAddForm({ ...addForm, maid_name: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">رقم جواز السفر *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Passport No..."
                    value={addForm.maid_passport}
                    onChange={e => setAddForm({ ...addForm, maid_passport: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">الجنسية</label>
                  <select
                    className="filter-select"
                    value={addForm.nationality}
                    onChange={e => setAddForm({ ...addForm, nationality: e.target.value })}
                  >
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>الهند</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">المبلغ الساري (ر.س)</label>
                  <input
                    type="number"
                    className="filter-input"
                    value={addForm.amount}
                    onChange={e => setAddForm({ ...addForm, amount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">حفظ العقد وتوليد القيد</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Print Canvas Modal */}
      {selectedContractForPrint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '620px', padding: '32px', background: 'white', borderRadius: '12px', border: '2px solid #005154' }}>
            <div style={{ textTransform: 'uppercase', textAlign: 'center', borderBottom: '2px solid #005154', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#005154', margin: 0 }}>مجموعة خالد السليم التجارية</h2>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#714B67' }}>عقد استقدام خدمات منزلية موحد - منصة مساند</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', lineHeight: '1.8', marginBottom: '24px' }}>
              <div><strong>رقم العقد:</strong> {selectedContractForPrint.contract_number}</div>
              <div><strong>رقم مساند:</strong> {selectedContractForPrint.musaned_number}</div>
              <div><strong>اسم العميل:</strong> {selectedContractForPrint.client_name}</div>
              <div><strong>جوال العميل:</strong> {selectedContractForPrint.client_phone}</div>
              <div><strong>اسم العاملة:</strong> {selectedContractForPrint.maid_name}</div>
              <div><strong>الجنسية / الجواز:</strong> {selectedContractForPrint.nationality} ({selectedContractForPrint.maid_passport})</div>
              <div><strong>إجمالي العقد:</strong> {selectedContractForPrint.amount.toLocaleString()} ر.س</div>
              <div><strong>المرحلة الحالية:</strong> {selectedContractForPrint.stage}</div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              يخضع هذا العقد لشروط وضوابط الاستقدام المعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية ومنصة مساند الموحدة، مع الالتزام بضمان الـ 90 يوماً.
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setSelectedContractForPrint(null)}>إغلاق</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => window.print()}>
                <i className="fa-solid fa-print ml-1"></i> طباعة وثيقة العقد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentContractsPage;
