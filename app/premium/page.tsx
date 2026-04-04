"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearPremium, setPremium } from "../../lib/premium";
import { usePremium } from "../../lib/usePremium";

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="card">Loading…</div>}>
      <PremiumPageInner />
    </Suspense>
  );
}

function PremiumPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/dashboard";
  const premium = usePremium();

  const unlockTest = () => {
    setPremium({ isPremium: true, source: "test" });
    router.replace(from);
  };

  const lockAgain = () => {
    clearPremium();
    router.refresh();
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">🔓 Unlock Premium</div>
        <div className="cardSubtitle">One-time purchase • Lifetime access</div>
      </div>

      <div className="divider" />

      <div style={{ display: "grid", gap: 10 }}>
        <div className="tile" style={{ cursor: "default" }}>
          <div className="tileTop">
            <span className="tileIcon">💼</span>
            <span className="tileTitle">Job Guide (A0–C1)</span>
          </div>
          <div className="tileDesc">
            Step-by-step guide for finding work, applying, and basic communication.
          </div>
        </div>

        <div className="tile" style={{ cursor: "default" }}>
          <div className="tileTop">
            <span className="tileIcon">🧾</span>
            <span className="tileTitle">Tax Manual</span>
          </div>
          <div className="tileDesc">
            Clear explanations + phrases for Finanzamt and ELSTER.
          </div>
        </div>

        <div className="tile" style={{ cursor: "default" }}>
          <div className="tileTop">
            <span className="tileIcon">📦</span>
            <span className="tileTitle">Full Packs</span>
          </div>
          <div className="tileDesc">
            All categories and full phrase packs (work, doctor, travel, shopping…).
          </div>
        </div>

        <div className="hint">
          ✅ Search & Favorites stay free for everyone.
        </div>
      </div>

      <div className="divider" />

      <div style={{ display: "grid", gap: 10 }}>
        <button className="btnPrimary" onClick={unlockTest}>
          Unlock Premium — 14,99 €
        </button>

        <button className="btnGhost" onClick={() => router.push("/dashboard")}>
          Not now
        </button>

        {premium.isPremium && (
          <button className="btnGhost" onClick={lockAgain}>
            (Test) Remove Premium
          </button>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6, lineHeight: 1.35 }}>
        Note: Google Play Billing will replace the test button later. This screen is ready for it.
      </div>
    </div>
  );
}
