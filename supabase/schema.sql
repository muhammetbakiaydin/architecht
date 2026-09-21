-- =============================================================================
-- EMRE MERİÇ — Supabase schema
-- =============================================================================
-- Run this once against a fresh Supabase project:
--   1. Paste and run this schema.sql file in Supabase SQL editor
--   2. Optionally paste and run seed.sql to populate projects & products with
--      unique SEO-optimized architectural titles, per-photo descriptions, and specs.
--
-- Nothing in the app requires this to exist: with no Supabase env vars the site
-- falls back to the bundled seed content in `src/content/*`. Wire it up by
-- filling `.env.local` (see `.env.example`) and running these SQL files.
--
-- Conventions
--   *_tr / *_en  : the two locales the public site renders (next-intl).
--   is_published : public visibility. Anonymous readers only ever see `true`.
--   sort_order   : ascending; ties broken by created_at.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

-- True when the caller is a signed-in user carrying an admin/editor profile.
-- Every write policy funnels through this, so revoking a person is one row.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'editor')
  );
$fn$;

-- -----------------------------------------------------------------------------
-- profiles — who may use the admin panel
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now()
);

-- New auth users land here as `viewer`; promote to `editor`/`admin` by hand.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- site_settings — single row (id = 1) holding global studio details
-- -----------------------------------------------------------------------------

create table if not exists public.site_settings (
  id                    smallint primary key default 1 check (id = 1),
  brand                 text not null default 'EMRE MERİÇ',
  tagline_tr            text not null default 'MİMARLIK & MEKÂN TASARIMI',
  tagline_en            text not null default 'ARCHITECTURE & SPATIAL DESIGN',
  email                 text not null default 'studio@emremeric.com',
  phone                 text default '',
  address_tr            text default 'İSTANBUL, TÜRKİYE',
  address_en            text default 'ISTANBUL, TÜRKİYE',
  hours_tr              text default 'Pazartesi – Cuma, 09:00 – 18:00',
  hours_en              text default 'Monday – Friday, 09:00 – 18:00',
  map_url               text default '',
  founded_year          int  default 2017,
  socials               jsonb not null default '[]'::jsonb,
  seo_title_tr          text default '',
  seo_title_en          text default '',
  seo_description_tr    text default '',
  seo_description_en    text default '',
  updated_at            timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- content_blocks — editable copy for home / about / contact / list pages
-- -----------------------------------------------------------------------------
-- One row per named region of a page, so the admin panel can rewrite any
-- heading, paragraph, stat or CTA without a deploy. `data` carries the
-- shape-specific extras (stat lists, bullet arrays, ...).

create table if not exists public.content_blocks (
  id             uuid primary key default gen_random_uuid(),
  page           text not null check (page in ('home', 'about', 'contact', 'projects', 'products', 'gallery', 'blog')),
  block_key      text not null,
  sort_order     int  not null default 0,
  eyebrow_tr     text default '',
  eyebrow_en     text default '',
  title_tr       text default '',
  title_en       text default '',
  subtitle_tr    text default '',
  subtitle_en    text default '',
  body_tr        text default '',
  body_en        text default '',
  image_url      text default '',
  cta_label_tr   text default '',
  cta_label_en   text default '',
  cta_href       text default '',
  data           jsonb not null default '{}'::jsonb,
  is_visible     boolean not null default true,
  updated_at     timestamptz not null default now(),
  unique (page, block_key)
);

create index if not exists content_blocks_page_idx on public.content_blocks (page, sort_order);

-- -----------------------------------------------------------------------------
-- projects + project_images
-- -----------------------------------------------------------------------------

create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title_tr        text not null default '',
  title_en        text not null default '',
  caption_tr      text default '',
  caption_en      text default '',
  description_tr  text default '',
  description_en  text default '',
  cover_url       text not null default '',
  year            int,
  location_tr     text default '',
  location_en     text default '',
  category        text default '',
  client          text default '',
  area            text default '',
  -- Layout hints consumed by the infinite-scroll gallery (CSS custom props).
  stagger         text not null default '0vw',
  img_width       text not null default '20vw',
  sort_order      int  not null default 0,
  is_published    boolean not null default true,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (is_published, sort_order);

create table if not exists public.project_images (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects (id) on delete cascade,
  url             text not null,
  title_tr        text default '',
  title_en        text default '',
  subtitle_tr     text default '',
  subtitle_en     text default '',
  description_tr  text default '',
  description_en  text default '',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

-- -----------------------------------------------------------------------------
-- products + product_images
-- -----------------------------------------------------------------------------

create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name_tr         text not null default '',
  name_en         text not null default '',
  summary_tr      text default '',
  summary_en      text default '',
  description_tr  text default '',
  description_en  text default '',
  cover_url       text not null default '',
  category        text default '',
  material_tr     text default '',
  material_en     text default '',
  dimensions      text default '',
  -- Free-form rows rendered in the spec table:
  --   [{"label_tr": "...", "label_en": "...", "value_tr": "...", "value_en": "..."}]
  specs           jsonb not null default '[]'::jsonb,
  sort_order      int not null default 0,
  is_published    boolean not null default true,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_published_idx on public.products (is_published, sort_order);

create table if not exists public.product_images (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products (id) on delete cascade,
  url             text not null,
  alt_tr          text default '',
  alt_en          text default '',
  title_tr        text default '',
  title_en        text default '',
  subtitle_tr     text default '',
  subtitle_en     text default '',
  description_tr  text default '',
  description_en  text default '',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

-- -----------------------------------------------------------------------------
-- blog_posts
-- -----------------------------------------------------------------------------

create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title_tr      text not null default '',
  title_en      text not null default '',
  excerpt_tr    text default '',
  excerpt_en    text default '',
  -- Markdown. Rendered by a small in-repo renderer, no external deps.
  body_tr       text default '',
  body_en       text default '',
  cover_url     text default '',
  tags          text[] not null default '{}',
  author        text default 'EMRE MERİÇ',
  published_at  timestamptz not null default now(),
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);

-- -----------------------------------------------------------------------------
-- gallery_items — the infinite 3D canvas
-- -----------------------------------------------------------------------------

create table if not exists public.gallery_items (
  id            uuid primary key default gen_random_uuid(),
  url           text not null,
  title_tr      text default '',
  title_en      text default '',
  width         int not null default 1200,
  height        int not null default 1500,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists gallery_items_published_idx on public.gallery_items (is_published, sort_order);

-- -----------------------------------------------------------------------------
-- awards + team_members (about page)
-- -----------------------------------------------------------------------------

create table if not exists public.awards (
  id          uuid primary key default gen_random_uuid(),
  label_tr    text not null default '',
  label_en    text not null default '',
  year        int,
  sort_order  int not null default 0,
  is_visible  boolean not null default true
);

create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default '',
  role_tr     text default '',
  role_en     text default '',
  bio_tr      text default '',
  bio_en      text default '',
  photo_url   text default '',
  sort_order  int not null default 0,
  is_visible  boolean not null default true
);

-- -----------------------------------------------------------------------------
-- contact_messages — inbox for the contact form
-- -----------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text default '',
  message     text not null,
  locale      text default 'tr',
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

do $do$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'content_blocks', 'projects', 'products', 'blog_posts'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $do$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
-- Public (anon) may read published rows only. Staff may do everything.
-- contact_messages is the mirror image: anyone may insert, only staff may read.

do $do$
declare t text;
begin
  foreach t in array array[
    'profiles', 'site_settings', 'content_blocks', 'projects', 'project_images',
    'products', 'product_images', 'blog_posts', 'gallery_items', 'awards',
    'team_members', 'contact_messages'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $do$;

-- profiles: you can read your own row; staff read all.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_staff_write on public.profiles;
create policy profiles_staff_write on public.profiles
  for all using (public.is_staff()) with check (public.is_staff());

-- Always-public reference tables.
do $do$
declare t text;
begin
  foreach t in array array['site_settings', 'project_images', 'product_images'] loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format('create policy %I on public.%I for select using (true)', t || '_public_read', t);
  end loop;
end $do$;

-- Visibility-gated public reads.
drop policy if exists content_blocks_public_read on public.content_blocks;
create policy content_blocks_public_read on public.content_blocks
  for select using (is_visible or public.is_staff());

drop policy if exists awards_public_read on public.awards;
create policy awards_public_read on public.awards
  for select using (is_visible or public.is_staff());

drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read on public.team_members
  for select using (is_visible or public.is_staff());

do $do$
declare t text;
begin
  foreach t in array array['projects', 'products', 'blog_posts', 'gallery_items'] loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select using (is_published or public.is_staff())',
      t || '_public_read', t);
  end loop;
end $do$;

-- Staff write access across every content table.
do $do$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'content_blocks', 'projects', 'project_images',
    'products', 'product_images', 'blog_posts', 'gallery_items', 'awards',
    'team_members'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_staff_write', t);
    execute format(
      'create policy %I on public.%I for all using (public.is_staff()) with check (public.is_staff())',
      t || '_staff_write', t);
  end loop;
end $do$;

-- contact_messages: write-only for the public, read/update for staff.
drop policy if exists contact_messages_public_insert on public.contact_messages;
create policy contact_messages_public_insert on public.contact_messages
  for insert with check (true);

drop policy if exists contact_messages_staff_read on public.contact_messages;
create policy contact_messages_staff_read on public.contact_messages
  for select using (public.is_staff());

drop policy if exists contact_messages_staff_write on public.contact_messages;
create policy contact_messages_staff_write on public.contact_messages
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists contact_messages_staff_delete on public.contact_messages;
create policy contact_messages_staff_delete on public.contact_messages
  for delete using (public.is_staff());

-- -----------------------------------------------------------------------------
-- Storage — a single public bucket for every uploaded image
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_staff_write on storage.objects;
create policy media_staff_write on storage.objects
  for all using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());
