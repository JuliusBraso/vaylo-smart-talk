/**
 * Boundary emission regression scaffold (Phase 8.2D-4).
 *
 * Controlled sample checks for use in future test runners, CI, or development-only assertions.
 * This file does NOT run automatically or connect to production simulation.
 * No Smart Talk, no explanation generation, no runtime enforcement.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import { BOUNDARY_POLICY_TABLE_V1 } from "./boundary-policy-table";
import {
  validateBoundaryEmissions,
  type BoundaryEmissionValidationResult,
} from "./validate-boundary-emissions";

export interface BoundaryRegressionCase {
  readonly label: string;
  readonly emittedBoundaries: readonly ExplanationBoundary[];
  readonly expectValid: boolean;
  readonly description: string;
}

/** Canonical boundary sample: unconditional tokens always emitted by the 8.2D-1 skeleton. */
const UNCONDITIONAL_SKELETON_TOKENS: readonly ExplanationBoundary[] = [
  "do_not_calculate_deadline",
  "do_not_merge_payment_and_appeal",
  "do_not_present_dry_run_as_fact",
  "do_not_present_speculation_as_fact",
];

/** Full canonical token set: unconditional + all conditional tokens emitted when traps/signals active. */
const FULL_ACTIVE_SKELETON_TOKENS: readonly ExplanationBoundary[] = [
  ...UNCONDITIONAL_SKELETON_TOKENS,
  "do_not_claim_enforcement",
  "do_not_merge_lanes",
  "require_uncertainty_wording",
  "recommend_human_review_high_risk",
];

/** Regression cases exercised by runBoundaryEmissionRegressionScaffold. */
export const BOUNDARY_REGRESSION_CASES: readonly BoundaryRegressionCase[] = [
  {
    label: "unconditional_tokens_valid",
    emittedBoundaries: UNCONDITIONAL_SKELETON_TOKENS,
    expectValid: true,
    description:
      "Unconditional tokens always emitted by the 8.2D-1 skeleton — all should pass policy validation.",
  },
  {
    label: "full_active_tokens_valid",
    emittedBoundaries: FULL_ACTIVE_SKELETON_TOKENS,
    expectValid: true,
    description:
      "Full set of tokens the 8.2D-1 skeleton can emit (unconditional + conditional) — all canonical.",
  },
  {
    label: "canonical_review_token_accepted",
    emittedBoundaries: ["recommend_human_review_high_risk"],
    expectValid: true,
    description:
      "Canonical human-review escalation token (post 8.2D-2B consolidation) must be accepted.",
  },
  {
    label: "never_emitted_tokens_still_valid",
    emittedBoundaries: ["do_not_claim_finality", "use_relative_deadline_wording_only", "mention_uncertainty_if_ocr_noisy"],
    expectValid: true,
    description:
      "Tokens defined in the union but not yet wired to skeleton emitters — still valid if emitted.",
  },
  {
    label: "empty_boundaries_valid",
    emittedBoundaries: [],
    expectValid: true,
    description:
      "Empty boundary array is valid — simulation may omit boundaries when no signals are active.",
  },
];

export interface BoundaryRegressionCaseResult {
  readonly label: string;
  readonly description: string;
  readonly expectValid: boolean;
  readonly actualValid: boolean;
  readonly passed: boolean;
  readonly validation: BoundaryEmissionValidationResult;
}

export interface BoundaryRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly BoundaryRegressionCaseResult[];
  /**
   * Canonical alias check: verifies the removed alias is recognized as deprecated-only and
   * cannot be constructed from ExplanationBoundary without a type cast.
   */
  readonly canonicalTokenCheck: {
    readonly canonicalTokenAccepted: boolean;
    readonly deprecatedAliasOnlyInHistoricalMetadata: boolean;
    readonly deprecatedPolicyOnlyIds: readonly string[];
  };
  readonly notes: readonly string[];
}

/**
 * Runs the boundary emission regression scaffold against the canonical policy table.
 *
 * Not a Jest/Vitest test — returns structured results for use by any runner.
 * Does not modify policy table or simulation behavior.
 */
export function runBoundaryEmissionRegressionScaffold(): BoundaryRegressionScaffoldResult {
  const caseResults: BoundaryRegressionCaseResult[] = [];

  for (const tc of BOUNDARY_REGRESSION_CASES) {
    const validation = validateBoundaryEmissions({
      emittedBoundaries: tc.emittedBoundaries,
      policyTable: BOUNDARY_POLICY_TABLE_V1,
    });
    caseResults.push({
      label: tc.label,
      description: tc.description,
      expectValid: tc.expectValid,
      actualValid: validation.valid,
      passed: validation.valid === tc.expectValid,
      validation,
    });
  }

  // Canonical alias check: the deprecated alias must appear in deprecatedPolicyOnlyIds.
  // We do this by running validateBoundaryEmissions with an empty emission set; the deprecated
  // historical entries are surfaced via deprecatedPolicyOnlyIds regardless of what is emitted.
  const aliasAudit = validateBoundaryEmissions({
    emittedBoundaries: [],
    policyTable: BOUNDARY_POLICY_TABLE_V1,
  });

  const deprecatedPolicyOnlyIds = [...aliasAudit.deprecatedPolicyOnlyIds];
  const deprecatedAliasOnlyInHistoricalMetadata =
    deprecatedPolicyOnlyIds.includes("recommend_human_review_for_high_risk");

  // Verify canonical token is present and accepted in a one-item emission.
  const canonicalCheck = validateBoundaryEmissions({
    emittedBoundaries: ["recommend_human_review_high_risk"],
    policyTable: BOUNDARY_POLICY_TABLE_V1,
  });
  const canonicalTokenAccepted = canonicalCheck.valid;

  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [];
  if (failCount === 0) {
    notes.push("All regression cases passed.");
  } else {
    for (const r of caseResults) {
      if (!r.passed) {
        notes.push(
          `Case "${r.label}" FAILED: expected valid=${r.expectValid}, got valid=${r.actualValid}. Notes: ${r.validation.notes.join(" | ")}`,
        );
      }
    }
  }
  if (canonicalTokenAccepted) {
    notes.push('Canonical token "recommend_human_review_high_risk" is accepted by policy validation.');
  }
  if (deprecatedAliasOnlyInHistoricalMetadata) {
    notes.push(
      '"recommend_human_review_for_high_risk" is correctly present only in historical policy metadata (deprecatedPolicyOnlyIds) and is not a live ExplanationBoundary.',
    );
  } else {
    notes.push(
      'WARNING: "recommend_human_review_for_high_risk" was not found in deprecatedPolicyOnlyIds — policy table may have drifted.',
    );
  }

  return {
    scaffoldVersion: "8.2d-4-boundary-emission-regression-v1",
    allPassed: failCount === 0 && canonicalTokenAccepted && deprecatedAliasOnlyInHistoricalMetadata,
    passCount,
    failCount,
    caseResults,
    canonicalTokenCheck: {
      canonicalTokenAccepted,
      deprecatedAliasOnlyInHistoricalMetadata,
      deprecatedPolicyOnlyIds,
    },
    notes,
  };
}
