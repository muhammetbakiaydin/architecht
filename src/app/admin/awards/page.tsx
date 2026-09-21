'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { AwardRow } from '@/lib/supabase/types';

export default function AdminAwardsPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Ödüller"
      description="Hakkımızda sayfasının alt bölümünde ve her sayfanın alt bilgisinde listelenir."
      actions={
        <>
          <Button href="/tr/hakkimizda">ÖNİZLE ↗</Button>
          <Link href="/admin/awards/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ ÖDÜL
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<AwardRow>
        table="awards"
        editHref={(row) => `/admin/awards/${row.id}`}
        title={(row) => row.label_tr || row.label_en}
        subtitle={(row) => (row.year ? String(row.year) : '')}
        publishColumn="is_visible"
        emptyLabel="Henüz ödül eklenmemiş."
      />
    </AdminPage>
  );
}
