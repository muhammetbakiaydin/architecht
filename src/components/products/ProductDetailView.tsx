'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Product, ProductImage } from '@/lib/content/types';

export interface ProductDetailViewProps {
  product: Product;
  backLabel: string;
  specsLabel: string;
  contactLabel: string;
  locale: string;
}

export default function ProductDetailView({
  product,
  backLabel,
  specsLabel,
  contactLabel,
  locale,
}: ProductDetailViewProps) {
  // Consolidate images: cover image first, followed by any gallery images not duplicating cover
  const allImages: ProductImage[] = React.useMemo(() => {
    const list: ProductImage[] = [];
    if (product.coverUrl) {
      const existingCover = product.images.find((img) => img.url === product.coverUrl);
      list.push(
        existingCover || {
          id: `${product.id}-cover`,
          url: product.coverUrl,
          alt: product.name,
          title: product.name,
          subtitle: locale === 'tr' ? '01 / Genel Mimari Form' : '01 / Architectural Silhouette',
          description: product.summary || product.description,
        }
      );
    }
    product.images.forEach((img) => {
      if (!list.some((item) => item.url === img.url)) {
        list.push(img);
      }
    });
    return list.length > 0
      ? list
      : [
          {
            id: `${product.id}-fallback`,
            url: product.coverUrl || '/projects/1.webp',
            alt: product.name,
            title: product.name,
            subtitle: locale === 'tr' ? '01 / Genel Mimari Form' : '01 / Architectural Silhouette',
            description: product.summary || product.description,
          },
        ];
  }, [product, locale]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'idle' | 'transitioning'>('idle');
  const touchStartX = useRef<number | null>(null);

  const currentImage = allImages[activeIndex] || allImages[0];

  const goToIndex = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setFadeState('transitioning');
      setTimeout(() => {
        setActiveIndex(index);
        setFadeState('idle');
      }, 180);
    },
    [activeIndex]
  );

  const prevPhoto = useCallback(() => {
    const nextIdx = (activeIndex - 1 + allImages.length) % allImages.length;
    goToIndex(nextIdx);
  }, [activeIndex, allImages.length, goToIndex]);

  const nextPhoto = useCallback(() => {
    const nextIdx = (activeIndex + 1) % allImages.length;
    goToIndex(nextIdx);
  }, [activeIndex, allImages.length, goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPhoto, nextPhoto]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 45) {
      nextPhoto();
    } else if (diffX < -45) {
      prevPhoto();
    }
    touchStartX.current = null;
  };

  // Deduplicate specs: don't repeat Material or Dimensions if they are already in product.specs
  const cleanSpecs = React.useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ label: string; value: string }> = [];

    product.specs.forEach((s) => {
      const key = s.label.toLowerCase().trim();
      if (!seen.has(key) && s.value) {
        seen.add(key);
        result.push(s);
      }
    });

    if (product.material && !seen.has(locale === 'tr' ? 'malzeme' : 'material')) {
      seen.add(locale === 'tr' ? 'malzeme' : 'material');
      result.unshift({
        label: locale === 'tr' ? 'Malzeme' : 'Material',
        value: product.material,
      });
    }

    if (product.dimensions && !seen.has(locale === 'tr' ? 'ölçüler' : 'dimensions')) {
      seen.add(locale === 'tr' ? 'ölçüler' : 'dimensions');
      result.push({
        label: locale === 'tr' ? 'Ölçüler' : 'Dimensions',
        value: product.dimensions,
      });
    }

    return result;
  }, [product, locale]);

  // Photo counter text
  const currentNumStr = String(activeIndex + 1).padStart(2, '0');
  const totalNumStr = String(allImages.length).padStart(2, '0');
  const fillPercentage = ((activeIndex + 1) / allImages.length) * 100;

  return (
    <div className="mx-auto max-w-[1440px]">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 font-syne text-[10px] font-bold uppercase tracking-[0.24em] text-[#161413]/50 transition-colors hover:text-[#8B1117]"
      >
        <span className="text-xs">←</span> {backLabel}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Gallery & Dynamic Per-Photo Story */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Main Photo Frame */}
          <div
            className="group relative overflow-hidden bg-[#EAE3D6] shadow-sm select-none touch-pan-y"
            style={{ aspectRatio: '4 / 4.8' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`relative h-full w-full transition-opacity duration-300 ${
                fadeState === 'transitioning' ? 'opacity-30 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
                className="object-cover"
              />
            </div>

            {/* Navigation Chevrons */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Önceki Fotoğraf"
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#141414]/40 backdrop-blur-md text-white border border-white/20 transition-all hover:bg-[#141414]/80 hover:scale-110 active:scale-95 z-10 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Sonraki Fotoğraf"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#141414]/40 backdrop-blur-md text-white border border-white/20 transition-all hover:bg-[#141414]/80 hover:scale-110 active:scale-95 z-10 shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Floating Index Pill */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-[#141414]/65 backdrop-blur-md px-3 py-1 text-[11px] font-mono tracking-widest text-white/90 border border-white/15">
                {currentNumStr} / {totalNumStr}
              </div>
            )}
          </div>

          {/* DYNAMIC PER-PHOTO NARRATIVE BAR (Changes with every photo) */}
          <div className="mt-6 rounded-lg bg-[#FAF5EE] border border-[#161413]/08 p-6 md:p-8 transition-all">
            <div className="flex items-center justify-between gap-4 border-b border-[#161413]/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-syne text-[10px] font-bold uppercase tracking-[0.24em] text-[#8B1117]">
                  {currentImage.subtitle || `${currentNumStr} / ${locale === 'tr' ? 'Detay Perspektifi' : 'Detail View'}`}
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="flex items-center gap-2">
                <div className="h-1 w-20 overflow-hidden rounded-full bg-[#161413]/15">
                  <div
                    className="h-full bg-[#8B1117] transition-all duration-300 ease-out"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[#584E44]">
                  {currentNumStr}/{totalNumStr}
                </span>
              </div>
            </div>

            {/* Photo description */}
            <p
              className={`mt-4 text-[14px] md:text-[15px] leading-[1.75] text-[#3A322A] transition-opacity duration-200 ${
                fadeState === 'transitioning' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {currentImage.description || product.summary}
            </p>
          </div>

          {/* Thumbnails strip */}
          {allImages.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`group relative h-20 w-20 overflow-hidden rounded-md border-2 transition-all ${
                    idx === activeIndex
                      ? 'border-[#8B1117] shadow-sm scale-105 ring-2 ring-[#8B1117]/20'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Architectural Specs & Studio Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col items-start">
          {product.category && (
            <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
              {product.category}
            </span>
          )}

          <h1 className="mt-3 font-serif text-[clamp(2.1rem,3.4vw,3.25rem)] font-normal leading-[1.12] tracking-[-0.015em] text-[#141414]">
            {product.name}
          </h1>

          {product.summary && (
            <p className="mt-6 text-[16px] md:text-[17px] leading-[1.75] font-medium text-[#221F1D]">
              {product.summary}
            </p>
          )}

          {product.description && (
            <div className="mt-6 space-y-4 text-[14px] md:text-[15px] leading-[1.8] text-[#584E44]">
              {product.description
                .split(/\n{2,}/)
                .map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
            </div>
          )}

          {/* Specifications Table */}
          {cleanSpecs.length > 0 && (
            <div className="mt-10 w-full">
              <h2 className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#161413]/50">
                {specsLabel}
              </h2>
              <dl className="mt-4 w-full divide-y divide-[#161413]/10 border-y border-[#161413]/12">
                {cleanSpecs.map((spec, i) => (
                  <div
                    key={`${spec.label}-${i}`}
                    className="flex items-baseline justify-between gap-6 py-3.5"
                  >
                    <dt className="text-[13px] text-[#584E44]">{spec.label}</dt>
                    <dd className="text-right font-syne text-[12px] font-bold tracking-[0.02em] text-[#161413]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Studio Contact / Inquiry CTA */}
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-none border border-[#161413]/25 px-8 py-4 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#161413] transition-all hover:border-[#8B1117] hover:bg-[#8B1117] hover:text-[#F5EFE6] active:scale-[0.98]"
          >
            <span>{contactLabel}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
