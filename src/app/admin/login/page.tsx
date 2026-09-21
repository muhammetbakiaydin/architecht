'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Notice } from '@/components/admin/AdminPage';

export default function AdminLoginPage() {
  const { supabase, configured, session } = useAdmin();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) router.replace('/admin');
  }, [session, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || status === 'sending') return;

    setStatus('sending');
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setStatus('idle');

    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace('/admin');
  };

  const inputClass =
    'w-full rounded-sm border border-[#2c2926] bg-[#141312] px-3 py-2.5 text-[14px] text-[#ede8e0] outline-none transition-colors focus:border-[#8B1117]';

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="font-syne text-[12px] font-bold uppercase tracking-[0.3em] text-[#ede8e0]">
            EMRE MERİÇ
          </div>
          <div className="mt-2 font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
            YÖNETİM PANELİ
          </div>
        </div>

        {!configured ? (
          <div className="mt-10 space-y-6">
            <Notice>
              Supabase bağlı olmadığı için giriş gerekmiyor. Panel önizleme modunda, hazır
              içerikle açılıyor.
            </Notice>
            <Link href="/admin" className="block">
              <Button variant="primary">PANELE GİT</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a8378]"
              >
                E-POSTA
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a8378]"
              >
                PAROLA
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {error && <Notice tone="error">{error}</Notice>}

            <Button variant="primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'GİRİŞ YAPILIYOR…' : 'GİRİŞ YAP'}
            </Button>

            <p className="text-[11.5px] leading-relaxed text-[#57524b]">
              Kullanıcılar Supabase panelinden (Authentication → Users) eklenir. Ekledikten sonra
              SQL editöründe rolü yükseltin:{' '}
              <code className="text-[#8a8378]">
                update public.profiles set role = &apos;admin&apos; where email = &apos;…&apos;;
              </code>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
