'use client';

import React, { useEffect, useState } from 'react';
import AdminPage, { Notice, SaveBar } from '@/components/admin/AdminPage';
import RecordForm from '@/components/admin/RecordForm';
import { SITE_SETTINGS_SCHEMA } from '@/components/admin/schemas';
import { emptyRecord, schemaColumns } from '@/components/admin/schema';
import { useAdmin } from '@/components/admin/AdminProvider';
import { useMutations } from '@/components/admin/useTable';
import { SEED_SITE_SETTINGS } from '@/content/seed';

/** `site_settings` is a single row pinned to id = 1. */
export default function AdminSitePage() {
  const { supabase, canEdit } = useAdmin();
  const { update } = useMutations('site_settings');

  const [record, setRecord] = useState<Record<string, unknown>>({
    ...emptyRecord(SITE_SETTINGS_SCHEMA),
    ...SEED_SITE_SETTINGS,
  });
  const [loading, setLoading] = useState(Boolean(supabase));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        if (data) {
          setRecord({ ...emptyRecord(SITE_SETTINGS_SCHEMA), ...(data as Record<string, unknown>) });
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [supabase]);

  const readOnly = !supabase || !canEdit;

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    const payload: Record<string, unknown> = {};
    schemaColumns(SITE_SETTINGS_SCHEMA).forEach((column) => {
      payload[column] = record[column] ?? null;
    });

    const result = await update(1, payload);
    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? 'Kaydedilemedi.');
      return;
    }
    setMessage('Kaydedildi.');
  };

  return (
    <AdminPage
      title="Site Ayarları"
      description="Marka adı, iletişim bilgileri, sosyal bağlantılar ve arama motoru metinleri. Bu değerler sitenin her sayfasında kullanılır."
    >
      {loading ? (
        <p className="text-[13px] text-[#6d675e]">Yükleniyor…</p>
      ) : (
        <div className="space-y-12">
          {!supabase && (
            <Notice>
              Hazır içerik gösteriliyor (salt okunur). Supabase bağlandığında bu değerler
              veritabanından gelir.
            </Notice>
          )}
          {supabase && !canEdit && (
            <Notice>Bu hesabın düzenleme yetkisi yok; alanlar salt okunur.</Notice>
          )}

          <RecordForm
            schema={SITE_SETTINGS_SCHEMA}
            value={record}
            onChange={setRecord}
            disabled={readOnly}
          />

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
