/**
 * Real Text Redaction Boundary types (Phase 8.2H-2).
 *
 * Defines the type model for the deterministic redaction boundary that sits
 * between the 8.2H-1 input contract and the 8.2H-3 controlled live text adapter.
 *
 * The boundary takes a `RealTextInputContractAccepted` object and applies
 * conservative pattern-based redaction (email, phone, IBAN, tax ID, case
 * references, addresses, dates, amounts, personal names) before the text may
 * proceed to the controlled live adapter.
 *
 * Key safety properties:
 * - `RealTextRedactionMatch` records never contain raw matched values.
 * - `acceptedForControlledLiveAdapter: true` is only set on success.
 * - `acceptedForLLM: false` and `acceptedForRuntimePipeline: false` remain
 *   literal `false` throughout Phase 8.2H-2.
 * - `redactedText` is internal governance data — never user-visible here.
 *
 * Safety invariants encoded as literal types:
 * - acceptedForLLM: false
 * - acceptedForRuntimePipeline: false
 * - acceptedForUserVisibleOutput: false
 * - persistenceAllowed: false
 * - dnaSaveAllowed: false
 * - offlineSaveAllowed: false
 * - neverContainsRawDetectedValues: true
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 */

import type { RealTextInputContractAccepted } from "./real-text-input-contract-types";

export type { RealTextInputContractAccepted };

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The verdict of `runRealTextRedactionBoundary`.
 *
 * - `accepted_for_controlled_live_adapter`  — redaction passed; text ready for 8.2H-3.
 * - `rejected_input_not_accepted_for_redaction` — acceptedInput was null or
 *   did not carry `acceptedForRedactionBoundary: true`.
 * - `rejected_empty_after_redaction`        — redacted text is empty after patterns removed.
 * - `rejected_high_risk_pattern_detected`   — high-risk pattern present and
 *   `rejectHighRiskPatterns: true` was set.
 * - `rejected_redaction_invariant_violation`— post-redaction invariant check
 *   found residual patterns that should have been removed.
 */
export type RealTextRedactionBoundaryVerdict =
  | "accepted_for_controlled_live_adapter"
  | "rejected_input_not_accepted_for_redaction"
  | "rejected_empty_after_redaction"
  | "rejected_high_risk_pattern_detected"
  | "rejected_redaction_invariant_violation";

// ── Pattern kinds and risk ────────────────────────────────────────────────────

/** The categories of PII/sensitive patterns the redaction boundary handles. */
export type RealTextRedactionPatternKind =
  | "email_address"
  | "phone_number"
  | "iban"
  | "tax_id_like"
  | "case_reference_like"
  | "postal_address_like"
  | "date_like"
  | "money_amount_like"
  | "personal_name_like";

/** Risk classification of a redaction pattern match. */
export type RealTextRedactionRiskLevel = "low" | "medium" | "high";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RealTextRedactionDiagnosticCode =
  | "redaction_boundary_started"
  | "redaction_boundary_input_contract_confirmed"
  | "redaction_boundary_pattern_detected"
  | "redaction_boundary_redaction_applied"
  | "redaction_boundary_no_pattern_detected"
  | "redaction_boundary_accepted_for_controlled_live_adapter"
  | "redaction_boundary_rejected_input_not_accepted"
  | "redaction_boundary_rejected_empty_after_redaction"
  | "redaction_boundary_rejected_high_risk_pattern"
  | "redaction_boundary_rejected_invariant_violation"
  | "redaction_boundary_no_live_llm_confirmed"
  | "redaction_boundary_no_persistence_confirmed"
  | "redaction_boundary_no_dna_save_confirmed"
  | "redaction_boundary_no_offline_save_confirmed";

// ── Match audit record ────────────────────────────────────────────────────────

/**
 * Audit metadata for a single redaction match.
 *
 * IMPORTANT: This record does NOT contain the raw matched string.
 * Only the pattern kind, risk level, placeholder used, and an incrementing
 * match index are stored. This ensures the match log cannot be used to
 * reconstruct original PII values.
 *
 * `matchIndex`            — 0-based incrementing counter; NOT a string position.
 * `neverContainsRawValue` — compile-time attestation; always `true`.
 * `neverUserVisible`      — compile-time attestation; always `true`.
 */
export interface RealTextRedactionMatch {
  readonly kind: RealTextRedactionPatternKind;
  readonly riskLevel: RealTextRedactionRiskLevel;
  readonly placeholder: string;
  readonly matchIndex: number;
  readonly neverContainsRawValue: true;
  readonly neverUserVisible: true;
}

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runRealTextRedactionBoundary`.
 *
 * `acceptedInput`           — must be a non-null `RealTextInputContractAccepted`
 *                             with `acceptedForRedactionBoundary: true`.
 * `redactionRunId`          — opaque run ID for this redaction pass.
 * `rejectHighRiskPatterns`  — if `true`, any detection of a high-risk pattern
 *                             (IBAN, tax ID, personal name) rejects the input
 *                             rather than redacting it.
 * `neverUserVisible`        — compile-time invariant; must be `true`.
 */
export interface RealTextRedactionBoundaryInput {
  readonly acceptedInput: RealTextInputContractAccepted | null;
  readonly redactionRunId: string;
  readonly rejectHighRiskPatterns?: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Accepted redaction result ─────────────────────────────────────────────────

/**
 * The accepted redaction boundary output.
 *
 * `redactedText`                    — normalised text with detected patterns
 *                                     replaced by placeholders.
 * `acceptedForControlledLiveAdapter`— `true`; text may proceed to 8.2H-3.
 * `acceptedForLLM`                  — always literal `false` in 8.2H-2.
 * `acceptedForRuntimePipeline`      — always literal `false` in 8.2H-2.
 * `acceptedForUserVisibleOutput`    — always literal `false`.
 * `neverContainsRawDetectedValues`  — compile-time attestation that the
 *                                     `matches` array holds no raw PII strings.
 */
export interface RealTextRedactionBoundaryAccepted {
  readonly redactedText: string;
  readonly originalLength: number;
  readonly redactedLength: number;
  readonly redactionApplied: boolean;
  readonly matches: readonly RealTextRedactionMatch[];
  readonly acceptedForControlledLiveAdapter: true;
  readonly acceptedForLLM: false;
  readonly acceptedForRuntimePipeline: false;
  readonly acceptedForUserVisibleOutput: false;
  readonly persistenceAllowed: false;
  readonly dnaSaveAllowed: false;
  readonly offlineSaveAllowed: false;
  readonly neverContainsRawDetectedValues: true;
  readonly neverUserVisible: true;
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runRealTextRedactionBoundary`.
 *
 * `accepted` is non-null only when `verdict === "accepted_for_controlled_live_adapter"`.
 * All safety invariant fields are literal types.
 */
export interface RealTextRedactionBoundaryResult {
  readonly redactionRunId: string;
  readonly verdict: RealTextRedactionBoundaryVerdict;
  readonly diagnostics: readonly RealTextRedactionDiagnosticCode[];
  readonly accepted: RealTextRedactionBoundaryAccepted | null;
  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
