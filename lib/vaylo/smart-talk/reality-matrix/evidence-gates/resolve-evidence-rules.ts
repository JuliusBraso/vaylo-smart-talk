import type { CueHit, RuleEvaluationResult } from "../evidence-gates-types";
import type { EvidenceLevel, EvidenceRule, MatrixConfidenceFloor } from "../types";

import { DEFAULT_SKELETON_CONFIDENCE } from "./constants";

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  speculative: 1,
  contextual: 2,
  strongly_supported: 3,
  explicit: 4,
};

const CONFIDENCE_FLOOR_MIN: Record<MatrixConfidenceFloor, number> = {
  low: 1 / 3,
  medium: 2 / 3,
  high: 0.9,
};

const RESOLUTION_UNSUPPORTED = ["evidence_rule_resolution_v1_direct_and_only"] as const;

function numericConfidenceMeetsFloor(confidence: number, floor: MatrixConfidenceFloor): boolean {
  return confidence >= CONFIDENCE_FLOOR_MIN[floor];
}

function laneConstraintActive(rule: EvidenceRule): boolean {
  return rule.allowedLanes.length > 0;
}

function hitPassesLane(hit: CueHit, rule: EvidenceRule): boolean {
  if (!laneConstraintActive(rule)) return true;
  return hit.lane !== undefined && rule.allowedLanes.includes(hit.lane);
}

function hitPassesEvidenceLevel(hit: CueHit, rule: EvidenceRule): boolean {
  if (hit.evidenceLevel === undefined) return false;
  return EVIDENCE_RANK[hit.evidenceLevel] >= EVIDENCE_RANK[rule.minimumEvidenceLevel];
}

function hitPassesMinConfidence(hit: CueHit, rule: EvidenceRule): boolean {
  if (rule.minConfidence === undefined) return true;
  if (hit.confidence === undefined || !Number.isFinite(hit.confidence)) return false;
  return numericConfidenceMeetsFloor(hit.confidence, rule.minConfidence);
}

function hitQualifiesForRule(hit: CueHit, rule: EvidenceRule): boolean {
  return hitPassesLane(hit, rule) && hitPassesEvidenceLevel(hit, rule) && hitPassesMinConfidence(hit, rule);
}

function weakestEvidenceLevel(levels: readonly EvidenceLevel[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 99;
  for (const l of levels) {
    const rk = EVIDENCE_RANK[l];
    if (rk < bestRank) {
      bestRank = rk;
      best = l;
    }
  }
  return best;
}

function optionalCuesPresent(rule: EvidenceRule, cueHits: readonly CueHit[]): string[] {
  const opt = rule.optionalCueIds;
  if (!opt?.length) return [];
  const hitIds = new Set(cueHits.map((h) => h.cueId));
  return opt.filter((id) => hitIds.has(id));
}

export interface ResolveEvidenceRulesParams {
  readonly rules: readonly EvidenceRule[];
  readonly cueHits: readonly CueHit[];
}

/**
 * Pure **EvidenceRule** resolution (8.2C-4): normalized `CueHit[]` vs matrix `EvidenceRule[]`.
 *
 * Does not read `documentText`, execute regex, infer new hits or lanes, or authorize claims.
 * AND-only over `requiredCueIds` within each rule; OR paths remain separate matrix rows.
 */
export function resolveEvidenceRules(params: ResolveEvidenceRulesParams): RuleEvaluationResult[] {
  const { rules, cueHits } = params;
  const out: RuleEvaluationResult[] = [];

  for (const rule of rules) {
    const requiredUnique = [...new Set(rule.requiredCueIds)];
    const matchedOptionalCueIds = optionalCuesPresent(rule, cueHits);

    if (requiredUnique.length === 0) {
      out.push({
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: "empty_required_cues_not_authorized",
        ruleId: rule.id,
        requiredCueIds: [...rule.requiredCueIds],
        matchedRequiredCueIds: [],
        missingRequiredCueIds: [],
        matchedOptionalCueIds: [...matchedOptionalCueIds],
        unsupportedFeatures: [...RESOLUTION_UNSUPPORTED, "empty_required_cues_not_authorized"],
      });
      continue;
    }

    const matchedRequiredCueIds: string[] = [];
    const contributingCueHitIndices: number[] = [];
    const requiredCueLaneNotes: string[] = [];
    let blockedReason: string | undefined;
    const featureAcc = new Set<string>(RESOLUTION_UNSUPPORTED);

    for (const reqId of requiredUnique) {
      let found: { index: number; hit: CueHit } | undefined;
      for (let i = 0; i < cueHits.length; i++) {
        const hit = cueHits[i];
        if (hit.cueId !== reqId) continue;
        if (!hitQualifiesForRule(hit, rule)) continue;
        found = { index: i, hit };
        break;
      }

      if (!found) {
        const sameId = cueHits.filter((h) => h.cueId === reqId);
        if (sameId.length === 0) {
          blockedReason = "missing_required_cue";
          featureAcc.add("missing_required_cue");
        } else {
          for (const hit of sameId) {
            if (!hitPassesLane(hit, rule)) {
              const rc =
                laneConstraintActive(rule) && hit.lane === undefined ? "missing_lane" : "lane_not_allowed";
              requiredCueLaneNotes.push(`${reqId}:${rc}`);
              featureAcc.add(rc);
              blockedReason = blockedReason ?? rc;
            } else if (!hitPassesEvidenceLevel(hit, rule)) {
              featureAcc.add("evidence_level_gate");
              blockedReason = blockedReason ?? "missing_evidence_level_or_below_minimum";
            } else if (!hitPassesMinConfidence(hit, rule)) {
              featureAcc.add("min_confidence_gate");
              blockedReason = blockedReason ?? "missing_confidence_or_below_floor";
            }
          }
          if (!blockedReason) blockedReason = "missing_required_cue";
        }

        out.push({
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: blockedReason,
          ruleId: rule.id,
          requiredCueIds: [...rule.requiredCueIds],
          matchedRequiredCueIds: [...matchedRequiredCueIds],
          missingRequiredCueIds: requiredUnique.filter((id) => !matchedRequiredCueIds.includes(id)),
          matchedOptionalCueIds: [...matchedOptionalCueIds],
          contributingCueHitIndices:
            contributingCueHitIndices.length > 0 ? [...contributingCueHitIndices] : undefined,
          requiredCueLaneNotes: requiredCueLaneNotes.length > 0 ? [...requiredCueLaneNotes] : undefined,
          unsupportedFeatures: [...featureAcc],
        });
        break;
      }

      matchedRequiredCueIds.push(reqId);
      contributingCueHitIndices.push(found.index);
    }

    if (matchedRequiredCueIds.length !== requiredUnique.length) {
      continue;
    }

    const contributingHits = contributingCueHitIndices.map((i) => cueHits[i]);
    const levels = contributingHits
      .map((h) => h.evidenceLevel)
      .filter((l): l is EvidenceLevel => l !== undefined);
    const evidenceLevel = weakestEvidenceLevel(levels);

    const confidences = contributingHits
      .map((h) => h.confidence)
      .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
    const confidence = confidences.length > 0 ? Math.min(...confidences) : DEFAULT_SKELETON_CONFIDENCE;

    out.push({
      matched: true,
      confidence,
      evidenceLevel,
      reason: "required_cues_matched",
      ruleId: rule.id,
      requiredCueIds: [...rule.requiredCueIds],
      matchedRequiredCueIds: [...matchedRequiredCueIds],
      missingRequiredCueIds: [],
      matchedOptionalCueIds: [...matchedOptionalCueIds],
      contributingCueHitIndices: [...contributingCueHitIndices],
      unsupportedFeatures: [...RESOLUTION_UNSUPPORTED],
    });
  }

  return out;
}
