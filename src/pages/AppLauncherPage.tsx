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
  bgClass: string;
  iconBg: string;
  iconColor: string;
  hoverBg: string;
  hoverText: string;
  iconSize: string;
  titleSize: string;
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
    defaultSubtitle: 'تنظيم بيانات العملاء والمتابعات والرسائل الصادرة والواردة لمجموعة خالد السليم.',
    materialIcon: 'groups',
    faIcon: 'fa-solid fa-users',
    href: 'clients',
    delay: '0.1s',
    bgClass: '#ffffff',
    iconBg: 'rgba(0, 81, 84, 0.1)',
    iconColor: '#005154',
    hoverBg: '#005154',
    hoverText: '#ffffff',
    iconSize: '40px',
    titleSize: '20px'
  },
  {
    id: 'cvs',
    gridClass: 'card-cvs',
    titleKey: 'cvs',
    defaultTitle: 'إدارة السير الذاتية (CVs)',
    subKey: 'cvsSub',
    defaultSubtitle: 'فلترة وتصنيف الكوادر البشرية المتاحة وعروض التوظيف.',
    materialIcon: 'description',
    faIcon: 'fa-solid fa-file-lines',
    href: 'cvs-recruitment',
    delay: '0.2s',
    bgClass: '#f1f4f4',
    iconBg: 'rgba(215, 227, 252, 0.6)',
    iconColor: '#101c2e',
    hoverBg: '#d7e3fc',
    hoverText: '#101c2e',
    iconSize: '34px',
    titleSize: '18px'
  },
  {
    id: 'recruitment-contracts',
    gridClass: 'card-contracts',
    titleKey: 'recruitment-contracts',
    defaultTitle: 'عقود الاستقدام',
    subKey: 'recruitmentContractsSub',
    defaultSubtitle: 'إدارة عقود العمالة وتتبع حالة التأشيرات لحظياً.',
    materialIcon: 'handshake',
    faIcon: 'fa-solid fa-handshake-simple',
    href: 'recruitment-contracts',
    delay: '0.3s',
    bgClass: '#eceeee',
    iconBg: 'rgba(16, 28, 46, 0.1)',
    iconColor: '#101c2e',
    hoverBg: '#101c2e',
    hoverText: '#ffffff',
    iconSize: '40px',
    titleSize: '20px'
  },
  {
    id: 'shelter',
    gridClass: 'card-accommodation',
    titleKey: 'shelter',
    defaultTitle: 'إدارة الإيواء والتغذية',
    subKey: 'shelterSub',
    defaultSubtitle: 'متابعة السكن وتوزيع العمالة بالمجموعة.',
    materialIcon: 'apartment',
    faIcon: 'fa-solid fa-building-user',
    href: 'shelter',
    delay: '0.4s',
    bgClass: '#f1f4f4',
    iconBg: 'rgba(63, 73, 73, 0.1)',
    iconColor: '#3f4949',
    hoverBg: '#3f4949',
    hoverText: '#ffffff',
    iconSize: '34px',
    titleSize: '18px'
  },
  {
    id: 'hr',
    gridClass: 'card-hr',
    titleKey: 'hr',
    defaultTitle: 'الموارد البشرية والرواتب',
    subKey: 'hrSub',
    defaultSubtitle: 'ملفات الموظفين، الحضور والانصراف، وطلبات الإجازات للمجموعة.',
    materialIcon: 'badge',
    faIcon: 'fa-solid fa-id-badge',
    href: 'employees',
    delay: '0.5s',
    bgClass: '#ffffff',
    iconBg: '#ffdbc9',
    iconColor: '#6f3b18',
    hoverBg: '#6f3b18',
    hoverText: '#ffffff',
    iconSize: '48px',
    titleSize: '24px'
  },
  {
    id: 'reports',
    gridClass: 'card-reports',
    titleKey: 'reports',
    defaultTitle: 'مركز التقارير الموحد',
    subKey: 'reportsSub',
    defaultSubtitle: 'إحصائيات الأداء الذكية والتحليلات البيانية المتقدمة.',
    materialIcon: 'query_stats',
    faIcon: 'fa-solid fa-chart-line',
    href: 'reports',
    delay: '0.6s',
    bgClass: '#e6e9e8',
    iconBg: '#bbc7df',
    iconColor: '#3c475b',
    hoverBg: '#3c475b',
    hoverText: '#ffffff',
    iconSize: '40px',
    titleSize: '20px'
  },
  {
    id: 'settings',
    gridClass: 'card-settings',
    titleKey: 'settings',
    defaultTitle: 'إعدادات المنصة و CMS',
    subKey: 'settingsSub',
    defaultSubtitle: 'الصلاحيات والتحكم.',
    materialIcon: 'settings',
    faIcon: 'fa-solid fa-sliders',
    href: 'settings',
    delay: '0.7s',
    bgClass: '#e0e3e3',
    iconBg: 'rgba(63, 73, 73, 0.1)',
    iconColor: '#3f4949',
    hoverBg: '#3f4949',
    hoverText: '#ffffff',
    iconSize: '28px',
    titleSize: '16px'
  },
  {
    id: 'finance',
    gridClass: 'card-finance',
    titleKey: 'finance',
    defaultTitle: 'المحاسبة والمالية (ERP)',
    subKey: 'financeSub',
    defaultSubtitle: 'الحسابات والقيود.',
    materialIcon: 'account_balance_wallet',
    faIcon: 'fa-solid fa-wallet',
    href: 'finance-home',
    delay: '0.8s',
    bgClass: '#e6e9e8',
    iconBg: '#c8e6c9',
    iconColor: '#2e7d32',
    hoverBg: '#2e7d32',
    hoverText: '#ffffff',
    iconSize: '28px',
    titleSize: '16px'
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
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#181c1c',
      direction: 'rtl',
      fontFamily: 'Tajawal, Cairo, sans-serif'
    }}>
      <style>{`
        .geometric-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(12, 1fr);
          height: 100vh;
          width: 100vw;
          gap: 0;
          background: #181c1c;
        }

        .nav-card-wall {
          position: relative;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
          border: 0.5px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
          z-index: 1;
          cursor: pointer;
          user-select: none;
        }

        .card-crm { grid-area: 1 / 1 / 6 / 5; }
        .card-cvs { grid-area: 1 / 5 / 5 / 9; }
        .card-contracts { grid-area: 1 / 9 / 7 / 13; }
        .card-accommodation { grid-area: 5 / 5 / 9 / 9; }
        .card-hr { grid-area: 6 / 1 / 13 / 5; }
        .card-reports { grid-area: 7 / 9 / 13 / 13; }
        .card-settings { grid-area: 9 / 5 / 13 / 7; }
        .card-finance { grid-area: 9 / 7 / 13 / 9; }

        @media (max-width: 1024px) {
          .geometric-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
            overflow-y: auto;
            height: auto;
            min-height: 100vh;
          }
          .nav-card-wall {
            grid-area: auto !important;
            min-height: 220px;
          }
        }

        .nav-card-wall:hover {
          z-index: 20;
          transform: scale(1.02);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
          filter: brightness(1.05);
        }

        .geometric-grid:hover .nav-card-wall:not(:hover) {
          opacity: 0.7;
          filter: grayscale(0.2);
        }

        .wall-fade-in {
          opacity: 0;
          animation: wallFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes wallFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .inner-content {
          transition: transform 0.5s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .nav-card-wall:hover .inner-content {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Floating Brand Header Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(24, 28, 28, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '10px 24px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <img
          src="/logo.png"
          alt="ALSALIM GROUP LOGO"
          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #D4AF37', background: '#FFFFFF', padding: '2px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: '15px', fontWeight: '800', lineHeight: 1.1 }}>
            ALSALIM GROUP • مجموعة خالد السليم
          </span>
          <span style={{ fontSize: '11px', color: '#87d3d6', fontWeight: '600' }}>
            {t('appLauncherTitle', 'مستكشف الأقسام السريع (Odoo 18 Enterprise Launcher)')}
          </span>
        </div>

        {/* Search Bar Input */}
        <div style={{ marginRight: '16px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            id="app-search-input"
            name="app-search-input"
            placeholder={t('searchAppPlaceholder', 'ابحث...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '6px 16px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              width: '160px',
              fontFamily: 'Tajawal, sans-serif'
            }}
          />
        </div>
      </div>

      {/* 12x12 Interlocking Geometric Wall Grid */}
      <div className="geometric-grid">
        {filteredApps.map((app) => {
          const title = t(app.titleKey, app.defaultTitle);
          const subtitle = t(app.subKey, app.defaultSubtitle);
          return (
            <div
              key={app.id}
              className={`nav-card-wall ${app.gridClass} wall-fade-in`}
              onClick={() => onSelectApp(app.href, title)}
              style={{
                animationDelay: app.delay,
                background: app.bgClass
              }}
            >
              <div className="inner-content">
                {/* Icon Container */}
                <div style={{
                  width: app.id === 'hr' ? '80px' : app.id === 'crm' || app.id === 'recruitment-contracts' || app.id === 'reports' ? '70px' : '56px',
                  height: app.id === 'hr' ? '80px' : app.id === 'crm' || app.id === 'recruitment-contracts' || app.id === 'reports' ? '70px' : '56px',
                  borderRadius: '16px',
                  background: app.iconBg,
                  color: app.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  transition: 'all 0.5s ease'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: app.iconSize }}>
                    {app.materialIcon}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: app.titleSize,
                  fontWeight: '700',
                  color: '#181c1c',
                  margin: '0 0 8px 0'
                }}>
                  {title}
                </h3>

                {/* Subtitle */}
                <p style={{
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '13px',
                  color: '#3f4949',
                  margin: 0,
                  lineHeight: '1.5',
                  maxWidth: app.id === 'hr' ? '260px' : app.id === 'crm' || app.id === 'recruitment-contracts' || app.id === 'reports' ? '220px' : '180px'
                }}>
                  {subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
