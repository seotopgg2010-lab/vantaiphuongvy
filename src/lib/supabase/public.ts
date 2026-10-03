import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Read-only client for public content. It uses the anon key so Supabase RLS is
 * the final authority for what can be exposed to visitors.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase public configuration is unavailable.');
  }

  return createSupabaseClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
