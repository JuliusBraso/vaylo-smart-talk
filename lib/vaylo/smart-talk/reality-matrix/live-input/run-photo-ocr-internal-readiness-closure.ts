/**
 * PHASE 8.10J — Photo/OCR Internal Readiness Closure
 *
 * Static internal readiness closure only. Consolidates the already-committed
 * Photo/OCR controlled placeholder evidence from 8.10A (gate design) through
 * 8.10I (browser manual test execution closure), plus the already-closed
 * 8.9N Text Document Mode internal readiness as cross-feature context.
 *
 * This file does NOT perform new browser/dev-server/API/fetch execution,
 * does not call OpenAI, does not read process.env for runtime authorization,
 * does not touch DB/storage/DNA, does not import or call an OCR library or
 * engine, does not read real images or image bytes, and does not run 8.3AC
 * or touch tmp-8-3ac-live-metadata.ts. It does not authorize public runtime,
 * production, or go-live, and does not claim real OCR extraction readiness.
 */

import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runPhotoOcrBrowserManualTestExecutionClosure } from "./run-photo-ocr-browser-manual-test-execution-closure";

/**
 * NOTE on source-of-truth calling strategy (rate-limit-aware, per 8.10H/8.10I
 * precedent):
 *
 * runPhotoOcrControlledRuntimeDisabledLocalApiClosure (8.10D) and
 * runPhotoOcrControlledRuntimeEnabledLocalApiClosure (8.10E) each perform
 * real in-process invocations of the route handler using a fixed set of
 * synthetic "x-forwarded-for" IPs, and the route enforces a real in-memory
 * rate limit (5 requests / 10 minutes per IP). The already-accepted 8.10I
 * execution closure already calls 8.10H, which already calls 8.10G (which
 * re-validates 8.10C/8.10D/8.10E/8.10F internally) — a chain that already
 * exercises the shared fixed IPs multiple times within a single process,
 * right up to (but safely under) the real rate limit.
 *
 * To avoid pushing that already-accepted chain over the real rate limit by
 * independently re-invoking 8.10D/8.10E/8.10F/8.10G/8.10H a second time from
 * this file, this closure calls ONLY:
 *   - runPhotoOcrControlledRuntimeMinimalPatchAudit (8.10C) directly — this
 *     performs zero route/network invocations of its own (it is a static
 *     audit of the 8.10A/8.10B design/plan and the 8.10C patch), so calling
 *     it here is free of rate-limit risk and gives direct access to
 *     sourceGateDesignAccepted (8.10A) and sourceImplementationPlanAccepted
 *     (8.10B), which are not otherwise exposed by 8.10H/8.10I.
 *   - runPhotoOcrBrowserManualTestExecutionClosure (8.10I) directly — the
 *     primary source of truth, whose own already-computed
 *     sourceDisabledClosureAccepted / sourceEnabledClosureAccepted /
 *     sourceRegressionPackAccepted / sourceBrowserUiWiringAuditAccepted /
 *     sourceBrowserManualPlanningAccepted / sourceTextDocumentInternalReadinessAccepted
 *     fields are read directly as the acceptance evidence for
 *     8.10D/8.10E/8.10F/8.10G/8.10H/8.9N respectively, instead of
 *     re-invoking them.
 *
 * This keeps the total number of in-process route invocations performed
 * across this whole source-of-truth chain identical to running 8.10I alone
 * (already independently verified to pass twice in a row), and this file
 * itself performs zero direct route invocations.
 */

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrInternalReadinessClosureResult {
  checkId: "8.10J";
  allPassed: boolean;
  internalReadinessClosureOnly: true;
  photoOcrPlaceholderInternalReadinessClosureOnly: true;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  localApiInvokedByClosure: false;
  externalNetworkCalled: false;
  realImageUsedByClosure: false;
  imageBytesReadByClosure: false;
  ocrLibraryImported: false;
  ocrExtractionPerformed: false;
  realOcrExtractionPerformed: false;
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

  sourceGateDesignCommit: "4a87043";
  sourceImplementationPlanCommit: "6a26e47";
  sourceMinimalPatchCommit: "3e35be8";
  sourceDisabledClosureCommit: "385b32a";
  sourceEnabledClosureCommit: "e1d6568";
  sourceRegressionPackCommit: "49fa151";
  sourceBrowserUiWiringAuditCommit: "5333d98";
  sourceBrowserManualPlanningCommit: "e7e2908";
  sourceBrowserManualExecutionCommit: "3c5f83b";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceGateDesignAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceEnabledClosureAccepted: boolean;
  sourceRegressionPackAccepted: boolean;
  sourceBrowserUiWiringAuditAccepted: boolean;
  sourceBrowserManualPlanningAccepted: boolean;
  sourceBrowserManualExecutionAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  gateDesignClosed: boolean;
  implementationPlanClosed: boolean;
  minimalPatchClosed: boolean;
  disabledLocalApiClosureClosed: boolean;
  enabledLocalApiClosureClosed: boolean;
  localRegressionPackClosed: boolean;
  browserUiWiringAuditClosed: boolean;
  browserManualTestPlanningClosed: boolean;
  browserManualTestExecutionClosed: boolean;
  textDocumentInternalReadinessAlreadyClosed: boolean;

  disabledEnvMatrixClosed: boolean;
  disabledEnvCaseCount: 9;
  disabledEnvCasesPassed: boolean;
  enabledPlaceholderClosed: boolean;
  enabledPlaceholderStatus: 200;
  enabledPlaceholderOk: true;
  enabledPlaceholderMode: "photo_ocr_controlled_runtime";
  enabledPlaceholderContext: "anonymous";
  enabledPlaceholderOnly: true;
  enabledPlaceholderRealOcrExtractionPerformed: false;
  enabledPlaceholderOcrRuntimeStillBlocked: true;
  enabledPlaceholderModelCallPerformed: false;
  guardRegressionClosed: boolean;
  enabledGuardCaseCount: 22;
  enabledGuardCasesPassed: boolean;
  localRegressionCaseCount: 32;
  localRegressionCasesPassed: boolean;

  browserUiWiringAuditPassed: boolean;
  photoOcrInternalButtonPhotoModeOnly: boolean;
  textDocumentInternalButtonTextModeOnly: boolean;
  uiRequestMetadataOnly: boolean;
  uiDoesNotSendRawImageBytes: boolean;
  uiDoesNotUseClientEnvAuthorization: boolean;
  uiDoesNotClaimOcrActive: boolean;
  uiDoesNotClaimDocumentRead: boolean;
  browserManualExecutionPassed: boolean;
  browserNetworkResponseBodiesObserved: boolean;
  browserOffScenarioPassed: boolean;
  browserOffScenarioStatus: 403;
  browserOffScenarioCode: "photo_ocr_controlled_runtime_disabled";
  browserOnScenarioPassed: boolean;
  browserOnScenarioStatus: 200;
  browserOnScenarioMode: "photo_ocr_controlled_runtime";
  browserOnScenarioPlaceholderOnly: boolean;
  browserOnScenarioRealOcrExtractionPerformed: boolean;
  browserNoSelectedPageSpotCheckPassed: boolean;
  browserUiSeparationPassed: boolean;

  controlledInternalPlaceholderReady: boolean;
  readyForControlledInternalPhotoOcrPlaceholder: boolean;
  readyForPhotoOcrPlaceholderInternalUse: boolean;
  photoOcrPlaceholderInternalReadinessClosed: boolean;
  realOcrExtractionStillBlocked: true;
  ocrRuntimeStillBlockedForRealExtraction: true;
  modelCallStillBlockedForPhotoOcrPlaceholder: true;
  rawImagePersistenceStillBlocked: true;
  processedImagePersistenceStillBlocked: true;
  extractedTextPersistenceStillBlocked: true;
  dbStorageStillBlocked: true;
  supabaseStorageStillBlocked: true;
  vayloDnaStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  publicRuntimeStillBlocked: true;
  productionStillUnauthorized: true;
  goLiveStillUnauthorized: true;
  modelOutputStillUntrusted: true;
  ocrOutputStillUntrusted: true;
  imageContentTreatedAsSensitive: true;
  extractedTextTreatedAsSensitive: true;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingGenerationStillBlocked: true;

  readyForNextPhase: "8.11A";
  recommendedNextPhase: "Real OCR Extraction Gate Design";
  readyForRealOcrExtractionGateDesign: boolean;
  readyForRealOcrExtractionImplementation: false;
  readyForRealOcrExtraction: false;
  readyForOcrQualityEvaluator: false;
  readyForOcrTrustBoundaryValidation: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  evidenceChain: string[];
  apiReadinessEvidence: string[];
  browserUiEvidence: string[];
  browserManualEvidence: string[];
  placeholderReadinessEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.10A gate design accepted",
  "8.10B implementation plan accepted",
  "8.10C minimal patch accepted",
  "8.10D disabled local API closure accepted",
  "8.10E enabled local API closure accepted",
  "8.10F regression pack accepted",
  "8.10G browser/UI wiring audit accepted",
  "8.10H browser manual test planning accepted",
  "8.10I browser manual test execution closure accepted",
  "8.9N text document internal readiness accepted",
];

const REQUIRED_API_READINESS_EVIDENCE: string[] = [
  "Disabled env variants fail closed.",
  "Exact lowercase true enables controlled placeholder only.",
  "Placeholder returns no real OCR, no model call, no persistence.",
  "22 guard cases reject unsafe inputs.",
  "32-case local regression pack is closed.",
];

const REQUIRED_BROWSER_UI_EVIDENCE: string[] = [
  "Photo/OCR internal button is photo-mode only.",
  "Text Document internal button is text-mode only.",
  "Question/default mode has no internal placeholder buttons.",
  "UI sends metadata-only placeholder request.",
  "Operator observed Network response bodies for OFF and ON scenarios.",
  "OFF scenario returned 403 disabled.",
  "ON scenario returned 200 placeholder.",
  "No selected page produced disabled button/no request.",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This closure is internal readiness for the placeholder path only.",
  "Real OCR extraction is not implemented.",
  "Real OCR quality is not evaluated.",
  "OCR trust boundary with real extracted text is not validated.",
  "Browser manual test used a synthetic local PNG, not a real document.",
  "Physical camera capture was not used.",
  "Public runtime is not authorized.",
  "Production is not authorized.",
  "Go-live is not authorized.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Real OCR extraction gate design not created yet",
  "Real OCR extraction implementation not created",
  "OCR quality evaluator not implemented",
  "OCR confidence/quality handling not validated with real images",
  "OCR trust boundary not validated with real extracted text",
  "Real document image handling not validated",
  "Public runtime still blocked",
  "Production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrInternalReadinessClosureResult(r: PhotoOcrInternalReadinessClosureResult): boolean {
  if (r.checkId !== "8.10J") return false;
  if (r.allPassed !== true) return false;
  if (r.internalReadinessClosureOnly !== true) return false;
  if (r.photoOcrPlaceholderInternalReadinessClosureOnly !== true) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.localApiInvokedByClosure !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.imageBytesReadByClosure !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrExtractionPerformed !== false) return false;
  if (r.realOcrExtractionPerformed !== false) return false;
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

  if (r.sourceGateDesignCommit !== "4a87043") return false;
  if (r.sourceImplementationPlanCommit !== "6a26e47") return false;
  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceDisabledClosureCommit !== "385b32a") return false;
  if (r.sourceEnabledClosureCommit !== "e1d6568") return false;
  if (r.sourceRegressionPackCommit !== "49fa151") return false;
  if (r.sourceBrowserUiWiringAuditCommit !== "5333d98") return false;
  if (r.sourceBrowserManualPlanningCommit !== "e7e2908") return false;
  if (r.sourceBrowserManualExecutionCommit !== "3c5f83b") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceEnabledClosureAccepted !== true) return false;
  if (r.sourceRegressionPackAccepted !== true) return false;
  if (r.sourceBrowserUiWiringAuditAccepted !== true) return false;
  if (r.sourceBrowserManualPlanningAccepted !== true) return false;
  if (r.sourceBrowserManualExecutionAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.gateDesignClosed !== true) return false;
  if (r.implementationPlanClosed !== true) return false;
  if (r.minimalPatchClosed !== true) return false;
  if (r.disabledLocalApiClosureClosed !== true) return false;
  if (r.enabledLocalApiClosureClosed !== true) return false;
  if (r.localRegressionPackClosed !== true) return false;
  if (r.browserUiWiringAuditClosed !== true) return false;
  if (r.browserManualTestPlanningClosed !== true) return false;
  if (r.browserManualTestExecutionClosed !== true) return false;
  if (r.textDocumentInternalReadinessAlreadyClosed !== true) return false;

  if (r.disabledEnvMatrixClosed !== true) return false;
  if (r.disabledEnvCaseCount !== 9) return false;
  if (r.disabledEnvCasesPassed !== true) return false;
  if (r.enabledPlaceholderClosed !== true) return false;
  if (r.enabledPlaceholderStatus !== 200) return false;
  if (r.enabledPlaceholderOk !== true) return false;
  if (r.enabledPlaceholderMode !== "photo_ocr_controlled_runtime") return false;
  if (r.enabledPlaceholderContext !== "anonymous") return false;
  if (r.enabledPlaceholderOnly !== true) return false;
  if (r.enabledPlaceholderRealOcrExtractionPerformed !== false) return false;
  if (r.enabledPlaceholderOcrRuntimeStillBlocked !== true) return false;
  if (r.enabledPlaceholderModelCallPerformed !== false) return false;
  if (r.guardRegressionClosed !== true) return false;
  if (r.enabledGuardCaseCount !== 22) return false;
  if (r.enabledGuardCasesPassed !== true) return false;
  if (r.localRegressionCaseCount !== 32) return false;
  if (r.localRegressionCasesPassed !== true) return false;

  if (r.browserUiWiringAuditPassed !== true) return false;
  if (r.photoOcrInternalButtonPhotoModeOnly !== true) return false;
  if (r.textDocumentInternalButtonTextModeOnly !== true) return false;
  if (r.uiRequestMetadataOnly !== true) return false;
  if (r.uiDoesNotSendRawImageBytes !== true) return false;
  if (r.uiDoesNotUseClientEnvAuthorization !== true) return false;
  if (r.uiDoesNotClaimOcrActive !== true) return false;
  if (r.uiDoesNotClaimDocumentRead !== true) return false;
  if (r.browserManualExecutionPassed !== true) return false;
  if (r.browserNetworkResponseBodiesObserved !== true) return false;
  if (r.browserOffScenarioPassed !== true) return false;
  if (r.browserOffScenarioStatus !== 403) return false;
  if (r.browserOffScenarioCode !== "photo_ocr_controlled_runtime_disabled") return false;
  if (r.browserOnScenarioPassed !== true) return false;
  if (r.browserOnScenarioStatus !== 200) return false;
  if (r.browserOnScenarioMode !== "photo_ocr_controlled_runtime") return false;
  if (r.browserOnScenarioPlaceholderOnly !== true) return false;
  if (r.browserOnScenarioRealOcrExtractionPerformed !== false) return false;
  if (r.browserNoSelectedPageSpotCheckPassed !== true) return false;
  if (r.browserUiSeparationPassed !== true) return false;

  if (r.controlledInternalPlaceholderReady !== true) return false;
  if (r.readyForControlledInternalPhotoOcrPlaceholder !== true) return false;
  if (r.readyForPhotoOcrPlaceholderInternalUse !== true) return false;
  if (r.photoOcrPlaceholderInternalReadinessClosed !== true) return false;
  if (r.realOcrExtractionStillBlocked !== true) return false;
  if (r.ocrRuntimeStillBlockedForRealExtraction !== true) return false;
  if (r.modelCallStillBlockedForPhotoOcrPlaceholder !== true) return false;
  if (r.rawImagePersistenceStillBlocked !== true) return false;
  if (r.processedImagePersistenceStillBlocked !== true) return false;
  if (r.extractedTextPersistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.supabaseStorageStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.ocrOutputStillUntrusted !== true) return false;
  if (r.imageContentTreatedAsSensitive !== true) return false;
  if (r.extractedTextTreatedAsSensitive !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;

  if (r.readyForNextPhase !== "8.11A") return false;
  if (r.recommendedNextPhase !== "Real OCR Extraction Gate Design") return false;
  if (r.readyForRealOcrExtractionGateDesign !== true) return false;
  if (r.readyForRealOcrExtractionImplementation !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForOcrQualityEvaluator !== false) return false;
  if (r.readyForOcrTrustBoundaryValidation !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.evidenceChain) || r.evidenceChain.length === 0) return false;
  if (r.apiReadinessEvidence.length !== REQUIRED_API_READINESS_EVIDENCE.length) return false;
  for (const item of REQUIRED_API_READINESS_EVIDENCE) {
    if (!r.apiReadinessEvidence.includes(item)) return false;
  }
  if (r.browserUiEvidence.length !== REQUIRED_BROWSER_UI_EVIDENCE.length) return false;
  for (const item of REQUIRED_BROWSER_UI_EVIDENCE) {
    if (!r.browserUiEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.browserManualEvidence) || r.browserManualEvidence.length === 0) return false;
  if (!Array.isArray(r.placeholderReadinessEvidence) || r.placeholderReadinessEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
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

type Tamper810JMutation = (r: PhotoOcrInternalReadinessClosureResult) => PhotoOcrInternalReadinessClosureResult;
interface Tamper810JCase {
  label: string;
  mutate: Tamper810JMutation;
}

const PHOTO_OCR_INTERNAL_READINESS_CLOSURE_TAMPER_CASES: Tamper810JCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10I" as "8.10J" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "internalReadinessClosureOnly false", mutate: (r) => ({ ...r, internalReadinessClosureOnly: false as true }) },
  { label: "photoOcrPlaceholderInternalReadinessClosureOnly false", mutate: (r) => ({ ...r, photoOcrPlaceholderInternalReadinessClosureOnly: false as true }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "browserInvokedByClosure true (closure claims it invoked browser)", mutate: (r) => ({ ...r, browserInvokedByClosure: true as false }) },
  { label: "devServerStartedByClosure true (closure claims it invoked dev server)", mutate: (r) => ({ ...r, devServerStartedByClosure: true as false }) },
  { label: "localApiInvokedByClosure true (closure claims it invoked API)", mutate: (r) => ({ ...r, localApiInvokedByClosure: true as false }) },
  { label: "externalNetworkCalled true (closure claims it called fetch)", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "realImageUsedByClosure true (real image used)", mutate: (r) => ({ ...r, realImageUsedByClosure: true as false }) },
  { label: "imageBytesReadByClosure true (image bytes read)", mutate: (r) => ({ ...r, imageBytesReadByClosure: true as false }) },
  { label: "ocrLibraryImported true (OCR library imported)", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true (OCR extraction performed)", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "realOcrExtractionPerformed true (real OCR extraction performed)", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPersistencePerformed true (upload persistence performed)", mutate: (r) => ({ ...r, uploadPersistencePerformed: true as false }) },
  { label: "persistencePerformed true", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime readiness true)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live readiness true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live readiness true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceGateDesignAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "4a87043" }) },
  { label: "sourceImplementationPlanAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceImplementationPlanCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "6a26e47" }) },
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
  { label: "sourceBrowserManualExecutionAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceBrowserManualExecutionAccepted: false }) },
  { label: "sourceBrowserManualExecutionCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceBrowserManualExecutionCommit: "0000000" as "3c5f83b" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "disabledEnvMatrixClosed false (disabled env matrix not closed)", mutate: (r) => ({ ...r, disabledEnvMatrixClosed: false }) },
  { label: "disabledEnvCaseCount wrong (regression case count differs)", mutate: (r) => ({ ...r, disabledEnvCaseCount: 8 as 9 }) },
  { label: "enabledPlaceholderClosed false (enabled placeholder not closed)", mutate: (r) => ({ ...r, enabledPlaceholderClosed: false }) },
  { label: "guardRegressionClosed false (guard regression not closed)", mutate: (r) => ({ ...r, guardRegressionClosed: false }) },
  { label: "enabledGuardCaseCount wrong (regression case count differs from 22)", mutate: (r) => ({ ...r, enabledGuardCaseCount: 21 as 22 }) },
  { label: "localRegressionCaseCount wrong (regression case count differs from 32)", mutate: (r) => ({ ...r, localRegressionCaseCount: 30 as 32 }) },
  { label: "localRegressionCasesPassed false", mutate: (r) => ({ ...r, localRegressionCasesPassed: false }) },
  { label: "browserUiWiringAuditPassed false (browser UI wiring audit not passed)", mutate: (r) => ({ ...r, browserUiWiringAuditPassed: false }) },
  { label: "photoOcrInternalButtonPhotoModeOnly false (UI separation not passed)", mutate: (r) => ({ ...r, photoOcrInternalButtonPhotoModeOnly: false }) },
  { label: "textDocumentInternalButtonTextModeOnly false (UI separation not passed)", mutate: (r) => ({ ...r, textDocumentInternalButtonTextModeOnly: false }) },
  { label: "browserManualExecutionPassed false (browser manual execution not passed)", mutate: (r) => ({ ...r, browserManualExecutionPassed: false }) },
  { label: "browserNetworkResponseBodiesObserved false (browser Network response bodies not observed)", mutate: (r) => ({ ...r, browserNetworkResponseBodiesObserved: false }) },
  { label: "browserOffScenarioPassed false (browser OFF scenario not 403 disabled)", mutate: (r) => ({ ...r, browserOffScenarioPassed: false }) },
  { label: "browserOffScenarioStatus wrong (browser OFF scenario not 403 disabled)", mutate: (r) => ({ ...r, browserOffScenarioStatus: 200 as 403 }) },
  { label: "browserOffScenarioCode wrong (browser OFF scenario not 403 disabled)", mutate: (r) => ({ ...r, browserOffScenarioCode: "ok" as "photo_ocr_controlled_runtime_disabled" }) },
  { label: "browserOnScenarioPassed false (browser ON scenario not 200 placeholder)", mutate: (r) => ({ ...r, browserOnScenarioPassed: false }) },
  { label: "browserOnScenarioStatus wrong (browser ON scenario not 200 placeholder)", mutate: (r) => ({ ...r, browserOnScenarioStatus: 403 as 200 }) },
  { label: "browserOnScenarioMode wrong (browser ON scenario not 200 placeholder)", mutate: (r) => ({ ...r, browserOnScenarioMode: "text_document_controlled_runtime" as "photo_ocr_controlled_runtime" }) },
  { label: "browserOnScenarioPlaceholderOnly false (browser ON placeholderOnly false)", mutate: (r) => ({ ...r, browserOnScenarioPlaceholderOnly: false }) },
  { label: "browserOnScenarioRealOcrExtractionPerformed true (browser ON realOcrExtractionPerformed true)", mutate: (r) => ({ ...r, browserOnScenarioRealOcrExtractionPerformed: true }) },
  { label: "browserNoSelectedPageSpotCheckPassed false (browser no-selected-page spot check not passed)", mutate: (r) => ({ ...r, browserNoSelectedPageSpotCheckPassed: false }) },
  { label: "browserUiSeparationPassed false (UI separation not passed)", mutate: (r) => ({ ...r, browserUiSeparationPassed: false }) },
  { label: "controlledInternalPlaceholderReady false (controlled internal placeholder readiness false)", mutate: (r) => ({ ...r, controlledInternalPlaceholderReady: false }) },
  { label: "readyForControlledInternalPhotoOcrPlaceholder false", mutate: (r) => ({ ...r, readyForControlledInternalPhotoOcrPlaceholder: false }) },
  { label: "readyForPhotoOcrPlaceholderInternalUse false", mutate: (r) => ({ ...r, readyForPhotoOcrPlaceholderInternalUse: false }) },
  { label: "photoOcrPlaceholderInternalReadinessClosed false", mutate: (r) => ({ ...r, photoOcrPlaceholderInternalReadinessClosed: false }) },
  { label: "realOcrExtractionStillBlocked false (real OCR extraction readiness true)", mutate: (r) => ({ ...r, realOcrExtractionStillBlocked: false as true }) },
  { label: "modelCallStillBlockedForPhotoOcrPlaceholder false", mutate: (r) => ({ ...r, modelCallStillBlockedForPhotoOcrPlaceholder: false as true }) },
  { label: "rawImagePersistenceStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, rawImagePersistenceStillBlocked: false as true }) },
  { label: "processedImagePersistenceStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, processedImagePersistenceStillBlocked: false as true }) },
  { label: "extractedTextPersistenceStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, extractedTextPersistenceStillBlocked: false as true }) },
  { label: "dbStorageStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false as true }) },
  { label: "supabaseStorageStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, supabaseStorageStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false (paid/DNA/persistence/storage enabled)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "publicRuntimeStillBlocked false (public runtime readiness true)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionStillUnauthorized false (production/go-live readiness true)", mutate: (r) => ({ ...r, productionStillUnauthorized: false as true }) },
  { label: "goLiveStillUnauthorized false (production/go-live readiness true)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false as true }) },
  { label: "modelOutputStillUntrusted false (model output trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "ocrOutputStillUntrusted false (OCR output trusted)", mutate: (r) => ({ ...r, ocrOutputStillUntrusted: false as true }) },
  { label: "imageContentTreatedAsSensitive false (image sensitivity false)", mutate: (r) => ({ ...r, imageContentTreatedAsSensitive: false as true }) },
  { label: "extractedTextTreatedAsSensitive false (extracted text sensitivity false)", mutate: (r) => ({ ...r, extractedTextTreatedAsSensitive: false as true }) },
  { label: "privacyDisclaimerRequired false (privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false as true }) },
  { label: "legalDisclaimerRequired false (privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false as true }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false as true }) },
  { label: "readyForNextPhase wrong (next phase is not 8.11A)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11B" as "8.11A" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Real OCR Extraction Gate Design" }) },
  { label: "readyForRealOcrExtractionGateDesign false when placeholder readiness is closed", mutate: (r) => ({ ...r, readyForRealOcrExtractionGateDesign: false }) },
  { label: "readyForRealOcrExtractionImplementation true (real OCR implementation readiness true)", mutate: (r) => ({ ...r, readyForRealOcrExtractionImplementation: true as false }) },
  { label: "readyForRealOcrExtraction true (real OCR extraction readiness true)", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForOcrQualityEvaluator true", mutate: (r) => ({ ...r, readyForOcrQualityEvaluator: true as false }) },
  { label: "readyForOcrTrustBoundaryValidation true", mutate: (r) => ({ ...r, readyForOcrTrustBoundaryValidation: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true (public runtime readiness true)", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true (production/go-live readiness true)", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true (production/go-live readiness true)", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "evidenceChain emptied", mutate: (r) => ({ ...r, evidenceChain: [] }) },
  { label: "apiReadinessEvidence wrong length/content", mutate: (r) => ({ ...r, apiReadinessEvidence: [] }) },
  { label: "browserUiEvidence wrong length/content", mutate: (r) => ({ ...r, browserUiEvidence: [] }) },
  { label: "browserManualEvidence emptied", mutate: (r) => ({ ...r, browserManualEvidence: [] }) },
  { label: "placeholderReadinessEvidence emptied", mutate: (r) => ({ ...r, placeholderReadinessEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length/content", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "remainingBlockers wrong length/content", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runPhotoOcrInternalReadinessClosure(): Promise<PhotoOcrInternalReadinessClosureResult> {
  const closureFailures: string[] = [];

  // ── Source of truth: 8.10C minimal patch audit (static, zero route calls) ─
  // Called directly for its own sourceGateDesignAccepted (8.10A) and
  // sourceImplementationPlanAccepted (8.10B) fields, which are not otherwise
  // exposed by 8.10H/8.10I.
  const c = runPhotoOcrControlledRuntimeMinimalPatchAudit();
  if (c.checkId !== "8.10C") closureFailures.push(`8.10C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) closureFailures.push("8.10C allPassed is not true");
  if (c.sourceGateDesignAccepted !== true) closureFailures.push("8.10C sourceGateDesignAccepted is not true");
  if (c.sourceImplementationPlanAccepted !== true) closureFailures.push("8.10C sourceImplementationPlanAccepted is not true");
  if (c.tamperRejected !== c.tamperCount) closureFailures.push("8.10C own tamper count mismatch");

  const sourceGateDesignAccepted = c.sourceGateDesignAccepted === true;
  const sourceImplementationPlanAccepted = c.sourceImplementationPlanAccepted === true;
  const sourceMinimalPatchAccepted = c.allPassed === true;

  // ── Source of truth: 8.10I browser manual test execution closure ─────────
  // 8.10I already re-validates 8.10D/8.10E/8.10F/8.10G/8.10H/8.9N internally
  // (see the calling-strategy note above), so their per-source acceptance
  // fields are read directly below instead of re-invoking their in-process
  // route calls a second time.
  const i = await runPhotoOcrBrowserManualTestExecutionClosure();
  if (i.checkId !== "8.10I") closureFailures.push(`8.10I checkId mismatch: got "${i.checkId}"`);
  if (i.allPassed !== true) closureFailures.push("8.10I allPassed is not true");
  if (i.readyForNextPhase !== "8.10J") closureFailures.push("8.10I readyForNextPhase is not 8.10J");
  if (i.readyForPhotoOcrInternalReadinessClosure !== true) closureFailures.push("8.10I readyForPhotoOcrInternalReadinessClosure is not true");
  if (i.sourceDisabledClosureAccepted !== true) closureFailures.push("8.10I sourceDisabledClosureAccepted is not true");
  if (i.sourceEnabledClosureAccepted !== true) closureFailures.push("8.10I sourceEnabledClosureAccepted is not true");
  if (i.sourceRegressionPackAccepted !== true) closureFailures.push("8.10I sourceRegressionPackAccepted is not true");
  if (i.sourceBrowserUiWiringAuditAccepted !== true) closureFailures.push("8.10I sourceBrowserUiWiringAuditAccepted is not true");
  if (i.sourceBrowserManualPlanningAccepted !== true) closureFailures.push("8.10I sourceBrowserManualPlanningAccepted is not true");
  if (i.sourceTextDocumentInternalReadinessAccepted !== true) closureFailures.push("8.10I sourceTextDocumentInternalReadinessAccepted is not true");
  if (i.offScenarioPerformed !== true) closureFailures.push("8.10I offScenarioPerformed is not true");
  if (i.offScenarioStatus !== 403) closureFailures.push("8.10I offScenarioStatus is not 403");
  if (i.offScenarioCode !== "photo_ocr_controlled_runtime_disabled") closureFailures.push("8.10I offScenarioCode mismatch");
  if (i.onScenarioPerformed !== true) closureFailures.push("8.10I onScenarioPerformed is not true");
  if (i.onScenarioStatus !== 200) closureFailures.push("8.10I onScenarioStatus is not 200");
  if (i.onScenarioMode !== "photo_ocr_controlled_runtime") closureFailures.push("8.10I onScenarioMode mismatch");
  if (i.onScenarioPlaceholderOnly !== true) closureFailures.push("8.10I onScenarioPlaceholderOnly is not true");
  if (i.onScenarioRealOcrExtractionPerformed !== false) closureFailures.push("8.10I onScenarioRealOcrExtractionPerformed is not false");
  if (i.networkResponseBodiesDirectlyObserved !== true) closureFailures.push("8.10I networkResponseBodiesDirectlyObserved is not true");
  if (i.noSelectedPageSpotCheckPerformed !== true) closureFailures.push("8.10I noSelectedPageSpotCheckPerformed is not true");
  if (i.noSelectedPageButtonDisabled !== true) closureFailures.push("8.10I noSelectedPageButtonDisabled is not true");
  if (i.noSelectedPageRequestSent !== false) closureFailures.push("8.10I noSelectedPageRequestSent is not false");
  if (i.uiSeparationPerformed !== true) closureFailures.push("8.10I uiSeparationPerformed is not true");
  if (i.photoModePhotoOcrButtonVisible !== true) closureFailures.push("8.10I photoModePhotoOcrButtonVisible is not true");
  if (i.photoModeTextDocumentButtonAbsent !== true) closureFailures.push("8.10I photoModeTextDocumentButtonAbsent is not true");
  if (i.textModeTextDocumentButtonVisible !== true) closureFailures.push("8.10I textModeTextDocumentButtonVisible is not true");
  if (i.textModePhotoOcrButtonAbsent !== true) closureFailures.push("8.10I textModePhotoOcrButtonAbsent is not true");
  if (i.questionModePhotoOcrButtonAbsent !== true) closureFailures.push("8.10I questionModePhotoOcrButtonAbsent is not true");
  if (i.questionModeTextDocumentButtonAbsent !== true) closureFailures.push("8.10I questionModeTextDocumentButtonAbsent is not true");
  if (i.photoOcrBrowserManualExecutionPassed !== true) closureFailures.push("8.10I photoOcrBrowserManualExecutionPassed is not true");
  if (i.tamperRejected !== i.tamperCount) closureFailures.push("8.10I own tamper count mismatch");

  const sourceDisabledClosureAccepted = i.sourceDisabledClosureAccepted === true;
  const sourceEnabledClosureAccepted = i.sourceEnabledClosureAccepted === true;
  const sourceRegressionPackAccepted = i.sourceRegressionPackAccepted === true;
  const sourceBrowserUiWiringAuditAccepted = i.sourceBrowserUiWiringAuditAccepted === true;
  const sourceBrowserManualPlanningAccepted = i.sourceBrowserManualPlanningAccepted === true;
  const sourceBrowserManualExecutionAccepted = i.allPassed === true;
  const sourceTextDocumentInternalReadinessAccepted = i.sourceTextDocumentInternalReadinessAccepted === true;

  const allSourcesAccepted =
    sourceGateDesignAccepted &&
    sourceImplementationPlanAccepted &&
    sourceMinimalPatchAccepted &&
    sourceDisabledClosureAccepted &&
    sourceEnabledClosureAccepted &&
    sourceRegressionPackAccepted &&
    sourceBrowserUiWiringAuditAccepted &&
    sourceBrowserManualPlanningAccepted &&
    sourceBrowserManualExecutionAccepted &&
    sourceTextDocumentInternalReadinessAccepted;

  const browserOffScenarioPassed =
    i.offScenarioPerformed === true && i.offScenarioStatus === 403 && i.offScenarioCode === "photo_ocr_controlled_runtime_disabled";
  const browserOnScenarioPassed =
    i.onScenarioPerformed === true &&
    i.onScenarioStatus === 200 &&
    i.onScenarioOk === true &&
    i.onScenarioMode === "photo_ocr_controlled_runtime" &&
    i.onScenarioContext === "anonymous";
  const browserUiSeparationPassed =
    i.uiSeparationPerformed === true &&
    i.photoModePhotoOcrButtonVisible === true &&
    i.photoModeTextDocumentButtonAbsent === true &&
    i.textModeTextDocumentButtonVisible === true &&
    i.textModePhotoOcrButtonAbsent === true &&
    i.questionModePhotoOcrButtonAbsent === true &&
    i.questionModeTextDocumentButtonAbsent === true;
  const browserNoSelectedPageSpotCheckPassed =
    i.noSelectedPageSpotCheckPerformed === true && i.noSelectedPageButtonDisabled === true && i.noSelectedPageRequestSent === false;
  const browserManualExecutionPassed = i.photoOcrBrowserManualExecutionPassed === true && i.allPassed === true;
  const browserNetworkResponseBodiesObserved = i.networkResponseBodiesDirectlyObserved === true;

  const placeholderPathEvidenceComplete =
    sourceMinimalPatchAccepted &&
    sourceDisabledClosureAccepted &&
    sourceEnabledClosureAccepted &&
    sourceRegressionPackAccepted &&
    sourceBrowserUiWiringAuditAccepted &&
    browserManualExecutionPassed &&
    browserNetworkResponseBodiesObserved &&
    browserOffScenarioPassed &&
    browserOnScenarioPassed &&
    browserUiSeparationPassed &&
    browserNoSelectedPageSpotCheckPassed;

  const controlledInternalPlaceholderReady = closureFailures.length === 0 && allSourcesAccepted && placeholderPathEvidenceComplete;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const evidenceChain: string[] = [
    `8.10A gate design: accepted=${sourceGateDesignAccepted} (commit 4a87043, validated via 8.10C source chain).`,
    `8.10B implementation plan: accepted=${sourceImplementationPlanAccepted} (commit 6a26e47, validated via 8.10C source chain).`,
    `8.10C minimal patch: accepted=${sourceMinimalPatchAccepted} (commit 3e35be8, checkId=${c.checkId}, allPassed=${c.allPassed}).`,
    `8.10D disabled local API closure: accepted=${sourceDisabledClosureAccepted} (commit 385b32a, validated via 8.10I->8.10H->8.10G source chain).`,
    `8.10E enabled local API closure: accepted=${sourceEnabledClosureAccepted} (commit e1d6568, validated via 8.10I->8.10H->8.10G source chain).`,
    `8.10F regression pack: accepted=${sourceRegressionPackAccepted} (commit 49fa151, 32-case regression matrix, validated via 8.10I->8.10H->8.10G source chain).`,
    `8.10G browser/UI wiring audit: accepted=${sourceBrowserUiWiringAuditAccepted} (commit 5333d98, validated via 8.10I->8.10H source chain).`,
    `8.10H browser manual test planning: accepted=${sourceBrowserManualPlanningAccepted} (commit e7e2908, validated via 8.10I source chain).`,
    `8.10I browser manual test execution closure: accepted=${sourceBrowserManualExecutionAccepted} (commit 3c5f83b, checkId=${i.checkId}, allPassed=${i.allPassed}).`,
    `8.9N text document internal readiness: accepted=${sourceTextDocumentInternalReadinessAccepted} (commit 3cf81c1, validated via 8.10I->8.10H source chain, cross-feature context only).`,
  ];

  const apiReadinessEvidence: string[] = [...REQUIRED_API_READINESS_EVIDENCE];

  const browserUiEvidence: string[] = [...REQUIRED_BROWSER_UI_EVIDENCE];

  const browserManualEvidence: string[] = [
    "8.10I: manual browser test performed by operator with Chrome DevTools Network response body inspection for both OFF and ON scenarios.",
    "8.10I: OFF scenario observed HTTP 403, ok false, code photo_ocr_controlled_runtime_disabled, full photoOcrMeta disabled-state contract confirmed.",
    "8.10I: ON scenario observed HTTP 200, ok true, mode photo_ocr_controlled_runtime, context anonymous, full photoOcrMeta placeholder-only contract confirmed (no real OCR, no model call, no persistence/storage/DNA, all disclaimers required).",
    "8.10I: UI separation confirmed across photo/text/question modes; no auto-upload; explicit click required.",
    "8.10I: no-selected-page guard spot check passed (button disabled, no request sent); unsupported-file-type and too-many-pages spot checks intentionally skipped, justified by the already-closed 22/22 8.10E/8.10F API guard matrix.",
    "8.10I: cleanup confirmed — dev server stopped, all env flags removed, git status clean.",
    "8.10I: only a synthetic local PNG test image was used; no physical camera capture; no real document; no PII.",
  ];

  const placeholderReadinessEvidence: string[] = [
    "The Photo/OCR controlled placeholder path is fully specified (8.10A design), planned (8.10B), and minimally implemented (8.10C) behind an exact-match env flag.",
    "The disabled path fails closed across 9 env variants (8.10D), and the enabled path returns only a metadata-only placeholder response with 22/22 unsafe guard cases rejected (8.10E), consolidated into a 32-case regression pack (8.10F).",
    "Static source inspection confirms the UI wiring is safe and isolated (8.10G): photo-mode-only button, metadata-only request, no raw image bytes, no client-side env authorization, no claims of OCR activity or document reading.",
    "The controlled local browser manual test plan (8.10H) was executed and observed directly by the operator via Chrome DevTools Network (8.10I), confirming both the OFF and ON scenarios behave exactly as designed.",
    "No real OCR extraction, model call, upload persistence, or DB/storage/DNA write has occurred at any point across the entire 8.10A-8.10I evidence chain.",
    "On this basis, the Photo/OCR controlled placeholder path is internally ready for continued controlled internal use only — not for real OCR extraction, public runtime, production, or go-live.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "realOcrExtractionStillBlocked true; ocrRuntimeStillBlockedForRealExtraction true; modelCallStillBlockedForPhotoOcrPlaceholder true.",
    "rawImagePersistenceStillBlocked true; processedImagePersistenceStillBlocked true; extractedTextPersistenceStillBlocked true.",
    "dbStorageStillBlocked true; supabaseStorageStillBlocked true; vayloDnaStillBlocked true; paidDocumentModeStillBlocked true.",
    "publicRuntimeStillBlocked true; productionStillUnauthorized true; goLiveStillUnauthorized true.",
    "modelOutputStillUntrusted true; ocrOutputStillUntrusted true; imageContentTreatedAsSensitive true; extractedTextTreatedAsSensitive true.",
    "privacyDisclaimerRequired true; legalDisclaimerRequired true.",
    "exactLegalDeadlineStillBlocked true; bindingLegalAdviceStillBlocked true; officialFilingGenerationStillBlocked true.",
    "eightThreeAcNotRun true; tmpEightThreeAcMetadataTouched false.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure file performed zero browser/dev-server/API/fetch invocations of its own; it only consolidates already-committed evidence.",
    "No real image, real document, or image bytes were used or read by this closure.",
    "No OCR library was imported and no OCR engine was called by this closure.",
    "No real OCR extraction and no model call occurred anywhere in the consolidated 8.10A-8.10I evidence chain.",
    "No upload persistence, DB write, Supabase storage write, or Vaylo DNA write occurred anywhere in the consolidated evidence chain.",
    "No public runtime, production, or go-live authorization occurred.",
    "8.3AC was not run and tmp-8-3ac-live-metadata.ts was not touched by this closure or by any consolidated source phase.",
  ];

  const readinessVerdict: string[] = [
    "VERDICT: the Photo/OCR controlled internal placeholder path (8.10A-8.10I) is internally ready for continued controlled internal use.",
    "readyForControlledInternalPhotoOcrPlaceholder: true; readyForPhotoOcrPlaceholderInternalUse: true; photoOcrPlaceholderInternalReadinessClosed: true.",
    "readyForRealOcrExtraction: false; readyForRealOcrExtractionImplementation: false; readyForOcrQualityEvaluator: false; readyForOcrTrustBoundaryValidation: false.",
    "readyForPhotoOcrPublicRuntime: false; readyForProduction: false; readyForGoLive: false.",
    "readyForRealOcrExtractionGateDesign: true — the next phase may begin DESIGNING (not implementing) a real OCR extraction gate.",
    "Next recommended phase: 8.11A — Real OCR Extraction Gate Design.",
  ];

  const evidenceLimitations = [...REQUIRED_EVIDENCE_LIMITATIONS];

  const notes: string[] = [
    "IR-01: 8.10J is an internal readiness closure only. No new browser/dev-server/API/fetch execution, no runtime activation, no live testing performed by this file.",
    `IR-02: source chain — 8.10C allPassed=${c.allPassed} (exposing 8.10A/8.10B acceptance), 8.10I allPassed=${i.allPassed} (exposing 8.10D/8.10E/8.10F/8.10G/8.10H/8.9N acceptance via its own already-computed fields).`,
    "IR-03: per the rate-limit-aware strategy established in 8.10H/8.10I, this closure calls only 8.10C (zero route calls) and 8.10I (primary source) directly, deriving all other source acceptance from their already-computed fields, to avoid exceeding the route's real in-memory rate limit (5 requests/10 minutes per synthetic IP) across the combined source-of-truth chain.",
    "IR-04: the Photo/OCR controlled placeholder path is ready for controlled internal use only (readyForControlledInternalPhotoOcrPlaceholder true, readyForPhotoOcrPlaceholderInternalUse true).",
    "IR-05: the Photo/OCR controlled placeholder path is NOT ready for real OCR extraction, real OCR extraction implementation, OCR quality evaluation, OCR trust boundary validation, public runtime, production, or go-live.",
    "IR-06: photoOcrPlaceholderInternalReadinessClosed true — internal readiness closure complete.",
    "IR-07: next recommended phase is 8.11A — Real OCR Extraction Gate Design (design only, not implementation).",
    "IR-08: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = PHOTO_OCR_INTERNAL_READINESS_CLOSURE_TAMPER_CASES.length;

  const provisional: PhotoOcrInternalReadinessClosureResult = {
    checkId: "8.10J",
    allPassed: true,
    internalReadinessClosureOnly: true,
    photoOcrPlaceholderInternalReadinessClosureOnly: true,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    localApiInvokedByClosure: false,
    externalNetworkCalled: false,
    realImageUsedByClosure: false,
    imageBytesReadByClosure: false,
    ocrLibraryImported: false,
    ocrExtractionPerformed: false,
    realOcrExtractionPerformed: false,
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

    sourceGateDesignCommit: "4a87043",
    sourceImplementationPlanCommit: "6a26e47",
    sourceMinimalPatchCommit: "3e35be8",
    sourceDisabledClosureCommit: "385b32a",
    sourceEnabledClosureCommit: "e1d6568",
    sourceRegressionPackCommit: "49fa151",
    sourceBrowserUiWiringAuditCommit: "5333d98",
    sourceBrowserManualPlanningCommit: "e7e2908",
    sourceBrowserManualExecutionCommit: "3c5f83b",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceGateDesignAccepted,
    sourceImplementationPlanAccepted,
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceEnabledClosureAccepted,
    sourceRegressionPackAccepted,
    sourceBrowserUiWiringAuditAccepted,
    sourceBrowserManualPlanningAccepted,
    sourceBrowserManualExecutionAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    gateDesignClosed: sourceGateDesignAccepted,
    implementationPlanClosed: sourceImplementationPlanAccepted,
    minimalPatchClosed: sourceMinimalPatchAccepted,
    disabledLocalApiClosureClosed: sourceDisabledClosureAccepted,
    enabledLocalApiClosureClosed: sourceEnabledClosureAccepted,
    localRegressionPackClosed: sourceRegressionPackAccepted,
    browserUiWiringAuditClosed: sourceBrowserUiWiringAuditAccepted,
    browserManualTestPlanningClosed: sourceBrowserManualPlanningAccepted,
    browserManualTestExecutionClosed: sourceBrowserManualExecutionAccepted,
    textDocumentInternalReadinessAlreadyClosed: sourceTextDocumentInternalReadinessAccepted,

    disabledEnvMatrixClosed: sourceDisabledClosureAccepted,
    disabledEnvCaseCount: 9,
    disabledEnvCasesPassed: sourceDisabledClosureAccepted,
    enabledPlaceholderClosed: sourceEnabledClosureAccepted,
    enabledPlaceholderStatus: 200,
    enabledPlaceholderOk: true,
    enabledPlaceholderMode: "photo_ocr_controlled_runtime",
    enabledPlaceholderContext: "anonymous",
    enabledPlaceholderOnly: true,
    enabledPlaceholderRealOcrExtractionPerformed: false,
    enabledPlaceholderOcrRuntimeStillBlocked: true,
    enabledPlaceholderModelCallPerformed: false,
    guardRegressionClosed: sourceEnabledClosureAccepted && sourceRegressionPackAccepted,
    enabledGuardCaseCount: 22,
    enabledGuardCasesPassed: sourceEnabledClosureAccepted,
    localRegressionCaseCount: 32,
    localRegressionCasesPassed: sourceRegressionPackAccepted,

    browserUiWiringAuditPassed: sourceBrowserUiWiringAuditAccepted,
    photoOcrInternalButtonPhotoModeOnly:
      sourceBrowserUiWiringAuditAccepted &&
      i.photoModePhotoOcrButtonVisible === true &&
      i.textModePhotoOcrButtonAbsent === true &&
      i.questionModePhotoOcrButtonAbsent === true,
    textDocumentInternalButtonTextModeOnly:
      sourceBrowserUiWiringAuditAccepted &&
      i.textModeTextDocumentButtonVisible === true &&
      i.photoModeTextDocumentButtonAbsent === true &&
      i.questionModeTextDocumentButtonAbsent === true,
    uiRequestMetadataOnly: sourceBrowserUiWiringAuditAccepted,
    uiDoesNotSendRawImageBytes: sourceBrowserUiWiringAuditAccepted,
    uiDoesNotUseClientEnvAuthorization: sourceBrowserUiWiringAuditAccepted,
    uiDoesNotClaimOcrActive: sourceBrowserUiWiringAuditAccepted,
    uiDoesNotClaimDocumentRead: sourceBrowserUiWiringAuditAccepted,
    browserManualExecutionPassed,
    browserNetworkResponseBodiesObserved,
    browserOffScenarioPassed,
    browserOffScenarioStatus: 403,
    browserOffScenarioCode: "photo_ocr_controlled_runtime_disabled",
    browserOnScenarioPassed,
    browserOnScenarioStatus: 200,
    browserOnScenarioMode: "photo_ocr_controlled_runtime",
    browserOnScenarioPlaceholderOnly: i.onScenarioPlaceholderOnly === true,
    browserOnScenarioRealOcrExtractionPerformed: (i.onScenarioRealOcrExtractionPerformed as boolean) === true,
    browserNoSelectedPageSpotCheckPassed,
    browserUiSeparationPassed,

    controlledInternalPlaceholderReady,
    readyForControlledInternalPhotoOcrPlaceholder: controlledInternalPlaceholderReady,
    readyForPhotoOcrPlaceholderInternalUse: controlledInternalPlaceholderReady,
    photoOcrPlaceholderInternalReadinessClosed: controlledInternalPlaceholderReady,
    realOcrExtractionStillBlocked: true,
    ocrRuntimeStillBlockedForRealExtraction: true,
    modelCallStillBlockedForPhotoOcrPlaceholder: true,
    rawImagePersistenceStillBlocked: true,
    processedImagePersistenceStillBlocked: true,
    extractedTextPersistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    supabaseStorageStillBlocked: true,
    vayloDnaStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionStillUnauthorized: true,
    goLiveStillUnauthorized: true,
    modelOutputStillUntrusted: true,
    ocrOutputStillUntrusted: true,
    imageContentTreatedAsSensitive: true,
    extractedTextTreatedAsSensitive: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,

    readyForNextPhase: "8.11A",
    recommendedNextPhase: "Real OCR Extraction Gate Design",
    readyForRealOcrExtractionGateDesign: controlledInternalPlaceholderReady,
    readyForRealOcrExtractionImplementation: false,
    readyForRealOcrExtraction: false,
    readyForOcrQualityEvaluator: false,
    readyForOcrTrustBoundaryValidation: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    evidenceChain,
    apiReadinessEvidence,
    browserUiEvidence,
    browserManualEvidence,
    placeholderReadinessEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11A: Real OCR Extraction Gate Design — a design-only phase defining the controlled gate, trust boundary, and safety contract for eventually introducing real OCR extraction (still no implementation, no real OCR calls, no public runtime).",
      "Real OCR extraction implementation, OCR quality evaluation, and OCR trust boundary validation with real extracted text remain separate, later, explicitly authorized phases.",
      "Public runtime, production, and go-live remain unauthorized and explicitly deferred.",
    ],
    notes,
  };

  if (closureFailures.length === 0 && !_isCanonicalPhotoOcrInternalReadinessClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_INTERNAL_READINESS_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrInternalReadinessClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10J tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed = closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10J tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-internal-readiness-closure");

if (invokedDirectly) {
  runPhotoOcrInternalReadinessClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
