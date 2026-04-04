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
  settings: Record<string, string>;
  phrases: Record<string, string>;
  premium: Record<string, string>;
};

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

export const DEFAULT_LOCALE: Locale = "de";

function deepMerge<T extends Record<string, unknown>>(base: T, patch: T): T {
  const out = { ...base };
  for (const k of Object.keys(patch) as (keyof T)[]) {
    const bv = base[k];
    const pv = patch[k];
    if (
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv) &&
      pv !== null &&
      typeof pv === "object" &&
      !Array.isArray(pv)
    ) {
      out[k] = deepMerge(bv as Record<string, unknown>, pv as Record<string, unknown>) as T[keyof T];
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out;
}

/** Merges selected locale over German so missing nested keys fall back to `de`. */
export function getDict(locale: Locale): Dict {
  const sel = DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
  if (locale === DEFAULT_LOCALE) return sel;
  return deepMerge(DICTS[DEFAULT_LOCALE] as unknown as Record<string, unknown>, sel as unknown as Record<string, unknown>) as Dict;
}
