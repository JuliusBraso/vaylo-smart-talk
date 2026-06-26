/**
 * Phase 8.5J — Controlled Real Document Text Document Bypass Guard Runtime
 * Implementation Plan.
 *
 * IMPLEMENTATION-PLAN-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5I.
 *
 * This file defines the runtime implementation plan for the Text Document
 * Bypass Guard for /api/smart-talk. It does NOT patch the route.
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

import { runControlledRealDocumentTextDocumentBypassGuardContract } from "./run-controlled-real-document-text-document-bypass-guard-contract";

// ── Local implementation plan input type ──────────────────────────────────────

interface ControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanInput {
  // 8.5I prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardContractAccepted: boolean;
  readonly textDocumentBypassGuardContractOnly: boolean;
  readonly textDocumentBypassGuardContractDefined: boolean;
  readonly textDocumentBypassGuardRuntimeNotImplementedYet: boolean;
  readonly textDocumentBypassGuardMustRunBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardMustRunBeforePromptBuild: boolean;
  readonly textDocumentBypassGuardMustRunBeforeModelCall: boolean;
  readonly textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: boolean;
  readonly textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

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

  // TD and containment flags
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: boolean;
  readonly td001DocumentBypassGuardStillRequiresRuntimeImplementation: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // Actual performed flags (must all be false)
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
  readonly actualPhotoRouteQuarantinePerformed: boolean;
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;

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

  // 8.5I forward readiness
  readonly readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5J implementation plan assertions (must all be true)
  readonly textDocumentBypassGuardRuntimeImplementationPlanOnly: boolean;
  readonly textDocumentBypassGuardRuntimeImplementationPlanDefined: boolean;
  readonly textDocumentBypassGuardRuntimeStillNotImplemented: boolean;
  readonly textDocumentBypassGuardRoutePatchNotPerformed: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforePromptBuild: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeModelCall: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis: boolean;
  readonly textDocumentBypassGuardMustShortCircuitDocumentLikeText: boolean;
  readonly textDocumentBypassGuardMustAllowGeneralQuestions: boolean;

  // Runtime integration plan flags (must all be true)
  readonly runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk: boolean;
  readonly runtimePlanRequiresNoModelCallForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoRawDocumentEchoInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoExactDeadlineInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoLegalCertaintyInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoClaimAuthorizationInBlockedResponse: boolean;
  readonly runtimePlanRequiresSafeResponseCodeDocumentModeRequired: boolean;
  readonly runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime: boolean;
  readonly runtimePlanRequiresBriefGeneralGuidanceOnly: boolean;
  readonly runtimePlanRequiresServerSideGuardNotUiOnly: boolean;
  readonly runtimePlanRequiresDeterministicPreModelHeuristic: boolean;
  readonly runtimePlanRequiresConservativeFalsePositiveSafeHandling: boolean;
  readonly runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite: boolean;

  // Document-like detection plan flags (must all be true)
  readonly detectionPlanUsesLengthThresholds: boolean;
  readonly detectionPlanUsesOfficialLetterMarkers: boolean;
  readonly detectionPlanUsesGermanAuthorityMarkers: boolean;
  readonly detectionPlanUsesInvoiceMahnungMarkers: boolean;
  readonly detectionPlanUsesBescheidWiderspruchMarkers: boolean;
  readonly detectionPlanUsesDeadlineLegalConsequenceMarkers: boolean;
  readonly detectionPlanUsesPersonalDataMarkers: boolean;
  readonly detectionPlanUsesReferenceNumberMarkers: boolean;
  readonly detectionPlanUsesSalutationAndSignatureMarkers: boolean;
  readonly detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly: boolean;
  readonly detectionPlanRequiresQuestionLikeGeneralTextSafePass: boolean;
  readonly detectionPlanRequiresHighRiskDocumentLikeTextBlocked: boolean;

  // Safe response plan flags (must all be true)
  readonly safeResponsePlanStatusShouldBeNonSuccess: boolean;
  readonly safeResponsePlanCodeShouldBeDocumentModeRequired: boolean;
  readonly safeResponsePlanOkShouldBeFalse: boolean;
  readonly safeResponsePlanMessageShouldBeShortAndUserSafe: boolean;
  readonly safeResponsePlanShouldNotExposeInternalGovernance: boolean;
  readonly safeResponsePlanShouldNotMentionTamperOrAuditInternals: boolean;
  readonly safeResponsePlanShouldNotEchoPastedDocument: boolean;
  readonly safeResponsePlanShouldNotTranslateDocument: boolean;
  readonly safeResponsePlanShouldNotSummarizeDocument: boolean;
  readonly safeResponsePlanShouldNotProvideLegalAdvice: boolean;
  readonly safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable: boolean;
  readonly safeResponsePlanMaySuggestGeneralQuestionRephrase: boolean;

  // 8.5J TD containment assertions (must all be true)
  readonly td001DocumentBypassGuardRuntimeImplementationPlanned: boolean;
  readonly td001DocumentBypassGuardStillRequiresRoutePatch: boolean;

  // 8.5J audit confirms no side effects (must all be true)
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty: boolean;

  // 8.5J forward readiness
  readonly readyFor8x5KTextDocumentBypassGuardRuntimeContract: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanResult {
  readonly checkId: "8.5J";
  readonly allPassed: boolean;
  readonly textDocumentBypassGuardContractReadyForRuntimeImplementationPlan: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanAccepted: boolean;
  readonly textDocumentBypassGuardRuntimeImplementationPlanOnly: true;
  readonly textDocumentBypassGuardRuntimeImplementationPlanDefined: true;
  readonly textDocumentBypassGuardRuntimeStillNotImplemented: boolean;
  readonly textDocumentBypassGuardRoutePatchNotPerformed: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforePromptBuild: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeModelCall: boolean;
  readonly textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis: boolean;
  readonly textDocumentBypassGuardMustShortCircuitDocumentLikeText: boolean;
  readonly textDocumentBypassGuardMustAllowGeneralQuestions: boolean;
  readonly textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: boolean;
  readonly tamperCasesRejected: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Runtime integration plan flags
  readonly runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk: boolean;
  readonly runtimePlanRequiresNoModelCallForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText: boolean;
  readonly runtimePlanRequiresNoRawDocumentEchoInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoExactDeadlineInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoLegalCertaintyInBlockedResponse: boolean;
  readonly runtimePlanRequiresNoClaimAuthorizationInBlockedResponse: boolean;
  readonly runtimePlanRequiresSafeResponseCodeDocumentModeRequired: boolean;
  readonly runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime: boolean;
  readonly runtimePlanRequiresBriefGeneralGuidanceOnly: boolean;
  readonly runtimePlanRequiresServerSideGuardNotUiOnly: boolean;
  readonly runtimePlanRequiresDeterministicPreModelHeuristic: boolean;
  readonly runtimePlanRequiresConservativeFalsePositiveSafeHandling: boolean;
  readonly runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite: boolean;

  // Document-like detection plan flags
  readonly detectionPlanUsesLengthThresholds: boolean;
  readonly detectionPlanUsesOfficialLetterMarkers: boolean;
  readonly detectionPlanUsesGermanAuthorityMarkers: boolean;
  readonly detectionPlanUsesInvoiceMahnungMarkers: boolean;
  readonly detectionPlanUsesBescheidWiderspruchMarkers: boolean;
  readonly detectionPlanUsesDeadlineLegalConsequenceMarkers: boolean;
  readonly detectionPlanUsesPersonalDataMarkers: boolean;
  readonly detectionPlanUsesReferenceNumberMarkers: boolean;
  readonly detectionPlanUsesSalutationAndSignatureMarkers: boolean;
  readonly detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly: boolean;
  readonly detectionPlanRequiresQuestionLikeGeneralTextSafePass: boolean;
  readonly detectionPlanRequiresHighRiskDocumentLikeTextBlocked: boolean;

  // Safe response plan flags
  readonly safeResponsePlanStatusShouldBeNonSuccess: boolean;
  readonly safeResponsePlanCodeShouldBeDocumentModeRequired: boolean;
  readonly safeResponsePlanOkShouldBeFalse: boolean;
  readonly safeResponsePlanMessageShouldBeShortAndUserSafe: boolean;
  readonly safeResponsePlanShouldNotExposeInternalGovernance: boolean;
  readonly safeResponsePlanShouldNotMentionTamperOrAuditInternals: boolean;
  readonly safeResponsePlanShouldNotEchoPastedDocument: boolean;
  readonly safeResponsePlanShouldNotTranslateDocument: boolean;
  readonly safeResponsePlanShouldNotSummarizeDocument: boolean;
  readonly safeResponsePlanShouldNotProvideLegalAdvice: boolean;
  readonly safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable: boolean;
  readonly safeResponsePlanMaySuggestGeneralQuestionRephrase: boolean;

  // TD containment status
  readonly td001DocumentBypassGuardRuntimeImplementationPlanned: boolean;
  readonly td001DocumentBypassGuardStillRequiresRoutePatch: boolean;
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

  // Actual performed flags (all false in 8.5J)
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
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty: boolean;

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
  readonly readyFor8x5KTextDocumentBypassGuardRuntimeContract: boolean;
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

// ── Implementation plan input validator ───────────────────────────────────────

function validateImplementationPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5I prerequisite gates
  if (o["prereqCheckId"] !== "8.5I")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentTextDocumentBypassGuardContractAccepted"] !== true)
    reasons.push("contract_not_accepted");
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

  // TD and containment flags (must be true)
  if (o["td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted"] !== true)
    reasons.push("td001_contracted_false");
  if (o["td001DocumentBypassGuardStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td001_still_requires_runtime_implementation_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_still_requires_future_authorized_runtime_design_false");
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

  // Actual performed flags (must be false)
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
  if (o["actualPhotoRouteQuarantinePerformed"] !== false)
    reasons.push("actual_photo_route_quarantine_performed");
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("actual_paid_document_mode_implemented");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed");

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

  // 8.5I forward readiness
  if (o["readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan"] !== true)
    reasons.push("ready_for_8x5j_false");
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

  // 8.5J implementation plan assertions (must be true)
  if (o["textDocumentBypassGuardRuntimeImplementationPlanOnly"] !== true)
    reasons.push("text_document_bypass_guard_runtime_implementation_plan_only_false");
  if (o["textDocumentBypassGuardRuntimeImplementationPlanDefined"] !== true)
    reasons.push("text_document_bypass_guard_runtime_implementation_plan_defined_false");
  if (o["textDocumentBypassGuardRuntimeStillNotImplemented"] !== true)
    reasons.push("text_document_bypass_guard_runtime_still_not_implemented_false");
  if (o["textDocumentBypassGuardRoutePatchNotPerformed"] !== true)
    reasons.push("text_document_bypass_guard_route_patch_not_performed_false");
  if (o["textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk"] !== true)
    reasons.push("text_document_bypass_guard_must_be_inserted_before_run_smart_talk_false");
  if (o["textDocumentBypassGuardMustBeInsertedBeforePromptBuild"] !== true)
    reasons.push("text_document_bypass_guard_must_be_inserted_before_prompt_build_false");
  if (o["textDocumentBypassGuardMustBeInsertedBeforeModelCall"] !== true)
    reasons.push("text_document_bypass_guard_must_be_inserted_before_model_call_false");
  if (o["textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis"] !== true)
    reasons.push("text_document_bypass_guard_must_be_inserted_before_full_document_analysis_false");
  if (o["textDocumentBypassGuardMustShortCircuitDocumentLikeText"] !== true)
    reasons.push("text_document_bypass_guard_must_short_circuit_document_like_text_false");
  if (o["textDocumentBypassGuardMustAllowGeneralQuestions"] !== true)
    reasons.push("text_document_bypass_guard_must_allow_general_questions_false");

  // Runtime integration plan flags (must be true)
  if (o["runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk"] !== true)
    reasons.push("runtime_plan_identifies_insertion_point_false");
  if (o["runtimePlanRequiresNoModelCallForBlockedDocumentLikeText"] !== true)
    reasons.push("runtime_plan_requires_no_model_call_false");
  if (o["runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText"] !== true)
    reasons.push("runtime_plan_requires_no_prompt_build_false");
  if (o["runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText"] !== true)
    reasons.push("runtime_plan_requires_no_full_document_analysis_false");
  if (o["runtimePlanRequiresNoRawDocumentEchoInBlockedResponse"] !== true)
    reasons.push("runtime_plan_requires_no_raw_document_echo_false");
  if (o["runtimePlanRequiresNoExactDeadlineInBlockedResponse"] !== true)
    reasons.push("runtime_plan_requires_no_exact_deadline_false");
  if (o["runtimePlanRequiresNoLegalCertaintyInBlockedResponse"] !== true)
    reasons.push("runtime_plan_requires_no_legal_certainty_false");
  if (o["runtimePlanRequiresNoClaimAuthorizationInBlockedResponse"] !== true)
    reasons.push("runtime_plan_requires_no_claim_authorization_false");
  if (o["runtimePlanRequiresSafeResponseCodeDocumentModeRequired"] !== true)
    reasons.push("runtime_plan_requires_safe_response_code_document_mode_required_false");
  if (o["runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime"] !== true)
    reasons.push("runtime_plan_requires_paid_document_mode_pointer_false");
  if (o["runtimePlanRequiresBriefGeneralGuidanceOnly"] !== true)
    reasons.push("runtime_plan_requires_brief_general_guidance_only_false");
  if (o["runtimePlanRequiresServerSideGuardNotUiOnly"] !== true)
    reasons.push("runtime_plan_requires_server_side_guard_not_ui_only_false");
  if (o["runtimePlanRequiresDeterministicPreModelHeuristic"] !== true)
    reasons.push("runtime_plan_requires_deterministic_pre_model_heuristic_false");
  if (o["runtimePlanRequiresConservativeFalsePositiveSafeHandling"] !== true)
    reasons.push("runtime_plan_requires_conservative_false_positive_safe_handling_false");
  if (o["runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite"] !== true)
    reasons.push("runtime_plan_requires_no_storage_no_persistence_no_audit_write_false");

  // Detection plan flags (must be true)
  if (o["detectionPlanUsesLengthThresholds"] !== true)
    reasons.push("detection_plan_uses_length_thresholds_false");
  if (o["detectionPlanUsesOfficialLetterMarkers"] !== true)
    reasons.push("detection_plan_uses_official_letter_markers_false");
  if (o["detectionPlanUsesGermanAuthorityMarkers"] !== true)
    reasons.push("detection_plan_uses_german_authority_markers_false");
  if (o["detectionPlanUsesInvoiceMahnungMarkers"] !== true)
    reasons.push("detection_plan_uses_invoice_mahnung_markers_false");
  if (o["detectionPlanUsesBescheidWiderspruchMarkers"] !== true)
    reasons.push("detection_plan_uses_bescheid_widerspruch_markers_false");
  if (o["detectionPlanUsesDeadlineLegalConsequenceMarkers"] !== true)
    reasons.push("detection_plan_uses_deadline_legal_consequence_markers_false");
  if (o["detectionPlanUsesPersonalDataMarkers"] !== true)
    reasons.push("detection_plan_uses_personal_data_markers_false");
  if (o["detectionPlanUsesReferenceNumberMarkers"] !== true)
    reasons.push("detection_plan_uses_reference_number_markers_false");
  if (o["detectionPlanUsesSalutationAndSignatureMarkers"] !== true)
    reasons.push("detection_plan_uses_salutation_and_signature_markers_false");
  if (o["detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly"] !== true)
    reasons.push("detection_plan_requires_multi_signal_scoring_not_single_keyword_only_false");
  if (o["detectionPlanRequiresQuestionLikeGeneralTextSafePass"] !== true)
    reasons.push("detection_plan_requires_question_like_general_text_safe_pass_false");
  if (o["detectionPlanRequiresHighRiskDocumentLikeTextBlocked"] !== true)
    reasons.push("detection_plan_requires_high_risk_document_like_text_blocked_false");

  // Safe response plan flags (must be true)
  if (o["safeResponsePlanStatusShouldBeNonSuccess"] !== true)
    reasons.push("safe_response_plan_status_should_be_non_success_false");
  if (o["safeResponsePlanCodeShouldBeDocumentModeRequired"] !== true)
    reasons.push("safe_response_plan_code_should_be_document_mode_required_false");
  if (o["safeResponsePlanOkShouldBeFalse"] !== true)
    reasons.push("safe_response_plan_ok_should_be_false_false");
  if (o["safeResponsePlanMessageShouldBeShortAndUserSafe"] !== true)
    reasons.push("safe_response_plan_message_should_be_short_and_user_safe_false");
  if (o["safeResponsePlanShouldNotExposeInternalGovernance"] !== true)
    reasons.push("safe_response_plan_should_not_expose_internal_governance_false");
  if (o["safeResponsePlanShouldNotMentionTamperOrAuditInternals"] !== true)
    reasons.push("safe_response_plan_should_not_mention_tamper_or_audit_internals_false");
  if (o["safeResponsePlanShouldNotEchoPastedDocument"] !== true)
    reasons.push("safe_response_plan_should_not_echo_pasted_document_false");
  if (o["safeResponsePlanShouldNotTranslateDocument"] !== true)
    reasons.push("safe_response_plan_should_not_translate_document_false");
  if (o["safeResponsePlanShouldNotSummarizeDocument"] !== true)
    reasons.push("safe_response_plan_should_not_summarize_document_false");
  if (o["safeResponsePlanShouldNotProvideLegalAdvice"] !== true)
    reasons.push("safe_response_plan_should_not_provide_legal_advice_false");
  if (o["safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable"] !== true)
    reasons.push("safe_response_plan_should_point_to_paid_document_mode_when_available_false");
  if (o["safeResponsePlanMaySuggestGeneralQuestionRephrase"] !== true)
    reasons.push("safe_response_plan_may_suggest_general_question_rephrase_false");

  // 8.5J TD containment assertions (must be true)
  if (o["td001DocumentBypassGuardRuntimeImplementationPlanned"] !== true)
    reasons.push("td001_runtime_implementation_planned_false");
  if (o["td001DocumentBypassGuardStillRequiresRoutePatch"] !== true)
    reasons.push("td001_still_requires_route_patch_false");

  // 8.5J audit confirms no side effects (must be true)
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall"] !== true)
    reasons.push("plan_confirms_no_open_ai_call_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall"] !== true)
    reasons.push("plan_confirms_no_fetch_call_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead"] !== true)
    reasons.push("plan_confirms_no_process_env_read_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage"] !== true)
    reasons.push("plan_confirms_no_sdk_usage_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun"] !== true)
    reasons.push("plan_confirms_no_8x3ac_rerun_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_smart_talk_runtime_call_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport"] !== true)
    reasons.push("plan_confirms_no_route_import_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation"] !== true)
    reasons.push("plan_confirms_no_route_mutation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("plan_confirms_no_public_route_mutation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation"] !== true)
    reasons.push("plan_confirms_no_ui_mutation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation"] !== true)
    reasons.push("plan_confirms_no_supabase_mutation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation"] !== true)
    reasons.push("plan_confirms_no_storage_mutation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite"] !== true)
    reasons.push("plan_confirms_no_database_write_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence"] !== true)
    reasons.push("plan_confirms_no_audit_persistence_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_payment_runtime_call_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_ocr_runtime_call_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("plan_confirms_no_photo_input_processing_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing"] !== true)
    reasons.push("plan_confirms_no_file_input_processing_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("plan_confirms_no_document_parsing_runtime_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("plan_confirms_no_raw_document_storage_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage"] !== true)
    reasons.push("plan_confirms_no_model_output_storage_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage"] !== true)
    reasons.push("plan_confirms_no_prompt_storage_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("plan_confirms_no_user_visible_document_explanation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("plan_confirms_no_customer_facing_document_analysis_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("plan_confirms_no_evidence_evaluation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization"] !== true)
    reasons.push("plan_confirms_no_claim_authorization_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("plan_confirms_no_deadline_calculation_false");
  if (o["textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty"] !== true)
    reasons.push("plan_confirms_no_legal_certainty_false");

  // 8.5J forward readiness
  if (o["readyFor8x5KTextDocumentBypassGuardRuntimeContract"] !== true)
    reasons.push("ready_for_8x5k_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main function ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlan(): ControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanResult {
  const contractResult = runControlledRealDocumentTextDocumentBypassGuardContract();

  const canonicalInput: ControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanInput =
    {
      // 8.5I prerequisite gates
      prereqCheckId: contractResult.checkId,
      prereqAllPassed: contractResult.allPassed,
      controlledRealDocumentTextDocumentBypassGuardContractAccepted:
        contractResult.controlledRealDocumentTextDocumentBypassGuardContractAccepted,
      textDocumentBypassGuardContractOnly: contractResult.textDocumentBypassGuardContractOnly,
      textDocumentBypassGuardContractDefined: contractResult.textDocumentBypassGuardContractDefined,
      textDocumentBypassGuardRuntimeNotImplementedYet:
        contractResult.textDocumentBypassGuardRuntimeNotImplementedYet,
      textDocumentBypassGuardMustRunBeforeRunSmartTalk:
        contractResult.textDocumentBypassGuardMustRunBeforeRunSmartTalk,
      textDocumentBypassGuardMustRunBeforePromptBuild:
        contractResult.textDocumentBypassGuardMustRunBeforePromptBuild,
      textDocumentBypassGuardMustRunBeforeModelCall:
        contractResult.textDocumentBypassGuardMustRunBeforeModelCall,
      textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis:
        contractResult.textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis,
      textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse:
        contractResult.textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse,

      // Authorization grants
      runtimeAuthorizationGranted: contractResult.runtimeAuthorizationGranted,
      pilotAuthorizationGranted: contractResult.pilotAuthorizationGranted,
      productionAuthorizationGranted: contractResult.productionAuthorizationGranted,
      finalAuthorizationGranted: contractResult.finalAuthorizationGranted,
      goLiveAuthorizationGranted: contractResult.goLiveAuthorizationGranted,

      // Document-like signal contract
      documentLikeSignalContractIncludesLongPastedText:
        contractResult.documentLikeSignalContractIncludesLongPastedText,
      documentLikeSignalContractIncludesGermanAuthorityTerms:
        contractResult.documentLikeSignalContractIncludesGermanAuthorityTerms,
      documentLikeSignalContractIncludesOfficialLetterStructure:
        contractResult.documentLikeSignalContractIncludesOfficialLetterStructure,
      documentLikeSignalContractIncludesInvoiceOrMahnungTerms:
        contractResult.documentLikeSignalContractIncludesInvoiceOrMahnungTerms,
      documentLikeSignalContractIncludesBescheidOrWiderspruchTerms:
        contractResult.documentLikeSignalContractIncludesBescheidOrWiderspruchTerms,
      documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms:
        contractResult.documentLikeSignalContractIncludesDeadlineOrLegalConsequenceTerms,
      documentLikeSignalContractIncludesPersonalDataMarkers:
        contractResult.documentLikeSignalContractIncludesPersonalDataMarkers,
      documentLikeSignalContractIncludesSalutationMarkers:
        contractResult.documentLikeSignalContractIncludesSalutationMarkers,
      documentLikeSignalContractIncludesReferenceNumberMarkers:
        contractResult.documentLikeSignalContractIncludesReferenceNumberMarkers,

      // Guard decision contract
      guardDecisionAllowsGeneralQuestionMode: contractResult.guardDecisionAllowsGeneralQuestionMode,
      guardDecisionBlocksFullDocumentInFreeQuestionMode:
        contractResult.guardDecisionBlocksFullDocumentInFreeQuestionMode,
      guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode:
        contractResult.guardDecisionRedirectsDocumentLikeTextToPaidDocumentMode,
      guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode:
        contractResult.guardDecisionAllowsOnlyBriefGeneralSafetyGuidanceInFreeMode,
      guardDecisionDoesNotTranslateFullDocumentInFreeMode:
        contractResult.guardDecisionDoesNotTranslateFullDocumentInFreeMode,
      guardDecisionDoesNotExplainFullDocumentInFreeMode:
        contractResult.guardDecisionDoesNotExplainFullDocumentInFreeMode,
      guardDecisionDoesNotCalculateExactDeadlineInFreeMode:
        contractResult.guardDecisionDoesNotCalculateExactDeadlineInFreeMode,
      guardDecisionDoesNotAuthorizeClaimsInFreeMode:
        contractResult.guardDecisionDoesNotAuthorizeClaimsInFreeMode,
      guardDecisionDoesNotExposeLegalCertaintyInFreeMode:
        contractResult.guardDecisionDoesNotExposeLegalCertaintyInFreeMode,

      // Safe response contract
      safeResponseMustUseDocumentModeRequiredCode:
        contractResult.safeResponseMustUseDocumentModeRequiredCode,
      safeResponseMustBeUserSafe: contractResult.safeResponseMustBeUserSafe,
      safeResponseMustNotContainFullTranslation:
        contractResult.safeResponseMustNotContainFullTranslation,
      safeResponseMustNotContainFullDocumentSummary:
        contractResult.safeResponseMustNotContainFullDocumentSummary,
      safeResponseMustNotContainLegalAdvice: contractResult.safeResponseMustNotContainLegalAdvice,
      safeResponseMustNotContainExactDeadline:
        contractResult.safeResponseMustNotContainExactDeadline,
      safeResponseMustNotContainClaimAuthorization:
        contractResult.safeResponseMustNotContainClaimAuthorization,
      safeResponseMustNotContainRawDocumentEcho:
        contractResult.safeResponseMustNotContainRawDocumentEcho,
      safeResponseMustPointToPaidDocumentMode:
        contractResult.safeResponseMustPointToPaidDocumentMode,
      safeResponseMayIncludeBriefGeneralGuidance:
        contractResult.safeResponseMayIncludeBriefGeneralGuidance,

      // TD and containment flags
      td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted:
        contractResult.td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted,
      td001DocumentBypassGuardStillRequiresRuntimeImplementation:
        contractResult.td001DocumentBypassGuardStillRequiresRuntimeImplementation,
      td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
        contractResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
      td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
        contractResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
      td004PreModelPiiRedactionMissing: contractResult.td004PreModelPiiRedactionMissing,
      td005PaidDocumentModeNotServerSideEnforced:
        contractResult.td005PaidDocumentModeNotServerSideEnforced,
      td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
        contractResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
      td006EvidenceGateTodoAndOrSemanticsUnresolved:
        contractResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
      td007TrapClaimDispositionNamespaceHardeningUnresolved:
        contractResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
      td008InMemoryRateLimiterServerlessUnsafe: contractResult.td008InMemoryRateLimiterServerlessUnsafe,
      td010GetUserStateDocumentTypeTodoOpen: contractResult.td010GetUserStateDocumentTypeTodoOpen,
      td009TmpDebugRunnerDebtClosed: contractResult.td009TmpDebugRunnerDebtClosed,
      tmpFilesPresentInWorkingTree: contractResult.tmpFilesPresentInWorkingTree,

      // Actual performed flags
      actualRealDocumentInputPerformed: contractResult.actualRealDocumentInputPerformed,
      actualRealDocumentProcessingPerformed: contractResult.actualRealDocumentProcessingPerformed,
      actualOcrPerformed: contractResult.actualOcrPerformed,
      actualPhotoInputProcessed: contractResult.actualPhotoInputProcessed,
      actualFileInputProcessed: contractResult.actualFileInputProcessed,
      actualDocumentStoragePerformed: contractResult.actualDocumentStoragePerformed,
      actualDatabasePersistencePerformed: contractResult.actualDatabasePersistencePerformed,
      actualAuditPersistencePerformed: contractResult.actualAuditPersistencePerformed,
      actualUserVisibleOutputPerformed: contractResult.actualUserVisibleOutputPerformed,
      actualPublicRuntimeEnabled: contractResult.actualPublicRuntimeEnabled,
      actualEvidenceEvaluationPerformed: contractResult.actualEvidenceEvaluationPerformed,
      actualClaimAuthorizationPerformed: contractResult.actualClaimAuthorizationPerformed,
      actualDeadlineCalculationPerformed: contractResult.actualDeadlineCalculationPerformed,
      actualPhotoRouteQuarantinePerformed: contractResult.actualPhotoRouteQuarantinePerformed,
      actualLiveRouteMutationPerformed: contractResult.actualLiveRouteMutationPerformed,
      actualDocumentBypassGuardImplemented: contractResult.actualDocumentBypassGuardImplemented,
      actualPaidDocumentModeImplemented: contractResult.actualPaidDocumentModeImplemented,
      actualPiiRedactionImplemented: contractResult.actualPiiRedactionImplemented,
      actualEvidenceGateRuntimeWiringPerformed: contractResult.actualEvidenceGateRuntimeWiringPerformed,

      // 8.5I textBypassGuardContractConfirms*
      textBypassGuardContractConfirmsNoOpenAiCall:
        contractResult.textBypassGuardContractConfirmsNoOpenAiCall,
      textBypassGuardContractConfirmsNoFetchCall:
        contractResult.textBypassGuardContractConfirmsNoFetchCall,
      textBypassGuardContractConfirmsNoProcessEnvRead:
        contractResult.textBypassGuardContractConfirmsNoProcessEnvRead,
      textBypassGuardContractConfirmsNoSdkUsage:
        contractResult.textBypassGuardContractConfirmsNoSdkUsage,
      textBypassGuardContractConfirmsNo8x3AcRerun:
        contractResult.textBypassGuardContractConfirmsNo8x3AcRerun,
      textBypassGuardContractConfirmsNoSmartTalkRuntimeCall:
        contractResult.textBypassGuardContractConfirmsNoSmartTalkRuntimeCall,
      textBypassGuardContractConfirmsNoRouteImport:
        contractResult.textBypassGuardContractConfirmsNoRouteImport,
      textBypassGuardContractConfirmsNoRouteMutation:
        contractResult.textBypassGuardContractConfirmsNoRouteMutation,
      textBypassGuardContractConfirmsNoPublicRouteMutation:
        contractResult.textBypassGuardContractConfirmsNoPublicRouteMutation,
      textBypassGuardContractConfirmsNoUiMutation:
        contractResult.textBypassGuardContractConfirmsNoUiMutation,
      textBypassGuardContractConfirmsNoSupabaseMutation:
        contractResult.textBypassGuardContractConfirmsNoSupabaseMutation,
      textBypassGuardContractConfirmsNoStorageMutation:
        contractResult.textBypassGuardContractConfirmsNoStorageMutation,
      textBypassGuardContractConfirmsNoDatabaseWrite:
        contractResult.textBypassGuardContractConfirmsNoDatabaseWrite,
      textBypassGuardContractConfirmsNoAuditPersistence:
        contractResult.textBypassGuardContractConfirmsNoAuditPersistence,
      textBypassGuardContractConfirmsNoPaymentRuntimeCall:
        contractResult.textBypassGuardContractConfirmsNoPaymentRuntimeCall,
      textBypassGuardContractConfirmsNoOcrRuntimeCall:
        contractResult.textBypassGuardContractConfirmsNoOcrRuntimeCall,
      textBypassGuardContractConfirmsNoPhotoInputProcessing:
        contractResult.textBypassGuardContractConfirmsNoPhotoInputProcessing,
      textBypassGuardContractConfirmsNoFileInputProcessing:
        contractResult.textBypassGuardContractConfirmsNoFileInputProcessing,
      textBypassGuardContractConfirmsNoDocumentParsingRuntime:
        contractResult.textBypassGuardContractConfirmsNoDocumentParsingRuntime,
      textBypassGuardContractConfirmsNoRawDocumentStorage:
        contractResult.textBypassGuardContractConfirmsNoRawDocumentStorage,
      textBypassGuardContractConfirmsNoModelOutputStorage:
        contractResult.textBypassGuardContractConfirmsNoModelOutputStorage,
      textBypassGuardContractConfirmsNoPromptStorage:
        contractResult.textBypassGuardContractConfirmsNoPromptStorage,
      textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation:
        contractResult.textBypassGuardContractConfirmsNoUserVisibleDocumentExplanation,
      textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis:
        contractResult.textBypassGuardContractConfirmsNoCustomerFacingDocumentAnalysis,
      textBypassGuardContractConfirmsNoEvidenceEvaluation:
        contractResult.textBypassGuardContractConfirmsNoEvidenceEvaluation,
      textBypassGuardContractConfirmsNoClaimAuthorization:
        contractResult.textBypassGuardContractConfirmsNoClaimAuthorization,
      textBypassGuardContractConfirmsNoDeadlineCalculation:
        contractResult.textBypassGuardContractConfirmsNoDeadlineCalculation,
      textBypassGuardContractConfirmsNoLegalCertainty:
        contractResult.textBypassGuardContractConfirmsNoLegalCertainty,

      // Pipeline executed flags
      executionSequenceActuallyExecuted: contractResult.executionSequenceActuallyExecuted,
      runtimePipelineActuallyExecuted: contractResult.runtimePipelineActuallyExecuted,
      documentPipelineActuallyExecuted: contractResult.documentPipelineActuallyExecuted,
      ocrPipelineActuallyExecuted: contractResult.ocrPipelineActuallyExecuted,
      paymentPipelineActuallyExecuted: contractResult.paymentPipelineActuallyExecuted,
      userVisiblePipelineActuallyExecuted: contractResult.userVisiblePipelineActuallyExecuted,

      // Runtime authorization flags
      realDocumentInputAuthorizedNow: contractResult.realDocumentInputAuthorizedNow,
      realDocumentProcessingAuthorizedNow: contractResult.realDocumentProcessingAuthorizedNow,
      realUserDocumentUploadAuthorizedNow: contractResult.realUserDocumentUploadAuthorizedNow,
      ocrRuntimeAuthorizedNow: contractResult.ocrRuntimeAuthorizedNow,
      photoInputAuthorizedNow: contractResult.photoInputAuthorizedNow,
      fileInputAuthorizedNow: contractResult.fileInputAuthorizedNow,
      documentStorageAuthorizedNow: contractResult.documentStorageAuthorizedNow,
      persistenceAuthorizedNow: contractResult.persistenceAuthorizedNow,
      publicRuntimeAuthorizedNow: contractResult.publicRuntimeAuthorizedNow,
      userVisibleLegalDeadlineOutputAuthorizedNow:
        contractResult.userVisibleLegalDeadlineOutputAuthorizedNow,
      liveLLMRuntimeAuthorizedNow: contractResult.liveLLMRuntimeAuthorizedNow,
      connectedAiRuntimeAuthorizedNow: contractResult.connectedAiRuntimeAuthorizedNow,
      pilotRuntimeAuthorizedNow: contractResult.pilotRuntimeAuthorizedNow,
      productionRuntimeAuthorizedNow: contractResult.productionRuntimeAuthorizedNow,

      // Legal safety flags
      exactDeadlineCalculationAuthorized: contractResult.exactDeadlineCalculationAuthorized,
      deliveryDateInventionAuthorized: contractResult.deliveryDateInventionAuthorized,
      finalDateInventionAuthorized: contractResult.finalDateInventionAuthorized,
      legalCertaintyAuthorized: contractResult.legalCertaintyAuthorized,
      coerciveLegalInstructionAuthorized: contractResult.coerciveLegalInstructionAuthorized,
      deliveryDateRequiredForExactDeadline: contractResult.deliveryDateRequiredForExactDeadline,

      // 8.5I forward readiness
      readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan:
        contractResult.readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan,
      readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
      readyForControlledRealDocumentPilotAuthorizationPhase: false,
      readyForControlledRealDocumentProductionAuthorizationPhase: false,
      readyForRealDocumentInput: false,
      readyForUserVisibleOutput: false,
      publicRuntimeEnabled: false,
      persistenceUsed: false,
      neverUserVisible: true,

      // 8.5J implementation plan assertions
      textDocumentBypassGuardRuntimeImplementationPlanOnly: true,
      textDocumentBypassGuardRuntimeImplementationPlanDefined: true,
      textDocumentBypassGuardRuntimeStillNotImplemented: true,
      textDocumentBypassGuardRoutePatchNotPerformed: true,
      textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk: true,
      textDocumentBypassGuardMustBeInsertedBeforePromptBuild: true,
      textDocumentBypassGuardMustBeInsertedBeforeModelCall: true,
      textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis: true,
      textDocumentBypassGuardMustShortCircuitDocumentLikeText: true,
      textDocumentBypassGuardMustAllowGeneralQuestions: true,

      // Runtime integration plan flags
      runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk: true,
      runtimePlanRequiresNoModelCallForBlockedDocumentLikeText: true,
      runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText: true,
      runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText: true,
      runtimePlanRequiresNoRawDocumentEchoInBlockedResponse: true,
      runtimePlanRequiresNoExactDeadlineInBlockedResponse: true,
      runtimePlanRequiresNoLegalCertaintyInBlockedResponse: true,
      runtimePlanRequiresNoClaimAuthorizationInBlockedResponse: true,
      runtimePlanRequiresSafeResponseCodeDocumentModeRequired: true,
      runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime: true,
      runtimePlanRequiresBriefGeneralGuidanceOnly: true,
      runtimePlanRequiresServerSideGuardNotUiOnly: true,
      runtimePlanRequiresDeterministicPreModelHeuristic: true,
      runtimePlanRequiresConservativeFalsePositiveSafeHandling: true,
      runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite: true,

      // Detection plan flags
      detectionPlanUsesLengthThresholds: true,
      detectionPlanUsesOfficialLetterMarkers: true,
      detectionPlanUsesGermanAuthorityMarkers: true,
      detectionPlanUsesInvoiceMahnungMarkers: true,
      detectionPlanUsesBescheidWiderspruchMarkers: true,
      detectionPlanUsesDeadlineLegalConsequenceMarkers: true,
      detectionPlanUsesPersonalDataMarkers: true,
      detectionPlanUsesReferenceNumberMarkers: true,
      detectionPlanUsesSalutationAndSignatureMarkers: true,
      detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly: true,
      detectionPlanRequiresQuestionLikeGeneralTextSafePass: true,
      detectionPlanRequiresHighRiskDocumentLikeTextBlocked: true,

      // Safe response plan flags
      safeResponsePlanStatusShouldBeNonSuccess: true,
      safeResponsePlanCodeShouldBeDocumentModeRequired: true,
      safeResponsePlanOkShouldBeFalse: true,
      safeResponsePlanMessageShouldBeShortAndUserSafe: true,
      safeResponsePlanShouldNotExposeInternalGovernance: true,
      safeResponsePlanShouldNotMentionTamperOrAuditInternals: true,
      safeResponsePlanShouldNotEchoPastedDocument: true,
      safeResponsePlanShouldNotTranslateDocument: true,
      safeResponsePlanShouldNotSummarizeDocument: true,
      safeResponsePlanShouldNotProvideLegalAdvice: true,
      safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable: true,
      safeResponsePlanMaySuggestGeneralQuestionRephrase: true,

      // 8.5J TD containment assertions
      td001DocumentBypassGuardRuntimeImplementationPlanned: true,
      td001DocumentBypassGuardStillRequiresRoutePatch: true,

      // 8.5J audit confirms no side effects
      textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation: true,
      textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty: true,

      // 8.5J forward readiness
      readyFor8x5KTextDocumentBypassGuardRuntimeContract: true,
    };

  const prereqValidation = validateImplementationPlanInput(
    canonicalInput as unknown as Record<string, unknown>
  );

  // ── Tamper cases ──────────────────────────────────────────────────────────────

  type TamperOverride = Partial<
    Record<
      keyof ControlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanInput,
      unknown
    >
  >;
  const tamperCases: { label: string; override: TamperOverride }[] = [
    // 8.5I prereq gates
    { label: "8.5I checkId wrong", override: { prereqCheckId: "8.5H" } },
    { label: "8.5I allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentTextDocumentBypassGuardContractAccepted false", override: { controlledRealDocumentTextDocumentBypassGuardContractAccepted: false } },
    { label: "textDocumentBypassGuardContractOnly false", override: { textDocumentBypassGuardContractOnly: false } },
    { label: "textDocumentBypassGuardContractDefined false", override: { textDocumentBypassGuardContractDefined: false } },
    { label: "textDocumentBypassGuardRuntimeNotImplementedYet false", override: { textDocumentBypassGuardRuntimeNotImplementedYet: false } },
    { label: "textDocumentBypassGuardMustRunBeforeRunSmartTalk false", override: { textDocumentBypassGuardMustRunBeforeRunSmartTalk: false } },
    { label: "textDocumentBypassGuardMustRunBeforePromptBuild false", override: { textDocumentBypassGuardMustRunBeforePromptBuild: false } },
    { label: "textDocumentBypassGuardMustRunBeforeModelCall false", override: { textDocumentBypassGuardMustRunBeforeModelCall: false } },
    { label: "textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis false", override: { textDocumentBypassGuardMustRunBeforeFullDocumentAnalysis: false } },
    { label: "textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse false", override: { textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: false } },
    // Authorization grants
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
    { label: "goLiveAuthorizationGranted true", override: { goLiveAuthorizationGranted: true } },
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
    // TD and containment flags
    { label: "td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted false", override: { td001DocumentBypassGuardMissingInLiveSmartTalkRouteContracted: false } },
    { label: "td001DocumentBypassGuardStillRequiresRuntimeImplementation false", override: { td001DocumentBypassGuardStillRequiresRuntimeImplementation: false } },
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained false", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false } },
    { label: "td004PreModelPiiRedactionMissing false", override: { td004PreModelPiiRedactionMissing: false } },
    { label: "td005PaidDocumentModeNotServerSideEnforced false", override: { td005PaidDocumentModeNotServerSideEnforced: false } },
    { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", override: { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false } },
    { label: "td009TmpDebugRunnerDebtClosed false", override: { td009TmpDebugRunnerDebtClosed: false } },
    { label: "tmpFilesPresentInWorkingTree true", override: { tmpFilesPresentInWorkingTree: true } },
    // Actual performed flags
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
    { label: "actualPhotoRouteQuarantinePerformed true", override: { actualPhotoRouteQuarantinePerformed: true } },
    { label: "actualLiveRouteMutationPerformed true", override: { actualLiveRouteMutationPerformed: true } },
    { label: "actualDocumentBypassGuardImplemented true", override: { actualDocumentBypassGuardImplemented: true } },
    { label: "actualPaidDocumentModeImplemented true", override: { actualPaidDocumentModeImplemented: true } },
    { label: "actualPiiRedactionImplemented true", override: { actualPiiRedactionImplemented: true } },
    { label: "actualEvidenceGateRuntimeWiringPerformed true", override: { actualEvidenceGateRuntimeWiringPerformed: true } },
    // 8.5I textBypassGuardContractConfirms* no-side-effect confirmations
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
    // 8.5I forward readiness
    { label: "readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan false", override: { readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in prerequisite", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    // 8.5J implementation plan assertions
    { label: "textDocumentBypassGuardRuntimeImplementationPlanOnly false", override: { textDocumentBypassGuardRuntimeImplementationPlanOnly: false } },
    { label: "textDocumentBypassGuardRuntimeImplementationPlanDefined false", override: { textDocumentBypassGuardRuntimeImplementationPlanDefined: false } },
    { label: "textDocumentBypassGuardRuntimeStillNotImplemented false", override: { textDocumentBypassGuardRuntimeStillNotImplemented: false } },
    { label: "textDocumentBypassGuardRoutePatchNotPerformed false", override: { textDocumentBypassGuardRoutePatchNotPerformed: false } },
    { label: "textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk false", override: { textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk: false } },
    { label: "textDocumentBypassGuardMustBeInsertedBeforePromptBuild false", override: { textDocumentBypassGuardMustBeInsertedBeforePromptBuild: false } },
    { label: "textDocumentBypassGuardMustBeInsertedBeforeModelCall false", override: { textDocumentBypassGuardMustBeInsertedBeforeModelCall: false } },
    { label: "textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis false", override: { textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis: false } },
    { label: "textDocumentBypassGuardMustShortCircuitDocumentLikeText false", override: { textDocumentBypassGuardMustShortCircuitDocumentLikeText: false } },
    { label: "textDocumentBypassGuardMustAllowGeneralQuestions false", override: { textDocumentBypassGuardMustAllowGeneralQuestions: false } },
    // Runtime integration plan flags
    { label: "runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk false", override: { runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk: false } },
    { label: "runtimePlanRequiresNoModelCallForBlockedDocumentLikeText false", override: { runtimePlanRequiresNoModelCallForBlockedDocumentLikeText: false } },
    { label: "runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText false", override: { runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText: false } },
    { label: "runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText false", override: { runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText: false } },
    { label: "runtimePlanRequiresNoRawDocumentEchoInBlockedResponse false", override: { runtimePlanRequiresNoRawDocumentEchoInBlockedResponse: false } },
    { label: "runtimePlanRequiresNoExactDeadlineInBlockedResponse false", override: { runtimePlanRequiresNoExactDeadlineInBlockedResponse: false } },
    { label: "runtimePlanRequiresNoLegalCertaintyInBlockedResponse false", override: { runtimePlanRequiresNoLegalCertaintyInBlockedResponse: false } },
    { label: "runtimePlanRequiresNoClaimAuthorizationInBlockedResponse false", override: { runtimePlanRequiresNoClaimAuthorizationInBlockedResponse: false } },
    { label: "runtimePlanRequiresSafeResponseCodeDocumentModeRequired false", override: { runtimePlanRequiresSafeResponseCodeDocumentModeRequired: false } },
    { label: "runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime false", override: { runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime: false } },
    { label: "runtimePlanRequiresBriefGeneralGuidanceOnly false", override: { runtimePlanRequiresBriefGeneralGuidanceOnly: false } },
    { label: "runtimePlanRequiresServerSideGuardNotUiOnly false", override: { runtimePlanRequiresServerSideGuardNotUiOnly: false } },
    { label: "runtimePlanRequiresDeterministicPreModelHeuristic false", override: { runtimePlanRequiresDeterministicPreModelHeuristic: false } },
    { label: "runtimePlanRequiresConservativeFalsePositiveSafeHandling false", override: { runtimePlanRequiresConservativeFalsePositiveSafeHandling: false } },
    { label: "runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite false", override: { runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite: false } },
    // Detection plan flags
    { label: "detectionPlanUsesLengthThresholds false", override: { detectionPlanUsesLengthThresholds: false } },
    { label: "detectionPlanUsesOfficialLetterMarkers false", override: { detectionPlanUsesOfficialLetterMarkers: false } },
    { label: "detectionPlanUsesGermanAuthorityMarkers false", override: { detectionPlanUsesGermanAuthorityMarkers: false } },
    { label: "detectionPlanUsesInvoiceMahnungMarkers false", override: { detectionPlanUsesInvoiceMahnungMarkers: false } },
    { label: "detectionPlanUsesBescheidWiderspruchMarkers false", override: { detectionPlanUsesBescheidWiderspruchMarkers: false } },
    { label: "detectionPlanUsesDeadlineLegalConsequenceMarkers false", override: { detectionPlanUsesDeadlineLegalConsequenceMarkers: false } },
    { label: "detectionPlanUsesPersonalDataMarkers false", override: { detectionPlanUsesPersonalDataMarkers: false } },
    { label: "detectionPlanUsesReferenceNumberMarkers false", override: { detectionPlanUsesReferenceNumberMarkers: false } },
    { label: "detectionPlanUsesSalutationAndSignatureMarkers false", override: { detectionPlanUsesSalutationAndSignatureMarkers: false } },
    { label: "detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly false", override: { detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly: false } },
    { label: "detectionPlanRequiresQuestionLikeGeneralTextSafePass false", override: { detectionPlanRequiresQuestionLikeGeneralTextSafePass: false } },
    { label: "detectionPlanRequiresHighRiskDocumentLikeTextBlocked false", override: { detectionPlanRequiresHighRiskDocumentLikeTextBlocked: false } },
    // Safe response plan flags
    { label: "safeResponsePlanStatusShouldBeNonSuccess false", override: { safeResponsePlanStatusShouldBeNonSuccess: false } },
    { label: "safeResponsePlanCodeShouldBeDocumentModeRequired false", override: { safeResponsePlanCodeShouldBeDocumentModeRequired: false } },
    { label: "safeResponsePlanOkShouldBeFalse false", override: { safeResponsePlanOkShouldBeFalse: false } },
    { label: "safeResponsePlanMessageShouldBeShortAndUserSafe false", override: { safeResponsePlanMessageShouldBeShortAndUserSafe: false } },
    { label: "safeResponsePlanShouldNotExposeInternalGovernance false", override: { safeResponsePlanShouldNotExposeInternalGovernance: false } },
    { label: "safeResponsePlanShouldNotMentionTamperOrAuditInternals false", override: { safeResponsePlanShouldNotMentionTamperOrAuditInternals: false } },
    { label: "safeResponsePlanShouldNotEchoPastedDocument false", override: { safeResponsePlanShouldNotEchoPastedDocument: false } },
    { label: "safeResponsePlanShouldNotTranslateDocument false", override: { safeResponsePlanShouldNotTranslateDocument: false } },
    { label: "safeResponsePlanShouldNotSummarizeDocument false", override: { safeResponsePlanShouldNotSummarizeDocument: false } },
    { label: "safeResponsePlanShouldNotProvideLegalAdvice false", override: { safeResponsePlanShouldNotProvideLegalAdvice: false } },
    { label: "safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable false", override: { safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable: false } },
    { label: "safeResponsePlanMaySuggestGeneralQuestionRephrase false", override: { safeResponsePlanMaySuggestGeneralQuestionRephrase: false } },
    // 8.5J TD containment assertions
    { label: "td001DocumentBypassGuardRuntimeImplementationPlanned false", override: { td001DocumentBypassGuardRuntimeImplementationPlanned: false } },
    { label: "td001DocumentBypassGuardStillRequiresRoutePatch false", override: { td001DocumentBypassGuardStillRequiresRoutePatch: false } },
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained false in 8.5J result", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false } },
    // 8.5J audit confirms no side effects
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation: false } },
    { label: "textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty false", override: { textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty: false } },
    // 8.5J forward readiness
    { label: "readyFor8x5KTextDocumentBypassGuardRuntimeContract false", override: { readyFor8x5KTextDocumentBypassGuardRuntimeContract: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in 8.5J result", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForRealDocumentInput true in 8.5J result", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true in 8.5J result", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true in 8.5J result", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true in 8.5J result", override: { persistenceUsed: true } },
    { label: "neverUserVisible false in 8.5J result", override: { neverUserVisible: false } },
  ];

  const tamperFailures: string[] = [];
  for (const tc of tamperCases) {
    const tampered = { ...canonicalInput, ...tc.override } as Record<string, unknown>;
    const result = validateImplementationPlanInput(tampered);
    if (result.accepted) {
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }
  const allTamperRejected = tamperFailures.length === 0;

  const allPassed =
    prereqValidation.accepted &&
    allTamperRejected &&
    contractResult.allPassed &&
    contractResult.readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan;

  const prereqNote =
    prereqValidation.accepted
      ? "implementation plan input validation: accepted — reasons: none"
      : `implementation plan input validation: REJECTED — reasons: ${prereqValidation.reasons.join(", ")}`;

  const tamperNote = `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`;

  const finalNote = allPassed
    ? "PHASE 8.5J allPassed: true — controlled real-document Text Document Bypass Guard runtime implementation plan accepted"
    : "PHASE 8.5J allPassed: false — see notes for failures";

  const notes: string[] = [
    "8.5J is a controlled real-document Text Document Bypass Guard runtime implementation plan layer",
    "8.5J depends on completed 8.5I Text Document Bypass Guard contract",
    "8.5J is implementation-plan-only",
    "/api/smart-talk was not modified in 8.5J",
    "the live runtime guard is still not implemented yet",
    "the future route patch must insert the guard after JSON body parsing but before runSmartTalk, prompt build, model call, or full document analysis",
    "document-like pasted text in Free Q&A must short-circuit before any model call",
    "blocked document-like text must return safe document_mode_required response",
    "general questions must still pass through",
    "full document translation/explanation must not be provided in Free Q&A",
    "Paid Document Mode server boundary remains unresolved",
    "pre-model PII redaction remains unresolved",
    "Evidence Gate runtime wiring remains unresolved",
    "TD-001 is planned but still requires a route patch",
    "TD-003 photo OCR route remains contained",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no final go-live authorization was granted",
    "no real document input or processing was performed",
    "no OCR/photo/file/storage/persistence was performed",
    "no user-visible document explanation was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5J",
    "8.3AC was not re-run",
    "the next phase is 8.5K Text Document Bypass Guard Runtime Contract",
    "readyFor8x5KTextDocumentBypassGuardRuntimeContract is planning readiness only, not runtime authorization",
    "8.5I prerequisite: allPassed=true, textDocumentBypassGuardContractOnly=true, textDocumentBypassGuardContractDefined=true",
    prereqNote,
    tamperNote,
    ...tamperFailures,
    finalNote,
    "TD-001 /api/smart-talk Document Bypass Guard runtime implementation is planned; route patch still required",
  ];

  return {
    checkId: "8.5J",
    allPassed,
    textDocumentBypassGuardContractReadyForRuntimeImplementationPlan:
      contractResult.readyFor8x5JTextDocumentBypassGuardRuntimeImplementationPlan,
    controlledRealDocumentTextDocumentBypassGuardRuntimeImplementationPlanAccepted:
      prereqValidation.accepted && allTamperRejected,
    textDocumentBypassGuardRuntimeImplementationPlanOnly: true,
    textDocumentBypassGuardRuntimeImplementationPlanDefined: true,
    textDocumentBypassGuardRuntimeStillNotImplemented: true,
    textDocumentBypassGuardRoutePatchNotPerformed: true,
    textDocumentBypassGuardMustBeInsertedBeforeRunSmartTalk: true,
    textDocumentBypassGuardMustBeInsertedBeforePromptBuild: true,
    textDocumentBypassGuardMustBeInsertedBeforeModelCall: true,
    textDocumentBypassGuardMustBeInsertedBeforeFullDocumentAnalysis: true,
    textDocumentBypassGuardMustShortCircuitDocumentLikeText: true,
    textDocumentBypassGuardMustAllowGeneralQuestions: true,
    textDocumentBypassGuardMustReturnSafeDocumentModeRequiredResponse: true,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    runtimePlanIdentifiesInsertionPointInSmartTalkRoutePostJsonParsePreRunSmartTalk: true,
    runtimePlanRequiresNoModelCallForBlockedDocumentLikeText: true,
    runtimePlanRequiresNoPromptBuildForBlockedDocumentLikeText: true,
    runtimePlanRequiresNoFullDocumentAnalysisForBlockedDocumentLikeText: true,
    runtimePlanRequiresNoRawDocumentEchoInBlockedResponse: true,
    runtimePlanRequiresNoExactDeadlineInBlockedResponse: true,
    runtimePlanRequiresNoLegalCertaintyInBlockedResponse: true,
    runtimePlanRequiresNoClaimAuthorizationInBlockedResponse: true,
    runtimePlanRequiresSafeResponseCodeDocumentModeRequired: true,
    runtimePlanRequiresPaidDocumentModePointerWithoutActivatingPaidRuntime: true,
    runtimePlanRequiresBriefGeneralGuidanceOnly: true,
    runtimePlanRequiresServerSideGuardNotUiOnly: true,
    runtimePlanRequiresDeterministicPreModelHeuristic: true,
    runtimePlanRequiresConservativeFalsePositiveSafeHandling: true,
    runtimePlanRequiresNoStorageNoPersistenceNoAuditWrite: true,

    detectionPlanUsesLengthThresholds: true,
    detectionPlanUsesOfficialLetterMarkers: true,
    detectionPlanUsesGermanAuthorityMarkers: true,
    detectionPlanUsesInvoiceMahnungMarkers: true,
    detectionPlanUsesBescheidWiderspruchMarkers: true,
    detectionPlanUsesDeadlineLegalConsequenceMarkers: true,
    detectionPlanUsesPersonalDataMarkers: true,
    detectionPlanUsesReferenceNumberMarkers: true,
    detectionPlanUsesSalutationAndSignatureMarkers: true,
    detectionPlanRequiresMultiSignalScoringNotSingleKeywordOnly: true,
    detectionPlanRequiresQuestionLikeGeneralTextSafePass: true,
    detectionPlanRequiresHighRiskDocumentLikeTextBlocked: true,

    safeResponsePlanStatusShouldBeNonSuccess: true,
    safeResponsePlanCodeShouldBeDocumentModeRequired: true,
    safeResponsePlanOkShouldBeFalse: true,
    safeResponsePlanMessageShouldBeShortAndUserSafe: true,
    safeResponsePlanShouldNotExposeInternalGovernance: true,
    safeResponsePlanShouldNotMentionTamperOrAuditInternals: true,
    safeResponsePlanShouldNotEchoPastedDocument: true,
    safeResponsePlanShouldNotTranslateDocument: true,
    safeResponsePlanShouldNotSummarizeDocument: true,
    safeResponsePlanShouldNotProvideLegalAdvice: true,
    safeResponsePlanShouldPointToPaidDocumentModeWhenAvailable: true,
    safeResponsePlanMaySuggestGeneralQuestionRephrase: true,

    td001DocumentBypassGuardRuntimeImplementationPlanned: true,
    td001DocumentBypassGuardStillRequiresRoutePatch: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      contractResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,

    td004PreModelPiiRedactionMissing: contractResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced: contractResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      contractResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,

    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      contractResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      contractResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: contractResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: contractResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: contractResult.td009TmpDebugRunnerDebtClosed,
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

    textBypassGuardRuntimeImplementationPlanConfirmsNoOpenAiCall: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoFetchCall: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoProcessEnvRead: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoSdkUsage: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNo8x3AcRerun: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoRouteImport: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoRouteMutation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoPublicRouteMutation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoUiMutation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoSupabaseMutation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoStorageMutation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoDatabaseWrite: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoAuditPersistence: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoPhotoInputProcessing: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoFileInputProcessing: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoRawDocumentStorage: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoModelOutputStorage: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoPromptStorage: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoClaimAuthorization: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoDeadlineCalculation: true,
    textBypassGuardRuntimeImplementationPlanConfirmsNoLegalCertainty: true,

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

    readyFor8x5KTextDocumentBypassGuardRuntimeContract: true,
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
