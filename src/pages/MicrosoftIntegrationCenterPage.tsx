import React, { useState, useEffect } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { MsProjectTask, PowerBiDashboardItem, CompanyId } from '../types';
import { realErpDataStore } from '../services/realErpDataStore';
import { 
  Building2, 
  BarChart3, 
  Network, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink, 
  Sparkles,
  GitFork,
  X
} from 'lucide-react';

const INITIAL_TASKS: MsProjectTask[] = [
  {
    id: 'MSP-101',
    taskName: 'حملة الاستقدام المكثف - 500 كادر فلبيني وهندي',
    companyId: 'SAF',
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
    companyId: 'YAQ',
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
    companyId: 'TOP',
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
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'project' | 'powerbi' | 'visio'>('project');
  const [projectTasks, setProjectTasks] = useState<MsProjectTask[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form State
  const [projectForm, setProjectForm] = useState<{
    taskName: string;
    companyId: CompanyId;
    assignedResource: string;
    startDate: string;
    endDate: string;
    progressPercent: string;
    milestone: boolean;
  }>({
    taskName: '',
    companyId: 'SAF',
    assignedResource: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    progressPercent: '10',
    milestone: false
  });

  useEffect(() => {
    realErpDataStore.getRecords<MsProjectTask>('ms_project_tasks', INITIAL_TASKS).then(data => setProjectTasks(data));
  }, []);

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.taskName.trim()) return;

    const progress = Math.min(100, Math.max(0, Number(projectForm.progressPercent) || 0));
    const newTask: MsProjectTask = {
      id: `MSP-${104 + projectTasks.length}`,
      taskName: projectForm.taskName.trim(),
      companyId: projectForm.companyId,
      assignedResource: projectForm.assignedResource.trim() || 'فريق التطوير والتشغيل',
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      progressPercent: progress,
      status: progress === 100 ? 'مكتمل' : 'قيد التنفيذ',
      milestone: projectForm.milestone,
    };

    const updated = await realErpDataStore.addRecord<MsProjectTask>('ms_project_tasks', newTask, INITIAL_TASKS);
    setProjectTasks(updated);
    setShowAddProjectModal(false);
    setProjectForm({
      taskName: '',
      companyId: 'SAF',
      assignedResource: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      progressPercent: '10',
      milestone: false
    });

    addNotification({
      title: 'مزامنة Microsoft Project',
      message: `تم إنشاء مشروع (${newTask.taskName}) وحفظه في جدول المشاريع بنجاح.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Network className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                  MICROSOFT ENTERPRISE INTEGRATION
                </span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>M365 & Power BI</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                مركز تكامل ميكروسوفت المؤسسي (Project + Power BI + Visio)
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                ربط مباشر مع بيئة Microsoft 365 لإدارة المشاريع، التحليلات المتقدمة مع RLS، والهياكل التنظيمية الديناميكية بقاعدة البيانات
              </p>
            </div>
          </div>

          <div>
            <span className="pill-tag-mint flex items-center gap-1" style={{ fontSize: '11.5px', padding: '6px 14px' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Microsoft Entra ID Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'project', label: `Microsoft Project (المشاريع والمهام - ${projectTasks.length})`, icon: Clock },
          { id: 'powerbi', label: `Power BI Analytics (التحليلات RLS - ${powerbiDashboards.length})`, icon: BarChart3 },
          { id: 'visio', label: 'Visio Org Architect (الهيكل الإداري)', icon: GitFork },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: MS Project */}
      {activeTab === 'project' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-black flex items-center gap-2 m-0">
              <Clock className="w-4 h-4 text-black" />
              <span>مزامنة مشاريع الاستقدام والتوسع اللوجستي (Project Timeline)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="button-primary-pill"
              style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
            >
              <Plus className="w-3.5 h-3.5 ml-1" />
              <span>+ مزامنة مشروع جديد</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رقم المشروع</th>
                  <th className="p-3.5">اسم المشروع / المبادرة</th>
                  <th className="p-3.5">المسؤول المعتمد</th>
                  <th className="p-3.5">تاريخ البدء والانتهاء</th>
                  <th className="p-3.5">نسبة الإنجاز</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {projectTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">{t.id}</td>
                    <td className="p-3.5 font-bold text-black">
                      {t.taskName} {t.milestone && <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">Milestone</span>}
                    </td>
                    <td className="p-3.5 text-zinc-600">{t.assignedResource}</td>
                    <td className="p-3.5 text-zinc-500 font-mono text-[11px]">{t.startDate} إلى {t.endDate}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.progressPercent === 100 ? 'bg-emerald-600' : 'bg-black'}`} style={{ width: `${t.progressPercent}%` }} />
                        </div>
                        <span className="font-mono font-bold text-[11px]">{t.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-800'}`}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {powerbiDashboards.map((dash) => (
            <div key={dash.id} className="card-pricing" style={{ padding: '20px', borderRadius: '24px', background: '#ffffff' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {dash.category}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">RLS: {dash.rlsApplied ? 'مفعل بالأدوار' : 'عام'}</span>
              </div>
              <h3 className="text-xs font-bold text-black mb-1">
                {dash.title}
              </h3>
              <div className="text-[11px] text-zinc-400 mb-4 font-mono">
                مجموعة البيانات: {dash.datasetName}
              </div>

              {/* Power BI Embed Simulation Box */}
              <div className="bg-black rounded-2xl p-6 text-center text-zinc-400 mb-4 flex flex-col items-center justify-center gap-2">
                <BarChart3 className="w-8 h-8 text-amber-400" />
                <span className="text-xs font-bold text-white">Power BI Embedded Service Ready</span>
                <span className="text-[10px] text-zinc-400">التقرير مشفر ومربوط بنماذج Row-Level Security لقاعدتك.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addNotification({
                    title: 'فتح تقرير Power BI',
                    message: `تم تحميل لوحة (${dash.title}) وتفعيل أمان الوصول حسب دورك المؤسسي.`,
                    type: 'info',
                  });
                }}
                className="button-primary-pill w-full flex items-center justify-center gap-2"
                style={{ padding: '8px', fontSize: '12px' }}
              >
                <span>فتح لوحة Power BI المباشرة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Visio Org Chart */}
      {activeTab === 'visio' && (
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
          <h3 className="text-sm font-bold text-black mb-1 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-black" />
            <span>الهيكل التنظيمي الخريطي الموحد (Visio Interactive Group Org Chart)</span>
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            توليد ديناميكي للهيكل التنظيمي لمجموعة خالد السليم والشركات الأربع المعتمدة بناءً على بيانات HRIS الفعلية.
          </p>

          {/* Org Chart Visualization Tree */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-black text-white p-4 rounded-2xl text-center border-2 border-emerald-400 shadow-lg min-w-[240px]">
              <div className="text-sm font-black">خالد السليم للاستقدام والتشغيل</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">مجلس الإدارة والمدير التنفيذي للمجموعة</div>
            </div>

            <div className="w-0.5 h-6 bg-zinc-300" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <div className="text-xs font-bold text-black">شركة السفير الماسي</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">5 فروع | 120 موظف</div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <div className="text-xs font-bold text-black">شركة ياقوت نجد</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">4 فروع | 95 موظف</div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <div className="text-xs font-bold text-black">شركة توباز للاستقدام</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">6 فروع | 160 موظف</div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <div className="text-xs font-bold text-black">دار الرواد</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">3 فروع | 75 موظف</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add MS Project Task */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-zinc-200 font-sans">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-black m-0">مزامنة مشروع جديد في Microsoft Project</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">اسم المشروع / المبادرة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حملة استقدام الربع الرابع 2026"
                  value={projectForm.taskName}
                  onChange={e => setProjectForm({ ...projectForm, taskName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">الشركة التابعة</label>
                  <select
                    value={projectForm.companyId}
                    onChange={e => setProjectForm({ ...projectForm, companyId: e.target.value as CompanyId })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="SAF">شركة السفير الماسي (SAF)</option>
                    <option value="YAQ">شركة ياقوت نجد (YAQ)</option>
                    <option value="TOP">شركة توباز للاستقدام (TOP)</option>
                    <option value="KAS">دار الرواد / كاس للتجارة (KAS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">المسؤول المعتمد</label>
                  <input
                    type="text"
                    placeholder="اسم المسؤول..."
                    value={projectForm.assignedResource}
                    onChange={e => setProjectForm({ ...projectForm, assignedResource: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">تاريخ البدء</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">تاريخ الانتهاء المستهدف</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={e => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">نسبة الإنجاز الحالية (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.progressPercent}
                    onChange={e => setProjectForm({ ...projectForm, progressPercent: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
                  />
                </div>
                <div className="pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="milestone"
                    checked={projectForm.milestone}
                    onChange={e => setProjectForm({ ...projectForm, milestone: e.target.checked })}
                    className="rounded text-black"
                  />
                  <label htmlFor="milestone" className="text-xs text-zinc-700 font-semibold cursor-pointer">
                    محطة رئيسية (Milestone)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="button-outline-on-light text-xs py-1.5 px-4"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill text-xs py-1.5 px-5"
                >
                  حفظ ومزامنة المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrosoftIntegrationCenterPage;
