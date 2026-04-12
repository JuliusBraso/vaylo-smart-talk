import { after } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { translateMissingKeys } from "./auto-translate";
import type { Locale } from "./index";
import { DICTS, I18N_BASE_LOCALE } from "./index";
import { invalidateI18nDbCache } from "./i18n-db-cache";
import { insertNewI18nTranslationsOnly } from "./i18n-translations-db";
import { getValueAtPath } from "./path-value";

/** One background job per locale at a time (dedupe across concurrent workers). */
const backgroundLocaleLocks = new Set<Locale>();

export type EnqueueMissingTranslationsParams = {
  locale: Locale;
  missingKeyPaths: string[];
};

function jobLog(
  phase: "started" | "completed" | "failed",
  locale: Locale,
  detail?: Record<string, unknown>,
): void {
  const payload = { locale, ...detail };
  if (phase === "failed") {
    console.error("[i18n:job] failed", payload);
  } else {
    console.info(`[i18n:job] ${phase}`, payload);
  }
}

/**
 * Schedules LLM + DB insert after the response (`after`), or runs immediately / not at all
 * depending on {@link GetResolvedDictOptions.enqueueMode}.
 */
export function enqueueMissingTranslations(
  params: EnqueueMissingTranslationsParams,
  mode: "after" | "immediate" | "none" = "after",
): void {
  const { locale, missingKeyPaths } = params;
  if (locale === I18N_BASE_LOCALE || missingKeyPaths.length === 0) return;
  if (!process.env.OPENAI_API_KEY) return;

  if (mode === "none") return;

  if (mode === "immediate") {
    void runBackgroundTranslationJob(locale, missingKeyPaths, "immediate");
    return;
  }

  try {
    after(() => {
      void runBackgroundTranslationJob(locale, missingKeyPaths, "after");
    });
  } catch {
    jobLog("started", locale, { reason: "after_unavailable", fallback: "immediate" });
    void runBackgroundTranslationJob(locale, missingKeyPaths, "immediate");
  }
}

/**
 * Exported for instrumentation / scripts — same pipeline as the queued job.
 */
export async function executeI18nTranslationJob(
  locale: Locale,
  missingKeyPaths: string[],
): Promise<void> {
  await runBackgroundTranslationJob(locale, missingKeyPaths, "immediate");
}

async function runBackgroundTranslationJob(
  locale: Locale,
  missingKeyPaths: string[],
  trigger: "after" | "immediate",
): Promise<void> {
  if (backgroundLocaleLocks.has(locale)) {
    jobLog("started", locale, { skipped: true, reason: "lock_held", trigger });
    return;
  }
  backgroundLocaleLocks.add(locale);
  jobLog("started", locale, { keys: missingKeyPaths.length, trigger });
  try {
    const admin = createServiceRoleClient();
    if (!admin) {
      jobLog("failed", locale, { reason: "no_service_role" });
      return;
    }

    const base = DICTS[I18N_BASE_LOCALE];
    const getEnglishText = (path: string): string | undefined => {
      const v = getValueAtPath(base as unknown as Record<string, unknown>, path);
      return typeof v === "string" ? v : undefined;
    };

    const translated = await translateMissingKeys({
      locale,
      missingKeyPaths,
      getEnglishText,
    });

    const rows: Array<{
      locale: string;
      key: string;
      value: string;
      source: string;
    }> = [];

    for (const path of missingKeyPaths) {
      const value = translated[path];
      if (typeof value === "string" && value.length > 0) {
        rows.push({ locale, key: path, value, source: "llm" });
      }
    }

    const inserted = await insertNewI18nTranslationsOnly(admin, rows);
    invalidateI18nDbCache(locale);
    jobLog("completed", locale, { inserted, trigger });
  } catch (e) {
    jobLog("failed", locale, {
      trigger,
      error: e instanceof Error ? e.message : String(e),
    });
  } finally {
    backgroundLocaleLocks.delete(locale);
  }
}
