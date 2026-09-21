import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getBlocks, getSiteSettings } from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import PageHero from '@/components/site/PageHero';
import ContactForm from '@/components/contact/ContactForm';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, blocks, t] = await Promise.all([
    getSiteSettings(locale),
    getBlocks('contact', locale),
    getTranslations({ locale, namespace: 'contact' }),
  ]);

  const hero = blocks.get('hero');

  return (
    <SiteShell locale={locale}>
      <PageHero
        eyebrow={hero.eyebrow || t('eyebrow')}
        title={hero.title || t('title')}
        body={hero.body}
      />

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12 md:gap-20">
          {/* Details */}
          <div className="md:col-span-4">
            <dl className="space-y-10">
              <div>
                <dt className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                  {t('studio')}
                </dt>
                <dd className="mt-4 font-syne text-sm font-bold uppercase tracking-[0.18em] text-[#161413]">
                  {settings.brand}
                </dd>
                <dd className="mt-2 text-[15px] leading-[1.75] text-[#584E44]">
                  {settings.address}
                </dd>
              </div>

              <div>
                <dt className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                  {t('reach')}
                </dt>
                <dd className="mt-4">
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-[15px] text-[#161413] underline decoration-[#8B1117] decoration-1 underline-offset-4 transition-colors hover:text-[#8B1117]"
                  >
                    {settings.email}
                  </a>
                </dd>
                {settings.phone && (
                  <dd className="mt-2">
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, '')}`}
                      className="text-[15px] text-[#584E44] transition-colors hover:text-[#8B1117]"
                    >
                      {settings.phone}
                    </a>
                  </dd>
                )}
              </div>

              {settings.hours && (
                <div>
                  <dt className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                    {t('hours')}
                  </dt>
                  <dd className="mt-4 text-[15px] leading-[1.75] text-[#584E44]">
                    {settings.hours}
                  </dd>
                </div>
              )}

              {settings.socials.length > 0 && (
                <div>
                  <dt className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                    {locale === 'tr' ? 'SOSYAL' : 'ELSEWHERE'}
                  </dt>
                  <dd className="mt-4 flex flex-col gap-2">
                    {settings.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-syne text-[11px] font-bold uppercase tracking-[0.22em] text-[#584E44] transition-colors hover:text-[#8B1117]"
                      >
                        {social.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}

              {settings.mapUrl && (
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#8B1117]"
                >
                  {locale === 'tr' ? 'HARİTADA AÇ' : 'OPEN IN MAPS'}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </dl>
          </div>

          {/* Form */}
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="font-syne text-[clamp(1.375rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-[#161413]">
              {t('formTitle')}
            </h2>
            <div className="mt-10">
              <ContactForm email={settings.email} />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
