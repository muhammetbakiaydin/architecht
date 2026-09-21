import React from 'react';
import Image from 'next/image';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  body?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

/** The standard masthead every non-immersive page opens with. */
export default function PageHero({ eyebrow, title, body, imageUrl, children }: PageHeroProps) {
  return (
    <section className="border-b border-[#161413]/10 px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className={imageUrl ? 'md:col-span-7' : 'md:col-span-9'}>
            {eyebrow && (
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#8B1117]" />
                <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
                  {eyebrow}
                </span>
              </div>
            )}
            <h1 className="mt-7 max-w-[18ch] font-syne text-[clamp(2.125rem,5.5vw,4.5rem)] font-bold leading-[1.03] tracking-[-0.025em] text-[#161413]">
              {title}
            </h1>
            {body && (
              <p className="mt-8 max-w-[56ch] text-base leading-[1.75] text-[#584E44] md:text-lg">
                {body}
              </p>
            )}
            {children}
          </div>

          {imageUrl && (
            <div className="md:col-span-5">
              <div className="relative overflow-hidden bg-[#E6DCCC]" style={{ aspectRatio: '4 / 3' }}>
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
