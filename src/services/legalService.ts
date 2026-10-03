/**
 * Legal undertakings (policy acknowledgement) — server-side source of truth.
 *
 * Replaces the old `alsulaim_legal_acknowledged_<username>` localStorage flag,
 * which any user could set from DevTools. Rows live in `public.legal_undertakings`
 * (see migration 20261004000000_emergency_lockdown.sql) and are protected by RLS:
 * a user can only insert/select their own rows and can never update/delete them.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Bump this whenever the legal text changes to force everyone to re-sign. */
export const LEGAL_POLICY_VERSION = '2026.1';

export interface LegalSignatureInput {
  department: string;
  branch?: string;
  jobTitle?: string;
  employeeName?: string;
  username?: string;
  signatureDataUrl: string;
  /** 'drawn' = hand-drawn canvas signature; 'confirmation' = explicit click-through confirmation. */
  signatureMethod: 'drawn' | 'confirmation';
  ipAddress?: string;
}

export interface LegalSignatureResult {
  id: string;
  complianceHash: string;
  signedAt: string;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const legalService = {
  /**
   * Has the current authenticated user signed the given policy version?
   * Fails closed: any error (network, RLS, missing table) returns false so the
   * acknowledgement modal is shown again rather than silently skipped.
   */
  async hasSigned(version: string = LEGAL_POLICY_VERSION): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return false;

    const { data, error } = await supabase
      .from('legal_undertakings')
      .select('id')
      .eq('user_id', userId)
      .eq('policy_version', version)
      .limit(1);

    if (error) {
      console.warn('[legalService] hasSigned failed:', error.message);
      return false;
    }
    return Array.isArray(data) && data.length > 0;
  },

  /** Persist a signed undertaking. Throws on failure — callers must not continue. */
  async sign(input: LegalSignatureInput, version: string = LEGAL_POLICY_VERSION): Promise<LegalSignatureResult> {
    if (!isSupabaseConfigured) {
      throw new Error('قاعدة البيانات غير مهيأة؛ لا يمكن توثيق الإقرار القانوني.');
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) throw new Error('لا توجد جلسة دخول صالحة لتوثيق الإقرار.');

    const signedAt = new Date().toISOString();
    const signatureHash = await sha256Hex(input.signatureDataUrl);
    const payload = {
      policy_version: version,
      department: input.department,
      branch: input.branch || null,
      job_title: input.jobTitle || null,
      employee_name: input.employeeName || null,
      username: input.username || null,
      signature_method: input.signatureMethod,
      ip_address: input.ipAddress || null,
      user_agent: navigator.userAgent,
      signed_at: signedAt,
    };
    const complianceHash = (await sha256Hex(`${userId}|${signatureHash}|${JSON.stringify(payload)}`))
      .slice(0, 24)
      .toUpperCase();

    const { data, error } = await supabase
      .from('legal_undertakings')
      .insert({
        user_id: userId,
        policy_version: version,
        signed_at: signedAt,
        user_agent: navigator.userAgent,
        signature_hash: signatureHash,
        signature_data_url: input.signatureDataUrl,
        compliance_hash: complianceHash,
        payload,
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'تعذّر حفظ الإقرار القانوني في قاعدة البيانات.');
    }
    return { id: data.id as string, complianceHash, signedAt };
  },
};

export default legalService;
