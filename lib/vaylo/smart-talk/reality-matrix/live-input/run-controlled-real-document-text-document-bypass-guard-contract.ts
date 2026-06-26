/**
 * Phase 8.5I — Controlled Real Document Text Document Bypass Guard Contract.
 *
 * CONTRACT/PLANNING-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5H.
 *
 * This file defines the Text Document Bypass Guard contract for Free Q&A /
 * text mode. It does NOT implement the runtime guard in /api/smart-talk.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or modify live route files.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Implement the runtime bypass guard.
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentPhotoOcrRouteRuntimeQuarantine } from "./run-controlled-real-document-photo-ocr-route-runtime-quarantine";

// ── Local contract input type ─────────────────────────────────────────────────

interface ControlledRealDocumentTextDocumentBypassGuardContractInput {
  // 8.5H prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted: boolean;
  readonly photoOcrRouteRuntimeQuarantineOnly: boolean;
  readonly photoOcrRouteRuntimeQuarantineApplied: boolean;
  readonly photoOcrRouteDefaultBlocked: boolean;
  readonly photoOcrRouteEarlyReturnBeforeBodyParsingRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOpenAiRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOcrRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: boolean;
  readonly photoOcrRouteQuarantineResponseStatus503Required: boolean;
  readonly photoOcrRouteQuarantineResponseSafeJsonRequired: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD and containment flags
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly photoOcrRuntimeStillNotAuthorized: boolean;
  readonly photoUploadStillNotAuthorized: boolean;
  readonly ocrRuntimeStillNotAuthorized: boolean;
  readonly publicPhotoRuntimeStillNotAuthorized: boolean;
  readonly userVisiblePhotoDocumentExplanationStillNotAuthorized: boolean;
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRoute: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // 8.5H special actual flags (must be true — 8.5H performed these)
  readonly prereqActualPhotoRouteQuarantinePerformed: boolean;
  readonly prereqActualLiveRouteMutationPerformed: boolean;

  // Forbidden actual flags (must all be false)
  readonly actualRealDocumentInputPerformed: boolean;
  readonly actualRealDocumentProcessingPerformed: boolean;
  readonly actualOcrPerformed: boolean;
  readonly actualPhotoInputProcessed: boolean;
  readonly actualFileInputProcessed: boolean;
  readonly actualDocumentStoragePerformed: boolean;
  readonly actualDatabasePersistencePerformed: boolean;
  readonly actualAuditPersistencePerformed: boolean;
  readonly actualUserVisibleOutputPerformed: boolean;
  readonly actualPublicRuntimeEnabled: boolean;
  readonly actualEvidenceEvaluationPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;

  // 8.5H quarantine confirms (must all be true)
  readonly photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNo8x3AcRerun: boolean;
  readonly photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoRawDocumentStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoModelOutputStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoPromptStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly photoRouteQuarantineConfirmsNoEvidenceEvaluation: boolean;
  readonly photoRouteQuarantineConfirmsNoClaimAuthorization: boolean;
  readonly photoRouteQuarantineConfirmsNoDeadlineCalculation: boolean;
  readonly photoRouteQuarantineConfirmsNoLegalCertainty: boolean;
  readonly photoRouteQuarantineConfirmsNoPaymentRuntimeCall: boolean;
  readonly photoRouteQuarantineConfirmsNoSupabaseMutation: boolean;
  readonly photoRouteQuarantineConfirmsNoStorageMutation: boolean;
  readonly photoRouteQuarantineConfirmsNoDatabaseWrite: boolean;
  readonly photoRouteQuarantineConfirmsNoAuditPersistence: boolean;

  // Pipeline executed flags (must all be false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags (must all be false)
  readonly realDocumentInputAuthorizedNow: boolean;
  readonly realDocumentProcessingAuthorizedNow: boolean;
  readonly realUserDocumentUploadAuthorizedNow: boolean;
  readonly ocrRuntimeAuthorizedNow: boolean;
  readonly photoInputAuthorizedNow: boolean;
  readonly fileInputAuthorizedNow: boolean;
  readonly documentStorageAuthorizedNow: boolean;
  readonly persistenceAuthorizedNow: boolean;
  readonly publicRuntimeAuthorizedNow: boolean;
  readonly userVisibleLegalDeadlineOutputAuthorizedNow: boolean;
  readonly liveLLMRuntimeAuthorizedNow: boolean;
  readonly connectedAiRuntimeAuthorizedNow: boolean;
  readonly pilotRuntimeAuthorizedNow: boolean;
  readonly productionRuntimeAuthorizedNow: boolean;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // 8.5H forward readiness
  readonly readyFor8x5ITextDocumentBypassGuardContract: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5I contract assertions (must all be true)
  readonly textDocumentBypassGuardContractOnly: boolean;
  readonly textDocumentBypassGuardContractDefined: boolean;
  readonly textDocumentBypassGuardRuntimeNotImplementedYet: boolean;
  readonly textDocumentBypassGuardMustRunBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardMustRunBeforePromptBuild: boolean;
  readonly textDocumentBypassGuardMustRunBeforeModelCall: boolean;
  readonly textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: boolean;
  readonly textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: boolean;

  // Document-like signal contract (must all be true)
  readonly documentLikeSignalContractIncludesLongPastedText: boolean;
  readonly documentLikeSignalContractIncludesGermanAuthorityTerms: boolean;
  readonly documentLikeSignalContractIncludesOfficialLetterStructure: boolean;
  readonly documentLikeSignalContractIncludesInvoiceOrMahnungTerms: boolean;
  readonly documentLikeSignalContractIncludesBescheidOrWiderspruchTerms: boolean;
  readonly documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms: boolean;
  readonly documentLikeSignalContractIncludesPersonalDataMarkers: boolean;
  readonly documentLikeSignalContractIncludesSalutationMarkers: boolean;
  readonly documentLikeSignalContractIncludesReferenceNumberMarkers: boolean;

  // Guard decision contract (must all be true)
  readonly guardDecisionAllowsGeneralQuestionMode: boolean;
  readonly guardDecisionBlocksFullDocumentInFreeQuestionMode: boolean;
  readonly guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode: boolean;
  readonly guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode: boolean;
  readonly guardDecisionDoesNotTranslateFullDocumentInFreeMode: boolean;
  readonly guardDecisionDoesNotExplainFullDocumentInFreeMode: boolean;
  readonly guardDecisionDoesNotCalculateExactDeadlineInFreeMode: boolean;
  readonly guardDecisionDoesNotAuthorizeClaimsInFreeMode: boolean;
  readonly guardDecisionDoesNotExposeLegalCertaintyInFreeMode: boolean;

  // Safe response contract (must all be true)
  readonly safeResponseMustUseDocumentModeRequiredCode: boolean;
  readonly safeResponseMustBeUserSafe: boolean;
  readonly safeResponseMustNotContainFullTranslation: boolean;
  readonly safeResponseMustNotContainFullDocumentSummary: boolean;
  readonly safeResponseMustNotContainLegalAdvice: boolean;
  readonly safeResponseMustNotContainExactDeadline: boolean;
  readonly safeResponseMustNotContainClaimAuthorization: boolean;
  readonly safeResponseMustNotContainRawDocumentEcho: boolean;
  readonly safeResponseMustPointToPaidDocumentMode: boolean;
  readonly safeResponseMayIncludeBriefGeneralGuidance: boolean;

  // 8.5I containment assertions (must all be true)
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: boolean;
  readonly td001DocumentBypassGuardStillRequiresRuntimeImplementation: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;

  // 8.5I actual* performed assertions (must all be false — 8.5I did not perform these)
  readonly actualPhotoRouteQuarantinePerformed: boolean;
  readonly actualLiveRouteMutationPerformed: boolean;

  // 8.5I textBypassGuardContractConfirms* (must all be true)
  readonly textBypassGuardContractConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardContractConfirmsNoFetchCall: boolean;
  readonly textBypassGuardContractConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardContractConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardContractConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoRouteImport: boolean;
  readonly textBypassGuardContractConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardContractConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardContractConfirmsNoUiMutation: boolean;
  readonly textBypassGuardContractConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardContractConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardContractConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardContractConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardContractConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardContractConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardContractConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardContractConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardContractConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardContractConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardContractConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardContractConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardContractConfirmsNoLegalCertainty: boolean;

  // 8.5I forward readiness
  readonly readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentTextDocumentBypassGuardContractResult {
  readonly checkId: "8.5I";
  readonly allPassed: boolean;
  readonly photoOcrRouteRuntimeQuarantineReadyForTextDocumentBypassGuardContract: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardContractAccepted: boolean;
  readonly textDocumentBypassGuardContractOnly: true;
  readonly textDocumentBypassGuardContractDefined: true;
  readonly textDocumentBypassGuardRuntimeNotImplementedYet: boolean;
  readonly textDocumentBypassGuardMustRunBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardMustRunBeforePromptBuild: boolean;
  readonly textDocumentBypassGuardMustRunBeforeModelCall: boolean;
  readonly textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: boolean;
  readonly textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: boolean;
  readonly tamperCasesRejected: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Document-like signal contract
  readonly documentLikeSignalContractIncludesLongPastedText: boolean;
  readonly documentLikeSignalContractIncludesGermanAuthorityTerms: boolean;
  readonly documentLikeSignalContractIncludesOfficialLetterStructure: boolean;
  readonly documentLikeSignalContractIncludesInvoiceOrMahnungTerms: boolean;
  readonly documentLikeSignalContractIncludesBescheidOrWiderspruchTerms: boolean;
  readonly documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms: boolean;
  readonly documentLikeSignalContractIncludesPersonalDataMarkers: boolean;
  readonly documentLikeSignalContractIncludesSalutationMarkers: boolean;
  readonly documentLikeSignalContractIncludesReferenceNumberMarkers: boolean;

  // Guard decision contract
  readonly guardDecisionAllowsGeneralQuestionMode: boolean;
  readonly guardDecisionBlocksFullDocumentInFreeQuestionMode: boolean;
  readonly guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode: boolean;
  readonly guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode: boolean;
  readonly guardDecisionDoesNotTranslateFullDocumentInFreeMode: boolean;
  readonly guardDecisionDoesNotExplainFullDocumentInFreeMode: boolean;
  readonly guardDecisionDoesNotCalculateExactDeadlineInFreeMode: boolean;
  readonly guardDecisionDoesNotAuthorizeClaimsInFreeMode: boolean;
  readonly guardDecisionDoesNotExposeLegalCertaintyInFreeMode: boolean;

  // Safe response contract
  readonly safeResponseMustUseDocumentModeRequiredCode: boolean;
  readonly safeResponseMustBeUserSafe: boolean;
  readonly safeResponseMustNotContainFullTranslation: boolean;
  readonly safeResponseMustNotContainFullDocumentSummary: boolean;
  readonly safeResponseMustNotContainLegalAdvice: boolean;
  readonly safeResponseMustNotContainExactDeadline: boolean;
  readonly safeResponseMustNotContainClaimAuthorization: boolean;
  readonly safeResponseMustNotContainRawDocumentEcho: boolean;
  readonly safeResponseMustPointToPaidDocumentMode: boolean;
  readonly safeResponseMayIncludeBriefGeneralGuidance: boolean;

  // TD containment status
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: boolean;
  readonly td001DocumentBypassGuardStillRequiresRuntimeImplementation: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;

  // Still-active blocker flags
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;

  // Medium/low debt flags
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: false;

  // Actual performed flags (all false in 8.5I)
  readonly actualRealDocumentInputPerformed: false;
  readonly actualRealDocumentProcessingPerformed: false;
  readonly actualOcrPerformed: false;
  readonly actualPhotoInputProcessed: false;
  readonly actualFileInputProcessed: false;
  readonly actualDocumentStoragePerformed: false;
  readonly actualDatabasePersistencePerformed: false;
  readonly actualAuditPersistencePerformed: false;
  readonly actualUserVisibleOutputPerformed: false;
  readonly actualPublicRuntimeEnabled: false;
  readonly actualEvidenceEvaluationPerformed: false;
  readonly actualClaimAuthorizationPerformed: false;
  readonly actualDeadlineCalculationPerformed: false;
  readonly actualPhotoRouteQuarantinePerformed: false;
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualDocumentBypassGuardImplemented: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;

  // Audit confirms no side effects
  readonly textBypassGuardContractConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardContractConfirmsNoFetchCall: boolean;
  readonly textBypassGuardContractConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardContractConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardContractConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoRouteImport: boolean;
  readonly textBypassGuardContractConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardContractConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardContractConfirmsNoUiMutation: boolean;
  readonly textBypassGuardContractConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardContractConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardContractConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardContractConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardContractConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardContractConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardContractConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardContractConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardContractConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardContractConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardContractConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardContractConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardContractConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardContractConfirmsNoLegalCertainty: boolean;

  // Pipeline executed flags (must all be false)
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags (must all be false)
  readonly realDocumentInputAuthorizedNow: false;
  readonly realDocumentProcessingAuthorizedNow: false;
  readonly realUserDocumentUploadAuthorizedNow: false;
  readonly ocrRuntimeAuthorizedNow: false;
  readonly photoInputAuthorizedNow: false;
  readonly fileInputAuthorizedNow: false;
  readonly documentStorageAuthorizedNow: false;
  readonly persistenceAuthorizedNow: false;
  readonly publicRuntimeAuthorizedNow: false;
  readonly userVisibleLegalDeadlineOutputAuthorizedNow: false;
  readonly liveLLMRuntimeAuthorizedNow: false;
  readonly connectedAiRuntimeAuthorizedNow: false;
  readonly pilotRuntimeAuthorizedNow: false;
  readonly productionRuntimeAuthorizedNow: false;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  // Forward readiness
  readonly readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: false;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Contract input validator ──────────────────────────────────────────────────

function validateBypassGuardContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5H prerequisite gates
  if (o["prereqCheckId"] !== "8.5H")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted"] !== true)
    reasons.push("quarantine_not_accepted");
  if (o["photoOcrRouteRuntimeQuarantineOnly"] !== true)
    reasons.push("photo_ocr_route_runtime_quarantine_only_false");
  if (o["photoOcrRouteRuntimeQuarantineApplied"] !== true)
    reasons.push("photo_ocr_route_runtime_quarantine_applied_false");
  if (o["photoOcrRouteDefaultBlocked"] !== true)
    reasons.push("photo_ocr_route_default_blocked_false");
  if (o["photoOcrRouteEarlyReturnBeforeBodyParsingRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_body_parsing_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeOpenAiRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_open_ai_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeOcrRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_ocr_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_run_smart_talk_required_false");
  if (o["photoOcrRouteQuarantineResponseStatus503Required"] !== true)
    reasons.push("photo_ocr_route_quarantine_response_status_503_required_false");
  if (o["photoOcrRouteQuarantineResponseSafeJsonRequired"] !== true)
    reasons.push("photo_ocr_route_quarantine_response_safe_json_required_false");

  // Authorization grants (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");
  if (o["goLiveAuthorizationGranted"] !== false)
    reasons.push("go_live_authorization_granted");

  // TD and containment flags (must be true)
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_live_ahead_of_governance_contained_false");
  if (o["photoOcrRuntimeStillNotAuthorized"] !== true)
    reasons.push("photo_ocr_runtime_still_not_authorized_false");
  if (o["photoUploadStillNotAuthorized"] !== true)
    reasons.push("photo_upload_still_not_authorized_false");
  if (o["ocrRuntimeStillNotAuthorized"] !== true)
    reasons.push("ocr_runtime_still_not_authorized_false");
  if (o["publicPhotoRuntimeStillNotAuthorized"] !== true)
    reasons.push("public_photo_runtime_still_not_authorized_false");
  if (o["userVisiblePhotoDocumentExplanationStillNotAuthorized"] !== true)
    reasons.push("user_visible_photo_document_explanation_still_not_authorized_false");
  if (o["td001DocumentBypassGuardMissingInLiveSmartTalkRoute"] !== true)
    reasons.push("td001_document_bypass_guard_missing_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true)
    reasons.push("td006_evidence_gate_todo_and_or_semantics_unresolved_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("td007_trap_claim_disposition_namespace_hardening_unresolved_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("td008_in_memory_rate_limiter_serverless_unsafe_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("td010_get_user_state_document_type_todo_open_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree");

  // 8.5H special actual flags (must be true — 8.5H performed these)
  if (o["prereqActualPhotoRouteQuarantinePerformed"] !== true)
    reasons.push("prereq_actual_photo_route_quarantine_performed_false");
  if (o["prereqActualLiveRouteMutationPerformed"] !== true)
    reasons.push("prereq_actual_live_route_mutation_performed_false");

  // Forbidden actual flags (must be false)
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("actual_real_document_input_performed");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("actual_real_document_processing_performed");
  if (o["actualOcrPerformed"] !== false)
    reasons.push("actual_ocr_performed");
  if (o["actualPhotoInputProcessed"] !== false)
    reasons.push("actual_photo_input_processed");
  if (o["actualFileInputProcessed"] !== false)
    reasons.push("actual_file_input_processed");
  if (o["actualDocumentStoragePerformed"] !== false)
    reasons.push("actual_document_storage_performed");
  if (o["actualDatabasePersistencePerformed"] !== false)
    reasons.push("actual_database_persistence_performed");
  if (o["actualAuditPersistencePerformed"] !== false)
    reasons.push("actual_audit_persistence_performed");
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("actual_user_visible_output_performed");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("actual_public_runtime_enabled");
  if (o["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("actual_paid_document_mode_implemented");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed");

  // 8.5H quarantine confirms (must be true)
  if (o["photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_open_ai_call_false");
  if (o["photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_fetch_call_false");
  if (o["photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_process_env_read_false");
  if (o["photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_sdk_usage_false");
  if (o["photoRouteQuarantineConfirmsNo8x3AcRerun"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_8x3ac_rerun_false");
  if (o["photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_smart_talk_runtime_call_false");
  if (o["photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_body_parsing_false");
  if (o["photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_file_read_false");
  if (o["photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_image_validation_false");
  if (o["photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_ocr_runtime_call_false");
  if (o["photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_document_parsing_false");
  if (o["photoRouteQuarantineConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_raw_document_storage_false");
  if (o["photoRouteQuarantineConfirmsNoModelOutputStorage"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_model_output_storage_false");
  if (o["photoRouteQuarantineConfirmsNoPromptStorage"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_prompt_storage_false");
  if (o["photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_user_visible_document_explanation_false");
  if (o["photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_customer_facing_document_analysis_false");
  if (o["photoRouteQuarantineConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_evidence_evaluation_false");
  if (o["photoRouteQuarantineConfirmsNoClaimAuthorization"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_claim_authorization_false");
  if (o["photoRouteQuarantineConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_deadline_calculation_false");
  if (o["photoRouteQuarantineConfirmsNoLegalCertainty"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_legal_certainty_false");
  if (o["photoRouteQuarantineConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_payment_runtime_call_false");
  if (o["photoRouteQuarantineConfirmsNoSupabaseMutation"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_supabase_mutation_false");
  if (o["photoRouteQuarantineConfirmsNoStorageMutation"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_storage_mutation_false");
  if (o["photoRouteQuarantineConfirmsNoDatabaseWrite"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_database_write_false");
  if (o["photoRouteQuarantineConfirmsNoAuditPersistence"] !== true)
    reasons.push("photo_route_quarantine_confirms_no_audit_persistence_false");

  // Pipeline executed flags (must be false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("execution_sequence_actually_executed");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("runtime_pipeline_actually_executed");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("document_pipeline_actually_executed");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("ocr_pipeline_actually_executed");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("payment_pipeline_actually_executed");
  if (o["userVisiblePipelineActuallyExecuted"] !== false)
    reasons.push("user_visible_pipeline_actually_executed");

  // Runtime authorization flags (must be false)
  if (o["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (o["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (o["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (o["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (o["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (o["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (o["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (o["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (o["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (o["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (o["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (o["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (o["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (o["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety flags
  if (o["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (o["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (o["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (o["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (o["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (o["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_required_for_exact_deadline_false");

  // 8.5H forward readiness
  if (o["readyFor8x5ITextDocumentBypassGuardContract"] !== true)
    reasons.push("ready_for_8x5i_text_document_bypass_guard_contract_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_separate_runtime_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_pilot_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_production_authorization_phase_not_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input_not_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output_not_false");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled_not_false");
  if (o["persistenceUsed"] !== false)
    reasons.push("persistence_used_not_false");
  if (o["neverUserVisible"] !== true)
    reasons.push("never_user_visible_false");

  // 8.5I contract assertions (must be true)
  if (o["textDocumentBypassGuardContractOnly"] !== true)
    reasons.push("text_document_bypass_guard_contract_only_false");
  if (o["textDocumentBypassGuardContractDefined"] !== true)
    reasons.push("text_document_bypass_guard_contract_defined_false");
  if (o["textDocumentBypassGuardRuntimeNotImplementedYet"] !== true)
    reasons.push("text_document_bypass_guard_runtime_not_implemented_yet_false");
  if (o["textDocumentBypassGuardMustRunBeforeRunSmartTalk"] !== true)
    reasons.push("text_document_bypass_guard_must_run_before_run_smart_talk_false");
  if (o["textDocumentBypassGuardMustRunBeforePromptBuild"] !== true)
    reasons.push("text_document_bypass_guard_must_run_before_prompt_build_false");
  if (o["textDocumentBypassGuardMustRunBeforeModelCall"] !== true)
    reasons.push("text_document_bypass_guard_must_run_before_model_call_false");
  if (o["textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis"] !== true)
    reasons.push("text_document_bypass_guard_must_run_before_full_document_analysis_false");
  if (o["textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse"] !== true)
    reasons.push("text_document_bypass_guard_must_return_safe_document_mode_required_response_false");

  // Document-like signal contract (must be true)
  if (o["documentLikeSignalContractIncludesLongPastedText"] !== true)
    reasons.push("document_like_signal_contract_includes_long_pasted_text_false");
  if (o["documentLikeSignalContractIncludesGermanAuthorityTerms"] !== true)
    reasons.push("document_like_signal_contract_includes_german_authority_terms_false");
  if (o["documentLikeSignalContractIncludesOfficialLetterStructure"] !== true)
    reasons.push("document_like_signal_contract_includes_official_letter_structure_false");
  if (o["documentLikeSignalContractIncludesInvoiceOrMahnungTerms"] !== true)
    reasons.push("document_like_signal_contract_includes_invoice_or_mahnung_terms_false");
  if (o["documentLikeSignalContractIncludesBescheidOrWiderspruchTerms"] !== true)
    reasons.push("document_like_signal_contract_includes_bescheid_or_widerspruch_terms_false");
  if (o["documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms"] !== true)
    reasons.push("document_like_signal_contract_includes_deadline_or_legal_consequence_terms_false");
  if (o["documentLikeSignalContractIncludesPersonalDataMarkers"] !== true)
    reasons.push("document_like_signal_contract_includes_personal_data_markers_false");
  if (o["documentLikeSignalContractIncludesSalutationMarkers"] !== true)
    reasons.push("document_like_signal_contract_includes_salutation_markers_false");
  if (o["documentLikeSignalContractIncludesReferenceNumberMarkers"] !== true)
    reasons.push("document_like_signal_contract_includes_reference_number_markers_false");

  // Guard decision contract (must be true)
  if (o["guardDecisionAllowsGeneralQuestionMode"] !== true)
    reasons.push("guard_decision_allows_general_question_mode_false");
  if (o["guardDecisionBlocksFullDocumentInFreeQuestionMode"] !== true)
    reasons.push("guard_decision_blocks_full_document_in_free_question_mode_false");
  if (o["guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode"] !== true)
    reasons.push("guard_decision_redirects_document_like_text_to_paid_document_mode_false");
  if (o["guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode"] !== true)
    reasons.push("guard_decision_allows_only_brief_general_safety_guidance_in_free_mode_false");
  if (o["guardDecisionDoesNotTranslateFullDocumentInFreeMode"] !== true)
    reasons.push("guard_decision_does_not_translate_full_document_in_free_mode_false");
  if (o["guardDecisionDoesNotExplainFullDocumentInFreeMode"] !== true)
    reasons.push("guard_decision_does_not_explain_full_document_in_free_mode_false");
  if (o["guardDecisionDoesNotCalculateExactDeadlineInFreeMode"] !== true)
    reasons.push("guard_decision_does_not_calculate_exact_deadline_in_free_mode_false");
  if (o["guardDecisionDoesNotAuthorizeClaimsInFreeMode"] !== true)
    reasons.push("guard_decision_does_not_authorize_claims_in_free_mode_false");
  if (o["guardDecisionDoesNotExposeLegalCertaintyInFreeMode"] !== true)
    reasons.push("guard_decision_does_not_expose_legal_certainty_in_free_mode_false");

  // Safe response contract (must be true)
  if (o["safeResponseMustUseDocumentModeRequiredCode"] !== true)
    reasons.push("safe_response_must_use_document_mode_required_code_false");
  if (o["safeResponseMustBeUserSafe"] !== true)
    reasons.push("safe_response_must_be_user_safe_false");
  if (o["safeResponseMustNotContainFullTranslation"] !== true)
    reasons.push("safe_response_must_not_contain_full_translation_false");
  if (o["safeResponseMustNotContainFullDocumentSummary"] !== true)
    reasons.push("safe_response_must_not_contain_full_document_summary_false");
  if (o["safeResponseMustNotContainLegalAdvice"] !== true)
    reasons.push("safe_response_must_not_contain_legal_advice_false");
  if (o["safeResponseMustNotContainExactDeadline"] !== true)
    reasons.push("safe_response_must_not_contain_exact_deadline_false");
  if (o["safeResponseMustNotContainClaimAuthorization"] !== true)
    reasons.push("safe_response_must_not_contain_claim_authorization_false");
  if (o["safeResponseMustNotContainRawDocumentEcho"] !== true)
    reasons.push("safe_response_must_not_contain_raw_document_echo_false");
  if (o["safeResponseMustPointToPaidDocumentMode"] !== true)
    reasons.push("safe_response_must_point_to_paid_document_mode_false");
  if (o["safeResponseMayIncludeBriefGeneralGuidance"] !== true)
    reasons.push("safe_response_may_include_brief_general_guidance_false");

  // 8.5I containment assertions (must be true)
  if (o["td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted"] !== true)
    reasons.push("td001_document_bypass_guard_missing_in_live_smart_talk_route_contracted_false");
  if (o["td001DocumentBypassGuardStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td001_document_bypass_guard_still_requires_runtime_implementation_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_photo_ocr_route_still_requires_future_authorized_runtime_design_false");

  // 8.5I actual* performed assertions (must be false)
  if (o["actualPhotoRouteQuarantinePerformed"] !== false)
    reasons.push("actual_photo_route_quarantine_performed_in_8x5i");
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_in_8x5i");

  // 8.5I textBypassGuardContractConfirms* (must be true)
  if (o["textBypassGuardContractConfirmsNoOpenAiCall"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_open_ai_call_false");
  if (o["textBypassGuardContractConfirmsNoFetchCall"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_fetch_call_false");
  if (o["textBypassGuardContractConfirmsNoProcessEnvRead"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_process_env_read_false");
  if (o["textBypassGuardContractConfirmsNoSdkUsage"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_sdk_usage_false");
  if (o["textBypassGuardContractConfirmsNo8x3AcRerun"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_8x3ac_rerun_false");
  if (o["textBypassGuardContractConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_smart_talk_runtime_call_false");
  if (o["textBypassGuardContractConfirmsNoRouteImport"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_route_import_false");
  if (o["textBypassGuardContractConfirmsNoRouteMutation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_route_mutation_false");
  if (o["textBypassGuardContractConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_public_route_mutation_false");
  if (o["textBypassGuardContractConfirmsNoUiMutation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_ui_mutation_false");
  if (o["textBypassGuardContractConfirmsNoSupabaseMutation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_supabase_mutation_false");
  if (o["textBypassGuardContractConfirmsNoStorageMutation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_storage_mutation_false");
  if (o["textBypassGuardContractConfirmsNoDatabaseWrite"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_database_write_false");
  if (o["textBypassGuardContractConfirmsNoAuditPersistence"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_audit_persistence_false");
  if (o["textBypassGuardContractConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_payment_runtime_call_false");
  if (o["textBypassGuardContractConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_ocr_runtime_call_false");
  if (o["textBypassGuardContractConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_photo_input_processing_false");
  if (o["textBypassGuardContractConfirmsNoFileInputProcessing"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_file_input_processing_false");
  if (o["textBypassGuardContractConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_document_parsing_runtime_false");
  if (o["textBypassGuardContractConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_raw_document_storage_false");
  if (o["textBypassGuardContractConfirmsNoModelOutputStorage"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_model_output_storage_false");
  if (o["textBypassGuardContractConfirmsNoPromptStorage"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_prompt_storage_false");
  if (o["textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_user_visible_document_explanation_false");
  if (o["textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_customer_facing_document_analysis_false");
  if (o["textBypassGuardContractConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_evidence_evaluation_false");
  if (o["textBypassGuardContractConfirmsNoClaimAuthorization"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_claim_authorization_false");
  if (o["textBypassGuardContractConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_deadline_calculation_false");
  if (o["textBypassGuardContractConfirmsNoLegalCertainty"] !== true)
    reasons.push("text_bypass_guard_contract_confirms_no_legal_certainty_false");

  // 8.5I forward readiness
  if (o["readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan"] !== true)
    reasons.push("ready_for_8x5j_text_document_bypass_guard_runtime_implementation_plan_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main function ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentTextDocumentBypassGuardContract(): ControlledRealDocumentTextDocumentBypassGuardContractResult {
  const quarantineResult = runControlledRealDocumentPhotoOcrRouteRuntimeQuarantine();

  const canonicalInput: ControlledRealDocumentTextDocumentBypassGuardContractInput = {
    // 8.5H prerequisite gates
    prereqCheckId: quarantineResult.checkId,
    prereqAllPassed: quarantineResult.allPassed,
    controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted:
      quarantineResult.controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted,
    photoOcrRouteRuntimeQuarantineOnly: quarantineResult.photoOcrRouteRuntimeQuarantineOnly,
    photoOcrRouteRuntimeQuarantineApplied: quarantineResult.photoOcrRouteRuntimeQuarantineApplied,
    photoOcrRouteDefaultBlocked: quarantineResult.photoOcrRouteDefaultBlocked,
    photoOcrRouteEarlyReturnBeforeBodyParsingRequired:
      quarantineResult.photoOcrRouteEarlyReturnBeforeBodyParsingRequired,
    photoOcrRouteEarlyReturnBeforeOpenAiRequired:
      quarantineResult.photoOcrRouteEarlyReturnBeforeOpenAiRequired,
    photoOcrRouteEarlyReturnBeforeOcrRequired:
      quarantineResult.photoOcrRouteEarlyReturnBeforeOcrRequired,
    photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired:
      quarantineResult.photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired,
    photoOcrRouteQuarantineResponseStatus503Required:
      quarantineResult.photoOcrRouteQuarantineResponseStatus503Required,
    photoOcrRouteQuarantineResponseSafeJsonRequired:
      quarantineResult.photoOcrRouteQuarantineResponseSafeJsonRequired,

    // Authorization grants
    runtimeAuthorizationGranted: quarantineResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: quarantineResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: quarantineResult.productionAuthorizationGranted,
    finalAuthorizationGranted: quarantineResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: quarantineResult.goLiveAuthorizationGranted,

    // TD and containment flags
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      quarantineResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    photoOcrRuntimeStillNotAuthorized: quarantineResult.photoOcrRuntimeStillNotAuthorized,
    photoUploadStillNotAuthorized: quarantineResult.photoUploadStillNotAuthorized,
    ocrRuntimeStillNotAuthorized: quarantineResult.ocrRuntimeStillNotAuthorized,
    publicPhotoRuntimeStillNotAuthorized: quarantineResult.publicPhotoRuntimeStillNotAuthorized,
    userVisiblePhotoDocumentExplanationStillNotAuthorized:
      quarantineResult.userVisiblePhotoDocumentExplanationStillNotAuthorized,
    td001DocumentBypassGuardMissingInLiveSmartTalkRoute:
      quarantineResult.td001DocumentBypassGuardMissingInLiveSmartTalkRoute,
    td004PreModelPiiRedactionMissing: quarantineResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      quarantineResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      quarantineResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      quarantineResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      quarantineResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe:
      quarantineResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: quarantineResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: quarantineResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: quarantineResult.tmpFilesPresentInWorkingTree,

    // 8.5H special actual flags (must be true in 8.5H prereq)
    prereqActualPhotoRouteQuarantinePerformed: quarantineResult.actualPhotoRouteQuarantinePerformed,
    prereqActualLiveRouteMutationPerformed: quarantineResult.actualLiveRouteMutationPerformed,

    // Forbidden actual flags (all false from 8.5H prereq)
    actualRealDocumentInputPerformed: quarantineResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: quarantineResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: quarantineResult.actualOcrPerformed,
    actualPhotoInputProcessed: quarantineResult.actualPhotoInputProcessed,
    actualFileInputProcessed: quarantineResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: quarantineResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: quarantineResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: quarantineResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: quarantineResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: quarantineResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: quarantineResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: quarantineResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: quarantineResult.actualDeadlineCalculationPerformed,
    actualDocumentBypassGuardImplemented: quarantineResult.actualDocumentBypassGuardImplemented,
    actualPaidDocumentModeImplemented: quarantineResult.actualPaidDocumentModeImplemented,
    actualPiiRedactionImplemented: quarantineResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: quarantineResult.actualEvidenceGateRuntimeWiringPerformed,

    // 8.5H quarantine confirms
    photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath,
    photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath,
    photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath,
    photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath,
    photoRouteQuarantineConfirmsNo8x3AcRerun:
      quarantineResult.photoRouteQuarantineConfirmsNo8x3AcRerun,
    photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath,
    photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath,
    photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath,
    photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath,
    photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath,
    photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath:
      quarantineResult.photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath,
    photoRouteQuarantineConfirmsNoRawDocumentStorage:
      quarantineResult.photoRouteQuarantineConfirmsNoRawDocumentStorage,
    photoRouteQuarantineConfirmsNoModelOutputStorage:
      quarantineResult.photoRouteQuarantineConfirmsNoModelOutputStorage,
    photoRouteQuarantineConfirmsNoPromptStorage:
      quarantineResult.photoRouteQuarantineConfirmsNoPromptStorage,
    photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation:
      quarantineResult.photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation,
    photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis:
      quarantineResult.photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis,
    photoRouteQuarantineConfirmsNoEvidenceEvaluation:
      quarantineResult.photoRouteQuarantineConfirmsNoEvidenceEvaluation,
    photoRouteQuarantineConfirmsNoClaimAuthorization:
      quarantineResult.photoRouteQuarantineConfirmsNoClaimAuthorization,
    photoRouteQuarantineConfirmsNoDeadlineCalculation:
      quarantineResult.photoRouteQuarantineConfirmsNoDeadlineCalculation,
    photoRouteQuarantineConfirmsNoLegalCertainty:
      quarantineResult.photoRouteQuarantineConfirmsNoLegalCertainty,
    photoRouteQuarantineConfirmsNoPaymentRuntimeCall:
      quarantineResult.photoRouteQuarantineConfirmsNoPaymentRuntimeCall,
    photoRouteQuarantineConfirmsNoSupabaseMutation:
      quarantineResult.photoRouteQuarantineConfirmsNoSupabaseMutation,
    photoRouteQuarantineConfirmsNoStorageMutation:
      quarantineResult.photoRouteQuarantineConfirmsNoStorageMutation,
    photoRouteQuarantineConfirmsNoDatabaseWrite:
      quarantineResult.photoRouteQuarantineConfirmsNoDatabaseWrite,
    photoRouteQuarantineConfirmsNoAuditPersistence:
      quarantineResult.photoRouteQuarantineConfirmsNoAuditPersistence,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: quarantineResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: quarantineResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: quarantineResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: quarantineResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: quarantineResult.paymentPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: quarantineResult.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
    realDocumentInputAuthorizedNow: quarantineResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: quarantineResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: quarantineResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: quarantineResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: quarantineResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: quarantineResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: quarantineResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: quarantineResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: quarantineResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      quarantineResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: quarantineResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: quarantineResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: quarantineResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: quarantineResult.productionRuntimeAuthorizedNow,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: quarantineResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: quarantineResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: quarantineResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: quarantineResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: quarantineResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: quarantineResult.deliveryDateRequiredForExactDeadline,

    // 8.5H forward readiness
    readyFor8x5ITextDocumentBypassGuardContract:
      quarantineResult.readyFor8x5ITextDocumentBypassGuardContract,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    // 8.5I contract assertions
    textDocumentBypassGuardContractOnly: true,
    textDocumentBypassGuardContractDefined: true,
    textDocumentBypassGuardRuntimeNotImplementedYet: true,
    textDocumentBypassGuardMustRunBeforeRunSmartTalk: true,
    textDocumentBypassGuardMustRunBeforePromptBuild: true,
    textDocumentBypassGuardMustRunBeforeModelCall: true,
    textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: true,
    textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: true,

    // Document-like signal contract
    documentLikeSignalContractIncludesLongPastedText: true,
    documentLikeSignalContractIncludesGermanAuthorityTerms: true,
    documentLikeSignalContractIncludesOfficialLetterStructure: true,
    documentLikeSignalContractIncludesInvoiceOrMahnungTerms: true,
    documentLikeSignalContractIncludesBescheidOrWiderspruchTerms: true,
    documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms: true,
    documentLikeSignalContractIncludesPersonalDataMarkers: true,
    documentLikeSignalContractIncludesSalutationMarkers: true,
    documentLikeSignalContractIncludesReferenceNumberMarkers: true,

    // Guard decision contract
    guardDecisionAllowsGeneralQuestionMode: true,
    guardDecisionBlocksFullDocumentInFreeQuestionMode: true,
    guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode: true,
    guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode: true,
    guardDecisionDoesNotTranslateFullDocumentInFreeMode: true,
    guardDecisionDoesNotExplainFullDocumentInFreeMode: true,
    guardDecisionDoesNotCalculateExactDeadlineInFreeMode: true,
    guardDecisionDoesNotAuthorizeClaimsInFreeMode: true,
    guardDecisionDoesNotExposeLegalCertaintyInFreeMode: true,

    // Safe response contract
    safeResponseMustUseDocumentModeRequiredCode: true,
    safeResponseMustBeUserSafe: true,
    safeResponseMustNotContainFullTranslation: true,
    safeResponseMustNotContainFullDocumentSummary: true,
    safeResponseMustNotContainLegalAdvice: true,
    safeResponseMustNotContainExactDeadline: true,
    safeResponseMustNotContainClaimAuthorization: true,
    safeResponseMustNotContainRawDocumentEcho: true,
    safeResponseMustPointToPaidDocumentMode: true,
    safeResponseMayIncludeBriefGeneralGuidance: true,

    // 8.5I containment assertions
    td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: true,
    td001DocumentBypassGuardStillRequiresRuntimeImplementation: true,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,

    // 8.5I actual* performed assertions (all false — 8.5I did not perform these)
    actualPhotoRouteQuarantinePerformed: false,
    actualLiveRouteMutationPerformed: false,

    // 8.5I textBypassGuardContractConfirms*
    textBypassGuardContractConfirmsNoOpenAiCall: true,
    textBypassGuardContractConfirmsNoFetchCall: true,
    textBypassGuardContractConfirmsNoProcessEnvRead: true,
    textBypassGuardContractConfirmsNoSdkUsage: true,
    textBypassGuardContractConfirmsNo8x3AcRerun: true,
    textBypassGuardContractConfirmsNoSmartTalkRuntimeCall: true,
    textBypassGuardContractConfirmsNoRouteImport: true,
    textBypassGuardContractConfirmsNoRouteMutation: true,
    textBypassGuardContractConfirmsNoPublicRouteMutation: true,
    textBypassGuardContractConfirmsNoUiMutation: true,
    textBypassGuardContractConfirmsNoSupabaseMutation: true,
    textBypassGuardContractConfirmsNoStorageMutation: true,
    textBypassGuardContractConfirmsNoDatabaseWrite: true,
    textBypassGuardContractConfirmsNoAuditPersistence: true,
    textBypassGuardContractConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardContractConfirmsNoOcrRuntimeCall: true,
    textBypassGuardContractConfirmsNoPhotoInputProcessing: true,
    textBypassGuardContractConfirmsNoFileInputProcessing: true,
    textBypassGuardContractConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardContractConfirmsNoRawDocumentStorage: true,
    textBypassGuardContractConfirmsNoModelOutputStorage: true,
    textBypassGuardContractConfirmsNoPromptStorage: true,
    textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardContractConfirmsNoEvidenceEvaluation: true,
    textBypassGuardContractConfirmsNoClaimAuthorization: true,
    textBypassGuardContractConfirmsNoDeadlineCalculation: true,
    textBypassGuardContractConfirmsNoLegalCertainty: true,

    // 8.5I forward readiness
    readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: true,
  };

  const prereqValidation = validateBypassGuardContractInput(
    canonicalInput as unknown as Record<string, unknown>
  );

  // ── Tamper cases ──────────────────────────────────────────────────────────────

  type TamperOverride = Partial<Record<keyof ControlledRealDocumentTextDocumentBypassGuardContractInput, unknown>>;
  const tamperCases: { label: string; override: TamperOverride }[] = [
    // 8.5H prereq gates
    { label: "8.5H checkId wrong", override: { prereqCheckId: "8.5G" } },
    { label: "8.5H allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted false", override: { controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted: false } },
    { label: "photoOcrRouteRuntimeQuarantineOnly false", override: { photoOcrRouteRuntimeQuarantineOnly: false } },
    { label: "photoOcrRouteRuntimeQuarantineApplied false", override: { photoOcrRouteRuntimeQuarantineApplied: false } },
    { label: "photoOcrRouteDefaultBlocked false", override: { photoOcrRouteDefaultBlocked: false } },
    { label: "photoOcrRouteEarlyReturnBeforeBodyParsingRequired false", override: { photoOcrRouteEarlyReturnBeforeBodyParsingRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeOpenAiRequired false", override: { photoOcrRouteEarlyReturnBeforeOpenAiRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeOcrRequired false", override: { photoOcrRouteEarlyReturnBeforeOcrRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired false", override: { photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: false } },
    { label: "photoOcrRouteQuarantineResponseStatus503Required false", override: { photoOcrRouteQuarantineResponseStatus503Required: false } },
    { label: "photoOcrRouteQuarantineResponseSafeJsonRequired false", override: { photoOcrRouteQuarantineResponseSafeJsonRequired: false } },
    // Authorization grants
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
    { label: "goLiveAuthorizationGranted true", override: { goLiveAuthorizationGranted: true } },
    // TD and containment
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained false", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false } },
    { label: "photoOcrRuntimeStillNotAuthorized false", override: { photoOcrRuntimeStillNotAuthorized: false } },
    { label: "photoUploadStillNotAuthorized false", override: { photoUploadStillNotAuthorized: false } },
    { label: "ocrRuntimeStillNotAuthorized false", override: { ocrRuntimeStillNotAuthorized: false } },
    { label: "publicPhotoRuntimeStillNotAuthorized false", override: { publicPhotoRuntimeStillNotAuthorized: false } },
    { label: "userVisiblePhotoDocumentExplanationStillNotAuthorized false", override: { userVisiblePhotoDocumentExplanationStillNotAuthorized: false } },
    { label: "td001DocumentBypassGuardMissingInLiveSmartTalkRoute false in prerequisite", override: { td001DocumentBypassGuardMissingInLiveSmartTalkRoute: false } },
    { label: "td004PreModelPiiRedactionMissing false", override: { td004PreModelPiiRedactionMissing: false } },
    { label: "td005PaidDocumentModeNotServerSideEnforced false", override: { td005PaidDocumentModeNotServerSideEnforced: false } },
    { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", override: { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false } },
    { label: "td006EvidenceGateTodoAndOrSemanticsUnresolved false", override: { td006EvidenceGateTodoAndOrSemanticsUnresolved: false } },
    { label: "td007TrapClaimDispositionNamespaceHardeningUnresolved false", override: { td007TrapClaimDispositionNamespaceHardeningUnresolved: false } },
    { label: "td008InMemoryRateLimiterServerlessUnsafe false", override: { td008InMemoryRateLimiterServerlessUnsafe: false } },
    { label: "td010GetUserStateDocumentTypeTodoOpen false", override: { td010GetUserStateDocumentTypeTodoOpen: false } },
    { label: "td009TmpDebugRunnerDebtClosed false", override: { td009TmpDebugRunnerDebtClosed: false } },
    { label: "tmpFilesPresentInWorkingTree true", override: { tmpFilesPresentInWorkingTree: true } },
    // 8.5H special actual flags
    { label: "actualPhotoRouteQuarantinePerformed false in prerequisite", override: { prereqActualPhotoRouteQuarantinePerformed: false } },
    { label: "actualLiveRouteMutationPerformed false in prerequisite", override: { prereqActualLiveRouteMutationPerformed: false } },
    // Forbidden actual flags
    { label: "actualRealDocumentInputPerformed true", override: { actualRealDocumentInputPerformed: true } },
    { label: "actualRealDocumentProcessingPerformed true", override: { actualRealDocumentProcessingPerformed: true } },
    { label: "actualOcrPerformed true", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true", override: { actualAuditPersistencePerformed: true } },
    { label: "actualUserVisibleOutputPerformed true", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualEvidenceEvaluationPerformed true", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true", override: { actualDeadlineCalculationPerformed: true } },
    { label: "actualDocumentBypassGuardImplemented true in prerequisite", override: { actualDocumentBypassGuardImplemented: true } },
    { label: "actualPaidDocumentModeImplemented true in prerequisite", override: { actualPaidDocumentModeImplemented: true } },
    { label: "actualPiiRedactionImplemented true in prerequisite", override: { actualPiiRedactionImplemented: true } },
    { label: "actualEvidenceGateRuntimeWiringPerformed true in prerequisite", override: { actualEvidenceGateRuntimeWiringPerformed: true } },
    // 8.5H quarantine confirms
    { label: "photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNo8x3AcRerun false", override: { photoRouteQuarantineConfirmsNo8x3AcRerun: false } },
    { label: "photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath false", override: { photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath: false } },
    { label: "photoRouteQuarantineConfirmsNoRawDocumentStorage false", override: { photoRouteQuarantineConfirmsNoRawDocumentStorage: false } },
    { label: "photoRouteQuarantineConfirmsNoModelOutputStorage false", override: { photoRouteQuarantineConfirmsNoModelOutputStorage: false } },
    { label: "photoRouteQuarantineConfirmsNoPromptStorage false", override: { photoRouteQuarantineConfirmsNoPromptStorage: false } },
    { label: "photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation false", override: { photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation: false } },
    { label: "photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis false", override: { photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis: false } },
    { label: "photoRouteQuarantineConfirmsNoEvidenceEvaluation false", override: { photoRouteQuarantineConfirmsNoEvidenceEvaluation: false } },
    { label: "photoRouteQuarantineConfirmsNoClaimAuthorization false", override: { photoRouteQuarantineConfirmsNoClaimAuthorization: false } },
    { label: "photoRouteQuarantineConfirmsNoDeadlineCalculation false", override: { photoRouteQuarantineConfirmsNoDeadlineCalculation: false } },
    { label: "photoRouteQuarantineConfirmsNoLegalCertainty false", override: { photoRouteQuarantineConfirmsNoLegalCertainty: false } },
    { label: "photoRouteQuarantineConfirmsNoPaymentRuntimeCall false", override: { photoRouteQuarantineConfirmsNoPaymentRuntimeCall: false } },
    { label: "photoRouteQuarantineConfirmsNoSupabaseMutation false", override: { photoRouteQuarantineConfirmsNoSupabaseMutation: false } },
    { label: "photoRouteQuarantineConfirmsNoStorageMutation false", override: { photoRouteQuarantineConfirmsNoStorageMutation: false } },
    { label: "photoRouteQuarantineConfirmsNoDatabaseWrite false", override: { photoRouteQuarantineConfirmsNoDatabaseWrite: false } },
    { label: "photoRouteQuarantineConfirmsNoAuditPersistence false", override: { photoRouteQuarantineConfirmsNoAuditPersistence: false } },
    // Pipeline executed flags
    { label: "executionSequenceActuallyExecuted true", override: { executionSequenceActuallyExecuted: true } },
    { label: "runtimePipelineActuallyExecuted true", override: { runtimePipelineActuallyExecuted: true } },
    { label: "documentPipelineActuallyExecuted true", override: { documentPipelineActuallyExecuted: true } },
    { label: "ocrPipelineActuallyExecuted true", override: { ocrPipelineActuallyExecuted: true } },
    { label: "paymentPipelineActuallyExecuted true", override: { paymentPipelineActuallyExecuted: true } },
    { label: "userVisiblePipelineActuallyExecuted true", override: { userVisiblePipelineActuallyExecuted: true } },
    // Runtime authorization flags
    { label: "realDocumentInputAuthorizedNow true", override: { realDocumentInputAuthorizedNow: true } },
    { label: "realDocumentProcessingAuthorizedNow true", override: { realDocumentProcessingAuthorizedNow: true } },
    { label: "realUserDocumentUploadAuthorizedNow true", override: { realUserDocumentUploadAuthorizedNow: true } },
    { label: "ocrRuntimeAuthorizedNow true", override: { ocrRuntimeAuthorizedNow: true } },
    { label: "photoInputAuthorizedNow true", override: { photoInputAuthorizedNow: true } },
    { label: "fileInputAuthorizedNow true", override: { fileInputAuthorizedNow: true } },
    { label: "documentStorageAuthorizedNow true", override: { documentStorageAuthorizedNow: true } },
    { label: "persistenceAuthorizedNow true", override: { persistenceAuthorizedNow: true } },
    { label: "publicRuntimeAuthorizedNow true", override: { publicRuntimeAuthorizedNow: true } },
    { label: "userVisibleLegalDeadlineOutputAuthorizedNow true", override: { userVisibleLegalDeadlineOutputAuthorizedNow: true } },
    { label: "liveLLMRuntimeAuthorizedNow true", override: { liveLLMRuntimeAuthorizedNow: true } },
    { label: "connectedAiRuntimeAuthorizedNow true", override: { connectedAiRuntimeAuthorizedNow: true } },
    { label: "pilotRuntimeAuthorizedNow true", override: { pilotRuntimeAuthorizedNow: true } },
    { label: "productionRuntimeAuthorizedNow true", override: { productionRuntimeAuthorizedNow: true } },
    // Legal safety flags
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    // 8.5H forward readiness
    { label: "readyFor8x5ITextDocumentBypassGuardContract false", override: { readyFor8x5ITextDocumentBypassGuardContract: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in prerequisite", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    // 8.5I contract assertions
    { label: "textDocumentBypassGuardContractOnly false", override: { textDocumentBypassGuardContractOnly: false } },
    { label: "textDocumentBypassGuardContractDefined false", override: { textDocumentBypassGuardContractDefined: false } },
    { label: "textDocumentBypassGuardRuntimeNotImplementedYet false", override: { textDocumentBypassGuardRuntimeNotImplementedYet: false } },
    { label: "textDocumentBypassGuardMustRunBeforeRunSmartTalk false", override: { textDocumentBypassGuardMustRunBeforeRunSmartTalk: false } },
    { label: "textDocumentBypassGuardMustRunBeforePromptBuild false", override: { textDocumentBypassGuardMustRunBeforePromptBuild: false } },
    { label: "textDocumentBypassGuardMustRunBeforeModelCall false", override: { textDocumentBypassGuardMustRunBeforeModelCall: false } },
    { label: "textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis false", override: { textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: false } },
    { label: "textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse false", override: { textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: false } },
    // Document-like signal contract
    { label: "documentLikeSignalContractIncludesLongPastedText false", override: { documentLikeSignalContractIncludesLongPastedText: false } },
    { label: "documentLikeSignalContractIncludesGermanAuthorityTerms false", override: { documentLikeSignalContractIncludesGermanAuthorityTerms: false } },
    { label: "documentLikeSignalContractIncludesOfficialLetterStructure false", override: { documentLikeSignalContractIncludesOfficialLetterStructure: false } },
    { label: "documentLikeSignalContractIncludesInvoiceOrMahnungTerms false", override: { documentLikeSignalContractIncludesInvoiceOrMahnungTerms: false } },
    { label: "documentLikeSignalContractIncludesBescheidOrWiderspruchTerms false", override: { documentLikeSignalContractIncludesBescheidOrWiderspruchTerms: false } },
    { label: "documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms false", override: { documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms: false } },
    { label: "documentLikeSignalContractIncludesPersonalDataMarkers false", override: { documentLikeSignalContractIncludesPersonalDataMarkers: false } },
    { label: "documentLikeSignalContractIncludesSalutationMarkers false", override: { documentLikeSignalContractIncludesSalutationMarkers: false } },
    { label: "documentLikeSignalContractIncludesReferenceNumberMarkers false", override: { documentLikeSignalContractIncludesReferenceNumberMarkers: false } },
    // Guard decision contract
    { label: "guardDecisionAllowsGeneralQuestionMode false", override: { guardDecisionAllowsGeneralQuestionMode: false } },
    { label: "guardDecisionBlocksFullDocumentInFreeQuestionMode false", override: { guardDecisionBlocksFullDocumentInFreeQuestionMode: false } },
    { label: "guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode false", override: { guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode: false } },
    { label: "guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode false", override: { guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode: false } },
    { label: "guardDecisionDoesNotTranslateFullDocumentInFreeMode false", override: { guardDecisionDoesNotTranslateFullDocumentInFreeMode: false } },
    { label: "guardDecisionDoesNotExplainFullDocumentInFreeMode false", override: { guardDecisionDoesNotExplainFullDocumentInFreeMode: false } },
    { label: "guardDecisionDoesNotCalculateExactDeadlineInFreeMode false", override: { guardDecisionDoesNotCalculateExactDeadlineInFreeMode: false } },
    { label: "guardDecisionDoesNotAuthorizeClaimsInFreeMode false", override: { guardDecisionDoesNotAuthorizeClaimsInFreeMode: false } },
    { label: "guardDecisionDoesNotExposeLegalCertaintyInFreeMode false", override: { guardDecisionDoesNotExposeLegalCertaintyInFreeMode: false } },
    // Safe response contract
    { label: "safeResponseMustUseDocumentModeRequiredCode false", override: { safeResponseMustUseDocumentModeRequiredCode: false } },
    { label: "safeResponseMustBeUserSafe false", override: { safeResponseMustBeUserSafe: false } },
    { label: "safeResponseMustNotContainFullTranslation false", override: { safeResponseMustNotContainFullTranslation: false } },
    { label: "safeResponseMustNotContainFullDocumentSummary false", override: { safeResponseMustNotContainFullDocumentSummary: false } },
    { label: "safeResponseMustNotContainLegalAdvice false", override: { safeResponseMustNotContainLegalAdvice: false } },
    { label: "safeResponseMustNotContainExactDeadline false", override: { safeResponseMustNotContainExactDeadline: false } },
    { label: "safeResponseMustNotContainClaimAuthorization false", override: { safeResponseMustNotContainClaimAuthorization: false } },
    { label: "safeResponseMustNotContainRawDocumentEcho false", override: { safeResponseMustNotContainRawDocumentEcho: false } },
    { label: "safeResponseMustPointToPaidDocumentMode false", override: { safeResponseMustPointToPaidDocumentMode: false } },
    { label: "safeResponseMayIncludeBriefGeneralGuidance false", override: { safeResponseMayIncludeBriefGeneralGuidance: false } },
    // 8.5I containment assertions
    { label: "td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted false", override: { td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: false } },
    { label: "td001DocumentBypassGuardStillRequiresRuntimeImplementation false", override: { td001DocumentBypassGuardStillRequiresRuntimeImplementation: false } },
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained false in 8.5I result", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false } },
    { label: "td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign false", override: { td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: false } },
    // 8.5I actual* performed assertions (must be false in 8.5I result)
    { label: "actualPhotoRouteQuarantinePerformed true in 8.5I result", override: { actualPhotoRouteQuarantinePerformed: true } },
    { label: "actualLiveRouteMutationPerformed true in 8.5I result", override: { actualLiveRouteMutationPerformed: true } },
    // 8.5I textBypassGuardContractConfirms*
    { label: "textBypassGuardContractConfirmsNoOpenAiCall false", override: { textBypassGuardContractConfirmsNoOpenAiCall: false } },
    { label: "textBypassGuardContractConfirmsNoFetchCall false", override: { textBypassGuardContractConfirmsNoFetchCall: false } },
    { label: "textBypassGuardContractConfirmsNoProcessEnvRead false", override: { textBypassGuardContractConfirmsNoProcessEnvRead: false } },
    { label: "textBypassGuardContractConfirmsNoSdkUsage false", override: { textBypassGuardContractConfirmsNoSdkUsage: false } },
    { label: "textBypassGuardContractConfirmsNo8x3AcRerun false", override: { textBypassGuardContractConfirmsNo8x3AcRerun: false } },
    { label: "textBypassGuardContractConfirmsNoSmartTalkRuntimeCall false", override: { textBypassGuardContractConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "textBypassGuardContractConfirmsNoRouteImport false", override: { textBypassGuardContractConfirmsNoRouteImport: false } },
    { label: "textBypassGuardContractConfirmsNoRouteMutation false", override: { textBypassGuardContractConfirmsNoRouteMutation: false } },
    { label: "textBypassGuardContractConfirmsNoPublicRouteMutation false", override: { textBypassGuardContractConfirmsNoPublicRouteMutation: false } },
    { label: "textBypassGuardContractConfirmsNoUiMutation false", override: { textBypassGuardContractConfirmsNoUiMutation: false } },
    { label: "textBypassGuardContractConfirmsNoSupabaseMutation false", override: { textBypassGuardContractConfirmsNoSupabaseMutation: false } },
    { label: "textBypassGuardContractConfirmsNoStorageMutation false", override: { textBypassGuardContractConfirmsNoStorageMutation: false } },
    { label: "textBypassGuardContractConfirmsNoDatabaseWrite false", override: { textBypassGuardContractConfirmsNoDatabaseWrite: false } },
    { label: "textBypassGuardContractConfirmsNoAuditPersistence false", override: { textBypassGuardContractConfirmsNoAuditPersistence: false } },
    { label: "textBypassGuardContractConfirmsNoPaymentRuntimeCall false", override: { textBypassGuardContractConfirmsNoPaymentRuntimeCall: false } },
    { label: "textBypassGuardContractConfirmsNoOcrRuntimeCall false", override: { textBypassGuardContractConfirmsNoOcrRuntimeCall: false } },
    { label: "textBypassGuardContractConfirmsNoPhotoInputProcessing false", override: { textBypassGuardContractConfirmsNoPhotoInputProcessing: false } },
    { label: "textBypassGuardContractConfirmsNoFileInputProcessing false", override: { textBypassGuardContractConfirmsNoFileInputProcessing: false } },
    { label: "textBypassGuardContractConfirmsNoDocumentParsingRuntime false", override: { textBypassGuardContractConfirmsNoDocumentParsingRuntime: false } },
    { label: "textBypassGuardContractConfirmsNoRawDocumentStorage false", override: { textBypassGuardContractConfirmsNoRawDocumentStorage: false } },
    { label: "textBypassGuardContractConfirmsNoModelOutputStorage false", override: { textBypassGuardContractConfirmsNoModelOutputStorage: false } },
    { label: "textBypassGuardContractConfirmsNoPromptStorage false", override: { textBypassGuardContractConfirmsNoPromptStorage: false } },
    { label: "textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation false", override: { textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation: false } },
    { label: "textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis false", override: { textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis: false } },
    { label: "textBypassGuardContractConfirmsNoEvidenceEvaluation false", override: { textBypassGuardContractConfirmsNoEvidenceEvaluation: false } },
    { label: "textBypassGuardContractConfirmsNoClaimAuthorization false", override: { textBypassGuardContractConfirmsNoClaimAuthorization: false } },
    { label: "textBypassGuardContractConfirmsNoDeadlineCalculation false", override: { textBypassGuardContractConfirmsNoDeadlineCalculation: false } },
    { label: "textBypassGuardContractConfirmsNoLegalCertainty false", override: { textBypassGuardContractConfirmsNoLegalCertainty: false } },
    // 8.5I forward readiness
    { label: "readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan false", override: { readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in 8.5I result", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
  ];

  const tamperFailures: string[] = [];
  for (const tc of tamperCases) {
    const tampered = { ...canonicalInput, ...tc.override } as Record<string, unknown>;
    const result = validateBypassGuardContractInput(tampered);
    if (result.accepted) {
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }
  const allTamperRejected = tamperFailures.length === 0;

  const allPassed =
    prereqValidation.accepted &&
    allTamperRejected &&
    quarantineResult.allPassed &&
    quarantineResult.readyFor8x5ITextDocumentBypassGuardContract;

  const prereqNote =
    prereqValidation.accepted
      ? "contract input validation: accepted — reasons: none"
      : `contract input validation: REJECTED — reasons: ${prereqValidation.reasons.join(", ")}`;

  const tamperNote =
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`;

  const finalNote = allPassed
    ? "PHASE 8.5I allPassed: true — controlled real-document Text Document Bypass Guard contract accepted"
    : "PHASE 8.5I allPassed: false — see notes for failures";

  const notes: string[] = [
    "8.5I is a controlled real-document Text Document Bypass Guard contract layer",
    "8.5I depends on completed 8.5H Photo OCR route runtime quarantine",
    "8.5I is contract/planning-only",
    "/api/smart-talk was not modified in 8.5I",
    "the live runtime guard is not implemented yet",
    "document-like pasted text in Free Q&A must be detected before runSmartTalk, prompt build, model call, or full document analysis",
    "full document translation/explanation must not be provided in Free Q&A",
    "document-like text must be redirected to Paid Document Mode or blocked with safe document_mode_required response",
    "only brief general safety guidance may be returned in Free Mode",
    "TD-001 is contracted but still requires runtime implementation",
    "TD-003 photo OCR route remains contained",
    "TD-004 pre-model PII redaction remains unresolved",
    "TD-005 Paid Document Mode server boundary remains unresolved",
    "TD-002 Evidence Gate runtime wiring remains unresolved",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no final go-live authorization was granted",
    "no real document input or processing was performed",
    "no OCR/photo/file/storage/persistence was performed",
    "no user-visible document explanation was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5I",
    "8.3AC was not re-run",
    "the next phase is 8.5J Text Document Bypass Guard Runtime Implementation Plan",
    "readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan is planning readiness only, not runtime authorization",
    "8.5H prerequisite: allPassed=true, photoOcrRouteRuntimeQuarantineOnly=true, photoOcrRouteRuntimeQuarantineApplied=true",
    prereqNote,
    tamperNote,
    ...tamperFailures,
    finalNote,
    "TD-001 /api/smart-talk Document Bypass Guard is contracted; runtime implementation is still required",
  ];

  return {
    checkId: "8.5I",
    allPassed,
    photoOcrRouteRuntimeQuarantineReadyForTextDocumentBypassGuardContract:
      quarantineResult.readyFor8x5ITextDocumentBypassGuardContract,
    controlledRealDocumentTextDocumentBypassGuardContractAccepted:
      prereqValidation.accepted && allTamperRejected,
    textDocumentBypassGuardContractOnly: true,
    textDocumentBypassGuardContractDefined: true,
    textDocumentBypassGuardRuntimeNotImplementedYet: true,
    textDocumentBypassGuardMustRunBeforeRunSmartTalk: true,
    textDocumentBypassGuardMustRunBeforePromptBuild: true,
    textDocumentBypassGuardMustRunBeforeModelCall: true,
    textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: true,
    textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: true,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    documentLikeSignalContractIncludesLongPastedText: true,
    documentLikeSignalContractIncludesGermanAuthorityTerms: true,
    documentLikeSignalContractIncludesOfficialLetterStructure: true,
    documentLikeSignalContractIncludesInvoiceOrMahnungTerms: true,
    documentLikeSignalContractIncludesBescheidOrWiderspruchTerms: true,
    documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms: true,
    documentLikeSignalContractIncludesPersonalDataMarkers: true,
    documentLikeSignalContractIncludesSalutationMarkers: true,
    documentLikeSignalContractIncludesReferenceNumberMarkers: true,

    guardDecisionAllowsGeneralQuestionMode: true,
    guardDecisionBlocksFullDocumentInFreeQuestionMode: true,
    guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode: true,
    guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode: true,
    guardDecisionDoesNotTranslateFullDocumentInFreeMode: true,
    guardDecisionDoesNotExplainFullDocumentInFreeMode: true,
    guardDecisionDoesNotCalculateExactDeadlineInFreeMode: true,
    guardDecisionDoesNotAuthorizeClaimsInFreeMode: true,
    guardDecisionDoesNotExposeLegalCertaintyInFreeMode: true,

    safeResponseMustUseDocumentModeRequiredCode: true,
    safeResponseMustBeUserSafe: true,
    safeResponseMustNotContainFullTranslation: true,
    safeResponseMustNotContainFullDocumentSummary: true,
    safeResponseMustNotContainLegalAdvice: true,
    safeResponseMustNotContainExactDeadline: true,
    safeResponseMustNotContainClaimAuthorization: true,
    safeResponseMustNotContainRawDocumentEcho: true,
    safeResponseMustPointToPaidDocumentMode: true,
    safeResponseMayIncludeBriefGeneralGuidance: true,

    td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: true,
    td001DocumentBypassGuardStillRequiresRuntimeImplementation: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      quarantineResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,

    td004PreModelPiiRedactionMissing: quarantineResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      quarantineResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      quarantineResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,

    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      quarantineResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      quarantineResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe:
      quarantineResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: quarantineResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: quarantineResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: false,

    actualRealDocumentInputPerformed: false,
    actualRealDocumentProcessingPerformed: false,
    actualOcrPerformed: false,
    actualPhotoInputProcessed: false,
    actualFileInputProcessed: false,
    actualDocumentStoragePerformed: false,
    actualDatabasePersistencePerformed: false,
    actualAuditPersistencePerformed: false,
    actualUserVisibleOutputPerformed: false,
    actualPublicRuntimeEnabled: false,
    actualEvidenceEvaluationPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualDeadlineCalculationPerformed: false,
    actualPhotoRouteQuarantinePerformed: false,
    actualLiveRouteMutationPerformed: false,
    actualDocumentBypassGuardImplemented: false,
    actualPaidDocumentModeImplemented: false,
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    textBypassGuardContractConfirmsNoOpenAiCall: true,
    textBypassGuardContractConfirmsNoFetchCall: true,
    textBypassGuardContractConfirmsNoProcessEnvRead: true,
    textBypassGuardContractConfirmsNoSdkUsage: true,
    textBypassGuardContractConfirmsNo8x3AcRerun: true,
    textBypassGuardContractConfirmsNoSmartTalkRuntimeCall: true,
    textBypassGuardContractConfirmsNoRouteImport: true,
    textBypassGuardContractConfirmsNoRouteMutation: true,
    textBypassGuardContractConfirmsNoPublicRouteMutation: true,
    textBypassGuardContractConfirmsNoUiMutation: true,
    textBypassGuardContractConfirmsNoSupabaseMutation: true,
    textBypassGuardContractConfirmsNoStorageMutation: true,
    textBypassGuardContractConfirmsNoDatabaseWrite: true,
    textBypassGuardContractConfirmsNoAuditPersistence: true,
    textBypassGuardContractConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardContractConfirmsNoOcrRuntimeCall: true,
    textBypassGuardContractConfirmsNoPhotoInputProcessing: true,
    textBypassGuardContractConfirmsNoFileInputProcessing: true,
    textBypassGuardContractConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardContractConfirmsNoRawDocumentStorage: true,
    textBypassGuardContractConfirmsNoModelOutputStorage: true,
    textBypassGuardContractConfirmsNoPromptStorage: true,
    textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardContractConfirmsNoEvidenceEvaluation: true,
    textBypassGuardContractConfirmsNoClaimAuthorization: true,
    textBypassGuardContractConfirmsNoDeadlineCalculation: true,
    textBypassGuardContractConfirmsNoLegalCertainty: true,

    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: false,
    paymentPipelineActuallyExecuted: false,
    userVisiblePipelineActuallyExecuted: false,

    realDocumentInputAuthorizedNow: false,
    realDocumentProcessingAuthorizedNow: false,
    realUserDocumentUploadAuthorizedNow: false,
    ocrRuntimeAuthorizedNow: false,
    photoInputAuthorizedNow: false,
    fileInputAuthorizedNow: false,
    documentStorageAuthorizedNow: false,
    persistenceAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    userVisibleLegalDeadlineOutputAuthorizedNow: false,
    liveLLMRuntimeAuthorizedNow: false,
    connectedAiRuntimeAuthorizedNow: false,
    pilotRuntimeAuthorizedNow: false,
    productionRuntimeAuthorizedNow: false,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes,
  };
}
