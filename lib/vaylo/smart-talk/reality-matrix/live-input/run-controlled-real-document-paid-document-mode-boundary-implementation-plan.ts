/**
 * Phase 8.5Q — Controlled Real Document Paid Document Mode Boundary
 * Implementation Plan.
 *
 * IMPLEMENTATION-PLAN-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5P.
 *
 * This file defines a pure governance implementation plan for the future
 * server-side Paid Document Mode boundary. It does NOT implement payment,
 * entitlement, checkout, document processing, OCR, or any runtime behaviour.
 *
 * This file does NOT:
 *   - Call OpenAI, fetch, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import or modify live route files.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Implement payment, entitlement, document processing, or Paid Document Mode runtime.
 *   - Authorize live real-document processing, OCR, or upload.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeServerBoundaryContract } from "./run-controlled-real-document-paid-document-mode-server-boundary-contract";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryImplementationPlanInput {
  // 8.5P prerequisite gate
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted: boolean;
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

  // Authorization grants from 8.5P (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags from 8.5P
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: boolean;
  readonly td005PaidDocumentModeServerBoundaryContracted: boolean;
  readonly td005PaidDocumentModeStillRequiresImplementationPlan: boolean;
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

  // Actual performed flags from 8.5P (all false)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;
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
  readonly actualEvidenceEvaluationPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;
  readonly actualPhotoRouteQuarantinePerformed: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;

  // 8.5P paidBoundaryContractConfirms* (all true)
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

  // 8.5P forward readiness gate
  readonly readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: boolean;

  // 8.5Q core contract assertions
  readonly paidDocumentModeBoundaryImplementationPlanOnly: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanDefined: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;

  // 8.5Q implementation plan target flags
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

  // 8.5Q future entitlement requirements
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

  // 8.5Q future lane requirements
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

  // 8.5Q TD-005 result flags
  readonly td005PaidDocumentModeBoundaryImplementationPlanned: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeContract: boolean;

  // 8.5Q no-prohibited-side-effect confirmations
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

  // 8.5Q forward readiness
  readonly readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundaryImplementationPlanResult {
  readonly checkId: "8.5Q";
  readonly allPassed: boolean;
  readonly paidDocumentModeServerBoundaryContractReadyForImplementationPlan: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanOnly: true;
  readonly paidDocumentModeBoundaryImplementationPlanDefined: true;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Implementation plan target flags
  readonly paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary: true;
  readonly paidBoundaryImplementationPlanDoesNotModifyRoutesNow: true;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall: true;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage: true;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence: true;
  readonly paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true;
  readonly paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved: true;
  readonly paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved: true;
  readonly paidBoundaryImplementationPlanRequiresDenyByDefault: true;

  // Future entitlement requirements
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement: true;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession: true;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature: true;
  readonly paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess: true;
  readonly paidBoundaryImplementationPlanForbidsUiOnlyEntitlement: true;
  readonly paidBoundaryImplementationPlanForbidsClientPaidFlagTrust: true;
  readonly paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust: true;
  readonly paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust: true;
  readonly paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked: true;
  readonly paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true;

  // Future lane requirements
  readonly paidBoundaryImplementationPlanDefinesFreeQaLane: true;
  readonly paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true;
  readonly paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane: true;
  readonly paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true;
  readonly paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true;
  readonly paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true;
  readonly paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext: true;
  readonly paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase: true;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundaryImplementationPlanned: true;
  readonly td005PaidDocumentModeStillRequiresRuntimeContract: true;
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

  // Actual performed flags (all false)
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

  // No-prohibited-side-effect confirmations
  readonly paidBoundaryImplementationPlanConfirmsNoOpenAiCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoFetchCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoProcessEnvRead: true;
  readonly paidBoundaryImplementationPlanConfirmsNoSdkUsage: true;
  readonly paidBoundaryImplementationPlanConfirmsNo8x3AcRerun: true;
  readonly paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoRouteImport: true;
  readonly paidBoundaryImplementationPlanConfirmsNoRouteMutation: true;
  readonly paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoStripeCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoCheckoutCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundaryImplementationPlanConfirmsNoStorageMutation: true;
  readonly paidBoundaryImplementationPlanConfirmsNoDatabaseWrite: true;
  readonly paidBoundaryImplementationPlanConfirmsNoAuditPersistence: true;
  readonly paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundaryImplementationPlanConfirmsNoClaimAuthorization: true;
  readonly paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation: true;
  readonly paidBoundaryImplementationPlanConfirmsNoLegalCertainty: true;

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
  readonly readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: true;
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

function validateBoundaryImplementationPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5P prerequisite gate
  if (o["prereqCheckId"] !== "8.5P")
    reasons.push("prereq_check_id_must_be_8x5P");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted"] !== true)
    reasons.push("server_boundary_contract_not_accepted");
  if (o["paidDocumentModeServerBoundaryContractOnly"] !== true)
    reasons.push("server_boundary_contract_only_false");
  if (o["paidDocumentModeServerBoundaryContractDefined"] !== true)
    reasons.push("server_boundary_contract_defined_false");
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
    reasons.push("contract_requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked"] !== true)
    reasons.push("contract_requires_document_like_text_in_free_qa_still_blocked_false");
  if (o["paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved"] !== true)
    reasons.push("contract_requires_document_mode_required_response_preserved_false");
  if (o["paidBoundaryContractRequiresGeneralQuestionsStillAllowed"] !== true)
    reasons.push("contract_requires_general_questions_still_allowed_false");
  if (o["paidBoundaryContractForbidsFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("contract_forbids_full_document_explanation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsDocumentTranslationInFreeQa"] !== true)
    reasons.push("contract_forbids_document_translation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsDeadlineCalculationInFreeQa"] !== true)
    reasons.push("contract_forbids_deadline_calculation_in_free_qa_false");
  if (o["paidBoundaryContractForbidsLegalCertaintyInFreeQa"] !== true)
    reasons.push("contract_forbids_legal_certainty_in_free_qa_false");
  if (o["paidBoundaryContractForbidsClaimAuthorizationInFreeQa"] !== true)
    reasons.push("contract_forbids_claim_authorization_in_free_qa_false");

  // 8.5P server boundary flags
  if (o["paidBoundaryContractRequiresServerSideEntitlementCheck"] !== true)
    reasons.push("contract_requires_server_side_entitlement_check_false");
  if (o["paidBoundaryContractForbidsUiOnlyEntitlement"] !== true)
    reasons.push("contract_forbids_ui_only_entitlement_false");
  if (o["paidBoundaryContractForbidsTrustingClientPaidFlag"] !== true)
    reasons.push("contract_forbids_trusting_client_paid_flag_false");
  if (o["paidBoundaryContractForbidsTrustingClientDocumentModeFlag"] !== true)
    reasons.push("contract_forbids_trusting_client_document_mode_flag_false");
  if (o["paidBoundaryContractRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("contract_requires_server_verified_paid_session_false");
  if (o["paidBoundaryContractRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("contract_requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryContractRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("contract_requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement"] !== true)
    reasons.push("contract_requires_deny_by_default_for_missing_entitlement_false");
  if (o["paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented"] !== true)
    reasons.push("contract_requires_document_mode_disabled_until_boundary_implemented_false");
  if (o["paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary"] !== true)
    reasons.push("contract_requires_no_document_processing_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoModelCallBeforeBoundary"] !== true)
    reasons.push("contract_requires_no_model_call_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoStorageBeforeBoundary"] !== true)
    reasons.push("contract_requires_no_storage_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoPersistenceBeforeBoundary"] !== true)
    reasons.push("contract_requires_no_persistence_before_boundary_false");
  if (o["paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary"] !== true)
    reasons.push("contract_requires_no_user_visible_document_explanation_before_boundary_false");

  // 8.5P future paid mode boundary design flags
  if (o["paidBoundaryContractDefinesFreeQaLane"] !== true)
    reasons.push("contract_defines_free_qa_lane_false");
  if (o["paidBoundaryContractDefinesPaidDocumentLane"] !== true)
    reasons.push("contract_defines_paid_document_lane_false");
  if (o["paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("contract_defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("contract_defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired"] !== true)
    reasons.push("contract_requires_blocked_unauthorized_lane_to_return_document_mode_required_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("contract_requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("contract_requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase"] !== true)
    reasons.push("contract_requires_entitled_lane_not_activated_in_this_phase_false");
  if (o["paidBoundaryContractRequiresSeparateImplementationPlanNext"] !== true)
    reasons.push("contract_requires_separate_implementation_plan_next_false");

  // Authorization grants (all false)
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

  // TD flags from 8.5P
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeServerBoundaryContracted"] !== true)
    reasons.push("td005_server_boundary_contracted_false");
  if (o["td005PaidDocumentModeStillRequiresImplementationPlan"] !== true)
    reasons.push("td005_still_requires_implementation_plan_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // Actual performed flags from 8.5P (all false)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_must_be_false");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented_must_be_false");
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
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed_must_be_false");

  // 8.5P paidBoundaryContractConfirms* (all true)
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

  // 8.5P forward readiness gate
  if (o["readyFor8x5QPaidDocumentModeBoundaryImplementationPlan"] !== true)
    reasons.push("ready_for_8x5q_paid_document_mode_boundary_implementation_plan_false");

  // 8.5Q core contract assertions
  if (o["paidDocumentModeBoundaryImplementationPlanOnly"] !== true)
    reasons.push("paid_document_mode_boundary_implementation_plan_only_false");
  if (o["paidDocumentModeBoundaryImplementationPlanDefined"] !== true)
    reasons.push("paid_document_mode_boundary_implementation_plan_defined_false");
  if (o["paidDocumentModeBoundaryRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_boundary_runtime_still_not_implemented_false");
  if (o["paidDocumentModeCheckoutRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_checkout_runtime_still_not_implemented_false");
  if (o["paidDocumentModeEntitlementRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_entitlement_runtime_still_not_implemented_false");

  // 8.5Q implementation plan target flags
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

  // 8.5Q future entitlement requirements
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

  // 8.5Q future lane requirements
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

  // 8.5Q TD-005 result flags
  if (o["td005PaidDocumentModeBoundaryImplementationPlanned"] !== true)
    reasons.push("td005_boundary_implementation_planned_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeContract"] !== true)
    reasons.push("td005_still_requires_runtime_contract_false");

  // 8.5Q no-prohibited-side-effect confirmations
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

  // 8.5Q forward readiness
  if (o["readyFor8x5RPaidDocumentModeBoundaryRuntimeContract"] !== true)
    reasons.push("ready_for_8x5r_paid_document_mode_boundary_runtime_contract_false");
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

// ── Canonical 8.5Q input ──────────────────────────────────────────────────────

function buildCanonical8x5QInput(): ControlledRealDocumentPaidDocumentModeBoundaryImplementationPlanInput {
  const contractResult = runControlledRealDocumentPaidDocumentModeServerBoundaryContract();
  return {
    // 8.5P prerequisite gate
    prereqCheckId: contractResult.checkId,
    prereqAllPassed: contractResult.allPassed,
    controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted:
      contractResult.controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted,
    paidDocumentModeServerBoundaryContractOnly:
      contractResult.paidDocumentModeServerBoundaryContractOnly,
    paidDocumentModeServerBoundaryContractDefined:
      contractResult.paidDocumentModeServerBoundaryContractDefined,
    paidDocumentModeRuntimeStillNotImplemented:
      contractResult.paidDocumentModeRuntimeStillNotImplemented,
    paidDocumentModeBoundaryStillNotImplemented:
      contractResult.paidDocumentModeBoundaryStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented:
      contractResult.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      contractResult.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      contractResult.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,

    // 8.5P Free Q&A containment dependency flags
    paidBoundaryContractRequiresFreeQaBypassGuardPreserved:
      contractResult.paidBoundaryContractRequiresFreeQaBypassGuardPreserved,
    paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked:
      contractResult.paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked,
    paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved:
      contractResult.paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved,
    paidBoundaryContractRequiresGeneralQuestionsStillAllowed:
      contractResult.paidBoundaryContractRequiresGeneralQuestionsStillAllowed,
    paidBoundaryContractForbidsFullDocumentExplanationInFreeQa:
      contractResult.paidBoundaryContractForbidsFullDocumentExplanationInFreeQa,
    paidBoundaryContractForbidsDocumentTranslationInFreeQa:
      contractResult.paidBoundaryContractForbidsDocumentTranslationInFreeQa,
    paidBoundaryContractForbidsDeadlineCalculationInFreeQa:
      contractResult.paidBoundaryContractForbidsDeadlineCalculationInFreeQa,
    paidBoundaryContractForbidsLegalCertaintyInFreeQa:
      contractResult.paidBoundaryContractForbidsLegalCertaintyInFreeQa,
    paidBoundaryContractForbidsClaimAuthorizationInFreeQa:
      contractResult.paidBoundaryContractForbidsClaimAuthorizationInFreeQa,

    // 8.5P server boundary flags
    paidBoundaryContractRequiresServerSideEntitlementCheck:
      contractResult.paidBoundaryContractRequiresServerSideEntitlementCheck,
    paidBoundaryContractForbidsUiOnlyEntitlement:
      contractResult.paidBoundaryContractForbidsUiOnlyEntitlement,
    paidBoundaryContractForbidsTrustingClientPaidFlag:
      contractResult.paidBoundaryContractForbidsTrustingClientPaidFlag,
    paidBoundaryContractForbidsTrustingClientDocumentModeFlag:
      contractResult.paidBoundaryContractForbidsTrustingClientDocumentModeFlag,
    paidBoundaryContractRequiresServerVerifiedPaidSession:
      contractResult.paidBoundaryContractRequiresServerVerifiedPaidSession,
    paidBoundaryContractRequiresServerVerifiedProductOrFeature:
      contractResult.paidBoundaryContractRequiresServerVerifiedProductOrFeature,
    paidBoundaryContractRequiresServerVerifiedDocumentModeAccess:
      contractResult.paidBoundaryContractRequiresServerVerifiedDocumentModeAccess,
    paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement:
      contractResult.paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement,
    paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented:
      contractResult.paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented,
    paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary:
      contractResult.paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary,
    paidBoundaryContractRequiresNoModelCallBeforeBoundary:
      contractResult.paidBoundaryContractRequiresNoModelCallBeforeBoundary,
    paidBoundaryContractRequiresNoStorageBeforeBoundary:
      contractResult.paidBoundaryContractRequiresNoStorageBeforeBoundary,
    paidBoundaryContractRequiresNoPersistenceBeforeBoundary:
      contractResult.paidBoundaryContractRequiresNoPersistenceBeforeBoundary,
    paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary:
      contractResult.paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary,

    // 8.5P future paid mode boundary design flags
    paidBoundaryContractDefinesFreeQaLane:
      contractResult.paidBoundaryContractDefinesFreeQaLane,
    paidBoundaryContractDefinesPaidDocumentLane:
      contractResult.paidBoundaryContractDefinesPaidDocumentLane,
    paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane:
      contractResult.paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane,
    paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane:
      contractResult.paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane,
    paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired:
      contractResult.paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction:
      contractResult.paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates:
      contractResult.paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates,
    paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks:
      contractResult.paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks,
    paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase:
      contractResult.paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase,
    paidBoundaryContractRequiresSeparateImplementationPlanNext:
      contractResult.paidBoundaryContractRequiresSeparateImplementationPlanNext,

    // Authorization grants
    runtimeAuthorizationGranted: contractResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: contractResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: contractResult.productionAuthorizationGranted,
    finalAuthorizationGranted: contractResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: contractResult.goLiveAuthorizationGranted,

    // TD flags from 8.5P
    td001DocumentBypassGuardContainmentClosed: contractResult.td001DocumentBypassGuardContainmentClosed,
    td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary:
      contractResult.td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary,
    td005PaidDocumentModeServerBoundaryContracted:
      contractResult.td005PaidDocumentModeServerBoundaryContracted,
    td005PaidDocumentModeStillRequiresImplementationPlan:
      contractResult.td005PaidDocumentModeStillRequiresImplementationPlan,
    td005PaidDocumentModeStillRequiresRuntimeImplementation:
      contractResult.td005PaidDocumentModeStillRequiresRuntimeImplementation,
    td004PreModelPiiRedactionMissing: contractResult.td004PreModelPiiRedactionMissing,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      contractResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      contractResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      contractResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      contractResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      contractResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: contractResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: contractResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: contractResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: contractResult.tmpFilesPresentInWorkingTree,

    // Actual performed flags from 8.5P
    actualLiveRouteMutationPerformed: contractResult.actualLiveRouteMutationPerformed,
    actualDocumentBypassGuardImplemented: contractResult.actualDocumentBypassGuardImplemented,
    actualPaidDocumentModeImplemented: contractResult.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: contractResult.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: contractResult.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: contractResult.actualEntitlementRuntimeImplemented,
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
    actualPiiRedactionImplemented: contractResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: contractResult.actualEvidenceGateRuntimeWiringPerformed,

    // 8.5P paidBoundaryContractConfirms*
    paidBoundaryContractConfirmsNoOpenAiCall: contractResult.paidBoundaryContractConfirmsNoOpenAiCall,
    paidBoundaryContractConfirmsNoFetchCall: contractResult.paidBoundaryContractConfirmsNoFetchCall,
    paidBoundaryContractConfirmsNoProcessEnvRead:
      contractResult.paidBoundaryContractConfirmsNoProcessEnvRead,
    paidBoundaryContractConfirmsNoSdkUsage: contractResult.paidBoundaryContractConfirmsNoSdkUsage,
    paidBoundaryContractConfirmsNo8x3AcRerun: contractResult.paidBoundaryContractConfirmsNo8x3AcRerun,
    paidBoundaryContractConfirmsNoSmartTalkRuntimeCall:
      contractResult.paidBoundaryContractConfirmsNoSmartTalkRuntimeCall,
    paidBoundaryContractConfirmsNoRouteImport: contractResult.paidBoundaryContractConfirmsNoRouteImport,
    paidBoundaryContractConfirmsNoRouteMutation:
      contractResult.paidBoundaryContractConfirmsNoRouteMutation,
    paidBoundaryContractConfirmsNoPublicRouteMutation:
      contractResult.paidBoundaryContractConfirmsNoPublicRouteMutation,
    paidBoundaryContractConfirmsNoUiMutation: contractResult.paidBoundaryContractConfirmsNoUiMutation,
    paidBoundaryContractConfirmsNoSupabaseMutation:
      contractResult.paidBoundaryContractConfirmsNoSupabaseMutation,
    paidBoundaryContractConfirmsNoStorageMutation:
      contractResult.paidBoundaryContractConfirmsNoStorageMutation,
    paidBoundaryContractConfirmsNoDatabaseWrite:
      contractResult.paidBoundaryContractConfirmsNoDatabaseWrite,
    paidBoundaryContractConfirmsNoAuditPersistence:
      contractResult.paidBoundaryContractConfirmsNoAuditPersistence,
    paidBoundaryContractConfirmsNoPaymentRuntimeCall:
      contractResult.paidBoundaryContractConfirmsNoPaymentRuntimeCall,
    paidBoundaryContractConfirmsNoStripeCall: contractResult.paidBoundaryContractConfirmsNoStripeCall,
    paidBoundaryContractConfirmsNoCheckoutCall:
      contractResult.paidBoundaryContractConfirmsNoCheckoutCall,
    paidBoundaryContractConfirmsNoEntitlementRuntimeCall:
      contractResult.paidBoundaryContractConfirmsNoEntitlementRuntimeCall,
    paidBoundaryContractConfirmsNoOcrRuntimeCall:
      contractResult.paidBoundaryContractConfirmsNoOcrRuntimeCall,
    paidBoundaryContractConfirmsNoPhotoInputProcessing:
      contractResult.paidBoundaryContractConfirmsNoPhotoInputProcessing,
    paidBoundaryContractConfirmsNoFileInputProcessing:
      contractResult.paidBoundaryContractConfirmsNoFileInputProcessing,
    paidBoundaryContractConfirmsNoDocumentParsingRuntime:
      contractResult.paidBoundaryContractConfirmsNoDocumentParsingRuntime,
    paidBoundaryContractConfirmsNoRawDocumentStorage:
      contractResult.paidBoundaryContractConfirmsNoRawDocumentStorage,
    paidBoundaryContractConfirmsNoModelOutputStorage:
      contractResult.paidBoundaryContractConfirmsNoModelOutputStorage,
    paidBoundaryContractConfirmsNoPromptStorage:
      contractResult.paidBoundaryContractConfirmsNoPromptStorage,
    paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation:
      contractResult.paidBoundaryContractConfirmsNoUserVisibleDocumentExplanation,
    paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis:
      contractResult.paidBoundaryContractConfirmsNoCustomerFacingDocumentAnalysis,
    paidBoundaryContractConfirmsNoEvidenceEvaluation:
      contractResult.paidBoundaryContractConfirmsNoEvidenceEvaluation,
    paidBoundaryContractConfirmsNoClaimAuthorization:
      contractResult.paidBoundaryContractConfirmsNoClaimAuthorization,
    paidBoundaryContractConfirmsNoDeadlineCalculation:
      contractResult.paidBoundaryContractConfirmsNoDeadlineCalculation,
    paidBoundaryContractConfirmsNoLegalCertainty:
      contractResult.paidBoundaryContractConfirmsNoLegalCertainty,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: contractResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: contractResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: contractResult.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: contractResult.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: contractResult.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: contractResult.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: contractResult.ocrPipelineActuallyExecuted,
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
    paidDocumentModeRuntimeAuthorizedNow: contractResult.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: contractResult.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: contractResult.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: contractResult.checkoutRuntimeAuthorizedNow,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: contractResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: contractResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: contractResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: contractResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: contractResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: contractResult.deliveryDateRequiredForExactDeadline,

    // 8.5P forward readiness gate
    readyFor8x5QPaidDocumentModeBoundaryImplementationPlan:
      contractResult.readyFor8x5QPaidDocumentModeBoundaryImplementationPlan,

    // 8.5Q core contract assertions
    paidDocumentModeBoundaryImplementationPlanOnly: true,
    paidDocumentModeBoundaryImplementationPlanDefined: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,

    // 8.5Q implementation plan target flags
    paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary: true,
    paidBoundaryImplementationPlanDoesNotModifyRoutesNow: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryImplementationPlanRequiresDenyByDefault: true,

    // 8.5Q future entitlement requirements
    paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryImplementationPlanForbidsUiOnlyEntitlement: true,
    paidBoundaryImplementationPlanForbidsClientPaidFlagTrust: true,
    paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust: true,
    paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked: true,
    paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true,

    // 8.5Q future lane requirements
    paidBoundaryImplementationPlanDefinesFreeQaLane: true,
    paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane: true,
    paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext: true,
    paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase: true,

    // 8.5Q TD-005 result flags
    td005PaidDocumentModeBoundaryImplementationPlanned: true,
    td005PaidDocumentModeStillRequiresRuntimeContract: true,

    // 8.5Q no-prohibited-side-effect confirmations
    paidBoundaryImplementationPlanConfirmsNoOpenAiCall: true,
    paidBoundaryImplementationPlanConfirmsNoFetchCall: true,
    paidBoundaryImplementationPlanConfirmsNoProcessEnvRead: true,
    paidBoundaryImplementationPlanConfirmsNoSdkUsage: true,
    paidBoundaryImplementationPlanConfirmsNo8x3AcRerun: true,
    paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoRouteImport: true,
    paidBoundaryImplementationPlanConfirmsNoRouteMutation: true,
    paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoStripeCall: true,
    paidBoundaryImplementationPlanConfirmsNoCheckoutCall: true,
    paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoStorageMutation: true,
    paidBoundaryImplementationPlanConfirmsNoDatabaseWrite: true,
    paidBoundaryImplementationPlanConfirmsNoAuditPersistence: true,
    paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation: true,
    paidBoundaryImplementationPlanConfirmsNoClaimAuthorization: true,
    paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation: true,
    paidBoundaryImplementationPlanConfirmsNoLegalCertainty: true,

    // 8.5Q forward readiness
    readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: true,
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
  const base = buildCanonical8x5QInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateBoundaryImplementationPlanInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5P prerequisite gate
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5O" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("server_boundary_contract_not_accepted",
    { controlledRealDocumentPaidDocumentModeServerBoundaryContractAccepted: false });
  expect_rejected("server_boundary_contract_only_false",
    { paidDocumentModeServerBoundaryContractOnly: false });
  expect_rejected("server_boundary_contract_defined_false",
    { paidDocumentModeServerBoundaryContractDefined: false });
  expect_rejected("paid_document_mode_runtime_still_not_implemented_false",
    { paidDocumentModeRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_boundary_still_not_implemented_false",
    { paidDocumentModeBoundaryStillNotImplemented: false });
  expect_rejected("paid_document_mode_payment_runtime_still_not_implemented_false",
    { paidDocumentModePaymentRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_document_processing_still_not_authorized_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorized: false });
  expect_rejected("paid_document_mode_user_visible_still_not_authorized_false",
    { paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: false });

  // Free Q&A containment dependency flags
  expect_rejected("contract_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("contract_requires_document_like_text_still_blocked_false",
    { paidBoundaryContractRequiresDocumentLikeTextInFreeQaStillBlocked: false });
  expect_rejected("contract_requires_document_mode_required_response_preserved_false",
    { paidBoundaryContractRequiresDocumentModeRequiredResponsePreserved: false });
  expect_rejected("contract_requires_general_questions_still_allowed_false",
    { paidBoundaryContractRequiresGeneralQuestionsStillAllowed: false });
  expect_rejected("contract_forbids_full_document_explanation_in_free_qa_false",
    { paidBoundaryContractForbidsFullDocumentExplanationInFreeQa: false });
  expect_rejected("contract_forbids_document_translation_in_free_qa_false",
    { paidBoundaryContractForbidsDocumentTranslationInFreeQa: false });
  expect_rejected("contract_forbids_deadline_calculation_in_free_qa_false",
    { paidBoundaryContractForbidsDeadlineCalculationInFreeQa: false });
  expect_rejected("contract_forbids_legal_certainty_in_free_qa_false",
    { paidBoundaryContractForbidsLegalCertaintyInFreeQa: false });
  expect_rejected("contract_forbids_claim_authorization_in_free_qa_false",
    { paidBoundaryContractForbidsClaimAuthorizationInFreeQa: false });

  // Server boundary flags
  expect_rejected("contract_requires_server_side_entitlement_check_false",
    { paidBoundaryContractRequiresServerSideEntitlementCheck: false });
  expect_rejected("contract_forbids_ui_only_entitlement_false",
    { paidBoundaryContractForbidsUiOnlyEntitlement: false });
  expect_rejected("contract_forbids_trusting_client_paid_flag_false",
    { paidBoundaryContractForbidsTrustingClientPaidFlag: false });
  expect_rejected("contract_forbids_trusting_client_document_mode_flag_false",
    { paidBoundaryContractForbidsTrustingClientDocumentModeFlag: false });
  expect_rejected("contract_requires_server_verified_paid_session_false",
    { paidBoundaryContractRequiresServerVerifiedPaidSession: false });
  expect_rejected("contract_requires_server_verified_product_or_feature_false",
    { paidBoundaryContractRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("contract_requires_server_verified_document_mode_access_false",
    { paidBoundaryContractRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("contract_requires_deny_by_default_false",
    { paidBoundaryContractRequiresDenyByDefaultForMissingEntitlement: false });
  expect_rejected("contract_requires_document_mode_disabled_until_boundary_implemented_false",
    { paidBoundaryContractRequiresDocumentModeDisabledUntilBoundaryImplemented: false });
  expect_rejected("contract_requires_no_document_processing_before_boundary_false",
    { paidBoundaryContractRequiresNoDocumentProcessingBeforeBoundary: false });
  expect_rejected("contract_requires_no_model_call_before_boundary_false",
    { paidBoundaryContractRequiresNoModelCallBeforeBoundary: false });
  expect_rejected("contract_requires_no_storage_before_boundary_false",
    { paidBoundaryContractRequiresNoStorageBeforeBoundary: false });
  expect_rejected("contract_requires_no_persistence_before_boundary_false",
    { paidBoundaryContractRequiresNoPersistenceBeforeBoundary: false });
  expect_rejected("contract_requires_no_user_visible_document_explanation_before_boundary_false",
    { paidBoundaryContractRequiresNoUserVisibleDocumentExplanationBeforeBoundary: false });

  // Future paid mode boundary design flags
  expect_rejected("contract_defines_free_qa_lane_false",
    { paidBoundaryContractDefinesFreeQaLane: false });
  expect_rejected("contract_defines_paid_document_lane_false",
    { paidBoundaryContractDefinesPaidDocumentLane: false });
  expect_rejected("contract_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryContractDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("contract_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryContractDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("contract_requires_blocked_unauthorized_lane_to_return_document_mode_required_false",
    { paidBoundaryContractRequiresBlockedUnauthorizedLaneToReturnDocumentModeRequired: false });
  expect_rejected("contract_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("contract_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("contract_requires_entitled_lane_not_activated_in_this_phase_false",
    { paidBoundaryContractRequiresEntitledLaneNotActivatedInThisPhase: false });
  expect_rejected("contract_requires_separate_implementation_plan_next_false",
    { paidBoundaryContractRequiresSeparateImplementationPlanNext: false });

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_containment_closed_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_server_boundary_contracted_false",
    { td005PaidDocumentModeServerBoundaryContracted: false });
  expect_rejected("td005_still_requires_implementation_plan_false",
    { td005PaidDocumentModeStillRequiresImplementationPlan: false });
  expect_rejected("td005_still_requires_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresRuntimeImplementation: false });
  expect_rejected("td004_pre_model_pii_redaction_missing_false",
    { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_evidence_gates_not_wired_false",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("td003_photo_ocr_route_contained_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td009_tmp_debug_runner_debt_closed_false",
    { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("tmp_files_present_in_working_tree_true",
    { tmpFilesPresentInWorkingTree: true });

  // Actual performed flags (must all be false)
  expect_rejected("actual_live_route_mutation_performed_true",
    { actualLiveRouteMutationPerformed: true });
  expect_rejected("actual_document_bypass_guard_implemented_true",
    { actualDocumentBypassGuardImplemented: true });
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
  expect_rejected("actual_evidence_evaluation_performed_true",
    { actualEvidenceEvaluationPerformed: true });
  expect_rejected("actual_claim_authorization_performed_true",
    { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_performed_true",
    { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_photo_route_quarantine_performed_true",
    { actualPhotoRouteQuarantinePerformed: true });
  expect_rejected("actual_pii_redaction_implemented_true", { actualPiiRedactionImplemented: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });

  // paidBoundaryContractConfirms* (must all be true)
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

  // 8.5P forward readiness gate
  expect_rejected("ready_for_8x5q_implementation_plan_false",
    { readyFor8x5QPaidDocumentModeBoundaryImplementationPlan: false });
  expect_rejected("ready_for_separate_runtime_authorization_true_in_prereq",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_in_prereq",
    { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_in_prereq",
    { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_in_prereq", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_in_prereq", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_in_prereq", { neverUserVisible: false });

  // 8.5Q core contract assertions
  expect_rejected("paid_document_mode_boundary_implementation_plan_only_false",
    { paidDocumentModeBoundaryImplementationPlanOnly: false });
  expect_rejected("paid_document_mode_boundary_implementation_plan_defined_false",
    { paidDocumentModeBoundaryImplementationPlanDefined: false });
  expect_rejected("paid_document_mode_boundary_runtime_still_not_implemented_false",
    { paidDocumentModeBoundaryRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_checkout_runtime_still_not_implemented_false",
    { paidDocumentModeCheckoutRuntimeStillNotImplemented: false });
  expect_rejected("paid_document_mode_entitlement_runtime_still_not_implemented_false",
    { paidDocumentModeEntitlementRuntimeStillNotImplemented: false });

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

  // Future entitlement requirements
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

  // Future lane requirements
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

  // 8.5Q TD-005 result flags
  expect_rejected("td005_boundary_implementation_planned_false",
    { td005PaidDocumentModeBoundaryImplementationPlanned: false });
  expect_rejected("td005_still_requires_runtime_contract_false",
    { td005PaidDocumentModeStillRequiresRuntimeContract: false });

  // 8.5Q no-prohibited-side-effect confirmations
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

  // 8.5Q forward readiness
  expect_rejected("ready_for_8x5r_runtime_contract_false",
    { readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: false });
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

export function runControlledRealDocumentPaidDocumentModeBoundaryImplementationPlan(): ControlledRealDocumentPaidDocumentModeBoundaryImplementationPlanResult {
  const canonical = buildCanonical8x5QInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateBoundaryImplementationPlanInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5Q",
    allPassed,
    paidDocumentModeServerBoundaryContractReadyForImplementationPlan: true,
    controlledRealDocumentPaidDocumentModeBoundaryImplementationPlanAccepted: allPassed,
    paidDocumentModeBoundaryImplementationPlanOnly: true,
    paidDocumentModeBoundaryImplementationPlanDefined: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    paidBoundaryImplementationPlanTargetsFutureServerRouteBoundary: true,
    paidBoundaryImplementationPlanDoesNotModifyRoutesNow: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeModelCall: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeStorage: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforePersistence: true,
    paidBoundaryImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryImplementationPlanRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryImplementationPlanRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryImplementationPlanRequiresDenyByDefault: true,

    paidBoundaryImplementationPlanRequiresServerVerifiedEntitlement: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedPaidSession: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryImplementationPlanRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryImplementationPlanForbidsUiOnlyEntitlement: true,
    paidBoundaryImplementationPlanForbidsClientPaidFlagTrust: true,
    paidBoundaryImplementationPlanForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryImplementationPlanForbidsClientEntitlementFlagTrust: true,
    paidBoundaryImplementationPlanRequiresMissingEntitlementBlocked: true,
    paidBoundaryImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true,

    paidBoundaryImplementationPlanDefinesFreeQaLane: true,
    paidBoundaryImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryImplementationPlanDefinesFuturePaidDocumentLane: true,
    paidBoundaryImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryImplementationPlanRequiresSeparateRuntimeContractNext: true,
    paidBoundaryImplementationPlanRequiresNoRuntimeActivationThisPhase: true,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundaryImplementationPlanned: true,
    td005PaidDocumentModeStillRequiresRuntimeContract: true,
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

    paidBoundaryImplementationPlanConfirmsNoOpenAiCall: true,
    paidBoundaryImplementationPlanConfirmsNoFetchCall: true,
    paidBoundaryImplementationPlanConfirmsNoProcessEnvRead: true,
    paidBoundaryImplementationPlanConfirmsNoSdkUsage: true,
    paidBoundaryImplementationPlanConfirmsNo8x3AcRerun: true,
    paidBoundaryImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoRouteImport: true,
    paidBoundaryImplementationPlanConfirmsNoRouteMutation: true,
    paidBoundaryImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoStripeCall: true,
    paidBoundaryImplementationPlanConfirmsNoCheckoutCall: true,
    paidBoundaryImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoOcrRuntimeCall: true,
    paidBoundaryImplementationPlanConfirmsNoStorageMutation: true,
    paidBoundaryImplementationPlanConfirmsNoDatabaseWrite: true,
    paidBoundaryImplementationPlanConfirmsNoAuditPersistence: true,
    paidBoundaryImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryImplementationPlanConfirmsNoEvidenceEvaluation: true,
    paidBoundaryImplementationPlanConfirmsNoClaimAuthorization: true,
    paidBoundaryImplementationPlanConfirmsNoDeadlineCalculation: true,
    paidBoundaryImplementationPlanConfirmsNoLegalCertainty: true,

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

    readyFor8x5RPaidDocumentModeBoundaryRuntimeContract: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5Q is a controlled real-document Paid Document Mode Boundary Implementation Plan.",
      "8.5Q depends on completed 8.5P Paid Document Mode Server Boundary Contract.",
      "8.5Q is implementation-plan-only.",
      "/api/smart-talk was not modified.",
      "/api/smart-talk-photo was not modified.",
      "Payment, checkout, and entitlement runtime were not implemented.",
      "Paid Document Mode runtime was not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No runtime/pilot/production/final/go-live authorization was granted.",
      "Future boundary must deny by default without server-verified entitlement.",
      "UI-only and client-provided paid/document/entitlement flags must not be trusted.",
      "8.5N Free Q&A bypass guard must remain preserved.",
      "8.5H photo OCR quarantine must remain preserved.",
      "Future entitled lane still requires PII redaction, Evidence Gates, and legal safety blocks.",
      "TD-005 is now implementation-planned but still requires runtime contract and runtime implementation.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5R Paid Document Mode Boundary Runtime Contract.",
      "readyFor8x5RPaidDocumentModeBoundaryRuntimeContract is planning readiness only, not runtime authorization.",
    ],
  };
}
