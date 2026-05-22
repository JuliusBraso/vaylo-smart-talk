/**
 * Limited Trusted Pilot Gate types (Phase 8.2F-11).
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
import type { OcrDegradationVector, OcrEvaluationResult } from "./ocr-uncertainty-types";
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
 */
export type PilotGateDiagnosticCode =
  | "pilot_gate_passed"
  | "pilot_unauthorized_subject"
  | "pilot_missing_consent"
  | "pilot_session_limit_reached"
  | "pilot_blocked_by_ocr_degradation"
  | "pilot_human_review_required_by_ocr"
  | "pilot_scope_not_allowed"
  | "pilot_metadata_incomplete";

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
 */
export interface LimitedPilotGateInput {
  readonly subject: PilotSubjectProfile;
  readonly telemetry: PilotSessionTelemetry;
  readonly scopeRequest: PilotScopeRequest;
  readonly ocrDegradation: OcrDegradationVector;
  readonly baseOcrConfidenceScore: number;
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
