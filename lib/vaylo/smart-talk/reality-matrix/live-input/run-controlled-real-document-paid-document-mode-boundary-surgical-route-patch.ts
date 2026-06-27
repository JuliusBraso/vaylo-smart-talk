/**
 * Phase 8.5U — Controlled Real Document Paid Document Mode Boundary
 * Surgical Route Patch.
 *
 * SURGICAL-ROUTE-PATCH — DENY-BY-DEFAULT BOUNDARY ONLY — DEPENDS ON 8.5T.
 *
 * This phase adds a deny-by-default client-side paid/document/entitlement
 * activation boundary to /api/smart-talk. It does NOT implement server
 * entitlement verification, payment, checkout, document processing, OCR,
 * prompt build, model calls, runSmartTalk, or public Paid Document Mode.
 *
 * This file does NOT:
 *   - Call OpenAI, fetch, runSmartTalk, or read process.env.
 *   - Use SDKs, Stripe, checkout, or entitlement runtime.
 *   - Import live route, payment, Stripe, checkout, or entitlement modules.
 *   - Modify /api/smart-talk-photo.
 *   - Implement server entitlement verification or Paid Document Mode runtime.
 *   - Build prompts or call models.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform any I/O or side effects.
 */

import { runControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContract } from "./run-controlled-real-document-paid-document-mode-boundary-runtime-execution-contract";

// ── Input type ────────────────────────────────────────────────────────────────

interface ControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchInput {
  // 8.5T prerequisite gate — core
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract: boolean;
  readonly controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted: boolean;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractOnly: boolean;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractDefined: boolean;
  readonly paidDocumentModeBoundaryRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: boolean;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: boolean;

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

  // Authorization grants from 8.5T (all false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD flags from 8.5T
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td005PaidDocumentModeBoundaryRuntimeExecutionContracted: boolean;
  readonly td005PaidDocumentModeStillRequiresSurgicalRoutePatch: boolean;
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

  // Actual performed flags from 8.5T (all false — 25)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualSmartTalkRouteModified: boolean;
  readonly actualPhotoRouteModified: boolean;
  readonly actualPaidDocumentBoundaryImplemented: boolean;
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

  // 8.5T confirms (all true — 26)
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

  // 8.5T forward readiness gate
  readonly readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: boolean;

  // 8.5U core surgical patch assertion flags
  readonly paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchOnly: boolean;
  readonly paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: boolean;
  readonly paidDocumentModeRuntimeStillNotImplemented: boolean;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplInPatch: boolean;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorizedInPatch: boolean;

  // 8.5U actual route mutation flags
  readonly actualLiveRouteMutationPerformedByPatch: boolean;
  readonly actualSmartTalkRouteModifiedByPatch: boolean;
  readonly actualPhotoRouteModifiedByPatch: boolean;
  readonly actualPaidDocumentBoundaryImplementedByPatch: boolean;
  readonly actualPaidDocumentBoundaryDenyByDefaultOnly: boolean;
  readonly actualServerEntitlementVerificationImplemented: boolean;

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

  // 8.5U no-prohibited-side-effect confirmations (all true — 23)
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

  // 8.5U TD-005 result flags
  readonly td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: boolean;
  readonly td005PaidDocumentModeStillRequiresPostPatchContainmentAuditResult: boolean;
  readonly td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: boolean;

  // 8.5U forward readiness
  readonly readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: boolean;
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

export interface ControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchResult {
  readonly checkId: "8.5U";
  readonly allPassed: boolean;
  readonly paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: true;
  readonly controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted: boolean;
  readonly paidDocumentModeBoundarySurgicalRoutePatchPerformed: true;
  readonly paidDocumentModeBoundarySurgicalRoutePatchOnly: true;
  readonly paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: true;
  readonly paidDocumentModeRuntimeStillNotImplemented: true;
  readonly paidDocumentModePaymentRuntimeStillNotImplemented: true;
  readonly paidDocumentModeCheckoutRuntimeStillNotImplemented: true;
  readonly paidDocumentModeEntitlementRuntimeStillNotImplemented: true;
  readonly paidDocumentModeDocumentProcessingStillNotAuthorized: true;
  readonly paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true;
  readonly tamperCasesRejected: boolean;

  // Actual route mutation flags
  readonly actualLiveRouteMutationPerformed: true;
  readonly actualSmartTalkRouteModified: true;
  readonly actualPhotoRouteModified: false;
  readonly actualPaidDocumentBoundaryImplemented: true;
  readonly actualPaidDocumentBoundaryDenyByDefaultOnly: true;
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

  // Boundary placement confirmations
  readonly paidBoundarySurgicalPatchPlacedAfterJsonParse: true;
  readonly paidBoundarySurgicalPatchPlacedAfterTextValidation: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: true;
  readonly paidBoundarySurgicalPatchPlacedBeforePromptBuild: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeModelCall: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeStorage: true;
  readonly paidBoundarySurgicalPatchPlacedBeforePersistence: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: true;
  readonly paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: true;

  // Detection/denial confirmations
  readonly paidBoundarySurgicalPatchDetectsClientDocumentModeField: true;
  readonly paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: true;
  readonly paidBoundarySurgicalPatchDetectsClientEntitlementField: true;
  readonly paidBoundarySurgicalPatchDetectsClientPaidFlag: true;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: true;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: true;
  readonly paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: true;
  readonly paidBoundarySurgicalPatchRequiresFutureServerEntitlement: true;
  readonly paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: true;
  readonly paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: true;
  readonly paidBoundarySurgicalPatchDoesNotTrustClientFlags: true;
  readonly paidBoundarySurgicalPatchDenyByDefault: true;

  // Unauthorized response confirmations
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: true;
  readonly paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: true;

  // Preservation confirmations
  readonly paidBoundarySurgicalPatchPreservesFreeQaLane: true;
  readonly paidBoundarySurgicalPatchPreservesGeneralQuestions: true;
  readonly paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: true;
  readonly paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: true;
  readonly paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: true;
  readonly paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: true;
  readonly paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: true;
  readonly paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: true;
  readonly paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: true;
  readonly paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: true;

  // No-prohibited-side-effect confirmations
  readonly paidBoundarySurgicalPatchConfirmsNoOpenAiCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoFetchCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: true;
  readonly paidBoundarySurgicalPatchConfirmsNoSdkUsage: true;
  readonly paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: true;
  readonly paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoStripeCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoCheckoutCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: true;
  readonly paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoStorageMutation: true;
  readonly paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: true;
  readonly paidBoundarySurgicalPatchConfirmsNoAuditPersistence: true;
  readonly paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true;
  readonly paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: true;
  readonly paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: true;
  readonly paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: true;
  readonly paidBoundarySurgicalPatchConfirmsNoLegalCertainty: true;
  readonly paidBoundarySurgicalPatchConfirmsNoPromptBuild: true;
  readonly paidBoundarySurgicalPatchConfirmsNoModelCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: true;
  readonly paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: true;

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

  // Forward readiness
  readonly readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: true;
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

function validateSurgicalRoutePatchInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5T prerequisite gate — core
  if (o["prereqCheckId"] !== "8.5T") reasons.push("prereq_check_id_must_be_8x5T");
  if (o["prereqAllPassed"] !== true) reasons.push("prereq_all_passed_false");
  if (o["paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract"] !== true)
    reasons.push("execution_contract_ready_flag_false");
  if (o["controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted"] !== true)
    reasons.push("execution_contract_not_accepted");
  if (o["paidDocumentModeBoundaryRuntimeExecutionContractOnly"] !== true)
    reasons.push("execution_contract_only_false");
  if (o["paidDocumentModeBoundaryRuntimeExecutionContractDefined"] !== true)
    reasons.push("execution_contract_defined_false");
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

  // Authorization grants (all false)
  if (o["runtimeAuthorizationGranted"] !== false) reasons.push("runtime_authorization_granted_must_be_false");
  if (o["pilotAuthorizationGranted"] !== false) reasons.push("pilot_authorization_granted_must_be_false");
  if (o["productionAuthorizationGranted"] !== false) reasons.push("production_authorization_granted_must_be_false");
  if (o["finalAuthorizationGranted"] !== false) reasons.push("final_authorization_granted_must_be_false");
  if (o["goLiveAuthorizationGranted"] !== false) reasons.push("go_live_authorization_granted_must_be_false");

  // TD flags from 8.5T
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td005PaidDocumentModeBoundaryRuntimeExecutionContracted"] !== true)
    reasons.push("td005_boundary_runtime_execution_contracted_false");
  if (o["td005PaidDocumentModeStillRequiresSurgicalRoutePatch"] !== true)
    reasons.push("td005_still_requires_surgical_route_patch_false");
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

  // Actual performed flags from 8.5T prereq (ALL must be false in 8.5T)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("prereq_actual_live_route_mutation_performed_must_be_false");
  if (o["actualSmartTalkRouteModified"] !== false)
    reasons.push("prereq_actual_smart_talk_route_modified_must_be_false");
  if (o["actualPhotoRouteModified"] !== false)
    reasons.push("prereq_actual_photo_route_modified_must_be_false");
  if (o["actualPaidDocumentBoundaryImplemented"] !== false)
    reasons.push("prereq_actual_paid_document_boundary_implemented_must_be_false");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("prereq_actual_paid_document_mode_implemented_must_be_false");
  if (o["actualPaymentRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_payment_runtime_implemented_must_be_false");
  if (o["actualCheckoutImplemented"] !== false)
    reasons.push("prereq_actual_checkout_implemented_must_be_false");
  if (o["actualEntitlementRuntimeImplemented"] !== false)
    reasons.push("prereq_actual_entitlement_runtime_implemented_must_be_false");
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

  // 8.5T confirms (all true — 26)
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

  // 8.5T forward readiness gate
  if (o["readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch"] !== true)
    reasons.push("ready_for_8x5u_surgical_route_patch_false");

  // 8.5U core surgical patch assertion flags
  if (o["paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch"] !== true)
    reasons.push("execution_contract_ready_for_surgical_route_patch_false");
  if (o["paidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("surgical_route_patch_performed_false");
  if (o["paidDocumentModeBoundarySurgicalRoutePatchOnly"] !== true)
    reasons.push("surgical_route_patch_only_false");
  if (o["paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly"] !== true)
    reasons.push("implemented_as_deny_by_default_only_false");
  if (o["paidDocumentModeRuntimeStillNotImplemented"] !== true)
    reasons.push("paid_document_mode_runtime_still_not_implemented_false");
  if (o["paidDocumentModeEntitlementRuntimeStillNotImplInPatch"] !== true)
    reasons.push("entitlement_runtime_still_not_impl_in_patch_false");
  if (o["paidDocumentModeDocumentProcessingStillNotAuthorizedInPatch"] !== true)
    reasons.push("document_processing_still_not_authorized_in_patch_false");

  // 8.5U actual route mutation flags
  if (o["actualLiveRouteMutationPerformedByPatch"] !== true)
    reasons.push("actual_live_route_mutation_performed_by_patch_must_be_true");
  if (o["actualSmartTalkRouteModifiedByPatch"] !== true)
    reasons.push("actual_smart_talk_route_modified_by_patch_must_be_true");
  if (o["actualPhotoRouteModifiedByPatch"] !== false)
    reasons.push("actual_photo_route_modified_by_patch_must_be_false");
  if (o["actualPaidDocumentBoundaryImplementedByPatch"] !== true)
    reasons.push("actual_paid_document_boundary_implemented_by_patch_must_be_true");
  if (o["actualPaidDocumentBoundaryDenyByDefaultOnly"] !== true)
    reasons.push("actual_paid_document_boundary_deny_by_default_only_must_be_true");
  if (o["actualServerEntitlementVerificationImplemented"] !== false)
    reasons.push("actual_server_entitlement_verification_implemented_must_be_false");

  // 8.5U boundary placement confirmations (all true)
  if (o["paidBoundarySurgicalPatchPlacedAfterJsonParse"] !== true)
    reasons.push("patch_placed_after_json_parse_false");
  if (o["paidBoundarySurgicalPatchPlacedAfterTextValidation"] !== true)
    reasons.push("patch_placed_after_text_validation_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk"] !== true)
    reasons.push("patch_placed_before_run_smart_talk_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforePromptBuild"] !== true)
    reasons.push("patch_placed_before_prompt_build_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeModelCall"] !== true)
    reasons.push("patch_placed_before_model_call_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing"] !== true)
    reasons.push("patch_placed_before_document_processing_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeStorage"] !== true)
    reasons.push("patch_placed_before_storage_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforePersistence"] !== true)
    reasons.push("patch_placed_before_persistence_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput"] !== true)
    reasons.push("patch_placed_before_user_visible_output_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime"] !== true)
    reasons.push("patch_placed_before_evidence_gate_runtime_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization"] !== true)
    reasons.push("patch_placed_before_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation"] !== true)
    reasons.push("patch_placed_before_deadline_calculation_false");

  // 8.5U detection/denial confirmations (all true)
  if (o["paidBoundarySurgicalPatchDetectsClientDocumentModeField"] !== true)
    reasons.push("patch_detects_client_document_mode_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField"] !== true)
    reasons.push("patch_detects_client_paid_document_mode_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientEntitlementField"] !== true)
    reasons.push("patch_detects_client_entitlement_field_false");
  if (o["paidBoundarySurgicalPatchDetectsClientPaidFlag"] !== true)
    reasons.push("patch_detects_client_paid_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag"] !== true)
    reasons.push("patch_rejects_client_only_paid_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag"] !== true)
    reasons.push("patch_rejects_client_only_document_mode_flag_false");
  if (o["paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag"] !== true)
    reasons.push("patch_rejects_client_only_entitlement_flag_false");
  if (o["paidBoundarySurgicalPatchRequiresFutureServerEntitlement"] !== true)
    reasons.push("patch_requires_future_server_entitlement_false");
  if (o["paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime"] !== true)
    reasons.push("patch_denies_missing_server_entitlement_runtime_false");
  if (o["paidBoundarySurgicalPatchDoesNotTrustUiOnlyState"] !== true)
    reasons.push("patch_does_not_trust_ui_only_state_false");
  if (o["paidBoundarySurgicalPatchDoesNotTrustClientFlags"] !== true)
    reasons.push("patch_does_not_trust_client_flags_false");
  if (o["paidBoundarySurgicalPatchDenyByDefault"] !== true)
    reasons.push("patch_deny_by_default_false");

  // 8.5U unauthorized response confirmations (all true)
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess"] !== true)
    reasons.push("patch_unauthorized_response_non_success_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseOkFalse"] !== true)
    reasons.push("patch_unauthorized_response_ok_false_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("patch_unauthorized_response_code_document_mode_required_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho"] !== true)
    reasons.push("patch_unauthorized_response_no_raw_document_echo_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation"] !== true)
    reasons.push("patch_unauthorized_response_no_translation_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoSummary"] !== true)
    reasons.push("patch_unauthorized_response_no_summary_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation"] !== true)
    reasons.push("patch_unauthorized_response_no_explanation_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice"] !== true)
    reasons.push("patch_unauthorized_response_no_legal_advice_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline"] !== true)
    reasons.push("patch_unauthorized_response_no_deadline_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty"] !== true)
    reasons.push("patch_unauthorized_response_no_legal_certainty_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization"] !== true)
    reasons.push("patch_unauthorized_response_no_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance"] !== true)
    reasons.push("patch_unauthorized_response_no_internal_governance_false");

  // 8.5U preservation confirmations (all true)
  if (o["paidBoundarySurgicalPatchPreservesFreeQaLane"] !== true)
    reasons.push("patch_preserves_free_qa_lane_false");
  if (o["paidBoundarySurgicalPatchPreservesGeneralQuestions"] !== true)
    reasons.push("patch_preserves_general_questions_false");
  if (o["paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard"] !== true)
    reasons.push("patch_preserves_8x5n_document_bypass_guard_false");
  if (o["paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa"] !== true)
    reasons.push("patch_preserves_document_like_text_blocking_in_free_qa_false");
  if (o["paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse"] !== true)
    reasons.push("patch_preserves_document_mode_required_response_false");
  if (o["paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine"] !== true)
    reasons.push("patch_preserves_8x5h_photo_ocr_quarantine_false");
  if (o["paidBoundarySurgicalPatchDoesNotModifyPhotoRoute"] !== true)
    reasons.push("patch_does_not_modify_photo_route_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing"] !== true)
    reasons.push("patch_does_not_enable_document_processing_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation"] !== true)
    reasons.push("patch_does_not_enable_user_visible_document_explanation_false");
  if (o["paidBoundarySurgicalPatchDoesNotEnablePublicRuntime"] !== true)
    reasons.push("patch_does_not_enable_public_runtime_false");

  // 8.5U no-prohibited-side-effect confirmations (all true — 23)
  if (o["paidBoundarySurgicalPatchConfirmsNoOpenAiCall"] !== true)
    reasons.push("patch_confirms_no_openai_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoFetchCall"] !== true)
    reasons.push("patch_confirms_no_fetch_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoProcessEnvRead"] !== true)
    reasons.push("patch_confirms_no_process_env_read_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoSdkUsage"] !== true)
    reasons.push("patch_confirms_no_sdk_usage_false");
  if (o["paidBoundarySurgicalPatchConfirmsNo8x3AcRerun"] !== true)
    reasons.push("patch_confirms_no_8x3ac_rerun_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("patch_confirms_no_payment_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoStripeCall"] !== true)
    reasons.push("patch_confirms_no_stripe_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoCheckoutCall"] !== true)
    reasons.push("patch_confirms_no_checkout_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall"] !== true)
    reasons.push("patch_confirms_no_entitlement_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification"] !== true)
    reasons.push("patch_confirms_no_server_entitlement_verification_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("patch_confirms_no_ocr_runtime_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoStorageMutation"] !== true)
    reasons.push("patch_confirms_no_storage_mutation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoDatabaseWrite"] !== true)
    reasons.push("patch_confirms_no_database_write_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoAuditPersistence"] !== true)
    reasons.push("patch_confirms_no_audit_persistence_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("patch_confirms_no_user_visible_document_explanation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("patch_confirms_no_evidence_evaluation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoClaimAuthorization"] !== true)
    reasons.push("patch_confirms_no_claim_authorization_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("patch_confirms_no_deadline_calculation_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoLegalCertainty"] !== true)
    reasons.push("patch_confirms_no_legal_certainty_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPromptBuild"] !== true)
    reasons.push("patch_confirms_no_prompt_build_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoModelCall"] !== true)
    reasons.push("patch_confirms_no_model_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall"] !== true)
    reasons.push("patch_confirms_no_run_smart_talk_call_false");
  if (o["paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification"] !== true)
    reasons.push("patch_confirms_no_photo_route_modification_false");

  // 8.5U TD-005 result flags
  if (o["td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed"] !== true)
    reasons.push("td005_boundary_surgical_route_patch_performed_false");
  if (o["td005PaidDocumentModeStillRequiresPostPatchContainmentAuditResult"] !== true)
    reasons.push("td005_still_requires_post_patch_containment_audit_result_false");
  if (o["td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult"] !== true)
    reasons.push("td005_still_requires_actual_runtime_implementation_result_false");

  // 8.5U forward readiness
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

  return { accepted: reasons.length === 0, reasons };
}

// ── Canonical 8.5U input ──────────────────────────────────────────────────────

function buildCanonical8x5UInput(): ControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchInput {
  const contractResult = runControlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContract();
  return {
    // 8.5T prerequisite gate — core
    prereqCheckId: contractResult.checkId,
    prereqAllPassed: contractResult.allPassed,
    paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract:
      contractResult.paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract,
    controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted:
      contractResult.controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted,
    paidDocumentModeBoundaryRuntimeExecutionContractOnly:
      contractResult.paidDocumentModeBoundaryRuntimeExecutionContractOnly,
    paidDocumentModeBoundaryRuntimeExecutionContractDefined:
      contractResult.paidDocumentModeBoundaryRuntimeExecutionContractDefined,
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

    // 8.5T future route execution constraints
    paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly:
      contractResult.paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly,
    paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification,
    paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved,
    paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved,
    paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch,
    paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary,
    paidBoundaryRuntimeExecutionContractRequiresServerBoundary:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresServerBoundary,
    paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation,
    paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit,

    // 8.5T future insertion execution constraints
    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization,
    paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation,

    // 8.5T future entitlement execution constraints
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature,
    paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess,
    paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement,
    paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust,
    paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust,
    paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust:
      contractResult.paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust,
    paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked,
    paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked,
    paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked,
    paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked,
    paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing,
    paidBoundaryRuntimeExecutionContractRequiresDenyByDefault:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresDenyByDefault,

    // 8.5T future unauthorized response execution constraints
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance,

    // 8.5T future lane and safety execution constraints
    paidBoundaryRuntimeExecutionContractDefinesFreeQaLane:
      contractResult.paidBoundaryRuntimeExecutionContractDefinesFreeQaLane,
    paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane:
      contractResult.paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane,
    paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane:
      contractResult.paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane,
    paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane:
      contractResult.paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane,
    paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates,
    paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks,
    paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase,
    paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext,
    paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch:
      contractResult.paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch,

    // Authorization grants
    runtimeAuthorizationGranted: contractResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: contractResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: contractResult.productionAuthorizationGranted,
    finalAuthorizationGranted: contractResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: contractResult.goLiveAuthorizationGranted,

    // TD flags from 8.5T
    td001DocumentBypassGuardContainmentClosed: contractResult.td001DocumentBypassGuardContainmentClosed,
    td005PaidDocumentModeBoundaryRuntimeExecutionContracted:
      contractResult.td005PaidDocumentModeBoundaryRuntimeExecutionContracted,
    td005PaidDocumentModeStillRequiresSurgicalRoutePatch:
      contractResult.td005PaidDocumentModeStillRequiresSurgicalRoutePatch,
    td005PaidDocumentModeStillRequiresPostPatchContainmentAudit:
      contractResult.td005PaidDocumentModeStillRequiresPostPatchContainmentAudit,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementation:
      contractResult.td005PaidDocumentModeStillRequiresActualRuntimeImplementation,
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

    // Actual performed flags from 8.5T (all false — 25)
    actualLiveRouteMutationPerformed: contractResult.actualLiveRouteMutationPerformed,
    actualSmartTalkRouteModified: contractResult.actualSmartTalkRouteModified,
    actualPhotoRouteModified: contractResult.actualPhotoRouteModified,
    actualPaidDocumentBoundaryImplemented: contractResult.actualPaidDocumentBoundaryImplemented,
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
    actualRunSmartTalkCalled: contractResult.actualRunSmartTalkCalled,

    // 8.5T confirms (26)
    paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead,
    paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage,
    paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport,
    paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation,
    paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation,
    paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite,
    paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence,
    paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation,
    paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation,
    paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization,
    paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation,
    paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty,
    paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild,
    paidBoundaryRuntimeExecutionContractConfirmsNoModelCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoModelCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall,
    paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification,
    paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification:
      contractResult.paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification,

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
    userVisibleLegalDeadlineOutputAuthorizedNow: contractResult.userVisibleLegalDeadlineOutputAuthorizedNow,
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

    // 8.5T forward readiness gate
    readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch:
      contractResult.readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch,

    // 8.5U core surgical patch assertion flags
    paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: true,
    paidDocumentModeBoundarySurgicalRoutePatchPerformed: true,
    paidDocumentModeBoundarySurgicalRoutePatchOnly: true,
    paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: true,
    paidDocumentModeRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplInPatch: true,
    paidDocumentModeDocumentProcessingStillNotAuthorizedInPatch: true,

    // 8.5U actual route mutation flags
    actualLiveRouteMutationPerformedByPatch: true,
    actualSmartTalkRouteModifiedByPatch: true,
    actualPhotoRouteModifiedByPatch: false,
    actualPaidDocumentBoundaryImplementedByPatch: true,
    actualPaidDocumentBoundaryDenyByDefaultOnly: true,
    actualServerEntitlementVerificationImplemented: false,

    // 8.5U boundary placement confirmations
    paidBoundarySurgicalPatchPlacedAfterJsonParse: true,
    paidBoundarySurgicalPatchPlacedAfterTextValidation: true,
    paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: true,
    paidBoundarySurgicalPatchPlacedBeforePromptBuild: true,
    paidBoundarySurgicalPatchPlacedBeforeModelCall: true,
    paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: true,
    paidBoundarySurgicalPatchPlacedBeforeStorage: true,
    paidBoundarySurgicalPatchPlacedBeforePersistence: true,
    paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: true,
    paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: true,
    paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: true,
    paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: true,

    // 8.5U detection/denial confirmations
    paidBoundarySurgicalPatchDetectsClientDocumentModeField: true,
    paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: true,
    paidBoundarySurgicalPatchDetectsClientEntitlementField: true,
    paidBoundarySurgicalPatchDetectsClientPaidFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: true,
    paidBoundarySurgicalPatchRequiresFutureServerEntitlement: true,
    paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: true,
    paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: true,
    paidBoundarySurgicalPatchDoesNotTrustClientFlags: true,
    paidBoundarySurgicalPatchDenyByDefault: true,

    // 8.5U unauthorized response confirmations
    paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: true,
    paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: true,
    paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: true,

    // 8.5U preservation confirmations
    paidBoundarySurgicalPatchPreservesFreeQaLane: true,
    paidBoundarySurgicalPatchPreservesGeneralQuestions: true,
    paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: true,
    paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: true,
    paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: true,
    paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: true,
    paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: true,
    paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: true,
    paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: true,
    paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: true,

    // 8.5U no-prohibited-side-effect confirmations
    paidBoundarySurgicalPatchConfirmsNoOpenAiCall: true,
    paidBoundarySurgicalPatchConfirmsNoFetchCall: true,
    paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: true,
    paidBoundarySurgicalPatchConfirmsNoSdkUsage: true,
    paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: true,
    paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoStripeCall: true,
    paidBoundarySurgicalPatchConfirmsNoCheckoutCall: true,
    paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: true,
    paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoStorageMutation: true,
    paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: true,
    paidBoundarySurgicalPatchConfirmsNoAuditPersistence: true,
    paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: true,
    paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: true,
    paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: true,
    paidBoundarySurgicalPatchConfirmsNoLegalCertainty: true,
    paidBoundarySurgicalPatchConfirmsNoPromptBuild: true,
    paidBoundarySurgicalPatchConfirmsNoModelCall: true,
    paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: true,
    paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: true,

    // 8.5U TD-005 result flags
    td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: true,
    td005PaidDocumentModeStillRequiresPostPatchContainmentAuditResult: true,
    td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: true,

    // 8.5U forward readiness
    readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: true,
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
  const base = buildCanonical8x5UInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateSurgicalRoutePatchInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5T prereq gate — core
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5S" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("execution_contract_ready_flag_false",
    { paidDocumentModeBoundaryRuntimeImplementationPlanReadyForExecutionContract: false });
  expect_rejected("execution_contract_not_accepted",
    { controlledRealDocumentPaidDocumentModeBoundaryRuntimeExecutionContractAccepted: false });
  expect_rejected("execution_contract_only_false",
    { paidDocumentModeBoundaryRuntimeExecutionContractOnly: false });
  expect_rejected("execution_contract_defined_false",
    { paidDocumentModeBoundaryRuntimeExecutionContractDefined: false });
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

  // 8.5T future route execution constraints
  expect_rejected("ec_targets_smart_talk_route_only_false",
    { paidBoundaryRuntimeExecutionContractTargetsSmartTalkRouteOnly: false });
  expect_rejected("ec_forbids_photo_route_modification_false",
    { paidBoundaryRuntimeExecutionContractForbidsPhotoRouteModification: false });
  expect_rejected("ec_requires_photo_ocr_quarantine_preserved_false",
    { paidBoundaryRuntimeExecutionContractRequiresPhotoOcrQuarantinePreserved: false });
  expect_rejected("ec_requires_free_qa_bypass_guard_preserved_false",
    { paidBoundaryRuntimeExecutionContractRequiresFreeQaBypassGuardPreserved: false });
  expect_rejected("ec_requires_minimal_surgical_patch_false",
    { paidBoundaryRuntimeExecutionContractRequiresMinimalSurgicalPatch: false });
  expect_rejected("ec_forbids_broad_route_refactor_false",
    { paidBoundaryRuntimeExecutionContractForbidsBroadRouteRefactor: false });
  expect_rejected("ec_forbids_ui_only_boundary_false",
    { paidBoundaryRuntimeExecutionContractForbidsUiOnlyBoundary: false });
  expect_rejected("ec_requires_server_boundary_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerBoundary: false });
  expect_rejected("ec_requires_patch_after_body_validation_false",
    { paidBoundaryRuntimeExecutionContractRequiresPatchAfterBodyValidation: false });
  expect_rejected("ec_requires_separate_post_patch_audit_false",
    { paidBoundaryRuntimeExecutionContractRequiresSeparatePostPatchAudit: false });

  // 8.5T future insertion execution constraints
  expect_rejected("ec_requires_boundary_after_json_parse_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterJsonParse: false });
  expect_rejected("ec_requires_boundary_after_text_validation_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryAfterTextValidation: false });
  expect_rejected("ec_requires_boundary_before_prompt_build_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePromptBuild: false });
  expect_rejected("ec_requires_boundary_before_model_call_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeModelCall: false });
  expect_rejected("ec_requires_boundary_before_run_smart_talk_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeRunSmartTalk: false });
  expect_rejected("ec_requires_boundary_before_document_processing_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDocumentProcessing: false });
  expect_rejected("ec_requires_boundary_before_storage_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeStorage: false });
  expect_rejected("ec_requires_boundary_before_persistence_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforePersistence: false });
  expect_rejected("ec_requires_boundary_before_user_visible_output_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeUserVisibleOutput: false });
  expect_rejected("ec_requires_boundary_before_evidence_gate_runtime_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeEvidenceGateRuntime: false });
  expect_rejected("ec_requires_boundary_before_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeClaimAuthorization: false });
  expect_rejected("ec_requires_boundary_before_deadline_calculation_false",
    { paidBoundaryRuntimeExecutionContractRequiresBoundaryBeforeDeadlineCalculation: false });

  // 8.5T future entitlement execution constraints
  expect_rejected("ec_requires_server_verified_entitlement_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedEntitlement: false });
  expect_rejected("ec_requires_server_verified_paid_session_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedPaidSession: false });
  expect_rejected("ec_requires_server_verified_product_or_feature_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedProductOrFeature: false });
  expect_rejected("ec_requires_server_verified_document_mode_access_false",
    { paidBoundaryRuntimeExecutionContractRequiresServerVerifiedDocumentModeAccess: false });
  expect_rejected("ec_forbids_ui_only_entitlement_false",
    { paidBoundaryRuntimeExecutionContractForbidsUiOnlyEntitlement: false });
  expect_rejected("ec_forbids_client_paid_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientPaidFlagTrust: false });
  expect_rejected("ec_forbids_client_document_mode_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientDocumentModeFlagTrust: false });
  expect_rejected("ec_forbids_client_entitlement_flag_trust_false",
    { paidBoundaryRuntimeExecutionContractForbidsClientEntitlementFlagTrust: false });
  expect_rejected("ec_requires_missing_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresMissingEntitlementBlocked: false });
  expect_rejected("ec_requires_malformed_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresMalformedEntitlementBlocked: false });
  expect_rejected("ec_requires_expired_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresExpiredEntitlementBlocked: false });
  expect_rejected("ec_requires_unverifiable_entitlement_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnverifiableEntitlementBlocked: false });
  expect_rejected("ec_requires_unauthorized_document_attempt_blocked_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedDocumentAttemptBlocked: false });
  expect_rejected("ec_requires_no_fallback_to_free_qa_document_processing_false",
    { paidBoundaryRuntimeExecutionContractRequiresNoFallbackToFreeQaDocumentProcessing: false });
  expect_rejected("ec_requires_deny_by_default_false",
    { paidBoundaryRuntimeExecutionContractRequiresDenyByDefault: false });

  // 8.5T future unauthorized response execution constraints
  expect_rejected("ec_requires_unauthorized_response_non_success_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNonSuccess: false });
  expect_rejected("ec_requires_unauthorized_response_ok_false_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseOkFalse: false });
  expect_rejected("ec_requires_unauthorized_response_code_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseCodeDocumentModeRequiredOrPaymentRequired: false });
  expect_rejected("ec_requires_unauthorized_response_no_raw_document_echo_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("ec_requires_unauthorized_response_no_translation_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoTranslation: false });
  expect_rejected("ec_requires_unauthorized_response_no_summary_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoSummary: false });
  expect_rejected("ec_requires_unauthorized_response_no_explanation_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoExplanation: false });
  expect_rejected("ec_requires_unauthorized_response_no_legal_advice_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("ec_requires_unauthorized_response_no_deadline_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoDeadline: false });
  expect_rejected("ec_requires_unauthorized_response_no_legal_certainty_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("ec_requires_unauthorized_response_no_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("ec_requires_unauthorized_response_no_internal_governance_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedResponseNoInternalGovernance: false });

  // 8.5T future lane and safety execution constraints
  expect_rejected("ec_defines_free_qa_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFreeQaLane: false });
  expect_rejected("ec_defines_unauthorized_document_attempt_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesUnauthorizedDocumentAttemptLane: false });
  expect_rejected("ec_defines_future_paid_document_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFuturePaidDocumentLane: false });
  expect_rejected("ec_defines_future_entitled_document_processing_lane_false",
    { paidBoundaryRuntimeExecutionContractDefinesFutureEntitledDocumentProcessingLane: false });
  expect_rejected("ec_requires_unauthorized_lane_document_mode_required_false",
    { paidBoundaryRuntimeExecutionContractRequiresUnauthorizedLaneDocumentModeRequired: false });
  expect_rejected("ec_requires_entitled_lane_still_subject_to_pii_redaction_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToPiiRedaction: false });
  expect_rejected("ec_requires_entitled_lane_still_subject_to_evidence_gates_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToEvidenceGates: false });
  expect_rejected("ec_requires_entitled_lane_still_subject_to_legal_safety_blocks_false",
    { paidBoundaryRuntimeExecutionContractRequiresEntitledLaneStillSubjectToLegalSafetyBlocks: false });
  expect_rejected("ec_requires_no_runtime_activation_this_phase_false",
    { paidBoundaryRuntimeExecutionContractRequiresNoRuntimeActivationThisPhase: false });
  expect_rejected("ec_requires_separate_surgical_patch_next_false",
    { paidBoundaryRuntimeExecutionContractRequiresSeparateSurgicalPatchNext: false });
  expect_rejected("ec_requires_post_patch_containment_audit_false",
    { paidBoundaryRuntimeExecutionContractRequiresPostPatchContainmentAuditAfterSurgicalPatch: false });

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td005_boundary_runtime_execution_contracted_false",
    { td005PaidDocumentModeBoundaryRuntimeExecutionContracted: false });
  expect_rejected("td005_still_requires_surgical_route_patch_false",
    { td005PaidDocumentModeStillRequiresSurgicalRoutePatch: false });
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

  // Actual performed flags from prereq (must all be false)
  expect_rejected("prereq_actual_live_route_mutation_performed_true",
    { actualLiveRouteMutationPerformed: true });
  expect_rejected("prereq_actual_smart_talk_route_modified_true",
    { actualSmartTalkRouteModified: true });
  expect_rejected("prereq_actual_photo_route_modified_true",
    { actualPhotoRouteModified: true });
  expect_rejected("prereq_actual_paid_document_boundary_implemented_true",
    { actualPaidDocumentBoundaryImplemented: true });
  expect_rejected("prereq_actual_paid_document_mode_implemented_true",
    { actualPaidDocumentModeImplemented: true });
  expect_rejected("prereq_actual_payment_runtime_implemented_true",
    { actualPaymentRuntimeImplemented: true });
  expect_rejected("prereq_actual_checkout_implemented_true",
    { actualCheckoutImplemented: true });
  expect_rejected("prereq_actual_entitlement_runtime_implemented_true",
    { actualEntitlementRuntimeImplemented: true });
  expect_rejected("prereq_actual_real_document_input_performed_true",
    { actualRealDocumentInputPerformed: true });
  expect_rejected("prereq_actual_real_document_processing_performed_true",
    { actualRealDocumentProcessingPerformed: true });
  expect_rejected("prereq_actual_ocr_performed_true", { actualOcrPerformed: true });
  expect_rejected("prereq_actual_photo_input_processed_true",
    { actualPhotoInputProcessed: true });
  expect_rejected("prereq_actual_file_input_processed_true",
    { actualFileInputProcessed: true });
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
  expect_rejected("prereq_actual_model_call_performed_true",
    { actualModelCallPerformed: true });
  expect_rejected("prereq_actual_run_smart_talk_called_true",
    { actualRunSmartTalkCalled: true });

  // 8.5T confirms (must all be true)
  expect_rejected("ec_confirms_no_openai_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoOpenAiCall: false });
  expect_rejected("ec_confirms_no_fetch_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoFetchCall: false });
  expect_rejected("ec_confirms_no_process_env_read_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoProcessEnvRead: false });
  expect_rejected("ec_confirms_no_sdk_usage_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSdkUsage: false });
  expect_rejected("ec_confirms_no_8x3ac_rerun_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNo8x3AcRerun: false });
  expect_rejected("ec_confirms_no_smart_talk_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("ec_confirms_no_route_import_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRouteImport: false });
  expect_rejected("ec_confirms_no_route_mutation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRouteMutation: false });
  expect_rejected("ec_confirms_no_payment_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("ec_confirms_no_stripe_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoStripeCall: false });
  expect_rejected("ec_confirms_no_checkout_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoCheckoutCall: false });
  expect_rejected("ec_confirms_no_entitlement_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("ec_confirms_no_ocr_runtime_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoOcrRuntimeCall: false });
  expect_rejected("ec_confirms_no_storage_mutation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoStorageMutation: false });
  expect_rejected("ec_confirms_no_database_write_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoDatabaseWrite: false });
  expect_rejected("ec_confirms_no_audit_persistence_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoAuditPersistence: false });
  expect_rejected("ec_confirms_no_user_visible_document_explanation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("ec_confirms_no_evidence_evaluation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoEvidenceEvaluation: false });
  expect_rejected("ec_confirms_no_claim_authorization_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoClaimAuthorization: false });
  expect_rejected("ec_confirms_no_deadline_calculation_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoDeadlineCalculation: false });
  expect_rejected("ec_confirms_no_legal_certainty_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoLegalCertainty: false });
  expect_rejected("ec_confirms_no_prompt_build_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPromptBuild: false });
  expect_rejected("ec_confirms_no_model_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoModelCall: false });
  expect_rejected("ec_confirms_no_run_smart_talk_call_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoRunSmartTalkCall: false });
  expect_rejected("ec_confirms_no_smart_talk_route_modification_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoSmartTalkRouteModification: false });
  expect_rejected("ec_confirms_no_photo_route_modification_false",
    { paidBoundaryRuntimeExecutionContractConfirmsNoPhotoRouteModification: false });

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

  // 8.5T forward readiness gate
  expect_rejected("ready_for_8x5u_surgical_route_patch_false",
    { readyFor8x5UPaidDocumentModeBoundarySurgicalRoutePatch: false });

  // 8.5U core surgical patch assertion flags
  expect_rejected("execution_contract_ready_for_surgical_route_patch_false",
    { paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: false });
  expect_rejected("surgical_route_patch_performed_false",
    { paidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("surgical_route_patch_only_false",
    { paidDocumentModeBoundarySurgicalRoutePatchOnly: false });
  expect_rejected("implemented_as_deny_by_default_only_false",
    { paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: false });
  expect_rejected("paid_document_mode_runtime_still_not_implemented_false",
    { paidDocumentModeRuntimeStillNotImplemented: false });
  expect_rejected("entitlement_runtime_still_not_impl_in_patch_false",
    { paidDocumentModeEntitlementRuntimeStillNotImplInPatch: false });
  expect_rejected("document_processing_still_not_authorized_in_patch_false",
    { paidDocumentModeDocumentProcessingStillNotAuthorizedInPatch: false });

  // 8.5U actual route mutation flags
  expect_rejected("actual_live_route_mutation_performed_by_patch_false",
    { actualLiveRouteMutationPerformedByPatch: false });
  expect_rejected("actual_smart_talk_route_modified_by_patch_false",
    { actualSmartTalkRouteModifiedByPatch: false });
  expect_rejected("actual_photo_route_modified_by_patch_true",
    { actualPhotoRouteModifiedByPatch: true });
  expect_rejected("actual_paid_document_boundary_implemented_by_patch_false",
    { actualPaidDocumentBoundaryImplementedByPatch: false });
  expect_rejected("actual_paid_document_boundary_deny_by_default_only_false",
    { actualPaidDocumentBoundaryDenyByDefaultOnly: false });
  expect_rejected("actual_server_entitlement_verification_implemented_true",
    { actualServerEntitlementVerificationImplemented: true });

  // 8.5U boundary placement confirmations (all true)
  expect_rejected("patch_placed_after_json_parse_false",
    { paidBoundarySurgicalPatchPlacedAfterJsonParse: false });
  expect_rejected("patch_placed_after_text_validation_false",
    { paidBoundarySurgicalPatchPlacedAfterTextValidation: false });
  expect_rejected("patch_placed_before_run_smart_talk_false",
    { paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: false });
  expect_rejected("patch_placed_before_prompt_build_false",
    { paidBoundarySurgicalPatchPlacedBeforePromptBuild: false });
  expect_rejected("patch_placed_before_model_call_false",
    { paidBoundarySurgicalPatchPlacedBeforeModelCall: false });
  expect_rejected("patch_placed_before_document_processing_false",
    { paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: false });
  expect_rejected("patch_placed_before_storage_false",
    { paidBoundarySurgicalPatchPlacedBeforeStorage: false });
  expect_rejected("patch_placed_before_persistence_false",
    { paidBoundarySurgicalPatchPlacedBeforePersistence: false });
  expect_rejected("patch_placed_before_user_visible_output_false",
    { paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: false });
  expect_rejected("patch_placed_before_evidence_gate_runtime_false",
    { paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: false });
  expect_rejected("patch_placed_before_claim_authorization_false",
    { paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: false });
  expect_rejected("patch_placed_before_deadline_calculation_false",
    { paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: false });

  // 8.5U detection/denial confirmations (all true)
  expect_rejected("patch_detects_client_document_mode_field_false",
    { paidBoundarySurgicalPatchDetectsClientDocumentModeField: false });
  expect_rejected("patch_detects_client_paid_document_mode_field_false",
    { paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: false });
  expect_rejected("patch_detects_client_entitlement_field_false",
    { paidBoundarySurgicalPatchDetectsClientEntitlementField: false });
  expect_rejected("patch_detects_client_paid_flag_false",
    { paidBoundarySurgicalPatchDetectsClientPaidFlag: false });
  expect_rejected("patch_rejects_client_only_paid_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: false });
  expect_rejected("patch_rejects_client_only_document_mode_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: false });
  expect_rejected("patch_rejects_client_only_entitlement_flag_false",
    { paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: false });
  expect_rejected("patch_requires_future_server_entitlement_false",
    { paidBoundarySurgicalPatchRequiresFutureServerEntitlement: false });
  expect_rejected("patch_denies_missing_server_entitlement_runtime_false",
    { paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: false });
  expect_rejected("patch_does_not_trust_ui_only_state_false",
    { paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: false });
  expect_rejected("patch_does_not_trust_client_flags_false",
    { paidBoundarySurgicalPatchDoesNotTrustClientFlags: false });
  expect_rejected("patch_deny_by_default_false",
    { paidBoundarySurgicalPatchDenyByDefault: false });

  // 8.5U unauthorized response confirmations (all true)
  expect_rejected("patch_unauthorized_response_non_success_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: false });
  expect_rejected("patch_unauthorized_response_ok_false_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: false });
  expect_rejected("patch_unauthorized_response_code_document_mode_required_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: false });
  expect_rejected("patch_unauthorized_response_no_raw_document_echo_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: false });
  expect_rejected("patch_unauthorized_response_no_translation_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: false });
  expect_rejected("patch_unauthorized_response_no_summary_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: false });
  expect_rejected("patch_unauthorized_response_no_explanation_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: false });
  expect_rejected("patch_unauthorized_response_no_legal_advice_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: false });
  expect_rejected("patch_unauthorized_response_no_deadline_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: false });
  expect_rejected("patch_unauthorized_response_no_legal_certainty_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: false });
  expect_rejected("patch_unauthorized_response_no_claim_authorization_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: false });
  expect_rejected("patch_unauthorized_response_no_internal_governance_false",
    { paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: false });

  // 8.5U preservation confirmations (all true)
  expect_rejected("patch_preserves_free_qa_lane_false",
    { paidBoundarySurgicalPatchPreservesFreeQaLane: false });
  expect_rejected("patch_preserves_general_questions_false",
    { paidBoundarySurgicalPatchPreservesGeneralQuestions: false });
  expect_rejected("patch_preserves_8x5n_document_bypass_guard_false",
    { paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: false });
  expect_rejected("patch_preserves_document_like_text_blocking_in_free_qa_false",
    { paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: false });
  expect_rejected("patch_preserves_document_mode_required_response_false",
    { paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: false });
  expect_rejected("patch_preserves_8x5h_photo_ocr_quarantine_false",
    { paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: false });
  expect_rejected("patch_does_not_modify_photo_route_false",
    { paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: false });
  expect_rejected("patch_does_not_enable_document_processing_false",
    { paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: false });
  expect_rejected("patch_does_not_enable_user_visible_document_explanation_false",
    { paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: false });
  expect_rejected("patch_does_not_enable_public_runtime_false",
    { paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: false });

  // 8.5U no-prohibited-side-effect confirmations (all true)
  expect_rejected("patch_confirms_no_openai_call_false",
    { paidBoundarySurgicalPatchConfirmsNoOpenAiCall: false });
  expect_rejected("patch_confirms_no_fetch_call_false",
    { paidBoundarySurgicalPatchConfirmsNoFetchCall: false });
  expect_rejected("patch_confirms_no_process_env_read_false",
    { paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: false });
  expect_rejected("patch_confirms_no_sdk_usage_false",
    { paidBoundarySurgicalPatchConfirmsNoSdkUsage: false });
  expect_rejected("patch_confirms_no_8x3ac_rerun_false",
    { paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: false });
  expect_rejected("patch_confirms_no_payment_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("patch_confirms_no_stripe_call_false",
    { paidBoundarySurgicalPatchConfirmsNoStripeCall: false });
  expect_rejected("patch_confirms_no_checkout_call_false",
    { paidBoundarySurgicalPatchConfirmsNoCheckoutCall: false });
  expect_rejected("patch_confirms_no_entitlement_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: false });
  expect_rejected("patch_confirms_no_server_entitlement_verification_false",
    { paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: false });
  expect_rejected("patch_confirms_no_ocr_runtime_call_false",
    { paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: false });
  expect_rejected("patch_confirms_no_storage_mutation_false",
    { paidBoundarySurgicalPatchConfirmsNoStorageMutation: false });
  expect_rejected("patch_confirms_no_database_write_false",
    { paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: false });
  expect_rejected("patch_confirms_no_audit_persistence_false",
    { paidBoundarySurgicalPatchConfirmsNoAuditPersistence: false });
  expect_rejected("patch_confirms_no_user_visible_document_explanation_false",
    { paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("patch_confirms_no_evidence_evaluation_false",
    { paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: false });
  expect_rejected("patch_confirms_no_claim_authorization_false",
    { paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: false });
  expect_rejected("patch_confirms_no_deadline_calculation_false",
    { paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: false });
  expect_rejected("patch_confirms_no_legal_certainty_false",
    { paidBoundarySurgicalPatchConfirmsNoLegalCertainty: false });
  expect_rejected("patch_confirms_no_prompt_build_false",
    { paidBoundarySurgicalPatchConfirmsNoPromptBuild: false });
  expect_rejected("patch_confirms_no_model_call_false",
    { paidBoundarySurgicalPatchConfirmsNoModelCall: false });
  expect_rejected("patch_confirms_no_run_smart_talk_call_false",
    { paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: false });
  expect_rejected("patch_confirms_no_photo_route_modification_false",
    { paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: false });

  // 8.5U TD-005 result flags
  expect_rejected("td005_boundary_surgical_route_patch_performed_false",
    { td005PaidDocumentModeBoundarySurgicalRoutePatchPerformed: false });
  expect_rejected("td005_still_requires_post_patch_containment_audit_result_false",
    { td005PaidDocumentModeStillRequiresPostPatchContainmentAuditResult: false });
  expect_rejected("td005_still_requires_actual_runtime_implementation_result_false",
    { td005PaidDocumentModeStillRequiresActualRuntimeImplementationResult: false });
  expect_rejected("td004_false_in_result", { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td002_false_in_result",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // 8.5U forward readiness
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

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatch(): ControlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchResult {
  const canonical = buildCanonical8x5UInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateSurgicalRoutePatchInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5U",
    allPassed,
    paidDocumentModeBoundaryRuntimeExecutionContractReadyForSurgicalRoutePatch: true,
    controlledRealDocumentPaidDocumentModeBoundarySurgicalRoutePatchAccepted: allPassed,
    paidDocumentModeBoundarySurgicalRoutePatchPerformed: true,
    paidDocumentModeBoundarySurgicalRoutePatchOnly: true,
    paidDocumentModeBoundaryImplementedAsDenyByDefaultOnly: true,
    paidDocumentModeRuntimeStillNotImplemented: true,
    paidDocumentModePaymentRuntimeStillNotImplemented: true,
    paidDocumentModeCheckoutRuntimeStillNotImplemented: true,
    paidDocumentModeEntitlementRuntimeStillNotImplemented: true,
    paidDocumentModeDocumentProcessingStillNotAuthorized: true,
    paidDocumentModeUserVisibleDocumentExplanationStillNotAuthorized: true,
    tamperCasesRejected: tamperResult.allRejected,

    actualLiveRouteMutationPerformed: true,
    actualSmartTalkRouteModified: true,
    actualPhotoRouteModified: false,
    actualPaidDocumentBoundaryImplemented: true,
    actualPaidDocumentBoundaryDenyByDefaultOnly: true,
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

    paidBoundarySurgicalPatchPlacedAfterJsonParse: true,
    paidBoundarySurgicalPatchPlacedAfterTextValidation: true,
    paidBoundarySurgicalPatchPlacedBeforeRunSmartTalk: true,
    paidBoundarySurgicalPatchPlacedBeforePromptBuild: true,
    paidBoundarySurgicalPatchPlacedBeforeModelCall: true,
    paidBoundarySurgicalPatchPlacedBeforeDocumentProcessing: true,
    paidBoundarySurgicalPatchPlacedBeforeStorage: true,
    paidBoundarySurgicalPatchPlacedBeforePersistence: true,
    paidBoundarySurgicalPatchPlacedBeforeUserVisibleOutput: true,
    paidBoundarySurgicalPatchPlacedBeforeEvidenceGateRuntime: true,
    paidBoundarySurgicalPatchPlacedBeforeClaimAuthorization: true,
    paidBoundarySurgicalPatchPlacedBeforeDeadlineCalculation: true,

    paidBoundarySurgicalPatchDetectsClientDocumentModeField: true,
    paidBoundarySurgicalPatchDetectsClientPaidDocumentModeField: true,
    paidBoundarySurgicalPatchDetectsClientEntitlementField: true,
    paidBoundarySurgicalPatchDetectsClientPaidFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyPaidFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyDocumentModeFlag: true,
    paidBoundarySurgicalPatchRejectsClientOnlyEntitlementFlag: true,
    paidBoundarySurgicalPatchRequiresFutureServerEntitlement: true,
    paidBoundarySurgicalPatchDeniesMissingServerEntitlementRuntime: true,
    paidBoundarySurgicalPatchDoesNotTrustUiOnlyState: true,
    paidBoundarySurgicalPatchDoesNotTrustClientFlags: true,
    paidBoundarySurgicalPatchDenyByDefault: true,

    paidBoundarySurgicalPatchUnauthorizedResponseNonSuccess: true,
    paidBoundarySurgicalPatchUnauthorizedResponseOkFalse: true,
    paidBoundarySurgicalPatchUnauthorizedResponseCodeDocumentModeRequired: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoRawDocumentEcho: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoTranslation: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoSummary: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoExplanation: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalAdvice: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoDeadline: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoLegalCertainty: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoClaimAuthorization: true,
    paidBoundarySurgicalPatchUnauthorizedResponseNoInternalGovernance: true,

    paidBoundarySurgicalPatchPreservesFreeQaLane: true,
    paidBoundarySurgicalPatchPreservesGeneralQuestions: true,
    paidBoundarySurgicalPatchPreserves8x5NDocumentBypassGuard: true,
    paidBoundarySurgicalPatchPreservesDocumentLikeTextBlockingInFreeQa: true,
    paidBoundarySurgicalPatchPreservesDocumentModeRequiredResponse: true,
    paidBoundarySurgicalPatchPreserves8x5HPhotoOcrQuarantine: true,
    paidBoundarySurgicalPatchDoesNotModifyPhotoRoute: true,
    paidBoundarySurgicalPatchDoesNotEnableDocumentProcessing: true,
    paidBoundarySurgicalPatchDoesNotEnableUserVisibleDocumentExplanation: true,
    paidBoundarySurgicalPatchDoesNotEnablePublicRuntime: true,

    paidBoundarySurgicalPatchConfirmsNoOpenAiCall: true,
    paidBoundarySurgicalPatchConfirmsNoFetchCall: true,
    paidBoundarySurgicalPatchConfirmsNoProcessEnvRead: true,
    paidBoundarySurgicalPatchConfirmsNoSdkUsage: true,
    paidBoundarySurgicalPatchConfirmsNo8x3AcRerun: true,
    paidBoundarySurgicalPatchConfirmsNoPaymentRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoStripeCall: true,
    paidBoundarySurgicalPatchConfirmsNoCheckoutCall: true,
    paidBoundarySurgicalPatchConfirmsNoEntitlementRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoServerEntitlementVerification: true,
    paidBoundarySurgicalPatchConfirmsNoOcrRuntimeCall: true,
    paidBoundarySurgicalPatchConfirmsNoStorageMutation: true,
    paidBoundarySurgicalPatchConfirmsNoDatabaseWrite: true,
    paidBoundarySurgicalPatchConfirmsNoAuditPersistence: true,
    paidBoundarySurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true,
    paidBoundarySurgicalPatchConfirmsNoEvidenceEvaluation: true,
    paidBoundarySurgicalPatchConfirmsNoClaimAuthorization: true,
    paidBoundarySurgicalPatchConfirmsNoDeadlineCalculation: true,
    paidBoundarySurgicalPatchConfirmsNoLegalCertainty: true,
    paidBoundarySurgicalPatchConfirmsNoPromptBuild: true,
    paidBoundarySurgicalPatchConfirmsNoModelCall: true,
    paidBoundarySurgicalPatchConfirmsNoRunSmartTalkCall: true,
    paidBoundarySurgicalPatchConfirmsNoPhotoRouteModification: true,

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

    readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5U is a controlled real-document Paid Document Mode Boundary Surgical Route Patch.",
      "8.5U depends on completed 8.5T Paid Document Mode Boundary Runtime Execution Contract.",
      "8.5U modifies /api/smart-talk only.",
      "8.5U does not modify /api/smart-talk-photo.",
      "8.5U implements only a deny-by-default client-flag Paid Document Mode boundary.",
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
      "The patch denies client-side paid/document/entitlement activation flags by default.",
      "UI-only and client-provided paid/document/entitlement flags are not trusted.",
      "Entitled document processing remains blocked until PII redaction, Evidence Gates, and legal safety blocks are separately wired.",
      "TD-005 surgical route patch is performed but still requires post-patch containment audit and actual runtime implementation.",
      "TD-004 remains unresolved.",
      "TD-002 remains unresolved.",
      "8.3AC was not re-run.",
      "The next phase is 8.5V Paid Document Mode Boundary Post-Patch Containment Audit.",
      "readyFor8x5VPaidDocumentModeBoundaryPostPatchContainmentAudit is audit readiness only, not public runtime authorization.",
    ],
  };
}
