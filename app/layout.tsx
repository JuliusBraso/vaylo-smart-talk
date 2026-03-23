import type { ReactNode } from "react";
import "./globals.css";
import LocaleProvider from "../lib/i18n/LocaleProvider";
import Menu from "./components/Menu";

export const metadata = {
  title: "Vaylo",
  description: "AI assistant for bureaucracy and life in Germany",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <LocaleProvider>
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
