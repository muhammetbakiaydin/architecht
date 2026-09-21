import type {
  AwardRow,
  BlogPostRow,
  ContentBlockRow,
  GalleryItemRow,
  ProductImageRow,
  ProductRow,
  ProjectImageRow,
  ProjectRow,
  SiteSettingsRow,
  TeamMemberRow,
} from '@/lib/supabase/types';

/**
 * Seed rows are the database rows minus the columns Postgres fills in.
 * Keeping the seed in row shape means the locale-resolving mappers in
 * `src/lib/content/*` are identical whether a row came from Supabase or here.
 */
type Seeded<T> = Omit<T, 'created_at' | 'updated_at'>;

export type SeedSiteSettings = Seeded<SiteSettingsRow>;
export type SeedContentBlock = Seeded<ContentBlockRow>;
export type SeedProjectImage = Seeded<ProjectImageRow>;
export type SeedProductImage = Seeded<ProductImageRow>;
export type SeedBlogPost = Seeded<BlogPostRow>;
export type SeedGalleryItem = Seeded<GalleryItemRow>;
export type SeedAward = AwardRow;
export type SeedTeamMember = TeamMemberRow;

export type SeedProject = Seeded<ProjectRow> & {
  images: Omit<SeedProjectImage, 'project_id'>[];
};

export type SeedProduct = Seeded<ProductRow> & {
  images: Omit<SeedProductImage, 'product_id'>[];
};
