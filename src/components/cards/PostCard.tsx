import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { BlogPost } from '@/lib/content/types';
import type { Locale } from '@/i18n/routing';

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export interface PostCardProps {
  post: BlogPost;
  locale: Locale;
  readingLabel: string;
  /** Compact form drops the cover image; used in the home page rail. */
  compact?: boolean;
}

export default function PostCard({ post, locale, readingLabel, compact = false }: PostCardProps) {
  return (
    <Link
      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
      className="group flex flex-col"
    >
      {!compact && post.coverUrl && (
        <div className="relative overflow-hidden bg-[#E6DCCC]" style={{ aspectRatio: '3 / 2' }}>
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      )}

      <div className={compact ? '' : 'mt-6'}>
        <div className="flex flex-wrap items-center gap-3 font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#161413]/40">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          <span className="h-px w-4 bg-[#161413]/20" />
          <span>{readingLabel}</span>
        </div>

        <h3 className="mt-4 max-w-[26ch] font-syne text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.01em] text-[#161413] transition-colors group-hover:text-[#8B1117]">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.75] text-[#584E44]">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[#161413]/12 px-2.5 py-1 font-syne text-[9px] font-bold uppercase tracking-[0.2em] text-[#161413]/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
