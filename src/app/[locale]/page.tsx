import React from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import {
  getBlocks,
  getBlogPosts,
  getProducts,
  getProjects,
  jsonArray,
  jsonString,
  pickFrom,
} from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import SectionHeading from '@/components/site/SectionHeading';
import HeroSection from '@/components/HeroSection';
import StickyGridGallery from '@/components/StickyGridGallery';
import StudioIntro from '@/components/StudioIntro';
import ApproachSection from '@/components/ApproachSection';
import ProjectCard from '@/components/cards/ProjectCard';
import ProductCard from '@/components/cards/ProductCard';
import PostCard from '@/components/cards/PostCard';
import Reveal from '@/components/Reveal';

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [blocks, featuredProjects, featuredProducts, posts, t, tCommon] = await Promise.all([
    getBlocks('home', locale),
    getProjects(locale, { featuredOnly: true, limit: 4 }),
    getProducts(locale, { featuredOnly: true, limit: 3 }),
    getBlogPosts(locale, 3),
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const intro = blocks.get('studio_intro');
  const approach = blocks.get('approach');
  const worksGrid = blocks.get('works_grid');
  const projectsBlock = blocks.get('featured_projects');
  const productsBlock = blocks.get('featured_products');
  const postsBlock = blocks.get('latest_posts');
  const galleryBlock = blocks.get('gallery_cta');

  const stats = jsonArray(intro.data.stats).map((stat) => ({
    value: jsonString(stat.value),
    label: pickFrom(locale, stat, 'label'),
  }));

  const steps = jsonArray(approach.data.steps).map((step) => ({
    index: jsonString(step.index),
    title: pickFrom(locale, step, 'title'),
    body: pickFrom(locale, step, 'body'),
  }));

  // The sticky grid needs twelve cells; it repeats whatever it is given.
  const gridItems = featuredProjects
    .flatMap((project) => [
      { src: project.coverUrl, alt: project.title },
      ...project.images.map((img) => ({ src: img.url, alt: img.title || project.title })),
    ])
    .filter((item) => item.src);

  return (
    <SiteShell locale={locale} transparentHeader padTop={false}>
      {/* WebGPU "EMRE MERİÇ" dissolve + awards ribbon */}
      <HeroSection />

      {/* Codrops sticky grid scroll - the works archive */}
      <StickyGridGallery
        items={gridItems}
        eyebrow={worksGrid.eyebrow}
        title={worksGrid.title}
        description={worksGrid.body}
        ctaLabel={worksGrid.ctaLabel || tCommon('viewAll')}
        ctaHref={worksGrid.ctaHref || '#studio'}
      />

      {/* Everything below sits above the hero's fixed canvas layer (z-10)
          and paints its own background, so the canvas never shows through. */}
      <StudioIntro
        eyebrow={intro.eyebrow}
        subtitle={intro.subtitle}
        title={intro.title}
        paragraphs={intro.body.split(/\n{2,}/).filter(Boolean)}
        stats={stats}
      />

      {featuredProjects.length > 0 && (
        <section className="relative z-10 bg-[#F5EFE6] px-6 pb-28 md:px-12 md:pb-40">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              eyebrow={projectsBlock.eyebrow || t('featuredProjects')}
              title={projectsBlock.title || t('featuredProjectsTitle')}
              body={projectsBlock.body}
              ctaLabel={projectsBlock.ctaLabel || tCommon('viewAll')}
              ctaHref={projectsBlock.ctaHref || '/projects'}
            />
            <Reveal
              className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.1}
            >
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <ApproachSection eyebrow={approach.eyebrow} title={approach.title} steps={steps} />

      {featuredProducts.length > 0 && (
        <section className="relative z-10 bg-[#F5EFE6] px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              eyebrow={productsBlock.eyebrow || t('featuredProducts')}
              title={productsBlock.title || t('featuredProductsTitle')}
              body={productsBlock.body}
              ctaLabel={productsBlock.ctaLabel || tCommon('viewAll')}
              ctaHref={productsBlock.ctaHref || '/products'}
            />
            <Reveal
              className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Gallery invitation */}
      {galleryBlock.title && (
        <section className="relative z-10 overflow-hidden border-y border-[#161413]/10 bg-[#161413]">
          <div className="mx-auto grid max-w-[1440px] items-center gap-0 md:grid-cols-2">
            <div className="px-6 py-24 md:px-12 md:py-32">
              <SectionHeading
                eyebrow={galleryBlock.eyebrow}
                title={galleryBlock.title}
                body={galleryBlock.body}
                tone="light"
              />
              <Link
                href="/gallery"
                className="group mt-10 inline-flex items-center gap-3 border border-[#F5EFE6]/25 px-7 py-4 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#F5EFE6] transition-colors hover:border-[#8B1117] hover:bg-[#8B1117]"
              >
                {galleryBlock.ctaLabel || tCommon('viewAll')}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            {galleryBlock.imageUrl && (
              <div className="relative h-[42vh] md:h-[70vh]">
                <Image
                  src={galleryBlock.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="relative z-10 bg-[#F5EFE6] px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              eyebrow={postsBlock.eyebrow || t('latestPosts')}
              title={postsBlock.title || t('latestPostsTitle')}
              body={postsBlock.body}
              ctaLabel={postsBlock.ctaLabel || tCommon('viewAll')}
              ctaHref={postsBlock.ctaHref || '/blog'}
            />
            <Reveal
              className="mt-14 grid gap-x-6 gap-y-14 border-t border-[#161413]/12 pt-14 md:grid-cols-3"
              stagger={0.1}
            >
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  readingLabel={`${post.readingMinutes} ${locale === 'tr' ? 'dk' : 'min'}`}
                />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
