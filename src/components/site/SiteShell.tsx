import React from 'react';
import type { Locale } from '@/i18n/routing';
import { getAwards, getSiteSettings } from '@/lib/content';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export interface SiteShellProps {
  locale: Locale;
  children: React.ReactNode;
  /** Home only: let the WebGPU hero show through the bar until it scrolls away. */
  transparentHeader?: boolean;
  /** Immersive pages (the 3D gallery) paint their own chrome. */
  hideFooter?: boolean;
  /** Pages that start under the fixed bar rather than behind it. */
  padTop?: boolean;
  mainClassName?: string;
}

/**
 * The standard page frame: smooth scroll, fixed header, footer.
 *
 * `overflow-x-clip` - NOT `overflow-x-hidden`. `overflow-x: hidden` makes
 * `overflow-y` compute to `auto`, which turns <main> into a scroll container
 * and silently kills every `position: sticky` descendant. `clip` hides the same
 * horizontal overflow without creating a scrollport.
 */
export default async function SiteShell({
  locale,
  children,
  transparentHeader = false,
  hideFooter = false,
  padTop = true,
  mainClassName = '',
}: SiteShellProps) {
  const [settings, awards] = await Promise.all([getSiteSettings(locale), getAwards(locale)]);

  return (
    <SmoothScrollProvider>
      <SiteHeader
        brand={settings.brand}
        tagline={settings.tagline}
        transparentUntilScroll={transparentHeader}
      />

      <main
        className={`relative min-h-screen overflow-x-clip bg-[#F5EFE6] text-[#161413] selection:bg-[#8B1117] selection:text-white ${
          padTop ? 'pt-[86px] md:pt-[96px]' : ''
        } ${mainClassName}`}
      >
        {children}
      </main>

      {!hideFooter && <SiteFooter settings={settings} awards={awards} />}
    </SmoothScrollProvider>
  );
}
