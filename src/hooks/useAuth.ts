import { useState, useEffect, useCallback } from 'react';
import { authService, UserProfile } from '../services/authService';

export interface AuthContext {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  error: string | null;
  signIn: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  useEffect(() => {
    // Get initial session
    authService.getSession().then(({ session, error }) => {
      if (error) {
        console.warn('Auth session error:', error);
      }
      setSession(session);
      setUser(session?.user?.profile || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user?.profile || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await authService.signIn(identifier, password);
    setLoading(false);

    if (error || !data) {
      const errMsg = error?.message || 'فشل تسجيل الدخول';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    setUser(data);
    setError(null);
    return { success: true };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
    isAdmin: authService.isAdmin(user),
    isFinance: authService.isFinance(user),
    isHR: authService.isHR(user),
    isOperations: authService.isOperations(user),
    isCustomerService: authService.isCustomerService(user)
  };
};

export default useAuth;