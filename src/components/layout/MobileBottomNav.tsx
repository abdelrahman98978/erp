import React, { useEffect, useState } from 'react';
import {
  Home,
  Briefcase,
  Grid,
  Bell,
  Menu,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  Building2,
  HeartHandshake,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useCompany } from '../../contexts/CompanyContext';
import {
  backgroundExecutionService,
  BackgroundExecutionState,
} from '../../services/backgroundExecutionService';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (href: string, title: string) => void;
  onOpenAppLauncher: () => void;
  onToggleSidebar: () => void;
  onToggleNotifications: () => void;
  isNotificationsOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAppLauncher,
  onToggleSidebar,
  onToggleNotifications,
  isNotificationsOpen,
}) => {
  const { unreadCount } = useAppStore();
  const { activeCompanyId } = useCompany();
  const [bgState, setBgState] = useState<BackgroundExecutionState>(() =>
    backgroundExecutionService.getState()
  );
  const [syncingNow, setSyncingNow] = useState(false);

  useEffect(() => {
    const unsub = backgroundExecutionService.subscribe((next) => {
      setBgState(next);
    });
    return unsub;
  }, []);

  // Resolve primary operations tab dynamically per company
  const primaryOpsTab = (() => {
    const co = String(activeCompanyId || 'SAF').toUpperCase();
    if (co === 'KAS') {
      return {
        href: 'kas-suite',
        label: 'منافسات كاس',
        title: 'البوابة المستقلة لشركة كاس (KAS Suite)',
        icon: Building2,
      };
    }
    if (co === 'DAR') {
      return {
        href: 'shelter',
        label: 'الإيواء',
        title: 'بوابة مراكز الإيواء والتسكين (DAR)',
        icon: HeartHandshake,
      };
    }
    if (co === 'YAQ') {
      return {
        href: 'rent-contracts',
        label: 'عقود التأجير',
        title: 'عقود التأجير والتشغيل (YAQ)',
        icon: Briefcase,
      };
    }
    return {
      href: 'recruitment-contracts',
      label: 'العقود',
      title: 'عقود الاستقدام ومساند',
      icon: Briefcase,
    };
  })();

  const OpsIcon = primaryOpsTab.icon;
  const isHomeActive = activeTab === 'dashboard' && !isNotificationsOpen;
  const isOpsActive =
    (activeTab === primaryOpsTab.href ||
      activeTab.includes('contract') ||
      activeTab.includes('kas') ||
      activeTab.includes('shelter')) &&
    !isNotificationsOpen;

  const handleManualSync = async () => {
    if (syncingNow) return;
    setSyncingNow(true);
    try {
      await backgroundExecutionService.flushBackgroundQueues('manual-mobile-bar');
    } finally {
      setSyncingNow(false);
    }
  };

  return (
    <nav
      dir="rtl"
      aria-label="شريط التنقل السفلي للهاتف"
      className="fixed bottom-0 inset-x-0 z-[95] lg:hidden bg-white/95 backdrop-blur-xl border-t border-zinc-200/90 shadow-[0_-8px_24px_rgba(9,23,37,0.08)] select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Top Micro Status Strip: Shown when Offline or Pending Background Sync */}
      {(!bgState.isOnline || bgState.pendingOfflineCount > 0) && (
        <div
          className={`px-3 py-1 text-[10.5px] font-bold flex items-center justify-between border-b ${
            !bgState.isOnline
              ? 'bg-amber-500/15 text-amber-950 border-amber-300/60'
              : 'bg-emerald-500/15 text-emerald-950 border-emerald-300/60'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {!bgState.isOnline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-600 shrink-0 animate-pulse" />
                <span className="truncate">
                  وضع عدم الاتصال • العمل في الخلفية نشط ({bgState.pendingOfflineCount} بالانتظار)
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">
                  طابور المزامنة الخلفية ({bgState.pendingOfflineCount} عمليات جاهزة للمزامنة)
                </span>
              </>
            )}
          </div>

          {bgState.isOnline && bgState.pendingOfflineCount > 0 && (
            <button
              type="button"
              onClick={handleManualSync}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shrink-0"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${syncingNow ? 'animate-spin' : ''}`} />
              <span>مزامنة الآن</span>
            </button>
          )}
        </div>
      )}

      {/* 5-Column Ergonomic Mobile Navigation Bar */}
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-md mx-auto">
        {/* 1. Home / Dashboard */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard', 'الرئيسية والمؤشرات التشغيلية')}
          className={`flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-colors ${
            isHomeActive ? 'text-zinc-950 font-extrabold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
              isHomeActive ? 'bg-amber-400/25 text-amber-900' : ''
            }`}
          >
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10.5px] leading-none truncate">الرئيسية</span>
        </button>

        {/* 2. Primary Company Operations */}
        <button
          type="button"
          onClick={() => onSelectTab(primaryOpsTab.href, primaryOpsTab.title)}
          className={`flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-colors ${
            isOpsActive ? 'text-zinc-950 font-extrabold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
              isOpsActive ? 'bg-amber-400/25 text-amber-900' : ''
            }`}
          >
            <OpsIcon className="w-4 h-4" />
          </div>
          <span className="text-[10.5px] leading-none truncate">{primaryOpsTab.label}</span>
        </button>

        {/* 3. Center Elevated Action Button: App Launcher */}
        <div className="flex items-center justify-center h-full">
          <button
            type="button"
            onClick={onOpenAppLauncher}
            aria-label="بوابة الأقسام"
            className="w-12 h-12 -mt-4 rounded-2xl bg-gradient-to-tr from-[#091725] to-[#1c3c60] text-amber-400 border-2 border-amber-400/60 shadow-lg shadow-zinc-900/25 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
          >
            <Grid className="w-5 h-5" />
            <span className="text-[9px] font-black text-white leading-none">الأقسام</span>
          </button>
        </div>

        {/* 4. Mobile Notification Center Trigger */}
        <button
          type="button"
          onClick={onToggleNotifications}
          className={`relative flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-colors ${
            isNotificationsOpen ? 'text-zinc-950 font-extrabold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div
            className={`relative w-9 h-7 rounded-full flex items-center justify-center transition-all ${
              isNotificationsOpen ? 'bg-amber-400/25 text-amber-900' : ''
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10.5px] leading-none truncate">الإشعارات</span>
        </button>

        {/* 5. Full Sidebar Menu Drawer */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center gap-1 h-full rounded-xl text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <div className="w-9 h-7 rounded-full flex items-center justify-center">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10.5px] leading-none truncate">القائمة</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
