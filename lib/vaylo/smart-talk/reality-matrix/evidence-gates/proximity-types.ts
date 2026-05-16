/**
 * Structural proximity scaffolding (Phase 8.2C-6) — **not** a text or layout engine.
 *
 * All observations are **externally supplied** (manual / future pipeline). No OCR, token distance,
 * regex, or document layout parsing exists in this module.
 */

/** Conceptual anchor — does not trigger extraction or parsing. */
export type ProximityAnchorType =
  | "cue_to_cue"
  | "cue_to_date"
  | "cue_to_amount"
  | "cue_to_iban"
  | "cue_to_deadline_phrase";

/**
 * Declared layout / grouping relationship — **equality-only** matching in 8.2C-6 (no fuzzy distance).
 */
export type ProximityRelationship = "same_line" | "same_paragraph" | "nearby_block" | "shared_section";

/**
 * Externally supplied proximity observation — **not** proof of legal meaning and not automatic discovery.
 */
export interface ProximityObservation {
  readonly sourceCueId: string;
  readonly targetCueId: string;
  readonly relationship: ProximityRelationship;
  readonly confidence?: number;
  readonly source?: "manual" | "external" | "future_runtime";
  /** Optional semantic tag for audit only. */
  readonly anchorType?: ProximityAnchorType;
}

/**
 * Declared constraint to be checked against **manual** observations only (8.2C-6).
 */
export interface ProximityConstraint {
  readonly id: string;
  readonly sourceCueId: string;
  readonly targetCueId: string;
  readonly relationship: ProximityRelationship;
  readonly anchorType?: ProximityAnchorType;
}

/**
 * Result of comparing one constraint to the observation list — no claim authorization implied.
 */
export interface ProximityEvaluationResult {
  readonly constraintId: string;
  readonly matched: boolean;
  readonly confidence: number;
  readonly reason: string;
  readonly unsupportedFeatures?: readonly string[];
}
