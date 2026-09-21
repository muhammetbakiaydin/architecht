'use client';

import React from 'react';
import {
  FieldShell,
  ImageInput,
  JsonInput,
  NumberInput,
  Select,
  TagsInput,
  TextArea,
  TextInput,
  Toggle,
} from './Fields';
import type { AdminField, AdminSchema } from './schema';

export interface RecordFormProps {
  schema: AdminSchema;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  disabled?: boolean;
}

const str = (value: unknown) => (typeof value === 'string' ? value : value == null ? '' : String(value));
const num = (value: unknown) => (typeof value === 'number' ? value : value == null || value === '' ? null : Number(value));

/** Renders an `AdminSchema` against a plain record object. */
export default function RecordForm({ schema, value, onChange, disabled }: RecordFormProps) {
  const set = (column: string, next: unknown) => onChange({ ...value, [column]: next });

  return (
    <div className="space-y-12">
      {schema.map((section) => (
        <section key={section.title}>
          <header className="border-b border-[#26231f] pb-4">
            <h2 className="font-syne text-[11px] font-bold uppercase tracking-[0.3em] text-[#ede8e0]">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-[#8a8378]">
                {section.description}
              </p>
            )}
          </header>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {section.fields.map((field) => (
              <div
                key={field.name}
                className={field.full || field.i18n ? 'md:col-span-2' : undefined}
              >
                <FieldRenderer field={field} value={value} set={set} disabled={disabled} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  set,
  disabled,
}: {
  field: AdminField;
  value: Record<string, unknown>;
  set: (column: string, next: unknown) => void;
  disabled?: boolean;
}) {
  if (field.i18n) {
    return (
      <FieldShell label={field.label} hint={field.hint}>
        <div className="grid gap-4 md:grid-cols-2">
          {(['tr', 'en'] as const).map((locale) => {
            const column = `${field.name}_${locale}`;
            return (
              <div key={column}>
                <div className="mb-1.5 font-syne text-[9px] font-bold tracking-[0.24em] text-[#57524b]">
                  {locale.toUpperCase()}
                </div>
                <SingleInput
                  field={field}
                  column={column}
                  value={value[column]}
                  set={set}
                  disabled={disabled}
                />
              </div>
            );
          })}
        </div>
      </FieldShell>
    );
  }

  if (field.kind === 'boolean') {
    return (
      <div className="pt-6">
        <Toggle
          checked={Boolean(value[field.name])}
          onChange={(next) => set(field.name, next)}
          label={field.label}
          disabled={disabled}
        />
        {field.hint && <p className="mt-2 text-[11px] text-[#6d675e]">{field.hint}</p>}
      </div>
    );
  }

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <SingleInput
        field={field}
        column={field.name}
        value={value[field.name]}
        set={set}
        disabled={disabled}
      />
    </FieldShell>
  );
}

function SingleInput({
  field,
  column,
  value,
  set,
  disabled,
}: {
  field: AdminField;
  column: string;
  value: unknown;
  set: (column: string, next: unknown) => void;
  disabled?: boolean;
}) {
  switch (field.kind) {
    case 'textarea':
      return (
        <TextArea
          value={str(value)}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'markdown':
      return (
        <TextArea
          mono
          value={str(value)}
          rows={field.rows ?? 16}
          placeholder={field.placeholder ?? '## Başlık\n\nParagraf…'}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'number':
      return (
        <NumberInput
          value={num(value)}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'boolean':
      return (
        <Toggle
          checked={Boolean(value)}
          label={field.label}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'image':
      return (
        <ImageInput
          value={str(value)}
          folder={field.folder}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'tags':
      return (
        <TagsInput
          value={Array.isArray(value) ? (value as string[]) : []}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'date':
      return (
        <TextInput
          type="datetime-local"
          value={toDateTimeLocal(str(value))}
          disabled={disabled}
          onChange={(next) => set(column, next ? new Date(next).toISOString() : null)}
        />
      );
    case 'select':
      return (
        <Select
          value={str(value)}
          options={field.options ?? []}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    case 'json':
      return (
        <JsonInput
          value={value}
          rows={field.rows ?? 10}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
    default:
      return (
        <TextInput
          value={str(value)}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(next) => set(column, next)}
        />
      );
  }
}

/** `<input type="datetime-local">` wants `YYYY-MM-DDTHH:mm` in local time. */
function toDateTimeLocal(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}
