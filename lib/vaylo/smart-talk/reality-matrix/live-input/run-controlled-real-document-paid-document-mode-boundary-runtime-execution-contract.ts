/**
 * Phase 8.5T — Controlled Real Document Paid Document Mode Boundary
 * Runtime Execution Contract.
 *
 * RUNTIME-EXECUTION-CONTRACT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5S.
 *
 * This file defines a pure governance execution contract for a future Paid
 * Document Mode boundary surgical route patch. It does NOT implement payment,
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

import { runControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlan } from "./run-controlled-real-document-paid-document-mode-boundary-runtime-implementation-plan";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractInput {
  // 8.5S prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanOnly: boolean;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanDefined: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;

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

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags from 8.5S
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: boolean;
  readonly td005PaidDocumentModeStillRequiresRuntimeExecutionContract: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementation: boolean;
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

  // Actual performed flags from 8.5S (all false — 22 fields)
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
  readonly actualRunSmartTalkCalled: boolean;

  // 8.5S paidBoundaryRuntimeImplementationPlanConfirms* (all true — 24 fields)
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

  // 8.5S forward readiness gate
  readonly readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: boolean;

  // 8.5T future route execution constraints (all true)
  readonly paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerBoundary: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: boolean;

  // 8.5T future insertion execution constraints (all true)
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: boolean;

  // 8.5T future entitlement execution constraints (all true)
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: boolean;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: boolean;

  // 8.5T future unauthorized response execution constraints (all true)
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: boolean;

  // 8.5T future lane and safety execution constraints (all true)
  readonly paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: boolean;
  readonly paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: boolean;
  readonly paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: boolean;
  readonly paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: boolean;
  readonly paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: boolean;

  // 8.5T TD-005 result flags (td005PaidDocumentModeStillRequiresActualRuntimeImplementation reused from 8.5S TD flags above)
  readonly td005PaidDocumentModeBoundaryRuntimeExecutionContracted: boolean;
  readonly td005PaidDocumentModeStillRequiresSurgicalRoutePatch: boolean;
  readonly td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: boolean;

  // 8.5T new actual* assertions
  readonly actualSmartTalkRouteModified: boolean;
  readonly actualPhotoRouteModified: boolean;
  readonly actualPaidDocumentBoundaryImplemented: boolean;

  // 8.5T no-prohibited-side-effect confirmations (26)
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: boolean;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: boolean;

  // 8.5T forward readiness
  readonly readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractResult {
  readonly checkId: "8.5T";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract: true;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractOnly: true;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractDefined: true;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Future route execution constraints
  readonly paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerBoundary: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: true;

  // Future insertion execution constraints
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: true;

  // Future entitlement execution constraints
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: true;
  readonly paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: true;

  // Future unauthorized response execution constraints
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: true;

  // Future lane and safety execution constraints
  readonly paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: true;
  readonly paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: true;
  readonly paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: true;
  readonly paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: true;
  readonly paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: true;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundaryRuntimeExecutionContracted: true;
  readonly td005PaidDocumentModeStillRequiresSurgicalRoutePatch: true;
  readonly td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: true;
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

  // Actual performed flags (all false — 25 fields)
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualSmartTalkRouteModified: false;
  readonly actualPhotoRouteModified: false;
  readonly actualPaidDocumentBoundaryImplemented: false;
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

  // No-prohibited-side-effect confirmations (26)
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: true;
  readonly paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: true;

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
  readonly readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: true;
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

function validateBoundaryRuntimeExecutionContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5S prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5S") reasons.push("prereq_check_id_must_be_8x5S");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan"] !== true)
    reasons.push("implementation_plan_ready_flag_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted"] !== true)
    reasons.push("implementation_plan_not_accepted");
  if (o["paidDocumentModeBoundaryRuntimeImplementationPlanOnly"] !== true)
    reasons.push("implementation_plan_only_false");
  if (o["paidDocumentModeBoundaryRuntimeImplementationPlanDefined"] !== true)
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

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

  // TD flags from 8.5S
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundaryRuntimeImplementationPlanned"] !== true)
    reasons.push("td005_boundary_runtime_implementation_planned_false");
  if (o["td005PaidDocumentModeStillRequiresRuntimeExecutionContract"] !== true)
    reasons.push("td005_still_requires_runtime_execution_contract_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_still_requires_future_authorized_runtime_design_false");
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

  // Actual performed flags from 8.5S (all false — 22)
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
  if (o["actualRunSmartTalkCalled"] !== false)
    reasons.push("actual_run_smart_talk_called_must_be_false");

  // paidBoundaryRuntimeImplementationPlanConfirms* (all true — 24)
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

  // 8.5S forward readiness gate
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

  // 8.5T future route execution constraints (all true)
  if (o["paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly"] !== true)
    reasons.push("execution_contract_targets_smart_talk_route_only_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification"] !== true)
    reasons.push("execution_contract_forbids_photo_route_modification_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("execution_contract_requires_photo_ocr_quarantine_preserved_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved"] !== true)
    reasons.push("execution_contract_requires_free_qa_bypass_guard_preserved_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch"] !== true)
    reasons.push("execution_contract_requires_minimal_surgical_patch_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor"] !== true)
    reasons.push("execution_contract_forbids_broad_route_refactor_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary"] !== true)
    reasons.push("execution_contract_forbids_ui_only_boundary_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresServerBoundary"] !== true)
    reasons.push("execution_contract_requires_server_boundary_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation"] !== true)
    reasons.push("execution_contract_requires_patch_after_body_validation_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit"] !== true)
    reasons.push("execution_contract_requires_separate_post_patch_audit_false");

  // 8.5T future insertion execution constraints (all true)
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse"] !== true)
    reasons.push("execution_contract_requires_boundary_after_json_parse_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation"] !== true)
    reasons.push("execution_contract_requires_boundary_after_text_validation_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild"] !== true)
    reasons.push("execution_contract_requires_boundary_before_prompt_build_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall"] !== true)
    reasons.push("execution_contract_requires_boundary_before_model_call_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk"] !== true)
    reasons.push("execution_contract_requires_boundary_before_run_smart_talk_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing"] !== true)
    reasons.push("execution_contract_requires_boundary_before_document_processing_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage"] !== true)
    reasons.push("execution_contract_requires_boundary_before_storage_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence"] !== true)
    reasons.push("execution_contract_requires_boundary_before_persistence_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput"] !== true)
    reasons.push("execution_contract_requires_boundary_before_user_visible_output_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime"] !== true)
    reasons.push("execution_contract_requires_boundary_before_evidence_gate_runtime_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization"] !== true)
    reasons.push("execution_contract_requires_boundary_before_claim_authorization_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation"] !== true)
    reasons.push("execution_contract_requires_boundary_before_deadline_calculation_false");

  // 8.5T future entitlement execution constraints (all true)
  if (o["paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement"] !== true)
    reasons.push("execution_contract_requires_server_verified_entitlement_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession"] !== true)
    reasons.push("execution_contract_requires_server_verified_paid_session_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature"] !== true)
    reasons.push("execution_contract_requires_server_verified_product_or_feature_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess"] !== true)
    reasons.push("execution_contract_requires_server_verified_document_mode_access_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement"] !== true)
    reasons.push("execution_contract_forbids_ui_only_entitlement_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust"] !== true)
    reasons.push("execution_contract_forbids_client_paid_flag_trust_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust"] !== true)
    reasons.push("execution_contract_forbids_client_document_mode_flag_trust_false");
  if (o["paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust"] !== true)
    reasons.push("execution_contract_forbids_client_entitlement_flag_trust_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked"] !== true)
    reasons.push("execution_contract_requires_missing_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked"] !== true)
    reasons.push("execution_contract_requires_malformed_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked"] !== true)
    reasons.push("execution_contract_requires_expired_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked"] !== true)
    reasons.push("execution_contract_requires_unverifiable_entitlement_blocked_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked"] !== true)
    reasons.push("execution_contract_requires_unauthorized_document_attempt_blocked_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing"] !== true)
    reasons.push("execution_contract_requires_no_fallback_to_free_qa_document_processing_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresDenyByDefault"] !== true)
    reasons.push("execution_contract_requires_deny_by_default_false");

  // 8.5T future unauthorized response execution constraints (all true)
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_non_success_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_ok_false_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_code_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_raw_document_echo_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_translation_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_summary_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_explanation_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_legal_advice_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_deadline_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance"] !== true)
    reasons.push("execution_contract_requires_unauthorized_response_no_internal_governance_false");

  // 8.5T future lane and safety execution constraints (all true)
  if (o["paidBoundaryRuntimeExecutionContractDefinesFreeQaLane"] !== true)
    reasons.push("execution_contract_defines_free_qa_lane_false");
  if (o["paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane"] !== true)
    reasons.push("execution_contract_defines_unauthorized_document_attempt_lane_false");
  if (o["paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane"] !== true)
    reasons.push("execution_contract_defines_future_paid_document_lane_false");
  if (o["paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane"] !== true)
    reasons.push("execution_contract_defines_future_entitled_document_processing_lane_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired"] !== true)
    reasons.push("execution_contract_requires_unauthorized_lane_document_mode_required_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction"] !== true)
    reasons.push("execution_contract_requires_entitled_lane_still_subject_to_pii_redaction_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates"] !== true)
    reasons.push("execution_contract_requires_entitled_lane_still_subject_to_evidence_gates_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks"] !== true)
    reasons.push("execution_contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase"] !== true)
    reasons.push("execution_contract_requires_no_runtime_activation_this_phase_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext"] !== true)
    reasons.push("execution_contract_requires_separate_surgical_patch_next_false");
  if (o["paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch"] !== true)
    reasons.push("execution_contract_requires_post_patch_containment_audit_false");

  // 8.5T TD-005 result flags (td005PaidDocumentModeStillRequiresActualRuntimeImplementation already checked above)
  if (o["td005PaidDocumentModeBoundaryRuntimeExecutionContracted"] !== true)
    reasons.push("td005_boundary_runtime_execution_contracted_false");
  if (o["td005PaidDocumentModeStillRequiresSurgicalRoutePatch"] !== true)
    reasons.push("td005_still_requires_surgical_route_patch_false");
  if (o["td005PaidDocumentModeStillRequiresPostPatchContainmentAudit"] !== true)
    reasons.push("td005_still_requires_post_patch_containment_audit_false");

  // 8.5T new actual* assertions (all false)
  if (o["actualSmartTalkRouteModified"] !== false)
    reasons.push("actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModified"] !== false)
    reasons.push("actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentBoundaryImplemented"] !== false)
    reasons.push("actual_paid_document_boundary_implemented_must_be_false");

  // 8.5T no-prohibited-side-effect confirmations (all true — 26)
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall"] !== true)
    reasons.push("execution_contract_confirms_no_openai_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall"] !== true)
    reasons.push("execution_contract_confirms_no_fetch_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead"] !== true)
    reasons.push("execution_contract_confirms_no_process_env_read_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage"] !== true)
    reasons.push("execution_contract_confirms_no_sdk_usage_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun"] !== true)
    reasons.push("execution_contract_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("execution_contract_confirms_no_smart_talk_runtime_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport"] !== true)
    reasons.push("execution_contract_confirms_no_route_import_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation"] !== true)
    reasons.push("execution_contract_confirms_no_route_mutation_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("execution_contract_confirms_no_payment_runtime_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall"] !== true)
    reasons.push("execution_contract_confirms_no_stripe_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall"] !== true)
    reasons.push("execution_contract_confirms_no_checkout_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("execution_contract_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("execution_contract_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation"] !== true)
    reasons.push("execution_contract_confirms_no_storage_mutation_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite"] !== true)
    reasons.push("execution_contract_confirms_no_database_write_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence"] !== true)
    reasons.push("execution_contract_confirms_no_audit_persistence_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("execution_contract_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("execution_contract_confirms_no_evidence_evaluation_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization"] !== true)
    reasons.push("execution_contract_confirms_no_claim_authorization_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("execution_contract_confirms_no_deadline_calculation_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty"] !== true)
    reasons.push("execution_contract_confirms_no_legal_certainty_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild"] !== true)
    reasons.push("execution_contract_confirms_no_prompt_build_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoModelCall"] !== true)
    reasons.push("execution_contract_confirms_no_model_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("execution_contract_confirms_no_run_smart_talk_call_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification"] !== true)
    reasons.push("execution_contract_confirms_no_smart_talk_route_modification_false");
  if (o["paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("execution_contract_confirms_no_photo_route_modification_false");

  // 8.5T forward readiness
  if (o["readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch"] !== true)
    reasons.push("ready_for_8x5u_surgical_route_patch_false");
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

// ── Canonical 8.5T input ──────────────────────────────────────────────────────

function buildCanonical8x5TInput(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractInput {
  const planResult = runControlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlan();
  return {
    // 8.5S prerequisite gate — core
    prereqCheckId: planResult.checkId,
    prereqAllPassed: planResult.allPassed,
    paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan:
      planResult.paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted:
      planResult.controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted,
    paidDocumentModeBoundaryRuntimeImplementationPlanOnly:
      planResult.paidDocumentModeBoundaryRuntimeImplementationPlanOnly,
    paidDocumentModeBoundaryRuntimeImplementationPlanDefined:
      planResult.paidDocumentModeBoundaryRuntimeImplementationPlanDefined,
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

    // 8.5S future surgical target plan flags
    paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly:
      planResult.paidBoundaryRuntimeImplementationPlanTargetsSmartTalkRouteOnly,
    paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow:
      planResult.paidBoundaryRuntimeImplementationPlanDoesNotModifyRoutesNow,
    paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsPhotoRouteModification,
    paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresPhotoOcrQuarantinePreserved,
    paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresFreeQaBypassGuardPreserved,
    paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresMinimalSurgicalPatchLater,
    paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsBroadRouteRefactorLater,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsUiOnlyBoundaryLater,
    paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresServerBoundaryLater,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresSeparateAuditAfterPatch,

    // 8.5S future insertion plan flags
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryAfterJsonParse,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePromptBuild,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeModelCall,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeRunSmartTalk,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDocumentProcessing,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeStorage,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforePersistence,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeUserVisibleOutput,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeEvidenceGateRuntime,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeClaimAuthorization,
    paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresBoundaryBeforeDeadlineCalculation,

    // 8.5S future entitlement verification plan flags
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedEntitlement,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedPaidSession,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedProductOrFeature,
    paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresServerVerifiedDocumentModeAccess,
    paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsUiOnlyEntitlement,
    paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsClientPaidFlagTrust,
    paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsClientDocumentModeFlagTrust,
    paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust:
      planResult.paidBoundaryRuntimeImplementationPlanForbidsClientEntitlementFlagTrust,
    paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresMissingEntitlementBlocked,
    paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresMalformedEntitlementBlocked,
    paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresExpiredEntitlementBlocked,
    paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnverifiableEntitlementBlocked,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedDocumentAttemptBlocked,
    paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresNoFallbackToFreeQaDocumentProcessing,
    paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresDenyByDefault,

    // 8.5S future unauthorized response plan flags
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNonSuccess,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseOkFalse,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoRawDocumentEcho,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoTranslation,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoSummary,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoExplanation,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalAdvice,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoDeadline,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoLegalCertainty,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoClaimAuthorization,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedResponseNoInternalGovernance,

    // 8.5S future lane and safety plan flags
    paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane:
      planResult.paidBoundaryRuntimeImplementationPlanDefinesFreeQaLane,
    paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane:
      planResult.paidBoundaryRuntimeImplementationPlanDefinesUnauthorizedDocumentAttemptLane,
    paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane:
      planResult.paidBoundaryRuntimeImplementationPlanDefinesFuturePaidDocumentLane,
    paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane:
      planResult.paidBoundaryRuntimeImplementationPlanDefinesFutureEntitledDocumentProcessingLane,
    paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresUnauthorizedLaneDocumentModeRequired,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToPiiRedaction,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToEvidenceGates,
    paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresEntitledLaneStillSubjectToLegalSafetyBlocks,
    paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresNoRuntimeActivationThisPhase,
    paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext:
      planResult.paidBoundaryRuntimeImplementationPlanRequiresSeparateRuntimeExecutionContractNext,

    // Authorization grants
    runtimeAuthorizationGranted: planResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: planResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: planResult.productionAuthorizationGranted,
    finalAuthorizationGranted: planResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: planResult.goLiveAuthorizationGranted,

    // TD flags from 8.5S
    td001DocumentBypassGuardContainmentClosed: planResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryRuntimeImplementationPlanned:
      planResult.td005PaidDocumentModeBoundaryRuntimeImplementationPlanned,
    td005PaidDocumentModeStillRequiresRuntimeExecutionContract:
      planResult.td005PaidDocumentModeStillRequiresRuntimeExecutionContract,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation:
      planResult.td005PaidDocumentModeStillRequiresActualRuntimeImplementation,
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

    // Actual performed flags from 8.5S (22)
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
    actualPromptBuildPerformed: planResult.actualPromptBuildPerformed,
    actualModelCallPerformed: planResult.actualModelCallPerformed,
    actualRunSmartTalkCalled: planResult.actualRunSmartTalkCalled,

    // paidBoundaryRuntimeImplementationPlanConfirms* (24)
    paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoOpenAiCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoFetchCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoProcessEnvRead,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoSdkUsage,
    paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNo8x3AcRerun,
    paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoSmartTalkRuntimeCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoRouteImport,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoRouteMutation,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoPaymentRuntimeCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoStripeCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoCheckoutCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoEntitlementRuntimeCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoOcrRuntimeCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoStorageMutation,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoDatabaseWrite,
    paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoAuditPersistence,
    paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoUserVisibleDocumentExplanation,
    paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoEvidenceEvaluation,
    paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoClaimAuthorization,
    paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoDeadlineCalculation,
    paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoLegalCertainty,
    paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoPromptBuild,
    paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoModelCall,
    paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall:
      planResult.paidBoundaryRuntimeImplementationPlanConfirmsNoRunSmartTalkCall,

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

    // 8.5S forward readiness gate
    readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract:
      planResult.readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract,

    // 8.5T future route execution constraints
    paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: true,
    paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: true,
    paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: true,
    paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: true,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: true,
    paidBoundaryRuntimeExecutionContractRequiresServerBoundary: true,
    paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: true,
    paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: true,

    // 8.5T future insertion execution constraints
    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: true,

    // 8.5T future entitlement execution constraints
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: true,
    paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: true,

    // 8.5T future unauthorized response execution constraints
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: true,

    // 8.5T future lane and safety execution constraints
    paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: true,
    paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: true,
    paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: true,
    paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: true,

    // 8.5T TD-005 result flags (td005PaidDocumentModeStillRequiresActualRuntimeImplementation already set above)
    td005PaidDocumentModeBoundaryRuntimeExecutionContracted: true,
    td005PaidDocumentModeStillRequiresSurgicalRoutePatch: true,
    td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: true,

    // 8.5T new actual* assertions
    actualSmartTalkRouteModified: false,
    actualPhotoRouteModified: false,
    actualPaidDocumentBoundaryImplemented: false,

    // 8.5T no-prohibited-side-effect confirmations
    paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: true,

    // 8.5T forward readiness
    readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: true,
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
  const base = buildCanonical8x5TInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateBoundaryRuntimeExecutionContractInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5S prerequisite gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5R" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("implementation_plan_ready_flag_false",
    { paidDocumentModeBoundaryRuntimeContractReadyForImplementationPlan: false });
  expect_rejected("implementation_plan_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryRuntimeImplementationPlanAccepted: false });
  expect_rejected("implementation_plan_only_false",
    { paidDocumentModeBoundaryRuntimeImplementationPlanOnly: false });
  expect_rejected("implementation_plan_defined_false",
    { paidDocumentModeBoundaryRuntimeImplementationPlanDefined: false });
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

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_runtime_implementation_planned_false",
    { td005PaidDocumentModeBoundaryRuntimeImplementationPlanned: false });
  expect_rejected("td005_still_requires_runtime_execution_contract_false",
    { td005PaidDocumentModeStillRequiresRuntimeExecutionContract: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementation: false });
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

  // Actual performed flags from 8.5S (all false — 22)
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
  expect_rejected("actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });

  // paidBoundaryRuntimeImplementationPlanConfirms* (all true — 24)
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

  // Pipeline executed flags
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true", { runtimePipelineActuallyExecuted: true });
  expect_rejected("document_pipeline_actually_executed_true",
    { documentPipelineActuallyExecuted: true });
  expect_rejected("payment_pipeline_actually_executed_true", { paymentPipelineActuallyExecuted: true });
  expect_rejected("entitlement_pipeline_actually_executed_true",
    { entitlementPipelineActuallyExecuted: true });
  expect_rejected("checkout_pipeline_actually_executed_true", { checkoutPipelineActuallyExecuted: true });
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

  // 8.5S forward readiness gate
  expect_rejected("ready_for_8x5t_runtime_execution_contract_false",
    { readyFor8x5TPaidDocumentModeBoundaryRuntimeExecutionContract: false });
  expect_rejected("ready_for_separate_runtime_authorization_true_in_prereq",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_pilot_authorization_true_in_prereq",
    { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("ready_for_production_authorization_true_in_prereq",
    { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true_in_prereq", { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true_in_prereq", { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true_in_prereq", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true_in_prereq", { persistenceUsed: true });
  expect_rejected("never_user_visible_false_in_prereq", { neverUserVisible: false });

  // 8.5T future route execution constraints
  expect_rejected("execution_contract_targets_smart_talk_route_only_false",
    { paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: false });
  expect_rejected("execution_contract_forbids_photo_route_modification_false",
    { paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: false });
  expect_rejected("execution_contract_requires_photo_ocr_quarantine_preserved_false",
    { paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: false });
  expect_rejected("execution_contract_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("execution_contract_requires_minimal_surgical_patch_false",
    { paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: false });
  expect_rejected("execution_contract_forbids_broad_route_refactor_false",
    { paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: false });
  expect_rejected("execution_contract_forbids_ui_only_boundary_false",
    { paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: false });
  expect_rejected("execution_contract_requires_server_boundary_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerBoundary: false });
  expect_rejected("execution_contract_requires_patch_after_body_validation_false",
    { paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: false });
  expect_rejected("execution_contract_requires_separate_post_patch_audit_false",
    { paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: false });

  // 8.5T future insertion execution constraints
  expect_rejected("execution_contract_requires_boundary_after_json_parse_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: false });
  expect_rejected("execution_contract_requires_boundary_after_text_validation_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: false });
  expect_rejected("execution_contract_requires_boundary_before_prompt_build_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("execution_contract_requires_boundary_before_model_call_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: false });
  expect_rejected("execution_contract_requires_boundary_before_run_smart_talk_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: false });
  expect_rejected("execution_contract_requires_boundary_before_document_processing_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: false });
  expect_rejected("execution_contract_requires_boundary_before_storage_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: false });
  expect_rejected("execution_contract_requires_boundary_before_persistence_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: false });
  expect_rejected("execution_contract_requires_boundary_before_user_visible_output_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("execution_contract_requires_boundary_before_evidence_gate_runtime_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: false });
  expect_rejected("execution_contract_requires_boundary_before_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: false });
  expect_rejected("execution_contract_requires_boundary_before_deadline_calculation_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: false });

  // 8.5T future entitlement execution constraints
  expect_rejected("execution_contract_requires_server_verified_entitlement_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: false });
  expect_rejected("execution_contract_requires_server_verified_paid_session_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: false });
  expect_rejected("execution_contract_requires_server_verified_product_or_feature_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("execution_contract_requires_server_verified_document_mode_access_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("execution_contract_forbids_ui_only_entitlement_false",
    { paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: false });
  expect_rejected("execution_contract_forbids_client_paid_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: false });
  expect_rejected("execution_contract_forbids_client_document_mode_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: false });
  expect_rejected("execution_contract_forbids_client_entitlement_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: false });
  expect_rejected("execution_contract_requires_missing_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: false });
  expect_rejected("execution_contract_requires_malformed_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: false });
  expect_rejected("execution_contract_requires_expired_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: false });
  expect_rejected("execution_contract_requires_unverifiable_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: false });
  expect_rejected("execution_contract_requires_unauthorized_document_attempt_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: false });
  expect_rejected("execution_contract_requires_no_fallback_to_free_qa_document_processing_false",
    { paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: false });
  expect_rejected("execution_contract_requires_deny_by_default_false",
    { paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: false });

  // 8.5T future unauthorized response execution constraints
  expect_rejected("execution_contract_requires_unauthorized_response_non_success_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: false });
  expect_rejected("execution_contract_requires_unauthorized_response_ok_false_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: false });
  expect_rejected("execution_contract_requires_unauthorized_response_code_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_raw_document_echo_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_translation_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_summary_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_explanation_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_legal_advice_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_deadline_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_legal_certainty_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("execution_contract_requires_unauthorized_response_no_internal_governance_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: false });

  // 8.5T future lane and safety execution constraints
  expect_rejected("execution_contract_defines_free_qa_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: false });
  expect_rejected("execution_contract_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("execution_contract_defines_future_paid_document_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: false });
  expect_rejected("execution_contract_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("execution_contract_requires_unauthorized_lane_document_mode_required_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: false });
  expect_rejected("execution_contract_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("execution_contract_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("execution_contract_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("execution_contract_requires_no_runtime_activation_this_phase_false",
    { paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: false });
  expect_rejected("execution_contract_requires_separate_surgical_patch_next_false",
    { paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: false });
  expect_rejected("execution_contract_requires_post_patch_containment_audit_false",
    { paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: false });

  // 8.5T TD-005 result flags
  expect_rejected("td005_boundary_runtime_execution_contracted_false",
    { td005PaidDocumentModeBoundaryRuntimeExecutionContracted: false });
  expect_rejected("td005_still_requires_surgical_route_patch_false",
    { td005PaidDocumentModeStillRequiresSurgicalRoutePatch: false });
  expect_rejected("td005_still_requires_post_patch_containment_audit_false",
    { td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementation: false });
  expect_rejected("td004_false_in_result", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_false_in_result",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // 8.5T new actual* assertions (all false)
  expect_rejected("actual_smart_talk_route_modified_true", { actualSmartTalkRouteModified: true });
  expect_rejected("actual_photo_route_modified_true", { actualPhotoRouteModified: true });
  expect_rejected("actual_paid_document_boundary_implemented_true",
    { actualPaidDocumentBoundaryImplemented: true });

  // 8.5T no-prohibited-side-effect confirmations (all true — 26)
  expect_rejected("execution_contract_confirms_no_openai_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: false });
  expect_rejected("execution_contract_confirms_no_fetch_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: false });
  expect_rejected("execution_contract_confirms_no_process_env_read_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: false });
  expect_rejected("execution_contract_confirms_no_sdk_usage_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: false });
  expect_rejected("execution_contract_confirms_no_8x3ac_rerun_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: false });
  expect_rejected("execution_contract_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("execution_contract_confirms_no_route_import_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: false });
  expect_rejected("execution_contract_confirms_no_route_mutation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: false });
  expect_rejected("execution_contract_confirms_no_payment_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("execution_contract_confirms_no_stripe_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: false });
  expect_rejected("execution_contract_confirms_no_checkout_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: false });
  expect_rejected("execution_contract_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("execution_contract_confirms_no_ocr_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: false });
  expect_rejected("execution_contract_confirms_no_storage_mutation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: false });
  expect_rejected("execution_contract_confirms_no_database_write_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: false });
  expect_rejected("execution_contract_confirms_no_audit_persistence_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: false });
  expect_rejected("execution_contract_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("execution_contract_confirms_no_evidence_evaluation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: false });
  expect_rejected("execution_contract_confirms_no_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: false });
  expect_rejected("execution_contract_confirms_no_deadline_calculation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: false });
  expect_rejected("execution_contract_confirms_no_legal_certainty_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: false });
  expect_rejected("execution_contract_confirms_no_prompt_build_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: false });
  expect_rejected("execution_contract_confirms_no_model_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: false });
  expect_rejected("execution_contract_confirms_no_run_smart_talk_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: false });
  expect_rejected("execution_contract_confirms_no_smart_talk_route_modification_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: false });
  expect_rejected("execution_contract_confirms_no_photo_route_modification_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: false });

  // 8.5T forward readiness
  expect_rejected("ready_for_8x5u_surgical_route_patch_false",
    { readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: false });
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

export function runControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContract(): ControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractResult {
  const canonical = buildCanonical8x5TInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateBoundaryRuntimeExecutionContractInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5T",
    allPassed,
    paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract: true,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted: allPassed,
    paidDocumentModeBoundaryRuntimeExecutionContractOnly: true,
    paidDocumentModeBoundaryRuntimeExecutionContractDefined: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: true,
    paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: true,
    paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: true,
    paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: true,
    paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: true,
    paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: true,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: true,
    paidBoundaryRuntimeExecutionContractRequiresServerBoundary: true,
    paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: true,
    paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: true,

    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: true,

    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: true,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: true,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: true,
    paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: true,
    paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: true,
    paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: true,
    paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: true,
    paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: true,
    paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: true,

    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: true,

    paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: true,
    paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: true,
    paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: true,
    paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: true,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: true,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: true,
    paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: true,
    paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: true,
    paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: true,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundaryRuntimeExecutionContracted: true,
    td005PaidDocumentModeStillRequiresSurgicalRoutePatch: true,
    td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: true,
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
    actualSmartTalkRouteModified: false,
    actualPhotoRouteModified: false,
    actualPaidDocumentBoundaryImplemented: false,
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

    paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: true,
    paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: true,
    paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: true,

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

    readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5T is a controlled real-document Paid Document Mode Boundary Runtime Execution Contract.",
      "8.5T depends on completed 8.5S Paid Document Mode Boundary Runtime Implementation Plan.",
      "8.5T is runtime-execution-contract-only.",
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
      "Future surgical route patch must be minimal and target /api/smart-talk only.",
      "Future surgical route patch must preserve 8.5N Free Q&A bypass guard.",
      "Future surgical route patch must preserve 8.5H photo OCR quarantine.",
      "Future runtime must deny by default without server-verified entitlement.",
      "UI-only and client-provided paid/document/entitlement flags must not be trusted.",
      "Future entitled lane still requires PII redaction, Evidence Gates, and legal safety blocks.",
      "TD-005 is now runtime-execution-contracted but still requires surgical route patch and post-patch containment audit.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5U Paid Document Mode Boundary Surgical Route Patch.",
      "readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch is planning readiness only, not public runtime authorization.",
    ],
  };
}
