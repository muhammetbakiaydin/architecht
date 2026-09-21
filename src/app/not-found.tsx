import React from 'react';
import Link from 'next/link';
import { defaultLocale } from '@/i18n/routing';
import './globals.css';

/**
 * Catches requests that never reached a locale segment (e.g. an unknown
 * top-level path). The root layout renders no document shell, so this page
 * supplies its own <html>/<body>.
 */
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale}>
      <body className="bg-[#F5EFE6] text-[#161413] antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <span className="font-syne text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B1117]">
            404
          </span>
          <h1 className="max-w-[18ch] font-syne text-[clamp(1.75rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            Sayfa bulunamadı / Page not found
          </h1>
          <Link
            href={`/${defaultLocale}`}
            className="border border-[#161413]/20 px-7 py-4 font-syne text-[10px] font-bold uppercase tracking-[0.26em] transition-colors hover:border-[#8B1117] hover:bg-[#8B1117] hover:text-[#F5EFE6]"
          >
            ANA SAYFA / HOME
          </Link>
        </main>
      </body>
    </html>
  );
}
