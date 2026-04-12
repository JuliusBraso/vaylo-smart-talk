import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Loads `knowledge_steps.action_id` → step primary key for all active steps that
 * participate in the dashboard bridge.
 */
export async function fetchKnowledgeCatalogActionToStepIdMap(
  supabase: SupabaseClient,
): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("knowledge_steps")
    .select("id, action_id")
    .eq("is_active", true)
    .not("action_id", "is", null);

  if (error) throw error;

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const actionId = typeof row.action_id === "string" ? row.action_id.trim() : "";
    const id = typeof row.id === "string" ? row.id : "";
    if (!actionId || !id) continue;
    if (!map.has(actionId)) {
      map.set(actionId, id);
    }
  }
  return map;
}
