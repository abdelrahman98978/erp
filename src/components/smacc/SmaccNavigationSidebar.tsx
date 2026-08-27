import React, { useState } from 'react';
import {
  Home,
  Settings,
  DollarSign,
  Building2,
  Package,
  Users,
  ChevronDown,
  ChevronLeft,
  Search,
  FileText,
  CreditCard,
  PieChart,
  UserCheck,
  TrendingUp,
  Receipt,
  Globe,
  Sliders,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowLeftRight
} from 'lucide-react';

export interface SmaccMenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  children?: { id: string; title: string; route: string; badge?: string }[];
}

interface SmaccNavigationSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const SMACC_MENU_STRUCTURE: SmaccMenuItem[] = [
  {
    id: 'dashboard',
    title: 'الرئيسية',
    icon: Home,
  },
  {
    id: 'settings',
    title: 'الأعدادات',
    icon: Settings,
    children: [
      { id: 'general-settings', title: 'إعدادات النظام العامة', route: 'smacc-hr-settings' },
      { id: 'numbering-settings', title: 'الترقيم التلقائي والتفويضات', route: 'smacc-hr-settings' },
      { id: 'branch-settings', title: 'الفروع والشركات التابعة', route: 'branch-departments' },
      { id: 'users-permissions', title: 'إدارة المستخدمين والصلاحيات', route: 'users' },
      { id: 'master-constants', title: 'الثوابت والقواميس الموحدة', route: 'master-constants' },
    ]
  },
  {
    id: 'financial-accounting',
    title: 'المحاسبه الماليه',
    icon: DollarSign,
    children: [
      { id: 'chart-of-accounts', title: '1. دليل الحسابات الشجري', route: 'smacc-accounting' },
      { id: 'cost-centers', title: '2. شجرة ودليل مراكز التكلفة', route: 'smacc-accounting' },
      { id: 'journal-entries', title: '3. قيود اليومية العامة والاعتماد', route: 'smacc-accounting' },
      { id: 'receipt-vouchers', title: '4. سندات القبض (نقدي/بنكي)', route: 'smacc-accounting' },
      { id: 'payment-vouchers', title: '5. سندات الصرف والتحويلات', route: 'smacc-accounting' },
      { id: 'account-ledger', title: '6. كشف حساب تفصيلي', route: 'smacc-accounting' },
      { id: 'trial-balance', title: '7. ميزان المراجعة بالأرصدة', route: 'smacc-accounting' },
      { id: 'income-statement', title: '8. قائمة الدخل والأرباح والخسائر', route: 'smacc-accounting' },
      { id: 'balance-sheet', title: '9. قائمة المركز المالي (الميزانية)', route: 'smacc-accounting' },
      { id: 'fiscal-closing', title: '10. إقفال السنـة والربط المالي', route: 'smacc-accounting' },
    ]
  },
  {
    id: 'fixed-assets',
    title: 'الأصول الثابته',
    icon: Building2,
    children: [
      { id: 'assets-register', title: 'سجل ومستندات الأصول الثابتة', route: 'smacc-inventory-assets' },
      { id: 'depreciation-schedule', title: 'جدول إهلاكات الأصول الدورية', route: 'smacc-inventory-assets' },
      { id: 'asset-disposals', title: 'إضافات واستبعادات الأصول', route: 'smacc-inventory-assets' },
    ]
  },
  {
    id: 'inventory-control',
    title: 'المخزون',
    icon: Package,
    children: [
      { id: 'item-catalog', title: 'دليل الأصناف والمنتجات', route: 'smacc-inventory-assets' },
      { id: 'stock-movements', title: 'حركات المخزون والتحويلات', route: 'smacc-inventory-assets' },
      { id: 'inventory-audit', title: 'تسويات وقوائم الجرد الدوري', route: 'smacc-inventory-assets' },
      { id: 'stock-vouchers', title: 'أذونات الصرف والإضافة', route: 'smacc-inventory-assets' },
    ]
  },
  {
    id: 'employees-hr',
    title: 'الموظفين',
    icon: Users,
    children: [
      { id: 'employee-directory', title: 'سجل الموظفين والملفات الإدارية', route: 'smacc-hr-settings' },
      { id: 'payroll-processing', title: 'مسير الرواتب والمستحقات', route: 'smacc-hr-settings' },
      { id: 'attendance-leaves', title: 'الحضور والانصراف والإجازات', route: 'attendances' },
      { id: 'advances-custodies', title: 'السلفيات والعهد المالية', route: 'custodies' },
      { id: 'eosb-calc', title: 'مكافأة نهاية الخدمة والتسويات', route: 'smacc-hr-settings' },
    ]
  },
  {
    id: 'external-integrations',
    title: 'الأقسام الخارجية والربط',
    icon: Globe,
    children: [
      { id: 'zatca-phase2', title: 'فواتير ZATCA الإلكترونية (الربط والتكامل)', route: 'zatca' },
      { id: 'external-agencies', title: 'مكاتب ووكلاء الاستقدام الخارجي', route: 'external-offices' },
      { id: 'musaned-portal', title: 'بوابة عقود منصة مساند', route: 'recruitment-contracts' },
      { id: 'clients-suppliers', title: 'دليل العملاء والموردين', route: 'clients' },
      { id: 'sales-reps', title: 'إدارة البائعين ومحصلي المبيعات', route: 'smacc-modules' },
    ]
  }
];

export const SmaccNavigationSidebar: React.FC<SmaccNavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    'financial-accounting': true,
    'settings': false,
    'fixed-assets': false,
    'inventory-control': false,
    'employees-hr': false,
    'external-integrations': false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const filteredMenuItems = SMACC_MENU_STRUCTURE.filter(item => {
    if (!searchQuery) return true;
    const matchParent = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchChild = item.children?.some(child => child.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchParent || matchChild;
  });

  return (
    <aside className="w-64 bg-[#1e293b] text-slate-200 border-l border-slate-700 flex flex-col h-full select-none shadow-xl">
      {/* Brand Header matching SMACC */}
      <div className="p-4 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md text-lg tracking-wider border border-blue-400/30">
            SMACC
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 leading-tight">نظام المحاسبة الشامل</h2>
            <p className="text-[11px] text-slate-400">بحر العرب / الإصدار الحديث</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="النظام متصل" />
      </div>

      {/* Menu Quick Search Input */}
      <div className="p-3 border-b border-slate-800 bg-[#1e293b]">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="البحث في قائمة SMACC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 pr-9 pl-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openSubmenus[item.id] || searchQuery.length > 0;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="rounded-md overflow-hidden">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleSubmenu(item.id);
                  } else {
                    onSelectTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span>{item.title}</span>
                </div>
                {hasChildren && (
                  <span className="text-slate-400 hover:text-slate-200">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </button>

              {/* Child Menu Tree */}
              {hasChildren && isOpen && (
                <div className="mr-4 mt-1 mb-1 pl-2 border-r-2 border-slate-700/60 space-y-1">
                  {item.children?.map((child) => {
                    const isChildActive = activeTab === child.id || activeTab === child.route;
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelectTab(child.route)}
                        className={`w-full text-right px-3 py-1.5 rounded text-[12px] transition-all flex items-center justify-between ${
                          isChildActive
                            ? 'bg-blue-500/20 text-blue-300 font-bold border-r-2 border-blue-400'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{child.title}</span>
                        {child.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#0f172a] border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1">
        <div className="flex items-center justify-between text-slate-300">
          <span>حالة النظام:</span>
          <span className="font-semibold text-emerald-400">جاهز ومطابق 100%</span>
        </div>
        <div className="text-[10px] text-slate-500 text-center mt-1">
          حقوق الطبع © 2026 بحر العرب لأنظمة المعلومات
        </div>
      </div>
    </aside>
  );
};
