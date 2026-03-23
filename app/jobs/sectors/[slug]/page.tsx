"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { getSector } from "@/lib/jobs/sectors";
import { useT } from "@/lib/i18n/useT";
import { ROUTES } from "@/lib/routes";
import { usePremium } from "@/lib/usePremium";

export default function JobSectorPage() {
  const { slug } = useParams<{ slug: string }>();
  const sector = getSector(slug);
  const { t } = useT();
  const premium = usePremium();

  if (!premium.isPremium) {
    return (
      <main className="page">
        <div className="card">
          <div className="cardHeader">
            <div className="cardIcon">🔒</div>
            <div>
              <div className="cardTitle">{t.nav.jobs}</div>
              <div className="cardSub">Premium obsah je uzamknutý</div>
            </div>
          </div>

          <div className="empty">
            Odomkni Premium, aby si mal prístup k detailným sektorom.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="navpill" href={ROUTES.premium}>{t.nav.premium}</Link>
            <Link className="navpill" href={ROUTES.jobs}>{t.nav.jobs}</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!sector) {
    return (
      <main className="page">
        <div className="card">
          <div className="cardHeader">
            <div className="cardIcon">❓</div>
            <div>
              <div className="cardTitle">Sektor neexistuje</div>
              <div className="cardSub">Skontroluj odkaz alebo sa vráť späť.</div>
            </div>
          </div>
          <Link className="navpill" href={ROUTES.jobs}>{t.nav.jobs}</Link>
        </div>
      </main>
    );
  }

  const c = sector.content;
  const phrases = t.phrases as Record<string, string>;

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">{sector.icon}</div>
          <div>
            <div className="cardTitle">{t.phrases[sector.titleKey]}</div>
            <div className="cardSub">{t.phrases[sector.shortKey]}</div>
          </div>
        </div>

        <div className="list">
          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">🧠 {phrases.jobs_section_reality}</div>
              <div className="phraseAlt">{phrases[c.realityKey]}</div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">👷 {phrases.jobs_section_roles}</div>
              <div className="phraseAlt">
                <ul style={{ marginLeft: 18 }}>
                  {c.rolesKeys.map((key) => (
                    <li key={key}>{phrases[key]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">💰 {phrases.jobs_section_pay}</div>
              <div className="phraseAlt">{phrases[c.payKey]}</div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">👍 {phrases.jobs_section_pros}</div>
              <div className="phraseAlt">
                <ul style={{ marginLeft: 18 }}>
                  {c.prosKeys.map((key) => (
                    <li key={key}>{phrases[key]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">👎 {phrases.jobs_section_cons}</div>
              <div className="phraseAlt">
                <ul style={{ marginLeft: 18 }}>
                  {c.consKeys.map((key) => (
                    <li key={key}>{phrases[key]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">🎯 {phrases.jobs_section_tips}</div>
              <div className="phraseAlt">
                <ul style={{ marginLeft: 18 }}>
                  {c.tipsKeys.map((key) => (
                    <li key={key}>{phrases[key]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="phraseRow" style={{ gridTemplateColumns: "1fr" }}>
            <div className="phraseText">
              <div className="phraseMain">➡️ {phrases.jobs_section_next}</div>
              <div className="phraseAlt">
                <ul style={{ marginLeft: 18 }}>
                  {c.nextKeys.filter((key) => phrases[key]).map((key) => (
                    <li key={key}>{phrases[key]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
  <Link className="navpill" href={ROUTES.jobs}>
    {t.nav.jobs}
  </Link>

  <Link className="navpill" href={`${ROUTES.phrases}?cat=job&sector=${sector.slug}`}>
    {t.nav.phrases} • {sector.icon}
  </Link>
</div>

      </div>
    </main>
  );
}
