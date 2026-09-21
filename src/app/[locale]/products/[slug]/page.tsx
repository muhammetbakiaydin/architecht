import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getProductBySlug, getProducts } from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/cards/ProductCard';
import ProductDetailView from '@/components/products/ProductDetailView';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};
  return {
    title: `${product.name} | Emre Meriç Atelier`,
    description: product.summary || product.description.slice(0, 180),
    openGraph: { images: product.coverUrl ? [product.coverUrl] : undefined },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [product, all, t, tNav] = await Promise.all([
    getProductBySlug(slug, locale),
    getProducts(locale),
    getTranslations({ locale, namespace: 'products' }),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  if (!product) notFound();

  const related = all.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <SiteShell locale={locale}>
      <article className="px-6 pt-10 md:px-12 md:pt-14 pb-20">
        <ProductDetailView
          product={product}
          backLabel={tNav('products')}
          specsLabel={t('specs')}
          contactLabel={locale === 'tr' ? 'Atölye İletişimi & Sipariş' : 'Atelier Inquiries & Orders'}
          locale={locale}
        />

        {related.length > 0 && (
          <div className="mx-auto max-w-[1440px]">
            <section className="mt-28 border-t border-[#161413]/10 pt-16 md:mt-36">
              <h2 className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                {t('related')}
              </h2>
              <Reveal
                className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                stagger={0.1}
              >
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </Reveal>
            </section>
          </div>
        )}
      </article>
    </SiteShell>
  );
}
