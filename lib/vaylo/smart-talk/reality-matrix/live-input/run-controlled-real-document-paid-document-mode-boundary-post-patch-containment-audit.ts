/**
 * Phase 8.5V — Controlled Real Document Paid Document Mode Boundary
 * Post-Patch Containment Audit.
 *
 * AUDIT-ONLY — NO RUNTIME BEHAVIOR — DEPENDS ON 8.5U.
 *
 * This phase audits the post-patch containment state after the 8.5U surgical
 * route patch. It confirms that the deny-by-default boundary is in place,
 * that client-side paid/document/entitlement flags remain untrusted, and that
 * no actual Paid Document Mode runtime has been enabled.
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

import { runControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatch } from "./run-controlled-real-document-paid-document-mode-boundary-surgical-route-patch";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditInput {
  // 8.5U prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchOnly: boolean;
  readonly paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: boolean;
  readonly paidDocumentModeRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;
  readonly prereqTamperCasesRejected: boolean;

  // 8.5U actual route mutation flags (some must be true, some false)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualSmartTalkRouteModified: boolean;
  readonly actualPhotoRouteModified: boolean;
  readonly actualPaidDocumentBoundaryImplemented: boolean;
  readonly actualPaidDocumentBoundaryDenyByDefaultOnly: boolean;
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

  // 8.5U boundary placement confirmations (all true)
  readonly paidBoundarySurgicalPatchPlacedAfterJsonParse: boolean;
  readonly paidBoundarySurgicalPatchPlacedAfterTextValidation: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforePromptBuild: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeModelCall: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeStorage: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforePersistence: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: boolean;
  readonly paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: boolean;

  // 8.5U detection/denial confirmations (all true)
  readonly paidBoundarySurgicalPatchDetectsClientDocumentModeField: boolean;
  readonly paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: boolean;
  readonly paidBoundarySurgicalPatchDetectsClientEntitlementField: boolean;
  readonly paidBoundarySurgicalPatchDetectsClientPaidFlag: boolean;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: boolean;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: boolean;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: boolean;
  readonly paidBoundarySurgicalPatchRequiresFutureServerEntitlement: boolean;
  readonly paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: boolean;
  readonly paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: boolean;
  readonly paidBoundarySurgicalPatchDoesNotTrustClientFlags: boolean;
  readonly paidBoundarySurgicalPatchDenyByDefault: boolean;

  // 8.5U unauthorized response confirmations (all true)
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: boolean;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: boolean;

  // 8.5U preservation confirmations (all true)
  readonly paidBoundarySurgicalPatchPreservesFreeQaLane: boolean;
  readonly paidBoundarySurgicalPatchPreservesGeneralQuestions: boolean;
  readonly paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: boolean;
  readonly paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: boolean;
  readonly paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: boolean;
  readonly paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: boolean;
  readonly paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: boolean;
  readonly paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: boolean;
  readonly paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: boolean;
  readonly paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: boolean;

  // 8.5U no-prohibited-side-effect confirmations (all true)
  readonly paidBoundarySurgicalPatchConfirmsNoOpenAiCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoFetchCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoSdkUsage: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoStripeCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoCheckoutCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoStorageMutation: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoAuditPersistence: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoLegalCertainty: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoPromptBuild: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoModelCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: boolean;
  readonly paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: boolean;

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

  // TD flags from 8.5U result
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: boolean;
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

  // 8.5U forward readiness gate
  readonly readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5V core assertion flags
  readonly paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: boolean;
  readonly paidDocumentModeBoundaryPostPatchContainmentAudited: boolean;
  readonly paidDocumentModeBoundaryPostPatchContainmentAuditOnly: boolean;
  readonly paidDocumentModeBoundaryContainmentConfirmed: boolean;
  readonly paidDocumentModeBoundaryDenyByDefaultConfirmed: boolean;
  readonly paidDocumentModeBoundaryClientFlagBypassBlocked: boolean;
  readonly paidDocumentModeBoundaryServerEntitlementStillRequired: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplemented: boolean;

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

  // 8.5V TD result flags
  readonly td005PaidDocumentModeBoundaryPostPatchContainmentAudited: boolean;
  readonly td005PaidDocumentModeBoundaryContainmentConfirmed: boolean;
  readonly td005PaidDocumentModeReadyForClosureDecision: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: boolean;

  // 8.5V forward readiness
  readonly readyFor8x5WPaidDocumentModeBoundaryClosureDecision: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditResult {
  readonly checkId: "8.5V";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: true;
  readonly controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted: boolean;
  readonly paidDocumentModeBoundaryPostPatchContainmentAudited: true;
  readonly paidDocumentModeBoundaryPostPatchContainmentAuditOnly: true;
  readonly paidDocumentModeBoundaryContainmentConfirmed: true;
  readonly paidDocumentModeBoundaryDenyByDefaultConfirmed: true;
  readonly paidDocumentModeBoundaryClientFlagBypassBlocked: true;
  readonly paidDocumentModeBoundaryServerEntitlementStillRequired: true;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeServerEntitlementVerificationStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Post-patch containment confirmations
  readonly postPatchSmartTalkRouteContainsDenyBoundary: true;
  readonly postPatchDenyBoundaryBeforeRunSmartTalk: true;
  readonly postPatchDenyBoundaryAfterJsonParse: true;
  readonly postPatchDenyBoundaryAfterTextValidation: true;
  readonly postPatchDenyBoundaryBeforePromptBuild: true;
  readonly postPatchDenyBoundaryBeforeModelCall: true;
  readonly postPatchDenyBoundaryBeforeDocumentProcessing: true;
  readonly postPatchDenyBoundaryBeforeStorage: true;
  readonly postPatchDenyBoundaryBeforePersistence: true;
  readonly postPatchDenyBoundaryBeforeUserVisibleOutput: true;
  readonly postPatchDenyBoundaryRejectsClientDocumentModeFlag: true;
  readonly postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag: true;
  readonly postPatchDenyBoundaryRejectsClientEntitlementFlag: true;
  readonly postPatchDenyBoundaryRejectsClientPaidFlag: true;
  readonly postPatchDenyBoundaryDoesNotTrustClientFlags: true;
  readonly postPatchDenyBoundaryDoesNotCreateEntitledLane: true;
  readonly postPatchDenyBoundaryDoesNotCreatePaymentLane: true;
  readonly postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane: true;
  readonly postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane: true;
  readonly postPatchDenyBoundaryUsesDocumentModeRequiredCode: true;
  readonly postPatchDenyBoundaryReturnsOkFalse: true;
  readonly postPatchDenyBoundaryReturnsNonSuccessStatus: true;
  readonly postPatchDenyBoundaryDoesNotEchoRawDocument: true;
  readonly postPatchDenyBoundaryDoesNotSummarizeDocument: true;
  readonly postPatchDenyBoundaryDoesNotTranslateDocument: true;
  readonly postPatchDenyBoundaryDoesNotExplainDocument: true;
  readonly postPatchDenyBoundaryDoesNotGiveLegalAdvice: true;
  readonly postPatchDenyBoundaryDoesNotCalculateDeadline: true;
  readonly postPatchDenyBoundaryDoesNotExposeInternalGovernance: true;

  // Preservation confirmations
  readonly postPatchFreeQaLanePreserved: true;
  readonly postPatchGeneralQuestionsPreserved: true;
  readonly postPatch8x5NDocumentBypassGuardPreserved: true;
  readonly postPatchDocumentLikeTextBlockingPreserved: true;
  readonly postPatchDocumentModeRequiredResponsePreserved: true;
  readonly postPatch8x5HPhotoOcrQuarantinePreserved: true;
  readonly postPatchPhotoRouteUnmodified: true;
  readonly postPatchNoPhotoRuntimeEnabled: true;
  readonly postPatchNoOcrRuntimeEnabled: true;
  readonly postPatchNoFileRuntimeEnabled: true;
  readonly postPatchNoStorageEnabled: true;
  readonly postPatchNoPersistenceEnabled: true;
  readonly postPatchNoPublicDocumentRuntimeEnabled: true;

  // Actual mutation/runtime flags
  readonly actualPostPatchAuditOnly: true;
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
  readonly postPatchAuditConfirmsNoOpenAiCall: true;
  readonly postPatchAuditConfirmsNoFetchCall: true;
  readonly postPatchAuditConfirmsNoProcessEnvRead: true;
  readonly postPatchAuditConfirmsNoSdkUsage: true;
  readonly postPatchAuditConfirmsNo8x3AcRerun: true;
  readonly postPatchAuditConfirmsNoPaymentRuntimeCall: true;
  readonly postPatchAuditConfirmsNoStripeCall: true;
  readonly postPatchAuditConfirmsNoCheckoutCall: true;
  readonly postPatchAuditConfirmsNoEntitlementRuntimeCall: true;
  readonly postPatchAuditConfirmsNoServerEntitlementVerification: true;
  readonly postPatchAuditConfirmsNoOcrRuntimeCall: true;
  readonly postPatchAuditConfirmsNoStorageMutation: true;
  readonly postPatchAuditConfirmsNoDatabaseWrite: true;
  readonly postPatchAuditConfirmsNoAuditPersistence: true;
  readonly postPatchAuditConfirmsNoUserVisibleDocumentExplanation: true;
  readonly postPatchAuditConfirmsNoEvidenceEvaluation: true;
  readonly postPatchAuditConfirmsNoClaimAuthorization: true;
  readonly postPatchAuditConfirmsNoDeadlineCalculation: true;
  readonly postPatchAuditConfirmsNoLegalCertainty: true;
  readonly postPatchAuditConfirmsNoPromptBuild: true;
  readonly postPatchAuditConfirmsNoModelCall: true;
  readonly postPatchAuditConfirmsNoRunSmartTalkCall: true;
  readonly postPatchAuditConfirmsNoRouteHandlerCall: true;
  readonly postPatchAuditConfirmsNoRouteImport: true;
  readonly postPatchAuditConfirmsNoFilesystemRead: true;
  readonly postPatchAuditConfirmsNoPhotoRouteModification: true;

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
  readonly td005PaidDocumentModeBoundaryContainmentConfirmed: true;
  readonly td005PaidDocumentModeReadyForClosureDecision: true;
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
  readonly readyFor8x5WPaidDocumentModeBoundaryClosureDecision: true;
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

function validatePostPatchAuditInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5U prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5U") reasons.push("prereq_check_id_must_be_8x5U");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch"] !== true)
    reasons.push("execution_contract_ready_for_surgical_route_patch_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted"] !== true)
    reasons.push("surgical_route_patch_not_accepted");
  if (o["paidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("surgical_route_patch_performed_false");
  if (o["paidDocumentModeBoundarySurgicalRoutePatchOnly"] !== true)
    reasons.push("surgical_route_patch_only_false");
  if (o["paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly"] !== true)
    reasons.push("implemented_as_deny_by_default_only_false");
  if (o["paidDocumentModeRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_runtime_still_not_implemented_false");
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
  if (o["prereqTamperCasesRejected"] !== true)
    reasons.push("prereq_tamper_cases_rejected_false");

  // 8.5U actual route mutation flags
  // (must be true in prereq: actualLiveRouteMutationPerformed, actualSmartTalkRouteModified,
  //  actualPaidDocumentBoundaryImplemented, actualPaidDocumentBoundaryDenyByDefaultOnly)
  if (o["actualLiveRouteMutationPerformed"] !== true)
    reasons.push("prereq_actual_live_route_mutation_performed_must_be_true");
  if (o["actualSmartTalkRouteModified"] !== true)
    reasons.push("prereq_actual_smart_talk_route_modified_must_be_true");
  if (o["actualPhotoRouteModified"] !== false)
    reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentBoundaryImplemented"] !== true)
    reasons.push("prereq_actual_paid_document_boundary_implemented_must_be_true");
  if (o["actualPaidDocumentBoundaryDenyByDefaultOnly"] !== true)
    reasons.push("prereq_actual_paid_document_boundary_deny_by_default_only_must_be_true");
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

  // 8.5U boundary placement confirmations (all true)
  if (o["paidBoundarySurgicalPatchPlacedAfterJsonParse"] !== true)
    reasons.push("prereq_patch_placed_after_json_parse_false");
  if (o["paidBoundarySurgicalPatchPlacedAfterTextValidation"] !== true)
    reasons.push("prereq_patch_placed_after_text_validation_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk"] !== true)
    reasons.push("prereq_patch_placed_before_run_smart_talk_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforePromptBuild"] !== true)
    reasons.push("prereq_patch_placed_before_prompt_build_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeModelCall"] !== true)
    reasons.push("prereq_patch_placed_before_model_call_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing"] !== true)
    reasons.push("prereq_patch_placed_before_document_processing_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeStorage"] !== true)
    reasons.push("prereq_patch_placed_before_storage_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforePersistence"] !== true)
    reasons.push("prereq_patch_placed_before_persistence_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput"] !== true)
    reasons.push("prereq_patch_placed_before_user_visible_output_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime"] !== true)
    reasons.push("prereq_patch_placed_before_evidence_gate_runtime_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization"] !== true)
    reasons.push("prereq_patch_placed_before_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation"] !== true)
    reasons.push("prereq_patch_placed_before_deadline_calculation_false");

  // 8.5U detection/denial confirmations (all true)
  if (o["paidBoundarySurgicalPatchDetectsClientDocumentModeField"] !== true)
    reasons.push("prereq_patch_detects_client_document_mode_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField"] !== true)
    reasons.push("prereq_patch_detects_client_paid_document_mode_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientEntitlementField"] !== true)
    reasons.push("prereq_patch_detects_client_entitlement_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientPaidFlag"] !== true)
    reasons.push("prereq_patch_detects_client_paid_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag"] !== true)
    reasons.push("prereq_patch_rejects_client_only_paid_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag"] !== true)
    reasons.push("prereq_patch_rejects_client_only_document_mode_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag"] !== true)
    reasons.push("prereq_patch_rejects_client_only_entitlement_flag_false");
  if (o["paidBoundarySurgicalPatchRequiresFutureServerEntitlement"] !== true)
    reasons.push("prereq_patch_requires_future_server_entitlement_false");
  if (o["paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime"] !== true)
    reasons.push("prereq_patch_denies_missing_server_entitlement_runtime_false");
  if (o["paidBoundarySurgicalPatchDoesNotTrustUiOnlyState"] !== true)
    reasons.push("prereq_patch_does_not_trust_ui_only_state_false");
  if (o["paidBoundarySurgicalPatchDoesNotTrustClientFlags"] !== true)
    reasons.push("prereq_patch_does_not_trust_client_flags_false");
  if (o["paidBoundarySurgicalPatchDenyByDefault"] !== true)
    reasons.push("prereq_patch_deny_by_default_false");

  // 8.5U unauthorized response confirmations (all true)
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess"] !== true)
    reasons.push("prereq_patch_unauthorized_response_non_success_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseOkFalse"] !== true)
    reasons.push("prereq_patch_unauthorized_response_ok_false_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("prereq_patch_unauthorized_response_code_document_mode_required_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_raw_document_echo_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_translation_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoSummary"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_summary_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_explanation_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_legal_advice_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_deadline_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_legal_certainty_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance"] !== true)
    reasons.push("prereq_patch_unauthorized_response_no_internal_governance_false");

  // 8.5U preservation confirmations (all true)
  if (o["paidBoundarySurgicalPatchPreservesFreeQaLane"] !== true)
    reasons.push("prereq_patch_preserves_free_qa_lane_false");
  if (o["paidBoundarySurgicalPatchPreservesGeneralQuestions"] !== true)
    reasons.push("prereq_patch_preserves_general_questions_false");
  if (o["paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard"] !== true)
    reasons.push("prereq_patch_preserves_8x5n_document_bypass_guard_false");
  if (o["paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa"] !== true)
    reasons.push("prereq_patch_preserves_document_like_text_blocking_false");
  if (o["paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse"] !== true)
    reasons.push("prereq_patch_preserves_document_mode_required_response_false");
  if (o["paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine"] !== true)
    reasons.push("prereq_patch_preserves_8x5h_photo_ocr_quarantine_false");
  if (o["paidBoundarySurgicalPatchDoesNotModifyPhotoRoute"] !== true)
    reasons.push("prereq_patch_does_not_modify_photo_route_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing"] !== true)
    reasons.push("prereq_patch_does_not_enable_document_processing_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation"] !== true)
    reasons.push("prereq_patch_does_not_enable_user_visible_document_explanation_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnablePublicRuntime"] !== true)
    reasons.push("prereq_patch_does_not_enable_public_runtime_false");

  // 8.5U no-prohibited-side-effect confirmations (all true)
  if (o["paidBoundarySurgicalPatchConfirmsNoOpenAiCall"] !== true)
    reasons.push("prereq_patch_confirms_no_openai_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoFetchCall"] !== true)
    reasons.push("prereq_patch_confirms_no_fetch_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoProcessEnvRead"] !== true)
    reasons.push("prereq_patch_confirms_no_process_env_read_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoSdkUsage"] !== true)
    reasons.push("prereq_patch_confirms_no_sdk_usage_false");
  if (o["paidBoundarySurgicalPatchConfirmsNo8x3AcRerun"] !== true)
    reasons.push("prereq_patch_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("prereq_patch_confirms_no_payment_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoStripeCall"] !== true)
    reasons.push("prereq_patch_confirms_no_stripe_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoCheckoutCall"] !== true)
    reasons.push("prereq_patch_confirms_no_checkout_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("prereq_patch_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("prereq_patch_confirms_no_server_entitlement_verification_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("prereq_patch_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoStorageMutation"] !== true)
    reasons.push("prereq_patch_confirms_no_storage_mutation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoDatabaseWrite"] !== true)
    reasons.push("prereq_patch_confirms_no_database_write_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoAuditPersistence"] !== true)
    reasons.push("prereq_patch_confirms_no_audit_persistence_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("prereq_patch_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("prereq_patch_confirms_no_evidence_evaluation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoClaimAuthorization"] !== true)
    reasons.push("prereq_patch_confirms_no_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("prereq_patch_confirms_no_deadline_calculation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoLegalCertainty"] !== true)
    reasons.push("prereq_patch_confirms_no_legal_certainty_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPromptBuild"] !== true)
    reasons.push("prereq_patch_confirms_no_prompt_build_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoModelCall"] !== true)
    reasons.push("prereq_patch_confirms_no_model_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("prereq_patch_confirms_no_run_smart_talk_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("prereq_patch_confirms_no_photo_route_modification_false");

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

  // TD flags from 8.5U result
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("td005_boundary_surgical_route_patch_performed_false");
  if (o["td005PaidDocumentModeStillRequiresPostPatchContainmentAudit"] !== true)
    reasons.push("td005_still_requires_post_patch_containment_audit_false");
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

  // 8.5U forward readiness gate
  if (o["readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit"] !== true)
    reasons.push("ready_for_8x5v_post_patch_containment_audit_false");
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

  // 8.5V core assertion flags
  if (o["paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit"] !== true)
    reasons.push("surgical_route_patch_ready_for_post_patch_audit_false");
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
  if (o["paidDocumentModeServerEntitlementVerificationStillNotImplemented"] !== true)
    reasons.push("server_entitlement_verification_still_not_implemented_false");

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
    reasons.push("actual_post_patch_audit_only_must_be_true");
  if (o["actualLiveRouteMutationPerformedInThisPhase"] !== false)
    reasons.push("actual_live_route_mutation_performed_in_this_phase_must_be_false");
  if (o["actualSmartTalkRouteModifiedInThisPhase"] !== false)
    reasons.push("actual_smart_talk_route_modified_in_this_phase_must_be_false");
  if (o["actualPhotoRouteModifiedInThisPhase"] !== false)
    reasons.push("actual_photo_route_modified_in_this_phase_must_be_false");
  if (o["actualPaidDocumentBoundaryAlreadyImplementedBy8x5U"] !== true)
    reasons.push("actual_paid_document_boundary_already_implemented_by_8x5u_must_be_true");
  if (o["actualPaidDocumentBoundaryImplementedInThisPhase"] !== false)
    reasons.push("actual_paid_document_boundary_implemented_in_this_phase_must_be_false");

  // 8.5V no-prohibited-side-effect confirmations (all true)
  if (o["postPatchAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_openai_call_false");
  if (o["postPatchAuditConfirmsNoFetchCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_fetch_call_false");
  if (o["postPatchAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("post_patch_audit_confirms_no_process_env_read_false");
  if (o["postPatchAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("post_patch_audit_confirms_no_sdk_usage_false");
  if (o["postPatchAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("post_patch_audit_confirms_no_8x3ac_rerun_false");
  if (o["postPatchAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_payment_runtime_call_false");
  if (o["postPatchAuditConfirmsNoStripeCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_stripe_call_false");
  if (o["postPatchAuditConfirmsNoCheckoutCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_checkout_call_false");
  if (o["postPatchAuditConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_entitlement_runtime_call_false");
  if (o["postPatchAuditConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("post_patch_audit_confirms_no_server_entitlement_verification_false");
  if (o["postPatchAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_ocr_runtime_call_false");
  if (o["postPatchAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("post_patch_audit_confirms_no_storage_mutation_false");
  if (o["postPatchAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("post_patch_audit_confirms_no_database_write_false");
  if (o["postPatchAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("post_patch_audit_confirms_no_audit_persistence_false");
  if (o["postPatchAuditConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("post_patch_audit_confirms_no_user_visible_document_explanation_false");
  if (o["postPatchAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("post_patch_audit_confirms_no_evidence_evaluation_false");
  if (o["postPatchAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("post_patch_audit_confirms_no_claim_authorization_false");
  if (o["postPatchAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("post_patch_audit_confirms_no_deadline_calculation_false");
  if (o["postPatchAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("post_patch_audit_confirms_no_legal_certainty_false");
  if (o["postPatchAuditConfirmsNoPromptBuild"] !== true)
    reasons.push("post_patch_audit_confirms_no_prompt_build_false");
  if (o["postPatchAuditConfirmsNoModelCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_model_call_false");
  if (o["postPatchAuditConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_run_smart_talk_call_false");
  if (o["postPatchAuditConfirmsNoRouteHandlerCall"] !== true)
    reasons.push("post_patch_audit_confirms_no_route_handler_call_false");
  if (o["postPatchAuditConfirmsNoRouteImport"] !== true)
    reasons.push("post_patch_audit_confirms_no_route_import_false");
  if (o["postPatchAuditConfirmsNoFilesystemRead"] !== true)
    reasons.push("post_patch_audit_confirms_no_filesystem_read_false");
  if (o["postPatchAuditConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("post_patch_audit_confirms_no_photo_route_modification_false");

  // 8.5V TD result flags
  if (o["td005PaidDocumentModeBoundaryPostPatchContainmentAudited"] !== true)
    reasons.push("td005_post_patch_containment_audited_false");
  if (o["td005PaidDocumentModeBoundaryContainmentConfirmed"] !== true)
    reasons.push("td005_boundary_containment_confirmed_false");
  if (o["td005PaidDocumentModeReadyForClosureDecision"] !== true)
    reasons.push("td005_ready_for_closure_decision_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_result_false");

  // 8.5V forward readiness
  if (o["readyFor8x5WPaidDocumentModeBoundaryClosureDecision"] !== true)
    reasons.push("ready_for_8x5w_closure_decision_false");
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

// ── Canonical 8.5V input ──────────────────────────────────────────────────────

function buildCanonical8x5VInput(): ControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditInput {
  const patchResult = runControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatch();
  return {
    // 8.5U prerequisite gate — core
    prereqCheckId: patchResult.checkId,
    prereqAllPassed: patchResult.allPassed,
    paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch:
      patchResult.paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch,
    controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted:
      patchResult.controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted,
    paidDocumentModeBoundarySurgicalRoutePatchPerformed:
      patchResult.paidDocumentModeBoundarySurgicalRoutePatchPerformed,
    paidDocumentModeBoundarySurgicalRoutePatchOnly:
      patchResult.paidDocumentModeBoundarySurgicalRoutePatchOnly,
    paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly:
      patchResult.paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly,
    paidDocumentModeRuntimeStillNotImplemented:
      patchResult.paidDocumentModeRuntimeStillNotImplemented,
    paidDocumentModePaymentRuntimeStillNotImplemented:
      patchResult.paidDocumentModePaymentRuntimeStillNotImplemented,
    paidDocumentModeCheckoutRuntimeStillNotImplemented:
      patchResult.paidDocumentModeCheckoutRuntimeStillNotImplemented,
    paidDocumentModeEntitlementRuntimeStillNotImplemented:
      patchResult.paidDocumentModeEntitlementRuntimeStillNotImplemented,
    paidDocumentModeDocumentProcessingStillNotAuthorized:
      patchResult.paidDocumentModeDocumentProcessingStillNotAuthorized,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized:
      patchResult.paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized,
    prereqTamperCasesRejected: patchResult.tamperCasesRejected,

    // 8.5U actual route mutation flags
    actualLiveRouteMutationPerformed: patchResult.actualLiveRouteMutationPerformed,
    actualSmartTalkRouteModified: patchResult.actualSmartTalkRouteModified,
    actualPhotoRouteModified: patchResult.actualPhotoRouteModified,
    actualPaidDocumentBoundaryImplemented: patchResult.actualPaidDocumentBoundaryImplemented,
    actualPaidDocumentBoundaryDenyByDefaultOnly: patchResult.actualPaidDocumentBoundaryDenyByDefaultOnly,
    actualPaidDocumentModeImplemented: patchResult.actualPaidDocumentModeImplemented,
    actualPaymentRuntimeImplemented: patchResult.actualPaymentRuntimeImplemented,
    actualCheckoutImplemented: patchResult.actualCheckoutImplemented,
    actualEntitlementRuntimeImplemented: patchResult.actualEntitlementRuntimeImplemented,
    actualServerEntitlementVerificationImplemented:
      patchResult.actualServerEntitlementVerificationImplemented,
    actualRealDocumentInputPerformed: patchResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: patchResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: patchResult.actualOcrPerformed,
    actualPhotoInputProcessed: patchResult.actualPhotoInputProcessed,
    actualFileInputProcessed: patchResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: patchResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: patchResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: patchResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: patchResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: patchResult.actualPublicRuntimeEnabled,
    actualPiiRedactionImplemented: patchResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: patchResult.actualEvidenceGateRuntimeWiringPerformed,
    actualClaimAuthorizationPerformed: patchResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: patchResult.actualDeadlineCalculationPerformed,
    actualPromptBuildPerformed: patchResult.actualPromptBuildPerformed,
    actualModelCallPerformed: patchResult.actualModelCallPerformed,
    actualRunSmartTalkCalled: patchResult.actualRunSmartTalkCalled,

    // 8.5U boundary placement confirmations
    paidBoundarySurgicalPatchPlacedAfterJsonParse:
      patchResult.paidBoundarySurgicalPatchPlacedAfterJsonParse,
    paidBoundarySurgicalPatchPlacedAfterTextValidation:
      patchResult.paidBoundarySurgicalPatchPlacedAfterTextValidation,
    paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk,
    paidBoundarySurgicalPatchPlacedBeforePromptBuild:
      patchResult.paidBoundarySurgicalPatchPlacedBeforePromptBuild,
    paidBoundarySurgicalPatchPlacedBeforeModelCall:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeModelCall,
    paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing,
    paidBoundarySurgicalPatchPlacedBeforeStorage:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeStorage,
    paidBoundarySurgicalPatchPlacedBeforePersistence:
      patchResult.paidBoundarySurgicalPatchPlacedBeforePersistence,
    paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput,
    paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime,
    paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization,
    paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation:
      patchResult.paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation,

    // 8.5U detection/denial confirmations
    paidBoundarySurgicalPatchDetectsClientDocumentModeField:
      patchResult.paidBoundarySurgicalPatchDetectsClientDocumentModeField,
    paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField:
      patchResult.paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField,
    paidBoundarySurgicalPatchDetectsClientEntitlementField:
      patchResult.paidBoundarySurgicalPatchDetectsClientEntitlementField,
    paidBoundarySurgicalPatchDetectsClientPaidFlag:
      patchResult.paidBoundarySurgicalPatchDetectsClientPaidFlag,
    paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag:
      patchResult.paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag,
    paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag:
      patchResult.paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag,
    paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag:
      patchResult.paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag,
    paidBoundarySurgicalPatchRequiresFutureServerEntitlement:
      patchResult.paidBoundarySurgicalPatchRequiresFutureServerEntitlement,
    paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime:
      patchResult.paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime,
    paidBoundarySurgicalPatchDoesNotTrustUiOnlyState:
      patchResult.paidBoundarySurgicalPatchDoesNotTrustUiOnlyState,
    paidBoundarySurgicalPatchDoesNotTrustClientFlags:
      patchResult.paidBoundarySurgicalPatchDoesNotTrustClientFlags,
    paidBoundarySurgicalPatchDenyByDefault: patchResult.paidBoundarySurgicalPatchDenyByDefault,

    // 8.5U unauthorized response confirmations
    paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess,
    paidBoundarySurgicalPatchUnauthorizedResponseOkFalse:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseOkFalse,
    paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired,
    paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho,
    paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation,
    paidBoundarySurgicalPatchUnauthorizedResponseNoSummary:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoSummary,
    paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice,
    paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty,
    paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization,
    paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance:
      patchResult.paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance,

    // 8.5U preservation confirmations
    paidBoundarySurgicalPatchPreservesFreeQaLane:
      patchResult.paidBoundarySurgicalPatchPreservesFreeQaLane,
    paidBoundarySurgicalPatchPreservesGeneralQuestions:
      patchResult.paidBoundarySurgicalPatchPreservesGeneralQuestions,
    paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard:
      patchResult.paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard,
    paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa:
      patchResult.paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa,
    paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse:
      patchResult.paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse,
    paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine:
      patchResult.paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine,
    paidBoundarySurgicalPatchDoesNotModifyPhotoRoute:
      patchResult.paidBoundarySurgicalPatchDoesNotModifyPhotoRoute,
    paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing:
      patchResult.paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing,
    paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation:
      patchResult.paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation,
    paidBoundarySurgicalPatchDoesNotEnablePublicRuntime:
      patchResult.paidBoundarySurgicalPatchDoesNotEnablePublicRuntime,

    // 8.5U no-prohibited-side-effect confirmations
    paidBoundarySurgicalPatchConfirmsNoOpenAiCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoOpenAiCall,
    paidBoundarySurgicalPatchConfirmsNoFetchCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoFetchCall,
    paidBoundarySurgicalPatchConfirmsNoProcessEnvRead:
      patchResult.paidBoundarySurgicalPatchConfirmsNoProcessEnvRead,
    paidBoundarySurgicalPatchConfirmsNoSdkUsage:
      patchResult.paidBoundarySurgicalPatchConfirmsNoSdkUsage,
    paidBoundarySurgicalPatchConfirmsNo8x3AcRerun:
      patchResult.paidBoundarySurgicalPatchConfirmsNo8x3AcRerun,
    paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall,
    paidBoundarySurgicalPatchConfirmsNoStripeCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoStripeCall,
    paidBoundarySurgicalPatchConfirmsNoCheckoutCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoCheckoutCall,
    paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall,
    paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification:
      patchResult.paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification,
    paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall,
    paidBoundarySurgicalPatchConfirmsNoStorageMutation:
      patchResult.paidBoundarySurgicalPatchConfirmsNoStorageMutation,
    paidBoundarySurgicalPatchConfirmsNoDatabaseWrite:
      patchResult.paidBoundarySurgicalPatchConfirmsNoDatabaseWrite,
    paidBoundarySurgicalPatchConfirmsNoAuditPersistence:
      patchResult.paidBoundarySurgicalPatchConfirmsNoAuditPersistence,
    paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation:
      patchResult.paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation,
    paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation:
      patchResult.paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation,
    paidBoundarySurgicalPatchConfirmsNoClaimAuthorization:
      patchResult.paidBoundarySurgicalPatchConfirmsNoClaimAuthorization,
    paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation:
      patchResult.paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation,
    paidBoundarySurgicalPatchConfirmsNoLegalCertainty:
      patchResult.paidBoundarySurgicalPatchConfirmsNoLegalCertainty,
    paidBoundarySurgicalPatchConfirmsNoPromptBuild:
      patchResult.paidBoundarySurgicalPatchConfirmsNoPromptBuild,
    paidBoundarySurgicalPatchConfirmsNoModelCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoModelCall,
    paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall:
      patchResult.paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall,
    paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification:
      patchResult.paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: patchResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: patchResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: patchResult.documentPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: patchResult.paymentPipelineActuallyExecuted,
    entitlementPipelineActuallyExecuted: patchResult.entitlementPipelineActuallyExecuted,
    checkoutPipelineActuallyExecuted: patchResult.checkoutPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: patchResult.ocrPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: patchResult.userVisiblePipelineActuallyExecuted,

    // Runtime authorization flags
    realDocumentInputAuthorizedNow: patchResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: patchResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: patchResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: patchResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: patchResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: patchResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: patchResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: patchResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: patchResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      patchResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: patchResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: patchResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: patchResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: patchResult.productionRuntimeAuthorizedNow,
    paidDocumentModeRuntimeAuthorizedNow: patchResult.paidDocumentModeRuntimeAuthorizedNow,
    paymentRuntimeAuthorizedNow: patchResult.paymentRuntimeAuthorizedNow,
    entitlementRuntimeAuthorizedNow: patchResult.entitlementRuntimeAuthorizedNow,
    checkoutRuntimeAuthorizedNow: patchResult.checkoutRuntimeAuthorizedNow,

    // Authorization grants
    runtimeAuthorizationGranted: patchResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: patchResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: patchResult.productionAuthorizationGranted,
    finalAuthorizationGranted: patchResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: patchResult.goLiveAuthorizationGranted,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: patchResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: patchResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: patchResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: patchResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: patchResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: patchResult.deliveryDateRequiredForExactDeadline,

    // TD flags from 8.5U result
    td001DocumentBypassGuardContainmentClosed: patchResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed:
      patchResult.td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed,
    td005PaidDocumentModeStillRequiresPostPatchContainmentAudit:
      patchResult.td005PaidDocumentModeStillRequiresPostPatchContainmentAudit,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation:
      patchResult.td005PaidDocumentModeStillRequiresActualRuntimeImplementation,
    td004PreModelPiiRedactionMissing: patchResult.td004PreModelPiiRedactionMissing,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      patchResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      patchResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      patchResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      patchResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      patchResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: patchResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: patchResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: patchResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: patchResult.tmpFilesPresentInWorkingTree,

    // 8.5U forward readiness gate
    readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit:
      patchResult.readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase:
      patchResult.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
    readyForControlledRealDocumentPilotAuthorizationPhase:
      patchResult.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase:
      patchResult.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: patchResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: patchResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: patchResult.publicRuntimeEnabled,
    persistenceUsed: patchResult.persistenceUsed,
    neverUserVisible: patchResult.neverUserVisible,

    // 8.5V core assertion flags
    paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: true,
    paidDocumentModeBoundaryPostPatchContainmentAudited: true,
    paidDocumentModeBoundaryPostPatchContainmentAuditOnly: true,
    paidDocumentModeBoundaryContainmentConfirmed: true,
    paidDocumentModeBoundaryDenyByDefaultConfirmed: true,
    paidDocumentModeBoundaryClientFlagBypassBlocked: true,
    paidDocumentModeBoundaryServerEntitlementStillRequired: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModeServerEntitlementVerificationStillNotImplemented: true,

    // 8.5V post-patch containment confirmations
    postPatchSmartTalkRouteContainsDenyBoundary: true,
    postPatchDenyBoundaryBeforeRunSmartTalk: true,
    postPatchDenyBoundaryAfterJsonParse: true,
    postPatchDenyBoundaryAfterTextValidation: true,
    postPatchDenyBoundaryBeforePromptBuild: true,
    postPatchDenyBoundaryBeforeModelCall: true,
    postPatchDenyBoundaryBeforeDocumentProcessing: true,
    postPatchDenyBoundaryBeforeStorage: true,
    postPatchDenyBoundaryBeforePersistence: true,
    postPatchDenyBoundaryBeforeUserVisibleOutput: true,
    postPatchDenyBoundaryRejectsClientDocumentModeFlag: true,
    postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag: true,
    postPatchDenyBoundaryRejectsClientEntitlementFlag: true,
    postPatchDenyBoundaryRejectsClientPaidFlag: true,
    postPatchDenyBoundaryDoesNotTrustClientFlags: true,
    postPatchDenyBoundaryDoesNotCreateEntitledLane: true,
    postPatchDenyBoundaryDoesNotCreatePaymentLane: true,
    postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane: true,
    postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane: true,
    postPatchDenyBoundaryUsesDocumentModeRequiredCode: true,
    postPatchDenyBoundaryReturnsOkFalse: true,
    postPatchDenyBoundaryReturnsNonSuccessStatus: true,
    postPatchDenyBoundaryDoesNotEchoRawDocument: true,
    postPatchDenyBoundaryDoesNotSummarizeDocument: true,
    postPatchDenyBoundaryDoesNotTranslateDocument: true,
    postPatchDenyBoundaryDoesNotExplainDocument: true,
    postPatchDenyBoundaryDoesNotGiveLegalAdvice: true,
    postPatchDenyBoundaryDoesNotCalculateDeadline: true,
    postPatchDenyBoundaryDoesNotExposeInternalGovernance: true,

    // 8.5V preservation confirmations
    postPatchFreeQaLanePreserved: true,
    postPatchGeneralQuestionsPreserved: true,
    postPatch8x5NDocumentBypassGuardPreserved: true,
    postPatchDocumentLikeTextBlockingPreserved: true,
    postPatchDocumentModeRequiredResponsePreserved: true,
    postPatch8x5HPhotoOcrQuarantinePreserved: true,
    postPatchPhotoRouteUnmodified: true,
    postPatchNoPhotoRuntimeEnabled: true,
    postPatchNoOcrRuntimeEnabled: true,
    postPatchNoFileRuntimeEnabled: true,
    postPatchNoStorageEnabled: true,
    postPatchNoPersistenceEnabled: true,
    postPatchNoPublicDocumentRuntimeEnabled: true,

    // 8.5V actual mutation/runtime flags
    actualPostPatchAuditOnly: true,
    actualLiveRouteMutationPerformedInThisPhase: false,
    actualSmartTalkRouteModifiedInThisPhase: false,
    actualPhotoRouteModifiedInThisPhase: false,
    actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: true,
    actualPaidDocumentBoundaryImplementedInThisPhase: false,

    // 8.5V no-prohibited-side-effect confirmations
    postPatchAuditConfirmsNoOpenAiCall: true,
    postPatchAuditConfirmsNoFetchCall: true,
    postPatchAuditConfirmsNoProcessEnvRead: true,
    postPatchAuditConfirmsNoSdkUsage: true,
    postPatchAuditConfirmsNo8x3AcRerun: true,
    postPatchAuditConfirmsNoPaymentRuntimeCall: true,
    postPatchAuditConfirmsNoStripeCall: true,
    postPatchAuditConfirmsNoCheckoutCall: true,
    postPatchAuditConfirmsNoEntitlementRuntimeCall: true,
    postPatchAuditConfirmsNoServerEntitlementVerification: true,
    postPatchAuditConfirmsNoOcrRuntimeCall: true,
    postPatchAuditConfirmsNoStorageMutation: true,
    postPatchAuditConfirmsNoDatabaseWrite: true,
    postPatchAuditConfirmsNoAuditPersistence: true,
    postPatchAuditConfirmsNoUserVisibleDocumentExplanation: true,
    postPatchAuditConfirmsNoEvidenceEvaluation: true,
    postPatchAuditConfirmsNoClaimAuthorization: true,
    postPatchAuditConfirmsNoDeadlineCalculation: true,
    postPatchAuditConfirmsNoLegalCertainty: true,
    postPatchAuditConfirmsNoPromptBuild: true,
    postPatchAuditConfirmsNoModelCall: true,
    postPatchAuditConfirmsNoRunSmartTalkCall: true,
    postPatchAuditConfirmsNoRouteHandlerCall: true,
    postPatchAuditConfirmsNoRouteImport: true,
    postPatchAuditConfirmsNoFilesystemRead: true,
    postPatchAuditConfirmsNoPhotoRouteModification: true,

    // 8.5V TD result flags
    td005PaidDocumentModeBoundaryPostPatchContainmentAudited: true,
    td005PaidDocumentModeBoundaryContainmentConfirmed: true,
    td005PaidDocumentModeReadyForClosureDecision: true,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: true,

    // 8.5V forward readiness
    readyFor8x5WPaidDocumentModeBoundaryClosureDecision: true,
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
  const base = buildCanonical8x5VInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validatePostPatchAuditInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5U prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5T" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("execution_contract_ready_for_surgical_route_patch_false",
    { paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: false });
  expect_rejected("surgical_route_patch_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted: false });
  expect_rejected("surgical_route_patch_performed_false",
    { paidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("surgical_route_patch_only_false",
    { paidDocumentModeBoundarySurgicalRoutePatchOnly: false });
  expect_rejected("implemented_as_deny_by_default_only_false",
    { paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: false });
  expect_rejected("paid_document_mode_runtime_still_not_implemented_false",
    { paidDocumentModeRuntimeStillNotImplemented: false });
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
  expect_rejected("prereq_tamper_cases_rejected_false", { prereqTamperCasesRejected: false });

  // 8.5U actual route mutation flags
  expect_rejected("actual_live_route_mutation_performed_false",
    { actualLiveRouteMutationPerformed: false });
  expect_rejected("actual_smart_talk_route_modified_false",
    { actualSmartTalkRouteModified: false });
  expect_rejected("actual_photo_route_modified_true",
    { actualPhotoRouteModified: true });
  expect_rejected("actual_paid_document_boundary_implemented_false",
    { actualPaidDocumentBoundaryImplemented: false });
  expect_rejected("actual_paid_document_boundary_deny_by_default_only_false",
    { actualPaidDocumentBoundaryDenyByDefaultOnly: false });
  expect_rejected("actual_paid_document_mode_implemented_true",
    { actualPaidDocumentModeImplemented: true });
  expect_rejected("actual_payment_runtime_implemented_true",
    { actualPaymentRuntimeImplemented: true });
  expect_rejected("actual_checkout_implemented_true",
    { actualCheckoutImplemented: true });
  expect_rejected("actual_entitlement_runtime_implemented_true",
    { actualEntitlementRuntimeImplemented: true });
  expect_rejected("actual_server_entitlement_verification_implemented_true",
    { actualServerEntitlementVerificationImplemented: true });
  expect_rejected("actual_real_document_input_performed_true",
    { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_document_processing_performed_true",
    { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_ocr_performed_true", { actualOcrPerformed: true });
  expect_rejected("actual_photo_input_processed_true", { actualPhotoInputProcessed: true });
  expect_rejected("actual_file_input_processed_true", { actualFileInputProcessed: true });
  expect_rejected("actual_document_storage_performed_true",
    { actualDocumentStoragePerformed: true });
  expect_rejected("actual_database_persistence_performed_true",
    { actualDatabasePersistencePerformed: true });
  expect_rejected("actual_audit_persistence_performed_true",
    { actualAuditPersistencePerformed: true });
  expect_rejected("actual_user_visible_output_performed_true",
    { actualUserVisibleOutputPerformed: true });
  expect_rejected("actual_public_runtime_enabled_true",
    { actualPublicRuntimeEnabled: true });
  expect_rejected("actual_pii_redaction_implemented_true",
    { actualPiiRedactionImplemented: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });
  expect_rejected("actual_claim_authorization_performed_true",
    { actualClaimAuthorizationPerformed: true });
  expect_rejected("actual_deadline_calculation_performed_true",
    { actualDeadlineCalculationPerformed: true });
  expect_rejected("actual_prompt_build_performed_true", { actualPromptBuildPerformed: true });
  expect_rejected("actual_model_call_performed_true", { actualModelCallPerformed: true });
  expect_rejected("actual_run_smart_talk_called_true", { actualRunSmartTalkCalled: true });

  // Boundary placement confirmations (all true)
  expect_rejected("prereq_patch_placed_after_json_parse_false",
    { paidBoundarySurgicalPatchPlacedAfterJsonParse: false });
  expect_rejected("prereq_patch_placed_after_text_validation_false",
    { paidBoundarySurgicalPatchPlacedAfterTextValidation: false });
  expect_rejected("prereq_patch_placed_before_run_smart_talk_false",
    { paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: false });
  expect_rejected("prereq_patch_placed_before_prompt_build_false",
    { paidBoundarySurgicalPatchPlacedBeforePromptBuild: false });
  expect_rejected("prereq_patch_placed_before_model_call_false",
    { paidBoundarySurgicalPatchPlacedBeforeModelCall: false });
  expect_rejected("prereq_patch_placed_before_document_processing_false",
    { paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: false });
  expect_rejected("prereq_patch_placed_before_storage_false",
    { paidBoundarySurgicalPatchPlacedBeforeStorage: false });
  expect_rejected("prereq_patch_placed_before_persistence_false",
    { paidBoundarySurgicalPatchPlacedBeforePersistence: false });
  expect_rejected("prereq_patch_placed_before_user_visible_output_false",
    { paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: false });
  expect_rejected("prereq_patch_placed_before_evidence_gate_runtime_false",
    { paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: false });
  expect_rejected("prereq_patch_placed_before_claim_authorization_false",
    { paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: false });
  expect_rejected("prereq_patch_placed_before_deadline_calculation_false",
    { paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: false });

  // Detection/denial confirmations (all true)
  expect_rejected("prereq_patch_detects_client_document_mode_field_false",
    { paidBoundarySurgicalPatchDetectsClientDocumentModeField: false });
  expect_rejected("prereq_patch_detects_client_paid_document_mode_field_false",
    { paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: false });
  expect_rejected("prereq_patch_detects_client_entitlement_field_false",
    { paidBoundarySurgicalPatchDetectsClientEntitlementField: false });
  expect_rejected("prereq_patch_detects_client_paid_flag_false",
    { paidBoundarySurgicalPatchDetectsClientPaidFlag: false });
  expect_rejected("prereq_patch_rejects_client_only_paid_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: false });
  expect_rejected("prereq_patch_rejects_client_only_document_mode_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: false });
  expect_rejected("prereq_patch_rejects_client_only_entitlement_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: false });
  expect_rejected("prereq_patch_requires_future_server_entitlement_false",
    { paidBoundarySurgicalPatchRequiresFutureServerEntitlement: false });
  expect_rejected("prereq_patch_denies_missing_server_entitlement_runtime_false",
    { paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: false });
  expect_rejected("prereq_patch_does_not_trust_ui_only_state_false",
    { paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: false });
  expect_rejected("prereq_patch_does_not_trust_client_flags_false",
    { paidBoundarySurgicalPatchDoesNotTrustClientFlags: false });
  expect_rejected("prereq_patch_deny_by_default_false",
    { paidBoundarySurgicalPatchDenyByDefault: false });

  // Unauthorized response confirmations (all true)
  expect_rejected("prereq_patch_unauthorized_response_non_success_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: false });
  expect_rejected("prereq_patch_unauthorized_response_ok_false_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: false });
  expect_rejected("prereq_patch_unauthorized_response_code_document_mode_required_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: false });
  expect_rejected("prereq_patch_unauthorized_response_no_raw_document_echo_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("prereq_patch_unauthorized_response_no_translation_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: false });
  expect_rejected("prereq_patch_unauthorized_response_no_summary_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: false });
  expect_rejected("prereq_patch_unauthorized_response_no_explanation_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: false });
  expect_rejected("prereq_patch_unauthorized_response_no_legal_advice_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("prereq_patch_unauthorized_response_no_deadline_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: false });
  expect_rejected("prereq_patch_unauthorized_response_no_legal_certainty_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("prereq_patch_unauthorized_response_no_claim_authorization_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("prereq_patch_unauthorized_response_no_internal_governance_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: false });

  // Preservation confirmations (all true)
  expect_rejected("prereq_patch_preserves_free_qa_lane_false",
    { paidBoundarySurgicalPatchPreservesFreeQaLane: false });
  expect_rejected("prereq_patch_preserves_general_questions_false",
    { paidBoundarySurgicalPatchPreservesGeneralQuestions: false });
  expect_rejected("prereq_patch_preserves_8x5n_document_bypass_guard_false",
    { paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: false });
  expect_rejected("prereq_patch_preserves_document_like_text_blocking_false",
    { paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: false });
  expect_rejected("prereq_patch_preserves_document_mode_required_response_false",
    { paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: false });
  expect_rejected("prereq_patch_preserves_8x5h_photo_ocr_quarantine_false",
    { paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: false });
  expect_rejected("prereq_patch_does_not_modify_photo_route_false",
    { paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: false });
  expect_rejected("prereq_patch_does_not_enable_document_processing_false",
    { paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: false });
  expect_rejected("prereq_patch_does_not_enable_user_visible_document_explanation_false",
    { paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: false });
  expect_rejected("prereq_patch_does_not_enable_public_runtime_false",
    { paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: false });

  // No-prohibited-side-effect confirmations (all true)
  expect_rejected("prereq_patch_confirms_no_openai_call_false",
    { paidBoundarySurgicalPatchConfirmsNoOpenAiCall: false });
  expect_rejected("prereq_patch_confirms_no_fetch_call_false",
    { paidBoundarySurgicalPatchConfirmsNoFetchCall: false });
  expect_rejected("prereq_patch_confirms_no_process_env_read_false",
    { paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: false });
  expect_rejected("prereq_patch_confirms_no_sdk_usage_false",
    { paidBoundarySurgicalPatchConfirmsNoSdkUsage: false });
  expect_rejected("prereq_patch_confirms_no_8x3ac_rerun_false",
    { paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: false });
  expect_rejected("prereq_patch_confirms_no_payment_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("prereq_patch_confirms_no_stripe_call_false",
    { paidBoundarySurgicalPatchConfirmsNoStripeCall: false });
  expect_rejected("prereq_patch_confirms_no_checkout_call_false",
    { paidBoundarySurgicalPatchConfirmsNoCheckoutCall: false });
  expect_rejected("prereq_patch_confirms_no_entitlement_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("prereq_patch_confirms_no_server_entitlement_verification_false",
    { paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: false });
  expect_rejected("prereq_patch_confirms_no_ocr_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: false });
  expect_rejected("prereq_patch_confirms_no_storage_mutation_false",
    { paidBoundarySurgicalPatchConfirmsNoStorageMutation: false });
  expect_rejected("prereq_patch_confirms_no_database_write_false",
    { paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: false });
  expect_rejected("prereq_patch_confirms_no_audit_persistence_false",
    { paidBoundarySurgicalPatchConfirmsNoAuditPersistence: false });
  expect_rejected("prereq_patch_confirms_no_user_visible_document_explanation_false",
    { paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("prereq_patch_confirms_no_evidence_evaluation_false",
    { paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: false });
  expect_rejected("prereq_patch_confirms_no_claim_authorization_false",
    { paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: false });
  expect_rejected("prereq_patch_confirms_no_deadline_calculation_false",
    { paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: false });
  expect_rejected("prereq_patch_confirms_no_legal_certainty_false",
    { paidBoundarySurgicalPatchConfirmsNoLegalCertainty: false });
  expect_rejected("prereq_patch_confirms_no_prompt_build_false",
    { paidBoundarySurgicalPatchConfirmsNoPromptBuild: false });
  expect_rejected("prereq_patch_confirms_no_model_call_false",
    { paidBoundarySurgicalPatchConfirmsNoModelCall: false });
  expect_rejected("prereq_patch_confirms_no_run_smart_talk_call_false",
    { paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: false });
  expect_rejected("prereq_patch_confirms_no_photo_route_modification_false",
    { paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: false });

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
  expect_rejected("ocr_pipeline_actually_executed_true",
    { ocrPipelineActuallyExecuted: true });
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

  // TD flags
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_surgical_route_patch_performed_false",
    { td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("td005_still_requires_post_patch_containment_audit_false",
    { td005PaidDocumentModeStillRequiresPostPatchContainmentAudit: false });
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

  // 8.5U forward readiness gate
  expect_rejected("ready_for_8x5v_post_patch_containment_audit_false",
    { readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: false });
  expect_rejected("ready_for_separate_runtime_authorization_true",
    { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true });
  expect_rejected("ready_for_pilot_authorization_true",
    { readyForControlledRealDocumentPilotAuthorizationPhase: true });
  expect_rejected("ready_for_production_authorization_true",
    { readyForControlledRealDocumentProductionAuthorizationPhase: true });
  expect_rejected("ready_for_real_document_input_true",
    { readyForRealDocumentInput: true });
  expect_rejected("ready_for_user_visible_output_true",
    { readyForUserVisibleOutput: true });
  expect_rejected("public_runtime_enabled_true", { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true", { persistenceUsed: true });
  expect_rejected("never_user_visible_false", { neverUserVisible: false });

  // 8.5V core assertion flags
  expect_rejected("surgical_route_patch_ready_for_post_patch_audit_false",
    { paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: false });
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
  expect_rejected("server_entitlement_verification_still_not_implemented_false",
    { paidDocumentModeServerEntitlementVerificationStillNotImplemented: false });

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
  expect_rejected("post_patch_no_storage_enabled_false",
    { postPatchNoStorageEnabled: false });
  expect_rejected("post_patch_no_persistence_enabled_false",
    { postPatchNoPersistenceEnabled: false });
  expect_rejected("post_patch_no_public_document_runtime_enabled_false",
    { postPatchNoPublicDocumentRuntimeEnabled: false });

  // 8.5V actual mutation/runtime flags
  expect_rejected("actual_post_patch_audit_only_false",
    { actualPostPatchAuditOnly: false });
  expect_rejected("actual_live_route_mutation_performed_in_this_phase_true",
    { actualLiveRouteMutationPerformedInThisPhase: true });
  expect_rejected("actual_smart_talk_route_modified_in_this_phase_true",
    { actualSmartTalkRouteModifiedInThisPhase: true });
  expect_rejected("actual_photo_route_modified_in_this_phase_true",
    { actualPhotoRouteModifiedInThisPhase: true });
  expect_rejected("actual_paid_document_boundary_already_implemented_by_8x5u_false",
    { actualPaidDocumentBoundaryAlreadyImplementedBy8x5U: false });
  expect_rejected("actual_paid_document_boundary_implemented_in_this_phase_true",
    { actualPaidDocumentBoundaryImplementedInThisPhase: true });

  // 8.5V no-prohibited-side-effect confirmations (all true)
  expect_rejected("post_patch_audit_confirms_no_openai_call_false",
    { postPatchAuditConfirmsNoOpenAiCall: false });
  expect_rejected("post_patch_audit_confirms_no_fetch_call_false",
    { postPatchAuditConfirmsNoFetchCall: false });
  expect_rejected("post_patch_audit_confirms_no_process_env_read_false",
    { postPatchAuditConfirmsNoProcessEnvRead: false });
  expect_rejected("post_patch_audit_confirms_no_sdk_usage_false",
    { postPatchAuditConfirmsNoSdkUsage: false });
  expect_rejected("post_patch_audit_confirms_no_8x3ac_rerun_false",
    { postPatchAuditConfirmsNo8x3AcRerun: false });
  expect_rejected("post_patch_audit_confirms_no_payment_runtime_call_false",
    { postPatchAuditConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("post_patch_audit_confirms_no_stripe_call_false",
    { postPatchAuditConfirmsNoStripeCall: false });
  expect_rejected("post_patch_audit_confirms_no_checkout_call_false",
    { postPatchAuditConfirmsNoCheckoutCall: false });
  expect_rejected("post_patch_audit_confirms_no_entitlement_runtime_call_false",
    { postPatchAuditConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("post_patch_audit_confirms_no_server_entitlement_verification_false",
    { postPatchAuditConfirmsNoServerEntitlementVerification: false });
  expect_rejected("post_patch_audit_confirms_no_ocr_runtime_call_false",
    { postPatchAuditConfirmsNoOcrRuntimeCall: false });
  expect_rejected("post_patch_audit_confirms_no_storage_mutation_false",
    { postPatchAuditConfirmsNoStorageMutation: false });
  expect_rejected("post_patch_audit_confirms_no_database_write_false",
    { postPatchAuditConfirmsNoDatabaseWrite: false });
  expect_rejected("post_patch_audit_confirms_no_audit_persistence_false",
    { postPatchAuditConfirmsNoAuditPersistence: false });
  expect_rejected("post_patch_audit_confirms_no_user_visible_document_explanation_false",
    { postPatchAuditConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("post_patch_audit_confirms_no_evidence_evaluation_false",
    { postPatchAuditConfirmsNoEvidenceEvaluation: false });
  expect_rejected("post_patch_audit_confirms_no_claim_authorization_false",
    { postPatchAuditConfirmsNoClaimAuthorization: false });
  expect_rejected("post_patch_audit_confirms_no_deadline_calculation_false",
    { postPatchAuditConfirmsNoDeadlineCalculation: false });
  expect_rejected("post_patch_audit_confirms_no_legal_certainty_false",
    { postPatchAuditConfirmsNoLegalCertainty: false });
  expect_rejected("post_patch_audit_confirms_no_prompt_build_false",
    { postPatchAuditConfirmsNoPromptBuild: false });
  expect_rejected("post_patch_audit_confirms_no_model_call_false",
    { postPatchAuditConfirmsNoModelCall: false });
  expect_rejected("post_patch_audit_confirms_no_run_smart_talk_call_false",
    { postPatchAuditConfirmsNoRunSmartTalkCall: false });
  expect_rejected("post_patch_audit_confirms_no_route_handler_call_false",
    { postPatchAuditConfirmsNoRouteHandlerCall: false });
  expect_rejected("post_patch_audit_confirms_no_route_import_false",
    { postPatchAuditConfirmsNoRouteImport: false });
  expect_rejected("post_patch_audit_confirms_no_filesystem_read_false",
    { postPatchAuditConfirmsNoFilesystemRead: false });
  expect_rejected("post_patch_audit_confirms_no_photo_route_modification_false",
    { postPatchAuditConfirmsNoPhotoRouteModification: false });

  // 8.5V TD result flags
  expect_rejected("td005_post_patch_containment_audited_false",
    { td005PaidDocumentModeBoundaryPostPatchContainmentAudited: false });
  expect_rejected("td005_boundary_containment_confirmed_false",
    { td005PaidDocumentModeBoundaryContainmentConfirmed: false });
  expect_rejected("td005_ready_for_closure_decision_false",
    { td005PaidDocumentModeReadyForClosureDecision: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_result_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: false });

  // 8.5V forward readiness
  expect_rejected("ready_for_8x5w_closure_decision_false",
    { readyFor8x5WPaidDocumentModeBoundaryClosureDecision: false });
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

export function runControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAudit(): ControlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditResult {
  const canonical = buildCanonical8x5VInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validatePostPatchAuditInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5V",
    allPassed,
    paidDocumentModeBoundarySurgicalRoutePatchReadyForPostPatchAudit: true,
    controlledRealDocumentPaidDocumentModeBoundaryPostPatchContainmentAuditAccepted: allPassed,
    paidDocumentModeBoundaryPostPatchContainmentAudited: true,
    paidDocumentModeBoundaryPostPatchContainmentAuditOnly: true,
    paidDocumentModeBoundaryContainmentConfirmed: true,
    paidDocumentModeBoundaryDenyByDefaultConfirmed: true,
    paidDocumentModeBoundaryClientFlagBypassBlocked: true,
    paidDocumentModeBoundaryServerEntitlementStillRequired: true,
    paidDocumentModeBoundaryRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeServerEntitlementVerificationStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    postPatchSmartTalkRouteContainsDenyBoundary: true,
    postPatchDenyBoundaryBeforeRunSmartTalk: true,
    postPatchDenyBoundaryAfterJsonParse: true,
    postPatchDenyBoundaryAfterTextValidation: true,
    postPatchDenyBoundaryBeforePromptBuild: true,
    postPatchDenyBoundaryBeforeModelCall: true,
    postPatchDenyBoundaryBeforeDocumentProcessing: true,
    postPatchDenyBoundaryBeforeStorage: true,
    postPatchDenyBoundaryBeforePersistence: true,
    postPatchDenyBoundaryBeforeUserVisibleOutput: true,
    postPatchDenyBoundaryRejectsClientDocumentModeFlag: true,
    postPatchDenyBoundaryRejectsClientPaidDocumentModeFlag: true,
    postPatchDenyBoundaryRejectsClientEntitlementFlag: true,
    postPatchDenyBoundaryRejectsClientPaidFlag: true,
    postPatchDenyBoundaryDoesNotTrustClientFlags: true,
    postPatchDenyBoundaryDoesNotCreateEntitledLane: true,
    postPatchDenyBoundaryDoesNotCreatePaymentLane: true,
    postPatchDenyBoundaryDoesNotCreateDocumentProcessingLane: true,
    postPatchDenyBoundaryDoesNotCreateUserVisibleDocumentLane: true,
    postPatchDenyBoundaryUsesDocumentModeRequiredCode: true,
    postPatchDenyBoundaryReturnsOkFalse: true,
    postPatchDenyBoundaryReturnsNonSuccessStatus: true,
    postPatchDenyBoundaryDoesNotEchoRawDocument: true,
    postPatchDenyBoundaryDoesNotSummarizeDocument: true,
    postPatchDenyBoundaryDoesNotTranslateDocument: true,
    postPatchDenyBoundaryDoesNotExplainDocument: true,
    postPatchDenyBoundaryDoesNotGiveLegalAdvice: true,
    postPatchDenyBoundaryDoesNotCalculateDeadline: true,
    postPatchDenyBoundaryDoesNotExposeInternalGovernance: true,

    postPatchFreeQaLanePreserved: true,
    postPatchGeneralQuestionsPreserved: true,
    postPatch8x5NDocumentBypassGuardPreserved: true,
    postPatchDocumentLikeTextBlockingPreserved: true,
    postPatchDocumentModeRequiredResponsePreserved: true,
    postPatch8x5HPhotoOcrQuarantinePreserved: true,
    postPatchPhotoRouteUnmodified: true,
    postPatchNoPhotoRuntimeEnabled: true,
    postPatchNoOcrRuntimeEnabled: true,
    postPatchNoFileRuntimeEnabled: true,
    postPatchNoStorageEnabled: true,
    postPatchNoPersistenceEnabled: true,
    postPatchNoPublicDocumentRuntimeEnabled: true,

    actualPostPatchAuditOnly: true,
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

    postPatchAuditConfirmsNoOpenAiCall: true,
    postPatchAuditConfirmsNoFetchCall: true,
    postPatchAuditConfirmsNoProcessEnvRead: true,
    postPatchAuditConfirmsNoSdkUsage: true,
    postPatchAuditConfirmsNo8x3AcRerun: true,
    postPatchAuditConfirmsNoPaymentRuntimeCall: true,
    postPatchAuditConfirmsNoStripeCall: true,
    postPatchAuditConfirmsNoCheckoutCall: true,
    postPatchAuditConfirmsNoEntitlementRuntimeCall: true,
    postPatchAuditConfirmsNoServerEntitlementVerification: true,
    postPatchAuditConfirmsNoOcrRuntimeCall: true,
    postPatchAuditConfirmsNoStorageMutation: true,
    postPatchAuditConfirmsNoDatabaseWrite: true,
    postPatchAuditConfirmsNoAuditPersistence: true,
    postPatchAuditConfirmsNoUserVisibleDocumentExplanation: true,
    postPatchAuditConfirmsNoEvidenceEvaluation: true,
    postPatchAuditConfirmsNoClaimAuthorization: true,
    postPatchAuditConfirmsNoDeadlineCalculation: true,
    postPatchAuditConfirmsNoLegalCertainty: true,
    postPatchAuditConfirmsNoPromptBuild: true,
    postPatchAuditConfirmsNoModelCall: true,
    postPatchAuditConfirmsNoRunSmartTalkCall: true,
    postPatchAuditConfirmsNoRouteHandlerCall: true,
    postPatchAuditConfirmsNoRouteImport: true,
    postPatchAuditConfirmsNoFilesystemRead: true,
    postPatchAuditConfirmsNoPhotoRouteModification: true,

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
    td005PaidDocumentModeBoundaryContainmentConfirmed: true,
    td005PaidDocumentModeReadyForClosureDecision: true,
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

    readyFor8x5WPaidDocumentModeBoundaryClosureDecision: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5V is a Paid Document Mode Boundary Post-Patch Containment Audit.",
      "8.5V depends on completed 8.5U surgical route patch.",
      "8.5V is audit-only and creates no runtime behavior.",
      "8.5V does not modify /api/smart-talk.",
      "8.5V does not modify /api/smart-talk-photo.",
      "8.5U already added a deny-by-default client-flag boundary before runSmartTalk.",
      "8.5V confirms that the boundary is containment-only.",
      "8.5V confirms that client-side paid/document/entitlement flags remain untrusted.",
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
      "The patch preserves 8.5N Free Q&A bypass guard.",
      "The patch preserves 8.5H photo OCR quarantine.",
      "TD-005 post-patch containment is now audited and ready for closure decision.",
      "TD-005 still requires actual runtime implementation later.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5W Paid Document Mode Boundary Closure Decision.",
      "readyFor8x5WPaidDocumentModeBoundaryClosureDecision is closure-decision readiness only, not public runtime authorization.",
    ],
  };
}
