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
  const payload = {
    user_id: userId,
    action_id: actionId,
    status: "completed" satisfies ProgressStatus,
    completed_at: now,
  };

  const { error } = await supabase.from("user_progress").upsert(
    payload,
    { onConflict: "user_id,action_id" }
  );

  if (!error) {
    return { error: null };
  }

  const maybeCode = (error as { code?: string }).code;
  if (maybeCode !== "42P10") {
    return { error };
  }

  // Fallback path for environments where unique constraint wasn't applied yet.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Vaylo][progress] upsert conflict target unavailable; using update/insert fallback"
    );
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("user_progress")
    .update({
      status: "completed" satisfies ProgressStatus,
      completed_at: now,
    })
    .eq("user_id", userId)
    .eq("action_id", actionId)
    .select("user_id")
    .limit(1);

  if (updateError) {
    return { error: updateError };
  }

  if ((updatedRows ?? []).length > 0) {
    return { error: null };
  }

  const { error: insertError } = await supabase
    .from("user_progress")
    .insert(payload);

  // Concurrent insert/update should still be treated as idempotent success.
  if ((insertError as { code?: string } | null)?.code === "23505") {
    return { error: null };
  }

  return { error: insertError ?? null };
}
