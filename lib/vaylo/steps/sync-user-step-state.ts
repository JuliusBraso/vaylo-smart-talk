import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { chooseStrongerStatus } from "./status-precedence";
import type { ResolvedUserStepState, UserStepSource, UserStepStatus } from "./types";

type Persistable = {
  userId: string;
  stepId: string;
  status: UserStepStatus;
  source: UserStepSource;
  actionId: string | null;
  documentId: string | null;
};

/**
 * Best-effort bulk reconciliation: merges resolved statuses into `user_step_state` using the same
 * {@link chooseStrongerStatus} rule as {@link writeStepTransition}. Prefer targeted
 * {@link writeStepTransition} for discrete events; use this for backfills or repair jobs.
 *
 * Writes use service role (bypass RLS).
 */
export async function syncUserStepState(params: {
  /** Optional: provide an already-created admin client (tests/instrumentation). */
  adminSupabase?: SupabaseClient;
  userId: string;
  resolvedSteps: Record<string, ResolvedUserStepState>;
}): Promise<{ attempted: number; upserted: number; skippedNoAdmin: boolean }> {
  const admin = params.adminSupabase ?? createServiceRoleClient();
  if (!admin) {
    return { attempted: 0, upserted: 0, skippedNoAdmin: true };
  }

  const userId = params.userId;

  // Load existing rows for upgrade-only semantics.
  const { data: existing, error: exErr } = await admin
    .from("user_step_state")
    .select("step_id, status")
    .eq("user_id", userId);
  if (exErr) {
    // Sync should never crash product flows; treat as no-op.
    return { attempted: 0, upserted: 0, skippedNoAdmin: false };
  }

  const existingByStep = new Map<string, UserStepStatus>();
  for (const r of existing ?? []) {
    const row = r as { step_id?: unknown; status?: unknown };
    if (typeof row.step_id === "string" && typeof row.status === "string") {
      existingByStep.set(row.step_id, row.status as UserStepStatus);
    }
  }

  const rows: Persistable[] = [];
  for (const s of Object.values(params.resolvedSteps)) {
    const persisted = existingByStep.get(s.stepId);
    const isMeaningful = s.status === "verified" || s.status === "completed";
    const shouldPersist = isMeaningful || persisted !== undefined;
    if (!shouldPersist) continue;

    const finalStatus = persisted ? chooseStrongerStatus(persisted, s.status) : s.status;
    rows.push({
      userId,
      stepId: s.stepId,
      status: finalStatus,
      source: finalStatus === "verified" ? "proof" : finalStatus === "completed" ? "legacy_progress" : s.source,
      actionId: s.actionId,
      documentId: s.evidence.documentId ?? null,
    });
  }

  if (rows.length === 0) {
    return { attempted: 0, upserted: 0, skippedNoAdmin: false };
  }

  const payload = rows.map((r) => ({
    user_id: r.userId,
    step_id: r.stepId,
    status: r.status,
    source: r.source,
    action_id: r.actionId,
    document_id: r.documentId,
    updated_at: new Date().toISOString(),
  }));

  const { error: upErr } = await admin
    .from("user_step_state")
    .upsert(payload, { onConflict: "user_id,step_id" });

  if (upErr) {
    return { attempted: rows.length, upserted: 0, skippedNoAdmin: false };
  }
  return { attempted: rows.length, upserted: rows.length, skippedNoAdmin: false };
}

