'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { GALLERY_SCHEMA } from '@/components/admin/schemas';

export default function AdminGalleryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="gallery_items"
      id={id}
      schema={GALLERY_SCHEMA}
      listHref="/admin/gallery"
      listLabel="Galeri Görselleri"
      titleOf={(record) => String(record.title_tr || record.url || 'Yeni görsel')}
      defaults={{ is_published: true, sort_order: 0, width: 1200, height: 1500 }}
      previewHref={() => '/tr/galeri'}
    />
  );
}
