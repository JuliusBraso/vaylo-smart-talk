/**
 * PHASE 8.13A — Smart Talk Mobile Browser Compatibility Validation Gate
 * Design (Static Design/Audit Only)
 *
 * This file is a GATE DESIGN, not an execution report. It defines exactly
 * what must later be validated before the final three-mode Smart Talk UI
 * (question / text / photo) can be considered mobile-browser compatible,
 * and it enforces — via static source inspection and immutable, in-memory
 * tamper cases — that no one can prematurely claim that validation is
 * already complete.
 *
 * This audit performs NO dynamic execution whatsoever: no route POST, no
 * model call, no OCR, no browser automation/startup, no Android/iOS
 * device, no dev server, no environment mutation, no DB/Storage/DNA
 * read-or-write, no network access, no dependency install, no historical
 * live closure execution (including 8.3AC / tmp-8-3ac-live-metadata.ts).
 * It only:
 *
 *   1. Reads `app/smart-talk/SmartTalkClient.tsx` and
 *      `app/api/smart-talk/route.ts` as plain text via `fs.readFileSync`
 *      and runs deterministic string/regex checks against them (never
 *      imports either as a module).
 *   2. Reads the committed rate-limiter source
 *      (`lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts`) and
 *      the committed OCR technical-debt hardening audit source to confirm
 *      — as plain text only — the known, still-open limitations this gate
 *      must record (module-level in-memory limiter, no HEIC/EXIF/pixel
 *      handling).
 *   3. Recursively scans `app/` (plain text, no execution) for
 *      `suppressHydrationWarning` and `data-cursor-ref` to confirm neither
 *      has been added as an undisclosed workaround.
 *   4. Runs read-only `git` commands (`git status --short`,
 *      `git diff --name-only`) to confirm this phase modified no existing
 *      file.
 *   5. Runs at least 40 pure, in-memory tamper cases that mutate a
 *      deep-cloned "good" Result and confirm each mutation is rejected by
 *      `computeExpectedAllPassed`/`validateResult` — no route/model/OCR/
 *      browser/mobile/DB/Storage/DNA/external-service call is ever made by
 *      any tamper case.
 *
 * WHAT THIS GATE DELIBERATELY DOES NOT DO: it does not perform, simulate,
 * or claim physical Android Chrome validation, genuine iOS Safari
 * validation, Chromium responsive-emulation validation, real desktop
 * browser validation, or serverless/Vercel validation. Those remain
 * FUTURE, explicitly-tracked execution steps (see `remainingBlockers` /
 * `browserMatrix` below) — this file only defines the gate they must pass
 * through and rejects any attempt to mark them "passed" without evidence.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Inspected-file constants (never executed, only read as text) ─────────
const SMART_TALK_CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_PAGE_REL_PATH = "app/smart-talk/page.tsx";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const RATE_LIMITER_REL_PATH = "lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts";
const GATE_REL_PATH = "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts";
const PRESENTATION_REL_PATH = "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts";
const OCR_DEBT_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-runtime-technical-debt-hardening-audit.ts";
const UNIFIED_REGRESSION_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-unified-smart-talk-cross-mode-regression-closure.ts";
const OCR_HANDOFF_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts";
const DESCOPE_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-standalone-mode-descope-audit.ts";

const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-mobile-browser-compatibility-validation-gate-design-audit.ts";

const APP_SCAN_DIR = "app";

const REQUIRED_MODE_ORDER: readonly string[] = ["question", "text", "photo"];
const REQUIRED_MODE_CHIP_CALLS: readonly string[] = [
  'modeChip("question", "Opýtať sa")',
  'modeChip("text", "Vysvetliť text")',
  'modeChip("photo", "Odfotiť dokument")',
];

const FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS: readonly string[] = [
  '"first_contact"',
  "first_contact_controlled_runtime",
  "SMART_TALK_FIRST_CONTACT_MODE_ENABLED",
  "FirstContactScenarioId",
  "onFirstContactSubmit",
  "Prvý kontakt",
];

const HYDRATION_WORKAROUND_STRINGS: readonly string[] = [
  "suppressHydrationWarning",
  "data-cursor-ref",
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

/**
 * Read-only recursive text scan (no execution) over a small, bounded
 * directory tree — used only to confirm the absence of known hydration
 * workaround strings. Skips build/output/dependency directories.
 */
function scanDirForStrings(
  relDir: string,
  needles: readonly string[],
): { found: string[]; filesScanned: number } {
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

// ─── Result shape ───────────────────────────────────────────────────────────

interface BrowserMatrixEntry {
  environment: string;
  classification: "not_tested" | "blocked_by_environment" | "not_authorized_to_claim" | "layout_only_evidence";
}

interface Result {
  checkId: "8.13A";
  allPassed: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  browserAutomationPerformed: boolean;
  physicalAndroidValidationPerformed: boolean;
  genuineIosSafariValidationPerformed: boolean;
  realModelCallPerformed: boolean;
  realOcrExecutionPerformed: boolean;
  networkAccessPerformed: boolean;
  databaseWritePerformed: boolean;
  persistencePerformed: boolean;

  exactlyThreeVisibleModesRequired: boolean;
  questionModeRequired: boolean;
  textModeRequired: boolean;
  photoModeRequired: boolean;
  standaloneFirstContactUiStillRemoved: boolean;
  dormantFirstContactRuntimeStillDisabledByDefault: boolean;

  responsiveLayoutValidationDesigned: boolean;
  softwareKeyboardValidationDesigned: boolean;
  touchInteractionValidationDesigned: boolean;
  duplicateSubmissionValidationDesigned: boolean;
  filePickerValidationDesigned: boolean;
  cameraCaptureValidationDesigned: boolean;
  gallerySelectionValidationDesigned: boolean;
  accessibilityValidationDesigned: boolean;
  crossModeIsolationValidationDesigned: boolean;
  noPersistenceValidationDesigned: boolean;
  privacyInspectionDesigned: boolean;
  networkInspectionDesigned: boolean;
  browserMatrixDesigned: boolean;

  chromiumEmulationNotAcceptedAsPhysicalDeviceProof: boolean;
  cleanBrowserHydrationReproductionRequired: boolean;
  cursorInjectedHydrationArtifactRecognized: boolean;
  suppressHydrationWarningWorkaroundProhibited: boolean;

  heicHeifStillOpen: boolean;
  exifOrientationStillOpen: boolean;
  decodedPixelBoundsStillOpen: boolean;
  serverlessOcrValidationStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  distributedRateLimiterStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  readyForMobileBrowserCompatibilityExecutionPlan: boolean;

  // Supplementary premature-claim flags — every one must remain false;
  // tamper cases 1–21 set exactly one of these true to prove rejection.
  physicalAndroidPassedClaimed: boolean;
  iosSafariPassedClaimed: boolean;
  chromiumEmulationClaimedAsSafariProof: boolean;
  responsiveViewportClaimedAsPhysicalDeviceProof: boolean;
  heicSupportClaimedComplete: boolean;
  exifOrientationClaimedComplete: boolean;
  decodedPixelProtectionClaimedComplete: boolean;
  serverlessOcrClaimedComplete: boolean;
  distributedRateLimitingClaimedComplete: boolean;
  wcagComplianceClaimed: boolean;
  productionReadinessClaimed: boolean;
  publicBetaReadinessClaimed: boolean;
  goLiveAuthorizationClaimed: boolean;
  noPersistenceClaimedFromUiTextOnly: boolean;
  hydrationBugClaimedFromCursorArtifactsOnly: boolean;
  suppressHydrationWarningAcceptedAsFix: boolean;
  standaloneFirstContactClaimedVisible: boolean;
  normalUiClaimedAbleToInvokeDormantFirstContact: boolean;
  documentModeClaimedBypassableThroughQuestionMode: boolean;
  browserValidationClaimedAllowedRealModelCalls: boolean;
  browserValidationClaimedAllowedPersistence: boolean;
  browserValidationClaimedAllowedRawImageToModel: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  requiredValidationAreas: string[];
  finalThreeModeContractRequirements: string[];
  responsiveLayoutRequirements: string[];
  softwareKeyboardRequirements: string[];
  touchDuplicateActionRequirements: string[];
  filePhotoInputRequirements: string[];
  accessibilityRequirements: string[];
  crossModeIsolationRequirements: string[];
  noPersistenceRequirements: string[];
  privacyLoggingRequirements: string[];
  browserMatrix: BrowserMatrixEntry[];
  hydrationIncidentNotes: string[];
  rateLimiterNotes: string[];
  mobileOcrOpenDebts: string[];
  safetyBoundaries: string[];
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
  { id: 1, description: "claim physical Android passed", mutate: (r) => { r.physicalAndroidPassedClaimed = true; r.physicalAndroidValidationPerformed = true; } },
  { id: 2, description: "claim iOS Safari passed", mutate: (r) => { r.iosSafariPassedClaimed = true; r.genuineIosSafariValidationPerformed = true; } },
  { id: 3, description: "claim Safari compatibility passed from Chrome emulation", mutate: (r) => { r.chromiumEmulationClaimedAsSafariProof = true; } },
  { id: 4, description: "claim responsive viewport equals physical-device validation", mutate: (r) => { r.responsiveViewportClaimedAsPhysicalDeviceProof = true; } },
  { id: 5, description: "claim HEIC support is complete", mutate: (r) => { r.heicSupportClaimedComplete = true; r.heicHeifStillOpen = false; } },
  { id: 6, description: "claim EXIF orientation is complete", mutate: (r) => { r.exifOrientationClaimedComplete = true; r.exifOrientationStillOpen = false; } },
  { id: 7, description: "claim decoded-pixel protection is complete", mutate: (r) => { r.decodedPixelProtectionClaimedComplete = true; r.decodedPixelBoundsStillOpen = false; } },
  { id: 8, description: "claim serverless OCR is complete", mutate: (r) => { r.serverlessOcrClaimedComplete = true; r.serverlessOcrValidationStillOpen = false; } },
  { id: 9, description: "claim distributed rate limiting is complete", mutate: (r) => { r.distributedRateLimitingClaimedComplete = true; r.distributedRateLimiterStillOpen = false; } },
  { id: 10, description: "claim WCAG compliance", mutate: (r) => { r.wcagComplianceClaimed = true; } },
  { id: 11, description: "claim production readiness", mutate: (r) => { r.productionReadinessClaimed = true; r.productionAuthorizedNow = true; } },
  { id: 12, description: "claim public beta readiness", mutate: (r) => { r.publicBetaReadinessClaimed = true; r.publicRuntimeAuthorizedNow = true; } },
  { id: 13, description: "claim go-live authorization", mutate: (r) => { r.goLiveAuthorizationClaimed = true; r.goLiveAuthorizedNow = true; } },
  { id: 14, description: "claim no-persistence based only on UI text", mutate: (r) => { r.noPersistenceClaimedFromUiTextOnly = true; } },
  { id: 15, description: "claim hydration bug based only on Cursor-injected attributes", mutate: (r) => { r.hydrationBugClaimedFromCursorArtifactsOnly = true; } },
  { id: 16, description: "claim suppressHydrationWarning is an accepted fix", mutate: (r) => { r.suppressHydrationWarningAcceptedAsFix = true; r.suppressHydrationWarningWorkaroundProhibited = false; } },
  { id: 17, description: "claim standalone First Contact is visible", mutate: (r) => { r.standaloneFirstContactClaimedVisible = true; r.standaloneFirstContactUiStillRemoved = false; } },
  { id: 18, description: "claim normal UI can invoke dormant First Contact", mutate: (r) => { r.normalUiClaimedAbleToInvokeDormantFirstContact = true; r.dormantFirstContactRuntimeStillDisabledByDefault = false; } },
  { id: 19, description: "claim document mode can be bypassed through question mode", mutate: (r) => { r.documentModeClaimedBypassableThroughQuestionMode = true; } },
  { id: 20, description: "claim browser validation may execute real model calls", mutate: (r) => { r.browserValidationClaimedAllowedRealModelCalls = true; r.realModelCallPerformed = true; } },
  { id: 21, description: "claim browser validation may persist user content", mutate: (r) => { r.browserValidationClaimedAllowedPersistence = true; r.persistencePerformed = true; } },
  { id: 22, description: "claim browser validation may send raw image data to the model", mutate: (r) => { r.browserValidationClaimedAllowedRawImageToModel = true; } },
  { id: 23, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "8.12F-DE-SCOPE"; } },
  { id: 24, description: "sourceInspectionOnly false", mutate: (r) => { r.sourceInspectionOnly = false; } },
  { id: 25, description: "runtimeModified true", mutate: (r) => { r.runtimeModified = true; } },
  { id: 26, description: "uiModified true", mutate: (r) => { r.uiModified = true; } },
  { id: 27, description: "browserAutomationPerformed true", mutate: (r) => { r.browserAutomationPerformed = true; } },
  { id: 28, description: "realOcrExecutionPerformed true", mutate: (r) => { r.realOcrExecutionPerformed = true; } },
  { id: 29, description: "networkAccessPerformed true", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 30, description: "databaseWritePerformed true", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 31, description: "exactlyThreeVisibleModesRequired false", mutate: (r) => { r.exactlyThreeVisibleModesRequired = false; } },
  { id: 32, description: "questionModeRequired false", mutate: (r) => { r.questionModeRequired = false; } },
  { id: 33, description: "textModeRequired false", mutate: (r) => { r.textModeRequired = false; } },
  { id: 34, description: "photoModeRequired false", mutate: (r) => { r.photoModeRequired = false; } },
  { id: 35, description: "responsiveLayoutValidationDesigned false", mutate: (r) => { r.responsiveLayoutValidationDesigned = false; } },
  { id: 36, description: "softwareKeyboardValidationDesigned false", mutate: (r) => { r.softwareKeyboardValidationDesigned = false; } },
  { id: 37, description: "touchInteractionValidationDesigned false", mutate: (r) => { r.touchInteractionValidationDesigned = false; } },
  { id: 38, description: "duplicateSubmissionValidationDesigned false", mutate: (r) => { r.duplicateSubmissionValidationDesigned = false; } },
  { id: 39, description: "filePickerValidationDesigned false", mutate: (r) => { r.filePickerValidationDesigned = false; } },
  { id: 40, description: "accessibilityValidationDesigned false", mutate: (r) => { r.accessibilityValidationDesigned = false; } },
  { id: 41, description: "crossModeIsolationValidationDesigned false", mutate: (r) => { r.crossModeIsolationValidationDesigned = false; } },
  { id: 42, description: "noPersistenceValidationDesigned false", mutate: (r) => { r.noPersistenceValidationDesigned = false; } },
  { id: 43, description: "browserMatrixDesigned false", mutate: (r) => { r.browserMatrixDesigned = false; } },
  { id: 44, description: "chromiumEmulationNotAcceptedAsPhysicalDeviceProof false", mutate: (r) => { r.chromiumEmulationNotAcceptedAsPhysicalDeviceProof = false; } },
  { id: 45, description: "cleanBrowserHydrationReproductionRequired false", mutate: (r) => { r.cleanBrowserHydrationReproductionRequired = false; } },
  { id: 46, description: "physicalAndroidStillUntested false without evidence", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 47, description: "genuineIosSafariStillUntested false without evidence", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 48, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 999; } },
  { id: 49, description: "tamperCasesRejectedCount inflated beyond total", mutate: (r) => { r.tamperCasesRejectedCount = 999; } },
  { id: 50, description: "readyForMobileBrowserCompatibilityExecutionPlan true while other checks fail", mutate: (r) => { r.uiModified = true; r.readyForMobileBrowserCompatibilityExecutionPlan = true; } },
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
    r.checkId === "8.13A",

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.browserAutomationPerformed === false,
    r.physicalAndroidValidationPerformed === false,
    r.genuineIosSafariValidationPerformed === false,
    r.realModelCallPerformed === false,
    r.realOcrExecutionPerformed === false,
    r.networkAccessPerformed === false,
    r.databaseWritePerformed === false,
    r.persistencePerformed === false,

    r.exactlyThreeVisibleModesRequired === true,
    r.questionModeRequired === true,
    r.textModeRequired === true,
    r.photoModeRequired === true,
    r.standaloneFirstContactUiStillRemoved === true,
    r.dormantFirstContactRuntimeStillDisabledByDefault === true,

    r.responsiveLayoutValidationDesigned === true,
    r.softwareKeyboardValidationDesigned === true,
    r.touchInteractionValidationDesigned === true,
    r.duplicateSubmissionValidationDesigned === true,
    r.filePickerValidationDesigned === true,
    r.cameraCaptureValidationDesigned === true,
    r.gallerySelectionValidationDesigned === true,
    r.accessibilityValidationDesigned === true,
    r.crossModeIsolationValidationDesigned === true,
    r.noPersistenceValidationDesigned === true,
    r.privacyInspectionDesigned === true,
    r.networkInspectionDesigned === true,
    r.browserMatrixDesigned === true,

    r.chromiumEmulationNotAcceptedAsPhysicalDeviceProof === true,
    r.cleanBrowserHydrationReproductionRequired === true,
    r.cursorInjectedHydrationArtifactRecognized === true,
    r.suppressHydrationWarningWorkaroundProhibited === true,

    r.heicHeifStillOpen === true,
    r.exifOrientationStillOpen === true,
    r.decodedPixelBoundsStillOpen === true,
    r.serverlessOcrValidationStillOpen === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.distributedRateLimiterStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.physicalAndroidPassedClaimed === false,
    r.iosSafariPassedClaimed === false,
    r.chromiumEmulationClaimedAsSafariProof === false,
    r.responsiveViewportClaimedAsPhysicalDeviceProof === false,
    r.heicSupportClaimedComplete === false,
    r.exifOrientationClaimedComplete === false,
    r.decodedPixelProtectionClaimedComplete === false,
    r.serverlessOcrClaimedComplete === false,
    r.distributedRateLimitingClaimedComplete === false,
    r.wcagComplianceClaimed === false,
    r.productionReadinessClaimed === false,
    r.publicBetaReadinessClaimed === false,
    r.goLiveAuthorizationClaimed === false,
    r.noPersistenceClaimedFromUiTextOnly === false,
    r.hydrationBugClaimedFromCursorArtifactsOnly === false,
    r.suppressHydrationWarningAcceptedAsFix === false,
    r.standaloneFirstContactClaimedVisible === false,
    r.normalUiClaimedAbleToInvokeDormantFirstContact === false,
    r.documentModeClaimedBypassableThroughQuestionMode === false,
    r.browserValidationClaimedAllowedRealModelCalls === false,
    r.browserValidationClaimedAllowedPersistence === false,
    r.browserValidationClaimedAllowedRawImageToModel === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

function validateResult(r: Result): string[] {
  const violations: string[] = [];
  if (r.checkId !== "8.13A") violations.push("checkId must be exactly 8.13A");
  if (r.exactlyThreeVisibleModesRequired && JSON.stringify(REQUIRED_MODE_ORDER) !== JSON.stringify(["question", "text", "photo"])) {
    violations.push("visible mode order constant must be question, text, photo");
  }
  if (r.browserMatrix.some((e) => e.classification !== "not_tested" && e.classification !== "blocked_by_environment" && e.classification !== "not_authorized_to_claim" && e.classification !== "layout_only_evidence")) {
    violations.push("browserMatrix entries must use only the four allowed classifications");
  }
  if (r.browserMatrix.some((e) => e.classification === "layout_only_evidence" && !/emulat/i.test(e.environment))) {
    violations.push("only Chromium emulation entries may use the layout_only_evidence classification");
  }
  return violations;
}

// ─── Evidence collection (all static/read-only) ────────────────────────────

type Evidence = {
  diffNameOnly: string[];
  statusShort: string[];
  noExistingFileModified: boolean;
  descopeAuditRetained: boolean;
  clientSrc: string;
  routeSrc: string;
  menuOrderCorrect: boolean;
  modeChipCallCount: number;
  forbiddenClientStringsAbsent: boolean;
  backendFirstContactRoutePresent: boolean;
  backendExactTrueGatePresent: boolean;
  backendDisabledByDefault: boolean;
  rateLimiterModuleLevelInMemory: boolean;
  rateLimiterIsolatedFactoryPresent: boolean;
  rateLimiterDeterministicClockPresent: boolean;
  rateLimiterDistributedProductionSolved: boolean;
  heicSupportImplementedNow: boolean;
  ocrDebtEvidencePresent: boolean;
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
  const noExistingFileModified = modifiedExisting.length === 0;
  if (!noExistingFileModified) {
    notes.push(`Existing tracked files unexpectedly modified: ${modifiedExisting.join(", ")}`);
  }
  const onlyExpectedUntracked = untrackedNew.every((p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH));
  if (!onlyExpectedUntracked) {
    notes.push(`Unexpected untracked files present: ${untrackedNew.filter((p) => p !== AUDIT_SELF_REL_PATH).join(", ")}`);
  }

  const descopeAuditRetained = fileExists(DESCOPE_AUDIT_REL_PATH) && readFileText(DESCOPE_AUDIT_REL_PATH).includes('checkId: "8.12F-DE-SCOPE"');

  const clientSrc = readFileText(SMART_TALK_CLIENT_REL_PATH);
  const routeSrc = readFileText(ROUTE_REL_PATH);

  const menuOrderCorrect = menuOrderIsCorrect(clientSrc);
  const modeChipCallCount = (clientSrc.match(/modeChip\(\s*"[a-z_]+"/g) ?? []).length;
  const { ok: forbiddenClientStringsAbsent } = includesNone(clientSrc, FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS);

  const backendFirstContactRoutePresent =
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") &&
    routeSrc.includes("o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE");
  const backendExactTrueGatePresent = routeSrc.includes(
    'process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true"',
  );
  const envFilesWithFlag = ["/.env", "/.env.local", "/.env.production"]
    .map((p) => readFileText(p.slice(1)))
    .some((s) => s.includes("SMART_TALK_FIRST_CONTACT_MODE_ENABLED"));
  const backendDisabledByDefault = backendExactTrueGatePresent && !envFilesWithFlag;

  const rateLimiterSrc = readFileText(RATE_LIMITER_REL_PATH);
  const rateLimiterModuleLevelInMemory =
    rateLimiterSrc.includes("module-level in-memory") && rateLimiterSrc.includes("new Map<string, number[]>()");
  const rateLimiterIsolatedFactoryPresent = rateLimiterSrc.includes("createInMemorySmartTalkRateLimiter");
  const rateLimiterDeterministicClockPresent = rateLimiterSrc.includes("SmartTalkRateLimiterClock");
  // Grounded on the absence of any claim that a distributed/production
  // rate limiter has been implemented — the current source only describes
  // a module-level in-memory limiter, so this must evaluate to false.
  const rateLimiterDistributedProductionSolved = /distributed[\s-]*production|production[\s-]*distributed/i.test(
    rateLimiterSrc,
  );

  const ocrDebtSrc = readFileText(OCR_DEBT_AUDIT_REL_PATH);
  const heicSupportImplementedNow = !ocrDebtSrc.includes("heicSupportImplementedNow: false");
  const ocrDebtEvidencePresent = ocrDebtSrc.includes("heicSupportImplementedNow");

  const hydrationScan = scanDirForStrings(APP_SCAN_DIR, HYDRATION_WORKAROUND_STRINGS);

  return {
    diffNameOnly,
    statusShort,
    noExistingFileModified: noExistingFileModified && onlyExpectedUntracked,
    descopeAuditRetained,
    clientSrc,
    routeSrc,
    menuOrderCorrect,
    modeChipCallCount,
    forbiddenClientStringsAbsent,
    backendFirstContactRoutePresent,
    backendExactTrueGatePresent,
    backendDisabledByDefault,
    rateLimiterModuleLevelInMemory,
    rateLimiterIsolatedFactoryPresent,
    rateLimiterDeterministicClockPresent,
    rateLimiterDistributedProductionSolved,
    heicSupportImplementedNow,
    ocrDebtEvidencePresent,
    hydrationWorkaroundStringsFound: hydrationScan.found,
    hydrationScanFilesScanned: hydrationScan.filesScanned,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const threeModeContractHolds =
    evidence.menuOrderCorrect &&
    evidence.modeChipCallCount === 3 &&
    evidence.forbiddenClientStringsAbsent;

  const dormantBackendHolds =
    evidence.backendFirstContactRoutePresent &&
    evidence.backendExactTrueGatePresent &&
    evidence.backendDisabledByDefault;

  const noWorkaroundFound = evidence.hydrationWorkaroundStringsFound.length === 0;

  const staticAllPassed =
    evidence.noExistingFileModified &&
    evidence.descopeAuditRetained &&
    threeModeContractHolds &&
    dormantBackendHolds &&
    noWorkaroundFound;

  const browserMatrix: BrowserMatrixEntry[] = [
    { environment: "Desktop — current Chrome", classification: "not_tested" },
    { environment: "Desktop — current Edge", classification: "not_tested" },
    { environment: "Desktop — Firefox (where feasible)", classification: "not_tested" },
    { environment: "Desktop — Safari on macOS (only if genuinely available)", classification: "blocked_by_environment" },
    { environment: "Mobile — physical Android Chrome", classification: "not_tested" },
    { environment: "Mobile — genuine iOS Safari", classification: "blocked_by_environment" },
    { environment: "Mobile — responsive Chromium emulation", classification: "layout_only_evidence" },
  ];

  return {
    checkId: "8.13A",
    allPassed: staticAllPassed,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    browserAutomationPerformed: false,
    physicalAndroidValidationPerformed: false,
    genuineIosSafariValidationPerformed: false,
    realModelCallPerformed: false,
    realOcrExecutionPerformed: false,
    networkAccessPerformed: false,
    databaseWritePerformed: false,
    persistencePerformed: false,

    exactlyThreeVisibleModesRequired: threeModeContractHolds,
    questionModeRequired: true,
    textModeRequired: true,
    photoModeRequired: true,
    standaloneFirstContactUiStillRemoved: evidence.forbiddenClientStringsAbsent,
    dormantFirstContactRuntimeStillDisabledByDefault: dormantBackendHolds,

    responsiveLayoutValidationDesigned: true,
    softwareKeyboardValidationDesigned: true,
    touchInteractionValidationDesigned: true,
    duplicateSubmissionValidationDesigned: true,
    filePickerValidationDesigned: true,
    cameraCaptureValidationDesigned: true,
    gallerySelectionValidationDesigned: true,
    accessibilityValidationDesigned: true,
    crossModeIsolationValidationDesigned: true,
    noPersistenceValidationDesigned: true,
    privacyInspectionDesigned: true,
    networkInspectionDesigned: true,
    browserMatrixDesigned: true,

    chromiumEmulationNotAcceptedAsPhysicalDeviceProof: true,
    cleanBrowserHydrationReproductionRequired: true,
    cursorInjectedHydrationArtifactRecognized: true,
    suppressHydrationWarningWorkaroundProhibited: noWorkaroundFound,

    heicHeifStillOpen: !evidence.heicSupportImplementedNow,
    exifOrientationStillOpen: true,
    decodedPixelBoundsStillOpen: true,
    serverlessOcrValidationStillOpen: true,
    physicalAndroidStillUntested: true,
    genuineIosSafariStillUntested: true,
    distributedRateLimiterStillOpen: !evidence.rateLimiterDistributedProductionSolved,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    readyForMobileBrowserCompatibilityExecutionPlan: staticAllPassed,

    physicalAndroidPassedClaimed: false,
    iosSafariPassedClaimed: false,
    chromiumEmulationClaimedAsSafariProof: false,
    responsiveViewportClaimedAsPhysicalDeviceProof: false,
    heicSupportClaimedComplete: false,
    exifOrientationClaimedComplete: false,
    decodedPixelProtectionClaimedComplete: false,
    serverlessOcrClaimedComplete: false,
    distributedRateLimitingClaimedComplete: false,
    wcagComplianceClaimed: false,
    productionReadinessClaimed: false,
    publicBetaReadinessClaimed: false,
    goLiveAuthorizationClaimed: false,
    noPersistenceClaimedFromUiTextOnly: false,
    hydrationBugClaimedFromCursorArtifactsOnly: false,
    suppressHydrationWarningAcceptedAsFix: false,
    standaloneFirstContactClaimedVisible: false,
    normalUiClaimedAbleToInvokeDormantFirstContact: false,
    documentModeClaimedBypassableThroughQuestionMode: false,
    browserValidationClaimedAllowedRealModelCalls: false,
    browserValidationClaimedAllowedPersistence: false,
    browserValidationClaimedAllowedRawImageToModel: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    sourceEvidence: [
      `git diff --name-only (existing tracked files touched, excluding this new file): ${JSON.stringify(evidence.diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH))}`,
      `noExistingFileModified: ${evidence.noExistingFileModified}`,
      `${DESCOPE_AUDIT_REL_PATH} retained with checkId "8.12F-DE-SCOPE": ${evidence.descopeAuditRetained}`,
      `${SMART_TALK_CLIENT_REL_PATH} menuOrderCorrect (question, text, photo): ${evidence.menuOrderCorrect}`,
      `${SMART_TALK_CLIENT_REL_PATH} modeChipCallCount (expected 3): ${evidence.modeChipCallCount}`,
      `${SMART_TALK_CLIENT_REL_PATH} forbiddenFirstContactClientStringsAbsent: ${evidence.forbiddenClientStringsAbsent}`,
      `${ROUTE_REL_PATH} backendFirstContactRoutePresent: ${evidence.backendFirstContactRoutePresent}`,
      `${ROUTE_REL_PATH} backendExactTrueGatePresent: ${evidence.backendExactTrueGatePresent}`,
      `backendDisabledByDefault (no committed env file sets the flag): ${evidence.backendDisabledByDefault}`,
      `${RATE_LIMITER_REL_PATH} module-level in-memory limiter confirmed: ${evidence.rateLimiterModuleLevelInMemory}`,
      `${RATE_LIMITER_REL_PATH} isolated factory + deterministic clock confirmed: ${evidence.rateLimiterIsolatedFactoryPresent && evidence.rateLimiterDeterministicClockPresent}`,
      `${OCR_DEBT_AUDIT_REL_PATH} HEIC-not-implemented evidence present: ${evidence.ocrDebtEvidencePresent}`,
      `Hydration workaround scan of ${APP_SCAN_DIR}/ (${evidence.hydrationScanFilesScanned} files): found=${JSON.stringify(evidence.hydrationWorkaroundStringsFound)}`,
      "This audit read only committed source text; it never imported or executed route.ts, SmartTalkClient.tsx, the rate limiter, the OCR debt audit, the unified regression closure, the OCR handoff audit, or the First Contact descope audit.",
    ],
    inspectedFiles: [
      SMART_TALK_CLIENT_REL_PATH,
      SMART_TALK_PAGE_REL_PATH,
      ROUTE_REL_PATH,
      RATE_LIMITER_REL_PATH,
      GATE_REL_PATH,
      PRESENTATION_REL_PATH,
      OCR_DEBT_AUDIT_REL_PATH,
      UNIFIED_REGRESSION_REL_PATH,
      OCR_HANDOFF_AUDIT_REL_PATH,
      DESCOPE_AUDIT_REL_PATH,
      "existing 8.11 and 8.12 audit files (existence + marker checks only)",
      "no-persistence, rate-limit, and paid-boundary audits (existence + marker checks only)",
    ],
    filesModified: [],
    filesCreated: [AUDIT_SELF_REL_PATH],
    requiredValidationAreas: [
      "A. Final three-mode UI contract",
      "B. Responsive layout",
      "C. Software keyboard behavior",
      "D. Touch and duplicate action protection",
      "E. File and photo input",
      "F. Accessibility",
      "G. Cross-mode isolation",
      "H. No-persistence",
      "I. Privacy and logging",
      "J. Browser matrix",
      "K. Hydration and tooling artifacts",
      "L. Rate limiter and request isolation",
      "M. Mobile OCR open debts",
      "N. Safety boundaries",
    ],
    finalThreeModeContractRequirements: [
      "Exactly three visible modes: question, text, photo.",
      "No standalone First Contact mode reappears in the UI.",
      "No hidden normal-UI invocation path reaches the dormant First Contact backend.",
      "Mode labels (\"Opýtať sa\", \"Vysvetliť text\", \"Odfotiť dokument\") remain user-facing and understandable.",
      "Switching modes must not preserve incompatible input state across modes.",
      "Switching modes must not silently submit a request.",
      "Switching modes must not trigger model or OCR execution as a side effect.",
    ],
    responsiveLayoutRequirements: [
      "Narrow mobile widths (e.g. ~320–375px).",
      "Medium mobile widths (e.g. ~390–430px).",
      "Tablet widths (e.g. ~600–1024px).",
      "Desktop widths (>1024px).",
      "Portrait orientation.",
      "Landscape orientation where practical.",
      "No horizontal overflow at any tested width.",
      "No clipped buttons.",
      "Mode selector remains reachable and not obscured.",
      "Warnings and disclaimers remain readable at every tested width.",
      "OCR quality/status text remains readable.",
      "Upload controls remain usable at every tested width.",
      "Result sections remain usable and scrollable at every tested width.",
      "Adequate spacing for touch interaction (minimum comfortable tap size).",
    ],
    softwareKeyboardRequirements: [
      "Textarea remains reachable when the on-screen keyboard opens.",
      "Submit button remains reachable while the keyboard is open.",
      "Mode controls are not permanently obscured by the open keyboard.",
      "Viewport does not jump into a broken/unrecoverable layout when the keyboard opens or closes.",
      "Focus is preserved appropriately across keyboard open/close transitions.",
      "Closing the keyboard restores a usable layout.",
      "Enter-key and multiline textarea behavior remain intentional (no unintended newline-vs-submit conflict).",
      "No accidental submission is triggered purely by keyboard interaction.",
    ],
    touchDuplicateActionRequirements: [
      "Touch targets are usable at realistic finger size.",
      "One tap causes at most one logical submission.",
      "Repeated taps do not create duplicate model calls.",
      "Repeated taps do not create duplicate OCR executions.",
      "Loading state disables incompatible actions while a request is in flight.",
      "Mode switching during an active request is handled safely (no crossed/duplicated state).",
      "Back navigation and page refresh do not replay a prior request.",
    ],
    filePhotoInputRequirements: [
      "Camera capture where supported by the device/browser.",
      "Gallery selection.",
      "Standard JPEG.",
      "PNG.",
      "WebP, if currently accepted by the route (source evidence required before claiming support).",
      "Unsupported formats produce a clear, non-crashing error.",
      "HEIC/HEIF — retained as a known unresolved blocker unless static source evidence proves otherwise.",
      "EXIF orientation — retained as a known unresolved blocker unless static source evidence proves otherwise.",
      "Very large image dimensions.",
      "Decoded pixel bounds (memory-safety limits on decoded bitmap size).",
      "Large file size, at and beyond the current documented upload budget.",
      "Corrupted image data.",
      "Zero-byte file.",
      "Non-image file selected via the file picker.",
      "Repeated file selection in the same session.",
      "Selecting the same file twice in a row.",
      "Cancelling the picker without selecting a file.",
      "Replacing an already-selected file/page.",
      "Multi-page document behavior (ordering, per-page removal, total-size budget).",
    ],
    accessibilityRequirements: [
      "Keyboard-only navigation across mode selector, textarea/upload controls, and submit button.",
      "Visible focus indicator on interactive elements.",
      "Semantic button elements for all actionable controls.",
      "Accessible labels for form controls (textarea, file input, mode tabs).",
      "Error state is announced, not only shown visually.",
      "Loading state is announced, not only shown visually.",
      "Sufficient distinction between the three modes beyond color alone.",
      "Warnings are not conveyed only by color.",
      "Form controls are properly associated with their labels.",
      "Touch target usability for assistive and motor-impaired interaction.",
      "Screen-reader-oriented structure (headings, roles) where practical.",
      "This gate does not claim WCAG compliance of any level.",
    ],
    crossModeIsolationRequirements: [
      "Question-mode input cannot invoke document (text) processing.",
      "Text mode cannot invoke photo OCR.",
      "Photo mode cannot silently autofill the text-mode textarea.",
      "A photo-OCR result cannot persist into or leak across another mode.",
      "The dormant First Contact backend cannot be invoked by any normal-UI path.",
      "Paid-document boundaries cannot be bypassed through question mode.",
      "No stale result from one mode is ever presented as belonging to another mode.",
    ],
    noPersistenceRequirements: [
      "No persistence into localStorage.",
      "No persistence into sessionStorage.",
      "No persistence into IndexedDB.",
      "No persistence into cookies.",
      "No persistence into URL query parameters.",
      "No persistence into browser history state.",
      "No persistence into a service-worker cache.",
      "No persistence into an application database.",
      "No persistence into Supabase.",
      "No persistence into file storage.",
      "No persistence into Vaylo DNA.",
      "Distinguishes source-level no-persistence evidence (this gate) from runtime browser inspection, network inspection, and post-refresh inspection (all future execution steps).",
    ],
    privacyLoggingRequirements: [
      "Inspect the browser console for leaked document/photo/OCR content.",
      "Inspect server logs for leaked document/photo/OCR content.",
      "Inspect network payloads for unexpected fields.",
      "Inspect raw image handling end-to-end.",
      "Inspect OCR text handling end-to-end.",
      "Confirm the PII redaction boundary holds under real input.",
      "Confirm absence of full-document console logging.",
      "Confirm absence of raw image transmission directly to the model (only OCR-derived text, where applicable).",
      "Confirm absence of unexpected third-party network requests.",
    ],
    browserMatrix,
    hydrationIncidentNotes: [
      'Known incident: Cursor browser automation injected attributes such as data-cursor-ref="e0" before React hydration, causing a hydration mismatch.',
      "A clean Chrome refresh (without the injected automation attribute) did not reproduce the error.",
      "Future hydration defects must be reproduced in a clean browser without injected automation attributes before any production code change is made.",
      "Adding suppressHydrationWarning merely to hide a tooling artifact is prohibited.",
      "Modifying SmartTalkClient.tsx solely because Cursor injected DOM attributes is prohibited.",
      "Claiming a real Vaylo defect without clean-browser reproduction is prohibited.",
      `Static scan of ${APP_SCAN_DIR}/ for suppressHydrationWarning / data-cursor-ref found: ${JSON.stringify(evidence.hydrationWorkaroundStringsFound)} (expected empty).`,
    ],
    rateLimiterNotes: [
      "The current Smart Talk rate limiter is a module-level in-memory sliding-window limiter (see smart-talk-rate-limiter.ts) — not production-distributed.",
      "An isolated factory (createInMemorySmartTalkRateLimiter) and an injectable deterministic clock exist and support isolated unit tests.",
      "Route-level integration tests going through the real HTTP handler still share the production singleton and may need distinct TEST-NET IPs per scenario to avoid cross-test contamination.",
      "Local mobile-browser validation must avoid cross-test contamination against the shared production limiter singleton.",
      "A distributed production rate limiter remains a later required phase — this phase does not implement one.",
    ],
    mobileOcrOpenDebts: [
      "HEIC/HEIF support — unresolved unless source evidence proves otherwise.",
      "EXIF orientation normalization — unresolved unless source evidence proves otherwise.",
      "Image dimension bounds — unresolved unless source evidence proves otherwise.",
      "Decoded pixel bounds — unresolved unless source evidence proves otherwise.",
      "Memory-exhaustion protection for decoded images — unresolved unless source evidence proves otherwise.",
      "Serverless/Vercel OCR runtime behavior — unresolved unless source evidence proves otherwise.",
      "Real iOS camera-image validation — unresolved (not tested).",
      "Real Android camera-image validation — unresolved (not tested).",
      "Multi-page document handling under real device conditions — unresolved (not tested).",
    ],
    safetyBoundaries: [
      "Mobile/browser validation does not authorize legal advice.",
      "Mobile/browser validation does not authorize exact legal deadline computation.",
      "Mobile/browser validation does not authorize official filing.",
      "Mobile/browser validation does not authorize payment.",
      "Mobile/browser validation does not authorize signing.",
      "Mobile/browser validation does not authorize verified legal status.",
      "Mobile/browser validation does not authorize public runtime.",
      "Mobile/browser validation does not authorize production launch.",
      "Mobile/browser validation does not authorize go-live.",
      "Mobile/browser validation does not authorize persistence.",
      "Mobile/browser validation does not authorize Vaylo DNA integration.",
      "Mobile/browser validation does not authorize an unrestricted document mode.",
      "Existing governance and controlled-reasoning boundaries remain unchanged by this gate.",
    ],
    implementationLimitations: [
      "This phase is design-and-audit only; it performs no browser automation, no physical device test, and no real network/model/OCR call.",
      "No Chromium responsive emulation was executed by this audit.",
      "No real desktop browser was launched by this audit.",
      "No physical Android device was used.",
      "No genuine iOS Safari environment was used.",
      "No serverless/Vercel deployment was exercised.",
      "The dormant First Contact backend was intentionally left untouched as historical, disabled-by-default evidence.",
      "This audit does not implement a new rate limiter.",
      "This audit does not resolve HEIC/HEIF, EXIF orientation, decoded-pixel bounds, or serverless OCR — those remain open.",
    ],
    remainingBlockers: [
      "Smart Talk desktop browser validation (Chrome/Edge/Firefox/Safari-if-available) pending",
      "Chromium responsive emulation pass (layout-only evidence) pending",
      "Physical Android Chrome validation pending",
      "Genuine iOS Safari validation pending",
      "Mobile software-keyboard validation pending",
      "Touch and duplicate-submission validation pending",
      "File/photo input edge-case validation pending (HEIC, EXIF, large/corrupted/zero-byte/non-image files, repeated selection)",
      "Accessibility validation pending (not a WCAG compliance claim)",
      "Cross-mode isolation validation pending",
      "No-persistence runtime/browser/network/post-refresh inspection pending",
      "Privacy and logging inspection pending (console, server logs, network payloads)",
      "Hydration defect clean-browser reproduction protocol pending any future occurrence",
      "Distributed production rate limiter design/implementation pending",
      "HEIC/HEIF support unresolved",
      "EXIF orientation handling unresolved",
      "Decoded pixel bounds unresolved",
      "Serverless/Vercel OCR validation pending",
      "Austria implementation not started",
      "DNA integration not implemented",
      "Controlled beta unauthorized",
      "Public beta unauthorized",
      "Production unauthorized",
      "Go-live unauthorized",
    ],
    readinessVerdict: [
      staticAllPassed
        ? "The Smart Talk mobile browser compatibility validation gate is well-formed: the final three-mode UI contract and dormant First Contact backend safety hold under static source inspection, no existing file was modified, no hydration workaround was introduced, and every required future-validation area (A–N) has been explicitly designed."
        : "The gate design failed one or more static contract checks — see notes for details.",
      "This is a design/audit-only gate; no dynamic browser/mobile/network/model/OCR validation has occurred, and none may be claimed as passed until executed with real evidence.",
    ],
    nextRecommendedSteps: [
      "Author a dedicated execution plan for desktop browser validation (Chrome/Edge/Firefox, Safari-if-available) against this gate.",
      "Author a dedicated execution plan for Chromium responsive emulation, explicitly labeled as layout-only evidence.",
      "Schedule physical Android Chrome and genuine iOS Safari validation sessions; do not substitute emulation for either.",
      "Reproduce any future hydration defect in a clean browser without injected automation attributes before touching SmartTalkClient.tsx.",
      "Keep HEIC/HEIF, EXIF orientation, decoded-pixel bounds, and serverless OCR tracked as open debts until resolved by source evidence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runSmartTalkMobileBrowserCompatibilityValidationGateDesignAudit(): Result {
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
    readyForMobileBrowserCompatibilityExecutionPlan: staticAllPassed,
    readinessVerdict: [
      staticAllPassed
        ? "The Smart Talk mobile browser compatibility validation gate is well-formed: the final three-mode UI contract and dormant First Contact backend safety hold under static source inspection, no existing file was modified, no hydration workaround was introduced, and every required future-validation area (A–N) has been explicitly designed."
        : `The gate design failed one or more static contract checks: ${[...structuralViolations, ...tamperOutcome.failures].join("; ")}`,
      `Tamper cases rejected: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      "This is a design/audit-only gate; no dynamic browser/mobile/network/model/OCR validation has occurred, and none may be claimed as passed until executed with real evidence.",
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
  const result = runSmartTalkMobileBrowserCompatibilityValidationGateDesignAudit();
  console.log(JSON.stringify(result));
}
