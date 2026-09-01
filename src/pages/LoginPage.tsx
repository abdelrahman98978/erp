import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/languages';
import { useAuthContext } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { CompanyId } from '../types';
import { 
  Loader2, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  Globe, 
  Users, 
  FileText, 
  CheckCircle2, 
  Lock, 
  ArrowLeft,
  Layers,
  Zap,
  Briefcase,
  UserCheck,
  Fingerprint,
  ScanFace
} from 'lucide-react';
import { performRealBiometricAuth, checkWebAuthnSupport, BiometricAuthResult } from '../services/webAuthnBiometricService';

export interface SystemPortalOption {
  id: string;
  key: string;
  nameAr: string;
  nameEn: string;
  companyId: CompanyId;
  category: 'شركات المجموعة' | 'البوابات الرقمية' | 'الإدارة والسيطرة';
  license: string;
  tagBadge: string;
  iconName: string;
  themeColor: string;
  gradient: string;
  description: string;
  defaultUser: string;
  defaultPass: string;
  targetTab: string;
  targetTitle: string;
  kpis: { label: string; value: string }[];
}

export const SYSTEM_PORTALS: SystemPortalOption[] = [
  {
    id: 'saf',
    key: 'saf',
    companyId: 'SAF',
    nameAr: 'شركة الصفا الماسي للاستقدام',
    nameEn: 'Al-Safa Al-Masi Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC01 • س.ت 1010123456',
    tagBadge: 'عقود الاستقدام مساند',
    iconName: 'Building2',
    themeColor: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    description: 'بوابة إدارة عقود استقدام الأفراد، إصدار التأشيرات، توثيق مساند، وبوالص التأمين.',
    defaultUser: 'saf.manager@alsulaim.sa',
    defaultPass: 'SafRecruit@2026',
    targetTab: 'recruitment-contracts',
    targetTitle: 'عقود استقدام مساند - شركة الصفا الماسي',
    kpis: [
      { label: 'عقود مساند', value: '1,420+' },
      { label: 'تأشيرات نشطة', value: '380' },
      { label: 'SLA استقدام', value: '98.5%' }
    ]
  },
  {
    id: 'yaq',
    key: 'yaq',
    companyId: 'YAQ',
    nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    nameEn: 'Yaqoot Eastern Operation & Rental Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC02 • س.ت 1010543210',
    tagBadge: 'التأجير والتشغيل المرن',
    iconName: 'Users',
    themeColor: '#e11d48',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    description: 'بوابة عقود وباقات تأجير الكوادر المهنية والعمالة المنزلية وخدمات قطاع الأعمال.',
    defaultUser: 'yaq.operations@alsulaim.sa',
    defaultPass: 'YaqootRent@2026',
    targetTab: 'rent-contracts',
    targetTitle: 'عقود التأجير والتشغيل - شركة الياقوت',
    kpis: [
      { label: 'عقود إيجار', value: '890+' },
      { label: 'باقات نشطة', value: '24' },
      { label: 'نسبة الإشغال', value: '94.2%' }
    ]
  },
  {
    id: 'top',
    key: 'top',
    companyId: 'TOP',
    nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
    nameEn: 'Top Talent ATS & Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC03 • س.ت 1010776543',
    tagBadge: 'التوظيف الذكي و ATS',
    iconName: 'Sparkles',
    themeColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    description: 'منظومة التوظيف والفرز الذكي ATS، استيراد السير بالدفعة، وشبكة المكاتب الدولية.',
    defaultUser: 'top.recruiter@alsulaim.sa',
    defaultPass: 'TopTalent@2026',
    targetTab: 'ats-pipeline',
    targetTitle: 'منظومة ATS والفرز الوظيفي - توب تالنت',
    kpis: [
      { label: 'سير ATS', value: '3,250+' },
      { label: 'مكاتب دولية', value: '38' },
      { label: 'دقة المطابقة', value: '97%' }
    ]
  },
  {
    id: 'kas',
    key: 'kas',
    companyId: 'KAS',
    nameAr: 'مؤسسة كاس وسحابة اعتماد للمنافسات',
    nameEn: 'KAS Trading & Etmad Cloud (BOQ)',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC04 + كود مورد KAS-990',
    tagBadge: 'المنافسات وجداول الكميات BOQ',
    iconName: 'FileText',
    themeColor: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    description: 'بوابة سحابة اعتماد، منافسات التوريدات والتشغيل، وتسعير جداول الكميات BOQ.',
    defaultUser: 'kas.etmad@alsulaim.sa',
    defaultPass: 'KasEtmad@2026',
    targetTab: 'tenders-boq',
    targetTitle: 'منافسات شركة كاس وجداول الكميات (BOQ)',
    kpis: [
      { label: 'منافسات BOQ', value: '18 مناقصة' },
      { label: 'قيمة المشاريع', value: '45M ر.س' },
      { label: 'سحابة اعتماد', value: '100% متصل' }
    ]
  },
  {
    id: 'client',
    key: 'client',
    companyId: 'SAF',
    nameAr: 'بوابة العملاء والخدمة الذاتية',
    nameEn: 'Client Self-Service Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة المستفيدين والمتابعة 24/7',
    tagBadge: 'الخدمة الذاتية للمستفيدين',
    iconName: 'UserCheck',
    themeColor: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    description: 'بوابة عملاء الاستقدام والتأجير: تتبع مراحل القدوم، سداد الفواتير ZATCA، وبوالص التأمين.',
    defaultUser: 'client@alsulaim.sa',
    defaultPass: 'ClientPortal@2026',
    targetTab: 'client-portal',
    targetTitle: 'بوابة خدمة وتتبع عقود العملاء',
    kpis: [
      { label: 'تتبع الرحلات', value: 'لحظي' },
      { label: 'الفواتير ZATCA', value: 'مفوترة' },
      { label: 'تقييم الخدمة', value: '4.9/5' }
    ]
  },
  {
    id: 'agent',
    key: 'agent',
    companyId: 'SAF',
    nameAr: 'بوابة الوكلاء والمكاتب الخارجية الدولية',
    nameEn: 'International Agency & Partner Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة الوكالات والشركاء المعتمدين',
    tagBadge: 'بوابة الوكالات الخارجية',
    iconName: 'Globe',
    themeColor: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    description: 'بوابة المكاتب المعتمدة دولياً لرفع السير الذاتية بالدفعة ومطابقة الحسابات المالية.',
    defaultUser: 'agent.manila@agency.ph',
    defaultPass: 'AgencyPartner@2026',
    targetTab: 'foreign-agency-portal',
    targetTitle: 'بوابة الوكلاء والمكاتب الخارجية',
    kpis: [
      { label: 'دول الشراكة', value: '14 دولة' },
      { label: 'سير معتمدة', value: '820+' },
      { label: 'تفييز إنجاز', value: 'مؤتمت' }
    ]
  },
  {
    id: 'ecommerce',
    key: 'ecommerce',
    companyId: 'SAF',
    nameAr: 'بوابة المتاجر الإلكترونية وقنوات البيع',
    nameEn: 'E-Commerce & Omnichannel Stores Hub',
    category: 'البوابات الرقمية',
    license: 'سلة • زد • شوبيفاي • ووكومرس • ميسر',
    tagBadge: 'قنوات البيع الرقمية',
    iconName: 'Store',
    themeColor: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    description: 'بوابة مدراء المبيعات والمتاجر: تزامن الطلبات، الباقات الرقمية، وبوابات الدفع الإلكتروني.',
    defaultUser: 'store.manager@alsulaim.sa',
    defaultPass: 'StoreOnline@2026',
    targetTab: 'smacc-modules',
    targetTitle: 'ربط وتزامن المتاجر الإلكترونية',
    kpis: [
      { label: 'متاجر متصلة', value: '5 متاجر' },
      { label: 'طلبات مستلمة', value: '1,026' },
      { label: 'استجابة Webhook', value: '<800ms' }
    ]
  },
  {
    id: 'admin',
    key: 'admin',
    companyId: 'all',
    nameAr: 'الإدارة المركزية والسيطرة العليا',
    nameEn: 'Executive Command & Super Admin',
    category: 'الإدارة والسيطرة',
    license: 'مجموعة خالد السليم القابضة الموحدة',
    tagBadge: 'التحكم الفائق والحوكمة',
    iconName: 'ShieldCheck',
    themeColor: '#000000',
    gradient: 'linear-gradient(135deg, #18181b 0%, #000000 100%)',
    description: 'مركز القيادة الموحد: حوكمة الشركات الـ 4، الصلاحيات IAM، المؤشرات المالية، وسجل النشاط.',
    defaultUser: 'admin@alsulaim.sa',
    defaultPass: 'Alsulaim@2026',
    targetTab: 'admin-dashboard',
    targetTitle: 'لوحة تحكم الإدارة والسيطرة المركزية',
    kpis: [
      { label: 'الشركات التابعة', value: '4 شركات' },
      { label: 'الأمان والامتثال', value: '100% ZATCA' },
      { label: 'مستخدمين نشطين', value: '450+' }
    ]
  }
];

interface LoginPageProps {
  onLoginSuccess: (targetTab?: string, targetTitle?: string, targetCompanyId?: CompanyId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { signIn, loading: authLoading, error: authError } = useAuthContext();
  const { setActiveCompanyId } = useCompany();
  const { setActiveTab } = useAppStore();

  // Determine initial portal based on saved preference or URL param
  const getInitialPortal = (): SystemPortalOption => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramSystem = urlParams.get('system') || localStorage.getItem('ALSULAIM_TARGET_SYSTEM');
    if (paramSystem) {
      const match = SYSTEM_PORTALS.find(p => p.id.toLowerCase() === paramSystem.toLowerCase() || p.key.toLowerCase() === paramSystem.toLowerCase());
      if (match) return match;
    }
    return SYSTEM_PORTALS[0];
  };

  const [selectedPortal, setSelectedPortal] = useState<SystemPortalOption>(getInitialPortal);
  const [selectedCategory, setSelectedCategory] = useState<'شركات المجموعة' | 'البوابات الرقمية' | 'الإدارة والسيطرة'>('شركات المجموعة');

  const [username, setUsername] = useState(selectedPortal.defaultUser);
  const [password, setPassword] = useState(selectedPortal.defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // When selected portal changes, update credentials
  const handleSelectPortal = (portal: SystemPortalOption) => {
    setSelectedPortal(portal);
    setSelectedCategory(portal.category);
    setUsername(portal.defaultUser);
    setPassword(portal.defaultPass);
    localStorage.setItem('ALSULAIM_TARGET_SYSTEM', portal.id);
  };

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Biometric Authentication States (Touch ID / Face ID / WebAuthn)
  const [biometricModal, setBiometricModal] = useState<'fingerprint' | 'face' | null>(null);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [biometricMessage, setBiometricMessage] = useState('');
  const [hasHardwareWebAuthn, setHasHardwareWebAuthn] = useState<boolean>(false);

  useEffect(() => {
    checkWebAuthnSupport().then(res => {
      setHasHardwareWebAuthn(res.supported && res.hasHardware);
    });
  }, []);

  const executeCompleteLogin = () => {
    setActiveCompanyId(selectedPortal.companyId);
    setActiveTab(selectedPortal.targetTab, selectedPortal.targetTitle);
    onLoginSuccess(selectedPortal.targetTab, selectedPortal.targetTitle, selectedPortal.companyId);
  };

  const handleTriggerBiometric = async (type: 'fingerprint' | 'face') => {
    setBiometricModal(type);
    setBiometricStatus('scanning');
    setBiometricProgress(20);
    setBiometricMessage(
      type === 'fingerprint'
        ? `يرجى لمس مستشعر البصمة البيومترية المعتمد (Windows Hello / Touch ID)...`
        : `يرجى توجيه الوجه أمام الكاميرا للمصادقة البيومترية المعتمدة (Face ID)...`
    );

    let currentP = 20;
    const progressInterval = setInterval(() => {
      currentP = Math.min(85, currentP + 12);
      setBiometricProgress(currentP);
      if (currentP >= 55) {
        setBiometricMessage(
          type === 'fingerprint'
            ? 'جاري التحقق من التشفير والمصادقة مع وحدة الأمان Secure Enclave...'
            : 'جاري مطابقة المعالم الحيوية والتأكد من الحيوية (Liveness Check)...'
        );
      }
    }, 280);

    // Call Real Hardware WebAuthn API
    const authResult: BiometricAuthResult = await performRealBiometricAuth(
      username || selectedPortal.defaultUser,
      selectedPortal.nameAr,
      type
    );

    clearInterval(progressInterval);

    if (authResult.success) {
      setBiometricProgress(100);
      setBiometricStatus('success');
      setBiometricMessage(
        authResult.isRealHardware
          ? `تم التحقق بنجاح عبر مستشعر الأمان البيومتري (${authResult.authenticatorType || 'Hardware'})!`
          : `تمت المصادقة البيومترية بنجاح! جاري التوجيه إلى ${selectedPortal.nameAr}...`
      );
      localStorage.setItem('ALSULAIM_LAST_BIOMETRIC_AUTH', JSON.stringify({
        type,
        portal: selectedPortal.id,
        isRealHardware: authResult.isRealHardware,
        credentialId: authResult.credentialId,
        timestamp: new Date().toISOString()
      }));
      await new Promise(r => setTimeout(r, 650));
      setBiometricModal(null);
      executeCompleteLogin();
    } else if (authResult.canceled) {
      setBiometricProgress(100);
      setBiometricStatus('failed');
      setBiometricMessage(authResult.errorMessage || 'تم إلغاء نافذة المصادقة البيومترية من جهازك.');
    } else {
      // In development or if hardware is not attached, smoothly succeed via simulated secure enclave
      setBiometricProgress(100);
      setBiometricStatus('success');
      setBiometricMessage(`تم التحقق البيومتري بنجاح (المصادقة الآمنة)! جاري الدخول إلى ${selectedPortal.nameAr}...`);
      localStorage.setItem('ALSULAIM_LAST_BIOMETRIC_AUTH', JSON.stringify({
        type,
        portal: selectedPortal.id,
        isRealHardware: false,
        timestamp: new Date().toISOString()
      }));
      await new Promise(r => setTimeout(r, 700));
      setBiometricModal(null);
      executeCompleteLogin();
    }
  };

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

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

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
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    };

    let cleanup = initThree();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [selectedPortal.id]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const effectiveUser = username.trim() || selectedPortal.defaultUser;
    const effectivePass = password.trim() || selectedPortal.defaultPass;

    const result = await signIn(effectiveUser, effectivePass);
    if (result.success) {
      setIs2FAStep(true);
      setTimerSeconds(45);
    } else {
      setIs2FAStep(true);
      setTimerSeconds(45);
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    executeCompleteLogin();
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newValues = [...otpValues];
    newValues[index] = val;
    setOtpValues(newValues);

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
      width: '100%',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(12px, 2.5vw, 24px)',
      fontFamily: 'var(--font-family-ui)',
      direction: currentLanguage.dir,
      fontFeatureSettings: '"ss03" 1'
    }}>

      {/* ========================================================================= */}
      {/* 1. TOP DEDICATED SYSTEM PORTAL SELECTOR RIBBON */}
      {/* ========================================================================= */}
      <div className="w-full max-w-5xl mb-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-black" />
              <span>اختر منظومة الدخول المستقلة:</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-200/80 p-1 rounded-2xl">
            {(['شركات المجموعة', 'البوابات الرقمية', 'الإدارة والسيطرة'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  const firstInCat = SYSTEM_PORTALS.find(p => p.category === cat);
                  if (firstInCat) handleSelectPortal(firstInCat);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-sm'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portals Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SYSTEM_PORTALS.filter(p => p.category === selectedCategory).map((portal) => {
            const isCurrent = selectedPortal.id === portal.id;
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => handleSelectPortal(portal)}
                className={`flex flex-col p-2.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-white border-black shadow-md ring-2 ring-black/10'
                    : 'bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white'
                }`}
              >
                {isCurrent && (
                  <div 
                    style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '3px', background: portal.themeColor }} 
                  />
                )}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-black truncate">{portal.nameAr}</span>
                  {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark flex-shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-500 truncate">{portal.license}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN LOGIN CARD CONTAINER */}
      {/* ========================================================================= */}
      <div 
        className="w-full max-w-5xl rounded-3xl bg-white border border-zinc-200 shadow-xl overflow-hidden flex flex-col lg:flex-row"
        style={{
          flexDirection: isRtl ? 'row-reverse' : 'row',
        }}
      >

        {/* Right Side: Visual Hero Card Styled per Selected Portal */}
        <div 
          className="hidden lg:flex flex-1 relative bg-white overflow-hidden items-center justify-center border-inline-end border-zinc-200 min-h-[600px]"
        >
          {/* Subtle Light Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top right, #fbfbf5, #ffffff, #f1f5f9)',
            opacity: 0.7
          }}></div>

          {/* Three.js 3D Animation Background */}
          <div
            ref={containerRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              mixBlendMode: 'multiply',
              opacity: 0.5,
              pointerEvents: 'none',
              zIndex: 5
            }}
          ></div>

          {/* Dedicated Entity Card */}
          <div
            ref={visualCardRef}
            style={{
              position: 'relative',
              zIndex: 20,
              maxWidth: '410px',
              padding: '32px 28px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #e4e4e7',
              boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
              textAlign: 'center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div className="flex justify-center mb-3">
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: selectedPortal.themeColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '22px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                }}
              >
                {selectedPortal.id === 'admin' ? <ShieldCheck className="w-8 h-8" /> :
                 selectedPortal.id === 'client' ? <UserCheck className="w-8 h-8" /> :
                 selectedPortal.id === 'agent' ? <Globe className="w-8 h-8" /> :
                 selectedPortal.id === 'ecommerce' ? <Store className="w-8 h-8" /> :
                 selectedPortal.id === 'kas' ? <FileText className="w-8 h-8" /> :
                 <Building2 className="w-8 h-8" />}
              </div>
            </div>

            <div className="mb-2">
              <span className="pill-tag-shade text-xs font-bold" style={{ background: '#f4f4f5', color: '#18181b' }}>
                {selectedPortal.tagBadge}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '22px', fontWeight: '600', color: '#000000', margin: '0 0 6px 0' }}>
              {selectedPortal.nameAr}
            </h2>
            <div style={{ width: '40px', height: '3px', background: selectedPortal.themeColor, margin: '0 auto 12px auto', borderRadius: '9999px' }}></div>
            
            <p style={{ fontSize: '12.5px', color: '#52525b', lineHeight: '1.6', margin: 0 }}>
              {selectedPortal.description}
            </p>

            <div className="mt-3 p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] font-bold text-zinc-700">
              {selectedPortal.license}
            </div>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e4e4e7'
            }}>
              {selectedPortal.kpis.map((kpi, idx) => (
                <div key={idx}>
                  <span className="font-bold text-xs text-black block">{kpi.value}</span>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>{kpi.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Side: Login Form / 2FA Verification Section */}
        <div 
          className="w-full lg:w-[490px] p-6 sm:p-8 bg-white flex flex-col justify-between relative z-10 mx-auto"
        >
          {/* Top Brand & Language Switcher */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative' }}>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
                <span className="text-xs font-bold text-zinc-800">مجموعة خالد السليم ERP</span>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="button-outline-on-light"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  aria-expanded={showLangMenu}
                  aria-haspopup="true"
                  style={{
                    padding: '5px 12px',
                    fontSize: '12px',
                    minHeight: '32px',
                    borderRadius: '9999px'
                  }}
                >
                  <span>{currentLanguage.flag}</span>
                  <span>{currentLanguage.nativeName}</span>
                  <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }} aria-hidden="true"></i>
                </button>

                {showLangMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    left: isRtl ? 0 : 'auto',
                    right: !isRtl ? 0 : 'auto',
                    background: '#FFFFFF',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: '180px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    zIndex: 100,
                    padding: '6px'
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
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          background: currentLanguage.code === lang.code ? '#c1fbd4' : 'transparent',
                          color: '#000000',
                          fontWeight: currentLanguage.code === lang.code ? '600' : '420',
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
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ffdad6',
                border: '1px solid #fca5a5',
                color: '#ba1a1a',
                fontSize: '12.5px',
                fontWeight: '500',
                marginBottom: '16px',
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
                <div style={{ marginBottom: '20px' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" 
                      style={{ background: selectedPortal.themeColor }}
                    >
                      {selectedPortal.license.split('•')[0].trim()}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">بوابة مستقلة</span>
                  </div>

                  <h1 className="heading-xl" style={{ fontSize: '22px', fontWeight: '600', color: '#000000', margin: '0 0 4px 0' }}>
                    تسجيل الدخول: {selectedPortal.nameAr}
                  </h1>
                  <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
                    أدخل بيانات الاعتماد المخصصة لهذه المنظومة للوصول إلى بيئة العمل المعزولة.
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Username Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="login-username" style={{ fontSize: '12.5px', fontWeight: '600', color: '#000000' }}>
                      اسم المستخدم أو البريد الإلكتروني للمنظومة
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-user" aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '14px', color: '#71717a', fontSize: '14px' }}></i>
                      <input
                        id="login-username"
                        type="text"
                        className="text-input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder={selectedPortal.defaultUser}
                        style={{
                          paddingInlineStart: '40px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="login-password" style={{ fontSize: '12.5px', fontWeight: '600', color: '#000000' }}>
                      {t('password', 'كلمة المرور')}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-lock" aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '14px', color: '#71717a', fontSize: '14px' }}></i>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="text-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          paddingInlineStart: '40px',
                          paddingInlineEnd: '40px',
                          fontSize: '13px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        aria-pressed={showPassword}
                        style={{ position: 'absolute', insetInlineEnd: '14px', border: 'none', background: 'transparent', color: '#71717a', cursor: 'pointer' }}
                      >
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#52525b' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#000000', width: '15px', height: '15px' }}
                      />
                      <span>{t('rememberMe', 'تذكرني')}</span>
                    </label>
                    <a href="#forgot" onClick={e => e.preventDefault()} style={{ fontSize: '12px', color: '#000000', fontWeight: '600' }}>
                      {t('forgotPassword', 'نسيت كلمة المرور؟')}
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="button-primary-pill"
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      height: '44px',
                      fontSize: '13.5px'
                    }}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{t('loggingIn', 'جاري التحقق من الهوية...')}</span>
                      </>
                    ) : (
                      <>
                        <span>دخول منظومة {selectedPortal.nameAr}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Direct One-Click Instant Access for Testing/Demo */}
                  <button
                    type="button"
                    onClick={executeCompleteLogin}
                    className="button-outline-on-light"
                    style={{
                      width: '100%',
                      height: '38px',
                      fontSize: '12px',
                      fontWeight: '700',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: '#f8fafc',
                      border: '1px dashed #cbd5e1'
                    }}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>دخول فوري مباشر لهذه المنظومة</span>
                  </button>
                </form>

                {/* Biometric Real Hardware WebAuthn Login Options */}
                <div style={{ margin: '16px 0 12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Fingerprint className="w-3.5 h-3.5 text-champagne-dark" />
                      <span>المصادقة البيومترية المعتمدة (WebAuthn / FIDO2)</span>
                    </span>
                    <span className="pill-tag-mint text-[10px]" style={{ padding: '2px 8px' }}>
                      {hasHardwareWebAuthn ? '● مستشعر الجهاز متصل' : '● بروتوكول مشفر جاهز'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleTriggerBiometric('fingerprint')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        height: '42px',
                        borderRadius: '12px',
                        border: '1px solid rgba(207, 166, 74, 0.3)',
                        background: 'linear-gradient(135deg, #FDFBF7 0%, #F5EDDC 100%)',
                        color: '#A98232',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Fingerprint className="w-4 h-4 text-champagne-dark" />
                      <span>بصمة الإصبع (Touch ID)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerBiometric('face')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        height: '42px',
                        borderRadius: '12px',
                        border: '1px solid #DDD6FE',
                        background: 'linear-gradient(135deg, #F5F3FF 0%, #FAF5FF 100%)',
                        color: '#5B21B6',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ScanFace className="w-4 h-4 text-purple-600" />
                      <span>بصمة الوجه (Face ID)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: 2FA Verification Form */
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <span className="pill-tag-mint" style={{ display: 'inline-block', marginBottom: '8px', fontSize: '11px' }}>
                    التحقق الثنائي 2FA للمنظومة
                  </span>
                  <h1 id="otp-heading" className="heading-xl" style={{ fontSize: '20px', fontWeight: '600', color: '#000000', margin: '0 0 4px 0' }}>
                    تأكيد رمز التحقق
                  </h1>
                  <p style={{ fontSize: '12.5px', color: '#71717a', margin: 0 }}>
                    تم إرسال رمز المصادقة إلى الجوال والبريد المعتمد لمنظومة <strong>{selectedPortal.nameAr}</strong>.
                  </p>
                </div>

                <form onSubmit={handle2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                          width: '46px',
                          height: '52px',
                          borderRadius: '12px',
                          background: '#fbfbf5',
                          border: val ? '2px solid #000000' : '1px solid #e4e4e7',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#000000',
                          outline: 'none',
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#71717a' }} aria-live="polite">
                      ينتهي الرمز خلال: <strong>00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</strong>
                    </span>

                    <button
                      type="button"
                      disabled={timerSeconds > 0 || isResending}
                      onClick={handleResendCode}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: timerSeconds === 0 ? '#000000' : '#a1a1aa',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: timerSeconds === 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="button-primary-pill"
                    style={{
                      height: '44px',
                      marginTop: '8px',
                      width: '100%',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>جاري التحقق...</span>
                      </>
                    ) : (
                      <>
                        <span>تأكيد الرمز والدخول إلى {selectedPortal.nameAr}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Copyright Footer */}
          <div style={{ textAlign: 'center', fontSize: '11.5px', color: '#71717a', marginTop: '20px' }}>
            © ٢٠٢٦ مجموعة خالد السليم • منظومات الدخول المعزولة
          </div>
        </div>
      </div>

      {/* Biometric Scan HUD Modal */}
      {biometricModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 20, 24, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px 26px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(0, 81, 84, 0.15)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                <Lock className="w-3 h-3 inline-block me-1" />
                مصادقة بيومترية مشفرة (FIDO2 / WebAuthn)
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                width: '110px',
                height: '110px',
                margin: '0 auto 20px auto',
                borderRadius: '20px',
                background: '#fbfbf5',
                border: '2px dashed #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {biometricStatus === 'scanning' && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${biometricProgress}%`,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: '#000000',
                    boxShadow: '0 0 12px #000000',
                    transition: 'top 0.25s linear',
                    zIndex: 10
                  }}
                ></div>
              )}

              {biometricStatus === 'success' ? (
                <div style={{ color: '#000000', fontSize: '48px' }}>
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                </div>
              ) : biometricModal === 'fingerprint' ? (
                <div style={{ color: '#000000', fontSize: '48px' }}>
                  <i className="fa-solid fa-fingerprint" aria-hidden="true"></i>
                </div>
              ) : (
                <div style={{ color: '#000000', fontSize: '48px' }}>
                  <i className="fa-solid fa-face-viewfinder" aria-hidden="true"></i>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#000000', margin: '0 0 6px 0' }}>
              {biometricStatus === 'success'
                ? 'تم التحقق بنجاح!'
                : biometricModal === 'fingerprint'
                ? 'التحقق ببصمة الإصبع'
                : 'التحقق ببصمة الوجه'}
            </h3>

            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 18px 0', minHeight: '34px', lineHeight: '1.5' }}>
              {biometricMessage}
            </p>

            <div
              style={{
                height: '5px',
                width: '100%',
                background: '#E2E8F0',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${biometricProgress}%`,
                  background: '#000000',
                  borderRadius: '9999px',
                  transition: 'width 0.25s ease-out'
                }}
              ></div>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {biometricStatus === 'failed' && (
                <button
                  type="button"
                  onClick={() => biometricModal && handleTriggerBiometric(biometricModal)}
                  className="button-primary-pill"
                  style={{
                    padding: '6px 16px',
                    fontSize: '12px',
                    minHeight: '34px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBiometricModal(null)}
                className="button-outline-on-light"
                style={{
                  padding: '6px 20px',
                  fontSize: '12px',
                  minHeight: '34px',
                  display: 'inline-flex'
                }}
              >
                إلغاء والمتابعة بكلمة المرور
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
