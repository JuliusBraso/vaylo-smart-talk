/**
 * PHASE 8.2C-0 — Evidence Gates: TYPE SKETCHES ONLY.
 *
 * SPEC ONLY — NOT RUNTIME. No functions. No evaluation logic.
 * See EVIDENCE_GATES_SPEC.md for behavioral contract.
 */

import type {
  ClaimType,
  EvidenceLevel,
  MatrixConfidenceFloor,
  ProceduralLane,
  ProceduralSeverityBand,
  RealityType,
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

export interface CueHit {
  readonly cueId: string;
  readonly span: TextSpan;
  /** After lane assignment stage (§15). */
  readonly lane: ProceduralLane | "unassigned";
  readonly matchedKeyword?: string;
  readonly ocrFragile?: boolean;
}

export interface EvidenceGateInput {
  readonly documentText: string;
  readonly ocrQuality: OcrQualityHint;
  readonly matrixDocumentType: string;
  readonly matrixSchemaVersion: string;
  /** Precomputed cue hits — produced by future stage 1; may be empty in sketches. */
  readonly cueHits: readonly CueHit[];
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

// ---------------------------------------------------------------------------
// Output / decisions (§3)
// ---------------------------------------------------------------------------

export type ClaimDisposition = "allowed" | "blocked" | "uncertain";

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
  | "matrix_mismatch";

export interface ClaimAuthorization {
  readonly namespaceId: NamespacedClaimId;
  readonly disposition: ClaimDisposition;
  readonly satisfiedRuleIds?: readonly string[];
  readonly blockReason?: BlockReasonCode;
  readonly notes?: string;
}

export interface RealityAuthorization {
  readonly namespaceId: NamespacedRealityId;
  readonly disposition: ClaimDisposition;
  readonly satisfiedRuleIds?: readonly string[];
  readonly blockReason?: BlockReasonCode;
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
  readonly claimDecisions: readonly ClaimAuthorization[];
  readonly realityDecisions: readonly RealityAuthorization[];
  readonly traps: readonly TrapActivation[];
  readonly stabilizerCandidates: readonly StabilizerCandidate[];
  readonly severity: SeverityCandidate;
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
