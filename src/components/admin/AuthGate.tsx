'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from './AdminProvider';

/**
 * Gates the panel behind a Supabase session.
 *
 * With no credentials configured there is no session to require, so the panel
 * opens directly in read-only preview mode - that is the whole point of the
 * "build it, wire it later" setup. Once credentials exist, a session is
 * mandatory and anything below this component is only reachable signed in.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { configured, session, loading } = useAdmin();

  if (!configured) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#57524b]">
          YÜKLENİYOR
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="font-syne text-[12px] font-bold uppercase tracking-[0.3em] text-[#ede8e0]">
            YÖNETİM PANELİ
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[#8a8378]">
            Devam etmek için oturum açın.
          </p>
          <Link
            href="/admin/login"
            className="mt-8 inline-block rounded-sm border border-[#2c2926] px-7 py-3.5 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#ede8e0] transition-colors hover:border-[#8B1117] hover:bg-[#8B1117]"
          >
            GİRİŞ YAP
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
