import React from 'react';
import { StatCard } from '../components/ui/StatCard';
import { StatusFlow } from '../components/ui/StatusFlow';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardPageProps {
  onNavigate: (href: string, title: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const contractStages = [
    { id: 'new', name: t('stageNew', 'عقود جديدة') },
    { id: 'musaned', name: t('stageMusaned', 'مساند') },
    { id: 'tafweed', name: t('stageTafweed', 'تفويض') },
    { id: 'tafeez', name: t('stageTafeez', 'تفييز') },
    { id: 'ticket', name: t('stageTicket', 'تذكرة') },
    { id: 'arrival', name: t('stageArrival', 'وصول') },
    { id: 'completed', name: t('stageCompleted', 'مكتمل') }
  ];

  return (
    <div>
      {/* Welcome Banner with Luxury Gold Monogram Logo Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D131F 0%, #1A2333 50%, #714B67 100%)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/logo.png" alt="ALSALIM GROUP Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FFFFFF', padding: '3px', border: '3px solid #D4AF37', boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }} />
          <div>
            <div style={{ fontSize: '13px', color: '#F3E5AB', fontWeight: '800', marginBottom: '4px', letterSpacing: '1px' }}>
              ALSALIM GROUP • BUILDING VALUE. CREATING FUTURES.
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>{t('dashboardWelcomeTitle', 'نظام مجموعة خالد السليم للاستقدام والتشغيل (ERP)')}</h2>
            <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '6px' }}>
              {t('dashboardWelcomeSub', 'مرحباً بك، عبد الفتاح! لديك 7 طلبات استقدام جديدة بحاجة للمراجعة و 5 إشعارات تشغيلية اليوم.')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-odoo btn-odoo-primary" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', color: '#000000', fontWeight: '800', border: 'none' }} onClick={() => onNavigate('create-cv', 'إضافة سيرة ذاتية')}>
            <i className="fa-solid fa-plus"></i> {t('addCV', 'إضافة سيرة ذاتية (136 حقل)')}
          </button>
          <button className="btn-odoo btn-odoo-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }} onClick={() => onNavigate('orders', 'طلبات الاستقدام')}>
            <i className="fa-solid fa-eye"></i> {t('allOrders', 'جميع الطلبات (الحجوزات)')}
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Row (7 KPIs) */}
      <div className="stat-card-grid">
        <StatCard
          title={t('recruitmentContracts', 'عقود الاستقدام')}
          value="44"
          subtext={t('kpiRecruitmentSub', '27 سارية • 6 مكتملة • 11 مرتجعة')}
          icon="fa-solid fa-file-signature"
          variant="teal"
          trend={{ type: 'up', text: '+12% هذا الشهر' }}
        />
        <StatCard
          title={t('rentContracts', 'عقود التأجير والتشغيل')}
          value="24"
          subtext={t('kpiRentSub', 'عقود تشغيل وإعاشة سارية')}
          icon="fa-solid fa-handshake-simple"
          variant="purple"
        />
        <StatCard
          title={t('orders', 'طلبات الاستقدام (الحجوزات)')}
          value="120"
          subtext={t('kpiOrdersSub', '7 جديدة (24h) • 7 تحت الإجراء')}
          icon="fa-solid fa-cart-shopping"
          variant="warning"
          trend={{ type: 'up', text: '7 بحاجة لاتخاذ إجراء' }}
        />
        <StatCard
          title={t('cvs', 'مخزون السير الذاتية (CVs)')}
          value="210"
          subtext={t('kpiCVsSub', '142 توسط • 56 إيجار • 12 مراجعة')}
          icon="fa-solid fa-address-card"
          variant="info"
        />
        <StatCard
          title={t('shelter', 'إدارة الإيواء والعيش')}
          value="18"
          subtext={t('kpiShelterSub', 'عاملة في سكن الإيواء الآن')}
          icon="fa-solid fa-building-user"
          variant="purple"
        />
        <StatCard
          title={t('transfer', 'طلبات نقل الكفالة والتنازل')}
          value="9"
          subtext={t('kpiTransferSub', '4 جاهزة للنقل • 5 تحت التجربة')}
          icon="fa-solid fa-repeat"
          variant="teal"
        />
        <StatCard
          title={t('complaints', 'الشكاوى والتذاكر النشطة')}
          value="3"
          subtext={t('kpiComplaintsSub', 'تذكرة عاجلة وتذكرتان قياسيتان')}
          icon="fa-solid fa-headset"
          variant="danger"
        />
      </div>

      {/* Contract Stages Timeline Workflow */}
      <div style={{ marginBottom: '24px' }}>
        <StatusFlow
          stages={contractStages}
          activeStageId="tafweed"
        />
      </div>

      {/* Main Grid: Live Contracts Table & Operations Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Recent Contracts Live View */}
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              <i className="fa-solid fa-file-contract text-primary ml-2"></i> {t('recentContractsTitle', 'أحدث عقود الاستقدام والتشغيل')}
            </h3>
            <button className="btn-odoo btn-odoo-secondary" style={{ fontSize: '12px' }} onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}>
              {t('viewAll', 'عرض الكل')} <i className="fa-solid fa-arrow-left mr-1"></i>
            </button>
          </div>

          <table className="odoo-table">
            <thead>
              <tr>
                <th>{t('contractNo', 'رقم العقد')}</th>
                <th>{t('clientName', 'العميل')}</th>
                <th>{t('nationality', 'الجنسية والمهنة')}</th>
                <th>{t('stage', 'المرحلة')}</th>
                <th>{t('agency', 'المكتب الخارجي')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#2026-0044</strong></td>
                <td>فهد عبد الله العتيبي</td>
                <td>سائق خاص • الهند</td>
                <td><span className="badge-odoo badge-info">تفويض</span></td>
                <td>وكالة نيو دلهي للاستقدام</td>
              </tr>
              <tr>
                <td><strong>#2026-0043</strong></td>
                <td>محمد بن راشد آل سعود</td>
                <td>عاملة منزلية • الفلبين</td>
                <td><span className="badge-odoo badge-warning">تفييز</span></td>
                <td>Manila Manpower Inc.</td>
              </tr>
              <tr>
                <td><strong>#2026-0042</strong></td>
                <td>د. سارة أحمد الشمري</td>
                <td>ممرضة منزلية • إثيوبيا</td>
                <td><span className="badge-odoo badge-success">مكتمل</span></td>
                <td>Addis Overseas Agency</td>
              </tr>
              <tr>
                <td><strong>#2026-0041</strong></td>
                <td>م. خالد بن سلطان</td>
                <td>طباخ منزلي • كينيا</td>
                <td><span className="badge-odoo badge-primary">مساند</span></td>
                <td>Nairobi Recruitment Co.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Live System Alerts & Quick Action Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', color: 'var(--odoo-purple)' }}>
              <i className="fa-solid fa-bolt text-warning ml-2"></i> {t('quickShortcuts', 'روابط الوصول السريع')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button className="btn-odoo btn-odoo-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => onNavigate('clients', 'العملاء')}>
                <i className="fa-solid fa-users text-primary"></i> {t('crm', 'إدارة العملاء (CRM)')}
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => onNavigate('finance-home', 'المالية')}>
                <i className="fa-solid fa-wallet text-success"></i> {t('finance', 'المحاسبة والمالية (ERP)')}
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => onNavigate('employees', 'الموظفين')}>
                <i className="fa-solid fa-id-badge text-purple"></i> {t('hr', 'الموارد البشرية والرواتب')}
              </button>
              <button className="btn-odoo btn-odoo-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => onNavigate('reports', 'التقارير')}>
                <i className="fa-solid fa-chart-line text-warning"></i> {t('reports', 'مركز التقارير الموحد')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
