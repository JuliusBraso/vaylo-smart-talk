import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Dict, type Locale } from "./index";
import { getResolvedDict } from "./resolved-dict";

export async function getServerLocaleAndDict(): Promise<{ locale: Locale; t: Dict }> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;
  const t = await getResolvedDict(locale);
  return { locale, t };
}
