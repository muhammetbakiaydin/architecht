'use client';

import React from 'react';
import Reveal from './Reveal';

export interface ApproachStep {
  index: string;
  title: string;
  body: string;
}

export interface ApproachSectionProps {
  eyebrow: string;
  title: string;
  steps: ApproachStep[];
}

/** Home page process section. All copy comes from `content_blocks`. */
export const ApproachSection: React.FC<ApproachSectionProps> = ({ eyebrow, title, steps }) => {
  return (
    <section
      id="approach"
      className="relative z-10 border-t border-[#161413]/10 bg-[#EFE7DB] px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal stagger={0.08}>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#8B1117]" />
            <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
              {eyebrow}
            </span>
          </div>
          <h2 className="mt-6 max-w-[16ch] font-syne text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#161413]">
            {title}
          </h2>
        </Reveal>

        <Reveal className="mt-16 grid gap-px bg-[#161413]/12 md:mt-24 md:grid-cols-3" stagger={0.12}>
          {steps.map((step) => (
            <article
              key={step.index}
              className="group bg-[#EFE7DB] px-0 py-10 transition-colors duration-500 md:px-8 md:py-12"
            >
              <div className="font-syne text-[11px] font-bold tracking-[0.3em] text-[#8B1117]">
                {step.index}
              </div>
              <h3 className="mt-6 font-syne text-2xl font-bold leading-tight tracking-[-0.01em] text-[#161413] md:text-[1.75rem]">
                {step.title}
              </h3>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.75] text-[#584E44]">
                {step.body}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default ApproachSection;
