'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { PRODUCT_IMAGE_SCHEMA, PRODUCT_SCHEMA } from '@/components/admin/schemas';

export default function AdminProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="products"
      id={id}
      schema={PRODUCT_SCHEMA}
      listHref="/admin/products"
      listLabel="Ürünler"
      titleOf={(record) => String(record.name_tr || record.name_en || 'Yeni ürün')}
      defaults={{
        is_published: true,
        is_featured: false,
        sort_order: 0,
        specs: [],
      }}
      previewHref={(record) => (record.slug ? `/tr/urunler/${record.slug}` : null)}
      child={{
        table: 'product_images',
        foreignKey: 'product_id',
        schema: PRODUCT_IMAGE_SCHEMA,
        label: 'Ek görseller',
        description: 'Kapak görselinin altında ikili ızgarada gösterilir.',
        summary: (row) => String(row.alt_tr || row.url || ''),
      }}
    />
  );
}
