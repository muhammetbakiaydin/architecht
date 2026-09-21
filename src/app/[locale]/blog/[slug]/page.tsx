import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/content';
import { markdownToPlainText } from '@/lib/markdown';
import SiteShell from '@/components/site/SiteShell';
import Markdown from '@/components/Markdown';
import PostCard, { formatDate } from '@/components/cards/PostCard';
import Reveal from '@/components/Reveal';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || markdownToPlainText(post.body),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, all, t] = await Promise.all([
    getBlogPostBySlug(slug, locale),
    getBlogPosts(locale),
    getTranslations({ locale, namespace: 'blog' }),
  ]);

  if (!post) notFound();

  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteShell locale={locale}>
      <article className="px-6 pt-10 md:px-12 md:pt-14">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/blog"
            className="font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#161413]/45 transition-colors hover:text-[#8B1117]"
          >
            ← {t('backToBlog')}
          </Link>

          <header className="mx-auto mt-10 max-w-[46rem]">
            <div className="flex flex-wrap items-center gap-3 font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#161413]/40">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              <span className="h-px w-4 bg-[#161413]/20" />
              <span>{t('minRead', { minutes: post.readingMinutes })}</span>
              {post.author && (
                <>
                  <span className="h-px w-4 bg-[#161413]/20" />
                  <span>{post.author}</span>
                </>
              )}
            </div>

            <h1 className="mt-6 font-syne text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#161413]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-7 text-[clamp(1.0625rem,2vw,1.3125rem)] leading-[1.6] text-[#584E44]">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.coverUrl && (
            <div
              className="relative mt-14 overflow-hidden bg-[#E6DCCC]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="mx-auto mt-16 max-w-[46rem] pb-8">
            <Markdown source={post.body} />

            {post.tags.length > 0 && (
              <div className="mt-16 flex flex-wrap gap-2 border-t border-[#161413]/12 pt-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#161413]/12 px-3 py-1.5 font-syne text-[9px] font-bold uppercase tracking-[0.2em] text-[#161413]/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {more.length > 0 && (
            <section className="mt-16 border-t border-[#161413]/10 pt-16 md:mt-24">
              <h2 className="font-syne text-[9px] font-bold uppercase tracking-[0.3em] text-[#161413]/40">
                {t('eyebrow')}
              </h2>
              <Reveal
                className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3"
                stagger={0.1}
              >
                {more.map((item) => (
                  <PostCard
                    key={item.id}
                    post={item}
                    locale={locale}
                    readingLabel={t('minRead', { minutes: item.readingMinutes })}
                  />
                ))}
              </Reveal>
            </section>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
