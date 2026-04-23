import { mapDashboardActionToKnowledgeCatalogActionId } from "@/lib/dashboard/map-dashboard-action-to-knowledge-catalog-action-id";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";

/**
 * Internal wide pool before Top-3 (same cap as Phase 3.4; scorer builds this list).
 */
export const WIDE_DASHBOARD_CANDIDATE_POOL_MAX = 10;

/**
 * Dashboard “next slot” priority for mapped actions (lower = prefer for Top 3).
 *
 * This is **not** `statusRank` in `status-precedence.ts` — that module remains the
 * canonical source for proof/merge strength (verified > completed > …).
 * Here we only order which step states deserve dashboard airtime next:
 * ready-to-act first; terminal states last.
 */
export function dashboardNextStepSlotRank(
  action: { id: string },
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult,
): number {
  const catalogId = mapDashboardActionToKnowledgeCatalogActionId(action.id);
  const stepId = catalogActionToStepId.get(catalogId);
  if (!stepId) {
    return 35;
  }
  const resolved = stepState.steps[stepId];
  if (!resolved) {
    return 37;
  }
  switch (resolved.status) {
    case "not_applicable":
      // Never prefer in Top 3; used only as last-resort filler if nothing else exists.
      return 999;
    case "eligible":
      return 10;
    case "in_progress":
      return 20;
    case "blocked":
      return 50;
    case "verified":
      return 70;
    case "completed":
      return 80;
    default:
      return 40;
  }
}

/**
 * Step-first non-critical Top N: sort the scorer’s wide greedy list by process-truth rank,
 * then scorer index as tiebreaker (preserves legacy ordering within the same rank).
 */
export function selectStepFirstNonCriticalFromWide<T extends { id: string }>(
  wide: T[],
  need: number,
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult,
): { result: T[]; changedFromScorerBaseline: boolean; details?: string } {
  if (need <= 0 || wide.length === 0) {
    return { result: [], changedFromScorerBaseline: false };
  }

  const notApplicableIds = new Set<string>();
  for (const a of wide) {
    const catalogId = mapDashboardActionToKnowledgeCatalogActionId(a.id);
    const stepId = catalogActionToStepId.get(catalogId);
    if (!stepId) continue;
    const st = stepState.steps[stepId]?.status;
    if (st === "not_applicable") {
      notApplicableIds.add(a.id);
    }
  }
  const candidates = wide.filter((a) => !notApplicableIds.has(a.id));
  const baseForSort = candidates.length > 0 ? candidates : wide;

  const indexById = new Map(baseForSort.map((a, i) => [a.id, i]));
  const sorted = [...baseForSort].sort((a, b) => {
    const ra = dashboardNextStepSlotRank(a, catalogActionToStepId, stepState);
    const rb = dashboardNextStepSlotRank(b, catalogActionToStepId, stepState);
    if (ra !== rb) return ra - rb;
    return (indexById.get(a.id) ?? 0) - (indexById.get(b.id) ?? 0);
  });

  const result = sorted.slice(0, need);
  const baseline = wide.slice(0, need);
  const changed =
    result.length !== baseline.length ||
    result.some((r, i) => r.id !== baseline[i]?.id);

  return {
    result,
    changedFromScorerBaseline: changed,
    ...(changed
      ? {
          details: `step-first: [${baseline.map((b) => b.id).join(",")}] -> [${result.map((r) => r.id).join(",")}]`,
        }
      : {}),
  };
}
