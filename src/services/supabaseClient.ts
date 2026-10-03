import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client — single connection point for the ERP.
 *
 * Security notes (P0.5):
 *  - No hardcoded keys or URLs. Configuration comes from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 *  - No fake responses. When Supabase is not configured every request FAILS with a clear error,
 *    so the UI can never report a save/login that did not actually happen.
 *  - The localStorage override (CUSTOM_SUPABASE_URL / CUSTOM_SUPABASE_KEY) is honoured in development only.
 */

export const isLocalHost = (url: string): boolean =>
  url.startsWith('http://127.') ||
  url.startsWith('http://localhost') ||
  url.startsWith('http://0.0.0.0') ||
  url.includes('127.0.0.1') ||
  url.includes('localhost');

export const isRemoteEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h !== 'localhost' && h !== '127.0.0.1' && h !== '0.0.0.0';
};

const readDevOverride = (key: 'CUSTOM_SUPABASE_URL' | 'CUSTOM_SUPABASE_KEY'): string | null => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

interface ResolvedConfig {
  url: string;
  anonKey: string;
  error: string | null;
}

const resolveConfig = (): ResolvedConfig => {
  const overrideUrl = readDevOverride('CUSTOM_SUPABASE_URL');
  const overrideKey = readDevOverride('CUSTOM_SUPABASE_KEY');

  const url = (overrideUrl && overrideUrl.startsWith('http') ? overrideUrl : import.meta.env.VITE_SUPABASE_URL) || '';
  const anonKey = overrideKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !url.startsWith('http')) {
    return { url, anonKey, error: 'متغير البيئة VITE_SUPABASE_URL غير مُعرّف. لا يمكن الاتصال بقاعدة البيانات.' };
  }
  if (!anonKey) {
    return { url, anonKey, error: 'متغير البيئة VITE_SUPABASE_ANON_KEY غير مُعرّف. لا يمكن الاتصال بقاعدة البيانات.' };
  }
  // A public deployment cannot reach a loopback database (browser Private Network Access blocks it).
  if (isRemoteEnvironment() && isLocalHost(url)) {
    return { url, anonKey, error: 'عنوان قاعدة البيانات يشير إلى جهاز محلي (localhost) بينما التطبيق منشور على خادم عام. يرجى ضبط VITE_SUPABASE_URL على مشروع Supabase السحابي.' };
  }
  return { url, anonKey, error: null };
};

const CONFIG = resolveConfig();

/** Human readable configuration error, or null when Supabase is correctly configured. */
export const supabaseConfigError: string | null = CONFIG.error;

/** True when the client has a usable URL + key. */
export const isSupabaseConfigured: boolean = CONFIG.error === null;

/**
 * @deprecated Kept for backwards compatibility with existing read-only callers.
 * Means "Supabase is NOT configured". Write paths must return an error in this case, never fake success.
 */
export const isDummySupabase: boolean = !isSupabaseConfigured;

export const STANDALONE_SUPABASE_URL = CONFIG.url;
export const STANDALONE_SUPABASE_ANON_KEY = CONFIG.anonKey;

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(supabaseConfigError || 'Supabase is not configured');
    this.name = 'SupabaseNotConfiguredError';
  }
}

// When unconfigured, every network call fails loudly instead of hitting an unreachable host
// or returning fabricated data.
const failingFetch: typeof fetch = async () => {
  throw new SupabaseNotConfiguredError();
};

// createClient requires a syntactically valid URL even when we will never use it.
const CLIENT_URL = isSupabaseConfigured ? CONFIG.url : 'https://not-configured.invalid';
const CLIENT_KEY = isSupabaseConfigured ? CONFIG.anonKey : 'not-configured';

export const supabase: SupabaseClient = createClient(CLIENT_URL, CLIENT_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
    storageKey: 'erp-supabase-auth',
  },
  global: isSupabaseConfigured ? undefined : { fetch: failingFetch },
});

export interface StandaloneSupabaseStatus {
  url: string;
  studioUrl: string;
  isLocal: boolean;
  connected: boolean;
  error?: string | null;
}

export const getStandaloneSupabaseStatus = async (): Promise<StandaloneSupabaseStatus> => {
  const isLocal = isLocalHost(CONFIG.url);
  const studioUrl = isLocal ? 'http://127.0.0.1:54423' : '';
  if (!isSupabaseConfigured) {
    return { url: CONFIG.url, studioUrl: '', isLocal: false, connected: false, error: supabaseConfigError };
  }
  try {
    // Auth health endpoint does not depend on table privileges (anon has no table access after P0.6).
    const res = await fetch(`${CONFIG.url}/auth/v1/health`, { headers: { apikey: CONFIG.anonKey } });
    return { url: CONFIG.url, studioUrl, isLocal, connected: res.ok, error: res.ok ? null : `HTTP ${res.status}` };
  } catch (err: any) {
    return { url: CONFIG.url, studioUrl, isLocal, connected: false, error: err?.message || 'Network error' };
  }
};
