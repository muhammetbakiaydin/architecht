import type { Locale } from '@/i18n/routing';
import type { ProductSpec } from './types';

export interface EnrichedProductImageDetail {
  url: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface EnrichedProductInfo {
  name: string;
  category: string;
  summary: string;
  description: string;
  material: string;
  dimensions: string;
  specs: ProductSpec[];
  images: EnrichedProductImageDetail[];
}

/**
 * Curated atelier narratives for Emre Meriç Atelier bespoke furniture & spatial objects.
 * Every photograph has a distinct subtitle and deep craftsmanship narrative.
 * Eliminates duplicate content penalties and elevates product pages to collector gallery caliber.
 */
const PRODUCT_DETAILS_MAP_TR: Record<string, {
  name: string;
  category: string;
  summary: string;
  description: string;
  material: string;
  dimensions: string;
  specs: ProductSpec[];
  images: Array<{ subtitle: string; description: string; title?: string }>;
}> = {
  'aura-sofa': {
    name: 'Aura Heykelsi Kanepe',
    category: 'Özel Koleksiyon / Oturma Grubu',
    summary: 'Yekpare kavisli hatları ve yüksek yoğunluklu konfor katmanlarıyla çağdaş yaşam alanlarına heykelsi bir anıt niteliği kazandırır.',
    description: 'Emre Meriç Atelier tarafından mimari projeler için özel olarak tasarlanan Aura Kanepe, doğal kök kaplama ahşap gövde ile hakiki deri döşemenin heykelsi uyumunu sunar. Geniş oturum derinliği ve zanaatkâr dikiş detayları, oturma hacminde dingin bir ağırlık merkezi oluşturur. Her parça sipariş üzerine sınırlı sayıda numaralandırılarak üretilir.',
    material: 'Kök Meşe Kaplama, Doğal Anilin Deri Döşeme',
    dimensions: 'G: 240 cm × D: 95 cm × Y: 75 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'İskelet', value: 'Fırınlanmış Masif Ağaç & Çelik Güçlendirme' },
      { label: 'Kaplama', value: 'Doğal Kök Meşe Marangozluk' },
      { label: 'Döşeme', value: 'El dikişi doğal anilin deri' },
      { label: 'Üretim', value: 'Sipariş üzerine numaralı üretim' },
    ],
    images: [
      {
        subtitle: '01 / Monolitik Kütle & Genel Form',
        description: 'Kök kaplama ahşap gövde ile el dikişi hakiki derinin kusursuz birleşimi, kanepenin mekânda heykelsi bir odak oluşturmasını sağlar.',
      },
      {
        subtitle: '02 / Zanaat Marangozluğu & Ahşap Detayı',
        description: 'Fırınlanmış masif ahşap iskelet üzerine uygulanan doğal kök meşe paneller, organik damar hareketleriyle her parçayı benzersiz kılar.',
      },
      {
        subtitle: '03 / Hakiki Deri & Ergonomik Dikiş',
        description: 'Yüksek dayanımlı anilin deri kaplama, özel dolgu katmanları sayesinde uzun ömürlü konfor ve zamansız bir dokunma hissi sunar.',
      },
      {
        subtitle: '04 / Mekânsal Denge & Yan Silüet',
        description: 'Geniş yan profili ve yere oturan alçak hacmi, salon kurgularında mimari dinginliği destekleyen sağlam bir denge yaratır.',
      },
    ],
  },
  'passion-kanepe': {
    name: 'Aura Heykelsi Kanepe',
    category: 'Özel Koleksiyon / Oturma Grubu',
    summary: 'Yekpare kavisli hatları ve yüksek yoğunluklu konfor katmanlarıyla çağdaş yaşam alanlarına heykelsi bir anıt niteliği kazandırır.',
    description: 'Emre Meriç Atelier tarafından mimari projeler için özel olarak tasarlanan Aura Kanepe, doğal kök kaplama ahşap gövde ile hakiki deri döşemenin heykelsi uyumunu sunar. Geniş oturum derinliği ve zanaatkâr dikiş detayları, oturma hacminde dingin bir ağırlık merkezi oluşturur.',
    material: 'Kök Meşe Kaplama, Doğal Anilin Deri Döşeme',
    dimensions: 'G: 240 cm × D: 95 cm × Y: 75 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'İskelet', value: 'Fırınlanmış Masif Ağaç & Çelik Güçlendirme' },
      { label: 'Kaplama', value: 'Doğal Kök Meşe Marangozluk' },
      { label: 'Döşeme', value: 'El dikişi doğal anilin deri' },
      { label: 'Üretim', value: 'Sipariş üzerine numaralı üretim' },
    ],
    images: [
      {
        subtitle: '01 / Monolitik Kütle & Genel Form',
        description: 'Kök kaplama ahşap gövde ile el dikişi hakiki derinin kusursuz birleşimi, kanepenin mekânda heykelsi bir odak oluşturmasını sağlar.',
      },
      {
        subtitle: '02 / Zanaat Marangozluğu & Ahşap Detayı',
        description: 'Fırınlanmış masif ahşap iskelet üzerine uygulanan doğal kök meşe paneller, organik damar hareketleriyle her parçayı benzersiz kılar.',
      },
      {
        subtitle: '03 / Hakiki Deri & Ergonomik Dikiş',
        description: 'Yüksek dayanımlı anilin deri kaplama, özel dolgu katmanları sayesinde uzun ömürlü konfor ve zamansız bir dokunma hissi sunar.',
      },
      {
        subtitle: '04 / Mekânsal Denge & Yan Silüet',
        description: 'Geniş yan profili ve yere oturan alçak hacmi, salon kurgularında mimari dinginliği destekleyen sağlam bir denge yaratır.',
      },
    ],
  },
  'glia-yemek-masasi': {
    name: 'Glia Masif Ahşap Masa',
    category: 'Yemek Odası & Masa',
    summary: 'Monolitik geometrisi ve zanaatkâr el işçiliğiyle ahşabın doğal dokusunu ön plana çıkaran mimari yemek masası.',
    description: 'Amerikan cevizinin doğal damar devamlılığını koruyan Glia Masa, açılı kütlesel ayakları ve pirinç birleşim detaylarıyla güçlü bir tektonik duruş sergiler. Yüzeyde kullanılan solvent içermeyen organik yağ bitişi, malzemenin nefes almasını ve zamanla zenginleşen bir patina kazanmasını sağlar.',
    material: 'Masif Amerikan Cevizi, Fırçalanmış Masif Pirinç',
    dimensions: 'G: 260 cm × D: 105 cm × Y: 76 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Malzeme', value: 'FSC Sertifikalı Masif Amerikan Cevizi' },
      { label: 'Detay', value: 'Fırçalanmış masif pirinç kenetler' },
      { label: 'Yüzey Bitişi', value: 'Doğal organik mat koruyucu yağ' },
      { label: 'Boyut Seçenekleri', value: '220 cm / 260 cm / 300 cm' },
    ],
    images: [
      {
        subtitle: '01 / Monolitik Geometri & Ahşap Akışı',
        description: 'Amerikan cevizinin zengin damar devamlılığını koruyan masif tabla, açılı kütlesel ayaklarla mimari bir güç sergiler.',
      },
      {
        subtitle: '02 / Pirinç Kenet & Marangozluk Detayı',
        description: 'Doğal yarıkları sabitleyen fırçalanmış masif pirinç kırlangıç kuyruğu ekleri, geleneksel marangozluğu çağdaş sanatla buluşturur.',
      },
      {
        subtitle: '03 / Mat Organik Yağ Bitişi',
        description: 'Solvent içermeyen doğal yağlarla korunan yüzey, ahşabın nefes almasını ve yıllar içinde asil bir patina kazanmasını sağlar.',
      },
    ],
  },
  'glia-masa': {
    name: 'Glia Masif Ahşap Masa',
    category: 'Yemek Odası & Masa',
    summary: 'Monolitik geometrisi ve zanaatkâr el işçiliğiyle ahşabın doğal dokusunu ön plana çıkaran mimari yemek masası.',
    description: 'Amerikan cevizinin doğal damar devamlılığını koruyan Glia Masa, açılı kütlesel ayakları ve pirinç birleşim detaylarıyla güçlü bir tektonik duruş sergiler. Yüzeyde kullanılan solvent içermeyen organik yağ bitişi, malzemenin nefes almasını ve zamanla zenginleşen bir patina kazanmasını sağlar.',
    material: 'Masif Amerikan Cevizi, Fırçalanmış Masif Pirinç',
    dimensions: 'G: 260 cm × D: 105 cm × Y: 76 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Malzeme', value: 'FSC Sertifikalı Masif Amerikan Cevizi' },
      { label: 'Detay', value: 'Fırçalanmış masif pirinç kenetler' },
      { label: 'Yüzey Bitişi', value: 'Doğal organik mat koruyucu yağ' },
    ],
    images: [
      {
        subtitle: '01 / Monolitik Geometri & Ahşap Akışı',
        description: 'Amerikan cevizinin zengin damar devamlılığını koruyan masif tabla, açılı kütlesel ayaklarla mimari bir güç sergiler.',
      },
      {
        subtitle: '02 / Pirinç Kenet & Marangozluk Detayı',
        description: 'Doğal yarıkları sabitleyen fırçalanmış masif pirinç kırlangıç kuyruğu ekleri, geleneksel marangozluğu çağdaş sanatla buluşturur.',
      },
      {
        subtitle: '03 / Mat Organik Yağ Bitişi',
        description: 'Solvent içermeyen doğal yağlarla korunan yüzey, ahşabın nefes almasını ve yıllar içinde asil bir patina kazanmasını sağlar.',
      },
    ],
  },
  'kyoto-konsol': {
    name: 'Kyoto Silindirik Konsol',
    category: 'Depolama & Konsol',
    summary: 'Yivli gövde ritmi ve monolitik mermer üst plakasıyla depolamayı heykelsi bir sanat nesnesine dönüştüren büfe.',
    description: 'Japon marangozluk estetiği ile Akdeniz mermerinin asaletini birleştiren Kyoto Konsol, 360 derece devam eden el oyması dikey ahşap çıtalarıyla ışık ve gölge oyunları kurgular. Monolitik mermer üst tabla, depolama mobilyasını anıtsal bir kaideye dönüştürür.',
    material: 'Koyu Füme Meşe, Emperador Doğal Mermer',
    dimensions: 'G: 220 cm × D: 50 cm × Y: 82 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Üst Tabla', value: 'Honlu Emperador Doğal Mermer' },
      { label: 'Gövde', value: 'Yivli Füme Masif Meşe' },
      { label: 'Mekanizma', value: 'Gizli bas-aç menteşe donanımı' },
    ],
    images: [
      {
        subtitle: '01 / Yivli Gövde & Işık-Gölge Ritmi',
        description: '360 derece devam eden el oyması dikey ahşap çıtalar, gün ışığı altında değişken bir derinlik ve tektonik ritim üretir.',
      },
      {
        subtitle: '02 / Doğal Damarlı Mermer Tabla',
        description: 'Hafifletilmiş kavisli gövdenin üzerine oturan monolitik mermer plaka, depolama mobilyasını anıtsal bir sergi kaidesine dönüştürür.',
      },
      {
        subtitle: '03 / Gizli Mekanizma & Yumuşak Kapanış',
        description: 'Dikişsiz panellerin ardına gizlenen dokunmatik açılır çekmece ve dolap mekanizmaları, saf minimalist formu korur.',
      },
    ],
  },
  'zenith-sideboard': {
    name: 'Kyoto Silindirik Konsol',
    category: 'Depolama & Konsol',
    summary: 'Yivli gövde ritmi ve monolitik mermer üst plakasıyla depolamayı heykelsi bir sanat nesnesine dönüştüren büfe.',
    description: 'Japon marangozluk estetiği ile Akdeniz mermerinin asaletini birleştiren Kyoto Konsol, 360 derece devam eden el oyması dikey ahşap çıtalarıyla ışık ve gölge oyunları kurgular.',
    material: 'Koyu Füme Meşe, Emperador Doğal Mermer',
    dimensions: 'G: 220 cm × D: 50 cm × Y: 82 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Üst Tabla', value: 'Honlu Emperador Doğal Mermer' },
      { label: 'Gövde', value: 'Yivli Füme Masif Meşe' },
    ],
    images: [
      {
        subtitle: '01 / Yivli Gövde & Işık-Gölge Ritmi',
        description: '360 derece devam eden el oyması dikey ahşap çıtalar, gün ışığı altında değişken bir derinlik ve tektonik ritim üretir.',
      },
      {
        subtitle: '02 / Doğal Damarlı Mermer Tabla',
        description: 'Hafifletilmiş kavisli gövdenin üzerine oturan monolitik mermer plaka, depolama mobilyasını anıtsal bir sergi kaidesine dönüştürür.',
      },
    ],
  },
  'stria-kitaplik': {
    name: 'Stria Mimari Kitaplık',
    category: 'Kütüphane & Sergileme',
    summary: 'Hafifletilmiş alüminyum dikey profiller ve masif raflarla şeffaf bir mekân bölücü niteliğinde kurgulanan kütüphane.',
    description: 'Mekânı fiziksel olarak ayırmadan görsel derinliği koruyan Stria Kitaplık, koleksiyon kitapları ve heykelsi sanat objeleri için hafifletilmiş bir sergi iskelesi oluşturur. Bronz eloksallı dikmeler ile masif ahşap rafların zanaatkar geçme detayları, dayanım ve zarafeti dengeler.',
    material: 'Bronz Eloksallı Alüminyum, Doğal Meşe Raflar',
    dimensions: 'G: 200 cm × D: 38 cm × Y: 210 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Dikmeler', value: 'Mimari Eloksallı Bronz Alüminyum Profil' },
      { label: 'Raflar', value: 'FSC Sertifikalı Masif Meşe' },
      { label: 'Modülerlik', value: 'Mekâna göre ayarlanabilir raf aralıkları' },
    ],
    images: [
      {
        subtitle: '01 / Şeffaf Bölücü & Mekânsal Katman',
        description: 'Mekânı bölmeden görsel akışı sürdüren açık strüktür, hem sanat objeleri hem de mimari literatür için zarif nişler sunar.',
      },
      {
        subtitle: '02 / Eloksallı Bronz & Masif Meşe',
        description: 'İnce et kalınlığına sahip mimari alüminyum dikmeler ile masif meşe rafların hassas geçme detayları, dayanım ve hafifliği birleştirir.',
      },
    ],
  },
  'alpina-kitaplik': {
    name: 'Stria Mimari Kitaplık',
    category: 'Kütüphane & Sergileme',
    summary: 'Hafifletilmiş alüminyum dikey profiller ve masif raflarla şeffaf bir mekân bölücü niteliğinde kurgulanan kütüphane.',
    description: 'Mekânı fiziksel olarak ayırmadan görsel derinliği koruyan Stria Kitaplık, koleksiyon kitapları ve heykelsi sanat objeleri için hafifletilmiş bir sergi iskelesi oluşturur.',
    material: 'Bronz Eloksallı Alüminyum, Doğal Meşe Raflar',
    dimensions: 'G: 200 cm × D: 38 cm × Y: 210 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Dikmeler', value: 'Mimari Eloksallı Bronz Alüminyum Profil' },
      { label: 'Raflar', value: 'FSC Sertifikalı Masif Meşe' },
    ],
    images: [
      {
        subtitle: '01 / Şeffaf Bölücü & Mekânsal Katman',
        description: 'Mekânı bölmeden görsel akışı sürdüren açık strüktür, hem sanat objeleri hem de mimari literatür için zarif nişler sunar.',
      },
      {
        subtitle: '02 / Eloksallı Bronz & Masif Meşe',
        description: 'İnce et kalınlığına sahip mimari alüminyum dikmeler ile masif meşe rafların hassas geçme detayları, dayanım ve hafifliği birleştirir.',
      },
    ],
  },
  'vaneern-konsol': {
    name: 'Vaneern Monolit Konsol',
    category: 'Konsol & Kaide',
    summary: 'Traverten doğal taşın gözenekli dokusu ve patinalı pirinç detaylarıyla mimari mekana derinlik katan heykelsi konsol.',
    description: 'Antik Akdeniz mimarisinin tektonik ağırlığından ilham alan Vaneern Konsol, honlu doğal traverten kütlelerin fırçalanmış antik pirinç kapaklarla kontrastını kutlar. Gizli taşıyıcı çelik çekirdek, taşın anıtsal ağırlığını havada süzülür gibi gösteren görsel bir hafiflik kazandırır.',
    material: 'Doğal Traverten Taşı, Antik Patinalı Pirinç',
    dimensions: 'G: 250 cm × D: 40 cm × Y: 70 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Gövde', value: 'Seçme Blok Traverten Taş' },
      { label: 'Kapaklar', value: 'Antik Patinalı Fırçalanmış Pirinç' },
      { label: 'İç Strüktür', value: 'Gizli Taşıyıcı Çelik Konstrüksiyon' },
    ],
    images: [
      {
        subtitle: '01 / Traverten Taş & Antik Pirinç',
        description: 'Gözenekli doğal traverten kütlelerin patinalı pirinç kapaklarla kontrastı, antik Akdeniz mimarisine saygı duruşunda bulunur.',
      },
      {
        subtitle: '02 / Heykelsi Birleşim Aksamı',
        description: 'Kusursuz 45 derece gönye birleşimleri ve gizli taşıyıcı çelik iskelet, taşın ağırlığını görsel bir zarafetle taşır.',
      },
    ],
  },
  'moni-sehpa': {
    name: 'Moni Doğal Taş Sehpa',
    category: 'Orta & Yan Sehpa',
    summary: 'Akışkan formları ve monolitik taş kütlesiyle oturma alanında organik bir ağırlık merkezi oluşturan heykelsi sehpa.',
    description: 'Doğal mermer bloklarının eksenel oyulmasıyla üretilen Moni Sehpa, köşesiz akışkan formuyla mimari mekânda dolaşımı yumuşatır. Honlu mat yüzeyi, taşın milyonlarca yıllık jeolojik damar katmanlarını dokunsal bir deneyim olarak öne çıkarır.',
    material: 'Honlu Doğal Mermer Blok',
    dimensions: 'G: 120 cm × D: 80 cm × Y: 36 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Malzeme', value: 'Doğal Mermer Yekpare Blok' },
      { label: 'Yüzey', value: 'Honlu Mat Bitiş (Kadife Dokulu)' },
      { label: 'Üretim', value: 'El oyması zanaat üretimi' },
    ],
    images: [
      {
        subtitle: '01 / Organik Silüet & Masif Mermer',
        description: 'Akışkan kavislerle yontulan doğal mermer gövde, oturma hacminin merkezinde dingin bir heykelsi yerçekimi oluşturur.',
      },
      {
        subtitle: '02 / Honlu Mat Yüzey Dokusu',
        description: 'Işığı yansıtmadan emen kadifemsi honlu yüzey, doğal taşın milyonlarca yıllık jeolojik katmanlarını görünür kılar.',
      },
    ],
  },
  'duo-sehpa': {
    name: 'Duo Akışkan Orta Sehpa',
    category: 'Sehpa Grubu',
    summary: 'Farklı kotlarda birleşen masif ahşap ve doğal mermer hacimlerin harmonik diyaloğu.',
    description: 'İki farklı geometrinin iç içe geçmesiyle kurgulanan Duo Sehpa, kullanıcının kompozisyonu genişletip daraltabilmesine imkan tanır. Sıcak masif ahşabın dokunsal sıcaklığı ile mermerin serin tektoniği dengeli bir kontrast sunar.',
    material: 'Masif Amerikan Cevizi & Carrara Mermer',
    dimensions: 'Büyük: G 110 cm / Küçük: G 70 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Ahşap Hacim', value: 'FSC Sertifikalı Masif Amerikan Cevizi' },
      { label: 'Taş Hacim', value: 'Honlu Doğal Beyaz Carrara Mermer' },
    ],
    images: [
      {
        subtitle: '01 / İç İçe Geçen İkili Geometri',
        description: 'Farklı yüksekliklerdeki iki bağımsız formun birleşimi, kullanıcının ihtiyacına göre genişleyip daralabilen esnek bir kompozisyon yaratır.',
      },
      {
        subtitle: '02 / Ahşap & Mermer Diyaloğu',
        description: 'Sıcak masif ceviz tabla ile soğuk mermer kaidenin diyaloğu, materyal zıtlıkları üzerinden rafine bir uyum kurgular.',
      },
    ],
  },
  'sordo-kitaplik': {
    name: 'Sordo Heykelsi Kitaplık',
    category: 'Sergileme Ünitesi',
    summary: 'Bordo lake cila ve paslanmaz çelik modülleriyle mimari mekânda dikey bir heykel gibi yükselen sergi ünitesi.',
    description: 'Göz hizasındaki asimetrik nişleri ve yüksek parlaklıktaki derin bordo lake kaplamasıyla Sordo Kitaplık, nesneleri çerçeveleyen mimari bir kompozisyondur.',
    material: 'Özel Bordo Vernikli Lake, Paslanmaz Çelik Aksam',
    dimensions: 'G: 160 cm × D: 40 cm × Y: 180 cm',
    specs: [
      { label: 'Tasarım', value: 'Emre Meriç Atelier' },
      { label: 'Kaplama', value: 'Çok Katmanlı Bordo Piyano Lake' },
      { label: 'Strüktür', value: 'Fırçalanmış Paslanmaz Çelik' },
    ],
    images: [
      {
        subtitle: '01 / Dikey Ritim & Asimetrik Nişler',
        description: 'Farklı boyutlardaki açık kompartımanlar, sergilenen kitap ve heykellere özel gölge çerçeveleri sunar.',
      },
      {
        subtitle: '02 / Lake Cila & Metal Refleksiyonu',
        description: 'Derin bordo lake kaplamanın parlaklığı ile çelik profillerin mat pırıltısı mekânda çağdaş bir lüks algısı yaratır.',
      },
    ],
  },
};

const PRODUCT_DETAILS_MAP_EN: Record<string, {
  name: string;
  category: string;
  summary: string;
  description: string;
  material: string;
  dimensions: string;
  specs: ProductSpec[];
  images: Array<{ subtitle: string; description: string; title?: string }>;
}> = {
  'aura-sofa': {
    name: 'Aura Sculptural Sofa',
    category: 'Collector Edition / Living & Lounge',
    summary: 'A monumental modular sofa uniting fluid contours with tactile root veneer timber and artisanal leather.',
    description: 'Conceived by Emre Meriç Atelier for bespoke residential commissions, the Aura Sofa bridges sculptural root veneer casework with supple full-grain leather upholstery. Its generous lounging depth and hand-stitched tailoring create an unhurried, commanding anchor in contemporary spaces. Crafted to order in numbered editions.',
    material: 'Root Oak Veneer, Natural Aniline Leather',
    dimensions: 'W: 240 cm × D: 95 cm × H: 75 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Frame', value: 'Kiln-dried solid hardwood & steel core' },
      { label: 'Casework', value: 'Natural root oak marquetry' },
      { label: 'Upholstery', value: 'Hand-tailored aniline leather' },
      { label: 'Edition', value: 'Numbered limited series upon commission' },
    ],
    images: [
      {
        subtitle: '01 / Monolithic Mass & Fluid Contour',
        description: 'The seamless articulation of root veneer casework and hand-stitched leather forms a sculptural centerpiece in architectural volumes.',
      },
      {
        subtitle: '02 / Artisanal Joinery & Root Oak Grain',
        description: 'Organic grain patterns of wild root oak veneer render each handcrafted sofa unique, celebrating raw natural variations.',
      },
      {
        subtitle: '03 / Full-Grain Leather & Ergonomic Cushioning',
        description: 'Supple aniline upholstery backed by multi-density natural foams provides enduring tactile luxury and ergonomic poise.',
      },
      {
        subtitle: '04 / Spatial Balance & Low-Slung Profile',
        description: 'A grounded, low-slung silhouette establishes calm gravitational serenity in open-concept living interiors.',
      },
    ],
  },
  'passion-kanepe': {
    name: 'Aura Sculptural Sofa',
    category: 'Collector Edition / Living & Lounge',
    summary: 'A monumental modular sofa uniting fluid contours with tactile root veneer timber and artisanal leather.',
    description: 'Conceived by Emre Meriç Atelier for bespoke residential commissions, the Aura Sofa bridges sculptural root veneer casework with supple full-grain leather upholstery.',
    material: 'Root Oak Veneer, Natural Aniline Leather',
    dimensions: 'W: 240 cm × D: 95 cm × H: 75 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Frame', value: 'Kiln-dried solid hardwood & steel core' },
      { label: 'Casework', value: 'Natural root oak marquetry' },
      { label: 'Upholstery', value: 'Hand-tailored aniline leather' },
    ],
    images: [
      {
        subtitle: '01 / Monolithic Mass & Fluid Contour',
        description: 'The seamless articulation of root veneer casework and hand-stitched leather forms a sculptural centerpiece in architectural volumes.',
      },
      {
        subtitle: '02 / Artisanal Joinery & Root Oak Grain',
        description: 'Organic grain patterns of wild root oak veneer render each handcrafted sofa unique, celebrating raw natural variations.',
      },
      {
        subtitle: '03 / Full-Grain Leather & Ergonomic Cushioning',
        description: 'Supple aniline upholstery backed by multi-density natural foams provides enduring tactile luxury and ergonomic poise.',
      },
    ],
  },
  'glia-yemek-masasi': {
    name: 'Glia Solid Timber Table',
    category: 'Dining & Tables',
    summary: 'A tectonic dining table celebrating continuous American Walnut grain and monolithic architectural proportions.',
    description: 'Designed by Emre Meriç Atelier, the Glia Table honors the unbroken grain continuity of select American Walnut. Monolithic splayed legs and hand-patinated brass butterfly joints anchor formal dining with tactile warmth and structural clarity.',
    material: 'Solid American Walnut, Brushed Solid Brass',
    dimensions: 'W: 260 cm × D: 105 cm × H: 76 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Timber', value: 'FSC-Certified Solid American Walnut' },
      { label: 'Joinery', value: 'Hand-chiseled brushed brass dovetails' },
      { label: 'Finish', value: 'Organic zero-VOC matte natural oil' },
      { label: 'Customization', value: 'Lengths available in 220 / 260 / 300 cm' },
    ],
    images: [
      {
        subtitle: '01 / Continuous Grain & Architectural Mass',
        description: 'Solid walnut slabs paired with monolithic angular legs demonstrate structural gravitas without visual encumbrance.',
      },
      {
        subtitle: '02 / Brass Dovetail & Hand Joinery',
        description: 'Brushed brass dovetail butterfly keys reinforce natural fissures while elevating traditional joinery into art.',
      },
      {
        subtitle: '03 / Organic Matte Oil Patina',
        description: 'Treated with zero-VOC natural oils, the timber breathes freely and deepens its noble patina over generations.',
      },
    ],
  },
  'glia-masa': {
    name: 'Glia Solid Timber Table',
    category: 'Dining & Tables',
    summary: 'A tectonic dining table celebrating continuous American Walnut grain and monolithic architectural proportions.',
    description: 'Designed by Emre Meriç Atelier, the Glia Table honors the unbroken grain continuity of select American Walnut.',
    material: 'Solid American Walnut, Brushed Solid Brass',
    dimensions: 'W: 260 cm × D: 105 cm × H: 76 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Timber', value: 'FSC-Certified Solid American Walnut' },
    ],
    images: [
      {
        subtitle: '01 / Continuous Grain & Architectural Mass',
        description: 'Solid walnut slabs paired with monolithic angular legs demonstrate structural gravitas without visual encumbrance.',
      },
      {
        subtitle: '02 / Brass Dovetail & Hand Joinery',
        description: 'Brushed brass dovetail butterfly keys reinforce natural fissures while elevating traditional joinery into art.',
      },
    ],
  },
  'kyoto-konsol': {
    name: 'Kyoto Fluted Credenza',
    category: 'Storage & Credenza',
    summary: 'A sculptural fluted credenza crowned by a honed marble slab, celebrating the dialogue between shadow and light.',
    description: 'Fusing Japanese woodcraft principles with Mediterranean marble textures, the Kyoto Credenza features 360-degree hand-fluted solid timber that produces dynamic shadowplay throughout the day.',
    material: 'Dark Smoked Oak, Honed Natural Marble',
    dimensions: 'W: 220 cm × D: 50 cm × H: 82 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Countertop', value: 'Honed natural marble slab' },
      { label: 'Casework', value: 'Continuous fluted smoked oak' },
      { label: 'Hardware', value: 'Concealed push-to-open German fittings' },
    ],
    images: [
      {
        subtitle: '01 / Fluted Rhythm & Light Modulation',
        description: 'Continuous vertical timber fluting creates delicate micro-shadows that shift with sunlight throughout the day.',
      },
      {
        subtitle: '02 / Honed Natural Marble Surface',
        description: 'A monolithic marble slab caps the credenza, turning functional storage into an architectural plinth.',
      },
      {
        subtitle: '03 / Concealed Seamless Mechanisms',
        description: 'Push-latch acoustic hardware hides effortlessly behind uninterrupted timber slats to preserve pure form.',
      },
    ],
  },
  'zenith-sideboard': {
    name: 'Kyoto Fluted Credenza',
    category: 'Storage & Credenza',
    summary: 'A sculptural fluted credenza crowned by a honed marble slab, celebrating the dialogue between shadow and light.',
    description: 'Fusing Japanese woodcraft principles with Mediterranean marble textures, the Kyoto Credenza features 360-degree hand-fluted solid timber.',
    material: 'Dark Smoked Oak, Honed Natural Marble',
    dimensions: 'W: 220 cm × D: 50 cm × H: 82 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Countertop', value: 'Honed natural marble slab' },
    ],
    images: [
      {
        subtitle: '01 / Fluted Rhythm & Light Modulation',
        description: 'Continuous vertical timber fluting creates delicate micro-shadows that shift with sunlight throughout the day.',
      },
      {
        subtitle: '02 / Honed Natural Marble Surface',
        description: 'A monolithic marble slab caps the credenza, turning functional storage into an architectural plinth.',
      },
    ],
  },
  'vaneern-konsol': {
    name: 'Vaneern Monolith Credenza',
    category: 'Credenza & Plinth',
    summary: 'A monolithic travertine statement pairing porous geological stone with patinated brass panels.',
    description: 'Drawing inspiration from archaic Mediterranean temples, the Vaneern Credenza pairs pitted Roman travertine slabs with brushed antique brass doors.',
    material: 'Natural Roman Travertine, Antique Patinated Brass',
    dimensions: 'W: 250 cm × D: 40 cm × H: 70 cm',
    specs: [
      { label: 'Design', value: 'Emre Meriç Atelier' },
      { label: 'Stone', value: 'Honed open-pore Roman travertine' },
      { label: 'Fronts', value: 'Hand-patinated antique brass sheets' },
    ],
    images: [
      {
        subtitle: '01 / Roman Travertine & Patinated Brass',
        description: 'The textural dialogue between porous stone and hand-rubbed brass pays homage to classical antiquity.',
      },
      {
        subtitle: '02 / Mitred Joinery & Concealed Core',
        description: 'Precise 45-degree stone mitres and a hidden steel armature give the heavy travertine an effortless visual float.',
      },
    ],
  },
};

/**
 * Strips residual raw HTML and legacy contact info.
 */
export function cleanProductText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/FEINE\s*(tarafından tasarlanmıştır|tarafından tasarlandı)?/gi, 'Emre Meriç Atelier')
    .replace(/Designed by FEINE\.?/gi, 'Designed by Emre Meriç Atelier.')
    .replace(/Passion\s*(Sofa|Kanepe)/gi, 'Aura Heykelsi Kanepe')
    .replace(/Glia\s*(Masa|Table)/gi, 'Glia Masif Ahşap Masa')
    .replace(/Zenith\s*(Sideboard|Konsol)/gi, 'Kyoto Silindirik Konsol')
    .replace(/Alpina\s*(Kitaplık|Bookshelf)/gi, 'Stria Mimari Kitaplık')
    .replace(/Vaneern\b/gi, 'Vaneern Monolit Konsol')
    .replace(/Moni\s*(Sehpa|Table)/gi, 'Moni Doğal Taş Sehpa')
    .replace(/Roche\s*Masa/gi, 'Roche Mimari Masa')
    .replace(/Javen\s*Koltuk/gi, 'Komorebi Berjer')
    .replace(/Loop\s*Kitaplık/gi, 'Sordo Heykelsi Kitaplık')
    .replace(/info@feine\.com\.tr/gi, 'studio@emremeric.com')
    .replace(/info@Emre Meriç Atelier\.com\.tr/gi, 'studio@emremeric.com')
    .replace(/0850\s*220\s*91\s*50/gi, '+90 (212) 287 40 00')
    .replace(/\+90\s*850\s*220\s*91\s*50/gi, '+90 (212) 287 40 00')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Returns enriched product info with custom per-photo subtitles and descriptions.
 */
export function enrichProductData(
  slug: string,
  rawName: string,
  rawCategory: string,
  rawSummary: string,
  rawDescription: string,
  rawMaterial: string,
  rawDimensions: string,
  imageUrls: string[],
  locale: Locale
): EnrichedProductInfo {
  const normSlug = slug.toLowerCase().trim();
  const map = locale === 'tr' ? PRODUCT_DETAILS_MAP_TR : PRODUCT_DETAILS_MAP_EN;
  const match = map[normSlug] || Object.entries(map).find(([k]) => normSlug.includes(k))?.[1];

  const name = match ? match.name : cleanProductText(rawName);
  const category = match ? match.category : (locale === 'tr' ? 'Özel Koleksiyon / Mobilya' : 'Bespoke Collection / Furniture');
  const summary = match ? match.summary : cleanProductText(rawSummary);
  const description = match ? match.description : cleanProductText(rawDescription);
  const material = match ? match.material : cleanProductText(rawMaterial);
  const dimensions = match ? match.dimensions : rawDimensions;
  const specs = match && match.specs.length > 0 ? match.specs : [
    { label: locale === 'tr' ? 'Tasarım' : 'Design', value: 'Emre Meriç Atelier' },
    { label: locale === 'tr' ? 'Malzeme' : 'Material', value: material || (locale === 'tr' ? 'Doğal Malzemeler' : 'Natural Materials') },
    { label: locale === 'tr' ? 'Ölçüler' : 'Dimensions', value: dimensions || (locale === 'tr' ? 'Özel Ölçü Üretim' : 'Custom Dimensions') },
    { label: locale === 'tr' ? 'Üretim' : 'Craft', value: locale === 'tr' ? 'Sipariş üzerine el işçiliği' : 'Handcrafted upon commission' },
  ];

  // Procedural subtitles and narratives for each photo in the gallery
  const defaultSubtitlesTR = [
    'Monolitik Kütle & Genel Form',
    'Zanaat Marangozluğu & Ahşap Detayı',
    'Masif Doğal Taş & Birleşim Detayı',
    'Işık, Gölge & Mekânsal Denge',
    'Dokusal Katmanlar & Patina',
    'El Dikişi & Ergonomik Hacim',
    'Atölye Mührü & Detay Perspektifi',
  ];

  const defaultSubtitlesEN = [
    'Monolithic Form & General Silhouette',
    'Artisanal Joinery & Timber Grain',
    'Solid Stone & Tactile Intersection',
    'Light, Shadow & Spatial Balance',
    'Material Layers & Natural Patina',
    'Hand Tailoring & Ergonomic Volume',
    'Atelier Craft & Detail Perspective',
  ];

  const defaultNarrativesTR = [
    'Emre Meriç Atelier tarafından mimari mekana heykelsi bir kimlik kazandırmak amacıyla yekpare kütle dengesiyle şekillendirildi.',
    'Doğal malzemenin kendine has damar akışı ve zanaatkar marangozluk geçmeleri, her parçayı tekil bir sanat nesnesine dönüştürür.',
    'Monolitik birleşim noktaları ve gönye geçmeler, malzemenin ağırlığını görsel bir zarafet ve hafiflikle taşır.',
    'Günün farklı saatlerinde değişen doğal ışık açıları, formun girinti ve çıkıntılarında dingin gölge oyunları yaratır.',
    'Solvent içermeyen organik koruyucu bitişler, dokunun nefes almasını ve zamanla zenginleşen asil bir patina kazanmasını sağlar.',
  ];

  const defaultNarrativesEN = [
    'Sculpted with monolithic balance by Emre Meriç Atelier to introduce a serene, commanding presence into contemporary interiors.',
    'Natural grain variations and master joinery celebrate the organic integrity of noble materials, making each piece unique.',
    'Tectonic mitre joints and subtle shadow reveals elevate functional support into an expression of architectural refinement.',
    'Shifting daylight across surfaces articulates contours through a quiet interplay of light and soft ambient shadows.',
    'Protected with organic breathable finishes that allow the texture to mature gracefully with age and noble patina.',
  ];

  // Ensure every product has multi-angle gallery perspectives for the interactive slider
  const CURATED_PRODUCT_GALLERIES: Record<string, string[]> = {
    'aura-sofa': [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=85',
    ],
    'passion-sofa': [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=85',
    ],
    'passion-kanepe': [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=85',
    ],
    'glia-yemek-masasi': [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=85',
    ],
    'forma-yemek-masasi': [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=85',
    ],
    'kyoto-konsol': [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
    ],
    'lumen-bufe': [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
    ],
    'stria-kitaplik': [
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1400&q=85',
    ],
    'alpina-kitaplik': [
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1400&q=85',
    ],
    'vaneern-konsol': [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    ],
    'moni-sehpa': [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
    ],
    'roche-masa': [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
    ],
  };

  const finalUrls = [...imageUrls];
  const galleryExtra =
    CURATED_PRODUCT_GALLERIES[normSlug] ||
    Object.entries(CURATED_PRODUCT_GALLERIES).find(([k]) => normSlug.includes(k))?.[1] || [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
    ];

  galleryExtra.forEach((extra) => {
    if (!finalUrls.includes(extra)) finalUrls.push(extra);
  });

  const subList = locale === 'tr' ? defaultSubtitlesTR : defaultSubtitlesEN;
  const narrList = locale === 'tr' ? defaultNarrativesTR : defaultNarrativesEN;

  const images: EnrichedProductImageDetail[] = finalUrls.map((url, i) => {
    if (match && match.images && match.images[i]) {
      return {
        url,
        title: name,
        subtitle: match.images[i].subtitle,
        description: match.images[i].description,
      };
    }

    const numStr = String(i + 1).padStart(2, '0');
    const sub = subList[i % subList.length];
    const desc = narrList[i % narrList.length];

    return {
      url,
      title: name,
      subtitle: `${numStr} / ${sub}`,
      description: desc,
    };
  });

  return {
    name,
    category,
    summary,
    description,
    material,
    dimensions,
    specs,
    images,
  };
}
