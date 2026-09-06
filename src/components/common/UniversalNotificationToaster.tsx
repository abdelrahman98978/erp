import React, { useState, useEffect } from 'react';
import { 
  notificationPopupEngine, 
  PopupNotification 
} from '../../services/notificationPopupEngine';
import { 
  X, ExternalLink, CheckCircle2, AlertTriangle, AlertOctagon, 
  Info, ShieldCheck, Building2, Plane, Home, Volume2, VolumeX
} from 'lucide-react';

interface UniversalNotificationToasterProps {
  onNavigate?: (tabKey: string, title?: string) => void;
}

export const UniversalNotificationToaster: React.FC<UniversalNotificationToasterProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<PopupNotification[]>([]);
  const [isMuted, setIsMuted] = useState(notificationPopupEngine.getIsMuted());

  useEffect(() => {
    const unsubscribe = notificationPopupEngine.subscribe((items) => {
      setNotifications(items);
    });

    // Listen for custom navigation events
    const handleNavigate = (e: any) => {
      if (e.detail?.tab && onNavigate) {
        onNavigate(e.detail.tab);
      }
    };
    window.addEventListener('erp-navigate-tab', handleNavigate);

    return () => {
      unsubscribe();
      window.removeEventListener('erp-navigate-tab', handleNavigate);
    };
  }, [onNavigate]);

  const handleActionClick = (notif: PopupNotification) => {
    if (notif.action && onNavigate) {
      onNavigate(notif.action.tabKey);
      notificationPopupEngine.dismiss(notif.id);
    }
  };

  const getStyleForType = (type: PopupNotification['type']) => {
    switch (type) {
      case 'zatca':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'هيئة الزكاة ZATCA',
          accent: '#10b981',
        };
      case 'etimad':
        return {
          icon: <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />,
          border: 'border-indigo-500/40',
          badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          label: 'منصة اعتماد الحكومية',
          accent: '#6366f1',
        };
      case 'musaned':
        return {
          icon: <Plane className="w-5 h-5 text-amber-600 shrink-0" />,
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'منصة مساند للاستقدام',
          accent: '#f59e0b',
        };
      case 'shelter':
        return {
          icon: <Home className="w-5 h-5 text-rose-600 shrink-0" />,
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'مراكز الإيواء HRSD',
          accent: '#f43f5e',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          border: 'border-emerald-400/40',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'نجاح العملية',
          accent: '#10b981',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          border: 'border-amber-400/40',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'تنبيه نظام',
          accent: '#f59e0b',
        };
      case 'error':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'خطأ حرج',
          accent: '#ef4444',
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
          border: 'border-sky-400/40',
          badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'إشعار إداري',
          accent: '#0ea5e9',
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div
      dir="rtl"
      className="fixed top-4 end-4 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 select-none"
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))' }}
    >
      {/* Sound Mute Toggle Bar when notifications are active */}
      <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500 pointer-events-auto">
        <span className="font-bold text-zinc-600">🔔 الإشعارات المنبثقة الحية ({notifications.length})</span>
        <button
          type="button"
          onClick={() => {
            const next = notificationPopupEngine.toggleMute();
            setIsMuted(next);
          }}
          className="flex items-center gap-1 hover:text-zinc-800 p-1 rounded transition-colors"
          title={isMuted ? 'تشغيل نغمة الإشعارات' : 'كتم نغمة الإشعارات'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{isMuted ? 'مكتوم' : 'صوت منبه'}</span>
        </button>
      </div>

      {notifications.map((notif) => {
        const meta = getStyleForType(notif.type);

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto relative overflow-hidden bg-white/95 backdrop-blur-md rounded-xl p-3.5 border ${meta.border} shadow-lg transition-all duration-300 animate-in slide-in-from-top-3 fade-in`}
          >
            {/* Top Bar: Icon + Category Badge + Time + Close Button */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                {meta.icon}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
                  {meta.label}
                </span>
                {notif.companyName && (
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                    {notif.companyName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400">{notif.timestamp}</span>
                <button
                  type="button"
                  onClick={() => notificationPopupEngine.dismiss(notif.id)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-zinc-100 transition-colors"
                  title="إغلاق الإشعار"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Message Body */}
            <h5 className="font-extrabold text-[13px] text-zinc-900 m-0 leading-tight">
              {notif.title}
            </h5>
            <p className="text-[11.5px] text-zinc-600 mt-1 mb-2 leading-relaxed whitespace-pre-wrap">
              {notif.message}
            </p>

            {/* Quick Navigation Action Button */}
            {notif.action && (
              <button
                type="button"
                onClick={() => handleActionClick(notif)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all cursor-pointer shadow-sm hover:opacity-95"
                style={{ backgroundColor: meta.accent }}
              >
                <span>{notif.action.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Bottom Progress Bar showing remaining time */}
            <div
              className="absolute bottom-0 start-0 h-[2px] w-full"
              style={{
                backgroundColor: meta.accent,
                animation: `shrinkWidth ${notif.durationMs || 6500}ms linear forwards`,
              }}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
