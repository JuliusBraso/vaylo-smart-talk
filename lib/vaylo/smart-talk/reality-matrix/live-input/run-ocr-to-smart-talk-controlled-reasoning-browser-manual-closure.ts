/**
 * PHASE 8.11P — OCR-to-Smart-Talk Controlled Reasoning Browser Manual Test
 * Plan and Execution Closure
 *
 * TWO-STAGE INTERACTIVE CLOSURE (see this phase's own task contract):
 *
 *   STAGE A (this file's initial committed state): static, non-executing
 *   source inspection only. Every MANUAL EVIDENCE constant below is set to
 *   its honest "not yet observed" pending value. This file does NOT start a
 *   browser, does NOT start a dev server, does NOT call fetch/OCR/the model,
 *   and does NOT read process.env for authorization. `allPassed` is
 *   mechanically forced to `false` in this state (see computeExpectedAllPassed
 *   below) because `browserManualTestPerformed` is `false`.
 *
 *   STAGE B (after the user reports the exact browser result): ONLY the
 *   MANUAL EVIDENCE constants block below is edited, in place, with the
 *   user's exact reported values — never invented, never inferred from
 *   source code. Everything else (the Result shape, computeExpectedAllPassed,
 *   validateResult, TAMPER_CASES) stays unchanged. If the reported evidence
 *   is incomplete or fails any required condition, `allPassed` mechanically
 *   stays `false` and the missing/failing condition is named in `blockers`.
 *
 * STAGE B STATUS (recorded): the user performed the real DISABLED and
 * ENABLED browser checks. DISABLED PASSED in full (403 /
 * ocr_controlled_reasoning_disabled, exactly one POST, fail-closed message
 * visible, no Smart Talk result, no 429). ENABLED FAILED SAFELY: with all
 * three env flags exact "true" and exactly one explicit click, the single
 * controlled POST returned HTTP 504 / ocr_to_smart_talk_handoff_timeout
 * before handoff or reasoning could ever be evaluated — no model call, no
 * Smart Talk reasoning, no handoff, no raw image/original file/extracted
 * text sent to any model, no persistence, public/production/go-live still
 * blocked. The user's dev-server TERMINAL additionally showed
 * `Error: Cannot find module '...\\tesseract.js\\src\\worker-script\\node\\
 * index.js'` (MODULE_NOT_FOUND) immediately before the 504. This closure
 * therefore keeps `allPassed: false`, does not delete the temporary PNG,
 * does not modify any runtime file, and records a statically-confirmed
 * root-cause plus a proposed narrow follow-up phase (8.11P-BLOCKER) below —
 * see `verifyTesseractWorkerPathRootCauseStatically`.
 *
 * SOURCE VERIFICATION STRATEGY: the four ancestor phases named in the
 * SOURCE FIELDS below (8.11O, 8.11N, 8.11M, 8.11L) are verified via a cheap,
 * static, non-executing text read (fs.readFileSync only — no execution, no
 * OCR, no model call, no route invocation) confirming each file exists at
 * its documented path and contains both its own expected `checkId` literal
 * and its own expected exported function name. This mirrors 8.11O's own
 * "verifySourceMarker" technique, used for the same reason: avoiding
 * re-invoking any ancestor phase (several of which perform real, expensive
 * work) merely to reconstruct already-established, already-reported
 * acceptance.
 *
 * This file does NOT modify app/api/smart-talk/route.ts, next.config.ts, or
 * any reasoning/OCR runtime module, does NOT touch package.json/.env
 * files/.gitignore, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It does not delete the temporary synthetic PNG
 * fixture, does not rerun OCR, and does not call the model.
 */

import fs from "fs";
import path from "path";

// ─── Static source-marker verification (no execution) ──────────────────────

interface SourceMarker {
  relPath: string;
  checkIdMarker: string;
  exportNameMarker: string;
}

const SOURCE_MARKERS: readonly SourceMarker[] = [
  {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-enabled-synthetic-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11O"',
    exportNameMarker:
      "export async function runOcrToSmartTalkControlledReasoningEnabledSyntheticLocalApiClosure",
  },
  {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-disabled-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11N"',
    exportNameMarker:
      "export async function runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure",
  },
  {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit.ts",
    checkIdMarker: 'checkId: "8.11M"',
    exportNameMarker:
      "export function runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit",
  },
  {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-gate-design.ts",
    checkIdMarker: 'checkId: "8.11L"',
    exportNameMarker: "export async function runOcrToSmartTalkControlledReasoningGateDesign",
  },
];

function verifySourceMarker(marker: SourceMarker): boolean {
  try {
    const fullPath = path.join(process.cwd(), marker.relPath);
    if (!fs.existsSync(fullPath)) return false;
    const text = fs.readFileSync(fullPath, "utf8");
    return text.includes(marker.checkIdMarker) && text.includes(marker.exportNameMarker);
  } catch {
    return false;
  }
}

// ─── Root-cause static confirmation (read-only; no modification) ──────────
// Confirms, via cheap static text reads only (never executes tesseract.js,
// never spawns a worker, never opens a browser), the two committed-source
// conditions that together explain the user-reported terminal
// MODULE_NOT_FOUND for tesseract.js's node worker script under the Next.js
// dev-server runtime:
//
//   (a) next.config.ts's `serverExternalPackages` array does NOT list
//       "tesseract.js" (only "pdf-parse" and "mammoth" are listed), so
//       Next's dev-server webpack compiler bundles/transforms
//       tesseract.js's own internal modules instead of letting Node's
//       native `require` resolve them untouched from node_modules; and
//   (b) lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts calls
//       `createWorker(TESSERACT_LANGUAGE)` with no explicit `workerPath`
//       override, so it relies entirely on tesseract.js's own default
//       `path.join(__dirname, '..', '..', 'worker-script', 'node',
//       'index.js')` (computed inside
//       node_modules/tesseract.js/src/worker/node/defaultOptions.js) —
//       which is exactly the path Node's worker_threads reported as
//       missing once __dirname no longer matches the real on-disk
//       location after (a).
//
// Both implicated files are already on THIS phase's own FORBIDDEN
// MODIFICATIONS list, so this closure only confirms the condition
// statically — it does not touch either file.
interface RootCauseStaticCheck {
  nextConfigRelPath: string;
  ocrAdapterRelPath: string;
  nextConfigMissingTesseractExternal: boolean | null;
  ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath: boolean | null;
}

function verifyTesseractWorkerPathRootCauseStatically(): RootCauseStaticCheck {
  const nextConfigRelPath = "next.config.ts";
  const ocrAdapterRelPath = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";
  let nextConfigMissingTesseractExternal: boolean | null = null;
  let ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath: boolean | null = null;

  try {
    const nextConfigText = fs.readFileSync(path.join(process.cwd(), nextConfigRelPath), "utf8");
    const hasServerExternalPackages = nextConfigText.includes("serverExternalPackages");
    const listsTesseractAsExternal = /serverExternalPackages\s*:\s*\[[^\]]*tesseract\.js/.test(
      nextConfigText,
    );
    nextConfigMissingTesseractExternal = hasServerExternalPackages && !listsTesseractAsExternal;
  } catch {
    nextConfigMissingTesseractExternal = null;
  }

  try {
    const adapterText = fs.readFileSync(path.join(process.cwd(), ocrAdapterRelPath), "utf8");
    const callsCreateWorker = /createWorker\s*\(/.test(adapterText);
    const passesWorkerPathOption = /workerPath\s*:/.test(adapterText);
    ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath =
      callsCreateWorker && !passesWorkerPathOption;
  } catch {
    ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath = null;
  }

  return {
    nextConfigRelPath,
    ocrAdapterRelPath,
    nextConfigMissingTesseractExternal,
    ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath,
  };
}

// ─── STAGE B MANUAL EVIDENCE (edited in place after real browser testing) ──
// STAGE A VALUE: every constant below reflects "not yet observed". These are
// the ONLY constants this closure edits between Stage A and Stage B. Nothing
// below is inferred from route.ts/gate/adapter source code — only from the
// user's own reported browser observations.

const BROWSER_MANUAL_TEST_PERFORMED = true;

// DISABLED (fail-closed) browser check evidence — reported PASSED.
const DISABLED_BROWSER_CHECK_PERFORMED = true;
const DISABLED_STATUS: number | null = 403;
const DISABLED_CODE: string | null = "ocr_controlled_reasoning_disabled";
const DISABLED_FAIL_CLOSED_MESSAGE_VISIBLE: boolean | null = true;
const DISABLED_NETWORK_POST_COUNT: number | null = 1;
const DISABLED_HTTP_429_OBSERVED: boolean | null = false;
const DISABLED_NO_SMART_TALK_RESULT_CONFIRMED: boolean | null = true;

// ENABLED (success) browser check evidence — 8.11P-RETEST: PASSED, under
// the 8.11P-BLOCKER config-only fix (next.config.ts serverExternalPackages
// now includes "tesseract.js"). All three env flags were exact lowercase
// "true"; exactly one explicit click; exactly one controlled POST; no
// MODULE_NOT_FOUND error this time.
const ENABLED_BROWSER_CHECK_PERFORMED = true;
const ENABLED_STATUS: number | null = 200;
const ENABLED_OK: boolean | null = true;
const ENABLED_HANDOFF_ALLOWED: boolean | null = true;
const ENABLED_HANDOFF_PERFORMED: boolean | null = true;
const ENABLED_REASONING_ALLOWED: boolean | null = true;
const ENABLED_REASONING_PERFORMED: boolean | null = true;
const ENABLED_REASONING_REASON: string | null = "controlled_ocr_reasoning_completed";
const ENABLED_MODEL_CALL_COUNT: number | null = 1;
const ENABLED_SMART_TALK_RESULT_VISIBLE: boolean | null = true;
const OCR_WARNING_VISIBLE: boolean | null = true;
const ORIGINAL_DOCUMENT_CHECK_WARNING_VISIBLE: boolean | null = true;
const LEGAL_DISCLAIMER_VISIBLE: boolean | null = true;
const PRIVACY_DISCLAIMER_VISIBLE: boolean | null = true;
const ENABLED_NETWORK_POST_COUNT: number | null = 1;
const DUPLICATE_SUBMISSION_OBSERVED: boolean | null = false;
const ENABLED_HTTP_429_OBSERVED: boolean | null = false;
// FINAL CONSOLE-CHECK RETEST: the user explicitly checked the browser
// DevTools console this time (browserConsoleExplicitlyChecked: true) and
// reported no red runtime errors, no MODULE_NOT_FOUND, no uncaught
// exception — only normal HMR/Fast Refresh informational logs. This is the
// one field that was previously left null pending explicit confirmation;
// it is now confirmed false (no errors observed).
const BROWSER_CONSOLE_EXPLICITLY_CHECKED: boolean | null = true;
const BROWSER_CONSOLE_ERRORS_OBSERVED: boolean | null = false;
const SYNTHETIC_IMAGE_ONLY_CONFIRMED: boolean | null = true;

// 8.11P-RETEST-specific evidence: confirms the retest actually ran under
// the 8.11P-BLOCKER fix and that the previously-observed terminal error did
// not recur.
const RETEST_PERFORMED_UNDER_BLOCKER_FIX: boolean | null = true;
const RETEST_MODULE_NOT_FOUND_OBSERVED: boolean | null = false;

// Cleanup evidence.
// Verified directly, right now, via a filesystem check by this closure's
// own author (plain repo-state fact, not manual browser evidence, not
// invented, not assumed from the user's text): the temporary synthetic PNG
// fixture (tmp-8-11p-controlled-reasoning-test.png) is no longer present in
// the project root.
const TEMPORARY_PNG_REMOVED: boolean | null = true;
// Re-verified directly via a repo-root recursive filesystem search (plain
// repo-state fact, not manual browser evidence, not invented): no
// eng.traineddata file exists anywhere in the workspace.
const ENG_TRAINEDDATA_ABSENT: boolean | null = true;
// Scoped specifically to THIS phase's (8.11P's) own strict file boundary
// (one modified existing file + one new closure file), verified when this
// evidence was first recorded via `git status --short`. The downstream
// 8.11P-BLOCKER phase subsequently made its own separately-authorized and
// separately-audited change to next.config.ts plus its own new audit file
// — that does not reopen or violate 8.11P's own two-file boundary.
const EXACTLY_TWO_TRACKED_FILES_DIFFER: boolean | null = true;

// Free-text evidence captured verbatim from the user's report (never
// invented).
const DISABLED_VISIBLE_MESSAGE_OR_SCREENSHOT_NOTE: string | null =
  "Interné riadené vysvetlenie (OCR → Smart Talk) je momentálne vypnuté (kontrolovaný test).";
const ENABLED_VISIBLE_RESULT_SUMMARY_NOTE: string | null =
  "8.11P FINAL CONSOLE-CHECK RETEST: smartTalkResult (summary/meaning/urgency/next-steps) visible; OCR provider tesseract_js, extractedTextLength 98, confidence 72, quality.status usable, usableForSmartTalk true, blockingReasons []; modelInvocation provider openai, modelCallCount 1, timedOut false; browser DevTools console explicitly checked — no red runtime errors, no MODULE_NOT_FOUND, no uncaught exception, only normal HMR/Fast Refresh informational logs.";
const BROWSER_CONSOLE_ERROR_TEXT: readonly string[] = [];

// ─── Terminal root-cause evidence (reported by the user, not invented) ────
// This is a dev-server/Node.js TERMINAL log line, not a browser artifact.
// Recorded here verbatim for traceability; see the dedicated root-cause
// fields on the Result type below for the structured version. This is the
// ORIGINAL 8.11P failure evidence — retained for traceability even though
// the 8.11P-RETEST confirmed this error did NOT recur (see
// RETEST_MODULE_NOT_FOUND_OBSERVED above).
const TERMINAL_ROOT_CAUSE_ERROR_TEXT =
  "Error: Cannot find module 'C:\\ROOT\\node_modules\\tesseract.js\\src\\worker-script\\node\\index.js' (code: MODULE_NOT_FOUND), surfaced to the browser as POST /api/smart-talk 504.";

// ─── Result type ────────────────────────────────────────────────────────────

interface Result {
  checkId: "8.11P";
  allPassed: boolean;

  // ── FINAL RETURN FIELDS ──
  browserManualEvidencePending: boolean;
  browserManualTestPerformed: boolean;
  browserManualTestPassed: boolean;
  syntheticImageOnly: boolean | null;
  realDocumentUsed: false;
  uiPatchImplemented: true;
  existingEnvelopeOnlyButtonPreserved: true;
  separateControlledReasoningButtonImplemented: true;
  explicitClickRequired: true;
  automaticReasoningTriggered: false;
  operationControlledReasoningSent: true;
  operationFieldSelectsIntentOnly: true;
  clientCanAuthorizeReasoning: false;
  allAuthorizationRemainsServerSide: true;
  routeModifiedNow: false;
  reasoningRuntimeModifiedNow: false;
  packageModifiedNow: false;
  envFileModifiedNow: false;

  // ── STAGE A minimum-contract fields (kept alongside the final fields
  //    above; same underlying facts, named exactly as the phase's own
  //    Stage A contract requires) ──
  controlledReasoningOperationSentByUi: true;
  environmentAuthorizationStillServerSide: true;
  runtimeRouteModifiedNow: false;
  readyForCommit: boolean;

  // ── PASS/FAIL SUMMARY (explicitly requested in Stage B evidence) ──
  disabledBrowserCheckPassed: boolean;
  enabledBrowserCheckPassed: boolean;

  // ── TERMINAL ROOT-CAUSE FIELDS (8.11P-BLOCKER candidate) ──
  terminalRootCauseObserved: boolean;
  terminalRootCauseErrorText: string | null;
  terminalRootCauseIdentifiedStatically: boolean;
  rootCauseNextConfigMissingTesseractExternal: boolean | null;
  rootCauseOcrAdapterMissingExplicitWorkerPath: boolean | null;
  rootCauseFiles: readonly string[];
  ocrAdapterModifiedNow: false;
  nextConfigModifiedNow: false;
  proposedFollowUpPhaseId: "8.11P-BLOCKER";
  proposedFollowUpPhaseTitle: "Tesseract Next.js Dev Runtime Worker Path Fix";
  proposedFollowUpMinimalFiles: readonly string[];

  // ── 8.11P-RETEST FIELDS (fresh enabled browser retest after the
  // 8.11P-BLOCKER config-only fix) ──
  retestPerformedUnderBlockerFix: boolean | null;
  retestModuleNotFoundObserved: boolean | null;
  blockerFixValidatedInFreshBrowserRuntime: boolean;
  readyForNextPhaseName: "8.11Q" | false;

  // ── DISABLED CHECK FIELDS ──
  disabledBrowserCheckPerformed: boolean;
  disabledStatus: number | null;
  disabledCode: string | null;
  disabledSmartTalkResultShown: false;
  disabledFailClosedMessageVisible: boolean | null;
  disabledNetworkPostCount: number | null;
  disabledHttp429Observed: boolean | null;
  disabledNoSmartTalkResultConfirmed: boolean | null;
  disabledVisibleMessageOrScreenshotNote: string | null;

  // ── ENABLED CHECK FIELDS ──
  enabledBrowserCheckPerformed: boolean;
  enabledStatus: number | null;
  enabledOk: boolean | null;
  enabledHandoffAllowed: boolean | null;
  enabledHandoffPerformed: boolean | null;
  enabledReasoningAllowed: boolean | null;
  enabledReasoningPerformed: boolean | null;
  enabledReasoningReason: string | null;
  enabledModelCallCount: number | null;
  enabledSmartTalkResultVisible: boolean | null;
  ocrWarningVisible: boolean | null;
  originalDocumentCheckWarningVisible: boolean | null;
  legalDisclaimerVisible: boolean | null;
  privacyDisclaimerVisible: boolean | null;
  enabledNetworkPostCount: number | null;
  duplicateSubmissionObserved: boolean | null;
  enabledHttp429Observed: boolean | null;
  browserConsoleExplicitlyChecked: boolean | null;
  browserConsoleErrorsObserved: boolean | null;
  enabledVisibleResultSummaryNote: string | null;
  browserConsoleErrorText: readonly string[];

  // ── SAFETY FIELDS ──
  rawImageDirectToModelObserved: false;
  originalFileDirectToModelObserved: false;
  modelOutputPresentedAsVerifiedTruth: false;
  exactLegalDeadlineCreated: false;
  bindingLegalAdviceCreated: false;
  officialFilingCreated: false;
  paymentInstructionCreated: false;
  verifiedFactsCreated: false;
  persistenceObserved: false;
  dbStorageWriteObserved: false;
  dnaWriteObserved: false;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;

  // ── SOURCE FIELDS ──
  sourceEnabledSyntheticClosureCommit: "f06501f";
  sourceDisabledReasoningClosureCommit: "e354857";
  sourceRuntimePatchCommit: "cce84b9";
  sourceGateDesignCommit: "d2964a3";
  sourceEnabledSyntheticClosureAccepted: boolean;
  sourceDisabledReasoningClosureAccepted: boolean;
  sourceRuntimePatchAccepted: boolean;
  sourceGateDesignAccepted: boolean;

  // ── TECHNICAL DEBT FIELDS ──
  tesseractControlledCachePathStillNeeded: true;
  tesseractCleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  rateLimitIsolationStillNeeded: true;
  auditSourceSnapshotConsolidationStillNeeded: true;

  // ── CLEANUP FIELDS ──
  temporaryPngRemoved: boolean | null;
  engTraineddataAbsent: boolean | null;
  exactlyTwoTrackedFilesDiffer: boolean | null;

  // ── READINESS ──
  browserManualControlledReasoningClosureClosed: boolean;
  readyForInternalReadinessClosure: boolean;
  readyForMobileRealOcrTest: false;
  readyForRealDocumentTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11Q" | false;
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Internal Readiness Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  blockers: string[];
  notes: string[];
}

// ─── Pure evaluation logic ──────────────────────────────────────────────────

/**
 * The single source of truth for whether a Result honestly qualifies as
 * `allPassed: true`. Never set `allPassed` by hand elsewhere — always derive
 * it by calling this against the fully-assembled provisional result, so a
 * mismatch between claimed and actual state is structurally impossible.
 */
function computeExpectedAllPassed(r: Result): boolean {
  return (
    r.browserManualTestPerformed === true &&
    r.browserManualEvidencePending === false &&
    r.disabledBrowserCheckPerformed === true &&
    r.disabledStatus === 403 &&
    r.disabledCode === "ocr_controlled_reasoning_disabled" &&
    r.disabledSmartTalkResultShown === false &&
    r.disabledFailClosedMessageVisible === true &&
    r.disabledNetworkPostCount === 1 &&
    r.disabledHttp429Observed === false &&
    r.disabledNoSmartTalkResultConfirmed === true &&
    r.enabledBrowserCheckPerformed === true &&
    r.enabledStatus === 200 &&
    r.enabledOk === true &&
    r.enabledHandoffAllowed === true &&
    r.enabledHandoffPerformed === true &&
    r.enabledReasoningAllowed === true &&
    r.enabledReasoningPerformed === true &&
    r.enabledReasoningReason === "controlled_ocr_reasoning_completed" &&
    r.enabledModelCallCount === 1 &&
    r.enabledSmartTalkResultVisible === true &&
    r.ocrWarningVisible === true &&
    r.originalDocumentCheckWarningVisible === true &&
    r.legalDisclaimerVisible === true &&
    r.privacyDisclaimerVisible === true &&
    r.enabledNetworkPostCount === 1 &&
    r.duplicateSubmissionObserved === false &&
    r.enabledHttp429Observed === false &&
    r.browserConsoleExplicitlyChecked === true &&
    r.browserConsoleErrorsObserved === false &&
    r.syntheticImageOnly === true &&
    r.realDocumentUsed === false &&
    r.rawImageDirectToModelObserved === false &&
    r.originalFileDirectToModelObserved === false &&
    r.modelOutputPresentedAsVerifiedTruth === false &&
    r.exactLegalDeadlineCreated === false &&
    r.bindingLegalAdviceCreated === false &&
    r.officialFilingCreated === false &&
    r.paymentInstructionCreated === false &&
    r.verifiedFactsCreated === false &&
    r.persistenceObserved === false &&
    r.dbStorageWriteObserved === false &&
    r.dnaWriteObserved === false &&
    r.publicRuntimeStillBlocked === true &&
    r.productionAuthorizedNow === false &&
    r.goLiveAuthorizedNow === false &&
    r.temporaryPngRemoved === true &&
    r.engTraineddataAbsent === true &&
    r.exactlyTwoTrackedFilesDiffer === true &&
    r.uiPatchImplemented === true &&
    r.existingEnvelopeOnlyButtonPreserved === true &&
    r.separateControlledReasoningButtonImplemented === true &&
    r.explicitClickRequired === true &&
    r.operationControlledReasoningSent === true &&
    r.operationFieldSelectsIntentOnly === true &&
    r.clientCanAuthorizeReasoning === false &&
    r.allAuthorizationRemainsServerSide === true &&
    r.routeModifiedNow === false &&
    r.reasoningRuntimeModifiedNow === false &&
    r.packageModifiedNow === false &&
    r.envFileModifiedNow === false &&
    r.automaticReasoningTriggered === false &&
    r.sourceEnabledSyntheticClosureAccepted === true &&
    r.sourceDisabledReasoningClosureAccepted === true &&
    r.sourceRuntimePatchAccepted === true &&
    r.sourceGateDesignAccepted === true &&
    r.disabledBrowserCheckPassed === true &&
    r.enabledBrowserCheckPassed === true &&
    r.ocrAdapterModifiedNow === false &&
    r.nextConfigModifiedNow === false &&
    r.retestPerformedUnderBlockerFix === true &&
    r.retestModuleNotFoundObserved === false &&
    r.blockerFixValidatedInFreshBrowserRuntime === true &&
    r.tamperRejected === r.tamperCount
  );
  // Note: readyForCommit, readyForNextPhase, readyForNextPhaseName,
  // browserManualControlledReasoningClosureClosed, and
  // readyForInternalReadinessClosure are all OUTPUTS derived from allPassed
  // (see the exported function below), never inputs to it — checking them
  // here would be circular (they are still their pre-computed placeholder
  // values at the point this function is first called). validateResult
  // below checks the bidirectional implication against the already-final
  // allPassed instead.
}

/** Structural + logical validator used both for self-checking the real
 * result and for confirming every tamper case is correctly rejected. */
function validateResult(r: Result): boolean {
  if (r.checkId !== "8.11P") return false;
  if (typeof r.allPassed !== "boolean") return false;
  if (r.allPassed !== computeExpectedAllPassed(r)) return false;
  if (r.tamperRejected > r.tamperCount) return false;
  if (r.readyForCommit !== r.allPassed) return false;
  if (r.readyForNextPhase === "8.11Q" && !r.allPassed) return false;
  if (r.allPassed && r.readyForNextPhase !== "8.11Q") return false;
  if (r.readyForNextPhaseName === "8.11Q" && !r.allPassed) return false;
  if (r.allPassed && r.readyForNextPhaseName !== "8.11Q") return false;
  if (r.browserManualControlledReasoningClosureClosed && !r.allPassed) return false;
  if (r.readyForInternalReadinessClosure && !r.allPassed) return false;
  return true;
}

// ─── Build the provisional (non-tamper-annotated) result ───────────────────

function buildProvisionalResult(): Result {
  const sourceEnabledSyntheticClosureAccepted = verifySourceMarker(SOURCE_MARKERS[0]!);
  const sourceDisabledReasoningClosureAccepted = verifySourceMarker(SOURCE_MARKERS[1]!);
  const sourceRuntimePatchAccepted = verifySourceMarker(SOURCE_MARKERS[2]!);
  const sourceGateDesignAccepted = verifySourceMarker(SOURCE_MARKERS[3]!);

  const browserManualEvidencePending = !BROWSER_MANUAL_TEST_PERFORMED;

  const blockers: string[] = [];
  if (!BROWSER_MANUAL_TEST_PERFORMED) {
    blockers.push(
      "Manual browser evidence has not been recorded yet (Stage A pending state). Waiting for the user's exact reported DISABLED and ENABLED browser results before this closure's MANUAL EVIDENCE constants can be filled in.",
    );
  } else {
    if (!DISABLED_BROWSER_CHECK_PERFORMED) blockers.push("Disabled browser check not performed.");
    if (DISABLED_STATUS !== 403) blockers.push(`Disabled status expected 403, got ${DISABLED_STATUS}.`);
    if (DISABLED_CODE !== "ocr_controlled_reasoning_disabled")
      blockers.push(`Disabled code expected "ocr_controlled_reasoning_disabled", got ${DISABLED_CODE}.`);
    if (DISABLED_FAIL_CLOSED_MESSAGE_VISIBLE !== true)
      blockers.push("Disabled fail-closed message not confirmed visible.");
    if (DISABLED_NETWORK_POST_COUNT !== 1)
      blockers.push(`Disabled network POST count expected 1, got ${DISABLED_NETWORK_POST_COUNT}.`);
    if (DISABLED_HTTP_429_OBSERVED !== false) blockers.push("Disabled HTTP 429 observed.");
    if (DISABLED_NO_SMART_TALK_RESULT_CONFIRMED !== true)
      blockers.push("Disabled: absence of Smart Talk result not confirmed.");

    if (!ENABLED_BROWSER_CHECK_PERFORMED) blockers.push("Enabled browser check not performed.");
    if (ENABLED_STATUS !== 200) blockers.push(`Enabled status expected 200, got ${ENABLED_STATUS}.`);
    if (ENABLED_OK !== true) blockers.push("Enabled ok flag not confirmed true.");
    if (ENABLED_HANDOFF_ALLOWED !== true) blockers.push("Enabled handoff.allowed not confirmed true.");
    if (ENABLED_HANDOFF_PERFORMED !== true) blockers.push("Enabled handoff.performed not confirmed true.");
    if (ENABLED_REASONING_ALLOWED !== true) blockers.push("Enabled reasoning.allowed not confirmed true.");
    if (ENABLED_REASONING_PERFORMED !== true) blockers.push("Enabled reasoning.performed not confirmed true.");
    if (ENABLED_REASONING_REASON !== "controlled_ocr_reasoning_completed")
      blockers.push(`Enabled reasoning.reason expected "controlled_ocr_reasoning_completed", got ${ENABLED_REASONING_REASON}.`);
    if (ENABLED_MODEL_CALL_COUNT !== 1)
      blockers.push(`Enabled modelInvocation.modelCallCount expected 1, got ${ENABLED_MODEL_CALL_COUNT}.`);
    if (ENABLED_SMART_TALK_RESULT_VISIBLE !== true) blockers.push("Enabled smartTalkResult not confirmed visible.");
    if (OCR_WARNING_VISIBLE !== true) blockers.push("OCR uncertainty warning not confirmed visible.");
    if (ORIGINAL_DOCUMENT_CHECK_WARNING_VISIBLE !== true)
      blockers.push("Check-original-document warning not confirmed visible.");
    if (LEGAL_DISCLAIMER_VISIBLE !== true) blockers.push("Legal disclaimer not confirmed visible.");
    if (PRIVACY_DISCLAIMER_VISIBLE !== true) blockers.push("Privacy/no-save disclaimer not confirmed visible.");
    if (ENABLED_NETWORK_POST_COUNT !== 1)
      blockers.push(`Enabled network POST count expected 1, got ${ENABLED_NETWORK_POST_COUNT}.`);
    if (DUPLICATE_SUBMISSION_OBSERVED !== false) blockers.push("Duplicate submission observed.");
    if (ENABLED_HTTP_429_OBSERVED !== false) blockers.push("Enabled HTTP 429 observed.");
    if (BROWSER_CONSOLE_ERRORS_OBSERVED !== false) blockers.push("Browser console errors observed.");
    if (SYNTHETIC_IMAGE_ONLY_CONFIRMED !== true) blockers.push("Synthetic-image-only not confirmed.");

    if (TEMPORARY_PNG_REMOVED !== true) blockers.push("Temporary PNG fixture not confirmed removed.");
    if (ENG_TRAINEDDATA_ABSENT !== true) blockers.push("eng.traineddata artifact not confirmed absent.");
    if (EXACTLY_TWO_TRACKED_FILES_DIFFER !== true)
      blockers.push("git diff does not confirm exactly the two allowed tracked files differ.");
  }

  if (!sourceEnabledSyntheticClosureAccepted)
    blockers.push("Source marker missing/mismatched: 8.11O enabled synthetic closure (f06501f).");
  if (!sourceDisabledReasoningClosureAccepted)
    blockers.push("Source marker missing/mismatched: 8.11N disabled closure (e354857).");
  if (!sourceRuntimePatchAccepted)
    blockers.push("Source marker missing/mismatched: 8.11M runtime patch (cce84b9).");
  if (!sourceGateDesignAccepted)
    blockers.push("Source marker missing/mismatched: 8.11L gate design (d2964a3).");

  const disabledBrowserCheckPassed =
    DISABLED_BROWSER_CHECK_PERFORMED &&
    DISABLED_STATUS === 403 &&
    DISABLED_CODE === "ocr_controlled_reasoning_disabled" &&
    DISABLED_FAIL_CLOSED_MESSAGE_VISIBLE === true &&
    DISABLED_NETWORK_POST_COUNT === 1 &&
    DISABLED_HTTP_429_OBSERVED === false &&
    DISABLED_NO_SMART_TALK_RESULT_CONFIRMED === true;

  const enabledBrowserCheckPassed =
    ENABLED_BROWSER_CHECK_PERFORMED &&
    ENABLED_STATUS === 200 &&
    ENABLED_OK === true &&
    ENABLED_HANDOFF_ALLOWED === true &&
    ENABLED_HANDOFF_PERFORMED === true &&
    ENABLED_REASONING_ALLOWED === true &&
    ENABLED_REASONING_PERFORMED === true &&
    ENABLED_REASONING_REASON === "controlled_ocr_reasoning_completed" &&
    ENABLED_MODEL_CALL_COUNT === 1 &&
    ENABLED_SMART_TALK_RESULT_VISIBLE === true &&
    OCR_WARNING_VISIBLE === true &&
    ORIGINAL_DOCUMENT_CHECK_WARNING_VISIBLE === true &&
    LEGAL_DISCLAIMER_VISIBLE === true &&
    PRIVACY_DISCLAIMER_VISIBLE === true &&
    ENABLED_NETWORK_POST_COUNT === 1 &&
    DUPLICATE_SUBMISSION_OBSERVED === false &&
    ENABLED_HTTP_429_OBSERVED === false &&
    BROWSER_CONSOLE_EXPLICITLY_CHECKED === true &&
    BROWSER_CONSOLE_ERRORS_OBSERVED === false;

  if (BROWSER_MANUAL_TEST_PERFORMED && !enabledBrowserCheckPassed) {
    if (ENABLED_STATUS === 504) {
      blockers.push(
        "ENABLED browser check failed safely: HTTP 504 (ocr_to_smart_talk_handoff_timeout) before handoff/reasoning could be evaluated — see terminalRootCauseErrorText and rootCauseFiles for the identified cause and 8.11P-BLOCKER as the proposed narrow follow-up.",
      );
    } else if (BROWSER_CONSOLE_EXPLICITLY_CHECKED !== true || BROWSER_CONSOLE_ERRORS_OBSERVED === null) {
      blockers.push(
        "ENABLED browser check evidence is otherwise complete and passing, but browser DevTools console state has not been explicitly confirmed by the user — left null (unconfirmed) per the explicit instruction not to invent evidence. Please confirm whether the browser DevTools console showed any errors during the ENABLED retest.",
      );
    } else {
      blockers.push("ENABLED browser check did not pass all required conditions; see individual field blockers above/below.");
    }
  }

  const blockerFixValidatedInFreshBrowserRuntime =
    RETEST_PERFORMED_UNDER_BLOCKER_FIX === true &&
    RETEST_MODULE_NOT_FOUND_OBSERVED === false &&
    enabledBrowserCheckPassed;

  if (BROWSER_MANUAL_TEST_PERFORMED && RETEST_PERFORMED_UNDER_BLOCKER_FIX !== true) {
    blockers.push("Fresh enabled retest under the 8.11P-BLOCKER fix has not been confirmed as performed.");
  }
  if (BROWSER_MANUAL_TEST_PERFORMED && RETEST_MODULE_NOT_FOUND_OBSERVED !== false) {
    blockers.push("Retest MODULE_NOT_FOUND recurrence not confirmed absent.");
  }

  // This is a LIVE static check, re-run every time this closure runs — it
  // reflects the CURRENT committed source, not a frozen snapshot from when
  // the original MODULE_NOT_FOUND was first observed. Both a "bug still
  // present" state (nextConfigMissingTesseractExternal: true, before
  // 8.11P-BLOCKER) and a "fix applied" state (nextConfigMissingTesseractExternal:
  // false, after 8.11P-BLOCKER) are valid/expected outcomes and both confirm
  // the diagnosis was correct — only an unreadable file (null) or an adapter
  // shape change would indicate the diagnosis no longer applies.
  const rootCauseStaticCheck = TERMINAL_ROOT_CAUSE_ERROR_TEXT
    ? verifyTesseractWorkerPathRootCauseStatically()
    : null;
  const terminalRootCauseObserved = TERMINAL_ROOT_CAUSE_ERROR_TEXT.length > 0;
  const adapterStillReliesOnDefaultWorkerPath =
    rootCauseStaticCheck?.ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath === true;
  const nextConfigTesseractExternalizationKnown =
    typeof rootCauseStaticCheck?.nextConfigMissingTesseractExternal === "boolean";
  const terminalRootCauseIdentifiedStatically =
    adapterStillReliesOnDefaultWorkerPath && nextConfigTesseractExternalizationKnown;
  const rootCauseFixNowPresentInNextConfig =
    rootCauseStaticCheck?.nextConfigMissingTesseractExternal === false;

  if (terminalRootCauseObserved && !terminalRootCauseIdentifiedStatically) {
    blockers.push(
      "Terminal MODULE_NOT_FOUND was reported, but this closure's static check could not read/confirm the expected root-cause pattern in next.config.ts / real-ocr-adapter.ts — re-inspect manually.",
    );
  }

  const rootCauseFiles: readonly string[] = [
    "next.config.ts (serverExternalPackages does not list \"tesseract.js\", unlike the already-present \"pdf-parse\"/\"mammoth\" entries)",
    "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts (createWorker(TESSERACT_LANGUAGE) call passes no explicit workerPath override, so it depends entirely on tesseract.js's own default path.join(__dirname, '..', '..', 'worker-script', 'node', 'index.js') inside node_modules/tesseract.js/src/worker/node/defaultOptions.js, which breaks once __dirname no longer matches its real on-disk location under Next's dev-server bundling)",
  ];

  const proposedFollowUpMinimalFiles: readonly string[] = [
    "next.config.ts — add \"tesseract.js\" to serverExternalPackages (primary, minimal fix; same pattern already used for \"pdf-parse\"/\"mammoth\").",
    "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts — optional defense-in-depth: pass an explicit workerPath (e.g. via require.resolve(\"tesseract.js/src/worker-script/node/index.js\")) to createWorker() instead of relying on tesseract.js's own __dirname-relative default.",
  ];

  const readyForNextPhaseCandidate: "8.11Q" | false = false; // recomputed below once allPassed is known

  const provisional: Result = {
    checkId: "8.11P",
    allPassed: false, // recomputed below via computeExpectedAllPassed

    browserManualEvidencePending,
    browserManualTestPerformed: BROWSER_MANUAL_TEST_PERFORMED,
    browserManualTestPassed: BROWSER_MANUAL_TEST_PERFORMED && blockers.length === 0,
    syntheticImageOnly: SYNTHETIC_IMAGE_ONLY_CONFIRMED,
    realDocumentUsed: false,
    uiPatchImplemented: true,
    existingEnvelopeOnlyButtonPreserved: true,
    separateControlledReasoningButtonImplemented: true,
    explicitClickRequired: true,
    automaticReasoningTriggered: false,
    operationControlledReasoningSent: true,
    operationFieldSelectsIntentOnly: true,
    clientCanAuthorizeReasoning: false,
    allAuthorizationRemainsServerSide: true,
    routeModifiedNow: false,
    reasoningRuntimeModifiedNow: false,
    packageModifiedNow: false,
    envFileModifiedNow: false,

    controlledReasoningOperationSentByUi: true,
    environmentAuthorizationStillServerSide: true,
    runtimeRouteModifiedNow: false,
    readyForCommit: false, // recomputed below

    disabledBrowserCheckPassed,
    enabledBrowserCheckPassed,

    terminalRootCauseObserved,
    terminalRootCauseErrorText: terminalRootCauseObserved ? TERMINAL_ROOT_CAUSE_ERROR_TEXT : null,
    terminalRootCauseIdentifiedStatically,
    rootCauseNextConfigMissingTesseractExternal:
      rootCauseStaticCheck?.nextConfigMissingTesseractExternal ?? null,
    rootCauseOcrAdapterMissingExplicitWorkerPath:
      rootCauseStaticCheck?.ocrAdapterCallsCreateWorkerWithoutExplicitWorkerPath ?? null,
    rootCauseFiles,
    ocrAdapterModifiedNow: false,
    nextConfigModifiedNow: false,
    proposedFollowUpPhaseId: "8.11P-BLOCKER",
    proposedFollowUpPhaseTitle: "Tesseract Next.js Dev Runtime Worker Path Fix",
    proposedFollowUpMinimalFiles,

    retestPerformedUnderBlockerFix: RETEST_PERFORMED_UNDER_BLOCKER_FIX,
    retestModuleNotFoundObserved: RETEST_MODULE_NOT_FOUND_OBSERVED,
    blockerFixValidatedInFreshBrowserRuntime,
    readyForNextPhaseName: false, // recomputed below, alongside readyForNextPhase

    disabledBrowserCheckPerformed: DISABLED_BROWSER_CHECK_PERFORMED,
    disabledStatus: DISABLED_STATUS,
    disabledCode: DISABLED_CODE,
    disabledSmartTalkResultShown: false,
    disabledFailClosedMessageVisible: DISABLED_FAIL_CLOSED_MESSAGE_VISIBLE,
    disabledNetworkPostCount: DISABLED_NETWORK_POST_COUNT,
    disabledHttp429Observed: DISABLED_HTTP_429_OBSERVED,
    disabledNoSmartTalkResultConfirmed: DISABLED_NO_SMART_TALK_RESULT_CONFIRMED,
    disabledVisibleMessageOrScreenshotNote: DISABLED_VISIBLE_MESSAGE_OR_SCREENSHOT_NOTE,

    enabledBrowserCheckPerformed: ENABLED_BROWSER_CHECK_PERFORMED,
    enabledStatus: ENABLED_STATUS,
    enabledOk: ENABLED_OK,
    enabledHandoffAllowed: ENABLED_HANDOFF_ALLOWED,
    enabledHandoffPerformed: ENABLED_HANDOFF_PERFORMED,
    enabledReasoningAllowed: ENABLED_REASONING_ALLOWED,
    enabledReasoningPerformed: ENABLED_REASONING_PERFORMED,
    enabledReasoningReason: ENABLED_REASONING_REASON,
    enabledModelCallCount: ENABLED_MODEL_CALL_COUNT,
    enabledSmartTalkResultVisible: ENABLED_SMART_TALK_RESULT_VISIBLE,
    ocrWarningVisible: OCR_WARNING_VISIBLE,
    originalDocumentCheckWarningVisible: ORIGINAL_DOCUMENT_CHECK_WARNING_VISIBLE,
    legalDisclaimerVisible: LEGAL_DISCLAIMER_VISIBLE,
    privacyDisclaimerVisible: PRIVACY_DISCLAIMER_VISIBLE,
    enabledNetworkPostCount: ENABLED_NETWORK_POST_COUNT,
    duplicateSubmissionObserved: DUPLICATE_SUBMISSION_OBSERVED,
    enabledHttp429Observed: ENABLED_HTTP_429_OBSERVED,
    browserConsoleExplicitlyChecked: BROWSER_CONSOLE_EXPLICITLY_CHECKED,
    browserConsoleErrorsObserved: BROWSER_CONSOLE_ERRORS_OBSERVED,
    enabledVisibleResultSummaryNote: ENABLED_VISIBLE_RESULT_SUMMARY_NOTE,
    browserConsoleErrorText: BROWSER_CONSOLE_ERROR_TEXT,

    rawImageDirectToModelObserved: false,
    originalFileDirectToModelObserved: false,
    modelOutputPresentedAsVerifiedTruth: false,
    exactLegalDeadlineCreated: false,
    bindingLegalAdviceCreated: false,
    officialFilingCreated: false,
    paymentInstructionCreated: false,
    verifiedFactsCreated: false,
    persistenceObserved: false,
    dbStorageWriteObserved: false,
    dnaWriteObserved: false,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    sourceEnabledSyntheticClosureCommit: "f06501f",
    sourceDisabledReasoningClosureCommit: "e354857",
    sourceRuntimePatchCommit: "cce84b9",
    sourceGateDesignCommit: "d2964a3",
    sourceEnabledSyntheticClosureAccepted,
    sourceDisabledReasoningClosureAccepted,
    sourceRuntimePatchAccepted,
    sourceGateDesignAccepted,

    tesseractControlledCachePathStillNeeded: true,
    tesseractCleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    rateLimitIsolationStillNeeded: true,
    auditSourceSnapshotConsolidationStillNeeded: true,

    temporaryPngRemoved: TEMPORARY_PNG_REMOVED,
    engTraineddataAbsent: ENG_TRAINEDDATA_ABSENT,
    exactlyTwoTrackedFilesDiffer: EXACTLY_TWO_TRACKED_FILES_DIFFER,

    browserManualControlledReasoningClosureClosed: false, // recomputed below
    readyForInternalReadinessClosure: false, // recomputed below
    readyForMobileRealOcrTest: false,
    readyForRealDocumentTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: readyForNextPhaseCandidate, // recomputed below
    recommendedNextPhase:
      "OCR-to-Smart-Talk Controlled Reasoning Internal Readiness Closure",

    tamperCount: TAMPER_CASES.length,
    tamperRejected: 0, // computed by the exported function below
    tamperPassing: false, // computed by the exported function below

    blockers,
    notes: [
      "Phase 8.11P: minimal internal-only controlled-reasoning UI patch to app/smart-talk/SmartTalkClient.tsx; no API route, gate, adapter, input-builder, or runSmartTalk changes.",
      "New internal test button sends operation=\"controlled_reasoning\" via the existing photo_ocr_real_extraction_to_smart_talk_controlled_handoff multipart request; the existing envelope-only button is unchanged and still sends no operation field.",
      "Server-side env flags (SMART_TALK_REAL_OCR_EXTRACTION_ENABLED, SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED, SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED) remain the sole authorization mechanism; the operation field only selects intent.",
      "This closure performs zero browser/dev-server/OCR/model actions itself; all DISABLED/ENABLED evidence fields are either the honest Stage A pending value (null/false) or the user's own reported Stage B values.",
      ...(terminalRootCauseObserved
        ? [
            `Terminal root cause (originally user-reported, statically diagnosed): ${TERMINAL_ROOT_CAUSE_ERROR_TEXT}`,
            rootCauseFixNowPresentInNextConfig
              ? "8.11P-BLOCKER fix CONFIRMED present in the current committed source: next.config.ts's serverExternalPackages now includes \"tesseract.js\" alongside \"pdf-parse\"/\"mammoth\". real-ocr-adapter.ts is unchanged (still no explicit workerPath override) — consistent with a config-only fix."
              : "Statically confirmed condition (as of this evidence recording): next.config.ts's serverExternalPackages omits \"tesseract.js\" (only \"pdf-parse\"/\"mammoth\" are listed) AND real-ocr-adapter.ts's createWorker() call passes no explicit workerPath override.",
            "8.11P-RETEST: the fresh ENABLED browser check was performed under the 8.11P-BLOCKER fix and did NOT reproduce the MODULE_NOT_FOUND error — HTTP 200, ok:true, handoff/reasoning performed, exactly one model call, smartTalkResult visible, warnings/disclaimers visible.",
            "GAP RESOLVED: a final console-check retest explicitly checked the browser DevTools console (browserConsoleExplicitlyChecked: true) and confirmed no red runtime errors, no MODULE_NOT_FOUND, no uncaught exception — only normal HMR/Fast Refresh informational logs. browserConsoleErrorsObserved is now confirmed false, not invented.",
            "FINAL CLEANUP CONFIRMED: dev server stopped, all three temporary process-scoped env flags removed, tmp-8-11p-controlled-reasoning-test.png removed (independently re-verified absent by this closure's own author via a direct filesystem check), no eng.traineddata anywhere in the repo (independently re-verified via a repo-root recursive search).",
          ]
        : []),
    ],
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
    browserManualEvidencePending: false,
    browserManualTestPerformed: true,
    browserManualTestPassed: true,
    syntheticImageOnly: true,
    readyForCommit: true,
    disabledBrowserCheckPerformed: true,
    disabledStatus: 403,
    disabledCode: "ocr_controlled_reasoning_disabled",
    disabledFailClosedMessageVisible: true,
    disabledNetworkPostCount: 1,
    disabledHttp429Observed: false,
    disabledNoSmartTalkResultConfirmed: true,
    disabledVisibleMessageOrScreenshotNote: "synthetic-tamper-fixture-only",
    disabledBrowserCheckPassed: true,
    enabledBrowserCheckPassed: true,
    terminalRootCauseObserved: false,
    terminalRootCauseErrorText: null,
    terminalRootCauseIdentifiedStatically: false,
    enabledBrowserCheckPerformed: true,
    enabledStatus: 200,
    enabledOk: true,
    enabledHandoffAllowed: true,
    enabledHandoffPerformed: true,
    enabledReasoningAllowed: true,
    enabledReasoningPerformed: true,
    enabledReasoningReason: "controlled_ocr_reasoning_completed",
    enabledModelCallCount: 1,
    enabledSmartTalkResultVisible: true,
    ocrWarningVisible: true,
    originalDocumentCheckWarningVisible: true,
    legalDisclaimerVisible: true,
    privacyDisclaimerVisible: true,
    enabledNetworkPostCount: 1,
    duplicateSubmissionObserved: false,
    enabledHttp429Observed: false,
    browserConsoleExplicitlyChecked: true,
    browserConsoleErrorsObserved: false,
    enabledVisibleResultSummaryNote: "synthetic-tamper-fixture-only",
    temporaryPngRemoved: true,
    engTraineddataAbsent: true,
    exactlyTwoTrackedFilesDiffer: true,
    sourceEnabledSyntheticClosureAccepted: true,
    sourceDisabledReasoningClosureAccepted: true,
    sourceRuntimePatchAccepted: true,
    sourceGateDesignAccepted: true,
    browserManualControlledReasoningClosureClosed: true,
    readyForInternalReadinessClosure: true,
    readyForNextPhase: "8.11Q",
    readyForNextPhaseName: "8.11Q",
    retestPerformedUnderBlockerFix: true,
    retestModuleNotFoundObserved: false,
    blockerFixValidatedInFreshBrowserRuntime: true,
    ocrAdapterModifiedNow: false,
    nextConfigModifiedNow: false,
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
  { label: "manual evidence missing", mutate: (r) => ({ ...r, browserManualTestPerformed: false, browserManualEvidencePending: true }) },
  { label: "static evidence presented as browser evidence", mutate: (r) => ({ ...r, browserManualTestPerformed: true, disabledVisibleMessageOrScreenshotNote: null, disabledBrowserCheckPerformed: false }) },
  { label: "disabled check missing", mutate: (r) => ({ ...r, disabledBrowserCheckPerformed: false }) },
  { label: "disabled status not 403", mutate: (r) => ({ ...r, disabledStatus: 200 }) },
  { label: "disabled code incorrect", mutate: (r) => ({ ...r, disabledCode: "some_other_code" }) },
  { label: "disabled Smart Talk result shown", mutate: (r) => ({ ...r, disabledSmartTalkResultShown: true as false }) },
  { label: "disabled fail-closed message not visible", mutate: (r) => ({ ...r, disabledFailClosedMessageVisible: false }) },
  { label: "enabled check missing", mutate: (r) => ({ ...r, enabledBrowserCheckPerformed: false }) },
  { label: "enabled status not 200", mutate: (r) => ({ ...r, enabledStatus: 500 }) },
  { label: "enabled ok false", mutate: (r) => ({ ...r, enabledOk: false }) },
  { label: "handoff not performed", mutate: (r) => ({ ...r, enabledHandoffPerformed: false }) },
  { label: "handoff not allowed", mutate: (r) => ({ ...r, enabledHandoffAllowed: false }) },
  { label: "reasoning not allowed", mutate: (r) => ({ ...r, enabledReasoningAllowed: false }) },
  { label: "reasoning not performed", mutate: (r) => ({ ...r, enabledReasoningPerformed: false }) },
  { label: "reasoning reason incorrect", mutate: (r) => ({ ...r, enabledReasoningReason: "wrong_reason" }) },
  { label: "model call count not 1 (zero)", mutate: (r) => ({ ...r, enabledModelCallCount: 0 }) },
  { label: "model call count not 1 (two)", mutate: (r) => ({ ...r, enabledModelCallCount: 2 }) },
  { label: "Smart Talk result not visible", mutate: (r) => ({ ...r, enabledSmartTalkResultVisible: false }) },
  { label: "OCR warning missing", mutate: (r) => ({ ...r, ocrWarningVisible: false }) },
  { label: "original document check warning missing", mutate: (r) => ({ ...r, originalDocumentCheckWarningVisible: false }) },
  { label: "legal disclaimer missing", mutate: (r) => ({ ...r, legalDisclaimerVisible: false }) },
  { label: "privacy disclaimer missing", mutate: (r) => ({ ...r, privacyDisclaimerVisible: false }) },
  { label: "more than one disabled POST", mutate: (r) => ({ ...r, disabledNetworkPostCount: 2 }) },
  { label: "more than one enabled POST", mutate: (r) => ({ ...r, enabledNetworkPostCount: 2 }) },
  { label: "duplicate submission observed", mutate: (r) => ({ ...r, duplicateSubmissionObserved: true }) },
  { label: "disabled HTTP 429 observed", mutate: (r) => ({ ...r, disabledHttp429Observed: true }) },
  { label: "enabled HTTP 429 observed", mutate: (r) => ({ ...r, enabledHttp429Observed: true }) },
  { label: "browser console error observed", mutate: (r) => ({ ...r, browserConsoleErrorsObserved: true }) },
  { label: "browser console not explicitly checked but errors claimed false", mutate: (r) => ({ ...r, browserConsoleExplicitlyChecked: false }) },
  { label: "client-side env authorization claimed", mutate: (r) => ({ ...r, allAuthorizationRemainsServerSide: false as true }) },
  { label: "automatic request after file selection", mutate: (r) => ({ ...r, automaticReasoningTriggered: true as false }) },
  { label: "envelope-only button removed", mutate: (r) => ({ ...r, existingEnvelopeOnlyButtonPreserved: false as true }) },
  { label: "route modified", mutate: (r) => ({ ...r, routeModifiedNow: true as false, runtimeRouteModifiedNow: true as false }) },
  { label: "package.json modified", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "env file modified", mutate: (r) => ({ ...r, envFileModifiedNow: true as false }) },
  { label: "real document used", mutate: (r) => ({ ...r, realDocumentUsed: true as false, syntheticImageOnly: false }) },
  { label: "persistence observed", mutate: (r) => ({ ...r, persistenceObserved: true as false }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "temporary PNG remains", mutate: (r) => ({ ...r, temporaryPngRemoved: false }) },
  { label: "eng.traineddata remains", mutate: (r) => ({ ...r, engTraineddataAbsent: false }) },
  { label: "more than the two allowed tracked files differ", mutate: (r) => ({ ...r, exactlyTwoTrackedFilesDiffer: false }) },
  { label: "next phase not 8.11Q", mutate: (r) => ({ ...r, readyForNextPhase: "8.11Z" as "8.11Q" }) },
  { label: "allPassed claimed true despite failing sub-condition", mutate: (r) => ({ ...r, allPassed: true, enabledStatus: 502 }) },
  { label: "disabled check falsely marked passed", mutate: (r) => ({ ...r, disabledBrowserCheckPassed: true, disabledStatus: 500 }) },
  { label: "enabled check falsely marked passed", mutate: (r) => ({ ...r, enabledBrowserCheckPassed: true, enabledStatus: 504 }) },
  { label: "OCR adapter (real-ocr-adapter.ts) modified", mutate: (r) => ({ ...r, ocrAdapterModifiedNow: true as false }) },
  { label: "next.config.ts modified", mutate: (r) => ({ ...r, nextConfigModifiedNow: true as false }) },
  { label: "retest not confirmed performed under blocker fix", mutate: (r) => ({ ...r, retestPerformedUnderBlockerFix: false }) },
  { label: "retest MODULE_NOT_FOUND recurrence claimed absent without evidence", mutate: (r) => ({ ...r, retestModuleNotFoundObserved: null }) },
  { label: "blocker fix falsely claimed validated in fresh browser runtime", mutate: (r) => ({ ...r, blockerFixValidatedInFreshBrowserRuntime: true, enabledStatus: 504, enabledBrowserCheckPassed: false }) },
  { label: "readyForNextPhaseName not 8.11Q despite allPassed", mutate: (r) => ({ ...r, readyForNextPhaseName: false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
];

// ─── Exported closure entry point ───────────────────────────────────────────

export async function runOcrToSmartTalkControlledReasoningBrowserManualClosure(): Promise<Result> {
  const provisional = buildProvisionalResult();

  const fixture = buildSyntheticFullyPassingFixtureForTamperTestingOnly();
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!validateResult(tc.mutate(fixture))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11P tamper case not rejected: "${tc.label}"`);
    }
  }
  const tamperCount = TAMPER_CASES.length;

  const withDerivedFields: Result = {
    ...provisional,
    tamperCount,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
  };

  const finalAllPassed =
    computeExpectedAllPassed(withDerivedFields) && tamperFailures.length === 0;

  const final: Result = {
    ...withDerivedFields,
    allPassed: finalAllPassed,
    readyForCommit: finalAllPassed,
    browserManualControlledReasoningClosureClosed: finalAllPassed,
    readyForInternalReadinessClosure: finalAllPassed,
    readyForNextPhase: finalAllPassed ? "8.11Q" : false,
    readyForNextPhaseName: finalAllPassed ? "8.11Q" : false,
    notes: [
      ...withDerivedFields.notes,
      `8.11P tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
      ...(tamperFailures.length > 0 ? tamperFailures : []),
    ],
    blockers: [
      ...withDerivedFields.blockers,
      ...tamperFailures,
    ],
  };

  if (!validateResult(final)) {
    return {
      ...final,
      allPassed: false,
      readyForCommit: false,
      browserManualControlledReasoningClosureClosed: false,
      readyForInternalReadinessClosure: false,
      readyForNextPhase: false,
      readyForNextPhaseName: false,
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
    .includes("run-ocr-to-smart-talk-controlled-reasoning-browser-manual-closure");

if (invokedDirectly) {
  runOcrToSmartTalkControlledReasoningBrowserManualClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkControlledReasoningBrowserManualClosure failed:", err);
      process.exitCode = 1;
    });
}
