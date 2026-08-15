import { create } from 'zustand';
import { CompanyId } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

interface AppState {
  // Navigation & Flow
  flowState: 'landing' | 'login' | 'launcher' | 'workspace';
  activeTab: string;
  activeTabTitle: string;
  setFlowState: (flow: 'landing' | 'login' | 'launcher' | 'workspace') => void;
  setActiveTab: (tab: string, title: string) => void;

  // Realtime Notifications
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  // Global Quick Search Modal
  isQuickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;

  // Active Company Filter (mirrored in store for performance)
  activeCompanyId: CompanyId;
  setActiveCompanyId: (id: CompanyId) => void;
}

export const useAppStore = create<AppState>((set) => ({
  flowState: 'landing',
  activeTab: 'dashboard',
  activeTabTitle: 'الرئيسية والمؤشرات التشغيلية',
  setFlowState: (flowState) => set({ flowState }),
  setActiveTab: (activeTab, activeTabTitle) => set({ activeTab, activeTabTitle, flowState: 'workspace' }),

  notifications: [
    {
      id: 'n-1',
      title: 'وصول رحلة استقدام جديدة',
      message: 'وصلت العاملة KIMBERLY (الفلبين) إلى مطار الملك خالد الدولي بنجاح.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      link: 'travel',
    },
    {
      id: 'n-2',
      title: 'تنبيه SLA عقد إيجار',
      message: 'عقد التأجير #RENT-2026-0016 بحاجة إلى توقيع العميل قبل نهاية اليوم.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      link: 'rent-contracts',
    },
    {
      id: 'n-3',
      title: 'فاتورة ZATCA معتمدة',
      message: 'تمت مصادقة الفاتورة الضريبية المبسطة بنجاح مع منصة فاتورة (ZATCA Phase 2).',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      read: true,
      link: 'zatca',
    },
  ],
  unreadCount: 2,

  addNotification: (notification) =>
    set((state) => {
      const newNotif: AppNotification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      return {
        notifications: [newNotif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  isQuickSearchOpen: false,
  setQuickSearchOpen: (isQuickSearchOpen) => set({ isQuickSearchOpen }),

  activeCompanyId: 'all',
  setActiveCompanyId: (activeCompanyId) => set({ activeCompanyId }),
}));
