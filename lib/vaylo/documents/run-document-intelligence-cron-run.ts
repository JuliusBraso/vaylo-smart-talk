import { reprocessStaleDocumentIntelligenceJobs } from "@/lib/vaylo/documents/reprocess-stale-document-intelligence-jobs";
import { runDocumentIntelligenceWorkerOnce } from "@/lib/vaylo/documents/process-document-intelligence-job";

export async function runDocumentIntelligenceWorkerBatch(params?: {
  maxJobs?: number;
  maxDurationMs?: number;
}): Promise<{ processed: number; succeeded: number; failed: number }> {
  const maxJobs = params?.maxJobs ?? 10;
  const maxDurationMs = params?.maxDurationMs ?? 8_000;

  const started = Date.now();
  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < maxJobs; i++) {
    if (Date.now() - started > maxDurationMs) break;
    const res = await runDocumentIntelligenceWorkerOnce();
    if (!res.processed) break;
    processed += 1;
    if (res.ok === false) failed += 1;
    else succeeded += 1;
  }

  return { processed, succeeded, failed };
}

export async function runDocumentIntelligenceCronRun(params?: {
  maxJobs?: number;
  maxDurationMs?: number;
}): Promise<{
  requeued: number;
  processed: number;
  succeeded: number;
  failed: number;
  remainingHint: "unknown_or_not_checked";
}> {
  const requeue = await reprocessStaleDocumentIntelligenceJobs();
  const requeued = requeue.requeuedRunning + requeue.requeuedFailed;

  const batch = await runDocumentIntelligenceWorkerBatch({
    maxJobs: params?.maxJobs,
    maxDurationMs: params?.maxDurationMs,
  });

  console.info("[jobs] document intelligence cron run", {
    requeued,
    processed: batch.processed,
    succeeded: batch.succeeded,
    failed: batch.failed,
  });

  return {
    requeued,
    processed: batch.processed,
    succeeded: batch.succeeded,
    failed: batch.failed,
    remainingHint: "unknown_or_not_checked",
  };
}

