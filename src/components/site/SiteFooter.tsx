'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';
import { Link } from '@/i18n/navigation';
import { MAIN_NAV } from '@/lib/nav';
import type { Award, SiteSettings } from '@/lib/content/types';

export interface SiteFooterProps {
  settings: SiteSettings;
  awards: Award[];
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ settings, awards }) => {
  const t = useTranslations('footer');
  const tContact = useTranslations('contact');

  return (
    <footer className="relative z-10 bg-[#161413] px-6 pb-10 pt-28 text-[#F5EFE6] md:px-12 md:pt-40">
      <div className="mx-auto max-w-[1440px]">
        <Reveal stagger={0.1}>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#8B1117]" />
            <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5EFE6]/50">
              {tContact('eyebrow')}
            </span>
          </div>
          <h2 className="mt-8 max-w-[18ch] font-syne text-[clamp(1.75rem,4.5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {tContact('title')}
          </h2>
          <a
            href={`mailto:${settings.email}`}
            className="mt-10 inline-block font-syne text-[clamp(1.1rem,2.6vw,2rem)] font-bold tracking-[-0.01em] text-[#F5EFE6] underline decoration-[#8B1117] decoration-2 underline-offset-[10px] transition-colors hover:text-[#E8A0A5]"
          >
            {settings.email}
          </a>
        </Reveal>

        <Reveal
          className="mt-24 grid gap-12 border-t border-[#F5EFE6]/15 pt-12 md:mt-32 md:grid-cols-4"
          stagger={0.08}
          y={18}
        >
          <div>
            <h3 className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#F5EFE6]/40">
              {t('studio')}
            </h3>
            <p className="mt-5 font-syne text-sm font-bold uppercase tracking-[0.18em]">
              {settings.brand}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#F5EFE6]/55">{settings.address}</p>
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="mt-1 block text-sm leading-relaxed text-[#F5EFE6]/55 transition-colors hover:text-[#F5EFE6]"
              >
                {settings.phone}
              </a>
            )}
            <p className="mt-1 text-sm leading-relaxed text-[#F5EFE6]/55">
              EST. {settings.foundedYear}
            </p>
          </div>

          <div>
            <h3 className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#F5EFE6]/40">
              {t('navigate')}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <FooterNavLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#F5EFE6]/40">
              {t('recognition')}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {awards.map((award) => (
                <li
                  key={award.id}
                  className="font-syne text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-[#F5EFE6]/55"
                >
                  {award.label}
                  {award.year ? ` — ${award.year}` : ''}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#F5EFE6]/40">
              {t('elsewhere')}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {settings.socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-syne text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5EFE6]/70 transition-colors hover:text-[#F5EFE6]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-24 overflow-hidden md:mt-32" aria-hidden="true">
          <span className="block whitespace-nowrap font-syne text-[clamp(3rem,15vw,14rem)] font-bold leading-[0.85] tracking-[-0.03em] text-[#F5EFE6]/10">
            {settings.brand}
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#F5EFE6]/15 pt-6 md:flex-row md:items-center md:justify-between">
          <span className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#F5EFE6]/40">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings.brand} —{' '}
            {t('rights')}
          </span>
          <span className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#F5EFE6]/40">
            {settings.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
};

/** Split out so the `nav` namespace lookup stays typed against the item key. */
function FooterNavLink({ item }: { item: (typeof MAIN_NAV)[number] }) {
  const t = useTranslations('nav');
  return (
    <Link
      href={item.href}
      className="font-syne text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5EFE6]/70 transition-colors hover:text-[#F5EFE6]"
    >
      {t(item.key)}
    </Link>
  );
}

export default SiteFooter;
