/**
 * Diagnostic Envelope Adapter types (Phase 8.2F-15O).
 *
 * Defines the structural contract for adapting native governance diagnostic
 * codes into `DiagnosticNormalizedEnvelope` instances for cross-phase audit
 * correlation. This is a pure metadata adapter — no source module migration,
 * no diagnostic code changes, no runtime behavior changes.
 *
 * Context (Debt 5 hardening after Phase 8.2F-15J):
 * - Phase 8.2F-15J introduced `DiagnosticNormalizedEnvelope`, namespace layers,
 *   and `validateDiagnosticNamespaceEnvelopes`.
 * - Source modules still emit their native typed diagnostic unions directly.
 * - This phase introduces `DiagnosticEnvelopeAdapterInput` and the adapter
 *   contract so any caller can convert native diagnostics into envelopes
 *   without touching the emission sites.
 *
 * Intended future flow:
 *  1. A governance layer emits its native diagnostic (e.g. `BridgeDiagnosticCode`).
 *  2. An audit observer builds `DiagnosticEnvelopeAdapterInput` describing the code.
 *  3. `buildDiagnosticEnvelopeFromNativeDiagnostic` converts it to an envelope.
 *  4. Envelopes are collected and passed to `validateDiagnosticNamespaceEnvelopes`.
 *  5. A future persistence layer stores cross-phase diagnostic correlation records.
 *
 * This phase defines steps 2–3 as contract/scaffold only. Steps 4–5 are future work.
 *
 * Safety guarantees:
 * - no runtime coupling to source emission sites
 * - no diagnostic codes renamed or removed
 * - no source modules modified
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - no user-visible output
 * - all result types carry neverUserVisible: true
 */

import type {
  DiagnosticNormalizedEnvelope,
  DiagnosticSeverity,
} from "./diagnostic-namespace-types";

// ── Source kind ────────────────────────────────────────────────────────────────

/**
 * The native diagnostic source module from which a diagnostic code originates.
 *
 * Maps 1-to-1 with `DiagnosticNamespaceLayer` via explicit switch in
 * `build-diagnostic-envelope-adapter.ts`. Prefix `native_` makes it clear
 * these represent the raw emission side, not the normalized audit side.
 *
 * - `native_mapper_free_preview`    — codes from `run-free-preview-mapper.ts`
 * - `native_mapper_paid_explanation`— codes from `run-paid-explanation-mapper.ts`
 * - `native_bridge`                 — codes from `run-smart-talk-bridge-dry-run.ts`
 * - `native_wording_review`         — codes from wording review compliance types
 * - `native_wording_evaluation`     — codes from `run-wording-evaluation-scaffold.ts`
 * - `native_ocr_uncertainty`        — codes from `evaluate-ocr-uncertainty.ts`
 * - `native_pilot_gate`             — codes from `run-limited-pilot-gate-scaffold.ts`
 * - `native_incident_governance`    — codes from `run-incident-governance-scaffold.ts`
 * - `native_provenance_audit`       — codes from `run-provenance-audit-scaffold.ts`
 * - `native_corpus_validation`      — codes from corpus boundary regression scaffolds
 * - `native_contract_validation`    — codes from explanation contract boundary validators
 * - `native_governance_lineage_audit`— codes from `run-governance-lineage-audit-scaffold.ts`
 * - `unknown`                       — source is unclassified
 */
export type DiagnosticEnvelopeSourceKind =
  | "native_mapper_free_preview"
  | "native_mapper_paid_explanation"
  | "native_bridge"
  | "native_wording_review"
  | "native_wording_evaluation"
  | "native_ocr_uncertainty"
  | "native_pilot_gate"
  | "native_incident_governance"
  | "native_provenance_audit"
  | "native_corpus_validation"
  | "native_contract_validation"
  | "native_governance_lineage_audit"
  | "unknown";

// ── Adapter input ──────────────────────────────────────────────────────────────

/**
 * Input to `buildDiagnosticEnvelopeFromNativeDiagnostic`.
 *
 * Describes a single native diagnostic code from a source module and the
 * metadata needed to produce a `DiagnosticNormalizedEnvelope`.
 *
 * `sourceKind`     — identifies which source module emitted the code; used to
 *                    derive `DiagnosticNamespaceLayer` for the envelope.
 * `code`           — the raw diagnostic code string (must be non-blank).
 * `severity`       — optional severity; defaults to `"informational"` if absent.
 * `phase`          — optional phase tag (e.g. `"8.2F-15O"`).
 * `sourceVersion`  — optional source module version string.
 * `notes`          — optional never-user-visible notes for the envelope.
 * `neverUserVisible`— compile-time invariant; adapter inputs are internal only.
 */
export interface DiagnosticEnvelopeAdapterInput {
  readonly sourceKind: DiagnosticEnvelopeSourceKind;
  readonly code: string;
  readonly severity?: DiagnosticSeverity;
  readonly phase?: string;
  readonly sourceVersion?: string;
  readonly notes?: readonly string[];
  readonly neverUserVisible: true;
}

// ── Adapter diagnostic codes ───────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes produced by the envelope adapter.
 *
 * - `diagnostic_adapter_unknown_source`      — `sourceKind === "unknown"`;
 *                                              layer mapped conservatively to "unknown".
 * - `diagnostic_adapter_empty_code`          — `code` is blank or empty; envelope not produced.
 * - `diagnostic_adapter_user_visible_violation`— `neverUserVisible !== true` at runtime;
 *                                              envelope produced with forced invariant.
 * - `diagnostic_adapter_default_severity_used`— no `severity` provided; defaulted to
 *                                              `"informational"`.
 * - `diagnostic_adapter_layer_mapping_fallback`— `sourceKind` is not in the explicit mapping
 *                                              table; layer defaulted to `"unknown"`.
 */
export type DiagnosticEnvelopeAdapterDiagnostic =
  | "diagnostic_adapter_unknown_source"
  | "diagnostic_adapter_empty_code"
  | "diagnostic_adapter_user_visible_violation"
  | "diagnostic_adapter_default_severity_used"
  | "diagnostic_adapter_layer_mapping_fallback";

// ── Adapter result ─────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `buildDiagnosticEnvelopeFromNativeDiagnostic`.
 *
 * `envelope`     — the `DiagnosticNormalizedEnvelope` produced. Always present
 *                  even when `adapted = false`; the envelope carries best-effort
 *                  metadata with `neverUserVisible: true` forced.
 * `adapted`      — `true` if the input was structurally valid and produced a
 *                  fully faithful envelope. `false` if a hard failure occurred
 *                  (blank code, visibility violation).
 * `diagnostics`  — ordered list of never-user-visible adapter diagnostic codes.
 * `neverUserVisible`— compile-time invariant.
 */
export interface DiagnosticEnvelopeAdapterResult {
  readonly envelope: DiagnosticNormalizedEnvelope;
  readonly adapted: boolean;
  readonly diagnostics: readonly DiagnosticEnvelopeAdapterDiagnostic[];
  readonly neverUserVisible: true;
}
