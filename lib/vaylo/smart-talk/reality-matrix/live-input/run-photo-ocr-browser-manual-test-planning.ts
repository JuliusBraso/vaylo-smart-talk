/**
 * PHASE 8.10H — Photo/OCR Browser Manual Test Planning
 *
 * Planning-only. Defines the exact controlled local browser manual test
 * protocol for the future execution/closure phase (8.10I), covering the
 * OFF scenario (env flag absent), the ON allowed-placeholder scenario (env
 * flag exactly "true"), UI separation checks, a minimal guard spot-check
 * set, Chrome DevTools Network inspection steps, and the cleanup protocol.
 *
 * This file does NOT execute the browser manual test. It does not start a
 * dev server, does not open a browser, does not click UI, does not call
 * fetch/route handlers/OpenAI, does not read process.env for authorization,
 * does not touch DB/storage/DNA, does not import or call an OCR library or
 * engine, does not read real images or image bytes, and does not run 8.3AC
 * or touch tmp-8-3ac-live-metadata.ts. It only calls the already-validated
 * 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N phases as sources of truth.
 */

import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runPhotoOcrBrowserUiWiringAudit } from "./run-photo-ocr-browser-ui-wiring-audit";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

/**
 * NOTE on source-of-truth calling strategy:
 *
 * runPhotoOcrControlledRuntimeDisabledLocalApiClosure (8.10D) and
 * runPhotoOcrControlledRuntimeEnabledLocalApiClosure (8.10E) each perform
 * real in-process invocations of the route handler using a fixed set of
 * synthetic "x-forwarded-for" IPs, and the route enforces a real in-memory
 * rate limit (5 requests / 10 minutes per IP). runPhotoOcrControlledLocalRegressionPack
 * (8.10F) already calls both 8.10D and 8.10E once each as its own sources of
 * truth, and runPhotoOcrBrowserUiWiringAudit (8.10G) already calls 8.10C,
 * 8.10D, 8.10E, and 8.10F once each as ITS own sources of truth (which in
 * turn re-invokes 8.10D/8.10E again via 8.10F). That nested chain alone
 * already exercises the shared fixed IPs multiple times within a single
 * process, right up to (but under) the rate limit.
 *
 * To avoid pushing that already-accepted chain over the real rate limit by
 * invoking 8.10D/8.10E/8.10F a second, independent time from this file (which
 * would add additional hits on the very same fixed IPs and could flip
 * legitimate 403s into 429s), this planning phase does NOT call 8.10D/8.10E/8.10F
 * directly itself. Instead it calls 8.10G (which already re-validates
 * 8.10C/8.10D/8.10E/8.10F internally) and reads 8.10G's own
 * disabledLocalApiClosureAccepted / enabledLocalApiClosureAccepted /
 * controlledLocalRegressionPackAccepted fields as the acceptance evidence for
 * 8.10D/8.10E/8.10F respectively. This keeps the total number of in-process
 * route invocations performed across this whole source-of-truth chain
 * identical to running 8.10G alone (already independently verified to pass),
 * and this file itself still performs zero direct route invocations.
 */

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrBrowserManualTestPlanningResult {
  checkId: "8.10H";
  allPassed: boolean;
  browserManualTestPlanningOnly: true;
  browserManualTestExecutedNow: false;
  browserInvoked: false;
  devServerStarted: false;
  localApiInvoked: false;
  externalNetworkCalled: false;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  realImageUsedNow: false;
  imageBytesReadNow: false;
  ocrLibraryImported: false;
  ocrExtractionPerformed: false;
  modelCallPerformed: false;
  uploadPerformedNow: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceMinimalPatchCommit: "3e35be8";
  sourceDisabledClosureCommit: "385b32a";
  sourceEnabledClosureCommit: "e1d6568";
  sourceRegressionPackCommit: "49fa151";
  sourceBrowserUiWiringAuditCommit: "5333d98";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceEnabledClosureAccepted: boolean;
  sourceRegressionPackAccepted: boolean;
  sourceBrowserUiWiringAuditAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  targetExecutionPhase: "8.10I";
  targetExecutionPhaseName: "Photo/OCR Browser Manual Test Execution Closure";
  browserManualTestPlanCreated: true;
  offScenarioPlanned: true;
  onAllowedPlaceholderScenarioPlanned: true;
  uiSeparationChecksPlanned: true;
  networkInspectionPlanned: true;
  cleanupProtocolPlanned: true;
  guardSpotChecksPlanned: true;
  fullApiGuardMatrixAlreadyCoveredByRegressionPack: true;
  browserManualDoesNotNeedToRepeatAll22ApiGuards: true;

  offScenarioEnvFlagAbsent: true;
  offScenarioExpectedStatus: 403;
  offScenarioExpectedOk: false;
  offScenarioExpectedCode: "photo_ocr_controlled_runtime_disabled";
  offScenarioExpectedNoOcr: true;
  offScenarioExpectedNoModel: true;
  offScenarioExpectedNoUploadPersistence: true;
  offScenarioExpectedNoDbStorageDna: true;
  offScenarioExpectedNoPublicProductionGoLive: true;

  onScenarioEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";
  onScenarioEnvExactValue: "true";
  onScenarioExpectedStatus: 200;
  onScenarioExpectedOk: true;
  onScenarioExpectedMode: "photo_ocr_controlled_runtime";
  onScenarioExpectedContext: "anonymous";
  onScenarioExpectedPlaceholderOnly: true;
  onScenarioExpectedRealOcrExtractionPerformed: false;
  onScenarioExpectedOcrRuntimeStillBlocked: true;
  onScenarioExpectedModelCallPerformed: false;
  onScenarioExpectedNoUploadPersistence: true;
  onScenarioExpectedNoDbStorageDna: true;
  onScenarioExpectedNoPublicProductionGoLive: true;
  onScenarioExpectedSensitiveImageAndExtractedText: true;
  onScenarioExpectedUntrustedModelAndOcrOutput: true;
  onScenarioExpectedPrivacyLegalDisclaimers: true;
  onScenarioExpectedEightThreeAcNotRun: true;

  chromeDevToolsNetworkPlanned: true;
  preserveLogRequired: true;
  fetchXhrFilterRecommended: true;
  smartTalkFilterRecommended: true;
  responseBodyInspectionRequired: true;
  headersStatusInspectionRequired: true;
  networkFieldsToRecord: string[];

  cleanupDevServerStopRequired: true;
  cleanupPhotoOcrEnvFlagRemoveRequired: true;
  cleanupTextDocumentEnvFlagRemoveRequired: true;
  cleanupFreeQaEnvFlagRemoveRequired: true;
  cleanupEnvTestPathFalseRequired: true;
  cleanupGitStatusCleanRequired: true;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  manualTestPlanEvidence: string[];
  offScenarioPlan: string[];
  onAllowedPlaceholderScenarioPlan: string[];
  uiSeparationPlan: string[];
  guardSpotCheckPlan: string[];
  networkInspectionPlan: string[];
  cleanupPlan: string[];
  expectedObservationTemplate: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];

  photoOcrBrowserManualTestPlanReady: boolean;
  readyForNextPhase: "8.10I";
  recommendedNextPhase: "Photo/OCR Browser Manual Test Execution Closure";
  readyForPhotoOcrBrowserManualExecution: boolean;
  readyForPhotoOcrInternalReadinessClosure: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
}

const REQUIRED_NETWORK_FIELDS_TO_RECORD: string[] = ["status", "ok", "code", "mode", "context", "photoOcrMeta"];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase creates the manual browser test plan only.",
  "This phase does not execute browser test.",
  "This phase does not start dev server.",
  "This phase does not invoke API.",
  "This phase does not inspect live Network response.",
  "This phase does not use real production documents.",
  "This phase does not perform real OCR extraction.",
  "Browser execution and Network evidence belong to 8.10I.",
  "Real OCR extraction remains deferred to a later separate phase.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Browser manual execution not performed yet",
  "Photo/OCR internal readiness closure not performed yet",
  "Real OCR extraction not designed yet",
  "Real OCR extraction not implemented",
  "OCR quality evaluator not implemented",
  "OCR trust boundary not fully validated with real OCR",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.10C minimal patch audit accepted",
  "8.10D disabled local API closure accepted",
  "8.10E enabled local API closure accepted",
  "8.10F controlled local regression pack accepted",
  "8.10G browser UI wiring audit accepted",
  "8.9N text document internal readiness accepted",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrBrowserManualTestPlanningResult(r: PhotoOcrBrowserManualTestPlanningResult): boolean {
  if (r.checkId !== "8.10H") return false;
  if (r.allPassed !== true) return false;
  if (r.browserManualTestPlanningOnly !== true) return false;
  if (r.browserManualTestExecutedNow !== false) return false;
  if (r.browserInvoked !== false) return false;
  if (r.devServerStarted !== false) return false;
  if (r.localApiInvoked !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.realImageUsedNow !== false) return false;
  if (r.imageBytesReadNow !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrExtractionPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.uploadPerformedNow !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceDisabledClosureCommit !== "385b32a") return false;
  if (r.sourceEnabledClosureCommit !== "e1d6568") return false;
  if (r.sourceRegressionPackCommit !== "49fa151") return false;
  if (r.sourceBrowserUiWiringAuditCommit !== "5333d98") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceEnabledClosureAccepted !== true) return false;
  if (r.sourceRegressionPackAccepted !== true) return false;
  if (r.sourceBrowserUiWiringAuditAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.targetExecutionPhase !== "8.10I") return false;
  if (r.targetExecutionPhaseName !== "Photo/OCR Browser Manual Test Execution Closure") return false;
  if (r.browserManualTestPlanCreated !== true) return false;
  if (r.offScenarioPlanned !== true) return false;
  if (r.onAllowedPlaceholderScenarioPlanned !== true) return false;
  if (r.uiSeparationChecksPlanned !== true) return false;
  if (r.networkInspectionPlanned !== true) return false;
  if (r.cleanupProtocolPlanned !== true) return false;
  if (r.guardSpotChecksPlanned !== true) return false;
  if (r.fullApiGuardMatrixAlreadyCoveredByRegressionPack !== true) return false;
  if (r.browserManualDoesNotNeedToRepeatAll22ApiGuards !== true) return false;

  if (r.offScenarioEnvFlagAbsent !== true) return false;
  if (r.offScenarioExpectedStatus !== 403) return false;
  if (r.offScenarioExpectedOk !== false) return false;
  if (r.offScenarioExpectedCode !== "photo_ocr_controlled_runtime_disabled") return false;
  if (r.offScenarioExpectedNoOcr !== true) return false;
  if (r.offScenarioExpectedNoModel !== true) return false;
  if (r.offScenarioExpectedNoUploadPersistence !== true) return false;
  if (r.offScenarioExpectedNoDbStorageDna !== true) return false;
  if (r.offScenarioExpectedNoPublicProductionGoLive !== true) return false;

  if (r.onScenarioEnvFlag !== "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED") return false;
  if (r.onScenarioEnvExactValue !== "true") return false;
  if (r.onScenarioExpectedStatus !== 200) return false;
  if (r.onScenarioExpectedOk !== true) return false;
  if (r.onScenarioExpectedMode !== "photo_ocr_controlled_runtime") return false;
  if (r.onScenarioExpectedContext !== "anonymous") return false;
  if (r.onScenarioExpectedPlaceholderOnly !== true) return false;
  if (r.onScenarioExpectedRealOcrExtractionPerformed !== false) return false;
  if (r.onScenarioExpectedOcrRuntimeStillBlocked !== true) return false;
  if (r.onScenarioExpectedModelCallPerformed !== false) return false;
  if (r.onScenarioExpectedNoUploadPersistence !== true) return false;
  if (r.onScenarioExpectedNoDbStorageDna !== true) return false;
  if (r.onScenarioExpectedNoPublicProductionGoLive !== true) return false;
  if (r.onScenarioExpectedSensitiveImageAndExtractedText !== true) return false;
  if (r.onScenarioExpectedUntrustedModelAndOcrOutput !== true) return false;
  if (r.onScenarioExpectedPrivacyLegalDisclaimers !== true) return false;
  if (r.onScenarioExpectedEightThreeAcNotRun !== true) return false;

  if (r.chromeDevToolsNetworkPlanned !== true) return false;
  if (r.preserveLogRequired !== true) return false;
  if (r.fetchXhrFilterRecommended !== true) return false;
  if (r.smartTalkFilterRecommended !== true) return false;
  if (r.responseBodyInspectionRequired !== true) return false;
  if (r.headersStatusInspectionRequired !== true) return false;
  if (r.networkFieldsToRecord.length !== REQUIRED_NETWORK_FIELDS_TO_RECORD.length) return false;
  for (const item of REQUIRED_NETWORK_FIELDS_TO_RECORD) {
    if (!r.networkFieldsToRecord.includes(item)) return false;
  }

  if (r.cleanupDevServerStopRequired !== true) return false;
  if (r.cleanupPhotoOcrEnvFlagRemoveRequired !== true) return false;
  if (r.cleanupTextDocumentEnvFlagRemoveRequired !== true) return false;
  if (r.cleanupFreeQaEnvFlagRemoveRequired !== true) return false;
  if (r.cleanupEnvTestPathFalseRequired !== true) return false;
  if (r.cleanupGitStatusCleanRequired !== true) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.manualTestPlanEvidence) || r.manualTestPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.offScenarioPlan) || r.offScenarioPlan.length === 0) return false;
  if (!Array.isArray(r.onAllowedPlaceholderScenarioPlan) || r.onAllowedPlaceholderScenarioPlan.length === 0) return false;
  if (!Array.isArray(r.uiSeparationPlan) || r.uiSeparationPlan.length === 0) return false;
  if (!Array.isArray(r.guardSpotCheckPlan) || r.guardSpotCheckPlan.length === 0) return false;
  if (!Array.isArray(r.networkInspectionPlan) || r.networkInspectionPlan.length === 0) return false;
  if (!Array.isArray(r.cleanupPlan) || r.cleanupPlan.length === 0) return false;
  if (!Array.isArray(r.expectedObservationTemplate) || r.expectedObservationTemplate.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  if (r.photoOcrBrowserManualTestPlanReady !== true) return false;
  if (r.readyForNextPhase !== "8.10I") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Browser Manual Test Execution Closure") return false;
  if (r.readyForPhotoOcrBrowserManualExecution !== true) return false;
  if (r.readyForPhotoOcrInternalReadinessClosure !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper810HMutation = (r: PhotoOcrBrowserManualTestPlanningResult) => PhotoOcrBrowserManualTestPlanningResult;
interface Tamper810HCase {
  label: string;
  mutate: Tamper810HMutation;
}

const PHOTO_OCR_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES: Tamper810HCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10G" as "8.10H" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "browserManualTestPlanningOnly false", mutate: (r) => ({ ...r, browserManualTestPlanningOnly: false as true }) },
  { label: "browserManualTestExecutedNow true", mutate: (r) => ({ ...r, browserManualTestExecutedNow: true as false }) },
  { label: "browserInvoked true", mutate: (r) => ({ ...r, browserInvoked: true as false }) },
  { label: "devServerStarted true", mutate: (r) => ({ ...r, devServerStarted: true as false }) },
  { label: "localApiInvoked true", mutate: (r) => ({ ...r, localApiInvoked: true as false }) },
  { label: "externalNetworkCalled true", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "realImageUsedNow true", mutate: (r) => ({ ...r, realImageUsedNow: true as false }) },
  { label: "imageBytesReadNow true", mutate: (r) => ({ ...r, imageBytesReadNow: true as false }) },
  { label: "ocrLibraryImported true", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "modelCallPerformed true", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPerformedNow true", mutate: (r) => ({ ...r, uploadPerformedNow: true as false }) },
  { label: "persistencePerformed true", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime becomes enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live becomes authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceMinimalPatchAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceMinimalPatchAccepted: false }) },
  { label: "sourceMinimalPatchCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceMinimalPatchCommit: "0000000" as "3e35be8" }) },
  { label: "sourceDisabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceDisabledClosureAccepted: false }) },
  { label: "sourceDisabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "385b32a" }) },
  { label: "sourceEnabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceEnabledClosureAccepted: false }) },
  { label: "sourceEnabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceEnabledClosureCommit: "0000000" as "e1d6568" }) },
  { label: "sourceRegressionPackAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceRegressionPackAccepted: false }) },
  { label: "sourceRegressionPackCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceRegressionPackCommit: "0000000" as "49fa151" }) },
  { label: "sourceBrowserUiWiringAuditAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceBrowserUiWiringAuditAccepted: false }) },
  { label: "sourceBrowserUiWiringAuditCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceBrowserUiWiringAuditCommit: "0000000" as "5333d98" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "offScenarioPlanned false (OFF scenario not planned)", mutate: (r) => ({ ...r, offScenarioPlanned: false as true }) },
  { label: "offScenarioExpectedStatus wrong (OFF expected status differs)", mutate: (r) => ({ ...r, offScenarioExpectedStatus: 200 as 403 }) },
  { label: "offScenarioExpectedCode wrong (OFF expected code differs)", mutate: (r) => ({ ...r, offScenarioExpectedCode: "ok" as "photo_ocr_controlled_runtime_disabled" }) },
  { label: "offScenarioExpectedOk true (OFF expected status/code differs)", mutate: (r) => ({ ...r, offScenarioExpectedOk: true as false }) },
  { label: "onAllowedPlaceholderScenarioPlanned false (ON scenario not planned)", mutate: (r) => ({ ...r, onAllowedPlaceholderScenarioPlanned: false as true }) },
  { label: "onScenarioEnvFlag wrong (ON env flag differs)", mutate: (r) => ({ ...r, onScenarioEnvFlag: "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED" as "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED" }) },
  { label: "onScenarioEnvExactValue wrong (ON env exact value not lowercase true)", mutate: (r) => ({ ...r, onScenarioEnvExactValue: "TRUE" as "true" }) },
  { label: "onScenarioExpectedStatus wrong (ON expected status differs)", mutate: (r) => ({ ...r, onScenarioExpectedStatus: 403 as 200 }) },
  { label: "onScenarioExpectedOk false (ON expected ok differs)", mutate: (r) => ({ ...r, onScenarioExpectedOk: false as true }) },
  { label: "onScenarioExpectedMode wrong (ON expected mode differs)", mutate: (r) => ({ ...r, onScenarioExpectedMode: "text_document_controlled_runtime" as "photo_ocr_controlled_runtime" }) },
  { label: "onScenarioExpectedContext wrong (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedContext: "public" as "anonymous" }) },
  { label: "onScenarioExpectedPlaceholderOnly false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedPlaceholderOnly: false as true }) },
  { label: "onScenarioExpectedRealOcrExtractionPerformed true (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedRealOcrExtractionPerformed: true as false }) },
  { label: "onScenarioExpectedOcrRuntimeStillBlocked false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedOcrRuntimeStillBlocked: false as true }) },
  { label: "onScenarioExpectedModelCallPerformed true (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedModelCallPerformed: true as false }) },
  { label: "onScenarioExpectedNoUploadPersistence false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedNoUploadPersistence: false as true }) },
  { label: "onScenarioExpectedNoDbStorageDna false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedNoDbStorageDna: false as true }) },
  { label: "onScenarioExpectedNoPublicProductionGoLive false (public runtime becomes enabled)", mutate: (r) => ({ ...r, onScenarioExpectedNoPublicProductionGoLive: false as true }) },
  { label: "onScenarioExpectedSensitiveImageAndExtractedText false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedSensitiveImageAndExtractedText: false as true }) },
  { label: "onScenarioExpectedUntrustedModelAndOcrOutput false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedUntrustedModelAndOcrOutput: false as true }) },
  { label: "onScenarioExpectedPrivacyLegalDisclaimers false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedPrivacyLegalDisclaimers: false as true }) },
  { label: "onScenarioExpectedEightThreeAcNotRun false (ON expected placeholder/no-OCR/meta flags missing)", mutate: (r) => ({ ...r, onScenarioExpectedEightThreeAcNotRun: false as true }) },
  { label: "uiSeparationChecksPlanned false (UI separation checks not planned)", mutate: (r) => ({ ...r, uiSeparationChecksPlanned: false as true }) },
  { label: "networkInspectionPlanned false (Network inspection not planned)", mutate: (r) => ({ ...r, networkInspectionPlanned: false as true }) },
  { label: "responseBodyInspectionRequired false (response body inspection not required)", mutate: (r) => ({ ...r, responseBodyInspectionRequired: false as true }) },
  { label: "headersStatusInspectionRequired false", mutate: (r) => ({ ...r, headersStatusInspectionRequired: false as true }) },
  { label: "preserveLogRequired false", mutate: (r) => ({ ...r, preserveLogRequired: false as true }) },
  { label: "chromeDevToolsNetworkPlanned false", mutate: (r) => ({ ...r, chromeDevToolsNetworkPlanned: false as true }) },
  { label: "networkFieldsToRecord wrong content", mutate: (r) => ({ ...r, networkFieldsToRecord: ["status"] }) },
  { label: "cleanupProtocolPlanned false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupProtocolPlanned: false as true }) },
  { label: "cleanupDevServerStopRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupDevServerStopRequired: false as true }) },
  { label: "cleanupPhotoOcrEnvFlagRemoveRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupPhotoOcrEnvFlagRemoveRequired: false as true }) },
  { label: "cleanupTextDocumentEnvFlagRemoveRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupTextDocumentEnvFlagRemoveRequired: false as true }) },
  { label: "cleanupFreeQaEnvFlagRemoveRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupFreeQaEnvFlagRemoveRequired: false as true }) },
  { label: "cleanupEnvTestPathFalseRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupEnvTestPathFalseRequired: false as true }) },
  { label: "cleanupGitStatusCleanRequired false (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupGitStatusCleanRequired: false as true }) },
  { label: "guardSpotChecksPlanned false", mutate: (r) => ({ ...r, guardSpotChecksPlanned: false as true }) },
  { label: "fullApiGuardMatrixAlreadyCoveredByRegressionPack false", mutate: (r) => ({ ...r, fullApiGuardMatrixAlreadyCoveredByRegressionPack: false as true }) },
  { label: "browserManualDoesNotNeedToRepeatAll22ApiGuards false", mutate: (r) => ({ ...r, browserManualDoesNotNeedToRepeatAll22ApiGuards: false as true }) },
  { label: "expectedObservationTemplate emptied (expected observation template missing)", mutate: (r) => ({ ...r, expectedObservationTemplate: [] }) },
  { label: "photoOcrBrowserManualTestPlanReady false (browser manual execution marked ready false when plan is valid)", mutate: (r) => ({ ...r, photoOcrBrowserManualTestPlanReady: false }) },
  { label: "readyForPhotoOcrBrowserManualExecution false (browser manual execution marked ready false when plan is valid)", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualExecution: false }) },
  { label: "readyForPhotoOcrInternalReadinessClosure true (internal readiness closure marked ready too early)", mutate: (r) => ({ ...r, readyForPhotoOcrInternalReadinessClosure: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10I)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10J" as "8.10I" }) },
  { label: "targetExecutionPhase wrong (next phase is not 8.10I)", mutate: (r) => ({ ...r, targetExecutionPhase: "8.10J" as "8.10I" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10I)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Browser Manual Test Execution Closure" }) },
  { label: "targetExecutionPhaseName wrong", mutate: (r) => ({ ...r, targetExecutionPhaseName: "Photo/OCR Public Launch" as "Photo/OCR Browser Manual Test Execution Closure" }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "manualTestPlanEvidence emptied", mutate: (r) => ({ ...r, manualTestPlanEvidence: [] }) },
  { label: "offScenarioPlan emptied (OFF scenario not planned)", mutate: (r) => ({ ...r, offScenarioPlan: [] }) },
  { label: "onAllowedPlaceholderScenarioPlan emptied (ON scenario not planned)", mutate: (r) => ({ ...r, onAllowedPlaceholderScenarioPlan: [] }) },
  { label: "uiSeparationPlan emptied (UI separation checks not planned)", mutate: (r) => ({ ...r, uiSeparationPlan: [] }) },
  { label: "guardSpotCheckPlan emptied", mutate: (r) => ({ ...r, guardSpotCheckPlan: [] }) },
  { label: "networkInspectionPlan emptied (Network inspection not planned)", mutate: (r) => ({ ...r, networkInspectionPlan: [] }) },
  { label: "cleanupPlan emptied (cleanup plan missing)", mutate: (r) => ({ ...r, cleanupPlan: [] }) },
  { label: "evidenceLimitations wrong length/content", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "remainingBlockers wrong length/content", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported planning runner ───────────────────────────────────────────────

export async function runPhotoOcrBrowserManualTestPlanning(): Promise<PhotoOcrBrowserManualTestPlanningResult> {
  const planFailures: string[] = [];

  // ── Source of truth: 8.10C minimal patch audit ────────────────────────────
  const c = runPhotoOcrControlledRuntimeMinimalPatchAudit();
  if (c.checkId !== "8.10C") planFailures.push(`8.10C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) planFailures.push("8.10C allPassed is not true");
  if (c.tamperRejected !== c.tamperCount) planFailures.push("8.10C own tamper count mismatch");
  const sourceMinimalPatchAccepted = planFailures.length === 0;

  // ── Source of truth: 8.10G browser UI wiring audit ─────────────────────────
  // 8.10G already re-validates 8.10C/8.10D/8.10E/8.10F internally (see the
  // calling-strategy note above), so its own per-source acceptance fields are
  // read directly below instead of re-invoking 8.10D/8.10E/8.10F a second time.
  const gBefore = planFailures.length;
  const g = await runPhotoOcrBrowserUiWiringAudit();
  if (g.checkId !== "8.10G") planFailures.push(`8.10G checkId mismatch: got "${g.checkId}"`);
  if (g.allPassed !== true) planFailures.push("8.10G allPassed is not true");
  if (g.readyForNextPhase !== "8.10H") planFailures.push("8.10G readyForNextPhase is not 8.10H");
  if (g.readyForPhotoOcrBrowserManualTestPlanning !== true) planFailures.push("8.10G readyForPhotoOcrBrowserManualTestPlanning is not true");
  if (g.disabledLocalApiClosureAccepted !== true) planFailures.push("8.10G disabledLocalApiClosureAccepted is not true");
  if (g.enabledLocalApiClosureAccepted !== true) planFailures.push("8.10G enabledLocalApiClosureAccepted is not true");
  if (g.controlledLocalRegressionPackAccepted !== true) planFailures.push("8.10G controlledLocalRegressionPackAccepted is not true");
  if (g.totalRegressionCaseCount !== 32) planFailures.push("8.10G totalRegressionCaseCount is not 32");
  if (g.tamperRejected !== g.tamperCount) planFailures.push("8.10G own tamper count mismatch");
  const sourceBrowserUiWiringAuditAccepted = planFailures.length === gBefore;

  const sourceDisabledClosureAccepted = g.disabledLocalApiClosureAccepted === true;
  const sourceEnabledClosureAccepted = g.enabledLocalApiClosureAccepted === true;
  const sourceRegressionPackAccepted = g.controlledLocalRegressionPackAccepted === true;

  // ── Source of truth: 8.9N internal readiness closure ──────────────────────
  const nBefore = planFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") planFailures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) planFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") planFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) planFailures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = planFailures.length === nBefore;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const manualTestPlanEvidence: string[] = [
    "This phase creates a controlled local browser manual test plan for Phase 8.10I; it performs no browser, dev server, fetch, or local API execution of its own.",
    `All six sources of truth confirmed accepted — 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N allPassed: ${c.allPassed}/${sourceDisabledClosureAccepted}/${sourceEnabledClosureAccepted}/${sourceRegressionPackAccepted}/${g.allPassed}/${n.allPassed}.`,
    "8.10D/8.10E/8.10F acceptance is read from 8.10G's own already-computed disabledLocalApiClosureAccepted/enabledLocalApiClosureAccepted/controlledLocalRegressionPackAccepted fields (8.10G already re-validates them internally), rather than re-invoking their in-process route calls a second, independent time from this file.",
    "The plan covers exactly two runtime scenarios (OFF disabled, ON allowed placeholder), UI separation checks, a minimal guard spot-check set, Chrome DevTools Network inspection steps, and a cleanup protocol.",
    "The full 22-case API guard matrix remains covered by the already-accepted 8.10F regression pack; this browser plan intentionally does not ask 8.10I to repeat all 22 guard cases in the browser.",
  ];

  // ── OFF scenario plan (step list) ─────────────────────────────────────────
  const offScenarioPlan: string[] = [
    'Ensure SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED is absent from the local environment/session (this planning phase does not set or check it now — only 8.10I will).',
    "Start the dev server only during the execution phase (8.10I), not during this planning phase.",
    "Open /smart-talk locally only during the execution phase.",
    "Select photo mode.",
    "Select a synthetic/local throwaway placeholder image/page if the UI requires a selected page for the button to be enabled.",
    'Click "Interný test: Photo/OCR placeholder".',
    "Expected: request reaches POST /api/smart-talk; server returns HTTP 403; ok: false; code: photo_ocr_controlled_runtime_disabled; no OCR occurs; no model call occurs; no upload/persistence occurs; no DB/storage/DNA write occurs; no public/production/go-live exposure occurs; UI shows a controlled error/failure state without crashing.",
  ];

  // ── ON allowed placeholder scenario plan (step list) ───────────────────────
  const onAllowedPlaceholderScenarioPlan: string[] = [
    'Set SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED exactly to "true" locally only (exact lowercase match; any other value/casing must fail closed per 8.10D).',
    "Restart the dev server after the env flag change.",
    "Open /smart-talk locally.",
    "Select photo mode.",
    "Select a local synthetic/throwaway test image (no real personal/production document) as the selected page, since the button is disabled without a selected page.",
    'Click "Interný test: Photo/OCR placeholder".',
    "Expected network response: status 200, ok: true, mode: \"photo_ocr_controlled_runtime\", context: \"anonymous\".",
    "Expected photoOcrMeta.placeholderOnly: true.",
    "Expected photoOcrMeta.realOcrExtractionPerformed: false.",
    "Expected photoOcrMeta.ocrRuntimeStillBlocked: true.",
    "Expected photoOcrMeta.modelCallPerformed: false.",
    "Expected photoOcrMeta.rawImagePersistenceBlocked: true, processedImagePersistenceBlocked: true, extractedTextPersistenceBlocked: true.",
    "Expected photoOcrMeta.dbStorageStillBlocked: true, supabaseStorageStillBlocked: true, vayloDnaStillBlocked: true.",
    "Expected photoOcrMeta.paidDocumentModeStillBlocked: true, publicRuntimeStillBlocked: true, productionAuthorizedNow: false, goLiveAuthorizedNow: false.",
    "Expected photoOcrMeta.modelOutputStillUntrusted: true, ocrOutputStillUntrusted: true.",
    "Expected photoOcrMeta.imageContentTreatedAsSensitive: true, extractedTextTreatedAsSensitive: true.",
    "Expected photoOcrMeta.privacyDisclaimerRequired: true, legalDisclaimerRequired: true.",
    "Expected photoOcrMeta.eightThreeAcNotRun: true.",
    "UI must render the placeholder result without crashing and without claiming OCR was performed or the document was read.",
    "Any PowerShell/browser encoding artifacts observed must be recorded but must not be treated as a route safety failure.",
  ];

  // ── UI separation checks plan (step list) ─────────────────────────────────
  const uiSeparationPlan: string[] = [
    'Confirm the Photo/OCR internal button ("Interný test: Photo/OCR placeholder") is visible only when photo mode is selected.',
    "Switch to text mode and confirm the Photo/OCR internal button is absent (not rendered).",
    'Switch to text mode and confirm the Text Document Mode internal button ("Interný test: Text Document Mode") is visible only in text mode.',
    "Switch to photo mode and confirm the Text Document Mode internal button is absent (not rendered).",
    "Confirm the default question/text flow (the main submit button in question/text mode) still behaves as before and is unaffected by the Photo/OCR placeholder control.",
    "Confirm the default photo/upload flow (the main submit button in photo mode, using the existing FormData upload path) still behaves as before and is unaffected by the Photo/OCR placeholder control.",
    "Switch to the photo tab and confirm no request is automatically sent (no auto-upload) merely from switching tabs.",
    "Confirm the internal Photo/OCR button is disabled (or otherwise cannot trigger a request) when no page/image has been selected.",
    "Confirm the internal Photo/OCR button only triggers a request on an explicit user click, never automatically.",
  ];

  // ── Guard spot-check plan (minimal browser-visible subset) ────────────────
  const guardSpotCheckPlan: string[] = [
    "Spot check 1 — no selected page: with photo mode selected and no page/image chosen, confirm the internal Photo/OCR button is disabled or that no request is sent if clicked.",
    "Spot check 2 — unsupported file type: if the browser's file picker/camera flow allows selecting a non-image/unsupported file type, attempt it and record the observed behavior (expected: request blocked with photo_ocr_unsupported_mime_type_blocked, or the browser/file-picker itself prevents the selection — record whichever occurs as a browser limitation).",
    "Spot check 3 — too many pages: if the UI allows selecting/adding more than the existing 3-page maximum, attempt it and record the observed behavior; if the UI clamps the page count before a request can be sent, record this as a UI clamp rather than a route rejection.",
    "Rate-limit note: if a 429 smart_talk_rate_limited response is encountered during any spot check, record it exactly as observed; it must not be counted as a Photo/OCR placeholder pass/fail signal.",
    "This minimal spot-check set intentionally does NOT attempt to reproduce all 22 API-level guard cases in the browser — those are already fully covered by the accepted 8.10F regression pack (22/22 rejected).",
  ];

  // ── Network inspection plan (Chrome DevTools) ──────────────────────────────
  const networkInspectionPlan: string[] = [
    "Open Chrome DevTools (F12 or Ctrl+Shift+I) before triggering any scenario.",
    "Go to the Network tab.",
    "Enable \"Preserve log\" so navigation/reload does not clear captured requests.",
    "Filter by Fetch/XHR to reduce noise from unrelated asset requests.",
    "Additionally filter by \"smart-talk\" in the Network search/filter box to isolate the relevant request.",
    "After clicking the internal Photo/OCR button, click the resulting POST /api/smart-talk request in the Network panel.",
    "Inspect the Headers tab to record the HTTP status code.",
    "Inspect the Response/Preview tab to record the full JSON body.",
    "Record from the JSON body: status (from Headers), ok, code (if present), mode (if present), context (if present), and the full photoOcrMeta object (if present).",
  ];

  // ── Cleanup plan (step list) ───────────────────────────────────────────────
  const cleanupPlan: string[] = [
    "Stop the dev server.",
    "Remove-Item Env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED -ErrorAction SilentlyContinue",
    "Remove-Item Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED -ErrorAction SilentlyContinue",
    "Remove-Item Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED -ErrorAction SilentlyContinue",
    "Confirm Test-Path Env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED returns False.",
    "Confirm Test-Path Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED returns False.",
    "Confirm Test-Path Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED returns False.",
    "Run git status --short and confirm the working tree is clean (no unintended modifications).",
    "Do not leave any env flag enabled after the test.",
    "Do not commit runtime logs or screenshots unless explicitly requested as a future, separate closure artifact.",
  ];

  // ── Expected observation template (operator fills in after 8.10I) ─────────
  const expectedObservationTemplate: string[] = [
    "Server path used (e.g. http://localhost:3000/smart-talk): ____",
    "Env OFF result observed (present/absent, exact value if any): ____",
    "Env ON result observed (exact value set, confirmed exact lowercase \"true\"): ____",
    "OFF scenario — observed HTTP status: ____ / observed ok: ____ / observed code: ____",
    "ON allowed placeholder scenario — observed HTTP status: ____ / observed ok: ____ / observed mode: ____ / observed context: ____",
    "ON allowed placeholder scenario — observed full photoOcrMeta JSON: ____",
    "UI separation checks — Photo/OCR button photo-mode-only observed: ____ / Text Document Mode button text-mode-only observed: ____ / default flows unaffected observed: ____ / no auto-upload observed: ____ / button disabled without selected page observed: ____",
    "Guard spot checks — no-selected-page result: ____ / unsupported-file-type result (or browser limitation note): ____ / too-many-pages result (or UI clamp note): ____",
    "Rate-limit observations (if any 429 occurred, record exactly, and note it was excluded from pass/fail verdicts): ____",
    "Cleanup results — dev server stopped: ____ / all three env flags removed and Test-Path confirmed False: ____",
    "git status --short output after cleanup: ____",
    "Confirmation that 8.3AC was not run and tmp-8-3ac-live-metadata.ts was not touched during execution: ____",
  ];

  const notes: string[] = [
    "PL-01: 8.10H is a planning-only phase. No browser was opened, no dev server was started, no fetch/route/model call was made, and no UI was clicked by this phase.",
    `PL-02: 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N confirmed as sources of truth — allPassed: ${c.allPassed}/${sourceDisabledClosureAccepted}/${sourceEnabledClosureAccepted}/${sourceRegressionPackAccepted}/${g.allPassed}/${n.allPassed}.`,
    "PL-03: the manual test protocol itself (OFF scenario, ON allowed-placeholder scenario, UI separation checks, minimal guard spot-check set, Chrome DevTools Network inspection steps, cleanup protocol, expected observation template) is defined in full below and is intended to be executed verbatim in the future 8.10I execution/closure phase.",
    "PL-04: the full 22-case API guard matrix remains covered by the already-accepted 8.10F regression pack; 8.10I's browser manual test does not need to repeat all 22 API guard cases — only a minimal, browser-visible spot-check subset is planned.",
    "PL-05: this planning file performs no live route/model/fetch(-as-runtime)/OpenAI/process.env-authorization/DB/storage/DNA access of its own, imports no OCR library, reads no real image bytes, does not run 8.3AC, and does not touch tmp-8-3ac-live-metadata.ts.",
    "PL-06: browser manual testing was NOT performed by this phase and remains deferred to Phase 8.10I.",
    "PL-07: 8.10D/8.10E/8.10F acceptance is derived from 8.10G's own internal re-validation fields rather than independently re-invoking their in-process route calls, to avoid exceeding the route's real in-memory rate limit (5 requests/10 minutes per synthetic IP) across the combined source-of-truth chain.",
  ];

  const tamperCount = PHOTO_OCR_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES.length;

  const provisional: PhotoOcrBrowserManualTestPlanningResult = {
    checkId: "8.10H",
    allPassed: true,
    browserManualTestPlanningOnly: true,
    browserManualTestExecutedNow: false,
    browserInvoked: false,
    devServerStarted: false,
    localApiInvoked: false,
    externalNetworkCalled: false,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    realImageUsedNow: false,
    imageBytesReadNow: false,
    ocrLibraryImported: false,
    ocrExtractionPerformed: false,
    modelCallPerformed: false,
    uploadPerformedNow: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceMinimalPatchCommit: "3e35be8",
    sourceDisabledClosureCommit: "385b32a",
    sourceEnabledClosureCommit: "e1d6568",
    sourceRegressionPackCommit: "49fa151",
    sourceBrowserUiWiringAuditCommit: "5333d98",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceEnabledClosureAccepted,
    sourceRegressionPackAccepted,
    sourceBrowserUiWiringAuditAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    targetExecutionPhase: "8.10I",
    targetExecutionPhaseName: "Photo/OCR Browser Manual Test Execution Closure",
    browserManualTestPlanCreated: true,
    offScenarioPlanned: true,
    onAllowedPlaceholderScenarioPlanned: true,
    uiSeparationChecksPlanned: true,
    networkInspectionPlanned: true,
    cleanupProtocolPlanned: true,
    guardSpotChecksPlanned: true,
    fullApiGuardMatrixAlreadyCoveredByRegressionPack: true,
    browserManualDoesNotNeedToRepeatAll22ApiGuards: true,

    offScenarioEnvFlagAbsent: true,
    offScenarioExpectedStatus: 403,
    offScenarioExpectedOk: false,
    offScenarioExpectedCode: "photo_ocr_controlled_runtime_disabled",
    offScenarioExpectedNoOcr: true,
    offScenarioExpectedNoModel: true,
    offScenarioExpectedNoUploadPersistence: true,
    offScenarioExpectedNoDbStorageDna: true,
    offScenarioExpectedNoPublicProductionGoLive: true,

    onScenarioEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED",
    onScenarioEnvExactValue: "true",
    onScenarioExpectedStatus: 200,
    onScenarioExpectedOk: true,
    onScenarioExpectedMode: "photo_ocr_controlled_runtime",
    onScenarioExpectedContext: "anonymous",
    onScenarioExpectedPlaceholderOnly: true,
    onScenarioExpectedRealOcrExtractionPerformed: false,
    onScenarioExpectedOcrRuntimeStillBlocked: true,
    onScenarioExpectedModelCallPerformed: false,
    onScenarioExpectedNoUploadPersistence: true,
    onScenarioExpectedNoDbStorageDna: true,
    onScenarioExpectedNoPublicProductionGoLive: true,
    onScenarioExpectedSensitiveImageAndExtractedText: true,
    onScenarioExpectedUntrustedModelAndOcrOutput: true,
    onScenarioExpectedPrivacyLegalDisclaimers: true,
    onScenarioExpectedEightThreeAcNotRun: true,

    chromeDevToolsNetworkPlanned: true,
    preserveLogRequired: true,
    fetchXhrFilterRecommended: true,
    smartTalkFilterRecommended: true,
    responseBodyInspectionRequired: true,
    headersStatusInspectionRequired: true,
    networkFieldsToRecord: [...REQUIRED_NETWORK_FIELDS_TO_RECORD],

    cleanupDevServerStopRequired: true,
    cleanupPhotoOcrEnvFlagRemoveRequired: true,
    cleanupTextDocumentEnvFlagRemoveRequired: true,
    cleanupFreeQaEnvFlagRemoveRequired: true,
    cleanupEnvTestPathFalseRequired: true,
    cleanupGitStatusCleanRequired: true,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    manualTestPlanEvidence,
    offScenarioPlan,
    onAllowedPlaceholderScenarioPlan,
    uiSeparationPlan,
    guardSpotCheckPlan,
    networkInspectionPlan,
    cleanupPlan,
    expectedObservationTemplate,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.10I: Photo/OCR Browser Manual Test Execution Closure — execute this exact protocol (OFF scenario, ON allowed-placeholder scenario, UI separation checks, guard spot checks, Network inspection, cleanup) locally, and record results in a new execution/closure file using the expectedObservationTemplate above.",
      "Only after a successful 8.10I execution: Photo/OCR Internal Readiness Closure.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase.",
    ],
    notes,

    photoOcrBrowserManualTestPlanReady: true,
    readyForNextPhase: "8.10I",
    recommendedNextPhase: "Photo/OCR Browser Manual Test Execution Closure",
    readyForPhotoOcrBrowserManualExecution: true,
    readyForPhotoOcrInternalReadinessClosure: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
  };

  if (planFailures.length === 0 && !_isCanonicalPhotoOcrBrowserManualTestPlanningResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_BROWSER_MANUAL_TEST_PLANNING_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrBrowserManualTestPlanningResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10H tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10H tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-browser-manual-test-planning");

if (invokedDirectly) {
  runPhotoOcrBrowserManualTestPlanning()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
