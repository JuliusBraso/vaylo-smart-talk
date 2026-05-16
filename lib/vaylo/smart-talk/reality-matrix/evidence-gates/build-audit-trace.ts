import type {
  ClaimAuthorization,
  CueHit,
  CueHitSource,
  EvidenceGateInput,
  GateAuditTrace,
  RealityAuthorization,
  RuleEvaluationRecord,
  RuleEvaluationResult,
  SeverityCandidate,
  StabilizerCandidate,
  TrapActivation,
} from "../evidence-gates-types";

import {
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_SAFETY_POSTURE,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
} from "./constants";

export interface BuildGateAuditTraceParams {
  readonly input: EvidenceGateInput;
  /** Sanitized hits (8.2C-3); trace rows omit matched text fields. */
  readonly normalizedCueHits: readonly CueHit[];
  /** When set (8.2C-4), merged into trace + metadata; does not authorize claims. */
  readonly evidenceRuleResolutionResults?: readonly RuleEvaluationResult[];
  /**
   * Claim-rule dry-run only (8.2C-5). Never production `allowed` / Smart Talk output.
   */
  readonly dryRunClaimAuthorizations?: readonly ClaimAuthorization[];
  readonly claimDecisions: readonly ClaimAuthorization[];
  readonly realityDecisions: readonly RealityAuthorization[];
  readonly ruleEvaluations: readonly RuleEvaluationRecord[];
  readonly traps: readonly TrapActivation[];
  readonly stabilizerCandidates: readonly StabilizerCandidate[];
  readonly severity: SeverityCandidate;
  readonly matrixMismatchFlag?: boolean;
  readonly unsupportedFeatures: readonly string[];
  readonly notes: readonly string[];
}

const CUE_OBSERVATION_NOTE = "cue_hits_observed_but_not_authorized_in_8_2c_3";
const EVIDENCE_RULES_OBSERVATION_NOTE = "evidence_rules_resolved_but_claims_not_authorized_in_8_2c_4";
const CLAIM_DRY_RUN_NOTE = "claim_authorization_dry_run_only_not_user_visible_in_8_2c_5";

function uniqueCueIdsInOrder(hits: readonly CueHit[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of hits) {
    if (seen.has(h.cueId)) continue;
    seen.add(h.cueId);
    out.push(h.cueId);
  }
  return out;
}

function uniqueSourcesSorted(hits: readonly CueHit[]): CueHitSource[] {
  const seen = new Set<CueHitSource>();
  for (const h of hits) {
    seen.add(h.source ?? "manual");
  }
  return [...seen].sort();
}

function countMatchedTextObservations(hits: readonly CueHit[]): number {
  let n = 0;
  for (const h of hits) {
    if (h.matchedText !== undefined && h.matchedText.length > 0) n += 1;
  }
  return n;
}

function buildMissingCueSummary(results: readonly RuleEvaluationResult[]): string[] {
  const s = new Set<string>();
  for (const r of results) {
    for (const id of r.missingRequiredCueIds ?? []) s.add(id);
  }
  return [...s].sort();
}

function dryRunClaimMetadata(auths: readonly ClaimAuthorization[]) {
  return {
    claimAuthorizationDryRunCount: auths.length,
    candidateAllowedClaimIds: auths
      .filter((a) => a.disposition === "candidate_allowed")
      .map((a) => a.namespaceId),
    candidateBlockedClaimIds: auths
      .filter((a) => a.disposition === "candidate_blocked")
      .map((a) => a.namespaceId),
    candidateUncertainClaimIds: auths
      .filter((a) => a.disposition === "candidate_uncertain")
      .map((a) => a.namespaceId),
  };
}

/** Avoid echoing OCR-adjacent snippets in the trace while keeping structural fields. */
function cueHitForTrace(hit: CueHit): CueHit {
  return {
    cueId: hit.cueId,
    source: hit.source ?? "manual",
    ...(hit.lane !== undefined ? { lane: hit.lane } : {}),
    ...(hit.confidence !== undefined ? { confidence: hit.confidence } : {}),
    ...(hit.evidenceLevel !== undefined ? { evidenceLevel: hit.evidenceLevel } : {}),
    ...(hit.startOffset !== undefined ? { startOffset: hit.startOffset } : {}),
    ...(hit.endOffset !== undefined ? { endOffset: hit.endOffset } : {}),
    ...(hit.notes !== undefined && hit.notes.length > 0 ? { notes: hit.notes } : {}),
    ...(hit.ocrFragile !== undefined ? { ocrFragile: hit.ocrFragile } : {}),
  };
}

/**
 * Assembles a `GateAuditTrace` for the evaluator skeleton.
 * Every evaluation path must produce a trace — even when all authorizations are empty.
 */
export function buildGateAuditTrace(params: BuildGateAuditTraceParams): GateAuditTrace {
  const normalized = params.normalizedCueHits;
  const cueHitsForTrace = normalized.map(cueHitForTrace);
  const cueHitCount = normalized.length;
  const normalizedCueIds = uniqueCueIdsInOrder(normalized);
  const cueHitSources = uniqueSourcesSorted(normalized);
  const matchedTextObservationCount = countMatchedTextObservations(normalized);

  const resolution = params.evidenceRuleResolutionResults;
  const traceNotes = [...params.notes, CUE_OBSERVATION_NOTE];
  if (resolution !== undefined) {
    traceNotes.push(EVIDENCE_RULES_OBSERVATION_NOTE);
  }

  const dryRuns = params.dryRunClaimAuthorizations;
  if (dryRuns !== undefined) {
    traceNotes.push(CLAIM_DRY_RUN_NOTE);
  }

  const resolutionMeta =
    resolution !== undefined
      ? {
          evidenceRuleEvaluationCount: resolution.length,
          matchedEvidenceRuleIds: resolution.filter((r) => r.matched).flatMap((r) => (r.ruleId ? [r.ruleId] : [])),
          unmatchedEvidenceRuleIds: resolution.filter((r) => !r.matched).flatMap((r) => (r.ruleId ? [r.ruleId] : [])),
          missingCueSummary: buildMissingCueSummary(resolution),
        }
      : {};

  const dryRunMeta = dryRuns !== undefined ? dryRunClaimMetadata(dryRuns) : {};

  return {
    matrixDocumentType: params.input.matrixDocumentType,
    matrixSchemaVersion: params.input.matrixSchemaVersion,
    matrixMismatchFlag: params.matrixMismatchFlag,
    cueHits: cueHitsForTrace,
    ruleEvaluations: params.ruleEvaluations,
    ...(resolution !== undefined ? { evidenceRuleResolutionResults: resolution } : {}),
    ...(dryRuns !== undefined ? { dryRunClaimAuthorizations: dryRuns } : {}),
    claimDecisions: params.claimDecisions,
    realityDecisions: params.realityDecisions,
    traps: params.traps,
    stabilizerCandidates: params.stabilizerCandidates,
    severity: params.severity,
    traceMetadata: {
      evaluatorVersion: EVIDENCE_GATE_EVALUATOR_VERSION,
      stages: [
        "input_validation",
        "cue_hits_normalized",
        ...(resolution !== undefined ? (["evidence_rules_resolved"] as const) : []),
        ...(dryRuns !== undefined ? (["claim_authorization_dry_run"] as const) : []),
        TRACE_STAGE_SKELETON_NO_RUNTIME,
        "audit_trace_assembled",
      ],
      safetyPosture: SKELETON_SAFETY_POSTURE,
      unsupportedFeatures: params.unsupportedFeatures,
      notes: traceNotes,
      cueHitCount,
      normalizedCueIds,
      cueHitSources,
      matchedTextObservationCount,
      ...resolutionMeta,
      ...dryRunMeta,
    },
  };
}
