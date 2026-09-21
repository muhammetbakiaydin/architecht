'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from '@/components/Reveal';

export interface AwardShowcaseItem {
  id: string;
  logo: string;
  alt: string;
  year: string;
  titleTr: string;
  titleEn: string;
  categoryTr: string;
  categoryEn: string;
  descTr: string;
  descEn: string;
}

export const AWARDS_SHOWCASE: AwardShowcaseItem[] = [
  {
    id: 'oaib',
    logo: '/oaib.avif',
    alt: 'OAİB Tasarım Ödülü',
    year: '2025',
    titleTr: 'OAİB TASARIM ÖDÜLÜ',
    titleEn: 'OAIB DESIGN AWARD',
    categoryTr: 'BİRİNCİLİK / WINNER',
    categoryEn: 'FIRST PLACE WINNER',
    descTr: 'Orta Anadolu İhracatçı Birlikleri tarafından düzenlenen ulusal tasarım yarışmasında mimari mobilya ve mekân tasarımı kategorisi birinciliği.',
    descEn: 'First prize in architectural furniture and spatial design competition organized by the Central Anatolian Exporters Association.',
  },
  {
    id: 'ifdesign',
    logo: '/ifdesign.avif',
    alt: 'iF Design Award',
    year: '2026',
    titleTr: 'iF DESIGN AWARD',
    titleEn: 'iF DESIGN AWARD',
    categoryTr: 'MİMARİ DİSİPLİN / ARCHITECTURE',
    categoryEn: 'ARCHITECTURE DISCIPLINE',
    descTr: 'Dünyanın en prestijli bağımsız uluslararası tasarım yarışmalarından biri olan iF Design Award tescilli proje ödülü.',
    descEn: 'Official honor recognized by iF Design Award, one of the most prestigious global architectural and design awards.',
  },
  {
    id: 'msgu',
    logo: '/msgu.avif',
    alt: 'MSGSÜ Mimarlık Ödülü',
    year: '2022',
    titleTr: 'MSGSÜ MİMARLIK ÖDÜLÜ',
    titleEn: 'MSGSÜ ARCHITECTURE AWARD',
    categoryTr: 'AKADEMİK & MESLEKİ BAŞARI',
    categoryEn: 'ACADEMIC & PROFESSIONAL MERIT',
    descTr: 'Mimar Sinan Güzel Sanatlar Üniversitesi Mimarlık Fakültesi akademik seçki ve mesleki tasarım mükemmeliyeti ödülü.',
    descEn: 'Design excellence and architectural merit award presented by Mimar Sinan Fine Arts University Faculty of Architecture.',
  },
  {
    id: 'idw',
    logo: '/idw2017.avif',
    alt: 'İç Mimarlık Haftası Seçkisi',
    year: '2017',
    titleTr: 'İÇ MİMARLIK HAFTASI SEÇKİSİ',
    titleEn: 'INTERIOR DESIGN WEEK SELECTION',
    categoryTr: 'MEKÂN TASARIMI VE ZANAAT',
    categoryEn: 'SPATIAL DESIGN & CRAFT',
    descTr: 'İstanbul İç Mimarlık Haftası kapsamında yılın ilham veren konut ve zanaat mimarisi özel seçkisi.',
    descEn: 'Selected as one of the inspiring residential and artisanal interior architecture works of Istanbul Interior Design Week.',
  },
];

interface AwardsShowcaseProps {
  locale?: string;
  variant?: 'cards' | 'ribbon';
  className?: string;
}

export const AwardsShowcase: React.FC<AwardsShowcaseProps> = ({
  locale = 'tr',
  variant = 'cards',
  className = '',
}) => {
  const isTr = locale === 'tr';

  if (variant === 'ribbon') {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {AWARDS_SHOWCASE.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3.5 border border-[#161413]/10 bg-[#F5EFE6]/70 p-4 transition-all duration-300 hover:border-[#8B1117]/40 hover:bg-[#F5EFE6]"
            >
              <div className="relative h-8 w-12 flex-shrink-0 grayscale contrast-125 transition-all duration-300 group-hover:grayscale-0">
                <Image
                  src={item.logo}
                  alt={item.alt}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-syne text-[10px] font-bold uppercase tracking-[0.14em] text-[#161413] leading-tight group-hover:text-[#8B1117] transition-colors">
                  {isTr ? item.titleTr : item.titleEn}
                </span>
                <span className="font-syne text-[8px] font-semibold tracking-[0.2em] text-[#8B1117] uppercase mt-0.5">
                  {item.year} — {isTr ? item.categoryTr : item.categoryEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cards layout (for About page)
  return (
    <div className={`w-full ${className}`}>
      <Reveal
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.08}
        y={20}
      >
        {AWARDS_SHOWCASE.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col justify-between border border-[#161413]/12 bg-[#F5EFE6]/50 p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#8B1117]/50 hover:bg-[#F5EFE6] hover:shadow-[0_12px_32px_rgba(22,20,19,0.06)]"
          >
            <div>
              {/* Header: Logo + Year Badge */}
              <div className="flex items-center justify-between border-b border-[#161413]/10 pb-5">
                <div className="relative h-10 w-16 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105">
                  <Image
                    src={item.logo}
                    alt={item.alt}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="font-syne text-[10px] font-bold tracking-[0.22em] text-[#8B1117] border border-[#8B1117]/25 px-2.5 py-0.5 bg-[#8B1117]/5">
                  {item.year}
                </span>
              </div>

              {/* Title & Category */}
              <div className="mt-5">
                <span className="font-syne text-[8.5px] font-bold uppercase tracking-[0.26em] text-[#8B1117]">
                  {isTr ? item.categoryTr : item.categoryEn}
                </span>
                <h3 className="mt-2 font-syne text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#161413] group-hover:text-[#8B1117] transition-colors">
                  {isTr ? item.titleTr : item.titleEn}
                </h3>
              </div>

              {/* Description */}
              <p className="mt-3.5 text-[12.5px] leading-[1.7] text-[#584E44]">
                {isTr ? item.descTr : item.descEn}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-[#161413]/08">
              <span className="h-0.5 w-4 bg-[#8B1117] transition-all duration-300 group-hover:w-8" />
              <span className="font-syne text-[8px] font-bold tracking-[0.28em] uppercase text-[#161413]/40 group-hover:text-[#161413]/70 transition-colors">
                EMRE MERİÇ ARCHITECTURE
              </span>
            </div>
          </article>
        ))}
      </Reveal>
    </div>
  );
};

export default AwardsShowcase;
