import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getProjectBySlug, getProjects } from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import Reveal from '@/components/Reveal';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 180),
    openGraph: { images: project.coverUrl ? [project.coverUrl] : undefined },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [project, all, tCommon, tNav] = await Promise.all([
    getProjectBySlug(slug, locale),
    getProjects(locale),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  if (!project) notFound();

  const position = all.findIndex((p) => p.slug === project.slug);
  const next = position >= 0 ? all[(position + 1) % all.length] : null;

  const facts = [
    { label: locale === 'tr' ? 'YIL' : 'YEAR', value: project.year ? String(project.year) : '' },
    { label: locale === 'tr' ? 'YER' : 'LOCATION', value: project.location },
    { label: locale === 'tr' ? 'TÜR' : 'TYPE', value: project.category },
    { label: locale === 'tr' ? 'İŞVEREN' : 'CLIENT', value: project.client },
    { label: locale === 'tr' ? 'ALAN' : 'AREA', value: project.area },
  ].filter((fact) => fact.value);

  return (
    <SiteShell locale={locale}>
      <article>
        {/* Cover */}
        <header className="px-6 pt-10 md:px-12 md:pt-14">
          <div className="mx-auto max-w-[1440px]">
            <Link
              href="/projects"
              className="font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#161413]/45 transition-colors hover:text-[#8B1117]"
            >
              ← {tNav('projects')}
            </Link>

            <h1 className="mt-8 max-w-[16ch] font-syne text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[#161413]">
              {project.title}
            </h1>

            {project.coverUrl && (
              <div
                className="relative mt-12 overflow-hidden bg-[#E6DCCC]"
                style={{ aspectRatio: '16 / 9' }}
              >
                <Image
                  src={project.coverUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </header>

        {/* Facts + statement */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-12">
            {facts.length > 0 && (
              <Reveal className="md:col-span-4" stagger={0.06} y={16}>
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-6 border-b border-[#161413]/12 py-4 first:border-t"
                  >
                    <span className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#161413]/40">
                      {fact.label}
                    </span>
                    <span className="text-right font-syne text-[13px] font-bold tracking-[0.04em] text-[#161413]">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </Reveal>
            )}

            <Reveal className={facts.length > 0 ? 'md:col-span-8' : 'md:col-span-12'} stagger={0.1}>
              <p className="max-w-[58ch] text-[clamp(1.0625rem,2vw,1.375rem)] leading-[1.65] text-[#161413]">
                {project.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Photographs */}
        {project.images.length > 0 && (
          <section className="px-6 pb-24 md:px-12 md:pb-36">
            <div className="mx-auto max-w-[1440px] space-y-24 md:space-y-36">
              {project.images.map((image, i) => (
                <Reveal key={image.id} className="grid gap-10 md:grid-cols-12" stagger={0.1}>
                  <div className={i % 2 === 0 ? 'md:col-span-8' : 'md:col-span-8 md:col-start-5'}>
                    <div
                      className="relative overflow-hidden bg-[#E6DCCC]"
                      style={{ aspectRatio: '4 / 3' }}
                    >
                      <Image
                        src={image.url}
                        alt={image.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div
                    className={
                      i % 2 === 0
                        ? 'md:col-span-4 md:pt-6'
                        : 'md:col-span-4 md:col-start-1 md:row-start-1 md:pt-6'
                    }
                  >
                    {image.subtitle && (
                      <div className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#8B1117]">
                        {image.subtitle}
                      </div>
                    )}
                    <h2 className="mt-4 font-syne text-[1.25rem] font-bold leading-tight tracking-[-0.01em] text-[#161413]">
                      {image.title}
                    </h2>
                    <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.75] text-[#584E44]">
                      {image.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Next project */}
        {next && next.slug !== project.slug && (
          <section className="border-t border-[#161413]/10 px-6 py-16 md:px-12 md:py-24">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                  {locale === 'tr' ? 'SIRADAKİ' : 'NEXT'}
                </span>
                <h2 className="mt-4 font-syne text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold leading-tight tracking-[-0.02em] text-[#161413]">
                  {next.title}
                </h2>
              </div>
              <Link
                href={{ pathname: '/projects/[slug]', params: { slug: next.slug } }}
                className="group inline-flex items-center gap-2 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#8B1117]"
              >
                {tCommon('viewProject')}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </section>
        )}
      </article>
    </SiteShell>
  );
}
