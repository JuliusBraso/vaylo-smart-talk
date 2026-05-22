/**
 * Redacted Corpus Foundation types (Phase 8.2F-10).
 *
 * Defines the type model for a future real-world redacted corpus.
 * Current entries are SYNTHETIC REDACTED EXEMPLARS ONLY — no real PII,
 * no real user documents, no real OCR output.
 *
 * Safety guarantees:
 * - no real PII defined here
 * - no real user documents referenced
 * - no OCR SDK imported
 * - no LLM calls
 * - no Smart Talk wiring
 * - no database writes
 * - no file system access (no fs import)
 * - neverContainsRealPii: true enforced on every RedactedDocument
 */

import type { OcrDegradationVector } from "./ocr-uncertainty-types";

// ── Document classification ───────────────────────────────────────────────────

/**
 * Structural category of the German bureaucratic document type.
 * Used for corpus filtering and risk-domain classification.
 */
export type RedactedDocumentCategory =
  | "finanzamt_bescheid"
  | "rundfunkbeitrag"
  | "inkasso_mahnung"
  | "jobcenter_bescheid"
  | "krankenkasse_notice"
  | "auslaenderbehoerde_letter"
  | "generic_bureaucracy";

/**
 * Privacy status of this corpus entry.
 *
 * - `synthetic_redacted_exemplar`: manually crafted synthetic text with no
 *   connection to any real person or document; safe for repo storage.
 * - `fully_anonymized`: a former real document that has been manually redacted
 *   and verified by a human reviewer before admission to the corpus.
 * - `rejected_contains_possible_pii`: entry flagged by the validation scaffold
 *   as containing possible PII; must NOT be admitted to the corpus.
 */
export type RedactionLevel =
  | "synthetic_redacted_exemplar"
  | "fully_anonymized"
  | "rejected_contains_possible_pii";

/**
 * Provenance of this corpus entry.
 *
 * - `synthetic_exemplar`: crafted from scratch for testing; no real document origin.
 * - `future_real_redacted`: placeholder for entries that will be admitted after
 *   manual redaction and human review (not present in Phase 8.2F-10).
 * - `imported_test_fixture`: imported from an internal test fixture set that has
 *   already passed a PII review gate.
 */
export type RedactedCorpusSourceKind =
  | "synthetic_exemplar"
  | "future_real_redacted"
  | "imported_test_fixture";

// ── Placeholder registry ──────────────────────────────────────────────────────

/**
 * Standard redaction placeholders used in corpus entries.
 * All personal or identifying information in corpus text must be replaced
 * with one of these tokens. No raw values are permitted.
 */
export type RedactedPlaceholder =
  | "[NAME]"
  | "[ADDRESS]"
  | "[DATE]"
  | "[AMOUNT]"
  | "[AKTENZEICHEN]"
  | "[CUSTOMER_ID]"
  | "[IBAN]"
  | "[PHONE]"
  | "[EMAIL]"
  | "[AUTHORITY]"
  | "[CITY]";

/**
 * Runtime-enumerable registry of all known redaction placeholder tokens.
 * Used by the validation scaffold to verify placeholder coverage.
 */
export const KNOWN_REDACTED_PLACEHOLDERS: readonly RedactedPlaceholder[] = [
  "[NAME]",
  "[ADDRESS]",
  "[DATE]",
  "[AMOUNT]",
  "[AKTENZEICHEN]",
  "[CUSTOMER_ID]",
  "[IBAN]",
  "[PHONE]",
  "[EMAIL]",
  "[AUTHORITY]",
  "[CITY]",
] as const;

// ── Corpus entry ──────────────────────────────────────────────────────────────

/**
 * A single corpus entry representing a redacted or synthetic German bureaucratic
 * document. All PII-bearing fields must use `RedactedPlaceholder` tokens.
 *
 * `documentId`: unique stable identifier for this corpus entry.
 * `category`: document type classification.
 * `sourceKind`: provenance of this entry.
 * `redactionLevel`: privacy status at time of admission.
 * `simulatedOcrConfidence`: the OCR confidence score this entry simulates (0–100).
 *   Used for integration with `evaluateOcrUncertainty` in regression runs.
 * `redactedText`: the corpus text with all PII replaced by placeholder tokens.
 *   Must be > 80 characters. Must contain at least one `RedactedPlaceholder`.
 * `expectedComplexity`: structural complexity classification for test routing.
 * `expectedRiskDomains`: governance risk domains expected for this document type.
 * `expectedOcrDegradation`: optional structural OCR degradation flags expected
 *   for this entry (integrates with Phase 8.2F-9 `OcrDegradationVector`).
 * `notes`: internal governance notes — never user-visible.
 * `neverContainsRealPii`: compile-time safety invariant; must always be `true`.
 */
export interface RedactedDocument {
  readonly documentId: string;
  readonly category: RedactedDocumentCategory;
  readonly sourceKind: RedactedCorpusSourceKind;
  readonly redactionLevel: RedactionLevel;
  readonly simulatedOcrConfidence: number;
  readonly redactedText: string;
  readonly expectedComplexity: "low" | "medium" | "high";
  readonly expectedRiskDomains: readonly string[];
  readonly expectedOcrDegradation?: Partial<OcrDegradationVector>;
  readonly notes: readonly string[];
  readonly neverContainsRealPii: true;
}

// ── Validation result ─────────────────────────────────────────────────────────

/**
 * Output of `runRedactedCorpusRegression`. Summarises all privacy hygiene
 * and structural consistency checks against a corpus.
 *
 * `valid`: no critical structural errors (duplicate IDs, missing invariants).
 * `fullyConsistent`: all checks pass — no PII warnings, no structural gaps.
 * `documentCount`: total number of entries in the corpus under test.
 * `duplicateDocumentIds`: document IDs that appear more than once.
 * `emptyTextDocumentIds`: entries with empty `redactedText`.
 * `tooShortTextDocumentIds`: entries with `redactedText.length <= 80`.
 * `possiblePiiDocumentIds`: entries flagged by static hygiene checks.
 * `missingPlaceholderCoverageDocumentIds`: entries with no recognised placeholder.
 * `invalidConfidenceDocumentIds`: entries where `simulatedOcrConfidence` is outside [0, 100].
 * `notes`: internal governance notes — never user-visible.
 */
export interface RedactedCorpusValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly documentCount: number;
  readonly duplicateDocumentIds: readonly string[];
  readonly emptyTextDocumentIds: readonly string[];
  readonly tooShortTextDocumentIds: readonly string[];
  readonly possiblePiiDocumentIds: readonly string[];
  readonly missingPlaceholderCoverageDocumentIds: readonly string[];
  readonly invalidConfidenceDocumentIds: readonly string[];
  readonly notes: readonly string[];
}
