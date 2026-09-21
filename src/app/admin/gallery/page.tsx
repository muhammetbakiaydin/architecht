'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { GalleryItemRow } from '@/lib/supabase/types';

export default function AdminGalleryPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Galeri Görselleri"
      description="Sonsuz tuvalde dolaşan görseller. Tuval görselleri kendi düzenine göre dağıttığı için sıra yalnızca bu listeyi düzenler."
      actions={
        <>
          <Button href="/tr/galeri">ÖNİZLE ↗</Button>
          <Link href="/admin/gallery/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ GÖRSEL
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<GalleryItemRow>
        table="gallery_items"
        editHref={(row) => `/admin/gallery/${row.id}`}
        title={(row) => row.title_tr || row.title_en || row.url}
        subtitle={(row) => `${row.width} × ${row.height} px`}
        thumbnail={(row) => row.url}
        publishColumn="is_published"
        emptyLabel="Henüz görsel eklenmemiş."
      />
    </AdminPage>
  );
}
