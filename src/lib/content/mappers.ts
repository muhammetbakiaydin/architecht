import type { Locale } from '@/i18n/routing';
import { mediaUrl } from '@/lib/supabase/env';
import type {
  AwardRow,
  BlogPostRow,
  ContentBlockRow,
  GalleryItemRow,
  Json,
  ProductImageRow,
  ProductRow,
  ProjectImageRow,
  ProjectRow,
  SiteSettingsRow,
  SocialLink,
  TeamMemberRow,
} from '@/lib/supabase/types';
import type {
  Award,
  BlockMap,
  BlogPost,
  ContentBlock,
  GalleryItem,
  Product,
  ProductImage,
  ProductSpec,
  Project,
  ProjectImage,
  SiteSettings,
  TeamMember,
} from './types';

/**
 * Locale resolution.
 *
 * Turkish is the default locale, so an empty English field falls back to the
 * Turkish one rather than rendering a hole in the page. The reverse is also
 * true - whichever side the editor filled in is the one that shows.
 */
export function pick(
  locale: Locale,
  tr: string | null | undefined,
  en: string | null | undefined
): string {
  const primary = (locale === 'tr' ? tr : en) ?? '';
  if (primary.trim().length > 0) return primary;
  const secondary = (locale === 'tr' ? en : tr) ?? '';
  return secondary;
}

/** Narrow a jsonb column to a plain record without throwing on nulls/arrays. */
function asRecord(value: Json): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Pull a bilingual pair out of a jsonb sub-object (`title_tr` / `title_en`). */
export function pickFrom(
  locale: Locale,
  source: Record<string, unknown>,
  field: string
): string {
  return pick(locale, str(source[`${field}_tr`]), str(source[`${field}_en`]));
}

export { asArray as jsonArray, asRecord as jsonRecord, str as jsonString };

// ---------------------------------------------------------------- settings --

export function toSiteSettings(row: SiteSettingsRow, locale: Locale): SiteSettings {
  const socials = Array.isArray(row.socials) ? (row.socials as SocialLink[]) : [];
  return {
    brand: row.brand,
    tagline: pick(locale, row.tagline_tr, row.tagline_en),
    email: row.email,
    phone: row.phone ?? '',
    address: pick(locale, row.address_tr, row.address_en),
    hours: pick(locale, row.hours_tr, row.hours_en),
    mapUrl: row.map_url ?? '',
    foundedYear: row.founded_year ?? new Date().getFullYear(),
    socials: socials.filter((s) => s && s.label && s.href),
    seoTitle: pick(locale, row.seo_title_tr, row.seo_title_en),
    seoDescription: pick(locale, row.seo_description_tr, row.seo_description_en),
  };
}

// ------------------------------------------------------------------ blocks --

export function toContentBlock(row: ContentBlockRow, locale: Locale): ContentBlock {
  return {
    key: row.block_key,
    eyebrow: pick(locale, row.eyebrow_tr, row.eyebrow_en),
    title: pick(locale, row.title_tr, row.title_en),
    subtitle: pick(locale, row.subtitle_tr, row.subtitle_en),
    body: pick(locale, row.body_tr, row.body_en),
    imageUrl: mediaUrl(row.image_url),
    ctaLabel: pick(locale, row.cta_label_tr, row.cta_label_en),
    ctaHref: row.cta_href ?? '',
    data: asRecord(row.data),
  };
}

export const EMPTY_BLOCK: ContentBlock = {
  key: '',
  eyebrow: '',
  title: '',
  subtitle: '',
  body: '',
  imageUrl: '',
  ctaLabel: '',
  ctaHref: '',
  data: {},
};

/**
 * Wrap a page's blocks so a component can ask for one by key and always get an
 * object back. A missing block renders as empty rather than crashing the page -
 * which matters because an editor can hide any block from the admin panel.
 */
export function toBlockMap(blocks: ContentBlock[]): BlockMap {
  const index = new Map(blocks.map((b) => [b.key, b]));
  return {
    get: (key) => index.get(key) ?? EMPTY_BLOCK,
    has: (key) => index.has(key),
    all: () => blocks,
  };
}

// ----------------------------------------------------------------- projects --

export function toProjectImage(row: ProjectImageRow, locale: Locale): ProjectImage {
  return {
    id: row.id,
    url: mediaUrl(row.url),
    title: pick(locale, row.title_tr, row.title_en),
    subtitle: pick(locale, row.subtitle_tr, row.subtitle_en),
    description: pick(locale, row.description_tr, row.description_en),
  };
}

export function toProject(
  row: ProjectRow,
  images: ProjectImageRow[],
  locale: Locale
): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.title_tr, row.title_en),
    caption: pick(locale, row.caption_tr, row.caption_en) || pick(locale, row.title_tr, row.title_en),
    description: pick(locale, row.description_tr, row.description_en),
    coverUrl: mediaUrl(row.cover_url),
    year: row.year,
    location: pick(locale, row.location_tr, row.location_en),
    category: row.category ?? '',
    client: row.client ?? '',
    area: row.area ?? '',
    stagger: row.stagger,
    imgWidth: row.img_width,
    isFeatured: row.is_featured,
    images: [...images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => toProjectImage(img, locale)),
  };
}

// ----------------------------------------------------------------- products --

export function toProductImage(row: ProductImageRow, locale: Locale): ProductImage {
  return {
    id: row.id,
    url: mediaUrl(row.url),
    alt: pick(locale, row.alt_tr, row.alt_en),
    title: pick(locale, row.title_tr, row.title_en) || undefined,
    subtitle: pick(locale, row.subtitle_tr, row.subtitle_en) || undefined,
    description: pick(locale, row.description_tr, row.description_en) || undefined,
  };
}

export function toProduct(
  row: ProductRow,
  images: ProductImageRow[],
  locale: Locale
): Product {
  const specs: ProductSpec[] = (Array.isArray(row.specs) ? row.specs : []).map((spec) => ({
    label: pick(locale, spec?.label_tr, spec?.label_en),
    value: pick(locale, spec?.value_tr, spec?.value_en),
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: pick(locale, row.name_tr, row.name_en),
    summary: pick(locale, row.summary_tr, row.summary_en),
    description: pick(locale, row.description_tr, row.description_en),
    coverUrl: mediaUrl(row.cover_url),
    category: row.category ?? '',
    material: pick(locale, row.material_tr, row.material_en),
    dimensions: row.dimensions ?? '',
    specs: specs.filter((s) => s.label || s.value),
    isFeatured: row.is_featured,
    images: [...images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => toProductImage(img, locale)),
  };
}

// --------------------------------------------------------------------- blog --

/** 200 words a minute, never below one. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toBlogPost(row: BlogPostRow, locale: Locale): BlogPost {
  const body = pick(locale, row.body_tr, row.body_en);
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.title_tr, row.title_en),
    excerpt: pick(locale, row.excerpt_tr, row.excerpt_en),
    body,
    coverUrl: mediaUrl(row.cover_url),
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: row.author ?? '',
    publishedAt: row.published_at,
    readingMinutes: readingMinutes(body),
  };
}

// ------------------------------------------------------------------ gallery --

export function toGalleryItem(row: GalleryItemRow, locale: Locale): GalleryItem {
  return {
    id: row.id,
    url: mediaUrl(row.url),
    title: pick(locale, row.title_tr, row.title_en),
    width: row.width,
    height: row.height,
  };
}

// ------------------------------------------------------------ about extras --

export function toAward(row: AwardRow, locale: Locale): Award {
  return {
    id: row.id,
    label: pick(locale, row.label_tr, row.label_en),
    year: row.year,
  };
}

export function toTeamMember(row: TeamMemberRow, locale: Locale): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: pick(locale, row.role_tr, row.role_en),
    bio: pick(locale, row.bio_tr, row.bio_en),
    photoUrl: mediaUrl(row.photo_url),
  };
}
