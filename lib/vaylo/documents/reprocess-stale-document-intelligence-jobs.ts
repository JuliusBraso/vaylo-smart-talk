import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function reprocessStaleDocumentIntelligenceJobs(params?: {
  /** Consider running jobs stale after this many seconds past lease expiry. */
  leaseGraceSeconds?: number;
  /** Requeue failed jobs scheduled before now when attempt_count < maxAttempts. */
  maxAttempts?: number;
}): Promise<{ requeuedRunning: number; requeuedFailed: number }> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.warn("[documents intelligence job STALE RETRY]", { reason: "no_service_role" });
    return { requeuedRunning: 0, requeuedFailed: 0 };
  }

  const grace = params?.leaseGraceSeconds ?? 0;
  const maxAttempts = params?.maxAttempts ?? 3;

  // A) Requeue expired leases.
  const { data: staleRows, error: staleErr } = await admin
    .from("document_intelligence_jobs")
    .update({
      status: "queued",
      lease_token: null,
      lease_expires_at: null,
    })
    .eq("status", "running")
    .lt("lease_expires_at", new Date(Date.now() - grace * 1000).toISOString())
    .select("id");

  if (staleErr) {
    console.error("[documents intelligence job STALE RETRY]", staleErr);
  }

  // B) Requeue failed jobs that are due and under attempt cap.
  const { data: failedRows, error: failedErr } = await admin
    .from("document_intelligence_jobs")
    .update({
      status: "queued",
      lease_token: null,
      lease_expires_at: null,
    })
    .eq("status", "failed")
    .lt("scheduled_at", new Date().toISOString())
    .lt("attempt_count", maxAttempts)
    .select("id");

  if (failedErr) {
    console.error("[documents intelligence job STALE RETRY]", failedErr);
  }

  const requeuedRunning = (staleRows ?? []).length;
  const requeuedFailed = (failedRows ?? []).length;

  if (requeuedRunning > 0 || requeuedFailed > 0) {
    console.info("[documents intelligence job STALE RETRY]", {
      requeuedRunning,
      requeuedFailed,
    });
  }

  return { requeuedRunning, requeuedFailed };
}

