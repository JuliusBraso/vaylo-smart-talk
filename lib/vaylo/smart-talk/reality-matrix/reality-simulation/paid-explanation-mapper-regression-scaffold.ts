/**
 * Paid Explanation Mapper regression scaffold (Phase 8.2F-4).
 *
 * Nine structural regression cases validating paid-tier governance constraints.
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
  PAID_EXPLANATION_MAPPER_VERSION,
  runPaidExplanationMapper,
} from "./run-paid-explanation-mapper";

export const PAID_EXPLANATION_MAPPER_REGRESSION_VERSION =
  "8.2f-15c-paid-explanation-mapper-regression-scaffold-v2";

// ── Result types ──────────────────────────────────────────────────────────────

export interface PaidExplanationMapperRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly draft: RuntimeExplanationDraft;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface PaidExplanationMapperRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly mapperVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly PaidExplanationMapperRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixtures ───────────────────────────────────────────────────────────

const EMPTY_SIM_RESULT: RealitySimulationResult = {};

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

// ── Assertion helpers ─────────────────────────────────────────────────────────

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

function assertProseInvariants(draft: RuntimeExplanationDraft, failures: string[]): void {
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      failures.push(`Section "${section.sectionType}" must have sourceBound: true.`);
    }
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" must have neverContainsUserVisibleCopy: true.`);
    }
    if (section.accessTier !== "paid_explanation") {
      failures.push(`Section "${section.sectionType}" must have accessTier "paid_explanation", got "${section.accessTier}".`);
    }
  }
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Diagnostic "${diag.code}" must have neverUserVisible: true.`);
    }
  }
}

function assertNoFreeOnlySections(draft: RuntimeExplanationDraft, failures: string[]): void {
  if (hasSectionType(draft, "payment_preview_limited")) {
    failures.push("payment_preview_limited must never appear in paid_explanation draft.");
  }
}

// ── Case 1: Basic paid explanation ────────────────────────────────────────────

function runCase1(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_PAID_CONTRACT,
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "paid_explanation") {
    failures.push(`Expected accessTier "paid_explanation", got "${draft.accessTier}".`);
  }
  // All base paid sections should be present with no forbidden moves.
  const expectedSections: RuntimeExplanationSectionType[] = [
    "document_overview",
    "what_this_means",
    "attention_points",
    "next_steps_safe",
    "uncertainty_and_limits",
    "paid_deep_explanation",
  ];
  for (const sectionType of expectedSections) {
    if (!hasSectionType(draft, sectionType)) {
      failures.push(`Expected section "${sectionType}" to be present.`);
    }
  }
  // No review section when no review flags.
  if (hasSectionType(draft, "review_recommendation")) {
    failures.push("review_recommendation must not appear when no review flags are active.");
  }
  if (draft.uncertaintyPosture !== "unknown") {
    failures.push(`Expected uncertaintyPosture "unknown", got "${draft.uncertaintyPosture}".`);
  }
  if (draft.reviewPosture !== "none") {
    failures.push(`Expected reviewPosture "none", got "${draft.reviewPosture}".`);
  }
  if (draft.draftVersion !== "8.2f-2-runtime-explanation-draft-v1") {
    failures.push(`Unexpected draftVersion "${draft.draftVersion}".`);
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 1: basic paid explanation — all base sections present, no restrictions, correct tier and posture.");

  return { caseName: "basic_paid_explanation", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 2: Paid with uncertainty requirement ─────────────────────────────────

function runCase2(): PaidExplanationMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    uncertaintyReasons: [
      { code: "scaffold_uncertainty", detail: "artificial uncertainty for scaffold" },
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

  const draft = runPaidExplanationMapper(input);
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
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 2: uncertainty requirement — uncertainty_preserved posture, all sections uncertaintyPreserved: true.");

  return { caseName: "paid_uncertainty_required", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 3: Paid with deadline forbidden ──────────────────────────────────────

function runCase3(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: ["no_deadline_calculation_when_forbidden"],
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_deadline_calculation_when_forbidden")) {
    failures.push("Expected no_deadline_calculation_when_forbidden in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "paid_deadline_output_blocked")) {
    failures.push("Expected paid_deadline_output_blocked diagnostic.");
  }
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedCode(draft, "paid_deep_explanation", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("paid_deep_explanation must have blockedReasonCode for no_deadline_calculation_when_forbidden.");
  }
  // next_steps_safe is also restricted by deadline forbidden.
  if (
    hasSectionType(draft, "next_steps_safe") &&
    !sectionHasBlockedCode(draft, "next_steps_safe", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("next_steps_safe must have blockedReasonCode for no_deadline_calculation_when_forbidden.");
  }
  // document_overview must remain unaffected.
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("document_overview must remain present.");
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 3: deadline forbidden — paid_deadline_output_blocked diagnostic, paid_deep_explanation and next_steps_safe restricted.");

  return { caseName: "paid_deadline_forbidden", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 4: Paid with enforcement forbidden ───────────────────────────────────

function runCase4(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: ["no_enforcement_claim_when_forbidden"],
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_enforcement_claim_when_forbidden")) {
    failures.push("Expected no_enforcement_claim_when_forbidden in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "paid_enforcement_claim_blocked")) {
    failures.push("Expected paid_enforcement_claim_blocked diagnostic.");
  }
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedCode(draft, "paid_deep_explanation", "no_enforcement_claim_when_forbidden")
  ) {
    failures.push("paid_deep_explanation must have blockedReasonCode for no_enforcement_claim_when_forbidden.");
  }
  if (
    hasSectionType(draft, "attention_points") &&
    !sectionHasBlockedCode(draft, "attention_points", "no_enforcement_claim_when_forbidden")
  ) {
    failures.push("attention_points must have blockedReasonCode for no_enforcement_claim_when_forbidden.");
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 4: enforcement forbidden — paid_enforcement_claim_blocked diagnostic, paid_deep_explanation and attention_points restricted.");

  return { caseName: "paid_enforcement_forbidden", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 5: Paid with legal-verdict forbidden ─────────────────────────────────

function runCase5(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: ["no_definitive_legal_verdicts"],
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_definitive_legal_verdicts")) {
    failures.push("Expected no_definitive_legal_verdicts in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "paid_legal_verdict_blocked")) {
    failures.push("Expected paid_legal_verdict_blocked diagnostic.");
  }
  if (
    hasSectionType(draft, "what_this_means") &&
    !sectionHasBlockedCode(draft, "what_this_means", "no_definitive_legal_verdicts")
  ) {
    failures.push("what_this_means must have blockedReasonCode for no_definitive_legal_verdicts.");
  }
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedCode(draft, "paid_deep_explanation", "no_definitive_legal_verdicts")
  ) {
    failures.push("paid_deep_explanation must have blockedReasonCode for no_definitive_legal_verdicts.");
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 5: legal verdict forbidden — paid_legal_verdict_blocked diagnostic, what_this_means and paid_deep_explanation restricted.");

  return { caseName: "paid_legal_verdict_forbidden", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 6: Paid with human review recommendation ─────────────────────────────

function runCase6(): PaidExplanationMapperRegressionCaseResult {
  const simResult: RealitySimulationResult = {
    reviewFlags: [
      { flagId: "human_review_recommended", reasonCode: "scaffold_test" },
    ],
  };

  const input: RuntimeExplanationMapperInput = {
    simulationResult: simResult,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      freePreviewFields: {
        ...BASE_PAID_CONTRACT.freePreviewFields,
        humanReviewSuggested: true,
        attentionLevelPreview: "needs_review",
      },
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.reviewPosture !== "human_review_recommended") {
    failures.push(`Expected reviewPosture "human_review_recommended", got "${draft.reviewPosture}".`);
  }
  if (!hasSectionType(draft, "review_recommendation")) {
    failures.push("Expected review_recommendation section when human review flag is active.");
  }
  // review_recommendation must reference only humanReviewSuggested and reviewFlags.
  const reviewSection = draft.sectionDrafts.find(
    (s) => s.sectionType === "review_recommendation",
  );
  if (reviewSection) {
    for (const field of reviewSection.allowedContractFields) {
      if (field !== "humanReviewSuggested" && field !== "reviewFlags") {
        failures.push(
          `review_recommendation allowedContractFields must only contain "humanReviewSuggested" or "reviewFlags", found "${field}".`,
        );
      }
    }
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 6: human review recommendation — review_recommendation section, human_review_recommended posture.");

  return { caseName: "paid_human_review_flag", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 7: Paid with cross-lane suppression ──────────────────────────────────

function runCase7(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: ["no_cross_lane_merging"],
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (!draft.appliedForbiddenMoves.includes("no_cross_lane_merging")) {
    failures.push("Expected no_cross_lane_merging in appliedForbiddenMoves.");
  }
  if (!hasDiagnosticCode(draft, "paid_cross_lane_merge_blocked")) {
    failures.push("Expected paid_cross_lane_merge_blocked diagnostic.");
  }
  if (
    hasSectionType(draft, "what_this_means") &&
    !sectionHasBlockedCode(draft, "what_this_means", "no_cross_lane_merging")
  ) {
    failures.push("what_this_means must have blockedReasonCode for no_cross_lane_merging.");
  }
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedCode(draft, "paid_deep_explanation", "no_cross_lane_merging")
  ) {
    failures.push("paid_deep_explanation must have blockedReasonCode for no_cross_lane_merging.");
  }
  // attention_points and next_steps_safe should not be affected by cross-lane.
  const attn = draft.sectionDrafts.find((s) => s.sectionType === "attention_points");
  if (attn?.blockedReasonCodes?.some((c) => c.includes("no_cross_lane_merging"))) {
    failures.push("attention_points should not have blockedReasonCode for no_cross_lane_merging.");
  }
  assertNoFreeOnlySections(draft, failures);
  assertProseInvariants(draft, failures);

  notes.push("Case 7: cross-lane suppression — paid_cross_lane_merge_blocked diagnostic, what_this_means and paid_deep_explanation restricted.");

  return { caseName: "paid_cross_lane_suppression", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 8: Invalid free_preview tier input ───────────────────────────────────

function runCase8(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_FREE_CONTRACT,
    accessTier: "free_preview",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  // No sections must be produced.
  if (draft.sectionDrafts.length !== 0) {
    failures.push(
      `Expected 0 sectionDrafts for invalid tier input, got ${draft.sectionDrafts.length}.`,
    );
  }
  if (!hasDiagnosticCode(draft, "invalid_access_tier_for_paid_explanation_mapper")) {
    failures.push("Expected invalid_access_tier_for_paid_explanation_mapper diagnostic.");
  }
  if (draft.neverUserVisibleDiagnostics.length === 0) {
    failures.push("Expected at least one diagnostic for invalid tier input.");
  }
  // Forbidden moves should be passed through from contract.
  if (draft.appliedForbiddenMoves.length !== BASE_FREE_CONTRACT.forbiddenExplanationMoves.length) {
    failures.push("appliedForbiddenMoves should reflect contract even on invalid tier.");
  }
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Diagnostic "${diag.code}" must have neverUserVisible: true.`);
    }
  }

  notes.push("Case 8: invalid free_preview tier — diagnostic-only draft, zero sections, no throw.");

  return { caseName: "invalid_free_preview_tier_input", passed: failures.length === 0, draft, failures, notes };
}

// ── Case 9: Paid with all major forbidden moves (8.2F-15C: expanded + specific codes) ──

function runCase9(): PaidExplanationMapperRegressionCaseResult {
  const input: RuntimeExplanationMapperInput = {
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: {
      ...BASE_PAID_CONTRACT,
      forbiddenExplanationMoves: [
        "no_autonomous_form_submission",
        "no_deadline_calculation_when_forbidden",
        "no_enforcement_claim_when_forbidden",
        "no_definitive_legal_verdicts",
        "no_cross_lane_merging",
        "no_high_panic_phrasing",
        "no_dry_run_as_fact",
        "no_speculation_as_fact",
        "no_guaranteed_outcomes",
        "no_tax_certainty",
        "no_immigration_certainty",
        // 8.2F-15A/15C: new moves with dedicated diagnostics
        "no_false_reassurance_framing",
        "no_calculated_amount_extraction",
      ],
    },
    accessTier: "paid_explanation",
  };

  const draft = runPaidExplanationMapper(input);
  const failures: string[] = [];
  const notes: string[] = [];

  if (draft.accessTier !== "paid_explanation") {
    failures.push(`Expected accessTier "paid_explanation", got "${draft.accessTier}".`);
  }
  // next_steps_safe must be excluded by no_autonomous_form_submission.
  if (hasSectionType(draft, "next_steps_safe")) {
    failures.push("next_steps_safe must be excluded when no_autonomous_form_submission is active.");
  }
  // 8.2F-4 diagnostic codes (retained, semantically narrowed in 8.2F-15C).
  const retained4Codes = [
    "paid_autonomous_action_blocked",    // no_autonomous_form_submission only
    "paid_deadline_output_blocked",      // no_deadline_calculation_when_forbidden
    "paid_enforcement_claim_blocked",    // no_enforcement_claim_when_forbidden
    "paid_legal_verdict_blocked",        // no_definitive_legal_verdicts only (narrowed)
    "paid_cross_lane_merge_blocked",     // no_cross_lane_merging
  ] as const;
  for (const code of retained4Codes) {
    if (!hasDiagnosticCode(draft, code)) {
      failures.push(`Expected diagnostic code "${code}" to be present.`);
    }
  }
  // 8.2F-15C diagnostic codes: new specific codes replacing paid_legal_verdict_blocked overload.
  const new15cCodes = [
    "paid_guaranteed_outcome_blocked",       // no_guaranteed_outcomes
    "paid_tax_certainty_blocked",            // no_tax_certainty
    "paid_immigration_certainty_blocked",    // no_immigration_certainty
    "paid_truthfulness_blocked",             // no_dry_run_as_fact | no_speculation_as_fact
    "paid_panic_phrasing_blocked",          // no_high_panic_phrasing
    "paid_false_reassurance_blocked",        // no_false_reassurance_framing
    "paid_calculated_amount_blocked",        // no_calculated_amount_extraction
    "paid_section_excluded_by_forbidden_move", // generic section-exclusion notification
  ] as const;
  for (const code of new15cCodes) {
    if (!hasDiagnosticCode(draft, code)) {
      failures.push(`Expected diagnostic code "${code}" to be present (8.2F-15C specific code).`);
    }
  }
  // Restricted sections must have blocked reason codes.
  if (
    hasSectionType(draft, "paid_deep_explanation") &&
    !sectionHasBlockedCode(draft, "paid_deep_explanation", "no_deadline_calculation_when_forbidden")
  ) {
    failures.push("paid_deep_explanation must have blocked reason for no_deadline_calculation_when_forbidden.");
  }
  if (
    hasSectionType(draft, "what_this_means") &&
    !sectionHasBlockedCode(draft, "what_this_means", "no_definitive_legal_verdicts")
  ) {
    failures.push("what_this_means must have blocked reason for no_definitive_legal_verdicts.");
  }
  if (
    hasSectionType(draft, "attention_points") &&
    !sectionHasBlockedCode(draft, "attention_points", "no_enforcement_claim_when_forbidden")
  ) {
    failures.push("attention_points must have blocked reason for no_enforcement_claim_when_forbidden.");
  }
  // no_false_reassurance_framing and no_calculated_amount_extraction restrict what_this_means.
  if (
    hasSectionType(draft, "what_this_means") &&
    !sectionHasBlockedCode(draft, "what_this_means", "no_false_reassurance_framing")
  ) {
    failures.push("what_this_means must have blocked reason for no_false_reassurance_framing.");
  }
  if (
    hasSectionType(draft, "what_this_means") &&
    !sectionHasBlockedCode(draft, "what_this_means", "no_calculated_amount_extraction")
  ) {
    failures.push("what_this_means must have blocked reason for no_calculated_amount_extraction.");
  }
  // payment_preview_limited must never appear.
  assertNoFreeOnlySections(draft, failures);
  // document_overview must still be present.
  if (!hasSectionType(draft, "document_overview")) {
    failures.push("document_overview must remain present even with all forbidden moves.");
  }
  assertProseInvariants(draft, failures);

  notes.push(
    "Case 9 (8.2F-15C): all major forbidden moves incl. no_false_reassurance_framing and no_calculated_amount_extraction — " +
    "next_steps_safe excluded, original 5 diagnostic codes present (narrowed semantics), " +
    "8.2F-15C specific codes present, restricted sections have blocked reason codes.",
  );

  return { caseName: "paid_all_major_forbidden_moves", passed: failures.length === 0, draft, failures, notes };
}

// ── Scaffold entry ────────────────────────────────────────────────────────────

/**
 * Runs all nine paid explanation mapper regression cases and returns a structured
 * pass/fail summary.
 *
 * No Jest/Vitest. No CI wiring. No runtime integration.
 */
export function runPaidExplanationMapperRegressionScaffold(): PaidExplanationMapperRegressionScaffoldResult {
  const caseResults: PaidExplanationMapperRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
    runCase9(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passedCount = caseResults.filter((r) => r.passed).length;
  const notes: string[] = [];

  if (allPassed) {
    notes.push(
      `Paid explanation mapper regression scaffold passed: all ${caseResults.length} case(s) produce governance-consistent paid drafts.`,
    );
  } else {
    const failed = caseResults.filter((r) => !r.passed);
    notes.push(
      `Paid explanation mapper regression: ${passedCount}/${caseResults.length} passed. Failed: ${failed.map((r) => r.caseName).join(", ")}.`,
    );
    for (const r of failed) {
      for (const f of r.failures) {
        notes.push(`  [${r.caseName}] ${f}`);
      }
    }
  }

  notes.push(
    "Scaffold validates structural governance only: no OCR, no LLM, no Smart Talk, no user-visible prose, no deadline calculation, no unrestricted extraction.",
  );

  return {
    scaffoldVersion: PAID_EXPLANATION_MAPPER_REGRESSION_VERSION,
    mapperVersion: PAID_EXPLANATION_MAPPER_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
