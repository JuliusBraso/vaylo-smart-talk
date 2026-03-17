"use client";

import Link from "next/link";
import { JOB_SECTORS } from "@/lib/jobs/sectors";

import { useT } from "@/lib/i18n/useT";
import { ROUTES } from "@/lib/routes";

// ak máš Premium guard, nechaj to. Ak usePremium nemáš, daj vedieť a spravíme jednoduchú verziu.
import { usePremium } from "@/lib/usePremium";

export default function JobsPage() {
  const { t } = useT();
  const premium = usePremium();

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">💼</div>
          <div>
            <div className="cardTitle">{t.nav.jobs}</div>
            <div className="cardSub">{t.app.tagline}</div>
          </div>
        </div>

        {!premium.isPremium && (
          <div className="empty" style={{ marginBottom: 12 }}>
            Táto časť je v Premium. Odomkni Premium pre plný Jobs Guide.
            <div style={{ marginTop: 10 }}>
              <Link className="navpill" href={ROUTES.premium}>
                {t.nav.premium}
              </Link>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 10,
            opacity: premium.isPremium ? 1 : 0.55,
            pointerEvents: premium.isPremium ? "auto" : "none",
          }}
        >
          {JOB_SECTORS.map((s) => (
            <Link
              key={s.slug}
              href={`/jobs/sectors/${s.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card" style={{ padding: 14, marginTop: 0 }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontWeight: 900, marginTop: 6 }}>{t.phrases[s.titleKey]}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{t.phrases[s.shortKey]}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btnGhost" onClick={() => (window.location.href = ROUTES.dashboard)}>
            {t.nav.dashboard}
          </button>
        </div>
      </div>
    </main>
  );
}
