import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDashboardActionToKnowledgeCatalogActionId } from "@/lib/dashboard/map-dashboard-action-to-knowledge-catalog-action-id";
import { resolveKnowledgeStepIdForDashboardAction } from "./resolve-knowledge-step-for-action";
import { writeStepTransition } from "./write-step-transition";

/**
 * After `user_progress` records a completed action, persist matching `user_step_state` when
 * the knowledge catalog maps `action_id` → a single active step.
 *
 * Source: `manual` — user explicitly marked the dashboard action done via UI.
 */
export async function recordStepStateAfterActionCompleted(params: {
  supabase: SupabaseClient;
  userId: string;
  dashboardActionId: string;
}): Promise<{ wrote: boolean; stepId?: string }> {
  const stepId = await resolveKnowledgeStepIdForDashboardAction(
    params.supabase,
    params.dashboardActionId,
  );
  if (!stepId) {
    return { wrote: false };
  }

  const catalogActionId = mapDashboardActionToKnowledgeCatalogActionId(params.dashboardActionId);

  const result = await writeStepTransition({
    supabase: params.supabase,
    userId: params.userId,
    stepId,
    nextStatus: "completed",
    source: "manual",
    actionId: catalogActionId,
    documentId: null,
    notes: { bridge: "dashboard_mark_done" },
  });

  return { wrote: result.ok, stepId };
}
