import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/languages';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { signIn, loading: authLoading, error: authError } = useAuthContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;
    if (is2FAStep && timerSeconds > 0) {
      timer = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [is2FAStep, timerSeconds]);

  useEffect(() => {
    let animId: number;
    let renderer: any;

    const initThree = () => {
      const container = containerRef.current;
      const THREE = (window as any).THREE;
      if (!container || !THREE) return false;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let width = container.clientWidth || 500;
      let height = container.clientHeight || 750;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create a Geometric Star
      const starColor = 0x0f6b6e;
      const starGeometry = new THREE.IcosahedronGeometry(4, 0);

      const positionAttribute = starGeometry.getAttribute('position');
      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(positionAttribute, i);
          if (Math.random() > 0.5) {
            vertex.multiplyScalar(1.5);
          }
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
      }

      const wireframeMaterial = new THREE.MeshPhongMaterial({
        color: starColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });

      const starMesh = new THREE.Mesh(starGeometry, wireframeMaterial);
      scene.add(starMesh);

      // Core Sphere
      const coreGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const coreMat = new THREE.MeshPhongMaterial({
        color: starColor,
        emissive: starColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      // Orbital Particles
      const particlesCount = 200;
      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.06,
        color: starColor,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleMesh);

      camera.position.z = 15;

      let clock = new THREE.Clock();

      function animate() {
        if (prefersReduced) {
          renderer.render(scene, camera);
          return;
        }
        animId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        starMesh.rotation.y += 0.005;
        starMesh.rotation.x += 0.003;
        core.rotation.y -= 0.002;

        const pulse = 1 + Math.sin(time * 2) * 0.05;
        starMesh.scale.set(pulse, pulse, pulse);
        coreMat.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;

        particleMesh.rotation.y += 0.001;
        particleMesh.rotation.z += 0.0005;

        renderer.render(scene, camera);
      }
      animate();

      const handleResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (prefersReduced) return;
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        if (visualCardRef.current) {
          visualCardRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
        if (starMesh) {
          starMesh.rotation.z = (e.clientX / window.innerWidth - 0.5) * 0.2;
        }
      };

      window.addEventListener('resize', handleResize);
      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        if (renderer && renderer.domElement) {
          renderer.dispose();
        }
      };
    };

    let cleanup: any;
    if (!initThree()) {
      const timer = setInterval(() => {
        if (initThree()) {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    } else {
      cleanup = initThree();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const result = await signIn(username, password);
    if (result.success) {
      // In a real MFA flow, Supabase would signal if 2FA is needed.
      // For now we simulate the transition to the OTP step.
      setIs2FAStep(true);
      setTimerSeconds(45);
    } else {
      setLocalError(result.error || 'فشل تسجيل الدخول: بيانات غير صحيحة');
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setLocalError('يرجى إدخال رمز المصادقة الثنائية المكون من 6 أرقام كاملاً');
      return;
    }
    // Final success - call the prop
    onLoginSuccess();
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newValues = [...otpValues];
    newValues[index] = val;
    setOtpValues(newValues);

    // Auto-focus next input
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newValues = [...otpValues];
      digits.forEach((digit, i) => {
        if (i < 6) newValues[i] = digit;
      });
      setOtpValues(newValues);
      otpInputsRef.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleResendCode = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimerSeconds(45);
      setLocalError(null);
    }, 1000);
  };

  const isRtl = currentLanguage.dir === 'rtl';
  const displayedError = authError || localError;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#F8FAFA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Tajawal, Cairo, sans-serif',
      direction: currentLanguage.dir
    }}>
      {/* Main Card Container */}
      <div style={{
        display: 'flex',
        flexDirection: isRtl ? 'row-reverse' : 'row',
        width: '100%',
        maxWidth: '1150px',
        minHeight: '720px',
        overflow: 'hidden',
        borderRadius: '32px',
        background: '#FFFFFF',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(224, 227, 227, 0.6)'
      }}>

        {/* Right Side: 3D Visual Hero Section */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: '#FFFFFF',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Light Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top right, #F1F4F4, #FFFFFF, #F8FAFA)',
            opacity: 0.7
          }}></div>

          {/* Three.js 3D Animation Background Container */}
          <div
            ref={containerRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              mixBlendMode: 'multiply',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 5
            }}
          ></div>

          {/* Glassmorphism Floating Content Card */}
          <div
            ref={visualCardRef}
            style={{
              position: 'relative',
              zIndex: 20,
              maxWidth: '420px',
              padding: '40px 32px',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 15px 35px rgba(0, 81, 84, 0.08)',
              textAlign: 'center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <img
              src="./logo.png"
              alt="شعار مجموعة خالد السليم"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px auto',
                objectFit: 'cover',
                background: '#FFFFFF',
                padding: '4px',
                border: '3px solid #D4AF37',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
              }}
            />
            <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '28px', fontWeight: '800', color: '#005154', margin: '0 0 12px 0' }}>
              {t('groupTitle', 'مجموعة خالد السليم')}
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'rgba(0, 81, 84, 0.3)', margin: '0 auto 20px auto', borderRadius: '9999px' }}></div>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', color: '#3f4949', lineHeight: '1.7', margin: 0 }}>
              {t('loginVision', 'نحو مستقبل رقمي متكامل يعزز الكفاءة والابتكار في إدارة أعمالكم.')}
            </p>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(0, 81, 84, 0.1)'
            }}>
              <div>
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: '800', color: '#005154', display: 'block' }}>{t('secure', 'آمن')}</span>
                <span style={{ fontSize: '12px', color: '#5a6363' }}>{t('protection', 'حماية 2FA')}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: '800', color: '#005154', display: 'block' }}>{t('smart', 'ذكي')}</span>
                <span style={{ fontSize: '12px', color: '#5a6363' }}>{t('solutions', 'حلول')}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: '800', color: '#005154', display: 'block' }}>{t('comprehensive', 'شامل')}</span>
                <span style={{ fontSize: '12px', color: '#5a6363' }}>{t('coverage', 'تغطية')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Login Form / 2FA Verification Section */}
        <div style={{
          width: '480px',
          padding: '48px',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Top Brand & Language Switcher */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', position: 'relative' }}>
              <img src="./logo.png" alt="شعار المكاتب" style={{ height: '48px', width: 'auto' }} />

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  aria-expanded={showLangMenu}
                  aria-haspopup="true"
                  aria-label="تغيير اللغة"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: '1px solid #bec9c8',
                    background: '#f8fafa',
                    color: '#181c1c',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <span>{currentLanguage.flag}</span>
                  <span>{currentLanguage.nativeName}</span>
                  <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }} aria-hidden="true"></i>
                </button>

                {showLangMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: isRtl ? 0 : 'auto',
                    right: !isRtl ? 0 : 'auto',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    width: '180px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    zIndex: 100,
                    padding: '4px'
                  }}>
                    {LANGUAGES.map((lang: Language) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        style={{
                          width: '100%',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          background: currentLanguage.code === lang.code ? 'rgba(0, 81, 84, 0.1)' : 'transparent',
                          color: currentLanguage.code === lang.code ? '#005154' : '#181c1c',
                          fontWeight: currentLanguage.code === lang.code ? '800' : '500',
                          fontSize: '13px'
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {displayedError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '13.5px',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                <span>{displayedError}</span>
              </div>
            )}

            {!is2FAStep ? (
              /* Step 1: Standard Username & Password Form */
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '28px', fontWeight: '800', color: '#181c1c', margin: '0 0 8px 0' }}>
                    {t('loginHeaderTitle', 'تسجيل الدخول')}
                  </h1>
                  <p style={{ fontSize: '14px', color: '#3f4949', margin: 0 }}>
                    {t('loginHeaderSub', 'مرحباً بك في المنصة الموحدة لمجموعة خالد السليم')}
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Username Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="login-username" style={{ fontSize: '13px', fontWeight: '700', color: '#3f4949' }}>
                      {t('username', 'اسم المستخدم أو البريد الإلكتروني')}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-user" aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '16px', color: '#5a6363', fontSize: '16px' }}></i>
                      <input
                        id="login-username"
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder={t('usernamePlaceholder', 'أدخل اسم المستخدم...')}
                        style={{
                          width: '100%',
                          height: '52px',
                          paddingInlineStart: '48px',
                          paddingInlineEnd: '16px',
                          borderRadius: '14px',
                          background: '#f2f4f4',
                          border: '1px solid transparent',
                          outline: 'none',
                          fontSize: '14px',
                          color: '#181c1c',
                          fontFamily: 'Tajawal, sans-serif',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="login-password" style={{ fontSize: '13px', fontWeight: '700', color: '#3f4949' }}>
                      {t('password', 'كلمة المرور')}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-lock" aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '16px', color: '#5a6363', fontSize: '16px' }}></i>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          height: '52px',
                          paddingInlineStart: '48px',
                          paddingInlineEnd: '48px',
                          borderRadius: '14px',
                          background: '#f2f4f4',
                          border: '1px solid transparent',
                          outline: 'none',
                          fontSize: '14px',
                          color: '#181c1c',
                          fontFamily: 'Tajawal, sans-serif',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        aria-pressed={showPassword}
                        style={{ position: 'absolute', insetInlineEnd: '16px', border: 'none', background: 'transparent', color: '#5a6363', cursor: 'pointer' }}
                      >
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#3f4949' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#005154', width: '16px', height: '16px' }}
                      />
                      <span>{t('rememberMe', 'تذكرني')}</span>
                    </label>
                    <a href="#forgot" onClick={e => e.preventDefault()} style={{ fontSize: '13px', color: '#005154', fontWeight: '700' }}>
                      {t('forgotPassword', 'نسيت كلمة المرور؟')}
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      height: '52px',
                      marginTop: '8px',
                      width: '100%',
                      background: authLoading ? '#00383b' : '#005154',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '700',
                      borderRadius: '14px',
                      border: 'none',
                      boxShadow: '0 8px 20px rgba(0, 81, 84, 0.25)',
                      cursor: authLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>جاري التحقق...</span>
                      </>
                    ) : (
                      t('loginButton', 'دخول للمنصة')
                    )}
                  </button>
                </form>

                {/* Separator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e0e3e3' }}></div>
                  <span style={{ fontSize: '12px', color: '#5a6363' }}>{t('orLoginWith', 'أو الدخول بواسطة')}</span>
                  <div style={{ flex: 1, height: '1px', background: '#e0e3e3' }}></div>
                </div>

                {/* Social Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIs2FAStep(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid #bec9c8',
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: '600'
                    }}
                  >
                    <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIs2FAStep(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid #bec9c8',
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: '600'
                    }}
                  >
                    <i className="fa-solid fa-building" style={{ color: '#005154' }} aria-hidden="true"></i>
                    <span>{t('groupDirectory', 'دليل المجموعة')}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: 2FA Verification Form */
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => { setIs2FAStep(false); setLocalError(null); }}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#005154',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`} aria-hidden="true"></i> رجوع لاسم المستخدم
                  </button>

                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'rgba(0, 81, 84, 0.1)',
                    color: '#005154',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginBottom: '16px'
                  }}>
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                  </div>

                  <h1 id="otp-heading" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '24px', fontWeight: '800', color: '#181c1c', margin: '0 0 8px 0' }}>
                    المصادقة الثنائية (2FA Verification)
                  </h1>
                  <p style={{ fontSize: '13.5px', color: '#3f4949', margin: 0, lineHeight: '1.6' }}>
                    تم تفعيل طبقة الحماية 2FA لحسابك <strong>({username || 'المستخدِم'})</strong>. أدخل كود التحقق المكون من 6 أرقام من تطبيق Authenticator أو الرسائل:
                  </p>
                </div>

                <form onSubmit={handle2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 6 Digit OTP Input Grid */}
                  <div
                    role="group"
                    aria-labelledby="otp-heading"
                    style={{ display: 'flex', gap: '8px', justifyContent: 'center', direction: 'ltr' }}
                    onPaste={handleOtpPaste}
                  >
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpInputsRef.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        aria-label={`رقم المصادقة ${idx + 1}`}
                        value={val}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        style={{
                          width: '50px',
                          height: '56px',
                          borderRadius: '12px',
                          background: '#f2f4f4',
                          border: val ? '2px solid #005154' : '1px solid #bec9c8',
                          textAlign: 'center',
                          fontSize: '22px',
                          fontWeight: '800',
                          color: '#005154',
                          outline: 'none',
                          boxShadow: val ? '0 4px 12px rgba(0, 81, 84, 0.15)' : 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Timer & Resend code */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12.5px', color: '#5a6363' }} aria-live="polite">
                      <i className="fa-solid fa-clock me-1" aria-hidden="true"></i> ينتهي الرمز خلال: <strong>00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</strong>
                    </span>

                    <button
                      type="button"
                      disabled={timerSeconds > 0 || isResending}
                      onClick={handleResendCode}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: timerSeconds === 0 ? '#005154' : '#6b7a8e',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        cursor: timerSeconds === 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                    </button>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      height: '52px',
                      marginTop: '12px',
                      width: '100%',
                      background: '#005154',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '700',
                      borderRadius: '14px',
                      border: 'none',
                      boxShadow: '0 8px 20px rgba(0, 81, 84, 0.25)',
                      cursor: authLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>جاري التحقق...</span>
                      </>
                    ) : (
                      <>
                        <span>تأكيد الرمز والدخول للمنصة</span>
                        <i className="fa-solid fa-shield-check ms-1" aria-hidden="true"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Copyright Footer */}
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#5a6363', opacity: 0.8, marginTop: '24px' }}>
            © ٢٠٢٦ مجموعة خالد السليم. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </div>
  );
};
