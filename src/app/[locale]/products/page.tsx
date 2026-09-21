import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getBlocks, getProducts } from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import PageHero from '@/components/site/PageHero';
import ProductsGrid from '@/components/products/ProductsGrid';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [products, blocks, t, tCommon] = await Promise.all([
    getProducts(locale),
    getBlocks('products', locale),
    getTranslations({ locale, namespace: 'products' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const hero = blocks.get('hero');

  return (
    <SiteShell locale={locale}>
      <PageHero
        eyebrow={hero.eyebrow || t('eyebrow')}
        title={hero.title || t('title')}
        body={hero.body || t('lead')}
      />

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <ProductsGrid
            products={products}
            allLabel={t('all')}
            emptyLabel={tCommon('empty')}
          />
        </div>
      </section>
    </SiteShell>
  );
}
