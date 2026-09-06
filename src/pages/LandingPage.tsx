import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { CompanyId } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { 
  ArrowLeft, Network, TrendingUp, Bot, ShieldCheck, 
  Menu, X, Building2, ChevronDown, Sparkles, LogIn, CheckCircle2,
  Lock, Globe, Hotel, Briefcase, Users, MessageSquare, Volume2, VolumeX
} from 'lucide-react';
import { playPersonaIntroGreeting, stopAllAudio } from '../services/audioVoiceService';

interface LandingPageProps {
  onSelectCompany: (companyId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCompany }) => {
  const { currentLanguage } = useLanguage();
  const { setActiveCompanyId } = useCompany();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [persona, setPersona] = useState<'faris' | 'noura'>(() => {
    return (localStorage.getItem('assistant_persona') as 'faris' | 'noura') || 'faris';
  });
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    const handlePersonaChange = (event: any) => {
      if (event.detail?.persona && (event.detail.persona === 'faris' || event.detail.persona === 'noura')) {
        setPersona(event.detail.persona);
      }
    };
    window.addEventListener('assistant-persona-changed', handlePersonaChange);
    return () => {
      window.removeEventListener('assistant-persona-changed', handlePersonaChange);
      stopAllAudio();
    };
  }, []);

  const playVoice = (p: 'faris' | 'noura') => {
    setIsPlayingVoice(true);
    playPersonaIntroGreeting(p, {
      onStart: () => setIsPlayingVoice(true),
      onEnd: () => setIsPlayingVoice(false),
    });
  };

  const toggleLandingVoice = () => {
    if (isPlayingVoice) {
      stopAllAudio();
      setIsPlayingVoice(false);
    } else {
      playVoice(persona);
    }
  };

  const switchPersona = (newPersona: 'faris' | 'noura') => {
    setPersona(newPersona);
    localStorage.setItem('assistant_persona', newPersona);
    window.dispatchEvent(new CustomEvent('assistant-persona-changed', { detail: { persona: newPersona } }));
    stopAllAudio();
    playVoice(newPersona);
  };

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
      nameAr: 'شركة الصفا الماسي للاستقدام',
      nameEn: 'Al-Safa Al-Masi Recruitment Co.',
      badge: 'عقود الاستقدام مساند',
      desc: 'بوابة متكاملة لإدارة عقود استقدام الأفراد، إصدار التأشيرات الفورية، التوثيق عبر مساند، وبوالص التأمين الشاملة.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      stats: '1,420+ عقد نشط',
      themeColor: '#0284c7',
      license: 'ترخيص مساند RC01 • س.ت 1010123456'
    },
    {
      id: 'YAQ' as CompanyId,
      code: 'COMPANY 02 [YAQ]',
      nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
      nameEn: 'Yaqoot Eastern Operation & Rental Co.',
      badge: 'التأجير والتشغيل المرن',
      desc: 'حلول تشغيلية مرنة لقطاع الأعمال وباقات تأجير الكوادر المهنية والعمالة المنزلية المعتمدة.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      stats: '890+ عقد إيجار',
      themeColor: '#e11d48',
      license: 'ترخيص مساند RC02 • س.ت 1010543210'
    },
    {
      id: 'TOP' as CompanyId,
      code: 'COMPANY 03 [TOP]',
      nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
      nameEn: 'Top Talent ATS & Recruitment Co.',
      badge: 'التوظيف الذكي و ATS',
      desc: 'منظومة الفرز والتوظيف الذكي ATS، استيراد السير بالدفعة، وشبكة مكاتب التوظيف في 14 دولة.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      stats: '3,250+ سيرة ذاتية',
      themeColor: '#7c3aed',
      license: 'ترخيص مساند RC03 • س.ت 1010776543'
    },
    {
      id: 'KAS' as CompanyId,
      code: 'COMPANY 04 [KAS]',
      nameAr: 'شركة كاس للمنافسات والتشغيل',
      nameEn: 'KAS Trading & Etmad Suite',
      badge: 'منافسات اعتماد وجداول BOQ',
      desc: 'بوابة مستقلة ومعزولة كلياً لإدارة منافسات اعتماد، جداول الكميات الذكية BOQ، الفوترة المشفرة ZATCA، وسجل الموردين.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      stats: '2,650+ منافسة اعتماد',
      themeColor: '#d97706',
      license: 'سجل تجاري 1010789234 • ضريبي 3102847592'
    },
    {
      id: 'SAF' as CompanyId, // Directs to shelter portal
      code: 'FACILITY 05 [SHELTER]',
      nameAr: 'مراكز الإيواء والتسكين والرعاية',
      nameEn: 'Shelter, Housing & Care Suite',
      badge: 'ترخيص مراكز الإيواء HRSD',
      desc: 'بوابة إدارة غرف وأسرة الإيواء والضيافة، المتابعة الصحية والغذائية، وإجراءات الترحيل الممتثلة لمعايير وزارة الموارد البشرية.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      stats: '120 سرير • امتثال 100%',
      themeColor: '#0d9488',
      license: 'ترخيص مراكز الإيواء HRSD-MOL'
    }
  ];

  return (
    <div
      className="bg-[#ffffff] text-zinc-900 min-h-screen w-full overflow-x-hidden font-sans selection:bg-champagne selection:text-black"
      dir={currentLanguage.dir}
      style={{
        fontFamily: 'var(--font-family-ui)',
        fontFeatureSettings: '"ss03" 1',
        background: 'radial-gradient(ellipse at 50% -10%, #fbfbf5 0%, #ffffff 50%, #f4f6f9 100%)'
      }}
    >
      {/* 1. Top Navigation Bar - Luxury White Frosted Glass */}
      <header className="sticky top-0 z-[100] backdrop-blur-md bg-white/90 border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs transition-all">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-champagne/60 p-0.5 bg-white shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-950 font-display">
              مجموعة خالد السليم
            </span>
            <span className="text-[10.5px] text-zinc-500 tracking-wider uppercase font-semibold">
              KHALID AL-SULAIM GROUP • ERP
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-zinc-700">
          <a href="#companies" className="hover:text-black transition-colors">
            الشركات التابعة
          </a>
          <a href="#capabilities" className="hover:text-black transition-colors">
            القدرات التشغيلية
          </a>
          <a href="#values" className="hover:text-black transition-colors">
            القيم المؤسسية
          </a>
          <a href="#governance" className="hover:text-black transition-colors">
            الحوكمة والربط الحكومي
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="button-outline-on-light text-xs px-4 py-2 rounded-full font-bold flex items-center gap-1.5"
            onClick={() => handleSelect('all')}
          >
            <Building2 className="w-3.5 h-3.5 text-zinc-700" />
            <span>دخول الإدارة المركزية</span>
          </button>
          <button
            type="button"
            className="button-primary-pill text-xs px-5 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-sm"
            onClick={() => handleSelect('login')}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول الموحد</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 hover:bg-zinc-200 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[61px] z-50 bg-white/95 backdrop-blur-lg border-b border-zinc-200 p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn md:hidden">
          <div className="space-y-6">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              التنقل والأقسام الرئيسية
            </div>
            <div className="space-y-4">
              <a
                href="#companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-zinc-900 hover:text-champagne-dark transition-colors py-1"
              >
                الشركات التابعة للمجموعة
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-zinc-900 hover:text-champagne-dark transition-colors py-1"
              >
                القدرات والأنظمة التشغيلية
              </a>
              <a
                href="#values"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-zinc-900 hover:text-champagne-dark transition-colors py-1"
              >
                القيم المؤسسية والحوكمة
              </a>
            </div>

            <div className="pt-4 border-t border-zinc-200 space-y-3">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                الدخول السريع للشركات
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {companies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.id)}
                    className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-right text-xs font-semibold hover:border-champagne hover:bg-white transition-all text-zinc-900 flex items-center justify-between"
                  >
                    <span>{c.nameAr}</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 space-y-3 mt-6">
            <button
              type="button"
              className="w-full button-outline-on-light py-3 text-sm rounded-full font-bold flex items-center justify-center gap-2"
              onClick={() => handleSelect('all')}
            >
              <Building2 className="w-4 h-4 text-zinc-700" />
              <span>دخول الإدارة المركزية</span>
            </button>
            <button
              type="button"
              className="w-full button-primary-pill py-3 text-sm rounded-full font-bold flex items-center justify-center gap-2 shadow-sm"
              onClick={() => handleSelect('login')}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول المباشر</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Executive Hero Section - Luxury White Theme with 3D Saudi Assistant */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Right Column: Corporate Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Eyebrow badge from corporate flag */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-pale border border-champagne/40 text-champagne-dark text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-champagne-dark" />
                <span>منظومة أعمال متكاملة • KHALID AL-SULAIM GROUP</span>
              </span>
            </div>

            {/* Official Flag Slogan */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.2] font-display">
              نستثمر في الفرص.. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-zinc-950 via-zinc-800 to-champagne-dark">
                نصنع المستقبل.
              </span>
            </h1>

            {/* Strategic Value Proposition */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed max-w-2xl font-normal">
              بوابة التشغيل الذكي والحوكمة الرقمية لمجموعة خالد السليم: تنوع في القطاعات، قوة في التنفيذ، واستدامة في النمو. منظومة سحابية متقدمة تدير شركات المجموعة والمراكز المستقلة ببيئات عمل معزولة ومركز قيادة موحد للأداء والمالية والربط الحكومي.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <button
                type="button"
                className="w-full sm:w-auto button-primary-pill px-7 py-3.5 text-sm rounded-full font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
                onClick={() => handleSelect('login')}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول الموحد للمنظومة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="w-full sm:w-auto button-outline-on-light px-6 py-3.5 text-sm rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all"
                onClick={() => handleSelect('all')}
              >
                <Building2 className="w-4 h-4 text-zinc-700" />
                <span>دخول الإدارة المركزية (Super Admin)</span>
              </button>
            </div>

            {/* Compliance & Vision 2030 Badges */}
            <div className="pt-4 flex items-center gap-4 text-xs text-zinc-500 font-medium flex-wrap">
              <span className="flex items-center gap-1.5 text-zinc-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>الفوترة المشفرة ZATCA المرحلة الثانية</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>منصة مساند ووزارة الموارد البشرية HRSD</span>
              </span>
              <span>•</span>
              <span className="font-bold text-zinc-900">رؤية المملكة 2030</span>
            </div>
          </div>

          {/* Left Column: 3D Saudi Assistant Mascot (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Subtle Ambient Golden Glow Behind Mascot */}
            <div 
              className="absolute w-72 h-72 rounded-full pointer-events-none opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(207, 166, 74, 0.22) 0%, rgba(207, 166, 74, 0.05) 55%, transparent 75%)'
              }}
            />

            {/* Speech Bubble / Welcoming Card - Clickable to open Assistant Chat */}
            <div 
              className="speech-bubble-anim relative z-30 max-w-[340px] mb-2 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200 shadow-xl text-right cursor-pointer hover:border-amber-400 transition-all group"
              style={{
                boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)'
              }}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-faris-assistant', {
                  detail: { 
                    persona,
                    query: persona === 'noura'
                      ? 'مرحباً نُورة، حدثيني عن خدمات الأقسام النسائية ومراكز الإيواء ومنظومة مجموعة السليم'
                      : 'مرحباً فارس، عرفني على خدمات وشركات مجموعة خالد السليم' 
                  }
                }));
              }}
              title={persona === 'noura' ? 'انقر لبدء محادثة مباشرة مع نُورة' : 'انقر لبدء محادثة مباشرة مع فارس'}
            >
              {/* Pointer Triangle */}
              <div 
                className="absolute -bottom-2 right-12 w-3.5 h-3.5 bg-white border-b border-l border-zinc-200 rotate-[-45deg]"
              />

              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="live-pulse-dot" />
                  <span className="text-[11.5px] font-extrabold text-zinc-900 whitespace-nowrap">
                    {persona === 'noura' ? 'نُورة • المرشدة الرقمية' : 'فارس • المرشد الرقمي'}
                  </span>
                </div>

                {/* Persona Switcher Pill [ 👨 فارس | 👩 نُورة ] */}
                <div 
                  className="inline-flex items-center bg-zinc-100 rounded-full p-0.5 border border-zinc-200 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchPersona('faris');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                      persona === 'faris'
                        ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/80'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    👨 فارس
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchPersona('noura');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                      persona === 'noura'
                        ? 'bg-white text-amber-700 shadow-xs border border-champagne/40'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    👩 نُورة
                  </button>
                </div>
              </div>

              <h4 className="text-[13px] font-bold text-zinc-900 mb-1">
                أهلاً بكم في مجموعة خالد السليم!
              </h4>
              <p className="text-[11px] text-zinc-600 leading-relaxed m-0">
                {persona === 'noura' ? (
                  <>أنا <strong className="text-zinc-950">نُورة</strong>، مرشدتكم الرقمية الذكية. يسعدني مرافقتكم وتوجيهكم للأقسام النسائية ومراكز الإيواء والتسكين وكافة أنظمة شركات المجموعة.</>
                ) : (
                  <>أنا <strong className="text-zinc-950">فارس</strong>، مرشدكم الرقمي الذكي. يسعدني مرافقتكم وتوجيهكم للدخول إلى أنظمة شركات المجموعة أو الإجابة عن أي استفسار.</>
                )}
              </p>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-amber-700 group-hover:text-amber-600 flex items-center gap-1.5 transition-colors whitespace-nowrap">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{persona === 'noura' ? 'تحدث مع نُورة الآن' : 'تحدث مع فارس الآن'}</span>
                  <span>←</span>
                </span>

                {/* Direct audio button on Landing Page */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLandingVoice();
                  }}
                  title={isPlayingVoice ? 'إيقاف الصوت' : `استمع لصوت ${persona === 'noura' ? 'نُورة' : 'فارس'}`}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isPlayingVoice
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                      : 'bg-zinc-100 hover:bg-amber-50 text-zinc-700 hover:text-amber-900 border-zinc-200'
                  }`}
                >
                  {isPlayingVoice ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-600" />}
                  <span>{isPlayingVoice ? 'إيقاف' : (persona === 'noura' ? 'استمع لنُورة' : 'استمع لفارس')}</span>
                </button>
              </div>
            </div>

            {/* 3D Mascot Character with Float Animation & Ground Shadow */}
            <div 
              className="relative z-20 flex flex-col items-center cursor-pointer group"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-faris-assistant', {
                  detail: { 
                    persona,
                    query: persona === 'noura'
                      ? 'مرحباً نُورة، كيف يمكنني بدء استخدام المنظومة والوصول للأقسام النسائية ومراكز الإيواء؟'
                      : 'مرحباً فارس، كيف يمكنني بدء استخدام المنظومة؟' 
                  }
                }));
              }}
              title={persona === 'noura' ? 'انقر للتحدث مع نُورة' : 'انقر للتحدث مع فارس'}
            >
              <div className="mascot-float transition-transform group-hover:scale-105">
                <img
                  src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                  alt={persona === 'noura' ? 'نُورة - المرشدة الرقمية الذكية لمجموعة خالد السليم' : 'فارس - المرشد الرقمي الذكي لمجموعة خالد السليم'}
                  className="w-auto h-[380px] sm:h-[440px] lg:h-[470px] object-contain drop-shadow-2xl"
                  loading="eager"
                />
              </div>

              {/* Ambient Ground Shadow */}
              <div 
                className="mascot-shadow w-48 h-4 rounded-full -mt-3"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.06) 55%, transparent 75%)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Official Corporate Values & Trust Banner (From Flag Brand Identity) */}
      <section id="values" className="w-full bg-gradient-to-r from-zinc-50 via-champagne-pale/35 to-zinc-50 border-y border-zinc-200/80 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-zinc-700">
          <div className="flex items-center gap-2 text-champagne-dark font-extrabold tracking-wider">
            <span>KSHG</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-900">مجموعة خالد السليم القابضة</span>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <span className="flex items-center gap-1.5 hover:text-black transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold"></span>
              <span>الثقة (TRUST)</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-black transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold"></span>
              <span>النمو (GROWTH)</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-black transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold"></span>
              <span>الاستثمار (INVESTMENT)</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-black transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold"></span>
              <span>الاستدامة (SUSTAINABILITY)</span>
            </span>
          </div>

          <div className="text-[11px] text-zinc-500 font-medium hidden lg:block">
            تنوع في القطاعات • قوة في التنفيذ • استدامة في النمو
          </div>
        </div>
      </section>

      {/* 4. Companies Grid: Luxury White Editorial Cards */}
      {/* 4. Companies Grid: Luxury White Editorial Cards */}
      <section id="companies" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-pale border border-champagne/40 text-champagne-dark text-[11px] font-extrabold mb-2.5">
              <span>COMPANIES & WORKSPACES</span>
              <span>•</span>
              <span>قطاعات الأعمال المستقلة</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 font-display">
              الشركات التابعة ومساحات العمل المستقلة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            أنظمة تشغيل سحابية منفصلة كلياً لكل شركة مع بيئة عمل مخصصة وتكامل إداري موحد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {companies.map((comp) => (
            <div
              key={comp.code}
              onClick={() => handleSelect(comp.id)}
              className="luxury-white-card group flex flex-col justify-between overflow-hidden cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                color: '#091725'
              }}
            >
              <div>
                {/* Top Image Frame with Overlay & Badges */}
                <div className="h-44 relative overflow-hidden bg-zinc-100 rounded-t-[1.4rem]">
                  <img
                    src={comp.image}
                    alt={comp.nameAr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-transparent" />
                  
                  {/* Top Bar inside Image: Code & Sector Badge */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] bg-white/95 backdrop-blur-xs border border-zinc-200/90 px-2 py-0.5 rounded-md text-zinc-900 font-mono font-extrabold shadow-xs">
                      {comp.code.split(' ')[0]} {comp.code.split(' ')[1]}
                    </span>
                    <span 
                      className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-xs"
                      style={{ backgroundColor: comp.themeColor }}
                    >
                      {comp.badge}
                    </span>
                  </div>

                  {/* Top Accent Line */}
                  <div 
                    className="absolute bottom-0 inset-x-0 h-1"
                    style={{ backgroundColor: comp.themeColor }}
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 text-right space-y-3.5">
                  {/* Company Logo + Arabic Title */}
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-1 bg-white rounded-xl border border-zinc-200/80 shadow-xs group-hover:border-amber-400/60 transition-colors">
                      <CompanyLogo companyId={comp.id} size={38} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-950 leading-snug font-display">
                        {comp.nameAr}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-medium block truncate mt-0.5">
                        {comp.nameEn}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 min-h-[48px]">
                    {comp.desc}
                  </p>

                  {/* Active Metric Badge */}
                  <div>
                    <span 
                      className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5"
                      style={{ background: `${comp.themeColor}14`, color: comp.themeColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: comp.themeColor }} />
                      <span>{comp.stats}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button & License */}
              <div className="p-5 pt-0 text-right space-y-2.5">
                <div className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-50 group-hover:bg-zinc-950 text-zinc-800 group-hover:text-white border border-zinc-200/90 group-hover:border-zinc-950 transition-all duration-200 font-bold text-xs flex items-center justify-between shadow-2xs">
                  <span className="text-[11.5px]">دخول بيئة العمل</span>
                  <div className="w-6 h-6 rounded-full bg-white group-hover:bg-zinc-800 text-zinc-700 group-hover:text-amber-400 flex items-center justify-center transition-all shadow-2xs">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </div>
                </div>

                <div className="text-[9.5px] text-zinc-400 font-mono truncate pt-1 border-t border-zinc-100 flex items-center justify-between">
                  <span>{comp.license}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Enterprise Capabilities & Infrastructure Section */}
      <section id="capabilities" className="border-t border-zinc-200/80 bg-zinc-50/70 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 sm:mb-16 text-right">
            <span className="eyebrow-cap text-champagne-dark text-xs tracking-widest font-bold">CAPABILITIES & INFRASTRUCTURE</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-2 font-display">
              بنية تحتية موحدة بمقاييس عالمية
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              منظومة إلكترونية رائدة تدير وتتكامل مع المنصات الحكومية وأنظمة المحاسبة والذكاء الاصطناعي المؤسسي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            {/* Card 1: Government Compliance & Integration */}
            <div 
              className="white-feature-card group"
              style={{ backgroundColor: '#ffffff', color: '#091725' }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-xs mb-6 group-hover:scale-105 transition-transform">
                <Network className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-zinc-950 font-display mb-2.5">
                الربط والامتثال الحكومي الشامل
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                تكامل مباشر مع منصة مساند، الفوترة الإلكترونية للمرحلة الثانية من هيئة الزكاة والضريبة والجمارك (ZATCA)، منصة مقيم، التأمينات الاجتماعية، وسحابة اعتماد.
              </p>

              {/* Verified Feature Checklist */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">ربط وتوثيق فوري مع مساند (RC01 - RC03)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">فوترة مشفرة ZATCA متوافقة كلياً مع المرحلة الثانية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">تكامل آلي مع التأمينات ومقيم وسحابة اعتماد</span>
                </div>
              </div>

              {/* Live Status Tag */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ربط نشط وممتثل 100%</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">API Gateway v2.4</span>
              </div>
            </div>

            {/* Card 2: SMACC & Advanced Accounting */}
            <div 
              className="white-feature-card group"
              style={{ backgroundColor: '#ffffff', color: '#091725' }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 opacity-80" />

              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-700 flex items-center justify-center shadow-xs mb-6 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-zinc-950 font-display mb-2.5">
                المحاسبة المتقدمة و SMACC
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                شجرة حسابات مالية متعددة المستويات مع مراكز تكلفة مستقلة لكل شركة، موازين مراجعة، فواتير إلكترونية QR، وتقارير تفاعلية لحظية للإيرادات والأرباح.
              </p>

              {/* Verified Feature Checklist */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-semibold">شجرة حسابات مالية متعددة المستويات ومراكز التكلفة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-semibold">موازين مراجعة وتقارير تفاعلية لحظية للإيرادات</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-semibold">أرشفة رقمية للقيود وتفقيط مالي آلي بالريال السعودي</span>
                </div>
              </div>

              {/* Live Status Tag */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-sky-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>تزامن مالي فوري</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">SMACC Enterprise</span>
              </div>
            </div>

            {/* Card 3: AI Copilot & Saudi Digital Guide */}
            <div 
              className="white-feature-card group"
              style={{ backgroundColor: '#ffffff', color: '#091725' }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-80" />

              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shadow-xs mb-6 group-hover:scale-105 transition-transform">
                <Bot className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-zinc-950 font-display mb-2.5">
                المرشد ومساعد الذكاء الاصطناعي
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                مساعد آلي ذكي (AI Copilot) ومرشد رقمي سعودي مدمج لتحليل البيانات، إنشاء العقود الفورية، تدقيق السجلات، وتقديم التوصيات التشغيلية لقيادة المجموعة.
              </p>

              {/* Verified Feature Checklist */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">مرشد رقمي سعودي 3D مدمج للإرشاد والدعم 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">تحليل استباقي للبيانات واستخراج القرارات والتنبيهات</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">صياغة وتدقيق العقود والخطابات الرسمية بضغطة زر</span>
                </div>
              </div>

              {/* Live Status Tag */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>دعم وتشغيل ذكي 24/7</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">AI Assistant v3.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Executive White Footer */}
      <footer id="governance" className="border-t border-zinc-200/80 bg-white py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 text-right">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-champagne/60 p-0.5 bg-white shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-bold text-base text-zinc-950 font-display">مجموعة خالد السليم</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              المنظومة الرقمية المركزية الرائدة لإدارة قطاع الاستقدام والتشغيل والمنافسات والتوريدات بالمملكة العربية السعودية.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-champagne-dark font-bold">
              <span>نستثمر في الفرص.. نصنع المستقبل</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-4">الشركات والكيانات</h4>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <button type="button" onClick={() => handleSelect('SAF')} className="block hover:text-black text-right">شركة الصفا الماسي للاستقدام</button>
              <button type="button" onClick={() => handleSelect('YAQ')} className="block hover:text-black text-right">شركة الياقوت الشرقية للتشغيل</button>
              <button type="button" onClick={() => handleSelect('TOP')} className="block hover:text-black text-right">شركة توب تالنت الدولية للـ ATS</button>
              <button type="button" onClick={() => handleSelect('KAS')} className="block hover:text-black text-right">بوابة شركة كاس للمنافسات والتشغيل</button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-4">المنصات والربط الحكومي</h4>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div>منصة مساند الحكومية (RC01 - RC03)</div>
              <div>هيئة الزكاة والضريبة والجمارك (ZATCA)</div>
              <div>وزارة الموارد البشرية والتنمية الاجتماعية (HRSD)</div>
              <div>سحابة منافسات اعتماد الحكومية</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-4">الدعم الفني والحوكمة</h4>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div>مركز القيادة والتحكم الفائق (Super Admin)</div>
              <div>عزل البيانات متعدد الشركات (Zero Contamination)</div>
              <div>الدعم الفني والتقني المعتمد 24/7</div>
              <div>حماية وتشفير البيانات FIDO2 / WebAuthn</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>
            © {new Date().getFullYear()} مجموعة خالد السليم (KSHG) • جميع الحقوق محفوظة ومحمية • رؤية 2030
          </span>
          <div className="flex items-center gap-2">
            <span className="pill-tag-mint text-[10px]">
              Active Multi-Tenant Engine
            </span>
            <span className="pill-tag-shade text-[10px]">
              Executive White Edition
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
