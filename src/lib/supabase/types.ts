/**
 * Hand-written mirror of `supabase/schema.sql`.
 *
 * Regenerating with the Supabase CLI (`supabase gen types typescript`) would
 * overwrite this file; until the project is actually provisioned this keeps the
 * whole app type-checked against the schema we intend to create.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * A declared foreign key. postgrest-js reads these to type embedded selects
 * such as `projects.select('*, project_images(*)')`; without them the embed
 * resolves to a SelectQueryError rather than a row array.
 */
type Relationship<Column extends string, Referenced extends string> = {
  foreignKeyName: string;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Referenced;
  referencedColumns: ['id'];
};

/** Build the Row/Insert/Update triple supabase-js expects from a single Row type. */
type Table<
  Row,
  RequiredOnInsert extends keyof Row = never,
  Relationships extends readonly unknown[] = [],
> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredOnInsert>;
  Update: Partial<Row>;
  Relationships: Relationships;
};

export type UserRole = 'admin' | 'editor' | 'viewer';

export type ContentPage =
  | 'home'
  | 'about'
  | 'contact'
  | 'projects'
  | 'products'
  | 'gallery'
  | 'blog';

export type SocialLink = {
  label: string;
  href: string;
};

export type SpecRow = {
  label_tr: string;
  label_en: string;
  value_tr: string;
  value_en: string;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type SiteSettingsRow = {
  id: number;
  brand: string;
  tagline_tr: string;
  tagline_en: string;
  email: string;
  phone: string | null;
  address_tr: string | null;
  address_en: string | null;
  hours_tr: string | null;
  hours_en: string | null;
  map_url: string | null;
  founded_year: number | null;
  socials: SocialLink[];
  seo_title_tr: string | null;
  seo_title_en: string | null;
  seo_description_tr: string | null;
  seo_description_en: string | null;
  updated_at: string;
};

export type ContentBlockRow = {
  id: string;
  page: ContentPage;
  block_key: string;
  sort_order: number;
  eyebrow_tr: string | null;
  eyebrow_en: string | null;
  title_tr: string | null;
  title_en: string | null;
  subtitle_tr: string | null;
  subtitle_en: string | null;
  body_tr: string | null;
  body_en: string | null;
  image_url: string | null;
  cta_label_tr: string | null;
  cta_label_en: string | null;
  cta_href: string | null;
  data: Json;
  is_visible: boolean;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string;
  caption_tr: string | null;
  caption_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  cover_url: string;
  year: number | null;
  location_tr: string | null;
  location_en: string | null;
  category: string | null;
  client: string | null;
  area: string | null;
  stagger: string;
  img_width: string;
  sort_order: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectImageRow = {
  id: string;
  project_id: string;
  url: string;
  title_tr: string | null;
  title_en: string | null;
  subtitle_tr: string | null;
  subtitle_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  sort_order: number;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  summary_tr: string | null;
  summary_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  cover_url: string;
  category: string | null;
  material_tr: string | null;
  material_en: string | null;
  dimensions: string | null;
  specs: SpecRow[];
  sort_order: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  alt_tr: string | null;
  alt_en: string | null;
  title_tr?: string | null;
  title_en?: string | null;
  subtitle_tr?: string | null;
  subtitle_en?: string | null;
  description_tr?: string | null;
  description_en?: string | null;
  sort_order: number;
  created_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  body_tr: string | null;
  body_en: string | null;
  cover_url: string | null;
  tags: string[];
  author: string | null;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItemRow = {
  id: string;
  url: string;
  title_tr: string | null;
  title_en: string | null;
  width: number;
  height: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type AwardRow = {
  id: string;
  label_tr: string;
  label_en: string;
  year: number | null;
  sort_order: number;
  is_visible: boolean;
};

export type TeamMemberRow = {
  id: string;
  name: string;
  role_tr: string | null;
  role_en: string | null;
  bio_tr: string | null;
  bio_en: string | null;
  photo_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  locale: string | null;
  is_read: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, 'id'>;
      site_settings: Table<SiteSettingsRow>;
      content_blocks: Table<ContentBlockRow, 'page' | 'block_key'>;
      projects: Table<ProjectRow, 'slug'>;
      project_images: Table<
        ProjectImageRow,
        'project_id' | 'url',
        [Relationship<'project_id', 'projects'>]
      >;
      products: Table<ProductRow, 'slug'>;
      product_images: Table<
        ProductImageRow,
        'product_id' | 'url',
        [Relationship<'product_id', 'products'>]
      >;
      blog_posts: Table<BlogPostRow, 'slug'>;
      gallery_items: Table<GalleryItemRow, 'url'>;
      awards: Table<AwardRow>;
      team_members: Table<TeamMemberRow>;
      contact_messages: Table<ContactMessageRow, 'name' | 'email' | 'message'>;
    };
    // `{ [_ in never]: never }` - NOT `Record<string, never>`. supabase-js
    // constrains Views to `Record<string, GenericView>`, and `never` does not
    // satisfy GenericView, which silently drops the whole schema back to
    // untyped queries. This is the shape `supabase gen types` emits.
    Views: { [_ in never]: never };
    Functions: {
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

/** Every table name the admin panel is allowed to address. */
export type TableName = keyof Database['public']['Tables'];
