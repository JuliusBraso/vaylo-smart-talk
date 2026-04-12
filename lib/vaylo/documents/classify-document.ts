/**
 * Conservative catalog-only classification (Phase 1).
 * No LLM: heuristics over filename + extracted text against known `document_types`.
 */

import type { DocumentType } from "@/lib/vaylo/knowledge/types";
import type { DocumentClassificationResult } from "./document-intelligence-types";

const METHOD_HEURISTIC = "heuristic";

function haystack(fileName: string | null, text: string | null): string {
  return `${(fileName ?? "").toLowerCase()} ${(text ?? "").toLowerCase()}`;
}

/** Order = priority when scoring ties (first wins). */
const CATALOG_RULES: Array<{
  documentTypeId: string;
  weight: number;
  patterns: RegExp[];
}> = [
  {
    documentTypeId: "meldebescheinigung",
    weight: 3,
    patterns: [
      /meldebescheinigung/,
      /meldebestätigung|meldebestaetigung/,
      /wohnungsgeberbestätigung|wohnungsgeberbestaetigung/,
      /bürgeramt.*anmeldung|buergeramt.*anmeldung/,
    ],
  },
  {
    documentTypeId: "tax_id_letter",
    weight: 3,
    patterns: [
      /steuerliche\s+identifikationsnummer/,
      /steuer-identifikationsnummer/,
      /steueridentifikationsnummer/,
      /tax\s+identification\s+number/,
      /identifikationsnummer.*finanzamt/,
    ],
  },
  {
    documentTypeId: "health_insurance_membership_proof",
    weight: 3,
    patterns: [
      /mitgliedsbescheinigung/,
      /krankenversicherung.*nachweis/,
      /versicherungsnachweis/,
      /membership.*certificate.*health/,
      /gesetzliche\s+krankenversicherung/,
    ],
  },
];

function scoreCatalog(h: string): { id: string; score: number } | null {
  let best: { id: string; score: number } | null = null;
  for (const rule of CATALOG_RULES) {
    let s = 0;
    for (const p of rule.patterns) {
      if (p.test(h)) s += rule.weight;
    }
    if (s === 0) continue;
    if (!best || s > best.score || (s === best.score && rule.documentTypeId < best.id)) {
      best = { id: rule.documentTypeId, score: s };
    }
  }
  return best;
}

function extractMetadataMvp(
  text: string | null,
  fileName: string | null,
): DocumentClassificationResult["extractedMetadata"] {
  const src = (text ?? "").trim();
  const lines = src.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const head = lines.slice(0, 8).join(" ");

  let documentDate: string | null = null;
  const dm = head.match(
    /\b(\d{1,2}\.\d{1,2}\.\d{4}|\d{4}-\d{2}-\d{2})\b/,
  );
  if (dm) documentDate = dm[1] ?? null;

  let sender: string | null = null;
  const senderLine = lines.find((l) =>
    /^(absender|von|from|issuer|aussteller)\s*[:\-]/i.test(l),
  );
  if (senderLine) {
    sender = senderLine.replace(/^(absender|von|from|issuer|aussteller)\s*[:\-]\s*/i, "").slice(0, 200);
  }

  let summary: string | null = null;
  if (src.length > 0) {
    const oneLine = src.replace(/\s+/g, " ").trim();
    summary = oneLine.slice(0, 280) + (oneLine.length > 280 ? "…" : "");
  } else if (fileName) {
    summary = `File: ${fileName}`;
  }

  if (!documentDate && !sender && !summary) return null;
  return { sender, documentDate, summary };
}

/**
 * Classify text against the active catalog (`documentTypes` must be loaded by caller).
 * Returns `unknown` when no confident match — distinct from `failed` (internal error).
 */
export function classifyDocumentFromText(params: {
  text: string | null;
  fileName: string | null;
  documentTypes: DocumentType[];
}): DocumentClassificationResult {
  const notes: string[] = [];
  const { text, fileName, documentTypes } = params;

  try {
    const allowed = new Set(documentTypes.map((d) => d.id));
    const h = haystack(fileName, text);
    if (!text?.trim() && !fileName?.trim()) {
      return {
        status: "unknown",
        documentTypeId: null,
        confidence: null,
        method: METHOD_HEURISTIC,
        extractedMetadata: null,
        notes: ["no_text_or_filename"],
      };
    }

    const meta = extractMetadataMvp(text, fileName);
    const scored = scoreCatalog(h);
    if (!scored) {
      return {
        status: "unknown",
        documentTypeId: null,
        confidence: null,
        method: METHOD_HEURISTIC,
        extractedMetadata: meta,
        notes: [...notes, "no_catalog_keyword_match"],
      };
    }

    if (!allowed.has(scored.id)) {
      notes.push("matched_rule_not_in_catalog");
      return {
        status: "unknown",
        documentTypeId: null,
        confidence: null,
        method: METHOD_HEURISTIC,
        extractedMetadata: meta,
        notes,
      };
    }

    const confidence = Math.min(0.92, 0.55 + scored.score * 0.08);
    notes.push(`score=${scored.score}`);

    return {
      status: "completed",
      documentTypeId: scored.id,
      confidence,
      method: METHOD_HEURISTIC,
      extractedMetadata: meta,
      notes,
    };
  } catch (e) {
    return {
      status: "failed",
      documentTypeId: null,
      confidence: null,
      method: METHOD_HEURISTIC,
      extractedMetadata: extractMetadataMvp(params.text, params.fileName),
      notes: [e instanceof Error ? e.message : "classification_error"],
    };
  }
}
