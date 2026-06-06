/**
 * Controlled Live Text Adapter types (Phase 8.2H-3).
 *
 * Defines the type model for the controlled adapter that converts a
 * `RealTextRedactionBoundaryAccepted` object into a governance draft candidate
 * eligible for future output contract validation (8.2H-4+).
 *
 * The adapter only wraps already-redacted text into a `ControlledLiveTextAdapterSectionCandidate`.
 * It does not answer, summarise, translate, generate prose, or call any model.
 *
 * Key safety properties:
 * - `acceptedForLLM: false` — literal, locked in this phase.
 * - `acceptedForRuntimePipeline: false` — literal, locked in this phase.
 * - `acceptedForUserVisibleOutput: false` — literal, always.
 * - `adaptedForOutputContractValidation: boolean` — `true` only on success.
 * - `userVisibleOutputEmitted: false` — literal, always.
 * - `neverUserVisible: true` — literal, always.
 * - All section `draftText` values are prefixed with
 *   `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]`.
 * - Raw input text is never used after the redaction boundary.
 */

import type { RealTextRedactionBoundaryAccepted } from "./real-text-redaction-boundary-types";
import type { RealTextInputMode } from "./real-text-input-contract-types";
import type {
  RuntimeLLMDraftSectionType,
  RuntimeLLMDraftSafetyFlag,
} from "../runtime-llm-draft-adapter-types";

export type { RealTextRedactionBoundaryAccepted, RealTextInputMode };
export type { RuntimeLLMDraftSectionType, RuntimeLLMDraftSafetyFlag };

// ── Adapter mode ──────────────────────────────────────────────────────────────

/**
 * The internal adapter mode derived from the validated source input mode.
 *
 * - `guarded_real_text`     — source was `real_text_guarded` (document text).
 * - `guarded_real_question` — source was `real_question_guarded` (a question).
 */
export type ControlledLiveTextAdapterMode =
  | "guarded_real_text"
  | "guarded_real_question";

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The verdict of `runControlledLiveTextAdapter`.
 *
 * - `adapted_for_output_contract_validation` — adapter succeeded; candidates
 *   are ready to be passed into the 8.2H-4 output contract validation layer.
 * - `rejected_redaction_not_accepted`    — `redactionAccepted` is null or
 *   does not carry `acceptedForControlledLiveAdapter: true`.
 * - `rejected_empty_redacted_text`       — redacted text is blank.
 * - `rejected_unmapped_input_mode`       — `sourceInputMode` does not map to
 *   a known `ControlledLiveTextAdapterMode`.
 * - `rejected_adapter_invariant_violation` — post-build invariant check found
 *   a section without the required prefix or `neverUserVisible` flag.
 */
export type ControlledLiveTextAdapterVerdict =
  | "adapted_for_output_contract_validation"
  | "rejected_redaction_not_accepted"
  | "rejected_empty_redacted_text"
  | "rejected_unmapped_input_mode"
  | "rejected_adapter_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type ControlledLiveTextAdapterDiagnosticCode =
  | "controlled_live_text_adapter_started"
  | "controlled_live_text_adapter_redaction_confirmed"
  | "controlled_live_text_adapter_mode_mapped"
  | "controlled_live_text_adapter_draft_created"
  | "controlled_live_text_adapter_adapted_for_output_contract_validation"
  | "controlled_live_text_adapter_rejected_redaction_not_accepted"
  | "controlled_live_text_adapter_rejected_empty_redacted_text"
  | "controlled_live_text_adapter_rejected_unmapped_input_mode"
  | "controlled_live_text_adapter_rejected_invariant_violation"
  | "controlled_live_text_adapter_no_live_llm_confirmed"
  | "controlled_live_text_adapter_no_persistence_confirmed"
  | "controlled_live_text_adapter_no_dna_save_confirmed"
  | "controlled_live_text_adapter_no_offline_save_confirmed"
  | "controlled_live_text_adapter_no_user_visible_output_confirmed";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runControlledLiveTextAdapter`.
 *
 * `redactionAccepted` — must be non-null with `acceptedForControlledLiveAdapter: true`.
 *                       Only `redactedText` is used downstream; raw input is not accessible here.
 * `sourceInputMode`   — the validated input mode from 8.2H-1 contract validation.
 * `adapterRunId`      — opaque run ID for this adapter pass.
 * `neverUserVisible`  — compile-time invariant; must be `true`.
 */
export interface ControlledLiveTextAdapterInput {
  readonly redactionAccepted: RealTextRedactionBoundaryAccepted | null;
  readonly sourceInputMode: RealTextInputMode;
  readonly adapterRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Section candidate ─────────────────────────────────────────────────────────

/**
 * A single governance draft section candidate produced by the adapter.
 *
 * `draftText` is always prefixed with `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]`
 * followed by the redacted text only. No generated prose, no answers, no summaries.
 *
 * `sourceBound: true` — the content is bound to and derived solely from the
 *                       redacted source text, not from any model generation.
 * `neverUserVisible: true` — compile-time invariant.
 */
export interface ControlledLiveTextAdapterSectionCandidate {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly draftText: string;
  readonly sourceBound: true;
  readonly safetyFlags: readonly RuntimeLLMDraftSafetyFlag[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runControlledLiveTextAdapter`.
 *
 * `sectionCandidates` is non-empty only when `verdict === "adapted_for_output_contract_validation"`.
 * `adaptedForOutputContractValidation` is `true` only on success.
 *
 * All downstream gate flags (`acceptedForLLM`, `acceptedForRuntimePipeline`,
 * `acceptedForUserVisibleOutput`) are literal `false` — the adapter only
 * advances the candidate to the output contract validation boundary.
 */
export interface ControlledLiveTextAdapterResult {
  readonly adapterRunId: string;
  readonly verdict: ControlledLiveTextAdapterVerdict;
  readonly adapterMode: ControlledLiveTextAdapterMode | null;
  readonly sectionCandidates: readonly ControlledLiveTextAdapterSectionCandidate[];
  readonly diagnostics: readonly ControlledLiveTextAdapterDiagnosticCode[];

  readonly adaptedForOutputContractValidation: boolean;
  readonly acceptedForLLM: false;
  readonly acceptedForRuntimePipeline: false;
  readonly acceptedForUserVisibleOutput: false;

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly userVisibleOutputEmitted: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}
