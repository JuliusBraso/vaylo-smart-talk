/**
 * PHASE 8.11C — Real OCR Adapter (server-side only)
 *
 * Minimal internal adapter wrapping the tesseract.js OCR engine for the
 * controlled real OCR extraction runtime (mode
 * "photo_ocr_real_extraction_controlled_runtime" in
 * app/api/smart-talk/route.ts). This adapter is NOT public runtime, is NOT
 * production, is NOT go-live, and performs NO OCR-to-Smart-Talk reasoning.
 *
 * Boundaries enforced by this file:
 * - Server-side only (Node.js runtime; tesseract.js runs fully in-process,
 *   no external OCR SaaS call, no network call to any third party).
 * - No persistence: never writes the input image, any processed image, or
 *   the extracted text to disk, DB, Supabase storage, or Vaylo DNA.
 * - No model/OpenAI call of any kind — this is pure technical OCR
 *   extraction, fully separated from Smart Talk model reasoning.
 * - Fails closed: timeouts, provider errors, and empty extraction all
 *   return `ok: false` with a specific `errorCode`, never throw past this
 *   adapter's public function.
 * - Never returns raw image bytes in its result, never logs image bytes,
 *   and never logs the extracted text to the console (only safe technical
 *   metadata, e.g. duration/errorCode, may ever be logged by callers).
 * - Always attempts to terminate the underlying tesseract.js worker, even
 *   on timeout/error, to avoid leaking worker resources.
 */

import { createWorker } from "tesseract.js";

export type RealOcrSupportedMimeType = "image/png" | "image/jpeg" | "image/webp";

export interface RealOcrExtractTextInput {
  /** Raw image bytes, already validated by the caller (route). Never persisted here. */
  imageBuffer: Buffer;
  /** Accepted for documentation/future use; tesseract.js reads image bytes directly. */
  mimeType: RealOcrSupportedMimeType;
  /** Hard timeout for the whole OCR attempt (worker creation + recognition). */
  timeoutMs: number;
}

export interface RealOcrExtractTextResult {
  ok: boolean;
  extractedText: string;
  confidenceAvailable: boolean;
  confidence: number | null;
  provider: "tesseract_js";
  providerWarnings: string[];
  durationMs: number;
  errorCode?: "empty_extraction" | "ocr_provider_error" | "ocr_timeout";
  errorMessage?: string;
}

const MAX_EXTRACTED_TEXT_LENGTH = 6000;
const TESSERACT_LANGUAGE = "eng";
const OCR_TIMEOUT_ERROR_MESSAGE = "ocr_timeout";

function truncateAndTrim(text: string): string {
  return text.trim().slice(0, MAX_EXTRACTED_TEXT_LENGTH);
}

/**
 * Extracts text from a single in-memory image buffer using tesseract.js.
 * Server-side only. No persistence, no file writes, no network calls beyond
 * the local tesseract.js worker, no model/OpenAI calls. Fails closed on
 * timeout, provider error, or empty extraction. Does not include raw image
 * bytes in the returned result and does not log image bytes or extracted
 * text.
 */
export async function extractTextFromImageBuffer(
  input: RealOcrExtractTextInput,
): Promise<RealOcrExtractTextResult> {
  const startedAt = Date.now();
  const providerWarnings: string[] = [];
  const elapsed = (): number => Date.now() - startedAt;

  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const recognizePromise = (async () => {
    const createdWorker = await createWorker(TESSERACT_LANGUAGE);
    worker = createdWorker;
    const { data } = await createdWorker.recognize(input.imageBuffer);
    return data;
  })();

  const terminateWorkerSafely = async (): Promise<void> => {
    if (!worker) return;
    const activeWorker = worker;
    worker = null;
    try {
      await activeWorker.terminate();
    } catch {
      // Ignore cleanup errors; worker termination failure must not affect
      // the already-computed OCR result or throw from this adapter.
    }
  };

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(OCR_TIMEOUT_ERROR_MESSAGE)), input.timeoutMs);
  });

  try {
    const data = await Promise.race([recognizePromise, timeoutPromise]);
    if (timeoutHandle) clearTimeout(timeoutHandle);
    await terminateWorkerSafely();

    const extractedText = truncateAndTrim(typeof data.text === "string" ? data.text : "");
    const confidence =
      typeof data.confidence === "number" && Number.isFinite(data.confidence)
        ? data.confidence
        : null;

    if (extractedText.length === 0) {
      return {
        ok: false,
        extractedText: "",
        confidenceAvailable: confidence !== null,
        confidence,
        provider: "tesseract_js",
        providerWarnings,
        durationMs: elapsed(),
        errorCode: "empty_extraction",
        errorMessage: "OCR extraction returned no usable text.",
      };
    }

    return {
      ok: true,
      extractedText,
      confidenceAvailable: confidence !== null,
      confidence,
      provider: "tesseract_js",
      providerWarnings,
      durationMs: elapsed(),
    };
  } catch (err) {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    const isTimeout = err instanceof Error && err.message === OCR_TIMEOUT_ERROR_MESSAGE;

    // Best-effort cleanup: if worker creation/recognition only settles after
    // this function has already returned an error (e.g. it was still
    // starting up when the timeout elapsed), terminate it once available so
    // no tesseract.js worker thread is left running in the background.
    void recognizePromise.then(
      () => terminateWorkerSafely(),
      () => terminateWorkerSafely(),
    );

    return {
      ok: false,
      extractedText: "",
      confidenceAvailable: false,
      confidence: null,
      provider: "tesseract_js",
      providerWarnings,
      durationMs: elapsed(),
      errorCode: isTimeout ? "ocr_timeout" : "ocr_provider_error",
      errorMessage: isTimeout
        ? "OCR extraction timed out."
        : "OCR provider failed to process the image.",
    };
  }
}
