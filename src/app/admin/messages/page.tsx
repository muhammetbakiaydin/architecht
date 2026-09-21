'use client';

import React, { useState } from 'react';
import AdminPage, { Button, EmptyState, Notice } from '@/components/admin/AdminPage';
import { useAdmin } from '@/components/admin/AdminProvider';
import { useMutations, useRows } from '@/components/admin/useTable';
import type { ContactMessageRow } from '@/lib/supabase/types';

/** Inbox for the public contact form. Staff-read-only by RLS. */
export default function AdminMessagesPage() {
  const { configured, canEdit } = useAdmin();
  const { rows, loading, reload } = useRows<ContactMessageRow>('contact_messages', {
    orderBy: 'created_at',
    ascending: false,
  });
  const { update, remove } = useMutations('contact_messages');
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const unread = rows.filter((row) => !row.is_read).length;

  const toggleRead = async (row: ContactMessageRow) => {
    setError(null);
    const result = await update(row.id, { is_read: !row.is_read });
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    reload();
  };

  const destroy = async (row: ContactMessageRow) => {
    if (!window.confirm(`${row.name} tarafından gönderilen mesaj silinsin mi?`)) return;
    setError(null);
    const result = await remove(row.id);
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    reload();
  };

  return (
    <AdminPage
      title="Mesajlar"
      description={
        unread > 0
          ? `${unread} okunmamış mesaj var.`
          : 'İletişim formundan gelen mesajlar burada toplanır.'
      }
    >
      <div className="space-y-5">
        {!configured && (
          <Notice>
            Supabase bağlı değilken iletişim formu, ziyaretçinin e-posta uygulamasını açar ve
            mesajlar burada birikmez. Bağlandığında form doğrudan{' '}
            <code className="text-[#ede8e0]">contact_messages</code> tablosuna yazar.
          </Notice>
        )}
        {error && <Notice tone="error">{error}</Notice>}

        {loading ? (
          <p className="text-[13px] text-[#6d675e]">Yükleniyor…</p>
        ) : rows.length === 0 ? (
          <EmptyState>Henüz mesaj yok.</EmptyState>
        ) : (
          <ul className="divide-y divide-[#1f1d1b] rounded-sm border border-[#26231f] bg-[#111010]">
            {rows.map((row) => (
              <li key={row.id} className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      row.is_read ? 'bg-[#33302c]' : 'bg-[#8B1117]'
                    }`}
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === row.id ? null : row.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-[14px] text-[#ede8e0]">
                      {row.subject || '(konu yok)'}
                    </span>
                    <span className="mt-1 block truncate text-[12px] text-[#6d675e]">
                      {row.name} · {row.email} ·{' '}
                      {new Date(row.created_at).toLocaleString('tr-TR')}
                    </span>
                  </button>

                  <Button href={`mailto:${row.email}`}>YANITLA</Button>
                  <Button disabled={!canEdit} onClick={() => void toggleRead(row)}>
                    {row.is_read ? 'OKUNMADI YAP' : 'OKUNDU YAP'}
                  </Button>
                  <Button variant="danger" disabled={!canEdit} onClick={() => void destroy(row)}>
                    SİL
                  </Button>
                </div>

                {openId === row.id && (
                  <p className="mt-4 whitespace-pre-wrap border-l-2 border-[#8B1117] pl-4 text-[13.5px] leading-relaxed text-[#c9c2b7]">
                    {row.message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminPage>
  );
}
