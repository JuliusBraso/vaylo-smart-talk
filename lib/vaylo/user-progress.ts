import type { SupabaseClient } from "@supabase/supabase-js";

export type ProgressStatus = "pending" | "completed";

/**
 * Load action_ids the user has marked completed (for dashboard exclusion).
 */
export async function getCompletedActionIds(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("action_id")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (error || !data) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo][progress] getCompletedActionIds error", error);
    }
    return new Set();
  }

  return new Set(data.map((r) => r.action_id as string));
}

/**
 * Mark a dashboard action as completed (idempotent upsert).
 */
export async function markActionCompleted(
  supabase: SupabaseClient,
  userId: string,
  actionId: string
): Promise<{ error: Error | null }> {
  const now = new Date().toISOString();
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      action_id: actionId,
      status: "completed" satisfies ProgressStatus,
      completed_at: now,
    },
    { onConflict: "user_id,action_id" }
  );

  return { error: error ?? null };
}
