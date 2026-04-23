import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";

export type ActionExplanation = {
  type: "dependency" | "already_done" | "missing_info" | null;
};

export function getActionExplanation(action: DashboardAction): ActionExplanation {
  const status = action.stepStatus;
  const reason = action.applicabilityReason;

  if (status === "blocked" && (action.blockedByStepIds?.length ?? 0) > 0) {
    return { type: "dependency" };
  }

  if (status === "not_applicable" && reason === "already_satisfied") {
    return { type: "already_done" };
  }

  if (status === "blocked" && reason === "missing_data") {
    return { type: "missing_info" };
  }

  return { type: null };
}

