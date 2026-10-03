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
  User,
  Copy,
  Shield,
  KeyRound,
  Globe,
  Building2,
  Fingerprint
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
    nameAr: 'شركة الصفا الماسي للاستقدام',
    nameEn: 'Al-Safa Al-Masi Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC01 • س.ت 1010123456',
    logoUrl: '/logos/saf.png',
    targetTab: 'recruitment-contracts',
    targetTitle: 'عقود استقدام مساند - شركة الصفا الماسي'
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
    logoUrl: '/logo.png',
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
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

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
      className="min-h-screen w-full flex flex-col justify-between bg-[#0a0f1d] text-slate-100 font-sans relative selection:bg-slate-700 selection:text-white"
      style={{
        direction: currentLanguage.dir
      }}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* INSTITUTIONAL HEADER BAR                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="w-full px-6 sm:px-12 py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0d1424]">
        {/* Real Corporate Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-slate-700 shadow-sm">
            <img src="/logo.png" alt="شعار مجموعة خالد السليم" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-normal leading-tight m-0">
              مجموعة خالد السليم القابضة
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block">
              بوابة الدخول الموحدة لتخطيط الموارد المؤسسية (ERP)
            </span>
          </div>
        </div>

        {/* Language & Security Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-slate-300">اتصال مؤمّن TLS 1.3</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-750 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLanguage.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div 
                className={`absolute top-10 ${isRtl ? 'left-0' : 'right-0'} bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1 z-50 min-w-[150px]`}
              >
                {LANGUAGES.map((lang: Language) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN AUTHENTICATION CONTAINER (Real Enterprise Layout)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-[460px] bg-[#11192b] border border-slate-800 rounded-2xl p-7 sm:p-9 shadow-xl relative">
          
          {/* Active Company / Subsidiary Selector Dropdown */}
          <div className="mb-6 relative">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              الجهة أو الشركة التابعة:
            </label>

            <button
              type="button"
              onClick={() => setShowPortalDropdown(!showPortalDropdown)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-colors text-start cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedPortal.logoUrl ? (
                  <div className="w-7 h-7 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-200">
                    <img src={selectedPortal.logoUrl} alt={selectedPortal.nameAr} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {selectedPortal.nameAr}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate font-mono">
                    {selectedPortal.license}
                  </span>
                </div>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPortalDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showPortalDropdown && (
              <div 
                className="absolute top-full mt-1.5 left-0 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 max-h-[300px] overflow-y-auto"
              >
                {SYSTEM_PORTALS.map(portal => {
                  const isCurrent = selectedPortal.id === portal.id;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleSelectPortal(portal)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-start transition-colors cursor-pointer ${
                        isCurrent 
                          ? 'bg-slate-800 text-white font-bold' 
                          : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {portal.logoUrl ? (
                          <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-300">
                            <img src={portal.logoUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs block truncate">{portal.nameAr}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{portal.license}</span>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message */}
          {displayedError && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs font-medium mb-5 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="flex-1 leading-relaxed">{displayedError}</span>
            </div>
          )}

          {!is2FAStep ? (
            /* Standard Username & Password Form */
            <div>
              <div className="mb-5 pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white m-0">
                  تسجيل الدخول للنظام
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  أدخل بيانات الاعتماد الوظيفية المعتمدة للمتابعة
                </p>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label 
                    htmlFor="corporate-username" 
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    اسم المستخدم أو البريد الوظيفي
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="corporate-username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="مثال: admin@alsulaim.com"
                      className="w-full bg-slate-900 border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl py-2.5 px-3.5 text-xs font-medium transition-colors outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="corporate-password" 
                      className="block text-xs font-semibold text-slate-300"
                    >
                      {t('password', 'كلمة المرور')}
                    </label>
                    <a 
                      href="#forgot" 
                      onClick={e => e.preventDefault()} 
                      className="text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors"
                    >
                      {t('forgotPassword', 'نسيت كلمة المرور؟')}
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="corporate-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-900 border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl py-2.5 px-3.5 text-xs font-mono transition-colors outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} text-slate-400 hover:text-white cursor-pointer transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-xs text-slate-400 cursor-pointer select-none">
                    {t('rememberMe', 'تذكر بيانات الدخول على هذا الجهاز')}
                  </label>
                </div>

                {/* Primary Corporate Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>جاري التحقق من بيانات الدخول...</span>
                    </>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Enterprise Passkey Alternative */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleTriggerBiometric}
                  disabled={biometricLoading}
                  className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {biometricLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      <span>جاري انتظار مفتاح المرور...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 text-slate-400" />
                      <span>تسجيل الدخول عبر مفتاح الأمان (Passkey / WebAuthn)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Standard 2FA TOTP Form */
            <div>
              <div className="mb-5 pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  المصادقة الثنائية (TOTP)
                </span>
                <h2 className="text-lg font-bold text-white m-0">
                  رمز التحقق الإضافي
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0 leading-relaxed">
                  {enrollment || enrollLoading
                    ? 'امسح رمز QR بتطبيق المصادقة وأدخل الرمز لتأكيد تفعيل حسابك.'
                    : <>أدخل الرمز المتجدد من تطبيق المصادقة لمتابعة الدخول إلى <strong>{selectedPortal.nameAr}</strong>.</>}
                </p>
              </div>

              {enrollLoading && (
                <div className="flex flex-col items-center justify-center p-5 bg-slate-900 rounded-xl border border-slate-800 mb-4">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                  <span className="text-xs text-slate-400">جاري إعداد مفتاح التحقق الثنائي...</span>
                </div>
              )}

              {enrollment && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white">
                    <img
                      src={enrollment.qrCode}
                      alt="QR Code"
                      width={140}
                      height={140}
                      className="block rounded"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-[11px] text-slate-400 block mb-1">أو أدخل المفتاح يدوياً:</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <code 
                        dir="ltr"
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs select-all"
                      >
                        {enrollment.secret}
                      </code>
                      <button
                        type="button"
                        onClick={() => copySecretToClipboard(enrollment.secret)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedSecret ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
                      className={`w-11 h-13 rounded-lg text-center text-lg font-bold font-mono transition-colors outline-none ${
                        val 
                          ? 'bg-slate-900 border-2 border-emerald-500 text-white' 
                          : 'bg-slate-900 border border-slate-700 text-slate-300 focus:border-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[11px]">
                    يتجدد الرمز تلقائياً كل 30 ثانية
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelMfa}
                    disabled={submitting}
                    className="text-slate-400 hover:text-white font-medium underline cursor-pointer"
                  >
                    إلغاء والعودة
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || enrollLoading}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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

          {/* Institutional Confidentiality Notice */}
          <div className="pt-5 mt-6 border-t border-slate-800/80">
            <p className="text-[10px] text-slate-400 leading-relaxed text-justify m-0">
              تنبيه: هذا النظام مخصص للاستخدام الرسمي والمصرح به فقط لموظفي مجموعة خالد السليم القابضة والجهات المرخصة. تخضع كافة العمليات للرقابة وسجلات التدقيق المعتمدة.
            </p>
          </div>
        </div>
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CORPORATE FOOTER                                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="w-full px-6 sm:px-12 py-3.5 border-t border-slate-800/80 bg-[#0d1424] text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>© 2026 مجموعة خالد السليم القابضة. جميع الحقوق محفوظة.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>الإصدار المؤسسي v4.2.0</span>
          <span>•</span>
          <span>منظومة متوافقة مع متطلبات الحوكمة السعودية</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
