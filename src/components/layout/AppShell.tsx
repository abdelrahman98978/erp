import React, { useState } from 'react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="app-container" data-theme={theme} dir={currentLanguage.dir}>
      {/* Odoo Styled Sidebar */}
      {!sidebarCollapsed && (
        <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
      )}

      {/* Main Content Area Wrapper */}
      <div className="main-wrapper" style={{
        marginRight: currentLanguage.dir === 'rtl' && !sidebarCollapsed ? 'var(--sidebar-width)' : '0px',
        marginLeft: currentLanguage.dir === 'ltr' && !sidebarCollapsed ? 'var(--sidebar-width)' : '0px'
      }}>
        {/* Sticky Header Navbar */}
        <Header
          activeTabTitle={activeTabTitle}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
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
