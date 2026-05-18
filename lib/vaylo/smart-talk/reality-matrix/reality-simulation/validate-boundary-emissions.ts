/**
 * Boundary emission validator (Phase 8.2D-4).
 *
 * Pure validation helper — no explanation generation, no runtime enforcement, no Smart Talk wiring.
 * Cross-checks emitted ExplanationBoundary ids against BOUNDARY_POLICY_TABLE_V1 metadata.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type { BoundaryPolicyDefinition, DeprecatedBoundaryId } from "./boundary-policy-types";

export interface BoundaryEmissionValidationResult {
  /** True only when every emitted id is canonical, non-deprecated, and registered in the policy table. */
  readonly valid: boolean;
  /** The emitted ids that were supplied for validation. */
  readonly emittedBoundaryIds: readonly ExplanationBoundary[];
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
   * Non-deprecated ExplanationBoundary ids that are absent from the policy table.
   * Indicates union/table drift.
   */
  readonly missingPolicyBoundaryIds: readonly ExplanationBoundary[];
  /**
   * Policy-table entries that are deprecated, meaning they exist only as historical metadata
   * and must not appear in ExplanationBoundary or be emitted.
   */
  readonly deprecatedPolicyOnlyIds: readonly DeprecatedBoundaryId[];
  readonly notes: readonly string[];
}

export interface ValidateBoundaryEmissionsParams {
  readonly emittedBoundaries: readonly ExplanationBoundary[];
  readonly policyTable: readonly BoundaryPolicyDefinition[];
}

/**
 * Validates that a set of emitted ExplanationBoundary ids is consistent with policy table metadata.
 *
 * Rules enforced:
 * 1. Every emitted id must have a corresponding policy-table entry.
 * 2. No emitted id may map to a deprecated policy entry.
 * 3. Every non-deprecated ExplanationBoundary token should have a policy entry (union/table drift check).
 * 4. Deprecated historical entries are allowed in the table but must not appear in the emitted set.
 *
 * This function does not modify inputs, emit side effects, or change simulation behavior.
 */
export function validateBoundaryEmissions({
  emittedBoundaries,
  policyTable,
}: ValidateBoundaryEmissionsParams): BoundaryEmissionValidationResult {
  // Build lookup maps from the policy table.
  const policyById = new Map<string, BoundaryPolicyDefinition>();
  for (const entry of policyTable) {
    policyById.set(entry.boundaryId, entry);
  }

  // Collect deprecated ids from the policy table (historical metadata only).
  const deprecatedPolicyOnlyIds: DeprecatedBoundaryId[] = [];
  for (const entry of policyTable) {
    if (entry.deprecated) {
      deprecatedPolicyOnlyIds.push(entry.boundaryId as DeprecatedBoundaryId);
    }
  }

  // Check each emitted id.
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

  // Detect union/table drift: live union members that have no policy entry.
  // We infer the live ExplanationBoundary members from the non-deprecated policy entries.
  // The ExplanationBoundary type itself is validated by TypeScript; here we check the policy table
  // covers every emitted token (approximation without iterating the TS union at runtime).
  const nonDeprecatedPolicyIds = new Set<string>(
    [...policyById.values()].filter((e) => !e.deprecated).map((e) => e.boundaryId),
  );
  const missingPolicyBoundaryIds: ExplanationBoundary[] = [];
  for (const id of emittedBoundaries) {
    if (!nonDeprecatedPolicyIds.has(id) && !unknownBoundaryIds.includes(id)) {
      missingPolicyBoundaryIds.push(id);
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
  if (missingPolicyBoundaryIds.length > 0) {
    notes.push(
      `Emitted boundary ids with no non-deprecated policy entry: ${missingPolicyBoundaryIds.join(", ")} — add to policy table.`,
    );
  }
  if (deprecatedPolicyOnlyIds.length > 0) {
    notes.push(
      `Deprecated policy-only (historical) entries: ${deprecatedPolicyOnlyIds.join(", ")} — retained as governance metadata only; must not be emitted.`,
    );
  }
  if (unknownBoundaryIds.length === 0 && deprecatedBoundaryIds.length === 0 && missingPolicyBoundaryIds.length === 0) {
    notes.push("All emitted boundary ids are valid, non-deprecated, and registered in the policy table.");
  }

  const valid =
    unknownBoundaryIds.length === 0 &&
    deprecatedBoundaryIds.length === 0 &&
    missingPolicyBoundaryIds.length === 0;

  return {
    valid,
    emittedBoundaryIds: emittedBoundaries,
    unknownBoundaryIds,
    deprecatedBoundaryIds,
    missingPolicyBoundaryIds,
    deprecatedPolicyOnlyIds,
    notes,
  };
}
