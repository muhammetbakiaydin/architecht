/**
 * The shape the infinite-scroll archive renders.
 *
 * Built in `src/app/[locale]/projects/page.tsx` from the locale-resolved
 * `Project` view models, so this module stays free of database and i18n
 * concerns - it only knows about slides and photographs.
 */

export interface GallerySlideDetail {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface GallerySlide {
  /** Position in the loop; also the `data-index` the transition matches on. */
  index: number;
  slug: string;
  image: string;
  caption: string;
  /** CSS custom property values: horizontal drift and rendered width. */
  stagger: string;
  imgWidth: string;
  title: string;
  category?: string;
  description: string;
  /** Photographs shown in the expanded view; always at least one. */
  gallery: GallerySlideDetail[];
}
