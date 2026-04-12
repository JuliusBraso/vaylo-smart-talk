/**
 * Compares the raw locale module to the English base and returns dot-paths
 * present in `base` but missing from `patch` (undefined at leaf level).
 *
 * Used for dev warnings and future tooling (e.g. export missing keys for translation).
 */
export function getMissingTranslationKeyPaths(
  base: unknown,
  patch: unknown,
  path: string[] = [],
): string[] {
  if (!isPlainObject(base)) return [];
  const patchObj = isPlainObject(patch) ? patch : {};
  const out: string[] = [];
  for (const key of Object.keys(base)) {
    const bv = (base as Record<string, unknown>)[key];
    const pv = patchObj[key];
    const nextPath = [...path, key];
    if (isPlainObject(bv)) {
      out.push(...getMissingTranslationKeyPaths(bv, pv, nextPath));
    } else if (pv === undefined) {
      out.push(nextPath.join("."));
    }
  }
  return out;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

const warnedLocales = new Set<string>();

/**
 * Logs each missing path once per locale per process (dev / optional prod flag).
 * Set `NEXT_PUBLIC_I18N_LOG_MISSING=1` to enable in production builds.
 */
export function warnMissingKeysOnce(
  locale: string,
  base: unknown,
  patch: unknown,
): void {
  const allow =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_I18N_LOG_MISSING === "1";
  if (!allow) return;
  if (warnedLocales.has(locale)) return;
  warnedLocales.add(locale);

  const missing = getMissingTranslationKeyPaths(base, patch);
  for (const keyPath of missing) {
    console.warn(
      `[i18n] Missing key "${keyPath}" for locale "${locale}" (filled from English)`,
    );
  }
}

/**
 * Future: pipe `getMissingTranslationKeyPaths(en, sk)` into a translator and
 * merge results into `sk.ts`. Not implemented — hook for scripts/CI.
 */
export type AutoTranslatePlaceholder = {
  locale: string;
  missingKeyPaths: string[];
};
