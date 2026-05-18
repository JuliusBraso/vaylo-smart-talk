/**
 * Boundary Policy Table types (Phase 8.2D-3).
 *
 * Metadata only: no explanation generation, no runtime enforcement, no Smart Talk wiring.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";

/** Historical boundary ids removed from the live ExplanationBoundary union. */
export type DeprecatedBoundaryId = "recommend_human_review_for_high_risk";

/** Canonical live boundary ids plus historical ids retained only for governance metadata. */
export type BoundaryPolicyId = ExplanationBoundary | DeprecatedBoundaryId;

export type BoundaryCategory =
  | "prohibition"
  | "required_wording_constraint"
  | "conditional_advisory"
  | "escalation_recommendation"
  | "escalation_safety"
  | "uncertainty_preservation"
  | "lane_safety"
  | "simulation_safety";

export type BoundaryProductionReadiness =
  | "dry_run_only"
  | "governance_foundation"
  | "candidate_for_production"
  | "not_safe_for_production";

export type BoundaryConsumerConstraint =
  | "never_render_directly"
  | "not_legal_advice"
  | "not_deadline_authority"
  | "requires_uncertainty_layer"
  | "requires_human_review_context"
  | "dry_run_not_truth";

export type BoundaryConsumerLayer =
  | "reality_simulation"
  | "explanation_governance"
  | "human_review_routing"
  | "audit_only";

export interface BoundaryPolicyDefinition {
  readonly boundaryId: BoundaryPolicyId;
  readonly category: BoundaryCategory;
  /** Governance purpose only; not user-facing copy. */
  readonly description: string;
  readonly productionReadiness: BoundaryProductionReadiness;
  readonly consumerConstraints: readonly BoundaryConsumerConstraint[];
  readonly deprecated: boolean;
  /** Required when deprecated=true; must point at a live canonical boundary id. */
  readonly replacementBoundaryId?: ExplanationBoundary;
  readonly notes?: readonly string[];
  readonly introducedInPhase: string;
  readonly intendedConsumerLayer?: BoundaryConsumerLayer;
}
