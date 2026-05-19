/**
 * Contract boundary mapping regression scaffold
 * (Phase 8.2D-6A / upgraded 8.2D-6B / upgraded 8.2D-6C).
 *
 * Controlled cases for future test runners or CI.
 * This module does not run automatically and is not wired into Reality Simulation,
 * Smart Talk, payment, or explanation generation.
 *
 * 8.2D-6B: imports canonical registries from explanation-contract-types.ts;
 * adds a registryConsistencyCheck block verifying all known tokens are accepted.
 *
 * 8.2D-6C: imports CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES; adds mappingCoverageCheck
 * block verifying every contract-relevant boundary is covered by the rule table and
 * that no rule references an unknown boundary. allPassed now gates on coverage check.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
  type ForbiddenExplanationMove,
  type RequiredExplanationConstraint,
} from "./explanation-contract-types";
import {
  CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES,
  validateContractBoundaryMapping,
  type ContractBoundaryMappingValidationResult,
} from "./validate-contract-boundary-mapping";

export interface ContractBoundaryRegressionCase {
  readonly label: string;
  readonly description: string;
  readonly boundaries: readonly ExplanationBoundary[];
  readonly forbiddenMoves: readonly ForbiddenExplanationMove[];
  readonly requiredConstraints: readonly RequiredExplanationConstraint[];
  readonly expectValid: boolean;
  readonly expectFullyConsistent: boolean;
}

const BASE_FORBIDDEN_MOVES: readonly ForbiddenExplanationMove[] = [
  "no_definitive_legal_verdicts",
  "no_guaranteed_outcomes",
  "no_autonomous_form_submission",
];

const BASE_REQUIRED_CONSTRAINTS: readonly RequiredExplanationConstraint[] = [
  "must_preserve_uncertainty",
  "must_use_source_bound_language",
  "must_distinguish_possible_vs_confirmed",
];

export const CONTRACT_BOUNDARY_REGRESSION_CASES: readonly ContractBoundaryRegressionCase[] = [
  {
    label: "valid_canonical_boundary_mapping",
    description:
      "Canonical case: deadline, enforcement, dry-run, speculation, lane, and uncertainty boundaries all carry required contract constraints.",
    boundaries: [
      "do_not_calculate_deadline",
      "do_not_claim_enforcement",
      "require_uncertainty_wording",
      "do_not_present_dry_run_as_fact",
      "do_not_present_speculation_as_fact",
      "do_not_merge_lanes",
    ],
    forbiddenMoves: [
      ...BASE_FORBIDDEN_MOVES,
      "no_deadline_calculation_when_forbidden",
      "no_enforcement_claim_when_forbidden",
      "no_dry_run_as_fact",
      "no_speculation_as_fact",
      "no_cross_lane_merging",
    ],
    requiredConstraints: [...BASE_REQUIRED_CONSTRAINTS, "required_uncertainty_wording"],
    expectValid: true,
    expectFullyConsistent: true,
  },
  {
    label: "missing_forbidden_move_detected",
    description:
      "Boundary do_not_calculate_deadline requires no_deadline_calculation_when_forbidden; omission must fail.",
    boundaries: ["do_not_calculate_deadline"],
    forbiddenMoves: BASE_FORBIDDEN_MOVES,
    requiredConstraints: BASE_REQUIRED_CONSTRAINTS,
    expectValid: false,
    expectFullyConsistent: false,
  },
  {
    label: "missing_required_constraint_detected",
    description:
      "Boundary require_uncertainty_wording requires required_uncertainty_wording; omission must fail.",
    boundaries: ["require_uncertainty_wording"],
    forbiddenMoves: BASE_FORBIDDEN_MOVES,
    requiredConstraints: BASE_REQUIRED_CONSTRAINTS,
    expectValid: false,
    expectFullyConsistent: false,
  },
  {
    label: "multiple_boundary_case_valid",
    description:
      "Multiple boundaries requiring both forbidden moves and required constraints must pass when all explicit mappings are present.",
    boundaries: [
      "do_not_claim_enforcement",
      "do_not_merge_lanes",
      "require_uncertainty_wording",
    ],
    forbiddenMoves: [
      ...BASE_FORBIDDEN_MOVES,
      "no_enforcement_claim_when_forbidden",
      "no_cross_lane_merging",
    ],
    requiredConstraints: [...BASE_REQUIRED_CONSTRAINTS, "required_uncertainty_wording"],
    expectValid: true,
    expectFullyConsistent: true,
  },
  {
    label: "empty_safe_case_valid",
    description:
      "Empty boundary set is valid when only baseline contract constraints are supplied; no mapping is required.",
    boundaries: [],
    forbiddenMoves: BASE_FORBIDDEN_MOVES,
    requiredConstraints: BASE_REQUIRED_CONSTRAINTS,
    expectValid: true,
    expectFullyConsistent: true,
  },
  {
    label: "unknown_forbidden_move_detected",
    description:
      "Force-cast unknown forbidden move must fail validation and be reported in unknownForbiddenMoves.",
    boundaries: [],
    forbiddenMoves: [
      ...BASE_FORBIDDEN_MOVES,
      "unknown_forbidden_move" as ForbiddenExplanationMove,
    ],
    requiredConstraints: BASE_REQUIRED_CONSTRAINTS,
    expectValid: false,
    expectFullyConsistent: false,
  },
  {
    label: "unknown_required_constraint_detected",
    description:
      "Force-cast unknown required constraint must fail validation and be reported in unknownRequiredConstraints.",
    boundaries: [],
    forbiddenMoves: BASE_FORBIDDEN_MOVES,
    requiredConstraints: [
      ...BASE_REQUIRED_CONSTRAINTS,
      "unknown_required_constraint" as RequiredExplanationConstraint,
    ],
    expectValid: false,
    expectFullyConsistent: false,
  },
  {
    label: "informational_boundary_no_mapping_required",
    description:
      "Boundaries that are not in CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES (e.g. do_not_claim_finality) do not need a mapping rule; supplying them without contract constraints is still valid.",
    boundaries: ["do_not_claim_finality", "mention_uncertainty_if_ocr_noisy"],
    forbiddenMoves: BASE_FORBIDDEN_MOVES,
    requiredConstraints: BASE_REQUIRED_CONSTRAINTS,
    expectValid: true,
    expectFullyConsistent: true,
  },
];

export interface ContractBoundaryRegressionCaseResult {
  readonly label: string;
  readonly description: string;
  readonly expectValid: boolean;
  readonly expectFullyConsistent: boolean;
  readonly actualValid: boolean;
  readonly actualFullyConsistent: boolean;
  readonly passed: boolean;
  readonly validation: ContractBoundaryMappingValidationResult;
}

export interface ContractBoundaryRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly ContractBoundaryRegressionCaseResult[];
  /**
   * Registry consistency check (8.2D-6B): verifies that all known forbidden moves and
   * required constraints are accepted as known by the validator, and that force-cast unknown
   * tokens are still correctly rejected.
   */
  readonly registryConsistencyCheck: {
    readonly allKnownForbiddenMovesAccepted: boolean;
    readonly allKnownRequiredConstraintsAccepted: boolean;
    readonly unknownForbiddenMoveRejected: boolean;
    readonly unknownRequiredConstraintRejected: boolean;
  };
  /**
   * Mapping coverage check (8.2D-6C): verifies that every contract-relevant boundary
   * has a rule in the rule table, and that no rule references an unknown boundary.
   *
   * These are structural checks on the rule table — not dependent on any specific input
   * boundary set. They detect drift when new boundaries are added without updating rules.
   */
  readonly mappingCoverageCheck: {
    /** True when all CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES have at least one rule. */
    readonly allContractRelevantBoundariesMapped: boolean;
    /** True when no rule-table entry references a boundary outside KNOWN_EXPLANATION_BOUNDARIES. */
    readonly noMappingRulesForUnknownBoundaries: boolean;
    /** Boundaries that are contract-relevant but have no rule. */
    readonly contractRelevantBoundariesMissingRules: readonly ExplanationBoundary[];
    /** Rule-table boundary ids that are not in KNOWN_EXPLANATION_BOUNDARIES. */
    readonly mappingRulesForUnknownBoundaries: readonly ExplanationBoundary[];
  };
  readonly notes: readonly string[];
}

/**
 * Runs controlled contract-boundary mapping checks.
 *
 * Not a test framework dependency. Not wired into runtime.
 * Includes 8.2D-6B registry consistency checks and 8.2D-6C mapping coverage checks.
 */
export function runContractBoundaryRegressionScaffold(): ContractBoundaryRegressionScaffoldResult {
  const caseResults: ContractBoundaryRegressionCaseResult[] = [];

  for (const tc of CONTRACT_BOUNDARY_REGRESSION_CASES) {
    const validation = validateContractBoundaryMapping({
      boundaries: tc.boundaries,
      forbiddenMoves: tc.forbiddenMoves,
      requiredConstraints: tc.requiredConstraints,
    });

    const passed =
      validation.valid === tc.expectValid &&
      validation.fullyConsistent === tc.expectFullyConsistent;

    caseResults.push({
      label: tc.label,
      description: tc.description,
      expectValid: tc.expectValid,
      expectFullyConsistent: tc.expectFullyConsistent,
      actualValid: validation.valid,
      actualFullyConsistent: validation.fullyConsistent,
      passed,
      validation,
    });
  }

  // ── 8.2D-6B: Registry consistency ────────────────────────────────────────────
  // Verify that the full known-token registries are accepted without triggering
  // unknown-token failures.
  const fullRegistryCheck = validateContractBoundaryMapping({
    boundaries: [],
    forbiddenMoves: KNOWN_FORBIDDEN_EXPLANATION_MOVES,
    requiredConstraints: KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
  });
  const allKnownForbiddenMovesAccepted = fullRegistryCheck.unknownForbiddenMoves.length === 0;
  const allKnownRequiredConstraintsAccepted =
    fullRegistryCheck.unknownRequiredConstraints.length === 0;

  const unknownForbiddenCheck = validateContractBoundaryMapping({
    boundaries: [],
    forbiddenMoves: ["unknown_forbidden_move" as ForbiddenExplanationMove],
    requiredConstraints: [],
  });
  const unknownForbiddenMoveRejected = unknownForbiddenCheck.unknownForbiddenMoves.length > 0;

  const unknownConstraintCheck = validateContractBoundaryMapping({
    boundaries: [],
    forbiddenMoves: [],
    requiredConstraints: ["unknown_required_constraint" as RequiredExplanationConstraint],
  });
  const unknownRequiredConstraintRejected =
    unknownConstraintCheck.unknownRequiredConstraints.length > 0;

  const registryConsistencyCheck = {
    allKnownForbiddenMovesAccepted,
    allKnownRequiredConstraintsAccepted,
    unknownForbiddenMoveRejected,
    unknownRequiredConstraintRejected,
  };

  // ── 8.2D-6C: Mapping coverage ────────────────────────────────────────────────
  // Use an empty input call purely to extract table-level coverage fields.
  const coverageCall = validateContractBoundaryMapping({
    boundaries: [],
    forbiddenMoves: [],
    requiredConstraints: [],
  });
  const { contractRelevantBoundariesMissingRules, mappingRulesForUnknownBoundaries } = coverageCall;
  const allContractRelevantBoundariesMapped = contractRelevantBoundariesMissingRules.length === 0;
  const noMappingRulesForUnknownBoundaries = mappingRulesForUnknownBoundaries.length === 0;

  const mappingCoverageCheck = {
    allContractRelevantBoundariesMapped,
    noMappingRulesForUnknownBoundaries,
    contractRelevantBoundariesMissingRules,
    mappingRulesForUnknownBoundaries,
  };

  // ── Notes ────────────────────────────────────────────────────────────────────
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;
  const notes: string[] = [];

  if (failCount === 0) {
    notes.push("All contract boundary mapping regression cases passed.");
  } else {
    for (const result of caseResults) {
      if (!result.passed) {
        notes.push(
          `Case "${result.label}" FAILED: expected valid=${result.expectValid}/fullyConsistent=${result.expectFullyConsistent}, got valid=${result.actualValid}/fullyConsistent=${result.actualFullyConsistent}. Notes: ${result.validation.notes.join(" | ")}`,
        );
      }
    }
  }

  // Registry consistency notes (8.2D-6B)
  if (allKnownForbiddenMovesAccepted) {
    notes.push(
      `REGISTRY CHECK: All ${KNOWN_FORBIDDEN_EXPLANATION_MOVES.length} KNOWN_FORBIDDEN_EXPLANATION_MOVES are accepted by the validator.`,
    );
  } else {
    notes.push(
      "REGISTRY CHECK FAIL: One or more KNOWN_FORBIDDEN_EXPLANATION_MOVES were reported as unknown — registry/validator drift.",
    );
  }

  if (allKnownRequiredConstraintsAccepted) {
    notes.push(
      `REGISTRY CHECK: All ${KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS.length} KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS are accepted by the validator.`,
    );
  } else {
    notes.push(
      "REGISTRY CHECK FAIL: One or more KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS were reported as unknown — registry/validator drift.",
    );
  }

  if (unknownForbiddenMoveRejected) {
    notes.push("REGISTRY CHECK: Force-cast unknown forbidden move is correctly rejected.");
  } else {
    notes.push(
      "REGISTRY CHECK FAIL: Force-cast unknown forbidden move was NOT rejected — unknown-token protection broken.",
    );
  }

  if (unknownRequiredConstraintRejected) {
    notes.push("REGISTRY CHECK: Force-cast unknown required constraint is correctly rejected.");
  } else {
    notes.push(
      "REGISTRY CHECK FAIL: Force-cast unknown required constraint was NOT rejected — unknown-token protection broken.",
    );
  }

  // Mapping coverage notes (8.2D-6C)
  if (allContractRelevantBoundariesMapped) {
    notes.push(
      `COVERAGE CHECK: All ${CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES.length} CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES have at least one mapping rule.`,
    );
  } else {
    notes.push(
      `COVERAGE CHECK FAIL: Contract-relevant boundaries missing rules: ${contractRelevantBoundariesMissingRules.join(", ")}. Add entries to CONTRACT_BOUNDARY_MAPPING_RULES.`,
    );
  }

  if (noMappingRulesForUnknownBoundaries) {
    notes.push(
      "COVERAGE CHECK: No rule-table entry references an unknown or deprecated boundary.",
    );
  } else {
    notes.push(
      `COVERAGE CHECK FAIL: Rule-table entries reference unknown boundaries: ${mappingRulesForUnknownBoundaries.join(", ")}. Remove or replace these entries.`,
    );
  }

  notes.push(
    "Mapping is explicit rule-table validation only: no legal inference, deadline calculation, generated text, Smart Talk wiring, or payment integration.",
  );

  const registryConsistencyPassed =
    allKnownForbiddenMovesAccepted &&
    allKnownRequiredConstraintsAccepted &&
    unknownForbiddenMoveRejected &&
    unknownRequiredConstraintRejected;

  const mappingCoveragePassed =
    allContractRelevantBoundariesMapped && noMappingRulesForUnknownBoundaries;

  return {
    scaffoldVersion: "8.2d-6c-contract-boundary-regression-v3",
    allPassed: failCount === 0 && registryConsistencyPassed && mappingCoveragePassed,
    passCount,
    failCount,
    caseResults,
    registryConsistencyCheck,
    mappingCoverageCheck,
    notes,
  };
}
