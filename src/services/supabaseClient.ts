import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'http://127.0.0.1:54421';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

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

const resolveSupabaseUrl = (): string => {
  // 1. Check user-configured cloud database from Production Data Hub
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('CUSTOM_SUPABASE_URL');
    if (custom && custom.startsWith('http')) {
      // If custom is a remote URL or running locally, use it
      if (!isRemoteEnvironment() || !isLocalHost(custom)) {
        return custom;
      }
    }
  }

  // 2. Check environment variable (e.g. Vercel dashboard VITE_SUPABASE_URL)
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && envUrl.startsWith('http')) {
    // If running on a public remote host (e.g. Vercel) and URL is local loopback:
    // Browser Private Network Access blocks it with CORS net::ERR_FAILED.
    if (isRemoteEnvironment() && isLocalHost(envUrl)) {
      return 'https://dummy-supabase.local';
    }
    return envUrl;
  }

  // 3. If on public remote domain without cloud Supabase configured, avoid loopback CORS failure
  if (isRemoteEnvironment()) {
    return 'https://dummy-supabase.local';
  }

  return DEFAULT_SUPABASE_URL;
};

const resolveSupabaseKey = (): string => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('CUSTOM_SUPABASE_KEY');
    if (customKey) return customKey;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
};

const SUPABASE_URL: string = resolveSupabaseUrl();
const SUPABASE_ANON_KEY: string = resolveSupabaseKey();

export const STANDALONE_SUPABASE_URL = SUPABASE_URL;
export const STANDALONE_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

export const isDummySupabase =
  SUPABASE_URL.includes('dummy-supabase') ||
  SUPABASE_URL.includes('dummy') ||
  (isRemoteEnvironment() && isLocalHost(SUPABASE_URL));

const customFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
  const isLoopbackBlocked = isRemoteEnvironment() && isLocalHost(url);

  if (isDummySupabase || isLoopbackBlocked || url.includes('dummy-supabase') || url.includes('dummy')) {
    if (url.includes('/auth/v1/')) {
      return new Response(JSON.stringify({
        access_token: 'dummy-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'dummy-refresh-token',
        user: null
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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

