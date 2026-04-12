/**
 * Phase 1B: heuristic-first catalog classification with optional OpenAI assist.
 * LLM never replaces a strong heuristic match; failures fall back to heuristic only.
 */

import type { DocumentType } from "@/lib/vaylo/knowledge/types";
import type { DocumentClassificationResult } from "./document-intelligence-types";
import { classifyDocumentFromText } from "./classify-document";
import {
  prepareDocumentTextForLlmClassifier,
  runLlmDocumentClassifier,
  type LlmDocumentClassificationCandidate,
} from "./llm-classifier";

/** Heuristic match treated as authoritative for type. */
const HEURISTIC_STRONG_CONF = 0.72;
/** Below this, an LLM type suggestion may replace the heuristic type. */
const HEURISTIC_TYPE_GUARD = 0.65;

function metadataWeak(
  meta: DocumentClassificationResult["extractedMetadata"],
  fileName: string | null,
): boolean {
  if (!meta) return true;
  const hasSender = !!meta.sender?.trim();
  const hasDate = !!meta.documentDate?.trim();
  const summary = meta.summary?.trim() ?? "";
  const fn = fileName?.trim() ?? "";
  const fileOnly =
    fn.length > 0 &&
    (summary === `File: ${fn}` || summary === `File: ${fileName?.trim()}`);
  const hasRichSummary = summary.length > 24 && !fileOnly;
  const score = [hasSender, hasDate, hasRichSummary].filter(Boolean).length;
  return score < 2;
}

function mergeMetadata(
  h: DocumentClassificationResult["extractedMetadata"],
  l: LlmDocumentClassificationCandidate["extractedMetadata"],
): DocumentClassificationResult["extractedMetadata"] {
  if (!l && !h) return null;
  const pick = (
    primary: string | null | undefined,
    fallback: string | null | undefined,
    max: number,
  ): string | null => {
    const a = primary?.trim() ?? "";
    const b = fallback?.trim() ?? "";
    if (a.length >= 2) return a.slice(0, max);
    if (b.length >= 2) return b.slice(0, max);
    return null;
  };
  const sender = pick(h?.sender, l?.sender, 200);
  const documentDate = pick(h?.documentDate, l?.documentDate, 32);
  const summary = pick(h?.summary, l?.summary, 320);
  if (!sender && !documentDate && !summary) return null;
  return { sender, documentDate, summary };
}

function metadataEqual(
  a: DocumentClassificationResult["extractedMetadata"],
  b: DocumentClassificationResult["extractedMetadata"],
): boolean {
  return (
    (a?.sender ?? null) === (b?.sender ?? null) &&
    (a?.documentDate ?? null) === (b?.documentDate ?? null) &&
    (a?.summary ?? null) === (b?.summary ?? null)
  );
}

function shouldInvokeLlm(
  h: DocumentClassificationResult,
  fileName: string | null,
): boolean {
  if (h.status === "failed") return false;
  if (h.status === "unknown") return true;
  if (h.status === "completed" && h.documentTypeId) {
    const conf = h.confidence ?? 0;
    if (conf < HEURISTIC_STRONG_CONF) return true;
    if (metadataWeak(h.extractedMetadata, fileName)) return true;
  }
  return false;
}

function mergeHeuristicAndLlm(
  h: DocumentClassificationResult,
  llm: LlmDocumentClassificationCandidate,
  fileName: string | null,
): DocumentClassificationResult {
  const notes = [...(h.notes ?? []), ...(llm.notes ?? [])];
  const hStrong =
    h.status === "completed" &&
    !!h.documentTypeId &&
    (h.confidence ?? 0) >= HEURISTIC_STRONG_CONF;
  const hHasType = h.status === "completed" && !!h.documentTypeId;
  const hConf = h.confidence ?? 0;

  const metaMerged = mergeMetadata(h.extractedMetadata, llm.extractedMetadata);

  if (hStrong) {
    const metaTouched = !metadataEqual(h.extractedMetadata, metaMerged);
    return {
      status: "completed",
      documentTypeId: h.documentTypeId,
      confidence: h.confidence,
      method: metaTouched ? "heuristic+llm" : "heuristic",
      extractedMetadata: metaMerged,
      notes,
    };
  }

  const llmType = llm.documentTypeId;

  if (llmType) {
    if (
      hHasType &&
      hConf >= HEURISTIC_TYPE_GUARD &&
      h.documentTypeId !== llmType
    ) {
      notes.push("llm_type_disagreement_kept_heuristic");
      return {
        status: "completed",
        documentTypeId: h.documentTypeId,
        confidence: h.confidence,
        method: "heuristic+llm",
        extractedMetadata: metaMerged,
        notes,
      };
    }

    const llmConf = llm.confidence;
    const finalConf =
      llmConf != null
        ? Math.min(0.85, llmConf)
        : Math.min(0.78, Math.max(hConf, 0.55) + 0.04);

    const method =
      h.status === "unknown" || !h.documentTypeId ? "llm" : "heuristic+llm";

    return {
      status: "completed",
      documentTypeId: llmType,
      confidence: finalConf,
      method,
      extractedMetadata: metaMerged,
      notes,
    };
  }

  if (hHasType && h.status === "completed") {
    return {
      status: "completed",
      documentTypeId: h.documentTypeId,
      confidence: h.confidence,
      method: "heuristic+llm",
      extractedMetadata: metaMerged,
      notes,
    };
  }

  return {
    status: "unknown",
    documentTypeId: null,
    confidence: null,
    method: "heuristic",
    extractedMetadata: metaMerged,
    notes,
  };
}

export async function runHybridDocumentClassification(params: {
  text: string | null;
  fileName: string | null;
  documentTypes: DocumentType[];
}): Promise<DocumentClassificationResult> {
  const h = classifyDocumentFromText(params);

  if (!shouldInvokeLlm(h, params.fileName)) {
    return h;
  }

  const excerpt = prepareDocumentTextForLlmClassifier({
    extractedText: params.text,
    fileName: params.fileName,
  });
  if (!excerpt.trim()) {
    return {
      ...h,
      notes: [...(h.notes ?? []), "llm_skipped_no_excerpt"],
    };
  }

  const llmRaw = await runLlmDocumentClassifier({
    catalog: params.documentTypes,
    minimizedExcerpt: excerpt,
  });

  if (!llmRaw) {
    return {
      ...h,
      notes: [...(h.notes ?? []), "llm_unavailable_or_failed"],
    };
  }

  return mergeHeuristicAndLlm(h, llmRaw, params.fileName);
}
