import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocaleAndDict } from "@/lib/i18n/get-server-dict";
import {
  getGuideBySlug,
  getGuideCatalogCopy,
  getGuideStepCopy,
} from "@/lib/vaylo/guides-engine";

type Props = {
  params: Promise<{ slug: string }>;
};

const LETTER_PREFILL_MAP: Record<
  string,
  { type: "email" | "letter"; authority: string; context: string }
> = {
  anmeldung_appointment_request: {
    type: "email",
    authority: "Bürgeramt",
    context: "I need an appointment for Anmeldung",
  },
  tax_id_followup_request: {
    type: "email",
    authority: "Finanzamt",
    context: "I need help regarding my Steuer-ID",
  },
  kindergeld_status_request: {
    type: "email",
    authority: "Familienkasse",
    context: "I want to ask about my Kindergeld application status",
  },
  residence_extension_request: {
    type: "email",
    authority: "Ausländerbehörde",
    context: "I want to request a residence permit extension",
  },
  insurance_membership_request: {
    type: "email",
    authority: "Health Insurance",
    context: "I want to request health insurance membership information",
  },
};

const FORM_LINK_MAP: Record<string, string> = {
  anmeldung_form: "anmeldung-form",
  tax_number_registration: "steuer-number-registration",
  kg1_main_form: "kindergeld-main-application",
  anlage_kind: "kindergeld-main-application",
  insurance_membership_application: "health-insurance-membership",
  residence_extension_form: "residence-extension-application",
};

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const { t } = await getServerLocaleAndDict();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const copy = getGuideCatalogCopy(guide.id, t);

  return (
    <main className="container">
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">{copy.title}</div>
            <div className="cardSub muted">{copy.shortDescription}</div>
          </div>
          <span className="badgeSmall">{t.categoryLabels[guide.category]}</span>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="cardHeader">
            <div className="cardTitle" style={{ fontSize: 18 }}>
              {t.guides.detailSteps}
            </div>
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 10 }}>
            {guide.steps.map((step, idx) => {
              const stepCopy = getGuideStepCopy(guide.id, step.id, t, step);
              return (
              <li key={step.id}>
                <div style={{ fontWeight: 800 }}>
                  {idx + 1}. {stepCopy.title}
                </div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {stepCopy.text}
                </div>
              </li>
              );
            })}
          </ol>
        </div>

        {(guide.relatedLetters?.length || guide.relatedForms?.length) && (
          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardHeader">
              <div className="cardTitle" style={{ fontSize: 18 }}>
                {t.guides.detailRelatedResources}
              </div>
            </div>

            {guide.relatedLetters?.length ? (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {t.guides.detailRelatedLetters}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {guide.relatedLetters.map((item) => (
                    <Link
                      key={item}
                      href={
                        LETTER_PREFILL_MAP[item]
                          ? `/letters?${new URLSearchParams({
                              type: LETTER_PREFILL_MAP[item].type,
                              authority: LETTER_PREFILL_MAP[item].authority,
                              context: LETTER_PREFILL_MAP[item].context,
                            }).toString()}`
                          : "/letters"
                      }
                      className="badgeSmall"
                      style={{ textDecoration: "none" }}
                    >
                      {t.guides.openLetterLink.replace("{id}", item)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {guide.relatedForms?.length ? (
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {t.guides.detailRelatedForms}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {guide.relatedForms.map((item) =>
                    FORM_LINK_MAP[item] ? (
                      <Link
                        key={item}
                        href={`/forms/${FORM_LINK_MAP[item]}`}
                        className="badgeSmall"
                        style={{ textDecoration: "none" }}
                      >
                        {t.guides.openFormLink.replace("{id}", item)}
                      </Link>
                    ) : (
                      <span key={item} className="badgeSmall">
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
