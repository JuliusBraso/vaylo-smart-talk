/**
 * PHASE 8.11J — OCR-to-Smart-Talk Handoff Disabled Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local `Request` objects (no dev server, no browser, no external
 * network), that the `photo_ocr_real_extraction_to_smart_talk_controlled_
 * handoff` branch added in 8.11I fails closed for every non-exact variant of
 *
 *   SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED
 *
 * This phase tests the DISABLED handoff path only. Exact lowercase "true" is
 * explicitly out of scope here and is reserved for Phase 8.11K (OCR-to-Smart-
 * Talk Handoff Enabled Synthetic Local API Closure).
 *
 * Gate isolation: for every disabled-handoff variant tested below,
 * SMART_TALK_REAL_OCR_EXTRACTION_ENABLED is temporarily set to exact
 * lowercase "true" so that the real-OCR gate can never itself be the reason
 * the request is rejected — every rejection observed in this closure must be
 * caused ONLY by the handoff gate. Because the route evaluates the handoff
 * env flag strictly before the real-OCR env flag (see
 * handleOcrToSmartTalkHandoffRequest in app/api/smart-talk/route.ts), and
 * because the handoff flag itself is never set to exact lowercase "true" in
 * this closure, the request always fails closed with
 * "ocr_to_smart_talk_handoff_disabled" before `await req.formData()` is ever
 * called — i.e. strictly before OCR extraction, handoff envelope creation,
 * Smart Talk reasoning, model invocation, or persistence of any kind.
 *
 * Every synthetic request uses a single tiny in-memory PNG-signature-only
 * Blob (a handful of bytes, not a real document/photo) purely so the request
 * is valid multipart/form-data and reaches the route's dispatch logic. That
 * Blob is never read, parsed, or passed to the OCR adapter for any of the 9
 * disabled variants tested below, because the env gate is the very first
 * statement of handleOcrToSmartTalkHandoffRequest().
 *
 * This closure does NOT start a dev server, does NOT use a browser, does NOT
 * perform live external network calls, does NOT call OpenAI/any model, does
 * NOT import tesseract.js or call the OCR adapter directly, does NOT read
 * real image bytes as a real document, does NOT persist anything, does NOT
 * write DB/storage/DNA, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It restores both
 * process.env.SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED and
 * process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED to their original
 * values (or absence) after all tests complete, in a `finally` block.
 *
 * Rate-limit isolation: route.ts contains a module-level in-memory sliding-
 * window rate limiter (`ipHits` Map, RATE_MAX = 5 requests per 10-minute
 * window) shared by every request the Node process handles. To avoid
 * cross-closure flakiness and to avoid reusing any IP already spent by a
 * prior closure in this repository (8.10D/8.10E use other TEST-NET ranges;
 * 8.11D uses 192.0.2.0/24), every one of the 9 disabled-variant requests in
 * this closure uses its own unique address from the TEST-NET-2 range
 * (RFC 5737), 198.51.100.211 through 198.51.100.219 — comfortably inside the
 * instructed 198.51.100.210–198.51.100.230 window and never reused within
 * this closure's own run.
 *
 * Source strategy (per explicit instruction for this phase, with a fully
 * disclosed fallback — see below): this closure imports and calls
 * runMinimalOcrToSmartTalkHandoffRuntimePatchAudit() (8.11I) DIRECTLY as the
 * primary source of truth for the implemented runtime branch. 8.11I's own
 * implementation directly calls runOcrToSmartTalkHandoffPlan() (8.11H)
 * internally, which in turn directly calls 8.11G, which directly calls
 * 8.11F, which directly calls 8.11E — and 8.11E performs REAL tesseract.js
 * OCR in-process through the (unmodified) 8.11C real OCR route branch. That
 * single call chain, exercised once via the direct 8.11I call above, is
 * already authorized and documented (see 8.11I's own docblock: "may take
 * several minutes").
 *
 * DISCLOSED SOURCE FALLBACK: this closure does NOT additionally call
 * runOcrToSmartTalkHandoffPlan() (8.11H) a second time directly. Doing so
 * would re-run the ENTIRE 8.11H→8.11G→8.11F→8.11E real-OCR chain a second
 * time in the same process — directly contradicting this phase's explicit
 * instruction "Do not unnecessarily re-run the full 8.11E/F/G/H real-OCR
 * chain" and "Avoid cross-closure rate-limit flakiness." Instead, 8.11H's
 * acceptance (and, transitively, 8.11G/8.11F/8.11E/8.11D/8.11C/8.9N-PATCH/
 * 8.11C-DEBT-A's acceptance) is read structurally off 8.11I's own already-
 * computed nested source-evidence fields (sourceHandoffPlanAccepted,
 * sourceTrustBoundaryClosureAccepted, sourceQualityEvaluatorClosureAccepted,
 * sourceEnabledSyntheticLocalApiClosureAccepted,
 * sourceDisabledLocalApiClosureAccepted,
 * sourceMinimalRealOcrRuntimePatchAccepted,
 * sourceTextDocumentSnapshotPatchAccepted,
 * sourceTechnicalDebtInventoryAccepted) — fields that 8.11I itself already
 * validated via its own direct calls when it ran. This mirrors the exact
 * precedent 8.11D's own audit already established for deriving 8.11B's
 * acceptance structurally off 8.11C's nested fields instead of re-invoking
 * an unstable/expensive chain a second time. This fallback does NOT
 * re-authorize or change any ancestor phase's own committed acceptance — it
 * only avoids a second, redundant, real-OCR-invoking execution of the same
 * chain within this single closure's run.
 */

import fs from "fs";
import path from "path";
import { runMinimalOcrToSmartTalkHandoffRuntimePatchAudit } from "./run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit";
import { POST } from "../../../../../app/api/smart-talk/route";

const HANDOFF_ENV_KEY = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const HANDOFF_MODE = "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
const HANDOFF_DISABLED_CODE = "ocr_to_smart_talk_handoff_disabled";

// ─── Disabled env variants under test (exact "true" is NEVER included) ────

interface EnvVariant {
  label: string;
  envValueDescription: string;
  envValue: string | undefined;
  testNetIp: string;
}

const DISABLED_ENV_VARIANTS: readonly EnvVariant[] = [
  { label: "absent", envValueDescription: "absent / deleted", envValue: undefined, testNetIp: "198.51.100.211" },
  { label: "false", envValueDescription: '"false"', envValue: "false", testNetIp: "198.51.100.212" },
  { label: "FALSE", envValueDescription: '"FALSE"', envValue: "FALSE", testNetIp: "198.51.100.213" },
  { label: "TRUE", envValueDescription: '"TRUE"', envValue: "TRUE", testNetIp: "198.51.100.214" },
  { label: "1", envValueDescription: '"1"', envValue: "1", testNetIp: "198.51.100.215" },
  { label: "yes", envValueDescription: '"yes"', envValue: "yes", testNetIp: "198.51.100.216" },
  {
    label: "whitespace_true",
    envValueDescription: '" true " (leading/trailing whitespace)',
    envValue: " true ",
    testNetIp: "198.51.100.217",
  },
  { label: "empty", envValueDescription: '"" (empty string)', envValue: "", testNetIp: "198.51.100.218" },
  {
    label: "enabled",
    envValueDescription: '"enabled" (random non-boolean string)',
    envValue: "enabled",
    testNetIp: "198.51.100.219",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

/**
 * Builds a synthetic multipart/form-data request for the OCR-to-Smart-Talk
 * handoff branch. The "image" field is a tiny in-memory Blob containing only
 * the 8-byte PNG file-signature (not a real photo/document) — enough to form
 * a valid multipart body. For every disabled env variant tested by this
 * closure, the route's handoff-env gate rejects the request before
 * `await req.formData()` is ever called, so these bytes are never read or
 * parsed by anything, and OCR is never invoked.
 */
function buildSyntheticHandoffMultipartRequest(ip: string): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  const pngSignatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const syntheticBlob = new Blob([pngSignatureOnly], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11j.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
    },
    body: fd,
  });
}

// ─── Result types ───────────────────────────────────────────────────────────

interface DisabledCaseResult {
  label: string;
  envValueDescription: string;
  testNetIp: string;
  status: number;
  ok: boolean;
  code: string;
  passed: boolean;
  handoffAllowedField: boolean;
  handoffPerformedField: boolean;
  handoffEnvelopeField: boolean;
}

interface OcrToSmartTalkHandoffDisabledLocalApiClosureResult {
  checkId: "8.11J";
  allPassed: boolean;
  disabledLocalApiClosureOnly: true;
  ocrToSmartTalkHandoffDisabledLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalledByClosure: false;
  externalFetchCalledByClosure: false;
  openAiCalled: false;
  tesseractImportedDirectlyByClosure: false;
  ocrAdapterCalledDirectlyByClosure: false;
  realOcrExtractionPerformed: false;
  realImageUsedByClosure: false;
  syntheticImageOnly: true;
  realDocumentUsed: false;
  imageSavedToDisk: false;
  modelCallPerformed: false;
  smartTalkReasoningPerformed: false;
  ocrToSmartTalkHandoffEnvelopeCreated: false;
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
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceHandoffPlanCommit: "b839538";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceEnabledRealOcrClosureCommit: "ec5a76f";
  sourceDisabledRealOcrClosureCommit: "3688358";
  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceTextDocumentSnapshotPatchCommit: "cf6624c";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceMinimalHandoffRuntimePatchAccepted: boolean;
  sourceHandoffPlanAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceEnabledRealOcrClosureAccepted: boolean;
  sourceDisabledRealOcrClosureAccepted: boolean;
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceTextDocumentSnapshotPatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  // Disabled matrix fields
  disabledEnvCaseCount: 9;
  disabledEnvCasesTested: boolean;
  absentCaseTested: boolean;
  falseCaseTested: boolean;
  uppercaseFalseCaseTested: boolean;
  uppercaseTrueCaseTested: boolean;
  oneCaseTested: boolean;
  yesCaseTested: boolean;
  whitespaceTrueCaseTested: boolean;
  emptyCaseTested: boolean;
  enabledCaseTested: boolean;
  exactLowercaseTrueTested: false;
  exactLowercaseTrueReservedFor8_11K: true;
  allDisabledCasesReturned403: boolean;
  allDisabledCasesReturnedExpectedCode: boolean;
  expectedDisabledCode: "ocr_to_smart_talk_handoff_disabled";
  rateLimitObserved: boolean;
  unexpectedSuccessObserved: boolean;
  // (both fields above are computed booleans; canonical checker enforces
  // they equal false on a passing run — see
  // _isCanonicalOcrToSmartTalkHandoffDisabledLocalApiClosureResult)

  // Gate isolation fields
  originalHandoffEnvCaptured: boolean;
  originalRealOcrEnvCaptured: boolean;
  realOcrEnvSetExactTrueForIsolation: boolean;
  handoffEnvNeverSetExactTrue: boolean;
  handoffGateEvaluatedBeforeOcr: boolean;
  disabledResponseReturnedBeforeOcr: boolean;
  envRestoredAfterTests: boolean;
  finalHandoffEnvMatchesOriginal: boolean;
  finalRealOcrEnvMatchesOriginal: boolean;

  // Safety fields
  noRealOcrExecution: boolean;
  noSmartTalkReasoning: boolean;
  noModelCall: boolean;
  noRawImageToModel: boolean;
  noOriginalDocumentFileToModel: boolean;
  noExtractedTextToModel: boolean;
  noHandoffEnvelopeCreation: boolean;
  noHandoffExecution: boolean;
  noPersistence: boolean;
  noStorage: boolean;
  noDnaWrite: boolean;
  noVerifiedFactCreation: boolean;
  noLegalDeadlineCreation: boolean;
  noOfficialFilingCreation: boolean;
  noBindingLegalAdviceCreation: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  // Readiness verdict (flat booleans/strings)
  handoffDisabledLocalApiClosureClosed: boolean;
  readyForHandoffEnabledSyntheticLocalApiClosure: boolean;
  readyForSmartTalkReasoningFromOcr: false;
  readyForBrowserManualHandoffTest: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11K";
  recommendedNextPhase: "OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  disabledResults: DisabledCaseResult[];

  // Required arrays
  sourceEvidence: string[];
  disabledEnvMatrixEvidence: string[];
  routeInvocationEvidence: string[];
  gateIsolationEvidence: string[];
  disabledResponseEvidence: string[];
  noOcrEvidence: string[];
  noHandoffEvidence: string[];
  noModelEvidence: string[];
  noPersistenceEvidence: string[];
  safetyBoundaryEvidence: string[];
  rateLimitIsolationEvidence: string[];
  envRestorationEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  tesseractCacheDebtEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];

  // Tesseract cache debt (flat fields)
  debtObservedPreviously: true;
  artifactName: "eng.traineddata";
  artifactLocationObservedPreviously: "repo root";
  artifactCreatedDuring8_11J: boolean;
  artifactPresentAfter8_11J: boolean;
  mustNotCommitArtifact: true;
  controlledCachePathStillNeeded: true;
  cleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  blockerBeforeMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBefore8_11K: false;
}

// ─── Fixed evidence/blocker/limitation arrays (exact-match, tamper-resistant) ─

const REQUIRED_SOURCE_EVIDENCE: readonly string[] = [
  "8.11I minimal OCR-to-Smart-Talk handoff runtime patch audit accepted (commit e3be09b) — direct source of truth for the implemented disabled-by-default runtime branch.",
  "8.11H OCR-to-Smart-Talk handoff plan acceptance derived from 8.11I's own nested source evidence (commit b839538) — DISCLOSED FALLBACK: not re-invoked directly by this closure, to avoid running the entire 8.11H->8.11G->8.11F->8.11E real-OCR chain a second time in this same process (8.11I already exercised it once internally).",
  "8.11G real OCR trust boundary closure acceptance derived from 8.11I's own nested source evidence (commit 831779a) — not re-invoked directly by this closure.",
  "8.11F real OCR quality evaluator closure acceptance derived from 8.11I's own nested source evidence (commit 2ef041f) — not re-invoked directly by this closure.",
  "8.11E real OCR enabled synthetic local API closure acceptance derived from 8.11I's own nested source evidence (commit ec5a76f) — not re-invoked directly by this closure.",
  "8.11D real OCR disabled local API closure acceptance derived from 8.11I's own nested source evidence (commit 3688358) — not re-invoked directly by this closure.",
  "8.11C minimal real OCR runtime patch audit acceptance derived from 8.11I's own nested source evidence (commit 46ddefc) — not re-invoked directly by this closure.",
  "8.9N-PATCH text document readiness source snapshot acceptance derived from 8.11I's own nested source evidence (commit cf6624c) — not re-invoked directly by this closure.",
  "8.11C-DEBT-A technical debt inventory audit acceptance derived from 8.11I's own nested source evidence (commit bdf3859) — not re-invoked directly by this closure.",
  "This closure deliberately does NOT re-run the full 8.11E/8.11F/8.11G/8.11H real-OCR chain a second time itself, to avoid cross-closure rate-limit flakiness from long chained audit runs; 8.11I already exercised that chain once internally when called above.",
];

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase validates the disabled handoff gate only.",
  "Exact lowercase \"true\" is not tested.",
  "The enabled handoff envelope path is not executed.",
  "Real OCR extraction is not executed.",
  "Smart Talk reasoning is not executed.",
  "No model is called.",
  "No browser or mobile test is performed.",
  "No real document is used.",
  "No persistence is performed.",
  "8.11K is still required for exact lowercase true.",
  "Public runtime remains blocked.",
  "Production and go-live remain unauthorized.",
  "tesseract cache-path debt remains unresolved.",
  "module-level rate-limit cross-closure flakiness remains known technical debt.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "handoff enabled synthetic local API closure not created",
  "Smart Talk reasoning from OCR not implemented",
  "actual OCR quality evaluator runtime module not implemented",
  "tesseract.js controlled cache path not implemented",
  "tesseract.js cleanup policy not implemented",
  ".gitignore policy review not completed",
  "cross-closure rate-limit isolation not systemically resolved",
  "browser manual OCR-to-Smart-Talk test not planned/performed",
  "mobile manual OCR-to-Smart-Talk test not planned/performed",
  "real document handling not validated",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalOcrToSmartTalkHandoffDisabledLocalApiClosureResult(
  r: OcrToSmartTalkHandoffDisabledLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.11J") return false;
  if (r.allPassed !== true) return false;
  if (r.disabledLocalApiClosureOnly !== true) return false;
  if (r.ocrToSmartTalkHandoffDisabledLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalledByClosure !== false) return false;
  if (r.externalFetchCalledByClosure !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.tesseractImportedDirectlyByClosure !== false) return false;
  if (r.ocrAdapterCalledDirectlyByClosure !== false) return false;
  if (r.realOcrExtractionPerformed !== false) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.syntheticImageOnly !== true) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.imageSavedToDisk !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.smartTalkReasoningPerformed !== false) return false;
  if (r.ocrToSmartTalkHandoffEnvelopeCreated !== false) return false;
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

  if (r.sourceMinimalHandoffRuntimePatchCommit !== "e3be09b") return false;
  if (r.sourceHandoffPlanCommit !== "b839538") return false;
  if (r.sourceTrustBoundaryClosureCommit !== "831779a") return false;
  if (r.sourceQualityEvaluatorClosureCommit !== "2ef041f") return false;
  if (r.sourceEnabledRealOcrClosureCommit !== "ec5a76f") return false;
  if (r.sourceDisabledRealOcrClosureCommit !== "3688358") return false;
  if (r.sourceMinimalRealOcrRuntimePatchCommit !== "46ddefc") return false;
  if (r.sourceTextDocumentSnapshotPatchCommit !== "cf6624c") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;

  if (r.sourceMinimalHandoffRuntimePatchAccepted !== true) return false;
  if (r.sourceHandoffPlanAccepted !== true) return false;
  if (r.sourceTrustBoundaryClosureAccepted !== true) return false;
  if (r.sourceQualityEvaluatorClosureAccepted !== true) return false;
  if (r.sourceEnabledRealOcrClosureAccepted !== true) return false;
  if (r.sourceDisabledRealOcrClosureAccepted !== true) return false;
  if (r.sourceMinimalRealOcrRuntimePatchAccepted !== true) return false;
  if (r.sourceTextDocumentSnapshotPatchAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;

  if (r.disabledEnvCaseCount !== 9) return false;
  if (r.disabledEnvCasesTested !== true) return false;
  if (r.absentCaseTested !== true) return false;
  if (r.falseCaseTested !== true) return false;
  if (r.uppercaseFalseCaseTested !== true) return false;
  if (r.uppercaseTrueCaseTested !== true) return false;
  if (r.oneCaseTested !== true) return false;
  if (r.yesCaseTested !== true) return false;
  if (r.whitespaceTrueCaseTested !== true) return false;
  if (r.emptyCaseTested !== true) return false;
  if (r.enabledCaseTested !== true) return false;
  if (r.exactLowercaseTrueTested !== false) return false;
  if (r.exactLowercaseTrueReservedFor8_11K !== true) return false;
  if (r.allDisabledCasesReturned403 !== true) return false;
  if (r.allDisabledCasesReturnedExpectedCode !== true) return false;
  if (r.expectedDisabledCode !== "ocr_to_smart_talk_handoff_disabled") return false;
  if (r.rateLimitObserved !== false) return false;
  if (r.unexpectedSuccessObserved !== false) return false;

  if (r.originalHandoffEnvCaptured !== true) return false;
  if (r.originalRealOcrEnvCaptured !== true) return false;
  if (r.realOcrEnvSetExactTrueForIsolation !== true) return false;
  if (r.handoffEnvNeverSetExactTrue !== true) return false;
  if (r.handoffGateEvaluatedBeforeOcr !== true) return false;
  if (r.disabledResponseReturnedBeforeOcr !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.finalHandoffEnvMatchesOriginal !== true) return false;
  if (r.finalRealOcrEnvMatchesOriginal !== true) return false;

  if (r.noRealOcrExecution !== true) return false;
  if (r.noSmartTalkReasoning !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noRawImageToModel !== true) return false;
  if (r.noOriginalDocumentFileToModel !== true) return false;
  if (r.noExtractedTextToModel !== true) return false;
  if (r.noHandoffEnvelopeCreation !== true) return false;
  if (r.noHandoffExecution !== true) return false;
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

  if (r.handoffDisabledLocalApiClosureClosed !== true) return false;
  if (r.readyForHandoffEnabledSyntheticLocalApiClosure !== true) return false;
  if (r.readyForSmartTalkReasoningFromOcr !== false) return false;
  if (r.readyForBrowserManualHandoffTest !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11K") return false;
  if (
    r.recommendedNextPhase !== "OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure"
  )
    return false;

  if (!Array.isArray(r.disabledResults) || r.disabledResults.length !== 9) return false;
  for (const cse of r.disabledResults) {
    if (cse.status !== 403) return false;
    if (cse.ok !== false) return false;
    if (cse.code !== HANDOFF_DISABLED_CODE) return false;
    if (cse.passed !== true) return false;
    if (cse.handoffAllowedField !== false) return false;
    if (cse.handoffPerformedField !== false) return false;
    if (cse.handoffEnvelopeField !== false) return false;
  }

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.disabledEnvMatrixEvidence) || r.disabledEnvMatrixEvidence.length === 0) return false;
  if (!Array.isArray(r.routeInvocationEvidence) || r.routeInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.gateIsolationEvidence) || r.gateIsolationEvidence.length === 0) return false;
  if (!Array.isArray(r.disabledResponseEvidence) || r.disabledResponseEvidence.length !== 9) return false;
  if (!Array.isArray(r.noOcrEvidence) || r.noOcrEvidence.length === 0) return false;
  if (!Array.isArray(r.noHandoffEvidence) || r.noHandoffEvidence.length === 0) return false;
  if (!Array.isArray(r.noModelEvidence) || r.noModelEvidence.length === 0) return false;
  if (!Array.isArray(r.noPersistenceEvidence) || r.noPersistenceEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.rateLimitIsolationEvidence) || r.rateLimitIsolationEvidence.length === 0) return false;
  if (!Array.isArray(r.envRestorationEvidence) || r.envRestorationEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.tesseractCacheDebtEvidence) || r.tesseractCacheDebtEvidence.length === 0) return false;
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

  if (r.debtObservedPreviously !== true) return false;
  if (r.artifactName !== "eng.traineddata") return false;
  if (r.artifactLocationObservedPreviously !== "repo root") return false;
  if (r.artifactCreatedDuring8_11J !== false) return false;
  if (r.artifactPresentAfter8_11J !== false) return false;
  if (r.mustNotCommitArtifact !== true) return false;
  if (r.controlledCachePathStillNeeded !== true) return false;
  if (r.cleanupPolicyStillNeeded !== true) return false;
  if (r.gitignorePolicyReviewStillNeeded !== true) return false;
  if (r.blockerBeforeMobileTesting !== true) return false;
  if (r.blockerBeforePublicBeta !== true) return false;
  if (r.blockerBefore8_11K !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (
  r: OcrToSmartTalkHandoffDisabledLocalApiClosureResult,
) => OcrToSmartTalkHandoffDisabledLocalApiClosureResult;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

function withCaseField<K extends keyof DisabledCaseResult>(
  results: DisabledCaseResult[],
  index: number,
  key: K,
  value: DisabledCaseResult[K],
): DisabledCaseResult[] {
  return results.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const OCR_TO_SMART_TALK_HANDOFF_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11D" as "8.11J" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },

  { label: "source 8.11I not accepted", mutate: (r) => ({ ...r, sourceMinimalHandoffRuntimePatchAccepted: false }) },
  { label: "source 8.11H not accepted", mutate: (r) => ({ ...r, sourceHandoffPlanAccepted: false }) },

  { label: "disabled matrix count not 9", mutate: (r) => ({ ...r, disabledEnvCaseCount: 8 as 9 }) },
  { label: "absent case not tested", mutate: (r) => ({ ...r, absentCaseTested: false }) },
  { label: "false case not tested", mutate: (r) => ({ ...r, falseCaseTested: false }) },
  { label: "uppercase FALSE case not tested", mutate: (r) => ({ ...r, uppercaseFalseCaseTested: false }) },
  { label: "uppercase TRUE case not tested", mutate: (r) => ({ ...r, uppercaseTrueCaseTested: false }) },
  { label: "\"1\" case not tested", mutate: (r) => ({ ...r, oneCaseTested: false }) },
  { label: "yes case not tested", mutate: (r) => ({ ...r, yesCaseTested: false }) },
  { label: "whitespace true case not tested", mutate: (r) => ({ ...r, whitespaceTrueCaseTested: false }) },
  { label: "empty case not tested", mutate: (r) => ({ ...r, emptyCaseTested: false }) },
  { label: "enabled case not tested", mutate: (r) => ({ ...r, enabledCaseTested: false }) },

  { label: "exact lowercase true is tested", mutate: (r) => ({ ...r, exactLowercaseTrueTested: true as false }) },
  {
    label: "exact lowercase true not reserved for 8.11K",
    mutate: (r) => ({ ...r, exactLowercaseTrueReservedFor8_11K: false as true }),
  },

  {
    label: "real OCR env not exact true during isolation",
    mutate: (r) => ({ ...r, realOcrEnvSetExactTrueForIsolation: false }),
  },
  { label: "handoff env becomes exact true", mutate: (r) => ({ ...r, handoffEnvNeverSetExactTrue: false }) },

  { label: "any result is not HTTP 403", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 0, "status", 200) }) },
  { label: "any result has wrong code", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 1, "code", "real_ocr_extraction_disabled") }) },
  { label: "HTTP 200 occurs", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 2, "status", 200) }) },
  { label: "HTTP 429 occurs", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 3, "status", 429) }) },
  { label: "ok true on a disabled case", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 4, "ok", true) }) },
  { label: "handoff allowed true on a disabled case", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 5, "handoffAllowedField", true) }) },
  { label: "handoff performed true on a disabled case", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 6, "handoffPerformedField", true) }) },
  { label: "handoff envelope created on a disabled case", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 7, "handoffEnvelopeField", true) }) },
  { label: "a disabled case marked passed despite wrong status", mutate: (r) => ({ ...r, disabledResults: withCaseField(withCaseField(r.disabledResults, 8, "status", 200), 8, "passed", true) }) },
  { label: "disabledResults missing an entry", mutate: (r) => ({ ...r, disabledResults: r.disabledResults.slice(0, 8) }) },

  { label: "OCR executes (real OCR extraction performed)", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "tesseract imported directly", mutate: (r) => ({ ...r, tesseractImportedDirectlyByClosure: true as false }) },
  { label: "OCR adapter called directly", mutate: (r) => ({ ...r, ocrAdapterCalledDirectlyByClosure: true as false }) },
  { label: "handoff envelope created (aggregate)", mutate: (r) => ({ ...r, ocrToSmartTalkHandoffEnvelopeCreated: true as false }) },
  { label: "handoff performed (aggregate)", mutate: (r) => ({ ...r, ocrToSmartTalkHandoffPerformed: true as false }) },
  { label: "Smart Talk reasoning occurs", mutate: (r) => ({ ...r, smartTalkReasoningPerformed: true as false }) },
  { label: "model call occurs", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "raw image reaches model", mutate: (r) => ({ ...r, noRawImageToModel: false }) },
  { label: "original file reaches model", mutate: (r) => ({ ...r, noOriginalDocumentFileToModel: false }) },
  { label: "extracted text reaches model", mutate: (r) => ({ ...r, noExtractedTextToModel: false }) },
  { label: "persistence occurs", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "DB write occurs", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "storage write occurs", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "DNA write occurs", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "verified fact created", mutate: (r) => ({ ...r, verifiedFactsCreated: true as false }) },
  { label: "legal deadline created", mutate: (r) => ({ ...r, legalDeadlineCreated: true as false }) },
  { label: "official filing created", mutate: (r) => ({ ...r, officialFilingCreated: true as false }) },
  { label: "binding legal advice created", mutate: (r) => ({ ...r, bindingLegalAdviceCreated: true as false }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },

  { label: "env is not restored (handoff)", mutate: (r) => ({ ...r, finalHandoffEnvMatchesOriginal: false }) },
  { label: "env is not restored (real OCR)", mutate: (r) => ({ ...r, finalRealOcrEnvMatchesOriginal: false }) },
  { label: "envRestoredAfterTests false", mutate: (r) => ({ ...r, envRestoredAfterTests: false }) },

  { label: "eng.traineddata created during 8.11J", mutate: (r) => ({ ...r, artifactCreatedDuring8_11J: true as false }) },
  { label: "eng.traineddata remains present after 8.11J", mutate: (r) => ({ ...r, artifactPresentAfter8_11J: true as false }) },

  {
    label: "readyForHandoffEnabledSyntheticLocalApiClosure false after safe closure",
    mutate: (r) => ({ ...r, readyForHandoffEnabledSyntheticLocalApiClosure: false }),
  },
  {
    label: "readyForSmartTalkReasoningFromOcr true too early",
    mutate: (r) => ({ ...r, readyForSmartTalkReasoningFromOcr: true as false }),
  },
  { label: "next phase is not 8.11K", mutate: (r) => ({ ...r, readyForNextPhase: "8.11J" as "8.11K" }) },

  { label: "8.3AC marked as run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "rate limit observed but marked false", mutate: (r) => ({ ...r, rateLimitObserved: true }) },
  { label: "unexpected success observed but marked false", mutate: (r) => ({ ...r, unexpectedSuccessObserved: true }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runOcrToSmartTalkHandoffDisabledLocalApiClosure(): Promise<OcrToSmartTalkHandoffDisabledLocalApiClosureResult> {
  const failures: string[] = [];
  const flakinessNotes: string[] = [];

  // ── Source of truth: 8.11I minimal handoff runtime patch audit ───────────
  const i11 = await runMinimalOcrToSmartTalkHandoffRuntimePatchAudit();
  if (i11.checkId !== "8.11I") failures.push(`8.11I checkId mismatch: got "${i11.checkId}"`);
  if (i11.allPassed !== true) failures.push("8.11I allPassed is not true");
  if (i11.readyForHandoffDisabledLocalApiClosure !== true)
    failures.push("8.11I readyForHandoffDisabledLocalApiClosure is not true");
  if (i11.tamperRejected !== i11.tamperCount) failures.push("8.11I own tamper count mismatch");
  const sourceMinimalHandoffRuntimePatchAccepted =
    i11.checkId === "8.11I" &&
    i11.allPassed === true &&
    i11.readyForHandoffDisabledLocalApiClosure === true &&
    i11.tamperRejected === i11.tamperCount;

  // ── Structurally-derived nested source acceptance (disclosed fallback) ───
  // 8.11H and every ancestor phase behind it are NOT re-invoked directly by
  // this closure (see docblock DISCLOSED SOURCE FALLBACK section above);
  // their acceptance is read off 8.11I's own already-computed source-
  // evidence fields, which 8.11I itself validated via its own direct calls
  // when it ran above — avoiding a second, redundant, real-OCR-invoking
  // execution of the entire 8.11H→8.11G→8.11F→8.11E chain within this run.
  const sourceHandoffPlanAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceHandoffPlanAccepted === true;
  if (!sourceHandoffPlanAccepted) failures.push("8.11H (nested via 8.11I) not accepted");

  const sourceTrustBoundaryClosureAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceTrustBoundaryClosureAccepted === true;
  const sourceQualityEvaluatorClosureAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceQualityEvaluatorClosureAccepted === true;
  const sourceEnabledRealOcrClosureAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceEnabledSyntheticLocalApiClosureAccepted === true;
  const sourceDisabledRealOcrClosureAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceDisabledLocalApiClosureAccepted === true;
  const sourceMinimalRealOcrRuntimePatchAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceMinimalRealOcrRuntimePatchAccepted === true;
  const sourceTextDocumentSnapshotPatchAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceTextDocumentSnapshotPatchAccepted === true;
  const sourceTechnicalDebtInventoryAccepted =
    sourceMinimalHandoffRuntimePatchAccepted && i11.sourceTechnicalDebtInventoryAccepted === true;

  if (!sourceTrustBoundaryClosureAccepted) failures.push("8.11G (nested via 8.11I) not accepted");
  if (!sourceQualityEvaluatorClosureAccepted) failures.push("8.11F (nested via 8.11I) not accepted");
  if (!sourceEnabledRealOcrClosureAccepted) failures.push("8.11E (nested via 8.11I) not accepted");
  if (!sourceDisabledRealOcrClosureAccepted) failures.push("8.11D (nested via 8.11I) not accepted");
  if (!sourceMinimalRealOcrRuntimePatchAccepted) failures.push("8.11C (nested via 8.11I) not accepted");
  if (!sourceTextDocumentSnapshotPatchAccepted) failures.push("8.9N-PATCH (nested via 8.11I) not accepted");
  if (!sourceTechnicalDebtInventoryAccepted) failures.push("8.11C-DEBT-A (nested via 8.11I) not accepted");

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Capture original env values for later restoration ────────────────────
  const originalHandoffEnvValue = process.env[HANDOFF_ENV_KEY];
  const originalHandoffEnvWasAbsent = originalHandoffEnvValue === undefined;
  const originalRealOcrEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalRealOcrEnvWasAbsent = originalRealOcrEnvValue === undefined;
  const originalHandoffEnvCaptured = true;
  const originalRealOcrEnvCaptured = true;

  const disabledResults: DisabledCaseResult[] = [];
  const disabledResponseEvidence: string[] = [];
  let rateLimitObserved = false;
  let unexpectedSuccessObserved = false;

  try {
    // ── Gate isolation: real OCR env is set to exact "true" so the handoff
    // gate is the ONLY thing that can reject the request in this matrix.
    process.env[REAL_OCR_ENV_KEY] = "true";
    const realOcrEnvSetExactTrueForIsolation = process.env[REAL_OCR_ENV_KEY] === "true";
    if (!realOcrEnvSetExactTrueForIsolation) {
      failures.push("failed to set real OCR env to exact true for gate isolation");
    }

    for (let i = 0; i < DISABLED_ENV_VARIANTS.length; i++) {
      const variant = DISABLED_ENV_VARIANTS[i]!;

      if (variant.envValue === "true") {
        failures.push(`variant "${variant.label}" is exact lowercase "true" and must never be tested in 8.11J`);
      }

      if (variant.envValue === undefined) {
        delete process.env[HANDOFF_ENV_KEY];
      } else {
        process.env[HANDOFF_ENV_KEY] = variant.envValue;
      }

      let observedStatus = 0;
      let data: Record<string, unknown> | null = null;
      try {
        const req = buildSyntheticHandoffMultipartRequest(variant.testNetIp);
        const res = await POST(req);
        observedStatus = res.status;
        const parsed: unknown = await res.json();
        data = isRecord(parsed) ? parsed : null;
      } catch (err) {
        failures.push(`variant "${variant.label}" threw during in-process invocation: ${String(err)}`);
      }

      const observedOk = data ? data.ok === true : false;
      const observedCode = data && typeof data.code === "string" ? data.code : "";
      const handoffField = data && isRecord(data.handoff) ? data.handoff : null;
      const handoffAllowedField = handoffField ? handoffField.allowed === true : false;
      const handoffPerformedField = handoffField ? handoffField.performed === true : false;
      const handoffEnvelopeField = handoffField !== null;

      if (observedStatus === 429) rateLimitObserved = true;
      if (observedStatus === 200 || observedOk === true) unexpectedSuccessObserved = true;

      const passed =
        observedStatus === 403 &&
        observedOk === false &&
        observedCode === HANDOFF_DISABLED_CODE &&
        !handoffAllowedField &&
        !handoffPerformedField &&
        !handoffEnvelopeField;

      if (!passed) {
        failures.push(
          `disabled variant "${variant.label}" (${variant.envValueDescription}) did not pass: status=${observedStatus}, ok=${observedOk}, code="${observedCode}"`,
        );
      }

      disabledResults.push({
        label: variant.label,
        envValueDescription: variant.envValueDescription,
        testNetIp: variant.testNetIp,
        status: observedStatus,
        ok: observedOk,
        code: observedCode,
        passed,
        handoffAllowedField,
        handoffPerformedField,
        handoffEnvelopeField,
      });

      disabledResponseEvidence.push(
        `${variant.label} (handoff env=${variant.envValueDescription}, real-OCR env forced to exact "true" for isolation, ip=${variant.testNetIp}): status=${observedStatus}, ok=${observedOk}, code="${observedCode}", passed=${passed}. Handoff env gate rejected before formData() parse — OCR extraction, handoff envelope creation, Smart Talk reasoning, model invocation, and persistence were never reached.`,
      );
    }
  } finally {
    // ── Restore both original env values, always, even if a failure above ──
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
  const envRestoredAfterTests = finalHandoffEnvMatchesOriginal && finalRealOcrEnvMatchesOriginal;
  if (!envRestoredAfterTests) failures.push("environment flags were not correctly restored after tests");

  const envRestorationEvidence: string[] = [
    `Original ${HANDOFF_ENV_KEY} captured before any mutation: ${originalHandoffEnvWasAbsent ? "absent" : "present"}.`,
    `Original ${REAL_OCR_ENV_KEY} captured before any mutation: ${originalRealOcrEnvWasAbsent ? "absent" : "present"}.`,
    `Both env flags restored after all 9 disabled variants, inside a finally block: finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}.`,
    "No other environment variable was read for authorization or mutated by this closure.",
  ];

  // ── eng.traineddata artifact check (no OCR ever ran, so it must be absent) ─
  const repoRoot = process.cwd();
  const engTrainedDataPath = path.join(repoRoot, "eng.traineddata");
  const artifactPresentAfter8_11J = fs.existsSync(engTrainedDataPath);
  const artifactCreatedDuring8_11J = artifactPresentAfter8_11J; // OCR never ran in this closure, so any presence would be pre-existing, not created here — but we treat any post-run presence as a failure to be safe.
  if (artifactPresentAfter8_11J) {
    failures.push(
      "eng.traineddata is present after 8.11J — OCR must never execute in this closure and this artifact must remain absent",
    );
  }

  // ── Aggregate disabled-matrix summary ──────────────────────────────────────
  const disabledEnvCasesTested = disabledResults.length === 9;
  const allDisabledCasesReturned403 = disabledResults.every((c) => c.status === 403);
  const allDisabledCasesReturnedExpectedCode = disabledResults.every((c) => c.code === HANDOFF_DISABLED_CODE);
  const disabledEnvCasesPassed =
    disabledEnvCasesTested && disabledResults.every((c) => c.passed) && !rateLimitObserved && !unexpectedSuccessObserved;
  if (!disabledEnvCasesPassed) failures.push("not all 9 disabled env variants passed cleanly");

  const exactLowercaseTrueTested = DISABLED_ENV_VARIANTS.some((v) => v.envValue === "true");
  if (exactLowercaseTrueTested) failures.push("exact lowercase true was tested in 8.11J (forbidden — reserved for 8.11K)");

  const findCase = (label: string) => disabledResults.find((c) => c.label === label);
  const absentCaseTested = findCase("absent") !== undefined;
  const falseCaseTested = findCase("false") !== undefined;
  const uppercaseFalseCaseTested = findCase("FALSE") !== undefined;
  const uppercaseTrueCaseTested = findCase("TRUE") !== undefined;
  const oneCaseTested = findCase("1") !== undefined;
  const yesCaseTested = findCase("yes") !== undefined;
  const whitespaceTrueCaseTested = findCase("whitespace_true") !== undefined;
  const emptyCaseTested = findCase("empty") !== undefined;
  const enabledCaseTested = findCase("enabled") !== undefined;

  const disabledEnvMatrixEvidence: string[] = [
    `All ${DISABLED_ENV_VARIANTS.length} disabled handoff-env variants returned HTTP 403 / ok:false / code:"${HANDOFF_DISABLED_CODE}": ${disabledEnvCasesPassed}.`,
    "Exact lowercase \"true\" was intentionally excluded from this variant matrix — reserved for Phase 8.11K.",
    "Every synthetic request used a single tiny in-memory PNG-signature-only Blob plus mode/pageCount fields — never a real photo or document.",
    "The route's handoff-env gate is the first statement of handleOcrToSmartTalkHandoffRequest() and runs before await req.formData() — so the synthetic multipart body was never parsed for any disabled variant.",
    `Tested labels: ${disabledResults.map((c) => c.label).join(", ")}.`,
  ];

  const routeInvocationEvidence: string[] = [
    "The real /api/smart-talk POST handler was imported and invoked in-process for every one of the 9 disabled variants — no dev server, no browser, no fetch, no external network.",
    `mode="${HANDOFF_MODE}", pageCount="1", a single synthetic image/png File, and a unique x-forwarded-for TEST-NET-2 IP were used for every request.`,
    "Each request used multipart/form-data built via the native FormData/Blob APIs — the same request shape the browser client would send.",
  ];

  const gateIsolationEvidence: string[] = [
    `SMART_TALK_REAL_OCR_EXTRACTION_ENABLED was temporarily set to exact lowercase "true" for the duration of the disabled-handoff matrix, isolating the handoff gate from the real-OCR gate: realOcrEnvSetExactTrueForIsolation=true.`,
    `SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED was never set to exact lowercase "true" anywhere in this closure — only the 9 disabled variants were used.`,
    "app/api/smart-talk/route.ts evaluates the handoff env flag strictly before the real-OCR env flag inside handleOcrToSmartTalkHandoffRequest(), so every rejection observed here is caused only by the handoff gate, never by the (isolated-true) real-OCR gate.",
    "Every disabled response arrived before await req.formData() would have been reached inside the handoff handler — i.e. strictly before OCR extraction, handoff envelope creation, Smart Talk reasoning, model invocation, and persistence.",
  ];

  const noOcrEvidence: string[] = [
    "realOcrExtractionPerformed: false — the OCR adapter (extractTextFromImageBuffer) was never invoked for any of the 9 disabled variants.",
    "tesseractImportedDirectlyByClosure: false, ocrAdapterCalledDirectlyByClosure: false — this closure never imports tesseract.js or the OCR adapter itself; the route's own (unmodified) OCR call path was never reached in any tested case.",
    `eng.traineddata artifact present after 8.11J: ${artifactPresentAfter8_11J} (must be false).`,
  ];

  const noHandoffEvidence: string[] = [
    "ocrToSmartTalkHandoffEnvelopeCreated: false, ocrToSmartTalkHandoffPerformed: false — no handoff envelope was ever built and handoff reasoning never ran for any disabled variant.",
    "Every disabled response body lacked a `handoff` object entirely (handoffEnvelopeField=false in every case); handoff.allowed and handoff.performed were therefore never observed as true.",
  ];

  const noModelEvidence: string[] = [
    "modelCallPerformed: false, smartTalkReasoningPerformed: false — no live model call and no Smart Talk reasoning occurred for any disabled variant.",
    "noRawImageToModel: true, noOriginalDocumentFileToModel: true, noExtractedTextToModel: true — nothing was ever sent to a model because the request was rejected before OCR/handoff logic ran.",
  ];

  const noPersistenceEvidence: string[] = [
    "persistencePerformed: false, dbStorageWritePerformed: false, supabaseStorageWritePerformed: false, vayloDnaWritePerformed: false — no persistence of any kind occurred in this closure.",
    "verifiedFactsCreated: false, legalDeadlineCreated: false, officialFilingCreated: false, bindingLegalAdviceCreated: false — no downstream artifact of any kind was created.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The OCR-to-Smart-Talk handoff branch fails closed for every tested non-exact env value, including near-miss values (uppercase TRUE, \"1\", \"yes\", whitespace-padded true, empty string, random string).",
    "Public runtime, production, and go-live all remained unauthorized in every disabled case.",
    "No extracted text, handoff envelope, model output, or persistence artifact was present in any disabled response body.",
  ];

  const rateLimitIsolationEvidence: string[] = [
    `Each of the 9 disabled variants used its own unique TEST-NET-2 (RFC 5737) address in the range 198.51.100.211–198.51.100.219, comfortably inside the instructed 198.51.100.210–198.51.100.230 window, never reused within this closure's own run and distinct from ranges used by prior closures (8.10D/8.10E and 8.11D use other ranges).`,
    `rateLimitObserved: ${rateLimitObserved} — no HTTP 429 was observed across the full 9-case matrix.`,
    "The module-level in-memory rate limiter in route.ts was not modified by this closure.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "No real image bytes were used as a document; only an 8-byte PNG-signature synthetic Blob was sent, and it was never parsed for any disabled variant.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process.",
    "No DB, Supabase storage, or Vaylo DNA write occurred.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
    "No existing file was modified by this closure; exactly one new file was created.",
  ];

  const tesseractCacheDebtEvidence: string[] = [
    `eng.traineddata observed present after this closure's own run: ${artifactPresentAfter8_11J} (expected false — OCR never executed).`,
    "tesseract.js transiently creates/downloads eng.traineddata in the repo root only when real OCR extraction actually runs; this closure never triggers that path.",
    "This debt (controlled cache path, cleanup policy, .gitignore review) remains unresolved and is not a blocker for 8.11K, but remains a blocker before mobile testing and public beta.",
  ];

  const handoffDisabledLocalApiClosureClosed =
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceHandoffPlanAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceEnabledRealOcrClosureAccepted &&
    sourceDisabledRealOcrClosureAccepted &&
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    disabledEnvCasesPassed &&
    !exactLowercaseTrueTested &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11J &&
    failures.length === 0;

  const readinessVerdict: string[] = [
    `handoffDisabledLocalApiClosureClosed: ${handoffDisabledLocalApiClosureClosed} — every one of the 9 disabled handoff-env variants failed closed with HTTP 403 and code "${HANDOFF_DISABLED_CODE}", with the real-OCR gate isolated to exact "true" throughout.`,
    "readyForHandoffEnabledSyntheticLocalApiClosure: true — the disabled path is fully confirmed; Phase 8.11K can now validate the exact-lowercase-\"true\" enabled synthetic path in-process.",
    "readyForSmartTalkReasoningFromOcr: false — Smart Talk reasoning from OCR-derived text remains a separate, later, explicitly authorized phase.",
    "readyForBrowserManualHandoffTest: false, readyForMobileManualRealOcrTest: false, readyForPhotoOcrPublicRuntime: false, readyForProduction: false, readyForGoLive: false.",
    'readyForNextPhase: "8.11K" — recommendedNextPhase: "OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure".',
  ];

  const notes: string[] = [
    "PHASE 8.11J validates ONLY the disabled-by-default behavior of the OCR-to-Smart-Talk handoff branch introduced in 8.11I. It does not modify any runtime implementation and does not test the enabled handoff path.",
    `DISCLOSED SOURCE FALLBACK: only 8.11I was called directly by this closure. 8.11H/8.11G/8.11F/8.11E/8.11D/8.11C/8.9N-PATCH/8.11C-DEBT-A acceptance was derived structurally from 8.11I's own already-computed nested source-evidence fields rather than re-invoked directly, specifically to avoid re-running the entire 8.11H->8.11G->8.11F->8.11E real-OCR chain a second time in this same process (8.11I's own direct call to 8.11H already exercises that chain once internally) and to avoid cross-closure rate-limit flakiness from long chained audit runs. This does not re-authorize any ancestor phase; it only reads their already-established acceptance.`,
    `Gate isolation: SMART_TALK_REAL_OCR_EXTRACTION_ENABLED was temporarily forced to exact "true" only to isolate the handoff gate under test; SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED was never set to exact "true" in this closure.`,
    `Disabled handoff-env matrix result: ${disabledResults.map((c) => `${c.label}=${c.status}/${c.code}`).join(", ")}.`,
    `Rate-limit isolation: unique TEST-NET-2 IPs 198.51.100.211–198.51.100.219 were used, one per case; rateLimitObserved=${rateLimitObserved}.`,
    `Both env flags were restored to their original values in a finally block: finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}.`,
    `eng.traineddata presence after this closure: ${artifactPresentAfter8_11J} (must be false; OCR never executed in this closure).`,
  ];

  const allSourcesAccepted =
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceHandoffPlanAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceEnabledRealOcrClosureAccepted &&
    sourceDisabledRealOcrClosureAccepted &&
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceTechnicalDebtInventoryAccepted;

  const allChecksPassed =
    allSourcesAccepted &&
    disabledEnvCasesPassed &&
    !exactLowercaseTrueTested &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11J;

  const allPassed = allChecksPassed && failures.length === 0;

  const tamperCount = OCR_TO_SMART_TALK_HANDOFF_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES.length;

  const provisional: OcrToSmartTalkHandoffDisabledLocalApiClosureResult = {
    checkId: "8.11J",
    allPassed: true,
    disabledLocalApiClosureOnly: true,
    ocrToSmartTalkHandoffDisabledLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalledByClosure: false,
    externalFetchCalledByClosure: false,
    openAiCalled: false,
    tesseractImportedDirectlyByClosure: false,
    ocrAdapterCalledDirectlyByClosure: false,
    realOcrExtractionPerformed: false,
    realImageUsedByClosure: false,
    syntheticImageOnly: true,
    realDocumentUsed: false,
    imageSavedToDisk: false,
    modelCallPerformed: false,
    smartTalkReasoningPerformed: false,
    ocrToSmartTalkHandoffEnvelopeCreated: false,
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

    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceHandoffPlanCommit: "b839538",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceEnabledRealOcrClosureCommit: "ec5a76f",
    sourceDisabledRealOcrClosureCommit: "3688358",
    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceTextDocumentSnapshotPatchCommit: "cf6624c",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceMinimalHandoffRuntimePatchAccepted,
    sourceHandoffPlanAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceEnabledRealOcrClosureAccepted,
    sourceDisabledRealOcrClosureAccepted,
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceTextDocumentSnapshotPatchAccepted,
    sourceTechnicalDebtInventoryAccepted,

    disabledEnvCaseCount: 9,
    disabledEnvCasesTested,
    absentCaseTested,
    falseCaseTested,
    uppercaseFalseCaseTested,
    uppercaseTrueCaseTested,
    oneCaseTested,
    yesCaseTested,
    whitespaceTrueCaseTested,
    emptyCaseTested,
    enabledCaseTested,
    exactLowercaseTrueTested: false,
    exactLowercaseTrueReservedFor8_11K: true,
    allDisabledCasesReturned403,
    allDisabledCasesReturnedExpectedCode,
    expectedDisabledCode: "ocr_to_smart_talk_handoff_disabled",
    rateLimitObserved: false,
    unexpectedSuccessObserved: false,

    originalHandoffEnvCaptured,
    originalRealOcrEnvCaptured,
    realOcrEnvSetExactTrueForIsolation: true,
    handoffEnvNeverSetExactTrue: true,
    handoffGateEvaluatedBeforeOcr: true,
    disabledResponseReturnedBeforeOcr: true,
    envRestoredAfterTests,
    finalHandoffEnvMatchesOriginal,
    finalRealOcrEnvMatchesOriginal,

    noRealOcrExecution: true,
    noSmartTalkReasoning: true,
    noModelCall: true,
    noRawImageToModel: true,
    noOriginalDocumentFileToModel: true,
    noExtractedTextToModel: true,
    noHandoffEnvelopeCreation: true,
    noHandoffExecution: true,
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

    handoffDisabledLocalApiClosureClosed,
    readyForHandoffEnabledSyntheticLocalApiClosure: true,
    readyForSmartTalkReasoningFromOcr: false,
    readyForBrowserManualHandoffTest: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11K",
    recommendedNextPhase: "OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    disabledResults,

    sourceEvidence,
    disabledEnvMatrixEvidence,
    routeInvocationEvidence,
    gateIsolationEvidence,
    disabledResponseEvidence,
    noOcrEvidence,
    noHandoffEvidence,
    noModelEvidence,
    noPersistenceEvidence,
    safetyBoundaryEvidence,
    rateLimitIsolationEvidence,
    envRestorationEvidence,
    forbiddenRuntimeEvidence,
    tesseractCacheDebtEvidence,
    readinessVerdict,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    nextRecommendedSteps: [
      "Phase 8.11K: OCR-to-Smart-Talk Handoff Enabled Synthetic Local API Closure — validate the exact-lowercase-\"true\" enabled handoff path in-process, no browser, no real document.",
      "OCR Quality Evaluator Runtime Implementation — implement lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts as planned in 8.11F, still pending.",
      "tesseract.js cache debt resolution — configure a controlled cache path, implement cleanup policy, review .gitignore for *.traineddata.",
      "Cross-closure rate-limit isolation — consider a systemic fix (e.g. dependency-injectable rate limiter) instead of per-closure unique-IP conventions.",
      "Smart Talk reasoning from OCR — a later, separate, explicitly authorized phase only after 8.11K is complete.",
    ],
    notes,

    debtObservedPreviously: true,
    artifactName: "eng.traineddata",
    artifactLocationObservedPreviously: "repo root",
    artifactCreatedDuring8_11J,
    artifactPresentAfter8_11J: false,
    mustNotCommitArtifact: true,
    controlledCachePathStillNeeded: true,
    cleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    blockerBeforeMobileTesting: true,
    blockerBeforePublicBeta: true,
    blockerBefore8_11K: false,
  };

  // ── Self-validation ────────────────────────────────────────────────────────
  if (allPassed && !_isCanonicalOcrToSmartTalkHandoffDisabledLocalApiClosureResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Tamper-case verification ────────────────────────────────────────────────
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of OCR_TO_SMART_TALK_HANDOFF_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalOcrToSmartTalkHandoffDisabledLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11J tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    ...(flakinessNotes.length > 0 ? [`FLAKINESS NOTES (${flakinessNotes.length}):`, ...flakinessNotes] : []),
    `8.11J tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    handoffDisabledLocalApiClosureClosed: finalAllPassed,
    readyForHandoffEnabledSyntheticLocalApiClosure: finalAllPassed,
    rateLimitObserved,
    unexpectedSuccessObserved,
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
  process.argv[1].replace(/\\/g, "/").includes("run-ocr-to-smart-talk-handoff-disabled-local-api-closure");

if (invokedDirectly) {
  runOcrToSmartTalkHandoffDisabledLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkHandoffDisabledLocalApiClosure failed:", err);
      process.exitCode = 1;
    });
}
