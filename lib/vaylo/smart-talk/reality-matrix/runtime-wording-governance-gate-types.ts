/**
 * Runtime Wording Governance Gate types (Phase 8.2G-3).
 *
 * Defines the type model for the wording safety gate that sits between the
 * LLM output contract validator (Phase 8.2G-2) and the future audit dry-run
 * layer (Phase 8.2G-4).
 *
 * This gate consumes only drafts whose `RuntimeLLMOutputContractValidationResult`
 * verdict is `accepted_for_next_gate`. It then evaluates the caller-supplied
 * `WordingToneScoreReport` using the existing wording evaluation scaffold from
 * Phase 8.2F-12/8.2F-15G — without any live LLM judge, NLP library, or real
 * prose semantic analysis.
 *
 * Position in the 15-layer runtime pipeline (Phase 8.2G-0):
 *   llm_output_contract_validator (8.2G-2)
 *     → wording_evaluation_gate (8.2G-3)  [THIS GATE]
 *     → audit_trace_emission (8.2G-4)
 *     → ...
 *     → user_visible_response_assembler (8.2G-6)
 *
 * Safety guarantees:
 * - no live LLM judge called
 * - no NLP library imported
 * - no real prose semantically evaluated
 * - no user-visible output produced
 * - acceptedForUserVisibleAssembly is always literal false
 * - liveLLMJudgeCalled is always literal false
 * - realTextSemanticallyEvaluated is always literal false
 * - userVisibleOutputAllowed is always literal false
 * - neverUserVisible is always literal true
 */

import type { RuntimeLLMDraftSectionType } from "./runtime-llm-draft-adapter-types";
import type { WordingEvaluationDisposition, WordingEvaluationResult, WordingToneScoreReport } from "./reality-simulation/wording-evaluation-types";
import type { RuntimeLLMDraftAdapterResult } from "./runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractValidationResult } from "./runtime-llm-output-contract-validator-types";

// Re-export for convenience so callers only need to import from this file.
export type { WordingToneScoreReport };

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict from `runRuntimeWordingGovernanceGate`.
 *
 * - `accepted_for_audit_dry_run`    — score report is valid and wording evaluation
 *                                     returned `approved`; draft may proceed to
 *                                     Phase 8.2G-4 (audit trace dry run).
 * - `rejected_previous_gate_failed` — the upstream LLM output contract validator
 *                                     (Phase 8.2G-2) did not return
 *                                     `accepted_for_next_gate`; wording evaluation
 *                                     is not run.
 * - `human_review_required`         — score report passed validation but wording
 *                                     evaluation returned `human_review_required`.
 * - `hard_fail_wording_violation`   — wording evaluation returned
 *                                     `hard_fail_tone_violation`; draft must not
 *                                     proceed under any circumstances.
 * - `rejected_missing_score_report` — `scoreReport` was `null`; no evaluation
 *                                     is possible.
 * - `rejected_invalid_score_report` — `scoreReport` failed structural validation
 *                                     (blank IDs or non-finite matrix values).
 */
export type RuntimeWordingGateVerdict =
  | "accepted_for_audit_dry_run"
  | "rejected_previous_gate_failed"
  | "human_review_required"
  | "hard_fail_wording_violation"
  | "rejected_missing_score_report"
  | "rejected_invalid_score_report";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the wording governance gate.
 *
 * - `wording_gate_previous_contract_not_accepted`     — upstream contract validator
 *                                                       did not return accepted.
 * - `wording_gate_missing_score_report`               — scoreReport is null.
 * - `wording_gate_invalid_score_report`               — scoreReport failed structural
 *                                                       validation.
 * - `wording_gate_score_report_unattested`            — scoreReport.attestationStatus
 *                                                       is `"unattested"`; provenance gap
 *                                                       recorded but evaluation proceeds.
 * - `wording_gate_human_review_required`              — wording evaluation returned
 *                                                       `human_review_required`.
 * - `wording_gate_hard_fail_tone_violation`           — wording evaluation returned
 *                                                       `hard_fail_tone_violation`.
 * - `wording_gate_accepted_for_audit_dry_run`         — gate approved; draft may
 *                                                       proceed to Phase 8.2G-4.
 * - `wording_gate_user_visible_output_still_forbidden`— invariant: user-visible
 *                                                       output remains forbidden.
 * - `wording_gate_draft_text_not_evaluated_semantically`— invariant: no prose
 *                                                       semantic analysis was run.
 * - `wording_gate_never_user_visible_preserved`       — invariant: neverUserVisible
 *                                                       is true throughout the gate.
 */
export type RuntimeWordingGateDiagnosticCode =
  | "wording_gate_previous_contract_not_accepted"
  | "wording_gate_missing_score_report"
  | "wording_gate_invalid_score_report"
  | "wording_gate_score_report_unattested"
  | "wording_gate_human_review_required"
  | "wording_gate_hard_fail_tone_violation"
  | "wording_gate_accepted_for_audit_dry_run"
  | "wording_gate_user_visible_output_still_forbidden"
  | "wording_gate_draft_text_not_evaluated_semantically"
  | "wording_gate_never_user_visible_preserved";

// ── Per-section result ────────────────────────────────────────────────────────

/**
 * The wording gate result for a single `RuntimeLLMDraftSectionCandidate`.
 *
 * `sectionType`                — the type of the validated section.
 * `accepted`                   — `true` only when gate verdict is
 *                                `accepted_for_audit_dry_run`.
 * `wordingEvaluationDisposition`— the global wording evaluation disposition
 *                                mirrored on each section (evaluation runs at
 *                                draft level, not per-section, in this phase).
 * `diagnostics`                — section-level gate diagnostic codes.
 * `neverUserVisible`           — compile-time invariant.
 * `notes`                      — optional governance notes.
 */
export interface RuntimeWordingGateSectionResult {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly accepted: boolean;
  readonly wordingEvaluationDisposition: WordingEvaluationDisposition;
  readonly diagnostics: readonly RuntimeWordingGateDiagnosticCode[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Gate input ────────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeWordingGovernanceGate`.
 *
 * `draftResult`               — the mock adapter result from Phase 8.2G-1.
 * `outputContractValidation`  — the contract validation result from Phase 8.2G-2;
 *                               must have `verdict === "accepted_for_next_gate"` for
 *                               wording evaluation to proceed.
 * `scoreReport`               — the caller-supplied `WordingToneScoreReport`; if
 *                               `null`, the gate returns `rejected_missing_score_report`.
 * `neverUserVisible`          — compile-time invariant.
 * `notes`                     — optional governance notes.
 */
export interface RuntimeWordingGateInput {
  readonly draftResult: RuntimeLLMDraftAdapterResult;
  readonly outputContractValidation: RuntimeLLMOutputContractValidationResult;
  readonly scoreReport: WordingToneScoreReport | null;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Gate result ───────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeWordingGovernanceGate`.
 *
 * `verdict`                        — top-level gate decision.
 * `acceptedForAuditDryRun`         — `true` only when verdict is
 *                                    `accepted_for_audit_dry_run`.
 * `acceptedForUserVisibleAssembly` — always literal `false` in Phase 8.2G-3.
 * `sectionResults`                 — per-section wording gate outcomes.
 * `diagnostics`                    — gate-level diagnostic codes.
 * `wordingEvaluationResult`        — the full wording evaluation result;
 *                                    present only when evaluation ran.
 * `liveLLMJudgeCalled`             — always literal `false`.
 * `realTextSemanticallyEvaluated`  — always literal `false`.
 * `userVisibleOutputAllowed`       — always literal `false`.
 * `neverUserVisible`               — always literal `true`.
 * `notes`                          — optional governance notes.
 */
export interface RuntimeWordingGateResult {
  readonly verdict: RuntimeWordingGateVerdict;
  readonly acceptedForAuditDryRun: boolean;
  readonly acceptedForUserVisibleAssembly: false;
  readonly sectionResults: readonly RuntimeWordingGateSectionResult[];
  readonly diagnostics: readonly RuntimeWordingGateDiagnosticCode[];
  readonly wordingEvaluationResult?: WordingEvaluationResult;
  readonly liveLLMJudgeCalled: false;
  readonly realTextSemanticallyEvaluated: false;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
