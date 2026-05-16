import type { ClaimAuthorization, NamespacedClaimId, RuleEvaluationResult } from "../evidence-gates-types";
import type { ClaimRule, ClaimType, EvidenceLevel, MatrixConfidenceFloor } from "../types";

import { DEFAULT_SKELETON_CONFIDENCE } from "./constants";

const FLOOR_NUM: Record<MatrixConfidenceFloor, number> = {
  low: 1 / 3,
  medium: 2 / 3,
  high: 0.9,
};

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  speculative: 1,
  contextual: 2,
  strongly_supported: 3,
  explicit: 4,
};

function namespacedClaim(claimType: ClaimType): NamespacedClaimId {
  return `claim:${claimType}` as NamespacedClaimId;
}

function matchedEvidenceById(results: readonly RuleEvaluationResult[]): ReadonlyMap<string, RuleEvaluationResult> {
  const m = new Map<string, RuleEvaluationResult>();
  for (const r of results) {
    const key = r.evidenceRuleId ?? r.ruleId;
    if (r.matched && key) m.set(key, r);
  }
  return m;
}

function collectMatchedForRequired(
  required: readonly string[],
  byId: ReadonlyMap<string, RuleEvaluationResult>,
): RuleEvaluationResult[] | undefined {
  const out: RuleEvaluationResult[] = [];
  for (const id of required) {
    const r = byId.get(id);
    if (!r || !r.matched) return undefined;
    out.push(r);
  }
  return out;
}

function minRuleConfidence(matches: readonly RuleEvaluationResult[]): number {
  const vals = matches
    .map((m) => m.confidence)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
  if (vals.length === 0) return DEFAULT_SKELETON_CONFIDENCE;
  return Math.min(...vals);
}

function weakestEvidence(matches: readonly RuleEvaluationResult[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 99;
  for (const m of matches) {
    const el = m.evidenceLevel;
    if (!el) continue;
    const rk = EVIDENCE_RANK[el];
    if (rk < bestRank) {
      bestRank = rk;
      best = el;
    }
  }
  return best;
}

function claimConfidenceFloorMet(floor: MatrixConfidenceFloor, minObserved: number): boolean {
  return minObserved >= FLOOR_NUM[floor];
}

function pass1ForRule(rule: ClaimRule, byId: ReadonlyMap<string, RuleEvaluationResult>): ClaimAuthorization {
  const ns = namespacedClaim(rule.claimType);
  const dryBase = {
    dryRun: true as const,
    authorizationMode: "dry_run" as const,
    neverUserVisible: true as const,
    namespaceId: ns,
  };

  if (!rule.allowed) {
    return {
      ...dryBase,
      disposition: "candidate_blocked",
      dryRunReason: "claim_rule_forbidden_by_matrix",
      blockReason: "forbidden_list",
      confidence: 1,
      notes: "8.2C-5 dry-run: ClaimRule.allowed is false on matrix.",
    };
  }

  const required = rule.requiredEvidenceRuleIds;
  if (required.length === 0) {
    return {
      ...dryBase,
      disposition: "candidate_uncertain",
      dryRunReason: "required_evidence_rules_not_satisfied",
      blockReason: "insufficient_evidence_level",
      confidence: 0,
      notes: "8.2C-5 dry-run: requiredEvidenceRuleIds is empty — AND-only claim path not satisfied.",
    };
  }

  const matched = collectMatchedForRequired(required, byId);
  if (!matched) {
    return {
      ...dryBase,
      disposition: "candidate_uncertain",
      dryRunReason: "required_evidence_rules_not_satisfied",
      blockReason: "insufficient_evidence_level",
      confidence: 0,
      notes: "8.2C-5 dry-run: one or more required evidence rules missing or unmatched.",
    };
  }

  const satisfiedIds = matched.map((m) => m.evidenceRuleId ?? m.ruleId!).filter(Boolean);

  if (matched.some((m) => !m.evidenceLevel)) {
    return {
      ...dryBase,
      disposition: "candidate_uncertain",
      dryRunReason: "missing_evidence_level_on_matched_rule",
      blockReason: "insufficient_evidence_level",
      confidence: 0,
      satisfiedRuleIds: satisfiedIds,
      notes: "8.2C-5 dry-run: matched evidence rule lacks evidenceLevel — cannot authorize.",
    };
  }

  if (matched.some((m) => m.evidenceLevel === "speculative")) {
    return {
      ...dryBase,
      disposition: "candidate_uncertain",
      dryRunReason: "speculative_evidence_not_authorizing",
      blockReason: "speculative_evidence_not_authorizing",
      confidence: 0,
      satisfiedRuleIds: satisfiedIds,
      evidenceLevel: "speculative",
      notes: "8.2C-5 dry-run: speculative evidence must not authorize strict-document paths.",
    };
  }

  const minConf = minRuleConfidence(matched);
  if (!claimConfidenceFloorMet(rule.minimumConfidence, minConf)) {
    return {
      ...dryBase,
      disposition: "candidate_uncertain",
      dryRunReason: "claim_minimum_confidence_not_met",
      blockReason: "insufficient_confidence",
      confidence: 0,
      satisfiedRuleIds: satisfiedIds,
      evidenceLevel: weakestEvidence(matched),
      notes: "8.2C-5 dry-run: ClaimRule.minimumConfidence not met by required evidence rules.",
    };
  }

  return {
    ...dryBase,
    disposition: "candidate_allowed",
    dryRunReason: "dry_run_required_evidence_satisfied_not_production_authorization",
    satisfiedRuleIds: satisfiedIds,
    confidence: minConf,
    evidenceLevel: weakestEvidence(matched),
    notes:
      "8.2C-5 dry-run: required evidence satisfied — NOT production authorization / Smart Talk / user-visible output.",
  };
}

function claimTypeFromNamespace(id: NamespacedClaimId): ClaimType {
  return id.slice("claim:".length) as ClaimType;
}

function applyBlockedByAndForbiddenPeers(
  claimRules: readonly ClaimRule[],
  rows: readonly ClaimAuthorization[],
  forbidden: ReadonlySet<ClaimType> | undefined,
): { rows: ClaimAuthorization[]; unsupportedFeatures: string[] } {
  const unsupportedFeatures: string[] = [];
  const claimTypesWithRules = new Set(claimRules.map((r) => r.claimType));

  for (const r of claimRules) {
    for (const b of r.blockedBy ?? []) {
      if (!claimTypesWithRules.has(b)) {
        unsupportedFeatures.push(`blockedBy_references_missing_claim_rule_row:${b}`);
      }
    }
  }

  let current = rows.map((r) => ({ ...r }));
  const maxIter = Math.max(claimRules.length * 2, 4);

  for (let iter = 0; iter < maxIter; iter++) {
    const allowedTypes = new Set(
      current
        .filter((c) => c.disposition === "candidate_allowed" && c.dryRun)
        .map((c) => claimTypeFromNamespace(c.namespaceId)),
    );

    let changed = false;
    current = current.map((auth, i) => {
      if (auth.disposition !== "candidate_allowed") return auth;
      const rule = claimRules[i];
      for (const b of rule.blockedBy ?? []) {
        if (forbidden?.has(b)) {
          changed = true;
          return {
            ...auth,
            disposition: "candidate_blocked" as const,
            dryRunReason: "blocked_by_forbidden_peer_claim_on_matrix",
            blockReason: "dry_run_candidate_blocked" as const,
            confidence: 0,
            notes: `${auth.notes ?? ""} Blocked by forbiddenClaims peer: ${b}.`.trim(),
          };
        }
        if (allowedTypes.has(b)) {
          changed = true;
          return {
            ...auth,
            disposition: "candidate_blocked" as const,
            dryRunReason: "blocked_by_satisfied_peer_claim",
            blockReason: "dry_run_candidate_blocked" as const,
            confidence: 0,
            notes: `${auth.notes ?? ""} Blocked by satisfied peer claim row: ${b}.`.trim(),
          };
        }
      }
      return auth;
    });

    if (!changed) break;
  }

  current = current.map((auth, i) => {
    if (auth.disposition !== "candidate_allowed") return auth;
    const rule = claimRules[i];
    for (const b of rule.blockedBy ?? []) {
      if (!claimTypesWithRules.has(b) && !forbidden?.has(b)) {
        return {
          ...auth,
          disposition: "candidate_uncertain" as const,
          dryRunReason: "blockedBy_ambiguous_target_not_in_claim_rules",
          blockReason: "insufficient_evidence_level",
          confidence: 0,
          notes: `${auth.notes ?? ""} blockedBy references claim type with no ClaimRule row: ${b}.`.trim(),
        };
      }
    }
    return auth;
  });

  return { rows: current, unsupportedFeatures: [...new Set(unsupportedFeatures)] };
}

export interface ResolveClaimRulesParams {
  readonly claimRules: readonly ClaimRule[];
  readonly evidenceRuleResults: readonly RuleEvaluationResult[];
  readonly forbiddenClaimTypes?: readonly ClaimType[];
}

export interface ResolveClaimRulesOutput {
  readonly authorizations: readonly ClaimAuthorization[];
  readonly unsupportedFeatures: readonly string[];
}

/**
 * Claim-rule **dry-run** (8.2C-5): evaluates `ClaimRule` rows against **already resolved**
 * `RuleEvaluationResult[]` from `resolveEvidenceRules`.
 *
 * Pure: no `documentText`, regex, Smart Talk, or production claim emission.
 */
export function resolveClaimRules(params: ResolveClaimRulesParams): ResolveClaimRulesOutput {
  const { claimRules, evidenceRuleResults, forbiddenClaimTypes } = params;
  const byId = matchedEvidenceById(evidenceRuleResults);
  const forbidden = forbiddenClaimTypes?.length ? new Set(forbiddenClaimTypes) : undefined;

  const pass1 = claimRules.map((rule) => pass1ForRule(rule, byId));
  const { rows, unsupportedFeatures } = applyBlockedByAndForbiddenPeers(claimRules, pass1, forbidden);

  return { authorizations: rows, unsupportedFeatures };
}
