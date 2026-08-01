import React, { useState } from 'react';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';
import { NavItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (href: string, title: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'crm': true,
    'cvs': true,
    'orders': true,
    'recruitment-contracts': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="app-sidebar">
      {/* Sidebar Header Brand Logo - Clean White Theme */}
      <div className="sidebar-header" style={{ padding: '16px 20px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="brand-badge" style={{ gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src="/logo.png"
              alt="ALSALIM GROUP LOGO"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                background: '#FFFFFF',
                padding: '2px',
                border: '2px solid #D4AF37',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
              }}
            />
          </div>
          <div className="brand-title">
            <span className="brand-title-main" style={{ color: '#181C1C', letterSpacing: '0.5px', fontSize: '15px', fontWeight: '900' }}>
              ALSALIM GROUP
            </span>
            <span className="brand-title-sub" style={{ color: '#005154', fontSize: '11px', fontWeight: '700' }}>
              {t('sidebarTitle', 'مجموعة خالد السليم ERP')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="sidebar-nav">
        <div className="nav-section-title" style={{ color: '#005154', fontWeight: '800' }}>
          {t('mainNavSection', 'القائمة الرئيسية والتشغيل')}
        </div>

        {SIDEBAR_MENU.map((item: NavItem) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = !!expandedItems[item.id];
          const isDirectActive = item.href === activeTab;
          const hasActiveChild = hasChildren && item.children?.some(c => c.href === activeTab);
          const translatedTitle = t(item.id, item.title);

          return (
            <div key={item.id} style={{ marginBottom: '2px' }}>
              {/* Parent Item */}
              <div
                className={`nav-item ${isDirectActive || hasActiveChild ? 'active' : ''}`}
                onClick={(e) => {
                  if (hasChildren) {
                    toggleExpand(item.id, e);
                  } else if (item.href) {
                    onSelectTab(item.href, item.title);
                  }
                }}
              >
                <div className="nav-item-left">
                  <i className={`${item.icon} nav-icon`}></i>
                  <span>{translatedTitle}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span className={`nav-badge ${item.badgeType || 'primary'}`}>
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-left'}`} style={{ fontSize: '11px', color: '#94A3B8' }}></i>
                  )}
                </div>
              </div>

              {/* Submenu Accordion */}
              {hasChildren && isExpanded && (
                <div className="submenu-list">
                  {item.children?.map(sub => {
                    const isSubActive = sub.href === activeTab;
                    const subTranslatedTitle = t(sub.id, sub.title);
                    return (
                      <div
                        key={sub.id}
                        className={`submenu-item ${isSubActive ? 'active' : ''}`}
                        onClick={() => sub.href && onSelectTab(sub.href, sub.title)}
                      >
                        <span>{subTranslatedTitle}</span>
                        {sub.badge && (
                          <span className={`nav-badge ${sub.badgeType || 'primary'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {sub.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
