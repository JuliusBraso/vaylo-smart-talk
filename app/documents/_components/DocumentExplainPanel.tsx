"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import { useT } from "@/lib/i18n/useT";
import {
  proofStepLabelFromSlug,
  type DocumentProofStepSuggestion,
  type ProofSuggestionUiState,
} from "@/lib/vaylo/documents/get-proof-suggestion-ui-state";

export type DocumentExplainPanelProps = {
  id: string;
  file_name: string | null;
  mime_type: string | null;
  textPreview: string | null;
  extractionSupported: boolean;
  extractionMessage: string;
  previewMessageKey?: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
  documentIntelligence:
    | {
        sectionTitle: string;
        sectionSubtitle: string;
        lines: string[];
      }
    | null;
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
  proofUi: ProofSuggestionUiState | null;
};

function stateMessage(
  d: Dict["documents"],
  st: DocumentProofStepSuggestion["state"],
): string {
  switch (st) {
    case "already_confirmed":
      return d.proofStateConfirmed;
    case "already_rejected":
      return d.proofStateRejected;
    case "progress_done":
      return d.proofStateProgress;
    case "profile_done":
      return d.proofStateProfile;
    default:
      return "";
  }
}

export default function DocumentExplainPanel({
  id,
  file_name,
  mime_type,
  textPreview,
  extractionSupported,
  extractionMessage,
  previewMessageKey,
  documentIntelligence,
  explanationSummary,
  explanationUrgency,
  explanationCategory,
  explanationActions,
  proofUi,
}: DocumentExplainPanelProps) {
  const { t } = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busyStepId, setBusyStepId] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);

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

  async function postProofDecision(stepId: string, decision: "confirm" | "reject") {
    setProofError(null);
    setBusyStepId(stepId);
    try {
      const res = await fetch(`/api/documents/${id}/proof-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, decision }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setProofError(body.error ?? t.documents.proofError);
        return;
      }
      router.refresh();
    } catch {
      setProofError(t.documents.proofError);
    } finally {
      setBusyStepId(null);
    }
  }

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

      {documentIntelligence ? (
        <div
          style={{
            display: "grid",
            gap: 10,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(120,200,255,0.22)",
            background: "rgba(79,156,255,0.06)",
          }}
        >
          <div className="cardTitle" style={{ fontSize: 16 }}>
            {documentIntelligence.sectionTitle}
          </div>
          <div className="cardSub muted" style={{ fontSize: 12, lineHeight: 1.45 }}>
            {documentIntelligence.sectionSubtitle}
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {documentIntelligence.lines.map((line, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
          {t.documents.intelligenceUnavailable}
        </div>
      )}

      {proofUi && proofUi.signals.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(160,255,200,0.22)",
            background: "rgba(80,200,140,0.07)",
          }}
        >
          <div className="cardTitle" style={{ fontSize: 16 }}>
            {t.documents.proofSectionTitle}
          </div>
          <div className="cardSub muted" style={{ fontSize: 12, lineHeight: 1.45 }}>
            {t.documents.proofSectionSubtitle}
          </div>
          {!proofUi.eligible ? (
            <>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {t.documents.proofNotEligible}
              </div>
              <ul
                className="muted"
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {proofUi.signals.map((s) => (
                  <li key={s.stepId} style={{ marginBottom: 4 }}>
                    {proofStepLabelFromSlug(s.stepSlug)}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {proofError ? (
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,160,160,0.95)",
              }}
            >
              {proofError}
            </div>
          ) : null}
          <div style={{ display: "grid", gap: 14 }}>
            {proofUi.steps.map((step) => (
              <div
                key={step.stepId}
                style={{
                  display: "grid",
                  gap: 8,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  {formatMessage(t.documents.proofSuggestionLine, {
                    step: step.label,
                  })}
                </div>
                {step.canRespond ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <button
                      type="button"
                      className="pill"
                      disabled={busyStepId !== null}
                      onClick={() => void postProofDecision(step.stepId, "confirm")}
                      style={{
                        border: "1px solid rgba(120,220,160,0.55)",
                        background: "rgba(80,200,120,0.22)",
                        fontWeight: 800,
                        cursor: busyStepId ? "wait" : "pointer",
                        font: "inherit",
                        opacity: busyStepId && busyStepId !== step.stepId ? 0.5 : 1,
                      }}
                    >
                      {busyStepId === step.stepId
                        ? t.documents.proofWorking
                        : t.documents.proofConfirmButton}
                    </button>
                    <button
                      type="button"
                      className="pill"
                      disabled={busyStepId !== null}
                      onClick={() => void postProofDecision(step.stepId, "reject")}
                      style={{
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "transparent",
                        fontWeight: 600,
                        cursor: busyStepId ? "wait" : "pointer",
                        font: "inherit",
                        opacity: busyStepId && busyStepId !== step.stepId ? 0.5 : 1,
                      }}
                    >
                      {t.documents.proofRejectButton}
                    </button>
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: 12 }}>
                    {stateMessage(t.documents, step.state)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
