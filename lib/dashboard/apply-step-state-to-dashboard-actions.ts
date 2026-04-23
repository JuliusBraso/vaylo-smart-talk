import type { Dict } from "@/lib/i18n";
import type { GetUserStepStateResult, ResolvedUserStepState } from "@/lib/vaylo/steps/types";
import type { DashboardAction } from "./get-dashboard-actions";

function isCriticalDashboardAction(a: DashboardAction): boolean {
  return a.priority === "critical" || a.id.startsWith("critical-");
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
    case "not_applicable":
      badge = d.stepProcessNotApplicable;
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
    if (resolved.evidence.eligibility?.applicable === false) {
      return { badge, subtle: d.stepProcessNotApplicable };
    }
    return { badge, subtle: d.stepProcessBlockedHint };
  }
  if (proofBacked) {
    return { badge, subtle: proofBacked };
  }
  return { badge };
}

/**
 * Attaches process-state fields for display. Server-side ordering is already
 * step-first + critical-first from `getDashboardActions`; this layer does not reorder.
 */
export function applyStepStateToDashboardActions(
  actions: DashboardAction[],
  stepState: GetUserStepStateResult | undefined,
  t: Dict,
): DashboardAction[] {
  if (!stepState || actions.length === 0) {
    return actions;
  }

  return actions.map((action) => {
    const sid = action.knowledgeStepId;
    if (!sid) {
      return action;
    }
    const resolved = stepState.steps[sid];
    if (!resolved) {
      return action;
    }

    const isBlocked = resolved.status === "blocked";
    const blockedBy = resolved.evidence.blockedByStepIds ?? [];

    if (isCriticalDashboardAction(action)) {
      return {
        ...action,
        stepStatus: resolved.status,
        stepSource: resolved.source,
      };
    }

    const { badge, subtle } = badgeCopy(t, resolved);
    const persistedNotes = resolved.evidence.persisted?.notes ?? null;
    const inferredAutomation =
      resolved.source === "system" ||
      (typeof persistedNotes === "object" &&
        persistedNotes != null &&
        (persistedNotes as { automation?: unknown }).automation === true);
    const inferredConfidenceRaw =
      typeof persistedNotes === "object" && persistedNotes != null
        ? (persistedNotes as { confidence?: unknown }).confidence
        : undefined;
    const inferredConfidence =
      typeof inferredConfidenceRaw === "number" ? inferredConfidenceRaw : undefined;

    const next: DashboardAction = {
      ...action,
      stepStatus: resolved.status,
      stepSource: resolved.source,
      isBlockedByStepState: isBlocked,
      ...(blockedBy.length > 0 ? { blockedByStepIds: blockedBy } : {}),
      isApplicable: resolved.isApplicable,
      ...(resolved.applicabilityReason ? { applicabilityReason: resolved.applicabilityReason } : {}),
      stepProcessBadge: badge,
      ...(subtle ? { stepProcessSubtle: subtle } : {}),
      ...(inferredAutomation ? { isAutomatedBySystem: true } : {}),
      ...(inferredConfidence != null ? { automationConfidence: inferredConfidence } : {}),
      ...(resolved.isApplicable === false ? { isEligible: false } : {}),
    };

    return next;
  });
}
