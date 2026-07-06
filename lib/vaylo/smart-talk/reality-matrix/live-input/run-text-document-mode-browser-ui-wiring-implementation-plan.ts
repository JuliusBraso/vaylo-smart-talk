/**
 * PHASE 8.9J — Text Document Mode Browser/UI Wiring Implementation Plan
 *
 * Planning-only, local, pure, read-only phase. Defines the minimal future UI
 * change required to safely reach the Text Document Mode controlled runtime
 * (text_document_controlled_runtime) from the browser in a future, separately
 * authorized implementation phase (8.9K). This file performs NO
 * implementation of its own: it does not modify any UI/browser/app source
 * file, does not modify app/api/smart-talk/route.ts, does not call
 * /api/smart-talk, does not start a dev server, does not call runSmartTalk,
 * does not call any model/OpenAI/fetch as runtime, does not read
 * process.env for authorization, does not write files (other than creating
 * this one new plan file), does not touch DB/storage, does not run 8.3AC,
 * and does not touch tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeBrowserUiWiringAudit } from "./run-text-document-mode-browser-ui-wiring-audit";

const SMART_TALK_CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_PAGE_RELATIVE_PATH = "app/smart-talk/page.tsx";

// ─── Result type ────────────────────────────────────────────────────────────

interface PlannedSafeRequestContract {
  mode: "text_document_controlled_runtime";
  context: "anonymous | controlled_test";
  inputType: "text";
  locale: "sk";
  text: "string (pasted document text)";
}

interface PlannedChange {
  phase: "8.9K";
  type: "minimal_ui_wiring_patch";
  targetFiles: string[];
  routeFilesToModify: string[];
  apiFilesToModify: string[];
  storageFilesToModify: string[];
  expectedRequestShape: PlannedSafeRequestContract;
  selectedStrategy: string;
  implementationBoundaries: string[];
  safetyRequirements: string[];
  manualTestDeferred: true;
  browserManualTestPhase: "8.9L";
}

interface TextDocumentModeBrowserUiWiringImplementationPlanResult {
  checkId: "8.9J";
  allPassed: boolean;
  planOnly: true;
  sourceBrowserUiAuditCommit: "18cad6e";
  sourceBrowserUiAuditPhase: "8.9I";
  browserUiWiringAuditAccepted: boolean;
  currentUiWiringMissingButSafeConfirmed: boolean;
  currentUiWiringUnsafeConfirmedFalse: boolean;
  currentSmartTalkClientFound: boolean;
  currentApiSmartTalkPostFound: boolean;
  currentRequestBodyConstructionFound: boolean;
  currentContextAnonymousFound: boolean;
  currentInputTypeFound: boolean;
  currentLocaleSkFound: boolean;
  currentTextFieldFound: boolean;
  currentTextDocumentModeNotPresentInUi: boolean;
  currentClientEnvEnablementNotPresent: boolean;
  currentClientPersistenceNotPresent: boolean;
  currentDirectModelCallNotPresent: boolean;
  selectedImplementationStrategy: string;
  plannedTargetFiles: string[];
  plannedRouteFilesToModify: string[];
  plannedApiFilesToModify: string[];
  plannedStorageFilesToModify: string[];
  plannedSafeRequestContract: PlannedSafeRequestContract;
  plannedChange: PlannedChange;
  manualTestDeferred: true;
  browserManualTestPhase: "8.9L";
  readyForMinimalUiWiringPatch: boolean;
  readyForBrowserManualTest: false;
  readyForTextDocumentModeInternalReadinessClosure: false;
  textDocumentRuntimeAuthorizedForProductionNow: false;
  textDocumentRuntimeStillControlledLocalOnly: true;
  photoOcrRuntimeStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  fileUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  modelOutputStillUntrusted: boolean;
  documentTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  liveRouteInvocationPerformedByThisPlan: false;
  liveModelCallPerformedByThisPlan: false;
  openAiSdkImportedByPlan: false;
  fetchUsedAsRuntimeByPlan: false;
  processEnvReadForAuthorizationByPlan: false;
  filesWrittenByPlan: false;
  dbStorageTouchedByPlan: false;
  eightThreeAcNotRun: true;
  readyForNextPhase: "8.9K";
  recommendedNextPhase: "Text Document Mode Minimal Browser/UI Wiring Patch";
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  baselineFindings: string[];
  plannedImplementationSteps: string[];
  implementationBoundaries: string[];
  safetyRequirements: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Fixed planning content ─────────────────────────────────────────────────

const REQUIRED_IMPLEMENTATION_BOUNDARIES: string[] = [
  "No route.ts modification",
  "No new API endpoint",
  "No env flag mutation",
  "No NEXT_PUBLIC env flag",
  "No OCR/photo/upload",
  "No file/scanner payload",
  "No paid document mode",
  "No Vaylo DNA",
  "No persistence/DB/storage",
  "No analytics payload with document text",
  "No console logging full document text",
  "No direct OpenAI/model call",
  "No public launch/production/go-live wording",
];

const REQUIRED_SAFETY_REQUIREMENTS: string[] = [
  "UI must keep existing Free Q&A behavior unchanged.",
  "UI must keep existing default question/text behavior unchanged unless explicitly selecting controlled Text Document Mode.",
  "UI must not change photo mode.",
  "UI must not route photo/file/image/OCR to text_document_controlled_runtime.",
  'UI must send mode: "text_document_controlled_runtime" only for pasted text document mode.',
  'UI must send inputType: "text" for text document mode.',
  'UI must send locale: "sk".',
  'UI must send context: "anonymous" or "controlled_test".',
  "UI must send text from the text area as string.",
  "UI must not store pasted document text in localStorage/sessionStorage/indexedDB/cookies.",
  "UI must not send pasted document text to analytics/event tracking.",
  "UI must not console.log full document text.",
  "UI must not expose text document mode as public/production/go-live.",
  "UI must not show OCR/photo as part of this mode.",
  "UI must not enable upload/scanner/file payloads for this mode.",
  "UI must not enable paid document mode/Vaylo DNA/persistence.",
];

const REQUIRED_PLANNED_IMPLEMENTATION_STEPS: string[] = [
  "Modify only app/smart-talk/SmartTalkClient.tsx in 8.9K.",
  "Preserve existing question/text behavior.",
  "Preserve existing photo behavior and do not connect photo to text_document_controlled_runtime.",
  "Add a controlled/internal UI selector or button for Text Document Mode.",
  'When selected, construct request body with mode: "text_document_controlled_runtime", context: "anonymous" or "controlled_test", inputType: "text", locale: "sk", text.',
  "Do not store document text client-side.",
  "Do not expose public/production/go-live wording.",
  "Keep browser manual testing deferred to 8.9L.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Minimal UI wiring patch not implemented yet",
  "Browser manual test not completed yet",
  "Text Document Mode internal readiness closure not completed yet",
  "OCR/photo still blocked",
  "scanner/upload still blocked",
  "file upload still blocked",
  "paid document mode still blocked",
  "Vaylo DNA still blocked",
  "persistence/DB/storage still blocked",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const PLANNED_SAFE_REQUEST_CONTRACT: PlannedSafeRequestContract = {
  mode: "text_document_controlled_runtime",
  context: "anonymous | controlled_test",
  inputType: "text",
  locale: "sk",
  text: "string (pasted document text)",
};

const SELECTED_IMPLEMENTATION_STRATEGY =
  'Option B — Separate controlled local test button. Add a single, clearly-labeled internal/local-only action (e.g. a distinct button such as "Test Text Document Mode (internal)") to app/smart-talk/SmartTalkClient.tsx. This action is fully additive: it does not alter the existing default onSubmit handler, the existing question/text mode branching, or the existing photo mode branching in any way. It only introduces one new, independent code path that — when explicitly invoked — constructs and sends the exact safe request body { mode: "text_document_controlled_runtime", context: "anonymous" | "controlled_test", inputType: "text", locale: "sk", text }. This is recommended as the smallest and safest option because it cannot change behavior for any existing user flow (Free Q&A and the existing question/text/photo modes remain byte-for-byte unchanged); the only new behavior lives entirely behind a clearly-labeled, non-default, internal-only control, with no public-facing wording and no change to server-side gates.';

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeBrowserUiWiringImplementationPlanResult(
  r: TextDocumentModeBrowserUiWiringImplementationPlanResult,
): boolean {
  if (r.checkId !== "8.9J") return false;
  if (r.allPassed !== true) return false;
  if (r.planOnly !== true) return false;
  if (r.sourceBrowserUiAuditCommit !== "18cad6e") return false;
  if (r.sourceBrowserUiAuditPhase !== "8.9I") return false;
  if (r.browserUiWiringAuditAccepted !== true) return false;
  if (r.currentUiWiringMissingButSafeConfirmed !== true) return false;
  if (r.currentUiWiringUnsafeConfirmedFalse !== true) return false;
  if (r.currentSmartTalkClientFound !== true) return false;
  if (r.currentApiSmartTalkPostFound !== true) return false;
  if (r.currentRequestBodyConstructionFound !== true) return false;
  if (r.currentContextAnonymousFound !== true) return false;
  if (r.currentInputTypeFound !== true) return false;
  if (r.currentLocaleSkFound !== true) return false;
  if (r.currentTextFieldFound !== true) return false;
  if (r.currentTextDocumentModeNotPresentInUi !== true) return false;
  if (r.currentClientEnvEnablementNotPresent !== true) return false;
  if (r.currentClientPersistenceNotPresent !== true) return false;
  if (r.currentDirectModelCallNotPresent !== true) return false;
  if (typeof r.selectedImplementationStrategy !== "string" || r.selectedImplementationStrategy.length === 0)
    return false;
  if (r.plannedTargetFiles.length !== 1 || r.plannedTargetFiles[0] !== SMART_TALK_CLIENT_RELATIVE_PATH)
    return false;
  if (r.plannedRouteFilesToModify.length !== 0) return false;
  if (r.plannedApiFilesToModify.length !== 0) return false;
  if (r.plannedStorageFilesToModify.length !== 0) return false;
  if (r.plannedSafeRequestContract.mode !== "text_document_controlled_runtime") return false;
  if (r.plannedSafeRequestContract.inputType !== "text") return false;
  if (r.plannedSafeRequestContract.locale !== "sk") return false;
  if (r.plannedChange.phase !== "8.9K") return false;
  if (r.plannedChange.type !== "minimal_ui_wiring_patch") return false;
  if (r.plannedChange.targetFiles.length !== 1 || r.plannedChange.targetFiles[0] !== SMART_TALK_CLIENT_RELATIVE_PATH)
    return false;
  if (r.plannedChange.routeFilesToModify.length !== 0) return false;
  if (r.plannedChange.apiFilesToModify.length !== 0) return false;
  if (r.plannedChange.storageFilesToModify.length !== 0) return false;
  if (r.plannedChange.manualTestDeferred !== true) return false;
  if (r.plannedChange.browserManualTestPhase !== "8.9L") return false;
  for (const item of REQUIRED_IMPLEMENTATION_BOUNDARIES) {
    if (!r.plannedChange.implementationBoundaries.includes(item)) return false;
    if (!r.implementationBoundaries.includes(item)) return false;
  }
  for (const item of REQUIRED_SAFETY_REQUIREMENTS) {
    if (!r.plannedChange.safetyRequirements.includes(item)) return false;
    if (!r.safetyRequirements.includes(item)) return false;
  }
  if (r.manualTestDeferred !== true) return false;
  if (r.browserManualTestPhase !== "8.9L") return false;
  if (r.readyForMinimalUiWiringPatch !== true) return false;
  if (r.readyForBrowserManualTest !== false) return false;
  if (r.readyForTextDocumentModeInternalReadinessClosure !== false) return false;
  if (r.textDocumentRuntimeAuthorizedForProductionNow !== false) return false;
  if (r.textDocumentRuntimeStillControlledLocalOnly !== true) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformedByThisPlan !== false) return false;
  if (r.liveModelCallPerformedByThisPlan !== false) return false;
  if (r.openAiSdkImportedByPlan !== false) return false;
  if (r.fetchUsedAsRuntimeByPlan !== false) return false;
  if (r.processEnvReadForAuthorizationByPlan !== false) return false;
  if (r.filesWrittenByPlan !== false) return false;
  if (r.dbStorageTouchedByPlan !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForNextPhase !== "8.9K") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Minimal Browser/UI Wiring Patch") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.baselineFindings) || r.baselineFindings.length === 0) return false;
  if (r.plannedImplementationSteps.length !== REQUIRED_PLANNED_IMPLEMENTATION_STEPS.length) return false;
  for (const step of REQUIRED_PLANNED_IMPLEMENTATION_STEPS) {
    if (!r.plannedImplementationSteps.includes(step)) return false;
  }
  if (r.implementationBoundaries.length !== REQUIRED_IMPLEMENTATION_BOUNDARIES.length) return false;
  if (r.safetyRequirements.length !== REQUIRED_SAFETY_REQUIREMENTS.length) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89JMutation = (
  r: TextDocumentModeBrowserUiWiringImplementationPlanResult,
) => TextDocumentModeBrowserUiWiringImplementationPlanResult;
interface Tamper89JCase {
  label: string;
  mutate: Tamper89JMutation;
}

const TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper89JCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9I" as "8.9J" }) },
  { label: "allPassed false (8.9I source is not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "planOnly false", mutate: (r) => ({ ...r, planOnly: false as true }) },
  { label: "sourceBrowserUiAuditCommit wrong (source commit is not 18cad6e)", mutate: (r) => ({ ...r, sourceBrowserUiAuditCommit: "0000000" as "18cad6e" }) },
  { label: "sourceBrowserUiAuditPhase wrong", mutate: (r) => ({ ...r, sourceBrowserUiAuditPhase: "8.9H" as "8.9I" }) },
  { label: "browserUiWiringAuditAccepted false (8.9I readyForBrowserUiWiringImplementationPlan is false)", mutate: (r) => ({ ...r, browserUiWiringAuditAccepted: false }) },
  { label: "currentUiWiringMissingButSafeConfirmed false", mutate: (r) => ({ ...r, currentUiWiringMissingButSafeConfirmed: false }) },
  { label: "currentUiWiringUnsafeConfirmedFalse false (8.9I unsafeFindings are present)", mutate: (r) => ({ ...r, currentUiWiringUnsafeConfirmedFalse: false }) },
  { label: "currentSmartTalkClientFound false (current UI baseline is not found)", mutate: (r) => ({ ...r, currentSmartTalkClientFound: false }) },
  { label: "currentSmartTalkClientFound false (SmartTalkClient.tsx is missing)", mutate: (r) => ({ ...r, currentSmartTalkClientFound: false }) },
  { label: "currentApiSmartTalkPostFound false", mutate: (r) => ({ ...r, currentApiSmartTalkPostFound: false }) },
  { label: "currentRequestBodyConstructionFound false", mutate: (r) => ({ ...r, currentRequestBodyConstructionFound: false }) },
  { label: "currentContextAnonymousFound false", mutate: (r) => ({ ...r, currentContextAnonymousFound: false }) },
  { label: "currentInputTypeFound false", mutate: (r) => ({ ...r, currentInputTypeFound: false }) },
  { label: "currentLocaleSkFound false", mutate: (r) => ({ ...r, currentLocaleSkFound: false }) },
  { label: "currentTextFieldFound false", mutate: (r) => ({ ...r, currentTextFieldFound: false }) },
  { label: "currentTextDocumentModeNotPresentInUi false (current UI already has unsafe Text Document Mode wiring)", mutate: (r) => ({ ...r, currentTextDocumentModeNotPresentInUi: false }) },
  { label: "currentClientEnvEnablementNotPresent false", mutate: (r) => ({ ...r, currentClientEnvEnablementNotPresent: false }) },
  { label: "currentClientPersistenceNotPresent false", mutate: (r) => ({ ...r, currentClientPersistenceNotPresent: false }) },
  { label: "currentDirectModelCallNotPresent false", mutate: (r) => ({ ...r, currentDirectModelCallNotPresent: false }) },
  { label: "plannedRouteFilesToModify non-empty (selected strategy would modify route.ts)", mutate: (r) => ({ ...r, plannedRouteFilesToModify: ["app/api/smart-talk/route.ts"], plannedChange: { ...r.plannedChange, routeFilesToModify: ["app/api/smart-talk/route.ts"] } }) },
  { label: "plannedApiFilesToModify non-empty (selected strategy would create a new API endpoint)", mutate: (r) => ({ ...r, plannedApiFilesToModify: ["app/api/smart-talk-text-document/route.ts"], plannedChange: { ...r.plannedChange, apiFilesToModify: ["app/api/smart-talk-text-document/route.ts"] } }) },
  { label: "implementationBoundaries missing env flag mutation guard (selected strategy would mutate env flags)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No env flag mutation") }) },
  { label: "implementationBoundaries missing NEXT_PUBLIC guard (selected strategy would introduce NEXT_PUBLIC env flag)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No NEXT_PUBLIC env flag") }) },
  { label: "implementationBoundaries missing OCR/photo/upload guard (selected strategy would connect OCR/photo/upload)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No OCR/photo/upload") }) },
  { label: "plannedStorageFilesToModify non-empty (selected strategy would add storage/persistence)", mutate: (r) => ({ ...r, plannedStorageFilesToModify: ["lib/vaylo/smart-talk/storage.ts"], plannedChange: { ...r.plannedChange, storageFilesToModify: ["lib/vaylo/smart-talk/storage.ts"] } }) },
  { label: "implementationBoundaries missing paid/DNA guard (selected strategy would add paid/DNA)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No paid document mode") }) },
  { label: "implementationBoundaries missing public wording guard (selected strategy would add public/production/go-live wording)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No public launch/production/go-live wording") }) },
  { label: "implementationBoundaries missing direct model call guard (selected strategy would call OpenAI/model directly)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No direct OpenAI/model call") }) },
  { label: "implementationBoundaries missing console-log guard (selected strategy would store or log full document text client-side)", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.filter((b) => b !== "No console logging full document text") }) },
  { label: "manualTestDeferred false (manual browser test is marked complete)", mutate: (r) => ({ ...r, manualTestDeferred: false as true, plannedChange: { ...r.plannedChange, manualTestDeferred: false as true } }) },
  { label: "readyForBrowserManualTest true", mutate: (r) => ({ ...r, readyForBrowserManualTest: true as false }) },
  { label: "readyForTextDocumentModeInternalReadinessClosure true", mutate: (r) => ({ ...r, readyForTextDocumentModeInternalReadinessClosure: true as false }) },
  { label: "textDocumentRuntimeAuthorizedForProductionNow true", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedForProductionNow: true as false }) },
  { label: "textDocumentRuntimeStillControlledLocalOnly false", mutate: (r) => ({ ...r, textDocumentRuntimeStillControlledLocalOnly: false as true }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes ready)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false (file upload becomes ready)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid/DNA/persistence/DB storage becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false (document text is not treated as sensitive)", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisPlan true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisPlan: true as false }) },
  { label: "liveModelCallPerformedByThisPlan true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisPlan: true as false }) },
  { label: "openAiSdkImportedByPlan true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByPlan: true as false }) },
  { label: "fetchUsedAsRuntimeByPlan true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByPlan: true as false }) },
  { label: "processEnvReadForAuthorizationByPlan true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByPlan: true as false }) },
  { label: "filesWrittenByPlan true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByPlan: true as false }) },
  { label: "dbStorageTouchedByPlan true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByPlan: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9L" as "8.9K" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" as "Text Document Mode Minimal Browser/UI Wiring Patch" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForMinimalUiWiringPatch false", mutate: (r) => ({ ...r, readyForMinimalUiWiringPatch: false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "baselineFindings emptied", mutate: (r) => ({ ...r, baselineFindings: [] }) },
  { label: "plannedImplementationSteps truncated", mutate: (r) => ({ ...r, plannedImplementationSteps: r.plannedImplementationSteps.slice(0, 3) }) },
  { label: "implementationBoundaries truncated", mutate: (r) => ({ ...r, implementationBoundaries: r.implementationBoundaries.slice(0, 3) }) },
  { label: "safetyRequirements emptied", mutate: (r) => ({ ...r, safetyRequirements: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported plan runner ────────────────────────────────────────────────────

export function runTextDocumentModeBrowserUiWiringImplementationPlan(): TextDocumentModeBrowserUiWiringImplementationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.9I browser/UI wiring audit as source of truth ─────────────────
  const i = runTextDocumentModeBrowserUiWiringAudit();
  if (i.checkId !== "8.9I") planFailures.push(`8.9I checkId mismatch: expected "8.9I", got "${i.checkId}"`);
  if (i.allPassed !== true) planFailures.push("8.9I allPassed is not true");
  if (i.sourceInternalReviewCommit !== "688d143") planFailures.push("8.9I sourceInternalReviewCommit mismatch");
  if (i.readyForBrowserUiWiringImplementationPlan !== true)
    planFailures.push("8.9I readyForBrowserUiWiringImplementationPlan is not true");
  if (i.readyForBrowserManualTest !== false) planFailures.push("8.9I readyForBrowserManualTest is not false");
  if (i.uiTextDocumentWiringMissingButSafe !== true)
    planFailures.push("8.9I uiTextDocumentWiringMissingButSafe is not true");
  if (i.uiTextDocumentWiringUnsafe !== false) planFailures.push("8.9I uiTextDocumentWiringUnsafe is not false");
  if (!Array.isArray(i.unsafeFindings) || i.unsafeFindings.length !== 0)
    planFailures.push("8.9I unsafeFindings is not empty");
  if (i.publicRuntimeStillBlocked !== true) planFailures.push("8.9I publicRuntimeStillBlocked is not true");
  if (i.productionAuthorizedNow !== false) planFailures.push("8.9I productionAuthorizedNow is not false");
  if (i.goLiveAuthorizedNow !== false) planFailures.push("8.9I goLiveAuthorizedNow is not false");
  if (i.photoOcrRuntimeStillBlocked !== true) planFailures.push("8.9I photoOcrRuntimeStillBlocked is not true");
  if (i.scannerUploadStillBlocked !== true) planFailures.push("8.9I scannerUploadStillBlocked is not true");
  if (i.fileUploadStillBlocked !== true) planFailures.push("8.9I fileUploadStillBlocked is not true");
  if (i.paidDocumentModeStillBlocked !== true) planFailures.push("8.9I paidDocumentModeStillBlocked is not true");
  if (i.vayloDnaStillBlocked !== true) planFailures.push("8.9I vayloDnaStillBlocked is not true");
  if (i.persistenceStillBlocked !== true) planFailures.push("8.9I persistenceStillBlocked is not true");
  if (i.dbStorageStillBlocked !== true) planFailures.push("8.9I dbStorageStillBlocked is not true");
  if (i.readyForTextDocumentRuntime !== false) planFailures.push("8.9I readyForTextDocumentRuntime is not false");
  if (i.readyForPhotoOcrRuntime !== false) planFailures.push("8.9I readyForPhotoOcrRuntime is not false");
  if (i.readyForPublicRuntime !== false) planFailures.push("8.9I readyForPublicRuntime is not false");
  if (i.readyForProduction !== false) planFailures.push("8.9I readyForProduction is not false");
  if (i.readyForGoLive !== false) planFailures.push("8.9I readyForGoLive is not false");
  if (i.tamperRejected !== i.tamperCount) planFailures.push("8.9I own tamper count mismatch");

  const browserUiWiringAuditAccepted = i.readyForBrowserUiWiringImplementationPlan === true;
  const currentUiWiringMissingButSafeConfirmed = i.uiTextDocumentWiringMissingButSafe === true;
  const currentUiWiringUnsafeConfirmedFalse =
    i.uiTextDocumentWiringUnsafe === false && i.unsafeFindings.length === 0;

  // ── Static baseline read of the current UI file (read-only, no import) ───
  const clientAbsPath = path.join(process.cwd(), SMART_TALK_CLIENT_RELATIVE_PATH);
  let clientExists = false;
  let clientContent = "";
  try {
    clientExists = fs.existsSync(clientAbsPath) && fs.statSync(clientAbsPath).isFile();
    if (clientExists) clientContent = fs.readFileSync(clientAbsPath, "utf8");
  } catch {
    clientExists = false;
  }
  if (!clientExists) planFailures.push(`${SMART_TALK_CLIENT_RELATIVE_PATH} not found`);

  const pageAbsPath = path.join(process.cwd(), SMART_TALK_PAGE_RELATIVE_PATH);
  let pageExists = false;
  let pageContent = "";
  try {
    pageExists = fs.existsSync(pageAbsPath) && fs.statSync(pageAbsPath).isFile();
    if (pageExists) pageContent = fs.readFileSync(pageAbsPath, "utf8");
  } catch {
    pageExists = false;
  }

  const currentApiSmartTalkPostFound = /fetch\(\s*["'`]\/api\/smart-talk["'`][\s\S]{0,300}?method:\s*["'`]POST["'`]/.test(
    clientContent,
  );
  const requestBodyBlockMatch = clientContent.match(/body:\s*JSON\.stringify\(\{[\s\S]{0,400}?\}\)/);
  const requestBodyBlock = requestBodyBlockMatch ? requestBodyBlockMatch[0] : "";
  const currentRequestBodyConstructionFound = requestBodyBlockMatch !== null;
  const currentContextAnonymousFound = /context:\s*["'`]anonymous["'`]/.test(requestBodyBlock);
  const currentInputTypeFound = /inputType/.test(requestBodyBlock);
  const currentLocaleSkFound = /locale:\s*["'`]sk["'`]/.test(requestBodyBlock);
  const currentTextFieldFound = /text:\s*\w+/.test(requestBodyBlock);
  const currentTextDocumentModeNotPresentInUi = !/text_document_controlled_runtime/.test(clientContent);
  const currentClientEnvEnablementNotPresent =
    !/SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(clientContent) &&
    !/NEXT_PUBLIC_SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(clientContent) &&
    // \s*=(?!=) excludes comparisons (==, ===) so a read like
    // `process.env.NODE_ENV === "development"` is not mistaken for a mutation.
    !/process\.env\.\w+\s*=(?!=)/.test(clientContent);
  const currentClientPersistenceNotPresent = !/(localStorage|sessionStorage|indexedDB|document\.cookie)/.test(
    clientContent,
  );
  const currentDirectModelCallNotPresent =
    !/from\s+["'`]openai["'`]/.test(clientContent) &&
    !/api\.openai\.com/.test(clientContent) &&
    !/runSmartTalk\(/.test(clientContent);

  if (!currentApiSmartTalkPostFound) planFailures.push("current UI baseline: POST /api/smart-talk not found");
  if (!currentRequestBodyConstructionFound) planFailures.push("current UI baseline: JSON request body construction not found");
  if (!currentContextAnonymousFound) planFailures.push('current UI baseline: context: "anonymous" not found');
  if (!currentInputTypeFound) planFailures.push("current UI baseline: inputType field not found");
  if (!currentLocaleSkFound) planFailures.push('current UI baseline: locale: "sk" not found');
  if (!currentTextFieldFound) planFailures.push("current UI baseline: text field not found");
  if (!currentTextDocumentModeNotPresentInUi)
    planFailures.push("current UI baseline unexpectedly already references text_document_controlled_runtime");
  if (!currentClientEnvEnablementNotPresent)
    planFailures.push("current UI baseline unexpectedly references an env-flag enablement marker");
  if (!currentClientPersistenceNotPresent)
    planFailures.push("current UI baseline unexpectedly references browser storage persistence");
  if (!currentDirectModelCallNotPresent)
    planFailures.push("current UI baseline unexpectedly references a direct model/OpenAI/runSmartTalk call");

  const baselineFindings: string[] = [
    `${SMART_TALK_CLIENT_RELATIVE_PATH} exists: ${clientExists}.`,
    `POST to /api/smart-talk found: ${currentApiSmartTalkPostFound}; JSON request-body construction found: ${currentRequestBodyConstructionFound}.`,
    `Current request body includes context: "anonymous" (${currentContextAnonymousFound}), inputType (${currentInputTypeFound}), locale: "sk" (${currentLocaleSkFound}), text field (${currentTextFieldFound}).`,
    `Current UI does NOT reference text_document_controlled_runtime (${currentTextDocumentModeNotPresentInUi}), does NOT reference SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED / NEXT_PUBLIC_ variants or env mutation (${currentClientEnvEnablementNotPresent}), does NOT persist to browser storage (${currentClientPersistenceNotPresent}), and does NOT call OpenAI/model/runSmartTalk directly (${currentDirectModelCallNotPresent}).`,
    `${SMART_TALK_PAGE_RELATIVE_PATH} exists: ${pageExists}; read only as an optional secondary reference — it renders <SmartTalkClient /> and an existing privacy disclaimer, and requires no plan-time changes.${pageExists && /Súkromie na prvom mieste/.test(pageContent) ? " (Existing privacy disclaimer text confirmed present.)" : ""}`,
    "Photo mode (multipart/form-data POST to /api/smart-talk-photo) is a separate, pre-existing, unrelated code path in the same file; the planned change must not touch it.",
  ];

  const plannedTargetFiles = [SMART_TALK_CLIENT_RELATIVE_PATH];
  const plannedRouteFilesToModify: string[] = [];
  const plannedApiFilesToModify: string[] = [];
  const plannedStorageFilesToModify: string[] = [];

  const plannedChange: PlannedChange = {
    phase: "8.9K",
    type: "minimal_ui_wiring_patch",
    targetFiles: plannedTargetFiles,
    routeFilesToModify: plannedRouteFilesToModify,
    apiFilesToModify: plannedApiFilesToModify,
    storageFilesToModify: plannedStorageFilesToModify,
    expectedRequestShape: PLANNED_SAFE_REQUEST_CONTRACT,
    selectedStrategy: SELECTED_IMPLEMENTATION_STRATEGY,
    implementationBoundaries: REQUIRED_IMPLEMENTATION_BOUNDARIES,
    safetyRequirements: REQUIRED_SAFETY_REQUIREMENTS,
    manualTestDeferred: true,
    browserManualTestPhase: "8.9L",
  };

  const nextRecommendedSteps: string[] = [
    "Phase 8.9K: Text Document Mode Minimal Browser/UI Wiring Patch — implement, behind a clearly-labeled internal/local-only control in app/smart-talk/SmartTalkClient.tsx only, the exact safe request contract defined by this plan. No route.ts change, no new endpoint, no storage, no OCR/photo/upload, no paid/DNA, no public wording.",
    "Phase 8.9L: Controlled Local Browser Manual Test — only after 8.9K, perform a controlled local manual test of the new internal control (still local, still behind the exact env flag, still internal-only).",
    "Phase 8.9M: Text Document Mode Internal Readiness Closure — only after a successful 8.9L manual test.",
    "Phase 8.10A: Photo/OCR Controlled Runtime Gate — explicitly deferred until after 8.9M; out of scope for this plan and for 8.9K/8.9L.",
  ];

  const notes: string[] = [
    "PL-01: 8.9J is a pure, local, planning-only phase. It performs no implementation, no live route/model/fetch(-as-runtime)/OpenAI/process.env-authorization/DB/storage access, and mutates no source file; the only file write it performs is the creation of this plan file itself.",
    `PL-02: 8.9I confirmed as source of truth — checkId=${i.checkId}, allPassed=${i.allPassed}, sourceInternalReviewCommit=${i.sourceInternalReviewCommit}, readyForBrowserUiWiringImplementationPlan=${i.readyForBrowserUiWiringImplementationPlan}, uiTextDocumentWiringMissingButSafe=${i.uiTextDocumentWiringMissingButSafe}, uiTextDocumentWiringUnsafe=${i.uiTextDocumentWiringUnsafe}, unsafeFindings.length=${i.unsafeFindings.length}.`,
    "PL-03: the recommended strategy (Option B — separate controlled local test button) was selected over Option A (hidden controlled internal switch inside the existing submit flow) because it is strictly additive: it cannot alter the meaning or behavior of any existing branch (question, text, photo) in app/smart-talk/SmartTalkClient.tsx, which minimizes the review surface and risk of the eventual 8.9K patch.",
    "PL-04: the future safe request contract is fixed as { mode: \"text_document_controlled_runtime\", context: \"anonymous\" | \"controlled_test\", inputType: \"text\", locale: \"sk\", text }, matching exactly the Phase 8.9C server-side branch contract validated in 8.9G/8.9H.",
    "PL-05: this plan explicitly sequences 8.9K (minimal UI wiring patch) → 8.9L (controlled local browser manual test) → 8.9M (internal readiness closure) → 8.10A (Photo/OCR Controlled Runtime Gate, only after 8.9M). No step in this sequence is authorized by this plan; each remains separately gated.",
    "PL-06: this plan does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: TextDocumentModeBrowserUiWiringImplementationPlanResult = {
    checkId: "8.9J",
    allPassed: true,
    planOnly: true,
    sourceBrowserUiAuditCommit: "18cad6e",
    sourceBrowserUiAuditPhase: "8.9I",
    browserUiWiringAuditAccepted,
    currentUiWiringMissingButSafeConfirmed,
    currentUiWiringUnsafeConfirmedFalse,
    currentSmartTalkClientFound: clientExists,
    currentApiSmartTalkPostFound,
    currentRequestBodyConstructionFound,
    currentContextAnonymousFound,
    currentInputTypeFound,
    currentLocaleSkFound,
    currentTextFieldFound,
    currentTextDocumentModeNotPresentInUi,
    currentClientEnvEnablementNotPresent,
    currentClientPersistenceNotPresent,
    currentDirectModelCallNotPresent,
    selectedImplementationStrategy: SELECTED_IMPLEMENTATION_STRATEGY,
    plannedTargetFiles,
    plannedRouteFilesToModify,
    plannedApiFilesToModify,
    plannedStorageFilesToModify,
    plannedSafeRequestContract: PLANNED_SAFE_REQUEST_CONTRACT,
    plannedChange,
    manualTestDeferred: true,
    browserManualTestPhase: "8.9L",
    readyForMinimalUiWiringPatch: true,
    readyForBrowserManualTest: false,
    readyForTextDocumentModeInternalReadinessClosure: false,
    textDocumentRuntimeAuthorizedForProductionNow: false,
    textDocumentRuntimeStillControlledLocalOnly: true,
    photoOcrRuntimeStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    liveRouteInvocationPerformedByThisPlan: false,
    liveModelCallPerformedByThisPlan: false,
    openAiSdkImportedByPlan: false,
    fetchUsedAsRuntimeByPlan: false,
    processEnvReadForAuthorizationByPlan: false,
    filesWrittenByPlan: false,
    dbStorageTouchedByPlan: false,
    eightThreeAcNotRun: true,
    readyForNextPhase: "8.9K",
    recommendedNextPhase: "Text Document Mode Minimal Browser/UI Wiring Patch",
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    baselineFindings,
    plannedImplementationSteps: REQUIRED_PLANNED_IMPLEMENTATION_STEPS,
    implementationBoundaries: REQUIRED_IMPLEMENTATION_BOUNDARIES,
    safetyRequirements: REQUIRED_SAFETY_REQUIREMENTS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps,
    notes,
  };

  const noSourceOrBaselineFailures = planFailures.length === 0;
  if (noSourceOrBaselineFailures && !_isCanonicalTextDocumentModeBrowserUiWiringImplementationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_BROWSER_UI_WIRING_IMPLEMENTATION_PLAN_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeBrowserUiWiringImplementationPlanResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9J tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9J tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9J result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-browser-ui-wiring-implementation-plan");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeBrowserUiWiringImplementationPlan(), null, 2));
}
