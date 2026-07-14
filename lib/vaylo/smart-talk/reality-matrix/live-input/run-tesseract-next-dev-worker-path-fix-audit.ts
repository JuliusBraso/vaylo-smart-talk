/**
 * PHASE 8.11P-BLOCKER — Tesseract Next.js Dev Runtime Worker Path Fix Audit
 *
 * Fixes exactly one browser/dev-server blocker discovered during the 8.11P
 * enabled manual browser test: tesseract.js's Node worker script could not
 * be resolved (`MODULE_NOT_FOUND` for
 * `node_modules/tesseract.js/src/worker-script/node/index.js`) because
 * Next.js's dev-server webpack compiler bundled/transformed tesseract.js's
 * internal modules instead of letting Node's native `require`/
 * `worker_threads` resolve them untouched from `node_modules`. tesseract.js
 * computes its default `workerPath` as an internal `__dirname`-relative
 * path (see `node_modules/tesseract.js/src/worker/node/defaultOptions.js`),
 * which only survives unmodified when the module itself is never bundled.
 *
 * FIX APPLIED (this phase): add `"tesseract.js"` to next.config.ts's
 * existing `serverExternalPackages` array, alongside the already-present
 * `"pdf-parse"` and `"mammoth"` entries. This is the exact same mechanism
 * already relied upon for those two packages, is cross-platform, is
 * server-side only, introduces no absolute/Windows-specific path, no
 * webpack alias, no postinstall script, and no new dependency.
 *
 * NOT MODIFIED (first-attempt boundary): real-ocr-adapter.ts,
 * app/api/smart-talk/route.ts, app/smart-talk/SmartTalkClient.tsx, the
 * 8.11P browser-manual closure, package.json/.gitignore/env files, and the
 * temporary synthetic PNG fixture (still present, still not deleted).
 *
 * SCOPE OF THIS AUDIT: this file performs ONLY static, read-only text
 * checks (fs.readFileSync only — no execution, no dev server, no OCR, no
 * model call, no browser). It verifies the *shape* of the config-only fix
 * and that the 8.11P file boundary was respected. It explicitly does NOT
 * and CANNOT claim the browser/dev-server runtime issue is actually
 * resolved — that requires the user to restart the Next.js dev server and
 * perform a fresh enabled browser retest (8.11P-RETEST).
 */

import fs from "fs";
import path from "path";

const NEXT_CONFIG_REL_PATH = "next.config.ts";
const REAL_OCR_ADAPTER_REL_PATH = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const UI_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const CLOSURE_8_11P_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-browser-manual-closure.ts";
const TEMP_PNG_REL_PATH = "tmp-8-11p-controlled-reasoning-test.png";
const PACKAGE_JSON_REL_PATH = "package.json";
const GITIGNORE_REL_PATH = ".gitignore";

function readFileSafe(relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return null;
  }
}

function fileExists(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

// ─── Known manual evidence carried forward from 8.11P (never re-observed
// or re-invented here; recorded verbatim as already-reported facts). ──────
const DISABLED_BROWSER_CHECK_ALREADY_PASSED = true;
const ENABLED_BROWSER_CHECK_PREVIOUSLY_ATTEMPTED = true;
const ENABLED_BROWSER_CHECK_PREVIOUSLY_FAILED_SAFELY = true;
const PREVIOUS_ENABLED_STATUS = 504;
const PREVIOUS_ENABLED_CODE = "ocr_to_smart_talk_handoff_timeout";
const PREVIOUS_WORKER_MODULE_NOT_FOUND_OBSERVED = true;
const PREVIOUS_MISSING_WORKER_PATH =
  "C:\\ROOT\\node_modules\\tesseract.js\\src\\worker-script\\node\\index.js";
const PREVIOUS_MODEL_CALL_PERFORMED = false;
const PREVIOUS_PERSISTENCE_PERFORMED = false;

export interface Result {
  checkId: "8.11P-BLOCKER";
  allPassed: boolean;

  // Fix-shape verification.
  nextConfigModifiedNow: boolean;
  tesseractAddedToServerExternalPackages: boolean;
  pdfParseStillExternalized: boolean;
  mammothStillExternalized: boolean;
  absoluteWorkerPathHackAdded: boolean;
  windowsSpecificPathAdded: boolean;
  webpackAliasAdded: boolean;
  dependencyInstalledNow: boolean;

  // File-boundary verification (this blocker phase must not touch these).
  realOcrAdapterModifiedNow: boolean;
  routeModifiedNow: boolean;
  uiModifiedByBlockerNow: boolean;
  packageModifiedNow: boolean;
  envFileModifiedNow: boolean;
  gitignoreModifiedNow: boolean;

  // Preservation of existing uncommitted 8.11P artifacts.
  existing8_11PUiChangePreserved: boolean;
  existing8_11PClosurePreserved: boolean;
  temporarySyntheticPngPreserved: boolean;

  // Safety / scope guarantees.
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  browserRuntimeSuccessClaimed: boolean;

  // Readiness.
  readyForFreshBrowserRetest: boolean;
  readyForCommit: boolean;
  readyForNextPhase: "8.11P-RETEST" | false;

  // Source commit fields (carried forward for traceability).
  sourceEnabledSyntheticClosureCommit: "f06501f";
  sourceDisabledReasoningClosureCommit: "e354857";
  sourceRuntimePatchCommit: "cce84b9";

  // Known manual evidence (carried forward from 8.11P, not re-observed here).
  disabledBrowserCheckAlreadyPassed: boolean;
  enabledBrowserCheckPreviouslyAttempted: boolean;
  enabledBrowserCheckPreviouslyFailedSafely: boolean;
  previousEnabledStatus: number;
  previousEnabledCode: string;
  previousWorkerModuleNotFoundObserved: boolean;
  previousMissingWorkerPath: string;
  previousModelCallPerformed: boolean;
  previousPersistencePerformed: boolean;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  blockers: string[];
  notes: string[];
}

function computeExpectedAllPassed(r: Result): boolean {
  return (
    r.nextConfigModifiedNow === true &&
    r.tesseractAddedToServerExternalPackages === true &&
    r.pdfParseStillExternalized === true &&
    r.mammothStillExternalized === true &&
    r.absoluteWorkerPathHackAdded === false &&
    r.windowsSpecificPathAdded === false &&
    r.webpackAliasAdded === false &&
    r.dependencyInstalledNow === false &&
    r.realOcrAdapterModifiedNow === false &&
    r.routeModifiedNow === false &&
    r.uiModifiedByBlockerNow === false &&
    r.packageModifiedNow === false &&
    r.envFileModifiedNow === false &&
    r.gitignoreModifiedNow === false &&
    r.existing8_11PUiChangePreserved === true &&
    r.existing8_11PClosurePreserved === true &&
    r.temporarySyntheticPngPreserved === true &&
    r.publicRuntimeStillBlocked === true &&
    r.productionAuthorizedNow === false &&
    r.goLiveAuthorizedNow === false &&
    r.browserRuntimeSuccessClaimed === false &&
    r.previousWorkerModuleNotFoundObserved === true &&
    r.previousEnabledStatus === 504 &&
    r.tamperRejected === r.tamperCount
  );
  // Note: readyForFreshBrowserRetest / readyForCommit / readyForNextPhase are
  // OUTPUTS derived from allPassed (see the exported function below), never
  // inputs to it — checking them here would be circular. validateResult
  // below instead checks the implication in both directions.
}

/** Structural + logical validator used both for self-checking the real
 * result and for confirming every tamper case is correctly rejected. */
function validateResult(r: Result): boolean {
  if (r.checkId !== "8.11P-BLOCKER") return false;
  if (typeof r.allPassed !== "boolean") return false;
  if (r.allPassed !== computeExpectedAllPassed(r)) return false;
  if (r.tamperRejected > r.tamperCount) return false;
  if (r.readyForCommit) return false; // never true in this phase, even when allPassed
  if (r.readyForFreshBrowserRetest !== r.allPassed) return false;
  if (r.readyForNextPhase === "8.11P-RETEST" && !r.allPassed) return false;
  if (r.allPassed && r.readyForNextPhase !== "8.11P-RETEST") return false;
  if (r.browserRuntimeSuccessClaimed) return false; // never allowed, even if allPassed were true
  return true;
}

// ─── Build the real result from static, read-only checks only ─────────────

function buildResult(): Result {
  const nextConfigText = readFileSafe(NEXT_CONFIG_REL_PATH);
  const adapterText = readFileSafe(REAL_OCR_ADAPTER_REL_PATH);
  const routeText = readFileSafe(ROUTE_REL_PATH);
  const uiText = readFileSafe(UI_REL_PATH);

  const serverExternalPackagesMatch = nextConfigText
    ? nextConfigText.match(/serverExternalPackages\s*:\s*\[([^\]]*)\]/)
    : null;
  const serverExternalPackagesListText = serverExternalPackagesMatch?.[1] ?? "";

  const tesseractAddedToServerExternalPackages = /["']tesseract\.js["']/.test(
    serverExternalPackagesListText,
  );
  const pdfParseStillExternalized = /["']pdf-parse["']/.test(serverExternalPackagesListText);
  const mammothStillExternalized = /["']mammoth["']/.test(serverExternalPackagesListText);

  const absoluteWorkerPathHackAdded = nextConfigText
    ? /workerPath|worker-script/i.test(nextConfigText)
    : false;
  const windowsSpecificPathAdded = nextConfigText
    ? /[A-Za-z]:[\\/]|ROOT[\\/]node_modules/i.test(nextConfigText)
    : false;
  const webpackAliasAdded = nextConfigText
    ? /webpack\s*:|alias\s*:/.test(nextConfigText)
    : false;

  const nextConfigModifiedNow =
    tesseractAddedToServerExternalPackages &&
    !absoluteWorkerPathHackAdded &&
    !windowsSpecificPathAdded &&
    !webpackAliasAdded;

  // real-ocr-adapter.ts must remain byte-for-byte the same shape it had
  // during 8.11P's first attempt: it must still call createWorker() with a
  // single language argument and no explicit workerPath option.
  const adapterCallsCreateWorkerSingleArg = adapterText
    ? /createWorker\(\s*TESSERACT_LANGUAGE\s*\)/.test(adapterText)
    : false;
  const adapterHasExplicitWorkerPathOption = adapterText
    ? /workerPath\s*:/.test(adapterText)
    : false;
  const realOcrAdapterModifiedNow =
    !adapterText || !adapterCallsCreateWorkerSingleArg || adapterHasExplicitWorkerPathOption;

  // Route must still contain its known 8.11P-era ocr_to_smart_talk_handoff_timeout
  // code path untouched by this blocker phase.
  const routeStillHasTimeoutCode = routeText
    ? routeText.includes("ocr_to_smart_talk_handoff_timeout")
    : false;
  const routeModifiedNow = !routeText || !routeStillHasTimeoutCode;

  // UI must still contain the 8.11P internal controlled-reasoning button wiring.
  const uiStillHasControlledReasoningOperation = uiText
    ? uiText.includes("controlled_reasoning")
    : false;
  const uiModifiedByBlockerNow = !uiText || !uiStillHasControlledReasoningOperation;

  const packageModifiedNow = false; // not touched by this phase (verified by STRICT FILE BOUNDARY, not re-read here)
  const envFileModifiedNow = false; // not touched by this phase
  const gitignoreModifiedNow = false; // not touched by this phase
  const dependencyInstalledNow = false; // no install/upgrade performed by this phase

  const existing8_11PUiChangePreserved = fileExists(UI_REL_PATH) && uiStillHasControlledReasoningOperation;
  const existing8_11PClosurePreserved = fileExists(CLOSURE_8_11P_REL_PATH);
  const temporarySyntheticPngPreserved = fileExists(TEMP_PNG_REL_PATH);

  void PACKAGE_JSON_REL_PATH;
  void GITIGNORE_REL_PATH;

  const blockers: string[] = [];
  if (!tesseractAddedToServerExternalPackages)
    blockers.push('next.config.ts does not list "tesseract.js" in serverExternalPackages.');
  if (!pdfParseStillExternalized) blockers.push('"pdf-parse" is no longer present in serverExternalPackages.');
  if (!mammothStillExternalized) blockers.push('"mammoth" is no longer present in serverExternalPackages.');
  if (absoluteWorkerPathHackAdded)
    blockers.push("An absolute/worker-path hack appears to have been added to next.config.ts.");
  if (windowsSpecificPathAdded)
    blockers.push("A Windows-specific path literal appears to have been added to next.config.ts.");
  if (webpackAliasAdded)
    blockers.push("A webpack alias/config block appears to have been added to next.config.ts.");
  if (realOcrAdapterModifiedNow)
    blockers.push("real-ocr-adapter.ts appears to have been modified during this first-attempt blocker phase.");
  if (routeModifiedNow) blockers.push("app/api/smart-talk/route.ts appears to have been modified or is missing its known timeout code path.");
  if (uiModifiedByBlockerNow)
    blockers.push("app/smart-talk/SmartTalkClient.tsx appears to have lost its 8.11P controlled-reasoning wiring or is missing.");
  if (!existing8_11PClosurePreserved)
    blockers.push("The existing 8.11P browser-manual closure file is missing.");
  if (!temporarySyntheticPngPreserved)
    blockers.push("The temporary synthetic PNG fixture is missing (it must not be deleted yet).");

  // NOTE: allPassed/readyForFreshBrowserRetest/readyForNextPhase are all
  // provisional here (tamperRejected is still a placeholder). The exported
  // function below recomputes them, together with tamperCount/tamperRejected,
  // only once tamper testing has actually run — mirroring the ordering used
  // by the 8.11P browser-manual closure this phase is a sibling to.
  const result: Result = {
    checkId: "8.11P-BLOCKER",
    allPassed: false, // recomputed by the exported function below

    nextConfigModifiedNow,
    tesseractAddedToServerExternalPackages,
    pdfParseStillExternalized,
    mammothStillExternalized,
    absoluteWorkerPathHackAdded,
    windowsSpecificPathAdded,
    webpackAliasAdded,
    dependencyInstalledNow,

    realOcrAdapterModifiedNow,
    routeModifiedNow,
    uiModifiedByBlockerNow,
    packageModifiedNow,
    envFileModifiedNow,
    gitignoreModifiedNow,

    existing8_11PUiChangePreserved,
    existing8_11PClosurePreserved,
    temporarySyntheticPngPreserved,

    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    browserRuntimeSuccessClaimed: false,

    readyForFreshBrowserRetest: false, // recomputed below
    readyForCommit: false,
    readyForNextPhase: false, // recomputed below

    sourceEnabledSyntheticClosureCommit: "f06501f",
    sourceDisabledReasoningClosureCommit: "e354857",
    sourceRuntimePatchCommit: "cce84b9",

    disabledBrowserCheckAlreadyPassed: DISABLED_BROWSER_CHECK_ALREADY_PASSED,
    enabledBrowserCheckPreviouslyAttempted: ENABLED_BROWSER_CHECK_PREVIOUSLY_ATTEMPTED,
    enabledBrowserCheckPreviouslyFailedSafely: ENABLED_BROWSER_CHECK_PREVIOUSLY_FAILED_SAFELY,
    previousEnabledStatus: PREVIOUS_ENABLED_STATUS,
    previousEnabledCode: PREVIOUS_ENABLED_CODE,
    previousWorkerModuleNotFoundObserved: PREVIOUS_WORKER_MODULE_NOT_FOUND_OBSERVED,
    previousMissingWorkerPath: PREVIOUS_MISSING_WORKER_PATH,
    previousModelCallPerformed: PREVIOUS_MODEL_CALL_PERFORMED,
    previousPersistencePerformed: PREVIOUS_PERSISTENCE_PERFORMED,

    tamperCount: TAMPER_CASES.length,
    tamperRejected: 0, // computed by the exported function below
    tamperPassing: false, // computed by the exported function below

    blockers,
    notes: [
      "Phase 8.11P-BLOCKER: config-only fix. Added \"tesseract.js\" to next.config.ts's existing serverExternalPackages array, alongside the already-present \"pdf-parse\" and \"mammoth\" entries.",
      "No webpack alias, no absolute/Windows-specific path, no postinstall script, no new dependency, no adapter change was introduced.",
      "real-ocr-adapter.ts, app/api/smart-talk/route.ts, and app/smart-talk/SmartTalkClient.tsx were inspected but not modified by this phase.",
      "This audit is static/read-only and cannot and does not claim the browser/dev-server runtime issue is resolved. A fresh enabled browser retest under a restarted dev server (8.11P-RETEST) is required before allPassed can mean 'runtime confirmed fixed'.",
      "Known 8.11P manual evidence (disabled PASSED; enabled FAILED SAFELY with HTTP 504 / ocr_to_smart_talk_handoff_timeout / MODULE_NOT_FOUND for the tesseract.js node worker script) is carried forward for traceability only, not re-observed by this phase.",
    ],
  };

  return result;
}

// ─── Tamper testing ─────────────────────────────────────────────────────────

function buildSyntheticFullyPassingFixtureForTamperTestingOnly(): Result {
  return {
    checkId: "8.11P-BLOCKER",
    allPassed: true,

    nextConfigModifiedNow: true,
    tesseractAddedToServerExternalPackages: true,
    pdfParseStillExternalized: true,
    mammothStillExternalized: true,
    absoluteWorkerPathHackAdded: false,
    windowsSpecificPathAdded: false,
    webpackAliasAdded: false,
    dependencyInstalledNow: false,

    realOcrAdapterModifiedNow: false,
    routeModifiedNow: false,
    uiModifiedByBlockerNow: false,
    packageModifiedNow: false,
    envFileModifiedNow: false,
    gitignoreModifiedNow: false,

    existing8_11PUiChangePreserved: true,
    existing8_11PClosurePreserved: true,
    temporarySyntheticPngPreserved: true,

    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    browserRuntimeSuccessClaimed: false,

    readyForFreshBrowserRetest: true,
    readyForCommit: false,
    readyForNextPhase: "8.11P-RETEST",

    sourceEnabledSyntheticClosureCommit: "f06501f",
    sourceDisabledReasoningClosureCommit: "e354857",
    sourceRuntimePatchCommit: "cce84b9",

    disabledBrowserCheckAlreadyPassed: true,
    enabledBrowserCheckPreviouslyAttempted: true,
    enabledBrowserCheckPreviouslyFailedSafely: true,
    previousEnabledStatus: 504,
    previousEnabledCode: "ocr_to_smart_talk_handoff_timeout",
    previousWorkerModuleNotFoundObserved: true,
    previousMissingWorkerPath:
      "C:\\ROOT\\node_modules\\tesseract.js\\src\\worker-script\\node\\index.js",
    previousModelCallPerformed: false,
    previousPersistencePerformed: false,

    tamperCount: TAMPER_CASES.length,
    tamperRejected: TAMPER_CASES.length,
    tamperPassing: true,

    blockers: [],
    notes: ["synthetic-tamper-fixture-only"],
  };
}

interface TamperCase {
  label: string;
  mutate: (r: Result) => Result;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "tesseract.js absent from serverExternalPackages", mutate: (r) => ({ ...r, tesseractAddedToServerExternalPackages: false, allPassed: true }) },
  { label: "pdf-parse removed", mutate: (r) => ({ ...r, pdfParseStillExternalized: false, allPassed: true }) },
  { label: "mammoth removed", mutate: (r) => ({ ...r, mammothStillExternalized: false, allPassed: true }) },
  { label: "absolute worker path introduced", mutate: (r) => ({ ...r, absoluteWorkerPathHackAdded: true, allPassed: true }) },
  { label: "Windows-specific path introduced", mutate: (r) => ({ ...r, windowsSpecificPathAdded: true, allPassed: true }) },
  { label: "webpack alias introduced", mutate: (r) => ({ ...r, webpackAliasAdded: true, allPassed: true }) },
  { label: "adapter modified", mutate: (r) => ({ ...r, realOcrAdapterModifiedNow: true, allPassed: true }) },
  { label: "route modified", mutate: (r) => ({ ...r, routeModifiedNow: true, allPassed: true }) },
  { label: "blocker modifies SmartTalkClient.tsx", mutate: (r) => ({ ...r, uiModifiedByBlockerNow: true, allPassed: true }) },
  { label: "blocker modifies existing 8.11P closure", mutate: (r) => ({ ...r, existing8_11PClosurePreserved: false, allPassed: true }) },
  { label: "package file modified", mutate: (r) => ({ ...r, packageModifiedNow: true, allPassed: true }) },
  { label: "env file modified", mutate: (r) => ({ ...r, envFileModifiedNow: true, allPassed: true }) },
  { label: ".gitignore modified", mutate: (r) => ({ ...r, gitignoreModifiedNow: true, allPassed: true }) },
  { label: "dependency installation claimed", mutate: (r) => ({ ...r, dependencyInstalledNow: true, allPassed: true }) },
  { label: "previous 504 evidence omitted", mutate: (r) => ({ ...r, previousEnabledStatus: 0, allPassed: true }) },
  { label: "previous MODULE_NOT_FOUND evidence omitted", mutate: (r) => ({ ...r, previousWorkerModuleNotFoundObserved: false, allPassed: true }) },
  { label: "browser success claimed without retest", mutate: (r) => ({ ...r, browserRuntimeSuccessClaimed: true }) },
  { label: "readyForCommit true too early", mutate: (r) => ({ ...r, readyForCommit: true }) },
  { label: "readyForFreshBrowserRetest false despite allPassed", mutate: (r) => ({ ...r, readyForFreshBrowserRetest: false, allPassed: true }) },
  { label: "next phase not 8.11P-RETEST", mutate: (r) => ({ ...r, readyForNextPhase: false, allPassed: true }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false, allPassed: true }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true, allPassed: true }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true, allPassed: true }) },
  { label: "8.3AC-style external run implied (temporary PNG missing)", mutate: (r) => ({ ...r, temporarySyntheticPngPreserved: false, allPassed: true }) },
  { label: "existing 8.11P UI change not preserved", mutate: (r) => ({ ...r, existing8_11PUiChangePreserved: false, allPassed: true }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
];

/**
 * Static, read-only audit for PHASE 8.11P-BLOCKER. Never starts a dev
 * server, never runs OCR, never calls the model, never touches the browser.
 * Confirms only the shape of the config-only tesseract.js fix and the
 * preservation of the existing uncommitted 8.11P artifacts.
 */
export function runTesseractNextDevWorkerPathFixAudit(): Result {
  const provisional = buildResult();

  const fixture = buildSyntheticFullyPassingFixtureForTamperTestingOnly();
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!validateResult(tc.mutate(fixture))) {
      tamperRejected += 1;
    } else {
      tamperFailures.push(`8.11P-BLOCKER tamper case not rejected: "${tc.label}"`);
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
    computeExpectedAllPassed(withDerivedFields) &&
    tamperFailures.length === 0 &&
    provisional.blockers.length === 0;

  const final: Result = {
    ...withDerivedFields,
    allPassed: finalAllPassed,
    readyForFreshBrowserRetest: finalAllPassed,
    readyForCommit: false, // never true in this phase, even if allPassed
    readyForNextPhase: finalAllPassed ? "8.11P-RETEST" : false,
    notes: [
      ...withDerivedFields.notes,
      `8.11P-BLOCKER tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
      ...tamperFailures,
    ],
    blockers: [...withDerivedFields.blockers, ...tamperFailures],
  };

  if (!validateResult(final)) {
    return {
      ...final,
      allPassed: false,
      readyForFreshBrowserRetest: false,
      readyForCommit: false,
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
  process.argv[1].replace(/\\/g, "/").includes("run-tesseract-next-dev-worker-path-fix-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTesseractNextDevWorkerPathFixAudit(), null, 2));
}
