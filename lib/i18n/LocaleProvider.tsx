"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, Dict, getDict, Locale, LOCALES, LOCALE_LABELS } from "./index";

const STORAGE_KEY = "wk_uiLang";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
  localeLabel: (l: Locale) => string;
  locales: readonly Locale[];
};

export const LocaleContext = createContext<Ctx | null>(null);

function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && isLocale(v)) return v;
  } catch {}
  return null;
}

function writeStoredLocale(l: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {}
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // init: DE-first (unless user already picked language)
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
    else setLocaleState(DEFAULT_LOCALE);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    writeStoredLocale(l);
  }, []);

  const t = useMemo(() => getDict(locale), [locale]);

  const localeLabel = useCallback((l: Locale) => {
    const dict = getDict(l);
    return LOCALE_LABELS[l] ?? dict.app?.languageName ?? l;
  }, []);

  const value: Ctx = useMemo(
    () => ({ locale, setLocale, t, localeLabel, locales: LOCALES }),
    [locale, setLocale, t, localeLabel]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
