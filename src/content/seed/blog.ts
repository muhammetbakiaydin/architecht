import type { SeedBlogPost } from './types';

/**
 * PLACEHOLDER WRITING — replace from the admin panel (Blog).
 * Bodies are Markdown; see `src/lib/markdown.ts` for the supported subset
 * (headings, paragraphs, lists, blockquotes, bold/italic, links, hr).
 */
export const SEED_BLOG_POSTS: SeedBlogPost[] = [
  {
    id: 'seed-post-01',
    slug: 'derzin-anlami',
    title_tr: 'Derzin Anlamı',
    title_en: 'What a Joint Means',
    excerpt_tr:
      'İki malzemenin buluştuğu yer, bir yapının en dürüst noktasıdır. Derz gizlenebilir, ama asla yok edilemez.',
    excerpt_en:
      'Where two materials meet is the most honest point in a building. A joint can be hidden, but never abolished.',
    body_tr: `## Gizlemek ya da göstermek

Bir yapının nasıl yapıldığını anlamak isterseniz, önce derzlere bakın. Taşın taşla, ahşabın metalle, sıvanın camla buluştuğu her yer bir karardır: ya bu buluşmayı göstereceksiniz ya da örtmeye çalışacaksınız.

Örtmek her zaman daha pahalıdır. Silikon, fuga, alüminyum kapama profili — hepsi zamanla sararır, çatlar, ayrılır. Gösterilen bir derz ise yaşlanmaz; sadece koyulaşır.

## Üç kural

1. **Derz, iki malzemenin toleransını taşır.** Genleşme payını hesaplamadan çizilen bir birleşim, birinci kıştan çıkamaz.
2. **Derz hizalanmalıdır.** Bir odadaki bütün derzler aynı hatta düşmüyorsa, o oda hiçbir zaman sakin görünmez.
3. **Derzin genişliği keyfî değildir.** Malzemenin kalınlığının onda biri iyi bir başlangıç noktasıdır.

> Bir detayın iyi olup olmadığını anlamanın en hızlı yolu, onu on yıl sonra hayal etmektir.

## Şantiyede

Çizimde üç milimetre olan derz, şantiyede beş milimetre olur. Bunu bir başarısızlık olarak görmek yerine, baştan beş çizmek daha dürüst bir yaklaşım. Ustanın elinin payını hesaba katmayan detay, detay değil temennidir.`,
    body_en: `## Hide it or show it

If you want to understand how a building was made, look at the joints first. Every place stone meets stone, timber meets metal, plaster meets glass is a decision: you either show that meeting or you try to cover it.

Covering always costs more. Silicone, filler, aluminium trim — all of it yellows, cracks and separates with time. A joint left visible does not age; it only darkens.

## Three rules

1. **A joint carries the tolerance of both materials.** A junction drawn without an expansion allowance will not survive its first winter.
2. **Joints must align.** If every joint in a room does not fall on the same line, that room will never look calm.
3. **Joint width is not arbitrary.** A tenth of the material thickness is a good place to start.

> The fastest way to know whether a detail is good is to imagine it ten years from now.

## On site

A joint drawn at three millimetres becomes five on site. Rather than treating that as failure, it is more honest to draw five from the outset. A detail that ignores the craftsman's hand is not a detail but a wish.`,
    cover_url: '/infinite-scroll/18.webp',
    tags: ['detay', 'malzeme'],
    author: 'EMRE MERİÇ',
    published_at: '2026-08-18T09:00:00.000Z',
    is_published: true,
  },
  {
    id: 'seed-post-02',
    slug: 'kuzey-isigi-neden',
    title_tr: 'Neden Hep Kuzey Işığı?',
    title_en: 'Why Always North Light?',
    excerpt_tr:
      'Ressamların yüzyıllardır bildiği şeyi mimarlık geç öğrendi: değişmeyen ışık, çalışılabilir ışıktır.',
    excerpt_en:
      'Architecture learned late what painters have known for centuries: light that does not change is light you can work in.',
    body_tr: `Kuzeye bakan bir pencereden giren ışık gün boyunca neredeyse hiç renk değiştirmez. Doğrudan güneş almaz, gölge üretmez, kontrast yaratmaz. Bir atölyede istediğiniz tam olarak budur.

## Ama her mekân atölye değildir

Kuzey ışığının tek sorunu, zamanı göstermemesi. Saat onda ne ise, saat dörtte de odur. Yaşama mekânlarında bu bir kayıptır: insanlar günün ilerlediğini duvarlarındaki gölgeden anlar.

Bu yüzden bir evde kuzey ışığını tek başına kullanmayız. Çalışma alanı kuzeye, oturma alanı batıya bakar. Biri işi mümkün kılar, diğeri günün geçtiğini hatırlatır.

## Pratik bir not

Kuzey penceresinin önüne asla ağaç dikmeyin. Kuzey ışığının zaten az olan şiddetini yaprak mevsimine bağlamak, yılın yarısını karanlıkta geçirmek demektir.`,
    body_en: `Light entering from a north-facing window barely shifts colour across the day. No direct sun, no shadows, no contrast. In a workshop that is exactly what you want.

## But not every room is a workshop

North light's only fault is that it does not tell the time. What it is at ten it still is at four. In living spaces this is a loss: people read the passing of the day off their own walls.

So we never use north light alone in a house. The work area faces north, the sitting area west. One makes the work possible; the other reminds you the day is going.

## A practical note

Never plant a tree in front of a north window. Tying the already-weak intensity of north light to a leaf season means spending half the year in the dark.`,
    cover_url: '/infinite-scroll/24.webp',
    tags: ['ışık', 'tasarım'],
    author: 'EMRE MERİÇ',
    published_at: '2026-07-02T09:00:00.000Z',
    is_published: true,
  },
  {
    id: 'seed-post-03',
    slug: 'yikmadan-once',
    title_tr: 'Yıkmadan Önce',
    title_en: 'Before You Demolish',
    excerpt_tr:
      'Bir yapının karbon bedelinin büyük kısmı zaten ödenmiştir. Yeniden başlamak, ödemeyi ikinci kez yapmaktır.',
    excerpt_en:
      'Most of a building’s carbon cost has already been paid. Starting over means paying it a second time.',
    body_tr: `Mevcut bir yapıyı yıkıp yerine yenisini yapmak, çoğu zaman yenilemekten daha ucuz görünür. Bu hesabın içinde olmayan şey, yapının zaten harcanmış enerjisi: çıkarılmış taş, pişirilmiş tuğla, dökülmüş beton.

## Karar sırası

Bir yapıyla karşılaştığımızda sırasıyla şunu soruyoruz:

- Taşıyıcı sağlam mı? Sağlamsa kalır.
- Kat yükseklikleri bugünün kullanımına yetiyor mu?
- Cephe, yalıtım eklenerek kurtarılabilir mi?
- Döşeme deliklerini yeni tesisat için kullanabilir miyiz?

Dördüne de "hayır" diyebildiğimiz proje sayısı, on yılda ikiyi geçmedi.

## Yenilemenin zorluğu

Yenileme daha ucuz değildir — daha zordur. Sürprizler şantiyede çıkar, bütçe kalemleri kayar, ustanın işi artar. Ama ortaya çıkan yapı, hiç var olmamış bir şeyin taklidi olmak yerine, kendi geçmişini taşır.`,
    body_en: `Tearing a building down and starting again usually looks cheaper than retrofitting it. What that sum leaves out is the energy already spent: the stone quarried, the brick fired, the concrete poured.

## The order of questions

Facing an existing building, we ask in this order:

- Is the structure sound? If so, it stays.
- Do the floor-to-floor heights serve today's use?
- Can the facade be saved by adding insulation?
- Can the existing slab penetrations take the new services?

The number of projects where we could answer "no" four times has not passed two in ten years.

## The difficulty of retrofit

Retrofit is not cheaper — it is harder. Surprises surface on site, budget lines drift, the trades work more. But the building that results carries its own past instead of imitating something that never existed.`,
    cover_url: '/infinite-scroll/15.webp',
    tags: ['yenileme', 'sürdürülebilirlik'],
    author: 'EMRE MERİÇ',
    published_at: '2026-05-21T09:00:00.000Z',
    is_published: true,
  },
  {
    id: 'seed-post-04',
    slug: 'az-malzeme-cok-karar',
    title_tr: 'Az Malzeme, Çok Karar',
    title_en: 'Few Materials, Many Decisions',
    excerpt_tr:
      'Bir projede üç malzemeyle sınırlı kalmak, seçenekleri azaltmaz — kararları derinleştirir.',
    excerpt_en:
      'Limiting a project to three materials does not reduce your options; it deepens your decisions.',
    body_tr: `Malzeme listesi kısaldıkça, her birinin nasıl kullanıldığı önem kazanır. Aynı taşı zeminde, duvarda ve tezgâhta kullanmak, üç farklı yüzey işlemi, üç farklı kalınlık ve üç farklı derz düşünmeyi gerektirir.

## Kısıt bir araçtır

Kıyı Evi'nde üç malzeme vardı: kireç taşı, beyazlatılmış çam, mikro beton. Bu kısıt, projeyi fakirleştirmedi; tam tersine, her odanın farkını renkle değil, ışıkla ve boyutla ifade etmeye zorladı.

> Seçim özgürlüğü, tasarımın değil, satın almanın konusudur.

## Uygulamada

Üç malzemeyle çalışırken tedarik de basitleşir. Tek bir ocaktan taş gelir, tek bir marangozla çalışılır, tek bir beton reçetesi kullanılır. Şantiye süresi kısalır, hata payı düşer.`,
    body_en: `As the material list shortens, how each one is used starts to matter. Using the same stone on the floor, the wall and the counter means thinking through three surface treatments, three thicknesses and three joints.

## Constraint is a tool

Shore House had three materials: limestone, bleached pine, micro concrete. The constraint did not impoverish the project; it forced every room to state its difference through light and dimension rather than colour.

> Freedom of choice is a procurement subject, not a design one.

## In practice

Working with three materials simplifies supply too. Stone comes from one quarry, one joiner does the work, one concrete mix is used. The programme shortens and the margin for error drops.`,
    cover_url: '/infinite-scroll/19.webp',
    tags: ['malzeme', 'yöntem'],
    author: 'EMRE MERİÇ',
    published_at: '2026-03-14T09:00:00.000Z',
    is_published: true,
  },
  {
    id: 'seed-post-05',
    slug: 'kesit-once-plan-sonra',
    title_tr: 'Önce Kesit, Sonra Plan',
    title_en: 'Section First, Plan Later',
    excerpt_tr:
      'Plan bir organizasyon şemasıdır; kesit ise mekânın kendisidir. İkisinden biriyle başlamak zorundaysanız, kesitle başlayın.',
    excerpt_en:
      'A plan is an organisation chart; a section is the space itself. If you must begin with one, begin with the section.',
    body_tr: `Planla başlayan projeler verimli olur. Kesitle başlayanlar ise hatırlanır.

## Neden

Plan, metrekareyi böler. Kesit, yüksekliği, ışığı, manzarayı ve akustiği aynı anda kurar. Bir odanın nasıl hissettirdiğini belirleyen şey, yan yana kaç metrekare olduğu değil, tavanının nerede olduğudur.

## Bir örnek

Yaşayan Sırt'ta beş stüdyo için tek bir kesit çizdik ve beş kez tekrarladık. Plan neredeyse kendiliğinden ortaya çıktı. Eğer plandan başlasaydık, eğimli arazide her stüdyo ayrı bir problem olurdu.

## Pratik öneri

İlk toplantıya planla gitmeyin. Elle çizilmiş tek bir kesit, otuz sayfalık sunumdan daha çok şey anlatır.`,
    body_en: `Projects that begin with a plan turn out efficient. Projects that begin with a section are remembered.

## Why

A plan divides square metres. A section sets height, light, view and acoustics at once. What decides how a room feels is not how many square metres sit beside it but where its ceiling is.

## An example

At the Living Ridge we drew one section for five studios and repeated it five times. The plan more or less appeared by itself. Had we started from the plan, every studio on that slope would have been its own problem.

## A practical suggestion

Do not walk into the first meeting with a plan. One section drawn by hand says more than a thirty-page deck.`,
    cover_url: '/infinite-scroll/21.webp',
    tags: ['yöntem', 'çizim'],
    author: 'EMRE MERİÇ',
    published_at: '2026-01-09T09:00:00.000Z',
    is_published: true,
  },
  {
    id: 'seed-post-06',
    slug: 'sessizlik-nasil-tasarlanir',
    title_tr: 'Sessizlik Nasıl Tasarlanır?',
    title_en: 'How to Design Silence',
    excerpt_tr:
      'Sessizlik, sesin yokluğu değil; doğru sesin duyulabilmesidir. Bu da bir malzeme meselesi kadar bir plan meselesidir.',
    excerpt_en:
      'Silence is not the absence of sound but the ability to hear the right one — as much a matter of plan as of material.',
    body_tr: `Akustik danışmanı çağırmadan önce planınızı bir kez daha okuyun. Çoğu gürültü problemi, yanlış komşuluktan doğar: yatak odasının arkasındaki asansör kovası, mutfağın altındaki oturma odası.

## Üç adım

1. **Kaynağı uzaklaştırın.** En ucuz akustik çözüm mesafedir.
2. **Arada bir servis hacmi bırakın.** Dolap, koridor, banyo — hepsi tampon işlevi görür.
3. **Ancak bundan sonra malzeme düşünün.** Yalıtım, plan hatasını kapatmak için kullanıldığında hep yetersiz kalır.

## Gelecek Töreni'nden

Tören yapısında hiçbir akustik panel kullanılmadı. Avlu, yapıyı yoldan kırk metre uzaklaştırdı; kalın taş duvar gerisini halletti. Sessizlik, satın alınan değil, yerleştirilen bir şeydi.`,
    body_en: `Before you call an acoustician, read your plan once more. Most noise problems come from the wrong adjacency: a lift shaft behind a bedroom, a living room under a kitchen.

## Three steps

1. **Move the source away.** Distance is the cheapest acoustic measure there is.
2. **Put a service volume in between.** A wardrobe, a corridor, a bathroom — each works as a buffer.
3. **Only then think about material.** Insulation used to paper over a planning error always falls short.

## From Future Ceremony

Not one acoustic panel was used in the ceremonial building. The courtyard set it forty metres back from the road; thick stone did the rest. Silence was placed, not purchased.`,
    cover_url: '/infinite-scroll/12.webp',
    tags: ['akustik', 'tasarım'],
    author: 'EMRE MERİÇ',
    published_at: '2025-11-27T09:00:00.000Z',
    is_published: true,
  },
];
