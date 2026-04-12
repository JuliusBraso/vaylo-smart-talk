/**
 * Merges proof-suggestion metadata into `user_documents.classification_notes` for auditability.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { DocumentClassificationNotesJson } from "./document-intelligence-types";
import { resolveProofSignals } from "@/lib/vaylo/knowledge/resolve-proof-signals";

export async function persistProofClassificationNotes(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
  documentTypeId: string | null;
}): Promise<void> {
  const { supabase, userId, documentId, documentTypeId } = params;
  if (!documentTypeId) return;

  const signals = await resolveProofSignals(supabase, documentTypeId);
  if (signals.length === 0) return;

  const { data: row, error: re } = await supabase
    .from("user_documents")
    .select("classification_notes")
    .eq("id", documentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (re) throw re;

  const prev = (row?.classification_notes ?? null) as DocumentClassificationNotesJson | null;
  const stepIds = signals.map((s) => s.stepId);
  const merged: DocumentClassificationNotesJson = {
    ...(prev && typeof prev === "object" ? prev : {}),
    proof_suggestion: {
      source: "knowledge_link_proof",
      reason:
        "Document type is linked as proof for these knowledge steps (catalog).",
      step_ids: stepIds,
      updated_at: new Date().toISOString(),
    },
  };

  const { error: ue } = await supabase
    .from("user_documents")
    .update({ classification_notes: merged })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (ue) throw ue;
}
