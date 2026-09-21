'use client';

import React, { useState } from 'react';
import { Button, EmptyState, Notice } from './AdminPage';
import RecordForm from './RecordForm';
import { useMutations, useRows } from './useTable';
import { emptyRecord, schemaColumns, type AdminSchema } from './schema';
import type { TableName } from '@/lib/supabase/types';

export interface ChildConfig {
  table: TableName;
  /** Column on the child table pointing back at the parent row. */
  foreignKey: string;
  schema: AdminSchema;
  label: string;
  description?: string;
  /** Child row → the line shown on its collapsed header. */
  summary: (row: Record<string, unknown>) => string;
  /**
   * Extra column values for a freshly added row. Receives the current row
   * count so a unique key can be derived (content blocks need one).
   */
  newDefaults?: (count: number) => Record<string, unknown>;
}

interface ChildRow {
  id: string;
  sort_order?: number;
  [key: string]: unknown;
}

/**
 * Edits a one-to-many child table inline (a project's photographs, a product's
 * extra images). Each row is saved on its own so a long list never has to be
 * re-sent as a whole.
 */
export default function ChildRowsEditor({
  config,
  parentId,
  readOnly,
}: {
  config: ChildConfig;
  parentId: string;
  readOnly: boolean;
}) {
  const { rows, loading, reload } = useRows<ChildRow>(config.table, {
    orderBy: 'sort_order',
    filterColumn: config.foreignKey,
    filterValue: parentId,
  });
  const { insert } = useMutations(config.table);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const addRow = async () => {
    setAdding(true);
    setError(null);
    const result = await insert({
      ...emptyRecord(config.schema),
      [config.foreignKey]: parentId,
      sort_order: rows.length,
      ...config.newDefaults?.(rows.length),
    });
    setAdding(false);
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    reload();
  };

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#26231f] pb-4">
        <div>
          <h2 className="font-syne text-[11px] font-bold uppercase tracking-[0.3em] text-[#ede8e0]">
            {config.label}
          </h2>
          {config.description && (
            <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-[#8a8378]">
              {config.description}
            </p>
          )}
        </div>
        <Button onClick={() => void addRow()} disabled={readOnly || adding}>
          {adding ? 'EKLENİYOR…' : '+ YENİ EKLE'}
        </Button>
      </header>

      {error && (
        <div className="mt-5">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-[13px] text-[#6d675e]">Yükleniyor…</p>
        ) : rows.length === 0 ? (
          <EmptyState>Henüz {config.label.toLowerCase()} eklenmemiş.</EmptyState>
        ) : (
          rows.map((row, index) => (
            <ChildRowCard
              key={row.id}
              config={config}
              row={row}
              index={index}
              readOnly={readOnly}
              onChanged={reload}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ChildRowCard({
  config,
  row,
  index,
  readOnly,
  onChanged,
}: {
  config: ChildConfig;
  row: ChildRow;
  index: number;
  readOnly: boolean;
  onChanged: () => void;
}) {
  const { update, remove } = useMutations(config.table);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({
    ...emptyRecord(config.schema),
    ...row,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);

    const payload: Record<string, unknown> = {};
    schemaColumns(config.schema).forEach((column) => {
      payload[column] = draft[column] ?? null;
    });

    const result = await update(row.id, payload);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? 'Kaydedilemedi.');
      return;
    }
    setStatus('Kaydedildi.');
    onChanged();
  };

  const destroy = async () => {
    if (!window.confirm('Bu satır silinsin mi?')) return;
    const result = await remove(row.id);
    if (!result.ok) {
      setError(result.error ?? null);
      return;
    }
    onChanged();
  };

  return (
    <div className="rounded-sm border border-[#26231f] bg-[#111010]">
      <div className="flex items-center gap-4 px-4 py-3">
        <span className="font-syne text-[10px] font-bold tracking-[0.2em] text-[#8B1117]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 truncate text-left text-[13.5px] text-[#ede8e0]"
        >
          {config.summary(draft) || '(boş satır)'}
        </button>
        <Button onClick={() => setOpen((value) => !value)}>{open ? 'KAPAT' : 'AÇ'}</Button>
        <Button variant="danger" disabled={readOnly} onClick={() => void destroy()}>
          SİL
        </Button>
      </div>

      {open && (
        <div className="border-t border-[#1f1d1b] px-4 py-6">
          <RecordForm
            schema={config.schema}
            value={draft}
            onChange={setDraft}
            disabled={readOnly}
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={() => void save()} disabled={readOnly || saving}>
              {saving ? 'KAYDEDİLİYOR…' : 'SATIRI KAYDET'}
            </Button>
            {error && <span className="text-[12.5px] text-[#e0757c]">{error}</span>}
            {!error && status && <span className="text-[12.5px] text-[#b6d8bc]">{status}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
