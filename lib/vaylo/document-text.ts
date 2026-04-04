import type { SupabaseClient } from "@supabase/supabase-js";

const PREVIEW_MAX_CHARS = 4000;

const SUPPORTED_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
]);

export type DocumentTextPreviewResult = {
  supported: boolean;
  previewText: string | null;
  message: string;
  messageKey: "previewNotSupported" | "previewLoadFailed" | "previewLoaded";
};

function normalizeMime(mimeType: string | null): string {
  return (mimeType ?? "").toLowerCase().trim();
}

export async function getDocumentTextPreview(params: {
  supabase: SupabaseClient;
  bucket: string;
  filePath: string;
  mimeType: string | null;
}): Promise<DocumentTextPreviewResult> {
  const mime = normalizeMime(params.mimeType);

  if (!SUPPORTED_MIME_TYPES.has(mime)) {
    return {
      supported: false,
      previewText: null,
      message: "Text extraction is not available yet for this file type",
      messageKey: "previewNotSupported",
    };
  }

  const { data, error } = await params.supabase.storage
    .from(params.bucket)
    .download(params.filePath);

  if (error || !data) {
    return {
      supported: false,
      previewText: null,
      message: "Could not load file content",
      messageKey: "previewLoadFailed",
    };
  }

  try {
    const fullText = await data.text();
    const previewText =
      fullText.length > PREVIEW_MAX_CHARS
        ? fullText.slice(0, PREVIEW_MAX_CHARS)
        : fullText;

    return {
      supported: true,
      previewText,
      message: "Text extracted successfully",
      messageKey: "previewLoaded",
    };
  } catch {
    return {
      supported: false,
      previewText: null,
      message: "Could not load file content",
      messageKey: "previewLoadFailed",
    };
  }
}
