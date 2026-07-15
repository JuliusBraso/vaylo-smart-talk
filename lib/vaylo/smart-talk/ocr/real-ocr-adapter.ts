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
 *
 * PHASE 8.11R HARDENING (cache path + guaranteed termination):
 * - The worker is now created with an explicit `cachePath` resolved by
 *   `lib/vaylo/smart-talk/ocr/tesseract-runtime-policy.ts`
 *   (`os.tmpdir()`-rooted, cross-platform, outside the repository). This
 *   replaces the previous implicit default, which resolved to
 *   `process.cwd()` and produced a repo-root `eng.traineddata` artifact.
 *   If the cache directory cannot be ensured, the worker falls back to
 *   `cacheMethod: "none"` (verified valid for the installed tesseract.js
 *   v7.0.0 worker-script — see policy module header comment) rather than
 *   ever falling back to the old unsafe default.
 * - Worker termination is now guaranteed via a single `finally` block that
 *   always runs after success, after a provider error, after a timeout, and
 *   after any post-recognition processing error, in addition to the
 *   existing best-effort deferred cleanup for the case where the timeout
 *   wins the race before the worker even finishes being created. Exactly
 *   one worker is created per call; no module-level worker is kept alive;
 *   no retries are introduced.
 */

import { createWorker } from "tesseract.js";
import {
  ensureTesseractCacheDirectory,
  resolveTesseractCachePath,
  TESSERACT_CACHE_METHOD_NONE,
  TESSERACT_CACHE_METHOD_WRITE,
  type TesseractRuntimeCacheMethod,
} from "@/lib/vaylo/smart-talk/ocr/tesseract-runtime-policy";

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
const OCR_CACHE_UNAVAILABLE_WARNING = "ocr_cache_unavailable";
const OCR_WORKER_TERMINATION_FAILED_WARNING = "ocr_worker_termination_failed";

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

  // Idempotent by construction: captures whatever worker reference exists
  // at call time and clears it, so calling this multiple times (once
  // immediately in `finally`, and again later if the worker is only
  // assigned after this function has already returned via the timeout
  // branch) never double-terminates or throws.
  const terminateWorkerSafely = async (): Promise<void> => {
    const activeWorker = worker;
    if (!activeWorker) return;
    worker = null;
    try {
      await activeWorker.terminate();
    } catch {
      // Worker termination failure must not trigger a second OCR call, must
      // not persist anything, and must not expose internal paths — it is
      // only ever recorded as a generic warning string.
      providerWarnings.push(OCR_WORKER_TERMINATION_FAILED_WARNING);
    }
  };

  const cacheDirectoryReady = ensureTesseractCacheDirectory();
  const cacheMethod: TesseractRuntimeCacheMethod = cacheDirectoryReady
    ? TESSERACT_CACHE_METHOD_WRITE
    : TESSERACT_CACHE_METHOD_NONE;
  if (!cacheDirectoryReady) {
    providerWarnings.push(OCR_CACHE_UNAVAILABLE_WARNING);
  }
  const workerOptions = cacheDirectoryReady
    ? { cachePath: resolveTesseractCachePath(), cacheMethod }
    : { cacheMethod };

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(OCR_TIMEOUT_ERROR_MESSAGE)), input.timeoutMs);
  });

  // Exactly one worker is created per call (single createWorker invocation
  // below). `oem` is passed as `undefined` so tesseract.js's own default
  // (OEM.LSTM_ONLY) still applies unchanged.
  const recognizePromise = (async () => {
    const createdWorker = await createWorker(TESSERACT_LANGUAGE, undefined, workerOptions);
    worker = createdWorker;
    const { data } = await createdWorker.recognize(input.imageBuffer);
    return data;
  })();

  // Best-effort deferred cleanup: if worker creation/recognition only
  // settles after this function has already returned (e.g. it was still
  // starting up when the timeout elapsed), terminate it once available so
  // no tesseract.js worker thread is left running in the background. Safe
  // to attach unconditionally — `terminateWorkerSafely` is idempotent.
  void recognizePromise.then(
    () => terminateWorkerSafely(),
    () => terminateWorkerSafely(),
  );

  try {
    const data = await Promise.race([recognizePromise, timeoutPromise]);

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
    const isTimeout = err instanceof Error && err.message === OCR_TIMEOUT_ERROR_MESSAGE;

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
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    await terminateWorkerSafely();
  }
}
