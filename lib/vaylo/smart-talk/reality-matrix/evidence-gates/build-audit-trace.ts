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
  SeverityDerivation,
  StabilizerCandidate,
  TrapActivation,
} from "../evidence-gates-types";
import type { ProceduralSeverityBand } from "../types";
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
  TRACE_STAGE_REALITY_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_SEVERITY_DERIVATION_DRY_RUN,
  TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION,
  TRACE_STAGE_STABILIZER_CANDIDATE_DRY_RUN,
  TRACE_STAGE_TRAP_ACTIVATION_DRY_RUN,
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
  /** Reality dry-run only (8.2C-8). */
  readonly dryRunRealityAuthorizations?: readonly RealityAuthorization[];
  /** Trap activation dry-run only (8.2C-9). */
  readonly dryRunTrapActivations?: readonly TrapActivation[];
  /** Stabilizer candidate dry-run only (8.2C-10). */
  readonly dryRunStabilizerCandidates?: readonly StabilizerCandidate[];
  /** Severity derivation dry-run only (8.2C-11). */
  readonly dryRunSeverityDerivations?: readonly SeverityDerivation[];
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

function dryRunRealityMetadata(auths: readonly RealityAuthorization[]) {
  return {
    realityAuthorizationDryRunCount: auths.length,
    candidateSupportedRealityIds: auths
      .filter((a) => a.disposition === "candidate_supported")
      .map((a) => a.namespaceId),
    candidateBlockedRealityIds: auths
      .filter((a) => a.disposition === "candidate_blocked")
      .map((a) => a.namespaceId),
    candidateUncertainRealityIds: auths
      .filter((a) => a.disposition === "candidate_uncertain")
      .map((a) => a.namespaceId),
  };
}

function dryRunTrapMetadata(rows: readonly TrapActivation[]) {
  return {
    trapActivationDryRunCount: rows.length,
    candidateTriggeredTrapIds: rows.filter((t) => t.disposition === "candidate_triggered").map((t) => t.trapId),
    candidateUncertainTrapIds: rows.filter((t) => t.disposition === "candidate_uncertain").map((t) => t.trapId),
    candidateNonTriggeredTrapIds: rows.filter((t) => t.disposition === "candidate_not_triggered").map((t) => t.trapId),
  };
}

function dryRunStabilizerMetadata(rows: readonly StabilizerCandidate[]) {
  return {
    stabilizerCandidateCount: rows.length,
    candidateStabilizerIds: rows.map((r) => r.stabilizerRuleId),
  };
}

const SEVERITY_BAND_ORDER: Record<ProceduralSeverityBand, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function uniqueSortedSeverityBands(bands: readonly ProceduralSeverityBand[]): ProceduralSeverityBand[] {
  return [...new Set(bands)].sort((a, b) => SEVERITY_BAND_ORDER[a] - SEVERITY_BAND_ORDER[b]);
}

function dryRunSeverityMetadata(rows: readonly SeverityDerivation[]) {
  return {
    severityDerivationCount: rows.length,
    candidateDerivedSeverityBands: uniqueSortedSeverityBands(
      rows.filter((r) => r.disposition === "candidate_derived").map((r) => r.derivedSeverityBand),
    ),
    candidateUncertainSeverityBands: uniqueSortedSeverityBands(
      rows.filter((r) => r.disposition === "candidate_uncertain").map((r) => r.derivedSeverityBand),
    ),
    candidateBlockedSeverityBands: uniqueSortedSeverityBands(
      rows.filter((r) => r.disposition === "candidate_blocked").map((r) => r.derivedSeverityBand),
    ),
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
  const dryRunRealities = params.dryRunRealityAuthorizations;
  const dryRunTraps = params.dryRunTrapActivations;
  const dryRunStabilizers = params.dryRunStabilizerCandidates;
  const dryRunSeverities = params.dryRunSeverityDerivations;

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
  if (dryRunRealities !== undefined) auditWarningExtras.push("reality_authorization_dry_run_only_not_user_visible_in_8_2c_8");
  if (dryRunTraps !== undefined) auditWarningExtras.push("trap_activation_dry_run_only_not_runtime_enforced_in_8_2c_9");
  if (dryRunStabilizers !== undefined) auditWarningExtras.push("stabilizer_candidates_dry_run_only_not_user_visible_in_8_2c_10");
  if (dryRunSeverities !== undefined) auditWarningExtras.push("severity_derivation_dry_run_only_not_runtime_enforced_in_8_2c_11");
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
  const dryRunRealityMeta = dryRunRealities !== undefined ? dryRunRealityMetadata(dryRunRealities) : {};
  const dryRunTrapMeta = dryRunTraps !== undefined ? dryRunTrapMetadata(dryRunTraps) : {};
  const dryRunStabilizerMeta = dryRunStabilizers !== undefined ? dryRunStabilizerMetadata(dryRunStabilizers) : {};
  const dryRunSeverityMeta = dryRunSeverities !== undefined ? dryRunSeverityMetadata(dryRunSeverities) : {};

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
    ...(dryRunRealities !== undefined ? [TRACE_STAGE_REALITY_AUTHORIZATION_DRY_RUN] : []),
    ...(dryRunTraps !== undefined ? [TRACE_STAGE_TRAP_ACTIVATION_DRY_RUN] : []),
    ...(dryRunStabilizers !== undefined ? [TRACE_STAGE_STABILIZER_CANDIDATE_DRY_RUN] : []),
    ...(dryRunSeverities !== undefined ? [TRACE_STAGE_SEVERITY_DERIVATION_DRY_RUN] : []),
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
    ...(dryRunRealities !== undefined ? { dryRunRealityAuthorizations: dryRunRealities } : {}),
    ...(dryRunTraps !== undefined ? { dryRunTrapActivations: dryRunTraps } : {}),
    ...(dryRunStabilizers !== undefined ? { dryRunStabilizerCandidates: dryRunStabilizers } : {}),
    ...(dryRunSeverities !== undefined ? { dryRunSeverityDerivations: dryRunSeverities } : {}),
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
      realityAuthorizationMode: dryRunRealities !== undefined ? "dry_run" : "not_applicable",
      trapAuthorizationMode: dryRunTraps !== undefined ? "dry_run" : "not_applicable",
      proximityMode: proximityStageActive ? "manual_only" : "not_applicable",
      cueDetectionMode: "external_manual_only",
      textScanningActive: false,
      regexExecutionActive: false,
      matrixDocumentType: params.input.matrixDocumentType,
      matrixSchemaVersion: params.input.matrixSchemaVersion,
      ...(blockedRealityIds.length > 0 ? { blockedRealityIds } : {}),
      ...resolutionMeta,
      ...dryRunMeta,
      ...dryRunRealityMeta,
      ...dryRunTrapMeta,
      ...dryRunStabilizerMeta,
      ...dryRunSeverityMeta,
      ...proximityMeta,
    },
  };
}
