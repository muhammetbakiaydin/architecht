'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { AWARD_SCHEMA } from '@/components/admin/schemas';

export default function AdminAwardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="awards"
      id={id}
      schema={AWARD_SCHEMA}
      listHref="/admin/awards"
      listLabel="Ödüller"
      titleOf={(record) => String(record.label_tr || record.label_en || 'Yeni ödül')}
      defaults={{ is_visible: true, sort_order: 0 }}
      previewHref={() => '/tr/hakkimizda'}
    />
  );
}
