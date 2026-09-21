'use client';

import * as React from 'react';

/**
 * Ported from the Codrops "Infinite Canvas" demo loader.
 * Holds for a minimum of 1.5s so a warm texture cache does not produce a flash,
 * and eases the bar toward the real progress instead of jumping to it.
 */
export function PageLoader({
  progress,
  label,
  maxWaitMs = 6000,
}: {
  progress: number;
  label: string;
  /**
   * Hard ceiling on how long the overlay may sit there.
   *
   * `useProgress` reports loaded/total against a manager whose total keeps
   * growing as new chunks stream in, so the ratio can settle below 100 and
   * never reach it. The scene is already rendering underneath by then, so
   * after this long the overlay simply gets out of the way.
   */
  maxWaitMs?: number;
}) {
  const [show, setShow] = React.useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);
  const [waitedLongEnough, setWaitedLongEnough] = React.useState(false);
  const visualRef = React.useRef(0);
  const [visualProgress, setVisualProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setWaitedLongEnough(true), maxWaitMs);
    return () => clearTimeout(timer);
  }, [maxWaitMs]);

  React.useEffect(() => {
    let raf: number;

    const animate = () => {
      const diff = progress - visualRef.current;

      if (diff > 0.1) {
        // Lerp toward target, faster when further behind
        visualRef.current += diff * 0.08;
        setVisualProgress(visualRef.current);
        raf = requestAnimationFrame(animate);
      } else {
        // Snap when close enough
        visualRef.current = progress;
        setVisualProgress(progress);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const isDone =
    (minTimeElapsed && progress === 100 && visualProgress >= 99.5) ||
    (waitedLongEnough && minTimeElapsed);

  React.useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => setShow(false), 400);
    return () => clearTimeout(t);
  }, [isDone]);

  if (!show) return null;

  const isHidden = isDone;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#F5EFE6] transition-opacity duration-500 ${
        isHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="font-syne text-[10px] font-bold uppercase tracking-[0.4em] text-[#161413]/45">
        {label}
      </span>
      <div className="h-px w-[200px] overflow-hidden bg-[#161413]/12">
        <div
          className="h-full w-full origin-left bg-[#8B1117]"
          style={{ transform: `scaleX(${isDone ? 1 : visualProgress / 100})` }}
        />
      </div>
    </div>
  );
}

export default PageLoader;
