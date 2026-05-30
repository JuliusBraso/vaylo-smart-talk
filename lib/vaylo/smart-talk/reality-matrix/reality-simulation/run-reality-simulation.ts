import type {
  ClaimAuthorization,
  GateAuditTrace,
  RealityAuthorization,
  SeverityDerivation,
  StabilizerCandidate,
  TrapActivation,
} from "../evidence-gates-types";
import type { ClaimType, HallucinationTrapKind, ProceduralSeverityBand, RealityType } from "../types";
import { TRAP_METADATA_BY_KIND } from "./trap-metadata-registry";
import type {
  ExplanationBoundary,
  RealitySimulationResult,
  RunRealitySimulationParams,
  SimulationClaimCandidate,
  SimulationRealityCandidate,
  SimulationReviewFlag,
  SimulationUncertaintyReason,
  SeverityPostureCandidate,
  StabilizerNeed,
  TrapWarning,
} from "../reality-simulation-types";

/** 8.2D-1 skeleton — governance mapping only; not wired to Smart Talk or UI. */
export const REALITY_SIMULATION_SKELETON_VERSION = "8.2d-1-reality-simulation-skeleton-v1";

const BAND_ORDER: Record<ProceduralSeverityBand, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function realityTypeFromNamespace(ns: string): RealityType | undefined {
  if (!ns.startsWith("reality:")) return undefined;
  return ns.slice("reality:".length) as RealityType;
}

function claimTypeFromNamespace(ns: string): ClaimType | undefined {
  if (!ns.startsWith("claim:")) return undefined;
  return ns.slice("claim:".length) as ClaimType;
}

function maxSeverityBand(bands: readonly ProceduralSeverityBand[]): ProceduralSeverityBand | undefined {
  if (bands.length === 0) return undefined;
  let best = bands[0]!;
  for (const b of bands) {
    if (BAND_ORDER[b] > BAND_ORDER[best]) best = b;
  }
  return best;
}

function mergeBlockedFromRealityDecisions(
  existing: SimulationRealityCandidate[],
  rows: readonly RealityAuthorization[],
): SimulationRealityCandidate[] {
  const seen = new Set(existing.map((e) => e.realityType));
  const out = [...existing];
  for (const r of rows) {
    if (r.disposition !== "blocked") continue;
    const rt = realityTypeFromNamespace(r.namespaceId);
    if (!rt || seen.has(rt)) continue;
    seen.add(rt);
    out.push({
      realityType: rt,
      disposition: "blocked",
      reasonCode: r.blockReason ?? "trace_reality_decision_blocked",
      notes: r.notes,
    });
  }
  return out;
}

function mapDryRunRealities(rows: readonly RealityAuthorization[] | undefined): {
  supported: SimulationRealityCandidate[];
  blocked: SimulationRealityCandidate[];
  uncertain: SimulationRealityCandidate[];
} {
  const supported: SimulationRealityCandidate[] = [];
  const blocked: SimulationRealityCandidate[] = [];
  const uncertain: SimulationRealityCandidate[] = [];
  if (!rows) return { supported, blocked, uncertain };
  for (const r of rows) {
    const rt = realityTypeFromNamespace(r.namespaceId);
    if (!rt) continue;
    if (r.disposition === "candidate_supported") {
      supported.push({
        realityType: rt,
        disposition: "supported_candidate",
        reasonCode: "dry_run_reality_candidate_supported",
        notes: r.dryRunReason,
      });
    } else if (r.disposition === "candidate_blocked") {
      blocked.push({
        realityType: rt,
        disposition: "blocked",
        reasonCode: r.blockReason ?? "dry_run_reality_candidate_blocked",
        notes: r.dryRunReason,
      });
    } else if (r.disposition === "candidate_uncertain") {
      uncertain.push({
        realityType: rt,
        disposition: "uncertain",
        reasonCode: r.dryRunReason ?? "dry_run_reality_candidate_uncertain",
        notes: r.dryRunReason,
      });
    }
  }
  return { supported, blocked, uncertain };
}

function mapClaimDecisions(rows: readonly ClaimAuthorization[]): SimulationClaimCandidate[] {
  const out: SimulationClaimCandidate[] = [];
  for (const c of rows) {
    const ct = claimTypeFromNamespace(c.namespaceId);
    if (!ct) continue;
    if (c.disposition === "uncertain") {
      out.push({
        claimType: ct,
        disposition: "considered_candidate",
        reasonCode: "trace_claim_decision_skeleton_uncertain_not_authorized",
        notes: c.notes,
      });
    } else if (c.disposition === "blocked") {
      out.push({
        claimType: ct,
        disposition: "blocked_candidate",
        reasonCode: c.blockReason ?? "trace_claim_decision_blocked",
        notes: c.notes,
      });
    }
  }
  return out;
}

function mapDryRunClaims(rows: readonly ClaimAuthorization[] | undefined): SimulationClaimCandidate[] {
  const out: SimulationClaimCandidate[] = [];
  if (!rows) return out;
  for (const c of rows) {
    const ct = claimTypeFromNamespace(c.namespaceId);
    if (!ct) continue;
    if (c.disposition === "candidate_allowed") {
      out.push({
        claimType: ct,
        disposition: "considered_candidate",
        reasonCode: c.dryRunReason ?? "dry_run_claim_candidate_allowed",
        notes: c.notes,
      });
    } else if (c.disposition === "candidate_blocked") {
      out.push({
        claimType: ct,
        disposition: "blocked_candidate",
        reasonCode: c.dryRunReason ?? "dry_run_claim_candidate_blocked",
        notes: c.notes,
      });
    } else if (c.disposition === "candidate_uncertain") {
      out.push({
        claimType: ct,
        disposition: "hidden_candidate",
        reasonCode: c.dryRunReason ?? "dry_run_claim_candidate_uncertain",
        notes: c.notes,
      });
    }
  }
  return out;
}

function mapTraps(rows: readonly TrapActivation[] | undefined): TrapWarning[] {
  const out: TrapWarning[] = [];
  if (!rows) return out;
  for (const t of rows) {
    if (t.disposition === "candidate_triggered") {
      out.push({
        trapId: t.trapId,
        influence: "boundary_candidate",
        reasonCode: t.reason ?? "dry_run_trap_candidate_triggered",
      });
    } else if (t.disposition === "candidate_uncertain") {
      out.push({
        trapId: t.trapId,
        influence: "uncertainty",
        reasonCode: t.reason ?? "dry_run_trap_candidate_uncertain",
      });
    }
  }
  return out;
}

function mapStabilizers(rows: readonly StabilizerCandidate[] | undefined): StabilizerNeed[] {
  const out: StabilizerNeed[] = [];
  if (!rows) return out;
  for (const s of rows) {
    out.push({
      stabilizerRuleId: s.stabilizerRuleId,
      category: "stabilizer_governance_candidate",
      linkedTrapIds: s.supportingTrapIds,
      linkedRealityTypes: s.supportingRealityIds?.map((id) => realityTypeFromNamespace(id)).filter((x): x is RealityType => !!x),
      linkedClaimTypes: s.supportingClaimIds?.map((id) => claimTypeFromNamespace(id)).filter((x): x is ClaimType => !!x),
      reasonCode: s.reason ?? "dry_run_stabilizer_candidate_present",
    });
  }
  return out;
}

function severityPostureFromDerivations(rows: readonly SeverityDerivation[] | undefined): SeverityPostureCandidate | undefined {
  if (!rows?.length) return undefined;
  const derivedBands = rows.filter((d) => d.disposition === "candidate_derived").map((d) => d.derivedSeverityBand);
  const max = maxSeverityBand(derivedBands);
  if (max === undefined) {
    const anyUncertain = rows.some((d) => d.disposition === "candidate_uncertain");
    if (!anyUncertain) return undefined;
    return {
      band: "none",
      source: "dry_run_severity_derivation",
      neverUserVisible: true,
      reviewNeeded: true,
      reasonCode: "dry_run_severity_only_uncertain_or_blocked",
    };
  }
  return {
    band: max,
    source: "dry_run_severity_derivation",
    neverUserVisible: true,
    reviewNeeded: rows.some((d) => d.disposition === "candidate_uncertain" || d.disposition === "candidate_blocked"),
    reasonCode: "dry_run_severity_candidate_derived_band_max",
  };
}

function buildUncertaintyReasons(params: {
  readonly uncertainRealities: SimulationRealityCandidate[];
  readonly uncertainTraps: boolean;
  readonly speculativeFeature: boolean;
  readonly matrixMismatch: boolean;
}): SimulationUncertaintyReason[] {
  const out: SimulationUncertaintyReason[] = [];
  for (const r of params.uncertainRealities) {
    out.push({
      code: "dry_run_reality_uncertain",
      detail: r.realityType,
    });
  }
  if (params.uncertainTraps) {
    out.push({ code: "dry_run_trap_ambiguity" });
  }
  if (params.speculativeFeature) {
    out.push({ code: "speculative_support_signal_in_trace_metadata" });
  }
  if (params.matrixMismatch) {
    out.push({ code: "matrix_snapshot_mismatch_with_flat_fields" });
  }
  return out;
}

function buildReviewFlags(params: {
  readonly matrixMismatch: boolean;
  readonly speculativeFeature: boolean;
  readonly trapTriggered: boolean;
  readonly trapUncertain: boolean;
  readonly severityBand?: ProceduralSeverityBand;
  readonly contradictorySeverityTrap: boolean;
}): SimulationReviewFlag[] {
  const out: SimulationReviewFlag[] = [];
  if (params.matrixMismatch) {
    out.push({ flagId: "matrix_mismatch_detected", reasonCode: "trace_matrixMismatchFlag_true" });
  }
  if (params.speculativeFeature) {
    out.push({ flagId: "speculative_support_present", reasonCode: "trace_metadata_unsupported_features_speculative" });
  }
  if (params.trapTriggered || params.trapUncertain) {
    out.push({ flagId: "escalation_ambiguity", reasonCode: "dry_run_trap_activation_present" });
  }
  if (params.trapTriggered && params.severityBand && BAND_ORDER[params.severityBand] >= BAND_ORDER.medium) {
    out.push({
      flagId: "contradictory_world_state",
      reasonCode: "dry_run_severity_posture_with_active_trap_governance_tension",
    });
  }
  if (params.severityBand === "critical" || params.matrixMismatch || params.speculativeFeature) {
    out.push({ flagId: "human_review_recommended", reasonCode: "simulation_conservative_high_risk_signal" });
  }
  if (params.trapTriggered && (params.severityBand === "high" || params.severityBand === "critical")) {
    out.push({ flagId: "high_consequence_domain", reasonCode: "trap_triggered_with_high_severity_posture_candidate" });
  }
  return dedupeReviewFlags(out);
}

function dedupeReviewFlags(flags: readonly SimulationReviewFlag[]): SimulationReviewFlag[] {
  const seen = new Set<string>();
  const out: SimulationReviewFlag[] = [];
  for (const f of flags) {
    const k = `${f.flagId}:${f.reasonCode}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(f);
  }
  return out;
}

/** Aggregate governance flags derived from active trap activations via structured metadata. */
interface TrapGovernanceFlags {
  readonly isEnforcementRelated: boolean;
  readonly isEscalationRelated: boolean;
  readonly isDeadlineRelated: boolean;
  readonly isLaneContaminationRelated: boolean;
  /** trapKind strings not present in TRAP_METADATA_BY_KIND at runtime. */
  readonly unregisteredTrapKinds: readonly string[];
}

/**
 * Derives structured governance flags from active trap activations by looking up each
 * `trapKind` in `TRAP_METADATA_BY_KIND` (Phase 8.2D-5A — replaces `enforcementTrapHeuristic`).
 *
 * Behavior:
 * - Only `candidate_triggered` and `candidate_uncertain` traps contribute flags.
 * - For each active trap: look up metadata by trapKind. OR the boolean flags across all matches.
 * - If a trapKind is absent from the registry (not a key of TRAP_METADATA_BY_KIND at runtime):
 *     conservative fallback — treat as enforcement + escalation; record in unregisteredTrapKinds.
 *     Callers must surface unregisteredTrapKinds as an uncertainty reason.
 *     Note: TrapActivation.trapKind is now typed as HallucinationTrapKind (8.2F-15B);
 *     the unregistered branch is a future-proof guard against incomplete registry states.
 *
 * No string parsing. No substring checks. No regex.
 * No modification of trap activation semantics or Evidence Gate resolver behavior.
 */
function buildTrapGovernanceFlags(traps: readonly TrapActivation[] | undefined): TrapGovernanceFlags {
  if (!traps) {
    return {
      isEnforcementRelated: false,
      isEscalationRelated: false,
      isDeadlineRelated: false,
      isLaneContaminationRelated: false,
      unregisteredTrapKinds: [],
    };
  }

  let isEnforcementRelated = false;
  let isEscalationRelated = false;
  let isDeadlineRelated = false;
  let isLaneContaminationRelated = false;
  const unregisteredTrapKinds: string[] = [];

  for (const t of traps) {
    if (t.disposition !== "candidate_triggered" && t.disposition !== "candidate_uncertain") continue;

    // Look up metadata by key. TrapActivation.trapKind is now typed as HallucinationTrapKind
    // (8.2F-15B). Defensive `in` check retained for runtime safety: TRAP_METADATA_BY_KIND
    // satisfies Record<HallucinationTrapKind, TrapMetadataDefinition> at compile time,
    // but the `in` check guards against incomplete registry states across future phases.
    const meta =
      t.trapKind in TRAP_METADATA_BY_KIND
        ? TRAP_METADATA_BY_KIND[t.trapKind as HallucinationTrapKind]
        : undefined;

    if (!meta) {
      // Conservative fallback for unregistered trap kinds — assume enforcement + escalation
      // until the registry is updated. Callers add an uncertainty reason for each such kind.
      isEnforcementRelated = true;
      isEscalationRelated = true;
      unregisteredTrapKinds.push(t.trapKind);
      continue;
    }

    if (meta.isEnforcementRelated) isEnforcementRelated = true;
    if (meta.isEscalationRelated) isEscalationRelated = true;
    if (meta.isDeadlineRelated) isDeadlineRelated = true;
    if (meta.isLaneContaminationRelated) isLaneContaminationRelated = true;
  }

  return { isEnforcementRelated, isEscalationRelated, isDeadlineRelated, isLaneContaminationRelated, unregisteredTrapKinds };
}

/**
 * Maps governance flags to ExplanationBoundary tokens for RealitySimulationResult.
 *
 * Phase 8.2D-5A changes vs skeleton:
 * - `do_not_claim_enforcement` is now driven by `trapFlags.isEnforcementRelated` (precise)
 *   rather than any active trap (broad) + substring heuristic (coarse).
 * - `do_not_merge_lanes` is now driven by `trapFlags.isLaneContaminationRelated` (precise)
 *   rather than any active trap (broad).
 * - `require_uncertainty_wording` now also fires when `trapFlags.isEscalationRelated` is set.
 * - `do_not_calculate_deadline` remains unconditional (it was already; `isDeadlineRelated`
 *   is available for future scoped deadline governance).
 */
function buildExplanationBoundaries(params: {
  readonly hasUncertainRealities: boolean;
  readonly trapUncertain: boolean;
  readonly speculativeFeature: boolean;
  readonly matrixMismatch: boolean;
  readonly trapFlags: TrapGovernanceFlags;
}): ExplanationBoundary[] {
  const set = new Set<ExplanationBoundary>();
  set.add("do_not_present_dry_run_as_fact");
  set.add("do_not_present_speculation_as_fact");
  set.add("do_not_calculate_deadline");
  set.add("do_not_merge_payment_and_appeal");

  if (params.trapFlags.isEnforcementRelated) {
    set.add("do_not_claim_enforcement");
  }
  if (params.trapFlags.isLaneContaminationRelated) {
    set.add("do_not_merge_lanes");
  }
  if (
    params.hasUncertainRealities ||
    params.trapUncertain ||
    params.speculativeFeature ||
    params.trapFlags.isEscalationRelated
  ) {
    set.add("require_uncertainty_wording");
  }
  if (params.matrixMismatch || params.speculativeFeature) {
    set.add("recommend_human_review_high_risk");
  }
  return [...set];
}

function speculativeUnsupportedFeature(meta: GateAuditTrace["traceMetadata"]): boolean {
  const u = meta?.unsupportedFeatures;
  if (!u) return false;
  return u.some((s) => s.includes("speculative") || s.includes("speculation"));
}

function pickContradictorySeverityTrap(severity: SeverityPostureCandidate | undefined, trapTriggered: boolean): boolean {
  if (!severity || !trapTriggered) return false;
  return BAND_ORDER[severity.band] >= BAND_ORDER.medium;
}

/**
 * Pure **pre-explanation governance** skeleton (8.2D-1): maps Evidence Gates **trace-only** dry-run
 * structures into `RealitySimulationResult`. No `documentText`, no OCR span inspection, no regex,
 * no user-visible prose, no Smart Talk.
 *
 * Reads: `trace.claimDecisions`, `trace.realityDecisions` (blocked rows merged into blocked reality candidates),
 * `trace.dryRunClaimAuthorizations`, `trace.dryRunRealityAuthorizations`, `trace.dryRunTrapActivations`,
 * `trace.dryRunStabilizerCandidates`, `trace.dryRunSeverityDerivations`, `trace.traceMetadata`, and trace matrix identity fields.
 * Does **not** iterate `cueHits` or evidence resolution text.
 */
export function runRealitySimulation(params: RunRealitySimulationParams): RealitySimulationResult {
  const trace = params.evidenceGateDecision.trace;
  const meta = trace.traceMetadata;
  const matrixMismatch = !!trace.matrixMismatchFlag;

  const { supported, blocked, uncertain } = mapDryRunRealities(trace.dryRunRealityAuthorizations);
  const blockedMerged = mergeBlockedFromRealityDecisions(blocked, trace.realityDecisions);
  const dryClaims = mapDryRunClaims(trace.dryRunClaimAuthorizations);
  const skeletonClaims = mapClaimDecisions(trace.claimDecisions);
  const claimSource = dryClaims.length > 0 ? dryClaims : skeletonClaims;
  const consideredClaimCandidates = claimSource.filter((c) => c.disposition === "considered_candidate");
  const blockedClaimCandidates = claimSource.filter(
    (c) => c.disposition === "blocked_candidate" || c.disposition === "hidden_candidate",
  );

  const trapRows = trace.dryRunTrapActivations;
  const trapWarnings = mapTraps(trapRows);
  const stabilizerNeeds = mapStabilizers(trace.dryRunStabilizerCandidates);
  const severityPostureCandidate = severityPostureFromDerivations(trace.dryRunSeverityDerivations);

  const trapTriggered = trapRows?.some((t) => t.disposition === "candidate_triggered") ?? false;
  const trapUncertain = trapRows?.some((t) => t.disposition === "candidate_uncertain") ?? false;
  const speculativeF = speculativeUnsupportedFeature(meta);
  const trapFlags = buildTrapGovernanceFlags(trapRows);

  // Build base uncertainty reasons then append any for unregistered trap kinds.
  const uncertaintyReasons = buildUncertaintyReasons({
    uncertainRealities: uncertain,
    uncertainTraps: trapUncertain,
    speculativeFeature: speculativeF,
    matrixMismatch,
  });
  for (const kind of trapFlags.unregisteredTrapKinds) {
    uncertaintyReasons.push({ code: "unregistered_trap_metadata", detail: kind });
  }

  const reviewFlags = buildReviewFlags({
    matrixMismatch,
    speculativeFeature: speculativeF,
    trapTriggered,
    trapUncertain,
    severityBand: severityPostureCandidate?.band,
    contradictorySeverityTrap: pickContradictorySeverityTrap(severityPostureCandidate, trapTriggered),
  });

  const explanationBoundaries = buildExplanationBoundaries({
    hasUncertainRealities: uncertain.length > 0,
    trapUncertain,
    speculativeFeature: speculativeF,
    matrixMismatch,
    trapFlags,
  });

  const forbiddenExplanationMoves: readonly string[] = [
    "assert_dry_run_claim_as_user_fact",
    "assert_dry_run_reality_as_legal_truth",
    "synthesize_calendar_deadline_from_relative_legal_text",
    "use_severity_posture_for_ui_urgency",
  ];

  const auditTraceRef = `8.2d-1|${REALITY_SIMULATION_SKELETON_VERSION}|${trace.matrixDocumentType}|${trace.matrixSchemaVersion}|${meta?.evaluatorVersion ?? "no_evaluator_version"}`;

  return {
    ...(supported.length ? { supportedRealityCandidates: supported } : {}),
    ...(blockedMerged.length ? { blockedRealities: blockedMerged } : {}),
    ...(uncertain.length ? { uncertainRealities: uncertain } : {}),
    ...(consideredClaimCandidates.length ? { consideredClaimCandidates } : {}),
    ...(blockedClaimCandidates.length ? { blockedClaimCandidates } : {}),
    ...(uncertaintyReasons.length ? { uncertaintyReasons } : {}),
    ...(trapWarnings.length ? { trapWarnings } : {}),
    ...(stabilizerNeeds.length ? { stabilizerNeeds } : {}),
    ...(severityPostureCandidate ? { severityPostureCandidate } : {}),
    ...(explanationBoundaries.length ? { explanationBoundaries } : {}),
    ...(forbiddenExplanationMoves.length ? { forbiddenExplanationMoves } : {}),
    ...(reviewFlags.length ? { reviewFlags } : {}),
    auditTraceRef,
  };
}
