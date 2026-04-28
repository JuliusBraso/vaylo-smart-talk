import type { SupabaseClient } from "@supabase/supabase-js";

export type ProgressStatus = "pending" | "completed";
type ProgressWriteError = Error & {
  code?: string;
  details?: string | null;
  hint?: string | null;
};

function logProgressWrite(
  operation: string,
  userId: string,
  actionId: string,
  error?: unknown
) {
  if (process.env.NODE_ENV === "production") return;
  const e = (error ?? null) as ProgressWriteError | null;
  if (!e) {
    console.info("[Vaylo][progress][write]", {
      operation,
      userId,
      actionId,
      ok: true,
    });
    return;
  }
  console.error("[Vaylo][progress][write]", {
    operation,
    userId,
    actionId,
    ok: false,
    errorCode: e.code ?? null,
    errorMessage: e.message ?? null,
    errorDetails: e.details ?? null,
    errorHint: e.hint ?? null,
    error: e,
  });
}

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
): Promise<{ error: ProgressWriteError | null }> {
  try {
    const now = new Date().toISOString();
    const payload = {
      user_id: userId,
      action_id: actionId,
      status: "completed" satisfies ProgressStatus,
      completed_at: now,
    };

    logProgressWrite("upsert:before", userId, actionId);
    const { error } = await supabase.from("user_progress").upsert(
      payload,
      { onConflict: "user_id,action_id" }
    );
    logProgressWrite("upsert:after", userId, actionId, error ?? undefined);

    if (!error) {
      return { error: null };
    }

    const maybeCode = (error as { code?: string }).code;
    if (maybeCode !== "42P10") {
      return { error: error as ProgressWriteError };
    }

    // Fallback path for environments where unique constraint wasn't applied yet.
    logProgressWrite("fallback:update:before", userId, actionId);
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
    logProgressWrite(
      "fallback:update:after",
      userId,
      actionId,
      updateError ?? undefined
    );

    if (updateError) {
      return { error: updateError as ProgressWriteError };
    }

    if ((updatedRows ?? []).length > 0) {
      return { error: null };
    }

    logProgressWrite("fallback:insert:before", userId, actionId);
    const { error: insertError } = await supabase
      .from("user_progress")
      .insert(payload);
    logProgressWrite(
      "fallback:insert:after",
      userId,
      actionId,
      insertError ?? undefined
    );

    // Concurrent insert/update should still be treated as idempotent success.
    if ((insertError as { code?: string } | null)?.code === "23505") {
      return { error: null };
    }

    return { error: (insertError as ProgressWriteError | null) ?? null };
  } catch (error) {
    logProgressWrite("unexpected:exception", userId, actionId, error);
    const wrapped =
      error instanceof Error
        ? (error as ProgressWriteError)
        : (new Error(String(error)) as ProgressWriteError);
    return { error: wrapped };
  }
}
