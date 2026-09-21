'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { GalleryItem } from '@/lib/content/types';
import type { MediaItem } from './types';
import { useIsTouchDevice } from './use-is-touch-device';
import PageLoader from './PageLoader';

/**
 * The WebGL scene reads `window.devicePixelRatio` while rendering, so it must
 * never run on the server. Loading it lazily also keeps three.js and
 * react-three-fiber out of every other route's bundle.
 */
const InfiniteCanvasScene = dynamic(
  () => import('./scene').then((mod) => mod.InfiniteCanvasScene),
  { ssr: false }
);

export interface GalleryExperienceProps {
  items: GalleryItem[];
  title: string;
  loadingLabel: string;
  hintDesktop: string;
  hintTouch: string;
  emptyLabel: string;
  /** Locale-aware links rendered in the top-right of the frame. */
  links: React.ReactNode;
}

export default function GalleryExperience({
  items,
  title,
  loadingLabel,
  hintDesktop,
  hintTouch,
  emptyLabel,
  links,
}: GalleryExperienceProps) {
  const isTouchDevice = useIsTouchDevice();
  const [sceneProgress, setSceneProgress] = React.useState(0);
  const [preloadProgress, setPreloadProgress] = React.useState(0);

  const media: MediaItem[] = React.useMemo(
    () =>
      items
        .filter((item) => item.url)
        .map((item) => ({ url: item.url, width: item.width, height: item.height })),
    [items]
  );

  /**
   * Decode the first screenful of images before lifting the loader.
   *
   * The scene's own `useProgress` counts every texture the chunk streamer has
   * ever requested, so its ratio drifts and can settle below 100 - it cannot be
   * used on its own to decide when there is something to look at. Warming the
   * browser cache here means the textures the canvas asks for next are already
   * decoded, so the first frame it paints is not empty.
   */
  React.useEffect(() => {
    const urls = media.slice(0, 24).map((item) => item.url);
    if (urls.length === 0) {
      setPreloadProgress(100);
      return;
    }

    let cancelled = false;
    let settled = 0;

    const done = () => {
      if (cancelled) return;
      settled += 1;
      setPreloadProgress(Math.round((settled / urls.length) * 100));
    };

    const images = urls.map((url) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = url;
      return img;
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [media]);

  // The page locks its own scroll: the wheel drives the camera's z axis.
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (media.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5EFE6]">
        <p className="font-syne text-[12px] uppercase tracking-[0.3em] text-[#161413]/45">
          {emptyLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5EFE6]">
      <PageLoader
        progress={Math.max(preloadProgress, sceneProgress)}
        label={loadingLabel}
        maxWaitMs={12000}
      />

      <InfiniteCanvasScene
        media={media}
        onTextureProgress={setSceneProgress}
        backgroundColor="#F5EFE6"
        fogColor="#F5EFE6"
      />

      {/* Frame: sits above the canvas, only its own controls take pointer events */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <h1 className="font-syne text-[11px] font-bold uppercase tracking-[0.34em] text-[#161413]">
            {title}
          </h1>
          <nav className="pointer-events-auto flex flex-wrap justify-end gap-x-6 gap-y-2 text-right font-syne text-[10px] font-bold uppercase tracking-[0.24em] text-[#161413]/60 [&_a:hover]:text-[#8B1117] [&_a]:transition-colors">
            {links}
          </nav>
        </div>

        <div className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#161413]/40">
          {isTouchDevice ? hintTouch : hintDesktop}
        </div>
      </div>
    </div>
  );
}
