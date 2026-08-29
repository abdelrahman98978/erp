import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useImpersonation } from '../../contexts/ImpersonationContext';
import { useAppStore } from '../../stores/appStore';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { 
  Menu, Grid, Search, Bell, Maximize, Minimize, MapPin, 
  ChevronDown, Plus, FileText, BarChart3, DollarSign, 
  MessageSquare, ShieldCheck, Settings, LogOut, Check, X
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
  const { currentLanguage, t } = useLanguage();
  const { activeCompany } = useCompany();
  const { impersonatedState, stopImpersonation } = useImpersonation();
  const { unreadCount, setQuickSearchOpen, setActiveTab } = useAppStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(64250);
  const [selectedBranch, setSelectedBranch] = useState<string>('الفرع الرئيسي');
  const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);
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

      <header className="nav-bar-light h-16 bg-white border-b border-zinc-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-[90] shadow-sm">
        {/* Right Section: App Switcher, Sidebar Toggle, Page Title, Branch */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile/Desktop Hamburger Sidebar Toggle */}
          <button
            className="button-outline-on-light flex items-center justify-center p-2 rounded-full w-9 h-9 min-h-[36px]"
            onClick={onToggleSidebar}
            title="القائمة الجانبية"
            aria-label="القائمة الجانبية"
          >
            <Menu className="w-4 h-4 text-black" />
          </button>

          <button
            className="button-outline-on-light hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs min-h-[36px]"
            onClick={onOpenAppLauncher}
            title={t('appLauncherTitle', 'بوابة الأقسام')}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>الأقسام</span>
          </button>

          {/* Current Page Title */}
          <div className="header-title-box min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-black m-0 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {activeTabTitle}
            </h1>
          </div>

          {/* Active Branch Switcher */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="pill-tag-mint cursor-pointer flex items-center gap-1 text-[11px] font-medium"
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
        <div className="hidden xl:flex items-center gap-1.5">
          <button
            type="button"
            className="button-primary-pill flex items-center gap-1 px-3 py-1 text-xs min-h-[30px]"
            onClick={() => setActiveTab('create-contract', 'إضافة عقد استقدام جديد')}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>عقد جديد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders', 'الطلبات المباشرة (الحجوزات)')}
            className="pill-tag-shade cursor-pointer border border-zinc-200"
          >
            الطلبات المباشرة
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports', 'مركز التقارير الموحد')}
            className="pill-tag-shade cursor-pointer border border-zinc-200"
          >
            التقارير
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance-home', 'لوحة التحكم المالية')}
            className="pill-tag-shade cursor-pointer border border-zinc-200"
          >
            المالية
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp-inbox', 'محادثات الدعم واللايف شات')}
            className="pill-tag-mint cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-black" />
            <span>اللايف شات</span>
          </button>
        </div>

        {/* Left Section: Search, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* System Uptime Indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-full px-2.5 py-1 text-[11px] font-mono text-zinc-700"
            title="المدة الزمنية منذ فتح النظام"
          >
            <span>{formatUptime(uptimeSeconds)}</span>
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
              <img
                src="/avatar-admin.png"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://ui-avatars.com/api/?name=Abdelftah&background=000000&color=fff');
                }}
                alt="User Avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="hidden sm:block text-right">
                <div className="text-[11px] font-bold text-black leading-tight">عبد الفتاح</div>
                <div className="text-[9.5px] text-zinc-400 font-medium">مشرف عام</div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-zinc-200 rounded-2xl shadow-xl w-56 max-w-[calc(100vw-32px)] z-[250] p-2 space-y-1">
                <div className="p-2 border-b border-zinc-100 mb-1">
                  <div className="font-bold text-xs text-black">عبد الفتاح (Super Admin)</div>
                  <div className="text-[10.5px] text-zinc-400">abdelftah@daralrowad.sa</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setActiveTab('settings', 'إعدادات النظام');
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                  <span>إعدادات النظام</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
