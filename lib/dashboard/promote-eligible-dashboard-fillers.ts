import { mapDashboardActionToKnowledgeCatalogActionId } from "@/lib/dashboard/map-dashboard-action-to-knowledge-catalog-action-id";
import type { GetUserStepStateResult, UserStepStatus } from "@/lib/vaylo/steps/types";

/** Internal wide pool cap before Top-3 selection (Phase 3.4). */
export const WIDE_DASHBOARD_CANDIDATE_POOL_MAX = 10;

function catalogStepIdForAction(
  action: { id: string },
  catalogActionToStepId: Map<string, string>,
): string | null {
  const catalogId = mapDashboardActionToKnowledgeCatalogActionId(action.id);
  return catalogActionToStepId.get(catalogId) ?? null;
}

function resolvedStatus(
  stepId: string | null,
  stepState: GetUserStepStateResult,
): UserStepStatus | undefined {
  if (!stepId) return undefined;
  return stepState.steps[stepId]?.status;
}

/**
 * True when this action is mapped and step-state says it is ready to act.
 */
function isEligiblePromoter(
  action: { id: string },
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult,
): boolean {
  const sid = catalogStepIdForAction(action, catalogActionToStepId);
  const st = resolvedStatus(sid, stepState);
  return st === "eligible";
}

/**
 * Higher = worse as a "next step" for replacement purposes.
 * Unmapped or missing resolution: not replaceable (tier -1).
 */
function replaceabilityTier(
  action: { id: string },
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult,
): number {
  const sid = catalogStepIdForAction(action, catalogActionToStepId);
  const st = resolvedStatus(sid, stepState);
  if (!sid || !st) return -1;

  switch (st) {
    case "completed":
      return 50;
    case "verified":
      return 40;
    case "blocked":
      return 30;
    case "in_progress":
      return 20;
    case "eligible":
      return -1;
    default:
      return -1;
  }
}

function isReplaceableSlot(
  action: { id: string },
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult,
): boolean {
  return replaceabilityTier(action, catalogActionToStepId, stepState) >= 20;
}

/**
 * Second pass after scorer has ranked a wider greedy list: prefer mapped eligible
 * actions from the tail over mapped non-ready slots in the baseline shortlist.
 * Does not touch unmapped slots (scorer order preserved there).
 */
export function promoteWideNonCriticalFillers<T extends { id: string }>(
  wide: T[],
  need: number,
  catalogActionToStepId: Map<string, string>,
  stepState: GetUserStepStateResult | undefined,
): { result: T[]; promoted: boolean; details?: string } {
  if (!stepState || need <= 0 || wide.length === 0) {
    return { result: wide.slice(0, need), promoted: false };
  }

  let selected = wide.slice(0, need);
  const promotions: string[] = [];
  let changed = true;

  while (changed) {
    changed = false;
    for (const cand of wide) {
      if (!isEligiblePromoter(cand, catalogActionToStepId, stepState)) continue;
      if (selected.some((s) => s.id === cand.id)) continue;

      let worstIdx = -1;
      let worstTier = -1;
      for (let j = 0; j < selected.length; j++) {
        const slot = selected[j]!;
        if (!isReplaceableSlot(slot, catalogActionToStepId, stepState)) continue;
        const t = replaceabilityTier(slot, catalogActionToStepId, stepState);
        if (t > worstTier) {
          worstTier = t;
          worstIdx = j;
        }
      }

      if (worstIdx >= 0) {
        const prev = selected[worstIdx]!;
        selected = [...selected];
        selected[worstIdx] = cand;
        promotions.push(`${prev.id}->${cand.id}`);
        changed = true;
        break;
      }
    }
  }

  const promoted = promotions.length > 0;
  return {
    result: selected,
    promoted,
    ...(promoted ? { details: promotions.join("; ") } : {}),
  };
}
