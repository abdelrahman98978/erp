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
  CheckCircle2
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
  themeColor?: string;
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
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'recruitment-contracts',
    targetTitle: 'عقود استقدام مساند - شركة السفير الماسي'
  },
  {
    id: 'yaq',
    key: 'yaq',
    companyId: 'YAQ',
    nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    nameEn: 'Yaqoot Eastern Operation & Rental Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC02 • س.ت 1010543210',
    logoUrl: '/logos/yaqoot.png',
    targetTab: 'rent-contracts',
    targetTitle: 'عقود التأجير والتشغيل - شركة الياقوت'
  },
  {
    id: 'top',
    key: 'top',
    companyId: 'TOP',
    nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
    nameEn: 'Top Talent ATS & Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC03 • س.ت 1010776543',
    logoUrl: '/logos/topaz.png',
    targetTab: 'ats-pipeline',
    targetTitle: 'منظومة ATS والفرز الوظيفي - توب تالنت'
  },
  {
    id: 'kas',
    key: 'kas',
    companyId: 'KAS',
    nameAr: 'بوابة شركة كاس للمنافسات والتشغيل',
    nameEn: 'KAS Trading & Etmad Enterprise Suite',
    category: 'البوابات الرقمية',
    license: 'سجل تجاري 1010789234 • ضريبي 310284759200003',
    logoUrl: '/logo.png',
    targetTab: 'kas-suite',
    targetTitle: 'البوابة المستقلة لشركة كاس (KAS Suite)'
  },
  {
    id: 'admin',
    key: 'admin',
    companyId: 'all',
    nameAr: 'الإدارة المركزية والسيطرة العليا',
    nameEn: 'Executive Command & Super Admin',
    category: 'الإدارة والسيطرة',
    license: 'مجموعة خالد السليم القابضة الموحدة',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'admin-dashboard',
    targetTitle: 'لوحة تحكم الإدارة والسيطرة المركزية'
  },
  {
    id: 'client',
    key: 'client',
    companyId: 'SAF',
    nameAr: 'بوابة العملاء والخدمة الذاتية',
    nameEn: 'Client Self-Service Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة المستفيدين والمتابعة 24/7',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'client-portal',
    targetTitle: 'بوابة خدمة وتتبع عقود العملاء'
  },
  {
    id: 'agent',
    key: 'agent',
    companyId: 'SAF',
    nameAr: 'بوابة الوكلاء والمكاتب الخارجية الدولية',
    nameEn: 'International Agency & Partner Portal',
    category: 'البوابات الرقمية',
    license: 'بوابة الوكالات والشركاء المعتمدين',
    logoUrl: '/logos/saf.png',
    targetTab: 'foreign-agency-portal',
    targetTitle: 'بوابة الوكلاء والمكاتب الخارجية'
  },
  {
    id: 'ecommerce',
    key: 'ecommerce',
    companyId: 'SAF',
    nameAr: 'بوابة المتاجر الإلكترونية وقنوات البيع',
    nameEn: 'E-Commerce & Omnichannel Stores Hub',
    category: 'البوابات الرقمية',
    license: 'سلة • زد • شوبيفاي • ووكومرس • ميسر',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'smacc-modules',
    targetTitle: 'ربط وتزامن المتاجر الإلكترونية'
  },
  {
    id: 'shelter',
    key: 'shelter',
    companyId: 'SAF',
    nameAr: 'بوابة مراكز الإيواء والتسكين والرعاية',
    nameEn: 'Shelter, Housing & Care Suite (HRSD)',
    category: 'البوابات الرقمية',
    license: 'ترخيص مراكز الإيواء والضيافة HRSD-MOL',
    logoUrl: '/logos/ruwad.png',
    targetTab: 'shelter-suite',
    targetTitle: 'منظومة وبوابة مراكز الإيواء والتسكين المستقلة'
  }
];

interface LoginPageProps {
  onLoginSuccess: (targetTab?: string, targetTitle?: string, targetCompanyId?: CompanyId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
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
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

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
    localStorage.setItem('ALSULAIM_TARGET_SYSTEM', portal.id);
  };

  // 2FA Verification Step States
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const mfaStepStartedRef = useRef(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Native Biometric Passkey Authentication
  const [biometricLoading, setBiometricLoading] = useState(false);
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

  const handleTriggerBiometric = async () => {
    if (!isAuthenticated) {
      setLocalError('يرجى تسجيل الدخول أولاً بكلمة المرور لربط وتفعيل مفتاح المرور على هذا الجهاز.');
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
        localStorage.setItem('ALSULAIM_LAST_BIOMETRIC_AUTH', JSON.stringify({
          type: 'passkey',
          portal: selectedPortal.id,
          isRealHardware: authResult.isRealHardware,
          credentialId: authResult.credentialId,
          timestamp: new Date().toISOString()
        }));
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
      const result = await signIn(effectiveUser, effectivePass);
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
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0b101e] font-sans antialiased text-slate-800 selection:bg-amber-500/20 selection:text-amber-800 overflow-x-hidden"
      style={{ direction: 'ltr' }}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEFT SECTION: PRESTIGIOUS RIYADH HEADQUARTERS HERO VISUAL      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div 
        className="relative w-full lg:w-[56%] xl:w-[58%] min-h-[420px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden bg-[#0d1424]"
        style={{ direction: currentLanguage.dir }}
      >
        {/* Background Visual Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-100 transition-transform duration-1000"
          style={{ backgroundImage: `url('/login-hero.png')` }}
        />

        {/* Ambient Dark Gradient Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d]/90 via-[#0a0f1d]/20 to-[#0a0f1d]/60 pointer-events-none" />

        {/* Top Left Navigation: Language & Support */}
        <div className="relative z-20 flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 border border-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400/50"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLanguage.nativeName}</span>
              <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLangMenu && (
              <div 
                className={`absolute top-full mt-2 ${isRtl ? 'right-0' : 'left-0'} bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 min-w-[160px]`}
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
                    {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-slate-950" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-white/30 text-xs select-none">|</span>

          {/* Technical Support Action Button */}
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 border border-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400/50"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>الدعم الفني</span>
          </button>
        </div>

        {/* Center Slogan & Identity Typography (for high DPI and translated rendering) */}
        <div className="relative z-20 my-auto py-12 text-start max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            <span>إدارة موحّدة.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 drop-shadow">
              رؤية متكاملة.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 font-medium leading-relaxed drop-shadow-sm">
            بوابة أعمال المجموعة والشركات التابعة
          </p>

          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-5 shadow-sm" />
        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="relative z-20 pt-6 border-t border-white/10 flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2.5 text-white/90 group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400/50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">العمليات</span>
          </div>

          <div className="flex items-center gap-2.5 text-white/90 group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400/50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">المالية</span>
          </div>

          <div className="flex items-center gap-2.5 text-white/90 group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400/50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">الموارد البشرية</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RIGHT SECTION: ULTRA-LUXURIOUS CLEAN AUTHENTICATION CARD      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div 
        className="w-full lg:w-[44%] xl:w-[42%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen overflow-y-auto z-10 shadow-2xl"
        style={{ direction: currentLanguage.dir }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Header Brand Bar: Gold Emblem & Group Name */}
          <div className="flex items-center justify-end gap-3.5 mb-6">
            <div className="text-end">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a] leading-tight m-0">
                مجموعة خالد السليم القابضة
              </h2>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                نظام تخطيط الموارد المؤسسية
              </span>
            </div>
            <div className="w-13 h-13 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-amber-200/50 bg-gradient-to-br from-amber-50 to-white p-1">
              <img 
                src="/alsulaim-gold-emblem.png" 
                alt="شعار مجموعة خالد السليم القابضة" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Portal Divider Tag */}
          <div className="flex items-center justify-center gap-2 my-5 text-[#b8860b] text-xs font-bold tracking-widest select-none">
            <span className="w-6 h-[1px] bg-[#d4af37]/60" />
            <span>بوابة الموظفين</span>
            <span className="w-6 h-[1px] bg-[#d4af37]/60" />
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight m-0">
              مرحبًا بعودتك
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 m-0 font-medium">
              سجّل الدخول للوصول إلى مساحة عملك
            </p>
          </div>

          {/* Error Alert Message */}
          {displayedError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-5 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed text-start">{displayedError}</span>
            </div>
          )}

          {!is2FAStep ? (
            /* Standard Username & Password Form */
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {/* Field 1: Active Company / Subsidiary Selector */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-start">
                  الشركة التابعة
                </label>

                <button
                  type="button"
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  className="w-full h-12 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] bg-white flex items-center justify-between transition-all cursor-pointer shadow-sm text-start"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center p-0.5 shrink-0">
                      <img 
                        src={selectedPortal.logoUrl || '/alsulaim-gold-emblem.png'} 
                        alt="" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {selectedPortal.nameAr}
                    </span>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${showPortalDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showPortalDropdown && (
                  <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 max-h-64 overflow-y-auto">
                    {SYSTEM_PORTALS.map(portal => {
                      const isCurrent = selectedPortal.id === portal.id;
                      return (
                        <button
                          key={portal.id}
                          type="button"
                          onClick={() => handleSelectPortal(portal)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-start transition-colors cursor-pointer ${
                            isCurrent 
                              ? 'bg-amber-50 text-slate-900 font-bold border border-amber-200/60' 
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
                              <img src={portal.logoUrl || '/alsulaim-gold-emblem.png'} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block truncate">{portal.nameAr}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{portal.license}</span>
                            </div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Field 2: Work Email / Username */}
              <div>
                <label 
                  htmlFor="work-email" 
                  className="block text-xs font-bold text-slate-700 mb-1.5 text-start"
                >
                  البريد الوظيفي
                </label>
                <div className="relative">
                  <input
                    id="work-email"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="username"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-all bg-white font-medium"
                    style={{ direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div>
                <label 
                  htmlFor="work-password" 
                  className="block text-xs font-bold text-slate-700 mb-1.5 text-start"
                >
                  كلمة المرور
                </label>
                <div className="relative flex items-center">
                  <input
                    id="work-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-all bg-white font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} text-slate-400 hover:text-slate-700 cursor-pointer transition-colors p-1`}
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
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0f172a] accent-[#0f172a] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="remember-me-checkbox" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
                    تذكرني
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#b8860b] hover:text-[#8a6508] transition-colors cursor-pointer"
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
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>جاري التحقق من بيانات الدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </>
                )}
              </button>

              {/* Divider: — أو — */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
                  أو
                </span>
              </div>

              {/* Google OAuth Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>تسجيل الدخول باستخدام Google</span>
              </button>

              {/* WebAuthn / Passkey Biometric Button */}
              <button
                type="button"
                onClick={handleTriggerBiometric}
                disabled={biometricLoading}
                className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {biometricLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                    <span>جاري انتظار مفتاح المرور...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 text-slate-700" />
                    <span>الدخول بمفتاح المرور</span>
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs pt-3 select-none">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>وصول مخصص للموظفين المخولين</span>
              </div>
            </form>
          ) : (
            /* 2FA TOTP Form (Preserving Full Security Workflow) */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-start">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  المصادقة الثنائية (TOTP)
                </span>
                <h4 className="text-base font-bold text-slate-900 m-0">
                  رمز التحقق الإضافي
                </h4>
                <p className="text-xs text-slate-600 mt-1 m-0 leading-relaxed">
                  {enrollment || enrollLoading
                    ? 'امسح رمز QR بتطبيق المصادقة وأدخل الرمز لتأكيد تفعيل حسابك.'
                    : <>أدخل الرمز المتجدد من تطبيق المصادقة لمتابعة الدخول إلى <strong>{selectedPortal.nameAr}</strong>.</>}
                </p>
              </div>

              {enrollLoading && (
                <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600 mb-2" />
                  <span className="text-xs text-slate-600">جاري إعداد مفتاح التحقق الثنائي...</span>
                </div>
              )}

              {enrollment && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200">
                    <img
                      src={enrollment.qrCode}
                      alt="QR Code"
                      width={140}
                      height={140}
                      className="block rounded"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-[11px] text-slate-500 block mb-1">أو أدخل المفتاح يدوياً:</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <code 
                        dir="ltr"
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-xs select-all"
                      >
                        {enrollment.secret}
                      </code>
                      <button
                        type="button"
                        onClick={() => copySecretToClipboard(enrollment.secret)}
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
                      className={`w-11 h-13 rounded-xl text-center text-lg font-bold font-mono transition-all outline-none ${
                        val 
                          ? 'bg-white border-2 border-[#0f172a] text-slate-900 shadow-sm' 
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#0f172a]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">
                    يتجدد الرمز تلقائياً كل 30 ثانية
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelMfa}
                    disabled={submitting}
                    className="text-slate-600 hover:text-slate-900 font-medium underline cursor-pointer"
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
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>جاري التحقق من الرمز...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-white" />
                      <span>تأكيد الرمز والمتابعة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card Footer: Copyright & Legal/Support Links */}
        <div className="pt-6 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-400">
          <span>© 2026 مجموعة خالد السليم القابضة</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              الخصوصية
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="hover:text-slate-700 transition-colors cursor-pointer"
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
                فريق الدعم والمساندة التقنية لمجموعة خالد السليم القابضة متاح على مدار الساعة لخدمة موظفي ومنسوبي الشركات التابعة.
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
                      <span className="text-xs font-bold text-slate-900 block">الرقم الموحد للدعم الفني</span>
                      <span className="text-[11px] text-slate-500 font-mono">800-ALSULAIM (800-1234567)</span>
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
                      <span className="text-xs font-bold text-slate-900 block">المساندة الفورية عبر واتساب</span>
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
                      <span className="text-xs font-bold text-slate-900 block">البريد الإلكتروني المعتمد</span>
                      <span className="text-[11px] text-slate-500 font-mono">support@alsulaim.sa</span>
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
                <h3 className="text-sm font-bold m-0">سياسة الخصوصية وحوكمة البيانات</h3>
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
                <h4 className="text-xs font-bold text-slate-900 mb-1">الامتثال لنظام حماية البيانات الشخصية (PDPL)</h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  تلتزم مجموعة خالد السليم القابضة بكافة الأنظمة واللوائح الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) لحماية البيانات المؤسسية والشخصية ومنع أي وصول غير مصرح به.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">سجلات التدقيق والمراقبة الأمنية</h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  تخضع جميع عمليات تسجيل الدخول والاستعلام والتعديل داخل النظام للتدقيق الآلي وتسجيل العنوان الشبكي (IP Address) وجلسة العمل لضمان النزاهة وحماية أصول المجموعة.
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
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="name@company.com"
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
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    العودة لتسجيل الدخول
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

export default LoginPage;
