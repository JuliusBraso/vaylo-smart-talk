import type { SupabaseClient } from "@supabase/supabase-js";

export const DOCUMENTS_BUCKET = "documents";

export type UserDocumentRow = {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string | null;
  mime_type: string | null;
  created_at: string;
  /** Plain text when extraction succeeded (PDF text layer, text/*, DOCX). */
  extracted_text?: string | null;
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
  const { data, error } = await supabase
    .from("user_documents")
    .select("id, user_id, file_path, file_name, mime_type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  // Omit extracted_text on list to keep payloads small.

  if (error) throw error;
  return (data ?? []) as UserDocumentRow[];
}

export async function getDocumentById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<UserDocumentRow | null> {
  const { data, error } = await supabase
    .from("user_documents")
    .select(
      "id, user_id, file_path, file_name, mime_type, created_at, extracted_text",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserDocumentRow | null;
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
    .select("id, user_id, file_path, file_name, mime_type, created_at")
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
