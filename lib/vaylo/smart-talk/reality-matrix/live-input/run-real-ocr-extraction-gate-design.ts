/**
 * PHASE 8.11A — Real OCR Extraction Gate Design
 *
 * Design-only. Designs the future safety gate that will govern real OCR
 * extraction if and when it is ever implemented. This file does NOT create
 * any OCR runtime behavior, does NOT select or import an OCR library, does
 * NOT add any dependency, does NOT read real images or image bytes, does NOT
 * call a model, and does NOT authorize public runtime, production, or
 * go-live. It only concludes that the system is ready to create a Real OCR
 * Extraction IMPLEMENTATION PLAN in the next phase (8.11B) — it does not
 * authorize implementation itself.
 *
 * This file does NOT open a browser, does NOT start a dev server, does NOT
 * call fetch/route handlers/OpenAI, does NOT touch DB/storage/DNA, and does
 * NOT run 8.3AC or touch tmp-8-3ac-live-metadata.ts.
 */

import { runPhotoOcrInternalReadinessClosure } from "./run-photo-ocr-internal-readiness-closure";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

/**
 * NOTE on source-of-truth calling strategy (rate-limit-aware, per 8.10H/
 * 8.10I/8.10J precedent):
 *
 * This design file's own code performs zero direct route/fetch/browser/dev-
 * server invocations — it only imports and calls two already-committed pure
 * functions:
 *   - runPhotoOcrInternalReadinessClosure (8.10J), the primary source of
 *     truth, which already consolidates 8.10A-8.10I and 8.9N evidence. 8.10J
 *     itself calls only 8.10C (zero route calls) and 8.10I (whose deep
 *     source chain re-validates 8.10D/8.10E/8.10F/8.10G/8.10H/8.9N
 *     internally). Calling 8.10J here performs exactly the same total
 *     in-process route invocations as calling 8.10I alone — a bound already
 *     independently verified safe and repeatable in 8.10J's own validation.
 *   - runTextDocumentModeInternalReadinessClosure (8.9N), the optional
 *     supporting source, which performs zero route invocations of its own
 *     (it only consolidates already-closed 8.9K/8.9L/8.9M evidence).
 *
 * No 8.10D/8.10E/8.10F route-invoking closures are re-invoked independently
 * by this file. This phase is design-only and does not perform any new local
 * API invocation of its own.
 */

// ─── Gate design structure types ───────────────────────────────────────────

interface RawImageInputGate {
  rawImageIsSensitive: true;
  rawImageIsUntrusted: true;
  rawImageMustNotBePersistedByDefault: true;
  rawImageMustNotBeSentDirectlyToModel: true;
  rawImageMustNotReachDocumentReasoningDirectly: true;
  allowedMimeTypesFutureDesign: string[];
  blockedMimeTypesFutureDesign: string[];
  maxFileSizeFutureDesignBytes: number;
  maxPageCountFutureDesign: number;
  multiplePagesStillBlocked: true;
  handwrittenTextStillBlocked: true;
  realDocumentsStillSafetyGated: true;
}

interface OcrExecutionGate {
  disabledByDefault: true;
  exactLowercaseTrueEnvRequiredForFutureRuntime: true;
  proposedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
  existingPhotoOcrPlaceholderEnvFlagMustNotAuthorizeRealOcr: true;
  uiSelectionAloneMustNotTriggerOcr: true;
  explicitInternalActionRequired: true;
  publicRuntimeStillBlocked: true;
  productionStillUnauthorized: true;
  goLiveStillUnauthorized: true;
  noPersistenceDuringFirstRuntime: true;
  noDbStorageDuringFirstRuntime: true;
  noSupabaseStorageDuringFirstRuntime: true;
  noVayloDnaWriteDuringFirstRuntime: true;
  noPaidDocumentModeDuringFirstRuntime: true;
  modelCallMustRemainSeparatedFromOcrExtraction: true;
  ocrProviderOutputMustBeUntrusted: true;
}

interface ExtractedTextGate {
  extractedTextIsDerived: true;
  extractedTextIsUntrusted: true;
  extractedTextMayContainPii: true;
  extractedTextMustBeTreatedAsSensitive: true;
  extractedTextMustNotBePersistedByDefault: true;
  extractedTextMustNotCreateVerifiedFactsAutomatically: true;
  extractedTextMustNotWriteToDnaAutomatically: true;
  extractedTextMustNotCreateLegalDeadlineAutomatically: true;
  extractedTextMustNotCreateOfficialFilingAutomatically: true;
  extractedTextRequiresQualityGateBeforeReasoning: true;
  extractedTextRequiresPrivacyDisclaimer: true;
  extractedTextRequiresLegalDisclaimer: true;
}

interface OcrQualityGate {
  qualityGateRequiredBeforeSmartTalkHandoff: true;
  minExtractedTextLengthFutureDesign: number;
  maxExtractedTextLengthFutureDesign: number;
  requiredQualitySignals: string[];
  blockingQualitySignals: string[];
  downgradeQualitySignals: string[];
}

interface SmartTalkHandoffGate {
  handoffRequiresQualityPass: true;
  handoffPayloadMustBeTextOnly: true;
  rawImageMustNotBeIncludedInHandoff: true;
  handoffMustMarkSourceAsOcrDerived: true;
  handoffMustMarkTextAsUntrusted: true;
  handoffMustIncludeQualitySummary: true;
  handoffMustIncludeOcrWarnings: true;
  smartTalkMustNotTreatOcrAsVerifiedDocumentTruth: true;
  evidenceGatesStillRequired: true;
  hallucinationTrapsStillRequired: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingGenerationStillBlocked: true;
  modelOutputStillUntrusted: true;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
}

interface UserFacingDisclosureGate {
  userMustBeToldOcrMayBeWrong: true;
  userMustBeToldImageIsNotSavedByDefault: true;
  userMustBeToldNotLegalAdvice: true;
  userMustBeToldToCheckOriginalDocument: true;
  userMustBeWarnedWhenQualityLow: true;
  userMustBeWarnedWhenDeadlineDetectedFromOcr: true;
  userMustBeWarnedWhenImportantNumbersDetectedFromOcr: true;
  userMustBeWarnedWhenNamesAddressesAmountsDetectedFromOcr: true;
}

interface ProposedFutureRuntimeContract {
  mode: "photo_ocr_real_extraction_controlled_runtime";
  context: "anonymous";
  sourceKind: "single_image_ocr";
  inputMeta: {
    mimeType: string;
    sizeBytes: number;
    pageCount: number;
  };
  ocrResult: {
    extractedText: string;
    confidence: number;
    languageHints: string[];
    warnings: string[];
  };
  quality: {
    status: "usable" | "downgraded" | "blocked";
    blockingReasons: string[];
    downgradeReasons: string[];
    usableForSmartTalk: boolean;
  };
  safety: {
    noPersistence: boolean;
    noStorage: boolean;
    noDnaWrite: boolean;
    modelCallPerformed: boolean;
  };
  handoff: {
    allowed: boolean;
    reason: string;
    sourceMarkedOcrDerived: boolean;
    textMarkedUntrusted: boolean;
  };
  disclaimers: {
    privacyDisclaimerRequired: boolean;
    legalDisclaimerRequired: boolean;
  };
  readiness: {
    publicRuntimeStillBlocked: boolean;
    productionAuthorizedNow: boolean;
    goLiveAuthorizedNow: boolean;
  };
}

// ─── Result type ────────────────────────────────────────────────────────────

interface RealOcrExtractionGateDesignResult {
  checkId: "8.11A";
  allPassed: boolean;
  designOnly: true;
  realOcrExtractionGateDesignOnly: true;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  browserInvokedByDesign: false;
  devServerStartedByDesign: false;
  localApiInvokedByDesign: false;
  externalNetworkCalled: false;
  openAiCalled: false;
  fetchCalled: false;
  realImageUsedByDesign: false;
  imageBytesReadByDesign: false;
  ocrLibraryImported: false;
  ocrDependencyAdded: false;
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

  sourcePhotoOcrInternalReadinessCommit: "a306243";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourcePhotoOcrInternalReadinessAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;
  sourcePhotoOcrPlaceholderReady: boolean;
  sourceRealOcrExtractionStillBlocked: true;
  sourceReadyForRealOcrExtractionGateDesign: boolean;
  sourceReadyForRealOcrExtractionImplementation: false;
  sourceReadyForPhotoOcrPublicRuntime: false;
  sourceReadyForProduction: false;
  sourceReadyForGoLive: false;

  realOcrExtractionGateDesigned: boolean;
  realOcrExtractionGateDesignClosed: boolean;
  readyForRealOcrExtractionImplementationPlan: boolean;
  readyForRealOcrExtractionImplementation: false;
  readyForRealOcrExtraction: false;
  readyForOcrLibrarySelection: false;
  readyForOcrRuntimePatch: false;
  readyForOcrQualityEvaluatorImplementation: false;
  readyForOcrTrustBoundaryImplementation: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11B";
  recommendedNextPhase: "Real OCR Extraction Implementation Plan";

  rawImageInputGate: RawImageInputGate;
  ocrExecutionGate: OcrExecutionGate;
  extractedTextGate: ExtractedTextGate;
  ocrQualityGate: OcrQualityGate;
  smartTalkHandoffGate: SmartTalkHandoffGate;
  userFacingDisclosureGate: UserFacingDisclosureGate;
  forbiddenBehaviors: string[];
  proposedFutureRuntimeContract: ProposedFutureRuntimeContract;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  gateDesignEvidence: string[];
  rawImageInputGateEvidence: string[];
  ocrExecutionGateEvidence: string[];
  extractedTextGateEvidence: string[];
  ocrQualityGateEvidence: string[];
  smartTalkHandoffGateEvidence: string[];
  userFacingDisclosureGateEvidence: string[];
  forbiddenBehaviorEvidence: string[];
  futureRuntimeContractEvidence: string[];
  safetyBoundaryEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const REQUIRED_BLOCKED_MIME_TYPES = ["application/pdf", "image/svg+xml", "text/plain", "application/json"];

const REQUIRED_REQUIRED_QUALITY_SIGNALS = [
  "extractedTextPresent",
  "extractedTextLengthWithinBounds",
  "supportedMimeType",
  "singlePageOnly",
  "noPersistence",
  "noModelCallDuringExtraction",
  "userPrivacyWarningAvailable",
  "legalDisclaimerAvailable",
];

const REQUIRED_BLOCKING_QUALITY_SIGNALS = [
  "emptyExtraction",
  "unsupportedMimeType",
  "fileTooLarge",
  "multiplePages",
  "suspectedHandwriting",
  "extractionTimeout",
  "ocrProviderError",
  "unsafeRealDocumentMode",
  "publicRuntimeAttempt",
  "persistenceAttempt",
  "dbStorageAttempt",
  "dnaWriteAttempt",
];

const REQUIRED_DOWNGRADE_QUALITY_SIGNALS = [
  "lowConfidence",
  "blurryImage",
  "rotatedImage",
  "partialCrop",
  "multipleLanguagesDetected",
  "unknownLanguage",
  "tableHeavyDocument",
  "tinyPrint",
  "noisyBackground",
  "screenshotLikeInput",
  "possibleMissingPage",
];

const REQUIRED_FORBIDDEN_BEHAVIORS = [
  "noRealOcrWithoutDedicatedFlag",
  "noRealOcrFromPlaceholderFlag",
  "noOcrOnPublicRuntime",
  "noOcrPersistenceByDefault",
  "noRawImageStorage",
  "noProcessedImageStorage",
  "noExtractedTextStorage",
  "noDnaWrites",
  "noAutomaticVerifiedFacts",
  "noAutomaticLegalDeadlines",
  "noBindingLegalAdvice",
  "noOfficialFilingGeneration",
  "noModelCallDuringPureOcrExtraction",
  "noImageBytesToModel",
  "noTrustingOcrOutputAsGroundTruth",
  "noGoLiveAuthorization",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase is design-only.",
  "No OCR library was selected.",
  "No OCR dependency was added.",
  "No OCR runtime was implemented.",
  "No real images were read.",
  "No image bytes were processed.",
  "No OCR extraction was performed.",
  "No model call was performed.",
  "No browser/dev server/API was invoked.",
  "Real OCR quality was not measured.",
  "OCR trust boundary was designed but not implemented.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Real OCR extraction implementation plan not created",
  "OCR library/provider not selected",
  "OCR runtime not implemented",
  "OCR quality evaluator not implemented",
  "OCR confidence scoring not validated",
  "OCR trust boundary not implemented",
  "OCR-to-Smart-Talk handoff not implemented",
  "real image/mobile tests not performed",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalRealOcrExtractionGateDesignResult(r: RealOcrExtractionGateDesignResult): boolean {
  if (r.checkId !== "8.11A") return false;
  if (r.allPassed !== true) return false;
  if (r.designOnly !== true) return false;
  if (r.realOcrExtractionGateDesignOnly !== true) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.browserInvokedByDesign !== false) return false;
  if (r.devServerStartedByDesign !== false) return false;
  if (r.localApiInvokedByDesign !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.fetchCalled !== false) return false;
  if (r.realImageUsedByDesign !== false) return false;
  if (r.imageBytesReadByDesign !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrDependencyAdded !== false) return false;
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

  if (r.sourcePhotoOcrInternalReadinessCommit !== "a306243") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourcePhotoOcrInternalReadinessAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;
  if (r.sourcePhotoOcrPlaceholderReady !== true) return false;
  if (r.sourceRealOcrExtractionStillBlocked !== true) return false;
  if (r.sourceReadyForRealOcrExtractionGateDesign !== true) return false;
  if (r.sourceReadyForRealOcrExtractionImplementation !== false) return false;
  if (r.sourceReadyForPhotoOcrPublicRuntime !== false) return false;
  if (r.sourceReadyForProduction !== false) return false;
  if (r.sourceReadyForGoLive !== false) return false;

  if (r.realOcrExtractionGateDesigned !== true) return false;
  if (r.realOcrExtractionGateDesignClosed !== true) return false;
  if (r.readyForRealOcrExtractionImplementationPlan !== true) return false;
  if (r.readyForRealOcrExtractionImplementation !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForOcrLibrarySelection !== false) return false;
  if (r.readyForOcrRuntimePatch !== false) return false;
  if (r.readyForOcrQualityEvaluatorImplementation !== false) return false;
  if (r.readyForOcrTrustBoundaryImplementation !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11B") return false;
  if (r.recommendedNextPhase !== "Real OCR Extraction Implementation Plan") return false;

  // rawImageInputGate
  const rig = r.rawImageInputGate;
  if (!rig || rig.rawImageIsSensitive !== true) return false;
  if (rig.rawImageIsUntrusted !== true) return false;
  if (rig.rawImageMustNotBePersistedByDefault !== true) return false;
  if (rig.rawImageMustNotBeSentDirectlyToModel !== true) return false;
  if (rig.rawImageMustNotReachDocumentReasoningDirectly !== true) return false;
  if (rig.allowedMimeTypesFutureDesign.length !== REQUIRED_ALLOWED_MIME_TYPES.length) return false;
  for (const m of REQUIRED_ALLOWED_MIME_TYPES) if (!rig.allowedMimeTypesFutureDesign.includes(m)) return false;
  for (const m of REQUIRED_BLOCKED_MIME_TYPES) if (!rig.blockedMimeTypesFutureDesign.includes(m)) return false;
  if (!(rig.maxFileSizeFutureDesignBytes > 0)) return false;
  if (rig.maxPageCountFutureDesign !== 1) return false;
  if (rig.multiplePagesStillBlocked !== true) return false;
  if (rig.handwrittenTextStillBlocked !== true) return false;
  if (rig.realDocumentsStillSafetyGated !== true) return false;

  // ocrExecutionGate
  const oeg = r.ocrExecutionGate;
  if (!oeg || oeg.disabledByDefault !== true) return false;
  if (oeg.exactLowercaseTrueEnvRequiredForFutureRuntime !== true) return false;
  if (oeg.proposedEnvFlag !== "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED") return false;
  if (oeg.existingPhotoOcrPlaceholderEnvFlagMustNotAuthorizeRealOcr !== true) return false;
  if (oeg.uiSelectionAloneMustNotTriggerOcr !== true) return false;
  if (oeg.explicitInternalActionRequired !== true) return false;
  if (oeg.publicRuntimeStillBlocked !== true) return false;
  if (oeg.productionStillUnauthorized !== true) return false;
  if (oeg.goLiveStillUnauthorized !== true) return false;
  if (oeg.noPersistenceDuringFirstRuntime !== true) return false;
  if (oeg.noDbStorageDuringFirstRuntime !== true) return false;
  if (oeg.noSupabaseStorageDuringFirstRuntime !== true) return false;
  if (oeg.noVayloDnaWriteDuringFirstRuntime !== true) return false;
  if (oeg.noPaidDocumentModeDuringFirstRuntime !== true) return false;
  if (oeg.modelCallMustRemainSeparatedFromOcrExtraction !== true) return false;
  if (oeg.ocrProviderOutputMustBeUntrusted !== true) return false;

  // extractedTextGate
  const etg = r.extractedTextGate;
  if (!etg || etg.extractedTextIsDerived !== true) return false;
  if (etg.extractedTextIsUntrusted !== true) return false;
  if (etg.extractedTextMayContainPii !== true) return false;
  if (etg.extractedTextMustBeTreatedAsSensitive !== true) return false;
  if (etg.extractedTextMustNotBePersistedByDefault !== true) return false;
  if (etg.extractedTextMustNotCreateVerifiedFactsAutomatically !== true) return false;
  if (etg.extractedTextMustNotWriteToDnaAutomatically !== true) return false;
  if (etg.extractedTextMustNotCreateLegalDeadlineAutomatically !== true) return false;
  if (etg.extractedTextMustNotCreateOfficialFilingAutomatically !== true) return false;
  if (etg.extractedTextRequiresQualityGateBeforeReasoning !== true) return false;
  if (etg.extractedTextRequiresPrivacyDisclaimer !== true) return false;
  if (etg.extractedTextRequiresLegalDisclaimer !== true) return false;

  // ocrQualityGate
  const oqg = r.ocrQualityGate;
  if (!oqg || oqg.qualityGateRequiredBeforeSmartTalkHandoff !== true) return false;
  if (!(oqg.minExtractedTextLengthFutureDesign > 0)) return false;
  if (!(oqg.maxExtractedTextLengthFutureDesign > oqg.minExtractedTextLengthFutureDesign)) return false;
  if (oqg.maxExtractedTextLengthFutureDesign > 12_000) return false;
  for (const s of REQUIRED_REQUIRED_QUALITY_SIGNALS) if (!oqg.requiredQualitySignals.includes(s)) return false;
  for (const s of REQUIRED_BLOCKING_QUALITY_SIGNALS) if (!oqg.blockingQualitySignals.includes(s)) return false;
  for (const s of REQUIRED_DOWNGRADE_QUALITY_SIGNALS) if (!oqg.downgradeQualitySignals.includes(s)) return false;

  // smartTalkHandoffGate
  const sthg = r.smartTalkHandoffGate;
  if (!sthg || sthg.handoffRequiresQualityPass !== true) return false;
  if (sthg.handoffPayloadMustBeTextOnly !== true) return false;
  if (sthg.rawImageMustNotBeIncludedInHandoff !== true) return false;
  if (sthg.handoffMustMarkSourceAsOcrDerived !== true) return false;
  if (sthg.handoffMustMarkTextAsUntrusted !== true) return false;
  if (sthg.handoffMustIncludeQualitySummary !== true) return false;
  if (sthg.handoffMustIncludeOcrWarnings !== true) return false;
  if (sthg.smartTalkMustNotTreatOcrAsVerifiedDocumentTruth !== true) return false;
  if (sthg.evidenceGatesStillRequired !== true) return false;
  if (sthg.hallucinationTrapsStillRequired !== true) return false;
  if (sthg.exactLegalDeadlineStillBlocked !== true) return false;
  if (sthg.bindingLegalAdviceStillBlocked !== true) return false;
  if (sthg.officialFilingGenerationStillBlocked !== true) return false;
  if (sthg.modelOutputStillUntrusted !== true) return false;
  if (sthg.privacyDisclaimerRequired !== true) return false;
  if (sthg.legalDisclaimerRequired !== true) return false;

  // userFacingDisclosureGate
  const ufd = r.userFacingDisclosureGate;
  if (!ufd || ufd.userMustBeToldOcrMayBeWrong !== true) return false;
  if (ufd.userMustBeToldImageIsNotSavedByDefault !== true) return false;
  if (ufd.userMustBeToldNotLegalAdvice !== true) return false;
  if (ufd.userMustBeToldToCheckOriginalDocument !== true) return false;
  if (ufd.userMustBeWarnedWhenQualityLow !== true) return false;
  if (ufd.userMustBeWarnedWhenDeadlineDetectedFromOcr !== true) return false;
  if (ufd.userMustBeWarnedWhenImportantNumbersDetectedFromOcr !== true) return false;
  if (ufd.userMustBeWarnedWhenNamesAddressesAmountsDetectedFromOcr !== true) return false;

  // forbiddenBehaviors
  if (r.forbiddenBehaviors.length !== REQUIRED_FORBIDDEN_BEHAVIORS.length) return false;
  for (const b of REQUIRED_FORBIDDEN_BEHAVIORS) if (!r.forbiddenBehaviors.includes(b)) return false;

  // proposedFutureRuntimeContract
  const c = r.proposedFutureRuntimeContract;
  if (!c) return false;
  if (c.mode !== "photo_ocr_real_extraction_controlled_runtime") return false;
  if (c.context !== "anonymous") return false;
  if (c.sourceKind !== "single_image_ocr") return false;
  if (!c.inputMeta) return false;
  if (!c.ocrResult) return false;
  if (!c.quality) return false;
  if (c.safety.modelCallPerformed !== false) return false;
  if (c.safety.noPersistence !== true) return false;
  if (c.safety.noStorage !== true) return false;
  if (c.safety.noDnaWrite !== true) return false;
  if (!c.handoff) return false;
  if (c.handoff.sourceMarkedOcrDerived !== true) return false;
  if (c.handoff.textMarkedUntrusted !== true) return false;
  if (c.disclaimers.privacyDisclaimerRequired !== true) return false;
  if (c.disclaimers.legalDisclaimerRequired !== true) return false;
  if (c.readiness.publicRuntimeStillBlocked !== true) return false;
  if (c.readiness.productionAuthorizedNow !== false) return false;
  if (c.readiness.goLiveAuthorizedNow !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (!Array.isArray(r.sourceEvidence) || r.sourceEvidence.length === 0) return false;
  if (!Array.isArray(r.gateDesignEvidence) || r.gateDesignEvidence.length === 0) return false;
  if (!Array.isArray(r.rawImageInputGateEvidence) || r.rawImageInputGateEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrExecutionGateEvidence) || r.ocrExecutionGateEvidence.length === 0) return false;
  if (!Array.isArray(r.extractedTextGateEvidence) || r.extractedTextGateEvidence.length === 0) return false;
  if (!Array.isArray(r.ocrQualityGateEvidence) || r.ocrQualityGateEvidence.length === 0) return false;
  if (!Array.isArray(r.smartTalkHandoffGateEvidence) || r.smartTalkHandoffGateEvidence.length === 0) return false;
  if (!Array.isArray(r.userFacingDisclosureGateEvidence) || r.userFacingDisclosureGateEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenBehaviorEvidence) || r.forbiddenBehaviorEvidence.length === 0) return false;
  if (!Array.isArray(r.futureRuntimeContractEvidence) || r.futureRuntimeContractEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) if (!r.evidenceLimitations.includes(item)) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) if (!r.remainingBlockers.includes(item)) return false;
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper811AMutation = (r: RealOcrExtractionGateDesignResult) => RealOcrExtractionGateDesignResult;
interface Tamper811ACase {
  label: string;
  mutate: Tamper811AMutation;
}

const REAL_OCR_EXTRACTION_GATE_DESIGN_TAMPER_CASES: Tamper811ACase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11B" as "8.11A" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "designOnly false", mutate: (r) => ({ ...r, designOnly: false as true }) },
  { label: "realOcrExtractionGateDesignOnly false", mutate: (r) => ({ ...r, realOcrExtractionGateDesignOnly: false as true }) },
  { label: "sourcePhotoOcrInternalReadinessAccepted false (source 8.10J not accepted)", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source 8.9N not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourcePhotoOcrInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourcePhotoOcrInternalReadinessCommit: "0000000" as "a306243" }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "ocrDependencyAdded true (OCR dependency added)", mutate: (r) => ({ ...r, ocrDependencyAdded: true as false }) },
  { label: "ocrLibraryImported true (OCR library imported)", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true (OCR extraction performed)", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "realOcrExtractionPerformed true (real OCR extraction performed)", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "imageBytesReadByDesign true (image bytes read)", mutate: (r) => ({ ...r, imageBytesReadByDesign: true as false }) },
  { label: "realImageUsedByDesign true (real image used)", mutate: (r) => ({ ...r, realImageUsedByDesign: true as false }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "fetchCalled true (fetch called)", mutate: (r) => ({ ...r, fetchCalled: true as false }) },
  { label: "externalNetworkCalled true (external network called)", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "openAiCalled true (OpenAI called)", mutate: (r) => ({ ...r, openAiCalled: true as false }) },
  { label: "persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true (paid document mode enabled)", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "rawImageInputGate.rawImageIsSensitive false (raw image not marked sensitive)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, rawImageIsSensitive: false as true } }) },
  { label: "rawImageInputGate.rawImageMustNotBePersistedByDefault false (raw image can be persisted by default)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, rawImageMustNotBePersistedByDefault: false as true } }) },
  { label: "rawImageInputGate.rawImageMustNotBeSentDirectlyToModel false (raw image can be sent directly to model)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, rawImageMustNotBeSentDirectlyToModel: false as true } }) },
  { label: "rawImageInputGate.multiplePagesStillBlocked false (multiple pages allowed in first runtime)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, multiplePagesStillBlocked: false as true } }) },
  { label: "rawImageInputGate.handwrittenTextStillBlocked false (handwriting allowed in first runtime)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, handwrittenTextStillBlocked: false as true } }) },
  { label: "rawImageInputGate.maxPageCountFutureDesign wrong (not 1)", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, maxPageCountFutureDesign: 3 } }) },
  { label: "rawImageInputGate.allowedMimeTypesFutureDesign missing required entries", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, allowedMimeTypesFutureDesign: ["image/png"] } }) },
  { label: "rawImageInputGate.blockedMimeTypesFutureDesign missing required entries", mutate: (r) => ({ ...r, rawImageInputGate: { ...r.rawImageInputGate, blockedMimeTypesFutureDesign: [] } }) },
  { label: "ocrExecutionGate.disabledByDefault false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, disabledByDefault: false as true } }) },
  { label: "ocrExecutionGate.exactLowercaseTrueEnvRequiredForFutureRuntime false (future OCR env does not require exact lowercase true)", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, exactLowercaseTrueEnvRequiredForFutureRuntime: false as true } }) },
  { label: "ocrExecutionGate.existingPhotoOcrPlaceholderEnvFlagMustNotAuthorizeRealOcr false (existing placeholder env flag authorizes real OCR)", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, existingPhotoOcrPlaceholderEnvFlagMustNotAuthorizeRealOcr: false as true } }) },
  { label: "ocrExecutionGate.uiSelectionAloneMustNotTriggerOcr false (UI selection alone triggers OCR)", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, uiSelectionAloneMustNotTriggerOcr: false as true } }) },
  { label: "ocrExecutionGate.publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, publicRuntimeStillBlocked: false as true } }) },
  { label: "ocrExecutionGate.productionStillUnauthorized false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, productionStillUnauthorized: false as true } }) },
  { label: "ocrExecutionGate.goLiveStillUnauthorized false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, goLiveStillUnauthorized: false as true } }) },
  { label: "ocrExecutionGate.noPersistenceDuringFirstRuntime false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, noPersistenceDuringFirstRuntime: false as true } }) },
  { label: "ocrExecutionGate.modelCallMustRemainSeparatedFromOcrExtraction false", mutate: (r) => ({ ...r, ocrExecutionGate: { ...r.ocrExecutionGate, modelCallMustRemainSeparatedFromOcrExtraction: false as true } }) },
  { label: "extractedTextGate.extractedTextIsUntrusted false (extracted text marked trusted)", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextIsUntrusted: false as true } }) },
  { label: "extractedTextGate.extractedTextMustNotCreateVerifiedFactsAutomatically false (extracted text can create verified facts automatically)", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextMustNotCreateVerifiedFactsAutomatically: false as true } }) },
  { label: "extractedTextGate.extractedTextMustNotCreateLegalDeadlineAutomatically false (extracted text can create legal deadlines automatically)", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextMustNotCreateLegalDeadlineAutomatically: false as true } }) },
  { label: "extractedTextGate.extractedTextMustNotCreateOfficialFilingAutomatically false", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextMustNotCreateOfficialFilingAutomatically: false as true } }) },
  { label: "extractedTextGate.extractedTextRequiresQualityGateBeforeReasoning false (quality gate not required before handoff)", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextRequiresQualityGateBeforeReasoning: false as true } }) },
  { label: "extractedTextGate.extractedTextMustNotBePersistedByDefault false", mutate: (r) => ({ ...r, extractedTextGate: { ...r.extractedTextGate, extractedTextMustNotBePersistedByDefault: false as true } }) },
  { label: "ocrQualityGate.qualityGateRequiredBeforeSmartTalkHandoff false (quality gate not required before handoff)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, qualityGateRequiredBeforeSmartTalkHandoff: false as true } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing emptyExtraction (empty extraction not blocking)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "emptyExtraction") } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing unsupportedMimeType (unsupported MIME not blocking)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "unsupportedMimeType") } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing multiplePages (multiple pages allowed in first runtime)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "multiplePages") } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing suspectedHandwriting (handwriting allowed in first runtime)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "suspectedHandwriting") } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing publicRuntimeAttempt", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "publicRuntimeAttempt") } }) },
  { label: "ocrQualityGate.blockingQualitySignals missing persistenceAttempt", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, blockingQualitySignals: r.ocrQualityGate.blockingQualitySignals.filter((s) => s !== "persistenceAttempt") } }) },
  { label: "ocrQualityGate.downgradeQualitySignals missing lowConfidence (low confidence not downgrade signal)", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, downgradeQualitySignals: r.ocrQualityGate.downgradeQualitySignals.filter((s) => s !== "lowConfidence") } }) },
  { label: "ocrQualityGate.requiredQualitySignals missing noPersistence", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, requiredQualitySignals: r.ocrQualityGate.requiredQualitySignals.filter((s) => s !== "noPersistence") } }) },
  { label: "ocrQualityGate.requiredQualitySignals missing noModelCallDuringExtraction", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, requiredQualitySignals: r.ocrQualityGate.requiredQualitySignals.filter((s) => s !== "noModelCallDuringExtraction") } }) },
  { label: "ocrQualityGate.maxExtractedTextLengthFutureDesign exceeds Smart Talk MAX_TEXT bound", mutate: (r) => ({ ...r, ocrQualityGate: { ...r.ocrQualityGate, maxExtractedTextLengthFutureDesign: 50_000 } }) },
  { label: "smartTalkHandoffGate.rawImageMustNotBeIncludedInHandoff false (handoff includes raw image)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, rawImageMustNotBeIncludedInHandoff: false as true } }) },
  { label: "smartTalkHandoffGate.handoffMustMarkTextAsUntrusted false (handoff does not mark OCR text untrusted)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, handoffMustMarkTextAsUntrusted: false as true } }) },
  { label: "smartTalkHandoffGate.handoffRequiresQualityPass false (quality gate not required before handoff)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, handoffRequiresQualityPass: false as true } }) },
  { label: "smartTalkHandoffGate.evidenceGatesStillRequired false (evidence gates bypassed)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, evidenceGatesStillRequired: false as true } }) },
  { label: "smartTalkHandoffGate.hallucinationTrapsStillRequired false (hallucination traps bypassed)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, hallucinationTrapsStillRequired: false as true } }) },
  { label: "smartTalkHandoffGate.exactLegalDeadlineStillBlocked false (exact legal deadline allowed)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, exactLegalDeadlineStillBlocked: false as true } }) },
  { label: "smartTalkHandoffGate.bindingLegalAdviceStillBlocked false (binding legal advice allowed)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, bindingLegalAdviceStillBlocked: false as true } }) },
  { label: "smartTalkHandoffGate.officialFilingGenerationStillBlocked false (official filing generation allowed)", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, officialFilingGenerationStillBlocked: false as true } }) },
  { label: "smartTalkHandoffGate.modelOutputStillUntrusted false", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, modelOutputStillUntrusted: false as true } }) },
  { label: "smartTalkHandoffGate.smartTalkMustNotTreatOcrAsVerifiedDocumentTruth false", mutate: (r) => ({ ...r, smartTalkHandoffGate: { ...r.smartTalkHandoffGate, smartTalkMustNotTreatOcrAsVerifiedDocumentTruth: false as true } }) },
  { label: "userFacingDisclosureGate.userMustBeToldOcrMayBeWrong false (user not warned OCR may be wrong)", mutate: (r) => ({ ...r, userFacingDisclosureGate: { ...r.userFacingDisclosureGate, userMustBeToldOcrMayBeWrong: false as true } }) },
  { label: "userFacingDisclosureGate.userMustBeToldNotLegalAdvice false (user not told not legal advice)", mutate: (r) => ({ ...r, userFacingDisclosureGate: { ...r.userFacingDisclosureGate, userMustBeToldNotLegalAdvice: false as true } }) },
  { label: "userFacingDisclosureGate.userMustBeToldImageIsNotSavedByDefault false", mutate: (r) => ({ ...r, userFacingDisclosureGate: { ...r.userFacingDisclosureGate, userMustBeToldImageIsNotSavedByDefault: false as true } }) },
  { label: "userFacingDisclosureGate.userMustBeWarnedWhenQualityLow false", mutate: (r) => ({ ...r, userFacingDisclosureGate: { ...r.userFacingDisclosureGate, userMustBeWarnedWhenQualityLow: false as true } }) },
  { label: "forbiddenBehaviors list incomplete", mutate: (r) => ({ ...r, forbiddenBehaviors: r.forbiddenBehaviors.slice(0, 5) }) },
  { label: "proposedFutureRuntimeContract.safety.modelCallPerformed true (future runtime contract allows modelCallPerformed true during OCR extraction)", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, safety: { ...r.proposedFutureRuntimeContract.safety, modelCallPerformed: true } } }) },
  { label: "proposedFutureRuntimeContract.safety.noPersistence false (future runtime contract allows persistence)", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, safety: { ...r.proposedFutureRuntimeContract.safety, noPersistence: false } } }) },
  { label: "proposedFutureRuntimeContract.readiness.productionAuthorizedNow true (future runtime contract claims production authorized)", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, readiness: { ...r.proposedFutureRuntimeContract.readiness, productionAuthorizedNow: true } } }) },
  { label: "proposedFutureRuntimeContract.readiness.goLiveAuthorizedNow true (future runtime contract claims go-live authorized)", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, readiness: { ...r.proposedFutureRuntimeContract.readiness, goLiveAuthorizedNow: true } } }) },
  { label: "proposedFutureRuntimeContract.readiness.publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, readiness: { ...r.proposedFutureRuntimeContract.readiness, publicRuntimeStillBlocked: false } } }) },
  { label: "proposedFutureRuntimeContract.handoff.sourceMarkedOcrDerived false", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, handoff: { ...r.proposedFutureRuntimeContract.handoff, sourceMarkedOcrDerived: false } } }) },
  { label: "proposedFutureRuntimeContract.handoff.textMarkedUntrusted false", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, handoff: { ...r.proposedFutureRuntimeContract.handoff, textMarkedUntrusted: false } } }) },
  { label: "proposedFutureRuntimeContract.disclaimers.privacyDisclaimerRequired false", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, disclaimers: { ...r.proposedFutureRuntimeContract.disclaimers, privacyDisclaimerRequired: false } } }) },
  { label: "proposedFutureRuntimeContract.disclaimers.legalDisclaimerRequired false", mutate: (r) => ({ ...r, proposedFutureRuntimeContract: { ...r.proposedFutureRuntimeContract, disclaimers: { ...r.proposedFutureRuntimeContract.disclaimers, legalDisclaimerRequired: false } } }) },
  { label: "readyForRealOcrExtractionImplementationPlan false when gate design closed", mutate: (r) => ({ ...r, readyForRealOcrExtractionImplementationPlan: false }) },
  { label: "readyForRealOcrExtractionImplementation true", mutate: (r) => ({ ...r, readyForRealOcrExtractionImplementation: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true (readyForPublicRuntime true)", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase not 8.11B)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11C" as "8.11B" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Real OCR Extraction Implementation" as "Real OCR Extraction Implementation Plan" }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence emptied", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "gateDesignEvidence emptied", mutate: (r) => ({ ...r, gateDesignEvidence: [] }) },
  { label: "rawImageInputGateEvidence emptied", mutate: (r) => ({ ...r, rawImageInputGateEvidence: [] }) },
  { label: "ocrExecutionGateEvidence emptied", mutate: (r) => ({ ...r, ocrExecutionGateEvidence: [] }) },
  { label: "extractedTextGateEvidence emptied", mutate: (r) => ({ ...r, extractedTextGateEvidence: [] }) },
  { label: "ocrQualityGateEvidence emptied", mutate: (r) => ({ ...r, ocrQualityGateEvidence: [] }) },
  { label: "smartTalkHandoffGateEvidence emptied", mutate: (r) => ({ ...r, smartTalkHandoffGateEvidence: [] }) },
  { label: "userFacingDisclosureGateEvidence emptied", mutate: (r) => ({ ...r, userFacingDisclosureGateEvidence: [] }) },
  { label: "forbiddenBehaviorEvidence emptied", mutate: (r) => ({ ...r, forbiddenBehaviorEvidence: [] }) },
  { label: "futureRuntimeContractEvidence emptied", mutate: (r) => ({ ...r, futureRuntimeContractEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length/content", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "remainingBlockers wrong length/content", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported design runner ─────────────────────────────────────────────────

export async function runRealOcrExtractionGateDesign(): Promise<RealOcrExtractionGateDesignResult> {
  const designFailures: string[] = [];

  // ── Source of truth: 8.10J Photo/OCR internal readiness closure ──────────
  // See calling-strategy note above: this call transitively bounds to the
  // same total in-process route invocations as calling 8.10I alone, already
  // proven rate-limit-safe. This design file's own code performs zero direct
  // route/fetch/browser/dev-server invocations.
  const j = await runPhotoOcrInternalReadinessClosure();
  if (j.checkId !== "8.10J") designFailures.push(`8.10J checkId mismatch: got "${j.checkId}"`);
  if (j.allPassed !== true) designFailures.push("8.10J allPassed is not true");
  if (j.readyForNextPhase !== "8.11A") designFailures.push("8.10J readyForNextPhase is not 8.11A");
  if (j.readyForRealOcrExtractionGateDesign !== true) designFailures.push("8.10J readyForRealOcrExtractionGateDesign is not true");
  if (j.readyForControlledInternalPhotoOcrPlaceholder !== true) designFailures.push("8.10J readyForControlledInternalPhotoOcrPlaceholder is not true");
  if (j.realOcrExtractionStillBlocked !== true) designFailures.push("8.10J realOcrExtractionStillBlocked is not true");
  if (j.readyForRealOcrExtractionImplementation !== false) designFailures.push("8.10J readyForRealOcrExtractionImplementation is not false");
  if (j.readyForPhotoOcrPublicRuntime !== false) designFailures.push("8.10J readyForPhotoOcrPublicRuntime is not false");
  if (j.readyForProduction !== false) designFailures.push("8.10J readyForProduction is not false");
  if (j.readyForGoLive !== false) designFailures.push("8.10J readyForGoLive is not false");
  if (j.tamperRejected !== j.tamperCount) designFailures.push("8.10J own tamper count mismatch");

  const sourcePhotoOcrInternalReadinessAccepted = j.checkId === "8.10J" && j.allPassed === true;

  // ── Optional supporting source: 8.9N Text Document Mode internal readiness
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") designFailures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) designFailures.push("8.9N allPassed is not true");
  if (n.tamperRejected !== n.tamperCount) designFailures.push("8.9N own tamper count mismatch");

  const sourceTextDocumentInternalReadinessAccepted = n.checkId === "8.9N" && n.allPassed === true;

  const sourcePhotoOcrPlaceholderReady =
    sourcePhotoOcrInternalReadinessAccepted &&
    j.readyForControlledInternalPhotoOcrPlaceholder === true &&
    j.readyForPhotoOcrPlaceholderInternalUse === true;
  const sourceReadyForRealOcrExtractionGateDesign = j.readyForRealOcrExtractionGateDesign === true;

  // ── Gate design content ───────────────────────────────────────────────────

  const rawImageInputGate: RawImageInputGate = {
    rawImageIsSensitive: true,
    rawImageIsUntrusted: true,
    rawImageMustNotBePersistedByDefault: true,
    rawImageMustNotBeSentDirectlyToModel: true,
    rawImageMustNotReachDocumentReasoningDirectly: true,
    allowedMimeTypesFutureDesign: [...REQUIRED_ALLOWED_MIME_TYPES],
    blockedMimeTypesFutureDesign: [...REQUIRED_BLOCKED_MIME_TYPES],
    maxFileSizeFutureDesignBytes: 8_388_608,
    maxPageCountFutureDesign: 1,
    multiplePagesStillBlocked: true,
    handwrittenTextStillBlocked: true,
    realDocumentsStillSafetyGated: true,
  };

  const ocrExecutionGate: OcrExecutionGate = {
    disabledByDefault: true,
    exactLowercaseTrueEnvRequiredForFutureRuntime: true,
    proposedEnvFlag: "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED",
    existingPhotoOcrPlaceholderEnvFlagMustNotAuthorizeRealOcr: true,
    uiSelectionAloneMustNotTriggerOcr: true,
    explicitInternalActionRequired: true,
    publicRuntimeStillBlocked: true,
    productionStillUnauthorized: true,
    goLiveStillUnauthorized: true,
    noPersistenceDuringFirstRuntime: true,
    noDbStorageDuringFirstRuntime: true,
    noSupabaseStorageDuringFirstRuntime: true,
    noVayloDnaWriteDuringFirstRuntime: true,
    noPaidDocumentModeDuringFirstRuntime: true,
    modelCallMustRemainSeparatedFromOcrExtraction: true,
    ocrProviderOutputMustBeUntrusted: true,
  };

  const extractedTextGate: ExtractedTextGate = {
    extractedTextIsDerived: true,
    extractedTextIsUntrusted: true,
    extractedTextMayContainPii: true,
    extractedTextMustBeTreatedAsSensitive: true,
    extractedTextMustNotBePersistedByDefault: true,
    extractedTextMustNotCreateVerifiedFactsAutomatically: true,
    extractedTextMustNotWriteToDnaAutomatically: true,
    extractedTextMustNotCreateLegalDeadlineAutomatically: true,
    extractedTextMustNotCreateOfficialFilingAutomatically: true,
    extractedTextRequiresQualityGateBeforeReasoning: true,
    extractedTextRequiresPrivacyDisclaimer: true,
    extractedTextRequiresLegalDisclaimer: true,
  };

  const ocrQualityGate: OcrQualityGate = {
    qualityGateRequiredBeforeSmartTalkHandoff: true,
    minExtractedTextLengthFutureDesign: 8,
    maxExtractedTextLengthFutureDesign: 6_000,
    requiredQualitySignals: [...REQUIRED_REQUIRED_QUALITY_SIGNALS],
    blockingQualitySignals: [...REQUIRED_BLOCKING_QUALITY_SIGNALS],
    downgradeQualitySignals: [...REQUIRED_DOWNGRADE_QUALITY_SIGNALS],
  };

  const smartTalkHandoffGate: SmartTalkHandoffGate = {
    handoffRequiresQualityPass: true,
    handoffPayloadMustBeTextOnly: true,
    rawImageMustNotBeIncludedInHandoff: true,
    handoffMustMarkSourceAsOcrDerived: true,
    handoffMustMarkTextAsUntrusted: true,
    handoffMustIncludeQualitySummary: true,
    handoffMustIncludeOcrWarnings: true,
    smartTalkMustNotTreatOcrAsVerifiedDocumentTruth: true,
    evidenceGatesStillRequired: true,
    hallucinationTrapsStillRequired: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    modelOutputStillUntrusted: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
  };

  const userFacingDisclosureGate: UserFacingDisclosureGate = {
    userMustBeToldOcrMayBeWrong: true,
    userMustBeToldImageIsNotSavedByDefault: true,
    userMustBeToldNotLegalAdvice: true,
    userMustBeToldToCheckOriginalDocument: true,
    userMustBeWarnedWhenQualityLow: true,
    userMustBeWarnedWhenDeadlineDetectedFromOcr: true,
    userMustBeWarnedWhenImportantNumbersDetectedFromOcr: true,
    userMustBeWarnedWhenNamesAddressesAmountsDetectedFromOcr: true,
  };

  const forbiddenBehaviors: string[] = [...REQUIRED_FORBIDDEN_BEHAVIORS];

  const proposedFutureRuntimeContract: ProposedFutureRuntimeContract = {
    mode: "photo_ocr_real_extraction_controlled_runtime",
    context: "anonymous",
    sourceKind: "single_image_ocr",
    inputMeta: {
      mimeType: "image/png",
      sizeBytes: 0,
      pageCount: 1,
    },
    ocrResult: {
      extractedText: "",
      confidence: 0,
      languageHints: [],
      warnings: [],
    },
    quality: {
      status: "blocked",
      blockingReasons: [],
      downgradeReasons: [],
      usableForSmartTalk: false,
    },
    safety: {
      noPersistence: true,
      noStorage: true,
      noDnaWrite: true,
      modelCallPerformed: false,
    },
    handoff: {
      allowed: false,
      reason: "design-only placeholder instance — not a live runtime payload",
      sourceMarkedOcrDerived: true,
      textMarkedUntrusted: true,
    },
    disclaimers: {
      privacyDisclaimerRequired: true,
      legalDisclaimerRequired: true,
    },
    readiness: {
      publicRuntimeStillBlocked: true,
      productionAuthorizedNow: false,
      goLiveAuthorizedNow: false,
    },
  };

  const sourceEvidence: string[] = [
    "8.10J Photo/OCR internal readiness closure accepted (commit a306243) — readyForControlledInternalPhotoOcrPlaceholder true, readyForRealOcrExtractionGateDesign true, realOcrExtractionStillBlocked true.",
    "8.9N Text Document Mode internal readiness closure accepted (commit 3cf81c1) — used only as cross-feature supporting context, not as an OCR-specific prerequisite.",
    "8.10J itself already consolidates 8.10A through 8.10I evidence; this phase does not re-derive that evidence independently.",
    "Neither source call performed a new local API invocation directly from this design file's own code; 8.10J's deep source chain re-validates the already-committed 8.10D/8.10E/8.10F/8.10G/8.10H evidence internally, bounded to the same route-invocation count as calling 8.10I alone.",
  ];

  const gateDesignEvidence: string[] = [
    "Five concepts are explicitly separated and independently gated: raw image input, OCR extraction process, extracted OCR text, OCR quality/confidence layer, and Smart Talk document reasoning handoff.",
    "Each gate is expressed as a structured, typed design object (rawImageInputGate, ocrExecutionGate, extractedTextGate, ocrQualityGate, smartTalkHandoffGate, userFacingDisclosureGate) plus an explicit forbiddenBehaviors enumeration and a proposedFutureRuntimeContract design-only sample shape.",
    "No gate authorizes real OCR extraction, model calls during extraction, persistence, storage, DNA writes, paid mode, public runtime, production, or go-live.",
    "The gate design is internally consistent with the already-closed Photo/OCR placeholder contract (8.10A-8.10J): the same StillBlocked/disclaimer vocabulary is reused so the future real-OCR runtime can extend rather than replace the placeholder safety contract.",
  ];

  const rawImageInputGateEvidence: string[] = [
    "Raw image bytes are explicitly designed as sensitive, untrusted, non-persisted-by-default, and never sent directly to a model or document-reasoning step.",
    `Allowed MIME types are restricted to ${REQUIRED_ALLOWED_MIME_TYPES.join(", ")}; PDFs, SVGs, plain text, and JSON are explicitly blocked to prevent format-confusion or embedded-script/script-injection surface area.`,
    "Max file size is conservatively set to 8 MiB (8,388,608 bytes) — large enough for a typical modern phone photo at reasonable compression, while bounding worst-case memory/processing cost and aligning with common mobile upload limits; this is a first-iteration ceiling, not a final production limit.",
    "First real-OCR iteration is restricted to exactly 1 page; multiple pages and handwritten text remain explicitly blocked until later, separately authorized phases.",
  ];

  const ocrExecutionGateEvidence: string[] = [
    "Real OCR execution is disabled by default and requires a new, dedicated env flag (SMART_TALK_REAL_OCR_EXTRACTION_ENABLED) checked for an exact lowercase \"true\" match — the existing Photo/OCR placeholder flag (SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED) must never authorize real OCR.",
    "UI selection alone (e.g. picking a photo) must never trigger OCR; an explicit, separate internal action is required, mirroring the already-accepted 8.10E/8.10I contract pattern.",
    "During any first real-OCR runtime, persistence, DB writes, Supabase storage writes, Vaylo DNA writes, and paid document mode all remain explicitly blocked, matching the already-closed placeholder safety contract.",
    "The model call step (Smart Talk reasoning) must remain architecturally separated from the OCR extraction step; OCR provider output is treated as untrusted input, not as a trusted intermediate result.",
  ];

  const extractedTextGateEvidence: string[] = [
    "Extracted OCR text is explicitly designed as derived, untrusted, potentially containing PII, and sensitive — never treated as verified document truth.",
    "Extracted text must not be persisted by default, must not automatically write to Vaylo DNA, and must not automatically create legal deadlines or official filings without independent evidence gates.",
    "Extracted text requires passing the OCR quality gate before it may reach Smart Talk document reasoning, and always carries privacy and legal disclaimer requirements.",
  ];

  const ocrQualityGateEvidence: string[] = [
    "A quality/confidence gate is required before any Smart Talk handoff; it classifies extraction quality and can block or downgrade interpretation.",
    `Extracted text length bounds are set conservatively: minimum ${ocrQualityGate.minExtractedTextLengthFutureDesign} characters (filters near-empty/noise extractions) and maximum ${ocrQualityGate.maxExtractedTextLengthFutureDesign} characters — tighter than the existing Smart Talk MAX_TEXT ceiling of 12,000 characters, reflecting a conservative first-pass OCR ceiling until real-world extraction volume is validated.`,
    `Blocking quality signals (${REQUIRED_BLOCKING_QUALITY_SIGNALS.length} total) hard-block interpretation: ${REQUIRED_BLOCKING_QUALITY_SIGNALS.join(", ")}.`,
    `Downgrade quality signals (${REQUIRED_DOWNGRADE_QUALITY_SIGNALS.length} total) trigger explicit uncertainty warnings rather than a hard block: ${REQUIRED_DOWNGRADE_QUALITY_SIGNALS.join(", ")}.`,
    `Required quality signals (${REQUIRED_REQUIRED_QUALITY_SIGNALS.length} total) must all be satisfied before handoff: ${REQUIRED_REQUIRED_QUALITY_SIGNALS.join(", ")}.`,
  ];

  const smartTalkHandoffGateEvidence: string[] = [
    "OCR text may only be handed off to Smart Talk document reasoning after passing the quality gate, and the handoff payload must be text-only — the raw image must never be included in the handoff.",
    "The handoff must explicitly mark the source as OCR-derived and the text as untrusted, and must include a quality summary and any OCR warnings so downstream reasoning and the user both see the uncertainty.",
    "Smart Talk document reasoning must not treat OCR text as verified document truth; existing evidence gates and hallucination traps remain fully required, and exact legal deadlines, binding legal advice, and official filing generation all remain blocked.",
  ];

  const userFacingDisclosureGateEvidence: string[] = [
    "Users must always be told OCR may be wrong, that their image is not saved by default, that this is not legal advice, and that they should check the original document.",
    "Users must be explicitly warned whenever extraction quality is low, or whenever a deadline, important number, name, address, or amount is detected from OCR text — since these are the highest-risk categories for OCR misreads.",
  ];

  const forbiddenBehaviorEvidence: string[] = [
    `All ${REQUIRED_FORBIDDEN_BEHAVIORS.length} forbidden behaviors are explicitly enumerated: ${REQUIRED_FORBIDDEN_BEHAVIORS.join(", ")}.`,
    "These forbidden behaviors apply to any future real OCR extraction runtime and remain in force until explicitly and separately re-authorized in a later, dedicated phase.",
  ];

  const futureRuntimeContractEvidence: string[] = [
    "The proposedFutureRuntimeContract is design data only — a sample shape/instance illustrating the future JSON contract, not a runtime implementation or a live response.",
    "The sample instance explicitly keeps safety.modelCallPerformed false, safety.noPersistence/noStorage/noDnaWrite true, readiness.publicRuntimeStillBlocked true, and readiness.productionAuthorizedNow/goLiveAuthorizedNow false.",
    "The contract mirrors the field vocabulary already used in the accepted Photo/OCR placeholder contract (mode, context, safety/readiness StillBlocked flags) so a future real implementation can extend rather than diverge from the existing safety language.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "designOnly true; realOcrExtractionGateDesignOnly true — this phase produced a design artifact only.",
    "No OCR dependency was added, no OCR library was imported, and no OCR engine was called by this file.",
    "No real image, no image bytes, no OCR extraction, and no model call occurred in this design phase.",
    "No persistence, DB write, Supabase storage write, or Vaylo DNA write occurred.",
    "publicRuntimeEnabledNow false; productionAuthorizedNow false; goLiveAuthorizedNow false; paidDocumentModeEnabledNow false.",
    "eightThreeAcNotRun true; tmpEightThreeAcMetadataTouched false.",
  ];

  const readinessVerdict: string[] = [
    "VERDICT: the Real OCR Extraction Gate is fully designed (realOcrExtractionGateDesigned true, realOcrExtractionGateDesignClosed true).",
    "readyForRealOcrExtractionImplementationPlan: true — the system is ready to create an implementation PLAN in the next phase.",
    "readyForRealOcrExtractionImplementation: false; readyForRealOcrExtraction: false; readyForOcrLibrarySelection: false; readyForOcrRuntimePatch: false; readyForOcrQualityEvaluatorImplementation: false; readyForOcrTrustBoundaryImplementation: false.",
    "readyForPhotoOcrPublicRuntime: false; readyForProduction: false; readyForGoLive: false.",
    "Next recommended phase: 8.11B — Real OCR Extraction Implementation Plan (plan-only, still no OCR library selection, no dependency addition, no runtime patch).",
  ];

  const evidenceLimitations = [...REQUIRED_EVIDENCE_LIMITATIONS];

  const notes: string[] = [
    "GD-01: 8.11A is a design-only phase. No OCR runtime behavior, no OCR library/dependency, no real image handling, and no local API/browser/dev-server invocation was performed by this file's own code.",
    `GD-02: source chain — 8.10J checkId=${j.checkId}, allPassed=${j.allPassed}, readyForRealOcrExtractionGateDesign=${j.readyForRealOcrExtractionGateDesign}; 8.9N checkId=${n.checkId}, allPassed=${n.allPassed}.`,
    "GD-03: per the rate-limit-aware strategy established in 8.10H/8.10I/8.10J, this design calls only 8.10J (primary source, bounded to the same route-invocation count as calling 8.10I alone) and 8.9N (zero route invocations of its own) directly — no 8.10D/8.10E/8.10F route-invoking closures are re-invoked independently by this file.",
    "GD-04: five concepts are explicitly separated and gated — raw image input, OCR extraction process, extracted OCR text, OCR quality/confidence layer, and Smart Talk document reasoning handoff.",
    "GD-05: the gate design concludes only that the system is ready to create a Real OCR Extraction IMPLEMENTATION PLAN (8.11B) — it does not authorize OCR implementation, real OCR extraction, public runtime, production, or go-live.",
    "GD-06: next recommended phase is 8.11B — Real OCR Extraction Implementation Plan (plan-only).",
    "GD-07: this design does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = REAL_OCR_EXTRACTION_GATE_DESIGN_TAMPER_CASES.length;

  const gateFullyDesigned =
    designFailures.length === 0 &&
    sourcePhotoOcrInternalReadinessAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    sourcePhotoOcrPlaceholderReady &&
    sourceReadyForRealOcrExtractionGateDesign;

  const provisional: RealOcrExtractionGateDesignResult = {
    checkId: "8.11A",
    allPassed: true,
    designOnly: true,
    realOcrExtractionGateDesignOnly: true,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    browserInvokedByDesign: false,
    devServerStartedByDesign: false,
    localApiInvokedByDesign: false,
    externalNetworkCalled: false,
    openAiCalled: false,
    fetchCalled: false,
    realImageUsedByDesign: false,
    imageBytesReadByDesign: false,
    ocrLibraryImported: false,
    ocrDependencyAdded: false,
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

    sourcePhotoOcrInternalReadinessCommit: "a306243",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourcePhotoOcrInternalReadinessAccepted,
    sourceTextDocumentInternalReadinessAccepted,
    sourcePhotoOcrPlaceholderReady,
    sourceRealOcrExtractionStillBlocked: true,
    sourceReadyForRealOcrExtractionGateDesign,
    sourceReadyForRealOcrExtractionImplementation: false,
    sourceReadyForPhotoOcrPublicRuntime: false,
    sourceReadyForProduction: false,
    sourceReadyForGoLive: false,

    realOcrExtractionGateDesigned: gateFullyDesigned,
    realOcrExtractionGateDesignClosed: gateFullyDesigned,
    readyForRealOcrExtractionImplementationPlan: gateFullyDesigned,
    readyForRealOcrExtractionImplementation: false,
    readyForRealOcrExtraction: false,
    readyForOcrLibrarySelection: false,
    readyForOcrRuntimePatch: false,
    readyForOcrQualityEvaluatorImplementation: false,
    readyForOcrTrustBoundaryImplementation: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11B",
    recommendedNextPhase: "Real OCR Extraction Implementation Plan",

    rawImageInputGate,
    ocrExecutionGate,
    extractedTextGate,
    ocrQualityGate,
    smartTalkHandoffGate,
    userFacingDisclosureGate,
    forbiddenBehaviors,
    proposedFutureRuntimeContract,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    gateDesignEvidence,
    rawImageInputGateEvidence,
    ocrExecutionGateEvidence,
    extractedTextGateEvidence,
    ocrQualityGateEvidence,
    smartTalkHandoffGateEvidence,
    userFacingDisclosureGateEvidence,
    forbiddenBehaviorEvidence,
    futureRuntimeContractEvidence,
    safetyBoundaryEvidence,
    readinessVerdict,
    evidenceLimitations,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.11B: Real OCR Extraction Implementation Plan — a plan-only phase detailing how the gates designed in 8.11A would be implemented (still no OCR library selection, no dependency addition, no runtime patch, no real OCR calls).",
      "OCR library/provider selection, OCR runtime implementation, OCR quality evaluator implementation, and OCR trust boundary implementation remain separate, later, explicitly authorized phases.",
      "Public runtime, production, and go-live remain unauthorized and explicitly deferred.",
    ],
    notes,
  };

  if (designFailures.length === 0 && !_isCanonicalRealOcrExtractionGateDesignResult(provisional)) {
    designFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of REAL_OCR_EXTRACTION_GATE_DESIGN_TAMPER_CASES) {
    if (!_isCanonicalRealOcrExtractionGateDesignResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11A tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) designFailures.push(...tamperFailures);

  const allPassed = designFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11A tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(designFailures.length > 0 ? [`FAILURES (${designFailures.length}):`, ...designFailures] : []),
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
  process.argv[1].replace(/\\/g, "/").includes("run-real-ocr-extraction-gate-design");

if (invokedDirectly) {
  runRealOcrExtractionGateDesign()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
