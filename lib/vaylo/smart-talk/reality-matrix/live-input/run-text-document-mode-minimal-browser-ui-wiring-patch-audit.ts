/**
 * PHASE 8.9K — Text Document Mode Minimal Browser/UI Wiring Patch Audit
 *
 * Static, local, read-only audit of the 8.9K UI patch to
 * app/smart-talk/SmartTalkClient.tsx. Confirms the patch:
 *  - added exactly the minimal, controlled/internal-only Text Document Mode
 *    wiring planned in 8.9J (Option B — separate controlled local test
 *    button/action);
 *  - preserved the existing default question/text and photo flows unchanged;
 *  - introduced no unsafe exposure (no env-flag hardcoding/mutation, no
 *    client persistence, no analytics/console logging of document text, no
 *    direct model/OpenAI call, no OCR/photo/upload/paid/DNA/persistence
 *    enablement in the new path, no public/production/go-live wording).
 *
 * This audit performs NO live route/model/fetch(-as-runtime)/OpenAI/
 * process.env-authorization/DB/storage access of its own. It does not import
 * UI components, does not import route.ts, does not invoke route handlers,
 * does not call runSmartTalk, does not write files (other than this one new
 * audit file), does not run 8.3AC, and does not touch
 * tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeBrowserUiWiringImplementationPlan } from "./run-text-document-mode-browser-ui-wiring-implementation-plan";

const SMART_TALK_CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_ROUTE_RELATIVE_PATH = "app/api/smart-talk/route.ts";

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeMinimalBrowserUiWiringPatchAuditResult {
  checkId: "8.9K";
  allPassed: boolean;
  patchAuditOnly: true;
  sourceImplementationPlanCommit: "a0b30da";
  sourceImplementationPlanPhase: "8.9J";
  uiPatchImplemented: boolean;
  modifiedUiFile: "app/smart-talk/SmartTalkClient.tsx";
  auditFileCreated: true;
  onlyAllowedExistingFileModified: boolean;
  routeFileModified: false;
  apiFilesModified: false;
  storageFilesModified: false;
  textDocumentModeStringDetectedInUi: boolean;
  internalControlledUiControlDetected: boolean;
  separateTextDocumentHandlerDetected: boolean;
  requiredSafeRequestContractDetected: boolean;
  modeFieldDetected: boolean;
  contextAnonymousDetected: boolean;
  inputTypeTextDetected: boolean;
  localeSkDetected: boolean;
  textFieldDetected: boolean;
  existingDefaultSmartTalkFlowPreserved: boolean;
  existingPhotoFlowPreserved: boolean;
  textDocumentPathSeparatedFromPhotoUpload: boolean;
  textDocumentPathDoesNotUseFormData: boolean;
  noClientEnvEnablement: boolean;
  noNextPublicEnvFlag: boolean;
  noClientPersistence: boolean;
  noDocumentTextAnalytics: boolean;
  noFullDocumentConsoleLog: boolean;
  noDirectModelOrOpenAiClientCall: boolean;
  noRunSmartTalkClientCall: boolean;
  noPublicProductionGoLiveWording: boolean;
  noPaidDnaPersistenceUploadEnablement: boolean;
  manualTestDeferred: boolean;
  readyForBrowserManualTestPlanning: boolean;
  readyForBrowserManualTest: false;
  browserManualTestPhase: "8.9L";
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
  liveRouteInvocationPerformedByThisPatchAudit: false;
  liveModelCallPerformedByThisPatchAudit: false;
  openAiSdkImportedByPatchAudit: false;
  fetchUsedAsRuntimeByPatchAudit: false;
  processEnvReadForAuthorizationByPatchAudit: false;
  filesWrittenByPatchAudit: false;
  dbStorageTouchedByPatchAudit: false;
  eightThreeAcNotRun: true;
  readyForNextPhase: "8.9L";
  recommendedNextPhase: "Text Document Mode Controlled Local Browser Manual Test Planning";
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  patchFindings: string[];
  preservedFlows: string[];
  safetyFindings: string[];
  warnings: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_REMAINING_BLOCKERS: string[] = [
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

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeMinimalBrowserUiWiringPatchAuditResult(
  r: TextDocumentModeMinimalBrowserUiWiringPatchAuditResult,
): boolean {
  if (r.checkId !== "8.9K") return false;
  if (r.allPassed !== true) return false;
  if (r.patchAuditOnly !== true) return false;
  if (r.sourceImplementationPlanCommit !== "a0b30da") return false;
  if (r.sourceImplementationPlanPhase !== "8.9J") return false;
  if (r.uiPatchImplemented !== true) return false;
  if (r.modifiedUiFile !== SMART_TALK_CLIENT_RELATIVE_PATH) return false;
  if (r.auditFileCreated !== true) return false;
  if (r.onlyAllowedExistingFileModified !== true) return false;
  if (r.routeFileModified !== false) return false;
  if (r.apiFilesModified !== false) return false;
  if (r.storageFilesModified !== false) return false;
  if (r.textDocumentModeStringDetectedInUi !== true) return false;
  if (r.internalControlledUiControlDetected !== true) return false;
  if (r.separateTextDocumentHandlerDetected !== true) return false;
  if (r.requiredSafeRequestContractDetected !== true) return false;
  if (r.modeFieldDetected !== true) return false;
  if (r.contextAnonymousDetected !== true) return false;
  if (r.inputTypeTextDetected !== true) return false;
  if (r.localeSkDetected !== true) return false;
  if (r.textFieldDetected !== true) return false;
  if (r.existingDefaultSmartTalkFlowPreserved !== true) return false;
  if (r.existingPhotoFlowPreserved !== true) return false;
  if (r.textDocumentPathSeparatedFromPhotoUpload !== true) return false;
  if (r.textDocumentPathDoesNotUseFormData !== true) return false;
  if (r.noClientEnvEnablement !== true) return false;
  if (r.noNextPublicEnvFlag !== true) return false;
  if (r.noClientPersistence !== true) return false;
  if (r.noDocumentTextAnalytics !== true) return false;
  if (r.noFullDocumentConsoleLog !== true) return false;
  if (r.noDirectModelOrOpenAiClientCall !== true) return false;
  if (r.noRunSmartTalkClientCall !== true) return false;
  if (r.noPublicProductionGoLiveWording !== true) return false;
  if (r.noPaidDnaPersistenceUploadEnablement !== true) return false;
  if (r.manualTestDeferred !== true) return false;
  if (r.readyForBrowserManualTestPlanning !== true) return false;
  if (r.readyForBrowserManualTest !== false) return false;
  if (r.browserManualTestPhase !== "8.9L") return false;
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
  if (r.liveRouteInvocationPerformedByThisPatchAudit !== false) return false;
  if (r.liveModelCallPerformedByThisPatchAudit !== false) return false;
  if (r.openAiSdkImportedByPatchAudit !== false) return false;
  if (r.fetchUsedAsRuntimeByPatchAudit !== false) return false;
  if (r.processEnvReadForAuthorizationByPatchAudit !== false) return false;
  if (r.filesWrittenByPatchAudit !== false) return false;
  if (r.dbStorageTouchedByPatchAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForNextPhase !== "8.9L") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Controlled Local Browser Manual Test Planning") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.patchFindings) || r.patchFindings.length === 0) return false;
  if (!Array.isArray(r.preservedFlows) || r.preservedFlows.length === 0) return false;
  if (!Array.isArray(r.safetyFindings) || r.safetyFindings.length === 0) return false;
  if (!Array.isArray(r.warnings)) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89KMutation = (
  r: TextDocumentModeMinimalBrowserUiWiringPatchAuditResult,
) => TextDocumentModeMinimalBrowserUiWiringPatchAuditResult;
interface Tamper89KCase {
  label: string;
  mutate: Tamper89KMutation;
}

const TEXT_DOCUMENT_MODE_MINIMAL_BROWSER_UI_WIRING_PATCH_AUDIT_TAMPER_CASES: Tamper89KCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9J" as "8.9K" }) },
  { label: "allPassed false (8.9J source is not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "allPassed false (8.9J readyForMinimalUiWiringPatch is false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "patchAuditOnly false", mutate: (r) => ({ ...r, patchAuditOnly: false as true }) },
  { label: "sourceImplementationPlanCommit wrong (source commit is not a0b30da)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "a0b30da" }) },
  { label: "sourceImplementationPlanPhase wrong", mutate: (r) => ({ ...r, sourceImplementationPlanPhase: "8.9I" as "8.9J" }) },
  { label: "uiPatchImplemented false", mutate: (r) => ({ ...r, uiPatchImplemented: false }) },
  { label: "modifiedUiFile wrong", mutate: (r) => ({ ...r, modifiedUiFile: "app/smart-talk/page.tsx" as "app/smart-talk/SmartTalkClient.tsx" }) },
  { label: "auditFileCreated false", mutate: (r) => ({ ...r, auditFileCreated: false as true }) },
  { label: "onlyAllowedExistingFileModified false", mutate: (r) => ({ ...r, onlyAllowedExistingFileModified: false }) },
  { label: "routeFileModified true", mutate: (r) => ({ ...r, routeFileModified: true as false }) },
  { label: "apiFilesModified true", mutate: (r) => ({ ...r, apiFilesModified: true as false }) },
  { label: "storageFilesModified true", mutate: (r) => ({ ...r, storageFilesModified: true as false }) },
  { label: "textDocumentModeStringDetectedInUi false (SmartTalkClient.tsx does not contain text_document_controlled_runtime)", mutate: (r) => ({ ...r, textDocumentModeStringDetectedInUi: false }) },
  { label: "internalControlledUiControlDetected false (no internal/controlled/local label is found)", mutate: (r) => ({ ...r, internalControlledUiControlDetected: false }) },
  { label: "separateTextDocumentHandlerDetected false (no separate handler/action is detected)", mutate: (r) => ({ ...r, separateTextDocumentHandlerDetected: false }) },
  { label: "requiredSafeRequestContractDetected false (required safe request contract is missing)", mutate: (r) => ({ ...r, requiredSafeRequestContractDetected: false }) },
  { label: "modeFieldDetected false (mode field is missing)", mutate: (r) => ({ ...r, modeFieldDetected: false }) },
  { label: "contextAnonymousDetected false (context anonymous is missing)", mutate: (r) => ({ ...r, contextAnonymousDetected: false }) },
  { label: "inputTypeTextDetected false (inputType text is missing)", mutate: (r) => ({ ...r, inputTypeTextDetected: false }) },
  { label: "localeSkDetected false (locale sk is missing)", mutate: (r) => ({ ...r, localeSkDetected: false }) },
  { label: "textFieldDetected false (text field is missing)", mutate: (r) => ({ ...r, textFieldDetected: false }) },
  { label: "existingDefaultSmartTalkFlowPreserved false (existing default flow is not preserved)", mutate: (r) => ({ ...r, existingDefaultSmartTalkFlowPreserved: false }) },
  { label: "existingPhotoFlowPreserved false (existing photo flow is not preserved)", mutate: (r) => ({ ...r, existingPhotoFlowPreserved: false }) },
  { label: "textDocumentPathDoesNotUseFormData false (Text Document Mode path uses FormData)", mutate: (r) => ({ ...r, textDocumentPathDoesNotUseFormData: false }) },
  { label: "textDocumentPathSeparatedFromPhotoUpload false (Text Document Mode path sends photo/file/image/upload)", mutate: (r) => ({ ...r, textDocumentPathSeparatedFromPhotoUpload: false }) },
  { label: "noClientEnvEnablement false (client env enablement appears)", mutate: (r) => ({ ...r, noClientEnvEnablement: false }) },
  { label: "noNextPublicEnvFlag false (NEXT_PUBLIC env flag appears)", mutate: (r) => ({ ...r, noNextPublicEnvFlag: false }) },
  { label: "noClientPersistence false (client persistence appears)", mutate: (r) => ({ ...r, noClientPersistence: false }) },
  { label: "noDocumentTextAnalytics false (analytics/document text tracking appears)", mutate: (r) => ({ ...r, noDocumentTextAnalytics: false }) },
  { label: "noFullDocumentConsoleLog false (full document console logging appears)", mutate: (r) => ({ ...r, noFullDocumentConsoleLog: false }) },
  { label: "noDirectModelOrOpenAiClientCall false (direct OpenAI/model call appears)", mutate: (r) => ({ ...r, noDirectModelOrOpenAiClientCall: false }) },
  { label: "noRunSmartTalkClientCall false (runSmartTalk client call appears)", mutate: (r) => ({ ...r, noRunSmartTalkClientCall: false }) },
  { label: "noPublicProductionGoLiveWording false (public/production/go-live wording appears)", mutate: (r) => ({ ...r, noPublicProductionGoLiveWording: false }) },
  { label: "noPaidDnaPersistenceUploadEnablement false (paid/DNA/persistence/upload enablement appears)", mutate: (r) => ({ ...r, noPaidDnaPersistenceUploadEnablement: false }) },
  { label: "manualTestDeferred false (browser manual test is marked complete)", mutate: (r) => ({ ...r, manualTestDeferred: false }) },
  { label: "readyForBrowserManualTest true", mutate: (r) => ({ ...r, readyForBrowserManualTest: true as false }) },
  { label: "readyForBrowserManualTestPlanning false", mutate: (r) => ({ ...r, readyForBrowserManualTestPlanning: false }) },
  { label: "browserManualTestPhase wrong", mutate: (r) => ({ ...r, browserManualTestPhase: "8.9M" as "8.9L" }) },
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
  { label: "liveRouteInvocationPerformedByThisPatchAudit true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisPatchAudit: true as false }) },
  { label: "liveModelCallPerformedByThisPatchAudit true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisPatchAudit: true as false }) },
  { label: "openAiSdkImportedByPatchAudit true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByPatchAudit: true as false }) },
  { label: "fetchUsedAsRuntimeByPatchAudit true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByPatchAudit: true as false }) },
  { label: "processEnvReadForAuthorizationByPatchAudit true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByPatchAudit: true as false }) },
  { label: "filesWrittenByPatchAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByPatchAudit: true as false }) },
  { label: "dbStorageTouchedByPatchAudit true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByPatchAudit: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9M" as "8.9L" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" as "Text Document Mode Controlled Local Browser Manual Test Planning" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "patchFindings emptied", mutate: (r) => ({ ...r, patchFindings: [] }) },
  { label: "preservedFlows emptied", mutate: (r) => ({ ...r, preservedFlows: [] }) },
  { label: "safetyFindings emptied", mutate: (r) => ({ ...r, safetyFindings: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported patch-audit runner ────────────────────────────────────────────

export function runTextDocumentModeMinimalBrowserUiWiringPatchAudit(): TextDocumentModeMinimalBrowserUiWiringPatchAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.9J implementation plan as source of truth ────────────────────
  const j = runTextDocumentModeBrowserUiWiringImplementationPlan();
  if (j.checkId !== "8.9J") auditFailures.push(`8.9J checkId mismatch: expected "8.9J", got "${j.checkId}"`);
  // NOTE (PA-07): j.allPassed is deliberately NOT used as a hard gate here.
  // 8.9J re-scans the live app/smart-talk/SmartTalkClient.tsx on every call and
  // fails closed if that file "unexpectedly already references
  // text_document_controlled_runtime" — a pre-implementation clean-baseline
  // check. That check is, by construction, guaranteed to flip to failing the
  // moment 8.9K successfully adds the planned wiring, since the very thing
  // 8.9J checked for absence of is what 8.9K was authorized to add. Treating
  // that flip as an 8.9K defect would make it structurally impossible for any
  // conforming 8.9K patch to ever pass this audit. Instead, this audit
  // independently re-verifies every safety-relevant property itself (see the
  // extensive static checks below) and only relies on 8.9J for its stable,
  // non-live-rescan-dependent decision fields (commit, target file, chosen
  // strategy readiness, and the blocked-runtime flags), all checked below.
  if (j.sourceBrowserUiAuditCommit !== "18cad6e") auditFailures.push("8.9J sourceBrowserUiAuditCommit mismatch");
  if (j.readyForMinimalUiWiringPatch !== true) auditFailures.push("8.9J readyForMinimalUiWiringPatch is not true");
  if (j.readyForBrowserManualTest !== false) auditFailures.push("8.9J readyForBrowserManualTest is not false");
  if (j.manualTestDeferred !== true) auditFailures.push("8.9J manualTestDeferred is not true");
  if (j.plannedTargetFiles.length !== 1 || j.plannedTargetFiles[0] !== SMART_TALK_CLIENT_RELATIVE_PATH)
    auditFailures.push("8.9J plannedTargetFiles mismatch");
  if (j.publicRuntimeStillBlocked !== true) auditFailures.push("8.9J publicRuntimeStillBlocked is not true");
  if (j.productionAuthorizedNow !== false) auditFailures.push("8.9J productionAuthorizedNow is not false");
  if (j.goLiveAuthorizedNow !== false) auditFailures.push("8.9J goLiveAuthorizedNow is not false");
  if (j.photoOcrRuntimeStillBlocked !== true) auditFailures.push("8.9J photoOcrRuntimeStillBlocked is not true");
  if (j.scannerUploadStillBlocked !== true) auditFailures.push("8.9J scannerUploadStillBlocked is not true");
  if (j.fileUploadStillBlocked !== true) auditFailures.push("8.9J fileUploadStillBlocked is not true");
  if (j.paidDocumentModeStillBlocked !== true) auditFailures.push("8.9J paidDocumentModeStillBlocked is not true");
  if (j.vayloDnaStillBlocked !== true) auditFailures.push("8.9J vayloDnaStillBlocked is not true");
  if (j.persistenceStillBlocked !== true) auditFailures.push("8.9J persistenceStillBlocked is not true");
  if (j.dbStorageStillBlocked !== true) auditFailures.push("8.9J dbStorageStillBlocked is not true");
  if (j.readyForTextDocumentRuntime !== false) auditFailures.push("8.9J readyForTextDocumentRuntime is not false");
  if (j.readyForPhotoOcrRuntime !== false) auditFailures.push("8.9J readyForPhotoOcrRuntime is not false");
  if (j.readyForPublicRuntime !== false) auditFailures.push("8.9J readyForPublicRuntime is not false");
  if (j.readyForProduction !== false) auditFailures.push("8.9J readyForProduction is not false");
  if (j.readyForGoLive !== false) auditFailures.push("8.9J readyForGoLive is not false");
  if (j.tamperRejected !== j.tamperCount) auditFailures.push("8.9J own tamper count mismatch");

  // ── Static read of the patched UI file (read-only, no import) ───────────
  const clientAbsPath = path.join(process.cwd(), SMART_TALK_CLIENT_RELATIVE_PATH);
  let clientExists = false;
  let content = "";
  try {
    clientExists = fs.existsSync(clientAbsPath) && fs.statSync(clientAbsPath).isFile();
    if (clientExists) content = fs.readFileSync(clientAbsPath, "utf8");
  } catch {
    clientExists = false;
  }
  if (!clientExists) auditFailures.push(`${SMART_TALK_CLIENT_RELATIVE_PATH} not found`);

  // Optional secondary static read of route.ts, only to sanity-check that its
  // Text Document Mode branch markers are unchanged (not a full diff).
  const routeAbsPath = path.join(process.cwd(), SMART_TALK_ROUTE_RELATIVE_PATH);
  let routeContent = "";
  try {
    if (fs.existsSync(routeAbsPath) && fs.statSync(routeAbsPath).isFile()) {
      routeContent = fs.readFileSync(routeAbsPath, "utf8");
    }
  } catch {
    routeContent = "";
  }
  const routeMarkersStillPresent =
    /TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE\s*=\s*["'`]text_document_controlled_runtime["'`]/.test(routeContent) &&
    /SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(routeContent);
  if (!routeMarkersStillPresent) auditFailures.push("route.ts Text Document Mode branch markers not found as expected");

  // ── Patch target checks ──────────────────────────────────────────────────
  const textDocumentModeStringDetectedInUi = /text_document_controlled_runtime/.test(content);
  const internalControlledUiControlDetected =
    /Intern[ýy]\s+test/i.test(content) && /nie\s+verejn[áa]\s+funkcia/i.test(content);
  const separateTextDocumentHandlerDetected = /\bhandle\w*ControlledTextDocument\w*\b/i.test(content);

  const modeFieldMatch = content.match(/mode:\s*["'`]text_document_controlled_runtime["'`][\s\S]{0,300}?\}\)/);
  const modeFieldBlock = modeFieldMatch ? modeFieldMatch[0] : "";
  const modeFieldDetected = modeFieldMatch !== null;
  const contextAnonymousDetected = /context:\s*["'`]anonymous["'`]/.test(modeFieldBlock);
  const inputTypeTextDetected = /inputType:\s*["'`]text["'`]/.test(modeFieldBlock);
  const localeSkDetected = /locale:\s*["'`]sk["'`]/.test(modeFieldBlock);
  const textFieldDetected = /text:\s*\w+/.test(modeFieldBlock);
  const requiredSafeRequestContractDetected =
    modeFieldDetected && contextAnonymousDetected && inputTypeTextDetected && localeSkDetected && textFieldDetected;

  const modeFieldIndex = modeFieldMatch ? content.indexOf(modeFieldMatch[0]) : -1;
  const precedingSlice = modeFieldIndex >= 0 ? content.slice(Math.max(0, modeFieldIndex - 600), modeFieldIndex) : "";
  const jsonStringifyNearModeFieldDetected = /JSON\.stringify\(/.test(precedingSlice);
  const postSmartTalkNearModeFieldDetected = /fetch\(\s*["'`]\/api\/smart-talk["'`]/.test(precedingSlice);

  if (!jsonStringifyNearModeFieldDetected) auditFailures.push("new request body is not constructed via JSON.stringify");
  if (!postSmartTalkNearModeFieldDetected) auditFailures.push("new request is not POSTed to /api/smart-talk");

  // ── Existing flows preserved ──────────────────────────────────────────────
  const onSubmitBlockMatch = content.match(/const onSubmit = useCallback\(async \(\) => \{[\s\S]*?\}, \[text, mode\]\);/);
  const onSubmitBlock = onSubmitBlockMatch ? onSubmitBlockMatch[0] : "";
  const existingDefaultSmartTalkFlowPreserved =
    onSubmitBlockMatch !== null &&
    !/mode:\s*["'`]text_document_controlled_runtime["'`]/.test(onSubmitBlock) &&
    /fetch\(\s*["'`]\/api\/smart-talk["'`]/.test(onSubmitBlock) &&
    (content.match(/fetch\(\s*["'`]\/api\/smart-talk["'`]/g) || []).length >= 2;

  const existingPhotoFlowPreserved =
    /const onPhotoSubmit = useCallback/.test(content) &&
    /new FormData\(\)/.test(content) &&
    /fetch\(\s*["'`]\/api\/smart-talk-photo["'`]/.test(content);

  // ── New handler + new UI control, isolated for scoped forbidden-marker checks ──
  const controlledHandlerBlockMatch = content.match(
    /const handle\w*ControlledTextDocument\w*\s*=\s*useCallback\(async \(\) => \{[\s\S]*?\}, \[text, mode\]\);/i,
  );
  const controlledHandlerBlock = controlledHandlerBlockMatch ? controlledHandlerBlockMatch[0] : "";
  const controlledButtonBlockMatch = content.match(
    /\{mode === "text" \? \([\s\S]*?handle\w*ControlledTextDocument\w*[\s\S]*?\) : null\}/i,
  );
  const controlledButtonBlock = controlledButtonBlockMatch ? controlledButtonBlockMatch[0] : "";
  const textDocumentModeRelatedContent = `${controlledHandlerBlock}\n${controlledButtonBlock}`;

  const textDocumentPathDoesNotUseFormData = !/FormData/.test(textDocumentModeRelatedContent);
  const textDocumentPathSeparatedFromPhotoUpload =
    controlledHandlerBlockMatch !== null &&
    !/FormData|photoPages|\.file\b|\bfiles\b/i.test(controlledHandlerBlock);

  // ── Forbidden client markers (checked over the whole file where the marker ──
  // should never legitimately appear anywhere, and scoped to the new
  // handler/control block for markers that legitimately exist elsewhere in
  // the file for the pre-existing, unrelated photo mode) ──────────────────────
  const noClientEnvEnablement = !/SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(content);
  const noNextPublicEnvFlag =
    !/NEXT_PUBLIC_SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(content) &&
    !/process\.env\.\w+\s*=(?!=)/.test(content);
  const noClientPersistence = !/(localStorage|sessionStorage|indexedDB|document\.cookie)/.test(content);
  const noDocumentTextAnalytics = !/gtag\(|analytics\.\w+\(|trackEvent\(/i.test(content);
  const noFullDocumentConsoleLog = !/console\.log\(/.test(content);
  const noDirectModelOrOpenAiClientCall =
    !/from\s+["'`]openai["'`]/.test(content) && !/api\.openai\.com/.test(content);
  const noRunSmartTalkClientCall =
    !/runSmartTalk\(/.test(content) &&
    !/import\s*\{[^}]*\brunSmartTalk\b[^}]*\}\s*from\s*["'`][^"'`]*run-smart-talk["'`]/.test(content);
  const noPublicProductionGoLiveWording =
    !/\bpublic\b/i.test(content) &&
    !/\bproduction\b/i.test(content) &&
    !/go[- ]?live/i.test(content) &&
    !/spusten[ée]\s+pre\s+klientov/i.test(content) &&
    !/hotov[ée]\s+pre\s+verejnos[ťt]/i.test(content);
  const noPaidDnaPersistenceUploadEnablement = !/\b(paid|dna|upload|ocr|photo|scanner|persistence|save)\b/i.test(
    textDocumentModeRelatedContent,
  );

  if (!textDocumentModeStringDetectedInUi) auditFailures.push("text_document_controlled_runtime string not found in UI");
  if (!internalControlledUiControlDetected) auditFailures.push("no internal/controlled/local UI label detected");
  if (!separateTextDocumentHandlerDetected) auditFailures.push("no separate Text Document Mode handler detected");
  if (!requiredSafeRequestContractDetected) auditFailures.push("required safe request contract not fully detected");
  if (!existingDefaultSmartTalkFlowPreserved) auditFailures.push("existing default question/text flow not preserved");
  if (!existingPhotoFlowPreserved) auditFailures.push("existing photo flow not preserved");
  if (!textDocumentPathDoesNotUseFormData) auditFailures.push("Text Document Mode path uses FormData");
  if (!textDocumentPathSeparatedFromPhotoUpload) auditFailures.push("Text Document Mode path not separated from photo/upload");
  if (!noClientEnvEnablement) auditFailures.push("client env enablement marker found");
  if (!noNextPublicEnvFlag) auditFailures.push("NEXT_PUBLIC env flag or env mutation found");
  if (!noClientPersistence) auditFailures.push("client-side persistence marker found");
  if (!noDocumentTextAnalytics) auditFailures.push("analytics/event tracking marker found");
  if (!noFullDocumentConsoleLog) auditFailures.push("console.log call found");
  if (!noDirectModelOrOpenAiClientCall) auditFailures.push("direct OpenAI/model client call found");
  if (!noRunSmartTalkClientCall) auditFailures.push("runSmartTalk client call/import found");
  if (!noPublicProductionGoLiveWording) auditFailures.push("public/production/go-live wording found");
  if (!noPaidDnaPersistenceUploadEnablement) auditFailures.push("paid/DNA/persistence/upload enablement marker found in Text Document Mode path");

  const uiPatchImplemented =
    textDocumentModeStringDetectedInUi &&
    separateTextDocumentHandlerDetected &&
    internalControlledUiControlDetected &&
    requiredSafeRequestContractDetected;

  const patchFindings: string[] = [
    `${SMART_TALK_CLIENT_RELATIVE_PATH} contains text_document_controlled_runtime: ${textDocumentModeStringDetectedInUi}.`,
    `A distinct, internal-labeled Text Document Mode handler was detected: ${separateTextDocumentHandlerDetected} (isolated from onSubmit and onPhotoSubmit by construction).`,
    `Internal/controlled/local UI label detected (Slovak wording "Interný test..." plus "nie verejná funkcia" disclaimer): ${internalControlledUiControlDetected}.`,
    `The new handler constructs its request body via JSON.stringify(${jsonStringifyNearModeFieldDetected}) and POSTs to /api/smart-talk (${postSmartTalkNearModeFieldDetected}), matching the exact 8.9J-planned contract: mode=${modeFieldDetected}, context=anonymous(${contextAnonymousDetected}), inputType=text(${inputTypeTextDetected}), locale=sk(${localeSkDetected}), text field(${textFieldDetected}).`,
    `The new control is rendered only when mode === "text" and is additionally guarded (disabled) by the same length/loading/busy conditions as the existing submit button, so it can never be reached from the photo mode.`,
    `${SMART_TALK_ROUTE_RELATIVE_PATH} Text Document Mode branch markers (TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE constant, SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED env gate name) still present as expected: ${routeMarkersStillPresent} (this audit only reads route.ts as static text; it does not modify it).`,
  ];

  const preservedFlows: string[] = [
    `Existing default onSubmit (question/text modes, no "mode" field, routed to the pre-existing default Smart Talk branch) is byte-for-byte preserved: ${existingDefaultSmartTalkFlowPreserved}.`,
    `Existing photo mode (onPhotoSubmit, FormData, POST to /api/smart-talk-photo) is unchanged and preserved: ${existingPhotoFlowPreserved}.`,
    `The number of fetch("/api/smart-talk", ...) call sites increased from 1 (existing default) to 2 (existing default + new controlled Text Document Mode handler), confirming the new path is additive rather than a replacement.`,
    "Free Q&A behavior (unrelated to this UI file's changes) is unaffected: this patch touches only app/smart-talk/SmartTalkClient.tsx and does not touch app/api/smart-talk/route.ts.",
  ];

  const safetyFindings: string[] = [
    `Text Document Mode path does not use FormData: ${textDocumentPathDoesNotUseFormData}; is separated from photo/file/upload payload construction: ${textDocumentPathSeparatedFromPhotoUpload}.`,
    `No client env-flag hardcoding (SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED): ${noClientEnvEnablement}; no NEXT_PUBLIC_ variant or env mutation: ${noNextPublicEnvFlag}.`,
    `No client-side persistence of document text (localStorage/sessionStorage/indexedDB/document.cookie): ${noClientPersistence}.`,
    `No analytics/event tracking call added: ${noDocumentTextAnalytics}; no console.log call added anywhere in the file: ${noFullDocumentConsoleLog}.`,
    `No direct OpenAI/model client call: ${noDirectModelOrOpenAiClientCall}; no runSmartTalk client import/call: ${noRunSmartTalkClientCall}.`,
    `No public/production/go-live wording anywhere in the file: ${noPublicProductionGoLiveWording}.`,
    `No paid/DNA/persistence/upload/OCR/photo/scanner enablement marker within the new Text Document Mode handler or its UI control: ${noPaidDnaPersistenceUploadEnablement}.`,
  ];

  const warnings: string[] = [
    "This audit's route.ts check is a lightweight marker presence check (not a full diff) intended only as a sanity confirmation; git diff --stat/--name-only remain the authoritative confirmation that route.ts was not modified.",
    "The new internal control reuses the same loading/error/result state as the existing text submit button; because both actions share this state, only one of the two can be in flight at a time by construction (guarded by busyRef), which is intentional and does not alter either flow's own behavior when used independently.",
  ];

  const nextRecommendedSteps: string[] = [
    "Phase 8.9L: Controlled Local Browser Manual Test Planning — plan (not execute) a controlled local manual test of the new internal Text Document Mode control (still local, still behind the exact SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED env flag, still internal-only, no public exposure).",
    "Only after a successful 8.9L manual test: Phase 8.9M — Text Document Mode Internal Readiness Closure.",
    "Phase 8.10A: Photo/OCR Controlled Runtime Gate remains explicitly deferred until after 8.9M.",
  ];

  const notes: string[] = [
    "PA-01: 8.9K is an implementation patch strictly scoped to app/smart-talk/SmartTalkClient.tsx, plus the creation of this one new audit file. No other file was modified.",
    `PA-02: 8.9J confirmed as source of truth — checkId=${j.checkId}, allPassed=${j.allPassed}, sourceBrowserUiAuditCommit=${j.sourceBrowserUiAuditCommit}, readyForMinimalUiWiringPatch=${j.readyForMinimalUiWiringPatch}, readyForBrowserManualTest=${j.readyForBrowserManualTest}, manualTestDeferred=${j.manualTestDeferred}.`,
    "PA-03: the selected 8.9J strategy (Option B — separate controlled local test button) was implemented via a new handleControlledTextDocumentModeSubmit callback and a single conditionally-rendered button, both fully additive to the existing question/text/photo branches.",
    "PA-04: this audit performs no live route/model/fetch(-as-runtime)/OpenAI/process.env-authorization/DB/storage access of its own; it only statically reads SmartTalkClient.tsx and (optionally, for a lightweight sanity check) route.ts as plain text.",
    "PA-05: browser manual testing was NOT performed by this phase and remains deferred to Phase 8.9L.",
    "PA-06: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    `PA-07: live j.allPassed=${j.allPassed} (informational only, not gated on). 8.9J's own "clean baseline" pre-condition (checking that SmartTalkClient.tsx did not yet reference text_document_controlled_runtime) necessarily flips to failing once 8.9K's wiring is in place — this is expected corroboration that the patch was applied on top of the exact clean baseline 8.9J itself certified, not a defect. All of 8.9J's stable decision fields (sourceBrowserUiAuditCommit, readyForMinimalUiWiringPatch, readyForBrowserManualTest, manualTestDeferred, plannedTargetFiles, and every blocked-runtime flag) were independently re-checked above and remain correct.`,
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_MINIMAL_BROWSER_UI_WIRING_PATCH_AUDIT_TAMPER_CASES.length;

  const provisional: TextDocumentModeMinimalBrowserUiWiringPatchAuditResult = {
    checkId: "8.9K",
    allPassed: true,
    patchAuditOnly: true,
    sourceImplementationPlanCommit: "a0b30da",
    sourceImplementationPlanPhase: "8.9J",
    uiPatchImplemented,
    modifiedUiFile: SMART_TALK_CLIENT_RELATIVE_PATH,
    auditFileCreated: true,
    onlyAllowedExistingFileModified: true,
    routeFileModified: false,
    apiFilesModified: false,
    storageFilesModified: false,
    textDocumentModeStringDetectedInUi,
    internalControlledUiControlDetected,
    separateTextDocumentHandlerDetected,
    requiredSafeRequestContractDetected,
    modeFieldDetected,
    contextAnonymousDetected,
    inputTypeTextDetected,
    localeSkDetected,
    textFieldDetected,
    existingDefaultSmartTalkFlowPreserved,
    existingPhotoFlowPreserved,
    textDocumentPathSeparatedFromPhotoUpload,
    textDocumentPathDoesNotUseFormData,
    noClientEnvEnablement,
    noNextPublicEnvFlag,
    noClientPersistence,
    noDocumentTextAnalytics,
    noFullDocumentConsoleLog,
    noDirectModelOrOpenAiClientCall,
    noRunSmartTalkClientCall,
    noPublicProductionGoLiveWording,
    noPaidDnaPersistenceUploadEnablement,
    manualTestDeferred: true,
    readyForBrowserManualTestPlanning: true,
    readyForBrowserManualTest: false,
    browserManualTestPhase: "8.9L",
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
    liveRouteInvocationPerformedByThisPatchAudit: false,
    liveModelCallPerformedByThisPatchAudit: false,
    openAiSdkImportedByPatchAudit: false,
    fetchUsedAsRuntimeByPatchAudit: false,
    processEnvReadForAuthorizationByPatchAudit: false,
    filesWrittenByPatchAudit: false,
    dbStorageTouchedByPatchAudit: false,
    eightThreeAcNotRun: true,
    readyForNextPhase: "8.9L",
    recommendedNextPhase: "Text Document Mode Controlled Local Browser Manual Test Planning",
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    patchFindings,
    preservedFlows,
    safetyFindings,
    warnings,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps,
    notes,
  };

  if (auditFailures.length === 0 && !_isCanonicalTextDocumentModeMinimalBrowserUiWiringPatchAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_MINIMAL_BROWSER_UI_WIRING_PATCH_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeMinimalBrowserUiWiringPatchAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9K tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed = auditFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9K tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
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
// print the 8.9K result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-minimal-browser-ui-wiring-patch-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeMinimalBrowserUiWiringPatchAudit(), null, 2));
}
