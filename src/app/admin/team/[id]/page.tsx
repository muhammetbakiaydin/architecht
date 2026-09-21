'use client';

import React, { use } from 'react';
import RecordEditorScreen from '@/components/admin/RecordEditorScreen';
import { TEAM_SCHEMA } from '@/components/admin/schemas';

export default function AdminTeamEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RecordEditorScreen
      table="team_members"
      id={id}
      schema={TEAM_SCHEMA}
      listHref="/admin/team"
      listLabel="Ekip"
      titleOf={(record) => String(record.name || 'Yeni üye')}
      defaults={{ is_visible: true, sort_order: 0 }}
      previewHref={() => '/tr/hakkimizda'}
    />
  );
}
