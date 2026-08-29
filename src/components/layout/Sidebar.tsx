import React, { useState, useMemo } from 'react';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';
import { NavItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, Search, ChevronDown, ChevronLeft, ChevronRight, 
  ListTree, Columns, LayoutGrid, CircleDot, Folder,
  LayoutDashboard, Contact, Users, Activity, MessageCircle, 
  Send, MailCheck, Layers, FileText, UserPlus, UserCheck, 
  Handshake, UserX, Trash2, Clock, ShoppingCart, ListOrdered, 
  Sparkles, FileCheck, AlertTriangle, Briefcase, Star, RefreshCw, 
  HelpingHand, Headphones, FileSignature, FilePlus, CheckCircle2, 
  RotateCcw, Truck, Clock3, Receipt, Zap, ArrowRightLeft, 
  ClipboardCheck, Package, Scale, Stamp, ShieldCheck, Hotel, 
  Home, Building2, LogOut, Plane, MapPin, Repeat, ArrowLeftRight, 
  Hourglass, CheckCheck, ScrollText, PlaneLanding, PlaneTakeoff, 
  AlertCircle, PlusCircle, Tags, Globe2, Building, FileDown, 
  BadgeDollarSign, Plus, BarChart3, Network, CalendarDays, Coins, 
  Vault, ShieldAlert, DoorOpen, FileSpreadsheet, CreditCard, Award, 
  Wallet, BarChart4, FolderTree, Landmark, FolderKanban, BookOpen, 
  MessageSquare, Smartphone, MessagesSquare, Megaphone, Radio, 
  GitPullRequest, Globe, FolderSync, UploadCloud, Settings, Sliders, 
  History, Settings2
} from 'lucide-react';

const LUCIDE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Contact, Users, Activity, MessageCircle, 
  Send, MailCheck, Layers, FileText, UserPlus, UserCheck, 
  Handshake, UserX, Trash2, Clock, ShoppingCart, ListOrdered, 
  Sparkles, FileCheck, AlertTriangle, Briefcase, Star, RefreshCw, 
  HelpingHand, Headphones, FileSignature, FilePlus, CheckCircle2, 
  RotateCcw, Truck, Clock3, Receipt, Zap, ArrowRightLeft, 
  ClipboardCheck, Package, Scale, Stamp, ShieldCheck, Hotel, 
  Home, Building2, LogOut, Plane, MapPin, Repeat, ArrowLeftRight, 
  Hourglass, CheckCheck, ScrollText, PlaneLanding, PlaneTakeoff, 
  AlertCircle, PlusCircle, Tags, Globe2, Building, FileDown, 
  BadgeDollarSign, Plus, BarChart3, Network, CalendarDays, Coins, 
  Vault, ShieldAlert, DoorOpen, FileSpreadsheet, CreditCard, Award, 
  Wallet, BarChart4, FolderTree, Landmark, FolderKanban, BookOpen, 
  MessageSquare, Smartphone, MessagesSquare, Megaphone, Radio, 
  GitPullRequest, Globe, FolderSync, UploadCloud, Settings, Sliders, 
  History, Settings2, Folder, CircleDot
};

interface SidebarProps {
  activeTab: string;
  onSelectTab: (href: string, title: string) => void;
  onClose?: () => void;
}

export type SidebarDisplayMode = 'tree' | 'compact' | 'cards';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const isRtl = currentLanguage.dir === 'rtl';
  const [displayMode, setDisplayMode] = useState<SidebarDisplayMode>('tree');
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

  const renderIcon = (iconName?: string, className = "w-4 h-4") => {
    if (!iconName) return <CircleDot className={className} />;
    const Component = LUCIDE_ICONS[iconName];
    if (Component) return <Component className={className} />;
    return <CircleDot className={className} />;
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
    const translatedTitle = t(item.id, item.title);

    // Level 0 Group Header
    if (level === 0 && hasChildren) {
      return (
        <div key={item.id} className="mb-2">
          <div
            onClick={(e) => toggleExpand(item.id, e)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer select-none transition-all ${
              isExpanded 
                ? 'bg-zinc-100/90 text-black font-bold border border-zinc-200/80 shadow-xs' 
                : 'hover:bg-zinc-50 text-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                {renderIcon(item.icon, "w-3.5 h-3.5 text-white")}
              </div>
              <span className="text-xs font-bold text-black leading-tight">
                {translatedTitle}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {item.badge}
                </span>
              )}
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : isRtl ? (
                <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </div>
          </div>

          {isExpanded && (
            <div className={`space-y-1 mt-1.5 ${isRtl ? 'pr-3 border-r-2 border-zinc-200 mr-2.5' : 'pl-3 border-l-2 border-zinc-200 ml-2.5'}`}>
              {item.children!.map((child) => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf / Submenu Item
    return (
      <div key={item.id} className="mb-0.5">
        <div
          onClick={(e) => {
            if (hasChildren) {
              toggleExpand(item.id, e);
            } else if (item.href) {
              onSelectTab(item.href, item.title);
            }
          }}
          className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-all ${
            isDirectActive
              ? 'bg-black text-white font-bold shadow-sm'
              : 'hover:bg-zinc-100 text-zinc-700 hover:text-black font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {renderIcon(
              item.icon, 
              `w-4 h-4 flex-shrink-0 transition-colors ${
                isDirectActive 
                  ? 'text-emerald-300' 
                  : 'text-zinc-400 group-hover:text-zinc-800'
              }`
            )}
            <span className="leading-snug">
              {translatedTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isDirectActive 
                    ? 'bg-zinc-800 text-emerald-300' 
                    : 'bg-zinc-100 text-zinc-700 group-hover:bg-emerald-50 group-hover:text-emerald-800'
                }`}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className={`w-3.5 h-3.5 ${isDirectActive ? 'text-white' : 'text-zinc-400'}`} />
              ) : isRtl ? (
                <ChevronLeft className={`w-3.5 h-3.5 ${isDirectActive ? 'text-white' : 'text-zinc-400'}`} />
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 ${isDirectActive ? 'text-white' : 'text-zinc-400'}`} />
              )
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className={`space-y-1 mt-1 ${isRtl ? 'pr-2.5 border-r border-dashed border-zinc-200 mr-2' : 'pl-2.5 border-l border-dashed border-zinc-200 ml-2'}`}>
            {item.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white text-zinc-900 select-none border-inline-end border-zinc-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-zinc-200 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="ALSALIM GROUP"
              className="w-9 h-9 rounded-full object-cover p-0.5 border border-black flex-shrink-0"
            />
            {displayMode !== 'compact' && (
              <div>
                <div className="text-xs font-black text-black tracking-tight leading-tight font-display">
                  ALSALIM GROUP
                </div>
                <div className="text-[10.5px] text-zinc-400 font-medium">
                  {t('sidebarTitle', 'مجموعة خالد السليم ERP')}
                </div>
              </div>
            )}
          </div>

          {/* Close button on Mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
              title="إغلاق القائمة"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Display Mode Switcher Controls */}
        <div className="flex bg-zinc-100 rounded-full p-0.5 border border-zinc-200">
          <button
            type="button"
            title="القائمة الهرمية"
            onClick={() => setDisplayMode('tree')}
            className={`flex-1 py-1 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              displayMode === 'tree' ? 'bg-black text-white shadow-sm' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ListTree className="w-3 h-3" />
            {displayMode !== 'compact' && <span>هرمي</span>}
          </button>

          <button
            type="button"
            title="الشريط المصغر"
            onClick={() => setDisplayMode('compact')}
            className={`flex-1 py-1 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              displayMode === 'compact' ? 'bg-black text-white shadow-sm' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <Columns className="w-3 h-3" />
            {displayMode !== 'compact' && <span>مصغر</span>}
          </button>

          <button
            type="button"
            title="نمط الكروت"
            onClick={() => setDisplayMode('cards')}
            className={`flex-1 py-1 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              displayMode === 'cards' ? 'bg-black text-white shadow-sm' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            {displayMode !== 'compact' && <span>كروت</span>}
          </button>
        </div>

        {/* Quick Menu Search */}
        {displayMode !== 'compact' && (
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="بحث سريع في القائمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs text-black placeholder-zinc-400"
            />
            {searchQuery && (
              <X
                className="w-3.5 h-3.5 text-zinc-400 cursor-pointer hover:text-black"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* MODE 1: HIERARCHICAL TREE VIEW */}
        {displayMode === 'tree' && filteredMenu.map((item) => renderTreeItem(item, 0))}

        {/* MODE 2: COMPACT ICON RAIL */}
        {displayMode === 'compact' && (
          <div className="flex flex-col items-center gap-2 py-2">
            {filteredMenu.map((item) => {
              const isDirectActive = item.href === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) onSelectTab(item.href, item.title);
                  }}
                  title={item.title}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isDirectActive ? 'bg-black text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {renderIcon(item.icon, "w-4 h-4")}
                </button>
              );
            })}
          </div>
        )}

        {/* MODE 3: CARD VIEW */}
        {displayMode === 'cards' && (
          <div className="space-y-2.5 p-1">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2.5 shadow-xs"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold text-black">
                  <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                    {renderIcon(item.icon, "w-3 h-3 text-white")}
                  </div>
                  <span>{item.title}</span>
                </div>

                {item.children && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.children.map((child) => {
                      const isChildActive = child.href === activeTab;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => {
                            if (child.href) onSelectTab(child.href, child.title);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isChildActive
                              ? 'bg-black text-white font-bold shadow-xs'
                              : 'bg-white hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                          }`}
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
    </div>
  );
};

export default Sidebar;
