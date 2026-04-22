import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Loads all stored translations for a locale as a flat dot-path map.
 */
export async function fetchI18nTranslationsFromDb(
  supabase: SupabaseClient,
  locale: string,
): Promise<Record<string, string>> {
  // Compatibility: DB-backed i18n is optional. If the table is missing or schema differs,
  // fall back to locale files only (no cascading errors).
  const warnKey = `${locale}:i18n_translations_unavailable`;
  const warned = (globalThis as unknown as { __vaylo_i18n_warned?: Set<string> }).__vaylo_i18n_warned;
  const warnOnce = () => {
    if (process.env.NODE_ENV !== "development") return;
    const g = globalThis as unknown as { __vaylo_i18n_warned?: Set<string> };
    if (!g.__vaylo_i18n_warned) g.__vaylo_i18n_warned = new Set();
    if (g.__vaylo_i18n_warned.has(warnKey)) return;
    g.__vaylo_i18n_warned.add(warnKey);
    console.warn("[i18n] translations table unavailable, using locale-file fallback only");
  };

  try {
    const { data, error } = await supabase
      .from("i18n_translations")
      .select("key, value")
      .eq("locale", locale);

    if (error) throw error;

    const out: Record<string, string> = {};
    for (const row of data ?? []) {
      const k = typeof (row as { key?: unknown }).key === "string" ? ((row as { key: string }).key as string) : "";
      const v = typeof (row as { value?: unknown }).value === "string" ? ((row as { value: string }).value as string) : "";
      if (k && v) out[k] = v;
    }
    return out;
  } catch {
    warnOnce();
    return {};
  }
}

export type I18nTranslationRow = {
  locale: string;
  key: string;
  value: string;
  source?: string;
};

/**
 * Inserts rows with `ON CONFLICT (locale, key) DO NOTHING` via RPC — no duplicate-key crashes.
 */
export async function insertNewI18nTranslationsOnly(
  supabase: SupabaseClient,
  rows: I18nTranslationRow[],
): Promise<number> {
  if (rows.length === 0) return 0;

  const locale = rows[0]?.locale;
  if (!locale) return 0;

  const p_items = rows.map((r) => ({
    key: r.key,
    value: r.value,
    source: r.source ?? "llm",
  }));

  const { data, error } = await supabase.rpc("i18n_insert_translations_if_missing", {
    p_locale: locale,
    p_items,
  });

  if (error) throw error;

  const n = typeof data === "number" ? data : typeof data === "string" ? Number.parseInt(data, 10) : Number(data);
  return Number.isFinite(n) ? n : 0;
}
