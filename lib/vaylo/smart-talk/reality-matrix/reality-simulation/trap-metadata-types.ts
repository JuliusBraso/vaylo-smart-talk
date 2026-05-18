/**
 * Structured trap metadata types (Phase 8.2D-5).
 *
 * Metadata only — no explanation generation, no runtime enforcement, no Smart Talk wiring.
 * Provides the type foundation that will eventually replace the coarse `enforcementTrapHeuristic`
 * substring checks in `run-reality-simulation.ts`.
 *
 * See TRAP_METADATA_FOUNDATION.md for the replacement strategy.
 */

import type { HallucinationTrapKind } from "../types";

// ---------------------------------------------------------------------------
// Governance domain taxonomy
// ---------------------------------------------------------------------------

/**
 * Governance domain to which a trap primarily belongs.
 * A single trap may span multiple domains.
 */
export type TrapGovernanceDomain =
  | "enforcement"
  | "deadline"
  | "payment"
  | "appeal"
  | "immigration"
  | "benefits"
  | "insurance"
  | "tax"
  | "health"
  | "housing"
  | "generic_escalation"
  | "style_or_tone"
  | "cross_lane";

// ---------------------------------------------------------------------------
// Risk classification
// ---------------------------------------------------------------------------

/**
 * The primary governance risk introduced if this trap is not respected.
 * A single trap may carry multiple risk classes.
 */
export type TrapRiskClass =
  | "over_escalation"
  | "false_reassurance"
  | "deadline_fabrication"
  | "lane_contamination"
  | "authority_confusion"
  | "legal_conclusion"
  | "speculative_inference"
  | "panic_amplification";

// ---------------------------------------------------------------------------
// Production readiness
// ---------------------------------------------------------------------------

export type TrapProductionReadiness =
  | "dry_run_only"
  | "metadata_foundation"
  | "candidate_for_policy"
  | "not_safe_for_production";

// ---------------------------------------------------------------------------
// Consumer constraints
// ---------------------------------------------------------------------------

/**
 * Obligations placed on any consumer of trap metadata.
 * These are governance contracts — not runtime enforcement.
 */
export type TrapConsumerConstraint =
  /** Never display trapKind or trap metadata strings directly to users. */
  | "never_render_directly"
  /** Trap metadata does not constitute legal advice. */
  | "not_legal_advice"
  /** Trap signals must not suppress or rewrite runtime output without explicit policy phase. */
  | "not_runtime_suppression"
  /** Dry-run trap activations are not ground truth. */
  | "dry_run_not_truth"
  /**
   * Do not use this trap's metadata to drive explanation boundaries until it has been promoted
   * through an explicit structured policy phase (e.g. 8.2D-5A+).
   */
  | "requires_structured_policy_before_runtime"
  /** Trap escalation signals require a human-review context before surfacing to end users. */
  | "requires_human_review_context";

// ---------------------------------------------------------------------------
// Core metadata definition
// ---------------------------------------------------------------------------

/**
 * Structured governance metadata for a single `HallucinationTrapKind`.
 *
 * Fields are machine-readable governance annotations — not user-facing copy.
 * This definition intentionally mirrors the `BoundaryPolicyDefinition` pattern
 * from `boundary-policy-types.ts` for structural consistency.
 */
export interface TrapMetadataDefinition {
  /** Must be a registered `HallucinationTrapKind`. */
  readonly trapKind: HallucinationTrapKind;
  /** Governance domains this trap belongs to. At least one required. */
  readonly domains: readonly TrapGovernanceDomain[];
  /** Risk classes this trap introduces if not respected. At least one required. */
  readonly riskClasses: readonly TrapRiskClass[];

  // ---------------------------------------------------------------------------
  // Explicit boolean governance flags — these replace substring heuristics
  // ---------------------------------------------------------------------------

  /**
   * True if this trap is related to legal enforcement action (e.g. Vollstreckung,
   * salary garnishment, account seizure, eviction proceedings).
   * Replaces `trapKind.includes("enforcement" | "vollstreckung" | ...)` heuristics.
   */
  readonly isEnforcementRelated: boolean;
  /**
   * True if this trap represents or triggers an escalation in legal or financial risk
   * (e.g. threat inference, panic amplification, legal consequence exaggeration).
   */
  readonly isEscalationRelated: boolean;
  /**
   * True if this trap introduces fabricated or synthesized deadline inferences.
   */
  readonly isDeadlineRelated: boolean;
  /**
   * True if this trap involves cross-lane contamination (e.g. mixing tax / benefits /
   * housing / payment lanes in a single document context).
   */
  readonly isLaneContaminationRelated: boolean;

  // ---------------------------------------------------------------------------
  // Readiness and constraints
  // ---------------------------------------------------------------------------

  readonly productionReadiness: TrapProductionReadiness;
  readonly consumerConstraints: readonly TrapConsumerConstraint[];

  // ---------------------------------------------------------------------------
  // Documentation metadata
  // ---------------------------------------------------------------------------

  readonly notes?: readonly string[];
  /** Phase in which this metadata entry was introduced. */
  readonly introducedInPhase: string;
  /**
   * Describes how this metadata should be used in a future structured policy phase
   * to replace the corresponding substring heuristic or coarse trigger.
   */
  readonly futurePolicyUse?: string;
}
