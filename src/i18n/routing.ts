import { defineRouting } from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'tr';

/**
 * Localized pathnames. The key is the internal (canonical) route used in code;
 * the value maps each locale to the URL segment the visitor actually sees.
 * Always link with the wrappers from `@/i18n/navigation` so these stay in sync.
 */
export const pathnames = {
  '/': '/',
  '/projects': { tr: '/projeler', en: '/projects' },
  '/products': { tr: '/urunler', en: '/products' },
  '/gallery': { tr: '/galeri', en: '/gallery' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/contact': { tr: '/iletisim', en: '/contact' },
  '/blog': { tr: '/blog', en: '/blog' },
  '/blog/[slug]': { tr: '/blog/[slug]', en: '/blog/[slug]' },
  '/products/[slug]': { tr: '/urunler/[slug]', en: '/products/[slug]' },
  '/projects/[slug]': { tr: '/projeler/[slug]', en: '/projects/[slug]' },
} as const;

export type AppPathname = keyof typeof pathnames;

/**
 * Pathnames with no dynamic segment. Navigation and CTA links take these:
 * a `[slug]` route needs its params passed as an object, which a bare string
 * href cannot express.
 */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames,
  // `/tr/...` and `/en/...` are both always explicit - no bare-root ambiguity.
  localePrefix: 'always',
});
