import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { compareStatus, mergeWithExistingStatus } from "./status-precedence";
import type { UserStepSource, UserStepStatus } from "./types";

export type WriteStepTransitionInput = {
  supabase: SupabaseClient;
  userId: string;
  stepId: string;
  nextStatus: UserStepStatus;
  source: UserStepSource;
  actionId?: string | null;
  documentId?: string | null;
  notes?: Record<string, unknown> | null;
};

export type WriteStepTransitionResult = {
  ok: boolean;
  /** Status actually stored (after merge with existing row). */
  finalStatus?: UserStepStatus;
  skippedNoServiceRole?: boolean;
  error?: string;
};

/**
 * Controlled writer for `user_step_state`. Reads existing row with the caller's client (RLS),
 * merges with {@link mergeWithExistingStatus}, upserts via service role (RLS has no client writes).
 */
export async function writeStepTransition(
  input: WriteStepTransitionInput,
): Promise<WriteStepTransitionResult> {
  const admin = createServiceRoleClient();
  if (!admin) {
    return { ok: false, skippedNoServiceRole: true, error: "no_service_role" };
  }

  const { supabase, userId, stepId, nextStatus, source, actionId, documentId, notes } = input;

  const { data: existingRow, error: readErr } = await supabase
    .from("user_step_state")
    .select("status, source")
    .eq("user_id", userId)
    .eq("step_id", stepId)
    .maybeSingle();

  if (readErr) {
    return { ok: false, error: readErr.message };
  }

  const existingStatus =
    existingRow && typeof (existingRow as { status?: unknown }).status === "string"
      ? ((existingRow as { status: string }).status as UserStepStatus)
      : null;

  const finalStatus = mergeWithExistingStatus(existingStatus, nextStatus);

  /** If existing row was strictly stronger than proposed, keep prior source (e.g. verified vs completed). */
  const resolvedSource: UserStepSource =
    existingStatus != null && compareStatus(finalStatus, nextStatus) > 0 && existingRow
      ? (typeof (existingRow as { source?: unknown }).source === "string"
          ? ((existingRow as { source: string }).source as UserStepSource)
          : source)
      : source;

  const payload = {
    user_id: userId,
    step_id: stepId,
    status: finalStatus,
    source: resolvedSource,
    action_id: actionId ?? null,
    document_id: documentId ?? null,
    notes: notes ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await admin.from("user_step_state").upsert(payload, {
    onConflict: "user_id,step_id",
  });

  if (upErr) {
    return { ok: false, error: upErr.message };
  }

  return { ok: true, finalStatus };
}
