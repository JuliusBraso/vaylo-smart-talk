import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Loads all stored translations for a locale as a flat dot-path map.
 */
export async function fetchI18nTranslationsFromDb(
  supabase: SupabaseClient,
  locale: string,
): Promise<Record<string, string>> {
  async function tryLoad(table: "i18n_translations" | "phrase_translations"): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from(table)
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
  }

  try {
    return await tryLoad("i18n_translations");
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[i18n] fallback to phrase_translations");
    }
    return await tryLoad("phrase_translations");
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
