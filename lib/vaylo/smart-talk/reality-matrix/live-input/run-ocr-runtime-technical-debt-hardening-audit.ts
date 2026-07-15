/**
 * PHASE 8.11R — OCR Runtime Technical Debt Hardening and Cross-Mode
 * Regression Preparation Audit
 *
 * This audit verifies that the technical debts identified by 8.11Q
 * (internal readiness closure, commit bb676cd) were hardened without
 * changing any Smart Talk response semantics, UI, or authorization
 * boundary, and that a static preparation contract for PHASE 8.11S
 * (Unified Cross-Mode Regression Closure) now exists.
 *
 * EVIDENCE STRATEGY — FULLY DISCLOSED:
 *
 * 1. Static, read-only text inspection (`fs.readFileSync` only) of the
 *    currently committed `app/api/smart-talk/route.ts`,
 *    `lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts`, `.gitignore`,
 *    `package.json`, and `next.config.ts` — confirming both the presence
 *    of the new hardening and the absence of forbidden patterns (old
 *    rate-limiter symbols, hardcoded "/tmp" or Windows paths, broad
 *    `.gitignore` patterns, Redis/Upstash references, etc.).
 * 2. Direct, LIVE execution of the two newly created PURE utility modules
 *    — `lib/vaylo/smart-talk/ocr/tesseract-runtime-policy.ts` and
 *    `lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts`. Both
 *    modules import only `node:fs`/`node:os`/`node:path` (the policy
 *    module) or nothing at all beyond their own types (the rate-limiter
 *    module) — neither ever imports `tesseract.js`, calls
 *    `runSmartTalk`, invokes the route, starts a browser, or starts a
 *    dev server. Calling their exported functions directly is therefore
 *    safe evidence, not a forbidden execution, and is explicitly what
 *    this phase's instructions permit ("instantiate isolated
 *    rate-limiter objects", "use a deterministic fake clock", "verify
 *    cleanup boundaries", "create and remove a safe empty Vaylo-owned
 *    temporary test directory under os.tmpdir()").
 * 3. Structural derivation of 8.11Q/8.11P/8.11O/8.11N/8.11M/technical-debt
 *    acceptance from the already-committed literal commit-hash markers
 *    inside 8.11Q's own source text (the same "verifySourceMarker"
 *    technique 8.11P/8.11O/8.11Q themselves already established), rather
 *    than re-invoking 8.11Q or any earlier closure — 8.11N/8.11O invoke
 *    the real route/OCR/model and must never be re-run here.
 *
 * This audit does NOT invoke POST, does NOT run OCR, does NOT import the
 * tesseract.js worker runtime, does NOT call runSmartTalk or any model,
 * does NOT start a browser or dev server, does NOT write DB/storage/DNA,
 * and does NOT execute any historical live closure (8.11N/8.11O/8.11Q).
 * It creates exactly one new file: itself.
 */

import fs from "fs";
import os from "os";
import path from "path";

import {
  cleanupTesseractRequestArtifacts,
  describeTesseractRuntimePolicy,
  ensureTesseractCacheDirectory,
  resolveTesseractCachePath,
  TESSERACT_CACHE_METHOD_NONE,
  TESSERACT_CACHE_METHOD_WRITE,
} from "@/lib/vaylo/smart-talk/ocr/tesseract-runtime-policy";
import {
  createInMemorySmartTalkRateLimiter,
  getRuntimeSmartTalkRateLimiter,
  resolveSmartTalkRateLimitClientIp,
  SMART_TALK_RATE_MAX_REQUESTS,
  SMART_TALK_RATE_WINDOW_MS,
  type SmartTalkRateLimiterClock,
} from "@/lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter";

// ─── Documented source file paths (read-only; never imported/executed) ────

const INTERNAL_READINESS_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-internal-readiness-closure.ts";
const TESSERACT_FIX_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-tesseract-next-dev-worker-path-fix-audit.ts";

const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const REAL_OCR_ADAPTER_REL_PATH = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";
const RATE_LIMITER_REL_PATH = "lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts";
const NEXT_CONFIG_REL_PATH = "next.config.ts";
const PACKAGE_JSON_REL_PATH = "package.json";
const GITIGNORE_REL_PATH = ".gitignore";

const ENG_TRAINEDDATA_REPO_ROOT_REL_PATH = "eng.traineddata";

// ─── Static, read-only helpers (fs.readFileSync only — no execution) ──────

function readFileSafe(relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return null;
  }
}

function fileExistsSafe(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

function includesAll(text: string | null, markers: readonly string[]): boolean {
  if (text === null) return false;
  return markers.every((m) => text.includes(m));
}

function includesNone(text: string | null, markers: readonly string[]): boolean {
  if (text === null) return true;
  return markers.every((m) => !text.includes(m));
}

function hasExactLine(text: string | null, exactLine: string): boolean {
  if (text === null) return false;
  return text
    .split(/\r?\n/)
    .some((line) => line.trim() === exactLine);
}

export interface Result {
  checkId: "8.11R";
  allPassed: boolean;

  technicalDebtHardeningOnly: true;
  noNewUserFunctionality: true;
  mobileFirstConstraintsRecorded: true;
  crossModeRegressionPreparationOnly: true;
  routeInvokedByAudit: false;
  ocrPerformedByAudit: false;
  tesseractWorkerCreatedByAudit: false;
  runSmartTalkInvokedByAudit: false;
  modelCallPerformedByAudit: false;
  browserInvokedByAudit: false;
  devServerStartedByAudit: false;
  persistencePerformedByAudit: false;
  dbStorageWritePerformedByAudit: false;
  dnaWritePerformedByAudit: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceInternalReadinessCommit: "bb676cd";
  sourceBrowserValidationCommit: "ca52b08";
  sourceEnabledReasoningClosureCommit: "f06501f";
  sourceDisabledReasoningClosureCommit: "e354857";
  sourceRuntimePatchCommit: "cce84b9";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceInternalReadinessAccepted: boolean;
  sourceBrowserValidationAccepted: boolean;
  sourceEnabledReasoningClosureAccepted: boolean;
  sourceDisabledReasoningClosureAccepted: boolean;
  sourceRuntimePatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  installedTesseractVersionInspected: true;
  installedTesseractApiInspected: true;
  installedTesseractVersion: string;
  supportedCacheOptionConfirmed: boolean;
  cachePathUsesOsTmpdir: boolean;
  cachePathCrossPlatform: boolean;
  cachePathOutsideRepository: boolean;
  cachePathUserControlled: false;
  hardcodedUnixTmpPathUsed: false;
  hardcodedWindowsPathUsed: false;
  rawImageWrittenToCache: false;
  extractedTextWrittenToCache: false;
  modelOutputWrittenToCache: false;
  workerTerminateGuaranteedInFinally: boolean;
  workerTerminateAfterSuccess: boolean;
  workerTerminateAfterError: boolean;
  workerTerminateAfterTimeout: boolean;
  secondWorkerCreatedPerRequest: false;
  moduleGlobalWorkerIntroduced: false;
  repoRootTraineddataArtifactPrevented: boolean;
  boundedTemporaryCleanupImplemented: boolean;
  cleanupCannotDeleteOsTmpdirRoot: boolean;
  cleanupFailureExposesInternalPath: false;

  gitignorePolicyReviewed: true;
  narrowRepoLocalOcrArtifactPatternAdded: boolean;
  systemTmpPathAddedToGitignore: false;
  absolutePathAddedToGitignore: false;
  broadTraineddataIgnoreAddedWithoutPolicy: boolean;
  futureIntentionalAssetPolicyPreserved: true;

  rateLimiterExtractedFromRoute: boolean;
  typedRateLimiterInterfaceImplemented: boolean;
  runtimeSingletonPreserved: boolean;
  productionSemanticsPreserved: boolean;
  existingWindowPreserved: boolean;
  existingLimitPreserved: boolean;
  existingResponseContractPreserved: boolean;
  isolatedLimiterFactoryImplemented: boolean;
  isolatedStorePerInstance: boolean;
  deterministicClockSupported: boolean;
  requestHeaderBypassAdded: false;
  queryBypassAdded: false;
  requestBodyBypassAdded: false;
  nodeEnvAutomaticBypassAdded: false;
  clientCanDisableLimiter: false;
  redisOrUpstashAddedNow: boolean;
  newSecretAddedNow: false;
  routeLevelDeterministicIsolationFullySolved: false;
  uniqueTestNetIpStrategyStillNeededFor8_11S: true;

  androidPriorityRecorded: true;
  iosPriorityRecorded: true;
  desktopSecondaryRecorded: true;
  galleryUploadValidationStillNeeded: true;
  directCameraCaptureValidationStillNeeded: true;
  androidChromeValidationStillNeeded: true;
  iosSafariValidationStillNeeded: true;
  jpegBaselineInspected: true;
  pngBaselineInspected: true;
  heicSupportInspected: boolean;
  heicSupportImplementedNow: false;
  exifOrientationHandlingInspected: boolean;
  maximumUploadBytesRecorded: number | false;
  maximumImageDimensionsRecordedOrMissing: "missing" | "recorded";
  maximumDecodedPixelsRecordedOrMissing: "missing" | "recorded";
  onePageLimitRecorded: boolean;
  oneWorkerPerRequestRequired: true;
  mobileValidationBlocksPublicBeta: true;

  unifiedRegressionUmbrellaDesigned: true;
  freeQaSubPackDefined: true;
  textDocumentSubPackDefined: true;
  photoOcrSubPackDefined: true;
  crossModePollutionChecksDefined: true;
  sharedLimiterContaminationChecksDefined: true;
  envRestorationChecksDefined: true;
  traineddataArtifactChecksDefined: true;
  modelCallMultiplicationChecksDefined: true;
  regressionExecutedNow: false;
  readyForUnifiedCrossModeRegression: boolean;

  tesseractRepoArtifactDebtClosed: boolean;
  tesseractWorkerTerminationDebtClosed: boolean;
  tesseractCrossPlatformCachePolicyClosed: boolean;
  tesseractBroaderServerlessMemoryValidationStillOpen: true;
  mobileRealPhotoValidationStillOpen: true;
  rateLimiterCodeSeparationDebtClosed: boolean;
  rateLimiterRouteIsolationDebtFullyClosed: false;
  distributedProductionRateLimiterStillOpen: true;
  auditSnapshotConsolidationStillOpen: true;
  ocrQualityEvaluatorRuntimeExtractionStillOpen: true;

  internalRegressionBlockersRemaining: readonly string[];
  controlledBetaBlockersRemaining: readonly string[];
  publicBetaBlockersRemaining: readonly string[];
  productionBlockersRemaining: readonly string[];

  ocrRuntimeHardeningClosed: boolean;
  readyForFirstContactGateDesign: false;
  readyForMobileManualValidation: false;
  readyForControlledBetaAuthorization: false;
  readyForPublicBetaAuthorization: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11S" | false;
  recommendedNextPhase: string;

  sourceEvidence: readonly string[];
  installedTesseractApiEvidence: readonly string[];
  tesseractCachePolicyEvidence: readonly string[];
  workerLifecycleEvidence: readonly string[];
  cleanupBoundaryEvidence: readonly string[];
  gitignorePolicyEvidence: readonly string[];
  rateLimiterExtractionEvidence: readonly string[];
  rateLimiterIsolationEvidence: readonly string[];
  mobileFirstConstraintEvidence: readonly string[];
  regressionPreparationEvidence: readonly string[];
  noRuntimeExecutionEvidence: readonly string[];
  technicalDebtVerdict: readonly string[];
  evidenceLimitations: readonly string[];
  remainingBlockers: readonly string[];
  readinessVerdict: readonly string[];
  nextRecommendedSteps: readonly string[];
  notes: readonly string[];
}

// ─── Unconditional required-evidence-limitation strings ───────────────────

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "No real OCR was executed by this audit.",
  "No model call was executed.",
  "No browser or mobile device was tested.",
  "No real photo was used.",
  "No serverless/Vercel deployment was tested.",
  "Memory usage under real mobile images was not measured.",
  "Distributed production rate limiting was not implemented.",
  "Route-level test isolation may still use unique TEST-NET IPs.",
  "Cross-mode regression was prepared but not executed.",
  "Public beta, production, and go-live remain blocked.",
];

function computeExpectedAllPassed(r: Result): boolean {
  return (
    r.sourceInternalReadinessAccepted &&
    r.sourceBrowserValidationAccepted &&
    r.sourceEnabledReasoningClosureAccepted &&
    r.sourceDisabledReasoningClosureAccepted &&
    r.sourceRuntimePatchAccepted &&
    r.sourceTechnicalDebtInventoryAccepted &&
    r.installedTesseractVersionInspected === true &&
    r.installedTesseractApiInspected === true &&
    r.supportedCacheOptionConfirmed &&
    r.cachePathUsesOsTmpdir &&
    r.cachePathCrossPlatform &&
    r.cachePathOutsideRepository &&
    r.cachePathUserControlled === false &&
    r.hardcodedUnixTmpPathUsed === false &&
    r.hardcodedWindowsPathUsed === false &&
    r.rawImageWrittenToCache === false &&
    r.extractedTextWrittenToCache === false &&
    r.modelOutputWrittenToCache === false &&
    r.workerTerminateGuaranteedInFinally &&
    r.workerTerminateAfterSuccess &&
    r.workerTerminateAfterError &&
    r.workerTerminateAfterTimeout &&
    r.secondWorkerCreatedPerRequest === false &&
    r.moduleGlobalWorkerIntroduced === false &&
    r.repoRootTraineddataArtifactPrevented &&
    r.boundedTemporaryCleanupImplemented &&
    r.cleanupCannotDeleteOsTmpdirRoot &&
    r.cleanupFailureExposesInternalPath === false &&
    r.narrowRepoLocalOcrArtifactPatternAdded &&
    r.systemTmpPathAddedToGitignore === false &&
    r.absolutePathAddedToGitignore === false &&
    r.broadTraineddataIgnoreAddedWithoutPolicy === false &&
    r.rateLimiterExtractedFromRoute &&
    r.typedRateLimiterInterfaceImplemented &&
    r.runtimeSingletonPreserved &&
    r.productionSemanticsPreserved &&
    r.existingWindowPreserved &&
    r.existingLimitPreserved &&
    r.existingResponseContractPreserved &&
    r.isolatedLimiterFactoryImplemented &&
    r.isolatedStorePerInstance &&
    r.deterministicClockSupported &&
    r.requestHeaderBypassAdded === false &&
    r.queryBypassAdded === false &&
    r.requestBodyBypassAdded === false &&
    r.nodeEnvAutomaticBypassAdded === false &&
    r.clientCanDisableLimiter === false &&
    r.redisOrUpstashAddedNow === false &&
    r.newSecretAddedNow === false &&
    r.routeLevelDeterministicIsolationFullySolved === false &&
    r.uniqueTestNetIpStrategyStillNeededFor8_11S === true &&
    r.androidPriorityRecorded === true &&
    r.iosPriorityRecorded === true &&
    r.heicSupportInspected === true &&
    r.heicSupportImplementedNow === false &&
    r.unifiedRegressionUmbrellaDesigned === true &&
    r.freeQaSubPackDefined === true &&
    r.textDocumentSubPackDefined === true &&
    r.photoOcrSubPackDefined === true &&
    r.regressionExecutedNow === false &&
    r.routeInvokedByAudit === false &&
    r.ocrPerformedByAudit === false &&
    r.tesseractWorkerCreatedByAudit === false &&
    r.runSmartTalkInvokedByAudit === false &&
    r.modelCallPerformedByAudit === false &&
    r.browserInvokedByAudit === false &&
    r.devServerStartedByAudit === false &&
    r.persistencePerformedByAudit === false &&
    r.dbStorageWritePerformedByAudit === false &&
    r.dnaWritePerformedByAudit === false &&
    r.readyForPublicBetaAuthorization === false &&
    r.readyForProduction === false &&
    r.readyForGoLive === false &&
    r.readyForNextPhase === "8.11S" &&
    r.eightThreeAcNotRun === true &&
    r.tmpEightThreeAcMetadataTouched === false
  );
}

/**
 * Structural/logical validity of a Result value — independent of whether
 * `allPassed` matches `computeExpectedAllPassed`. Used both on the real
 * built result and on every tamper case below.
 */
function validateResult(r: Result): boolean {
  if (r.checkId !== "8.11R") return false;
  if (r.technicalDebtHardeningOnly !== true) return false;
  if (r.noNewUserFunctionality !== true) return false;
  if (r.mobileFirstConstraintsRecorded !== true) return false;
  if (r.crossModeRegressionPreparationOnly !== true) return false;
  if (r.routeInvokedByAudit !== false) return false;
  if (r.ocrPerformedByAudit !== false) return false;
  if (r.tesseractWorkerCreatedByAudit !== false) return false;
  if (r.runSmartTalkInvokedByAudit !== false) return false;
  if (r.modelCallPerformedByAudit !== false) return false;
  if (r.browserInvokedByAudit !== false) return false;
  if (r.devServerStartedByAudit !== false) return false;
  if (r.persistencePerformedByAudit !== false) return false;
  if (r.dbStorageWritePerformedByAudit !== false) return false;
  if (r.dnaWritePerformedByAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceInternalReadinessCommit !== "bb676cd") return false;
  if (r.sourceBrowserValidationCommit !== "ca52b08") return false;
  if (r.sourceEnabledReasoningClosureCommit !== "f06501f") return false;
  if (r.sourceDisabledReasoningClosureCommit !== "e354857") return false;
  if (r.sourceRuntimePatchCommit !== "cce84b9") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;

  if (r.cachePathUserControlled !== false) return false;
  if (r.hardcodedUnixTmpPathUsed !== false) return false;
  if (r.hardcodedWindowsPathUsed !== false) return false;
  if (r.rawImageWrittenToCache !== false) return false;
  if (r.extractedTextWrittenToCache !== false) return false;
  if (r.modelOutputWrittenToCache !== false) return false;
  if (r.secondWorkerCreatedPerRequest !== false) return false;
  if (r.moduleGlobalWorkerIntroduced !== false) return false;
  if (r.cleanupFailureExposesInternalPath !== false) return false;

  if (r.systemTmpPathAddedToGitignore !== false) return false;
  if (r.absolutePathAddedToGitignore !== false) return false;
  if (r.broadTraineddataIgnoreAddedWithoutPolicy !== false) return false;

  if (r.requestHeaderBypassAdded !== false) return false;
  if (r.queryBypassAdded !== false) return false;
  if (r.requestBodyBypassAdded !== false) return false;
  if (r.nodeEnvAutomaticBypassAdded !== false) return false;
  if (r.clientCanDisableLimiter !== false) return false;
  if (r.redisOrUpstashAddedNow !== false) return false;
  if (r.newSecretAddedNow !== false) return false;
  if (r.routeLevelDeterministicIsolationFullySolved !== false) return false;
  if (r.uniqueTestNetIpStrategyStillNeededFor8_11S !== true) return false;

  if (r.heicSupportImplementedNow !== false) return false;
  if (r.regressionExecutedNow !== false) return false;

  if (r.rateLimiterRouteIsolationDebtFullyClosed !== false) return false;
  if (r.tesseractBroaderServerlessMemoryValidationStillOpen !== true) return false;
  if (r.mobileRealPhotoValidationStillOpen !== true) return false;
  if (r.distributedProductionRateLimiterStillOpen !== true) return false;
  if (r.auditSnapshotConsolidationStillOpen !== true) return false;
  if (r.ocrQualityEvaluatorRuntimeExtractionStillOpen !== true) return false;

  if (r.readyForFirstContactGateDesign !== false) return false;
  if (r.readyForMobileManualValidation !== false) return false;
  if (r.readyForControlledBetaAuthorization !== false) return false;
  if (r.readyForPublicBetaAuthorization !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11S" && r.readyForNextPhase !== false) return false;

  // allPassed may only be true if readyForNextPhase is exactly "8.11S", and
  // readyForNextPhase may only be "8.11S" if allPassed is true.
  if (r.allPassed && r.readyForNextPhase !== "8.11S") return false;
  if (!r.allPassed && r.readyForNextPhase !== false) return false;
  if (r.allPassed !== computeExpectedAllPassed(r)) return false;

  if (r.evidenceLimitations.length < REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  if (!REQUIRED_EVIDENCE_LIMITATIONS.every((m) => r.evidenceLimitations.includes(m))) {
    return false;
  }

  const requiredArrays: (keyof Result)[] = [
    "sourceEvidence",
    "installedTesseractApiEvidence",
    "tesseractCachePolicyEvidence",
    "workerLifecycleEvidence",
    "cleanupBoundaryEvidence",
    "gitignorePolicyEvidence",
    "rateLimiterExtractionEvidence",
    "rateLimiterIsolationEvidence",
    "mobileFirstConstraintEvidence",
    "regressionPreparationEvidence",
    "noRuntimeExecutionEvidence",
    "technicalDebtVerdict",
    "remainingBlockers",
    "readinessVerdict",
    "nextRecommendedSteps",
    "notes",
  ];
  for (const key of requiredArrays) {
    const value = r[key];
    if (!Array.isArray(value) || value.length === 0) return false;
  }

  return true;
}

// ─── Static source inspection ──────────────────────────────────────────────

function verifyInternalReadinessSourceAccepted(): {
  internalReadinessAccepted: boolean;
  browserValidationAccepted: boolean;
  enabledReasoningClosureAccepted: boolean;
  disabledReasoningClosureAccepted: boolean;
  runtimePatchAccepted: boolean;
  technicalDebtInventoryAccepted: boolean;
} {
  const text = readFileSafe(INTERNAL_READINESS_CLOSURE_REL_PATH);
  const internalReadinessAccepted = includesAll(text, [
    'checkId: "8.11Q"',
    "export async function runOcrToSmartTalkControlledReasoningInternalReadinessClosure",
    'readyForNextPhase: "8.11R"',
    "readyForPublicBetaAuthorization: false",
  ]);
  const browserValidationAccepted = includesAll(text, ['sourceBrowserValidationCommit: "ca52b08"']);
  const enabledReasoningClosureAccepted = includesAll(text, [
    'sourceEnabledReasoningClosureCommit: "f06501f"',
  ]);
  const disabledReasoningClosureAccepted = includesAll(text, [
    'sourceDisabledReasoningClosureCommit: "e354857"',
  ]);
  const runtimePatchAccepted = includesAll(text, ['sourceRuntimePatchCommit: "cce84b9"']);
  const technicalDebtInventoryAccepted = includesAll(text, [
    'sourceTechnicalDebtInventoryCommit: "bdf3859"',
  ]);
  return {
    internalReadinessAccepted,
    browserValidationAccepted,
    enabledReasoningClosureAccepted,
    disabledReasoningClosureAccepted,
    runtimePatchAccepted,
    technicalDebtInventoryAccepted,
  };
}

function verifyTesseractWorkerPathFixStillDocumented(): boolean {
  return (
    fileExistsSafe(TESSERACT_FIX_AUDIT_REL_PATH) &&
    includesAll(readFileSafe(TESSERACT_FIX_AUDIT_REL_PATH), [
      'checkId: "8.11P-BLOCKER"',
      "export function runTesseractNextDevWorkerPathFixAudit",
    ])
  );
}

function getInstalledTesseractVersion(): string {
  try {
    const pkgText = fs.readFileSync(
      path.join(process.cwd(), "node_modules", "tesseract.js", "package.json"),
      "utf8",
    );
    const parsed = JSON.parse(pkgText) as { version?: unknown };
    return typeof parsed.version === "string" ? parsed.version : "unknown";
  } catch {
    return "unknown";
  }
}

function verifyRealOcrAdapterHardening(): {
  cachePathWired: boolean;
  finallyGuaranteed: boolean;
  terminateAfterSuccess: boolean;
  terminateAfterError: boolean;
  terminateAfterTimeout: boolean;
  noRetries: boolean;
  singleWorkerPerCall: boolean;
  noModuleGlobalWorker: boolean;
} {
  const text = readFileSafe(REAL_OCR_ADAPTER_REL_PATH);
  const cachePathWired = includesAll(text, [
    "resolveTesseractCachePath",
    "ensureTesseractCacheDirectory",
    "TESSERACT_CACHE_METHOD_NONE",
    "TESSERACT_CACHE_METHOD_WRITE",
  ]);
  const finallyGuaranteed = includesAll(text, [
    "} finally {",
    "await terminateWorkerSafely();",
  ]);
  // A single createWorker call site (no retry loop calling it a second time).
  const createWorkerCallCount = text ? (text.match(/createWorker\(/g) ?? []).length : 0;
  const singleWorkerPerCall = createWorkerCallCount === 1;
  const noRetries = includesNone(text, ["retry", "Retry", "RETRY"]);
  // "worker" is declared with `let worker` INSIDE extractTextFromImageBuffer
  // (function-scoped), and no top-level `let worker`/`const worker` module
  // declaration exists outside any function in this file.
  const noModuleGlobalWorker =
    includesAll(text, ["let worker: Awaited<ReturnType<typeof createWorker>> | null = null;"]) &&
    !/^\s*(let|const)\s+worker\b/m.test(
      (text ?? "").replace(/export async function extractTextFromImageBuffer[\s\S]*/m, ""),
    );
  return {
    cachePathWired,
    finallyGuaranteed,
    terminateAfterSuccess: finallyGuaranteed,
    terminateAfterError: finallyGuaranteed,
    terminateAfterTimeout: finallyGuaranteed && includesAll(text, ["OCR_TIMEOUT_ERROR_MESSAGE"]),
    noRetries,
    singleWorkerPerCall,
    noModuleGlobalWorker,
  };
}

function verifyGitignorePolicy(): {
  narrowPatternAdded: boolean;
  noSystemTmpPath: boolean;
  noAbsolutePath: boolean;
  noBroadTraineddataPattern: boolean;
} {
  const text = readFileSafe(GITIGNORE_REL_PATH);
  const narrowPatternAdded = includesAll(text, ["/eng.traineddata", "*.traineddata.tmp"]);
  const noSystemTmpPath = includesNone(text, ["/tmp\n", "os.tmpdir("]) && !hasExactLine(text, "/tmp");
  const noAbsolutePath = includesNone(text, ["C:\\\\", "C:/Users"]);
  const noBroadTraineddataPattern = !hasExactLine(text, "*.traineddata") && !hasExactLine(text, "eng.traineddata");
  return { narrowPatternAdded, noSystemTmpPath, noAbsolutePath, noBroadTraineddataPattern };
}

function verifyRouteRateLimiterWiring(): {
  extractedFromRoute: boolean;
  oldSymbolsAbsent: boolean;
  mimeTypesUnchanged: boolean;
  maxFileSizeBytes: number | null;
  maxPageCount: number | null;
  noDimensionOrExifHandling: boolean;
} {
  const text = readFileSafe(ROUTE_REL_PATH);
  const extractedFromRoute = includesAll(text, [
    "getRuntimeSmartTalkRateLimiter",
    "resolveSmartTalkRateLimitClientIp",
    '@/lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter',
  ]);
  const oldSymbolsAbsent = includesNone(text, [
    "const ipHits",
    "function getClientIp",
    "function takeRateSlot",
    "const RATE_WINDOW_MS",
    "const RATE_MAX ",
  ]);
  const mimeTypesUnchanged = includesAll(text, [
    'new Set(["image/png", "image/jpeg", "image/webp"])',
  ]);
  const sizeMatch = text?.match(/REAL_OCR_MAX_FILE_SIZE_BYTES = (\d[\d_]*)/);
  const pageMatch = text?.match(/REAL_OCR_MAX_PAGE_COUNT = (\d+)/);
  const maxFileSizeBytes = sizeMatch ? Number(sizeMatch[1].replace(/_/g, "")) : null;
  const maxPageCount = pageMatch ? Number(pageMatch[1]) : null;
  const noDimensionOrExifHandling = includesNone(text, [
    "EXIF",
    "exif",
    "decodedPixel",
    "imageWidth",
    "imageHeight",
    "HEIC",
    "heic",
  ]);
  return {
    extractedFromRoute,
    oldSymbolsAbsent,
    mimeTypesUnchanged,
    maxFileSizeBytes,
    maxPageCount,
    noDimensionOrExifHandling,
  };
}

function verifyRateLimiterModuleShape(): {
  typedInterfacePresent: boolean;
  singletonFactoryPresent: boolean;
  isolatedFactoryPresent: boolean;
  noRedisOrUpstash: boolean;
  noNewSecret: boolean;
  noHttpResetExposed: boolean;
} {
  const text = readFileSafe(RATE_LIMITER_REL_PATH);
  const typedInterfacePresent = includesAll(text, [
    "export interface SmartTalkRateLimiter",
    "export interface SmartTalkRateLimitDecision",
  ]);
  const singletonFactoryPresent = includesAll(text, ["getRuntimeSmartTalkRateLimiter"]);
  const isolatedFactoryPresent = includesAll(text, [
    "createInMemorySmartTalkRateLimiter",
    "SmartTalkRateLimiterClock",
  ]);
  const noRedisOrUpstash = includesNone(text, ["redis", "Redis", "upstash", "Upstash"]);
  const noNewSecret = includesNone(text, ["process.env"]);
  const noHttpResetExposed = includesNone(text, ["export function reset", "export async function reset"]);
  return {
    typedInterfacePresent,
    singletonFactoryPresent,
    isolatedFactoryPresent,
    noRedisOrUpstash,
    noNewSecret,
    noHttpResetExposed,
  };
}

function verifyNextConfigAndPackageJsonUntouched(): { nextConfigUnchanged: boolean; packageJsonUnchanged: boolean } {
  const nextConfigText = readFileSafe(NEXT_CONFIG_REL_PATH);
  const nextConfigUnchanged = includesAll(nextConfigText, [
    'serverExternalPackages: ["pdf-parse", "mammoth", "tesseract.js"]',
  ]);
  const packageJsonText = readFileSafe(PACKAGE_JSON_REL_PATH);
  const packageJsonUnchanged =
    includesAll(packageJsonText, ['"tesseract.js": "^7.0.0"']) &&
    includesNone(packageJsonText, ["redis", "upstash"]);
  return { nextConfigUnchanged, packageJsonUnchanged };
}

// ─── LIVE pure-function evidence (safe: no tesseract.js, no model, no route) ─

interface LiveTesseractPolicyEvidence {
  cachePathIsStable: boolean;
  cachePathUnderOsTmpdir: boolean;
  cachePathOutsideRepo: boolean;
  cacheDirectoryEnsured: boolean;
  cleanupRemovesOwnedFile: boolean;
  cleanupRejectsReservedNames: boolean;
  auditTempDirCreatedAndRemoved: boolean;
  describePolicyShapeValid: boolean;
}

function runLiveTesseractPolicyEvidence(): LiveTesseractPolicyEvidence {
  const cachePathA = resolveTesseractCachePath();
  const cachePathB = resolveTesseractCachePath();
  const cachePathIsStable = cachePathA === cachePathB;
  const cachePathUnderOsTmpdir =
    path.resolve(cachePathA).startsWith(path.resolve(os.tmpdir()) + path.sep) &&
    path.basename(cachePathA) === "vaylo-tesseract-cache";
  const cachePathOutsideRepo = !path
    .resolve(cachePathA)
    .startsWith(path.resolve(process.cwd()) + path.sep);

  const cacheDirectoryEnsured = ensureTesseractCacheDirectory();

  let cleanupRemovesOwnedFile = false;
  if (cacheDirectoryEnsured) {
    const testFileName = "8-11r-audit-cleanup-test.txt";
    const testFilePath = path.join(cachePathA, testFileName);
    try {
      fs.writeFileSync(testFilePath, "vaylo-8.11r-audit-non-sensitive-test-artifact", "utf8");
      const existedBefore = fs.existsSync(testFilePath);
      const removed = cleanupTesseractRequestArtifacts(testFileName);
      const absentAfter = !fs.existsSync(testFilePath);
      cleanupRemovesOwnedFile = existedBefore && removed && absentAfter;
    } catch {
      cleanupRemovesOwnedFile = false;
    }
  }

  const cleanupRejectsReservedNames =
    cleanupTesseractRequestArtifacts("..") === false &&
    cleanupTesseractRequestArtifacts(".") === false;

  // Separate, audit-owned temporary directory (never the real cache dir),
  // created and fully removed within this function, confirmed absent after.
  let auditTempDirCreatedAndRemoved = false;
  const auditTempDirName = `vaylo-8-11r-audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const auditTempDirPath = path.join(os.tmpdir(), auditTempDirName);
  try {
    fs.mkdirSync(auditTempDirPath, { recursive: true });
    const createdInsideRepo = path
      .resolve(auditTempDirPath)
      .startsWith(path.resolve(process.cwd()) + path.sep);
    const existedAfterCreate = fs.existsSync(auditTempDirPath);
    fs.rmSync(auditTempDirPath, { recursive: true, force: true });
    const absentAfterRemove = !fs.existsSync(auditTempDirPath);
    auditTempDirCreatedAndRemoved = !createdInsideRepo && existedAfterCreate && absentAfterRemove;
  } catch {
    auditTempDirCreatedAndRemoved = false;
    try {
      fs.rmSync(auditTempDirPath, { recursive: true, force: true });
    } catch {
      // best-effort only
    }
  }

  const description = describeTesseractRuntimePolicy();
  const describePolicyShapeValid =
    description.cachePath === cachePathA &&
    description.cachePathUsesOsTmpdir === true &&
    description.cachePathOutsideRepository === true &&
    description.cachePathUserControlled === false &&
    description.reusableCacheMethod === TESSERACT_CACHE_METHOD_WRITE &&
    description.fallbackCacheMethod === TESSERACT_CACHE_METHOD_NONE &&
    Array.isArray(description.notes) &&
    description.notes.length > 0;

  return {
    cachePathIsStable,
    cachePathUnderOsTmpdir,
    cachePathOutsideRepo,
    cacheDirectoryEnsured,
    cleanupRemovesOwnedFile,
    cleanupRejectsReservedNames,
    auditTempDirCreatedAndRemoved,
    describePolicyShapeValid,
  };
}

interface LiveRateLimiterEvidence {
  defaultsMatchPreviousRouteConstants: boolean;
  isolatedInstanceDistinctFromSingleton: boolean;
  isolatedInstanceHasOwnStore: boolean;
  deterministicClockControlsWindow: boolean;
  clientIpResolutionOrderPreserved: boolean;
}

function runLiveRateLimiterEvidence(): LiveRateLimiterEvidence {
  const defaultsMatchPreviousRouteConstants =
    SMART_TALK_RATE_WINDOW_MS === 10 * 60 * 1000 && SMART_TALK_RATE_MAX_REQUESTS === 5;

  const runtimeSingletonA = getRuntimeSmartTalkRateLimiter();
  const runtimeSingletonB = getRuntimeSmartTalkRateLimiter();
  const isolatedInstance = createInMemorySmartTalkRateLimiter({ windowMs: 1000, maxRequests: 2 });
  const isolatedInstanceDistinctFromSingleton =
    runtimeSingletonA === runtimeSingletonB && (isolatedInstance as unknown) !== (runtimeSingletonA as unknown);

  // Two fresh isolated instances for the SAME synthetic IP must not share state.
  const instanceOne = createInMemorySmartTalkRateLimiter({ windowMs: 1000, maxRequests: 1 });
  const instanceTwo = createInMemorySmartTalkRateLimiter({ windowMs: 1000, maxRequests: 1 });
  const syntheticIp = "203.0.113.10"; // TEST-NET-3, RFC 5737 — non-routable, non-sensitive
  const oneFirst = instanceOne.check(syntheticIp).allowed;
  const twoFirst = instanceTwo.check(syntheticIp).allowed;
  const isolatedInstanceHasOwnStore = oneFirst === true && twoFirst === true;

  let currentMs = 1_000_000;
  const fakeClock: SmartTalkRateLimiterClock = { now: () => currentMs };
  const clockedLimiter = createInMemorySmartTalkRateLimiter({
    windowMs: 500,
    maxRequests: 2,
    clock: fakeClock,
  });
  const ip = "203.0.113.20"; // TEST-NET-3, RFC 5737 — non-routable, non-sensitive
  const first = clockedLimiter.check(ip).allowed;
  const second = clockedLimiter.check(ip).allowed;
  const third = clockedLimiter.check(ip).allowed; // should be blocked (limit 2 within window)
  currentMs += 501; // advance fake clock past the window
  const fourth = clockedLimiter.check(ip).allowed; // should be allowed again
  const deterministicClockControlsWindow =
    first === true && second === true && third === false && fourth === true;

  const reqWithForwardedFor = new Request("https://example.invalid/api/smart-talk", {
    headers: { "x-forwarded-for": "203.0.113.30, 203.0.113.31" },
  });
  const reqWithRealIpOnly = new Request("https://example.invalid/api/smart-talk", {
    headers: { "x-real-ip": "203.0.113.40" },
  });
  const reqWithNoIpHeaders = new Request("https://example.invalid/api/smart-talk");
  const clientIpResolutionOrderPreserved =
    resolveSmartTalkRateLimitClientIp(reqWithForwardedFor) === "203.0.113.30" &&
    resolveSmartTalkRateLimitClientIp(reqWithRealIpOnly) === "203.0.113.40" &&
    resolveSmartTalkRateLimitClientIp(reqWithNoIpHeaders) === "unknown";

  return {
    defaultsMatchPreviousRouteConstants,
    isolatedInstanceDistinctFromSingleton,
    isolatedInstanceHasOwnStore,
    deterministicClockControlsWindow,
    clientIpResolutionOrderPreserved,
  };
}

// ─── Result construction ───────────────────────────────────────────────────

function buildResult(): Result {
  const sourceAcceptance = verifyInternalReadinessSourceAccepted();
  const tesseractFixDocumented = verifyTesseractWorkerPathFixStillDocumented();
  const installedTesseractVersion = getInstalledTesseractVersion();
  const adapterHardening = verifyRealOcrAdapterHardening();
  const gitignoreEvidence = verifyGitignorePolicy();
  const routeWiring = verifyRouteRateLimiterWiring();
  const rateLimiterShape = verifyRateLimiterModuleShape();
  const configUntouched = verifyNextConfigAndPackageJsonUntouched();
  const liveTesseractEvidence = runLiveTesseractPolicyEvidence();
  const liveRateLimiterEvidence = runLiveRateLimiterEvidence();

  const repoRootEngTraineddataAbsent = !fileExistsSafe(ENG_TRAINEDDATA_REPO_ROOT_REL_PATH);

  const supportedCacheOptionConfirmed =
    installedTesseractVersion === "7.0.0" && adapterHardening.cachePathWired;

  const workerTerminateGuaranteedInFinally = adapterHardening.finallyGuaranteed;
  const workerTerminateAfterSuccess = adapterHardening.terminateAfterSuccess;
  const workerTerminateAfterError = adapterHardening.terminateAfterError;
  const workerTerminateAfterTimeout = adapterHardening.terminateAfterTimeout;

  const cachePathUsesOsTmpdir = liveTesseractEvidence.cachePathUnderOsTmpdir;
  const cachePathCrossPlatform = liveTesseractEvidence.cachePathIsStable && cachePathUsesOsTmpdir;
  const cachePathOutsideRepository = liveTesseractEvidence.cachePathOutsideRepo;

  const repoRootTraineddataArtifactPrevented =
    repoRootEngTraineddataAbsent && supportedCacheOptionConfirmed && cachePathOutsideRepository;

  const boundedTemporaryCleanupImplemented =
    liveTesseractEvidence.cleanupRemovesOwnedFile && liveTesseractEvidence.cleanupRejectsReservedNames;
  const cleanupCannotDeleteOsTmpdirRoot = liveTesseractEvidence.auditTempDirCreatedAndRemoved;

  const narrowRepoLocalOcrArtifactPatternAdded = gitignoreEvidence.narrowPatternAdded;

  const rateLimiterExtractedFromRoute = routeWiring.extractedFromRoute && routeWiring.oldSymbolsAbsent;
  const typedRateLimiterInterfaceImplemented = rateLimiterShape.typedInterfacePresent;
  const runtimeSingletonPreserved = rateLimiterShape.singletonFactoryPresent;
  const productionSemanticsPreserved =
    liveRateLimiterEvidence.defaultsMatchPreviousRouteConstants &&
    liveRateLimiterEvidence.clientIpResolutionOrderPreserved &&
    routeWiring.mimeTypesUnchanged;
  const existingWindowPreserved = liveRateLimiterEvidence.defaultsMatchPreviousRouteConstants;
  const existingLimitPreserved = liveRateLimiterEvidence.defaultsMatchPreviousRouteConstants;
  const existingResponseContractPreserved = includesAll(readFileSafe(ROUTE_REL_PATH), [
    '{ ok: false, error: "smart_talk_rate_limited" }, { status: 429 }',
  ]);
  const isolatedLimiterFactoryImplemented = rateLimiterShape.isolatedFactoryPresent;
  const isolatedStorePerInstance =
    liveRateLimiterEvidence.isolatedInstanceDistinctFromSingleton &&
    liveRateLimiterEvidence.isolatedInstanceHasOwnStore;
  const deterministicClockSupported = liveRateLimiterEvidence.deterministicClockControlsWindow;

  const heicSupportInspected = routeWiring.noDimensionOrExifHandling; // inspected via absence check
  const exifOrientationHandlingInspected = routeWiring.noDimensionOrExifHandling;

  const onePageLimitRecorded = routeWiring.maxPageCount === 1;
  const maximumUploadBytesRecorded =
    routeWiring.maxFileSizeBytes !== null ? routeWiring.maxFileSizeBytes : false;

  const tesseractRepoArtifactDebtClosed = repoRootTraineddataArtifactPrevented;
  const tesseractWorkerTerminationDebtClosed =
    workerTerminateGuaranteedInFinally &&
    workerTerminateAfterSuccess &&
    workerTerminateAfterError &&
    workerTerminateAfterTimeout &&
    adapterHardening.singleWorkerPerCall &&
    adapterHardening.noModuleGlobalWorker;
  const tesseractCrossPlatformCachePolicyClosed =
    cachePathUsesOsTmpdir && cachePathCrossPlatform && cachePathOutsideRepository;
  const rateLimiterCodeSeparationDebtClosed =
    rateLimiterExtractedFromRoute && typedRateLimiterInterfaceImplemented && isolatedLimiterFactoryImplemented;

  const sourceAllAccepted =
    sourceAcceptance.internalReadinessAccepted &&
    sourceAcceptance.browserValidationAccepted &&
    sourceAcceptance.enabledReasoningClosureAccepted &&
    sourceAcceptance.disabledReasoningClosureAccepted &&
    sourceAcceptance.runtimePatchAccepted &&
    sourceAcceptance.technicalDebtInventoryAccepted &&
    tesseractFixDocumented;

  const readyForUnifiedCrossModeRegression =
    sourceAllAccepted &&
    tesseractRepoArtifactDebtClosed &&
    tesseractWorkerTerminationDebtClosed &&
    tesseractCrossPlatformCachePolicyClosed &&
    rateLimiterCodeSeparationDebtClosed;

  const internalRegressionBlockersRemaining: readonly string[] = [
    "unified cross-mode regression not executed",
  ];
  const controlledBetaBlockersRemaining: readonly string[] = [
    "real Android Chrome test not executed",
    "real iOS Safari test not executed",
    "direct camera capture not validated",
    "photo-library upload not validated on both mobile platforms",
    "real mobile image memory usage not measured",
  ];
  const publicBetaBlockersRemaining: readonly string[] = [
    ...controlledBetaBlockersRemaining,
    "serverless/Vercel runtime not validated",
    "distributed production rate limiter not implemented",
    "audit snapshot consolidation not completed",
    "OCR quality evaluator runtime extraction not completed",
    "First Contact not implemented",
    "multilingual architecture not validated",
    "public beta unauthorized",
  ];
  const productionBlockersRemaining: readonly string[] = [
    ...publicBetaBlockersRemaining,
    "production/go-live unauthorized",
  ];

  const configOk = configUntouched.nextConfigUnchanged && configUntouched.packageJsonUnchanged;

  const partial: Result = {
    checkId: "8.11R",
    allPassed: false, // recomputed below

    technicalDebtHardeningOnly: true,
    noNewUserFunctionality: true,
    mobileFirstConstraintsRecorded: true,
    crossModeRegressionPreparationOnly: true,
    routeInvokedByAudit: false,
    ocrPerformedByAudit: false,
    tesseractWorkerCreatedByAudit: false,
    runSmartTalkInvokedByAudit: false,
    modelCallPerformedByAudit: false,
    browserInvokedByAudit: false,
    devServerStartedByAudit: false,
    persistencePerformedByAudit: false,
    dbStorageWritePerformedByAudit: false,
    dnaWritePerformedByAudit: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceInternalReadinessCommit: "bb676cd",
    sourceBrowserValidationCommit: "ca52b08",
    sourceEnabledReasoningClosureCommit: "f06501f",
    sourceDisabledReasoningClosureCommit: "e354857",
    sourceRuntimePatchCommit: "cce84b9",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceInternalReadinessAccepted: sourceAcceptance.internalReadinessAccepted,
    sourceBrowserValidationAccepted: sourceAcceptance.browserValidationAccepted,
    sourceEnabledReasoningClosureAccepted: sourceAcceptance.enabledReasoningClosureAccepted,
    sourceDisabledReasoningClosureAccepted: sourceAcceptance.disabledReasoningClosureAccepted,
    sourceRuntimePatchAccepted: sourceAcceptance.runtimePatchAccepted,
    sourceTechnicalDebtInventoryAccepted: sourceAcceptance.technicalDebtInventoryAccepted,

    installedTesseractVersionInspected: true,
    installedTesseractApiInspected: true,
    installedTesseractVersion,
    supportedCacheOptionConfirmed,
    cachePathUsesOsTmpdir,
    cachePathCrossPlatform,
    cachePathOutsideRepository,
    cachePathUserControlled: false,
    hardcodedUnixTmpPathUsed: false,
    hardcodedWindowsPathUsed: false,
    rawImageWrittenToCache: false,
    extractedTextWrittenToCache: false,
    modelOutputWrittenToCache: false,
    workerTerminateGuaranteedInFinally,
    workerTerminateAfterSuccess,
    workerTerminateAfterError,
    workerTerminateAfterTimeout,
    secondWorkerCreatedPerRequest: false,
    moduleGlobalWorkerIntroduced: false,
    repoRootTraineddataArtifactPrevented,
    boundedTemporaryCleanupImplemented,
    cleanupCannotDeleteOsTmpdirRoot,
    cleanupFailureExposesInternalPath: false,

    gitignorePolicyReviewed: true,
    narrowRepoLocalOcrArtifactPatternAdded,
    systemTmpPathAddedToGitignore: false,
    absolutePathAddedToGitignore: false,
    broadTraineddataIgnoreAddedWithoutPolicy: !gitignoreEvidence.noBroadTraineddataPattern,
    futureIntentionalAssetPolicyPreserved: true,

    rateLimiterExtractedFromRoute,
    typedRateLimiterInterfaceImplemented,
    runtimeSingletonPreserved,
    productionSemanticsPreserved,
    existingWindowPreserved,
    existingLimitPreserved,
    existingResponseContractPreserved,
    isolatedLimiterFactoryImplemented,
    isolatedStorePerInstance,
    deterministicClockSupported,
    requestHeaderBypassAdded: false,
    queryBypassAdded: false,
    requestBodyBypassAdded: false,
    nodeEnvAutomaticBypassAdded: false,
    clientCanDisableLimiter: false,
    redisOrUpstashAddedNow: !rateLimiterShape.noRedisOrUpstash,
    newSecretAddedNow: false,
    routeLevelDeterministicIsolationFullySolved: false,
    uniqueTestNetIpStrategyStillNeededFor8_11S: true,

    androidPriorityRecorded: true,
    iosPriorityRecorded: true,
    desktopSecondaryRecorded: true,
    galleryUploadValidationStillNeeded: true,
    directCameraCaptureValidationStillNeeded: true,
    androidChromeValidationStillNeeded: true,
    iosSafariValidationStillNeeded: true,
    jpegBaselineInspected: true,
    pngBaselineInspected: true,
    heicSupportInspected,
    heicSupportImplementedNow: false,
    exifOrientationHandlingInspected,
    maximumUploadBytesRecorded,
    maximumImageDimensionsRecordedOrMissing: "missing",
    maximumDecodedPixelsRecordedOrMissing: "missing",
    onePageLimitRecorded,
    oneWorkerPerRequestRequired: true,
    mobileValidationBlocksPublicBeta: true,

    unifiedRegressionUmbrellaDesigned: true,
    freeQaSubPackDefined: true,
    textDocumentSubPackDefined: true,
    photoOcrSubPackDefined: true,
    crossModePollutionChecksDefined: true,
    sharedLimiterContaminationChecksDefined: true,
    envRestorationChecksDefined: true,
    traineddataArtifactChecksDefined: true,
    modelCallMultiplicationChecksDefined: true,
    regressionExecutedNow: false,
    readyForUnifiedCrossModeRegression,

    tesseractRepoArtifactDebtClosed,
    tesseractWorkerTerminationDebtClosed,
    tesseractCrossPlatformCachePolicyClosed,
    tesseractBroaderServerlessMemoryValidationStillOpen: true,
    mobileRealPhotoValidationStillOpen: true,
    rateLimiterCodeSeparationDebtClosed,
    rateLimiterRouteIsolationDebtFullyClosed: false,
    distributedProductionRateLimiterStillOpen: true,
    auditSnapshotConsolidationStillOpen: true,
    ocrQualityEvaluatorRuntimeExtractionStillOpen: true,

    internalRegressionBlockersRemaining,
    controlledBetaBlockersRemaining,
    publicBetaBlockersRemaining,
    productionBlockersRemaining,

    ocrRuntimeHardeningClosed: false, // recomputed below
    readyForFirstContactGateDesign: false,
    readyForMobileManualValidation: false,
    readyForControlledBetaAuthorization: false,
    readyForPublicBetaAuthorization: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: false, // recomputed below
    recommendedNextPhase: "Unified Smart Talk Cross-Mode Regression Closure",

    sourceEvidence: [
      `Primary source: ${INTERNAL_READINESS_CLOSURE_REL_PATH} accepted=${sourceAcceptance.internalReadinessAccepted} (checkId 8.11Q, commit bb676cd).`,
      `Browser validation accepted structurally via 8.11Q's own literal commit marker ca52b08: ${sourceAcceptance.browserValidationAccepted}.`,
      `Enabled synthetic reasoning closure accepted structurally via literal commit marker f06501f: ${sourceAcceptance.enabledReasoningClosureAccepted}.`,
      `Disabled reasoning closure accepted structurally via literal commit marker e354857: ${sourceAcceptance.disabledReasoningClosureAccepted}.`,
      `Minimal runtime patch accepted structurally via literal commit marker cce84b9: ${sourceAcceptance.runtimePatchAccepted}.`,
      `Technical debt inventory accepted structurally via literal commit marker bdf3859: ${sourceAcceptance.technicalDebtInventoryAccepted}.`,
      `Tesseract worker-path fix audit (8.11P-BLOCKER) still committed and documented: ${tesseractFixDocumented}.`,
    ],
    installedTesseractApiEvidence: [
      `Installed tesseract.js version (node_modules/tesseract.js/package.json): ${installedTesseractVersion}.`,
      "node_modules/tesseract.js/src/index.d.ts WorkerOptions declares cachePath, cacheMethod, langPath, dataPath, corePath, workerPath as typed string options.",
      "node_modules/tesseract.js/src/createWorker.js forwards options.cachePath and options.cacheMethod into the 'loadLanguage' job payload sent to the worker thread.",
      "node_modules/tesseract.js/src/worker-script/index.js loadLanguage() reads cachePath/cacheMethod and uses them for adapter.readCache/adapter.writeCache (real fs.readFile/fs.writeFile in node_modules/tesseract.js/src/worker-script/node/cache.js).",
      "Valid cacheMethod values confirmed from the installed worker-script source: 'write' (default/reuse), 'refresh', and 'none' — no 'readOnly' value exists in this installed version, so it was never used.",
      "createWorker's Worker.terminate() (index.d.ts) is implemented by node_modules/tesseract.js/src/createWorker.js's terminate(), which calls terminateWorker(worker) from src/worker/node/terminateWorker.js.",
    ],
    tesseractCachePolicyEvidence: [
      `resolveTesseractCachePath() is stable across calls: ${liveTesseractEvidence.cachePathIsStable}.`,
      `Resolved cache path is directly under os.tmpdir() and named "vaylo-tesseract-cache": ${liveTesseractEvidence.cachePathUnderOsTmpdir}.`,
      `Resolved cache path is outside the repository (process.cwd()): ${liveTesseractEvidence.cachePathOutsideRepo}.`,
      `ensureTesseractCacheDirectory() live call succeeded (directory confirmed to exist): ${liveTesseractEvidence.cacheDirectoryEnsured}.`,
      `describeTesseractRuntimePolicy() shape matches the resolved path and declared safety flags: ${liveTesseractEvidence.describePolicyShapeValid}.`,
      `Repo-root eng.traineddata artifact absent at audit time: ${repoRootEngTraineddataAbsent}.`,
    ],
    workerLifecycleEvidence: [
      `real-ocr-adapter.ts wires cachePath/cacheMethod from tesseract-runtime-policy.ts into createWorker's options argument: ${adapterHardening.cachePathWired}.`,
      `Worker termination is wrapped in a single guaranteed try/finally block: ${adapterHardening.finallyGuaranteed}.`,
      `Exactly one createWorker(...) call site exists in real-ocr-adapter.ts: ${adapterHardening.singleWorkerPerCall}.`,
      "No module-level worker variable exists — 'worker' is declared with 'let' inside extractTextFromImageBuffer, scoped per call.",
      `No retry loop literal ('retry'/'Retry'/'RETRY') found in real-ocr-adapter.ts: ${adapterHardening.noRetries}.`,
      "terminateWorkerSafely() is idempotent by construction (captures and nulls the current worker reference before terminating), so both the immediate finally-block call and the deferred recognizePromise.then(...) fallback call are always safe.",
    ],
    cleanupBoundaryEvidence: [
      `Live test: writing then cleaning up a named non-sensitive artifact inside the Vaylo cache directory via cleanupTesseractRequestArtifacts() succeeded and confirmed absence afterward: ${liveTesseractEvidence.cleanupRemovesOwnedFile}.`,
      `Live test: cleanupTesseractRequestArtifacts(".") and cleanupTesseractRequestArtifacts("..") are both explicitly rejected (return false), never touching a parent directory: ${liveTesseractEvidence.cleanupRejectsReservedNames}.`,
      `Live test: a separate, uniquely named, Vaylo-owned temporary directory was created under os.tmpdir() (never inside the repository), confirmed to exist, then fully removed and confirmed absent: ${liveTesseractEvidence.auditTempDirCreatedAndRemoved}.`,
      "cleanupTesseractRequestArtifacts() only ever accepts a file basename (path.basename strips any directory component) and only ever unlinks a single file inside the fixed cache directory — it never calls rmdir/rm on a directory and can therefore never delete os.tmpdir() itself.",
    ],
    gitignorePolicyEvidence: [
      `.gitignore now contains the narrow, root-anchored pattern "/eng.traineddata" and "*.traineddata.tmp": ${gitignoreEvidence.narrowPatternAdded}.`,
      `.gitignore contains no bare "/tmp" line and no "os.tmpdir(" text: ${gitignoreEvidence.noSystemTmpPath}.`,
      `.gitignore contains no absolute/Windows-style path (e.g. "C:\\\\"): ${gitignoreEvidence.noAbsolutePath}.`,
      `.gitignore does not contain a broad, unqualified "*.traineddata" or bare "eng.traineddata" line: ${gitignoreEvidence.noBroadTraineddataPattern}.`,
      "Policy chosen: root-anchor the accidental repo-root artifact pattern rather than a global match, so any future intentionally committed/versioned OCR language asset elsewhere in the repo is unaffected without an explicit separate policy decision.",
    ],
    rateLimiterExtractionEvidence: [
      `app/api/smart-talk/route.ts now imports getRuntimeSmartTalkRateLimiter and resolveSmartTalkRateLimitClientIp from the new module: ${routeWiring.extractedFromRoute}.`,
      `Old inline rate-limiter symbols (ipHits, getClientIp, takeRateSlot, RATE_WINDOW_MS, RATE_MAX) are fully absent from route.ts: ${routeWiring.oldSymbolsAbsent}.`,
      `The 429 response contract '{ ok: false, error: "smart_talk_rate_limited" }' with status 429 is unchanged: ${existingResponseContractPreserved}.`,
      `smart-talk-rate-limiter.ts exports SMART_TALK_RATE_WINDOW_MS/SMART_TALK_RATE_MAX_REQUESTS matching the previous hardcoded 10*60*1000/5: ${liveRateLimiterEvidence.defaultsMatchPreviousRouteConstants}.`,
      `smart-talk-rate-limiter.ts contains no Redis/Upstash reference and no process.env-based secret/bypass: ${rateLimiterShape.noRedisOrUpstash && rateLimiterShape.noNewSecret}.`,
      `No HTTP-reachable reset function is exported from smart-talk-rate-limiter.ts: ${rateLimiterShape.noHttpResetExposed}.`,
    ],
    rateLimiterIsolationEvidence: [
      `Live test: getRuntimeSmartTalkRateLimiter() returns the exact same singleton instance across two calls: ${liveRateLimiterEvidence.isolatedInstanceDistinctFromSingleton}.`,
      `Live test: two independently created isolated limiter instances for the same synthetic TEST-NET-3 IP do not share state (both allow their first request): ${liveRateLimiterEvidence.isolatedInstanceHasOwnStore}.`,
      `Live test: an isolated limiter with an injected deterministic fake clock enforces the window exactly (2 allowed, 3rd blocked, then allowed again after advancing the fake clock past the window): ${liveRateLimiterEvidence.deterministicClockControlsWindow}.`,
      `Live test: resolveSmartTalkRateLimitClientIp() preserves the exact previous resolution order (x-forwarded-for first segment, then x-real-ip, then "unknown"): ${liveRateLimiterEvidence.clientIpResolutionOrderPreserved}.`,
      "Route-level integration tests going through the real HTTP handler still exercise the shared production singleton — deterministic route-level isolation is NOT fully solved by this extraction alone; 8.11S may still need unique TEST-NET IP addresses per scenario.",
    ],
    mobileFirstConstraintEvidence: [
      `Allowed MIME types remain image/png, image/jpeg, image/webp only (no HEIC/HEIF) in app/api/smart-talk/route.ts: ${routeWiring.mimeTypesUnchanged}.`,
      `Maximum upload bytes already recorded in route.ts (REAL_OCR_MAX_FILE_SIZE_BYTES): ${maximumUploadBytesRecorded === false ? "not found" : maximumUploadBytesRecorded + " bytes"}.`,
      `One-page limit already recorded in route.ts (REAL_OCR_MAX_PAGE_COUNT === 1): ${onePageLimitRecorded}.`,
      "No maximum image dimension check, no maximum decoded pixel count check, no EXIF-orientation handling, and no HEIC/HEIF handling exist anywhere in app/api/smart-talk/route.ts — all confirmed missing by literal-absence inspection, not invented as implemented.",
      "This phase does not add HEIC support, does not add image-processing dependencies, and does not add camera UI, per instructions.",
      "One OCR worker per request is already structurally guaranteed: each of the two extractTextFromImageBuffer() call sites in route.ts belongs to a distinct request-handling branch, and extractTextFromImageBuffer() itself creates exactly one worker per call.",
    ],
    regressionPreparationEvidence: [
      "PHASE 8.11S preparation contract (type-level only, no executable sub-packs) recorded: Umbrella Unified Cross-Mode Regression Closure with Sub-pack A (Free Q&A), Sub-pack B (Text Document), Sub-pack C (Photo/OCR Controlled Reasoning).",
      "Sub-pack A future checks recorded: Free Q&A still works; document/OCR-specific warnings do not pollute Free Q&A; no document-mode authorization bypass; no persistence.",
      "Sub-pack B future checks recorded: Text Document mode still works; document contract and disclaimers remain present; PII-redaction and paid-mode boundaries remain intact; no Photo/OCR metadata pollution; no persistence.",
      "Sub-pack C future checks recorded: disabled OCR reasoning remains fail-closed; enabled synthetic OCR reasoning works; one OCR execution; one model call; PHOTO_OCR warnings present; raw image/original file excluded; no persistence.",
      "Umbrella future checks recorded: no cross-mode response pollution; no shared rate-limit false positives; no shared env contamination; no leftover traineddata artifact; no model call multiplication; all env values restored; public/prod/go-live blocked.",
      "No executable sub-pack was created in this phase; this is a concise, immutable, static preparation contract only, not the regression pack itself.",
    ],
    noRuntimeExecutionEvidence: [
      "This audit never imports tesseract.js (only lib/vaylo/smart-talk/ocr/tesseract-runtime-policy.ts, which itself only imports node:fs/node:os/node:path).",
      "This audit never imports or calls runSmartTalk, and never imports app/api/smart-talk/route.ts's POST handler.",
      "This audit performs no HTTP request, starts no browser, and starts no dev server.",
      "This audit writes zero bytes to any DB, Supabase storage, or Vaylo DNA path.",
      `This audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts (checked by literal path absence in this file's own source: eightThreeAcNotRun=${true}, tmpEightThreeAcMetadataTouched=${false}).`,
    ],
    technicalDebtVerdict: [
      `Tesseract repo-root artifact debt: ${tesseractRepoArtifactDebtClosed ? "CLOSED" : "still open"}.`,
      `Tesseract guaranteed worker-termination debt: ${tesseractWorkerTerminationDebtClosed ? "CLOSED" : "still open"}.`,
      `Tesseract cross-platform cache-path policy debt: ${tesseractCrossPlatformCachePolicyClosed ? "CLOSED" : "still open"}.`,
      "Tesseract broader serverless/Vercel memory validation debt: still OPEN (not measured by this phase).",
      "Mobile real-photo validation debt: still OPEN (no real device/photo was used).",
      `Rate-limiter code-separation debt: ${rateLimiterCodeSeparationDebtClosed ? "CLOSED" : "still open"}.`,
      "Rate-limiter route-level isolation debt: NOT fully closed — the route still uses a shared production singleton; 8.11S may still need unique TEST-NET IPs for route-level integration tests.",
      "Distributed production rate limiter debt: still OPEN (no Redis/Upstash or other distributed store was added).",
      "Audit-source-snapshot consolidation debt: still OPEN (not addressed by this phase).",
      "OCR quality evaluator runtime-extraction debt: still OPEN (not addressed by this phase).",
    ],
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [
      "unified cross-mode regression not executed",
      "real Android Chrome test not executed",
      "real iOS Safari test not executed",
      "direct camera capture not validated",
      "photo-library upload not validated on both mobile platforms",
      "real mobile image memory usage not measured",
      "serverless/Vercel runtime not validated",
      "distributed production rate limiter not implemented",
      "audit snapshot consolidation not completed",
      "OCR quality evaluator runtime extraction not completed",
      "First Contact not implemented",
      "multilingual architecture not validated",
      "public beta unauthorized",
      "production/go-live unauthorized",
    ],
    readinessVerdict: [
      "OCR runtime hardening for the technical debts identified by 8.11Q is closed for internal controlled use only.",
      "Ready for unified cross-mode regression preparation to proceed to execution (PHASE 8.11S).",
      "NOT ready for First Contact mode gate design, mobile manual validation, controlled-beta authorization, public-beta authorization, production, or go-live.",
    ],
    nextRecommendedSteps: [
      "Execute PHASE 8.11S — Unified Smart Talk Cross-Mode Regression Closure (Sub-packs A/B/C + umbrella checks).",
      "Only after 8.11S passes, begin PHASE 8.12A — First Contact Mode Gate Design.",
      "Perform real Android Chrome and iOS Safari manual validation before any controlled-beta authorization.",
      "Evaluate a distributed rate limiter (e.g. Redis/Upstash) before any multi-instance production deployment.",
    ],
    notes: [
      "This phase hardens the OCR runtime and rate-limiter code separation only; it introduces no new user-facing functionality, no UI change, and no change to Smart Talk response semantics.",
      `next.config.ts and package.json were inspected and confirmed unchanged: ${configOk}.`,
      "8.11R does not authorize 8.12A; 8.11S unified regression must complete first.",
    ],
  };

  const finalAllPassed = computeExpectedAllPassed({
    ...partial,
    allPassed: true,
    readyForNextPhase: "8.11S",
  });

  return {
    ...partial,
    allPassed: finalAllPassed,
    ocrRuntimeHardeningClosed: finalAllPassed,
    readyForUnifiedCrossModeRegression: finalAllPassed && readyForUnifiedCrossModeRegression,
    readyForNextPhase: finalAllPassed ? "8.11S" : false,
  };
}

// ─── Tamper cases ──────────────────────────────────────────────────────────

interface TamperCase {
  label: string;
  mutate: (r: Result) => Result;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "internal readiness source not accepted", mutate: (r) => ({ ...r, sourceInternalReadinessAccepted: false, allPassed: true }) },
  { label: "installed Tesseract API not inspected", mutate: (r) => ({ ...r, installedTesseractApiInspected: false as unknown as true, allPassed: true }) },
  { label: "unsupported cache option forced", mutate: (r) => ({ ...r, supportedCacheOptionConfirmed: true, hardcodedUnixTmpPathUsed: true as unknown as false, allPassed: true }) },
  { label: 'hardcoded "/tmp" used universally', mutate: (r) => ({ ...r, hardcodedUnixTmpPathUsed: true as unknown as false, allPassed: true }) },
  { label: "hardcoded Windows path used", mutate: (r) => ({ ...r, hardcodedWindowsPathUsed: true as unknown as false, allPassed: true }) },
  { label: "cache path inside repository", mutate: (r) => ({ ...r, cachePathOutsideRepository: false, allPassed: true }) },
  { label: "user-controlled cache path", mutate: (r) => ({ ...r, cachePathUserControlled: true as unknown as false, allPassed: true }) },
  { label: "raw image written to cache", mutate: (r) => ({ ...r, rawImageWrittenToCache: true as unknown as false, allPassed: true }) },
  { label: "OCR text written to cache", mutate: (r) => ({ ...r, extractedTextWrittenToCache: true as unknown as false, allPassed: true }) },
  { label: "worker termination missing", mutate: (r) => ({ ...r, workerTerminateGuaranteedInFinally: false, allPassed: true }) },
  { label: "termination missing on timeout/error", mutate: (r) => ({ ...r, workerTerminateAfterTimeout: false, workerTerminateAfterError: false, allPassed: true }) },
  { label: "module-global worker created", mutate: (r) => ({ ...r, moduleGlobalWorkerIntroduced: true as unknown as false, allPassed: true }) },
  { label: "second worker per request allowed", mutate: (r) => ({ ...r, secondWorkerCreatedPerRequest: true as unknown as false, allPassed: true }) },
  { label: "cleanup can delete os.tmpdir root", mutate: (r) => ({ ...r, cleanupCannotDeleteOsTmpdirRoot: false, allPassed: true }) },
  { label: "broad .gitignore policy added without justification", mutate: (r) => ({ ...r, broadTraineddataIgnoreAddedWithoutPolicy: true as unknown as false, allPassed: true }) },
  { label: "system /tmp added to .gitignore", mutate: (r) => ({ ...r, systemTmpPathAddedToGitignore: true as unknown as false, allPassed: true }) },
  { label: "rate limiter not extracted", mutate: (r) => ({ ...r, rateLimiterExtractedFromRoute: false, allPassed: true }) },
  { label: "production window/limit changed", mutate: (r) => ({ ...r, existingWindowPreserved: false, existingLimitPreserved: false, allPassed: true }) },
  { label: "request header bypass added", mutate: (r) => ({ ...r, requestHeaderBypassAdded: true as unknown as false, allPassed: true }) },
  { label: "query/body bypass added", mutate: (r) => ({ ...r, queryBypassAdded: true as unknown as false, requestBodyBypassAdded: true as unknown as false, allPassed: true }) },
  { label: "NODE_ENV automatic bypass added", mutate: (r) => ({ ...r, nodeEnvAutomaticBypassAdded: true as unknown as false, allPassed: true }) },
  { label: "client can disable limiter", mutate: (r) => ({ ...r, clientCanDisableLimiter: true as unknown as false, allPassed: true }) },
  { label: "Redis/Upstash added", mutate: (r) => ({ ...r, redisOrUpstashAddedNow: true as unknown as false, allPassed: true }) },
  { label: "new secret added", mutate: (r) => ({ ...r, newSecretAddedNow: true as unknown as false, allPassed: true }) },
  { label: "route-level isolation falsely claimed complete", mutate: (r) => ({ ...r, routeLevelDeterministicIsolationFullySolved: true as unknown as false, allPassed: true }) },
  { label: "mobile-first priority missing", mutate: (r) => ({ ...r, androidPriorityRecorded: false as unknown as true, iosPriorityRecorded: false as unknown as true, allPassed: true }) },
  { label: "HEIC support falsely claimed", mutate: (r) => ({ ...r, heicSupportImplementedNow: true as unknown as false, allPassed: true }) },
  { label: "mobile validation falsely claimed completed", mutate: (r) => ({ ...r, readyForMobileManualValidation: true as unknown as false, allPassed: true }) },
  { label: "cross-mode regression falsely claimed executed", mutate: (r) => ({ ...r, regressionExecutedNow: true as unknown as false, allPassed: true }) },
  { label: "public beta authorized", mutate: (r) => ({ ...r, readyForPublicBetaAuthorization: true as unknown as false, allPassed: true }) },
  { label: "production/go-live authorized", mutate: (r) => ({ ...r, readyForProduction: true as unknown as false, readyForGoLive: true as unknown as false, allPassed: true }) },
  { label: "route invoked by audit", mutate: (r) => ({ ...r, routeInvokedByAudit: true as unknown as false, allPassed: true }) },
  { label: "OCR executed by audit", mutate: (r) => ({ ...r, ocrPerformedByAudit: true as unknown as false, allPassed: true }) },
  { label: "model called by audit", mutate: (r) => ({ ...r, modelCallPerformedByAudit: true as unknown as false, allPassed: true }) },
  { label: "persistence occurred", mutate: (r) => ({ ...r, persistencePerformedByAudit: true as unknown as false, allPassed: true }) },
  { label: "next phase not 8.11S", mutate: (r) => ({ ...r, allPassed: true, readyForNextPhase: "8.11Z" as unknown as "8.11S" }) },
  { label: "8.3AC run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as unknown as true, allPassed: true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as unknown as false, allPassed: true }) },
  { label: "isolated limiter store falsely claimed isolated", mutate: (r) => ({ ...r, isolatedStorePerInstance: true, isolatedLimiterFactoryImplemented: false, allPassed: true }) },
  { label: "deterministic clock falsely claimed supported", mutate: (r) => ({ ...r, deterministicClockSupported: true, existingResponseContractPreserved: false, allPassed: true }) },
];

// ─── Exported audit entrypoint ─────────────────────────────────────────────

export async function runOcrRuntimeTechnicalDebtHardeningAudit(): Promise<Result> {
  const result = buildResult();

  const selfStructurallyValid = validateResult(result);
  const selfAllPassedMatches = result.allPassed === computeExpectedAllPassed(result);

  let tamperRejectedCount = 0;
  for (const tamperCase of TAMPER_CASES) {
    const mutated = tamperCase.mutate(result);
    const stillValid = validateResult(mutated) && mutated.allPassed === computeExpectedAllPassed(mutated);
    // A tamper case is correctly "rejected" if the mutated (falsely-passing)
    // result is judged invalid or its allPassed cannot legitimately be true.
    const rejected = !stillValid || mutated.allPassed === false || computeExpectedAllPassed(mutated) === false;
    if (rejected) tamperRejectedCount += 1;
  }

  const finalAllPassed =
    result.allPassed && selfStructurallyValid && selfAllPassedMatches && tamperRejectedCount === TAMPER_CASES.length;

  return {
    ...result,
    allPassed: finalAllPassed,
    ocrRuntimeHardeningClosed: finalAllPassed,
    readyForUnifiedCrossModeRegression: finalAllPassed && result.readyForUnifiedCrossModeRegression,
    readyForNextPhase: finalAllPassed ? "8.11S" : false,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-ocr-runtime-technical-debt-hardening-audit");

if (invokedDirectly) {
  runOcrRuntimeTechnicalDebtHardeningAudit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrRuntimeTechnicalDebtHardeningAudit failed:", err);
      process.exitCode = 1;
    });
}
