import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { CompanyId } from '../types';
import { useCompany } from '../contexts/CompanyContext';

interface LandingPageProps {
  onSelectCompany: (companyId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCompany }) => {
  const { currentLanguage } = useLanguage();
  const { setActiveCompanyId } = useCompany();

  const handleSelect = (id: CompanyId) => {
    setActiveCompanyId(id);
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
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family-ui)',
        direction: currentLanguage.dir,
        fontFeatureSettings: '"ss03" 1',
      }}
    >
      {/* 1. Cinematic Top Nav Bar */}
      <header className="nav-bar-dark" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', backgroundColor: 'rgba(0,0,0,0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #ffffff', padding: '2px', background: '#000000' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '18px', fontWeight: 500, letterSpacing: '0.4px' }}>
              مجموعة خالد السليم
            </span>
            <span style={{ fontSize: '11px', color: '#a1a1aa', letterSpacing: '0.72px', textTransform: 'uppercase' }}>
              COMMERCE & ENTERPRISE OS
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          <a href="#companies" className="link-on-dark" style={{ fontSize: '14px', fontWeight: 420 }}>
            الشركات التابعة
          </a>
          <a href="#capabilities" className="link-on-dark" style={{ fontSize: '14px', fontWeight: 420 }}>
            القدرات التشغيلية
          </a>
          <a href="#governance" className="link-on-dark" style={{ fontSize: '14px', fontWeight: 420 }}>
            الحوكمة والربط الحكومي
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="button-outline-on-dark"
            onClick={() => handleSelect('all')}
            style={{ fontSize: '14px', padding: '8px 20px', minHeight: '38px' }}
          >
            دخول الإدارة المركزية
          </button>
          <button
            type="button"
            className="button-primary-pill"
            onClick={() => onSelectCompany('login')}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '14px',
              padding: '8px 22px',
              minHeight: '38px',
              fontWeight: 550,
            }}
          >
            تسجيل الدخول
          </button>
        </div>
      </header>

      {/* 2. Hero Section: Cinematic Thin-Display & Negative Space */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 32px 80px 32px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow-cap" style={{ color: '#c1fbd4', letterSpacing: '1.2px', fontSize: '13px', fontWeight: 500 }}>
              ENTERPRISE COMMERCE & HUMAN CAPITAL SYSTEM
            </span>
          </div>

          <h1
            className="display-xxl"
            style={{
              fontSize: 'clamp(44px, 5.8vw, 92px)',
              fontWeight: 330,
              lineHeight: 1.05,
              letterSpacing: '2px',
              marginBottom: '28px',
              color: '#ffffff',
            }}
          >
            بوابة التشغيل الذكي للمجموعة
          </h1>

          <p
            className="body-lg"
            style={{
              fontSize: 'clamp(17px, 1.8vw, 20px)',
              color: '#a1a1aa',
              lineHeight: 1.6,
              maxWidth: '780px',
              margin: '0 auto 48px auto',
              fontWeight: 420,
            }}
          >
            منظومة سحابية متقدمة تدير 4 شركات رائدة باستقلالية كاملة وقواعد بيانات منفصلة مع مركز قيادة وتحكم موحد للأداء والمالية والربط الحكومي.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="button-outline-on-dark"
              onClick={() => handleSelect('all')}
              style={{ minWidth: '220px', fontSize: '16px' }}
            >
              دخول الإدارة المركزية (Super Admin)
            </button>
            <button
              type="button"
              className="button-primary-pill"
              onClick={() => onSelectCompany('login')}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                minWidth: '200px',
                fontSize: '16px',
                fontWeight: 550,
              }}
            >
              تسجيل الدخول المباشر
            </button>
          </div>
        </div>
      </section>

      {/* 3. Companies Grid: Full-Bleed Editorial Photography Cards */}
      <section id="companies" style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px 100px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <span className="eyebrow-cap" style={{ color: '#9dabad' }}>COMPANIES & ENTITIES</span>
            <h2 className="display-md" style={{ fontSize: '36px', fontWeight: 330, marginTop: '6px' }}>
              الشركات التابعة للمجموعة
            </h2>
          </div>
          <span className="caption" style={{ color: '#71717a' }}>
            اختر الشركة للانتقال إلى مساحة العمل الخاصة بها
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {companies.map((comp) => (
            <div
              key={comp.id}
              onClick={() => handleSelect(comp.id)}
              className="card-feature-cinematic"
              style={{
                minHeight: '440px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Image Frame Top */}
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={comp.image}
                  alt={comp.nameAr}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.0)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.95) 100%)',
                  }}
                />
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="eyebrow-cap" style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '9999px', color: '#ffffff' }}>
                    {comp.code}
                  </span>
                </div>
              </div>

              {/* Card Content Bottom */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CompanyLogo companyId={comp.id} size={48} />
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 500, margin: 0, color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
                        {comp.nameAr}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{comp.nameEn}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.5, margin: '8px 0 16px 0' }}>
                    {comp.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                    {comp.stats}
                  </span>
                  <span style={{ fontSize: '13px', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>دخول المنظومة</span>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px' }}></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Enterprise Capabilities Section */}
      <section id="capabilities" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0a0a0a', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
            <span className="eyebrow-cap" style={{ color: '#c1fbd4' }}>CAPABILITIES & INFRASTRUCTURE</span>
            <h2 className="display-xl" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 330, marginTop: '8px', color: '#ffffff' }}>
              بنية تحتية موحدة بمقاييس عالمية
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div className="card-feature-cinematic" style={{ padding: '36px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#1e2c31', color: '#c1fbd4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>
                <i className="fa-solid fa-network-wired"></i>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '12px', color: '#ffffff' }}>
                الربط والامتثال الحكومي الشامل
              </h3>
              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.6 }}>
                تكامل مباشر مع منصة مساند، الفوترة الإلكترونية للمرحلة الثانية من هيئة الزكاة والضريبة والجمارك (ZATCA)، ومنصة مقيم ونظام التأمينات الاجتماعية.
              </p>
            </div>

            <div className="card-feature-cinematic" style={{ padding: '36px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#1e2c31', color: '#c1fbd4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '12px', color: '#ffffff' }}>
                المحاسبة المتقدمة وقياس الأداء
              </h3>
              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.6 }}>
                نظام محاسبي شجري كامل مع مراكز التكلفة، موازين المراجعة، الحسابات الختامية، وتقارير تفاعلية فورية لأرباح وعوائد كل فرع وشركة.
              </p>
            </div>

            <div className="card-feature-cinematic" style={{ padding: '36px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#1e2c31', color: '#c1fbd4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>
                <i className="fa-solid fa-robot"></i>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '12px', color: '#ffffff' }}>
                مساعد الذكاء الاصطناعي المؤسسي
              </h3>
              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.6 }}>
                مساعد آلي ذكي (Copilot) مدمج لتحليل البيانات، إنشاء العقود الفورية، تدقيق السجلات، وتقديم التوصيات التشغيلية لقيادة المجموعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer: Dark Full-Width Cinematic Footer */}
      <footer className="footer-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ffffff' }} />
              <span style={{ fontWeight: 500, fontSize: '16px', color: '#ffffff' }}>مجموعة خالد السليم</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-link-cool-2)', lineHeight: 1.6 }}>
              المنظومة الرقمية المركزية الرائدة لإدارة وتطوير قطاع الاستقدام والتشغيل في المملكة العربية السعودية.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>الشركات والمؤسسات</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="button" onClick={() => handleSelect('SAF')} className="link-on-dark link-cool-1" style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}>شركة السفير الماسي</button>
              <button type="button" onClick={() => handleSelect('YAQ')} className="link-on-dark link-cool-1" style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}>شركة ياقوت نجد</button>
              <button type="button" onClick={() => handleSelect('TOP')} className="link-on-dark link-cool-1" style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}>شركة توباز للاستقدام</button>
              <button type="button" onClick={() => handleSelect('DAR')} className="link-on-dark link-cool-1" style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}>دار الرواد</button>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>الأنظمة والروابط</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="link-cool-2" style={{ fontSize: '13px' }}>منصة مساند الحكومية</span>
              <span className="link-cool-2" style={{ fontSize: '13px' }}>هيئة الزكاة والضريبة (ZATCA)</span>
              <span className="link-cool-2" style={{ fontSize: '13px' }}>مركز القيادة الموحد (Command Center)</span>
              <span className="link-cool-2" style={{ fontSize: '13px' }}>بوابة المزامنة السحابية</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>الدعم والأمان</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="link-cool-3" style={{ fontSize: '13px' }}>حماية البيانات والتشفير</span>
              <span className="link-cool-3" style={{ fontSize: '13px' }}>سجل النشاطات والأحداث</span>
              <span className="link-cool-3" style={{ fontSize: '13px' }}>الدعم الفني والتقني 24/7</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1440px', margin: '0 auto', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-link-cool-2)' }}>
            © {new Date().getFullYear()} مجموعة خالد السليم للاستقدام والتشغيل. جميع الحقوق محفوظة ومحمية.
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              Shopifi Engine Active
            </span>
            <span className="pill-tag-shade" style={{ fontSize: '11px' }}>
              Version 3.4.2
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

