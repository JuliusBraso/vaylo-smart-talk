import type { SupabaseClient } from "@supabase/supabase-js";

export type DocumentIntelligenceJobStatus = "queued" | "running" | "completed" | "failed";

export type DocumentIntelligenceJobRow = {
  id: string;
  document_id: string;
  user_id: string;
  status: DocumentIntelligenceJobStatus;
  attempt_count: number;
  lease_token: string | null;
  lease_expires_at: string | null;
  last_error: string | null;
  last_error_at: string | null;
  scheduled_at: string;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function enqueueDocumentIntelligenceJob(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
}): Promise<DocumentIntelligenceJobRow | null> {
  const { supabase, userId, documentId } = params;
  const { data, error } = await supabase.rpc(
    "enqueue_document_intelligence_job",
    { p_document_id: documentId, p_user_id: userId },
  );
  if (error) throw error;
  return (data ?? null) as DocumentIntelligenceJobRow | null;
}

export async function claimNextDocumentIntelligenceJob(params: {
  supabase: SupabaseClient;
  leaseSeconds?: number;
}): Promise<DocumentIntelligenceJobRow | null> {
  const { supabase } = params;
  const { data, error } = await supabase.rpc(
    "claim_next_document_intelligence_job",
    { p_lease_seconds: params.leaseSeconds ?? 120 },
  );
  if (error) throw error;
  return (data ?? null) as DocumentIntelligenceJobRow | null;
}

export async function markDocumentIntelligenceJobCompleted(params: {
  supabase: SupabaseClient;
  jobId: string;
}): Promise<void> {
  const { supabase, jobId } = params;
  const { error } = await supabase
    .from("document_intelligence_jobs")
    .update({
      status: "completed",
      lease_token: null,
      lease_expires_at: null,
      finished_at: new Date().toISOString(),
      last_error: null,
      last_error_at: null,
    })
    .eq("id", jobId);
  if (error) throw error;
}

export async function markDocumentIntelligenceJobFailed(params: {
  supabase: SupabaseClient;
  jobId: string;
  errorMessage: string;
  rescheduleInSeconds?: number;
}): Promise<void> {
  const { supabase, jobId, errorMessage } = params;
  const next = new Date(Date.now() + (params.rescheduleInSeconds ?? 300) * 1000).toISOString();
  const { error } = await supabase
    .from("document_intelligence_jobs")
    .update({
      status: "failed",
      lease_token: null,
      lease_expires_at: null,
      finished_at: new Date().toISOString(),
      last_error: errorMessage.slice(0, 2000),
      last_error_at: new Date().toISOString(),
      scheduled_at: next,
    })
    .eq("id", jobId);
  if (error) throw error;
}

