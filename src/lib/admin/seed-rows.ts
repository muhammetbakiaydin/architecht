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
import type { TableName } from '@/lib/supabase/types';

/**
 * The seed content, flattened to one array per table.
 *
 * The admin panel reads this whenever Supabase is not connected, so an editor
 * can see the exact rows the public site is rendering (read-only) instead of
 * an empty screen. Once credentials exist, nothing here is used.
 */

const STAMP = '1970-01-01T00:00:00.000Z';

const stamp = <T extends object>(row: T) => ({
  created_at: STAMP,
  updated_at: STAMP,
  ...row,
});

const SEED_ROWS: Partial<Record<TableName, unknown[]>> = {
  site_settings: [stamp(SEED_SITE_SETTINGS)],
  content_blocks: SEED_CONTENT_BLOCKS.map(stamp),
  projects: SEED_PROJECTS.map(({ images, ...row }) => stamp(row)),
  project_images: SEED_PROJECTS.flatMap((project) =>
    project.images.map((image) => stamp({ ...image, project_id: project.id }))
  ),
  products: SEED_PRODUCTS.map(({ images, ...row }) => stamp(row)),
  product_images: SEED_PRODUCTS.flatMap((product) =>
    product.images.map((image) => stamp({ ...image, product_id: product.id }))
  ),
  blog_posts: SEED_BLOG_POSTS.map(stamp),
  gallery_items: SEED_GALLERY_ITEMS.map(stamp),
  awards: SEED_AWARDS.map(stamp),
  team_members: SEED_TEAM_MEMBERS.map(stamp),
  contact_messages: [],
  profiles: [],
};

export function seedRowsFor<T>(table: TableName): T[] {
  return (SEED_ROWS[table] ?? []) as T[];
}
