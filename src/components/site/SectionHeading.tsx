import React from 'react';
import { Link } from '@/i18n/navigation';
import type { StaticPathname } from '@/i18n/routing';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Rule + eyebrow + headline used at the top of every content section. */
export default function SectionHeading({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  tone = 'dark',
  className = '',
}: SectionHeadingProps) {
  const heading = tone === 'dark' ? 'text-[#161413]' : 'text-[#F5EFE6]';
  const muted = tone === 'dark' ? 'text-[#584E44]' : 'text-[#F5EFE6]/60';

  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div>
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#8B1117]" />
            <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
              {eyebrow}
            </span>
          </div>
        )}
        <h2
          className={`mt-6 max-w-[20ch] font-syne text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em] ${heading}`}
        >
          {title}
        </h2>
        {body && <p className={`mt-5 max-w-[52ch] text-[15px] leading-[1.75] ${muted}`}>{body}</p>}
      </div>

      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref as StaticPathname}
          className="group inline-flex shrink-0 items-center gap-2 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#8B1117]"
        >
          {ctaLabel}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
