import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { IMPORT_TEMPLATES, downloadTemplate } from '../services/importEngine';

interface ImportBatch {
  id: string;
  batch_code: string;
  office_name: string;
  country: string;
  cvs_count: number;
  status: 'بانتظار الاعتماد' | 'مستوردة بالكامل' | 'مرفوضة';
  created_at: string;
}

const MOCK_BATCHES: ImportBatch[] = [
  { id: '1', batch_code: '#IMP-2026-08', office_name: 'DAMAS FOREIGN AGENCY', country: 'اثيوبيا', cvs_count: 15, status: 'بانتظار الاعتماد', created_at: '2026-07-29' },
  { id: '2', batch_code: '#IMP-2026-07', office_name: "PLATINUM BROTHERS INT'L", country: 'الفلبين', cvs_count: 22, status: 'مستوردة بالكامل', created_at: '2026-07-20' },
  { id: '3', batch_code: '#IMP-2026-06', office_name: "AL-MANAR RECRUITMENT", country: 'أوغندا', cvs_count: 18, status: 'مستوردة بالكامل', created_at: '2026-07-15' },
];

export const AgentImportsPage: React.FC = () => {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const { setActiveTab } = useAppStore();

  useEffect(() => {
    realErpDataStore.getRecords<ImportBatch>('agent_imports', MOCK_BATCHES).then(data => setBatches(data));
  }, []);

  const handleApprove = async (batchId: string) => {
    const updated = await realErpDataStore.updateRecord<ImportBatch>('agent_imports', batchId, {
      status: 'مستوردة بالكامل'
    }, MOCK_BATCHES);
    setBatches(updated);
  };

  const handleDownloadCVTemplate = () => {
    const cvTemplate = IMPORT_TEMPLATES.find(t => t.entityKey === 'cvs');
    if (cvTemplate) {
      downloadTemplate(cvTemplate);
    }
  };

  const columns: Column<ImportBatch>[] = [
    {
      header: 'كود الدفعة',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.batch_code}</span>
    },
    {
      header: 'المكتب الخارجي والدولة',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: '#1E293B' }}>{row.office_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-earth-americas ml-1 text-slate-400"></i> {row.country}
          </div>
        </div>
      )
    },
    {
      header: 'عدد السير المرفوعة',
      accessor: (row) => <Badge text={`${row.cvs_count} سيرة ذاتية`} type="purple" />
    },
    {
      header: 'التاريخ',
      accessor: (row) => <span style={{ fontSize: '12px', color: '#64748B' }}>{row.created_at}</span>
    },
    {
      header: 'الحالة',
      accessor: (row) => (
        <Badge
          text={row.status}
          type={row.status === 'مستوردة بالكامل' ? 'success' : row.status === 'مرفوضة' ? 'danger' : 'warning'}
        />
      )
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.status === 'بانتظار الاعتماد' && (
            <button
              onClick={() => handleApprove(row.id)}
              className="btn-odoo btn-odoo-primary"
              style={{ padding: '4px 10px', height: '30px', fontSize: '12px' }}
            >
              <i className="fa-solid fa-check ml-1"></i> اعتماد ونشر
            </button>
          )}
          <button
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 10px', height: '30px', fontSize: '12px' }}
          >
            <i className="fa-solid fa-file-import ml-1"></i> معالج الاستيراد
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFF',
        padding: '18px 24px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined text-purple-600" style={{ fontSize: '26px' }}>file_download</span>
            ملفات السير المرفوعة من الوكلاء بالخارج
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            مراجعة واعتماد السير الذاتية المرفوعة بالجملة من مكاتب الاستقدام الخارجية أو استيراد ملفات Excel/CSV جديدة
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadCVTemplate}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-download ml-1"></i> تحميل نموذج Excel
          </button>
          <button
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginLeft: '4px' }}>publish</span>
            فتح معالج الاستيراد الشامل
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={batches.length > 0 ? batches : MOCK_BATCHES}
        searchPlaceholder="ابحث بكود الدفعة، المكتب، أو الدولة..."
        onAddClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
        addLabel="استيراد دُفعة سير ذاتية جديدة"
      />
    </div>
  );
};

