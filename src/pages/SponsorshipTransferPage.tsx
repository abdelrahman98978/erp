import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

interface TransferRequest {
  id: string;
  contract_number: string;
  maid_name: string;
  nationality: string;
  old_sponsor: string;
  old_sponsor_phone: string;
  new_sponsor: string;
  new_sponsor_phone: string;
  trial_days_remaining: number;
  contract_amount: number;
  status: 'فترة التجربة' | 'تم النقل' | 'فشل التجربة' | 'بانتظار الموافقة';
  created_at: string;
}

const MOCK_TRANSFERS: TransferRequest[] = [
  {
    id: 'TR-901',
    contract_number: '#TR-2026-001',
    maid_name: 'عاملة تنازل ألبانية',
    nationality: 'ألبانيا',
    old_sponsor: 'سارة احمد محمد',
    old_sponsor_phone: '+9660558025628',
    new_sponsor: 'بندر صالح الهويريني',
    new_sponsor_phone: '+966555774494',
    trial_days_remaining: 6,
    contract_amount: 20000,
    status: 'فترة التجربة',
    created_at: '2026-07-25'
  },
  {
    id: 'TR-902',
    contract_number: '#TR-2026-002',
    maid_name: 'Made Transfer eth',
    nationality: 'اثيوبيا',
    old_sponsor: 'عميل التجربة القديم',
    old_sponsor_phone: '+966500000111',
    new_sponsor: 'ابو اياد',
    new_sponsor_phone: '+966562404213',
    trial_days_remaining: 0,
    contract_amount: 18000,
    status: 'تم النقل',
    created_at: '2026-07-10'
  }
];

export const SponsorshipTransferPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<TransferRequest>('sponsorship_transfers', MOCK_TRANSFERS).then(data => setTransfers(data));
  }, []);

  const columns: Column<TransferRequest>[] = [
    {
      header: 'رقم النقل والعقد',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.contract_number}</span>
    },
    {
      header: 'اسم العاملة والجنسية',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.nationality}</div>
        </div>
      )
    },
    {
      header: 'الكفيل القديم (المتنازل)',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.old_sponsor}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.old_sponsor_phone}</div>
        </div>
      )
    },
    {
      header: 'الكفيل الجديد (المستلم)',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.new_sponsor}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.new_sponsor_phone}</div>
        </div>
      )
    },
    {
      header: 'فترة التجربة (10 أيام)',
      accessor: (row) => {
        if (row.status === 'فترة التجربة') {
          return (
            <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', padding: '4px 8px', borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-clock-rotate-left text-warning"></i>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--status-warning)' }}>متبقي {row.trial_days_remaining} أيام تجربة</span>
            </div>
          );
        }
        return <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>انتهت التجربة</span>;
      }
    },
    {
      header: 'مبلغ التنازل',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-teal-dark)' }}>{row.contract_amount.toLocaleString()} ر.س</span>
    },
    {
      header: 'حالة الطلب',
      accessor: (row) => <Badge text={row.status} type={row.status === 'تم النقل' ? 'success' : row.status === 'فترة التجربة' ? 'warning' : 'info'} />
    },
    {
      header: 'الإجراءات',
      accessor: () => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
            تأكيد النقل النهائي
          </button>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
            طباعة العقد
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-repeat text-purple ml-2"></i> إدارة طلبات نقل الكفالة والتنازل
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            متابعة عداد فترة التجربة (10 أيام)، تحويل المبالغ بين الكفلاء، وإعادة التخصيص
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('sponsorship-transfer', transfers, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('sponsorship-transfer', transfers, 'csv')} title="تصدير CSV">
            <i className="fa-solid fa-file-csv text-primary ml-1"></i> CSV
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('sponsorship-transfer', transfers, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('sponsorship-transfer', transfers, 'print')} title="طباعة التقرير">
            <i className="fa-solid fa-print text-purple ml-1"></i> طباعة
          </button>
        </div>
      </div>

      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard title="طلبات نقل الكفالة" value="64" icon="fa-solid fa-repeat" subtext="إجمالي المعاملات" variant="teal" />
        <StatCard title="قيد التجربة (10 أيام)" value="8" icon="fa-solid fa-hourglass-half" subtext="8 عمالة قيد التجربة المباشرة" variant="warning" />
        <StatCard title="تم النقل النهائي" value="42" icon="fa-solid fa-circle-check" subtext="معاملات مكتملة بالكامل" variant="purple" />
      </div>

      <DataTable
        columns={columns}
        data={transfers}
        searchPlaceholder="ابحث برقم العقد، اسم العاملة، الكفيل القديم أو الجديد..."
        addLabel="إضافة طلب نقل كفالة"
        exportConfig={{ sectionKey: 'sponsorship-transfer', rawData: transfers }}
      />
    </div>
  );
};
