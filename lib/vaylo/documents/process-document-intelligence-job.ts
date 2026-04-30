import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  claimNextDocumentIntelligenceJob,
  markDocumentIntelligenceJobCompleted,
  markDocumentIntelligenceJobFailed,
  type DocumentIntelligenceJobRow,
} from "@/lib/vaylo/documents/document-intelligence-jobs";
import { processDocumentIntelligence } from "@/lib/vaylo/documents/process-document-intelligence";
import { getDocumentById } from "@/lib/vaylo/documents";
import { writeStepTransition } from "@/lib/vaylo/steps/write-step-transition";

function safeErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "unknown_error";
  }
}

async function autoCompleteLinkedStepsFromClassification(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
}): Promise<void> {
  const { supabase, userId, documentId } = params;
  const doc = await getDocumentById(supabase, userId, documentId);
  if (!doc) return;

  // Guard 3 — classification status must be completed.
  if (doc.classification_status !== "completed") return;
  if (!doc.document_type_id) return;

  // Guard 1 — confidence threshold.
  const confidence = typeof doc.classification_confidence === "number" ? doc.classification_confidence : null;
  if (confidence == null || confidence < 0.85) return;

  // Guard 4 — document type must be active (no action for inactive catalog types).
  const { data: dt, error: dtErr } = await supabase
    .from("document_types")
    .select("id, slug, is_active")
    .eq("id", doc.document_type_id)
    .maybeSingle();
  if (dtErr) throw dtErr;
  const dtRow = dt as { id?: unknown; slug?: unknown; is_active?: unknown } | null;
  if (!dtRow || dtRow.is_active !== true) return;
  const documentType = typeof dtRow.slug === "string" ? dtRow.slug : doc.document_type_id;

  // Load all linked steps for this document type, then filter to active steps.
  const { data: linkRows, error: linkErr } = await supabase
    .from("document_type_step_links")
    .select("step_id, link_type")
    .eq("document_type_id", doc.document_type_id);
  if (linkErr) throw linkErr;
  const stepIds = [
    ...new Set(
      (linkRows ?? [])
        .map((r) => String((r as { step_id?: unknown }).step_id ?? ""))
        .filter((id) => id.length > 0),
    ),
  ];
  if (stepIds.length === 0) return;

  const { data: steps, error: stErr } = await supabase
    .from("knowledge_steps")
    .select("id")
    .in("id", stepIds)
    .eq("is_active", true);
  if (stErr) throw stErr;
  const activeStepIds = (steps ?? [])
    .map((s) => String((s as { id?: unknown }).id ?? ""))
    .filter((id) => id.length > 0);

  for (const stepId of activeStepIds) {
    const res = await writeStepTransition({
      supabase,
      userId,
      stepId,
      nextStatus: "completed",
      source: "system",
      documentId,
      notes: {
        reason: "auto_classification",
        confidence,
        documentTypeId: doc.document_type_id,
        automation: true,
      },
    });

    if (res.ok) {
      console.info("[automation] step auto-completed", {
        documentId,
        stepId,
        confidence,
        documentType,
      });
    } else if (!res.skippedNoServiceRole) {
      console.warn("[automation] step auto-completed", {
        documentId,
        stepId,
        confidence,
        documentType,
        ok: false,
        error: res.error ?? "unknown_error",
      });
    }
  }
}

export async function runDocumentIntelligenceWorkerOnce(params?: {
  leaseSeconds?: number;
}): Promise<{ processed: boolean; jobId?: string; ok?: boolean }> {
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
    attempt: job.attempt_count,
  });

  try {
    const processing = await processDocumentIntelligence({
      supabase: admin,
      userId: job.user_id,
      documentId: job.document_id,
    });

    if (!processing.ok) {
      const msg = processing.errorMessage ?? processing.reason;
      await markDocumentIntelligenceJobFailed({
        supabase: admin,
        jobId: job.id,
        errorMessage: msg,
        rescheduleInSeconds: 300,
      });
      console.error("[documents intelligence job FAIL]", {
        jobId: job.id,
        reason: processing.reason,
      });
      return { processed: true, jobId: job.id, ok: false };
    }

    // Phase 4.0: safe auto-progression (never verified; completed only).
    try {
      await autoCompleteLinkedStepsFromClassification({
        supabase: admin,
        userId: job.user_id,
        documentId: job.document_id,
      });
    } catch (err) {
      console.error("[automation] step auto-completed", {
        documentId: job.document_id,
        err,
      });
    }

    await markDocumentIntelligenceJobCompleted({ supabase: admin, jobId: job.id });
    console.info("[documents intelligence job COMPLETE]", { jobId: job.id });
    return { processed: true, jobId: job.id, ok: true };
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
    return { processed: true, jobId: job.id, ok: false };
  }
}

