"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/useT";

export type DocumentExplainPanelProps = {
  id: string;
  file_name: string | null;
  mime_type: string | null;
  textPreview: string | null;
  extractionSupported: boolean;
  extractionMessage: string;
  previewMessageKey?: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
  explanationSummary: string;
  explanationUrgency: "low" | "medium" | "high";
  explanationCategory:
    | "tax"
    | "residence"
    | "benefits"
    | "health"
    | "documents"
    | "other";
  explanationActions: Array<{ label: string; href: string }>;
};

export default function DocumentExplainPanel({
  id,
  file_name,
  mime_type,
  textPreview,
  extractionSupported,
  extractionMessage,
  previewMessageKey,
  explanationSummary,
  explanationUrgency,
  explanationCategory,
  explanationActions,
}: DocumentExplainPanelProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);

  const urgencyLabel =
    explanationUrgency === "high"
      ? t.documents.urgencyHigh
      : explanationUrgency === "medium"
        ? t.documents.urgencyMedium
        : t.documents.urgencyLow;
  const resolvedExtractionMessage =
    previewMessageKey === "previewNotSupported"
      ? t.documents.previewNotSupported
      : previewMessageKey === "previewLoadFailed"
        ? t.documents.previewLoadFailed
        : extractionMessage;

  return (
    <div
      className="card"
      style={{ display: "grid", gap: 12 }}
      data-document-id={id}
      data-file-name={file_name ?? undefined}
      data-mime-type={mime_type ?? undefined}
    >
      <div className="cardHeader" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="cardTitle" style={{ fontSize: 18 }}>
            {t.documents.explainTitle}
          </div>
          <div className="cardSub muted">
            {t.documents.explainSubtitle}
          </div>
        </div>
        <span className="badgeSmall">{t.documents.previewBadge}</span>
      </div>

      <button
        type="button"
        className="pill"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "fit-content",
          border: "1px solid rgba(79,156,255,0.45)",
          background: "rgba(79,156,255,0.16)",
          fontWeight: 800,
          cursor: "pointer",
          font: "inherit",
        }}
      >
        {open ? t.documents.hideExplanation : t.documents.explainButton}
      </button>

      {open ? (
        <div
          className="card"
          style={{
            margin: 0,
            padding: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            className="muted"
            style={{
              fontSize: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,200,120,0.25)",
              background: "rgba(255,180,80,0.08)",
              padding: "10px 12px",
            }}
          >
            <span className="badgeSmall" style={{ marginRight: 8 }}>
              {t.documents.note}
            </span>
            {t.documents.mockNotice}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
              {t.documents.explanationSummary}
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {explanationSummary}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="badgeSmall">{t.documents.urgency}: {urgencyLabel}</span>
              <span className="badgeSmall">{t.documents.category}: {explanationCategory}</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
              {t.documents.suggestedActions}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {explanationActions.map((a, i) => (
                <Link
                  key={`${a.href}-${i}`}
                  href={a.href}
                  className="pill"
                  style={{ textDecoration: "none" }}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
              {t.documents.documentTextPreview}
            </div>
            {extractionSupported &&
            textPreview != null &&
            textPreview.length > 0 ? (
              <pre
                className="muted"
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: 280,
                  overflow: "auto",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.02)",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {textPreview}
              </pre>
            ) : (
              <div
                className="muted"
                style={{
                  fontSize: 13,
                  lineHeight: 1.45,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.15)",
                  padding: "10px 12px",
                }}
              >
                {resolvedExtractionMessage}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
