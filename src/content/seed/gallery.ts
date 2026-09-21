import type { SeedGalleryItem } from './types';
import { SEED_PROJECTS } from './projects';
import { SEED_PRODUCTS } from './products';

// Extract real project and product images for the infinite 3D gallery
const projectImages = SEED_PROJECTS.flatMap((p) => [
  { url: p.cover_url, title_tr: p.title_tr, title_en: p.title_en },
  ...p.images.map((img) => ({
    url: img.url,
    title_tr: img.title_tr || p.title_tr,
    title_en: img.title_en || p.title_en,
  })),
]).filter((item) => item.url && !item.url.includes('infinite-scroll'));

const productImages = SEED_PRODUCTS.flatMap((p) => [
  { url: p.cover_url, title_tr: p.name_tr, title_en: p.name_en },
  ...p.images.map((img) => ({
    url: img.url,
    title_tr: p.name_tr,
    title_en: p.name_en,
  })),
]).filter((item) => item.url);

const combined = [...projectImages, ...productImages];

export const SEED_GALLERY_ITEMS: SeedGalleryItem[] = combined.map((item, i) => ({
  id: `gallery-item-${i + 1}`,
  url: item.url,
  title_tr: item.title_tr || `Seçki ${i + 1}`,
  title_en: item.title_en || `Selection ${i + 1}`,
  width: 1200,
  height: 1500,
  sort_order: i,
  is_published: true,
}));
