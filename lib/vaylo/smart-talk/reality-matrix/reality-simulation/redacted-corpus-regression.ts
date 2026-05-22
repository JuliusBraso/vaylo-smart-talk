/**
 * Redacted Corpus validation scaffold (Phase 8.2F-10).
 *
 * Provides `runRedactedCorpusRegression` — a pure static hygiene validator
 * that verifies structural integrity and PII-safety of a `RedactedDocument`
 * corpus without any NLP, LLM, OCR, or runtime processing.
 *
 * Hygiene checks performed:
 *  1. At least 5 documents present
 *  2. All documentIds are unique
 *  3. redactedText is non-empty (length > 0)
 *  4. redactedText.length > 80 characters
 *  5. simulatedOcrConfidence is in [0, 100]
 *  6. neverContainsRealPii === true on every entry
 *  7. No obvious email patterns detected outside [EMAIL] placeholder
 *  8. No obvious German phone number patterns outside [PHONE] placeholder
 *  9. No IBAN-like patterns (DE + digits) outside [IBAN] placeholder
 * 10. At least one known RedactedPlaceholder present in redactedText
 * 11. sourceKind === "synthetic_exemplar" for all current entries
 * 12. Banned name fragment check (lightweight static list)
 *
 * No Jest/Vitest. No CI hook. No NLP. Static pattern checks only.
 * No LLM. No OCR SDK. No Smart Talk wiring.
 */

import {
  KNOWN_REDACTED_PLACEHOLDERS,
  type RedactedCorpusValidationResult,
  type RedactedDocument,
} from "./redacted-corpus-types";
import {
  REDACTED_DOCUMENT_CORPUS,
  REDACTED_DOCUMENT_CORPUS_VERSION,
} from "./redacted-corpus-registry";

export const REDACTED_CORPUS_REGRESSION_VERSION =
  "8.2f-10-redacted-corpus-regression-v1";

// ── Static hygiene patterns ───────────────────────────────────────────────────

// Email pattern — matches standard email addresses.
// Placeholders use brackets ([EMAIL]) so they never match this pattern.
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

// German phone number patterns — matches common German formats:
// +49..., 0049..., or local 0xxx with separators.
// [PHONE] placeholder contains brackets, so it never matches.
const PHONE_PATTERN =
  /(?:\+49|0049)[\s\-]*\d{2,4}[\s\-]*\d{3,}|\b0\d{2,4}[\s/\-]\d{3,4}[\s/\-]?\d{2,4}/;

// IBAN pattern — matches raw German IBANs (DE + 2 digits + 16 alphanumeric chars).
// [IBAN] placeholder starts with a bracket, so it never matches.
const RAW_IBAN_PATTERN = /\bDE\d{2}[\s]*[A-Z0-9]{4}[\s]*[A-Z0-9]{4}[\s]*[A-Z0-9]{4}/;

/**
 * Small static list of common German name fragments that should not appear
 * as raw text in corpus entries. All names must use the [NAME] placeholder.
 * Intentionally minimal — not NLP, not a name database.
 */
const BANNED_NAME_FRAGMENTS: readonly string[] = [
  "Klaus Müller",
  "Hans Schmidt",
  "Maria Weber",
  "Peter Fischer",
  "Anna Meyer",
  "Thomas Bauer",
];

// ── PII check helper ──────────────────────────────────────────────────────────

/**
 * Returns true if the text contains possible PII outside of placeholder tokens.
 * Static pattern only — no NLP, no LLM.
 */
function containsPossiblePii(text: string): boolean {
  // Strip [EMAIL], [PHONE], [IBAN] placeholders before pattern checks so
  // the placeholders themselves never trigger a false positive.
  const stripped = text
    .replace(/\[EMAIL\]/g, "")
    .replace(/\[PHONE\]/g, "")
    .replace(/\[IBAN\]/g, "");

  if (EMAIL_PATTERN.test(stripped)) return true;
  if (PHONE_PATTERN.test(stripped)) return true;
  if (RAW_IBAN_PATTERN.test(stripped)) return true;

  // Banned name fragment check (case-insensitive).
  const lower = text.toLowerCase();
  for (const fragment of BANNED_NAME_FRAGMENTS) {
    if (lower.includes(fragment.toLowerCase())) return true;
  }

  return false;
}

// ── Placeholder coverage check ────────────────────────────────────────────────

function hasAtLeastOnePlaceholder(text: string): boolean {
  for (const placeholder of KNOWN_REDACTED_PLACEHOLDERS) {
    if (text.includes(placeholder)) return true;
  }
  return false;
}

// ── Main validation function ──────────────────────────────────────────────────

/**
 * Validates a `RedactedDocument` corpus against structural integrity and
 * PII-safety rules.
 *
 * Accepts an optional `corpus` argument so it can validate any corpus array,
 * defaulting to the canonical `REDACTED_DOCUMENT_CORPUS` from the registry.
 *
 * Pure function — no side effects, no DB, no LLM, no OCR, no file system.
 */
export function runRedactedCorpusRegression(
  corpus: readonly RedactedDocument[] = REDACTED_DOCUMENT_CORPUS,
): RedactedCorpusValidationResult {
  const notes: string[] = [];
  const seenIds = new Map<string, number>();
  const duplicateDocumentIds: string[] = [];
  const emptyTextDocumentIds: string[] = [];
  const tooShortTextDocumentIds: string[] = [];
  const possiblePiiDocumentIds: string[] = [];
  const missingPlaceholderCoverageDocumentIds: string[] = [];
  const invalidConfidenceDocumentIds: string[] = [];

  // ── Check 1: Minimum corpus size ─────────────────────────────────────────
  if (corpus.length < 5) {
    notes.push(
      `Corpus contains only ${String(corpus.length)} document(s); minimum required is 5.`,
    );
  }

  for (const doc of corpus) {
    // ── Check 2: Unique documentId ──────────────────────────────────────────
    const prior = seenIds.get(doc.documentId) ?? 0;
    seenIds.set(doc.documentId, prior + 1);
    if (prior === 1) {
      // First time we detect the duplicate (prior was 1, now 2)
      duplicateDocumentIds.push(doc.documentId);
    }

    // ── Check 3 & 4: redactedText length ───────────────────────────────────
    if (doc.redactedText.length === 0) {
      emptyTextDocumentIds.push(doc.documentId);
    } else if (doc.redactedText.length <= 80) {
      tooShortTextDocumentIds.push(doc.documentId);
    }

    // ── Check 5: simulatedOcrConfidence range ──────────────────────────────
    if (
      typeof doc.simulatedOcrConfidence !== "number" ||
      doc.simulatedOcrConfidence < 0 ||
      doc.simulatedOcrConfidence > 100
    ) {
      invalidConfidenceDocumentIds.push(doc.documentId);
    }

    // ── Check 6: neverContainsRealPii invariant ────────────────────────────
    // TypeScript enforces `neverContainsRealPii: true` at compile time.
    // This runtime check guards against any future cast bypasses.
    if (doc.neverContainsRealPii !== true) {
      possiblePiiDocumentIds.push(doc.documentId);
      notes.push(
        `CRITICAL: "${doc.documentId}" violates neverContainsRealPii invariant.`,
      );
    }

    // ── Check 7–12: PII pattern checks ────────────────────────────────────
    if (containsPossiblePii(doc.redactedText)) {
      possiblePiiDocumentIds.push(doc.documentId);
    }

    // ── Check 10: Placeholder coverage ────────────────────────────────────
    if (!hasAtLeastOnePlaceholder(doc.redactedText)) {
      missingPlaceholderCoverageDocumentIds.push(doc.documentId);
    }

    // ── Check 11: sourceKind must be synthetic_exemplar for current corpus ─
    if (doc.sourceKind !== "synthetic_exemplar") {
      notes.push(
        `"${doc.documentId}" has sourceKind="${doc.sourceKind}"; only "synthetic_exemplar" is admitted in Phase 8.2F-10.`,
      );
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  const hasCriticalErrors =
    corpus.length < 5 ||
    duplicateDocumentIds.length > 0 ||
    emptyTextDocumentIds.length > 0 ||
    possiblePiiDocumentIds.length > 0;

  const hasWarnings =
    tooShortTextDocumentIds.length > 0 ||
    missingPlaceholderCoverageDocumentIds.length > 0 ||
    invalidConfidenceDocumentIds.length > 0;

  const valid = !hasCriticalErrors;
  const fullyConsistent = valid && !hasWarnings;

  if (fullyConsistent) {
    notes.push(
      `All ${String(corpus.length)} corpus entries pass full structural and PII-safety validation.`,
    );
  } else if (valid) {
    notes.push(
      `${String(corpus.length)} corpus entries pass critical checks but have ${String(
        tooShortTextDocumentIds.length +
          missingPlaceholderCoverageDocumentIds.length +
          invalidConfidenceDocumentIds.length,
      )} structural warning(s).`,
    );
  } else {
    notes.push(
      `Corpus FAILED critical validation with ${String(
        duplicateDocumentIds.length +
          emptyTextDocumentIds.length +
          possiblePiiDocumentIds.length,
      )} critical issue(s).`,
    );
  }

  notes.push(
    "Validation is static pattern-only: no NLP, no LLM, no OCR, no Smart Talk wiring.",
  );
  notes.push(`Corpus version: ${REDACTED_DOCUMENT_CORPUS_VERSION}.`);

  return {
    valid,
    fullyConsistent,
    documentCount: corpus.length,
    duplicateDocumentIds,
    emptyTextDocumentIds,
    tooShortTextDocumentIds,
    possiblePiiDocumentIds,
    missingPlaceholderCoverageDocumentIds,
    invalidConfidenceDocumentIds,
    notes,
  };
}
