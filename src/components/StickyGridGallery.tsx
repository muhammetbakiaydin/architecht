'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StickyGridGallery.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Used only when the caller passes no images (e.g. an empty database). */
const FALLBACK_IMAGES = Array.from({ length: 12 }, (_, i) => `/projects/${i + 1}.webp`);

const NUM_COLUMNS = 3;

/** Rebuild only on a real layout change, not on scrollbar-width jitter. */
const WIDTH_CHANGE_THRESHOLD = 40;

/**
 * Waits for what the timeline actually measures.
 *
 * The reveal distance comes from `grid.offsetHeight` and the title's resting
 * offset from `title.offsetHeight` - the first is fixed by `aspect-ratio: 1`
 * on every cell and so is known without a single image byte, the second moves
 * when the webfont swaps in. So: wait for fonts, not for twelve photographs.
 * The previous version held the whole scroll timeline hostage to `load` on
 * every image in the grid.
 */
function whenReadyToMeasure(): Promise<void> {
  const fonts =
    typeof document !== 'undefined' && 'fonts' in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();

  // Cap the wait so a font that never resolves cannot stall the timeline.
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

export interface StickyGridItem {
  src: string;
  alt: string;
}

export interface StickyGridGalleryProps {
  items?: StickyGridItem[];
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export const StickyGridGallery: React.FC<StickyGridGalleryProps> = ({
  items,
  eyebrow: eyebrowText,
  title: titleText,
  description: descriptionText,
  ctaLabel,
  ctaHref,
}) => {
  // The scroll timeline is built against a fixed number of grid cells, so the
  // list is normalised to twelve: padded by repeating, trimmed if longer.
  const images: StickyGridItem[] = React.useMemo(() => {
    const source = items && items.length > 0
      ? items
      : FALLBACK_IMAGES.map((src, i) => ({ src, alt: `Project ${i + 1}` }));
    return Array.from({ length: 12 }, (_, i) => source[i % source.length]);
  }, [items]);

  const blockRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const block = blockRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;
    const grid = gridRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];

    if (
      !block ||
      !wrapper ||
      !content ||
      !eyebrow ||
      !title ||
      !description ||
      !button ||
      !grid ||
      items.length === 0
    ) {
      return;
    }

    // Group grid items into columns, round-robin: 0,3,6,9 | 1,4,7,10 | 2,5,8,11
    const columns: HTMLLIElement[][] = Array.from({ length: NUM_COLUMNS }, () => []);
    items.forEach((item, index) => {
      columns[index % NUM_COLUMNS].push(item);
    });

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    // Held outside the context and reassigned by each build, so a rebuild can
    // never leave a second stale copy-sync running against a reverted
    // timeline - the ticker only ever calls the current one.
    let syncCopy: (() => void) | null = null;
    const tick = () => syncCopy?.();
    gsap.ticker.add(tick);

    const build = () => {
      syncCopy = null;
      ctx?.revert();

      ctx = gsap.context(() => {
        // --- Initial content state -------------------------------------------
        // Everything except the title starts hidden, but stays in the flex flow
        // so the layout never shifts when it fades in.
        const secondary = [eyebrow, description, button];
        gsap.set(secondary, { opacity: 0, pointerEvents: 'none' });

        // The title is the only visible piece at first, so nudge it to the
        // optical centre of `.content`; the copy reveal slides it back up to
        // its natural flex position.
        const titleCentreOffsetPx =
          content.offsetHeight / 2 - (title.offsetTop + title.offsetHeight / 2);
        const titleOffsetY = (titleCentreOffsetPx / title.offsetHeight) * 100;
        gsap.set(title, { yPercent: titleOffsetY });

        // --- Parallax: the sticky wrapper slides in as the block enters -------
        gsap.from(wrapper, {
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });

        // --- Title fade-in ----------------------------------------------------
        gsap.from(title, {
          opacity: 0,
          duration: 0.7,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 57%',
            toggleActions: 'play none none reset',
          },
        });

        // --- Grid reveal: columns fly in from alternating directions ----------
        const revealTl = gsap.timeline();
        const wh = window.innerHeight;
        // Distance that parks the grid completely outside the viewport (with safe buffer).
        const dy = wh - (wh - grid.offsetHeight) / 2 + 150;

        columns.forEach((column, colIndex) => {
          const fromTop = colIndex % 2 === 0;

          revealTl.from(
            column,
            {
              y: dy * (fromTop ? -1 : 1),
              stagger: {
                each: 0.06,
                from: fromTop ? 'end' : 'start',
              },
              ease: 'power1.inOut',
            },
            'grid-reveal' // shared label: all three columns move together
          );
        });

        // --- Grid zoom: scale up, then split apart to expose the copy ---------
        const zoomTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });
        zoomTl.to(grid, { scale: 2.05 });
        zoomTl.to(columns[0], { xPercent: -40 }, '<'); // left column exits left
        zoomTl.to(columns[2], { xPercent: 40 }, '<'); // right column exits right
        zoomTl.to(
          columns[1],
          {
            // Centre column parts vertically: top half up, bottom half down.
            yPercent: (index: number) =>
              (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '-=0.5'
        );

        // --- Copy reveal ------------------------------------------------------
        const revealCopy = (isVisible: boolean, instant: boolean) => {
          const scale = instant ? 0 : 1;
          gsap
            // `auto`, not `true`: `overwrite: true` kills every tween of the
            // target, so this yPercent tween also killed the title's own
            // opacity fade-in mid-flight (it stuck around 0.58 on a fast
            // flick). `auto` only overwrites the properties that clash.
            .timeline({ defaults: { overwrite: 'auto' } })
            .to(title, {
              yPercent: isVisible ? 0 : titleOffsetY,
              duration: 0.7 * scale,
              ease: 'power2.inOut',
            })
            .to(
              secondary,
              {
                opacity: isVisible ? 1 : 0,
                duration: 0.4 * scale,
                ease: `power1.${isVisible ? 'inOut' : 'out'}`,
                pointerEvents: isVisible ? 'all' : 'none',
              },
              instant ? '<' : isVisible ? '-=90%' : '<'
            );
        };

        let copyVisible = false;
        let copySettled = false;
        const setCopyVisible = (isVisible: boolean) => {
          const instant = !copySettled;
          copySettled = true;
          if (isVisible === copyVisible) return;
          copyVisible = isVisible;
          revealCopy(isVisible, instant);
        };

        // --- Master scrubbed timeline ----------------------------------------
        // Filled in once the timeline is assembled, below.
        let copyAtProgress = 1;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 25%',
            end: 'bottom bottom',
            scrub: true,
          },
        });

        // The copy's visibility is read off the playhead once per frame rather
        // than driven by any crossing event, because every event-based variant
        // tried here had a hole:
        //   - a callback inside the scrubbed timeline only learns that it was
        //     crossed, not which way: `direction` flips during Lenis' inertial
        //     settle, and `scrollTrigger.progress` still holds the previous
        //     step's value while the callback runs, so the test inverts
        //     exactly at the crossing;
        //   - a separate trigger's onEnter/onLeaveBack skipped crossings when a
        //     flick jumped far in a single tick;
        //   - the ScrollTrigger's own onUpdate fires about once per gesture;
        //   - the timeline's onUpdate is suppressed on the render that clamps
        //     the playhead to 0 or 1, so a fast scroll back to the top left the
        //     copy visible.
        // Two number comparisons per frame, and `setCopyVisible` ignores
        // no-ops, so the state cannot drift out of sync with the position.
        syncCopy = () => setCopyVisible(timeline.progress() >= copyAtProgress);

        timeline.add(revealTl).add(zoomTl, '-=0.6');

        // Where in the timeline the copy appears: 0.32s before the end, which
        // is the original demo's `-=0.32` offset.
        copyAtProgress = (timeline.duration() - 0.32) / timeline.duration();

        // Settles the initial state, including a reload that restores a scroll
        // position already past the reveal point.
        ScrollTrigger.refresh();
        syncCopy();
      }, block);
    };

    whenReadyToMeasure().then(() => {
      if (cancelled) return;
      build();
    });

    // `dy` and the title offset are measured once per build and the layout is
    // viewport-width based, so a real width change needs a rebuild. Height-only
    // changes (mobile URL bar showing/hiding) must not trigger one.
    let lastWidth = window.innerWidth;
    let resizeTimer: number | undefined;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < WIDTH_CHANGE_THRESHOLD) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!cancelled) build();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      syncCopy = null;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="works" ref={blockRef} className={styles.blockMain}>
      <div ref={wrapperRef} className={styles.blockWrapper}>
        {/* Copy, sits above the grid (z-index) */}
        <div ref={contentRef} className={styles.content}>
          <span ref={eyebrowRef} className={`${styles.contentEyebrow} font-syne`}>
            {eyebrowText}
          </span>
          <h2 ref={titleRef} className={`${styles.contentTitle} font-syne font-bold`}>
            {titleText}
          </h2>
          <p ref={descriptionRef} className={`${styles.contentDescription} font-syne`}>
            {descriptionText}
          </p>
          <a ref={buttonRef} className={`${styles.contentButton} font-bold font-syne`} href={ctaHref}>
            {ctaLabel}
          </a>
        </div>

        {/* Gallery grid */}
        <div className={styles.gallery}>
          <ul ref={gridRef} className={styles.galleryGrid}>
            {images.map((item, index) => (
              <li
                key={`${item.src}-${index}`}
                className={styles.galleryItem}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
              >
                {/* The grid is inside a pinned section that the reader scrolls
                    into almost immediately, and every cell is on screen at once
                    during the zoom - so none of them may be deferred. */}
                <Image
                  className={styles.galleryImage}
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 33vw, 250px"
                  loading="eager"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StickyGridGallery;
