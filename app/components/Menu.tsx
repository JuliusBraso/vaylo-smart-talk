"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "../../lib/i18n/useT";
import { getEmploymentLabel, getFamilyLabel } from "@/lib/i18n/labels";
import { supabase } from "@/lib/supabase";

type SidebarProfile = {
  employmentType: string | null;
  familyStatus: string | null;
  hasAddressRegistration: boolean | null;
  email: string | null;
};

function Icon(props: { name: "home" | "tasks" | "history" | "docs" | "user" | "settings" }) {
  const common = "h-5 w-5";
  switch (props.name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M4 10.5 12 4l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 21.5v-6.2A1.3 1.3 0 0 1 10.8 14h2.4a1.3 1.3 0 0 1 1.3 1.3v6.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tasks":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M7.5 6.7h12M7.5 12h12M7.5 17.3h12"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4.8 6.7h.4M4.8 12h.4M4.8 17.3h.4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M7.5 7.5a7.5 7.5 0 1 1-2.2 5.3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4 7.8V4h3.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8v4.2l3 1.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "docs":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M7 3.8h7.5L19 8.3V20A1.6 1.6 0 0 1 17.4 21.6H7A1.6 1.6 0 0 1 5.4 20V5.4A1.6 1.6 0 0 1 7 3.8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 3.8V8.3H19"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8 12h8M8 15.5h8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M12 12.2a4.2 4.2 0 1 0-4.2-4.2 4.2 4.2 0 0 0 4.2 4.2Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M5.8 20.2a6.2 6.2 0 0 1 12.4 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path
            d="M12 14.7a2.7 2.7 0 1 0-2.7-2.7 2.7 2.7 0 0 0 2.7 2.7Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M19.3 12a7.6 7.6 0 0 0-.1-1l1.6-1.2-1.7-3-1.9.7a7.8 7.8 0 0 0-1.7-1L14.2 3H9.8L9.5 5.5a7.8 7.8 0 0 0-1.7 1l-1.9-.7-1.7 3L5.8 11a7.6 7.6 0 0 0 0 2l-1.6 1.2 1.7 3 1.9-.7a7.8 7.8 0 0 0 1.7 1L9.8 21h4.4l.3-2.5a7.8 7.8 0 0 0 1.7-1l1.9.7 1.7-3L19.2 13c.1-.3.1-.6.1-1Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export default function Menu() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const pathname = usePathname();
  const { t } = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("employment_type, family_status, has_address_registration")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;
      setProfile({
        employmentType:
          typeof data?.employment_type === "string"
            ? data.employment_type
            : null,
        familyStatus:
          typeof data?.family_status === "string" ? data.family_status : null,
        hasAddressRegistration:
          typeof data?.has_address_registration === "boolean"
            ? data.has_address_registration
            : null,
        email: user.email ?? null,
      });
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return null;

  const normalizePath = (path: string) => path.replace(/\/$/, "");
  const current = normalizePath(pathname);
  const isActive = (href: string) => {
    const normalized = normalizePath(href);
    return normalized === "/dashboard" ? current === "/dashboard" : current === normalized;
  };

  const items: Array<{
    label: string;
    href: string;
    icon: Parameters<typeof Icon>[0]["name"];
    activeMatch?: (path: string) => boolean;
  }> = [
    { label: t.nav.home, href: "/dashboard", icon: "home" },
    { label: t.nav.tasks, href: "/dashboard#tasks", icon: "tasks", activeMatch: (p) => p === "/dashboard" },
    { label: t.nav.history, href: "/dashboard#history", icon: "history", activeMatch: (p) => p === "/dashboard" },
    { label: t.nav.documents, href: "/documents", icon: "docs" },
    { label: t.nav.profile, href: "/profile", icon: "user" },
    { label: t.nav.settings, href: "/settings", icon: "settings" },
  ];

  const profileEmployment = getEmploymentLabel(profile?.employmentType, t) || t.common.unknown;
  const profileFamily = getFamilyLabel(profile?.familyStatus, t) || t.common.unknown;
  const registrationStatus =
    profile?.hasAddressRegistration === true
      ? t.dashboard.stepProcessCompleted
      : profile?.hasAddressRegistration === false
        ? t.dashboard.stepProcessEligible
        : t.common.unknown;
  const profileInitial = (profile?.email?.trim().charAt(0) || "V").toUpperCase();
  const profileSubtitle = profile?.email ?? t.settings.personal;

  return (
    <aside className="app-sidebar" aria-label={t.nav.navigation ?? "Navigation"}>
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="sidebar-brandRow">
            <div
              className="sidebar-brandIcon"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.24), transparent 60%), rgba(15, 23, 42, 0.03)",
              }}
            >
              V
            </div>
            <div className="brandTitle" style={{ fontWeight: 900, fontSize: 20 }}>
              Vaylo
            </div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {items.map((it) => {
            const active = it.activeMatch ? it.activeMatch(pathname) : isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`sidenav-link group transition-all duration-200 ease-out motion-safe:hover:translate-x-0.5 ${active ? "active" : ""}`}
              >
                <span
                  className={
                    active
                      ? "flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all"
                      : "flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100/70 text-slate-400 transition-all group-hover:bg-blue-100 group-hover:text-blue-600"
                  }
                  aria-hidden
                >
                  <Icon name={it.icon} />
                </span>
                <span
                  className={
                    active
                      ? "text-blue-600 transition-all"
                      : "text-slate-700 transition-all group-hover:text-blue-600"
                  }
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {it.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{t.dashboard.profileCardTitle}</div>
            <div className="mt-3 grid gap-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">{t.dashboard.workModeLabel}</span>
                <span className="font-medium text-slate-800">{profileEmployment}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">{t.dashboard.familyLabel}</span>
                <span className="font-medium text-slate-800">{profileFamily}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">{t.dashboard.registrationLabel}</span>
                <span className="font-medium text-slate-800">{registrationStatus}</span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {t.dashboard.editProfile}
            </Link>
          </div>
        </div>

        <div className="sidebar-footer border-t border-slate-200/60 pt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                {profileInitial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="text-xs font-semibold text-slate-900">{t.dashboard.profileCardTitle}</div>
                <div className="truncate text-[11px] text-slate-500">{profileSubtitle}</div>
              </div>
            </div>
          </div>
          <span className="versionpill">v0.1</span>
        </div>
      </div>
    </aside>
  );
}
