import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useImpersonation } from '../../contexts/ImpersonationContext';
import { useIamSession } from '../../contexts/IamSessionContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppStore } from '../../stores/appStore';
import {
  authService,
  CORPORATE_DEPARTMENTS,
  COMPANY_AUTH_METADATA,
  resolveDepartmentAndCompany,
} from '../../services/authService';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { ProductionDataHubModal } from '../database/ProductionDataHubModal';
import { UniversalDocumentExtractorModal } from '../common/UniversalDocumentExtractorModal';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';
import {
  Menu,
  Grid,
  Search,
  Bell,
  Maximize,
  Minimize,
  MapPin,
  ChevronDown,
  Plus,
  ShieldCheck,
  LogOut,
  Check,
  X,
  Globe,
  Database,
  User,
  Lock,
  UploadCloud,
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
  const { currentUser: iamUser } = useIamSession();
  const { user: authUser } = useAuthContext();
  const { impersonatedState, stopImpersonation } = useImpersonation();
  const { unreadCount, setQuickSearchOpen, activeTab } = useAppStore();

  const resolvedTabTitle = useMemo(() => {
    if (activeTabTitle && !/^[a-z0-9-_]+$/i.test(activeTabTitle)) {
      return activeTabTitle;
    }
    const targetSlug = activeTabTitle || activeTab || 'dashboard';
    const SLUG_ARABIC_TITLES: Record<string, string> = {
      dashboard: 'الرئيسية (لوحة المؤشرات التنفيذية)',
      recruitment: 'إدارة عقود الاستقدام الموحدة',
      rent: 'إدارة عقود التأجير والتشغيل',
      'iam-security': 'إدارة الهوية والصلاحيات والأمان (IAM)',
      'employee-pulse': 'منظومة متابعة النقرات والمشاعر والمراقبة الذكية',
      branches: 'دليل الهيكلية والأقسام التخصصية للشركات والفروع',
      finance: 'الإدارة المالية والمحاسبة العامة (SMACC)',
      complaints: 'مركز علاقات العملاء والشكاوى (CRM)',
      travel: 'إدارة حركة السفر والرحلات والمطارات',
    };
    const findTitle = (items: typeof SIDEBAR_MENU): string | null => {
      for (const item of items) {
        if (item.href === targetSlug || item.id === targetSlug) return item.title;
        if (item.children) {
          const found = findTitle(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return (
      findTitle(SIDEBAR_MENU) ||
      SLUG_ARABIC_TITLES[targetSlug] ||
      activeTabTitle ||
      'لوحة المؤشرات التنفيذية'
    );
  }, [activeTabTitle, activeTab]);

  const effectiveProfile = authUser || authService.getCurrentUser();
  const resolvedScope = useMemo(() => {
    if (!effectiveProfile) {
      return resolveDepartmentAndCompany('accounting@saf-rec.sa');
    }
    return resolveDepartmentAndCompany(
      effectiveProfile.email,
      effectiveProfile.role,
      effectiveProfile.company_id,
      effectiveProfile.department_id
    );
  }, [effectiveProfile]);

  const companyMeta = useMemo(() => {
    const key = resolvedScope.companyId === 'all' ? 'ALL' : resolvedScope.companyId.toUpperCase();
    return COMPANY_AUTH_METADATA[key] || COMPANY_AUTH_METADATA.SAF;
  }, [resolvedScope.companyId]);

  const departmentDef = CORPORATE_DEPARTMENTS[resolvedScope.departmentId];

  const [selectedBranch, setSelectedBranch] = useState<string>(
    effectiveProfile?.branch || 'الفرع الرئيسي - الرياض'
  );
  const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showDataHubModal, setShowDataHubModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showUniversalExtractor, setShowUniversalExtractor] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [langSearch, setLangSearch] = useState<string>('');

  useEffect(() => {
    if (effectiveProfile?.branch) {
      setSelectedBranch(effectiveProfile.branch);
    }
  }, [effectiveProfile?.branch]);

  useEffect(() => {
    const handleToggleMobileNotifs = () => {
      setShowNotifDropdown((prev) => !prev);
      setShowUserDropdown(false);
      setShowLangDropdown(false);
    };
    const handleOpenDocExtractor = () => {
      setShowUniversalExtractor(true);
    };
    window.addEventListener('toggle-mobile-notifications', handleToggleMobileNotifs);
    window.addEventListener('open-document-extractor', handleOpenDocExtractor);
    return () => {
      window.removeEventListener('toggle-mobile-notifications', handleToggleMobileNotifs);
      window.removeEventListener('open-document-extractor', handleOpenDocExtractor);
    };
  }, []);

  const navigateGuarded = (tab: string, title: string) => {
    window.dispatchEvent(
      new CustomEvent('alsulaim_navigate', {
        detail: { tab, title },
      })
    );
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
    { id: 'main', name: 'الفرع الرئيسي - الرياض', city: 'الرياض - طريق الملك فهد' },
    { id: 'riyadh_takhassusi', name: 'فرع الرياض (التخصصي)', city: 'الرياض' },
    { id: 'jeddah', name: 'فرع جدة', city: 'طريق المدينة المنورة' },
    { id: 'dammam', name: 'فرع الدمام', city: 'شارع الملك سعود' },
    { id: 'khamis', name: 'فرع خميس مشيط', city: 'طريق الملك فهد' },
  ];

  // Department-Aware Quick Action Pills
  const departmentQuickActions = useMemo(() => {
    switch (resolvedScope.departmentId) {
      case 'finance':
        return [
          { tab: 'smacc-accounting', title: 'مركز محاسبة سماك (SMACC)', primary: true },
          { tab: 'journals', title: 'قيود اليومية' },
          { tab: 'receipt-vouchers', title: 'سندات القبض' },
          { tab: 'payment-vouchers', title: 'سندات الصرف' },
          { tab: 'zatca', title: 'الفوترة ZATCA' },
        ];
      case 'recruitment':
        return [
          { tab: 'create-contract', title: 'إضافة عقد مساند', primary: true },
          { tab: 'current-contracts', title: 'العقود السارية' },
          { tab: 'orders', title: 'طلبات الحجز' },
          { tab: 'ingaz', title: 'تفاويض إنجاز' },
        ];
      case 'rental':
        return [
          { tab: 'create-rent', title: 'إضافة عقد تأجير', primary: true },
          { tab: 'rent-contracts', title: 'عقود التأجير' },
          { tab: 'rent-packages', title: 'باقات التأجير' },
        ];
      case 'ats':
        return [
          { tab: 'create-cv', title: 'إضافة سيرة ذاتية', primary: true },
          { tab: 'cvs-recruitment', title: 'بنك السير الذاتية' },
          { tab: 'offices', title: 'الوكلاء الخارجيون' },
        ];
      case 'hr':
        return [
          { tab: 'employees', title: 'سجل الموظفين', primary: true },
          { tab: 'payrolls', title: 'مسير الرواتب WPS' },
          { tab: 'attendances', title: 'الحضور والانصراف' },
          { tab: 'end-of-service', title: 'نهاية الخدمة' },
        ];
      case 'crm':
        return [
          { tab: 'new-client', title: 'إضافة عميل جديد', primary: true },
          { tab: 'clients', title: 'سجل العملاء' },
          { tab: 'complaints', title: 'الشكاوى والتذاكر' },
        ];
      case 'shelter':
        return [
          { tab: 'create-shelter', title: 'تسكين جديد بالإيواء', primary: true },
          { tab: 'shelter-suite', title: 'لوحة مركز الإيواء' },
          { tab: 'room-management', title: 'الغرف والأسرة' },
        ];
      case 'tenders':
        return [
          { tab: 'kas-suite', title: 'منظومة منافسات كاس', primary: true },
          { tab: 'tenders-boq', title: 'جداول الكميات BOQ' },
          { tab: 'kas-etmad', title: 'منافسات اعتماد' },
        ];
      default:
        return [
          { tab: 'dashboard', title: 'لوحة المؤشرات التنفيذية', primary: true },
          { tab: 'smacc-accounting', title: 'محاسبة سماك SMACC' },
          { tab: 'recruitment-contracts', title: 'عقود مساند' },
          { tab: 'reports', title: 'التقارير الموحدة' },
        ];
    }
  }, [resolvedScope.departmentId]);

  const filteredLanguages = availableLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const displayName = effectiveProfile?.full_name || iamUser?.fullName || 'خالد السليم';
  const displayEmail = effectiveProfile?.email || iamUser?.email || 'chairman@alsulaim.sa';

  return (
    <>
      {impersonatedState.isImpersonating && (
        <div className="bg-rose-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-[1100]">
          <div className="flex items-center gap-2">
            <span>
              وضع المعاينة والتدقيق الكلي: أنت تتصفح بصلاحيات (
              <strong>{impersonatedState.employeeName}</strong>)
            </span>
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

      <header className="nav-bar-light h-16 bg-white border-b border-zinc-200 px-2.5 sm:px-4 lg:px-5 flex items-center justify-between sticky top-0 z-[90] shadow-xs flex-nowrap gap-2">
        {/* Right Section: Sidebar Toggle, Department App Launcher, Page Title, Branch */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink flex-nowrap">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-black hover:bg-black text-black hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            onClick={onToggleSidebar}
            title="القائمة الجانبية"
            aria-label="القائمة الجانبية"
          >
            <Menu className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            className="button-outline-on-light hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs min-h-[34px] shrink-0 whitespace-nowrap cursor-pointer"
            onClick={onOpenAppLauncher}
            title={t('appLauncherTitle', 'شاشات القسم المصرح بها')}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span>شاشات القسم</span>
          </button>

          <div className="header-title-box min-w-0 shrink">
            <h1 className="text-xs sm:text-sm font-bold text-black m-0 truncate max-w-[110px] sm:max-w-[155px] xl:max-w-[195px] whitespace-nowrap">
              {resolvedTabTitle}
            </h1>
          </div>

          {/* Active Branch Switcher */}
          <div className="relative hidden xl:block shrink-0">
            <button
              type="button"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="pill-tag-mint cursor-pointer flex items-center gap-1 text-[11px] font-medium whitespace-nowrap shrink-0 px-2.5 py-1"
            >
              <MapPin className="w-3 h-3 text-black shrink-0" />
              <span className="truncate max-w-[120px]">{selectedBranch}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
            </button>

            {showBranchDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-zinc-200 rounded-2xl shadow-xl w-56 z-[250] p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10.5px] font-bold text-zinc-400 border-b border-zinc-100">
                  الفرع التشغيلي:
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
                        ? 'bg-[#f5eddc] text-[#a98232] font-bold border border-[#cfa64a]/30'
                        : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span>{b.name}</span>
                    {selectedBranch === b.name && <Check className="w-3.5 h-3.5 text-[#a98232]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Department-Scoped Quick Action Pills (only on ultra-wide >= 1920px so header never overflows on 1280px-1536px) */}
        <div className="hidden min-[1920px]:flex items-center gap-1.5 flex-nowrap shrink-0">
          {departmentQuickActions.map((act) =>
            act.primary ? (
              <button
                key={act.tab}
                type="button"
                className="button-primary-pill flex items-center gap-1 px-3 py-1 text-xs min-h-[30px] whitespace-nowrap shrink-0 cursor-pointer"
                onClick={() => navigateGuarded(act.tab, act.title)}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>{act.title}</span>
              </button>
            ) : (
              <button
                key={act.tab}
                type="button"
                onClick={() => navigateGuarded(act.tab, act.title)}
                className="pill-tag-shade cursor-pointer border border-zinc-200 whitespace-nowrap shrink-0"
              >
                {act.title}
              </button>
            )
          )}
        </div>

        {/* Left Section: Universal Document Extractor, Locked Department Badge, Language, Search, Notifications, User Profile & Logout */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {resolvedScope.departmentId === 'executive' && (
            <button
              type="button"
              onClick={() => setShowDataHubModal(true)}
              className="hidden xl:inline-flex pill-tag-mint cursor-pointer whitespace-nowrap shrink-0 items-center gap-1 px-2.5 py-1"
              title="حالة الاتصال بقاعدة البيانات السحابية"
            >
              <Database className="w-3 h-3 text-black shrink-0" />
              <span className="font-bold text-[10.5px]">قاعدة البيانات</span>
            </button>
          )}

          {/* Universal Document & 100-Invoice Auto-Extractor Button */}
          <button
            type="button"
            onClick={() => setShowUniversalExtractor(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black hover:bg-zinc-900 text-[#CFA64A] border border-[#CFA64A]/50 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs min-h-[34px]"
            title="رفع واستخلاص آلي لأي مستند (100 صورة فاتورة / PDF / Word / Excel / نظام محاسبي منفصل) وتوجيهه للقسم المعني"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#CFA64A] shrink-0" />
            <span className="hidden md:inline text-[11px]">رفع واستخلاص مستندات</span>
            <span className="md:hidden text-[11px]">رفع مستندات</span>
          </button>

          {/* Faris & Noura Institutional Advisor Quick Trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-faris-assistant'));
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5EDDC] hover:bg-[#CFA64A] text-black border border-[#CFA64A] rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs min-h-[34px]"
            title="استدعاء المستشار المؤسسي الصوتي والنصي (فارس / نُورة)"
          >
            <img
              src="/mascot.png"
              alt="فارس ونُورة"
              className="w-4 h-4 rounded-full object-contain bg-white border border-[#CFA64A] shrink-0"
            />
            <span className="hidden lg:inline text-[11px]">فارس ونُورة</span>
          </button>

          {/* Institutional Department & Company Scope Pill */}
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#f5eddc] hover:bg-[#efe2c6] text-black border border-[#cfa64a]/50 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px]"
            title="عرض بطاقة الهوية الوظيفية والقسم المصرح به"
          >
            <span>{departmentDef.emoji}</span>
            <span className="text-[10.5px] font-extrabold truncate max-w-[115px]">{departmentDef.badgeText}</span>
            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-black text-white font-mono">
              {companyMeta.code === 'all' ? 'GROUP' : companyMeta.code}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowUserDropdown(false);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-full hover:bg-zinc-100 transition-colors text-xs font-semibold text-zinc-800 h-[34px] cursor-pointer"
              title="تغيير لغة المنظومة"
            >
              <span className="text-sm leading-none">{currentLanguage.flag}</span>
              <span className="hidden lg:inline text-[11px]">{currentLanguage.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
            </button>

            {showLangDropdown && (
              <div className="fixed inset-x-3 top-[calc(var(--header-height,64px)+8px)] sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:left-0 bg-white border border-zinc-200 rounded-2xl shadow-2xl sm:w-64 max-w-[calc(100vw-24px)] z-[350] p-2.5 space-y-2 font-sans text-right">
                <div className="px-2 pt-1 pb-2 border-b border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-black flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-black" />
                    <span>لغات النظام الرسمية</span>
                  </span>
                  <button
                    type="button"
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
                    onChange={(e) => setLangSearch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pr-7 pl-3 py-1.5 text-xs text-black focus:border-black outline-none"
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
                            ? 'bg-[#f5eddc] text-black font-bold'
                            : 'hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div>
                            <div className="font-semibold leading-tight">{lang.nativeName}</div>
                            <div className="text-[10px] text-zinc-400 leading-none">
                              {lang.name} ({lang.code.toUpperCase()})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black hover:bg-zinc-50 transition-colors shrink-0 cursor-pointer"
            onClick={() => setQuickSearchOpen(true)}
            title="البحث السريع (Ctrl + K)"
            aria-label="البحث السريع"
          >
            <Search className="w-4 h-4 text-zinc-700" />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            className="hidden sm:flex w-9 h-9 rounded-full bg-white border border-zinc-200 items-center justify-center text-black hover:bg-zinc-50 transition-colors shrink-0 cursor-pointer"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
            aria-label="ملء الشاشة"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-zinc-700" />
            ) : (
              <Maximize className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black hover:bg-zinc-50 transition-colors relative shrink-0 cursor-pointer"
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowUserDropdown(false);
                setShowLangDropdown(false);
              }}
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
            <NotificationDropdown
              isOpen={showNotifDropdown}
              onClose={() => setShowNotifDropdown(false)}
              onNavigate={(href, title) => navigateGuarded(href, title)}
            />
          </div>

          {/* User Profile & Logout Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifDropdown(false);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full p-1 pl-2 sm:pl-3 hover:bg-zinc-50 transition-colors shrink-0 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-black text-[#e4c77b] border border-[#cfa64a]/50 flex items-center justify-center text-xs font-black shadow-xs">
                {displayName.slice(0, 1)}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-[11px] font-bold text-black leading-tight truncate max-w-[110px]">
                  {displayName}
                </div>
                <div className="text-[9.5px] text-[#a98232] font-bold truncate max-w-[110px]">
                  {departmentDef.badgeText}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showUserDropdown && (
              <div className="fixed inset-x-3 top-[calc(var(--header-height,64px)+8px)] sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:left-0 bg-white border border-zinc-200 rounded-2xl shadow-2xl sm:w-72 max-w-[calc(100vw-24px)] z-[350] p-3 space-y-1.5">
                <div className="p-3 bg-[#fbfbf5] rounded-xl border border-zinc-200 mb-1 space-y-1">
                  <div className="font-black text-xs text-black">{displayName}</div>
                  <div className="text-[10.5px] text-zinc-500 font-mono">{displayEmail}</div>
                  <div className="pt-1 flex flex-wrap items-center gap-1">
                    <span className="px-2 py-0.5 bg-black text-white text-[9.5px] font-bold rounded-full">
                      {companyMeta.emoji} {companyMeta.nameAr}
                    </span>
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#a98232] border border-[#cfa64a]/40 text-[9.5px] font-bold rounded-full">
                      {departmentDef.emoji} {departmentDef.nameAr}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-zinc-800 font-bold flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#a98232]" />
                  <span>بطاقة الموظف وصلاحيات القسم</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAppLauncher();
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-zinc-700 flex items-center gap-2 cursor-pointer"
                >
                  <Grid className="w-3.5 h-3.5 text-zinc-500" />
                  <span>مستكشف شاشات القسم</span>
                </button>

                {resolvedScope.departmentId === 'executive' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigateGuarded('users', 'إدارة الهوية وصلاحيات الأقسام (IAM)');
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-[#f5eddc] text-[#a98232] font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#a98232]" />
                    <span>إدارة الهوية وصلاحيات الأقسام (IAM)</span>
                  </button>
                )}

                <div className="border-t border-zinc-200 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-right px-3 py-2.5 rounded-xl text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center gap-2 font-black cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل الخروج والعودة لبوابة الدخول</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProductionDataHubModal
        isOpen={showDataHubModal}
        onClose={() => setShowDataHubModal(false)}
      />

      {/* Employee Profile & Locked Department Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{departmentDef.emoji}</span>
                <h3 className="text-sm font-black text-black">بطاقة الهوية الوظيفية ونطاق القسم</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-zinc-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbfbf5] border border-zinc-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">اسم الموظف:</span>
                <span className="font-black text-black">{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">البريد الوظيفي:</span>
                <span className="font-mono font-bold text-black">{displayEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">الشركة التابع لها:</span>
                <span className="font-bold text-black">
                  {companyMeta.emoji} {companyMeta.nameAr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">القسم الوظيفي المختص:</span>
                <span className="font-black text-[#a98232]">
                  {departmentDef.emoji} {departmentDef.nameAr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">الفرع التشغيلي:</span>
                <span className="font-bold text-black">{selectedBranch}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f5eddc]/70 border border-[#cfa64a]/40 text-[11px] text-zinc-800 flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#a98232] shrink-0 mt-0.5" />
              <span>
                <strong>عزل الصلاحيات النشط:</strong> حسابك مقيد للعمل داخل ({departmentDef.nameAr}) في ({companyMeta.nameAr}) فقط وفق سياسة الحوكمة المؤسسية.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="button-primary-pill flex-1 py-2.5 text-xs font-bold"
              >
                العودة لبيئة العمل
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <UniversalDocumentExtractorModal
        isOpen={showUniversalExtractor}
        onClose={() => setShowUniversalExtractor(false)}
        defaultEntityKey="auto"
        onImportSuccess={() => {
          window.dispatchEvent(new CustomEvent('erp-data-updated'));
        }}
      />
    </>
  );
};
