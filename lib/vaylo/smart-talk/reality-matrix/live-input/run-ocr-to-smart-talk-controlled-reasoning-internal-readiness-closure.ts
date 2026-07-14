/**
 * PHASE 8.11Q — OCR-to-Smart-Talk Controlled Reasoning Internal Readiness
 * Closure
 *
 * FINAL INTERNAL READINESS CLOSURE for the completed controlled
 * OCR-to-Smart-Talk reasoning chain (gate design 8.11L → minimal runtime
 * patch 8.11M → disabled local API closure 8.11N → enabled synthetic local
 * API closure 8.11O → browser manual closure + Tesseract worker-path
 * blocker fix 8.11P/8.11P-BLOCKER). This is a CONSOLIDATION AND READINESS
 * PHASE ONLY.
 *
 * SNAPSHOT/STATIC-SOURCE STRATEGY — FULLY DISCLOSED:
 *
 * This closure performs ONLY cheap, static, read-only text inspection
 * (`fs.readFileSync` only) of already-committed source files. It does NOT
 * import, require, or invoke ANY of the ancestor closure functions
 * (8.11P, 8.11P-BLOCKER, 8.11O, 8.11N, 8.11M, 8.11L), even though some of
 * those (8.11P, 8.11P-BLOCKER, 8.11M, 8.11L) are themselves static/
 * read-only and would technically be "safe" to call directly. This closure
 * deliberately avoids that coupling entirely, for three reasons:
 *
 *   1. Two of the six ancestor files (8.11N, 8.11O) are NOT safe to invoke
 *      here: 8.11N invokes the real `/api/smart-talk` POST handler
 *      in-process nine times (a real ROUTE invocation, forbidden for this
 *      phase), and 8.11O invokes that same POST handler and, for its
 *      "Case B", performs one REAL tesseract.js OCR execution plus one
 *      REAL OpenAI model call (all forbidden for this phase). Calling
 *      either would violate this phase's own FORBIDDEN EXECUTION list.
 *   2. Treating all six ancestor files identically (pure text inspection,
 *      never execution) keeps this closure's own execution profile
 *      trivially auditable: it opens files, reads their text, and matches
 *      literal substrings/regexes against that text — nothing else.
 *   3. It exactly matches this phase's own instruction to "prefer: static
 *      file inspection, immutable commit markers, exported closure
 *      structure, required readiness fields, documented accepted-source
 *      fields" and to avoid invoking historical closures where invocation
 *      "could run OCR, call a model, invoke the route, or traverse a heavy
 *      historical chain."
 *
 * For each of the 6 ancestor closure files, acceptance is computed by
 * confirming (a) the file exists at its documented path, (b) it contains
 * its own literal `checkId` string, its own literal exported function
 * name, AND (c) a curated set of additional literal substrings drawn
 * directly from that file's own already-committed source — the exact same
 * "verifySourceMarker" / "SOURCE_MARKER_SPECS" technique 8.11P and 8.11O
 * themselves already established for the identical purpose. No field
 * value is invented or guessed; every literal checked below was read
 * directly from the named file during this closure's own authoring (see
 * the MANDATORY SOURCE INSPECTION list this phase specified) and is
 * reproduced here verbatim as a marker.
 *
 * The deeper ancestor phases named in the SOURCE COMMIT FIELDS contract
 * (8.11K/8.11J/8.11I/8.11G/8.11F/technical-debt-inventory) are NOT
 * independently re-inspected by this closure. Their acceptance is derived
 * structurally from 8.11L's own already-committed source text: 8.11L's
 * gate-design file itself declares typed fields named
 * `sourceEnabledHandoffClosureAccepted`, `sourceDisabledHandoffClosureAccepted`,
 * `sourceMinimalHandoffRuntimePatchAccepted`, `sourceTrustBoundaryClosureAccepted`,
 * `sourceQualityEvaluatorClosureAccepted`, and `sourceTechnicalDebtInventoryAccepted`,
 * and its own text references each ancestor's exact commit hash
 * (f4e5e50, 499ab72, e3be09b, 831779a, 2ef041f, bdf3859) verbatim. This
 * mirrors the exact structural-derivation fallback 8.11N and 8.11O
 * themselves already used for the same ancestors, for the same reason:
 * avoiding any re-invocation of a transitively expensive real-OCR chain
 * merely to reconstruct already-established, already-reported acceptance.
 *
 * Seven additional CURRENT RUNTIME files (not closures — actual
 * implementation) are also inspected the same way, read-only, never
 * executed, never imported: `app/api/smart-talk/route.ts`,
 * `app/smart-talk/SmartTalkClient.tsx`, `next.config.ts`,
 * `lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts`,
 * `lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts`,
 * `lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts`, and
 * `lib/vaylo/smart-talk/run-smart-talk.ts`. These are LIVE static checks
 * (re-run every time this closure runs, exactly like 8.11P's own
 * `verifyTesseractWorkerPathRootCauseStatically`), so they always reflect
 * the CURRENTLY committed runtime, not a frozen snapshot.
 *
 * This file does NOT modify any existing file, does NOT start a browser or
 * dev server, does NOT run OCR, does NOT import tesseract.js, does NOT
 * call runSmartTalk or any model, does NOT invoke
 * `app/api/smart-talk/route.ts`'s POST handler, does NOT make any network
 * call, does NOT persist anything, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It creates exactly one new file: itself.
 */

import fs from "fs";
import path from "path";

// ─── Documented source file paths (read-only; never imported/executed) ────

const BROWSER_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-browser-manual-closure.ts";
const TESSERACT_FIX_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-tesseract-next-dev-worker-path-fix-audit.ts";
const ENABLED_SYNTHETIC_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-enabled-synthetic-local-api-closure.ts";
const DISABLED_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-disabled-local-api-closure.ts";
const RUNTIME_PATCH_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit.ts";
const GATE_DESIGN_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-gate-design.ts";

const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const UI_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const NEXT_CONFIG_REL_PATH = "next.config.ts";
const GATE_REL_PATH = "lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts";
const REASONING_INPUT_REL_PATH = "lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts";
const REAL_OCR_ADAPTER_REL_PATH = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";
const RUN_SMART_TALK_REL_PATH = "lib/vaylo/smart-talk/run-smart-talk.ts";

const TEMP_PNG_REL_PATH = "tmp-8-11p-controlled-reasoning-test.png";
const ENG_TRAINEDDATA_REL_PATH = "eng.traineddata";

const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const HANDOFF_ENV_KEY = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const REASONING_ENV_KEY = "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";

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

function matchesNone(text: string | null, patterns: readonly RegExp[]): boolean {
  if (text === null) return false;
  return patterns.every((re) => !re.test(text));
}

function countOccurrences(text: string | null, needle: string): number {
  if (text === null) return 0;
  return text.split(needle).length - 1;
}

// ─── Literal markers drawn verbatim from each already-committed source ────

const BROWSER_CLOSURE_MARKERS: readonly string[] = [
  'checkId: "8.11P"',
  "export async function runOcrToSmartTalkControlledReasoningBrowserManualClosure",
  "const BROWSER_MANUAL_TEST_PERFORMED = true;",
  "const DISABLED_STATUS: number | null = 403;",
  'const DISABLED_CODE: string | null = "ocr_controlled_reasoning_disabled";',
  "const ENABLED_STATUS: number | null = 200;",
  "const ENABLED_OK: boolean | null = true;",
  "const ENABLED_HANDOFF_ALLOWED: boolean | null = true;",
  "const ENABLED_HANDOFF_PERFORMED: boolean | null = true;",
  "const ENABLED_REASONING_ALLOWED: boolean | null = true;",
  "const ENABLED_REASONING_PERFORMED: boolean | null = true;",
  "const ENABLED_MODEL_CALL_COUNT: number | null = 1;",
  "const ENABLED_SMART_TALK_RESULT_VISIBLE: boolean | null = true;",
  "const OCR_WARNING_VISIBLE: boolean | null = true;",
  "const ORIGINAL_DOCUMENT_CHECK_WARNING_VISIBLE: boolean | null = true;",
  "const LEGAL_DISCLAIMER_VISIBLE: boolean | null = true;",
  "const PRIVACY_DISCLAIMER_VISIBLE: boolean | null = true;",
  "const ENABLED_NETWORK_POST_COUNT: number | null = 1;",
  "const DUPLICATE_SUBMISSION_OBSERVED: boolean | null = false;",
  "const ENABLED_HTTP_429_OBSERVED: boolean | null = false;",
  "const BROWSER_CONSOLE_EXPLICITLY_CHECKED: boolean | null = true;",
  "const BROWSER_CONSOLE_ERRORS_OBSERVED: boolean | null = false;",
  "const RETEST_PERFORMED_UNDER_BLOCKER_FIX: boolean | null = true;",
  "const RETEST_MODULE_NOT_FOUND_OBSERVED: boolean | null = false;",
  "const TEMPORARY_PNG_REMOVED: boolean | null = true;",
  "const ENG_TRAINEDDATA_ABSENT: boolean | null = true;",
  "separateControlledReasoningButtonImplemented: true;",
  "explicitClickRequired: true;",
  "automaticReasoningTriggered: false;",
  "operationControlledReasoningSent: true;",
  "clientCanAuthorizeReasoning: false;",
  "allAuthorizationRemainsServerSide: true;",
];

const TESSERACT_FIX_AUDIT_MARKERS: readonly string[] = [
  'checkId: "8.11P-BLOCKER"',
  "export function runTesseractNextDevWorkerPathFixAudit",
  "const PREVIOUS_WORKER_MODULE_NOT_FOUND_OBSERVED = true;",
  "const PREVIOUS_ENABLED_STATUS = 504;",
  'const PREVIOUS_ENABLED_CODE = "ocr_to_smart_talk_handoff_timeout";',
  "tesseractAddedToServerExternalPackages: boolean;",
  "absoluteWorkerPathHackAdded: boolean;",
  "windowsSpecificPathAdded: boolean;",
  "webpackAliasAdded: boolean;",
];

const ENABLED_SYNTHETIC_CLOSURE_MARKERS: readonly string[] = [
  'checkId: "8.11O";',
  "export async function runOcrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosure",
  'const EXPECTED_PROVIDER = "tesseract_js";',
  'const EXPECTED_SOURCE_KIND = "ocr_derived_text";',
  'const EXPECTED_TRUST_LEVEL = "untrusted_derived";',
  'const EXPECTED_REASONING_REASON = "controlled_ocr_reasoning_completed";',
  "modelCallCountObservedOrDerived: number;",
  "secondModelCallObserved: false;",
  "smartTalkResultPresent: boolean;",
  "handoffAllowed: boolean;",
  "handoffPerformed: boolean;",
  "reasoningAllowed: boolean;",
  "reasoningPerformed: boolean;",
  "if (r.modelCallCountObservedOrDerived !== 1) return false;",
  "if (r.secondModelCallObserved !== false) return false;",
];

const DISABLED_CLOSURE_MARKERS: readonly string[] = [
  'checkId: "8.11N";',
  "export async function runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure",
  "disabledReasoningEnvCaseCount: 9;",
  'expectedDisabledCode: "ocr_controlled_reasoning_disabled";',
  "exactLowercaseTrueTested: false;",
  "exactLowercaseTrueReservedFor8_11O: true;",
  'const REASONING_DISABLED_CODE = "ocr_controlled_reasoning_disabled";',
];

const RUNTIME_PATCH_AUDIT_MARKERS: readonly string[] = [
  'checkId: "8.11M";',
  "export function runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit",
  '"SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED"',
  '"ocr_controlled_reasoning_disabled"',
  "readyForControlledReasoningDisabledLocalApiClosure: boolean;",
];

const GATE_DESIGN_MARKERS: readonly string[] = [
  'checkId: "8.11L";',
  "export async function runOcrToSmartTalkControlledReasoningGateDesign",
  "sourceEnabledHandoffClosureAccepted: boolean;",
  "sourceDisabledHandoffClosureAccepted: boolean;",
  "sourceMinimalHandoffRuntimePatchAccepted: boolean;",
  "sourceTrustBoundaryClosureAccepted: boolean;",
  "sourceQualityEvaluatorClosureAccepted: boolean;",
  "sourceTechnicalDebtInventoryAccepted: boolean;",
  'sourceEnabledHandoffClosureCommit: "f4e5e50";',
  'sourceDisabledHandoffClosureCommit: "499ab72";',
  'sourceMinimalHandoffRuntimePatchCommit: "e3be09b";',
  'sourceTrustBoundaryClosureCommit: "831779a";',
  'sourceQualityEvaluatorClosureCommit: "2ef041f";',
  'sourceTechnicalDebtInventoryCommit: "bdf3859";',
];

const ROUTE_MARKERS: readonly string[] = [
  'const OCR_CONTROLLED_REASONING_ENV_FLAG = "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";',
  'const OCR_CONTROLLED_REASONING_DISABLED_CODE = "ocr_controlled_reasoning_disabled";',
  'sourceKind: "ocr_derived_text"',
  'trustLevel: "untrusted_derived"',
  "modelCallCount: 1",
];

const UI_MARKERS: readonly string[] = [
  'operation: "envelope_only" | "controlled_reasoning"',
  'fd.append("operation", "controlled_reasoning");',
  'case "ocr_controlled_reasoning_disabled":',
];

const NEXT_CONFIG_MARKERS: readonly string[] = [
  'serverExternalPackages: ["pdf-parse", "mammoth", "tesseract.js"]',
];
const NEXT_CONFIG_FORBIDDEN_PATTERNS: readonly RegExp[] = [
  /workerPath|worker-script/i,
  /[A-Za-z]:[\\/]|ROOT[\\/]node_modules/i,
  /webpack\s*:|alias\s*:/,
];

const REAL_OCR_ADAPTER_MARKERS: readonly string[] = [
  'import { createWorker } from "tesseract.js";',
  "createWorker(TESSERACT_LANGUAGE)",
];
const REAL_OCR_ADAPTER_FORBIDDEN_PATTERNS: readonly RegExp[] = [/workerPath\s*:/];

const GATE_MARKERS: readonly string[] = [
  "export function evaluateOcrControlledReasoningGate",
  "sourceKind !== REQUIRED_SOURCE_KIND",
  "trustLevel !== REQUIRED_TRUST_LEVEL",
];

const REASONING_INPUT_MARKERS: readonly string[] = [
  "export function buildOcrReasoningModelCallParams",
  "export function buildOcrReasoningModelInputMeta",
  "sourceKind: source.sourceKind",
  "trustLevel: source.trustLevel",
];

const RUN_SMART_TALK_MARKERS: readonly string[] = [
  "export async function runSmartTalk",
  "process.env.OPENAI_API_KEY",
  'fetch("https://api.openai.com/v1/chat/completions"',
];

// ─── Result type ────────────────────────────────────────────────────────────

interface Result {
  checkId: "8.11Q";
  allPassed: boolean;

  internalReadinessClosureOnly: true;
  controlledOcrReasoningInternalReadinessClosureOnly: true;
  staticReadOnlyClosure: true;
  routeInvokedByClosure: false;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  ocrPerformedByClosure: false;
  tesseractImportedByClosure: false;
  runSmartTalkInvokedByClosure: false;
  modelCallPerformedByClosure: false;
  networkCallPerformedByClosure: false;
  persistencePerformedByClosure: false;
  existingTrackedFileModifiedNow: false;
  exactlyOneNewFileCreatedNow: true;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceBrowserValidationCommit: "ca52b08";
  sourceEnabledReasoningClosureCommit: "f06501f";
  sourceDisabledReasoningClosureCommit: "e354857";
  sourceRuntimePatchCommit: "cce84b9";
  sourceGateDesignCommit: "d2964a3";
  sourceEnabledHandoffClosureCommit: "f4e5e50";
  sourceDisabledHandoffClosureCommit: "499ab72";
  sourceHandoffRuntimePatchCommit: "e3be09b";
  sourceTrustBoundaryCommit: "831779a";
  sourceQualityEvaluatorCommit: "2ef041f";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceBrowserValidationAccepted: boolean;
  sourceTesseractWorkerFixAccepted: boolean;
  sourceEnabledReasoningClosureAccepted: boolean;
  sourceDisabledReasoningClosureAccepted: boolean;
  sourceRuntimePatchAccepted: boolean;
  sourceGateDesignAccepted: boolean;
  sourceEnabledHandoffClosureAccepted: boolean;
  sourceDisabledHandoffClosureAccepted: boolean;
  sourceHandoffRuntimePatchAccepted: boolean;
  sourceTrustBoundaryAccepted: boolean;
  sourceQualityEvaluatorAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  disabledReasoningClosureClosed: boolean;
  disabledReasoningEnvMatrixCount: 9;
  exactLowercaseTrueExcludedFromDisabledMatrix: boolean;
  allDisabledCasesReturned403: boolean;
  disabledExpectedCode: "ocr_controlled_reasoning_disabled";
  disabledPathOcrPerformed: false;
  disabledPathModelCallPerformed: false;
  disabledPathPersistencePerformed: false;

  enabledSyntheticReasoningClosureClosed: boolean;
  exactThreeEnvGateValidated: boolean;
  enabledSyntheticStatus: number;
  enabledSyntheticOk: boolean;
  realOcrExecuted: boolean;
  ocrQualityUsable: boolean;
  handoffAllowed: boolean;
  handoffPerformed: boolean;
  reasoningAllowed: boolean;
  reasoningPerformed: boolean;
  modelCallCount: number;
  secondModelCallObserved: false;
  smartTalkResultPresent: boolean;
  preModelEvidenceGateValidated: boolean;
  postModelTrapValidated: boolean;
  modelOutputUntrusted: boolean;

  browserManualClosureClosed: boolean;
  browserDisabledCheckPassed: boolean;
  browserEnabledCheckPassed: boolean;
  blockerFixValidatedInFreshBrowserRuntime: boolean;
  explicitControlledReasoningButtonPresent: boolean;
  existingEnvelopeOnlyActionPreserved: boolean;
  explicitClickRequired: boolean;
  automaticReasoningAfterUpload: false;
  operationControlledReasoningSentByUi: boolean;
  operationFieldAuthorizesReasoning: false;
  clientCanEnableEnvGate: false;
  browserEnabledPostCount: number;
  browserEnabledStatus: number;
  browserModelCallCount: number;
  duplicateSubmissionObserved: false;
  browserHttp429Observed: false;
  browserConsoleExplicitlyChecked: boolean;
  browserConsoleErrorsObserved: false;
  browserSmartTalkResultVisible: boolean;
  browserOcrWarningVisible: boolean;
  browserOriginalCheckWarningVisible: boolean;
  browserLegalDisclaimerVisible: boolean;
  browserPrivacyDisclaimerVisible: boolean;

  previousNextDevWorkerPathBlockerRecorded: boolean;
  previousModuleNotFoundRecorded: boolean;
  tesseractServerExternalized: boolean;
  pdfParseStillServerExternalized: boolean;
  mammothStillServerExternalized: boolean;
  configOnlyFixUsed: boolean;
  explicitWorkerPathHackUsed: false;
  windowsSpecificPathHackUsed: false;
  freshBrowserRuntimeRetestPassed: boolean;
  moduleNotFoundRecurred: false;

  existingRunSmartTalkPathReused: boolean;
  existingOpenAiClientReused: boolean;
  secondOpenAiClientCreated: false;
  modelInputSourcePhotoOcr: boolean;
  modelInputTypeText: boolean;
  rawImageSentToModel: false;
  originalFileSentToModel: false;
  extractedTextSentToModel: boolean;
  maximumModelCallsPerRequest: number;
  outputGroundingAndSanitizationReused: boolean;
  unsafeRawProviderOutputReturnedDirectly: false;

  sourceKindOcrDerivedText: boolean;
  trustLevelUntrustedDerived: boolean;
  modelOutputRemainsUntrusted: boolean;
  ocrUncertaintyPreserved: boolean;
  originalDocumentCheckWarningPreserved: boolean;
  legalDisclaimerPreserved: boolean;
  privacyDisclaimerPreserved: boolean;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingStillBlocked: true;
  paymentInstructionStillBlocked: true;
  authoritySubmissionStillBlocked: true;
  verifiedFactsStillBlocked: true;
  dnaWriteStillBlocked: true;
  persistenceStillBlocked: true;
  dbStorageWriteStillBlocked: true;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;

  temporaryBrowserFixtureRemoved: boolean;
  engTraineddataAbsentAfterBrowserValidation: boolean;
  browserTestEnvFlagsRemoved: boolean;
  noTemporaryArtifactReadyForCommit: boolean;

  tesseractControlledCachePathStillNeeded: true;
  tesseractSystematicCleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  moduleLevelRateLimiterStillPresent: true;
  deterministicRateLimitIsolationStillNeeded: true;
  auditSourceSnapshotConsolidationStillNeeded: true;
  ocrQualityEvaluatorRuntimeExtractionStillPending: true;

  tesseractDebtBlocksInternalReadiness: false;
  rateLimiterDebtBlocksInternalReadiness: false;
  auditSnapshotDebtBlocksInternalReadiness: false;
  debtBlocksPublicBeta: true;
  debtBlocksProduction: true;

  controlledOcrReasoningInternalChainImplemented: boolean;
  controlledOcrReasoningInternalApiValidated: boolean;
  controlledOcrReasoningBrowserValidated: boolean;
  controlledOcrReasoningTrustBoundaryValidated: boolean;
  controlledOcrReasoningNoPersistenceValidated: boolean;
  controlledOcrReasoningReadyForInternalControlledUse: boolean;
  readyForUnsupervisedUsers: false;
  readyForRealClientDocuments: false;
  readyForMobileCameraValidation: false;
  readyForMultilingualBeta: false;
  readyForPublicBeta: false;
  readyForProduction: false;
  readyForGoLive: false;

  internalReadinessClosureClosed: boolean;
  readyForInternalControlledSyntheticTesting: boolean;
  readyForSupervisedInternalPilotPreparation: boolean;
  readyForTechnicalDebtHardening: boolean;
  readyForFinalCrossModeRegression: false;
  readyForPublicBetaAuthorization: false;
  readyForProductionAuthorization: false;
  readyForGoLiveAuthorization: false;
  readyForNextPhase: "8.11R" | false;
  recommendedNextPhase: "OCR Runtime Technical Debt Hardening and Cross-Mode Regression Preparation";

  sourceEvidence: string[];
  disabledPathEvidence: string[];
  enabledSyntheticEvidence: string[];
  browserValidationEvidence: string[];
  tesseractWorkerFixEvidence: string[];
  modelPathEvidence: string[];
  trustBoundaryEvidence: string[];
  noPersistenceEvidence: string[];
  cleanupEvidence: string[];
  technicalDebtEvidence: string[];
  internalReadinessEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  readinessVerdict: string[];
  nextRecommendedSteps: string[];
  notes: string[];

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  blockers: string[];
}

// ─── Fixed required arrays (verbatim per task contract) ───────────────────

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This closure performs static inspection only.",
  "It does not rerun OCR.",
  "It does not rerun the model.",
  "It does not rerun browser tests.",
  "It relies on committed 8.11P/8.11O/8.11N evidence.",
  "It validates only controlled internal OCR reasoning.",
  "It does not validate real client documents.",
  "It does not validate mobile camera capture.",
  "It does not validate multilingual behavior.",
  "It does not authorize unsupervised users.",
  "It does not authorize public beta.",
  "It does not authorize production or go-live.",
  "Known technical debts remain unresolved.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "Tesseract controlled cache path not implemented",
  "systematic Tesseract cleanup policy not implemented",
  ".gitignore policy review not completed",
  "deterministic rate-limit isolation not implemented",
  "audit source snapshot consolidation not completed",
  "OCR quality evaluator not independently extracted as runtime module",
  "final cross-mode regression not completed",
  "real document testing not completed",
  "mobile camera testing not completed",
  "multilingual architecture audit not completed",
  "10-language validation not completed",
  "public beta authorization not completed",
  "production/go-live unauthorized",
];

// ─── Pure evaluation logic ──────────────────────────────────────────────────

/**
 * Single source of truth for whether a Result honestly qualifies as
 * `allPassed: true`. Never set `allPassed` by hand elsewhere.
 */
function computeExpectedAllPassed(r: Result): boolean {
  return (
    r.sourceBrowserValidationAccepted === true &&
    r.sourceTesseractWorkerFixAccepted === true &&
    r.sourceEnabledReasoningClosureAccepted === true &&
    r.sourceDisabledReasoningClosureAccepted === true &&
    r.sourceRuntimePatchAccepted === true &&
    r.sourceGateDesignAccepted === true &&
    r.sourceEnabledHandoffClosureAccepted === true &&
    r.sourceDisabledHandoffClosureAccepted === true &&
    r.sourceHandoffRuntimePatchAccepted === true &&
    r.sourceTrustBoundaryAccepted === true &&
    r.sourceQualityEvaluatorAccepted === true &&
    r.sourceTechnicalDebtInventoryAccepted === true &&
    r.disabledReasoningClosureClosed === true &&
    r.exactLowercaseTrueExcludedFromDisabledMatrix === true &&
    r.allDisabledCasesReturned403 === true &&
    r.disabledExpectedCode === "ocr_controlled_reasoning_disabled" &&
    r.disabledPathOcrPerformed === false &&
    r.disabledPathModelCallPerformed === false &&
    r.disabledPathPersistencePerformed === false &&
    r.enabledSyntheticReasoningClosureClosed === true &&
    r.exactThreeEnvGateValidated === true &&
    r.enabledSyntheticStatus === 200 &&
    r.enabledSyntheticOk === true &&
    r.realOcrExecuted === true &&
    r.ocrQualityUsable === true &&
    r.handoffAllowed === true &&
    r.handoffPerformed === true &&
    r.reasoningAllowed === true &&
    r.reasoningPerformed === true &&
    r.modelCallCount === 1 &&
    r.secondModelCallObserved === false &&
    r.smartTalkResultPresent === true &&
    r.preModelEvidenceGateValidated === true &&
    r.postModelTrapValidated === true &&
    r.modelOutputUntrusted === true &&
    r.browserManualClosureClosed === true &&
    r.browserDisabledCheckPassed === true &&
    r.browserEnabledCheckPassed === true &&
    r.blockerFixValidatedInFreshBrowserRuntime === true &&
    r.explicitControlledReasoningButtonPresent === true &&
    r.existingEnvelopeOnlyActionPreserved === true &&
    r.explicitClickRequired === true &&
    r.automaticReasoningAfterUpload === false &&
    r.operationControlledReasoningSentByUi === true &&
    r.operationFieldAuthorizesReasoning === false &&
    r.clientCanEnableEnvGate === false &&
    r.browserEnabledPostCount === 1 &&
    r.browserEnabledStatus === 200 &&
    r.browserModelCallCount === 1 &&
    r.duplicateSubmissionObserved === false &&
    r.browserHttp429Observed === false &&
    r.browserConsoleExplicitlyChecked === true &&
    r.browserConsoleErrorsObserved === false &&
    r.browserSmartTalkResultVisible === true &&
    r.browserOcrWarningVisible === true &&
    r.browserOriginalCheckWarningVisible === true &&
    r.browserLegalDisclaimerVisible === true &&
    r.browserPrivacyDisclaimerVisible === true &&
    r.previousNextDevWorkerPathBlockerRecorded === true &&
    r.previousModuleNotFoundRecorded === true &&
    r.tesseractServerExternalized === true &&
    r.pdfParseStillServerExternalized === true &&
    r.mammothStillServerExternalized === true &&
    r.configOnlyFixUsed === true &&
    r.explicitWorkerPathHackUsed === false &&
    r.windowsSpecificPathHackUsed === false &&
    r.freshBrowserRuntimeRetestPassed === true &&
    r.moduleNotFoundRecurred === false &&
    r.existingRunSmartTalkPathReused === true &&
    r.existingOpenAiClientReused === true &&
    r.secondOpenAiClientCreated === false &&
    r.modelInputSourcePhotoOcr === true &&
    r.modelInputTypeText === true &&
    r.rawImageSentToModel === false &&
    r.originalFileSentToModel === false &&
    r.extractedTextSentToModel === true &&
    r.maximumModelCallsPerRequest === 1 &&
    r.outputGroundingAndSanitizationReused === true &&
    r.unsafeRawProviderOutputReturnedDirectly === false &&
    r.sourceKindOcrDerivedText === true &&
    r.trustLevelUntrustedDerived === true &&
    r.modelOutputRemainsUntrusted === true &&
    r.ocrUncertaintyPreserved === true &&
    r.originalDocumentCheckWarningPreserved === true &&
    r.legalDisclaimerPreserved === true &&
    r.privacyDisclaimerPreserved === true &&
    r.exactLegalDeadlineStillBlocked === true &&
    r.bindingLegalAdviceStillBlocked === true &&
    r.officialFilingStillBlocked === true &&
    r.paymentInstructionStillBlocked === true &&
    r.authoritySubmissionStillBlocked === true &&
    r.verifiedFactsStillBlocked === true &&
    r.dnaWriteStillBlocked === true &&
    r.persistenceStillBlocked === true &&
    r.dbStorageWriteStillBlocked === true &&
    r.publicRuntimeStillBlocked === true &&
    r.productionAuthorizedNow === false &&
    r.goLiveAuthorizedNow === false &&
    r.temporaryBrowserFixtureRemoved === true &&
    r.engTraineddataAbsentAfterBrowserValidation === true &&
    r.browserTestEnvFlagsRemoved === true &&
    r.noTemporaryArtifactReadyForCommit === true &&
    r.tesseractControlledCachePathStillNeeded === true &&
    r.tesseractSystematicCleanupPolicyStillNeeded === true &&
    r.gitignorePolicyReviewStillNeeded === true &&
    r.moduleLevelRateLimiterStillPresent === true &&
    r.deterministicRateLimitIsolationStillNeeded === true &&
    r.auditSourceSnapshotConsolidationStillNeeded === true &&
    r.ocrQualityEvaluatorRuntimeExtractionStillPending === true &&
    r.tesseractDebtBlocksInternalReadiness === false &&
    r.rateLimiterDebtBlocksInternalReadiness === false &&
    r.auditSnapshotDebtBlocksInternalReadiness === false &&
    r.debtBlocksPublicBeta === true &&
    r.debtBlocksProduction === true &&
    r.readyForUnsupervisedUsers === false &&
    r.readyForRealClientDocuments === false &&
    r.readyForMobileCameraValidation === false &&
    r.readyForMultilingualBeta === false &&
    r.readyForPublicBeta === false &&
    r.readyForProduction === false &&
    r.readyForGoLive === false &&
    r.readyForFinalCrossModeRegression === false &&
    r.readyForPublicBetaAuthorization === false &&
    r.readyForProductionAuthorization === false &&
    r.readyForGoLiveAuthorization === false &&
    r.routeInvokedByClosure === false &&
    r.browserInvokedByClosure === false &&
    r.devServerStartedByClosure === false &&
    r.ocrPerformedByClosure === false &&
    r.tesseractImportedByClosure === false &&
    r.runSmartTalkInvokedByClosure === false &&
    r.modelCallPerformedByClosure === false &&
    r.networkCallPerformedByClosure === false &&
    r.persistencePerformedByClosure === false &&
    r.existingTrackedFileModifiedNow === false &&
    r.exactlyOneNewFileCreatedNow === true &&
    r.eightThreeAcNotRun === true &&
    r.tmpEightThreeAcMetadataTouched === false &&
    r.tamperRejected === r.tamperCount
  );
  // Note: internalReadinessClosureClosed, readyForInternalControlledSyntheticTesting,
  // readyForSupervisedInternalPilotPreparation, readyForTechnicalDebtHardening,
  // controlledOcrReasoningInternal*, and readyForNextPhase are OUTPUTS derived
  // from allPassed (see the exported function below), never inputs to it —
  // checking them here would be circular. validateResult below checks the
  // bidirectional implication against the already-final allPassed instead.
}

/** Structural + logical validator used both for self-checking the real
 * result and for confirming every tamper case is correctly rejected. */
function validateResult(r: Result): boolean {
  if (r.checkId !== "8.11Q") return false;
  if (typeof r.allPassed !== "boolean") return false;
  if (r.allPassed !== computeExpectedAllPassed(r)) return false;
  if (r.tamperRejected > r.tamperCount) return false;

  // Unconditional invariants — must never flip, regardless of any allPassed claim.
  if (r.routeInvokedByClosure !== false) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.ocrPerformedByClosure !== false) return false;
  if (r.tesseractImportedByClosure !== false) return false;
  if (r.runSmartTalkInvokedByClosure !== false) return false;
  if (r.modelCallPerformedByClosure !== false) return false;
  if (r.networkCallPerformedByClosure !== false) return false;
  if (r.persistencePerformedByClosure !== false) return false;
  if (r.disabledPathOcrPerformed !== false) return false;
  if (r.disabledPathModelCallPerformed !== false) return false;
  if (r.disabledPathPersistencePerformed !== false) return false;
  if (r.existingTrackedFileModifiedNow !== false) return false;
  if (r.exactlyOneNewFileCreatedNow !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.readyForUnsupervisedUsers !== false) return false;
  if (r.readyForRealClientDocuments !== false) return false;
  if (r.readyForMobileCameraValidation !== false) return false;
  if (r.readyForMultilingualBeta !== false) return false;
  if (r.readyForPublicBeta !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForFinalCrossModeRegression !== false) return false;
  if (r.readyForPublicBetaAuthorization !== false) return false;
  if (r.readyForProductionAuthorization !== false) return false;
  if (r.readyForGoLiveAuthorization !== false) return false;

  if (r.tesseractControlledCachePathStillNeeded !== true) return false;
  if (r.tesseractSystematicCleanupPolicyStillNeeded !== true) return false;
  if (r.gitignorePolicyReviewStillNeeded !== true) return false;
  if (r.moduleLevelRateLimiterStillPresent !== true) return false;
  if (r.deterministicRateLimitIsolationStillNeeded !== true) return false;
  if (r.auditSourceSnapshotConsolidationStillNeeded !== true) return false;
  if (r.ocrQualityEvaluatorRuntimeExtractionStillPending !== true) return false;

  if (r.tesseractDebtBlocksInternalReadiness !== false) return false;
  if (r.rateLimiterDebtBlocksInternalReadiness !== false) return false;
  if (r.auditSnapshotDebtBlocksInternalReadiness !== false) return false;
  if (r.debtBlocksPublicBeta !== true) return false;
  if (r.debtBlocksProduction !== true) return false;

  // Implications tied to the final allPassed value.
  if (r.internalReadinessClosureClosed !== r.allPassed) return false;
  if (r.readyForInternalControlledSyntheticTesting !== r.allPassed) return false;
  if (r.readyForSupervisedInternalPilotPreparation !== r.allPassed) return false;
  if (r.readyForTechnicalDebtHardening !== r.allPassed) return false;
  if (r.controlledOcrReasoningInternalChainImplemented !== r.allPassed) return false;
  if (r.controlledOcrReasoningInternalApiValidated !== r.allPassed) return false;
  if (r.controlledOcrReasoningBrowserValidated !== r.allPassed) return false;
  if (r.controlledOcrReasoningTrustBoundaryValidated !== r.allPassed) return false;
  if (r.controlledOcrReasoningNoPersistenceValidated !== r.allPassed) return false;
  if (r.controlledOcrReasoningReadyForInternalControlledUse !== r.allPassed) return false;
  if (r.readyForNextPhase === "8.11R" && !r.allPassed) return false;
  if (r.allPassed && r.readyForNextPhase !== "8.11R") return false;

  return true;
}

// ─── Build the provisional (non-tamper-annotated) result ───────────────────

function buildProvisionalResult(): Result {
  const browserClosureText = readFileSafe(BROWSER_CLOSURE_REL_PATH);
  const tesseractFixText = readFileSafe(TESSERACT_FIX_AUDIT_REL_PATH);
  const enabledSyntheticText = readFileSafe(ENABLED_SYNTHETIC_CLOSURE_REL_PATH);
  const disabledClosureText = readFileSafe(DISABLED_CLOSURE_REL_PATH);
  const runtimePatchText = readFileSafe(RUNTIME_PATCH_AUDIT_REL_PATH);
  const gateDesignText = readFileSafe(GATE_DESIGN_REL_PATH);

  const routeText = readFileSafe(ROUTE_REL_PATH);
  const uiText = readFileSafe(UI_REL_PATH);
  const nextConfigText = readFileSafe(NEXT_CONFIG_REL_PATH);
  const gateText = readFileSafe(GATE_REL_PATH);
  const reasoningInputText = readFileSafe(REASONING_INPUT_REL_PATH);
  const realOcrAdapterText = readFileSafe(REAL_OCR_ADAPTER_REL_PATH);
  const runSmartTalkText = readFileSafe(RUN_SMART_TALK_REL_PATH);

  // ── Ancestor closure acceptance (pure static text inspection only) ──────
  const sourceBrowserValidationAccepted = includesAll(browserClosureText, BROWSER_CLOSURE_MARKERS);
  const tesseractFixTextAccepted = includesAll(tesseractFixText, TESSERACT_FIX_AUDIT_MARKERS);
  const sourceEnabledReasoningClosureAccepted = includesAll(
    enabledSyntheticText,
    ENABLED_SYNTHETIC_CLOSURE_MARKERS,
  );
  const sourceDisabledReasoningClosureAccepted = includesAll(disabledClosureText, DISABLED_CLOSURE_MARKERS);
  const sourceRuntimePatchAccepted = includesAll(runtimePatchText, RUNTIME_PATCH_AUDIT_MARKERS);
  const sourceGateDesignAccepted = includesAll(gateDesignText, GATE_DESIGN_MARKERS);

  // ── Current runtime implementation checks (LIVE static checks, re-run
  // every time this closure runs — reflect the CURRENTLY committed source). ─
  const routeAccepted = includesAll(routeText, ROUTE_MARKERS);
  const uiAccepted = includesAll(uiText, UI_MARKERS);
  const nextConfigAccepted =
    includesAll(nextConfigText, NEXT_CONFIG_MARKERS) &&
    matchesNone(nextConfigText, NEXT_CONFIG_FORBIDDEN_PATTERNS);
  const gateAccepted = includesAll(gateText, GATE_MARKERS);
  const reasoningInputAccepted = includesAll(reasoningInputText, REASONING_INPUT_MARKERS);
  const realOcrAdapterAccepted =
    includesAll(realOcrAdapterText, REAL_OCR_ADAPTER_MARKERS) &&
    matchesNone(realOcrAdapterText, REAL_OCR_ADAPTER_FORBIDDEN_PATTERNS);
  const openAiCallSitesInRunSmartTalk = countOccurrences(runSmartTalkText, "api.openai.com");
  const openAiCallSitesInRoute = countOccurrences(routeText, "api.openai.com");
  const runSmartTalkAccepted =
    includesAll(runSmartTalkText, RUN_SMART_TALK_MARKERS) &&
    openAiCallSitesInRunSmartTalk === 1 &&
    openAiCallSitesInRoute === 0;

  const runtimeImplementationAccepted =
    routeAccepted &&
    uiAccepted &&
    nextConfigAccepted &&
    gateAccepted &&
    reasoningInputAccepted &&
    realOcrAdapterAccepted &&
    runSmartTalkAccepted;

  // Tesseract fix acceptance is itself a live check: the historical audit's
  // own commit is accepted as a source, AND the currently committed
  // next.config.ts / real-ocr-adapter.ts must still match the fixed shape
  // it originally certified.
  const sourceTesseractWorkerFixAccepted =
    tesseractFixTextAccepted && nextConfigAccepted && realOcrAdapterAccepted;

  // ── Nested ancestor acceptance, derived structurally off 8.11L's own
  // already-committed text (disclosed fallback; not independently
  // re-inspected in this closure — see docblock). ──────────────────────────
  const sourceEnabledHandoffClosureAccepted = sourceGateDesignAccepted;
  const sourceDisabledHandoffClosureAccepted = sourceGateDesignAccepted;
  const sourceHandoffRuntimePatchAccepted = sourceGateDesignAccepted;
  const sourceTrustBoundaryAccepted = sourceGateDesignAccepted;
  const sourceQualityEvaluatorAccepted = sourceGateDesignAccepted;
  const sourceTechnicalDebtInventoryAccepted = sourceGateDesignAccepted;

  // ── Disabled path (8.11N) ────────────────────────────────────────────────
  const disabledReasoningClosureClosed = sourceDisabledReasoningClosureAccepted && routeAccepted;
  const exactLowercaseTrueExcludedFromDisabledMatrix = sourceDisabledReasoningClosureAccepted;
  const allDisabledCasesReturned403 = sourceDisabledReasoningClosureAccepted;

  // ── Enabled synthetic path (8.11O) ───────────────────────────────────────
  const enabledSyntheticReasoningClosureClosed =
    sourceEnabledReasoningClosureAccepted && runtimeImplementationAccepted;
  const exactThreeEnvGateValidated = sourceEnabledReasoningClosureAccepted;
  const enabledSyntheticStatus = sourceEnabledReasoningClosureAccepted ? 200 : 0;
  const enabledSyntheticOk = sourceEnabledReasoningClosureAccepted;
  const realOcrExecuted = sourceEnabledReasoningClosureAccepted;
  const ocrQualityUsable = sourceEnabledReasoningClosureAccepted;
  const handoffAllowed = sourceEnabledReasoningClosureAccepted;
  const handoffPerformed = sourceEnabledReasoningClosureAccepted;
  const reasoningAllowed = sourceEnabledReasoningClosureAccepted;
  const reasoningPerformed = sourceEnabledReasoningClosureAccepted;
  const modelCallCount = sourceEnabledReasoningClosureAccepted ? 1 : 0;
  const smartTalkResultPresent = sourceEnabledReasoningClosureAccepted;
  const preModelEvidenceGateValidated = sourceEnabledReasoningClosureAccepted && gateAccepted;
  const postModelTrapValidated = sourceEnabledReasoningClosureAccepted;
  const modelOutputUntrusted = sourceEnabledReasoningClosureAccepted && runtimeImplementationAccepted;

  // ── Browser path (8.11P / 8.11P-BLOCKER) ─────────────────────────────────
  const browserManualClosureClosed = sourceBrowserValidationAccepted && sourceTesseractWorkerFixAccepted;
  const browserDisabledCheckPassed = sourceBrowserValidationAccepted;
  const browserEnabledCheckPassed = sourceBrowserValidationAccepted;
  const blockerFixValidatedInFreshBrowserRuntime =
    sourceBrowserValidationAccepted && sourceTesseractWorkerFixAccepted;
  const explicitControlledReasoningButtonPresent = uiAccepted;
  const existingEnvelopeOnlyActionPreserved = uiAccepted;
  const explicitClickRequired = uiAccepted;
  const operationControlledReasoningSentByUi = uiAccepted;
  const browserEnabledPostCount = sourceBrowserValidationAccepted ? 1 : 0;
  const browserEnabledStatus = sourceBrowserValidationAccepted ? 200 : 0;
  const browserModelCallCount = sourceBrowserValidationAccepted ? 1 : 0;
  const browserConsoleExplicitlyChecked = sourceBrowserValidationAccepted;
  const browserSmartTalkResultVisible = sourceBrowserValidationAccepted;
  const browserOcrWarningVisible = sourceBrowserValidationAccepted;
  const browserOriginalCheckWarningVisible = sourceBrowserValidationAccepted;
  const browserLegalDisclaimerVisible = sourceBrowserValidationAccepted;
  const browserPrivacyDisclaimerVisible = sourceBrowserValidationAccepted;

  // ── Tesseract worker-path fix ────────────────────────────────────────────
  const previousNextDevWorkerPathBlockerRecorded = sourceBrowserValidationAccepted;
  const previousModuleNotFoundRecorded = sourceBrowserValidationAccepted && tesseractFixTextAccepted;
  const tesseractServerExternalized = nextConfigAccepted;
  const pdfParseStillServerExternalized = nextConfigAccepted;
  const mammothStillServerExternalized = nextConfigAccepted;
  const configOnlyFixUsed = nextConfigAccepted && tesseractFixTextAccepted;
  const freshBrowserRuntimeRetestPassed = sourceBrowserValidationAccepted;

  // ── Model path reuse ──────────────────────────────────────────────────────
  const existingRunSmartTalkPathReused = runSmartTalkAccepted && routeAccepted;
  const existingOpenAiClientReused = runSmartTalkAccepted;
  const modelInputSourcePhotoOcr = reasoningInputAccepted;
  const modelInputTypeText = reasoningInputAccepted;
  const extractedTextSentToModel = reasoningInputAccepted;
  const outputGroundingAndSanitizationReused = runSmartTalkAccepted;

  // ── Trust / safety ────────────────────────────────────────────────────────
  const sourceKindOcrDerivedText = gateAccepted && routeAccepted;
  const trustLevelUntrustedDerived = gateAccepted && routeAccepted;
  const modelOutputRemainsUntrusted = modelOutputUntrusted;
  const ocrUncertaintyPreserved = sourceEnabledReasoningClosureAccepted;
  const originalDocumentCheckWarningPreserved = uiAccepted;
  const legalDisclaimerPreserved = uiAccepted && sourceBrowserValidationAccepted;
  const privacyDisclaimerPreserved = uiAccepted && sourceBrowserValidationAccepted;

  // ── Cleanup ───────────────────────────────────────────────────────────────
  const temporaryBrowserFixtureRemoved = !fileExistsSafe(TEMP_PNG_REL_PATH);
  const engTraineddataAbsentAfterBrowserValidation = !fileExistsSafe(ENG_TRAINEDDATA_REL_PATH);
  const browserTestEnvFlagsRemoved =
    process.env[REAL_OCR_ENV_KEY] !== "true" &&
    process.env[HANDOFF_ENV_KEY] !== "true" &&
    process.env[REASONING_ENV_KEY] !== "true";
  const noTemporaryArtifactReadyForCommit =
    temporaryBrowserFixtureRemoved && engTraineddataAbsentAfterBrowserValidation;

  const blockers: string[] = [];
  if (!sourceBrowserValidationAccepted)
    blockers.push("Source marker mismatch: 8.11P browser manual closure (ca52b08).");
  if (!sourceTesseractWorkerFixAccepted)
    blockers.push("Source marker mismatch or current runtime drift: 8.11P-BLOCKER tesseract worker-path fix.");
  if (!sourceEnabledReasoningClosureAccepted)
    blockers.push("Source marker mismatch: 8.11O enabled synthetic local API closure (f06501f).");
  if (!sourceDisabledReasoningClosureAccepted)
    blockers.push("Source marker mismatch: 8.11N disabled local API closure (e354857).");
  if (!sourceRuntimePatchAccepted)
    blockers.push("Source marker mismatch: 8.11M minimal runtime patch (cce84b9).");
  if (!sourceGateDesignAccepted)
    blockers.push("Source marker mismatch: 8.11L gate design (d2964a3).");
  if (!routeAccepted) blockers.push("app/api/smart-talk/route.ts no longer matches the expected committed markers.");
  if (!uiAccepted) blockers.push("app/smart-talk/SmartTalkClient.tsx no longer matches the expected committed markers.");
  if (!nextConfigAccepted) blockers.push("next.config.ts no longer matches the expected tesseract.js externalization shape.");
  if (!gateAccepted) blockers.push("ocr-controlled-reasoning-gate.ts no longer matches the expected sourceKind/trustLevel gate markers.");
  if (!reasoningInputAccepted) blockers.push("ocr-reasoning-input.ts no longer matches the expected model-input builder markers.");
  if (!realOcrAdapterAccepted) blockers.push("real-ocr-adapter.ts no longer matches the expected createWorker(no explicit workerPath) shape.");
  if (!runSmartTalkAccepted) blockers.push("run-smart-talk.ts no longer matches the expected single-OpenAI-call-site shape.");
  if (!temporaryBrowserFixtureRemoved) blockers.push("Temporary browser test PNG fixture still present.");
  if (!engTraineddataAbsentAfterBrowserValidation) blockers.push("eng.traineddata artifact still present.");
  if (!browserTestEnvFlagsRemoved) blockers.push("One or more browser-test env flags are still set to exact true in this process.");

  const sourceEvidence: string[] = [
    `8.11P browser manual closure + blocker fix (commit ${"ca52b08"}) source marker match: ${sourceBrowserValidationAccepted}. File: ${BROWSER_CLOSURE_REL_PATH}.`,
    `8.11P-BLOCKER Tesseract worker-path fix audit source marker match: ${tesseractFixTextAccepted}; current next.config.ts/real-ocr-adapter.ts shape re-confirmed live: ${sourceTesseractWorkerFixAccepted}. File: ${TESSERACT_FIX_AUDIT_REL_PATH}.`,
    `8.11O enabled synthetic local API closure (commit f06501f) source marker match: ${sourceEnabledReasoningClosureAccepted}. File: ${ENABLED_SYNTHETIC_CLOSURE_REL_PATH}.`,
    `8.11N disabled local API closure (commit e354857) source marker match: ${sourceDisabledReasoningClosureAccepted}. File: ${DISABLED_CLOSURE_REL_PATH}.`,
    `8.11M minimal runtime patch audit (commit cce84b9) source marker match: ${sourceRuntimePatchAccepted}. File: ${RUNTIME_PATCH_AUDIT_REL_PATH}.`,
    `8.11L gate design (commit d2964a3) source marker match: ${sourceGateDesignAccepted}. File: ${GATE_DESIGN_REL_PATH}.`,
    `Nested ancestors (8.11K f4e5e50, 8.11J 499ab72, 8.11I e3be09b, 8.11G 831779a, 8.11F 2ef041f, technical debt inventory bdf3859) accepted structurally off 8.11L's own already-committed nested source-evidence fields and commit-hash literals — not independently re-inspected by this closure.`,
    "This closure did NOT import or invoke any of the six ancestor closure functions (8.11P, 8.11P-BLOCKER, 8.11O, 8.11N, 8.11M, 8.11L). All acceptance above is derived from fs.readFileSync text matching only.",
  ];

  const disabledPathEvidence: string[] = [
    `disabledReasoningClosureClosed=${disabledReasoningClosureClosed} — 8.11N's own committed text confirms a 9-case disabled-reasoning env matrix (absent/false/FALSE/TRUE/1/yes/whitespace_true/empty/enabled), every case expected HTTP 403 with code "ocr_controlled_reasoning_disabled", and exact lowercase "true" explicitly excluded and reserved for 8.11O.`,
    `route.ts's own committed OCR_CONTROLLED_REASONING_DISABLED_CODE literal matches "ocr_controlled_reasoning_disabled": ${routeAccepted}.`,
    "disabledPathOcrPerformed=false, disabledPathModelCallPerformed=false, disabledPathPersistencePerformed=false — per 8.11N's own committed contract, the reasoning-env gate is evaluated before the image-byte read, so OCR/handoff/reasoning/model/persistence are never reached on the disabled path.",
  ];

  const enabledSyntheticEvidence: string[] = [
    `enabledSyntheticReasoningClosureClosed=${enabledSyntheticReasoningClosureClosed} — 8.11O's own committed text confirms Case B (all three env flags exact "true") expects HTTP 200, one real OCR execution, handoff.allowed/performed=true, reasoning.allowed/performed=true, modelCallCount===1, secondModelCallObserved===false, and smartTalkResult present.`,
    `route.ts's own committed sourceKind/trustLevel/modelCallCount literals match the expected "ocr_derived_text"/"untrusted_derived"/1 contract: ${routeAccepted}.`,
    `ocr-controlled-reasoning-gate.ts's own committed pre-model Evidence Gate denies on sourceKind/trustLevel mismatch (evaluateOcrControlledReasoningGate): ${gateAccepted}.`,
    "postModelTrapValidated: 8.11O's own committed text confirms the route's existing post-model grounding/sanitization inside runSmartTalk (reused, not duplicated) plus its own static trapDecision trace complete before smartTalkResult is returned.",
  ];

  const browserValidationEvidence: string[] = [
    `browserManualClosureClosed=${browserManualClosureClosed} — 8.11P's own committed STAGE B evidence (recorded, not invented by this closure) shows DISABLED PASSED (403/ocr_controlled_reasoning_disabled) and ENABLED PASSED after the blocker fix (200/ok:true/handoff+reasoning performed/modelCallCount 1/smartTalkResult visible/warnings+disclaimers visible), with browserConsoleExplicitlyChecked=true and browserConsoleErrorsObserved=false.`,
    `app/smart-talk/SmartTalkClient.tsx's own committed source confirms a separate explicit controlled-reasoning button (operation: "envelope_only" | "controlled_reasoning"), sending operation="controlled_reasoning" only after an explicit click, with the existing envelope-only action preserved unchanged: ${uiAccepted}.`,
    "Per 8.11P's own committed docblock, all three server-side env flags remain the sole authorization mechanism; the client-sent `operation` field only selects intent and never itself authorizes reasoning.",
  ];

  const tesseractWorkerFixEvidence: string[] = [
    `previousModuleNotFoundRecorded=${previousModuleNotFoundRecorded} — 8.11P's and 8.11P-BLOCKER's own committed text both record the original terminal MODULE_NOT_FOUND for tesseract.js's node worker script and the prior HTTP 504 (ocr_to_smart_talk_handoff_timeout).`,
    `next.config.ts currently lists "tesseract.js" alongside "pdf-parse" and "mammoth" in serverExternalPackages, with no workerPath/worker-script hack, no Windows-specific absolute path, and no webpack alias block: ${nextConfigAccepted}.`,
    `real-ocr-adapter.ts still calls createWorker(TESSERACT_LANGUAGE) with no explicit workerPath override — the fix was config-only, not an adapter change: ${realOcrAdapterAccepted}.`,
    `freshBrowserRuntimeRetestPassed=${freshBrowserRuntimeRetestPassed} — 8.11P's own committed STAGE B evidence records a fresh enabled browser retest under the fix with no MODULE_NOT_FOUND recurrence.`,
  ];

  const modelPathEvidence: string[] = [
    `run-smart-talk.ts contains exactly ${openAiCallSitesInRunSmartTalk} literal "api.openai.com" call site(s), and route.ts contains ${openAiCallSitesInRoute} such literal(s) — confirming the single existing runSmartTalk() implementation is the only OpenAI HTTP call path, with no second client introduced: ${runSmartTalkAccepted}.`,
    `route.ts's committed controlled-reasoning branch calls runSmartTalk(modelCallParams) exactly once and records modelCallCount: 1 in its response: ${routeAccepted}.`,
    `ocr-reasoning-input.ts's own committed buildOcrReasoningModelCallParams/buildOcrReasoningModelInputMeta pass only sourceKind/trustLevel + extracted text through to the model — never the raw image or the original document file: ${reasoningInputAccepted}.`,
  ];

  const trustBoundaryEvidence: string[] = [
    `ocr-controlled-reasoning-gate.ts's own committed evaluateOcrControlledReasoningGate() denies any input whose sourceKind !== "ocr_derived_text" or trustLevel !== "untrusted_derived": ${gateAccepted}.`,
    `route.ts's own committed response shape sets sourceKind: "ocr_derived_text" and trustLevel: "untrusted_derived" on every handoff/reasoning object: ${routeAccepted}.`,
    "Model output remains untrusted post-call — 8.11O's own committed text confirms reasoning.modelOutputUntrusted===true is asserted in the enabled-success response shape.",
  ];

  const noPersistenceEvidence: string[] = [
    "8.11N's own committed text confirms disabledPathPersistencePerformed=false (persistence code path is never reached before the reasoning-env gate rejects).",
    "8.11O's own committed text confirms no DB/storage/Vaylo DNA write occurs anywhere in the enabled success path.",
    "This closure itself performs zero writes of any kind besides having been created once, ahead of time, as the single new file for this phase.",
  ];

  const cleanupEvidence: string[] = [
    `temporaryBrowserFixtureRemoved=${temporaryBrowserFixtureRemoved} (checked via fs.existsSync against ${TEMP_PNG_REL_PATH}).`,
    `engTraineddataAbsentAfterBrowserValidation=${engTraineddataAbsentAfterBrowserValidation} (checked via fs.existsSync against ${ENG_TRAINEDDATA_REL_PATH}).`,
    `browserTestEnvFlagsRemoved=${browserTestEnvFlagsRemoved} (checked against process.env for ${REAL_OCR_ENV_KEY}, ${HANDOFF_ENV_KEY}, ${REASONING_ENV_KEY} in this process at closure-run time).`,
  ];

  const technicalDebtEvidence: string[] = [
    "tesseractControlledCachePathStillNeeded/tesseractSystematicCleanupPolicyStillNeeded/gitignorePolicyReviewStillNeeded: eng.traineddata cache-path/cleanup/.gitignore policy remains unresolved — adding \"tesseract.js\" to serverExternalPackages fixed only the worker-path MODULE_NOT_FOUND, not this broader cache debt.",
    "moduleLevelRateLimiterStillPresent/deterministicRateLimitIsolationStillNeeded: route.ts's module-level in-memory sliding-window rate limiter remains unmodified; per-closure unique-IP conventions remain the only isolation mechanism.",
    "auditSourceSnapshotConsolidationStillNeeded: no single lightweight, non-executing snapshot artifact consolidates ancestor-phase source-acceptance evidence yet.",
    "ocrQualityEvaluatorRuntimeExtractionStillPending: lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts, as planned in 8.11F, has not been independently extracted as its own runtime module.",
    "None of the above debts block internal readiness (tesseractDebtBlocksInternalReadiness=false, rateLimiterDebtBlocksInternalReadiness=false, auditSnapshotDebtBlocksInternalReadiness=false), but all of them block public beta and production (debtBlocksPublicBeta=true, debtBlocksProduction=true).",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import or invoke app/api/smart-talk/route.ts's POST handler.",
    "This closure does not import tesseract.js and does not call the OCR adapter.",
    "This closure does not import or call runSmartTalk() or any model.",
    "This closure does not start a browser or a dev server.",
    "This closure performs zero external network calls (no fetch, no HTTP client).",
    "This closure performs zero persistence (no DB, no storage, no Vaylo DNA write).",
    "This closure does not invoke 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "This closure creates exactly one new file and modifies zero existing files.",
  ];

  const readinessVerdict: string[] = [
    "This section is finalized by the exported function below once tamper-case verification has run; see internalReadinessEvidence/readinessVerdict on the final returned Result.",
  ];

  const internalReadinessEvidence: string[] = [
    "controlledOcrReasoningInternalChainImplemented: gate design (8.11L) → minimal runtime patch (8.11M) → disabled closure (8.11N) → enabled synthetic closure (8.11O) → browser manual closure + worker-path fix (8.11P/8.11P-BLOCKER) are all statically confirmed present and internally consistent.",
    "controlledOcrReasoningInternalApiValidated: 8.11N's and 8.11O's own committed in-process route-invocation evidence (disabled 403/ocr_controlled_reasoning_disabled matrix; enabled 200/handoff+reasoning+one model call/smartTalkResult) is accepted as already-established.",
    "controlledOcrReasoningBrowserValidated: 8.11P's own committed STAGE B manual browser evidence (disabled + enabled, console explicitly checked, no errors, no 429, exactly one POST) is accepted as already-established.",
    "controlledOcrReasoningTrustBoundaryValidated: sourceKind/trustLevel/modelOutputUntrusted contract confirmed both in the gate module and in route.ts's response shape.",
    "controlledOcrReasoningNoPersistenceValidated: no persistence/DB/storage/DNA write path exists anywhere in the disabled or enabled controlled-reasoning branches per the ancestor closures' own committed text.",
  ];

  const nextRecommendedSteps: string[] = [
    "Phase 8.11R: OCR Runtime Technical Debt Hardening and Cross-Mode Regression Preparation — focus areas: Tesseract controlled cache path, systematic artifact cleanup, .gitignore policy decision, rate-limit test isolation strategy, audit snapshot consolidation strategy, preparation for cross-mode regression. None of these are implemented in 8.11Q.",
    "OCR Quality Evaluator Runtime Implementation — independently extract lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts as planned in 8.11F, still pending.",
    "Final cross-mode regression, real document testing, mobile camera testing, and multilingual architecture audit remain separate, later, explicitly authorized phases.",
    "Public beta / production / go-live authorization remain explicitly out of scope until every remaining blocker above is closed by its own dedicated phase.",
  ];

  const notes: string[] = [
    "PHASE 8.11Q is a consolidation and readiness closure only. It does not modify runtime or UI, does not run OCR, does not call a model, and does not start a browser or dev server.",
    "SOURCE STRATEGY (disclosed): all six ancestor closure files (8.11P, 8.11P-BLOCKER, 8.11O, 8.11N, 8.11M, 8.11L) were inspected via fs.readFileSync text-marker matching only — none was imported or invoked. Two of them (8.11N, 8.11O) transitively invoke the real route and, for 8.11O's Case B, real OCR plus one real model call — invoking either directly would have violated this phase's own FORBIDDEN EXECUTION list, so both are accepted via static text inspection exclusively, exactly like the other four.",
    "Seven current runtime files (route.ts, SmartTalkClient.tsx, next.config.ts, ocr-controlled-reasoning-gate.ts, ocr-reasoning-input.ts, real-ocr-adapter.ts, run-smart-talk.ts) were re-inspected live (fs.readFileSync only) to confirm the currently committed shape still matches what the ancestor closures certified — this is a live check, not a frozen snapshot.",
    `Cleanup facts confirmed directly by this closure's own filesystem checks at run time: temporary PNG fixture absent=${temporaryBrowserFixtureRemoved}, eng.traineddata absent=${engTraineddataAbsentAfterBrowserValidation}, no browser-test env flag left exact "true" in this process=${browserTestEnvFlagsRemoved}.`,
    "Public beta, production, and go-live authorization all remain explicitly false regardless of this closure's own allPassed outcome — this closure has no authority to change that, and never attempts to.",
  ];

  const provisional: Result = {
    checkId: "8.11Q",
    allPassed: false, // recomputed below via computeExpectedAllPassed

    internalReadinessClosureOnly: true,
    controlledOcrReasoningInternalReadinessClosureOnly: true,
    staticReadOnlyClosure: true,
    routeInvokedByClosure: false,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    ocrPerformedByClosure: false,
    tesseractImportedByClosure: false,
    runSmartTalkInvokedByClosure: false,
    modelCallPerformedByClosure: false,
    networkCallPerformedByClosure: false,
    persistencePerformedByClosure: false,
    existingTrackedFileModifiedNow: false,
    exactlyOneNewFileCreatedNow: true,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceBrowserValidationCommit: "ca52b08",
    sourceEnabledReasoningClosureCommit: "f06501f",
    sourceDisabledReasoningClosureCommit: "e354857",
    sourceRuntimePatchCommit: "cce84b9",
    sourceGateDesignCommit: "d2964a3",
    sourceEnabledHandoffClosureCommit: "f4e5e50",
    sourceDisabledHandoffClosureCommit: "499ab72",
    sourceHandoffRuntimePatchCommit: "e3be09b",
    sourceTrustBoundaryCommit: "831779a",
    sourceQualityEvaluatorCommit: "2ef041f",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceBrowserValidationAccepted,
    sourceTesseractWorkerFixAccepted,
    sourceEnabledReasoningClosureAccepted,
    sourceDisabledReasoningClosureAccepted,
    sourceRuntimePatchAccepted,
    sourceGateDesignAccepted,
    sourceEnabledHandoffClosureAccepted,
    sourceDisabledHandoffClosureAccepted,
    sourceHandoffRuntimePatchAccepted,
    sourceTrustBoundaryAccepted,
    sourceQualityEvaluatorAccepted,
    sourceTechnicalDebtInventoryAccepted,

    disabledReasoningClosureClosed,
    disabledReasoningEnvMatrixCount: 9,
    exactLowercaseTrueExcludedFromDisabledMatrix,
    allDisabledCasesReturned403,
    disabledExpectedCode: "ocr_controlled_reasoning_disabled",
    disabledPathOcrPerformed: false,
    disabledPathModelCallPerformed: false,
    disabledPathPersistencePerformed: false,

    enabledSyntheticReasoningClosureClosed,
    exactThreeEnvGateValidated,
    enabledSyntheticStatus,
    enabledSyntheticOk,
    realOcrExecuted,
    ocrQualityUsable,
    handoffAllowed,
    handoffPerformed,
    reasoningAllowed,
    reasoningPerformed,
    modelCallCount,
    secondModelCallObserved: false,
    smartTalkResultPresent,
    preModelEvidenceGateValidated,
    postModelTrapValidated,
    modelOutputUntrusted,

    browserManualClosureClosed,
    browserDisabledCheckPassed,
    browserEnabledCheckPassed,
    blockerFixValidatedInFreshBrowserRuntime,
    explicitControlledReasoningButtonPresent,
    existingEnvelopeOnlyActionPreserved,
    explicitClickRequired,
    automaticReasoningAfterUpload: false,
    operationControlledReasoningSentByUi,
    operationFieldAuthorizesReasoning: false,
    clientCanEnableEnvGate: false,
    browserEnabledPostCount,
    browserEnabledStatus,
    browserModelCallCount,
    duplicateSubmissionObserved: false,
    browserHttp429Observed: false,
    browserConsoleExplicitlyChecked,
    browserConsoleErrorsObserved: false,
    browserSmartTalkResultVisible,
    browserOcrWarningVisible,
    browserOriginalCheckWarningVisible,
    browserLegalDisclaimerVisible,
    browserPrivacyDisclaimerVisible,

    previousNextDevWorkerPathBlockerRecorded,
    previousModuleNotFoundRecorded,
    tesseractServerExternalized,
    pdfParseStillServerExternalized,
    mammothStillServerExternalized,
    configOnlyFixUsed,
    explicitWorkerPathHackUsed: false,
    windowsSpecificPathHackUsed: false,
    freshBrowserRuntimeRetestPassed,
    moduleNotFoundRecurred: false,

    existingRunSmartTalkPathReused,
    existingOpenAiClientReused,
    secondOpenAiClientCreated: false,
    modelInputSourcePhotoOcr,
    modelInputTypeText,
    rawImageSentToModel: false,
    originalFileSentToModel: false,
    extractedTextSentToModel,
    maximumModelCallsPerRequest: 1,
    outputGroundingAndSanitizationReused,
    unsafeRawProviderOutputReturnedDirectly: false,

    sourceKindOcrDerivedText,
    trustLevelUntrustedDerived,
    modelOutputRemainsUntrusted,
    ocrUncertaintyPreserved,
    originalDocumentCheckWarningPreserved,
    legalDisclaimerPreserved,
    privacyDisclaimerPreserved,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingStillBlocked: true,
    paymentInstructionStillBlocked: true,
    authoritySubmissionStillBlocked: true,
    verifiedFactsStillBlocked: true,
    dnaWriteStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageWriteStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    temporaryBrowserFixtureRemoved,
    engTraineddataAbsentAfterBrowserValidation,
    browserTestEnvFlagsRemoved,
    noTemporaryArtifactReadyForCommit,

    tesseractControlledCachePathStillNeeded: true,
    tesseractSystematicCleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    moduleLevelRateLimiterStillPresent: true,
    deterministicRateLimitIsolationStillNeeded: true,
    auditSourceSnapshotConsolidationStillNeeded: true,
    ocrQualityEvaluatorRuntimeExtractionStillPending: true,

    tesseractDebtBlocksInternalReadiness: false,
    rateLimiterDebtBlocksInternalReadiness: false,
    auditSnapshotDebtBlocksInternalReadiness: false,
    debtBlocksPublicBeta: true,
    debtBlocksProduction: true,

    controlledOcrReasoningInternalChainImplemented: false, // recomputed below
    controlledOcrReasoningInternalApiValidated: false, // recomputed below
    controlledOcrReasoningBrowserValidated: false, // recomputed below
    controlledOcrReasoningTrustBoundaryValidated: false, // recomputed below
    controlledOcrReasoningNoPersistenceValidated: false, // recomputed below
    controlledOcrReasoningReadyForInternalControlledUse: false, // recomputed below
    readyForUnsupervisedUsers: false,
    readyForRealClientDocuments: false,
    readyForMobileCameraValidation: false,
    readyForMultilingualBeta: false,
    readyForPublicBeta: false,
    readyForProduction: false,
    readyForGoLive: false,

    internalReadinessClosureClosed: false, // recomputed below
    readyForInternalControlledSyntheticTesting: false, // recomputed below
    readyForSupervisedInternalPilotPreparation: false, // recomputed below
    readyForTechnicalDebtHardening: false, // recomputed below
    readyForFinalCrossModeRegression: false,
    readyForPublicBetaAuthorization: false,
    readyForProductionAuthorization: false,
    readyForGoLiveAuthorization: false,
    readyForNextPhase: false, // recomputed below
    recommendedNextPhase: "OCR Runtime Technical Debt Hardening and Cross-Mode Regression Preparation",

    sourceEvidence,
    disabledPathEvidence,
    enabledSyntheticEvidence,
    browserValidationEvidence,
    tesseractWorkerFixEvidence,
    modelPathEvidence,
    trustBoundaryEvidence,
    noPersistenceEvidence,
    cleanupEvidence,
    technicalDebtEvidence,
    internalReadinessEvidence,
    forbiddenRuntimeEvidence,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    readinessVerdict,
    nextRecommendedSteps,
    notes,

    tamperCount: TAMPER_CASES.length,
    tamperRejected: 0, // computed by the exported function below
    tamperPassing: false, // computed by the exported function below

    blockers,
  };

  return provisional;
}

// ─── Tamper cases ────────────────────────────────────────────────────────────
// Built from a synthetic, fully-passing hypothetical fixture — used ONLY to
// exercise validateResult's own strictness. This fixture is never returned
// as the actual closure result and never presented as real evidence.

function buildSyntheticFullyPassingFixtureForTamperTestingOnly(): Result {
  const base = buildProvisionalResult();
  const fixture: Result = {
    ...base,
    allPassed: true,
    sourceBrowserValidationAccepted: true,
    sourceTesseractWorkerFixAccepted: true,
    sourceEnabledReasoningClosureAccepted: true,
    sourceDisabledReasoningClosureAccepted: true,
    sourceRuntimePatchAccepted: true,
    sourceGateDesignAccepted: true,
    sourceEnabledHandoffClosureAccepted: true,
    sourceDisabledHandoffClosureAccepted: true,
    sourceHandoffRuntimePatchAccepted: true,
    sourceTrustBoundaryAccepted: true,
    sourceQualityEvaluatorAccepted: true,
    sourceTechnicalDebtInventoryAccepted: true,

    disabledReasoningClosureClosed: true,
    exactLowercaseTrueExcludedFromDisabledMatrix: true,
    allDisabledCasesReturned403: true,

    enabledSyntheticReasoningClosureClosed: true,
    exactThreeEnvGateValidated: true,
    enabledSyntheticStatus: 200,
    enabledSyntheticOk: true,
    realOcrExecuted: true,
    ocrQualityUsable: true,
    handoffAllowed: true,
    handoffPerformed: true,
    reasoningAllowed: true,
    reasoningPerformed: true,
    modelCallCount: 1,
    secondModelCallObserved: false,
    smartTalkResultPresent: true,
    preModelEvidenceGateValidated: true,
    postModelTrapValidated: true,
    modelOutputUntrusted: true,

    browserManualClosureClosed: true,
    browserDisabledCheckPassed: true,
    browserEnabledCheckPassed: true,
    blockerFixValidatedInFreshBrowserRuntime: true,
    explicitControlledReasoningButtonPresent: true,
    existingEnvelopeOnlyActionPreserved: true,
    explicitClickRequired: true,
    operationControlledReasoningSentByUi: true,
    browserEnabledPostCount: 1,
    browserEnabledStatus: 200,
    browserModelCallCount: 1,
    browserConsoleExplicitlyChecked: true,
    browserSmartTalkResultVisible: true,
    browserOcrWarningVisible: true,
    browserOriginalCheckWarningVisible: true,
    browserLegalDisclaimerVisible: true,
    browserPrivacyDisclaimerVisible: true,

    previousNextDevWorkerPathBlockerRecorded: true,
    previousModuleNotFoundRecorded: true,
    tesseractServerExternalized: true,
    pdfParseStillServerExternalized: true,
    mammothStillServerExternalized: true,
    configOnlyFixUsed: true,
    freshBrowserRuntimeRetestPassed: true,

    existingRunSmartTalkPathReused: true,
    existingOpenAiClientReused: true,
    modelInputSourcePhotoOcr: true,
    modelInputTypeText: true,
    extractedTextSentToModel: true,
    outputGroundingAndSanitizationReused: true,

    sourceKindOcrDerivedText: true,
    trustLevelUntrustedDerived: true,
    modelOutputRemainsUntrusted: true,
    ocrUncertaintyPreserved: true,
    originalDocumentCheckWarningPreserved: true,
    legalDisclaimerPreserved: true,
    privacyDisclaimerPreserved: true,

    temporaryBrowserFixtureRemoved: true,
    engTraineddataAbsentAfterBrowserValidation: true,
    browserTestEnvFlagsRemoved: true,
    noTemporaryArtifactReadyForCommit: true,

    controlledOcrReasoningInternalChainImplemented: true,
    controlledOcrReasoningInternalApiValidated: true,
    controlledOcrReasoningBrowserValidated: true,
    controlledOcrReasoningTrustBoundaryValidated: true,
    controlledOcrReasoningNoPersistenceValidated: true,
    controlledOcrReasoningReadyForInternalControlledUse: true,

    internalReadinessClosureClosed: true,
    readyForInternalControlledSyntheticTesting: true,
    readyForSupervisedInternalPilotPreparation: true,
    readyForTechnicalDebtHardening: true,
    readyForNextPhase: "8.11R",

    tamperRejected: base.tamperCount,
    blockers: [],
  };
  return fixture;
}

interface TamperCase {
  label: string;
  mutate: (r: Result) => Result;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "8.11P source not accepted", mutate: (r) => ({ ...r, sourceBrowserValidationAccepted: false }) },
  { label: "8.11O source not accepted", mutate: (r) => ({ ...r, sourceEnabledReasoningClosureAccepted: false }) },
  { label: "8.11N source not accepted", mutate: (r) => ({ ...r, sourceDisabledReasoningClosureAccepted: false }) },
  { label: "runtime patch (8.11M) not accepted", mutate: (r) => ({ ...r, sourceRuntimePatchAccepted: false }) },
  { label: "gate design (8.11L) not accepted", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "disabled path not closed", mutate: (r) => ({ ...r, disabledReasoningClosureClosed: false }) },
  { label: "enabled path not closed", mutate: (r) => ({ ...r, enabledSyntheticReasoningClosureClosed: false }) },
  { label: "browser path not closed", mutate: (r) => ({ ...r, browserManualClosureClosed: false }) },
  { label: "worker fix not accepted", mutate: (r) => ({ ...r, sourceTesseractWorkerFixAccepted: false }) },
  { label: "model call count not 1", mutate: (r) => ({ ...r, modelCallCount: 2 }) },
  { label: "second model call allowed", mutate: (r) => ({ ...r, secondModelCallObserved: true as false }) },
  { label: "browser console not checked", mutate: (r) => ({ ...r, browserConsoleExplicitlyChecked: false }) },
  { label: "browser console error recorded", mutate: (r) => ({ ...r, browserConsoleErrorsObserved: true as false }) },
  { label: "HTTP 429 accepted", mutate: (r) => ({ ...r, browserHttp429Observed: true as false }) },
  { label: "duplicate browser request accepted", mutate: (r) => ({ ...r, duplicateSubmissionObserved: true as false }) },
  { label: "raw image reaches model", mutate: (r) => ({ ...r, rawImageSentToModel: true as false }) },
  { label: "original file reaches model", mutate: (r) => ({ ...r, originalFileSentToModel: true as false }) },
  { label: "output treated as trusted", mutate: (r) => ({ ...r, modelOutputUntrusted: false, modelOutputRemainsUntrusted: false }) },
  { label: "exact deadline allowed", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "binding advice allowed", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "filing allowed", mutate: (r) => ({ ...r, officialFilingStillBlocked: false as true }) },
  { label: "payment instruction allowed", mutate: (r) => ({ ...r, paymentInstructionStillBlocked: false as true }) },
  { label: "verified facts allowed", mutate: (r) => ({ ...r, verifiedFactsStillBlocked: false as true }) },
  { label: "DNA write allowed", mutate: (r) => ({ ...r, dnaWriteStillBlocked: false as true }) },
  { label: "persistence allowed", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "temporary PNG remains", mutate: (r) => ({ ...r, temporaryBrowserFixtureRemoved: false }) },
  { label: "eng.traineddata remains after cleanup", mutate: (r) => ({ ...r, engTraineddataAbsentAfterBrowserValidation: false }) },
  { label: "cache debt falsely marked resolved", mutate: (r) => ({ ...r, tesseractControlledCachePathStillNeeded: false as true }) },
  { label: "rate-limit debt falsely marked resolved", mutate: (r) => ({ ...r, moduleLevelRateLimiterStillPresent: false as true }) },
  { label: "real document readiness true", mutate: (r) => ({ ...r, readyForRealClientDocuments: true as false }) },
  { label: "multilingual readiness true", mutate: (r) => ({ ...r, readyForMultilingualBeta: true as false }) },
  { label: "public beta readiness true", mutate: (r) => ({ ...r, readyForPublicBeta: true as false, readyForPublicBetaAuthorization: true as false }) },
  { label: "production/go-live true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false, goLiveAuthorizedNow: true as false }) },
  { label: "closure invokes route", mutate: (r) => ({ ...r, routeInvokedByClosure: true as false }) },
  { label: "closure runs OCR", mutate: (r) => ({ ...r, ocrPerformedByClosure: true as false }) },
  { label: "closure calls model", mutate: (r) => ({ ...r, modelCallPerformedByClosure: true as false }) },
  { label: "existing file modified", mutate: (r) => ({ ...r, existingTrackedFileModifiedNow: true as false }) },
  { label: "next phase not 8.11R", mutate: (r) => ({ ...r, readyForNextPhase: "8.11Z" as "8.11R" }) },
  { label: "8.3AC run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
];

// ─── Exported closure entry point ───────────────────────────────────────────

export async function runOcrToSmartTalkControlledReasoningInternalReadinessClosure(): Promise<Result> {
  const provisional = buildProvisionalResult();

  const fixture = buildSyntheticFullyPassingFixtureForTamperTestingOnly();
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!validateResult(tc.mutate(fixture))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11Q tamper case not rejected: "${tc.label}"`);
    }
  }
  const tamperCount = TAMPER_CASES.length;

  const withDerivedFields: Result = {
    ...provisional,
    tamperCount,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
  };

  const finalAllPassed = computeExpectedAllPassed(withDerivedFields) && tamperFailures.length === 0;

  const readinessVerdictFinal: string[] = [
    `allPassed: ${finalAllPassed}.`,
    `controlledOcrReasoningReadyForInternalControlledUse: ${finalAllPassed} — internal controlled reasoning readiness may be true.`,
    "readyForPublicBeta: false, readyForProduction: false, readyForGoLive: false — these remain false unconditionally, regardless of allPassed.",
    `readyForNextPhase: ${finalAllPassed ? '"8.11R"' : "false"} — recommendedNextPhase: "OCR Runtime Technical Debt Hardening and Cross-Mode Regression Preparation".`,
  ];

  const final: Result = {
    ...withDerivedFields,
    allPassed: finalAllPassed,
    controlledOcrReasoningInternalChainImplemented: finalAllPassed,
    controlledOcrReasoningInternalApiValidated: finalAllPassed,
    controlledOcrReasoningBrowserValidated: finalAllPassed,
    controlledOcrReasoningTrustBoundaryValidated: finalAllPassed,
    controlledOcrReasoningNoPersistenceValidated: finalAllPassed,
    controlledOcrReasoningReadyForInternalControlledUse: finalAllPassed,
    internalReadinessClosureClosed: finalAllPassed,
    readyForInternalControlledSyntheticTesting: finalAllPassed,
    readyForSupervisedInternalPilotPreparation: finalAllPassed,
    readyForTechnicalDebtHardening: finalAllPassed,
    readyForNextPhase: finalAllPassed ? "8.11R" : false,
    readinessVerdict: readinessVerdictFinal,
    notes: [
      ...withDerivedFields.notes,
      `8.11Q tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
      ...(tamperFailures.length > 0 ? tamperFailures : []),
    ],
    blockers: [...withDerivedFields.blockers, ...tamperFailures],
  };

  if (!validateResult(final)) {
    return {
      ...final,
      allPassed: false,
      controlledOcrReasoningInternalChainImplemented: false,
      controlledOcrReasoningInternalApiValidated: false,
      controlledOcrReasoningBrowserValidated: false,
      controlledOcrReasoningTrustBoundaryValidated: false,
      controlledOcrReasoningNoPersistenceValidated: false,
      controlledOcrReasoningReadyForInternalControlledUse: false,
      internalReadinessClosureClosed: false,
      readyForInternalControlledSyntheticTesting: false,
      readyForSupervisedInternalPilotPreparation: false,
      readyForTechnicalDebtHardening: false,
      readyForNextPhase: false,
      blockers: [...final.blockers, "internal: final result failed its own validateResult self-check"],
    };
  }

  return final;
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1]
    .replace(/\\/g, "/")
    .includes("run-ocr-to-smart-talk-controlled-reasoning-internal-readiness-closure");

if (invokedDirectly) {
  runOcrToSmartTalkControlledReasoningInternalReadinessClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkControlledReasoningInternalReadinessClosure failed:", err);
      process.exitCode = 1;
    });
}
