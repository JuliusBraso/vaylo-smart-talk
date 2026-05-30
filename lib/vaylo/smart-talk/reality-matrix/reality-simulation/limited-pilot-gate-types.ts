/**
 * Limited Trusted Pilot Gate types (Phase 8.2F-11 / 8.2F-15E OCR provenance /
 * 8.2F-15F pilot telemetry provenance contract).
 *
 * Metadata-only type model for the future Limited Trusted Pilot Gate.
 * No real user access, no pilot activation, no DB, no auth integration.
 *
 * Safety guarantees:
 * - no real user data modeled here
 * - no database reads or writes
 * - no authentication implementation
 * - no consent capture logic
 * - no OCR SDK imported
 * - no LLM calls
 * - no Smart Talk wiring
 * - all results carry neverUserVisible: true
 */

import type { ExplanationAccessTier } from "./explanation-contract-types";
import type {
  OcrDegradationVector,
  OcrEvaluationResult,
  OcrQualityReport,
} from "./ocr-uncertainty-types";
import type { RedactedDocumentCategory } from "./redacted-corpus-types";

// ── Disposition and diagnostics ───────────────────────────────────────────────

/**
 * The structural routing decision for a hypothetical pilot transaction.
 *
 * - `allowed`: all gate checks pass; transaction may proceed within pilot scope.
 * - `blocked`: one or more gate checks failed; transaction must not proceed.
 * - `human_review_required`: transaction may proceed but human review is mandatory
 *   before any output is produced (typically triggered by OCR ambiguity).
 * - `out_of_scope`: the requested transaction falls outside the pilot scope boundary.
 */
export type PilotAccessDisposition =
  | "allowed"
  | "blocked"
  | "human_review_required"
  | "out_of_scope";

/**
 * Never-user-visible governance diagnostic codes emitted by
 * `runLimitedPilotGateScaffold`.
 *
 * `pilot_ocr_confidence_unattested` (8.2F-15E): emitted when OCR confidence is
 * supplied as a raw `baseOcrConfidenceScore` rather than an `OcrQualityReport`.
 * Non-blocking — signals a provenance gap for audit purposes only.
 *
 * `pilot_session_telemetry_unattested` (8.2F-15F): emitted when session telemetry
 * is supplied as a raw `PilotSessionTelemetry` (or an `unattested` `PilotSessionReport`)
 * rather than an attested `PilotSessionReport`. Non-blocking — signals a provenance
 * gap for audit purposes only.
 *
 * `pilot_session_report_invalid` (8.2F-15F): emitted and gate blocked when a
 * `PilotSessionReport` fails structural validation (non-finite count, empty IDs, etc.).
 */
export type PilotGateDiagnosticCode =
  | "pilot_gate_passed"
  | "pilot_unauthorized_subject"
  | "pilot_missing_consent"
  | "pilot_session_limit_reached"
  | "pilot_blocked_by_ocr_degradation"
  | "pilot_human_review_required_by_ocr"
  | "pilot_scope_not_allowed"
  | "pilot_metadata_incomplete"
  | "pilot_ocr_confidence_unattested"
  | "pilot_session_telemetry_unattested"
  | "pilot_session_report_invalid";

// ── Input types ───────────────────────────────────────────────────────────────

/**
 * Structural profile of a hypothetical pilot subject.
 * Contains no real user identity — only structural metadata flags.
 *
 * `pilotSubjectRef`: opaque string reference for audit tracing; not a real user ID.
 * `isInvited`: whether this subject has been structurally invited to the pilot.
 * `consentSigned`: whether this subject has structurally signed pilot consent.
 * `pilotRole`: the role classification in this pilot run.
 * `neverContainsRealUserData`: compile-time safety guard; must be `true` in scaffold.
 */
export interface PilotSubjectProfile {
  readonly pilotSubjectRef: string;
  readonly isInvited: boolean;
  readonly consentSigned: boolean;
  readonly pilotRole: "internal_tester" | "trusted_external_user";
  readonly neverContainsRealUserData?: true;
}

/**
 * Structural telemetry for a pilot session.
 * Used to enforce per-session transaction limits without reading live DB state.
 *
 * `totalTransactionsThisSession`: caller-supplied count for this session.
 * `maxSessionLimit`: the structural cap for this pilot run.
 * `sequenceId`: opaque audit reference for this session; not a real session token.
 */
export interface PilotSessionTelemetry {
  readonly totalTransactionsThisSession: number;
  readonly maxSessionLimit: number;
  readonly sequenceId: string;
}

/**
 * Structural scope metadata for a hypothetical pilot transaction request.
 *
 * `documentFamily`: the document category this transaction involves.
 * `sourceMode`: how the document was sourced; only `"synthetic_only"` and
 *   `"manual_input"` are permitted in Phase 8.2F-11.
 * `accessTier`: the explanation tier requested.
 * `containsRealUserDocument`: if `true`, the transaction is immediately out of
 *   scope and triggers `governanceCompromised = true`. No real user documents
 *   may enter the pilot scaffold in Phase 8.2F-11.
 */
export interface PilotScopeRequest {
  readonly documentFamily?: RedactedDocumentCategory;
  readonly sourceMode?: "synthetic_only" | "real_document_upload" | "manual_input";
  readonly accessTier?: ExplanationAccessTier;
  readonly containsRealUserDocument?: boolean;
}

// ── Pilot session report provenance contract (Phase 8.2F-15F) ────────────────

/**
 * The origin kind of a structured pilot session report.
 *
 * - `synthetic_metadata`: manually constructed metadata fixture (no real session store).
 * - `manual_test_fixture`: authored by a human for regression/audit purposes.
 * - `future_session_store`: reserved for a real session store integration (not yet connected).
 * - `imported_session_report`: imported from an external session-reporting system.
 */
export type PilotSessionReportSourceKind =
  | "synthetic_metadata"
  | "manual_test_fixture"
  | "future_session_store"
  | "imported_session_report";

/**
 * The attestation posture of a structured pilot session report.
 *
 * - `unattested`: session counts were supplied by the caller without any verified
 *   source; downstream consumers should note this provenance gap.
 * - `test_fixture_attested`: report was authored and reviewed as an explicit
 *   regression/audit fixture; safe to use in governance scaffolds.
 * - `future_store_attested`: reserved for reports produced by a verified session
 *   store in a future production phase.
 */
export type PilotSessionAttestationStatus =
  | "unattested"
  | "test_fixture_attested"
  | "future_store_attested";

/**
 * A structured provenance-backed pilot session report.
 *
 * This type replaces the bare `PilotSessionTelemetry` interface as the
 * preferred way to carry session transaction counts through the pilot gate.
 * It binds the counts to a provenance source and attestation status,
 * making caller-supplied manipulation detectable at the governance layer.
 *
 * `reportId`: opaque identifier for audit tracing; not a real session token.
 * `sourceKind`: how this report was produced.
 * `attestationStatus`: the trust posture of this report.
 * `totalTransactionsThisSession`: caller-supplied session count (validated structurally).
 * `maxSessionLimit`: the structural cap for this pilot run.
 * `sequenceId`: opaque audit reference; not a real session ID.
 * `generatedBy`: opaque string identifying the system or fixture that produced this report.
 * `neverUserVisible`: compile-time invariant — this report must never reach UI.
 * `notes`: internal governance notes — never user-visible.
 */
export interface PilotSessionReport {
  readonly reportId: string;
  readonly sourceKind: PilotSessionReportSourceKind;
  readonly attestationStatus: PilotSessionAttestationStatus;
  readonly totalTransactionsThisSession: number;
  readonly maxSessionLimit: number;
  readonly sequenceId: string;
  readonly generatedBy: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

/**
 * Structural validation result for a `PilotSessionReport` at the governance ingress.
 *
 * `valid`: basic structural integrity passed (non-empty IDs, valid numeric fields).
 * `telemetryUsable`: session counts are finite and within accepted bounds.
 * `diagnostics`: human-internal notes about detected issues; never user-visible.
 * `neverUserVisible`: compile-time invariant.
 */
export interface PilotSessionReportValidationResult {
  readonly valid: boolean;
  readonly telemetryUsable: boolean;
  readonly diagnostics: readonly string[];
  readonly neverUserVisible: true;
}

/**
 * The complete input to `runLimitedPilotGateScaffold`.
 * All fields are structural metadata — no live runtime state.
 *
 * **OCR confidence provenance (8.2F-15E):**
 * The preferred path is to supply `ocrQualityReport` — a structured,
 * provenance-backed confidence report. When present, its `confidenceScore`
 * is used and its `attestationStatus` is recorded in the evaluation notes.
 *
 * For backward compatibility, `baseOcrConfidenceScore` (raw number) remains
 * accepted. When only the raw score is supplied, the gate emits the informational
 * `pilot_ocr_confidence_unattested` diagnostic to record the provenance gap.
 *
 * If neither is supplied, the gate treats confidence as 0 (hard-fail territory).
 *
 * At most one of `ocrQualityReport` / `baseOcrConfidenceScore` should be supplied
 * per call; if both are present, `ocrQualityReport` takes precedence.
 */
export interface LimitedPilotGateInput {
  readonly subject: PilotSubjectProfile;
  readonly scopeRequest: PilotScopeRequest;
  readonly ocrDegradation: OcrDegradationVector;
  /**
   * @deprecated Prefer `ocrQualityReport` (8.2F-15E). Raw number accepted for backward compatibility.
   * When only this is supplied, `pilot_ocr_confidence_unattested` is emitted.
   */
  readonly baseOcrConfidenceScore?: number;
  /** Structured provenance-backed OCR confidence report (8.2F-15E). Preferred over `baseOcrConfidenceScore`. */
  readonly ocrQualityReport?: OcrQualityReport;
  /**
   * @deprecated Prefer `sessionReport` (8.2F-15F). Raw session telemetry accepted for backward compatibility.
   * When only this is supplied, `pilot_session_telemetry_unattested` is emitted.
   */
  readonly telemetry?: PilotSessionTelemetry;
  /**
   * Structured provenance-backed pilot session report (8.2F-15F). Preferred over `telemetry`.
   * When present, its transaction counts are used for the session limit gate.
   * If `attestationStatus === "unattested"`, `pilot_session_telemetry_unattested` is
   * still emitted as an informational diagnostic.
   * At most one of `sessionReport` / `telemetry` should be supplied; if both are present,
   * `sessionReport` takes precedence.
   */
  readonly sessionReport?: PilotSessionReport;
}

// ── Result type ───────────────────────────────────────────────────────────────

/**
 * The never-user-visible output of `runLimitedPilotGateScaffold`.
 *
 * `transactionAllowed`: whether the hypothetical transaction may structurally proceed.
 * `disposition`: the routing decision for this transaction.
 * `diagnostics`: ordered gate diagnostic codes for audit tracing.
 * `ocrEvaluation`: the full OCR uncertainty evaluation result; always present
 *   regardless of which gate check triggered the final disposition.
 * `governanceCompromised`: `true` if a real user document was presented in scope
 *   (hard governance boundary violation).
 * `neverUserVisible`: compile-time invariant.
 * `notes`: internal governance notes — never user-visible.
 */
export interface LimitedPilotGateResult {
  readonly transactionAllowed: boolean;
  readonly disposition: PilotAccessDisposition;
  readonly diagnostics: readonly PilotGateDiagnosticCode[];
  readonly ocrEvaluation: OcrEvaluationResult;
  readonly governanceCompromised: boolean;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}
