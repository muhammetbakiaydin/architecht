'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { ProjectRow } from '@/lib/supabase/types';

export default function AdminProjectsPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Projeler"
      description="Sonsuz kaydırmalı arşivde ve proje detay sayfalarında görünen işler. Sıralama, arşivdeki diziliş sırasını belirler."
      actions={
        <>
          <Button href="/tr/projeler">ÖNİZLE ↗</Button>
          <Link href="/admin/projects/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ PROJE
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<ProjectRow>
        table="projects"
        editHref={(row) => `/admin/projects/${row.id}`}
        title={(row) => row.title_tr || row.title_en || row.slug}
        subtitle={(row) =>
          [row.category, row.year, row.location_tr].filter(Boolean).join(' · ')
        }
        thumbnail={(row) => row.cover_url}
        publishColumn="is_published"
        emptyLabel="Henüz proje eklenmemiş."
      />
    </AdminPage>
  );
}
