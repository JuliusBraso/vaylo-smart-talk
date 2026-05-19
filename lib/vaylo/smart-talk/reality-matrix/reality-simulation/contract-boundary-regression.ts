/**
 * Contract boundary mapping regression scaffold (Phase 8.2D-6A).
 *
 * Controlled cases for future test runners or CI.
 * This module does not run automatically and is not wired into Reality Simulation,
 * Smart Talk, payment, or explanation generation.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  ForbiddenExplanationMove,
  RequiredExplanationConstraint,
} from "./explanation-contract-types";
import {
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
  readonly notes: readonly string[];
}

/**
 * Runs controlled contract-boundary mapping checks.
 *
 * Not a test framework dependency. Not wired into runtime.
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

  const passCount = caseResults.filter((result) => result.passed).length;
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

  notes.push(
    "Mapping is explicit rule-table validation only: no legal inference, deadline calculation, generated text, Smart Talk wiring, or payment integration.",
  );

  return {
    scaffoldVersion: "8.2d-6a-contract-boundary-regression-v1",
    allPassed: failCount === 0,
    passCount,
    failCount,
    caseResults,
    notes,
  };
}
