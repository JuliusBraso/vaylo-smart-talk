/**
 * PHASE 8.11R — Tesseract Runtime Policy (cache path + bounded cleanup)
 *
 * Small, pure, server-side-only policy module used by
 * `lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts` to resolve a safe,
 * cross-platform Tesseract cache location and to bound any cleanup of
 * Vaylo-owned temporary artifacts. This module never performs OCR, never
 * imports tesseract.js, and never calls a model. It only uses `node:os` and
 * `node:path` (path resolution) plus `node:fs` (directory/file existence and
 * removal, scoped strictly to the Vaylo-owned cache directory below).
 *
 * WHY THIS EXISTS (technical-debt context, see 8.11Q):
 * Before this phase, `real-ocr-adapter.ts` called `createWorker(TESSERACT_LANGUAGE)`
 * with no `cachePath`/`cacheMethod` option. tesseract.js's installed v7.0.0
 * worker-script (`node_modules/tesseract.js/src/worker-script/index.js`,
 * function `loadLanguage`) falls back to `${cachePath || '.'}` when writing
 * the downloaded `eng.traineddata` language file to disk via
 * `adapter.writeCache` (a real `fs.writeFile`, confirmed in
 * `node_modules/tesseract.js/src/worker-script/node/cache.js`). Because `.`
 * resolves to `process.cwd()`, this produced the previously observed
 * repo-root `eng.traineddata` artifact. This module fixes that by always
 * supplying an explicit `cachePath` rooted under `os.tmpdir()`.
 *
 * CACHE POLICY DISTINCTION (required by 8.11R):
 *   1. Reusable Tesseract language cache — the downloaded `eng.traineddata`
 *      file. This is NOT request-specific, contains no PII, no raw image
 *      bytes, no OCR-extracted text, and no model output. It is safe to
 *      reuse across requests (this is exactly what tesseract.js's own
 *      `cacheMethod: "write"` behavior already does) and is NOT deleted
 *      after every request — deleting a safely reusable cache on every
 *      request would only force a repeated network fetch from the jsdelivr
 *      CDN for no safety benefit.
 *   2. Per-request temporary artifacts — this adapter (both before and after
 *      this phase) never writes the input image buffer or the extracted OCR
 *      text to disk; those stay in memory only. There is therefore currently
 *      no per-request artifact file to clean up on the Node/tesseract.js
 *      side. `cleanupTesseractRequestArtifacts` below exists as a bounded,
 *      boundary-checked primitive for any Vaylo-owned file that might exist
 *      inside the cache directory (e.g. a stale/partial cache file), and is
 *      exercised directly by the 8.11R audit to prove the cleanup boundary
 *      is safe; it is intentionally NOT invoked automatically after every
 *      successful OCR call, because doing so would delete the reusable
 *      language cache described in (1).
 *
 * DURABILITY DISCLOSURE: `os.tmpdir()` is ephemeral, especially on
 * serverless/Vercel runtimes. This module does not claim or rely on the
 * cache directory persisting across cold starts, deployments, or restarts —
 * cache misses simply fall back to tesseract.js re-fetching the language
 * data, which is already-accepted existing runtime behavior.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** Name of the single Vaylo-owned directory created under `os.tmpdir()`. */
const VAYLO_TESSERACT_CACHE_DIRECTORY_NAME = "vaylo-tesseract-cache";

/** `cacheMethod` value used when the cache directory is available and reusable. */
export const TESSERACT_CACHE_METHOD_WRITE = "write" as const;
/** `cacheMethod` value used as a safe fallback when the cache directory cannot be ensured. */
export const TESSERACT_CACHE_METHOD_NONE = "none" as const;

export type TesseractRuntimeCacheMethod =
  | typeof TESSERACT_CACHE_METHOD_WRITE
  | typeof TESSERACT_CACHE_METHOD_NONE;

export interface TesseractRuntimePolicyDescription {
  cachePath: string;
  cacheDirectoryName: string;
  cachePathUsesOsTmpdir: true;
  cachePathCrossPlatform: true;
  cachePathOutsideRepository: true;
  cachePathUserControlled: false;
  reusableCacheMethod: TesseractRuntimeCacheMethod;
  fallbackCacheMethod: TesseractRuntimeCacheMethod;
  notes: readonly string[];
}

/**
 * Resolves the single Vaylo-owned Tesseract cache directory. Always rooted
 * under `os.tmpdir()` so it resolves correctly on Windows (local dev),
 * Linux/macOS, and serverless/Vercel Unix runtimes alike. Never hardcodes
 * `/tmp` or a Windows-specific path. Accepts no arguments and no user input,
 * so no request-controlled value can ever influence this path.
 */
export function resolveTesseractCachePath(): string {
  return path.join(os.tmpdir(), VAYLO_TESSERACT_CACHE_DIRECTORY_NAME);
}

/**
 * Best-effort, synchronous, fail-safe directory creation for the resolved
 * cache path. Returns `true` only if the directory is confirmed to exist
 * afterward. Never throws; a failure here must never crash OCR extraction,
 * it must only cause the caller to fall back to `cacheMethod: "none"`
 * (see `real-ocr-adapter.ts`).
 */
export function ensureTesseractCacheDirectory(): boolean {
  const cachePath = resolveTesseractCachePath();
  try {
    fs.mkdirSync(cachePath, { recursive: true });
    return fs.existsSync(cachePath);
  } catch {
    return false;
  }
}

/**
 * Validates that a candidate absolute path is strictly inside the
 * Vaylo-owned cache directory (never equal to `os.tmpdir()` itself, never
 * outside the cache directory, never the cache directory root either —
 * only genuine files one level below it). Used to guarantee that cleanup
 * code can never walk up to, or delete, `os.tmpdir()` itself.
 */
function isSafeCacheFilePath(candidatePath: string): boolean {
  const cacheDir = resolveTesseractCachePath();
  const resolvedCandidate = path.resolve(candidatePath);
  const resolvedCacheDir = path.resolve(cacheDir);
  if (resolvedCandidate === resolvedCacheDir) return false;
  if (resolvedCandidate === path.resolve(os.tmpdir())) return false;
  const prefix = resolvedCacheDir.endsWith(path.sep)
    ? resolvedCacheDir
    : resolvedCacheDir + path.sep;
  return resolvedCandidate.startsWith(prefix);
}

/**
 * Removes a single Vaylo-owned artifact by file name (basename only — never
 * an arbitrary path, so no traversal is possible) from inside the cache
 * directory, if it exists. Always bounded to the cache directory (see
 * `isSafeCacheFilePath`); never recursively deletes a directory; never
 * deletes `os.tmpdir()` itself. Fails safe: any error is swallowed and
 * reported only as a boolean, never as a thrown error and never by exposing
 * a filesystem path back to a caller/response.
 */
export function cleanupTesseractRequestArtifacts(fileName: string): boolean {
  const safeName = path.basename(fileName);
  if (safeName.length === 0 || safeName === "." || safeName === "..") return false;
  const candidatePath = path.join(resolveTesseractCachePath(), safeName);
  if (!isSafeCacheFilePath(candidatePath)) return false;
  try {
    if (!fs.existsSync(candidatePath)) return true;
    const stat = fs.statSync(candidatePath);
    if (!stat.isFile()) return false;
    fs.unlinkSync(candidatePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pure description of this policy, for use by callers/audits that want to
 * report the resolved strategy without performing any filesystem access.
 */
export function describeTesseractRuntimePolicy(): TesseractRuntimePolicyDescription {
  return {
    cachePath: resolveTesseractCachePath(),
    cacheDirectoryName: VAYLO_TESSERACT_CACHE_DIRECTORY_NAME,
    cachePathUsesOsTmpdir: true,
    cachePathCrossPlatform: true,
    cachePathOutsideRepository: true,
    cachePathUserControlled: false,
    reusableCacheMethod: TESSERACT_CACHE_METHOD_WRITE,
    fallbackCacheMethod: TESSERACT_CACHE_METHOD_NONE,
    notes: [
      "Cache path is path.join(os.tmpdir(), \"vaylo-tesseract-cache\") — never a hardcoded \"/tmp/...\" or Windows-specific path.",
      "Only the reusable language-data cache (e.g. eng.traineddata) is ever written here by tesseract.js.",
      "No raw image bytes, no OCR-extracted text, and no model output are ever written to this path.",
      "os.tmpdir() is ephemeral on serverless/Vercel runtimes; a cache miss simply falls back to tesseract.js re-fetching language data.",
    ] as const,
  };
}
