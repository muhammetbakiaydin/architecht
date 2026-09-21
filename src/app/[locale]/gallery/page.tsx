import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getBlocks, getGalleryItems } from '@/lib/content';
import GalleryExperience from '@/components/infinite-canvas/GalleryExperience';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [items, blocks, t, tNav, tCommon] = await Promise.all([
    getGalleryItems(locale),
    getBlocks('gallery', locale),
    getTranslations({ locale, namespace: 'gallery' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const hero = blocks.get('hero');

  return (
    <GalleryExperience
      items={items}
      title={hero.eyebrow || t('title')}
      loadingLabel={tCommon('loading')}
      hintDesktop={t('hintDesktop')}
      hintTouch={t('hintTouch')}
      emptyLabel={tCommon('empty')}
      links={
        <>
          <Link href="/">← {tNav('home')}</Link>
          <Link href="/projects">{tNav('projects')}</Link>
          <Link href="/products">{tNav('products')}</Link>
          <Link href="/contact">{tNav('contact')}</Link>
        </>
      }
    />
  );
}
