/**
 * Contract boundary mapping validator (Phase 8.2D-6A / upgraded 8.2D-6B / upgraded 8.2D-6C).
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
 *
 * 8.2D-6C: adds CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES registry, four new result
 * fields for rule-coverage checks, and extends `fullyConsistent` to include table-level
 * mapping coverage (all contract-relevant boundaries covered, no rule references an
 * unknown/deprecated boundary).
 */

import {
  KNOWN_EXPLANATION_BOUNDARIES,
  type ExplanationBoundary,
} from "../reality-simulation-types";
import {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
  type ForbiddenExplanationMove,
  type RequiredExplanationConstraint,
} from "./explanation-contract-types";

/**
 * Boundaries that MUST be covered by at least one CONTRACT_BOUNDARY_MAPPING_RULES entry
 * because they structurally imply a ForbiddenExplanationMove or RequiredExplanationConstraint.
 *
 * Not every ExplanationBoundary requires a contract mapping. Informational boundaries
 * (e.g. `do_not_claim_finality`, `mention_uncertainty_if_ocr_noisy`) are governance
 * markers that do not obligate a specific contract constraint.
 *
 * Relevance is declared EXPLICITLY here. Do not infer from token names.
 *
 * The `satisfies readonly ExplanationBoundary[]` constraint ensures every listed token
 * is a valid live boundary at compile time.
 */
export const CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES = [
  "do_not_calculate_deadline",
  "do_not_claim_enforcement",
  "require_uncertainty_wording",
  "do_not_present_dry_run_as_fact",
  "do_not_present_speculation_as_fact",
  "do_not_merge_lanes",
] as const satisfies readonly ExplanationBoundary[];

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
   * Live forbidden-move registry for unknown-token checks.
   * Defaults to `KNOWN_FORBIDDEN_EXPLANATION_MOVES`.
   */
  readonly knownForbiddenMoves?: readonly ForbiddenExplanationMove[];
  /**
   * Live required-constraint registry for unknown-token checks.
   * Defaults to `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`.
   */
  readonly knownRequiredConstraints?: readonly RequiredExplanationConstraint[];
  /**
   * Live boundary registry for checking that rule-table entries reference valid boundaries.
   * Defaults to `KNOWN_EXPLANATION_BOUNDARIES`.
   */
  readonly knownBoundaries?: readonly ExplanationBoundary[];
  /**
   * Registry of boundaries that must each have at least one mapping rule.
   * Defaults to `CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES`.
   */
  readonly contractRelevantBoundaries?: readonly ExplanationBoundary[];
}

export interface ContractBoundaryMappingValidationResult {
  /**
   * Emitted-set validity: no missing forbidden moves or required constraints for the
   * supplied boundary set; no unknown tokens supplied.
   * Backward-compatible — does not change with 8.2D-6C.
   */
  readonly valid: boolean;
  /**
   * Full consistency: `valid` AND all contract-relevant boundaries have a mapping rule
   * AND no rule-table entry references an unknown/deprecated boundary.
   *
   * Semantic tiers (8.2D-6C):
   *   valid             = emitted-set safety only
   *   fullyConsistent   = emitted-set safety + mapping-rule coverage
   */
  readonly fullyConsistent: boolean;
  readonly boundaryIds: readonly ExplanationBoundary[];
  readonly forbiddenMoveIds: readonly ForbiddenExplanationMove[];
  readonly requiredConstraintIds: readonly RequiredExplanationConstraint[];
  /** Active forbidden-move registry for this run. */
  readonly knownForbiddenMoveIds: readonly ForbiddenExplanationMove[];
  /** Active required-constraint registry for this run. */
  readonly knownRequiredConstraintIds: readonly RequiredExplanationConstraint[];
  readonly missingForbiddenMoves: readonly ForbiddenExplanationMove[];
  readonly missingRequiredConstraints: readonly RequiredExplanationConstraint[];
  readonly unknownForbiddenMoves: readonly string[];
  readonly unknownRequiredConstraints: readonly string[];
  // ── 8.2D-6C: mapping-rule coverage fields ──────────────────────────────────
  /** The contract-relevant boundary registry used for this run. */
  readonly contractRelevantBoundaryIds: readonly ExplanationBoundary[];
  /** Boundaries from the rule table that have at least one rule entry. */
  readonly mappedBoundaryIds: readonly ExplanationBoundary[];
  /**
   * Contract-relevant boundaries that have NO entry in CONTRACT_BOUNDARY_MAPPING_RULES.
   * Non-empty = rule table has coverage drift and must be updated.
   */
  readonly contractRelevantBoundariesMissingRules: readonly ExplanationBoundary[];
  /**
   * Rule-table boundary ids that are NOT in KNOWN_EXPLANATION_BOUNDARIES.
   * Non-empty = rule table references an unknown or deprecated boundary token.
   */
  readonly mappingRulesForUnknownBoundaries: readonly ExplanationBoundary[];
  readonly notes: readonly string[];
}

/**
 * Validates explicit boundary -> contract mappings.
 *
 * Per-call check (`valid`):
 *   - no missing forbidden moves/constraints for the supplied boundaries
 *   - no unknown tokens in the supplied forbidden-moves/constraints sets
 *
 * Table-level check (contributes to `fullyConsistent`):
 *   - every contract-relevant boundary has at least one rule
 *   - no rule-table entry references an unknown boundary
 *
 * Does not infer legal meaning, calculate deadlines, generate text, or fill
 * missing mappings heuristically.
 */
export function validateContractBoundaryMapping({
  boundaries,
  forbiddenMoves,
  requiredConstraints,
  knownForbiddenMoves = KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  knownRequiredConstraints = KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
  knownBoundaries = KNOWN_EXPLANATION_BOUNDARIES,
  contractRelevantBoundaries = CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES,
}: ValidateContractBoundaryMappingParams): ContractBoundaryMappingValidationResult {
  // ── Per-call checks ──────────────────────────────────────────────────────────
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

  const unknownForbiddenMoves = [...forbiddenMoveSet].filter(
    (move) => !knownForbiddenMoveSet.has(move),
  );
  const unknownRequiredConstraints = [...requiredConstraintSet].filter(
    (constraint) => !knownRequiredConstraintSet.has(constraint),
  );

  const valid =
    missingForbiddenMoves.length === 0 &&
    missingRequiredConstraints.length === 0 &&
    unknownForbiddenMoves.length === 0 &&
    unknownRequiredConstraints.length === 0;

  // ── Table-level coverage checks (8.2D-6C) ───────────────────────────────────
  const knownBoundarySet = new Set<string>(knownBoundaries);

  // Boundaries that have at least one rule entry in the table.
  const mappedBoundarySet = new Set<ExplanationBoundary>(
    CONTRACT_BOUNDARY_MAPPING_RULES.map((r) => r.boundaryId),
  );
  const mappedBoundaryIds: ExplanationBoundary[] = [...mappedBoundarySet];

  // Contract-relevant boundaries with no rule.
  const contractRelevantBoundariesMissingRules = contractRelevantBoundaries.filter(
    (b) => !mappedBoundarySet.has(b),
  );

  // Rule-table entries whose boundaryId is not in the live boundary registry.
  const mappingRulesForUnknownBoundaries = CONTRACT_BOUNDARY_MAPPING_RULES.map(
    (r) => r.boundaryId,
  ).filter((id) => !knownBoundarySet.has(id));

  const fullyConsistent =
    valid &&
    contractRelevantBoundariesMissingRules.length === 0 &&
    mappingRulesForUnknownBoundaries.length === 0;

  // ── Notes ────────────────────────────────────────────────────────────────────
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

  if (contractRelevantBoundariesMissingRules.length > 0) {
    notes.push(
      `Contract-relevant boundaries missing mapping rules: ${contractRelevantBoundariesMissingRules.join(", ")}. Rule table has coverage drift.`,
    );
  }

  if (mappingRulesForUnknownBoundaries.length > 0) {
    notes.push(
      `Rule-table entries reference unknown/deprecated boundaries: ${mappingRulesForUnknownBoundaries.join(", ")}. Remove or replace these rule entries.`,
    );
  }

  if (
    missingForbiddenMoves.length === 0 &&
    missingRequiredConstraints.length === 0 &&
    unknownForbiddenMoves.length === 0 &&
    unknownRequiredConstraints.length === 0 &&
    contractRelevantBoundariesMissingRules.length === 0 &&
    mappingRulesForUnknownBoundaries.length === 0
  ) {
    notes.push(
      "Boundary -> contract mapping is valid and fully consistent for the supplied boundary set.",
    );
  } else if (valid) {
    notes.push("Boundary -> contract mapping is valid for the supplied boundary set.");
  }

  return {
    valid,
    fullyConsistent,
    boundaryIds: boundaries,
    forbiddenMoveIds: forbiddenMoves,
    requiredConstraintIds: requiredConstraints,
    knownForbiddenMoveIds: knownForbiddenMoves,
    knownRequiredConstraintIds: knownRequiredConstraints,
    contractRelevantBoundaryIds: contractRelevantBoundaries,
    mappedBoundaryIds,
    contractRelevantBoundariesMissingRules,
    mappingRulesForUnknownBoundaries,
    missingForbiddenMoves,
    missingRequiredConstraints,
    unknownForbiddenMoves,
    unknownRequiredConstraints,
    notes,
  };
}
