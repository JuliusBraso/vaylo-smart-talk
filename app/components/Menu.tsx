"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "../../lib/i18n/useT";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Menu() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="app-sidebar" aria-label={t.nav.navigation ?? "Navigation"}>
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="sidebar-brandRow">
            <div className="sidebar-brandIcon" aria-hidden>
              V
            </div>
            <div className="brandTitle">Vaylo</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            className={`sidenav-link ${isActive("/dashboard") ? "active" : ""}`}
            href="/dashboard"
          >
            {t.nav.dashboard}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/assistant") ? "active" : ""}`}
            href="/assistant"
          >
            {t.nav.assistant}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/letters") ? "active" : ""}`}
            href="/letters"
          >
            {t.nav.letters}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/forms") ? "active" : ""}`}
            href="/forms"
          >
            {t.nav.forms}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/guides") ? "active" : ""}`}
            href="/guides"
          >
            {t.nav.guides}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/documents") ? "active" : ""}`}
            href="/documents"
          >
            {t.nav.documents}
          </Link>
          <Link
            className={`sidenav-link ${isActive("/premium") ? "active" : ""}`}
            href="/premium"
          >
            {t.nav.premium}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <LanguageSwitcher />
          <span className="versionpill">v0.1</span>
        </div>
      </div>
    </aside>
  );
}
