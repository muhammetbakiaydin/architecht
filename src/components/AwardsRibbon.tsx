'use client';

import React from 'react';
import Image from 'next/image';

interface AwardItem {
  src: string;
  alt: string;
  title: string;
  year?: string;
}

const AWARDS: AwardItem[] = [
  {
    src: '/oaib.avif',
    alt: 'OAIB Design Award',
    title: 'OAIB DESIGN AWARD',
    year: 'WINNER',
  },
  {
    src: '/ifdesign.avif',
    alt: 'iF Design Award',
    title: 'iF DESIGN AWARD',
    year: '2026',
  },
  {
    src: '/msgu.avif',
    alt: 'MSGU Architecture & Interior Award',
    title: 'MSGSÜ ARCHITECTURE',
    year: 'AWARD',
  },
  {
    src: '/idw2017.avif',
    alt: 'Interior Design Week Award',
    title: 'INTERIOR DESIGN WEEK',
    year: '2017',
  },
];

interface AwardsRibbonProps {
  className?: string;
}

/**
 * Scroll-driven fading is done by the parent, which writes `style.opacity`
 * straight to its wrapper node. Do not add an opacity transition here: it would
 * lag a value that is already updated every frame.
 */
export const AwardsRibbon: React.FC<AwardsRibbonProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full max-w-[340px] sm:max-w-md md:max-w-7xl mx-auto px-3 sm:px-6 py-2 md:py-4 grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 md:flex md:flex-nowrap md:items-center md:justify-center md:gap-10 lg:gap-14 ${className}`}
    >
      {AWARDS.map((award, index) => (
        <div
          key={index}
          className="flex items-center gap-2 sm:gap-3 grayscale contrast-125 opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative w-7 h-6 sm:w-8 sm:h-7 md:w-12 md:h-10 lg:w-14 lg:h-10 flex-shrink-0">
            <Image
              src={award.src}
              alt={award.alt}
              fill
              sizes="(max-width: 768px) 32px, 64px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-syne text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.14em] md:tracking-[0.2em] text-[#161413] uppercase leading-tight">
              {award.title}
            </span>
            {award.year && (
              <span className="font-syne text-[7.5px] sm:text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.25em] text-[#7A6E63] uppercase mt-0.5">
                {award.year}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AwardsRibbon;
