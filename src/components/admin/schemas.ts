import type { AdminSchema } from './schema';

/**
 * One schema per editable table. These are the single source of truth for what
 * the admin panel writes - `RecordEditorScreen` builds its payload from
 * `schemaColumns(schema)`, so a column missing here is never touched.
 */

export const SITE_SETTINGS_SCHEMA: AdminSchema = [
  {
    title: 'KİMLİK',
    description: 'Başlık, slogan ve kuruluş bilgisi sitenin her sayfasında görünür.',
    fields: [
      { kind: 'text', name: 'brand', label: 'Marka adı' },
      { kind: 'number', name: 'founded_year', label: 'Kuruluş yılı' },
      { kind: 'text', name: 'tagline', label: 'Slogan', i18n: true },
    ],
  },
  {
    title: 'İLETİŞİM',
    fields: [
      { kind: 'text', name: 'email', label: 'E-posta' },
      { kind: 'text', name: 'phone', label: 'Telefon' },
      { kind: 'text', name: 'address', label: 'Adres', i18n: true },
      { kind: 'text', name: 'hours', label: 'Çalışma saatleri', i18n: true },
      { kind: 'text', name: 'map_url', label: 'Harita bağlantısı', full: true },
    ],
  },
  {
    title: 'SOSYAL',
    description:
      'JSON listesi. Her öğe bir etiket ve bir bağlantıdan oluşur: [{"label": "INSTAGRAM", "href": "https://…"}]',
    fields: [{ kind: 'json', name: 'socials', label: 'Sosyal bağlantılar', full: true, rows: 8 }],
  },
  {
    title: 'SEO',
    description: 'Boş bırakılırsa çeviri dosyalarındaki varsayılan başlık ve açıklama kullanılır.',
    fields: [
      { kind: 'text', name: 'seo_title', label: 'Site başlığı', i18n: true },
      { kind: 'textarea', name: 'seo_description', label: 'Site açıklaması', i18n: true, rows: 3 },
    ],
  },
];

export const CONTENT_BLOCK_SCHEMA: AdminSchema = [
  {
    title: 'METİNLER',
    description:
      'Anahtar, bu bloğun sayfadaki yerini belirler ve kodda buna göre çağrılır — mevcut blokların anahtarını değiştirmeyin.',
    fields: [
      {
        kind: 'text',
        name: 'block_key',
        label: 'Anahtar',
        full: true,
        placeholder: 'studio_intro',
      },
      { kind: 'text', name: 'eyebrow', label: 'Üst etiket', i18n: true },
      { kind: 'text', name: 'title', label: 'Başlık', i18n: true },
      { kind: 'text', name: 'subtitle', label: 'Alt başlık', i18n: true },
      {
        kind: 'textarea',
        name: 'body',
        label: 'Metin',
        i18n: true,
        rows: 6,
        hint: 'Boş satır bırakarak paragraf ayırın.',
      },
    ],
  },
  {
    title: 'GÖRSEL VE BAĞLANTI',
    fields: [
      { kind: 'image', name: 'image_url', label: 'Görsel', folder: 'blocks', full: true },
      { kind: 'text', name: 'cta_label', label: 'Buton yazısı', i18n: true },
      {
        kind: 'text',
        name: 'cta_href',
        label: 'Buton bağlantısı',
        hint: 'Dahili yol: /projects, /products, /blog …',
        full: true,
      },
    ],
  },
  {
    title: 'YAPILANDIRILMIŞ VERİ',
    description:
      'Bu bloğa özel listeler (sayılar, adımlar, ilkeler, kilometre taşları). Alan adları _tr / _en ile biter.',
    fields: [{ kind: 'json', name: 'data', label: 'Veri (JSON)', full: true, rows: 16 }],
  },
  {
    title: 'GÖRÜNÜRLÜK',
    fields: [
      { kind: 'boolean', name: 'is_visible', label: 'Sitede görünsün' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const PROJECT_SCHEMA: AdminSchema = [
  {
    title: 'TANIM',
    fields: [
      {
        kind: 'text',
        name: 'slug',
        label: 'Slug',
        hint: 'URL parçası — /projeler/<slug>',
        placeholder: 'kiyi-evi',
      },
      { kind: 'text', name: 'category', label: 'Tür', placeholder: 'Konut' },
      { kind: 'text', name: 'title', label: 'Proje adı', i18n: true },
      {
        kind: 'text',
        name: 'caption',
        label: 'Arşiv başlığı',
        i18n: true,
        hint: 'Sonsuz kaydırmalı arşivde görselin altında görünür. Boşsa proje adı kullanılır.',
      },
      { kind: 'textarea', name: 'description', label: 'Açıklama', i18n: true, rows: 5 },
    ],
  },
  {
    title: 'KÜNYE',
    fields: [
      { kind: 'number', name: 'year', label: 'Yıl' },
      { kind: 'text', name: 'client', label: 'İşveren' },
      { kind: 'text', name: 'area', label: 'Alan', placeholder: '210 m²' },
      { kind: 'text', name: 'location', label: 'Yer', i18n: true },
    ],
  },
  {
    title: 'GÖRSEL VE YERLEŞİM',
    description:
      'Sürüklenme ve genişlik, arşiv sayfasındaki dizilimi belirler: işaret yönü sağ/sol kaymayı, genişlik görselin boyutunu verir.',
    fields: [
      { kind: 'image', name: 'cover_url', label: 'Kapak görseli', folder: 'projects', full: true },
      { kind: 'text', name: 'stagger', label: 'Yatay kayma', placeholder: '-24vw' },
      { kind: 'text', name: 'img_width', label: 'Görsel genişliği', placeholder: '20vw' },
    ],
  },
  {
    title: 'YAYIN',
    fields: [
      { kind: 'boolean', name: 'is_published', label: 'Yayında' },
      { kind: 'boolean', name: 'is_featured', label: 'Ana sayfada öne çıkar' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const PROJECT_IMAGE_SCHEMA: AdminSchema = [
  {
    title: 'FOTOĞRAF',
    fields: [
      { kind: 'image', name: 'url', label: 'Görsel', folder: 'projects', full: true },
      { kind: 'text', name: 'title', label: 'Başlık', i18n: true },
      { kind: 'text', name: 'subtitle', label: 'Alt başlık', i18n: true },
      { kind: 'textarea', name: 'description', label: 'Açıklama', i18n: true, rows: 4 },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const PRODUCT_SCHEMA: AdminSchema = [
  {
    title: 'TANIM',
    fields: [
      {
        kind: 'text',
        name: 'slug',
        label: 'Slug',
        hint: 'URL parçası — /urunler/<slug>',
        placeholder: 'kavlak-sehpa',
      },
      { kind: 'text', name: 'category', label: 'Kategori', placeholder: 'Mobilya' },
      { kind: 'text', name: 'name', label: 'Ürün adı', i18n: true },
      { kind: 'text', name: 'summary', label: 'Kısa açıklama', i18n: true },
      { kind: 'textarea', name: 'description', label: 'Açıklama', i18n: true, rows: 6 },
    ],
  },
  {
    title: 'ÖZELLİKLER',
    fields: [
      { kind: 'text', name: 'material', label: 'Malzeme', i18n: true },
      { kind: 'text', name: 'dimensions', label: 'Ölçüler', placeholder: '42 × 42 × 45 cm' },
      {
        kind: 'json',
        name: 'specs',
        label: 'Teknik bilgi satırları (JSON)',
        full: true,
        rows: 12,
        hint: '[{"label_tr":"Malzeme","label_en":"Material","value_tr":"…","value_en":"…"}]',
      },
    ],
  },
  {
    title: 'GÖRSEL VE YAYIN',
    fields: [
      { kind: 'image', name: 'cover_url', label: 'Kapak görseli', folder: 'products', full: true },
      { kind: 'boolean', name: 'is_published', label: 'Yayında' },
      { kind: 'boolean', name: 'is_featured', label: 'Ana sayfada öne çıkar' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const PRODUCT_IMAGE_SCHEMA: AdminSchema = [
  {
    title: 'GÖRSEL',
    fields: [
      { kind: 'image', name: 'url', label: 'Görsel', folder: 'products', full: true },
      { kind: 'text', name: 'alt', label: 'Alternatif metin', i18n: true },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const BLOG_SCHEMA: AdminSchema = [
  {
    title: 'YAZI',
    fields: [
      {
        kind: 'text',
        name: 'slug',
        label: 'Slug',
        hint: 'URL parçası — /blog/<slug>',
        placeholder: 'derzin-anlami',
      },
      { kind: 'text', name: 'author', label: 'Yazar' },
      { kind: 'text', name: 'title', label: 'Başlık', i18n: true },
      { kind: 'textarea', name: 'excerpt', label: 'Özet', i18n: true, rows: 3 },
    ],
  },
  {
    title: 'İÇERİK',
    description:
      'Markdown desteklenir: ## başlık, - liste, 1. sıralı liste, > alıntı, **kalın**, *italik*, `kod`, [bağlantı](https://…), --- ayraç.',
    fields: [
      { kind: 'markdown', name: 'body_tr', label: 'Metin (TR)', full: true, rows: 20 },
      { kind: 'markdown', name: 'body_en', label: 'Metin (EN)', full: true, rows: 20 },
    ],
  },
  {
    title: 'YAYIN',
    fields: [
      { kind: 'image', name: 'cover_url', label: 'Kapak görseli', folder: 'blog', full: true },
      { kind: 'tags', name: 'tags', label: 'Etiketler', hint: 'Virgülle ayırın.' },
      { kind: 'date', name: 'published_at', label: 'Yayın tarihi' },
      { kind: 'boolean', name: 'is_published', label: 'Yayında' },
    ],
  },
];

export const GALLERY_SCHEMA: AdminSchema = [
  {
    title: 'GÖRSEL',
    description:
      'Genişlik ve yükseklik, sonsuz tuvalde görselin en-boy oranını belirler; gerçek piksel ölçülerini girin.',
    fields: [
      { kind: 'image', name: 'url', label: 'Görsel', folder: 'gallery', full: true },
      { kind: 'text', name: 'title', label: 'Başlık', i18n: true },
      { kind: 'number', name: 'width', label: 'Genişlik (px)' },
      { kind: 'number', name: 'height', label: 'Yükseklik (px)' },
      { kind: 'boolean', name: 'is_published', label: 'Yayında' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const TEAM_SCHEMA: AdminSchema = [
  {
    title: 'EKİP ÜYESİ',
    fields: [
      { kind: 'text', name: 'name', label: 'Ad soyad' },
      { kind: 'image', name: 'photo_url', label: 'Fotoğraf', folder: 'team' },
      { kind: 'text', name: 'role', label: 'Görev', i18n: true },
      { kind: 'textarea', name: 'bio', label: 'Kısa biyografi', i18n: true, rows: 3 },
      { kind: 'boolean', name: 'is_visible', label: 'Sitede görünsün' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];

export const AWARD_SCHEMA: AdminSchema = [
  {
    title: 'ÖDÜL',
    fields: [
      { kind: 'text', name: 'label', label: 'Ödül adı', i18n: true },
      { kind: 'number', name: 'year', label: 'Yıl' },
      { kind: 'boolean', name: 'is_visible', label: 'Sitede görünsün' },
      { kind: 'number', name: 'sort_order', label: 'Sıra' },
    ],
  },
];
