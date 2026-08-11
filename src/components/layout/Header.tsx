import React, { useState, useEffect } from 'react';
import { LANGUAGES, Language } from '../../i18n/languages';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useImpersonation } from '../../contexts/ImpersonationContext';
import { CompanyId } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';

interface HeaderProps {
  activeTabTitle: string;
  onToggleSidebar: () => void;
  onOpenAppLauncher: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTabTitle,
  onToggleSidebar,
  onOpenAppLauncher,
  onLogout,
}) => {
  const { currentLanguage, theme, setLanguage, toggleTheme, t } = useLanguage();
  const { activeCompanyId, activeCompany, setActiveCompanyId, companies } = useCompany();
  const { impersonatedState, stopImpersonation } = useImpersonation();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(currentLanguage.code === 'ar' ? 'ar-SA' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString(currentLanguage.code === 'ar' ? 'ar-SA' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  return (
    <>
      {/* Impersonation Banner Overlay when Super Admin acts as employee */}
      {impersonatedState.isImpersonating && (
        <div
          style={{
            background: 'linear-gradient(90deg, #991B1B 0%, #DC2626 100%)',
            color: '#FFFFFF',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-user-secret" style={{ fontSize: '16px' }}></i>
            <span>
              وضع المعاينة والتدقيق الكلي: أنت تتصفح النظام بصلاحيات الموظف (
              <strong>{impersonatedState.employeeName}</strong> - {impersonatedState.employeeTitle})
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            >
              السبب: {impersonatedState.reason}
            </span>
          </div>

          <button
            type="button"
            onClick={stopImpersonation}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#991B1B',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <i className="fa-solid fa-arrow-left-long" style={{ marginLeft: '6px' }}></i>
            العودة لنمط الأدمن الرئيسي
          </button>
        </div>
      )}

      <header className="app-header">
        {/* Right Side: App Switcher, Collapse Btn, Page Title & Company Tag */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="odoo-app-switcher" onClick={onOpenAppLauncher} title={t('appLauncherTitle', 'بوابة الأقسام')}>
            <i className="fa-solid fa-grip"></i>
          </button>

          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '6px 10px', height: '36px' }}
            onClick={onToggleSidebar}
            title="طي/توسيع القائمة"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="header-title-box">
            <h1 className="page-title" style={{ fontFamily: 'var(--font-family-cairo)', margin: 0, fontSize: '18px' }}>
              {activeTabTitle}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span
                style={{
                  fontWeight: '700',
                  color: 'var(--odoo-purple)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Group Logo"
                  style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                />
                خالد السليم للاستقدام والتشغيل
              </span>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span style={{ fontWeight: '800', color: '#059669', fontSize: '12px' }}>
                {activeCompany.name}
              </span>
            </div>
          </div>

          {/* Interactive Company Context Switcher Dropdown */}
          <div style={{ position: 'relative', marginRight: '16px' }}>
            <button
              type="button"
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 12px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <CompanyLogo companyId={activeCompanyId} size={22} />
              <span>{activeCompany.name}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#94A3B8' }}></i>
            </button>

            {showCompanyDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '260px',
                  zIndex: 200,
                  padding: '6px',
                }}
              >
                <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '800', color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
                  اختيار نطاق الشركة (Company Scope):
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCompanyId('all');
                    setShowCompanyDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: activeCompanyId === 'all' ? '#EFF6FF' : 'transparent',
                    color: activeCompanyId === 'all' ? '#1D4ED8' : '#1E293B',
                    fontWeight: activeCompanyId === 'all' ? '800' : '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-globe" style={{ color: '#2563EB' }}></i>
                    إدارة المجموعة المركزية (الكل)
                  </span>
                  {activeCompanyId === 'all' && <i className="fa-solid fa-check text-blue-600"></i>}
                </button>

                <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />

                {companies.map((comp) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => {
                      setActiveCompanyId(comp.id as CompanyId);
                      setShowCompanyDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: activeCompanyId === comp.id ? '#ECFDF5' : 'transparent',
                      color: activeCompanyId === comp.id ? '#047857' : '#334155',
                      fontWeight: activeCompanyId === comp.id ? '800' : '600',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-building-circle-check" style={{ color: '#059669' }}></i>
                      {comp.name}
                    </span>
                    {activeCompanyId === comp.id && <i className="fa-solid fa-check text-emerald-600"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left Side: Time, Search, Notifications, Language & User Profile */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="header-time-box hidden-mobile" style={{ textAlign: 'left', fontSize: '11px', color: '#64748B' }}>
            <div style={{ fontWeight: '700', color: '#1E293B' }}>{currentTime}</div>
            <div>{currentDate}</div>
          </div>

          {/* Theme & Language Controls */}
          <button className="btn-header-icon" onClick={toggleTheme} title="تغيير الثيم">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-header-icon"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              title="تغيير اللغة"
            >
              <i className="fa-solid fa-globe"></i>
            </button>
            {showLangDropdown && (
              <div className="dropdown-menu-custom">
                {LANGUAGES.map((lang: Language) => (
                  <button
                    key={lang.code}
                    className={`dropdown-item-custom ${currentLanguage.code === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="btn-header-icon relative-box" title="الإشعارات">
            <i className="fa-solid fa-bell"></i>
            <span className="badge-count-header">5</span>
          </button>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <button
              className="user-profile-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img src="/avatar-admin.png" onError={(e)=>{ (e.target as HTMLElement).setAttribute('src', 'https://ui-avatars.com/api/?name=Admin+Sulaim&background=0D9488&color=fff'); }} alt="Admin Avatar" className="user-avatar-header" />
              <div className="user-info-header hidden-mobile">
                <span className="user-name-header">سليمان خالد السليم</span>
                <span className="user-role-header">Group Super Admin</span>
              </div>
              <i className="fa-solid fa-chevron-down opacity-50 text-xs"></i>
            </button>

            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '220px',
                  zIndex: 200,
                  padding: '6px',
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>سليمان خالد السليم</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>admin@alsulaim.com.sa</div>
                  <div style={{ fontSize: '10px', color: '#059669', marginTop: '2px', fontWeight: '700' }}>
                    نطاق النشاط: {activeCompany.name}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    textAlign: 'right',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket" style={{ marginLeft: '6px' }}></i>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
