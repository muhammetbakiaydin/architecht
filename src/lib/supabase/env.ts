/**
 * Supabase is deliberately optional.
 *
 * The site ships with a complete set of seed content in `src/content/*` and
 * renders entirely from it when no credentials are present. The moment
 * `.env.local` carries a URL and an anon key, every data function in
 * `src/lib/content/*` switches over to the database instead - no code change.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** A placeholder left in `.env.example` must not count as "configured". */
const isPlaceholder = (value: string) =>
  value.length === 0 || value.includes('your-project') || value.includes('YOUR_');

export const isSupabaseConfigured =
  !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON_KEY);

/** Public storage bucket every uploaded asset lands in. */
export const MEDIA_BUCKET = 'media';

/**
 * Turn a stored value into something an <img src> can use.
 * Absolute URLs and `/public` paths pass through untouched; a bare storage key
 * ("projects/cover.webp") is expanded to its public bucket URL.
 */
export function mediaUrl(value: string | null | undefined): string {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return value;
  }
  if (!isSupabaseConfigured) return '';
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${value}`;
}
