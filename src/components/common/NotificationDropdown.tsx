import React, { useEffect, useState, useMemo } from 'react';
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
  ArrowUpLeft,
} from 'lucide-react';
import { useAppStore, AppNotification } from '../../stores/appStore';
import { notificationPopupEngine } from '../../services/notificationPopupEngine';
import {
  backgroundExecutionService,
  BackgroundExecutionState,
} from '../../services/backgroundExecutionService';
import { CorporateAvatar } from './CorporateAvatar';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string, title: string) => void;
}

type NotifCategory = 'all' | 'urgent' | 'finance' | 'operations';

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
  const [category, setCategory] = useState<NotifCategory>('all');

  useEffect(() => {
    if (!isOpen) return;
    setPermission(notificationPopupEngine.getPermissionStatus());
    setIsMuted(notificationPopupEngine.getIsMuted());
    const unsub = backgroundExecutionService.subscribe((next) => {
      setBgState(next);
    });
    return unsub;
  }, [isOpen]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (category === 'all') return true;
      const text = `${n.title} ${n.message} ${n.link || ''}`.toLowerCase();
      if (category === 'urgent') {
        return n.type === 'warning' || n.type === 'error' || text.includes('عاجل') || text.includes('sla');
      }
      if (category === 'finance') {
        return (
          text.includes('فاتور') ||
          text.includes('سماك') ||
          text.includes('zatca') ||
          text.includes('مالي') ||
          text.includes('سند') ||
          text.includes('قيد')
        );
      }
      if (category === 'operations') {
        return (
          text.includes('عقد') ||
          text.includes('مساند') ||
          text.includes('سفر') ||
          text.includes('إيواء') ||
          text.includes('تأشير') ||
          text.includes('عاملة')
        );
      }
      return true;
    });
  }, [notifications, category]);

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
        return <Info className="w-4 h-4 text-[#8C681E] shrink-0" />;
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
        className="fixed inset-x-2.5 top-[calc(var(--header-height,64px)+8px)] sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:mt-2 sm:w-[420px] max-w-[calc(100vw-20px)] bg-white rounded-2xl shadow-2xl border border-[#CFA64A]/45 z-[400] overflow-hidden font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-3.5 bg-[#1D2428] text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <CorporateAvatar archetype="ai-faris" size="xs" status="online" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm truncate">
                  مركز الإشعارات التنفيذي
                </span>
                {unreadCount > 0 && (
                  <span className="bg-[#CFA64A] text-[#1D2428] text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 block truncate">
                {bgState.isOnline
                  ? 'متصل بالشبكة • مزامنة Service Worker نشطة'
                  : 'وضع عدم الاتصال • الحفظ الخلفي التلقائي مفعل'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                const next = notificationPopupEngine.toggleMute();
                setIsMuted(next);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors cursor-pointer"
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
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10.5px] font-bold text-[#E6D3A7] flex items-center gap-1 transition-colors cursor-pointer"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3 h-3" />
                <span className="hidden xs:inline">قراءة الكل</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-3 py-2 bg-[#FBFBF5] border-b border-zinc-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'الكل' },
              { id: 'urgent', label: 'عاجل / SLA' },
              { id: 'finance', label: 'مالية وسماك' },
              { id: 'operations', label: 'مساند والتشغيل' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                category === tab.id
                  ? 'bg-[#1D2428] text-[#CFA64A] shadow-2xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Push Permission & Background Controls Bar */}
        <div className="p-2.5 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between gap-2 flex-wrap">
          {permission === 'granted' ? (
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>إشعارات الهاتف والـ Push مفعلة</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#1D2428] bg-[#CFA64A] hover:bg-[#d8b159] px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>تفعيل إشعارات الهاتف</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSendTestNotification}
              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-zinc-700 bg-white hover:bg-zinc-100 px-2 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
              title="إرسال إشعار تجريبي للتأكد من الصوت والاهتزاز"
            >
              <Zap className="w-3 h-3 text-[#CFA64A]" />
              <span>تجربة إشعار</span>
            </button>

            <button
              type="button"
              onClick={handleToggleWakeLock}
              className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                bgState.wakeLockActive
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
              title="منع انطفاء شاشة الهاتف أثناء متابعة العمليات الحية"
            >
              <Smartphone className="w-3 h-3" />
              <span>{bgState.wakeLockActive ? 'الشاشة نشطة' : 'بقاء الشاشة'}</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[55dvh] sm:max-h-[340px] overflow-y-auto divide-y divide-zinc-100 overscroll-contain">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              <p className="font-bold text-zinc-600 m-0">لا توجد إشعارات في هذا التصنيف حالياً</p>
              <p className="text-[11px] text-zinc-400 mt-1 mb-0">
                سيتم إشعارك تلقائياً فور ورود أي تحديث حتى أثناء عمل النظام في الخلفية
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors ${
                  !notif.read ? 'bg-[#FBFBF5]' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">{getTypeIcon(notif.type)}</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-extrabold truncate m-0 ${
                        !notif.read ? 'text-[#1D2428]' : 'text-zinc-700'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-zinc-600 line-clamp-2 leading-relaxed m-0">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {notif.link ? (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-[#8C681E]">
                        <span>فتح الشاشة المرتبطة</span>
                        <ArrowUpLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400">إشعار نظام</span>
                    )}
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold text-zinc-700 cursor-pointer"
                      >
                        تحديد كمقروء ✓
                      </button>
                    )}
                  </div>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#CFA64A] shrink-0 mt-1.5 shadow-xs" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="text-zinc-500 hover:text-rose-600 disabled:opacity-40 transition-colors font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الإشعارات</span>
          </button>

          <button
            type="button"
            onClick={handleManualBackgroundSync}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
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
