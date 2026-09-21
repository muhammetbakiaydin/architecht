'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, type TypedSupabaseClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { ProfileRow } from '@/lib/supabase/types';

export interface AdminContextValue {
  /** `null` until credentials are present in `.env.local`. */
  supabase: TypedSupabaseClient | null;
  configured: boolean;
  session: Session | null;
  profile: ProfileRow | null;
  /** True while the initial session lookup is in flight. */
  loading: boolean;
  /** Signed in AND carrying an admin/editor profile row. */
  canEdit: boolean;
  signOut: () => Promise<void>;
  refresh: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

/**
 * Holds the admin panel's Supabase session.
 *
 * With no credentials the whole panel still renders: `configured` is false,
 * every screen shows the bundled seed content and switches to read-only. This
 * is what makes the Supabase wiring a drop-in step rather than a prerequisite.
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, nonce]);

  // The profile row decides whether the RLS policies will accept writes, so
  // the UI reads it too rather than optimistically enabling every save button.
  useEffect(() => {
    if (!supabase || !session) {
      setProfile(null);
      return;
    }

    let active = true;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile((data as ProfileRow) ?? null);
      });

    return () => {
      active = false;
    };
  }, [supabase, session]);

  const value: AdminContextValue = {
    supabase,
    configured: isSupabaseConfigured,
    session,
    profile,
    loading,
    canEdit: Boolean(supabase && session && profile && profile.role !== 'viewer'),
    signOut: async () => {
      await supabase?.auth.signOut();
      setSession(null);
    },
    refresh: () => setNonce((n) => n + 1),
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export default AdminProvider;
