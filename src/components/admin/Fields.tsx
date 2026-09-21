'use client';

import React, { useRef, useState } from 'react';
import { useAdmin } from './AdminProvider';
import { MEDIA_BUCKET, mediaUrl } from '@/lib/supabase/env';

/* -------------------------------------------------------------------------- */
/* Shared chrome                                                              */
/* -------------------------------------------------------------------------- */

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-3">
      <span className="font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a8378]">
        {children}
      </span>
      {hint && <span className="text-[11px] text-[#6d675e]">{hint}</span>}
    </div>
  );
}

const inputClass =
  'w-full rounded-sm border border-[#2c2926] bg-[#141312] px-3 py-2.5 text-[14px] text-[#ede8e0] outline-none transition-colors placeholder:text-[#57524b] focus:border-[#8B1117] disabled:cursor-not-allowed disabled:opacity-50';

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */

export function TextInput({
  value,
  onChange,
  disabled,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  disabled,
  rows = 4,
  placeholder,
  mono = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y leading-relaxed ${mono ? 'font-mono text-[12.5px]' : ''}`}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className={inputClass}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? 'bg-[#8B1117]' : 'bg-[#33302c]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#ede8e0] transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="font-syne text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9c2b7]">
        {label}
      </span>
    </button>
  );
}

export function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TagsInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  return (
    <TextInput
      value={value.join(', ')}
      disabled={disabled}
      placeholder="detay, malzeme, ışık"
      onChange={(next) =>
        onChange(
          next
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Image field — URL, or upload into the `media` storage bucket               */
/* -------------------------------------------------------------------------- */

export function ImageInput({
  value,
  onChange,
  disabled,
  folder = 'uploads',
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Prefix inside the bucket, so uploads stay grouped by content type. */
  folder?: string;
}) {
  const { supabase, canEdit } = useAdmin();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUpload = Boolean(supabase && canEdit) && !disabled;

  const handleFile = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    setError(null);

    // Keep the original extension so the served Content-Type is right, and
    // prefix with a timestamp so re-uploading the same name never collides.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const path = `${folder}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: '31536000', upsert: false });

    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    onChange(path);
  };

  const preview = mediaUrl(value);

  return (
    <div className="flex gap-4">
      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm border border-[#2c2926] bg-[#141312]">
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-[#57524b]">
            —
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <TextInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="/projects/1.webp veya storage yolu"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!canUpload || uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-sm border border-[#2c2926] px-3 py-1.5 font-syne text-[9px] font-bold uppercase tracking-[0.2em] text-[#c9c2b7] transition-colors hover:border-[#8B1117] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? 'YÜKLENİYOR…' : 'GÖRSEL YÜKLE'}
          </button>
          {value && !disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="font-syne text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8378] transition-colors hover:text-[#8B1117]"
            >
              TEMİZLE
            </button>
          )}
        </div>
        {!supabase && (
          <p className="text-[11px] text-[#6d675e]">
            Yükleme için Supabase bağlantısı gerekir; şimdilik yol yazabilirsiniz.
          </p>
        )}
        {error && <p className="text-[11px] text-[#e0757c]">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* JSON field — used for the structured `data` / `specs` / `socials` columns  */
/* -------------------------------------------------------------------------- */

export function JsonInput({
  value,
  onChange,
  disabled,
  rows = 10,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  rows?: number;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = useState<string | null>(null);
  const lastValue = useRef(value);

  // Re-sync when the record is replaced underneath us (e.g. after a reload),
  // but never while the editor is mid-keystroke on the same record.
  if (lastValue.current !== value) {
    lastValue.current = value;
    const next = JSON.stringify(value ?? {}, null, 2);
    if (next !== text) setText(next);
  }

  return (
    <div>
      <TextArea
        mono
        rows={rows}
        value={text}
        disabled={disabled}
        onChange={(next) => {
          setText(next);
          try {
            const parsed = JSON.parse(next || '{}');
            setError(null);
            onChange(parsed);
          } catch (parseError) {
            setError(parseError instanceof Error ? parseError.message : 'Geçersiz JSON');
          }
        }}
      />
      {error ? (
        <p className="mt-2 text-[11px] text-[#e0757c]">JSON hatası: {error}</p>
      ) : (
        <p className="mt-2 text-[11px] text-[#6d675e]">
          Geçerli JSON. Kaydetmeden önce hata olmadığından emin olun.
        </p>
      )}
    </div>
  );
}
