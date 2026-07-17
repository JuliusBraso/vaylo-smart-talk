/**
 * PHASE 8.13C-BLOCKER — Smart Talk Cross-Mode Input State Isolation Patch
 * Audit (Static, Deterministic)
 *
 * Root cause (confirmed by static inspection prior to the patch): question
 * mode and text-document mode shared a single React state
 * (`const [text, setText] = useState("")`) and a single `<textarea>`
 * bound to it. Switching modes never cleared or isolated this shared
 * state, so text typed in "Opýtať sa" visibly reappeared in
 * "Vysvetliť text" (and vice versa).
 *
 * The fix (already applied to `app/smart-talk/SmartTalkClient.tsx` before
 * this audit runs) replaces the single shared state with two explicitly
 * separate states — `questionInput`/`setQuestionInput` and
 * `textDocumentInput`/`setTextDocumentInput` — and routes every read,
 * write, character count, validation, and submit path through the state
 * that belongs to the currently active mode only. Photo mode never reads
 * either. The pre-existing mode-change `useEffect` (unchanged by this
 * patch) already clears `result`/`error`/`loading` on every mode switch,
 * so no additional result/error-isolation change was necessary or made.
 *
 * This audit performs NO dynamic execution: no route POST, no model call,
 * no OCR, no browser automation, no dev server, no network, no database,
 * no persistence, no environment mutation. It only reads
 * `app/smart-talk/SmartTalkClient.tsx` as plain text via
 * `fs.readFileSync` and runs deterministic string/regex assertions
 * against it, plus read-only `git` commands to confirm exactly the two
 * expected files changed.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "46de625";
const CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-cross-mode-input-state-isolation-patch-audit.ts";

const FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS: readonly string[] = [
  '"first_contact"',
  "first_contact_controlled_runtime",
  "onFirstContactSubmit",
  "Prvý kontakt",
];

const PERSISTENCE_API_PATTERNS: readonly string[] = [
  "localStorage.setItem",
  "localStorage.getItem",
  "sessionStorage.setItem",
  "sessionStorage.getItem",
  "indexedDB.open",
  "document.cookie =",
  "supabase.",
  "Vaylo DNA",
];

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    // Normalize CRLF -> LF so literal multi-line markers match regardless
    // of the working tree's line-ending configuration.
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function includesNone(haystack: string, needles: readonly string[]): { ok: boolean; found: string[] } {
  const found = needles.filter((n) => haystack.includes(n));
  return { ok: found.length === 0, found };
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.13C-BLOCKER";
  allPassed: boolean;

  sourceClosureCommit: string;
  runtimeFileModified: boolean;
  modifiedRuntimeFiles: string[];
  newAuditFileCreated: boolean;
  onlyExpectedFilesChanged: boolean;

  questionInputStateIsolated: boolean;
  textDocumentInputStateIsolated: boolean;
  questionTextareaUsesQuestionState: boolean;
  textTextareaUsesTextDocumentState: boolean;
  questionSubmitUsesQuestionState: boolean;
  textSubmitUsesTextDocumentState: boolean;
  questionCharacterCountUsesQuestionState: boolean;
  textCharacterCountUsesTextDocumentState: boolean;

  modeSwitchDoesNotCopyQuestionToText: boolean;
  modeSwitchDoesNotCopyTextToQuestion: boolean;
  photoModeDoesNotConsumeQuestionState: boolean;
  photoModeDoesNotConsumeTextDocumentState: boolean;
  modeSwitchDoesNotSubmit: boolean;
  modeSwitchDoesNotInvokeOcr: boolean;
  modeSwitchDoesNotInvokeModel: boolean;

  noLocalStorageAdded: boolean;
  noSessionStorageAdded: boolean;
  noIndexedDbAdded: boolean;
  noCookiePersistenceAdded: boolean;
  noUrlPersistenceAdded: boolean;
  noDatabasePersistenceAdded: boolean;

  standaloneFirstContactStillAbsent: boolean;
  dormantFirstContactStillUnreachableFromUi: boolean;

  backendRouteModified: boolean;
  ocrRuntimeModified: boolean;
  governanceModified: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForDesktopResponsiveBrowserValidationRetry: boolean;

  // Supplementary premature/forbidden-claim flags — every one must remain
  // false; tamper cases each flip exactly one to prove rejection.
  sharedInputStateClaimedAcceptable: boolean;
  questionInputClaimedAppearsInTextMode: boolean;
  textInputClaimedAppearsInQuestionMode: boolean;
  photoModeClaimedConsumesSharedTextInput: boolean;
  modeSwitchClaimedCopiesValues: boolean;
  modeSwitchClaimedSubmits: boolean;
  modeSwitchClaimedInvokesOcr: boolean;
  modeSwitchClaimedInvokesModel: boolean;
  questionSubmitClaimedUsesTextDocumentInput: boolean;
  textSubmitClaimedUsesQuestionInput: boolean;
  characterCountersClaimedUseWrongState: boolean;
  validationClaimedReadsWrongState: boolean;
  sharedSetterClaimedUsedForBothTextareas: boolean;
  localStorageDraftPersistenceClaimed: boolean;
  sessionStorageDraftPersistenceClaimed: boolean;
  indexedDbPersistenceClaimed: boolean;
  cookiePersistenceClaimed: boolean;
  urlQueryPersistenceClaimed: boolean;
  databasePersistenceClaimed: boolean;
  supabasePersistenceClaimed: boolean;
  storagePersistenceClaimed: boolean;
  firstContactTabClaimedReintroduced: boolean;
  dormantFirstContactClaimedReachableFromUi: boolean;
  backendRouteClaimedModified: boolean;
  ocrRuntimeClaimedModified: boolean;
  governanceClaimedWeakened: boolean;
  paidBoundaryClaimedWeakened: boolean;
  productionClaimedAuthorized: boolean;
  publicRuntimeClaimedAuthorized: boolean;
  goLiveClaimedAuthorized: boolean;
  unrelatedFileClaimedModified: boolean;
  stylingRedesignClaimedIncluded: boolean;
  dependenciesClaimedAdded: boolean;
  packageJsonClaimedModified: boolean;
  suppressHydrationWarningClaimedAdded: boolean;
  dataCursorRefHandlingClaimedAdded: boolean;
  questionResultClaimedRelabeledAsTextResult: boolean;
  textResultClaimedRelabeledAsQuestionResult: boolean;
  staleCrossModeErrorClaimedAccepted: boolean;
  auditClaimedPassesWithoutIsolatedState: boolean;
  auditClaimedPassesWithUnexpectedFilesChanged: boolean;
  auditClaimedPassesWithPersistenceAdded: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  rootCause: string[];
  patchSummary: string[];
  sourceEvidence: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "claim shared input state remains acceptable", mutate: (r) => { r.sharedInputStateClaimedAcceptable = true; } },
  { id: 2, description: "claim question input appears in text mode", mutate: (r) => { r.questionInputClaimedAppearsInTextMode = true; } },
  { id: 3, description: "claim text input appears in question mode", mutate: (r) => { r.textInputClaimedAppearsInQuestionMode = true; } },
  { id: 4, description: "claim photo mode consumes shared text input", mutate: (r) => { r.photoModeClaimedConsumesSharedTextInput = true; } },
  { id: 5, description: "claim mode switching copies values", mutate: (r) => { r.modeSwitchClaimedCopiesValues = true; } },
  { id: 6, description: "claim mode switching submits", mutate: (r) => { r.modeSwitchClaimedSubmits = true; r.modeSwitchDoesNotSubmit = false; } },
  { id: 7, description: "claim mode switching invokes OCR", mutate: (r) => { r.modeSwitchClaimedInvokesOcr = true; r.modeSwitchDoesNotInvokeOcr = false; } },
  { id: 8, description: "claim mode switching invokes model", mutate: (r) => { r.modeSwitchClaimedInvokesModel = true; r.modeSwitchDoesNotInvokeModel = false; } },
  { id: 9, description: "claim question submit uses text-document input", mutate: (r) => { r.questionSubmitClaimedUsesTextDocumentInput = true; r.questionSubmitUsesQuestionState = false; } },
  { id: 10, description: "claim text submit uses question input", mutate: (r) => { r.textSubmitClaimedUsesQuestionInput = true; r.textSubmitUsesTextDocumentState = false; } },
  { id: 11, description: "claim character counters use the wrong state", mutate: (r) => { r.characterCountersClaimedUseWrongState = true; } },
  { id: 12, description: "claim validation reads the wrong state", mutate: (r) => { r.validationClaimedReadsWrongState = true; } },
  { id: 13, description: "claim one shared setter is used for both textareas", mutate: (r) => { r.sharedSetterClaimedUsedForBothTextareas = true; } },
  { id: 14, description: "claim localStorage draft persistence", mutate: (r) => { r.localStorageDraftPersistenceClaimed = true; r.noLocalStorageAdded = false; } },
  { id: 15, description: "claim sessionStorage draft persistence", mutate: (r) => { r.sessionStorageDraftPersistenceClaimed = true; r.noSessionStorageAdded = false; } },
  { id: 16, description: "claim IndexedDB persistence", mutate: (r) => { r.indexedDbPersistenceClaimed = true; r.noIndexedDbAdded = false; } },
  { id: 17, description: "claim cookie persistence", mutate: (r) => { r.cookiePersistenceClaimed = true; r.noCookiePersistenceAdded = false; } },
  { id: 18, description: "claim URL query persistence", mutate: (r) => { r.urlQueryPersistenceClaimed = true; r.noUrlPersistenceAdded = false; } },
  { id: 19, description: "claim database persistence", mutate: (r) => { r.databasePersistenceClaimed = true; r.noDatabasePersistenceAdded = false; } },
  { id: 20, description: "claim Supabase persistence", mutate: (r) => { r.supabasePersistenceClaimed = true; } },
  { id: 21, description: "claim Storage persistence", mutate: (r) => { r.storagePersistenceClaimed = true; } },
  { id: 22, description: "claim First Contact tab reintroduced", mutate: (r) => { r.firstContactTabClaimedReintroduced = true; r.standaloneFirstContactStillAbsent = false; } },
  { id: 23, description: "claim dormant First Contact reachable from UI", mutate: (r) => { r.dormantFirstContactClaimedReachableFromUi = true; r.dormantFirstContactStillUnreachableFromUi = false; } },
  { id: 24, description: "claim backend route modified", mutate: (r) => { r.backendRouteClaimedModified = true; r.backendRouteModified = true; } },
  { id: 25, description: "claim OCR runtime modified", mutate: (r) => { r.ocrRuntimeClaimedModified = true; r.ocrRuntimeModified = true; } },
  { id: 26, description: "claim governance weakened", mutate: (r) => { r.governanceClaimedWeakened = true; r.governanceModified = true; } },
  { id: 27, description: "claim paid boundary weakened", mutate: (r) => { r.paidBoundaryClaimedWeakened = true; } },
  { id: 28, description: "claim production authorized", mutate: (r) => { r.productionClaimedAuthorized = true; r.productionAuthorizedNow = true; } },
  { id: 29, description: "claim public runtime authorized", mutate: (r) => { r.publicRuntimeClaimedAuthorized = true; r.publicRuntimeAuthorizedNow = true; } },
  { id: 30, description: "claim go-live authorized", mutate: (r) => { r.goLiveClaimedAuthorized = true; r.goLiveAuthorizedNow = true; } },
  { id: 31, description: "claim unrelated file modified", mutate: (r) => { r.unrelatedFileClaimedModified = true; r.onlyExpectedFilesChanged = false; } },
  { id: 32, description: "claim styling redesign included", mutate: (r) => { r.stylingRedesignClaimedIncluded = true; } },
  { id: 33, description: "claim dependencies added", mutate: (r) => { r.dependenciesClaimedAdded = true; } },
  { id: 34, description: "claim package.json modified", mutate: (r) => { r.packageJsonClaimedModified = true; r.onlyExpectedFilesChanged = false; } },
  { id: 35, description: "claim suppressHydrationWarning added", mutate: (r) => { r.suppressHydrationWarningClaimedAdded = true; } },
  { id: 36, description: "claim data-cursor-ref handling added", mutate: (r) => { r.dataCursorRefHandlingClaimedAdded = true; } },
  { id: 37, description: "claim question result relabeled as text result", mutate: (r) => { r.questionResultClaimedRelabeledAsTextResult = true; } },
  { id: 38, description: "claim text result relabeled as question result", mutate: (r) => { r.textResultClaimedRelabeledAsQuestionResult = true; } },
  { id: 39, description: "claim stale cross-mode error accepted", mutate: (r) => { r.staleCrossModeErrorClaimedAccepted = true; } },
  { id: 40, description: "claim audit passes without isolated state", mutate: (r) => { r.auditClaimedPassesWithoutIsolatedState = true; r.questionInputStateIsolated = false; r.textDocumentInputStateIsolated = false; } },
  { id: 41, description: "claim audit passes with unexpected files changed", mutate: (r) => { r.auditClaimedPassesWithUnexpectedFilesChanged = true; r.onlyExpectedFilesChanged = false; } },
  { id: 42, description: "claim audit passes with persistence added", mutate: (r) => { r.auditClaimedPassesWithPersistenceAdded = true; r.noLocalStorageAdded = false; } },
  { id: 43, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "8.13C"; } },
  { id: 44, description: "sourceClosureCommit mismatch", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 45, description: "modifiedRuntimeFiles wrong list", mutate: (r) => { r.modifiedRuntimeFiles = ["app/api/smart-talk/route.ts"]; } },
  { id: 46, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
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
    r.checkId === "8.13C-BLOCKER",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.runtimeFileModified === true,
    JSON.stringify(r.modifiedRuntimeFiles) === JSON.stringify([CLIENT_REL_PATH]),
    r.newAuditFileCreated === true,
    r.onlyExpectedFilesChanged === true,

    r.questionInputStateIsolated === true,
    r.textDocumentInputStateIsolated === true,
    r.questionTextareaUsesQuestionState === true,
    r.textTextareaUsesTextDocumentState === true,
    r.questionSubmitUsesQuestionState === true,
    r.textSubmitUsesTextDocumentState === true,
    r.questionCharacterCountUsesQuestionState === true,
    r.textCharacterCountUsesTextDocumentState === true,

    r.modeSwitchDoesNotCopyQuestionToText === true,
    r.modeSwitchDoesNotCopyTextToQuestion === true,
    r.photoModeDoesNotConsumeQuestionState === true,
    r.photoModeDoesNotConsumeTextDocumentState === true,
    r.modeSwitchDoesNotSubmit === true,
    r.modeSwitchDoesNotInvokeOcr === true,
    r.modeSwitchDoesNotInvokeModel === true,

    r.noLocalStorageAdded === true,
    r.noSessionStorageAdded === true,
    r.noIndexedDbAdded === true,
    r.noCookiePersistenceAdded === true,
    r.noUrlPersistenceAdded === true,
    r.noDatabasePersistenceAdded === true,

    r.standaloneFirstContactStillAbsent === true,
    r.dormantFirstContactStillUnreachableFromUi === true,

    r.backendRouteModified === false,
    r.ocrRuntimeModified === false,
    r.governanceModified === false,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.sharedInputStateClaimedAcceptable === false,
    r.questionInputClaimedAppearsInTextMode === false,
    r.textInputClaimedAppearsInQuestionMode === false,
    r.photoModeClaimedConsumesSharedTextInput === false,
    r.modeSwitchClaimedCopiesValues === false,
    r.modeSwitchClaimedSubmits === false,
    r.modeSwitchClaimedInvokesOcr === false,
    r.modeSwitchClaimedInvokesModel === false,
    r.questionSubmitClaimedUsesTextDocumentInput === false,
    r.textSubmitClaimedUsesQuestionInput === false,
    r.characterCountersClaimedUseWrongState === false,
    r.validationClaimedReadsWrongState === false,
    r.sharedSetterClaimedUsedForBothTextareas === false,
    r.localStorageDraftPersistenceClaimed === false,
    r.sessionStorageDraftPersistenceClaimed === false,
    r.indexedDbPersistenceClaimed === false,
    r.cookiePersistenceClaimed === false,
    r.urlQueryPersistenceClaimed === false,
    r.databasePersistenceClaimed === false,
    r.supabasePersistenceClaimed === false,
    r.storagePersistenceClaimed === false,
    r.firstContactTabClaimedReintroduced === false,
    r.dormantFirstContactClaimedReachableFromUi === false,
    r.backendRouteClaimedModified === false,
    r.ocrRuntimeClaimedModified === false,
    r.governanceClaimedWeakened === false,
    r.paidBoundaryClaimedWeakened === false,
    r.productionClaimedAuthorized === false,
    r.publicRuntimeClaimedAuthorized === false,
    r.goLiveClaimedAuthorized === false,
    r.unrelatedFileClaimedModified === false,
    r.stylingRedesignClaimedIncluded === false,
    r.dependenciesClaimedAdded === false,
    r.packageJsonClaimedModified === false,
    r.suppressHydrationWarningClaimedAdded === false,
    r.dataCursorRefHandlingClaimedAdded === false,
    r.questionResultClaimedRelabeledAsTextResult === false,
    r.textResultClaimedRelabeledAsQuestionResult === false,
    r.staleCrossModeErrorClaimedAccepted === false,
    r.auditClaimedPassesWithoutIsolatedState === false,
    r.auditClaimedPassesWithUnexpectedFilesChanged === false,
    r.auditClaimedPassesWithPersistenceAdded === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// ─── Evidence collection (static source inspection only) ───────────────────

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  modifiedRuntimeFiles: string[];
  newAuditFileCreated: boolean;
  clientSrc: string;
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

  const modifiedRuntimeFiles = diffNameOnly.filter((p) => p === CLIENT_REL_PATH);
  const unexpectedModified = diffNameOnly.filter((p) => p !== CLIENT_REL_PATH);
  const newAuditFileCreated = untrackedNew.some((p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH));
  const unexpectedUntracked = untrackedNew.filter((p) => p !== AUDIT_SELF_REL_PATH && !p.endsWith(AUDIT_SELF_REL_PATH));

  const onlyExpectedFilesChanged =
    unexpectedModified.length === 0 &&
    unexpectedUntracked.length === 0 &&
    diffNameOnly.length === 1 &&
    diffNameOnly[0] === CLIENT_REL_PATH;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const clientSrc = readFileText(CLIENT_REL_PATH);

  return {
    onlyExpectedFilesChanged,
    modifiedRuntimeFiles,
    newAuditFileCreated,
    clientSrc,
    notes,
  };
}

// ─── Function-body extraction helper (for scoping photo-handler checks) ────

function extractFunctionBody(src: string, startMarker: string): string {
  const start = src.indexOf(startMarker);
  if (start < 0) return "";
  let depth = 0;
  let i = start;
  let bodyStart = -1;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") {
      depth += 1;
      if (bodyStart < 0) bodyStart = i;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0 && bodyStart >= 0) {
        return src.slice(bodyStart, i + 1);
      }
    }
  }
  return "";
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const src = evidence.clientSrc;

  const noSharedTextState = !/const \[text, setText\] = useState/.test(src);
  const questionInputStateIsolated =
    src.includes('const [questionInput, setQuestionInput] = useState("")') && noSharedTextState;
  const textDocumentInputStateIsolated =
    src.includes('const [textDocumentInput, setTextDocumentInput] = useState("")') && noSharedTextState;

  const questionTextareaUsesQuestionState =
    src.includes('value={mode === "question" ? questionInput : textDocumentInput}') &&
    src.includes("if (mode === \"question\") setQuestionInput(e.target.value);");
  const textTextareaUsesTextDocumentState =
    src.includes('value={mode === "question" ? questionInput : textDocumentInput}') &&
    src.includes("else setTextDocumentInput(e.target.value);");

  const questionSubmitUsesQuestionState = src.includes(
    'mode === "question" ? questionInput.trim() : textDocumentInput.trim();',
  );
  const textSubmitUsesTextDocumentState =
    questionSubmitUsesQuestionState && src.includes("const trimmed = textDocumentInput.trim();");

  const trimmedLenBlock = /const trimmedLen =\s*mode === "question"\s*\?\s*questionInput\.trim\(\)\.length\s*:\s*mode === "text"\s*\?\s*textDocumentInput\.trim\(\)\.length\s*:\s*0;/;
  const questionCharacterCountUsesQuestionState = trimmedLenBlock.test(src);
  const textCharacterCountUsesTextDocumentState = trimmedLenBlock.test(src);

  const noSharedSetterRemains = !src.includes("setText(") && !/\btext\.trim\(\)/.test(src);
  const modeSwitchDoesNotCopyQuestionToText = noSharedSetterRemains && !src.includes("setTextDocumentInput(questionInput");
  const modeSwitchDoesNotCopyTextToQuestion = noSharedSetterRemains && !src.includes("setQuestionInput(textDocumentInput");

  const modeChipOnClickIsPureSetMode = /onClick=\{\(\) => setMode\(m\)\}/.test(src);
  const modeSwitchEffectBody = extractFunctionBody(src, "useEffect(() => {\n    generationRef.current += 1;");
  const modeSwitchEffectHasNoFetch = modeSwitchEffectBody.length > 0 && !modeSwitchEffectBody.includes("fetch(");
  const modeSwitchDoesNotSubmit = modeChipOnClickIsPureSetMode && modeSwitchEffectHasNoFetch;
  const modeSwitchDoesNotInvokeOcr = modeSwitchDoesNotSubmit && !modeSwitchEffectBody.includes("smart-talk-photo");
  const modeSwitchDoesNotInvokeModel = modeSwitchDoesNotSubmit && !modeSwitchEffectBody.includes("/api/smart-talk");

  const onPhotoSubmitBody = extractFunctionBody(src, "const onPhotoSubmit = useCallback(");
  const photoModeDoesNotConsumeQuestionState = !onPhotoSubmitBody.includes("questionInput");
  const photoModeDoesNotConsumeTextDocumentState = !onPhotoSubmitBody.includes("textDocumentInput");

  const { ok: noPersistenceApiFound, found: persistenceFound } = includesNone(src, PERSISTENCE_API_PATTERNS);
  const noLocalStorageAdded = !persistenceFound.some((p) => p.startsWith("localStorage"));
  const noSessionStorageAdded = !persistenceFound.some((p) => p.startsWith("sessionStorage"));
  const noIndexedDbAdded = !persistenceFound.some((p) => p.startsWith("indexedDB"));
  const noCookiePersistenceAdded = !persistenceFound.some((p) => p.startsWith("document.cookie"));
  const noUrlPersistenceAdded = !src.includes("window.history.pushState") && !src.includes("router.push(`");
  const noDatabasePersistenceAdded = !persistenceFound.some((p) => p.startsWith("supabase.") || p === "Vaylo DNA");

  const { ok: standaloneFirstContactStillAbsent } = includesNone(src, FORBIDDEN_FIRST_CONTACT_CLIENT_STRINGS);
  const dormantFirstContactStillUnreachableFromUi = standaloneFirstContactStillAbsent;

  const noSuppressHydrationWarning = !src.includes("suppressHydrationWarning");

  const allStaticAssertions =
    evidence.onlyExpectedFilesChanged &&
    evidence.newAuditFileCreated &&
    questionInputStateIsolated &&
    textDocumentInputStateIsolated &&
    questionTextareaUsesQuestionState &&
    textTextareaUsesTextDocumentState &&
    questionSubmitUsesQuestionState &&
    textSubmitUsesTextDocumentState &&
    questionCharacterCountUsesQuestionState &&
    textCharacterCountUsesTextDocumentState &&
    modeSwitchDoesNotCopyQuestionToText &&
    modeSwitchDoesNotCopyTextToQuestion &&
    photoModeDoesNotConsumeQuestionState &&
    photoModeDoesNotConsumeTextDocumentState &&
    modeSwitchDoesNotSubmit &&
    modeSwitchDoesNotInvokeOcr &&
    modeSwitchDoesNotInvokeModel &&
    noLocalStorageAdded &&
    noSessionStorageAdded &&
    noIndexedDbAdded &&
    noCookiePersistenceAdded &&
    noUrlPersistenceAdded &&
    noDatabasePersistenceAdded &&
    standaloneFirstContactStillAbsent &&
    dormantFirstContactStillUnreachableFromUi &&
    noSuppressHydrationWarning &&
    noPersistenceApiFound;

  return {
    checkId: "8.13C-BLOCKER",
    allPassed: allStaticAssertions,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    runtimeFileModified: evidence.modifiedRuntimeFiles.length === 1,
    modifiedRuntimeFiles: evidence.modifiedRuntimeFiles,
    newAuditFileCreated: evidence.newAuditFileCreated,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,

    questionInputStateIsolated,
    textDocumentInputStateIsolated,
    questionTextareaUsesQuestionState,
    textTextareaUsesTextDocumentState,
    questionSubmitUsesQuestionState,
    textSubmitUsesTextDocumentState,
    questionCharacterCountUsesQuestionState,
    textCharacterCountUsesTextDocumentState,

    modeSwitchDoesNotCopyQuestionToText,
    modeSwitchDoesNotCopyTextToQuestion,
    photoModeDoesNotConsumeQuestionState,
    photoModeDoesNotConsumeTextDocumentState,
    modeSwitchDoesNotSubmit,
    modeSwitchDoesNotInvokeOcr,
    modeSwitchDoesNotInvokeModel,

    noLocalStorageAdded,
    noSessionStorageAdded,
    noIndexedDbAdded,
    noCookiePersistenceAdded,
    noUrlPersistenceAdded,
    noDatabasePersistenceAdded,

    standaloneFirstContactStillAbsent,
    dormantFirstContactStillUnreachableFromUi,

    backendRouteModified: false,
    ocrRuntimeModified: false,
    governanceModified: false,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForDesktopResponsiveBrowserValidationRetry: allStaticAssertions,

    sharedInputStateClaimedAcceptable: false,
    questionInputClaimedAppearsInTextMode: false,
    textInputClaimedAppearsInQuestionMode: false,
    photoModeClaimedConsumesSharedTextInput: false,
    modeSwitchClaimedCopiesValues: false,
    modeSwitchClaimedSubmits: false,
    modeSwitchClaimedInvokesOcr: false,
    modeSwitchClaimedInvokesModel: false,
    questionSubmitClaimedUsesTextDocumentInput: false,
    textSubmitClaimedUsesQuestionInput: false,
    characterCountersClaimedUseWrongState: false,
    validationClaimedReadsWrongState: false,
    sharedSetterClaimedUsedForBothTextareas: false,
    localStorageDraftPersistenceClaimed: false,
    sessionStorageDraftPersistenceClaimed: false,
    indexedDbPersistenceClaimed: false,
    cookiePersistenceClaimed: false,
    urlQueryPersistenceClaimed: false,
    databasePersistenceClaimed: false,
    supabasePersistenceClaimed: false,
    storagePersistenceClaimed: false,
    firstContactTabClaimedReintroduced: false,
    dormantFirstContactClaimedReachableFromUi: false,
    backendRouteClaimedModified: false,
    ocrRuntimeClaimedModified: false,
    governanceClaimedWeakened: false,
    paidBoundaryClaimedWeakened: false,
    productionClaimedAuthorized: false,
    publicRuntimeClaimedAuthorized: false,
    goLiveClaimedAuthorized: false,
    unrelatedFileClaimedModified: false,
    stylingRedesignClaimedIncluded: false,
    dependenciesClaimedAdded: false,
    packageJsonClaimedModified: false,
    suppressHydrationWarningClaimedAdded: false,
    dataCursorRefHandlingClaimedAdded: false,
    questionResultClaimedRelabeledAsTextResult: false,
    textResultClaimedRelabeledAsQuestionResult: false,
    staleCrossModeErrorClaimedAccepted: false,
    auditClaimedPassesWithoutIsolatedState: false,
    auditClaimedPassesWithUnexpectedFilesChanged: false,
    auditClaimedPassesWithPersistenceAdded: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    rootCause: [
      'Question mode and text-document mode shared a single React state (`const [text, setText] = useState("")`) and a single <textarea> bound to it.',
      "Switching modes (`setMode(m)`) never cleared or isolated this shared state, so whatever was typed in one mode remained visible — and editable — in the other mode's textarea.",
      "The pre-existing mode-change useEffect already clears result/error/loading on every mode switch, so cross-mode result/error contamination was not present and required no change.",
    ],
    patchSummary: [
      `Replaced the single shared \`text\`/\`setText\` state in ${CLIENT_REL_PATH} with two isolated states: \`questionInput\`/\`setQuestionInput\` and \`textDocumentInput\`/\`setTextDocumentInput\`.`,
      'The shared <textarea> now binds `value`/`onChange` via an explicit `mode === "question"` ternary/conditional, so each mode reads and writes only its own state.',
      "`trimmedLen` (character count + validation) now derives from the isolated state that matches the active mode.",
      "`onSubmit` now trims and submits only the input state belonging to the active mode.",
      "`handleControlledTextDocumentModeSubmit` (internal test-only text-document action) now reads only `textDocumentInput`.",
      "Photo mode (`onPhotoSubmit` and its OCR/reasoning handlers) was not touched and does not reference either text state.",
      "No persistence (localStorage/sessionStorage/IndexedDB/cookies/URL/database/Supabase/Storage/Vaylo DNA) was added anywhere in the patch.",
      "No backend route, OCR runtime, rate limiter, or governance file was modified.",
      "No First Contact string or control was added.",
    ],
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `modifiedRuntimeFiles: ${JSON.stringify(evidence.modifiedRuntimeFiles)}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `questionInputStateIsolated: ${questionInputStateIsolated}`,
      `textDocumentInputStateIsolated: ${textDocumentInputStateIsolated}`,
      `questionTextareaUsesQuestionState: ${questionTextareaUsesQuestionState}`,
      `textTextareaUsesTextDocumentState: ${textTextareaUsesTextDocumentState}`,
      `questionSubmitUsesQuestionState: ${questionSubmitUsesQuestionState}`,
      `textSubmitUsesTextDocumentState: ${textSubmitUsesTextDocumentState}`,
      `questionCharacterCountUsesQuestionState / textCharacterCountUsesTextDocumentState: ${questionCharacterCountUsesQuestionState}`,
      `modeChipOnClickIsPureSetMode: ${modeChipOnClickIsPureSetMode}`,
      `modeSwitchEffectHasNoFetch: ${modeSwitchEffectHasNoFetch}`,
      `photoModeDoesNotConsumeQuestionState: ${photoModeDoesNotConsumeQuestionState}`,
      `photoModeDoesNotConsumeTextDocumentState: ${photoModeDoesNotConsumeTextDocumentState}`,
      `persistence API scan found: ${JSON.stringify(persistenceFound)}`,
      `standaloneFirstContactStillAbsent: ${standaloneFirstContactStillAbsent}`,
      `noSuppressHydrationWarning: ${noSuppressHydrationWarning}`,
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runSmartTalkCrossModeInputStateIsolationPatchAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed =
    computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForDesktopResponsiveBrowserValidationRetry: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runSmartTalkCrossModeInputStateIsolationPatchAudit();
  console.log(JSON.stringify(result));
}
