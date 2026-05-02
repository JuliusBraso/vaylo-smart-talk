import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDashboardActionToKnowledgeCatalogActionId } from "@/lib/dashboard/map-dashboard-action-to-knowledge-catalog-action-id";

/**
 * Resolves at most one `knowledge_steps.id` for a dashboard `action_id` / critical-* id,
 * using the same catalog vocabulary as `mapDashboardActionToKnowledgeCatalogActionId`.
 */
export async function resolveKnowledgeStepIdForDashboardAction(
  supabase: SupabaseClient,
  dashboardActionId: string,
): Promise<string | null> {
  if (dashboardActionId.startsWith("step:")) {
    const stepId = dashboardActionId.slice("step:".length).trim();
    if (!stepId) {
      return null;
    }
    const { data, error } = await supabase
      .from("knowledge_steps")
      .select("id")
      .eq("is_active", true)
      .eq("id", stepId)
      .limit(1)
      .maybeSingle();
    if (error || !data || typeof (data as { id?: unknown }).id !== "string") {
      return null;
    }
    return (data as { id: string }).id;
  }

  const catalogActionId = mapDashboardActionToKnowledgeCatalogActionId(dashboardActionId);
  const { data, error } = await supabase
    .from("knowledge_steps")
    .select("id")
    .eq("is_active", true)
    .eq("action_id", catalogActionId)
    .limit(1)
    .maybeSingle();

  if (error || !data || typeof (data as { id?: unknown }).id !== "string") {
    return null;
  }
  return (data as { id: string }).id;
}
