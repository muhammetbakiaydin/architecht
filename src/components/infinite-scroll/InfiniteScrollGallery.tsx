'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from './Slider';
import Reveal from './Reveal';
import Transition from './Transition';
import type { GallerySlide } from './types';
import './infiniteScroll.css';

/**
 * Waits for the things the loop actually needs before it can measure.
 *
 * Deliberately NOT the images. Every slide's box is pure CSS - a fixed
 * `--img-w` and a 0.8 aspect ratio - so the loop's geometry does not depend on
 * a single byte of image data. The old version blocked the whole page behind
 * `load` on twelve full-size photographs, which is what made the archive take
 * seconds to become scrollable. Fonts DO matter: `Reveal` splits each caption
 * into characters, and splitting before the webfont swaps in measures the
 * fallback.
 */
function whenReadyToMeasure(): Promise<void> {
  const fonts =
    typeof document !== 'undefined' && 'fonts' in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();

  // Cap the wait: a font that never resolves must not keep the page locked.
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1200));

  // One frame for the layout to settle - raced with a timer, because a tab
  // that loads in the background never gets a frame at all.
  const nextFrame = () =>
    new Promise<void>((resolve) => {
      const done = () => resolve();
      requestAnimationFrame(done);
      setTimeout(done, 300);
    });

  return Promise.race([fonts, timeout]).then(nextFrame);
}

export interface InfiniteScrollGalleryProps {
  slides: GallerySlide[];
  /** Fixed frame copy, already translated by the page. */
  frameTitle: string;
  frameNote: string;
  tags: string[];
  backLabel: string;
  /** Rendered top-right; the page supplies locale-aware links. */
  links: React.ReactNode;
}

/**
 * Codrops "Infinite Scroll" archive.
 *
 * Three cooperating pieces, all driven from the same `slides` array:
 *   Slider     - the endless vertical loop and its parallax
 *   Reveal     - per-slide entrance animations
 *   Transition - the Flip morph from thumbnail to full-bleed detail view
 *
 * The page's own scroll is locked while this is mounted; the wheel drives the
 * loop instead.
 */
export const InfiniteScrollGallery: React.FC<InfiniteScrollGalleryProps> = ({
  slides,
  frameTitle,
  frameNote,
  tags,
  backLabel,
  links,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // Read inside the effect without making the effect depend on the array
  // identity - re-running it would tear down and rebuild the whole loop.
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Lock page scroll and set the canvas background
    const prevOverflow = document.body.style.overflow;
    const prevBg = document.body.style.backgroundColor;
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#eaeeed';

    let slider: Slider | null = null;
    let reveal: Reveal | null = null;
    let transition: Transition | null = null;
    let isCleanedUp = false;

    type SlideHandlers = {
      handleClick: () => void;
      handleKeyDown: (e: KeyboardEvent) => void;
    };
    const attached: { slide: HTMLElement; handlers: SlideHandlers }[] = [];

    whenReadyToMeasure().then(() => {
      if (isCleanedUp) return;
      root.classList.remove('loading');

      transition = new Transition({
        container: root,
        slides: slidesRef.current,
        onClose: () => {
          slider?.start();
        },
      });

      reveal = new Reveal(root);

      slider = new Slider({
        container: root,
        enabled: () => transition?.state === 'closed',
        onToggle: (changes, immediate) => {
          reveal?.toggle(changes, immediate);
        },
      });

      Array.from(root.querySelectorAll<HTMLElement>('.gallery__slide')).forEach(
        (slide, index) => {
          slide.setAttribute('tabindex', '0');
          slide.setAttribute('role', 'button');

          const open = () => {
            if (!transition || transition.state !== 'closed') return;
            slider?.stop();
            transition.open(slide, index);
          };

          const handlers: SlideHandlers = {
            handleClick: () => open(),
            handleKeyDown: (e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
              }
            },
          };

          slide.addEventListener('click', handlers.handleClick);
          slide.addEventListener('keydown', handlers.handleKeyDown);
          attached.push({ slide, handlers });
        }
      );
    });

    const backBtn = root.querySelector('.content__back');
    const handleBackClick = () => transition?.close();
    backBtn?.addEventListener('click', handleBackClick);

    const handleDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') transition?.close();
    };
    document.addEventListener('keydown', handleDocKeyDown);

    return () => {
      isCleanedUp = true;
      document.body.style.overflow = prevOverflow;
      document.body.style.backgroundColor = prevBg;

      document.removeEventListener('keydown', handleDocKeyDown);
      backBtn?.removeEventListener('click', handleBackClick);

      attached.forEach(({ slide, handlers }) => {
        slide.removeEventListener('click', handlers.handleClick);
        slide.removeEventListener('keydown', handlers.handleKeyDown);
      });

      slider?.destroy();
      reveal?.destroy();
      transition?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="infinite-scroll-root loading">
      <header className="frame">
        <h1 className="frame__title">{frameTitle}</h1>
        <nav className="frame__links">{links}</nav>
        <nav className="frame__tags">
          {tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </nav>
        <div className="frame__note">{frameNote}</div>
      </header>

      <div className="gallery">
        {slides.map((slide) => (
          <figure
            key={slide.index}
            className="gallery__slide"
            style={
              {
                '--stagger': slide.stagger,
                '--img-w': slide.imgWidth,
              } as React.CSSProperties
            }
          >
            <div className="gallery__slide-inner">
              <div className="gallery__img-wrapper">
                {/* The loop can wrap any slide into view at any moment, so none
                    of them may be deferred - but only the first few are worth
                    competing for bandwidth on the first paint. `fill` keeps the
                    stylesheet in charge of the box (and of the 1.2 scale the
                    reveal animates away). */}
                <Image
                  className="gallery__img"
                  src={slide.image}
                  alt={slide.caption}
                  fill
                  /* Each slide carries its own width, and the mobile breakpoint
                     multiplies it by --img-scale; telling the browser exactly
                     that is what stops it over- or under-fetching per slide. */
                  sizes={`(max-width: 53em) calc(${slide.imgWidth} * 2.6), ${slide.imgWidth}`}
                  loading="eager"
                  priority={slide.index < 4}
                />
              </div>
              <figcaption>{slide.caption}</figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* Full-bleed detail overlay the Flip morph lands in */}
      <div className="content">
        <div className="content-wrapper">
          <figure className="content__preview-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="preview-img-primary" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="preview-img-secondary" alt="" style={{ opacity: 0 }} />
            <button
              className="content__nav-btn content__nav-btn--prev"
              type="button"
              aria-label="Önceki Fotoğraf"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="content__nav-btn content__nav-btn--next"
              type="button"
              aria-label="Sonraki Fotoğraf"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </figure>

          <div className="content__counter">
            <span className="content__counter-current">01</span>
            <div className="content__counter-track">
              <div className="content__counter-bar" />
            </div>
            <span className="content__counter-total">01</span>
            <div className="content__counter-hint">KAYDIR</div>
          </div>

          <div className="content__group-list">
            <button className="content__back" type="button">
              &larr; <span className="content__back-text">{backLabel}</span> <span className="content__back-esc">[ESC]</span>
            </button>
            {slides.map((slide) => (
              <div key={slide.index} className="content__group" data-index={slide.index}>
                <div className="content__category">{slide.category || 'MİMARİ & İÇ MEKAN'}</div>
                <h2 className="content__title">{slide.title}</h2>
                <div className="content__subtitle">{slide.gallery[0]?.subtitle ?? ''}</div>
                <div className="content__description">{slide.gallery[0]?.description ?? slide.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollGallery;
