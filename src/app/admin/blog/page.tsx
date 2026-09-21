'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { BlogPostRow } from '@/lib/supabase/types';

export default function AdminBlogPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Blog Yazıları"
      description="Yayın tarihine göre sıralanır; en yeni yazı listenin başında görünür."
      actions={
        <>
          <Button href="/tr/blog">ÖNİZLE ↗</Button>
          <Link href="/admin/blog/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ YAZI
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<BlogPostRow>
        table="blog_posts"
        orderBy="published_at"
        ascending={false}
        reorderable={false}
        editHref={(row) => `/admin/blog/${row.id}`}
        title={(row) => row.title_tr || row.title_en || row.slug}
        subtitle={(row) =>
          [
            new Date(row.published_at).toLocaleDateString('tr-TR'),
            row.tags.map((tag) => `#${tag}`).join(' '),
          ]
            .filter(Boolean)
            .join(' · ')
        }
        thumbnail={(row) => row.cover_url ?? ''}
        publishColumn="is_published"
        emptyLabel="Henüz yazı eklenmemiş."
      />
    </AdminPage>
  );
}
