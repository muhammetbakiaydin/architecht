import React from 'react';

/**
 * Intentionally NOT the document shell.
 *
 * Two branches of this app need different <html> attributes: the localized
 * public site under `[locale]` (lang="tr" / "en", next-intl provider) and the
 * single-language admin panel under `/admin`. Next requires a root layout to
 * exist, so this one exists and does nothing - each branch renders its own
 * <html>/<body>. See `src/app/[locale]/layout.tsx` and `src/app/admin/layout.tsx`.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
