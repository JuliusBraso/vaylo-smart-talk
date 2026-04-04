"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/useT";

export default function Page() {
  const { t } = useT();
  const L = t.letters;
  const searchParams = useSearchParams();
  const [type, setType] = useState<"email" | "letter">("email");
  const [authority, setAuthority] = useState<
    | "Bürgeramt"
    | "Finanzamt"
    | "Jobcenter"
    | "Ausländerbehörde"
    | "Kita / School"
    | "Health Insurance"
    | "Familienkasse"
    | "Other"
  >("Bürgeramt");
  const [requestText, setRequestText] = useState("");
  const [preview, setPreview] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const authorityMap: Record<typeof authority, string> = {
    "Bürgeramt": "an das Bürgeramt",
    Finanzamt: "an das Finanzamt",
    Jobcenter: "an das Jobcenter",
    Ausländerbehörde: "an die Ausländerbehörde",
    "Kita / School": "an die Kita / Schule",
    "Health Insurance": "an die Krankenversicherung",
    Familienkasse: "an die Familienkasse",
    Other: "an die zuständige Stelle",
  };

  const authorityLabel = (a: typeof authority) => {
    switch (a) {
      case "Bürgeramt":
        return L.authorityBuergeramt;
      case "Finanzamt":
        return L.authorityFinanzamt;
      case "Jobcenter":
        return L.authorityJobcenter;
      case "Ausländerbehörde":
        return L.authorityAuslaender;
      case "Kita / School":
        return L.authorityKitaSchool;
      case "Health Insurance":
        return L.authorityHealthInsurance;
      case "Familienkasse":
        return L.authorityFamilienkasse;
      case "Other":
        return L.authorityOther;
      default:
        return a;
    }
  };

  useEffect(() => {
    const qType = searchParams.get("type");
    const qAuthority = searchParams.get("authority");
    const qContext = searchParams.get("context");

    const hasPrefill = Boolean(qType || qAuthority || qContext);
    setPrefilled(hasPrefill);

    if (qType === "email" || qType === "letter") {
      setType(qType);
    }

    const allowedAuthorities: Array<typeof authority> = [
      "Bürgeramt",
      "Finanzamt",
      "Jobcenter",
      "Ausländerbehörde",
      "Kita / School",
      "Health Insurance",
      "Familienkasse",
      "Other",
    ];

    if (
      qAuthority &&
      (allowedAuthorities as string[]).includes(qAuthority)
    ) {
      setAuthority(qAuthority as typeof authority);
    }

    if (qContext) {
      setRequestText(qContext);
    }
  }, [searchParams]);

  const handleGenerate = () => {
    const body = requestText.trim() || "(Bitte hier Anliegen ergänzen)";
    const recipient = authorityMap[authority];

    const generated = `Sehr geehrte Damen und Herren,

ich schreibe ${recipient} wegen folgendem Anliegen:

${body}

Mit freundlichen Grüßen`;

    setPreview(generated);
  };

  return (
    <main className="container">
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div className="cardHeader">
          <div className="cardTitle">{t.nav.letters}</div>
          <div className="cardSub muted">{L.shellSubtitle}</div>
        </div>

        {prefilled ? (
          <div className="muted" style={{ fontSize: 12 }}>
            {L.prefilledFromGuide}
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gap: 12,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            padding: 12,
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label className="label">{L.labelType}</label>
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value as "email" | "letter")}
            >
              <option value="email">{L.typeEmail}</option>
              <option value="letter">{L.typeLetter}</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label className="label">{L.labelAuthority}</label>
            <select
              className="select"
              value={authority}
              onChange={(e) => setAuthority(e.target.value as typeof authority)}
            >
              <option value="Bürgeramt">{authorityLabel("Bürgeramt")}</option>
              <option value="Finanzamt">{authorityLabel("Finanzamt")}</option>
              <option value="Jobcenter">{authorityLabel("Jobcenter")}</option>
              <option value="Ausländerbehörde">
                {authorityLabel("Ausländerbehörde")}
              </option>
              <option value="Kita / School">
                {authorityLabel("Kita / School")}
              </option>
              <option value="Health Insurance">
                {authorityLabel("Health Insurance")}
              </option>
              <option value="Familienkasse">
                {authorityLabel("Familienkasse")}
              </option>
              <option value="Other">{authorityLabel("Other")}</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label className="label">{L.labelNeed}</label>
            <textarea
              placeholder={L.requestPlaceholder}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              style={{
                minHeight: 130,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                padding: 12,
                outline: "none",
                resize: "vertical",
                font: "inherit",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            style={{
              height: 42,
              borderRadius: 12,
              border: "1px solid rgba(79,156,255,0.45)",
              background: "rgba(79,156,255,0.16)",
              color: "rgba(255,255,255,0.92)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {L.generate}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 800 }}>{L.preview}</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {preview ? (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {preview}
              </pre>
            ) : (
              L.previewEmpty
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
