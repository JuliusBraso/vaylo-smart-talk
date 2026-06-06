/**
 * Real Redacted Text Forwarding Harness types (Phase 8.2I-4).
 *
 * Defines the type model for the dedicated forwarding proof harness that verifies
 * synthetic real-text fixtures with PII can flow through the full controlled
 * 8.2H → 8.2G governance chain using the native ControlledLiveTextDraftResult path.
 *
 * This harness:
 *   1. Accepts synthetic fixture input (no real user data).
 *   2. Runs the 8.2H chain: input contract → redaction boundary → adapter.
 *   3. Builds ControlledLiveTextRedactionProof + ControlledLiveTextDraftResult.
 *   4. Runs the 8.2G chain: output contract → wording → assembler → authorisation.
 *   5. Verifies raw PII values are never exposed in proof/draft metadata.
 *   6. Reports per-stage verdicts and trace flags.
 *
 * Safety invariants (literal types on the result):
 * - emittedToUserNow: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 * No real user data is ever processed.
 */

// ── Fixture modes ─────────────────────────────────────────────────────────────

/**
 * Fixture modes for the real redacted text forwarding harness.
 *
 * Success paths (reach full 8.2G chain):
 * - `pii_invoice_text`            — synthetic invoice with email, IBAN, phone, amount, date.
 * - `pii_payment_reminder_text`   — synthetic Zahlungserinnerung with reference/amount.
 * - `pii_jobcenter_text`          — synthetic Jobcenter notice with BG number, date, amount.
 * - `pii_question_text`           — synthetic question with email/reference/date (question mode).
 * - `human_review_text`           — valid chain; human-review score → blocked at auth.
 * - `wording_hard_fail_text`      — valid chain; hard-fail score → blocked at wording gate.
 *
 * Blocking paths:
 * - `high_risk_rejected_text`     — IBAN present; blocked at redaction boundary (high-risk mode).
 * - `legal_conclusion_requested_text` — requestedLegalConclusion: true → blocked at input contract.
 * - `persistence_requested_text`  — requestedPersistence: true → blocked at input contract.
 * - `missing_prefix_tamper`       — adapter result sections tampered to remove CONTROLLED prefix
 *                                   before buildControlledLiveTextDraftResult() → blocked.
 * - `invalid_proof_tamper`        — redaction proof tampered with invalid status field
 *                                   before buildControlledLiveTextDraftResult() → blocked.
 */
export type RealRedactedTextForwardingHarnessFixtureMode =
  | "pii_invoice_text"
  | "pii_payment_reminder_text"
  | "pii_jobcenter_text"
  | "pii_question_text"
  | "high_risk_rejected_text"
  | "legal_conclusion_requested_text"
  | "persistence_requested_text"
  | "missing_prefix_tamper"
  | "invalid_proof_tamper"
  | "human_review_text"
  | "wording_hard_fail_text";

// ── Harness verdict ───────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runRealRedactedTextForwardingHarness`.
 *
 * - `completed_authorised_internal_packet` — all 8.2H and 8.2G gates passed.
 * - `blocked_input_contract`               — input contract rejected.
 * - `blocked_redaction_boundary`           — redaction boundary rejected.
 * - `blocked_adapter`                      — controlled live text adapter rejected.
 * - `blocked_draft_result_build`           — ControlledLiveTextDraftResult build returned null.
 * - `blocked_output_contract`              — output contract validator rejected.
 * - `blocked_wording_gate`                 — wording governance gate rejected.
 * - `blocked_response_assembler`           — response assembler bridge rejected.
 * - `blocked_user_visible_authorisation`   — user-visible authorisation gate rejected.
 * - `failed_raw_value_leak_check`          — raw PII value found in draft/proof metadata.
 * - `failed_invariant_violation`           — nested layer violated a safety invariant.
 */
export type RealRedactedTextForwardingHarnessVerdict =
  | "completed_authorised_internal_packet"
  | "blocked_input_contract"
  | "blocked_redaction_boundary"
  | "blocked_adapter"
  | "blocked_draft_result_build"
  | "blocked_output_contract"
  | "blocked_wording_gate"
  | "blocked_response_assembler"
  | "blocked_user_visible_authorisation"
  | "failed_raw_value_leak_check"
  | "failed_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RealRedactedTextForwardingHarnessDiagnosticCode =
  | "real_redacted_forwarding_started"
  | "real_redacted_forwarding_input_contract_completed"
  | "real_redacted_forwarding_redaction_completed"
  | "real_redacted_forwarding_adapter_completed"
  | "real_redacted_forwarding_redaction_proof_built"
  | "real_redacted_forwarding_draft_result_built"
  | "real_redacted_forwarding_output_contract_completed"
  | "real_redacted_forwarding_wording_gate_completed"
  | "real_redacted_forwarding_response_assembler_completed"
  | "real_redacted_forwarding_authorisation_completed"
  | "real_redacted_forwarding_completed_authorised_packet"
  | "real_redacted_forwarding_blocked_input_contract"
  | "real_redacted_forwarding_blocked_redaction_boundary"
  | "real_redacted_forwarding_blocked_adapter"
  | "real_redacted_forwarding_blocked_draft_result_build"
  | "real_redacted_forwarding_blocked_output_contract"
  | "real_redacted_forwarding_blocked_wording_gate"
  | "real_redacted_forwarding_blocked_response_assembler"
  | "real_redacted_forwarding_blocked_user_visible_authorisation"
  | "real_redacted_forwarding_raw_value_leak_check_passed"
  | "real_redacted_forwarding_failed_raw_value_leak_check"
  | "real_redacted_forwarding_failed_invariant_violation"
  | "real_redacted_forwarding_no_live_llm_confirmed"
  | "real_redacted_forwarding_no_api_ui_confirmed"
  | "real_redacted_forwarding_no_persistence_confirmed"
  | "real_redacted_forwarding_no_dna_save_confirmed"
  | "real_redacted_forwarding_no_offline_save_confirmed"
  | "real_redacted_forwarding_no_user_visible_emission_confirmed";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runRealRedactedTextForwardingHarness`.
 *
 * `harnessRunId`   — opaque run ID; propagated to all nested layers.
 * `fixtureMode`    — determines which synthetic PII scenario to exercise.
 * `neverUserVisible` — compile-time invariant; must be `true`.
 */
export interface RealRedactedTextForwardingHarnessInput {
  readonly harnessRunId: string;
  readonly fixtureMode: RealRedactedTextForwardingHarnessFixtureMode;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runRealRedactedTextForwardingHarness`.
 *
 * Per-stage verdict strings are recorded for traceability.
 * `rawValueLeakCheckPassed` is `true` only if no known synthetic fixture PII
 * values appear in the draft section texts or proof metadata.
 * `emittedToUserNow` is always literal `false` — this harness never emits output.
 */
export interface RealRedactedTextForwardingHarnessResult {
  readonly harnessRunId: string;
  readonly fixtureMode: RealRedactedTextForwardingHarnessFixtureMode;
  readonly verdict: RealRedactedTextForwardingHarnessVerdict;
  readonly diagnostics: readonly RealRedactedTextForwardingHarnessDiagnosticCode[];

  readonly inputContractVerdict: string;
  readonly redactionBoundaryVerdict: string;
  readonly adapterVerdict: string;
  readonly outputContractVerdict: string;
  readonly wordingGateVerdict: string;
  readonly responseAssemblerVerdict: string;
  readonly authorisationVerdict: string;

  readonly redactionApplied: boolean;
  readonly redactionMatchCount: number;
  readonly redactionProofValid: boolean;
  readonly controlledLiveTextDraftBuilt: boolean;
  readonly controlledLiveTextDraftUsed: boolean;
  readonly realRedactedTextForwardedToOutputContract: boolean;
  readonly rawValueLeakCheckPassed: boolean;

  readonly packetCreated: boolean;
  readonly acceptedForUserVisibleAssembly: boolean;
  readonly userVisibleOutputAllowedForFuture: boolean;
  readonly emittedToUserNow: false;

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}
