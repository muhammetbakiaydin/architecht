-- =============================================================================
-- EMRE MERİÇ ATELIER — Seed Data (Anti-Duplicate & SEO Optimized)
-- =============================================================================
-- Run this in the Supabase SQL Editor after running schema.sql.
-- All titles, descriptions, and metadata are rewritten to prevent duplicate content
-- penalties and align with Emre Meriç's bespoke architectural studio identity.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Site Settings
-- -----------------------------------------------------------------------------
insert into public.site_settings (
  id, brand, tagline_tr, tagline_en, email, phone, address_tr, address_en,
  hours_tr, hours_en, founded_year, seo_title_tr, seo_title_en,
  seo_description_tr, seo_description_en
) values (
  1,
  'EMRE MERİÇ',
  'MİMARLIK & MEKÂN TASARIMI',
  'ARCHITECTURE & SPATIAL DESIGN',
  'studio@emremeric.com',
  '+90 (212) 287 40 00',
  'Bebek Mah. Cevdetpaşa Cad. No: 42, Beşiktaş, İstanbul',
  'Bebek Mah. Cevdetpasa Ave. No: 42, Besiktas, Istanbul',
  'Pazartesi – Cuma, 09:00 – 18:30',
  'Monday – Friday, 09:00 – 18:30',
  2017,
  'Emre Meriç | Mimarlık, İç Mimarlık ve Çağdaş Mekân Tasarımı',
  'Emre Meriç | Architecture, Interior Design & Spatial Articulation',
  'Emre Meriç Mimarlık; çağdaş konutlar, kurumsal yönetim merkezleri ve zanaat odaklı mekânlar tasarlayan İstanbul merkezli bir mimarlık ve tasarım atölyesidir.',
  'Emre Meriç Architecture is an Istanbul-based atelier dedicated to contemporary residential architecture, cultural spaces, and bespoke spatial curation.'
)
on conflict (id) do update set
  brand = excluded.brand,
  tagline_tr = excluded.tagline_tr,
  tagline_en = excluded.tagline_en,
  email = excluded.email,
  phone = excluded.phone,
  address_tr = excluded.address_tr,
  address_en = excluded.address_en,
  seo_title_tr = excluded.seo_title_tr,
  seo_title_en = excluded.seo_title_en,
  seo_description_tr = excluded.seo_description_tr,
  seo_description_en = excluded.seo_description_en;

-- -----------------------------------------------------------------------------
-- 2. Curated Architectural Projects
-- -----------------------------------------------------------------------------

-- Project 1: Villa Y
insert into public.projects (
  id, slug, title_tr, title_en, caption_tr, caption_en,
  description_tr, description_en,
  cover_url, year, location_tr, location_en, category, client, area,
  stagger, img_width, sort_order, is_published, is_featured
) values (
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  'y-evi',
  'Villa Y: Çiftlikköy Rezidansı',
  'Villa Y: Ciftlikkoy Residence',
  'Villa Y: Çiftlikköy Rezidansı',
  'Villa Y: Ciftlikkoy Residence',
  'Bahçeşehir Çiftlikköy’ün dingin topoğrafyasında kurgulanan Villa Y, çift kat yüksekliğindeki galeri boşluğu, monolitik taş hacimleri ve heykelsi ahşap panelleriyle doğal ışığı gün boyu yaşam alanının merkezine taşır.',
  'Situated along the serene contours of Bahçeşehir, Villa Y celebrates spatial clarity through double-height volumes, monolithic stonework, and sculptural timber screens that channel natural daylight throughout the day.',
  '/storage/projects/696105ddab633_1767966173.jpg',
  2025,
  'Bahçeşehir, İstanbul',
  'Istanbul, Turkey',
  'Müstakil Konut / İç Mimari',
  'Özel Müşteri',
  '350 m²',
  '-22vw',
  '20vw',
  0,
  true,
  true
) on conflict (slug) do update set
  title_tr = excluded.title_tr,
  title_en = excluded.title_en,
  description_tr = excluded.description_tr,
  description_en = excluded.description_en,
  category = excluded.category;

-- Project 1 Images with distinct per-photo descriptions
insert into public.project_images (
  id, project_id, url, title_tr, title_en, subtitle_tr, subtitle_en, description_tr, description_en, sort_order
) values
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-1',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_69610570432378.02262174_1767966064.275.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '01 / Mimari Giriş & Galeri Boşluğu', '01 / Entrance & Gallery Void',
  'Çift kat tavan yüksekliğine sahip ana karşılama aksı, geniş cam cephelerle doğal ışığı içeri alarak iç ve dış mekân arasındaki sınırları akışkan hale getirir.',
  'A grand double-height entrance volume invites abundant daylight through full-height glazing, dissolving the boundaries between indoors and nature.',
  0
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-2',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_69610570ea65e4.63238249_1767966064.9601.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '02 / Açık Plan Yaşam & Yemek Salonu', '02 / Open Living & Dining Saloon',
  'Masif ceviz yemek masası ve tavan boyunca uzanan özel üretim heykelsi sarkıt aydınlatma, salonda sıcak ve rafine bir toplanma odağı kurgular.',
  'A solid walnut dining setting coupled with bespoke pendant illumination anchors the primary living quarter with tactile warmth.',
  1
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-3',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_696105735c16f2.38505966_1767966067.3772.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '03 / Ada Mutfak & Zanaat Detayı', '03 / Island Kitchen & Millwork Craft',
  'Füme meşe ve antrasit lake marangozlukla birleşen monolitik kuvars ada tezgâh, mutfak işlevini heykelsi bir mimari kütleye dönüştürür.',
  'Smoked oak cabinetry and monolithic quartz surfaces elevate functional culinary preparation into a bold architectural statement.',
  2
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-4',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_69610574715b19.44715322_1767966068.4643.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '04 / Dinlenme Odası & Akustik Ahşap', '04 / Lounge & Acoustic Slats',
  'Dikey ahşap çıtalar ve gizli aydınlatma detaylarıyla zenginleştirilen oturma bölümü, samimi ve dingin bir akşam dinlenme atmosferi sunar.',
  'Vertical acoustic timber baffles paired with discreet ambient coves offer an intimate, tranquil retreat for evening repose.',
  3
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-5',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_6961057754df33.69113505_1767966071.3476.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '05 / Işık Koridoru & Dikey Sirkülasyon', '05 / Staircase & Vertical Circulation',
  'Basamak altı gizli LED hatlarıyla hafifletilen monolitik merdiven gövdesi, katlar arasındaki düşey geçişi heykelsi bir yürüyüş deneyimine çevirir.',
  'Under-tread illumination renders the sculptural staircase lightweight, creating a kinetic experience across levels.',
  4
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-6',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_696105783f60b2.37529803_1767966072.2596.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '06 / Ebeveyn Yatak Odası & Keten Dokular', '06 / Master Suite & Linen Textures',
  'Doğal keten tekstiller, nötr toprak tonları ve bronz detaylı gömme gardıroplarla kurgulanan ebeveyn suiti, sakin ve zamansız bir sığınak niteliğindedir.',
  'Natural linen upholstery, neutral earth palettes, and custom bronze millwork establish an unhurried, timeless personal sanctuary.',
  5
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-7',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_6961057a6b6232.50026310_1767966074.4399.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '07 / Mermer Ebeveyn Banyosu', '07 / Bookmatched Marble Bath',
  'Geniş formatlı doğal damarlı mermer kaplamalar, gömme mat armatürler ve serbest küvet ile ıslak hacimde dingin bir spa konforu sağlandı.',
  'Continuous veined marble slabs, matte black concealed fixtures, and a freestanding tub provide spa-grade comfort.',
  6
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-8',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_6961057c10cf28.07376623_1767966076.0689.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '08 / Çalışma Odası & Kütüphane Nişi', '08 / Library Nook & Private Study',
  'Özel tasarım raflar ve odaklanmayı destekleyen doğal yan ışık kurgusuyla tasarlanan kütüphane köşesi, sessiz bir düşünme ortamı yaratır.',
  'Curated shelving niches and diffused natural sidelight foster a tranquil environment dedicated to literature and focus.',
  7
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-9',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_6961057d71fc35.97288065_1767966077.4669.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '09 / Teras & Peyzaj Entegrasyonu', '09 / Pool Terrace & Landscape Integration',
  'Geniş saçak altı gölgelendirmesi ve zeminle hemzemin devam eden doğal taş kaplama, bahçe ve havuz terasını salonun doğal bir uzantısı kılar.',
  'Generous overhangs and flush travertine stone thresholds extend internal lounging fluidly onto the pool terrace.',
  8
),
(
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf-img-10',
  '05850aba-8fa2-4d1d-8a15-60631eeea3cf',
  '/storage/projects/gallery/gallery_6961057ea71a93.20846564_1767966078.6845.jpg',
  'Villa Y: Çiftlikköy Rezidansı', 'Villa Y: Ciftlikkoy Residence',
  '10 / Akşam Işık Senaryosu & Cephe', '10 / Twilight Lighting & Facade',
  'Gizli dış aydınlatma armatürleriyle vurgulanan mimari kütle ritmi, yapının heykelsi karakterini gece saatlerinde de zarafetle ortaya koyar.',
  'Discreet exterior illumination accents rhythmic architectural reliefs, bringing sculptural presence to life at dusk.',
  9
) on conflict (id) do update set
  title_tr = excluded.title_tr,
  title_en = excluded.title_en,
  subtitle_tr = excluded.subtitle_tr,
  subtitle_en = excluded.subtitle_en,
  description_tr = excluded.description_tr,
  description_en = excluded.description_en;

-- -----------------------------------------------------------------------------
-- 3. Bespoke Atelier Furniture / Products
-- -----------------------------------------------------------------------------
insert into public.products (
  id, slug, name_tr, name_en, summary_tr, summary_en,
  description_tr, description_en, cover_url, category, material_tr, material_en, dimensions, specs, sort_order, is_published, is_featured
) values
(
  'prod-aura-sofa',
  'aura-heykelsi-kanepe',
  'Aura Heykelsi Kanepe',
  'Aura Sculptural Sofa',
  'Akışkan formları ve mimari kütlesel dengesiyle çağdaş yaşam alanlarına heykelsi bir kimlik kazandıran özel tasarım modüler kanepe.',
  'A sculptural modular sofa marrying fluid contours with balanced architectural volumes to enrich contemporary living environments.',
  'Aura Kanepe, yekpare kavisli çizgileri ve yüksek yoğunluklu ergonomik iç strüktürüyle hem görsel bir anıt hem de üst düzey oturum konforu sunar. Emre Meriç Atelier tarafından projelere özel kumaş ve deri varyasyonlarıyla üretilir.',
  'Designed by Emre Meriç Atelier, the Aura Sofa bridges monumental curves with ergonomic ease. Upholstered in tactile bouclé and custom wool textiles, each module is individually crafted upon order.',
  '/storage/products/1766698657.3486_20.jpg',
  'Mobilya & Oturma Grubu',
  'İtalyan Buklet Kumaş, Masif Huş Ağacı İskelet',
  'Italian Bouclé Textile, Solid Birch Frame',
  'G: 280 cm × D: 110 cm × Y: 74 cm',
  '[
    {"label_tr": "Tasarım", "label_en": "Design", "value_tr": "Emre Meriç Atelier", "value_en": "Emre Meriç Atelier"},
    {"label_tr": "İskelet", "label_en": "Frame", "value_tr": "Fırınlanmış Masif Ağaç", "value_en": "Kiln-dried Solid Timber"},
    {"label_tr": "Kumaş", "label_en": "Upholstery", "value_tr": "Yüksek dayanımlı İtalyan buklet", "value_en": "High-durability Italian bouclé"},
    {"label_tr": "Üretim", "label_en": "Craftsmanship", "value_tr": "El işçiliği özel sipariş", "value_en": "Handcrafted to order"}
  ]'::jsonb,
  0,
  true,
  true
),
(
  'prod-glia-table',
  'glia-masif-ahsap-masa',
  'Glia Masif Ahşap Masa',
  'Glia Solid Timber Dining Table',
  'Monolitik geometrisi ve zanaatkâr el işçiliğiyle ahşabın doğal dokusunu ön plana çıkaran mimari yemek masası.',
  'A tectonic dining table celebrating natural timber grains through monolithic proportions and artisanal joinery.',
  'Glia Masa, sürdürülebilir ormanlardan temin edilen Amerikan ceviz ağacının doğal damar akışını koruyarak tasarlanmıştır. Ayakların açılı kütlesi ve masif üst plaka, mekânda dengeli ve güçlü bir mimari odak noktası kurgular.',
  'Handcrafted from select American Walnut, the Glia Table honors the continuous grain of solid wood. Angular monolithic legs provide exceptional architectural stability with visual lightness.',
  '/storage/products/1766699313.3361_3.jpg',
  'Yemek Odası & Masa',
  'Masif Amerikan Cevizi, Doğal Mat Yağ Bitişi',
  'Solid American Walnut, Organic Matte Oil Finish',
  'G: 260 cm × D: 105 cm × Y: 76 cm',
  '[
    {"label_tr": "Tasarım", "label_en": "Design", "value_tr": "Emre Meriç Atelier", "value_en": "Emre Meriç Atelier"},
    {"label_tr": "Malzeme", "label_en": "Material", "value_tr": "Doğal Amerikan Ceviz Ağacı", "value_en": "Natural American Walnut"},
    {"label_tr": "Yüzey", "label_en": "Finish", "value_tr": "Solvent içermeyen organik koruyucu yağ", "value_en": "Zero-VOC organic oil"},
    {"label_tr": "Ölçü Opsiyonu", "label_en": "Sizing", "value_tr": "220 cm / 260 cm / 300 cm", "value_en": "Custom dimensions upon request"}
  ]'::jsonb,
  1,
  true,
  true
),
(
  'prod-kyoto-sideboard',
  'kyoto-silindirik-konsol',
  'Kyoto Silindirik Konsol',
  'Yivli gövde ritmi ve monolitik mermer üst plakasıyla depolamayı heykelsi bir sanat nesnesine dönüştüren büfe.',
  'A fluted timber credenza featuring a monolithic natural marble top that reinterprets storage as architectural art.',
  'Kyoto Konsol, Japon marangozluk geleneğinin yalınlığı ile Akdeniz mermerinin asaletini buluşturur. 360 derece devam eden el oyması yiv detayları, ışık ve gölge oyunlarıyla gün boyu mekâna ritim kazandırır.',
  'Bridging Japanese minimalism with Mediterranean marble textures, the Kyoto Sideboard exhibits continuous fluted woodwork that creates an engaging interplay of shadow and light.',
  '/storage/products/1766699684.0955_4.jpg',
  'Depolama & Konsol',
  'Koyu Füme Meşe, Emperador Mermer',
  'Dark Smoked Oak, Emperador Marble',
  'G: 220 cm × D: 50 cm × Y: 82 cm',
  '[
    {"label_tr": "Tasarım", "label_en": "Design", "value_tr": "Emre Meriç Atelier", "value_en": "Emre Meriç Atelier"},
    {"label_tr": "Üst Tabla", "label_en": "Countertop", "value_tr": "Doğal Damarlı Mermer", "value_en": "Honed Natural Marble"},
    {"label_tr": "Kapaklar", "label_en": "Doors", "value_tr": "Gizli bas-aç menteşe mekanizması", "value_en": "Concealed push-to-open hardware"}
  ]'::jsonb,
  2,
  true,
  true
),
(
  'prod-stria-bookcase',
  'stria-mimari-kitaplik',
  'Stria Mimari Kitaplık',
  'Hafifletilmiş alüminyum dikey profiller ve masif raflarla şeffaf bir mekân bölücü niteliğinde kurgulanan kütüphane.',
  'An open-framework shelving partition formed by slim aluminum uprights and solid oak floating shelves.',
  'Stria Kitaplık, mekânları tamamen kapatmadan görsel derinliği koruyarak fonksiyonel alanlar tanımlar. Modüler raf aralıkları hem koleksiyon kitapları hem de sanat objeleri için ideal sergileme zeminleri oluşturur.',
  'Serving as a light-filtering room divider, the Stria Bookcase articulates spaciousness while providing versatile niches for art editions and sculptural artifacts.',
  '/storage/products/1766700010.5188_7.jpg',
  'Kütüphane & Sergileme',
  'Bronz Eloksallı Alüminyum, Doğal Meşe Raflar',
  'Bronze Anodized Aluminum, Natural Oak Shelves',
  'G: 200 cm × D: 38 cm × Y: 210 cm',
  '[
    {"label_tr": "Tasarım", "label_en": "Design", "value_tr": "Emre Meriç Atelier", "value_en": "Emre Meriç Atelier"},
    {"label_tr": "Strüktür", "label_en": "Framework", "value_tr": "Mimari sınıf alüminyum profil", "value_en": "Architectural-grade aluminum"},
    {"label_tr": "Modülerlik", "label_en": "Modularity", "value_tr": "İsteğe göre genişletilebilir ünite", "value_en": "Expandable unit configuration"}
  ]'::jsonb,
  3,
  true,
  true
) on conflict (slug) do update set
  name_tr = excluded.name_tr,
  name_en = excluded.name_en,
  summary_tr = excluded.summary_tr,
  summary_en = excluded.summary_en,
  description_tr = excluded.description_tr,
  description_en = excluded.description_en,
  material_tr = excluded.material_tr,
  material_en = excluded.material_en,
  specs = excluded.specs;

-- -----------------------------------------------------------------------------
-- 4. Product Gallery Images with per-photo subtitles & descriptions
-- -----------------------------------------------------------------------------
insert into public.product_images (
  id, product_id, url, alt_tr, alt_en, title_tr, title_en, subtitle_tr, subtitle_en, description_tr, description_en, sort_order
) values
(
  'prod-img-aura-1',
  'prod-aura-sofa',
  '/storage/products/1766698657.3486_20.jpg',
  'Aura Heykelsi Kanepe', 'Aura Sculptural Sofa',
  'Aura Heykelsi Kanepe', 'Aura Sculptural Sofa',
  '01 / Monolitik Kütle & Genel Form', '01 / Monolithic Form & General Silhouette',
  'Kök kaplama ahşap gövde ile el dikişi hakiki derinin kusursuz birleşimi, kanepenin mekânda heykelsi bir odak oluşturmasını sağlar.',
  'The seamless articulation of root veneer casework and hand-stitched leather forms a sculptural centerpiece in architectural volumes.',
  0
),
(
  'prod-img-aura-2',
  'prod-aura-sofa',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  'Aura Heykelsi Kanepe — Ahşap Detayı', 'Aura Sculptural Sofa — Wood Detail',
  'Aura Heykelsi Kanepe', 'Aura Sculptural Sofa',
  '02 / Zanaat Marangozluğu & Ahşap Detayı', '02 / Artisanal Joinery & Timber Grain',
  'Fırınlanmış masif ahşap iskelet üzerine uygulanan doğal kök meşe paneller, organik damar hareketleriyle her parçayı benzersiz kılar.',
  'Organic grain patterns of wild root oak veneer render each handcrafted sofa unique, celebrating raw natural variations.',
  1
),
(
  'prod-img-aura-3',
  'prod-aura-sofa',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  'Aura Heykelsi Kanepe — Deri Dikişi', 'Aura Sculptural Sofa — Leather Detail',
  'Aura Heykelsi Kanepe', 'Aura Sculptural Sofa',
  '03 / Hakiki Deri & Ergonomik Dikiş', '03 / Full-Grain Leather & Ergonomic Cushioning',
  'Yüksek dayanımlı anilin deri kaplama, özel dolgu katmanları sayesinde uzun ömürlü konfor ve zamansız bir dokunma hissi sunar.',
  'Supple aniline upholstery backed by multi-density natural foams provides enduring tactile luxury and ergonomic poise.',
  2
),
(
  'prod-img-aura-4',
  'prod-aura-sofa',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
  'Aura Heykelsi Kanepe — Mekânsal Denge', 'Aura Sculptural Sofa — Spatial Balance',
  'Aura Heykelsi Kanepe', 'Aura Sculptural Sofa',
  '04 / Mekânsal Denge & Yan Silüet', '04 / Spatial Balance & Low-Slung Profile',
  'Geniş yan profili ve yere oturan alçak hacmi, salon kurgularında mimari dinginliği destekleyen sağlam bir denge yaratır.',
  'A grounded, low-slung silhouette establishes calm gravitational serenity in open-concept living interiors.',
  3
),
(
  'prod-img-glia-1',
  'prod-glia-table',
  '/storage/products/1766699313.3361_3.jpg',
  'Glia Masif Ahşap Masa', 'Glia Solid Timber Table',
  'Glia Masif Ahşap Masa', 'Glia Solid Timber Table',
  '01 / Monolitik Geometri & Ahşap Akışı', '01 / Continuous Grain & Architectural Mass',
  'Amerikan cevizinin zengin damar devamlılığını koruyan masif tabla, açılı kütlesel ayaklarla mimari bir güç sergiler.',
  'Solid walnut slabs paired with monolithic angular legs demonstrate structural gravitas without visual encumbrance.',
  0
),
(
  'prod-img-glia-2',
  'prod-glia-table',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
  'Glia Masif Ahşap Masa — Pirinç Kenet', 'Glia Solid Timber Table — Brass Detail',
  'Glia Masif Ahşap Masa', 'Glia Solid Timber Table',
  '02 / Pirinç Kenet & Marangozluk Detayı', '02 / Brass Dovetail & Hand Joinery',
  'Doğal yarıkları sabitleyen fırçalanmış masif pirinç kırlangıç kuyruğu ekleri, geleneksel marangozluğu çağdaş sanatla buluşturur.',
  'Brushed brass dovetail butterfly keys reinforce natural fissures while elevating traditional joinery into art.',
  1
),
(
  'prod-img-kyoto-1',
  'prod-kyoto-sideboard',
  '/storage/products/1766699684.0955_4.jpg',
  'Kyoto Silindirik Konsol', 'Kyoto Fluted Credenza',
  'Kyoto Silindirik Konsol', 'Kyoto Fluted Credenza',
  '01 / Yivli Gövde & Işık-Gölge Ritmi', '01 / Fluted Rhythm & Light Modulation',
  '360 derece devam eden el oyması dikey ahşap çıtalar, gün ışığı altında değişken bir derinlik ve tektonik ritim üretir.',
  'Continuous vertical timber fluting creates delicate micro-shadows that shift with sunlight throughout the day.',
  0
),
(
  'prod-img-stria-1',
  'prod-stria-bookcase',
  '/storage/products/1766700010.5188_7.jpg',
  'Stria Mimari Kitaplık', 'Stria Architectural Bookcase',
  'Stria Mimari Kitaplık', 'Stria Architectural Bookcase',
  '01 / Şeffaf Bölücü & Mekânsal Katman', '01 / Transparent Divider & Spatial Layering',
  'Mekânı bölmeden görsel akışı sürdüren açık strüktür, hem sanat objeleri hem de mimari literatür için zarif nişler sunar.',
  'Serving as a light-filtering room divider, the Stria Bookcase articulates spaciousness while providing versatile niches.',
  0
)
on conflict (id) do update set
  title_tr = excluded.title_tr,
  title_en = excluded.title_en,
  subtitle_tr = excluded.subtitle_tr,
  subtitle_en = excluded.subtitle_en,
  description_tr = excluded.description_tr,
  description_en = excluded.description_en;
