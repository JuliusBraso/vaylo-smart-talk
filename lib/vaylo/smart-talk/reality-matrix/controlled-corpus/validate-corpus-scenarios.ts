/**
 * Corpus canonical validation scaffold (Phase 8.2E-1).
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
 * Validates corpus scenario expectation fields against the canonical runtime
 * governance registries so that corpus/registry drift is detectable without
 * running any runtime logic.
 */

import {
  KNOWN_EXPLANATION_BOUNDARIES,
} from "../reality-simulation-types";
import {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
} from "../reality-simulation/explanation-contract-types";
import type {
  ControlledCorpusMustNotEmit,
  ControlledCorpusExpectedReviewFlag,
  ControlledCorpusSourceMode,
  ControlledCorpusScenario,
} from "./corpus-types";

// ── Corpus-local known-value sets ────────────────────────────────────────────
// These are derived from the corpus type unions; they allow runtime checks
// without importing corpus types at value level (unions are erased at runtime).

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

/** All source modes are synthetic variants; anything else is a corpus policy violation. */
const KNOWN_SYNTHETIC_SOURCE_MODES: ReadonlySet<string> =
  new Set<ControlledCorpusSourceMode>([
    "synthetic_text",
    "synthetic_fragment",
    "synthetic_ocr_noise",
  ]);

// ── Privacy hygiene patterns ──────────────────────────────────────────────────
// Conservative static checks only. Not OCR. Not NLP. Not semantic analysis.
// The goal is to catch obvious personal-data accidents in synthetic fixtures.
const PRIVACY_PATTERNS: readonly RegExp[] = [
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,  // email address
  /\+\d{7,15}(?!\d)/,                                     // E.164 phone (+49...) 
  /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}[A-Z0-9]{0,16}\b/,    // IBAN-like
];

// ── Per-scenario drift entry ──────────────────────────────────────────────────

export interface CorpusScenarioDriftEntry {
  readonly scenarioId: string;
  readonly unknownValues: readonly string[];
}

// ── Validation result ─────────────────────────────────────────────────────────

export interface ControlledCorpusValidationResult {
  /**
   * Structural validity: no duplicate ids, no empty required fields, no
   * unknown source modes, no source-mode policy violations.
   */
  readonly valid: boolean;
  /**
   * Full consistency: `valid` AND no unknown boundary/forbidden/constraint/
   * must-not-emit/review-flag values found across any scenario AND no
   * possible personal data patterns detected.
   */
  readonly fullyConsistent: boolean;
  readonly scenarioCount: number;
  /** Scenario ids that appear more than once. */
  readonly duplicateScenarioIds: readonly string[];
  /** Scenario ids that are empty strings. */
  readonly emptyScenarioIds: readonly string[];
  /** Scenario ids whose syntheticText is empty. */
  readonly emptySyntheticTextScenarioIds: readonly string[];
  /**
   * Per-scenario entries where expectedBoundaryIds contains values not in
   * KNOWN_EXPLANATION_BOUNDARIES.
   */
  readonly unknownBoundaryIds: readonly CorpusScenarioDriftEntry[];
  /**
   * Per-scenario entries where expectedForbiddenMoves contains values not in
   * KNOWN_FORBIDDEN_EXPLANATION_MOVES.
   */
  readonly unknownForbiddenMoves: readonly CorpusScenarioDriftEntry[];
  /**
   * Per-scenario entries where expectedRequiredConstraints contains values not in
   * KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS.
   */
  readonly unknownRequiredConstraints: readonly CorpusScenarioDriftEntry[];
  /**
   * Per-scenario entries where mustNotEmit contains values not in the
   * corpus-local known must-not-emit taxonomy.
   */
  readonly unknownMustNotEmitValues: readonly CorpusScenarioDriftEntry[];
  /**
   * Per-scenario entries where expectedReviewFlags contains values not in
   * the corpus-local known review-flag taxonomy.
   */
  readonly unknownReviewFlags: readonly CorpusScenarioDriftEntry[];
  /**
   * Scenario ids whose syntheticText matched a conservative privacy pattern
   * (email, E.164 phone, IBAN-like). Not OCR. Not NLP. Static hygiene only.
   */
  readonly possiblePersonalDataScenarioIds: readonly string[];
  /**
   * Scenario ids whose sourceMode is not in the known synthetic-mode set.
   * Should be empty if corpus policy is followed.
   */
  readonly sourceModeViolations: readonly string[];
  readonly notes: readonly string[];
}

// ── Validator ─────────────────────────────────────────────────────────────────

const knownBoundarySet = new Set<string>(KNOWN_EXPLANATION_BOUNDARIES);
const knownForbiddenSet = new Set<string>(KNOWN_FORBIDDEN_EXPLANATION_MOVES);
const knownConstraintSet = new Set<string>(KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS);

/**
 * Validates controlled corpus scenarios against canonical governance registries.
 *
 * Checks performed:
 *   - Structural: unique ids, non-empty required fields, synthetic source modes.
 *   - Registry drift: expected boundary ids, forbidden moves, required constraints.
 *   - Corpus taxonomy drift: must-not-emit values, review flags.
 *   - Privacy hygiene: conservative static pattern checks on syntheticText.
 *
 * Does not run OCR, call LLMs, connect to Smart Talk, generate explanations,
 * calculate deadlines, or infer legal conclusions.
 */
export function validateControlledCorpusScenarios({
  scenarios,
}: {
  readonly scenarios: readonly ControlledCorpusScenario[];
}): ControlledCorpusValidationResult {
  // ── Structural checks ──────────────────────────────────────────────────────
  const seenIds = new Set<string>();
  const duplicateScenarioIds: string[] = [];
  const emptyScenarioIds: string[] = [];
  const emptySyntheticTextScenarioIds: string[] = [];
  const sourceModeViolations: string[] = [];

  for (const scenario of scenarios) {
    if (!scenario.id || scenario.id.trim() === "") {
      emptyScenarioIds.push(scenario.id);
    } else if (seenIds.has(scenario.id)) {
      duplicateScenarioIds.push(scenario.id);
    } else {
      seenIds.add(scenario.id);
    }

    if (!scenario.syntheticText || scenario.syntheticText.trim() === "") {
      emptySyntheticTextScenarioIds.push(scenario.id);
    }

    if (!KNOWN_SYNTHETIC_SOURCE_MODES.has(scenario.sourceMode)) {
      sourceModeViolations.push(scenario.id);
    }
  }

  // ── Registry drift checks ──────────────────────────────────────────────────
  const unknownBoundaryIds: CorpusScenarioDriftEntry[] = [];
  const unknownForbiddenMoves: CorpusScenarioDriftEntry[] = [];
  const unknownRequiredConstraints: CorpusScenarioDriftEntry[] = [];
  const unknownMustNotEmitValues: CorpusScenarioDriftEntry[] = [];
  const unknownReviewFlags: CorpusScenarioDriftEntry[] = [];

  for (const scenario of scenarios) {
    if (scenario.expectedBoundaryIds && scenario.expectedBoundaryIds.length > 0) {
      const unknown = scenario.expectedBoundaryIds.filter(
        (id) => !knownBoundarySet.has(id),
      );
      if (unknown.length > 0) {
        unknownBoundaryIds.push({ scenarioId: scenario.id, unknownValues: unknown });
      }
    }

    if (scenario.expectedForbiddenMoves && scenario.expectedForbiddenMoves.length > 0) {
      const unknown = scenario.expectedForbiddenMoves.filter(
        (m) => !knownForbiddenSet.has(m),
      );
      if (unknown.length > 0) {
        unknownForbiddenMoves.push({ scenarioId: scenario.id, unknownValues: unknown });
      }
    }

    if (scenario.expectedRequiredConstraints && scenario.expectedRequiredConstraints.length > 0) {
      const unknown = scenario.expectedRequiredConstraints.filter(
        (c) => !knownConstraintSet.has(c),
      );
      if (unknown.length > 0) {
        unknownRequiredConstraints.push({ scenarioId: scenario.id, unknownValues: unknown });
      }
    }

    if (scenario.mustNotEmit && scenario.mustNotEmit.length > 0) {
      const unknown = scenario.mustNotEmit.filter(
        (v) => !KNOWN_CORPUS_MUST_NOT_EMIT_VALUES.has(v),
      );
      if (unknown.length > 0) {
        unknownMustNotEmitValues.push({ scenarioId: scenario.id, unknownValues: unknown });
      }
    }

    if (scenario.expectedReviewFlags && scenario.expectedReviewFlags.length > 0) {
      const unknown = scenario.expectedReviewFlags.filter(
        (f) => !KNOWN_CORPUS_REVIEW_FLAGS.has(f),
      );
      if (unknown.length > 0) {
        unknownReviewFlags.push({ scenarioId: scenario.id, unknownValues: unknown });
      }
    }
  }

  // ── Privacy hygiene checks ─────────────────────────────────────────────────
  const possiblePersonalDataScenarioIds: string[] = [];

  for (const scenario of scenarios) {
    const matched = PRIVACY_PATTERNS.some((pattern) => pattern.test(scenario.syntheticText));
    if (matched) {
      possiblePersonalDataScenarioIds.push(scenario.id);
    }
  }

  // ── Validity and consistency ───────────────────────────────────────────────
  const valid =
    duplicateScenarioIds.length === 0 &&
    emptyScenarioIds.length === 0 &&
    emptySyntheticTextScenarioIds.length === 0 &&
    sourceModeViolations.length === 0;

  const fullyConsistent =
    valid &&
    unknownBoundaryIds.length === 0 &&
    unknownForbiddenMoves.length === 0 &&
    unknownRequiredConstraints.length === 0 &&
    unknownMustNotEmitValues.length === 0 &&
    unknownReviewFlags.length === 0 &&
    possiblePersonalDataScenarioIds.length === 0;

  // ── Notes ──────────────────────────────────────────────────────────────────
  const notes: string[] = [];

  notes.push(`Validated ${scenarios.length} controlled corpus scenario(s).`);

  if (duplicateScenarioIds.length > 0) {
    notes.push(`Duplicate scenario ids: ${duplicateScenarioIds.join(", ")}.`);
  }
  if (emptyScenarioIds.length > 0) {
    notes.push(`Scenarios with empty ids detected: ${emptyScenarioIds.length}.`);
  }
  if (emptySyntheticTextScenarioIds.length > 0) {
    notes.push(
      `Scenarios with empty syntheticText: ${emptySyntheticTextScenarioIds.join(", ")}.`,
    );
  }
  if (sourceModeViolations.length > 0) {
    notes.push(
      `Source-mode policy violations (non-synthetic sourceMode): ${sourceModeViolations.join(", ")}.`,
    );
  }
  if (unknownBoundaryIds.length > 0) {
    for (const e of unknownBoundaryIds) {
      notes.push(
        `Scenario "${e.scenarioId}": expectedBoundaryIds contains unknown value(s) not in KNOWN_EXPLANATION_BOUNDARIES: ${e.unknownValues.join(", ")}.`,
      );
    }
  }
  if (unknownForbiddenMoves.length > 0) {
    for (const e of unknownForbiddenMoves) {
      notes.push(
        `Scenario "${e.scenarioId}": expectedForbiddenMoves contains unknown value(s) not in KNOWN_FORBIDDEN_EXPLANATION_MOVES: ${e.unknownValues.join(", ")}.`,
      );
    }
  }
  if (unknownRequiredConstraints.length > 0) {
    for (const e of unknownRequiredConstraints) {
      notes.push(
        `Scenario "${e.scenarioId}": expectedRequiredConstraints contains unknown value(s) not in KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS: ${e.unknownValues.join(", ")}.`,
      );
    }
  }
  if (unknownMustNotEmitValues.length > 0) {
    for (const e of unknownMustNotEmitValues) {
      notes.push(
        `Scenario "${e.scenarioId}": mustNotEmit contains unknown value(s) not in corpus taxonomy: ${e.unknownValues.join(", ")}.`,
      );
    }
  }
  if (unknownReviewFlags.length > 0) {
    for (const e of unknownReviewFlags) {
      notes.push(
        `Scenario "${e.scenarioId}": expectedReviewFlags contains unknown value(s) not in corpus taxonomy: ${e.unknownValues.join(", ")}.`,
      );
    }
  }
  if (possiblePersonalDataScenarioIds.length > 0) {
    notes.push(
      `PRIVACY HYGIENE: Possible personal data pattern detected in scenario(s): ${possiblePersonalDataScenarioIds.join(", ")}. Review syntheticText before expanding corpus.`,
    );
  }

  if (fullyConsistent) {
    notes.push(
      "All corpus scenarios are structurally valid and fully consistent with canonical governance registries.",
    );
  } else if (valid) {
    notes.push(
      "Corpus is structurally valid but has registry drift or hygiene issues — see per-field details above.",
    );
  }

  notes.push(
    "Validation is static corpus hygiene only: no OCR, no LLM, no Smart Talk, no deadline calculation, no explanation generation.",
  );

  return {
    valid,
    fullyConsistent,
    scenarioCount: scenarios.length,
    duplicateScenarioIds,
    emptyScenarioIds,
    emptySyntheticTextScenarioIds,
    unknownBoundaryIds,
    unknownForbiddenMoves,
    unknownRequiredConstraints,
    unknownMustNotEmitValues,
    unknownReviewFlags,
    possiblePersonalDataScenarioIds,
    sourceModeViolations,
    notes,
  };
}
