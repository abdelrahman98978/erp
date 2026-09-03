import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'http://127.0.0.1:54421';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const STANDALONE_SUPABASE_URL = SUPABASE_URL;
export const STANDALONE_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

export const isDummySupabase =
  SUPABASE_URL.includes('dummy-supabase') ||
  SUPABASE_URL.includes('dummy');

const customFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
  if (isDummySupabase || url.includes('dummy-supabase') || url.includes('dummy')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'content-range': '0-0/0',
      },
    });
  }
  return fetch(input, init);
};

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'erp-supabase-auth',
  },
  global: {
    fetch: customFetch,
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
  if (isDummySupabase) {
    return {
      url: SUPABASE_URL,
      studioUrl: '',
      isLocal: false,
      connected: false,
    };
  }
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
