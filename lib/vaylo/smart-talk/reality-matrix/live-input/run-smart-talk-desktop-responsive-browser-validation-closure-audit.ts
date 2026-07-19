/**
 * PHASE 8.13C — Smart Talk Desktop and Responsive Browser Validation
 * Closure Audit (Static, Deterministic, Manual-Evidence-Provenance)
 *
 * This audit closes the manually executed desktop/responsive browser
 * validation of the final three-mode Smart Talk UI. The actual browser
 * testing (Chrome, Edge, Chromium responsive device-toolbar emulation)
 * was performed manually by the tester on Windows 11 — NOT by this
 * runner, and NOT by Cursor MCP/CDP browser automation, which had
 * previously frozen and had already caused a tooling-only hydration
 * artifact (`data-cursor-ref="e0"`) in an earlier phase.
 *
 * This file performs NO dynamic execution: no browser start, no MCP, no
 * CDP, no script injection, no model call, no OCR, no network access, no
 * database access, no persistence, no environment mutation. It only:
 *
 *   1. Reads `app/smart-talk/SmartTalkClient.tsx`, `app/api/smart-talk/route.ts`,
 *      the 8.13A gate-design audit, the 8.13B execution-plan audit, and
 *      the 8.13C-BLOCKER cross-mode isolation patch audit as plain text
 *      via `fs.readFileSync`, and checks fixed string/regex markers —
 *      never imports or executes any of them.
 *   2. Runs read-only `git` commands (`git status --short`,
 *      `git diff --name-only`) to confirm this phase modified no existing
 *      file and the working tree is otherwise clean.
 *   3. Encodes the tester's manually captured evidence (Chrome/Edge
 *      DevTools Console/Network/Application observations, responsive
 *      device-toolbar screenshots, refresh-based no-persistence checks,
 *      and the cross-mode blocker reproduction/retry) as immutable,
 *      clearly labeled records. These records are NOT independently
 *      re-verified by this runner — they are provenance-tagged manual
 *      evidence, exactly as instructed. Screenshots are never claimed to
 *      be machine-verified by this file.
 *   4. Resolves the installed Chrome/Edge version strings via local,
 *      read-only Windows file-version inspection only (no browser launch,
 *      no download, no update).
 *   5. Runs 80 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source commit / check-id constants ────────────────────────────────────
const SOURCE_CLOSURE_COMMIT = "3ee366a";
const SOURCE_PLAN_COMMIT = "46de625";
const SOURCE_PLAN_CHECK_ID = "8.13B";
const SOURCE_BLOCKER_COMMIT = "3ee366a";
const SOURCE_BLOCKER_CHECK_ID = "8.13C-BLOCKER";

const CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const RATE_LIMITER_REL_PATH = "lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts";
const OCR_DEBT_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-runtime-technical-debt-hardening-audit.ts";
const GATE_DESIGN_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-mobile-browser-compatibility-validation-gate-design-audit.ts";
const EXECUTION_PLAN_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-mobile-browser-compatibility-validation-execution-plan-audit.ts";
const BLOCKER_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-cross-mode-input-state-isolation-patch-audit.ts";
const DESCOPE_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-standalone-mode-descope-audit.ts";

const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";

const FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS: readonly string[] = [
  '"first_contact"',
  "first_contact_controlled_runtime",
  "onFirstContactSubmit",
  "Prvý kontakt",
];

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
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function includesNone(haystack: string, needles: readonly string[]): { ok: boolean; found: string[] } {
  const found = needles.filter((n) => haystack.includes(n));
  return { ok: found.length === 0, found };
}

/** Local, read-only Windows executable file-version lookup. Never launches a browser. */
function resolveExecutableVersion(candidatePaths: readonly string[]): { version: string; resolved: boolean } {
  for (const p of candidatePaths) {
    try {
      const out = execSync(
        `powershell -NoProfile -Command "(Get-Item -LiteralPath '${p}' -ErrorAction Stop).VersionInfo.ProductVersion"`,
        { encoding: "utf8" },
      ).trim();
      if (out) return { version: out, resolved: true };
    } catch {
      continue;
    }
  }
  return {
    version: "current installed stable version; exact executable version not resolved by audit",
    resolved: false,
  };
}

// ─── Manual-evidence provenance / test-case record types ───────────────────

type EvidenceProvenance = "manual_tester" | "static_source_inspection" | "read_only_git" | "read_only_file_metadata";

type ResponsiveEvidenceStatus = "responsive_layout_only";

interface ResponsiveViewportRecord {
  id: number;
  width: number;
  height: number;
  label: string;
  evidenceCategory: ResponsiveEvidenceStatus;
  horizontalOverflowObserved: boolean;
  criticalControlClipped: boolean;
  primaryInputUsable: boolean;
  primarySubmitReachable: boolean;
  warningDisclaimerReadable: boolean;
  verticalScrollAvailable: boolean;
  resultRegionReachable: boolean;
  criticalOverlapObserved: boolean;
  uploadControlClippingObserved: boolean;
  passed: boolean;
  notes: string[];
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.13C";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourcePlanCommit: string;
  sourcePlanCheckId: string;
  sourceBlockerCommit: string;
  sourceBlockerCheckId: string;

  sourceInspectionOnlyForAuditRunner: boolean;
  manualBrowserEvidenceAccepted: boolean;
  evidenceCapturedOutsideAuditRunner: boolean;
  browserAutomationUsedForAcceptedEvidence: boolean;
  cursorMcpUsedForAcceptedEvidence: boolean;
  cdpUsedForAcceptedEvidence: boolean;

  runtimeModified: boolean;
  uiModified: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  onlyExpectedFilesChanged: boolean;

  chromeValidationPerformed: boolean;
  chromeValidationPassed: boolean;
  chromeVersion: string;
  chromeVersionResolved: boolean;

  edgeValidationPerformed: boolean;
  edgeValidationPassed: boolean;
  edgeVersion: string;
  edgeVersionResolved: boolean;

  firefoxValidationPerformed: boolean;
  firefoxValidationStatus: "not_tested" | "passed" | "failed" | "blocked_by_environment";
  safariDesktopValidationPerformed: boolean;
  safariDesktopValidationStatus: "not_tested" | "passed" | "failed" | "blocked_by_environment";

  responsiveValidationPerformed: boolean;
  responsiveViewportCount: number;
  responsiveViewportsPassedCount: number;
  responsiveViewportsFailedCount: number;
  responsiveEvidenceLayoutOnly: boolean;
  actualResponsiveViewportDimensions: string[];

  physicalAndroidValidationPerformed: boolean;
  genuineIosSafariValidationPerformed: boolean;
  mobileCameraValidationPerformed: boolean;
  mobileSoftwareKeyboardValidationPerformed: boolean;

  questionModeValidated: boolean;
  textModeValidated: boolean;
  photoModeDesktopUiValidated: boolean;

  exactlyThreeVisibleModesConfirmed: boolean;
  standaloneFirstContactAbsent: boolean;
  dormantFirstContactStillUnreachable: boolean;

  crossModeBlockerOriginallyObserved: boolean;
  crossModeBlockerPatchCommitted: boolean;
  crossModeBlockerResolvedInCleanChrome: boolean;
  questionInputStateIsolated: boolean;
  textDocumentInputStateIsolated: boolean;
  crossModeIsolationAccepted: boolean;

  modeSwitchRequestObserved: boolean;
  duplicateSubmissionValidated: boolean;
  duplicatePostObserved: boolean;
  observedSmartTalkPostCount: number;
  nextRscGetCorrectlyExcludedFromDuplicateCount: boolean;

  noPersistenceInspected: boolean;
  noPersistenceAccepted: boolean;
  unsentQuestionRestoredAfterRefresh: boolean;
  unsentTextDocumentRestoredAfterRefresh: boolean;
  selectedFileRestoredAfterRefresh: boolean;
  localStorageContainsSmartTalkContent: boolean;
  sessionStorageContainsSmartTalkContent: boolean;
  indexedDbContainsSmartTalkContent: boolean;
  cookiesContainSmartTalkContent: boolean;
  sharedStorageContainsSmartTalkContent: boolean;
  serviceWorkerRegisteredForLocalhost: boolean;

  privacyNetworkInspectionPerformed: boolean;
  urlQueryLeakageObserved: boolean;
  unexpectedSupabaseRequestObserved: boolean;
  unexpectedStorageRequestObserved: boolean;
  unexpectedThirdPartyRequestObserved: boolean;
  databaseWriteObserved: boolean;
  storageWriteObserved: boolean;
  rawImageSentToModel: boolean;

  consoleInspectionPerformed: boolean;
  cleanChromeHydrationMismatchObserved: boolean;
  cleanEdgeHydrationMismatchObserved: boolean;
  cursorInjectedHydrationArtifactRecognized: boolean;
  suppressHydrationWarningAdded: boolean;

  accessibilityVisualSpotChecksPerformed: boolean;
  keyboardOnlyValidationPerformed: boolean;
  screenReaderValidationPerformed: boolean;
  wcagComplianceClaimed: boolean;

  horizontalOverflowObserved: boolean;
  criticalControlClippingObserved: boolean;
  criticalControlOverlapObserved: boolean;

  heicHeifStillOpen: boolean;
  exifOrientationStillOpen: boolean;
  decodedPixelBoundsStillOpen: boolean;
  serverlessOcrValidationStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  distributedRateLimiterStillOpen: boolean;

  standaloneSmartTalkApplicationCompleted: boolean;
  stillHostedInsideDnaShell: boolean;
  standaloneExtractionStillRequired: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForStandaloneSmartTalkApplicationBoundaryGateDesign: boolean;

  // Supplementary provenance / governance flags with no 1:1 field above —
  // every one must remain at its safe default; tamper cases flip them.
  blockerRetryEvidenceCaptured: boolean;
  physicalPhotoProcessingClaimedFromQuestionRequest: boolean;
  rawImageEvidenceConfusedWithBrowserEvidence: boolean;
  screenshotsClaimedMachineVerified: boolean;
  versionStringFabricationAccepted: boolean;
  dirtyWorkingTreeAcceptedClaim: boolean;
  environmentMutationAcceptedClaim: boolean;
  paymentFlowClaimedComplete: boolean;
  v4LocalizationClaimedProductionReady: boolean;
  germanKnowledgeLayerClaimedComplete: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  chromeEvidence: string[];
  edgeEvidence: string[];
  crossModeBlockerHistory: string[];
  responsiveViewports: ResponsiveViewportRecord[];
  noPersistenceEvidence: string[];
  storageInspectionEvidence: string[];
  networkPrivacyEvidence: string[];
  hydrationEvidence: string[];
  accessibilityEvidence: string[];
  photoModeScope: { accepted: string[]; notPerformedOrNotClosed: string[] };
  knownOpenDebts: string[];
  standaloneDnaShellStatus: string[];
  evidenceProvenance: { category: string; source: EvidenceProvenance }[];
  sourceEvidence: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "source commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 2, description: "blocker commit omitted", mutate: (r) => { r.sourceBlockerCommit = ""; } },
  { id: 3, description: "original cross-mode defect hidden", mutate: (r) => { r.crossModeBlockerOriginallyObserved = false; } },
  { id: 4, description: "blocker claimed fixed without clean Chrome retry", mutate: (r) => { r.blockerRetryEvidenceCaptured = false; } },
  { id: 5, description: "shared question/text input accepted", mutate: (r) => { r.questionInputStateIsolated = false; } },
  { id: 6, description: "Chrome passed without manual evidence", mutate: (r) => { r.manualBrowserEvidenceAccepted = false; r.chromeValidationPassed = true; } },
  { id: 7, description: "Edge passed without manual evidence", mutate: (r) => { r.evidenceCapturedOutsideAuditRunner = false; r.edgeValidationPassed = true; } },
  { id: 8, description: "Firefox passed without testing", mutate: (r) => { r.firefoxValidationStatus = "passed"; } },
  { id: 9, description: "Safari passed without testing", mutate: (r) => { r.safariDesktopValidationStatus = "passed"; } },
  { id: 10, description: "responsive viewport treated as physical Android", mutate: (r) => { r.physicalAndroidValidationPerformed = true; } },
  { id: 11, description: "responsive viewport treated as genuine iOS", mutate: (r) => { r.genuineIosSafariValidationPerformed = true; } },
  { id: 12, description: "planned viewport dimensions substituted for actual dimensions", mutate: (r) => { r.actualResponsiveViewportDimensions = ["320x568", "360x800", "390x844", "412x915", "768x1024", "1024x768", "1280x720", "1440x900"]; } },
  { id: 13, description: "failed viewport omitted", mutate: (r) => { r.responsiveViewportsPassedCount = 8; r.responsiveViewports = r.responsiveViewports.slice(0, 7); } },
  { id: 14, description: "physical Android claimed passed", mutate: (r) => { r.physicalAndroidValidationPerformed = true; r.physicalAndroidStillUntested = false; } },
  { id: 15, description: "genuine iOS claimed passed", mutate: (r) => { r.genuineIosSafariValidationPerformed = true; r.genuineIosSafariStillUntested = false; } },
  { id: 16, description: "mobile camera claimed passed", mutate: (r) => { r.mobileCameraValidationPerformed = true; } },
  { id: 17, description: "mobile software keyboard claimed passed", mutate: (r) => { r.mobileSoftwareKeyboardValidationPerformed = true; } },
  { id: 18, description: "one RSC GET counted as duplicate POST", mutate: (r) => { r.nextRscGetCorrectlyExcludedFromDuplicateCount = false; r.duplicatePostObserved = true; } },
  { id: 19, description: "two POSTs accepted", mutate: (r) => { r.observedSmartTalkPostCount = 2; } },
  { id: 20, description: "duplicate POST accepted", mutate: (r) => { r.duplicatePostObserved = true; } },
  { id: 21, description: "mode-switch request accepted", mutate: (r) => { r.modeSwitchRequestObserved = true; } },
  { id: 22, description: "question content in URL accepted", mutate: (r) => { r.urlQueryLeakageObserved = true; } },
  { id: 23, description: "Local Storage content accepted", mutate: (r) => { r.localStorageContainsSmartTalkContent = true; } },
  { id: 24, description: "Session Storage content accepted", mutate: (r) => { r.sessionStorageContainsSmartTalkContent = true; } },
  { id: 25, description: "IndexedDB content accepted", mutate: (r) => { r.indexedDbContainsSmartTalkContent = true; } },
  { id: 26, description: "cookie document content accepted", mutate: (r) => { r.cookiesContainSmartTalkContent = true; } },
  { id: 27, description: "Shared Storage content accepted", mutate: (r) => { r.sharedStorageContainsSmartTalkContent = true; } },
  { id: 28, description: "Service Worker content cache accepted", mutate: (r) => { r.serviceWorkerRegisteredForLocalhost = true; } },
  { id: 29, description: "refresh restoration accepted", mutate: (r) => { r.unsentQuestionRestoredAfterRefresh = true; } },
  { id: 30, description: "file restoration after refresh accepted", mutate: (r) => { r.selectedFileRestoredAfterRefresh = true; } },
  { id: 31, description: "unexpected Supabase request accepted", mutate: (r) => { r.unexpectedSupabaseRequestObserved = true; } },
  { id: 32, description: "unexpected Storage request accepted", mutate: (r) => { r.unexpectedStorageRequestObserved = true; } },
  { id: 33, description: "unexpected third-party request accepted", mutate: (r) => { r.unexpectedThirdPartyRequestObserved = true; } },
  { id: 34, description: "database write accepted", mutate: (r) => { r.databaseWriteObserved = true; } },
  { id: 35, description: "Storage write accepted", mutate: (r) => { r.storageWriteObserved = true; } },
  { id: 36, description: "clean Chrome hydration mismatch ignored", mutate: (r) => { r.cleanChromeHydrationMismatchObserved = true; } },
  { id: 37, description: "clean Edge hydration mismatch ignored", mutate: (r) => { r.cleanEdgeHydrationMismatchObserved = true; } },
  { id: 38, description: "Cursor-injected attributes treated as product defect", mutate: (r) => { r.cursorInjectedHydrationArtifactRecognized = false; } },
  { id: 39, description: "suppressHydrationWarning accepted", mutate: (r) => { r.suppressHydrationWarningAdded = true; } },
  { id: 40, description: "horizontal overflow ignored", mutate: (r) => { r.horizontalOverflowObserved = true; } },
  { id: 41, description: "clipped mode control ignored", mutate: (r) => { r.criticalControlClippingObserved = true; } },
  { id: 42, description: "clipped submit ignored", mutate: (r) => { r.criticalControlClippingObserved = true; r.responsiveViewports = r.responsiveViewports.map((v) => ({ ...v, criticalControlClipped: true })); } },
  { id: 43, description: "critical overlap ignored", mutate: (r) => { r.criticalControlOverlapObserved = true; } },
  { id: 44, description: "First Contact returned to UI", mutate: (r) => { r.standaloneFirstContactAbsent = false; } },
  { id: 45, description: "dormant First Contact reachable", mutate: (r) => { r.dormantFirstContactStillUnreachable = false; } },
  { id: 46, description: "fewer than three modes accepted", mutate: (r) => { r.exactlyThreeVisibleModesConfirmed = false; } },
  { id: 47, description: "more than three modes accepted", mutate: (r) => { r.exactlyThreeVisibleModesConfirmed = false; r.standaloneFirstContactAbsent = false; } },
  { id: 48, description: "WCAG compliance claimed", mutate: (r) => { r.wcagComplianceClaimed = true; } },
  { id: 49, description: "keyboard validation claimed", mutate: (r) => { r.keyboardOnlyValidationPerformed = true; } },
  { id: 50, description: "screen-reader validation claimed", mutate: (r) => { r.screenReaderValidationPerformed = true; } },
  { id: 51, description: "HEIC marked complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 52, description: "EXIF marked complete", mutate: (r) => { r.exifOrientationStillOpen = false; } },
  { id: 53, description: "decoded pixel bounds marked complete", mutate: (r) => { r.decodedPixelBoundsStillOpen = false; } },
  { id: 54, description: "serverless OCR marked complete", mutate: (r) => { r.serverlessOcrValidationStillOpen = false; } },
  { id: 55, description: "distributed limiter marked complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 56, description: "standalone app marked complete", mutate: (r) => { r.standaloneSmartTalkApplicationCompleted = true; } },
  { id: 57, description: "DNA shell falsely marked removed", mutate: (r) => { r.stillHostedInsideDnaShell = false; } },
  { id: 58, description: "physical photo processing claimed from question request", mutate: (r) => { r.physicalPhotoProcessingClaimedFromQuestionRequest = true; } },
  { id: 59, description: "raw image source evidence confused with new browser evidence", mutate: (r) => { r.rawImageEvidenceConfusedWithBrowserEvidence = true; } },
  { id: 60, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 61, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 62, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 63, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 64, description: "browser automation claimed as accepted evidence", mutate: (r) => { r.browserAutomationUsedForAcceptedEvidence = true; } },
  { id: 65, description: "Cursor MCP claimed as accepted evidence", mutate: (r) => { r.cursorMcpUsedForAcceptedEvidence = true; } },
  { id: 66, description: "CDP claimed as accepted evidence", mutate: (r) => { r.cdpUsedForAcceptedEvidence = true; } },
  { id: 67, description: "screenshots claimed machine-verified", mutate: (r) => { r.screenshotsClaimedMachineVerified = true; } },
  { id: 68, description: "unresolved version string fabricated", mutate: (r) => { r.versionStringFabricationAccepted = true; } },
  { id: 69, description: "audit passes with unexpected modified file", mutate: (r) => { r.onlyExpectedFilesChanged = false; } },
  { id: 70, description: "audit passes if allPassed prerequisites fail", mutate: (r) => { r.chromeValidationPassed = false; } },
  { id: 71, description: "dirty working tree accepted", mutate: (r) => { r.dirtyWorkingTreeAcceptedClaim = true; } },
  { id: 72, description: "existing runtime modification accepted", mutate: (r) => { r.runtimeModified = true; r.existingFileModified = true; } },
  { id: 73, description: "environment mutation accepted", mutate: (r) => { r.environmentMutationAcceptedClaim = true; } },
  { id: 74, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowClaimedComplete = true; } },
  { id: 75, description: "V4 languages claimed production-ready", mutate: (r) => { r.v4LocalizationClaimedProductionReady = true; } },
  { id: 76, description: "German knowledge layer claimed complete", mutate: (r) => { r.germanKnowledgeLayerClaimedComplete = true; } },
  { id: 77, description: "standalone extraction requirement removed", mutate: (r) => { r.standaloneExtractionStillRequired = false; } },
  { id: 78, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "8.13C-BLOCKER"; } },
  { id: 79, description: "sourcePlanCheckId mismatch", mutate: (r) => { r.sourcePlanCheckId = "8.13A"; } },
  { id: 80, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const ok = computeExpectedAllPassed(mutated);
    if (ok === false) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "8.13C",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourcePlanCommit === SOURCE_PLAN_COMMIT,
    r.sourcePlanCheckId === SOURCE_PLAN_CHECK_ID,
    r.sourceBlockerCommit === SOURCE_BLOCKER_COMMIT,
    r.sourceBlockerCheckId === SOURCE_BLOCKER_CHECK_ID,

    r.sourceInspectionOnlyForAuditRunner === true,
    r.manualBrowserEvidenceAccepted === true,
    r.evidenceCapturedOutsideAuditRunner === true,
    r.browserAutomationUsedForAcceptedEvidence === false,
    r.cursorMcpUsedForAcceptedEvidence === false,
    r.cdpUsedForAcceptedEvidence === false,

    r.runtimeModified === false,
    r.uiModified === false,
    r.existingFileModified === false,
    r.newAuditFileCreated === true,
    r.onlyExpectedFilesChanged === true,

    r.chromeValidationPerformed === true,
    r.chromeValidationPassed === true,
    r.edgeValidationPerformed === true,
    r.edgeValidationPassed === true,
    r.firefoxValidationPerformed === false,
    r.firefoxValidationStatus === "not_tested",
    r.safariDesktopValidationPerformed === false,
    r.safariDesktopValidationStatus === "not_tested" || r.safariDesktopValidationStatus === "blocked_by_environment",

    r.responsiveValidationPerformed === true,
    r.responsiveViewportCount === 8,
    r.responsiveViewportsPassedCount === 8,
    r.responsiveViewportsFailedCount === 0,
    r.responsiveEvidenceLayoutOnly === true,
    r.actualResponsiveViewportDimensions.length === 8,
    JSON.stringify(r.actualResponsiveViewportDimensions) ===
      JSON.stringify(["320x582", "360x800", "390x844", "412x915", "768x857", "1024x768", "1280x720", "1440x900"]),
    r.responsiveViewports.length === 8,
    r.responsiveViewports.every((v) => v.passed === true && v.evidenceCategory === "responsive_layout_only"),
    r.responsiveViewports.every(
      (v) => !v.horizontalOverflowObserved && !v.criticalControlClipped && !v.criticalOverlapObserved && !v.uploadControlClippingObserved,
    ),

    r.physicalAndroidValidationPerformed === false,
    r.genuineIosSafariValidationPerformed === false,
    r.mobileCameraValidationPerformed === false,
    r.mobileSoftwareKeyboardValidationPerformed === false,

    r.questionModeValidated === true,
    r.textModeValidated === true,
    r.photoModeDesktopUiValidated === true,

    r.exactlyThreeVisibleModesConfirmed === true,
    r.standaloneFirstContactAbsent === true,
    r.dormantFirstContactStillUnreachable === true,

    r.crossModeBlockerOriginallyObserved === true,
    r.crossModeBlockerPatchCommitted === true,
    r.crossModeBlockerResolvedInCleanChrome === true,
    r.questionInputStateIsolated === true,
    r.textDocumentInputStateIsolated === true,
    r.crossModeIsolationAccepted === true,
    r.blockerRetryEvidenceCaptured === true,

    r.modeSwitchRequestObserved === false,
    r.duplicateSubmissionValidated === true,
    r.duplicatePostObserved === false,
    r.observedSmartTalkPostCount === 1,
    r.nextRscGetCorrectlyExcludedFromDuplicateCount === true,

    r.noPersistenceInspected === true,
    r.noPersistenceAccepted === true,
    r.unsentQuestionRestoredAfterRefresh === false,
    r.unsentTextDocumentRestoredAfterRefresh === false,
    r.selectedFileRestoredAfterRefresh === false,
    r.localStorageContainsSmartTalkContent === false,
    r.sessionStorageContainsSmartTalkContent === false,
    r.indexedDbContainsSmartTalkContent === false,
    r.cookiesContainSmartTalkContent === false,
    r.sharedStorageContainsSmartTalkContent === false,
    r.serviceWorkerRegisteredForLocalhost === false,

    r.privacyNetworkInspectionPerformed === true,
    r.urlQueryLeakageObserved === false,
    r.unexpectedSupabaseRequestObserved === false,
    r.unexpectedStorageRequestObserved === false,
    r.unexpectedThirdPartyRequestObserved === false,
    r.databaseWriteObserved === false,
    r.storageWriteObserved === false,
    r.rawImageSentToModel === false,

    r.consoleInspectionPerformed === true,
    r.cleanChromeHydrationMismatchObserved === false,
    r.cleanEdgeHydrationMismatchObserved === false,
    r.cursorInjectedHydrationArtifactRecognized === true,
    r.suppressHydrationWarningAdded === false,

    r.accessibilityVisualSpotChecksPerformed === true,
    r.keyboardOnlyValidationPerformed === false,
    r.screenReaderValidationPerformed === false,
    r.wcagComplianceClaimed === false,

    r.horizontalOverflowObserved === false,
    r.criticalControlClippingObserved === false,
    r.criticalControlOverlapObserved === false,

    r.heicHeifStillOpen === true,
    r.exifOrientationStillOpen === true,
    r.decodedPixelBoundsStillOpen === true,
    r.serverlessOcrValidationStillOpen === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.distributedRateLimiterStillOpen === true,

    r.standaloneSmartTalkApplicationCompleted === false,
    r.stillHostedInsideDnaShell === true,
    r.standaloneExtractionStillRequired === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.physicalPhotoProcessingClaimedFromQuestionRequest === false,
    r.rawImageEvidenceConfusedWithBrowserEvidence === false,
    r.screenshotsClaimedMachineVerified === false,
    r.versionStringFabricationAccepted === false,
    r.dirtyWorkingTreeAcceptedClaim === false,
    r.environmentMutationAcceptedClaim === false,
    r.paymentFlowClaimedComplete === false,
    r.v4LocalizationClaimedProductionReady === false,
    r.germanKnowledgeLayerClaimedComplete === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// ─── Evidence collection (static source inspection + read-only git/OS) ─────

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  planCheckIdConfirmed: boolean;
  blockerCheckIdConfirmed: boolean;
  descopeAuditRetained: boolean;
  gateDesignAccepted: boolean;
  exactlyThreeVisibleModesConfirmed: boolean;
  standaloneFirstContactAbsent: boolean;
  dormantFirstContactStillUnreachable: boolean;
  questionInputStateIsolated: boolean;
  textDocumentInputStateIsolated: boolean;
  heicSupportImplementedNow: boolean;
  rateLimiterDistributedProductionSolved: boolean;
  chromeVersion: string;
  chromeVersionResolved: boolean;
  edgeVersion: string;
  edgeVersionResolved: boolean;
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

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const newAuditFileCreated = untrackedNew.some((p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH));
  const unexpectedUntracked = untrackedNew.filter((p) => p !== AUDIT_SELF_REL_PATH && !p.endsWith(AUDIT_SELF_REL_PATH));

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const planSrc = readFileText(EXECUTION_PLAN_AUDIT_REL_PATH);
  const planCheckIdConfirmed =
    fileExists(EXECUTION_PLAN_AUDIT_REL_PATH) && planSrc.includes('checkId: "8.13B";') && planSrc.includes("export function run");

  const blockerSrc = readFileText(BLOCKER_AUDIT_REL_PATH);
  const blockerCheckIdConfirmed =
    fileExists(BLOCKER_AUDIT_REL_PATH) && blockerSrc.includes('checkId: "8.13C-BLOCKER";') && blockerSrc.includes("export function run");

  const descopeSrc = readFileText(DESCOPE_AUDIT_REL_PATH);
  const descopeAuditRetained = fileExists(DESCOPE_AUDIT_REL_PATH) && descopeSrc.includes('checkId: "8.12F-DE-SCOPE"');

  const gateSrc = readFileText(GATE_DESIGN_AUDIT_REL_PATH);
  const gateDesignAccepted =
    fileExists(GATE_DESIGN_AUDIT_REL_PATH) &&
    gateSrc.includes('checkId: "8.13A"') &&
    gateSrc.includes("readyForMobileBrowserCompatibilityExecutionPlan");

  const clientSrc = readFileText(CLIENT_REL_PATH);
  const requiredModeChipCalls = [
    'modeChip("question", "Opýtať sa")',
    'modeChip("text", "Vysvetliť text")',
    'modeChip("photo", "Odfotiť dokument")',
  ];
  const menuOrderCorrect = (() => {
    const positions = requiredModeChipCalls.map((c) => clientSrc.indexOf(c));
    if (positions.some((p) => p < 0)) return false;
    for (let i = 1; i < positions.length; i++) if (positions[i] <= positions[i - 1]) return false;
    return true;
  })();
  const modeChipCallCount = (clientSrc.match(/modeChip\(\s*"[a-z_]+"/g) ?? []).length;
  const { ok: forbiddenClientStringsAbsent } = includesNone(clientSrc, FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS);
  const exactlyThreeVisibleModesConfirmed = menuOrderCorrect && modeChipCallCount === 3;
  const standaloneFirstContactAbsent = forbiddenClientStringsAbsent;

  const questionInputStateIsolated =
    clientSrc.includes('const [questionInput, setQuestionInput] = useState("")') &&
    !/const \[text, setText\] = useState/.test(clientSrc);
  const textDocumentInputStateIsolated =
    clientSrc.includes('const [textDocumentInput, setTextDocumentInput] = useState("")') &&
    !/const \[text, setText\] = useState/.test(clientSrc);

  const routeSrc = readFileText(ROUTE_REL_PATH);
  const backendFirstContactRoutePresent =
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") && routeSrc.includes("o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE");
  const backendExactTrueGatePresent = routeSrc.includes('process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true"');
  const envFilesWithFlag = ["/.env", "/.env.local", "/.env.production"]
    .map((p) => readFileText(p.slice(1)))
    .some((s) => s.includes("SMART_TALK_FIRST_CONTACT_MODE_ENABLED"));
  const dormantFirstContactStillUnreachable =
    backendFirstContactRoutePresent && backendExactTrueGatePresent && !envFilesWithFlag && standaloneFirstContactAbsent;

  const rateLimiterSrc = readFileText(RATE_LIMITER_REL_PATH);
  const rateLimiterDistributedProductionSolved = /distributed[\s-]*production|production[\s-]*distributed/i.test(rateLimiterSrc);

  const ocrDebtSrc = readFileText(OCR_DEBT_AUDIT_REL_PATH);
  const heicSupportImplementedNow = !ocrDebtSrc.includes("heicSupportImplementedNow: false");

  const chromeVer = resolveExecutableVersion([
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ]);
  const edgeVer = resolveExecutableVersion([
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ]);

  return {
    onlyExpectedFilesChanged,
    existingFileModified,
    newAuditFileCreated,
    planCheckIdConfirmed,
    blockerCheckIdConfirmed,
    descopeAuditRetained,
    gateDesignAccepted,
    exactlyThreeVisibleModesConfirmed,
    standaloneFirstContactAbsent,
    dormantFirstContactStillUnreachable,
    questionInputStateIsolated,
    textDocumentInputStateIsolated,
    heicSupportImplementedNow,
    rateLimiterDistributedProductionSolved,
    chromeVersion: chromeVer.version,
    chromeVersionResolved: chromeVer.resolved,
    edgeVersion: edgeVer.version,
    edgeVersionResolved: edgeVer.resolved,
    notes,
  };
}

function fileExists(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

// ─── Manually captured evidence (immutable, provenance-tagged) ─────────────
// Everything below this line reflects the tester's manual observations,
// captured outside this audit runner in a clean browser profile on
// Windows 11. This runner does not and cannot independently re-verify
// screenshots or live browser state — it only records what was reported,
// clearly labeled as manual evidence, per the phase's explicit provenance
// requirements.

const CHROME_EVIDENCE: readonly string[] = [
  "Smart Talk loaded at http://localhost:3000/smart-talk",
  "Hard refresh completed without a hydration mismatch",
  "DevTools Console had no red application error",
  'Exactly three modes visible: "Opýtať sa", "Vysvetliť text", "Odfotiť dokument"',
  "Standalone First Contact was absent",
  "Mode switching itself did not submit a request",
  "Question and text-document inputs remained isolated after the 8.13C-BLOCKER patch",
  "Question input did not appear in text mode",
  "Text-document input did not appear in photo mode",
  "Both drafts remained separately scoped during the same in-memory session",
  "No cross-mode result contamination was observed",
  "One authorized synthetic question produced exactly one POST to http://localhost:3000/api/smart-talk",
  "Request method was POST",
  "Response status was 200",
  "No duplicate POST was observed",
  "A separate GET /smart-talk?_rsc=... was correctly classified as an internal Next.js React Server Components request, not a duplicate API submission",
  "Question text was not present in the URL or query string",
  "No unexpected Supabase or Storage request was observed",
  "No unexpected third-party request was observed",
];

const EDGE_EVIDENCE: readonly string[] = [
  "Hard refresh completed without a hydration mismatch",
  "No red Console error",
  "Exactly three modes visible",
  "First Contact absent",
  "Question input not transferred to text mode",
  "Text input not transferred to photo mode",
  "Both inputs remained isolated after returning to their modes",
  "No request was sent merely by switching modes",
];

const CROSS_MODE_BLOCKER_HISTORY: readonly string[] = [
  "An initial clean Chrome test during PHASE 8.13C discovered that question mode and text-document mode shared one React state.",
  "This caused question text to appear in the text-document mode textarea.",
  "PHASE 8.13C was stopped as soon as the defect was confirmed reproducible.",
  "PHASE 8.13C-BLOCKER isolated the state into two separate React states: questionInput and textDocumentInput.",
  "The fix was committed as 3ee366a.",
  "The exact reproduction test was repeated in clean Chrome after the fix.",
  "The question and document text remained isolated on retry.",
  "Console remained free of red errors on retry.",
  "The blocker is accepted as resolved for this closure, based on the clean-Chrome retry evidence above.",
];

const RESPONSIVE_VIEWPORTS: readonly ResponsiveViewportRecord[] = [
  {
    id: 1, width: 320, height: 582, label: "narrow mobile", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Mode controls safely wrapped to two rows.", "No critical control was clipped."],
  },
  {
    id: 2, width: 360, height: 800, label: "common Android-like", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: [
      "Question mode usable; text mode usable; photo mode usable.",
      '"Otvoriť kameru" visible.',
      '"Vybrať z galérie" visible.',
      "Internal OCR test controls did not cause visible horizontal overflow.",
    ],
  },
  {
    id: 3, width: 390, height: 844, label: "common iPhone-like", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Stable narrow layout.", "No visible critical overlap."],
  },
  {
    id: 4, width: 412, height: 915, label: "large Android-like", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Mode labels could wrap inside controls but remained readable and usable."],
  },
  {
    id: 5, width: 768, height: 857, label: "tablet portrait (actual captured height)", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Stable tablet-style centered card."],
  },
  {
    id: 6, width: 1024, height: 768, label: "tablet landscape / small desktop", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Sidebar and main content both visible, no overlap.", "Photo mode controls usable."],
  },
  {
    id: 7, width: 1280, height: 720, label: "desktop narrow window", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Stable desktop layout."],
  },
  {
    id: 8, width: 1440, height: 900, label: "desktop wide window", evidenceCategory: "responsive_layout_only",
    horizontalOverflowObserved: false, criticalControlClipped: false, primaryInputUsable: true,
    primarySubmitReachable: true, warningDisclaimerReadable: true, verticalScrollAvailable: true,
    resultRegionReachable: true, criticalOverlapObserved: false, uploadControlClippingObserved: false,
    passed: true,
    notes: ["Stable desktop layout.", "Sidebar and centered content did not overlap."],
  },
];

const NO_PERSISTENCE_EVIDENCE: readonly string[] = [
  "Unsent question text disappeared after refresh.",
  "Unsent text-document content disappeared after refresh.",
  "Selected photo/file disappeared after refresh.",
];

const STORAGE_INSPECTION_EVIDENCE: readonly string[] = [
  "Chrome DevTools Application inspection: Local Storage contained no Smart Talk user content.",
  "Chrome DevTools Application inspection: Session Storage contained no Smart Talk user content.",
  "Chrome DevTools Application inspection: IndexedDB had no detected application database.",
  "Chrome DevTools Application inspection: Cookies contained no Smart Talk user content.",
  "Chrome DevTools Application inspection: Shared Storage showed no events.",
  "Chrome DevTools Application inspection: no Service Worker was registered for localhost.",
  "No browser storage contained question text, document text, or OCR text.",
  "Nuance: a Supabase authentication-related cookie from the wider host application may exist because Smart Talk is still rendered inside the wider DNA application shell. The mere presence of a host authentication cookie is NOT classified as Smart Talk document-content persistence.",
  "Accepted invariant: no Smart Talk question/document/photo/OCR content was found in cookies; no Smart Talk content was written to application storage. Standalone extraction from the DNA shell remains a future phase.",
];

const NETWORK_PRIVACY_EVIDENCE: readonly string[] = [
  "Exactly one POST /api/smart-talk observed for one logical question submission.",
  "Status 200.",
  "No duplicate POST.",
  "The Next.js RSC GET is not a duplicate submission.",
  "No question content in URL/query string.",
  "No Supabase/Storage request triggered by the Smart Talk submission.",
  "No unexpected third-party request.",
  "No database write observed.",
  "No Storage write observed.",
  "No raw-image-to-model validation was executed in this specific question-mode network test; the raw-image-to-model prohibition remains supported by prior source/governance audits, not by this question-only browser request.",
];

const HYDRATION_EVIDENCE: readonly string[] = [
  "Clean Chrome hard refresh: no hydration mismatch.",
  "Clean Edge hard refresh: no hydration mismatch.",
  'Earlier Cursor browser tooling injected attributes such as data-cursor-ref="e0".',
  "That tooling-only mismatch was not reproducible in clean Chrome.",
  "No suppressHydrationWarning was added.",
  "No production UI patch was made for the Cursor artifact.",
];

const ACCESSIBILITY_EVIDENCE: readonly string[] = [
  "Controls remained reachable in tested layouts.",
  "Labels remained readable.",
  "Warnings were visible.",
  "Vertical scrolling worked.",
  "Mode controls remained distinguishable.",
  "Primary controls were not clipped.",
  "Not claimed: full keyboard-only validation, screen-reader validation, mobile software-keyboard validation, or WCAG compliance.",
];

const PHOTO_MODE_SCOPE = {
  accepted: [
    "Photo tab visible.",
    '"Otvoriť kameru" visible at narrow viewport.',
    '"Vybrať z galérie" visible.',
    "Disabled Analyze button visible before file selection.",
    "Internal OCR test controls did not create visible overflow.",
  ],
  notPerformedOrNotClosed: [
    "Physical Android camera",
    "Physical Android gallery",
    "Genuine iOS camera",
    "Genuine iOS photo library",
    "HEIC/HEIF",
    "EXIF orientation",
    "Decoded pixel bounds",
    "Serverless OCR",
    "Real mobile software keyboard",
    "Production multi-page billing behavior",
  ],
};

const KNOWN_OPEN_DEBTS: readonly string[] = [
  "HEIC/HEIF support",
  "EXIF orientation normalization",
  "Image dimension bounds where not yet production-closed",
  "Decoded pixel bounds",
  "Memory exhaustion protection",
  "Serverless/Vercel OCR validation",
  "Physical Android camera-image validation",
  "Genuine iOS camera-image validation",
  "Genuine mobile software keyboard validation",
  "Distributed production rate limiter",
  "Standalone Smart Talk extraction from the DNA shell",
  "Final production payment flow",
  "V4 production localization parity",
  "Minimum German bureaucracy knowledge layer",
];

const STANDALONE_DNA_SHELL_STATUS: readonly string[] = [
  "Smart Talk runtime is functionally separated in its own route/component.",
  "The page is still hosted inside the current Vaylo/DNA application shell.",
  "Sidebar/profile/DNA host context may still be visible on desktop.",
  "This phase does not claim Smart Talk is already a fully standalone application.",
  "Standalone extraction is the next planned major branch.",
];

const EVIDENCE_PROVENANCE: ReadonlyArray<{ category: string; source: EvidenceProvenance }> = [
  { category: "Chrome functional/console/network evidence", source: "manual_tester" },
  { category: "Edge functional/console evidence", source: "manual_tester" },
  { category: "Responsive device-toolbar layout evidence", source: "manual_tester" },
  { category: "Storage/Application-tab inspection", source: "manual_tester" },
  { category: "Cross-mode blocker reproduction and retry", source: "manual_tester" },
  { category: "Three-mode UI contract / dormant First Contact", source: "static_source_inspection" },
  { category: "Input-state isolation (questionInput/textDocumentInput)", source: "static_source_inspection" },
  { category: "Open-debt grounding (rate limiter, OCR debts)", source: "static_source_inspection" },
  { category: "Only-expected-files-changed / no runtime modification", source: "read_only_git" },
  { category: "Chrome/Edge installed version strings", source: "read_only_file_metadata" },
];

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const staticContractHolds =
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.planCheckIdConfirmed &&
    evidence.blockerCheckIdConfirmed &&
    evidence.descopeAuditRetained &&
    evidence.gateDesignAccepted &&
    evidence.exactlyThreeVisibleModesConfirmed &&
    evidence.standaloneFirstContactAbsent &&
    evidence.dormantFirstContactStillUnreachable &&
    evidence.questionInputStateIsolated &&
    evidence.textDocumentInputStateIsolated;

  const responsiveAllPassed = RESPONSIVE_VIEWPORTS.every((v) => v.passed);

  const allPassed = staticContractHolds && responsiveAllPassed;

  return {
    checkId: "8.13C",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourcePlanCommit: SOURCE_PLAN_COMMIT,
    sourcePlanCheckId: SOURCE_PLAN_CHECK_ID,
    sourceBlockerCommit: SOURCE_BLOCKER_COMMIT,
    sourceBlockerCheckId: SOURCE_BLOCKER_CHECK_ID,

    sourceInspectionOnlyForAuditRunner: true,
    manualBrowserEvidenceAccepted: true,
    evidenceCapturedOutsideAuditRunner: true,
    browserAutomationUsedForAcceptedEvidence: false,
    cursorMcpUsedForAcceptedEvidence: false,
    cdpUsedForAcceptedEvidence: false,

    runtimeModified: false,
    uiModified: false,
    existingFileModified: evidence.existingFileModified,
    newAuditFileCreated: evidence.newAuditFileCreated,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,

    chromeValidationPerformed: true,
    chromeValidationPassed: true,
    chromeVersion: evidence.chromeVersion,
    chromeVersionResolved: evidence.chromeVersionResolved,

    edgeValidationPerformed: true,
    edgeValidationPassed: true,
    edgeVersion: evidence.edgeVersion,
    edgeVersionResolved: evidence.edgeVersionResolved,

    firefoxValidationPerformed: false,
    firefoxValidationStatus: "not_tested",
    safariDesktopValidationPerformed: false,
    safariDesktopValidationStatus: "not_tested",

    responsiveValidationPerformed: true,
    responsiveViewportCount: RESPONSIVE_VIEWPORTS.length,
    responsiveViewportsPassedCount: RESPONSIVE_VIEWPORTS.filter((v) => v.passed).length,
    responsiveViewportsFailedCount: RESPONSIVE_VIEWPORTS.filter((v) => !v.passed).length,
    responsiveEvidenceLayoutOnly: true,
    actualResponsiveViewportDimensions: RESPONSIVE_VIEWPORTS.map((v) => `${v.width}x${v.height}`),

    physicalAndroidValidationPerformed: false,
    genuineIosSafariValidationPerformed: false,
    mobileCameraValidationPerformed: false,
    mobileSoftwareKeyboardValidationPerformed: false,

    questionModeValidated: true,
    textModeValidated: true,
    photoModeDesktopUiValidated: true,

    exactlyThreeVisibleModesConfirmed: evidence.exactlyThreeVisibleModesConfirmed,
    standaloneFirstContactAbsent: evidence.standaloneFirstContactAbsent,
    dormantFirstContactStillUnreachable: evidence.dormantFirstContactStillUnreachable,

    crossModeBlockerOriginallyObserved: true,
    crossModeBlockerPatchCommitted: evidence.blockerCheckIdConfirmed,
    crossModeBlockerResolvedInCleanChrome: true,
    questionInputStateIsolated: evidence.questionInputStateIsolated,
    textDocumentInputStateIsolated: evidence.textDocumentInputStateIsolated,
    crossModeIsolationAccepted: evidence.questionInputStateIsolated && evidence.textDocumentInputStateIsolated,

    modeSwitchRequestObserved: false,
    duplicateSubmissionValidated: true,
    duplicatePostObserved: false,
    observedSmartTalkPostCount: 1,
    nextRscGetCorrectlyExcludedFromDuplicateCount: true,

    noPersistenceInspected: true,
    noPersistenceAccepted: true,
    unsentQuestionRestoredAfterRefresh: false,
    unsentTextDocumentRestoredAfterRefresh: false,
    selectedFileRestoredAfterRefresh: false,
    localStorageContainsSmartTalkContent: false,
    sessionStorageContainsSmartTalkContent: false,
    indexedDbContainsSmartTalkContent: false,
    cookiesContainSmartTalkContent: false,
    sharedStorageContainsSmartTalkContent: false,
    serviceWorkerRegisteredForLocalhost: false,

    privacyNetworkInspectionPerformed: true,
    urlQueryLeakageObserved: false,
    unexpectedSupabaseRequestObserved: false,
    unexpectedStorageRequestObserved: false,
    unexpectedThirdPartyRequestObserved: false,
    databaseWriteObserved: false,
    storageWriteObserved: false,
    rawImageSentToModel: false,

    consoleInspectionPerformed: true,
    cleanChromeHydrationMismatchObserved: false,
    cleanEdgeHydrationMismatchObserved: false,
    cursorInjectedHydrationArtifactRecognized: true,
    suppressHydrationWarningAdded: false,

    accessibilityVisualSpotChecksPerformed: true,
    keyboardOnlyValidationPerformed: false,
    screenReaderValidationPerformed: false,
    wcagComplianceClaimed: false,

    horizontalOverflowObserved: false,
    criticalControlClippingObserved: false,
    criticalControlOverlapObserved: false,

    heicHeifStillOpen: !evidence.heicSupportImplementedNow,
    exifOrientationStillOpen: true,
    decodedPixelBoundsStillOpen: true,
    serverlessOcrValidationStillOpen: true,
    physicalAndroidStillUntested: true,
    genuineIosSafariStillUntested: true,
    distributedRateLimiterStillOpen: !evidence.rateLimiterDistributedProductionSolved,

    standaloneSmartTalkApplicationCompleted: false,
    stillHostedInsideDnaShell: true,
    standaloneExtractionStillRequired: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForStandaloneSmartTalkApplicationBoundaryGateDesign: allPassed,

    blockerRetryEvidenceCaptured: true,
    physicalPhotoProcessingClaimedFromQuestionRequest: false,
    rawImageEvidenceConfusedWithBrowserEvidence: false,
    screenshotsClaimedMachineVerified: false,
    versionStringFabricationAccepted: false,
    dirtyWorkingTreeAcceptedClaim: false,
    environmentMutationAcceptedClaim: false,
    paymentFlowClaimedComplete: false,
    v4LocalizationClaimedProductionReady: false,
    germanKnowledgeLayerClaimedComplete: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    chromeEvidence: [...CHROME_EVIDENCE],
    edgeEvidence: [...EDGE_EVIDENCE],
    crossModeBlockerHistory: [...CROSS_MODE_BLOCKER_HISTORY],
    responsiveViewports: RESPONSIVE_VIEWPORTS.map((v) => ({ ...v, notes: [...v.notes] })),
    noPersistenceEvidence: [...NO_PERSISTENCE_EVIDENCE],
    storageInspectionEvidence: [...STORAGE_INSPECTION_EVIDENCE],
    networkPrivacyEvidence: [...NETWORK_PRIVACY_EVIDENCE],
    hydrationEvidence: [...HYDRATION_EVIDENCE],
    accessibilityEvidence: [...ACCESSIBILITY_EVIDENCE],
    photoModeScope: { accepted: [...PHOTO_MODE_SCOPE.accepted], notPerformedOrNotClosed: [...PHOTO_MODE_SCOPE.notPerformedOrNotClosed] },
    knownOpenDebts: [...KNOWN_OPEN_DEBTS],
    standaloneDnaShellStatus: [...STANDALONE_DNA_SHELL_STATUS],
    evidenceProvenance: EVIDENCE_PROVENANCE.map((e) => ({ ...e })),
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${EXECUTION_PLAN_AUDIT_REL_PATH} confirmed (checkId "8.13B"): ${evidence.planCheckIdConfirmed}`,
      `${BLOCKER_AUDIT_REL_PATH} confirmed (checkId "8.13C-BLOCKER"): ${evidence.blockerCheckIdConfirmed}`,
      `${DESCOPE_AUDIT_REL_PATH} retained (checkId "8.12F-DE-SCOPE"): ${evidence.descopeAuditRetained}`,
      `${GATE_DESIGN_AUDIT_REL_PATH} accepted (checkId "8.13A"): ${evidence.gateDesignAccepted}`,
      `${CLIENT_REL_PATH} exactlyThreeVisibleModesConfirmed: ${evidence.exactlyThreeVisibleModesConfirmed}`,
      `${CLIENT_REL_PATH} standaloneFirstContactAbsent: ${evidence.standaloneFirstContactAbsent}`,
      `${ROUTE_REL_PATH} dormantFirstContactStillUnreachable: ${evidence.dormantFirstContactStillUnreachable}`,
      `${CLIENT_REL_PATH} questionInputStateIsolated: ${evidence.questionInputStateIsolated}`,
      `${CLIENT_REL_PATH} textDocumentInputStateIsolated: ${evidence.textDocumentInputStateIsolated}`,
      `Chrome version resolved via read-only file metadata: ${evidence.chromeVersion} (resolved=${evidence.chromeVersionResolved})`,
      `Edge version resolved via read-only file metadata: ${evidence.edgeVersion} (resolved=${evidence.edgeVersionResolved})`,
      "This audit read only committed source text for the gate/plan/blocker/descope audits, SmartTalkClient.tsx, route.ts, and the rate limiter — none of them was imported or executed.",
      "Chrome/Edge functional, console, network, storage, and responsive-layout evidence in this Result was captured manually by the tester outside this audit runner and is recorded, not independently machine-verified, per explicit provenance requirements.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runSmartTalkDesktopResponsiveBrowserValidationClosureAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForStandaloneSmartTalkApplicationBoundaryGateDesign: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runSmartTalkDesktopResponsiveBrowserValidationClosureAudit();
  console.log(JSON.stringify(result));
}
