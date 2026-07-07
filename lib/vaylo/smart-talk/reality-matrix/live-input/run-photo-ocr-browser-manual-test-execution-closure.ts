/**
 * PHASE 8.10I — Photo/OCR Browser Manual Test Execution Closure
 *
 * Static manual-observation closure. The controlled local browser manual test
 * planned in 8.10H was already executed manually by the operator, using
 * Chrome DevTools Network response body inspection for both the OFF
 * (disabled) and ON (allowed placeholder) scenarios, plus UI separation
 * checks and a minimal guard spot-check set.
 *
 * This file does NOT execute the browser test again. It does not open a
 * browser, does not start a dev server, does not call fetch/route
 * handlers/OpenAI, does not read process.env for authorization, does not
 * touch DB/storage/DNA, does not import or call an OCR library or engine,
 * does not read real images or image bytes, and does not run 8.3AC or touch
 * tmp-8-3ac-live-metadata.ts. It hardcodes the operator-observed manual test
 * results and calls the already-validated 8.10H planning phase as its
 * primary source of truth.
 */

import { runPhotoOcrBrowserManualTestPlanning } from "./run-photo-ocr-browser-manual-test-planning";

/**
 * NOTE on source-of-truth calling strategy:
 *
 * runPhotoOcrControlledRuntimeDisabledLocalApiClosure (8.10D) and
 * runPhotoOcrControlledRuntimeEnabledLocalApiClosure (8.10E) each perform
 * real in-process invocations of the route handler using a fixed set of
 * synthetic "x-forwarded-for" IPs, and the route enforces a real in-memory
 * rate limit (5 requests / 10 minutes per IP). The already-accepted 8.10H
 * planning phase already calls 8.10G (which itself re-validates
 * 8.10C/8.10D/8.10E/8.10F internally) as its own source of truth — a chain
 * that already exercises the shared fixed IPs multiple times within a single
 * process, right up to (but safely under) the real rate limit.
 *
 * To avoid pushing that already-accepted chain over the real rate limit by
 * independently re-invoking 8.10D/8.10E/8.10F/8.10G a second time from this
 * file (which would add additional hits on the very same fixed IPs and could
 * flip legitimate 403s into 429s), this closure file calls ONLY 8.10H
 * directly, and reads 8.10H's own already-computed sourceMinimalPatchAccepted /
 * sourceDisabledClosureAccepted / sourceEnabledClosureAccepted /
 * sourceRegressionPackAccepted / sourceBrowserUiWiringAuditAccepted /
 * sourceTextDocumentInternalReadinessAccepted fields as the acceptance
 * evidence for 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N respectively. This keeps
 * the total number of in-process route invocations performed across this
 * whole source-of-truth chain identical to running 8.10H alone (already
 * independently verified to pass), and this file itself performs zero direct
 * route invocations of its own.
 */

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrBrowserManualTestExecutionClosureResult {
  checkId: "8.10I";
  allPassed: boolean;
  browserManualTestExecutionClosureOnly: true;
  browserManualTestPerformed: true;
  browserInvokedByOperator: true;
  devServerStartedByOperator: true;
  chromeDevToolsNetworkUsed: true;
  networkResponseBodiesDirectlyObserved: true;
  closureFileExecutedBrowser: false;
  closureFileStartedDevServer: false;
  closureFileInvokedApi: false;
  closureFileCalledFetch: false;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  realImageUsed: false;
  syntheticImageUsed: true;
  physicalCameraCaptureUsed: false;
  localSyntheticImageUploadUsed: true;
  imageBytesReadByClosure: false;
  ocrLibraryImported: false;
  ocrExtractionPerformed: false;
  modelCallPerformed: false;
  uploadPersistencePerformed: false;
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
  sourceBrowserManualPlanningCommit: "e7e2908";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceEnabledClosureAccepted: boolean;
  sourceRegressionPackAccepted: boolean;
  sourceBrowserUiWiringAuditAccepted: boolean;
  sourceBrowserManualPlanningAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  offScenarioPerformed: true;
  offScenarioEnvAbsent: true;
  offScenarioStatus: 403;
  offScenarioOk: false;
  offScenarioCode: "photo_ocr_controlled_runtime_disabled";
  offScenarioPhotoOcrMetaObserved: true;
  offScenarioPhotoOcrControlledRuntime: false;
  offScenarioPlaceholderOnly: true;
  offScenarioRealOcrExtractionPerformed: false;
  offScenarioOcrRuntimeStillBlocked: true;
  offScenarioModelCallPerformed: false;
  offScenarioNoUploadPersistence: true;
  offScenarioNoDbStorageDna: true;
  offScenarioNoPublicProductionGoLive: true;
  offScenarioEightThreeAcNotRun: true;

  onScenarioPerformed: true;
  onScenarioEnvExactTrue: true;
  onScenarioStatus: 200;
  onScenarioOk: true;
  onScenarioMode: "photo_ocr_controlled_runtime";
  onScenarioContext: "anonymous";
  onScenarioResultPresent: true;
  onScenarioResultClaimsOcrPerformed: false;
  onScenarioResultContainsExtractedText: false;
  onScenarioResultContainsExactDeadline: false;
  onScenarioResultContainsBindingLegalAdvice: false;
  onScenarioResultContainsOfficialFiling: false;
  onScenarioPhotoOcrMetaObserved: true;
  onScenarioPhotoOcrControlledRuntime: true;
  onScenarioPhotoInputOnly: true;
  onScenarioPlaceholderOnly: true;
  onScenarioRealOcrExtractionPerformed: false;
  onScenarioOcrRuntimeStillBlocked: true;
  onScenarioModelCallPerformed: false;
  onScenarioUploadRuntimeStillBlocked: true;
  onScenarioRawImagePersistenceBlocked: true;
  onScenarioProcessedImagePersistenceBlocked: true;
  onScenarioExtractedTextPersistenceBlocked: true;
  onScenarioDbStorageStillBlocked: true;
  onScenarioSupabaseStorageStillBlocked: true;
  onScenarioVayloDnaStillBlocked: true;
  onScenarioPaidDocumentModeStillBlocked: true;
  onScenarioPublicRuntimeStillBlocked: true;
  onScenarioProductionAuthorizedNow: false;
  onScenarioGoLiveAuthorizedNow: false;
  onScenarioModelOutputStillUntrusted: true;
  onScenarioOcrOutputStillUntrusted: true;
  onScenarioImageContentTreatedAsSensitive: true;
  onScenarioExtractedTextTreatedAsSensitive: true;
  onScenarioPrivacyDisclaimerRequired: true;
  onScenarioLegalDisclaimerRequired: true;
  onScenarioExactLegalDeadlineStillBlocked: true;
  onScenarioBindingLegalAdviceStillBlocked: true;
  onScenarioOfficialFilingGenerationStillBlocked: true;
  onScenarioEightThreeAcNotRun: true;

  uiSeparationPerformed: true;
  photoModePhotoOcrButtonVisible: true;
  photoModeTextDocumentButtonAbsent: true;
  textModeTextDocumentButtonVisible: true;
  textModePhotoOcrButtonAbsent: true;
  questionModePhotoOcrButtonAbsent: true;
  questionModeTextDocumentButtonAbsent: true;
  questionDefaultFlowVisible: true;
  noAutoUploadOnPhotoTabClick: true;
  explicitClickRequired: true;
  selectedSyntheticPageVisible: true;

  guardSpotChecksPerformed: true;
  noSelectedPageSpotCheckPerformed: true;
  noSelectedPageButtonDisabled: true;
  noSelectedPageRequestSent: false;
  unsupportedFileSpotCheckPerformed: false;
  unsupportedFileSpotCheckSkippedBecauseApiRegressionClosed: true;
  tooManyPagesSpotCheckPerformed: false;
  tooManyPagesSpotCheckSkippedBecauseApiRegressionClosed: true;
  fullApiGuardMatrixAlreadyClosedBy8_10F: true;

  cleanupPerformed: true;
  devServerStopped: true;
  photoOcrEnvFlagRemovedAfterTest: true;
  textDocumentEnvFlagRemovedAfterTest: true;
  freeQaEnvFlagRemovedAfterTest: true;
  envFlagsAllAbsentAfterCleanup: true;
  gitStatusCleanAfterCleanup: true;

  photoOcrBrowserManualExecutionPassed: boolean;
  readyForNextPhase: "8.10J";
  recommendedNextPhase: "Photo/OCR Internal Readiness Closure";
  readyForPhotoOcrInternalReadinessClosure: boolean;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  manualBrowserExecutionEvidence: string[];
  offScenarioEvidence: string[];
  onScenarioEvidence: string[];
  uiSeparationEvidence: string[];
  guardSpotCheckEvidence: string[];
  networkInspectionEvidence: string[];
  cleanupEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase records operator-performed local browser execution.",
  "This closure file does not run browser or dev server.",
  "This phase used a synthetic local PNG test image, not a real document.",
  "This phase did not use physical camera capture.",
  "This phase did not perform real OCR extraction.",
  "This phase did not test all 22 API guard cases in browser because they are already closed by 8.10E and 8.10F.",
  "This phase does not authorize public runtime, production, go-live, or real OCR extraction.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
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
  "8.10H browser manual test planning accepted",
  "8.9N text document internal readiness accepted",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrBrowserManualTestExecutionClosureResult(
  r: PhotoOcrBrowserManualTestExecutionClosureResult,
): boolean {
  if (r.checkId !== "8.10I") return false;
  if (r.allPassed !== true) return false;
  if (r.browserManualTestExecutionClosureOnly !== true) return false;
  if (r.browserManualTestPerformed !== true) return false;
  if (r.browserInvokedByOperator !== true) return false;
  if (r.devServerStartedByOperator !== true) return false;
  if (r.chromeDevToolsNetworkUsed !== true) return false;
  if (r.networkResponseBodiesDirectlyObserved !== true) return false;
  if (r.closureFileExecutedBrowser !== false) return false;
  if (r.closureFileStartedDevServer !== false) return false;
  if (r.closureFileInvokedApi !== false) return false;
  if (r.closureFileCalledFetch !== false) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.realImageUsed !== false) return false;
  if (r.syntheticImageUsed !== true) return false;
  if (r.physicalCameraCaptureUsed !== false) return false;
  if (r.localSyntheticImageUploadUsed !== true) return false;
  if (r.imageBytesReadByClosure !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrExtractionPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.uploadPersistencePerformed !== false) return false;
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
  if (r.sourceBrowserManualPlanningCommit !== "e7e2908") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceEnabledClosureAccepted !== true) return false;
  if (r.sourceRegressionPackAccepted !== true) return false;
  if (r.sourceBrowserUiWiringAuditAccepted !== true) return false;
  if (r.sourceBrowserManualPlanningAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.offScenarioPerformed !== true) return false;
  if (r.offScenarioEnvAbsent !== true) return false;
  if (r.offScenarioStatus !== 403) return false;
  if (r.offScenarioOk !== false) return false;
  if (r.offScenarioCode !== "photo_ocr_controlled_runtime_disabled") return false;
  if (r.offScenarioPhotoOcrMetaObserved !== true) return false;
  if (r.offScenarioPhotoOcrControlledRuntime !== false) return false;
  if (r.offScenarioPlaceholderOnly !== true) return false;
  if (r.offScenarioRealOcrExtractionPerformed !== false) return false;
  if (r.offScenarioOcrRuntimeStillBlocked !== true) return false;
  if (r.offScenarioModelCallPerformed !== false) return false;
  if (r.offScenarioNoUploadPersistence !== true) return false;
  if (r.offScenarioNoDbStorageDna !== true) return false;
  if (r.offScenarioNoPublicProductionGoLive !== true) return false;
  if (r.offScenarioEightThreeAcNotRun !== true) return false;

  if (r.onScenarioPerformed !== true) return false;
  if (r.onScenarioEnvExactTrue !== true) return false;
  if (r.onScenarioStatus !== 200) return false;
  if (r.onScenarioOk !== true) return false;
  if (r.onScenarioMode !== "photo_ocr_controlled_runtime") return false;
  if (r.onScenarioContext !== "anonymous") return false;
  if (r.onScenarioResultPresent !== true) return false;
  if (r.onScenarioResultClaimsOcrPerformed !== false) return false;
  if (r.onScenarioResultContainsExtractedText !== false) return false;
  if (r.onScenarioResultContainsExactDeadline !== false) return false;
  if (r.onScenarioResultContainsBindingLegalAdvice !== false) return false;
  if (r.onScenarioResultContainsOfficialFiling !== false) return false;
  if (r.onScenarioPhotoOcrMetaObserved !== true) return false;
  if (r.onScenarioPhotoOcrControlledRuntime !== true) return false;
  if (r.onScenarioPhotoInputOnly !== true) return false;
  if (r.onScenarioPlaceholderOnly !== true) return false;
  if (r.onScenarioRealOcrExtractionPerformed !== false) return false;
  if (r.onScenarioOcrRuntimeStillBlocked !== true) return false;
  if (r.onScenarioModelCallPerformed !== false) return false;
  if (r.onScenarioUploadRuntimeStillBlocked !== true) return false;
  if (r.onScenarioRawImagePersistenceBlocked !== true) return false;
  if (r.onScenarioProcessedImagePersistenceBlocked !== true) return false;
  if (r.onScenarioExtractedTextPersistenceBlocked !== true) return false;
  if (r.onScenarioDbStorageStillBlocked !== true) return false;
  if (r.onScenarioSupabaseStorageStillBlocked !== true) return false;
  if (r.onScenarioVayloDnaStillBlocked !== true) return false;
  if (r.onScenarioPaidDocumentModeStillBlocked !== true) return false;
  if (r.onScenarioPublicRuntimeStillBlocked !== true) return false;
  if (r.onScenarioProductionAuthorizedNow !== false) return false;
  if (r.onScenarioGoLiveAuthorizedNow !== false) return false;
  if (r.onScenarioModelOutputStillUntrusted !== true) return false;
  if (r.onScenarioOcrOutputStillUntrusted !== true) return false;
  if (r.onScenarioImageContentTreatedAsSensitive !== true) return false;
  if (r.onScenarioExtractedTextTreatedAsSensitive !== true) return false;
  if (r.onScenarioPrivacyDisclaimerRequired !== true) return false;
  if (r.onScenarioLegalDisclaimerRequired !== true) return false;
  if (r.onScenarioExactLegalDeadlineStillBlocked !== true) return false;
  if (r.onScenarioBindingLegalAdviceStillBlocked !== true) return false;
  if (r.onScenarioOfficialFilingGenerationStillBlocked !== true) return false;
  if (r.onScenarioEightThreeAcNotRun !== true) return false;

  if (r.uiSeparationPerformed !== true) return false;
  if (r.photoModePhotoOcrButtonVisible !== true) return false;
  if (r.photoModeTextDocumentButtonAbsent !== true) return false;
  if (r.textModeTextDocumentButtonVisible !== true) return false;
  if (r.textModePhotoOcrButtonAbsent !== true) return false;
  if (r.questionModePhotoOcrButtonAbsent !== true) return false;
  if (r.questionModeTextDocumentButtonAbsent !== true) return false;
  if (r.questionDefaultFlowVisible !== true) return false;
  if (r.noAutoUploadOnPhotoTabClick !== true) return false;
  if (r.explicitClickRequired !== true) return false;
  if (r.selectedSyntheticPageVisible !== true) return false;

  if (r.guardSpotChecksPerformed !== true) return false;
  if (r.noSelectedPageSpotCheckPerformed !== true) return false;
  if (r.noSelectedPageButtonDisabled !== true) return false;
  if (r.noSelectedPageRequestSent !== false) return false;
  if (r.unsupportedFileSpotCheckPerformed !== false) return false;
  if (r.unsupportedFileSpotCheckSkippedBecauseApiRegressionClosed !== true) return false;
  if (r.tooManyPagesSpotCheckPerformed !== false) return false;
  if (r.tooManyPagesSpotCheckSkippedBecauseApiRegressionClosed !== true) return false;
  if (r.fullApiGuardMatrixAlreadyClosedBy8_10F !== true) return false;

  if (r.cleanupPerformed !== true) return false;
  if (r.devServerStopped !== true) return false;
  if (r.photoOcrEnvFlagRemovedAfterTest !== true) return false;
  if (r.textDocumentEnvFlagRemovedAfterTest !== true) return false;
  if (r.freeQaEnvFlagRemovedAfterTest !== true) return false;
  if (r.envFlagsAllAbsentAfterCleanup !== true) return false;
  if (r.gitStatusCleanAfterCleanup !== true) return false;

  if (r.photoOcrBrowserManualExecutionPassed !== true) return false;
  if (r.readyForNextPhase !== "8.10J") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Internal Readiness Closure") return false;
  if (r.readyForPhotoOcrInternalReadinessClosure !== true) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.manualBrowserExecutionEvidence) || r.manualBrowserExecutionEvidence.length === 0) return false;
  if (!Array.isArray(r.offScenarioEvidence) || r.offScenarioEvidence.length === 0) return false;
  if (!Array.isArray(r.onScenarioEvidence) || r.onScenarioEvidence.length === 0) return false;
  if (!Array.isArray(r.uiSeparationEvidence) || r.uiSeparationEvidence.length === 0) return false;
  if (!Array.isArray(r.guardSpotCheckEvidence) || r.guardSpotCheckEvidence.length === 0) return false;
  if (!Array.isArray(r.networkInspectionEvidence) || r.networkInspectionEvidence.length === 0) return false;
  if (!Array.isArray(r.cleanupEvidence) || r.cleanupEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
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

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper810IMutation = (
  r: PhotoOcrBrowserManualTestExecutionClosureResult,
) => PhotoOcrBrowserManualTestExecutionClosureResult;
interface Tamper810ICase {
  label: string;
  mutate: Tamper810IMutation;
}

const PHOTO_OCR_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES: Tamper810ICase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10H" as "8.10I" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "browserManualTestExecutionClosureOnly false", mutate: (r) => ({ ...r, browserManualTestExecutionClosureOnly: false as true }) },
  { label: "browserManualTestPerformed false (browser manual test not marked performed)", mutate: (r) => ({ ...r, browserManualTestPerformed: false as true }) },
  { label: "browserInvokedByOperator false", mutate: (r) => ({ ...r, browserInvokedByOperator: false as true }) },
  { label: "devServerStartedByOperator false", mutate: (r) => ({ ...r, devServerStartedByOperator: false as true }) },
  { label: "chromeDevToolsNetworkUsed false", mutate: (r) => ({ ...r, chromeDevToolsNetworkUsed: false as true }) },
  { label: "networkResponseBodiesDirectlyObserved false (Network response body observation is false)", mutate: (r) => ({ ...r, networkResponseBodiesDirectlyObserved: false as true }) },
  { label: "closureFileExecutedBrowser true (closure file claims it executed browser)", mutate: (r) => ({ ...r, closureFileExecutedBrowser: true as false }) },
  { label: "closureFileStartedDevServer true (closure file claims it started dev server)", mutate: (r) => ({ ...r, closureFileStartedDevServer: true as false }) },
  { label: "closureFileInvokedApi true (closure file claims it invoked API)", mutate: (r) => ({ ...r, closureFileInvokedApi: true as false }) },
  { label: "closureFileCalledFetch true (closure file claims it called fetch)", mutate: (r) => ({ ...r, closureFileCalledFetch: true as false }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "realImageUsed true (real image used)", mutate: (r) => ({ ...r, realImageUsed: true as false }) },
  { label: "physicalCameraCaptureUsed true (physical camera capture used)", mutate: (r) => ({ ...r, physicalCameraCaptureUsed: true as false }) },
  { label: "imageBytesReadByClosure true", mutate: (r) => ({ ...r, imageBytesReadByClosure: true as false }) },
  { label: "ocrLibraryImported true", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true (real OCR extraction performed)", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPersistencePerformed true (upload persistence performed)", mutate: (r) => ({ ...r, uploadPersistencePerformed: true as false }) },
  { label: "persistencePerformed true", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
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
  { label: "sourceBrowserManualPlanningAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceBrowserManualPlanningAccepted: false }) },
  { label: "sourceBrowserManualPlanningCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceBrowserManualPlanningCommit: "0000000" as "e7e2908" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "offScenarioPerformed false (OFF scenario missing)", mutate: (r) => ({ ...r, offScenarioPerformed: false as true }) },
  { label: "offScenarioStatus wrong (OFF status differs)", mutate: (r) => ({ ...r, offScenarioStatus: 200 as 403 }) },
  { label: "offScenarioOk true (OFF ok differs)", mutate: (r) => ({ ...r, offScenarioOk: true as false }) },
  { label: "offScenarioCode wrong (OFF code differs)", mutate: (r) => ({ ...r, offScenarioCode: "ok" as "photo_ocr_controlled_runtime_disabled" }) },
  { label: "offScenarioPhotoOcrMetaObserved false (OFF meta missing)", mutate: (r) => ({ ...r, offScenarioPhotoOcrMetaObserved: false as true }) },
  { label: "offScenarioPhotoOcrControlledRuntime true (OFF meta claims runtime enabled)", mutate: (r) => ({ ...r, offScenarioPhotoOcrControlledRuntime: true as false }) },
  { label: "onScenarioPerformed false (ON scenario missing)", mutate: (r) => ({ ...r, onScenarioPerformed: false as true }) },
  { label: "onScenarioStatus wrong (ON status differs)", mutate: (r) => ({ ...r, onScenarioStatus: 403 as 200 }) },
  { label: "onScenarioOk false (ON ok differs)", mutate: (r) => ({ ...r, onScenarioOk: false as true }) },
  { label: "onScenarioMode wrong (ON mode differs)", mutate: (r) => ({ ...r, onScenarioMode: "text_document_controlled_runtime" as "photo_ocr_controlled_runtime" }) },
  { label: "onScenarioContext wrong (ON context differs)", mutate: (r) => ({ ...r, onScenarioContext: "public" as "anonymous" }) },
  { label: "onScenarioPhotoOcrMetaObserved false (ON meta missing)", mutate: (r) => ({ ...r, onScenarioPhotoOcrMetaObserved: false as true }) },
  { label: "onScenarioPlaceholderOnly false (ON placeholderOnly false)", mutate: (r) => ({ ...r, onScenarioPlaceholderOnly: false as true }) },
  { label: "onScenarioRealOcrExtractionPerformed true (ON realOcrExtractionPerformed true)", mutate: (r) => ({ ...r, onScenarioRealOcrExtractionPerformed: true as false }) },
  { label: "onScenarioOcrRuntimeStillBlocked false (ON ocrRuntimeStillBlocked false)", mutate: (r) => ({ ...r, onScenarioOcrRuntimeStillBlocked: false as true }) },
  { label: "onScenarioModelCallPerformed true (ON modelCallPerformed true)", mutate: (r) => ({ ...r, onScenarioModelCallPerformed: true as false }) },
  { label: "onScenarioUploadRuntimeStillBlocked false (ON upload/persistence allowed)", mutate: (r) => ({ ...r, onScenarioUploadRuntimeStillBlocked: false as true }) },
  { label: "onScenarioRawImagePersistenceBlocked false (ON upload/persistence allowed)", mutate: (r) => ({ ...r, onScenarioRawImagePersistenceBlocked: false as true }) },
  { label: "onScenarioProcessedImagePersistenceBlocked false (ON upload/persistence allowed)", mutate: (r) => ({ ...r, onScenarioProcessedImagePersistenceBlocked: false as true }) },
  { label: "onScenarioExtractedTextPersistenceBlocked false (ON upload/persistence allowed)", mutate: (r) => ({ ...r, onScenarioExtractedTextPersistenceBlocked: false as true }) },
  { label: "onScenarioDbStorageStillBlocked false (ON DB/storage/DNA allowed)", mutate: (r) => ({ ...r, onScenarioDbStorageStillBlocked: false as true }) },
  { label: "onScenarioSupabaseStorageStillBlocked false (ON DB/storage/DNA allowed)", mutate: (r) => ({ ...r, onScenarioSupabaseStorageStillBlocked: false as true }) },
  { label: "onScenarioVayloDnaStillBlocked false (ON DB/storage/DNA allowed)", mutate: (r) => ({ ...r, onScenarioVayloDnaStillBlocked: false as true }) },
  { label: "onScenarioPaidDocumentModeStillBlocked false (ON DB/storage/DNA allowed)", mutate: (r) => ({ ...r, onScenarioPaidDocumentModeStillBlocked: false as true }) },
  { label: "onScenarioPublicRuntimeStillBlocked false (ON public/production/go-live allowed)", mutate: (r) => ({ ...r, onScenarioPublicRuntimeStillBlocked: false as true }) },
  { label: "onScenarioProductionAuthorizedNow true (ON public/production/go-live allowed)", mutate: (r) => ({ ...r, onScenarioProductionAuthorizedNow: true as false }) },
  { label: "onScenarioGoLiveAuthorizedNow true (ON public/production/go-live allowed)", mutate: (r) => ({ ...r, onScenarioGoLiveAuthorizedNow: true as false }) },
  { label: "onScenarioModelOutputStillUntrusted false (ON model/OCR output trusted)", mutate: (r) => ({ ...r, onScenarioModelOutputStillUntrusted: false as true }) },
  { label: "onScenarioOcrOutputStillUntrusted false (ON model/OCR output trusted)", mutate: (r) => ({ ...r, onScenarioOcrOutputStillUntrusted: false as true }) },
  { label: "onScenarioImageContentTreatedAsSensitive false (ON image/extracted text not sensitive)", mutate: (r) => ({ ...r, onScenarioImageContentTreatedAsSensitive: false as true }) },
  { label: "onScenarioExtractedTextTreatedAsSensitive false (ON image/extracted text not sensitive)", mutate: (r) => ({ ...r, onScenarioExtractedTextTreatedAsSensitive: false as true }) },
  { label: "onScenarioPrivacyDisclaimerRequired false (ON privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, onScenarioPrivacyDisclaimerRequired: false as true }) },
  { label: "onScenarioLegalDisclaimerRequired false (ON privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, onScenarioLegalDisclaimerRequired: false as true }) },
  { label: "onScenarioResultClaimsOcrPerformed true", mutate: (r) => ({ ...r, onScenarioResultClaimsOcrPerformed: true as false }) },
  { label: "onScenarioResultContainsExtractedText true", mutate: (r) => ({ ...r, onScenarioResultContainsExtractedText: true as false }) },
  { label: "uiSeparationPerformed false (UI separation missing)", mutate: (r) => ({ ...r, uiSeparationPerformed: false as true }) },
  { label: "photoModePhotoOcrButtonVisible false (photo button not visible in photo mode)", mutate: (r) => ({ ...r, photoModePhotoOcrButtonVisible: false as true }) },
  { label: "photoModeTextDocumentButtonAbsent false (text button visible in photo mode)", mutate: (r) => ({ ...r, photoModeTextDocumentButtonAbsent: false as true }) },
  { label: "textModePhotoOcrButtonAbsent false (photo button visible in text mode)", mutate: (r) => ({ ...r, textModePhotoOcrButtonAbsent: false as true }) },
  { label: "questionModePhotoOcrButtonAbsent false (photo button visible in question mode)", mutate: (r) => ({ ...r, questionModePhotoOcrButtonAbsent: false as true }) },
  { label: "questionModeTextDocumentButtonAbsent false (text button visible in question mode)", mutate: (r) => ({ ...r, questionModeTextDocumentButtonAbsent: false as true }) },
  { label: "guardSpotChecksPerformed false (no selected page spot check missing)", mutate: (r) => ({ ...r, guardSpotChecksPerformed: false as true }) },
  { label: "noSelectedPageSpotCheckPerformed false (no selected page spot check missing)", mutate: (r) => ({ ...r, noSelectedPageSpotCheckPerformed: false as true }) },
  { label: "noSelectedPageButtonDisabled false", mutate: (r) => ({ ...r, noSelectedPageButtonDisabled: false as true }) },
  { label: "noSelectedPageRequestSent true (no selected page request sent true)", mutate: (r) => ({ ...r, noSelectedPageRequestSent: true as false }) },
  { label: "unsupportedFileSpotCheckSkippedBecauseApiRegressionClosed false (unsupported skipped without 8.10F justification)", mutate: (r) => ({ ...r, unsupportedFileSpotCheckSkippedBecauseApiRegressionClosed: false as true }) },
  { label: "tooManyPagesSpotCheckSkippedBecauseApiRegressionClosed false (too-many-pages skipped without 8.10F justification)", mutate: (r) => ({ ...r, tooManyPagesSpotCheckSkippedBecauseApiRegressionClosed: false as true }) },
  { label: "fullApiGuardMatrixAlreadyClosedBy8_10F false", mutate: (r) => ({ ...r, fullApiGuardMatrixAlreadyClosedBy8_10F: false as true }) },
  { label: "cleanupPerformed false (cleanup missing)", mutate: (r) => ({ ...r, cleanupPerformed: false as true }) },
  { label: "devServerStopped false (cleanup missing)", mutate: (r) => ({ ...r, devServerStopped: false as true }) },
  { label: "photoOcrEnvFlagRemovedAfterTest false (env flags not removed)", mutate: (r) => ({ ...r, photoOcrEnvFlagRemovedAfterTest: false as true }) },
  { label: "textDocumentEnvFlagRemovedAfterTest false (env flags not removed)", mutate: (r) => ({ ...r, textDocumentEnvFlagRemovedAfterTest: false as true }) },
  { label: "freeQaEnvFlagRemovedAfterTest false (env flags not removed)", mutate: (r) => ({ ...r, freeQaEnvFlagRemovedAfterTest: false as true }) },
  { label: "envFlagsAllAbsentAfterCleanup false (env flags not removed)", mutate: (r) => ({ ...r, envFlagsAllAbsentAfterCleanup: false as true }) },
  { label: "gitStatusCleanAfterCleanup false (git status after cleanup not clean)", mutate: (r) => ({ ...r, gitStatusCleanAfterCleanup: false as true }) },
  { label: "photoOcrBrowserManualExecutionPassed false", mutate: (r) => ({ ...r, photoOcrBrowserManualExecutionPassed: false }) },
  { label: "readyForNextPhase wrong (next phase not 8.10J)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10K" as "8.10J" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Internal Readiness Closure" }) },
  { label: "readyForPhotoOcrInternalReadinessClosure false when execution passed", mutate: (r) => ({ ...r, readyForPhotoOcrInternalReadinessClosure: false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "manualBrowserExecutionEvidence emptied", mutate: (r) => ({ ...r, manualBrowserExecutionEvidence: [] }) },
  { label: "offScenarioEvidence emptied", mutate: (r) => ({ ...r, offScenarioEvidence: [] }) },
  { label: "onScenarioEvidence emptied", mutate: (r) => ({ ...r, onScenarioEvidence: [] }) },
  { label: "uiSeparationEvidence emptied", mutate: (r) => ({ ...r, uiSeparationEvidence: [] }) },
  { label: "guardSpotCheckEvidence emptied", mutate: (r) => ({ ...r, guardSpotCheckEvidence: [] }) },
  { label: "networkInspectionEvidence emptied", mutate: (r) => ({ ...r, networkInspectionEvidence: [] }) },
  { label: "cleanupEvidence emptied", mutate: (r) => ({ ...r, cleanupEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "evidenceLimitations wrong length/content", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "remainingBlockers wrong length/content", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runPhotoOcrBrowserManualTestExecutionClosure(): Promise<PhotoOcrBrowserManualTestExecutionClosureResult> {
  const closureFailures: string[] = [];

  // ── Source of truth: 8.10H browser manual test planning ───────────────────
  // 8.10H already re-validates 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N internally
  // (see the calling-strategy note above), so their per-source acceptance
  // fields are read directly below instead of re-invoking 8.10D/8.10E/8.10F/
  // 8.10G a second time.
  const h = await runPhotoOcrBrowserManualTestPlanning();
  if (h.checkId !== "8.10H") closureFailures.push(`8.10H checkId mismatch: got "${h.checkId}"`);
  if (h.allPassed !== true) closureFailures.push("8.10H allPassed is not true");
  if (h.readyForNextPhase !== "8.10I") closureFailures.push("8.10H readyForNextPhase is not 8.10I");
  if (h.readyForPhotoOcrBrowserManualExecution !== true) closureFailures.push("8.10H readyForPhotoOcrBrowserManualExecution is not true");
  if (h.sourceMinimalPatchAccepted !== true) closureFailures.push("8.10H sourceMinimalPatchAccepted is not true");
  if (h.sourceDisabledClosureAccepted !== true) closureFailures.push("8.10H sourceDisabledClosureAccepted is not true");
  if (h.sourceEnabledClosureAccepted !== true) closureFailures.push("8.10H sourceEnabledClosureAccepted is not true");
  if (h.sourceRegressionPackAccepted !== true) closureFailures.push("8.10H sourceRegressionPackAccepted is not true");
  if (h.sourceBrowserUiWiringAuditAccepted !== true) closureFailures.push("8.10H sourceBrowserUiWiringAuditAccepted is not true");
  if (h.sourceTextDocumentInternalReadinessAccepted !== true) closureFailures.push("8.10H sourceTextDocumentInternalReadinessAccepted is not true");
  if (h.tamperRejected !== h.tamperCount) closureFailures.push("8.10H own tamper count mismatch");
  const sourceBrowserManualPlanningAccepted = closureFailures.length === 0;

  const sourceMinimalPatchAccepted = h.sourceMinimalPatchAccepted === true;
  const sourceDisabledClosureAccepted = h.sourceDisabledClosureAccepted === true;
  const sourceEnabledClosureAccepted = h.sourceEnabledClosureAccepted === true;
  const sourceRegressionPackAccepted = h.sourceRegressionPackAccepted === true;
  const sourceBrowserUiWiringAuditAccepted = h.sourceBrowserUiWiringAuditAccepted === true;
  const sourceTextDocumentInternalReadinessAccepted = h.sourceTextDocumentInternalReadinessAccepted === true;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const manualBrowserExecutionEvidence: string[] = [
    "Pre-test: a synthetic local test image was created and used, containing only the text \"TEST IMAGE / NO PERSONAL DATA / PHOTO OCR PLACEHOLDER TEST\".",
    "Pre-test: physical camera capture was NOT used; local synthetic image upload/gallery selection was used instead.",
    "Pre-test: no real document was used; no PII was used; no real OCR extraction was expected or performed.",
    "This closure file itself performed zero browser/dev-server/API/fetch invocations — all evidence below is the operator's hardcoded manual observation, consistent with the 8.9M precedent.",
  ];

  const offScenarioEvidence: string[] = [
    "Env flag SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED was absent.",
    "Browser path: http://localhost:3000/smart-talk.",
    "Photo mode selected; synthetic PNG page selected.",
    'Clicked "Interný test: Photo/OCR placeholder".',
    "Chrome DevTools Network response body inspected.",
    "Observed: HTTP status 403, ok: false, code: \"photo_ocr_controlled_runtime_disabled\".",
    "Observed photoOcrMeta present with photoOcrControlledRuntime: false, photoInputOnly: true, placeholderOnly: true, realOcrExtractionPerformed: false, ocrRuntimeStillBlocked: true, modelCallPerformed: false.",
    "Observed photoOcrMeta upload/persistence/storage/DNA flags all blocked: uploadRuntimeStillBlocked, rawImagePersistenceBlocked, processedImagePersistenceBlocked, extractedTextPersistenceBlocked, dbStorageStillBlocked, supabaseStorageStillBlocked, vayloDnaStillBlocked, paidDocumentModeStillBlocked all true.",
    "Observed photoOcrMeta public/production/go-live flags: publicRuntimeStillBlocked true, productionAuthorizedNow false, goLiveAuthorizedNow false.",
    "Observed photoOcrMeta trust/sensitivity/disclaimer flags: modelOutputStillUntrusted, ocrOutputStillUntrusted, imageContentTreatedAsSensitive, extractedTextTreatedAsSensitive, privacyDisclaimerRequired, legalDisclaimerRequired all true.",
    "Observed photoOcrMeta legal-risk flags: exactLegalDeadlineStillBlocked, bindingLegalAdviceStillBlocked, officialFilingGenerationStillBlocked all true.",
    "Observed photoOcrMeta eightThreeAcNotRun: true.",
  ];

  const onScenarioEvidence: string[] = [
    'SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED set exactly to "true"; Test-Path Env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED returned True; $env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED returned "true".',
    "Dev server restarted and reported Ready.",
    "Browser path: http://localhost:3000/smart-talk.",
    "Photo mode selected; synthetic PNG page selected.",
    'Clicked "Interný test: Photo/OCR placeholder".',
    "Chrome DevTools Network response body inspected.",
    "Observed: HTTP status 200, ok: true, mode: \"photo_ocr_controlled_runtime\", context: \"anonymous\".",
    "Observed result present, with summary text \"Obrázok bol prijatý len na kontrolovanú internú validáciu Photo/OCR placeholder cesty.\" confirming real OCR extraction is not active yet, and warnings noting OCR extraction was not performed and this is an internal controlled placeholder.",
    "Observed result does NOT claim OCR was performed, does NOT contain extracted text, an exact legal deadline, binding legal advice, or official filing content.",
    "Observed photoOcrMeta present with photoOcrControlledRuntime: true, photoInputOnly: true, placeholderOnly: true, realOcrExtractionPerformed: false, ocrRuntimeStillBlocked: true, modelCallPerformed: false.",
    "Observed photoOcrMeta upload/persistence/storage/DNA flags all blocked: uploadRuntimeStillBlocked, rawImagePersistenceBlocked, processedImagePersistenceBlocked, extractedTextPersistenceBlocked, dbStorageStillBlocked, supabaseStorageStillBlocked, vayloDnaStillBlocked, paidDocumentModeStillBlocked all true.",
    "Observed photoOcrMeta public/production/go-live flags: publicRuntimeStillBlocked true, productionAuthorizedNow false, goLiveAuthorizedNow false.",
    "Observed photoOcrMeta trust/sensitivity/disclaimer flags: modelOutputStillUntrusted, ocrOutputStillUntrusted, imageContentTreatedAsSensitive, extractedTextTreatedAsSensitive, privacyDisclaimerRequired, legalDisclaimerRequired all true.",
    "Observed photoOcrMeta legal-risk flags: exactLegalDeadlineStillBlocked, bindingLegalAdviceStillBlocked, officialFilingGenerationStillBlocked all true.",
    "Observed photoOcrMeta eightThreeAcNotRun: true.",
  ];

  const uiSeparationEvidence: string[] = [
    'Photo mode: "Interný test: Photo/OCR placeholder" visible: true.',
    'Photo mode: "Interný test: Text Document Mode" absent: true.',
    "Photo mode: selected synthetic page visible: true.",
    "Photo mode: no auto-upload on photo tab click: true; explicit click required: true.",
    'Text mode: "Interný test: Text Document Mode" visible: true.',
    'Text mode: "Interný test: Photo/OCR placeholder" absent: true.',
    'Question/default mode: "Interný test: Photo/OCR placeholder" absent: true; "Interný test: Text Document Mode" absent: true.',
    'Question/default mode: default flow visible: true, default button visible: "Opýtať sa Vayla".',
  ];

  const guardSpotCheckEvidence: string[] = [
    'No selected page: image removed with "Odstrániť"; selected page count became zero; "Interný test: Photo/OCR placeholder" observed disabled; no request was sent; spot check passed.',
    "Unsupported file type spot check was NOT performed because the full 22/22 API guard matrix was already closed in 8.10E/8.10F.",
    "Too many pages spot check was NOT performed because the full 22/22 API guard matrix was already closed in 8.10E/8.10F.",
  ];

  const networkInspectionEvidence: string[] = [
    "Chrome DevTools Network tab was used for both the OFF and ON scenarios.",
    "Network response bodies were directly observed and read for HTTP status, ok, code, mode, context, and photoOcrMeta.",
    "No rate limit (429 smart_talk_rate_limited) was observed during this manual browser execution.",
  ];

  const cleanupEvidence: string[] = [
    "Dev server was stopped after manual test completion.",
    "Remove-Item Env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED executed.",
    "Remove-Item Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED executed.",
    "Remove-Item Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED executed.",
    "Test-Path Env:SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED returned False.",
    "Test-Path Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED returned False.",
    "Test-Path Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED returned False.",
    "git status --short returned clean after cleanup.",
    "8.3AC was not run; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "OFF scenario fails closed with HTTP 403 and code photo_ocr_controlled_runtime_disabled when the env flag is absent — matching the already-accepted 8.10D contract.",
    "ON scenario succeeds only as a metadata-only placeholder (HTTP 200) with a full photoOcrMeta contract confirming no real OCR, no model call, no persistence, no storage/DB/DNA write, and no public/production/go-live enablement — matching the already-accepted 8.10E contract.",
    "The Photo/OCR internal button and the Text Document Mode internal button remain mutually exclusive across photo/text/question modes, confirming no cross-mode leakage.",
    "The internal Photo/OCR button requires an explicit click and a selected page; it cannot be triggered automatically or without a selected image.",
    "The result rendered in the UI explicitly states real OCR extraction is not active and does not claim the document was read.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No real image or real document was used at any point in this manual execution — only a synthetic local PNG test image with non-personal placeholder text.",
    "No physical camera capture was used; only local synthetic image upload/gallery selection.",
    "No real OCR extraction occurred in either the OFF or ON scenario.",
    "No model call occurred in either the OFF or ON scenario.",
    "No upload persistence, raw/processed image persistence, or extracted text persistence occurred.",
    "No DB write, Supabase storage write, or Vaylo DNA write occurred.",
    "No public runtime, production, or go-live authorization occurred.",
    "8.3AC was not run and tmp-8-3ac-live-metadata.ts was not touched during this manual execution or by this closure file.",
  ];

  const notes: string[] = [
    "EC-01: 8.10I is an execution closure only. This file hardcodes operator-observed manual browser test results; it does not invoke browser/dev-server/API/fetch itself.",
    `EC-02: 8.10H confirmed as source evidence — checkId=${h.checkId}, allPassed=${h.allPassed}, readyForPhotoOcrBrowserManualExecution=${h.readyForPhotoOcrBrowserManualExecution}, readyForNextPhase=${h.readyForNextPhase}.`,
    "EC-03: 8.10C/8.10D/8.10E/8.10F/8.10G/8.9N acceptance is read from 8.10H's own already-computed source-acceptance fields (8.10H already re-validates them internally via 8.10G), rather than re-invoking their in-process route calls a second time, to avoid exceeding the route's real in-memory rate limit (5 requests/10 minutes per synthetic IP) across the combined source-of-truth chain.",
    "EC-04: OFF scenario observed exactly as expected — HTTP 403, ok false, code photo_ocr_controlled_runtime_disabled, photoOcrMeta confirms disabled/blocked state, no OCR/model/upload/persistence/DB/storage/DNA/public/production/go-live.",
    "EC-05: ON allowed-placeholder scenario observed exactly as expected — HTTP 200, ok true, mode photo_ocr_controlled_runtime, context anonymous, photoOcrMeta confirms placeholder-only state with all safety/blocking/disclaimer flags true.",
    "EC-06: UI separation confirmed — Photo/OCR button photo-mode-only, Text Document Mode button text-mode-only, both absent from question/default mode, default flow unaffected, no auto-upload, explicit click required.",
    "EC-07: guard spot check confirmed — no-selected-page case passed (button disabled, no request sent); unsupported-file-type and too-many-pages spot checks were intentionally skipped because the full 22/22 API guard matrix is already closed by 8.10E/8.10F.",
    "EC-08: no rate limit was observed during this manual execution.",
    "EC-09: cleanup confirmed — dev server stopped, all three env flags removed and confirmed absent via Test-Path, git status clean.",
    "EC-10: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "EC-11: ready for Phase 8.10J — Photo/OCR Internal Readiness Closure.",
  ];

  const tamperCount = PHOTO_OCR_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES.length;

  const provisional: PhotoOcrBrowserManualTestExecutionClosureResult = {
    checkId: "8.10I",
    allPassed: true,
    browserManualTestExecutionClosureOnly: true,
    browserManualTestPerformed: true,
    browserInvokedByOperator: true,
    devServerStartedByOperator: true,
    chromeDevToolsNetworkUsed: true,
    networkResponseBodiesDirectlyObserved: true,
    closureFileExecutedBrowser: false,
    closureFileStartedDevServer: false,
    closureFileInvokedApi: false,
    closureFileCalledFetch: false,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    realImageUsed: false,
    syntheticImageUsed: true,
    physicalCameraCaptureUsed: false,
    localSyntheticImageUploadUsed: true,
    imageBytesReadByClosure: false,
    ocrLibraryImported: false,
    ocrExtractionPerformed: false,
    modelCallPerformed: false,
    uploadPersistencePerformed: false,
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
    sourceBrowserManualPlanningCommit: "e7e2908",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceEnabledClosureAccepted,
    sourceRegressionPackAccepted,
    sourceBrowserUiWiringAuditAccepted,
    sourceBrowserManualPlanningAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    offScenarioPerformed: true,
    offScenarioEnvAbsent: true,
    offScenarioStatus: 403,
    offScenarioOk: false,
    offScenarioCode: "photo_ocr_controlled_runtime_disabled",
    offScenarioPhotoOcrMetaObserved: true,
    offScenarioPhotoOcrControlledRuntime: false,
    offScenarioPlaceholderOnly: true,
    offScenarioRealOcrExtractionPerformed: false,
    offScenarioOcrRuntimeStillBlocked: true,
    offScenarioModelCallPerformed: false,
    offScenarioNoUploadPersistence: true,
    offScenarioNoDbStorageDna: true,
    offScenarioNoPublicProductionGoLive: true,
    offScenarioEightThreeAcNotRun: true,

    onScenarioPerformed: true,
    onScenarioEnvExactTrue: true,
    onScenarioStatus: 200,
    onScenarioOk: true,
    onScenarioMode: "photo_ocr_controlled_runtime",
    onScenarioContext: "anonymous",
    onScenarioResultPresent: true,
    onScenarioResultClaimsOcrPerformed: false,
    onScenarioResultContainsExtractedText: false,
    onScenarioResultContainsExactDeadline: false,
    onScenarioResultContainsBindingLegalAdvice: false,
    onScenarioResultContainsOfficialFiling: false,
    onScenarioPhotoOcrMetaObserved: true,
    onScenarioPhotoOcrControlledRuntime: true,
    onScenarioPhotoInputOnly: true,
    onScenarioPlaceholderOnly: true,
    onScenarioRealOcrExtractionPerformed: false,
    onScenarioOcrRuntimeStillBlocked: true,
    onScenarioModelCallPerformed: false,
    onScenarioUploadRuntimeStillBlocked: true,
    onScenarioRawImagePersistenceBlocked: true,
    onScenarioProcessedImagePersistenceBlocked: true,
    onScenarioExtractedTextPersistenceBlocked: true,
    onScenarioDbStorageStillBlocked: true,
    onScenarioSupabaseStorageStillBlocked: true,
    onScenarioVayloDnaStillBlocked: true,
    onScenarioPaidDocumentModeStillBlocked: true,
    onScenarioPublicRuntimeStillBlocked: true,
    onScenarioProductionAuthorizedNow: false,
    onScenarioGoLiveAuthorizedNow: false,
    onScenarioModelOutputStillUntrusted: true,
    onScenarioOcrOutputStillUntrusted: true,
    onScenarioImageContentTreatedAsSensitive: true,
    onScenarioExtractedTextTreatedAsSensitive: true,
    onScenarioPrivacyDisclaimerRequired: true,
    onScenarioLegalDisclaimerRequired: true,
    onScenarioExactLegalDeadlineStillBlocked: true,
    onScenarioBindingLegalAdviceStillBlocked: true,
    onScenarioOfficialFilingGenerationStillBlocked: true,
    onScenarioEightThreeAcNotRun: true,

    uiSeparationPerformed: true,
    photoModePhotoOcrButtonVisible: true,
    photoModeTextDocumentButtonAbsent: true,
    textModeTextDocumentButtonVisible: true,
    textModePhotoOcrButtonAbsent: true,
    questionModePhotoOcrButtonAbsent: true,
    questionModeTextDocumentButtonAbsent: true,
    questionDefaultFlowVisible: true,
    noAutoUploadOnPhotoTabClick: true,
    explicitClickRequired: true,
    selectedSyntheticPageVisible: true,

    guardSpotChecksPerformed: true,
    noSelectedPageSpotCheckPerformed: true,
    noSelectedPageButtonDisabled: true,
    noSelectedPageRequestSent: false,
    unsupportedFileSpotCheckPerformed: false,
    unsupportedFileSpotCheckSkippedBecauseApiRegressionClosed: true,
    tooManyPagesSpotCheckPerformed: false,
    tooManyPagesSpotCheckSkippedBecauseApiRegressionClosed: true,
    fullApiGuardMatrixAlreadyClosedBy8_10F: true,

    cleanupPerformed: true,
    devServerStopped: true,
    photoOcrEnvFlagRemovedAfterTest: true,
    textDocumentEnvFlagRemovedAfterTest: true,
    freeQaEnvFlagRemovedAfterTest: true,
    envFlagsAllAbsentAfterCleanup: true,
    gitStatusCleanAfterCleanup: true,

    photoOcrBrowserManualExecutionPassed: true,
    readyForNextPhase: "8.10J",
    recommendedNextPhase: "Photo/OCR Internal Readiness Closure",
    readyForPhotoOcrInternalReadinessClosure: true,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    manualBrowserExecutionEvidence,
    offScenarioEvidence,
    onScenarioEvidence,
    uiSeparationEvidence,
    guardSpotCheckEvidence,
    networkInspectionEvidence,
    cleanupEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.10J: Photo/OCR Internal Readiness Closure — consolidate all Photo/OCR evidence (8.10C minimal patch, 8.10D/8.10E API closures, 8.10F regression pack, 8.10G UI wiring audit, 8.10H manual test planning, 8.10I manual test execution closure) into a formal internal readiness verdict.",
      "Real OCR extraction design and implementation remain separate, later, explicitly authorized phases.",
      "Public runtime, production, and go-live remain unauthorized and explicitly deferred.",
    ],
    notes,
  };

  if (closureFailures.length === 0 && !_isCanonicalPhotoOcrBrowserManualTestExecutionClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrBrowserManualTestExecutionClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10I tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed = closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10I tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
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
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-browser-manual-test-execution-closure");

if (invokedDirectly) {
  runPhotoOcrBrowserManualTestExecutionClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
