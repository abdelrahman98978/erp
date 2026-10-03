import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/languages';
import { useAuthContext } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { CompanyId } from '../types';
import type { MfaRequirement, TotpEnrollment } from '../services/authService';
import { 
  Loader2, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  Globe, 
  Users, 
  CheckCircle2, 
  Lock, 
  ArrowLeft,
  ArrowRight,
  Briefcase,
  UserCheck,
  Fingerprint,
  ScanFace,
  Hotel,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  Check,
  User,
  Copy,
  Shield,
  KeyRound,
  CheckCircle
} from 'lucide-react';
import { performRealBiometricAuth, checkWebAuthnSupport, BiometricAuthResult } from '../services/webAuthnBiometricService';
import { SaudiAssistantMascot } from '../components/auth/SaudiAssistantMascot';

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
    themeColor: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    description: 'بوابة إدارة عقود استقدام الأفراد، إصدار التأشيرات، توثيق مساند، وبوالص التأمين.',
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
    themeColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    description: 'بوابة عقود وباقات تأجير الكوادر المهنية والعمالة المنزلية وخدمات قطاع الأعمال.',
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
    themeColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    description: 'منظومة التوظيف والفرز الذكي ATS، استيراد السير بالدفعة، وشبكة المكاتب الدولية.',
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
    nameAr: 'بوابة شركة كاس للمنافسات والتشغيل',
    nameEn: 'KAS Trading & Etmad Enterprise Suite',
    category: 'البوابات الرقمية',
    license: 'سجل تجاري 1010789234 • ضريبي 310284759200003',
    tagBadge: 'بوابة مستقلة ومنفصلة',
    iconName: 'Briefcase',
    themeColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    description: 'بوابة مستقلة ومعزولة كلياً لإدارة منافسات اعتماد، جداول الكميات الذكية BOQ، الفوترة المشفرة ZATCA، وسجل الموردين.',
    targetTab: 'kas-suite',
    targetTitle: 'البوابة المستقلة لشركة كاس (KAS Suite)',
    kpis: [
      { label: 'منافسات اعتماد', value: '2,651+' },
      { label: 'فواتير ZATCA', value: '106k+ ر.س' },
      { label: 'عزل البيانات', value: '100% معزول' }
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
    themeColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    description: 'بوابة عملاء الاستقدام والتأجير: تتبع مراحل القدوم، سداد الفواتير ZATCA، وبوالص التأمين.',
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
    themeColor: '#6366f1',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    description: 'بوابة المكاتب المعتمدة دولياً لرفع السير الذاتية بالدفعة ومطابقة الحسابات المالية.',
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
    themeColor: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    description: 'بوابة مدراء المبيعات والمتاجر: تزامن الطلبات، الباقات الرقمية، وبوابات الدفع الإلكتروني.',
    targetTab: 'smacc-modules',
    targetTitle: 'ربط وتزامن المتاجر الإلكترونية',
    kpis: [
      { label: 'متاجر متصلة', value: '5 متاجر' },
      { label: 'طلبات مستلمة', value: '1,026' },
      { label: 'استجابة Webhook', value: '<800ms' }
    ]
  },
  {
    id: 'shelter',
    key: 'shelter',
    companyId: 'SAF',
    nameAr: 'بوابة مراكز الإيواء والتسكين والرعاية',
    nameEn: 'Shelter, Housing & Care Suite (HRSD)',
    category: 'البوابات الرقمية',
    license: 'ترخيص مراكز الإيواء والضيافة HRSD-MOL',
    tagBadge: 'منظومة الإيواء المستقلة',
    iconName: 'Hotel',
    themeColor: '#14b8a6',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    description: 'بوابة مشرفات ومشرفي الإيواء: إدارة الغرف والأسرة، التغذية، الفحص الطبي، والترحيل المستقل.',
    targetTab: 'shelter-suite',
    targetTitle: 'منظومة وبوابة مراكز الإيواء والتسكين المستقلة',
    kpis: [
      { label: 'طاقة استيعابية', value: '120 سرير' },
      { label: 'نزيلات حالياً', value: '44 نزيلة' },
      { label: 'معايير HRSD', value: '100% امتثال' }
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
    themeColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    description: 'مركز القيادة الموحد: حوكمة الشركات الـ 4، الصلاحيات IAM، المؤشرات المالية، وسجل النشاط.',
    targetTab: 'admin-dashboard',
    targetTitle: 'لوحة تحكم الإدارة والسيطرة المركزية',
    kpis: [
      { label: 'الشركات التابعة', value: '4 شركات' },
      { label: 'الأمان والامتثال', value: '100% ZATCA' },
      { label: 'مستخدمين نشطين', value: '450+' }
    ]
  }
];

const renderPortalIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case 'Building2': return <Building2 className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Store': return <Store className={className} />;
    case 'Hotel': return <Hotel className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    default: return <Building2 className={className} />;
  }
};

interface LoginPageProps {
  onLoginSuccess: (targetTab?: string, targetTitle?: string, targetCompanyId?: CompanyId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const {
    signIn,
    verifyMfa,
    enrollMfa,
    signOut,
    session,
    isAuthenticated,
    mfaRequirement,
    error: authError,
  } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const { setActiveCompanyId } = useCompany();
  const { setActiveTab } = useAppStore();

  const getInitialPortal = (): SystemPortalOption => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramSystem = urlParams.get('system') || localStorage.getItem('ALSULAIM_TARGET_SYSTEM');
    if (paramSystem) {
      const match = SYSTEM_PORTALS.find(p => p.id.toLowerCase() === paramSystem.toLowerCase() || p.key.toLowerCase() === paramSystem.toLowerCase());
      if (match) return match;
    }
    return SYSTEM_PORTALS[0];
  };

  const initialPortal = getInitialPortal();
  const [selectedPortal, setSelectedPortal] = useState<SystemPortalOption>(initialPortal);
  const [selectedCategory, setSelectedCategory] = useState<SystemPortalOption['category']>(initialPortal.category);

  useEffect(() => {
    if (selectedPortal && selectedPortal.category !== selectedCategory) {
      setSelectedCategory(selectedPortal.category);
    }
  }, [selectedPortal]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleSelectPortal = (portal: SystemPortalOption) => {
    setSelectedPortal(portal);
    setSelectedCategory(portal.category);
    setUsername('');
    setPassword('');
    setLocalError(null);
    localStorage.setItem('ALSULAIM_TARGET_SYSTEM', portal.id);
  };

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const mfaStepStartedRef = useRef(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Biometric Authentication States (WebAuthn / FIDO2)
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
    if (!isAuthenticated) {
      setBiometricModal(type);
      setBiometricProgress(100);
      setBiometricStatus('failed');
      setBiometricMessage('سجّل الدخول بكلمة المرور ورمز التحقق أولاً، ثم يمكنك استخدام البصمة لفتح الجلسة على هذا الجهاز.');
      return;
    }
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

    const authResult: BiometricAuthResult = await performRealBiometricAuth(
      username || '',
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
      setBiometricProgress(100);
      setBiometricStatus('failed');
      setBiometricMessage(authResult.errorMessage || 'تعذّر التحقق البيومتري على هذا الجهاز. استخدم كلمة المرور ورمز التحقق.');
    }
  };

  const beginMfaStep = async (req: MfaRequirement) => {
    if (mfaStepStartedRef.current) return;
    mfaStepStartedRef.current = true;
    setIs2FAStep(true);
    setOtpValues(['', '', '', '', '', '']);
    setEnrollment(null);
    if (req === 'enroll') {
      setEnrollLoading(true);
      const { data, error } = await enrollMfa();
      setEnrollLoading(false);
      if (error || !data) {
        setLocalError(error || 'تعذّر بدء تفعيل المصادقة الثنائية. تواصل مع مسؤول النظام.');
        return;
      }
      setEnrollment(data);
    }
    setTimeout(() => otpInputsRef.current[0]?.focus(), 50);
  };

  useEffect(() => {
    if (session?.user && mfaRequirement !== 'none' && !is2FAStep) {
      void beginMfaStep(mfaRequirement);
    }
  }, [session, mfaRequirement]);

  const handleCancelMfa = async () => {
    await signOut();
    mfaStepStartedRef.current = false;
    setIs2FAStep(false);
    setEnrollment(null);
    setOtpValues(['', '', '', '', '', '']);
    setPassword('');
    setLocalError(null);
  };

  // 3D Canvas Background Initialization
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

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xd97706, 1.2);
      directionalLight.position.set(6, 6, 6);
      scene.add(directionalLight);

      const colorInt = parseInt(selectedPortal.themeColor.replace('#', '0x')) || 0x10b981;
      const starGeometry = new THREE.IcosahedronGeometry(4.2, 0);
      const positionAttribute = starGeometry.getAttribute('position');
      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(positionAttribute, i);
          if (Math.random() > 0.45) {
            vertex.multiplyScalar(1.4);
          }
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
      }

      const wireframeMaterial = new THREE.MeshPhongMaterial({
        color: colorInt,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      const starMesh = new THREE.Mesh(starGeometry, wireframeMaterial);
      scene.add(starMesh);

      const coreGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0x059669,
        emissive: colorInt,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.65
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      const particlesCount = 220;
      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 16;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.07,
        color: colorInt,
        transparent: true,
        opacity: 0.7,
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

        starMesh.rotation.y += 0.004;
        starMesh.rotation.x += 0.0025;
        core.rotation.y -= 0.003;

        const pulse = 1 + Math.sin(time * 2) * 0.04;
        starMesh.scale.set(pulse, pulse, pulse);
        coreMat.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.25;

        particleMesh.rotation.y += 0.0008;
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
        const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.012;
        if (visualCardRef.current) {
          visualCardRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
        if (starMesh) {
          starMesh.rotation.z = (e.clientX / window.innerWidth - 0.5) * 0.25;
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

    const effectiveUser = username.trim();
    const effectivePass = password.trim();

    if (!effectiveUser || !effectivePass) {
      setLocalError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn(effectiveUser, effectivePass);
      if (!result.success) {
        setLocalError(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق من صحة البيانات.');
        return;
      }
      setPassword('');
      if (result.mfa && result.mfa !== 'none') {
        await beginMfaStep(result.mfa);
      } else {
        executeCompleteLogin();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      setLocalError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyMfa(otpCode, enrollment?.factorId);
      if (!result.success) {
        setLocalError(result.error || 'رمز التحقق غير صحيح أو منتهي الصلاحية.');
        setOtpValues(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
        return;
      }
      setEnrollment(null);
      mfaStepStartedRef.current = false;
      setIs2FAStep(false);
      executeCompleteLogin();
    } finally {
      setSubmitting(false);
    }
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

  const copySecretToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const isRtl = currentLanguage.dir === 'rtl';
  const displayedError = authError || localError;

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-5 md:p-8 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white"
      style={{
        background: 'radial-gradient(ellipse at 50% 10%, #0d1a29 0%, #080f18 45%, #03070d 100%)',
        fontFamily: 'var(--font-family-ui)',
        direction: currentLanguage.dir
      }}
    >
      {/* Decorative Royal Ambient Glow Orbs */}
      <div 
        className="absolute top-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full pointer-events-none opacity-25 blur-[120px]"
        style={{ background: selectedPortal.themeColor }}
      />
      <div 
        className="absolute bottom-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full pointer-events-none opacity-20 blur-[130px] bg-emerald-600"
      />

      {/* Subtle Geometric Enterprise Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP DEDICATED SYSTEM PORTAL SELECTOR RIBBON */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl xl:max-w-7xl mb-4 sm:mb-6 z-20 relative">
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl">
          {/* Header Row: Category Filter and Quick Status */}
          <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                منظومات الدخول المستقلة للمجموعة:
              </span>
            </div>

            {/* Segmented Category Buttons */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/70">
              {(['شركات المجموعة', 'البوابات الرقمية', 'الإدارة والسيطرة'] as const).map((cat) => {
                const count = SYSTEM_PORTALS.filter(p => p.category === cat).length;
                const isCatActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      const firstInCat = SYSTEM_PORTALS.find(p => p.category === cat);
                      if (firstInCat) handleSelectPortal(firstInCat);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      isCatActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isCatActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Portals Grid */}
          <div className={`grid gap-2 ${
            selectedCategory === 'شركات المجموعة'
              ? 'grid-cols-1 sm:grid-cols-3'
              : selectedCategory === 'البوابات الرقمية'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
              : 'grid-cols-1 max-w-lg mx-auto'
          }`}>
            {SYSTEM_PORTALS.filter(p => p.category === selectedCategory).map((portal) => {
              const isCurrent = selectedPortal.id === portal.id;
              return (
                <button
                  key={portal.id}
                  type="button"
                  dir={currentLanguage.dir}
                  onClick={() => handleSelectPortal(portal)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  {isCurrent && (
                    <div 
                      className="absolute top-0 right-0 left-0 h-[2.5px] transition-all"
                      style={{ background: portal.themeColor }} 
                    />
                  )}
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                    style={{
                      background: `${portal.themeColor}22`,
                      color: portal.themeColor,
                      border: `1px solid ${portal.themeColor}44`
                    }}
                  >
                    {renderPortalIcon(portal.iconName, 'w-3.5 h-3.5')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-100 truncate">{portal.nameAr}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">{portal.license}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN LOGIN CARD CONTAINER (Executive Split Layout) */}
      {/* ========================================================================= */}
      <div 
        className="w-full max-w-6xl xl:max-w-7xl rounded-3xl backdrop-blur-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10"
        style={{
          flexDirection: isRtl ? 'row-reverse' : 'row',
        }}
      >
        {/* Right Side: Visual Hero & 3D Interactive Mascot Dossier */}
        <div 
          className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-8 xl:p-10 border-inline-end border-slate-800/70 min-h-[660px]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, rgba(8, 14, 24, 0.9) 100%)'
          }}
        >
          {/* Three.js Interactive Wireframe Canvas */}
          <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-60 pointer-events-none z-0"
          />

          {/* Hero Centerpiece: Mascot + Floating Glass Company Dossier */}
          <div className="relative z-10 w-full flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8">
            {/* Mascot */}
            <div className="shrink-0 drop-shadow-2xl">
              <SaudiAssistantMascot selectedPortal={selectedPortal} isRtl={isRtl} />
            </div>

            {/* Executive Glass Dossier Card */}
            <div
              ref={visualCardRef}
              className="max-w-[370px] w-full p-6 rounded-2xl backdrop-blur-xl bg-slate-950/75 border border-slate-700/60 shadow-2xl text-center relative overflow-hidden"
              style={{
                boxShadow: `0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 30px -10px ${selectedPortal.themeColor}33`
              }}
            >
              {/* Portal Icon Stamp */}
              <div className="flex justify-center mb-3">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform duration-300 hover:scale-105"
                  style={{
                    background: selectedPortal.gradient || selectedPortal.themeColor,
                    boxShadow: `0 10px 25px -5px ${selectedPortal.themeColor}66`
                  }}
                >
                  {selectedPortal.id === 'admin' ? <ShieldCheck className="w-8 h-8" /> :
                   selectedPortal.id === 'client' ? <UserCheck className="w-8 h-8" /> :
                   selectedPortal.id === 'agent' ? <Globe className="w-8 h-8" /> :
                   selectedPortal.id === 'shelter' ? <Hotel className="w-8 h-8" /> :
                   selectedPortal.id === 'ecommerce' ? <Store className="w-8 h-8" /> :
                   selectedPortal.id === 'kas' ? <Briefcase className="w-8 h-8" /> :
                   <Building2 className="w-8 h-8" />}
                </div>
              </div>

              {/* Tag Badge */}
              <div className="mb-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold inline-block border"
                  style={{
                    background: `${selectedPortal.themeColor}18`,
                    color: selectedPortal.themeColor,
                    borderColor: `${selectedPortal.themeColor}40`
                  }}
                >
                  {selectedPortal.tagBadge}
                </span>
              </div>

              {/* Company Title */}
              <h2 className="text-xl font-bold text-white mb-1.5" style={{ fontFamily: 'var(--font-family-display)' }}>
                {selectedPortal.nameAr}
              </h2>
              <div 
                className="w-12 h-1 mx-auto mb-3 rounded-full" 
                style={{ background: selectedPortal.themeColor }}
              />

              <p className="text-xs text-slate-300 leading-relaxed m-0">
                {selectedPortal.description}
              </p>

              <div className="mt-3 p-2 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300">
                {selectedPortal.license}
              </div>

              {/* Live Metric Counters */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-800/80">
                {selectedPortal.kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="font-extrabold text-xs text-white block font-mono">{kpi.value}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{kpi.label}</span>
                  </div>
                ))}
              </div>

              {/* Compliance Trust Seal */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ZATCA Phase 2</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-sky-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مساند HRSD</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-bold">رؤية 2030</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Luxury Form & Authentication Panel */}
        <div className="w-full lg:w-[500px] p-6 sm:p-9 bg-slate-950/90 flex flex-col justify-between relative z-10 mx-auto">
          <div>
            {/* Brand Header & Language Selector */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/70">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-950/60">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">مجموعة خالد السليم ERP</span>
                  <span className="text-[10px] text-emerald-400 font-mono">SECURE ENTERPRISE GATE</span>
                </div>
              </div>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  aria-expanded={showLangMenu}
                  aria-haspopup="true"
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <span>{currentLanguage.flag}</span>
                  <span className="font-semibold">{currentLanguage.nativeName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showLangMenu && (
                  <div 
                    className="absolute top-10 left-0 right-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-150"
                  >
                    {LANGUAGES.map((lang: Language) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-right px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentLanguage.code === lang.code 
                            ? 'bg-emerald-600 text-white font-bold' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Notification Banner */}
            {displayedError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-medium mb-5 flex items-center gap-2.5 shadow-lg shadow-red-950/40">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="flex-1">{displayedError}</span>
              </div>
            )}

            {!is2FAStep ? (
              /* Step 1: Standard Username & Password Form */
              <div>
                {/* Active Portal Header */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider" 
                      style={{ background: selectedPortal.themeColor }}
                    >
                      {selectedPortal.license.split('•')[0].trim()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">بوابة دخول آمنة</span>
                  </div>

                  <h1 className="text-xl font-bold text-white m-0" style={{ fontFamily: 'var(--font-family-display)' }}>
                    تسجيل الدخول: {selectedPortal.nameAr}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 m-0">
                    أدخل بيانات الاعتماد المعتمدة للوصول إلى مساحة العمل التشغيلية المعزولة.
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-4">
                  {/* Username Input */}
                  <div>
                    <label 
                      htmlFor="login-username" 
                      className="block text-xs font-bold text-slate-300 mb-1.5"
                    >
                      اسم المستخدم أو البريد الإلكتروني المعتمد
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="login-username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="user.name أو username@alsulaim.sa"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-xl py-2.5 pr-10 pl-3.5 text-xs transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs font-bold text-slate-300 mb-1.5"
                    >
                      {t('password', 'كلمة المرور')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-xl py-2.5 pr-10 pl-10 text-xs transition-all outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0"
                      />
                      <span>{t('rememberMe', 'تذكرني على هذا الجهاز')}</span>
                    </label>
                    <a 
                      href="#forgot" 
                      onClick={e => e.preventDefault()} 
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {t('forgotPassword', 'نسيت كلمة المرور؟')}
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري التحقق من الهوية والصلاحيات...</span>
                      </>
                    ) : (
                      <>
                        <span>دخول {selectedPortal.nameAr.startsWith('بوابة') ? selectedPortal.nameAr : `منظومة ${selectedPortal.nameAr}`}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Biometric FIDO2 / WebAuthn Hardware Chips */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                      <span>المصادقة البيومترية المعتمدة (FIDO2 / WebAuthn)</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
                      {hasHardwareWebAuthn ? '● متصل بالأمان' : '● بروتوكول جاهز'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleTriggerBiometric('fingerprint')}
                      className="flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/70 text-amber-300 hover:bg-slate-850 text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Fingerprint className="w-4 h-4 text-amber-400" />
                      <span>بصمة الإصبع</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerBiometric('face')}
                      className="flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/70 text-purple-300 hover:bg-slate-850 text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <ScanFace className="w-4 h-4 text-purple-400" />
                      <span>بصمة الوجه</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: 2FA TOTP Form */
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-1.5">
                    المصادقة الثنائية الإلزامية 2FA
                  </span>
                  <h1 className="text-xl font-bold text-white m-0" style={{ fontFamily: 'var(--font-family-display)' }}>
                    {enrollment || enrollLoading ? 'تفعيل المصادقة الثنائية للمرة الأولى' : 'تأكيد رمز التحقق (TOTP)'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 m-0 leading-relaxed">
                    {enrollment || enrollLoading
                      ? 'امسح رمز QR بتطبيق المصادقة (Google Authenticator أو Microsoft Authenticator) وأدخل الرمز لتأمين حسابك.'
                      : <>أدخل الرمز المتجدد من تطبيق المصادقة للدخول إلى <strong>{selectedPortal.nameAr}</strong>.</>}
                  </p>
                </div>

                {enrollLoading && (
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800 mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                    <span className="text-xs text-slate-400 font-medium">جاري إنشاء وتجهيز مفتاح المصادقة الثنائية...</span>
                  </div>
                )}

                {enrollment && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-white shadow-xl">
                      <img
                        src={enrollment.qrCode}
                        alt="QR Code"
                        width={160}
                        height={160}
                        className="block rounded-lg"
                      />
                    </div>
                    <div className="text-center w-full">
                      <span className="text-[11px] text-slate-400 block mb-1">أو أدخل المفتاح السري يدوياً:</span>
                      <div className="flex items-center justify-center gap-1.5">
                        <code 
                          dir="ltr"
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs select-all tracking-wider"
                        >
                          {enrollment.secret}
                        </code>
                        <button
                          type="button"
                          onClick={() => copySecretToClipboard(enrollment.secret)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="نسخ المفتاح"
                        >
                          {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {copiedSecret && <span className="text-[10px] text-emerald-400 mt-1 block">تم النسخ إلى الحافظة</span>}
                    </div>
                  </div>
                )}

                <form onSubmit={handle2FASubmit} className="space-y-4">
                  <div
                    role="group"
                    aria-label="أرقام المصادقة الثنائية"
                    className="flex gap-2 justify-center"
                    dir="ltr"
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
                        aria-label={`الرقم ${idx + 1}`}
                        value={val}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-14 rounded-xl text-center text-xl font-bold font-mono transition-all outline-none ${
                          val 
                            ? 'bg-slate-900 border-2 border-emerald-500 text-white shadow-lg shadow-emerald-950/60' 
                            : 'bg-slate-950 border border-slate-800 text-slate-300 focus:border-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 text-[11px]">
                      يتجدد الرمز تلقائياً كل 30 ثانية في هاتفك
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelMfa}
                      disabled={submitting}
                      className="text-slate-400 hover:text-white font-semibold underline cursor-pointer"
                    >
                      إلغاء والعودة
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || enrollLoading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري التحقق من الرمز...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>تأكيد الرمز والدخول إلى {selectedPortal.nameAr}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer Security Badges */}
          <div className="pt-6 mt-6 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
            <span>© ٢٠٢٦ مجموعة خالد السليم القابضة</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>اتصال مشفر 256-bit TLS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Biometric Scan HUD Modal (Futuristic Security Radar) */}
      {biometricModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Top Security Pill */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>مصادقة مشفرة WebAuthn / FIDO2</span>
              </span>
            </div>

            {/* Scanner Target */}
            <div className="relative w-28 h-28 mx-auto my-5 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
              {biometricStatus === 'scanning' && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] transition-all duration-300"
                  style={{ top: `${biometricProgress}%` }}
                />
              )}

              {biometricStatus === 'success' ? (
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-50 duration-300" />
              ) : biometricStatus === 'failed' ? (
                <AlertCircle className="w-14 h-14 text-red-400 animate-in shake duration-300" />
              ) : biometricModal === 'fingerprint' ? (
                <Fingerprint className="w-14 h-14 text-amber-400 animate-pulse" />
              ) : (
                <ScanFace className="w-14 h-14 text-purple-400 animate-pulse" />
              )}
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {biometricStatus === 'success'
                ? 'تم التحقق البيومتري بنجاح!'
                : biometricStatus === 'failed'
                ? 'تعذر التحقق البيومتري'
                : biometricModal === 'fingerprint'
                ? 'جاري فحص بصمة الإصبع...'
                : 'جاري فحص بصمة الوجه...'}
            </h3>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed min-h-[36px]">
              {biometricMessage}
            </p>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  biometricStatus === 'failed' ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${biometricProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              {biometricStatus === 'failed' && (
                <button
                  type="button"
                  onClick={() => biometricModal && handleTriggerBiometric(biometricModal)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/60"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBiometricModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إغلاق والمتابعة بكلمة المرور
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
