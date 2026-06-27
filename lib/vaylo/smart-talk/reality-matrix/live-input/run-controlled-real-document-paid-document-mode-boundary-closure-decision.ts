/**
 * Phase 8.5W — Controlled Real Document Paid Document Mode Boundary
 * Closure Decision.
 *
 * CLOSURE-DECISION-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.5V.
 *
 * This phase formally closes TD-005 containment/boundary work for the
 * client-side paid/document/entitlement flag bypass. It does NOT authorize
 * or implement actual Paid Document Mode runtime, payment, entitlement,
 * document processing, or any public runtime.
 *
 * This file does NOT:
 *   - Modify any route file.
 *   - Call OpenAI, fetch, runSmartTalk, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import live route, payment, Stripe, checkout, or entitlement modules.
 *   - Import route handlers or read the filesystem.
 *   - Implement server entitlement verification or Paid Document Mode runtime.
 *   - Build prompts or call models.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAudit } from "./run-controlled-real-document-paid-document-mode-boundary-post-patch-containment-audit";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryClosureDecisionInput {
  // 8.5V prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted: boolean;
  readonly paidDocumentModeBoundaryPostPatchContainmentAudited: boolean;
  readonly paidDocumentModeBoundaryPostPatchContainmentAuditOnly: boolean;
  readonly paidDocumentModeBoundaryContainmentConfirmed: boolean;
  readonly paidDocumentModeBoundaryDenyByDefaultConfirmed: boolean;
  readonly paidDocumentModeBoundaryClientFlagBypassBlocked: boolean;
  readonly paidDocumentModeBoundaryServerEntitlementStillRequired: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;
  readonly prereqTamperCasesRejected: boolean;

  // 8.5V post-patch containment confirmations (all true)
  readonly postPatchSmartTalkRouteContainsDenyBoundary: boolean;
  readonly postPatchDenyBoundaryBeforeRunSmartTalk: boolean;
  readonly postPatchDenyBoundaryAfterJsonParse: boolean;
  readonly postPatchDenyBoundaryAfterTextValidation: boolean;
  readonly postPatchDenyBoundaryBeforePromptBuild: boolean;
  readonly postPatchDenyBoundaryBeforeModelCall: boolean;
  readonly postPatchDenyBoundaryBeforeDocumentProcessing: boolean;
  readonly postPatchDenyBoundaryBeforeStorage: boolean;
  readonly postPatchDenyBoundaryBeforePersistence: boolean;
  readonly postPatchDenyBoundaryBeforeUserVisibleOutput: boolean;
  readonly postPatchDenyBoundaryRejectsClientDocumentModeFlag: boolean;
  readonly postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag: boolean;
  readonly postPatchDenyBoundaryRejectsClientEntitlementFlag: boolean;
  readonly postPatchDenyBoundaryRejectsClientPaidFlag: boolean;
  readonly postPatchDenyBoundaryDoesNotTrustClientFlags: boolean;
  readonly postPatchDenyBoundaryDoesNotCreateEntitledLane: boolean;
  readonly postPatchDenyBoundaryDoesNotCreatePaymentLane: boolean;
  readonly postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane: boolean;
  readonly postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane: boolean;
  readonly postPatchDenyBoundaryUsesDocumentModeRequiredCode: boolean;
  readonly postPatchDenyBoundaryReturnsOkFalse: boolean;
  readonly postPatchDenyBoundaryReturnsNonSuccessStatus: boolean;
  readonly postPatchDenyBoundaryDoesNotEchoRawDocument: boolean;
  readonly postPatchDenyBoundaryDoesNotSummarizeDocument: boolean;
  readonly postPatchDenyBoundaryDoesNotTranslateDocument: boolean;
  readonly postPatchDenyBoundaryDoesNotExplainDocument: boolean;
  readonly postPatchDenyBoundaryDoesNotGiveLegalAdvice: boolean;
  readonly postPatchDenyBoundaryDoesNotCalculateDeadline: boolean;
  readonly postPatchDenyBoundaryDoesNotExposeInternalGovernance: boolean;

  // 8.5V preservation confirmations (all true)
  readonly postPatchFreeQaLanePreserved: boolean;
  readonly postPatchGeneralQuestionsPreserved: boolean;
  readonly postPatch8x5NDocumentBypassGuardPreserved: boolean;
  readonly postPatchDocumentLikeTextBlockingPreserved: boolean;
  readonly postPatchDocumentModeRequiredResponsePreserved: boolean;
  readonly postPatch8x5HPhotoOcrQuarantinePreserved: boolean;
  readonly postPatchPhotoRouteUnmodified: boolean;
  readonly postPatchNoPhotoRuntimeEnabled: boolean;
  readonly postPatchNoOcrRuntimeEnabled: boolean;
  readonly postPatchNoFileRuntimeEnabled: boolean;
  readonly postPatchNoStorageEnabled: boolean;
  readonly postPatchNoPersistenceEnabled: boolean;
  readonly postPatchNoPublicDocumentRuntimeEnabled: boolean;

  // 8.5V actual mutation/runtime flags
  readonly actualPostPatchAuditOnly: boolean;
  readonly actualLiveRouteMutationPerformedInThisPhase: boolean;
  readonly actualSmartTalkRouteModifiedInThisPhase: boolean;
  readonly actualPhotoRouteModifiedInThisPhase: boolean;
  readonly actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: boolean;
  readonly actualPaidDocumentBoundaryImplementedInThisPhase: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPaymentRuntimeImplemented: boolean;
  readonly actualCheckoutImplemented: boolean;
  readonly actualEntitlementRuntimeImplemented: boolean;
  readonly actualServerEntitlementVerificationImplemented: boolean;
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

  // 8.5V no-prohibited-side-effect confirmations (all true)
  readonly postPatchAuditConfirmsNoOpenAiCall: boolean;
  readonly postPatchAuditConfirmsNoFetchCall: boolean;
  readonly postPatchAuditConfirmsNoProcessEnvRead: boolean;
  readonly postPatchAuditConfirmsNoSdkUsage: boolean;
  readonly postPatchAuditConfirmsNo8x3AcRerun: boolean;
  readonly postPatchAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly postPatchAuditConfirmsNoStripeCall: boolean;
  readonly postPatchAuditConfirmsNoCheckoutCall: boolean;
  readonly postPatchAuditConfirmsNoEntitlementRuntimeCall: boolean;
  readonly postPatchAuditConfirmsNoServerEntitlementVerification: boolean;
  readonly postPatchAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly postPatchAuditConfirmsNoStorageMutation: boolean;
  readonly postPatchAuditConfirmsNoDatabaseWrite: boolean;
  readonly postPatchAuditConfirmsNoAuditPersistence: boolean;
  readonly postPatchAuditConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly postPatchAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly postPatchAuditConfirmsNoClaimAuthorization: boolean;
  readonly postPatchAuditConfirmsNoDeadlineCalculation: boolean;
  readonly postPatchAuditConfirmsNoLegalCertainty: boolean;
  readonly postPatchAuditConfirmsNoPromptBuild: boolean;
  readonly postPatchAuditConfirmsNoModelCall: boolean;
  readonly postPatchAuditConfirmsNoRunSmartTalkCall: boolean;
  readonly postPatchAuditConfirmsNoRouteHandlerCall: boolean;
  readonly postPatchAuditConfirmsNoRouteImport: boolean;
  readonly postPatchAuditConfirmsNoFilesystemRead: boolean;
  readonly postPatchAuditConfirmsNoPhotoRouteModification: boolean;

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

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // TD flags from 8.5V result
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly td005PaidDocumentModeBoundaryPostPatchContainmentAudited: boolean;
  readonly td005PaidDocumentModeBoundaryContainmentConfirmed: boolean;
  readonly td005PaidDocumentModeReadyForClosureDecision: boolean;
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

  // 8.5V forward readiness gate
  readonly readyFor8x5WPaidDocumentModeBoundaryClosureDecision: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5W core assertion flags
  readonly paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: boolean;
  readonly paidDocumentModeBoundaryClosureDecisionOnly: boolean;
  readonly paidDocumentModeBoundaryContainmentClosed: boolean;
  readonly paidDocumentModeBoundaryClientFlagBypassClosed: boolean;
  readonly paidDocumentModeBoundaryDenyByDefaultClosed: boolean;
  readonly paidDocumentModeBoundaryServerEntitlementRequirementPreserved: boolean;
  readonly paidDocumentModeBoundaryActualRuntimeStillDeferred: boolean;
  readonly paidDocumentModeRuntimeStillNotImplementedW: boolean;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplementedW: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorizedW: boolean;

  // 8.5W closure decision fields (all true)
  readonly closureDecisionTd005ContainmentClosed: boolean;
  readonly closureDecisionTd005ClientFlagBypassClosed: boolean;
  readonly closureDecisionTd005BoundaryPatchAccepted: boolean;
  readonly closureDecisionTd005PostPatchAuditAccepted: boolean;
  readonly closureDecisionTd005RuntimeImplementationDeferred: boolean;
  readonly closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizePaymentRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeCheckoutRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeEntitlementRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeServerEntitlementVerification: boolean;
  readonly closureDecisionDoesNotAuthorizeDocumentProcessing: boolean;
  readonly closureDecisionDoesNotAuthorizeOcrRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeFileRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeStorage: boolean;
  readonly closureDecisionDoesNotAuthorizePersistence: boolean;
  readonly closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: boolean;
  readonly closureDecisionDoesNotAuthorizePublicRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizePilotRuntime: boolean;
  readonly closureDecisionDoesNotAuthorizeProductionRuntime: boolean;
  readonly closureDecisionRequiresFutureActualRuntimeImplementation: boolean;
  readonly closureDecisionRequiresFuturePreModelPiiRedaction: boolean;
  readonly closureDecisionRequiresFutureEvidenceGatesProductionWiring: boolean;
  readonly closureDecisionRequiresFutureServerEntitlementVerification: boolean;
  readonly closureDecisionRequiresFutureUserVisibleOutputContract: boolean;
  readonly closureDecisionRequiresFuturePilotAuthorization: boolean;

  // 8.5W containment closure confirmations (all true)
  readonly containmentClosure8x5UDenyBoundaryAccepted: boolean;
  readonly containmentClosure8x5VAuditAccepted: boolean;
  readonly containmentClosureSmartTalkRouteDenyBoundaryConfirmed: boolean;
  readonly containmentClosureBoundaryBeforeRunSmartTalkConfirmed: boolean;
  readonly containmentClosureBoundaryAfterJsonParseConfirmed: boolean;
  readonly containmentClosureBoundaryAfterTextValidationConfirmed: boolean;
  readonly containmentClosureFreeQaLanePreserved: boolean;
  readonly containmentClosureGeneralQuestionsPreserved: boolean;
  readonly containmentClosure8x5NDocumentBypassGuardPreserved: boolean;
  readonly containmentClosureDocumentLikeTextBlockingPreserved: boolean;
  readonly containmentClosure8x5HPhotoOcrQuarantinePreserved: boolean;
  readonly containmentClosurePhotoRouteUnmodified: boolean;
  readonly containmentClosureNoPhotoRuntimeEnabled: boolean;
  readonly containmentClosureNoOcrRuntimeEnabled: boolean;
  readonly containmentClosureNoFileRuntimeEnabled: boolean;
  readonly containmentClosureNoStorageEnabled: boolean;
  readonly containmentClosureNoPersistenceEnabled: boolean;
  readonly containmentClosureNoPublicDocumentRuntimeEnabled: boolean;
  readonly containmentClosureClientFlagsRemainUntrusted: boolean;
  readonly containmentClosureNoEntitledLaneCreated: boolean;
  readonly containmentClosureNoPaymentLaneCreated: boolean;
  readonly containmentClosureNoDocumentProcessingLaneCreated: boolean;
  readonly containmentClosureNoUserVisibleDocumentLaneCreated: boolean;

  // 8.5W actual mutation/runtime flags
  readonly actualClosureDecisionOnly: boolean;
  readonly actualLiveRouteMutationPerformedInThisPhaseW: boolean;
  readonly actualSmartTalkRouteModifiedInThisPhaseW: boolean;
  readonly actualPhotoRouteModifiedInThisPhaseW: boolean;
  readonly actualPaidDocumentBoundaryAlreadyImplementedBy8x5UW: boolean;
  readonly actualPaidDocumentBoundaryImplementedInThisPhaseW: boolean;

  // 8.5W no-prohibited-side-effect confirmations (all true)
  readonly closureDecisionConfirmsNoOpenAiCall: boolean;
  readonly closureDecisionConfirmsNoFetchCall: boolean;
  readonly closureDecisionConfirmsNoProcessEnvRead: boolean;
  readonly closureDecisionConfirmsNoSdkUsage: boolean;
  readonly closureDecisionConfirmsNo8x3AcRerun: boolean;
  readonly closureDecisionConfirmsNoPaymentRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoStripeCall: boolean;
  readonly closureDecisionConfirmsNoCheckoutCall: boolean;
  readonly closureDecisionConfirmsNoEntitlementRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoServerEntitlementVerification: boolean;
  readonly closureDecisionConfirmsNoOcrRuntimeCall: boolean;
  readonly closureDecisionConfirmsNoStorageMutation: boolean;
  readonly closureDecisionConfirmsNoDatabaseWrite: boolean;
  readonly closureDecisionConfirmsNoAuditPersistence: boolean;
  readonly closureDecisionConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly closureDecisionConfirmsNoEvidenceEvaluation: boolean;
  readonly closureDecisionConfirmsNoClaimAuthorization: boolean;
  readonly closureDecisionConfirmsNoDeadlineCalculation: boolean;
  readonly closureDecisionConfirmsNoLegalCertainty: boolean;
  readonly closureDecisionConfirmsNoPromptBuild: boolean;
  readonly closureDecisionConfirmsNoModelCall: boolean;
  readonly closureDecisionConfirmsNoRunSmartTalkCall: boolean;
  readonly closureDecisionConfirmsNoRouteHandlerCall: boolean;
  readonly closureDecisionConfirmsNoRouteImport: boolean;
  readonly closureDecisionConfirmsNoFilesystemRead: boolean;
  readonly closureDecisionConfirmsNoPhotoRouteModification: boolean;

  // 8.5W TD result flags
  readonly td005PaidDocumentModeBoundaryContainmentClosedResult: boolean;
  readonly td005PaidDocumentModeClientFlagBypassClosedResult: boolean;
  readonly td005PaidDocumentModeActualRuntimeImplementationDeferredResult: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: boolean;

  // 8.5W forward readiness
  readonly readyForPreModelPiiRedactionPhase: boolean;
  readonly readyForEvidenceGatesProductionWiringPhase: boolean;
  readonly readyForServerEntitlementVerificationPhase: boolean;
  readonly readyForPaidDocumentModeActualRuntimeImplementationPhase: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhaseResult: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhaseResult: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhaseResult: boolean;
  readonly readyForRealDocumentInputResult: boolean;
  readonly readyForUserVisibleOutputResult: boolean;
  readonly publicRuntimeEnabledResult: boolean;
  readonly persistenceUsedResult: boolean;
  readonly neverUserVisibleResult: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPaidDocumentModeBoundaryClosureDecisionResult {
  readonly checkId: "8.5W";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: true;
  readonly controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted: boolean;
  readonly paidDocumentModeBoundaryClosureDecisionOnly: true;
  readonly paidDocumentModeBoundaryContainmentClosed: true;
  readonly paidDocumentModeBoundaryClientFlagBypassClosed: true;
  readonly paidDocumentModeBoundaryDenyByDefaultClosed: true;
  readonly paidDocumentModeBoundaryServerEntitlementRequirementPreserved: true;
  readonly paidDocumentModeBoundaryActualRuntimeStillDeferred: true;
  readonly paidDocumentModeRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Closure decision
  readonly closureDecisionTd005ContainmentClosed: true;
  readonly closureDecisionTd005ClientFlagBypassClosed: true;
  readonly closureDecisionTd005BoundaryPatchAccepted: true;
  readonly closureDecisionTd005PostPatchAuditAccepted: true;
  readonly closureDecisionTd005RuntimeImplementationDeferred: true;
  readonly closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: true;
  readonly closureDecisionDoesNotAuthorizePaymentRuntime: true;
  readonly closureDecisionDoesNotAuthorizeCheckoutRuntime: true;
  readonly closureDecisionDoesNotAuthorizeEntitlementRuntime: true;
  readonly closureDecisionDoesNotAuthorizeServerEntitlementVerification: true;
  readonly closureDecisionDoesNotAuthorizeDocumentProcessing: true;
  readonly closureDecisionDoesNotAuthorizeOcrRuntime: true;
  readonly closureDecisionDoesNotAuthorizeFileRuntime: true;
  readonly closureDecisionDoesNotAuthorizeStorage: true;
  readonly closureDecisionDoesNotAuthorizePersistence: true;
  readonly closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: true;
  readonly closureDecisionDoesNotAuthorizePublicRuntime: true;
  readonly closureDecisionDoesNotAuthorizePilotRuntime: true;
  readonly closureDecisionDoesNotAuthorizeProductionRuntime: true;
  readonly closureDecisionRequiresFutureActualRuntimeImplementation: true;
  readonly closureDecisionRequiresFuturePreModelPiiRedaction: true;
  readonly closureDecisionRequiresFutureEvidenceGatesProductionWiring: true;
  readonly closureDecisionRequiresFutureServerEntitlementVerification: true;
  readonly closureDecisionRequiresFutureUserVisibleOutputContract: true;
  readonly closureDecisionRequiresFuturePilotAuthorization: true;

  // Containment closure confirmations
  readonly containmentClosure8x5UDenyBoundaryAccepted: true;
  readonly containmentClosure8x5VAuditAccepted: true;
  readonly containmentClosureSmartTalkRouteDenyBoundaryConfirmed: true;
  readonly containmentClosureBoundaryBeforeRunSmartTalkConfirmed: true;
  readonly containmentClosureBoundaryAfterJsonParseConfirmed: true;
  readonly containmentClosureBoundaryAfterTextValidationConfirmed: true;
  readonly containmentClosureFreeQaLanePreserved: true;
  readonly containmentClosureGeneralQuestionsPreserved: true;
  readonly containmentClosure8x5NDocumentBypassGuardPreserved: true;
  readonly containmentClosureDocumentLikeTextBlockingPreserved: true;
  readonly containmentClosure8x5HPhotoOcrQuarantinePreserved: true;
  readonly containmentClosurePhotoRouteUnmodified: true;
  readonly containmentClosureNoPhotoRuntimeEnabled: true;
  readonly containmentClosureNoOcrRuntimeEnabled: true;
  readonly containmentClosureNoFileRuntimeEnabled: true;
  readonly containmentClosureNoStorageEnabled: true;
  readonly containmentClosureNoPersistenceEnabled: true;
  readonly containmentClosureNoPublicDocumentRuntimeEnabled: true;
  readonly containmentClosureClientFlagsRemainUntrusted: true;
  readonly containmentClosureNoEntitledLaneCreated: true;
  readonly containmentClosureNoPaymentLaneCreated: true;
  readonly containmentClosureNoDocumentProcessingLaneCreated: true;
  readonly containmentClosureNoUserVisibleDocumentLaneCreated: true;

  // Actual mutation/runtime flags
  readonly actualClosureDecisionOnly: true;
  readonly actualLiveRouteMutationPerformedInThisPhase: false;
  readonly actualSmartTalkRouteModifiedInThisPhase: false;
  readonly actualPhotoRouteModifiedInThisPhase: false;
  readonly actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: true;
  readonly actualPaidDocumentBoundaryImplementedInThisPhase: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPaymentRuntimeImplemented: false;
  readonly actualCheckoutImplemented: false;
  readonly actualEntitlementRuntimeImplemented: false;
  readonly actualServerEntitlementVerificationImplemented: false;
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

  // No-prohibited-side-effect confirmations
  readonly closureDecisionConfirmsNoOpenAiCall: true;
  readonly closureDecisionConfirmsNoFetchCall: true;
  readonly closureDecisionConfirmsNoProcessEnvRead: true;
  readonly closureDecisionConfirmsNoSdkUsage: true;
  readonly closureDecisionConfirmsNo8x3AcRerun: true;
  readonly closureDecisionConfirmsNoPaymentRuntimeCall: true;
  readonly closureDecisionConfirmsNoStripeCall: true;
  readonly closureDecisionConfirmsNoCheckoutCall: true;
  readonly closureDecisionConfirmsNoEntitlementRuntimeCall: true;
  readonly closureDecisionConfirmsNoServerEntitlementVerification: true;
  readonly closureDecisionConfirmsNoOcrRuntimeCall: true;
  readonly closureDecisionConfirmsNoStorageMutation: true;
  readonly closureDecisionConfirmsNoDatabaseWrite: true;
  readonly closureDecisionConfirmsNoAuditPersistence: true;
  readonly closureDecisionConfirmsNoUserVisibleDocumentExplanation: true;
  readonly closureDecisionConfirmsNoEvidenceEvaluation: true;
  readonly closureDecisionConfirmsNoClaimAuthorization: true;
  readonly closureDecisionConfirmsNoDeadlineCalculation: true;
  readonly closureDecisionConfirmsNoLegalCertainty: true;
  readonly closureDecisionConfirmsNoPromptBuild: true;
  readonly closureDecisionConfirmsNoModelCall: true;
  readonly closureDecisionConfirmsNoRunSmartTalkCall: true;
  readonly closureDecisionConfirmsNoRouteHandlerCall: true;
  readonly closureDecisionConfirmsNoRouteImport: true;
  readonly closureDecisionConfirmsNoFilesystemRead: true;
  readonly closureDecisionConfirmsNoPhotoRouteModification: true;

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

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  // Debt status
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: true;
  readonly td005PaidDocumentModeBoundaryPostPatchContainmentAudited: true;
  readonly td005PaidDocumentModeBoundaryContainmentClosed: true;
  readonly td005PaidDocumentModeClientFlagBypassClosed: true;
  readonly td005PaidDocumentModeActualRuntimeImplementationDeferred: true;
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

  // Forward readiness
  readonly readyForPreModelPiiRedactionPhase: true;
  readonly readyForEvidenceGatesProductionWiringPhase: false;
  readonly readyForServerEntitlementVerificationPhase: false;
  readonly readyForPaidDocumentModeActualRuntimeImplementationPhase: false;
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

function validateClosureDecisionInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5V prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5V") reasons.push("prereq_check_id_must_be_8x5V");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit"] !== true)
    reasons.push("surgical_route_patch_ready_for_post_patch_audit_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted"] !== true)
    reasons.push("post_patch_containment_audit_not_accepted");
  if (o["paidDocumentModeBoundaryPostPatchContainmentAudited"] !== true)
    reasons.push("post_patch_containment_audited_false");
  if (o["paidDocumentModeBoundaryPostPatchContainmentAuditOnly"] !== true)
    reasons.push("post_patch_containment_audit_only_false");
  if (o["paidDocumentModeBoundaryContainmentConfirmed"] !== true)
    reasons.push("boundary_containment_confirmed_false");
  if (o["paidDocumentModeBoundaryDenyByDefaultConfirmed"] !== true)
    reasons.push("boundary_deny_by_default_confirmed_false");
  if (o["paidDocumentModeBoundaryClientFlagBypassBlocked"] !== true)
    reasons.push("boundary_client_flag_bypass_blocked_false");
  if (o["paidDocumentModeBoundaryServerEntitlementStillRequired"] !== true)
    reasons.push("boundary_server_entitlement_still_required_false");
  if (o["paidDocumentModeBoundaryRuntimeStillNotImplemented"] !== true)
    reasons.push("boundary_runtime_still_not_implemented_false");
  if (o["paidDocumentModePaymentRuntimeStillNotImplemented"] !== true)
    reasons.push("payment_runtime_still_not_implemented_false");
  if (o["paidDocumentModeCheckoutRuntimeStillNotImplemented"] !== true)
    reasons.push("checkout_runtime_still_not_implemented_false");
  if (o["paidDocumentModeEntitlementRuntimeStillNotImplemented"] !== true)
    reasons.push("entitlement_runtime_still_not_implemented_false");
  if (o["paidDocumentModeServerEntitlementVerificationStillNotImplemented"] !== true)
    reasons.push("server_entitlement_verification_still_not_implemented_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorized"] !== true)
    reasons.push("document_processing_still_not_authorized_false");
  if (o["paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized"] !== true)
    reasons.push("user_visible_document_explanation_still_not_authorized_false");
  if (o["prereqTamperCasesRejected"] !== true)
    reasons.push("prereq_tamper_cases_rejected_false");

  // 8.5V post-patch containment confirmations (all true)
  if (o["postPatchSmartTalkRouteContainsDenyBoundary"] !== true)
    reasons.push("post_patch_smart_talk_route_contains_deny_boundary_false");
  if (o["postPatchDenyBoundaryBeforeRunSmartTalk"] !== true)
    reasons.push("post_patch_deny_boundary_before_run_smart_talk_false");
  if (o["postPatchDenyBoundaryAfterJsonParse"] !== true)
    reasons.push("post_patch_deny_boundary_after_json_parse_false");
  if (o["postPatchDenyBoundaryAfterTextValidation"] !== true)
    reasons.push("post_patch_deny_boundary_after_text_validation_false");
  if (o["postPatchDenyBoundaryBeforePromptBuild"] !== true)
    reasons.push("post_patch_deny_boundary_before_prompt_build_false");
  if (o["postPatchDenyBoundaryBeforeModelCall"] !== true)
    reasons.push("post_patch_deny_boundary_before_model_call_false");
  if (o["postPatchDenyBoundaryBeforeDocumentProcessing"] !== true)
    reasons.push("post_patch_deny_boundary_before_document_processing_false");
  if (o["postPatchDenyBoundaryBeforeStorage"] !== true)
    reasons.push("post_patch_deny_boundary_before_storage_false");
  if (o["postPatchDenyBoundaryBeforePersistence"] !== true)
    reasons.push("post_patch_deny_boundary_before_persistence_false");
  if (o["postPatchDenyBoundaryBeforeUserVisibleOutput"] !== true)
    reasons.push("post_patch_deny_boundary_before_user_visible_output_false");
  if (o["postPatchDenyBoundaryRejectsClientDocumentModeFlag"] !== true)
    reasons.push("post_patch_deny_boundary_rejects_client_document_mode_flag_false");
  if (o["postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag"] !== true)
    reasons.push("post_patch_deny_boundary_rejects_client_paid_document_mode_flag_false");
  if (o["postPatchDenyBoundaryRejectsClientEntitlementFlag"] !== true)
    reasons.push("post_patch_deny_boundary_rejects_client_entitlement_flag_false");
  if (o["postPatchDenyBoundaryRejectsClientPaidFlag"] !== true)
    reasons.push("post_patch_deny_boundary_rejects_client_paid_flag_false");
  if (o["postPatchDenyBoundaryDoesNotTrustClientFlags"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_trust_client_flags_false");
  if (o["postPatchDenyBoundaryDoesNotCreateEntitledLane"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_create_entitled_lane_false");
  if (o["postPatchDenyBoundaryDoesNotCreatePaymentLane"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_create_payment_lane_false");
  if (o["postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_create_document_processing_lane_false");
  if (o["postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_create_user_visible_document_lane_false");
  if (o["postPatchDenyBoundaryUsesDocumentModeRequiredCode"] !== true)
    reasons.push("post_patch_deny_boundary_uses_document_mode_required_code_false");
  if (o["postPatchDenyBoundaryReturnsOkFalse"] !== true)
    reasons.push("post_patch_deny_boundary_returns_ok_false_false");
  if (o["postPatchDenyBoundaryReturnsNonSuccessStatus"] !== true)
    reasons.push("post_patch_deny_boundary_returns_non_success_status_false");
  if (o["postPatchDenyBoundaryDoesNotEchoRawDocument"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_echo_raw_document_false");
  if (o["postPatchDenyBoundaryDoesNotSummarizeDocument"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_summarize_document_false");
  if (o["postPatchDenyBoundaryDoesNotTranslateDocument"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_translate_document_false");
  if (o["postPatchDenyBoundaryDoesNotExplainDocument"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_explain_document_false");
  if (o["postPatchDenyBoundaryDoesNotGiveLegalAdvice"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_give_legal_advice_false");
  if (o["postPatchDenyBoundaryDoesNotCalculateDeadline"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_calculate_deadline_false");
  if (o["postPatchDenyBoundaryDoesNotExposeInternalGovernance"] !== true)
    reasons.push("post_patch_deny_boundary_does_not_expose_internal_governance_false");

  // 8.5V preservation confirmations (all true)
  if (o["postPatchFreeQaLanePreserved"] !== true)
    reasons.push("post_patch_free_qa_lane_preserved_false");
  if (o["postPatchGeneralQuestionsPreserved"] !== true)
    reasons.push("post_patch_general_questions_preserved_false");
  if (o["postPatch8x5NDocumentBypassGuardPreserved"] !== true)
    reasons.push("post_patch_8x5n_document_bypass_guard_preserved_false");
  if (o["postPatchDocumentLikeTextBlockingPreserved"] !== true)
    reasons.push("post_patch_document_like_text_blocking_preserved_false");
  if (o["postPatchDocumentModeRequiredResponsePreserved"] !== true)
    reasons.push("post_patch_document_mode_required_response_preserved_false");
  if (o["postPatch8x5HPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("post_patch_8x5h_photo_ocr_quarantine_preserved_false");
  if (o["postPatchPhotoRouteUnmodified"] !== true)
    reasons.push("post_patch_photo_route_unmodified_false");
  if (o["postPatchNoPhotoRuntimeEnabled"] !== true)
    reasons.push("post_patch_no_photo_runtime_enabled_false");
  if (o["postPatchNoOcrRuntimeEnabled"] !== true)
    reasons.push("post_patch_no_ocr_runtime_enabled_false");
  if (o["postPatchNoFileRuntimeEnabled"] !== true)
    reasons.push("post_patch_no_file_runtime_enabled_false");
  if (o["postPatchNoStorageEnabled"] !== true)
    reasons.push("post_patch_no_storage_enabled_false");
  if (o["postPatchNoPersistenceEnabled"] !== true)
    reasons.push("post_patch_no_persistence_enabled_false");
  if (o["postPatchNoPublicDocumentRuntimeEnabled"] !== true)
    reasons.push("post_patch_no_public_document_runtime_enabled_false");

  // 8.5V actual mutation/runtime flags
  if (o["actualPostPatchAuditOnly"] !== true)
    reasons.push("prereq_actual_post_patch_audit_only_must_be_true");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false)
    reasons.push("prereq_actual_live_route_mutation_performed_in_this_phase_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false)
    reasons.push("prereq_actual_smart_talk_route_modified_in_this_phase_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false)
    reasons.push("prereq_actual_photo_route_modified_in_this_phase_must_be_false");
  if (o["actualPaidDocumentBoundaryAlreadyImplementedBy8x5U"] !== true)
    reasons.push("prereq_actual_paid_document_boundary_already_implemented_by_8x5u_must_be_true");
  if (o["actualPaidDocumentBoundaryImplementedInThisPhase"] !== false)
    reasons.push("prereq_actual_paid_document_boundary_implemented_in_this_phase_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("prereq_actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_payment_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false)
    reasons.push("prereq_actual_checkout_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_entitlement_runtime_implemented_must_be_false");
  if (o["actualServerEntitlementVerificationImplemented"] !== false)
    reasons.push("prereq_actual_server_entitlement_verification_implemented_must_be_false");
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("prereq_actual_real_document_input_performed_must_be_false");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("prereq_actual_real_document_processing_performed_must_be_false");
  if (o["actualOcrPerformed"] !== false)
    reasons.push("prereq_actual_ocr_performed_must_be_false");
  if (o["actualPhotoInputProcessed"] !== false)
    reasons.push("prereq_actual_photo_input_processed_must_be_false");
  if (o["actualFileInputProcessed"] !== false)
    reasons.push("prereq_actual_file_input_processed_must_be_false");
  if (o["actualDocumentStoragePerformed"] !== false)
    reasons.push("prereq_actual_document_storage_performed_must_be_false");
  if (o["actualDatabasePersistencePerformed"] !== false)
    reasons.push("prereq_actual_database_persistence_performed_must_be_false");
  if (o["actualAuditPersistencePerformed"] !== false)
    reasons.push("prereq_actual_audit_persistence_performed_must_be_false");
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("prereq_actual_user_visible_output_performed_must_be_false");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("prereq_actual_public_runtime_enabled_must_be_false");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("prereq_actual_pii_redaction_implemented_must_be_false");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("prereq_actual_evidence_gate_runtime_wiring_performed_must_be_false");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("prereq_actual_claim_authorization_performed_must_be_false");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("prereq_actual_deadline_calculation_performed_must_be_false");
  if (o["actualPromptBuildPerformed"] !== false)
    reasons.push("prereq_actual_prompt_build_performed_must_be_false");
  if (o["actualModelCallPerformed"] !== false)
    reasons.push("prereq_actual_model_call_performed_must_be_false");
  if (o["actualRunSmartTalkCalled"] !== false)
    reasons.push("prereq_actual_run_smart_talk_called_must_be_false");

  // 8.5V no-prohibited-side-effect confirmations (all true)
  if (o["postPatchAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_openai_call_false");
  if (o["postPatchAuditConfirmsNoFetchCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_fetch_call_false");
  if (o["postPatchAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_process_env_read_false");
  if (o["postPatchAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_sdk_usage_false");
  if (o["postPatchAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_8x3ac_rerun_false");
  if (o["postPatchAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_payment_runtime_call_false");
  if (o["postPatchAuditConfirmsNoStripeCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_stripe_call_false");
  if (o["postPatchAuditConfirmsNoCheckoutCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_checkout_call_false");
  if (o["postPatchAuditConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_entitlement_runtime_call_false");
  if (o["postPatchAuditConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_server_entitlement_verification_false");
  if (o["postPatchAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_ocr_runtime_call_false");
  if (o["postPatchAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_storage_mutation_false");
  if (o["postPatchAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_database_write_false");
  if (o["postPatchAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_audit_persistence_false");
  if (o["postPatchAuditConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_user_visible_document_explanation_false");
  if (o["postPatchAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_evidence_evaluation_false");
  if (o["postPatchAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_claim_authorization_false");
  if (o["postPatchAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_deadline_calculation_false");
  if (o["postPatchAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_legal_certainty_false");
  if (o["postPatchAuditConfirmsNoPromptBuild"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_prompt_build_false");
  if (o["postPatchAuditConfirmsNoModelCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_model_call_false");
  if (o["postPatchAuditConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_run_smart_talk_call_false");
  if (o["postPatchAuditConfirmsNoRouteHandlerCall"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_route_handler_call_false");
  if (o["postPatchAuditConfirmsNoRouteImport"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_route_import_false");
  if (o["postPatchAuditConfirmsNoFilesystemRead"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_filesystem_read_false");
  if (o["postPatchAuditConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("prereq_post_patch_audit_confirms_no_photo_route_modification_false");

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

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

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

  // TD flags from 8.5V result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("td005_boundary_surgical_route_patch_performed_false");
  if (o["td005PaidDocumentModeBoundaryPostPatchContainmentAudited"] !== true)
    reasons.push("td005_boundary_post_patch_containment_audited_false");
  if (o["td005PaidDocumentModeBoundaryContainmentConfirmed"] !== true)
    reasons.push("td005_boundary_containment_confirmed_false");
  if (o["td005PaidDocumentModeReadyForClosureDecision"] !== true)
    reasons.push("td005_ready_for_closure_decision_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementation"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true) reasons.push("td004_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true) reasons.push("td002_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_contained_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_still_requires_future_authorized_runtime_design_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true) reasons.push("td006_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true) reasons.push("td007_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true) reasons.push("td008_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true) reasons.push("td010_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true) reasons.push("td009_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // 8.5V forward readiness gate
  if (o["readyFor8x5WPaidDocumentModeBoundaryClosureDecision"] !== true)
    reasons.push("ready_for_8x5w_closure_decision_false");
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

  // 8.5W core assertion flags
  if (o["paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision"] !== true)
    reasons.push("post_patch_audit_ready_for_closure_decision_false");
  if (o["paidDocumentModeBoundaryClosureDecisionOnly"] !== true)
    reasons.push("closure_decision_only_false");
  if (o["paidDocumentModeBoundaryContainmentClosed"] !== true)
    reasons.push("boundary_containment_closed_false");
  if (o["paidDocumentModeBoundaryClientFlagBypassClosed"] !== true)
    reasons.push("boundary_client_flag_bypass_closed_false");
  if (o["paidDocumentModeBoundaryDenyByDefaultClosed"] !== true)
    reasons.push("boundary_deny_by_default_closed_false");
  if (o["paidDocumentModeBoundaryServerEntitlementRequirementPreserved"] !== true)
    reasons.push("boundary_server_entitlement_requirement_preserved_false");
  if (o["paidDocumentModeBoundaryActualRuntimeStillDeferred"] !== true)
    reasons.push("boundary_actual_runtime_still_deferred_false");
  if (o["paidDocumentModeRuntimeStillNotImplementedW"] !== true)
    reasons.push("paid_document_mode_runtime_still_not_implemented_false");
  if (o["paidDocumentModeServerEntitlementVerificationStillNotImplementedW"] !== true)
    reasons.push("server_entitlement_verification_still_not_implemented_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorizedW"] !== true)
    reasons.push("document_processing_still_not_authorized_false");

  // 8.5W closure decision fields (all true)
  if (o["closureDecisionTd005ContainmentClosed"] !== true)
    reasons.push("closure_decision_td005_containment_closed_false");
  if (o["closureDecisionTd005ClientFlagBypassClosed"] !== true)
    reasons.push("closure_decision_td005_client_flag_bypass_closed_false");
  if (o["closureDecisionTd005BoundaryPatchAccepted"] !== true)
    reasons.push("closure_decision_td005_boundary_patch_accepted_false");
  if (o["closureDecisionTd005PostPatchAuditAccepted"] !== true)
    reasons.push("closure_decision_td005_post_patch_audit_accepted_false");
  if (o["closureDecisionTd005RuntimeImplementationDeferred"] !== true)
    reasons.push("closure_decision_td005_runtime_implementation_deferred_false");
  if (o["closureDecisionDoesNotAuthorizePaidDocumentModeRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_paid_document_mode_runtime_false");
  if (o["closureDecisionDoesNotAuthorizePaymentRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_payment_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeCheckoutRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_checkout_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeEntitlementRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_entitlement_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeServerEntitlementVerification"] !== true)
    reasons.push("closure_decision_does_not_authorize_server_entitlement_verification_false");
  if (o["closureDecisionDoesNotAuthorizeDocumentProcessing"] !== true)
    reasons.push("closure_decision_does_not_authorize_document_processing_false");
  if (o["closureDecisionDoesNotAuthorizeOcrRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_ocr_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeFileRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_file_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeStorage"] !== true)
    reasons.push("closure_decision_does_not_authorize_storage_false");
  if (o["closureDecisionDoesNotAuthorizePersistence"] !== true)
    reasons.push("closure_decision_does_not_authorize_persistence_false");
  if (o["closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput"] !== true)
    reasons.push("closure_decision_does_not_authorize_user_visible_document_output_false");
  if (o["closureDecisionDoesNotAuthorizePublicRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_public_runtime_false");
  if (o["closureDecisionDoesNotAuthorizePilotRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_pilot_runtime_false");
  if (o["closureDecisionDoesNotAuthorizeProductionRuntime"] !== true)
    reasons.push("closure_decision_does_not_authorize_production_runtime_false");
  if (o["closureDecisionRequiresFutureActualRuntimeImplementation"] !== true)
    reasons.push("closure_decision_requires_future_actual_runtime_implementation_false");
  if (o["closureDecisionRequiresFuturePreModelPiiRedaction"] !== true)
    reasons.push("closure_decision_requires_future_pre_model_pii_redaction_false");
  if (o["closureDecisionRequiresFutureEvidenceGatesProductionWiring"] !== true)
    reasons.push("closure_decision_requires_future_evidence_gates_production_wiring_false");
  if (o["closureDecisionRequiresFutureServerEntitlementVerification"] !== true)
    reasons.push("closure_decision_requires_future_server_entitlement_verification_false");
  if (o["closureDecisionRequiresFutureUserVisibleOutputContract"] !== true)
    reasons.push("closure_decision_requires_future_user_visible_output_contract_false");
  if (o["closureDecisionRequiresFuturePilotAuthorization"] !== true)
    reasons.push("closure_decision_requires_future_pilot_authorization_false");

  // 8.5W containment closure confirmations (all true)
  if (o["containmentClosure8x5UDenyBoundaryAccepted"] !== true)
    reasons.push("containment_closure_8x5u_deny_boundary_accepted_false");
  if (o["containmentClosure8x5VAuditAccepted"] !== true)
    reasons.push("containment_closure_8x5v_audit_accepted_false");
  if (o["containmentClosureSmartTalkRouteDenyBoundaryConfirmed"] !== true)
    reasons.push("containment_closure_smart_talk_route_deny_boundary_confirmed_false");
  if (o["containmentClosureBoundaryBeforeRunSmartTalkConfirmed"] !== true)
    reasons.push("containment_closure_boundary_before_run_smart_talk_confirmed_false");
  if (o["containmentClosureBoundaryAfterJsonParseConfirmed"] !== true)
    reasons.push("containment_closure_boundary_after_json_parse_confirmed_false");
  if (o["containmentClosureBoundaryAfterTextValidationConfirmed"] !== true)
    reasons.push("containment_closure_boundary_after_text_validation_confirmed_false");
  if (o["containmentClosureFreeQaLanePreserved"] !== true)
    reasons.push("containment_closure_free_qa_lane_preserved_false");
  if (o["containmentClosureGeneralQuestionsPreserved"] !== true)
    reasons.push("containment_closure_general_questions_preserved_false");
  if (o["containmentClosure8x5NDocumentBypassGuardPreserved"] !== true)
    reasons.push("containment_closure_8x5n_document_bypass_guard_preserved_false");
  if (o["containmentClosureDocumentLikeTextBlockingPreserved"] !== true)
    reasons.push("containment_closure_document_like_text_blocking_preserved_false");
  if (o["containmentClosure8x5HPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("containment_closure_8x5h_photo_ocr_quarantine_preserved_false");
  if (o["containmentClosurePhotoRouteUnmodified"] !== true)
    reasons.push("containment_closure_photo_route_unmodified_false");
  if (o["containmentClosureNoPhotoRuntimeEnabled"] !== true)
    reasons.push("containment_closure_no_photo_runtime_enabled_false");
  if (o["containmentClosureNoOcrRuntimeEnabled"] !== true)
    reasons.push("containment_closure_no_ocr_runtime_enabled_false");
  if (o["containmentClosureNoFileRuntimeEnabled"] !== true)
    reasons.push("containment_closure_no_file_runtime_enabled_false");
  if (o["containmentClosureNoStorageEnabled"] !== true)
    reasons.push("containment_closure_no_storage_enabled_false");
  if (o["containmentClosureNoPersistenceEnabled"] !== true)
    reasons.push("containment_closure_no_persistence_enabled_false");
  if (o["containmentClosureNoPublicDocumentRuntimeEnabled"] !== true)
    reasons.push("containment_closure_no_public_document_runtime_enabled_false");
  if (o["containmentClosureClientFlagsRemainUntrusted"] !== true)
    reasons.push("containment_closure_client_flags_remain_untrusted_false");
  if (o["containmentClosureNoEntitledLaneCreated"] !== true)
    reasons.push("containment_closure_no_entitled_lane_created_false");
  if (o["containmentClosureNoPaymentLaneCreated"] !== true)
    reasons.push("containment_closure_no_payment_lane_created_false");
  if (o["containmentClosureNoDocumentProcessingLaneCreated"] !== true)
    reasons.push("containment_closure_no_document_processing_lane_created_false");
  if (o["containmentClosureNoUserVisibleDocumentLaneCreated"] !== true)
    reasons.push("containment_closure_no_user_visible_document_lane_created_false");

  // 8.5W actual mutation/runtime flags
  if (o["actualClosureDecisionOnly"] !== true)
    reasons.push("actual_closure_decision_only_must_be_true");
  if (o["actualLiveRouteMutationPerformedInThisPhaseW"] !== false)
    reasons.push("actual_live_route_mutation_performed_in_this_phase_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhaseW"] !== false)
    reasons.push("actual_smart_talk_route_modified_in_this_phase_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhaseW"] !== false)
    reasons.push("actual_photo_route_modified_in_this_phase_must_be_false");
  if (o["actualPaidDocumentBoundaryAlreadyImplementedBy8x5UW"] !== true)
    reasons.push("actual_paid_document_boundary_already_implemented_by_8x5u_must_be_true");
  if (o["actualPaidDocumentBoundaryImplementedInThisPhaseW"] !== false)
    reasons.push("actual_paid_document_boundary_implemented_in_this_phase_must_be_false");

  // 8.5W no-prohibited-side-effect confirmations (all true)
  if (o["closureDecisionConfirmsNoOpenAiCall"] !== true)
    reasons.push("closure_decision_confirms_no_openai_call_false");
  if (o["closureDecisionConfirmsNoFetchCall"] !== true)
    reasons.push("closure_decision_confirms_no_fetch_call_false");
  if (o["closureDecisionConfirmsNoProcessEnvRead"] !== true)
    reasons.push("closure_decision_confirms_no_process_env_read_false");
  if (o["closureDecisionConfirmsNoSdkUsage"] !== true)
    reasons.push("closure_decision_confirms_no_sdk_usage_false");
  if (o["closureDecisionConfirmsNo8x3AcRerun"] !== true)
    reasons.push("closure_decision_confirms_no_8x3ac_rerun_false");
  if (o["closureDecisionConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("closure_decision_confirms_no_payment_runtime_call_false");
  if (o["closureDecisionConfirmsNoStripeCall"] !== true)
    reasons.push("closure_decision_confirms_no_stripe_call_false");
  if (o["closureDecisionConfirmsNoCheckoutCall"] !== true)
    reasons.push("closure_decision_confirms_no_checkout_call_false");
  if (o["closureDecisionConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("closure_decision_confirms_no_entitlement_runtime_call_false");
  if (o["closureDecisionConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("closure_decision_confirms_no_server_entitlement_verification_false");
  if (o["closureDecisionConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("closure_decision_confirms_no_ocr_runtime_call_false");
  if (o["closureDecisionConfirmsNoStorageMutation"] !== true)
    reasons.push("closure_decision_confirms_no_storage_mutation_false");
  if (o["closureDecisionConfirmsNoDatabaseWrite"] !== true)
    reasons.push("closure_decision_confirms_no_database_write_false");
  if (o["closureDecisionConfirmsNoAuditPersistence"] !== true)
    reasons.push("closure_decision_confirms_no_audit_persistence_false");
  if (o["closureDecisionConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("closure_decision_confirms_no_user_visible_document_explanation_false");
  if (o["closureDecisionConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("closure_decision_confirms_no_evidence_evaluation_false");
  if (o["closureDecisionConfirmsNoClaimAuthorization"] !== true)
    reasons.push("closure_decision_confirms_no_claim_authorization_false");
  if (o["closureDecisionConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("closure_decision_confirms_no_deadline_calculation_false");
  if (o["closureDecisionConfirmsNoLegalCertainty"] !== true)
    reasons.push("closure_decision_confirms_no_legal_certainty_false");
  if (o["closureDecisionConfirmsNoPromptBuild"] !== true)
    reasons.push("closure_decision_confirms_no_prompt_build_false");
  if (o["closureDecisionConfirmsNoModelCall"] !== true)
    reasons.push("closure_decision_confirms_no_model_call_false");
  if (o["closureDecisionConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("closure_decision_confirms_no_run_smart_talk_call_false");
  if (o["closureDecisionConfirmsNoRouteHandlerCall"] !== true)
    reasons.push("closure_decision_confirms_no_route_handler_call_false");
  if (o["closureDecisionConfirmsNoRouteImport"] !== true)
    reasons.push("closure_decision_confirms_no_route_import_false");
  if (o["closureDecisionConfirmsNoFilesystemRead"] !== true)
    reasons.push("closure_decision_confirms_no_filesystem_read_false");
  if (o["closureDecisionConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("closure_decision_confirms_no_photo_route_modification_false");

  // 8.5W TD result flags
  if (o["td005PaidDocumentModeBoundaryContainmentClosedResult"] !== true)
    reasons.push("td005_boundary_containment_closed_result_false");
  if (o["td005PaidDocumentModeClientFlagBypassClosedResult"] !== true)
    reasons.push("td005_client_flag_bypass_closed_result_false");
  if (o["td005PaidDocumentModeActualRuntimeImplementationDeferredResult"] !== true)
    reasons.push("td005_actual_runtime_implementation_deferred_result_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_result_false");

  // 8.5W forward readiness
  if (o["readyForPreModelPiiRedactionPhase"] !== true)
    reasons.push("ready_for_pre_model_pii_redaction_phase_false");
  if (o["readyForEvidenceGatesProductionWiringPhase"] !== false)
    reasons.push("ready_for_evidence_gates_production_wiring_phase_must_be_false");
  if (o["readyForServerEntitlementVerificationPhase"] !== false)
    reasons.push("ready_for_server_entitlement_verification_phase_must_be_false");
  if (o["readyForPaidDocumentModeActualRuntimeImplementationPhase"] !== false)
    reasons.push("ready_for_paid_document_mode_actual_runtime_implementation_phase_must_be_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhaseResult"] !== false)
    reasons.push("ready_for_separate_runtime_authorization_must_be_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhaseResult"] !== false)
    reasons.push("ready_for_pilot_authorization_must_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhaseResult"] !== false)
    reasons.push("ready_for_production_authorization_must_be_false");
  if (o["readyForRealDocumentInputResult"] !== false)
    reasons.push("ready_for_real_document_input_must_be_false");
  if (o["readyForUserVisibleOutputResult"] !== false)
    reasons.push("ready_for_user_visible_output_must_be_false");
  if (o["publicRuntimeEnabledResult"] !== false)
    reasons.push("public_runtime_enabled_must_be_false");
  if (o["persistenceUsedResult"] !== false)
    reasons.push("persistence_used_must_be_false");
  if (o["neverUserVisibleResult"] !== true)
    reasons.push("never_user_visible_must_be_true");

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.5W input ──────────────────────────────────────────────────────

function buildCanonical8x5WInput(): ControlledRealDocumentPaidDocumentModeBoundaryClosureDecisionInput {
  const auditResult = runControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAudit();
  return {
    // 8.5V prerequisite gate — core
    prereqCheckId: auditResult.checkId,
    prereqAllPassed: auditResult.allPassed,
    paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit:
      auditResult.paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit,
    controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted:
      auditResult.controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted,
    paidDocumentModeBoundaryPostPatchContainmentAudited:
      auditResult.paidDocumentModeBoundaryPostPatchContainmentAudited,
    paidDocumentModeBoundaryPostPatchContainmentAuditOnly:
      auditResult.paidDocumentModeBoundaryPostPatchContainmentAuditOnly,
    paidDocumentModeBoundaryContainmentConfirmed:
      auditResult.paidDocumentModeBoundaryContainmentConfirmed,
    paidDocumentModeBoundaryDenyByDefaultConfirmed:
      auditResult.paidDocumentModeBoundaryDenyByDefaultConfirmed,
    paidDocumentModeBoundaryClientFlagBypassBlocked:
      auditResult.paidDocumentModeBoundaryClientFlagBypassBlocked,
    paidDocumentModeBoundaryServerEntitlementStillRequired:
      auditResult.paidDocumentModeBoundaryServerEntitlementStillRequired,
    paidDocumentModeBoundaryRuntimeStillNotImplemented:
      auditResult.paidDocumentModeBoundaryRuntimeStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented:
      auditResult.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeCheckoutRuntimeStillNotImplemented:
      auditResult.paidDocumentModeCheckoutRuntimeStillNotImplemented,
    paidDocumentModeEntitlementRuntimeStillNotImplemented:
      auditResult.paidDocumentModeEntitlementRuntimeStillNotImplemented,
    paidDocumentModeServerEntitlementVerificationStillNotImplemented:
      auditResult.paidDocumentModeServerEntitlementVerificationStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      auditResult.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      auditResult.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,
    prereqTamperCasesRejected: auditResult.tamperCasesRejected,

    // 8.5V post-patch containment confirmations
    postPatchSmartTalkRouteContainsDenyBoundary:
      auditResult.postPatchSmartTalkRouteContainsDenyBoundary,
    postPatchDenyBoundaryBeforeRunSmartTalk: auditResult.postPatchDenyBoundaryBeforeRunSmartTalk,
    postPatchDenyBoundaryAfterJsonParse: auditResult.postPatchDenyBoundaryAfterJsonParse,
    postPatchDenyBoundaryAfterTextValidation: auditResult.postPatchDenyBoundaryAfterTextValidation,
    postPatchDenyBoundaryBeforePromptBuild: auditResult.postPatchDenyBoundaryBeforePromptBuild,
    postPatchDenyBoundaryBeforeModelCall: auditResult.postPatchDenyBoundaryBeforeModelCall,
    postPatchDenyBoundaryBeforeDocumentProcessing:
      auditResult.postPatchDenyBoundaryBeforeDocumentProcessing,
    postPatchDenyBoundaryBeforeStorage: auditResult.postPatchDenyBoundaryBeforeStorage,
    postPatchDenyBoundaryBeforePersistence: auditResult.postPatchDenyBoundaryBeforePersistence,
    postPatchDenyBoundaryBeforeUserVisibleOutput:
      auditResult.postPatchDenyBoundaryBeforeUserVisibleOutput,
    postPatchDenyBoundaryRejectsClientDocumentModeFlag:
      auditResult.postPatchDenyBoundaryRejectsClientDocumentModeFlag,
    postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag:
      auditResult.postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag,
    postPatchDenyBoundaryRejectsClientEntitlementFlag:
      auditResult.postPatchDenyBoundaryRejectsClientEntitlementFlag,
    postPatchDenyBoundaryRejectsClientPaidFlag:
      auditResult.postPatchDenyBoundaryRejectsClientPaidFlag,
    postPatchDenyBoundaryDoesNotTrustClientFlags:
      auditResult.postPatchDenyBoundaryDoesNotTrustClientFlags,
    postPatchDenyBoundaryDoesNotCreateEntitledLane:
      auditResult.postPatchDenyBoundaryDoesNotCreateEntitledLane,
    postPatchDenyBoundaryDoesNotCreatePaymentLane:
      auditResult.postPatchDenyBoundaryDoesNotCreatePaymentLane,
    postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane:
      auditResult.postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane,
    postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane:
      auditResult.postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane,
    postPatchDenyBoundaryUsesDocumentModeRequiredCode:
      auditResult.postPatchDenyBoundaryUsesDocumentModeRequiredCode,
    postPatchDenyBoundaryReturnsOkFalse: auditResult.postPatchDenyBoundaryReturnsOkFalse,
    postPatchDenyBoundaryReturnsNonSuccessStatus:
      auditResult.postPatchDenyBoundaryReturnsNonSuccessStatus,
    postPatchDenyBoundaryDoesNotEchoRawDocument:
      auditResult.postPatchDenyBoundaryDoesNotEchoRawDocument,
    postPatchDenyBoundaryDoesNotSummarizeDocument:
      auditResult.postPatchDenyBoundaryDoesNotSummarizeDocument,
    postPatchDenyBoundaryDoesNotTranslateDocument:
      auditResult.postPatchDenyBoundaryDoesNotTranslateDocument,
    postPatchDenyBoundaryDoesNotExplainDocument:
      auditResult.postPatchDenyBoundaryDoesNotExplainDocument,
    postPatchDenyBoundaryDoesNotGiveLegalAdvice:
      auditResult.postPatchDenyBoundaryDoesNotGiveLegalAdvice,
    postPatchDenyBoundaryDoesNotCalculateDeadline:
      auditResult.postPatchDenyBoundaryDoesNotCalculateDeadline,
    postPatchDenyBoundaryDoesNotExposeInternalGovernance:
      auditResult.postPatchDenyBoundaryDoesNotExposeInternalGovernance,

    // 8.5V preservation confirmations
    postPatchFreeQaLanePreserved: auditResult.postPatchFreeQaLanePreserved,
    postPatchGeneralQuestionsPreserved: auditResult.postPatchGeneralQuestionsPreserved,
    postPatch8x5NDocumentBypassGuardPreserved:
      auditResult.postPatch8x5NDocumentBypassGuardPreserved,
    postPatchDocumentLikeTextBlockingPreserved:
      auditResult.postPatchDocumentLikeTextBlockingPreserved,
    postPatchDocumentModeRequiredResponsePreserved:
      auditResult.postPatchDocumentModeRequiredResponsePreserved,
    postPatch8x5HPhotoOcrQuarantinePreserved:
      auditResult.postPatch8x5HPhotoOcrQuarantinePreserved,
    postPatchPhotoRouteUnmodified: auditResult.postPatchPhotoRouteUnmodified,
    postPatchNoPhotoRuntimeEnabled: auditResult.postPatchNoPhotoRuntimeEnabled,
    postPatchNoOcrRuntimeEnabled: auditResult.postPatchNoOcrRuntimeEnabled,
    postPatchNoFileRuntimeEnabled: auditResult.postPatchNoFileRuntimeEnabled,
    postPatchNoStorageEnabled: auditResult.postPatchNoStorageEnabled,
    postPatchNoPersistenceEnabled: auditResult.postPatchNoPersistenceEnabled,
    postPatchNoPublicDocumentRuntimeEnabled: auditResult.postPatchNoPublicDocumentRuntimeEnabled,

    // 8.5V actual mutation/runtime flags
    actualPostPatchAuditOnly: auditResult.actualPostPatchAuditOnly,
    actualLiveRouteMutationPerformedInThisPhase:
      auditResult.actualLiveRouteMutationPerformedInThisPhase,
    actualSmartTalkRouteModifiedInThisPhase:
      auditResult.actualSmartTalkRouteModifiedInThisPhase,
    actualPhotoRouteModifiedInThisPhase: auditResult.actualPhotoRouteModifiedInThisPhase,
    actualPaidDocumentBoundaryAlreadyImplementedBy8x5U:
      auditResult.actualPaidDocumentBoundaryAlreadyImplementedBy8x5U,
    actualPaidDocumentBoundaryImplementedInThisPhase:
      auditResult.actualPaidDocumentBoundaryImplementedInThisPhase,
    actualPaidDocumentModeImplemented: auditResult.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: auditResult.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: auditResult.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: auditResult.actualEntitlementRuntimeImplemented,
    actualServerEntitlementVerificationImplemented:
      auditResult.actualServerEntitlementVerificationImplemented,
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
    actualPiiRedactionImplemented: auditResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed:
      auditResult.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: auditResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: auditResult.actualDeadlineCalculationPerformed,
    actualPromptBuildPerformed: auditResult.actualPromptBuildPerformed,
    actualModelCallPerformed: auditResult.actualModelCallPerformed,
    actualRunSmartTalkCalled: auditResult.actualRunSmartTalkCalled,

    // 8.5V no-prohibited-side-effect confirmations
    postPatchAuditConfirmsNoOpenAiCall: auditResult.postPatchAuditConfirmsNoOpenAiCall,
    postPatchAuditConfirmsNoFetchCall: auditResult.postPatchAuditConfirmsNoFetchCall,
    postPatchAuditConfirmsNoProcessEnvRead: auditResult.postPatchAuditConfirmsNoProcessEnvRead,
    postPatchAuditConfirmsNoSdkUsage: auditResult.postPatchAuditConfirmsNoSdkUsage,
    postPatchAuditConfirmsNo8x3AcRerun: auditResult.postPatchAuditConfirmsNo8x3AcRerun,
    postPatchAuditConfirmsNoPaymentRuntimeCall:
      auditResult.postPatchAuditConfirmsNoPaymentRuntimeCall,
    postPatchAuditConfirmsNoStripeCall: auditResult.postPatchAuditConfirmsNoStripeCall,
    postPatchAuditConfirmsNoCheckoutCall: auditResult.postPatchAuditConfirmsNoCheckoutCall,
    postPatchAuditConfirmsNoEntitlementRuntimeCall:
      auditResult.postPatchAuditConfirmsNoEntitlementRuntimeCall,
    postPatchAuditConfirmsNoServerEntitlementVerification:
      auditResult.postPatchAuditConfirmsNoServerEntitlementVerification,
    postPatchAuditConfirmsNoOcrRuntimeCall: auditResult.postPatchAuditConfirmsNoOcrRuntimeCall,
    postPatchAuditConfirmsNoStorageMutation: auditResult.postPatchAuditConfirmsNoStorageMutation,
    postPatchAuditConfirmsNoDatabaseWrite: auditResult.postPatchAuditConfirmsNoDatabaseWrite,
    postPatchAuditConfirmsNoAuditPersistence:
      auditResult.postPatchAuditConfirmsNoAuditPersistence,
    postPatchAuditConfirmsNoUserVisibleDocumentExplanation:
      auditResult.postPatchAuditConfirmsNoUserVisibleDocumentExplanation,
    postPatchAuditConfirmsNoEvidenceEvaluation:
      auditResult.postPatchAuditConfirmsNoEvidenceEvaluation,
    postPatchAuditConfirmsNoClaimAuthorization:
      auditResult.postPatchAuditConfirmsNoClaimAuthorization,
    postPatchAuditConfirmsNoDeadlineCalculation:
      auditResult.postPatchAuditConfirmsNoDeadlineCalculation,
    postPatchAuditConfirmsNoLegalCertainty: auditResult.postPatchAuditConfirmsNoLegalCertainty,
    postPatchAuditConfirmsNoPromptBuild: auditResult.postPatchAuditConfirmsNoPromptBuild,
    postPatchAuditConfirmsNoModelCall: auditResult.postPatchAuditConfirmsNoModelCall,
    postPatchAuditConfirmsNoRunSmartTalkCall:
      auditResult.postPatchAuditConfirmsNoRunSmartTalkCall,
    postPatchAuditConfirmsNoRouteHandlerCall:
      auditResult.postPatchAuditConfirmsNoRouteHandlerCall,
    postPatchAuditConfirmsNoRouteImport: auditResult.postPatchAuditConfirmsNoRouteImport,
    postPatchAuditConfirmsNoFilesystemRead: auditResult.postPatchAuditConfirmsNoFilesystemRead,
    postPatchAuditConfirmsNoPhotoRouteModification:
      auditResult.postPatchAuditConfirmsNoPhotoRouteModification,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: auditResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: auditResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: auditResult.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: auditResult.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: auditResult.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: auditResult.checkoutPipelineActuallyExecuted,
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
    userVisibleLegalDeadlineOutputAuthorizedNow:
      auditResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: auditResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: auditResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: auditResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: auditResult.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: auditResult.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: auditResult.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: auditResult.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: auditResult.checkoutRuntimeAuthorizedNow,

    // Authorization grants
    runtimeAuthorizationGranted: auditResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: auditResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: auditResult.productionAuthorizationGranted,
    finalAuthorizationGranted: auditResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: auditResult.goLiveAuthorizationGranted,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: auditResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: auditResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: auditResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: auditResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: auditResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: auditResult.deliveryDateRequiredForExactDeadline,

    // TD flags from 8.5V result
    td001DocumentBypassGuardContainmentClosed: auditResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed:
      auditResult.td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed,
    td005PaidDocumentModeBoundaryPostPatchContainmentAudited:
      auditResult.td005PaidDocumentModeBoundaryPostPatchContainmentAudited,
    td005PaidDocumentModeBoundaryContainmentConfirmed:
      auditResult.td005PaidDocumentModeBoundaryContainmentConfirmed,
    td005PaidDocumentModeReadyForClosureDecision:
      auditResult.td005PaidDocumentModeReadyForClosureDecision,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation:
      auditResult.td005PaidDocumentModeStillRequiresActualRuntimeImplementation,
    td004PreModelPiiRedactionMissing: auditResult.td004PreModelPiiRedactionMissing,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      auditResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      auditResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      auditResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      auditResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      auditResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: auditResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: auditResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: auditResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: auditResult.tmpFilesPresentInWorkingTree,

    // 8.5V forward readiness gate
    readyFor8x5WPaidDocumentModeBoundaryClosureDecision:
      auditResult.readyFor8x5WPaidDocumentModeBoundaryClosureDecision,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase:
      auditResult.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
    readyForControlledRealDocumentPilotAuthorizationPhase:
      auditResult.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase:
      auditResult.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: auditResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: auditResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: auditResult.publicRuntimeEnabled,
    persistenceUsed: auditResult.persistenceUsed,
    neverUserVisible: auditResult.neverUserVisible,

    // 8.5W core assertion flags
    paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: true,
    paidDocumentModeBoundaryClosureDecisionOnly: true,
    paidDocumentModeBoundaryContainmentClosed: true,
    paidDocumentModeBoundaryClientFlagBypassClosed: true,
    paidDocumentModeBoundaryDenyByDefaultClosed: true,
    paidDocumentModeBoundaryServerEntitlementRequirementPreserved: true,
    paidDocumentModeBoundaryActualRuntimeStillDeferred: true,
    paidDocumentModeRuntimeStillNotImplementedW: true,
    paidDocumentModeServerEntitlementVerificationStillNotImplementedW: true,
    paidDocumentModeDocumentProcessingStillNotAuthorizedW: true,

    // 8.5W closure decision fields
    closureDecisionTd005ContainmentClosed: true,
    closureDecisionTd005ClientFlagBypassClosed: true,
    closureDecisionTd005BoundaryPatchAccepted: true,
    closureDecisionTd005PostPatchAuditAccepted: true,
    closureDecisionTd005RuntimeImplementationDeferred: true,
    closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: true,
    closureDecisionDoesNotAuthorizePaymentRuntime: true,
    closureDecisionDoesNotAuthorizeCheckoutRuntime: true,
    closureDecisionDoesNotAuthorizeEntitlementRuntime: true,
    closureDecisionDoesNotAuthorizeServerEntitlementVerification: true,
    closureDecisionDoesNotAuthorizeDocumentProcessing: true,
    closureDecisionDoesNotAuthorizeOcrRuntime: true,
    closureDecisionDoesNotAuthorizeFileRuntime: true,
    closureDecisionDoesNotAuthorizeStorage: true,
    closureDecisionDoesNotAuthorizePersistence: true,
    closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: true,
    closureDecisionDoesNotAuthorizePublicRuntime: true,
    closureDecisionDoesNotAuthorizePilotRuntime: true,
    closureDecisionDoesNotAuthorizeProductionRuntime: true,
    closureDecisionRequiresFutureActualRuntimeImplementation: true,
    closureDecisionRequiresFuturePreModelPiiRedaction: true,
    closureDecisionRequiresFutureEvidenceGatesProductionWiring: true,
    closureDecisionRequiresFutureServerEntitlementVerification: true,
    closureDecisionRequiresFutureUserVisibleOutputContract: true,
    closureDecisionRequiresFuturePilotAuthorization: true,

    // 8.5W containment closure confirmations
    containmentClosure8x5UDenyBoundaryAccepted: true,
    containmentClosure8x5VAuditAccepted: true,
    containmentClosureSmartTalkRouteDenyBoundaryConfirmed: true,
    containmentClosureBoundaryBeforeRunSmartTalkConfirmed: true,
    containmentClosureBoundaryAfterJsonParseConfirmed: true,
    containmentClosureBoundaryAfterTextValidationConfirmed: true,
    containmentClosureFreeQaLanePreserved: true,
    containmentClosureGeneralQuestionsPreserved: true,
    containmentClosure8x5NDocumentBypassGuardPreserved: true,
    containmentClosureDocumentLikeTextBlockingPreserved: true,
    containmentClosure8x5HPhotoOcrQuarantinePreserved: true,
    containmentClosurePhotoRouteUnmodified: true,
    containmentClosureNoPhotoRuntimeEnabled: true,
    containmentClosureNoOcrRuntimeEnabled: true,
    containmentClosureNoFileRuntimeEnabled: true,
    containmentClosureNoStorageEnabled: true,
    containmentClosureNoPersistenceEnabled: true,
    containmentClosureNoPublicDocumentRuntimeEnabled: true,
    containmentClosureClientFlagsRemainUntrusted: true,
    containmentClosureNoEntitledLaneCreated: true,
    containmentClosureNoPaymentLaneCreated: true,
    containmentClosureNoDocumentProcessingLaneCreated: true,
    containmentClosureNoUserVisibleDocumentLaneCreated: true,

    // 8.5W actual mutation/runtime flags
    actualClosureDecisionOnly: true,
    actualLiveRouteMutationPerformedInThisPhaseW: false,
    actualSmartTalkRouteModifiedInThisPhaseW: false,
    actualPhotoRouteModifiedInThisPhaseW: false,
    actualPaidDocumentBoundaryAlreadyImplementedBy8x5UW: true,
    actualPaidDocumentBoundaryImplementedInThisPhaseW: false,

    // 8.5W no-prohibited-side-effect confirmations
    closureDecisionConfirmsNoOpenAiCall: true,
    closureDecisionConfirmsNoFetchCall: true,
    closureDecisionConfirmsNoProcessEnvRead: true,
    closureDecisionConfirmsNoSdkUsage: true,
    closureDecisionConfirmsNo8x3AcRerun: true,
    closureDecisionConfirmsNoPaymentRuntimeCall: true,
    closureDecisionConfirmsNoStripeCall: true,
    closureDecisionConfirmsNoCheckoutCall: true,
    closureDecisionConfirmsNoEntitlementRuntimeCall: true,
    closureDecisionConfirmsNoServerEntitlementVerification: true,
    closureDecisionConfirmsNoOcrRuntimeCall: true,
    closureDecisionConfirmsNoStorageMutation: true,
    closureDecisionConfirmsNoDatabaseWrite: true,
    closureDecisionConfirmsNoAuditPersistence: true,
    closureDecisionConfirmsNoUserVisibleDocumentExplanation: true,
    closureDecisionConfirmsNoEvidenceEvaluation: true,
    closureDecisionConfirmsNoClaimAuthorization: true,
    closureDecisionConfirmsNoDeadlineCalculation: true,
    closureDecisionConfirmsNoLegalCertainty: true,
    closureDecisionConfirmsNoPromptBuild: true,
    closureDecisionConfirmsNoModelCall: true,
    closureDecisionConfirmsNoRunSmartTalkCall: true,
    closureDecisionConfirmsNoRouteHandlerCall: true,
    closureDecisionConfirmsNoRouteImport: true,
    closureDecisionConfirmsNoFilesystemRead: true,
    closureDecisionConfirmsNoPhotoRouteModification: true,

    // 8.5W TD result flags
    td005PaidDocumentModeBoundaryContainmentClosedResult: true,
    td005PaidDocumentModeClientFlagBypassClosedResult: true,
    td005PaidDocumentModeActualRuntimeImplementationDeferredResult: true,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: true,

    // 8.5W forward readiness
    readyForPreModelPiiRedactionPhase: true,
    readyForEvidenceGatesProductionWiringPhase: false,
    readyForServerEntitlementVerificationPhase: false,
    readyForPaidDocumentModeActualRuntimeImplementationPhase: false,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhaseResult: false,
    readyForControlledRealDocumentPilotAuthorizationPhaseResult: false,
    readyForControlledRealDocumentProductionAuthorizationPhaseResult: false,
    readyForRealDocumentInputResult: false,
    readyForUserVisibleOutputResult: false,
    publicRuntimeEnabledResult: false,
    persistenceUsedResult: false,
    neverUserVisibleResult: true,
  };
}

// ── Tamper coverage ───────────────────────────────────────────────────────────

function runTamperCases(): { allRejected: boolean; count: number; failures: string[] } {
  const base = buildCanonical8x5WInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateClosureDecisionInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5V prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5U" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("surgical_route_patch_ready_for_post_patch_audit_false",
    { paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: false });
  expect_rejected("post_patch_containment_audit_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted: false });
  expect_rejected("post_patch_containment_audited_false",
    { paidDocumentModeBoundaryPostPatchContainmentAudited: false });
  expect_rejected("post_patch_containment_audit_only_false",
    { paidDocumentModeBoundaryPostPatchContainmentAuditOnly: false });
  expect_rejected("boundary_containment_confirmed_false",
    { paidDocumentModeBoundaryContainmentConfirmed: false });
  expect_rejected("boundary_deny_by_default_confirmed_false",
    { paidDocumentModeBoundaryDenyByDefaultConfirmed: false });
  expect_rejected("boundary_client_flag_bypass_blocked_false",
    { paidDocumentModeBoundaryClientFlagBypassBlocked: false });
  expect_rejected("boundary_server_entitlement_still_required_false",
    { paidDocumentModeBoundaryServerEntitlementStillRequired: false });
  expect_rejected("boundary_runtime_still_not_implemented_false",
    { paidDocumentModeBoundaryRuntimeStillNotImplemented: false });
  expect_rejected("payment_runtime_still_not_implemented_false",
    { paidDocumentModePaymentRuntimeStillNotImplemented: false });
  expect_rejected("checkout_runtime_still_not_implemented_false",
    { paidDocumentModeCheckoutRuntimeStillNotImplemented: false });
  expect_rejected("entitlement_runtime_still_not_implemented_false",
    { paidDocumentModeEntitlementRuntimeStillNotImplemented: false });
  expect_rejected("server_entitlement_verification_still_not_implemented_false",
    { paidDocumentModeServerEntitlementVerificationStillNotImplemented: false });
  expect_rejected("document_processing_still_not_authorized_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorized: false });
  expect_rejected("user_visible_document_explanation_still_not_authorized_false",
    { paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: false });
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.5V post-patch containment confirmations (all true)
  expect_rejected("post_patch_smart_talk_route_contains_deny_boundary_false",
    { postPatchSmartTalkRouteContainsDenyBoundary: false });
  expect_rejected("post_patch_deny_boundary_before_run_smart_talk_false",
    { postPatchDenyBoundaryBeforeRunSmartTalk: false });
  expect_rejected("post_patch_deny_boundary_after_json_parse_false",
    { postPatchDenyBoundaryAfterJsonParse: false });
  expect_rejected("post_patch_deny_boundary_after_text_validation_false",
    { postPatchDenyBoundaryAfterTextValidation: false });
  expect_rejected("post_patch_deny_boundary_before_prompt_build_false",
    { postPatchDenyBoundaryBeforePromptBuild: false });
  expect_rejected("post_patch_deny_boundary_before_model_call_false",
    { postPatchDenyBoundaryBeforeModelCall: false });
  expect_rejected("post_patch_deny_boundary_before_document_processing_false",
    { postPatchDenyBoundaryBeforeDocumentProcessing: false });
  expect_rejected("post_patch_deny_boundary_before_storage_false",
    { postPatchDenyBoundaryBeforeStorage: false });
  expect_rejected("post_patch_deny_boundary_before_persistence_false",
    { postPatchDenyBoundaryBeforePersistence: false });
  expect_rejected("post_patch_deny_boundary_before_user_visible_output_false",
    { postPatchDenyBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("post_patch_deny_boundary_rejects_client_document_mode_flag_false",
    { postPatchDenyBoundaryRejectsClientDocumentModeFlag: false });
  expect_rejected("post_patch_deny_boundary_rejects_client_paid_document_mode_flag_false",
    { postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag: false });
  expect_rejected("post_patch_deny_boundary_rejects_client_entitlement_flag_false",
    { postPatchDenyBoundaryRejectsClientEntitlementFlag: false });
  expect_rejected("post_patch_deny_boundary_rejects_client_paid_flag_false",
    { postPatchDenyBoundaryRejectsClientPaidFlag: false });
  expect_rejected("post_patch_deny_boundary_does_not_trust_client_flags_false",
    { postPatchDenyBoundaryDoesNotTrustClientFlags: false });
  expect_rejected("post_patch_deny_boundary_does_not_create_entitled_lane_false",
    { postPatchDenyBoundaryDoesNotCreateEntitledLane: false });
  expect_rejected("post_patch_deny_boundary_does_not_create_payment_lane_false",
    { postPatchDenyBoundaryDoesNotCreatePaymentLane: false });
  expect_rejected("post_patch_deny_boundary_does_not_create_document_processing_lane_false",
    { postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane: false });
  expect_rejected("post_patch_deny_boundary_does_not_create_user_visible_document_lane_false",
    { postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane: false });
  expect_rejected("post_patch_deny_boundary_uses_document_mode_required_code_false",
    { postPatchDenyBoundaryUsesDocumentModeRequiredCode: false });
  expect_rejected("post_patch_deny_boundary_returns_ok_false_false",
    { postPatchDenyBoundaryReturnsOkFalse: false });
  expect_rejected("post_patch_deny_boundary_returns_non_success_status_false",
    { postPatchDenyBoundaryReturnsNonSuccessStatus: false });
  expect_rejected("post_patch_deny_boundary_does_not_echo_raw_document_false",
    { postPatchDenyBoundaryDoesNotEchoRawDocument: false });
  expect_rejected("post_patch_deny_boundary_does_not_summarize_document_false",
    { postPatchDenyBoundaryDoesNotSummarizeDocument: false });
  expect_rejected("post_patch_deny_boundary_does_not_translate_document_false",
    { postPatchDenyBoundaryDoesNotTranslateDocument: false });
  expect_rejected("post_patch_deny_boundary_does_not_explain_document_false",
    { postPatchDenyBoundaryDoesNotExplainDocument: false });
  expect_rejected("post_patch_deny_boundary_does_not_give_legal_advice_false",
    { postPatchDenyBoundaryDoesNotGiveLegalAdvice: false });
  expect_rejected("post_patch_deny_boundary_does_not_calculate_deadline_false",
    { postPatchDenyBoundaryDoesNotCalculateDeadline: false });
  expect_rejected("post_patch_deny_boundary_does_not_expose_internal_governance_false",
    { postPatchDenyBoundaryDoesNotExposeInternalGovernance: false });

  // 8.5V preservation confirmations (all true)
  expect_rejected("post_patch_free_qa_lane_preserved_false",
    { postPatchFreeQaLanePreserved: false });
  expect_rejected("post_patch_general_questions_preserved_false",
    { postPatchGeneralQuestionsPreserved: false });
  expect_rejected("post_patch_8x5n_document_bypass_guard_preserved_false",
    { postPatch8x5NDocumentBypassGuardPreserved: false });
  expect_rejected("post_patch_document_like_text_blocking_preserved_false",
    { postPatchDocumentLikeTextBlockingPreserved: false });
  expect_rejected("post_patch_document_mode_required_response_preserved_false",
    { postPatchDocumentModeRequiredResponsePreserved: false });
  expect_rejected("post_patch_8x5h_photo_ocr_quarantine_preserved_false",
    { postPatch8x5HPhotoOcrQuarantinePreserved: false });
  expect_rejected("post_patch_photo_route_unmodified_false",
    { postPatchPhotoRouteUnmodified: false });
  expect_rejected("post_patch_no_photo_runtime_enabled_false",
    { postPatchNoPhotoRuntimeEnabled: false });
  expect_rejected("post_patch_no_ocr_runtime_enabled_false",
    { postPatchNoOcrRuntimeEnabled: false });
  expect_rejected("post_patch_no_file_runtime_enabled_false",
    { postPatchNoFileRuntimeEnabled: false });
  expect_rejected("post_patch_no_storage_enabled_false", { postPatchNoStorageEnabled: false });
  expect_rejected("post_patch_no_persistence_enabled_false",
    { postPatchNoPersistenceEnabled: false });
  expect_rejected("post_patch_no_public_document_runtime_enabled_false",
    { postPatchNoPublicDocumentRuntimeEnabled: false });

  // 8.5V actual mutation/runtime flags
  expect_rejected("prereq_actual_post_patch_audit_only_false",
    { actualPostPatchAuditOnly: false });
  expect_rejected("prereq_actual_live_route_mutation_performed_in_this_phase_true",
    { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_in_this_phase_true",
    { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_photo_route_modified_in_this_phase_true",
    { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("prereq_actual_paid_document_boundary_already_implemented_by_8x5u_false",
    { actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: false });
  expect_rejected("prereq_actual_paid_document_boundary_implemented_in_this_phase_true",
    { actualPaidDocumentBoundaryImplementedInThisPhase: true });
  expect_rejected("prereq_actual_paid_document_mode_implemented_true",
    { actualPaidDocumentModeImplemented: true });
  expect_rejected("prereq_actual_payment_runtime_implemented_true",
    { actualPaymentRuntimeImplemented: true });
  expect_rejected("prereq_actual_checkout_implemented_true",
    { actualCheckoutImplemented: true });
  expect_rejected("prereq_actual_entitlement_runtime_implemented_true",
    { actualEntitlementRuntimeImplemented: true });
  expect_rejected("prereq_actual_server_entitlement_verification_implemented_true",
    { actualServerEntitlementVerificationImplemented: true });
  expect_rejected("prereq_actual_real_document_input_performed_true",
    { actualRealDocumentInputPerformed: true });
  expect_rejected("prereq_actual_real_document_processing_performed_true",
    { actualRealDocumentProcessingPerformed: true });
  expect_rejected("prereq_actual_ocr_performed_true", { actualOcrPerformed: true });
  expect_rejected("prereq_actual_photo_input_processed_true", { actualPhotoInputProcessed: true });
  expect_rejected("prereq_actual_file_input_processed_true", { actualFileInputProcessed: true });
  expect_rejected("prereq_actual_document_storage_performed_true",
    { actualDocumentStoragePerformed: true });
  expect_rejected("prereq_actual_database_persistence_performed_true",
    { actualDatabasePersistencePerformed: true });
  expect_rejected("prereq_actual_audit_persistence_performed_true",
    { actualAuditPersistencePerformed: true });
  expect_rejected("prereq_actual_user_visible_output_performed_true",
    { actualUserVisibleOutputPerformed: true });
  expect_rejected("prereq_actual_public_runtime_enabled_true",
    { actualPublicRuntimeEnabled: true });
  expect_rejected("prereq_actual_pii_redaction_implemented_true",
    { actualPiiRedactionImplemented: true });
  expect_rejected("prereq_actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("prereq_actual_claim_authorization_performed_true",
    { actualClaimAuthorizationPerformed: true });
  expect_rejected("prereq_actual_deadline_calculation_performed_true",
    { actualDeadlineCalculationPerformed: true });
  expect_rejected("prereq_actual_prompt_build_performed_true",
    { actualPromptBuildPerformed: true });
  expect_rejected("prereq_actual_model_call_performed_true", { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });

  // 8.5V no-prohibited-side-effect confirmations (all true)
  expect_rejected("prereq_post_patch_audit_confirms_no_openai_call_false",
    { postPatchAuditConfirmsNoOpenAiCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_fetch_call_false",
    { postPatchAuditConfirmsNoFetchCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_process_env_read_false",
    { postPatchAuditConfirmsNoProcessEnvRead: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_sdk_usage_false",
    { postPatchAuditConfirmsNoSdkUsage: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_8x3ac_rerun_false",
    { postPatchAuditConfirmsNo8x3AcRerun: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_payment_runtime_call_false",
    { postPatchAuditConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_stripe_call_false",
    { postPatchAuditConfirmsNoStripeCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_checkout_call_false",
    { postPatchAuditConfirmsNoCheckoutCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_entitlement_runtime_call_false",
    { postPatchAuditConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_server_entitlement_verification_false",
    { postPatchAuditConfirmsNoServerEntitlementVerification: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_ocr_runtime_call_false",
    { postPatchAuditConfirmsNoOcrRuntimeCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_storage_mutation_false",
    { postPatchAuditConfirmsNoStorageMutation: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_database_write_false",
    { postPatchAuditConfirmsNoDatabaseWrite: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_audit_persistence_false",
    { postPatchAuditConfirmsNoAuditPersistence: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_user_visible_document_explanation_false",
    { postPatchAuditConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_evidence_evaluation_false",
    { postPatchAuditConfirmsNoEvidenceEvaluation: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_claim_authorization_false",
    { postPatchAuditConfirmsNoClaimAuthorization: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_deadline_calculation_false",
    { postPatchAuditConfirmsNoDeadlineCalculation: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_legal_certainty_false",
    { postPatchAuditConfirmsNoLegalCertainty: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_prompt_build_false",
    { postPatchAuditConfirmsNoPromptBuild: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_model_call_false",
    { postPatchAuditConfirmsNoModelCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_run_smart_talk_call_false",
    { postPatchAuditConfirmsNoRunSmartTalkCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_route_handler_call_false",
    { postPatchAuditConfirmsNoRouteHandlerCall: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_route_import_false",
    { postPatchAuditConfirmsNoRouteImport: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_filesystem_read_false",
    { postPatchAuditConfirmsNoFilesystemRead: false });
  expect_rejected("prereq_post_patch_audit_confirms_no_photo_route_modification_false",
    { postPatchAuditConfirmsNoPhotoRouteModification: false });

  // Pipeline executed flags (all false)
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true",
    { runtimePipelineActuallyExecuted: true });
  expect_rejected("document_pipeline_actually_executed_true",
    { documentPipelineActuallyExecuted: true });
  expect_rejected("payment_pipeline_actually_executed_true",
    { paymentPipelineActuallyExecuted: true });
  expect_rejected("entitlement_pipeline_actually_executed_true",
    { entitlementPipelineActuallyExecuted: true });
  expect_rejected("checkout_pipeline_actually_executed_true",
    { checkoutPipelineActuallyExecuted: true });
  expect_rejected("ocr_pipeline_actually_executed_true", { ocrPipelineActuallyExecuted: true });
  expect_rejected("user_visible_pipeline_actually_executed_true",
    { userVisiblePipelineActuallyExecuted: true });

  // Runtime authorization flags (all false)
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
  expect_rejected("connected_ai_runtime_authorized_now_true",
    { connectedAiRuntimeAuthorizedNow: true });
  expect_rejected("pilot_runtime_authorized_now_true", { pilotRuntimeAuthorizedNow: true });
  expect_rejected("production_runtime_authorized_now_true",
    { productionRuntimeAuthorizedNow: true });
  expect_rejected("paid_document_mode_runtime_authorized_now_true",
    { paidDocumentModeRuntimeAuthorizedNow: true });
  expect_rejected("payment_runtime_authorized_now_true", { paymentRuntimeAuthorizedNow: true });
  expect_rejected("entitlement_runtime_authorized_now_true",
    { entitlementRuntimeAuthorizedNow: true });
  expect_rejected("checkout_runtime_authorized_now_true", { checkoutRuntimeAuthorizedNow: true });

  // Authorization grants (all false)
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true",
    { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // Legal safety flags
  expect_rejected("exact_deadline_calculation_authorized_true",
    { exactDeadlineCalculationAuthorized: true });
  expect_rejected("delivery_date_invention_authorized_true",
    { deliveryDateInventionAuthorized: true });
  expect_rejected("final_date_invention_authorized_true",
    { finalDateInventionAuthorized: true });
  expect_rejected("legal_certainty_authorized_true", { legalCertaintyAuthorized: true });
  expect_rejected("coercive_legal_instruction_authorized_true",
    { coerciveLegalInstructionAuthorized: true });
  expect_rejected("delivery_date_required_for_exact_deadline_false",
    { deliveryDateRequiredForExactDeadline: false });

  // TD flags from 8.5V result
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_surgical_route_patch_performed_false",
    { td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("td005_boundary_post_patch_containment_audited_false",
    { td005PaidDocumentModeBoundaryPostPatchContainmentAudited: false });
  expect_rejected("td005_boundary_containment_confirmed_false",
    { td005PaidDocumentModeBoundaryContainmentConfirmed: false });
  expect_rejected("td005_ready_for_closure_decision_false",
    { td005PaidDocumentModeReadyForClosureDecision: false });
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

  // 8.5V forward readiness gate
  expect_rejected("ready_for_8x5w_closure_decision_false",
    { readyFor8x5WPaidDocumentModeBoundaryClosureDecision: false });
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

  // 8.5W core assertion flags
  expect_rejected("post_patch_audit_ready_for_closure_decision_false",
    { paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: false });
  expect_rejected("closure_decision_only_false",
    { paidDocumentModeBoundaryClosureDecisionOnly: false });
  expect_rejected("boundary_containment_closed_false",
    { paidDocumentModeBoundaryContainmentClosed: false });
  expect_rejected("boundary_client_flag_bypass_closed_false",
    { paidDocumentModeBoundaryClientFlagBypassClosed: false });
  expect_rejected("boundary_deny_by_default_closed_false",
    { paidDocumentModeBoundaryDenyByDefaultClosed: false });
  expect_rejected("boundary_server_entitlement_requirement_preserved_false",
    { paidDocumentModeBoundaryServerEntitlementRequirementPreserved: false });
  expect_rejected("boundary_actual_runtime_still_deferred_false",
    { paidDocumentModeBoundaryActualRuntimeStillDeferred: false });
  expect_rejected("paid_document_mode_runtime_still_not_implemented_w_false",
    { paidDocumentModeRuntimeStillNotImplementedW: false });
  expect_rejected("server_entitlement_verification_still_not_implemented_w_false",
    { paidDocumentModeServerEntitlementVerificationStillNotImplementedW: false });
  expect_rejected("document_processing_still_not_authorized_w_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorizedW: false });

  // 8.5W closure decision fields (all true)
  expect_rejected("closure_decision_td005_containment_closed_false",
    { closureDecisionTd005ContainmentClosed: false });
  expect_rejected("closure_decision_td005_client_flag_bypass_closed_false",
    { closureDecisionTd005ClientFlagBypassClosed: false });
  expect_rejected("closure_decision_td005_boundary_patch_accepted_false",
    { closureDecisionTd005BoundaryPatchAccepted: false });
  expect_rejected("closure_decision_td005_post_patch_audit_accepted_false",
    { closureDecisionTd005PostPatchAuditAccepted: false });
  expect_rejected("closure_decision_td005_runtime_implementation_deferred_false",
    { closureDecisionTd005RuntimeImplementationDeferred: false });
  expect_rejected("closure_decision_does_not_authorize_paid_document_mode_runtime_false",
    { closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_payment_runtime_false",
    { closureDecisionDoesNotAuthorizePaymentRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_checkout_runtime_false",
    { closureDecisionDoesNotAuthorizeCheckoutRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_entitlement_runtime_false",
    { closureDecisionDoesNotAuthorizeEntitlementRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_server_entitlement_verification_false",
    { closureDecisionDoesNotAuthorizeServerEntitlementVerification: false });
  expect_rejected("closure_decision_does_not_authorize_document_processing_false",
    { closureDecisionDoesNotAuthorizeDocumentProcessing: false });
  expect_rejected("closure_decision_does_not_authorize_ocr_runtime_false",
    { closureDecisionDoesNotAuthorizeOcrRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_file_runtime_false",
    { closureDecisionDoesNotAuthorizeFileRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_storage_false",
    { closureDecisionDoesNotAuthorizeStorage: false });
  expect_rejected("closure_decision_does_not_authorize_persistence_false",
    { closureDecisionDoesNotAuthorizePersistence: false });
  expect_rejected("closure_decision_does_not_authorize_user_visible_document_output_false",
    { closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: false });
  expect_rejected("closure_decision_does_not_authorize_public_runtime_false",
    { closureDecisionDoesNotAuthorizePublicRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_pilot_runtime_false",
    { closureDecisionDoesNotAuthorizePilotRuntime: false });
  expect_rejected("closure_decision_does_not_authorize_production_runtime_false",
    { closureDecisionDoesNotAuthorizeProductionRuntime: false });
  expect_rejected("closure_decision_requires_future_actual_runtime_implementation_false",
    { closureDecisionRequiresFutureActualRuntimeImplementation: false });
  expect_rejected("closure_decision_requires_future_pre_model_pii_redaction_false",
    { closureDecisionRequiresFuturePreModelPiiRedaction: false });
  expect_rejected("closure_decision_requires_future_evidence_gates_production_wiring_false",
    { closureDecisionRequiresFutureEvidenceGatesProductionWiring: false });
  expect_rejected("closure_decision_requires_future_server_entitlement_verification_false",
    { closureDecisionRequiresFutureServerEntitlementVerification: false });
  expect_rejected("closure_decision_requires_future_user_visible_output_contract_false",
    { closureDecisionRequiresFutureUserVisibleOutputContract: false });
  expect_rejected("closure_decision_requires_future_pilot_authorization_false",
    { closureDecisionRequiresFuturePilotAuthorization: false });

  // 8.5W containment closure confirmations (all true)
  expect_rejected("containment_closure_8x5u_deny_boundary_accepted_false",
    { containmentClosure8x5UDenyBoundaryAccepted: false });
  expect_rejected("containment_closure_8x5v_audit_accepted_false",
    { containmentClosure8x5VAuditAccepted: false });
  expect_rejected("containment_closure_smart_talk_route_deny_boundary_confirmed_false",
    { containmentClosureSmartTalkRouteDenyBoundaryConfirmed: false });
  expect_rejected("containment_closure_boundary_before_run_smart_talk_confirmed_false",
    { containmentClosureBoundaryBeforeRunSmartTalkConfirmed: false });
  expect_rejected("containment_closure_boundary_after_json_parse_confirmed_false",
    { containmentClosureBoundaryAfterJsonParseConfirmed: false });
  expect_rejected("containment_closure_boundary_after_text_validation_confirmed_false",
    { containmentClosureBoundaryAfterTextValidationConfirmed: false });
  expect_rejected("containment_closure_free_qa_lane_preserved_false",
    { containmentClosureFreeQaLanePreserved: false });
  expect_rejected("containment_closure_general_questions_preserved_false",
    { containmentClosureGeneralQuestionsPreserved: false });
  expect_rejected("containment_closure_8x5n_document_bypass_guard_preserved_false",
    { containmentClosure8x5NDocumentBypassGuardPreserved: false });
  expect_rejected("containment_closure_document_like_text_blocking_preserved_false",
    { containmentClosureDocumentLikeTextBlockingPreserved: false });
  expect_rejected("containment_closure_8x5h_photo_ocr_quarantine_preserved_false",
    { containmentClosure8x5HPhotoOcrQuarantinePreserved: false });
  expect_rejected("containment_closure_photo_route_unmodified_false",
    { containmentClosurePhotoRouteUnmodified: false });
  expect_rejected("containment_closure_no_photo_runtime_enabled_false",
    { containmentClosureNoPhotoRuntimeEnabled: false });
  expect_rejected("containment_closure_no_ocr_runtime_enabled_false",
    { containmentClosureNoOcrRuntimeEnabled: false });
  expect_rejected("containment_closure_no_file_runtime_enabled_false",
    { containmentClosureNoFileRuntimeEnabled: false });
  expect_rejected("containment_closure_no_storage_enabled_false",
    { containmentClosureNoStorageEnabled: false });
  expect_rejected("containment_closure_no_persistence_enabled_false",
    { containmentClosureNoPersistenceEnabled: false });
  expect_rejected("containment_closure_no_public_document_runtime_enabled_false",
    { containmentClosureNoPublicDocumentRuntimeEnabled: false });
  expect_rejected("containment_closure_client_flags_remain_untrusted_false",
    { containmentClosureClientFlagsRemainUntrusted: false });
  expect_rejected("containment_closure_no_entitled_lane_created_false",
    { containmentClosureNoEntitledLaneCreated: false });
  expect_rejected("containment_closure_no_payment_lane_created_false",
    { containmentClosureNoPaymentLaneCreated: false });
  expect_rejected("containment_closure_no_document_processing_lane_created_false",
    { containmentClosureNoDocumentProcessingLaneCreated: false });
  expect_rejected("containment_closure_no_user_visible_document_lane_created_false",
    { containmentClosureNoUserVisibleDocumentLaneCreated: false });

  // 8.5W actual mutation/runtime flags
  expect_rejected("actual_closure_decision_only_false",
    { actualClosureDecisionOnly: false });
  expect_rejected("actual_live_route_mutation_performed_in_this_phase_w_true",
    { actualLiveRouteMutationPerformedInThisPhaseW: true });
  expect_rejected("actual_smart_talk_route_modified_in_this_phase_w_true",
    { actualSmartTalkRouteModifiedInThisPhaseW: true });
  expect_rejected("actual_photo_route_modified_in_this_phase_w_true",
    { actualPhotoRouteModifiedInThisPhaseW: true });
  expect_rejected("actual_paid_document_boundary_already_implemented_by_8x5u_w_false",
    { actualPaidDocumentBoundaryAlreadyImplementedBy8x5UW: false });
  expect_rejected("actual_paid_document_boundary_implemented_in_this_phase_w_true",
    { actualPaidDocumentBoundaryImplementedInThisPhaseW: true });

  // 8.5W no-prohibited-side-effect confirmations (all true)
  expect_rejected("closure_decision_confirms_no_openai_call_false",
    { closureDecisionConfirmsNoOpenAiCall: false });
  expect_rejected("closure_decision_confirms_no_fetch_call_false",
    { closureDecisionConfirmsNoFetchCall: false });
  expect_rejected("closure_decision_confirms_no_process_env_read_false",
    { closureDecisionConfirmsNoProcessEnvRead: false });
  expect_rejected("closure_decision_confirms_no_sdk_usage_false",
    { closureDecisionConfirmsNoSdkUsage: false });
  expect_rejected("closure_decision_confirms_no_8x3ac_rerun_false",
    { closureDecisionConfirmsNo8x3AcRerun: false });
  expect_rejected("closure_decision_confirms_no_payment_runtime_call_false",
    { closureDecisionConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("closure_decision_confirms_no_stripe_call_false",
    { closureDecisionConfirmsNoStripeCall: false });
  expect_rejected("closure_decision_confirms_no_checkout_call_false",
    { closureDecisionConfirmsNoCheckoutCall: false });
  expect_rejected("closure_decision_confirms_no_entitlement_runtime_call_false",
    { closureDecisionConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("closure_decision_confirms_no_server_entitlement_verification_false",
    { closureDecisionConfirmsNoServerEntitlementVerification: false });
  expect_rejected("closure_decision_confirms_no_ocr_runtime_call_false",
    { closureDecisionConfirmsNoOcrRuntimeCall: false });
  expect_rejected("closure_decision_confirms_no_storage_mutation_false",
    { closureDecisionConfirmsNoStorageMutation: false });
  expect_rejected("closure_decision_confirms_no_database_write_false",
    { closureDecisionConfirmsNoDatabaseWrite: false });
  expect_rejected("closure_decision_confirms_no_audit_persistence_false",
    { closureDecisionConfirmsNoAuditPersistence: false });
  expect_rejected("closure_decision_confirms_no_user_visible_document_explanation_false",
    { closureDecisionConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("closure_decision_confirms_no_evidence_evaluation_false",
    { closureDecisionConfirmsNoEvidenceEvaluation: false });
  expect_rejected("closure_decision_confirms_no_claim_authorization_false",
    { closureDecisionConfirmsNoClaimAuthorization: false });
  expect_rejected("closure_decision_confirms_no_deadline_calculation_false",
    { closureDecisionConfirmsNoDeadlineCalculation: false });
  expect_rejected("closure_decision_confirms_no_legal_certainty_false",
    { closureDecisionConfirmsNoLegalCertainty: false });
  expect_rejected("closure_decision_confirms_no_prompt_build_false",
    { closureDecisionConfirmsNoPromptBuild: false });
  expect_rejected("closure_decision_confirms_no_model_call_false",
    { closureDecisionConfirmsNoModelCall: false });
  expect_rejected("closure_decision_confirms_no_run_smart_talk_call_false",
    { closureDecisionConfirmsNoRunSmartTalkCall: false });
  expect_rejected("closure_decision_confirms_no_route_handler_call_false",
    { closureDecisionConfirmsNoRouteHandlerCall: false });
  expect_rejected("closure_decision_confirms_no_route_import_false",
    { closureDecisionConfirmsNoRouteImport: false });
  expect_rejected("closure_decision_confirms_no_filesystem_read_false",
    { closureDecisionConfirmsNoFilesystemRead: false });
  expect_rejected("closure_decision_confirms_no_photo_route_modification_false",
    { closureDecisionConfirmsNoPhotoRouteModification: false });

  // 8.5W TD result flags
  expect_rejected("td005_boundary_containment_closed_result_false",
    { td005PaidDocumentModeBoundaryContainmentClosedResult: false });
  expect_rejected("td005_client_flag_bypass_closed_result_false",
    { td005PaidDocumentModeClientFlagBypassClosedResult: false });
  expect_rejected("td005_actual_runtime_implementation_deferred_result_false",
    { td005PaidDocumentModeActualRuntimeImplementationDeferredResult: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_result_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: false });
  expect_rejected("td004_false_result", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_false_result",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // 8.5W forward readiness
  expect_rejected("ready_for_pre_model_pii_redaction_phase_false",
    { readyForPreModelPiiRedactionPhase: false });
  expect_rejected("ready_for_evidence_gates_production_wiring_phase_true",
    { readyForEvidenceGatesProductionWiringPhase: true });
  expect_rejected("ready_for_server_entitlement_verification_phase_true",
    { readyForServerEntitlementVerificationPhase: true });
  expect_rejected("ready_for_paid_document_mode_actual_runtime_implementation_phase_true",
    { readyForPaidDocumentModeActualRuntimeImplementationPhase: true });
  expect_rejected("ready_for_separate_runtime_authorization_result_true",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhaseResult: true });
  expect_rejected("ready_for_pilot_authorization_result_true",
    { readyForControlledRealDocumentPilotAuthorizationPhaseResult: true });
  expect_rejected("ready_for_production_authorization_result_true",
    { readyForControlledRealDocumentProductionAuthorizationPhaseResult: true });
  expect_rejected("ready_for_real_document_input_result_true",
    { readyForRealDocumentInputResult: true });
  expect_rejected("ready_for_user_visible_output_result_true",
    { readyForUserVisibleOutputResult: true });
  expect_rejected("public_runtime_enabled_result_true", { publicRuntimeEnabledResult: true });
  expect_rejected("persistence_used_result_true", { persistenceUsedResult: true });
  expect_rejected("never_user_visible_result_false", { neverUserVisibleResult: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPaidDocumentModeBoundaryClosureDecision(): ControlledRealDocumentPaidDocumentModeBoundaryClosureDecisionResult {
  const canonical = buildCanonical8x5WInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateClosureDecisionInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5W",
    allPassed,
    paidDocumentModeBoundaryPostPatchAuditReadyForClosureDecision: true,
    controlledRealDocumentPaidDocumentModeBoundaryClosureDecisionAccepted: allPassed,
    paidDocumentModeBoundaryClosureDecisionOnly: true,
    paidDocumentModeBoundaryContainmentClosed: true,
    paidDocumentModeBoundaryClientFlagBypassClosed: true,
    paidDocumentModeBoundaryDenyByDefaultClosed: true,
    paidDocumentModeBoundaryServerEntitlementRequirementPreserved: true,
    paidDocumentModeBoundaryActualRuntimeStillDeferred: true,
    paidDocumentModeRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeServerEntitlementVerificationStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    closureDecisionTd005ContainmentClosed: true,
    closureDecisionTd005ClientFlagBypassClosed: true,
    closureDecisionTd005BoundaryPatchAccepted: true,
    closureDecisionTd005PostPatchAuditAccepted: true,
    closureDecisionTd005RuntimeImplementationDeferred: true,
    closureDecisionDoesNotAuthorizePaidDocumentModeRuntime: true,
    closureDecisionDoesNotAuthorizePaymentRuntime: true,
    closureDecisionDoesNotAuthorizeCheckoutRuntime: true,
    closureDecisionDoesNotAuthorizeEntitlementRuntime: true,
    closureDecisionDoesNotAuthorizeServerEntitlementVerification: true,
    closureDecisionDoesNotAuthorizeDocumentProcessing: true,
    closureDecisionDoesNotAuthorizeOcrRuntime: true,
    closureDecisionDoesNotAuthorizeFileRuntime: true,
    closureDecisionDoesNotAuthorizeStorage: true,
    closureDecisionDoesNotAuthorizePersistence: true,
    closureDecisionDoesNotAuthorizeUserVisibleDocumentOutput: true,
    closureDecisionDoesNotAuthorizePublicRuntime: true,
    closureDecisionDoesNotAuthorizePilotRuntime: true,
    closureDecisionDoesNotAuthorizeProductionRuntime: true,
    closureDecisionRequiresFutureActualRuntimeImplementation: true,
    closureDecisionRequiresFuturePreModelPiiRedaction: true,
    closureDecisionRequiresFutureEvidenceGatesProductionWiring: true,
    closureDecisionRequiresFutureServerEntitlementVerification: true,
    closureDecisionRequiresFutureUserVisibleOutputContract: true,
    closureDecisionRequiresFuturePilotAuthorization: true,

    containmentClosure8x5UDenyBoundaryAccepted: true,
    containmentClosure8x5VAuditAccepted: true,
    containmentClosureSmartTalkRouteDenyBoundaryConfirmed: true,
    containmentClosureBoundaryBeforeRunSmartTalkConfirmed: true,
    containmentClosureBoundaryAfterJsonParseConfirmed: true,
    containmentClosureBoundaryAfterTextValidationConfirmed: true,
    containmentClosureFreeQaLanePreserved: true,
    containmentClosureGeneralQuestionsPreserved: true,
    containmentClosure8x5NDocumentBypassGuardPreserved: true,
    containmentClosureDocumentLikeTextBlockingPreserved: true,
    containmentClosure8x5HPhotoOcrQuarantinePreserved: true,
    containmentClosurePhotoRouteUnmodified: true,
    containmentClosureNoPhotoRuntimeEnabled: true,
    containmentClosureNoOcrRuntimeEnabled: true,
    containmentClosureNoFileRuntimeEnabled: true,
    containmentClosureNoStorageEnabled: true,
    containmentClosureNoPersistenceEnabled: true,
    containmentClosureNoPublicDocumentRuntimeEnabled: true,
    containmentClosureClientFlagsRemainUntrusted: true,
    containmentClosureNoEntitledLaneCreated: true,
    containmentClosureNoPaymentLaneCreated: true,
    containmentClosureNoDocumentProcessingLaneCreated: true,
    containmentClosureNoUserVisibleDocumentLaneCreated: true,

    actualClosureDecisionOnly: true,
    actualLiveRouteMutationPerformedInThisPhase: false,
    actualSmartTalkRouteModifiedInThisPhase: false,
    actualPhotoRouteModifiedInThisPhase: false,
    actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: true,
    actualPaidDocumentBoundaryImplementedInThisPhase: false,
    actualPaidDocumentModeImplemented: false,
    actualPaymentRuntimeImplemented: false,
    actualCheckoutImplemented: false,
    actualEntitlementRuntimeImplemented: false,
    actualServerEntitlementVerificationImplemented: false,
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

    closureDecisionConfirmsNoOpenAiCall: true,
    closureDecisionConfirmsNoFetchCall: true,
    closureDecisionConfirmsNoProcessEnvRead: true,
    closureDecisionConfirmsNoSdkUsage: true,
    closureDecisionConfirmsNo8x3AcRerun: true,
    closureDecisionConfirmsNoPaymentRuntimeCall: true,
    closureDecisionConfirmsNoStripeCall: true,
    closureDecisionConfirmsNoCheckoutCall: true,
    closureDecisionConfirmsNoEntitlementRuntimeCall: true,
    closureDecisionConfirmsNoServerEntitlementVerification: true,
    closureDecisionConfirmsNoOcrRuntimeCall: true,
    closureDecisionConfirmsNoStorageMutation: true,
    closureDecisionConfirmsNoDatabaseWrite: true,
    closureDecisionConfirmsNoAuditPersistence: true,
    closureDecisionConfirmsNoUserVisibleDocumentExplanation: true,
    closureDecisionConfirmsNoEvidenceEvaluation: true,
    closureDecisionConfirmsNoClaimAuthorization: true,
    closureDecisionConfirmsNoDeadlineCalculation: true,
    closureDecisionConfirmsNoLegalCertainty: true,
    closureDecisionConfirmsNoPromptBuild: true,
    closureDecisionConfirmsNoModelCall: true,
    closureDecisionConfirmsNoRunSmartTalkCall: true,
    closureDecisionConfirmsNoRouteHandlerCall: true,
    closureDecisionConfirmsNoRouteImport: true,
    closureDecisionConfirmsNoFilesystemRead: true,
    closureDecisionConfirmsNoPhotoRouteModification: true,

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

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    td001DocumentBypassGuardContainmentClosed: true,
    td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: true,
    td005PaidDocumentModeBoundaryPostPatchContainmentAudited: true,
    td005PaidDocumentModeBoundaryContainmentClosed: true,
    td005PaidDocumentModeClientFlagBypassClosed: true,
    td005PaidDocumentModeActualRuntimeImplementationDeferred: true,
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

    readyForPreModelPiiRedactionPhase: true,
    readyForEvidenceGatesProductionWiringPhase: false,
    readyForServerEntitlementVerificationPhase: false,
    readyForPaidDocumentModeActualRuntimeImplementationPhase: false,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5W is a Paid Document Mode Boundary Closure Decision.",
      "8.5W depends on completed 8.5V post-patch containment audit.",
      "8.5W is closure-decision-only and creates no runtime behavior.",
      "8.5W does not modify /api/smart-talk.",
      "8.5W does not modify /api/smart-talk-photo.",
      "8.5W closes TD-005 containment/boundary work for client-side paid/document/entitlement flag bypass.",
      "8.5W does not close actual Paid Document Mode runtime implementation.",
      "8.5W defers actual Paid Document Mode runtime implementation to a future separately authorized phase.",
      "Payment, checkout, and entitlement runtime were not implemented.",
      "Server entitlement verification runtime was not implemented.",
      "Paid Document Mode runtime was not implemented.",
      "Document processing runtime was not implemented.",
      "No real document input or processing was performed.",
      "No OCR/photo/file/storage/persistence was performed.",
      "No prompt build, model call, or runSmartTalk call was performed by this validation.",
      "No user-visible document explanation was enabled.",
      "No public runtime was enabled.",
      "No runtime/pilot/production/final/go-live authorization was granted.",
      "8.5N Free Q&A document bypass guard remains closed.",
      "8.5H photo OCR quarantine remains preserved.",
      "TD-005 containment is closed, but actual runtime implementation remains deferred.",
      "TD-004 remains unresolved and is the next recommended blocker chain.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "readyForPreModelPiiRedactionPhase is planning/readiness only, not runtime authorization.",
      "readyForRealDocumentInput remains false.",
      "readyForUserVisibleOutput remains false.",
    ],
  };
}
