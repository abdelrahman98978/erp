import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData, SECTION_CONFIGS } from '../services/exportService';
import {
  MOCK_CLIENTS,
  MOCK_ORDERS,
  MOCK_RECRUITMENT_CONTRACTS,
  MOCK_RENT_CONTRACTS,
  MOCK_SHELTER_ITEMS,
  MOCK_EMPLOYEES
} from '../data/mockData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ReportCard {
  id: string;
  /** Maps to SECTION_CONFIGS key for actual export */
  sectionKey: string;
  title: string;
  desc: string;
  icon: string;
}

const REPORTS_LIST: ReportCard[] = [
  { id: 'clients', sectionKey: 'clients', title: 'تقرير العملاء الشامل', desc: 'تقرير العملاء مع بيانات الاتصال والحالة ومؤشرات النشاط وآخر العمليات والطلبات.', icon: 'fa-users' },
  { id: 'orders', sectionKey: 'orders', title: 'تقرير طلبات الاستقدام', desc: 'تصدير الطلبات الحالية بعد الفلترة حسب الحالة والعميل والمسوق والمهلة المحددة.', icon: 'fa-cart-shopping' },
  { id: 'recruitment-contracts', sectionKey: 'recruitment-contracts', title: 'تقرير عقود الاستقدام', desc: 'تقرير موحد لعقود الاستقدام مع فلاتر المرحلة والضمان والعميل والعاملة والمكتب الخارجي.', icon: 'fa-file-signature' },
  { id: 'rent-contracts', sectionKey: 'rent-contracts', title: 'تقرير عقود الإيجار والتشغيل', desc: 'تقرير عقود الإيجار مع حالة العقد والتمديد والضمان والمسوق وطرق الدفع.', icon: 'fa-handshake-simple' },
  { id: 'shelter', sectionKey: 'shelter', title: 'تقرير عقود الإيواء والإعاشة', desc: 'تقرير الإيواء الموحّد مع الضمان والرغبة في العمل ومكان الإيواء ووجبات التغذية.', icon: 'fa-building-user' },
  { id: 'travel', sectionKey: 'travel', title: 'تقرير رحلات السفر واللوجستيات', desc: 'تقرير رحلات الاستقدام والترحيل مع بيانات شركة الطيران والمطار والعميل والعاملة.', icon: 'fa-plane-departure' },
  { id: 'sponsorship-transfer', sectionKey: 'sponsorship-transfer', title: 'تقرير نقل الكفالة', desc: 'تقرير معاملات نقل الكفالة مع بيانات الكفلاء والعاملة والحالة والمدفوعات وفترة التجربة.', icon: 'fa-repeat' },
  { id: 'complaints', sectionKey: 'complaints', title: 'تقرير الشكاوى والدعم', desc: 'تقرير الشكاوى والتذاكر مع الحالة والأولوية والتعيين والردود ومعدل سرعة الحل.', icon: 'fa-headset' },
  { id: 'external-offices', sectionKey: 'external-offices', title: 'تقرير المكاتب الخارجية', desc: 'تقرير المكاتب الخارجية مع الجنسية والحساب والمدير والارتباطات والتكلفة بالدولار.', icon: 'fa-globe' },
  { id: 'financial-requests', sectionKey: 'financial-requests', title: 'تقرير الطلبات المالية', desc: 'تقرير الطلبات المالية التشغيلية حسب النوع والحالة والتصعيد ومقدم الطلب.', icon: 'fa-money-bill-transfer' },
  { id: 'employees', sectionKey: 'employees', title: 'تقرير الموظفين والموارد البشرية', desc: 'تقرير بيانات الموظفين الشامل مع المسمى الوظيفي والقسم والراتب وتاريخ التوظيف.', icon: 'fa-user-tie' },
  { id: 'journals', sectionKey: 'journals', title: 'تقرير القيود المحاسبية', desc: 'تقرير القيود اليومية مع البيان والمبلغ والحالة والفرع وتاريخ التوجيه.', icon: 'fa-book' },
  { id: 'vouchers', sectionKey: 'vouchers', title: 'تقرير السندات المالية', desc: 'تقرير سندات القبض والصرف مع البيانات المالية والخزينة والحالة.', icon: 'fa-receipt' },
  { id: 'group-dispatch', sectionKey: 'group-dispatch', title: 'تقرير المراسلات الجماعية', desc: 'تقرير المراسلات بين شركات المجموعة مع النوع والأولوية والحالة والمسؤول.', icon: 'fa-paper-plane' },
  { id: 'ingaz', sectionKey: 'ingaz', title: 'تقرير تفاويض الإنجاز', desc: 'تقرير تفاويض الإنجاز الإلكتروني مع بيانات التأشيرة والمكتب والرسوم والحالة.', icon: 'fa-stamp' },
  { id: 'users', sectionKey: 'users', title: 'تقرير مستخدمي النظام', desc: 'تقرير مستخدمي النظام مع الصلاحيات والنوع والفرع وحالة المصادقة الثنائية.', icon: 'fa-shield-halved' },
];

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportCard | null>(null);

  const chartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
    datasets: [
      {
        label: 'عقود الاستقدام المكتملة',
        data: [18, 24, 30, 28, 35, 42, 38],
        backgroundColor: '#00A09D'
      },
      {
        label: 'عقود التأجير والتشغيل',
        data: [12, 15, 14, 20, 22, 25, 27],
        backgroundColor: '#714B67'
      }
    ]
  };

  const doughnutData = {
    labels: ['اثيوبيا', 'الفلبين', 'اوغندا', 'كينيا', 'بنجلاديش'],
    datasets: [
      {
        data: [45, 30, 12, 8, 5],
        backgroundColor: ['#00A09D', '#714B67', '#F59E0B', '#3B82F6', '#10B981']
      }
    ]
  };

  const DATA_MAP: Record<string, any[]> = {
    clients: MOCK_CLIENTS,
    orders: MOCK_ORDERS,
    'recruitment-contracts': MOCK_RECRUITMENT_CONTRACTS,
    'rent-contracts': MOCK_RENT_CONTRACTS,
    shelter: MOCK_SHELTER_ITEMS,
    employees: MOCK_EMPLOYEES,
  };

  const handleExport = (sectionKey: string, format: 'excel' | 'pdf' | 'csv' | 'print') => {
    const config = SECTION_CONFIGS[sectionKey];
    if (!config) {
      console.warn(`No export config found for section: ${sectionKey}`);
      return;
    }
    const data = DATA_MAP[sectionKey] || [];
    exportData(sectionKey, data, format);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-file-chart-column text-purple ml-2"></i> مركز التقارير الموحد والتحليلات ({REPORTS_LIST.length} تقريراً)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            استخراج وتصفيات الفلترة الدقيقة وتصدير البيانات بصيغ XLSX، PDF، و CSV بترويسات عربية احترافية
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="table-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>
            <i className="fa-solid fa-chart-column text-primary ml-2"></i> الإنجاز الشهري للعقود (Chart.js Bar Analytics)
          </h4>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
        </div>

        <div className="table-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>
            <i className="fa-solid fa-chart-pie text-purple ml-2"></i> توزيع العمالة بحسب الجنسية (Doughnut Chart)
          </h4>
          <div style={{ maxHeight: '250px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Reports Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {REPORTS_LIST.map((rep) => (
          <div key={rep.id} className="table-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--accent-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <i className={`fa-solid ${rep.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800' }}>{rep.title}</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                {rep.desc}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-odoo btn-odoo-purple" style={{ flex: 1, fontSize: '12px' }} onClick={() => setActiveReport(rep)}>
                <i className="fa-solid fa-filter ml-1"></i> تصفية
              </button>
              <button className="btn-odoo btn-odoo-primary" style={{ fontSize: '12px' }} onClick={() => handleExport(rep.sectionKey, 'excel')} title="تصدير Excel">
                <i className="fa-solid fa-file-excel"></i>
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ fontSize: '12px' }} onClick={() => handleExport(rep.sectionKey, 'pdf')} title="تصدير PDF">
                <i className="fa-solid fa-file-pdf text-danger"></i>
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ fontSize: '12px' }} onClick={() => handleExport(rep.sectionKey, 'csv')} title="تصدير CSV">
                <i className="fa-solid fa-file-csv text-primary"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal Filter Drawer */}
      {activeReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '100%', maxWidth: '500px', padding: '24px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>تصفية {activeReport.title}</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setActiveReport(null)}></i>
            </div>

            <div className="filter-group" style={{ marginBottom: '12px' }}>
              <label className="filter-label">فترة التقرير من / إلى</label>
              <input type="date" className="filter-input" defaultValue="2026-07-01" />
            </div>

            <div className="filter-group" style={{ marginBottom: '20px' }}>
              <label className="filter-label">اختر الفرع التشغيلي</label>
              <select className="filter-select">
                <option>جميع الفروع</option>
                <option>الفرع الرئيسي - الرياض</option>
                <option>فرع جدة</option>
                <option>فرع الدمام</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-odoo btn-odoo-primary" style={{ flex: 1 }} onClick={() => { handleExport(activeReport.sectionKey, 'excel'); setActiveReport(null); }}>
                <i className="fa-solid fa-file-excel"></i> تصدير Excel فوري
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ flex: 1 }} onClick={() => { handleExport(activeReport.sectionKey, 'pdf'); setActiveReport(null); }}>
                <i className="fa-solid fa-file-pdf"></i> تصدير PDF
              </button>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setActiveReport(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
