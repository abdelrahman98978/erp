import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusFlow } from '../components/ui/StatusFlow';
import { Badge } from '../components/ui/Badge';
import { MOCK_RECRUITMENT_CONTRACTS } from '../data/mockData';
import { RecruitmentContract } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const RecruitmentContractsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeStage, setActiveStage] = useState<string>('all');

  const contractStages = [
    { id: 'all', name: t('stageAll', 'جميع العقود (113)') },
    { id: 'new', name: t('stageNew', 'عقود جديدة (12)') },
    { id: 'musaned', name: t('stageMusaned', 'مساند (45)') },
    { id: 'tafweed', name: t('stageTafweed', 'تفويض (14)') },
    { id: 'tafeez', name: t('stageTafeez', 'تفييز (18)') },
    { id: 'ticket', name: t('stageTicket', 'تذكرة (6)') },
    { id: 'arrival', name: t('stageArrival', 'وصول (11)') },
    { id: 'completed', name: t('stageCompleted', 'مكتمل (6)') }
  ];

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
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('details', 'التفاصيل')}
          </button>
          <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('printContract', 'طباعة العقد')}
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
            <i className="fa-solid fa-file-signature text-purple ml-2"></i> {t('recruitmentContractsTitle', 'إدارة عقود الاستقدام المباشرة (Musaned Pipeline)')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('recruitmentContractsSub', 'متابعة وتحديث حالات العقود من مساند والتفويض وحتى الوصول والمطابقة')}
          </p>
        </div>

        <button className="btn-odoo btn-odoo-purple">
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
        data={MOCK_RECRUITMENT_CONTRACTS}
        searchPlaceholder={t('searchContractPlaceholder', 'ابحث برقم العقد، اسم العميل، اسم العاملة، أو رقم جواز السفر...')}
      />
    </div>
  );
};
