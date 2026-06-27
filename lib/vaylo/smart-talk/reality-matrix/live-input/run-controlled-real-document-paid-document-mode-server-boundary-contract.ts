/**
 * Phase 8.5P — Controlled Real Document Paid Document Mode Server Boundary
 * Contract.
 *
 * CONTRACT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5O.
 *
 * This file formally defines what invariants a future Paid Document Mode
 * server boundary implementation must satisfy. It does NOT implement payment
 * logic, entitlement logic, checkout, document processing, OCR, or any
 * runtime behaviour.
 *
 * This file does NOT:
 *   - Call OpenAI, fetch, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import or modify live route files.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Implement payment, entitlement, or document processing runtime.
 *   - Authorize live real-document processing, OCR, or upload.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAudit } from "./run-controlled-real-document-text-document-bypass-guard-post-patch-containment-audit";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeServerBoundaryContractInput {
  // 8.5O prerequisite gate
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted: boolean;
  readonly textDocumentBypassGuardPostPatchContainmentAuditOnly: boolean;
  readonly textDocumentBypassGuardPostPatchContainmentAuditCompleted: boolean;
  readonly textDocumentBypassGuardContainmentPatchVerified: boolean;
  readonly textDocumentBypassGuardFreeQaContainmentVerified: boolean;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: boolean;
  readonly textDocumentBypassGuardGeneralQuestionsPassThroughVerified: boolean;
  readonly textDocumentBypassGuardDocumentModeRequiredResponseVerified: boolean;
  readonly textDocumentBypassGuardNoRuntimeAuthorizationVerified: boolean;

  // 8.5O audit target flags
  readonly postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: boolean;
  readonly postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: boolean;
  readonly postPatchAuditConfirmsPhotoOcrQuarantinePreserved: boolean;
  readonly postPatchAuditConfirmsGuardIsServerSide: boolean;
  readonly postPatchAuditConfirmsGuardIsDeterministicLocal: boolean;
  readonly postPatchAuditConfirmsGuardRunsAfterJsonParse: boolean;
  readonly postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: boolean;
  readonly postPatchAuditConfirmsBlockedPathNoRunSmartTalk: boolean;
  readonly postPatchAuditConfirmsAllowedPathPreservesExistingFlow: boolean;
  readonly postPatchAuditConfirmsNoBroadRouteRefactor: boolean;
  readonly postPatchAuditConfirmsNoNewDependency: boolean;

  // 8.5O audit detector flags
  readonly postPatchAuditConfirmsDetectorUsesMultiSignalScoring: boolean;
  readonly postPatchAuditConfirmsDetectorUsesLengthThresholds: boolean;
  readonly postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: boolean;
  readonly postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: boolean;
  readonly postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: boolean;
  readonly postPatchAuditConfirmsDetectorUsesConservativeHandling: boolean;

  // 8.5O audit response flags
  readonly postPatchAuditConfirmsBlockedResponseStatusNonSuccess: boolean;
  readonly postPatchAuditConfirmsBlockedResponseOkFalse: boolean;
  readonly postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: boolean;
  readonly postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: boolean;
  readonly postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: boolean;
  readonly postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoInternalGovernance: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoTranslation: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoSummary: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoExplanation: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoLegalAdvice: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoExactDeadline: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoLegalCertainty: boolean;
  readonly postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: boolean;

  // Authorization grants (all false from 8.5O)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags
  readonly td001DocumentBypassGuardPostPatchAudited: boolean;
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td005PaidDocumentModeServerBoundaryContracted: boolean;
  readonly td005PaidDocumentModeStillRequiresImplementationPlan: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeImplementation: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // Actual performed flags from 8.5O (all false)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;
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
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;

  // 8.5P-specific actual flags
  readonly actualPaymentRuntimeImplemented: boolean;
  readonly actualEntitlementRuntimeImplemented: boolean;
  readonly actualCheckoutImplemented: boolean;

  // No-prohibited-side-effect confirmations from 8.5O
  readonly textBypassGuardPostPatchAuditConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoFetchCall: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoRouteImport: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoUiMutation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardPostPatchAuditConfirmsNoLegalCertainty: boolean;

  // Pipeline executed flags
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly entitlementPipelineActuallyExecuted: boolean;
  readonly checkoutPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags
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
  readonly paidDocumentModeRuntimeAuthorizedNow: boolean;
  readonly paymentRuntimeAuthorizedNow: boolean;
  readonly entitlementRuntimeAuthorizedNow: boolean;
  readonly checkoutRuntimeAuthorizedNow: boolean;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // 8.5O forward readiness gate
  readonly readyFor8x5PPaidDocumentModeServerBoundaryContract: boolean;

  // 8.5P core contract assertions
  readonly paidDocumentModeServerBoundaryContractOnly: boolean;
  readonly paidDocumentModeServerBoundaryContractDefined: boolean;
  readonly paidDocumentModeRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeBoundaryStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;

  // 8.5P Free Q&A containment dependency flags
  readonly paidBoundaryContractRequiresFreeQaBypassGuardPreserved: boolean;
  readonly paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: boolean;
  readonly paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: boolean;
  readonly paidBoundaryContractRequiresGeneralQuestionsStillAllowed: boolean;
  readonly paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: boolean;
  readonly paidBoundaryContractForbidsDocumentTranslationInFreeQa: boolean;
  readonly paidBoundaryContractForbidsDeadlineCalculationInFreeQa: boolean;
  readonly paidBoundaryContractForbidsLegalCertaintyInFreeQa: boolean;
  readonly paidBoundaryContractForbidsClaimAuthorizationInFreeQa: boolean;

  // 8.5P server boundary flags
  readonly paidBoundaryContractRequiresServerSideEntitlementCheck: boolean;
  readonly paidBoundaryContractForbidsUiOnlyEntitlement: boolean;
  readonly paidBoundaryContractForbidsTrustingClientPaidFlag: boolean;
  readonly paidBoundaryContractForbidsTrustingClientDocumentModeFlag: boolean;
  readonly paidBoundaryContractRequiresServerVerifiedPaidSession: boolean;
  readonly paidBoundaryContractRequiresServerVerifiedProductOrFeature: boolean;
  readonly paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: boolean;
  readonly paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: boolean;
  readonly paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: boolean;
  readonly paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: boolean;
  readonly paidBoundaryContractRequiresNoModelCallBeforeBoundary: boolean;
  readonly paidBoundaryContractRequiresNoStorageBeforeBoundary: boolean;
  readonly paidBoundaryContractRequiresNoPersistenceBeforeBoundary: boolean;
  readonly paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: boolean;

  // 8.5P future paid mode boundary design flags
  readonly paidBoundaryContractDefinesFreeQaLane: boolean;
  readonly paidBoundaryContractDefinesPaidDocumentLane: boolean;
  readonly paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: boolean;
  readonly paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: boolean;
  readonly paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: boolean;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: boolean;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: boolean;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: boolean;
  readonly paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: boolean;
  readonly paidBoundaryContractRequiresSeparateImplementationPlanNext: boolean;

  // 8.5P no-prohibited-side-effect confirmations
  readonly paidBoundaryContractConfirmsNoOpenAiCall: boolean;
  readonly paidBoundaryContractConfirmsNoFetchCall: boolean;
  readonly paidBoundaryContractConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundaryContractConfirmsNoSdkUsage: boolean;
  readonly paidBoundaryContractConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundaryContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly paidBoundaryContractConfirmsNoRouteImport: boolean;
  readonly paidBoundaryContractConfirmsNoRouteMutation: boolean;
  readonly paidBoundaryContractConfirmsNoPublicRouteMutation: boolean;
  readonly paidBoundaryContractConfirmsNoUiMutation: boolean;
  readonly paidBoundaryContractConfirmsNoSupabaseMutation: boolean;
  readonly paidBoundaryContractConfirmsNoStorageMutation: boolean;
  readonly paidBoundaryContractConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundaryContractConfirmsNoAuditPersistence: boolean;
  readonly paidBoundaryContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundaryContractConfirmsNoStripeCall: boolean;
  readonly paidBoundaryContractConfirmsNoCheckoutCall: boolean;
  readonly paidBoundaryContractConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundaryContractConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundaryContractConfirmsNoPhotoInputProcessing: boolean;
  readonly paidBoundaryContractConfirmsNoFileInputProcessing: boolean;
  readonly paidBoundaryContractConfirmsNoDocumentParsingRuntime: boolean;
  readonly paidBoundaryContractConfirmsNoRawDocumentStorage: boolean;
  readonly paidBoundaryContractConfirmsNoModelOutputStorage: boolean;
  readonly paidBoundaryContractConfirmsNoPromptStorage: boolean;
  readonly paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly paidBoundaryContractConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundaryContractConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundaryContractConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundaryContractConfirmsNoLegalCertainty: boolean;

  // 8.5P forward readiness
  readonly readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPaidDocumentModeServerBoundaryContractResult {
  readonly checkId: "8.5P";
  readonly allPassed: boolean;
  readonly textDocumentBypassGuardPostPatchAuditReadyForPaidDocumentBoundaryContract: boolean;
  readonly controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted: boolean;
  readonly paidDocumentModeServerBoundaryContractOnly: true;
  readonly paidDocumentModeServerBoundaryContractDefined: true;
  readonly paidDocumentModeRuntimeStillNotImplemented: true;
  readonly paidDocumentModeBoundaryStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Free Q&A containment dependency flags
  readonly paidBoundaryContractRequiresFreeQaBypassGuardPreserved: true;
  readonly paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: true;
  readonly paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: true;
  readonly paidBoundaryContractRequiresGeneralQuestionsStillAllowed: true;
  readonly paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: true;
  readonly paidBoundaryContractForbidsDocumentTranslationInFreeQa: true;
  readonly paidBoundaryContractForbidsDeadlineCalculationInFreeQa: true;
  readonly paidBoundaryContractForbidsLegalCertaintyInFreeQa: true;
  readonly paidBoundaryContractForbidsClaimAuthorizationInFreeQa: true;

  // Server boundary flags
  readonly paidBoundaryContractRequiresServerSideEntitlementCheck: true;
  readonly paidBoundaryContractForbidsUiOnlyEntitlement: true;
  readonly paidBoundaryContractForbidsTrustingClientPaidFlag: true;
  readonly paidBoundaryContractForbidsTrustingClientDocumentModeFlag: true;
  readonly paidBoundaryContractRequiresServerVerifiedPaidSession: true;
  readonly paidBoundaryContractRequiresServerVerifiedProductOrFeature: true;
  readonly paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: true;
  readonly paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: true;
  readonly paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: true;
  readonly paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: true;
  readonly paidBoundaryContractRequiresNoModelCallBeforeBoundary: true;
  readonly paidBoundaryContractRequiresNoStorageBeforeBoundary: true;
  readonly paidBoundaryContractRequiresNoPersistenceBeforeBoundary: true;
  readonly paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: true;

  // Future paid mode boundary design flags
  readonly paidBoundaryContractDefinesFreeQaLane: true;
  readonly paidBoundaryContractDefinesPaidDocumentLane: true;
  readonly paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: true;
  readonly paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: true;
  readonly paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: true;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: true;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: true;
  readonly paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true;
  readonly paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: true;
  readonly paidBoundaryContractRequiresSeparateImplementationPlanNext: true;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Containment and debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: true;
  readonly td005PaidDocumentModeServerBoundaryContracted: true;
  readonly td005PaidDocumentModeStillRequiresImplementationPlan: true;
  readonly td005PaidDocumentModeStillRequiresRuntimeImplementation: true;
  readonly td004PreModelPiiRedactionMissing: true;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true;

  // Medium/low debt flags
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: true;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: true;
  readonly td008InMemoryRateLimiterServerlessUnsafe: true;
  readonly td010GetUserStateDocumentTypeTodoOpen: true;
  readonly td009TmpDebugRunnerDebtClosed: true;
  readonly tmpFilesPresentInWorkingTree: false;

  // Actual performed flags (all false)
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualDocumentBypassGuardImplemented: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPaymentRuntimeImplemented: false;
  readonly actualEntitlementRuntimeImplemented: false;
  readonly actualCheckoutImplemented: false;
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
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;

  // No-prohibited-side-effect confirmations
  readonly paidBoundaryContractConfirmsNoOpenAiCall: true;
  readonly paidBoundaryContractConfirmsNoFetchCall: true;
  readonly paidBoundaryContractConfirmsNoProcessEnvRead: true;
  readonly paidBoundaryContractConfirmsNoSdkUsage: true;
  readonly paidBoundaryContractConfirmsNo8x3AcRerun: true;
  readonly paidBoundaryContractConfirmsNoSmartTalkRuntimeCall: true;
  readonly paidBoundaryContractConfirmsNoRouteImport: true;
  readonly paidBoundaryContractConfirmsNoRouteMutation: true;
  readonly paidBoundaryContractConfirmsNoPublicRouteMutation: true;
  readonly paidBoundaryContractConfirmsNoUiMutation: true;
  readonly paidBoundaryContractConfirmsNoSupabaseMutation: true;
  readonly paidBoundaryContractConfirmsNoStorageMutation: true;
  readonly paidBoundaryContractConfirmsNoDatabaseWrite: true;
  readonly paidBoundaryContractConfirmsNoAuditPersistence: true;
  readonly paidBoundaryContractConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundaryContractConfirmsNoStripeCall: true;
  readonly paidBoundaryContractConfirmsNoCheckoutCall: true;
  readonly paidBoundaryContractConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundaryContractConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundaryContractConfirmsNoPhotoInputProcessing: true;
  readonly paidBoundaryContractConfirmsNoFileInputProcessing: true;
  readonly paidBoundaryContractConfirmsNoDocumentParsingRuntime: true;
  readonly paidBoundaryContractConfirmsNoRawDocumentStorage: true;
  readonly paidBoundaryContractConfirmsNoModelOutputStorage: true;
  readonly paidBoundaryContractConfirmsNoPromptStorage: true;
  readonly paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis: true;
  readonly paidBoundaryContractConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundaryContractConfirmsNoClaimAuthorization: true;
  readonly paidBoundaryContractConfirmsNoDeadlineCalculation: true;
  readonly paidBoundaryContractConfirmsNoLegalCertainty: true;

  // Pipeline executed flags (all false)
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly entitlementPipelineActuallyExecuted: false;
  readonly checkoutPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags (all false)
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
  readonly paidDocumentModeRuntimeAuthorizedNow: false;
  readonly paymentRuntimeAuthorizedNow: false;
  readonly entitlementRuntimeAuthorizedNow: false;
  readonly checkoutRuntimeAuthorizedNow: false;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  // Forward readiness
  readonly readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: true;
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

// ── Validator ─────────────────────────────────────────────────────────────────

function validatePaidDocumentModeServerBoundaryContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5O prerequisite gate
  if (o["prereqCheckId"] !== "8.5O")
    reasons.push("prereq_check_id_must_be_8x5O");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted"] !== true)
    reasons.push("post_patch_containment_audit_not_accepted");
  if (o["textDocumentBypassGuardPostPatchContainmentAuditOnly"] !== true)
    reasons.push("post_patch_containment_audit_only_false");
  if (o["textDocumentBypassGuardPostPatchContainmentAuditCompleted"] !== true)
    reasons.push("post_patch_containment_audit_completed_false");
  if (o["textDocumentBypassGuardContainmentPatchVerified"] !== true)
    reasons.push("containment_patch_verified_false");
  if (o["textDocumentBypassGuardFreeQaContainmentVerified"] !== true)
    reasons.push("free_qa_containment_verified_false");
  if (o["textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified"] !== true)
    reasons.push("blocks_document_like_text_verified_false");
  if (o["textDocumentBypassGuardGeneralQuestionsPassThroughVerified"] !== true)
    reasons.push("general_questions_pass_through_verified_false");
  if (o["textDocumentBypassGuardDocumentModeRequiredResponseVerified"] !== true)
    reasons.push("document_mode_required_response_verified_false");
  if (o["textDocumentBypassGuardNoRuntimeAuthorizationVerified"] !== true)
    reasons.push("no_runtime_authorization_verified_false");

  // 8.5O audit target flags
  if (o["postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N"] !== true)
    reasons.push("audit_target_smart_talk_route_modified_false");
  if (o["postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N"] !== true)
    reasons.push("audit_target_photo_route_not_modified_false");
  if (o["postPatchAuditConfirmsPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("audit_target_photo_ocr_quarantine_preserved_false");
  if (o["postPatchAuditConfirmsGuardIsServerSide"] !== true)
    reasons.push("audit_target_guard_is_server_side_false");
  if (o["postPatchAuditConfirmsGuardIsDeterministicLocal"] !== true)
    reasons.push("audit_target_guard_is_deterministic_local_false");
  if (o["postPatchAuditConfirmsGuardRunsAfterJsonParse"] !== true)
    reasons.push("audit_target_guard_runs_after_json_parse_false");
  if (o["postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk"] !== true)
    reasons.push("audit_target_guard_runs_before_run_smart_talk_false");
  if (o["postPatchAuditConfirmsBlockedPathNoRunSmartTalk"] !== true)
    reasons.push("audit_target_blocked_path_no_run_smart_talk_false");
  if (o["postPatchAuditConfirmsAllowedPathPreservesExistingFlow"] !== true)
    reasons.push("audit_target_allowed_path_preserves_existing_flow_false");
  if (o["postPatchAuditConfirmsNoBroadRouteRefactor"] !== true)
    reasons.push("audit_target_no_broad_route_refactor_false");
  if (o["postPatchAuditConfirmsNoNewDependency"] !== true)
    reasons.push("audit_target_no_new_dependency_false");

  // 8.5O audit detector flags
  if (o["postPatchAuditConfirmsDetectorUsesMultiSignalScoring"] !== true)
    reasons.push("audit_detector_multi_signal_scoring_false");
  if (o["postPatchAuditConfirmsDetectorUsesLengthThresholds"] !== true)
    reasons.push("audit_detector_length_thresholds_false");
  if (o["postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers"] !== true)
    reasons.push("audit_detector_official_letter_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers"] !== true)
    reasons.push("audit_detector_german_authority_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers"] !== true)
    reasons.push("audit_detector_invoice_mahnung_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers"] !== true)
    reasons.push("audit_detector_bescheid_widerspruch_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers"] !== true)
    reasons.push("audit_detector_deadline_legal_consequence_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesPersonalDataMarkers"] !== true)
    reasons.push("audit_detector_personal_data_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers"] !== true)
    reasons.push("audit_detector_reference_number_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers"] !== true)
    reasons.push("audit_detector_salutation_and_signature_markers_false");
  if (o["postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText"] !== true)
    reasons.push("audit_detector_passes_question_like_general_text_false");
  if (o["postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText"] !== true)
    reasons.push("audit_detector_blocks_high_risk_document_like_text_false");
  if (o["postPatchAuditConfirmsDetectorUsesConservativeHandling"] !== true)
    reasons.push("audit_detector_conservative_handling_false");

  // 8.5O audit response flags
  if (o["postPatchAuditConfirmsBlockedResponseStatusNonSuccess"] !== true)
    reasons.push("audit_response_status_non_success_false");
  if (o["postPatchAuditConfirmsBlockedResponseOkFalse"] !== true)
    reasons.push("audit_response_ok_false_false");
  if (o["postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("audit_response_code_document_mode_required_false");
  if (o["postPatchAuditConfirmsBlockedResponseShortUserSafeMessage"] !== true)
    reasons.push("audit_response_short_user_safe_message_false");
  if (o["postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime"] !== true)
    reasons.push("audit_response_points_to_paid_doc_mode_false");
  if (o["postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase"] !== true)
    reasons.push("audit_response_may_suggest_rephrase_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoInternalGovernance"] !== true)
    reasons.push("audit_response_no_internal_governance_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals"] !== true)
    reasons.push("audit_response_no_tamper_or_audit_internals_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho"] !== true)
    reasons.push("audit_response_no_raw_document_echo_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoTranslation"] !== true)
    reasons.push("audit_response_no_translation_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoSummary"] !== true)
    reasons.push("audit_response_no_summary_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoExplanation"] !== true)
    reasons.push("audit_response_no_explanation_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoLegalAdvice"] !== true)
    reasons.push("audit_response_no_legal_advice_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoExactDeadline"] !== true)
    reasons.push("audit_response_no_exact_deadline_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoLegalCertainty"] !== true)
    reasons.push("audit_response_no_legal_certainty_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoClaimAuthorization"] !== true)
    reasons.push("audit_response_no_claim_authorization_false");

  // Authorization grants (must all be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false)
    reasons.push("go_live_authorization_granted_must_be_false");

  // TD flags
  if (o["td001DocumentBypassGuardPostPatchAudited"] !== true)
    reasons.push("td001_post_patch_audited_false");
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary"] !== true)
    reasons.push("td001_still_requires_future_paid_mode_boundary_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_false");
  if (o["td005PaidDocumentModeServerBoundaryContracted"] !== true)
    reasons.push("td005_server_boundary_contracted_false");
  if (o["td005PaidDocumentModeStillRequiresImplementationPlan"] !== true)
    reasons.push("td005_still_requires_implementation_plan_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_runtime_implementation_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // Actual performed flags from 8.5O (must all be false)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_must_be_false");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("actual_real_document_input_performed_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("actual_real_document_processing_performed_must_be_false");
  if (o["actualOcrPerformed"] !== false)
    reasons.push("actual_ocr_performed_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false)
    reasons.push("actual_photo_input_processed_must_be_false");
  if (o["actualFileInputProcessed"] !== false)
    reasons.push("actual_file_input_processed_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false)
    reasons.push("actual_document_storage_performed_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false)
    reasons.push("actual_database_persistence_performed_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false)
    reasons.push("actual_audit_persistence_performed_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("actual_user_visible_output_performed_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("actual_public_runtime_enabled_must_be_false");
  if (o["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed_must_be_false");
  if (o["actualPhotoRouteQuarantinePerformed"] !== false)
    reasons.push("actual_photo_route_quarantine_performed_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false)
    reasons.push("actual_payment_runtime_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false)
    reasons.push("actual_entitlement_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false)
    reasons.push("actual_checkout_implemented_must_be_false");

  // No-prohibited-side-effect confirmations from 8.5O (must all be true)
  if (o["textBypassGuardPostPatchAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("audit_confirms_no_openai_call_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoFetchCall"] !== true)
    reasons.push("audit_confirms_no_fetch_call_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("audit_confirms_no_process_env_read_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("audit_confirms_no_sdk_usage_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("audit_confirms_no_8x3ac_rerun_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("audit_confirms_no_smart_talk_runtime_call_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoRouteImport"] !== true)
    reasons.push("audit_confirms_no_route_import_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoRouteMutation"] !== true)
    reasons.push("audit_confirms_no_route_mutation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("audit_confirms_no_public_route_mutation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoUiMutation"] !== true)
    reasons.push("audit_confirms_no_ui_mutation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation"] !== true)
    reasons.push("audit_confirms_no_supabase_mutation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("audit_confirms_no_storage_mutation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("audit_confirms_no_database_write_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("audit_confirms_no_audit_persistence_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("audit_confirms_no_payment_runtime_call_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("audit_confirms_no_ocr_runtime_call_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("audit_confirms_no_photo_input_processing_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing"] !== true)
    reasons.push("audit_confirms_no_file_input_processing_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("audit_confirms_no_document_parsing_runtime_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("audit_confirms_no_raw_document_storage_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage"] !== true)
    reasons.push("audit_confirms_no_model_output_storage_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoPromptStorage"] !== true)
    reasons.push("audit_confirms_no_prompt_storage_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("audit_confirms_no_user_visible_document_explanation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("audit_confirms_no_customer_facing_document_analysis_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("audit_confirms_no_evidence_evaluation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("audit_confirms_no_claim_authorization_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("audit_confirms_no_deadline_calculation_false");
  if (o["textBypassGuardPostPatchAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("audit_confirms_no_legal_certainty_false");

  // Pipeline executed flags (must all be false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("execution_sequence_actually_executed_must_be_false");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("runtime_pipeline_actually_executed_must_be_false");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("document_pipeline_actually_executed_must_be_false");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("payment_pipeline_actually_executed_must_be_false");
  if (o["entitlementPipelineActuallyExecuted"] !== false)
    reasons.push("entitlement_pipeline_actually_executed_must_be_false");
  if (o["checkoutPipelineActuallyExecuted"] !== false)
    reasons.push("checkout_pipeline_actually_executed_must_be_false");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("ocr_pipeline_actually_executed_must_be_false");
  if (o["userVisiblePipelineActuallyExecuted"] !== false)
    reasons.push("user_visible_pipeline_actually_executed_must_be_false");

  // Runtime authorization flags (must all be false)
  if (o["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now_must_be_false");
  if (o["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now_must_be_false");
  if (o["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now_must_be_false");
  if (o["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now_must_be_false");
  if (o["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now_must_be_false");
  if (o["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now_must_be_false");
  if (o["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now_must_be_false");
  if (o["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now_must_be_false");
  if (o["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now_must_be_false");
  if (o["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now_must_be_false");
  if (o["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now_must_be_false");
  if (o["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now_must_be_false");
  if (o["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now_must_be_false");
  if (o["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now_must_be_false");
  if (o["paidDocumentModeRuntimeAuthorizedNow"] !== false)
    reasons.push("paid_document_mode_runtime_authorized_now_must_be_false");
  if (o["paymentRuntimeAuthorizedNow"] !== false)
    reasons.push("payment_runtime_authorized_now_must_be_false");
  if (o["entitlementRuntimeAuthorizedNow"] !== false)
    reasons.push("entitlement_runtime_authorized_now_must_be_false");
  if (o["checkoutRuntimeAuthorizedNow"] !== false)
    reasons.push("checkout_runtime_authorized_now_must_be_false");

  // Legal safety flags
  if (o["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized_must_be_false");
  if (o["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized_must_be_false");
  if (o["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized_must_be_false");
  if (o["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_required_for_exact_deadline_false");

  // 8.5O forward readiness gate
  if (o["readyFor8x5PPaidDocumentModeServerBoundaryContract"] !== true)
    reasons.push("ready_for_8x5p_paid_document_mode_server_boundary_contract_false");

  // 8.5P core contract assertions
  if (o["paidDocumentModeServerBoundaryContractOnly"] !== true)
    reasons.push("paid_document_mode_server_boundary_contract_only_false");
  if (o["paidDocumentModeServerBoundaryContractDefined"] !== true)
    reasons.push("paid_document_mode_server_boundary_contract_defined_false");
  if (o["paidDocumentModeRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_runtime_still_not_implemented_false");
  if (o["paidDocumentModeBoundaryStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_boundary_still_not_implemented_false");
  if (o["paidDocumentModePaymentRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_payment_runtime_still_not_implemented_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorized"] !== true)
    reasons.push("paid_document_mode_document_processing_still_not_authorized_false");
  if (o["paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized"] !== true)
    reasons.push("paid_document_mode_user_visible_document_explanation_still_not_authorized_false");

  // 8.5P Free Q&A containment dependency flags
  if (o["paidBoundaryContractRequiresFreeQaBypassGuardPreserved"] !== true)
    reasons.push("requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked"] !== true)
    reasons.push("requires_document_like_text_in_free_qa_still_blocked_false");
  if (o["paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved"] !== true)
    reasons.push("requires_document_mode_required_response_preserved_false");
  if (o["paidBoundaryContractRequiresGeneralQuestionsStillAllowed"] !== true)
    reasons.push("requires_general_questions_still_allowed_false");
  if (o["paidBoundaryContractForbidsFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("forbids_full_document_explanation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsDocumentTranslationInFreeQa"] !== true)
    reasons.push("forbids_document_translation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsDeadlineCalculationInFreeQa"] !== true)
    reasons.push("forbids_deadline_calculation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsLegalCertaintyInFreeQa"] !== true)
    reasons.push("forbids_legal_certainty_in_free_qa_false");
  if (o["paidBoundaryContractForbidsClaimAuthorizationInFreeQa"] !== true)
    reasons.push("forbids_claim_authorization_in_free_qa_false");

  // 8.5P server boundary flags
  if (o["paidBoundaryContractRequiresServerSideEntitlementCheck"] !== true)
    reasons.push("requires_server_side_entitlement_check_false");
  if (o["paidBoundaryContractForbidsUiOnlyEntitlement"] !== true)
    reasons.push("forbids_ui_only_entitlement_false");
  if (o["paidBoundaryContractForbidsTrustingClientPaidFlag"] !== true)
    reasons.push("forbids_trusting_client_paid_flag_false");
  if (o["paidBoundaryContractForbidsTrustingClientDocumentModeFlag"] !== true)
    reasons.push("forbids_trusting_client_document_mode_flag_false");
  if (o["paidBoundaryContractRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("requires_server_verified_paid_session_false");
  if (o["paidBoundaryContractRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryContractRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement"] !== true)
    reasons.push("requires_deny_by_default_for_missing_entitlement_false");
  if (o["paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented"] !== true)
    reasons.push("requires_document_mode_disabled_until_boundary_implemented_false");
  if (o["paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary"] !== true)
    reasons.push("requires_no_document_processing_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoModelCallBeforeBoundary"] !== true)
    reasons.push("requires_no_model_call_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoStorageBeforeBoundary"] !== true)
    reasons.push("requires_no_storage_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoPersistenceBeforeBoundary"] !== true)
    reasons.push("requires_no_persistence_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary"] !== true)
    reasons.push("requires_no_user_visible_document_explanation_before_boundary_false");

  // 8.5P future paid mode boundary design flags
  if (o["paidBoundaryContractDefinesFreeQaLane"] !== true)
    reasons.push("defines_free_qa_lane_false");
  if (o["paidBoundaryContractDefinesPaidDocumentLane"] !== true)
    reasons.push("defines_paid_document_lane_false");
  if (o["paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired"] !== true)
    reasons.push("requires_blocked_unauthorized_lane_to_return_document_mode_required_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase"] !== true)
    reasons.push("requires_entitled_lane_not_activated_in_this_phase_false");
  if (o["paidBoundaryContractRequiresSeparateImplementationPlanNext"] !== true)
    reasons.push("requires_separate_implementation_plan_next_false");

  // 8.5P no-prohibited-side-effect confirmations
  if (o["paidBoundaryContractConfirmsNoOpenAiCall"] !== true)
    reasons.push("contract_confirms_no_openai_call_false");
  if (o["paidBoundaryContractConfirmsNoFetchCall"] !== true)
    reasons.push("contract_confirms_no_fetch_call_false");
  if (o["paidBoundaryContractConfirmsNoProcessEnvRead"] !== true)
    reasons.push("contract_confirms_no_process_env_read_false");
  if (o["paidBoundaryContractConfirmsNoSdkUsage"] !== true)
    reasons.push("contract_confirms_no_sdk_usage_false");
  if (o["paidBoundaryContractConfirmsNo8x3AcRerun"] !== true)
    reasons.push("contract_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundaryContractConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("contract_confirms_no_smart_talk_runtime_call_false");
  if (o["paidBoundaryContractConfirmsNoRouteImport"] !== true)
    reasons.push("contract_confirms_no_route_import_false");
  if (o["paidBoundaryContractConfirmsNoRouteMutation"] !== true)
    reasons.push("contract_confirms_no_route_mutation_false");
  if (o["paidBoundaryContractConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("contract_confirms_no_public_route_mutation_false");
  if (o["paidBoundaryContractConfirmsNoUiMutation"] !== true)
    reasons.push("contract_confirms_no_ui_mutation_false");
  if (o["paidBoundaryContractConfirmsNoSupabaseMutation"] !== true)
    reasons.push("contract_confirms_no_supabase_mutation_false");
  if (o["paidBoundaryContractConfirmsNoStorageMutation"] !== true)
    reasons.push("contract_confirms_no_storage_mutation_false");
  if (o["paidBoundaryContractConfirmsNoDatabaseWrite"] !== true)
    reasons.push("contract_confirms_no_database_write_false");
  if (o["paidBoundaryContractConfirmsNoAuditPersistence"] !== true)
    reasons.push("contract_confirms_no_audit_persistence_false");
  if (o["paidBoundaryContractConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("contract_confirms_no_payment_runtime_call_false");
  if (o["paidBoundaryContractConfirmsNoStripeCall"] !== true)
    reasons.push("contract_confirms_no_stripe_call_false");
  if (o["paidBoundaryContractConfirmsNoCheckoutCall"] !== true)
    reasons.push("contract_confirms_no_checkout_call_false");
  if (o["paidBoundaryContractConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("contract_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundaryContractConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("contract_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundaryContractConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("contract_confirms_no_photo_input_processing_false");
  if (o["paidBoundaryContractConfirmsNoFileInputProcessing"] !== true)
    reasons.push("contract_confirms_no_file_input_processing_false");
  if (o["paidBoundaryContractConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("contract_confirms_no_document_parsing_runtime_false");
  if (o["paidBoundaryContractConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("contract_confirms_no_raw_document_storage_false");
  if (o["paidBoundaryContractConfirmsNoModelOutputStorage"] !== true)
    reasons.push("contract_confirms_no_model_output_storage_false");
  if (o["paidBoundaryContractConfirmsNoPromptStorage"] !== true)
    reasons.push("contract_confirms_no_prompt_storage_false");
  if (o["paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("contract_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("contract_confirms_no_customer_facing_document_analysis_false");
  if (o["paidBoundaryContractConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("contract_confirms_no_evidence_evaluation_false");
  if (o["paidBoundaryContractConfirmsNoClaimAuthorization"] !== true)
    reasons.push("contract_confirms_no_claim_authorization_false");
  if (o["paidBoundaryContractConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("contract_confirms_no_deadline_calculation_false");
  if (o["paidBoundaryContractConfirmsNoLegalCertainty"] !== true)
    reasons.push("contract_confirms_no_legal_certainty_false");

  // 8.5P forward readiness
  if (o["readyFor8x5QPaidDocumentModeBoundaryImplementationPlan"] !== true)
    reasons.push("ready_for_8x5q_paid_document_mode_boundary_implementation_plan_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("ready_for_pilot_authorization_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("ready_for_production_authorization_must_be_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false)
    reasons.push("persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true)
    reasons.push("never_user_visible_must_be_true");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.5P input ──────────────────────────────────────────────────────

function buildCanonical8x5PInput(): ControlledRealDocumentPaidDocumentModeServerBoundaryContractInput {
  const auditResult = runControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAudit();
  return {
    // 8.5O prerequisite gate
    prereqCheckId: auditResult.checkId,
    prereqAllPassed: auditResult.allPassed,
    controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted:
      auditResult.controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted,
    textDocumentBypassGuardPostPatchContainmentAuditOnly:
      auditResult.textDocumentBypassGuardPostPatchContainmentAuditOnly,
    textDocumentBypassGuardPostPatchContainmentAuditCompleted:
      auditResult.textDocumentBypassGuardPostPatchContainmentAuditCompleted,
    textDocumentBypassGuardContainmentPatchVerified:
      auditResult.textDocumentBypassGuardContainmentPatchVerified,
    textDocumentBypassGuardFreeQaContainmentVerified:
      auditResult.textDocumentBypassGuardFreeQaContainmentVerified,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified:
      auditResult.textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified,
    textDocumentBypassGuardGeneralQuestionsPassThroughVerified:
      auditResult.textDocumentBypassGuardGeneralQuestionsPassThroughVerified,
    textDocumentBypassGuardDocumentModeRequiredResponseVerified:
      auditResult.textDocumentBypassGuardDocumentModeRequiredResponseVerified,
    textDocumentBypassGuardNoRuntimeAuthorizationVerified:
      auditResult.textDocumentBypassGuardNoRuntimeAuthorizationVerified,

    // 8.5O audit target flags
    postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N:
      auditResult.postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N,
    postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N:
      auditResult.postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N,
    postPatchAuditConfirmsPhotoOcrQuarantinePreserved:
      auditResult.postPatchAuditConfirmsPhotoOcrQuarantinePreserved,
    postPatchAuditConfirmsGuardIsServerSide:
      auditResult.postPatchAuditConfirmsGuardIsServerSide,
    postPatchAuditConfirmsGuardIsDeterministicLocal:
      auditResult.postPatchAuditConfirmsGuardIsDeterministicLocal,
    postPatchAuditConfirmsGuardRunsAfterJsonParse:
      auditResult.postPatchAuditConfirmsGuardRunsAfterJsonParse,
    postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk:
      auditResult.postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk,
    postPatchAuditConfirmsBlockedPathNoRunSmartTalk:
      auditResult.postPatchAuditConfirmsBlockedPathNoRunSmartTalk,
    postPatchAuditConfirmsAllowedPathPreservesExistingFlow:
      auditResult.postPatchAuditConfirmsAllowedPathPreservesExistingFlow,
    postPatchAuditConfirmsNoBroadRouteRefactor:
      auditResult.postPatchAuditConfirmsNoBroadRouteRefactor,
    postPatchAuditConfirmsNoNewDependency:
      auditResult.postPatchAuditConfirmsNoNewDependency,

    // 8.5O audit detector flags
    postPatchAuditConfirmsDetectorUsesMultiSignalScoring:
      auditResult.postPatchAuditConfirmsDetectorUsesMultiSignalScoring,
    postPatchAuditConfirmsDetectorUsesLengthThresholds:
      auditResult.postPatchAuditConfirmsDetectorUsesLengthThresholds,
    postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers,
    postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers,
    postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers,
    postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers,
    postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers,
    postPatchAuditConfirmsDetectorUsesPersonalDataMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesPersonalDataMarkers,
    postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers,
    postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers:
      auditResult.postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers,
    postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText:
      auditResult.postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText,
    postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText:
      auditResult.postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText,
    postPatchAuditConfirmsDetectorUsesConservativeHandling:
      auditResult.postPatchAuditConfirmsDetectorUsesConservativeHandling,

    // 8.5O audit response flags
    postPatchAuditConfirmsBlockedResponseStatusNonSuccess:
      auditResult.postPatchAuditConfirmsBlockedResponseStatusNonSuccess,
    postPatchAuditConfirmsBlockedResponseOkFalse:
      auditResult.postPatchAuditConfirmsBlockedResponseOkFalse,
    postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired:
      auditResult.postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired,
    postPatchAuditConfirmsBlockedResponseShortUserSafeMessage:
      auditResult.postPatchAuditConfirmsBlockedResponseShortUserSafeMessage,
    postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime:
      auditResult.postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime,
    postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase:
      auditResult.postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase,
    postPatchAuditConfirmsBlockedResponseNoInternalGovernance:
      auditResult.postPatchAuditConfirmsBlockedResponseNoInternalGovernance,
    postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals:
      auditResult.postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals,
    postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho:
      auditResult.postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho,
    postPatchAuditConfirmsBlockedResponseNoTranslation:
      auditResult.postPatchAuditConfirmsBlockedResponseNoTranslation,
    postPatchAuditConfirmsBlockedResponseNoSummary:
      auditResult.postPatchAuditConfirmsBlockedResponseNoSummary,
    postPatchAuditConfirmsBlockedResponseNoExplanation:
      auditResult.postPatchAuditConfirmsBlockedResponseNoExplanation,
    postPatchAuditConfirmsBlockedResponseNoLegalAdvice:
      auditResult.postPatchAuditConfirmsBlockedResponseNoLegalAdvice,
    postPatchAuditConfirmsBlockedResponseNoExactDeadline:
      auditResult.postPatchAuditConfirmsBlockedResponseNoExactDeadline,
    postPatchAuditConfirmsBlockedResponseNoLegalCertainty:
      auditResult.postPatchAuditConfirmsBlockedResponseNoLegalCertainty,
    postPatchAuditConfirmsBlockedResponseNoClaimAuthorization:
      auditResult.postPatchAuditConfirmsBlockedResponseNoClaimAuthorization,

    // Authorization grants
    runtimeAuthorizationGranted: auditResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: auditResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: auditResult.productionAuthorizationGranted,
    finalAuthorizationGranted: auditResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: auditResult.goLiveAuthorizationGranted,

    // TD flags
    td001DocumentBypassGuardPostPatchAudited: auditResult.td001DocumentBypassGuardPostPatchAudited,
    td001DocumentBypassGuardContainmentClosed: auditResult.td001DocumentBypassGuardContainmentClosed,
    td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary:
      auditResult.td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      auditResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      auditResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td004PreModelPiiRedactionMissing: auditResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced: auditResult.td005PaidDocumentModeNotServerSideEnforced,
    td005PaidDocumentModeServerBoundaryContracted: true,
    td005PaidDocumentModeStillRequiresImplementationPlan: true,
    td005PaidDocumentModeStillRequiresRuntimeImplementation: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      auditResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      auditResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      auditResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: auditResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: auditResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: auditResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: auditResult.tmpFilesPresentInWorkingTree,

    // Actual performed flags from 8.5O
    actualLiveRouteMutationPerformed: auditResult.actualLiveRouteMutationPerformed,
    actualDocumentBypassGuardImplemented: auditResult.actualDocumentBypassGuardImplemented,
    actualRealDocumentInputPerformed: auditResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: auditResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: auditResult.actualOcrPerformed,
    actualPhotoInputProcessed: auditResult.actualPhotoInputProcessed,
    actualFileInputProcessed: auditResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: auditResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: auditResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: auditResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: auditResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: auditResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: auditResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: auditResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: auditResult.actualDeadlineCalculationPerformed,
    actualPhotoRouteQuarantinePerformed: auditResult.actualPhotoRouteQuarantinePerformed,
    actualPaidDocumentModeImplemented: auditResult.actualPaidDocumentModeImplemented,
    actualPiiRedactionImplemented: auditResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: auditResult.actualEvidenceGateRuntimeWiringPerformed,

    // 8.5P-specific actual flags
    actualPaymentRuntimeImplemented: false,
    actualEntitlementRuntimeImplemented: false,
    actualCheckoutImplemented: false,

    // No-prohibited-side-effect confirmations from 8.5O
    textBypassGuardPostPatchAuditConfirmsNoOpenAiCall:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoOpenAiCall,
    textBypassGuardPostPatchAuditConfirmsNoFetchCall:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoFetchCall,
    textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead,
    textBypassGuardPostPatchAuditConfirmsNoSdkUsage:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoSdkUsage,
    textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun:
      auditResult.textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun,
    textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall,
    textBypassGuardPostPatchAuditConfirmsNoRouteImport:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoRouteImport,
    textBypassGuardPostPatchAuditConfirmsNoRouteMutation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoRouteMutation,
    textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation,
    textBypassGuardPostPatchAuditConfirmsNoUiMutation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoUiMutation,
    textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation,
    textBypassGuardPostPatchAuditConfirmsNoStorageMutation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoStorageMutation,
    textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite,
    textBypassGuardPostPatchAuditConfirmsNoAuditPersistence:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoAuditPersistence,
    textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall,
    textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall,
    textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing,
    textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing,
    textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime,
    textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage,
    textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage,
    textBypassGuardPostPatchAuditConfirmsNoPromptStorage:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoPromptStorage,
    textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation,
    textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis,
    textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation,
    textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization,
    textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation,
    textBypassGuardPostPatchAuditConfirmsNoLegalCertainty:
      auditResult.textBypassGuardPostPatchAuditConfirmsNoLegalCertainty,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: auditResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: auditResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: auditResult.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: auditResult.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: false,
    checkoutPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: auditResult.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: auditResult.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
    realDocumentInputAuthorizedNow: auditResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: auditResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: auditResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: auditResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: auditResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: auditResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: auditResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: auditResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: auditResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow: auditResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: auditResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: auditResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: auditResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: auditResult.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: auditResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: auditResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: auditResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: auditResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: auditResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: auditResult.deliveryDateRequiredForExactDeadline,

    // 8.5O forward readiness gate
    readyFor8x5PPaidDocumentModeServerBoundaryContract:
      auditResult.readyFor8x5PPaidDocumentModeServerBoundaryContract,

    // 8.5P core contract assertions
    paidDocumentModeServerBoundaryContractOnly: true,
    paidDocumentModeServerBoundaryContractDefined: true,
    paidDocumentModeRuntimeStillNotImplemented: true,
    paidDocumentModeBoundaryStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,

    // 8.5P Free Q&A containment dependency flags
    paidBoundaryContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: true,
    paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: true,
    paidBoundaryContractRequiresGeneralQuestionsStillAllowed: true,
    paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: true,
    paidBoundaryContractForbidsDocumentTranslationInFreeQa: true,
    paidBoundaryContractForbidsDeadlineCalculationInFreeQa: true,
    paidBoundaryContractForbidsLegalCertaintyInFreeQa: true,
    paidBoundaryContractForbidsClaimAuthorizationInFreeQa: true,

    // 8.5P server boundary flags
    paidBoundaryContractRequiresServerSideEntitlementCheck: true,
    paidBoundaryContractForbidsUiOnlyEntitlement: true,
    paidBoundaryContractForbidsTrustingClientPaidFlag: true,
    paidBoundaryContractForbidsTrustingClientDocumentModeFlag: true,
    paidBoundaryContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: true,
    paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: true,
    paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: true,
    paidBoundaryContractRequiresNoModelCallBeforeBoundary: true,
    paidBoundaryContractRequiresNoStorageBeforeBoundary: true,
    paidBoundaryContractRequiresNoPersistenceBeforeBoundary: true,
    paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: true,

    // 8.5P future paid mode boundary design flags
    paidBoundaryContractDefinesFreeQaLane: true,
    paidBoundaryContractDefinesPaidDocumentLane: true,
    paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: true,
    paidBoundaryContractRequiresSeparateImplementationPlanNext: true,

    // 8.5P no-prohibited-side-effect confirmations
    paidBoundaryContractConfirmsNoOpenAiCall: true,
    paidBoundaryContractConfirmsNoFetchCall: true,
    paidBoundaryContractConfirmsNoProcessEnvRead: true,
    paidBoundaryContractConfirmsNoSdkUsage: true,
    paidBoundaryContractConfirmsNo8x3AcRerun: true,
    paidBoundaryContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryContractConfirmsNoRouteImport: true,
    paidBoundaryContractConfirmsNoRouteMutation: true,
    paidBoundaryContractConfirmsNoPublicRouteMutation: true,
    paidBoundaryContractConfirmsNoUiMutation: true,
    paidBoundaryContractConfirmsNoSupabaseMutation: true,
    paidBoundaryContractConfirmsNoStorageMutation: true,
    paidBoundaryContractConfirmsNoDatabaseWrite: true,
    paidBoundaryContractConfirmsNoAuditPersistence: true,
    paidBoundaryContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryContractConfirmsNoStripeCall: true,
    paidBoundaryContractConfirmsNoCheckoutCall: true,
    paidBoundaryContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryContractConfirmsNoPhotoInputProcessing: true,
    paidBoundaryContractConfirmsNoFileInputProcessing: true,
    paidBoundaryContractConfirmsNoDocumentParsingRuntime: true,
    paidBoundaryContractConfirmsNoRawDocumentStorage: true,
    paidBoundaryContractConfirmsNoModelOutputStorage: true,
    paidBoundaryContractConfirmsNoPromptStorage: true,
    paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis: true,
    paidBoundaryContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryContractConfirmsNoClaimAuthorization: true,
    paidBoundaryContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryContractConfirmsNoLegalCertainty: true,

    // 8.5P forward readiness
    readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
  };
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x5PInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validatePaidDocumentModeServerBoundaryContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5O prerequisite gate
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5N" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("post_patch_containment_audit_not_accepted",
    { controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted: false });
  expect_rejected("post_patch_containment_audit_only_false",
    { textDocumentBypassGuardPostPatchContainmentAuditOnly: false });
  expect_rejected("post_patch_containment_audit_completed_false",
    { textDocumentBypassGuardPostPatchContainmentAuditCompleted: false });
  expect_rejected("containment_patch_verified_false",
    { textDocumentBypassGuardContainmentPatchVerified: false });
  expect_rejected("free_qa_containment_verified_false",
    { textDocumentBypassGuardFreeQaContainmentVerified: false });
  expect_rejected("blocks_document_like_text_verified_false",
    { textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: false });
  expect_rejected("general_questions_pass_through_verified_false",
    { textDocumentBypassGuardGeneralQuestionsPassThroughVerified: false });
  expect_rejected("document_mode_required_response_verified_false",
    { textDocumentBypassGuardDocumentModeRequiredResponseVerified: false });
  expect_rejected("no_runtime_authorization_verified_false",
    { textDocumentBypassGuardNoRuntimeAuthorizationVerified: false });

  // Audit target flags
  expect_rejected("audit_target_smart_talk_route_modified_false",
    { postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: false });
  expect_rejected("audit_target_photo_route_not_modified_false",
    { postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: false });
  expect_rejected("audit_target_photo_ocr_quarantine_preserved_false",
    { postPatchAuditConfirmsPhotoOcrQuarantinePreserved: false });
  expect_rejected("audit_target_guard_is_server_side_false",
    { postPatchAuditConfirmsGuardIsServerSide: false });
  expect_rejected("audit_target_guard_is_deterministic_local_false",
    { postPatchAuditConfirmsGuardIsDeterministicLocal: false });
  expect_rejected("audit_target_guard_runs_after_json_parse_false",
    { postPatchAuditConfirmsGuardRunsAfterJsonParse: false });
  expect_rejected("audit_target_guard_runs_before_run_smart_talk_false",
    { postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: false });
  expect_rejected("audit_target_blocked_path_no_run_smart_talk_false",
    { postPatchAuditConfirmsBlockedPathNoRunSmartTalk: false });
  expect_rejected("audit_target_allowed_path_preserves_existing_flow_false",
    { postPatchAuditConfirmsAllowedPathPreservesExistingFlow: false });
  expect_rejected("audit_target_no_broad_route_refactor_false",
    { postPatchAuditConfirmsNoBroadRouteRefactor: false });
  expect_rejected("audit_target_no_new_dependency_false",
    { postPatchAuditConfirmsNoNewDependency: false });

  // Audit detector flags
  expect_rejected("audit_detector_multi_signal_scoring_false",
    { postPatchAuditConfirmsDetectorUsesMultiSignalScoring: false });
  expect_rejected("audit_detector_length_thresholds_false",
    { postPatchAuditConfirmsDetectorUsesLengthThresholds: false });
  expect_rejected("audit_detector_official_letter_markers_false",
    { postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: false });
  expect_rejected("audit_detector_german_authority_markers_false",
    { postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: false });
  expect_rejected("audit_detector_invoice_mahnung_markers_false",
    { postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: false });
  expect_rejected("audit_detector_bescheid_widerspruch_markers_false",
    { postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: false });
  expect_rejected("audit_detector_deadline_legal_consequence_markers_false",
    { postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: false });
  expect_rejected("audit_detector_personal_data_markers_false",
    { postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: false });
  expect_rejected("audit_detector_reference_number_markers_false",
    { postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: false });
  expect_rejected("audit_detector_salutation_and_signature_markers_false",
    { postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: false });
  expect_rejected("audit_detector_passes_question_like_general_text_false",
    { postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: false });
  expect_rejected("audit_detector_blocks_high_risk_document_like_text_false",
    { postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: false });
  expect_rejected("audit_detector_conservative_handling_false",
    { postPatchAuditConfirmsDetectorUsesConservativeHandling: false });

  // Audit response flags
  expect_rejected("audit_response_status_non_success_false",
    { postPatchAuditConfirmsBlockedResponseStatusNonSuccess: false });
  expect_rejected("audit_response_ok_false_false",
    { postPatchAuditConfirmsBlockedResponseOkFalse: false });
  expect_rejected("audit_response_code_document_mode_required_false",
    { postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: false });
  expect_rejected("audit_response_short_user_safe_message_false",
    { postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: false });
  expect_rejected("audit_response_points_to_paid_doc_mode_false",
    { postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: false });
  expect_rejected("audit_response_may_suggest_rephrase_false",
    { postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: false });
  expect_rejected("audit_response_no_internal_governance_false",
    { postPatchAuditConfirmsBlockedResponseNoInternalGovernance: false });
  expect_rejected("audit_response_no_tamper_or_audit_internals_false",
    { postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: false });
  expect_rejected("audit_response_no_raw_document_echo_false",
    { postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: false });
  expect_rejected("audit_response_no_translation_false",
    { postPatchAuditConfirmsBlockedResponseNoTranslation: false });
  expect_rejected("audit_response_no_summary_false",
    { postPatchAuditConfirmsBlockedResponseNoSummary: false });
  expect_rejected("audit_response_no_explanation_false",
    { postPatchAuditConfirmsBlockedResponseNoExplanation: false });
  expect_rejected("audit_response_no_legal_advice_false",
    { postPatchAuditConfirmsBlockedResponseNoLegalAdvice: false });
  expect_rejected("audit_response_no_exact_deadline_false",
    { postPatchAuditConfirmsBlockedResponseNoExactDeadline: false });
  expect_rejected("audit_response_no_legal_certainty_false",
    { postPatchAuditConfirmsBlockedResponseNoLegalCertainty: false });
  expect_rejected("audit_response_no_claim_authorization_false",
    { postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: false });

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_post_patch_audited_false",
    { td001DocumentBypassGuardPostPatchAudited: false });
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td001_still_requires_future_paid_mode_boundary_false",
    { td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: false });
  expect_rejected("td003_photo_ocr_route_contained_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td004_pre_model_pii_redaction_missing_false",
    { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td005_paid_document_mode_not_server_side_enforced_false",
    { td005PaidDocumentModeNotServerSideEnforced: false });
  expect_rejected("td005_server_boundary_contracted_false",
    { td005PaidDocumentModeServerBoundaryContracted: false });
  expect_rejected("td005_still_requires_implementation_plan_false",
    { td005PaidDocumentModeStillRequiresImplementationPlan: false });
  expect_rejected("td005_still_requires_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresRuntimeImplementation: false });
  expect_rejected("td002_evidence_gates_not_wired_false",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("td009_tmp_debug_runner_debt_closed_false",
    { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("tmp_files_present_in_working_tree_true",
    { tmpFilesPresentInWorkingTree: true });

  // Actual performed flags (must all be false)
  expect_rejected("actual_live_route_mutation_performed_true",
    { actualLiveRouteMutationPerformed: true });
  expect_rejected("actual_document_bypass_guard_implemented_true",
    { actualDocumentBypassGuardImplemented: true });
  expect_rejected("actual_real_document_input_performed_true",
    { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_document_processing_performed_true",
    { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_ocr_performed_true", { actualOcrPerformed: true });
  expect_rejected("actual_photo_input_processed_true", { actualPhotoInputProcessed: true });
  expect_rejected("actual_file_input_processed_true", { actualFileInputProcessed: true });
  expect_rejected("actual_document_storage_performed_true", { actualDocumentStoragePerformed: true });
  expect_rejected("actual_database_persistence_performed_true",
    { actualDatabasePersistencePerformed: true });
  expect_rejected("actual_audit_persistence_performed_true", { actualAuditPersistencePerformed: true });
  expect_rejected("actual_user_visible_output_performed_true",
    { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_enabled_true", { actualPublicRuntimeEnabled: true });
  expect_rejected("actual_evidence_evaluation_performed_true",
    { actualEvidenceEvaluationPerformed: true });
  expect_rejected("actual_claim_authorization_performed_true",
    { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_performed_true",
    { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_photo_route_quarantine_performed_true",
    { actualPhotoRouteQuarantinePerformed: true });
  expect_rejected("actual_paid_document_mode_implemented_true",
    { actualPaidDocumentModeImplemented: true });
  expect_rejected("actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_payment_runtime_implemented_true",
    { actualPaymentRuntimeImplemented: true });
  expect_rejected("actual_entitlement_runtime_implemented_true",
    { actualEntitlementRuntimeImplemented: true });
  expect_rejected("actual_checkout_implemented_true", { actualCheckoutImplemented: true });

  // No-prohibited-side-effect confirmations from 8.5O
  expect_rejected("audit_confirms_no_openai_call_false",
    { textBypassGuardPostPatchAuditConfirmsNoOpenAiCall: false });
  expect_rejected("audit_confirms_no_fetch_call_false",
    { textBypassGuardPostPatchAuditConfirmsNoFetchCall: false });
  expect_rejected("audit_confirms_no_process_env_read_false",
    { textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead: false });
  expect_rejected("audit_confirms_no_sdk_usage_false",
    { textBypassGuardPostPatchAuditConfirmsNoSdkUsage: false });
  expect_rejected("audit_confirms_no_8x3ac_rerun_false",
    { textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun: false });
  expect_rejected("audit_confirms_no_smart_talk_runtime_call_false",
    { textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("audit_confirms_no_route_import_false",
    { textBypassGuardPostPatchAuditConfirmsNoRouteImport: false });
  expect_rejected("audit_confirms_no_route_mutation_false",
    { textBypassGuardPostPatchAuditConfirmsNoRouteMutation: false });
  expect_rejected("audit_confirms_no_public_route_mutation_false",
    { textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation: false });
  expect_rejected("audit_confirms_no_ui_mutation_false",
    { textBypassGuardPostPatchAuditConfirmsNoUiMutation: false });
  expect_rejected("audit_confirms_no_supabase_mutation_false",
    { textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation: false });
  expect_rejected("audit_confirms_no_storage_mutation_false",
    { textBypassGuardPostPatchAuditConfirmsNoStorageMutation: false });
  expect_rejected("audit_confirms_no_database_write_false",
    { textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite: false });
  expect_rejected("audit_confirms_no_audit_persistence_false",
    { textBypassGuardPostPatchAuditConfirmsNoAuditPersistence: false });
  expect_rejected("audit_confirms_no_payment_runtime_call_false",
    { textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("audit_confirms_no_ocr_runtime_call_false",
    { textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall: false });
  expect_rejected("audit_confirms_no_photo_input_processing_false",
    { textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing: false });
  expect_rejected("audit_confirms_no_file_input_processing_false",
    { textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing: false });
  expect_rejected("audit_confirms_no_document_parsing_runtime_false",
    { textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime: false });
  expect_rejected("audit_confirms_no_raw_document_storage_false",
    { textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage: false });
  expect_rejected("audit_confirms_no_model_output_storage_false",
    { textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage: false });
  expect_rejected("audit_confirms_no_prompt_storage_false",
    { textBypassGuardPostPatchAuditConfirmsNoPromptStorage: false });
  expect_rejected("audit_confirms_no_user_visible_document_explanation_false",
    { textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("audit_confirms_no_customer_facing_document_analysis_false",
    { textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis: false });
  expect_rejected("audit_confirms_no_evidence_evaluation_false",
    { textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation: false });
  expect_rejected("audit_confirms_no_claim_authorization_false",
    { textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization: false });
  expect_rejected("audit_confirms_no_deadline_calculation_false",
    { textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation: false });
  expect_rejected("audit_confirms_no_legal_certainty_false",
    { textBypassGuardPostPatchAuditConfirmsNoLegalCertainty: false });

  // Pipeline executed flags
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true",
    { runtimePipelineActuallyExecuted: true });
  expect_rejected("document_pipeline_actually_executed_true",
    { documentPipelineActuallyExecuted: true });
  expect_rejected("payment_pipeline_actually_executed_true", { paymentPipelineActuallyExecuted: true });
  expect_rejected("entitlement_pipeline_actually_executed_true",
    { entitlementPipelineActuallyExecuted: true });
  expect_rejected("checkout_pipeline_actually_executed_true",
    { checkoutPipelineActuallyExecuted: true });
  expect_rejected("ocr_pipeline_actually_executed_true", { ocrPipelineActuallyExecuted: true });
  expect_rejected("user_visible_pipeline_actually_executed_true",
    { userVisiblePipelineActuallyExecuted: true });

  // Runtime authorization flags
  expect_rejected("real_document_input_authorized_now_true",
    { realDocumentInputAuthorizedNow: true });
  expect_rejected("real_document_processing_authorized_now_true",
    { realDocumentProcessingAuthorizedNow: true });
  expect_rejected("real_user_document_upload_authorized_now_true",
    { realUserDocumentUploadAuthorizedNow: true });
  expect_rejected("ocr_runtime_authorized_now_true", { ocrRuntimeAuthorizedNow: true });
  expect_rejected("photo_input_authorized_now_true", { photoInputAuthorizedNow: true });
  expect_rejected("file_input_authorized_now_true", { fileInputAuthorizedNow: true });
  expect_rejected("document_storage_authorized_now_true", { documentStorageAuthorizedNow: true });
  expect_rejected("persistence_authorized_now_true", { persistenceAuthorizedNow: true });
  expect_rejected("public_runtime_authorized_now_true", { publicRuntimeAuthorizedNow: true });
  expect_rejected("user_visible_legal_deadline_output_authorized_now_true",
    { userVisibleLegalDeadlineOutputAuthorizedNow: true });
  expect_rejected("live_llm_runtime_authorized_now_true", { liveLLMRuntimeAuthorizedNow: true });
  expect_rejected("connected_ai_runtime_authorized_now_true", { connectedAiRuntimeAuthorizedNow: true });
  expect_rejected("pilot_runtime_authorized_now_true", { pilotRuntimeAuthorizedNow: true });
  expect_rejected("production_runtime_authorized_now_true", { productionRuntimeAuthorizedNow: true });
  expect_rejected("paid_document_mode_runtime_authorized_now_true",
    { paidDocumentModeRuntimeAuthorizedNow: true });
  expect_rejected("payment_runtime_authorized_now_true", { paymentRuntimeAuthorizedNow: true });
  expect_rejected("entitlement_runtime_authorized_now_true", { entitlementRuntimeAuthorizedNow: true });
  expect_rejected("checkout_runtime_authorized_now_true", { checkoutRuntimeAuthorizedNow: true });

  // Legal safety flags
  expect_rejected("exact_deadline_calculation_authorized_true",
    { exactDeadlineCalculationAuthorized: true });
  expect_rejected("delivery_date_invention_authorized_true", { deliveryDateInventionAuthorized: true });
  expect_rejected("final_date_invention_authorized_true", { finalDateInventionAuthorized: true });
  expect_rejected("legal_certainty_authorized_true", { legalCertaintyAuthorized: true });
  expect_rejected("coercive_legal_instruction_authorized_true",
    { coerciveLegalInstructionAuthorized: true });
  expect_rejected("delivery_date_required_for_exact_deadline_false",
    { deliveryDateRequiredForExactDeadline: false });

  // 8.5O forward readiness gate
  expect_rejected("ready_for_8x5p_server_boundary_contract_false",
    { readyFor8x5PPaidDocumentModeServerBoundaryContract: false });

  // 8.5P core contract assertions
  expect_rejected("paid_document_mode_server_boundary_contract_only_false",
    { paidDocumentModeServerBoundaryContractOnly: false });
  expect_rejected("paid_document_mode_server_boundary_contract_defined_false",
    { paidDocumentModeServerBoundaryContractDefined: false });
  expect_rejected("paid_document_mode_runtime_still_not_implemented_false",
    { paidDocumentModeRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_boundary_still_not_implemented_false",
    { paidDocumentModeBoundaryStillNotImplemented: false });
  expect_rejected("paid_document_mode_payment_runtime_still_not_implemented_false",
    { paidDocumentModePaymentRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_document_processing_still_not_authorized_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorized: false });
  expect_rejected("paid_document_mode_user_visible_document_explanation_still_not_authorized_false",
    { paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: false });

  // Free Q&A containment dependency flags
  expect_rejected("requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("requires_document_like_text_in_free_qa_still_blocked_false",
    { paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: false });
  expect_rejected("requires_document_mode_required_response_preserved_false",
    { paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: false });
  expect_rejected("requires_general_questions_still_allowed_false",
    { paidBoundaryContractRequiresGeneralQuestionsStillAllowed: false });
  expect_rejected("forbids_full_document_explanation_in_free_qa_false",
    { paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: false });
  expect_rejected("forbids_document_translation_in_free_qa_false",
    { paidBoundaryContractForbidsDocumentTranslationInFreeQa: false });
  expect_rejected("forbids_deadline_calculation_in_free_qa_false",
    { paidBoundaryContractForbidsDeadlineCalculationInFreeQa: false });
  expect_rejected("forbids_legal_certainty_in_free_qa_false",
    { paidBoundaryContractForbidsLegalCertaintyInFreeQa: false });
  expect_rejected("forbids_claim_authorization_in_free_qa_false",
    { paidBoundaryContractForbidsClaimAuthorizationInFreeQa: false });

  // Server boundary flags
  expect_rejected("requires_server_side_entitlement_check_false",
    { paidBoundaryContractRequiresServerSideEntitlementCheck: false });
  expect_rejected("forbids_ui_only_entitlement_false",
    { paidBoundaryContractForbidsUiOnlyEntitlement: false });
  expect_rejected("forbids_trusting_client_paid_flag_false",
    { paidBoundaryContractForbidsTrustingClientPaidFlag: false });
  expect_rejected("forbids_trusting_client_document_mode_flag_false",
    { paidBoundaryContractForbidsTrustingClientDocumentModeFlag: false });
  expect_rejected("requires_server_verified_paid_session_false",
    { paidBoundaryContractRequiresServerVerifiedPaidSession: false });
  expect_rejected("requires_server_verified_product_or_feature_false",
    { paidBoundaryContractRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("requires_server_verified_document_mode_access_false",
    { paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("requires_deny_by_default_for_missing_entitlement_false",
    { paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: false });
  expect_rejected("requires_document_mode_disabled_until_boundary_implemented_false",
    { paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: false });
  expect_rejected("requires_no_document_processing_before_boundary_false",
    { paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: false });
  expect_rejected("requires_no_model_call_before_boundary_false",
    { paidBoundaryContractRequiresNoModelCallBeforeBoundary: false });
  expect_rejected("requires_no_storage_before_boundary_false",
    { paidBoundaryContractRequiresNoStorageBeforeBoundary: false });
  expect_rejected("requires_no_persistence_before_boundary_false",
    { paidBoundaryContractRequiresNoPersistenceBeforeBoundary: false });
  expect_rejected("requires_no_user_visible_document_explanation_before_boundary_false",
    { paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: false });

  // Future paid mode boundary design flags
  expect_rejected("defines_free_qa_lane_false",
    { paidBoundaryContractDefinesFreeQaLane: false });
  expect_rejected("defines_paid_document_lane_false",
    { paidBoundaryContractDefinesPaidDocumentLane: false });
  expect_rejected("defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("defines_future_entitled_document_processing_lane_false",
    { paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("requires_blocked_unauthorized_lane_to_return_document_mode_required_false",
    { paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: false });
  expect_rejected("requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("requires_entitled_lane_not_activated_in_this_phase_false",
    { paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: false });
  expect_rejected("requires_separate_implementation_plan_next_false",
    { paidBoundaryContractRequiresSeparateImplementationPlanNext: false });

  // 8.5P no-prohibited-side-effect confirmations
  expect_rejected("contract_confirms_no_openai_call_false",
    { paidBoundaryContractConfirmsNoOpenAiCall: false });
  expect_rejected("contract_confirms_no_fetch_call_false",
    { paidBoundaryContractConfirmsNoFetchCall: false });
  expect_rejected("contract_confirms_no_process_env_read_false",
    { paidBoundaryContractConfirmsNoProcessEnvRead: false });
  expect_rejected("contract_confirms_no_sdk_usage_false",
    { paidBoundaryContractConfirmsNoSdkUsage: false });
  expect_rejected("contract_confirms_no_8x3ac_rerun_false",
    { paidBoundaryContractConfirmsNo8x3AcRerun: false });
  expect_rejected("contract_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryContractConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("contract_confirms_no_route_import_false",
    { paidBoundaryContractConfirmsNoRouteImport: false });
  expect_rejected("contract_confirms_no_route_mutation_false",
    { paidBoundaryContractConfirmsNoRouteMutation: false });
  expect_rejected("contract_confirms_no_public_route_mutation_false",
    { paidBoundaryContractConfirmsNoPublicRouteMutation: false });
  expect_rejected("contract_confirms_no_ui_mutation_false",
    { paidBoundaryContractConfirmsNoUiMutation: false });
  expect_rejected("contract_confirms_no_supabase_mutation_false",
    { paidBoundaryContractConfirmsNoSupabaseMutation: false });
  expect_rejected("contract_confirms_no_storage_mutation_false",
    { paidBoundaryContractConfirmsNoStorageMutation: false });
  expect_rejected("contract_confirms_no_database_write_false",
    { paidBoundaryContractConfirmsNoDatabaseWrite: false });
  expect_rejected("contract_confirms_no_audit_persistence_false",
    { paidBoundaryContractConfirmsNoAuditPersistence: false });
  expect_rejected("contract_confirms_no_payment_runtime_call_false",
    { paidBoundaryContractConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("contract_confirms_no_stripe_call_false",
    { paidBoundaryContractConfirmsNoStripeCall: false });
  expect_rejected("contract_confirms_no_checkout_call_false",
    { paidBoundaryContractConfirmsNoCheckoutCall: false });
  expect_rejected("contract_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryContractConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("contract_confirms_no_ocr_runtime_call_false",
    { paidBoundaryContractConfirmsNoOcrRuntimeCall: false });
  expect_rejected("contract_confirms_no_photo_input_processing_false",
    { paidBoundaryContractConfirmsNoPhotoInputProcessing: false });
  expect_rejected("contract_confirms_no_file_input_processing_false",
    { paidBoundaryContractConfirmsNoFileInputProcessing: false });
  expect_rejected("contract_confirms_no_document_parsing_runtime_false",
    { paidBoundaryContractConfirmsNoDocumentParsingRuntime: false });
  expect_rejected("contract_confirms_no_raw_document_storage_false",
    { paidBoundaryContractConfirmsNoRawDocumentStorage: false });
  expect_rejected("contract_confirms_no_model_output_storage_false",
    { paidBoundaryContractConfirmsNoModelOutputStorage: false });
  expect_rejected("contract_confirms_no_prompt_storage_false",
    { paidBoundaryContractConfirmsNoPromptStorage: false });
  expect_rejected("contract_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("contract_confirms_no_customer_facing_document_analysis_false",
    { paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis: false });
  expect_rejected("contract_confirms_no_evidence_evaluation_false",
    { paidBoundaryContractConfirmsNoEvidenceEvaluation: false });
  expect_rejected("contract_confirms_no_claim_authorization_false",
    { paidBoundaryContractConfirmsNoClaimAuthorization: false });
  expect_rejected("contract_confirms_no_deadline_calculation_false",
    { paidBoundaryContractConfirmsNoDeadlineCalculation: false });
  expect_rejected("contract_confirms_no_legal_certainty_false",
    { paidBoundaryContractConfirmsNoLegalCertainty: false });

  // Forward readiness
  expect_rejected("ready_for_8x5q_paid_document_mode_boundary_implementation_plan_false",
    { readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: false });
  expect_rejected("ready_for_separate_runtime_authorization_true",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_pilot_authorization_true",
    { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("ready_for_production_authorization_true",
    { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true", { persistenceUsed: true });
  expect_rejected("never_user_visible_false", { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPaidDocumentModeServerBoundaryContract(): ControlledRealDocumentPaidDocumentModeServerBoundaryContractResult {
  const canonical = buildCanonical8x5PInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validatePaidDocumentModeServerBoundaryContractInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5P",
    allPassed,
    textDocumentBypassGuardPostPatchAuditReadyForPaidDocumentBoundaryContract: true,
    controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted: allPassed,
    paidDocumentModeServerBoundaryContractOnly: true,
    paidDocumentModeServerBoundaryContractDefined: true,
    paidDocumentModeRuntimeStillNotImplemented: true,
    paidDocumentModeBoundaryStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    paidBoundaryContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: true,
    paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: true,
    paidBoundaryContractRequiresGeneralQuestionsStillAllowed: true,
    paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: true,
    paidBoundaryContractForbidsDocumentTranslationInFreeQa: true,
    paidBoundaryContractForbidsDeadlineCalculationInFreeQa: true,
    paidBoundaryContractForbidsLegalCertaintyInFreeQa: true,
    paidBoundaryContractForbidsClaimAuthorizationInFreeQa: true,

    paidBoundaryContractRequiresServerSideEntitlementCheck: true,
    paidBoundaryContractForbidsUiOnlyEntitlement: true,
    paidBoundaryContractForbidsTrustingClientPaidFlag: true,
    paidBoundaryContractForbidsTrustingClientDocumentModeFlag: true,
    paidBoundaryContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: true,
    paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: true,
    paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: true,
    paidBoundaryContractRequiresNoModelCallBeforeBoundary: true,
    paidBoundaryContractRequiresNoStorageBeforeBoundary: true,
    paidBoundaryContractRequiresNoPersistenceBeforeBoundary: true,
    paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: true,

    paidBoundaryContractDefinesFreeQaLane: true,
    paidBoundaryContractDefinesPaidDocumentLane: true,
    paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: true,
    paidBoundaryContractRequiresSeparateImplementationPlanNext: true,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardContainmentClosed: true,
    td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: true,
    td005PaidDocumentModeServerBoundaryContracted: true,
    td005PaidDocumentModeStillRequiresImplementationPlan: true,
    td005PaidDocumentModeStillRequiresRuntimeImplementation: true,
    td004PreModelPiiRedactionMissing: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,

    td006EvidenceGateTodoAndOrSemanticsUnresolved: true,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: true,
    td008InMemoryRateLimiterServerlessUnsafe: true,
    td010GetUserStateDocumentTypeTodoOpen: true,
    td009TmpDebugRunnerDebtClosed: true,
    tmpFilesPresentInWorkingTree: false,

    actualLiveRouteMutationPerformed: false,
    actualDocumentBypassGuardImplemented: false,
    actualPaidDocumentModeImplemented: false,
    actualPaymentRuntimeImplemented: false,
    actualEntitlementRuntimeImplemented: false,
    actualCheckoutImplemented: false,
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
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    paidBoundaryContractConfirmsNoOpenAiCall: true,
    paidBoundaryContractConfirmsNoFetchCall: true,
    paidBoundaryContractConfirmsNoProcessEnvRead: true,
    paidBoundaryContractConfirmsNoSdkUsage: true,
    paidBoundaryContractConfirmsNo8x3AcRerun: true,
    paidBoundaryContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryContractConfirmsNoRouteImport: true,
    paidBoundaryContractConfirmsNoRouteMutation: true,
    paidBoundaryContractConfirmsNoPublicRouteMutation: true,
    paidBoundaryContractConfirmsNoUiMutation: true,
    paidBoundaryContractConfirmsNoSupabaseMutation: true,
    paidBoundaryContractConfirmsNoStorageMutation: true,
    paidBoundaryContractConfirmsNoDatabaseWrite: true,
    paidBoundaryContractConfirmsNoAuditPersistence: true,
    paidBoundaryContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryContractConfirmsNoStripeCall: true,
    paidBoundaryContractConfirmsNoCheckoutCall: true,
    paidBoundaryContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryContractConfirmsNoPhotoInputProcessing: true,
    paidBoundaryContractConfirmsNoFileInputProcessing: true,
    paidBoundaryContractConfirmsNoDocumentParsingRuntime: true,
    paidBoundaryContractConfirmsNoRawDocumentStorage: true,
    paidBoundaryContractConfirmsNoModelOutputStorage: true,
    paidBoundaryContractConfirmsNoPromptStorage: true,
    paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis: true,
    paidBoundaryContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryContractConfirmsNoClaimAuthorization: true,
    paidBoundaryContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryContractConfirmsNoLegalCertainty: true,

    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    paymentPipelineActuallyExecuted: false,
    entitlementPipelineActuallyExecuted: false,
    checkoutPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: false,
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
    paidDocumentModeRuntimeAuthorizedNow: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5P is a controlled real-document Paid Document Mode Server Boundary Contract.",
      "8.5P depends on completed 8.5O Text Document Bypass Guard post-patch containment audit.",
      "TD-001 containment is closed before starting TD-005 boundary work.",
      "8.5P is server-boundary-contract-only.",
      "/api/smart-talk was not modified.",
      "/api/smart-talk-photo was not modified.",
      "The 8.5H photo OCR route quarantine remains preserved.",
      "The 8.5N Free Q&A bypass guard remains preserved.",
      "Document-like pasted text in Free Q&A remains blocked with document_mode_required.",
      "Paid Document Mode must require a future server-side entitlement/payment boundary.",
      "UI-only paid/document mode flags must not be trusted.",
      "Client-provided paid/document/entitlement flags must not be trusted.",
      "Missing entitlement must deny by default.",
      "Paid Document Mode runtime was not implemented in this phase.",
      "Payment runtime, checkout runtime, and entitlement runtime were not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No runtime authorization was granted.",
      "No pilot or production authorization was granted.",
      "No final go-live authorization was granted.",
      "Paid Document Mode remains subject to future PII redaction, Evidence Gates, and legal safety blocks.",
      "TD-005 is now contracted but still requires implementation plan and runtime implementation.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5Q Paid Document Mode Boundary Implementation Plan.",
      "readyFor8x5QPaidDocumentModeBoundaryImplementationPlan is planning readiness only, not runtime authorization.",
    ],
  };
}
