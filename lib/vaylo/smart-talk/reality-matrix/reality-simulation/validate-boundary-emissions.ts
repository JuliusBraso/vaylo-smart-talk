/**
 * Boundary emission validator (Phase 8.2D-4 / upgraded 8.2D-4A / 8.2D-4B).
 *
 * Pure validation helper — no explanation generation, no runtime enforcement, no Smart Talk wiring.
 * Cross-checks emitted ExplanationBoundary ids against BOUNDARY_POLICY_TABLE_V1 metadata and the
 * KNOWN_EXPLANATION_BOUNDARIES registry for full two-way policy/union consistency.
 *
 * Two consistency levels (8.2D-4B):
 *   `valid`          — emitted-set safety: unknown / deprecated / missing-policy for the emitted set.
 *   `fullyConsistent` — all five two-way rules: encompasses `valid` plus registry ↔ policy-table
 *                       consistency and deprecated-alias exclusion checks.
 */

import {
  KNOWN_EXPLANATION_BOUNDARIES,
  type ExplanationBoundary,
} from "../reality-simulation-types";
import type { BoundaryPolicyDefinition, DeprecatedBoundaryId } from "./boundary-policy-types";

export interface BoundaryEmissionValidationResult {
  /**
   * Emitted-set safety flag (legacy / backward-compatible).
   * True when all of the following are empty:
   *   - `unknownBoundaryIds`
   *   - `deprecatedBoundaryIds`
   *   - `missingPolicyBoundaryIds`
   *
   * Does NOT cover registry ↔ policy-table two-way consistency.
   * Use `fullyConsistent` when full governance integrity is required.
   */
  readonly valid: boolean;
  /**
   * Full five-rule consistency flag (8.2D-4B).
   * True only when ALL of the following are empty:
   *   - `unknownBoundaryIds`
   *   - `deprecatedBoundaryIds`
   *   - `missingPolicyBoundaryIds`          (emitted-set coverage)
   *   - `missingPolicyForKnownBoundaryIds`  (registry → table)
   *   - `policyBoundaryIdsMissingFromKnownRegistry` (table → registry)
   *   - `deprecatedPolicyIdsPresentInKnownRegistry` (deprecated exclusion)
   *
   * Stricter than `valid`; use this for policy-drift detection and registry audits.
   */
  readonly fullyConsistent: boolean;
  /** The emitted ids that were supplied for validation. */
  readonly emittedBoundaryIds: readonly ExplanationBoundary[];
  /**
   * All live boundary ids from the known registry that was used (default: KNOWN_EXPLANATION_BOUNDARIES).
   */
  readonly knownBoundaryIds: readonly ExplanationBoundary[];
  /**
   * Emitted ids that have no matching entry in the policy table.
   * Indicates unregistered or misspelled tokens.
   */
  readonly unknownBoundaryIds: readonly string[];
  /**
   * Emitted ids that resolve to a policy-table entry with `deprecated: true`.
   * These must never be emitted; the policy entry is historical governance metadata only.
   */
  readonly deprecatedBoundaryIds: readonly string[];
  /**
   * Known live boundaries that are absent from the policy table (as a non-deprecated entry).
   * Indicates policy-table under-coverage relative to the live union.
   */
  readonly missingPolicyForKnownBoundaryIds: readonly ExplanationBoundary[];
  /**
   * Non-deprecated policy entries whose boundaryId is absent from the known registry.
   * Indicates policy-table over-coverage or a registry omission.
   */
  readonly policyBoundaryIdsMissingFromKnownRegistry: readonly string[];
  /**
   * Policy-table entries that are deprecated and must NOT appear in the known registry.
   */
  readonly deprecatedPolicyOnlyIds: readonly DeprecatedBoundaryId[];
  /**
   * Deprecated policy ids that were incorrectly found in the known registry.
   * Should always be empty; non-empty indicates a critical registry contamination.
   */
  readonly deprecatedPolicyIdsPresentInKnownRegistry: readonly string[];
  /**
   * Non-deprecated ExplanationBoundary ids (from emitted set) that are absent from the policy table.
   * @deprecated Superseded by missingPolicyForKnownBoundaryIds for full two-way checks; kept for
   * backward compatibility with 8.2D-4 consumers.
   */
  readonly missingPolicyBoundaryIds: readonly ExplanationBoundary[];
  readonly notes: readonly string[];
}

export interface ValidateBoundaryEmissionsParams {
  readonly emittedBoundaries: readonly ExplanationBoundary[];
  readonly policyTable: readonly BoundaryPolicyDefinition[];
  /**
   * Live boundary registry to use for two-way consistency checks.
   * Defaults to KNOWN_EXPLANATION_BOUNDARIES from reality-simulation-types.ts.
   */
  readonly knownBoundaries?: readonly ExplanationBoundary[];
}

/**
 * Validates emitted ExplanationBoundary ids against policy table metadata and the live registry.
 *
 * Rules enforced (8.2D-4A upgrade):
 * 1. Every emitted id must have a corresponding non-deprecated policy-table entry.
 * 2. No emitted id may map to a deprecated policy entry.
 * 3. Every known live boundary has a non-deprecated policy entry (registry → table direction).
 * 4. Every non-deprecated policy entry has a corresponding entry in the known registry
 *    (table → registry direction).
 * 5. Deprecated policy entries must NOT appear in the known boundary registry.
 *
 * This function does not modify inputs, emit side effects, or change simulation behavior.
 */
export function validateBoundaryEmissions({
  emittedBoundaries,
  policyTable,
  knownBoundaries = KNOWN_EXPLANATION_BOUNDARIES,
}: ValidateBoundaryEmissionsParams): BoundaryEmissionValidationResult {
  // Build lookup structures from the policy table.
  const policyById = new Map<string, BoundaryPolicyDefinition>();
  for (const entry of policyTable) {
    policyById.set(entry.boundaryId, entry);
  }

  const nonDeprecatedPolicyIds = new Set<string>(
    [...policyById.values()].filter((e) => !e.deprecated).map((e) => e.boundaryId),
  );

  // Collect deprecated policy ids (historical metadata only).
  const deprecatedPolicyOnlyIds: DeprecatedBoundaryId[] = [];
  for (const entry of policyTable) {
    if (entry.deprecated) {
      deprecatedPolicyOnlyIds.push(entry.boundaryId as DeprecatedBoundaryId);
    }
  }
  const deprecatedPolicyIdSet = new Set<string>(deprecatedPolicyOnlyIds);

  // RULE 1+2: Check each emitted id.
  const unknownBoundaryIds: string[] = [];
  const deprecatedBoundaryIds: string[] = [];
  for (const id of emittedBoundaries) {
    const entry = policyById.get(id);
    if (!entry) {
      unknownBoundaryIds.push(id);
    } else if (entry.deprecated) {
      deprecatedBoundaryIds.push(id);
    }
  }

  // Backward-compat: missingPolicyBoundaryIds (8.2D-4 field, now superseded by full checks below).
  const missingPolicyBoundaryIds: ExplanationBoundary[] = [];
  for (const id of emittedBoundaries) {
    if (!nonDeprecatedPolicyIds.has(id) && !unknownBoundaryIds.includes(id)) {
      missingPolicyBoundaryIds.push(id);
    }
  }

  // RULE 3: Every known live boundary must have a non-deprecated policy entry.
  const missingPolicyForKnownBoundaryIds: ExplanationBoundary[] = [];
  for (const id of knownBoundaries) {
    if (!nonDeprecatedPolicyIds.has(id)) {
      missingPolicyForKnownBoundaryIds.push(id);
    }
  }

  // RULE 4: Every non-deprecated policy entry must have a corresponding known registry entry.
  const knownSet = new Set<string>(knownBoundaries);
  const policyBoundaryIdsMissingFromKnownRegistry: string[] = [];
  for (const id of nonDeprecatedPolicyIds) {
    if (!knownSet.has(id)) {
      policyBoundaryIdsMissingFromKnownRegistry.push(id);
    }
  }

  // RULE 5: Deprecated policy ids must NOT appear in the known registry.
  const deprecatedPolicyIdsPresentInKnownRegistry: string[] = [];
  for (const id of deprecatedPolicyIdSet) {
    if (knownSet.has(id as ExplanationBoundary)) {
      deprecatedPolicyIdsPresentInKnownRegistry.push(id);
    }
  }

  // Build notes.
  const notes: string[] = [];
  if (unknownBoundaryIds.length > 0) {
    notes.push(
      `Unknown boundary ids (not in policy table): ${unknownBoundaryIds.join(", ")} — possible misspelling or unregistered token.`,
    );
  }
  if (deprecatedBoundaryIds.length > 0) {
    notes.push(
      `Deprecated boundary ids emitted (must not be emitted): ${deprecatedBoundaryIds.join(", ")} — update emitter to canonical replacement.`,
    );
  }
  if (missingPolicyForKnownBoundaryIds.length > 0) {
    notes.push(
      `Known live boundaries with no non-deprecated policy entry: ${missingPolicyForKnownBoundaryIds.join(", ")} — add to policy table.`,
    );
  }
  if (policyBoundaryIdsMissingFromKnownRegistry.length > 0) {
    notes.push(
      `Non-deprecated policy entries missing from known registry: ${policyBoundaryIdsMissingFromKnownRegistry.join(", ")} — add to KNOWN_EXPLANATION_BOUNDARIES.`,
    );
  }
  if (deprecatedPolicyIdsPresentInKnownRegistry.length > 0) {
    notes.push(
      `CRITICAL: Deprecated policy ids found in known registry: ${deprecatedPolicyIdsPresentInKnownRegistry.join(", ")} — must be removed from KNOWN_EXPLANATION_BOUNDARIES.`,
    );
  }
  if (deprecatedPolicyOnlyIds.length > 0) {
    notes.push(
      `Deprecated policy-only (historical) entries: ${deprecatedPolicyOnlyIds.join(", ")} — retained as governance metadata only; must not be emitted or in known registry.`,
    );
  }
  if (
    unknownBoundaryIds.length === 0 &&
    deprecatedBoundaryIds.length === 0 &&
    missingPolicyForKnownBoundaryIds.length === 0 &&
    policyBoundaryIdsMissingFromKnownRegistry.length === 0 &&
    deprecatedPolicyIdsPresentInKnownRegistry.length === 0
  ) {
    notes.push(
      "All emitted boundary ids are valid, non-deprecated, and registered. Known registry and policy table are fully consistent.",
    );
  }

  const valid =
    unknownBoundaryIds.length === 0 &&
    deprecatedBoundaryIds.length === 0 &&
    missingPolicyBoundaryIds.length === 0;

  // All five two-way rules must pass for full consistency (8.2D-4B).
  const fullyConsistent =
    valid &&
    missingPolicyForKnownBoundaryIds.length === 0 &&
    policyBoundaryIdsMissingFromKnownRegistry.length === 0 &&
    deprecatedPolicyIdsPresentInKnownRegistry.length === 0;

  return {
    valid,
    fullyConsistent,
    emittedBoundaryIds: emittedBoundaries,
    knownBoundaryIds: knownBoundaries,
    unknownBoundaryIds,
    deprecatedBoundaryIds,
    missingPolicyForKnownBoundaryIds,
    policyBoundaryIdsMissingFromKnownRegistry,
    deprecatedPolicyOnlyIds,
    deprecatedPolicyIdsPresentInKnownRegistry,
    missingPolicyBoundaryIds,
    notes,
  };
}
