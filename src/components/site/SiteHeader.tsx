'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { MAIN_NAV } from '@/lib/nav';
import { useSmoothScroll } from '@/components/SmoothScrollProvider';
import LocaleSwitcher from './LocaleSwitcher';

export interface SiteHeaderProps {
  brand: string;
  tagline: string;
  /**
   * Home lets the WebGPU hero show through until the first screen is behind us;
   * every other page needs a readable bar from the first pixel.
   */
  transparentUntilScroll?: boolean;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  brand,
  tagline,
  transparentUntilScroll = false,
}) => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();
  const [solid, setSolid] = useState(!transparentUntilScroll);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparentUntilScroll) {
      setSolid(true);
      return;
    }

    const update = () => setSolid(window.scrollY > window.innerHeight * 0.75);
    update();

    if (lenis) {
      lenis.on('scroll', update);
      return () => lenis.off('scroll', update);
    }

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [lenis, transparentUntilScroll]);

  // Lock the page while the mobile menu is open.
  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [menuOpen, lenis]);

  // A route change always closes the overlay, however it was triggered.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? 'border-b border-[#161413]/10 bg-[#F5EFE6]/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-5 md:px-12">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-syne text-[13px] font-bold uppercase tracking-[0.3em] text-[#161413] md:text-sm">
              {brand}
            </span>
            <span className="mt-1 hidden font-syne text-[9px] font-bold uppercase tracking-[0.35em] text-[#161413]/50 md:block">
              {tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`group relative font-syne text-[10px] font-bold uppercase tracking-[0.26em] transition-colors hover:text-[#8B1117] ${
                  isActive(item.href) ? 'text-[#8B1117]' : 'text-[#161413]/70'
                }`}
              >
                {t(item.key)}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-[#8B1117] transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            <span className="h-3 w-px bg-[#161413]/20" />
            <LocaleSwitcher />
          </nav>

          <div className="flex items-center gap-4 lg:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block h-px w-5 bg-[#161413] transition-transform duration-300 ${
                  menuOpen ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-[#161413] transition-transform duration-300 ${
                  menuOpen ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#F5EFE6] transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex h-full flex-col justify-center gap-6 px-8">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              className={`font-syne text-3xl font-bold uppercase tracking-[0.1em] transition-colors hover:text-[#8B1117] ${
                isActive(item.href) ? 'text-[#8B1117]' : 'text-[#161413]'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <span className="mt-6 font-syne text-[10px] font-bold uppercase tracking-[0.35em] text-[#161413]/45">
            {t('since')}
          </span>
        </nav>
      </div>
    </>
  );
};

export default SiteHeader;
