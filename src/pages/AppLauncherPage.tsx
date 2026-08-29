import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Users, FileText, Handshake, Hotel, IdCard, 
  TrendingUp, Sliders, Wallet, Search, ArrowLeft, 
  Layers, Sparkles, Building2, CheckCircle2, ShieldCheck, LayoutDashboard
} from 'lucide-react';

interface AppTile {
  id: string;
  titleKey: string;
  defaultTitle: string;
  subKey: string;
  defaultSubtitle: string;
  icon: React.FC<{ className?: string }>;
  href: string;
  isFeatured?: boolean;
  isPistachio?: boolean;
  category: string;
}

interface AppLauncherPageProps {
  onSelectApp: (href: string, title: string) => void;
}

const APPS: AppTile[] = [
  {
    id: 'crm',
    titleKey: 'crm',
    defaultTitle: 'إدارة العملاء (CRM)',
    subKey: 'crmSub',
    defaultSubtitle: 'تنظيم بيانات العملاء والمتابعات ومحادثات الواتساب والتسويق للمجموعة.',
    icon: Users,
    href: 'clients',
    isFeatured: true,
    category: 'التسويق والمبيعات'
  },
  {
    id: 'cvs',
    titleKey: 'cvs',
    defaultTitle: 'بنك السير الذاتية (CVs)',
    subKey: 'cvsSub',
    defaultSubtitle: 'فلترة وتصنيف الكوادر البشرية المتاحة وعروض الاستقدام والتشغيل المرن.',
    icon: FileText,
    href: 'cvs-recruitment',
    category: 'الكوادر والتشغيل'
  },
  {
    id: 'recruitment-contracts',
    titleKey: 'recruitment-contracts',
    defaultTitle: 'عقود الاستقدام والتشغيل',
    subKey: 'recruitmentContractsSub',
    defaultSubtitle: 'إدارة عقود العمالة وتتبع حالة التأشيرات والربط مع منصة مساند الحكومية.',
    icon: Handshake,
    href: 'recruitment-contracts',
    isPistachio: true,
    category: 'العمليات والعقود'
  },
  {
    id: 'shelter',
    titleKey: 'shelter',
    defaultTitle: 'مراكز الإيواء واللوجستيات',
    subKey: 'shelterSub',
    defaultSubtitle: 'متابعة السكن، التغذية، الفرز، وتتبع الرحلات الجوية ومواعيد الوصول والمغادرة.',
    icon: Hotel,
    href: 'shelter',
    category: 'الخدمات اللوجستية'
  },
  {
    id: 'hr',
    titleKey: 'hr',
    defaultTitle: 'الموارد البشرية والرواتب (HR & WPS)',
    subKey: 'hrSub',
    defaultSubtitle: 'ملفات الموظفين، الحضور، الإجازات، والمسيرات المتوافقة مع نظام حماية الأجور.',
    icon: IdCard,
    href: 'employees',
    isFeatured: true,
    category: 'الموارد البشرية'
  },
  {
    id: 'reports',
    titleKey: 'reports',
    defaultTitle: 'مركز التقارير والذكاء المالي',
    subKey: 'reportsSub',
    defaultSubtitle: 'إحصائيات الأداء الموحد، التحليلات البيانية، ومؤشرات KPI التشغيلية.',
    icon: TrendingUp,
    href: 'reports',
    category: 'التحليلات والمؤشرات'
  },
  {
    id: 'settings',
    titleKey: 'settings',
    defaultTitle: 'إعدادات المنظومة والصلاحيات',
    subKey: 'settingsSub',
    defaultSubtitle: 'حسابات المستخدمين، مصفوفة الصلاحيات الأمنية، والربط مع المنصات الحكومية.',
    icon: Sliders,
    href: 'settings',
    category: 'الحوكمة والأمان'
  },
  {
    id: 'finance',
    titleKey: 'finance',
    defaultTitle: 'المحاسبة العامة (General Ledger)',
    subKey: 'financeSub',
    defaultSubtitle: 'شجرة الحسابات، قيود اليومية، موازين المراجعة، ومطابقة الفوترة الإلكترونية ZATCA.',
    icon: Wallet,
    href: 'finance-home',
    isPistachio: true,
    category: 'المالية والمحاسبة'
  }
];

export const AppLauncherPage: React.FC<AppLauncherPageProps> = ({ onSelectApp }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredApps = APPS.filter(app => {
    const title = t(app.titleKey, app.defaultTitle);
    const subtitle = t(app.subKey, app.defaultSubtitle);
    return title.toLowerCase().includes(search.toLowerCase()) || subtitle.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen min-h-[100dvh] w-full bg-[#fbfbf5] text-zinc-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-3 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logo.png"
            alt="ALSALIM GROUP LOGO"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black p-0.5 bg-white object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-xs sm:text-base text-black font-display leading-tight truncate">
              مستكشف الأقسام والمنظومة
            </div>
            <div className="text-[10px] text-zinc-400 font-medium hidden sm:block">
              Enterprise Application Launcher • Multi-Entity Edition
            </div>
          </div>
        </div>

        {/* Search Bar & Action Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchAppPlaceholder', 'بحث...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-full pr-8 pl-3 py-1.5 text-xs text-black placeholder-zinc-400 outline-none w-28 sm:w-60 focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <button
            type="button"
            className="button-outline-on-light flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold min-h-[32px]"
            onClick={() => onSelectApp('dashboard', 'لوحة المؤشرات التشغيلية')}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">لوحة التحكم</span>
          </button>
        </div>
      </header>

      {/* Explorer Content Container */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-8 py-6 sm:py-10 flex-1 space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="pill-tag-mint text-[10px] sm:text-[11px]">
              SYSTEM MODULES & APPS
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-light text-black font-display m-0 leading-tight">
            الوحدات والأنظمة التشغيلية للأقسام
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium m-0">
            متاحة لكافة فروع وشركات المجموعة الأربعة
          </p>
        </div>

        {/* 8 Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredApps.map((app) => {
            const title = t(app.titleKey, app.defaultTitle);
            const subtitle = t(app.subKey, app.defaultSubtitle);
            const Icon = app.icon;

            let cardStyle = "bg-white border-zinc-200 hover:border-black text-black";
            if (app.isFeatured) {
              cardStyle = "bg-zinc-950 border-zinc-900 text-white hover:border-zinc-700";
            } else if (app.isPistachio) {
              cardStyle = "bg-emerald-50/50 border-emerald-200/80 text-black hover:border-emerald-500";
            }

            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.href, title)}
                className={`card-pricing rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer border shadow-xs hover:shadow-md transition-all group min-h-[220px] sm:min-h-[250px] ${cardStyle}`}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                        app.isFeatured 
                          ? 'bg-zinc-900 text-emerald-300 border border-zinc-800 group-hover:scale-105' 
                          : 'bg-zinc-100 text-black border border-zinc-200 group-hover:bg-black group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[9.5px] sm:text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full font-bold uppercase tracking-wider ${
                        app.isFeatured 
                          ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' 
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {app.category}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-base sm:text-lg font-bold font-display mb-1 leading-tight ${app.isFeatured ? 'text-white' : 'text-black'}`}>
                      {title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 ${app.isFeatured ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {subtitle}
                    </p>
                  </div>
                </div>

                <div className={`pt-3 sm:pt-4 border-t flex items-center justify-between text-xs font-bold ${app.isFeatured ? 'border-zinc-800 text-zinc-300' : 'border-zinc-100 text-zinc-700'}`}>
                  <span className="inline-flex items-center gap-1.5 group-hover:text-emerald-500 transition-colors">
                    <span>فتح القسم</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10.5px] opacity-60 font-medium">
                    مزامنة فورية
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4 sm:py-6 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          مجموعة خالد السليم للاستقدام والتشغيل • المنظومة السحابية الموحدة
        </span>
        <div className="flex gap-2">
          <span className="pill-tag-mint text-[10px]">4 شركات مرتبطة</span>
          <span className="pill-tag-shade text-[10px]">قواعد بيانات مستقلة</span>
        </div>
      </footer>
    </main>
  );
};

export default AppLauncherPage;
