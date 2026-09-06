import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, X, Bell, CheckCircle, Share } from 'lucide-react';
import { notificationPopupEngine } from '../../services/notificationPopupEngine';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  useEffect(() => {
    // Check if already running as installed Standalone PWA
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(checkStandalone);
    if (checkStandalone) return;

    // Check if dismissed recently
    const dismissedTime = localStorage.getItem('khalid_pwa_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 1000 * 60 * 60 * 12) {
      // Dismissed within last 12 hours
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture Chrome/Edge/Android beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If iOS Safari, show prompt after a brief delay
    if (isIosDevice && !checkStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Check notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsGranted(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
        notificationPopupEngine.success(
          'تم تثبيت التطبيق بنجاح',
          'يمكنك الآن فتح مجموعة خالد السليم ERP مباشرة من الشاشة الرئيسية دون شريط المتصفح.'
        );
      }
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await notificationPopupEngine.requestBrowserPermission();
    setNotificationsGranted(granted);
    if (granted) {
      notificationPopupEngine.success(
        'تم تفعيل الإشعارات المنبثقة',
        'ستصلك تنبيهات النظام وعقود مساند ومنافسات اعتماد وفواتير ZATCA مباشرة على جهازك.'
      );
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('khalid_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 start-4 z-[99998] max-w-md w-[calc(100%-2rem)] bg-slate-950/95 text-white backdrop-blur-xl border border-amber-400/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
            {isIOS ? (
              <Smartphone className="w-6 h-6 text-amber-400" />
            ) : (
              <Download className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white m-0">
                تثبيت تطبيق خالد السليم ERP (WBA)
              </h4>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-black px-1.5 py-0.5 rounded border border-amber-400/30">
                نسخة الهاتف والكمبيوتر
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 mb-0 leading-relaxed">
              {isIOS ? (
                <span>
                  لتثبيت التطبيق على الآيفون: انقر على زر المشاركة <Share className="w-3.5 h-3.5 inline mx-1 text-amber-400" /> بالمتصفح ثم اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                </span>
              ) : (
                <span>
                  حمّل التطبيق وافتحه كبرنامج مستقل على شاشة الجوال أو سطح المكتب بدون متصفح وبسرعة فائقة.
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Buttons Action Bar */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
        {!isIOS && deferredPrompt && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت التطبيق الآن</span>
          </button>
        )}

        {!notificationsGranted && (
          <button
            type="button"
            onClick={handleEnableNotifications}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="تفعيل إشعارات النظام المباشرة"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>تفعيل الإشعارات المنبثقة</span>
          </button>
        )}

        {notificationsGranted && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>الإشعارات مفعلة</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="py-2 px-3 text-xs text-slate-400 hover:text-slate-200 font-medium rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
};
