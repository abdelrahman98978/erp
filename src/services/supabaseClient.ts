import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set before building.'
  );
}

if (import.meta.env.PROD && (SUPABASE_URL.includes('127.0.0.1') || SUPABASE_URL.includes('localhost'))) {
  throw new Error(
    'Production build is pointing to a localhost Supabase instance. Set VITE_SUPABASE_URL to your hosted project URL.'
  );
}

export const STANDALONE_SUPABASE_URL = SUPABASE_URL;
export const STANDALONE_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'erp-supabase-auth',
  },
});

export interface StandaloneSupabaseStatus {
  url: string;
  studioUrl: string;
  isLocal: boolean;
  connected: boolean;
}

const isLocalHost = (url: string): boolean =>
  url.startsWith('http://127.') || url.startsWith('http://localhost') || url.startsWith('http://0.0.0.0');

export const getStandaloneSupabaseStatus = async (): Promise<StandaloneSupabaseStatus> => {
  try {
    const { error } = await supabase.from('clients').select('id').limit(1);
    return {
      url: SUPABASE_URL,
      studioUrl: isLocalHost(SUPABASE_URL) ? 'http://127.0.0.1:54423' : '',
      isLocal: isLocalHost(SUPABASE_URL),
      connected: !error,
    };
  } catch (err) {
    return {
      url: SUPABASE_URL,
      studioUrl: isLocalHost(SUPABASE_URL) ? 'http://127.0.0.1:54423' : '',
      isLocal: isLocalHost(SUPABASE_URL),
      connected: false,
    };
  }
};
