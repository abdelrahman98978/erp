import React, { useState } from 'react';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';
import { NavItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (href: string, title: string) => void;
}

export type SidebarDisplayMode = 'tree' | 'compact' | 'cards';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();
  const [displayMode, setDisplayMode] = useState<SidebarDisplayMode>('tree');
  const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'governance-section': true,
    'hr-recruitment-section': true,
    'communications-section': true,
    'microsoft-analytics-section': true,
    'crm-sales-section': true,
    'finance-section': true,
    'settings-section': true,
    'cvs': true,
    'recruitment-contracts': true,
    'rent-contracts': true,
    'crm': true,
    'orders': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTreeItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !!expandedItems[item.id];
    const isDirectActive = item.href === activeTab;

    const checkActiveChild = (children?: NavItem[]): boolean => {
      if (!children) return false;
      return children.some((c) => c.href === activeTab || checkActiveChild(c.children));
    };

    const hasActiveChild = checkActiveChild(item.children);
    const translatedTitle = t(item.id, item.title);

    if (level === 0 && hasChildren) {
      return (
        <div key={item.id} style={{ marginBottom: '10px' }}>
          <div
            onClick={(e) => toggleExpand(item.id, e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: '10px',
              backgroundColor: isExpanded ? 'rgba(0, 81, 84, 0.08)' : 'transparent',
              border: '1px solid',
              borderColor: isExpanded ? 'rgba(0, 81, 84, 0.15)' : 'transparent',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease',
              marginBottom: isExpanded ? '4px' : '0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#005154',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  boxShadow: '0 2px 5px rgba(0, 81, 84, 0.2)',
                }}
              >
                <i className={item.icon || 'fa-solid fa-folder'} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A', fontFamily: 'Cairo, sans-serif' }}>
                {translatedTitle}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {item.badge && <span className={`nav-badge ${item.badgeType || 'primary'}`}>{item.badge}</span>}
              <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-left'}`} style={{ fontSize: '10px', color: '#64748B' }} />
            </div>
          </div>

          {isExpanded && (
            <div style={{ paddingRight: '10px', borderRight: '2px solid #E2E8F0', marginRight: '14px', marginTop: '2px' }}>
              {item.children!.map((child) => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} style={{ marginBottom: '2px' }}>
        <div
          className={`nav-item ${isDirectActive || hasActiveChild ? 'active' : ''}`}
          onClick={(e) => {
            if (hasChildren) {
              toggleExpand(item.id, e);
            } else if (item.href) {
              onSelectTab(item.href, item.title);
            }
          }}
          style={{
            paddingRight: level > 1 ? '16px' : '10px',
            fontSize: level > 1 ? '12px' : '13px',
          }}
        >
          <div className="nav-item-left">
            <i className={`${item.icon || 'fa-solid fa-circle-dot'} nav-icon`} style={{ fontSize: level > 1 ? '10px' : '13px' }} />
            <span style={{ fontWeight: isDirectActive ? '800' : '600' }}>{translatedTitle}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {item.badge && <span className={`nav-badge ${item.badgeType || 'primary'}`}>{item.badge}</span>}
            {hasChildren && <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-left'}`} style={{ fontSize: '10px', color: '#94A3B8' }} />}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div style={{ paddingRight: '12px', borderRight: '2px dashed #CBD5E1', marginRight: '14px', marginTop: '2px' }}>
            {item.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="app-sidebar" style={{ width: displayMode === 'compact' ? '90px' : '280px', transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {/* Sidebar Header Brand Logo */}
      <div className="sidebar-header" style={{ padding: '14px 16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="brand-badge" style={{ gap: '12px', justifyContent: displayMode === 'compact' ? 'center' : 'flex-start' }}>
          <img
            src="/logo.png"
            alt="ALSALIM GROUP LOGO"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFFFFF',
              padding: '2px',
              border: '2px solid #D4AF37',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)',
            }}
          />
          {displayMode !== 'compact' && (
            <div className="brand-title">
              <span className="brand-title-main" style={{ color: '#181C1C', letterSpacing: '0.5px', fontSize: '14px', fontWeight: '900' }}>
                ALSALIM GROUP
              </span>
              <span className="brand-title-sub" style={{ color: '#005154', fontSize: '11px', fontWeight: '700' }}>
                {t('sidebarTitle', 'مجموعة خالد السليم ERP')}
              </span>
            </div>
          )}
        </div>

        {/* Display Mode Switcher Controls */}
        <div style={{ marginTop: '12px', display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px', gap: '2px' }}>
          <button
            type="button"
            title="القائمة الهرمية المعتادة"
            onClick={() => setDisplayMode('tree')}
            style={{
              flex: 1,
              padding: '5px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: displayMode === 'tree' ? '#FFFFFF' : 'transparent',
              color: displayMode === 'tree' ? '#005154' : '#64748B',
              boxShadow: displayMode === 'tree' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <i className="fa-solid fa-list-tree" /> {displayMode !== 'compact' && 'هرمي'}
          </button>

          <button
            type="button"
            title="الشريط المصغر السريع"
            onClick={() => setDisplayMode('compact')}
            style={{
              flex: 1,
              padding: '5px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: displayMode === 'compact' ? '#FFFFFF' : 'transparent',
              color: displayMode === 'compact' ? '#005154' : '#64748B',
              boxShadow: displayMode === 'compact' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <i className="fa-solid fa-[#005154] fa-table-columns" /> {displayMode !== 'compact' && 'مصغر'}
          </button>

          <button
            type="button"
            title="نمط الكروت التفاعلية"
            onClick={() => setDisplayMode('cards')}
            style={{
              flex: 1,
              padding: '5px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: displayMode === 'cards' ? '#FFFFFF' : 'transparent',
              color: displayMode === 'cards' ? '#005154' : '#64748B',
              boxShadow: displayMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <i className="fa-solid fa-layer-group" /> {displayMode !== 'compact' && 'كروت'}
          </button>
        </div>
      </div>

      {/* Navigation Tree Content */}
      <div className="sidebar-nav" style={{ padding: displayMode === 'compact' ? '8px' : '12px' }}>
        {/* MODE 1: HIERARCHICAL TREE VIEW */}
        {displayMode === 'tree' && SIDEBAR_MENU.map((item) => renderTreeItem(item, 0))}

        {/* MODE 2: COMPACT ICON RAIL WITH HOVER FLYOUT MENU */}
        {displayMode === 'compact' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {SIDEBAR_MENU.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveHoverCategory(item.id)}
                onMouseLeave={() => setActiveHoverCategory(null)}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (item.href) onSelectTab(item.href, item.title);
                  }}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    backgroundColor: item.href === activeTab ? '#005154' : '#F8FAFC',
                    color: item.href === activeTab ? '#FFFFFF' : '#0F172A',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    boxShadow: item.href === activeTab ? '0 4px 12px rgba(0,81,84,0.3)' : 'none',
                  }}
                >
                  <i className={item.icon || 'fa-solid fa-folder'} style={{ fontSize: '18px' }} />
                  <span style={{ fontSize: '9px', fontWeight: '800', maxWidth: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title.split(' ')[0]}
                  </span>
                </button>

                {/* Flyout Submenu Panel on Hover */}
                {activeHoverCategory === item.id && item.children && item.children.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '64px',
                      top: 0,
                      width: '240px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      border: '1px solid #E2E8F0',
                      padding: '14px',
                      zIndex: 9999,
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '13px', color: '#005154', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '8px' }}>
                      {item.title}
                    </div>
                    {item.children.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => {
                          if (child.href) onSelectTab(child.href, child.title);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: child.href === activeTab ? '#059669' : '#334155',
                          backgroundColor: child.href === activeTab ? '#ECFDF5' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <i className={child.icon || 'fa-solid fa-circle-dot'} style={{ fontSize: '10px', color: '#005154' }} />
                        <span>{child.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MODE 3: CARDS & MODULE BLOCKS VIEW */}
        {displayMode === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SIDEBAR_MENU.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#005154', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={item.icon || 'fa-solid fa-layer-group'} />
                  </div>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>{item.title}</span>
                </div>

                {item.children && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          if (child.href) onSelectTab(child.href, child.title);
                        }}
                        style={{
                          backgroundColor: child.href === activeTab ? '#059669' : '#F1F5F9',
                          color: child.href === activeTab ? '#FFFFFF' : '#334155',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
