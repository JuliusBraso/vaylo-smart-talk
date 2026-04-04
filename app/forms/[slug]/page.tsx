import { notFound } from "next/navigation";
import { getServerLocaleAndDict } from "@/lib/i18n/get-server-dict";
import {
  getFormBySlug,
  getFormCatalogCopy,
  getFormFieldCopy,
} from "@/lib/vaylo/forms-engine";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function FormDetailPage({ params }: Props) {
  const { slug } = await params;
  const { t } = await getServerLocaleAndDict();
  const form = getFormBySlug(slug);

  if (!form) {
    notFound();
  }

  const copy = getFormCatalogCopy(form.id, t);

  return (
    <main className="container">
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">{copy.title}</div>
            <div className="cardSub muted">{copy.shortDescription}</div>
          </div>
          <span className="badgeSmall">{t.categoryLabels[form.category]}</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span className="badgeSmall">
            {form.authority ?? t.forms.unknownAuthority}
          </span>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="cardHeader">
            <div className="cardTitle" style={{ fontSize: 18 }}>
              {t.forms.detailFields}
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {form.fields.map((field) => {
              const fieldCopy = getFormFieldCopy(form.id, field.id, t, field);
              return (
              <div
                key={field.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: 10,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800 }}>{fieldCopy.label}</div>
                  {field.required ? (
                    <span className="badgeSmall">{t.forms.fieldRequired}</span>
                  ) : null}
                </div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {fieldCopy.explanation}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
