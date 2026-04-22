import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  claimNextDocumentIntelligenceJob,
  markDocumentIntelligenceJobCompleted,
  markDocumentIntelligenceJobFailed,
  type DocumentIntelligenceJobRow,
} from "@/lib/vaylo/documents/document-intelligence-jobs";
import { processDocumentIntelligence } from "@/lib/vaylo/documents/process-document-intelligence";

function safeErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "unknown_error";
  }
}

export async function runDocumentIntelligenceWorkerOnce(params?: {
  leaseSeconds?: number;
}): Promise<{ processed: boolean; jobId?: string }> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.warn("[documents intelligence job ERROR]", { reason: "no_service_role" });
    return { processed: false };
  }

  let job: DocumentIntelligenceJobRow | null = null;
  try {
    job = await claimNextDocumentIntelligenceJob({
      supabase: admin,
      leaseSeconds: params?.leaseSeconds ?? 120,
    });
  } catch (err) {
    console.error("[documents intelligence job CLAIM]", err);
    return { processed: false };
  }

  if (!job) {
    return { processed: false };
  }

  console.info("[documents intelligence job START]", {
    jobId: job.id,
    userId: job.user_id,
    documentId: job.document_id,
    attempt: job.attempt_count,
  });

  try {
    await processDocumentIntelligence({
      supabase: admin,
      userId: job.user_id,
      documentId: job.document_id,
    });
    await markDocumentIntelligenceJobCompleted({ supabase: admin, jobId: job.id });
    console.info("[documents intelligence job COMPLETE]", { jobId: job.id });
    return { processed: true, jobId: job.id };
  } catch (err) {
    const msg = safeErrMessage(err);
    console.error("[documents intelligence job FAIL]", { jobId: job.id, err });
    try {
      await markDocumentIntelligenceJobFailed({
        supabase: admin,
        jobId: job.id,
        errorMessage: msg,
        rescheduleInSeconds: 300,
      });
    } catch (markErr) {
      console.error("[documents intelligence job FAIL]", { jobId: job.id, markErr });
    }
    return { processed: true, jobId: job.id };
  }
}

