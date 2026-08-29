import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { CompanyId } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { 
  ArrowLeft, Network, TrendingUp, Bot, ShieldCheck, 
  Menu, X, Building2, ChevronDown, Sparkles, LogIn
} from 'lucide-react';

interface LandingPageProps {
  onSelectCompany: (companyId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCompany }) => {
  const { currentLanguage } = useLanguage();
  const { setActiveCompanyId } = useCompany();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSelect = (id: CompanyId | string) => {
    if (id !== 'login') {
      setActiveCompanyId(id as CompanyId);
    }
    setMobileMenuOpen(false);
    onSelectCompany(id);
  };

  const companies = [
    {
      id: 'SAF' as CompanyId,
      code: 'COMPANY 01 [SAF]',
      nameAr: 'شركة السفير الماسي',
      nameEn: 'Al-Sfeer Al-Masi Recruitment Co.',
      badge: 'الاستقدام والتشغيل الشامل',
      desc: 'بوابة متكاملة لإدارة عقود الاستقدام، التأشيرات، والموارد البشرية للعمالة المنزلية والمهنية.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      stats: '1,420 عقد نشط'
    },
    {
      id: 'YAQ' as CompanyId,
      code: 'COMPANY 02 [YAQ]',
      nameAr: 'شركة ياقوت نجد',
      nameEn: 'Yaqoot Najd Recruitment Co.',
      badge: 'إدارة الكوادر والمشاريع',
      desc: 'حلول تشغيلية متقدمة لقطاع الأعمال والتشغيل التعاقدي المرن للشركات والمؤسسات.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      stats: '890 عقد إيجار'
    },
    {
      id: 'TOP' as CompanyId,
      code: 'COMPANY 03 [TOP]',
      nameAr: 'شركة توباز للاستقدام',
      nameEn: 'Topaz Recruitment Co.',
      badge: 'الخدمات اللوجستية والإيواء',
      desc: 'إدارة متطورة لمراكز الإيواء، الرحلات الدولية، ونقل الخدمات وحلول التأشيرات السريعة.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      stats: '450 عامل بالإيواء'
    },
    {
      id: 'DAR' as CompanyId,
      code: 'COMPANY 04 [DAR]',
      nameAr: 'دار الرواد',
      nameEn: 'Dar Al-Ruwad Entity',
      badge: 'الوساطة والمكاتب الخارجية',
      desc: 'شبكة الشراكات العالمية مع مكاتب الاستقدام في أكثر من 14 دولة حول العالم.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      stats: '38 مكتب دولي'
    }
  ];

  return (
    <div
      className="bg-black text-white min-h-screen w-full overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-white"
      dir={currentLanguage.dir}
      style={{
        fontFamily: 'var(--font-family-ui)',
        fontFeatureSettings: '"ss03" 1',
      }}
    >
      {/* 1. Top Navigation Bar (Fully Responsive) */}
      <header className="sticky top-0 z-[100] backdrop-blur-md bg-black/85 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-9 h-9 rounded-full border border-white/30 p-0.5 bg-black object-cover"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white font-display">
              مجموعة خالد السليم
            </span>
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">
              COMMERCE & ENTERPRISE OS
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#companies" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
            الشركات التابعة
          </a>
          <a href="#capabilities" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
            القدرات التشغيلية
          </a>
          <a href="#governance" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
            الحوكمة والربط الحكومي
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="button-outline-on-dark text-xs px-4 py-2 rounded-full"
            onClick={() => handleSelect('all')}
          >
            دخول الإدارة المركزية
          </button>
          <button
            type="button"
            className="button-white-pill text-xs px-4 py-2 rounded-full font-bold"
            onClick={() => handleSelect('login')}
          >
            تسجيل الدخول
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-zinc-900 border border-white/15 text-white hover:bg-zinc-800 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[61px] z-50 bg-black/95 backdrop-blur-lg border-b border-white/10 p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn md:hidden">
          <div className="space-y-6">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              التنقل والأقسام
            </div>
            <div className="space-y-4">
              <a
                href="#companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-white hover:text-emerald-400 transition-colors py-1"
              >
                الشركات التابعة للمجموعة
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-white hover:text-emerald-400 transition-colors py-1"
              >
                القدرات والأنظمة التشغيلية
              </a>
              <a
                href="#governance"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-white hover:text-emerald-400 transition-colors py-1"
              >
                الحوكمة والربط الحكومي
              </a>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                الدخول السريع للشركات
              </div>
              <div className="grid grid-cols-2 gap-2">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className="p-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-right text-xs font-semibold hover:border-emerald-500 transition-all text-white"
                  >
                    {c.nameAr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
            <button
              type="button"
              className="w-full button-outline-on-dark py-3 text-sm rounded-full font-bold flex items-center justify-center gap-2"
              onClick={() => handleSelect('all')}
            >
              <Building2 className="w-4 h-4" />
              <span>دخول الإدارة المركزية</span>
            </button>
            <button
              type="button"
              className="w-full button-white-pill py-3 text-sm rounded-full font-bold flex items-center justify-center gap-2"
              onClick={() => handleSelect('login')}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول المباشر</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section: Cinematic Negative Space */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <span className="eyebrow-cap inline-block text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium tracking-widest">
              ENTERPRISE COMMERCE & HUMAN CAPITAL SYSTEM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight font-display">
            بوابة التشغيل الذكي للمجموعة
          </h1>

          <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
            منظومة سحابية متقدمة تدير 4 شركات رائدة باستقلالية كاملة وقواعد بيانات منفصلة مع مركز قيادة وتحكم موحد للأداء والمالية والربط الحكومي.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              className="w-full sm:w-auto button-outline-on-dark px-6 py-3 text-sm rounded-full font-bold"
              onClick={() => handleSelect('all')}
            >
              دخول الإدارة المركزية (Super Admin)
            </button>
            <button
              type="button"
              className="w-full sm:w-auto button-white-pill px-6 py-3 text-sm rounded-full font-bold"
              onClick={() => handleSelect('login')}
            >
              تسجيل الدخول المباشر
            </button>
          </div>
        </div>
      </section>

      {/* 3. Companies Grid: Full-Bleed Editorial Cards */}
      <section id="companies" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-2">
          <div>
            <span className="eyebrow-cap text-zinc-500 text-xs tracking-widest">COMPANIES & ENTITIES</span>
            <h2 className="text-2xl sm:text-4xl font-light text-white mt-1 font-display">
              الشركات التابعة للمجموعة
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-zinc-400">
            اختر الشركة للانتقال إلى مساحة العمل الخاصة بها
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {companies.map((comp) => (
            <div
              key={comp.id}
              onClick={() => handleSelect(comp.id)}
              className="card-feature-cinematic bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between hover:border-white/30 transition-all group"
            >
              {/* Image Frame Top */}
              <div className="h-44 sm:h-48 relative overflow-hidden">
                <img
                  src={comp.image}
                  alt={comp.nameAr}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] bg-black/80 border border-white/20 px-2.5 py-0.5 rounded-full text-white font-mono">
                    {comp.code}
                  </span>
                </div>
              </div>

              {/* Card Content Bottom */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CompanyLogo companyId={comp.id} size={40} />
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight font-display">
                        {comp.nameAr}
                      </h3>
                      <span className="text-[11px] text-zinc-400">{comp.nameEn}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {comp.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="pill-tag-mint text-[10px]">
                    {comp.stats}
                  </span>
                  <span className="text-xs text-white inline-flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors font-medium">
                    <span>دخول المنظومة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Enterprise Capabilities Section */}
      <section id="capabilities" className="border-t border-white/10 bg-zinc-950/60 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="eyebrow-cap text-emerald-400 text-xs tracking-widest">CAPABILITIES & INFRASTRUCTURE</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white mt-2 font-display">
              بنية تحتية موحدة بمقاييس عالمية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-feature-cinematic bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                الربط والامتثال الحكومي الشامل
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                تكامل مباشر مع منصة مساند، الفوترة الإلكترونية للمرحلة الثانية من هيئة الزكاة والضريبة والجمارك (ZATCA)، ومنصة مقيم ونظام التأمينات الاجتماعية.
              </p>
            </div>

            <div className="card-feature-cinematic bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                المحاسبة المتقدمة وقياس الأداء
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                نظام محاسبي شجري كامل مع مراكز التكلفة، موازين المراجعة، الحسابات الختامية، وتقارير تفاعلية فورية لأرباح وعوائد كل فرع وشركة.
              </p>
            </div>

            <div className="card-feature-cinematic bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                مساعد الذكاء الاصطناعي المؤسسي
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                مساعد آلي ذكي (Copilot) مدمج لتحليل البيانات، إنشاء العقود الفورية، تدقيق السجلات، وتقديم التوصيات التشغيلية لقيادة المجموعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-white/10 bg-black py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-white/30" />
              <span className="font-bold text-base text-white font-display">مجموعة خالد السليم</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              المنظومة الرقمية المركزية الرائدة لإدارة وتطوير قطاع الاستقدام والتشغيل في المملكة العربية السعودية.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">الشركات والمؤسسات</h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <button type="button" onClick={() => handleSelect('SAF')} className="block hover:text-white text-right">شركة السفير الماسي</button>
              <button type="button" onClick={() => handleSelect('YAQ')} className="block hover:text-white text-right">شركة ياقوت نجد</button>
              <button type="button" onClick={() => handleSelect('TOP')} className="block hover:text-white text-right">شركة توباز للاستقدام</button>
              <button type="button" onClick={() => handleSelect('DAR')} className="block hover:text-white text-right">دار الرواد</button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">الأنظمة والروابط</h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div>منصة مساند الحكومية</div>
              <div>هيئة الزكاة والضريبة (ZATCA)</div>
              <div>مركز القيادة الموحد (Command Center)</div>
              <div>بوابة المزامنة السحابية</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">الدعم والأمان</h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div>حماية البيانات والتشفير</div>
              <div>سجل النشاطات والأحداث</div>
              <div>الدعم الفني والتقني 24/7</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>
            © {new Date().getFullYear()} مجموعة خالد السليم للاستقدام والتشغيل. جميع الحقوق محفوظة ومحمية.
          </span>
          <div className="flex gap-2">
            <span className="pill-tag-mint text-[10px]">
              Shopifi Engine Active
            </span>
            <span className="pill-tag-shade text-[10px]">
              Version 3.4.2
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
