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
import type { ProximityConstraint, ProximityObservation } from "./proximity-types";

import {
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_SAFETY_POSTURE,
} from "./constants";
import { evaluateProximityConstraints } from "./evaluate-proximity-constraints";
import {
  TRACE_STAGE_AUDIT_TRACE_BUILT,
  TRACE_STAGE_CLAIM_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_CUE_HITS_NORMALIZED,
  TRACE_STAGE_EVIDENCE_RULES_RESOLVED,
  TRACE_STAGE_INPUT_RECEIVED,
  TRACE_STAGE_PROXIMITY_SKELETON,
  TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION,
} from "./trace-constants";

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
  /** Externally supplied proximity observations (8.2C-6); never scanned from `documentText`. */
  readonly proximityObservations?: readonly ProximityObservation[];
  /** Declared proximity constraints to check against observations (8.2C-6). */
  readonly proximityConstraints?: readonly ProximityConstraint[];
}

function dedupeNotesOrdered(chunks: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const chunk of chunks) {
    for (const n of chunk) {
      if (seen.has(n)) continue;
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

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

function evidenceRuleRowId(r: RuleEvaluationResult): string | undefined {
  return r.evidenceRuleId ?? r.ruleId;
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
  const dryRuns = params.dryRunClaimAuthorizations;

  const proxObs = params.proximityObservations;
  const proxCons = params.proximityConstraints;
  const proximityStageActive = proxObs !== undefined || proxCons !== undefined;
  const proximityEval =
    proxCons !== undefined &&
    proxCons.length > 0 &&
    proxObs !== undefined &&
    proxObs.length > 0
      ? evaluateProximityConstraints({ constraints: proxCons, observations: proxObs })
      : undefined;

  const auditWarningExtras: string[] = ["no_production_authorization_active", "cue_hits_are_observations_not_claims"];
  if (dryRuns !== undefined) auditWarningExtras.push("claim_candidates_are_dry_run_only");
  if (proximityStageActive) auditWarningExtras.push("manual_proximity_only_no_text_scanning");

  const traceNotes = dedupeNotesOrdered([params.notes, auditWarningExtras]);

  const resolutionMeta =
    resolution !== undefined
      ? {
          evidenceRuleEvaluationCount: resolution.length,
          matchedEvidenceRuleIds: resolution
            .filter((r) => r.matched)
            .flatMap((r) => {
              const id = evidenceRuleRowId(r);
              return id ? [id] : [];
            }),
          unmatchedEvidenceRuleIds: resolution
            .filter((r) => !r.matched)
            .flatMap((r) => {
              const id = evidenceRuleRowId(r);
              return id ? [id] : [];
            }),
          missingCueSummary: buildMissingCueSummary(resolution),
        }
      : {};

  const dryRunMeta = dryRuns !== undefined ? dryRunClaimMetadata(dryRuns) : {};

  const proximityMeta = {
    ...(proxObs !== undefined ? { proximityObservationCount: proxObs.length } : {}),
    ...(proximityEval !== undefined
      ? {
          matchedProximityConstraintIds: proximityEval.filter((p) => p.matched).map((p) => p.constraintId),
          unresolvedProximityConstraintIds: proximityEval.filter((p) => !p.matched).map((p) => p.constraintId),
        }
      : {}),
  };

  const blockedRealityIds = params.realityDecisions
    .filter((r) => r.disposition === "blocked")
    .map((r) => r.namespaceId);

  const stages: string[] = [
    TRACE_STAGE_INPUT_RECEIVED,
    TRACE_STAGE_CUE_HITS_NORMALIZED,
    ...(resolution !== undefined ? [TRACE_STAGE_EVIDENCE_RULES_RESOLVED] : []),
    ...(dryRuns !== undefined ? [TRACE_STAGE_CLAIM_AUTHORIZATION_DRY_RUN] : []),
    ...(proximityStageActive ? [TRACE_STAGE_PROXIMITY_SKELETON] : []),
    TRACE_STAGE_AUDIT_TRACE_BUILT,
    TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION,
  ];

  return {
    matrixDocumentType: params.input.matrixDocumentType,
    matrixSchemaVersion: params.input.matrixSchemaVersion,
    matrixMismatchFlag: params.matrixMismatchFlag,
    cueHits: cueHitsForTrace,
    ruleEvaluations: params.ruleEvaluations,
    ...(resolution !== undefined ? { evidenceRuleResolutionResults: resolution } : {}),
    ...(dryRuns !== undefined ? { dryRunClaimAuthorizations: dryRuns } : {}),
    ...(proximityEval !== undefined ? { proximityConstraintEvaluationResults: proximityEval } : {}),
    claimDecisions: params.claimDecisions,
    realityDecisions: params.realityDecisions,
    traps: params.traps,
    stabilizerCandidates: params.stabilizerCandidates,
    severity: params.severity,
    traceMetadata: {
      evaluatorVersion: EVIDENCE_GATE_EVALUATOR_VERSION,
      stages,
      safetyPosture: SKELETON_SAFETY_POSTURE,
      unsupportedFeatures: params.unsupportedFeatures,
      notes: traceNotes,
      cueHitCount,
      normalizedCueIds,
      cueHitSources,
      matchedTextObservationCount,
      productionAuthorizationActive: false,
      productionWiringActive: false,
      claimAuthorizationMode: dryRuns !== undefined ? "dry_run" : "not_applicable",
      proximityMode: proximityStageActive ? "manual_only" : "not_applicable",
      cueDetectionMode: "external_manual_only",
      textScanningActive: false,
      regexExecutionActive: false,
      matrixDocumentType: params.input.matrixDocumentType,
      matrixSchemaVersion: params.input.matrixSchemaVersion,
      ...(blockedRealityIds.length > 0 ? { blockedRealityIds } : {}),
      ...resolutionMeta,
      ...dryRunMeta,
      ...proximityMeta,
    },
  };
}
