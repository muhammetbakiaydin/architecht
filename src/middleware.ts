import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  /**
   * Everything except the admin panel, API routes, Next internals and any path
   * that already carries a file extension. The admin panel is deliberately
   * single-language (Turkish) and must never be locale-prefixed.
   *
   * The backslash MUST be doubled: this is a JavaScript string literal, and a
   * single `\.` collapses to a bare `.` - which turns the `.*\..*` guard into
   * `.*..*`, matching every path of two characters or more and silently
   * disabling the middleware for the entire site.
   */
  matcher: ['/', '/((?!admin|api|_next|_vercel|.*\\..*).*)'],
};
