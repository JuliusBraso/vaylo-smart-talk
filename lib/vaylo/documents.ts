import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DocumentClassificationNotesJson,
  DocumentClassificationStatus,
  DocumentExtractedMetadataJson,
} from "@/lib/vaylo/documents/document-intelligence-types";

export const DOCUMENTS_BUCKET = "documents";

export const DOCUMENT_BASE_SELECT =
  "id, user_id, file_path, file_name, mime_type, created_at";

export const DOCUMENT_INTELLIGENCE_SELECT =
  "extracted_text, document_type_id, classification_status, classification_confidence, classification_method, extracted_metadata, classification_notes";

const DOCUMENT_INTELLIGENCE_LIST_SELECT =
  "id, document_type_id, classification_status, classification_confidence, classification_method";

export type BaseUserDocumentRow = {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string | null;
  mime_type: string | null;
  created_at: string;
};

export type UserDocumentRow = BaseUserDocumentRow & {
  /** Plain text when extraction succeeded (PDF text layer, text/*, DOCX). */
  extracted_text?: string | null;
  /** Knowledge catalog id when classification succeeded. */
  document_type_id?: string | null;
  classification_status?: DocumentClassificationStatus | null;
  classification_confidence?: number | null;
  classification_method?: string | null;
  extracted_metadata?: DocumentExtractedMetadataJson | null;
  /** Audit / proof-suggestion hints (Phase 2). */
  classification_notes?: DocumentClassificationNotesJson | null;
};

export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\- ()\[\]]/g, "_").slice(0, 200) || "file";
}

/** Storage path: `user_id/uuid_filename` */
export function buildDocumentStoragePath(
  userId: string,
  originalFileName: string,
): string {
  const uuid = crypto.randomUUID();
  const safe = sanitizeFileName(originalFileName);
  return `${userId}/${uuid}_${safe}`;
}

export async function getDocuments(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserDocumentRow[]> {
  // List view + compatibility: only columns guaranteed by `005_documents_v1.sql`.
  // Intelligence columns live in later migrations; selecting them breaks listing when those
  // migrations are not applied on a database (PostgREST "column does not exist").
  const { data, error } = await supabase
    .from("user_documents")
    .select(DOCUMENT_BASE_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  // Omit extracted_text on list to keep payloads small.

  if (error) throw error;
  const base = (data ?? []) as BaseUserDocumentRow[];

  // Optional intelligence enrichment for list UI. Best-effort for compatibility with older schemas.
  try {
    const ids = base.map((r) => r.id).filter((id) => typeof id === "string" && id.length > 0);
    if (ids.length === 0) return base as UserDocumentRow[];
    const { data: extra, error: exErr } = await supabase
      .from("user_documents")
      .select(DOCUMENT_INTELLIGENCE_LIST_SELECT)
      .in("id", ids)
      .eq("user_id", userId);

    if (exErr) throw exErr;
    const extraById = new Map(
      (extra ?? []).map((r) => {
        const o = r as Record<string, unknown>;
        const id = String(o.id ?? "");
        return [id, o] as const;
      }),
    );

    return base.map((b) => {
      const ex = extraById.get(b.id);
      return ex ? ({ ...b, ...(ex as Partial<UserDocumentRow>) } as UserDocumentRow) : (b as UserDocumentRow);
    });
  } catch (err) {
    console.error("[documents list intelligence ERROR]", err);
    return base as UserDocumentRow[];
  }
}

async function getDocumentByIdBase(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<BaseUserDocumentRow | null> {
  const { data, error } = await supabase
    .from("user_documents")
    .select(DOCUMENT_BASE_SELECT)
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as BaseUserDocumentRow | null;
}

async function getDocumentIntelligenceFieldsById(params: {
  supabase: SupabaseClient;
  userId: string;
  id: string;
}): Promise<Partial<UserDocumentRow> | null> {
  const { supabase, userId, id } = params;
  const { data, error } = await supabase
    .from("user_documents")
    .select(DOCUMENT_INTELLIGENCE_SELECT)
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Partial<UserDocumentRow> | null;
}

export async function getDocumentById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<UserDocumentRow | null> {
  const base = await getDocumentByIdBase(supabase, userId, id);
  if (!base) return null;

  // Optional intelligence fields: best-effort for compatibility with older schemas.
  try {
    const extra = await getDocumentIntelligenceFieldsById({
      supabase,
      userId,
      id,
    });
    return { ...base, ...(extra ?? {}) } as UserDocumentRow;
  } catch (err) {
    console.error("[documents detail intelligence ERROR]", err);
    return base as UserDocumentRow;
  }
}

export async function addDocument(
  supabase: SupabaseClient,
  userId: string,
  filePath: string,
  fileName: string | null,
  mimeType: string | null,
): Promise<UserDocumentRow> {
  const { data, error } = await supabase
    .from("user_documents")
    .insert({
      user_id: userId,
      file_path: filePath,
      file_name: fileName,
      mime_type: mimeType,
    })
    .select(DOCUMENT_BASE_SELECT)
    .single();

  if (error) throw error;
  return data as UserDocumentRow;
}

export async function deleteDocument(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<void> {
  const { data: row, error: fetchErr } = await supabase
    .from("user_documents")
    .select("id, file_path")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (!row) {
    const err = new Error("Not found");
    (err as Error & { status?: number }).status = 404;
    throw err;
  }

  const { error: stErr } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([row.file_path]);

  if (stErr) throw stErr;

  const { error: delErr } = await supabase
    .from("user_documents")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (delErr) throw delErr;
}

export async function setDocumentExtractedText(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  extractedText: string,
): Promise<void> {
  const { error } = await supabase
    .from("user_documents")
    .update({ extracted_text: extractedText })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (error) throw error;
}

/** Persists Phase 1 classification fields (does not touch profiles or UserState). */
export async function updateDocumentClassification(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  payload: {
    document_type_id: string | null;
    classification_status: DocumentClassificationStatus;
    classification_confidence: number | null;
    classification_method: string | null;
    extracted_metadata: DocumentExtractedMetadataJson | null;
  },
): Promise<void> {
  const { error } = await supabase
    .from("user_documents")
    .update({
      document_type_id: payload.document_type_id,
      classification_status: payload.classification_status,
      classification_confidence: payload.classification_confidence,
      classification_method: payload.classification_method,
      extracted_metadata: payload.extracted_metadata,
    })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (error) throw error;
}
