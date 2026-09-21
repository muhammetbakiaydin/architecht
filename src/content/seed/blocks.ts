import type { SeedContentBlock } from './types';

/**
 * ARCHITECTURAL COPYWRITING — Bireysel Mimar Portfolyosu (Emre Meriç)
 */
const block = (b: Partial<SeedContentBlock> & Pick<SeedContentBlock, 'id' | 'page' | 'block_key'>): SeedContentBlock => ({
  sort_order: 0,
  eyebrow_tr: '',
  eyebrow_en: '',
  title_tr: '',
  title_en: '',
  subtitle_tr: '',
  subtitle_en: '',
  body_tr: '',
  body_en: '',
  image_url: '',
  cta_label_tr: '',
  cta_label_en: '',
  cta_href: '',
  data: {},
  is_visible: true,
  ...b,
});

export const SEED_CONTENT_BLOCKS: SeedContentBlock[] = [
  // ---------------------------------------------------------------- home ----
  block({
    id: 'seed-block-home-intro',
    page: 'home',
    block_key: 'studio_intro',
    sort_order: 0,
    eyebrow_tr: 'YAKLAŞIM',
    eyebrow_en: 'PRACTICE',
    subtitle_tr: 'Bireysel Mimarlık ve Mekân Tasarımı',
    subtitle_en: 'Individual Architecture & Spatial Design',
    title_tr: 'Işıktan, malzemeden ve ölçülü davranmaktan kurulan mekân.',
    title_en: 'Space built from light, material and restraint.',
    body_tr:
      'Tasarım pratiğimde mimarlık ile iç mekânın birleştiği kesişimde üretiyorum — bir planın salt teknik çizim olmaktan çıkıp içinde yaşanılan dingin, zamansız ve dengeli bir hacme dönüştüğü yerde. Her projeye yerin kendi dinamikleriyle başlarım: arazinin yönü, coğrafi dokusu, sessizliği ve gün ışığının saatlere göre değişen gölgeleri.\n\nSürecim bilinçli bir sadelik taşır. Az sayıda ama dürüst malzeme, zamanla nasıl yaşlanacağına bakılarak seçilir. Detaylar gösterişten uzak tutulur; böylece mekânın kendisi, ferahlığı ve zanaatın dürüstlüğü ön plana çıkar.',
    body_en:
      'In my architectural practice, I create at the seam between structure and interior — where a blueprint stops being a technical drawing and becomes a serene, timeless, and balanced living volume. Every project begins with the specific dynamics of the site: its orientation, topography, stillness, and the shifting shadows of natural daylight.\n\nMy process is deliberately restrained. A few honest materials are selected for how gracefully they age. Detailing remains quiet and unpretentious; allowing the purity of space, generous light, and craft to speak for themselves.',
    data: {
      stats: [
        { value: '47', label_tr: 'TAMAMLANAN PROJE', label_en: 'COMPLETED WORKS' },
        { value: '09', label_tr: 'ÖZEL MOBİLYA & NESNE', label_en: 'BESPOKE OBJECTS' },
        { value: '10+', label_tr: 'YIL DENEYİM', label_en: 'YEARS EXPERIENCE' },
        { value: 'İST', label_tr: 'MERKEZ', label_en: 'BASED IN' },
      ],
    },
  }),
  block({
    id: 'seed-block-home-approach',
    page: 'home',
    block_key: 'approach',
    sort_order: 1,
    eyebrow_tr: 'METODOLOJİ',
    eyebrow_en: 'METHODOLOGY',
    title_tr: 'Tasarım Felsefem',
    title_en: 'Design Philosophy',
    data: {
      steps: [
        {
          index: '01',
          title_tr: 'Yeri ve Bağlamı Dinlemek',
          title_en: 'Listening to the Site',
          body_tr:
            'Topografya, yöneliş, ışığın hareketi ve kullanıcının yaşam alışkanlıkları. Mekânın kısıtları ve potansiyeli derinlemesine anlaşılmadan hiçbir çizgi çizilmez.',
          body_en:
            'Topography, orientation, natural sunpaths, and the daily rituals of the client. Not a single line is drawn until the site constraints and latent potential are thoroughly grasped.',
        },
        {
          index: '02',
          title_tr: 'Malzemeyle Kurulan Diyalog',
          title_en: 'Dialogue with Material',
          body_tr:
            'Doğal taş, ham ahşap, masif dokular ve ışık. Bir yüzeyi teslim anında nasıl parladığına göre değil, yıllar geçtikçe nasıl asilleştiğine göre seçerim.',
          body_en:
            'Natural stone, raw timber, tactile textures, and daylight. Materials are curated not for temporary novelty, but for how noble they will become over decades of use.',
        },
        {
          index: '03',
          title_tr: 'Ölçülü Detay ve Şantiye Disiplini',
          title_en: 'Precise Detailing & Site Presence',
          body_tr:
            'Şantiyede soru işareti bırakmayacak uygulama hassasiyeti ve bizzat sahada bulunma disiplini; çizimdeki yalın hissin yapının bütününe kusursuz yansıması.',
          body_en:
            'Rigorous execution documentation and hands-on site supervision; ensuring that the purity envisioned on paper is faithfully reflected in the completed structure.',
        },
      ],
    },
  }),
  block({
    id: 'seed-block-home-works-grid',
    page: 'home',
    block_key: 'works_grid',
    sort_order: 2,
    eyebrow_tr: 'MİMARİ ARŞİV',
    eyebrow_en: 'ARCHITECTURAL ARCHIVE',
    title_tr: 'SEÇİLMİŞ İŞLER',
    title_en: 'SELECTED WORKS',
    body_tr:
      'Konut, villa, ticari ve kültürel ölçekte tamamladığım projelerden seçkiler. Kaydırma ile açılan interaktif ızgara.',
    body_en:
      'Selected residential, villa, commercial, and cultural projects. An interactive scroll-driven archive.',
    cta_label_tr: 'ARŞİVE GİR →',
    cta_label_en: 'EXPLORE ARCHIVE →',
    cta_href: '/projects',
  }),
  block({
    id: 'seed-block-home-featured-projects',
    page: 'home',
    block_key: 'featured_projects',
    sort_order: 3,
    eyebrow_tr: 'PROJE SEÇKİSİ',
    eyebrow_en: 'PROJECT SELECTION',
    title_tr: 'Seçilmiş Mimari Projeler',
    title_en: 'Selected Architectural Works',
    body_tr: 'Konut, villa, restoran, mağaza ve çalışma alanları ölçeğinde hayata geçirilmiş yapılar.',
    body_en: 'Completed projects across residential, villa, hospitality, and workspace scales.',
    cta_label_tr: 'TÜM PROJELER (47)',
    cta_label_en: 'ALL PROJECTS (47)',
    cta_href: '/projects',
  }),
  block({
    id: 'seed-block-home-featured-products',
    page: 'home',
    block_key: 'featured_products',
    sort_order: 4,
    eyebrow_tr: 'ÖZEL KOLEKSİYON',
    eyebrow_en: 'BESPOKE COLLECTION',
    title_tr: 'Mekâna Özel Nesneler & Mobilyalar',
    title_en: 'Objects & Furniture for Space',
    body_tr: 'Mimari projelerimin malzeme dilini ve dengesini tamamlamak üzere sınırlı sayıda tasarladığım mobilya ve aydınlatma tasarımları.',
    body_en: 'Furniture and lighting pieces designed in limited editions to complete the architectural spirit and tactile language of spaces.',
    cta_label_tr: 'TÜM KOLEKSİYON',
    cta_label_en: 'ALL OBJECTS',
    cta_href: '/products',
  }),
  block({
    id: 'seed-block-home-latest-posts',
    page: 'home',
    block_key: 'latest_posts',
    sort_order: 5,
    eyebrow_tr: 'YAZILAR & NOTLAR',
    eyebrow_en: 'WRITING & NOTES',
    title_tr: 'Mimari Günlük',
    title_en: 'Architectural Journal',
    body_tr: 'Mimarlık, malzeme arayışları, mekân algısı ve tasarım süreçleri üzerine kişisel notlar.',
    body_en: 'Reflections on architecture, materials, spatial perception, and design processes.',
    cta_label_tr: 'TÜM YAZILAR',
    cta_label_en: 'ALL POSTS',
    cta_href: '/blog',
  }),
  block({
    id: 'seed-block-home-gallery-cta',
    page: 'home',
    block_key: 'gallery_cta',
    sort_order: 6,
    eyebrow_tr: 'GÖRSEL ARŞİV',
    eyebrow_en: 'VISUAL ARCHIVE',
    title_tr: 'Üç Boyutlu Sonsuz Galeri',
    title_en: 'The Infinite 3D Canvas',
    body_tr:
      'Tamamlanan projelerin detayları, malzeme denemeleri ve atmosfer fotoğraflarının sonsuz üç boyutlu bir tuval üzerindeki etkileşimli sergisi.',
    body_en:
      'An interactive exhibition of architectural details, material studies, and atmospheres across an infinite three-dimensional canvas.',
    cta_label_tr: 'GALERİYİ KEŞFET',
    cta_label_en: 'EXPLORE CANVAS',
    cta_href: '/gallery',
    image_url: '/storage/projects/696105ddab633_1767966173.jpg',
  }),

  // --------------------------------------------------------------- about ----
  block({
    id: 'seed-block-about-hero',
    page: 'about',
    block_key: 'hero',
    sort_order: 0,
    eyebrow_tr: 'HAKKIMDA',
    eyebrow_en: 'ABOUT',
    title_tr: 'Mimar Emre Meriç',
    title_en: 'Architect Emre Meriç',
    body_tr:
      'İstanbul merkezli mimarlık ve mekân tasarımı pratiğimde; konut, villa, ticari mekânlar ve bunlara eşlik eden özel mobilya tasarımları üretiyorum. Her çalışmamda yerin ruhuna ve malzemenin dürüstlüğüne sadık kalmayı hedefliyorum.',
    body_en:
      'Based in Istanbul, my architectural practice focuses on residential villas, bespoke interiors, and accompanying furniture pieces. Every design aims to honor the spirit of place and the inherent honesty of materials.',
    image_url: '/storage/projects/696105ddab633_1767966173.jpg',
  }),
  block({
    id: 'seed-block-about-story',
    page: 'about',
    block_key: 'story',
    sort_order: 1,
    eyebrow_tr: 'YOLCULUK',
    eyebrow_en: 'JOURNEY',
    title_tr: 'Mekân, ışık ve zamansız detaylar.',
    title_en: 'Space, light, and timeless detail.',
    body_tr:
      'Mimarlık yolculuğum, bir mekânın insan ruhunda bıraktığı dinginliği anlama arzusuyla başladı. Yıllar içerisinde konuttan çalışma alanlarına, butik otellerden özel restoranlara kadar 45’in üzerinde projeyi tasarım aşamasından şantiye teslimine kadar bizzat yürüttüm.\n\nBireysel bir mimar olarak çalışmanın en büyük gücü; işverenin hayaliyle doğrudan ve samimi bir bağ kurabilmek, her detayı yerinde bizzat denetleyebilmektir. Tasarladığım binalar geçici eğilimlere değil, yıllar geçtikçe değer kazanan zamansız bir dinginliğe yaslanır.',
    body_en:
      'My architectural journey began with a desire to understand the quiet emotion a space can evoke. Over the years, I have personally led over 45 projects — from private villas to workspaces and boutique venues — guiding each from concept to on-site delivery.\n\nThe strength of an individual practice lies in direct, honest communication with the client and uncompromising attention to detail on the construction site. The spaces I shape do not chase fleeting trends; they rest on a quiet, timeless elegance that only deepens with age.',
    image_url: '/storage/projects/gallery/gallery_69610570432378.02262174_1767966064.275.jpg',
  }),
  block({
    id: 'seed-block-about-values',
    page: 'about',
    block_key: 'values',
    sort_order: 2,
    eyebrow_tr: 'İLKELER',
    eyebrow_en: 'PRINCIPLES',
    title_tr: 'Tasarımımda Ödün Vermediğim İlkeler',
    title_en: 'Uncompromising Principles',
    data: {
      items: [
        {
          title_tr: 'Yere Saygı & Doğal Işık',
          title_en: 'Respect for Site & Light',
          body_tr: 'Arazinin yönü, rüzgarı ve ışığı yapının ana omurgasını belirler. Doğayla yarışmak yerine onunla bütünleşen mekânlar kurarım.',
          body_en: 'The site’s orientation, wind, and daylight form the architectural spine. Buildings harmonize with nature rather than competing with it.',
        },
        {
          title_tr: 'Dürüst ve Az Malzeme',
          title_en: 'Honest & Restrained Materials',
          body_tr: 'Bir yapıda gereksiz katmanlar ve yapay kaplamalar yerine, dokusu ve ağırlığı olan doğal taş, ahşap ve metalin dürüstlüğünü tercih ederim.',
          body_en: 'Rather than superficial finishes, I favor authentic materials — natural stone, raw timber, tactile metals — that carry tactile weight and honesty.',
        },
        {
          title_tr: 'Zanaat ve Detay Tutkusu',
          title_en: 'Passion for Craft & Detailing',
          body_tr: 'Birleşme noktaları, gölge derzleri ve malzeme geçişleri gizlenmez. Yapının nasıl inşa edildiği, onun en güçlü kimliğidir.',
          body_en: 'Junctions, shadow gaps, and material transitions are never concealed. How a structure is assembled forms its most authentic identity.',
        },
        {
          title_tr: 'Birebir Şantiye Sorumluluğu',
          title_en: 'Hands-on Site Supervision',
          body_tr: 'Çizen mimar şantiyede bulunmalıdır. Çizgideki zarafetin yapıya birebir taşınması sahadaki titizlikle mümkündür.',
          body_en: 'The architect who drafts the project must be on the scaffold. Translating design elegance into physical reality demands direct presence.',
        },
      ],
    },
  }),
  block({
    id: 'seed-block-about-timeline',
    page: 'about',
    block_key: 'timeline',
    sort_order: 3,
    eyebrow_tr: 'KİLOMETRE TAŞLARI',
    eyebrow_en: 'MILESTONES',
    title_tr: 'Mesleki Yolculuk',
    title_en: 'Professional Journey',
    data: {
      items: [
        {
          year: '2015',
          title_tr: 'Mimarlık Eğitimi & Araştırmalar',
          title_en: 'Architecture Studies & Research',
          body_tr: 'Mekân ve malzeme ölçeğinde akademik araştırmalar ve ilk restorasyon çalışmaları.',
          body_en: 'Academic research on spatial materiality and initial restoration experiences.',
        },
        {
          year: '2017',
          title_tr: 'Bireysel Pratiğin Kuruluşu',
          title_en: 'Practice Established',
          body_tr: 'Kendi mimarlık atölyemi kurarak konut ve iç mekân projeleri üretmeye başladım.',
          body_en: 'Founded my personal architecture practice, focusing on bespoke residential works.',
        },
        {
          year: '2020',
          title_tr: 'Villa & Özel Yaşam Alanları',
          title_en: 'Villas & Private Residences',
          body_tr: 'Müstakil konut ve villa ölçeğinde kapsamlı mimari ve peyzaj projelerinin tamamlanması.',
          body_en: 'Completion of extensive private villa and landscape architecture commissions.',
        },
        {
          year: '2023',
          title_tr: 'Mekâna Özel Nesne Tasarımı',
          title_en: 'Bespoke Furniture & Objects',
          body_tr: 'Mimari projelerin diliyle uyumlu sınırlı üretim mobilya ve aydınlatma koleksiyonunun doğuşu.',
          body_en: 'Launch of bespoke limited-edition furniture and lighting designed for specific projects.',
        },
        {
          year: '2025',
          title_tr: 'Zengin Portfolyo & Süreklilik',
          title_en: 'Extensive Archive & Evolution',
          body_tr: 'Konuttan ticari alanlara 45’i aşkın tamamlanmış proje ve devam eden yeni mimari işler.',
          body_en: 'Over 45 completed works across residential and commercial scales, continuing to evolve.',
        },
      ],
    },
  }),
  block({
    id: 'seed-block-about-team',
    page: 'about',
    block_key: 'team',
    sort_order: 4,
    eyebrow_tr: 'PRATİK',
    eyebrow_en: 'PRACTICE',
    title_tr: 'Bireysel Vizyon, Nitelikli Zanaat',
    title_en: 'Individual Vision, Refined Craft',
    body_tr: 'Tasarımın tüm aşamalarını bizzat yönetirken; alanında uzman mühendisler, peyzaj mimarları ve usta zanaatkarlarla koordineli şekilde çalışırım.',
    body_en: 'While I personally direct every phase of design, I collaborate closely with specialized engineers, landscape architects, and master craftspeople.',
  }),

  // ------------------------------------------------------------- contact ----
  block({
    id: 'seed-block-contact-hero',
    page: 'contact',
    block_key: 'hero',
    sort_order: 0,
    eyebrow_tr: 'İLETİŞİM',
    eyebrow_en: 'CONTACT',
    title_tr: 'Yeni Bir Proje, Brif ya da Bir Soru',
    title_en: 'A New Project, Brief or Inquiry',
    body_tr:
      'Yeni mimari projeler, iç mekân tasarımı ve mekâna özel ürün iş birlikleri için iletişime geçebilirsiniz. Bir arsa, mevcut bir yapı ya da yeni bir fikir üzerine konuşmaktan mutluluk duyarım.',
    body_en:
      'Reach out for new architectural commissions, interior design, and bespoke furniture collaborations. I am glad to discuss a site, an existing building, or a new vision.',
  }),

  // -------------------------------------------------- list page headers -----
  block({
    id: 'seed-block-projects-hero',
    page: 'projects',
    block_key: 'hero',
    eyebrow_tr: 'ARŞİV',
    eyebrow_en: 'ARCHIVE',
    title_tr: 'EMRE MERİÇ — MİMARİ PROJELER',
    title_en: 'EMRE MERİÇ — ARCHITECTURAL WORKS',
    body_tr: 'Tamamlanan 47 mimari ve iç mekân projesi. Kaydırarak detayları inceleyebilirsiniz.',
    body_en: '47 completed architectural and interior works. Scroll to explore details.',
  }),
  block({
    id: 'seed-block-products-hero',
    page: 'products',
    block_key: 'hero',
    eyebrow_tr: 'KOLEKSİYON',
    eyebrow_en: 'COLLECTION',
    title_tr: 'Mekâna Özel Ürünler',
    title_en: 'Bespoke Objects',
    body_tr:
      'Mimari projelerimin ruhunu tamamlamak için sınırlı sayıda üretilmiş mobilya ve mekân objeleri.',
    body_en:
      'Furniture and spatial objects created in limited editions to complete architectural environments.',
  }),
  block({
    id: 'seed-block-blog-hero',
    page: 'blog',
    block_key: 'hero',
    eyebrow_tr: 'GÜNLÜK',
    eyebrow_en: 'JOURNAL',
    title_tr: 'Mimarlık & Notlar',
    title_en: 'Architecture & Notes',
    body_tr: 'Mimarlık, mekân deneyimi, malzeme ve zanaat üzerine yazılar ve şantiye notları.',
    body_en: 'Notes on architecture, spatial experience, materiality, and site observations.',
  }),
  block({
    id: 'seed-block-gallery-hero',
    page: 'gallery',
    block_key: 'hero',
    eyebrow_tr: '3D GALERİ',
    eyebrow_en: '3D GALLERY',
    title_tr: 'Sonsuz Tuval',
    title_en: 'Infinite Canvas',
    body_tr: 'Sürükleyin, yakınlaşın, mekân detayları arasında keşfe çıkın.',
    body_en: 'Drag, zoom, and explore the tactile details of the architecture.',
  }),
];
