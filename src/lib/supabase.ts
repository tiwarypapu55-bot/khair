import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Check if a real, valid remote Supabase endpoint is provided in environment variables
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('https://') &&
  !rawUrl.includes('fgkfkktuxbunvawerllm') &&
  !rawUrl.includes('placeholder')
);

export const configuredSupabaseUrl = isSupabaseConfigured ? rawUrl : '';
export const configuredSupabaseKey = isSupabaseConfigured ? rawKey : '';

// Safe fallback URL/key to prevent createClient from throwing on initialization
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'dummy-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
  }
});

