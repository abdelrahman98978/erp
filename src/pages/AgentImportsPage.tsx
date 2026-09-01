import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { IMPORT_TEMPLATES, downloadTemplate } from '../services/importEngine';
import { UploadCloud, Download, FileSpreadsheet, Check, ArrowLeft, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredBatches = (batches.length > 0 ? batches : MOCK_BATCHES).filter(b =>
    b.batch_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.office_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.country.includes(searchQuery)
  );

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
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <UploadCloud className="w-5 h-5" />
          </div>
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
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadCVTemplate}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            <Download className="w-4 h-4 ml-1" />
            <span>تحميل نموذج Excel</span>
          </button>
          <button
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="button-outline-on-light"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-dark" />
            <span>فتح معالج الاستيراد</span>
          </button>
        </div>
      </div>

      {/* Batches Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث بكود الدفعة، المكتب، أو الدولة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد: {filteredBatches.length} دفعة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">كود الدفعة</th>
                <th className="p-3.5">المكتب الخارجي والدولة</th>
                <th className="p-3.5">عدد السير المرفوعة</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredBatches.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono font-bold text-black">{row.batch_code}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{row.office_name}</div>
                    <div className="text-zinc-500 text-[11px]">{row.country}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>
                      {row.cvs_count} سيرة ذاتية
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-500">{row.created_at}</td>
                  <td className="p-3.5">
                    <Badge
                      text={row.status}
                      type={row.status === 'مستوردة بالكامل' ? 'success' : row.status === 'مرفوضة' ? 'danger' : 'warning'}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {row.status === 'بانتظار الاعتماد' && (
                        <button
                          onClick={() => handleApprove(row.id)}
                          className="button-primary-pill"
                          style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        >
                          <Check className="w-3 h-3 ml-1" />
                          <span>اعتماد ونشر</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
                        className="button-outline-on-light"
                        style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                      >
                        <span>معالج الاستيراد</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentImportsPage;
