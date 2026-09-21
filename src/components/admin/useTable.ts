'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './AdminProvider';
import { seedRowsFor } from '@/lib/admin/seed-rows';
import type { TableName } from '@/lib/supabase/types';

export interface UseRowsOptions {
  orderBy?: string;
  ascending?: boolean;
  /** Simple equality filter; enough for every list the panel needs. */
  filterColumn?: string;
  filterValue?: string | number | boolean;
}

export interface UseRowsResult<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  /** True when the rows came from `src/content/seed` rather than the database. */
  isSeed: boolean;
  reload: () => void;
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
}

function sortLocally<T>(rows: T[], orderBy?: string, ascending = true): T[] {
  if (!orderBy) return rows;
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[orderBy];
    const bv = (b as Record<string, unknown>)[orderBy];
    if (av === bv) return 0;
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    const result = av > bv ? 1 : -1;
    return ascending ? result : -result;
  });
}

/**
 * Reads a table for the admin panel, falling back to the bundled seed rows
 * when Supabase is not connected. `isSeed` tells the UI to go read-only.
 */
export function useRows<T>(table: TableName, options: UseRowsOptions = {}): UseRowsResult<T> {
  const { supabase } = useAdmin();
  const { orderBy, ascending = true, filterColumn, filterValue } = options;

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeed, setIsSeed] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;

    const loadSeed = () => {
      let seeded = seedRowsFor<T>(table);
      if (filterColumn !== undefined) {
        seeded = seeded.filter(
          (row) => (row as Record<string, unknown>)[filterColumn] === filterValue
        );
      }
      if (!active) return;
      setRows(sortLocally(seeded, orderBy, ascending));
      setIsSeed(true);
      setLoading(false);
    };

    if (!supabase) {
      loadSeed();
      return () => {
        active = false;
      };
    }

    setLoading(true);
    let query = supabase.from(table).select('*');
    if (filterColumn !== undefined) {
      query = query.eq(filterColumn, filterValue as never);
    }
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    query.then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) {
        setError(queryError.message);
        loadSeed();
        return;
      }
      setError(null);
      setIsSeed(false);
      setRows((data ?? []) as T[]);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [supabase, table, orderBy, ascending, filterColumn, filterValue, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { rows, loading, error, isSeed, reload, setRows };
}

export interface MutationResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const NOT_CONNECTED =
  'Supabase bağlı değil. Kaydetmek için .env.local dosyasına bağlantı bilgilerini girin.';

/** Insert / update / delete helpers that report a Turkish message on failure. */
export function useMutations(table: TableName) {
  const { supabase, canEdit } = useAdmin();

  const guard = (): MutationResult | null => {
    if (!supabase) return { ok: false, error: NOT_CONNECTED };
    if (!canEdit) return { ok: false, error: 'Bu hesabın düzenleme yetkisi yok.' };
    return null;
  };

  const insert = useCallback(
    async (values: Record<string, unknown>): Promise<MutationResult> => {
      const blocked = guard();
      if (blocked) return blocked;
      const { data, error } = await supabase!
        .from(table)
        .insert(values as never)
        .select('id')
        .maybeSingle();
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: (data as { id?: string } | null)?.id };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, canEdit, table]
  );

  const update = useCallback(
    async (id: string | number, values: Record<string, unknown>): Promise<MutationResult> => {
      const blocked = guard();
      if (blocked) return blocked;
      const { error } = await supabase!
        .from(table)
        .update(values as never)
        .eq('id', id as never);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, canEdit, table]
  );

  const remove = useCallback(
    async (id: string | number): Promise<MutationResult> => {
      const blocked = guard();
      if (blocked) return blocked;
      const { error } = await supabase!.from(table).delete().eq('id', id as never);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, canEdit, table]
  );

  return { insert, update, remove, notConnectedMessage: NOT_CONNECTED };
}
