/**
 * notificationPopupEngine.ts
 * Real-time Pop-up Toast & Browser Push Notification Engine
 * Khalid Group ERP — Supports multi-tenant company isolation & audio chimes.
 */

export interface PopupNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'zatca' | 'etimad' | 'musaned' | 'shelter';
  companyId?: string;
  companyName?: string;
  timestamp: string;
  durationMs?: number;
  action?: {
    label: string;
    tabKey: string;
  };
}

type NotificationListener = (notifications: PopupNotification[]) => void;

class NotificationPopupEngine {
  private notifications: PopupNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private timers: Map<string, any> = new Map();
  private isAudioMuted: boolean = false;

  constructor() {
    this.isAudioMuted = localStorage.getItem('khalid_popups_muted') === 'true';
  }

  public getNotifications(): PopupNotification[] {
    return [...this.notifications];
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.getNotifications());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const list = this.getNotifications();
    this.listeners.forEach((fn) => fn(list));
  }

  /**
   * Play a subtle glassmorphic alert chime using Web Audio API
   */
  private playPopupChime(type: PopupNotification['type']) {
    if (this.isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      osc.connect(gain);

      if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
      } else if (type === 'warning') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.25);
      } else {
        // Pristine melodic double chime for success / operational notifications
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.36);

      setTimeout(() => ctx.close().catch(() => {}), 450);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Display a floating popup notification
   */
  public show(params: Omit<PopupNotification, 'id' | 'timestamp'>): string {
    const id = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const durationMs = params.durationMs ?? 6500;

    const notif: PopupNotification = {
      ...params,
      id,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      durationMs,
    };

    // Keep max 5 active floating popups at once
    this.notifications = [notif, ...this.notifications.slice(0, 4)];
    this.notifyListeners();
    this.playPopupChime(params.type);

    // Also trigger native OS / browser notification if permitted and in background
    this.sendNativeBrowserNotification(notif.title, notif.message, notif.action?.tabKey);

    // Auto dismiss after durationMs
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
      this.timers.set(id, timer);
    }

    return id;
  }

  public dismiss(id: string) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  public clearAll() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.notifications = [];
    this.notifyListeners();
  }

  public toggleMute(): boolean {
    this.isAudioMuted = !this.isAudioMuted;
    localStorage.setItem('khalid_popups_muted', String(this.isAudioMuted));
    return this.isAudioMuted;
  }

  public getIsMuted(): boolean {
    return this.isAudioMuted;
  }

  /**
   * Request permission for Native Desktop & Mobile Browser Push Notifications
   */
  public async requestBrowserPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Native OS notification
   */
  private sendNativeBrowserNotification(title: string, body: string, tabKey?: string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      const nativeNotif = new Notification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        dir: 'rtl',
        lang: 'ar',
      });

      if (tabKey) {
        nativeNotif.onclick = () => {
          window.focus();
          window.dispatchEvent(new CustomEvent('erp-navigate-tab', { detail: { tab: tabKey } }));
          nativeNotif.close();
        };
      }
    } catch {
      // Fallback
    }
  }

  // Quick helper methods
  public success(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'success', action });
  }

  public warning(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'warning', action });
  }

  public error(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'error', action });
  }

  public info(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'info', action });
  }

  public zatca(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'zatca', action });
  }

  public etimad(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'etimad', action });
  }

  public musaned(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'musaned', action });
  }

  public shelter(title: string, message: string, action?: PopupNotification['action']) {
    return this.show({ title, message, type: 'shelter', action });
  }
}

export const notificationPopupEngine = new NotificationPopupEngine();
