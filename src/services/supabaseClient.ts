import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://dummy-supabase.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsaG9zdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjIwMTk2NDMyMDB9.dummy';

const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Notice: Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are not set. Using fallback values.'
  );
}

export const STANDALONE_SUPABASE_URL = SUPABASE_URL;
export const STANDALONE_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

export const isDummySupabase =
  !import.meta.env.VITE_SUPABASE_URL ||
  SUPABASE_URL.includes('dummy-supabase') ||
  SUPABASE_URL.includes('dummy');

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
