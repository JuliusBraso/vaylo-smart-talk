/**
 * Smart Talk Bridge Dry Run regression scaffold (Phase 8.2F-6).
 *
 * Seven structural regression cases exercising the full bridge pipeline:
 *
 *  Case 1 — free preview basic dry run
 *  Case 2 — paid explanation basic dry run
 *  Case 3 — paid with required uncertainty constraint
 *  Case 4 — paid with human-review flag
 *  Case 5 — paid with deadline suppression forbidden move
 *  Case 6 — free preview with enforcement forbidden move
 *  Case 7 — paid with all major forbidden moves
 *
 * Each case asserts:
 *  - governancePreserved === true
 *  - structurallyValid === true
 *  - no prose in draft sections
 *  - no cross-tier leakage
 *  - contract governance arrays preserved in draft
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No user-visible prose. No LLM. No OCR. No Smart Talk wiring.
 */

import type { RealitySimulationResult } from "../reality-simulation-types";
import type {
  FreePreviewSimulationExplanationContract,
  PaidSimulationExplanationContract,
} from "./explanation-contract-types";
import type { SmartTalkBridgeDryRunResult } from "./explanation-mapper-types";
import {
  SMART_TALK_BRIDGE_DRY_RUN_VERSION,
  runSmartTalkBridgeDryRun,
} from "./run-smart-talk-bridge-dry-run";

export const SMART_TALK_BRIDGE_DRY_RUN_REGRESSION_VERSION =
  "8.2f-6-smart-talk-bridge-dry-run-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface SmartTalkBridgeDryRunRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly bridgeResult: SmartTalkBridgeDryRunResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface SmartTalkBridgeDryRunRegressionResult {
  readonly regressionVersion: string;
  readonly bridgeVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly SmartTalkBridgeDryRunRegressionCaseResult[];
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

// ── Case helpers ──────────────────────────────────────────────────────────────

function assertBridgeResult(
  caseName: string,
  result: SmartTalkBridgeDryRunResult,
  opts: {
    expectedMapperKind: "free_preview" | "paid_explanation";
    sectionsPresent?: readonly string[];
    sectionsAbsent?: readonly string[];
    governanceShouldBePreserved?: boolean;
    structuralShouldBeValid?: boolean;
    forbiddenMovesInDraft?: readonly string[];
    requiredConstraintsInDraft?: readonly string[];
    noProseCheck?: boolean;
    noLeakageCheck?: boolean;
  },
): SmartTalkBridgeDryRunRegressionCaseResult {
  const failures: string[] = [];
  const notes: string[] = [];

  const govPreserved = opts.governanceShouldBePreserved ?? true;
  const structValid = opts.structuralShouldBeValid ?? true;

  if (result.governancePreserved !== govPreserved) {
    failures.push(
      `governancePreserved expected=${String(govPreserved)}, got=${String(result.governancePreserved)}`,
    );
  }
  if (result.structurallyValid !== structValid) {
    failures.push(
      `structurallyValid expected=${String(structValid)}, got=${String(result.structurallyValid)}`,
    );
  }
  if (result.mapperKind !== opts.expectedMapperKind) {
    failures.push(
      `mapperKind expected="${opts.expectedMapperKind}", got="${result.mapperKind}"`,
    );
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on bridge result");
  }

  for (const expected of opts.sectionsPresent ?? []) {
    if (!result.draft.sectionDrafts.some((s) => s.sectionType === expected)) {
      failures.push(`Expected section "${expected}" to be present in draft`);
    }
  }

  for (const absent of opts.sectionsAbsent ?? []) {
    if (result.draft.sectionDrafts.some((s) => s.sectionType === absent)) {
      failures.push(`Section "${absent}" must NOT be present in draft`);
    }
  }

  // No prose: all sections must have neverContainsUserVisibleCopy === true.
  if (opts.noProseCheck !== false) {
    for (const section of result.draft.sectionDrafts) {
      if (!section.neverContainsUserVisibleCopy) {
        failures.push(
          `Section "${section.sectionType}" has neverContainsUserVisibleCopy !== true (prose safety violation)`,
        );
      }
      if (!section.sourceBound) {
        failures.push(
          `Section "${section.sectionType}" has sourceBound !== true (structural violation)`,
        );
      }
    }
  }

  // Contract forbidden moves must appear in draft.
  for (const move of opts.forbiddenMovesInDraft ?? []) {
    if (!result.draft.appliedForbiddenMoves.some((m) => m === move)) {
      failures.push(
        `Forbidden move "${move}" expected in draft.appliedForbiddenMoves`,
      );
    }
  }

  // Contract required constraints must appear in draft.
  for (const constraint of opts.requiredConstraintsInDraft ?? []) {
    if (!result.draft.appliedRequiredConstraints.some((c) => c === constraint)) {
      failures.push(
        `Required constraint "${constraint}" expected in draft.appliedRequiredConstraints`,
      );
    }
  }

  // No leakage check.
  if (opts.noLeakageCheck !== false) {
    const paidOnly = ["what_this_means", "attention_points", "next_steps_safe", "paid_deep_explanation"];
    const freeOnly = ["payment_preview_limited"];

    if (result.mapperKind === "free_preview") {
      for (const paid of paidOnly) {
        if (result.draft.sectionDrafts.some((s) => s.sectionType === paid)) {
          failures.push(`Leakage: free_preview draft contains paid-only section "${paid}"`);
        }
      }
    }
    if (result.mapperKind === "paid_explanation") {
      for (const free of freeOnly) {
        if (result.draft.sectionDrafts.some((s) => s.sectionType === free)) {
          failures.push(`Leakage: paid_explanation draft contains free-only section "${free}"`);
        }
      }
    }
  }

  const passed = failures.length === 0;
  notes.push(
    passed
      ? `Case "${caseName}" passed — bridge result structurally sound.`
      : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
  );

  return { caseName, passed, bridgeResult: result, failures, notes };
}

// ── Case 1 — free preview basic dry run ──────────────────────────────────────

function runCase1(): SmartTalkBridgeDryRunRegressionCaseResult {
  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "free_preview",
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_FREE_CONTRACT,
    dryRunContext: "regression_case_1_free_preview_basic",
  });

  return assertBridgeResult("free_preview_basic", result, {
    expectedMapperKind: "free_preview",
    sectionsPresent: ["document_overview", "payment_preview_limited", "uncertainty_and_limits"],
    sectionsAbsent: ["what_this_means", "attention_points", "next_steps_safe", "paid_deep_explanation"],
  });
}

// ── Case 2 — paid explanation basic dry run ───────────────────────────────────

function runCase2(): SmartTalkBridgeDryRunRegressionCaseResult {
  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "paid_explanation",
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: BASE_PAID_CONTRACT,
    dryRunContext: "regression_case_2_paid_basic",
  });

  return assertBridgeResult("paid_basic", result, {
    expectedMapperKind: "paid_explanation",
    sectionsPresent: ["document_overview", "what_this_means", "attention_points", "next_steps_safe", "paid_deep_explanation"],
    sectionsAbsent: ["payment_preview_limited"],
  });
}

// ── Case 3 — paid with required uncertainty constraint ────────────────────────

function runCase3(): SmartTalkBridgeDryRunRegressionCaseResult {
  const contract: PaidSimulationExplanationContract = {
    ...BASE_PAID_CONTRACT,
    requiredExplanationConstraints: ["required_uncertainty_wording"],
    uncertaintyRequirements: ["preserve_simulation_uncertainty_reasons"],
  };

  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "paid_explanation",
    simulationResult: { uncertaintyReasons: [{ code: "field_ambiguous" }] },
    explanationContract: contract,
    dryRunContext: "regression_case_3_paid_uncertainty_required",
  });

  const failures: string[] = [];
  const notes: string[] = [];
  const { draft } = result;

  if (!result.governancePreserved) failures.push("governancePreserved must be true");
  if (!result.structurallyValid) failures.push("structurallyValid must be true");
  if (result.mapperKind !== "paid_explanation") failures.push("mapperKind must be paid_explanation");

  if (!draft.appliedRequiredConstraints.includes("required_uncertainty_wording")) {
    failures.push('appliedRequiredConstraints must include "required_uncertainty_wording"');
  }

  if (
    draft.uncertaintyPosture !== "uncertainty_preserved" &&
    draft.uncertaintyPosture !== "high_consequence_uncertainty"
  ) {
    failures.push(
      `uncertaintyPosture expected "uncertainty_preserved" or "high_consequence_uncertainty", got "${draft.uncertaintyPosture}"`,
    );
  }

  // Section invariants.
  for (const section of draft.sectionDrafts) {
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" violates neverContainsUserVisibleCopy`);
    }
  }

  // No paid-only leakage.
  const freeOnly = ["payment_preview_limited"];
  for (const f of freeOnly) {
    if (draft.sectionDrafts.some((s) => s.sectionType === f)) {
      failures.push(`Leakage: paid draft contains free-only section "${f}"`);
    }
  }

  notes.push(
    failures.length === 0
      ? `Case "paid_uncertainty_required" passed — uncertainty posture preserved through bridge.`
      : `Case "paid_uncertainty_required" failed with ${String(failures.length)} failure(s).`,
  );

  return {
    caseName: "paid_uncertainty_required",
    passed: failures.length === 0,
    bridgeResult: result,
    failures,
    notes,
  };
}

// ── Case 4 — paid with human-review flag ─────────────────────────────────────

function runCase4(): SmartTalkBridgeDryRunRegressionCaseResult {
  const contract: PaidSimulationExplanationContract = {
    ...BASE_PAID_CONTRACT,
    freePreviewFields: {
      ...BASE_PAID_CONTRACT.freePreviewFields,
      humanReviewSuggested: true,
    },
    paidExplanationFields: {
      ...BASE_PAID_CONTRACT.paidExplanationFields,
      reviewFlags: [{ flagId: "human_review_recommended", reasonCode: "bridge_regression_case_4" }],
    },
  };

  const simResult: RealitySimulationResult = {
    reviewFlags: [{ flagId: "human_review_recommended", reasonCode: "bridge_regression_case_4" }],
  };

  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "paid_explanation",
    simulationResult: simResult,
    explanationContract: contract,
    dryRunContext: "regression_case_4_paid_human_review_flag",
  });

  const failures: string[] = [];
  const notes: string[] = [];
  const { draft } = result;

  if (!result.governancePreserved) failures.push("governancePreserved must be true");
  if (!result.structurallyValid) failures.push("structurallyValid must be true");
  if (result.mapperKind !== "paid_explanation") failures.push("mapperKind must be paid_explanation");

  const reviewPostures: string[] = [
    "review_suggested",
    "human_review_recommended",
    "professional_review_recommended",
  ];
  if (!reviewPostures.includes(draft.reviewPosture)) {
    failures.push(
      `reviewPosture expected one of [${reviewPostures.join(", ")}], got "${draft.reviewPosture}"`,
    );
  }

  if (!draft.sectionDrafts.some((s) => s.sectionType === "review_recommendation")) {
    failures.push('Section "review_recommendation" must be present when review flags are raised');
  }

  for (const section of draft.sectionDrafts) {
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" violates neverContainsUserVisibleCopy`);
    }
  }

  notes.push(
    failures.length === 0
      ? `Case "paid_human_review_flag" passed — review posture propagated through bridge.`
      : `Case "paid_human_review_flag" failed with ${String(failures.length)} failure(s).`,
  );

  return {
    caseName: "paid_human_review_flag",
    passed: failures.length === 0,
    bridgeResult: result,
    failures,
    notes,
  };
}

// ── Case 5 — paid with deadline suppression forbidden move ────────────────────

function runCase5(): SmartTalkBridgeDryRunRegressionCaseResult {
  const contract: PaidSimulationExplanationContract = {
    ...BASE_PAID_CONTRACT,
    forbiddenExplanationMoves: ["no_deadline_calculation_when_forbidden"],
  };

  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "paid_explanation",
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: contract,
    dryRunContext: "regression_case_5_paid_deadline_suppression",
  });

  return assertBridgeResult("paid_deadline_suppression", result, {
    expectedMapperKind: "paid_explanation",
    sectionsAbsent: ["payment_preview_limited"],
    forbiddenMovesInDraft: ["no_deadline_calculation_when_forbidden"],
  });
}

// ── Case 6 — free preview with enforcement forbidden move ─────────────────────

function runCase6(): SmartTalkBridgeDryRunRegressionCaseResult {
  const contract: FreePreviewSimulationExplanationContract = {
    ...BASE_FREE_CONTRACT,
    forbiddenExplanationMoves: ["no_enforcement_claim_when_forbidden"],
  };

  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "free_preview",
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: contract,
    dryRunContext: "regression_case_6_free_preview_enforcement_forbidden",
  });

  return assertBridgeResult("free_preview_enforcement_forbidden", result, {
    expectedMapperKind: "free_preview",
    sectionsPresent: ["document_overview", "payment_preview_limited", "uncertainty_and_limits"],
    sectionsAbsent: ["what_this_means", "attention_points", "next_steps_safe", "paid_deep_explanation"],
    forbiddenMovesInDraft: ["no_enforcement_claim_when_forbidden"],
  });
}

// ── Case 7 — paid with all major forbidden moves ──────────────────────────────

function runCase7(): SmartTalkBridgeDryRunRegressionCaseResult {
  const allMajorMoves = [
    "no_deadline_calculation_when_forbidden",
    "no_enforcement_claim_when_forbidden",
    "no_definitive_legal_verdicts",
    "no_autonomous_form_submission",
    "no_guaranteed_outcomes",
  ] as const;

  const contract: PaidSimulationExplanationContract = {
    ...BASE_PAID_CONTRACT,
    forbiddenExplanationMoves: [...allMajorMoves],
    requiredExplanationConstraints: ["required_uncertainty_wording"],
  };

  const result = runSmartTalkBridgeDryRun({
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    accessTier: "paid_explanation",
    simulationResult: EMPTY_SIM_RESULT,
    explanationContract: contract,
    dryRunContext: "regression_case_7_paid_all_major_forbidden_moves",
    auditTraceRef: "bridge-dry-run-regression-case-7",
  });

  const draft = result.draft;
  const failures: string[] = [];
  const notes: string[] = [];

  if (!result.governancePreserved) failures.push("governancePreserved must be true");
  if (!result.structurallyValid) failures.push("structurallyValid must be true");
  if (result.mapperKind !== "paid_explanation") failures.push("mapperKind must be paid_explanation");
  if (!result.neverUserVisible) failures.push("neverUserVisible must be true");

  // All major forbidden moves must survive the full pipeline.
  for (const move of allMajorMoves) {
    if (!draft.appliedForbiddenMoves.includes(move)) {
      failures.push(`Forbidden move "${move}" must be in draft.appliedForbiddenMoves`);
    }
  }

  // Required constraint must survive.
  if (!draft.appliedRequiredConstraints.includes("required_uncertainty_wording")) {
    failures.push('Required constraint "required_uncertainty_wording" must be in draft.appliedRequiredConstraints');
  }

  // No paid-tier leakage of free-only sections.
  if (draft.sectionDrafts.some((s) => s.sectionType === "payment_preview_limited")) {
    failures.push('Leakage: paid draft must not contain free-only section "payment_preview_limited"');
  }

  // All sections must preserve structural invariants.
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      failures.push(`Section "${section.sectionType}" violates sourceBound invariant`);
    }
    if (!section.neverContainsUserVisibleCopy) {
      failures.push(`Section "${section.sectionType}" violates neverContainsUserVisibleCopy invariant`);
    }
  }

  // All mapper diagnostics must be neverUserVisible.
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Mapper diagnostic code="${diag.code}" violates neverUserVisible invariant`);
    }
  }

  // Bridge result diagnostics must also be neverUserVisible.
  for (const diag of result.diagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Bridge diagnostic code="${diag.code}" violates neverUserVisible invariant`);
    }
  }

  notes.push(
    failures.length === 0
      ? `Case "paid_all_major_forbidden_moves" passed — all ${String(allMajorMoves.length)} forbidden moves and all governance constraints preserved through full bridge pipeline.`
      : `Case "paid_all_major_forbidden_moves" failed with ${String(failures.length)} failure(s).`,
  );

  return {
    caseName: "paid_all_major_forbidden_moves",
    passed: failures.length === 0,
    bridgeResult: result,
    failures,
    notes,
  };
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Executes all 7 Smart Talk Bridge Dry Run regression cases and aggregates
 * the results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No prose generated. No LLM. No OCR. No Smart Talk runtime.
 */
export function runSmartTalkBridgeDryRunRegression(): SmartTalkBridgeDryRunRegressionResult {
  const caseResults: SmartTalkBridgeDryRunRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Smart Talk Bridge Dry Run regression complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All bridge pipeline routes, structural invariants, governance preservation checks, leakage checks, and neverUserVisible guarantees validated.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review bridgeResult diagnostics for details.`,
    );
  }

  notes.push(
    "Regression is dry-run only: no prose generated, no LLM called, no OCR accessed, no Smart Talk production wiring.",
  );

  return {
    regressionVersion: SMART_TALK_BRIDGE_DRY_RUN_REGRESSION_VERSION,
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
