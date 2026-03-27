"use client";

import { useT } from "../../lib/i18n/useT";
import { LOCALE_LABELS, Locale } from "../../lib/i18n";
import Link from "next/link";

export default function SettingsPage() {
  const { t, locale, setLocale } = useT();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLocale(e.target.value as Locale);
  }

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">⚙️</div>
          <div>
            <div className="cardTitle">{t.settings.title}</div>
            <div className="cardSub">
              {t.settings.appLanguage}
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">{t.settings.appLanguage}</label>
          <select
            className="select"
            value={locale}
            onChange={handleChange}
          >
            {Object.entries(LOCALE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link className="navpill" href="/profile/edit">
            {t.dashboard.editProfile}
          </Link>
          <span style={{ width: 8, display: "inline-block" }} />
          <Link className="navpill" href="/profile/refine">
            {t.dashboard.refineProfile}
          </Link>
        </div>
      </div>
    </main>
  );
}
