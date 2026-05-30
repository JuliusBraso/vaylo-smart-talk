/**
 * Evidence Gates shared types (8.2C-0 sketches + 8.2C-1 evaluator I/O).
 *
 * Pure type definitions — no runtime in this file.
 * Evaluator skeleton: `evidence-gates/evaluate-evidence-gates.ts`.
 * See EVIDENCE_GATES_SPEC.md for behavioral contract.
 */

import type {
  ClaimType,
  EvidenceLevel,
  HallucinationTrapKind,
  MatrixConfidenceFloor,
  ProceduralLane,
  ProceduralSeverityBand,
  RealityType,
  UniversalDocumentRealityMatrix,
} from "./types";
import type { ProximityEvaluationResult } from "./evidence-gates/proximity-types";

// ---------------------------------------------------------------------------
// Namespace-safe identifiers (§10 EVIDENCE_GATES_SPEC)
// ---------------------------------------------------------------------------

export type NamespacedClaimId = `claim:${ClaimType}`;
export type NamespacedRealityId = `reality:${RealityType}`;

// ---------------------------------------------------------------------------
// Input / hits (§2)
// ---------------------------------------------------------------------------

/** OCR / pipeline quality hint — align with product enums at integration time. */
export type OcrQualityHint = "clear" | "noisy" | "ocr_damaged" | "unknown";

export interface TextSpan {
  readonly start: number;
  readonly end: number;
}

/** Provenance for a cue observation (8.2C-3). Never implies automatic detection in this phase. */
export type CueHitSource = "manual" | "external" | "future_runtime";

/**
 * CueHit is an observation, not an authorized claim.
 *
 * Externally supplied evidence candidate only: the evaluator must not treat presence of a hit
 * as legal reality, matrix-supported reality, or claim authorization until later gate phases.
 */
export interface CueHit {
  readonly cueId: string;
  readonly matchedText?: string;
  /** When set, must already be a valid {@link ProceduralLane}; the normalizer drops unknown values — it does not infer lanes. */
  readonly lane?: ProceduralLane;
  readonly confidence?: number;
  readonly evidenceLevel?: EvidenceLevel;
  readonly startOffset?: number;
  readonly endOffset?: number;
  readonly source?: CueHitSource;
  readonly notes?: readonly string[];
  /**
   * Legacy span (8.2C-1); normalized output prefers `startOffset` / `endOffset`.
   * Not read from document text by the gate skeleton.
   */
  readonly span?: TextSpan;
  /** @deprecated Prefer `matchedText`; stripped from audit traces to reduce copy leakage. */
  readonly matchedKeyword?: string;
  readonly ocrFragile?: boolean;
}

export interface EvidenceGateInput {
  readonly documentText: string;
  readonly ocrQuality: OcrQualityHint;
  readonly matrixDocumentType: string;
  readonly matrixSchemaVersion: string;
  /**
   * Externally supplied cue hits (8.2C-3). Omitted or empty when none are injected.
   * Never inferred from `documentText` inside `evaluateEvidenceGates`.
   */
  readonly cueHits?: readonly CueHit[];
  /**
   * Optional matrix snapshot (8.2C-1+). Skeleton uses only metadata + blocked/forbidden surfaces;
   * does not evaluate evidence rules against text.
   */
  readonly matrix?: UniversalDocumentRealityMatrix;
}

// ---------------------------------------------------------------------------
// Rule algebra AST sketch (§4) — evaluator walks this tree later
// ---------------------------------------------------------------------------

export type RuleExpression =
  | { readonly op: "allOf"; readonly children: readonly RuleExpression[] }
  | { readonly op: "anyOf"; readonly children: readonly RuleExpression[] }
  | { readonly op: "noneOf"; readonly children: readonly RuleExpression[] }
  | { readonly op: "not"; readonly child: RuleExpression }
  | { readonly op: "cue"; readonly cueId: string }
  | { readonly op: "ruleRef"; readonly evidenceRuleId: string }
  | {
      readonly op: "proximity";
      readonly anchor: RuleExpression;
      readonly windowChars: number;
      readonly inner: RuleExpression;
    }
  | {
      readonly op: "laneScope";
      readonly lanes: readonly ProceduralLane[];
      readonly inner: RuleExpression;
    }
  | {
      readonly op: "minEvidence";
      readonly minimum: EvidenceLevel;
      readonly inner: RuleExpression;
    }
  | {
      readonly op: "conditionalForbidden";
      readonly claim: ClaimType;
      readonly unless: RuleExpression;
    };

/**
 * External resolution for terminal `RuleExpression` nodes (8.2C-2).
 * No document text — only precomputed maps or pure `resolveTerminal` callbacks.
 */
export interface RuleExpressionEvaluationContext {
  /** Lookup by `terminalKey(expr)` — see `terminalKey` in evaluate-rule-expression.ts. */
  readonly terminalResults?: Readonly<Record<string, RuleEvaluationResult>>;
  /** Optional callback when `terminalResults` has no entry; must not scan OCR text. */
  readonly resolveTerminal?: (expr: RuleExpression) => RuleEvaluationResult | undefined;
  /**
   * Precomputed proximity **skeleton** results keyed by `terminalKey` of `proximity` nodes (8.2C-6).
   * No document text — caller supplies equality-only evaluation output from `evaluateProximityConstraints`
   * or another external pipeline, mapped to each AST node's `terminalKey`.
   */
  readonly proximityEvaluationByTerminalKey?: Readonly<Record<string, ProximityEvaluationResult>>;
}

// ---------------------------------------------------------------------------
// Output / decisions (§3)
// ---------------------------------------------------------------------------

export type ClaimDisposition =
  | "allowed"
  | "blocked"
  | "uncertain"
  /** Dry-run only (8.2C-5) — not production authorization. */
  | "candidate_allowed"
  | "candidate_blocked"
  | "candidate_uncertain"
  /** Dry-run only (8.2C-8) — reality hypothesis, not production supported reality. */
  | "candidate_supported";

export type BlockReasonCode =
  | "forbidden_list"
  | "failed_allOf"
  | "failed_anyOf"
  | "failed_proximity"
  | "failed_lane_scope"
  | "insufficient_evidence_level"
  | "insufficient_confidence"
  | "negative_cue"
  | "trap_cap"
  | "matrix_mismatch"
  /** Evaluator skeleton: no claim may be treated as authorized until full pipeline exists. */
  | "skeleton_no_runtime_authorization"
  /** Reality listed in matrix.blockedRealities — not assertable for this document class. */
  | "matrix_blocked_surface"
  /** Claim-rule dry-run (8.2C-5) — not user-visible production authorization. */
  | "dry_run_candidate_blocked"
  /** Dry-run: required evidence included speculative-only path (8.2C-5). */
  | "speculative_evidence_not_authorizing"
  /** Matrix `blockedRealities` — dry-run reality row only (8.2C-8). */
  | "reality_blocked_by_matrix"
  /** Dry-run: `SeverityRule` declares this reality blocked when present claim candidates fire (8.2C-8). */
  | "dry_run_severity_blocks_reality"
  /** Dry-run: claim candidates exist but matrix does not declare a severity bridge to this reality (8.2C-8). */
  | "dry_run_claim_reality_bridge_pending";

export interface ClaimAuthorization {
  readonly namespaceId: NamespacedClaimId;
  readonly disposition: ClaimDisposition;
  readonly satisfiedRuleIds?: readonly string[];
  readonly blockReason?: BlockReasonCode;
  readonly notes?: string;
  /**
   * When true, this row is **audit / simulation only** (8.2C-5) — not production Smart Talk output.
   */
  readonly dryRun?: boolean;
  /** Always `"dry_run"` when {@link dryRun} is true (8.2C-7 audit clarity). */
  readonly authorizationMode?: "dry_run";
  /**
   * When true, consumers must not surface this row as user-visible authorization (8.2C-7).
   */
  readonly neverUserVisible?: boolean;
  /** Machine-oriented dry-run reason (8.2C-5); not a user-facing explanation. */
  readonly dryRunReason?: string;
  /** Dry-run aggregate confidence from satisfied evidence rules (8.2C-5). */
  readonly confidence?: number;
  /** Weakest evidence level among satisfied required evidence rules (8.2C-5). */
  readonly evidenceLevel?: EvidenceLevel;
}

export interface RealityAuthorization {
  readonly namespaceId: NamespacedRealityId;
  readonly disposition: ClaimDisposition;
  readonly satisfiedRuleIds?: readonly string[];
  readonly blockReason?: BlockReasonCode;
  /** Optional human-readable detail for audit logs. */
  readonly notes?: string;
  /**
   * When true, this row is **audit / simulation only** (8.2C-8) — not production Smart Talk output
   * or user-visible supported reality.
   */
  readonly dryRun?: boolean;
  /** Always `"dry_run"` when {@link dryRun} is true on dry-run reality rows (8.2C-8). */
  readonly authorizationMode?: "dry_run";
  /** When true, consumers must not treat this row as production truth (8.2C-8). */
  readonly neverUserVisible?: boolean;
  /** Machine-oriented dry-run reason (8.2C-8); not a user-facing explanation. */
  readonly dryRunReason?: string;
  /** Conservative aggregate confidence for dry-run rows (8.2C-8). */
  readonly confidence?: number;
  /** Weakest supporting evidence level among contributing matched rules (8.2C-8). */
  readonly evidenceLevel?: EvidenceLevel;
}

export type TrapDisposition =
  | "triggered"
  | "advisory"
  | "skipped"
  /** Dry-run only (8.2C-9) — governance signal, not runtime suppression. */
  | "candidate_triggered"
  | "candidate_not_triggered"
  | "candidate_uncertain";

export interface TrapActivation {
  readonly trapId: string;
  /**
   * Canonical hallucination trap kind identifier.
   * Typed as `HallucinationTrapKind` (8.2F-15B) — previously `string`.
   * Must match a registered entry in `TRAP_METADATA_BY_KIND`.
   */
  readonly trapKind: HallucinationTrapKind;
  readonly disposition: TrapDisposition;
  /** Legacy / human-facing audit line; kept for all rows. */
  readonly rationale: string;
  /**
   * When true, this row is **audit / simulation only** (8.2C-9) — not runtime trap enforcement,
   * not Smart Talk, not user-visible warnings.
   */
  readonly dryRun?: boolean;
  readonly neverUserVisible?: boolean;
  readonly authorizationMode?: "dry_run";
  /** Machine-oriented dry-run reason (8.2C-9). */
  readonly reason?: string;
  /** Conservative confidence for dry-run trigger rows (8.2C-9). */
  readonly confidence?: number;
  readonly supportingClaimIds?: readonly NamespacedClaimId[];
  readonly supportingRealityIds?: readonly NamespacedRealityId[];
  readonly supportingEvidenceRuleIds?: readonly string[];
  readonly notes?: string;
  /** Provenance discriminator for audit consumers (8.2C-9). */
  readonly sourceKind?: "hallucination_trap";
}

export interface StabilizerCandidate {
  /** Matrix `StabilizerRule.id` (stable catalog reference). */
  readonly stabilizerRuleId: string;
  /**
   * Stable dry-run row key (8.2C-10); mirrors {@link stabilizerRuleId} unless a future phase assigns
   * alternate row ids.
   */
  readonly stabilizerId?: string;
  /** Short audit line — must not embed matrix example wording or user-facing copy (8.2C-10). */
  readonly rationale: string;
  /** When true, this row is **trace-only** (8.2C-10) — not Smart Talk output or user-visible text. */
  readonly dryRun?: boolean;
  readonly authorizationMode?: "dry_run";
  readonly neverUserVisible?: boolean;
  /** Machine-oriented dry-run reason (8.2C-10). */
  readonly reason?: string;
  /** Conservative governance confidence (8.2C-10). */
  readonly confidence?: number;
  readonly supportingTrapIds?: readonly string[];
  readonly supportingClaimIds?: readonly NamespacedClaimId[];
  readonly supportingRealityIds?: readonly NamespacedRealityId[];
  readonly notes?: string;
  readonly sourceKind?: "stabilizer";
}

export interface SeverityCandidate {
  readonly band: ProceduralSeverityBand;
  readonly derivedFromRuleIds: readonly string[];
  readonly cappedByTrapIds?: readonly string[];
}

/** Dry-run only (8.2C-11) — not runtime escalation, UI, or Smart Talk. */
export type SeverityDerivationDisposition = "candidate_derived" | "candidate_uncertain" | "candidate_blocked";

/**
 * Severity **dry-run** derivation row (8.2C-11): procedural governance signal only — not user-visible
 * urgency, not legal guarantees, not dashboard priority.
 */
export interface SeverityDerivation {
  readonly severityRuleId: string;
  /** Target band from the matrix `SeverityRule` under evaluation (audit). */
  readonly derivedSeverityBand: ProceduralSeverityBand;
  readonly disposition: SeverityDerivationDisposition;
  readonly dryRun: true;
  readonly authorizationMode: "dry_run";
  readonly neverUserVisible: true;
  readonly reason: string;
  readonly confidence: number;
  readonly supportingClaimIds?: readonly NamespacedClaimId[];
  readonly supportingRealityIds?: readonly NamespacedRealityId[];
  readonly supportingTrapIds?: readonly string[];
  readonly supportingEvidenceRuleIds?: readonly string[];
  readonly notes?: string;
  readonly sourceKind?: "severity_derivation";
}

export interface RuleEvaluationRecord {
  readonly evidenceRuleId: string;
  readonly outcome: "pass" | "fail" | "uncertain";
  readonly contributingHitIndices?: readonly number[];
  readonly subexpressionNotes?: string;
}

export interface GateAuditTrace {
  readonly matrixDocumentType: string;
  readonly matrixSchemaVersion: string;
  readonly matrixMismatchFlag?: boolean;
  readonly cueHits: readonly CueHit[];
  readonly ruleEvaluations: readonly RuleEvaluationRecord[];
  /** Rich per-rule rows from `resolveEvidenceRules` (8.2C-4); claim authorization remains inactive. */
  readonly evidenceRuleResolutionResults?: readonly RuleEvaluationResult[];
  /**
   * Claim-rule **dry-run** only (8.2C-5): `candidate_*` dispositions + `dryRun: true` — never treat as
   * production-allowed claims or Smart Talk output.
   */
  readonly dryRunClaimAuthorizations?: readonly ClaimAuthorization[];
  /**
   * Reality **dry-run** only (8.2C-8): `candidate_*` + `dryRun: true` — never production supported realities,
   * Smart Talk output, or legal truth.
   */
  readonly dryRunRealityAuthorizations?: readonly RealityAuthorization[];
  /**
   * Hallucination trap **dry-run** only (8.2C-9): `candidate_*` dispositions — observability only,
   * not runtime suppression or explanation rewriting.
   */
  readonly dryRunTrapActivations?: readonly TrapActivation[];
  /**
   * Stabilizer **dry-run** only (8.2C-10): governance candidates — never user-visible wording, Smart Talk,
   * or runtime emission.
   */
  readonly dryRunStabilizerCandidates?: readonly StabilizerCandidate[];
  /**
   * Severity **dry-run** derivations only (8.2C-11): governance observability — not runtime escalation,
   * not Smart Talk, not UI urgency.
   */
  readonly dryRunSeverityDerivations?: readonly SeverityDerivation[];
  /**
   * Manual proximity **skeleton** evaluation rows (8.2C-6) — not OCR, layout, or distance-based proof.
   */
  readonly proximityConstraintEvaluationResults?: readonly ProximityEvaluationResult[];
  readonly claimDecisions: readonly ClaimAuthorization[];
  readonly realityDecisions: readonly RealityAuthorization[];
  readonly traps: readonly TrapActivation[];
  readonly stabilizerCandidates: readonly StabilizerCandidate[];
  readonly severity: SeverityCandidate;
  /**
   * Phase 8.2C-1 skeleton / runtime metadata (mandatory for trust-grade debugging once populated).
   */
  readonly traceMetadata?: {
    readonly evaluatorVersion: string;
    readonly stages: readonly string[];
    readonly safetyPosture: string;
    readonly unsupportedFeatures?: readonly string[];
    readonly notes?: readonly string[];
    /** Count after `normalizeCueHits` (8.2C-3). */
    readonly cueHitCount?: number;
    /** Distinct `cueId` values, first-seen order (8.2C-3). */
    readonly normalizedCueIds?: readonly string[];
    /** Distinct `source` values present on normalized hits (8.2C-3). */
    readonly cueHitSources?: readonly CueHitSource[];
    /**
     * How many normalized hits had `matchedText` or `matchedKeyword` before trace redaction
     * (8.2C-3 — avoids echoing raw snippets in `cueHits`).
     */
    readonly matchedTextObservationCount?: number;
    /** Count of `EvidenceRule` rows evaluated in 8.2C-4 (same as resolution result length when matrix present). */
    readonly evidenceRuleEvaluationCount?: number;
    /** Rule ids with `matched: true` in 8.2C-4 resolution. */
    readonly matchedEvidenceRuleIds?: readonly string[];
    /** Rule ids with `matched: false` in 8.2C-4 resolution. */
    readonly unmatchedEvidenceRuleIds?: readonly string[];
    /** Distinct required cue ids that were missing across failed rules (8.2C-4). */
    readonly missingCueSummary?: readonly string[];
    /** Count of claim-rule dry-run rows (8.2C-5). */
    readonly claimAuthorizationDryRunCount?: number;
    /** `claim:*` ids with dry-run `candidate_allowed` (8.2C-5). */
    readonly candidateAllowedClaimIds?: readonly string[];
    /** `claim:*` ids with dry-run `candidate_blocked` (8.2C-5). */
    readonly candidateBlockedClaimIds?: readonly string[];
    /** `claim:*` ids with dry-run `candidate_uncertain` (8.2C-5). */
    readonly candidateUncertainClaimIds?: readonly string[];
    /** Count of reality dry-run rows (8.2C-8). */
    readonly realityAuthorizationDryRunCount?: number;
    /** `reality:*` ids with dry-run `candidate_supported` (8.2C-8). */
    readonly candidateSupportedRealityIds?: readonly string[];
    /** `reality:*` ids with dry-run `candidate_blocked` (8.2C-8; includes matrix-blocked surfaces). */
    readonly candidateBlockedRealityIds?: readonly string[];
    /** `reality:*` ids with dry-run `candidate_uncertain` (8.2C-8). */
    readonly candidateUncertainRealityIds?: readonly string[];
    /** How reality rows were interpreted in this trace (8.2C-8). */
    readonly realityAuthorizationMode?: "dry_run" | "not_applicable";
    /** Count of trap dry-run activation rows (8.2C-9). */
    readonly trapActivationDryRunCount?: number;
    /** Trap ids with dry-run `candidate_triggered` (8.2C-9). */
    readonly candidateTriggeredTrapIds?: readonly string[];
    /** Trap ids with dry-run `candidate_uncertain` (8.2C-9). */
    readonly candidateUncertainTrapIds?: readonly string[];
    /** Trap ids with dry-run `candidate_not_triggered` (8.2C-9). */
    readonly candidateNonTriggeredTrapIds?: readonly string[];
    /** How trap rows were interpreted in this trace (8.2C-9). */
    readonly trapAuthorizationMode?: "dry_run" | "not_applicable";
    /** Count of stabilizer dry-run candidate rows (8.2C-10). */
    readonly stabilizerCandidateCount?: number;
    /** Matrix `StabilizerRule.id` values for dry-run stabilizer candidates (8.2C-10). */
    readonly candidateStabilizerIds?: readonly string[];
    /** Count of severity dry-run derivation rows (8.2C-11). */
    readonly severityDerivationCount?: number;
    /** Distinct `derivedSeverityBand` values where disposition is `candidate_derived` (8.2C-11). */
    readonly candidateDerivedSeverityBands?: readonly ProceduralSeverityBand[];
    /** Distinct `derivedSeverityBand` values where disposition is `candidate_uncertain` (8.2C-11). */
    readonly candidateUncertainSeverityBands?: readonly ProceduralSeverityBand[];
    /** Distinct `derivedSeverityBand` values where disposition is `candidate_blocked` (8.2C-11). */
    readonly candidateBlockedSeverityBands?: readonly ProceduralSeverityBand[];
    /** Count of externally supplied proximity observations passed to trace builder (8.2C-6). */
    readonly proximityObservationCount?: number;
    /** Constraint ids with `matched: true` from manual proximity skeleton evaluation (8.2C-6). */
    readonly matchedProximityConstraintIds?: readonly string[];
    /** Constraint ids with `matched: false` from manual proximity skeleton evaluation (8.2C-6). */
    readonly unresolvedProximityConstraintIds?: readonly string[];
    /** `reality:*` ids for matrix-blocked reality surfaces (8.2C-7). */
    readonly blockedRealityIds?: readonly string[];
    /** Audit-only: production claim authorization is never active in this skeleton (8.2C-7). */
    readonly productionAuthorizationActive?: boolean;
    /** Audit-only: no Smart Talk or downstream production wiring from this evaluator (8.2C-7). */
    readonly productionWiringActive?: boolean;
    /** How claim-rule rows were interpreted in this trace (8.2C-7). */
    readonly claimAuthorizationMode?: "dry_run" | "not_applicable";
    /** How proximity was evaluated for this trace (8.2C-7). */
    readonly proximityMode?: "manual_only" | "not_applicable";
    /** Cue hits are external / manual only in this package (8.2C-7). */
    readonly cueDetectionMode?: "external_manual_only";
    /** Audit-only — always false here; no `documentText` scanning in gates (8.2C-7). */
    readonly textScanningActive?: boolean;
    /** Audit-only — always false here (8.2C-7). */
    readonly regexExecutionActive?: boolean;
    /** Echo of `GateAuditTrace.matrixDocumentType` for single-object trace dumps (8.2C-7). */
    readonly matrixDocumentType?: string;
    /** Echo of `GateAuditTrace.matrixSchemaVersion` for single-object trace dumps (8.2C-7). */
    readonly matrixSchemaVersion?: string;
  };
}

/** Bundle returned by future gate orchestrator — SPEC shape only. */
export interface EvidenceGateDecision {
  readonly input: EvidenceGateInput;
  readonly trace: GateAuditTrace;
}

// ---------------------------------------------------------------------------
// Claim rule sketch — mirrors intent of ClaimRule + algebra (future)
// ---------------------------------------------------------------------------

export interface ClaimAuthorizationSpec {
  readonly claimType: ClaimType;
  readonly expression: RuleExpression;
  readonly minimumConfidence: MatrixConfidenceFloor;
}

// ---------------------------------------------------------------------------
// Rule evaluation result (8.2C-1+ — returned by evaluateRuleExpression)
// ---------------------------------------------------------------------------

/** Provenance of a `RuleEvaluationResult` row for disambiguating generic `ruleId` (8.2C-7). */
export type RuleEvaluationSourceKind =
  | "evidence_rule"
  | "rule_expression"
  | "proximity_constraint"
  | "skeleton";

export interface RuleEvaluationResult {
  readonly matched: boolean;
  readonly confidence: number;
  readonly evidenceLevel?: EvidenceLevel;
  readonly reason: string;
  readonly unsupportedFeatures?: readonly string[];
  /** Which `RuleExpression` op produced this node (audit). */
  readonly expressionKind?: RuleExpression["op"];
  /** Direct child results for composite nodes (audit / debugging). */
  readonly childResults?: readonly RuleEvaluationResult[];
  /** Stable key for terminal nodes (`terminalKey` helper). */
  readonly terminalKey?: string;
  /**
   * When true, parent composites must treat this branch as unknown — never as
   * legal safety from absence (8.2C-2 conservative rules).
   */
  readonly unresolved?: boolean;
  /**
   * Legacy / ambiguous: may mirror {@link evidenceRuleId} on evidence-rule rows or
   * {@link proximityConstraintId} on manual proximity skeleton rows — prefer the explicit ids (8.2C-7).
   */
  readonly ruleId?: string;
  /** Set by `resolveEvidenceRules` (8.2C-4) — equals the matrix `EvidenceRule.id` when present. */
  readonly evidenceRuleId?: string;
  /** Manual proximity skeleton (8.2C-6) — {@link ProximityEvaluationResult.constraintId}; never an evidence rule id. */
  readonly proximityConstraintId?: string;
  /** How this row was produced (8.2C-7). */
  readonly sourceKind?: RuleEvaluationSourceKind;
  readonly requiredCueIds?: readonly string[];
  readonly matchedRequiredCueIds?: readonly string[];
  readonly missingRequiredCueIds?: readonly string[];
  readonly matchedOptionalCueIds?: readonly string[];
  /** Indices into the normalized `cueHits` array supplied to `resolveEvidenceRules`. */
  readonly contributingCueHitIndices?: readonly number[];
  /** Lane-related failure detail for required cues (8.2C-4). */
  readonly requiredCueLaneNotes?: readonly string[];
}
