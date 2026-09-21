import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/content';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const [settings, t] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'home' }),
  ]);

  const title = settings.seoTitle || t('metaTitle');
  const description = settings.seoDescription || t('metaDescription');

  return {
    /**
     * Makes the relative image paths used by `openGraph` resolve to absolute
     * URLs. Without it Next falls back to the dev host and warns on every
     * render, and share cards would ship localhost links in production.
     */
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    // Sub-pages set their own `title`; this template keeps the brand on the end.
    title: { default: title, template: `%s | ${settings.brand}` },
    description,
    openGraph: { title, description, siteName: settings.brand, locale, type: 'website' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this segment.
  setRequestLocale(locale as Locale);

  return (
    /* No `scroll-smooth` here: native smooth scrolling fights Lenis. */
    <html lang={locale}>
      <head>
        {/* The only webfont the site loads, and it is needed for the first
            paint of every page. Without this it is not even discovered until
            the stylesheet has parsed. */}
        <link
          rel="preload"
          href="/fonts/Syne.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#F5EFE6] text-[#1A1816] antialiased selection:bg-[#8B151B] selection:text-white">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
