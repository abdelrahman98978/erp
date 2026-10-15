import { supabase, isSupabaseConfigured, supabaseConfigError } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  branch: string;
  company_id?: string;
  status: string;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  error: string | null;
}

/**
 * MFA state of the current session:
 *  - 'none'   : session is fully authenticated (aal2, or MFA not required and no factor enrolled)
 *  - 'verify' : user has a verified TOTP factor and must enter a code (session is aal1)
 *  - 'enroll' : MFA is required but the user has not enrolled a TOTP factor yet
 */
export type MfaRequirement = 'none' | 'verify' | 'enroll';

/** MFA is mandatory unless explicitly disabled with VITE_REQUIRE_MFA=false. */
export const MFA_REQUIRED: boolean = import.meta.env.VITE_REQUIRE_MFA !== 'false';

export interface TotpEnrollment {
  factorId: string;
  qrCode: string; // SVG data URI
  secret: string;
  uri: string;
}

// ─── Client-side throttle (UX only) ────────────────────────────
// Real brute-force protection is enforced server-side by Supabase Auth rate limits
// ([auth.rate_limit] in supabase/config.toml). This only slows down repeated attempts in the same tab.
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000;

interface LoginAttemptRecord {
  attempts: number;
  lockedUntil: number | null;
}

const loginAttemptTracker = new Map<string, LoginAttemptRecord>();

function checkThrottle(email: string): { blocked: boolean; remainingSeconds?: number } {
  const record = loginAttemptTracker.get(email);
  if (!record?.lockedUntil) return { blocked: false };
  if (Date.now() < record.lockedUntil) {
    return { blocked: true, remainingSeconds: Math.ceil((record.lockedUntil - Date.now()) / 1000) };
  }
  loginAttemptTracker.delete(email);
  return { blocked: false };
}

function recordFailedAttempt(email: string): void {
  const record = loginAttemptTracker.get(email) || { attempts: 0, lockedUntil: null };
  record.attempts += 1;
  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  loginAttemptTracker.set(email, record);
}

function clearFailedAttempts(email: string): void {
  loginAttemptTracker.delete(email);
}

/**
 * Username aliases → login email. These are NOT secrets (no passwords),
 * they only let staff type their short username instead of the full email.
 */
const USERNAME_EMAIL_ALIASES: Record<string, string> = {
  'khalid.admin': 'khalid@alsulaim.sa',
  'super.admin': 'admin@alsulaim.sa',
  'finance.manager': 'finance@alsulaim.sa',
  'operation.user': 'ops@alsulaim.sa',
};

export interface CompanyAuthMetadata {
  code: string;
  nameAr: string;
  domain: string;
}

export const COMPANY_AUTH_METADATA: Record<string, CompanyAuthMetadata> = {
  SAF: {
    code: 'SAF',
    nameAr: 'شركة السفير الماسي للاستقدام',
    domain: 'saf-rec.sa',
  },
  YAQ: {
    code: 'YAQ',
    nameAr: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    domain: 'yaqoot-ops.sa',
  },
  TOP: {
    code: 'TOP',
    nameAr: 'شركة توب تالنت الدولية للتوظيف والـ ATS',
    domain: 'topaz-rec.sa',
  },
  KAS: {
    code: 'KAS',
    nameAr: 'مؤسسة كاس وسحابة اعتماد للمنافسات',
    domain: 'kas-etimad.sa',
  },
  DAR: {
    code: 'DAR',
    nameAr: 'دار الرواد لمراكز الإيواء والخدمات اللوجستية',
    domain: 'alruwad.sa',
  },
  ALL: {
    code: 'all',
    nameAr: 'الإدارة المركزية لمجموعة خالد السليم القابضة',
    domain: 'alsulaim.sa',
  },
};

const AUTH_USER_CACHE_KEY = 'ALSULAIM_AUTH_USER';
export const LOCKED_SESSION_COMPANY_KEY = 'ALSULAIM_LOCKED_SESSION_COMPANY';

const notConfiguredError = () => ({
  message: supabaseConfigError || 'قاعدة البيانات غير مُعدّة. لا يمكن تسجيل الدخول.',
});

function cacheProfile(profile: UserProfile | null): void {
  try {
    if (profile) localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(AUTH_USER_CACHE_KEY);
  } catch {
    // storage unavailable (private mode) — cache is optional
  }
}

export function setLockedSessionCompany(companyId: string | null): void {
  try {
    if (companyId) {
      localStorage.setItem(LOCKED_SESSION_COMPANY_KEY, companyId);
    } else {
      localStorage.removeItem(LOCKED_SESSION_COMPANY_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function getLockedSessionCompany(): string | null {
  try {
    return localStorage.getItem(LOCKED_SESSION_COMPANY_KEY);
  } catch {
    return null;
  }
}

function buildProfileFromAuthUser(authUser: any, identifier: string): UserProfile {
  const appMeta = authUser?.app_metadata || {};
  const userMeta = authUser?.user_metadata || {};
  return {
    id: authUser.id,
    username: userMeta.username || identifier,
    full_name: userMeta.full_name || authUser.email || 'مستخدم',
    email: authUser.email || '',
    // Role and company_id MUST come from app_metadata (only editable with the service role).
    // user_metadata is writable by the user themself and must never grant privileges.
    role: appMeta.role || 'مستخدم',
    branch: appMeta.branch || userMeta.branch || '',
    company_id: appMeta.company_id || 'SAF',
    status: 'نشط',
    created_at: authUser.created_at || new Date().toISOString(),
  };
}

export const authService = {
  /** Return the official email domain for a specific company portal. */
  getCompanyEmailDomain(companyId?: string): string {
    const key = (companyId || 'ALL').trim().toUpperCase();
    return COMPANY_AUTH_METADATA[key]?.domain || 'alsulaim.sa';
  },

  /** Resolve a username or email to the login email. */
  resolveEmail(identifier: string, _targetCompanyId?: string): string {
    const clean = identifier.trim().toLowerCase();
    if (clean.includes('@')) return clean;
    return USERNAME_EMAIL_ALIASES[clean] || `${clean}@alsulaim.sa`;
  },

  /**
   * Deterministic Tenant Boundary Check:
   * Verifies that the authenticated user is authorized to enter the requested company portal.
   */
  validateCompanyAccess(
    profile: UserProfile | null,
    targetCompanyId?: string,
    extraAllowedCompanies: string[] = []
  ): { allowed: boolean; reason?: string } {
    if (!profile) {
      return { allowed: false, reason: 'لم يتم العثور على ملف تعريف المستخدم.' };
    }
    if (!targetCompanyId) {
      return { allowed: true };
    }

    const normalizedTarget = targetCompanyId.trim().toUpperCase();
    const normalizedUserCompany = (profile.company_id || 'SAF').trim().toUpperCase();
    const isGroupAdmin = this.isAdmin(profile) || normalizedUserCompany === 'ALL';

    // 1. Central Group Admin Portal (/login/admin -> targetCompanyId = 'all')
    if (normalizedTarget === 'ALL') {
      if (isGroupAdmin) {
        return { allowed: true };
      }
      const userCompName = COMPANY_AUTH_METADATA[normalizedUserCompany]?.nameAr || normalizedUserCompany;
      return {
        allowed: false,
        reason: `رفض أمني (عزل الصلاحيات): هذا الحساب يتبع لـ (${userCompName}) ولا يملك تصريح الدخول لبوابة الإدارة المركزية العليا للمجموعة.`,
      };
    }

    // 2. Group Super Admins can access any subsidiary portal for governance/auditing
    if (isGroupAdmin) {
      return { allowed: true };
    }

    // 3. Direct company match or explicit multi-company IAM membership
    const normalizedExtras = extraAllowedCompanies.map((c) => c.trim().toUpperCase());
    if (
      normalizedUserCompany === normalizedTarget ||
      normalizedExtras.includes(normalizedTarget) ||
      normalizedExtras.includes('*')
    ) {
      return { allowed: true };
    }

    const userCompName = COMPANY_AUTH_METADATA[normalizedUserCompany]?.nameAr || normalizedUserCompany;
    const targetCompName = COMPANY_AUTH_METADATA[normalizedTarget]?.nameAr || normalizedTarget;

    return {
      allowed: false,
      reason: `رفض أمني (عزل الشركات): هذا الحساب مسجل على ملاك (${userCompName}) ولا يملك تصريح الدخول عبر بوابة (${targetCompName}) المستقلة.`,
    };
  },

  /**
   * Sign in against Supabase Auth ONLY, enforcing strict per-company portal isolation.
   * On success the session may still require MFA — check `mfa` in the result.
   */
  async signIn(
    identifier: string,
    password: string,
    targetCompanyId?: string
  ): Promise<{
    data: UserProfile | null;
    error: { message: string } | null;
    mfa: MfaRequirement;
  }> {
    if (!identifier?.trim() || !password) {
      return { data: null, error: { message: 'يرجى إدخال اسم المستخدم وكلمة المرور' }, mfa: 'none' };
    }
    if (!isSupabaseConfigured) {
      return { data: null, error: notConfiguredError(), mfa: 'none' };
    }

    const email = this.resolveEmail(identifier, targetCompanyId);
    const throttle = checkThrottle(email);
    if (throttle.blocked) {
      return {
        data: null,
        error: { message: `تم إيقاف المحاولة مؤقتاً بسبب محاولات فاشلة متعددة. حاول بعد ${throttle.remainingSeconds} ثانية.` },
        mfa: 'none',
      };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError || !authData?.user) {
        recordFailedAttempt(email);
        const msg = authError?.message?.toLowerCase() || '';
        if (msg.includes('rate') || msg.includes('too many')) {
          return { data: null, error: { message: 'محاولات كثيرة جداً. يرجى الانتظار قليلاً ثم المحاولة مجدداً.' }, mfa: 'none' };
        }
        return { data: null, error: { message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, mfa: 'none' };
      }

      clearFailedAttempts(email);
      const { data: dbProfile } = await this.getUserProfile(authData.user.id);
      const profile: UserProfile = dbProfile
        ? { ...buildProfileFromAuthUser(authData.user, identifier), ...dbProfile }
        : buildProfileFromAuthUser(authData.user, identifier);

      // Fetch any additional IAM company memberships if targetCompanyId is specified
      let extraMemberships: string[] = [];
      if (targetCompanyId) {
        try {
          const { data: memRows } = await supabase
            .from('user_company_memberships')
            .select('company_id, company_code, status')
            .eq('user_id', profile.id);
          if (Array.isArray(memRows)) {
            extraMemberships = memRows
              .filter((r: any) => !r.status || r.status === 'نشط' || r.status === 'active')
              .flatMap((r: any) => [r.company_id, r.company_code].filter(Boolean));
          }
        } catch {
          // Membership lookup is optional if table is empty
        }

        const accessCheck = this.validateCompanyAccess(profile, targetCompanyId, extraMemberships);
        if (!accessCheck.allowed) {
          await supabase.auth.signOut();
          cacheProfile(null);
          setLockedSessionCompany(null);
          return {
            data: null,
            error: { message: accessCheck.reason || 'غير مصرح بالدخول لهذه الشركة.' },
            mfa: 'none',
          };
        }
      }

      const resolvedLockedCompany =
        targetCompanyId || (profile.company_id ? profile.company_id : 'SAF');
      setLockedSessionCompany(resolvedLockedCompany);
      cacheProfile(profile);

      const mfa = await this.getMfaRequirement();
      return { data: profile, error: null, mfa };
    } catch (netErr: any) {
      return {
        data: null,
        error: { message: 'تعذّر الاتصال بخادم المصادقة. تحقق من الاتصال بالإنترنت.' },
        mfa: 'none',
      };
    }
  },

  /** Determine what MFA step (if any) the current session still needs. */
  async getMfaRequirement(): Promise<MfaRequirement> {
    if (!isSupabaseConfigured) return 'none';
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || !data) {
      // Fail closed: if we cannot determine the level, require verification/enrollment.
      return MFA_REQUIRED ? 'enroll' : 'none';
    }
    if (data.currentLevel === 'aal2') return 'none';
    if (data.nextLevel === 'aal2') return 'verify';
    return MFA_REQUIRED ? 'enroll' : 'none';
  },

  /** Start TOTP enrollment. Removes stale unverified TOTP factors first. */
  async enrollTotp(): Promise<{ data: TotpEnrollment | null; error: string | null }> {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const stale = (factors?.all || []).filter(f => f.factor_type === 'totp' && f.status !== 'verified');
    for (const f of stale) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `ERP-${new Date().toISOString().slice(0, 10)}`,
    });
    if (error || !data) {
      return {
        data: null,
        error: error?.message?.toLowerCase().includes('disabled')
          ? 'التحقق الثنائي (TOTP) غير مُفعّل في إعدادات Supabase. يرجى من مدير النظام تفعيله.'
          : error?.message || 'تعذّر بدء تسجيل التحقق الثنائي.',
      };
    }
    return {
      data: { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret, uri: data.totp.uri },
      error: null,
    };
  },

  /**
   * Verify a 6-digit TOTP code. If `factorId` is omitted, the user's first verified TOTP factor is used.
   * On success the session is upgraded to aal2.
   */
  async verifyTotp(code: string, factorId?: string): Promise<{ success: boolean; error: string | null }> {
    if (!/^\d{6}$/.test(code)) {
      return { success: false, error: 'يرجى إدخال رمز التحقق المكون من 6 أرقام' };
    }
    let targetFactorId = factorId;
    if (!targetFactorId) {
      const { data: factors, error } = await supabase.auth.mfa.listFactors();
      if (error) return { success: false, error: error.message };
      targetFactorId = factors?.totp?.[0]?.id;
      if (!targetFactorId) return { success: false, error: 'لا يوجد جهاز تحقق مسجّل لهذا الحساب.' };
    }
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: targetFactorId, code });
    if (error) {
      return { success: false, error: 'رمز التحقق غير صحيح أو منتهي الصلاحية.' };
    }
    return { success: true, error: null };
  },

  /** Get user profile from system_users table. */
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    if (!isSupabaseConfigured) return { data: null, error: notConfiguredError() };
    const { data, error } = await supabase.from('system_users').select('*').eq('id', userId).maybeSingle();
    if (error) return { data: null, error };
    return { data: (data as UserProfile) || null, error: null };
  },

  async signOut() {
    cacheProfile(null);
    setLockedSessionCompany(null);
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async signInWithGoogle(): Promise<{ error: { message: string } | null }> {
    if (!isSupabaseConfigured) {
      return { error: notConfiguredError() };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { error: { message: error.message } };
      return { error: null };
    } catch (e: any) {
      return { error: { message: e?.message || 'فشل الاتصال بخدمة Google' } };
    }
  },

  async getSession() {
    if (!isSupabaseConfigured) return { session: null, error: null };
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await this.getUserProfile(session.user.id);
        return {
          session: { ...session, user: { ...session.user, profile: profile || buildProfileFromAuthUser(session.user, session.user.email || '') } },
          error,
        };
      }
      return { session: null, error: null };
    } catch {
      return { session: null, error: null };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured) {
      callback('INITIAL_SESSION', null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        cacheProfile(null);
        callback(event, null);
        return;
      }
      // Do not await Supabase calls inside the auth callback (can deadlock the auth lock); defer instead.
      const authUser = session.user;
      setTimeout(async () => {
        const { data: profile } = await this.getUserProfile(authUser.id);
        const resolved = profile || buildProfileFromAuthUser(authUser, authUser.email || '');
        cacheProfile(resolved);
        callback(event, { ...session, user: { ...authUser, profile: resolved } });
      }, 0);
    });
  },

  isAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['رئيس المجموعة', 'مدير نظام', 'مدير تنفيذي'].includes(user.role);
  },

  isFinance(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['مدير مالي', 'محاسب', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  isHR(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['أخصائي موارد بشرية', 'مدير موارد بشرية', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  isOperations(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['مشرف تشغيل', 'مدير تشغيل', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  /**
   * Cached display profile of the logged-in user.
   * For DISPLAY ONLY — never use this to decide whether a user is authenticated or authorized.
   */
  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  },

  isCustomerService(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['أخصائي خدمة عملاء', 'مدير خدمة عملاء', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },
};

export default authService;