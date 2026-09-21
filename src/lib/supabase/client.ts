'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './env';

export type TypedSupabaseClient = SupabaseClient<Database>;

let cached: TypedSupabaseClient | null = null;

/**
 * Browser-side client used by the admin panel and the contact form.
 * Returns `null` when the project has no credentials yet, so callers can show
 * a "not connected" state instead of crashing.
 */
export function getSupabaseBrowserClient(): TypedSupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return cached;
}
