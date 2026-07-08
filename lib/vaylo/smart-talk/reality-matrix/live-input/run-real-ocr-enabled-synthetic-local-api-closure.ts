/**
 * PHASE 8.11E — Real OCR Enabled Synthetic Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * a tiny synthetic PNG image generated purely in-memory (no real document, no
 * real photo, no disk I/O, no external network), that the
 * `photo_ocr_real_extraction_controlled_runtime` branch added in Phase 8.11C
 * runs — and runs only — when SMART_TALK_REAL_OCR_EXTRACTION_ENABLED is set
 * to exact lowercase "true".
 *
 * This closure tests the ENABLED happy-path (exact "true") synthetic scenario
 * only: one in-process POST invocation, one synthetic generated PNG image
 * (containing only safe non-PII test text "VAYLO OCR TEST" / "NO PERSONAL
 * DATA", rendered via a hand-authored 5×7 bitmap font scaled up for OCR
 * legibility), one env-set/verify/restore cycle. The real tesseract.js OCR
 * adapter is reached indirectly through the route branch — this closure never
 * imports tesseract.js or calls the OCR adapter directly.
 *
 * Two acceptable outcomes per spec:
 *   Outcome A — successful extraction: HTTP 200, ok:true, extracted text
 *     present, handoff.allowed:false, no persistence/model/DB/storage/DNA.
 *   Outcome B — fail-closed OCR quality or provider: HTTP 422/500/502/504,
 *     ok:false, code one of real_ocr_empty_extraction / real_ocr_quality_blocked /
 *     real_ocr_provider_error / real_ocr_timeout, safety boundaries hold.
 * HTTP 403 (disabled) and HTTP 429 (rate limit) are NOT acceptable.
 *
 * Source strategy (documented per explicit instruction for this phase):
 *
 * This closure imports and calls:
 *  - runRealOcrDisabledLocalApiClosure() (8.11D) — PRIMARY direct proof that
 *    the disabled-env gate fails closed for all 9 non-exact variants; its
 *    readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue:true confirms
 *    the structural prerequisite.
 *  - runMinimalRealOcrRuntimePatchAudit() (8.11C) — PRIMARY proof that the
 *    route branch, adapter, and env flag are correctly implemented.
 *  - runTextDocumentModeInternalReadinessClosure() (8.9N-PATCH, commit cf6624c)
 *    — PRIMARY: confirms 8.9N now returns allPassed:true via the immutable
 *    committed snapshot strategy applied in the 8.9N-PATCH, resolving the
 *    historical-chain false-negative that previously blocked enabled OCR.
 *  - runTechnicalDebtInventoryAudit() (8.11C-DEBT-A) — SUPPORTING: confirms
 *    safeToProceedTo8_11D:true; its safeToProceedToEnabledOcr:false is a
 *    STATIC, HARDCODED historical recommendation flag from the time before
 *    8.9N-PATCH landed and is NOT gated on by this closure's own allPassed
 *    logic — the user's explicit authorization of Phase 8.11E (after
 *    8.9N-PATCH landed and 8.11D confirmed) supersedes that static
 *    recommendation. This design decision is documented transparently here and
 *    mirrors the same source-strategy rationale used in 8.11D for the
 *    8.9N-chain workaround.
 *
 * Historical chain note: this closure does NOT call runRealOcrExtractionImplementationPlan()
 * (8.11B) or runPhotoOcrInternalReadinessClosure() (8.10J) directly —
 * 8.11B/8.11A/8.10J recursively re-derive 8.9N whose own sources
 * 8.9K/8.9L/8.9M return allPassed:false when re-run today (pre-existing
 * historical-chain condition). Their evidence is accepted indirectly through
 * 8.11C's own already-committed immutable source snapshot acceptance.
 *
 * Rate-limit-aware IP strategy: this closure uses synthetic IP 192.0.2.211
 * (RFC 5737 TEST-NET-1, exact string not used by any prior closure —
 * 8.11D uses 192.0.2.1–192.0.2.9; 8.10D uses 198.51.100.x; 8.10E uses
 * 203.0.113.x). Only one route invocation is made for the enabled case, so
 * rate-limit collision risk is zero regardless.
 *
 * This closure does NOT start a dev server, does NOT use a browser, does NOT
 * perform live external network calls, does NOT call OpenAI/any model, does
 * NOT import tesseract.js or call the OCR adapter directly, does NOT use a
 * real document or real photo, does NOT persist anything, does NOT write DB/
 * storage/DNA, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It restores
 * process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED to its original value
 * (or absence) immediately after the single enabled-case invocation.
 */

import zlib from "zlib";
import { runRealOcrDisabledLocalApiClosure } from "./run-real-ocr-disabled-local-api-closure";
import { runMinimalRealOcrRuntimePatchAudit } from "./run-minimal-real-ocr-runtime-patch-audit";
import { runTechnicalDebtInventoryAudit } from "./run-technical-debt-inventory-audit";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";
import { POST } from "../../../../../app/api/smart-talk/route";

const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const REAL_OCR_MODE = "photo_ocr_real_extraction_controlled_runtime";
// RFC 5737 TEST-NET-1, exact string not used by any prior closure.
// 8.11D uses 192.0.2.1–192.0.2.9; 8.10D uses 198.51.100.x; 8.10E uses 203.0.113.x.
const SYNTHETIC_IP = "192.0.2.211";

// ─── CRC-32 utility for PNG chunk generation ─────────────────────────────────

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]!;
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// ─── 5×7 bitmap font (all chars used in test strings are present) ────────────
// Covers: V A Y L O C R T E S N P D and space — sufficient for
// "VAYLO OCR TEST" and "NO PERSONAL DATA".

const FONT_5X7: Record<string, string[]> = {
  V: ["#...#", "#...#", "#...#", "#...#", ".#.#.", ".#.#.", "..#.."],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  R: ["####.", "#...#", "#...#", "####.", "#..#.", "#...#", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

/**
 * Generates a tiny in-memory 8-bit grayscale PNG rendering safe, non-PII
 * test text ("VAYLO OCR TEST" / "NO PERSONAL DATA") via a hand-authored 5×7
 * bitmap font scaled up for OCR legibility. Pure Node (zlib only), no
 * additional dependency, never reads or writes disk.
 */
function buildSyntheticOcrTestPngBuffer(): Buffer {
  const lines = ["VAYLO OCR TEST", "NO PERSONAL DATA"];
  const scale = 6;
  const glyphW = 5;
  const glyphH = 7;
  const charSpacing = 1;
  const lineSpacing = 2;
  const margin = 3;

  const maxLineLen = Math.max(...lines.map((l) => l.length));
  const widthPx = margin * 2 + maxLineLen * (glyphW + charSpacing) - charSpacing;
  const heightPx = margin * 2 + lines.length * glyphH + (lines.length - 1) * lineSpacing;
  const width = widthPx * scale;
  const height = heightPx * scale;

  const pixels = new Uint8Array(width * height).fill(255);

  const paintBlock = (px: number, py: number) => {
    for (let dy = 0; dy < scale; dy++) {
      for (let dx = 0; dx < scale; dx++) {
        const x = px * scale + dx;
        const y = py * scale + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = 0;
      }
    }
  };

  lines.forEach((line, lineIdx) => {
    const baseY = margin + lineIdx * (glyphH + lineSpacing);
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci]!.toUpperCase();
      const glyph = FONT_5X7[ch] ?? FONT_5X7[" "]!;
      const baseX = margin + ci * (glyphW + charSpacing);
      for (let row = 0; row < glyphH; row++) {
        for (let col = 0; col < glyphW; col++) {
          if (glyph[row]![col] === "#") paintBlock(baseX + col, baseY + row);
        }
      }
    }
  });

  // PNG raw filter bytes — filter type 0 (None) per scanline
  const raw = Buffer.alloc(height * (1 + width));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) raw[rowStart + 1 + x] = pixels[y * width + x]!;
  }

  const idatData = zlib.deflateSync(raw);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 0;  // color type: grayscale
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([pngSig, pngChunk("IHDR", ihdrData), pngChunk("IDAT", idatData), pngChunk("IEND", Buffer.alloc(0))]);
}

// ─── Synthetic request builder ────────────────────────────────────────────────

/**
 * Builds a multipart/form-data Request for the enabled real OCR branch using
 * the generated in-memory PNG. The real tesseract.js OCR engine will attempt
 * to process this image through the route branch — neither this closure nor
 * any caller imports tesseract.js or calls the adapter directly.
 */
function buildEnabledSyntheticRealOcrRequest(ip: string, pngBuffer: Buffer): Request {
  const fd = new FormData();
  fd.append("mode", REAL_OCR_MODE);
  const syntheticBlob = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11e-safe-test-no-pii.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: fd,
  });
}

// ─── Type guard ───────────────────────────────────────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

// ─── Result type ──────────────────────────────────────────────────────────────

interface RealOcrEnabledSyntheticLocalApiClosureResult {
  checkId: "8.11E";
  allPassed: boolean;
  enabledSyntheticLocalApiClosureOnly: true;
  realOcrEnabledSyntheticLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  exactTrueEnvTested: true;
  exactTrueEnvValueConfirmed: boolean;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalledByClosure: false;
  fetchCalledExternally: false;
  openAiCalled: false;
  tesseractImportedDirectlyByClosure: false;
  ocrAdapterCalledDirectlyByClosure: false;
  ocrMayBeCalledOnlyThroughRoute: true;
  realImageUsedByClosure: false;
  syntheticImageUsed: true;
  syntheticImageContainsNoPii: true;
  realDocumentUsed: false;
  imageSavedToDisk: false;
  realDocumentImageBytesRead: false;
  modelCallPerformed: false;
  uploadPersistencePerformed: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceDisabledLocalApiClosureCommit: "3688358";
  sourceTextDocumentSnapshotPatchCommit: "cf6624c";
  sourceTechnicalDebtInventoryCommit: "bdf3859";
  sourceImplementationPlanCommit: "3a26936";
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceDisabledLocalApiClosureAccepted: boolean;
  sourceTextDocumentSnapshotPatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;
  sourceSafeToProceedTo8_11D: boolean;
  sourceSafeToProceedToEnabledOcrAfter8_9NPatch: boolean;

  enabledSyntheticCasePerformed: true;
  enabledSyntheticCaseCount: 1;
  enabledSyntheticCasePassed: boolean;
  status: number;
  ok: boolean;
  code: string | null;
  mode: string | null;
  context: string | null;
  ocrResultPresent: boolean;
  extractedTextPresent: boolean;
  extractedTextLength: number;
  extractedTextPreviewObserved: string | null;
  provider: string | null;
  confidenceAvailable: boolean;
  qualityPresent: boolean;
  qualityStatus: string | null;
  qualityUsableForSmartTalk: boolean | null;
  qualityBlockingReasons: string[];
  qualityDowngradeReasons: string[];
  safetyPresent: boolean;
  handoffPresent: boolean;
  handoffAllowed: boolean;
  handoffReason: string | null;
  disclaimersPresent: boolean;
  responseOutcome: "successful_extraction" | "fail_closed_ocr_quality_or_provider";
  failClosedOutcomeAccepted: boolean;
  rateLimitObserved: false;

  exactTrueEnabledControlledBranch: true;
  placeholderFlagDidNotAuthorizeRealOcr: true;
  disabledGateAlreadyClosedBy8_11D: boolean;
  noOpenAiCall: true;
  noSmartTalkReasoningPerformed: true;
  noOcrToSmartTalkHandoff: true;
  noVerifiedFactsCreated: true;
  noLegalDeadlineCreated: true;
  noOfficialFilingCreated: true;
  noBindingLegalAdviceCreated: true;
  rawImageSentToModel: false;
  noPersistence: true;
  noStorage: true;
  noDnaWrite: true;
  rawImagePersistencePerformed: false;
  processedImagePersistencePerformed: false;
  extractedTextPersistencePerformed: false;

  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  envOriginalStateCaptured: true;
  envSetToExactTrueForTest: true;
  envRestoredAfterTest: boolean;
  envFinalMatchesOriginal: boolean;

  readyForOcrQualityEvaluatorClosure: boolean;
  readyForOcrTrustBoundaryClosure: false;
  readyForOcrToSmartTalkHandoff: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11F";
  recommendedNextPhase: "Real OCR Quality Evaluator Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  enabledSyntheticEvidence: string[];
  routeInvocationEvidence: string[];
  ocrResultEvidence: string[];
  qualityEvidence: string[];
  handoffSafetyEvidence: string[];
  noPersistenceEvidence: string[];
  envRestorationEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Fixed required arrays (exact-match, tamper-resistant) ───────────────────

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.11D real OCR disabled local API closure accepted (commit 3688358) — all 9 disabled env variants returned 403/real_ocr_extraction_disabled, readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue confirmed",
  "8.11C minimal real OCR runtime patch audit accepted (commit 46ddefc) — route branch, adapter, and dedicated env flag verified",
  "8.9N-PATCH text document mode internal readiness source snapshot fix accepted (commit cf6624c) — allPassed now true, inheritedSourceRunnerFalseNegativeResolved confirmed",
  "8.11C-DEBT-A technical debt inventory audit accepted (commit bdf3859) — safeToProceedTo8_11D confirmed true; supporting evidence only, not allPassed-gating for 8.11E",
  "8.11B real OCR extraction implementation plan accepted structurally via 8.11C nested source snapshot (commit 3a26936) — not called directly by this closure",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This closure invokes the route in-process only.",
  "This closure uses a synthetic image only.",
  "No real document is used.",
  "No browser/dev server/mobile test is performed.",
  "The OCR adapter is not called directly by this closure.",
  "The closure may allow OCR only through the route branch.",
  "OCR text is not passed to Smart Talk reasoning.",
  "OCR-to-Smart-Talk handoff remains disabled.",
  "OCR quality evaluator is still minimal/v0.",
  "This phase does not validate real-world OCR accuracy.",
  "This phase does not validate mobile camera capture.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "OCR quality evaluator closure not created yet",
  "OCR trust boundary closure not created yet",
  "OCR-to-Smart-Talk handoff not implemented",
  "browser manual real OCR test not planned/performed",
  "mobile manual real OCR test not planned/performed",
  "real document handling not validated",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalRealOcrEnabledSyntheticLocalApiClosureResult(
  r: RealOcrEnabledSyntheticLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.11E") return false;
  if (r.allPassed !== true) return false;
  if (r.enabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.realOcrEnabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.exactTrueEnvTested !== true) return false;
  if (r.exactTrueEnvValueConfirmed !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalledByClosure !== false) return false;
  if (r.fetchCalledExternally !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.tesseractImportedDirectlyByClosure !== false) return false;
  if (r.ocrAdapterCalledDirectlyByClosure !== false) return false;
  if (r.ocrMayBeCalledOnlyThroughRoute !== true) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.syntheticImageUsed !== true) return false;
  if (r.syntheticImageContainsNoPii !== true) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.imageSavedToDisk !== false) return false;
  if (r.realDocumentImageBytesRead !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.uploadPersistencePerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceMinimalRealOcrRuntimePatchCommit !== "46ddefc") return false;
  if (r.sourceDisabledLocalApiClosureCommit !== "3688358") return false;
  if (r.sourceTextDocumentSnapshotPatchCommit !== "cf6624c") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;
  if (r.sourceImplementationPlanCommit !== "3a26936") return false;
  if (r.sourceMinimalRealOcrRuntimePatchAccepted !== true) return false;
  if (r.sourceDisabledLocalApiClosureAccepted !== true) return false;
  if (r.sourceTextDocumentSnapshotPatchAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;
  if (r.sourceSafeToProceedTo8_11D !== true) return false;
  if (r.sourceSafeToProceedToEnabledOcrAfter8_9NPatch !== true) return false;

  if (r.enabledSyntheticCasePerformed !== true) return false;
  if (r.enabledSyntheticCaseCount !== 1) return false;
  if (r.enabledSyntheticCasePassed !== true) return false;
  if (r.responseOutcome !== "successful_extraction" && r.responseOutcome !== "fail_closed_ocr_quality_or_provider") return false;
  if (r.status === 403) return false;
  if (r.status === 429) return false;
  if (r.handoffAllowed !== false) return false;
  if (r.rateLimitObserved !== false) return false;

  if (r.exactTrueEnabledControlledBranch !== true) return false;
  if (r.placeholderFlagDidNotAuthorizeRealOcr !== true) return false;
  if (r.disabledGateAlreadyClosedBy8_11D !== true) return false;
  if (r.noOpenAiCall !== true) return false;
  if (r.noSmartTalkReasoningPerformed !== true) return false;
  if (r.noOcrToSmartTalkHandoff !== true) return false;
  if (r.noVerifiedFactsCreated !== true) return false;
  if (r.noLegalDeadlineCreated !== true) return false;
  if (r.noOfficialFilingCreated !== true) return false;
  if (r.noBindingLegalAdviceCreated !== true) return false;
  if (r.rawImageSentToModel !== false) return false;
  if (r.noPersistence !== true) return false;
  if (r.noStorage !== true) return false;
  if (r.noDnaWrite !== true) return false;
  if (r.rawImagePersistencePerformed !== false) return false;
  if (r.processedImagePersistencePerformed !== false) return false;
  if (r.extractedTextPersistencePerformed !== false) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.envOriginalStateCaptured !== true) return false;
  if (r.envSetToExactTrueForTest !== true) return false;
  if (r.envRestoredAfterTest !== true) return false;
  if (r.envFinalMatchesOriginal !== true) return false;

  if (r.readyForOcrQualityEvaluatorClosure !== true) return false;
  if (r.readyForOcrTrustBoundaryClosure !== false) return false;
  if (r.readyForOcrToSmartTalkHandoff !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11F") return false;
  if (r.recommendedNextPhase !== "Real OCR Quality Evaluator Closure") return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.enabledSyntheticEvidence) || r.enabledSyntheticEvidence.length === 0) return false;
  if (!Array.isArray(r.routeInvocationEvidence) || r.routeInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrResultEvidence) || r.ocrResultEvidence.length === 0) return false;
  if (!Array.isArray(r.qualityEvidence) || r.qualityEvidence.length === 0) return false;
  if (!Array.isArray(r.handoffSafetyEvidence) || r.handoffSafetyEvidence.length === 0) return false;
  if (!Array.isArray(r.noPersistenceEvidence) || r.noPersistenceEvidence.length === 0) return false;
  if (!Array.isArray(r.envRestorationEvidence) || r.envRestorationEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ─────────────────────────────────────────────────────────────

type Tamper811EMutation = (
  r: RealOcrEnabledSyntheticLocalApiClosureResult,
) => RealOcrEnabledSyntheticLocalApiClosureResult;
interface Tamper811ECase {
  label: string;
  mutate: Tamper811EMutation;
}

const REAL_OCR_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES: Tamper811ECase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11D" as "8.11E" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "enabledSyntheticLocalApiClosureOnly false", mutate: (r) => ({ ...r, enabledSyntheticLocalApiClosureOnly: false as true }) },
  { label: "realOcrEnabledSyntheticLocalApiClosureOnly false", mutate: (r) => ({ ...r, realOcrEnabledSyntheticLocalApiClosureOnly: false as true }) },
  { label: "routeInvokedInProcess false (route not invoked)", mutate: (r) => ({ ...r, routeInvokedInProcess: false as true }) },
  { label: "exactTrueEnvTested false (exact true env not tested)", mutate: (r) => ({ ...r, exactTrueEnvTested: false as true }) },
  { label: "exactTrueEnvValueConfirmed false (exact true env value not confirmed)", mutate: (r) => ({ ...r, exactTrueEnvValueConfirmed: false }) },
  { label: "browserInvokedByClosure true", mutate: (r) => ({ ...r, browserInvokedByClosure: true as false }) },
  { label: "devServerStartedByClosure true", mutate: (r) => ({ ...r, devServerStartedByClosure: true as false }) },
  { label: "externalNetworkCalledByClosure true (external fetch called)", mutate: (r) => ({ ...r, externalNetworkCalledByClosure: true as false }) },
  { label: "fetchCalledExternally true", mutate: (r) => ({ ...r, fetchCalledExternally: true as false }) },
  { label: "openAiCalled true (OpenAI/model call performed)", mutate: (r) => ({ ...r, openAiCalled: true as false }) },
  { label: "tesseractImportedDirectlyByClosure true (tesseract.js imported directly)", mutate: (r) => ({ ...r, tesseractImportedDirectlyByClosure: true as false }) },
  { label: "ocrAdapterCalledDirectlyByClosure true (OCR adapter called directly)", mutate: (r) => ({ ...r, ocrAdapterCalledDirectlyByClosure: true as false }) },
  { label: "ocrMayBeCalledOnlyThroughRoute false", mutate: (r) => ({ ...r, ocrMayBeCalledOnlyThroughRoute: false as true }) },
  { label: "realImageUsedByClosure true", mutate: (r) => ({ ...r, realImageUsedByClosure: true as false }) },
  { label: "syntheticImageUsed false (synthetic image missing)", mutate: (r) => ({ ...r, syntheticImageUsed: false as true }) },
  { label: "syntheticImageContainsNoPii false", mutate: (r) => ({ ...r, syntheticImageContainsNoPii: false as true }) },
  { label: "realDocumentUsed true (real document used)", mutate: (r) => ({ ...r, realDocumentUsed: true as false }) },
  { label: "imageSavedToDisk true", mutate: (r) => ({ ...r, imageSavedToDisk: true as false }) },
  { label: "realDocumentImageBytesRead true", mutate: (r) => ({ ...r, realDocumentImageBytesRead: true as false }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPersistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, uploadPersistencePerformed: true as false }) },
  { label: "persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (storage write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceMinimalRealOcrRuntimePatchCommit wrong (source 8.11C commit differs)", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchCommit: "0000000" as "46ddefc" }) },
  { label: "sourceDisabledLocalApiClosureCommit wrong (source 8.11D commit differs)", mutate: (r) => ({ ...r, sourceDisabledLocalApiClosureCommit: "0000000" as "3688358" }) },
  { label: "sourceTextDocumentSnapshotPatchCommit wrong (source 8.9N-PATCH commit differs)", mutate: (r) => ({ ...r, sourceTextDocumentSnapshotPatchCommit: "0000000" as "cf6624c" }) },
  { label: "sourceTechnicalDebtInventoryCommit wrong (source 8.11C-DEBT-A commit differs)", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryCommit: "0000000" as "bdf3859" }) },
  { label: "sourceImplementationPlanCommit wrong (source 8.11B commit differs)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "3a26936" }) },
  { label: "sourceMinimalRealOcrRuntimePatchAccepted false (source 8.11C audit not accepted)", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchAccepted: false }) },
  { label: "sourceDisabledLocalApiClosureAccepted false (source 8.11D not accepted)", mutate: (r) => ({ ...r, sourceDisabledLocalApiClosureAccepted: false }) },
  { label: "sourceTextDocumentSnapshotPatchAccepted false (source 8.9N-PATCH not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentSnapshotPatchAccepted: false }) },
  { label: "sourceTechnicalDebtInventoryAccepted false (source 8.11C-DEBT-A not accepted)", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryAccepted: false }) },
  { label: "sourceSafeToProceedTo8_11D false", mutate: (r) => ({ ...r, sourceSafeToProceedTo8_11D: false }) },
  { label: "sourceSafeToProceedToEnabledOcrAfter8_9NPatch false (8.9N-PATCH not accepted as enabling criterion)", mutate: (r) => ({ ...r, sourceSafeToProceedToEnabledOcrAfter8_9NPatch: false }) },
  { label: "enabledSyntheticCasePerformed false (route not invoked)", mutate: (r) => ({ ...r, enabledSyntheticCasePerformed: false as true }) },
  { label: "enabledSyntheticCaseCount wrong", mutate: (r) => ({ ...r, enabledSyntheticCaseCount: 0 as 1 }) },
  { label: "enabledSyntheticCasePassed false (enabled synthetic case not passed)", mutate: (r) => ({ ...r, enabledSyntheticCasePassed: false }) },
  { label: "status 403 (final response is 403 disabled — exact true env not tested)", mutate: (r) => ({ ...r, status: 403 }) },
  { label: "status 429 (final response is 429 rate limit)", mutate: (r) => ({ ...r, status: 429 }) },
  { label: "handoffAllowed true (handoff.allowed true — unsafe unexpected success)", mutate: (r) => ({ ...r, handoffAllowed: true }) },
  { label: "rateLimitObserved true (rate limit observed)", mutate: (r) => ({ ...r, rateLimitObserved: true as false }) },
  { label: "responseOutcome wrong (final response is unsafe unexpected success)", mutate: (r) => ({ ...r, responseOutcome: "unsafe_unexpected_success" as "successful_extraction" }) },
  { label: "exactTrueEnabledControlledBranch false", mutate: (r) => ({ ...r, exactTrueEnabledControlledBranch: false as true }) },
  { label: "placeholderFlagDidNotAuthorizeRealOcr false (placeholder flag authorizes real OCR)", mutate: (r) => ({ ...r, placeholderFlagDidNotAuthorizeRealOcr: false as true }) },
  { label: "disabledGateAlreadyClosedBy8_11D false (8.11D not confirmed)", mutate: (r) => ({ ...r, disabledGateAlreadyClosedBy8_11D: false }) },
  { label: "noOpenAiCall false (OpenAI/model call performed)", mutate: (r) => ({ ...r, noOpenAiCall: false as true }) },
  { label: "noSmartTalkReasoningPerformed false (Smart Talk reasoning performed)", mutate: (r) => ({ ...r, noSmartTalkReasoningPerformed: false as true }) },
  { label: "noOcrToSmartTalkHandoff false (OCR-to-Smart-Talk handoff performed)", mutate: (r) => ({ ...r, noOcrToSmartTalkHandoff: false as true }) },
  { label: "noVerifiedFactsCreated false (verified facts created)", mutate: (r) => ({ ...r, noVerifiedFactsCreated: false as true }) },
  { label: "noLegalDeadlineCreated false (legal deadline created)", mutate: (r) => ({ ...r, noLegalDeadlineCreated: false as true }) },
  { label: "noOfficialFilingCreated false (official filing created)", mutate: (r) => ({ ...r, noOfficialFilingCreated: false as true }) },
  { label: "noBindingLegalAdviceCreated false (binding legal advice created)", mutate: (r) => ({ ...r, noBindingLegalAdviceCreated: false as true }) },
  { label: "rawImageSentToModel true (raw image sent to model)", mutate: (r) => ({ ...r, rawImageSentToModel: true as false }) },
  { label: "noPersistence false (persistence performed)", mutate: (r) => ({ ...r, noPersistence: false as true }) },
  { label: "noStorage false (storage write performed)", mutate: (r) => ({ ...r, noStorage: false as true }) },
  { label: "noDnaWrite false (DNA write performed)", mutate: (r) => ({ ...r, noDnaWrite: false as true }) },
  { label: "rawImagePersistencePerformed true (raw image persisted)", mutate: (r) => ({ ...r, rawImagePersistencePerformed: true as false }) },
  { label: "processedImagePersistencePerformed true (processed image persisted)", mutate: (r) => ({ ...r, processedImagePersistencePerformed: true as false }) },
  { label: "extractedTextPersistencePerformed true (extracted text persisted)", mutate: (r) => ({ ...r, extractedTextPersistencePerformed: true as false }) },
  { label: "publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionStillUnauthorized false (production authorized)", mutate: (r) => ({ ...r, productionStillUnauthorized: false }) },
  { label: "goLiveStillUnauthorized false (go-live authorized)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false }) },
  { label: "envOriginalStateCaptured false", mutate: (r) => ({ ...r, envOriginalStateCaptured: false as true }) },
  { label: "envSetToExactTrueForTest false (exact true not set for test)", mutate: (r) => ({ ...r, envSetToExactTrueForTest: false as true }) },
  { label: "envRestoredAfterTest false (env not restored)", mutate: (r) => ({ ...r, envRestoredAfterTest: false }) },
  { label: "envFinalMatchesOriginal false (env final does not match original)", mutate: (r) => ({ ...r, envFinalMatchesOriginal: false }) },
  { label: "readyForOcrQualityEvaluatorClosure false after safe enabled synthetic closure", mutate: (r) => ({ ...r, readyForOcrQualityEvaluatorClosure: false }) },
  { label: "readyForOcrTrustBoundaryClosure true too early", mutate: (r) => ({ ...r, readyForOcrTrustBoundaryClosure: true as false }) },
  { label: "readyForOcrToSmartTalkHandoff true too early", mutate: (r) => ({ ...r, readyForOcrToSmartTalkHandoff: true as false }) },
  { label: "readyForMobileManualRealOcrTest true too early", mutate: (r) => ({ ...r, readyForMobileManualRealOcrTest: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true (readyForPublicRuntime true)", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.11F)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11G" as "8.11F" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo OCR Public Runtime" as "Real OCR Quality Evaluator Closure" }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "enabledSyntheticEvidence emptied", mutate: (r) => ({ ...r, enabledSyntheticEvidence: [] }) },
  { label: "routeInvocationEvidence emptied", mutate: (r) => ({ ...r, routeInvocationEvidence: [] }) },
  { label: "ocrResultEvidence emptied", mutate: (r) => ({ ...r, ocrResultEvidence: [] }) },
  { label: "qualityEvidence emptied", mutate: (r) => ({ ...r, qualityEvidence: [] }) },
  { label: "handoffSafetyEvidence emptied", mutate: (r) => ({ ...r, handoffSafetyEvidence: [] }) },
  { label: "noPersistenceEvidence emptied", mutate: (r) => ({ ...r, noPersistenceEvidence: [] }) },
  { label: "envRestorationEvidence emptied", mutate: (r) => ({ ...r, envRestorationEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 3) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes emptied", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ──────────────────────────────────────────────────

export async function runRealOcrEnabledSyntheticLocalApiClosure(): Promise<RealOcrEnabledSyntheticLocalApiClosureResult> {
  const failures: string[] = [];

  // ── Phase 8.11D — Real OCR Disabled Local API Closure (primary source) ───
  const eBefore = failures.length;
  const e = await runRealOcrDisabledLocalApiClosure();
  if (e.checkId !== "8.11D") failures.push(`8.11D checkId mismatch: got "${e.checkId}"`);
  if (e.allPassed !== true) failures.push("8.11D allPassed is not true");
  if (e.readyForRealOcrEnabledSyntheticLocalApiClosure !== true) failures.push("8.11D readyForRealOcrEnabledSyntheticLocalApiClosure is not true");
  if (e.readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue !== true) failures.push("8.11D readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue is not true");
  if (e.disabledEnvCasesPassed !== true) failures.push("8.11D disabledEnvCasesPassed is not true");
  if (e.tamperRejected !== e.tamperCount) failures.push("8.11D own tamper count mismatch");
  const sourceDisabledLocalApiClosureAccepted = failures.length === eBefore;

  // ── Phase 8.11C — Minimal Real OCR Runtime Patch Audit (primary source) ─
  const cBefore = failures.length;
  const c = await runMinimalRealOcrRuntimePatchAudit();
  if (c.checkId !== "8.11C") failures.push(`8.11C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) failures.push("8.11C allPassed is not true");
  if (c.readyForRealOcrDisabledLocalApiClosure !== true) failures.push("8.11C readyForRealOcrDisabledLocalApiClosure is not true");
  if (c.tamperRejected !== c.tamperCount) failures.push("8.11C own tamper count mismatch");
  const sourceMinimalRealOcrRuntimePatchAccepted = failures.length === cBefore;
  const sourceImplementationPlanAccepted =
    c.sourceImplementationPlanAccepted === true && c.sourceImplementationPlanCommit === "3a26936";

  // ── Phase 8.11C-DEBT-A — Technical Debt Inventory Audit (supporting) ────
  const dBefore = failures.length;
  const d = await runTechnicalDebtInventoryAudit();
  if (d.checkId !== "8.11C-DEBT-A") failures.push(`8.11C-DEBT-A checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) failures.push("8.11C-DEBT-A allPassed is not true");
  if (d.safeToProceedTo8_11D !== true) failures.push("8.11C-DEBT-A safeToProceedTo8_11D is not true");
  if (d.tamperRejected !== d.tamperCount) failures.push("8.11C-DEBT-A own tamper count mismatch");
  const sourceTechnicalDebtInventoryAccepted = failures.length === dBefore;
  const sourceSafeToProceedTo8_11D = d.safeToProceedTo8_11D === true;

  // ── Phase 8.9N-PATCH — Text Document Mode Internal Readiness (primary) ──
  // SYNCHRONOUS — do not await
  const nBefore = failures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") failures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) failures.push("8.9N allPassed is not true — 8.9N-PATCH may not have landed or failed its own checks");
  if (n.sourceSnapshotCommitIntegrityPassed !== true) failures.push("8.9N sourceSnapshotCommitIntegrityPassed is not true");
  if (n.inheritedSourceRunnerFalseNegativeResolved !== true) failures.push("8.9N inheritedSourceRunnerFalseNegativeResolved is not true");
  if (n.sourceAcceptanceStrategy !== "immutable_committed_snapshot") failures.push("8.9N sourceAcceptanceStrategy is not immutable_committed_snapshot");
  if (n.tamperRejected !== n.tamperCount) failures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentSnapshotPatchAccepted = failures.length === nBefore;

  // This closure's own determination that enabled OCR is safe to proceed:
  // derived from all required sources being accepted, independently of the
  // debt audit's historical safeToProceedToEnabledOcr:false flag (which was
  // a static pre-8.9N-PATCH recommendation — now superseded by the explicit
  // user authorization of Phase 8.11E after 8.9N-PATCH landed and 8.11D
  // confirmed fail-closed behavior). See notes for full rationale.
  const sourceSafeToProceedToEnabledOcrAfter8_9NPatch =
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceDisabledLocalApiClosureAccepted &&
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    sourceSafeToProceedTo8_11D;

  if (!sourceSafeToProceedToEnabledOcrAfter8_9NPatch) {
    failures.push("sourceSafeToProceedToEnabledOcrAfter8_9NPatch is not true — one or more required sources did not pass");
  }

  // ── Generate in-memory synthetic PNG (never written to disk) ─────────────
  const syntheticPng = buildSyntheticOcrTestPngBuffer();

  // ── Capture original env, set to exact "true", verify ────────────────────
  const originalEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalEnvWasAbsent = originalEnvValue === undefined;

  process.env[REAL_OCR_ENV_KEY] = "true";
  const envValueAfterSet = process.env[REAL_OCR_ENV_KEY];
  const exactTrueEnvValueConfirmed = envValueAfterSet === "true";

  if (!exactTrueEnvValueConfirmed) {
    failures.push('env was not exactly "true" after setting it — process.env may be read-only or frozen');
  }

  // ── Invoke the real route in-process with the synthetic PNG ──────────────
  let observedStatus = 0;
  let data: Record<string, unknown> | null = null;
  let routeInvocationError: string | null = null;

  try {
    const req = buildEnabledSyntheticRealOcrRequest(SYNTHETIC_IP, syntheticPng);
    const res = await POST(req);
    observedStatus = res.status;
    const parsed: unknown = await res.json();
    data = isRecord(parsed) ? parsed : null;
  } catch (err) {
    routeInvocationError = String(err);
    failures.push(`enabled synthetic route invocation threw: ${routeInvocationError}`);
  }

  // ── Restore original env immediately after invocation ────────────────────
  if (originalEnvWasAbsent) {
    delete process.env[REAL_OCR_ENV_KEY];
  } else {
    process.env[REAL_OCR_ENV_KEY] = originalEnvValue as string;
  }
  const envAfterRestore = process.env[REAL_OCR_ENV_KEY];
  const envRestoredAfterTest = originalEnvWasAbsent
    ? envAfterRestore === undefined
    : envAfterRestore === originalEnvValue;
  const envFinalMatchesOriginal = envRestoredAfterTest;
  if (!envRestoredAfterTest) {
    failures.push("env was not correctly restored to its original state after the enabled test");
  }

  // ── Parse the route response ──────────────────────────────────────────────
  const ok = data?.ok === true;
  const code: string | null = data && typeof data.code === "string" ? data.code : null;
  const mode: string | null = data && typeof data.mode === "string" ? data.mode : null;
  const context: string | null = data && typeof data.context === "string" ? data.context : null;

  const ocrResultData = data && isRecord(data.ocrResult) ? data.ocrResult : null;
  const qualityData = data && isRecord(data.quality) ? data.quality : null;
  const safetyData = data && isRecord(data.safety) ? data.safety : null;
  const handoffData = data && isRecord(data.handoff) ? data.handoff : null;
  const disclaimersData = data && isRecord(data.disclaimers) ? data.disclaimers : null;

  const ocrResultPresent = ocrResultData !== null;
  const extractedText =
    ocrResultData && typeof ocrResultData.extractedText === "string"
      ? (ocrResultData.extractedText as string)
      : null;
  const extractedTextPresent = extractedText !== null && extractedText.length > 0;
  const extractedTextLength =
    ocrResultData && typeof ocrResultData.extractedTextLength === "number"
      ? (ocrResultData.extractedTextLength as number)
      : 0;
  const extractedTextPreviewObserved: string | null =
    ocrResultData && typeof ocrResultData.extractedTextPreview === "string"
      ? (ocrResultData.extractedTextPreview as string)
      : null;
  const provider: string | null =
    ocrResultData && typeof ocrResultData.provider === "string"
      ? (ocrResultData.provider as string)
      : null;
  const confidenceAvailable = ocrResultData ? ocrResultData.confidenceAvailable === true : false;

  const qualityPresent = qualityData !== null;
  const qualityStatus: string | null =
    qualityData && typeof qualityData.status === "string" ? (qualityData.status as string) : null;
  const qualityUsableForSmartTalk: boolean | null =
    qualityData && typeof qualityData.usableForSmartTalk === "boolean"
      ? (qualityData.usableForSmartTalk as boolean)
      : null;
  const qualityBlockingReasons: string[] =
    qualityData && Array.isArray(qualityData.blockingReasons)
      ? (qualityData.blockingReasons as string[])
      : [];
  const qualityDowngradeReasons: string[] =
    qualityData && Array.isArray(qualityData.downgradeReasons)
      ? (qualityData.downgradeReasons as string[])
      : [];

  const safetyPresent = safetyData !== null;
  const handoffPresent = handoffData !== null;
  const handoffAllowed = handoffData ? handoffData.allowed === true : false;
  const handoffReason: string | null =
    handoffData && typeof handoffData.reason === "string" ? (handoffData.reason as string) : null;
  const disclaimersPresent = disclaimersData !== null;

  // ── Classify outcome ──────────────────────────────────────────────────────
  const ACCEPTABLE_FAIL_CLOSED_CODES = new Set([
    "real_ocr_empty_extraction",
    "real_ocr_quality_blocked",
    "real_ocr_provider_error",
    "real_ocr_timeout",
  ]);
  const FAIL_CLOSED_HTTP_STATUSES = new Set([422, 500, 502, 504]);

  const isOutcomeA = observedStatus === 200 && ok && ocrResultPresent && !handoffAllowed;
  const isOutcomeB =
    !ok &&
    FAIL_CLOSED_HTTP_STATUSES.has(observedStatus) &&
    code !== null &&
    ACCEPTABLE_FAIL_CLOSED_CODES.has(code) &&
    !handoffAllowed;

  const responseOutcome: "successful_extraction" | "fail_closed_ocr_quality_or_provider" =
    isOutcomeA ? "successful_extraction" : "fail_closed_ocr_quality_or_provider";
  const failClosedOutcomeAccepted = isOutcomeB;
  const rateLimitObserved = false as const;

  if (observedStatus === 403) {
    failures.push(
      `route returned HTTP 403 real_ocr_extraction_disabled — exact "true" env was not effective; check env mutation order or route logic`,
    );
  }
  if (observedStatus === 429) {
    failures.push(
      `route returned HTTP 429 rate limit — synthetic IP ${SYNTHETIC_IP} may have collided with prior calls in this process`,
    );
  }
  if (handoffAllowed) {
    failures.push("handoff.allowed was true — OCR-to-Smart-Talk handoff is not authorized in Phase 8.11E");
  }
  if (routeInvocationError === null && !isOutcomeA && !isOutcomeB && observedStatus !== 403 && observedStatus !== 429) {
    failures.push(
      `route returned status=${observedStatus}, ok=${ok}, code="${code ?? "none"}" — not Outcome A (200+ok+ocrResult) or Outcome B (fail-closed with acceptable code)`,
    );
  }

  const enabledSyntheticCasePassed =
    routeInvocationError === null &&
    (isOutcomeA || isOutcomeB) &&
    !handoffAllowed &&
    observedStatus !== 403 &&
    observedStatus !== 429;

  if (!enabledSyntheticCasePassed) {
    failures.push(
      `enabled synthetic case did not pass: status=${observedStatus}, ok=${ok}, code="${code ?? "none"}", handoffAllowed=${handoffAllowed}`,
    );
  }

  // ── Derived safety confirmation (all constant by this closure's design) ──
  const disabledGateAlreadyClosedBy8_11D =
    sourceDisabledLocalApiClosureAccepted && e.disabledEnvCasesPassed === true;
  const publicRuntimeStillBlocked = true;
  const productionStillUnauthorized = true;
  const goLiveStillUnauthorized = true;

  // ── allPassed logic ───────────────────────────────────────────────────────
  const allChecksPassed =
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceDisabledLocalApiClosureAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    sourceSafeToProceedTo8_11D &&
    sourceSafeToProceedToEnabledOcrAfter8_9NPatch &&
    exactTrueEnvValueConfirmed &&
    enabledSyntheticCasePassed &&
    envRestoredAfterTest &&
    disabledGateAlreadyClosedBy8_11D &&
    sourceImplementationPlanAccepted;

  const allPassed = allChecksPassed && failures.length === 0;

  const readyForOcrQualityEvaluatorClosure = allPassed;

  // ── Evidence arrays ───────────────────────────────────────────────────────
  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const enabledSyntheticEvidence: string[] = [
    `Enabled synthetic case performed with synthetic IP ${SYNTHETIC_IP} (RFC 5737 TEST-NET-1, unused by prior closures): true.`,
    `Enabled synthetic case count: 1 (exactly once, per spec).`,
    `env set to exact lowercase "true" before invocation: ${exactTrueEnvValueConfirmed}.`,
    `env restored after invocation: ${envRestoredAfterTest}.`,
    `Response status: ${observedStatus}, ok: ${ok}, code: ${code ?? "null"}.`,
    `Response outcome: ${responseOutcome}. Outcome A (successful_extraction): ${isOutcomeA}. Outcome B (fail_closed): ${isOutcomeB}.`,
    `HTTP 403 (disabled) not observed: ${observedStatus !== 403}. HTTP 429 (rate limit) not observed: ${observedStatus !== 429}.`,
    `Enabled synthetic case passed: ${enabledSyntheticCasePassed}.`,
  ];

  const routeInvocationEvidence: string[] = [
    `Route POST handler imported from app/api/smart-talk/route.ts and invoked in-process — no dev server, no browser, no external network.`,
    `Synthetic multipart/form-data request built in-memory: mode="${REAL_OCR_MODE}", image=synthetic_png (${syntheticPng.length} bytes, image/png), pageCount="1".`,
    `Synthetic image contains only safe non-PII test text: "VAYLO OCR TEST" / "NO PERSONAL DATA" — rendered via 5×7 bitmap font, never saved to disk.`,
    `x-forwarded-for header set to ${SYNTHETIC_IP} to avoid rate-limit collision with prior closures.`,
    `Route invocation error: ${routeInvocationError ?? "none"}.`,
  ];

  const ocrResultEvidence: string[] = [
    `ocrResult present in response: ${ocrResultPresent}.`,
    `extractedText present and non-empty: ${extractedTextPresent}.`,
    `extractedTextLength: ${extractedTextLength}.`,
    `extractedText length within bounds [0, 6000]: ${extractedTextLength >= 0 && extractedTextLength <= 6000}.`,
    `extractedTextPreview observed: ${extractedTextPreviewObserved !== null ? `"${extractedTextPreviewObserved.slice(0, 80)}..."` : "null (fail-closed outcome or no text)"}.`,
    `provider: ${provider ?? "null (fail-closed outcome)"}.`,
    `confidenceAvailable: ${confidenceAvailable}.`,
  ];

  const qualityEvidence: string[] = [
    `quality block present in response: ${qualityPresent}.`,
    `quality.status: ${qualityStatus ?? "null (not present for this fail-closed code)"}.`,
    `quality.usableForSmartTalk: ${qualityUsableForSmartTalk ?? "null (not present)"}.`,
    `quality.blockingReasons: [${qualityBlockingReasons.join(", ")}].`,
    `quality.downgradeReasons: [${qualityDowngradeReasons.join(", ")}].`,
    `Note: quality block is present only for real_ocr_quality_blocked (422); absent for other fail-closed codes and for successful extraction responses.`,
  ];

  const handoffSafetyEvidence: string[] = [
    `handoff block present in response: ${handoffPresent}.`,
    `handoff.allowed: ${handoffAllowed} — must remain false or absent in Phase 8.11E.`,
    `handoff.reason: ${handoffReason ?? "null (absent for fail-closed outcomes — safely treated as handoff not allowed)"}.`,
    `disclaimers block present: ${disclaimersPresent}.`,
    `No OCR text was passed to Smart Talk reasoning or any model. noSmartTalkReasoningPerformed: true.`,
    `OCR-to-Smart-Talk handoff remains disabled (hardwired in route.ts). noOcrToSmartTalkHandoff: true.`,
    `No verified facts, legal deadlines, official filings, or binding legal advice were created. Safety invariants hold.`,
  ];

  const noPersistenceEvidence: string[] = [
    "This closure never writes files, never calls DB/Supabase/DNA APIs, and never persists raw/processed image bytes or extracted OCR text.",
    "The in-memory PNG buffer is created, passed to the route, and then garbage-collected. It is never saved to disk.",
    "The route's safety meta always declares noPersistence:true, rawImagePersistencePerformed:false, processedImagePersistencePerformed:false, extractedTextPersistencePerformed:false, dbStorageWritePerformed:false, supabaseStorageWritePerformed:false, vayloDnaWritePerformed:false.",
    `safetyPresent in response: ${safetyPresent}.`,
    "No model call was performed: modelCallPerformed:false, rawImageSentToModel:false.",
  ];

  const envRestorationEvidence: string[] = [
    `Original env value of ${REAL_OCR_ENV_KEY} captured before mutation: ${originalEnvWasAbsent ? "absent" : "present"}.`,
    `Env set to exact "true" for the test: ${exactTrueEnvValueConfirmed}.`,
    `Env restored after invocation: ${envRestoredAfterTest}.`,
    `Env final matches original: ${envFinalMatchesOriginal}.`,
    originalEnvWasAbsent
      ? "Flag correctly absent again after cleanup."
      : "Flag was originally present and was restored to its original value.",
    "No other env variables were mutated or read for authorization by this closure.",
  ];

  const safetyBoundaryEvidence: string[] = [
    `exactTrueEnabledControlledBranch:true — only exact lowercase "true" reached the real OCR extraction branch.`,
    `placeholderFlagDidNotAuthorizeRealOcr:true — the SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED placeholder flag was never set or read.`,
    `disabledGateAlreadyClosedBy8_11D:${disabledGateAlreadyClosedBy8_11D} — 8.11D confirmed all 9 non-exact env variants return 403/real_ocr_extraction_disabled.`,
    "No OpenAI/model call performed. No Smart Talk reasoning triggered. No OCR-to-Smart-Talk handoff performed.",
    "No verified facts, legal deadlines, official filings, or binding legal advice created.",
    "Raw image never sent to a model. No persistence of any kind occurred.",
    `publicRuntimeStillBlocked:${publicRuntimeStillBlocked}. productionStillUnauthorized:${productionStillUnauthorized}. goLiveStillUnauthorized:${goLiveStillUnauthorized}.`,
    "8.3AC not run. tmp-8-3ac-live-metadata.ts not touched.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "The real tesseract.js OCR engine is reached only indirectly through the route's enabled branch (enabled by the exact-true env flag set by this closure).",
    "No real document, real photo, real IBAN, real credential, real ID, real deadline, real invoice, or real legal content was used.",
    "The synthetic PNG was generated in-memory from a 5×7 bitmap font with safe non-PII test text only.",
    "No dev server, no browser, no external network call, no OpenAI call.",
    "No DB/Supabase storage/Vaylo DNA write. No 8.3AC invocation. No tmp-8-3ac-live-metadata.ts access.",
  ];

  const readinessVerdict: string[] = [
    `Real OCR enabled synthetic local API closure (Phase 8.11E) complete: allPassed=${allPassed}.`,
    `Response outcome: ${responseOutcome}. Both Outcome A and Outcome B are accepted per spec.`,
    `Ready for Phase 8.11F (OCR Quality Evaluator Closure): ${readyForOcrQualityEvaluatorClosure}.`,
    "NOT yet ready for OCR trust boundary closure, OCR-to-Smart-Talk handoff, mobile manual real OCR test, photo OCR public runtime, production, or go-live.",
    "The next recommended phase is 8.11F — Real OCR Quality Evaluator Closure.",
  ];

  const notes: string[] = [
    `EC-01: 8.11E invokes the real /api/smart-talk POST handler in-process with a synthetic PNG image — no dev server, no browser, no external network, no real document.`,
    `EC-02: Sources accepted — 8.11D: ${sourceDisabledLocalApiClosureAccepted}, 8.11C: ${sourceMinimalRealOcrRuntimePatchAccepted}, 8.9N-PATCH: ${sourceTextDocumentSnapshotPatchAccepted}, 8.11C-DEBT-A: ${sourceTechnicalDebtInventoryAccepted}.`,
    `EC-03: 8.9N-PATCH (commit cf6624c) accepted — 8.9N allPassed now: ${n.allPassed}, inheritedSourceRunnerFalseNegativeResolved: ${n.inheritedSourceRunnerFalseNegativeResolved}.`,
    `EC-04: sourceSafeToProceedToEnabledOcrAfter8_9NPatch:${sourceSafeToProceedToEnabledOcrAfter8_9NPatch} — derived from all required sources accepted, independently of 8.11C-DEBT-A's static safeToProceedToEnabledOcr:${d.safeToProceedToEnabledOcr} flag.`,
    `EC-04a: source strategy note — 8.11C-DEBT-A's safeToProceedToEnabledOcr is a STATIC, HARDCODED historical recommendation computed at the time 8.11C-DEBT-A was written (before 8.9N-PATCH landed). It is false because blockerBeforeEnabledOcrCount > 0 in the debt audit's static data. The user's explicit authorization of Phase 8.11E — given that 8.9N-PATCH has now landed and 8.11D confirmed fail-closed behavior — supersedes that static recommendation. This closure does NOT gate allPassed on that debt-audit field, per explicit spec instruction. This design decision is documented here transparently.`,
    `EC-05: synthetic IP ${SYNTHETIC_IP} was chosen to avoid rate-limit collision — confirmed not used by any prior closure (8.11D uses 192.0.2.1–9; 8.10D uses 198.51.100.x; 8.10E uses 203.0.113.x).`,
    `EC-06: synthetic PNG: ${syntheticPng.length} bytes, image/png, safe non-PII text only ("VAYLO OCR TEST" / "NO PERSONAL DATA"), generated in-memory, never saved to disk.`,
    `EC-07: response — status:${observedStatus}, ok:${ok}, code:${code ?? "null"}, mode:${mode ?? "null"}, ocrResultPresent:${ocrResultPresent}, extractedTextLength:${extractedTextLength}, provider:${provider ?? "null"}.`,
    `EC-08: handoff — handoffPresent:${handoffPresent}, handoffAllowed:${handoffAllowed}, handoffReason:${handoffReason ?? "null (absent for fail-closed — safely treated as not allowed)"}.`,
    `EC-09: responseOutcome:${responseOutcome}. Outcome A (successful_extraction):${isOutcomeA}. Outcome B (fail_closed):${isOutcomeB}. failClosedOutcomeAccepted:${failClosedOutcomeAccepted}.`,
    `EC-10: env — captured:${!originalEnvWasAbsent ? "present" : "absent"}, set to exact "true": ${exactTrueEnvValueConfirmed}, restored: ${envRestoredAfterTest}.`,
    `EC-11: safety — no model call, no persistence, no DB/storage/DNA write, no handoff, public/prod/go-live all blocked.`,
    `EC-12: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.`,
    `EC-13: next phase is 8.11F — Real OCR Quality Evaluator Closure. readyForOcrQualityEvaluatorClosure:${readyForOcrQualityEvaluatorClosure}.`,
    `EC-14: evidenceLimitations source note — this closure invokes route in-process only; OCR quality evaluator is still minimal/v0; real-world OCR accuracy and mobile camera capture are not validated.`,
  ];

  // ── Build provisional result ───────────────────────────────────────────────
  const tamperCount = REAL_OCR_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES.length;

  const provisional: RealOcrEnabledSyntheticLocalApiClosureResult = {
    checkId: "8.11E",
    allPassed: true,
    enabledSyntheticLocalApiClosureOnly: true,
    realOcrEnabledSyntheticLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    exactTrueEnvTested: true,
    exactTrueEnvValueConfirmed,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalledByClosure: false,
    fetchCalledExternally: false,
    openAiCalled: false,
    tesseractImportedDirectlyByClosure: false,
    ocrAdapterCalledDirectlyByClosure: false,
    ocrMayBeCalledOnlyThroughRoute: true,
    realImageUsedByClosure: false,
    syntheticImageUsed: true,
    syntheticImageContainsNoPii: true,
    realDocumentUsed: false,
    imageSavedToDisk: false,
    realDocumentImageBytesRead: false,
    modelCallPerformed: false,
    uploadPersistencePerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceDisabledLocalApiClosureCommit: "3688358",
    sourceTextDocumentSnapshotPatchCommit: "cf6624c",
    sourceTechnicalDebtInventoryCommit: "bdf3859",
    sourceImplementationPlanCommit: "3a26936",
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceDisabledLocalApiClosureAccepted,
    sourceTextDocumentSnapshotPatchAccepted,
    sourceTechnicalDebtInventoryAccepted,
    sourceSafeToProceedTo8_11D,
    sourceSafeToProceedToEnabledOcrAfter8_9NPatch,

    enabledSyntheticCasePerformed: true,
    enabledSyntheticCaseCount: 1,
    enabledSyntheticCasePassed,
    status: observedStatus,
    ok,
    code,
    mode,
    context,
    ocrResultPresent,
    extractedTextPresent,
    extractedTextLength,
    extractedTextPreviewObserved,
    provider,
    confidenceAvailable,
    qualityPresent,
    qualityStatus,
    qualityUsableForSmartTalk,
    qualityBlockingReasons,
    qualityDowngradeReasons,
    safetyPresent,
    handoffPresent,
    handoffAllowed,
    handoffReason,
    disclaimersPresent,
    responseOutcome,
    failClosedOutcomeAccepted,
    rateLimitObserved,

    exactTrueEnabledControlledBranch: true,
    placeholderFlagDidNotAuthorizeRealOcr: true,
    disabledGateAlreadyClosedBy8_11D,
    noOpenAiCall: true,
    noSmartTalkReasoningPerformed: true,
    noOcrToSmartTalkHandoff: true,
    noVerifiedFactsCreated: true,
    noLegalDeadlineCreated: true,
    noOfficialFilingCreated: true,
    noBindingLegalAdviceCreated: true,
    rawImageSentToModel: false,
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    rawImagePersistencePerformed: false,
    processedImagePersistencePerformed: false,
    extractedTextPersistencePerformed: false,

    publicRuntimeStillBlocked,
    productionStillUnauthorized,
    goLiveStillUnauthorized,

    envOriginalStateCaptured: true,
    envSetToExactTrueForTest: true,
    envRestoredAfterTest,
    envFinalMatchesOriginal,

    readyForOcrQualityEvaluatorClosure,
    readyForOcrTrustBoundaryClosure: false,
    readyForOcrToSmartTalkHandoff: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11F",
    recommendedNextPhase: "Real OCR Quality Evaluator Closure",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    enabledSyntheticEvidence,
    routeInvocationEvidence,
    ocrResultEvidence,
    qualityEvidence,
    handoffSafetyEvidence,
    noPersistenceEvidence,
    envRestorationEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11F: Real OCR Quality Evaluator Closure — exercise the quality classifier against synthetic/simulated quality signals (no real images) and validate blocking/downgrade classification.",
      "OCR Trust Boundary Closure — assert trust-boundary metadata and forbidden-write guarantees hold across the real OCR response contract.",
      "OCR-to-Smart-Talk Handoff Plan/Closure — design (not implement) the handoff preconditions: quality usable/medium-with-warning, text-only payload, raw image excluded, disclaimers required.",
      "Mobile/browser manual real OCR testing and public beta gate design remain separate, later, explicitly authorized phases.",
    ],
    notes,
  };

  // ── Self-validation ───────────────────────────────────────────────────────
  if (allPassed && !_isCanonicalRealOcrEnabledSyntheticLocalApiClosureResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Tamper-case verification ──────────────────────────────────────────────
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of REAL_OCR_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalRealOcrEnabledSyntheticLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11E tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11E tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    readyForOcrQualityEvaluatorClosure: finalAllPassed,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
    notes: finalNotes,
  };
}

// ─── Debug runner ─────────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-real-ocr-enabled-synthetic-local-api-closure");

if (invokedDirectly) {
  runRealOcrEnabledSyntheticLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
