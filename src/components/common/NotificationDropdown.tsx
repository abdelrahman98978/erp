import React, { useEffect, useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Zap,
} from 'lucide-react';
import { useAppStore, AppNotification } from '../../stores/appStore';
import { notificationPopupEngine } from '../../services/notificationPopupEngine';
import {
  backgroundExecutionService,
  BackgroundExecutionState,
} from '../../services/backgroundExecutionService';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string, title: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    activeCompanyId,
  } = useAppStore();

  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    notificationPopupEngine.getPermissionStatus()
  );
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    notificationPopupEngine.getIsMuted()
  );
  const [bgState, setBgState] = useState<BackgroundExecutionState>(() =>
    backgroundExecutionService.getState()
  );
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPermission(notificationPopupEngine.getPermissionStatus());
    setIsMuted(notificationPopupEngine.getIsMuted());
    const unsub = backgroundExecutionService.subscribe((next) => {
      setBgState(next);
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await notificationPopupEngine.requestBrowserPermission();
    setPermission(notificationPopupEngine.getPermissionStatus());
    if (granted) {
      notificationPopupEngine.success(
        'تم تفعيل إشعارات الهاتف والـ Push بنجاح',
        'ستصلك تنبيهات العقود، الفواتير، والمهام التشغيلية حتى أثناء عمل التطبيق في الخلفية.'
      );
    }
  };

  const handleSendTestNotification = () => {
    notificationPopupEngine.show({
      title: 'اختبار إشعار فوري • العمل في الخلفية',
      message: `إشعارات الهاتف والاهتزاز والخدمة الخلفية (Service Worker v3) تعمل بكفاءة تامة للكيان [${activeCompanyId || 'SAF'}].`,
      type: 'zatca',
      companyId: activeCompanyId,
      action: {
        label: 'فتح لوحة المؤشرات',
        tabKey: 'dashboard',
      },
    });
  };

  const handleManualBackgroundSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await backgroundExecutionService.flushBackgroundQueues('notification-center');
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleWakeLock = async () => {
    await backgroundExecutionService.toggleWakeLock();
  };

  const handleItemClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      const titleMap: Record<string, string> = {
        dashboard: 'الرئيسية والمؤشرات التشغيلية',
        travel: 'سجل حجز الطيران والوصول',
        'rent-contracts': 'عقود التأجير والخدمات التشغيلية',
        'recruitment-contracts': 'عقود الاستقدام ومساند',
        zatca: 'فواتير هيئة الزكاة (ZATCA Phase 2)',
        complaints: 'مركز الشكاوى والمقترحات',
        orders: 'إدارة الطلبات والعمليات',
        'kas-suite': 'البوابة المستقلة لشركة كاس (KAS Suite)',
        shelter: 'بوابة مراكز الإيواء والتسكين (DAR)',
      };
      const targetTitle = titleMap[notif.link] || notif.title || 'تفاصيل الإشعار';
      if (onNavigate) {
        onNavigate(notif.link, targetTitle);
      } else {
        window.dispatchEvent(
          new CustomEvent('alsulaim_navigate', {
            detail: { tab: notif.link, title: targetTitle },
          })
        );
      }
      onClose();
    }
  };

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop to close on tap outside */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px] z-[390] sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-x-2.5 top-[calc(var(--header-height,64px)+8px)] sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:mt-2 sm:w-[400px] max-w-[calc(100vw-20px)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[400] overflow-hidden font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-3.5 bg-slate-950 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm truncate">
                  مركز الإشعارات والخدمة الخلفية
                </span>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {bgState.isOnline
                  ? 'متصل بالشبكة • مزامنة Service Worker v3 نشطة'
                  : 'وضع عدم الاتصال • الحفظ الخلفي التلقائي مفعل'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Sound/Vibration Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = notificationPopupEngine.toggleMute();
                setIsMuted(next);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isMuted ? 'تفعيل الصوت والاهتزاز' : 'كتم الصوت والاهتزاز'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10.5px] font-bold text-amber-300 flex items-center gap-1 transition-colors"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3 h-3" />
                <span className="hidden xs:inline">قراءة الكل</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/80 text-slate-300 hover:text-white transition-colors"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Push Permission & Background Controls Bar */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {permission === 'granted' ? (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>إشعارات الهاتف والـ Push مفعلة</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-950 bg-amber-400 hover:bg-amber-500 px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>تفعيل إشعارات قفل الشاشة للهاتف</span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              {/* Test Notification Button */}
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-700 bg-white hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                title="إرسال إشعار تجريبي للتأكد من الصوت والاهتزاز"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>تجربة إشعار</span>
              </button>

              {/* Keep Screen Awake (WakeLock) Toggle */}
              <button
                type="button"
                onClick={handleToggleWakeLock}
                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                  bgState.wakeLockActive
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="منع انطفاء شاشة الهاتف أثناء متابعة العمليات الحية"
              >
                <Smartphone className="w-3 h-3" />
                <span>{bgState.wakeLockActive ? 'الشاشة نشطة' : 'بقاء الشاشة'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[55dvh] sm:max-h-[360px] overflow-y-auto divide-y divide-slate-100 overscroll-contain">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-500 m-0">لا توجد إشعارات جديدة حالياً</p>
              <p className="text-[11px] text-slate-400 mt-1 mb-0">
                سيتم إشعارك تلقائياً فور ورود أي تحديث حتى أثناء عمل النظام في الخلفية
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                  !notif.read ? 'bg-amber-50/40' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">{getTypeIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-xs font-extrabold truncate m-0 ${
                        !notif.read ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed m-0">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5 shadow-xs" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="text-slate-500 hover:text-rose-600 disabled:opacity-40 transition-colors font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الإشعارات</span>
          </button>

          <button
            type="button"
            onClick={handleManualBackgroundSync}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
            <span>
              {bgState.pendingOfflineCount > 0
                ? `مزامنة الخلفية (${bgState.pendingOfflineCount})`
                : 'محدث لحظياً بالخلفية'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
