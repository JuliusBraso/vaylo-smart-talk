/**
 * PHASE 8.9L — Text Document Mode Controlled Local Browser Manual Test Planning
 *
 * Planning-only. Defines the exact manual browser test protocol for the
 * future controlled local execution phase (8.9M), using the internal
 * "Interný test: Text Document Mode" control added in 8.9K.
 *
 * This file does NOT execute the browser manual test. It does not start a
 * dev server, does not open a browser, does not click UI, does not call
 * fetch/route handlers/runSmartTalk/OpenAI, does not read process.env for
 * authorization, does not touch DB/storage, and does not run 8.3AC or touch
 * tmp-8-3ac-live-metadata.ts. It only statically reads
 * app/smart-talk/SmartTalkClient.tsx and app/api/smart-talk/route.ts as plain
 * text to confirm both are ready for the planned manual test, and calls the
 * 8.9K patch audit as its source of truth.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeMinimalBrowserUiWiringPatchAudit } from "./run-text-document-mode-minimal-browser-ui-wiring-patch-audit";

const SMART_TALK_CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_ROUTE_RELATIVE_PATH = "app/api/smart-talk/route.ts";

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeControlledLocalBrowserManualTestPlanningResult {
  checkId: "8.9L";
  allPassed: boolean;
  planningOnly: true;
  sourceMinimalUiWiringCommit: "e7d47c5";
  sourceMinimalUiWiringPhase: "8.9K";
  manualBrowserTestNotPerformedByThisPhase: true;
  sourcePatchAuditAccepted: boolean;
  uiInternalControlReadyForManualTest: boolean;
  routeReadyForControlledManualTest: boolean;
  offScenarioPlanned: true;
  onScenarioPlanned: true;
  blockedRiskScenariosPlanned: true;
  rateLimitHandlingPlanned: true;
  cleanupProtocolPlanned: true;
  evidenceCaptureProtocolPlanned: true;
  expectedOffScenarioStatus: 403;
  expectedOffScenarioCode: "text_document_mode_disabled";
  expectedOnScenarioStatus: 200;
  expectedOnScenarioOk: true;
  expectedOnScenarioMode: "text_document_controlled_runtime";
  expectedInternalButtonLabel: "Interný test: Text Document Mode";
  expectedEnvFlagName: "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED";
  expectedEnvFlagExactValue: "true";
  browserManualTestPhase: "8.9M";
  readyForControlledLocalBrowserManualTestExecution: boolean;
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
  liveRouteInvocationPerformedByThisPlanning: false;
  liveModelCallPerformedByThisPlanning: false;
  openAiSdkImportedByPlanning: false;
  fetchUsedAsRuntimeByPlanning: false;
  processEnvReadForAuthorizationByPlanning: false;
  filesWrittenByPlanning: false;
  dbStorageTouchedByPlanning: false;
  eightThreeAcNotRun: true;
  readyForNextPhase: "8.9M";
  recommendedNextPhase: "Text Document Mode Controlled Local Browser Manual Test Execution";
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  preTestChecklist: string[];
  offScenarioSteps: string[];
  onScenarioSteps: string[];
  blockedRiskScenarioSteps: string[];
  rateLimitHandlingSteps: string[];
  cleanupSteps: string[];
  evidenceToCapture: string[];
  expectedResults: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Controlled local browser manual test not executed yet",
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

function _isCanonicalTextDocumentModeControlledLocalBrowserManualTestPlanningResult(
  r: TextDocumentModeControlledLocalBrowserManualTestPlanningResult,
): boolean {
  if (r.checkId !== "8.9L") return false;
  if (r.allPassed !== true) return false;
  if (r.planningOnly !== true) return false;
  if (r.sourceMinimalUiWiringCommit !== "e7d47c5") return false;
  if (r.sourceMinimalUiWiringPhase !== "8.9K") return false;
  if (r.manualBrowserTestNotPerformedByThisPhase !== true) return false;
  if (r.sourcePatchAuditAccepted !== true) return false;
  if (r.uiInternalControlReadyForManualTest !== true) return false;
  if (r.routeReadyForControlledManualTest !== true) return false;
  if (r.offScenarioPlanned !== true) return false;
  if (r.onScenarioPlanned !== true) return false;
  if (r.blockedRiskScenariosPlanned !== true) return false;
  if (r.rateLimitHandlingPlanned !== true) return false;
  if (r.cleanupProtocolPlanned !== true) return false;
  if (r.evidenceCaptureProtocolPlanned !== true) return false;
  if (r.expectedOffScenarioStatus !== 403) return false;
  if (r.expectedOffScenarioCode !== "text_document_mode_disabled") return false;
  if (r.expectedOnScenarioStatus !== 200) return false;
  if (r.expectedOnScenarioOk !== true) return false;
  if (r.expectedOnScenarioMode !== "text_document_controlled_runtime") return false;
  if (r.expectedInternalButtonLabel !== "Interný test: Text Document Mode") return false;
  if (r.expectedEnvFlagName !== "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED") return false;
  if (r.expectedEnvFlagExactValue !== "true") return false;
  if (r.browserManualTestPhase !== "8.9M") return false;
  if (r.readyForControlledLocalBrowserManualTestExecution !== true) return false;
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
  if (r.liveRouteInvocationPerformedByThisPlanning !== false) return false;
  if (r.liveModelCallPerformedByThisPlanning !== false) return false;
  if (r.openAiSdkImportedByPlanning !== false) return false;
  if (r.fetchUsedAsRuntimeByPlanning !== false) return false;
  if (r.processEnvReadForAuthorizationByPlanning !== false) return false;
  if (r.filesWrittenByPlanning !== false) return false;
  if (r.dbStorageTouchedByPlanning !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForNextPhase !== "8.9M") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Controlled Local Browser Manual Test Execution") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.preTestChecklist) || r.preTestChecklist.length === 0) return false;
  if (!Array.isArray(r.offScenarioSteps) || r.offScenarioSteps.length === 0) return false;
  if (!Array.isArray(r.onScenarioSteps) || r.onScenarioSteps.length === 0) return false;
  if (!Array.isArray(r.blockedRiskScenarioSteps) || r.blockedRiskScenarioSteps.length === 0) return false;
  if (!Array.isArray(r.rateLimitHandlingSteps) || r.rateLimitHandlingSteps.length === 0) return false;
  if (!Array.isArray(r.cleanupSteps) || r.cleanupSteps.length === 0) return false;
  if (!Array.isArray(r.evidenceToCapture) || r.evidenceToCapture.length === 0) return false;
  if (!Array.isArray(r.expectedResults) || r.expectedResults.length === 0) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89LMutation = (
  r: TextDocumentModeControlledLocalBrowserManualTestPlanningResult,
) => TextDocumentModeControlledLocalBrowserManualTestPlanningResult;
interface Tamper89LCase {
  label: string;
  mutate: Tamper89LMutation;
}

const TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES: Tamper89LCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9K" as "8.9L" }) },
  { label: "allPassed false (8.9K source is not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "planningOnly false", mutate: (r) => ({ ...r, planningOnly: false as true }) },
  { label: "sourceMinimalUiWiringCommit wrong (source commit is not e7d47c5)", mutate: (r) => ({ ...r, sourceMinimalUiWiringCommit: "0000000" as "e7d47c5" }) },
  { label: "sourceMinimalUiWiringPhase wrong", mutate: (r) => ({ ...r, sourceMinimalUiWiringPhase: "8.9J" as "8.9K" }) },
  { label: "manualBrowserTestNotPerformedByThisPhase false (claims browser test performed)", mutate: (r) => ({ ...r, manualBrowserTestNotPerformedByThisPhase: false as true }) },
  { label: "sourcePatchAuditAccepted false", mutate: (r) => ({ ...r, sourcePatchAuditAccepted: false }) },
  { label: "uiInternalControlReadyForManualTest false (internal UI control is missing)", mutate: (r) => ({ ...r, uiInternalControlReadyForManualTest: false }) },
  { label: "routeReadyForControlledManualTest false (route env flag is missing)", mutate: (r) => ({ ...r, routeReadyForControlledManualTest: false }) },
  { label: "offScenarioPlanned false (OFF scenario is not planned)", mutate: (r) => ({ ...r, offScenarioPlanned: false as true }) },
  { label: "onScenarioPlanned false (ON scenario is not planned)", mutate: (r) => ({ ...r, onScenarioPlanned: false as true }) },
  { label: "blockedRiskScenariosPlanned false (blocked-risk scenarios are not planned)", mutate: (r) => ({ ...r, blockedRiskScenariosPlanned: false as true }) },
  { label: "rateLimitHandlingPlanned false", mutate: (r) => ({ ...r, rateLimitHandlingPlanned: false as true }) },
  { label: "cleanupProtocolPlanned false (cleanup protocol is not planned)", mutate: (r) => ({ ...r, cleanupProtocolPlanned: false as true }) },
  { label: "evidenceCaptureProtocolPlanned false (evidence capture protocol is not planned)", mutate: (r) => ({ ...r, evidenceCaptureProtocolPlanned: false as true }) },
  { label: "expectedOffScenarioStatus wrong", mutate: (r) => ({ ...r, expectedOffScenarioStatus: 200 as 403 }) },
  { label: "expectedOffScenarioCode wrong", mutate: (r) => ({ ...r, expectedOffScenarioCode: "ok" as "text_document_mode_disabled" }) },
  { label: "expectedOnScenarioStatus wrong", mutate: (r) => ({ ...r, expectedOnScenarioStatus: 403 as 200 }) },
  { label: "expectedOnScenarioOk false", mutate: (r) => ({ ...r, expectedOnScenarioOk: false as true }) },
  { label: "expectedOnScenarioMode wrong", mutate: (r) => ({ ...r, expectedOnScenarioMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "expectedInternalButtonLabel wrong", mutate: (r) => ({ ...r, expectedInternalButtonLabel: "Public Text Document Mode" as "Interný test: Text Document Mode" }) },
  { label: "expectedEnvFlagName wrong", mutate: (r) => ({ ...r, expectedEnvFlagName: "SMART_TALK_FREE_QA_PUBLIC_ENABLED" as "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED" }) },
  { label: "expectedEnvFlagExactValue wrong", mutate: (r) => ({ ...r, expectedEnvFlagExactValue: "1" as "true" }) },
  { label: "browserManualTestPhase wrong", mutate: (r) => ({ ...r, browserManualTestPhase: "8.9L" as "8.9M" }) },
  { label: "readyForControlledLocalBrowserManualTestExecution false", mutate: (r) => ({ ...r, readyForControlledLocalBrowserManualTestExecution: false }) },
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
  { label: "liveRouteInvocationPerformedByThisPlanning true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisPlanning: true as false }) },
  { label: "liveModelCallPerformedByThisPlanning true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisPlanning: true as false }) },
  { label: "openAiSdkImportedByPlanning true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByPlanning: true as false }) },
  { label: "fetchUsedAsRuntimeByPlanning true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByPlanning: true as false }) },
  { label: "processEnvReadForAuthorizationByPlanning true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByPlanning: true as false }) },
  { label: "filesWrittenByPlanning true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByPlanning: true as false }) },
  { label: "dbStorageTouchedByPlanning true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByPlanning: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9L" as "8.9M" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" as "Text Document Mode Controlled Local Browser Manual Test Execution" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "preTestChecklist emptied", mutate: (r) => ({ ...r, preTestChecklist: [] }) },
  { label: "offScenarioSteps emptied", mutate: (r) => ({ ...r, offScenarioSteps: [] }) },
  { label: "onScenarioSteps emptied", mutate: (r) => ({ ...r, onScenarioSteps: [] }) },
  { label: "blockedRiskScenarioSteps emptied", mutate: (r) => ({ ...r, blockedRiskScenarioSteps: [] }) },
  { label: "rateLimitHandlingSteps emptied", mutate: (r) => ({ ...r, rateLimitHandlingSteps: [] }) },
  { label: "cleanupSteps emptied", mutate: (r) => ({ ...r, cleanupSteps: [] }) },
  { label: "evidenceToCapture emptied", mutate: (r) => ({ ...r, evidenceToCapture: [] }) },
  { label: "expectedResults emptied", mutate: (r) => ({ ...r, expectedResults: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported planning runner ───────────────────────────────────────────────

export function runTextDocumentModeControlledLocalBrowserManualTestPlanning(): TextDocumentModeControlledLocalBrowserManualTestPlanningResult {
  const planFailures: string[] = [];

  // ── Call 8.9K patch audit as source of truth ─────────────────────────────
  const k = runTextDocumentModeMinimalBrowserUiWiringPatchAudit();
  if (k.checkId !== "8.9K") planFailures.push(`8.9K checkId mismatch: expected "8.9K", got "${k.checkId}"`);
  if (k.allPassed !== true) planFailures.push("8.9K allPassed is not true");
  if (k.sourceImplementationPlanCommit !== "a0b30da") planFailures.push("8.9K sourceImplementationPlanCommit mismatch");
  if (k.readyForBrowserManualTestPlanning !== true) planFailures.push("8.9K readyForBrowserManualTestPlanning is not true");
  if (k.readyForBrowserManualTest !== false) planFailures.push("8.9K readyForBrowserManualTest is not false");
  if (k.manualTestDeferred !== true) planFailures.push("8.9K manualTestDeferred is not true");
  if (k.browserManualTestPhase !== "8.9L") planFailures.push("8.9K browserManualTestPhase mismatch");
  if (k.publicRuntimeStillBlocked !== true) planFailures.push("8.9K publicRuntimeStillBlocked is not true");
  if (k.productionAuthorizedNow !== false) planFailures.push("8.9K productionAuthorizedNow is not false");
  if (k.goLiveAuthorizedNow !== false) planFailures.push("8.9K goLiveAuthorizedNow is not false");
  if (k.photoOcrRuntimeStillBlocked !== true) planFailures.push("8.9K photoOcrRuntimeStillBlocked is not true");
  if (k.scannerUploadStillBlocked !== true) planFailures.push("8.9K scannerUploadStillBlocked is not true");
  if (k.fileUploadStillBlocked !== true) planFailures.push("8.9K fileUploadStillBlocked is not true");
  if (k.paidDocumentModeStillBlocked !== true) planFailures.push("8.9K paidDocumentModeStillBlocked is not true");
  if (k.vayloDnaStillBlocked !== true) planFailures.push("8.9K vayloDnaStillBlocked is not true");
  if (k.persistenceStillBlocked !== true) planFailures.push("8.9K persistenceStillBlocked is not true");
  if (k.dbStorageStillBlocked !== true) planFailures.push("8.9K dbStorageStillBlocked is not true");
  if (k.readyForTextDocumentRuntime !== false) planFailures.push("8.9K readyForTextDocumentRuntime is not false");
  if (k.readyForPhotoOcrRuntime !== false) planFailures.push("8.9K readyForPhotoOcrRuntime is not false");
  if (k.readyForPublicRuntime !== false) planFailures.push("8.9K readyForPublicRuntime is not false");
  if (k.readyForProduction !== false) planFailures.push("8.9K readyForProduction is not false");
  if (k.readyForGoLive !== false) planFailures.push("8.9K readyForGoLive is not false");
  if (k.tamperRejected !== k.tamperCount) planFailures.push("8.9K own tamper count mismatch");
  const sourcePatchAuditAccepted = planFailures.length === 0;

  // ── Static read of the UI file (read-only, no import) ────────────────────
  const clientAbsPath = path.join(process.cwd(), SMART_TALK_CLIENT_RELATIVE_PATH);
  let clientContent = "";
  try {
    if (fs.existsSync(clientAbsPath) && fs.statSync(clientAbsPath).isFile()) {
      clientContent = fs.readFileSync(clientAbsPath, "utf8");
    } else {
      planFailures.push(`${SMART_TALK_CLIENT_RELATIVE_PATH} not found`);
    }
  } catch {
    planFailures.push(`${SMART_TALK_CLIENT_RELATIVE_PATH} could not be read`);
  }

  const uiHasButtonLabel = /Intern[ýy]\s+test:\s+Text Document Mode/.test(clientContent);
  const uiHasModeString = /text_document_controlled_runtime/.test(clientContent);
  const uiHasHandler = /\bhandleControlledTextDocumentModeSubmit\b/.test(clientContent);
  const uiHasContextAnonymous = /context:\s*["'`]anonymous["'`]/.test(clientContent);
  const uiHasInputTypeText = /inputType:\s*["'`]text["'`]/.test(clientContent);
  const uiHasLocaleSk = /locale:\s*["'`]sk["'`]/.test(clientContent);
  const uiHasApiSmartTalk = /\/api\/smart-talk["'`]/.test(clientContent);
  const uiHasNoClientEnvEnablement = !/SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(clientContent);
  const uiHasNoNextPublicEnvFlag = !/NEXT_PUBLIC_SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(clientContent);
  const uiHasNoClientPersistence = !/(localStorage|sessionStorage|indexedDB|document\.cookie)/.test(clientContent);
  const uiHasNoDirectModelOrOpenAiCall =
    !/from\s+["'`]openai["'`]/.test(clientContent) && !/api\.openai\.com/.test(clientContent);
  const uiHasNoRunSmartTalkClientCall = !/runSmartTalk\(/.test(clientContent);
  const uiHasNoPublicProductionGoLiveWording =
    !/\bpublic\b/i.test(clientContent) &&
    !/\bproduction\b/i.test(clientContent) &&
    !/go[- ]?live/i.test(clientContent);

  if (!uiHasButtonLabel) planFailures.push('UI does not contain "Interný test: Text Document Mode"');
  if (!uiHasModeString) planFailures.push("UI does not contain text_document_controlled_runtime");
  if (!uiHasHandler) planFailures.push("UI does not contain handleControlledTextDocumentModeSubmit");
  if (!uiHasContextAnonymous) planFailures.push('UI does not contain context: "anonymous"');
  if (!uiHasInputTypeText) planFailures.push('UI does not contain inputType: "text"');
  if (!uiHasLocaleSk) planFailures.push('UI does not contain locale: "sk"');
  if (!uiHasApiSmartTalk) planFailures.push("UI does not contain /api/smart-talk");
  if (!uiHasNoClientEnvEnablement) planFailures.push("UI contains client env enablement marker");
  if (!uiHasNoNextPublicEnvFlag) planFailures.push("UI contains NEXT_PUBLIC text document env flag");
  if (!uiHasNoClientPersistence) planFailures.push("UI contains client persistence marker");
  if (!uiHasNoDirectModelOrOpenAiCall) planFailures.push("UI contains direct OpenAI/model call");
  if (!uiHasNoRunSmartTalkClientCall) planFailures.push("UI contains runSmartTalk client call");
  if (!uiHasNoPublicProductionGoLiveWording) planFailures.push("UI contains public/production/go-live wording");

  const uiInternalControlReadyForManualTest =
    uiHasButtonLabel &&
    uiHasModeString &&
    uiHasHandler &&
    uiHasContextAnonymous &&
    uiHasInputTypeText &&
    uiHasLocaleSk &&
    uiHasApiSmartTalk &&
    uiHasNoClientEnvEnablement &&
    uiHasNoNextPublicEnvFlag &&
    uiHasNoClientPersistence &&
    uiHasNoDirectModelOrOpenAiCall &&
    uiHasNoRunSmartTalkClientCall &&
    uiHasNoPublicProductionGoLiveWording;

  // ── Static read of the route file (read-only, no import) ─────────────────
  const routeAbsPath = path.join(process.cwd(), SMART_TALK_ROUTE_RELATIVE_PATH);
  let routeContent = "";
  try {
    if (fs.existsSync(routeAbsPath) && fs.statSync(routeAbsPath).isFile()) {
      routeContent = fs.readFileSync(routeAbsPath, "utf8");
    } else {
      planFailures.push(`${SMART_TALK_ROUTE_RELATIVE_PATH} not found`);
    }
  } catch {
    planFailures.push(`${SMART_TALK_ROUTE_RELATIVE_PATH} could not be read`);
  }

  const routeHasModeString = /text_document_controlled_runtime/.test(routeContent);
  const routeHasEnvFlagName = /SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED/.test(routeContent);
  const routeHasDisabledCode = /text_document_mode_disabled/.test(routeContent);
  const routeHasTextDocumentMeta = /textDocumentMeta/.test(routeContent);
  const routeHasEightThreeAcNotRun = /eightThreeAcNotRun/.test(routeContent);

  if (!routeHasModeString) planFailures.push("route.ts does not contain text_document_controlled_runtime");
  if (!routeHasEnvFlagName) planFailures.push("route.ts does not contain SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED");
  if (!routeHasDisabledCode) planFailures.push("route.ts does not contain text_document_mode_disabled");
  if (!routeHasTextDocumentMeta) planFailures.push("route.ts does not contain textDocumentMeta");
  if (!routeHasEightThreeAcNotRun) planFailures.push("route.ts does not contain eightThreeAcNotRun");

  const routeReadyForControlledManualTest =
    routeHasModeString &&
    routeHasEnvFlagName &&
    routeHasDisabledCode &&
    routeHasTextDocumentMeta &&
    routeHasEightThreeAcNotRun;

  // ── Protocol content (planning only — no execution) ──────────────────────
  const preTestChecklist: string[] = [
    "git status must be clean before starting the manual test.",
    "The latest commit must be e7d47c5 (8.9K — add text document mode minimal browser ui wiring).",
    "Confirm app/api/smart-talk/route.ts has not been modified since 8.9G/8.9C hardening.",
    'Confirm app/smart-talk/SmartTalkClient.tsx contains the internal control "Interný test: Text Document Mode".',
    "Re-run the 8.9K patch audit (npx -y tsx@4.19.2 run-text-document-mode-minimal-browser-ui-wiring-patch-audit.ts) and confirm allPassed: true.",
    "Confirm no public/production/go-live flags are enabled anywhere in the environment or codebase.",
    "Confirm no OCR/photo/upload/paid/Vaylo-DNA/persistence path is enabled anywhere in the environment or codebase.",
  ];

  const offScenarioSteps: string[] = [
    'Ensure SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED is absent or not exactly "true" in the local environment.',
    "Start the dev server only during the execution phase (8.9M), not during this planning phase.",
    "Open /smart-talk locally only during the execution phase.",
    "Select text mode.",
    "Paste a safe synthetic document-like text.",
    'Click "Interný test: Text Document Mode".',
    "Expected: request reaches /api/smart-talk; server returns 403; code is text_document_mode_disabled; no model call occurs; UI shows a controlled error/failure state without crashing; no DB/storage/persistence; no OCR/photo/upload; no public/production/go-live exposure.",
  ];

  const onScenarioSteps: string[] = [
    'Set SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED exactly to "true" locally only.',
    "Restart the dev server after the env flag change.",
    "Open /smart-talk locally.",
    "Select text mode.",
    'Paste safe synthetic document-like text, for example: "Sehr geehrte Damen und Herren, wir informieren Sie über Ihren aktuellen Versicherungsstatus bei unserer Krankenkasse. Bitte prüfen Sie die Angaben und melden Sie sich bei Rückfragen."',
    'Click "Interný test: Text Document Mode".',
    "Expected: request reaches /api/smart-talk; server returns 200; ok true; mode is text_document_controlled_runtime; textDocumentMeta is present with textDocumentModeEnabled true, controlledTextDocumentRuntime true, pastedTextOnly true, photoOcrStillBlocked true, scannerUploadStillBlocked true, fileUploadStillBlocked true, paidDocumentModeStillBlocked true, vayloDnaStillBlocked true, persistenceStillBlocked true, dbStorageStillBlocked true, exactLegalDeadlineStillBlocked true, bindingLegalAdviceStillBlocked true, officialFilingGenerationStillBlocked true, modelOutputStillUntrusted true, documentTextTreatedAsSensitive true, privacyDisclaimerRequired true, legalDisclaimerRequired true, eightThreeAcNotRun true; UI renders the result without crashing.",
    "Any PowerShell/browser encoding artifacts observed must be recorded but must not be treated as a route safety failure.",
  ];

  const blockedRiskScenarioSteps: string[] = [
    "Exact legal deadline request through the internal Text Document button — expected block: exact_legal_deadline_calculation_blocked.",
    "Credential/API key/password text through the internal Text Document button — expected block: sensitive_credential_data_blocked.",
    "IBAN/payment authorization text through the internal Text Document button — expected block: sensitive_financial_data_blocked.",
    "Non-document general question through the internal Text Document button — expected block: no_document_signal_blocked, or a safe equivalent already observed in previous local tests.",
    "Explicit paid document mode activation text through the internal Text Document button — expected block: paid_document_mode_blocked.",
    "Photo mode must not show or use the internal Text Document button at all — confirm the control is absent/not rendered in photo mode, and that no upload/OCR/photo/file payload can ever enter text_document_controlled_runtime.",
  ];

  const rateLimitHandlingSteps: string[] = [
    "If a 429 smart_talk_rate_limited response occurs during any scenario, record it exactly as observed.",
    "Wait for the rate-limit window to reset before retesting the affected case.",
    "Do not count a rate-limit response as a success or a failure of Text Document Mode logic.",
    "Treat rate-limiting as an environmental observation only, separate from the safety/correctness verdict of the scenario being tested.",
  ];

  const cleanupSteps: string[] = [
    "Stop the dev server.",
    "Remove SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED from the local environment/session.",
    "Remove SMART_TALK_FREE_QA_PUBLIC_ENABLED from the local environment/session, if present.",
    "Confirm both env vars are absent in the PowerShell session: Test-Path Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED and Test-Path Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED must both return False.",
    "Run git status and confirm the working tree is clean.",
    "Do not leave either env flag enabled after the test.",
    "Do not commit runtime logs unless explicitly created as a future, separate closure file.",
  ];

  const evidenceToCapture: string[] = [
    "The exact commands used to set/unset the env flags.",
    "Dev server restart confirmation (timestamp/log excerpt).",
    "The exact browser path used (e.g. http://localhost:3000/smart-talk).",
    "OFF scenario: HTTP status and response code observed.",
    "ON scenario (allowed document): HTTP status, ok, mode, and full textDocumentMeta object observed.",
    "Each blocked-risk scenario: HTTP status and response code observed.",
    "Confirmation that photo mode does not show the internal Text Document button.",
    "Cleanup confirmation (env vars removed, dev server stopped).",
    "git status output after cleanup.",
    "Confirmation that 8.3AC was not run and tmp-8-3ac-live-metadata.ts was not touched during execution.",
    "Confirmation that no public/production/go-live/OCR/upload/paid/Vaylo-DNA/persistence path was enabled at any point during execution.",
  ];

  const expectedResults: string[] = [
    "OFF scenario: HTTP 403, code text_document_mode_disabled, no model call, no DB/storage/persistence, no OCR/photo/upload, no public/production/go-live exposure.",
    "ON scenario (allowed document): HTTP 200, ok true, mode text_document_controlled_runtime, textDocumentMeta present with all StillBlocked flags true and modelOutputStillUntrusted/documentTextTreatedAsSensitive/privacyDisclaimerRequired/legalDisclaimerRequired/eightThreeAcNotRun all true.",
    "Blocked-risk scenarios: each request blocked with its specific expected code (exact_legal_deadline_calculation_blocked, sensitive_credential_data_blocked, sensitive_financial_data_blocked, no_document_signal_blocked or safe equivalent, paid_document_mode_blocked).",
    "Photo mode never renders or exposes the internal Text Document button, and no upload/OCR/photo/file payload can reach text_document_controlled_runtime.",
    "Any 429 rate-limit responses are recorded as environmental observations only, not as pass/fail signals for Text Document Mode logic.",
  ];

  const uiPatchImplemented = k.uiPatchImplemented === true;

  const notes: string[] = [
    "PL-01: 8.9L is a planning-only phase. No browser was opened, no dev server was started, no fetch/route/model call was made, and no UI was clicked by this phase.",
    `PL-02: 8.9K confirmed as source of truth — checkId=${k.checkId}, allPassed=${k.allPassed}, sourceImplementationPlanCommit=${k.sourceImplementationPlanCommit}, readyForBrowserManualTestPlanning=${k.readyForBrowserManualTestPlanning}, readyForBrowserManualTest=${k.readyForBrowserManualTest}, manualTestDeferred=${k.manualTestDeferred}, browserManualTestPhase=${k.browserManualTestPhase}, uiPatchImplemented=${uiPatchImplemented}.`,
    "PL-03: this planning file only statically reads app/smart-talk/SmartTalkClient.tsx and app/api/smart-talk/route.ts as plain text to confirm both are ready for the future controlled manual test; it does not import UI components, does not import route.ts as a module, and does not invoke any route handler.",
    "PL-04: the manual test protocol itself (pre-test checks, OFF scenario, ON scenario, blocked-risk scenarios, rate-limit handling, cleanup, evidence capture) is defined in full below and is intended to be executed verbatim in the future 8.9M execution phase.",
    "PL-05: this planning file performs no live route/model/fetch(-as-runtime)/OpenAI/process.env-authorization/DB/storage access of its own, does not run 8.3AC, and does not touch tmp-8-3ac-live-metadata.ts.",
    "PL-06: browser manual testing was NOT performed by this phase and remains deferred to Phase 8.9M.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES.length;

  const provisional: TextDocumentModeControlledLocalBrowserManualTestPlanningResult = {
    checkId: "8.9L",
    allPassed: true,
    planningOnly: true,
    sourceMinimalUiWiringCommit: "e7d47c5",
    sourceMinimalUiWiringPhase: "8.9K",
    manualBrowserTestNotPerformedByThisPhase: true,
    sourcePatchAuditAccepted,
    uiInternalControlReadyForManualTest,
    routeReadyForControlledManualTest,
    offScenarioPlanned: true,
    onScenarioPlanned: true,
    blockedRiskScenariosPlanned: true,
    rateLimitHandlingPlanned: true,
    cleanupProtocolPlanned: true,
    evidenceCaptureProtocolPlanned: true,
    expectedOffScenarioStatus: 403,
    expectedOffScenarioCode: "text_document_mode_disabled",
    expectedOnScenarioStatus: 200,
    expectedOnScenarioOk: true,
    expectedOnScenarioMode: "text_document_controlled_runtime",
    expectedInternalButtonLabel: "Interný test: Text Document Mode",
    expectedEnvFlagName: "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED",
    expectedEnvFlagExactValue: "true",
    browserManualTestPhase: "8.9M",
    readyForControlledLocalBrowserManualTestExecution: true,
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
    liveRouteInvocationPerformedByThisPlanning: false,
    liveModelCallPerformedByThisPlanning: false,
    openAiSdkImportedByPlanning: false,
    fetchUsedAsRuntimeByPlanning: false,
    processEnvReadForAuthorizationByPlanning: false,
    filesWrittenByPlanning: false,
    dbStorageTouchedByPlanning: false,
    eightThreeAcNotRun: true,
    readyForNextPhase: "8.9M",
    recommendedNextPhase: "Text Document Mode Controlled Local Browser Manual Test Execution",
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    preTestChecklist,
    offScenarioSteps,
    onScenarioSteps,
    blockedRiskScenarioSteps,
    rateLimitHandlingSteps,
    cleanupSteps,
    evidenceToCapture,
    expectedResults,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.9M: Text Document Mode Controlled Local Browser Manual Test Execution — execute this exact protocol (OFF scenario, ON scenario, blocked-risk scenarios, rate-limit handling, cleanup, evidence capture) locally, and record results in a new execution/closure file.",
      "Only after a successful 8.9M execution: Text Document Mode Internal Readiness Closure.",
      "Phase 8.10A: Photo/OCR Controlled Runtime Gate remains explicitly deferred until after Text Document Mode internal readiness closure.",
    ],
    notes,
  };

  if (planFailures.length === 0 && !_isCanonicalTextDocumentModeControlledLocalBrowserManualTestPlanningResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeControlledLocalBrowserManualTestPlanningResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9L tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9L tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
// print the 8.9L result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-controlled-local-browser-manual-test-planning");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeControlledLocalBrowserManualTestPlanning(), null, 2));
}
