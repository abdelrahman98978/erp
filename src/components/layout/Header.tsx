import React, { useState, useEffect } from 'react';
import { LANGUAGES, Language } from '../../i18n/languages';
import { useLanguage } from '../../i18n/LanguageContext';

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
  onLogout
}) => {
  const { currentLanguage, theme, setLanguage, toggleTheme, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(currentLanguage.code === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString(currentLanguage.code === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  return (
    <header className="app-header">
      {/* Right Side: App Switcher, Collapse Btn, Page Title & Company Tag */}
      <div className="header-right">
        <button className="odoo-app-switcher" onClick={onOpenAppLauncher} title={t('appLauncherTitle', 'بوابة الأقسام')}>
          <i className="fa-solid fa-grip"></i>
        </button>

        <button className="btn-odoo btn-odoo-secondary" style={{ padding: '6px 10px', height: '36px' }} onClick={onToggleSidebar} title="طي/توسيع القائمة">
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="header-title-box">
          <h1 className="page-title" style={{ fontFamily: 'var(--font-family-cairo)' }}>{activeTabTitle}</h1>
          <span className="breadcrumb-sub" style={{ fontWeight: '700', color: 'var(--odoo-purple)', fontFamily: 'var(--font-family-tajawal)' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '18px', height: '18px', borderRadius: '50%', verticalAlign: 'middle', marginLeft: '6px', marginRight: '6px' }} />
            {t('companyTitle', 'مجموعة خالد السليم للاستقدام والتشغيل | MAJMOAT ALKHALID ALSALIM')}
          </span>
        </div>

        {/* Government Quick Links Ribbon */}
        <div className="gov-links-ribbon hidden-mobile">
          <a href="https://pros.musaned.com.sa/login" target="_blank" rel="noreferrer" className="gov-link-pill">
            <i className="fa-solid fa-external-link"></i> مساند برو
          </a>
          <a href="https://tawtheeq.musaned.com.sa/" target="_blank" rel="noreferrer" className="gov-link-pill">
            <i className="fa-solid fa-file-contract"></i> مساند توثيق
          </a>
          <a href="https://salesiq.zoho.sa/platinumeastern/liveview" target="_blank" rel="noreferrer" className="gov-link-pill">
            <i className="fa-solid fa-comments"></i> اللايف شات
          </a>
          <a href="https://visa.mofa.gov.sa/enjaz/getvisainformation/" target="_blank" rel="noreferrer" className="gov-link-pill">
            <i className="fa-solid fa-id-card"></i> إنجاز
          </a>
          <a href="https://ksavisa.sa/" target="_blank" rel="noreferrer" className="gov-link-pill">
            <i className="fa-solid fa-plane"></i> منصة تأشير
          </a>
        </div>
      </div>

      {/* Left Side: Live Clock, Theme Switcher, 12-Language Selector, Profile & Logout */}
      <div className="header-left">
        {/* Live Clock Widget */}
        <div className="hidden-mobile" style={{ textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ fontWeight: '700', color: 'var(--odoo-purple)', fontSize: '13px' }}>{currentTime}</div>
          <div>{currentDate}</div>
        </div>

        {/* Theme Switcher Toggle Button (Sun / Moon) */}
        <button
          className="btn-odoo btn-odoo-secondary"
          onClick={toggleTheme}
          style={{ width: '38px', height: '38px', borderRadius: '50%', padding: 0 }}
          title={theme === 'dark' ? t('themeLight', 'الوضع الفاتح') : t('themeDark', 'الوضع الداكن')}
        >
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : 'fa-moon text-purple'}`} style={{ fontSize: '16px' }}></i>
        </button>

        {/* 12-Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-odoo btn-odoo-secondary"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            style={{ height: '38px', padding: '0 12px', gap: '6px', fontSize: '13px', fontWeight: '700' }}
            title={t('selectLangHeader', 'اختر لغة النظام (12 لغة)')}
          >
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.nativeName}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
          </button>

          {showLangDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              left: currentLanguage.dir === 'rtl' ? 0 : 'auto',
              right: currentLanguage.dir === 'ltr' ? 0 : 'auto',
              background: 'var(--bg-surface)',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '210px',
              maxHeight: '320px',
              overflowY: 'auto',
              zIndex: 100,
              padding: '6px'
            }}>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', borderBottom: '1px solid #F1F5F9' }}>
                {t('selectLangHeader', 'اختر لغة النظام (12 لغة)')}
              </div>
              {LANGUAGES.map((lang: Language) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: currentLanguage.code === lang.code ? 'var(--primary-light)' : 'transparent',
                    color: currentLanguage.code === lang.code ? 'var(--odoo-teal-dark)' : 'var(--text-main)',
                    fontWeight: currentLanguage.code === lang.code ? '800' : '500',
                    fontSize: '13px',
                    textAlign: 'right'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {currentLanguage.code === lang.code && (
                    <i className="fa-solid fa-check text-primary" style={{ fontSize: '12px' }}></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* App Launcher Button */}
        <button className="btn-odoo btn-odoo-purple" style={{ height: '38px' }} onClick={onOpenAppLauncher} title={t('appLauncherTitle', 'بوابة الأقسام')}>
          <i className="fa-solid fa-grip"></i>
          <span className="hidden-mobile">الأقسام</span>
        </button>

        {/* User Profile Info with Dropdown & Logout Button */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{ cursor: 'pointer' }}
            title="حساب المستخدم والإعدادات"
          >
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #714B67 100%)' }}>خ</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>عبد الفتاح</span>
              <span style={{ fontSize: '10px', color: 'var(--odoo-teal-dark)', fontWeight: '600' }}>مدير النظام</span>
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '4px' }}></i>
          </div>

          {showUserDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              left: currentLanguage.dir === 'rtl' ? 0 : 'auto',
              right: currentLanguage.dir === 'ltr' ? 0 : 'auto',
              background: 'var(--bg-surface)',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '200px',
              zIndex: 100,
              padding: '6px'
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
                <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-main)' }}>عبد الفتاح السليم</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>abdelftah@alsalim.com.sa</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserDropdown(false);
                  if (onLogout) onLogout();
                }}
                style={{
                  width: '100%',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#EF4444',
                  fontWeight: '700',
                  fontSize: '13px'
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>{t('logout', 'تسجيل الخروج')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Red Logout Button */}
        <button
          className="btn-odoo btn-odoo-danger"
          onClick={onLogout}
          style={{ height: '38px', padding: '0 12px', gap: '6px', fontSize: '13px', fontWeight: '700' }}
          title={t('logout', 'تسجيل الخروج')}
        >
          <i className="fa-solid fa-power-off"></i>
          <span className="hidden-mobile">{t('logout', 'خروج')}</span>
        </button>
      </div>
    </header>
  );
};
