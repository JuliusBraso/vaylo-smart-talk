import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Loads all stored translations for a locale as a flat dot-path map.
 */
export async function fetchI18nTranslationsFromDb(
  supabase: SupabaseClient,
  locale: string,
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("i18n_translations")
    .select("key, value")
    .eq("locale", locale);

  if (error) throw error;

  const out: Record<string, string> = {};
  for (const row of data ?? []) {
    const k = typeof row.key === "string" ? row.key : "";
    const v = typeof row.value === "string" ? row.value : "";
    if (k && v) out[k] = v;
  }
  return out;
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
