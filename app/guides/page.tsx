import Link from "next/link";
import { getServerLocaleAndDict } from "@/lib/i18n/get-server-dict";
import { getGuideCatalogCopy, getGuides } from "@/lib/vaylo/guides-engine";

export default async function Page() {
  const { t } = await getServerLocaleAndDict();
  const guides = getGuides();

  return (
    <main className="container">
      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">{t.nav.guides}</div>
          <div className="cardSub muted">{t.guides.shellSubtitle}</div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {guides.map((guide) => {
            const copy = getGuideCatalogCopy(guide.id, t);
            return (
            <div key={guide.id} className="card">
              <div className="cardHeader">
                <div>
                  <div className="cardTitle" style={{ fontSize: 18 }}>
                    {copy.title}
                  </div>
                  <div className="cardSub muted">{copy.shortDescription}</div>
                </div>
                <span className="badgeSmall">{t.categoryLabels[guide.category]}</span>
              </div>

              <Link
                href={`/guides/${guide.slug}`}
                className="pill"
                style={{ textDecoration: "none", display: "inline-flex" }}
              >
                {t.guides.openGuide}
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
