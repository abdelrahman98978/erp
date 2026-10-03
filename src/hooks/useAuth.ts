import { useState, useEffect, useCallback } from 'react';
import { authService, UserProfile, MfaRequirement, TotpEnrollment } from '../services/authService';

export interface AuthContext {
  user: UserProfile | null;
  session: any;
  /** True until the initial Supabase session + MFA level have been resolved. */
  loading: boolean;
  error: string | null;
  /** Remaining MFA step for the current session ('none' when fully authenticated). */
  mfaRequirement: MfaRequirement;
  /**
   * The ONLY flag that should gate access to protected areas:
   * a real Supabase session exists AND MFA requirements are satisfied.
   */
  isAuthenticated: boolean;
  signIn: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; mfa?: MfaRequirement }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  verifyMfa: (code: string, factorId?: string) => Promise<{ success: boolean; error?: string }>;
  enrollMfa: () => Promise<{ data: TotpEnrollment | null; error: string | null }>;
  refreshMfa: () => Promise<MfaRequirement>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isFinance: boolean;
  isHR: boolean;
  isOperations: boolean;
  isCustomerService: boolean;
}

export const useAuth = (): AuthContext => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaRequirement, setMfaRequirement] = useState<MfaRequirement>('none');

  const refreshMfa = useCallback(async () => {
    const req = await authService.getMfaRequirement();
    setMfaRequirement(req);
    return req;
  }, []);

  useEffect(() => {
    let active = true;

    authService.getSession().then(async ({ session: initial, error: sessionError }) => {
      if (!active) return;
      if (sessionError) console.warn('Auth session error:', sessionError);
      setSession(initial);
      setUser(initial?.user?.profile || null);
      if (initial) await refreshMfa();
      if (active) setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange(async (event, next) => {
      if (!active) return;
      setSession(next);
      setUser(next?.user?.profile || null);
      if (next) {
        await refreshMfa();
      } else {
        setMfaRequirement('none');
      }
      if (active && event !== 'INITIAL_SESSION') setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refreshMfa]);

  const signIn = useCallback(async (identifier: string, password: string) => {
    setError(null);
    const { data, error: signInError, mfa } = await authService.signIn(identifier, password);
    if (signInError || !data) {
      const errMsg = signInError?.message || 'فشل تسجيل الدخول';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
    setUser(data);
    setMfaRequirement(mfa);
    return { success: true, mfa };
  }, []);

  const verifyMfa = useCallback(async (code: string, factorId?: string) => {
    setError(null);
    const result = await authService.verifyTotp(code, factorId);
    if (!result.success) {
      setError(result.error);
      return { success: false, error: result.error || undefined };
    }
    await refreshMfa();
    return { success: true };
  }, [refreshMfa]);

  const enrollMfa = useCallback(() => authService.enrollTotp(), []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const { error: googleError } = await authService.signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
      return { success: false, error: googleError.message };
    }
    return { success: true };
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setMfaRequirement('none');
  }, []);

  return {
    user,
    session,
    loading,
    error,
    mfaRequirement,
    isAuthenticated: Boolean(session?.user) && mfaRequirement === 'none',
    signIn,
    signInWithGoogle,
    verifyMfa,
    enrollMfa,
    refreshMfa,
    signOut,
    isAdmin: authService.isAdmin(user),
    isFinance: authService.isFinance(user),
    isHR: authService.isHR(user),
    isOperations: authService.isOperations(user),
    isCustomerService: authService.isCustomerService(user),
  };
};

export default useAuth;