/**
 * Free Preview Mapper regression scaffold (Phase 8.2F-3).
 *
 * Seven structural regression cases validating free-preview governance constraints.
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
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
  FREE_PREVIEW_MAPPER_VERSION,
  runFreePreviewMapper,
} from "./run-free-preview-mapper";

export const FREE_PREVIEW_MAPPER_REGRESSION_VERSION =
  "8.2f-3-free-preview-mapper-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface FreePreviewMapperRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly draft: RuntimeExplanationDraft;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface FreePreviewMapperRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly mapperVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly FreePreviewMapperRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixtures ───────────────────────────────────────────────────────────

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

// ── Assertion helpers ─────────────────────────────────────────────────────────

const PAID_ONLY_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "what_this_means",
  "attention_points",
  "next_steps_safe",
  "paid_deep_explanation",
];

function hasSectionType(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
): boolean {
  return draft.sectionDrafts.some((s) => s.sectionType === sectionType);
}

function hasDiagnosticCode(draft: RuntimeExplanationDraft, code: string): boolean {
  return draft.neverUserVisibleDiagnostics.some((d) => d.code === code);
}

function sectionHasBlockedCode(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
  fragment: string,
): boolean {
  const section = draft.sectionDrafts.find((s) => s.sectionType === sectionType);
  return section?.blockedReasonCodes?.some((c) => c.includes(fragment)) ?? false;
}

function assertNoProseLeakage(draft: RuntimeExplanationDraft, failures: string[]): void {
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      failures.push(`Section "${section.sectionType}" must have sourceBound: true.`);
    }
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" must have neverContainsUserVisibleCopy: true.`);
    }
    if (section.accessTier !== "free_preview") {
      failures.push(`Section "${section.sectionType}" must have accessTier "free_preview", got "${section.accessTier}".`);
    }
  }
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Diagnostic "${diag.code}" must have neverUserVisible: true.`);
    }
  }
}

function assertNoPaidSections(draft: RuntimeExplanationDraft, failures: string[]): void {
  for (const paidSection of PAID_ONLY_SECTIONS) {
    if (hasSectionType(draft, paidSection)) {
      failures.push(`Paid-only section "${paidSection}" must not appear in free preview draft.`);
    }
  }
}

// ── Case 1: Basic safe preview ────────────────────────────────────────────────

function runCase1(): FreePreviewMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_FREE_CONTRACT,
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "free_preview") {
    failures.push(`Expected accessTier "free_preview", got "${draft.accessTier}".`);
  }
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("Expected document_overview section to be present.");
  }
  if (!hasSectionType(draft, "payment_preview_limited")) {
    failures.push("Expected payment_preview_limited section to be present.");
  }
  if (!hasSectionType(draft, "uncertainty_and_limits")) {
    failures.push("Expected uncertainty_and_limits section to be present.");
  }
  // No review section when no flags.
  if (hasSectionType(draft, "review_recommendation")) {
    failures.push("review_recommendation must not appear when no review flags are active.");
  }
  if (draft.uncertaintyPosture !== "unknown") {
    failures.push(`Expected uncertaintyPosture "unknown", got "${draft.uncertaintyPosture}".`);
  }
  if (draft.reviewPosture !== "none") {
    failures.push(`Expected reviewPosture "none", got "${draft.reviewPosture}".`);
  }
  // Paid-field blocked diagnostic must always be emitted.
  if (!hasDiagnosticCode(draft, "free_preview_paid_field_blocked")) {
    failures.push("Expected free_preview_paid_field_blocked diagnostic to be present.");
  }
  assertNoPaidSections(draft, failures);
  assertNoProseLeakage(draft, failures);

  notes.push("Case 1: basic safe preview — validates section presence, postures, and invariant paid-block diagnostic.");

  return { caseName: "basic_safe_preview", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 2: Preview with uncertainty requirement ───────────────────────────────

function runCase2(): FreePreviewMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    uncertaintyReasons: [
      { code: "scaffold_uncertainty", detail: "artificial uncertainty for scaffold" },
    ],
  };

  const input: RuntimeExplanationMapperInput = {
    simulationResult: simResult,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      requiredExplanationConstraints: ["required_uncertainty_wording", "must_preserve_uncertainty"],
    },
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.uncertaintyPosture !== "uncertainty_preserved") {
    failures.push(`Expected uncertaintyPosture "uncertainty_preserved", got "${draft.uncertaintyPosture}".`);
  }
  if (!draft.appliedRequiredConstraints.includes("required_uncertainty_wording")) {
    failures.push("Expected required_uncertainty_wording in appliedRequiredConstraints.");
  }
  if (!draft.appliedRequiredConstraints.includes("must_preserve_uncertainty")) {
    failures.push("Expected must_preserve_uncertainty in appliedRequiredConstraints.");
  }
  for (const section of draft.sectionDrafts) {
    if (!section.uncertaintyPreserved) {
      failures.push(`Section "${section.sectionType}" must have uncertaintyPreserved: true.`);
    }
  }
  assertNoPaidSections(draft, failures);
  assertNoProseLeakage(draft, failures);

  notes.push("Case 2: uncertainty requirement — validates uncertainty_preserved posture and constraint propagation.");

  return { caseName: "preview_uncertainty_required", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 3: Preview with deadline forbidden ───────────────────────────────────

function runCase3(): FreePreviewMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      forbiddenExplanationMoves: ["no_deadline_calculation_when_forbidden"],
    },
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_deadline_calculation_when_forbidden")) {
    failures.push("Expected no_deadline_calculation_when_forbidden in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "free_preview_deadline_detail_blocked")) {
    failures.push("Expected free_preview_deadline_detail_blocked diagnostic.");
  }
  // payment_preview_limited should have blocked reason code for deadline.
  if (
    hasSectionType(draft, "payment_preview_limited") &&
    !sectionHasBlockedCode(draft, "payment_preview_limited", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("payment_preview_limited must have blockedReasonCode for no_deadline_calculation_when_forbidden.");
  }
  // Base sections must still be present.
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("document_overview must remain present.");
  }
  if (!hasSectionType(draft, "payment_preview_limited")) {
    failures.push("payment_preview_limited must remain present.");
  }
  assertNoPaidSections(draft, failures);
  assertNoProseLeakage(draft, failures);

  notes.push("Case 3: deadline forbidden — validates free_preview_deadline_detail_blocked diagnostic and payment_preview_limited restriction.");

  return { caseName: "preview_deadline_forbidden", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 4: Preview with enforcement forbidden ────────────────────────────────

function runCase4(): FreePreviewMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      forbiddenExplanationMoves: ["no_enforcement_claim_when_forbidden"],
    },
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_enforcement_claim_when_forbidden")) {
    failures.push("Expected no_enforcement_claim_when_forbidden in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "free_preview_enforcement_claim_blocked")) {
    failures.push("Expected free_preview_enforcement_claim_blocked diagnostic.");
  }
  // attention_points is already absent in free preview — validate this explicitly.
  if (hasSectionType(draft, "attention_points")) {
    failures.push("attention_points must never appear in free preview draft.");
  }
  // Base sections must remain.
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("document_overview must remain present.");
  }
  assertNoPaidSections(draft, failures);
  assertNoProseLeakage(draft, failures);

  notes.push("Case 4: enforcement forbidden — validates free_preview_enforcement_claim_blocked diagnostic and absence of attention_points.");

  return { caseName: "preview_enforcement_forbidden", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 5: Invalid paid_explanation tier input ───────────────────────────────

function runCase5(): FreePreviewMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_PAID_CONTRACT,
    accessTier: "paid_explanation",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  // No sections must be produced.
  if (draft.sectionDrafts.length !== 0) {
    failures.push(
      `Expected 0 sectionDrafts for invalid tier input, got ${draft.sectionDrafts.length}.`,
    );
  }
  if (!hasDiagnosticCode(draft, "invalid_access_tier_for_free_preview_mapper")) {
    failures.push("Expected invalid_access_tier_for_free_preview_mapper diagnostic.");
  }
  if (draft.neverUserVisibleDiagnostics.length === 0) {
    failures.push("Expected at least one diagnostic for invalid tier input.");
  }
  // Diagnostics must be governance-only.
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Diagnostic "${diag.code}" must have neverUserVisible: true.`);
    }
  }
  // Applied forbidden moves and constraints should still be passed through.
  if (draft.appliedForbiddenMoves.length !== BASE_PAID_CONTRACT.forbiddenExplanationMoves.length) {
    failures.push("appliedForbiddenMoves should reflect contract even on invalid tier.");
  }

  notes.push("Case 5: invalid paid_explanation tier — validates diagnostic-only draft with no sections and no throw.");

  return { caseName: "invalid_paid_tier_input", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 6: Preview with human review recommendation ─────────────────────────

function runCase6(): FreePreviewMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    reviewFlags: [
      { flagId: "human_review_recommended", reasonCode: "scaffold_test" },
    ],
  };

  const input: RuntimeExplanationMapperInput = {
    simulationResult: simResult,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      freePreviewFields: {
        ...BASE_FREE_CONTRACT.freePreviewFields,
        humanReviewSuggested: true,
        attentionLevelPreview: "needs_review",
      },
    },
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.reviewPosture !== "human_review_recommended") {
    failures.push(`Expected reviewPosture "human_review_recommended", got "${draft.reviewPosture}".`);
  }
  if (!hasSectionType(draft, "review_recommendation")) {
    failures.push("Expected review_recommendation section when human review flag is active.");
  }
  // review_recommendation must only reference free preview fields.
  const reviewSection = draft.sectionDrafts.find(
    (s) => s.sectionType === "review_recommendation",
  );
  if (reviewSection) {
    for (const field of reviewSection.allowedContractFields) {
      // Only humanReviewSuggested is allowed in review_recommendation.
      if (field !== "humanReviewSuggested") {
        failures.push(`review_recommendation allowedContractFields must only contain "humanReviewSuggested", found "${field}".`);
      }
    }
  }
  assertNoPaidSections(draft, failures);
  assertNoProseLeakage(draft, failures);

  notes.push("Case 6: human review recommendation — validates review_recommendation section and reviewPosture.");

  return { caseName: "preview_human_review_flag", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 7: Preview with all major forbidden moves ────────────────────────────

function runCase7(): FreePreviewMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_FREE_CONTRACT,
      forbiddenExplanationMoves: [
        "no_deadline_calculation_when_forbidden",
        "no_enforcement_claim_when_forbidden",
        "no_autonomous_form_submission",
        "no_high_panic_phrasing",
        "no_cross_lane_merging",
        "no_definitive_legal_verdicts",
        "no_dry_run_as_fact",
        "no_speculation_as_fact",
        "no_guaranteed_outcomes",
        "no_tax_certainty",
        "no_immigration_certainty",
      ],
    },
    accessTier: "free_preview",
  };

  const draft = runFreePreviewMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "free_preview") {
    failures.push(`Expected accessTier "free_preview", got "${draft.accessTier}".`);
  }
  // All forbidden moves must be preserved.
  const expectedMoves = [
    "no_deadline_calculation_when_forbidden",
    "no_enforcement_claim_when_forbidden",
    "no_autonomous_form_submission",
  ] as const;
  for (const move of expectedMoves) {
    if (!draft.appliedForbiddenMoves.includes(move)) {
      failures.push(`Expected "${move}" in appliedForbiddenMoves.`);
    }
  }
  // Specific diagnostics must be emitted for each active suppression.
  const expectedDiagCodes = [
    "free_preview_deadline_detail_blocked",
    "free_preview_enforcement_claim_blocked",
    "free_preview_action_instruction_blocked",
    "free_preview_paid_field_blocked",
  ] as const;
  for (const code of expectedDiagCodes) {
    if (!hasDiagnosticCode(draft, code)) {
      failures.push(`Expected diagnostic code "${code}" to be present.`);
    }
  }
  // No paid-only sections must appear.
  assertNoPaidSections(draft, failures);
  // Base sections must still be present despite all forbidden moves.
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("document_overview must remain present even with all forbidden moves.");
  }
  if (!hasSectionType(draft, "payment_preview_limited")) {
    failures.push("payment_preview_limited must remain present (with restrictions).");
  }
  if (!hasSectionType(draft, "uncertainty_and_limits")) {
    failures.push("uncertainty_and_limits must remain present.");
  }
  // payment_preview_limited must have deadline block reason.
  if (
    hasSectionType(draft, "payment_preview_limited") &&
    !sectionHasBlockedCode(draft, "payment_preview_limited", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("payment_preview_limited must have blockedReasonCode for no_deadline_calculation_when_forbidden.");
  }
  assertNoProseLeakage(draft, failures);

  notes.push("Case 7: all major forbidden moves — validates all suppression diagnostics, no paid leakage, base sections preserved.");

  return { caseName: "preview_all_major_forbidden_moves", passed: failures.length === 0, draft, failures, notes };
}

// ── Scaffold entry ────────────────────────────────────────────────────────────

/**
 * Runs all seven free preview mapper regression cases and returns a structured
 * pass/fail summary.
 *
 * No Jest/Vitest. No CI wiring. No runtime integration.
 */
export function runFreePreviewMapperRegressionScaffold(): FreePreviewMapperRegressionScaffoldResult {
  const caseResults: FreePreviewMapperRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passedCount = caseResults.filter((r) => r.passed).length;
  const notes: string[] = [];

  if (allPassed) {
    notes.push(
      `Free preview mapper regression scaffold passed: all ${caseResults.length} case(s) produce governance-consistent free-preview drafts.`,
    );
  } else {
    const failed = caseResults.filter((r) => !r.passed);
    notes.push(
      `Free preview mapper regression: ${passedCount}/${caseResults.length} passed. Failed: ${failed.map((r) => r.caseName).join(", ")}.`,
    );
    for (const r of failed) {
      for (const f of r.failures) {
        notes.push(`  [${r.caseName}] ${f}`);
      }
    }
  }

  notes.push(
    "Scaffold validates structural governance only: no OCR, no LLM, no Smart Talk, no user-visible prose, no deadline calculation, no paid leakage.",
  );

  return {
    scaffoldVersion: FREE_PREVIEW_MAPPER_REGRESSION_VERSION,
    mapperVersion: FREE_PREVIEW_MAPPER_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
