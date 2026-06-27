/**
 * Phase 8.5R — Controlled Real Document Paid Document Mode Boundary
 * Runtime Contract.
 *
 * RUNTIME-CONTRACT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5Q.
 *
 * This file defines a pure governance runtime contract for the future
 * server-side Paid Document Mode boundary. It does NOT implement payment,
 * entitlement, checkout, route boundary, document processing, OCR, prompt
 * build, model calls, or any runtime behaviour.
 *
 * This file does NOT:
 *   - Call OpenAI, fetch, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import live route, payment, Stripe, checkout, or entitlement modules.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Implement payment, entitlement, document processing, or Paid Document Mode runtime.
 *   - Build prompts or call models.
 *   - Authorize live real-document processing, OCR, or upload.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeBoundaryImplementationPlan } from "./run-controlled-real-document-paid-document-mode-boundary-implementation-plan";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeContractInput {
  // 8.5Q prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeServerBoundaryContractReadyForImplementationPlan: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanOnly: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanDefined: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;

  // 8.5Q implementation plan target flags (all true)
  readonly paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary: boolean;
  readonly paidBoundaryImplementationPlanDoesNotModifyRoutesNow: boolean;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing: boolean;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall: boolean;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage: boolean;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence: boolean;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: boolean;
  readonly paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved: boolean;
  readonly paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved: boolean;
  readonly paidBoundaryImplementationPlanRequiresDenyByDefault: boolean;

  // 8.5Q future entitlement requirement flags (all true)
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement: boolean;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession: boolean;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature: boolean;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess: boolean;
  readonly paidBoundaryImplementationPlanForbidsUiOnlyEntitlement: boolean;
  readonly paidBoundaryImplementationPlanForbidsClientPaidFlagTrust: boolean;
  readonly paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust: boolean;
  readonly paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust: boolean;
  readonly paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked: boolean;
  readonly paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: boolean;

  // 8.5Q future lane requirement flags (all true)
  readonly paidBoundaryImplementationPlanDefinesFreeQaLane: boolean;
  readonly paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane: boolean;
  readonly paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane: boolean;
  readonly paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane: boolean;
  readonly paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: boolean;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: boolean;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: boolean;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: boolean;
  readonly paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext: boolean;
  readonly paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase: boolean;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags from 8.5Q
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundaryImplementationPlanned: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeContract: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeImplementation: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // Actual performed flags from 8.5Q (all false — 19 fields)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPaymentRuntimeImplemented: boolean;
  readonly actualCheckoutImplemented: boolean;
  readonly actualEntitlementRuntimeImplemented: boolean;
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
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;

  // 8.5Q paidBoundaryImplementationPlanConfirms* (all true — 21 fields)
  readonly paidBoundaryImplementationPlanConfirmsNoOpenAiCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoFetchCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoSdkUsage: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoRouteImport: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoRouteMutation: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoStripeCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoCheckoutCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoStorageMutation: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoAuditPersistence: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundaryImplementationPlanConfirmsNoLegalCertainty: boolean;

  // Pipeline executed flags (all false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly entitlementPipelineActuallyExecuted: boolean;
  readonly checkoutPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags (all false)
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

  // 8.5Q forward readiness gate
  readonly readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: boolean;

  // 8.5R runtime contract insertion requirements (all true)
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation: boolean;
  readonly paidBoundaryRuntimeContractRequiresDenyByDefault: boolean;

  // 8.5R server entitlement contract requirements (all true)
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement: boolean;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession: boolean;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature: boolean;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess: boolean;
  readonly paidBoundaryRuntimeContractForbidsUiOnlyEntitlement: boolean;
  readonly paidBoundaryRuntimeContractForbidsClientPaidFlagTrust: boolean;
  readonly paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust: boolean;
  readonly paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust: boolean;
  readonly paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing: boolean;

  // 8.5R Free Q&A and route containment preservation (all true)
  readonly paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: boolean;
  readonly paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked: boolean;
  readonly paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved: boolean;
  readonly paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed: boolean;
  readonly paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa: boolean;
  readonly paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa: boolean;
  readonly paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa: boolean;
  readonly paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa: boolean;
  readonly paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa: boolean;
  readonly paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved: boolean;

  // 8.5R future lane contract requirements (all true)
  readonly paidBoundaryRuntimeContractDefinesFreeQaLane: boolean;
  readonly paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane: boolean;
  readonly paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane: boolean;
  readonly paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired: boolean;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction: boolean;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates: boolean;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: boolean;
  readonly paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext: boolean;
  readonly paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase: boolean;

  // 8.5R runtime denial response requirements (all true)
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance: boolean;

  // 8.5R new actual* assertions
  readonly actualPromptBuildPerformed: boolean;
  readonly actualModelCallPerformed: boolean;

  // 8.5R TD-005 result flags
  readonly td005PaidDocumentModeBoundaryRuntimeContracted: boolean;

  // 8.5R no-prohibited-side-effect confirmations
  readonly paidBoundaryRuntimeContractConfirmsNoOpenAiCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoFetchCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoSdkUsage: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoRouteImport: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoRouteMutation: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoStripeCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoCheckoutCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoStorageMutation: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoAuditPersistence: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoPromptBuild: boolean;
  readonly paidBoundaryRuntimeContractConfirmsNoModelCall: boolean;

  // 8.5R forward readiness
  readonly readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeContractResult {
  readonly checkId: "8.5R";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract: true;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeContractOnly: true;
  readonly paidDocumentModeBoundaryRuntimeContractDefined: true;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Runtime contract insertion requirements
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization: true;
  readonly paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation: true;
  readonly paidBoundaryRuntimeContractRequiresDenyByDefault: true;

  // Server entitlement contract requirements
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement: true;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession: true;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature: true;
  readonly paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess: true;
  readonly paidBoundaryRuntimeContractForbidsUiOnlyEntitlement: true;
  readonly paidBoundaryRuntimeContractForbidsClientPaidFlagTrust: true;
  readonly paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust: true;
  readonly paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust: true;
  readonly paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing: true;

  // Free Q&A and route containment preservation
  readonly paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: true;
  readonly paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked: true;
  readonly paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved: true;
  readonly paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed: true;
  readonly paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa: true;
  readonly paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa: true;
  readonly paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa: true;
  readonly paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa: true;
  readonly paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa: true;
  readonly paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved: true;

  // Future lane contract requirements
  readonly paidBoundaryRuntimeContractDefinesFreeQaLane: true;
  readonly paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane: true;
  readonly paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane: true;
  readonly paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired: true;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction: true;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates: true;
  readonly paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true;
  readonly paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext: true;
  readonly paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase: true;

  // Runtime denial response requirements
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance: true;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundaryRuntimeContracted: true;
  readonly td005PaidDocumentModeStillRequiresRuntimeImplementation: true;
  readonly td004PreModelPiiRedactionMissing: true;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: true;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: true;
  readonly td008InMemoryRateLimiterServerlessUnsafe: true;
  readonly td010GetUserStateDocumentTypeTodoOpen: true;
  readonly td009TmpDebugRunnerDebtClosed: true;
  readonly tmpFilesPresentInWorkingTree: false;

  // Actual performed flags (all false — 21 fields)
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPaymentRuntimeImplemented: false;
  readonly actualCheckoutImplemented: false;
  readonly actualEntitlementRuntimeImplemented: false;
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
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;
  readonly actualClaimAuthorizationPerformed: false;
  readonly actualDeadlineCalculationPerformed: false;
  readonly actualPromptBuildPerformed: false;
  readonly actualModelCallPerformed: false;

  // No-prohibited-side-effect confirmations (23)
  readonly paidBoundaryRuntimeContractConfirmsNoOpenAiCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoFetchCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoProcessEnvRead: true;
  readonly paidBoundaryRuntimeContractConfirmsNoSdkUsage: true;
  readonly paidBoundaryRuntimeContractConfirmsNo8x3AcRerun: true;
  readonly paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoRouteImport: true;
  readonly paidBoundaryRuntimeContractConfirmsNoRouteMutation: true;
  readonly paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoStripeCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoCheckoutCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundaryRuntimeContractConfirmsNoStorageMutation: true;
  readonly paidBoundaryRuntimeContractConfirmsNoDatabaseWrite: true;
  readonly paidBoundaryRuntimeContractConfirmsNoAuditPersistence: true;
  readonly paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundaryRuntimeContractConfirmsNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation: true;
  readonly paidBoundaryRuntimeContractConfirmsNoLegalCertainty: true;
  readonly paidBoundaryRuntimeContractConfirmsNoPromptBuild: true;
  readonly paidBoundaryRuntimeContractConfirmsNoModelCall: true;

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
  readonly readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: true;
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

function validateBoundaryRuntimeContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5Q prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5Q") reasons.push("prereq_check_id_must_be_8x5Q");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeServerBoundaryContractReadyForImplementationPlan"] !== true)
    reasons.push("server_boundary_contract_ready_for_implementation_plan_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted"] !== true)
    reasons.push("implementation_plan_not_accepted");
  if (o["paidDocumentModeBoundaryImplementationPlanOnly"] !== true)
    reasons.push("implementation_plan_only_false");
  if (o["paidDocumentModeBoundaryImplementationPlanDefined"] !== true)
    reasons.push("implementation_plan_defined_false");
  if (o["paidDocumentModeBoundaryRuntimeStillNotImplemented"] !== true)
    reasons.push("boundary_runtime_still_not_implemented_false");
  if (o["paidDocumentModePaymentRuntimeStillNotImplemented"] !== true)
    reasons.push("payment_runtime_still_not_implemented_false");
  if (o["paidDocumentModeCheckoutRuntimeStillNotImplemented"] !== true)
    reasons.push("checkout_runtime_still_not_implemented_false");
  if (o["paidDocumentModeEntitlementRuntimeStillNotImplemented"] !== true)
    reasons.push("entitlement_runtime_still_not_implemented_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorized"] !== true)
    reasons.push("document_processing_still_not_authorized_false");
  if (o["paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized"] !== true)
    reasons.push("user_visible_document_explanation_still_not_authorized_false");

  // Implementation plan target flags (all true)
  if (o["paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary"] !== true)
    reasons.push("plan_targets_future_server_route_boundary_false");
  if (o["paidBoundaryImplementationPlanDoesNotModifyRoutesNow"] !== true)
    reasons.push("plan_does_not_modify_routes_now_false");
  if (o["paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing"] !== true)
    reasons.push("plan_requires_boundary_before_document_processing_false");
  if (o["paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall"] !== true)
    reasons.push("plan_requires_boundary_before_model_call_false");
  if (o["paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage"] !== true)
    reasons.push("plan_requires_boundary_before_storage_false");
  if (o["paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence"] !== true)
    reasons.push("plan_requires_boundary_before_persistence_false");
  if (o["paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput"] !== true)
    reasons.push("plan_requires_boundary_before_user_visible_output_false");
  if (o["paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved"] !== true)
    reasons.push("plan_requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("plan_requires_photo_ocr_quarantine_preserved_false");
  if (o["paidBoundaryImplementationPlanRequiresDenyByDefault"] !== true)
    reasons.push("plan_requires_deny_by_default_false");

  // Future entitlement requirement flags (all true)
  if (o["paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement"] !== true)
    reasons.push("plan_requires_server_verified_entitlement_false");
  if (o["paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("plan_requires_server_verified_paid_session_false");
  if (o["paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("plan_requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("plan_requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryImplementationPlanForbidsUiOnlyEntitlement"] !== true)
    reasons.push("plan_forbids_ui_only_entitlement_false");
  if (o["paidBoundaryImplementationPlanForbidsClientPaidFlagTrust"] !== true)
    reasons.push("plan_forbids_client_paid_flag_trust_false");
  if (o["paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust"] !== true)
    reasons.push("plan_forbids_client_document_mode_flag_trust_false");
  if (o["paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust"] !== true)
    reasons.push("plan_forbids_client_entitlement_flag_trust_false");
  if (o["paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked"] !== true)
    reasons.push("plan_requires_missing_entitlement_blocked_false");
  if (o["paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked"] !== true)
    reasons.push("plan_requires_unauthorized_document_attempt_blocked_false");

  // Future lane requirement flags (all true)
  if (o["paidBoundaryImplementationPlanDefinesFreeQaLane"] !== true)
    reasons.push("plan_defines_free_qa_lane_false");
  if (o["paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("plan_defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane"] !== true)
    reasons.push("plan_defines_future_paid_document_lane_false");
  if (o["paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("plan_defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired"] !== true)
    reasons.push("plan_requires_unauthorized_lane_document_mode_required_false");
  if (o["paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext"] !== true)
    reasons.push("plan_requires_separate_runtime_contract_next_false");
  if (o["paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase"] !== true)
    reasons.push("plan_requires_no_runtime_activation_this_phase_false");

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

  // TD flags from 8.5Q
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundaryImplementationPlanned"] !== true)
    reasons.push("td005_boundary_implementation_planned_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeContract"] !== true)
    reasons.push("td005_still_requires_runtime_contract_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_photo_ocr_route_still_requires_future_authorized_runtime_design_false");
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
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // Actual performed flags from 8.5Q (all false)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false)
    reasons.push("actual_payment_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false)
    reasons.push("actual_checkout_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false)
    reasons.push("actual_entitlement_runtime_implemented_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("actual_real_document_input_performed_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("actual_real_document_processing_performed_must_be_false");
  if (o["actualOcrPerformed"] !== false) reasons.push("actual_ocr_performed_must_be_false");
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
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed_must_be_false");

  // paidBoundaryImplementationPlanConfirms* (all true)
  if (o["paidBoundaryImplementationPlanConfirmsNoOpenAiCall"] !== true)
    reasons.push("plan_confirms_no_openai_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoFetchCall"] !== true)
    reasons.push("plan_confirms_no_fetch_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoProcessEnvRead"] !== true)
    reasons.push("plan_confirms_no_process_env_read_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoSdkUsage"] !== true)
    reasons.push("plan_confirms_no_sdk_usage_false");
  if (o["paidBoundaryImplementationPlanConfirmsNo8x3AcRerun"] !== true)
    reasons.push("plan_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_smart_talk_runtime_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoRouteImport"] !== true)
    reasons.push("plan_confirms_no_route_import_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoRouteMutation"] !== true)
    reasons.push("plan_confirms_no_route_mutation_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_payment_runtime_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoStripeCall"] !== true)
    reasons.push("plan_confirms_no_stripe_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoCheckoutCall"] !== true)
    reasons.push("plan_confirms_no_checkout_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoStorageMutation"] !== true)
    reasons.push("plan_confirms_no_storage_mutation_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoDatabaseWrite"] !== true)
    reasons.push("plan_confirms_no_database_write_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoAuditPersistence"] !== true)
    reasons.push("plan_confirms_no_audit_persistence_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("plan_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("plan_confirms_no_evidence_evaluation_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoClaimAuthorization"] !== true)
    reasons.push("plan_confirms_no_claim_authorization_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("plan_confirms_no_deadline_calculation_false");
  if (o["paidBoundaryImplementationPlanConfirmsNoLegalCertainty"] !== true)
    reasons.push("plan_confirms_no_legal_certainty_false");

  // Pipeline executed flags (all false)
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

  // Runtime authorization flags (all false)
  if (o["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now_must_be_false");
  if (o["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now_must_be_false");
  if (o["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now_must_be_false");
  if (o["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now_must_be_false");
  if (o["photoInputAuthorizedNow"] !== false) reasons.push("photo_input_authorized_now_must_be_false");
  if (o["fileInputAuthorizedNow"] !== false) reasons.push("file_input_authorized_now_must_be_false");
  if (o["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now_must_be_false");
  if (o["persistenceAuthorizedNow"] !== false) reasons.push("persistence_authorized_now_must_be_false");
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
  if (o["legalCertaintyAuthorized"] !== false) reasons.push("legal_certainty_authorized_must_be_false");
  if (o["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized_must_be_false");
  if (o["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_required_for_exact_deadline_false");

  // 8.5Q forward readiness gate
  if (o["readyFor8x5RPaidDocumentModeBoundaryRuntimeContract"] !== true)
    reasons.push("ready_for_8x5r_runtime_contract_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabled"] !== false) reasons.push("public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("never_user_visible_must_be_true");

  // 8.5R runtime contract insertion requirements (all true)
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_document_processing_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_model_call_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_prompt_build_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_storage_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_persistence_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_user_visible_output_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_evidence_gate_runtime_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_claim_authorization_false");
  if (o["paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation"] !== true)
    reasons.push("runtime_contract_requires_boundary_before_deadline_calculation_false");
  if (o["paidBoundaryRuntimeContractRequiresDenyByDefault"] !== true)
    reasons.push("runtime_contract_requires_deny_by_default_false");

  // 8.5R server entitlement contract requirements (all true)
  if (o["paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement"] !== true)
    reasons.push("runtime_contract_requires_server_verified_entitlement_false");
  if (o["paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("runtime_contract_requires_server_verified_paid_session_false");
  if (o["paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("runtime_contract_requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("runtime_contract_requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryRuntimeContractForbidsUiOnlyEntitlement"] !== true)
    reasons.push("runtime_contract_forbids_ui_only_entitlement_false");
  if (o["paidBoundaryRuntimeContractForbidsClientPaidFlagTrust"] !== true)
    reasons.push("runtime_contract_forbids_client_paid_flag_trust_false");
  if (o["paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust"] !== true)
    reasons.push("runtime_contract_forbids_client_document_mode_flag_trust_false");
  if (o["paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust"] !== true)
    reasons.push("runtime_contract_forbids_client_entitlement_flag_trust_false");
  if (o["paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked"] !== true)
    reasons.push("runtime_contract_requires_missing_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked"] !== true)
    reasons.push("runtime_contract_requires_malformed_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked"] !== true)
    reasons.push("runtime_contract_requires_expired_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked"] !== true)
    reasons.push("runtime_contract_requires_unverifiable_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_document_attempt_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing"] !== true)
    reasons.push("runtime_contract_requires_no_fallback_to_free_qa_document_processing_false");

  // 8.5R Free Q&A and route containment preservation (all true)
  if (o["paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved"] !== true)
    reasons.push("runtime_contract_requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked"] !== true)
    reasons.push("runtime_contract_requires_document_like_text_in_free_qa_still_blocked_false");
  if (o["paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved"] !== true)
    reasons.push("runtime_contract_requires_document_mode_required_response_preserved_false");
  if (o["paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed"] !== true)
    reasons.push("runtime_contract_requires_general_questions_still_allowed_false");
  if (o["paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("runtime_contract_forbids_full_document_explanation_in_free_qa_false");
  if (o["paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa"] !== true)
    reasons.push("runtime_contract_forbids_document_translation_in_free_qa_false");
  if (o["paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa"] !== true)
    reasons.push("runtime_contract_forbids_deadline_calculation_in_free_qa_false");
  if (o["paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa"] !== true)
    reasons.push("runtime_contract_forbids_legal_certainty_in_free_qa_false");
  if (o["paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa"] !== true)
    reasons.push("runtime_contract_forbids_claim_authorization_in_free_qa_false");
  if (o["paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("runtime_contract_requires_photo_ocr_quarantine_preserved_false");

  // 8.5R future lane contract requirements (all true)
  if (o["paidBoundaryRuntimeContractDefinesFreeQaLane"] !== true)
    reasons.push("runtime_contract_defines_free_qa_lane_false");
  if (o["paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("runtime_contract_defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane"] !== true)
    reasons.push("runtime_contract_defines_future_paid_document_lane_false");
  if (o["paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("runtime_contract_defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_lane_document_mode_required_false");
  if (o["paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("runtime_contract_requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("runtime_contract_requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("runtime_contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext"] !== true)
    reasons.push("runtime_contract_requires_separate_runtime_implementation_next_false");
  if (o["paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase"] !== true)
    reasons.push("runtime_contract_requires_no_runtime_activation_this_phase_false");

  // 8.5R runtime denial response requirements (all true)
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_non_success_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_ok_false_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_code_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_raw_document_echo_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_translation_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_summary_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_explanation_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_legal_advice_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_deadline_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance"] !== true)
    reasons.push("runtime_contract_requires_unauthorized_response_no_internal_governance_false");

  // 8.5R new actual* assertions (all false)
  if (o["actualPromptBuildPerformed"] !== false)
    reasons.push("actual_prompt_build_performed_must_be_false");
  if (o["actualModelCallPerformed"] !== false)
    reasons.push("actual_model_call_performed_must_be_false");

  // 8.5R TD-005 result flag
  if (o["td005PaidDocumentModeBoundaryRuntimeContracted"] !== true)
    reasons.push("td005_boundary_runtime_contracted_false");

  // 8.5R no-prohibited-side-effect confirmations (all true)
  if (o["paidBoundaryRuntimeContractConfirmsNoOpenAiCall"] !== true)
    reasons.push("runtime_contract_confirms_no_openai_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoFetchCall"] !== true)
    reasons.push("runtime_contract_confirms_no_fetch_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoProcessEnvRead"] !== true)
    reasons.push("runtime_contract_confirms_no_process_env_read_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoSdkUsage"] !== true)
    reasons.push("runtime_contract_confirms_no_sdk_usage_false");
  if (o["paidBoundaryRuntimeContractConfirmsNo8x3AcRerun"] !== true)
    reasons.push("runtime_contract_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("runtime_contract_confirms_no_smart_talk_runtime_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoRouteImport"] !== true)
    reasons.push("runtime_contract_confirms_no_route_import_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoRouteMutation"] !== true)
    reasons.push("runtime_contract_confirms_no_route_mutation_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("runtime_contract_confirms_no_payment_runtime_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoStripeCall"] !== true)
    reasons.push("runtime_contract_confirms_no_stripe_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoCheckoutCall"] !== true)
    reasons.push("runtime_contract_confirms_no_checkout_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("runtime_contract_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("runtime_contract_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoStorageMutation"] !== true)
    reasons.push("runtime_contract_confirms_no_storage_mutation_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoDatabaseWrite"] !== true)
    reasons.push("runtime_contract_confirms_no_database_write_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoAuditPersistence"] !== true)
    reasons.push("runtime_contract_confirms_no_audit_persistence_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("runtime_contract_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("runtime_contract_confirms_no_evidence_evaluation_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoClaimAuthorization"] !== true)
    reasons.push("runtime_contract_confirms_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("runtime_contract_confirms_no_deadline_calculation_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoLegalCertainty"] !== true)
    reasons.push("runtime_contract_confirms_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoPromptBuild"] !== true)
    reasons.push("runtime_contract_confirms_no_prompt_build_false");
  if (o["paidBoundaryRuntimeContractConfirmsNoModelCall"] !== true)
    reasons.push("runtime_contract_confirms_no_model_call_false");

  // 8.5R forward readiness
  if (o["readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan"] !== true)
    reasons.push("ready_for_8x5s_runtime_implementation_plan_false");
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
  if (o["publicRuntimeEnabled"] !== false) reasons.push("public_runtime_enabled_must_be_false");
  if (o["persistenceUsed"] !== false) reasons.push("persistence_used_must_be_false");
  if (o["neverUserVisible"] !== true) reasons.push("never_user_visible_must_be_true");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.5R input ──────────────────────────────────────────────────────

function buildCanonical8x5RInput(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeContractInput {
  const planResult = runControlledRealDocumentPaidDocumentModeBoundaryImplementationPlan();
  return {
    // 8.5Q prerequisite gate — core
    prereqCheckId: planResult.checkId,
    prereqAllPassed: planResult.allPassed,
    paidDocumentModeServerBoundaryContractReadyForImplementationPlan:
      planResult.paidDocumentModeServerBoundaryContractReadyForImplementationPlan,
    controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted:
      planResult.controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted,
    paidDocumentModeBoundaryImplementationPlanOnly:
      planResult.paidDocumentModeBoundaryImplementationPlanOnly,
    paidDocumentModeBoundaryImplementationPlanDefined:
      planResult.paidDocumentModeBoundaryImplementationPlanDefined,
    paidDocumentModeBoundaryRuntimeStillNotImplemented:
      planResult.paidDocumentModeBoundaryRuntimeStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented:
      planResult.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeCheckoutRuntimeStillNotImplemented:
      planResult.paidDocumentModeCheckoutRuntimeStillNotImplemented,
    paidDocumentModeEntitlementRuntimeStillNotImplemented:
      planResult.paidDocumentModeEntitlementRuntimeStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      planResult.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      planResult.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,

    // Implementation plan target flags
    paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary:
      planResult.paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary,
    paidBoundaryImplementationPlanDoesNotModifyRoutesNow:
      planResult.paidBoundaryImplementationPlanDoesNotModifyRoutesNow,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing:
      planResult.paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall:
      planResult.paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage:
      planResult.paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage,
    paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence:
      planResult.paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput:
      planResult.paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput,
    paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved:
      planResult.paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved,
    paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved:
      planResult.paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved,
    paidBoundaryImplementationPlanRequiresDenyByDefault:
      planResult.paidBoundaryImplementationPlanRequiresDenyByDefault,

    // Future entitlement requirement flags
    paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement:
      planResult.paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement,
    paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession:
      planResult.paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession,
    paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature:
      planResult.paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature,
    paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess:
      planResult.paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess,
    paidBoundaryImplementationPlanForbidsUiOnlyEntitlement:
      planResult.paidBoundaryImplementationPlanForbidsUiOnlyEntitlement,
    paidBoundaryImplementationPlanForbidsClientPaidFlagTrust:
      planResult.paidBoundaryImplementationPlanForbidsClientPaidFlagTrust,
    paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust:
      planResult.paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust,
    paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust:
      planResult.paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust,
    paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked:
      planResult.paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked,
    paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked:
      planResult.paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked,

    // Future lane requirement flags
    paidBoundaryImplementationPlanDefinesFreeQaLane:
      planResult.paidBoundaryImplementationPlanDefinesFreeQaLane,
    paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane:
      planResult.paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane,
    paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane:
      planResult.paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane,
    paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane:
      planResult.paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane,
    paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired:
      planResult.paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction:
      planResult.paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates:
      planResult.paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks:
      planResult.paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks,
    paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext:
      planResult.paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext,
    paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase:
      planResult.paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase,

    // Authorization grants
    runtimeAuthorizationGranted: planResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: planResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: planResult.productionAuthorizationGranted,
    finalAuthorizationGranted: planResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: planResult.goLiveAuthorizationGranted,

    // TD flags from 8.5Q
    td001DocumentBypassGuardContainmentClosed: planResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryImplementationPlanned:
      planResult.td005PaidDocumentModeBoundaryImplementationPlanned,
    td005PaidDocumentModeStillRequiresRuntimeContract:
      planResult.td005PaidDocumentModeStillRequiresRuntimeContract,
    td005PaidDocumentModeStillRequiresRuntimeImplementation:
      planResult.td005PaidDocumentModeStillRequiresRuntimeImplementation,
    td004PreModelPiiRedactionMissing: planResult.td004PreModelPiiRedactionMissing,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      planResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      planResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      planResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      planResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      planResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: planResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: planResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: planResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: planResult.tmpFilesPresentInWorkingTree,

    // Actual performed flags from 8.5Q (19)
    actualLiveRouteMutationPerformed: planResult.actualLiveRouteMutationPerformed,
    actualPaidDocumentModeImplemented: planResult.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: planResult.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: planResult.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: planResult.actualEntitlementRuntimeImplemented,
    actualRealDocumentInputPerformed: planResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: planResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: planResult.actualOcrPerformed,
    actualPhotoInputProcessed: planResult.actualPhotoInputProcessed,
    actualFileInputProcessed: planResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: planResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: planResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: planResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: planResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: planResult.actualPublicRuntimeEnabled,
    actualPiiRedactionImplemented: planResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: planResult.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: planResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: planResult.actualDeadlineCalculationPerformed,

    // paidBoundaryImplementationPlanConfirms* (21)
    paidBoundaryImplementationPlanConfirmsNoOpenAiCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoOpenAiCall,
    paidBoundaryImplementationPlanConfirmsNoFetchCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoFetchCall,
    paidBoundaryImplementationPlanConfirmsNoProcessEnvRead:
      planResult.paidBoundaryImplementationPlanConfirmsNoProcessEnvRead,
    paidBoundaryImplementationPlanConfirmsNoSdkUsage:
      planResult.paidBoundaryImplementationPlanConfirmsNoSdkUsage,
    paidBoundaryImplementationPlanConfirmsNo8x3AcRerun:
      planResult.paidBoundaryImplementationPlanConfirmsNo8x3AcRerun,
    paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall,
    paidBoundaryImplementationPlanConfirmsNoRouteImport:
      planResult.paidBoundaryImplementationPlanConfirmsNoRouteImport,
    paidBoundaryImplementationPlanConfirmsNoRouteMutation:
      planResult.paidBoundaryImplementationPlanConfirmsNoRouteMutation,
    paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall,
    paidBoundaryImplementationPlanConfirmsNoStripeCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoStripeCall,
    paidBoundaryImplementationPlanConfirmsNoCheckoutCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoCheckoutCall,
    paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall,
    paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall:
      planResult.paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall,
    paidBoundaryImplementationPlanConfirmsNoStorageMutation:
      planResult.paidBoundaryImplementationPlanConfirmsNoStorageMutation,
    paidBoundaryImplementationPlanConfirmsNoDatabaseWrite:
      planResult.paidBoundaryImplementationPlanConfirmsNoDatabaseWrite,
    paidBoundaryImplementationPlanConfirmsNoAuditPersistence:
      planResult.paidBoundaryImplementationPlanConfirmsNoAuditPersistence,
    paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation:
      planResult.paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation,
    paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation:
      planResult.paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation,
    paidBoundaryImplementationPlanConfirmsNoClaimAuthorization:
      planResult.paidBoundaryImplementationPlanConfirmsNoClaimAuthorization,
    paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation:
      planResult.paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation,
    paidBoundaryImplementationPlanConfirmsNoLegalCertainty:
      planResult.paidBoundaryImplementationPlanConfirmsNoLegalCertainty,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: planResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: planResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: planResult.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: planResult.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: planResult.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: planResult.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: planResult.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: planResult.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
    realDocumentInputAuthorizedNow: planResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: planResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: planResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: planResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: planResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: planResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: planResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: planResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: planResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow: planResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: planResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: planResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: planResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: planResult.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: planResult.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: planResult.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: planResult.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: planResult.checkoutRuntimeAuthorizedNow,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: planResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: planResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: planResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: planResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: planResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: planResult.deliveryDateRequiredForExactDeadline,

    // 8.5Q forward readiness gate
    readyFor8x5RPaidDocumentModeBoundaryRuntimeContract:
      planResult.readyFor8x5RPaidDocumentModeBoundaryRuntimeContract,

    // 8.5R runtime contract insertion requirements
    paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation: true,
    paidBoundaryRuntimeContractRequiresDenyByDefault: true,

    // 8.5R server entitlement contract requirements
    paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeContractForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeContractForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing: true,

    // 8.5R Free Q&A and route containment preservation
    paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked: true,
    paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved: true,
    paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed: true,
    paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa: true,
    paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa: true,
    paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved: true,

    // 8.5R future lane contract requirements
    paidBoundaryRuntimeContractDefinesFreeQaLane: true,
    paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext: true,
    paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase: true,

    // 8.5R runtime denial response requirements
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance: true,

    // 8.5R new actual* assertions
    actualPromptBuildPerformed: false,
    actualModelCallPerformed: false,

    // 8.5R TD-005 result flag
    td005PaidDocumentModeBoundaryRuntimeContracted: true,

    // 8.5R no-prohibited-side-effect confirmations
    paidBoundaryRuntimeContractConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeContractConfirmsNoFetchCall: true,
    paidBoundaryRuntimeContractConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeContractConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeContractConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoRouteImport: true,
    paidBoundaryRuntimeContractConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoStripeCall: true,
    paidBoundaryRuntimeContractConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeContractConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeContractConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeContractConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeContractConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeContractConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeContractConfirmsNoModelCall: true,

    // 8.5R forward readiness
    readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: true,
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
  const base = buildCanonical8x5RInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateBoundaryRuntimeContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5Q prerequisite gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5P" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("server_boundary_contract_ready_for_implementation_plan_false",
    { paidDocumentModeServerBoundaryContractReadyForImplementationPlan: false });
  expect_rejected("implementation_plan_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted: false });
  expect_rejected("implementation_plan_only_false",
    { paidDocumentModeBoundaryImplementationPlanOnly: false });
  expect_rejected("implementation_plan_defined_false",
    { paidDocumentModeBoundaryImplementationPlanDefined: false });
  expect_rejected("boundary_runtime_still_not_implemented_false",
    { paidDocumentModeBoundaryRuntimeStillNotImplemented: false });
  expect_rejected("payment_runtime_still_not_implemented_false",
    { paidDocumentModePaymentRuntimeStillNotImplemented: false });
  expect_rejected("checkout_runtime_still_not_implemented_false",
    { paidDocumentModeCheckoutRuntimeStillNotImplemented: false });
  expect_rejected("entitlement_runtime_still_not_implemented_false",
    { paidDocumentModeEntitlementRuntimeStillNotImplemented: false });
  expect_rejected("document_processing_still_not_authorized_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorized: false });
  expect_rejected("user_visible_document_explanation_still_not_authorized_false",
    { paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: false });

  // Implementation plan target flags
  expect_rejected("plan_targets_future_server_route_boundary_false",
    { paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary: false });
  expect_rejected("plan_does_not_modify_routes_now_false",
    { paidBoundaryImplementationPlanDoesNotModifyRoutesNow: false });
  expect_rejected("plan_requires_boundary_before_document_processing_false",
    { paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing: false });
  expect_rejected("plan_requires_boundary_before_model_call_false",
    { paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall: false });
  expect_rejected("plan_requires_boundary_before_storage_false",
    { paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage: false });
  expect_rejected("plan_requires_boundary_before_persistence_false",
    { paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence: false });
  expect_rejected("plan_requires_boundary_before_user_visible_output_false",
    { paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("plan_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("plan_requires_photo_ocr_quarantine_preserved_false",
    { paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved: false });
  expect_rejected("plan_requires_deny_by_default_false",
    { paidBoundaryImplementationPlanRequiresDenyByDefault: false });

  // Future entitlement requirement flags
  expect_rejected("plan_requires_server_verified_entitlement_false",
    { paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement: false });
  expect_rejected("plan_requires_server_verified_paid_session_false",
    { paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession: false });
  expect_rejected("plan_requires_server_verified_product_or_feature_false",
    { paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("plan_requires_server_verified_document_mode_access_false",
    { paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("plan_forbids_ui_only_entitlement_false",
    { paidBoundaryImplementationPlanForbidsUiOnlyEntitlement: false });
  expect_rejected("plan_forbids_client_paid_flag_trust_false",
    { paidBoundaryImplementationPlanForbidsClientPaidFlagTrust: false });
  expect_rejected("plan_forbids_client_document_mode_flag_trust_false",
    { paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust: false });
  expect_rejected("plan_forbids_client_entitlement_flag_trust_false",
    { paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust: false });
  expect_rejected("plan_requires_missing_entitlement_blocked_false",
    { paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked: false });
  expect_rejected("plan_requires_unauthorized_document_attempt_blocked_false",
    { paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: false });

  // Future lane requirement flags
  expect_rejected("plan_defines_free_qa_lane_false",
    { paidBoundaryImplementationPlanDefinesFreeQaLane: false });
  expect_rejected("plan_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("plan_defines_future_paid_document_lane_false",
    { paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane: false });
  expect_rejected("plan_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("plan_requires_unauthorized_lane_document_mode_required_false",
    { paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("plan_requires_separate_runtime_contract_next_false",
    { paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext: false });
  expect_rejected("plan_requires_no_runtime_activation_this_phase_false",
    { paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase: false });

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_containment_closed_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_implementation_planned_false",
    { td005PaidDocumentModeBoundaryImplementationPlanned: false });
  expect_rejected("td005_still_requires_runtime_contract_false",
    { td005PaidDocumentModeStillRequiresRuntimeContract: false });
  expect_rejected("td005_still_requires_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_false", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_false", { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("td003_contained_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td003_still_requires_future_authorized_runtime_design_false",
    { td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: false });
  expect_rejected("td006_false", { td006EvidenceGateTodoAndOrSemanticsUnresolved: false });
  expect_rejected("td007_false", { td007TrapClaimDispositionNamespaceHardeningUnresolved: false });
  expect_rejected("td008_false", { td008InMemoryRateLimiterServerlessUnsafe: false });
  expect_rejected("td010_false", { td010GetUserStateDocumentTypeTodoOpen: false });
  expect_rejected("td009_false", { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("tmp_files_present_true", { tmpFilesPresentInWorkingTree: true });

  // Actual performed flags from 8.5Q (must all be false)
  expect_rejected("actual_live_route_mutation_performed_true",
    { actualLiveRouteMutationPerformed: true });
  expect_rejected("actual_paid_document_mode_implemented_true",
    { actualPaidDocumentModeImplemented: true });
  expect_rejected("actual_payment_runtime_implemented_true",
    { actualPaymentRuntimeImplemented: true });
  expect_rejected("actual_checkout_implemented_true", { actualCheckoutImplemented: true });
  expect_rejected("actual_entitlement_runtime_implemented_true",
    { actualEntitlementRuntimeImplemented: true });
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
  expect_rejected("actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_claim_authorization_performed_true",
    { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_performed_true",
    { actualDeadlineCalculationPerformed: true });

  // paidBoundaryImplementationPlanConfirms* (all true — must reject if false)
  expect_rejected("plan_confirms_no_openai_call_false",
    { paidBoundaryImplementationPlanConfirmsNoOpenAiCall: false });
  expect_rejected("plan_confirms_no_fetch_call_false",
    { paidBoundaryImplementationPlanConfirmsNoFetchCall: false });
  expect_rejected("plan_confirms_no_process_env_read_false",
    { paidBoundaryImplementationPlanConfirmsNoProcessEnvRead: false });
  expect_rejected("plan_confirms_no_sdk_usage_false",
    { paidBoundaryImplementationPlanConfirmsNoSdkUsage: false });
  expect_rejected("plan_confirms_no_8x3ac_rerun_false",
    { paidBoundaryImplementationPlanConfirmsNo8x3AcRerun: false });
  expect_rejected("plan_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("plan_confirms_no_route_import_false",
    { paidBoundaryImplementationPlanConfirmsNoRouteImport: false });
  expect_rejected("plan_confirms_no_route_mutation_false",
    { paidBoundaryImplementationPlanConfirmsNoRouteMutation: false });
  expect_rejected("plan_confirms_no_payment_runtime_call_false",
    { paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("plan_confirms_no_stripe_call_false",
    { paidBoundaryImplementationPlanConfirmsNoStripeCall: false });
  expect_rejected("plan_confirms_no_checkout_call_false",
    { paidBoundaryImplementationPlanConfirmsNoCheckoutCall: false });
  expect_rejected("plan_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("plan_confirms_no_ocr_runtime_call_false",
    { paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall: false });
  expect_rejected("plan_confirms_no_storage_mutation_false",
    { paidBoundaryImplementationPlanConfirmsNoStorageMutation: false });
  expect_rejected("plan_confirms_no_database_write_false",
    { paidBoundaryImplementationPlanConfirmsNoDatabaseWrite: false });
  expect_rejected("plan_confirms_no_audit_persistence_false",
    { paidBoundaryImplementationPlanConfirmsNoAuditPersistence: false });
  expect_rejected("plan_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("plan_confirms_no_evidence_evaluation_false",
    { paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation: false });
  expect_rejected("plan_confirms_no_claim_authorization_false",
    { paidBoundaryImplementationPlanConfirmsNoClaimAuthorization: false });
  expect_rejected("plan_confirms_no_deadline_calculation_false",
    { paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation: false });
  expect_rejected("plan_confirms_no_legal_certainty_false",
    { paidBoundaryImplementationPlanConfirmsNoLegalCertainty: false });

  // Pipeline executed flags
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true", { runtimePipelineActuallyExecuted: true });
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
  expect_rejected("real_document_input_authorized_now_true", { realDocumentInputAuthorizedNow: true });
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

  // 8.5Q forward readiness gate
  expect_rejected("ready_for_8x5r_runtime_contract_false",
    { readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: false });
  expect_rejected("ready_for_separate_runtime_authorization_true_in_prereq",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_in_prereq", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_in_prereq", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_in_prereq", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_in_prereq", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_in_prereq", { neverUserVisible: false });

  // 8.5R runtime contract insertion requirements
  expect_rejected("runtime_contract_requires_boundary_before_document_processing_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing: false });
  expect_rejected("runtime_contract_requires_boundary_before_model_call_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall: false });
  expect_rejected("runtime_contract_requires_boundary_before_prompt_build_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("runtime_contract_requires_boundary_before_storage_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage: false });
  expect_rejected("runtime_contract_requires_boundary_before_persistence_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence: false });
  expect_rejected("runtime_contract_requires_boundary_before_user_visible_output_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("runtime_contract_requires_boundary_before_evidence_gate_runtime_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime: false });
  expect_rejected("runtime_contract_requires_boundary_before_claim_authorization_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization: false });
  expect_rejected("runtime_contract_requires_boundary_before_deadline_calculation_false",
    { paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation: false });
  expect_rejected("runtime_contract_requires_deny_by_default_false",
    { paidBoundaryRuntimeContractRequiresDenyByDefault: false });

  // 8.5R server entitlement contract requirements
  expect_rejected("runtime_contract_requires_server_verified_entitlement_false",
    { paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement: false });
  expect_rejected("runtime_contract_requires_server_verified_paid_session_false",
    { paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession: false });
  expect_rejected("runtime_contract_requires_server_verified_product_or_feature_false",
    { paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("runtime_contract_requires_server_verified_document_mode_access_false",
    { paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("runtime_contract_forbids_ui_only_entitlement_false",
    { paidBoundaryRuntimeContractForbidsUiOnlyEntitlement: false });
  expect_rejected("runtime_contract_forbids_client_paid_flag_trust_false",
    { paidBoundaryRuntimeContractForbidsClientPaidFlagTrust: false });
  expect_rejected("runtime_contract_forbids_client_document_mode_flag_trust_false",
    { paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust: false });
  expect_rejected("runtime_contract_forbids_client_entitlement_flag_trust_false",
    { paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust: false });
  expect_rejected("runtime_contract_requires_missing_entitlement_blocked_false",
    { paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked: false });
  expect_rejected("runtime_contract_requires_malformed_entitlement_blocked_false",
    { paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked: false });
  expect_rejected("runtime_contract_requires_expired_entitlement_blocked_false",
    { paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked: false });
  expect_rejected("runtime_contract_requires_unverifiable_entitlement_blocked_false",
    { paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked: false });
  expect_rejected("runtime_contract_requires_unauthorized_document_attempt_blocked_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked: false });
  expect_rejected("runtime_contract_requires_no_fallback_to_free_qa_document_processing_false",
    { paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing: false });

  // 8.5R Free Q&A and route containment preservation
  expect_rejected("runtime_contract_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("runtime_contract_requires_document_like_text_in_free_qa_still_blocked_false",
    { paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked: false });
  expect_rejected("runtime_contract_requires_document_mode_required_response_preserved_false",
    { paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved: false });
  expect_rejected("runtime_contract_requires_general_questions_still_allowed_false",
    { paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed: false });
  expect_rejected("runtime_contract_forbids_full_document_explanation_in_free_qa_false",
    { paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa: false });
  expect_rejected("runtime_contract_forbids_document_translation_in_free_qa_false",
    { paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa: false });
  expect_rejected("runtime_contract_forbids_deadline_calculation_in_free_qa_false",
    { paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa: false });
  expect_rejected("runtime_contract_forbids_legal_certainty_in_free_qa_false",
    { paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa: false });
  expect_rejected("runtime_contract_forbids_claim_authorization_in_free_qa_false",
    { paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa: false });
  expect_rejected("runtime_contract_requires_photo_ocr_quarantine_preserved_false",
    { paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved: false });

  // 8.5R future lane contract requirements
  expect_rejected("runtime_contract_defines_free_qa_lane_false",
    { paidBoundaryRuntimeContractDefinesFreeQaLane: false });
  expect_rejected("runtime_contract_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("runtime_contract_defines_future_paid_document_lane_false",
    { paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane: false });
  expect_rejected("runtime_contract_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("runtime_contract_requires_unauthorized_lane_document_mode_required_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired: false });
  expect_rejected("runtime_contract_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("runtime_contract_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("runtime_contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("runtime_contract_requires_separate_runtime_implementation_next_false",
    { paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext: false });
  expect_rejected("runtime_contract_requires_no_runtime_activation_this_phase_false",
    { paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase: false });

  // 8.5R runtime denial response requirements
  expect_rejected("runtime_contract_requires_unauthorized_response_non_success_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_ok_false_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_code_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_raw_document_echo_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_translation_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_summary_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_explanation_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_legal_advice_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_deadline_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_legal_certainty_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_claim_authorization_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("runtime_contract_requires_unauthorized_response_no_internal_governance_false",
    { paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance: false });

  // TD-005 result
  expect_rejected("td005_boundary_runtime_contracted_false",
    { td005PaidDocumentModeBoundaryRuntimeContracted: false });

  // 8.5R actual* assertions (new)
  expect_rejected("actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_performed_true", { actualModelCallPerformed: true });

  // 8.5R no-prohibited-side-effect confirmations
  expect_rejected("runtime_contract_confirms_no_openai_call_false",
    { paidBoundaryRuntimeContractConfirmsNoOpenAiCall: false });
  expect_rejected("runtime_contract_confirms_no_fetch_call_false",
    { paidBoundaryRuntimeContractConfirmsNoFetchCall: false });
  expect_rejected("runtime_contract_confirms_no_process_env_read_false",
    { paidBoundaryRuntimeContractConfirmsNoProcessEnvRead: false });
  expect_rejected("runtime_contract_confirms_no_sdk_usage_false",
    { paidBoundaryRuntimeContractConfirmsNoSdkUsage: false });
  expect_rejected("runtime_contract_confirms_no_8x3ac_rerun_false",
    { paidBoundaryRuntimeContractConfirmsNo8x3AcRerun: false });
  expect_rejected("runtime_contract_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("runtime_contract_confirms_no_route_import_false",
    { paidBoundaryRuntimeContractConfirmsNoRouteImport: false });
  expect_rejected("runtime_contract_confirms_no_route_mutation_false",
    { paidBoundaryRuntimeContractConfirmsNoRouteMutation: false });
  expect_rejected("runtime_contract_confirms_no_payment_runtime_call_false",
    { paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("runtime_contract_confirms_no_stripe_call_false",
    { paidBoundaryRuntimeContractConfirmsNoStripeCall: false });
  expect_rejected("runtime_contract_confirms_no_checkout_call_false",
    { paidBoundaryRuntimeContractConfirmsNoCheckoutCall: false });
  expect_rejected("runtime_contract_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("runtime_contract_confirms_no_ocr_runtime_call_false",
    { paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall: false });
  expect_rejected("runtime_contract_confirms_no_storage_mutation_false",
    { paidBoundaryRuntimeContractConfirmsNoStorageMutation: false });
  expect_rejected("runtime_contract_confirms_no_database_write_false",
    { paidBoundaryRuntimeContractConfirmsNoDatabaseWrite: false });
  expect_rejected("runtime_contract_confirms_no_audit_persistence_false",
    { paidBoundaryRuntimeContractConfirmsNoAuditPersistence: false });
  expect_rejected("runtime_contract_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("runtime_contract_confirms_no_evidence_evaluation_false",
    { paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation: false });
  expect_rejected("runtime_contract_confirms_no_claim_authorization_false",
    { paidBoundaryRuntimeContractConfirmsNoClaimAuthorization: false });
  expect_rejected("runtime_contract_confirms_no_deadline_calculation_false",
    { paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation: false });
  expect_rejected("runtime_contract_confirms_no_legal_certainty_false",
    { paidBoundaryRuntimeContractConfirmsNoLegalCertainty: false });
  expect_rejected("runtime_contract_confirms_no_prompt_build_false",
    { paidBoundaryRuntimeContractConfirmsNoPromptBuild: false });
  expect_rejected("runtime_contract_confirms_no_model_call_false",
    { paidBoundaryRuntimeContractConfirmsNoModelCall: false });

  // 8.5R forward readiness
  expect_rejected("ready_for_8x5s_runtime_implementation_plan_false",
    { readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: false });
  expect_rejected("ready_for_separate_runtime_authorization_true_in_result",
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

export function runControlledRealDocumentPaidDocumentModeBoundaryRuntimeContract(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeContractResult {
  const canonical = buildCanonical8x5RInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateBoundaryRuntimeContractInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5R",
    allPassed,
    paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract: true,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted: allPassed,
    paidDocumentModeBoundaryRuntimeContractOnly: true,
    paidDocumentModeBoundaryRuntimeContractDefined: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation: true,
    paidBoundaryRuntimeContractRequiresDenyByDefault: true,

    paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeContractForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeContractForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing: true,

    paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked: true,
    paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved: true,
    paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed: true,
    paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa: true,
    paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa: true,
    paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa: true,
    paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved: true,

    paidBoundaryRuntimeContractDefinesFreeQaLane: true,
    paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext: true,
    paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase: true,

    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance: true,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundaryRuntimeContracted: true,
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
    actualPaidDocumentModeImplemented: false,
    actualPaymentRuntimeImplemented: false,
    actualCheckoutImplemented: false,
    actualEntitlementRuntimeImplemented: false,
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
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualDeadlineCalculationPerformed: false,
    actualPromptBuildPerformed: false,
    actualModelCallPerformed: false,

    paidBoundaryRuntimeContractConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeContractConfirmsNoFetchCall: true,
    paidBoundaryRuntimeContractConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeContractConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeContractConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoRouteImport: true,
    paidBoundaryRuntimeContractConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoStripeCall: true,
    paidBoundaryRuntimeContractConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeContractConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeContractConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeContractConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeContractConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeContractConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeContractConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeContractConfirmsNoModelCall: true,

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

    readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5R is a controlled real-document Paid Document Mode Boundary Runtime Contract.",
      "8.5R depends on completed 8.5Q Paid Document Mode Boundary Implementation Plan.",
      "8.5R is runtime-contract-only.",
      "/api/smart-talk was not modified.",
      "/api/smart-talk-photo was not modified.",
      "Payment, checkout, and entitlement runtime were not implemented.",
      "Paid Document Mode runtime was not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No prompt build or model call was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No runtime/pilot/production/final/go-live authorization was granted.",
      "Future runtime must deny by default without server-verified entitlement.",
      "UI-only and client-provided paid/document/entitlement flags must not be trusted.",
      "8.5N Free Q&A bypass guard must remain preserved.",
      "8.5H photo OCR quarantine must remain preserved.",
      "Future entitled lane still requires PII redaction, Evidence Gates, and legal safety blocks.",
      "TD-005 is now runtime-contracted but still requires runtime implementation.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5S Paid Document Mode Boundary Runtime Implementation Plan.",
      "readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan is planning readiness only, not runtime authorization.",
    ],
  };
}
