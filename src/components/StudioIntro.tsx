'use client';

import React from 'react';
import Reveal from './Reveal';

export interface StudioStat {
  value: string;
  label: string;
}

export interface StudioIntroProps {
  eyebrow: string;
  subtitle: string;
  title: string;
  /** Blank-line-separated paragraphs from the `body` field. */
  paragraphs: string[];
  stats: StudioStat[];
}

/** Home page "The studio" statement. All copy comes from `content_blocks`. */
export const StudioIntro: React.FC<StudioIntroProps> = ({
  eyebrow,
  subtitle,
  title,
  paragraphs,
  stats,
}) => {
  return (
    <section id="studio" className="relative z-10 bg-[#F5EFE6] px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-3" stagger={0.06}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#8B1117]" />
              <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
                {eyebrow}
              </span>
            </div>
            <p className="mt-6 max-w-[22ch] font-syne text-[11px] font-medium uppercase leading-relaxed tracking-[0.2em] text-[#161413]/45">
              {subtitle}
            </p>
          </Reveal>

          <Reveal className="md:col-span-9" stagger={0.1}>
            <h2 className="max-w-[20ch] font-syne text-[clamp(2rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#161413]">
              {title}
            </h2>
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`max-w-[62ch] text-base leading-[1.75] text-[#584E44] md:text-lg ${
                  i === 0 ? 'mt-10' : 'mt-6'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        {stats.length > 0 && (
          <Reveal
            className="mt-24 grid grid-cols-2 gap-px border-t border-[#161413]/12 bg-[#161413]/12 md:mt-32 md:grid-cols-4"
            stagger={0.07}
            y={18}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#F5EFE6] px-2 pt-8 md:px-4 md:pt-10">
                <div className="font-syne text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-none tracking-[-0.02em] text-[#161413]">
                  {stat.value}
                </div>
                <div className="mt-3 font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/45">
                  {stat.label}
                </div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default StudioIntro;
