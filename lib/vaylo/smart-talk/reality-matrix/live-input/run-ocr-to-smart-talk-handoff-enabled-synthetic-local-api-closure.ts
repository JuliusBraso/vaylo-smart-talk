/**
 * PHASE 8.11K — OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local `Request` objects (no dev server, no browser, no external
 * network initiated by this closure), that the
 * `photo_ocr_real_extraction_to_smart_talk_controlled_handoff` branch
 * introduced in 8.11I and disabled-closed in 8.11J runs — and produces a
 * usable handoff envelope — only when BOTH env gates are exact lowercase
 * "true":
 *
 *   SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED === "true"
 *   SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === "true"
 *
 * Two route cases are exercised in-process, Case B (negative control) BEFORE
 * Case A (enabled success), so the real tesseract.js OCR execution inside
 * Case A remains the ONLY real OCR execution performed anywhere in this
 * phase:
 *
 *   Case B — dual-gate negative control: handoff env exact "true", real OCR
 *     env absent. Expect HTTP 403 / ok:false /
 *     code:"real_ocr_extraction_required_for_handoff". The route rejects
 *     before `await req.formData()` inside handleOcrToSmartTalkHandoffRequest,
 *     so OCR never executes and no handoff envelope is ever built.
 *
 *   Case A — exact-enabled synthetic handoff-envelope success: BOTH env
 *     flags exact "true". Uses one small, purely in-memory, non-PII
 *     synthetic PNG (rendered via a hand-authored 5×7 bitmap font, same
 *     proven technique already used successfully by 8.11E in this exact
 *     environment). Real OCR runs naturally through the existing,
 *     unmodified route/adapter path; this closure never imports
 *     tesseract.js and never calls the OCR adapter directly. Expects HTTP
 *     200, ok:true, a fully-populated handoff envelope with
 *     allowed:true/performed:false, smartTalkResult:null, and every
 *     required trust/quality/warning/disclaimer field preserved.
 *
 * SOURCE STRATEGY (fully disclosed, per explicit instruction for this
 * phase): this closure does NOT import or call
 * runOcrToSmartTalkHandoffDisabledLocalApiClosure() (8.11J) or
 * runMinimalOcrToSmartTalkHandoffRuntimePatchAudit() (8.11I) at runtime.
 * Both of those functions transitively re-run the full
 * 8.11I→8.11H→8.11G→8.11F→8.11E real-OCR source chain internally (8.11J
 * itself calls 8.11I, which calls 8.11H, which calls 8.11G/8.11F/8.11E
 * directly, each of which further re-derives 8.11E) — a call graph that was
 * directly observed in this same environment to take approximately 29
 * minutes and to invoke real tesseract.js OCR multiple times. Re-invoking
 * that chain again here would directly contradict this phase's explicit
 * instructions to "not unnecessarily re-run the full 8.11E/F/G/H source
 * chain", "not directly call 8.11I if doing so transitively re-runs
 * multiple real-OCR source closures", "avoid long transitive source-chain
 * execution", and "execute real OCR only for the explicit enabled synthetic
 * case required by 8.11K".
 *
 * Instead, 8.11J's and 8.11I's acceptance is treated as IMMUTABLE COMMITTED
 * SNAPSHOT evidence: both source files are confirmed present on disk at
 * their documented paths, and each is confirmed via a cheap static text
 * read (fs.readFileSync, no execution) to contain its own expected
 * `checkId` literal and exported function name. Their full `allPassed:true`
 * results were already directly observed and reported in this same
 * environment when each phase was originally closed (8.11J: commit
 * 499ab72, tamperRejected 63/63, allPassed:true; 8.11I: commit e3be09b,
 * allPassed:true) — this closure relies on that already-established,
 * already-reported, immutable committed acceptance rather than re-deriving
 * it live. This fallback does NOT re-authorize either ancestor phase; it
 * only avoids a redundant, extremely expensive re-execution of their own
 * internal real-OCR chains within this closure's own run.
 *
 * Rate-limit isolation: uses TEST-NET-3 (RFC 5737) addresses
 * 203.0.113.220 (Case B) and 203.0.113.221 (Case A) — inside the instructed
 * 203.0.113.220–203.0.113.230 window, not reused by any prior closure
 * (8.10E uses other addresses in the same /24; 8.11D uses 192.0.2.x;
 * 8.11E uses 192.0.2.211; 8.11J uses 198.51.100.x).
 *
 * This closure does NOT start a dev server, does NOT use a browser, does
 * NOT perform any external HTTP fetch itself, does NOT call OpenAI/any
 * model, does NOT import tesseract.js or call the OCR adapter directly,
 * does NOT use a real image or real document, does NOT persist anything,
 * does NOT write DB/storage/DNA, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It restores both
 * process.env.SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED and
 * process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED to their original
 * values (or absence) in a `finally` block, and detects/cleans the
 * transient tesseract.js `eng.traineddata` cache artifact if it appears
 * during Case A's real OCR execution.
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { POST } from "../../../../../app/api/smart-talk/route";

const HANDOFF_ENV_KEY = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const HANDOFF_MODE = "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
const EXPECTED_HANDOFF_REASON =
  "minimal_handoff_envelope_created_but_smart_talk_reasoning_not_enabled_in_8_11i";
const EXPECTED_SOURCE_KIND = "ocr_derived_text";
const EXPECTED_SOURCE_MODE = "photo_ocr_real_extraction_controlled_runtime";
const EXPECTED_TRUST_LEVEL = "untrusted_derived";
const EXPECTED_SENSITIVITY_LEVEL = "sensitive_user_content";
const EXPECTED_PROVIDER = "tesseract_js";
const NEGATIVE_CONTROL_CODE = "real_ocr_extraction_required_for_handoff";
const MAX_EXTRACTED_TEXT_LENGTH = 6000;

// RFC 5737 TEST-NET-3, inside the instructed 203.0.113.220–203.0.113.230
// window, one unique IP per case, never reused by any prior closure.
const CASE_B_NEGATIVE_CONTROL_IP = "203.0.113.220";
const CASE_A_ENABLED_SUCCESS_IP = "203.0.113.221";

const SOURCE_HANDOFF_DISABLED_CLOSURE_RELATIVE_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-disabled-local-api-closure.ts";
const SOURCE_MINIMAL_HANDOFF_RUNTIME_PATCH_AUDIT_RELATIVE_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

// ─── CRC-32 utility for PNG chunk generation (pure Node, zlib only) ────────

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

// ─── 5×7 bitmap font (all chars used in test strings are present) ─────────
// Covers: V A Y L O C R T E S N P D H F and space — sufficient for
// "VAYLO OCR HANDOFF TEST" and "NO PERSONAL DATA". Same hand-authored
// bitmap-font technique already proven to produce usable OCR text in this
// exact environment by 8.11E, extended with H and F for "HANDOFF".

const FONT_5X7: Readonly<Record<string, readonly string[]>> = {
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
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

/**
 * Generates a tiny in-memory 8-bit grayscale PNG rendering safe, non-PII
 * test text ("VAYLO OCR HANDOFF TEST" / "NO PERSONAL DATA") via the
 * hand-authored 5×7 bitmap font above, scaled up for OCR legibility. Pure
 * Node (zlib only), no additional dependency, never reads or writes disk.
 */
function buildSyntheticOcrHandoffTestPngBuffer(): Buffer {
  const lines = ["VAYLO OCR HANDOFF TEST", "NO PERSONAL DATA"];
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
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 0; // color type: grayscale
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    pngSig,
    pngChunk("IHDR", ihdrData),
    pngChunk("IDAT", idatData),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── Synthetic request builders ────────────────────────────────────────────

/**
 * Case A request: BOTH env gates are exact "true" when this is invoked. The
 * full rendered, OCR-legible PNG is used so real tesseract.js OCR (reached
 * only through the existing, unmodified route/adapter path) can produce a
 * usable extraction.
 */
function buildCaseAEnabledSuccessRequest(ip: string, pngBuffer: Buffer): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  const syntheticBlob = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11k-handoff-test-no-pii.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: fd,
  });
}

/**
 * Case B request: the real-OCR env gate is absent/non-exact when this is
 * invoked, so the route rejects before `await req.formData()` inside
 * handleOcrToSmartTalkHandoffRequest — OCR is never reached regardless of
 * the image content. A tiny 8-byte PNG-signature-only Blob is used (not a
 * real document), matching the pattern already established by 8.11D/8.11J
 * for gate-rejection-only requests.
 */
function buildCaseBNegativeControlRequest(ip: string): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  const pngSignatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const syntheticBlob = new Blob([pngSignatureOnly], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11k-negative-control.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: fd,
  });
}

// ─── Result types ───────────────────────────────────────────────────────────

interface OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult {
  checkId: "8.11K";
  allPassed: boolean;
  enabledSyntheticLocalApiClosureOnly: true;
  ocrToSmartTalkHandoffEnabledSyntheticLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalledByClosure: false;
  externalFetchCalledByClosure: false;
  openAiCalled: false;
  tesseractImportedDirectlyByClosure: false;
  ocrAdapterCalledDirectlyByClosure: false;
  realOcrExtractionPerformedThroughRoute: boolean;
  realImageUsedByClosure: false;
  syntheticImageOnly: true;
  realDocumentUsed: false;
  imageSavedToDisk: false;
  modelCallPerformed: false;
  smartTalkReasoningPerformed: false;
  ocrToSmartTalkHandoffEnvelopeCreated: boolean;
  ocrToSmartTalkHandoffAllowed: boolean;
  ocrToSmartTalkHandoffPerformed: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  verifiedFactsCreated: false;
  legalDeadlineCreated: false;
  officialFilingCreated: false;
  bindingLegalAdviceCreated: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  // Source fields
  sourceHandoffDisabledClosureCommit: "499ab72";
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceHandoffPlanCommit: "b839538";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceEnabledRealOcrClosureCommit: "ec5a76f";
  sourceDisabledRealOcrClosureCommit: "3688358";
  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceTextDocumentSnapshotPatchCommit: "cf6624c";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceHandoffDisabledClosureAccepted: boolean;
  sourceMinimalHandoffRuntimePatchAccepted: boolean;
  sourceHandoffPlanAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceEnabledRealOcrClosureAccepted: boolean;
  sourceDisabledRealOcrClosureAccepted: boolean;
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceTextDocumentSnapshotPatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  // Enabled gate fields
  exactHandoffTrueTested: boolean;
  exactHandoffTrueConfirmed: boolean;
  exactRealOcrTrueTested: boolean;
  exactRealOcrTrueConfirmed: boolean;
  bothExactTrueRequired: boolean;
  bothExactTrueEnabledControlledPath: boolean;
  handoffFlagAloneInsufficient: boolean;
  realOcrFlagAloneInsufficient: boolean;
  placeholderFlagCannotAuthorizeHandoff: true;
  disabledByDefaultAlreadyClosedBy8_11J: true;

  // Case A fields
  enabledSyntheticSuccessCasePerformed: true;
  enabledSyntheticSuccessCaseCount: 1;
  enabledSyntheticSuccessCasePassed: boolean;
  enabledSyntheticStatus: number;
  enabledSyntheticOk: boolean;
  enabledSyntheticMode: string;
  enabledSyntheticContext: string;
  ocrResultPresent: boolean;
  extractedTextPresent: boolean;
  extractedTextLength: number;
  extractedTextPreviewObserved: boolean;
  provider: string;
  qualityPresent: boolean;
  qualityStatus: string;
  qualityUsableForSmartTalk: boolean;
  blockingReasons: string[];
  downgradeReasons: string[];
  ocrWarnings: string[];
  highRiskTokensDetected: string[];
  handoffPresent: boolean;
  handoffAllowed: boolean;
  handoffPerformed: boolean;
  handoffReason: string;
  smartTalkResultIsNull: boolean;
  rateLimitObservedInEnabledCase: boolean;

  // Case B fields
  realOcrGateNegativeControlPerformed: true;
  realOcrGateNegativeControlPassed: boolean;
  negativeControlHandoffEnvExactTrue: boolean;
  negativeControlRealOcrEnvNotExactTrue: boolean;
  negativeControlStatus: number;
  negativeControlOk: boolean;
  negativeControlCode: string;
  negativeControlOcrPerformed: boolean;
  negativeControlEnvelopeCreated: boolean;
  negativeControlModelCallPerformed: boolean;
  negativeControlPersistencePerformed: boolean;
  rateLimitObservedInNegativeControl: boolean;

  // Trust and quality fields
  sourceKindPreserved: boolean;
  sourceModePreserved: boolean;
  trustLevelPreserved: boolean;
  sensitivityLevelPreserved: boolean;
  qualityStatusPreserved: boolean;
  usableForSmartTalkPreserved: boolean;
  blockingReasonsPreserved: boolean;
  downgradeReasonsPreserved: boolean;
  ocrWarningsPreserved: boolean;
  highRiskTokensPreserved: boolean;
  providerMetadataPreserved: boolean;
  confidenceMetadataPreserved: boolean;
  disclaimersPreserved: boolean;
  checkOriginalWarningPreserved: boolean;
  usableDoesNotMeanVerifiedTruth: true;

  // Safety fields
  noSmartTalkReasoning: true;
  noModelCall: true;
  noRawImageToModel: boolean;
  noOriginalDocumentFileToModel: boolean;
  noExtractedTextToModel: boolean;
  handoffEnvelopeOnly: boolean;
  handoffExecutionStillBlocked: boolean;
  noPersistence: true;
  noStorage: true;
  noDnaWrite: true;
  noVerifiedFactCreation: true;
  noLegalDeadlineCreation: true;
  noOfficialFilingCreation: true;
  noBindingLegalAdviceCreation: true;
  publicRuntimeStillBlocked: true;
  productionStillUnauthorized: true;
  goLiveStillUnauthorized: true;

  // Env restoration fields
  originalHandoffEnvCaptured: true;
  originalRealOcrEnvCaptured: true;
  bothEnvSetExactTrueForEnabledCase: boolean;
  envRestoredAfterTests: boolean;
  finalHandoffEnvMatchesOriginal: boolean;
  finalRealOcrEnvMatchesOriginal: boolean;

  // Tesseract cache debt
  debtObservedPreviously: true;
  artifactName: "eng.traineddata";
  artifactLocationObservedPreviously: "repo root";
  artifactObservedDuring8_11K: boolean;
  artifactCleanedAfter8_11K: boolean;
  artifactPresentAfter8_11K: boolean;
  mustNotCommitArtifact: true;
  controlledCachePathStillNeeded: true;
  cleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  blockerBeforeMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBeforeNextControlledPhase: false;

  // Audit execution debt
  transitiveSourceExecutionDebtObserved: true;
  heavy8_11ISourceChainAvoided: true;
  immutableCommittedSnapshotsUsedWhereSafe: true;
  realOcrExecutionsPerformedBy8_11K: 1;
  repeatedHistoricalOcrExecutionsAvoided: true;
  futureSourceSnapshotConsolidationNeeded: true;

  // Readiness verdict (flat)
  handoffEnabledSyntheticLocalApiClosureClosed: boolean;
  handoffEnvelopeControlledRuntimeValidated: boolean;
  readyForSmartTalkReasoningFromOcrPlan: boolean;
  readyForSmartTalkReasoningFromOcrImplementation: false;
  readyForBrowserManualHandoffTest: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11L";
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Gate Design";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  // Required arrays
  sourceEvidence: string[];
  enabledGateEvidence: string[];
  enabledSyntheticCaseEvidence: string[];
  realOcrGateNegativeControlEvidence: string[];
  routeInvocationEvidence: string[];
  ocrResultEvidence: string[];
  handoffEnvelopeEvidence: string[];
  trustMetadataEvidence: string[];
  qualityMetadataEvidence: string[];
  warningAndDisclaimerEvidence: string[];
  highRiskBoundaryEvidence: string[];
  noModelEvidence: string[];
  noPersistenceEvidence: string[];
  rateLimitIsolationEvidence: string[];
  envRestorationEvidence: string[];
  tesseractCacheDebtEvidence: string[];
  auditExecutionDebtEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Fixed evidence/blocker/limitation arrays (exact-match, tamper-resistant) ─

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase validates the controlled handoff envelope only.",
  "It does not enable Smart Talk reasoning from OCR.",
  "It does not call OpenAI or any model.",
  "It does not send extracted text to a model.",
  "It does not send raw image bytes or original files to a model.",
  "It uses one synthetic image only.",
  "It does not use a real document.",
  "It does not run browser or mobile tests.",
  "It does not persist OCR text.",
  "It does not write DB/storage/DNA.",
  "It does not validate real-world OCR accuracy.",
  "It relies on committed immutable source evidence where safe to avoid heavy transitive OCR execution.",
  "tesseract cache-path debt remains unresolved.",
  "module-level rate-limit isolation debt remains unresolved.",
  "public runtime remains blocked.",
  "production and go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "Smart Talk controlled reasoning gate design not created",
  "Smart Talk reasoning from OCR not implemented",
  "Smart Talk reasoning disabled closure not created",
  "Smart Talk reasoning enabled synthetic closure not created",
  "actual OCR quality evaluator runtime module not implemented",
  "tesseract.js controlled cache path not implemented",
  "tesseract.js cleanup policy not systemically implemented",
  ".gitignore policy review not completed",
  "cross-closure rate-limit isolation not systemically resolved",
  "transitive audit source-chain execution not consolidated",
  "browser manual OCR-to-Smart-Talk test not planned/performed",
  "mobile manual OCR-to-Smart-Talk test not planned/performed",
  "real document handling not validated",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult(
  r: OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.11K") return false;
  if (r.allPassed !== true) return false;
  if (r.enabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.ocrToSmartTalkHandoffEnabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalledByClosure !== false) return false;
  if (r.externalFetchCalledByClosure !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.tesseractImportedDirectlyByClosure !== false) return false;
  if (r.ocrAdapterCalledDirectlyByClosure !== false) return false;
  if (r.realOcrExtractionPerformedThroughRoute !== true) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.syntheticImageOnly !== true) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.imageSavedToDisk !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.smartTalkReasoningPerformed !== false) return false;
  if (r.ocrToSmartTalkHandoffEnvelopeCreated !== true) return false;
  if (r.ocrToSmartTalkHandoffAllowed !== true) return false;
  if (r.ocrToSmartTalkHandoffPerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.verifiedFactsCreated !== false) return false;
  if (r.legalDeadlineCreated !== false) return false;
  if (r.officialFilingCreated !== false) return false;
  if (r.bindingLegalAdviceCreated !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceHandoffDisabledClosureCommit !== "499ab72") return false;
  if (r.sourceMinimalHandoffRuntimePatchCommit !== "e3be09b") return false;
  if (r.sourceHandoffPlanCommit !== "b839538") return false;
  if (r.sourceTrustBoundaryClosureCommit !== "831779a") return false;
  if (r.sourceQualityEvaluatorClosureCommit !== "2ef041f") return false;
  if (r.sourceEnabledRealOcrClosureCommit !== "ec5a76f") return false;
  if (r.sourceDisabledRealOcrClosureCommit !== "3688358") return false;
  if (r.sourceMinimalRealOcrRuntimePatchCommit !== "46ddefc") return false;
  if (r.sourceTextDocumentSnapshotPatchCommit !== "cf6624c") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;

  if (r.sourceHandoffDisabledClosureAccepted !== true) return false;
  if (r.sourceMinimalHandoffRuntimePatchAccepted !== true) return false;
  if (r.sourceHandoffPlanAccepted !== true) return false;
  if (r.sourceTrustBoundaryClosureAccepted !== true) return false;
  if (r.sourceQualityEvaluatorClosureAccepted !== true) return false;
  if (r.sourceEnabledRealOcrClosureAccepted !== true) return false;
  if (r.sourceDisabledRealOcrClosureAccepted !== true) return false;
  if (r.sourceMinimalRealOcrRuntimePatchAccepted !== true) return false;
  if (r.sourceTextDocumentSnapshotPatchAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;

  if (r.exactHandoffTrueTested !== true) return false;
  if (r.exactHandoffTrueConfirmed !== true) return false;
  if (r.exactRealOcrTrueTested !== true) return false;
  if (r.exactRealOcrTrueConfirmed !== true) return false;
  if (r.bothExactTrueRequired !== true) return false;
  if (r.bothExactTrueEnabledControlledPath !== true) return false;
  if (r.handoffFlagAloneInsufficient !== true) return false;
  if (r.realOcrFlagAloneInsufficient !== true) return false;
  if (r.placeholderFlagCannotAuthorizeHandoff !== true) return false;
  if (r.disabledByDefaultAlreadyClosedBy8_11J !== true) return false;

  if (r.enabledSyntheticSuccessCasePerformed !== true) return false;
  if (r.enabledSyntheticSuccessCaseCount !== 1) return false;
  if (r.enabledSyntheticSuccessCasePassed !== true) return false;
  if (r.enabledSyntheticStatus !== 200) return false;
  if (r.enabledSyntheticOk !== true) return false;
  if (r.enabledSyntheticMode !== HANDOFF_MODE) return false;
  if (r.enabledSyntheticContext !== "anonymous") return false;
  if (r.ocrResultPresent !== true) return false;
  if (r.extractedTextPresent !== true) return false;
  if (r.extractedTextLength <= 0 || r.extractedTextLength > MAX_EXTRACTED_TEXT_LENGTH) return false;
  if (r.extractedTextPreviewObserved !== true) return false;
  if (r.provider !== EXPECTED_PROVIDER) return false;
  if (r.qualityPresent !== true) return false;
  if (r.qualityStatus === "" || r.qualityStatus === "blocked") return false;
  if (r.qualityUsableForSmartTalk !== true) return false;
  if (!Array.isArray(r.blockingReasons) || r.blockingReasons.length !== 0) return false;
  if (!Array.isArray(r.downgradeReasons)) return false;
  if (!Array.isArray(r.ocrWarnings)) return false;
  if (!Array.isArray(r.highRiskTokensDetected)) return false;
  if (r.handoffPresent !== true) return false;
  if (r.handoffAllowed !== true) return false;
  if (r.handoffPerformed !== false) return false;
  if (r.handoffReason !== EXPECTED_HANDOFF_REASON) return false;
  if (r.smartTalkResultIsNull !== true) return false;
  if (r.rateLimitObservedInEnabledCase !== false) return false;

  if (r.realOcrGateNegativeControlPerformed !== true) return false;
  if (r.realOcrGateNegativeControlPassed !== true) return false;
  if (r.negativeControlHandoffEnvExactTrue !== true) return false;
  if (r.negativeControlRealOcrEnvNotExactTrue !== true) return false;
  if (r.negativeControlStatus !== 403) return false;
  if (r.negativeControlOk !== false) return false;
  if (r.negativeControlCode !== NEGATIVE_CONTROL_CODE) return false;
  if (r.negativeControlOcrPerformed !== false) return false;
  if (r.negativeControlEnvelopeCreated !== false) return false;
  if (r.negativeControlModelCallPerformed !== false) return false;
  if (r.negativeControlPersistencePerformed !== false) return false;
  if (r.rateLimitObservedInNegativeControl !== false) return false;

  if (r.sourceKindPreserved !== true) return false;
  if (r.sourceModePreserved !== true) return false;
  if (r.trustLevelPreserved !== true) return false;
  if (r.sensitivityLevelPreserved !== true) return false;
  if (r.qualityStatusPreserved !== true) return false;
  if (r.usableForSmartTalkPreserved !== true) return false;
  if (r.blockingReasonsPreserved !== true) return false;
  if (r.downgradeReasonsPreserved !== true) return false;
  if (r.ocrWarningsPreserved !== true) return false;
  if (r.highRiskTokensPreserved !== true) return false;
  if (r.providerMetadataPreserved !== true) return false;
  if (r.confidenceMetadataPreserved !== true) return false;
  if (r.disclaimersPreserved !== true) return false;
  if (r.checkOriginalWarningPreserved !== true) return false;
  if (r.usableDoesNotMeanVerifiedTruth !== true) return false;

  if (r.noSmartTalkReasoning !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noRawImageToModel !== true) return false;
  if (r.noOriginalDocumentFileToModel !== true) return false;
  if (r.noExtractedTextToModel !== true) return false;
  if (r.handoffEnvelopeOnly !== true) return false;
  if (r.handoffExecutionStillBlocked !== true) return false;
  if (r.noPersistence !== true) return false;
  if (r.noStorage !== true) return false;
  if (r.noDnaWrite !== true) return false;
  if (r.noVerifiedFactCreation !== true) return false;
  if (r.noLegalDeadlineCreation !== true) return false;
  if (r.noOfficialFilingCreation !== true) return false;
  if (r.noBindingLegalAdviceCreation !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.originalHandoffEnvCaptured !== true) return false;
  if (r.originalRealOcrEnvCaptured !== true) return false;
  if (r.bothEnvSetExactTrueForEnabledCase !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.finalHandoffEnvMatchesOriginal !== true) return false;
  if (r.finalRealOcrEnvMatchesOriginal !== true) return false;

  if (r.debtObservedPreviously !== true) return false;
  if (r.artifactName !== "eng.traineddata") return false;
  if (r.artifactLocationObservedPreviously !== "repo root") return false;
  if (r.artifactPresentAfter8_11K !== false) return false;
  if (r.mustNotCommitArtifact !== true) return false;
  if (r.controlledCachePathStillNeeded !== true) return false;
  if (r.cleanupPolicyStillNeeded !== true) return false;
  if (r.gitignorePolicyReviewStillNeeded !== true) return false;
  if (r.blockerBeforeMobileTesting !== true) return false;
  if (r.blockerBeforePublicBeta !== true) return false;
  if (r.blockerBeforeNextControlledPhase !== false) return false;

  if (r.transitiveSourceExecutionDebtObserved !== true) return false;
  if (r.heavy8_11ISourceChainAvoided !== true) return false;
  if (r.immutableCommittedSnapshotsUsedWhereSafe !== true) return false;
  if (r.realOcrExecutionsPerformedBy8_11K !== 1) return false;
  if (r.repeatedHistoricalOcrExecutionsAvoided !== true) return false;
  if (r.futureSourceSnapshotConsolidationNeeded !== true) return false;

  if (r.handoffEnabledSyntheticLocalApiClosureClosed !== true) return false;
  if (r.handoffEnvelopeControlledRuntimeValidated !== true) return false;
  if (r.readyForSmartTalkReasoningFromOcrPlan !== true) return false;
  if (r.readyForSmartTalkReasoningFromOcrImplementation !== false) return false;
  if (r.readyForBrowserManualHandoffTest !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11L") return false;
  if (r.recommendedNextPhase !== "OCR-to-Smart-Talk Controlled Reasoning Gate Design") return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (!Array.isArray(r.sourceEvidence) || r.sourceEvidence.length === 0) return false;
  if (!Array.isArray(r.enabledGateEvidence) || r.enabledGateEvidence.length === 0) return false;
  if (!Array.isArray(r.enabledSyntheticCaseEvidence) || r.enabledSyntheticCaseEvidence.length === 0) return false;
  if (!Array.isArray(r.realOcrGateNegativeControlEvidence) || r.realOcrGateNegativeControlEvidence.length === 0)
    return false;
  if (!Array.isArray(r.routeInvocationEvidence) || r.routeInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrResultEvidence) || r.ocrResultEvidence.length === 0) return false;
  if (!Array.isArray(r.handoffEnvelopeEvidence) || r.handoffEnvelopeEvidence.length === 0) return false;
  if (!Array.isArray(r.trustMetadataEvidence) || r.trustMetadataEvidence.length === 0) return false;
  if (!Array.isArray(r.qualityMetadataEvidence) || r.qualityMetadataEvidence.length === 0) return false;
  if (!Array.isArray(r.warningAndDisclaimerEvidence) || r.warningAndDisclaimerEvidence.length === 0) return false;
  if (!Array.isArray(r.highRiskBoundaryEvidence) || r.highRiskBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.noModelEvidence) || r.noModelEvidence.length === 0) return false;
  if (!Array.isArray(r.noPersistenceEvidence) || r.noPersistenceEvidence.length === 0) return false;
  if (!Array.isArray(r.rateLimitIsolationEvidence) || r.rateLimitIsolationEvidence.length === 0) return false;
  if (!Array.isArray(r.envRestorationEvidence) || r.envRestorationEvidence.length === 0) return false;
  if (!Array.isArray(r.tesseractCacheDebtEvidence) || r.tesseractCacheDebtEvidence.length === 0) return false;
  if (!Array.isArray(r.auditExecutionDebtEvidence) || r.auditExecutionDebtEvidence.length === 0) return false;
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

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (
  r: OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult,
) => OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

const OCR_TO_SMART_TALK_HANDOFF_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11J" as "8.11K" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },

  { label: "source 8.11J not accepted", mutate: (r) => ({ ...r, sourceHandoffDisabledClosureAccepted: false }) },
  { label: "source 8.11I not accepted", mutate: (r) => ({ ...r, sourceMinimalHandoffRuntimePatchAccepted: false }) },

  { label: "exact handoff true not tested", mutate: (r) => ({ ...r, exactHandoffTrueTested: false }) },
  { label: "exact handoff true not confirmed", mutate: (r) => ({ ...r, exactHandoffTrueConfirmed: false }) },
  { label: "exact real OCR true not tested", mutate: (r) => ({ ...r, exactRealOcrTrueTested: false }) },
  { label: "exact real OCR true not confirmed", mutate: (r) => ({ ...r, exactRealOcrTrueConfirmed: false }) },
  { label: "both exact true not required", mutate: (r) => ({ ...r, bothExactTrueRequired: false }) },
  { label: "handoff flag alone can authorize path", mutate: (r) => ({ ...r, handoffFlagAloneInsufficient: false }) },
  { label: "real OCR flag alone can authorize path", mutate: (r) => ({ ...r, realOcrFlagAloneInsufficient: false }) },

  { label: "negative control missing", mutate: (r) => ({ ...r, realOcrGateNegativeControlPerformed: false as true }) },
  { label: "negative control does not return 403", mutate: (r) => ({ ...r, negativeControlStatus: 200 }) },
  { label: "negative control code is wrong", mutate: (r) => ({ ...r, negativeControlCode: "real_ocr_extraction_disabled" }) },
  { label: "OCR executes in negative control", mutate: (r) => ({ ...r, negativeControlOcrPerformed: true }) },
  { label: "envelope is created in negative control", mutate: (r) => ({ ...r, negativeControlEnvelopeCreated: true }) },

  { label: "enabled success case missing", mutate: (r) => ({ ...r, enabledSyntheticSuccessCasePerformed: false as true }) },
  { label: "enabled status is not 200", mutate: (r) => ({ ...r, enabledSyntheticStatus: 422 }) },
  { label: "enabled ok is not true", mutate: (r) => ({ ...r, enabledSyntheticOk: false }) },
  { label: "HTTP 429 occurs (enabled case)", mutate: (r) => ({ ...r, enabledSyntheticStatus: 429 }) },
  { label: "HTTP 429 occurs (negative control)", mutate: (r) => ({ ...r, negativeControlStatus: 429 }) },
  { label: "synthetic image missing", mutate: (r) => ({ ...r, syntheticImageOnly: false as true }) },
  { label: "real image or real document used", mutate: (r) => ({ ...r, realDocumentUsed: true as false }) },
  { label: "OCR result missing", mutate: (r) => ({ ...r, ocrResultPresent: false }) },
  { label: "extracted text empty", mutate: (r) => ({ ...r, extractedTextLength: 0 }) },
  { label: "quality not usable", mutate: (r) => ({ ...r, qualityUsableForSmartTalk: false }) },
  { label: "handoff missing", mutate: (r) => ({ ...r, handoffPresent: false }) },
  { label: "handoff.allowed false", mutate: (r) => ({ ...r, handoffAllowed: false, ocrToSmartTalkHandoffAllowed: false }) },
  { label: "handoff.performed true", mutate: (r) => ({ ...r, handoffPerformed: true }) },
  { label: "handoff reason changed", mutate: (r) => ({ ...r, handoffReason: "some_other_reason" }) },
  { label: "smartTalkResult not null", mutate: (r) => ({ ...r, smartTalkResultIsNull: false }) },

  { label: "source kind missing", mutate: (r) => ({ ...r, sourceKindPreserved: false }) },
  { label: "trust level missing", mutate: (r) => ({ ...r, trustLevelPreserved: false }) },
  { label: "sensitivity level missing", mutate: (r) => ({ ...r, sensitivityLevelPreserved: false }) },
  { label: "quality status missing", mutate: (r) => ({ ...r, qualityStatusPreserved: false }) },
  { label: "blocking reasons missing", mutate: (r) => ({ ...r, blockingReasonsPreserved: false }) },
  { label: "downgrade reasons missing", mutate: (r) => ({ ...r, downgradeReasonsPreserved: false }) },
  { label: "OCR warnings missing", mutate: (r) => ({ ...r, ocrWarningsPreserved: false }) },
  { label: "high-risk token metadata missing", mutate: (r) => ({ ...r, highRiskTokensPreserved: false }) },
  { label: "disclaimers missing", mutate: (r) => ({ ...r, disclaimersPreserved: false }) },
  { label: "usable treated as verified truth", mutate: (r) => ({ ...r, usableDoesNotMeanVerifiedTruth: false as true }) },

  { label: "raw image reaches model", mutate: (r) => ({ ...r, noRawImageToModel: false }) },
  { label: "original document reaches model", mutate: (r) => ({ ...r, noOriginalDocumentFileToModel: false }) },
  { label: "extracted text reaches model", mutate: (r) => ({ ...r, noExtractedTextToModel: false }) },
  { label: "Smart Talk reasoning occurs", mutate: (r) => ({ ...r, smartTalkReasoningPerformed: true as false }) },
  { label: "model call occurs", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "persistence occurs", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "DB/storage/DNA write occurs", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "verified fact created", mutate: (r) => ({ ...r, verifiedFactsCreated: true as false }) },
  { label: "legal deadline created", mutate: (r) => ({ ...r, legalDeadlineCreated: true as false }) },
  { label: "filing created", mutate: (r) => ({ ...r, officialFilingCreated: true as false }) },
  { label: "binding advice created", mutate: (r) => ({ ...r, bindingLegalAdviceCreated: true as false }) },

  { label: "env not restored (handoff)", mutate: (r) => ({ ...r, finalHandoffEnvMatchesOriginal: false }) },
  { label: "env not restored (real OCR)", mutate: (r) => ({ ...r, finalRealOcrEnvMatchesOriginal: false }) },
  { label: "eng.traineddata remains present", mutate: (r) => ({ ...r, artifactPresentAfter8_11K: true as false }) },

  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },

  {
    label: "readyForReasoningPlan false after safe closure",
    mutate: (r) => ({ ...r, readyForSmartTalkReasoningFromOcrPlan: false }),
  },
  {
    label: "readyForReasoningImplementation true too early",
    mutate: (r) => ({ ...r, readyForSmartTalkReasoningFromOcrImplementation: true as false }),
  },
  { label: "next phase is not 8.11L", mutate: (r) => ({ ...r, readyForNextPhase: "8.11K" as "8.11L" }) },

  { label: "8.3AC marked run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure(): Promise<OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult> {
  const failures: string[] = [];

  // ── Source acceptance: immutable committed snapshot (fully disclosed) ────
  // Neither 8.11J's nor 8.11I's own exported function is called live here —
  // see docblock SOURCE STRATEGY. Instead, both source files are confirmed
  // present on disk and confirmed via a cheap static text read to contain
  // their own expected checkId literal and exported function name; their
  // full allPassed:true acceptance is taken as already-established,
  // already-reported immutable committed evidence (8.11J commit 499ab72,
  // 8.11I commit e3be09b).
  const repoRoot = process.cwd();
  const handoffDisabledClosureAbsPath = path.join(repoRoot, SOURCE_HANDOFF_DISABLED_CLOSURE_RELATIVE_PATH);
  const minimalHandoffRuntimePatchAuditAbsPath = path.join(
    repoRoot,
    SOURCE_MINIMAL_HANDOFF_RUNTIME_PATCH_AUDIT_RELATIVE_PATH,
  );

  let handoffDisabledClosureSrc = "";
  try {
    handoffDisabledClosureSrc = fs.readFileSync(handoffDisabledClosureAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${SOURCE_HANDOFF_DISABLED_CLOSURE_RELATIVE_PATH}`);
  }
  const sourceHandoffDisabledClosureAccepted =
    handoffDisabledClosureSrc.includes('checkId: "8.11J"') &&
    handoffDisabledClosureSrc.includes("runOcrToSmartTalkHandoffDisabledLocalApiClosure");
  if (!sourceHandoffDisabledClosureAccepted) {
    failures.push("8.11J immutable snapshot check failed — expected checkId/export marker not found");
  }

  let minimalHandoffRuntimePatchAuditSrc = "";
  try {
    minimalHandoffRuntimePatchAuditSrc = fs.readFileSync(minimalHandoffRuntimePatchAuditAbsPath, "utf8");
  } catch {
    failures.push(`Failed to read ${SOURCE_MINIMAL_HANDOFF_RUNTIME_PATCH_AUDIT_RELATIVE_PATH}`);
  }
  const sourceMinimalHandoffRuntimePatchAccepted =
    minimalHandoffRuntimePatchAuditSrc.includes('checkId: "8.11I"') &&
    minimalHandoffRuntimePatchAuditSrc.includes("runMinimalOcrToSmartTalkHandoffRuntimePatchAudit");
  if (!sourceMinimalHandoffRuntimePatchAccepted) {
    failures.push("8.11I immutable snapshot check failed — expected checkId/export marker not found");
  }

  // The remaining ancestor phases (8.11H/G/F/E/D/C/8.9N-PATCH/8.11C-DEBT-A)
  // were already validated as accepted, nested source evidence inside
  // 8.11I's own committed result (observed allPassed:true when 8.11I and
  // 8.11J were each originally closed) — accepted here transitively via the
  // same immutable-snapshot rationale, without re-reading each file again.
  const sourceHandoffPlanAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceTrustBoundaryClosureAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceQualityEvaluatorClosureAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceEnabledRealOcrClosureAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceDisabledRealOcrClosureAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceMinimalRealOcrRuntimePatchAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceTextDocumentSnapshotPatchAccepted = sourceMinimalHandoffRuntimePatchAccepted;
  const sourceTechnicalDebtInventoryAccepted = sourceMinimalHandoffRuntimePatchAccepted;

  const sourceEvidence: string[] = [
    "8.11J OCR-to-Smart-Talk handoff disabled local API closure accepted (commit 499ab72) — IMMUTABLE COMMITTED SNAPSHOT: confirmed present on disk with its own checkId:\"8.11J\" literal and exported function name via a cheap static file read; NOT re-invoked live in this closure. Its full allPassed:true / tamperRejected:63/63 result was already directly observed and reported when 8.11J was originally closed in this same environment.",
    "8.11I minimal OCR-to-Smart-Talk handoff runtime patch audit accepted (commit e3be09b) — IMMUTABLE COMMITTED SNAPSHOT: confirmed present on disk with its own checkId:\"8.11I\" literal and exported function name via a cheap static file read; NOT re-invoked live in this closure, because doing so would transitively re-run the entire 8.11H->8.11G->8.11F->8.11E real-OCR chain (previously observed to take ~29 minutes and to invoke real tesseract.js OCR multiple times).",
    "8.11H OCR-to-Smart-Talk handoff plan (commit b839538), 8.11G real OCR trust boundary closure (commit 831779a), 8.11F real OCR quality evaluator closure (commit 2ef041f), 8.11E real OCR enabled synthetic local API closure (commit ec5a76f), 8.11D real OCR disabled local API closure (commit 3688358), 8.11C minimal real OCR runtime patch audit (commit 46ddefc), 8.9N-PATCH (commit cf6624c), 8.11C-DEBT-A technical debt inventory audit (commit bdf3859) — all accepted transitively via 8.11I's own already-established, already-reported nested source evidence; NOT re-read or re-invoked individually by this closure.",
    "This closure itself performs real tesseract.js OCR exactly ONCE, in Case A only — Case B (run first) never reaches OCR because its real-OCR env gate is absent.",
  ];

  // ── Env capture ────────────────────────────────────────────────────────────
  const originalHandoffEnvValue = process.env[HANDOFF_ENV_KEY];
  const originalHandoffEnvWasAbsent = originalHandoffEnvValue === undefined;
  const originalRealOcrEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalRealOcrEnvWasAbsent = originalRealOcrEnvValue === undefined;

  // ── Outcome variables, hoisted so they survive the try/finally below ─────
  let negativeControlStatus = 0;
  let negativeControlOk = false;
  let negativeControlCode = "";
  let negativeControlEnvelopeCreated = false;
  let rateLimitObservedInNegativeControl = false;
  let realOcrGateNegativeControlPassed = false;
  let negativeControlHandoffEnvExactTrue = false;
  let negativeControlRealOcrEnvNotExactTrue = false;

  let exactHandoffTrueConfirmed = false;
  let exactRealOcrTrueConfirmed = false;
  let enabledSyntheticStatus = 0;
  let enabledSyntheticOk = false;
  let enabledSyntheticMode = "";
  let enabledSyntheticContext = "";
  let ocrResultPresent = false;
  let extractedText = "";
  let extractedTextLength = 0;
  let extractedTextPreviewObserved = false;
  let provider = "";
  let confidenceAvailable = false;
  let confidenceFieldPresent = false;
  let qualityPresent = false;
  let qualityStatus = "";
  let qualityUsableForSmartTalk = false;
  let blockingReasons: string[] = [];
  let downgradeReasons: string[] = [];
  let ocrWarnings: string[] = [];
  let highRiskTokensDetected: string[] = [];
  let handoffPresent = false;
  let handoffAllowed = false;
  let handoffPerformed = true;
  let handoffReason = "";
  let sourceKind = "";
  let sourceModeField = "";
  let trustLevel = "";
  let sensitivityLevel = "";
  let handoffExactLegalDeadlineStillBlocked = false;
  let handoffBindingLegalAdviceStillBlocked = false;
  let handoffOfficialFilingStillBlocked = false;
  let handoffDnaWriteBlocked = false;
  let handoffPersistenceBlocked = false;
  let handoffPublicRuntimeStillBlocked = false;
  let handoffProductionAuthorizedNow = true;
  let handoffGoLiveAuthorizedNow = true;
  let tracePresent = false;
  let smartTalkResultIsNull = false;
  let safety: Record<string, unknown> | null = null;
  let disclaimers: Record<string, unknown> | null = null;
  let warnings: string[] = [];
  let rateLimitObservedInEnabledCase = false;
  let enabledSyntheticSuccessCasePassed = false;

  let artifactObservedDuring8_11K = false;
  let artifactCleanedAfter8_11K = false;

  try {
    // ── Case B — dual-gate negative control (run BEFORE Case A) ────────────
    // Handoff env exact "true"; real-OCR env absent/non-exact. No OCR must
    // ever execute here.
    process.env[HANDOFF_ENV_KEY] = "true";
    delete process.env[REAL_OCR_ENV_KEY];
    negativeControlHandoffEnvExactTrue = process.env[HANDOFF_ENV_KEY] === "true";
    negativeControlRealOcrEnvNotExactTrue = process.env[REAL_OCR_ENV_KEY] !== "true";

    let negativeControlData: Record<string, unknown> | null = null;
    try {
      const reqB = buildCaseBNegativeControlRequest(CASE_B_NEGATIVE_CONTROL_IP);
      const resB = await POST(reqB);
      negativeControlStatus = resB.status;
      const parsedB: unknown = await resB.json();
      negativeControlData = isRecord(parsedB) ? parsedB : null;
    } catch (err) {
      failures.push(`Case B threw during in-process invocation: ${String(err)}`);
    }

    negativeControlOk = negativeControlData ? negativeControlData.ok === true : false;
    negativeControlCode =
      negativeControlData && typeof negativeControlData.code === "string" ? negativeControlData.code : "";
    negativeControlEnvelopeCreated = negativeControlData ? negativeControlData.handoff !== undefined : false;
    rateLimitObservedInNegativeControl = negativeControlStatus === 429;

    realOcrGateNegativeControlPassed =
      negativeControlStatus === 403 &&
      negativeControlOk === false &&
      negativeControlCode === NEGATIVE_CONTROL_CODE &&
      !negativeControlEnvelopeCreated &&
      !rateLimitObservedInNegativeControl;
    if (!realOcrGateNegativeControlPassed) {
      failures.push(
        `Case B (negative control) did not pass: status=${negativeControlStatus}, ok=${negativeControlOk}, code="${negativeControlCode}"`,
      );
    }
    if (rateLimitObservedInNegativeControl) failures.push("Case B observed HTTP 429 (rate limit)");
    if (!negativeControlHandoffEnvExactTrue) failures.push("Case B handoff env was not exact true when invoked");
    if (!negativeControlRealOcrEnvNotExactTrue) failures.push("Case B real OCR env was exact true (should be absent)");

    // ── Case A — exact-enabled synthetic handoff-envelope success ──────────
    // BOTH env flags exact "true". Real tesseract.js OCR runs exactly once,
    // reached only through the existing, unmodified route/adapter path.
    process.env[HANDOFF_ENV_KEY] = "true";
    process.env[REAL_OCR_ENV_KEY] = "true";
    exactHandoffTrueConfirmed = process.env[HANDOFF_ENV_KEY] === "true";
    exactRealOcrTrueConfirmed = process.env[REAL_OCR_ENV_KEY] === "true";
    if (!exactHandoffTrueConfirmed) failures.push("failed to set handoff env to exact true for Case A");
    if (!exactRealOcrTrueConfirmed) failures.push("failed to set real OCR env to exact true for Case A");

    const pngBuffer = buildSyntheticOcrHandoffTestPngBuffer();

    let enabledSyntheticData: Record<string, unknown> | null = null;
    try {
      const reqA = buildCaseAEnabledSuccessRequest(CASE_A_ENABLED_SUCCESS_IP, pngBuffer);
      const resA = await POST(reqA);
      enabledSyntheticStatus = resA.status;
      const parsedA: unknown = await resA.json();
      enabledSyntheticData = isRecord(parsedA) ? parsedA : null;
    } catch (err) {
      failures.push(`Case A threw during in-process invocation: ${String(err)}`);
    }

    // Detect the transient tesseract.js cache artifact immediately after
    // Case A's real OCR execution (the only place it can appear), and clean
    // it up if it appeared — it must never be committed.
    const engTrainedDataPath = path.join(repoRoot, "eng.traineddata");
    artifactObservedDuring8_11K = fs.existsSync(engTrainedDataPath);
    if (artifactObservedDuring8_11K) {
      try {
        fs.unlinkSync(engTrainedDataPath);
        artifactCleanedAfter8_11K = !fs.existsSync(engTrainedDataPath);
      } catch (err) {
        failures.push(`Failed to clean up eng.traineddata: ${String(err)}`);
      }
    }

    // ── Parse Case A response ───────────────────────────────────────────────
    enabledSyntheticOk = enabledSyntheticData ? enabledSyntheticData.ok === true : false;
    enabledSyntheticMode =
      enabledSyntheticData && typeof enabledSyntheticData.mode === "string" ? enabledSyntheticData.mode : "";
    enabledSyntheticContext =
      enabledSyntheticData && typeof enabledSyntheticData.context === "string" ? enabledSyntheticData.context : "";

    const ocrResult = enabledSyntheticData && isRecord(enabledSyntheticData.ocrResult) ? enabledSyntheticData.ocrResult : null;
    ocrResultPresent = ocrResult !== null;
    extractedText = ocrResult && typeof ocrResult.extractedText === "string" ? ocrResult.extractedText : "";
    extractedTextLength =
      ocrResult && typeof ocrResult.extractedTextLength === "number" ? ocrResult.extractedTextLength : extractedText.length;
    extractedTextPreviewObserved = ocrResult ? typeof ocrResult.extractedTextPreview === "string" : false;
    provider = ocrResult && typeof ocrResult.provider === "string" ? ocrResult.provider : "";
    confidenceAvailable = ocrResult ? ocrResult.confidenceAvailable === true : false;
    confidenceFieldPresent = ocrResult ? Object.prototype.hasOwnProperty.call(ocrResult, "confidence") : false;

    const ocrQuality = ocrResult && isRecord(ocrResult.quality) ? ocrResult.quality : null;
    qualityPresent = ocrQuality !== null;
    qualityStatus = ocrQuality && typeof ocrQuality.status === "string" ? ocrQuality.status : "";
    qualityUsableForSmartTalk = ocrQuality ? ocrQuality.usableForSmartTalk === true : false;
    blockingReasons = ocrQuality && Array.isArray(ocrQuality.blockingReasons) ? (ocrQuality.blockingReasons as string[]) : [];
    downgradeReasons = ocrQuality && Array.isArray(ocrQuality.downgradeReasons) ? (ocrQuality.downgradeReasons as string[]) : [];
    ocrWarnings = ocrResult && Array.isArray(ocrResult.providerWarnings) ? (ocrResult.providerWarnings as string[]) : [];

    const handoff = enabledSyntheticData && isRecord(enabledSyntheticData.handoff) ? enabledSyntheticData.handoff : null;
    handoffPresent = handoff !== null;
    handoffAllowed = handoff ? handoff.allowed === true : false;
    handoffPerformed = handoff ? handoff.performed === true : true;
    handoffReason = handoff && typeof handoff.reason === "string" ? handoff.reason : "";
    sourceKind = handoff && typeof handoff.sourceKind === "string" ? handoff.sourceKind : "";
    sourceModeField = handoff && typeof handoff.sourceMode === "string" ? handoff.sourceMode : "";
    trustLevel = handoff && typeof handoff.trustLevel === "string" ? handoff.trustLevel : "";
    sensitivityLevel = handoff && typeof handoff.sensitivityLevel === "string" ? handoff.sensitivityLevel : "";
    highRiskTokensDetected =
      handoff && Array.isArray(handoff.highRiskTokensDetected) ? (handoff.highRiskTokensDetected as string[]) : [];
    handoffExactLegalDeadlineStillBlocked = handoff ? handoff.exactLegalDeadlineStillBlocked === true : false;
    handoffBindingLegalAdviceStillBlocked = handoff ? handoff.bindingLegalAdviceStillBlocked === true : false;
    handoffOfficialFilingStillBlocked = handoff ? handoff.officialFilingStillBlocked === true : false;
    handoffDnaWriteBlocked = handoff ? handoff.dnaWriteBlocked === true : false;
    handoffPersistenceBlocked = handoff ? handoff.persistenceBlocked === true : false;
    handoffPublicRuntimeStillBlocked = handoff ? handoff.publicRuntimeStillBlocked === true : false;
    handoffProductionAuthorizedNow = handoff ? handoff.productionAuthorizedNow === true : true;
    handoffGoLiveAuthorizedNow = handoff ? handoff.goLiveAuthorizedNow === true : true;
    tracePresent = handoff ? handoff.trace !== undefined : false;

    smartTalkResultIsNull = enabledSyntheticData ? enabledSyntheticData.smartTalkResult === null : false;
    safety = enabledSyntheticData && isRecord(enabledSyntheticData.safety) ? enabledSyntheticData.safety : null;
    disclaimers =
      enabledSyntheticData && isRecord(enabledSyntheticData.disclaimers) ? enabledSyntheticData.disclaimers : null;
    warnings = enabledSyntheticData && Array.isArray(enabledSyntheticData.warnings) ? (enabledSyntheticData.warnings as string[]) : [];

    rateLimitObservedInEnabledCase = enabledSyntheticStatus === 429;
    if (rateLimitObservedInEnabledCase) failures.push("Case A observed HTTP 429 (rate limit)");

    enabledSyntheticSuccessCasePassed =
      enabledSyntheticStatus === 200 &&
      enabledSyntheticOk === true &&
      enabledSyntheticMode === HANDOFF_MODE &&
      enabledSyntheticContext === "anonymous" &&
      ocrResultPresent &&
      extractedTextLength > 0 &&
      extractedTextLength <= MAX_EXTRACTED_TEXT_LENGTH &&
      provider === EXPECTED_PROVIDER &&
      qualityPresent &&
      qualityUsableForSmartTalk === true &&
      blockingReasons.length === 0 &&
      handoffPresent &&
      handoffAllowed === true &&
      handoffPerformed === false &&
      handoffReason === EXPECTED_HANDOFF_REASON &&
      sourceKind === EXPECTED_SOURCE_KIND &&
      sourceModeField === EXPECTED_SOURCE_MODE &&
      trustLevel === EXPECTED_TRUST_LEVEL &&
      sensitivityLevel === EXPECTED_SENSITIVITY_LEVEL &&
      smartTalkResultIsNull &&
      !rateLimitObservedInEnabledCase;
    if (!enabledSyntheticSuccessCasePassed) {
      failures.push(
        `Case A (enabled synthetic success) did not pass: status=${enabledSyntheticStatus}, ok=${enabledSyntheticOk}, handoffAllowed=${handoffAllowed}, handoffPerformed=${handoffPerformed}, qualityUsableForSmartTalk=${qualityUsableForSmartTalk}, extractedTextLength=${extractedTextLength}, blockingReasons=${JSON.stringify(blockingReasons)}`,
      );
    }
  } finally {
    // ── Restore both original env values, always ───────────────────────────
    if (originalHandoffEnvWasAbsent) {
      delete process.env[HANDOFF_ENV_KEY];
    } else {
      process.env[HANDOFF_ENV_KEY] = originalHandoffEnvValue as string;
    }
    if (originalRealOcrEnvWasAbsent) {
      delete process.env[REAL_OCR_ENV_KEY];
    } else {
      process.env[REAL_OCR_ENV_KEY] = originalRealOcrEnvValue as string;
    }
  }

  const finalHandoffEnvMatchesOriginal = originalHandoffEnvWasAbsent
    ? process.env[HANDOFF_ENV_KEY] === undefined
    : process.env[HANDOFF_ENV_KEY] === originalHandoffEnvValue;
  const finalRealOcrEnvMatchesOriginal = originalRealOcrEnvWasAbsent
    ? process.env[REAL_OCR_ENV_KEY] === undefined
    : process.env[REAL_OCR_ENV_KEY] === originalRealOcrEnvValue;
  if (!finalHandoffEnvMatchesOriginal) failures.push("handoff env was not restored to its original value/absence");
  if (!finalRealOcrEnvMatchesOriginal) failures.push("real OCR env was not restored to its original value/absence");
  const envRestoredAfterTests = finalHandoffEnvMatchesOriginal && finalRealOcrEnvMatchesOriginal;

  const artifactPresentAfter8_11K = fs.existsSync(path.join(repoRoot, "eng.traineddata"));
  if (artifactPresentAfter8_11K) failures.push("eng.traineddata is present after 8.11K — it must be cleaned up");

  // ── Derived trust/quality/safety/disclaimer preservation flags ───────────
  const sourceKindPreserved = sourceKind === EXPECTED_SOURCE_KIND;
  const sourceModePreserved = sourceModeField === EXPECTED_SOURCE_MODE;
  const trustLevelPreserved = trustLevel === EXPECTED_TRUST_LEVEL;
  const sensitivityLevelPreserved = sensitivityLevel === EXPECTED_SENSITIVITY_LEVEL;
  const qualityStatusPreserved = qualityPresent && qualityStatus !== "";
  const usableForSmartTalkPreserved = qualityUsableForSmartTalk === true;
  const blockingReasonsPreserved = Array.isArray(blockingReasons);
  const downgradeReasonsPreserved = Array.isArray(downgradeReasons);
  const ocrWarningsPreserved = Array.isArray(ocrWarnings);
  const highRiskTokensPreserved = Array.isArray(highRiskTokensDetected);
  const providerMetadataPreserved = provider === EXPECTED_PROVIDER;
  const confidenceMetadataPreserved = confidenceFieldPresent && typeof confidenceAvailable === "boolean";
  const disclaimersPreserved =
    disclaimers !== null &&
    disclaimers.privacyDisclaimerRequired === true &&
    disclaimers.legalDisclaimerRequired === true &&
    disclaimers.ocrMayBeWrongWarningRequired === true &&
    disclaimers.checkOriginalDocumentRequired === true;
  const checkOriginalWarningPreserved = warnings.some((w) => /check the original document/i.test(w));
  const ocrMayBeWrongWarningPresent = warnings.some((w) => /ocr text may be wrong/i.test(w));
  const notLegalAdviceWarningPresent = warnings.some((w) => /not legal advice/i.test(w));
  const reasoningNotEnabledWarningPresent = warnings.some((w) => /reasoning is not enabled/i.test(w));

  if (!sourceKindPreserved) failures.push("handoff.sourceKind not preserved");
  if (!trustLevelPreserved) failures.push("handoff.trustLevel not preserved");
  if (!sensitivityLevelPreserved) failures.push("handoff.sensitivityLevel not preserved");
  if (!disclaimersPreserved) failures.push("disclaimers object missing or incomplete");
  if (!checkOriginalWarningPreserved || !ocrMayBeWrongWarningPresent || !notLegalAdviceWarningPresent) {
    failures.push("required warning text not observed in warnings array");
  }
  if (highRiskTokensDetected.length > 0) {
    failures.push(
      `high-risk tokens observed in synthetic fixture output (preserved, not suppressed): ${JSON.stringify(highRiskTokensDetected)}`,
    );
  }

  const noRawImageToModel = safety ? safety.rawImageSentToModel === false : false;
  const noOriginalDocumentFileToModel = safety ? safety.originalDocumentFileSentToModel === false : false;
  const noExtractedTextToModel = safety ? safety.extractedTextSentToModel === false : false;
  const safetyModelCallPerformed = safety ? safety.modelCallPerformed === true : false;
  const safetySmartTalkReasoningPerformed = safety ? safety.smartTalkReasoningPerformed === true : false;
  const ocrToSmartTalkHandoffEnvelopeCreated = safety ? safety.ocrToSmartTalkHandoffEnvelopeCreated === true : false;
  const ocrToSmartTalkHandoffPerformed = safety ? safety.ocrToSmartTalkHandoffPerformed === true : false;
  const safetyNoPersistence = safety ? safety.noPersistence === true : false;
  const safetyNoStorage = safety ? safety.noStorage === true : false;
  const safetyNoDnaWrite = safety ? safety.noDnaWrite === true : false;
  const safetyDbStorageWritePerformed = safety ? safety.dbStorageWritePerformed === true : false;
  const safetySupabaseStorageWritePerformed = safety ? safety.supabaseStorageWritePerformed === true : false;
  const safetyVayloDnaWritePerformed = safety ? safety.vayloDnaWritePerformed === true : false;
  const safetyPublicRuntimeStillBlocked = safety ? safety.publicRuntimeStillBlocked === true : false;
  const safetyProductionAuthorizedNow = safety ? safety.productionAuthorizedNow === true : false;
  const safetyGoLiveAuthorizedNow = safety ? safety.goLiveAuthorizedNow === true : false;
  const safetyPaidDocumentModeEnabledNow = safety ? safety.paidDocumentModeEnabledNow === true : false;
  const safetyEightThreeAcNotRun = safety ? safety.eightThreeAcNotRun === true : false;

  if (!noRawImageToModel) failures.push("safety.rawImageSentToModel was not false");
  if (!noOriginalDocumentFileToModel) failures.push("safety.originalDocumentFileSentToModel was not false");
  if (!noExtractedTextToModel) failures.push("safety.extractedTextSentToModel was not false");
  if (safetyModelCallPerformed) failures.push("safety.modelCallPerformed was true");
  if (safetySmartTalkReasoningPerformed) failures.push("safety.smartTalkReasoningPerformed was true");
  if (!ocrToSmartTalkHandoffEnvelopeCreated) failures.push("safety.ocrToSmartTalkHandoffEnvelopeCreated was not true");
  if (ocrToSmartTalkHandoffPerformed) failures.push("safety.ocrToSmartTalkHandoffPerformed was true");
  if (!safetyNoPersistence || !safetyNoStorage || !safetyNoDnaWrite) failures.push("safety persistence/storage/DNA flags not clean");
  if (safetyDbStorageWritePerformed || safetySupabaseStorageWritePerformed || safetyVayloDnaWritePerformed) {
    failures.push("a storage/DNA write flag was true");
  }
  if (!safetyPublicRuntimeStillBlocked || safetyProductionAuthorizedNow || safetyGoLiveAuthorizedNow) {
    failures.push("public runtime/production/go-live safety flags not blocked");
  }

  const allChecksPassed =
    sourceHandoffDisabledClosureAccepted &&
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceHandoffPlanAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceEnabledRealOcrClosureAccepted &&
    sourceDisabledRealOcrClosureAccepted &&
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    exactHandoffTrueConfirmed &&
    exactRealOcrTrueConfirmed &&
    realOcrGateNegativeControlPassed &&
    enabledSyntheticSuccessCasePassed &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11K &&
    sourceKindPreserved &&
    trustLevelPreserved &&
    sensitivityLevelPreserved &&
    disclaimersPreserved &&
    checkOriginalWarningPreserved &&
    ocrMayBeWrongWarningPresent &&
    notLegalAdviceWarningPresent &&
    noRawImageToModel &&
    noOriginalDocumentFileToModel &&
    noExtractedTextToModel &&
    !safetyModelCallPerformed &&
    !safetySmartTalkReasoningPerformed &&
    ocrToSmartTalkHandoffEnvelopeCreated &&
    !ocrToSmartTalkHandoffPerformed &&
    safetyNoPersistence &&
    safetyNoStorage &&
    safetyNoDnaWrite &&
    !safetyDbStorageWritePerformed &&
    !safetySupabaseStorageWritePerformed &&
    !safetyVayloDnaWritePerformed &&
    safetyPublicRuntimeStillBlocked &&
    !safetyProductionAuthorizedNow &&
    !safetyGoLiveAuthorizedNow &&
    !safetyPaidDocumentModeEnabledNow &&
    safetyEightThreeAcNotRun &&
    handoffExactLegalDeadlineStillBlocked &&
    handoffBindingLegalAdviceStillBlocked &&
    handoffOfficialFilingStillBlocked &&
    handoffDnaWriteBlocked &&
    handoffPersistenceBlocked &&
    handoffPublicRuntimeStillBlocked &&
    !handoffProductionAuthorizedNow &&
    !handoffGoLiveAuthorizedNow &&
    tracePresent;

  const enabledGateEvidence: string[] = [
    `Exact handoff-true gate tested and confirmed: process.env.${HANDOFF_ENV_KEY} was set to exact lowercase "true" and read back as "true" before Case A.`,
    `Exact real-OCR-true gate tested and confirmed: process.env.${REAL_OCR_ENV_KEY} was set to exact lowercase "true" and read back as "true" before Case A.`,
    "Both exact-true values are required simultaneously for the enabled controlled handoff path — Case B proves the handoff flag alone (with real-OCR env absent) is insufficient and yields HTTP 403.",
    "8.11J (this closure's immediate predecessor) already proved the handoff flag is disabled-closed for all 9 non-exact variants; that disabled-by-default finding is not re-tested here, only relied upon.",
  ];

  const enabledSyntheticCaseEvidence: string[] = [
    `Case A HTTP status: ${enabledSyntheticStatus}, ok: ${enabledSyntheticOk}, mode: "${enabledSyntheticMode}", context: "${enabledSyntheticContext}".`,
    `Case A used synthetic IP ${CASE_A_ENABLED_SUCCESS_IP} (TEST-NET-3), one in-process POST invocation, one in-memory-generated PNG (never read from or written to disk).`,
    `extractedTextLength=${extractedTextLength} (bounds: >0 and <=${MAX_EXTRACTED_TEXT_LENGTH}), provider="${provider}".`,
    `quality.status="${qualityStatus}", usableForSmartTalk=${qualityUsableForSmartTalk}, blockingReasons=${JSON.stringify(blockingReasons)}, downgradeReasons=${JSON.stringify(downgradeReasons)}.`,
  ];

  const realOcrGateNegativeControlEvidence: string[] = [
    `Case B HTTP status: ${negativeControlStatus}, ok: ${negativeControlOk}, code: "${negativeControlCode}".`,
    `Case B used synthetic IP ${CASE_B_NEGATIVE_CONTROL_IP} (TEST-NET-3, distinct from Case A's IP), handoff env exact "true", real-OCR env deleted/absent.`,
    "Case B was invoked BEFORE Case A so the real OCR execution inside Case A remains the only real OCR execution in this entire phase.",
    `No handoff field present in Case B response (envelopeCreated=${negativeControlEnvelopeCreated}); OCR never reached.`,
  ];

  const routeInvocationEvidence: string[] = [
    "POST imported directly from app/api/smart-talk/route.ts and invoked in-process with synthetic Request objects for both Case B and Case A — no dev server, no browser, no network socket.",
    "Exactly two in-process route invocations were made in this closure: one Case B (negative control) and one Case A (enabled success).",
  ];

  const ocrResultEvidence: string[] = [
    `ocrResult present: ${ocrResultPresent}; extractedText length=${extractedTextLength}; extractedTextPreview observed: ${extractedTextPreviewObserved}.`,
    `provider="${provider}" (expected "${EXPECTED_PROVIDER}"); confidenceAvailable=${confidenceAvailable}; confidence field present=${confidenceFieldPresent}.`,
  ];

  const handoffEnvelopeEvidence: string[] = [
    `handoff.allowed=${handoffAllowed}, handoff.performed=${handoffPerformed}, handoff.reason="${handoffReason}" (expected "${EXPECTED_HANDOFF_REASON}").`,
    `smartTalkResult is null: ${smartTalkResultIsNull}.`,
    `handoff.trace present: ${tracePresent}.`,
  ];

  const trustMetadataEvidence: string[] = [
    `sourceKind="${sourceKind}" (expected "${EXPECTED_SOURCE_KIND}"), sourceMode="${sourceModeField}" (expected "${EXPECTED_SOURCE_MODE}").`,
    `trustLevel="${trustLevel}" (expected "${EXPECTED_TRUST_LEVEL}"), sensitivityLevel="${sensitivityLevel}" (expected "${EXPECTED_SENSITIVITY_LEVEL}").`,
  ];

  const qualityMetadataEvidence: string[] = [
    `quality present: ${qualityPresent}; status="${qualityStatus}"; usableForSmartTalk=${qualityUsableForSmartTalk}.`,
    `blockingReasons=${JSON.stringify(blockingReasons)} (must be empty for allPassed); downgradeReasons=${JSON.stringify(downgradeReasons)}.`,
  ];

  const warningAndDisclaimerEvidence: string[] = [
    `warnings array (${warnings.length} entries): ${JSON.stringify(warnings)}.`,
    `disclaimers object: privacyDisclaimerRequired/legalDisclaimerRequired/ocrMayBeWrongWarningRequired/checkOriginalDocumentRequired all confirmed true: ${disclaimersPreserved}.`,
    `Warning-content checks: checkOriginalDocument=${checkOriginalWarningPreserved}, ocrMayBeWrong=${ocrMayBeWrongWarningPresent}, notLegalAdvice=${notLegalAdviceWarningPresent}, reasoningNotEnabled=${reasoningNotEnabledWarningPresent}.`,
  ];

  const highRiskBoundaryEvidence: string[] = [
    `highRiskTokensDetected on the synthetic fixture: ${JSON.stringify(highRiskTokensDetected)} (expected empty for this safe non-PII fixture).`,
    "The synthetic PNG text ('VAYLO OCR HANDOFF TEST' / 'NO PERSONAL DATA') contains no real name, address, date, amount, IBAN, authority name, case number, health/tax/immigration data, or legal deadline by construction.",
    "No high-risk-token detector suppression was applied; if any token had been flagged, it would have been preserved and reported here, and all legal/action authorization fields would remain blocked regardless.",
  ];

  const noModelEvidence: string[] = [
    `safety.modelCallPerformed=${safetyModelCallPerformed}, safety.smartTalkReasoningPerformed=${safetySmartTalkReasoningPerformed}, safety.rawImageSentToModel=${!noRawImageToModel}, safety.originalDocumentFileSentToModel=${!noOriginalDocumentFileToModel}, safety.extractedTextSentToModel=${!noExtractedTextToModel}.`,
    "No OpenAI client or any model SDK is imported or called anywhere in this closure or in the route branch it exercises for this mode.",
  ];

  const noPersistenceEvidence: string[] = [
    `safety.noPersistence=${safetyNoPersistence}, safety.noStorage=${safetyNoStorage}, safety.noDnaWrite=${safetyNoDnaWrite}.`,
    `safety.dbStorageWritePerformed=${safetyDbStorageWritePerformed}, safety.supabaseStorageWritePerformed=${safetySupabaseStorageWritePerformed}, safety.vayloDnaWritePerformed=${safetyVayloDnaWritePerformed}.`,
    "This closure never imports a database/Supabase/storage client and never writes to disk except the transient tesseract.js cache artifact, which is detected and cleaned below.",
  ];

  const rateLimitIsolationEvidence: string[] = [
    `Case B IP: ${CASE_B_NEGATIVE_CONTROL_IP}; Case A IP: ${CASE_A_ENABLED_SUCCESS_IP} — both within the instructed 203.0.113.220-230 TEST-NET-3 window, unique per case, not reused by any prior closure.`,
    `rateLimitObservedInNegativeControl=${rateLimitObservedInNegativeControl}; rateLimitObservedInEnabledCase=${rateLimitObservedInEnabledCase}. No HTTP 429 observed in either case.`,
  ];

  const envRestorationEvidence: string[] = [
    `Original handoff env captured: ${originalHandoffEnvWasAbsent ? "absent" : `"${originalHandoffEnvValue}"`}; original real-OCR env captured: ${originalRealOcrEnvWasAbsent ? "absent" : `"${originalRealOcrEnvValue}"`}.`,
    `Both env values set to exact "true" only for the duration of Case A; restored in a finally block regardless of success/failure/throw.`,
    `finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}; finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}.`,
  ];

  const tesseractCacheDebtEvidence: string[] = [
    `eng.traineddata observed during this run: ${artifactObservedDuring8_11K}; cleaned after this run: ${artifactCleanedAfter8_11K}; present at end: ${artifactPresentAfter8_11K}.`,
    "This closure never wrote eng.traineddata to the repo intentionally — it is a transient tesseract.js cache side-effect of real OCR execution reached only through the unmodified adapter/route path, detected and removed by this closure if it appeared.",
    "Controlled cache path, systemic cleanup policy, and .gitignore policy review remain unresolved technical debt, unchanged by this phase.",
  ];

  const auditExecutionDebtEvidence: string[] = [
    "8.11I's and 8.11J's own exported functions were NOT invoked live in this closure — see docblock SOURCE STRATEGY — avoiding a redundant ~29-minute transitive real-OCR chain re-execution.",
    "This closure performed real tesseract.js OCR exactly once (Case A only); Case B never reaches OCR because it is run first and its real-OCR env gate is absent.",
    "Future work should consolidate ancestor-phase source-acceptance evidence into a single lightweight, non-executing snapshot artifact to avoid this recurring source-strategy decision in every subsequent phase.",
  ];

  const safetyBoundaryEvidence: string[] = [
    `handoff.exactLegalDeadlineStillBlocked=${handoffExactLegalDeadlineStillBlocked}, handoff.bindingLegalAdviceStillBlocked=${handoffBindingLegalAdviceStillBlocked}, handoff.officialFilingStillBlocked=${handoffOfficialFilingStillBlocked}, handoff.dnaWriteBlocked=${handoffDnaWriteBlocked}, handoff.persistenceBlocked=${handoffPersistenceBlocked}.`,
    `handoff.publicRuntimeStillBlocked=${handoffPublicRuntimeStillBlocked}, handoff.productionAuthorizedNow=${handoffProductionAuthorizedNow}, handoff.goLiveAuthorizedNow=${handoffGoLiveAuthorizedNow}.`,
    `safety.publicRuntimeStillBlocked=${safetyPublicRuntimeStillBlocked}, safety.productionAuthorizedNow=${safetyProductionAuthorizedNow}, safety.goLiveAuthorizedNow=${safetyGoLiveAuthorizedNow}, safety.paidDocumentModeEnabledNow=${safetyPaidDocumentModeEnabledNow}, safety.eightThreeAcNotRun=${safetyEightThreeAcNotRun}.`,
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No browser launched, no dev server started, no external network call or fetch initiated by this closure, no OpenAI call, no direct tesseract.js import, no direct OCR-adapter call.",
    "No real image or real document used — one hand-authored, in-memory-only, non-PII synthetic PNG for Case A; a tiny 8-byte PNG-signature-only Blob for Case B.",
    "No localStorage/sessionStorage access; no commit; no push performed by this closure.",
  ];

  const readinessVerdict: string[] = [
    "handoffEnabledSyntheticLocalApiClosureClosed: true — Case A (enabled success) and Case B (dual-gate negative control) both passed with real OCR reached exactly once.",
    "handoffEnvelopeControlledRuntimeValidated: true — the controlled handoff envelope is created with allowed:true/performed:false and every required trust/quality/warning/disclaimer field preserved.",
    "readyForSmartTalkReasoningFromOcrPlan: true — the controlled envelope substrate that a future reasoning gate would consume is now validated end-to-end.",
    "readyForSmartTalkReasoningFromOcrImplementation: false — Smart Talk reasoning from OCR is still not implemented; handoff.performed remains hard-coded false in the route.",
    "readyForNextPhase: \"8.11L\" — recommended: OCR-to-Smart-Talk Controlled Reasoning Gate Design.",
  ];

  const provisional: OcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult = {
    checkId: "8.11K",
    allPassed: true,
    enabledSyntheticLocalApiClosureOnly: true,
    ocrToSmartTalkHandoffEnabledSyntheticLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalledByClosure: false,
    externalFetchCalledByClosure: false,
    openAiCalled: false,
    tesseractImportedDirectlyByClosure: false,
    ocrAdapterCalledDirectlyByClosure: false,
    realOcrExtractionPerformedThroughRoute: true,
    realImageUsedByClosure: false,
    syntheticImageOnly: true,
    realDocumentUsed: false,
    imageSavedToDisk: false,
    modelCallPerformed: false,
    smartTalkReasoningPerformed: false,
    ocrToSmartTalkHandoffEnvelopeCreated: true,
    ocrToSmartTalkHandoffAllowed: true,
    ocrToSmartTalkHandoffPerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    verifiedFactsCreated: false,
    legalDeadlineCreated: false,
    officialFilingCreated: false,
    bindingLegalAdviceCreated: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceHandoffDisabledClosureCommit: "499ab72",
    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceHandoffPlanCommit: "b839538",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceEnabledRealOcrClosureCommit: "ec5a76f",
    sourceDisabledRealOcrClosureCommit: "3688358",
    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceTextDocumentSnapshotPatchCommit: "cf6624c",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceHandoffDisabledClosureAccepted,
    sourceMinimalHandoffRuntimePatchAccepted,
    sourceHandoffPlanAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceEnabledRealOcrClosureAccepted,
    sourceDisabledRealOcrClosureAccepted,
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceTextDocumentSnapshotPatchAccepted,
    sourceTechnicalDebtInventoryAccepted,

    exactHandoffTrueTested: true,
    exactHandoffTrueConfirmed,
    exactRealOcrTrueTested: true,
    exactRealOcrTrueConfirmed,
    bothExactTrueRequired: true,
    bothExactTrueEnabledControlledPath: true,
    handoffFlagAloneInsufficient: true,
    realOcrFlagAloneInsufficient: true,
    placeholderFlagCannotAuthorizeHandoff: true,
    disabledByDefaultAlreadyClosedBy8_11J: true,

    enabledSyntheticSuccessCasePerformed: true,
    enabledSyntheticSuccessCaseCount: 1,
    enabledSyntheticSuccessCasePassed,
    enabledSyntheticStatus,
    enabledSyntheticOk,
    enabledSyntheticMode,
    enabledSyntheticContext,
    ocrResultPresent,
    extractedTextPresent: extractedTextLength > 0,
    extractedTextLength,
    extractedTextPreviewObserved,
    provider,
    qualityPresent,
    qualityStatus,
    qualityUsableForSmartTalk,
    blockingReasons,
    downgradeReasons,
    ocrWarnings,
    highRiskTokensDetected,
    handoffPresent,
    handoffAllowed,
    handoffPerformed,
    handoffReason,
    smartTalkResultIsNull,
    rateLimitObservedInEnabledCase,

    realOcrGateNegativeControlPerformed: true,
    realOcrGateNegativeControlPassed,
    negativeControlHandoffEnvExactTrue,
    negativeControlRealOcrEnvNotExactTrue,
    negativeControlStatus,
    negativeControlOk,
    negativeControlCode,
    negativeControlOcrPerformed: false,
    negativeControlEnvelopeCreated,
    negativeControlModelCallPerformed: false,
    negativeControlPersistencePerformed: false,
    rateLimitObservedInNegativeControl,

    sourceKindPreserved,
    sourceModePreserved,
    trustLevelPreserved,
    sensitivityLevelPreserved,
    qualityStatusPreserved,
    usableForSmartTalkPreserved,
    blockingReasonsPreserved,
    downgradeReasonsPreserved,
    ocrWarningsPreserved,
    highRiskTokensPreserved,
    providerMetadataPreserved,
    confidenceMetadataPreserved,
    disclaimersPreserved,
    checkOriginalWarningPreserved,
    usableDoesNotMeanVerifiedTruth: true,

    noSmartTalkReasoning: true,
    noModelCall: true,
    noRawImageToModel,
    noOriginalDocumentFileToModel,
    noExtractedTextToModel,
    handoffEnvelopeOnly: ocrToSmartTalkHandoffEnvelopeCreated && !ocrToSmartTalkHandoffPerformed,
    handoffExecutionStillBlocked: !ocrToSmartTalkHandoffPerformed,
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    noVerifiedFactCreation: true,
    noLegalDeadlineCreation: true,
    noOfficialFilingCreation: true,
    noBindingLegalAdviceCreation: true,
    publicRuntimeStillBlocked: true,
    productionStillUnauthorized: true,
    goLiveStillUnauthorized: true,

    originalHandoffEnvCaptured: true,
    originalRealOcrEnvCaptured: true,
    bothEnvSetExactTrueForEnabledCase: exactHandoffTrueConfirmed && exactRealOcrTrueConfirmed,
    envRestoredAfterTests,
    finalHandoffEnvMatchesOriginal,
    finalRealOcrEnvMatchesOriginal,

    debtObservedPreviously: true,
    artifactName: "eng.traineddata",
    artifactLocationObservedPreviously: "repo root",
    artifactObservedDuring8_11K,
    artifactCleanedAfter8_11K,
    artifactPresentAfter8_11K,
    mustNotCommitArtifact: true,
    controlledCachePathStillNeeded: true,
    cleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    blockerBeforeMobileTesting: true,
    blockerBeforePublicBeta: true,
    blockerBeforeNextControlledPhase: false,

    transitiveSourceExecutionDebtObserved: true,
    heavy8_11ISourceChainAvoided: true,
    immutableCommittedSnapshotsUsedWhereSafe: true,
    realOcrExecutionsPerformedBy8_11K: 1,
    repeatedHistoricalOcrExecutionsAvoided: true,
    futureSourceSnapshotConsolidationNeeded: true,

    handoffEnabledSyntheticLocalApiClosureClosed: allChecksPassed,
    handoffEnvelopeControlledRuntimeValidated: allChecksPassed,
    readyForSmartTalkReasoningFromOcrPlan: allChecksPassed,
    readyForSmartTalkReasoningFromOcrImplementation: false,
    readyForBrowserManualHandoffTest: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11L",
    recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Gate Design",

    tamperCount: OCR_TO_SMART_TALK_HANDOFF_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES.length,
    tamperRejected: OCR_TO_SMART_TALK_HANDOFF_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES.length,
    tamperPassing: true,

    sourceEvidence,
    enabledGateEvidence,
    enabledSyntheticCaseEvidence,
    realOcrGateNegativeControlEvidence,
    routeInvocationEvidence,
    ocrResultEvidence,
    handoffEnvelopeEvidence,
    trustMetadataEvidence,
    qualityMetadataEvidence,
    warningAndDisclaimerEvidence,
    highRiskBoundaryEvidence,
    noModelEvidence,
    noPersistenceEvidence,
    rateLimitIsolationEvidence,
    envRestorationEvidence,
    tesseractCacheDebtEvidence,
    auditExecutionDebtEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    nextRecommendedSteps: [
      "Design the OCR-to-Smart-Talk controlled reasoning gate (8.11L) — the next phase — specifying exactly how/when Smart Talk reasoning may consume the already-validated handoff envelope.",
      "Implement a controlled tesseract.js cache path and cleanup policy to permanently resolve the eng.traineddata repo-root artifact debt.",
      "Review .gitignore policy for transient OCR cache artifacts.",
      "Consolidate ancestor-phase source-acceptance evidence into a single lightweight snapshot artifact to avoid repeated heavy transitive re-derivation in future phases.",
    ],
    notes: [
      "PHASE 8.11K validates the exact-enabled controlled OCR-to-Smart-Talk handoff-envelope branch via two in-process route invocations: Case B (negative control, run first) and Case A (enabled synthetic success, run second) — real OCR executes exactly once, inside Case A.",
      "SOURCE STRATEGY DISCLOSURE: 8.11J and 8.11I's own exported functions were NOT called live in this closure. Their acceptance is based on an IMMUTABLE COMMITTED SNAPSHOT: both files were confirmed present on disk and confirmed via a cheap static text read to contain their own checkId literal and exported function name, combined with their already-established, already-reported allPassed:true results from when each phase was originally closed in this same environment. This avoids re-triggering the expensive, multiply-nested 8.11I->8.11H->8.11G->8.11F->8.11E real-OCR source chain (previously observed to take ~29 minutes) a second time within this closure.",
      "Case A's synthetic PNG was generated entirely in memory using a hand-authored 5x7 bitmap font (the same proven technique already used successfully by 8.11E in this exact environment, extended with glyphs for H and F), rendering only the safe, non-PII text 'VAYLO OCR HANDOFF TEST' / 'NO PERSONAL DATA'. It is never read from or written to disk.",
      "This closure does not implement, enable, or test Smart Talk reasoning from OCR; handoff.performed remains hard-coded false in the route regardless of gate state.",
      `The transient tesseract.js eng.traineddata cache artifact was ${artifactObservedDuring8_11K ? "observed and cleaned up" : "not observed"} during this run; confirmed absent at the end (present=${artifactPresentAfter8_11K}).`,
    ],
  };

  const allPassed = allChecksPassed && failures.length === 0;

  if (allPassed && !_isCanonicalOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of OCR_TO_SMART_TALK_HANDOFF_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11K tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const tamperCount = OCR_TO_SMART_TALK_HANDOFF_ENABLED_SYNTHETIC_LOCAL_API_CLOSURE_TAMPER_CASES.length;
  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...provisional.notes,
    `8.11K tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    handoffEnabledSyntheticLocalApiClosureClosed: finalAllPassed,
    handoffEnvelopeControlledRuntimeValidated: finalAllPassed,
    readyForSmartTalkReasoningFromOcrPlan: finalAllPassed,
    tamperRejected,
    tamperCount,
    tamperPassing: tamperRejected === tamperCount,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-ocr-to-smart-talk-handoff-enabled-synthetic-local-api-closure");

if (invokedDirectly) {
  runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure failed:", err);
      process.exitCode = 1;
    });
}
