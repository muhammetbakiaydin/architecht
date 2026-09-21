'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, EmptyState, Notice } from './AdminPage';
import { useAdmin } from './AdminProvider';
import { useMutations, useRows } from './useTable';
import { mediaUrl } from '@/lib/supabase/env';
import type { TableName } from '@/lib/supabase/types';

interface BaseRow {
  id: string;
  sort_order?: number;
  is_published?: boolean;
  is_visible?: boolean;
}

export interface CollectionListProps<T extends BaseRow> {
  table: TableName;
  /** Row → the link that opens its editor. */
  editHref: (row: T) => string;
  title: (row: T) => string;
  subtitle?: (row: T) => string;
  thumbnail?: (row: T) => string;
  /** Column that carries publication state, if the table has one. */
  publishColumn?: 'is_published' | 'is_visible';
  orderBy?: string;
  ascending?: boolean;
  /** Show the up/down buttons that swap `sort_order`. */
  reorderable?: boolean;
  emptyLabel?: string;
}

/**
 * The shared list screen behind Projeler / Ürünler / Blog / Galeri / Ekip /
 * Ödüller. Reordering swaps `sort_order` between neighbours, which is the same
 * column the public site orders by.
 */
export default function CollectionList<T extends BaseRow>({
  table,
  editHref,
  title,
  subtitle,
  thumbnail,
  publishColumn,
  orderBy = 'sort_order',
  ascending = true,
  reorderable = true,
  emptyLabel = 'Henüz kayıt yok.',
}: CollectionListProps<T>) {
  const { canEdit } = useAdmin();
  const { rows, loading, isSeed, reload } = useRows<T>(table, { orderBy, ascending });
  const { update, remove } = useMutations(table);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readOnly = !canEdit;

  const move = async (index: number, direction: -1 | 1) => {
    const current = rows[index];
    const neighbour = rows[index + direction];
    if (!current || !neighbour) return;

    setBusy(current.id);
    setError(null);

    // Swap the two sort_order values. Equal values (a fresh import, say) would
    // make the swap a no-op, so fall back to the list positions.
    const a = current.sort_order ?? index;
    const b = neighbour.sort_order ?? index + direction;
    const [nextA, nextB] = a === b ? [index + direction, index] : [b, a];

    const first = await update(current.id, { sort_order: nextA });
    const second = await update(neighbour.id, { sort_order: nextB });
    setBusy(null);

    if (!first.ok || !second.ok) {
      setError(first.error ?? second.error ?? null);
      return;
    }
    reload();
  };

  const togglePublish = async (row: T) => {
    if (!publishColumn) return;
    setBusy(row.id);
    setError(null);
    const result = await update(row.id, { [publishColumn]: !row[publishColumn] });
    setBusy(null);
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    reload();
  };

  const destroy = async (row: T) => {
    if (!window.confirm(`"${title(row)}" kalıcı olarak silinsin mi?`)) return;
    setBusy(row.id);
    setError(null);
    const result = await remove(row.id);
    setBusy(null);
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    reload();
  };

  if (loading) {
    return <p className="text-[13px] text-[#6d675e]">Yükleniyor…</p>;
  }

  return (
    <div className="space-y-5">
      {isSeed && (
        <Notice>
          Hazır içerik gösteriliyor (salt okunur). Supabase bağlandığında bu liste veritabanından
          gelir.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState>{emptyLabel}</EmptyState>
      ) : (
        <ul className="divide-y divide-[#1f1d1b] rounded-sm border border-[#26231f] bg-[#111010]">
          {rows.map((row, index) => {
            const published = publishColumn ? Boolean(row[publishColumn]) : true;
            const image = thumbnail?.(row);

            return (
              <li key={row.id} className="flex items-center gap-4 px-4 py-3.5">
                {thumbnail && (
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-sm border border-[#26231f] bg-[#161514]">
                    {image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mediaUrl(image)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <Link
                    href={editHref(row)}
                    className="block truncate text-[14px] text-[#ede8e0] transition-colors hover:text-[#e0757c]"
                  >
                    {title(row) || '(başlıksız)'}
                  </Link>
                  {subtitle && (
                    <p className="mt-1 truncate text-[12px] text-[#6d675e]">{subtitle(row)}</p>
                  )}
                </div>

                {publishColumn && (
                  <button
                    type="button"
                    disabled={readOnly || busy === row.id}
                    onClick={() => void togglePublish(row)}
                    className={`shrink-0 rounded-sm border px-2.5 py-1 font-syne text-[9px] font-bold uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      published
                        ? 'border-[#3f6b46] text-[#b6d8bc]'
                        : 'border-[#3a3733] text-[#6d675e]'
                    }`}
                  >
                    {published ? 'YAYINDA' : 'TASLAK'}
                  </button>
                )}

                {reorderable && (
                  <div className="flex shrink-0 gap-1">
                    <IconButton
                      label="Yukarı taşı"
                      disabled={readOnly || index === 0 || busy === row.id}
                      onClick={() => void move(index, -1)}
                    >
                      ↑
                    </IconButton>
                    <IconButton
                      label="Aşağı taşı"
                      disabled={readOnly || index === rows.length - 1 || busy === row.id}
                      onClick={() => void move(index, 1)}
                    >
                      ↓
                    </IconButton>
                  </div>
                )}

                <div className="flex shrink-0 gap-2">
                  <Link href={editHref(row)}>
                    <Button>DÜZENLE</Button>
                  </Link>
                  <Button
                    variant="danger"
                    disabled={readOnly || busy === row.id}
                    onClick={() => void destroy(row)}
                  >
                    SİL
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2c2926] text-[12px] text-[#9a9389] transition-colors hover:border-[#8B1117] hover:text-[#ede8e0] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
