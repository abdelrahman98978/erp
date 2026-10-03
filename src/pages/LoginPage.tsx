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
  FileCheck2,
  X,
  Compass,
  MapPin,
  CheckCircle
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
    themeColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #262626 0%, #171717 100%)',
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
  const [showPortalSelectorModal, setShowPortalSelectorModal] = useState(false);
  const [selectorModalCategory, setSelectorModalCategory] = useState<SystemPortalOption['category']>('شركات المجموعة');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleSelectPortal = (portal: SystemPortalOption) => {
    setSelectedPortal(portal);
    setSelectorModalCategory(portal.category);
    setUsername('');
    setPassword('');
    setLocalError(null);
    setShowPortalSelectorModal(false);
    localStorage.setItem('ALSULAIM_TARGET_SYSTEM', portal.id);
  };

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const mfaStepStartedRef = useRef(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
      setBiometricMessage('يرجى تسجيل الدخول أولاً لتأكيد الصلاحيات وربط مفتاح المرور البيومتري على هذا الجهاز.');
      return;
    }
    setBiometricModal(type);
    setBiometricStatus('scanning');
    setBiometricProgress(20);
    setBiometricMessage(
      type === 'fingerprint'
        ? 'يرجى لمس مستشعر البصمة البيومترية المعتمد على جهازك (Touch ID / Windows Hello)...'
        : 'يرجى توجيه الوجه أمام الكاميرا للمصادقة البيومترية (Face ID)...'
    );

    let currentP = 20;
    const progressInterval = setInterval(() => {
      currentP = Math.min(85, currentP + 12);
      setBiometricProgress(currentP);
      if (currentP >= 55) {
        setBiometricMessage('جاري التحقق من التشفير والمصادقة مع وحدة الأمان Secure Enclave...');
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
          ? `تم التحقق بنجاح عبر مفتاح الأمان البيومتري (${authResult.authenticatorType || 'Hardware'})!`
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
      setBiometricMessage(authResult.errorMessage || 'تعذّر التحقق البيومتري على هذا الجهاز. استخدم كلمة المرور.');
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
        setLocalError(error || 'تعذّر بدء تفعيل المصادقة الثنائية. تواصل مع إدارة النظام.');
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

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const effectiveUser = username.trim();
    const effectivePass = password.trim();

    if (!effectiveUser || !effectivePass) {
      setLocalError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور للمتابعة.');
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
      className="min-h-screen w-full flex flex-col justify-between bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden font-sans"
      style={{
        direction: currentLanguage.dir
      }}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* UBER SIGNATURE TRANSIT VECTOR MAP BACKGROUND                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.09]"
      >
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Uber Transit Vector Curves */}
          <path d="M-100 200 C 300 150, 600 450, 1100 350 S 1500 600, 1600 700" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M-50 450 C 400 350, 750 650, 1200 500 S 1650 300, 1700 400" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M200 -50 C 350 300, 650 350, 900 650 S 1300 850, 1500 1000" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M600 -50 L 600 950" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
          <path d="M1000 -50 L 1000 950" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
          <path d="M-50 300 L 1500 300" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
          <path d="M-50 650 L 1500 650" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
          {/* Hub Pins */}
          <circle cx="600" cy="300" r="4" fill="#FFFFFF" />
          <circle cx="1000" cy="500" r="4" fill="#FFFFFF" />
          <circle cx="900" cy="650" r="5" fill="#10B981" />
          <circle cx="900" cy="650" r="12" stroke="#10B981" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. UBER MINIMALIST TOP NAV                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="w-full z-20 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[#1A1A1A] bg-black/90 backdrop-blur-md">
        {/* Uber Bold Brandmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans select-none">
              ALSULAIM
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1F1F1F] text-neutral-300 border border-[#2B2B2B]">
              Enterprise
            </span>
          </div>
        </div>

        {/* Right Controls: Status & Language */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-neutral-200">Sovereign 256-bit</span>
          </div>

          {/* Uber Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#181818] border border-[#2B2B2B] text-white hover:bg-[#242424] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>{currentLanguage.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showLangMenu && (
              <div 
                className={`absolute top-11 ${isRtl ? 'left-0' : 'right-0'} bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-2xl p-1.5 z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-150`}
              >
                {LANGUAGES.map((lang: Language) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      currentLanguage.code === lang.code 
                        ? 'bg-white text-black font-extrabold' 
                        : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
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
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN UBER SPLIT/CENTERED CONTAINER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 z-10">
        <div 
          className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14"
          style={{
            flexDirection: isRtl ? 'row-reverse' : 'row'
          }}
        >
          {/* ════ LEFT COLUMN: UBER FOR BUSINESS HERO ════ */}
          <div className="hidden lg:flex flex-1 flex-col justify-center text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2A2A2A] text-xs font-bold text-neutral-300 w-fit mb-6">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>منظومة الحوكمة والتشغيل الموحدة</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.18] mb-4">
              إدارة العمليات المؤسسية بذكاء وسرعة.
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-lg mb-8">
              المنصة السحابية المتكاملة لمجموعة خالد السليم القابضة: عقود الاستقدام المعتمدة عبر مساند، الكوادر والتأجير المرن، الفوترة الإلكترونية ZATCA، وإدارة المنافسات.
            </p>

            {/* Uber Minimalist Stats Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1F1F1F]">
              <div>
                <span className="text-2xl font-black text-white font-mono block">1,420+</span>
                <span className="text-xs text-neutral-500 font-medium block mt-1">عقود استقدام مساند</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-mono block">99.98%</span>
                <span className="text-xs text-neutral-500 font-medium block mt-1">جاهزية المنظومة SLA</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-mono block">100%</span>
                <span className="text-xs text-neutral-500 font-medium block mt-1">امتثال ZATCA و HRSD</span>
              </div>
            </div>

            {/* Regulatory Badges (Uber Monochrome Style) */}
            <div className="flex items-center gap-3 mt-8 text-neutral-500 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>ZATCA Phase 2</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>مساند HRSD</span>
              </span>
              <span>•</span>
              <span className="text-neutral-400 font-bold">رؤية 2030</span>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: UBER SIGNATURE LOGIN CARD ════ */}
          <div className="w-full max-w-[440px] bg-[#0E0E0E] border border-[#242424] rounded-3xl p-7 sm:p-9 shadow-2xl relative">
            {/* Uber Subsidiary Selector Pill */}
            <div className="mb-6">
              <span className="text-[11px] font-bold text-neutral-400 block mb-2">
                المنظومة أو الشركة التابعة:
              </span>

              <button
                type="button"
                onClick={() => setShowPortalSelectorModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#161616] border border-[#2B2B2B] hover:border-neutral-500 transition-all text-start cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-bold">
                    {renderPortalIcon(selectedPortal.iconName, 'w-4 h-4')}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-white block truncate">
                      {selectedPortal.nameAr}
                    </span>
                    <span className="text-[10.5px] text-neutral-400 block truncate font-mono">
                      {selectedPortal.license.split('•')[0].trim()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-white transition-colors shrink-0">
                  <span>تغيير</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Error Notification */}
            {displayedError && (
              <div className="p-3.5 rounded-2xl bg-[#241212] border border-[#591C1C] text-red-200 text-xs font-medium mb-5 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="flex-1 leading-relaxed">{displayedError}</span>
              </div>
            )}

            {!is2FAStep ? (
              /* Uber Login Form */
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white m-0 tracking-tight">
                    تسجيل الدخول
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 m-0">
                    أدخل بيانات الاعتماد المعتمدة للوصول إلى حسابك المؤسسي
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label 
                      htmlFor="uber-username" 
                      className="block text-xs font-bold text-neutral-300 mb-1.5"
                    >
                      اسم المستخدم أو البريد الإلكتروني
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="uber-username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="user.name أو admin@alsulaim.com"
                        className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-white focus:bg-[#1C1C1C] text-white rounded-xl py-3 px-3.5 text-xs font-medium transition-all outline-none placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label 
                        htmlFor="uber-password" 
                        className="block text-xs font-bold text-neutral-300"
                      >
                        {t('password', 'كلمة المرور')}
                      </label>
                      <a 
                        href="#forgot" 
                        onClick={e => e.preventDefault()} 
                        className="text-xs text-neutral-400 hover:text-white font-medium transition-colors"
                      >
                        {t('forgotPassword', 'نسيت كلمة المرور؟')}
                      </a>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="uber-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-white focus:bg-[#1C1C1C] text-white rounded-xl py-3 px-3.5 text-xs font-mono transition-all outline-none placeholder:text-neutral-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        className={`absolute ${isRtl ? 'left-3' : 'right-3'} text-neutral-500 hover:text-white cursor-pointer transition-colors`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="uber-remember"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#181818] border-[#2B2B2B] text-black accent-white cursor-pointer"
                    />
                    <label htmlFor="uber-remember" className="text-xs text-neutral-400 cursor-pointer select-none">
                      {t('rememberMe', 'تذكر جلسة العمل على هذا الجهاز')}
                    </label>
                  </div>

                  {/* Primary Uber Action Button (Iconic Solid White) */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-[0.99] font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-white/10 mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>جاري المتابعة...</span>
                      </>
                    ) : (
                      <>
                        <span>متابعة</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Uber Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#262626]"></div>
                  </div>
                  <span className="relative px-3 bg-[#0E0E0E] text-xs font-bold text-neutral-500">
                    أو
                  </span>
                </div>

                {/* Uber Passkey / Biometrics Buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleTriggerBiometric('fingerprint')}
                    className="w-full h-11 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4 text-white" />
                    <span>متابعة باستخدام البصمة البيومترية (Passkey)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerBiometric('face')}
                    className="w-full h-11 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ScanFace className="w-4 h-4 text-white" />
                    <span>متابعة باستخدام بصمة الوجه (Face ID)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Uber 2FA TOTP Form */
              <div className="animate-in fade-in duration-200">
                <div className="mb-5">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    التحقق الثنائي TOTP
                  </span>
                  <h2 className="text-2xl font-black text-white m-0 tracking-tight">
                    أدخل رمز التحقق
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 m-0 leading-relaxed">
                    {enrollment || enrollLoading
                      ? 'امسح رمز QR بتطبيق المصادقة وأدخل الرمز المكون من 6 أرقام لتفعيل حسابك.'
                      : <>أدخل الرمز المتجدد للدخول إلى <strong>{selectedPortal.nameAr}</strong>.</>}
                  </p>
                </div>

                {enrollLoading && (
                  <div className="flex flex-col items-center justify-center p-6 bg-[#161616] rounded-2xl border border-[#2B2B2B] mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                    <span className="text-xs text-neutral-400 font-medium">جاري إنشاء مفتاح الأمان...</span>
                  </div>
                )}

                {enrollment && (
                  <div className="p-4 rounded-2xl bg-[#161616] border border-[#2B2B2B] flex flex-col items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-white shadow-xl">
                      <img
                        src={enrollment.qrCode}
                        alt="QR Code"
                        width={150}
                        height={150}
                        className="block rounded-lg"
                      />
                    </div>
                    <div className="text-center w-full">
                      <span className="text-[11px] text-neutral-400 block mb-1">أو أدخل المفتاح يدوياً:</span>
                      <div className="flex items-center justify-center gap-1.5">
                        <code 
                          dir="ltr"
                          className="px-2.5 py-1 rounded-lg bg-black border border-[#2B2B2B] text-neutral-200 font-mono text-xs select-all"
                        >
                          {enrollment.secret}
                        </code>
                        <button
                          type="button"
                          onClick={() => copySecretToClipboard(enrollment.secret)}
                          className="p-1.5 rounded-lg bg-[#242424] hover:bg-[#303030] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handle2FASubmit} className="space-y-4">
                  <div
                    role="group"
                    aria-label="أرقام رمز التحقق"
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
                            ? 'bg-[#181818] border-2 border-white text-white' 
                            : 'bg-[#161616] border border-[#2B2B2B] text-neutral-400 focus:border-neutral-400'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-neutral-500 text-[11px]">
                      يتجدد الرمز تلقائياً كل 30 ثانية
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelMfa}
                      disabled={submitting}
                      className="text-neutral-400 hover:text-white font-semibold underline cursor-pointer"
                    >
                      إلغاء والعودة
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || enrollLoading}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-[0.99] font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>جاري التحقق...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-black" />
                        <span>تأكيد الرمز والمتابعة</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Uber Legal Disclaimer Footer */}
            <div className="pt-6 mt-6 border-t border-[#1F1F1F]">
              <p className="text-[10.5px] text-neutral-500 leading-relaxed text-center m-0">
                بمتابعة تسجيل الدخول، فإنك تؤكد التزامك بسياسة الأمن السيبراني وحوكمة البيانات المعتمدة لدى مجموعة خالد السليم القابضة.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. UBER BOTTOM FOOTER                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="w-full z-20 px-6 sm:px-12 py-5 border-t border-[#1A1A1A] bg-black text-neutral-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>© 2026 مجموعة خالد السليم القابضة. جميع الحقوق محفوظة.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#privacy" onClick={e => e.preventDefault()} className="hover:text-neutral-300 transition-colors">الخصوصية وحماية البيانات</a>
          <a href="#terms" onClick={e => e.preventDefault()} className="hover:text-neutral-300 transition-colors">شروط الخدمة</a>
          <a href="#security" onClick={e => e.preventDefault()} className="hover:text-neutral-300 transition-colors">معايير الأمان</a>
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UBER SUBSIDIARY SELECTOR MODAL (Pure Charcoal & Clean Cards)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPortalSelectorModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPortalSelectorModal(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#121212] border border-[#2B2B2B] rounded-3xl p-6 sm:p-7 shadow-2xl relative text-white"
            dir={currentLanguage.dir}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242424]">
              <div>
                <h3 className="text-lg font-black text-white m-0">
                  اختر المنظومة أو الشركة التابعة
                </h3>
                <p className="text-xs text-neutral-400 m-0 mt-0.5">
                  حدد مساحة العمل التشغيلية لتسجيل الدخول المباشر إليها
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPortalSelectorModal(false)}
                className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#2B2B2B] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Uber Segmented Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1A1A1A] rounded-xl border border-[#262626] mb-4">
              {(['شركات المجموعة', 'البوابات الرقمية', 'الإدارة والسيطرة'] as const).map(cat => {
                const isCatActive = selectorModalCategory === cat;
                const count = SYSTEM_PORTALS.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectorModalCategory(cat)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCatActive
                        ? 'bg-white text-black shadow-sm font-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isCatActive ? 'bg-neutral-200 text-black' : 'bg-[#262626] text-neutral-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Portals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {SYSTEM_PORTALS.filter(p => p.category === selectorModalCategory).map(portal => {
                const isCurrent = selectedPortal.id === portal.id;
                return (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => handleSelectPortal(portal)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-start transition-all cursor-pointer relative ${
                      isCurrent
                        ? 'bg-[#1F1F1F] border-white text-white'
                        : 'bg-[#161616] border-[#242424] hover:border-neutral-500 hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {renderPortalIcon(portal.iconName, 'w-4 h-4')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white truncate block">
                          {portal.nameAr}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[10.5px] text-neutral-400 block truncate">
                        {portal.license}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UBER BIOMETRIC MODAL                                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {biometricModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-[#121212] border border-[#2B2B2B] rounded-3xl p-7 sm:p-8 shadow-2xl text-center relative text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1F1F1F] text-neutral-300 border border-[#2B2B2B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>مصادقة مشفرة WebAuthn / FIDO2</span>
              </span>
            </div>

            <div className="relative w-24 h-24 mx-auto my-5 rounded-2xl bg-[#181818] border border-[#2B2B2B] flex items-center justify-center overflow-hidden">
              {biometricStatus === 'scanning' && (
                <div
                  className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_12px_#ffffff] transition-all duration-300"
                  style={{ top: `${biometricProgress}%` }}
                />
              )}

              {biometricStatus === 'success' ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in-50 duration-300" />
              ) : biometricStatus === 'failed' ? (
                <AlertCircle className="w-12 h-12 text-red-400 animate-in shake duration-300" />
              ) : biometricModal === 'fingerprint' ? (
                <Fingerprint className="w-12 h-12 text-white animate-pulse" />
              ) : (
                <ScanFace className="w-12 h-12 text-white animate-pulse" />
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

            <p className="text-xs text-neutral-400 mb-5 leading-relaxed min-h-[36px]">
              {biometricMessage}
            </p>

            <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden mb-6">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  biometricStatus === 'failed' ? 'bg-red-500' : 'bg-white'
                }`}
                style={{ width: `${biometricProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              {biometricStatus === 'failed' && (
                <button
                  type="button"
                  onClick={() => biometricModal && handleTriggerBiometric(biometricModal)}
                  className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBiometricModal(null)}
                className="px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#2B2B2B] text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
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
