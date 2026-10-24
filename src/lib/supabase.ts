import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Null when the project isn't configured yet — the site falls back to seeded defaults. */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (url && anonKey) {
    if (!client) client = createClient(url, anonKey);
    return client;
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export const MEDIA_BUCKET = 'media';
