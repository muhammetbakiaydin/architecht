'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminPage, { Button, Notice, SaveBar } from './AdminPage';
import RecordForm from './RecordForm';
import ChildRowsEditor, { type ChildConfig } from './ChildRowsEditor';
import { useAdmin } from './AdminProvider';
import { useMutations } from './useTable';
import { seedRowsFor } from '@/lib/admin/seed-rows';
import { emptyRecord, schemaColumns, type AdminSchema } from './schema';
import type { TableName } from '@/lib/supabase/types';

export interface RecordEditorScreenProps {
  table: TableName;
  /** A row id, or the literal `new` to create one. */
  id: string;
  schema: AdminSchema;
  listHref: string;
  listLabel: string;
  /** Title shown in the header; receives the current form state. */
  titleOf: (record: Record<string, unknown>) => string;
  /** Values merged into a brand-new record (slug defaults, sort_order, ...). */
  defaults?: Record<string, unknown>;
  /** Optional one-to-many child table (project/product images). */
  child?: ChildConfig;
  /** Public URL to preview this record, if it has one. */
  previewHref?: (record: Record<string, unknown>) => string | null;
}

export default function RecordEditorScreen({
  table,
  id,
  schema,
  listHref,
  listLabel,
  titleOf,
  defaults,
  child,
  previewHref,
}: RecordEditorScreenProps) {
  const router = useRouter();
  const { supabase, canEdit } = useAdmin();
  const { insert, update } = useMutations(table);

  const isNew = id === 'new';
  const blank = useMemo(
    () => ({ ...emptyRecord(schema), ...defaults }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema]
  );

  const [record, setRecord] = useState<Record<string, unknown>>(blank);
  const [savedId, setSavedId] = useState<string | null>(isNew ? null : id);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSeed, setIsSeed] = useState(false);

  useEffect(() => {
    if (isNew) {
      setRecord(blank);
      setLoading(false);
      return;
    }

    let active = true;

    if (!supabase) {
      const seeded = seedRowsFor<Record<string, unknown>>(table).find((row) => row.id === id);
      setRecord(seeded ? { ...blank, ...seeded } : blank);
      setIsSeed(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from(table)
      .select('*')
      .eq('id', id as never)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        setRecord(data ? { ...blank, ...(data as Record<string, unknown>) } : blank);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [supabase, table, id, isNew, blank]);

  const readOnly = !canEdit || isSeed;

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    // Only the columns the schema knows about are sent, so stray keys from a
    // fetched row (created_at, joined data) never reach the update.
    const payload: Record<string, unknown> = {};
    schemaColumns(schema).forEach((column) => {
      payload[column] = record[column] ?? null;
    });

    const result = savedId ? await update(savedId, payload) : await insert(payload);
    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? 'Kaydedilemedi.');
      return;
    }

    setMessage('Kaydedildi.');
    if (!savedId && result.id) {
      setSavedId(result.id);
      router.replace(`${listHref}/${result.id}`);
    }
  };

  const preview = previewHref?.(record) ?? null;

  return (
    <AdminPage
      title={titleOf(record) || (isNew ? 'Yeni kayıt' : 'Kayıt')}
      description={`${listLabel} koleksiyonu`}
      actions={
        <>
          <Link href={listHref}>
            <Button>← LİSTEYE DÖN</Button>
          </Link>
          {preview && (
            <Button href={preview} variant="secondary">
              ÖNİZLE ↗
            </Button>
          )}
        </>
      }
    >
      {loading ? (
        <p className="text-[13px] text-[#6d675e]">Yükleniyor…</p>
      ) : (
        <div className="space-y-12">
          {isSeed && (
            <Notice>
              Hazır içerik gösteriliyor (salt okunur). Supabase bağlandığında bu kayıt
              veritabanından gelir ve düzenlenebilir.
            </Notice>
          )}
          {!isSeed && !canEdit && (
            <Notice>Bu hesabın düzenleme yetkisi yok; alanlar salt okunur.</Notice>
          )}

          <RecordForm
            schema={schema}
            value={record}
            onChange={setRecord}
            disabled={readOnly}
          />

          {child &&
            (savedId ? (
              <ChildRowsEditor config={child} parentId={savedId} readOnly={readOnly} />
            ) : (
              <Notice>
                {child.label} eklemek için önce bu kaydı kaydedin.
              </Notice>
            ))}

          <SaveBar
            onSave={() => void handleSave()}
            saving={saving}
            disabled={readOnly}
            message={message}
            error={error}
          />
        </div>
      )}
    </AdminPage>
  );
}
