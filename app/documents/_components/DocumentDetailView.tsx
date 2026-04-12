"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/useT";
import DocumentExplainPanel from "@/app/documents/_components/DocumentExplainPanel";
import DocumentPreviewPanel from "@/app/documents/_components/DocumentPreviewPanel";

type Props = {
  doc: {
    id: string;
    file_name: string | null;
    mime_type: string | null;
    created_at: string;
  };
  preview: {
    supported: boolean;
    previewText: string | null;
    message: string;
    messageKey?: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
  };
  downloadHref: string | null;
  explanation: {
    summary: string;
    urgency: string;
    category: string;
    suggestedActions: Array<{ label: string; href: string }>;
  };
  documentIntelligence: {
    sectionTitle: string;
    sectionSubtitle: string;
    lines: string[];
  };
};

export default function DocumentDetailView({
  doc,
  preview,
  downloadHref,
  explanation,
  documentIntelligence,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const { t } = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="container" style={{ display: "grid", gap: 14 }}>
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {doc.file_name ?? t.documentDetail.untitled}
            </div>
            <div className="cardSub muted">
              {new Date(doc.created_at).toLocaleString()}
            </div>
          </div>
          {doc.mime_type ? (
            <span className="badgeSmall">{doc.mime_type}</span>
          ) : null}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {downloadHref ? (
            <a
              href={downloadHref}
              className="pill"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              {t.documentDetail.download}
            </a>
          ) : (
            <span className="muted" style={{ fontSize: 13 }}>
              {t.documentDetail.downloadUnavailable}
            </span>
          )}
          <Link
            href="/documents"
            className="pill"
            style={{ textDecoration: "none" }}
          >
            {t.documentDetail.backToList}
          </Link>
        </div>
      </div>

      <DocumentPreviewPanel
        previewText={preview.previewText}
        supported={preview.supported}
        message={preview.message}
        messageKey={preview.messageKey}
      />

      <DocumentExplainPanel
        id={doc.id}
        file_name={doc.file_name}
        mime_type={doc.mime_type}
        textPreview={preview.previewText}
        extractionSupported={preview.supported}
        extractionMessage={preview.message}
        previewMessageKey={preview.messageKey}
        documentIntelligence={documentIntelligence}
        explanationSummary={explanation.summary}
        explanationUrgency={explanation.urgency as "low" | "medium" | "high"}
        explanationCategory={
          explanation.category as
            | "tax"
            | "residence"
            | "benefits"
            | "health"
            | "documents"
            | "other"
        }
        explanationActions={explanation.suggestedActions}
      />
    </main>
  );
}

