/**
 * Reality Simulation — types (Phase 8.2D-0 spec + **8.2D-1 skeleton runtime**).
 *
 * `RealitySimulationResult` and related shapes are **governance-only**: not user-visible copy,
 * not Smart Talk output, not production legal truth.
 *
 * Canonical prose: `REALITY_SIMULATION_SPEC.md`
 */

import type { EvidenceGateDecision } from "./evidence-gates-types";
import type { ClaimType, ProceduralSeverityBand, RealityType } from "./types";

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

/**
 * Extended input (optional) — v1 skeleton uses {@link RunRealitySimulationParams} only.
 * Structured gate output + matrix identity + quality hints only; no raw `documentText`.
 */
export interface RealitySimulationInput {
  readonly gateDecision: EvidenceGateDecision;
  readonly matrixDocumentType: string;
  readonly matrixSchemaVersion: string;
  readonly documentQualityHints?: Readonly<Record<string, string | number | boolean>>;
}

/** 8.2D-1 pure simulation entry — `EvidenceGateDecision` bundle only. */
export interface RunRealitySimulationParams {
  readonly evidenceGateDecision: EvidenceGateDecision;
}

// ---------------------------------------------------------------------------
// Reality / claim candidates (not production truth)
// ---------------------------------------------------------------------------

export type SimulationRealityDisposition = "supported_candidate" | "blocked" | "uncertain";

export interface SimulationRealityCandidate {
  readonly realityType: RealityType;
  readonly disposition: SimulationRealityDisposition;
  readonly reasonCode: string;
  readonly notes?: string;
}

export type SimulationClaimDisposition = "considered_candidate" | "blocked_candidate" | "hidden_candidate";

export interface SimulationClaimCandidate {
  readonly claimType: ClaimType;
  readonly disposition: SimulationClaimDisposition;
  readonly reasonCode: string;
  readonly notes?: string;
}

// ---------------------------------------------------------------------------
// Boundaries, uncertainty, review (governance — not prose)
// ---------------------------------------------------------------------------

/**
 * Machine tokens for downstream explanation governance — see REALITY_SIMULATION_SPEC.md §7
 * and BOUNDARY_VOCABULARY_AUDIT.md (8.2D-2A/2B) for canonical category model and consumer safety policy.
 *
 * Token status notes (8.2D-2B — post consolidation):
 * - Tokens emitted unconditionally by the skeleton:
 *   `do_not_calculate_deadline`, `do_not_merge_payment_and_appeal`,
 *   `do_not_present_dry_run_as_fact`, `do_not_present_speculation_as_fact`
 * - Tokens emitted conditionally (trap / speculative / mismatch signals):
 *   `do_not_claim_enforcement`, `do_not_merge_lanes`,
 *   `require_uncertainty_wording`, `recommend_human_review_high_risk`
 * - Tokens defined but NOT YET EMITTED by skeleton v1 (wiring pending):
 *   `do_not_claim_finality`, `use_relative_deadline_wording_only`, `mention_uncertainty_if_ocr_noisy`
 * - Removed in 8.2D-2B: `recommend_human_review_for_high_risk` (was a never-emitted alias; canonical
 *   form is `recommend_human_review_high_risk`; no production consumers existed).
 */
export type ExplanationBoundary =
  | "do_not_calculate_deadline"
  | "do_not_claim_enforcement"
  /** Not yet emitted by skeleton v1 — wiring to finality-related gate signals pending (8.2D-2A). */
  | "do_not_claim_finality"
  | "do_not_merge_payment_and_appeal"
  | "do_not_merge_lanes"
  | "do_not_present_dry_run_as_fact"
  | "do_not_present_speculation_as_fact"
  | "require_uncertainty_wording"
  /** Not yet emitted by skeleton v1 — wiring to deadline reality candidates pending (8.2D-2A). */
  | "use_relative_deadline_wording_only"
  /** Not yet emitted by skeleton v1 — requires OCR quality input wiring (8.2D-2A). */
  | "mention_uncertainty_if_ocr_noisy"
  /** Canonical human-review escalation boundary (8.2D-2B). */
  | "recommend_human_review_high_risk";

/**
 * Runtime-enumerable registry of every live `ExplanationBoundary` token (8.2D-4A).
 *
 * The TypeScript `ExplanationBoundary` union cannot be iterated at runtime; this constant fills
 * that gap for policy-drift detection, regression scaffolds, and future test runners.
 *
 * INVARIANT: must include exactly the same members as `ExplanationBoundary` — no more, no fewer.
 * The `satisfies readonly ExplanationBoundary[]` constraint enforces that all entries are valid
 * live tokens at compile time, preventing deprecated aliases from being re-introduced here.
 *
 * DO NOT add `"recommend_human_review_for_high_risk"` — that alias was removed in 8.2D-2B and
 * exists only as historical policy metadata in `BOUNDARY_POLICY_TABLE_V1`.
 */
export const KNOWN_EXPLANATION_BOUNDARIES = [
  "do_not_calculate_deadline",
  "do_not_claim_enforcement",
  "do_not_claim_finality",
  "do_not_merge_payment_and_appeal",
  "do_not_merge_lanes",
  "do_not_present_dry_run_as_fact",
  "do_not_present_speculation_as_fact",
  "require_uncertainty_wording",
  "use_relative_deadline_wording_only",
  "mention_uncertainty_if_ocr_noisy",
  "recommend_human_review_high_risk",
] as const satisfies readonly ExplanationBoundary[];

export interface SimulationUncertaintyReason {
  readonly code: string;
  readonly detail?: string;
}

/** Governance identifiers only — no user-facing wording. */
export type SimulationGovernanceFlagId =
  | "human_review_recommended"
  | "professional_advice_recommended"
  | "authority_contact_recommended"
  | "high_consequence_domain"
  | "escalation_ambiguity"
  | "matrix_mismatch_detected"
  | "speculative_support_present"
  | "contradictory_world_state";

export interface SimulationReviewFlag {
  readonly flagId: SimulationGovernanceFlagId;
  readonly reasonCode: string;
  readonly notes?: string;
}

// ---------------------------------------------------------------------------
// Trap / stabilizer / severity (influence only — no wording / no UI urgency)
// ---------------------------------------------------------------------------

export interface TrapWarning {
  readonly trapId: string;
  readonly influence: "boundary_candidate" | "uncertainty" | "stabilizer_need" | "review_flag";
  readonly reasonCode: string;
}

export interface StabilizerNeed {
  readonly stabilizerRuleId: string;
  readonly category: string;
  readonly linkedTrapIds?: readonly string[];
  readonly linkedRealityTypes?: readonly RealityType[];
  readonly linkedClaimTypes?: readonly ClaimType[];
  readonly reasonCode: string;
}

/**
 * Procedural posture only — not UI urgency, not Smart Talk priority.
 * Sourced from dry-run severity derivations when mapped in a future phase.
 */
export interface SeverityPostureCandidate {
  readonly band: ProceduralSeverityBand;
  readonly source: "dry_run_severity_derivation";
  readonly neverUserVisible: true;
  readonly reviewNeeded?: boolean;
  readonly reasonCode?: string;
}

// ---------------------------------------------------------------------------
// Aggregate result (still not user-visible text)
// ---------------------------------------------------------------------------

/**
 * Output of Reality Simulation — governance product for a later explanation layer.
 * Not end-user copy.
 */
export interface RealitySimulationResult {
  readonly supportedRealityCandidates?: readonly SimulationRealityCandidate[];
  readonly blockedRealities?: readonly SimulationRealityCandidate[];
  readonly uncertainRealities?: readonly SimulationRealityCandidate[];
  readonly consideredClaimCandidates?: readonly SimulationClaimCandidate[];
  readonly blockedClaimCandidates?: readonly SimulationClaimCandidate[];
  readonly uncertaintyReasons?: readonly SimulationUncertaintyReason[];
  readonly trapWarnings?: readonly TrapWarning[];
  readonly stabilizerNeeds?: readonly StabilizerNeed[];
  readonly severityPostureCandidate?: SeverityPostureCandidate;
  readonly explanationBoundaries?: readonly ExplanationBoundary[];
  readonly forbiddenExplanationMoves?: readonly string[];
  readonly reviewFlags?: readonly SimulationReviewFlag[];
  readonly auditTraceRef?: string;
}
