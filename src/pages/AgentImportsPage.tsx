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
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              AGENT BATCH IMPORTS
            </span>
            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>استيراد السير الذاتية والمكاتب الدولية</span>
          </div>
          <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '6px 0 0 0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
            ملفات السير المرفوعة من الوكلاء بالخارج
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
            مراجعة واعتماد السير الذاتية المرفوعة بالجملة من مكاتب الاستقدام الخارجية أو استيراد ملفات Excel/CSV جديدة
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadCVTemplate}
            className="button-outline-on-dark"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-download ml-1"></i> تحميل نموذج Excel
          </button>
          <button
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="button-aloe-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-import ml-1"></i> فتح معالج الاستيراد
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

