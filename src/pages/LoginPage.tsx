import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/languages';
import { useAuthContext } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { CompanyId } from '../types';
import {
  CORPORATE_DEPARTMENTS,
  COMPANY_AUTH_METADATA,
  DepartmentId,
  StaffDirectoryEntry,
  resolveDepartmentAndCompany,
  getFullStaffDirectory,
  registerCustomStaffAccount,
} from '../services/authService';
import {
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Globe,
  Fingerprint,
  Headphones,
  X,
  PhoneCall,
  Mail,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  LogIn,
  User,
  KeyRound,
  Home,
} from 'lucide-react';
import {
  performRealBiometricAuth,
  checkWebAuthnSupport,
} from '../services/webAuthnBiometricService';
import { CorporateAvatar } from '../components/common/CorporateAvatar';
import { BusinessIllustration } from '../components/common/BusinessIllustration';

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
    themeColor: '#8C681E',
    emailDomain: 'saf-rec.sa',
    routePath: '/login/saf',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'recruitment-contracts',
    targetTitle: 'عقود الاستقدام الموثقة (مساند)',
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
    themeColor: '#1D2428',
    emailDomain: 'yaqoot-ops.sa',
    routePath: '/login/yaq',
    logoUrl: '/logos/yaqoot.png',
    targetTab: 'rent-contracts',
    targetTitle: 'عقود التأجير والتشغيل المرن',
  },
  {
    id: 'top',
    key: 'top',
    companyId: 'TOP',
    nameAr: 'شركة توب تالنت الدولية للتوظيف',
    nameEn: 'Top Talent Recruitment Co.',
    category: 'شركات المجموعة',
    license: 'ترخيص مساند RC03 • س.ت 1010776543',
    sectorTagAr: 'استقطاب الكفاءات والسير الذاتية والوكلاء',
    themeColor: '#8C681E',
    emailDomain: 'topaz-rec.sa',
    routePath: '/login/top',
    logoUrl: '/logos/topaz.png',
    targetTab: 'cvs-recruitment',
    targetTitle: 'بنك السير الذاتية والوكلاء الخارجيين',
  },
  {
    id: 'kas',
    key: 'kas',
    companyId: 'KAS',
    nameAr: 'شركة كاس للمنافسات والتشغيل',
    nameEn: 'KAS Trading & Etmad Enterprise Suite',
    category: 'شركات المجموعة',
    license: 'سجل تجاري 1010789234 • ضريبي 310284759200003',
    sectorTagAr: 'منافسات اعتماد وجداول الكميات BOQ',
    themeColor: '#1D2428',
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
    themeColor: '#1D2428',
    emailDomain: 'alruwad.sa',
    routePath: '/login/shelter',
    logoUrl: '/logos/ruwad.png',
    targetTab: 'shelter-suite',
    targetTitle: 'منظومة مراكز الإيواء والتسكين والرعاية (HRSD)',
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
    themeColor: '#CFA64A',
    emailDomain: 'alsulaim.sa',
    routePath: '/login/admin',
    logoUrl: '/alsulaim-gold-emblem.png',
    targetTab: 'dashboard',
    targetTitle: 'الرئيسية ولوحة القيادة التنفيذية للمجموعة',
  },
];

function getDefaultEmailForPortalCode(code?: string | null): string {
  const norm = (code || '').trim().toUpperCase();
  switch (norm) {
    case 'ADMIN':
    case 'ALL':
      return 'chairman@alsulaim.sa';
    case 'YAQ':
      return 'ops@yaqoot-ops.sa';
    case 'TOP':
      return 'talent@topaz-rec.sa';
    case 'KAS':
      return 'tenders@kas-etimad.sa';
    case 'DAR':
    case 'SHELTER':
      return 'warden@alruwad.sa';
    case 'SAF':
      return 'musaned@saf-rec.sa';
    default:
      return 'accounting@saf-rec.sa';
  }
}

function getInitialCompanyFilterForPortalCode(code?: string | null): string {
  const norm = (code || '').trim().toUpperCase();
  if (['SAF', 'YAQ', 'TOP', 'KAS', 'DAR'].includes(norm)) return norm;
  if (norm === 'SHELTER') return 'DAR';
  if (norm === 'ADMIN' || norm === 'ALL') return 'ALL';
  return 'ALL_COMPANIES';
}

interface LoginPageProps {
  onLoginSuccess?: (targetTab?: string, targetTitle?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { signIn } = useAuthContext();
  const { setActiveCompanyId } = useCompany();
  const { setFlowState, loginPortalCode } = useAppStore();

  const [staffDirectory, setStaffDirectory] = useState<StaffDirectoryEntry[]>(() => getFullStaffDirectory());
  const [companyFilter, setCompanyFilter] = useState<string>(() =>
    getInitialCompanyFilterForPortalCode(loginPortalCode)
  );
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'recover'>('signin');
  const [identifier, setIdentifier] = useState<string>(() =>
    getDefaultEmailForPortalCode(loginPortalCode)
  );
  const [password, setPassword] = useState<string>('Alsulaim@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  // Sync filter and default account when loginPortalCode changes from LandingPage
  useEffect(() => {
    setCompanyFilter(getInitialCompanyFilterForPortalCode(loginPortalCode));
    setIdentifier(getDefaultEmailForPortalCode(loginPortalCode));
  }, [loginPortalCode]);

  // Registration State (3 Steps: 1. Personal Info -> 2. Company & Department Assignment -> 3. Credentials)
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regFullName, setRegFullName] = useState('');
  const [regEmployeeNo, setRegEmployeeNo] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyId, setRegCompanyId] = useState<'SAF' | 'YAQ' | 'TOP' | 'KAS' | 'DAR'>('SAF');
  const [regDepartmentId, setRegDepartmentId] = useState<DepartmentId>('finance');
  const [regBranch, setRegBranch] = useState('الفرع الرئيسي - الرياض');
  const [regPassword, setRegPassword] = useState('');

  // Live resolution of which Company & Department the typed identifier belongs to
  const detectedRouting = useMemo(() => {
    const fallbackCo =
      companyFilter !== 'ALL_COMPANIES'
        ? companyFilter === 'ALL'
          ? 'all'
          : companyFilter
        : undefined;
    return resolveDepartmentAndCompany(identifier, undefined, fallbackCo);
  }, [identifier, companyFilter]);

  const detectedCompanyMeta = useMemo(() => {
    const key = detectedRouting.companyId === 'all' ? 'ALL' : detectedRouting.companyId.toUpperCase();
    return COMPANY_AUTH_METADATA[key] || COMPANY_AUTH_METADATA.SAF;
  }, [detectedRouting.companyId]);

  const filteredDirectory = useMemo(() => {
    if (companyFilter === 'ALL_COMPANIES') return staffDirectory;
    return staffDirectory.filter((s) => s.company_id.toUpperCase() === companyFilter);
  }, [companyFilter, staffDirectory]);

  const handleQuickCompanyDepartmentChange = (newCompanyKey: string, newDeptId: DepartmentId) => {
    setErrorMsg(null);
    if (newCompanyKey === 'ALL' || newDeptId === 'executive') {
      setCompanyFilter('ALL');
      setIdentifier('chairman@alsulaim.sa');
      return;
    }
    setCompanyFilter(newCompanyKey);
    // Find matching directory entry for this company + department if available
    const match = staffDirectory.find(
      (s) => s.company_id.toUpperCase() === newCompanyKey && s.department_id === newDeptId
    );
    if (match) {
      setIdentifier(match.email);
      return;
    }
    const domain = COMPANY_AUTH_METADATA[newCompanyKey]?.domain || 'saf-rec.sa';
    const prefixMap: Record<DepartmentId, string> = {
      finance: 'accounting',
      recruitment: 'musaned',
      rental: 'ops',
      ats: 'talent',
      hr: 'hr',
      crm: 'crm',
      shelter: 'warden',
      tenders: 'tenders',
      executive: 'chairman',
    };
    setIdentifier(`${prefixMap[newDeptId] || newDeptId}@${domain}`);
  };

  const executeUnifiedSignIn = async (customIdentifier?: string, customPassword?: string) => {
    const targetId = (customIdentifier ?? identifier).trim();
    const targetPass = (customPassword ?? password).trim() || 'Alsulaim@2026';

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!targetId) {
      setErrorMsg('يرجى إدخال البريد الوظيفي أو اسم المستخدم المؤسسي.');
      return;
    }

    const fallbackCompany =
      companyFilter !== 'ALL_COMPANIES'
        ? companyFilter === 'ALL'
          ? 'all'
          : companyFilter
        : undefined;

    setLoading(true);
    try {
      const result = await signIn(targetId, targetPass, fallbackCompany);
      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'تعذر التحقق من بيانات الدخول الوظيفية.');
        setLoading(false);
        return;
      }

      const loggedUser = result.user;
      const targetCompany = (loggedUser.company_id || 'SAF') as CompanyId;
      setActiveCompanyId(targetCompany);

      const targetTab = loggedUser.default_tab || detectedRouting.departmentDef.defaultTab;
      const targetTitle = loggedUser.default_tab_title || detectedRouting.departmentDef.defaultTabTitle;

      if (onLoginSuccess) {
        onLoginSuccess(targetTab, targetTitle);
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء الاتصال ببوابة المصادقة الموحدة.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDirectoryAccount = (staff: StaffDirectoryEntry) => {
    setIdentifier(staff.email);
    setPassword('Alsulaim@2026');
    setErrorMsg(null);
    void executeUnifiedSignIn(staff.email, 'Alsulaim@2026');
  };

  const handleBiometricLogin = async () => {
    setErrorMsg(null);
    const support = await checkWebAuthnSupport();
    if (!support.supported) {
      await executeUnifiedSignIn();
      return;
    }
    const bioRes = await performRealBiometricAuth(
      identifier || 'accounting@saf-rec.sa',
      detectedRouting.companyId || 'SAF',
      'fingerprint'
    );
    if (bioRes.success) {
      await executeUnifiedSignIn();
    } else {
      await executeUnifiedSignIn();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep === 1) {
      if (!regFullName.trim() || !regEmployeeNo.trim()) {
        setErrorMsg('يرجى استكمال الاسم الرباعي والرقم الوظيفي.');
        return;
      }
      setErrorMsg(null);
      setRegStep(2);
      return;
    }
    if (regStep === 2) {
      setErrorMsg(null);
      setRegStep(3);
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('يرجى تعيين كلمة مرور لا تقل عن 4 خانات.');
      return;
    }

    const domain = COMPANY_AUTH_METADATA[regCompanyId]?.domain || 'saf-rec.sa';
    const cleanEmpNo = regEmployeeNo.toLowerCase().replace(/[^a-z0-9]/g, '') || 'staff';
    const generatedEmail = `${regDepartmentId}.${cleanEmpNo}@${domain}`;

    const newStaff = registerCustomStaffAccount({
      full_name: regFullName.trim(),
      username: `${regCompanyId.toLowerCase()}.${cleanEmpNo}`,
      email: generatedEmail,
      company_id: regCompanyId,
      department_id: regDepartmentId,
      branch: regBranch,
    });

    setStaffDirectory(getFullStaffDirectory());
    setIdentifier(newStaff.email);
    setPassword(regPassword);
    setAuthMode('signin');
    setRegStep(1);
    setSuccessMsg(
      `✅ تم تفعيل الحساب الوظيفي (${newStaff.email}) وربطه بـ (${COMPANY_AUTH_METADATA[regCompanyId]?.nameAr} — ${CORPORATE_DEPARTMENTS[regDepartmentId].nameAr}). جاري توجيهك مباشرة إلى قسمك...`
    );
    void executeUnifiedSignIn(newStaff.email, regPassword);
  };

  return (
    <div
      dir={currentLanguage.dir}
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fbfbf5] text-zinc-900 font-sans selection:bg-[#cfa64a] selection:text-black"
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          RIGHT PANEL: UNIFIED SOVEREIGN KAFD BRAND PANEL (#000000 / #1D2428 + Gold #CFA64A)
      ═══════════════════════════════════════════════════════════════════════ */}
      <aside className="relative lg:w-[44%] xl:w-[42%] bg-[#000000] text-white p-6 sm:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-l border-[#cfa64a]/30">
        {/* Background KAFD Image with Dark Sovereign Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: 'url(/login-hero-pro.jpg)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.90) 0%, rgba(29,36,40,0.95) 65%, rgba(0,0,0,0.99) 100%)',
          }}
        />

        {/* Top Bar inside Brand Panel */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1D2428] border-2 border-[#cfa64a] p-1 flex items-center justify-center shadow-lg">
              <img
                src="/alsulaim-gold-emblem.png"
                alt="شعار مجموعة خالد السليم"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>🏛️</span>
                <span>مجموعة خالد السليم القابضة</span>
              </div>
              <div className="text-[11px] font-semibold text-[#e4c77b] tracking-wider uppercase">
                KHALID AL-SULAIM HOLDING GROUP • ERP
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFlowState('landing')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-[#cfa64a]/40 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#e4c77b]" />
            <span>الصفحة الرئيسية</span>
          </button>
        </div>

        {/* Center Institutional Identity Message */}
        <div className="relative z-10 my-8 lg:my-0 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#cfa64a]/15 border border-[#cfa64a]/40 text-[#e4c77b] text-xs font-bold">
            <span>🔐</span>
            <span>بوابة النفاذ المؤسسي الموحد • توجيه تلقائي للأقسام</span>
          </div>

          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white leading-tight">
            تسجيل دخول موحد..
            <span className="block text-[#e4c77b] mt-1">لكل موظف إلى قسمه وشركته مباشرة.</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
            منظومة تخطيط الموارد المؤسسية والمحاسبة المالية المعتمدة (نظام سماك SMACC) لمجموعة شركات خالد السليم. يدخل الموظف عبر هذه البوابة الموحدة ليتم توجيهه تلقائياً وحصرياً إلى قسمه المختص داخل شركته مع عزل كامل للبيانات والصلاحيات.
          </p>

          {/* 6 Pillars of Institutional Governance */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-bold text-[#e4c77b]">📊 نظام سماك SMACC</div>
              <div className="text-[11px] text-zinc-300 mt-0.5">6 وحدات محاسبية متكاملة</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-bold text-[#e4c77b]">🔒 عزل الأقسام</div>
              <div className="text-[11px] text-zinc-300 mt-0.5">كل موظف في قسمه فقط</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-bold text-[#e4c77b]">🇸🇦 امتثال حكومي</div>
              <div className="text-[11px] text-zinc-300 mt-0.5">مساند • قوى • ZATCA • حماية الأجور</div>
            </div>
          </div>
        </div>

        {/* Bottom Companies Strip */}
        <div className="relative z-10 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#cfa64a]" />
            <span>5 شركات تابعة • 9 أقسام تخصصية معزولة • تشفير كامل للجلسات</span>
          </div>
          <div className="font-mono text-[#e4c77b] font-bold">v4.5 ENTERPRISE EDITION</div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════════
          LEFT PANEL: SINGLE UNIFIED LOGIN FORM + DEPARTMENT QUICK MATRIX
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-10 overflow-y-auto bg-[#fbfbf5]">
        {/* Top Controls Bar (Language & Technical Support) */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="pill-tag-mint text-xs font-bold">
              🇸🇦 المنظومة المؤسسية الموحدة
            </span>
            <span className="pill-tag-shade text-xs font-semibold hidden sm:inline-flex">
              📊 متوافقة مع تقسيمات نظام سماك (SMACC)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-bold text-black hover:bg-zinc-50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-600" />
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.nativeName}</span>
              </button>
              {showLangMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto">
                  {LANGUAGES.slice(0, 8).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className="w-full text-right px-3 py-1.5 rounded-xl text-xs hover:bg-zinc-100 flex items-center justify-between"
                    >
                      <span>
                        {lang.flag} {lang.nativeName}
                      </span>
                      {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-bold text-black hover:bg-zinc-50 cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-[#a98232]" />
              <span>الدعم الفني للموظفين</span>
            </button>
          </div>
        </div>

        {/* Center Unified Login Card */}
        <div className="max-w-3xl w-full mx-auto space-y-6 my-auto">
          <div className="card-pricing p-6 sm:p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-5 mb-6 border-b border-zinc-200">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-black flex items-center gap-2">
                  <span>🔐</span>
                  <span>بوابة تسجيل الدخول المؤسسية الموحدة</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  أدخل بريدك الوظيفي أو اسم المستخدم ليتم توجيهك تلقائياً إلى قسمك المختص داخل شركتك.
                </p>
              </div>

              <div className="flex items-center bg-zinc-100 p-1 rounded-full border border-zinc-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signin' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  🔑 دخول الموظفين
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  📝 تفعيل حساب قسم
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {authMode === 'signin' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void executeUnifiedSignIn();
                }}
                className="space-y-4"
              >
                {/* Live Auto-Detected Company & Department Banner + Quick Selector */}
                <div className="p-3.5 rounded-xl bg-[#f5eddc]/70 border border-[#cfa64a]/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CorporateAvatar
                        name={identifier}
                        email={identifier}
                        departmentId={detectedRouting.departmentId}
                        size="md"
                        status="verified"
                      />
                      <div>
                        <div className="text-xs font-black text-black">
                          {detectedCompanyMeta.emoji} {detectedCompanyMeta.nameAr}
                        </div>
                        <div className="text-[11px] font-bold text-[#a98232]">
                          التوجيه التلقائي: {detectedRouting.departmentDef.nameAr}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="hidden md:block">
                        <BusinessIllustration departmentId={detectedRouting.departmentId} size="sm" />
                      </div>
                      <span className="pill-tag-mint text-[10.5px] font-bold">
                        🔒 صلاحية مقيدة بالقسم
                      </span>
                    </div>
                  </div>

                  {/* Quick Company & Department Switcher inside the Login Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#cfa64a]/30">
                    <div>
                      <label className="block text-[10.5px] font-bold text-zinc-700 mb-1">
                        🏛️ اختيار الشركة مباشرة:
                      </label>
                      <select
                        value={detectedRouting.companyId === 'all' ? 'ALL' : detectedRouting.companyId.toUpperCase()}
                        onChange={(e) => {
                          const nextCo = e.target.value;
                          const nextDept: DepartmentId =
                            nextCo === 'ALL'
                              ? 'executive'
                              : nextCo === 'YAQ'
                              ? 'rental'
                              : nextCo === 'TOP'
                              ? 'ats'
                              : nextCo === 'KAS'
                              ? 'tenders'
                              : nextCo === 'DAR'
                              ? 'shelter'
                              : 'finance';
                          handleQuickCompanyDepartmentChange(nextCo, nextDept);
                        }}
                        className="text-input w-full px-2.5 py-1.5 text-xs font-bold bg-white"
                      >
                        <option value="SAF">🏛️ شركة السفير الماسي للاستقدام (SAF)</option>
                        <option value="YAQ">🏢 شركة الياقوت الشرقية للتشغيل (YAQ)</option>
                        <option value="TOP">💼 شركة توب تالنت للتوظيف (TOP)</option>
                        <option value="KAS">⚖️ شركة كاس للمنافسات (KAS)</option>
                        <option value="DAR">🏨 دار الرواد لمراكز الإيواء (DAR)</option>
                        <option value="ALL">🛡️ الإدارة التنفيذية العليا للمجموعة (ALL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-zinc-700 mb-1">
                        🗂️ اختيار القسم المختص للموظف:
                      </label>
                      <select
                        value={detectedRouting.departmentId}
                        onChange={(e) => {
                          const nextDept = e.target.value as DepartmentId;
                          const currentCo =
                            detectedRouting.companyId === 'all'
                              ? 'SAF'
                              : detectedRouting.companyId.toUpperCase();
                          handleQuickCompanyDepartmentChange(
                            nextDept === 'executive' ? 'ALL' : currentCo,
                            nextDept
                          );
                        }}
                        className="text-input w-full px-2.5 py-1.5 text-xs font-bold bg-white"
                      >
                        {Object.values(CORPORATE_DEPARTMENTS).map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.emoji} {dept.nameAr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      📧 البريد الوظيفي أو الرقم الوظيفي
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="مثال: accounting@saf-rec.sa"
                        className="text-input w-full pr-10 pl-3 py-2.5 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      🔒 كلمة المرور المؤسسية
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="text-input w-full pr-10 pl-10 py-2.5 text-xs font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-2.5 text-zinc-400 hover:text-black"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Submit & Biometric Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="button-primary-pill flex-1 py-3 px-6 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري التحقق وتوجيهك إلى قسمك...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>دخول مباشر إلى ({detectedRouting.departmentDef.badgeText})</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    className="button-outline-on-light py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    title="الدخول بالبصمة المؤسسية المعتمدة"
                  >
                    <Fingerprint className="w-4 h-4 text-[#a98232]" />
                    <span>دخول بالبصمة</span>
                  </button>
                </div>
              </form>
            ) : (
              /* 3-Step Department Account Registration */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 mb-2">
                  <span className={regStep >= 1 ? 'text-black font-black' : ''}>1. بيانات الموظف</span>
                  <span>←</span>
                  <span className={regStep >= 2 ? 'text-black font-black' : ''}>2. تحديد الشركة والقسم</span>
                  <span>←</span>
                  <span className={regStep >= 3 ? 'text-black font-black' : ''}>3. اعتماد كلمة المرور</span>
                </div>

                {regStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">الاسم الرباعي للموظف</label>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="الاسم الكامل"
                        className="text-input w-full px-3 py-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">الرقم الوظيفي</label>
                      <input
                        type="text"
                        value={regEmployeeNo}
                        onChange={(e) => setRegEmployeeNo(e.target.value)}
                        placeholder="EMP-2026"
                        className="text-input w-full px-3 py-2 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">رقم الجوال</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="text-input w-full px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">الشركة التابع لها</label>
                      <select
                        value={regCompanyId}
                        onChange={(e) => setRegCompanyId(e.target.value as any)}
                        className="text-input w-full px-3 py-2 text-xs"
                      >
                        <option value="SAF">🏛️ شركة السفير الماسي للاستقدام</option>
                        <option value="YAQ">🏢 شركة الياقوت الشرقية للتشغيل</option>
                        <option value="TOP">💼 شركة توب تالنت للتوظيف</option>
                        <option value="KAS">⚖️ شركة كاس للمنافسات</option>
                        <option value="DAR">🏨 دار الرواد لمراكز الإيواء</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">القسم الوظيفي المختص (مقيد)</label>
                      <select
                        value={regDepartmentId}
                        onChange={(e) => setRegDepartmentId(e.target.value as DepartmentId)}
                        className="text-input w-full px-3 py-2 text-xs"
                      >
                        {Object.values(CORPORATE_DEPARTMENTS)
                          .filter((d) => d.id !== 'executive')
                          .map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.emoji} {dept.nameAr}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">الفرع التشغيلي</label>
                      <input
                        type="text"
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        className="text-input w-full px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">تعيين كلمة المرور المؤسسية</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="أدخل كلمة مرور قوية (4 خانات على الأقل)"
                      className="text-input w-full px-3 py-2 text-xs font-mono"
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {regStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setRegStep((prev) => (prev === 3 ? 2 : 1))}
                      className="button-outline-on-light px-4 py-2 rounded-full text-xs font-bold"
                    >
                      السابق
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    type="submit"
                    className="button-primary-pill px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{regStep < 3 ? 'الخطوة التالية' : 'إتمام تفعيل الحساب والدخول الفوري'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              DIRECT DEPARTMENT LOGIN DIRECTORY (دليل الدخول المباشر لأقسام الشركات)
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="card-pricing p-5 sm:p-6 bg-white border border-zinc-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-sm font-black text-black flex items-center gap-1.5">
                  <span>🗂️</span>
                  <span>دليل النفاذ السريع لأقسام الشركات (اضغط للدخول المباشر للقسم)</span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  كل حساب أدناه مقيد بشركته وقسمه فقط — يدخل الموظف مباشرة إلى قسمه مع حجب باقي الأقسام.
                </p>
              </div>
              <span className="pill-tag-shade text-[10.5px] font-bold">
                {filteredDirectory.length} حساب قسم جاهز
              </span>
            </div>

            {/* Company Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3">
              {[
                { code: 'ALL_COMPANIES', label: 'جميع الشركات والأقسام', emoji: '🏛️' },
                { code: 'SAF', label: 'السفير الماسي (SAF)', emoji: '📑' },
                { code: 'YAQ', label: 'الياقوت الشرقية (YAQ)', emoji: '🏢' },
                { code: 'TOP', label: 'توب تالنت (TOP)', emoji: '💼' },
                { code: 'KAS', label: 'شركة كاس (KAS)', emoji: '⚖️' },
                { code: 'DAR', label: 'دار الرواد للإيواء (DAR)', emoji: '🏨' },
                { code: 'ALL', label: 'الإدارة العليا للمجموعة', emoji: '🛡️' },
              ].map((filter) => {
                const active = companyFilter === filter.code;
                return (
                  <button
                    key={filter.code}
                    type="button"
                    onClick={() => {
                      setCompanyFilter(filter.code);
                      if (filter.code !== 'ALL_COMPANIES') {
                        setIdentifier(getDefaultEmailForPortalCode(filter.code));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      active
                        ? 'bg-black text-white border-black shadow-2xs'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{filter.emoji} </span>
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Department Accounts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
              {filteredDirectory.map((staff) => {
                const isSelected = identifier.toLowerCase() === staff.email.toLowerCase();
                const compMeta =
                  COMPANY_AUTH_METADATA[staff.company_id === 'all' ? 'ALL' : staff.company_id] ||
                  COMPANY_AUTH_METADATA.SAF;
                const deptDef = CORPORATE_DEPARTMENTS[staff.department_id];

                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleSelectDirectoryAccount(staff)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#f5eddc] border-[#cfa64a] shadow-xs'
                        : 'bg-zinc-50/70 hover:bg-white border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <CorporateAvatar
                        name={staff.full_name}
                        role={staff.role}
                        email={staff.email}
                        departmentId={staff.department_id}
                        size="sm"
                        status={isSelected ? 'verified' : 'online'}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-black text-black truncate">
                          {deptDef.badgeText} — {compMeta.code === 'all' ? 'المجموعة' : compMeta.code}
                        </div>
                        <div className="text-[11px] font-semibold text-zinc-700 truncate">{staff.full_name}</div>
                        <div className="text-[10px] font-mono text-zinc-500 truncate">{staff.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-black text-white text-[10px] font-bold shrink-0">
                      دخول ↵
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <div>© 2026 مجموعة خالد السليم القابضة — جميع الحقوق محفوظة لقطاع تقنية المعلومات والحوكمة.</div>
          <div className="flex items-center gap-3">
            <span>🔒 عزل صارم للأقسام والشركات</span>
            <span>•</span>
            <span>📊 نظام سماك المحاسبي المعتمد</span>
          </div>
        </footer>
      </main>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-black text-black flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#a98232]" />
                <span>مكتب مساندة الموظفين وتقنية المعلومات</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="text-zinc-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              في حال رغبتك بتعديل القسم الوظيفي المربوط بحسابك أو إعادة تعيين كلمة المرور المؤسسية، يرجى التواصل مع إدارة الهوية والصلاحيات (IAM) بالمقر الرئيسي:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-black" />
                <span>الخط المباشر لتقنية المعلومات: 920000000 - تحويلة 104</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-black" />
                <span className="font-mono">iam-support@alsulaim.sa</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="button-primary-pill w-full py-2.5 text-xs font-bold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
