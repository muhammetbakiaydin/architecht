'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from './AdminProvider';

interface NavGroup {
  title: string;
  items: { href: string; label: string }[];
}

export const ADMIN_NAV: NavGroup[] = [
  {
    title: 'GENEL',
    items: [
      { href: '/admin', label: 'Panel' },
      { href: '/admin/site', label: 'Site Ayarları' },
      { href: '/admin/messages', label: 'Mesajlar' },
    ],
  },
  {
    title: 'SAYFA İÇERİKLERİ',
    items: [
      { href: '/admin/content/home', label: 'Ana Sayfa' },
      { href: '/admin/content/about', label: 'Hakkımızda' },
      { href: '/admin/content/contact', label: 'İletişim' },
      { href: '/admin/content/projects', label: 'Projeler Sayfası' },
      { href: '/admin/content/products', label: 'Ürünler Sayfası' },
      { href: '/admin/content/gallery', label: 'Galeri Sayfası' },
      { href: '/admin/content/blog', label: 'Blog Sayfası' },
    ],
  },
  {
    title: 'KOLEKSİYONLAR',
    items: [
      { href: '/admin/projects', label: 'Projeler' },
      { href: '/admin/products', label: 'Ürünler' },
      { href: '/admin/gallery', label: 'Galeri Görselleri' },
      { href: '/admin/blog', label: 'Blog Yazıları' },
      { href: '/admin/team', label: 'Ekip' },
      { href: '/admin/awards', label: 'Ödüller' },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { configured, session, profile, signOut } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`shrink-0 border-b border-[#26231f] bg-[#0f0e0d] lg:w-[264px] lg:border-b-0 lg:border-r ${
          menuOpen ? '' : 'max-lg:pb-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/admin" className="block">
            <div className="font-syne text-[12px] font-bold uppercase tracking-[0.3em] text-[#ede8e0]">
              EMRE MERİÇ
            </div>
            <div className="mt-1 font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
              YÖNETİM PANELİ
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            className="lg:hidden"
          >
            <span className="font-syne text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9c2b7]">
              {menuOpen ? 'KAPAT' : 'MENÜ'}
            </span>
          </button>
        </div>

        <nav className={`px-3 pb-6 ${menuOpen ? 'block' : 'hidden lg:block'}`}>
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="mb-7">
              <div className="px-3 pb-2 font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#57524b]">
                {group.title}
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-sm px-3 py-2 text-[13.5px] transition-colors ${
                        isActive(item.href)
                          ? 'bg-[#8B1117]/15 text-[#ede8e0]'
                          : 'text-[#9a9389] hover:bg-[#1a1918] hover:text-[#ede8e0]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-8 border-t border-[#26231f] px-3 pt-5">
            <Link
              href="/tr"
              target="_blank"
              className="block text-[12.5px] text-[#9a9389] transition-colors hover:text-[#ede8e0]"
            >
              Siteyi aç ↗
            </Link>
            {session && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-3 block text-[12.5px] text-[#9a9389] transition-colors hover:text-[#8B1117]"
              >
                Çıkış yap
              </button>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-[#57524b]">
              {session
                ? `${session.user.email ?? ''}${profile ? ` — ${profile.role}` : ''}`
                : 'Oturum açılmadı'}
            </p>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {!configured && <NotConnectedBanner />}
        <main className="px-6 py-10 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}

function NotConnectedBanner() {
  return (
    <div className="border-b border-[#8B1117]/35 bg-[#8B1117]/10 px-6 py-4 md:px-10">
      <p className="font-syne text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8a0a5]">
        SUPABASE BAĞLI DEĞİL — ÖNİZLEME MODU
      </p>
      <p className="mt-2 max-w-[80ch] text-[12.5px] leading-relaxed text-[#c9c2b7]">
        Panel şu anda <code className="text-[#ede8e0]">src/content/seed</code> içindeki hazır
        içeriği gösteriyor ve kaydetme kapalı. Bağlamak için: Supabase projesi açın,{' '}
        <code className="text-[#ede8e0]">supabase/schema.sql</code> dosyasını çalıştırın,{' '}
        <code className="text-[#ede8e0]">.env.example</code> dosyasını{' '}
        <code className="text-[#ede8e0]">.env.local</code> olarak kopyalayıp anahtarları girin.
      </p>
    </div>
  );
}
