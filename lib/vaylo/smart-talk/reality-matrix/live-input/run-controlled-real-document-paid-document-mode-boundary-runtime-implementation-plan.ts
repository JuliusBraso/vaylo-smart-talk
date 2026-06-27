/**
 * Phase 8.5S — Controlled Real Document Paid Document Mode Boundary
 * Runtime Implementation Plan.
 *
 * RUNTIME-IMPLEMENTATION-PLAN-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5R.
 *
 * This file defines a pure governance implementation plan for a future
 * Paid Document Mode boundary runtime patch. It does NOT implement payment,
 * entitlement, checkout, route boundary, document processing, OCR, prompt
 * build, model calls, runSmartTalk, or any runtime behaviour.
 *
 * This file does NOT:
 *   - Call OpenAI, fetch, runSmartTalk, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import live route, payment, Stripe, checkout, or entitlement modules.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Implement payment, entitlement, document processing, route boundary,
 *     or Paid Document Mode runtime.
 *   - Build prompts or call models.
 *   - Authorize live real-document processing, OCR, or upload.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeBoundaryRuntimeContract } from "./run-controlled-real-document-paid-document-mode-boundary-runtime-contract";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanInput {
  // 8.5R prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeContractOnly: boolean;
  readonly paidDocumentModeBoundaryRuntimeContractDefined: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;

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

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags from 8.5R
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundaryRuntimeContracted: boolean;
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

  // Actual performed flags from 8.5R (all false — 21 fields)
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
  readonly actualPromptBuildPerformed: boolean;
  readonly actualModelCallPerformed: boolean;

  // 8.5R paidBoundaryRuntimeContractConfirms* (all true — 23 fields)
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

  // 8.5R forward readiness gate
  readonly readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: boolean;

  // 8.5S future surgical target plan flags (all true)
  readonly paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly: boolean;
  readonly paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch: boolean;

  // 8.5S future insertion plan flags (all true)
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation: boolean;

  // 8.5S future entitlement verification plan flags (all true)
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust: boolean;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault: boolean;

  // 8.5S future unauthorized response plan flags (all true)
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance: boolean;

  // 8.5S future lane and safety plan flags (all true)
  readonly paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane: boolean;
  readonly paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane: boolean;
  readonly paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane: boolean;
  readonly paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase: boolean;
  readonly paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext: boolean;

  // 8.5S TD-005 result flags
  readonly td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeExecutionContract: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementation: boolean;

  // 8.5S new actual* assertion
  readonly actualRunSmartTalkCalled: boolean;

  // 8.5S no-prohibited-side-effect confirmations (24)
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall: boolean;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall: boolean;

  // 8.5S forward readiness
  readonly readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanResult {
  readonly checkId: "8.5S";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan: true;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanOnly: true;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanDefined: true;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Future surgical target plan flags
  readonly paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly: true;
  readonly paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch: true;

  // Future insertion plan flags
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation: true;

  // Future entitlement verification plan flags
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust: true;
  readonly paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault: true;

  // Future unauthorized response plan flags
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance: true;

  // Future lane and safety plan flags
  readonly paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane: true;
  readonly paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true;
  readonly paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane: true;
  readonly paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase: true;
  readonly paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext: true;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: true;
  readonly td005PaidDocumentModeStillRequiresRuntimeExecutionContract: true;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementation: true;
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

  // Actual performed flags (all false — 22 fields)
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
  readonly actualRunSmartTalkCalled: false;

  // No-prohibited-side-effect confirmations (24)
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall: true;
  readonly paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall: true;

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
  readonly readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: true;
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

function validateBoundaryRuntimeImplementationPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5R prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5R") reasons.push("prereq_check_id_must_be_8x5R");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract"] !== true)
    reasons.push("implementation_plan_ready_for_runtime_contract_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted"] !== true)
    reasons.push("runtime_contract_not_accepted");
  if (o["paidDocumentModeBoundaryRuntimeContractOnly"] !== true)
    reasons.push("runtime_contract_only_false");
  if (o["paidDocumentModeBoundaryRuntimeContractDefined"] !== true)
    reasons.push("runtime_contract_defined_false");
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

  // Runtime contract insertion requirements (all true)
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

  // Server entitlement contract requirements (all true)
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

  // Free Q&A and route containment preservation (all true)
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

  // Future lane contract requirements (all true)
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

  // Runtime denial response requirements (all true)
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

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

  // TD flags from 8.5R
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundaryRuntimeContracted"] !== true)
    reasons.push("td005_boundary_runtime_contracted_false");
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
    reasons.push("td006_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("td007_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("td008_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("td010_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // Actual performed flags from 8.5R (all false — 21)
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
  if (o["actualPromptBuildPerformed"] !== false)
    reasons.push("actual_prompt_build_performed_must_be_false");
  if (o["actualModelCallPerformed"] !== false)
    reasons.push("actual_model_call_performed_must_be_false");

  // paidBoundaryRuntimeContractConfirms* (all true — 23)
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

  // 8.5R forward readiness gate
  if (o["readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan"] !== true)
    reasons.push("ready_for_8x5s_runtime_implementation_plan_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_separate_runtime_authorization_must_be_false");
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

  // 8.5S future surgical target plan flags (all true)
  if (o["paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly"] !== true)
    reasons.push("plan_targets_smart_talk_route_only_false");
  if (o["paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow"] !== true)
    reasons.push("plan_does_not_modify_routes_now_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification"] !== true)
    reasons.push("plan_forbids_photo_route_modification_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("plan_requires_photo_ocr_quarantine_preserved_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved"] !== true)
    reasons.push("plan_requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater"] !== true)
    reasons.push("plan_requires_minimal_surgical_patch_later_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater"] !== true)
    reasons.push("plan_forbids_broad_route_refactor_later_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater"] !== true)
    reasons.push("plan_forbids_ui_only_boundary_later_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater"] !== true)
    reasons.push("plan_requires_server_boundary_later_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch"] !== true)
    reasons.push("plan_requires_separate_audit_after_patch_false");

  // 8.5S future insertion plan flags (all true)
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse"] !== true)
    reasons.push("plan_requires_boundary_after_json_parse_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild"] !== true)
    reasons.push("plan_requires_boundary_before_prompt_build_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall"] !== true)
    reasons.push("plan_requires_boundary_before_model_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk"] !== true)
    reasons.push("plan_requires_boundary_before_run_smart_talk_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing"] !== true)
    reasons.push("plan_requires_boundary_before_document_processing_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage"] !== true)
    reasons.push("plan_requires_boundary_before_storage_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence"] !== true)
    reasons.push("plan_requires_boundary_before_persistence_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput"] !== true)
    reasons.push("plan_requires_boundary_before_user_visible_output_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime"] !== true)
    reasons.push("plan_requires_boundary_before_evidence_gate_runtime_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization"] !== true)
    reasons.push("plan_requires_boundary_before_claim_authorization_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation"] !== true)
    reasons.push("plan_requires_boundary_before_deadline_calculation_false");

  // 8.5S future entitlement verification plan flags (all true)
  if (o["paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement"] !== true)
    reasons.push("plan_requires_server_verified_entitlement_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("plan_requires_server_verified_paid_session_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("plan_requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("plan_requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement"] !== true)
    reasons.push("plan_forbids_ui_only_entitlement_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust"] !== true)
    reasons.push("plan_forbids_client_paid_flag_trust_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust"] !== true)
    reasons.push("plan_forbids_client_document_mode_flag_trust_false");
  if (o["paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust"] !== true)
    reasons.push("plan_forbids_client_entitlement_flag_trust_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked"] !== true)
    reasons.push("plan_requires_missing_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked"] !== true)
    reasons.push("plan_requires_malformed_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked"] !== true)
    reasons.push("plan_requires_expired_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked"] !== true)
    reasons.push("plan_requires_unverifiable_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked"] !== true)
    reasons.push("plan_requires_unauthorized_document_attempt_blocked_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing"] !== true)
    reasons.push("plan_requires_no_fallback_to_free_qa_document_processing_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault"] !== true)
    reasons.push("plan_requires_deny_by_default_false");

  // 8.5S future unauthorized response plan flags (all true)
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess"] !== true)
    reasons.push("plan_requires_unauthorized_response_non_success_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse"] !== true)
    reasons.push("plan_requires_unauthorized_response_ok_false_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired"] !== true)
    reasons.push("plan_requires_unauthorized_response_code_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_raw_document_echo_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_translation_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_summary_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_explanation_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_legal_advice_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_deadline_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance"] !== true)
    reasons.push("plan_requires_unauthorized_response_no_internal_governance_false");

  // 8.5S future lane and safety plan flags (all true)
  if (o["paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane"] !== true)
    reasons.push("plan_defines_free_qa_lane_false");
  if (o["paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("plan_defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane"] !== true)
    reasons.push("plan_defines_future_paid_document_lane_false");
  if (o["paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("plan_defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired"] !== true)
    reasons.push("plan_requires_unauthorized_lane_document_mode_required_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("plan_requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase"] !== true)
    reasons.push("plan_requires_no_runtime_activation_this_phase_false");
  if (o["paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext"] !== true)
    reasons.push("plan_requires_separate_runtime_execution_contract_next_false");

  // 8.5S TD-005 result flags
  if (o["td005PaidDocumentModeBoundaryRuntimeImplementationPlanned"] !== true)
    reasons.push("td005_boundary_runtime_implementation_planned_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeExecutionContract"] !== true)
    reasons.push("td005_still_requires_runtime_execution_contract_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_false");

  // 8.5S new actual* assertion
  if (o["actualRunSmartTalkCalled"] !== false)
    reasons.push("actual_run_smart_talk_called_must_be_false");

  // 8.5S no-prohibited-side-effect confirmations (all true — 24)
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall"] !== true)
    reasons.push("plan_confirms_no_openai_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall"] !== true)
    reasons.push("plan_confirms_no_fetch_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead"] !== true)
    reasons.push("plan_confirms_no_process_env_read_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage"] !== true)
    reasons.push("plan_confirms_no_sdk_usage_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun"] !== true)
    reasons.push("plan_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_smart_talk_runtime_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport"] !== true)
    reasons.push("plan_confirms_no_route_import_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation"] !== true)
    reasons.push("plan_confirms_no_route_mutation_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_payment_runtime_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall"] !== true)
    reasons.push("plan_confirms_no_stripe_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall"] !== true)
    reasons.push("plan_confirms_no_checkout_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("plan_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation"] !== true)
    reasons.push("plan_confirms_no_storage_mutation_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite"] !== true)
    reasons.push("plan_confirms_no_database_write_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence"] !== true)
    reasons.push("plan_confirms_no_audit_persistence_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("plan_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("plan_confirms_no_evidence_evaluation_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization"] !== true)
    reasons.push("plan_confirms_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("plan_confirms_no_deadline_calculation_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty"] !== true)
    reasons.push("plan_confirms_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild"] !== true)
    reasons.push("plan_confirms_no_prompt_build_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall"] !== true)
    reasons.push("plan_confirms_no_model_call_false");
  if (o["paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("plan_confirms_no_run_smart_talk_call_false");

  // 8.5S forward readiness
  if (o["readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract"] !== true)
    reasons.push("ready_for_8x5t_runtime_execution_contract_false");
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

// ── Canonical 8.5S input ──────────────────────────────────────────────────────

function buildCanonical8x5SInput(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanInput {
  const contractResult = runControlledRealDocumentPaidDocumentModeBoundaryRuntimeContract();
  return {
    // 8.5R prerequisite gate — core
    prereqCheckId: contractResult.checkId,
    prereqAllPassed: contractResult.allPassed,
    paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract:
      contractResult.paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted:
      contractResult.controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted,
    paidDocumentModeBoundaryRuntimeContractOnly:
      contractResult.paidDocumentModeBoundaryRuntimeContractOnly,
    paidDocumentModeBoundaryRuntimeContractDefined:
      contractResult.paidDocumentModeBoundaryRuntimeContractDefined,
    paidDocumentModeBoundaryRuntimeStillNotImplemented:
      contractResult.paidDocumentModeBoundaryRuntimeStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented:
      contractResult.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeCheckoutRuntimeStillNotImplemented:
      contractResult.paidDocumentModeCheckoutRuntimeStillNotImplemented,
    paidDocumentModeEntitlementRuntimeStillNotImplemented:
      contractResult.paidDocumentModeEntitlementRuntimeStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      contractResult.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      contractResult.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,

    // Runtime contract insertion requirements
    paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeDocumentProcessing,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeModelCall,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforePromptBuild,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeStorage,
    paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforePersistence,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeUserVisibleOutput,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeEvidenceGateRuntime,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeClaimAuthorization,
    paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation:
      contractResult.paidBoundaryRuntimeContractRequiresBoundaryBeforeDeadlineCalculation,
    paidBoundaryRuntimeContractRequiresDenyByDefault:
      contractResult.paidBoundaryRuntimeContractRequiresDenyByDefault,

    // Server entitlement contract requirements
    paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement:
      contractResult.paidBoundaryRuntimeContractRequiresServerVerifiedEntitlement,
    paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession:
      contractResult.paidBoundaryRuntimeContractRequiresServerVerifiedPaidSession,
    paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature:
      contractResult.paidBoundaryRuntimeContractRequiresServerVerifiedProductOrFeature,
    paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess:
      contractResult.paidBoundaryRuntimeContractRequiresServerVerifiedDocumentModeAccess,
    paidBoundaryRuntimeContractForbidsUiOnlyEntitlement:
      contractResult.paidBoundaryRuntimeContractForbidsUiOnlyEntitlement,
    paidBoundaryRuntimeContractForbidsClientPaidFlagTrust:
      contractResult.paidBoundaryRuntimeContractForbidsClientPaidFlagTrust,
    paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust:
      contractResult.paidBoundaryRuntimeContractForbidsClientDocumentModeFlagTrust,
    paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust:
      contractResult.paidBoundaryRuntimeContractForbidsClientEntitlementFlagTrust,
    paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresMissingEntitlementBlocked,
    paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresMalformedEntitlementBlocked,
    paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresExpiredEntitlementBlocked,
    paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresUnverifiableEntitlementBlocked,
    paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedDocumentAttemptBlocked,
    paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing:
      contractResult.paidBoundaryRuntimeContractRequiresNoFallbackToFreeQaDocumentProcessing,

    // Free Q&A and route containment preservation
    paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved:
      contractResult.paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved,
    paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked:
      contractResult.paidBoundaryRuntimeContractRequiresDocumentLikeTextInFreeQaStillBlocked,
    paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved:
      contractResult.paidBoundaryRuntimeContractRequiresDocumentModeRequiredResponsePreserved,
    paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed:
      contractResult.paidBoundaryRuntimeContractRequiresGeneralQuestionsStillAllowed,
    paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa:
      contractResult.paidBoundaryRuntimeContractForbidsFullDocumentExplanationInFreeQa,
    paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa:
      contractResult.paidBoundaryRuntimeContractForbidsDocumentTranslationInFreeQa,
    paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa:
      contractResult.paidBoundaryRuntimeContractForbidsDeadlineCalculationInFreeQa,
    paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa:
      contractResult.paidBoundaryRuntimeContractForbidsLegalCertaintyInFreeQa,
    paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa:
      contractResult.paidBoundaryRuntimeContractForbidsClaimAuthorizationInFreeQa,
    paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved:
      contractResult.paidBoundaryRuntimeContractRequiresPhotoOcrQuarantinePreserved,

    // Future lane contract requirements
    paidBoundaryRuntimeContractDefinesFreeQaLane:
      contractResult.paidBoundaryRuntimeContractDefinesFreeQaLane,
    paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane:
      contractResult.paidBoundaryRuntimeContractDefinesUnauthorizedDocumentAttemptLane,
    paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane:
      contractResult.paidBoundaryRuntimeContractDefinesFuturePaidDocumentLane,
    paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane:
      contractResult.paidBoundaryRuntimeContractDefinesFutureEntitledDocumentProcessingLane,
    paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedLaneDocumentModeRequired,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction:
      contractResult.paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToPiiRedaction,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates:
      contractResult.paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToEvidenceGates,
    paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks:
      contractResult.paidBoundaryRuntimeContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks,
    paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext:
      contractResult.paidBoundaryRuntimeContractRequiresSeparateRuntimeImplementationNext,
    paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase:
      contractResult.paidBoundaryRuntimeContractRequiresNoRuntimeActivationThisPhase,

    // Runtime denial response requirements
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNonSuccess,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseOkFalse,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoRawDocumentEcho,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoTranslation,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoSummary,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoExplanation,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalAdvice,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoDeadline,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoLegalCertainty,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoClaimAuthorization,
    paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance:
      contractResult.paidBoundaryRuntimeContractRequiresUnauthorizedResponseNoInternalGovernance,

    // Authorization grants
    runtimeAuthorizationGranted: contractResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: contractResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: contractResult.productionAuthorizationGranted,
    finalAuthorizationGranted: contractResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: contractResult.goLiveAuthorizationGranted,

    // TD flags from 8.5R
    td001DocumentBypassGuardContainmentClosed: contractResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryRuntimeContracted:
      contractResult.td005PaidDocumentModeBoundaryRuntimeContracted,
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

    // Actual performed flags from 8.5R (21)
    actualLiveRouteMutationPerformed: contractResult.actualLiveRouteMutationPerformed,
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
    actualPiiRedactionImplemented: contractResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: contractResult.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: contractResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: contractResult.actualDeadlineCalculationPerformed,
    actualPromptBuildPerformed: contractResult.actualPromptBuildPerformed,
    actualModelCallPerformed: contractResult.actualModelCallPerformed,

    // paidBoundaryRuntimeContractConfirms* (23)
    paidBoundaryRuntimeContractConfirmsNoOpenAiCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoOpenAiCall,
    paidBoundaryRuntimeContractConfirmsNoFetchCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoFetchCall,
    paidBoundaryRuntimeContractConfirmsNoProcessEnvRead:
      contractResult.paidBoundaryRuntimeContractConfirmsNoProcessEnvRead,
    paidBoundaryRuntimeContractConfirmsNoSdkUsage:
      contractResult.paidBoundaryRuntimeContractConfirmsNoSdkUsage,
    paidBoundaryRuntimeContractConfirmsNo8x3AcRerun:
      contractResult.paidBoundaryRuntimeContractConfirmsNo8x3AcRerun,
    paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoSmartTalkRuntimeCall,
    paidBoundaryRuntimeContractConfirmsNoRouteImport:
      contractResult.paidBoundaryRuntimeContractConfirmsNoRouteImport,
    paidBoundaryRuntimeContractConfirmsNoRouteMutation:
      contractResult.paidBoundaryRuntimeContractConfirmsNoRouteMutation,
    paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoPaymentRuntimeCall,
    paidBoundaryRuntimeContractConfirmsNoStripeCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoStripeCall,
    paidBoundaryRuntimeContractConfirmsNoCheckoutCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoCheckoutCall,
    paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoEntitlementRuntimeCall,
    paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoOcrRuntimeCall,
    paidBoundaryRuntimeContractConfirmsNoStorageMutation:
      contractResult.paidBoundaryRuntimeContractConfirmsNoStorageMutation,
    paidBoundaryRuntimeContractConfirmsNoDatabaseWrite:
      contractResult.paidBoundaryRuntimeContractConfirmsNoDatabaseWrite,
    paidBoundaryRuntimeContractConfirmsNoAuditPersistence:
      contractResult.paidBoundaryRuntimeContractConfirmsNoAuditPersistence,
    paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation:
      contractResult.paidBoundaryRuntimeContractConfirmsNoUserVisibleDocumentExplanation,
    paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation:
      contractResult.paidBoundaryRuntimeContractConfirmsNoEvidenceEvaluation,
    paidBoundaryRuntimeContractConfirmsNoClaimAuthorization:
      contractResult.paidBoundaryRuntimeContractConfirmsNoClaimAuthorization,
    paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation:
      contractResult.paidBoundaryRuntimeContractConfirmsNoDeadlineCalculation,
    paidBoundaryRuntimeContractConfirmsNoLegalCertainty:
      contractResult.paidBoundaryRuntimeContractConfirmsNoLegalCertainty,
    paidBoundaryRuntimeContractConfirmsNoPromptBuild:
      contractResult.paidBoundaryRuntimeContractConfirmsNoPromptBuild,
    paidBoundaryRuntimeContractConfirmsNoModelCall:
      contractResult.paidBoundaryRuntimeContractConfirmsNoModelCall,

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

    // 8.5R forward readiness gate
    readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan:
      contractResult.readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan,

    // 8.5S future surgical target plan flags
    paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly: true,
    paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow: true,
    paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification: true,
    paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater: true,
    paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater: true,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater: true,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch: true,

    // 8.5S future insertion plan flags
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation: true,

    // 8.5S future entitlement verification plan flags
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing: true,
    paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault: true,

    // 8.5S future unauthorized response plan flags
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance: true,

    // 8.5S future lane and safety plan flags
    paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase: true,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext: true,

    // 8.5S TD-005 result flags
    td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: true,
    td005PaidDocumentModeStillRequiresRuntimeExecutionContract: true,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation: true,

    // 8.5S new actual* assertion
    actualRunSmartTalkCalled: false,

    // 8.5S no-prohibited-side-effect confirmations
    paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall: true,

    // 8.5S forward readiness
    readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: true,
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
  const base = buildCanonical8x5SInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateBoundaryRuntimeImplementationPlanInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5R prerequisite gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5Q" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("implementation_plan_ready_for_runtime_contract_false",
    { paidDocumentModeBoundaryImplementationPlanReadyForRuntimeContract: false });
  expect_rejected("runtime_contract_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryRuntimeContractAccepted: false });
  expect_rejected("runtime_contract_only_false",
    { paidDocumentModeBoundaryRuntimeContractOnly: false });
  expect_rejected("runtime_contract_defined_false",
    { paidDocumentModeBoundaryRuntimeContractDefined: false });
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

  // Runtime contract insertion requirements
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

  // Server entitlement contract requirements
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

  // Free Q&A and route containment preservation
  expect_rejected("runtime_contract_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryRuntimeContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("runtime_contract_requires_document_like_text_still_blocked_false",
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

  // Future lane contract requirements
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

  // Runtime denial response requirements
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

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_containment_closed_false", { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_runtime_contracted_false",
    { td005PaidDocumentModeBoundaryRuntimeContracted: false });
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

  // Actual performed flags from 8.5R (must all be false — 21)
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
  expect_rejected("actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_performed_true", { actualModelCallPerformed: true });

  // paidBoundaryRuntimeContractConfirms* (must all be true — 23)
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

  // 8.5R forward readiness gate
  expect_rejected("ready_for_8x5s_runtime_implementation_plan_false",
    { readyFor8x5SPaidDocumentModeBoundaryRuntimeImplementationPlan: false });
  expect_rejected("ready_for_separate_runtime_authorization_true_in_prereq",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_in_prereq", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_in_prereq", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_in_prereq", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_in_prereq", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_in_prereq", { neverUserVisible: false });

  // 8.5S future surgical target plan flags
  expect_rejected("plan_targets_smart_talk_route_only_false",
    { paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly: false });
  expect_rejected("plan_does_not_modify_routes_now_false",
    { paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow: false });
  expect_rejected("plan_forbids_photo_route_modification_false",
    { paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification: false });
  expect_rejected("plan_requires_photo_ocr_quarantine_preserved_false",
    { paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved: false });
  expect_rejected("plan_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("plan_requires_minimal_surgical_patch_later_false",
    { paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater: false });
  expect_rejected("plan_forbids_broad_route_refactor_later_false",
    { paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater: false });
  expect_rejected("plan_forbids_ui_only_boundary_later_false",
    { paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater: false });
  expect_rejected("plan_requires_server_boundary_later_false",
    { paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater: false });
  expect_rejected("plan_requires_separate_audit_after_patch_false",
    { paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch: false });

  // 8.5S future insertion plan flags
  expect_rejected("plan_requires_boundary_after_json_parse_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse: false });
  expect_rejected("plan_requires_boundary_before_prompt_build_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("plan_requires_boundary_before_model_call_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall: false });
  expect_rejected("plan_requires_boundary_before_run_smart_talk_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk: false });
  expect_rejected("plan_requires_boundary_before_document_processing_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing: false });
  expect_rejected("plan_requires_boundary_before_storage_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage: false });
  expect_rejected("plan_requires_boundary_before_persistence_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence: false });
  expect_rejected("plan_requires_boundary_before_user_visible_output_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("plan_requires_boundary_before_evidence_gate_runtime_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime: false });
  expect_rejected("plan_requires_boundary_before_claim_authorization_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization: false });
  expect_rejected("plan_requires_boundary_before_deadline_calculation_false",
    { paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation: false });

  // 8.5S future entitlement verification plan flags
  expect_rejected("plan_requires_server_verified_entitlement_false",
    { paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement: false });
  expect_rejected("plan_requires_server_verified_paid_session_false",
    { paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession: false });
  expect_rejected("plan_requires_server_verified_product_or_feature_false",
    { paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("plan_requires_server_verified_document_mode_access_false",
    { paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("plan_forbids_ui_only_entitlement_false",
    { paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement: false });
  expect_rejected("plan_forbids_client_paid_flag_trust_false",
    { paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust: false });
  expect_rejected("plan_forbids_client_document_mode_flag_trust_false",
    { paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust: false });
  expect_rejected("plan_forbids_client_entitlement_flag_trust_false",
    { paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust: false });
  expect_rejected("plan_requires_missing_entitlement_blocked_false",
    { paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked: false });
  expect_rejected("plan_requires_malformed_entitlement_blocked_false",
    { paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked: false });
  expect_rejected("plan_requires_expired_entitlement_blocked_false",
    { paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked: false });
  expect_rejected("plan_requires_unverifiable_entitlement_blocked_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked: false });
  expect_rejected("plan_requires_unauthorized_document_attempt_blocked_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: false });
  expect_rejected("plan_requires_no_fallback_to_free_qa_document_processing_false",
    { paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing: false });
  expect_rejected("plan_requires_deny_by_default_false",
    { paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault: false });

  // 8.5S future unauthorized response plan flags
  expect_rejected("plan_requires_unauthorized_response_non_success_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess: false });
  expect_rejected("plan_requires_unauthorized_response_ok_false_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse: false });
  expect_rejected("plan_requires_unauthorized_response_code_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: false });
  expect_rejected("plan_requires_unauthorized_response_no_raw_document_echo_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("plan_requires_unauthorized_response_no_translation_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation: false });
  expect_rejected("plan_requires_unauthorized_response_no_summary_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary: false });
  expect_rejected("plan_requires_unauthorized_response_no_explanation_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation: false });
  expect_rejected("plan_requires_unauthorized_response_no_legal_advice_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("plan_requires_unauthorized_response_no_deadline_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline: false });
  expect_rejected("plan_requires_unauthorized_response_no_legal_certainty_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("plan_requires_unauthorized_response_no_claim_authorization_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("plan_requires_unauthorized_response_no_internal_governance_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance: false });

  // 8.5S future lane and safety plan flags
  expect_rejected("plan_defines_free_qa_lane_false",
    { paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane: false });
  expect_rejected("plan_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("plan_defines_future_paid_document_lane_false",
    { paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane: false });
  expect_rejected("plan_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("plan_requires_unauthorized_lane_document_mode_required_false",
    { paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("plan_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("plan_requires_no_runtime_activation_this_phase_false",
    { paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase: false });
  expect_rejected("plan_requires_separate_runtime_execution_contract_next_false",
    { paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext: false });

  // 8.5S TD-005 result flags
  expect_rejected("td005_boundary_runtime_implementation_planned_false",
    { td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: false });
  expect_rejected("td005_still_requires_runtime_execution_contract_false",
    { td005PaidDocumentModeStillRequiresRuntimeExecutionContract: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementation: false });
  expect_rejected("td004_false_in_result", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_false_in_result",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // 8.5S actual* assertions (must all be false — 22 in result)
  expect_rejected("actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });
  // (earlier actual* tamper cases also cover 8.5S result since same field names)

  // 8.5S no-prohibited-side-effect confirmations (must all be true — 24)
  expect_rejected("plan_confirms_no_openai_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall: false });
  expect_rejected("plan_confirms_no_fetch_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall: false });
  expect_rejected("plan_confirms_no_process_env_read_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead: false });
  expect_rejected("plan_confirms_no_sdk_usage_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage: false });
  expect_rejected("plan_confirms_no_8x3ac_rerun_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun: false });
  expect_rejected("plan_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("plan_confirms_no_route_import_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport: false });
  expect_rejected("plan_confirms_no_route_mutation_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation: false });
  expect_rejected("plan_confirms_no_payment_runtime_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("plan_confirms_no_stripe_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall: false });
  expect_rejected("plan_confirms_no_checkout_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall: false });
  expect_rejected("plan_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("plan_confirms_no_ocr_runtime_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: false });
  expect_rejected("plan_confirms_no_storage_mutation_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation: false });
  expect_rejected("plan_confirms_no_database_write_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite: false });
  expect_rejected("plan_confirms_no_audit_persistence_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence: false });
  expect_rejected("plan_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("plan_confirms_no_evidence_evaluation_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: false });
  expect_rejected("plan_confirms_no_claim_authorization_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization: false });
  expect_rejected("plan_confirms_no_deadline_calculation_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation: false });
  expect_rejected("plan_confirms_no_legal_certainty_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty: false });
  expect_rejected("plan_confirms_no_prompt_build_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild: false });
  expect_rejected("plan_confirms_no_model_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall: false });
  expect_rejected("plan_confirms_no_run_smart_talk_call_false",
    { paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall: false });

  // 8.5S forward readiness
  expect_rejected("ready_for_8x5t_runtime_execution_contract_false",
    { readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: false });
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

export function runControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlan(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanResult {
  const canonical = buildCanonical8x5SInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateBoundaryRuntimeImplementationPlanInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5S",
    allPassed,
    paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan: true,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted: allPassed,
    paidDocumentModeBoundaryRuntimeImplementationPlanOnly: true,
    paidDocumentModeBoundaryRuntimeImplementationPlanDefined: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly: true,
    paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow: true,
    paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification: true,
    paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater: true,
    paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater: true,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater: true,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch: true,

    paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation: true,

    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing: true,
    paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault: true,

    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance: true,

    paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase: true,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext: true,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: true,
    td005PaidDocumentModeStillRequiresRuntimeExecutionContract: true,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation: true,
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
    actualRunSmartTalkCalled: false,

    paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall: true,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall: true,

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

    readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5S is a controlled real-document Paid Document Mode Boundary Runtime Implementation Plan.",
      "8.5S depends on completed 8.5R Paid Document Mode Boundary Runtime Contract.",
      "8.5S is runtime-implementation-plan-only.",
      "/api/smart-talk was not modified.",
      "/api/smart-talk-photo was not modified.",
      "Payment, checkout, and entitlement runtime were not implemented.",
      "Paid Document Mode runtime was not implemented.",
      "Route boundary runtime was not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No prompt build, model call, or runSmartTalk call was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No runtime/pilot/production/final/go-live authorization was granted.",
      "Future runtime patch must be minimal and target /api/smart-talk only.",
      "Future runtime patch must preserve 8.5N Free Q&A bypass guard.",
      "Future runtime patch must preserve 8.5H photo OCR quarantine.",
      "Future runtime must deny by default without server-verified entitlement.",
      "UI-only and client-provided paid/document/entitlement flags must not be trusted.",
      "Future entitled lane still requires PII redaction, Evidence Gates, and legal safety blocks.",
      "TD-005 is now runtime-implementation-planned but still requires runtime execution contract and actual runtime implementation.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5T Paid Document Mode Boundary Runtime Execution Contract.",
      "readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract is planning readiness only, not runtime authorization.",
    ],
  };
}
