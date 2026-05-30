/**
 * Limited Trusted Pilot Gate types (Phase 8.2F-11 / 8.2F-15E OCR confidence provenance).
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
 * `pilot_ocr_confidence_unattested` (8.2F-15E): emitted as an informational
 * diagnostic when OCR confidence is supplied as a raw `baseOcrConfidenceScore`
 * number rather than a structured `OcrQualityReport`. Does not block the gate —
 * it signals a provenance gap for governance audit purposes only.
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
  | "pilot_ocr_confidence_unattested";

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
  readonly telemetry: PilotSessionTelemetry;
  readonly scopeRequest: PilotScopeRequest;
  readonly ocrDegradation: OcrDegradationVector;
  /** @deprecated Prefer `ocrQualityReport` (8.2F-15E). Raw number accepted for backward compatibility. */
  readonly baseOcrConfidenceScore?: number;
  /** Structured provenance-backed OCR confidence report (8.2F-15E). Preferred over `baseOcrConfidenceScore`. */
  readonly ocrQualityReport?: OcrQualityReport;
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
