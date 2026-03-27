import type { ReactNode } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import LocaleProvider from "../lib/i18n/LocaleProvider";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
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

  return (
    <html lang="de">
      <body>
        <LocaleProvider initialLocale={initialLocale}>
          <div className="container">
            <div className="topbar">
              <div className="brand">
                <span style={{ fontWeight: 700 }}>Vaylo</span>
                <span className="badge">
                  AI assistant for bureaucracy and life in Germany
                </span>
              </div>
              <div className="badge">v0.1</div>
            </div>

            <Menu />
            <div style={{ height: 14 }} />
            {children}
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
