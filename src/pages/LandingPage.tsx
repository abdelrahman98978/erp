import React, { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { CompanyId } from '../types';
import { useCompany } from '../contexts/CompanyContext';

interface LandingPageProps {
  onSelectCompany: (companyId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectCompany }) => {
  const { currentLanguage, t } = useLanguage();
  const { setActiveCompanyId } = useCompany();

  const handleSelect = (id: CompanyId) => {
    setActiveCompanyId(id);
    onSelectCompany(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 12;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 12;
      const imgs = document.querySelectorAll('.landing-bg-img');
      imgs.forEach((img) => {
        (img as HTMLElement).style.transform = `translate(${xPos}px, ${yPos}px) scale(1.12)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#0F172A',
        fontFamily: 'Cairo, Tajawal, sans-serif',
        direction: currentLanguage.dir,
        margin: 0,
        padding: 0,
        position: 'relative',
      }}
    >
      <style>{`
        .geometric-grid-landing {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(12, 1fr);
          height: 100vh;
          width: 100vw;
          gap: 0;
          background: #0F172A;
        }

        .nav-card-landing {
          position: relative;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease, box-shadow 0.4s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
          z-index: 1;
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          user-select: none;
        }

        .nav-card-landing:hover {
          z-index: 10;
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border-color: #D4AF37;
        }

        .landing-bg-img {
          position: absolute;
          top: -5%;
          left: -5%;
          width: 110%;
          height: 110%;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease;
          z-index: 0;
        }

        .overlay-landing {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%);
          z-index: 1;
        }

        .card-content-landing {
          position: relative;
          z-index: 2;
        }

        /* Grid Spans */
        .card-masi { grid-column: span 6; grid-row: span 6; }
        .card-yaqoot { grid-column: span 6; grid-row: span 6; }
        .card-topaz { grid-column: span 6; grid-row: span 6; }
        .card-ruwad { grid-column: span 6; grid-row: span 6; }
      `}</style>

      {/* Floating Top Header Badge */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '50px',
          padding: '8px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src="/logo.png"
          alt="ALSALIM GROUP LOGO"
          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #D4AF37', background: '#FFFFFF', padding: '2px' }}
        />
        <span style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: '15px', fontWeight: '800' }}>
          مجموعة شركات خالد السليم للاستقدام والتشغيل | 4 شركات مستقلة
        </span>

        <button
          type="button"
          onClick={() => handleSelect('all')}
          style={{
            backgroundColor: '#D4AF37',
            color: '#0F172A',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 16px',
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            marginLeft: '12px',
          }}
        >
          دخول الإدارة المركزية (Super Admin)
        </button>
      </div>

      {/* Geometric Grid of 4 Official Companies */}
      <div className="geometric-grid-landing">
        {/* 1. شركة السفير الماسي */}
        <div
          className="nav-card-landing card-masi"
          onClick={() => handleSelect('masi')}
          style={{ background: '#0F172A' }}
        >
          <div
            className="landing-bg-img"
            style={{
              opacity: 0.35,
              backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="overlay-landing" />
          <div className="card-content-landing">
            <div style={{ marginBottom: '16px' }}>
              <CompanyLogo companyId="masi" size={72} />
            </div>
            <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '30px', fontWeight: '900', margin: '0 0 8px 0', color: '#FFFFFF' }}>
              شركة السفير الماسي
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '15px', margin: 0, fontWeight: '600' }}>
              Al-Sfeer Al-Masi Company | تميز واستقدام حلول الكادر والعمالة المنزلية
            </p>
          </div>
          <div style={{ position: 'absolute', top: '30px', left: '30px', color: 'rgba(255, 255, 255, 0.1)', fontSize: '72px', fontWeight: '900' }}>
            01
          </div>
        </div>

        {/* 2. شركة ياقوت نجد */}
        <div
          className="nav-card-landing card-yaqoot"
          onClick={() => handleSelect('yaqoot')}
          style={{ background: '#181C1C' }}
        >
          <div
            className="landing-bg-img"
            style={{
              opacity: 0.35,
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="overlay-landing" />
          <div className="card-content-landing">
            <div style={{ marginBottom: '16px' }}>
              <CompanyLogo companyId="yaqoot" size={72} />
            </div>
            <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '30px', fontWeight: '900', margin: '0 0 8px 0', color: '#F59E0B' }}>
              شركة ياقوت نجد
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '15px', margin: 0, fontWeight: '600' }}>
              Yaqoot Najd Company | الجودة والابتكار في الخدمات التشغيلية والتأجير
            </p>
          </div>
          <div style={{ position: 'absolute', top: '30px', left: '30px', color: 'rgba(255, 255, 255, 0.1)', fontSize: '72px', fontWeight: '900' }}>
            02
          </div>
        </div>

        {/* 3. شركة توباز للاستقدام */}
        <div
          className="nav-card-landing card-topaz"
          onClick={() => handleSelect('topaz')}
          style={{ background: '#0F6B6E' }}
        >
          <div
            className="landing-bg-img"
            style={{
              opacity: 0.35,
              backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="overlay-landing" />
          <div className="card-content-landing">
            <div style={{ marginBottom: '16px' }}>
              <CompanyLogo companyId="topaz" size={72} />
            </div>
            <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '30px', fontWeight: '900', margin: '0 0 8px 0', color: '#38BDF8' }}>
              شركة توباز للاستقدام
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '15px', margin: 0, fontWeight: '600' }}>
              Topaz Recruitment Company | التوسط والاستقدام الشامل للعمالة المهنية
            </p>
          </div>
          <div style={{ position: 'absolute', top: '30px', left: '30px', color: 'rgba(255, 255, 255, 0.1)', fontSize: '72px', fontWeight: '900' }}>
            03
          </div>
        </div>

        {/* 4. دار الرواد */}
        <div
          className="nav-card-landing card-ruwad"
          onClick={() => handleSelect('ruwad')}
          style={{ background: '#005154' }}
        >
          <div
            className="landing-bg-img"
            style={{
              opacity: 0.35,
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="overlay-landing" />
          <div className="card-content-landing">
            <div style={{ marginBottom: '16px' }}>
              <CompanyLogo companyId="ruwad" size={72} />
            </div>
            <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '30px', fontWeight: '900', margin: '0 0 8px 0', color: '#60A5FA' }}>
              دار الرواد
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '15px', margin: 0, fontWeight: '600' }}>
              Dar Al-Ruwad Entity | الريادة في التطوير والخدمات النوعية المعتمدة
            </p>
          </div>
          <div style={{ position: 'absolute', top: '30px', left: '30px', color: 'rgba(255, 255, 255, 0.1)', fontSize: '72px', fontWeight: '900' }}>
            04
          </div>
        </div>
      </div>
    </main>
  );
};
