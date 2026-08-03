import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  branch: string;
  status: string;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  error: string | null;
}

export const authService = {
  /**
   * Sign in with email/username and password
   */
  async signIn(identifier: string, password: string) {
    // First try email
    const { data: emailData, error: emailError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password
    });

    if (!emailError) {
      return this.getUserProfile(emailData.user.id);
    }

    // If email fails, try username by looking up system_users
    const { data: userData, error: userError } = await supabase
      .from('system_users')
      .select('email')
      .eq('username', identifier)
      .eq('status', 'نشط')
      .single();

    if (userError || !userData) {
      return { data: null, error: { message: 'اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة' } };
    }

    // Try with found email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password
    });

    if (error) {
      return { data: null, error: { message: 'اسم المستخدم أو كلمة المرور غير صحيحة' } };
    }

    return this.getUserProfile(data.user.id);
  },

  /**
   * Get user profile from system_users table
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('system_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('User profile not found in system_users, using auth user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await this.getUserProfile(session.user.id);
      return { session: { ...session, user: { ...session.user, profile } }, error };
    }
    return { session: null, error: null };
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await this.getUserProfile(session.user.id);
        callback(event, { ...session, user: { ...session.user, profile } });
      } else {
        callback(event, null);
      }
    });
  },

  /**
   * Check if user has admin role
   */
  isAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['رئيس المجموعة', 'مدير نظام', 'مدير تنفيذي'].includes(user.role);
  },

  /**
   * Check if user has finance role
   */
  isFinance(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['مدير مالي', 'محاسب', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  /**
   * Check if user has HR role
   */
  isHR(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['أخصائي موارد بشرية', 'مدير موارد بشرية', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  /**
   * Check if user has operations role
   */
  isOperations(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['مشرف تشغيل', 'مدير تشغيل', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  },

  /**
   * Check if user has customer service role
   */
  isCustomerService(user: UserProfile | null): boolean {
    if (!user) return false;
    return ['أخصائي خدمة عملاء', 'مدير خدمة عملاء', 'رئيس المجموعة', 'مدير نظام'].includes(user.role);
  }
};

export default authService;