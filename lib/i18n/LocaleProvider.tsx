"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
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

function writeStoredLocale(l: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {}
}

function writeLocaleCookie(l: Locale) {
  try {
    document.cookie = `wk_uiLang=${l}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

export default function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    writeStoredLocale(l);
    writeLocaleCookie(l);
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
