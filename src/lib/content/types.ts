import type { Locale } from '@/i18n/routing';
import type { SocialLink } from '@/lib/supabase/types';

export type { Locale };

/**
 * Locale-resolved view models.
 *
 * Everything the pages render goes through these. The `*_tr` / `*_en` column
 * pairs never leak past `src/lib/content/*` - a component only ever sees the
 * single string for the locale it is rendering.
 */

export interface SiteSettings {
  brand: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  mapUrl: string;
  foundedYear: number;
  socials: SocialLink[];
  seoTitle: string;
  seoDescription: string;
}

export interface ContentBlock {
  key: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  /** Shape depends on the block; see each page's usage. */
  data: Record<string, unknown>;
}

/** A page's blocks, addressable by key with a safe empty fallback. */
export interface BlockMap {
  get(key: string): ContentBlock;
  has(key: string): boolean;
  all(): ContentBlock[];
}

export interface ProjectImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  caption: string;
  description: string;
  coverUrl: string;
  year: number | null;
  location: string;
  category: string;
  client: string;
  area: string;
  /** CSS custom properties the infinite-scroll layout reads. */
  stagger: string;
  imgWidth: string;
  isFeatured: boolean;
  images: ProjectImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  coverUrl: string;
  category: string;
  material: string;
  dimensions: string;
  specs: ProductSpec[];
  isFeatured: boolean;
  images: ProductImage[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  tags: string[];
  author: string;
  publishedAt: string;
  /** Rounded up, 200 words per minute. */
  readingMinutes: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  width: number;
  height: number;
}

export interface Award {
  id: string;
  label: string;
  year: number | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}
