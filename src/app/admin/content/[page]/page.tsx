'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import AdminPage, { Button, Notice } from '@/components/admin/AdminPage';
import ChildRowsEditor from '@/components/admin/ChildRowsEditor';
import { CONTENT_BLOCK_SCHEMA } from '@/components/admin/schemas';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { ContentPage } from '@/lib/supabase/types';

/**
 * Every editable region of a page, as rows of `content_blocks`.
 *
 * `page` and `block_key` together are the address the site reads by
 * (`getBlocks('home', locale).get('studio_intro')`), so the key is editable but
 * changing an existing one detaches that block from its slot.
 */
const PAGES: Record<
  string,
  { page: ContentPage; title: string; description: string; preview: string }
> = {
  home: {
    page: 'home',
    title: 'Ana Sayfa',
    description:
      'Stüdyo tanıtımı, yaklaşım adımları, öne çıkan bölüm başlıkları ve galeri daveti. Sayılar ve adım listeleri "Veri (JSON)" alanında tutulur.',
    preview: '/tr',
  },
  about: {
    page: 'about',
    title: 'Hakkımızda',
    description:
      'Giriş, hikâye, ilkeler, kilometre taşları ve ekip başlığı. Ekip üyeleri ve ödüller ayrı bölümlerden yönetilir.',
    preview: '/tr/hakkimizda',
  },
  contact: {
    page: 'contact',
    title: 'İletişim',
    description:
      'İletişim sayfasının başlık metni. Adres, e-posta ve çalışma saatleri Site Ayarları bölümünden gelir.',
    preview: '/tr/iletisim',
  },
  projects: {
    page: 'projects',
    title: 'Projeler Sayfası',
    description: 'Sonsuz kaydırmalı arşivin üst başlığı.',
    preview: '/tr/projeler',
  },
  products: {
    page: 'products',
    title: 'Ürünler Sayfası',
    description: 'Ürün listesinin başlık metni.',
    preview: '/tr/urunler',
  },
  gallery: {
    page: 'gallery',
    title: 'Galeri Sayfası',
    description: 'Sonsuz tuvalin köşe başlığı.',
    preview: '/tr/galeri',
  },
  blog: {
    page: 'blog',
    title: 'Blog Sayfası',
    description: 'Blog listesinin başlık metni.',
    preview: '/tr/blog',
  },
};

export default function AdminContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const config = PAGES[page];
  const { canEdit, configured } = useAdmin();

  if (!config) notFound();

  return (
    <AdminPage
      title={config.title}
      description={config.description}
      actions={
        <Button href={config.preview} variant="secondary">
          ÖNİZLE ↗
        </Button>
      }
    >
      <div className="space-y-8">
        {!configured && (
          <Notice>
            Hazır içerik gösteriliyor (salt okunur). Supabase bağlandığında bloklar
            veritabanından gelir ve düzenlenebilir.
          </Notice>
        )}

        <ChildRowsEditor
          parentId={config.page}
          readOnly={!canEdit}
          config={{
            table: 'content_blocks',
            foreignKey: 'page',
            schema: CONTENT_BLOCK_SCHEMA,
            label: 'İçerik blokları',
            description:
              'Her blok sayfanın bir bölümüne karşılık gelir. Açmak için satıra tıklayın; kaydetme her blok için ayrıdır.',
            summary: (row) =>
              [row.block_key, row.title_tr || row.eyebrow_tr]
                .filter(Boolean)
                .join(' — '),
            newDefaults: (count) => ({
              page: config.page,
              block_key: `yeni_blok_${count + 1}`,
              is_visible: true,
            }),
          }}
        />
      </div>
    </AdminPage>
  );
}
