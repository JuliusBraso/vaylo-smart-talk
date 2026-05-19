/**
 * Contract boundary mapping validator (Phase 8.2D-6A / upgraded 8.2D-6B).
 *
 * Pure regression/validation helper only:
 * - no explanation generation
 * - no Smart Talk wiring
 * - no payment logic
 * - no contract builder
 * - no runtime simulation integration
 *
 * 8.2D-6B: local known-token arrays removed; canonical registries imported from
 * explanation-contract-types.ts. Optional override params allow callers to supply
 * custom known-token sets while defaulting to the exported registries.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
  type ForbiddenExplanationMove,
  type RequiredExplanationConstraint,
} from "./explanation-contract-types";

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
  /**
   * Live forbidden-move registry to use for unknown-token checks.
   * Defaults to `KNOWN_FORBIDDEN_EXPLANATION_MOVES` from explanation-contract-types.ts.
   */
  readonly knownForbiddenMoves?: readonly ForbiddenExplanationMove[];
  /**
   * Live required-constraint registry to use for unknown-token checks.
   * Defaults to `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS` from explanation-contract-types.ts.
   */
  readonly knownRequiredConstraints?: readonly RequiredExplanationConstraint[];
}

export interface ContractBoundaryMappingValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly boundaryIds: readonly ExplanationBoundary[];
  readonly forbiddenMoveIds: readonly ForbiddenExplanationMove[];
  readonly requiredConstraintIds: readonly RequiredExplanationConstraint[];
  /** The known forbidden-move registry used for this validation run. */
  readonly knownForbiddenMoveIds: readonly ForbiddenExplanationMove[];
  /** The known required-constraint registry used for this validation run. */
  readonly knownRequiredConstraintIds: readonly RequiredExplanationConstraint[];
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
 *
 * Defaults to the canonical registries exported from explanation-contract-types.ts.
 * Callers may supply override registries for isolated testing.
 */
export function validateContractBoundaryMapping({
  boundaries,
  forbiddenMoves,
  requiredConstraints,
  knownForbiddenMoves = KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  knownRequiredConstraints = KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
}: ValidateContractBoundaryMappingParams): ContractBoundaryMappingValidationResult {
  const boundarySet = new Set<ExplanationBoundary>(boundaries);
  const forbiddenMoveSet = new Set<string>(forbiddenMoves);
  const requiredConstraintSet = new Set<string>(requiredConstraints);
  const knownForbiddenMoveSet = new Set<string>(knownForbiddenMoves);
  const knownRequiredConstraintSet = new Set<string>(knownRequiredConstraints);

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
    knownForbiddenMoveIds: knownForbiddenMoves,
    knownRequiredConstraintIds: knownRequiredConstraints,
    missingForbiddenMoves,
    missingRequiredConstraints,
    unknownForbiddenMoves,
    unknownRequiredConstraints,
    notes,
  };
}
