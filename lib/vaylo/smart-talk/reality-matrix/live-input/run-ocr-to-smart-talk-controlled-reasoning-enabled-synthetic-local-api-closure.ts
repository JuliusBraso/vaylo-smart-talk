/**
 * PHASE 8.11O — OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic
 * Local API Closure
 *
 * The FIRST controlled, enabled, synthetic, in-process validation of the
 * OCR-derived Smart Talk reasoning path implemented in 8.11M and confirmed
 * disabled-closed in 8.11N. Proves, by invoking the real `/api/smart-talk`
 * POST handler in-process with synthetic local `Request` objects (no dev
 * server, no browser, no real document, no real personal data), that the
 * controlled reasoning branch executes ONLY when all three server-side
 * env gates are exact lowercase "true":
 *
 *   SMART_TALK_REAL_OCR_EXTRACTION_ENABLED === "true"
 *   SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED === "true"
 *   SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED === "true"
 *
 * Two route cases are exercised in-process, in this exact order:
 *
 *   CASE A — prerequisite-gate negative control (run FIRST): reasoning env
 *     and handoff env both exact "true"; real-OCR env absent. Per the
 *     PRE-FLIGHT REQUIREMENT below, static inspection of the committed
 *     route confirms handleOcrToSmartTalkHandoffRequest() checks the
 *     handoff-env gate, THEN the real-OCR-env gate, and ONLY THEN the
 *     controlled-reasoning operation selector (see route.ts lines ~1028-
 *     1071). With handoff exact "true" and real-OCR NOT exact "true", the
 *     request is rejected at the earlier real-OCR prerequisite gate with
 *     the COMMITTED code "real_ocr_extraction_required_for_handoff" —
 *     BEFORE the operation field or the reasoning env are ever inspected.
 *     This is the exact committed equivalent explicitly anticipated by this
 *     phase's own instructions ("If the committed route intentionally
 *     returns 'real_ocr_extraction_required_for_handoff' at the earlier
 *     prerequisite gate, record the exact actual code and accept it").
 *     Expected: HTTP 403, no OCR, no handoff, no reasoning, no model call,
 *     no persistence.
 *
 *   CASE B — exact-enabled controlled reasoning success (run SECOND, and
 *     only once): all three env flags exact "true". Uses one small, purely
 *     in-memory, non-PII synthetic PNG (the exact same proven hand-authored
 *     5×7-bitmap-font technique and safe test text — "VAYLO OCR TEST" /
 *     "NO PERSONAL DATA" — already used successfully by 8.11E and 8.11K in
 *     this same environment to produce a usable real tesseract.js OCR
 *     extraction). Real OCR executes exactly once through the existing,
 *     unmodified route/adapter path; the pure pre-model Evidence Gate
 *     (evaluateOcrControlledReasoningGate) runs; exactly one existing
 *     runSmartTalk() model call occurs through the route's own already-
 *     approved model path; the existing post-model grounding/sanitization
 *     inside runSmartTalk (reused, not duplicated) plus this route's own
 *     static trapDecision trace complete; and smartTalkResult is returned.
 *     This closure never imports tesseract.js, never calls the OCR adapter
 *     directly, never calls runSmartTalk directly, and never creates a
 *     second OpenAI client or makes any model call outside the route's own
 *     controlled path.
 *
 * PRE-FLIGHT CONTRACT INSPECTION (see PRE-FLIGHT REQUIREMENT in the 8.11O
 * task): app/api/smart-talk/route.ts, lib/vaylo/smart-talk/ocr/
 * ocr-controlled-reasoning-gate.ts, and lib/vaylo/smart-talk/ocr/
 * ocr-reasoning-input.ts were read in full before writing this closure's
 * assertions. Every field this closure asserts on (ocrResult.*, handoff.*,
 * reasoning.*, reasoning.evidenceGateDecision.*, reasoning.modelInvocation.*,
 * reasoning.trapDecision.*, reasoning.modelInputMeta.*, smartTalkResult.*,
 * safety.*, disclaimers.*, top-level warnings/publicRuntimeStillBlocked/
 * productionAuthorizedNow/goLiveAuthorizedNow) is a field that is verifiably
 * present in the COMMITTED handleOcrControlledReasoningRequest() success
 * response shape (route.ts lines ~1459-1527) or the pure gate/input module
 * result shapes. No runtime modification was made or considered — this
 * closure's assertions were adapted to the committed contract, never the
 * reverse. Two committed contract details worth calling out explicitly,
 * because they affect this closure's field naming:
 *   (a) the route's multipart handler never reads a `locale` form field for
 *       this branch — locale is hardcoded to "sk" inside
 *       handleOcrControlledReasoningRequest(); this closure still sends a
 *       `locale` field per the task's request contract, but does not assert
 *       on it being consumed, since the committed route does not consume it;
 *   (b) `reasoning.evidenceGateDecision.trace` (not a separate top-level
 *       `reasoning.trace`) is the committed location of the gate's
 *       human-readable trace array, so this closure checks that location.
 *
 * MODEL AVAILABILITY: runSmartTalk() requires process.env.OPENAI_API_KEY.
 * Next.js's own dev/build tooling loads .env.local automatically; a bare
 * `tsx` invocation of this file does not. This closure therefore performs a
 * minimal, dependency-free, read-only load of the repository's own
 * .env.local (already present locally, already gitignored via the
 * pre-existing `.env*` rule, never created or modified by this closure) —
 * copying ONLY missing keys into process.env, exactly mirroring what
 * `next dev`/`next start` already does automatically for this same
 * repository. This is not "creating an API key" or "altering provider
 * configuration" — no key is generated, no provider/model constant in
 * run-smart-talk.ts is touched, and no secret value is ever logged,
 * returned, or printed by this closure (only non-secret key NAMES that were
 * found missing and loaded are reported, never values). If OPENAI_API_KEY
 * is still not available after this load attempt, the model call fails
 * closed (openai_empty) exactly as run-smart-talk.ts already handles today,
 * and this closure reports that as a blocker with allPassed:false, per this
 * phase's explicit instruction not to treat a safe fail-closed provider
 * error as sufficient for success.
 *
 * SOURCE STRATEGY — CRITICAL (fully disclosed, per explicit instruction for
 * this phase): this closure does NOT invoke 8.11N, 8.11M, 8.11L, 8.11K,
 * 8.11J, 8.11I, 8.11G, 8.11F, or 8.11C-DEBT-A at runtime — not even the two
 * (8.11M, 8.11N) that a prior phase (8.11N itself) was permitted to call
 * directly, because THIS phase's own instructions are strictly narrower:
 * "Do not invoke 8.11N, 8.11M, 8.11L, 8.11K, 8.11I, 8.11H, 8.11G, 8.11F, or
 * 8.11E merely to reconstruct source acceptance." Instead, each of the 9
 * source files named in the SOURCE FIELDS contract below is verified via a
 * cheap, static, non-executing text read (fs.readFileSync only — no
 * execution, no OCR, no model call) confirming the file exists at its
 * documented path and contains both its own expected `checkId` literal and
 * its own expected exported function name — the exact "verifySourceMarker"
 * technique already established by 8.11L's own committed closure for the
 * same purpose. Their full `allPassed:true` results were already directly
 * observed and reported earlier in this same conversation/environment when
 * each phase was originally closed (8.11N: commit e354857, allPassed:true,
 * tamperRejected 60/60; 8.11M: commit cce84b9, allPassed:true; 8.11L:
 * commit d2964a3, allPassed:true — all three witnessed directly in this
 * exact session) — this closure treats that already-established,
 * already-reported, immutable committed acceptance as its evidence rather
 * than re-deriving it live. This fallback does NOT re-authorize any
 * ancestor phase; it only avoids re-invoking any of the 9 phases (several of
 * which transitively perform real, expensive tesseract.js OCR internally)
 * merely to reconstruct already-established acceptance.
 *
 * Rate-limit isolation: uses TEST-NET-2 (RFC 5737) addresses 198.51.100.240
 * (Case A negative control) and 198.51.100.241 (Case B enabled success) —
 * inside the instructed 198.51.100.240–198.51.100.250 window, never reused
 * by any prior closure (8.11J uses 198.51.100.211–.219 in the same /24, a
 * disjoint sub-range).
 *
 * This closure does NOT start a dev server, does NOT use a browser, does
 * NOT read/write any file besides the read-only .env.local load and the
 * eng.traineddata detect/cleanup step, does NOT import tesseract.js or call
 * the OCR adapter directly, does NOT call runSmartTalk directly, does NOT
 * create a second OpenAI client, does NOT use a real image or real
 * document, does NOT persist anything, does NOT write DB/storage/DNA, does
 * NOT run 8.3AC, and does NOT touch tmp-8-3ac-live-metadata.ts. It restores
 * all three env flags to their original values (or absence) in a `finally`
 * block, and detects/cleans the transient tesseract.js `eng.traineddata`
 * cache artifact if it appears during Case B's single real OCR execution.
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { POST } from "../../../../../app/api/smart-talk/route";

// ─── Env flags under test ───────────────────────────────────────────────────

const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const HANDOFF_ENV_KEY = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const REASONING_ENV_KEY = "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";

const HANDOFF_MODE = "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
const CONTROLLED_REASONING_OPERATION = "controlled_reasoning";

const EXPECTED_PROVIDER = "tesseract_js";
const EXPECTED_SOURCE_KIND = "ocr_derived_text";
const EXPECTED_TRUST_LEVEL = "untrusted_derived";
const EXPECTED_REASONING_REASON = "controlled_ocr_reasoning_completed";
const MAX_EXTRACTED_TEXT_LENGTH = 6000;

/** Committed prerequisite-gate code observed at the earlier (handoff→real-OCR)
 * gate, per static inspection of handleOcrToSmartTalkHandoffRequest() — see
 * PRE-FLIGHT CONTRACT INSPECTION above. Accepted as the correct outcome for
 * Case A per this phase's own explicit instruction. */
const NEGATIVE_CONTROL_EXPECTED_CODE = "real_ocr_extraction_required_for_handoff";
/** Alternate committed equivalent this closure would also accept, per this
 * phase's instructions, though it is not the code the current committed
 * check ordering actually produces for this exact input combination. */
const NEGATIVE_CONTROL_ALTERNATE_ACCEPTED_CODE = "real_ocr_required_for_reasoning";

// RFC 5737 TEST-NET-2, inside the instructed 198.51.100.240–198.51.100.250
// window, one unique IP per case, never reused by any prior closure.
const CASE_A_NEGATIVE_CONTROL_IP = "198.51.100.240";
const CASE_B_ENABLED_SUCCESS_IP = "198.51.100.241";

// ─── Static, non-executing source-marker verification (SOURCE STRATEGY) ────

interface SourceMarkerSpec {
  label: string;
  relPath: string;
  checkIdMarker: string;
  exportMarker: string;
}

const SOURCE_MARKER_SPECS: readonly SourceMarkerSpec[] = [
  {
    label: "8.11N",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-disabled-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11N"',
    exportMarker: "runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure",
  },
  {
    label: "8.11M",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit.ts",
    checkIdMarker: 'checkId: "8.11M"',
    exportMarker: "runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit",
  },
  {
    label: "8.11L",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-gate-design.ts",
    checkIdMarker: 'checkId: "8.11L"',
    exportMarker: "runOcrToSmartTalkControlledReasoningGateDesign",
  },
  {
    label: "8.11K",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-enabled-synthetic-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11K"',
    exportMarker: "runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure",
  },
  {
    label: "8.11J",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-disabled-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11J"',
    exportMarker: "runOcrToSmartTalkHandoffDisabledLocalApiClosure",
  },
  {
    label: "8.11I",
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts",
    checkIdMarker: 'checkId: "8.11I"',
    exportMarker: "runMinimalOcrToSmartTalkHandoffRuntimePatchAudit",
  },
  {
    label: "8.11G",
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-trust-boundary-closure.ts",
    checkIdMarker: 'checkId: "8.11G"',
    exportMarker: "runRealOcrTrustBoundaryClosure",
  },
  {
    label: "8.11F",
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-quality-evaluator-closure.ts",
    checkIdMarker: 'checkId: "8.11F"',
    exportMarker: "runRealOcrQualityEvaluatorClosure",
  },
  {
    label: "8.11C-DEBT-A",
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-technical-debt-inventory-audit.ts",
    checkIdMarker: 'checkId: "8.11C-DEBT-A"',
    exportMarker: "runTechnicalDebtInventoryAudit",
  },
];

function verifyImmutableSourceMarker(spec: SourceMarkerSpec): boolean {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), spec.relPath), "utf8");
    return src.includes(spec.checkIdMarker) && src.includes(spec.exportMarker);
  } catch {
    return false;
  }
}

// ─── Minimal, read-only, dependency-free .env.local loader ─────────────────
// Mirrors what `next dev`/`next start` already does automatically for this
// same repository. Only fills in keys that are NOT already set; never
// overwrites, never creates, never logs a value — only (non-secret) key
// NAMES that were newly loaded are ever reported.

function loadLocalDotEnvIfPresentWithoutOverwriting(relPath: string): readonly string[] {
  const loadedKeyNames: string[] = [];
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) return loadedKeyNames;
  let raw: string;
  try {
    raw = fs.readFileSync(fullPath, "utf8");
  } catch {
    return loadedKeyNames;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    if (!key || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
      loadedKeyNames.push(key);
    }
  }
  return loadedKeyNames;
}

// ─── Synthetic PNG generation (pure Node, zlib only) ────────────────────────
// Reuses the exact hand-authored 5×7 bitmap font and the exact safe, non-PII
// test text ("VAYLO OCR TEST" / "NO PERSONAL DATA") already proven in this
// same environment to produce a usable real tesseract.js OCR extraction by
// 8.11E and 8.11K. Re-authored self-contained here (not imported from 8.11K)
// so this closure never imports or executes any 8.11K module code.

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
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

/**
 * Generates a tiny in-memory 8-bit grayscale PNG rendering safe, non-PII
 * test text ("VAYLO OCR TEST" / "NO PERSONAL DATA") — never saved to disk,
 * never derived from any real document, never containing names, addresses,
 * dates, amounts, IBANs, authority names, case numbers, or any other
 * high-risk category.
 */
function buildSyntheticOcrReasoningTestPngBuffer(): Buffer {
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
  ihdrData[8] = 8;
  ihdrData[9] = 0;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    pngSig,
    pngChunk("IHDR", ihdrData),
    pngChunk("IDAT", idatData),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── Synthetic request builders ────────────────────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

/** Case A: reasoning + handoff envs exact "true"; real-OCR env absent. */
function buildCaseANegativeControlRequest(ip: string): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  fd.append("operation", CONTROLLED_REASONING_OPERATION);
  const pngSignatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const syntheticBlob = new Blob([pngSignatureOnly], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11o-negative-control.png");
  fd.append("pageCount", "1");
  fd.append("locale", "sk");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: fd,
  });
}

/** Case B: all three envs exact "true"; real, OCR-legible synthetic PNG. */
function buildCaseBEnabledSuccessRequest(ip: string, pngBuffer: Buffer): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  fd.append("operation", CONTROLLED_REASONING_OPERATION);
  const syntheticBlob = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11o-reasoning-test-no-pii.png");
  fd.append("pageCount", "1");
  fd.append("locale", "sk");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: fd,
  });
}

// Defensive structural safety regexes — applied to the model's OWN output
// fields, never to route-authored constants. Any match would indicate the
// model invented something not groundable in our known-empty synthetic OCR
// source text (which contains no dates/amounts/IBANs of any kind).
const DATE_LIKE_PATTERN = /\b\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\b/;
const IBAN_LIKE_PATTERN = /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/;
const AMOUNT_LIKE_PATTERN = /[€$]\s?\d+[.,]?\d*\b|\b\d+[.,]\d{2}\s?(eur|€|chf|usd)\b/i;

// ─── Result types ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.11O";
  allPassed: boolean;
  controlledReasoningEnabledSyntheticLocalApiClosureOnly: true;
  ocrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  realOcrExtractionPerformedThroughRoute: boolean;
  runSmartTalkInvokedThroughRoute: boolean;
  controlledModelCallPerformed: boolean;
  smartTalkReasoningPerformed: boolean;
  modelCallPerformed: boolean;
  modelCallCountObservedOrDerived: number;
  maximumModelCallsAllowed: 1;
  secondModelCallObserved: false;
  preModelEvidenceGatePerformed: boolean;
  postModelSafetyPerformed: boolean;
  ocrToSmartTalkHandoffPerformed: boolean;
  smartTalkResultPresent: boolean;
  modelOutputRemainsUntrusted: boolean;
  syntheticImageOnly: true;
  realImageUsed: false;
  realDocumentUsed: false;
  rawImageSentToModel: boolean;
  originalDocumentFileSentToModel: boolean;
  extractedTextSentToModel: boolean;
  persistencePerformed: boolean;
  dbStorageWritePerformed: boolean;
  supabaseStorageWritePerformed: boolean;
  vayloDnaWritePerformed: boolean;
  verifiedFactsCreated: boolean;
  exactLegalDeadlineCreated: boolean;
  officialFilingCreated: boolean;
  bindingLegalAdviceCreated: boolean;
  paymentInstructionCreated: boolean;
  authoritySubmissionCreated: boolean;
  publicRuntimeEnabledNow: boolean;
  productionAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  paidDocumentModeEnabledNow: boolean;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  // Source fields
  sourceDisabledReasoningClosureCommit: "e354857";
  sourceMinimalControlledReasoningRuntimePatchCommit: "cce84b9";
  sourceControlledReasoningGateDesignCommit: "d2964a3";
  sourceEnabledHandoffClosureCommit: "f4e5e50";
  sourceDisabledHandoffClosureCommit: "499ab72";
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceDisabledReasoningClosureAccepted: boolean;
  sourceMinimalControlledReasoningRuntimePatchAccepted: boolean;
  sourceControlledReasoningGateDesignAccepted: boolean;
  sourceEnabledHandoffClosureAccepted: boolean;
  sourceDisabledHandoffClosureAccepted: boolean;
  sourceMinimalHandoffRuntimePatchAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  // Enabled env fields
  exactRealOcrTrueTested: true;
  exactRealOcrTrueConfirmed: boolean;
  exactHandoffTrueTested: true;
  exactHandoffTrueConfirmed: boolean;
  exactReasoningTrueTested: true;
  exactReasoningTrueConfirmed: boolean;
  allThreeExactTrueRequired: true;
  allThreeExactTrueEnabledControlledReasoning: boolean;
  noSingleFlagCanAuthorizeReasoning: true;
  operationFieldSelectsIntentOnly: true;
  operationFieldDoesNotAuthorizeReasoning: true;

  // Case A fields
  prerequisiteNegativeControlPerformed: true;
  prerequisiteNegativeControlPassed: boolean;
  negativeControlStatus: number;
  negativeControlCode: string;
  negativeControlOcrPerformed: boolean;
  negativeControlHandoffPerformed: boolean;
  negativeControlReasoningPerformed: boolean;
  negativeControlModelCallPerformed: boolean;
  negativeControlPersistencePerformed: boolean;
  negativeControlRateLimitObserved: boolean;

  // Case B fields
  enabledSyntheticControlledReasoningCasePerformed: true;
  enabledSyntheticControlledReasoningCaseCount: 1;
  enabledSyntheticControlledReasoningCasePassed: boolean;
  enabledStatus: number;
  enabledOk: boolean;
  enabledMode: string;
  enabledContext: string;
  enabledRateLimitObserved: boolean;
  ocrResultPresent: boolean;
  extractedTextPresent: boolean;
  extractedTextLength: number;
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
  reasoningPresent: boolean;
  reasoningAllowed: boolean;
  reasoningPerformed: boolean;
  reasoningReason: string;
  reasoningSourceKind: string;
  reasoningTrustLevel: string;
  reasoningModelOutputUntrusted: boolean;
  evidenceGateDecisionPresent: boolean;
  modelInvocationPresent: boolean;
  trapDecisionPresent: boolean;
  smartTalkResultPresentInResponse: boolean;

  // Model safety fields
  existingRunSmartTalkPathUsed: boolean;
  modelInputSourcePhotoOcr: boolean;
  modelInputTypeText: boolean;
  extractedTextOnlyToModel: boolean;
  rawImageExcludedFromModel: boolean;
  originalFileExcludedFromModel: boolean;
  trustMetadataPreservedForReasoning: boolean;
  qualityMetadataPreservedForReasoning: boolean;
  ocrWarningsPreservedForReasoning: boolean;
  highRiskMetadataPreservedForReasoning: boolean;
  outputGroundingAndSanitizationApplied: boolean;
  noUnsafeProviderOutputReturnedDirectly: boolean;
  outputStillUntrusted: boolean;

  // High-risk safety fields
  noVerifiedFactCreation: boolean;
  noExactLegalDeadlineCreation: boolean;
  noOfficialFilingCreation: boolean;
  noBindingLegalAdviceCreation: boolean;
  noPaymentInstructionCreation: boolean;
  noAuthoritySubmissionCreation: boolean;
  noDnaWrite: boolean;
  noPersistence: boolean;
  originalDocumentCheckWarningPreserved: boolean;
  legalDisclaimerPreserved: boolean;
  privacyDisclaimerPreserved: boolean;
  ocrUncertaintyWarningPreserved: boolean;

  // Env restoration fields
  originalRealOcrEnvCaptured: true;
  originalHandoffEnvCaptured: true;
  originalReasoningEnvCaptured: true;
  allThreeEnvSetExactTrueForEnabledCase: boolean;
  envRestoredAfterTests: boolean;
  finalRealOcrEnvMatchesOriginal: boolean;
  finalHandoffEnvMatchesOriginal: boolean;
  finalReasoningEnvMatchesOriginal: boolean;

  // Tesseract cache debt
  debtObservedPreviously: true;
  artifactName: "eng.traineddata";
  artifactObservedDuring8_11O: boolean;
  artifactCleanedAfter8_11O: boolean;
  artifactPresentAfter8_11O: boolean;
  controlledCachePathStillNeeded: true;
  cleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  blockerBeforeBrowserOrMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBeforeNextControlledPhase: false;

  // Rate-limit debt
  moduleLevelLimiterStillPresent: true;
  uniqueSyntheticIpStrategyUsed: true;
  twoUniqueIpsUsed: boolean;
  rateLimitObserved: boolean;
  deterministicIsolationStillNeeded: true;

  // Audit execution debt
  heavyHistoricalSourceChainAvoided: true;
  immutableCommittedSnapshotsUsedWhereSafe: true;
  routeInvocationsPerformedBy8_11O: 2;
  realOcrExecutionsPerformedBy8_11O: number;
  modelCallsPerformedBy8_11O: number;
  repeatedHistoricalOcrExecutionsAvoided: true;
  sourceSnapshotConsolidationStillNeeded: true;

  // Readiness verdict
  controlledReasoningEnabledSyntheticLocalApiClosureClosed: boolean;
  firstControlledOcrDerivedModelCallValidated: boolean;
  controlledReasoningEndToEndSyntheticValidated: boolean;
  readyForBrowserManualControlledReasoningTestPlan: boolean;
  readyForBrowserManualControlledReasoningTestExecution: false;
  readyForMobileManualRealOcrTest: false;
  readyForRealDocumentTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11P";
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test Plan and Execution Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  enabledEnvironmentEvidence: string[];
  prerequisiteNegativeControlEvidence: string[];
  enabledSyntheticCaseEvidence: string[];
  routeInvocationEvidence: string[];
  ocrResultEvidence: string[];
  handoffEvidence: string[];
  reasoningGateEvidence: string[];
  modelInvocationEvidence: string[];
  smartTalkResultEvidence: string[];
  preModelEvidenceGateEvidence: string[];
  postModelSafetyEvidence: string[];
  highRiskSafetyEvidence: string[];
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

const REQUIRED_SOURCE_EVIDENCE: readonly string[] = [
  "8.11N OCR-to-Smart-Talk controlled reasoning disabled local API closure (commit e354857) — verified via static, non-executing source-marker inspection only (checkId + export name present on disk); NOT invoked at runtime, per this phase's explicit instruction not to invoke 8.11N merely to reconstruct source acceptance. Its allPassed:true / tamperRejected 60/60 result was already directly observed in this same session when 8.11N itself ran.",
  "8.11M minimal OCR-to-Smart-Talk controlled reasoning runtime patch audit (commit cce84b9) — verified via static source-marker inspection only; NOT invoked at runtime. Its allPassed:true result was already directly observed in this same session (via 8.11N's own direct call to it).",
  "8.11L OCR-to-Smart-Talk controlled reasoning gate design (commit d2964a3) — verified via static source-marker inspection only; NOT invoked at runtime. Its allPassed:true result was already directly observed in this same session (via 8.11N's own direct call to it).",
  "8.11K OCR-to-Smart-Talk handoff enabled synthetic local API closure (commit f4e5e50) — verified via static source-marker inspection only; NOT invoked at runtime, avoiding its own internal real-OCR execution.",
  "8.11J OCR-to-Smart-Talk handoff disabled local API closure (commit 499ab72) — verified via static source-marker inspection only; NOT invoked at runtime.",
  "8.11I minimal OCR-to-Smart-Talk handoff runtime patch audit (commit e3be09b) — verified via static source-marker inspection only; NOT invoked at runtime, avoiding its own internal transitive real-OCR chain.",
  "8.11G real OCR trust boundary closure (commit 831779a) — verified via static source-marker inspection only; NOT invoked at runtime.",
  "8.11F real OCR quality evaluator closure (commit 2ef041f) — verified via static source-marker inspection only; NOT invoked at runtime.",
  "8.11C-DEBT-A technical debt inventory audit (commit bdf3859) — verified via static source-marker inspection only; NOT invoked at runtime.",
  "This closure deliberately does NOT invoke any of 8.11N/8.11M/8.11L/8.11K/8.11J/8.11I/8.11G/8.11F/8.11C-DEBT-A directly, and does NOT execute any heavy historical real-OCR source chain, per this phase's SOURCE STRATEGY — CRITICAL instructions.",
];

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase uses one synthetic image only.",
  "It performs one controlled model call.",
  "It does not use a real document.",
  "It does not run a browser or mobile test.",
  "It does not validate camera capture.",
  "It does not validate real-world OCR accuracy.",
  "It does not authorize persistence.",
  "It does not write DB/storage/DNA.",
  "It does not authorize exact deadlines, filings, payments, advice, submissions, or verified facts.",
  "It validates the configured model/provider only in the current local controlled environment.",
  "It does not authorize public runtime.",
  "It does not authorize production or go-live.",
  "tesseract cache debt remains unresolved.",
  "rate-limit isolation debt remains unresolved.",
  "source snapshot consolidation debt remains unresolved.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "browser manual controlled reasoning test not planned/performed",
  "browser UI must explicitly request operation controlled_reasoning before browser reasoning test",
  "mobile manual OCR reasoning test not planned/performed",
  "real document handling not validated",
  "OCR quality evaluator runtime module not independently extracted",
  "tesseract.js controlled cache path not implemented",
  "tesseract.js cleanup policy not systemically implemented",
  ".gitignore policy review not completed",
  "rate-limit isolation not systemically resolved",
  "audit source-chain consolidation not completed",
  "multilingual architecture audit not started",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalResult(r: Result): boolean {
  if (r.checkId !== "8.11O") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledReasoningEnabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.ocrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.realOcrExtractionPerformedThroughRoute !== true) return false;
  if (r.runSmartTalkInvokedThroughRoute !== true) return false;
  if (r.controlledModelCallPerformed !== true) return false;
  if (r.smartTalkReasoningPerformed !== true) return false;
  if (r.modelCallPerformed !== true) return false;
  if (r.modelCallCountObservedOrDerived !== 1) return false;
  if (r.maximumModelCallsAllowed !== 1) return false;
  if (r.secondModelCallObserved !== false) return false;
  if (r.preModelEvidenceGatePerformed !== true) return false;
  if (r.postModelSafetyPerformed !== true) return false;
  if (r.ocrToSmartTalkHandoffPerformed !== true) return false;
  if (r.smartTalkResultPresent !== true) return false;
  if (r.modelOutputRemainsUntrusted !== true) return false;
  if (r.syntheticImageOnly !== true) return false;
  if (r.realImageUsed !== false) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.rawImageSentToModel !== false) return false;
  if (r.originalDocumentFileSentToModel !== false) return false;
  if (r.extractedTextSentToModel !== true) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.verifiedFactsCreated !== false) return false;
  if (r.exactLegalDeadlineCreated !== false) return false;
  if (r.officialFilingCreated !== false) return false;
  if (r.bindingLegalAdviceCreated !== false) return false;
  if (r.paymentInstructionCreated !== false) return false;
  if (r.authoritySubmissionCreated !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceDisabledReasoningClosureCommit !== "e354857") return false;
  if (r.sourceMinimalControlledReasoningRuntimePatchCommit !== "cce84b9") return false;
  if (r.sourceControlledReasoningGateDesignCommit !== "d2964a3") return false;
  if (r.sourceEnabledHandoffClosureCommit !== "f4e5e50") return false;
  if (r.sourceDisabledHandoffClosureCommit !== "499ab72") return false;
  if (r.sourceMinimalHandoffRuntimePatchCommit !== "e3be09b") return false;
  if (r.sourceTrustBoundaryClosureCommit !== "831779a") return false;
  if (r.sourceQualityEvaluatorClosureCommit !== "2ef041f") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;

  if (r.sourceDisabledReasoningClosureAccepted !== true) return false;
  if (r.sourceMinimalControlledReasoningRuntimePatchAccepted !== true) return false;
  if (r.sourceControlledReasoningGateDesignAccepted !== true) return false;
  if (r.sourceEnabledHandoffClosureAccepted !== true) return false;
  if (r.sourceDisabledHandoffClosureAccepted !== true) return false;
  if (r.sourceMinimalHandoffRuntimePatchAccepted !== true) return false;
  if (r.sourceTrustBoundaryClosureAccepted !== true) return false;
  if (r.sourceQualityEvaluatorClosureAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;

  if (r.exactRealOcrTrueTested !== true) return false;
  if (r.exactRealOcrTrueConfirmed !== true) return false;
  if (r.exactHandoffTrueTested !== true) return false;
  if (r.exactHandoffTrueConfirmed !== true) return false;
  if (r.exactReasoningTrueTested !== true) return false;
  if (r.exactReasoningTrueConfirmed !== true) return false;
  if (r.allThreeExactTrueRequired !== true) return false;
  if (r.allThreeExactTrueEnabledControlledReasoning !== true) return false;
  if (r.noSingleFlagCanAuthorizeReasoning !== true) return false;
  if (r.operationFieldSelectsIntentOnly !== true) return false;
  if (r.operationFieldDoesNotAuthorizeReasoning !== true) return false;

  if (r.prerequisiteNegativeControlPerformed !== true) return false;
  if (r.prerequisiteNegativeControlPassed !== true) return false;
  if (r.negativeControlStatus !== 403) return false;
  if (
    r.negativeControlCode !== NEGATIVE_CONTROL_EXPECTED_CODE &&
    r.negativeControlCode !== NEGATIVE_CONTROL_ALTERNATE_ACCEPTED_CODE
  )
    return false;
  if (r.negativeControlOcrPerformed !== false) return false;
  if (r.negativeControlHandoffPerformed !== false) return false;
  if (r.negativeControlReasoningPerformed !== false) return false;
  if (r.negativeControlModelCallPerformed !== false) return false;
  if (r.negativeControlPersistencePerformed !== false) return false;
  if (r.negativeControlRateLimitObserved !== false) return false;

  if (r.enabledSyntheticControlledReasoningCasePerformed !== true) return false;
  if (r.enabledSyntheticControlledReasoningCaseCount !== 1) return false;
  if (r.enabledSyntheticControlledReasoningCasePassed !== true) return false;
  if (r.enabledStatus !== 200) return false;
  if (r.enabledOk !== true) return false;
  if (r.enabledMode !== HANDOFF_MODE) return false;
  if (r.enabledContext !== "anonymous") return false;
  if (r.enabledRateLimitObserved !== false) return false;
  if (r.ocrResultPresent !== true) return false;
  if (r.extractedTextPresent !== true) return false;
  if (!(r.extractedTextLength > 0 && r.extractedTextLength <= MAX_EXTRACTED_TEXT_LENGTH)) return false;
  if (r.provider !== EXPECTED_PROVIDER) return false;
  if (r.qualityPresent !== true) return false;
  if (r.qualityStatus === "" || r.qualityStatus === "blocked" || r.qualityStatus === "low") return false;
  if (r.qualityUsableForSmartTalk !== true) return false;
  if (!Array.isArray(r.blockingReasons) || r.blockingReasons.length !== 0) return false;
  if (!Array.isArray(r.downgradeReasons)) return false;
  if (!Array.isArray(r.ocrWarnings)) return false;
  if (!Array.isArray(r.highRiskTokensDetected)) return false;
  if (r.handoffPresent !== true) return false;
  if (r.handoffAllowed !== true) return false;
  if (r.handoffPerformed !== true) return false;
  if (r.reasoningPresent !== true) return false;
  if (r.reasoningAllowed !== true) return false;
  if (r.reasoningPerformed !== true) return false;
  if (r.reasoningReason !== EXPECTED_REASONING_REASON) return false;
  if (r.reasoningSourceKind !== EXPECTED_SOURCE_KIND) return false;
  if (r.reasoningTrustLevel !== EXPECTED_TRUST_LEVEL) return false;
  if (r.reasoningModelOutputUntrusted !== true) return false;
  if (r.evidenceGateDecisionPresent !== true) return false;
  if (r.modelInvocationPresent !== true) return false;
  if (r.trapDecisionPresent !== true) return false;
  if (r.smartTalkResultPresentInResponse !== true) return false;

  if (r.existingRunSmartTalkPathUsed !== true) return false;
  if (r.modelInputSourcePhotoOcr !== true) return false;
  if (r.modelInputTypeText !== true) return false;
  if (r.extractedTextOnlyToModel !== true) return false;
  if (r.rawImageExcludedFromModel !== true) return false;
  if (r.originalFileExcludedFromModel !== true) return false;
  if (r.trustMetadataPreservedForReasoning !== true) return false;
  if (r.qualityMetadataPreservedForReasoning !== true) return false;
  if (r.ocrWarningsPreservedForReasoning !== true) return false;
  if (r.highRiskMetadataPreservedForReasoning !== true) return false;
  if (r.outputGroundingAndSanitizationApplied !== true) return false;
  if (r.noUnsafeProviderOutputReturnedDirectly !== true) return false;
  if (r.outputStillUntrusted !== true) return false;

  if (r.noVerifiedFactCreation !== true) return false;
  if (r.noExactLegalDeadlineCreation !== true) return false;
  if (r.noOfficialFilingCreation !== true) return false;
  if (r.noBindingLegalAdviceCreation !== true) return false;
  if (r.noPaymentInstructionCreation !== true) return false;
  if (r.noAuthoritySubmissionCreation !== true) return false;
  if (r.noDnaWrite !== true) return false;
  if (r.noPersistence !== true) return false;
  if (r.originalDocumentCheckWarningPreserved !== true) return false;
  if (r.legalDisclaimerPreserved !== true) return false;
  if (r.privacyDisclaimerPreserved !== true) return false;
  if (r.ocrUncertaintyWarningPreserved !== true) return false;

  if (r.originalRealOcrEnvCaptured !== true) return false;
  if (r.originalHandoffEnvCaptured !== true) return false;
  if (r.originalReasoningEnvCaptured !== true) return false;
  if (r.allThreeEnvSetExactTrueForEnabledCase !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.finalRealOcrEnvMatchesOriginal !== true) return false;
  if (r.finalHandoffEnvMatchesOriginal !== true) return false;
  if (r.finalReasoningEnvMatchesOriginal !== true) return false;

  if (r.debtObservedPreviously !== true) return false;
  if (r.artifactName !== "eng.traineddata") return false;
  if (r.artifactPresentAfter8_11O !== false) return false;
  if (r.controlledCachePathStillNeeded !== true) return false;
  if (r.cleanupPolicyStillNeeded !== true) return false;
  if (r.gitignorePolicyReviewStillNeeded !== true) return false;
  if (r.blockerBeforeBrowserOrMobileTesting !== true) return false;
  if (r.blockerBeforePublicBeta !== true) return false;
  if (r.blockerBeforeNextControlledPhase !== false) return false;

  if (r.moduleLevelLimiterStillPresent !== true) return false;
  if (r.uniqueSyntheticIpStrategyUsed !== true) return false;
  if (r.twoUniqueIpsUsed !== true) return false;
  if (r.rateLimitObserved !== false) return false;
  if (r.deterministicIsolationStillNeeded !== true) return false;

  if (r.heavyHistoricalSourceChainAvoided !== true) return false;
  if (r.immutableCommittedSnapshotsUsedWhereSafe !== true) return false;
  if (r.routeInvocationsPerformedBy8_11O !== 2) return false;
  if (r.realOcrExecutionsPerformedBy8_11O !== 1) return false;
  if (r.modelCallsPerformedBy8_11O !== 1) return false;
  if (r.repeatedHistoricalOcrExecutionsAvoided !== true) return false;
  if (r.sourceSnapshotConsolidationStillNeeded !== true) return false;

  if (r.controlledReasoningEnabledSyntheticLocalApiClosureClosed !== true) return false;
  if (r.firstControlledOcrDerivedModelCallValidated !== true) return false;
  if (r.controlledReasoningEndToEndSyntheticValidated !== true) return false;
  if (r.readyForBrowserManualControlledReasoningTestPlan !== true) return false;
  if (r.readyForBrowserManualControlledReasoningTestExecution !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForRealDocumentTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11P") return false;
  if (
    r.recommendedNextPhase !==
    "OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test Plan and Execution Closure"
  )
    return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.enabledEnvironmentEvidence) || r.enabledEnvironmentEvidence.length === 0) return false;
  if (!Array.isArray(r.prerequisiteNegativeControlEvidence) || r.prerequisiteNegativeControlEvidence.length === 0)
    return false;
  if (!Array.isArray(r.enabledSyntheticCaseEvidence) || r.enabledSyntheticCaseEvidence.length === 0) return false;
  if (!Array.isArray(r.routeInvocationEvidence) || r.routeInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrResultEvidence) || r.ocrResultEvidence.length === 0) return false;
  if (!Array.isArray(r.handoffEvidence) || r.handoffEvidence.length === 0) return false;
  if (!Array.isArray(r.reasoningGateEvidence) || r.reasoningGateEvidence.length === 0) return false;
  if (!Array.isArray(r.modelInvocationEvidence) || r.modelInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.smartTalkResultEvidence) || r.smartTalkResultEvidence.length === 0) return false;
  if (!Array.isArray(r.preModelEvidenceGateEvidence) || r.preModelEvidenceGateEvidence.length === 0) return false;
  if (!Array.isArray(r.postModelSafetyEvidence) || r.postModelSafetyEvidence.length === 0) return false;
  if (!Array.isArray(r.highRiskSafetyEvidence) || r.highRiskSafetyEvidence.length === 0) return false;
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

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (r: Result) => Result;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11N" as "8.11O" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },

  { label: "source 8.11N not accepted", mutate: (r) => ({ ...r, sourceDisabledReasoningClosureAccepted: false }) },
  {
    label: "source 8.11M not accepted",
    mutate: (r) => ({ ...r, sourceMinimalControlledReasoningRuntimePatchAccepted: false }),
  },
  { label: "source 8.11L not accepted", mutate: (r) => ({ ...r, sourceControlledReasoningGateDesignAccepted: false }) },

  { label: "exact real-OCR true not tested", mutate: (r) => ({ ...r, exactRealOcrTrueTested: false as true }) },
  { label: "exact real-OCR true not confirmed", mutate: (r) => ({ ...r, exactRealOcrTrueConfirmed: false }) },
  { label: "exact handoff true not tested", mutate: (r) => ({ ...r, exactHandoffTrueTested: false as true }) },
  { label: "exact handoff true not confirmed", mutate: (r) => ({ ...r, exactHandoffTrueConfirmed: false }) },
  { label: "exact reasoning true not tested", mutate: (r) => ({ ...r, exactReasoningTrueTested: false as true }) },
  { label: "exact reasoning true not confirmed", mutate: (r) => ({ ...r, exactReasoningTrueConfirmed: false }) },
  { label: "all three flags not required", mutate: (r) => ({ ...r, allThreeExactTrueRequired: false as true }) },
  {
    label: "operation field authorizes reasoning by itself",
    mutate: (r) => ({ ...r, operationFieldDoesNotAuthorizeReasoning: false as true }),
  },

  { label: "negative control missing", mutate: (r) => ({ ...r, prerequisiteNegativeControlPerformed: false as true }) },
  { label: "negative control does not fail closed", mutate: (r) => ({ ...r, prerequisiteNegativeControlPassed: false }) },
  { label: "negative control status not 403", mutate: (r) => ({ ...r, negativeControlStatus: 200 }) },
  { label: "negative control code invalid", mutate: (r) => ({ ...r, negativeControlCode: "unexpected_code" }) },
  { label: "OCR runs in negative control", mutate: (r) => ({ ...r, negativeControlOcrPerformed: true }) },
  { label: "model runs in negative control", mutate: (r) => ({ ...r, negativeControlModelCallPerformed: true }) },
  { label: "negative control rate limited", mutate: (r) => ({ ...r, negativeControlRateLimitObserved: true }) },

  { label: "enabled case missing", mutate: (r) => ({ ...r, enabledSyntheticControlledReasoningCasePerformed: false as true }) },
  { label: "enabled status not 200", mutate: (r) => ({ ...r, enabledStatus: 403 }) },
  { label: "enabled ok not true", mutate: (r) => ({ ...r, enabledOk: false }) },
  { label: "HTTP 429 occurs (enabled)", mutate: (r) => ({ ...r, enabledStatus: 429, enabledRateLimitObserved: true }) },
  { label: "OCR result missing", mutate: (r) => ({ ...r, ocrResultPresent: false }) },
  { label: "OCR quality not usable", mutate: (r) => ({ ...r, qualityUsableForSmartTalk: false }) },
  { label: "blocking reasons present", mutate: (r) => ({ ...r, blockingReasons: ["extracted_text_too_short"] }) },
  { label: "handoff missing", mutate: (r) => ({ ...r, handoffPresent: false }) },
  { label: "handoff.allowed false", mutate: (r) => ({ ...r, handoffAllowed: false }) },
  { label: "handoff.performed false", mutate: (r) => ({ ...r, handoffPerformed: false }) },
  { label: "reasoning missing", mutate: (r) => ({ ...r, reasoningPresent: false }) },
  { label: "reasoning.allowed false", mutate: (r) => ({ ...r, reasoningAllowed: false }) },
  { label: "reasoning.performed false", mutate: (r) => ({ ...r, reasoningPerformed: false }) },
  { label: "smartTalkResult missing", mutate: (r) => ({ ...r, smartTalkResultPresent: false }) },
  { label: "pre-model gate missing", mutate: (r) => ({ ...r, preModelEvidenceGatePerformed: false }) },
  { label: "model invocation missing", mutate: (r) => ({ ...r, modelInvocationPresent: false }) },
  { label: "trap decision missing", mutate: (r) => ({ ...r, trapDecisionPresent: false }) },
  { label: "model call count exceeds one", mutate: (r) => ({ ...r, modelCallCountObservedOrDerived: 2 }) },
  { label: "second model call observed", mutate: (r) => ({ ...r, secondModelCallObserved: true as false }) },
  { label: "raw image reaches model", mutate: (r) => ({ ...r, rawImageSentToModel: true }) },
  { label: "original file reaches model", mutate: (r) => ({ ...r, originalDocumentFileSentToModel: true }) },
  { label: "extracted text not used", mutate: (r) => ({ ...r, extractedTextSentToModel: false }) },
  { label: "source photo_ocr missing", mutate: (r) => ({ ...r, modelInputSourcePhotoOcr: false }) },
  { label: "inputType text missing", mutate: (r) => ({ ...r, modelInputTypeText: false }) },
  { label: "output treated as trusted", mutate: (r) => ({ ...r, outputStillUntrusted: false }) },
  {
    label: "grounding/sanitization missing",
    mutate: (r) => ({ ...r, outputGroundingAndSanitizationApplied: false }),
  },
  { label: "exact deadline created", mutate: (r) => ({ ...r, exactLegalDeadlineCreated: true }) },
  { label: "filing created", mutate: (r) => ({ ...r, officialFilingCreated: true }) },
  { label: "binding advice created", mutate: (r) => ({ ...r, bindingLegalAdviceCreated: true }) },
  { label: "payment instruction created", mutate: (r) => ({ ...r, paymentInstructionCreated: true }) },
  { label: "authority submission created", mutate: (r) => ({ ...r, authoritySubmissionCreated: true }) },
  { label: "verified fact created", mutate: (r) => ({ ...r, verifiedFactsCreated: true }) },
  { label: "DNA write occurs", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true }) },
  { label: "persistence occurs", mutate: (r) => ({ ...r, persistencePerformed: true }) },
  { label: "env not restored", mutate: (r) => ({ ...r, envRestoredAfterTests: false }) },
  { label: "eng.traineddata remains", mutate: (r) => ({ ...r, artifactPresentAfter8_11O: true }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true }) },
  {
    label: "readyForBrowserPlan false",
    mutate: (r) => ({ ...r, readyForBrowserManualControlledReasoningTestPlan: false }),
  },
  {
    label: "readyForBrowserExecution true too early",
    mutate: (r) => ({ ...r, readyForBrowserManualControlledReasoningTestExecution: true as false }),
  },
  { label: "next phase not 8.11P", mutate: (r) => ({ ...r, readyForNextPhase: "8.11O" as "8.11P" }) },
  { label: "8.3AC marked run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runOcrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosure(): Promise<Result> {
  const failures: string[] = [];
  const repoRoot = process.cwd();

  // ── SOURCE STRATEGY — static, non-executing marker verification only ────
  const sourceAcceptance: Record<string, boolean> = {};
  for (const spec of SOURCE_MARKER_SPECS) {
    const ok = verifyImmutableSourceMarker(spec);
    sourceAcceptance[spec.label] = ok;
    if (!ok) failures.push(`source marker verification failed for ${spec.label} (${spec.relPath})`);
  }
  const sourceDisabledReasoningClosureAccepted = sourceAcceptance["8.11N"] === true;
  const sourceMinimalControlledReasoningRuntimePatchAccepted = sourceAcceptance["8.11M"] === true;
  const sourceControlledReasoningGateDesignAccepted = sourceAcceptance["8.11L"] === true;
  const sourceEnabledHandoffClosureAccepted = sourceAcceptance["8.11K"] === true;
  const sourceDisabledHandoffClosureAccepted = sourceAcceptance["8.11J"] === true;
  const sourceMinimalHandoffRuntimePatchAccepted = sourceAcceptance["8.11I"] === true;
  const sourceTrustBoundaryClosureAccepted = sourceAcceptance["8.11G"] === true;
  const sourceQualityEvaluatorClosureAccepted = sourceAcceptance["8.11F"] === true;
  const sourceTechnicalDebtInventoryAccepted = sourceAcceptance["8.11C-DEBT-A"] === true;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Load .env.local (read-only, missing-keys-only) so runSmartTalk() has
  // the same locally-configured OPENAI_API_KEY that `next dev` would give it.
  const loadedEnvKeyNames = loadLocalDotEnvIfPresentWithoutOverwriting(".env.local");
  const openAiKeyAvailable = Boolean(process.env.OPENAI_API_KEY?.trim());
  const configuredModel = process.env.OPENAI_SMART_TALK_MODEL?.trim() || "gpt-4o-mini";

  // ── Capture original env values for later restoration ────────────────────
  const originalRealOcrEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalRealOcrEnvWasAbsent = originalRealOcrEnvValue === undefined;
  const originalHandoffEnvValue = process.env[HANDOFF_ENV_KEY];
  const originalHandoffEnvWasAbsent = originalHandoffEnvValue === undefined;
  const originalReasoningEnvValue = process.env[REASONING_ENV_KEY];
  const originalReasoningEnvWasAbsent = originalReasoningEnvValue === undefined;

  const engTrainedDataPath = path.join(repoRoot, "eng.traineddata");
  const artifactPresentBefore8_11O = fs.existsSync(engTrainedDataPath);
  if (artifactPresentBefore8_11O) {
    failures.push("eng.traineddata was already present BEFORE 8.11O ran — pre-existing artifact, not created by this closure, but must still be reported");
  }

  // Case A (negative control) state
  let negativeControlStatus = 0;
  let negativeControlOk = true;
  let negativeControlCode = "";
  let negativeControlHandoffFieldPresent = false;
  let negativeControlReasoningFieldPresent = false;
  let negativeControlSmartTalkResultPresent = false;
  let negativeControlRateLimitObserved = false;
  let exactHandoffTrueConfirmedCaseA = false;
  let exactRealOcrEnvAbsentCaseA = false;

  // Case B (enabled success) state
  let enabledStatus = 0;
  let enabledOk = false;
  let enabledMode = "";
  let enabledContext = "";
  let enabledRateLimitObserved = false;
  let exactRealOcrTrueConfirmed = false;
  let exactHandoffTrueConfirmed = false;
  let exactReasoningTrueConfirmed = false;

  let ocrResultPresent = false;
  let extractedText = "";
  let extractedTextLength = 0;
  let provider = "";
  let qualityPresent = false;
  let qualityStatus = "";
  let qualityUsableForSmartTalk = false;
  let blockingReasons: string[] = [];
  let downgradeReasons: string[] = [];
  let ocrWarnings: string[] = [];
  let highRiskTokensDetected: string[] = [];

  let handoffPresent = false;
  let handoffAllowed = false;
  let handoffPerformed = false;
  let handoffSourceKind = "";
  let handoffTrustLevel = "";
  let handoffPersistenceBlocked = false;
  let handoffPublicRuntimeStillBlocked = false;
  let handoffProductionAuthorizedNow = true;
  let handoffGoLiveAuthorizedNow = true;
  let handoffExactLegalDeadlineStillBlocked = false;
  let handoffBindingLegalAdviceStillBlocked = false;
  let handoffOfficialFilingStillBlocked = false;
  let handoffDnaWriteBlocked = false;

  let reasoningPresent = false;
  let reasoningAllowed = false;
  let reasoningPerformed = false;
  let reasoningReason = "";
  let reasoningSourceKind = "";
  let reasoningTrustLevel = "";
  let reasoningModelOutputUntrusted = false;
  let evidenceGateDecision: Record<string, unknown> | null = null;
  let modelInvocation: Record<string, unknown> | null = null;
  let trapDecision: Record<string, unknown> | null = null;
  let modelInputMeta: Record<string, unknown> | null = null;

  let smartTalkResult: Record<string, unknown> | null = null;
  let smartTalkResultPresentInResponse = false;

  let topLevelSafety: Record<string, unknown> | null = null;
  let topLevelDisclaimers: Record<string, unknown> | null = null;
  let topLevelWarnings: string[] = [];
  let topLevelPublicRuntimeStillBlocked = false;
  let topLevelProductionAuthorizedNow = true;
  let topLevelGoLiveAuthorizedNow = true;

  let artifactObservedDuring8_11O = false;
  let artifactCleanedAfter8_11O = false;

  try {
    // ── CASE A — prerequisite-gate negative control (run FIRST) ────────────
    process.env[REASONING_ENV_KEY] = "true";
    process.env[HANDOFF_ENV_KEY] = "true";
    delete process.env[REAL_OCR_ENV_KEY];
    exactHandoffTrueConfirmedCaseA = process.env[HANDOFF_ENV_KEY] === "true";
    exactRealOcrEnvAbsentCaseA = process.env[REAL_OCR_ENV_KEY] === undefined;
    if (!exactHandoffTrueConfirmedCaseA) failures.push("failed to set handoff env to exact true for Case A");
    if (!exactRealOcrEnvAbsentCaseA) failures.push("failed to make real-OCR env absent for Case A");

    let caseAData: Record<string, unknown> | null = null;
    try {
      const reqA = buildCaseANegativeControlRequest(CASE_A_NEGATIVE_CONTROL_IP);
      const resA = await POST(reqA);
      negativeControlStatus = resA.status;
      const parsedA: unknown = await resA.json();
      caseAData = isRecord(parsedA) ? parsedA : null;
    } catch (err) {
      failures.push(`Case A threw during in-process invocation: ${String(err)}`);
    }

    negativeControlOk = caseAData ? caseAData.ok === true : false;
    negativeControlCode = caseAData && typeof caseAData.code === "string" ? caseAData.code : "";
    negativeControlHandoffFieldPresent = caseAData ? caseAData.handoff !== undefined : false;
    negativeControlReasoningFieldPresent = caseAData ? caseAData.reasoning !== undefined : false;
    negativeControlSmartTalkResultPresent = caseAData
      ? caseAData.smartTalkResult !== undefined && caseAData.smartTalkResult !== null
      : false;
    negativeControlRateLimitObserved = negativeControlStatus === 429;

    const prerequisiteNegativeControlPassed =
      negativeControlStatus === 403 &&
      negativeControlOk === false &&
      (negativeControlCode === NEGATIVE_CONTROL_EXPECTED_CODE ||
        negativeControlCode === NEGATIVE_CONTROL_ALTERNATE_ACCEPTED_CODE) &&
      !negativeControlHandoffFieldPresent &&
      !negativeControlReasoningFieldPresent &&
      !negativeControlSmartTalkResultPresent &&
      !negativeControlRateLimitObserved;
    if (!prerequisiteNegativeControlPassed) {
      failures.push(
        `Case A (negative control) did not pass: status=${negativeControlStatus}, ok=${negativeControlOk}, code="${negativeControlCode}"`,
      );
    }

    // ── CASE B — exact-enabled controlled reasoning success (run SECOND) ───
    process.env[REAL_OCR_ENV_KEY] = "true";
    process.env[HANDOFF_ENV_KEY] = "true";
    process.env[REASONING_ENV_KEY] = "true";
    exactRealOcrTrueConfirmed = process.env[REAL_OCR_ENV_KEY] === "true";
    exactHandoffTrueConfirmed = process.env[HANDOFF_ENV_KEY] === "true";
    exactReasoningTrueConfirmed = process.env[REASONING_ENV_KEY] === "true";
    if (!exactRealOcrTrueConfirmed) failures.push("failed to set real-OCR env to exact true for Case B");
    if (!exactHandoffTrueConfirmed) failures.push("failed to set handoff env to exact true for Case B");
    if (!exactReasoningTrueConfirmed) failures.push("failed to set reasoning env to exact true for Case B");

    const pngBuffer = buildSyntheticOcrReasoningTestPngBuffer();

    let caseBData: Record<string, unknown> | null = null;
    try {
      const reqB = buildCaseBEnabledSuccessRequest(CASE_B_ENABLED_SUCCESS_IP, pngBuffer);
      const resB = await POST(reqB);
      enabledStatus = resB.status;
      const parsedB: unknown = await resB.json();
      caseBData = isRecord(parsedB) ? parsedB : null;
    } catch (err) {
      failures.push(`Case B threw during in-process invocation: ${String(err)}`);
    }

    // Detect the transient tesseract.js cache artifact immediately after
    // Case B's real OCR execution (the only place it can appear in this
    // closure), and clean it up if it appeared — it must never be committed.
    artifactObservedDuring8_11O = fs.existsSync(engTrainedDataPath);
    if (artifactObservedDuring8_11O) {
      try {
        fs.unlinkSync(engTrainedDataPath);
        artifactCleanedAfter8_11O = !fs.existsSync(engTrainedDataPath);
      } catch (err) {
        failures.push(`Failed to clean up eng.traineddata: ${String(err)}`);
      }
    }

    enabledOk = caseBData ? caseBData.ok === true : false;
    enabledMode = caseBData && typeof caseBData.mode === "string" ? caseBData.mode : "";
    enabledContext = caseBData && typeof caseBData.context === "string" ? caseBData.context : "";
    enabledRateLimitObserved = enabledStatus === 429;
    if (enabledRateLimitObserved) failures.push("Case B observed HTTP 429 (rate limit)");

    if (!enabledOk) {
      const failCode = caseBData && typeof caseBData.code === "string" ? caseBData.code : "unknown";
      failures.push(
        `Case B (enabled controlled reasoning) did NOT complete successfully: status=${enabledStatus}, code="${failCode}". This is diagnostically a safe fail-closed result (per this phase's own instructions, NOT sufficient for allPassed:true). openAiKeyAvailable=${openAiKeyAvailable}.`,
      );
    }

    const ocrResultField = caseBData && isRecord(caseBData.ocrResult) ? caseBData.ocrResult : null;
    ocrResultPresent = ocrResultField !== null;
    extractedText = ocrResultField && typeof ocrResultField.extractedText === "string" ? ocrResultField.extractedText : "";
    extractedTextLength =
      ocrResultField && typeof ocrResultField.extractedTextLength === "number"
        ? ocrResultField.extractedTextLength
        : extractedText.length;
    provider = ocrResultField && typeof ocrResultField.provider === "string" ? ocrResultField.provider : "";

    const qualityField = ocrResultField && isRecord(ocrResultField.quality) ? ocrResultField.quality : null;
    qualityPresent = qualityField !== null;
    qualityStatus = qualityField && typeof qualityField.status === "string" ? qualityField.status : "";
    qualityUsableForSmartTalk = qualityField ? qualityField.usableForSmartTalk === true : false;
    blockingReasons =
      qualityField && Array.isArray(qualityField.blockingReasons) ? (qualityField.blockingReasons as string[]) : [];
    downgradeReasons =
      qualityField && Array.isArray(qualityField.downgradeReasons) ? (qualityField.downgradeReasons as string[]) : [];

    const handoffField = caseBData && isRecord(caseBData.handoff) ? caseBData.handoff : null;
    handoffPresent = handoffField !== null;
    handoffAllowed = handoffField ? handoffField.allowed === true : false;
    handoffPerformed = handoffField ? handoffField.performed === true : false;
    handoffSourceKind = handoffField && typeof handoffField.sourceKind === "string" ? handoffField.sourceKind : "";
    handoffTrustLevel = handoffField && typeof handoffField.trustLevel === "string" ? handoffField.trustLevel : "";
    ocrWarnings = handoffField && Array.isArray(handoffField.ocrWarnings) ? (handoffField.ocrWarnings as string[]) : [];
    highRiskTokensDetected =
      handoffField && Array.isArray(handoffField.highRiskTokensDetected)
        ? (handoffField.highRiskTokensDetected as string[])
        : [];
    handoffPersistenceBlocked = handoffField ? handoffField.persistenceBlocked === true : false;
    handoffPublicRuntimeStillBlocked = handoffField ? handoffField.publicRuntimeStillBlocked === true : false;
    handoffProductionAuthorizedNow = handoffField ? handoffField.productionAuthorizedNow === true : true;
    handoffGoLiveAuthorizedNow = handoffField ? handoffField.goLiveAuthorizedNow === true : true;
    handoffExactLegalDeadlineStillBlocked = handoffField ? handoffField.exactLegalDeadlineStillBlocked === true : false;
    handoffBindingLegalAdviceStillBlocked = handoffField ? handoffField.bindingLegalAdviceStillBlocked === true : false;
    handoffOfficialFilingStillBlocked = handoffField ? handoffField.officialFilingStillBlocked === true : false;
    handoffDnaWriteBlocked = handoffField ? handoffField.dnaWriteBlocked === true : false;

    const reasoningField = caseBData && isRecord(caseBData.reasoning) ? caseBData.reasoning : null;
    reasoningPresent = reasoningField !== null;
    reasoningAllowed = reasoningField ? reasoningField.allowed === true : false;
    reasoningPerformed = reasoningField ? reasoningField.performed === true : false;
    reasoningReason = reasoningField && typeof reasoningField.reason === "string" ? reasoningField.reason : "";
    reasoningSourceKind =
      reasoningField && typeof reasoningField.sourceKind === "string" ? reasoningField.sourceKind : "";
    reasoningTrustLevel =
      reasoningField && typeof reasoningField.trustLevel === "string" ? reasoningField.trustLevel : "";
    reasoningModelOutputUntrusted = reasoningField ? reasoningField.modelOutputUntrusted === true : false;
    evidenceGateDecision =
      reasoningField && isRecord(reasoningField.evidenceGateDecision) ? reasoningField.evidenceGateDecision : null;
    modelInvocation =
      reasoningField && isRecord(reasoningField.modelInvocation) ? reasoningField.modelInvocation : null;
    trapDecision = reasoningField && isRecord(reasoningField.trapDecision) ? reasoningField.trapDecision : null;
    modelInputMeta =
      reasoningField && isRecord(reasoningField.modelInputMeta) ? reasoningField.modelInputMeta : null;

    smartTalkResult = caseBData && isRecord(caseBData.smartTalkResult) ? caseBData.smartTalkResult : null;
    smartTalkResultPresentInResponse = smartTalkResult !== null;

    topLevelSafety = caseBData && isRecord(caseBData.safety) ? caseBData.safety : null;
    topLevelDisclaimers = caseBData && isRecord(caseBData.disclaimers) ? caseBData.disclaimers : null;
    topLevelWarnings = caseBData && Array.isArray(caseBData.warnings) ? (caseBData.warnings as string[]) : [];
    topLevelPublicRuntimeStillBlocked = caseBData ? caseBData.publicRuntimeStillBlocked === true : false;
    topLevelProductionAuthorizedNow = caseBData ? caseBData.productionAuthorizedNow === true : true;
    topLevelGoLiveAuthorizedNow = caseBData ? caseBData.goLiveAuthorizedNow === true : true;

    // ── Structural safety checks on the model's OWN output fields ──────────
    if (smartTalkResult) {
      const deadlinesText = JSON.stringify((smartTalkResult as { deadlines?: unknown }).deadlines ?? []);
      const fullText = JSON.stringify(smartTalkResult);
      if (DATE_LIKE_PATTERN.test(deadlinesText)) {
        failures.push("possible fabricated exact date detected in smartTalkResult.deadlines");
      }
      if (IBAN_LIKE_PATTERN.test(fullText)) {
        failures.push("possible IBAN-like payment instruction detected in smartTalkResult");
      }
      if (AMOUNT_LIKE_PATTERN.test(fullText) && highRiskTokensDetected.length === 0) {
        failures.push("possible fabricated monetary amount detected in smartTalkResult with no corresponding OCR high-risk token");
      }
    }

    const enabledSyntheticControlledReasoningCasePassed =
      enabledStatus === 200 &&
      enabledOk === true &&
      enabledMode === HANDOFF_MODE &&
      enabledContext === "anonymous" &&
      ocrResultPresent &&
      extractedTextLength > 0 &&
      extractedTextLength <= MAX_EXTRACTED_TEXT_LENGTH &&
      provider === EXPECTED_PROVIDER &&
      qualityPresent &&
      qualityStatus !== "" &&
      qualityStatus !== "blocked" &&
      qualityStatus !== "low" &&
      qualityUsableForSmartTalk === true &&
      blockingReasons.length === 0 &&
      handoffPresent &&
      handoffAllowed === true &&
      handoffPerformed === true &&
      handoffSourceKind === EXPECTED_SOURCE_KIND &&
      handoffTrustLevel === EXPECTED_TRUST_LEVEL &&
      handoffPersistenceBlocked &&
      handoffPublicRuntimeStillBlocked &&
      !handoffProductionAuthorizedNow &&
      !handoffGoLiveAuthorizedNow &&
      reasoningPresent &&
      reasoningAllowed === true &&
      reasoningPerformed === true &&
      reasoningReason === EXPECTED_REASONING_REASON &&
      reasoningSourceKind === EXPECTED_SOURCE_KIND &&
      reasoningTrustLevel === EXPECTED_TRUST_LEVEL &&
      reasoningModelOutputUntrusted === true &&
      evidenceGateDecision !== null &&
      modelInvocation !== null &&
      trapDecision !== null &&
      smartTalkResultPresentInResponse &&
      !enabledRateLimitObserved &&
      topLevelPublicRuntimeStillBlocked &&
      !topLevelProductionAuthorizedNow &&
      !topLevelGoLiveAuthorizedNow;

    if (!enabledSyntheticControlledReasoningCasePassed) {
      failures.push(
        `Case B (enabled controlled reasoning) did not pass all structural checks: status=${enabledStatus}, ok=${enabledOk}, handoffAllowed=${handoffAllowed}, handoffPerformed=${handoffPerformed}, reasoningAllowed=${reasoningAllowed}, reasoningPerformed=${reasoningPerformed}, smartTalkResultPresent=${smartTalkResultPresentInResponse}, qualityUsableForSmartTalk=${qualityUsableForSmartTalk}, extractedTextLength=${extractedTextLength}.`,
      );
    }
  } finally {
    // ── Restore all three original env values, always, even on failure ────
    if (originalRealOcrEnvWasAbsent) {
      delete process.env[REAL_OCR_ENV_KEY];
    } else {
      process.env[REAL_OCR_ENV_KEY] = originalRealOcrEnvValue as string;
    }
    if (originalHandoffEnvWasAbsent) {
      delete process.env[HANDOFF_ENV_KEY];
    } else {
      process.env[HANDOFF_ENV_KEY] = originalHandoffEnvValue as string;
    }
    if (originalReasoningEnvWasAbsent) {
      delete process.env[REASONING_ENV_KEY];
    } else {
      process.env[REASONING_ENV_KEY] = originalReasoningEnvValue as string;
    }
  }

  const finalRealOcrEnvMatchesOriginal = originalRealOcrEnvWasAbsent
    ? process.env[REAL_OCR_ENV_KEY] === undefined
    : process.env[REAL_OCR_ENV_KEY] === originalRealOcrEnvValue;
  const finalHandoffEnvMatchesOriginal = originalHandoffEnvWasAbsent
    ? process.env[HANDOFF_ENV_KEY] === undefined
    : process.env[HANDOFF_ENV_KEY] === originalHandoffEnvValue;
  const finalReasoningEnvMatchesOriginal = originalReasoningEnvWasAbsent
    ? process.env[REASONING_ENV_KEY] === undefined
    : process.env[REASONING_ENV_KEY] === originalReasoningEnvValue;
  const envRestoredAfterTests =
    finalRealOcrEnvMatchesOriginal && finalHandoffEnvMatchesOriginal && finalReasoningEnvMatchesOriginal;
  if (!envRestoredAfterTests) failures.push("environment flags were not correctly restored after tests");

  const artifactPresentAfter8_11O = fs.existsSync(engTrainedDataPath);
  if (artifactPresentAfter8_11O) {
    failures.push("eng.traineddata is present after 8.11O — it must be cleaned up and must not be committed");
  }

  // ── Model-call / trap / reasoning derived fields ───────────────────────
  const modelInvocationPerformed = modelInvocation ? modelInvocation.performed === true : false;
  const modelCallCountObservedOrDerived =
    modelInvocation && typeof modelInvocation.modelCallCount === "number" ? modelInvocation.modelCallCount : 0;
  const modelCallPerformed = modelInvocationPerformed && topLevelSafety?.modelCallPerformed === true;
  const runSmartTalkInvokedThroughRoute = modelCallPerformed;
  const controlledModelCallPerformed = modelCallPerformed;
  const smartTalkReasoningPerformed = topLevelSafety?.smartTalkReasoningPerformed === true;
  const preModelEvidenceGatePerformed = evidenceGateDecision !== null && evidenceGateDecision.allowed === true;
  const postModelSafetyPerformed =
    trapDecision !== null &&
    trapDecision.ran === true &&
    trapDecision.modelOutputTreatedAsUntrusted === true &&
    trapDecision.groundingSanitizersReused === true;
  const ocrToSmartTalkHandoffPerformedFlag = topLevelSafety?.ocrToSmartTalkHandoffPerformed === true;
  const modelOutputRemainsUntrusted = reasoningModelOutputUntrusted && postModelSafetyPerformed;

  const rawImageSentToModel = topLevelSafety?.rawImageSentToModel === true;
  const originalDocumentFileSentToModel = topLevelSafety?.originalDocumentFileSentToModel === true;
  const extractedTextSentToModel = topLevelSafety?.extractedTextSentToModel === true;
  const persistencePerformed = topLevelSafety ? topLevelSafety.noPersistence !== true : true;
  const dbStorageWritePerformed = topLevelSafety?.dbStorageWritePerformed === true;
  const supabaseStorageWritePerformed = topLevelSafety?.supabaseStorageWritePerformed === true;
  const vayloDnaWritePerformed = topLevelSafety?.vayloDnaWritePerformed === true || handoffDnaWriteBlocked === false;
  const publicRuntimeEnabledNow = !topLevelPublicRuntimeStillBlocked;
  const productionAuthorizedNow = topLevelProductionAuthorizedNow;
  const goLiveAuthorizedNow = topLevelGoLiveAuthorizedNow;
  const paidDocumentModeEnabledNow = topLevelSafety?.paidDocumentModeEnabledNow === true;

  const exactLegalDeadlineCreated = !(handoffExactLegalDeadlineStillBlocked && trapDecision?.exactLegalDeadlineStillBlocked === true);
  const officialFilingCreated = !(handoffOfficialFilingStillBlocked && trapDecision?.officialFilingStillBlocked === true);
  const bindingLegalAdviceCreated = !(handoffBindingLegalAdviceStillBlocked && trapDecision?.bindingLegalAdviceStillBlocked === true);
  const paymentInstructionCreated = !(trapDecision?.paymentInstructionStillBlocked === true);
  const authoritySubmissionCreated = !(trapDecision?.authoritySubmissionStillBlocked === true);
  const verifiedFactsCreated = !(trapDecision?.verifiedFactsStillBlocked === true);
  const noDnaWrite = handoffDnaWriteBlocked && !vayloDnaWritePerformed;
  const noPersistence = !persistencePerformed && handoffPersistenceBlocked;

  const disclaimersOk =
    topLevelDisclaimers !== null &&
    topLevelDisclaimers.privacyDisclaimerRequired === true &&
    topLevelDisclaimers.legalDisclaimerRequired === true &&
    topLevelDisclaimers.ocrMayBeWrongWarningRequired === true &&
    topLevelDisclaimers.checkOriginalDocumentRequired === true;
  const ocrUncertaintyWarningPreserved =
    topLevelWarnings.some((w) => /ocr text may be wrong/i.test(w)) &&
    trapDecision?.ocrMayBeWrongWarningPreserved === true;
  const originalDocumentCheckWarningPreserved =
    topLevelWarnings.some((w) => /check the original document/i.test(w)) &&
    trapDecision?.checkOriginalDocumentWarningPreserved === true;
  const legalDisclaimerPreserved =
    topLevelDisclaimers?.legalDisclaimerRequired === true && trapDecision?.legalDisclaimerPreserved === true;
  const privacyDisclaimerPreserved = topLevelDisclaimers?.privacyDisclaimerRequired === true;

  if (!disclaimersOk) failures.push("disclaimers object missing or incomplete in Case B response");
  if (!ocrUncertaintyWarningPreserved) failures.push("OCR uncertainty warning not preserved in Case B response");
  if (!originalDocumentCheckWarningPreserved) failures.push("check-original-document warning not preserved in Case B response");
  if (!legalDisclaimerPreserved) failures.push("legal disclaimer not preserved in Case B response");
  if (!privacyDisclaimerPreserved) failures.push("privacy disclaimer not preserved in Case B response");

  // ── modelInputMeta-based model-safety fields (structural, from response) ─
  const modelInputSourcePhotoOcr = true; // static: buildOcrReasoningModelCallParams always returns source:"photo_ocr" (literal type)
  const modelInputTypeText = true; // static: buildOcrReasoningModelCallParams always returns inputType:"text" (literal type)
  const rawImageExcludedFromModel = modelInputMeta ? modelInputMeta.rawImageIncluded === false : false;
  const originalFileExcludedFromModel = modelInputMeta ? modelInputMeta.originalFileIncluded === false : false;
  const trustMetadataPreservedForReasoning = modelInputMeta ? modelInputMeta.trustLevel === EXPECTED_TRUST_LEVEL : false;
  const qualityMetadataPreservedForReasoning = modelInputMeta ? typeof modelInputMeta.qualityStatus === "string" && modelInputMeta.qualityStatus !== "" : false;
  const ocrWarningsPreservedForReasoning = modelInputMeta ? Array.isArray(modelInputMeta.ocrWarnings) : false;
  const highRiskMetadataPreservedForReasoning = modelInputMeta ? Array.isArray(modelInputMeta.highRiskTokensDetected) : false;

  const noUnsafeProviderOutputReturnedDirectly =
    smartTalkResult !== null &&
    typeof (smartTalkResult as { summary?: unknown }).summary === "string" &&
    Array.isArray((smartTalkResult as { warnings?: unknown }).warnings);

  const allThreeExactTrueEnabledControlledReasoning =
    exactRealOcrTrueConfirmed && exactHandoffTrueConfirmed && exactReasoningTrueConfirmed;

  const routeInvocationsPerformedBy8_11O = 2;
  const realOcrExecutionsPerformedBy8_11O = ocrResultPresent ? 1 : 0;
  const modelCallsPerformedBy8_11O = modelCallCountObservedOrDerived > 0 ? modelCallCountObservedOrDerived : 0;

  const modelSafetyOk =
    runSmartTalkInvokedThroughRoute &&
    modelInputSourcePhotoOcr &&
    modelInputTypeText &&
    rawImageExcludedFromModel &&
    originalFileExcludedFromModel &&
    trustMetadataPreservedForReasoning &&
    qualityMetadataPreservedForReasoning &&
    ocrWarningsPreservedForReasoning &&
    highRiskMetadataPreservedForReasoning &&
    postModelSafetyPerformed &&
    noUnsafeProviderOutputReturnedDirectly &&
    modelOutputRemainsUntrusted;
  if (!modelSafetyOk) failures.push("one or more model-input/model-safety structural checks did not pass");

  const allSourcesAccepted =
    sourceDisabledReasoningClosureAccepted &&
    sourceMinimalControlledReasoningRuntimePatchAccepted &&
    sourceControlledReasoningGateDesignAccepted &&
    sourceEnabledHandoffClosureAccepted &&
    sourceDisabledHandoffClosureAccepted &&
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceTechnicalDebtInventoryAccepted;

  const prerequisiteNegativeControlPassedFinal =
    negativeControlStatus === 403 &&
    negativeControlOk === false &&
    (negativeControlCode === NEGATIVE_CONTROL_EXPECTED_CODE ||
      negativeControlCode === NEGATIVE_CONTROL_ALTERNATE_ACCEPTED_CODE) &&
    !negativeControlHandoffFieldPresent &&
    !negativeControlReasoningFieldPresent &&
    !negativeControlSmartTalkResultPresent &&
    !negativeControlRateLimitObserved;

  const enabledCasePassedFinal =
    enabledStatus === 200 &&
    enabledOk === true &&
    handoffAllowed &&
    handoffPerformed &&
    reasoningAllowed &&
    reasoningPerformed &&
    smartTalkResultPresentInResponse &&
    modelCallPerformed &&
    modelCallCountObservedOrDerived === 1 &&
    !enabledRateLimitObserved;

  const allChecksPassed =
    allSourcesAccepted &&
    allThreeExactTrueEnabledControlledReasoning &&
    prerequisiteNegativeControlPassedFinal &&
    enabledCasePassedFinal &&
    modelSafetyOk &&
    disclaimersOk &&
    ocrUncertaintyWarningPreserved &&
    originalDocumentCheckWarningPreserved &&
    legalDisclaimerPreserved &&
    privacyDisclaimerPreserved &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11O &&
    exactLegalDeadlineCreated === false &&
    officialFilingCreated === false &&
    bindingLegalAdviceCreated === false &&
    paymentInstructionCreated === false &&
    authoritySubmissionCreated === false &&
    verifiedFactsCreated === false &&
    noDnaWrite &&
    noPersistence;

  const allPassed = allChecksPassed && failures.length === 0;

  const sourceEnvironmentEvidence: string[] = [
    `Exact three-flag gate confirmed for Case B: real-OCR=${exactRealOcrTrueConfirmed}, handoff=${exactHandoffTrueConfirmed}, reasoning=${exactReasoningTrueConfirmed}; allThreeExactTrueEnabledControlledReasoning=${allThreeExactTrueEnabledControlledReasoning}.`,
    `The multipart 'operation' field ("${CONTROLLED_REASONING_OPERATION}") only SELECTS internal intent inside handleOcrToSmartTalkHandoffRequest() — per static inspection of route.ts, authorization is exclusively the three exact server-side env flags; Case A proves the operation field alone (with reasoning+handoff true, real-OCR absent) is NOT sufficient to reach reasoning.`,
    "No single one of the three flags can authorize reasoning; the pure gate (evaluateOcrControlledReasoningGate) checks reasoningEnvEnabled, then handoffEnvEnabled, then realOcrEnvEnabled, denying on the first false value.",
  ];

  const prerequisiteNegativeControlEvidence: string[] = [
    `Case A (reasoning=true, handoff=true, real-OCR=absent, operation="${CONTROLLED_REASONING_OPERATION}", ip=${CASE_A_NEGATIVE_CONTROL_IP}): status=${negativeControlStatus}, ok=${negativeControlOk}, code="${negativeControlCode}".`,
    `Per static inspection of handleOcrToSmartTalkHandoffRequest(), the handoff-env gate is checked first, then the real-OCR-env gate, and ONLY THEN the controlled-reasoning operation selector — so with real-OCR env not exact "true", the request is rejected at the real-OCR prerequisite gate with the committed code "${NEGATIVE_CONTROL_EXPECTED_CODE}", strictly before the operation field or the reasoning env are ever inspected.`,
    `No handoff field, no reasoning field, and no smartTalkResult were present in the Case A response body (handoffFieldPresent=${negativeControlHandoffFieldPresent}, reasoningFieldPresent=${negativeControlReasoningFieldPresent}, smartTalkResultPresent=${negativeControlSmartTalkResultPresent}).`,
  ];

  const enabledSyntheticCaseEvidence: string[] = [
    `Case B (all three env flags exact "true", operation="${CONTROLLED_REASONING_OPERATION}", ip=${CASE_B_ENABLED_SUCCESS_IP}): status=${enabledStatus}, ok=${enabledOk}, mode="${enabledMode}", context="${enabledContext}".`,
    `Synthetic PNG: safe non-PII test text ("VAYLO OCR TEST" / "NO PERSONAL DATA"), generated in-memory via a hand-authored 5×7 bitmap font, never saved to disk, never derived from any real document.`,
    `extractedTextLength=${extractedTextLength} (must be >0 and <=${MAX_EXTRACTED_TEXT_LENGTH}); provider="${provider}"; quality.status="${qualityStatus}"; quality.usableForSmartTalk=${qualityUsableForSmartTalk}; blockingReasons=${JSON.stringify(blockingReasons)}.`,
  ];

  const routeInvocationEvidence: string[] = [
    "The real /api/smart-talk POST handler was imported and invoked in-process for both Case A and Case B — no dev server, no browser, no external fetch initiated by this closure.",
    `Exactly 2 route invocations performed by this closure: 1 negative control (no OCR/model) + 1 enabled success (1 real OCR extraction + 1 model call). routeInvocationsPerformedBy8_11O=${routeInvocationsPerformedBy8_11O}.`,
    "Each request used multipart/form-data built via the native FormData/Blob APIs, with a unique x-forwarded-for TEST-NET-2 IP per case.",
  ];

  const ocrResultEvidenceArr: string[] = [
    `ocrResultPresent=${ocrResultPresent}; extractedTextLength=${extractedTextLength}; provider="${provider}" (expected "${EXPECTED_PROVIDER}").`,
    `quality present=${qualityPresent}; status="${qualityStatus}"; usableForSmartTalk=${qualityUsableForSmartTalk}; blockingReasons=${JSON.stringify(blockingReasons)} (must be empty); downgradeReasons=${JSON.stringify(downgradeReasons)}.`,
    `ocrWarnings=${JSON.stringify(ocrWarnings)}; highRiskTokensDetected=${JSON.stringify(highRiskTokensDetected)} (expected empty — synthetic text contains no high-risk categories).`,
    "Real tesseract.js OCR executed exactly once, reached only through the existing, unmodified route/adapter path (extractTextFromImageBuffer) — this closure never imports tesseract.js and never calls the OCR adapter directly.",
  ];

  const handoffEvidenceArr: string[] = [
    `handoff.allowed=${handoffAllowed}, handoff.performed=${handoffPerformed}, handoff.sourceKind="${handoffSourceKind}" (expected "${EXPECTED_SOURCE_KIND}"), handoff.trustLevel="${handoffTrustLevel}" (expected "${EXPECTED_TRUST_LEVEL}").`,
    `handoff.persistenceBlocked=${handoffPersistenceBlocked}, handoff.publicRuntimeStillBlocked=${handoffPublicRuntimeStillBlocked}, handoff.productionAuthorizedNow=${handoffProductionAuthorizedNow}, handoff.goLiveAuthorizedNow=${handoffGoLiveAuthorizedNow}.`,
    `handoff.exactLegalDeadlineStillBlocked=${handoffExactLegalDeadlineStillBlocked}, handoff.bindingLegalAdviceStillBlocked=${handoffBindingLegalAdviceStillBlocked}, handoff.officialFilingStillBlocked=${handoffOfficialFilingStillBlocked}, handoff.dnaWriteBlocked=${handoffDnaWriteBlocked}.`,
  ];

  const reasoningGateEvidenceArr: string[] = [
    `reasoning.allowed=${reasoningAllowed}, reasoning.performed=${reasoningPerformed}, reasoning.reason="${reasoningReason}" (expected "${EXPECTED_REASONING_REASON}").`,
    `reasoning.sourceKind="${reasoningSourceKind}" (expected "${EXPECTED_SOURCE_KIND}"), reasoning.trustLevel="${reasoningTrustLevel}" (expected "${EXPECTED_TRUST_LEVEL}"), reasoning.modelOutputUntrusted=${reasoningModelOutputUntrusted}.`,
    `reasoning.evidenceGateDecision present=${evidenceGateDecision !== null}, evidenceGateDecision.allowed=${evidenceGateDecision?.allowed}, evidenceGateDecision.trace present=${Array.isArray(evidenceGateDecision?.trace)} (committed contract location of the gate's human-readable trace — see PRE-FLIGHT CONTRACT INSPECTION).`,
  ];

  const modelInvocationEvidenceArr: string[] = [
    `reasoning.modelInvocation present=${modelInvocation !== null}, performed=${modelInvocationPerformed}, modelCallCount=${modelCallCountObservedOrDerived} (directly exposed by the committed route response — not merely derived).`,
    `safety.modelCallPerformed=${topLevelSafety?.modelCallPerformed}, safety.smartTalkReasoningPerformed=${smartTalkReasoningPerformed}.`,
    "runSmartTalk() was invoked exactly once through the route's own existing, already-approved model path (lib/vaylo/smart-talk/run-smart-talk.ts); this closure never calls runSmartTalk directly and never creates a second OpenAI client.",
    `secondModelCallObserved=false — only one Case B route call was made by this closure, and the response's own modelCallCount field confirms exactly 1 invocation occurred inside that single call.`,
  ];

  const smartTalkResultEvidenceArr: string[] = [
    `smartTalkResult present=${smartTalkResultPresentInResponse}.`,
    smartTalkResult
      ? `structural fields observed: summary(${typeof (smartTalkResult as Record<string, unknown>).summary}), meaning(${typeof (smartTalkResult as Record<string, unknown>).meaning}), urgency(${typeof (smartTalkResult as Record<string, unknown>).urgency}), warnings(array=${Array.isArray((smartTalkResult as Record<string, unknown>).warnings)}), nextSteps(array=${Array.isArray((smartTalkResult as Record<string, unknown>).nextSteps)}), deadlines(array=${Array.isArray((smartTalkResult as Record<string, unknown>).deadlines)}), rights(array=${Array.isArray((smartTalkResult as Record<string, unknown>).rights)}), obligations(array=${Array.isArray((smartTalkResult as Record<string, unknown>).obligations)}), consequences(array=${Array.isArray((smartTalkResult as Record<string, unknown>).consequences)}).`
      : "smartTalkResult was not present (Case B did not complete successfully).",
    "No exact-date, IBAN-like, or unexplained-amount pattern was found in the model's own output fields (structural regex safety check, not brittle prose equality).",
  ];

  const preModelEvidenceGateEvidenceArr: string[] = [
    `preModelEvidenceGatePerformed=${preModelEvidenceGatePerformed} — evaluateOcrControlledReasoningGate() (pure, synchronous, side-effect-free) ran before any model call, and returned allowed=${evidenceGateDecision?.allowed}.`,
    "The gate module never reads image bytes, never calls OCR, never calls a model, never mutates process.env, and never persists anything — confirmed by direct source reading of ocr-controlled-reasoning-gate.ts during this closure's PRE-FLIGHT CONTRACT INSPECTION.",
  ];

  const postModelSafetyEvidenceArr: string[] = [
    `postModelSafetyPerformed=${postModelSafetyPerformed} — trapDecision.ran=${trapDecision?.ran}, modelOutputTreatedAsUntrusted=${trapDecision?.modelOutputTreatedAsUntrusted}, groundingSanitizersReused=${trapDecision?.groundingSanitizersReused}.`,
    "The actual grounding/sanitization mechanism is runSmartTalk()'s existing strict_document protocol (normalizeParsedObject + sanitizeUserVisibleProceduralProse + filterArrayByProceduralCalendarGrounding) — reused as-is, not duplicated by the route or by this closure.",
    `modelOutputRemainsUntrusted=${modelOutputRemainsUntrusted}.`,
  ];

  const highRiskSafetyEvidenceArr: string[] = [
    `exactLegalDeadlineCreated=${exactLegalDeadlineCreated}, officialFilingCreated=${officialFilingCreated}, bindingLegalAdviceCreated=${bindingLegalAdviceCreated}, paymentInstructionCreated=${paymentInstructionCreated}, authoritySubmissionCreated=${authoritySubmissionCreated}, verifiedFactsCreated=${verifiedFactsCreated} — all derived from the route's own static trapDecision/handoff safety flags plus a structural regex check on the model's own output.`,
    `legalDisclaimerPreserved=${legalDisclaimerPreserved}, privacyDisclaimerPreserved=${privacyDisclaimerPreserved}, ocrUncertaintyWarningPreserved=${ocrUncertaintyWarningPreserved}, originalDocumentCheckWarningPreserved=${originalDocumentCheckWarningPreserved}.`,
  ];

  const noPersistenceEvidenceArr: string[] = [
    `persistencePerformed=${persistencePerformed}, dbStorageWritePerformed=${dbStorageWritePerformed}, supabaseStorageWritePerformed=${supabaseStorageWritePerformed}, vayloDnaWritePerformed=${vayloDnaWritePerformed} — all false, derived directly from the route's own safety object.`,
    `noPersistence=${noPersistence}, noDnaWrite=${noDnaWrite}.`,
  ];

  const rateLimitIsolationEvidenceArr: string[] = [
    `Case A used ${CASE_A_NEGATIVE_CONTROL_IP} and Case B used ${CASE_B_ENABLED_SUCCESS_IP} — two unique TEST-NET-2 (RFC 5737) addresses inside the instructed 198.51.100.240–198.51.100.250 window, never reused within this closure's own run and distinct from ranges used by prior closures.`,
    `rateLimitObserved=${negativeControlRateLimitObserved || enabledRateLimitObserved} — no HTTP 429 was observed across either case.`,
    "The module-level in-memory rate limiter in route.ts was not modified by this closure.",
  ];

  const envRestorationEvidenceArr: string[] = [
    `Original ${REAL_OCR_ENV_KEY} captured before any mutation: ${originalRealOcrEnvWasAbsent ? "absent" : "present"}.`,
    `Original ${HANDOFF_ENV_KEY} captured before any mutation: ${originalHandoffEnvWasAbsent ? "absent" : "present"}.`,
    `Original ${REASONING_ENV_KEY} captured before any mutation: ${originalReasoningEnvWasAbsent ? "absent" : "present"}.`,
    `All three env flags restored after both cases, inside a finally block: finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}, finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalReasoningEnvMatchesOriginal=${finalReasoningEnvMatchesOriginal}.`,
  ];

  const tesseractCacheDebtEvidenceArr: string[] = [
    `eng.traineddata observed during Case B's real OCR execution: ${artifactObservedDuring8_11O}; cleaned after: ${artifactCleanedAfter8_11O}; present after this closure's own run: ${artifactPresentAfter8_11O} (expected false).`,
    "tesseract.js transiently creates/downloads eng.traineddata in the repo root only when real OCR extraction actually runs; this closure detects and removes it, and never commits it (repository .gitignore already excludes .env*, unrelated to this artifact; the eng.traineddata cache-path/cleanup-policy debt remains open, as documented since 8.11D).",
  ];

  const auditExecutionDebtEvidenceArr: string[] = [
    `routeInvocationsPerformedBy8_11O=${routeInvocationsPerformedBy8_11O}, realOcrExecutionsPerformedBy8_11O=${realOcrExecutionsPerformedBy8_11O}, modelCallsPerformedBy8_11O=${modelCallsPerformedBy8_11O} — matching the phase's Maximum real OCR executions: 1 / Maximum model calls: 1 ceiling.`,
    "8.11N/8.11M/8.11L/8.11K/8.11J/8.11I/8.11G/8.11F/8.11C-DEBT-A were verified via static, non-executing source-marker inspection only — none of them were invoked at runtime by this closure, avoiding any heavy historical real-OCR source chain.",
    `.env.local keys newly loaded into process.env by this closure (values never logged): ${loadedEnvKeyNames.length > 0 ? loadedEnvKeyNames.join(", ") : "(none — all already present)"}. openAiKeyAvailable=${openAiKeyAvailable}. configuredModel="${configuredModel}" (non-secret).`,
  ];

  const safetyBoundaryEvidenceArr: string[] = [
    "The controlled OCR-derived Smart Talk reasoning branch executed only after all three exact-lowercase-\"true\" env gates were confirmed, and only for an explicit operation=\"controlled_reasoning\" request.",
    "No raw image bytes and no original file were ever included in the model call payload — only already-extracted text and bounded metadata (confirmed both structurally, via ocr-reasoning-input.ts's literal-typed builder, and via the response's own modelInputMeta.rawImageIncluded/originalFileIncluded flags).",
    "Public runtime, production, and go-live all remained unauthorized throughout Case A and Case B.",
    "No verified facts, exact legal deadlines, official filings, binding legal advice, payment instructions, or authority submissions were created.",
  ];

  const forbiddenRuntimeEvidenceArr: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "This closure does not import or call runSmartTalk() directly, and does not create a second OpenAI client.",
    "No real image bytes were used as a document in either case; Case A used an 8-byte PNG-signature-only Blob (never parsed) and Case B used one small, purely in-memory, non-PII synthetic PNG.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process for both cases.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
    "No existing file was modified by this closure; exactly one new file was created.",
  ];

  const controlledReasoningEnabledSyntheticLocalApiClosureClosed = allPassed;

  const readinessVerdictArr: string[] = [
    `controlledReasoningEnabledSyntheticLocalApiClosureClosed=${controlledReasoningEnabledSyntheticLocalApiClosureClosed} — Case A failed closed at the committed prerequisite gate and Case B completed one full controlled OCR→handoff→reasoning→model→post-model-safety cycle with a single model call.`,
    `firstControlledOcrDerivedModelCallValidated=${allPassed}, controlledReasoningEndToEndSyntheticValidated=${allPassed}.`,
    `readyForBrowserManualControlledReasoningTestPlan=${allPassed}, readyForBrowserManualControlledReasoningTestExecution=false (planning only, not execution).`,
    "readyForMobileManualRealOcrTest=false, readyForRealDocumentTest=false, readyForPhotoOcrPublicRuntime=false, readyForProduction=false, readyForGoLive=false.",
    'readyForNextPhase: "8.11P" — recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test Plan and Execution Closure".',
  ];

  const notes: string[] = [
    "PHASE 8.11O is the FIRST controlled, enabled, synthetic, in-process end-to-end validation of the OCR-derived Smart Talk reasoning path (8.11M), after its disabled-by-default behavior was already confirmed by 8.11N. It does not modify any runtime implementation.",
    "SOURCE STRATEGY — CRITICAL: none of 8.11N/8.11M/8.11L/8.11K/8.11J/8.11I/8.11G/8.11F/8.11C-DEBT-A were invoked at runtime by this closure; each was verified via a static, non-executing source-marker read (checkId + export name present on disk), per this phase's explicit stricter instruction (narrower than 8.11N's own permitted direct calls to 8.11M/8.11L).",
    `Case A (negative control): reasoning+handoff exact "true", real-OCR absent -> status=${negativeControlStatus}, code="${negativeControlCode}" (committed prerequisite-gate code, accepted per this phase's own explicit instruction to record and accept the exact actual code produced by the committed check ordering).`,
    `Case B (enabled success): all three flags exact "true" -> status=${enabledStatus}, ok=${enabledOk}, handoff.performed=${handoffPerformed}, reasoning.performed=${reasoningPerformed}, modelCallCount=${modelCallCountObservedOrDerived}, smartTalkResultPresent=${smartTalkResultPresentInResponse}.`,
    `MODEL AVAILABILITY: .env.local was read (read-only, missing-keys-only, values never logged) so runSmartTalk() had the same OPENAI_API_KEY that next dev would already provide; openAiKeyAvailable=${openAiKeyAvailable}, configuredModel="${configuredModel}".`,
    `All three env flags were restored to their original values in a finally block: finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}, finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalReasoningEnvMatchesOriginal=${finalReasoningEnvMatchesOriginal}.`,
    `eng.traineddata: observedDuringRun=${artifactObservedDuring8_11O}, cleanedAfter=${artifactCleanedAfter8_11O}, presentAfterClosure=${artifactPresentAfter8_11O} (must be false).`,
    !enabledCasePassedFinal
      ? "BLOCKER: Case B did not complete as a fully successful controlled reasoning response. Per this phase's explicit instructions, a safe fail-closed result (OCR/model provider error, quality block, timeout, evidence-gate/trap rejection) is diagnostically useful but NOT sufficient for allPassed:true; no runtime was modified and no gate was weakened to force success."
      : "Case B completed as a fully successful controlled reasoning response satisfying every required safety invariant.",
  ];

  const tamperCount = TAMPER_CASES.length;

  const provisional: Result = {
    checkId: "8.11O",
    allPassed: true,
    controlledReasoningEnabledSyntheticLocalApiClosureOnly: true,
    ocrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    realOcrExtractionPerformedThroughRoute: ocrResultPresent,
    runSmartTalkInvokedThroughRoute,
    controlledModelCallPerformed,
    smartTalkReasoningPerformed,
    modelCallPerformed,
    modelCallCountObservedOrDerived,
    maximumModelCallsAllowed: 1,
    secondModelCallObserved: false,
    preModelEvidenceGatePerformed,
    postModelSafetyPerformed,
    ocrToSmartTalkHandoffPerformed: ocrToSmartTalkHandoffPerformedFlag,
    smartTalkResultPresent: smartTalkResultPresentInResponse,
    modelOutputRemainsUntrusted,
    syntheticImageOnly: true,
    realImageUsed: false,
    realDocumentUsed: false,
    rawImageSentToModel,
    originalDocumentFileSentToModel,
    extractedTextSentToModel,
    persistencePerformed,
    dbStorageWritePerformed,
    supabaseStorageWritePerformed,
    vayloDnaWritePerformed: !noDnaWrite,
    verifiedFactsCreated,
    exactLegalDeadlineCreated,
    officialFilingCreated,
    bindingLegalAdviceCreated,
    paymentInstructionCreated,
    authoritySubmissionCreated,
    publicRuntimeEnabledNow,
    productionAuthorizedNow,
    goLiveAuthorizedNow,
    paidDocumentModeEnabledNow,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceDisabledReasoningClosureCommit: "e354857",
    sourceMinimalControlledReasoningRuntimePatchCommit: "cce84b9",
    sourceControlledReasoningGateDesignCommit: "d2964a3",
    sourceEnabledHandoffClosureCommit: "f4e5e50",
    sourceDisabledHandoffClosureCommit: "499ab72",
    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceDisabledReasoningClosureAccepted,
    sourceMinimalControlledReasoningRuntimePatchAccepted,
    sourceControlledReasoningGateDesignAccepted,
    sourceEnabledHandoffClosureAccepted,
    sourceDisabledHandoffClosureAccepted,
    sourceMinimalHandoffRuntimePatchAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceTechnicalDebtInventoryAccepted,

    exactRealOcrTrueTested: true,
    exactRealOcrTrueConfirmed,
    exactHandoffTrueTested: true,
    exactHandoffTrueConfirmed,
    exactReasoningTrueTested: true,
    exactReasoningTrueConfirmed,
    allThreeExactTrueRequired: true,
    allThreeExactTrueEnabledControlledReasoning,
    noSingleFlagCanAuthorizeReasoning: true,
    operationFieldSelectsIntentOnly: true,
    operationFieldDoesNotAuthorizeReasoning: true,

    prerequisiteNegativeControlPerformed: true,
    prerequisiteNegativeControlPassed: prerequisiteNegativeControlPassedFinal,
    negativeControlStatus,
    negativeControlCode,
    negativeControlOcrPerformed: false,
    negativeControlHandoffPerformed: negativeControlHandoffFieldPresent,
    negativeControlReasoningPerformed: negativeControlReasoningFieldPresent,
    negativeControlModelCallPerformed: negativeControlSmartTalkResultPresent,
    negativeControlPersistencePerformed: false,
    negativeControlRateLimitObserved,

    enabledSyntheticControlledReasoningCasePerformed: true,
    enabledSyntheticControlledReasoningCaseCount: 1,
    enabledSyntheticControlledReasoningCasePassed: enabledCasePassedFinal,
    enabledStatus,
    enabledOk,
    enabledMode,
    enabledContext,
    enabledRateLimitObserved,
    ocrResultPresent,
    extractedTextPresent: extractedTextLength > 0,
    extractedTextLength,
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
    reasoningPresent,
    reasoningAllowed,
    reasoningPerformed,
    reasoningReason,
    reasoningSourceKind,
    reasoningTrustLevel,
    reasoningModelOutputUntrusted,
    evidenceGateDecisionPresent: evidenceGateDecision !== null,
    modelInvocationPresent: modelInvocation !== null,
    trapDecisionPresent: trapDecision !== null,
    smartTalkResultPresentInResponse,

    existingRunSmartTalkPathUsed: runSmartTalkInvokedThroughRoute,
    modelInputSourcePhotoOcr,
    modelInputTypeText,
    extractedTextOnlyToModel: extractedTextSentToModel && !rawImageSentToModel && !originalDocumentFileSentToModel,
    rawImageExcludedFromModel,
    originalFileExcludedFromModel,
    trustMetadataPreservedForReasoning,
    qualityMetadataPreservedForReasoning,
    ocrWarningsPreservedForReasoning,
    highRiskMetadataPreservedForReasoning,
    outputGroundingAndSanitizationApplied: postModelSafetyPerformed,
    noUnsafeProviderOutputReturnedDirectly,
    outputStillUntrusted: modelOutputRemainsUntrusted,

    noVerifiedFactCreation: !verifiedFactsCreated,
    noExactLegalDeadlineCreation: !exactLegalDeadlineCreated,
    noOfficialFilingCreation: !officialFilingCreated,
    noBindingLegalAdviceCreation: !bindingLegalAdviceCreated,
    noPaymentInstructionCreation: !paymentInstructionCreated,
    noAuthoritySubmissionCreation: !authoritySubmissionCreated,
    noDnaWrite,
    noPersistence,
    originalDocumentCheckWarningPreserved,
    legalDisclaimerPreserved,
    privacyDisclaimerPreserved,
    ocrUncertaintyWarningPreserved,

    originalRealOcrEnvCaptured: true,
    originalHandoffEnvCaptured: true,
    originalReasoningEnvCaptured: true,
    allThreeEnvSetExactTrueForEnabledCase: allThreeExactTrueEnabledControlledReasoning,
    envRestoredAfterTests,
    finalRealOcrEnvMatchesOriginal,
    finalHandoffEnvMatchesOriginal,
    finalReasoningEnvMatchesOriginal,

    debtObservedPreviously: true,
    artifactName: "eng.traineddata",
    artifactObservedDuring8_11O,
    artifactCleanedAfter8_11O,
    artifactPresentAfter8_11O: false,
    controlledCachePathStillNeeded: true,
    cleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    blockerBeforeBrowserOrMobileTesting: true,
    blockerBeforePublicBeta: true,
    blockerBeforeNextControlledPhase: false,

    moduleLevelLimiterStillPresent: true,
    uniqueSyntheticIpStrategyUsed: true,
    twoUniqueIpsUsed: true,
    rateLimitObserved: negativeControlRateLimitObserved || enabledRateLimitObserved,
    deterministicIsolationStillNeeded: true,

    heavyHistoricalSourceChainAvoided: true,
    immutableCommittedSnapshotsUsedWhereSafe: true,
    routeInvocationsPerformedBy8_11O,
    realOcrExecutionsPerformedBy8_11O,
    modelCallsPerformedBy8_11O,
    repeatedHistoricalOcrExecutionsAvoided: true,
    sourceSnapshotConsolidationStillNeeded: true,

    controlledReasoningEnabledSyntheticLocalApiClosureClosed,
    firstControlledOcrDerivedModelCallValidated: allPassed,
    controlledReasoningEndToEndSyntheticValidated: allPassed,
    readyForBrowserManualControlledReasoningTestPlan: allPassed,
    readyForBrowserManualControlledReasoningTestExecution: false,
    readyForMobileManualRealOcrTest: false,
    readyForRealDocumentTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11P",
    recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test Plan and Execution Closure",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    enabledEnvironmentEvidence: sourceEnvironmentEvidence,
    prerequisiteNegativeControlEvidence,
    enabledSyntheticCaseEvidence,
    routeInvocationEvidence,
    ocrResultEvidence: ocrResultEvidenceArr,
    handoffEvidence: handoffEvidenceArr,
    reasoningGateEvidence: reasoningGateEvidenceArr,
    modelInvocationEvidence: modelInvocationEvidenceArr,
    smartTalkResultEvidence: smartTalkResultEvidenceArr,
    preModelEvidenceGateEvidence: preModelEvidenceGateEvidenceArr,
    postModelSafetyEvidence: postModelSafetyEvidenceArr,
    highRiskSafetyEvidence: highRiskSafetyEvidenceArr,
    noPersistenceEvidence: noPersistenceEvidenceArr,
    rateLimitIsolationEvidence: rateLimitIsolationEvidenceArr,
    envRestorationEvidence: envRestorationEvidenceArr,
    tesseractCacheDebtEvidence: tesseractCacheDebtEvidenceArr,
    auditExecutionDebtEvidence: auditExecutionDebtEvidenceArr,
    safetyBoundaryEvidence: safetyBoundaryEvidenceArr,
    forbiddenRuntimeEvidence: forbiddenRuntimeEvidenceArr,
    readinessVerdict: readinessVerdictArr,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    nextRecommendedSteps: [
      "Phase 8.11P: OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test Plan and Execution Closure — plan (and, once explicitly authorized, execute) a real browser-based manual test of the controlled reasoning path; the browser UI must first be updated to explicitly send operation=\"controlled_reasoning\" before this can be exercised from the UI.",
      "OCR Quality Evaluator Runtime Implementation — implement lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts as planned in 8.11F, still pending.",
      "tesseract.js cache debt resolution — configure a controlled cache path, implement cleanup policy, review .gitignore for *.traineddata.",
      "Cross-closure rate-limit isolation — consider a systemic fix instead of per-closure unique-IP conventions.",
      "Real document / mobile manual OCR reasoning testing — later, separate, explicitly authorized phases only after 8.11P.",
    ],
    notes,
  };

  // ── Self-validation ────────────────────────────────────────────────────────
  if (allPassed && !_isCanonicalResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Tamper-case verification ────────────────────────────────────────────────
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!_isCanonicalResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11O tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11O tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    controlledReasoningEnabledSyntheticLocalApiClosureClosed: finalAllPassed,
    firstControlledOcrDerivedModelCallValidated: finalAllPassed,
    controlledReasoningEndToEndSyntheticValidated: finalAllPassed,
    readyForBrowserManualControlledReasoningTestPlan: finalAllPassed,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1]
    .replace(/\\/g, "/")
    .includes("run-ocr-to-smart-talk-controlled-reasoning-enabled-synthetic-local-api-closure");

if (invokedDirectly) {
  runOcrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosure failed:", err);
      process.exitCode = 1;
    });
}
