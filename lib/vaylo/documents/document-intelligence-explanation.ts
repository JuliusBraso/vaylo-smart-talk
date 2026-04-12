/**
 * Deterministic lines for document detail (Phase 1).
 * Uses `user_documents` persisted fields + optional knowledge graph slice.
 */

import type { Dict } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import type { UserDocumentRow } from "@/lib/vaylo/documents";
import type { DocumentKnowledgeLinks } from "./document-intelligence-types";

export type DocumentIntelligenceViewModel = {
  status: string;
  documentTypeTitleKey: string | null;
  documentTypeSlug: string | null;
  confidence: number | null;
  method: string | null;
  metadata: UserDocumentRow["extracted_metadata"];
  knowledge: DocumentKnowledgeLinks | null;
  lines: string[];
};

export function buildDocumentIntelligenceViewModel(params: {
  doc: UserDocumentRow;
  knowledge: DocumentKnowledgeLinks | null;
  t: Dict;
}): DocumentIntelligenceViewModel {
  const { doc, knowledge, t } = params;
  const d = t.documents;
  const lines: string[] = [];

  const status = doc.classification_status ?? "pending";
  const statusLabel =
    status === "completed"
      ? d.intelligenceStatusCompleted
      : status === "unknown"
        ? d.intelligenceStatusUnknown
        : status === "failed"
          ? d.intelligenceStatusFailed
          : d.intelligenceStatusPending;

  lines.push(formatMessage(d.intelligenceStatusLine, { status: statusLabel }));

  if (doc.document_type_id && knowledge) {
    lines.push(
      formatMessage(d.intelligenceMatchedType, {
        slug: knowledge.document_type_slug,
        key: knowledge.document_type_title_key,
      }),
    );
    for (const sl of knowledge.step_links) {
      lines.push(
        formatMessage(d.intelligenceLinkedStep, {
          link: sl.link_type,
          stepKey: sl.step.title_key,
          topicKey: sl.topic.title_key,
        }),
      );
    }
  } else if (status === "failed") {
    lines.push(d.intelligenceClassificationFailed);
  } else if (status === "completed" && doc.document_type_id && !knowledge) {
    lines.push(
      formatMessage(d.intelligenceTypeWithoutLinks, {
        typeId: doc.document_type_id,
      }),
    );
  } else if (status === "unknown") {
    lines.push(d.intelligenceNoCatalogMatch);
  } else if (status === "pending") {
    lines.push(d.intelligencePendingDetail);
  }

  if (doc.classification_confidence != null) {
    lines.push(
      formatMessage(d.intelligenceConfidenceLine, {
        pct: String(Math.round(Number(doc.classification_confidence) * 100)),
      }),
    );
  }
  if (doc.classification_method) {
    lines.push(
      formatMessage(d.intelligenceMethodLine, {
        method: doc.classification_method,
      }),
    );
  }

  const meta = doc.extracted_metadata;
  if (meta?.sender) {
    lines.push(formatMessage(d.intelligenceSenderLine, { sender: meta.sender }));
  }
  if (meta?.documentDate) {
    lines.push(
      formatMessage(d.intelligenceDateLine, { date: meta.documentDate }),
    );
  }
  if (meta?.summary) {
    lines.push(formatMessage(d.intelligenceSummaryLine, { summary: meta.summary }));
  }

  return {
    status,
    documentTypeTitleKey: knowledge?.document_type_title_key ?? null,
    documentTypeSlug: knowledge?.document_type_slug ?? null,
    confidence: doc.classification_confidence ?? null,
    method: doc.classification_method ?? null,
    metadata: meta ?? null,
    knowledge,
    lines,
  };
}
