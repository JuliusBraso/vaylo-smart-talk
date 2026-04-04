import { cookies } from "next/headers";
import { DEFAULT_LOCALE, getDict, LOCALES, type Dict, type Locale } from "./index";

export async function getServerLocaleAndDict(): Promise<{ locale: Locale; t: Dict }> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;
  return { locale, t: getDict(locale) };
}
