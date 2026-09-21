'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';

/**
 * Swaps the locale while staying on the same page.
 *
 * `usePathname` from `@/i18n/navigation` returns the INTERNAL pathname
 * (`/projects`), so pushing it under another locale resolves that locale's own
 * URL segment (`/en/projects` vs `/tr/projeler`). Dynamic segments come back as
 * `[slug]`, which is why the current route params are passed along.
 */
export const LocaleSwitcher: React.FC<{ tone?: 'dark' | 'light' }> = ({ tone = 'dark' }) => {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [pending, startTransition] = React.useTransition();

  const change = (next: Locale) => {
    if (next === locale || pending) return;
    startTransition(() => {
      router.replace(
        // `params` covers [slug]-style routes; for static ones it is just {locale}.
        { pathname, params: params as never },
        { locale: next }
      );
    });
  };

  const base =
    tone === 'dark'
      ? 'text-[#161413]/45 hover:text-[#8B1117]'
      : 'text-[#F5EFE6]/45 hover:text-[#F5EFE6]';
  const active = tone === 'dark' ? 'text-[#161413]' : 'text-[#F5EFE6]';

  return (
    <div
      className={`flex items-center gap-1.5 font-syne text-[10px] font-bold tracking-[0.18em] ${
        pending ? 'opacity-50' : ''
      }`}
    >
      {locales.map((code, i) => (
        <React.Fragment key={code}>
          {i > 0 && <span className={base}>/</span>}
          <button
            type="button"
            onClick={() => change(code)}
            aria-current={code === locale ? 'true' : undefined}
            className={`uppercase transition-colors ${code === locale ? active : base}`}
          >
            {code}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LocaleSwitcher;
