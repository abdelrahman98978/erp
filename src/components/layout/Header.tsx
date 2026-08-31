import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useImpersonation } from '../../contexts/ImpersonationContext';
import { useIamSession } from '../../contexts/IamSessionContext';
import { useAppStore } from '../../stores/appStore';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { ProductionDataHubModal } from '../database/ProductionDataHubModal';
import { 
  Menu, Grid, Search, Bell, Maximize, Minimize, MapPin, 
  ChevronDown, Plus, FileText, BarChart3, DollarSign, 
  MessageSquare, ShieldCheck, Settings, LogOut, Check, X,
  Globe, Languages as LanguagesIcon, Building2, ArrowLeftRight,
  Database
} from 'lucide-react';

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
  const { currentLanguage, availableLanguages, setLanguage, t } = useLanguage();
  const { activeCompany } = useCompany();
  const { currentUser: iamUser, activeCompany: iamCompany, canSwitchCompany, switchCompany } = useIamSession();
  const { impersonatedState, stopImpersonation } = useImpersonation();
  const { unreadCount, setQuickSearchOpen, setActiveTab } = useAppStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(64250);
  const [selectedBranch, setSelectedBranch] = useState<string>('الفرع الرئيسي');
  const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showDataHubModal, setShowDataHubModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [langSearch, setLangSearch] = useState<string>('');

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

  const filteredLanguages = availableLanguages.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <>
      {/* Impersonation Banner */}
      {impersonatedState.isImpersonating && (
        <div className="bg-rose-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-[1100]">
          <div className="flex items-center gap-2">
            <span>وضع المعاينة والتدقيق الكلي: أنت تتصفح بصلاحيات (<strong>{impersonatedState.employeeName}</strong>)</span>
          </div>
          <button
            type="button"
            onClick={stopImpersonation}
            className="bg-white text-rose-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-zinc-100"
          >
            العودة لنمط الأدمن الرئيسي
          </button>
        </div>
      )}

      <header className="nav-bar-light h-16 bg-white border-b border-zinc-200 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-[90] shadow-sm flex-nowrap gap-3">
        {/* Right Section: App Switcher, Sidebar Toggle, Page Title, Branch */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0 flex-nowrap">
          {/* Mobile/Desktop Hamburger Sidebar Toggle */}
          <button
            className="button-outline-on-light flex items-center justify-center p-2 rounded-full w-9 h-9 min-h-[36px] shrink-0"
            onClick={onToggleSidebar}
            title="القائمة الجانبية"
            aria-label="القائمة الجانبية"
          >
            <Menu className="w-4 h-4 text-black" />
          </button>

          <button
            className="button-outline-on-light hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs min-h-[36px] shrink-0 whitespace-nowrap"
            onClick={onOpenAppLauncher}
            title={t('appLauncherTitle', 'بوابة الأقسام')}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>الأقسام</span>
          </button>

          {/* Current Page Title */}
          <div className="header-title-box min-w-0 shrink-0">
            <h1 className="text-xs sm:text-sm font-bold text-black m-0 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none whitespace-nowrap">
              {activeTabTitle}
            </h1>
          </div>

          {/* Active Branch Switcher */}
          <div className="relative hidden md:block shrink-0">
            <button
              type="button"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="pill-tag-mint cursor-pointer flex items-center gap-1 text-[11px] font-medium whitespace-nowrap shrink-0"
            >
              <MapPin className="w-3 h-3 text-black" />
              <span>{selectedBranch}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showBranchDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-zinc-200 rounded-2xl shadow-xl w-56 z-[250] p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10.5px] font-bold text-zinc-400 border-b border-zinc-100">
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
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedBranch === b.name
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span>{b.name}</span>
                    {selectedBranch === b.name && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Quick Action Pills (Hidden on small mobile) */}
        <div className="hidden 2xl:flex items-center gap-1.5 flex-nowrap shrink-0">
          <button
            type="button"
            className="button-primary-pill flex items-center gap-1 px-3 py-1 text-xs min-h-[30px] whitespace-nowrap shrink-0"
            onClick={() => setActiveTab('create-contract', 'إضافة عقد استقدام جديد')}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>عقد جديد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders', 'الطلبات المباشرة (الحجوزات)')}
            className="pill-tag-shade cursor-pointer border border-zinc-200 whitespace-nowrap shrink-0"
          >
            الطلبات المباشرة
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports', 'مركز التقارير الموحد')}
            className="pill-tag-shade cursor-pointer border border-zinc-200 whitespace-nowrap shrink-0"
          >
            التقارير
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance-home', 'لوحة التحكم المالية')}
            className="pill-tag-shade cursor-pointer border border-zinc-200 whitespace-nowrap shrink-0"
          >
            المالية
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp-inbox', 'محادثات الدعم واللايف شات')}
            className="pill-tag-mint cursor-pointer whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3 h-3 text-black" />
            <span>اللايف شات</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDataHubModal(true)}
            className="pill-tag-mint cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            title="مركز إدارة قاعدة البيانات المؤسسية والبيانات الفعلية"
          >
            <Database className="w-3 h-3 text-emerald-700" />
            <span>قاعدة البيانات المؤسسية</span>
          </button>
        </div>

        {/* Left Section: 25 Languages Switcher, Search, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 25 Languages Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-full hover:bg-zinc-100 transition-colors text-xs font-semibold text-zinc-800"
              title="تغيير لغة المنظومة (25 لغة)"
            >
              <span className="text-sm leading-none">{currentLanguage.flag}</span>
              <span className="hidden sm:inline text-[11.5px]">{currentLanguage.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute top-full mt-2 left-0 sm:right-auto bg-white border border-zinc-200 rounded-2xl shadow-2xl w-64 max-w-[calc(100vw-32px)] z-[300] p-2 space-y-2 font-sans text-right">
                <div className="px-2 pt-1 pb-2 border-b border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-black flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>لغات النظام (25 لغة عالمية)</span>
                  </span>
                  <button 
                    onClick={() => setShowLangDropdown(false)}
                    className="text-zinc-400 hover:text-black p-0.5 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative px-1">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="ابحث عن لغة..."
                    value={langSearch}
                    onChange={e => setLangSearch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pr-7 pl-3 py-1 text-xs text-black focus:border-black outline-none"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                  {filteredLanguages.map((lang) => {
                    const isSelected = currentLanguage.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangDropdown(false);
                          setLangSearch('');
                        }}
                        className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div>
                            <div className="font-semibold leading-tight">{lang.nativeName}</div>
                            <div className="text-[10px] text-zinc-400 leading-none">{lang.name} ({lang.code.toUpperCase()})</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Button */}
          <button
            className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black hover:bg-zinc-50 transition-colors"
            onClick={() => setQuickSearchOpen(true)}
            title="البحث السريع (Ctrl + K)"
            aria-label="البحث السريع"
          >
            <Search className="w-4 h-4 text-zinc-700" />
          </button>

          {/* Fullscreen Button */}
          <button
            className="hidden sm:flex w-9 h-9 rounded-full bg-white border border-zinc-200 items-center justify-center text-black hover:bg-zinc-50 transition-colors"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
            aria-label="ملء الشاشة"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-zinc-700" /> : <Maximize className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black hover:bg-zinc-50 transition-colors relative"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="الإشعارات والتنبيهات"
              aria-label="الإشعارات"
            >
              <Bell className="w-4 h-4 text-zinc-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white rounded-full px-1.5 py-0.2 text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown isOpen={showNotifDropdown} onClose={() => setShowNotifDropdown(false)} />
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full p-1 pl-2.5 sm:pl-3 hover:bg-zinc-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black shadow-sm">
                {(iamUser?.fullName || 'خ').slice(0, 1)}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-[11px] font-bold text-black leading-tight">
                  {iamUser?.fullName?.split(' ')[0] || 'خالد السليم'}
                </div>
                <div className="text-[9.5px] text-emerald-700 font-bold">
                  {iamUser?.accountType || 'Group Super Admin'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-zinc-200 rounded-2xl shadow-xl w-60 max-w-[calc(100vw-32px)] z-[250] p-2 space-y-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                  <div className="font-bold text-xs text-black">{iamUser?.fullName || 'خالد بن عبدالعزيز السليم'}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{iamUser?.email || 'khalid@alsulaim.sa'}</div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                      {iamCompany?.commercialName || 'شركة كاس للتجارة والمقاولات'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setActiveTab('users', 'إدارة الهوية والصلاحيات متعددة الشركات (IAM)');
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 text-emerald-900 font-bold flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>إدارة الهوية والصلاحيات (IAM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setActiveTab('profile', 'الملف الشخصي والحساب');
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-zinc-700 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span>إعدادات الحساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAppLauncher();
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-zinc-700 flex items-center gap-2"
                >
                  <Grid className="w-3.5 h-3.5 text-zinc-500" />
                  <span>بوابة الأقسام (App Launcher)</span>
                </button>

                <div className="border-t border-zinc-100 my-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Production Database & Real Data Management Modal */}
      <ProductionDataHubModal
        isOpen={showDataHubModal}
        onClose={() => setShowDataHubModal(false)}
      />
    </>
  );
};
