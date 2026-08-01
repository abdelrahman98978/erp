import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};

export const STANDALONE_SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'http://127.0.0.1:54421';
export const STANDALONE_SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTEyNDgwMDAsImV4cCI6MTk2NjYwODAwMH0.S622DkdtXkQGzS_Wd-v2iHqT6n6n6S';

export const supabase = createClient(STANDALONE_SUPABASE_URL, STANDALONE_SUPABASE_ANON_KEY);

export interface StandaloneSupabaseStatus {
  url: string;
  studioUrl: string;
  isLocal: boolean;
  connected: boolean;
}

export const getStandaloneSupabaseStatus = async (): Promise<StandaloneSupabaseStatus> => {
  try {
    const { data, error } = await supabase.from('clients').select('id').limit(1);
    return {
      url: STANDALONE_SUPABASE_URL,
      studioUrl: 'http://127.0.0.1:54423',
      isLocal: true,
      connected: !error
    };
  } catch (err) {
    return {
      url: STANDALONE_SUPABASE_URL,
      studioUrl: 'http://127.0.0.1:54423',
      isLocal: true,
      connected: false
    };
  }
};
