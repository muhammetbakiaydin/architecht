import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware replacements for next/link and next/navigation.
 * `Link href="/projects"` renders `/tr/projeler` or `/en/projects` by itself.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
