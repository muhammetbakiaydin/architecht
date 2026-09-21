'use client';

import React, { useMemo, useState } from 'react';
import type { BlogPost } from '@/lib/content/types';
import type { Locale } from '@/i18n/routing';
import PostCard from '@/components/cards/PostCard';

export interface BlogListProps {
  posts: BlogPost[];
  locale: Locale;
  allLabel: string;
  emptyLabel: string;
  /** "{minutes} dk okuma" with the placeholder left in for substitution. */
  readingTemplate: string;
}

export default function BlogList({
  posts,
  locale,
  allLabel,
  emptyLabel,
  readingTemplate,
}: BlogListProps) {
  const tags = useMemo(() => {
    const seen = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => seen.add(tag)));
    return Array.from(seen);
  }, [posts]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active ? posts.filter((post) => post.tags.includes(active)) : posts;

  return (
    <div>
      {tags.length > 1 && (
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-[#161413]/12 pb-6">
          <TagButton active={active === null} onClick={() => setActive(null)}>
            {allLabel}
          </TagButton>
          {tags.map((tag) => (
            <TagButton key={tag} active={active === tag} onClick={() => setActive(tag)}>
              #{tag}
            </TagButton>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-20 text-center text-[15px] text-[#584E44]">{emptyLabel}</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              locale={locale}
              readingLabel={readingTemplate.replace(
                '{minutes}',
                String(post.readingMinutes)
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TagButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-syne text-[10px] font-bold uppercase tracking-[0.26em] transition-colors ${
        active ? 'text-[#8B1117]' : 'text-[#161413]/45 hover:text-[#161413]'
      }`}
    >
      {children}
    </button>
  );
}
