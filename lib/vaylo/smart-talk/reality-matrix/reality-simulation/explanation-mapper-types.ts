/**
 * Runtime Explanation Mapper types (Phase 8.2F-1 sketch / 8.2F-2 skeleton /
 * 8.2F-3 free-preview codes / 8.2F-4 paid codes).
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
 * Strongly-typed diagnostic codes for the free preview mapper (Phase 8.2F-3).
 * Used in `ExplanationMapperDiagnostic.code` to identify which free-preview
 * governance suppression was applied.
 */
export type FreePreviewMapperDiagnosticCode =
  | "free_preview_paid_field_blocked"
  | "free_preview_deadline_detail_blocked"
  | "free_preview_enforcement_claim_blocked"
  | "free_preview_action_instruction_blocked"
  | "invalid_access_tier_for_free_preview_mapper";

/**
 * Strongly-typed diagnostic codes for the paid explanation mapper (Phase 8.2F-4).
 * Used in `ExplanationMapperDiagnostic.code` to identify which paid-tier
 * governance suppression was applied.
 */
export type PaidExplanationMapperDiagnosticCode =
  | "paid_deadline_output_blocked"
  | "paid_enforcement_claim_blocked"
  | "paid_legal_verdict_blocked"
  | "paid_autonomous_action_blocked"
  | "paid_cross_lane_merge_blocked"
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
