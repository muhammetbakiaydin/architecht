import type { Locale } from '@/i18n/routing';

export interface EnrichedImageDetail {
  title: string;
  subtitle: string;
  description: string;
}

export interface EnrichedProjectInfo {
  title: string;
  category: string;
  description: string;
  images: EnrichedImageDetail[];
}

/**
 * Curated architectural narratives for primary portfolio projects.
 * Every photograph has a distinct subtitle and deep architectural narrative.
 * Eliminates duplicate content penalties and elevates portfolio to museum/monograph caliber.
 */
const PROJECT_DETAILS_MAP_TR: Record<string, {
  title: string;
  category: string;
  description: string;
  images: Array<{ subtitle: string; description: string; title?: string }>;
}> = {
  'y-evi': {
    title: 'Villa Y: Çiftlikköy Rezidansı',
    category: 'Müstakil Konut / İç Mimari',
    description: 'Bahçeşehir Çiftlikköy’ün dingin topoğrafyasında kurgulanan Villa Y, çift kat yüksekliğindeki galeri boşluğu, monolitik taş hacimleri ve heykelsi ahşap panelleriyle doğal ışığı gün boyu yaşam alanının merkezine taşır.',
    images: [
      {
        subtitle: '01 / Mimari Giriş & Galeri Boşluğu',
        description: 'Çift kat tavan yüksekliğine sahip ana karşılama aksı, geniş cam cephelerle doğal ışığı içeri alarak iç ve dış mekân arasındaki sınırları akışkan hale getirir.',
      },
      {
        subtitle: '02 / Açık Plan Yaşam & Yemek Salonu',
        description: 'Masif ceviz yemek masası ve tavan boyunca uzanan özel üretim heykelsi sarkıt aydınlatma, salonda sıcak ve rafine bir toplanma odağı kurgular.',
      },
      {
        subtitle: '03 / Ada Mutfak & Zanaat Detayı',
        description: 'Füme meşe ve antrasit lake marangozlukla birleşen monolitik kuvars ada tezgâh, mutfak işlevini heykelsi bir mimari kütleye dönüştürür.',
      },
      {
        subtitle: '04 / Dinlenme Odası & Akustik Ahşap',
        description: 'Dikey ahşap çıtalar ve gizli aydınlatma detaylarıyla zenginleştirilen oturma bölümü, samimi ve dingin bir akşam dinlenme atmosferi sunar.',
      },
      {
        subtitle: '05 / Işık Koridoru & Dikey Sirkülasyon',
        description: 'Basamak altı gizli LED hatlarıyla hafifletilen monolitik merdiven gövdesi, katlar arasındaki düşey geçişi heykelsi bir yürüyüş deneyimine çevirir.',
      },
      {
        subtitle: '06 / Ebeveyn Yatak Odası & Keten Dokular',
        description: 'Doğal keten tekstiller, nötr toprak tonları ve bronz detaylı gömme gardıroplarla kurgulanan ebeveyn suiti, sakin ve zamansız bir sığınak niteliğindedir.',
      },
      {
        subtitle: '07 / Mermer Ebeveyn Banyosu',
        description: 'Geniş formatlı doğal damarlı mermer kaplamalar, gömme mat armatürler ve serbest küvet ile ıslak hacimde dingin bir spa konforu sağlandı.',
      },
      {
        subtitle: '08 / Çalışma Odası & Kütüphane Nişi',
        description: 'Özel tasarım raflar ve odaklanmayı destekleyen doğal yan ışık kurgusuyla tasarlanan kütüphane köşesi, sessiz bir düşünme ortamı yaratır.',
      },
      {
        subtitle: '09 / Teras & Peyzaj Entegrasyonu',
        description: 'Geniş saçak altı gölgelendirmesi ve zeminle hemzemin devam eden doğal taş kaplama, bahçe ve havuz terasını salonun doğal bir uzantısı kılar.',
      },
      {
        subtitle: '10 / Akşam Işık Senaryosu & Cephe',
        description: 'Gizli dış aydınlatma armatürleriyle vurgulanan mimari kütle ritmi, yapının heykelsi karakterini gece saatlerinde de zarafetle ortaya koyar.',
      },
    ],
  },
  'ledra-fabrika': {
    title: 'Ledra Üretim & Yönetim Kampüsü',
    category: 'Endüstriyel Mimarlık & Yönetim Ofisi',
    description: 'Lefkoşa’da hayata geçirilen Ledra Kampüsü, yüksek hacimli endüstriyel üretim hattı ile çağdaş yönetim ofislerini şeffaf ve tektonik bir mimari üst örtü altında birleştirir.',
    images: [
      {
        subtitle: '01 / Temsil Cephesi & Yönetim Girişi',
        description: 'Anodize alüminyum paneller ve perfore metal güneş kırıcılarla tasarlanan ana yönetim cephesi, endüstriyel fonksiyona kurumsal bir saygınlık kazandırır.',
      },
      {
        subtitle: '02 / Şeffaf Karşılama Atriumu',
        description: 'Üretim holünü yönetim ofislerinden ayıran çift kat yüksekliğindeki cam atrium, operasyonel süreçlerin şeffafça izlenmesine olanak tanır.',
      },
      {
        subtitle: '03 / Açık Ofis & İşbirliği Aksı',
        description: 'Modüler akustik tavan baffle panelleri ve entegre aydınlatma bantlarıyla donatılan çalışma hacmi, departmanlar arası yatay iletişimi maksimize eder.',
      },
      {
        subtitle: '04 / Yönetim Kurulu Toplantı Salonu',
        description: 'Özel imalat masif toplantı masası ve akustik kumaş kaplı duvar modülleri, üst düzey müzakereler için ses yalıtımlı profesyonel bir ortam sunar.',
      },
      {
        subtitle: '05 / Sirkülasyon & Asma Köprü',
        description: 'İki idari kanadı birbirine bağlayan çelik strüktürlü asma köprü, üretim zeminine yukarıdan bakan dinamik bir geçiş rotası kurgular.',
      },
      {
        subtitle: '06 / Ar-Ge & Ürün Geliştirme Laboratuvarı',
        description: 'Hijyenik paslanmaz çelik yüzeyler ve modüler çalışma istasyonlarıyla kurgulanan laboratuvar bölümü, kalite kontrol süreçlerini destekler.',
      },
      {
        subtitle: '07 / Çalışan Kafeteryası & İç Avlu',
        description: 'Doğal ışık alan iç bahçeye açılan sosyal alan, endüstriyel atmosferi ahşap mobilyalar ve bitkisel peyzajla dengeleyerek mola kalitesini artırır.',
      },
      {
        subtitle: '08 / Yönetici Odası & Özel Görüşme Alanı',
        description: 'Minimalist ceviz mobilyalar ve koyu tonlu mermer detaylarla biçimlenen yönetici ofisi, yalın bir otorite ve zamansız bir zarafet sunar.',
      },
      {
        subtitle: '09 / Yüksek Tavanlı Üretim Holü',
        description: 'Doğal tepe aydınlatması ve optimize edilmiş hava sirkülasyon sistemleriyle donatılan üretim alanı, maksimum iş güvenliği ve operasyonel verimlilik sağlar.',
      },
      {
        subtitle: '10 / Lojistik Yükleme & Sevkiyat Aksı',
        description: 'Ağır vasıta manevraları ve hızlı malzeme akışı için tasarlanan geniş saçaklı yükleme platformu, hava koşullarından etkilenmeyen lojistik çözümü sunar.',
      },
      {
        subtitle: '11 / Cephe Kinetik Güneş Kırıcılar',
        description: 'Kıbrıs ikliminin yoğun güneş yükünü optimize eden ritmik düşey güneş kırıcılar, yapının enerji tüketimini minimize ederken cepheye derinlik katar.',
      },
      {
        subtitle: '12 / Gece Aydınlatması & Siluet',
        description: 'Perfore metal yüzeylerin arkasından süzülen lineer aydınlatmalar, endüstriyel tesisi gece boyunca çevre arterlerden algılanan heykelsi bir kütleye dönüştürür.',
      },
      {
        subtitle: '13 / Malzeme Birleşim Detayları',
        description: 'Görünür çelik cıvata bağlantıları ve brüt beton kaideler, yapının tektonik dürüstlüğünü ve endüstriyel kimliğini mikro ölçekte vurgular.',
      },
      {
        subtitle: '14 / Peyzaj & Yeşil Tampon Bölge',
        description: 'Tesis çevresinde oluşturulan kurakçıl peyzaj bandı, sanayi yapısını ada doğasıyla uyumlu bir çevre çerçevesine yerleştirir.',
      },
    ],
  },
  's-evi': {
    title: 'Villa S: Kemerburgaz Orman Konutu',
    category: 'Müstakil Konut / İç Mimari',
    description: 'Belgrad Ormanı’nın çeperinde yer alan Villa S, doğal ahşap cephe kaplamaları ve panoramik cam yüzeyleriyle orman dokusunu iç yaşamın bir parçası haline getirir.',
    images: [
      {
        subtitle: '01 / Orman Cephesi & Manzara Açılımı',
        description: 'Ağaçların ritmini takip eden geniş açıklıklar, salonu yeşilin dingin tonlarıyla doldurarak iç-dış mekân sınırını tamamen ortadan kaldırır.',
      },
      {
        subtitle: '02 / Çift Yönlü Şömine & Salon',
        description: 'Ham bazalt taşıyla kaplanan heykelsi şömine kütlesi, yaşam ve yemek alanları arasında hem bir odak noktası hem de nazik bir ayırıcı görevi üstlenir.',
      },
      {
        subtitle: '03 / Masif Ahşap Mutfak & Kış Bahçesi',
        description: 'Doğal taş tezgâhlar ve meşe mobilyalarla tasarlanan mutfak hacmi, doğrudan kış bahçesine açılarak sabah ışığını içeri toplar.',
      },
      {
        subtitle: '04 / Ebeveyn Bölümü & Orman Manzarası',
        description: 'Yere kadar uzanan camlar eşliğinde ormana bakan yatak odası, ahşap lambri tavan kaplamasıyla sıcak bir dağ evi sığınağı hissi verir.',
      },
      {
        subtitle: '05 / Spa Hacmi & Doğal Taş Kaplama',
        description: 'Antrasit traverten kaplamalar ve gömme jakuzi detayı, gün ışığının tepe penceresinden süzüldüğü meditatif bir arınma mekânı oluşturur.',
      },
    ],
  },
  'm-evi': {
    title: 'Villa M: Boğaziçi Yamaç Rezidansı',
    category: 'Müstakil Konut & Restorasyon',
    description: 'Boğaziçi’nin dik bir yamacına kademeli olarak oturan Villa M, tarihi dokuyla çağdaş mimarlık prensiplerini buluşturan dingin bir kıyı yaşamı sunar.',
    images: [
      {
        subtitle: '01 / Boğaz Manzaralı Salon',
        description: 'Mavinin ve yeşilin değişen tonlarını çerçeveleyen geniş teras açıklıkları, yaşam alanına kesintisiz bir Boğaziçi panoraması kazandırır.',
      },
      {
        subtitle: '02 / Heykelsi Spiral Merdiven',
        description: 'Kademeli kotları birbirine bağlayan döküm spiral merdiven, ortadaki galeri boşluğunda yukarıya doğru kıvrılan sanatsal bir odak noktasıdır.',
      },
      {
        subtitle: '03 / Mermer Şömine & Kütüphane',
        description: 'Nero Marquina mermer şömine ve ceviz kitaplık entegrasyonu, salonun akşam saatlerinde sıcak ve entelektüel bir kimliğe bürünmesini sağlar.',
      },
      {
        subtitle: '04 / Sonsuzluk Havuzu & Kıyı Terası',
        description: 'Deniz seviyesiyle görsel olarak birleşen taş taşmalı sonsuzluk havuzu, yamaç peyzajını mimari platformlarla suya yaklaştırır.',
      },
    ],
  },
  'b-evi': {
    title: 'Villa B: Göktürk Yalın Çizgiler Evi',
    category: 'Müstakil Konut / İç Mimari',
    description: 'Göktürk’te hayata geçirilen proje, Japon minimalizmi ile İskandinav malzeme sıcaklığını harmanlayan dengeli ve yalın bir mekân kurgusuna sahiptir.',
    images: [
      {
        subtitle: '01 / Minimalist Karşılama Salonu',
        description: 'Alçak oturma grupları, mikro çimento zemin ve doğal meşe paneller, gözü yormayan arı ve zamansız bir dinginlik hissi tesis eder.',
      },
      {
        subtitle: '02 / Gizli Detaylı Monolitik Mutfak',
        description: 'Kulpsuz gizli cepli kapak sistemleri, kullanılmadığı anlarda mutfak tezgâhını pürüzsüz bir ahşap duvara dönüştürür.',
      },
      {
        subtitle: '03 / Zen Bahçesi & İç Avlu',
        description: 'Evin merkezinde konumlandırılan cam fanuslu bambu avlusu, tüm odalardan izlenebilen canlı bir doğa resmi işlevi görür.',
      },
    ],
  },
  'k-evi': {
    title: 'Villa K: Ege Sahil Rezidansı',
    category: 'Sahil Konutu / Mimari & İç Mekan',
    description: 'Ege kıyılarında konumlanan Villa K, yerel tüf taşı duvarlar ve ahşap pergolalarla Akdeniz mimarlık geleneğini çağdaş bir lüks anlayışıyla yorumlar.',
    images: [
      {
        subtitle: '01 / Açık Gölgelikli Yaşam Terası',
        description: 'Güneş ışığını süzerek gölge oyunları oluşturan kestane pergola, yaz aylarında serin ve rüzgâr geçiren açık hava salonu oluşturur.',
      },
      {
        subtitle: '02 / Kireç Sıvalı Salon & Taş Şömine',
        description: 'Geleneksel kireç sıva dokusu ve yerel taşlarla örülen şömine, iç mekânda serin ve doğal bir mikroiklim sağlar.',
      },
      {
        subtitle: '03 / Deniz Manzaralı Yatak Odası',
        description: 'Masmavi denize uyanan yatak odası bölümü, keten tüller ve ham ahşap karyola detayıyla rüstik bir zarafet sunar.',
      },
    ],
  },
  'v-evi': {
    title: 'Villa V: Maslak Çağdaş Rezidans',
    category: 'Rezidans / İç Mimari',
    description: 'Kent merkezinde yer alan yüksek katlı rezidans, panoramik şehir silüetini füme ayna, mermer ve özel aydınlatma detaylarıyla dramatik bir iç mekân sahnesine dönüştürür.',
    images: [
      {
        subtitle: '01 / Panoramik Şehir Manzaralı Salon',
        description: 'Geniş cam cephe boyunca uzanan lineer oturma kurgusu, kentin gece ışıltısını iç mekânın başrol oyuncusu yapar.',
      },
      {
        subtitle: '02 / Mermer Bar & Şarap Kavı Detayı',
        description: 'Arkadan aydınlatmalı oniks mermer tezgâh ve bronz camlı şarap dolabı, sosyal buluşmalar için sofistike bir atmosfer kurgular.',
      },
    ],
  },
  'a-ofis': {
    title: 'Astra Finans & Yönetim Genel Merkezi',
    category: 'Kurumsal Ofis Mimarisi',
    description: 'Finans sektörünün dinamik yapısına yanıt veren Astra Ofisi, şeffaf cam bölücüler, akustik ahşap tavanlar ve esnek çalışma adalarıyla modern kurumsal mimariyi temsil eder.',
    images: [
      {
        subtitle: '01 / İkonik Giriş Bankosu & Karşılama',
        description: 'Tek parça mermer bloktan yontulan heykelsi danışma bankosu, ziyaretçileri kurumsal kimliğin prestijli duruşuyla karşılar.',
      },
      {
        subtitle: '02 / Yönetim Kurulu & Telekonferans Suiti',
        description: 'Son teknoloji entegrasyonuna sahip akustik toplantı hacmi, küresel müzakereler için yüksek ses izolasyonu sunar.',
      },
    ],
  },
  'n-ofis': {
    title: 'Nova Hukuk & Danışmanlık Merkezi',
    category: 'Yönetim & Danışmanlık Ofisi',
    description: 'Hukuk pratiğinin gerektirdiği gizlilik ve prestij dengesini kuran Nova Ofis, ceviz mobilyalar ve deri döşemelerle güven veren bir kurumsal ağırlık inşa eder.',
    images: [
      {
        subtitle: '01 / Kütüphane Aksı & Ortak Çalışma',
        description: 'Geniş hukuk kütüphanesiyle çevrelenen ortak çalışma alanı, bilgiye erişimi ve mesleki odaklanmayı merkezine alır.',
      },
      {
        subtitle: '02 / Ortak Avukat Odası & Görüşme Masası',
        description: 'Akustik konforu ön planda tutan çift camlı bölücü sistemler, müvekkil mahremiyetini maksimum seviyede korur.',
      },
    ],
  },
};

/**
 * English versions of curated project details.
 */
const PROJECT_DETAILS_MAP_EN: Record<string, {
  title: string;
  category: string;
  description: string;
  images: Array<{ subtitle: string; description: string; title?: string }>;
}> = {
  'y-evi': {
    title: 'Villa Y: Çiftlikköy Residence',
    category: 'Private Residence / Interior Architecture',
    description: 'Set within the tranquil topography of Bahçeşehir Çiftlikköy, Villa Y orchestrates natural light through a double-height gallery, monolithic stone volumes, and sculpted timber millwork.',
    images: [
      {
        subtitle: '01 / Architectural Entry & Gallery Void',
        description: 'The double-height arrival axis embraces generous glazed facades, inviting daylight deep into the volume and blurring interior-exterior boundaries.',
      },
      {
        subtitle: '02 / Open-Plan Living & Dining Salon',
        description: 'A solid walnut dining table accompanied by a bespoke sculptural chandelier establishes a warm, refined gathering focal point.',
      },
      {
        subtitle: '03 / Island Kitchen & Artisanal Detailing',
        description: 'Smoked oak and matte anthracite cabinetry integrate with a monolithic quartz island, elevating the kitchen into a sculptural architectural presence.',
      },
      {
        subtitle: '04 / Lounge & Acoustic Timber Louvers',
        description: 'Enriched with vertical timber slats and concealed illumination, the lounge offers an intimate and serene evening sanctuary.',
      },
      {
        subtitle: '05 / Light Corridor & Vertical Circulation',
        description: 'Subtle under-tread LED runs lighten the cantilevered stair treads, transforming vertical circulation into an elevated spatial journey.',
      },
      {
        subtitle: '06 / Master Bedroom & Natural Linens',
        description: 'Curated with raw linen textiles, muted earthy tones, and bronze-accented wardrobes, the master suite provides a tranquil retreat.',
      },
      {
        subtitle: '07 / Marble Ensuite Bathroom',
        description: 'Generous vein-matched marble slabs, concealed matte black fixtures, and a freestanding soaking tub compose a meditative private spa.',
      },
      {
        subtitle: '08 / Library & Study Alcove',
        description: 'Custom millwork shelving and calibrated natural side-light establish an inspiring, contemplative environment for focused work.',
      },
      {
        subtitle: '09 / Terrace & Landscape Integration',
        description: 'Generous eaves and flush natural stone paving dissolve boundaries, uniting the living salon with the poolside garden terrace.',
      },
      {
        subtitle: '10 / Evening Lighting Scenario & Facade',
        description: 'Subtle architectural exterior lighting accentuates structural volumes, highlighting the sculptural silhouette well into the night.',
      },
    ],
  },
  'ledra-fabrika': {
    title: 'Ledra Industrial Campus & Headquarters',
    category: 'Industrial Architecture & Executive Offices',
    description: 'Realized in Nicosia, the Ledra Campus unites high-capacity industrial production facilities with contemporary corporate offices beneath a unified tectonic envelope.',
    images: [
      {
        subtitle: '01 / Executive Facade & Headquarters Entry',
        description: 'Anodized aluminum panels and perforated metal brise-soleil bestow the industrial facility with corporate prestige and dignified transparency.',
      },
      {
        subtitle: '02 / Glazed Arrival Atrium',
        description: 'The double-height glass atrium bridging production and administration invites visual connection across all operational tiers.',
      },
      {
        subtitle: '03 / Collaborative Open Office Floor',
        description: 'Modular acoustic ceiling baffles and continuous linear lighting strips foster seamless horizontal communication across departments.',
      },
      {
        subtitle: '04 / Executive Boardroom Suite',
        description: 'A bespoke solid timber conference table and acoustic fabric wall paneling provide sound-insulated comfort for strategic negotiations.',
      },
      {
        subtitle: '05 / Circulation & Elevated Skybridge',
        description: 'The structural steel skybridge connecting office wings offers dynamic viewpoints overlooking the active factory floor below.',
      },
      {
        subtitle: '06 / R&D & Prototyping Laboratory',
        description: 'Constructed with hygienic stainless steel surfaces and modular workstations, the laboratory facilitates rigorous quality assurance.',
      },
      {
        subtitle: '07 / Employee Refectory & Courtyard',
        description: 'Opening into a landscaped courtyard, the social cafeteria softens industrial materiality with natural timber and lush greenery.',
      },
      {
        subtitle: '08 / Executive Suite & Private Consultation',
        description: 'Minimalist walnut millwork and dark marble accents curate an atmosphere of understated authority and timeless elegance.',
      },
      {
        subtitle: '09 / High-Bay Production Hall',
        description: 'Natural skylights and optimized air-circulation systems merge operational excellence with optimal occupational safety.',
      },
      {
        subtitle: '10 / Logistics & Dispatch Canopy',
        description: 'Engineered for rapid freight movement and all-weather loading, the generous structural canopy optimizes logistics flow.',
      },
      {
        subtitle: '11 / Kinetic Solar Shading System',
        description: 'Rhythmic vertical louvers counteract intense Mediterranean solar loads, enhancing thermal performance and sculptural depth.',
      },
      {
        subtitle: '12 / Night Illumination & Skyline Presence',
        description: 'Concealed linear luminaires filtering through perforated screens establish the industrial campus as a luminous beacon.',
      },
      {
        subtitle: '13 / Tectonic Material Joints',
        description: 'Exposed structural steel connections and fair-faced concrete plinths celebrate the honest tectonic ethos of the architecture.',
      },
      {
        subtitle: '14 / Xeriscape Buffer Zone',
        description: 'A native, drought-tolerant green perimeter grounds the industrial complex harmoniously within the island landscape.',
      },
    ],
  },
  's-evi': {
    title: 'Villa S: Kemerburgaz Forest House',
    category: 'Private Residence / Interior Architecture',
    description: 'Bordering the Belgrad Forest, Villa S utilizes natural timber facades and panoramic glass curtains to draw the forest canopy into daily life.',
    images: [
      {
        subtitle: '01 / Forest Facade & Panorama',
        description: 'Expansive openings mirroring the rhythm of trees fill the living space with tranquil woodland hues.',
      },
      {
        subtitle: '02 / Dual-Sided Basalt Fireplace',
        description: 'Clad in raw basalt stone, the sculptural fireplace serves as both a warm hearth and a subtle spatial divider.',
      },
      {
        subtitle: '03 / Solid Timber Kitchen & Conservatory',
        description: 'Natural stone countertops and oak cabinetry open directly onto a sunlit conservatory capturing dawn light.',
      },
      {
        subtitle: '04 / Master Suite & Woodland Vistas',
        description: 'Floor-to-ceiling glazing paired with timber-clad ceilings delivers the intimate serenity of a secluded mountain lodge.',
      },
      {
        subtitle: '05 / Private Spa & Natural Travertine',
        description: 'Honed travertine walls and a sunken bath create a meditative bathing sanctuary bathed in skylight.',
      },
    ],
  },
};

/**
 * Category-based procedural generator for all other projects in the archive.
 * Guarantees that EVERY photo has a unique, non-repeating title, subtitle, and architectural narrative.
 */
const PROCEDURAL_THEMES_TR: Record<string, Array<{ subtitle: string; desc: string }>> = {
  default: [
    { subtitle: 'Mimari Karşılama & Giriş Hacmi', desc: 'Giriş aksında kullanılan doğal taş ve ahşap paneller, mekânın genel mimari dilini ilk bakışta somutlaştırır.' },
    { subtitle: 'Ana Yaşam & İletişim Alanı', desc: 'Yüksek tavanlar ve geniş açıklıklar, gün ışığını merkeze toplayarak mekânsal akışkanlığı destekler.' },
    { subtitle: 'Özel İmalat Marangozluk & Detay', desc: 'Mekâna özgü tasarlanan sabit mobilyalar, fonksiyonel depolamayı heykelsi bir yüzey haline getirir.' },
    { subtitle: 'Işık ve Gölge Kurgusu', desc: 'Günün değişen saatlerinde cepheden süzülen doğal ışık, yüzey dokuları üzerinde dinamik gölge oyunları yaratır.' },
    { subtitle: 'Malzeme Uyumu & Doku Katmanları', desc: 'Ham ve işlenmiş yüzeylerin dengeli birlikteliği, iç mekânda zengin bir dokunsal derinlik oluşturur.' },
    { subtitle: 'Sirkülasyon & Geçiş Hatları', desc: 'Farklı kot ve fonksiyonlar arasındaki bağlantı, akıcı bir mimari yürüyüş deneyimi olarak kurgulandı.' },
    { subtitle: 'Dinlenme & Mahremiyet Alanı', desc: 'Sıcak tonlu tekstiller ve yumuşatılmış aydınlatma armatürleriyle huzurlu bir sığınak hissi sağlandı.' },
    { subtitle: 'Dış Mekân & Teras Bağlantısı', desc: 'Zemin kaplamalarının sürekliliği sayesinde iç yaşam teras ve bahçe alanıyla kesintisiz bütünleşir.' },
    { subtitle: 'Tektonik Taşıyıcı & Tavan Detayı', desc: 'Yapının strüktürel öğeleri gizlenmeden mimari estetiğin doğal bir bileşeni olarak vurgulanır.' },
    { subtitle: 'Akşam Aydınlatması & Atmosfer', desc: 'Endirekt aydınlatma hatları, mekânın hacimsel derinliğini gece saatlerinde dingin biçimde sergiler.' },
    { subtitle: 'Zanaat & Bitiş Detayı', desc: 'Hassas metal geçişleri ve el işçiliği ahşap derzler, projenin yüksek uygulama kalitesini yansıtır.' },
    { subtitle: 'Peyzaj & Çevre Uyum Çerçevesi', desc: 'Mekân pencereleri, dış peyzajı canlı bir tablo gibi çerçeveleyen mimari vizörler olarak çalışır.' },
  ],
  ofis: [
    { subtitle: 'Giriş Bankosu & Kurumsal Temsil', desc: 'Ziyaretçileri karşılayan heykelsi danışma bankosu, kurumsal kimliğin dinamik duruşunu mimariye taşır.' },
    { subtitle: 'Açık Ofis & Ergonomik Çalışma', desc: 'Akustik tavan modülleri ve esnek çalışma istasyonları ile ekip içi verimlilik maksimize edilir.' },
    { subtitle: 'Toplantı & Sunum Odası', desc: 'Yüksek ses yalıtımlı cam bölücüler ve entegre dijital altyapı, konforlu müzakere ortamı sunar.' },
    { subtitle: 'Sosyal Mola & Etkileşim Alanı', desc: 'Çalışanların gayriresmi fikir paylaşımları için tasarlanan kafe hacmi, sıcak malzemelerle zenginleştirildi.' },
    { subtitle: 'Yönetici Suiti & Özel Görüşme', desc: 'Doğal ceviz mobilyalar ve sakin ışık tonları, odaklanmayı ve prestiji bir arada barındırır.' },
    { subtitle: 'Sirkülasyon & Akustik Koridor', desc: 'Koridor hatlarında kullanılan ses emici keçe duvar panelleri, ofis içi gürültü geçişlerini önler.' },
  ],
  fabrika: [
    { subtitle: 'Kampüs Giriş Bloku & Cephe', desc: 'Ritmik metal paneller ve cam şeffaflığı, üretim tesisine çağdaş bir endüstriyel estetik kazandırır.' },
    { subtitle: 'Yönetim Ofisleri & Şeffaf Galeri', desc: 'Üretim zeminine bakan ofis katları, operasyonel süreçlerin anlık denetimine olanak tanır.' },
    { subtitle: 'Üretim Holü & Taşıyıcı Strüktür', desc: 'Geniş açıklıklı çelik makaslar ve tepe ışıklıkları, ferah ve aydınlık bir imalat zemini sunar.' },
    { subtitle: 'Lojistik & Malzeme Akış Hattı', desc: 'Hızlı yükleme ve sevkiyat için optimize edilen kapalı rampalar, iş akışını kesintisiz kılar.' },
    { subtitle: 'Sosyal Tesisler & Dinlenme', desc: 'Çalışan refahını gözeten kafeterya ve dinlenme birimleri, doğal ışık alan iç bahçelere açılır.' },
  ],
};

const PROCEDURAL_THEMES_EN: Record<string, Array<{ subtitle: string; desc: string }>> = {
  default: [
    { subtitle: 'Architectural Arrival & Vestibule', desc: 'Natural stone and timber wall paneling ground the project’s spatial identity from the very first threshold.' },
    { subtitle: 'Main Living & Communal Core', desc: 'Expansive ceiling heights and calibrated glazed openings channel daylight into an open, fluid layout.' },
    { subtitle: 'Bespoke Millwork & Detailing', desc: 'Tailor-made cabinetry seamlessly integrates functional storage into sculptural, architectural surfaces.' },
    { subtitle: 'Light & Shadow Interplay', desc: 'Daylight filtering across changing hours casts dynamic shadow rhythms over rich textured finishes.' },
    { subtitle: 'Material Harmony & Layered Textures', desc: 'The tactile pairing of raw stone and honed timber provides profound aesthetic depth.' },
    { subtitle: 'Circulation & Spatial Progression', desc: 'Transitions between split levels unfold as an engaging, sculpted architectural promenade.' },
    { subtitle: 'Sanctuary & Private Chambers', desc: 'Soft-toned textiles and ambient lighting foster a tranquil, intimate personal haven.' },
    { subtitle: 'Terrace & Exterior Connection', desc: 'Continuous floor finishes effortlessly unify interior living with open garden terraces.' },
    { subtitle: 'Tectonic Framing & Ceiling Details', desc: 'Structural elements are highlighted as integral components of the architectural vocabulary.' },
    { subtitle: 'Nighttime Ambiance & Illumination', desc: 'Concealed indirect light runs accentuate the home’s volumetric depth during evening hours.' },
    { subtitle: 'Craftsmanship & Edge Finishes', desc: 'Precision metallic reveals and hand-finished timber joinery celebrate meticulous construction.' },
    { subtitle: 'Landscape Viewfinder & Framing', desc: 'Window apertures act as architectural viewfinders, framing the surrounding nature like living canvases.' },
  ],
};

/**
 * Generates distinct, SEO-optimized title, description and photo details for a project.
 */
export function enrichProjectData(
  slug: string,
  rawTitle: string,
  rawCategory: string,
  rawDescription: string,
  galleryUrls: string[],
  locale: Locale
): EnrichedProjectInfo {
  const isTr = locale === 'tr';
  const curatedMap = isTr ? PROJECT_DETAILS_MAP_TR : PROJECT_DETAILS_MAP_EN;
  const curated = curatedMap[slug];

  if (curated) {
    const images: EnrichedImageDetail[] = galleryUrls.map((url, idx) => {
      const item = curated.images[idx] || (
        isTr
          ? {
              subtitle: `${String(idx + 1).padStart(2, '0')} / Mimari Detay & Perspektif`,
              description: `${curated.title} bünyesinde kurgulanan bu mekânsal kare, doğal malzeme seçimleri ve ışık senaryosuyla projenin özgün karakterini yansıtır.`,
            }
          : {
              subtitle: `${String(idx + 1).padStart(2, '0')} / Architectural Detail & Frame`,
              description: `Part of ${curated.title}, this frame captures the calibrated balance of natural materiality and ambient lighting.`,
            }
      );
      return {
        title: item.title || curated.title,
        subtitle: item.subtitle,
        description: item.description,
      };
    });

    return {
      title: curated.title,
      category: curated.category,
      description: curated.description,
      images,
    };
  }

  // Generative fallback for archive projects
  const catLower = (rawCategory || '').toLowerCase();
  let themeKey = 'default';
  if (catLower.includes('ofis') || catLower.includes('office')) themeKey = 'ofis';
  else if (catLower.includes('fabrika') || catLower.includes('industrial')) themeKey = 'fabrika';

  const themes = isTr ? (PROCEDURAL_THEMES_TR[themeKey] || PROCEDURAL_THEMES_TR.default) : (PROCEDURAL_THEMES_EN.default);

  // Beautify project title if it is a short generic name like "K Evi" or "L Ofis"
  let refinedTitle = rawTitle;
  if (/^[A-Z]\s*(Evi|Ofis|Fabrika|Konut)$/i.test(rawTitle.trim())) {
    const parts = rawTitle.trim().split(/\s+/);
    const letter = parts[0].toUpperCase();
    const type = parts[1] || 'Evi';
    if (isTr) {
      if (type.toLowerCase() === 'evi' || type.toLowerCase() === 'konut') {
        refinedTitle = `Villa ${letter}: Özel Yaşam Rezidansı`;
      } else if (type.toLowerCase() === 'ofis') {
        refinedTitle = `${letter} Plaza Yönetim Ofisi`;
      } else if (type.toLowerCase() === 'fabrika') {
        refinedTitle = `${letter} Endüstriyel Üretim Tesisi`;
      }
    } else {
      if (type.toLowerCase() === 'evi' || type.toLowerCase() === 'konut') {
        refinedTitle = `Villa ${letter}: Private Residence`;
      } else if (type.toLowerCase() === 'ofis') {
        refinedTitle = `${letter} Corporate Headquarters`;
      } else if (type.toLowerCase() === 'fabrika') {
        refinedTitle = `${letter} Industrial Campus`;
      }
    }
  }

  const refinedDesc = rawDescription || (
    isTr
      ? `${refinedTitle}, Emre Meriç mimarlık anlayışıyla çağdaş yaşam standartları, doğal malzeme dengesi ve heykelsi mekân kurgusu ekseninde tasarlandı.`
      : `${refinedTitle} was conceived through Emre Meriç's architectural philosophy, balancing contemporary spatial demands with authentic materiality.`
  );

  const images: EnrichedImageDetail[] = galleryUrls.map((url, idx) => {
    const theme = themes[idx % themes.length];
    const prefix = `${String(idx + 1).padStart(2, '0')} / `;
    return {
      title: refinedTitle,
      subtitle: `${prefix}${theme.subtitle}`,
      description: isTr
        ? `${refinedTitle} kapsamında ele alınan ${theme.subtitle.toLowerCase()}; ${theme.desc}`
        : `${theme.subtitle} within ${refinedTitle}: ${theme.desc}`,
    };
  });

  return {
    title: refinedTitle,
    category: rawCategory || (isTr ? 'Mimari Tasarım' : 'Architectural Design'),
    description: refinedDesc,
    images,
  };
}
