import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLanguage } from '../../i18n/LanguageContext';

interface AppShellProps {
  activeTab: string;
  activeTabTitle: string;
  onSelectTab: (href: string, title: string) => void;
  onOpenAppLauncher: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  activeTabTitle,
  onSelectTab,
  onOpenAppLauncher,
  onLogout,
  children
}) => {
  const { currentLanguage, theme } = useLanguage();
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Desktop sidebar collapse state vs Mobile drawer open state
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (!isDesktop && mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, mobileDrawerOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  const handleToggleSidebar = useCallback(() => {
    if (isDesktop) {
      setDesktopSidebarCollapsed(prev => !prev);
    } else {
      setMobileDrawerOpen(prev => !prev);
    }
  }, [isDesktop]);

  const handleSelectTab = useCallback((href: string, title: string) => {
    onSelectTab(href, title);
    if (!isDesktop) {
      setMobileDrawerOpen(false);
    }
  }, [onSelectTab, isDesktop]);

  const isRtl = currentLanguage.dir === 'rtl';

  return (
    <div className="app-container" data-theme={theme} dir={currentLanguage.dir}>
      {/* Mobile Backdrop Overlay */}
      {!isDesktop && mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Collapsible or Mobile Slide-over Drawer) */}
      <aside
        className={`app-sidebar ${
          isDesktop
            ? desktopSidebarCollapsed
              ? 'desktop-collapsed'
              : 'desktop-expanded'
            : mobileDrawerOpen
            ? 'mobile-drawer-open'
            : 'mobile-drawer-closed'
        }`}
        style={{
          transform: isDesktop
            ? desktopSidebarCollapsed
              ? isRtl
                ? 'translateX(100%)'
                : 'translateX(-100%)'
              : 'translateX(0)'
            : mobileDrawerOpen
            ? 'translateX(0)'
            : isRtl
            ? 'translateX(100%)'
            : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab} 
          onClose={() => setMobileDrawerOpen(false)} 
        />
      </aside>

      {/* Main Content Area Wrapper */}
      <div
        className="main-wrapper"
        style={{
          marginRight: isDesktop && isRtl && !desktopSidebarCollapsed ? 'var(--sidebar-width)' : '0px',
          marginLeft: isDesktop && !isRtl && !desktopSidebarCollapsed ? 'var(--sidebar-width)' : '0px',
          width: '100%',
          maxWidth: '100vw',
          minWidth: 0,
          transition: 'margin 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sticky Header Navbar */}
        <Header
          activeTabTitle={activeTabTitle}
          onToggleSidebar={handleToggleSidebar}
          onOpenAppLauncher={onOpenAppLauncher}
          onLogout={onLogout}
        />

        {/* Content Body */}
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
