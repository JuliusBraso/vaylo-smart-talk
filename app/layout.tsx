import type { ReactNode } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import LocaleProvider from "../lib/i18n/LocaleProvider";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import Menu from "./components/Menu";

export const metadata = {
  title: "Vaylo",
  description: "AI assistant for bureaucracy and life in Germany",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const initialLocale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;

  const initialDict = await getResolvedDict(initialLocale);

  return (
    <html lang="de">
      <body>
        <LocaleProvider initialLocale={initialLocale} initialDict={initialDict}>
          <div className="app-shell">
            <Menu />
            <div className="app-main">
              <div className="container">{children}</div>
            </div>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
