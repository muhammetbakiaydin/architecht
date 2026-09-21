/**
 * Declarative form description shared by every admin editor.
 *
 * A field with `i18n: true` is stored as two columns - `name_tr` and `name_en` -
 * and rendered as a pair of inputs. Everything else maps to one column.
 */

export type AdminFieldKind =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'image'
  | 'tags'
  | 'date'
  | 'select'
  | 'json';

export interface AdminField {
  kind: AdminFieldKind;
  /** Column name, or the base name when `i18n` is set. */
  name: string;
  label: string;
  i18n?: boolean;
  hint?: string;
  placeholder?: string;
  rows?: number;
  /** Span the full width instead of sharing a row. */
  full?: boolean;
  options?: { value: string; label: string }[];
  /** `image` only: storage folder new uploads land in. */
  folder?: string;
}

export interface AdminSection {
  title: string;
  description?: string;
  fields: AdminField[];
}

export type AdminSchema = AdminSection[];

/** Column names a field occupies, so defaults and payloads stay in sync. */
export function fieldColumns(field: AdminField): string[] {
  return field.i18n ? [`${field.name}_tr`, `${field.name}_en`] : [field.name];
}

export function schemaColumns(schema: AdminSchema): string[] {
  return schema.flatMap((section) => section.fields.flatMap(fieldColumns));
}

/** A blank record shaped by the schema, used when creating a new row. */
export function emptyRecord(schema: AdminSchema): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  schema.forEach((section) =>
    section.fields.forEach((field) => {
      fieldColumns(field).forEach((column) => {
        switch (field.kind) {
          case 'number':
            record[column] = null;
            break;
          case 'boolean':
            record[column] = false;
            break;
          case 'tags':
            record[column] = [];
            break;
          case 'json':
            record[column] = {};
            break;
          default:
            record[column] = '';
        }
      });
    })
  );
  return record;
}
