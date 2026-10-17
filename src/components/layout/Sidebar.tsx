import React, { useState, useMemo } from 'react';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';
import { NavItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useIamSession } from '../../contexts/IamSessionContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  authService,
  CORPORATE_DEPARTMENTS,
  COMPANY_AUTH_METADATA,
  resolveDepartmentAndCompany,
} from '../../services/authService';
import {
  X, Search, ChevronDown, ChevronLeft, ChevronRight,
  ListTree, Columns, LayoutGrid, CircleDot, Folder,
  LayoutDashboard, Contact, Users, Activity, MessageCircle,
  Send, MailCheck, Layers, FileText, UserPlus, UserCheck,
  Handshake, UserX, Trash2, Clock, ShoppingCart, ListOrdered,
  FileCheck, AlertTriangle, Briefcase, Star, RefreshCw,
  HelpingHand, Headphones, FileSignature, FilePlus, CheckCircle2,
  RotateCcw, Truck, Clock3, Receipt, Zap, ArrowRightLeft,
  ClipboardCheck, Package, Scale, Stamp, ShieldCheck, Hotel,
  Home, Building2, LogOut, Plane, MapPin, Repeat,
  Hourglass, CheckCheck, ScrollText, PlaneLanding, PlaneTakeoff,
  AlertCircle, PlusCircle, Tags, Globe2, Building, FileDown,
  BadgeDollarSign, Plus, BarChart3, Network, CalendarDays, Coins,
  Vault, ShieldAlert, DoorOpen, FileSpreadsheet, CreditCard, Award,
  Wallet, BarChart4, FolderTree, Landmark, FolderKanban, BookOpen,
  MessageSquare, Smartphone, MessagesSquare, Megaphone, Radio,
  GitPullRequest, Globe, FolderSync, UploadCloud, Settings, Sliders,
  History, Settings2, Lock,
} from 'lucide-react';

const LUCIDE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Contact, Users, Activity, MessageCircle,
  Send, MailCheck, Layers, FileText, UserPlus, UserCheck,
  Handshake, UserX, Trash2, Clock, ShoppingCart, ListOrdered,
  FileCheck, AlertTriangle, Briefcase, Star, RefreshCw,
  HelpingHand, Headphones, FileSignature, FilePlus, CheckCircle2,
  RotateCcw, Truck, Clock3, Receipt, Zap, ArrowRightLeft,
  ClipboardCheck, Package, Scale, Stamp, ShieldCheck, Hotel,
  Home, Building2, LogOut, Plane, MapPin, Repeat,
  Hourglass, CheckCheck, ScrollText, PlaneLanding, PlaneTakeoff,
  AlertCircle, PlusCircle, Tags, Globe2, Building, FileDown,
  BadgeDollarSign, Plus, BarChart3, Network, CalendarDays, Coins,
  Vault, ShieldAlert, DoorOpen, FileSpreadsheet, CreditCard, Award,
  Wallet, BarChart4, FolderTree, Landmark, FolderKanban, BookOpen,
  MessageSquare, Smartphone, MessagesSquare, Megaphone, Radio,
  GitPullRequest, Globe, FolderSync, UploadCloud, Settings, Sliders,
  History, Settings2, Folder, CircleDot,
};

interface SidebarProps {
  activeTab: string;
  onSelectTab: (href: string, title: string) => void;
  onClose?: () => void;
}

export type SidebarDisplayMode = 'tree' | 'compact' | 'cards';

function findFirstLeaf(item: NavItem): { href: string; title: string } | null {
  if (item.href) return { href: item.href, title: item.title };
  if (item.children) {
    for (const child of item.children) {
      const found = findFirstLeaf(child);
      if (found) return found;
    }
  }
  return null;
}

function collectLeafItems(item: NavItem): NavItem[] {
  if (item.href && (!item.children || item.children.length === 0)) {
    return [item];
  }
  if (!item.children) return [];
  return item.children.flatMap((c) => collectLeafItems(c));
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, onClose }) => {
  const { currentLanguage } = useLanguage();
  const { isSuperAdmin, activeCompany } = useIamSession();
  const { activeCompanyId } = useCompany();
  const { user: authUser } = useAuthContext();
  const isRtl = currentLanguage.dir === 'rtl';

  const [displayMode, setDisplayMode] = useState<SidebarDisplayMode>('tree');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const effectiveProfile = authUser || authService.getCurrentUser();
  const resolvedScope = useMemo(() => {
    if (!effectiveProfile) {
      return resolveDepartmentAndCompany('accounting@saf-rec.sa');
    }
    return resolveDepartmentAndCompany(
      effectiveProfile.email,
      effectiveProfile.role,
      effectiveProfile.company_id,
      effectiveProfile.department_id
    );
  }, [effectiveProfile]);

  const companyMeta = useMemo(() => {
    const key = resolvedScope.companyId === 'all' ? 'ALL' : resolvedScope.companyId.toUpperCase();
    return COMPANY_AUTH_METADATA[key] || COMPANY_AUTH_METADATA.SAF;
  }, [resolvedScope.companyId]);

  const departmentDef = CORPORATE_DEPARTMENTS[resolvedScope.departmentId];

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'finance-section': true,
    'smacc-gl-group': true,
    'smacc-cash-group': true,
    'smacc-ar-group': true,
    'smacc-ap-group': true,
    'smacc-cc-group': true,
    'smacc-reports-group': true,
    'operations-section': true,
    'recruitment-group': true,
    'rent-group': true,
    'cvs-group': true,
    'offices-group': true,
    'orders-group': true,
    'ingaz-group': true,
    'shelter-group': true,
    'transfer-group': true,
    'logistics-group': true,
    'complaints-group': true,
    'crm-section': true,
    'hr-section': true,
    'governance-section': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (iconName?: string, className = 'w-4 h-4') => {
    if (!iconName) return <CircleDot className={className} />;
    const Component = LUCIDE_ICONS[iconName];
    if (Component) return <Component className={className} />;
    return <CircleDot className={className} />;
  };

  // Multi-Company Isolation Gate
  const isCompanyMatch = (item: NavItem): boolean => {
    if (!item.exclusiveToCompany) return true;
    if (resolvedScope.departmentId === 'executive' || isSuperAdmin) return true;
    const currentCode = (
      effectiveProfile?.company_id ||
      activeCompany?.code ||
      activeCompanyId ||
      ''
    ).toUpperCase();
    return currentCode === item.exclusiveToCompany.toUpperCase();
  };

  // STRICT Department Isolation Gate (Deny by Default!)
  const isLeafAuthorized = (href: string): boolean => {
    if (resolvedScope.departmentId === 'executive' || isSuperAdmin) return true;
    return authService.isTabAuthorizedForUser(effectiveProfile, href);
  };

  // Filter Sidebar Menu strictly by Company + Department + Search Query
  const filteredMenu = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filterItem = (item: NavItem): NavItem | null => {
      if (!isCompanyMatch(item)) return null;

      if (item.children && item.children.length > 0) {
        const authorizedChildren = item.children
          .map(filterItem)
          .filter((child): child is NavItem => child !== null);

        if (authorizedChildren.length === 0) return null;

        if (!query) {
          return { ...item, children: authorizedChildren };
        }

        const selfMatches = item.title.toLowerCase().includes(query);
        if (selfMatches) {
          return { ...item, children: authorizedChildren };
        }
        return { ...item, children: authorizedChildren };
      }

      // Leaf item: MUST be explicitly authorized for this employee's department
      if (!item.href || !isLeafAuthorized(item.href)) {
        return null;
      }

      if (query && !item.title.toLowerCase().includes(query)) {
        return null;
      }

      return item;
    };

    return SIDEBAR_MENU.map(filterItem).filter((item): item is NavItem => item !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, effectiveProfile, resolvedScope, activeCompany, activeCompanyId, isSuperAdmin]);

  const hasActiveChild = (item: NavItem): boolean => {
    if (item.href === activeTab) return true;
    if (!item.children) return false;
    return item.children.some((c) => hasActiveChild(c));
  };

  const getBadgeStyle = (type?: string, isSelected?: boolean) => {
    if (isSelected) {
      return 'bg-zinc-800 text-[#e4c77b] border border-zinc-700';
    }
    switch (type) {
      case 'success':
        return 'bg-[#faebd7] text-black font-semibold';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  const renderTreeItem = (item: NavItem, depth = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isExpanded = Boolean(expandedItems[item.id]) || searchQuery.trim().length > 0;
    const isDirectActive = item.href === activeTab;
    const isBranchActive = !isDirectActive && hasActiveChild(item);

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren) {
        toggleExpand(item.id, e);
        if (item.href) {
          onSelectTab(item.href, item.title);
          if (onClose && window.innerWidth < 1024) onClose();
        }
      } else if (item.href) {
        onSelectTab(item.href, item.title);
        if (onClose && window.innerWidth < 1024) onClose();
      }
    };

    if (depth === 0 && hasChildren) {
      return (
        <div key={item.id} className="mb-2.5">
          <button
            type="button"
            onClick={handleClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isBranchActive
                ? 'bg-zinc-100 text-black border border-zinc-200'
                : 'text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isBranchActive ? 'bg-black text-white' : 'bg-zinc-100 text-black border border-zinc-200'
                }`}
              >
                {renderIcon(item.icon, 'w-3.5 h-3.5')}
              </div>
              <span className="truncate">{item.title}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                isExpanded ? 'rotate-180 text-black' : ''
              }`}
            />
          </button>

          {isExpanded && (
            <div
              className={`mt-1 space-y-0.5 ${
                isRtl ? 'pr-3 mr-3 border-r' : 'pl-3 ml-3 border-l'
              } border-zinc-200`}
            >
              {item.children!.map((child) => renderTreeItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} className="my-0.5">
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-all cursor-pointer ${
            isDirectActive
              ? 'bg-black text-white font-semibold shadow-xs'
              : isBranchActive
              ? 'bg-zinc-100 text-black font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className={`shrink-0 ${isDirectActive ? 'text-white' : 'text-zinc-500'}`}>
              {renderIcon(item.icon, 'w-3.5 h-3.5')}
            </span>
            <span className="truncate">{item.title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {item.badge !== undefined && (
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full ${getBadgeStyle(
                  item.badgeType,
                  isDirectActive
                )}`}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <span className="text-zinc-400">
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : isRtl ? (
                  <ChevronLeft className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        </button>

        {hasChildren && isExpanded && (
          <div
            className={`mt-1 space-y-0.5 ${
              isRtl ? 'pr-3 mr-2.5 border-r' : 'pl-3 ml-2.5 border-l'
            } border-zinc-200`}
          >
            {item.children!.map((subChild) => renderTreeItem(subChild, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-full flex flex-col bg-white border-zinc-200 select-none transition-all duration-200 ${
        isRtl ? 'border-l' : 'border-r'
      } ${displayMode === 'compact' ? 'w-20' : 'w-72'}`}
    >
      {/* 1. Top Corporate Brand & Locked Department Context Header */}
      <div className="p-3.5 border-b border-zinc-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo.png"
              alt="مجموعة خالد السليم"
              className="w-9 h-9 rounded-full border border-[#cfa64a] p-0.5 object-cover shrink-0 bg-white"
            />
            {displayMode !== 'compact' && (
              <div className="min-w-0">
                <div className="font-black text-xs text-black truncate">
                  {companyMeta.emoji} {companyMeta.nameAr}
                </div>
                <div className="text-[10.5px] font-bold text-[#a98232] truncate">
                  {departmentDef.emoji} {departmentDef.badgeText}
                </div>
              </div>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100"
              aria-label="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Locked Department Security Badge */}
        {displayMode !== 'compact' && (
          <div className="px-2.5 py-1.5 rounded-xl bg-[#f5eddc]/70 border border-[#cfa64a]/40 flex items-center justify-between text-[10.5px]">
            <span className="font-bold text-black flex items-center gap-1 truncate">
              <Lock className="w-3 h-3 text-[#a98232] shrink-0" />
              <span className="truncate">{departmentDef.nameAr}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-black text-white font-mono text-[9.5px] font-bold shrink-0">
              {companyMeta.code === 'all' ? 'GROUP' : companyMeta.code}
            </span>
          </div>
        )}

        {/* Display Mode Switcher */}
        <div className="flex items-center justify-between bg-zinc-100 p-1 rounded-full border border-zinc-200">
          <button
            type="button"
            onClick={() => setDisplayMode('tree')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              displayMode === 'tree' ? 'bg-black text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
            }`}
            title="عرض شجري"
          >
            <ListTree className="w-3.5 h-3.5" />
            {displayMode !== 'compact' && <span>شجري</span>}
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('compact')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              displayMode === 'compact' ? 'bg-black text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
            }`}
            title="عرض مضغوط"
          >
            <Columns className="w-3.5 h-3.5" />
            {displayMode !== 'compact' && <span>مضغوط</span>}
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('cards')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              displayMode === 'cards' ? 'bg-black text-white shadow-2xs' : 'text-zinc-600 hover:text-black'
            }`}
            title="عرض بطاقات"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {displayMode !== 'compact' && <span>بطاقات</span>}
          </button>
        </div>

        {/* Quick Menu Search */}
        {displayMode !== 'compact' && (
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="بحث في شاشات القسم..."
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

      {/* 2. Navigation Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* MODE 1: HIERARCHICAL TREE VIEW */}
        {displayMode === 'tree' && filteredMenu.map((item) => renderTreeItem(item, 0))}

        {/* MODE 2: COMPACT ICON RAIL (Fixed so all icons navigate to first authorized leaf) */}
        {displayMode === 'compact' && (
          <div className="flex flex-col items-center gap-2 py-2">
            {filteredMenu.map((item) => {
              const isActive = item.href === activeTab || hasActiveChild(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const target = findFirstLeaf(item);
                    if (target) {
                      onSelectTab(target.href, target.title);
                      if (onClose && window.innerWidth < 1024) onClose();
                    }
                  }}
                  title={item.title}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive ? 'bg-black text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {renderIcon(item.icon, 'w-4 h-4')}
                </button>
              );
            })}
          </div>
        )}

        {/* MODE 3: CARD VIEW (Fixed to flatten nested SMACC & operational sub-groups) */}
        {displayMode === 'cards' && (
          <div className="space-y-2.5 p-1">
            {filteredMenu.map((item) => {
              const leaves = collectLeafItems(item);
              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold text-black">
                    <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                      {renderIcon(item.icon, 'w-3 h-3 text-white')}
                    </div>
                    <span>{item.title}</span>
                  </div>

                  {leaves.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {leaves.map((leaf) => {
                        const isChildActive = leaf.href === activeTab;
                        return (
                          <button
                            key={leaf.id}
                            type="button"
                            onClick={() => {
                              if (leaf.href) {
                                onSelectTab(leaf.href, leaf.title);
                                if (onClose && window.innerWidth < 1024) onClose();
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isChildActive
                                ? 'bg-black text-white font-bold shadow-xs'
                                : 'bg-white hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {leaf.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Sticky Institutional Footer with Direct Logout Button */}
      <div className="p-3 border-t border-zinc-200 bg-[#fbfbf5]">
        {displayMode === 'compact' ? (
          <button
            type="button"
            onClick={() => onSelectTab('logout', 'تسجيل الخروج')}
            title="تسجيل الخروج من القسم"
            className="w-full h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="font-bold text-zinc-700 truncate">
                {effectiveProfile?.full_name || 'موظف القسم'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {effectiveProfile?.branch || 'الفرع الرئيسي'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('logout', 'تسجيل الخروج')}
              className="w-full py-2 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج من القسم</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
