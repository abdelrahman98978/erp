import React, { useState, useEffect } from 'react';
import { LANGUAGES, Language } from '../../i18n/languages';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useImpersonation } from '../../contexts/ImpersonationContext';
import { CompanyId } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';
import { useAppStore } from '../../stores/appStore';
import { NotificationDropdown } from '../common/NotificationDropdown';

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
  const { unreadCount, setQuickSearchOpen, setActiveTab } = useAppStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(64250); // Live system uptime in seconds
  const [selectedBranch, setSelectedBranch] = useState<string>('الفرع الرئيسي');
  const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showTawtheeqModal, setShowTawtheeqModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ar-SA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
      setUptimeSeconds((prev) => prev + 1);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const branches = [
    { id: 'main', name: 'الفرع الرئيسي', city: 'الرياض - طريق الملك فهد' },
    { id: 'riyadh_takhassusi', name: 'فرع الرياض (التخصصي)', city: 'الرياض' },
    { id: 'jeddah', name: 'فرع جدة', city: 'طريق المدينة المنورة' },
    { id: 'dammam', name: 'فرع الدمام', city: 'شارع الملك سعود' },
    { id: 'khamis', name: 'فرع خميس مشيط', city: 'طريق الملك فهد' },
    { id: 'online', name: 'الموقع الخارجي (البوابة)', city: 'أونلاين' },
  ];

  return (
    <>
      {/* Impersonation Banner Overlay */}
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
            العودة لنمط الأدمن الرئيسي
          </button>
        </div>
      )}

      <header
        className="nav-bar-light"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '64px',
          padding: '0 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e4e4e7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          fontFamily: 'var(--font-family-ui)',
          fontFeatureSettings: '"ss03" 1',
        }}
      >
        {/* Right Section: App Switcher, Sidebar Toggle, Page Title, Branch & Company */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="button-outline-on-light"
            onClick={onOpenAppLauncher}
            title={t('appLauncherTitle', 'بوابة الأقسام')}
            style={{ padding: '6px 12px', minHeight: '36px', borderRadius: '9999px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-grip"></i>
            <span style={{ fontSize: '12px' }}>الأقسام</span>
          </button>

          <button
            className="button-outline-on-light"
            style={{ padding: '6px 10px', minHeight: '36px', borderRadius: '9999px', width: '36px', justifyContent: 'center' }}
            onClick={onToggleSidebar}
            title="طي/توسيع القائمة"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Current Page Title */}
          <div className="header-title-box" style={{ marginInlineStart: '4px' }}>
            <h1 className="heading-sm" style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#000000', fontFamily: 'var(--font-family-display)' }}>
              {activeTabTitle}
            </h1>
          </div>

          {/* Active Branch Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="pill-tag-mint"
              style={{
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              <i className="fa-solid fa-location-dot" style={{ color: '#000000' }}></i>
              <span>{selectedBranch}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', opacity: 0.7 }}></i>
            </button>

            {showBranchDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '220px',
                  zIndex: 250,
                  padding: '6px',
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
                  اختيار الفرع التشغيلي:
                </div>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(b.name);
                      setShowBranchDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: selectedBranch === b.name ? '#ECFDF5' : 'transparent',
                      color: selectedBranch === b.name ? '#047857' : '#1E293B',
                      fontWeight: selectedBranch === b.name ? '800' : '600',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{b.name}</span>
                    {selectedBranch === b.name && <i className="fa-solid fa-check text-emerald-600"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Quick Action Pills (ClickERP Header Shortcuts) */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="button-primary-pill"
            onClick={() => setActiveTab('create-contract', 'إضافة عقد استقدام جديد')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              fontSize: '12px',
              minHeight: '32px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
            <span>عقد جديد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders', 'الطلبات المباشرة (الحجوزات)')}
            className="pill-tag-shade"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e4e4e7',
            }}
          >
            الطلبات المباشرة
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branch-departments', 'إدارة الفرق والأقسام')}
            className="pill-tag-shade"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e4e4e7',
            }}
          >
            إدارة الفرق
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports', 'مركز التقارير الموحد')}
            className="pill-tag-shade"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e4e4e7',
            }}
          >
            التقارير
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance-home', 'لوحة التحكم المالية')}
            className="pill-tag-shade"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e4e4e7',
            }}
          >
            المالية
          </button>

          <button
            type="button"
            onClick={() => window.open('https://musaned.com.sa', '_blank')}
            className="pill-tag-mint"
            style={{ cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i>
            <span>مساند برو</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTawtheeqModal(true)}
            className="pill-tag-shade"
            style={{ cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <i className="fa-solid fa-shield-check" style={{ fontSize: '11px' }}></i>
            <span>مساند توثيق</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp-inbox', 'محادثات الدعم واللايف شات')}
            className="pill-tag-mint"
            style={{ cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: '12px' }}></i>
            <span>اللايف شات</span>
          </button>
        </div>

        {/* Left Section: Live System Uptime Timer, Hijri Clock, Search, Notifications, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* System Uptime Indicator */}
          <div
            className="hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: '500',
              color: '#000000',
              fontFamily: 'monospace',
            }}
            title="المدة الزمنية منذ فتح النظام"
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>{formatUptime(uptimeSeconds)}</span>
          </div>

          {/* Hijri/Gregorian Live Clock */}
          <div className="hidden-mobile" style={{ textAlign: 'left', fontSize: '11px', color: '#71717a', lineHeight: '1.3' }}>
            <div style={{ fontWeight: '600', color: '#000000', fontFamily: 'monospace' }}>{currentTime}</div>
            <div style={{ fontSize: '10px' }}>{currentDate}</div>
          </div>

          {/* Quick Search Button (Ctrl+K) */}
          <button
            className="btn-header-icon"
            onClick={() => setQuickSearchOpen(true)}
            title="البحث السريع في النظام (Ctrl + K)"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {/* Fullscreen Button */}
          <button
            className="btn-header-icon hidden-mobile"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'الخروج من ملء الشاشة' : 'وضع ملء الشاشة'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>

          {/* Real-time Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-header-icon relative-box"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="الإشعارات والتنبيهات"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                cursor: 'pointer',
                color: '#000000',
                position: 'relative',
              }}
            >
              <i className="fa-solid fa-bell"></i>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#ba1a1a',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '1px 5px',
                    fontSize: '10px',
                    fontWeight: '700',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown isOpen={showNotifDropdown} onClose={() => setShowNotifDropdown(false)} />
          </div>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '24px',
                padding: '4px 10px 4px 4px',
                cursor: 'pointer',
              }}
            >
              <img
                src="/avatar-admin.png"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://ui-avatars.com/api/?name=Abdelftah&background=000000&color=fff');
                }}
                alt="User Avatar"
                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
              />
              <div className="hidden-mobile" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#000000' }}>عبد الفتاح (مشرف)</div>
                <div style={{ fontSize: '10px', color: '#71717a', fontWeight: 500 }}>دار الرواد للاستقدام</div>
              </div>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#94A3B8' }}></i>
            </button>

            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '230px',
                  zIndex: 250,
                  padding: '8px',
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#000000' }}>عبد الفتاح (Super Admin)</div>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>abdelftah@daralrowad.sa</div>
                  <div style={{ fontSize: '10px', color: '#000000', marginTop: '3px', fontWeight: 600 }}>
                    الفرع الحالي: {selectedBranch}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setActiveTab('settings', 'إعدادات النظام');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    textAlign: 'right',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fa-solid fa-gear text-slate-400"></i>
                  إعدادات الحساب والنظام
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    marginTop: '4px',
                    textAlign: 'right',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal: Musaned Tawtheeq Instant Portal */}
      {showTawtheeqModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-shield-check" style={{ fontSize: '20px' }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>بوابة مساند توثيق الفوري</h3>
                  <p style={{ margin: 0, fontSize: '11px', opacity: 0.85 }}>التحقق المباشر من حالة العقود والتفويض مع منصة مساند</p>
                </div>
              </div>
              <button
                onClick={() => setShowTawtheeqModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                  رقم عقد مساند أو رقم التأشيرة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: MS-2026-88992211"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                  رقم هوية / إقامة صاحب العمل:
                </label>
                <input
                  type="text"
                  placeholder="10XXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowTawtheeqModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('تم الاتصال بمنصة مساند: العقد موثق وساري المفعول بنجاح!');
                    setShowTawtheeqModal(false);
                  }}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#1D4ED8',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(29, 78, 216, 0.3)',
                  }}
                >
                  <i className="fa-solid fa-bolt" style={{ marginLeft: '6px' }}></i>
                  فحص وتوثيق الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
