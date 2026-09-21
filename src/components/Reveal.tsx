'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child. */
  stagger?: number;
  /** Pixels each child travels up into place. */
  y?: number;
  /** Viewport position the group enters at, as a ScrollTrigger `start`. */
  start?: string;
}

/**
 * Fades and lifts its DIRECT children into place once, when the group scrolls
 * into view. Anything that should move as one unit needs to be a single child
 * element.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  stagger = 0.09,
  y = 28,
  start = 'top 85%',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = Array.from(el.children) as HTMLElement[];
    if (targets.length === 0) return;

    // Respect the OS setting: no transform, no fade, content simply present.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        // `once` so the copy never flickers back out when scrolling up past it.
        scrollTrigger: { trigger: el, start, once: true },
        // Hand the elements back to CSS once the reveal is done.
        clearProps: 'transform,opacity',
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, y, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
