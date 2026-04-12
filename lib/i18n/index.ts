import { deepMergeDict } from "./merge-dict";
import { warnMissingKeysOnce } from "./missing-keys";
import bg from "./locales/bg";
import cs from "./locales/cs";
import de from "./locales/de";
import en from "./locales/en";
import hu from "./locales/hu";
import pl from "./locales/pl";
import ro from "./locales/ro";
import ru from "./locales/ru";
import sk from "./locales/sk";
import tr from "./locales/tr";
import uk from "./locales/uk";

export const LOCALES = ["de", "sk", "en", "hu", "pl", "cs", "ro", "bg", "uk", "tr", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  sk: "Slovenčina",
  en: "English",
  hu: "Magyar",
  pl: "Polski",
  cs: "Čeština",
  ro: "Română",
  bg: "Български",
  uk: "Українська",
  tr: "Türkçe",
  ru: "Русский",
};

/** Centralized labels for DB-backed enums (see lib/i18n/labels.ts). */
export type CommonLabels = {
  /** Shown when a stored enum value has no mapping (never raw DB strings). */
  unknown: string;
  employment: {
    freelancer: string;
    employee: string;
    job_seeker: string;
  };
  family: {
    single: string;
    family: string;
    children: string;
  };
  language: {
    A1: string;
    A2: string;
    B1: string;
    B2: string;
    C1: string;
  };
  goals: {
    bureaucracy: string;
    job: string;
    orientation: string;
  };
};

/** Forms / guides catalog cards and shared category badges (Phase A). */
export type ContentCategory =
  | "residence"
  | "family"
  | "work"
  | "tax"
  | "health"
  | "documents"
  | "school"
  | "benefits"
  | "other";

export type CatalogCardCopy = {
  title: string;
  shortDescription: string;
};

/** Form field body copy on detail pages (Phase B). */
export type FormFieldCopy = {
  label: string;
  explanation: string;
};

/** Guide step body copy on detail pages (Phase B). */
export type GuideStepCopy = {
  title: string;
  text: string;
};

export type Dict = {
  app: {
    name: string;
    tagline: string;
    languageName?: string;
  };
  common: CommonLabels;
  nav: Record<string, string>;
  onboarding: Record<string, string>;
  assistant: Record<string, string>;
  chat: Record<string, string>;
  nudges: Record<string, string>;
  guides: Record<string, string>;
  dashboard: Record<string, string>;
  documents: Record<string, string>;
  documentDetail: Record<string, string>;
  forms: Record<string, string>;
  letters: Record<string, string>;
  formsCatalog: Record<string, CatalogCardCopy>;
  guidesCatalog: Record<string, CatalogCardCopy>;
  categoryLabels: Record<ContentCategory, string>;
  formsDetail: Record<string, Record<string, FormFieldCopy>>;
  guidesDetail: Record<string, Record<string, GuideStepCopy>>;
  settings: Record<string, string>;
  /** Phrase explorer + Smart Phrases (recommendedTitle, recommendedSubtitle, explorer*, …). */
  phrases: Record<string, string>;
  premium: Record<string, string>;
  /**
   * Optional flat map for DB `knowledge.*` message keys (short keys without `knowledge.` prefix).
   * Used by server-side dashboard enrichment; merged from locale over English (`I18N_BASE_LOCALE`).
   */
  knowledge?: Record<string, string>;
};

/** Canonical copy lives in `en`; all other locales are deep-merged over this. */
export const I18N_BASE_LOCALE: Locale = "en";

export const DICTS: Record<Locale, Dict> = {
  de,
  sk,
  en,
  hu,
  pl,
  cs,
  ro,
  bg,
  uk,
  tr,
  ru,
};

/** Default UI locale when cookie/param is absent (routing / provider only — not the i18n merge base). */
export const DEFAULT_LOCALE: Locale = "de";

/**
 * Returns a complete dictionary for `locale`: {@link I18N_BASE_LOCALE} (English) plus
 * deep overrides from the locale file. Missing keys never surface as another language —
 * they inherit English. Shallow spread is not used because nested sections (`dashboard`, …)
 * would drop sibling keys when a locale only overrides part of a subtree.
 */
export function getDict(locale: Locale): Dict {
  const base = DICTS[I18N_BASE_LOCALE];
  if (locale === I18N_BASE_LOCALE) {
    return base;
  }
  const patch = DICTS[locale];
  if (patch === undefined) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[i18n] Unknown locale "${String(locale)}", falling back to English`,
      );
    }
    return base;
  }
  warnMissingKeysOnce(locale, base, patch);
  return deepMergeDict(
    base as unknown as Record<string, unknown>,
    patch as unknown as Record<string, unknown>,
  ) as Dict;
}

/** For scripts / CI: list dot-paths defined in English but absent from a raw locale file. */
export { getMissingTranslationKeyPaths } from "./missing-keys";
