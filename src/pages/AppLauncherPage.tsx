import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface AppTile {
  id: string;
  gridClass: string;
  titleKey: string;
  defaultTitle: string;
  subKey: string;
  defaultSubtitle: string;
  materialIcon: string;
  faIcon: string;
  href: string;
  delay: string;
  isFeatured?: boolean;
  isPistachio?: boolean;
  category: string;
}

interface AppLauncherPageProps {
  onSelectApp: (href: string, title: string) => void;
}

const APPS: AppTile[] = [
  {
    id: 'crm',
    gridClass: 'card-crm',
    titleKey: 'crm',
    defaultTitle: 'إدارة العملاء (CRM)',
    subKey: 'crmSub',
    defaultSubtitle: 'تنظيم بيانات العملاء والمتابعات والرسائل الصادرة والواردة للمجموعة.',
    materialIcon: 'groups',
    faIcon: 'fa-solid fa-users',
    href: 'clients',
    delay: '0.1s',
    isFeatured: true,
    category: 'التسويق والمبيعات'
  },
  {
    id: 'cvs',
    gridClass: 'card-cvs',
    titleKey: 'cvs',
    defaultTitle: 'بنك السير الذاتية (CVs)',
    subKey: 'cvsSub',
    defaultSubtitle: 'فلترة وتصنيف الكوادر البشرية المتاحة وعروض الاستقدام والتشغيل.',
    materialIcon: 'description',
    faIcon: 'fa-solid fa-file-lines',
    href: 'cvs-recruitment',
    delay: '0.2s',
    category: 'الكوادر والتشغيل'
  },
  {
    id: 'recruitment-contracts',
    gridClass: 'card-contracts',
    titleKey: 'recruitment-contracts',
    defaultTitle: 'عقود الاستقدام والتشغيل',
    subKey: 'recruitmentContractsSub',
    defaultSubtitle: 'إدارة عقود العمالة وتتبع حالة التأشيرات والربط مع مساند.',
    materialIcon: 'handshake',
    faIcon: 'fa-solid fa-handshake-simple',
    href: 'recruitment-contracts',
    delay: '0.3s',
    isPistachio: true,
    category: 'العمليات والعقود'
  },
  {
    id: 'shelter',
    gridClass: 'card-accommodation',
    titleKey: 'shelter',
    defaultTitle: 'مراكز الإيواء واللوجستيات',
    subKey: 'shelterSub',
    defaultSubtitle: 'متابعة السكن، التغذية، والرحلات الجوية للعمالة.',
    materialIcon: 'apartment',
    faIcon: 'fa-solid fa-building-user',
    href: 'shelter',
    delay: '0.4s',
    category: 'الخدمات اللوجستية'
  },
  {
    id: 'hr',
    gridClass: 'card-hr',
    titleKey: 'hr',
    defaultTitle: 'الموارد البشرية والرواتب (HR & WPS)',
    subKey: 'hrSub',
    defaultSubtitle: 'ملفات الموظفين، الحضور، الإجازات، ومسيرات الرواتب المتوافقة مع حماية الأجور.',
    materialIcon: 'badge',
    faIcon: 'fa-solid fa-id-badge',
    href: 'employees',
    delay: '0.5s',
    isFeatured: true,
    category: 'الموارد البشرية'
  },
  {
    id: 'reports',
    gridClass: 'card-reports',
    titleKey: 'reports',
    defaultTitle: 'مركز التقارير والذكاء المالي',
    subKey: 'reportsSub',
    defaultSubtitle: 'إحصائيات الأداء الموحد، التحليلات البيانية، ومؤشرات KPI.',
    materialIcon: 'query_stats',
    faIcon: 'fa-solid fa-chart-line',
    href: 'reports',
    delay: '0.6s',
    category: 'التحليلات والمؤشرات'
  },
  {
    id: 'settings',
    gridClass: 'card-settings',
    titleKey: 'settings',
    defaultTitle: 'إعدادات المنظومة والصلاحيات',
    subKey: 'settingsSub',
    defaultSubtitle: 'حسابات المستخدمين، الأدوار الأمنية، وتكاملات API.',
    materialIcon: 'settings',
    faIcon: 'fa-solid fa-sliders',
    href: 'settings',
    delay: '0.7s',
    category: 'الحوكمة والأمان'
  },
  {
    id: 'finance',
    gridClass: 'card-finance',
    titleKey: 'finance',
    defaultTitle: 'المحاسبة العامة (General Ledger)',
    subKey: 'financeSub',
    defaultSubtitle: 'شجرة الحسابات، قيود اليومية، موازين المراجعة، والفوترة ZATCA.',
    materialIcon: 'account_balance_wallet',
    faIcon: 'fa-solid fa-wallet',
    href: 'finance-home',
    delay: '0.8s',
    isPistachio: true,
    category: 'المالية والمحاسبة'
  }
];

export const AppLauncherPage: React.FC<AppLauncherPageProps> = ({ onSelectApp }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredApps = APPS.filter(app => {
    const title = t(app.titleKey, app.defaultTitle);
    const subtitle = t(app.subKey, app.defaultSubtitle);
    return title.toLowerCase().includes(search.toLowerCase()) || subtitle.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--color-canvas-cream)',
      direction: 'rtl',
      fontFamily: 'var(--font-family-ui)',
      fontFeatureSettings: '"ss03" 1',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Light Nav Header */}
      <header className="nav-bar-light" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/logo.png"
            alt="ALSALIM GROUP LOGO"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #000000', padding: '2px', background: '#FFFFFF' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-family-display)', color: '#000000', fontSize: '16px', fontWeight: 500 }}>
              مستكشف المنظومة المؤسسية
            </span>
            <span style={{ fontSize: '11px', color: '#71717a' }}>
              Enterprise Application Launcher • Odoo 18 Multi-Entity Edition
            </span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
            <input
              type="text"
              id="app-search-input"
              name="app-search-input"
              placeholder={t('searchAppPlaceholder', 'ابحث عن وحدة أو قسم...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-input"
              style={{
                borderRadius: '9999px',
                paddingRight: '36px',
                paddingLeft: '16px',
                height: '38px',
                minHeight: '38px',
                width: '240px',
                fontSize: '13px'
              }}
            />
          </div>

          <button
            type="button"
            className="button-outline-on-light"
            onClick={() => onSelectApp('dashboard', 'لوحة المؤشرات التشغيلية')}
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '36px' }}
          >
            لوحة التحكم
          </button>
        </div>
      </header>

      {/* Explorer Content Container */}
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '48px 32px 80px 32px', flexGrow: 1 }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="pill-tag-mint" style={{ marginBottom: '8px' }}>
              SYSTEM MODULES
            </span>
            <h1 className="display-md" style={{ fontSize: '34px', fontWeight: 330, color: '#000000', margin: 0 }}>
              الوحدات والأنظمة التشغيلية
            </h1>
          </div>
          <span className="caption" style={{ color: '#71717a' }}>
            متاحة لكافة فروع وشركات المجموعة
          </span>
        </div>

        {/* 8 Apps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredApps.map((app) => {
            const title = t(app.titleKey, app.defaultTitle);
            const subtitle = t(app.subKey, app.defaultSubtitle);

            let cardClass = 'card-pricing';
            if (app.isFeatured) cardClass = 'card-pricing-featured';
            if (app.isPistachio) cardClass = 'card-pistachio-band';

            return (
              <div
                key={app.id}
                className={cardClass}
                onClick={() => onSelectApp(app.href, title)}
                style={{
                  cursor: 'pointer',
                  minHeight: '220px',
                  borderRadius: '16px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '9999px',
                        backgroundColor: app.isFeatured ? '#000000' : '#ffffff',
                        color: app.isFeatured ? '#ffffff' : '#000000',
                        border: '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      <i className={app.faIcon}></i>
                    </div>
                    <span className={app.isFeatured ? 'pill-tag-shade' : 'pill-tag-mint'} style={{ fontSize: '11px' }}>
                      {app.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: 500, color: '#000000', marginBottom: '8px', fontFamily: 'var(--font-family-display)' }}>
                    {title}
                  </h3>

                  <p style={{ fontSize: '13.5px', color: '#52525b', lineHeight: 1.5, margin: 0 }}>
                    {subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>فتح التطبيق</span>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px' }}></i>
                  </span>
                  <span className="caption" style={{ color: '#71717a', fontSize: '12px' }}>
                    مزامنة فورية
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-light" style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontSize: '13px', color: '#71717a' }}>
          مجموعة خالد السليم للاستقدام والتشغيل • المنظومة السحابية الموحدة
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>4 شركات مرتبطة</span>
          <span className="pill-tag-shade" style={{ fontSize: '11px' }}>قواعد بيانات مستقلة</span>
        </div>
      </footer>
    </main>
  );
};

