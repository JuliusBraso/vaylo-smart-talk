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
  MatrixConfidenceFloor,
  ProceduralLane,
  ProceduralSeverityBand,
  RealityType,
  UniversalDocumentRealityMatrix,
} from "./types";

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
  | "candidate_uncertain";

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
  | "speculative_evidence_not_authorizing";

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
}

export type TrapDisposition = "triggered" | "advisory" | "skipped";

export interface TrapActivation {
  readonly trapId: string;
  readonly trapKind: string;
  readonly disposition: TrapDisposition;
  readonly rationale: string;
}

export interface StabilizerCandidate {
  readonly stabilizerRuleId: string;
  readonly rationale: string;
}

export interface SeverityCandidate {
  readonly band: ProceduralSeverityBand;
  readonly derivedFromRuleIds: readonly string[];
  readonly cappedByTrapIds?: readonly string[];
}

// ---------------------------------------------------------------------------
// Audit trace (§16)
// ---------------------------------------------------------------------------

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
  /** Set by `resolveEvidenceRules` (8.2C-4) — {@link EvidenceRule.id}. */
  readonly ruleId?: string;
  readonly requiredCueIds?: readonly string[];
  readonly matchedRequiredCueIds?: readonly string[];
  readonly missingRequiredCueIds?: readonly string[];
  readonly matchedOptionalCueIds?: readonly string[];
  /** Indices into the normalized `cueHits` array supplied to `resolveEvidenceRules`. */
  readonly contributingCueHitIndices?: readonly number[];
  /** Lane-related failure detail for required cues (8.2C-4). */
  readonly requiredCueLaneNotes?: readonly string[];
}
