"use client";

import { useT } from "@/lib/i18n/useT";

type Props = {
  previewText: string | null;
  supported: boolean;
  message: string;
  messageKey?: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
};

function shorten(text: string | null, max = 2200) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export default function DocumentPreviewPanel({
  previewText,
  supported,
  message,
  messageKey,
}: Props) {
  const { t } = useT();
  const hasText = Boolean(previewText && previewText.trim().length > 0);
  const resolvedUnsupportedMessage =
    messageKey === "previewLoadFailed"
      ? t.documents.previewLoadFailed
      : t.documents.previewNotSupported;

  return (
    <section className="card" style={{ display: "grid", gap: 12 }}>
      <div className="cardHeader">
        <div>
          <div className="cardTitle">{t.documents.previewTitle}</div>
          <div className="cardSub muted">
            {t.documents.previewSubtitle}
          </div>
        </div>
      </div>

      {!supported ? (
        <div className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          {resolvedUnsupportedMessage}
        </div>
      ) : hasText ? (
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {shorten(previewText!)}
        </pre>
      ) : (
        <div className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          {t.documents.previewEmpty}
        </div>
      )}
    </section>
  );
}

