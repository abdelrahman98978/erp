import React from 'react';
import { useAppStore, AppNotification } from '../../stores/appStore';

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
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useAppStore();

  if (!isOpen) return null;

  const handleItemClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link && onNavigate) {
      const titleMap: Record<string, string> = {
        travel: 'سجل حجز الطيران والوصول',
        'rent-contracts': 'عقود التأجير والخدمات التشغيلية',
        zatca: 'فواتير هيئة الزكاة (ZATCA Phase 2)',
        complaints: 'مركز الشكاوى والمقترحات',
        orders: 'إدارة الطلبات والعمليات',
      };
      onNavigate(notif.link, titleMap[notif.link] || 'تفاصيل الإشعار');
      onClose();
    }
  };

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>;
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-amber-500 text-lg"></i>;
      case 'error':
        return <i className="fa-solid fa-circle-xmark text-rose-500 text-lg"></i>;
      default:
        return <i className="fa-solid fa-circle-info text-sky-500 text-lg"></i>;
    }
  };

  return (
    <div
      className="absolute top-full start-0 mt-2 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden font-sans"
      dir="rtl"
    >
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bell text-amber-400"></i>
          <span className="font-bold text-sm">مركز الإشعارات والتنبيهات المباشرة</span>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} جديد
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-slate-300 hover:text-white transition-colors"
            >
              تحديد الكل كمقروء
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <i className="fa-regular fa-bell-slash text-3xl mb-2 text-slate-300"></i>
            <p>لا توجد إشعارات جديدة حالياً</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                !notif.read ? 'bg-sky-50/50' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">{getTypeIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={clearNotifications}
            className="text-slate-500 hover:text-rose-600 transition-colors font-medium"
          >
            مسح جميع الإشعارات
          </button>
          <span className="text-slate-400 text-[11px]">محدث لحظياً بالـ Realtime</span>
        </div>
      )}
    </div>
  );
};
