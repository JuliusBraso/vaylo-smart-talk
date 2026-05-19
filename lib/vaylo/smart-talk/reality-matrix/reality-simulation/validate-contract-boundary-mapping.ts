/**
 * Contract boundary mapping validator (Phase 8.2D-6A).
 *
 * Pure regression/validation helper only:
 * - no explanation generation
 * - no Smart Talk wiring
 * - no payment logic
 * - no contract builder
 * - no runtime simulation integration
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  ForbiddenExplanationMove,
  RequiredExplanationConstraint,
} from "./explanation-contract-types";

const KNOWN_FORBIDDEN_EXPLANATION_MOVES = [
  "no_definitive_legal_verdicts",
  "no_deadline_calculation_when_forbidden",
  "no_enforcement_claim_when_forbidden",
  "no_high_panic_phrasing",
  "no_dry_run_as_fact",
  "no_speculation_as_fact",
  "no_cross_lane_merging",
  "no_tax_certainty",
  "no_immigration_certainty",
  "no_guaranteed_outcomes",
  "no_autonomous_form_submission",
] as const satisfies readonly ForbiddenExplanationMove[];

const KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS = [
  "must_preserve_uncertainty",
  "must_use_source_bound_language",
  "must_distinguish_possible_vs_confirmed",
  "must_recommend_human_review_when_flagged",
  "must_not_hide_high_consequence_uncertainty",
  "required_uncertainty_wording",
] as const satisfies readonly RequiredExplanationConstraint[];

interface ContractBoundaryMappingRule {
  readonly boundaryId: ExplanationBoundary;
  readonly requiredForbiddenMoves?: readonly ForbiddenExplanationMove[];
  readonly requiredConstraints?: readonly RequiredExplanationConstraint[];
}

/**
 * Explicit rule table only. Do not infer mappings from token names or legal semantics.
 */
const CONTRACT_BOUNDARY_MAPPING_RULES: readonly ContractBoundaryMappingRule[] = [
  {
    boundaryId: "do_not_calculate_deadline",
    requiredForbiddenMoves: ["no_deadline_calculation_when_forbidden"],
  },
  {
    boundaryId: "do_not_claim_enforcement",
    requiredForbiddenMoves: ["no_enforcement_claim_when_forbidden"],
  },
  {
    boundaryId: "require_uncertainty_wording",
    requiredConstraints: ["required_uncertainty_wording"],
  },
  {
    boundaryId: "do_not_present_dry_run_as_fact",
    requiredForbiddenMoves: ["no_dry_run_as_fact"],
  },
  {
    boundaryId: "do_not_present_speculation_as_fact",
    requiredForbiddenMoves: ["no_speculation_as_fact"],
  },
  {
    boundaryId: "do_not_merge_lanes",
    requiredForbiddenMoves: ["no_cross_lane_merging"],
  },
];

export interface ValidateContractBoundaryMappingParams {
  readonly boundaries: readonly ExplanationBoundary[];
  readonly forbiddenMoves: readonly ForbiddenExplanationMove[];
  readonly requiredConstraints: readonly RequiredExplanationConstraint[];
}

export interface ContractBoundaryMappingValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly boundaryIds: readonly ExplanationBoundary[];
  readonly forbiddenMoveIds: readonly ForbiddenExplanationMove[];
  readonly requiredConstraintIds: readonly RequiredExplanationConstraint[];
  readonly missingForbiddenMoves: readonly ForbiddenExplanationMove[];
  readonly missingRequiredConstraints: readonly RequiredExplanationConstraint[];
  readonly unknownForbiddenMoves: readonly string[];
  readonly unknownRequiredConstraints: readonly string[];
  readonly notes: readonly string[];
}

/**
 * Validates explicit boundary -> contract mappings.
 *
 * This function checks only the rule table above. It does not infer legal meaning,
 * calculate deadlines, generate text, or fill missing mappings heuristically.
 */
export function validateContractBoundaryMapping({
  boundaries,
  forbiddenMoves,
  requiredConstraints,
}: ValidateContractBoundaryMappingParams): ContractBoundaryMappingValidationResult {
  const boundarySet = new Set<ExplanationBoundary>(boundaries);
  const forbiddenMoveSet = new Set<string>(forbiddenMoves);
  const requiredConstraintSet = new Set<string>(requiredConstraints);
  const knownForbiddenMoveSet = new Set<string>(KNOWN_FORBIDDEN_EXPLANATION_MOVES);
  const knownRequiredConstraintSet = new Set<string>(KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS);

  const missingForbiddenMoves: ForbiddenExplanationMove[] = [];
  const missingRequiredConstraints: RequiredExplanationConstraint[] = [];

  for (const rule of CONTRACT_BOUNDARY_MAPPING_RULES) {
    if (!boundarySet.has(rule.boundaryId)) continue;

    for (const move of rule.requiredForbiddenMoves ?? []) {
      if (!forbiddenMoveSet.has(move)) {
        missingForbiddenMoves.push(move);
      }
    }

    for (const constraint of rule.requiredConstraints ?? []) {
      if (!requiredConstraintSet.has(constraint)) {
        missingRequiredConstraints.push(constraint);
      }
    }
  }

  const unknownForbiddenMoves = [...forbiddenMoveSet].filter((move) => !knownForbiddenMoveSet.has(move));
  const unknownRequiredConstraints = [...requiredConstraintSet].filter(
    (constraint) => !knownRequiredConstraintSet.has(constraint),
  );

  const notes: string[] = [];

  if (missingForbiddenMoves.length > 0) {
    notes.push(
      `Missing forbidden moves required by supplied boundaries: ${missingForbiddenMoves.join(", ")}.`,
    );
  }

  if (missingRequiredConstraints.length > 0) {
    notes.push(
      `Missing required explanation constraints required by supplied boundaries: ${missingRequiredConstraints.join(", ")}.`,
    );
  }

  if (unknownForbiddenMoves.length > 0) {
    notes.push(
      `Unknown forbidden explanation moves supplied: ${unknownForbiddenMoves.join(", ")}. These are not part of the 8.2D-6 contract vocabulary.`,
    );
  }

  if (unknownRequiredConstraints.length > 0) {
    notes.push(
      `Unknown required explanation constraints supplied: ${unknownRequiredConstraints.join(", ")}. These are not part of the 8.2D-6 contract vocabulary.`,
    );
  }

  if (
    missingForbiddenMoves.length === 0 &&
    missingRequiredConstraints.length === 0 &&
    unknownForbiddenMoves.length === 0 &&
    unknownRequiredConstraints.length === 0
  ) {
    notes.push("Boundary -> contract mapping is valid for the supplied boundary set.");
  }

  const valid =
    missingForbiddenMoves.length === 0 &&
    missingRequiredConstraints.length === 0 &&
    unknownForbiddenMoves.length === 0 &&
    unknownRequiredConstraints.length === 0;

  return {
    valid,
    fullyConsistent: valid,
    boundaryIds: boundaries,
    forbiddenMoveIds: forbiddenMoves,
    requiredConstraintIds: requiredConstraints,
    missingForbiddenMoves,
    missingRequiredConstraints,
    unknownForbiddenMoves,
    unknownRequiredConstraints,
    notes,
  };
}
