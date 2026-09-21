import 'server-only';

import { cache } from 'react';
import type { Locale } from '@/i18n/routing';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type {
  AwardRow,
  BlogPostRow,
  ContentBlockRow,
  ContentPage,
  GalleryItemRow,
  ProductImageRow,
  ProductRow,
  ProjectImageRow,
  ProjectRow,
  SiteSettingsRow,
  TeamMemberRow,
} from '@/lib/supabase/types';
import {
  SEED_AWARDS,
  SEED_BLOG_POSTS,
  SEED_CONTENT_BLOCKS,
  SEED_GALLERY_ITEMS,
  SEED_PRODUCTS,
  SEED_PROJECTS,
  SEED_SITE_SETTINGS,
  SEED_TEAM_MEMBERS,
} from '@/content/seed';
import {
  pick,
  toAward,
  toBlockMap,
  toBlogPost,
  toContentBlock,
  toGalleryItem,
  toProduct,
  toProject,
  toSiteSettings,
  toTeamMember,
} from './mappers';
import type {
  Award,
  BlockMap,
  BlogPost,
  GalleryItem,
  Product,
  ProductImage,
  Project,
  ProjectImage,
  SiteSettings,
  TeamMember,
} from './types';

export * from './types';
export { pick, pickFrom, jsonArray, jsonRecord, jsonString } from './mappers';

/**
 * The single rule in this file: **never let a data problem take the page down.**
 *
 * With no Supabase credentials the client is `null` and every function returns
 * the bundled seed content. With credentials but a failing query, the error is
 * logged once and the seed is used as well, so a half-migrated database still
 * renders a complete site.
 */

const STAMP = '1970-01-01T00:00:00.000Z';

/** Seed rows omit the columns Postgres fills in; put them back for the mappers. */
const stamped = <T extends object>(row: T) =>
  ({ created_at: STAMP, updated_at: STAMP, ...row }) as T & {
    created_at: string;
    updated_at: string;
  };

function warn(scope: string, error: unknown) {
  // One line, server-side only. Falling back is the expected behaviour, not a crash.
  console.warn(`[content] ${scope} falling back to seed content:`, error);
}

// ---------------------------------------------------------------- settings --

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSettings> => {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (error) throw error;
      if (data) return toSiteSettings(data as SiteSettingsRow, locale);
    } catch (error) {
      warn('site_settings', error);
    }
  }
  return toSiteSettings(stamped(SEED_SITE_SETTINGS), locale);
});

// ------------------------------------------------------------------ blocks --

export const getBlocks = cache(
  async (page: ContentPage, locale: Locale): Promise<BlockMap> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page', page)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          return toBlockMap((data as ContentBlockRow[]).map((row) => toContentBlock(row, locale)));
        }
      } catch (error) {
        warn(`content_blocks(${page})`, error);
      }
    }
    return toBlockMap(
      SEED_CONTENT_BLOCKS.filter((b) => b.page === page && b.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((row) => toContentBlock(stamped(row), locale))
    );
  }
);

// ----------------------------------------------------------------- projects --

interface ListOptions {
  featuredOnly?: boolean;
  limit?: number;
}

interface FeineProjectRow {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  category?: string | null;
  coverImage?: string | null;
  galleryImages?: string | null;
  area?: string | null;
  location?: string | null;
  year?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  content?: string | null;
  isFeatured?: boolean | null;
  sortOrder?: number | null;
}

interface FeineProductRow {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  category?: string | null;
  categoryEn?: string | null;
  material?: string | null;
  materialEn?: string | null;
  dimensions?: string | null;
  summary?: string | null;
  summaryEn?: string | null;
  coverImage?: string | null;
  galleryImages?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
}

const STAGGERS = ['-22vw', '18vw', '-14vw', '24vw'];
const WIDTHS = ['20vw', '26vw', '22vw', '18vw'];

import { enrichProjectData } from './projectEnricher';
import { enrichProductData } from './productEnricher';

function mapFeineProject(row: FeineProjectRow, locale: Locale, index: number = 0): Project {
  let gallery: string[] = [];
  try {
    if (row.galleryImages) {
      gallery = typeof row.galleryImages === 'string' ? JSON.parse(row.galleryImages) : row.galleryImages;
    }
  } catch {
    gallery = [];
  }

  const rawTitle = pick(locale, row.title, row.titleEn || row.title);
  const rawDesc = pick(locale, row.description || row.content, row.descriptionEn || row.description || row.content);
  const rawCat = row.category || 'Mimari';

  if (gallery.length === 0 && row.coverImage) {
    gallery = [row.coverImage];
  }

  const enriched = enrichProjectData(
    row.slug,
    rawTitle,
    rawCat,
    rawDesc,
    gallery,
    locale
  );

  const images: ProjectImage[] = gallery.map((url: string, imgIdx: number) => {
    const detail = enriched.images[imgIdx] || {
      title: enriched.title,
      subtitle: `${String(imgIdx + 1).padStart(2, '0')} / Mimari Detay`,
      description: enriched.description,
    };
    return {
      id: `${row.id}-img-${imgIdx + 1}`,
      url,
      title: detail.title,
      subtitle: detail.subtitle,
      description: detail.description,
    };
  });

  const sort = typeof row.sortOrder === 'number' && row.sortOrder !== 0 ? row.sortOrder : index;
  const yearNum = row.year ? parseInt(String(row.year).replace(/\D/g, '')) || 2025 : 2025;

  return {
    id: row.id,
    slug: row.slug,
    title: enriched.title,
    caption: enriched.title,
    description: enriched.description,
    coverUrl: row.coverImage || (images[0] ? images[0].url : '/infinite-scroll/1.webp'),
    year: yearNum,
    location: pick(locale, row.location || 'İstanbul', row.location || 'Istanbul'),
    category: enriched.category,
    client: 'Özel Proje',
    area: row.area || '',
    stagger: STAGGERS[Math.abs(sort) % STAGGERS.length],
    imgWidth: WIDTHS[Math.abs(sort) % WIDTHS.length],
    isFeatured: row.isFeatured ?? true,
    images,
  };
}

function mapFeineProduct(row: FeineProductRow, locale: Locale): Product {
  let gallery: string[] = [];
  try {
    if (row.galleryImages) {
      gallery = typeof row.galleryImages === 'string' ? JSON.parse(row.galleryImages) : row.galleryImages;
    }
  } catch {
    gallery = [];
  }

  const rawName = pick(locale, row.title, row.titleEn || row.title);
  const refinedName = rawName
    .replace(/^Passion Sofa$/i, 'Aura Heykelsi Kanepe')
    .replace(/^Passion Kanepe$/i, 'Aura Heykelsi Kanepe')
    .replace(/^Glia Masa$/i, 'Glia Masif Ahşap Masa')
    .replace(/^Glia Table$/i, 'Glia Solid Timber Table')
    .replace(/^Zenith Sideboard$/i, 'Kyoto Silindirik Konsol')
    .replace(/^Zenith Konsol$/i, 'Kyoto Silindirik Konsol')
    .replace(/^Alpina Kitaplık$/i, 'Stria Mimari Kitaplık')
    .replace(/^Alpina Bookshelf$/i, 'Stria Architectural Shelf')
    .replace(/^Vaneern$/i, 'Vaneern Monolit Konsol')
    .replace(/^Moni Sehpa$/i, 'Moni Doğal Taş Sehpa')
    .replace(/^Moni Table$/i, 'Moni Natural Stone Table');

  const allUrls: string[] = [];
  if (row.coverImage) allUrls.push(row.coverImage);
  gallery.forEach((url: string) => {
    if (!allUrls.includes(url)) allUrls.push(url);
  });

  const rawSummary = pick(locale, row.summary || '', row.summaryEn || row.summary || '');
  const rawDesc = pick(locale, row.description || '', row.descriptionEn || row.description || '');

  const enriched = enrichProductData(
    row.slug,
    refinedName,
    pick(locale, row.category || '', row.categoryEn || row.category || ''),
    rawSummary,
    rawDesc,
    pick(locale, row.material || '', row.materialEn || row.material || ''),
    row.dimensions || '',
    allUrls,
    locale
  );

  const images: ProductImage[] = enriched.images.map((detail, imgIdx) => ({
    id: `${row.id}-img-${imgIdx + 1}`,
    url: detail.url,
    alt: `${enriched.name} — ${detail.subtitle}`,
    title: detail.title,
    subtitle: detail.subtitle,
    description: detail.description,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: enriched.name,
    summary: enriched.summary,
    description: enriched.description,
    coverUrl: row.coverImage || (images[0] ? images[0].url : '/infinite-scroll/1.webp'),
    category: enriched.category,
    material: enriched.material,
    dimensions: enriched.dimensions,
    specs: enriched.specs,
    isFeatured: true,
    images,
  };
}

function seedProjects(locale: Locale, options: ListOptions = {}): Project[] {
  let rows = SEED_PROJECTS.filter((p) => p.is_published);
  if (options.featuredOnly) rows = rows.filter((p) => p.is_featured);
  rows = rows.sort((a, b) => a.sort_order - b.sort_order);
  if (options.limit) rows = rows.slice(0, options.limit);
  return rows.map((row, idx) => {
    const proj = toProject(
      stamped(row),
      row.images.map((img) => stamped({ ...img, project_id: row.id })),
      locale
    );
    const enriched = enrichProjectData(
      row.slug,
      proj.title,
      proj.category,
      proj.description,
      proj.images.map((img) => img.url),
      locale
    );
    return {
      ...proj,
      title: enriched.title,
      caption: enriched.title,
      category: enriched.category,
      description: enriched.description,
      images: proj.images.map((img, imgIdx) => {
        const detail = enriched.images[imgIdx] || {
          title: enriched.title,
          subtitle: `${String(imgIdx + 1).padStart(2, '0')} / Mimari Detay`,
          description: enriched.description,
        };
        return {
          ...img,
          title: detail.title,
          subtitle: detail.subtitle,
          description: detail.description,
        };
      }),
    };
  });
}

export const getProjects = cache(
  async (locale: Locale, options: ListOptions = {}): Promise<Project[]> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        // 1. Check if user's new Supabase schema table 'projects' exists
        const { data: newSchemaData, error: newSchemaError } = await (supabase as any)
          .from('projects')
          .select('*, project_images(*)')
          .order('sort_order', { ascending: true });

        if (!newSchemaError && newSchemaData && newSchemaData.length > 0) {
          let list = (newSchemaData as ProjectRow[]).map((row: any) =>
            toProject(row, row.project_images || [], locale)
          );
          if (options.featuredOnly) list = list.filter((p) => p.isFeatured);
          if (options.limit) list = list.slice(0, options.limit);
          return list;
        }

        // 2. Legacy fallback to 'Project' table
        let query = (supabase as any)
          .from('Project')
          .select('*')
          .order('sortOrder', { ascending: true });
        if (options.featuredOnly) query = query.eq('isFeatured', true);
        if (options.limit) query = query.limit(options.limit);

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return (data as FeineProjectRow[]).map((row, idx) => mapFeineProject(row, locale, idx));
        }
      } catch (error) {
        warn('projects', error);
      }
    }
    return seedProjects(locale, options);
  }
);

export const getProjectBySlug = cache(
  async (slug: string, locale: Locale): Promise<Project | null> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await (supabase as any)
          .from('Project')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          return mapFeineProject(data as FeineProjectRow, locale);
        }
      } catch (error) {
        warn(`projects(${slug})`, error);
      }
    }
    return seedProjects(locale).find((p) => p.slug === slug) ?? null;
  }
);

// ----------------------------------------------------------------- products --

function seedProducts(locale: Locale, options: ListOptions = {}): Product[] {
  let rows = SEED_PRODUCTS.filter((p) => p.is_published);
  if (options.featuredOnly) rows = rows.filter((p) => p.is_featured);
  rows = rows.sort((a, b) => a.sort_order - b.sort_order);
  if (options.limit) rows = rows.slice(0, options.limit);
  return rows.map((row) => {
    const prod = toProduct(
      stamped(row),
      row.images.map((img) => stamped({ ...img, product_id: row.id })),
      locale
    );
    const allUrls = prod.images.length > 0 ? prod.images.map((img) => img.url) : [prod.coverUrl];
    const enriched = enrichProductData(
      row.slug,
      prod.name,
      prod.category,
      prod.summary,
      prod.description,
      prod.material,
      prod.dimensions,
      allUrls,
      locale
    );
    return {
      ...prod,
      name: enriched.name,
      category: enriched.category,
      summary: enriched.summary,
      description: enriched.description,
      material: enriched.material,
      dimensions: enriched.dimensions,
      specs: enriched.specs,
      images: enriched.images.map((detail, i) => ({
        id: prod.images[i]?.id || `${prod.id}-img-${i + 1}`,
        url: detail.url,
        alt: `${enriched.name} — ${detail.subtitle}`,
        title: detail.title,
        subtitle: detail.subtitle,
        description: detail.description,
      })),
    };
  });
}

export const getProducts = cache(
  async (locale: Locale, options: ListOptions = {}): Promise<Product[]> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        // 1. Check if user's new Supabase schema table 'products' exists
        const { data: newSchemaData, error: newSchemaError } = await (supabase as any)
          .from('products')
          .select('*, product_images(*)')
          .order('sort_order', { ascending: true });

        if (!newSchemaError && newSchemaData && newSchemaData.length > 0) {
          let list = (newSchemaData as ProductRow[]).map((row: any) => {
            const prod = toProduct(row, row.product_images || [], locale);
            const allUrls = prod.images.length > 0 ? prod.images.map((img) => img.url) : [prod.coverUrl];
            const enriched = enrichProductData(
              prod.slug,
              prod.name,
              prod.category,
              prod.summary,
              prod.description,
              prod.material,
              prod.dimensions,
              allUrls,
              locale
            );
            return {
              ...prod,
              name: enriched.name,
              category: enriched.category,
              summary: enriched.summary,
              description: enriched.description,
              material: enriched.material,
              dimensions: enriched.dimensions,
              specs: enriched.specs,
              images: enriched.images.map((detail, i) => ({
                id: prod.images[i]?.id || `${prod.id}-img-${i + 1}`,
                url: detail.url,
                alt: `${enriched.name} — ${detail.subtitle}`,
                title: detail.title,
                subtitle: detail.subtitle,
                description: detail.description,
              })),
            };
          });
          if (options.featuredOnly) list = list.filter((p) => p.isFeatured);
          if (options.limit) list = list.slice(0, options.limit);
          return list;
        }

        // 2. Legacy fallback to 'Product' table
        let query = (supabase as any)
          .from('Product')
          .select('*');
        if (options.limit) query = query.limit(options.limit);

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return (data as FeineProductRow[]).map((row) => mapFeineProduct(row, locale));
        }
      } catch (error) {
        warn('products', error);
      }
    }
    return seedProducts(locale, options);
  }
);

export const getProductBySlug = cache(
  async (slug: string, locale: Locale): Promise<Product | null> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        // 1. Check user's new Supabase table 'products'
        const { data: newRow, error: newError } = await (supabase as any)
          .from('products')
          .select('*, product_images(*)')
          .eq('slug', slug)
          .maybeSingle();

        if (!newError && newRow) {
          const prod = toProduct(newRow, newRow.product_images || [], locale);
          const allUrls = prod.images.length > 0 ? prod.images.map((img) => img.url) : [prod.coverUrl];
          const enriched = enrichProductData(
            prod.slug,
            prod.name,
            prod.category,
            prod.summary,
            prod.description,
            prod.material,
            prod.dimensions,
            allUrls,
            locale
          );
          return {
            ...prod,
            name: enriched.name,
            category: enriched.category,
            summary: enriched.summary,
            description: enriched.description,
            material: enriched.material,
            dimensions: enriched.dimensions,
            specs: enriched.specs,
            images: enriched.images.map((detail, i) => ({
              id: prod.images[i]?.id || `${prod.id}-img-${i + 1}`,
              url: detail.url,
              alt: `${enriched.name} — ${detail.subtitle}`,
              title: detail.title,
              subtitle: detail.subtitle,
              description: detail.description,
            })),
          };
        }

        // 2. Legacy fallback to 'Product'
        const { data, error } = await (supabase as any)
          .from('Product')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          return mapFeineProduct(data as FeineProductRow, locale);
        }
      } catch (error) {
        warn(`products(${slug})`, error);
      }
    }
    return seedProducts(locale).find((p) => p.slug === slug) ?? null;
  }
);

// --------------------------------------------------------------------- blog --

function seedPosts(locale: Locale, limit?: number): BlogPost[] {
  const rows = SEED_BLOG_POSTS.filter((p) => p.is_published).sort(
    (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)
  );
  return (limit ? rows.slice(0, limit) : rows).map((row) => toBlogPost(stamped(row), locale));
}

export const getBlogPosts = cache(
  async (locale: Locale, limit?: number): Promise<BlogPost[]> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        let query = supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        if (limit) query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return (data as BlogPostRow[]).map((row) => toBlogPost(row, locale));
        }
      } catch (error) {
        warn('blog_posts', error);
      }
    }
    return seedPosts(locale, limit);
  }
);

export const getBlogPostBySlug = cache(
  async (slug: string, locale: Locale): Promise<BlogPost | null> => {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();
        if (error) throw error;
        if (data) return toBlogPost(data as BlogPostRow, locale);
      } catch (error) {
        warn(`blog_posts(${slug})`, error);
      }
    }
    return seedPosts(locale).find((p) => p.slug === slug) ?? null;
  }
);

// ------------------------------------------------------------------ gallery --

export const getGalleryItems = cache(async (locale: Locale): Promise<GalleryItem[]> => {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as GalleryItemRow[]).map((row) => toGalleryItem(row, locale));
      }
    } catch (error) {
      warn('gallery_items', error);
    }
  }
  return SEED_GALLERY_ITEMS.filter((g) => g.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => toGalleryItem(stamped(row), locale));
});

// ------------------------------------------------------------ about extras --

export const getAwards = cache(async (locale: Locale): Promise<Award[]> => {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as AwardRow[]).map((row) => toAward(row, locale));
      }
    } catch (error) {
      warn('awards', error);
    }
  }
  return SEED_AWARDS.filter((a) => a.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => toAward(row, locale));
});

export const getTeamMembers = cache(async (locale: Locale): Promise<TeamMember[]> => {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as TeamMemberRow[]).map((row) => toTeamMember(row, locale));
      }
    } catch (error) {
      warn('team_members', error);
    }
  }
  return SEED_TEAM_MEMBERS.filter((m) => m.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => toTeamMember(stamped(row), locale));
});
