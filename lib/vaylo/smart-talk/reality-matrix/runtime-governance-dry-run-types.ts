/**
 * Runtime Governance Dry-Run types (Phase 8.2G-4).
 *
 * Defines the type model for the dry-run harness that connects the 8.2G
 * pipeline gates (mock adapter → output contract validator → wording governance
 * gate) to the existing 8.2F audit trace emission and diagnostic envelope
 * adapter infrastructure.
 *
 * Purpose:
 * Prove that a full governance chain produces a valid AuditTraceChain and
 * normalized DiagnosticEnvelopes without calling any live LLM, without
 * persistence, without runtime Smart Talk wiring, and without user-visible output.
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys or env vars
 * - no persistence (no DB, no log, no file writes)
 * - no telemetry
 * - no Smart Talk production connection
 * - no OCR SDK
 * - no user-visible output
 * - liveLLMCalled is always literal false
 * - persistenceUsed is always literal false
 * - userVisibleOutputAllowed is always literal false
 * - neverUserVisible is always true
 */

import type { RuntimeLLMDraftAdapterInput, RuntimeLLMDraftAdapterResult } from "./runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractValidationResult } from "./runtime-llm-output-contract-validator-types";
import type { RuntimeWordingGateResult } from "./runtime-wording-governance-gate-types";
import type { AuditTraceEmissionRecord } from "./reality-simulation/audit-trace-emission-types";
import type { AuditTraceChain } from "./reality-simulation/provenance-audit-types";
import type { DiagnosticNormalizedEnvelope } from "./diagnostic-namespace-types";
import type { WordingToneScoreReport } from "./reality-simulation/wording-evaluation-types";

// Re-export for convenience of regression scaffold consumers.
export type {
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMOutputContractValidationResult,
  RuntimeWordingGateResult,
  AuditTraceEmissionRecord,
  AuditTraceChain,
  DiagnosticNormalizedEnvelope,
  WordingToneScoreReport,
};

// ── Verdict ────────────────────────────────────────────────────────────────────

/**
 * The verdict of a completed runtime governance dry run.
 *
 * - `completed_successfully`             — all gates passed; audit trace and
 *                                          diagnostic envelopes are valid.
 * - `completed_with_human_review_required`— wording gate requested human review;
 *                                          dry run completed but a reviewer must
 *                                          approve before any live assembly.
 * - `blocked_by_output_contract`         — LLM output contract validator rejected
 *                                          the draft; dry run halted at gate 2.
 * - `blocked_by_wording_gate`            — wording governance gate hard-failed;
 *                                          dry run halted at gate 3.
 * - `failed_audit_trace_validation`      — one or more audit trace emissions or
 *                                          the assembled AuditTraceChain failed
 *                                          structural validation.
 * - `failed_diagnostic_envelope_validation`— one or more diagnostic envelopes
 *                                          failed namespace validation.
 */
export type RuntimeGovernanceDryRunVerdict =
  | "completed_successfully"
  | "completed_with_human_review_required"
  | "blocked_by_output_contract"
  | "blocked_by_wording_gate"
  | "failed_audit_trace_validation"
  | "failed_diagnostic_envelope_validation";

// ── Diagnostic codes ───────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted during a runtime governance dry run.
 *
 * Progress markers:
 * - `runtime_dry_run_started`                     — harness entry confirmed.
 * - `runtime_dry_run_mock_adapter_completed`       — 8.2G-1 mock adapter returned.
 * - `runtime_dry_run_output_contract_validated`    — 8.2G-2 validator ran.
 * - `runtime_dry_run_wording_gate_completed`       — 8.2G-3 wording gate ran.
 * - `runtime_dry_run_audit_trace_emitted`          — emissions created for all steps.
 * - `runtime_dry_run_audit_trace_validated`        — AuditTraceChain validated true.
 * - `runtime_dry_run_diagnostic_envelopes_created` — envelopes built from native diagnostics.
 * - `runtime_dry_run_diagnostic_envelopes_validated`— envelopes passed namespace validation.
 *
 * Blocking / failure markers:
 * - `runtime_dry_run_blocked_by_output_contract`   — output contract gate rejected.
 * - `runtime_dry_run_blocked_by_wording_gate`      — wording gate hard-failed.
 * - `runtime_dry_run_human_review_required`        — wording gate requested human review.
 * - `runtime_dry_run_audit_trace_invalid`          — trace emission or chain invalid.
 * - `runtime_dry_run_diagnostic_envelope_invalid`  — envelope namespace validation failed.
 *
 * Invariant confirmations:
 * - `runtime_dry_run_user_visible_output_forbidden`— confirmed no user-visible output.
 * - `runtime_dry_run_no_live_llm_confirmed`        — confirmed no live LLM called.
 * - `runtime_dry_run_no_persistence_confirmed`     — confirmed no persistence used.
 */
export type RuntimeGovernanceDryRunDiagnosticCode =
  | "runtime_dry_run_started"
  | "runtime_dry_run_mock_adapter_completed"
  | "runtime_dry_run_output_contract_validated"
  | "runtime_dry_run_wording_gate_completed"
  | "runtime_dry_run_audit_trace_emitted"
  | "runtime_dry_run_audit_trace_validated"
  | "runtime_dry_run_diagnostic_envelopes_created"
  | "runtime_dry_run_diagnostic_envelopes_validated"
  | "runtime_dry_run_blocked_by_output_contract"
  | "runtime_dry_run_blocked_by_wording_gate"
  | "runtime_dry_run_human_review_required"
  | "runtime_dry_run_audit_trace_invalid"
  | "runtime_dry_run_diagnostic_envelope_invalid"
  | "runtime_dry_run_user_visible_output_forbidden"
  | "runtime_dry_run_no_live_llm_confirmed"
  | "runtime_dry_run_no_persistence_confirmed";

// ── Input ──────────────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeGovernanceDryRun`.
 *
 * `draftInput`       — the governance-constrained input forwarded to the 8.2G-1
 *                      mock adapter.
 * `scoreReport`      — the wording tone score report forwarded to the 8.2G-3
 *                      wording governance gate. `null` signals that no score
 *                      report is available; the gate will block accordingly.
 * `dryRunId`         — opaque deterministic identifier for this dry-run invocation.
 *                      Used to produce deterministic emissionId values.
 * `neverUserVisible` — compile-time invariant; dry-run inputs are internal only.
 * `notes`            — optional never-user-visible governance notes.
 */
export interface RuntimeGovernanceDryRunInput {
  readonly draftInput: RuntimeLLMDraftAdapterInput;
  readonly scoreReport: WordingToneScoreReport | null;
  readonly dryRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ─────────────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeGovernanceDryRun`.
 *
 * Carries all intermediate pipeline results, the assembled audit trace chain,
 * normalized diagnostic envelopes, validation outcomes, and the final verdict.
 *
 * `dryRunId`                  — echoes back the input `dryRunId`.
 * `verdict`                   — final governance verdict for this dry run.
 * `draftResult`               — output from 8.2G-1 mock adapter.
 * `outputContractValidation`  — output from 8.2G-2 contract validator.
 * `wordingGateResult`         — output from 8.2G-3 wording governance gate.
 * `auditTraceEmissions`       — all audit trace emission records created during
 *                               the dry run (one per pipeline step).
 * `auditTraceChain`           — assembled AuditTraceChain from all emissions.
 * `auditTraceValid`           — true if AuditTraceChain passed `validateAuditTraceChain`.
 * `diagnosticEnvelopes`       — normalized envelopes from all native diagnostics.
 * `diagnosticEnvelopeValid`   — true if envelopes passed `validateDiagnosticNamespaceEnvelopes`.
 * `diagnostics`               — ordered list of runtime dry-run diagnostic codes.
 * `liveLLMCalled`             — always literal false; no live LLM is ever called.
 * `persistenceUsed`           — always literal false; no persistence is ever used.
 * `userVisibleOutputAllowed`  — always literal false; output must never reach a user.
 * `neverUserVisible`          — compile-time invariant; this result is audit only.
 * `notes`                     — optional never-user-visible governance notes.
 */
export interface RuntimeGovernanceDryRunResult {
  readonly dryRunId: string;
  readonly verdict: RuntimeGovernanceDryRunVerdict;
  readonly draftResult: RuntimeLLMDraftAdapterResult;
  readonly outputContractValidation: RuntimeLLMOutputContractValidationResult;
  readonly wordingGateResult: RuntimeWordingGateResult;
  readonly auditTraceEmissions: readonly AuditTraceEmissionRecord[];
  readonly auditTraceChain: AuditTraceChain;
  readonly auditTraceValid: boolean;
  readonly diagnosticEnvelopes: readonly DiagnosticNormalizedEnvelope[];
  readonly diagnosticEnvelopeValid: boolean;
  readonly diagnostics: readonly RuntimeGovernanceDryRunDiagnosticCode[];
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
