import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/** Rendered inside the locale layout, so it already has the document shell. */
export default async function LocaleNotFound() {
  const t = await getTranslations('notFound');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <span className="font-syne text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B1117]">
        404
      </span>
      <h1 className="max-w-[18ch] font-syne text-[clamp(1.75rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#161413]">
        {t('title')}
      </h1>
      <p className="max-w-[44ch] text-[15px] leading-[1.75] text-[#584E44]">{t('lead')}</p>
      <Link
        href="/"
        className="border border-[#161413]/20 px-7 py-4 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#161413] transition-colors hover:border-[#8B1117] hover:bg-[#8B1117] hover:text-[#F5EFE6]"
      >
        {t('home')}
      </Link>
    </main>
  );
}
