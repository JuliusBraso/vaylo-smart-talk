import bg from "./locales/bg";
import cs from "./locales/cs";
import de from "./locales/de";
import hu from "./locales/hu";
import pl from "./locales/pl";
import ro from "./locales/ro";
import ru from "./locales/ru";
import sk from "./locales/sk";
import tr from "./locales/tr";
import uk from "./locales/uk";

export const LOCALES = ["de", "sk", "hu", "pl", "cs", "ro", "bg", "uk", "tr", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  sk: "Slovenčina",
  hu: "Magyar",
  pl: "Polski",
  cs: "Čeština",
  ro: "Română",
  bg: "Български",
  uk: "Українська",
  tr: "Türkçe",
  ru: "Русский",
};

export type Dict = {
  app: {
    name: string;
    tagline: string;
    languageName?: string;
  };
  nav: Record<string, string>;
  onboarding: Record<string, string>;
  assistant: Record<string, string>;
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

/** Safe getter with DE fallback for missing keys */
export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}
