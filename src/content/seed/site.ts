import type { SeedAward, SeedSiteSettings, SeedTeamMember } from './types';

export const SEED_SITE_SETTINGS: SeedSiteSettings = {
  id: 1,
  brand: 'EMRE MERİÇ',
  tagline_tr: 'MİMARLIK & MEKÂN TASARIMI',
  tagline_en: 'ARCHITECTURE & SPATIAL DESIGN',
  email: 'studio@emremeric.com',
  phone: '+90 (212) 287 40 00',
  address_tr: 'İstanbul, Türkiye',
  address_en: 'Istanbul, Türkiye',
  hours_tr: 'Pazartesi – Cuma, 09:00 – 18:00',
  hours_en: 'Monday – Friday, 09:00 – 18:00',
  map_url: 'https://maps.google.com/?q=Istanbul',
  founded_year: 2017,
  socials: [
    { label: 'INSTAGRAM', href: 'https://instagram.com/' },
    { label: 'LINKEDIN', href: 'https://linkedin.com/' },
  ],
  seo_title_tr: 'EMRE MERİÇ — Mimarlık & Mekân Tasarımı',
  seo_title_en: 'EMRE MERİÇ — Architecture & Spatial Design',
  seo_description_tr:
    'Mimar Emre Meriç bireysel mimarlık ve mekân tasarımı portfolyosu. Konut, villa ve ticari mimarlık projeleri ile mekâna özel ürün koleksiyonu.',
  seo_description_en:
    'Architect Emre Meriç personal portfolio. Residential, villa and commercial architectural works alongside bespoke furniture designs.',
};

export const SEED_AWARDS: SeedAward[] = [
  { id: 'seed-award-01', label_tr: 'OAİB TASARIM ÖDÜLÜ — BİRİNCİLİK', label_en: 'OAIB DESIGN AWARD — WINNER', year: 2025, sort_order: 0, is_visible: true },
  { id: 'seed-award-02', label_tr: 'iF DESIGN AWARD', label_en: 'iF DESIGN AWARD', year: 2026, sort_order: 1, is_visible: true },
  { id: 'seed-award-03', label_tr: 'MSGSÜ MİMARLIK ÖDÜLÜ', label_en: 'MSGSÜ ARCHITECTURE AWARD', year: 2022, sort_order: 2, is_visible: true },
  { id: 'seed-award-04', label_tr: 'İÇ MİMARLIK HAFTASI SEÇKİSİ', label_en: 'INTERIOR DESIGN WEEK SELECTION', year: 2020, sort_order: 3, is_visible: true },
];

export const SEED_TEAM_MEMBERS: SeedTeamMember[] = [
  {
    id: 'seed-team-01',
    name: 'Emre Meriç',
    role_tr: 'Mimar & Kurucu',
    role_en: 'Architect & Founder',
    bio_tr: 'Mimarlık ve iç mekân tasarımı alanında 10 yılı aşkın süredir konut, villa ve ticari projeler tasarlayıp uygulamaktadır. Malzemenin dürüstlüğü ve dingin mekân kurgusu üzerine odaklanır.',
    bio_en: 'Practicing architecture and interior design for over a decade, focusing on private residential villas, commercial spaces, and bespoke spatial objects with authentic materiality.',
    photo_url: '/storage/blogs/6980833e184d5_1770029886.jpg',
    sort_order: 0,
    is_visible: true,
  },
];
