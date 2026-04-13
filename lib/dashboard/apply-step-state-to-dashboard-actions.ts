import type { Dict } from "@/lib/i18n";
import type {
  GetUserStepStateResult,
  ResolvedUserStepState,
  UserStepStatus,
} from "@/lib/vaylo/steps/types";
import type { DashboardAction } from "./get-dashboard-actions";

function isCriticalDashboardAction(a: DashboardAction): boolean {
  return a.priority === "critical" || a.id.startsWith("critical-");
}

/**
 * Sort adjustment for mapped non-critical actions only.
 * Lower = earlier in list. Critical actions use 0 (no step-based reorder).
 */
function stepSortDelta(status: UserStepStatus | undefined): number {
  if (!status) return 0;
  switch (status) {
    case "eligible":
      return -0.4;
    case "in_progress":
      return -0.2;
    case "blocked":
      return 0.55;
    case "verified":
      return 0.48;
    case "completed":
      return 0.62;
    default:
      return 0;
  }
}

function badgeCopy(
  t: Dict,
  resolved: ResolvedUserStepState,
): { badge: string; subtle?: string } {
  const d = t.dashboard;
  const status = resolved.status;
  const proofBacked =
    resolved.source === "proof" && status === "verified"
      ? d.stepProcessProofBacked
      : undefined;

  let badge: string;
  switch (status) {
    case "verified":
      badge = d.stepProcessVerified;
      break;
    case "completed":
      badge = d.stepProcessCompleted;
      break;
    case "eligible":
      badge = d.stepProcessEligible;
      break;
    case "blocked":
      badge = d.stepProcessBlocked;
      break;
    case "in_progress":
      badge = d.stepProcessInProgress;
      break;
    default:
      badge = d.stepProcessEligible;
  }

  if (status === "blocked") {
    return { badge, subtle: d.stepProcessBlockedHint };
  }
  if (proofBacked) {
    return { badge, subtle: proofBacked };
  }
  return { badge };
}

/**
 * Attaches optional process-state fields and reorders up to 3 actions:
 * - Critical actions stay first (relative order preserved); step-state does not demote them.
 * - Non-critical mapped actions are reordered by step status (eligible preferred; blocked/verified/completed deprioritized).
 * - Unmapped actions keep scorer order among non-critical (delta 0).
 */
export function applyStepStateToDashboardActions(
  actions: DashboardAction[],
  stepState: GetUserStepStateResult | undefined,
  t: Dict,
): DashboardAction[] {
  if (!stepState || actions.length === 0) {
    return actions;
  }

  const indexed = actions.map((action, originalIndex) => {
    const sid = action.knowledgeStepId;
    if (!sid) {
      return { action, originalIndex };
    }
    const resolved = stepState.steps[sid];
    if (!resolved) {
      return { action, originalIndex };
    }

    const isBlocked = resolved.status === "blocked";
    const blockedBy = resolved.evidence.blockedByStepIds ?? [];

    /** Critical cards keep scorer/existing UX; omit process pills to avoid conflicting messaging. */
    if (isCriticalDashboardAction(action)) {
      return {
        action: {
          ...action,
          stepStatus: resolved.status,
          stepSource: resolved.source,
        },
        originalIndex,
      };
    }

    const { badge, subtle } = badgeCopy(t, resolved);

    const next: DashboardAction = {
      ...action,
      stepStatus: resolved.status,
      stepSource: resolved.source,
      isBlockedByStepState: isBlocked,
      ...(blockedBy.length > 0 ? { blockedByStepIds: blockedBy } : {}),
      stepProcessBadge: badge,
      ...(subtle ? { stepProcessSubtle: subtle } : {}),
    };

    return { action: next, originalIndex };
  });

  const critical = indexed.filter(({ action }) => isCriticalDashboardAction(action));
  const nonCritical = indexed.filter(({ action }) => !isCriticalDashboardAction(action));

  nonCritical.sort((a, b) => {
    const idA = a.action.knowledgeStepId;
    const idB = b.action.knowledgeStepId;
    const stA = idA ? stepState.steps[idA]?.status : undefined;
    const stB = idB ? stepState.steps[idB]?.status : undefined;
    const keyA = a.originalIndex + stepSortDelta(stA);
    const keyB = b.originalIndex + stepSortDelta(stB);
    if (keyA !== keyB) return keyA - keyB;
    return a.originalIndex - b.originalIndex;
  });

  return [...critical, ...nonCritical].map(({ action }) => action);
}
