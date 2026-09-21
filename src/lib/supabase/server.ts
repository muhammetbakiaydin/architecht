import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './env';

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Server-component client. Reads the auth cookie so staff-only rows resolve
 * for a signed-in editor, and silently no-ops the write path: Server
 * Components cannot set cookies, and refresh is handled by the middleware.
 */
export async function getSupabaseServerClient(): Promise<TypedSupabaseClient | null> {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component - nothing to do, the middleware
          // already refreshed the session on this request.
        }
      },
    },
  });
}
