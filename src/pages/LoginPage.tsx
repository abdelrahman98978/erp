import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/languages';
import { useAuthContext } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { CompanyId } from '../types';
import type { MfaRequirement, TotpEnrollment } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import {
  Loader2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  Check,
  Copy,
  Shield,
  Globe,
  Building2,
  Fingerprint,
  Headphones,
  X,
  PhoneCall,
  MessageSquare,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  LogIn,
  User,
  Phone,
  CreditCard,
  Sparkles,
  KeyRound,
  Activity,
  Home,
} from 'lucide-react';
import {
  performRealBiometricAuth,
  checkWebAuthnSupport,
  BiometricAuthResult,
} from '../services/webAuthnBiometricService';

export interface SystemPortalOption {
  id: string;
  key: string;
  nameAr: string;
  nameEn: string;
  companyId: CompanyId;
  category: 'شركات المجموعة' | 'البوابات الرقمية' | 'الإدارة والسيطرة';
  license: string;
  sectorTagAr?: string;
  themeColor: string;
  emailDomain: string;
  routePath: string;
  gradient?: string;
  logoUrl?: string;
  targetTab: string;
  targetTitle: string;
}

export const SYSTEM_PORTALS: SystemPortalOption[] = [
  {
    id: 'saf',
    key: 'saf',
    companyId: 'SAF',
    nameAr: 'شركة السفير الماسي للاستقدام',
    nameEn: 'Al-Safeer Al-Masi Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC01 • س.ت 1010123456',
    sectorTagAr: 'استقدام العمالة المنزلية والمهنية',
    themeColor: '#0284c7',
    emailDomain: 'saf-rec.sa',
    routePath: '/login/saf',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'recruitment-contracts',
    targetTitle: 'عقود استقدام مساند - شركة السفير الماسي',
  },
  {
    id: 'yaq',
    key: 'yaq',
    companyId: 'YAQ',
    nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    nameEn: 'Yaqoot Eastern Operation & Rental Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC02 • س.ت 1010543210',
    sectorTagAr: 'باقات التأجير المرن بالساعة والشهر',
    themeColor: '#e11d48',
    emailDomain: 'yaqoot-ops.sa',
    routePath: '/login/yaq',
    logoUrl: '/logos/yaqoot.png',
    targetTab: 'rent-contracts',
    targetTitle: 'عقود التأجير والتشغيل - شركة الياقوت',
  },
  {
    id: 'top',
    key: 'top',
    companyId: 'TOP',
    nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
    nameEn: 'Top Talent ATS & Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC03 • س.ت 1010776543',
    sectorTagAr: 'استقطاب الكفاءات التنفيذية والتوظيف',
    themeColor: '#7c3aed',
    emailDomain: 'topaz-rec.sa',
    routePath: '/login/top',
    logoUrl: '/logos/topaz.png',
    targetTab: 'ats-pipeline',
    targetTitle: 'منظومة ATS والفرز الوظيفي - توب تالنت',
  },
  {
    id: 'kas',
    key: 'kas',
    companyId: 'KAS',
    nameAr: 'بوابة شركة كاس للمنافسات والتشغيل',
    nameEn: 'KAS Trading & Etmad Enterprise Suite',
    category: 'شركات المجموعة',
    license: 'سجل تجاري 1010789234 • ضريبي 310284759200003',
    sectorTagAr: 'منافسات اعتماد وجداول الكميات BOQ',
    themeColor: '#d97706',
    emailDomain: 'kas-etimad.sa',
    routePath: '/login/kas',
    logoUrl: '/logo.png',
    targetTab: 'kas-suite',
    targetTitle: 'البوابة المستقلة لشركة كاس (KAS Suite)',
  },
  {
    id: 'shelter',
    key: 'shelter',
    companyId: 'DAR',
    nameAr: 'دار الرواد لمراكز الإيواء والتسكين والرعاية',
    nameEn: 'Dar Al-Ruwad Shelter, Housing & Care Suite (HRSD)',
    category: 'شركات المجموعة',
    license: 'ترخيص مراكز الإيواء HRSD-MOL • س.ت 1010642918',
    sectorTagAr: 'إدارة الإيواء والإعاشة والترحيل النظامي',
    themeColor: '#0d9488',
    emailDomain: 'alruwad.sa',
    routePath: '/login/shelter',
    logoUrl: '/logos/ruwad.png',
    targetTab: 'shelter-suite',
    targetTitle: 'منظومة وبوابة مراكز الإيواء والتسكين المستقلة',
  },
  {
    id: 'admin',
    key: 'admin',
    companyId: 'all',
    nameAr: 'الإدارة المركزية والسيطرة العليا',
    nameEn: 'Executive Command & Super Admin',
    category: 'الإدارة والسيطرة',
    license: 'مجموعة خالد السليم القابضة الموحدة',
    sectorTagAr: 'الحوكمة المركزية والمراقبة المالية الشاملة',
    themeColor: '#c5a059',
    emailDomain: 'alsulaim.sa',
    routePath: '/login/admin',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'admin-dashboard',
    targetTitle: 'لوحة تحكم الإدارة والسيطرة المركزية',
  },
  {
    id: 'client',
    key: 'client',
    companyId: 'SAF',
    nameAr: 'بوابة العملاء والخدمة الذاتية',
    nameEn: 'Client Self-Service Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة المستفيدين والمتابعة 24/7',
    sectorTagAr: 'تتبع العقود والفواتير والضمان الذاتي',
    themeColor: '#0284c7',
    emailDomain: 'saf-rec.sa',
    routePath: '/login/client',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'client-portal',
    targetTitle: 'بوابة خدمة وتتبع عقود العملاء',
  },
  {
    id: 'agent',
    key: 'agent',
    companyId: 'SAF',
    nameAr: 'بوابة الوكلاء والمكاتب الخارجية الدولية',
    nameEn: 'International Agency & Partner Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة الوكالات والشركاء المعتمدين',
    sectorTagAr: 'رفع السير الذاتية والفحص الطبي والتفييز',
    themeColor: '#2563eb',
    emailDomain: 'saf-rec.sa',
    routePath: '/login/agent',
    logoUrl: '/logos/saf.png',
    targetTab: 'foreign-agency-portal',
    targetTitle: 'بوابة الوكلاء والمكاتب الخارجية',
  },
  {
    id: 'ecommerce',
    key: 'ecommerce',
    companyId: 'SAF',
    nameAr: 'بوابة المتاجر الإلكترونية وقنوات البيع',
    nameEn: 'E-Commerce & Omnichannel Stores Hub',
    category: 'البوابات الرقمية',
    license: 'سلة • زد • شوبيفاي • ووكومرس • ميسر',
    sectorTagAr: 'المزامنة الفورية للباقات والمدفوعات',
    themeColor: '#059669',
    emailDomain: 'saf-rec.sa',
    routePath: '/login/ecommerce',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'smacc-modules',
    targetTitle: 'ربط وتزامن المتاجر الإلكترونية',
  },
];

export function resolvePortalByCode(rawCode?: string | null): SystemPortalOption {
  if (!rawCode) return SYSTEM_PORTALS[0];
  const clean = rawCode.trim().toLowerCase();
  if (clean === 'all') {
    return SYSTEM_PORTALS.find((p) => p.id === 'admin') || SYSTEM_PORTALS[0];
  }
  if (clean === 'dar') {
    return SYSTEM_PORTALS.find((p) => p.id === 'shelter') || SYSTEM_PORTALS[0];
  }
  return (
    SYSTEM_PORTALS.find(
      (p) =>
        p.id.toLowerCase() === clean ||
        p.key.toLowerCase() === clean ||
        p.companyId.toLowerCase() === clean
    ) || SYSTEM_PORTALS[0]
  );
}

interface LoginPageProps {
  onLoginSuccess: (targetTab?: string, targetTitle?: string, targetCompanyId?: CompanyId) => void;
}

type AuthMode = 'signin' | 'register';
type RegistrationAccountType = 'client' | 'employee' | 'agency';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const {
    signIn,
    signInWithGoogle,
    verifyMfa,
    enrollMfa,
    signOut,
    session,
    isAuthenticated,
    mfaRequirement,
    error: authError,
  } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setActiveCompanyId } = useCompany();
  const { setActiveTab, setFlowState, loginPortalCode, setLoginPortalCode } = useAppStore();

  const getInitialPortal = (): SystemPortalOption => {
    const pathSegments = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const pathPortal = pathSegments[0] === 'login' && pathSegments[1] ? pathSegments[1] : null;
    const urlParams = new URLSearchParams(window.location.search);
    const paramSystem =
      pathPortal ||
      loginPortalCode ||
      urlParams.get('company') ||
      urlParams.get('system') ||
      localStorage.getItem('ALSULAIM_TARGET_SYSTEM');
    return resolvePortalByCode(paramSystem);
  };

  const initialPortal = getInitialPortal();
  const [selectedPortal, setSelectedPortal] = useState<SystemPortalOption>(initialPortal);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [portalCategoryFilter, setPortalCategoryFilter] = useState<string>('الكل');

  // Sync selectedPortal if URL loginPortalCode changes via browser navigation
  useEffect(() => {
    if (loginPortalCode) {
      const matched = resolvePortalByCode(loginPortalCode);
      setSelectedPortal(matched);
    }
  }, [loginPortalCode]);

  // Auth Mode: Sign In vs New Account Registration
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Sign-In Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Registration Form States
  const [regAccountType, setRegAccountType] = useState<RegistrationAccountType>('client');
  const [regFullName, setRegFullName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState<{
    referenceNo: string;
    email: string;
    accountTypeLabel: string;
  } | null>(null);

  // Modals
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSelectPortal = (portal: SystemPortalOption) => {
    setSelectedPortal(portal);
    setShowPortalDropdown(false);
    setLocalError(null);
    setUsername('');
    setPassword('');
    setLoginPortalCode(portal.id);
    localStorage.setItem('ALSULAIM_TARGET_SYSTEM', portal.id);
  };

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [totpSecondsLeft, setTotpSecondsLeft] = useState(30);
  const mfaStepStartedRef = useRef(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Native Biometric Passkey Authentication
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [hasHardwareWebAuthn, setHasHardwareWebAuthn] = useState<boolean>(false);

  useEffect(() => {
    checkWebAuthnSupport().then((res) => {
      setHasHardwareWebAuthn(res.supported && res.hasHardware);
    });
  }, []);

  // TOTP 30-second visual cycle timer
  useEffect(() => {
    if (!is2FAStep) return;
    const updateRemaining = () => {
      const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTotpSecondsLeft(sec);
    };
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [is2FAStep]);

  const filteredPortals = useMemo(() => {
    if (portalCategoryFilter === 'الكل') return SYSTEM_PORTALS;
    return SYSTEM_PORTALS.filter((p) => p.category === portalCategoryFilter);
  }, [portalCategoryFilter]);

  // Password strength calculation for registration
  const passwordStrength = useMemo(() => {
    if (!regPassword) return { score: 0, label: 'غير مدخلة', color: 'bg-slate-200' };
    let score = 0;
    if (regPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword)) score += 1;
    if (/\d/.test(regPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(regPassword)) score += 1;

    const map: Record<number, { label: string; color: string }> = {
      0: { label: 'ضعيفة جداً', color: 'bg-red-500' },
      1: { label: 'ضعيفة', color: 'bg-red-500' },
      2: { label: 'متوسطة', color: 'bg-amber-500' },
      3: { label: 'قوية', color: 'bg-emerald-500' },
      4: { label: 'فائقة الأمان (ممتازة)', color: 'bg-emerald-600' },
    };
    return { score, ...map[score] };
  }, [regPassword]);

  const executeCompleteLogin = () => {
    setActiveCompanyId(selectedPortal.companyId);
    setLoginPortalCode(selectedPortal.id);
    setActiveTab(selectedPortal.targetTab, selectedPortal.targetTitle);
    onLoginSuccess(selectedPortal.targetTab, selectedPortal.targetTitle, selectedPortal.companyId);
  };

  const handleKeyEvents = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleTriggerBiometric = async () => {
    if (!isAuthenticated) {
      setLocalError('يرجى تسجيل الدخول أولاً بكلمة المرور لربط وتفعيل مفتاح المرور البيومتري على هذا الجهاز.');
      return;
    }

    setBiometricLoading(true);
    setLocalError(null);

    try {
      const authResult: BiometricAuthResult = await performRealBiometricAuth(
        username || '',
        selectedPortal.nameAr,
        'fingerprint'
      );

      if (authResult.success) {
        localStorage.setItem(
          'ALSULAIM_LAST_BIOMETRIC_AUTH',
          JSON.stringify({
            type: 'passkey',
            portal: selectedPortal.id,
            isRealHardware: authResult.isRealHardware,
            credentialId: authResult.credentialId,
            timestamp: new Date().toISOString(),
          })
        );
        executeCompleteLogin();
      } else if (!authResult.canceled) {
        setLocalError(authResult.errorMessage || 'تعذّر إتمام التحقق البيومتري. يرجى المتابعة بكلمة المرور.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLocalError(null);
    try {
      const res = await signInWithGoogle();
      if (!res.success && res.error) {
        setLocalError(res.error);
      }
    } catch (err: any) {
      setLocalError(err?.message || 'تعذر بدء تسجيل الدخول بواسطة Google');
    } finally {
      setGoogleLoading(false);
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
        setLocalError(error || 'تعذّر إعداد المصادقة الثنائية. يرجى التواصل مع الدعم الفني.');
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
      setLocalError('يرجى إدخال اسم المستخدم أو البريد الوظيفي وكلمة المرور.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn(effectiveUser, effectivePass, selectedPortal.companyId);
      if (!result.success) {
        setLocalError(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!regFullName.trim() || regFullName.trim().length < 4) {
      setLocalError('يرجى إدخال الاسم الكامل أو اسم المنشأة بشكل صحيح.');
      return;
    }
    if (!/^\d{10}$/.test(regNationalId.trim())) {
      setLocalError('يرجى إدخال رقم هوية وطنية / إقامة / سجل تجاري صحيح مكون من 10 أرقام.');
      return;
    }
    if (!/^(\+?966|0)?5\d{8}$/.test(regPhone.replace(/\s+/g, ''))) {
      setLocalError('يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 أو +9665.');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setLocalError('يرجى إدخال بريد إلكتروني صحيح للتفعيل والإشعارات.');
      return;
    }
    if (regPassword.length < 8) {
      setLocalError('يجب أن تتكون كلمة المرور من 8 خانات على الأقل لضمان الأمان.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setLocalError('كلمتا المرور غير متطابقتين. يرجى التأكد من التطابق.');
      return;
    }
    if (!regAcceptedTerms) {
      setLocalError('يرجى الموافقة على سياسة الخصوصية وحماية البيانات الشخصية (PDPL) للمتابعة.');
      return;
    }

    setSubmitting(true);
    try {
      const refNo = `REG-${selectedPortal.companyId === 'all' ? 'SAF' : selectedPortal.companyId}-${Date.now().toString().slice(-6)}`;
      const typeLabelMap: Record<RegistrationAccountType, string> = {
        client: 'حساب عميل / مستفيد',
        employee: 'حساب موظف منسوبي المجموعة',
        agency: 'حساب وكالة خارجية / شريك دولي',
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email: regEmail.trim(),
          password: regPassword,
          options: {
            data: {
              full_name: regFullName.trim(),
              national_id: regNationalId.trim(),
              phone: regPhone.trim(),
              account_type: regAccountType,
              company_id: selectedPortal.companyId === 'all' ? 'SAF' : selectedPortal.companyId,
              registration_ref: refNo,
            },
          },
        });
        if (error) {
          setLocalError(error.message);
          return;
        }
      }

      setRegSuccessData({
        referenceNo: refNo,
        email: regEmail.trim(),
        accountTypeLabel: typeLabelMap[regAccountType],
      });
      setUsername(regEmail.trim());
    } finally {
      setSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      setLocalError('يرجى إدخال رمز التحقق المكون من 6 أرقام.');
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
      className="min-h-screen min-h-[100dvh] w-full flex flex-col-reverse lg:flex-row bg-[#070b14] font-sans antialiased text-slate-800 selection:bg-amber-500/20 selection:text-amber-800 overflow-x-hidden"
      style={{ direction: 'ltr' }}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEFT SECTION: SOVEREIGN KAFD ARCHITECTURAL HERO & TELEMETRY   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full lg:w-[56%] xl:w-[58%] min-h-[360px] lg:min-h-screen flex flex-col justify-between p-5 sm:p-10 lg:p-14 overflow-hidden bg-[#080d1a] border-t lg:border-t-0 lg:border-r border-white/10"
        style={{ direction: currentLanguage.dir }}
      >
        {/* Background Visual Photo - Architectural KAFD Riyadh Skyline */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('/login-hero-pro.jpg')` }}
        />

        {/* Multi-Layered Sovereign Vignette & Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#080d1a]/65 to-[#060a14]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14]/90 via-[#060a14]/35 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Ambient Champagne Gold Glow */}
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-35 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, transparent 70%)',
          }}
        />

        {/* Top Bar: Return Home, Language Selector, & Technical Support */}
        <div className="relative z-20 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setFlowState('landing')}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400/50"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>الرئيسية</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900/95 border border-white/15 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400/50"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLanguage.nativeName}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-300 transition-transform ${
                    showLangMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showLangMenu && (
                <div
                  className={`absolute top-full mt-2 ${
                    isRtl ? 'right-0' : 'left-0'
                  } bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 min-w-[165px]`}
                >
                  {LANGUAGES.map((lang: Language) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        currentLanguage.code === lang.code
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {currentLanguage.code === lang.code && (
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Support Action Button */}
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900/95 border border-white/15 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400/50"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>الدعم الفني 24/7</span>
            </button>
          </div>

          {/* Live Sovereign Telemetry Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الربط الحكومي: مساند • فاتورة ZATCA • قوى (متصل)</span>
          </div>
        </div>

        {/* Center Hero Narrative & Dynamic Active Portal Spotlight Card */}
        <div className="relative z-20 my-auto py-8 lg:py-12 text-start max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>بوابة الدخول السيادي المستقلة • {selectedPortal.routePath}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            <span>{selectedPortal.nameAr}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 text-2xl sm:text-3xl lg:text-4xl block mt-2">
              {selectedPortal.sectorTagAr || 'بيئة تشغيلية معزولة ومتكاملة'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
            بوابة دخول مستقلة ومعزولة كلياً لمنسوبي ومستفيدي <strong>{selectedPortal.nameAr}</strong>، محمية بمعايير العزل المؤسسي الصارم (Strict Tenant RLS) والتكامل الحكومي الفوري.
          </p>

          {/* Dynamic Selected Subsidiary Spotlight Card */}
          <div
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border shadow-2xl transition-all"
            style={{ borderColor: `${selectedPortal.themeColor}66` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/95 border border-amber-300/40 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <img
                    src={selectedPortal.logoUrl || '/alsulaim-gold-emblem.png'}
                    alt={selectedPortal.nameAr}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: selectedPortal.themeColor }}
                    >
                      {selectedPortal.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      [{selectedPortal.companyId === 'all' ? 'GRP-ALL' : selectedPortal.companyId}]
                    </span>
                    <span className="text-[11px] font-mono text-amber-300/90 font-semibold">
                      @{selectedPortal.emailDomain}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-white mt-1 m-0">
                    {selectedPortal.nameAr}
                  </h2>
                  <p className="text-[11px] text-slate-300 m-0 mt-0.5">
                    {selectedPortal.nameEn}
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 hidden sm:block" />
            </div>

            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-slate-300 flex-wrap">
              <span className="font-mono text-amber-200/90">{selectedPortal.license}</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>عزل كامل للجلسة والبيانات ({selectedPortal.routePath})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sovereign Compliance & Pillars Bar */}
        <div className="relative z-20 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">العمليات ومساند</span>
              <span className="text-[10px] text-slate-400 block truncate">آلة حالة 8 مراحل • ضمان 90 يوماً</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">المالية و ZATCA 2</span>
              <span className="text-[10px] text-slate-400 block truncate">UBL 2.1 XML • تشفير PIH • حساب ضمان</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">اعتماد والموارد البشرية</span>
              <span className="text-[10px] text-slate-400 block truncate">كاس BOQ • حماية الأجور WPS • PDPL</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RIGHT SECTION: DEDICATED PER-COMPANY AUTHENTICATION HUB       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="w-full lg:w-[44%] xl:w-[42%] bg-[#fafbfc] flex flex-col justify-between p-4 sm:p-8 lg:p-12 lg:min-h-screen overflow-y-auto z-10 shadow-2xl"
        style={{
          direction: currentLanguage.dir,
          paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
        }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Mobile-Only Quick Top Bar: Home, Language, Support */}
          <div className="flex lg:hidden items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/80">
            <button
              type="button"
              onClick={() => setFlowState('landing')}
              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Home className="w-3 h-3 text-amber-400" />
              <span>الرئيسية</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs"
              >
                <Headphones className="w-3 h-3 text-amber-600" />
                <span>الدعم</span>
              </button>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                {selectedPortal.routePath}
              </span>
            </div>
          </div>

          {/* Header Brand Bar: Active Company Emblem & Dedicated Portal Identity */}
          <div className="flex items-center justify-between gap-3.5 mb-5 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border bg-white p-1.5"
                style={{ borderColor: `${selectedPortal.themeColor}60` }}
              >
                <img
                  src={selectedPortal.logoUrl || '/alsulaim-gold-emblem.png'}
                  alt={selectedPortal.nameAr}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-start min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-[#0f172a] leading-tight m-0 truncate">
                  {selectedPortal.nameAr}
                </h2>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5 truncate">
                  إحدى شركات مجموعة خالد السليم القابضة
                </span>
              </div>
            </div>

            <span
              className="px-2.5 py-1 rounded-full text-white text-[10px] font-mono font-extrabold tracking-wide shrink-0 shadow-2xs"
              style={{ backgroundColor: selectedPortal.themeColor }}
            >
              {selectedPortal.companyId === 'all' ? 'GROUP HQ' : selectedPortal.companyId}
            </span>
          </div>

          {/* Segmented Mode Switcher: Sign In vs Register New Account */}
          {!is2FAStep && (
            <div
              role="tablist"
              aria-label="وضع المصادقة"
              className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/75 border border-slate-200 mb-6"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'signin'}
                onClick={() => {
                  setAuthMode('signin');
                  setLocalError(null);
                  setRegSuccessData(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#0a1120] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'register'}
                onClick={() => {
                  setAuthMode('register');
                  setLocalError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#0a1120] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>تسجيل حساب جديد</span>
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="text-start mb-5">
            <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight m-0">
              {is2FAStep
                ? 'التحقق الثنائي الإلزامي (2FA)'
                : authMode === 'signin'
                ? 'بوابة الدخول المستقلة للشركة'
                : 'إنشاء حساب جديد في الشركة'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 m-0 font-medium leading-relaxed">
              {is2FAStep
                ? 'أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة لتأكيد هويتك.'
                : authMode === 'signin'
                ? `أنت تتصل الآن ببوابة (${selectedPortal.nameAr}) المعزولة. يُسمح بالدخول لمنسوبي ومستفيدي هذا الكيان فقط.`
                : `سجّل بياناتك لربط حسابك مباشرةً على ملاك (${selectedPortal.nameAr}).`}
            </p>
          </div>

          {/* Error Alert Message */}
          {displayedError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-5 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed text-start">{displayedError}</span>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* MODE 1: SIGN IN FORM (ISOLATED PER-COMPANY LOGIN)           */}
          {/* ─────────────────────────────────────────────────────────── */}
          {!is2FAStep && authMode === 'signin' && (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {/* Locked Company Identity Card + Optional Gateway Switcher */}
              <div className="relative">
                <div
                  className="rounded-2xl border bg-white p-3.5 shadow-xs transition-all overflow-hidden relative"
                  style={{ borderColor: `${selectedPortal.themeColor}45` }}
                >
                  {/* Top Company Brand Color Accent Strip */}
                  <div
                    className="absolute top-0 inset-x-0 h-1"
                    style={{ backgroundColor: selectedPortal.themeColor }}
                  />

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 shrink-0">
                        <img
                          src={selectedPortal.logoUrl || '/alsulaim-gold-emblem.png'}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            بوابة دخول مستقلة ومعزولة
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {selectedPortal.routePath}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate mt-0.5">
                          {selectedPortal.nameAr}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {selectedPortal.license}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-700 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                      title="الانتقال إلى بوابة شركة أخرى"
                    >
                      <span>تغيير الكيان</span>
                      <ChevronDown
                        className={`w-3 h-3 text-slate-500 transition-transform ${
                          showPortalDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Gateway Portal Switcher Drawer (only shown when user explicitly clicks 'تغيير الكيان') */}
                {showPortalDropdown && (
                  <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50">
                    <div className="flex items-center justify-between px-1 pb-2 mb-1.5 border-b border-slate-100">
                      <span className="text-[11px] font-extrabold text-slate-800">
                        اختر بوابة الدخول المستقلة للشركة:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPortalDropdown(false)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 pb-2 mb-1.5 border-b border-slate-100 overflow-x-auto">
                      {['الكل', 'شركات المجموعة', 'البوابات الرقمية', 'الإدارة والسيطرة'].map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setPortalCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              portalCategoryFilter === cat
                                ? 'bg-[#0a1120] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {filteredPortals.map((portal) => {
                        const isCurrent = selectedPortal.id === portal.id;
                        return (
                          <button
                            key={portal.id}
                            type="button"
                            onClick={() => handleSelectPortal(portal)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-start transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-50/90 text-slate-900 font-bold border border-amber-300/70'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
                                <img
                                  src={portal.logoUrl || '/alsulaim-gold-emblem.png'}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold block truncate">
                                    {portal.nameAr}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400">
                                    {portal.routePath}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 block truncate">
                                  {portal.license}
                                </span>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: Work Email / Username with Company Domain Badge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="work-email"
                    className="block text-xs font-bold text-slate-700 text-start"
                  >
                    البريد الوظيفي أو اسم المستخدم
                  </label>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    @{selectedPortal.emailDomain}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Mail
                    className={`w-4 h-4 text-slate-400 absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } pointer-events-none`}
                  />
                  <input
                    id="work-email"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`username@${selectedPortal.emailDomain}`}
                    autoComplete="username"
                    className={`w-full h-12 ${
                      isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    } rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-slate-900/10 transition-all bg-white font-medium shadow-2xs`}
                    style={{ direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="work-password"
                    className="block text-xs font-bold text-slate-700 text-start"
                  >
                    كلمة المرور
                  </label>
                  {capsLockOn && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      تنبيه: مفتاح Caps Lock مفعّل
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <KeyRound
                    className={`w-4 h-4 text-slate-400 absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } pointer-events-none`}
                  />
                  <input
                    id="work-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={handleKeyEvents}
                    onKeyDown={handleKeyEvents}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full h-12 ${
                      isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'
                    } rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-slate-900/10 transition-all bg-white font-mono tracking-wider shadow-2xs`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className={`absolute ${
                      isRtl ? 'left-3.5' : 'right-3.5'
                    } text-slate-400 hover:text-slate-700 cursor-pointer transition-colors p-1`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0f172a] accent-[#0f172a] focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me-checkbox"
                    className="text-xs font-medium text-slate-700 cursor-pointer select-none"
                  >
                    الاحتفاظ بالجلسة الآمنة
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-[#9a7014] hover:text-[#78560d] transition-colors cursor-pointer"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 mt-2 rounded-xl bg-[#0a1120] hover:bg-[#162238] active:bg-[#050811] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>جاري التحقق من تبعية الحساب للشركة...</span>
                  </>
                ) : (
                  <>
                    <span>
                      دخول بوابة{' '}
                      {selectedPortal.companyId === 'all'
                        ? 'الإدارة المركزية'
                        : selectedPortal.nameAr}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    )}
                  </>
                )}
              </button>

              {/* Divider: — أو الدخول السريع عبر — */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-[#fafbfc] px-3 text-[11px] font-semibold text-slate-500">
                  أو المصادقة السريعة عبر
                </span>
              </div>

              {/* Dual Quick Auth Grid: Google OAuth & WebAuthn Passkey */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google OAuth Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="h-11 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white bg-white text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span className="truncate">حساب Google</span>
                </button>

                {/* WebAuthn / Passkey Biometric Button */}
                <button
                  type="button"
                  onClick={handleTriggerBiometric}
                  disabled={biometricLoading}
                  className="h-11 px-3 rounded-xl border border-slate-200 hover:border-amber-400/70 hover:bg-amber-50/30 bg-white text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {biometricLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                      <span className="truncate">جاري الفحص...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint
                        className={`w-4 h-4 shrink-0 ${
                          hasHardwareWebAuthn ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      />
                      <span className="truncate">مفتاح المرور (Passkey)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px] pt-2 select-none">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>اتصال مشفر بمعيار TLS 1.3 وضوابط الأمن السيبراني NCA</span>
              </div>
            </form>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* MODE 2: NEW ACCOUNT REGISTRATION & ONBOARDING FORM          */}
          {/* ─────────────────────────────────────────────────────────── */}
          {!is2FAStep && authMode === 'register' && (
            <div>
              {regSuccessData ? (
                <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-lg text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      تم استلام وتوثيق طلب التسجيل
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-2 m-0">
                      مرحباً بك في مجموعة خالد السليم القابضة
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      تم إنشاء ملف التسجيل بنجاح ({regSuccessData.accountTypeLabel}) وربطه بـ{' '}
                      <strong>{selectedPortal.nameAr}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-start space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم المرجع الموحد:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {regSuccessData.referenceNo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">البريد المسجل:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {regSuccessData.email}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setRegSuccessData(null);
                    }}
                    className="w-full h-11 rounded-xl bg-[#0a1120] hover:bg-[#162238] text-white font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>المتابعة لتسجيل الدخول الآن</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Account Classification Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-start">
                      نوع الحساب المطلوب
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'client', label: 'عميل / مستفيد' },
                        { id: 'employee', label: 'موظف بالمجموعة' },
                        { id: 'agency', label: 'وكالة خارجية' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRegAccountType(item.id as RegistrationAccountType)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            regAccountType === item.id
                              ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="reg-fullname"
                      className="block text-xs font-bold text-slate-700 mb-1 text-start"
                    >
                      {regAccountType === 'agency'
                        ? 'اسم الوكالة أو المنشأة الرسمية'
                        : 'الاسم الرباعي الكامل'}
                    </label>
                    <div className="relative flex items-center">
                      <User
                        className={`w-4 h-4 text-slate-400 absolute ${
                          isRtl ? 'right-3.5' : 'left-3.5'
                        } pointer-events-none`}
                      />
                      <input
                        id="reg-fullname"
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="أدخل الاسم الكامل كما في الهوية أو السجل"
                        className={`w-full h-11 ${
                          isRtl ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
                        } rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0f172a] bg-white font-medium`}
                      />
                    </div>
                  </div>

                  {/* National ID / Iqama & Phone in 2-col grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="reg-national-id"
                        className="block text-xs font-bold text-slate-700 mb-1 text-start"
                      >
                        رقم الهوية / الإقامة / السجل
                      </label>
                      <div className="relative flex items-center">
                        <CreditCard
                          className={`w-4 h-4 text-slate-400 absolute ${
                            isRtl ? 'right-3' : 'left-3'
                          } pointer-events-none`}
                        />
                        <input
                          id="reg-national-id"
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={regNationalId}
                          onChange={(e) =>
                            setRegNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          placeholder="10xxxxxxxx"
                          className={`w-full h-11 ${
                            isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                          } rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0f172a] bg-white`}
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reg-phone"
                        className="block text-xs font-bold text-slate-700 mb-1 text-start"
                      >
                        رقم الجوال (أبشر / نفاذ)
                      </label>
                      <div className="relative flex items-center">
                        <Phone
                          className={`w-4 h-4 text-slate-400 absolute ${
                            isRtl ? 'right-3' : 'left-3'
                          } pointer-events-none`}
                        />
                        <input
                          id="reg-phone"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="05xxxxxxxx"
                          className={`w-full h-11 ${
                            isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                          } rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0f172a] bg-white`}
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold text-slate-700 mb-1 text-start"
                    >
                      البريد الإلكتروني المعتمد
                    </label>
                    <div className="relative flex items-center">
                      <Mail
                        className={`w-4 h-4 text-slate-400 absolute ${
                          isRtl ? 'right-3.5' : 'left-3.5'
                        } pointer-events-none`}
                      />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="user@company.sa"
                        className={`w-full h-11 ${
                          isRtl ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
                        } rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0f172a] bg-white`}
                        style={{ direction: 'ltr' }}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="reg-password"
                        className="block text-xs font-bold text-slate-700 mb-1 text-start"
                      >
                        كلمة المرور
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0f172a] bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reg-confirm-password"
                        className="block text-xs font-bold text-slate-700 mb-1 text-start"
                      >
                        تأكيد كلمة المرور
                      </label>
                      <input
                        id="reg-confirm-password"
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#0f172a] bg-white"
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {regPassword.length > 0 && (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">قوة كلمة المرور:</span>
                        <span className="font-bold text-slate-700">{passwordStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all ${
                              passwordStrength.score >= step
                                ? passwordStrength.color
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDPL Compliance Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="reg-pdpl-consent"
                      type="checkbox"
                      checked={regAcceptedTerms}
                      onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0f172a] accent-[#0f172a] cursor-pointer"
                    />
                    <label
                      htmlFor="reg-pdpl-consent"
                      className="text-[11px] text-slate-600 leading-relaxed cursor-pointer text-start"
                    >
                      أقر بصحة البيانات المدخلة وأوافق على{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-[#9a7014] font-bold underline cursor-pointer"
                      >
                        سياسة الخصوصية ونظام حماية البيانات الشخصية السعودي (PDPL)
                      </button>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-xl bg-[#0a1120] hover:bg-[#162238] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>جاري إنشاء الحساب وتوثيق البيانات...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>تسجيل الحساب وتفعيله في المنظومة</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* MODE 3: 2FA TOTP VERIFICATION STEP                          */}
          {/* ─────────────────────────────────────────────────────────── */}
          {is2FAStep && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-start">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                    المصادقة الثنائية المشفرة (TOTP)
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                    {totpSecondsLeft}s
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 m-0">رمز التحقق الإضافي</h4>
                <p className="text-xs text-slate-600 mt-1 m-0 leading-relaxed">
                  {enrollment || enrollLoading ? (
                    'امسح رمز الاستجابة السريعة (QR) بتطبيق المصادقة وأدخل الرمز لتفعيل حسابك.'
                  ) : (
                    <>
                      أدخل الرمز المتجدد من تطبيق المصادقة لمتابعة الدخول إلى{' '}
                      <strong>{selectedPortal.nameAr}</strong>.
                    </>
                  )}
                </p>
              </div>

              {enrollLoading && (
                <div className="flex flex-col items-center justify-center p-5 bg-white rounded-xl border border-slate-200">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600 mb-2" />
                  <span className="text-xs text-slate-600">جاري إعداد مفتاح التحقق الثنائي...</span>
                </div>
              )}

              {enrollment && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center gap-3 shadow-xs">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                    <img
                      src={enrollment.qrCode}
                      alt="QR Code"
                      width={140}
                      height={140}
                      className="block rounded"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-[11px] text-slate-500 block mb-1">
                      أو أدخل المفتاح السري يدوياً:
                    </span>
                    <div className="flex items-center justify-center gap-1.5">
                      <code
                        dir="ltr"
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs select-all"
                      >
                        {enrollment.secret}
                      </code>
                      <button
                        type="button"
                        onClick={() => copySecretToClipboard(enrollment.secret)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedSecret ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
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
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      aria-label={`الرقم ${idx + 1}`}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-13 rounded-xl text-center text-lg font-bold font-mono transition-all outline-none ${
                        val
                          ? 'bg-white border-2 border-[#0f172a] text-slate-900 shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-900 focus:border-[#0f172a]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[11px]">
                    يتجدد الرمز تلقائياً خلال {totpSecondsLeft} ثانية
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelMfa}
                    disabled={submitting}
                    className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
                  >
                    إلغاء والعودة
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || enrollLoading}
                  className="w-full h-12 rounded-xl bg-[#0a1120] hover:bg-[#162238] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>جاري التحقق من الرمز...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>تأكيد الرمز والمتابعة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card Footer: Copyright & Legal/Support Links */}
        <div className="pt-5 mt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-500">
          <span>© 2026 مجموعة خالد السليم القابضة — جميع الحقوق محفوظة</span>
          <div className="flex items-center gap-3 font-semibold">
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              الخصوصية و PDPL
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              الدعم الفني
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TECHNICAL SUPPORT MODAL                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
            style={{ direction: currentLanguage.dir }}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#101b33] text-white">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold m-0">مركز الدعم الفني الموحد</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed m-0 text-start">
                فريق الدعم والمساندة التقنية لمجموعة خالد السليم القابضة متاح على مدار الساعة لخدمة موظفي ومنسوبي الشركات التابعة والعملاء.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:8001234567"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        الرقم الموحد للدعم الفني
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        800-ALSULAIM (800-1234567)
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600">مجاني 24/7</span>
                </a>

                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        المساندة الفورية عبر واتساب
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">+966 50 123 4567</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                </a>

                <a
                  href="mailto:support@alsulaim.sa"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        البريد الإلكتروني المعتمد
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        support@alsulaim.sa
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">إرسال تذكرة</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PRIVACY POLICY & COMPLIANCE MODAL                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
            style={{ direction: currentLanguage.dir }}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#101b33] text-white">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold m-0">سياسة الخصوصية وحوكمة البيانات (PDPL)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-start">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  الامتثال لنظام حماية البيانات الشخصية (PDPL)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  تلتزم مجموعة خالد السليم القابضة بكافة الأنظمة واللوائح الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) لحماية البيانات المؤسسية والشخصية وتعمية بيانات الهوية والجوازات والآيبان لغير المخولين.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  سجلات التدقيق والمراقبة الأمنية (Append-Only Audit)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  تخضع جميع عمليات تسجيل الدخول والاستعلام والتعديل داخل النظام للتدقيق الآلي غير القابل للحذف أو التعديل الرجعي لضمان النزاهة وحماية أصول المجموعة.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">التشفير وسرية المعاملات</h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  كافة الاتصالات مشفرة باستخدام بروتوكول TLS 1.3 مع تطبيق ضوابط الهيئة الوطنية للأمن السيبراني (NCA ECC-1:2018).
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FORGOT PASSWORD MODAL                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
            style={{ direction: currentLanguage.dir }}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#101b33] text-white">
              <h3 className="text-sm font-bold m-0">استعادة كلمة المرور</h3>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-start">
              {!forgotSent ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    أدخل بريدك الوظيفي المعتمد وسيقوم النظام بإرسال تعليمات إعادة تعيين كلمة المرور أو توجيه الطلب إلى إدارة تقنية المعلومات.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      البريد الوظيفي
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@alsulaim.sa"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0f172a]"
                      style={{ direction: 'ltr' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (forgotEmail.trim()) {
                        setForgotSent(true);
                      }
                    }}
                    className="w-full h-11 rounded-xl bg-[#0a1120] text-white font-bold text-xs hover:bg-[#162238] transition-colors cursor-pointer mt-2"
                  >
                    إرسال رابط الاستعادة
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 m-0">تم إرسال تعليمات الاستعادة</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    تم إرسال رابط آمن إلى <strong>{forgotEmail}</strong>. إذا لم يصلك البريد خلال دقيقتين يرجى التواصل مباشرة مع الدعم الفني الداخلي.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer mt-2"
                  >
                    حسناً
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
