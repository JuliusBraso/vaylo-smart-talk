/**
 * Runtime Response Assembler Bridge types (Phase 8.2G-6).
 *
 * Defines the type model for the Response Assembler Bridge — the first gate
 * in the pipeline that creates an internal structured response assembly
 * candidate from a fully validated 8.2G pipeline.
 *
 * Position in the 15-layer runtime pipeline (Phase 8.2G-0):
 *   llm_draft_adapter (8.2G-1)
 *   → llm_output_contract_validator (8.2G-2)
 *   → wording_evaluation_gate (8.2G-3)
 *   → audit_trace_emission (8.2G-4)
 *   → response_assembler_bridge (8.2G-6) [THIS LAYER]
 *   → ... (future user-visible assembly, Phase 8.2G-7+)
 *
 * What this phase does:
 *  - Consumes an already-validated draft path (output contract + wording gate +
 *    audit trace validity + diagnostic envelope validity).
 *  - Strips known internal draft prefixes ([MOCK_DRAFT_NEVER_USER_VISIBLE] and
 *    [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]) from section text.
 *  - Detects internal metadata leaks and rejects any candidate that contains them.
 *  - Emits a structured `RuntimeResponseAssemblerBridgeResult` with section
 *    candidates whose `textCandidate` fields are prefix-stripped.
 *  - Sets `eligibleForFutureUserVisibleAssembly: true` only when ALL gates pass
 *    and no metadata leaks are detected.
 *
 * What this phase does NOT do:
 *  - Does NOT produce user-visible output.
 *  - Does NOT connect to any UI or API route.
 *  - Does NOT call any LLM.
 *  - Does NOT persist anything.
 *  - Does NOT save to DNA, database, or cloud.
 *  - Does NOT generate new prose.
 *  - Does NOT perform semantic or legal analysis.
 *
 * Safety guarantees:
 * - userVisibleOutputEmitted is always literal false
 * - userVisibleOutputAllowed is always literal false
 * - persistenceUsed is always literal false
 * - dnaSavePerformed is always literal false
 * - offlineSavePerformed is always literal false
 * - neverUserVisible is always true
 * - no LLM SDK imported
 * - no API keys or environment variables
 * - no external calls
 * - no side effects
 */

import type { RuntimeLLMDraftSectionType } from "./runtime-llm-draft-adapter-types";
import type {
  RuntimeLLMOutputContractDraftResult,
  RuntimeLLMOutputContractValidationResult,
} from "./runtime-llm-output-contract-validator-types";
import type { RuntimeWordingGateResult } from "./runtime-wording-governance-gate-types";

// Re-export for convenience
export type {
  RuntimeLLMOutputContractDraftResult,
  RuntimeLLMOutputContractValidationResult,
  RuntimeWordingGateResult,
};

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict from `runRuntimeResponseAssemblerBridge`.
 *
 * - `assembled_internal_candidate`       — all upstream gates passed; internal
 *                                          section candidates assembled successfully.
 *                                          `eligibleForFutureUserVisibleAssembly: true`.
 * - `assembled_human_review_packet`      — wording gate returned `human_review_required`;
 *                                          a restricted human-review packet was assembled
 *                                          with only review/uncertainty sections.
 *                                          `eligibleForFutureUserVisibleAssembly: false`.
 * - `rejected_output_contract_not_accepted`— upstream output contract validator did not
 *                                          return `accepted_for_next_gate`.
 * - `rejected_wording_gate_not_accepted` — wording gate verdict is not `accepted_for_audit_dry_run`
 *                                          (and not `human_review_required`).
 * - `rejected_audit_trace_invalid`       — `input.auditTraceValid !== true`.
 * - `rejected_diagnostic_envelope_invalid`— `input.diagnosticEnvelopeValid !== true`.
 * - `rejected_internal_metadata_leak`    — one or more section candidates contain
 *                                          internal metadata after prefix stripping.
 * - `rejected_missing_sections`          — no section candidates could be assembled.
 * - `rejected_unsupported_source`        — the draft source kind is not recognized.
 */
export type RuntimeResponseAssemblerBridgeVerdict =
  | "assembled_internal_candidate"
  | "assembled_human_review_packet"
  | "rejected_output_contract_not_accepted"
  | "rejected_wording_gate_not_accepted"
  | "rejected_audit_trace_invalid"
  | "rejected_diagnostic_envelope_invalid"
  | "rejected_internal_metadata_leak"
  | "rejected_missing_sections"
  | "rejected_unsupported_source";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the response assembler bridge.
 *
 * Process markers:
 * - `response_assembler_started`                    — bridge invoked.
 * - `response_assembler_output_contract_confirmed`  — output contract accepted upstream.
 * - `response_assembler_wording_gate_confirmed`     — wording gate accepted upstream.
 * - `response_assembler_audit_trace_confirmed`      — audit trace valid.
 * - `response_assembler_diagnostic_envelope_confirmed`— diagnostic envelopes valid.
 * - `response_assembler_internal_candidate_created` — successful normal assembly.
 * - `response_assembler_human_review_packet_created`— human-review packet assembled.
 *
 * Rejection markers:
 * - `response_assembler_output_contract_rejected`   — output contract not accepted.
 * - `response_assembler_wording_gate_rejected`      — wording gate not accepted.
 * - `response_assembler_audit_trace_invalid`        — audit trace not valid.
 * - `response_assembler_diagnostic_envelope_invalid`— diagnostic envelopes not valid.
 * - `response_assembler_internal_metadata_leak_detected`— metadata leak found.
 * - `response_assembler_missing_sections`           — no candidates to assemble.
 *
 * Invariant markers:
 * - `response_assembler_internal_prefix_stripped`   — at least one internal prefix removed.
 * - `response_assembler_user_visible_emission_forbidden`— invariant: no user-visible output.
 * - `response_assembler_no_persistence_confirmed`   — invariant: no persistence.
 * - `response_assembler_no_dna_save_confirmed`      — invariant: no DNA save.
 * - `response_assembler_no_offline_save_confirmed`  — invariant: no offline save.
 */
export type RuntimeResponseAssemblerBridgeDiagnosticCode =
  | "response_assembler_started"
  | "response_assembler_output_contract_confirmed"
  | "response_assembler_wording_gate_confirmed"
  | "response_assembler_audit_trace_confirmed"
  | "response_assembler_diagnostic_envelope_confirmed"
  | "response_assembler_internal_candidate_created"
  | "response_assembler_human_review_packet_created"
  | "response_assembler_output_contract_rejected"
  | "response_assembler_wording_gate_rejected"
  | "response_assembler_audit_trace_invalid"
  | "response_assembler_diagnostic_envelope_invalid"
  | "response_assembler_internal_metadata_leak_detected"
  | "response_assembler_internal_prefix_stripped"
  | "response_assembler_missing_sections"
  | "response_assembler_user_visible_emission_forbidden"
  | "response_assembler_no_persistence_confirmed"
  | "response_assembler_no_dna_save_confirmed"
  | "response_assembler_no_offline_save_confirmed";

// ── Section kind ──────────────────────────────────────────────────────────────

/**
 * The kind of an assembled response section candidate.
 * Maps 1:1 to `RuntimeLLMDraftSectionType` from Phase 8.2G-1.
 */
export type RuntimeResponseAssemblerSectionKind =
  | "document_type_signal"
  | "what_this_means"
  | "attention_points"
  | "next_steps_safe"
  | "uncertainty_notice"
  | "review_recommendation"
  | "blocked_content_notice";

// ── Section candidate ─────────────────────────────────────────────────────────

/**
 * A single assembled internal section candidate.
 *
 * This is never user-visible. `textCandidate` has had the internal draft prefix
 * stripped (if present), but the resulting text is still governed as internal.
 * Only a future Phase 8.2G-7+ user-visible assembly gate may authorise display.
 *
 * `sectionKind`             — the section kind matching the source section type.
 * `textCandidate`           — the draft text with known internal prefixes removed.
 *                             Still internal — never display to users in this phase.
 * `sourceSectionType`       — the original `RuntimeLLMDraftSectionType` from the draft.
 * `derivedFromDraftId`      — the draft/run ID that produced this section.
 * `internalDraftPrefixRemoved`— true if a known internal prefix was stripped.
 * `containsInternalMetadata`— true if internal governance metadata detected in text.
 *                             Such sections cause a rejected_internal_metadata_leak verdict.
 * `neverUserVisible`        — compile-time invariant.
 * `notes`                   — optional governance notes.
 */
export interface RuntimeResponseAssemblerSectionCandidate {
  readonly sectionKind: RuntimeResponseAssemblerSectionKind;
  readonly textCandidate: string;
  readonly sourceSectionType: RuntimeLLMDraftSectionType;
  readonly derivedFromDraftId: string;
  readonly internalDraftPrefixRemoved: boolean;
  readonly containsInternalMetadata: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Bridge input ──────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeResponseAssemblerBridge`.
 *
 * All upstream gate results must be passed in; the bridge does not re-run
 * any gate, only inspects their verdicts and consumes the draft candidates.
 *
 * `draftResult`             — the validated draft result (mock or live sandbox).
 * `outputContractValidation`— the result of `validateRuntimeLLMOutputContract`.
 * `wordingGateResult`       — the result of `runRuntimeWordingGovernanceGate`.
 * `auditTraceValid`         — whether audit trace is valid (from Phase 8.2G-4).
 * `diagnosticEnvelopeValid` — whether diagnostic envelopes are valid (from Phase 8.2G-4).
 * `assemblyRunId`           — opaque ID for this assembly run (for correlation).
 * `neverUserVisible`        — compile-time invariant.
 * `notes`                   — optional governance notes.
 */
export interface RuntimeResponseAssemblerBridgeInput {
  readonly draftResult: RuntimeLLMOutputContractDraftResult;
  readonly outputContractValidation: RuntimeLLMOutputContractValidationResult;
  readonly wordingGateResult: RuntimeWordingGateResult;
  readonly auditTraceValid: boolean;
  readonly diagnosticEnvelopeValid: boolean;
  readonly assemblyRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Bridge result ─────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeResponseAssemblerBridge`.
 *
 * `assemblyRunId`                     — echoes the assembly run ID from input.
 * `verdict`                           — top-level bridge decision.
 * `eligibleForFutureUserVisibleAssembly`— `true` only when verdict is
 *                                        `assembled_internal_candidate` and all
 *                                        guards pass. Only a future Phase 8.2G-7+
 *                                        gate may authorise actual display.
 * `userVisibleOutputEmitted`          — always literal `false`.
 * `userVisibleOutputAllowed`          — always literal `false`.
 * `persistenceUsed`                   — always literal `false`.
 * `dnaSavePerformed`                  — always literal `false`.
 * `offlineSavePerformed`              — always literal `false`.
 * `sectionCandidates`                 — internal assembled section candidates.
 * `diagnostics`                       — bridge-level diagnostic codes.
 * `upstreamDraftId`                   — the draft/run ID from the upstream result.
 * `liveLLMCalled`                     — mirrors the upstream output contract validation.
 * `neverUserVisible`                  — always literal `true`.
 * `notes`                             — optional governance notes.
 */
export interface RuntimeResponseAssemblerBridgeResult {
  readonly assemblyRunId: string;
  readonly verdict: RuntimeResponseAssemblerBridgeVerdict;
  readonly eligibleForFutureUserVisibleAssembly: boolean;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly sectionCandidates: readonly RuntimeResponseAssemblerSectionCandidate[];
  readonly diagnostics: readonly RuntimeResponseAssemblerBridgeDiagnosticCode[];
  readonly upstreamDraftId: string;
  readonly liveLLMCalled: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
