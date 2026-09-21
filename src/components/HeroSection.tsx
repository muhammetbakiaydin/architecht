'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AwardsRibbon from './AwardsRibbon';
import { useSmoothScroll } from './SmoothScrollProvider';
import type { WebGPUCanvasHandle } from './WebGPUCanvas';

const WebGPUCanvas = dynamic(() => import('./WebGPUCanvas'), {
  ssr: false,
});

/**
 * Progress at which the hero's canvas has nothing left to show.
 *
 * The MSDF tail fade in `src/webgpu/msdfText.ts` finishes at 0.96 and the last
 * petals have a short life after that, so from here on the canvas is a
 * full-screen transparent layer that still costs a composite on every frame of
 * the remaining ~12 000px of page. Past this point it is hidden outright.
 */
const CANVAS_DONE_AT = 0.995;

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<WebGPUCanvasHandle>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  const { lenis } = useSmoothScroll();

  // Two independent reasons to stop drawing; the canvas is told the AND of them.
  const inView = useRef(true);
  const heroDone = useRef(false);
  const syncDrawing = useCallback(() => {
    canvasRef.current?.setVisible(inView.current && !heroDone.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!lenis || !container) return;

    // Measured once per layout instead of per frame: `getBoundingClientRect()`
    // inside a scroll handler forces a synchronous layout on every single
    // frame, which is the most expensive thing the hero used to do.
    let sectionTop = 0;
    let scrollableHeight = 0;

    const measure = () => {
      // Document-absolute, so it stays correct whatever positioned ancestor
      // the section ends up inside.
      sectionTop = container.getBoundingClientRect().top + window.scrollY;
      scrollableHeight = container.offsetHeight - window.innerHeight;
    };

    const handleScroll = (e?: { scroll?: number; velocity?: number }) => {
      const scroll = e?.scroll ?? window.scrollY;

      // Guard the divide: before styles settle the section can measure exactly
      // one viewport tall, and 0/0 produced a NaN opacity on the ribbon.
      const progress =
        scrollableHeight > 0
          ? Math.max(0, Math.min(1, (scroll - sectionTop) / scrollableHeight))
          : 0;

      canvasRef.current?.setScrollProgress(progress, e?.velocity ?? 0);

      // Written straight to the node. This fires on every Lenis frame, so
      // routing it through React state re-rendered the hero (and the whole
      // awards ribbon) 60-120 times a second while scrolling.
      if (ribbonRef.current) {
        ribbonRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.2));
      }

      const done = progress >= CANVAS_DONE_AT;
      if (done !== heroDone.current) {
        heroDone.current = done;
        if (canvasLayerRef.current) {
          canvasLayerRef.current.style.visibility = done ? 'hidden' : 'visible';
        }
        syncDrawing();
      }
    };

    measure();
    lenis.on('scroll', handleScroll);
    handleScroll();

    const onResize = () => {
      measure();
      handleScroll();
    };
    window.addEventListener('resize', onResize);

    return () => {
      lenis.off('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [lenis, syncDrawing]);

  // Stop the WebGPU draw once the hero is off-screen so the gallery's scrubbed
  // timeline below has the frame budget to itself.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        syncDrawing();
      },
      { threshold: 0 }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, [syncDrawing]);

  return (
    <section ref={containerRef} className="relative w-full h-[260vh] bg-[#F5EFE6]">
      {/* Fixed Fullscreen Viewport for WebGPU Background */}
      {/* `justify-end` parks the ribbon at the bottom: the top strip that used
          to balance it now lives in the Navbar, which sits above this layer. */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden bg-radial-cream flex flex-col justify-end z-0">
        {/* Subtle Architectural Paper Grain */}
        <div className="absolute inset-0 bg-editorial-grain opacity-[0.035] mix-blend-multiply z-10 pointer-events-none" />

        {/* 3D WebGPU Canvas ("EMRE MERIC" + Rose Petals + Gold Dust).
            The canvas is transparent, so the cream gradient above shows through.
            Hidden - not unmounted - once the dissolve is over, so scrolling back
            up restores it instantly. */}
        <div ref={canvasLayerRef} className="w-full h-full absolute inset-0 z-0">
          <WebGPUCanvas ref={canvasRef} text="EMRE MERIC" />
        </div>

        {/* Bottom Awards Ribbon */}
        <div ref={ribbonRef} className="relative z-20 w-full pb-8 md:pb-10 pointer-events-auto">
          <AwardsRibbon />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
