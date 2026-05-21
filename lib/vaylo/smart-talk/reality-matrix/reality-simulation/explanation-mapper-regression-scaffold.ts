/**
 * Explanation Mapper regression scaffold (Phase 8.2F-2).
 *
 * Runs runExplanationMapper against minimal artificial inputs and validates
 * structural governance properties of the returned RuntimeExplanationDraft.
 *
 * No Jest/Vitest dependency. No CI hook. No runtime integration.
 * No user-visible prose. No LLM. No OCR. No Smart Talk wiring.
 */

import type { RealitySimulationResult } from "../reality-simulation-types";
import type {
  FreePreviewSimulationExplanationContract,
  PaidSimulationExplanationContract,
} from "./explanation-contract-types";
import type {
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";
import {
  EXPLANATION_MAPPER_VERSION,
  runExplanationMapper,
} from "./run-explanation-mapper";

export const EXPLANATION_MAPPER_REGRESSION_VERSION =
  "8.2f-2-explanation-mapper-regression-scaffold-v1";

// ── Scaffold result types ────────────────────────────────────────────────────

export interface ExplanationMapperRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly draft: RuntimeExplanationDraft;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface ExplanationMapperRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly mapperVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly ExplanationMapperRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixture helpers ───────────────────────────────────────────────────

const EMPTY_SIM_RESULT: RealitySimulationResult = {};

const BASE_FREE_CONTRACT: FreePreviewSimulationExplanationContract = {
  contractVersion: "8.2d-6-simulation-explanation-contract-v1",
  accessTier: "free_preview",
  freePreviewFields: {
    hasFinancialSignal: false,
    hasDeadlineSignal: false,
    attentionLevelPreview: "low",
    humanReviewSuggested: false,
    confidencePosture: "unknown",
  },
  forbiddenExplanationMoves: [],
  requiredExplanationConstraints: [],
  uncertaintyRequirements: [],
};

const BASE_PAID_CONTRACT: PaidSimulationExplanationContract = {
  contractVersion: "8.2d-6-simulation-explanation-contract-v1",
  accessTier: "paid_explanation",
  freePreviewFields: {
    hasFinancialSignal: false,
    hasDeadlineSignal: false,
    attentionLevelPreview: "low",
    humanReviewSuggested: false,
    confidencePosture: "unknown",
  },
  paidExplanationFields: {
    explicitFinancialSignalsOnly: [],
    explicitDeadlineMentionsOnly: [],
    institutionSignals: [],
    authorizedClaimCandidates: [],
    supportedRealityCandidates: [],
    uncertaintyReasons: [],
    boundaryIds: [],
    reviewFlags: [],
    trapWarningIds: [],
  },
  forbiddenExplanationMoves: [],
  requiredExplanationConstraints: [],
  uncertaintyRequirements: [],
};

// ── Assertion helpers ────────────────────────────────────────────────────────

function hasSectionType(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
): boolean {
  return draft.sectionDrafts.some((s) => s.sectionType === sectionType);
}

function hasNoSectionType(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
): boolean {
  return !hasSectionType(draft, sectionType);
}

function sectionHasBlockedReasonCode(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
  codeFragment: string,
): boolean {
  const section = draft.sectionDrafts.find((s) => s.sectionType === sectionType);
  return (
    section?.blockedReasonCodes?.some((c) => c.includes(codeFragment)) ?? false
  );
}

// ── Case 1: free_preview basic ───────────────────────────────────────────────

function runCase1(): ExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_FREE_CONTRACT,
    accessTier: "free_preview",
  };

  const draft = runExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "free_preview") {
    failures.push(`Expected accessTier "free_preview", got "${draft.accessTier}".`);
  }
  if (hasNoSectionType(draft, "document_overview")) {
    failures.push("Expected document_overview section to be present.");
  }
  if (hasNoSectionType(draft, "payment_preview_limited")) {
    failures.push("Expected payment_preview_limited section to be present.");
  }
  if (hasNoSectionType(draft, "uncertainty_and_limits")) {
    failures.push("Expected uncertainty_and_limits section to be present.");
  }
  // Paid-only sections must not appear in free preview.
  for (const paidSection of ["paid_deep_explanation", "what_this_means", "attention_points", "next_steps_safe"] as const) {
    if (hasSectionType(draft, paidSection)) {
      failures.push(`Paid-only section "${paidSection}" must not appear in free_preview draft.`);
    }
  }
  // All sections must be source-bound and never contain user-visible copy.
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      failures.push(`Section "${section.sectionType}" must have sourceBound: true.`);
    }
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" must have neverContainsUserVisibleCopy: true.`);
    }
  }
  if (draft.reviewPosture !== "none") {
    failures.push(`Expected reviewPosture "none" (no review flags), got "${draft.reviewPosture}".`);
  }
  if (draft.uncertaintyPosture !== "unknown") {
    failures.push(`Expected uncertaintyPosture "unknown" for empty result, got "${draft.uncertaintyPosture}".`);
  }
  if (draft.draftVersion !== "8.2f-2-runtime-explanation-draft-v1") {
    failures.push(`Unexpected draftVersion "${draft.draftVersion}".`);
  }

  notes.push("Case 1: free_preview basic — validates tier isolation and base section presence.");

  return {
    caseName: "free_preview_basic",
    passed: failures.length === 0,
    draft,
    failures,
    notes,
  };
}

// ── Case 2: free_preview with deadline forbidden ──────────────────────────────

function runCase2(): ExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      forbiddenExplanationMoves: ["no_deadline_calculation_when_forbidden"],
    },
    accessTier: "free_preview",
  };

  const draft = runExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "free_preview") {
    failures.push(`Expected accessTier "free_preview", got "${draft.accessTier}".`);
  }
  // Deadline forbidden move must be applied.
  if (!draft.appliedForbiddenMoves.includes("no_deadline_calculation_when_forbidden")) {
    failures.push("Expected no_deadline_calculation_when_forbidden in appliedForbiddenMoves.");
  }
  // paid_deep_explanation is not present in free_preview tier regardless.
  if (hasSectionType(draft, "paid_deep_explanation")) {
    failures.push("paid_deep_explanation must not appear in free_preview draft.");
  }
  // Core free sections must remain.
  if (hasNoSectionType(draft, "document_overview")) {
    failures.push("Expected document_overview section to remain present.");
  }
  if (hasNoSectionType(draft, "payment_preview_limited")) {
    failures.push("Expected payment_preview_limited section to remain present.");
  }

  notes.push("Case 2: free_preview with deadline forbidden — validates forbidden move is preserved and free sections remain.");

  return {
    caseName: "free_preview_deadline_forbidden",
    passed: failures.length === 0,
    draft,
    failures,
    notes,
  };
}

// ── Case 3: paid_explanation with uncertainty required ────────────────────────

function runCase3(): ExplanationMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    uncertaintyReasons: [
      { code: "test_uncertainty_reason", detail: "artificial uncertainty for scaffold" },
    ],
  };

  const input: RuntimeExplanationMapperInput = {
    simulationResult: simResult,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      requiredExplanationConstraints: ["required_uncertainty_wording", "must_preserve_uncertainty"],
    },
    accessTier: "paid_explanation",
  };

  const draft = runExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "paid_explanation") {
    failures.push(`Expected accessTier "paid_explanation", got "${draft.accessTier}".`);
  }
  if (draft.uncertaintyPosture !== "uncertainty_preserved") {
    failures.push(`Expected uncertaintyPosture "uncertainty_preserved", got "${draft.uncertaintyPosture}".`);
  }
  if (!draft.appliedRequiredConstraints.includes("required_uncertainty_wording")) {
    failures.push("Expected required_uncertainty_wording in appliedRequiredConstraints.");
  }
  if (!draft.appliedRequiredConstraints.includes("must_preserve_uncertainty")) {
    failures.push("Expected must_preserve_uncertainty in appliedRequiredConstraints.");
  }
  // All sections must preserve uncertainty.
  for (const section of draft.sectionDrafts) {
    if (!section.uncertaintyPreserved) {
      failures.push(`Section "${section.sectionType}" must have uncertaintyPreserved: true when required_uncertainty_wording is active.`);
    }
  }
  // free-only section must not appear in paid tier.
  if (hasSectionType(draft, "payment_preview_limited")) {
    failures.push("payment_preview_limited must not appear in paid_explanation draft.");
  }
  // Paid sections should be present.
  if (hasNoSectionType(draft, "paid_deep_explanation")) {
    failures.push("Expected paid_deep_explanation section to be present.");
  }

  notes.push("Case 3: paid_explanation with uncertainty required — validates uncertainty_preserved posture and constraint propagation.");

  return {
    caseName: "paid_uncertainty_required",
    passed: failures.length === 0,
    draft,
    failures,
    notes,
  };
}

// ── Case 4: paid_explanation with human review flag ───────────────────────────

function runCase4(): ExplanationMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    reviewFlags: [
      { flagId: "human_review_recommended", reasonCode: "scaffold_test" },
      { flagId: "high_consequence_domain", reasonCode: "scaffold_test" },
    ],
  };

  const input: RuntimeExplanationMapperInput = {
    simulationResult: simResult,
    explanationContract: BASE_PAID_CONTRACT,
    accessTier: "paid_explanation",
  };

  const draft = runExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.reviewPosture !== "human_review_recommended") {
    failures.push(`Expected reviewPosture "human_review_recommended", got "${draft.reviewPosture}".`);
  }
  if (draft.uncertaintyPosture !== "high_consequence_uncertainty") {
    failures.push(`Expected uncertaintyPosture "high_consequence_uncertainty" (high_consequence_domain flag active), got "${draft.uncertaintyPosture}".`);
  }
  if (hasNoSectionType(draft, "review_recommendation")) {
    failures.push("Expected review_recommendation section to be present when review flag is active.");
  }
  // Review posture must not be converted to certainty.
  for (const section of draft.sectionDrafts) {
    if (!section.uncertaintyPreserved) {
      failures.push(`Section "${section.sectionType}" must have uncertaintyPreserved: true when high_consequence_domain is active.`);
    }
  }

  notes.push("Case 4: paid_explanation with human review flag — validates reviewPosture and high_consequence_uncertainty posture.");

  return {
    caseName: "paid_human_review_flag",
    passed: failures.length === 0,
    draft,
    failures,
    notes,
  };
}

// ── Case 5: paid_explanation with all major forbidden moves ───────────────────

function runCase5(): ExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: [
        "no_deadline_calculation_when_forbidden",
        "no_enforcement_claim_when_forbidden",
        "no_autonomous_form_submission",
        "no_high_panic_phrasing",
        "no_cross_lane_merging",
        "no_definitive_legal_verdicts",
        "no_dry_run_as_fact",
        "no_speculation_as_fact",
      ],
    },
    accessTier: "paid_explanation",
  };

  const draft = runExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "paid_explanation") {
    failures.push(`Expected accessTier "paid_explanation", got "${draft.accessTier}".`);
  }
  // next_steps_safe must be excluded by no_autonomous_form_submission.
  if (hasSectionType(draft, "next_steps_safe")) {
    failures.push("Section next_steps_safe must be excluded when no_autonomous_form_submission is active.");
  }
  // paid_deep_explanation must be restricted by deadline and enforcement moves.
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedReasonCode(draft, "paid_deep_explanation", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("paid_deep_explanation must have a blocked reason for no_deadline_calculation_when_forbidden.");
  }
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedReasonCode(draft, "paid_deep_explanation", "no_enforcement_claim_when_forbidden")
  ) {
    failures.push("paid_deep_explanation must have a blocked reason for no_enforcement_claim_when_forbidden.");
  }
  // attention_points must be restricted by enforcement and panic moves.
  if (
    hasSectionType(draft, "attention_points") &&
    !sectionHasBlockedReasonCode(draft, "attention_points", "no_enforcement_claim_when_forbidden")
  ) {
    failures.push("attention_points must have a blocked reason for no_enforcement_claim_when_forbidden.");
  }
  if (
    hasSectionType(draft, "attention_points") &&
    !sectionHasBlockedReasonCode(draft, "attention_points", "no_high_panic_phrasing")
  ) {
    failures.push("attention_points must have a blocked reason for no_high_panic_phrasing.");
  }
  // Diagnostics must be present (exclusions and restrictions were applied).
  if (draft.neverUserVisibleDiagnostics.length === 0) {
    failures.push("Expected neverUserVisibleDiagnostics to be populated when forbidden moves are active.");
  }
  // All applied forbidden moves must appear in the draft.
  for (const move of [
    "no_deadline_calculation_when_forbidden",
    "no_enforcement_claim_when_forbidden",
    "no_autonomous_form_submission",
    "no_high_panic_phrasing",
  ] as const) {
    if (!draft.appliedForbiddenMoves.includes(move)) {
      failures.push(`Expected "${move}" in appliedForbiddenMoves.`);
    }
  }

  notes.push("Case 5: paid_explanation with all major forbidden moves — validates exclusion, restriction, and diagnostic generation.");

  return {
    caseName: "paid_all_major_forbidden_moves",
    passed: failures.length === 0,
    draft,
    failures,
    notes,
  };
}

// ── Main scaffold entry ───────────────────────────────────────────────────────

/**
 * Runs all five explanation mapper regression cases and returns a structured
 * pass/fail summary.
 *
 * No Jest/Vitest. No CI wiring. No runtime integration.
 */
export function runExplanationMapperRegressionScaffold(): ExplanationMapperRegressionScaffoldResult {
  const caseResults: ExplanationMapperRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passedCount = caseResults.filter((r) => r.passed).length;

  const notes: string[] = [];

  if (allPassed) {
    notes.push(
      `Explanation mapper regression scaffold passed: all ${caseResults.length} case(s) produce governance-consistent structural drafts.`,
    );
  } else {
    const failed = caseResults.filter((r) => !r.passed);
    notes.push(
      `Explanation mapper regression scaffold: ${passedCount}/${caseResults.length} passed. Failed cases: ${failed.map((r) => r.caseName).join(", ")}.`,
    );
    for (const r of failed) {
      for (const f of r.failures) {
        notes.push(`  [${r.caseName}] ${f}`);
      }
    }
  }

  notes.push(
    "Scaffold is structural governance validation only: no OCR, no LLM, no Smart Talk, no user-visible prose, no deadline calculation.",
  );

  return {
    scaffoldVersion: EXPLANATION_MAPPER_REGRESSION_VERSION,
    mapperVersion: EXPLANATION_MAPPER_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
