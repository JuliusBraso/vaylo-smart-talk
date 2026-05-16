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
 * `escalation` / `clarification` added in Phase 8.2B-3 for Mahnung / dunning cognition.
 */
export type ProceduralLane =
  | "payment"
  | "appeal"
  | "submission"
  | "appointment"
  | "informational"
  | "escalation"
  | "clarification";

// ---------------------------------------------------------------------------
// C) ClaimType — bounded taxonomy (extend by appending to KNOWN_CLAIM_TYPES)
// ---------------------------------------------------------------------------

/**
 * Assertions the cognition layer may emit about the user-facing situation (not UI copy).
 *
 * **Namespace (Phase 8.2B-4):** Several string tokens also exist on {@link RealityType}
 * (e.g. `insurance_risk`, `immigration_risk`, `account_seizure`, `eviction_risk`). They are
 * **different TypeScript types** — logs, gates, and telemetry must prefix or wrap so they
 * are never mixed in a single string keyed map. See `CONSOLIDATION_AUDIT.md`.
 *
 * TODO(8.2C): Evaluator must define how `ClaimRule.requiredEvidenceRuleIds` composes
 * (AND vs OR vs `anyOf`) — matrices use duplicate `ClaimRule` rows for OR today.
 */
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
  /** Mahnung / clarification surfaces (Phase 8.2B-3). */
  "clarification_possible",
  /** Panic-prone cross-domain claims — typically forbidden on Mahnung matrix. */
  "immigration_risk",
  "automatic_salary_garnishment",
  "account_seizure",
  "eviction_risk",
  "criminal_accusation",
] as const;

/** Expand the taxonomy by adding entries to KNOWN_CLAIM_TYPES in versioned releases. */
export type ClaimType = (typeof KNOWN_CLAIM_TYPES)[number];

// ---------------------------------------------------------------------------
// D) RealityType — supported / blocked realities (extend via REALITY_TYPE_VALUES)
// ---------------------------------------------------------------------------

/**
 * Coarse “what world-state the document plausibly establishes”.
 * Members may appear in `supportedRealities` on one matrix and in `blockedRealities` on another
 * (e.g. `reminder_notice` is out of scope for the Rechnung v1 matrix but valid for a Mahnung matrix later).
 *
 * **Namespace (Phase 8.2B-4):** Homonyms with {@link ClaimType} exist (`insurance_risk`,
 * `immigration_risk`, `account_seizure`, `eviction_risk`). Realities describe **world-state**;
 * claims describe **what the assistant may assert** — do not conflate in 8.2C gates.
 * Related asymmetric pair: `benefit_suspension` (reality) vs `benefit_risk` (claim).
 */
export const REALITY_TYPE_VALUES = [
  "invoice_issued",
  "payment_due",
  "tax_payment_due",
  "tax_refund_due",
  "payment_scheduled",
  "direct_debit_scheduled",
  "informational_payment_notice",
  "recurring_contribution_notice",
  "tax_assessment_issued",
  "official_decision_issued",
  "tax_decision_issued",
  "tax_calculation_present",
  "provisional_tax_assessment",
  "amended_tax_assessment",
  "legal_remedy_information_present",
  "reminder_notice",
  "overdue_payment_notice",
  "repeated_payment_request",
  "payment_deadline_present",
  "payment_followup_notice",
  "possible_late_fee_notice",
  "escalation_warning_present",
  "final_reminder_notice",
  "appeal_window_exists",
  "informational_notice",
  "document_submission_expected",
  "appointment_scheduled",
  /** Blocked / out-of-scope states for payment-notice matrices (explicit anti-hallucination). */
  "enforcement_active",
  "court_proceeding",
  "criminal_investigation",
  "immigration_risk",
  "benefit_suspension",
  "jobcenter_sanction",
  "active_sanction",
  "insurance_risk",
  "final_unappealable_decision",
  "tax_fraud_established",
  /** Mahnung-matrix blocked outcomes (Phase 8.2B-3) — do not assert without different document class. */
  "account_seizure",
  "automatic_salary_garnishment",
  "active_inkasso_case",
  "eviction_risk",
  "health_insurance_termination",
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
 *
 * TODO(8.2C): `requiredCueIds` default semantics must be specified (typically AND of matches).
 * Matrices may document OR paths via alternate rule ids or prose in `label`.
 */
export interface EvidenceRule {
  readonly id: string;
  readonly label: string;
  readonly requiredCueIds: readonly string[];
  readonly optionalCueIds?: readonly string[];
  readonly minimumEvidenceLevel: EvidenceLevel;
  readonly allowedLanes: readonly ProceduralLane[];
  /**
   * When set (8.2C-4+), every required cue hit used to satisfy this rule must declare numeric
   * `CueHit.confidence` at or above this floor. Omitted = no numeric confidence gate on hits.
   */
  readonly minConfidence?: MatrixConfidenceFloor;
}

// ---------------------------------------------------------------------------
// G) ClaimRule
// ---------------------------------------------------------------------------

export type MatrixConfidenceFloor = "low" | "medium" | "high";

/**
 * Declares whether a claim type may appear in bounded output and under what proof.
 *
 * **Composition (Phase 8.2B-4):** `minimumConfidence` is orthogonal to `EvidenceRule.minimumEvidenceLevel`;
 * 8.2C must define whether both must pass, either, or weighted. Duplicate rows with the same
 * `claimType` express **disjunctive** evidence paths until rule algebra exists.
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
  "lastschrift_to_manual_payment",
  "informational_notice_to_threat",
  "insurance_notice_to_claim_event",
  "generic_due_date_to_penalty",
  /** Steuerbescheid / Finanzamt assessment (Phase 8.2B-2). */
  "bescheid_date_to_appeal_deadline",
  "payment_deadline_to_appeal_deadline",
  "appeal_deadline_to_payment_deadline",
  "rechtsbehelfsbelehrung_to_active_threat",
  "steuerbescheid_to_enforcement",
  "tax_assessment_to_criminal_case",
  "refund_payment_confusion",
  "finanzamt_to_jobcenter_confusion",
  "provisional_to_final_decision",
  /** Mahnung / dunning (Phase 8.2B-3). */
  "mahnung_to_vollstreckung",
  "mahnung_to_gerichtsvollzieher",
  "payment_reminder_to_account_seizure",
  "generic_escalation_to_legal_disaster",
  "letzte_mahnung_to_active_enforcement",
  "weitere_schritte_to_forced_collection",
  "late_fee_to_criminal_case",
  "insurance_reminder_to_loss_of_coverage",
  "overdue_payment_to_eviction",
  "overdue_payment_to_salary_garnishment",
  "emotional_language_amplification",
] as const;

export type HallucinationTrapKind = (typeof HALLUCINATION_TRAP_KINDS)[number];

/**
 * Documented dangerous inference pattern for audits and future static checks.
 */
export interface HallucinationTrap {
  readonly id: string;
  readonly kind: HallucinationTrapKind;
  /** Short catalog line for humans / compliance reviews. */
  readonly description: string;
  /** Inference that must not be drawn without evidence beyond this document type. */
  readonly dangerousInference: string;
  /** Bounded output behavior: suppress, hedge, downgrade, or refuse the inference. */
  readonly blockedInterpretationBehavior: string;
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
