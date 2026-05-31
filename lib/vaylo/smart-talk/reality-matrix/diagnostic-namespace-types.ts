/**
 * Cross-Phase Diagnostic Namespace Types (Phase 8.2F-15J).
 *
 * Provides a typed audit envelope model that can wrap diagnostics from any
 * governance layer without merging their source unions or changing any
 * diagnostic generation behavior.
 *
 * Problem addressed (Debt 5):
 *   Diagnostics currently exist as isolated layer-specific unions
 *   (FreePreviewMapperDiagnosticCode, BridgeDiagnosticCode, OcrDiagnosticCode,
 *   PilotGateDiagnosticCode, etc.). There is no shared model to answer:
 *   - which layer emitted this diagnostic
 *   - what severity class it belongs to
 *   - whether it is user-visible
 *   - whether it is blocking or informational
 *
 * Solution (Phase 8.2F-15J):
 *   A thin envelope layer — `DiagnosticNormalizedEnvelope` — wraps the raw
 *   string code from any source union and tags it with layer identity, severity,
 *   and visibility metadata. Source modules retain their own typed unions and
 *   emit diagnostics exactly as before. Envelopes are audit/correlation helpers
 *   only.
 *
 * Safety guarantees:
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - no mapper, bridge, pilot, or incident behavior changed
 * - no existing diagnostic codes renamed or removed
 * - all envelopes carry neverUserVisible: true
 */

// ── Diagnostic namespace layer ─────────────────────────────────────────────────

/**
 * The governance pipeline layer that owns and emits a diagnostic.
 *
 * - `mapper_free_preview`    — FreePreviewMapperDiagnosticCode (run-free-preview-mapper.ts)
 * - `mapper_paid_explanation`— PaidExplanationMapperDiagnosticCode (run-paid-explanation-mapper.ts)
 * - `bridge`                 — BridgeDiagnosticCode (run-smart-talk-bridge-dry-run.ts)
 * - `wording_review`         — WordingReviewDiagnosticCode (wording-review types)
 * - `wording_evaluation`     — WordingViolationCode (run-wording-evaluation-scaffold.ts)
 * - `ocr_uncertainty`        — OcrDiagnosticCode (evaluate-ocr-uncertainty.ts)
 * - `pilot_gate`             — PilotGateDiagnosticCode (run-limited-pilot-gate-scaffold.ts)
 * - `incident_governance`    — IncidentDiagnosticCode (run-incident-governance-scaffold.ts)
 * - `provenance_audit`       — AuditTraceDiagnosticCode (run-provenance-audit-scaffold.ts)
 * - `corpus_validation`      — corpus boundary regression diagnostic codes
 * - `contract_validation`    — explanation contract boundary validation codes
 * - `governance_lineage_audit`— GovernanceAuditFindingSeverity (run-governance-lineage-audit-scaffold.ts)
 * - `unknown`                — layer is unclassified (emits `unknown` layer in envelope)
 */
export type DiagnosticNamespaceLayer =
  | "mapper_free_preview"
  | "mapper_paid_explanation"
  | "bridge"
  | "wording_review"
  | "wording_evaluation"
  | "ocr_uncertainty"
  | "pilot_gate"
  | "incident_governance"
  | "provenance_audit"
  | "corpus_validation"
  | "contract_validation"
  | "governance_lineage_audit"
  | "unknown";

// ── Diagnostic severity ────────────────────────────────────────────────────────

/**
 * Severity classification for a normalized diagnostic envelope.
 *
 * - `informational` — no action required; lineage or observability record.
 * - `warning`       — anomaly or partial debt; may require review.
 * - `blocking`      — condition that stops or gates further processing.
 * - `critical`      — hard failure; must be resolved before any real deployment.
 */
export type DiagnosticSeverity =
  | "informational"
  | "warning"
  | "blocking"
  | "critical";

// ── Diagnostic visibility ──────────────────────────────────────────────────────

/**
 * Visibility class for a normalized diagnostic envelope.
 *
 * - `never_user_visible`  — compile-time invariant; diagnostic must never reach any user.
 * - `internal_audit_only` — visible only to internal governance/audit tooling.
 *
 * Both values guarantee no user-facing exposure. `never_user_visible` is the
 * strictest form and is preferred for all Reality Matrix diagnostics.
 */
export type DiagnosticVisibility =
  | "never_user_visible"
  | "internal_audit_only";

// ── Normalized diagnostic envelope ────────────────────────────────────────────

/**
 * A typed audit envelope that wraps a raw diagnostic code from any governance
 * layer and adds namespace, severity, and visibility metadata for cross-phase
 * audit correlation.
 *
 * `layer`          — the pipeline layer that owns this diagnostic code.
 * `code`           — the raw diagnostic code string (must be non-empty).
 * `severity`       — informational / warning / blocking / critical.
 * `visibility`     — never_user_visible or internal_audit_only.
 * `phase`          — optional phase/version tag of the emitting module.
 * `sourceVersion`  — optional scaffold/validator version string.
 * `neverUserVisible`— compile-time invariant; every envelope is internal only.
 * `notes`          — optional never-user-visible audit notes.
 *
 * Envelopes do NOT replace source diagnostics — they are additive audit
 * correlation helpers. Source modules retain their own typed unions.
 */
export interface DiagnosticNormalizedEnvelope {
  readonly layer: DiagnosticNamespaceLayer;
  readonly code: string;
  readonly severity: DiagnosticSeverity;
  readonly visibility: DiagnosticVisibility;
  readonly phase?: string;
  readonly sourceVersion?: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Namespace validation result ────────────────────────────────────────────────

/**
 * The never-user-visible result of validating a collection of
 * `DiagnosticNormalizedEnvelope` instances.
 *
 * `valid`                  — `true` if no hard structural violations (empty codes,
 *                            user-visible violations) are present.
 * `fullyConsistent`        — `true` if `valid` AND no unknown layers AND no
 *                            duplicate envelope keys are present.
 * `unknownLayers`          — codes whose `layer` is `"unknown"` (soft warning only).
 * `emptyCodes`             — indices/keys of envelopes with empty `code` strings.
 * `userVisibleViolations`  — indices/keys of envelopes with `neverUserVisible !== true`.
 * `duplicateEnvelopeKeys`  — deduplicated `${layer}:${code}:${phase ?? ""}` strings
 *                            that appear more than once in the input collection.
 * `neverUserVisible`       — compile-time invariant.
 * `notes`                  — optional never-user-visible diagnostic notes.
 */
export interface DiagnosticNamespaceValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly unknownLayers: readonly string[];
  readonly emptyCodes: readonly string[];
  readonly userVisibleViolations: readonly string[];
  readonly duplicateEnvelopeKeys: readonly string[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
