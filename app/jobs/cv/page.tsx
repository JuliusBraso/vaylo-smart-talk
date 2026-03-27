"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/useT";
import { usePremium } from "@/lib/usePremium";
import { ROUTES } from "@/lib/routes";

export default function CvWorkflowPage() {
  const { t } = useT();
  const premium = usePremium();

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">📄</div>
          <div>
            <div className="cardTitle">{t.dashboard.cvWorkflowTitle}</div>
            <div className="cardSub">{t.dashboard.cvWorkflowDesc}</div>
          </div>
        </div>

        {!premium.isPremium ? (
          <div className="empty" style={{ marginBottom: 12 }}>
            {t.dashboard.cvWorkflowPremiumNote}
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="navpill" href={ROUTES.premium}>
                {t.nav.premium}
              </Link>
              <Link className="navpill" href={ROUTES.jobs}>
                {t.nav.jobs}
              </Link>
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gap: 10,
            opacity: premium.isPremium ? 1 : 0.55,
            pointerEvents: premium.isPremium ? "auto" : "none",
          }}
        >
          <Link className="pill" href="/documents" style={{ textDecoration: "none" }}>
            {t.dashboard.cvWorkflowActionUpload}
          </Link>
          <Link className="pill" href={ROUTES.jobs} style={{ textDecoration: "none" }}>
            {t.dashboard.cvWorkflowActionCreate}
          </Link>
          <Link className="pill" href={ROUTES.jobs} style={{ textDecoration: "none" }}>
            {t.dashboard.cvWorkflowActionCheck}
          </Link>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="navpill" href={ROUTES.dashboard}>
            {t.nav.dashboard}
          </Link>
          <Link className="navpill" href={ROUTES.jobs}>
            {t.nav.jobs}
          </Link>
        </div>
      </div>
    </main>
  );
}

