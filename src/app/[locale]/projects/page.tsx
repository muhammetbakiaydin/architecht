import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getBlocks, getProjects } from '@/lib/content';
import LocaleSwitcher from '@/components/site/LocaleSwitcher';
import InfiniteScrollGallery from '@/components/infinite-scroll/InfiniteScrollGallery';
import type { GallerySlide } from '@/components/infinite-scroll/types';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, blocks, t, tNav, tCommon] = await Promise.all([
    getProjects(locale),
    getBlocks('projects', locale),
    getTranslations({ locale, namespace: 'projects' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const hero = blocks.get('hero');

  const STAGGERS = ['-22vw', '18vw', '-14vw', '24vw'];
  const WIDTHS = ['20vw', '26vw', '22vw', '18vw'];

  const slides: GallerySlide[] = projects.map((project, index) => ({
    index,
    slug: project.slug,
    image: project.coverUrl,
    caption: project.caption,
    stagger: STAGGERS[index % STAGGERS.length],
    imgWidth: WIDTHS[index % WIDTHS.length],
    title: project.title,
    category: project.category,
    description: project.description,
    // The expanded view always needs at least one photograph; the cover
    // stands in for a project whose detail images have not been added yet.
    gallery:
      project.images.length > 0
        ? project.images.map((image) => ({
            image: image.url,
            title: image.title || project.title,
            subtitle: image.subtitle,
            description: image.description || project.description,
          }))
        : [
            {
              image: project.coverUrl,
              title: project.title,
              subtitle: project.category,
              description: project.description,
            },
          ],
  }));

  return (
    <>
      {/* The archive stylesheet @imports two third-party font sheets; opening
          the connections early takes a round trip off the first paint. Scoped
          to this route because no other page uses those faces. */}
      <link rel="preconnect" href="https://use.typekit.net" />
      <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      <InfiniteScrollGallery
        slides={slides}
        frameTitle={hero.title || t('frameTitle')}
        frameNote={t('counter', { count: projects.length })}
        tags={['spatial', 'architecture', 'infinite-gallery', 'monograph']}
        backLabel={tCommon('back')}
        links={
          <>
            <Link href="/">← {tNav('home')}</Link>
            <Link href="/gallery">{tNav('gallery')}</Link>
            <Link href="/about">{tNav('about')}</Link>
            <Link href="/contact">{tNav('contact')}</Link>
            <LocaleSwitcher tone="dark" />
          </>
        }
      />
    </>
  );
}
