import { createClient } from "@supabase/supabase-js";
import { getResolvedDict } from "./resolved-dict";
import type { Locale } from "./index";
import { LOCALES } from "./index";

/**
 * Warms the DB translation cache and schedules translation work for any gaps
 * (same pipeline as a normal request, with `enqueueMode: "immediate"`).
 */
export async function prewarmLocale(locale: Locale): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    console.warn("[i18n:prewarm] Missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY — skip");
    return;
  }

  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await getResolvedDict(locale, { supabase, enqueueMode: "immediate" });
}

/**
 * Reads `I18N_PREWARM_LOCALES` (comma-separated, e.g. `sk,de`) and prewarms each.
 * Safe to call from `instrumentation.ts` on server startup.
 */
export async function prewarmLocalesFromEnv(): Promise<void> {
  const raw = process.env.I18N_PREWARM_LOCALES?.trim() ?? "";
  if (!raw) return;

  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const p of parts) {
    if (!(LOCALES as readonly string[]).includes(p)) {
      console.warn(`[i18n:prewarm] Unknown locale in I18N_PREWARM_LOCALES: ${p}`);
      continue;
    }
    try {
      await prewarmLocale(p as Locale);
      console.info(`[i18n:prewarm] finished locale=${p}`);
    } catch (e) {
      console.error(`[i18n:prewarm] failed locale=${p}`, e);
    }
  }
}
