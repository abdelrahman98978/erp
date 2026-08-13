import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { MOCK_RENT_CONTRACTS } from '../data/mockData';
import { RentContract } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const RentContractsPage: React.FC = () => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

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
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('print', 'طباعة')}
          </button>
          <button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('extendContract', 'تمديد العقد')}
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
        data={MOCK_RENT_CONTRACTS}
        searchPlaceholder={t('searchRentContractPlaceholder', 'ابحث برقم العقد، اسم العميل، اسم العاملة، أو رقم الجوال...')}
        exportConfig={{ sectionKey: 'rent-contracts', rawData: MOCK_RENT_CONTRACTS }}
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
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>{t('createRentContractModalTitle', 'إنشاء عقد تأجير تشغيلي جديد')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {t('createRentContractModalSub', 'اختر العميل، باقة التأجير، والعاملة لتوليد العقد والطباعة الفورية')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowModal(false)}>{t('cancel', 'إلغاء')}</button>
              <button className="btn-odoo btn-odoo-primary" onClick={() => setShowModal(false)}>{t('saveIssue', 'حفظ وإصدار العقد')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentContractsPage;
