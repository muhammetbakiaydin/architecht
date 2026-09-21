'use client';

import React from 'react';
import Link from 'next/link';
import AdminPage, { Notice } from '@/components/admin/AdminPage';
import { useAdmin } from '@/components/admin/AdminProvider';
import { useRows } from '@/components/admin/useTable';
import type {
  BlogPostRow,
  ContactMessageRow,
  GalleryItemRow,
  ProductRow,
  ProjectRow,
} from '@/lib/supabase/types';

export default function AdminDashboardPage() {
  const { configured, session, profile, canEdit } = useAdmin();

  const projects = useRows<ProjectRow>('projects');
  const products = useRows<ProductRow>('products');
  const posts = useRows<BlogPostRow>('blog_posts');
  const gallery = useRows<GalleryItemRow>('gallery_items');
  const messages = useRows<ContactMessageRow>('contact_messages');

  const unread = messages.rows.filter((message) => !message.is_read).length;

  const cards = [
    {
      href: '/admin/projects',
      label: 'Projeler',
      value: projects.rows.length,
      note: `${projects.rows.filter((row) => row.is_published).length} yayında`,
    },
    {
      href: '/admin/products',
      label: 'Ürünler',
      value: products.rows.length,
      note: `${products.rows.filter((row) => row.is_published).length} yayında`,
    },
    {
      href: '/admin/blog',
      label: 'Blog Yazıları',
      value: posts.rows.length,
      note: `${posts.rows.filter((row) => row.is_published).length} yayında`,
    },
    {
      href: '/admin/gallery',
      label: 'Galeri Görselleri',
      value: gallery.rows.length,
      note: `${gallery.rows.filter((row) => row.is_published).length} yayında`,
    },
    {
      href: '/admin/messages',
      label: 'Mesajlar',
      value: messages.rows.length,
      note: unread > 0 ? `${unread} okunmamış` : 'okunmamış yok',
    },
  ];

  return (
    <AdminPage
      title="Panel"
      description="Sitenin bütün içeriği buradan yönetilir. Sol menüden bir bölüm seçin."
    >
      <div className="space-y-10">
        {configured ? (
          <Notice tone={canEdit ? 'success' : 'info'}>
            {session ? (
              <>
                <strong className="text-[#ede8e0]">{session.user.email}</strong> olarak
                bağlısınız
                {profile ? ` (rol: ${profile.role})` : ''}.{' '}
                {canEdit
                  ? 'Düzenleme yetkiniz var.'
                  : 'Bu rol yalnızca görüntüleyebilir; kaydetmek için rolünüzün admin ya da editor olması gerekir.'}
              </>
            ) : (
              'Supabase bağlı ancak oturum açılmamış.'
            )}
          </Notice>
        ) : (
          <Notice>
            Panel önizleme modunda. Aşağıdaki sayılar{' '}
            <code className="text-[#ede8e0]">src/content/seed</code> içindeki hazır içerikten
            geliyor.
          </Notice>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-sm border border-[#26231f] bg-[#111010] p-6 transition-colors hover:border-[#8B1117]"
            >
              <div className="font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a8378]">
                {card.label}
              </div>
              <div className="mt-4 font-syne text-[2.25rem] font-bold leading-none tracking-[-0.02em] text-[#ede8e0]">
                {String(card.value).padStart(2, '0')}
              </div>
              <div className="mt-3 text-[12px] text-[#6d675e]">{card.note}</div>
            </Link>
          ))}
        </div>

        <section className="rounded-sm border border-[#26231f] bg-[#111010] p-6">
          <h2 className="font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#8a8378]">
            KURULUM ADIMLARI
          </h2>
          <ol className="mt-5 space-y-3 text-[13px] leading-relaxed text-[#9a9389]">
            <li>
              <span className="text-[#8B1117]">01</span> — supabase.com üzerinde bir proje
              oluşturun.
            </li>
            <li>
              <span className="text-[#8B1117]">02</span> — SQL editöründe{' '}
              <code className="text-[#ede8e0]">supabase/schema.sql</code> dosyasını çalıştırın.
            </li>
            <li>
              <span className="text-[#8B1117]">03</span> —{' '}
              <code className="text-[#ede8e0]">.env.example</code> dosyasını{' '}
              <code className="text-[#ede8e0]">.env.local</code> olarak kopyalayıp Settings → API
              altındaki URL ve anon key değerlerini girin.
            </li>
            <li>
              <span className="text-[#8B1117]">04</span> — Authentication → Users altından
              kullanıcınızı ekleyin, ardından rolü yükseltin:{' '}
              <code className="text-[#ede8e0]">
                update public.profiles set role = &apos;admin&apos; where email = &apos;…&apos;;
              </code>
            </li>
            <li>
              <span className="text-[#8B1117]">05</span> — Geliştirme sunucusunu yeniden başlatın.
              İçerik boş olduğu sürece site hazır içerikle çalışmaya devam eder.
            </li>
          </ol>
        </section>
      </div>
    </AdminPage>
  );
}
