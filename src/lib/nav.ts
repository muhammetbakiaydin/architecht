import type { StaticPathname } from '@/i18n/routing';

/**
 * The site's primary navigation, in the order it appears.
 *
 * `href` values are the INTERNAL pathnames from `src/i18n/routing.ts`; the
 * locale-aware `Link` turns `/projects` into `/tr/projeler` or `/en/projects`.
 * `key` indexes the `nav.*` namespace in `messages/*.json`.
 */
export interface NavItem {
  key: 'projects' | 'products' | 'gallery' | 'about' | 'blog' | 'contact';
  href: StaticPathname;
}

export const MAIN_NAV: NavItem[] = [
  { key: 'projects', href: '/projects' },
  { key: 'products', href: '/products' },
  { key: 'gallery', href: '/gallery' },
  { key: 'about', href: '/about' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
];
