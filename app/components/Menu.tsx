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
    <nav className="topnav">
      <div className="topnav-inner">
        <div className="topnav-left">
          <div className="brandTitle">{t.app.name}</div>
          <div className="brandTag">{t.app.tagline}</div>
        </div>

        <div className="topnav-center">
          <Link className={`navpill ${isActive("/dashboard") ? "active" : ""}`} href="/dashboard">
            {t.nav.dashboard}
          </Link>
          <Link className={`navpill ${isActive("/assistant") ? "active" : ""}`} href="/assistant">
            {t.nav.assistant}
          </Link>
          <Link className={`navpill ${isActive("/letters") ? "active" : ""}`} href="/letters">
            {t.nav.letters}
          </Link>
          <Link className={`navpill ${isActive("/forms") ? "active" : ""}`} href="/forms">
            {t.nav.forms}
          </Link>
          <Link className={`navpill ${isActive("/guides") ? "active" : ""}`} href="/guides">
            {t.nav.guides}
          </Link>
          <Link className={`navpill ${isActive("/documents") ? "active" : ""}`} href="/documents">
            {t.nav.documents}
          </Link>
          <Link className={`navpill ${isActive("/premium") ? "active" : ""}`} href="/premium">
            {t.nav.premium}
          </Link>
        </div>

        <div className="topnav-right">
          <LanguageSwitcher />
          <span className="versionpill">v0.1</span>
        </div>
      </div>
    </nav>
  );
}
