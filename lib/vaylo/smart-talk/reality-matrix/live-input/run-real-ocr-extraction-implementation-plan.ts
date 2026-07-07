/**
 * PHASE 8.11B — Real OCR Extraction Implementation Plan
 *
 * Implementation-plan-only. Converts the 8.11A Real OCR Extraction Gate
 * Design into a detailed, safe implementation plan for a future 8.11C minimal
 * real OCR runtime patch. Does not implement, patch, install, or enable real
 * OCR in any way.
 *
 * This file does NOT call fetch/route handlers/OpenAI, does not import or
 * install an OCR library, does not read real images or image bytes, does not
 * touch DB/storage/DNA, does not run 8.3AC, and does not touch
 * tmp-8-3ac-live-metadata.ts.
 */

import { runRealOcrExtractionGateDesign } from "./run-real-ocr-extraction-gate-design";

/**
 * NOTE on source-of-truth calling strategy (rate-limit-aware):
 *
 * This plan calls ONLY runRealOcrExtractionGateDesign (8.11A) as its primary
 * source of truth. 8.11A already validated 8.10J and 8.9N internally; their
 * acceptance fields (sourcePhotoOcrInternalReadinessAccepted,
 * sourceTextDocumentInternalReadinessAccepted) are read directly from 8.11A's
 * result rather than re-invoking 8.10J (which transitively re-validates
 * 8.10D/8.10E/8.10F route closures) or 8.9N separately.
 *
 * This file performs zero direct local API/browser/dev-server/fetch
 * invocations of its own.
 */

// ─── Plan structure types ───────────────────────────────────────────────────

interface FutureOcrProviderStrategy {
  providerSelectionDeferredToRuntimePatch: true;
  noProviderInstalledNow: true;
  noProviderImportedNow: true;
  initialRecommendedProviderCategory: "local_js_ocr";
  recommendedFirstPass: string;
  providerRequirements: string[];
  rejectedProviderPatterns: string[];
}

interface FutureEnvGateStrategy {
  proposedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
  exactLowercaseTrueRequired: true;
  allOtherValuesFailClosed: true;
  existingPlaceholderFlagCannotAuthorizeRealOcr: true;
  publicRuntimeFlagSeparateAndStillBlocked: true;
  productionGoLiveFlagsSeparateAndStillBlocked: true;
  envFlagMustBeReadServerSideOnly: true;
  clientMustNotAuthorizeOcr: true;
  disabledResponseCodeFuture: "real_ocr_extraction_disabled";
  unsafeAttemptResponseCodesFuture: string[];
}

interface FutureApiRoutePatchStrategy {
  targetFileFuture: "app/api/smart-talk/route.ts";
  routePatchNotPerformedNow: true;
  futureMode: "photo_ocr_real_extraction_controlled_runtime";
  futureBranchMustBeIsolated: true;
  existingPhotoOcrPlaceholderBranchMustRemainUnchanged: true;
  existingTextDocumentModeMustRemainUnchanged: true;
  existingFreeQaMustRemainUnchanged: true;
  futureRequestContentType: "multipart/form-data";
  maxFileSizeBytes: 8388608;
  maxPageCount: 1;
  allowedMimeTypes: string[];
  blockedMimeTypes: string[];
  noPersistence: true;
  noDbStorage: true;
  noSupabaseStorage: true;
  noDnaWrite: true;
  noModelCallDuringOcrExtraction: true;
  rawImageNotSentToSmartTalkReasoning: true;
  extractedTextMustPassQualityGateBeforeHandoff: true;
  errorsMustFailClosed: true;
  responseMustIncludeSafetyMeta: true;
}

interface FutureUiClientStrategy {
  targetFileFuture: "app/smart-talk/SmartTalkClient.tsx";
  uiPatchNotPerformedNow: true;
  futureInternalButtonLabel: "Interný test: Real OCR extraction";
  placeholderButtonMustRemainSeparate: true;
  textDocumentButtonMustRemainSeparate: true;
  questionModeMustNotShowOcrButton: true;
  futureOcrButtonPhotoModeOnly: true;
  selectedPageRequired: true;
  explicitClickRequired: true;
  uiSelectionAloneDoesNotRunOcr: true;
  clientDoesNotAuthorizeOcr: true;
  browserMustNotPersistImage: true;
  requestMustBeAbortable: true;
  loadingStateRequired: true;
  errorStateRequired: true;
  lowQualityWarningStateRequired: true;
  userDisclosureBeforeRunRequired: true;
}

interface FutureOcrExecutionContract {
  mode: "photo_ocr_real_extraction_controlled_runtime";
  context: "anonymous";
  sourceKind: "single_image_ocr";
  ocrRunsBeforeModelReasoning: true;
  modelCallPerformedDuringOcrExtraction: false;
  rawImagePersistencePerformed: false;
  processedImagePersistencePerformed: false;
  extractedTextPersistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  timeoutMsFuture: number;
  maxRetriesFuture: number;
  failureMode: "fail_closed";
  outputMustInclude: string[];
}

interface FutureOcrQualityEvaluatorPlan {
  qualityEvaluatorRequiredBeforeSmartTalkHandoff: true;
  implementationDeferredToFuturePhase: true;
  minExtractedTextLength: 8;
  maxExtractedTextLength: 6000;
  qualityStatuses: string[];
  blockingReasons: string[];
  downgradeReasons: string[];
  usableForSmartTalkRequiresNoBlockingReasons: true;
  lowQualityStillRequiresUserWarning: true;
}

interface FutureExtractedTextTrustBoundaryPlan {
  extractedTextIsDerived: true;
  extractedTextIsUntrusted: true;
  extractedTextMayContainPii: true;
  extractedTextSensitive: true;
  extractedTextNotPersistedByDefault: true;
  extractedTextDoesNotCreateVerifiedFacts: true;
  extractedTextDoesNotWriteDna: true;
  extractedTextDoesNotAuthorizeDeadlines: true;
  extractedTextDoesNotAuthorizeOfficialFilings: true;
  extractedTextMustCarrySourceMetadata: true;
  sourceMetadataMustIncludeOcrDerived: true;
  sourceMetadataMustIncludeQualityStatus: true;
  sourceMetadataMustIncludeWarnings: true;
}

interface FutureSmartTalkHandoffPlan {
  handoffDeferredToFuturePhase: true;
  handoffRequiresQualityUsableOrMediumWithWarning: true;
  handoffTextOnly: true;
  rawImageExcludedFromHandoff: true;
  sourceMarkedOcrDerived: true;
  textMarkedUntrusted: true;
  qualitySummaryIncluded: true;
  ocrWarningsIncluded: true;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
  evidenceGatesStillRequired: true;
  hallucinationTrapsStillRequired: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingGenerationStillBlocked: true;
  modelOutputStillUntrusted: true;
}

interface FutureErrorTimeoutRateLimitPlan {
  timeoutRequired: true;
  timeoutMs: number;
  noInfiniteRetries: true;
  maxRetries: number;
  rateLimitMustRemainApplied: true;
  rateLimitShouldUseExistingSmartTalkLimiterInitially: true;
  providerErrorsFailClosed: true;
  malformedOutputFailsClosed: true;
  oversizedOutputFailsClosed: true;
  emptyExtractionFailsClosed: true;
  partialFailureReturnsNoVerifiedClaims: true;
  userMessageMustBeSafeAndNonLegal: true;
}

interface FutureRegressionTestMatrixPlan {
  disabledEnvVariantsPlannedCount: number;
  enabledHappyPathSyntheticImagePlannedCount: number;
  unsafeGuardCasesPlannedCount: number;
  qualityEvaluatorCasesPlannedCount: number;
  trustBoundaryCasesPlannedCount: number;
  handoffBlockCasesPlannedCount: number;
  tamperCasesPlannedCount: number;
  totalPlannedRegressionCases: number;
  plannedCaseLabels: string[];
}

interface FutureManualMobileBrowserTestPlan {
  planningOnly: true;
  mobileTestNotPerformedNow: true;
  browserTestNotPerformedNow: true;
  androidChromeRequiredLater: true;
  desktopChromeRequiredLater: true;
  syntheticImageFirst: true;
  realDocumentLaterOnlyAfterSyntheticPass: true;
  cameraCaptureLater: true;
  galleryUploadLater: true;
  networkInspectionRequired: true;
  userDisclosureVisualCheckRequired: true;
  lowQualityWarningVisualCheckRequired: true;
  noPersistenceEvidenceRequired: true;
  cleanupRequired: true;
}

interface FutureRollbackDisablePlan {
  singleEnvKillSwitch: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
  disablingFlagStopsRealOcr: true;
  placeholderModeUnaffectedByDisable: true;
  textDocumentModeUnaffectedByDisable: true;
  freeQaUnaffectedByDisable: true;
  noDatabaseRollbackNeededForFirstRuntime: true;
  noStorageCleanupNeededBecauseNoPersistence: true;
  runtimeCanFailClosedToDisabledResponse: true;
}

interface FutureFilePlan {
  futureRuntimePatchFiles: string[];
  futureAuditFiles: string[];
  filesCreatedNow: string[];
  existingFilesModifiedNow: string[];
}

interface NonGoLiveSafetyVerdict {
  implementationPlanComplete: true;
  readyForMinimalRealOcrRuntimePatch: boolean;
  realOcrRuntimeStillNotImplemented: true;
  realOcrStillNotUsableByUsers: true;
  publicRuntimeStillBlocked: true;
  productionStillUnauthorized: true;
  goLiveStillUnauthorized: true;
  readyForProduction: false;
  readyForGoLive: false;
}

// ─── Result type ────────────────────────────────────────────────────────────

interface RealOcrExtractionImplementationPlanResult {
  checkId: "8.11B";
  allPassed: boolean;
  implementationPlanOnly: true;
  realOcrExtractionImplementationPlanOnly: true;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  packageModifiedNow: false;
  configModifiedNow: false;
  envModifiedNow: false;
  browserInvokedByPlan: false;
  devServerStartedByPlan: false;
  localApiInvokedByPlan: false;
  externalNetworkCalled: false;
  openAiCalled: false;
  fetchCalled: false;
  realImageUsedByPlan: false;
  imageBytesReadByPlan: false;
  ocrLibraryImported: false;
  ocrDependencyAdded: false;
  ocrProviderSelectedForRuntimeNow: false;
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
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceRealOcrGateDesignCommit: "ead0f0c";
  sourcePhotoOcrInternalReadinessCommit: "a306243";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceRealOcrGateDesignAccepted: boolean;
  sourcePhotoOcrInternalReadinessAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;
  sourceRealOcrGateDesigned: boolean;
  sourceRealOcrGateDesignClosed: boolean;
  sourceReadyForRealOcrExtractionImplementationPlan: boolean;
  sourceReadyForRealOcrExtractionImplementation: false;
  sourceReadyForRealOcrExtraction: false;
  sourceReadyForPhotoOcrPublicRuntime: false;
  sourceReadyForProduction: false;
  sourceReadyForGoLive: false;

  realOcrExtractionImplementationPlanCreated: boolean;
  realOcrExtractionImplementationPlanClosed: boolean;
  readyForMinimalRealOcrRuntimePatch: boolean;
  readyForRealOcrExtractionImplementation: false;
  readyForRealOcrExtraction: false;
  readyForOcrLibraryRuntimeUse: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11C";
  recommendedNextPhase: "Minimal Real OCR Runtime Patch";

  futureOcrProviderStrategy: FutureOcrProviderStrategy;
  futureEnvGateStrategy: FutureEnvGateStrategy;
  futureApiRoutePatchStrategy: FutureApiRoutePatchStrategy;
  futureUiClientStrategy: FutureUiClientStrategy;
  futureOcrExecutionContract: FutureOcrExecutionContract;
  futureOcrQualityEvaluatorPlan: FutureOcrQualityEvaluatorPlan;
  futureExtractedTextTrustBoundaryPlan: FutureExtractedTextTrustBoundaryPlan;
  futureSmartTalkHandoffPlan: FutureSmartTalkHandoffPlan;
  futureErrorTimeoutRateLimitPlan: FutureErrorTimeoutRateLimitPlan;
  futureRegressionTestMatrixPlan: FutureRegressionTestMatrixPlan;
  futureManualMobileBrowserTestPlan: FutureManualMobileBrowserTestPlan;
  futureRollbackDisablePlan: FutureRollbackDisablePlan;
  futureFilePlan: FutureFilePlan;
  nonGoLiveSafetyVerdict: NonGoLiveSafetyVerdict;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  implementationPlanEvidence: string[];
  providerStrategyEvidence: string[];
  envGateStrategyEvidence: string[];
  apiRoutePatchStrategyEvidence: string[];
  uiClientStrategyEvidence: string[];
  ocrExecutionContractEvidence: string[];
  qualityEvaluatorPlanEvidence: string[];
  extractedTextTrustBoundaryEvidence: string[];
  smartTalkHandoffPlanEvidence: string[];
  errorTimeoutRateLimitEvidence: string[];
  regressionTestMatrixEvidence: string[];
  manualMobileBrowserTestEvidence: string[];
  rollbackDisableEvidence: string[];
  futureFilePlanEvidence: string[];
  nonGoLiveSafetyVerdictEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  safetyBoundaryEvidence: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const FUTURE_OCR_TIMEOUT_MS = 15_000;
const FUTURE_OCR_MAX_RETRIES = 0;

const REQUIRED_ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const REQUIRED_BLOCKED_MIME_TYPES = ["application/pdf", "image/svg+xml", "text/plain", "application/json"];

const REQUIRED_PROVIDER_REQUIREMENTS: string[] = [
  "runs server-side only",
  "supports image/png image/jpeg image/webp",
  "can be disabled by env",
  "does not persist input by default",
  "returns extracted text and confidence/metadata if possible",
  "has predictable timeout behavior",
  "can fail closed",
  "does not send image bytes to LLM",
  "can be wrapped behind internal adapter",
];

const REQUIRED_REJECTED_PROVIDER_PATTERNS: string[] = [
  "browser-only OCR for first runtime",
  "OCR that requires persistent upload by default",
  "OCR that sends images to model directly",
  "OCR without timeout control",
  "OCR that cannot be disabled by env",
  "OCR that writes files to disk without explicit cleanup",
];

const REQUIRED_UNSAFE_RESPONSE_CODES: string[] = [
  "real_ocr_extraction_disabled",
  "real_ocr_unsupported_mime_type_blocked",
  "real_ocr_file_too_large_blocked",
  "real_ocr_multiple_pages_blocked",
  "real_ocr_missing_image_blocked",
  "real_ocr_public_runtime_attempt_blocked",
  "real_ocr_persistence_attempt_blocked",
  "real_ocr_extraction_timeout_blocked",
  "real_ocr_provider_error_blocked",
  "real_ocr_quality_block_blocked",
];

const REQUIRED_QUALITY_STATUSES = ["blocked", "low", "medium", "usable"];

const REQUIRED_BLOCKING_REASONS = [
  "empty_extraction",
  "unsupported_mime",
  "file_too_large",
  "multiple_pages",
  "suspected_handwriting",
  "extraction_timeout",
  "provider_error",
  "public_runtime_attempt",
  "persistence_attempt",
  "db_storage_attempt",
  "dna_write_attempt",
];

const REQUIRED_DOWNGRADE_REASONS = [
  "low_confidence",
  "blurry_image",
  "rotated_image",
  "partial_crop",
  "multiple_languages_detected",
  "unknown_language",
  "table_heavy_document",
  "tiny_print",
  "noisy_background",
  "screenshot_like_input",
  "possible_missing_page",
];

const REQUIRED_EXECUTION_OUTPUT_FIELDS = [
  "extractedText",
  "confidence or confidenceAvailable flag",
  "providerWarnings",
  "quality status",
  "blockingReasons",
  "downgradeReasons",
  "safety meta",
  "disclaimers",
  "readiness flags",
];

const REQUIRED_REGRESSION_CASE_LABELS: string[] = [
  "env absent",
  "env false",
  "env TRUE",
  "env 1",
  "env whitespace true",
  "exact true enabled",
  "unsupported MIME",
  "PDF rejected",
  "SVG rejected",
  "text/plain rejected",
  "JSON rejected",
  "missing image",
  "file too large",
  "multiple pages",
  "empty extraction",
  "timeout",
  "provider error",
  "low confidence",
  "blurry image",
  "rotated image",
  "partial crop",
  "suspected handwriting",
  "persistence attempt",
  "DB storage attempt",
  "DNA write attempt",
  "public runtime attempt",
  "model call during OCR attempt",
  "raw image sent to model attempt",
  "extracted text trusted attempt",
  "deadline auto-authorization attempt",
  "official filing generation attempt",
];

const DISABLED_ENV_VARIANTS_PLANNED = 9;
const ENABLED_HAPPY_PATH_PLANNED = 1;
const UNSAFE_GUARD_CASES_PLANNED = 28;
const QUALITY_EVALUATOR_CASES_PLANNED = 22;
const TRUST_BOUNDARY_CASES_PLANNED = 16;
const HANDOFF_BLOCK_CASES_PLANNED = 12;
const TAMPER_CASES_PLANNED = 110;
const TOTAL_PLANNED_REGRESSION_CASES =
  DISABLED_ENV_VARIANTS_PLANNED +
  ENABLED_HAPPY_PATH_PLANNED +
  UNSAFE_GUARD_CASES_PLANNED +
  QUALITY_EVALUATOR_CASES_PLANNED +
  TRUST_BOUNDARY_CASES_PLANNED +
  HANDOFF_BLOCK_CASES_PLANNED;

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase is implementation-plan-only.",
  "No OCR provider/library was installed.",
  "No OCR dependency was added.",
  "No OCR runtime was implemented.",
  "No API route was patched.",
  "No UI/client was patched.",
  "No image bytes were read.",
  "No real images were processed.",
  "No OCR extraction was performed.",
  "No model call was performed.",
  "No browser/dev server/API was invoked.",
  "OCR quality evaluator was planned but not implemented.",
  "OCR trust boundary was planned but not implemented.",
  "OCR-to-Smart-Talk handoff was planned but not implemented.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Minimal real OCR runtime patch not created yet",
  "OCR provider/library still not installed",
  "OCR adapter not implemented",
  "API route real OCR branch not implemented",
  "UI real OCR action not implemented",
  "OCR quality evaluator not implemented",
  "OCR trust boundary not implemented",
  "OCR-to-Smart-Talk handoff not implemented",
  "real OCR disabled/enabled closures not created",
  "mobile/browser manual OCR tests not performed",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_FUTURE_RUNTIME_PATCH_FILES = ["app/api/smart-talk/route.ts", "app/smart-talk/SmartTalkClient.tsx"];

const REQUIRED_FUTURE_AUDIT_FILES = [
  "run-minimal-real-ocr-runtime-patch-audit.ts",
  "run-real-ocr-disabled-local-api-closure.ts",
  "run-real-ocr-enabled-synthetic-local-api-closure.ts",
  "run-real-ocr-quality-evaluator-plan.ts",
  "run-real-ocr-trust-boundary-closure.ts",
  "run-real-ocr-to-smart-talk-handoff-plan.ts",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalRealOcrExtractionImplementationPlanResult(r: RealOcrExtractionImplementationPlanResult): boolean {
  if (r.checkId !== "8.11B") return false;
  if (r.allPassed !== true) return false;
  if (r.implementationPlanOnly !== true) return false;
  if (r.realOcrExtractionImplementationPlanOnly !== true) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.packageModifiedNow !== false) return false;
  if (r.configModifiedNow !== false) return false;
  if (r.envModifiedNow !== false) return false;
  if (r.browserInvokedByPlan !== false) return false;
  if (r.devServerStartedByPlan !== false) return false;
  if (r.localApiInvokedByPlan !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.fetchCalled !== false) return false;
  if (r.realImageUsedByPlan !== false) return false;
  if (r.imageBytesReadByPlan !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrDependencyAdded !== false) return false;
  if (r.ocrProviderSelectedForRuntimeNow !== false) return false;
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
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceRealOcrGateDesignCommit !== "ead0f0c") return false;
  if (r.sourcePhotoOcrInternalReadinessCommit !== "a306243") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceRealOcrGateDesignAccepted !== true) return false;
  if (r.sourcePhotoOcrInternalReadinessAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;
  if (r.sourceRealOcrGateDesigned !== true) return false;
  if (r.sourceRealOcrGateDesignClosed !== true) return false;
  if (r.sourceReadyForRealOcrExtractionImplementationPlan !== true) return false;
  if (r.sourceReadyForRealOcrExtractionImplementation !== false) return false;
  if (r.sourceReadyForRealOcrExtraction !== false) return false;
  if (r.sourceReadyForPhotoOcrPublicRuntime !== false) return false;
  if (r.sourceReadyForProduction !== false) return false;
  if (r.sourceReadyForGoLive !== false) return false;

  if (r.realOcrExtractionImplementationPlanCreated !== true) return false;
  if (r.realOcrExtractionImplementationPlanClosed !== true) return false;
  if (r.readyForMinimalRealOcrRuntimePatch !== true) return false;
  if (r.readyForRealOcrExtractionImplementation !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForOcrLibraryRuntimeUse !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11C") return false;
  if (r.recommendedNextPhase !== "Minimal Real OCR Runtime Patch") return false;

  const ps = r.futureOcrProviderStrategy;
  if (!ps || ps.providerSelectionDeferredToRuntimePatch !== true) return false;
  if (ps.noProviderInstalledNow !== true) return false;
  if (ps.noProviderImportedNow !== true) return false;
  if (ps.initialRecommendedProviderCategory !== "local_js_ocr") return false;
  if (ps.providerRequirements.length !== REQUIRED_PROVIDER_REQUIREMENTS.length) return false;
  for (const item of REQUIRED_PROVIDER_REQUIREMENTS) if (!ps.providerRequirements.includes(item)) return false;
  for (const item of REQUIRED_REJECTED_PROVIDER_PATTERNS) if (!ps.rejectedProviderPatterns.includes(item)) return false;

  const es = r.futureEnvGateStrategy;
  if (!es || es.proposedEnvFlag !== "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED") return false;
  if (es.exactLowercaseTrueRequired !== true) return false;
  if (es.allOtherValuesFailClosed !== true) return false;
  if (es.existingPlaceholderFlagCannotAuthorizeRealOcr !== true) return false;
  if (es.clientMustNotAuthorizeOcr !== true) return false;
  if (es.disabledResponseCodeFuture !== "real_ocr_extraction_disabled") return false;
  for (const code of REQUIRED_UNSAFE_RESPONSE_CODES) if (!es.unsafeAttemptResponseCodesFuture.includes(code)) return false;

  const api = r.futureApiRoutePatchStrategy;
  if (!api || api.routePatchNotPerformedNow !== true) return false;
  if (api.futureMode !== "photo_ocr_real_extraction_controlled_runtime") return false;
  if (api.futureRequestContentType !== "multipart/form-data") return false;
  if (api.maxFileSizeBytes !== 8_388_608) return false;
  if (api.maxPageCount !== 1) return false;
  if (api.noModelCallDuringOcrExtraction !== true) return false;
  if (api.noPersistence !== true) return false;
  if (api.existingPhotoOcrPlaceholderBranchMustRemainUnchanged !== true) return false;

  const ui = r.futureUiClientStrategy;
  if (!ui || ui.uiPatchNotPerformedNow !== true) return false;
  if (ui.uiSelectionAloneDoesNotRunOcr !== true) return false;
  if (ui.clientDoesNotAuthorizeOcr !== true) return false;
  if (ui.futureOcrButtonPhotoModeOnly !== true) return false;
  if (ui.placeholderButtonMustRemainSeparate !== true) return false;

  const ec = r.futureOcrExecutionContract;
  if (!ec || ec.modelCallPerformedDuringOcrExtraction !== false) return false;
  if (ec.rawImagePersistencePerformed !== false) return false;
  if (ec.extractedTextPersistencePerformed !== false) return false;
  if (ec.failureMode !== "fail_closed") return false;
  if (ec.timeoutMsFuture !== FUTURE_OCR_TIMEOUT_MS) return false;
  if (ec.maxRetriesFuture !== FUTURE_OCR_MAX_RETRIES) return false;
  for (const field of REQUIRED_EXECUTION_OUTPUT_FIELDS) if (!ec.outputMustInclude.includes(field)) return false;

  const qe = r.futureOcrQualityEvaluatorPlan;
  if (!qe || qe.qualityEvaluatorRequiredBeforeSmartTalkHandoff !== true) return false;
  if (qe.implementationDeferredToFuturePhase !== true) return false;
  if (qe.minExtractedTextLength !== 8) return false;
  if (qe.maxExtractedTextLength !== 6000) return false;
  for (const s of REQUIRED_QUALITY_STATUSES) if (!qe.qualityStatuses.includes(s)) return false;
  for (const b of REQUIRED_BLOCKING_REASONS) if (!qe.blockingReasons.includes(b)) return false;
  for (const d of REQUIRED_DOWNGRADE_REASONS) if (!qe.downgradeReasons.includes(d)) return false;

  const tb = r.futureExtractedTextTrustBoundaryPlan;
  if (!tb || tb.extractedTextIsUntrusted !== true) return false;
  if (tb.extractedTextDoesNotWriteDna !== true) return false;
  if (tb.extractedTextDoesNotAuthorizeDeadlines !== true) return false;
  if (tb.sourceMetadataMustIncludeOcrDerived !== true) return false;

  const sh = r.futureSmartTalkHandoffPlan;
  if (!sh || sh.handoffDeferredToFuturePhase !== true) return false;
  if (sh.rawImageExcludedFromHandoff !== true) return false;
  if (sh.sourceMarkedOcrDerived !== true) return false;
  if (sh.textMarkedUntrusted !== true) return false;
  if (sh.evidenceGatesStillRequired !== true) return false;
  if (sh.hallucinationTrapsStillRequired !== true) return false;
  if (sh.exactLegalDeadlineStillBlocked !== true) return false;
  if (sh.bindingLegalAdviceStillBlocked !== true) return false;
  if (sh.officialFilingGenerationStillBlocked !== true) return false;

  const et = r.futureErrorTimeoutRateLimitPlan;
  if (!et || et.timeoutRequired !== true) return false;
  if (et.timeoutMs !== FUTURE_OCR_TIMEOUT_MS) return false;
  if (et.maxRetries !== FUTURE_OCR_MAX_RETRIES) return false;
  if (et.noInfiniteRetries !== true) return false;
  if (et.providerErrorsFailClosed !== true) return false;

  const rm = r.futureRegressionTestMatrixPlan;
  if (!rm || rm.disabledEnvVariantsPlannedCount < 9) return false;
  if (rm.enabledHappyPathSyntheticImagePlannedCount < 1) return false;
  if (rm.unsafeGuardCasesPlannedCount < 25) return false;
  if (rm.qualityEvaluatorCasesPlannedCount < 20) return false;
  if (rm.trustBoundaryCasesPlannedCount < 15) return false;
  if (rm.handoffBlockCasesPlannedCount < 10) return false;
  if (rm.tamperCasesPlannedCount < 100) return false;
  if (rm.totalPlannedRegressionCases !== TOTAL_PLANNED_REGRESSION_CASES) return false;
  for (const label of REQUIRED_REGRESSION_CASE_LABELS) if (!rm.plannedCaseLabels.includes(label)) return false;

  const mb = r.futureManualMobileBrowserTestPlan;
  if (!mb || mb.planningOnly !== true) return false;
  if (mb.mobileTestNotPerformedNow !== true) return false;
  if (mb.browserTestNotPerformedNow !== true) return false;
  if (mb.syntheticImageFirst !== true) return false;

  const rb = r.futureRollbackDisablePlan;
  if (!rb || rb.singleEnvKillSwitch !== "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED") return false;
  if (rb.disablingFlagStopsRealOcr !== true) return false;
  if (rb.placeholderModeUnaffectedByDisable !== true) return false;

  const fp = r.futureFilePlan;
  if (!fp || fp.existingFilesModifiedNow.length !== 0) return false;
  if (fp.filesCreatedNow.length !== 1) return false;
  for (const f of REQUIRED_FUTURE_RUNTIME_PATCH_FILES) if (!fp.futureRuntimePatchFiles.includes(f)) return false;
  for (const f of REQUIRED_FUTURE_AUDIT_FILES) if (!fp.futureAuditFiles.includes(f)) return false;

  const ng = r.nonGoLiveSafetyVerdict;
  if (!ng || ng.implementationPlanComplete !== true) return false;
  if (ng.readyForMinimalRealOcrRuntimePatch !== true) return false;
  if (ng.realOcrRuntimeStillNotImplemented !== true) return false;
  if (ng.publicRuntimeStillBlocked !== true) return false;
  if (ng.readyForProduction !== false) return false;
  if (ng.readyForGoLive !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (!Array.isArray(r.sourceEvidence) || r.sourceEvidence.length === 0) return false;
  if (!Array.isArray(r.implementationPlanEvidence) || r.implementationPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.providerStrategyEvidence) || r.providerStrategyEvidence.length === 0) return false;
  if (!Array.isArray(r.envGateStrategyEvidence) || r.envGateStrategyEvidence.length === 0) return false;
  if (!Array.isArray(r.apiRoutePatchStrategyEvidence) || r.apiRoutePatchStrategyEvidence.length === 0) return false;
  if (!Array.isArray(r.uiClientStrategyEvidence) || r.uiClientStrategyEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrExecutionContractEvidence) || r.ocrExecutionContractEvidence.length === 0) return false;
  if (!Array.isArray(r.qualityEvaluatorPlanEvidence) || r.qualityEvaluatorPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.extractedTextTrustBoundaryEvidence) || r.extractedTextTrustBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.smartTalkHandoffPlanEvidence) || r.smartTalkHandoffPlanEvidence.length === 0) return false;
  if (!Array.isArray(r.errorTimeoutRateLimitEvidence) || r.errorTimeoutRateLimitEvidence.length === 0) return false;
  if (!Array.isArray(r.regressionTestMatrixEvidence) || r.regressionTestMatrixEvidence.length === 0) return false;
  if (!Array.isArray(r.manualMobileBrowserTestEvidence) || r.manualMobileBrowserTestEvidence.length === 0) return false;
  if (!Array.isArray(r.rollbackDisableEvidence) || r.rollbackDisableEvidence.length === 0) return false;
  if (!Array.isArray(r.futureFilePlanEvidence) || r.futureFilePlanEvidence.length === 0) return false;
  if (!Array.isArray(r.nonGoLiveSafetyVerdictEvidence) || r.nonGoLiveSafetyVerdictEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) if (!r.evidenceLimitations.includes(item)) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) if (!r.remainingBlockers.includes(item)) return false;
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper811BMutation = (r: RealOcrExtractionImplementationPlanResult) => RealOcrExtractionImplementationPlanResult;
interface Tamper811BCase {
  label: string;
  mutate: Tamper811BMutation;
}

const REAL_OCR_EXTRACTION_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper811BCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11A" as "8.11B" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "implementationPlanOnly false", mutate: (r) => ({ ...r, implementationPlanOnly: false as true }) },
  { label: "realOcrExtractionImplementationPlanOnly false", mutate: (r) => ({ ...r, realOcrExtractionImplementationPlanOnly: false as true }) },
  { label: "sourceRealOcrGateDesignAccepted false (source 8.11A not accepted)", mutate: (r) => ({ ...r, sourceRealOcrGateDesignAccepted: false }) },
  { label: "sourcePhotoOcrInternalReadinessAccepted false (source 8.10J not accepted)", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source 8.9N not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceRealOcrGateDesignCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceRealOcrGateDesignCommit: "0000000" as "ead0f0c" }) },
  { label: "sourcePhotoOcrInternalReadinessCommit wrong", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessCommit: "0000000" as "a306243" }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "sourceRealOcrGateDesigned false", mutate: (r) => ({ ...r, sourceRealOcrGateDesigned: false }) },
  { label: "sourceReadyForRealOcrExtractionImplementationPlan false", mutate: (r) => ({ ...r, sourceReadyForRealOcrExtractionImplementationPlan: false }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "packageModifiedNow true (package/config/env modified)", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "configModifiedNow true (package/config/env modified)", mutate: (r) => ({ ...r, configModifiedNow: true as false }) },
  { label: "envModifiedNow true (package/config/env modified)", mutate: (r) => ({ ...r, envModifiedNow: true as false }) },
  { label: "ocrDependencyAdded true (OCR dependency added)", mutate: (r) => ({ ...r, ocrDependencyAdded: true as false }) },
  { label: "ocrLibraryImported true (OCR library imported)", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrProviderSelectedForRuntimeNow true (OCR provider selected for runtime now)", mutate: (r) => ({ ...r, ocrProviderSelectedForRuntimeNow: true as false }) },
  { label: "ocrExtractionPerformed true (OCR extraction performed)", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "realOcrExtractionPerformed true (real OCR extraction performed)", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "imageBytesReadByPlan true (image bytes read)", mutate: (r) => ({ ...r, imageBytesReadByPlan: true as false }) },
  { label: "realImageUsedByPlan true (real image used)", mutate: (r) => ({ ...r, realImageUsedByPlan: true as false }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "fetchCalled true (fetch/external network called)", mutate: (r) => ({ ...r, fetchCalled: true as false }) },
  { label: "externalNetworkCalled true (fetch/external network called)", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "openAiCalled true (OpenAI called)", mutate: (r) => ({ ...r, openAiCalled: true as false }) },
  { label: "persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true (paid document mode enabled)", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "futureOcrProviderStrategy.noProviderInstalledNow false (provider installed now)", mutate: (r) => ({ ...r, futureOcrProviderStrategy: { ...r.futureOcrProviderStrategy, noProviderInstalledNow: false as true } }) },
  { label: "futureOcrProviderStrategy.noProviderImportedNow false (provider installed now)", mutate: (r) => ({ ...r, futureOcrProviderStrategy: { ...r.futureOcrProviderStrategy, noProviderImportedNow: false as true } }) },
  { label: "futureOcrProviderStrategy.providerRequirements emptied (future provider strategy missing)", mutate: (r) => ({ ...r, futureOcrProviderStrategy: { ...r.futureOcrProviderStrategy, providerRequirements: [] } }) },
  { label: "futureEnvGateStrategy.proposedEnvFlag wrong (future env flag missing)", mutate: (r) => ({ ...r, futureEnvGateStrategy: { ...r.futureEnvGateStrategy, proposedEnvFlag: "WRONG" as "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED" } }) },
  { label: "futureEnvGateStrategy.exactLowercaseTrueRequired false (future env flag does not require exact lowercase true)", mutate: (r) => ({ ...r, futureEnvGateStrategy: { ...r.futureEnvGateStrategy, exactLowercaseTrueRequired: false as true } }) },
  { label: "futureEnvGateStrategy.existingPlaceholderFlagCannotAuthorizeRealOcr false (existing placeholder flag authorizes real OCR)", mutate: (r) => ({ ...r, futureEnvGateStrategy: { ...r.futureEnvGateStrategy, existingPlaceholderFlagCannotAuthorizeRealOcr: false as true } }) },
  { label: "futureEnvGateStrategy.clientMustNotAuthorizeOcr false (client authorizes OCR)", mutate: (r) => ({ ...r, futureEnvGateStrategy: { ...r.futureEnvGateStrategy, clientMustNotAuthorizeOcr: false as true } }) },
  { label: "futureApiRoutePatchStrategy.routePatchNotPerformedNow false (API patch marked performed now)", mutate: (r) => ({ ...r, futureApiRoutePatchStrategy: { ...r.futureApiRoutePatchStrategy, routePatchNotPerformedNow: false as true } }) },
  { label: "futureUiClientStrategy.uiPatchNotPerformedNow false (UI patch marked performed now)", mutate: (r) => ({ ...r, futureUiClientStrategy: { ...r.futureUiClientStrategy, uiPatchNotPerformedNow: false as true } }) },
  { label: "futureUiClientStrategy.uiSelectionAloneDoesNotRunOcr false (request can trigger OCR by UI selection alone)", mutate: (r) => ({ ...r, futureUiClientStrategy: { ...r.futureUiClientStrategy, uiSelectionAloneDoesNotRunOcr: false as true } }) },
  { label: "futureOcrExecutionContract.modelCallPerformedDuringOcrExtraction true (OCR execution contract allows model call during extraction)", mutate: (r) => ({ ...r, futureOcrExecutionContract: { ...r.futureOcrExecutionContract, modelCallPerformedDuringOcrExtraction: true as false } }) },
  { label: "futureOcrExecutionContract.rawImagePersistencePerformed true (OCR execution contract allows persistence)", mutate: (r) => ({ ...r, futureOcrExecutionContract: { ...r.futureOcrExecutionContract, rawImagePersistencePerformed: true as false } }) },
  { label: "futureOcrExecutionContract.failureMode not fail_closed (OCR execution contract lacks fail-closed behavior)", mutate: (r) => ({ ...r, futureOcrExecutionContract: { ...r.futureOcrExecutionContract, failureMode: "fail_open" as "fail_closed" } }) },
  { label: "futureOcrExecutionContract.timeoutMsFuture zero (OCR execution contract lacks timeout)", mutate: (r) => ({ ...r, futureOcrExecutionContract: { ...r.futureOcrExecutionContract, timeoutMsFuture: 0 } }) },
  { label: "futureOcrQualityEvaluatorPlan.qualityEvaluatorRequiredBeforeSmartTalkHandoff false (quality evaluator not required before handoff)", mutate: (r) => ({ ...r, futureOcrQualityEvaluatorPlan: { ...r.futureOcrQualityEvaluatorPlan, qualityEvaluatorRequiredBeforeSmartTalkHandoff: false as true } }) },
  { label: "futureOcrQualityEvaluatorPlan.blockingReasons missing empty_extraction (empty extraction not blocking)", mutate: (r) => ({ ...r, futureOcrQualityEvaluatorPlan: { ...r.futureOcrQualityEvaluatorPlan, blockingReasons: r.futureOcrQualityEvaluatorPlan.blockingReasons.filter((b) => b !== "empty_extraction") } }) },
  { label: "futureOcrQualityEvaluatorPlan.blockingReasons missing unsupported_mime (unsupported MIME not blocking)", mutate: (r) => ({ ...r, futureOcrQualityEvaluatorPlan: { ...r.futureOcrQualityEvaluatorPlan, blockingReasons: r.futureOcrQualityEvaluatorPlan.blockingReasons.filter((b) => b !== "unsupported_mime") } }) },
  { label: "futureOcrQualityEvaluatorPlan.blockingReasons missing multiple_pages (multiple pages allowed in first runtime)", mutate: (r) => ({ ...r, futureOcrQualityEvaluatorPlan: { ...r.futureOcrQualityEvaluatorPlan, blockingReasons: r.futureOcrQualityEvaluatorPlan.blockingReasons.filter((b) => b !== "multiple_pages") } }) },
  { label: "futureOcrQualityEvaluatorPlan.blockingReasons missing suspected_handwriting (handwriting allowed in first runtime)", mutate: (r) => ({ ...r, futureOcrQualityEvaluatorPlan: { ...r.futureOcrQualityEvaluatorPlan, blockingReasons: r.futureOcrQualityEvaluatorPlan.blockingReasons.filter((b) => b !== "suspected_handwriting") } }) },
  { label: "futureExtractedTextTrustBoundaryPlan.extractedTextIsUntrusted false (extracted text marked trusted)", mutate: (r) => ({ ...r, futureExtractedTextTrustBoundaryPlan: { ...r.futureExtractedTextTrustBoundaryPlan, extractedTextIsUntrusted: false as true } }) },
  { label: "futureExtractedTextTrustBoundaryPlan.extractedTextDoesNotWriteDna false (extracted text can write DNA)", mutate: (r) => ({ ...r, futureExtractedTextTrustBoundaryPlan: { ...r.futureExtractedTextTrustBoundaryPlan, extractedTextDoesNotWriteDna: false as true } }) },
  { label: "futureExtractedTextTrustBoundaryPlan.extractedTextDoesNotAuthorizeDeadlines false (extracted text can authorize deadline)", mutate: (r) => ({ ...r, futureExtractedTextTrustBoundaryPlan: { ...r.futureExtractedTextTrustBoundaryPlan, extractedTextDoesNotAuthorizeDeadlines: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.rawImageExcludedFromHandoff false (handoff includes raw image)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, rawImageExcludedFromHandoff: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.textMarkedUntrusted false (handoff does not mark OCR-derived/untrusted)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, textMarkedUntrusted: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.sourceMarkedOcrDerived false (handoff does not mark OCR-derived/untrusted)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, sourceMarkedOcrDerived: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.evidenceGatesStillRequired false (evidence gates bypassed)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, evidenceGatesStillRequired: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.hallucinationTrapsStillRequired false (hallucination traps bypassed)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, hallucinationTrapsStillRequired: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.exactLegalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, exactLegalDeadlineStillBlocked: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.bindingLegalAdviceStillBlocked false (binding legal advice allowed)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, bindingLegalAdviceStillBlocked: false as true } }) },
  { label: "futureSmartTalkHandoffPlan.officialFilingGenerationStillBlocked false (official filing generation allowed)", mutate: (r) => ({ ...r, futureSmartTalkHandoffPlan: { ...r.futureSmartTalkHandoffPlan, officialFilingGenerationStillBlocked: false as true } }) },
  { label: "futureErrorTimeoutRateLimitPlan.noInfiniteRetries false", mutate: (r) => ({ ...r, futureErrorTimeoutRateLimitPlan: { ...r.futureErrorTimeoutRateLimitPlan, noInfiniteRetries: false as true } }) },
  { label: "futureErrorTimeoutRateLimitPlan.providerErrorsFailClosed false", mutate: (r) => ({ ...r, futureErrorTimeoutRateLimitPlan: { ...r.futureErrorTimeoutRateLimitPlan, providerErrorsFailClosed: false as true } }) },
  { label: "futureRegressionTestMatrixPlan.unsafeGuardCasesPlannedCount too low (regression matrix counts too low)", mutate: (r) => ({ ...r, futureRegressionTestMatrixPlan: { ...r.futureRegressionTestMatrixPlan, unsafeGuardCasesPlannedCount: 10 } }) },
  { label: "futureRegressionTestMatrixPlan.qualityEvaluatorCasesPlannedCount too low", mutate: (r) => ({ ...r, futureRegressionTestMatrixPlan: { ...r.futureRegressionTestMatrixPlan, qualityEvaluatorCasesPlannedCount: 5 } }) },
  { label: "futureRegressionTestMatrixPlan.tamperCasesPlannedCount too low", mutate: (r) => ({ ...r, futureRegressionTestMatrixPlan: { ...r.futureRegressionTestMatrixPlan, tamperCasesPlannedCount: 50 } }) },
  { label: "futureRegressionTestMatrixPlan.totalPlannedRegressionCases wrong", mutate: (r) => ({ ...r, futureRegressionTestMatrixPlan: { ...r.futureRegressionTestMatrixPlan, totalPlannedRegressionCases: 10 } }) },
  { label: "futureManualMobileBrowserTestPlan.mobileTestNotPerformedNow false (mobile/browser test marked performed now)", mutate: (r) => ({ ...r, futureManualMobileBrowserTestPlan: { ...r.futureManualMobileBrowserTestPlan, mobileTestNotPerformedNow: false as true } }) },
  { label: "futureManualMobileBrowserTestPlan.browserTestNotPerformedNow false (mobile/browser test marked performed now)", mutate: (r) => ({ ...r, futureManualMobileBrowserTestPlan: { ...r.futureManualMobileBrowserTestPlan, browserTestNotPerformedNow: false as true } }) },
  { label: "futureRollbackDisablePlan.disablingFlagStopsRealOcr false (disabling flag does not stop real OCR)", mutate: (r) => ({ ...r, futureRollbackDisablePlan: { ...r.futureRollbackDisablePlan, disablingFlagStopsRealOcr: false as true } }) },
  { label: "futureRollbackDisablePlan.singleEnvKillSwitch wrong (rollback plan missing kill switch)", mutate: (r) => ({ ...r, futureRollbackDisablePlan: { ...r.futureRollbackDisablePlan, singleEnvKillSwitch: "WRONG" as "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED" } }) },
  { label: "futureFilePlan.existingFilesModifiedNow not empty", mutate: (r) => ({ ...r, futureFilePlan: { ...r.futureFilePlan, existingFilesModifiedNow: ["app/api/smart-talk/route.ts"] } }) },
  { label: "nonGoLiveSafetyVerdict.readyForMinimalRealOcrRuntimePatch false", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdict: { ...r.nonGoLiveSafetyVerdict, readyForMinimalRealOcrRuntimePatch: false } }) },
  { label: "nonGoLiveSafetyVerdict.realOcrRuntimeStillNotImplemented false", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdict: { ...r.nonGoLiveSafetyVerdict, realOcrRuntimeStillNotImplemented: false as true } }) },
  { label: "nonGoLiveSafetyVerdict.publicRuntimeStillBlocked false (public runtime marked ready)", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdict: { ...r.nonGoLiveSafetyVerdict, publicRuntimeStillBlocked: false as true } }) },
  { label: "nonGoLiveSafetyVerdict.readyForProduction true (production/go-live marked ready)", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdict: { ...r.nonGoLiveSafetyVerdict, readyForProduction: true as false } }) },
  { label: "nonGoLiveSafetyVerdict.readyForGoLive true (production/go-live marked ready)", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdict: { ...r.nonGoLiveSafetyVerdict, readyForGoLive: true as false } }) },
  { label: "readyForMinimalRealOcrRuntimePatch false", mutate: (r) => ({ ...r, readyForMinimalRealOcrRuntimePatch: false }) },
  { label: "readyForRealOcrExtractionImplementation true", mutate: (r) => ({ ...r, readyForRealOcrExtractionImplementation: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true (readyForPublicRuntime true)", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase not 8.11C)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11D" as "8.11C" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Real OCR Public Launch" as "Minimal Real OCR Runtime Patch" }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence emptied", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "implementationPlanEvidence emptied", mutate: (r) => ({ ...r, implementationPlanEvidence: [] }) },
  { label: "providerStrategyEvidence emptied", mutate: (r) => ({ ...r, providerStrategyEvidence: [] }) },
  { label: "envGateStrategyEvidence emptied", mutate: (r) => ({ ...r, envGateStrategyEvidence: [] }) },
  { label: "apiRoutePatchStrategyEvidence emptied", mutate: (r) => ({ ...r, apiRoutePatchStrategyEvidence: [] }) },
  { label: "uiClientStrategyEvidence emptied", mutate: (r) => ({ ...r, uiClientStrategyEvidence: [] }) },
  { label: "ocrExecutionContractEvidence emptied", mutate: (r) => ({ ...r, ocrExecutionContractEvidence: [] }) },
  { label: "qualityEvaluatorPlanEvidence emptied", mutate: (r) => ({ ...r, qualityEvaluatorPlanEvidence: [] }) },
  { label: "extractedTextTrustBoundaryEvidence emptied", mutate: (r) => ({ ...r, extractedTextTrustBoundaryEvidence: [] }) },
  { label: "smartTalkHandoffPlanEvidence emptied", mutate: (r) => ({ ...r, smartTalkHandoffPlanEvidence: [] }) },
  { label: "errorTimeoutRateLimitEvidence emptied", mutate: (r) => ({ ...r, errorTimeoutRateLimitEvidence: [] }) },
  { label: "regressionTestMatrixEvidence emptied", mutate: (r) => ({ ...r, regressionTestMatrixEvidence: [] }) },
  { label: "manualMobileBrowserTestEvidence emptied", mutate: (r) => ({ ...r, manualMobileBrowserTestEvidence: [] }) },
  { label: "rollbackDisableEvidence emptied", mutate: (r) => ({ ...r, rollbackDisableEvidence: [] }) },
  { label: "futureFilePlanEvidence emptied", mutate: (r) => ({ ...r, futureFilePlanEvidence: [] }) },
  { label: "nonGoLiveSafetyVerdictEvidence emptied", mutate: (r) => ({ ...r, nonGoLiveSafetyVerdictEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "evidenceLimitations wrong length/content", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "remainingBlockers wrong length/content", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported plan runner ───────────────────────────────────────────────────

export async function runRealOcrExtractionImplementationPlan(): Promise<RealOcrExtractionImplementationPlanResult> {
  const planFailures: string[] = [];

  // ── Source of truth: 8.11A Real OCR Extraction Gate Design ────────────────
  const a = await runRealOcrExtractionGateDesign();
  if (a.checkId !== "8.11A") planFailures.push(`8.11A checkId mismatch: got "${a.checkId}"`);
  if (a.allPassed !== true) planFailures.push("8.11A allPassed is not true");
  if (a.readyForNextPhase !== "8.11B") planFailures.push("8.11A readyForNextPhase is not 8.11B");
  if (a.realOcrExtractionGateDesigned !== true) planFailures.push("8.11A realOcrExtractionGateDesigned is not true");
  if (a.realOcrExtractionGateDesignClosed !== true) planFailures.push("8.11A realOcrExtractionGateDesignClosed is not true");
  if (a.readyForRealOcrExtractionImplementationPlan !== true) planFailures.push("8.11A readyForRealOcrExtractionImplementationPlan is not true");
  if (a.readyForRealOcrExtractionImplementation !== false) planFailures.push("8.11A readyForRealOcrExtractionImplementation is not false");
  if (a.readyForRealOcrExtraction !== false) planFailures.push("8.11A readyForRealOcrExtraction is not false");
  if (a.sourcePhotoOcrInternalReadinessAccepted !== true) planFailures.push("8.11A sourcePhotoOcrInternalReadinessAccepted is not true");
  if (a.sourceTextDocumentInternalReadinessAccepted !== true) planFailures.push("8.11A sourceTextDocumentInternalReadinessAccepted is not true");
  if (a.tamperRejected !== a.tamperCount) planFailures.push("8.11A own tamper count mismatch");

  const sourceRealOcrGateDesignAccepted = a.checkId === "8.11A" && a.allPassed === true;
  const sourcePhotoOcrInternalReadinessAccepted = a.sourcePhotoOcrInternalReadinessAccepted === true;
  const sourceTextDocumentInternalReadinessAccepted = a.sourceTextDocumentInternalReadinessAccepted === true;
  const sourceRealOcrGateDesigned = a.realOcrExtractionGateDesigned === true;
  const sourceRealOcrGateDesignClosed = a.realOcrExtractionGateDesignClosed === true;
  const sourceReadyForRealOcrExtractionImplementationPlan = a.readyForRealOcrExtractionImplementationPlan === true;

  const planReady =
    planFailures.length === 0 &&
    sourceRealOcrGateDesignAccepted &&
    sourcePhotoOcrInternalReadinessAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    sourceRealOcrGateDesigned &&
    sourceRealOcrGateDesignClosed &&
    sourceReadyForRealOcrExtractionImplementationPlan;

  const futureOcrProviderStrategy: FutureOcrProviderStrategy = {
    providerSelectionDeferredToRuntimePatch: true,
    noProviderInstalledNow: true,
    noProviderImportedNow: true,
    initialRecommendedProviderCategory: "local_js_ocr",
    recommendedFirstPass:
      "Server-side in-process OCR via an internal adapter module (e.g. Tesseract.js or equivalent wrapped behind lib/vaylo/smart-talk/ocr/adapter); no external OCR SaaS in the first controlled internal iteration; adapter selected and installed only in 8.11C with explicit env kill-switch; zero persistence; image bytes processed in-memory only and discarded after response.",
    providerRequirements: [...REQUIRED_PROVIDER_REQUIREMENTS],
    rejectedProviderPatterns: [...REQUIRED_REJECTED_PROVIDER_PATTERNS],
  };

  const futureEnvGateStrategy: FutureEnvGateStrategy = {
    proposedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED",
    exactLowercaseTrueRequired: true,
    allOtherValuesFailClosed: true,
    existingPlaceholderFlagCannotAuthorizeRealOcr: true,
    publicRuntimeFlagSeparateAndStillBlocked: true,
    productionGoLiveFlagsSeparateAndStillBlocked: true,
    envFlagMustBeReadServerSideOnly: true,
    clientMustNotAuthorizeOcr: true,
    disabledResponseCodeFuture: "real_ocr_extraction_disabled",
    unsafeAttemptResponseCodesFuture: [...REQUIRED_UNSAFE_RESPONSE_CODES],
  };

  const futureApiRoutePatchStrategy: FutureApiRoutePatchStrategy = {
    targetFileFuture: "app/api/smart-talk/route.ts",
    routePatchNotPerformedNow: true,
    futureMode: "photo_ocr_real_extraction_controlled_runtime",
    futureBranchMustBeIsolated: true,
    existingPhotoOcrPlaceholderBranchMustRemainUnchanged: true,
    existingTextDocumentModeMustRemainUnchanged: true,
    existingFreeQaMustRemainUnchanged: true,
    futureRequestContentType: "multipart/form-data",
    maxFileSizeBytes: 8_388_608,
    maxPageCount: 1,
    allowedMimeTypes: [...REQUIRED_ALLOWED_MIME_TYPES],
    blockedMimeTypes: [...REQUIRED_BLOCKED_MIME_TYPES],
    noPersistence: true,
    noDbStorage: true,
    noSupabaseStorage: true,
    noDnaWrite: true,
    noModelCallDuringOcrExtraction: true,
    rawImageNotSentToSmartTalkReasoning: true,
    extractedTextMustPassQualityGateBeforeHandoff: true,
    errorsMustFailClosed: true,
    responseMustIncludeSafetyMeta: true,
  };

  const futureUiClientStrategy: FutureUiClientStrategy = {
    targetFileFuture: "app/smart-talk/SmartTalkClient.tsx",
    uiPatchNotPerformedNow: true,
    futureInternalButtonLabel: "Interný test: Real OCR extraction",
    placeholderButtonMustRemainSeparate: true,
    textDocumentButtonMustRemainSeparate: true,
    questionModeMustNotShowOcrButton: true,
    futureOcrButtonPhotoModeOnly: true,
    selectedPageRequired: true,
    explicitClickRequired: true,
    uiSelectionAloneDoesNotRunOcr: true,
    clientDoesNotAuthorizeOcr: true,
    browserMustNotPersistImage: true,
    requestMustBeAbortable: true,
    loadingStateRequired: true,
    errorStateRequired: true,
    lowQualityWarningStateRequired: true,
    userDisclosureBeforeRunRequired: true,
  };

  const futureOcrExecutionContract: FutureOcrExecutionContract = {
    mode: "photo_ocr_real_extraction_controlled_runtime",
    context: "anonymous",
    sourceKind: "single_image_ocr",
    ocrRunsBeforeModelReasoning: true,
    modelCallPerformedDuringOcrExtraction: false,
    rawImagePersistencePerformed: false,
    processedImagePersistencePerformed: false,
    extractedTextPersistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    timeoutMsFuture: FUTURE_OCR_TIMEOUT_MS,
    maxRetriesFuture: FUTURE_OCR_MAX_RETRIES,
    failureMode: "fail_closed",
    outputMustInclude: [...REQUIRED_EXECUTION_OUTPUT_FIELDS],
  };

  const futureOcrQualityEvaluatorPlan: FutureOcrQualityEvaluatorPlan = {
    qualityEvaluatorRequiredBeforeSmartTalkHandoff: true,
    implementationDeferredToFuturePhase: true,
    minExtractedTextLength: 8,
    maxExtractedTextLength: 6000,
    qualityStatuses: [...REQUIRED_QUALITY_STATUSES],
    blockingReasons: [...REQUIRED_BLOCKING_REASONS],
    downgradeReasons: [...REQUIRED_DOWNGRADE_REASONS],
    usableForSmartTalkRequiresNoBlockingReasons: true,
    lowQualityStillRequiresUserWarning: true,
  };

  const futureExtractedTextTrustBoundaryPlan: FutureExtractedTextTrustBoundaryPlan = {
    extractedTextIsDerived: true,
    extractedTextIsUntrusted: true,
    extractedTextMayContainPii: true,
    extractedTextSensitive: true,
    extractedTextNotPersistedByDefault: true,
    extractedTextDoesNotCreateVerifiedFacts: true,
    extractedTextDoesNotWriteDna: true,
    extractedTextDoesNotAuthorizeDeadlines: true,
    extractedTextDoesNotAuthorizeOfficialFilings: true,
    extractedTextMustCarrySourceMetadata: true,
    sourceMetadataMustIncludeOcrDerived: true,
    sourceMetadataMustIncludeQualityStatus: true,
    sourceMetadataMustIncludeWarnings: true,
  };

  const futureSmartTalkHandoffPlan: FutureSmartTalkHandoffPlan = {
    handoffDeferredToFuturePhase: true,
    handoffRequiresQualityUsableOrMediumWithWarning: true,
    handoffTextOnly: true,
    rawImageExcludedFromHandoff: true,
    sourceMarkedOcrDerived: true,
    textMarkedUntrusted: true,
    qualitySummaryIncluded: true,
    ocrWarningsIncluded: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    evidenceGatesStillRequired: true,
    hallucinationTrapsStillRequired: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    modelOutputStillUntrusted: true,
  };

  const futureErrorTimeoutRateLimitPlan: FutureErrorTimeoutRateLimitPlan = {
    timeoutRequired: true,
    timeoutMs: FUTURE_OCR_TIMEOUT_MS,
    noInfiniteRetries: true,
    maxRetries: FUTURE_OCR_MAX_RETRIES,
    rateLimitMustRemainApplied: true,
    rateLimitShouldUseExistingSmartTalkLimiterInitially: true,
    providerErrorsFailClosed: true,
    malformedOutputFailsClosed: true,
    oversizedOutputFailsClosed: true,
    emptyExtractionFailsClosed: true,
    partialFailureReturnsNoVerifiedClaims: true,
    userMessageMustBeSafeAndNonLegal: true,
  };

  const futureRegressionTestMatrixPlan: FutureRegressionTestMatrixPlan = {
    disabledEnvVariantsPlannedCount: DISABLED_ENV_VARIANTS_PLANNED,
    enabledHappyPathSyntheticImagePlannedCount: ENABLED_HAPPY_PATH_PLANNED,
    unsafeGuardCasesPlannedCount: UNSAFE_GUARD_CASES_PLANNED,
    qualityEvaluatorCasesPlannedCount: QUALITY_EVALUATOR_CASES_PLANNED,
    trustBoundaryCasesPlannedCount: TRUST_BOUNDARY_CASES_PLANNED,
    handoffBlockCasesPlannedCount: HANDOFF_BLOCK_CASES_PLANNED,
    tamperCasesPlannedCount: TAMPER_CASES_PLANNED,
    totalPlannedRegressionCases: TOTAL_PLANNED_REGRESSION_CASES,
    plannedCaseLabels: [...REQUIRED_REGRESSION_CASE_LABELS],
  };

  const futureManualMobileBrowserTestPlan: FutureManualMobileBrowserTestPlan = {
    planningOnly: true,
    mobileTestNotPerformedNow: true,
    browserTestNotPerformedNow: true,
    androidChromeRequiredLater: true,
    desktopChromeRequiredLater: true,
    syntheticImageFirst: true,
    realDocumentLaterOnlyAfterSyntheticPass: true,
    cameraCaptureLater: true,
    galleryUploadLater: true,
    networkInspectionRequired: true,
    userDisclosureVisualCheckRequired: true,
    lowQualityWarningVisualCheckRequired: true,
    noPersistenceEvidenceRequired: true,
    cleanupRequired: true,
  };

  const futureRollbackDisablePlan: FutureRollbackDisablePlan = {
    singleEnvKillSwitch: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED",
    disablingFlagStopsRealOcr: true,
    placeholderModeUnaffectedByDisable: true,
    textDocumentModeUnaffectedByDisable: true,
    freeQaUnaffectedByDisable: true,
    noDatabaseRollbackNeededForFirstRuntime: true,
    noStorageCleanupNeededBecauseNoPersistence: true,
    runtimeCanFailClosedToDisabledResponse: true,
  };

  const futureFilePlan: FutureFilePlan = {
    futureRuntimePatchFiles: [...REQUIRED_FUTURE_RUNTIME_PATCH_FILES],
    futureAuditFiles: [...REQUIRED_FUTURE_AUDIT_FILES],
    filesCreatedNow: ["lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-extraction-implementation-plan.ts"],
    existingFilesModifiedNow: [],
  };

  const nonGoLiveSafetyVerdict: NonGoLiveSafetyVerdict = {
    implementationPlanComplete: true,
    readyForMinimalRealOcrRuntimePatch: planReady,
    realOcrRuntimeStillNotImplemented: true,
    realOcrStillNotUsableByUsers: true,
    publicRuntimeStillBlocked: true,
    productionStillUnauthorized: true,
    goLiveStillUnauthorized: true,
    readyForProduction: false,
    readyForGoLive: false,
  };

  const sourceEvidence: string[] = [
    "8.11A Real OCR Extraction Gate Design accepted (commit ead0f0c) — realOcrExtractionGateDesigned true, realOcrExtractionGateDesignClosed true, readyForRealOcrExtractionImplementationPlan true.",
    "8.10J Photo/OCR internal readiness accepted via 8.11A sourcePhotoOcrInternalReadinessAccepted (commit a306243) — placeholder path internally ready; real OCR still blocked.",
    "8.9N Text Document Mode internal readiness accepted via 8.11A sourceTextDocumentInternalReadinessAccepted (commit 3cf81c1) — cross-feature supporting context only.",
    "This plan calls only 8.11A directly; 8.10J/8.9N acceptance is derived from 8.11A's already-computed fields to avoid redundant route-invoking source chains.",
  ];

  const implementationPlanEvidence: string[] = [
    "8.11B is implementation-plan-only — no route, UI, package, config, env, OCR library, or runtime patch performed.",
    "The plan defines 14 structured future sections aligned with the 8.11A gate design: provider strategy, env gate, API route patch, UI client, OCR execution contract, quality evaluator, extracted text trust boundary, Smart Talk handoff, error/timeout/rate-limit, regression matrix, manual mobile/browser test, rollback/disable, future file plan, and non-go-live safety verdict.",
    "8.11C is the first allowed runtime patch phase; it may add an OCR dependency only if explicitly authorized in that phase.",
    "Real OCR extraction, OCR library runtime use, public runtime, production, and go-live all remain false/unauthorized after this plan.",
  ];

  const providerStrategyEvidence: string[] = [
    "Provider selection is deferred to 8.11C; no provider is installed or imported in this plan phase.",
    "Initial recommended category: local_js_ocr — server-side in-process OCR via internal adapter avoids external OCR SaaS calls in the first controlled iteration, aligns with fail-closed/no-external-network constraints, and keeps image bytes out of LLM paths.",
    `Provider requirements (${REQUIRED_PROVIDER_REQUIREMENTS.length} items) and rejected patterns (${REQUIRED_REJECTED_PROVIDER_PATTERNS.length} items) are explicitly enumerated.`,
  ];

  const envGateStrategyEvidence: string[] = [
    "Dedicated env flag SMART_TALK_REAL_OCR_EXTRACTION_ENABLED requires exact lowercase \"true\"; all other values fail closed with real_ocr_extraction_disabled.",
    "Existing Photo/OCR placeholder flag (SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED) must never authorize real OCR.",
    "Env flag is server-side only; client must not authorize OCR.",
    `Unsafe attempt response codes (${REQUIRED_UNSAFE_RESPONSE_CODES.length} codes) are planned for MIME/size/page/persistence/public-runtime/timeout/provider/quality failures.`,
  ];

  const apiRoutePatchStrategyEvidence: string[] = [
    "Future isolated branch in app/api/smart-talk/route.ts for mode photo_ocr_real_extraction_controlled_runtime; existing placeholder, text document, and free QA branches must remain unchanged.",
    "Future request content type: multipart/form-data — standard single-file upload boundary for real image bytes from browser gallery/camera; metadata fields accompany the binary part without mixing raw bytes into JSON.",
    "Max file size 8 MiB, max page count 1, allowed MIME types image/png/jpeg/webp; no persistence/DB/Supabase/DNA; no model call during OCR extraction; extracted text must pass quality gate before any handoff.",
  ];

  const uiClientStrategyEvidence: string[] = [
    "Future internal button \"Interný test: Real OCR extraction\" in photo mode only; separate from placeholder and text document buttons; absent from question/default mode.",
    "Selected page + explicit click required; UI selection alone does not run OCR; client does not authorize OCR.",
    "Loading, error, and low-quality warning states required; user disclosure before run required; request must be abortable; browser must not persist image.",
  ];

  const ocrExecutionContractEvidence: string[] = [
    `OCR runs before any model reasoning; modelCallPerformedDuringOcrExtraction false; timeout ${FUTURE_OCR_TIMEOUT_MS}ms; maxRetries ${FUTURE_OCR_MAX_RETRIES} (fail-closed, no retry storm on first runtime).`,
    "No raw/processed image or extracted text persistence; no DB/Supabase/DNA writes; failureMode fail_closed.",
    `Response must include ${REQUIRED_EXECUTION_OUTPUT_FIELDS.length} output categories: extracted text, confidence, warnings, quality status, blocking/downgrade reasons, safety meta, disclaimers, readiness flags.`,
  ];

  const qualityEvaluatorPlanEvidence: string[] = [
    "Quality evaluator required before Smart Talk handoff; implementation deferred to a future phase after 8.11C minimal runtime patch.",
    "Text length bounds 8–6000 chars; quality statuses blocked/low/medium/usable.",
    `Blocking reasons (${REQUIRED_BLOCKING_REASONS.length}), downgrade reasons (${REQUIRED_DOWNGRADE_REASONS.length}); usableForSmartTalk requires no blocking reasons; low quality still requires user warning.`,
  ];

  const extractedTextTrustBoundaryEvidence: string[] = [
    "Extracted text is derived, untrusted, may contain PII, sensitive, not persisted by default.",
    "Cannot create verified facts, write DNA, authorize deadlines, or authorize official filings automatically.",
    "Must carry source metadata marking OCR-derived origin, quality status, and warnings.",
  ];

  const smartTalkHandoffPlanEvidence: string[] = [
    "Handoff deferred to future phase; requires quality usable or medium-with-warning; text-only payload; raw image excluded.",
    "Source marked OCR-derived; text marked untrusted; quality summary and OCR warnings included; privacy/legal disclaimers required.",
    "Evidence gates and hallucination traps still required; exact legal deadlines, binding legal advice, and official filing generation remain blocked; model output remains untrusted.",
  ];

  const errorTimeoutRateLimitEvidence: string[] = [
    `Timeout ${FUTURE_OCR_TIMEOUT_MS}ms required; maxRetries ${FUTURE_OCR_MAX_RETRIES}; no infinite retries.`,
    "Existing Smart Talk rate limiter should remain applied initially; provider errors, malformed output, oversized output, and empty extraction all fail closed.",
    "Partial failure returns no verified claims; user messages must be safe and non-legal.",
  ];

  const regressionTestMatrixEvidence: string[] = [
    `Planned regression matrix: disabled env variants=${DISABLED_ENV_VARIANTS_PLANNED}, happy path synthetic=${ENABLED_HAPPY_PATH_PLANNED}, unsafe guards=${UNSAFE_GUARD_CASES_PLANNED}, quality evaluator=${QUALITY_EVALUATOR_CASES_PLANNED}, trust boundary=${TRUST_BOUNDARY_CASES_PLANNED}, handoff blocks=${HANDOFF_BLOCK_CASES_PLANNED}, tamper cases=${TAMPER_CASES_PLANNED}.`,
    `Total planned API/regression cases (excluding closure tamper self-tests): ${TOTAL_PLANNED_REGRESSION_CASES}.`,
    `All ${REQUIRED_REGRESSION_CASE_LABELS.length} required case labels are included in plannedCaseLabels.`,
  ];

  const manualMobileBrowserTestEvidence: string[] = [
    "Manual mobile/browser test plan defined but not performed in this phase.",
    "Synthetic image first; real document only after synthetic pass; Android Chrome and desktop Chrome required later.",
    "Network inspection, user disclosure visual check, low-quality warning visual check, no-persistence evidence, and cleanup all required in future manual execution.",
  ];

  const rollbackDisableEvidence: string[] = [
    "Single env kill-switch SMART_TALK_REAL_OCR_EXTRACTION_ENABLED; disabling flag stops real OCR immediately with fail-closed disabled response.",
    "Placeholder mode, text document mode, and free QA unaffected; no DB rollback or storage cleanup needed because first runtime has no persistence.",
  ];

  const futureFilePlanEvidence: string[] = [
    `Future runtime patch files planned: ${REQUIRED_FUTURE_RUNTIME_PATCH_FILES.join(", ")}.`,
    `Future audit files planned (${REQUIRED_FUTURE_AUDIT_FILES.length}): ${REQUIRED_FUTURE_AUDIT_FILES.join(", ")}.`,
    "Only run-real-ocr-extraction-implementation-plan.ts created now; existingFilesModifiedNow is empty.",
  ];

  const nonGoLiveSafetyVerdictEvidence: string[] = [
    "implementationPlanComplete true; readyForMinimalRealOcrRuntimePatch true when sources accepted.",
    "realOcrRuntimeStillNotImplemented true; realOcrStillNotUsableByUsers true.",
    "publicRuntimeStillBlocked true; productionStillUnauthorized true; goLiveStillUnauthorized true; readyForProduction/goLive false.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This plan file performed zero browser/dev-server/API/fetch/OpenAI invocations.",
    "No OCR provider/library was selected, installed, or imported; no OCR extraction occurred.",
    "No real image or image bytes were read; no persistence/DB/Supabase/DNA writes occurred.",
    "No public runtime, production, go-live, or paid document mode authorization occurred.",
    "8.3AC was not run; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "implementationPlanOnly true; realOcrExtractionImplementationPlanOnly true.",
    "routeModifiedNow/uiModifiedNow/packageModifiedNow/configModifiedNow/envModifiedNow all false.",
    "readyForRealOcrExtractionImplementation false; readyForRealOcrExtraction false; readyForOcrLibraryRuntimeUse false.",
    "readyForPhotoOcrPublicRuntime false; readyForProduction false; readyForGoLive false.",
  ];

  const evidenceLimitations = [...REQUIRED_EVIDENCE_LIMITATIONS];

  const notes: string[] = [
    "IP-01: 8.11B is an implementation-plan-only phase. No OCR runtime, no route/UI patch, no dependency addition, no live testing.",
    `IP-02: source chain — 8.11A checkId=${a.checkId}, allPassed=${a.allPassed}, readyForRealOcrExtractionImplementationPlan=${a.readyForRealOcrExtractionImplementationPlan}; 8.10J/8.9N acceptance derived from 8.11A fields.`,
    "IP-03: per rate-limit-aware strategy, only 8.11A is called directly; 8.10D/8.10E/8.10F route-invoking closures are not re-invoked independently.",
    "IP-04: first recommended OCR provider category is local_js_ocr (server-side in-process adapter); external OCR SaaS deferred.",
    "IP-05: future request uses multipart/form-data for real image byte upload; placeholder metadata-only contract remains unchanged.",
    "IP-06: OCR timeout 15s, maxRetries 0 — conservative fail-closed first runtime.",
    "IP-07: readyForMinimalRealOcrRuntimePatch true — next phase may begin 8.11C minimal patch planning/audit only when explicitly authorized.",
    "IP-08: readyForRealOcrExtractionImplementation remains false — this plan does not authorize implementation.",
    "IP-09: next recommended phase is 8.11C — Minimal Real OCR Runtime Patch.",
    "IP-10: this plan does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = REAL_OCR_EXTRACTION_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: RealOcrExtractionImplementationPlanResult = {
    checkId: "8.11B",
    allPassed: true,
    implementationPlanOnly: true,
    realOcrExtractionImplementationPlanOnly: true,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    packageModifiedNow: false,
    configModifiedNow: false,
    envModifiedNow: false,
    browserInvokedByPlan: false,
    devServerStartedByPlan: false,
    localApiInvokedByPlan: false,
    externalNetworkCalled: false,
    openAiCalled: false,
    fetchCalled: false,
    realImageUsedByPlan: false,
    imageBytesReadByPlan: false,
    ocrLibraryImported: false,
    ocrDependencyAdded: false,
    ocrProviderSelectedForRuntimeNow: false,
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
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceRealOcrGateDesignCommit: "ead0f0c",
    sourcePhotoOcrInternalReadinessCommit: "a306243",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceRealOcrGateDesignAccepted,
    sourcePhotoOcrInternalReadinessAccepted,
    sourceTextDocumentInternalReadinessAccepted,
    sourceRealOcrGateDesigned,
    sourceRealOcrGateDesignClosed,
    sourceReadyForRealOcrExtractionImplementationPlan,
    sourceReadyForRealOcrExtractionImplementation: false,
    sourceReadyForRealOcrExtraction: false,
    sourceReadyForPhotoOcrPublicRuntime: false,
    sourceReadyForProduction: false,
    sourceReadyForGoLive: false,

    realOcrExtractionImplementationPlanCreated: planReady,
    realOcrExtractionImplementationPlanClosed: planReady,
    readyForMinimalRealOcrRuntimePatch: planReady,
    readyForRealOcrExtractionImplementation: false,
    readyForRealOcrExtraction: false,
    readyForOcrLibraryRuntimeUse: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11C",
    recommendedNextPhase: "Minimal Real OCR Runtime Patch",

    futureOcrProviderStrategy,
    futureEnvGateStrategy,
    futureApiRoutePatchStrategy,
    futureUiClientStrategy,
    futureOcrExecutionContract,
    futureOcrQualityEvaluatorPlan,
    futureExtractedTextTrustBoundaryPlan,
    futureSmartTalkHandoffPlan,
    futureErrorTimeoutRateLimitPlan,
    futureRegressionTestMatrixPlan,
    futureManualMobileBrowserTestPlan,
    futureRollbackDisablePlan,
    futureFilePlan,
    nonGoLiveSafetyVerdict,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    implementationPlanEvidence,
    providerStrategyEvidence,
    envGateStrategyEvidence,
    apiRoutePatchStrategyEvidence,
    uiClientStrategyEvidence,
    ocrExecutionContractEvidence,
    qualityEvaluatorPlanEvidence,
    extractedTextTrustBoundaryEvidence,
    smartTalkHandoffPlanEvidence,
    errorTimeoutRateLimitEvidence,
    regressionTestMatrixEvidence,
    manualMobileBrowserTestEvidence,
    rollbackDisableEvidence,
    futureFilePlanEvidence,
    nonGoLiveSafetyVerdictEvidence,
    forbiddenRuntimeEvidence,
    safetyBoundaryEvidence,
    evidenceLimitations,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11C: Minimal Real OCR Runtime Patch — first allowed runtime patch phase; may add OCR dependency only if explicitly authorized in that phase; must remain fail-closed, env-gated, no persistence, no public runtime.",
      "OCR quality evaluator implementation, OCR trust boundary implementation, and OCR-to-Smart-Talk handoff remain separate later phases.",
      "Public runtime, production, and go-live remain unauthorized and explicitly deferred.",
    ],
    notes,
  };

  if (planFailures.length === 0 && !_isCanonicalRealOcrExtractionImplementationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of REAL_OCR_EXTRACTION_IMPLEMENTATION_PLAN_TAMPER_CASES) {
    if (!_isCanonicalRealOcrExtractionImplementationPlanResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11B tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11B tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
  process.argv[1].replace(/\\/g, "/").includes("run-real-ocr-extraction-implementation-plan");

if (invokedDirectly) {
  runRealOcrExtractionImplementationPlan()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
