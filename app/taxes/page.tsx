"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { usePremium } from "@/lib/usePremium";
import { useT } from "@/lib/i18n/useT";
import { ROUTES } from "@/lib/routes";

export default function TaxesPage() {
  const router = useRouter();
  const premium = usePremium();
  const { t } = useT();

  useEffect(() => {
    if (!premium.isPremium) {
      router.replace(`${ROUTES.premium}?from=${encodeURIComponent(ROUTES.taxes)}`);
    }
  }, [premium.isPremium, router]);

  if (!premium.isPremium) return null;

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">🧾</div>
          <div>
            <div className="cardTitle">{t.nav.taxes}</div>
            <div className="cardSub">{t.app.tagline}</div>
          </div>
        </div>

        <div className="list">
          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">
                ✅ {t.nav.taxes} — Premium obsah je odomknutý
              </div>
              <div className="phraseAlt">
                Sem pôjde manuál: daňové triedy, ročné zúčtovanie, ELSTER, čo si môžeš uplatniť, a krokový postup pre bežné prípady.
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">📌 Štruktúra (pripravené)</div>
              <div className="phraseAlt">
                1) Základy v DE • 2) Daňové triedy • 3) ELSTER krok po kroku • 4) Najčastejšie odpočty • 5) Dokumenty • 6) Frázy pre Finanzamt
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">➡️ Ďalší krok</div>
              <div className="phraseAlt">
                Povedz, či chceš najprv jednoduchú verziu pre zamestnancov (najčastejšie), alebo aj živnostníkov. Potom pripravím kompletný manuál.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btnGhost" onClick={() => router.push(ROUTES.dashboard)}>
            {t.nav.dashboard}
          </button>
        </div>
      </div>
    </main>
  );
}
