/**
 * Phase 1B: optional OpenAI assist for catalog-allowlisted classification.
 * Requires OPENAI_API_KEY; callers should treat missing key / errors as soft-fail.
 *
 * Env: OPENAI_API_KEY, optional OPENAI_DOCUMENT_CLASSIFIER_MODEL (default gpt-4o-mini).
 */

import type { DocumentType } from "@/lib/vaylo/knowledge/types";

/** Parsed + validated model output (ids already allowlisted or nulled). */
export type LlmDocumentClassificationCandidate = {
  documentTypeId: string | null;
  confidence: number | null;
  extractedMetadata: {
    sender?: string | null;
    documentDate?: string | null;
    summary?: string | null;
  } | null;
  notes?: string[];
};

const DEFAULT_MODEL = "gpt-4o-mini";
const EXCERPT_MAX = 2200;

function stripJsonFence(s: string): string {
  const t = s.trim();
  if (!t.startsWith("```")) return t;
  return t
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

/** First ~2k chars + light redaction before any external call. */
export function prepareDocumentTextForLlmClassifier(params: {
  extractedText: string | null;
  fileName: string | null;
  maxChars?: number;
}): string {
  const max = params.maxChars ?? EXCERPT_MAX;
  let body = (params.extractedText ?? "").replace(/\r\n/g, "\n").trim();
  body = body.slice(0, max);

  // IBAN-style DE + digits (compact or spaced)
  body = body.replace(/\bDE\d{2}(?:\s?\d{4}){4}\s?\d{2}\b/gi, "[REDACTED_IBAN]");
  // Long digit runs (account numbers, IDs) — keep short numbers (dates, small codes)
  body = body.replace(/\b\d{12,}\b/g, "[REDACTED_NUMBER]");

  const name = params.fileName?.trim();
  const header = name ? `File name: ${name.slice(0, 240)}\n\n` : "";
  return header + body;
}

type LlmRawJson = {
  documentTypeId?: unknown;
  confidence?: unknown;
  sender?: unknown;
  documentDate?: unknown;
  summary?: unknown;
  notes?: unknown;
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function parseNotes(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out = raw
    .filter((x) => typeof x === "string")
    .map((s) => s.trim().slice(0, 200))
    .filter(Boolean)
    .slice(0, 8);
  return out.length ? out : undefined;
}

function normalizeLlmOutput(
  raw: LlmRawJson,
  allowedIds: Set<string>,
): LlmDocumentClassificationCandidate {
  const notes: string[] = [];

  let documentTypeId: string | null = null;
  if (typeof raw.documentTypeId === "string") {
    const id = raw.documentTypeId.trim();
    if (id && allowedIds.has(id)) documentTypeId = id;
    else if (id) notes.push("llm_invalid_document_type_id");
  } else if (raw.documentTypeId !== null && raw.documentTypeId !== undefined) {
    notes.push("llm_document_type_id_not_string");
  }

  let confidence: number | null = null;
  if (typeof raw.confidence === "number" && Number.isFinite(raw.confidence)) {
    confidence = Math.min(0.88, clamp01(raw.confidence));
  }

  const sender =
    typeof raw.sender === "string" ? raw.sender.trim().slice(0, 200) || null : null;
  let documentDate: string | null = null;
  if (typeof raw.documentDate === "string") {
    const d = raw.documentDate.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) documentDate = d;
    else if (d) notes.push("llm_document_date_non_iso");
  }
  const summary =
    typeof raw.summary === "string"
      ? raw.summary.replace(/\s+/g, " ").trim().slice(0, 320) || null
      : null;

  const extra = parseNotes(raw.notes);
  if (extra) notes.push(...extra);

  const extractedMetadata =
    sender || documentDate || summary ? { sender, documentDate, summary } : null;

  return {
    documentTypeId,
    confidence,
    extractedMetadata,
    notes: notes.length ? notes : undefined,
  };
}

/**
 * Calls OpenAI JSON mode. Returns null on any failure (caller keeps heuristic).
 */
export async function runLlmDocumentClassifier(params: {
  catalog: DocumentType[];
  minimizedExcerpt: string;
  /** When excerpt is empty, LLM should rely on filename line inside excerpt only. */
}): Promise<LlmDocumentClassificationCandidate | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;

  const model =
    process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL?.trim() || DEFAULT_MODEL;
  const allowedIds = new Set(params.catalog.map((d) => d.id));
  if (allowedIds.size === 0) return null;

  const catalogJson = JSON.stringify(
    params.catalog.map((d) => ({
      id: d.id,
      slug: d.slug,
      title_key: d.title_key,
    })),
  );

  const system = [
    "You classify administrative documents for Germany relocation.",
    "Reply with a single JSON object only (no markdown). Keys:",
    'documentTypeId (string|null): MUST be exactly one of the catalog "id" values, or null if unsure.',
    "confidence (number|null): your certainty 0–1 for documentTypeId only; use null if documentTypeId is null.",
    "sender (string|null), documentDate (YYYY-MM-DD|null), summary (one short sentence|null), notes (string[]|omit).",
    "Never invent a documentTypeId not listed. Prefer null when ambiguous.",
  ].join(" ");

  const user = [
    "Active document_types catalog (JSON array):",
    catalogJson,
    "",
    "Document excerpt (may be truncated/redacted):",
    params.minimizedExcerpt || "(no body text)",
  ].join("\n");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = body.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string" || !rawContent.trim()) return null;

    const content = stripJsonFence(rawContent);

    let parsed: unknown;
    try {
      parsed = JSON.parse(content) as unknown;
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== "object") return null;
    return normalizeLlmOutput(parsed as LlmRawJson, allowedIds);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
