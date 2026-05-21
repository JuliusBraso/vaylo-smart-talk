/**
 * Scenario → Explanation Contract expectation validator (Phase 8.2E-3).
 *
 * Pure validation helper only:
 * - no OCR
 * - no LLM calls
 * - no Smart Talk wiring
 * - no runtime simulation integration
 * - no generated explanations
 * - no deadline calculation
 * - no legal conclusions
 * - no payment logic
 *
 * Validates whether each scenario's declared expectations are aligned with the
 * Simulation → Explanation Contract safety rules (8.2D-6):
 *
 *   (a) Free preview field restriction — mustNotEmit "leak-risk" values must
 *       have corresponding forbidden-move protection (hard rule).
 *   (b) Free preview leakage risk — completely unprotected high-risk mustNotEmit
 *       values (hard rule).
 *   (c) Monetization boundary defense-in-depth — forbidden move present but
 *       corresponding boundary absent for dual-protection values (soft warning).
 *   (d) Paid explanation overreach — high-consequence domain + high severity
 *       without uncertainty constraint (soft warning).
 *   (e) False reassurance — false_reassurance in mustNotEmit without soft
 *       governance protection (soft warning).
 *   (f) Required constraint coverage — uncertainty-critical scenario kinds
 *       without required_uncertainty_wording in expected constraints (soft warning).
 *
 * Does NOT build a real contract, compare against runtime output, connect to
 * Smart Talk, OCR, LLMs, payment, or production runtime.
 */

import type {
  ControlledCorpusExpectedBoundaryId,
  ControlledCorpusExpectedForbiddenMove,
  ControlledCorpusMustNotEmit,
  ControlledCorpusRiskDomain,
  ControlledCorpusExpectedSeverityPosture,
  ControlledCorpusScenarioKind,
  ControlledCorpusScenario,
} from "./corpus-types";

// ── Rule tables ───────────────────────────────────────────────────────────────
// All rules are explicit. Do not infer from token names or legal semantics.

/**
 * Hard rules: for each "free-preview-dangerous" mustNotEmit value, the scenario
 * must have the corresponding forbidden move in expectedForbiddenMoves.
 *
 * These protect the FreePreviewFields contract layer from leaking:
 * exact deadlines, legal verdicts, enforcement/immigration/tax certainty,
 * guaranteed outcomes, autonomous action instructions, panic language, or
 * calculated amounts.
 */
interface FreePrevieForbiddenRule {
  readonly mustNotEmitValue: ControlledCorpusMustNotEmit;
  readonly requiredForbiddenMove: ControlledCorpusExpectedForbiddenMove;
}

const FREE_PREVIEW_FORBIDDEN_RULES: readonly FreePrevieForbiddenRule[] = [
  {
    mustNotEmitValue: "exact_deadline",
    requiredForbiddenMove: "no_deadline_calculation_when_forbidden",
  },
  {
    mustNotEmitValue: "legal_verdict",
    requiredForbiddenMove: "no_definitive_legal_verdicts",
  },
  {
    mustNotEmitValue: "enforcement_certainty",
    requiredForbiddenMove: "no_enforcement_claim_when_forbidden",
  },
  {
    mustNotEmitValue: "immigration_certainty",
    requiredForbiddenMove: "no_immigration_certainty",
  },
  {
    mustNotEmitValue: "tax_certainty",
    requiredForbiddenMove: "no_tax_certainty",
  },
  {
    mustNotEmitValue: "guaranteed_outcome",
    requiredForbiddenMove: "no_guaranteed_outcomes",
  },
  {
    mustNotEmitValue: "autonomous_action_instruction",
    requiredForbiddenMove: "no_autonomous_form_submission",
  },
  {
    mustNotEmitValue: "panic_language",
    requiredForbiddenMove: "no_high_panic_phrasing",
  },
  {
    mustNotEmitValue: "calculated_amount",
    // Closest proxy: deadline-calculation gate also covers computed amount risk
    requiredForbiddenMove: "no_deadline_calculation_when_forbidden",
  },
];

/** The set of mustNotEmit values covered by FREE_PREVIEW_FORBIDDEN_RULES. */
const FREE_PREVIEW_RISK_VALUES: ReadonlySet<string> = new Set<ControlledCorpusMustNotEmit>(
  FREE_PREVIEW_FORBIDDEN_RULES.map((r) => r.mustNotEmitValue),
);

/**
 * Soft rules (monetization defense-in-depth): for these mustNotEmit values, the
 * scenario should protect at BOTH the boundary layer AND the forbidden-move layer
 * to prevent free preview leakage through the paid explanation contract tier.
 */
interface MonetizationDefenseRule {
  readonly mustNotEmitValue: ControlledCorpusMustNotEmit;
  readonly requiredBoundary: ControlledCorpusExpectedBoundaryId;
}

const MONETIZATION_DEFENSE_IN_DEPTH_RULES: readonly MonetizationDefenseRule[] = [
  {
    mustNotEmitValue: "exact_deadline",
    requiredBoundary: "do_not_calculate_deadline",
  },
  {
    mustNotEmitValue: "enforcement_certainty",
    requiredBoundary: "do_not_claim_enforcement",
  },
];

/** High-consequence risk domains requiring uncertainty protection at paid tier. */
const HIGH_RISK_DOMAINS: ReadonlySet<ControlledCorpusRiskDomain> = new Set<ControlledCorpusRiskDomain>([
  "enforcement",
  "immigration",
  "tax",
  "benefits",
]);

/** Severity levels that trigger paid overreach checks. */
const HIGH_RISK_SEVERITY: ReadonlySet<ControlledCorpusExpectedSeverityPosture> =
  new Set<ControlledCorpusExpectedSeverityPosture>(["high", "critical"]);

/**
 * Scenario kinds where uncertainty-critical governance is structurally required
 * by the contract layer. Scenarios of these kinds must declare
 * required_uncertainty_wording in expectedRequiredConstraints.
 */
const UNCERTAINTY_CRITICAL_KINDS: ReadonlySet<ControlledCorpusScenarioKind> =
  new Set<ControlledCorpusScenarioKind>([
    "ambiguous",
    "deadline_ambiguity",
    "ocr_noise_simulated",
  ]);

// ── Result types ──────────────────────────────────────────────────────────────

export interface ScenarioContractForbiddenMoveMissing {
  readonly scenarioId: string;
  readonly mustNotEmitValue: string;
  readonly missingForbiddenMove: string;
}

export interface ScenarioContractMonetizationGap {
  readonly scenarioId: string;
  readonly mustNotEmitValue: string;
  readonly missingBoundary: string;
  readonly note: string;
}

export interface ScenarioContractExpectationValidationResult {
  /**
   * Hard validity: no scenario has a free-preview-dangerous mustNotEmit value
   * without the corresponding forbidden move, AND no completely-unprotected
   * high-risk mustNotEmit value exists.
   */
  readonly valid: boolean;
  /**
   * Full consistency: `valid` AND no soft warnings across any scenario.
   *
   * Semantic tiers (8.2E-3):
   *   valid            = free preview restriction rules satisfied (hard)
   *   fullyConsistent  = valid + monetization defense-in-depth
   *                       + paid overreach protection + false reassurance
   *                       + required constraint coverage
   */
  readonly fullyConsistent: boolean;
  readonly scenarioCount: number;
  /**
   * Scenario ids where a required forbidden move is missing for a
   * free-preview-dangerous mustNotEmit value (hard failure).
   */
  readonly scenariosMissingForbiddenMoveCoverage: readonly string[];
  /**
   * Scenario ids where a high-risk mustNotEmit value has NO protection at all:
   * neither a forbidden move, a boundary, nor a review flag (hard failure).
   */
  readonly scenariosWithFreePreviewLeakageRisk: readonly string[];
  /**
   * Scenario ids where required constraint coverage is missing for
   * uncertainty-critical scenario kinds (soft warning).
   */
  readonly scenariosMissingRequiredConstraintCoverage: readonly string[];
  /**
   * Scenario ids where the forbidden move is present but the corresponding
   * boundary token is absent for dual-protection mustNotEmit values (soft warning).
   */
  readonly scenariosWithMonetizationBoundaryWarnings: readonly string[];
  /**
   * Scenario ids in high-risk domains with high/critical severity that lack
   * any uncertainty constraint in expectedRequiredConstraints (soft warning).
   */
  readonly scenariosWithPaidContractOverreachRisk: readonly string[];
  /**
   * Scenario ids where false_reassurance is in mustNotEmit but no soft governance
   * protection is present (soft warning).
   */
  readonly scenariosWithFalseReassuranceWarnings: readonly string[];
  /** Detailed entries for forbidden-move coverage failures. */
  readonly forbiddenMoveCoverageDetails: readonly ScenarioContractForbiddenMoveMissing[];
  /** Detailed entries for monetization boundary defense-in-depth gaps. */
  readonly monetizationBoundaryDetails: readonly ScenarioContractMonetizationGap[];
  readonly notes: readonly string[];
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates corpus scenario expectations against the Simulation → Explanation
 * Contract safety rules from Phase 8.2D-6.
 *
 * Does not build a SimulationExplanationContract, does not invoke runtime
 * simulation, and does not connect to Smart Talk, OCR, LLMs, or payment.
 */
export function validateScenarioContractExpectations({
  scenarios,
}: {
  readonly scenarios: readonly ControlledCorpusScenario[];
}): ScenarioContractExpectationValidationResult {
  const scenariosMissingForbiddenMoveCoverage: string[] = [];
  const scenariosWithFreePreviewLeakageRisk: string[] = [];
  const scenariosMissingRequiredConstraintCoverage: string[] = [];
  const scenariosWithMonetizationBoundaryWarnings: string[] = [];
  const scenariosWithPaidContractOverreachRisk: string[] = [];
  const scenariosWithFalseReassuranceWarnings: string[] = [];
  const forbiddenMoveCoverageDetails: ScenarioContractForbiddenMoveMissing[] = [];
  const monetizationBoundaryDetails: ScenarioContractMonetizationGap[] = [];

  for (const scenario of scenarios) {
    const mustNotEmitSet = new Set<string>(scenario.mustNotEmit ?? []);
    const forbiddenMoveSet = new Set<string>(scenario.expectedForbiddenMoves ?? []);
    const boundarySet = new Set<string>(scenario.expectedBoundaryIds ?? []);
    const reviewFlagSet = new Set<string>(scenario.expectedReviewFlags ?? []);
    const requiredConstraintSet = new Set<string>(scenario.expectedRequiredConstraints ?? []);

    // ── (a) Free preview forbidden-move coverage (hard) ──────────────────────
    let hasMissingForbiddenMove = false;
    for (const rule of FREE_PREVIEW_FORBIDDEN_RULES) {
      if (!mustNotEmitSet.has(rule.mustNotEmitValue)) continue;
      if (!forbiddenMoveSet.has(rule.requiredForbiddenMove)) {
        forbiddenMoveCoverageDetails.push({
          scenarioId: scenario.id,
          mustNotEmitValue: rule.mustNotEmitValue,
          missingForbiddenMove: rule.requiredForbiddenMove,
        });
        hasMissingForbiddenMove = true;
      }
    }
    if (hasMissingForbiddenMove) {
      scenariosMissingForbiddenMoveCoverage.push(scenario.id);
    }

    // ── (b) Free preview leakage risk — completely unprotected (hard) ─────────
    // Unprotected means: no required forbidden move AND no boundary token AND no review flag.
    const unprotectedLeakValues = [...mustNotEmitSet]
      .filter((v) => FREE_PREVIEW_RISK_VALUES.has(v))
      .filter((v) => {
        const rule = FREE_PREVIEW_FORBIDDEN_RULES.find((r) => r.mustNotEmitValue === v);
        if (!rule) return false;
        const hasForbidden = forbiddenMoveSet.has(rule.requiredForbiddenMove);
        const hasAnySupportingBoundary = boundarySet.size > 0;
        const hasAnyReviewFlag = reviewFlagSet.size > 0;
        return !hasForbidden && !hasAnySupportingBoundary && !hasAnyReviewFlag;
      });
    if (unprotectedLeakValues.length > 0) {
      scenariosWithFreePreviewLeakageRisk.push(scenario.id);
    }

    // ── (c) Monetization defense-in-depth (soft) ─────────────────────────────
    let hasMonetizationGap = false;
    for (const rule of MONETIZATION_DEFENSE_IN_DEPTH_RULES) {
      if (!mustNotEmitSet.has(rule.mustNotEmitValue)) continue;
      if (!boundarySet.has(rule.requiredBoundary)) {
        monetizationBoundaryDetails.push({
          scenarioId: scenario.id,
          mustNotEmitValue: rule.mustNotEmitValue,
          missingBoundary: rule.requiredBoundary,
          note: `Defense-in-depth: forbidden move may be present but contract boundary token "${rule.requiredBoundary}" is absent. Both layers should protect free preview from "${rule.mustNotEmitValue}".`,
        });
        hasMonetizationGap = true;
      }
    }
    if (hasMonetizationGap) {
      scenariosWithMonetizationBoundaryWarnings.push(scenario.id);
    }

    // ── (d) Paid explanation overreach (soft) ─────────────────────────────────
    const isHighRiskDomain = HIGH_RISK_DOMAINS.has(scenario.riskDomain);
    const isHighSeverity =
      scenario.expectedSeverityPosture !== undefined &&
      HIGH_RISK_SEVERITY.has(scenario.expectedSeverityPosture);
    if (isHighRiskDomain && isHighSeverity) {
      const hasUncertaintyConstraint =
        requiredConstraintSet.has("must_preserve_uncertainty") ||
        requiredConstraintSet.has("required_uncertainty_wording") ||
        requiredConstraintSet.has("must_not_hide_high_consequence_uncertainty");
      const hasUncertaintyBoundary = boundarySet.has("require_uncertainty_wording");
      if (!hasUncertaintyConstraint && !hasUncertaintyBoundary) {
        scenariosWithPaidContractOverreachRisk.push(scenario.id);
      }
    }

    // ── (e) False reassurance warning (soft) ─────────────────────────────────
    if (mustNotEmitSet.has("false_reassurance")) {
      const hasSoftProtection =
        forbiddenMoveSet.has("no_guaranteed_outcomes") ||
        requiredConstraintSet.has("required_uncertainty_wording") ||
        reviewFlagSet.has("human_review_recommended");
      if (!hasSoftProtection) {
        scenariosWithFalseReassuranceWarnings.push(scenario.id);
      }
    }

    // ── (f) Required constraint coverage for uncertainty-critical kinds (soft) ──
    if (UNCERTAINTY_CRITICAL_KINDS.has(scenario.scenarioKind)) {
      if (!requiredConstraintSet.has("required_uncertainty_wording")) {
        scenariosMissingRequiredConstraintCoverage.push(scenario.id);
      }
    }
  }

  // ── Validity flags ──────────────────────────────────────────────────────────
  const valid =
    scenariosMissingForbiddenMoveCoverage.length === 0 &&
    scenariosWithFreePreviewLeakageRisk.length === 0;

  const fullyConsistent =
    valid &&
    scenariosMissingRequiredConstraintCoverage.length === 0 &&
    scenariosWithMonetizationBoundaryWarnings.length === 0 &&
    scenariosWithPaidContractOverreachRisk.length === 0 &&
    scenariosWithFalseReassuranceWarnings.length === 0;

  // ── Notes ───────────────────────────────────────────────────────────────────
  const notes: string[] = [];

  notes.push(
    `Validated Simulation → Explanation Contract alignment across ${scenarios.length} corpus scenario(s).`,
  );

  if (scenariosMissingForbiddenMoveCoverage.length > 0) {
    notes.push(
      `FREE PREVIEW CONTRACT VIOLATION: ${scenariosMissingForbiddenMoveCoverage.length} scenario(s) missing required forbidden move(s) for free-preview-dangerous mustNotEmit values.`,
    );
    for (const d of forbiddenMoveCoverageDetails) {
      notes.push(
        `  Scenario "${d.scenarioId}": mustNotEmit "${d.mustNotEmitValue}" requires forbidden move "${d.missingForbiddenMove}".`,
      );
    }
  }

  if (scenariosWithFreePreviewLeakageRisk.length > 0) {
    notes.push(
      `FREE PREVIEW LEAKAGE RISK: ${scenariosWithFreePreviewLeakageRisk.length} scenario(s) have high-risk mustNotEmit values with no protection at all: ${scenariosWithFreePreviewLeakageRisk.join(", ")}.`,
    );
  }

  if (scenariosMissingRequiredConstraintCoverage.length > 0) {
    notes.push(
      `CONTRACT CONSTRAINT GAP: ${scenariosMissingRequiredConstraintCoverage.length} uncertainty-critical scenario(s) missing required_uncertainty_wording in expectedRequiredConstraints: ${scenariosMissingRequiredConstraintCoverage.join(", ")}.`,
    );
  }

  if (scenariosWithMonetizationBoundaryWarnings.length > 0) {
    notes.push(
      `MONETIZATION DEFENSE GAP: ${scenariosWithMonetizationBoundaryWarnings.length} scenario(s) have forbidden-move protection but are missing the corresponding boundary token for full defense-in-depth.`,
    );
    for (const d of monetizationBoundaryDetails) {
      notes.push(`  Scenario "${d.scenarioId}": ${d.note}`);
    }
  }

  if (scenariosWithPaidContractOverreachRisk.length > 0) {
    notes.push(
      `PAID CONTRACT OVERREACH: ${scenariosWithPaidContractOverreachRisk.length} high-risk / high-severity scenario(s) lack uncertainty constraint protection: ${scenariosWithPaidContractOverreachRisk.join(", ")}.`,
    );
  }

  if (scenariosWithFalseReassuranceWarnings.length > 0) {
    notes.push(
      `FALSE REASSURANCE WARNING: ${scenariosWithFalseReassuranceWarnings.length} scenario(s) declare false_reassurance in mustNotEmit but have no soft governance protection (no_guaranteed_outcomes, required_uncertainty_wording, or human_review_recommended): ${scenariosWithFalseReassuranceWarnings.join(", ")}.`,
    );
  }

  if (fullyConsistent) {
    notes.push(
      "All corpus scenarios are fully consistent with the Simulation → Explanation Contract safety rules.",
    );
  } else if (valid) {
    notes.push(
      "Corpus scenarios satisfy free preview contract restrictions (valid) but have soft contract-layer warnings — see notes above.",
    );
  }

  notes.push(
    "Validation is static corpus governance only: no OCR, no LLM, no Smart Talk, no runtime contract build, no deadline calculation.",
  );

  return {
    valid,
    fullyConsistent,
    scenarioCount: scenarios.length,
    scenariosMissingForbiddenMoveCoverage,
    scenariosWithFreePreviewLeakageRisk,
    scenariosMissingRequiredConstraintCoverage,
    scenariosWithMonetizationBoundaryWarnings,
    scenariosWithPaidContractOverreachRisk,
    scenariosWithFalseReassuranceWarnings,
    forbiddenMoveCoverageDetails,
    monetizationBoundaryDetails,
    notes,
  };
}
