import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { MOCK_RENT_CONTRACTS } from '../data/mockData';
import { RentContract } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { realErpDataStore } from '../services/realErpDataStore';

export const RentContractsPage: React.FC = () => {
  const { t } = useLanguage();
  const [rentContracts, setRentContracts] = useState<RentContract[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<RentContract>('rent-contracts', MOCK_RENT_CONTRACTS).then(data => setRentContracts(data));
  }, []);

  const [addForm, setAddForm] = useState({
    client_name: '',
    client_phone: '',
    maid_name: '',
    nationality: 'إثيوبيا',
    duration_months: '1',
    monthly_cost: '3450',
    marketer: 'سارة خالد'
  });

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.client_name || !addForm.maid_name) return;

    const months = parseInt(addForm.duration_months) || 1;
    const monthly = parseFloat(addForm.monthly_cost) || 3450;
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const newRC: RentContract = {
      id: `RC-RENT-2026-${String(rentContracts.length + 12).padStart(3, '0')}`,
      contract_number: `RC-2026-00${rentContracts.length + 12}`,
      client_name: addForm.client_name,
      client_phone: addForm.client_phone,
      maid_name: addForm.maid_name,
      nationality: addForm.nationality,
      start_date: startDate,
      end_date: endDate,
      duration_months: months,
      monthly_cost: monthly,
      total_amount: months * monthly,
      status: 'نشط',
      payment_status: 'تم الدفع',
      marketer: addForm.marketer,
      branch: 'فرع الرياض'
    };

    const updated = await realErpDataStore.addRecord('rent-contracts', newRC, MOCK_RENT_CONTRACTS);
    setRentContracts(updated);
    setShowModal(false);
    setAddForm({ client_name: '', client_phone: '', maid_name: '', nationality: 'إثيوبيا', duration_months: '1', monthly_cost: '3450', marketer: 'سارة خالد' });
  };

  const handleExtendContract = async (contract: RentContract) => {
    const newDuration = contract.duration_months + 1;
    const newTotal = newDuration * contract.monthly_cost;
    const updated = await realErpDataStore.updateRecord('rent-contracts', contract.id, { duration_months: newDuration, total_amount: newTotal }, MOCK_RENT_CONTRACTS);
    setRentContracts(updated);
  };

  const columns: Column<RentContract>[] = [
    {
      header: t('rentContractNo', 'رقم عقد التأجير'),
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.contract_number}</span>
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
      header: t('workerNationality', 'العاملة والجنسية'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.nationality}</div>
        </div>
      )
    },
    {
      header: t('periodDuration', 'الفترة والمدة'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.duration_months} {t('months', 'أشهر')}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>من {row.start_date} إلى {row.end_date}</div>
        </div>
      )
    },
    {
      header: t('monthlyTotalCost', 'التكلفة والإجمالي'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.monthly_cost.toLocaleString()} {t('currencyMonth', 'ر.س/شهر')}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>الإجمالي: {row.total_amount.toLocaleString()} {t('currency', 'ر.س')}</div>
        </div>
      )
    },
    {
      header: t('status', 'الحالة'),
      accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'warning'} />
    },
    {
      header: t('actions', 'الإجراءات'),
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => window.print()}>
            {t('print', 'طباعة')}
          </button>
          <button
            className="btn-odoo btn-odoo-purple"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => handleExtendContract(row)}
          >
            {t('extendContract', '+ تمديد شهر')}
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-file-contract text-primary ml-2"></i> {t('rentContractsTitle', 'إدارة عقود التأجير التشغيلي (الخدمات المنزلية)')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('rentContractsSub', 'إصدار وتمديد عقود التأجير الشهرية والسنوية ومتابعة مدفوعات العملاء وحالة التسليم')}
          </p>
        </div>

        <button className="btn-odoo btn-odoo-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus ml-1"></i> {t('createRentContract', 'إنشاء عقد تأجير جديد')}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={rentContracts}
        searchPlaceholder={t('searchRentContractPlaceholder', 'ابحث برقم العقد، اسم العميل، اسم العاملة، أو رقم الجوال...')}
        exportConfig={{ sectionKey: 'rent-contracts', rawData: rentContracts }}
      />

      {/* Modal create contract */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            width: '500px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#005154' }}>{t('createRentContractModalTitle', 'إنشاء عقد تأجير تشغيلي جديد')}</h3>
            
            <form onSubmit={handleCreateContract}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العميل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="اسم العميل..."
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
                  <label className="filter-label">الجنسية</label>
                  <select
                    className="filter-select"
                    value={addForm.nationality}
                    onChange={e => setAddForm({ ...addForm, nationality: e.target.value })}
                  >
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">مدة العقد (أشهر)</label>
                  <input
                    type="number"
                    min="1"
                    className="filter-input"
                    value={addForm.duration_months}
                    onChange={e => setAddForm({ ...addForm, duration_months: e.target.value })}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">التكلفة الشهرية (ر.س)</label>
                  <input
                    type="number"
                    className="filter-input"
                    value={addForm.monthly_cost}
                    onChange={e => setAddForm({ ...addForm, monthly_cost: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowModal(false)}>{t('cancel', 'إلغاء')}</button>
                <button type="submit" className="btn-odoo btn-odoo-primary">{t('saveIssue', 'حفظ وإصدار العقد والتوليد المحاسبي')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentContractsPage;
