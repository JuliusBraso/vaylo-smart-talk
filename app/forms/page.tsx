import Link from "next/link";
import { getServerLocaleAndDict } from "@/lib/i18n/get-server-dict";
import { getFormCatalogCopy, getForms } from "@/lib/vaylo/forms-engine";

export default async function Page() {
  const { t } = await getServerLocaleAndDict();
  const forms = getForms();

  return (
    <main className="container">
      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">{t.nav.forms}</div>
          <div className="cardSub muted">{t.forms.shellSubtitle}</div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {forms.map((form) => {
            const copy = getFormCatalogCopy(form.id, t);
            return (
            <div key={form.id} className="card">
              <div className="cardHeader">
                <div>
                  <div className="cardTitle" style={{ fontSize: 18 }}>
                    {copy.title}
                  </div>
                  <div className="cardSub muted">{copy.shortDescription}</div>
                </div>
                <span className="badgeSmall">{t.categoryLabels[form.category]}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                <span className="badgeSmall">
                  {form.authority ?? t.forms.unknownAuthority}
                </span>
              </div>

              <Link
                href={`/forms/${form.slug}`}
                className="pill"
                style={{ textDecoration: "none", display: "inline-flex" }}
              >
                {t.forms.openForm}
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
