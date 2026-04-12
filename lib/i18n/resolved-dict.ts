import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { enqueueMissingTranslations } from "./enqueue-missing-translations";
import { getCachedDbFlat, setCachedDbFlat } from "./i18n-db-cache";
import { fetchI18nTranslationsFromDb } from "./i18n-translations-db";
import type { Dict, Locale } from "./index";
import { DICTS, I18N_BASE_LOCALE } from "./index";
import { deepMergeDict } from "./merge-dict";
import { getMissingTranslationKeyPaths } from "./missing-keys";
import { applyFlatStringValues } from "./path-value";

const generatedDir = () => join(process.cwd(), "lib", "i18n", "generated");

const memoryFlatByLocale = new Map<Locale, Record<string, string>>();

const inflight = new Map<Locale, Promise<Dict>>();

export type GetResolvedDictOptions = {
  /** Skip Next.js cookie client (e.g. anon client for instrumentation / scripts). */
  supabase?: SupabaseClient;
  /** Default: `after`. Use `immediate` for startup prewarm; `none` to skip background work. */
  enqueueMode?: "after" | "immediate" | "none";
};

function loadGeneratedFile(locale: Locale): Record<string, string> {
  try {
    const p = join(generatedDir(), `${locale}.json`);
    if (!existsSync(p)) return {};
    const raw = readFileSync(p, "utf8");
    const j = JSON.parse(raw) as unknown;
    if (j === null || typeof j !== "object" || Array.isArray(j)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(j as Record<string, unknown>)) {
      if (typeof v === "string" && v.length > 0) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function persistGeneratedFile(locale: Locale, flat: Record<string, string>): void {
  if (process.env.I18N_PERSIST_TRANSLATIONS !== "1") return;
  try {
    const dir = generatedDir();
    mkdirSync(dir, { recursive: true });
    const p = join(dir, `${locale}.json`);
    writeFileSync(p, `${JSON.stringify(flat, null, 2)}\n`, "utf8");
  } catch {
    // optional persistence
  }
}

function combinedFlatOverlay(
  locale: Locale,
  dbFlat: Record<string, string>,
): Record<string, string> {
  const fromFile = loadGeneratedFile(locale);
  const fromMem = memoryFlatByLocale.get(locale) ?? {};
  return { ...fromFile, ...fromMem, ...dbFlat };
}

/**
 * English base + locale module + DB + optional overlays. LLM work is never awaited here.
 */
export async function getResolvedDict(
  locale: Locale,
  options?: GetResolvedDictOptions,
): Promise<Dict> {
  if (locale === I18N_BASE_LOCALE) {
    return DICTS[I18N_BASE_LOCALE];
  }

  const patch = DICTS[locale];
  if (patch === undefined) {
    return DICTS[I18N_BASE_LOCALE];
  }

  const pending = inflight.get(locale);
  if (pending) return pending;

  const work = resolveLocaleAsync(locale, patch, options).finally(() => {
    inflight.delete(locale);
  });
  inflight.set(locale, work);
  return work;
}

async function resolveLocaleAsync(
  locale: Locale,
  patch: Dict,
  options?: GetResolvedDictOptions,
): Promise<Dict> {
  const base = DICTS[I18N_BASE_LOCALE];

  const merged = deepMergeDict(
    base as unknown as Record<string, unknown>,
    patch as unknown as Record<string, unknown>,
  ) as unknown as Dict;

  const missing = getMissingTranslationKeyPaths(base, patch);
  if (missing.length === 0) {
    return merged;
  }

  const clone = structuredClone(merged) as unknown as Record<string, unknown>;

  let dbFlat: Record<string, string> = {};
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const cached = getCachedDbFlat(locale);
    if (cached) {
      dbFlat = cached;
    } else {
      try {
        const supabase =
          options?.supabase ??
          (await (await import("@/lib/supabase/server")).createClient());
        dbFlat = await fetchI18nTranslationsFromDb(supabase, locale);
        setCachedDbFlat(locale, dbFlat);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[i18n] i18n_translations load failed:", e);
        }
      }
    }
  }

  const overlay = combinedFlatOverlay(locale, dbFlat);
  const applyFirst: Record<string, string> = {};
  for (const path of missing) {
    const v = overlay[path];
    if (typeof v === "string" && v.length > 0) {
      applyFirst[path] = v;
    }
  }
  applyFlatStringValues(clone, applyFirst);

  const stillMissing = missing.filter((p) => {
    const v = overlay[p];
    return typeof v !== "string" || !v.trim();
  });

  const enqueueMode = options?.enqueueMode ?? "after";

  if (stillMissing.length > 0) {
    enqueueMissingTranslations(
      {
        locale,
        missingKeyPaths: stillMissing,
      },
      enqueueMode,
    );

    if (process.env.NODE_ENV === "development") {
      console.info(
        `[i18n] Missing ${stillMissing.length} key(s) for locale "${locale}" (enqueueMode=${enqueueMode})`,
      );
    }
  }

  return clone as Dict;
}

export function mergeLocalGeneratedStrings(locale: Locale, updates: Record<string, string>): void {
  if (Object.keys(updates).length === 0) return;
  const prev = memoryFlatByLocale.get(locale) ?? {};
  memoryFlatByLocale.set(locale, { ...prev, ...updates });
  const persisted = { ...loadGeneratedFile(locale), ...updates };
  persistGeneratedFile(locale, persisted);
}
