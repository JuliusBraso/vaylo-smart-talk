/**
 * Best-effort text extraction for bureaucracy uploads.
 * No OCR (scanned images) and no AI — PDF text layer, plain text, and DOCX only.
 */

import { Buffer } from "node:buffer";
import pdfParse from "pdf-parse";

const MAX_EXTRACT_CHARS = 500_000;

function truncate(s: string): string {
  if (s.length <= MAX_EXTRACT_CHARS) return s;
  return `${s.slice(0, MAX_EXTRACT_CHARS)}\n\n[… truncated for storage]`;
}

function extension(fileName: string): string {
  const i = fileName.lastIndexOf(".");
  if (i < 0) return "";
  return fileName.slice(i + 1).toLowerCase();
}

/**
 * Returns trimmed text or null if unsupported or extraction failed.
 */
export async function extractDocumentTextFromBuffer(
  buffer: Buffer,
  mimeType: string | null,
  fileName: string,
): Promise<string | null> {
  const mime = (mimeType || "").toLowerCase().trim();
  const ext = extension(fileName);

  try {
    if (
      mime.startsWith("text/") ||
      mime === "application/json" ||
      mime === "application/xml" ||
      mime === "application/x-ndjson"
    ) {
      const txt = buffer.toString("utf8").trim();
      return txt ? truncate(txt) : null;
    }

    if (mime === "application/pdf" || ext === "pdf") {
      const pdfData = await pdfParse(buffer);
      const text = typeof pdfData.text === "string" ? pdfData.text.trim() : "";
      return text ? truncate(text) : null;
    }

    if (
      mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === "docx"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value ?? "").trim();
      return text ? truncate(text) : null;
    }
  } catch {
    return null;
  }

  return null;
}
