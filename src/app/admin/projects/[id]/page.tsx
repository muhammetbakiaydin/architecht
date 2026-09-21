'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { PROJECT_IMAGE_SCHEMA, PROJECT_SCHEMA } from '@/components/admin/schemas';

export default function AdminProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="projects"
      id={id}
      schema={PROJECT_SCHEMA}
      listHref="/admin/projects"
      listLabel="Projeler"
      titleOf={(record) => String(record.title_tr || record.title_en || 'Yeni proje')}
      defaults={{
        is_published: true,
        is_featured: false,
        sort_order: 0,
        stagger: '0vw',
        img_width: '20vw',
      }}
      previewHref={(record) => (record.slug ? `/tr/projeler/${record.slug}` : null)}
      child={{
        table: 'project_images',
        foreignKey: 'project_id',
        schema: PROJECT_IMAGE_SCHEMA,
        label: 'Proje fotoğrafları',
        description:
          'Arşivdeki açılır görünümde sırayla gezilir ve proje detay sayfasında alt alta listelenir. İlk fotoğraf açılışta görünendir.',
        summary: (row) => String(row.title_tr || row.url || ''),
      }}
    />
  );
}
