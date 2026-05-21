/**
 * Scenario expected-boundary consistency validator (Phase 8.2E-2).
 *
 * Pure validation helper only:
 * - no OCR
 * - no LLM calls
 * - no Smart Talk wiring
 * - no runtime simulation integration
 * - no generated explanations
 * - no deadline calculation
 * - no legal conclusions
 *
 * Validates internal consistency of each scenario's expected governance
 * outcomes:
 *   (a) registry drift — expected ids are known in canonical registries
 *   (b) boundary → contract implications — explicit rule-table checks
 *   (c) mustNotEmit → policy alignment — soft warnings for missing implied ids
 *
 * Does NOT compare against actual RealitySimulationResult output. That
 * comparison is planned for a later phase once runtime harness exists.
 */

import {
  KNOWN_EXPLANATION_BOUNDARIES,
} from "../reality-simulation-types";
import {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
} from "../reality-simulation/explanation-contract-types";
import type {
  ControlledCorpusExpectedBoundaryId,
  ControlledCorpusExpectedForbiddenMove,
  ControlledCorpusExpectedRequiredConstraint,
  ControlledCorpusMustNotEmit,
  ControlledCorpusExpectedReviewFlag,
  ControlledCorpusScenario,
} from "./corpus-types";

// ── Corpus-local known-value sets (unions are erased at runtime) ──────────────

const KNOWN_CORPUS_REVIEW_FLAGS: ReadonlySet<string> =
  new Set<ControlledCorpusExpectedReviewFlag>([
    "human_review_recommended",
    "professional_advice_recommended",
    "authority_contact_recommended",
    "high_consequence_domain",
    "escalation_ambiguity",
    "matrix_mismatch_detected",
    "speculative_support_present",
    "contradictory_world_state",
  ]);

const KNOWN_CORPUS_MUST_NOT_EMIT_VALUES: ReadonlySet<string> =
  new Set<ControlledCorpusMustNotEmit>([
    "exact_deadline",
    "legal_verdict",
    "enforcement_certainty",
    "immigration_certainty",
    "tax_certainty",
    "guaranteed_outcome",
    "autonomous_action_instruction",
    "panic_language",
    "false_reassurance",
    "user_visible_explanation",
    "raw_personal_data",
    "calculated_amount",
  ]);

// ── Canonical registry sets ───────────────────────────────────────────────────

const knownBoundarySet = new Set<string>(KNOWN_EXPLANATION_BOUNDARIES);
const knownForbiddenSet = new Set<string>(KNOWN_FORBIDDEN_EXPLANATION_MOVES);
const knownConstraintSet = new Set<string>(KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS);

// ── Boundary → contract implication table ────────────────────────────────────
// Mirrors CONTRACT_BOUNDARY_MAPPING_RULES in validate-contract-boundary-mapping.ts.
// Explicit rule-table only. Do not infer from token names.

interface BoundaryImplicationRule {
  readonly boundaryId: ControlledCorpusExpectedBoundaryId;
  readonly requiredForbiddenMoves?: readonly ControlledCorpusExpectedForbiddenMove[];
  readonly requiredConstraints?: readonly ControlledCorpusExpectedRequiredConstraint[];
}

const BOUNDARY_IMPLICATION_RULES: readonly BoundaryImplicationRule[] = [
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

// ── mustNotEmit → governance soft-warning table ───────────────────────────────
// These are SOFT WARNINGS only. A scenario is still `valid` if these are absent;
// the warning contributes to `fullyConsistent` only.

interface MustNotEmitPolicyRule {
  readonly mustNotEmitValue: ControlledCorpusMustNotEmit;
  readonly impliedBoundaries?: readonly ControlledCorpusExpectedBoundaryId[];
  readonly impliedForbiddenMoves?: readonly ControlledCorpusExpectedForbiddenMove[];
}

const MUST_NOT_EMIT_POLICY_RULES: readonly MustNotEmitPolicyRule[] = [
  {
    mustNotEmitValue: "exact_deadline",
    impliedBoundaries: ["do_not_calculate_deadline"],
    impliedForbiddenMoves: ["no_deadline_calculation_when_forbidden"],
  },
  {
    mustNotEmitValue: "enforcement_certainty",
    impliedBoundaries: ["do_not_claim_enforcement"],
    impliedForbiddenMoves: ["no_enforcement_claim_when_forbidden"],
  },
  {
    mustNotEmitValue: "legal_verdict",
    impliedForbiddenMoves: ["no_definitive_legal_verdicts"],
  },
  {
    mustNotEmitValue: "panic_language",
    impliedForbiddenMoves: ["no_high_panic_phrasing"],
  },
  {
    mustNotEmitValue: "tax_certainty",
    impliedForbiddenMoves: ["no_tax_certainty"],
  },
  {
    mustNotEmitValue: "immigration_certainty",
    impliedForbiddenMoves: ["no_immigration_certainty"],
  },
  {
    mustNotEmitValue: "guaranteed_outcome",
    impliedForbiddenMoves: ["no_guaranteed_outcomes"],
  },
  {
    mustNotEmitValue: "autonomous_action_instruction",
    impliedForbiddenMoves: ["no_autonomous_form_submission"],
  },
];

// ── Result types ──────────────────────────────────────────────────────────────

export interface ScenarioMissingForbiddenMoveImplication {
  readonly scenarioId: string;
  readonly triggerBoundaryId: string;
  readonly missingForbiddenMoves: readonly string[];
}

export interface ScenarioMissingConstraintImplication {
  readonly scenarioId: string;
  readonly triggerBoundaryId: string;
  readonly missingRequiredConstraints: readonly string[];
}

export interface ScenarioMustNotEmitPolicyWarning {
  readonly scenarioId: string;
  readonly mustNotEmitValue: string;
  /** Expected boundary ids implied by this mustNotEmit value but absent from expectedBoundaryIds. */
  readonly missingImpliedBoundaries: readonly string[];
  /** Expected forbidden moves implied by this mustNotEmit value but absent from expectedForbiddenMoves. */
  readonly missingImpliedForbiddenMoves: readonly string[];
}

export interface ScenarioBoundaryExpectationValidationResult {
  /**
   * Structural registry validity: no unknown ids in any expectation field
   * across all scenarios.
   */
  readonly valid: boolean;
  /**
   * Full consistency: `valid` AND no missing boundary-implied forbidden moves
   * or constraints AND no mustNotEmit policy warnings.
   *
   * Semantic tiers:
   *   valid            = no unknown ids (hard registry drift errors)
   *   fullyConsistent  = valid + implications + mustNotEmit alignment
   */
  readonly fullyConsistent: boolean;
  readonly scenarioCount: number;
  /** Scenario ids where expectedBoundaryIds contains unknown values. */
  readonly scenariosWithUnknownBoundaries: readonly string[];
  /** Scenario ids where expectedForbiddenMoves contains unknown values. */
  readonly scenariosWithUnknownForbiddenMoves: readonly string[];
  /** Scenario ids where expectedRequiredConstraints contains unknown values. */
  readonly scenariosWithUnknownRequiredConstraints: readonly string[];
  /** Scenario ids where expectedReviewFlags contains unknown values. */
  readonly scenariosWithUnknownReviewFlags: readonly string[];
  /** Scenario ids where mustNotEmit contains unknown values. */
  readonly scenariosWithUnknownMustNotEmit: readonly string[];
  /**
   * Scenarios where a boundary id triggers an implied forbidden-move requirement
   * but that move is absent from expectedForbiddenMoves.
   */
  readonly scenariosMissingBoundaryRequiredForbiddenMoves: readonly ScenarioMissingForbiddenMoveImplication[];
  /**
   * Scenarios where a boundary id triggers an implied required-constraint
   * but that constraint is absent from expectedRequiredConstraints.
   */
  readonly scenariosMissingBoundaryRequiredConstraints: readonly ScenarioMissingConstraintImplication[];
  /**
   * Soft policy warnings: mustNotEmit values whose governance implications
   * (boundary ids, forbidden moves) are not present in the scenario expectations.
   * These are warnings only; they do not affect `valid`.
   */
  readonly scenariosWithMustNotEmitPolicyWarnings: readonly ScenarioMustNotEmitPolicyWarning[];
  readonly notes: readonly string[];
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates internal consistency of scenario expected-boundary governance fields.
 *
 * Does NOT connect to runtime simulation, OCR, LLMs, Smart Talk, or payment.
 * Does NOT generate explanations, calculate deadlines, or infer legal conclusions.
 */
export function validateScenarioBoundaryExpectations({
  scenarios,
}: {
  readonly scenarios: readonly ControlledCorpusScenario[];
}): ScenarioBoundaryExpectationValidationResult {
  const scenariosWithUnknownBoundaries: string[] = [];
  const scenariosWithUnknownForbiddenMoves: string[] = [];
  const scenariosWithUnknownRequiredConstraints: string[] = [];
  const scenariosWithUnknownReviewFlags: string[] = [];
  const scenariosWithUnknownMustNotEmit: string[] = [];
  const scenariosMissingBoundaryRequiredForbiddenMoves: ScenarioMissingForbiddenMoveImplication[] =
    [];
  const scenariosMissingBoundaryRequiredConstraints: ScenarioMissingConstraintImplication[] = [];
  const scenariosWithMustNotEmitPolicyWarnings: ScenarioMustNotEmitPolicyWarning[] = [];

  for (const scenario of scenarios) {
    const boundarySet = new Set<string>(scenario.expectedBoundaryIds ?? []);
    const forbiddenSet = new Set<string>(scenario.expectedForbiddenMoves ?? []);
    const constraintSet = new Set<string>(scenario.expectedRequiredConstraints ?? []);
    const reviewFlagSet = new Set<string>(scenario.expectedReviewFlags ?? []);
    const mustNotEmitSet = new Set<string>(scenario.mustNotEmit ?? []);

    // (a) Registry drift — hard errors
    const unknownBoundaries = [...boundarySet].filter((b) => !knownBoundarySet.has(b));
    if (unknownBoundaries.length > 0) scenariosWithUnknownBoundaries.push(scenario.id);

    const unknownForbidden = [...forbiddenSet].filter((m) => !knownForbiddenSet.has(m));
    if (unknownForbidden.length > 0) scenariosWithUnknownForbiddenMoves.push(scenario.id);

    const unknownConstraints = [...constraintSet].filter((c) => !knownConstraintSet.has(c));
    if (unknownConstraints.length > 0) scenariosWithUnknownRequiredConstraints.push(scenario.id);

    const unknownReviewFlags = [...reviewFlagSet].filter(
      (f) => !KNOWN_CORPUS_REVIEW_FLAGS.has(f),
    );
    if (unknownReviewFlags.length > 0) scenariosWithUnknownReviewFlags.push(scenario.id);

    const unknownMustNotEmit = [...mustNotEmitSet].filter(
      (v) => !KNOWN_CORPUS_MUST_NOT_EMIT_VALUES.has(v),
    );
    if (unknownMustNotEmit.length > 0) scenariosWithUnknownMustNotEmit.push(scenario.id);

    // (b) Boundary → contract implications — consistency warnings that feed fullyConsistent
    for (const rule of BOUNDARY_IMPLICATION_RULES) {
      if (!boundarySet.has(rule.boundaryId)) continue;

      if (rule.requiredForbiddenMoves) {
        const missing = rule.requiredForbiddenMoves.filter((m) => !forbiddenSet.has(m));
        if (missing.length > 0) {
          scenariosMissingBoundaryRequiredForbiddenMoves.push({
            scenarioId: scenario.id,
            triggerBoundaryId: rule.boundaryId,
            missingForbiddenMoves: missing,
          });
        }
      }

      if (rule.requiredConstraints) {
        const missing = rule.requiredConstraints.filter((c) => !constraintSet.has(c));
        if (missing.length > 0) {
          scenariosMissingBoundaryRequiredConstraints.push({
            scenarioId: scenario.id,
            triggerBoundaryId: rule.boundaryId,
            missingRequiredConstraints: missing,
          });
        }
      }
    }

    // (c) mustNotEmit → policy alignment — soft warnings only
    for (const rule of MUST_NOT_EMIT_POLICY_RULES) {
      if (!mustNotEmitSet.has(rule.mustNotEmitValue)) continue;

      const missingBoundaries = (rule.impliedBoundaries ?? []).filter(
        (b) => !boundarySet.has(b),
      );
      const missingMoves = (rule.impliedForbiddenMoves ?? []).filter(
        (m) => !forbiddenSet.has(m),
      );

      if (missingBoundaries.length > 0 || missingMoves.length > 0) {
        scenariosWithMustNotEmitPolicyWarnings.push({
          scenarioId: scenario.id,
          mustNotEmitValue: rule.mustNotEmitValue,
          missingImpliedBoundaries: missingBoundaries,
          missingImpliedForbiddenMoves: missingMoves,
        });
      }
    }
  }

  // ── Validity flags ──────────────────────────────────────────────────────────
  const valid =
    scenariosWithUnknownBoundaries.length === 0 &&
    scenariosWithUnknownForbiddenMoves.length === 0 &&
    scenariosWithUnknownRequiredConstraints.length === 0 &&
    scenariosWithUnknownReviewFlags.length === 0 &&
    scenariosWithUnknownMustNotEmit.length === 0;

  const fullyConsistent =
    valid &&
    scenariosMissingBoundaryRequiredForbiddenMoves.length === 0 &&
    scenariosMissingBoundaryRequiredConstraints.length === 0 &&
    scenariosWithMustNotEmitPolicyWarnings.length === 0;

  // ── Notes ───────────────────────────────────────────────────────────────────
  const notes: string[] = [];

  notes.push(
    `Validated expected-boundary consistency across ${scenarios.length} controlled corpus scenario(s).`,
  );

  if (!valid) {
    if (scenariosWithUnknownBoundaries.length > 0) {
      notes.push(
        `REGISTRY DRIFT: ${scenariosWithUnknownBoundaries.length} scenario(s) reference boundary id(s) absent from KNOWN_EXPLANATION_BOUNDARIES: ${scenariosWithUnknownBoundaries.join(", ")}.`,
      );
    }
    if (scenariosWithUnknownForbiddenMoves.length > 0) {
      notes.push(
        `REGISTRY DRIFT: ${scenariosWithUnknownForbiddenMoves.length} scenario(s) reference forbidden move(s) absent from KNOWN_FORBIDDEN_EXPLANATION_MOVES: ${scenariosWithUnknownForbiddenMoves.join(", ")}.`,
      );
    }
    if (scenariosWithUnknownRequiredConstraints.length > 0) {
      notes.push(
        `REGISTRY DRIFT: ${scenariosWithUnknownRequiredConstraints.length} scenario(s) reference required constraint(s) absent from KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS: ${scenariosWithUnknownRequiredConstraints.join(", ")}.`,
      );
    }
    if (scenariosWithUnknownReviewFlags.length > 0) {
      notes.push(
        `TAXONOMY DRIFT: ${scenariosWithUnknownReviewFlags.length} scenario(s) reference review flag(s) absent from corpus taxonomy: ${scenariosWithUnknownReviewFlags.join(", ")}.`,
      );
    }
    if (scenariosWithUnknownMustNotEmit.length > 0) {
      notes.push(
        `TAXONOMY DRIFT: ${scenariosWithUnknownMustNotEmit.length} scenario(s) reference mustNotEmit value(s) absent from corpus taxonomy: ${scenariosWithUnknownMustNotEmit.join(", ")}.`,
      );
    }
  }

  if (scenariosMissingBoundaryRequiredForbiddenMoves.length > 0) {
    notes.push(
      `BOUNDARY IMPLICATION GAP: ${scenariosMissingBoundaryRequiredForbiddenMoves.length} scenario/boundary pair(s) are missing implied forbidden moves. Add them to improve corpus completeness.`,
    );
    for (const e of scenariosMissingBoundaryRequiredForbiddenMoves) {
      notes.push(
        `  Scenario "${e.scenarioId}" / boundary "${e.triggerBoundaryId}" missing: ${e.missingForbiddenMoves.join(", ")}.`,
      );
    }
  }

  if (scenariosMissingBoundaryRequiredConstraints.length > 0) {
    notes.push(
      `BOUNDARY IMPLICATION GAP: ${scenariosMissingBoundaryRequiredConstraints.length} scenario/boundary pair(s) are missing implied required constraints. Add expectedRequiredConstraints to improve corpus completeness.`,
    );
    for (const e of scenariosMissingBoundaryRequiredConstraints) {
      notes.push(
        `  Scenario "${e.scenarioId}" / boundary "${e.triggerBoundaryId}" missing constraint: ${e.missingRequiredConstraints.join(", ")}.`,
      );
    }
  }

  if (scenariosWithMustNotEmitPolicyWarnings.length > 0) {
    notes.push(
      `MUST-NOT-EMIT POLICY WARNINGS: ${scenariosWithMustNotEmitPolicyWarnings.length} mustNotEmit value(s) across scenario(s) are missing governance implications.`,
    );
    for (const w of scenariosWithMustNotEmitPolicyWarnings) {
      const parts: string[] = [];
      if (w.missingImpliedBoundaries.length > 0) {
        parts.push(`boundaries [${w.missingImpliedBoundaries.join(", ")}]`);
      }
      if (w.missingImpliedForbiddenMoves.length > 0) {
        parts.push(`forbidden moves [${w.missingImpliedForbiddenMoves.join(", ")}]`);
      }
      notes.push(
        `  Scenario "${w.scenarioId}" / mustNotEmit "${w.mustNotEmitValue}" missing implied ${parts.join(" and ")}.`,
      );
    }
  }

  if (fullyConsistent) {
    notes.push(
      "All scenario boundary expectations are valid and fully consistent with canonical governance registries and implication rules.",
    );
  } else if (valid) {
    notes.push(
      "Scenario boundary expectations are valid (no unknown ids) but have implication gaps or policy warnings — see notes above.",
    );
  }

  notes.push(
    "Validation is expected-outcome consistency only: no OCR, no LLM, no Smart Talk, no runtime simulation comparison, no deadline calculation.",
  );

  return {
    valid,
    fullyConsistent,
    scenarioCount: scenarios.length,
    scenariosWithUnknownBoundaries,
    scenariosWithUnknownForbiddenMoves,
    scenariosWithUnknownRequiredConstraints,
    scenariosWithUnknownReviewFlags,
    scenariosWithUnknownMustNotEmit,
    scenariosMissingBoundaryRequiredForbiddenMoves,
    scenariosMissingBoundaryRequiredConstraints,
    scenariosWithMustNotEmitPolicyWarnings,
    notes,
  };
}
