import React, { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Filter items if user typed in quick search
  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return SIDEBAR_MENU;
    const query = searchQuery.toLowerCase().trim();

    const filterItem = (item: NavItem): NavItem | null => {
      const titleMatch = t(item.id, item.title).toLowerCase().includes(query);
      if (item.children && item.children.length > 0) {
        const matchingChildren = item.children
          .map((child) => filterItem(child))
          .filter((c): c is NavItem => c !== null);
        if (matchingChildren.length > 0 || titleMatch) {
          return { ...item, children: matchingChildren };
        }
      }
      return titleMatch ? item : null;
    };

    return SIDEBAR_MENU.map((item) => filterItem(item)).filter((i): i is NavItem => i !== null);
  }, [searchQuery, t]);

  const renderTreeItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = searchQuery.trim().length > 0 ? true : !!expandedItems[item.id];
    const isDirectActive = item.href === activeTab;

    const checkActiveChild = (children?: NavItem[]): boolean => {
      if (!children) return false;
      return children.some((c) => c.href === activeTab || checkActiveChild(c.children));
    };

    const hasActiveChild = checkActiveChild(item.children);
    const translatedTitle = t(item.id, item.title);

    // Level 0 Group Header
    if (level === 0 && hasChildren) {
      return (
        <div key={item.id} style={{ marginBottom: '8px' }}>
          <div
            onClick={(e) => toggleExpand(item.id, e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: isExpanded ? '#f4f4f5' : 'transparent',
              border: '1px solid',
              borderColor: isExpanded ? '#e4e4e7' : 'transparent',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
              marginBottom: isExpanded ? '4px' : '0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
                }}
              >
                <i className={item.icon || 'fa-solid fa-folder'} />
              </div>
              <span
                style={{
                  fontWeight: 550,
                  fontSize: '13px',
                  color: '#000000',
                  fontFamily: 'var(--font-family-ui)',
                }}
              >
                {translatedTitle}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {item.badge && (
                <span className="pill-tag-mint" style={{ fontSize: '10px', padding: '1px 7px' }}>
                  {item.badge}
                </span>
              )}
              <i
                className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-left'}`}
                style={{ fontSize: '10px', color: '#71717a', transition: 'transform 0.2s ease' }}
              />
            </div>
          </div>

          {isExpanded && (
            <div
              style={{
                paddingRight: '10px',
                borderRight: '1.5px solid #e4e4e7',
                marginRight: '12px',
                marginTop: '3px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {item.children!.map((child) => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf / Submenu Item
    return (
      <div key={item.id} style={{ marginBottom: '2px' }}>
        <div
          onClick={(e) => {
            if (hasChildren) {
              toggleExpand(item.id, e);
            } else if (item.href) {
              onSelectTab(item.href, item.title);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: level > 1 ? '6px 12px' : '7px 12px',
            borderRadius: '9999px',
            backgroundColor: isDirectActive ? '#000000' : 'transparent',
            color: isDirectActive ? '#ffffff' : '#27272a',
            fontSize: level > 1 ? '12px' : '13px',
            fontWeight: isDirectActive ? 550 : 420,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.15s ease',
            fontFamily: 'var(--font-family-ui)',
            fontFeatureSettings: '"ss03" 1',
          }}
          onMouseEnter={(e) => {
            if (!isDirectActive) {
              e.currentTarget.style.backgroundColor = '#f4f4f5';
              e.currentTarget.style.color = '#000000';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDirectActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#27272a';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i
              className={item.icon || 'fa-solid fa-circle-dot'}
              style={{
                fontSize: level > 1 ? '9px' : '12px',
                color: isDirectActive ? '#c1fbd4' : '#71717a',
                width: '14px',
                textAlign: 'center',
              }}
            />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {translatedTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {item.badge && (
              <span
                className={isDirectActive ? 'pill-tag-shade' : 'pill-tag-mint'}
                style={{ fontSize: '10px', padding: '1px 6px' }}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <i
                className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-left'}`}
                style={{ fontSize: '9px', color: isDirectActive ? '#ffffff' : '#71717a' }}
              />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div
            style={{
              paddingRight: '10px',
              borderRight: '1.5px dashed #e4e4e7',
              marginRight: '12px',
              marginTop: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {item.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="app-sidebar"
      style={{
        width: displayMode === 'compact' ? '80px' : '280px',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: '#ffffff',
        borderInlineEnd: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        zIndex: 100,
        boxShadow: '1px 0 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Sidebar Header Brand Logo */}
      <div
        className="sidebar-header"
        style={{
          padding: '16px 14px',
          background: '#ffffff',
          borderBottom: '1px solid #e4e4e7',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          className="brand-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: displayMode === 'compact' ? 'center' : 'flex-start',
          }}
        >
          <img
            src="/logo.png"
            alt="ALSALIM GROUP LOGO"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFFFFF',
              padding: '1px',
              border: '1.5px solid #000000',
              flexShrink: 0,
            }}
          />
          {displayMode !== 'compact' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  color: '#000000',
                  letterSpacing: '0.2px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-family-display)',
                }}
              >
                ALSALIM GROUP
              </span>
              <span style={{ color: '#71717a', fontSize: '11px', fontWeight: 420 }}>
                {t('sidebarTitle', 'مجموعة خالد السليم ERP')}
              </span>
            </div>
          )}
        </div>

        {/* Display Mode Switcher Controls */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f4f4f5',
            borderRadius: '9999px',
            padding: '2px',
            gap: '2px',
            border: '1px solid #e4e4e7',
          }}
        >
          <button
            type="button"
            title="القائمة الهرمية"
            onClick={() => setDisplayMode('tree')}
            style={{
              flex: 1,
              padding: '4px 6px',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: displayMode === 'tree' ? 550 : 420,
              cursor: 'pointer',
              backgroundColor: displayMode === 'tree' ? '#000000' : 'transparent',
              color: displayMode === 'tree' ? '#ffffff' : '#71717a',
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fa-solid fa-list-tree" /> {displayMode !== 'compact' && 'هرمي'}
          </button>

          <button
            type="button"
            title="الشريط المصغر"
            onClick={() => setDisplayMode('compact')}
            style={{
              flex: 1,
              padding: '4px 6px',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: displayMode === 'compact' ? 550 : 420,
              cursor: 'pointer',
              backgroundColor: displayMode === 'compact' ? '#000000' : 'transparent',
              color: displayMode === 'compact' ? '#ffffff' : '#71717a',
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fa-solid fa-table-columns" /> {displayMode !== 'compact' && 'مصغر'}
          </button>

          <button
            type="button"
            title="نمط الكروت"
            onClick={() => setDisplayMode('cards')}
            style={{
              flex: 1,
              padding: '4px 6px',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: displayMode === 'cards' ? 550 : 420,
              cursor: 'pointer',
              backgroundColor: displayMode === 'cards' ? '#000000' : 'transparent',
              color: displayMode === 'cards' ? '#ffffff' : '#71717a',
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fa-solid fa-layer-group" /> {displayMode !== 'compact' && 'كروت'}
          </button>
        </div>

        {/* Quick Menu Search (when not in compact mode) */}
        {displayMode !== 'compact' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fbfbf5',
              border: '1px solid #e4e4e7',
              borderRadius: '9999px',
              padding: '0 12px',
              height: '32px',
            }}
          >
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '11px', color: '#71717a' }} />
            <input
              type="text"
              placeholder="بحث سريع في القائمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '11.5px',
                color: '#000000',
                width: '100%',
                fontFamily: 'var(--font-family-ui)',
              }}
            />
            {searchQuery && (
              <i
                className="fa-solid fa-xmark"
                style={{ fontSize: '11px', color: '#71717a', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div
        className="sidebar-nav"
        style={{
          padding: displayMode === 'compact' ? '10px 8px' : '12px 10px',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {/* MODE 1: HIERARCHICAL TREE VIEW */}
        {displayMode === 'tree' && filteredMenu.map((item) => renderTreeItem(item, 0))}

        {/* MODE 2: COMPACT ICON RAIL WITH HOVER FLYOUT MENU */}
        {displayMode === 'compact' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {filteredMenu.map((item) => {
              const isDirectActive = item.href === activeTab;
              return (
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
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: isDirectActive ? '#000000' : '#ffffff',
                      color: isDirectActive ? '#ffffff' : '#27272a',
                      border: '1px solid',
                      borderColor: isDirectActive ? '#000000' : '#e4e4e7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isDirectActive ? '0 4px 8px rgba(0,0,0,0.12)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <i className={item.icon || 'fa-solid fa-folder'} style={{ fontSize: '15px' }} />
                  </button>

                  {/* Flyout Submenu Panel on Hover */}
                  {activeHoverCategory === item.id && item.children && item.children.length > 0 && (
                    <div
                      className="card-pricing"
                      style={{
                        position: 'absolute',
                        right: '56px',
                        top: 0,
                        width: '260px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04), 0 0 0 1px #e4e4e7',
                        border: '1px solid #e4e4e7',
                        padding: '14px',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          color: '#000000',
                          borderBottom: '1px solid #e4e4e7',
                          paddingBottom: '8px',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <i className={item.icon || 'fa-solid fa-folder'} style={{ fontSize: '12px' }} />
                        <span>{item.title}</span>
                      </div>
                      {item.children.map((child) => {
                        const isChildActive = child.href === activeTab;
                        return (
                          <div
                            key={child.id}
                            onClick={() => {
                              if (child.href) onSelectTab(child.href, child.title);
                            }}
                            style={{
                              padding: '7px 12px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: isChildActive ? 550 : 420,
                              color: isChildActive ? '#ffffff' : '#27272a',
                              backgroundColor: isChildActive ? '#000000' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isChildActive) {
                                e.currentTarget.style.backgroundColor = '#f4f4f5';
                                e.currentTarget.style.color = '#000000';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isChildActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#27272a';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <i
                                className={child.icon || 'fa-solid fa-circle-dot'}
                                style={{ fontSize: '9px', color: isChildActive ? '#c1fbd4' : '#71717a' }}
                              />
                              <span>{child.title}</span>
                            </div>
                            {child.badge && (
                              <span className="pill-tag-mint" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                {child.badge}
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
        )}

        {/* MODE 3: CARDS & MODULE BLOCKS VIEW */}
        {displayMode === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="card-pricing"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '1px solid #e4e4e7',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                    }}
                  >
                    <i className={item.icon || 'fa-solid fa-layer-group'} />
                  </div>
                  <span style={{ fontWeight: 550, fontSize: '12.5px', color: '#000000' }}>{item.title}</span>
                </div>

                {item.children && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {item.children.map((child) => {
                      const isChildActive = child.href === activeTab;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => {
                            if (child.href) onSelectTab(child.href, child.title);
                          }}
                          style={{
                            backgroundColor: isChildActive ? '#000000' : '#f4f4f5',
                            color: isChildActive ? '#FFFFFF' : '#27272a',
                            border: '1px solid',
                            borderColor: isChildActive ? '#000000' : '#e4e4e7',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: isChildActive ? 550 : 420,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {child.title}
                        </button>
                      );
                    })}
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
