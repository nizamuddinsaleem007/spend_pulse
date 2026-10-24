import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Sanitize inputs to prevent module evaluation crashes
const sanitizeUrl = (raw: string | undefined): string => {
  if (!raw) return '';
  let url = raw.trim().replace(/^["']|["']$/g, '');
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  // Remove /rest/v1 or trailing slashes if accidentally included
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  return url;
};

const sanitizeKey = (raw: string | undefined): string => {
  if (!raw) return '';
  return raw.trim().replace(/^["']|["']$/g, '');
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = sanitizeKey(rawKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseUrl.includes('supabase.co')
);

const createSafeClient = (): SupabaseClient => {
  if (isSupabaseConfigured) {
    try {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Supabase client initialization warning:', err);
    }
  }
  // Safe fallback mock so app never crashes with a white screen
  return createClient('https://mock-demo.supabase.co', 'mock-anon-key', {
    auth: { persistSession: false }
  });
};

export const supabase = createSafeClient();
