import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  DOCUMENTS_BUCKET,
  getDocumentById,
  setDocumentExtractedText,
} from "@/lib/vaylo/documents";
import { extractDocumentTextFromBuffer } from "@/lib/vaylo/extract-document-text";
import { runDocumentIntelligencePhase1 } from "@/lib/vaylo/documents/apply-document-intelligence";

export async function processDocumentIntelligence(params: {
  supabase?: SupabaseClient;
  userId: string;
  documentId: string;
}): Promise<void> {
  const { userId, documentId } = params;
  const admin = params.supabase ?? createServiceRoleClient();
  if (!admin) {
    console.warn("[documents intelligence job ERROR]", {
      userId,
      documentId,
      reason: "no_service_role",
    });
    return;
  }

  try {
    const doc = await getDocumentById(admin, userId, documentId);
    if (!doc) {
      console.warn("[documents intelligence job ERROR]", {
        userId,
        documentId,
        reason: "not_found",
      });
      return;
    }

    // Idempotency guard: don't redo successful work.
    if (doc.classification_status === "completed") {
      console.info("[documents intelligence job COMPLETE]", {
        userId,
        documentId,
        skipped: true,
        reason: "already_completed",
      });
      return;
    }

    // Download file from Storage (admin bypasses RLS; we still scope by userId via file path).
    const dl = await admin.storage.from(DOCUMENTS_BUCKET).download(doc.file_path);
    if (dl.error || !dl.data) {
      console.error("[documents intelligence job ERROR]", {
        userId,
        documentId,
        step: "storage_download",
        error: dl.error?.message ?? "download_failed",
      });
      return;
    }

    const arr = await dl.data.arrayBuffer();
    const buffer = Buffer.from(arr);

    const extracted = await extractDocumentTextFromBuffer(
      buffer,
      doc.mime_type ?? null,
      doc.file_name ?? "document",
    );

    if (extracted) {
      try {
        await setDocumentExtractedText(admin, userId, documentId, extracted);
      } catch (err) {
        console.error("[documents intelligence job ERROR]", {
          userId,
          documentId,
          step: "persist_extracted_text",
          err,
        });
      }
    }

    // Classification persistence is already safe-first inside Phase1 implementation.
    await runDocumentIntelligencePhase1({
      supabase: admin,
      userId,
      documentId,
      fileName: doc.file_name ?? null,
      extractedText: extracted ?? null,
    });
  } catch (err) {
    console.error("[documents intelligence job ERROR]", { userId, documentId, err });
  }
}

