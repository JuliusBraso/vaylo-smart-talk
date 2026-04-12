/**
 * Post-upload classification persistence. Safe-first: failures become `failed`, never throw to caller.
 * Phase 1B: optional LLM assist via `runHybridDocumentClassification` (heuristic-first).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { updateDocumentClassification } from "@/lib/vaylo/documents";
import { getDocumentTypes } from "@/lib/vaylo/knowledge/get-knowledge";
import { runHybridDocumentClassification } from "./hybrid-classify-document";
import { persistProofClassificationNotes } from "./persist-proof-classification-notes";

export async function runDocumentIntelligencePhase1(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
  fileName: string | null;
  extractedText: string | null;
}): Promise<void> {
  const { supabase, userId, documentId, fileName, extractedText } = params;

  try {
    const documentTypes = await getDocumentTypes(supabase);
    const result = await runHybridDocumentClassification({
      text: extractedText,
      fileName,
      documentTypes,
    });

    const persistenceStatus =
      result.status === "completed"
        ? "completed"
        : result.status === "failed"
          ? "failed"
          : "unknown";

    await updateDocumentClassification(supabase, userId, documentId, {
      document_type_id: result.documentTypeId,
      classification_status: persistenceStatus,
      classification_confidence: result.confidence,
      classification_method: result.method,
      extracted_metadata: result.extractedMetadata,
    });

    if (persistenceStatus === "completed" && result.documentTypeId) {
      try {
        await persistProofClassificationNotes({
          supabase,
          userId,
          documentId,
          documentTypeId: result.documentTypeId,
        });
      } catch {
        // Notes are observability-only; classification already persisted.
      }
    }
  } catch {
    try {
      await updateDocumentClassification(supabase, userId, documentId, {
        document_type_id: null,
        classification_status: "failed",
        classification_confidence: null,
        classification_method: "pipeline_error",
        extracted_metadata: null,
      });
    } catch {
      // last resort: leave row as pending / prior state
    }
  }
}
