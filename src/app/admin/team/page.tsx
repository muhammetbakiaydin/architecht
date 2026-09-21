'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { TeamMemberRow } from '@/lib/supabase/types';

export default function AdminTeamPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Ekip"
      description="Hakkımızda sayfasındaki ekip bölümü."
      actions={
        <>
          <Button href="/tr/hakkimizda">ÖNİZLE ↗</Button>
          <Link href="/admin/team/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ ÜYE
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<TeamMemberRow>
        table="team_members"
        editHref={(row) => `/admin/team/${row.id}`}
        title={(row) => row.name}
        subtitle={(row) => row.role_tr ?? ''}
        thumbnail={(row) => row.photo_url ?? ''}
        publishColumn="is_visible"
        emptyLabel="Henüz ekip üyesi eklenmemiş."
      />
    </AdminPage>
  );
}
