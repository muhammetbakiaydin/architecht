import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import {
  getAwards,
  getBlocks,
  getTeamMembers,
  jsonArray,
  jsonString,
  pickFrom,
} from '@/lib/content';
import SiteShell from '@/components/site/SiteShell';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/site/SectionHeading';
import Reveal from '@/components/Reveal';
import AwardsShowcase from '@/components/site/AwardsShowcase';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [blocks, team, awards, t] = await Promise.all([
    getBlocks('about', locale),
    getTeamMembers(locale),
    getAwards(locale),
    getTranslations({ locale, namespace: 'about' }),
  ]);

  const hero = blocks.get('hero');
  const story = blocks.get('story');
  const values = blocks.get('values');
  const timeline = blocks.get('timeline');
  const teamBlock = blocks.get('team');

  const valueItems = jsonArray(values.data.items).map((item) => ({
    title: pickFrom(locale, item, 'title'),
    body: pickFrom(locale, item, 'body'),
  }));

  const timelineItems = jsonArray(timeline.data.items).map((item) => ({
    year: jsonString(item.year),
    title: pickFrom(locale, item, 'title'),
    body: pickFrom(locale, item, 'body'),
  }));

  return (
    <SiteShell locale={locale}>
      <PageHero
        eyebrow={hero.eyebrow || t('eyebrow')}
        title={hero.title}
        body={hero.body}
        imageUrl={hero.imageUrl}
      />

      {/* Story */}
      {story.title && (
        <section className="px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-7" stagger={0.1}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#8B1117]" />
                <span className="font-syne text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1117]">
                  {story.eyebrow}
                </span>
              </div>
              <h2 className="mt-6 max-w-[18ch] font-syne text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#161413]">
                {story.title}
              </h2>
              {story.body.split(/\n{2,}/).filter(Boolean).map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-6 max-w-[58ch] text-base leading-[1.8] text-[#584E44] md:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {story.imageUrl && (
              <div className="md:col-span-5">
                <div
                  className="relative overflow-hidden bg-[#E6DCCC]"
                  style={{ aspectRatio: '4 / 5' }}
                >
                  <Image
                    src={story.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Principles */}
      {valueItems.length > 0 && (
        <section className="border-y border-[#161413]/10 bg-[#EFE7DB] px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading eyebrow={values.eyebrow} title={values.title} />
            <Reveal
              className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.1}
            >
              {valueItems.map((item, i) => (
                <article key={item.title} className="border-t border-[#161413]/15 pt-6">
                  <span className="font-syne text-[10px] font-bold tracking-[0.3em] text-[#8B1117]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-syne text-[1.25rem] font-bold leading-tight tracking-[-0.01em] text-[#161413]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.75] text-[#584E44]">{item.body}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timelineItems.length > 0 && (
        <section className="px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading eyebrow={timeline.eyebrow || t('timeline')} title={timeline.title} />
            <Reveal className="mt-16" stagger={0.08} y={18}>
              {timelineItems.map((item) => (
                <div
                  key={item.year + item.title}
                  className="grid gap-4 border-b border-[#161413]/12 py-8 first:border-t md:grid-cols-12 md:gap-10"
                >
                  <div className="font-syne text-[1.5rem] font-bold leading-none tracking-[-0.02em] text-[#8B1117] md:col-span-2">
                    {item.year}
                  </div>
                  <h3 className="font-syne text-[1.125rem] font-bold leading-tight tracking-[-0.01em] text-[#161413] md:col-span-4">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.75] text-[#584E44] md:col-span-6">
                    {item.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="border-t border-[#161413]/10 px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              eyebrow={teamBlock.eyebrow || t('team')}
              title={teamBlock.title}
              body={teamBlock.body}
            />
            <Reveal
              className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.1}
            >
              {team.map((member) => (
                <article key={member.id}>
                  {member.photoUrl && (
                    <div
                      className="relative overflow-hidden bg-[#E6DCCC]"
                      style={{ aspectRatio: '4 / 5' }}
                    >
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                      />
                    </div>
                  )}
                  <h3 className="mt-5 font-syne text-[1.0625rem] font-bold leading-tight tracking-[-0.01em] text-[#161413]">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#8B1117]">
                    {member.role}
                  </p>
                  <p className="mt-4 text-[13px] leading-[1.75] text-[#584E44]">{member.bio}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Awards */}
      <section className="border-t border-[#161413]/10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow={t('awards')}
            title={locale === 'tr' ? 'Mimari Ödüller & Tesciller' : 'Awards & Recognition'}
            body={
              locale === 'tr'
                ? 'Emre Meriç’in özgün mimari yaklaşımı ve heykelsi mekân tasarımlarının önde gelen mesleki kurumlarca tescillenen uluslararası ve ulusal başarıları.'
                : 'National and international design honors recognizing Emre Meriç’s bespoke architectural philosophy and artisanal spatial craft.'
            }
          />
          <div className="mt-14">
            <AwardsShowcase locale={locale} variant="cards" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
