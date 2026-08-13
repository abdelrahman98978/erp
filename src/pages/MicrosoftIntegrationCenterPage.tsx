import React, { useState, useEffect } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { MsProjectTask, PowerBiDashboardItem } from '../types';
import { realErpDataStore } from '../services/realErpDataStore';

const INITIAL_TASKS: MsProjectTask[] = [
  {
    id: 'MSP-101',
    taskName: 'حملة الاستقدام المكثف - 500 كادر فلبيني وهندي',
    companyId: 'masi',
    assignedResource: 'فهد العتيبي (مسؤول التوظيف)',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    progressPercent: 68,
    status: 'قيد التنفيذ',
    milestone: false,
  },
  {
    id: 'MSP-102',
    taskName: 'افتتاح فرع المنسكية والتجهيزات التقنية اللوجستية',
    companyId: 'yaqoot',
    assignedResource: 'م. خالد السليم',
    startDate: '2026-06-15',
    endDate: '2026-08-15',
    progressPercent: 100,
    status: 'مكتمل',
    milestone: true,
  },
  {
    id: 'MSP-103',
    taskName: 'تحديث معايير الامتثال والربط الضريبي ZATCA Phase 2',
    companyId: 'topaz',
    assignedResource: 'أحمد المحاسب المالي',
    startDate: '2026-08-01',
    endDate: '2026-10-01',
    progressPercent: 45,
    status: 'قيد التنفيذ',
    milestone: false,
  }
];

export const MicrosoftIntegrationCenterPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'project' | 'powerbi' | 'visio'>('project');
  const [projectTasks, setProjectTasks] = useState<MsProjectTask[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<MsProjectTask>('ms_project_tasks', INITIAL_TASKS).then(data => setProjectTasks(data));
  }, []);

  /* Power BI Dashboards Sample */
  const [powerbiDashboards] = useState<PowerBiDashboardItem[]>([
    {
      id: 'PBI-01',
      title: 'لوحة التحليل المالي والإيرادات والتكاليف (Executive P&L)',
      category: 'محاسبة',
      reportUrl: 'https://app.powerbi.com/view?r=eyJrIjoiExecutivePLReport',
      datasetName: 'Sulaim_Financial_Data_v2',
      rlsApplied: true,
      lastSyncTime: '2026-08-11 12:00 PM',
    },
    {
      id: 'PBI-02',
      title: 'تحليلات كفاءة الاستقدام وتكلفة التوظيف (ATS Time-to-Hire)',
      category: 'توظيف ATS',
      reportUrl: 'https://app.powerbi.com/view?r=eyJrIjoiATSKPIsReport',
      datasetName: 'Sulaim_ATS_Pipeline_DB',
      rlsApplied: true,
      lastSyncTime: '2026-08-11 11:30 AM',
    },
    {
      id: 'PBI-03',
      title: 'مؤشرات أداء الكادر البشري والدوران الوظيفي (HR Turnover)',
      category: 'موارد بشرية',
      reportUrl: 'https://app.powerbi.com/view?r=eyJrIjoiHRMetricsReport',
      datasetName: 'Sulaim_HRIS_Employee_Master',
      rlsApplied: true,
      lastSyncTime: '2026-08-11 10:45 AM',
    },
  ]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#FFFFFF',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <i className="fa-brands fa-microsoft" style={{ color: '#00A4EF', fontSize: '20px' }}></i>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '700' }}>MICROSOFT ENTERPRISE INTEGRATION CENTER</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            مركز تكامل ميكروسوفت المؤسسي (Project + Power BI + Visio)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#CBD5E1' }}>
            ربط مباشر مع بيئة Microsoft 365 لإدارة المشاريع، التحليلات المتقدمة مع RLS، والهياكل التنظيمية الديناميكية.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ backgroundColor: '#059669', color: '#FFF', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
            <i className="fa-solid fa-circle-check" style={{ marginLeft: '4px' }}></i>
            Microsoft Entra ID Connected
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('project')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'project' ? '#2563EB' : '#FFFFFF',
            color: activeTab === 'project' ? '#FFFFFF' : '#475569',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <i className="fa-solid fa-diagram-project"></i>
          <span>Microsoft Project (المشاريع والمهام)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('powerbi')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'powerbi' ? '#F59E0B' : '#FFFFFF',
            color: activeTab === 'powerbi' ? '#FFFFFF' : '#475569',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <i className="fa-solid fa-chart-line"></i>
          <span>Power BI Analytics (التحليلات المؤسسية RLS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visio')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'visio' ? '#7C3AED' : '#FFFFFF',
            color: activeTab === 'visio' ? '#FFFFFF' : '#475569',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <i className="fa-solid fa-sitemap"></i>
          <span>Microsoft Visio (الهيكل التنظيمي الخريطي)</span>
        </button>
      </div>

      {/* Tab 1: MS Project */}
      {activeTab === 'project' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
              مزامنة مشاريع الاستقدام والتوسع اللوجستي (Microsoft Project Timeline & Gantt):
            </h3>
            <button type="button" style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              + مزامنة مشروع جديد من Project Online
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '12px' }}>رقم المشروع</th>
                  <th style={{ padding: '12px' }}>اسم المشروع / المبادرة</th>
                  <th style={{ padding: '12px' }}>المسؤول المعتمد</th>
                  <th style={{ padding: '12px' }}>تاريخ البدء والانتهاء</th>
                  <th style={{ padding: '12px' }}>نسبة الإنجاز (Progress)</th>
                  <th style={{ padding: '12px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#2563EB' }}>{t.id}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0F172A' }}>
                      {t.taskName} {t.milestone && <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: '6px' }}>Milestone</span>}
                    </td>
                    <td style={{ padding: '12px' }}>{t.assignedResource}</td>
                    <td style={{ padding: '12px', fontSize: '11px', color: '#64748B' }}>{t.startDate} إلى {t.endDate}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ width: '120px', backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden', display: 'inline-block', marginLeft: '8px' }}>
                        <div style={{ width: `${t.progressPercent}%`, backgroundColor: t.progressPercent === 100 ? '#059669' : '#2563EB', height: '100%' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>{t.progressPercent}%</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: t.status === 'مكتمل' ? '#ECFDF5' : '#EFF6FF', color: t.status === 'مكتمل' ? '#047857' : '#1D4ED8', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Power BI */}
      {activeTab === 'powerbi' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {powerbiDashboards.map((dash) => (
            <div key={dash.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                  {dash.category}
                </span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>RLS: {dash.rlsApplied ? 'مفعل بحماية الأدوار' : 'عام'}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>
                {dash.title}
              </h3>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '16px' }}>
                مجموعة البيانات: <span style={{ fontFamily: 'monospace' }}>{dash.datasetName}</span> | آخر مزامنة: {dash.lastSyncTime}
              </div>

              {/* Power BI Embed Simulation Box */}
              <div style={{ backgroundColor: '#0F172A', borderRadius: '8px', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', marginBottom: '16px', padding: '20px', textAlign: 'center' }}>
                <i className="fa-solid fa-chart-area" style={{ fontSize: '32px', color: '#F59E0B', marginBottom: '8px' }}></i>
                <span style={{ fontSize: '12px', color: '#F8FAFC', fontWeight: '700' }}>Power BI Embedded Service Ready</span>
                <span style={{ fontSize: '10px' }}>التقرير مشفر ومربوط بنماذج Row-Level Security لقاعدتك الحالية.</span>
              </div>

              <button type="button" style={{ width: '100%', backgroundColor: '#F59E0B', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
                فتح لوحة Power BI المباشرة
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Visio Org Chart */}
      {activeTab === 'visio' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>
            الهيكل التنظيمي الخريطي الموحد (Visio Interactive Group Org Chart):
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            توليد ديناميكي للهيكل التنظيمي لمجموعة خالد السليم والشركات الأربع المعتمدة بناءً على بيانات HRIS الفعلية.
          </p>

          {/* Org Chart Visualization Tree */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Top Node */}
            <div style={{ backgroundColor: '#0F172A', color: '#FFF', padding: '14px 28px', borderRadius: '12px', textAlign: 'center', border: '2px solid #D4AF37', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: '16px', fontWeight: '900' }}>خالد السليم للاستقدام والتشغيل</div>
              <div style={{ fontSize: '11px', color: '#D4AF37', fontWeight: '700' }}>مجلس الإدارة والمدير التنفيذي للمجموعة</div>
            </div>

            <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1' }} />

            {/* Companies Nodes Grid */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1E40AF' }}>شركة السفير الماسي</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>5 فروع | 120 موظف</div>
              </div>

              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#047857' }}>شركة ياقوت نجد</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>4 فروع | 95 موظف</div>
              </div>

              <div style={{ backgroundColor: '#F5F3FF', border: '1px solid #DDD6FE', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#6D28D9' }}>شركة توباز للاستقدام</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>6 فروع | 160 موظف</div>
              </div>

              <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#C2410C' }}>دار الرواد</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>3 فروع | 75 موظف</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
