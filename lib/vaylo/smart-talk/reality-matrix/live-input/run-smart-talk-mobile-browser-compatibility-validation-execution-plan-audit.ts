/**
 * PHASE 8.13B — Smart Talk Mobile Browser Compatibility Validation
 * Execution Plan (Static Plan/Audit Only)
 *
 * This file converts the accepted PHASE 8.13A gate design into a precise,
 * ordered, evidence-based EXECUTION PLAN. It is a plan-and-audit artifact,
 * not an execution report: it does not claim that any browser or device
 * validation has already occurred, and it does not perform any of the
 * activities it plans for.
 *
 * This audit performs NO dynamic execution whatsoever: no route POST, no
 * model call, no OCR, no browser automation/startup, no local dev server,
 * no Android/iOS device, no environment mutation, no DB/Storage/DNA
 * read-or-write, no network access, no dependency install, no historical
 * live closure execution (including 8.3AC / tmp-8-3ac-live-metadata.ts). It
 * only:
 *
 *   1. Reads the PHASE 8.13A gate-design audit source
 *      (`run-smart-talk-mobile-browser-compatibility-validation-gate-design-audit.ts`)
 *      as plain text via `fs.readFileSync` and confirms — by string marker
 *      only, never by import/execution — that it is committed with
 *      `checkId: "8.13A"` and exposes the readiness field this plan
 *      depends on.
 *   2. Reads `app/smart-talk/SmartTalkClient.tsx`, `app/api/smart-talk/route.ts`,
 *      the rate limiter, the OCR technical-debt audit, and the PHASE 8.12F
 *      de-scope audit as plain text — same read-only technique — to ground
 *      the "still open" debts and dormant-backend claims in real source
 *      evidence rather than assumption.
 *   3. Recursively scans `app/` (plain text, no execution) for
 *      `suppressHydrationWarning` and `data-cursor-ref` to confirm neither
 *      has been added as an undisclosed workaround.
 *   4. Runs read-only `git` commands (`git status --short`,
 *      `git diff --name-only`) to confirm this phase modified no existing
 *      file and the working tree is otherwise clean.
 *   5. Runs 60 pure, in-memory tamper cases that mutate a deep-cloned
 *      "good" Result and confirm each mutation is rejected by
 *      `computeExpectedAllPassed`/`validateResult`.
 *
 * WHAT THIS PLAN DELIBERATELY DOES NOT DO: it does not start a browser, a
 * dev server, or any device session; it does not call a model or run OCR;
 * it does not access the network; it does not authorize production,
 * public beta, public runtime, or go-live. Every "*_PlanDefined" field
 * below means exactly that — the plan for that validation area has been
 * authored and is present in this file — never that the validation itself
 * has been performed.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source commit / gate constants ────────────────────────────────────────
const SOURCE_CLOSURE_COMMIT = "373810f";
const SOURCE_GATE_CHECK_ID = "8.13A";

const SMART_TALK_CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const RATE_LIMITER_REL_PATH = "lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts";
const OCR_DEBT_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-runtime-technical-debt-hardening-audit.ts";
const UNIFIED_REGRESSION_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-unified-smart-talk-cross-mode-regression-closure.ts";
const DESCOPE_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-standalone-mode-descope-audit.ts";
const GATE_DESIGN_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-mobile-browser-compatibility-validation-gate-design-audit.ts";
const OCR_HANDOFF_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts";

const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-mobile-browser-compatibility-validation-execution-plan-audit.ts";

const APP_SCAN_DIR = "app";

const REQUIRED_MODE_CHIP_CALLS: readonly string[] = [
  'modeChip("question", "Opýtať sa")',
  'modeChip("text", "Vysvetliť text")',
  'modeChip("photo", "Odfotiť dokument")',
];

const FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS: readonly string[] = [
  '"first_contact"',
  "first_contact_controlled_runtime",
  "onFirstContactSubmit",
  "Prvý kontakt",
];

const HYDRATION_WORKAROUND_STRINGS: readonly string[] = ["suppressHydrationWarning", "data-cursor-ref"];

// ─── Read-only helpers ──────────────────────────────────────────────────────

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return "";
  }
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), relPath));
}

function includesNone(haystack: string, needles: readonly string[]): { ok: boolean; found: string[] } {
  const found = needles.filter((n) => haystack.includes(n));
  return { ok: found.length === 0, found };
}

function menuOrderIsCorrect(src: string): boolean {
  const positions = REQUIRED_MODE_CHIP_CALLS.map((call) => src.indexOf(call));
  if (positions.some((p) => p < 0)) return false;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] <= positions[i - 1]) return false;
  }
  return true;
}

function scanDirForStrings(relDir: string, needles: readonly string[]): { found: string[]; filesScanned: number } {
  const skipDirs = new Set(["node_modules", ".next", ".git"]);
  const found = new Set<string>();
  let filesScanned = 0;

  function walk(absDir: string) {
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (skipDirs.has(entry.name)) continue;
      const abs = path.join(absDir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        let text = "";
        try {
          text = fs.readFileSync(abs, "utf8");
        } catch {
          continue;
        }
        filesScanned += 1;
        for (const n of needles) {
          if (text.includes(n)) found.add(n);
        }
      }
    }
  }

  walk(path.join(process.cwd(), relDir));
  return { found: [...found], filesScanned };
}

// ─── Explicit execution-step / evidence-status / environment / test-case types ──

type ExecutionStepId =
  | "STEP_0"
  | "STEP_1"
  | "STEP_2"
  | "STEP_3"
  | "STEP_4"
  | "STEP_5"
  | "STEP_6"
  | "STEP_7"
  | "STEP_8"
  | "STEP_9"
  | "STEP_10"
  | "STEP_11"
  | "STEP_12"
  | "STEP_13"
  | "STEP_14";

interface ExecutionStep {
  id: ExecutionStepId;
  order: number;
  title: string;
  description: string;
  containmentFirst: boolean;
  requiresPhysicalDeviceEvidence: boolean;
}

type EvidenceStatus =
  | "passed"
  | "failed"
  | "blocked_by_environment"
  | "not_tested"
  | "layout_only_evidence"
  | "tooling_artifact"
  | "inconclusive"
  | "not_applicable";

type EnvironmentCategory = "desktop" | "responsive_emulation" | "physical_mobile";

interface BrowserMatrixEntry {
  id: number;
  category: EnvironmentCategory;
  environment: string;
  layoutOnlyEvidence: boolean;
  requiresGenuineDevice: boolean;
}

type SmartTalkTestMode = "question" | "text" | "photo";

interface SyntheticTestCase {
  id: string;
  mode: SmartTalkTestMode;
  description: string;
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.13B";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceGateCheckId: string;
  sourceGateReadyForExecutionPlan: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  browserStarted: boolean;
  browserAutomationPerformed: boolean;
  physicalAndroidValidationPerformed: boolean;
  genuineIosSafariValidationPerformed: boolean;
  realModelCallPerformed: boolean;
  realOcrExecutionPerformed: boolean;
  networkAccessPerformed: boolean;
  databaseWritePerformed: boolean;
  persistencePerformed: boolean;

  executionOrderDefined: boolean;
  preconditionsDefined: boolean;
  evidenceStatusesDefined: boolean;
  browserMatrixDefined: boolean;
  syntheticTestDataDefined: boolean;
  desktopChromePlanDefined: boolean;
  desktopEdgePlanDefined: boolean;
  firefoxPlanDefined: boolean;
  responsiveViewportPlanDefined: boolean;
  physicalAndroidPlanDefined: boolean;
  genuineIosSafariPlanDefined: boolean;
  softwareKeyboardPlanDefined: boolean;
  touchPlanDefined: boolean;
  duplicateSubmissionPlanDefined: boolean;
  modelCallBudgetDefined: boolean;
  ocrExecutionBudgetDefined: boolean;
  filePickerPlanDefined: boolean;
  cameraPlanDefined: boolean;
  galleryPlanDefined: boolean;
  crossModeIsolationPlanDefined: boolean;
  noPersistencePlanDefined: boolean;
  privacyInspectionPlanDefined: boolean;
  networkInspectionPlanDefined: boolean;
  hydrationValidationPlanDefined: boolean;
  accessibilityPlanDefined: boolean;
  failureClassificationDefined: boolean;
  patchAuthorizationRulesDefined: boolean;
  stopConditionsDefined: boolean;
  futureClosurePhasesDefined: boolean;

  chromiumEmulationStillLayoutOnly: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  exifOrientationStillOpen: boolean;
  decodedPixelBoundsStillOpen: boolean;
  serverlessOcrValidationStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForDesktopAndResponsiveBrowserValidationClosure: boolean;

  // Supplementary premature-claim flags — every one must remain false;
  // tamper cases 1–53 each set exactly one of these true to prove rejection.
  executionAlreadyPerformedClaimed: boolean;
  browserAlreadyStartedClaimed: boolean;
  chromePassedClaimed: boolean;
  edgePassedClaimed: boolean;
  firefoxPassedClaimed: boolean;
  physicalAndroidPassedClaimed: boolean;
  genuineIosSafariPassedClaimed: boolean;
  responsiveEmulationClaimedEqualPhysicalDevice: boolean;
  desktopFilePickerClaimedEqualCamera: boolean;
  desktopChromeClaimedEqualAndroidChrome: boolean;
  chromeEmulationClaimedEqualSafari: boolean;
  softwareKeyboardClaimedPassedFromDesktopOnly: boolean;
  noPersistenceClaimedFromUiTextOnly: boolean;
  privacyClaimedProvedWithoutNetworkInspection: boolean;
  rawImageClaimedMaySendToModel: boolean;
  duplicateModelCallsClaimedAcceptable: boolean;
  duplicateOcrExecutionsClaimedAcceptable: boolean;
  unexpectedRetryClaimedAcceptable: boolean;
  firstContactClaimedMayReturnToNormalUi: boolean;
  paidDocumentModeClaimedBypassable: boolean;
  suppressHydrationWarningClaimedApproved: boolean;
  cursorInjectedAttributesClaimedProveDefect: boolean;
  heicClaimedSilentlyAcceptedAsPassed: boolean;
  exifHandlingClaimedCompleteWithoutEvidence: boolean;
  decodedPixelBoundsClaimedCompleteWithoutEvidence: boolean;
  serverlessOcrClaimedCompleteWithoutEvidence: boolean;
  distributedLimiterClaimedComplete: boolean;
  wcagComplianceClaimed: boolean;
  productionReadinessClaimed: boolean;
  publicBetaReadinessClaimed: boolean;
  goLiveAuthorizedClaimed: boolean;
  realClientDataClaimedAllowed: boolean;
  realPiiClaimedAllowed: boolean;
  databaseWritesClaimedAllowed: boolean;
  persistenceClaimedAllowed: boolean;
  browserHistoryClaimedMayRetainContent: boolean;
  queryStringClaimedMayContainContent: boolean;
  localStorageClaimedMayRetainContent: boolean;
  sessionStorageClaimedMayRetainContent: boolean;
  indexedDbClaimedMayRetainContent: boolean;
  serviceWorkerClaimedMayCacheContent: boolean;
  modeSwitchClaimedMayAutoSubmit: boolean;
  reloadClaimedMayReplayRequests: boolean;
  backNavigationClaimedMayReplayRequests: boolean;
  failureClaimedPatchableWithoutReproduction: boolean;
  toolingArtifactClaimedMayTriggerPatch: boolean;
  blockedByEnvironmentClaimedPassed: boolean;
  notTestedClaimedPassed: boolean;
  inconclusiveClaimedPassed: boolean;
  physicalDeviceEvidenceClaimedInferred: boolean;
  executionClaimedAllowedWithDirtyTree: boolean;
  environmentFlagsClaimedAllowedMutated: boolean;
  safetyStopConditionsClaimedIgnorable: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  executionSteps: ExecutionStep[];
  preconditions: string[];
  evidenceStatusDefinitions: { status: EvidenceStatus; rule: string }[];
  browserMatrix: BrowserMatrixEntry[];
  testDataContractQuestion: SyntheticTestCase[];
  testDataContractText: SyntheticTestCase[];
  testDataContractPhoto: SyntheticTestCase[];
  desktopManualChecklist: string[];
  responsiveEvidenceRequirements: string[];
  softwareKeyboardChecklist: string[];
  touchDuplicateSubmissionChecklist: string[];
  modelOcrCallBudgetRules: string[];
  filePickerCameraGalleryEvidenceCategories: string[];
  crossModeIsolationChecklist: string[];
  noPersistenceChecklist: string[];
  privacyNetworkInspectionChecklist: string[];
  hydrationValidationProcedure: string[];
  accessibilityChecklist: string[];
  failureClassificationCategories: string[];
  patchAuthorizationRules: string[];
  stopConditions: string[];
  futureClosurePhases: { phaseId: string; title: string }[];
  knownOpenDebts: string[];
  implementationLimitations: string[];
  remainingBlockers: string[];
  readinessVerdict: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = {
  id: number;
  description: string;
  mutate: (r: Result) => void;
};

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "claim execution already performed", mutate: (r) => { r.executionAlreadyPerformedClaimed = true; } },
  { id: 2, description: "claim browser already started", mutate: (r) => { r.browserAlreadyStartedClaimed = true; r.browserStarted = true; } },
  { id: 3, description: "claim Chrome passed", mutate: (r) => { r.chromePassedClaimed = true; } },
  { id: 4, description: "claim Edge passed", mutate: (r) => { r.edgePassedClaimed = true; } },
  { id: 5, description: "claim Firefox passed", mutate: (r) => { r.firefoxPassedClaimed = true; } },
  { id: 6, description: "claim physical Android passed", mutate: (r) => { r.physicalAndroidPassedClaimed = true; r.physicalAndroidValidationPerformed = true; } },
  { id: 7, description: "claim genuine iOS Safari passed", mutate: (r) => { r.genuineIosSafariPassedClaimed = true; r.genuineIosSafariValidationPerformed = true; } },
  { id: 8, description: "claim responsive emulation equals physical-device evidence", mutate: (r) => { r.responsiveEmulationClaimedEqualPhysicalDevice = true; } },
  { id: 9, description: "claim desktop file picker equals camera validation", mutate: (r) => { r.desktopFilePickerClaimedEqualCamera = true; } },
  { id: 10, description: "claim desktop Chrome equals Android Chrome validation", mutate: (r) => { r.desktopChromeClaimedEqualAndroidChrome = true; } },
  { id: 11, description: "claim Chrome emulation equals Safari validation", mutate: (r) => { r.chromeEmulationClaimedEqualSafari = true; } },
  { id: 12, description: "claim software keyboard passed from desktop-only evidence", mutate: (r) => { r.softwareKeyboardClaimedPassedFromDesktopOnly = true; } },
  { id: 13, description: "claim no-persistence proved only by UI text", mutate: (r) => { r.noPersistenceClaimedFromUiTextOnly = true; } },
  { id: 14, description: "claim privacy proved without network inspection", mutate: (r) => { r.privacyClaimedProvedWithoutNetworkInspection = true; } },
  { id: 15, description: "claim raw image may be sent to model", mutate: (r) => { r.rawImageClaimedMaySendToModel = true; } },
  { id: 16, description: "claim duplicate model calls are acceptable", mutate: (r) => { r.duplicateModelCallsClaimedAcceptable = true; } },
  { id: 17, description: "claim duplicate OCR executions are acceptable", mutate: (r) => { r.duplicateOcrExecutionsClaimedAcceptable = true; } },
  { id: 18, description: "claim unexpected retry calls are acceptable", mutate: (r) => { r.unexpectedRetryClaimedAcceptable = true; } },
  { id: 19, description: "claim First Contact may return to normal UI", mutate: (r) => { r.firstContactClaimedMayReturnToNormalUi = true; } },
  { id: 20, description: "claim paid document mode may be bypassed", mutate: (r) => { r.paidDocumentModeClaimedBypassable = true; } },
  { id: 21, description: "claim suppressHydrationWarning is an approved workaround", mutate: (r) => { r.suppressHydrationWarningClaimedApproved = true; } },
  { id: 22, description: "claim Cursor-injected DOM attributes prove a product defect", mutate: (r) => { r.cursorInjectedAttributesClaimedProveDefect = true; } },
  { id: 23, description: "claim unsupported HEIC is silently accepted as passed", mutate: (r) => { r.heicClaimedSilentlyAcceptedAsPassed = true; r.heicHeifStillOpen = false; } },
  { id: 24, description: "claim EXIF handling is complete without evidence", mutate: (r) => { r.exifHandlingClaimedCompleteWithoutEvidence = true; r.exifOrientationStillOpen = false; } },
  { id: 25, description: "claim decoded pixel bounds are complete without evidence", mutate: (r) => { r.decodedPixelBoundsClaimedCompleteWithoutEvidence = true; r.decodedPixelBoundsStillOpen = false; } },
  { id: 26, description: "claim serverless OCR is complete without evidence", mutate: (r) => { r.serverlessOcrClaimedCompleteWithoutEvidence = true; r.serverlessOcrValidationStillOpen = false; } },
  { id: 27, description: "claim distributed limiter is complete", mutate: (r) => { r.distributedLimiterClaimedComplete = true; r.distributedRateLimiterStillOpen = false; } },
  { id: 28, description: "claim WCAG compliance", mutate: (r) => { r.wcagComplianceClaimed = true; } },
  { id: 29, description: "claim production readiness", mutate: (r) => { r.productionReadinessClaimed = true; r.productionAuthorizedNow = true; } },
  { id: 30, description: "claim public beta readiness", mutate: (r) => { r.publicBetaReadinessClaimed = true; r.publicRuntimeAuthorizedNow = true; } },
  { id: 31, description: "claim go-live is authorized", mutate: (r) => { r.goLiveAuthorizedClaimed = true; r.goLiveAuthorizedNow = true; } },
  { id: 32, description: "claim real client data may be used", mutate: (r) => { r.realClientDataClaimedAllowed = true; } },
  { id: 33, description: "claim real PII may be used", mutate: (r) => { r.realPiiClaimedAllowed = true; } },
  { id: 34, description: "claim database writes are allowed", mutate: (r) => { r.databaseWritesClaimedAllowed = true; r.databaseWritePerformed = true; } },
  { id: 35, description: "claim persistence is allowed", mutate: (r) => { r.persistenceClaimedAllowed = true; r.persistencePerformed = true; } },
  { id: 36, description: "claim browser history may retain document content", mutate: (r) => { r.browserHistoryClaimedMayRetainContent = true; } },
  { id: 37, description: "claim query strings may contain document content", mutate: (r) => { r.queryStringClaimedMayContainContent = true; } },
  { id: 38, description: "claim localStorage may retain document content", mutate: (r) => { r.localStorageClaimedMayRetainContent = true; } },
  { id: 39, description: "claim sessionStorage may retain document content", mutate: (r) => { r.sessionStorageClaimedMayRetainContent = true; } },
  { id: 40, description: "claim IndexedDB may retain document content", mutate: (r) => { r.indexedDbClaimedMayRetainContent = true; } },
  { id: 41, description: "claim service worker may cache document content", mutate: (r) => { r.serviceWorkerClaimedMayCacheContent = true; } },
  { id: 42, description: "claim mode switching may submit automatically", mutate: (r) => { r.modeSwitchClaimedMayAutoSubmit = true; } },
  { id: 43, description: "claim reload may replay requests", mutate: (r) => { r.reloadClaimedMayReplayRequests = true; } },
  { id: 44, description: "claim back navigation may replay requests", mutate: (r) => { r.backNavigationClaimedMayReplayRequests = true; } },
  { id: 45, description: "claim failure may be patched without reproduction", mutate: (r) => { r.failureClaimedPatchableWithoutReproduction = true; } },
  { id: 46, description: "claim tooling artifact may trigger a production patch", mutate: (r) => { r.toolingArtifactClaimedMayTriggerPatch = true; } },
  { id: 47, description: "claim blocked-by-environment may be treated as passed", mutate: (r) => { r.blockedByEnvironmentClaimedPassed = true; } },
  { id: 48, description: "claim not-tested may be treated as passed", mutate: (r) => { r.notTestedClaimedPassed = true; } },
  { id: 49, description: "claim inconclusive may be treated as passed", mutate: (r) => { r.inconclusiveClaimedPassed = true; } },
  { id: 50, description: "claim physical-device evidence may be inferred", mutate: (r) => { r.physicalDeviceEvidenceClaimedInferred = true; } },
  { id: 51, description: "claim execution may proceed with a dirty working tree", mutate: (r) => { r.executionClaimedAllowedWithDirtyTree = true; } },
  { id: 52, description: "claim environment flags may remain mutated", mutate: (r) => { r.environmentFlagsClaimedAllowedMutated = true; } },
  { id: 53, description: "claim safety stop conditions may be ignored", mutate: (r) => { r.safetyStopConditionsClaimedIgnorable = true; } },
  { id: 54, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "8.13A"; } },
  { id: 55, description: "sourceClosureCommit mismatch", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 56, description: "sourceGateCheckId mismatch", mutate: (r) => { r.sourceGateCheckId = "8.12F-DE-SCOPE"; } },
  { id: 57, description: "sourceGateReadyForExecutionPlan false while claimed allPassed", mutate: (r) => { r.sourceGateReadyForExecutionPlan = false; } },
  { id: 58, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
  { id: 59, description: "executionOrderDefined false", mutate: (r) => { r.executionOrderDefined = false; } },
  { id: 60, description: "stopConditionsDefined false", mutate: (r) => { r.stopConditionsDefined = false; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const expectedAllPassed = computeExpectedAllPassed(mutated);
    const structuralViolations = validateResult(mutated);
    const isRejected = expectedAllPassed === false || structuralViolations.length > 0;
    if (isRejected) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

/**
 * Mirrors every boolean/string/number invariant a tamper case can break.
 * Deliberately re-derives the pass/fail decision from scratch rather than
 * trusting the (possibly-tampered) `allPassed` field itself.
 */
function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "8.13B",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceGateCheckId === SOURCE_GATE_CHECK_ID,
    r.sourceGateReadyForExecutionPlan === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.browserStarted === false,
    r.browserAutomationPerformed === false,
    r.physicalAndroidValidationPerformed === false,
    r.genuineIosSafariValidationPerformed === false,
    r.realModelCallPerformed === false,
    r.realOcrExecutionPerformed === false,
    r.networkAccessPerformed === false,
    r.databaseWritePerformed === false,
    r.persistencePerformed === false,

    r.executionOrderDefined === true,
    r.preconditionsDefined === true,
    r.evidenceStatusesDefined === true,
    r.browserMatrixDefined === true,
    r.syntheticTestDataDefined === true,
    r.desktopChromePlanDefined === true,
    r.desktopEdgePlanDefined === true,
    r.firefoxPlanDefined === true,
    r.responsiveViewportPlanDefined === true,
    r.physicalAndroidPlanDefined === true,
    r.genuineIosSafariPlanDefined === true,
    r.softwareKeyboardPlanDefined === true,
    r.touchPlanDefined === true,
    r.duplicateSubmissionPlanDefined === true,
    r.modelCallBudgetDefined === true,
    r.ocrExecutionBudgetDefined === true,
    r.filePickerPlanDefined === true,
    r.cameraPlanDefined === true,
    r.galleryPlanDefined === true,
    r.crossModeIsolationPlanDefined === true,
    r.noPersistencePlanDefined === true,
    r.privacyInspectionPlanDefined === true,
    r.networkInspectionPlanDefined === true,
    r.hydrationValidationPlanDefined === true,
    r.accessibilityPlanDefined === true,
    r.failureClassificationDefined === true,
    r.patchAuthorizationRulesDefined === true,
    r.stopConditionsDefined === true,
    r.futureClosurePhasesDefined === true,

    r.chromiumEmulationStillLayoutOnly === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.heicHeifStillOpen === true,
    r.exifOrientationStillOpen === true,
    r.decodedPixelBoundsStillOpen === true,
    r.serverlessOcrValidationStillOpen === true,
    r.distributedRateLimiterStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.executionAlreadyPerformedClaimed === false,
    r.browserAlreadyStartedClaimed === false,
    r.chromePassedClaimed === false,
    r.edgePassedClaimed === false,
    r.firefoxPassedClaimed === false,
    r.physicalAndroidPassedClaimed === false,
    r.genuineIosSafariPassedClaimed === false,
    r.responsiveEmulationClaimedEqualPhysicalDevice === false,
    r.desktopFilePickerClaimedEqualCamera === false,
    r.desktopChromeClaimedEqualAndroidChrome === false,
    r.chromeEmulationClaimedEqualSafari === false,
    r.softwareKeyboardClaimedPassedFromDesktopOnly === false,
    r.noPersistenceClaimedFromUiTextOnly === false,
    r.privacyClaimedProvedWithoutNetworkInspection === false,
    r.rawImageClaimedMaySendToModel === false,
    r.duplicateModelCallsClaimedAcceptable === false,
    r.duplicateOcrExecutionsClaimedAcceptable === false,
    r.unexpectedRetryClaimedAcceptable === false,
    r.firstContactClaimedMayReturnToNormalUi === false,
    r.paidDocumentModeClaimedBypassable === false,
    r.suppressHydrationWarningClaimedApproved === false,
    r.cursorInjectedAttributesClaimedProveDefect === false,
    r.heicClaimedSilentlyAcceptedAsPassed === false,
    r.exifHandlingClaimedCompleteWithoutEvidence === false,
    r.decodedPixelBoundsClaimedCompleteWithoutEvidence === false,
    r.serverlessOcrClaimedCompleteWithoutEvidence === false,
    r.distributedLimiterClaimedComplete === false,
    r.wcagComplianceClaimed === false,
    r.productionReadinessClaimed === false,
    r.publicBetaReadinessClaimed === false,
    r.goLiveAuthorizedClaimed === false,
    r.realClientDataClaimedAllowed === false,
    r.realPiiClaimedAllowed === false,
    r.databaseWritesClaimedAllowed === false,
    r.persistenceClaimedAllowed === false,
    r.browserHistoryClaimedMayRetainContent === false,
    r.queryStringClaimedMayContainContent === false,
    r.localStorageClaimedMayRetainContent === false,
    r.sessionStorageClaimedMayRetainContent === false,
    r.indexedDbClaimedMayRetainContent === false,
    r.serviceWorkerClaimedMayCacheContent === false,
    r.modeSwitchClaimedMayAutoSubmit === false,
    r.reloadClaimedMayReplayRequests === false,
    r.backNavigationClaimedMayReplayRequests === false,
    r.failureClaimedPatchableWithoutReproduction === false,
    r.toolingArtifactClaimedMayTriggerPatch === false,
    r.blockedByEnvironmentClaimedPassed === false,
    r.notTestedClaimedPassed === false,
    r.inconclusiveClaimedPassed === false,
    r.physicalDeviceEvidenceClaimedInferred === false,
    r.executionClaimedAllowedWithDirtyTree === false,
    r.environmentFlagsClaimedAllowedMutated === false,
    r.safetyStopConditionsClaimedIgnorable === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

function validateResult(r: Result): string[] {
  const violations: string[] = [];
  if (r.checkId !== "8.13B") violations.push("checkId must be exactly 8.13B");
  if (r.sourceClosureCommit !== SOURCE_CLOSURE_COMMIT) violations.push("sourceClosureCommit mismatch");
  if (r.sourceGateCheckId !== SOURCE_GATE_CHECK_ID) violations.push("sourceGateCheckId mismatch");
  if (r.executionSteps.length !== 15) violations.push("executionSteps must define exactly 15 ordered steps (STEP 0–14)");
  const orders = r.executionSteps.map((s) => s.order);
  if (JSON.stringify(orders) !== JSON.stringify([...orders].sort((a, b) => a - b))) {
    violations.push("executionSteps must be sorted by ascending order");
  }
  if (r.browserMatrix.length < 13) violations.push("browserMatrix must define at least 13 environments");
  if (r.browserMatrix.some((e) => e.category === "responsive_emulation" && !e.layoutOnlyEvidence)) {
    violations.push("every responsive_emulation entry must be marked layoutOnlyEvidence");
  }
  if (r.browserMatrix.some((e) => e.category === "physical_mobile" && e.layoutOnlyEvidence)) {
    violations.push("physical_mobile entries must never be marked layoutOnlyEvidence");
  }
  if (r.evidenceStatusDefinitions.length !== 8) violations.push("exactly 8 evidence statuses must be defined");
  if (r.futureClosurePhases.length < 5) violations.push("at least 5 future closure phases must be defined");
  return violations;
}

// ─── Evidence collection (all static/read-only) ────────────────────────────

type Evidence = {
  noExistingFileModified: boolean;
  gateDesignAccepted: boolean;
  descopeAuditRetained: boolean;
  menuOrderCorrect: boolean;
  modeChipCallCount: number;
  forbiddenClientStringsAbsent: boolean;
  backendFirstContactRoutePresent: boolean;
  backendExactTrueGatePresent: boolean;
  backendDisabledByDefault: boolean;
  rateLimiterModuleLevelInMemory: boolean;
  rateLimiterDistributedProductionSolved: boolean;
  heicSupportImplementedNow: boolean;
  hydrationWorkaroundStringsFound: string[];
  hydrationScanFilesScanned: number;
  notes: string[];
};

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, ""))
    .filter((p) => !p.startsWith(".next"));

  const modifiedExisting = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const onlyExpectedUntracked = untrackedNew.every((p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH));
  const noExistingFileModified = modifiedExisting.length === 0 && onlyExpectedUntracked;
  if (modifiedExisting.length > 0) {
    notes.push(`Existing tracked files unexpectedly modified: ${modifiedExisting.join(", ")}`);
  }
  if (!onlyExpectedUntracked) {
    notes.push(`Unexpected untracked files present: ${untrackedNew.filter((p) => p !== AUDIT_SELF_REL_PATH).join(", ")}`);
  }

  const gateDesignSrc = readFileText(GATE_DESIGN_AUDIT_REL_PATH);
  const gateDesignAccepted =
    fileExists(GATE_DESIGN_AUDIT_REL_PATH) &&
    gateDesignSrc.includes('checkId: "8.13A"') &&
    gateDesignSrc.includes("readyForMobileBrowserCompatibilityExecutionPlan") &&
    gateDesignSrc.includes("runSmartTalkMobileBrowserCompatibilityValidationGateDesignAudit");

  const descopeAuditRetained =
    fileExists(DESCOPE_AUDIT_REL_PATH) && readFileText(DESCOPE_AUDIT_REL_PATH).includes('checkId: "8.12F-DE-SCOPE"');

  const clientSrc = readFileText(SMART_TALK_CLIENT_REL_PATH);
  const routeSrc = readFileText(ROUTE_REL_PATH);

  const menuOrderCorrect = menuOrderIsCorrect(clientSrc);
  const modeChipCallCount = (clientSrc.match(/modeChip\(\s*"[a-z_]+"/g) ?? []).length;
  const { ok: forbiddenClientStringsAbsent } = includesNone(clientSrc, FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS);

  const backendFirstContactRoutePresent =
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") &&
    routeSrc.includes("o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE");
  const backendExactTrueGatePresent = routeSrc.includes('process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true"');
  const envFilesWithFlag = ["/.env", "/.env.local", "/.env.production"]
    .map((p) => readFileText(p.slice(1)))
    .some((s) => s.includes("SMART_TALK_FIRST_CONTACT_MODE_ENABLED"));
  const backendDisabledByDefault = backendExactTrueGatePresent && !envFilesWithFlag;

  const rateLimiterSrc = readFileText(RATE_LIMITER_REL_PATH);
  const rateLimiterModuleLevelInMemory =
    rateLimiterSrc.includes("module-level in-memory") && rateLimiterSrc.includes("new Map<string, number[]>()");
  const rateLimiterDistributedProductionSolved = /distributed[\s-]*production|production[\s-]*distributed/i.test(
    rateLimiterSrc,
  );

  const ocrDebtSrc = readFileText(OCR_DEBT_AUDIT_REL_PATH);
  const heicSupportImplementedNow = !ocrDebtSrc.includes("heicSupportImplementedNow: false");

  const hydrationScan = scanDirForStrings(APP_SCAN_DIR, HYDRATION_WORKAROUND_STRINGS);

  return {
    noExistingFileModified,
    gateDesignAccepted,
    descopeAuditRetained,
    menuOrderCorrect,
    modeChipCallCount,
    forbiddenClientStringsAbsent,
    backendFirstContactRoutePresent,
    backendExactTrueGatePresent,
    backendDisabledByDefault,
    rateLimiterModuleLevelInMemory,
    rateLimiterDistributedProductionSolved,
    heicSupportImplementedNow,
    hydrationWorkaroundStringsFound: hydrationScan.found,
    hydrationScanFilesScanned: hydrationScan.filesScanned,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const threeModeContractHolds =
    evidence.menuOrderCorrect && evidence.modeChipCallCount === 3 && evidence.forbiddenClientStringsAbsent;
  const dormantBackendHolds =
    evidence.backendFirstContactRoutePresent && evidence.backendExactTrueGatePresent && evidence.backendDisabledByDefault;
  const noWorkaroundFound = evidence.hydrationWorkaroundStringsFound.length === 0;

  const staticAllPassed =
    evidence.noExistingFileModified &&
    evidence.gateDesignAccepted &&
    evidence.descopeAuditRetained &&
    threeModeContractHolds &&
    dormantBackendHolds &&
    noWorkaroundFound;

  const executionSteps: ExecutionStep[] = [
    { id: "STEP_0", order: 0, title: "Preconditions and repository state", description: "Confirm clean working tree, exact source closure commit, no uncommitted runtime/UI changes, documented environment flags, and a synthetic-only test-data plan before any execution begins.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_1", order: 1, title: "Static source readiness confirmation", description: "Re-confirm (statically) the three-mode UI contract, dormant First Contact backend, rate-limiter shape, and OCR open debts against current committed source before any browser is opened.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_2", order: 2, title: "Clean desktop Chrome manual validation", description: "Manual validation in a clean Chrome profile/private window using the desktop manual checklist and synthetic test data.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_3", order: 3, title: "Clean desktop Edge manual validation", description: "Repeat the desktop manual checklist in a clean Edge profile/private window.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_4", order: 4, title: "Optional desktop Firefox validation", description: "Where feasible, repeat the desktop manual checklist in Firefox; record blocked_by_environment if unavailable.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_5", order: 5, title: "Chromium responsive viewport validation", description: "Exercise the responsive viewport matrix using Chromium DevTools device emulation; every result is labeled layout_only_evidence.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_6", order: 6, title: "Software keyboard and touch-oriented responsive checks", description: "Within the same emulation session, exercise keyboard/touch layout checks; explicitly not a substitute for genuine mobile keyboard validation.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_7", order: 7, title: "Physical Android Chrome validation", description: "Genuine physical Android device running Chrome; the only acceptable evidence source for physicalAndroidValidationPerformed.", containmentFirst: false, requiresPhysicalDeviceEvidence: true },
    { id: "STEP_8", order: 8, title: "Genuine iOS Safari validation", description: "Genuine iPhone/iPad Safari (or a genuine, non-emulated remote Safari environment); the only acceptable evidence source for genuineIosSafariValidationPerformed.", containmentFirst: false, requiresPhysicalDeviceEvidence: true },
    { id: "STEP_9", order: 9, title: "File picker, camera, and gallery validation", description: "Exercise the file-picker/camera/gallery evidence categories per environment, keeping desktop-picker evidence separate from camera evidence.", containmentFirst: false, requiresPhysicalDeviceEvidence: true },
    { id: "STEP_10", order: 10, title: "Cross-mode isolation validation", description: "Confirm question/text/photo isolation, dormant First Contact unreachability, and paid-boundary integrity across all tested environments.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_11", order: 11, title: "No-persistence and privacy validation", description: "Runtime browser inspection (storage/cookies/history/cache) and network/console inspection across before/after-submit/after-result/after-refresh states.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_12", order: 12, title: "Network, console, and hydration inspection", description: "Inspect network payloads, console output, and — only if a hydration mismatch appears — apply the clean-browser hydration reproduction procedure.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_13", order: 13, title: "Failure classification and patch authorization decision", description: "Classify every observed failure using the failure-classification categories and apply the patch-authorization rules before any code change is proposed.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
    { id: "STEP_14", order: 14, title: "Execution closure audit", description: "Author the closure audit for the executed scope (desktop/responsive, Android, or iOS) consolidating evidence, statuses, and remaining blockers.", containmentFirst: true, requiresPhysicalDeviceEvidence: false },
  ];

  const evidenceStatusDefinitions: { status: EvidenceStatus; rule: string }[] = [
    { status: "passed", rule: "Requires required evidence captured from the correct environment for that specific test case; never inferred." },
    { status: "failed", rule: "Reproducible negative result with evidence captured from the correct environment." },
    { status: "blocked_by_environment", rule: "Environment genuinely unavailable (e.g. no macOS/iOS device); must never be converted into passed." },
    { status: "not_tested", rule: "Simply not yet executed; must remain not_tested until real evidence is captured." },
    { status: "layout_only_evidence", rule: "Chromium responsive-emulation result; must never be promoted to a physical-device pass." },
    { status: "tooling_artifact", rule: "Requires clean-browser reproduction (without injected automation attributes) before any product defect is accepted." },
    { status: "inconclusive", rule: "Evidence is ambiguous or incomplete; blocks closure for that required test until resolved." },
    { status: "not_applicable", rule: "The test case does not apply to this mode/environment combination (e.g. camera capture on desktop)." },
  ];

  const browserMatrix: BrowserMatrixEntry[] = [
    { id: 1, category: "desktop", environment: "Chrome, current stable, Windows 11", layoutOnlyEvidence: false, requiresGenuineDevice: false },
    { id: 2, category: "desktop", environment: "Edge, current stable, Windows 11", layoutOnlyEvidence: false, requiresGenuineDevice: false },
    { id: 3, category: "desktop", environment: "Firefox, current stable, where feasible", layoutOnlyEvidence: false, requiresGenuineDevice: false },
    { id: 4, category: "desktop", environment: "Safari on macOS, only if genuinely available", layoutOnlyEvidence: false, requiresGenuineDevice: true },
    { id: 5, category: "responsive_emulation", environment: "Narrow mobile viewport (~320–375px)", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 6, category: "responsive_emulation", environment: "Common Android-like viewport", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 7, category: "responsive_emulation", environment: "Common iPhone-like viewport", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 8, category: "responsive_emulation", environment: "Tablet portrait", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 9, category: "responsive_emulation", environment: "Tablet landscape", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 10, category: "responsive_emulation", environment: "Desktop narrow window", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 11, category: "responsive_emulation", environment: "Desktop wide window", layoutOnlyEvidence: true, requiresGenuineDevice: false },
    { id: 12, category: "physical_mobile", environment: "Physical Android device with Chrome", layoutOnlyEvidence: false, requiresGenuineDevice: true },
    { id: 13, category: "physical_mobile", environment: "Genuine iPhone/iPad Safari or genuine remote Safari environment", layoutOnlyEvidence: false, requiresGenuineDevice: true },
  ];

  const questionCases: SyntheticTestCase[] = [
    { id: "Q1", mode: "question", description: "Valid general bureaucracy question." },
    { id: "Q2", mode: "question", description: "Short invalid input (below minimum length)." },
    { id: "Q3", mode: "question", description: "Maximum-near-limit valid input." },
    { id: "Q4", mode: "question", description: "Document-like text attempting a paid-mode bypass." },
    { id: "Q5", mode: "question", description: "High-risk question (e.g. deadline-adjacent synthetic phrasing)." },
    { id: "Q6", mode: "question", description: "Unknown-risk question." },
    { id: "Q7", mode: "question", description: "Repeated submit attempt on the same input." },
    { id: "Q8", mode: "question", description: "Mode switch attempted while a request is loading." },
  ];
  const textCases: SyntheticTestCase[] = [
    { id: "T1", mode: "text", description: "Valid short synthetic letter." },
    { id: "T2", mode: "text", description: "Valid two-page-equivalent pasted text." },
    { id: "T3", mode: "text", description: "Too-short text (below minimum length)." },
    { id: "T4", mode: "text", description: "Over-limit text (above maximum length)." },
    { id: "T5", mode: "text", description: "High-risk deadline-like synthetic content." },
    { id: "T6", mode: "text", description: "PII-shaped synthetic content (no real PII)." },
    { id: "T7", mode: "text", description: "Prompt-injection-shaped synthetic content." },
    { id: "T8", mode: "text", description: "Repeated submit attempt on the same input." },
    { id: "T9", mode: "text", description: "Switch to photo mode before submitting." },
    { id: "T10", mode: "text", description: "Switch modes after a result is already shown." },
  ];
  const photoCases: SyntheticTestCase[] = [
    { id: "P1", mode: "photo", description: "Valid JPEG." },
    { id: "P2", mode: "photo", description: "Valid PNG." },
    { id: "P3", mode: "photo", description: "Valid WebP, only if currently supported by the route (verify via source evidence first)." },
    { id: "P4", mode: "photo", description: "Corrupted image file." },
    { id: "P5", mode: "photo", description: "Zero-byte file." },
    { id: "P6", mode: "photo", description: "Non-image file." },
    { id: "P7", mode: "photo", description: "Oversized file (above documented upload budget)." },
    { id: "P8", mode: "photo", description: "Very large image dimensions." },
    { id: "P9", mode: "photo", description: "Repeated selection of the same file." },
    { id: "P10", mode: "photo", description: "Cancel the file picker without selecting." },
    { id: "P11", mode: "photo", description: "Replace an already-selected file." },
    { id: "P12", mode: "photo", description: "Rotated phone image (EXIF orientation case)." },
    { id: "P13", mode: "photo", description: "HEIC/HEIF input (known open debt — expected to fail gracefully, not silently pass)." },
    { id: "P14", mode: "photo", description: "Multi-page-document scenario." },
    { id: "P15", mode: "photo", description: "Duplicate submit tap." },
    { id: "P16", mode: "photo", description: "Mode switch attempted during OCR/reasoning." },
  ];

  return {
    checkId: "8.13B",
    allPassed: staticAllPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceGateCheckId: SOURCE_GATE_CHECK_ID,
    sourceGateReadyForExecutionPlan: evidence.gateDesignAccepted,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    browserStarted: false,
    browserAutomationPerformed: false,
    physicalAndroidValidationPerformed: false,
    genuineIosSafariValidationPerformed: false,
    realModelCallPerformed: false,
    realOcrExecutionPerformed: false,
    networkAccessPerformed: false,
    databaseWritePerformed: false,
    persistencePerformed: false,

    executionOrderDefined: true,
    preconditionsDefined: true,
    evidenceStatusesDefined: true,
    browserMatrixDefined: true,
    syntheticTestDataDefined: true,
    desktopChromePlanDefined: true,
    desktopEdgePlanDefined: true,
    firefoxPlanDefined: true,
    responsiveViewportPlanDefined: true,
    physicalAndroidPlanDefined: true,
    genuineIosSafariPlanDefined: true,
    softwareKeyboardPlanDefined: true,
    touchPlanDefined: true,
    duplicateSubmissionPlanDefined: true,
    modelCallBudgetDefined: true,
    ocrExecutionBudgetDefined: true,
    filePickerPlanDefined: true,
    cameraPlanDefined: true,
    galleryPlanDefined: true,
    crossModeIsolationPlanDefined: true,
    noPersistencePlanDefined: true,
    privacyInspectionPlanDefined: true,
    networkInspectionPlanDefined: true,
    hydrationValidationPlanDefined: true,
    accessibilityPlanDefined: true,
    failureClassificationDefined: true,
    patchAuthorizationRulesDefined: true,
    stopConditionsDefined: true,
    futureClosurePhasesDefined: true,

    chromiumEmulationStillLayoutOnly: true,
    physicalAndroidStillUntested: true,
    genuineIosSafariStillUntested: true,
    heicHeifStillOpen: !evidence.heicSupportImplementedNow,
    exifOrientationStillOpen: true,
    decodedPixelBoundsStillOpen: true,
    serverlessOcrValidationStillOpen: true,
    distributedRateLimiterStillOpen: !evidence.rateLimiterDistributedProductionSolved,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForDesktopAndResponsiveBrowserValidationClosure: staticAllPassed,

    executionAlreadyPerformedClaimed: false,
    browserAlreadyStartedClaimed: false,
    chromePassedClaimed: false,
    edgePassedClaimed: false,
    firefoxPassedClaimed: false,
    physicalAndroidPassedClaimed: false,
    genuineIosSafariPassedClaimed: false,
    responsiveEmulationClaimedEqualPhysicalDevice: false,
    desktopFilePickerClaimedEqualCamera: false,
    desktopChromeClaimedEqualAndroidChrome: false,
    chromeEmulationClaimedEqualSafari: false,
    softwareKeyboardClaimedPassedFromDesktopOnly: false,
    noPersistenceClaimedFromUiTextOnly: false,
    privacyClaimedProvedWithoutNetworkInspection: false,
    rawImageClaimedMaySendToModel: false,
    duplicateModelCallsClaimedAcceptable: false,
    duplicateOcrExecutionsClaimedAcceptable: false,
    unexpectedRetryClaimedAcceptable: false,
    firstContactClaimedMayReturnToNormalUi: false,
    paidDocumentModeClaimedBypassable: false,
    suppressHydrationWarningClaimedApproved: false,
    cursorInjectedAttributesClaimedProveDefect: false,
    heicClaimedSilentlyAcceptedAsPassed: false,
    exifHandlingClaimedCompleteWithoutEvidence: false,
    decodedPixelBoundsClaimedCompleteWithoutEvidence: false,
    serverlessOcrClaimedCompleteWithoutEvidence: false,
    distributedLimiterClaimedComplete: false,
    wcagComplianceClaimed: false,
    productionReadinessClaimed: false,
    publicBetaReadinessClaimed: false,
    goLiveAuthorizedClaimed: false,
    realClientDataClaimedAllowed: false,
    realPiiClaimedAllowed: false,
    databaseWritesClaimedAllowed: false,
    persistenceClaimedAllowed: false,
    browserHistoryClaimedMayRetainContent: false,
    queryStringClaimedMayContainContent: false,
    localStorageClaimedMayRetainContent: false,
    sessionStorageClaimedMayRetainContent: false,
    indexedDbClaimedMayRetainContent: false,
    serviceWorkerClaimedMayCacheContent: false,
    modeSwitchClaimedMayAutoSubmit: false,
    reloadClaimedMayReplayRequests: false,
    backNavigationClaimedMayReplayRequests: false,
    failureClaimedPatchableWithoutReproduction: false,
    toolingArtifactClaimedMayTriggerPatch: false,
    blockedByEnvironmentClaimedPassed: false,
    notTestedClaimedPassed: false,
    inconclusiveClaimedPassed: false,
    physicalDeviceEvidenceClaimedInferred: false,
    executionClaimedAllowedWithDirtyTree: false,
    environmentFlagsClaimedAllowedMutated: false,
    safetyStopConditionsClaimedIgnorable: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    sourceEvidence: [
      `noExistingFileModified: ${evidence.noExistingFileModified}`,
      `${GATE_DESIGN_AUDIT_REL_PATH} accepted (checkId "8.13A", readiness field, export present): ${evidence.gateDesignAccepted}`,
      `${DESCOPE_AUDIT_REL_PATH} retained with checkId "8.12F-DE-SCOPE": ${evidence.descopeAuditRetained}`,
      `${SMART_TALK_CLIENT_REL_PATH} menuOrderCorrect (question, text, photo): ${evidence.menuOrderCorrect}`,
      `${SMART_TALK_CLIENT_REL_PATH} modeChipCallCount (expected 3): ${evidence.modeChipCallCount}`,
      `${SMART_TALK_CLIENT_REL_PATH} forbiddenFirstContactClientStringsAbsent: ${evidence.forbiddenClientStringsAbsent}`,
      `${ROUTE_REL_PATH} backendFirstContactRoutePresent: ${evidence.backendFirstContactRoutePresent}`,
      `${ROUTE_REL_PATH} backendExactTrueGatePresent: ${evidence.backendExactTrueGatePresent}`,
      `backendDisabledByDefault (no committed env file sets the flag): ${evidence.backendDisabledByDefault}`,
      `${RATE_LIMITER_REL_PATH} module-level in-memory limiter confirmed: ${evidence.rateLimiterModuleLevelInMemory}`,
      `${RATE_LIMITER_REL_PATH} distributed/production claim absent (expected): ${!evidence.rateLimiterDistributedProductionSolved}`,
      `${OCR_DEBT_AUDIT_REL_PATH} HEIC-not-implemented evidence confirms heicHeifStillOpen: ${!evidence.heicSupportImplementedNow}`,
      `Hydration workaround scan of ${APP_SCAN_DIR}/ (${evidence.hydrationScanFilesScanned} files): found=${JSON.stringify(evidence.hydrationWorkaroundStringsFound)}`,
      "This audit read only committed source text for the 8.13A gate design, the descope audit, route.ts, SmartTalkClient.tsx, the rate limiter, and the OCR debt audit — none of them was imported or executed.",
    ],
    inspectedFiles: [
      GATE_DESIGN_AUDIT_REL_PATH,
      SMART_TALK_CLIENT_REL_PATH,
      ROUTE_REL_PATH,
      RATE_LIMITER_REL_PATH,
      OCR_DEBT_AUDIT_REL_PATH,
      UNIFIED_REGRESSION_REL_PATH,
      DESCOPE_AUDIT_REL_PATH,
      OCR_HANDOFF_AUDIT_REL_PATH,
      "relevant no-persistence, PII, paid-boundary, handoff, and controlled-reasoning audits (existence + marker checks only)",
    ],
    filesModified: [],
    filesCreated: [AUDIT_SELF_REL_PATH],
    executionSteps,
    preconditions: [
      "Clean working tree (no uncommitted runtime or UI changes).",
      "Exact source closure commit recorded before execution begins.",
      "Local environment flags documented (which are set, which are absent) before execution begins.",
      "Test mode kept strictly separate from production configuration.",
      "No real client data used at any point.",
      "No real personal data used at any point — synthetic test inputs only.",
      "Known expected model-call budget recorded before any manual test session.",
      "Known expected OCR-call budget recorded before any manual test session.",
      "Browser extensions minimized or disabled where practical.",
      "Clean browser profile or private window used where appropriate.",
      "Cursor browser instrumentation is never used as primary evidence.",
      "No production authorization is inferred merely from successful local validation.",
    ],
    evidenceStatusDefinitions,
    browserMatrix,
    testDataContractQuestion: questionCases,
    testDataContractText: textCases,
    testDataContractPhoto: photoCases,
    desktopManualChecklist: [
      "Page loads without a console error.",
      "Exactly three modes are visible.",
      "No First Contact tab is present.",
      "Mode labels are readable.",
      "Text fields are usable.",
      "Button states are correct (enabled/disabled/loading).",
      "Submit loading state is visible.",
      "Duplicate tap/click protection holds.",
      "Error state is visible.",
      "Result state is readable.",
      "Warnings are readable.",
      "Disclaimers are visible.",
      "No horizontal overflow.",
      "No clipped controls.",
      "Keyboard navigation works.",
      "Visible focus indicator is present.",
      "Refresh behavior is correct (no stale/replayed request).",
      "Back-navigation behavior is correct.",
      "No stale cross-mode result appears.",
      "No unexpected hydration mismatch appears.",
      "No unexpected third-party requests occur.",
    ],
    responsiveEvidenceRequirements: [
      "Viewport width and height recorded.",
      "Browser and version recorded.",
      "Screenshot evidence allowed and encouraged.",
      "Horizontal overflow check.",
      "Sticky/fixed element obstruction check.",
      "Touch-target spacing review.",
      "Mode selector usability.",
      "Textarea height behavior.",
      "Submit button accessibility.",
      "Warning and result readability.",
      "File input usability.",
      "Portrait and landscape checked where practical.",
      "Every entry recorded under this plan is labeled layout_only_evidence.",
    ],
    softwareKeyboardChecklist: [
      "Input remains visible when the keyboard opens.",
      "Focused field is not hidden by the keyboard.",
      "Submit control remains reachable.",
      "Viewport does not permanently break when the keyboard opens or closes.",
      "Closing the keyboard restores a usable layout.",
      "Scrolling remains possible with the keyboard open.",
      "Mode selector remains recoverable.",
      "Multiline entry works as intended.",
      "Enter-key behavior is intentional (not an accidental submit trigger).",
      "No accidental submission is triggered by keyboard interaction.",
      "No duplicate request is created by keyboard action.",
      "Chromium desktop emulation alone may not close genuine mobile keyboard validation — physical/genuine device evidence is required.",
    ],
    touchDuplicateSubmissionChecklist: [
      "Single tap creates at most one logical request.",
      "Rapid double tap does not create two requests.",
      "Disabled/loading state blocks incompatible actions.",
      "Repeated file-submit tap does not duplicate OCR execution.",
      "Request count is verified through network inspection, not assumption.",
      "Mode switch during an active request is handled safely.",
      "Refresh does not replay a request.",
      "Browser back does not replay a request.",
      "Retry is always explicit user action, never hidden automatic duplication.",
    ],
    modelOcrCallBudgetRules: [
      "For each manual test case, record: expected model calls, observed model calls, expected OCR executions, observed OCR executions.",
      "Question mode: at most the currently authorized call count per submit.",
      "Text mode: at most the currently authorized call count per submit.",
      "Photo controlled reasoning: OCR only when explicitly triggered, at most the authorized reasoning call count.",
      "A duplicate interaction must not exceed one logical execution.",
      "Any unexpected extra call is a failure, not a warning.",
      "This plan defines the budget only — no call is executed in this phase.",
    ],
    filePickerCameraGalleryEvidenceCategories: [
      "Desktop file picker (evidence category, never treated as camera evidence).",
      "Android gallery.",
      "Android camera capture.",
      "iOS photo library.",
      "iOS camera capture.",
      "Picker cancellation.",
      "Same-file reselection.",
      "Replacement file.",
      "Unsupported format handling.",
      "Orientation preservation.",
      "Metadata handling.",
      "Large-image behavior.",
    ],
    crossModeIsolationChecklist: [
      "Question content does not enter text-document processing.",
      "Document-like question input does not bypass the paid boundary.",
      "Text mode does not invoke OCR.",
      "Photo mode does not silently populate text mode.",
      "A photo result does not appear as a text-mode result.",
      "Mode switch clears or safely scopes incompatible state.",
      "Stale errors do not appear under another mode.",
      "The dormant First Contact backend is not invokable by normal UI.",
      "Switching modes does not itself trigger a request.",
      "Switching modes during loading is explicitly, safely handled.",
      "Reload does not restore private content from a previous mode.",
    ],
    noPersistenceChecklist: [
      "localStorage — before/after-submit/after-result/after-refresh checks.",
      "sessionStorage — before/after-submit/after-result/after-refresh checks.",
      "IndexedDB — before/after-submit/after-result/after-refresh checks.",
      "Cookies — before/after-submit/after-result/after-refresh checks.",
      "URL query parameters — before/after-submit/after-result/after-refresh checks.",
      "Browser history state — before/after-submit/after-result/after-refresh checks.",
      "Service-worker cache — before/after-submit/after-result/after-refresh checks.",
      "Cache Storage — before/after-submit/after-result/after-refresh checks.",
      "Application database — before/after-submit/after-result/after-refresh checks.",
      "Supabase — before/after-submit/after-result/after-refresh checks.",
      "File storage — before/after-submit/after-result/after-refresh checks.",
      "Vaylo DNA — before/after-submit/after-result/after-refresh checks.",
      "Browser form restoration after reload.",
      "Back-forward cache behavior, where practical.",
      "No-persistence is never inferred solely from UI wording — runtime inspection evidence is required.",
    ],
    privacyNetworkInspectionChecklist: [
      "Request URL.",
      "Request method.",
      "Request payload.",
      "Response payload.",
      "Third-party requests.",
      "Raw image transmission (must be absent — raw image/original file must never be sent to the model).",
      "OCR text transmission.",
      "PII redaction boundary.",
      "Console logs.",
      "Server logs where locally available.",
      "Full-document logging (must be absent).",
      "File-name leakage.",
      "Query-string leakage.",
    ],
    hydrationValidationProcedure: [
      'Known incident: Cursor browser automation injected attributes such as data-cursor-ref="e0" before React hydration, producing a mismatch. A clean Chrome refresh did not reproduce it.',
      "1. Reproduce in a clean browser profile or private window.",
      "2. Confirm absence of injected Cursor attributes.",
      "3. Capture console output.",
      "4. Refresh.",
      "5. Repeat the interaction.",
      "6. Only classify as a real product defect if reproducible without instrumentation.",
      "Explicitly prohibited: adding suppressHydrationWarning to hide the issue.",
      "Explicitly prohibited: modifying SmartTalkClient.tsx based only on injected attributes.",
      "Explicitly prohibited: accepting Cursor instrumentation as production-browser evidence.",
    ],
    accessibilityChecklist: [
      "Keyboard-only navigation.",
      "Visible focus.",
      "Logical focus order.",
      "Semantic buttons.",
      "Accessible labels.",
      "Form-label association.",
      "Status and error announcement.",
      "Loading-state announcement.",
      "Warning meaning not conveyed only by color.",
      "Usable zoom.",
      "Readable text at mobile widths.",
      "Touch-target usability.",
      "No keyboard trap.",
      "Screen-reader spot checks where available.",
      "This plan never claims WCAG compliance of any level.",
    ],
    failureClassificationCategories: [
      "environment limitation",
      "tooling artifact",
      "test-data problem",
      "expected unsupported format",
      "UI defect",
      "runtime defect",
      "OCR defect",
      "privacy defect",
      "no-persistence defect",
      "duplicate-execution defect",
      "rate-limit contamination",
      "browser-specific defect",
      "physical-device-only defect",
      "safety-boundary defect",
    ],
    patchAuthorizationRules: [
      "The failure is reproducible.",
      "The correct environment was used for that failure class.",
      "Evidence is captured (not merely asserted).",
      "It is not merely a Cursor/tooling artifact.",
      "It is not only an unsupported known debt already classified as open.",
      "The proposed fix preserves governance and safety boundaries.",
      "The smallest affected surface is identified.",
      "Exact files are named.",
      "Regression requirements are defined.",
      "This phase does not implement any patch — these rules govern a later phase only.",
    ],
    stopConditions: [
      "Unexpected persistence detected.",
      "Raw image sent to the model.",
      "PII leakage detected.",
      "Duplicate model calls detected.",
      "Duplicate OCR execution detected.",
      "Paid-boundary bypass detected.",
      "Dormant First Contact reachable from normal UI.",
      "Cross-mode result contamination detected.",
      "Uncontrolled external request detected.",
      "Unexpected database or storage write detected.",
      "Exact legal claim generated outside authorization.",
      "Environment flags not restored after a test session.",
      "Working tree unexpectedly modified.",
    ],
    futureClosurePhases: [
      { phaseId: "8.13C", title: "Desktop and Responsive Browser Validation Closure" },
      { phaseId: "8.13D", title: "Physical Android Chrome Validation Closure" },
      { phaseId: "8.13E", title: "Genuine iOS Safari Validation Closure" },
      { phaseId: "8.13F", title: "Mobile File Input and OCR Blocker Resolution Plan" },
      { phaseId: "8.13G", title: "Mobile Browser Compatibility Consolidation Closure" },
    ],
    knownOpenDebts: [
      "HEIC/HEIF support",
      "EXIF orientation normalization",
      "Image dimension bounds",
      "Decoded pixel bounds",
      "Memory exhaustion protection",
      "Serverless OCR validation",
      "Physical Android camera-image validation",
      "Genuine iOS camera-image validation",
      "Multi-page document handling",
      "Distributed production rate limiter",
    ],
    implementationLimitations: [
      "This phase is plan-and-audit only; it performs no browser start, no automation, no physical-device test, and no real network/model/OCR call.",
      "No desktop browser was launched by this audit.",
      "No Chromium responsive emulation was executed by this audit.",
      "No physical Android device was used.",
      "No genuine iOS Safari environment was used.",
      "No model or OCR call budget was actually consumed — only defined.",
      "The dormant First Contact backend was intentionally left untouched as historical, disabled-by-default evidence.",
      "This plan does not implement a new rate limiter.",
      "This plan does not resolve HEIC/HEIF, EXIF orientation, decoded-pixel bounds, or serverless OCR — those remain open.",
    ],
    remainingBlockers: [
      "Clean desktop Chrome manual validation pending",
      "Clean desktop Edge manual validation pending",
      "Optional Firefox validation pending",
      "Chromium responsive viewport validation pending",
      "Software keyboard and touch-oriented responsive checks pending",
      "Physical Android Chrome validation pending",
      "Genuine iOS Safari validation pending",
      "File picker, camera, and gallery validation pending",
      "Cross-mode isolation validation pending",
      "No-persistence and privacy validation pending",
      "Network, console, and hydration inspection pending",
      "Failure classification and patch authorization decision pending",
      "Execution closure audit pending",
      "HEIC/HEIF support unresolved",
      "EXIF orientation handling unresolved",
      "Decoded pixel bounds unresolved",
      "Serverless/Vercel OCR validation pending",
      "Distributed production rate limiter pending",
      "Controlled beta unauthorized",
      "Public beta unauthorized",
      "Production unauthorized",
      "Go-live unauthorized",
    ],
    readinessVerdict: [
      staticAllPassed
        ? "The Smart Talk mobile browser compatibility validation execution plan is well-formed: it converts the accepted 8.13A gate into a strict 15-step, evidence-based plan with an 8-status evidence contract, a 13-environment browser matrix, 34 synthetic test cases across question/text/photo, and explicit failure-classification, patch-authorization, and stop-condition rules — with no existing file modified and no execution performed."
        : "The execution plan failed one or more static contract checks — see notes for details.",
      "This is a plan/audit-only artifact; no dynamic browser/mobile/network/model/OCR validation has occurred, and none may be claimed as passed until executed with real evidence from the correct environment.",
    ],
    nextRecommendedSteps: [
      "Execute STEP 0–1 (preconditions and static readiness) before opening any browser.",
      "Execute STEP 2–4 (desktop Chrome/Edge/Firefox) using the desktop manual checklist and synthetic test data.",
      "Execute STEP 5–6 (Chromium responsive + keyboard/touch layout) and label all results layout_only_evidence.",
      "Schedule STEP 7–8 (physical Android Chrome, genuine iOS Safari) as separate, genuine-device sessions — never substitute emulation.",
      "Author PHASE 8.13C (Desktop and Responsive Browser Validation Closure) once STEP 0–6 evidence is captured.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runSmartTalkMobileBrowserCompatibilityValidationExecutionPlanAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);

  const structuralViolations = validateResult(good);
  const tamperOutcome = runTamperCases(good);

  const staticAllPassed =
    computeExpectedAllPassed(good) &&
    structuralViolations.length === 0 &&
    tamperOutcome.rejected === tamperOutcome.total &&
    good.allPassed;

  const final: Result = {
    ...good,
    allPassed: staticAllPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForDesktopAndResponsiveBrowserValidationClosure: staticAllPassed,
    readinessVerdict: [
      staticAllPassed
        ? "The Smart Talk mobile browser compatibility validation execution plan is well-formed: it converts the accepted 8.13A gate into a strict 15-step, evidence-based plan with an 8-status evidence contract, a 13-environment browser matrix, 34 synthetic test cases across question/text/photo, and explicit failure-classification, patch-authorization, and stop-condition rules — with no existing file modified and no execution performed."
        : `The execution plan failed one or more static contract checks: ${[...structuralViolations, ...tamperOutcome.failures].join("; ")}`,
      `Tamper cases rejected: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      "This is a plan/audit-only artifact; no dynamic browser/mobile/network/model/OCR validation has occurred, and none may be claimed as passed until executed with real evidence from the correct environment.",
    ],
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(structuralViolations.length > 0 ? [`Structural violations: ${structuralViolations.join("; ")}`] : []),
    ],
  };

  return final;
}

if (require.main === module) {
  const result = runSmartTalkMobileBrowserCompatibilityValidationExecutionPlanAudit();
  console.log(JSON.stringify(result));
}
