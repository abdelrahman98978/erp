import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
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
  title: string;
  desc: string;
  icon: string;
}

const REPORTS_LIST: ReportCard[] = [
  { id: 'maids', title: 'تقرير السير الذاتية', desc: 'تصفية السير الذاتية وتصديرها بصيغة PDF موحدة أو Excel بحسب الجنسيات والمكاتب.', icon: 'fa-address-card' },
  { id: 'orders', title: 'تقرير طلبات الاستقدام', desc: 'تصدير الطلبات الحالية بعد الفلترة حسب الحالة والعميل والمسوق والمهلة المحددة.', icon: 'fa-cart-shopping' },
  { id: 'clients', title: 'تقرير العملاء الشامل', desc: 'تقرير العملاء مع بيانات الاتصال والحالة ومؤشرات النشاط وآخر العمليات والطلبات.', icon: 'fa-users' },
  { id: 'recruitment-contracts', title: 'تقرير عقود الاستقدام', desc: 'تقرير موحد لعقود الاستقدام مع فلاتر المرحلة والضمان والعميل والعاملة والمكتب الخارجي.', icon: 'fa-file-signature' },
  { id: 'rent-contracts', title: 'تقرير عقود الإيجار والتشغيل', desc: 'تقرير عقود الإيجار مع حالة العقد والتمديد والضمان والمسوق وطرق الدفع.', icon: 'fa-handshake-simple' },
  { id: 'shelter', title: 'تقرير عقود الإيواء والإعاشة', desc: 'تقرير الإيواء الموحّد مع الضمان والرغبة في العمل ومكان الإيواء ووجبات التغذية.', icon: 'fa-building-user' },
  { id: 'transfer', title: 'تقرير نقل الكفالة', desc: 'تقرير معاملات نقل الكفالة مع بيانات الكفلاء والعاملة والحالة والمدفوعات وفترة التجربة.', icon: 'fa-repeat' },
  { id: 'deportation', title: 'تقرير رحلات الترحيل', desc: 'تقرير رحلات الترحيل مع بيانات العقد والعاملة والعميل وشركة الطيران ورقم الرحلة.', icon: 'fa-plane-departure' },
  { id: 'arrival', title: 'تقرير رحلات الاستقدام', desc: 'تقرير رحلات الاستقدام مجمعة حسب الرحلة كما تظهر في قسم السفر واللوجستيات.', icon: 'fa-plane-arrival' },
  { id: 'complaints', title: 'تقرير الشكاوى والدعم', desc: 'تقرير الشكاوى والتذاكر مع الحالة والأولوية والتعيين والردود ومعدل سرعة الحل.', icon: 'fa-headset' },
  { id: 'offices', title: 'تقرير المكاتب الخارجية', desc: 'تقرير المكاتب الخارجية مع الجنسية والحساب والمدير والارتباطات والتكلفة بالدولار.', icon: 'fa-globe' },
  { id: 'financial-requests', title: 'تقرير الطلبات المالية', desc: 'تقرير الطلبات المالية التشغيلية حسب النوع والحالة والتصعيد ومقدم الطلب.', icon: 'fa-money-bill-transfer' },
  { id: 'zatca-tax', title: 'الإقرار وتقرير الضريبة', desc: 'كشف حساب ضريبة الفواتير والمصروفات والإقرارات الضريبية المعتمدة لدى هيئة الزكاة.', icon: 'fa-qrcode' }
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

  const handleExportExcel = (reportTitle: string) => {
    const data = [
      { 'الرقم': '1', 'اسم التقرير': reportTitle, 'العدد': '113', 'التاريخ': '2026-07-30', 'الحالة': 'مكتمل ومعتمد' },
      { 'الرقم': '2', 'اسم التقرير': reportTitle, 'العدد': '45', 'التاريخ': '2026-07-29', 'الحالة': 'تحت الإجراء' }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تقرير');
    XLSX.writeFile(wb, `${reportTitle}.xlsx`);
  };

  const handleExportPDF = (reportTitle: string) => {
    const doc = new jsPDF();
    doc.text(`MAJMOAT ALKHALID ALSALIM - ${reportTitle}`, 10, 10);
    doc.text(`Date: 2026-07-30 | Status: Approved ERP Report`, 10, 20);
    doc.save(`${reportTitle}.pdf`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-file-chart-column text-purple ml-2"></i> مركز التقارير الموحد والتحليلات (13 تقريراً)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            استخراج وتصفيات الفلترة الدقيقة وتصدير البيانات بفرز XLSX وإصدار ملفات PDF
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
              <button className="btn-odoo btn-odoo-primary" style={{ fontSize: '12px' }} onClick={() => handleExportExcel(rep.title)} title="تصدير Excel">
                <i className="fa-solid fa-file-excel"></i>
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ fontSize: '12px' }} onClick={() => handleExportPDF(rep.title)} title="تصدير PDF">
                <i className="fa-solid fa-file-pdf text-danger"></i>
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
              <button className="btn-odoo btn-odoo-primary" style={{ flex: 1 }} onClick={() => { handleExportExcel(activeReport.title); setActiveReport(null); }}>
                <i className="fa-solid fa-download"></i> تصدير Excel فوري
              </button>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setActiveReport(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
