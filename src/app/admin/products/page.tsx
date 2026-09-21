'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Button } from '@/components/admin/AdminPage';
import CollectionList from '@/components/admin/CollectionList';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { ProductRow } from '@/lib/supabase/types';

export default function AdminProductsPage() {
  const { canEdit } = useAdmin();

  return (
    <AdminPage
      title="Ürünler"
      description="Ürünler sayfasında listelenen ve kendi detay sayfası olan objeler."
      actions={
        <>
          <Button href="/tr/urunler">ÖNİZLE ↗</Button>
          <Link href="/admin/products/new">
            <Button variant="primary" disabled={!canEdit}>
              + YENİ ÜRÜN
            </Button>
          </Link>
        </>
      }
    >
      <CollectionList<ProductRow>
        table="products"
        editHref={(row) => `/admin/products/${row.id}`}
        title={(row) => row.name_tr || row.name_en || row.slug}
        subtitle={(row) => [row.category, row.material_tr].filter(Boolean).join(' · ')}
        thumbnail={(row) => row.cover_url}
        publishColumn="is_published"
        emptyLabel="Henüz ürün eklenmemiş."
      />
    </AdminPage>
  );
}
