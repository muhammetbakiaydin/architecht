# EMRE MERİÇ — stüdyo sitesi

Next.js 15 (App Router) · TypeScript · Tailwind · GSAP · three.js / React Three Fiber · next-intl · Supabase (opsiyonel)

---

## Hızlı başlangıç

```bash
npm install
npm run dev
```

`http://localhost:3000/tr` → site, `http://localhost:3000/admin` → yönetim paneli.

**Supabase gerekmez.** Bağlantı bilgisi yoksa site `src/content/seed` içindeki hazır
içerikle çalışır, panel de aynı içeriği salt okunur gösterir.

---

## Sayfalar

| Dahili yol | Türkçe | İngilizce | Ne yapar |
| --- | --- | --- | --- |
| `/` | `/tr` | `/en` | WebGPU açılış, kaydırmalı ızgara, stüdyo, yaklaşım, öne çıkanlar |
| `/projects` | `/tr/projeler` | `/en/projects` | Codrops "Infinite Scroll" arşivi (tam ekran) |
| `/projects/[slug]` | `/tr/projeler/...` | `/en/projects/...` | Proje künyesi + fotoğraflar |
| `/products` | `/tr/urunler` | `/en/products` | Kategori filtreli ürün listesi |
| `/products/[slug]` | `/tr/urunler/...` | `/en/products/...` | Ürün detayı, teknik tablo (fiyat gösterilmez) |
| `/gallery` | `/tr/galeri` | `/en/gallery` | Codrops "Infinite Canvas" sonsuz 3B tuval |
| `/about` | `/tr/hakkimizda` | `/en/about` | Hikâye, ilkeler, kilometre taşları, ekip, ödüller |
| `/blog` | `/tr/blog` | `/en/blog` | Etiket filtreli yazı listesi |
| `/blog/[slug]` | `/tr/blog/...` | `/en/blog/...` | Markdown yazı |
| `/contact` | `/tr/iletisim` | `/en/contact` | İletişim bilgileri + form |
| — | `/admin` | — | Yönetim paneli (tek dil: Türkçe) |

URL çevirileri `src/i18n/routing.ts` içindeki `pathnames` tablosundan gelir. Bağlantı
kurarken **her zaman** `@/i18n/navigation` içindeki `Link` kullanılır; dahili yol
(`/products`) verilir, doğru yerelleştirilmiş adres (`/tr/urunler`) kendiliğinden üretilir.

---

## Mimari

```
src/
  app/
    layout.tsx            Boş kök layout — <html> RENDER ETMEZ (aşağıya bakın)
    [locale]/             Herkese açık site (next-intl sağlayıcısı, <html lang>)
    admin/                Yönetim paneli (ayrı <html lang="tr">, karanlık tema)
  components/
    infinite-scroll/      Codrops arşiv motoru (Slider, Reveal, Transition)
    infinite-canvas/      Codrops sonsuz 3B tuval (R3F sahnesi, doku yöneticisi)
    admin/                Panel araç takımı: şema → form → kayıt
    site/                 Üst bar, alt bilgi, sayfa başlıkları
  content/seed/           Supabase yokken kullanılan hazır içerik
  lib/
    content/              Sayfaların okuduğu tek veri katmanı (Supabase → seed)
    supabase/             İstemciler, şema tipleri, ortam algılama
    admin/                Panelin seed geri dönüşü
  i18n/                   routing / navigation / request
messages/                 tr.json, en.json
supabase/schema.sql       Tablolar, RLS politikaları, storage kovası
```

**Kök layout neden boş?** İki dal farklı `<html>` istiyor: yerelleştirilmiş site
(`lang="tr"` / `lang="en"` + next-intl) ve tek dilli panel. Next bir kök layout
zorunlu kıldığı için `src/app/layout.tsx` yalnızca `children` döndürür; belge
iskeletini `[locale]/layout.tsx` ve `admin/layout.tsx` kurar.

### Veri katmanı

Sayfalar yalnızca `src/lib/content` ile konuşur. Her fonksiyon önce Supabase'i dener,
bağlantı yoksa veya sorgu hata verirse hazır içeriğe düşer — yani yarım kurulmuş bir
veritabanı bile siteyi düşürmez. Dönen değerler tek dile indirgenmiştir: bileşenler
`title_tr` / `title_en` çiftlerini hiç görmez.

---

## Supabase kurulumu (isteğe bağlı, sonradan)

1. [supabase.com](https://supabase.com) üzerinde proje açın.
2. SQL editöründe `supabase/schema.sql` dosyasını çalıştırın. Bu; tabloları, RLS
   politikalarını ve `media` adlı public storage kovasını oluşturur.
3. `.env.example` → `.env.local` kopyalayın, Settings → API altındaki değerleri girin:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. Authentication → Users altından kullanıcınızı ekleyin, sonra SQL editöründe:

   ```sql
   update public.profiles set role = 'admin' where email = 'siz@ornek.com';
   ```

   Yeni kullanıcılar `viewer` olarak açılır; yazma yetkisi `editor` ve `admin`
   rollerindedir (`public.is_staff()`).

5. `npm run dev` yeniden başlatın. Panel artık giriş ister ve veritabanına yazar.

Tablolar boş kaldığı sürece site hazır içeriği göstermeye devam eder; içerik
eklendikçe otomatik olarak veritabanına geçer.

### Güvenlik modeli

- Anonim okuyucular yalnızca `is_published` / `is_visible` satırlarını görür.
- `contact_messages` tam tersi: herkes yazabilir, yalnızca yetkili personel okur.
- Storage `media` kovası herkese açık okunur, yazma yetkili personele kapalıdır.
- Panel `/admin` altındadır ve locale ara katmanının dışında tutulmuştur
  (`src/middleware.ts` matcher'ı `admin` ile başlayan yolları atlar).

---

## Yönetim paneli

| Bölüm | Neyi yönetir |
| --- | --- |
| Site Ayarları | Marka, iletişim, sosyal bağlantılar, SEO |
| Ana Sayfa / Hakkımızda / İletişim / liste sayfaları | `content_blocks` — her bölümün başlığı, metni, görseli, butonu ve yapılandırılmış verisi |
| Projeler | Proje kaydı + proje fotoğrafları (alt tablo) |
| Ürünler | Ürün kaydı + ek görseller, malzeme ve teknik tablo (fiyat alanı yok) |
| Galeri Görselleri | Sonsuz tuvali besleyen görseller |
| Blog Yazıları | Markdown gövdeli yazılar, etiketler, yayın tarihi |
| Ekip / Ödüller | Hakkımızda sayfasının alt bölümleri |
| Mesajlar | İletişim formu kutusu |

Formlar `src/components/admin/schemas.ts` içindeki şemalardan üretilir. Yeni bir alan
eklemek için önce SQL'e kolonu, sonra `src/lib/supabase/types.ts` içine tipini, sonra
ilgili şemaya bir satır eklemek yeterli — form kendiliğinden oluşur.

`i18n: true` işaretli alanlar `_tr` ve `_en` olmak üzere iki kolona yazar ve panelde
yan yana iki kutu olarak görünür.

---

## Performans notları

Sitedeki yavaşlığın büyük bölümü görsellerden geliyordu: kaynak fotoğraflar
1024 piksel, ekranda ise 150–350 piksel olarak çiziliyordu. Bu nedenle:

- Tüm içerik görselleri `next/image` üzerinden geçiyor ve her yerleşim kendi
  `sizes` değerini bildiriyor. Ana sayfanın ilk ekranı ~720 KB yerine **~37 KB**,
  arşiv sayfası ~700 KB yerine **~68 KB** görsel indiriyor; çözülmüş bitmap
  belleği de aynı oranda düşüyor. AVIF/WebP `next.config.mjs` içinde açık.
- Syne değişken fontu `.woff2` olarak sunuluyor (143 KB → 59 KB) ve
  `[locale]/layout.tsx` içinde `preload` ediliyor.
- Hero'nun WebGPU katmanı, yazı tamamen dağıldıktan sonra (`progress ≥ 0.995`)
  `visibility: hidden` yapılıyor. Önceden sayfanın kalan ~12 000 pikseli boyunca
  tam ekran şeffaf bir katman olarak derlenmeye devam ediyordu.
- Hero'nun kaydırma dinleyicisi artık her karede `getBoundingClientRect()`
  çağırmıyor; ölçüm yalnızca yerleşim değiştiğinde yapılıyor.
- Arşivin paralaks döngüsü önce tüm ölçümleri alıp sonra tüm dönüşümleri
  yazıyor. Eskiden ölç-yaz-ölç-yaz sırası, saniyede 60 kare boyunca kare başına
  12 zorunlu yerleşim hesabı yaptırıyordu — arşivin "ağır" hissettirmesinin ana
  sebebi buydu.
- Ne arşiv ne de ana sayfadaki ızgara artık görsellerin yüklenmesini bekliyor.
  Her iki yerleşim de tamamen CSS ile belirlendiği için ölçüm görselden bağımsız;
  yalnızca fontlar bekleniyor (en fazla 1,2 sn).

## Bilinen sınırlar / notlar

- `public/infinite-scroll` ve `public/projects` altındaki fotoğraflar Codrops demo
  setidir; `src/content/seed` içindeki metinler de yer tutucudur. İkisi de panelden
  değiştirilmek üzere konuldu.
- Ana sayfadaki WebGPU sahnesi WebGPU destekleyen tarayıcı ister; desteklemeyen
  tarayıcıda sayfanın geri kalanı normal çalışır.
- Sonsuz tuval ve arşiv sayfaları kendi kaydırmalarını yönetir: mount olduklarında
  `document.body` kaydırması kilitlenir, ayrıldıklarında geri açılır.
- Arşivin açılır görünümü telefonda yeniden diziliyor (görsel üstte, metin
  altta). Kırılım noktası ve `--img-scale` / `--stagger-scale` katsayıları
  `infiniteScroll.css` dosyasının sonundaki medya sorgusunda.
- Hero'nun dağılma efektinin son bölümü `msdfText.ts` içindeki `uTailStart` /
  `uTailEnd` ile kapanıyor (0.72 → 0.90). Bu iki sayıdan önce hiçbir şey
  değişmez; efektin daha uzun sürmesini isterseniz aralığı genişletin.
