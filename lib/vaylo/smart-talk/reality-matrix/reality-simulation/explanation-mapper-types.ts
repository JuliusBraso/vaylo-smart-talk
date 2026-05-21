/**
 * Runtime Explanation Mapper type sketches (Phase 8.2F-1).
 *
 * SPEC ONLY - NOT RUNTIME.
 *
 * These interfaces describe a future mapper boundary only:
 * - no mapper function
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

export interface ExplanationMapperDiagnostic {
  readonly code: string;
  readonly detail?: string;
  readonly neverUserVisible: true;
}

export interface RuntimeExplanationDraft {
  readonly draftVersion: "8.2f-1-runtime-explanation-draft-spec-v1";
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
