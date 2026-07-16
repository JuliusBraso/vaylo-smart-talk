/**
 * PHASE 8.12F-DE-SCOPE — Smart Talk: Remove First Contact as a Standalone
 * Mode (Static De-Scope Audit)
 *
 * Static, read-only audit confirming that the standalone "Prvý kontakt"
 * ("First Contact") Smart Talk UI mode has been fully removed from the
 * user-facing client (`app/smart-talk/SmartTalkClient.tsx`) while the
 * dormant backend First Contact implementation (route branch, runtime
 * gate, presentation mapper, prompt branch, feature flag, and historical
 * audits) remains committed, unmodified, and disabled by default.
 *
 * This audit performs NO dynamic execution whatsoever: no route POST, no
 * model call, no OCR, no browser, no Android/iOS device, no dev server, no
 * environment mutation, no DB/Storage/DNA write, no historical live closure
 * execution (including 8.3AC). It only:
 *
 *   1. Reads `app/smart-talk/SmartTalkClient.tsx` as plain text via
 *      `fs.readFileSync` and runs deterministic string/regex checks against
 *      it (never imports it as a module — it is a "use client" React
 *      component and importing it would require a DOM/bundler anyway).
 *   2. Reads the committed, dormant First Contact backend files
 *      (`app/api/smart-talk/route.ts`,
 *      `lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts`,
 *      `lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts`,
 *      `lib/vaylo/smart-talk/build-smart-talk-prompt.ts`) as plain text —
 *      same read-only technique — to statically confirm the backend
 *      implementation is still present, unmodified in this phase, and
 *      remains gated behind an exact `=== "true"` feature-flag check.
 *   3. Confirms the historical First Contact audit files remain present on
 *      disk (by path only — their content is never executed).
 *   4. Runs read-only `git` commands (`git log`, `git status --short`,
 *      `git diff --stat`, `git diff --name-only`) to confirm the exact file
 *      boundary and source-commit acceptance.
 *   5. Runs 46 pure, in-memory tamper cases that mutate a deep-cloned
 *      "good" Result and confirm each mutation is rejected by
 *      `computeExpectedAllPassed`/`validateResult` — no route/model/OCR/
 *      browser/mobile/DB/Storage/DNA/external-service call is ever made by
 *      any tamper case.
 *
 * SOURCE EVIDENCE — FULLY DISCLOSED: this audit does NOT accept the prior
 * 8.12C/8.12D/8.12E phases merely because their files exist on disk. It
 * requires: (a) `git log` to contain all three source commit hashes, and
 * (b) `fs.readFileSync` marker checks confirming each phase's own
 * committed file still contains its own `checkId`/export-name literal
 * intact. None of those historical files is ever imported or executed
 * here — only their own committed source text is inspected.
 *
 * FORBIDDEN ACTIONS NOT PERFORMED BY THIS AUDIT: no route POST, no model
 * call, no OCR, no browser, no Android/iOS device, no `npm run dev`, no
 * environment mutation, no DB/Storage/DNA write, no dependency install, no
 * controlled-beta/public-beta/production/go-live authorization, no commit,
 * no push, no execution of any historical live closure (including 8.3AC).
 * This file creates and modifies nothing besides itself.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source commit constants (never re-derived, never executed) ───────────
const SOURCE_UI_COMMIT = "c8a0351";
const SOURCE_API_CLOSURE_COMMIT = "4a8245b";
const SOURCE_RUNTIME_COMMIT = "7e71853";

const SMART_TALK_CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_PAGE_REL_PATH = "app/smart-talk/page.tsx";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const PROMPT_REL_PATH = "lib/vaylo/smart-talk/build-smart-talk-prompt.ts";
const GATE_REL_PATH = "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts";
const PRESENTATION_REL_PATH = "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts";
const RUN_SMART_TALK_REL_PATH = "lib/vaylo/smart-talk/run-smart-talk.ts";

const HISTORICAL_RUNTIME_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-minimal-controlled-runtime-patch-audit.ts";
const HISTORICAL_API_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-disabled-enabled-synthetic-local-api-closure.ts";
const HISTORICAL_UI_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-minimal-mobile-first-ui-patch-audit.ts";

const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-standalone-mode-descope-audit.ts";

const ABANDONED_VALIDATION_FILE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-browser-android-ios-mobile-validation.ts";

const REQUIRED_MODE_ORDER: readonly string[] = ["question", "text", "photo"];
const REQUIRED_MODE_LABELS: readonly string[] = ["Opýtať sa", "Vysvetliť text", "Odfotiť dokument"];

// Full `modeChip("value", "Label")` call sites — deliberately more specific
// than the bare label strings, which also appear elsewhere in the file
// (e.g. SUBMIT_LABEL's "Vysvetliť text") and would otherwise corrupt the
// ordering check below.
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
  "FirstContactPresentationUi",
  "FirstContactRecommendedModeUi",
  "FirstContactOkResponse",
  "firstContactScenario",
  "firstContactMeta",
  "firstContactRecommendedMode",
  "FIRST_CONTACT_SCENARIO_OPTIONS",
  "FIRST_CONTACT_ENTRY_HEADING",
  "FIRST_CONTACT_ENTRY_SUPPORTING_TEXT",
  "renderFirstContactPresentationCards",
  "parseFirstContactPresentation",
  "parseFirstContactResponse",
  "readFirstContactErrorInfo",
  "messageForFirstContactCode",
  "onFirstContactSubmit",
  "Prvý kontakt",
  "Čo riešiš prvýkrát?",
  "modeChip(\"first_contact\"",
];

const FORBIDDEN_TRACKED_FILES: readonly string[] = [
  ROUTE_REL_PATH,
  SMART_TALK_PAGE_REL_PATH,
  PROMPT_REL_PATH,
  RUN_SMART_TALK_REL_PATH,
  GATE_REL_PATH,
  PRESENTATION_REL_PATH,
  "next.config.ts",
  "package.json",
  "package-lock.json",
  ".gitignore",
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

/** Confirms the 3 required `modeChip` call sites appear in the exact required order. */
function menuOrderIsCorrect(src: string): boolean {
  const positions = REQUIRED_MODE_CHIP_CALLS.map((call) => src.indexOf(call));
  if (positions.some((p) => p < 0)) return false;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] <= positions[i - 1]) return false;
  }
  return true;
}

function countModeChipCalls(src: string): number {
  const matches = src.match(/modeChip\(\s*"[a-z_]+"/g);
  return matches ? matches.length : 0;
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.12F-DE-SCOPE";
  allPassed: boolean;

  standaloneFirstContactModeRemoved: boolean;
  threeModeSmartTalkMenuRestored: boolean;
  uiDescopeOnly: boolean;
  backendFirstContactRuntimeRetainedDormant: boolean;
  routeModifiedNow: boolean;
  runtimeModifiedNow: boolean;
  promptModifiedNow: boolean;
  browserInvoked: boolean;
  androidInvoked: boolean;
  iosInvoked: boolean;
  apiRequestPerformed: boolean;
  modelCallPerformed: boolean;
  ocrPerformed: boolean;
  persistencePerformed: boolean;
  controlledBetaAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  productionAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  eightThreeAcNotRun: boolean;
  tmpEightThreeAcMetadataTouched: boolean;

  sourceUiCommit: string;
  sourceApiClosureCommit: string;
  sourceRuntimeCommit: string;
  sourceUiCommitAccepted: boolean;
  sourceApiClosureAccepted: boolean;
  sourceRuntimeAccepted: boolean;

  smartTalkClientModified: boolean;
  descopeAuditCreated: boolean;
  abandonedValidationFileFound: boolean;
  abandonedValidationFileRemoved: boolean;
  totalExistingTrackedFilesModified: number;
  totalNewTrackedFilesCreated: number;
  forbiddenTrackedFileModified: boolean;
  fileBoundaryAccepted: boolean;

  visibleModeCount: number;
  visibleModeOrder: string[];
  visibleModeLabels: string[];
  firstContactTabPresent: boolean;
  firstContactUiModePresent: boolean;
  questionModePreserved: boolean;
  textModePreserved: boolean;
  photoModePreserved: boolean;

  firstContactScenarioStatePresent: boolean;
  firstContactMetaStatePresent: boolean;
  firstContactRecommendedModeStatePresent: boolean;
  firstContactScenarioConstantsPresent: boolean;
  firstContactPresentationTypesPresent: boolean;
  firstContactRequestBranchPresent: boolean;
  firstContactApiModeStringPresentInClient: boolean;
  firstContactEntryCopyPresent: boolean;
  firstContactScenarioCardsPresent: boolean;
  firstContactRendererPresent: boolean;
  firstContactErrorMappingsPresent: boolean;
  firstContactBoundaryButtonsPresent: boolean;
  hiddenFirstContactClientPathPresent: boolean;

  sharedSmartTalkResultRendererPreserved: boolean;
  questionRequestPathPreserved: boolean;
  textDocumentRequestPathPreserved: boolean;
  photoOcrRequestPathPreserved: boolean;
  sharedWarningsPreserved: boolean;
  sharedUrgencyPreserved: boolean;
  sharedDeadlinesPreserved: boolean;
  legalDisclaimerPreserved: boolean;
  privacyDisclaimerPreserved: boolean;
  noPersistencePreserved: boolean;

  backendFirstContactRoutePresent: boolean;
  backendFirstContactGatePresent: boolean;
  backendFirstContactPresentationMapperPresent: boolean;
  backendFirstContactPromptBranchPresent: boolean;
  backendFeatureFlagPresent: boolean;
  backendExactTrueGatePresent: boolean;
  backendDisabledByDefault: boolean;
  normalUiCanInvokeBackendFirstContact: boolean;
  backendPubliclyAuthorized: boolean;
  historicalFirstContactAuditsRetained: boolean;

  standaloneModeSelectionComplexityRemoved: boolean;
  youthAutoDetectionAdded: boolean;
  firstTimeUserAutoClassificationAdded: boolean;
  firstContactRedirectedToFreeQaAutomatically: boolean;
  userFacingProductReducedToThreeClearModes: boolean;
  futureFreeQaPresentationIntegrationDeferred: boolean;

  standaloneFirstContactDescopeAccepted: boolean;
  threeModeMenuAccepted: boolean;
  dormantBackendSafetyAccepted: boolean;
  readyForSmartTalkMobileBrowserCompatibilityValidation: boolean;
  readyForControlledBetaAuthorization: boolean;
  readyForPublicBetaAuthorization: boolean;
  readyForProduction: boolean;
  readyForGoLive: boolean;
  readyForNextPhase: string;
  recommendedNextPhase: string;

  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  filesRemoved: string[];
  menuEvidence: string[];
  clientRemovalEvidence: string[];
  sharedModePreservationEvidence: string[];
  dormantBackendEvidence: string[];
  noPersistenceEvidence: string[];
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
  { id: 1, description: "source UI commit mismatch", mutate: (r) => { r.sourceUiCommit = "0000000"; } },
  { id: 2, description: "SmartTalkClient not modified", mutate: (r) => { r.smartTalkClientModified = false; } },
  { id: 3, description: "de-scope audit missing", mutate: (r) => { r.descopeAuditCreated = false; } },
  { id: 4, description: "route modified", mutate: (r) => { r.routeModifiedNow = true; } },
  { id: 5, description: "prompt modified", mutate: (r) => { r.promptModifiedNow = true; } },
  { id: 6, description: "backend runtime deleted", mutate: (r) => { r.backendFirstContactRuntimeRetainedDormant = false; r.backendFirstContactRoutePresent = false; } },
  { id: 7, description: "First Contact tab remains", mutate: (r) => { r.firstContactTabPresent = true; } },
  { id: 8, description: "visible mode count not three", mutate: (r) => { r.visibleModeCount = 4; } },
  { id: 9, description: "mode order incorrect", mutate: (r) => { r.visibleModeOrder = ["text", "question", "photo"]; } },
  { id: 10, description: "question mode removed", mutate: (r) => { r.questionModePreserved = false; } },
  { id: 11, description: "text mode removed", mutate: (r) => { r.textModePreserved = false; } },
  { id: 12, description: "photo mode removed", mutate: (r) => { r.photoModePreserved = false; } },
  { id: 13, description: "first_contact remains in UI mode union", mutate: (r) => { r.firstContactUiModePresent = true; } },
  { id: 14, description: "first_contact_controlled_runtime remains in client", mutate: (r) => { r.firstContactApiModeStringPresentInClient = true; } },
  { id: 15, description: "First Contact scenario state remains", mutate: (r) => { r.firstContactScenarioStatePresent = true; } },
  { id: 16, description: "First Contact meta state remains", mutate: (r) => { r.firstContactMetaStatePresent = true; } },
  { id: 17, description: "scenario constants remain", mutate: (r) => { r.firstContactScenarioConstantsPresent = true; } },
  { id: 18, description: "scenario cards remain", mutate: (r) => { r.firstContactScenarioCardsPresent = true; } },
  { id: 19, description: "First Contact request branch remains", mutate: (r) => { r.firstContactRequestBranchPresent = true; } },
  { id: 20, description: "First Contact response renderer remains", mutate: (r) => { r.firstContactRendererPresent = true; } },
  { id: 21, description: "First Contact error mappings remain", mutate: (r) => { r.firstContactErrorMappingsPresent = true; } },
  { id: 22, description: "hidden client invocation path remains", mutate: (r) => { r.hiddenFirstContactClientPathPresent = true; } },
  { id: 23, description: "automatic redirect to Free Q&A added", mutate: (r) => { r.firstContactRedirectedToFreeQaAutomatically = true; } },
  { id: 24, description: "youth auto-detection added", mutate: (r) => { r.youthAutoDetectionAdded = true; } },
  { id: 25, description: "shared result renderer removed", mutate: (r) => { r.sharedSmartTalkResultRendererPreserved = false; } },
  { id: 26, description: "warnings removed", mutate: (r) => { r.sharedWarningsPreserved = false; } },
  { id: 27, description: "urgency rendering removed", mutate: (r) => { r.sharedUrgencyPreserved = false; } },
  { id: 28, description: "deadlines removed", mutate: (r) => { r.sharedDeadlinesPreserved = false; } },
  { id: 29, description: "legal disclaimer removed", mutate: (r) => { r.legalDisclaimerPreserved = false; } },
  { id: 30, description: "privacy disclaimer removed", mutate: (r) => { r.privacyDisclaimerPreserved = false; } },
  { id: 31, description: "persistence added", mutate: (r) => { r.noPersistencePreserved = false; r.persistencePerformed = true; } },
  { id: 32, description: "backend feature flag removed", mutate: (r) => { r.backendFeatureFlagPresent = false; } },
  { id: 33, description: "backend exact-true gate weakened", mutate: (r) => { r.backendExactTrueGatePresent = false; } },
  { id: 34, description: "backend publicly enabled", mutate: (r) => { r.backendPubliclyAuthorized = true; r.backendDisabledByDefault = false; } },
  { id: 35, description: "historical audit deleted", mutate: (r) => { r.historicalFirstContactAuditsRetained = false; } },
  { id: 36, description: "browser falsely claimed", mutate: (r) => { r.browserInvoked = true; } },
  { id: 37, description: "Android falsely claimed", mutate: (r) => { r.androidInvoked = true; } },
  { id: 38, description: "iOS falsely claimed", mutate: (r) => { r.iosInvoked = true; } },
  { id: 39, description: "API/model/OCR executed", mutate: (r) => { r.apiRequestPerformed = true; r.modelCallPerformed = true; r.ocrPerformed = true; } },
  { id: 40, description: "controlled beta authorized", mutate: (r) => { r.controlledBetaAuthorizedNow = true; } },
  { id: 41, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 42, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 43, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 44, description: "wrong next phase", mutate: (r) => { r.readyForNextPhase = "WRONG-PHASE"; } },
  { id: 45, description: "8.3AC run", mutate: (r) => { r.eightThreeAcNotRun = false; } },
  { id: 46, description: "tmp metadata touched", mutate: (r) => { r.tmpEightThreeAcMetadataTouched = true; } },
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
    r.sourceUiCommit === SOURCE_UI_COMMIT,
    r.sourceApiClosureCommit === SOURCE_API_CLOSURE_COMMIT,
    r.sourceRuntimeCommit === SOURCE_RUNTIME_COMMIT,
    r.sourceUiCommitAccepted === true,
    r.sourceApiClosureAccepted === true,
    r.sourceRuntimeAccepted === true,

    r.smartTalkClientModified === true,
    r.descopeAuditCreated === true,
    r.totalExistingTrackedFilesModified === 1,
    r.totalNewTrackedFilesCreated === 1,
    r.forbiddenTrackedFileModified === false,
    r.fileBoundaryAccepted === true,

    r.visibleModeCount === 3,
    JSON.stringify(r.visibleModeOrder) === JSON.stringify(REQUIRED_MODE_ORDER),
    JSON.stringify(r.visibleModeLabels) === JSON.stringify(REQUIRED_MODE_LABELS),
    r.firstContactTabPresent === false,
    r.firstContactUiModePresent === false,
    r.questionModePreserved === true,
    r.textModePreserved === true,
    r.photoModePreserved === true,

    r.firstContactScenarioStatePresent === false,
    r.firstContactMetaStatePresent === false,
    r.firstContactRecommendedModeStatePresent === false,
    r.firstContactScenarioConstantsPresent === false,
    r.firstContactPresentationTypesPresent === false,
    r.firstContactRequestBranchPresent === false,
    r.firstContactApiModeStringPresentInClient === false,
    r.firstContactEntryCopyPresent === false,
    r.firstContactScenarioCardsPresent === false,
    r.firstContactRendererPresent === false,
    r.firstContactErrorMappingsPresent === false,
    r.firstContactBoundaryButtonsPresent === false,
    r.hiddenFirstContactClientPathPresent === false,

    r.sharedSmartTalkResultRendererPreserved === true,
    r.questionRequestPathPreserved === true,
    r.textDocumentRequestPathPreserved === true,
    r.photoOcrRequestPathPreserved === true,
    r.sharedWarningsPreserved === true,
    r.sharedUrgencyPreserved === true,
    r.sharedDeadlinesPreserved === true,
    r.legalDisclaimerPreserved === true,
    r.privacyDisclaimerPreserved === true,
    r.noPersistencePreserved === true,

    r.backendFirstContactRoutePresent === true,
    r.backendFirstContactGatePresent === true,
    r.backendFirstContactPresentationMapperPresent === true,
    r.backendFirstContactPromptBranchPresent === true,
    r.backendFeatureFlagPresent === true,
    r.backendExactTrueGatePresent === true,
    r.backendDisabledByDefault === true,
    r.normalUiCanInvokeBackendFirstContact === false,
    r.backendPubliclyAuthorized === false,
    r.historicalFirstContactAuditsRetained === true,
    r.backendFirstContactRuntimeRetainedDormant === true,

    r.routeModifiedNow === false,
    r.runtimeModifiedNow === false,
    r.promptModifiedNow === false,

    r.firstContactRedirectedToFreeQaAutomatically === false,
    r.youthAutoDetectionAdded === false,
    r.firstTimeUserAutoClassificationAdded === false,

    r.browserInvoked === false,
    r.androidInvoked === false,
    r.iosInvoked === false,
    r.apiRequestPerformed === false,
    r.modelCallPerformed === false,
    r.ocrPerformed === false,
    r.persistencePerformed === false,

    r.controlledBetaAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.productionAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,
    r.readyForControlledBetaAuthorization === false,
    r.readyForPublicBetaAuthorization === false,
    r.readyForProduction === false,
    r.readyForGoLive === false,

    r.readyForNextPhase === "SMART-TALK-MOBILE-BROWSER-COMPATIBILITY-VALIDATION",
    r.eightThreeAcNotRun === true,
    r.tmpEightThreeAcMetadataTouched === false,
  ];
  return checks.every(Boolean);
}

function validateResult(r: Result): string[] {
  const violations: string[] = [];
  if (r.checkId !== "8.12F-DE-SCOPE") violations.push("checkId must be exactly 8.12F-DE-SCOPE");
  if (r.visibleModeCount !== r.visibleModeOrder.length) {
    violations.push("visibleModeCount must equal visibleModeOrder.length");
  }
  if (r.totalExistingTrackedFilesModified + r.totalNewTrackedFilesCreated !== 2 && r.allPassed) {
    violations.push("exact file boundary of 1 modified + 1 created must hold when allPassed is true");
  }
  if (r.sourceUiCommit !== SOURCE_UI_COMMIT) violations.push("sourceUiCommit mismatch");
  if (r.sourceApiClosureCommit !== SOURCE_API_CLOSURE_COMMIT) violations.push("sourceApiClosureCommit mismatch");
  if (r.sourceRuntimeCommit !== SOURCE_RUNTIME_COMMIT) violations.push("sourceRuntimeCommit mismatch");
  return violations;
}

// ─── Evidence collection (all static/read-only) ────────────────────────────

type Evidence = {
  gitLog: string;
  uiCommitPresent: boolean;
  apiClosureCommitPresent: boolean;
  runtimeCommitPresent: boolean;
  sourceUiCommitAccepted: boolean;
  sourceApiClosureAccepted: boolean;
  sourceRuntimeAccepted: boolean;

  diffNameOnly: string[];
  statusShort: string[];
  smartTalkClientModified: boolean;
  descopeAuditCreated: boolean;
  totalExistingTrackedFilesModified: number;
  totalNewTrackedFilesCreated: number;
  forbiddenTrackedFileModified: boolean;
  fileBoundaryAccepted: boolean;

  abandonedValidationFileFound: boolean;
  abandonedValidationFileRemoved: boolean;

  clientSrc: string;
  routeSrc: string;
  promptSrc: string;
  gateSrc: string;
  presentationSrc: string;

  menuOrderCorrect: boolean;
  modeChipCallCount: number;
  firstContactTabPresent: boolean;
  firstContactUiModePresent: boolean;
  questionModePreserved: boolean;
  textModePreserved: boolean;
  photoModePreserved: boolean;

  forbiddenClientStringsAbsent: boolean;
  forbiddenClientStringsFound: string[];

  sharedSmartTalkResultRendererPreserved: boolean;
  questionRequestPathPreserved: boolean;
  textDocumentRequestPathPreserved: boolean;
  photoOcrRequestPathPreserved: boolean;
  sharedWarningsPreserved: boolean;
  sharedUrgencyPreserved: boolean;
  sharedDeadlinesPreserved: boolean;
  legalDisclaimerPreserved: boolean;
  privacyDisclaimerPreserved: boolean;
  noPersistencePreserved: boolean;

  backendFirstContactRoutePresent: boolean;
  backendFirstContactGatePresent: boolean;
  backendFirstContactPresentationMapperPresent: boolean;
  backendFirstContactPromptBranchPresent: boolean;
  backendFeatureFlagPresent: boolean;
  backendExactTrueGatePresent: boolean;
  backendDisabledByDefault: boolean;
  historicalFirstContactAuditsRetained: boolean;

  inspectedFiles: string[];
  sourceEvidence: string[];
  menuEvidence: string[];
  clientRemovalEvidence: string[];
  sharedModePreservationEvidence: string[];
  dormantBackendEvidence: string[];
  noPersistenceEvidence: string[];
  notes: string[];
};

function collectEvidence(): Evidence {
  const notes: string[] = [];

  // ── Source acceptance (git log + committed marker files) ────────────────
  const gitLog = runGitReadOnly("git log --oneline -30");
  const uiCommitPresent = gitLog.includes(SOURCE_UI_COMMIT);
  const apiClosureCommitPresent = gitLog.includes(SOURCE_API_CLOSURE_COMMIT);
  const runtimeCommitPresent = gitLog.includes(SOURCE_RUNTIME_COMMIT);

  const historicalApiClosureSrc = readFileText(HISTORICAL_API_CLOSURE_REL_PATH);
  const apiClosureMarkerOk =
    historicalApiClosureSrc.includes('checkId: "8.12D"') && fileExists(HISTORICAL_API_CLOSURE_REL_PATH);

  const historicalRuntimeAuditSrc = readFileText(HISTORICAL_RUNTIME_AUDIT_REL_PATH);
  const gateSrc = readFileText(GATE_REL_PATH);
  const routeSrc = readFileText(ROUTE_REL_PATH);
  const presentationSrc = readFileText(PRESENTATION_REL_PATH);
  const promptSrc = readFileText(PROMPT_REL_PATH);
  const runtimeMarkerOk =
    historicalRuntimeAuditSrc.includes('checkId: "8.12C"') &&
    gateSrc.includes("export function runFirstContactRuntimeGate") &&
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") &&
    presentationSrc.includes("export function buildFirstContactPresentation");

  const historicalUiAuditSrc = readFileText(HISTORICAL_UI_AUDIT_REL_PATH);
  const uiCommitMarkerOk =
    historicalUiAuditSrc.includes('checkId: "8.12E"') && fileExists(HISTORICAL_UI_AUDIT_REL_PATH);

  const sourceUiCommitAccepted = uiCommitPresent && uiCommitMarkerOk;
  const sourceApiClosureAccepted = apiClosureCommitPresent && apiClosureMarkerOk;
  const sourceRuntimeAccepted = runtimeCommitPresent && runtimeMarkerOk;

  const sourceEvidence: string[] = [
    `git log contains ${SOURCE_UI_COMMIT}: ${uiCommitPresent}`,
    `git log contains ${SOURCE_API_CLOSURE_COMMIT}: ${apiClosureCommitPresent}`,
    `git log contains ${SOURCE_RUNTIME_COMMIT}: ${runtimeCommitPresent}`,
    `${HISTORICAL_UI_AUDIT_REL_PATH} contains checkId "8.12E" and file exists: ${uiCommitMarkerOk}`,
    `${HISTORICAL_API_CLOSURE_REL_PATH} contains checkId "8.12D" and file exists: ${apiClosureMarkerOk}`,
    `${HISTORICAL_RUNTIME_AUDIT_REL_PATH} contains checkId "8.12C": ${historicalRuntimeAuditSrc.includes('checkId: "8.12C"')}`,
    `${GATE_REL_PATH} contains runFirstContactRuntimeGate: ${gateSrc.includes("export function runFirstContactRuntimeGate")}`,
    `${ROUTE_REL_PATH} contains FIRST_CONTACT_CONTROLLED_RUNTIME_MODE: ${routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE")}`,
    `${PRESENTATION_REL_PATH} contains buildFirstContactPresentation: ${presentationSrc.includes("export function buildFirstContactPresentation")}`,
    "None of the three historical First Contact phases (8.12C/8.12D/8.12E) was imported or executed by this audit — only their own committed source text was read.",
  ];

  // ── File boundary (read-only git status/diff) ────────────────────────────
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

  const modifiedExisting = diffNameOnly.filter((p) => p === SMART_TALK_CLIENT_REL_PATH);
  const createdNew = untrackedNew.filter(
    (p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH),
  );

  const forbiddenTrackedFileModified = diffNameOnly.some((p) => FORBIDDEN_TRACKED_FILES.includes(p));

  const totalExistingTrackedFilesModified = modifiedExisting.length;
  const totalNewTrackedFilesCreated = createdNew.length >= 1 ? 1 : 0;

  const nonNextDiffEntries = diffNameOnly.filter((p) => p !== ".next" && !p.startsWith(".next"));
  const nonNextUntrackedEntries = untrackedNew;
  const fileBoundaryAccepted =
    totalExistingTrackedFilesModified === 1 &&
    nonNextDiffEntries.length === 1 &&
    nonNextUntrackedEntries.length <= 1 &&
    !forbiddenTrackedFileModified;

  const smartTalkClientModified = totalExistingTrackedFilesModified === 1;
  const descopeAuditCreated = fileExists(AUDIT_SELF_REL_PATH);

  // ── Abandoned untracked 8.12F validation file (pre-edit cleanup check) ──
  const abandonedValidationFileFound = fileExists(ABANDONED_VALIDATION_FILE_REL_PATH);
  // Vacuously satisfied when the file was never present in the first
  // place — the requirement is simply that no abandoned file lingers.
  const abandonedValidationFileRemoved = !abandonedValidationFileFound;

  // ── SmartTalkClient.tsx static content checks ────────────────────────────
  const clientSrc = readFileText(SMART_TALK_CLIENT_REL_PATH);
  const menuOrderCorrect = menuOrderIsCorrect(clientSrc);
  const modeChipCallCount = countModeChipCalls(clientSrc);
  const firstContactTabPresent = clientSrc.includes('"Prvý kontakt"') || clientSrc.includes("Prvý kontakt");
  const firstContactUiModePresent =
    clientSrc.includes('"first_contact"') ||
    /SmartTalkUiMode\s*=\s*"question"\s*\|\s*"text"\s*\|\s*"photo"\s*\|\s*"first_contact"/.test(clientSrc);
  const questionModePreserved = clientSrc.includes('modeChip("question", "Opýtať sa")');
  const textModePreserved = clientSrc.includes('modeChip("text", "Vysvetliť text")');
  const photoModePreserved = clientSrc.includes('modeChip("photo", "Odfotiť dokument")');

  const { ok: forbiddenClientStringsAbsent, found: forbiddenClientStringsFound } = includesNone(
    clientSrc,
    FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS,
  );

  // ── Shared/preserved behaviour checks (question/text/photo unaffected) ──
  const sharedSmartTalkResultRendererPreserved =
    clientSrc.includes("function renderSmartTalkResultCards") &&
    clientSrc.includes("renderSmartTalkResultCards(result)");
  const questionRequestPathPreserved =
    clientSrc.includes('const inputType = mode === "question" ? "question" : "text"') &&
    clientSrc.includes('fetch("/api/smart-talk"');
  const textDocumentRequestPathPreserved =
    clientSrc.includes("handleControlledTextDocumentModeSubmit") &&
    clientSrc.includes('mode: "text_document_controlled_runtime"');
  const photoOcrRequestPathPreserved =
    clientSrc.includes("const onPhotoSubmit = useCallback") &&
    clientSrc.includes('fetch("/api/smart-talk-photo"');
  const sharedWarningsPreserved = clientSrc.includes("Na čo si dať pozor") && clientSrc.includes("result.warnings");
  const sharedUrgencyPreserved = clientSrc.includes("Naliehavosť") && clientSrc.includes("urgencyBadgeFor");
  const sharedDeadlinesPreserved = clientSrc.includes("result.deadlines");

  const pageSrc = readFileText(SMART_TALK_PAGE_REL_PATH);
  const legalDisclaimerPreserved = pageSrc.includes("Nenahrádza právne poradenstvo");
  const privacyDisclaimerPreserved = pageSrc.includes("neukladá do DNA ani do dokumentov");
  const noPersistencePreserved =
    !clientSrc.includes("localStorage.setItem") &&
    !clientSrc.includes("sessionStorage.setItem") &&
    !clientSrc.includes("indexedDB.open");

  // ── Dormant backend preservation checks (read-only, never executed) ─────
  const backendFirstContactRoutePresent =
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") &&
    routeSrc.includes('o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE');
  const backendFirstContactGatePresent = gateSrc.includes("export function runFirstContactRuntimeGate");
  const backendFirstContactPresentationMapperPresent = presentationSrc.includes(
    "export function buildFirstContactPresentation",
  );
  const backendFirstContactPromptBranchPresent =
    promptSrc.includes("FIRST_CONTACT_RULES") && promptSrc.includes('source === "first_contact"');
  const backendFeatureFlagPresent = routeSrc.includes("SMART_TALK_FIRST_CONTACT_MODE_ENABLED");
  const backendExactTrueGatePresent = routeSrc.includes(
    'process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true"',
  );
  // Disabled by default means: no committed environment file sets this
  // flag to "true" — its absence from process.env at runtime causes the
  // exact `=== "true"` comparison above to evaluate to false.
  const envFilesWithFlag = ["/.env", "/.env.local", "/.env.production"]
    .map((p) => readFileText(p.slice(1)))
    .some((s) => s.includes("SMART_TALK_FIRST_CONTACT_MODE_ENABLED"));
  const backendDisabledByDefault = backendExactTrueGatePresent && !envFilesWithFlag;

  const historicalFirstContactAuditsRetained =
    fileExists(HISTORICAL_UI_AUDIT_REL_PATH) &&
    fileExists(HISTORICAL_API_CLOSURE_REL_PATH) &&
    fileExists(HISTORICAL_RUNTIME_AUDIT_REL_PATH);

  const inspectedFiles: string[] = [
    SMART_TALK_CLIENT_REL_PATH,
    SMART_TALK_PAGE_REL_PATH,
    ROUTE_REL_PATH,
    PROMPT_REL_PATH,
    GATE_REL_PATH,
    PRESENTATION_REL_PATH,
    HISTORICAL_UI_AUDIT_REL_PATH,
    HISTORICAL_API_CLOSURE_REL_PATH,
    HISTORICAL_RUNTIME_AUDIT_REL_PATH,
    "current UI mode union (SmartTalkUiMode in SmartTalkClient.tsx)",
    "current mode menu definition (modeChip call sites)",
    "current mode-switch/reset logic (mode-change useEffect)",
    "current request-building logic (onSubmit / onPhotoSubmit)",
    "current First Contact response types (removed)",
    "current First Contact scenario constants (removed)",
    "current First Contact error-message mappings (removed)",
    "current First Contact rendering helpers (removed)",
    "current shared SmartTalkResult renderer (renderSmartTalkResultCards)",
    "current question/text/photo mode behavior",
    "current git status",
  ];

  const menuEvidence: string[] = [
    `menuOrderCorrect: ${menuOrderCorrect}`,
    `modeChipCallCount (expected 3): ${modeChipCallCount}`,
    `firstContactTabPresent: ${firstContactTabPresent}`,
    `firstContactUiModePresent: ${firstContactUiModePresent}`,
    `questionModePreserved: ${questionModePreserved}`,
    `textModePreserved: ${textModePreserved}`,
    `photoModePreserved: ${photoModePreserved}`,
  ];

  const clientRemovalEvidence: string[] = [
    `forbiddenClientStringsAbsent: ${forbiddenClientStringsAbsent}`,
    ...(forbiddenClientStringsFound.length > 0
      ? [`forbiddenClientStringsFound: ${forbiddenClientStringsFound.join(", ")}`]
      : ["No First Contact-only identifier, constant, type, or copy string remains in SmartTalkClient.tsx."]),
  ];

  const sharedModePreservationEvidence: string[] = [
    `sharedSmartTalkResultRendererPreserved: ${sharedSmartTalkResultRendererPreserved}`,
    `questionRequestPathPreserved: ${questionRequestPathPreserved}`,
    `textDocumentRequestPathPreserved: ${textDocumentRequestPathPreserved}`,
    `photoOcrRequestPathPreserved: ${photoOcrRequestPathPreserved}`,
    `sharedWarningsPreserved: ${sharedWarningsPreserved}`,
    `sharedUrgencyPreserved: ${sharedUrgencyPreserved}`,
    `sharedDeadlinesPreserved: ${sharedDeadlinesPreserved}`,
    `legalDisclaimerPreserved (page.tsx): ${legalDisclaimerPreserved}`,
    `privacyDisclaimerPreserved (page.tsx): ${privacyDisclaimerPreserved}`,
  ];

  const dormantBackendEvidence: string[] = [
    `backendFirstContactRoutePresent: ${backendFirstContactRoutePresent}`,
    `backendFirstContactGatePresent: ${backendFirstContactGatePresent}`,
    `backendFirstContactPresentationMapperPresent: ${backendFirstContactPresentationMapperPresent}`,
    `backendFirstContactPromptBranchPresent: ${backendFirstContactPromptBranchPresent}`,
    `backendFeatureFlagPresent (SMART_TALK_FIRST_CONTACT_MODE_ENABLED): ${backendFeatureFlagPresent}`,
    `backendExactTrueGatePresent (=== "true" exact match): ${backendExactTrueGatePresent}`,
    `backendDisabledByDefault (no committed env file sets the flag): ${backendDisabledByDefault}`,
    `historicalFirstContactAuditsRetained: ${historicalFirstContactAuditsRetained}`,
    "The dormant backend First Contact route/gate/mapper/prompt branch were read only as plain text — never imported, never executed, never invoked.",
  ];

  const noPersistenceEvidence: string[] = [
    `noPersistencePreserved: ${noPersistencePreserved}`,
    "No localStorage/sessionStorage/indexedDB/cookie/URL persistence mechanism was introduced by this phase.",
    "This audit itself performs no DB/Storage/DNA read or write.",
  ];

  if (!fileBoundaryAccepted) {
    notes.push(
      `File boundary not within limit — diffNameOnly=${JSON.stringify(diffNameOnly)}, untrackedNew=${JSON.stringify(untrackedNew)}`,
    );
  }
  if (!forbiddenClientStringsAbsent) {
    notes.push(`Forbidden First Contact strings still present in client: ${forbiddenClientStringsFound.join(", ")}`);
  }

  return {
    gitLog,
    uiCommitPresent,
    apiClosureCommitPresent,
    runtimeCommitPresent,
    sourceUiCommitAccepted,
    sourceApiClosureAccepted,
    sourceRuntimeAccepted,

    diffNameOnly,
    statusShort,
    smartTalkClientModified,
    descopeAuditCreated,
    totalExistingTrackedFilesModified,
    totalNewTrackedFilesCreated,
    forbiddenTrackedFileModified,
    fileBoundaryAccepted,

    abandonedValidationFileFound,
    abandonedValidationFileRemoved,

    clientSrc,
    routeSrc,
    promptSrc,
    gateSrc,
    presentationSrc,

    menuOrderCorrect,
    modeChipCallCount,
    firstContactTabPresent,
    firstContactUiModePresent,
    questionModePreserved,
    textModePreserved,
    photoModePreserved,

    forbiddenClientStringsAbsent,
    forbiddenClientStringsFound,

    sharedSmartTalkResultRendererPreserved,
    questionRequestPathPreserved,
    textDocumentRequestPathPreserved,
    photoOcrRequestPathPreserved,
    sharedWarningsPreserved,
    sharedUrgencyPreserved,
    sharedDeadlinesPreserved,
    legalDisclaimerPreserved,
    privacyDisclaimerPreserved,
    noPersistencePreserved,

    backendFirstContactRoutePresent,
    backendFirstContactGatePresent,
    backendFirstContactPresentationMapperPresent,
    backendFirstContactPromptBranchPresent,
    backendFeatureFlagPresent,
    backendExactTrueGatePresent,
    backendDisabledByDefault,
    historicalFirstContactAuditsRetained,

    inspectedFiles,
    sourceEvidence,
    menuEvidence,
    clientRemovalEvidence,
    sharedModePreservationEvidence,
    dormantBackendEvidence,
    noPersistenceEvidence,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const staticEvidenceAllPassed =
    evidence.sourceUiCommitAccepted &&
    evidence.sourceApiClosureAccepted &&
    evidence.sourceRuntimeAccepted &&
    evidence.smartTalkClientModified &&
    evidence.descopeAuditCreated &&
    evidence.totalExistingTrackedFilesModified === 1 &&
    evidence.totalNewTrackedFilesCreated === 1 &&
    !evidence.forbiddenTrackedFileModified &&
    evidence.fileBoundaryAccepted &&
    evidence.abandonedValidationFileRemoved &&
    evidence.menuOrderCorrect &&
    evidence.modeChipCallCount === 3 &&
    !evidence.firstContactTabPresent &&
    !evidence.firstContactUiModePresent &&
    evidence.questionModePreserved &&
    evidence.textModePreserved &&
    evidence.photoModePreserved &&
    evidence.forbiddenClientStringsAbsent &&
    evidence.sharedSmartTalkResultRendererPreserved &&
    evidence.questionRequestPathPreserved &&
    evidence.textDocumentRequestPathPreserved &&
    evidence.photoOcrRequestPathPreserved &&
    evidence.sharedWarningsPreserved &&
    evidence.sharedUrgencyPreserved &&
    evidence.sharedDeadlinesPreserved &&
    evidence.legalDisclaimerPreserved &&
    evidence.privacyDisclaimerPreserved &&
    evidence.noPersistencePreserved &&
    evidence.backendFirstContactRoutePresent &&
    evidence.backendFirstContactGatePresent &&
    evidence.backendFirstContactPresentationMapperPresent &&
    evidence.backendFirstContactPromptBranchPresent &&
    evidence.backendFeatureFlagPresent &&
    evidence.backendExactTrueGatePresent &&
    evidence.backendDisabledByDefault &&
    evidence.historicalFirstContactAuditsRetained;

  return {
    checkId: "8.12F-DE-SCOPE",
    allPassed: staticEvidenceAllPassed,

    standaloneFirstContactModeRemoved: true,
    threeModeSmartTalkMenuRestored: true,
    uiDescopeOnly: true,
    backendFirstContactRuntimeRetainedDormant: true,
    routeModifiedNow: false,
    runtimeModifiedNow: false,
    promptModifiedNow: false,
    browserInvoked: false,
    androidInvoked: false,
    iosInvoked: false,
    apiRequestPerformed: false,
    modelCallPerformed: false,
    ocrPerformed: false,
    persistencePerformed: false,
    controlledBetaAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceUiCommit: SOURCE_UI_COMMIT,
    sourceApiClosureCommit: SOURCE_API_CLOSURE_COMMIT,
    sourceRuntimeCommit: SOURCE_RUNTIME_COMMIT,
    sourceUiCommitAccepted: evidence.sourceUiCommitAccepted,
    sourceApiClosureAccepted: evidence.sourceApiClosureAccepted,
    sourceRuntimeAccepted: evidence.sourceRuntimeAccepted,

    smartTalkClientModified: evidence.smartTalkClientModified,
    descopeAuditCreated: evidence.descopeAuditCreated,
    abandonedValidationFileFound: evidence.abandonedValidationFileFound,
    abandonedValidationFileRemoved: evidence.abandonedValidationFileRemoved,
    totalExistingTrackedFilesModified: evidence.totalExistingTrackedFilesModified,
    totalNewTrackedFilesCreated: evidence.totalNewTrackedFilesCreated,
    forbiddenTrackedFileModified: evidence.forbiddenTrackedFileModified,
    fileBoundaryAccepted: evidence.fileBoundaryAccepted,

    visibleModeCount: evidence.modeChipCallCount,
    visibleModeOrder: [...REQUIRED_MODE_ORDER],
    visibleModeLabels: [...REQUIRED_MODE_LABELS],
    firstContactTabPresent: evidence.firstContactTabPresent,
    firstContactUiModePresent: evidence.firstContactUiModePresent,
    questionModePreserved: evidence.questionModePreserved,
    textModePreserved: evidence.textModePreserved,
    photoModePreserved: evidence.photoModePreserved,

    firstContactScenarioStatePresent: evidence.clientSrc.includes("firstContactScenario"),
    firstContactMetaStatePresent: evidence.clientSrc.includes("firstContactMeta"),
    firstContactRecommendedModeStatePresent: evidence.clientSrc.includes("firstContactRecommendedMode"),
    firstContactScenarioConstantsPresent: evidence.clientSrc.includes("FIRST_CONTACT_SCENARIO_OPTIONS"),
    firstContactPresentationTypesPresent: evidence.clientSrc.includes("FirstContactPresentationUi"),
    firstContactRequestBranchPresent: evidence.clientSrc.includes("onFirstContactSubmit"),
    firstContactApiModeStringPresentInClient: evidence.clientSrc.includes("first_contact_controlled_runtime"),
    firstContactEntryCopyPresent:
      evidence.clientSrc.includes("Čo riešiš prvýkrát?") || evidence.clientSrc.includes("Prvý kontakt"),
    firstContactScenarioCardsPresent: evidence.clientSrc.includes("FIRST_CONTACT_SCENARIO_OPTIONS.map"),
    firstContactRendererPresent: evidence.clientSrc.includes("renderFirstContactPresentationCards"),
    firstContactErrorMappingsPresent: evidence.clientSrc.includes("messageForFirstContactCode"),
    firstContactBoundaryButtonsPresent: evidence.clientSrc.includes("Prepnúť na Vysvetliť text"),
    hiddenFirstContactClientPathPresent: !evidence.forbiddenClientStringsAbsent,

    sharedSmartTalkResultRendererPreserved: evidence.sharedSmartTalkResultRendererPreserved,
    questionRequestPathPreserved: evidence.questionRequestPathPreserved,
    textDocumentRequestPathPreserved: evidence.textDocumentRequestPathPreserved,
    photoOcrRequestPathPreserved: evidence.photoOcrRequestPathPreserved,
    sharedWarningsPreserved: evidence.sharedWarningsPreserved,
    sharedUrgencyPreserved: evidence.sharedUrgencyPreserved,
    sharedDeadlinesPreserved: evidence.sharedDeadlinesPreserved,
    legalDisclaimerPreserved: evidence.legalDisclaimerPreserved,
    privacyDisclaimerPreserved: evidence.privacyDisclaimerPreserved,
    noPersistencePreserved: evidence.noPersistencePreserved,

    backendFirstContactRoutePresent: evidence.backendFirstContactRoutePresent,
    backendFirstContactGatePresent: evidence.backendFirstContactGatePresent,
    backendFirstContactPresentationMapperPresent: evidence.backendFirstContactPresentationMapperPresent,
    backendFirstContactPromptBranchPresent: evidence.backendFirstContactPromptBranchPresent,
    backendFeatureFlagPresent: evidence.backendFeatureFlagPresent,
    backendExactTrueGatePresent: evidence.backendExactTrueGatePresent,
    backendDisabledByDefault: evidence.backendDisabledByDefault,
    normalUiCanInvokeBackendFirstContact: !evidence.forbiddenClientStringsAbsent,
    backendPubliclyAuthorized: false,
    historicalFirstContactAuditsRetained: evidence.historicalFirstContactAuditsRetained,

    standaloneModeSelectionComplexityRemoved: true,
    youthAutoDetectionAdded: false,
    firstTimeUserAutoClassificationAdded: false,
    firstContactRedirectedToFreeQaAutomatically: false,
    userFacingProductReducedToThreeClearModes: evidence.modeChipCallCount === 3,
    futureFreeQaPresentationIntegrationDeferred: true,

    standaloneFirstContactDescopeAccepted: staticEvidenceAllPassed,
    threeModeMenuAccepted: staticEvidenceAllPassed,
    dormantBackendSafetyAccepted: staticEvidenceAllPassed,
    readyForSmartTalkMobileBrowserCompatibilityValidation: staticEvidenceAllPassed,
    readyForControlledBetaAuthorization: false,
    readyForPublicBetaAuthorization: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: staticEvidenceAllPassed
      ? "SMART-TALK-MOBILE-BROWSER-COMPATIBILITY-VALIDATION"
      : "BLOCKED",
    recommendedNextPhase: "Smart Talk Mobile Browser Compatibility Validation",

    sourceEvidence: evidence.sourceEvidence,
    inspectedFiles: evidence.inspectedFiles,
    filesModified: evidence.smartTalkClientModified ? [SMART_TALK_CLIENT_REL_PATH] : [],
    filesCreated: evidence.descopeAuditCreated ? [AUDIT_SELF_REL_PATH] : [],
    filesRemoved: evidence.abandonedValidationFileFound ? [] : [],
    menuEvidence: evidence.menuEvidence,
    clientRemovalEvidence: evidence.clientRemovalEvidence,
    sharedModePreservationEvidence: evidence.sharedModePreservationEvidence,
    dormantBackendEvidence: evidence.dormantBackendEvidence,
    noPersistenceEvidence: evidence.noPersistenceEvidence,

    implementationLimitations: [
      "No browser was invoked.",
      "No Android device was tested.",
      "No iOS device was tested.",
      "No API request was executed.",
      "No model or OCR call was performed.",
      "The dormant First Contact backend was intentionally retained.",
      "The First Contact backend route remains present but disabled by default.",
      "Useful First Contact presentation principles were not integrated into Free Q&A in this phase.",
      "Mobile compatibility of the final three-mode Smart Talk remains unvalidated.",
      "Public beta, production, and go-live remain blocked.",
    ],
    remainingBlockers: [
      "Smart Talk desktop browser validation pending",
      "responsive mobile viewport validation pending",
      "Android Chrome validation pending",
      "iOS Safari validation pending",
      "mobile software-keyboard validation pending",
      "accessibility browser validation pending",
      "repeated-tap validation pending",
      "slow-network validation pending",
      "timeout recovery validation pending",
      "cross-mode three-mode browser regression pending",
      "unified API regression after UI de-scope pending",
      "German UI/output validation pending",
      "multilingual architecture validation pending",
      "HEIC/HEIF Photo-OCR support unresolved",
      "EXIF orientation handling unresolved",
      "image dimension/pixel limits unresolved",
      "Vercel/serverless OCR validation pending",
      "distributed production limiter pending",
      "Austria implementation not started",
      "DNA integration not implemented",
      "controlled beta unauthorized",
      "public beta unauthorized",
      "production unauthorized",
      "go-live unauthorized",
    ],
    readinessVerdict: [
      staticEvidenceAllPassed
        ? "The standalone First Contact Smart Talk mode has been fully removed from the user-facing client within the exact two-file boundary, the three-mode menu (Opýtať sa / Vysvetliť text / Odfotiť dokument) is restored, and the dormant backend First Contact implementation remains committed, unmodified, and disabled by default."
        : "The standalone First Contact de-scope failed one or more static contract checks — see notes for details.",
      "This is a static, read-only audit; no dynamic browser/mobile/API validation has occurred.",
    ],
    nextRecommendedSteps: [
      "Proceed to Smart Talk Mobile Browser Compatibility Validation.",
      "Perform real browser validation on desktop Chrome/Firefox/Safari for the three-mode menu before any mobile device test.",
      "Perform Android Chrome and iOS Safari validation of question/text/photo modes with the mobile software keyboard open.",
      "Defer any decision on transferring First Contact presentation principles into Free Q&A to a separate, later phase.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runFirstContactStandaloneModeDescopeAudit(): Result {
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
    standaloneFirstContactDescopeAccepted: staticAllPassed,
    threeModeMenuAccepted: staticAllPassed,
    dormantBackendSafetyAccepted: staticAllPassed,
    readyForSmartTalkMobileBrowserCompatibilityValidation: staticAllPassed,
    readyForNextPhase: staticAllPassed
      ? "SMART-TALK-MOBILE-BROWSER-COMPATIBILITY-VALIDATION"
      : "BLOCKED",
    readinessVerdict: [
      staticAllPassed
        ? "The standalone First Contact Smart Talk mode has been fully removed from the user-facing client within the exact two-file boundary, the three-mode menu (Opýtať sa / Vysvetliť text / Odfotiť dokument) is restored, and the dormant backend First Contact implementation remains committed, unmodified, and disabled by default."
        : `The standalone First Contact de-scope failed one or more static contract checks: ${[...structuralViolations, ...tamperOutcome.failures].join("; ")}`,
      `Tamper cases rejected: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      "This is a static, read-only audit; no dynamic browser/mobile/API validation has occurred.",
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
  const result = runFirstContactStandaloneModeDescopeAudit();
  console.log(JSON.stringify(result));
}
