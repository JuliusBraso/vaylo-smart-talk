/**
 * Short-lived in-process cache for `i18n_translations` rows (flat map per locale).
 * Reduces DB load; invalidated after successful inserts or manually.
 */

const DEFAULT_TTL_MS = 90_000;

function ttlMs(): number {
  const raw = process.env.I18N_DB_CACHE_TTL_MS;
  if (!raw) return DEFAULT_TTL_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 10_000 && n <= 600_000 ? n : DEFAULT_TTL_MS;
}

const cache = new Map<string, { data: Record<string, string>; ts: number }>();

export function getCachedDbFlat(locale: string): Record<string, string> | null {
  const hit = cache.get(locale);
  if (!hit) return null;
  if (Date.now() - hit.ts > ttlMs()) {
    cache.delete(locale);
    return null;
  }
  return hit.data;
}

export function setCachedDbFlat(locale: string, data: Record<string, string>): void {
  cache.set(locale, { data, ts: Date.now() });
}

export function invalidateI18nDbCache(locale?: string): void {
  if (locale === undefined) {
    cache.clear();
    return;
  }
  cache.delete(locale);
}
