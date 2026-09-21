'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { BLOG_SCHEMA } from '@/components/admin/schemas';

export default function AdminBlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="blog_posts"
      id={id}
      schema={BLOG_SCHEMA}
      listHref="/admin/blog"
      listLabel="Blog Yazıları"
      titleOf={(record) => String(record.title_tr || record.title_en || 'Yeni yazı')}
      defaults={{
        is_published: false,
        tags: [],
        author: 'EMRE MERİÇ',
        published_at: new Date().toISOString(),
      }}
      previewHref={(record) => (record.slug ? `/tr/blog/${record.slug}` : null)}
    />
  );
}
