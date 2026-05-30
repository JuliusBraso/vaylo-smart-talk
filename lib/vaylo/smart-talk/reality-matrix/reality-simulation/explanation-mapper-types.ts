/**
 * Runtime Explanation Mapper types (Phase 8.2F-1 sketch / 8.2F-2 skeleton /
 * 8.2F-3 free-preview codes / 8.2F-4 paid codes /
 * 8.2F-6 Smart Talk Bridge Dry Run input+output types /
 * 8.2F-6A bridge_contract_tier_mismatch diagnostic code /
 * 8.2F-15C mapper diagnostic taxonomy hardening).
 *
 * Safety guarantees (all phases):
 * - no mapper function in this file
 * - no explanation builder
 * - no Smart Talk wiring
 * - no OCR access
 * - no LLM calls
 * - no deadline calculation
 * - no user-visible text generation
 */

import type { RealitySimulationResult } from "../reality-simulation-types";
import type {
  ExplanationAccessTier,
  ForbiddenExplanationMove,
  FreePreviewFields,
  PaidExplanationFields,
  RequiredExplanationConstraint,
  SimulationExplanationContract,
  UncertaintyRequirement,
} from "./explanation-contract-types";
import type { ExplanationBoundary } from "../reality-simulation-types";

export type RuntimeExplanationSectionType =
  | "document_overview"
  | "what_this_means"
  | "attention_points"
  | "next_steps_safe"
  | "uncertainty_and_limits"
  | "review_recommendation"
  | "payment_preview_limited"
  | "paid_deep_explanation";

export type ExplanationUncertaintyPosture =
  | "unknown"
  | "limited"
  | "uncertainty_preserved"
  | "high_consequence_uncertainty";

export type ExplanationReviewPosture =
  | "none"
  | "review_suggested"
  | "human_review_recommended"
  | "professional_review_recommended";

export interface RuntimeExplanationMapperInput {
  readonly simulationResult: RealitySimulationResult;
  readonly explanationContract: SimulationExplanationContract;
  readonly accessTier: ExplanationAccessTier;
  readonly auditTraceRef?: string;
  /** Caller-supplied version tag for audit; does not affect output logic. */
  readonly mapperVersion?: string;
}

export interface AppliedGovernanceConstraint {
  readonly constraintKind: "boundary" | "forbidden_move" | "required_constraint" | "uncertainty_requirement";
  readonly id:
    | ExplanationBoundary
    | ForbiddenExplanationMove
    | RequiredExplanationConstraint
    | UncertaintyRequirement;
  readonly applied: boolean;
  readonly note?: string;
}

export interface RuntimeExplanationSectionDraft {
  readonly sectionType: RuntimeExplanationSectionType;
  readonly accessTier: ExplanationAccessTier;
  readonly sourceBound: true;
  readonly uncertaintyPreserved: boolean;
  readonly allowedContractFields: readonly (keyof FreePreviewFields | keyof PaidExplanationFields)[];
  readonly blockedReasonCodes?: readonly string[];
  readonly neverContainsUserVisibleCopy: true;
}

/**
 * Strongly-typed diagnostic codes for the free preview mapper (Phase 8.2F-3 /
 * 8.2F-15C taxonomy hardening).
 *
 * Each `ForbiddenExplanationMove` active in a free-preview contract now emits a
 * dedicated code rather than collapsing everything into `free_preview_paid_field_blocked`.
 *
 * `free_preview_paid_field_blocked` is retained as the **always-emitted structural
 * invariant** that records paid sections are absent in this tier — it no longer
 * doubles as a per-move diagnostic.
 */
export type FreePreviewMapperDiagnosticCode =
  // ── Invariant (always emitted) ───────────────────────────────────────────
  | "free_preview_paid_field_blocked"           // paid sections structurally absent
  // ── Move-specific codes (8.2F-3, retained) ──────────────────────────────
  | "free_preview_deadline_detail_blocked"      // no_deadline_calculation_when_forbidden
  | "free_preview_enforcement_claim_blocked"    // no_enforcement_claim_when_forbidden
  | "free_preview_action_instruction_blocked"   // no_autonomous_form_submission
  // ── Move-specific codes (8.2F-15C: replaces free_preview_paid_field_blocked per-move) ──
  | "free_preview_legal_verdict_blocked"        // no_definitive_legal_verdicts
  | "free_preview_guaranteed_outcome_blocked"   // no_guaranteed_outcomes
  | "free_preview_truthfulness_blocked"         // no_dry_run_as_fact | no_speculation_as_fact
  | "free_preview_cross_lane_blocked"           // no_cross_lane_merging
  | "free_preview_tax_certainty_blocked"        // no_tax_certainty
  | "free_preview_immigration_certainty_blocked"// no_immigration_certainty
  | "free_preview_panic_phrasing_blocked"       // no_high_panic_phrasing
  | "free_preview_false_reassurance_blocked"    // no_false_reassurance_framing (8.2F-15A/15C)
  | "free_preview_calculated_amount_blocked"    // no_calculated_amount_extraction (8.2F-15A/15C)
  // ── Tier error ────────────────────────────────────────────────────────────
  | "invalid_access_tier_for_free_preview_mapper";

/**
 * Strongly-typed diagnostic codes for the paid explanation mapper (Phase 8.2F-4 /
 * 8.2F-15C taxonomy hardening).
 *
 * Each `ForbiddenExplanationMove` active in a paid contract now emits a dedicated
 * code rather than collapsing truthfulness/certainty risks into `paid_legal_verdict_blocked`.
 *
 * `paid_legal_verdict_blocked` is narrowed to `no_definitive_legal_verdicts` only.
 * `paid_autonomous_action_blocked` is narrowed to `no_autonomous_form_submission` only.
 * `paid_section_excluded_by_forbidden_move` is the new generic section-exclusion code.
 */
export type PaidExplanationMapperDiagnosticCode =
  // ── Move-specific codes (8.2F-4, retained with narrowed semantics) ────────
  | "paid_deadline_output_blocked"              // no_deadline_calculation_when_forbidden
  | "paid_enforcement_claim_blocked"            // no_enforcement_claim_when_forbidden
  | "paid_legal_verdict_blocked"                // no_definitive_legal_verdicts only (narrowed 8.2F-15C)
  | "paid_autonomous_action_blocked"            // no_autonomous_form_submission only (narrowed 8.2F-15C)
  | "paid_cross_lane_merge_blocked"             // no_cross_lane_merging
  // ── Move-specific codes (8.2F-15C: replaces paid_legal_verdict_blocked overload) ──
  | "paid_guaranteed_outcome_blocked"           // no_guaranteed_outcomes
  | "paid_tax_certainty_blocked"                // no_tax_certainty
  | "paid_immigration_certainty_blocked"        // no_immigration_certainty
  | "paid_truthfulness_blocked"                 // no_dry_run_as_fact | no_speculation_as_fact
  | "paid_panic_phrasing_blocked"              // no_high_panic_phrasing
  | "paid_false_reassurance_blocked"            // no_false_reassurance_framing (8.2F-15A/15C)
  | "paid_calculated_amount_blocked"            // no_calculated_amount_extraction (8.2F-15A/15C)
  // ── Generic section-exclusion (8.2F-15C: replaces paid_autonomous_action_blocked overload) ──
  | "paid_section_excluded_by_forbidden_move"   // generic section exclusion notification
  // ── Tier error ────────────────────────────────────────────────────────────
  | "invalid_access_tier_for_paid_explanation_mapper";

export interface ExplanationMapperDiagnostic {
  readonly code: string;
  readonly detail?: string;
  readonly neverUserVisible: true;
}

export interface RuntimeExplanationDraft {
  readonly draftVersion: "8.2f-2-runtime-explanation-draft-v1";
  readonly accessTier: ExplanationAccessTier;
  readonly sectionDrafts: readonly RuntimeExplanationSectionDraft[];
  readonly appliedBoundaries: readonly ExplanationBoundary[];
  readonly appliedForbiddenMoves: readonly ForbiddenExplanationMove[];
  readonly appliedRequiredConstraints: readonly RequiredExplanationConstraint[];
  readonly uncertaintyPosture: ExplanationUncertaintyPosture;
  readonly reviewPosture: ExplanationReviewPosture;
  readonly auditRefs: readonly string[];
  readonly neverUserVisibleDiagnostics: readonly ExplanationMapperDiagnostic[];
}

// ── Phase 8.2F-6 — Smart Talk Bridge Dry Run types ────────────────────────────

/**
 * Typed diagnostic codes emitted exclusively by the Smart Talk Bridge Dry Run
 * layer (Phase 8.2F-6 / 8.2F-6A). Never user-visible.
 */
export type BridgeDiagnosticCode =
  | "bridge_governance_preservation_failure"
  | "bridge_invalid_section_invariant"
  | "bridge_free_preview_leakage"
  | "bridge_invalid_access_tier"
  | "bridge_missing_governance_metadata"
  /** Phase 8.2F-6A: input.accessTier differs from explanationContract.accessTier. */
  | "bridge_contract_tier_mismatch";

/**
 * A never-user-visible diagnostic emitted by the bridge layer to flag
 * governance or structural violations discovered after mapper execution.
 */
export interface BridgeDiagnostic {
  readonly code: BridgeDiagnosticCode;
  readonly detail: string;
  readonly neverUserVisible: true;
}

/**
 * Input to the Smart Talk Bridge Dry Run (Phase 8.2F-6).
 *
 * Carries:
 * - the bridge invocation version tag (audit only)
 * - the access tier that determines mapper routing
 * - the simulation result and explanation contract from the pipeline
 * - optional dry-run context label (e.g. "internal_regression")
 * - optional external audit trace reference
 *
 * No prose. No LLM. No OCR. No Smart Talk runtime.
 */
export interface SmartTalkBridgeDryRunInput {
  readonly bridgeVersion: string;
  readonly accessTier: ExplanationAccessTier;
  readonly simulationResult: RealitySimulationResult;
  readonly explanationContract: SimulationExplanationContract;
  readonly dryRunContext?: string;
  readonly auditTraceRef?: string;
}

/**
 * Output of the Smart Talk Bridge Dry Run (Phase 8.2F-6).
 *
 * Contains the routed `RuntimeExplanationDraft`, bridge-level structural
 * validity and governance preservation flags, bridge diagnostics, and notes.
 *
 * `neverUserVisible: true` guarantees this entire result is internal only —
 * no prose, no rendered explanation, no legal wording.
 */
export interface SmartTalkBridgeDryRunResult {
  readonly bridgeVersion: string;
  readonly mapperKind: "free_preview" | "paid_explanation";
  readonly draft: RuntimeExplanationDraft;
  readonly structurallyValid: boolean;
  readonly governancePreserved: boolean;
  readonly diagnostics: readonly BridgeDiagnostic[];
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}
