/**
 * Universal Document Reality Matrix — ontology types (Phase 8.2B).
 *
 * Architecture only: no runtime gates, no LLM calls, no persistence contract here.
 * Constitutional rule: Vaylo must never claim more than document evidence supports.
 */

// ---------------------------------------------------------------------------
// A) EvidenceLevel
// ---------------------------------------------------------------------------

/**
 * How strongly the source text supports an inference.
 *
 * - `explicit`: wording is direct (e.g. “zahlbar bis”, printed amount + date cluster).
 * - `strongly_supported`: multiple consistent cues; still no speculation beyond text.
 * - `contextual`: weak or ambiguous cues; outputs must hedge or downgrade.
 * - `speculative`: INTERNAL ONLY — used for suppression / debug; must never be
 *   surfaced as user-visible fact in `strict_document`. Downstream phases may
 *   use it to block emission before any user-facing string exists.
 */
export type EvidenceLevel =
  | "explicit"
  | "strongly_supported"
  | "contextual"
  | "speculative";

// ---------------------------------------------------------------------------
// B) ProceduralLane
// ---------------------------------------------------------------------------

/**
 * Procedural lane: which obligation/right cluster a cue or claim belongs to.
 * Lane isolation prevents payment language from absorbing appeal windows (etc.).
 */
export type ProceduralLane =
  | "payment"
  | "appeal"
  | "submission"
  | "appointment"
  | "informational";

// ---------------------------------------------------------------------------
// C) ClaimType — bounded taxonomy (extend by appending to KNOWN_CLAIM_TYPES)
// ---------------------------------------------------------------------------

export const KNOWN_CLAIM_TYPES = [
  "payment_required",
  "payment_overdue",
  "payment_method_manual",
  "payment_method_sepa",
  "appeal_possible",
  "deadline_present",
  "documents_required",
  "appointment_required",
  "enforcement_risk",
  "benefit_risk",
  "insurance_risk",
  "informational_only",
] as const;

/** Expand the taxonomy by adding entries to KNOWN_CLAIM_TYPES in versioned releases. */
export type ClaimType = (typeof KNOWN_CLAIM_TYPES)[number];

// ---------------------------------------------------------------------------
// D) RealityType — supported / blocked realities (extend via REALITY_TYPE_VALUES)
// ---------------------------------------------------------------------------

/**
 * Coarse “what world-state the document plausibly establishes”.
 * Not UI copy; not enums sent to the client unless a later phase maps them.
 */
export const REALITY_TYPE_VALUES = [
  "invoice_issued",
  "payment_due",
  "direct_debit_scheduled",
  "tax_decision_issued",
  "reminder_notice",
  "appeal_window_exists",
  "informational_notice",
  "document_submission_expected",
  "appointment_scheduled",
  "unknown",
] as const;

export type RealityType = (typeof REALITY_TYPE_VALUES)[number];

// ---------------------------------------------------------------------------
// E) EvidenceCue
// ---------------------------------------------------------------------------

/**
 * A single evidential anchor: lexical, pattern-based, or OCR-fragile.
 * `laneOwnership`: which lane(s) may interpret hits as belonging to that lane.
 */
export interface EvidenceCue {
  readonly id: string;
  readonly description: string;
  readonly keywords?: readonly string[];
  /** Pattern strings (e.g. for RegExp construction in a future gate); not executed here. */
  readonly regexPatterns?: readonly string[];
  /** If true, matches are treated as fragile under OCR (false positives/merges). */
  readonly ocrSensitive?: boolean;
  readonly laneOwnership: readonly ProceduralLane[];
}

// ---------------------------------------------------------------------------
// F) EvidenceRule
// ---------------------------------------------------------------------------

/**
 * Defines what evidence must exist before a claim or reality is admissible.
 */
export interface EvidenceRule {
  readonly id: string;
  readonly label: string;
  readonly requiredCueIds: readonly string[];
  readonly optionalCueIds?: readonly string[];
  readonly minimumEvidenceLevel: EvidenceLevel;
  readonly allowedLanes: readonly ProceduralLane[];
}

// ---------------------------------------------------------------------------
// G) ClaimRule
// ---------------------------------------------------------------------------

export type MatrixConfidenceFloor = "low" | "medium" | "high";

/**
 * Declares whether a claim type may appear in bounded output and under what proof.
 */
export interface ClaimRule {
  readonly claimType: ClaimType;
  /** If false, the claim must not be asserted (may still appear as negated / absent). */
  readonly allowed: boolean;
  /** EvidenceRule ids that must be satisfied when `allowed` is true. */
  readonly requiredEvidenceRuleIds: readonly string[];
  /** Other claim types that, if asserted without separate proof, block this one. */
  readonly blockedBy?: readonly ClaimType[];
  readonly minimumConfidence: MatrixConfidenceFloor;
}

// ---------------------------------------------------------------------------
// H) HallucinationTrap
// ---------------------------------------------------------------------------

export const HALLUCINATION_TRAP_KINDS = [
  "invoice_to_enforcement",
  "appeal_deadline_synthesis",
  "lane_contamination",
  "semantic_drift",
  "amount_deadline_swap",
  "bekanntgabe_date_invention",
] as const;

export type HallucinationTrapKind = (typeof HALLUCINATION_TRAP_KINDS)[number];

/**
 * Documented dangerous inference pattern for audits and future static checks.
 */
export interface HallucinationTrap {
  readonly id: string;
  readonly kind: HallucinationTrapKind;
  readonly summary: string;
  /** Human-readable guard: what must not be inferred without evidence. */
  readonly guardStatement: string;
  /** Optional: claim or reality keys this trap primarily protects. */
  readonly relatedClaimTypes?: readonly ClaimType[];
  readonly relatedLanes?: readonly ProceduralLane[];
}

// ---------------------------------------------------------------------------
// I) StabilizerRule
// ---------------------------------------------------------------------------

/**
 * When a calming clarification is permitted (never mandatory here — runtime TBD).
 */
export interface StabilizerRule {
  readonly id: string;
  /** When this stabilizer may be considered (human-readable; future phases may structure this). */
  readonly triggerConditions: readonly string[];
  readonly allowedWordingExamples: readonly string[];
  readonly forbiddenWordingExamples: readonly string[];
}

// ---------------------------------------------------------------------------
// J) SeverityRule
// ---------------------------------------------------------------------------

/**
 * Procedural / legal weight — not user emotion, not marketing “urgency”.
 */
export type ProceduralSeverityBand =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface SeverityRule {
  readonly id: string;
  readonly when: string;
  readonly minimumEvidenceLevel: EvidenceLevel;
  readonly realitiesThatMayTrigger?: readonly RealityType[];
  readonly claimTypesThatMayTrigger?: readonly ClaimType[];
  readonly blockedWhenRealities?: readonly RealityType[];
  readonly severity: ProceduralSeverityBand;
}

// ---------------------------------------------------------------------------
// K) UniversalDocumentRealityMatrix
// ---------------------------------------------------------------------------

/**
 * Matrix row identity: which document family this matrix governs (initial three + extension hook).
 */
export type RealityMatrixDocumentType =
  | "rechnung_payment_notice"
  | "steuerbescheid"
  | "mahnung"
  | "bewilligung"
  | "ablehnung"
  | "anhoerung"
  | "krankenkasse_letter"
  | "immigration_document"
  | "jobcenter_document"
  | "insurance_document"
  | "generic_unknown";

/**
 * Master schema: one matrix instance per document family (versioned).
 */
export interface UniversalDocumentRealityMatrix {
  readonly schemaVersion: string;
  readonly documentType: RealityMatrixDocumentType;
  /** Realities this family may assert when evidence rules pass. */
  readonly supportedRealities: readonly RealityType[];
  /** Realities that must never be asserted for this family without a matrix change. */
  readonly blockedRealities: readonly RealityType[];
  readonly evidenceCues: readonly EvidenceCue[];
  readonly evidenceRules: readonly EvidenceRule[];
  readonly allowedClaims: readonly ClaimRule[];
  /** Claim types that must never be asserted for this document type (audit list). */
  readonly forbiddenClaims: readonly ClaimType[];
  readonly hallucinationTraps: readonly HallucinationTrap[];
  /** When calming clarification is permitted; emission logic is future-phase. */
  readonly stabilizers: readonly StabilizerRule[];
  readonly severityRules: readonly SeverityRule[];
  /** Lanes this document family uses; ordering is informational only. */
  readonly proceduralLanes: readonly ProceduralLane[];
}
