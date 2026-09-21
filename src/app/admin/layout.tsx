import React from 'react';
import type { Metadata } from 'next';
import AdminProvider from '@/components/admin/AdminProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Yönetim Paneli | EMRE MERİÇ',
  // The panel must never be indexed, even if it is ever reachable publicly.
  robots: { index: false, follow: false },
};

/**
 * The admin branch renders its own document shell: the root layout is a
 * pass-through and `[locale]/layout.tsx` is for the public site only. The panel
 * is Turkish-only by design, so it carries no next-intl provider.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    /* globals.css paints <html> the public site's cream; the panel overrides it
       so overscrolling past the body never flashes the wrong background. */
    <html lang="tr" className="bg-[#0a0a09]">
      <body className="min-h-screen bg-[#0a0a09] text-[#ede8e0] antialiased selection:bg-[#8B1117] selection:text-white">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
