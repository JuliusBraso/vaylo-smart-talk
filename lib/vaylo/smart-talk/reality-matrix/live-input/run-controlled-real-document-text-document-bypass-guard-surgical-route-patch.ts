/**
 * Phase 8.5N — Controlled Real Document Text Document Bypass Guard Surgical
 * Route Patch.
 *
 * SURGICAL-ROUTE-PATCH-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5M.
 *
 * This file records that the surgical /api/smart-talk route patch was performed
 * according to the 8.5M execution contract. It does NOT import or call the live
 * route.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call the live route.
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContract } from "./run-controlled-real-document-text-document-bypass-guard-route-patch-execution-contract";

// ── Local surgical route patch input type ────────────────────────────────────

interface ControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchInput {
  // 8.5M prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContractAccepted: boolean;
  readonly textDocumentBypassGuardRoutePatchExecutionContractOnly: boolean;
  readonly textDocumentBypassGuardRoutePatchExecutionContractDefined: boolean;
  readonly textDocumentBypassGuardRuntimeStillNotImplemented: boolean;
  readonly textDocumentBypassGuardRoutePatchStillNotPerformed: boolean;
  readonly textDocumentBypassGuardRoutePatchExecutionContractAllowsNextSurgicalPatch: boolean;
  readonly textDocumentBypassGuardRoutePatchExecutionContractDoesNotPerformPatch: boolean;

  // Execution contract target flags (must all be true)
  readonly executionContractTargetsSmartTalkRouteOnly: boolean;
  readonly executionContractForbidsPhotoRouteModification: boolean;
  readonly executionContractRequiresPhotoOcrQuarantinePreserved: boolean;
  readonly executionContractRequiresMinimalSurgicalRoutePatch: boolean;
  readonly executionContractForbidsBroadRouteRefactor: boolean;
  readonly executionContractForbidsUiChanges: boolean;
  readonly executionContractForbidsEnvChanges: boolean;
  readonly executionContractForbidsMigrationChanges: boolean;
  readonly executionContractForbidsPaymentChanges: boolean;
  readonly executionContractForbidsStorageChanges: boolean;
  readonly executionContractForbidsSupabaseChanges: boolean;
  readonly executionContractForbidsDatabaseWrites: boolean;

  // Execution contract insertion flags (must all be true)
  readonly executionContractRequiresPostJsonParseInsertion: boolean;
  readonly executionContractRequiresPreRunSmartTalkInsertion: boolean;
  readonly executionContractRequiresPrePromptBuildInsertion: boolean;
  readonly executionContractRequiresPreModelCallInsertion: boolean;
  readonly executionContractRequiresPreFullDocumentAnalysisInsertion: boolean;
  readonly executionContractRequiresServerSideGuard: boolean;
  readonly executionContractForbidsUiOnlyGuard: boolean;
  readonly executionContractForbidsModelBasedGuardDecision: boolean;
  readonly executionContractRequiresDeterministicLocalDecision: boolean;
  readonly executionContractRequiresNoExternalServiceDecision: boolean;
  readonly executionContractRequiresBlockedPathNoRunSmartTalk: boolean;
  readonly executionContractRequiresAllowedPathExistingFlowPreserved: boolean;

  // Execution contract detector flags (must all be true)
  readonly executionContractDetectorUsesMultiSignalScoring: boolean;
  readonly executionContractDetectorUsesLengthThresholds: boolean;
  readonly executionContractDetectorUsesOfficialLetterMarkers: boolean;
  readonly executionContractDetectorUsesGermanAuthorityMarkers: boolean;
  readonly executionContractDetectorUsesInvoiceMahnungMarkers: boolean;
  readonly executionContractDetectorUsesBescheidWiderspruchMarkers: boolean;
  readonly executionContractDetectorUsesDeadlineLegalConsequenceMarkers: boolean;
  readonly executionContractDetectorUsesPersonalDataMarkers: boolean;
  readonly executionContractDetectorUsesReferenceNumberMarkers: boolean;
  readonly executionContractDetectorUsesSalutationAndSignatureMarkers: boolean;
  readonly executionContractDetectorPassesQuestionLikeGeneralText: boolean;
  readonly executionContractDetectorBlocksHighRiskDocumentLikeText: boolean;
  readonly executionContractDetectorUsesConservativeHandling: boolean;

  // Execution contract blocked response flags (must all be true)
  readonly executionContractBlockedResponseStatusNonSuccess: boolean;
  readonly executionContractBlockedResponseOkFalse: boolean;
  readonly executionContractBlockedResponseCodeDocumentModeRequired: boolean;
  readonly executionContractBlockedResponseShortUserSafeMessage: boolean;
  readonly executionContractBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: boolean;
  readonly executionContractBlockedResponseMaySuggestGeneralQuestionRephrase: boolean;
  readonly executionContractBlockedResponseNoInternalGovernance: boolean;
  readonly executionContractBlockedResponseNoTamperOrAuditInternals: boolean;
  readonly executionContractBlockedResponseNoRawDocumentEcho: boolean;
  readonly executionContractBlockedResponseNoTranslation: boolean;
  readonly executionContractBlockedResponseNoSummary: boolean;
  readonly executionContractBlockedResponseNoExplanation: boolean;
  readonly executionContractBlockedResponseNoLegalAdvice: boolean;
  readonly executionContractBlockedResponseNoExactDeadline: boolean;
  readonly executionContractBlockedResponseNoLegalCertainty: boolean;
  readonly executionContractBlockedResponseNoClaimAuthorization: boolean;

  // Execution contract boundary flags (must all be true)
  readonly executionContractDoesNotActivatePaidDocumentMode: boolean;
  readonly executionContractDoesNotImplementPiiRedaction: boolean;
  readonly executionContractDoesNotWireEvidenceGates: boolean;
  readonly executionContractDoesNotAuthorizeDocumentRuntime: boolean;
  readonly executionContractDoesNotAuthorizePublicRuntime: boolean;
  readonly executionContractDoesNotAuthorizePersistence: boolean;
  readonly executionContractDoesNotAuthorizeUserVisibleDocumentExplanation: boolean;
  readonly executionContractDoesNotAuthorizeDeadlineCalculation: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD and containment flags
  readonly td001DocumentBypassGuardRoutePatchExecutionContracted: boolean;
  readonly td001DocumentBypassGuardStillRequiresActualRoutePatch: boolean;
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

  // Prereq actual performed flags (all must be false from 8.5M)
  readonly prereqActualLiveRouteMutationPerformed: boolean;
  readonly prereqActualDocumentBypassGuardImplemented: boolean;
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

  // 8.5M audit confirms no side effects (must all be true)
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoOpenAiCall: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoFetchCall: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoProcessEnvRead: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoSdkUsage: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoRouteImport: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoRouteMutation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoPublicRouteMutation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoUiMutation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoPromptStorage: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardRoutePatchExecutionContractConfirmsNoLegalCertainty: boolean;

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

  // 8.5M forward readiness
  readonly readyFor8x5NTextDocumentBypassGuardSurgicalRoutePatch: boolean;

  // 8.5N surgical patch assertions (must all be true)
  readonly textDocumentBypassGuardSurgicalRoutePatchPerformed: boolean;
  readonly textDocumentBypassGuardSurgicalRoutePatchOnly: boolean;
  readonly textDocumentBypassGuardRoutePatchWasMinimal: boolean;
  readonly textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: boolean;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: boolean;
  readonly textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: boolean;

  // Actual performed flags — 8.5N (two are true, all others false)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;

  // Surgical patch target flags (must all be true)
  readonly surgicalPatchModifiedSmartTalkRoute: boolean;
  readonly surgicalPatchDidNotModifyPhotoRoute: boolean;
  readonly surgicalPatchPreservedPhotoOcrQuarantine: boolean;
  readonly surgicalPatchDidNotModifyUi: boolean;
  readonly surgicalPatchDidNotModifyEnv: boolean;
  readonly surgicalPatchDidNotModifyMigrations: boolean;
  readonly surgicalPatchDidNotModifyPayment: boolean;
  readonly surgicalPatchDidNotModifyStorage: boolean;
  readonly surgicalPatchDidNotModifySupabase: boolean;
  readonly surgicalPatchDidNotModifyDatabase: boolean;
  readonly surgicalPatchDidNotAddDependency: boolean;
  readonly surgicalPatchDidNotRefactorRouteBroadly: boolean;

  // Surgical patch insertion flags (must all be true)
  readonly surgicalPatchInsertedAfterJsonParse: boolean;
  readonly surgicalPatchInsertedBeforeRunSmartTalk: boolean;
  readonly surgicalPatchInsertedBeforePromptBuild: boolean;
  readonly surgicalPatchInsertedBeforeModelCall: boolean;
  readonly surgicalPatchInsertedBeforeFullDocumentAnalysis: boolean;
  readonly surgicalPatchUsesServerSideGuard: boolean;
  readonly surgicalPatchDoesNotUseUiOnlyGuard: boolean;
  readonly surgicalPatchDoesNotUseModelBasedGuardDecision: boolean;
  readonly surgicalPatchUsesDeterministicLocalDecision: boolean;
  readonly surgicalPatchUsesNoExternalServiceDecision: boolean;
  readonly surgicalPatchBlockedPathDoesNotCallRunSmartTalk: boolean;
  readonly surgicalPatchAllowedPathPreservesExistingFlow: boolean;

  // Surgical patch detector flags (must all be true)
  readonly surgicalPatchDetectorUsesMultiSignalScoring: boolean;
  readonly surgicalPatchDetectorUsesLengthThresholds: boolean;
  readonly surgicalPatchDetectorUsesOfficialLetterMarkers: boolean;
  readonly surgicalPatchDetectorUsesGermanAuthorityMarkers: boolean;
  readonly surgicalPatchDetectorUsesInvoiceMahnungMarkers: boolean;
  readonly surgicalPatchDetectorUsesBescheidWiderspruchMarkers: boolean;
  readonly surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers: boolean;
  readonly surgicalPatchDetectorUsesPersonalDataMarkers: boolean;
  readonly surgicalPatchDetectorUsesReferenceNumberMarkers: boolean;
  readonly surgicalPatchDetectorUsesSalutationAndSignatureMarkers: boolean;
  readonly surgicalPatchDetectorPassesQuestionLikeGeneralText: boolean;
  readonly surgicalPatchDetectorBlocksHighRiskDocumentLikeText: boolean;
  readonly surgicalPatchDetectorUsesConservativeHandling: boolean;

  // Surgical patch blocked response flags (must all be true)
  readonly surgicalPatchBlockedResponseStatusNonSuccess: boolean;
  readonly surgicalPatchBlockedResponseOkFalse: boolean;
  readonly surgicalPatchBlockedResponseCodeDocumentModeRequired: boolean;
  readonly surgicalPatchBlockedResponseShortUserSafeMessage: boolean;
  readonly surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: boolean;
  readonly surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase: boolean;
  readonly surgicalPatchBlockedResponseNoInternalGovernance: boolean;
  readonly surgicalPatchBlockedResponseNoTamperOrAuditInternals: boolean;
  readonly surgicalPatchBlockedResponseNoRawDocumentEcho: boolean;
  readonly surgicalPatchBlockedResponseNoTranslation: boolean;
  readonly surgicalPatchBlockedResponseNoSummary: boolean;
  readonly surgicalPatchBlockedResponseNoExplanation: boolean;
  readonly surgicalPatchBlockedResponseNoLegalAdvice: boolean;
  readonly surgicalPatchBlockedResponseNoExactDeadline: boolean;
  readonly surgicalPatchBlockedResponseNoLegalCertainty: boolean;
  readonly surgicalPatchBlockedResponseNoClaimAuthorization: boolean;

  // TD containment — 8.5N update
  readonly td001DocumentBypassGuardSurgicallyPatched: boolean;
  readonly td001DocumentBypassGuardStillRequiresPostPatchAudit: boolean;

  // 8.5N audit confirms no prohibited side effects (must all be true)
  readonly textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoUiMutation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoStorageMutation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoAuditPersistence: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation: boolean;
  readonly textBypassGuardSurgicalPatchConfirmsNoLegalCertainty: boolean;

  // Forward readiness
  readonly readyFor8x5OPostPatchContainmentAudit: boolean;
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

export interface ControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchResult {
  readonly checkId: "8.5N";
  readonly allPassed: boolean;
  readonly textDocumentBypassGuardRoutePatchExecutionContractReadyForSurgicalPatch: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted: boolean;
  readonly textDocumentBypassGuardSurgicalRoutePatchPerformed: true;
  readonly textDocumentBypassGuardSurgicalRoutePatchOnly: true;
  readonly textDocumentBypassGuardRoutePatchWasMinimal: true;
  readonly textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: true;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: true;
  readonly textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: true;
  readonly textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: true;
  readonly tamperCasesRejected: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Actual performed flags
  readonly actualLiveRouteMutationPerformed: true;
  readonly actualDocumentBypassGuardImplemented: true;
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
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;

  // Surgical patch target flags
  readonly surgicalPatchModifiedSmartTalkRoute: true;
  readonly surgicalPatchDidNotModifyPhotoRoute: true;
  readonly surgicalPatchPreservedPhotoOcrQuarantine: true;
  readonly surgicalPatchDidNotModifyUi: true;
  readonly surgicalPatchDidNotModifyEnv: true;
  readonly surgicalPatchDidNotModifyMigrations: true;
  readonly surgicalPatchDidNotModifyPayment: true;
  readonly surgicalPatchDidNotModifyStorage: true;
  readonly surgicalPatchDidNotModifySupabase: true;
  readonly surgicalPatchDidNotModifyDatabase: true;
  readonly surgicalPatchDidNotAddDependency: true;
  readonly surgicalPatchDidNotRefactorRouteBroadly: true;

  // Surgical patch insertion flags
  readonly surgicalPatchInsertedAfterJsonParse: true;
  readonly surgicalPatchInsertedBeforeRunSmartTalk: true;
  readonly surgicalPatchInsertedBeforePromptBuild: true;
  readonly surgicalPatchInsertedBeforeModelCall: true;
  readonly surgicalPatchInsertedBeforeFullDocumentAnalysis: true;
  readonly surgicalPatchUsesServerSideGuard: true;
  readonly surgicalPatchDoesNotUseUiOnlyGuard: true;
  readonly surgicalPatchDoesNotUseModelBasedGuardDecision: true;
  readonly surgicalPatchUsesDeterministicLocalDecision: true;
  readonly surgicalPatchUsesNoExternalServiceDecision: true;
  readonly surgicalPatchBlockedPathDoesNotCallRunSmartTalk: true;
  readonly surgicalPatchAllowedPathPreservesExistingFlow: true;

  // Surgical patch detector flags
  readonly surgicalPatchDetectorUsesMultiSignalScoring: true;
  readonly surgicalPatchDetectorUsesLengthThresholds: true;
  readonly surgicalPatchDetectorUsesOfficialLetterMarkers: true;
  readonly surgicalPatchDetectorUsesGermanAuthorityMarkers: true;
  readonly surgicalPatchDetectorUsesInvoiceMahnungMarkers: true;
  readonly surgicalPatchDetectorUsesBescheidWiderspruchMarkers: true;
  readonly surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers: true;
  readonly surgicalPatchDetectorUsesPersonalDataMarkers: true;
  readonly surgicalPatchDetectorUsesReferenceNumberMarkers: true;
  readonly surgicalPatchDetectorUsesSalutationAndSignatureMarkers: true;
  readonly surgicalPatchDetectorPassesQuestionLikeGeneralText: true;
  readonly surgicalPatchDetectorBlocksHighRiskDocumentLikeText: true;
  readonly surgicalPatchDetectorUsesConservativeHandling: true;

  // Surgical patch blocked response flags
  readonly surgicalPatchBlockedResponseStatusNonSuccess: true;
  readonly surgicalPatchBlockedResponseOkFalse: true;
  readonly surgicalPatchBlockedResponseCodeDocumentModeRequired: true;
  readonly surgicalPatchBlockedResponseShortUserSafeMessage: true;
  readonly surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true;
  readonly surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase: true;
  readonly surgicalPatchBlockedResponseNoInternalGovernance: true;
  readonly surgicalPatchBlockedResponseNoTamperOrAuditInternals: true;
  readonly surgicalPatchBlockedResponseNoRawDocumentEcho: true;
  readonly surgicalPatchBlockedResponseNoTranslation: true;
  readonly surgicalPatchBlockedResponseNoSummary: true;
  readonly surgicalPatchBlockedResponseNoExplanation: true;
  readonly surgicalPatchBlockedResponseNoLegalAdvice: true;
  readonly surgicalPatchBlockedResponseNoExactDeadline: true;
  readonly surgicalPatchBlockedResponseNoLegalCertainty: true;
  readonly surgicalPatchBlockedResponseNoClaimAuthorization: true;

  // TD containment
  readonly td001DocumentBypassGuardSurgicallyPatched: true;
  readonly td001DocumentBypassGuardStillRequiresPostPatchAudit: true;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true;
  readonly td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true;

  // Still-active blocker flags
  readonly td004PreModelPiiRedactionMissing: true;
  readonly td005PaidDocumentModeNotServerSideEnforced: true;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;

  // Medium/low debt flags
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: true;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: true;
  readonly td008InMemoryRateLimiterServerlessUnsafe: true;
  readonly td010GetUserStateDocumentTypeTodoOpen: true;
  readonly td009TmpDebugRunnerDebtClosed: true;
  readonly tmpFilesPresentInWorkingTree: false;

  // 8.5N audit confirms no prohibited side effects
  readonly textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard: true;
  readonly textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoUiMutation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoStorageMutation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoAuditPersistence: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation: true;
  readonly textBypassGuardSurgicalPatchConfirmsNoLegalCertainty: true;

  // Pipeline executed flags (all false)
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
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

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  // Forward readiness
  readonly readyFor8x5OPostPatchContainmentAudit: true;
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

// ── Surgical route patch input validator ─────────────────────────────────────

function validateSurgicalRoutePatchInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5M prerequisite gates
  if (o["prereqCheckId"] !== "8.5M")
    reasons.push("prereq_check_id_must_be_8x5M");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContractAccepted"] !== true)
    reasons.push("execution_contract_not_accepted");
  if (o["textDocumentBypassGuardRoutePatchExecutionContractOnly"] !== true)
    reasons.push("execution_contract_only_false");
  if (o["textDocumentBypassGuardRoutePatchExecutionContractDefined"] !== true)
    reasons.push("execution_contract_defined_false");
  if (o["textDocumentBypassGuardRuntimeStillNotImplemented"] !== true)
    reasons.push("runtime_still_not_implemented_false");
  if (o["textDocumentBypassGuardRoutePatchStillNotPerformed"] !== true)
    reasons.push("route_patch_still_not_performed_false");
  if (o["textDocumentBypassGuardRoutePatchExecutionContractAllowsNextSurgicalPatch"] !== true)
    reasons.push("execution_contract_allows_next_surgical_patch_false");
  if (o["textDocumentBypassGuardRoutePatchExecutionContractDoesNotPerformPatch"] !== true)
    reasons.push("execution_contract_does_not_perform_patch_false");

  // Execution contract target flags (must all be true)
  if (o["executionContractTargetsSmartTalkRouteOnly"] !== true)
    reasons.push("ec_targets_smart_talk_route_only_false");
  if (o["executionContractForbidsPhotoRouteModification"] !== true)
    reasons.push("ec_forbids_photo_route_modification_false");
  if (o["executionContractRequiresPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("ec_requires_photo_ocr_quarantine_preserved_false");
  if (o["executionContractRequiresMinimalSurgicalRoutePatch"] !== true)
    reasons.push("ec_requires_minimal_surgical_route_patch_false");
  if (o["executionContractForbidsBroadRouteRefactor"] !== true)
    reasons.push("ec_forbids_broad_route_refactor_false");
  if (o["executionContractForbidsUiChanges"] !== true)
    reasons.push("ec_forbids_ui_changes_false");
  if (o["executionContractForbidsEnvChanges"] !== true)
    reasons.push("ec_forbids_env_changes_false");
  if (o["executionContractForbidsMigrationChanges"] !== true)
    reasons.push("ec_forbids_migration_changes_false");
  if (o["executionContractForbidsPaymentChanges"] !== true)
    reasons.push("ec_forbids_payment_changes_false");
  if (o["executionContractForbidsStorageChanges"] !== true)
    reasons.push("ec_forbids_storage_changes_false");
  if (o["executionContractForbidsSupabaseChanges"] !== true)
    reasons.push("ec_forbids_supabase_changes_false");
  if (o["executionContractForbidsDatabaseWrites"] !== true)
    reasons.push("ec_forbids_database_writes_false");

  // Execution contract insertion flags (must all be true)
  if (o["executionContractRequiresPostJsonParseInsertion"] !== true)
    reasons.push("ec_requires_post_json_parse_insertion_false");
  if (o["executionContractRequiresPreRunSmartTalkInsertion"] !== true)
    reasons.push("ec_requires_pre_run_smart_talk_insertion_false");
  if (o["executionContractRequiresPrePromptBuildInsertion"] !== true)
    reasons.push("ec_requires_pre_prompt_build_insertion_false");
  if (o["executionContractRequiresPreModelCallInsertion"] !== true)
    reasons.push("ec_requires_pre_model_call_insertion_false");
  if (o["executionContractRequiresPreFullDocumentAnalysisInsertion"] !== true)
    reasons.push("ec_requires_pre_full_document_analysis_insertion_false");
  if (o["executionContractRequiresServerSideGuard"] !== true)
    reasons.push("ec_requires_server_side_guard_false");
  if (o["executionContractForbidsUiOnlyGuard"] !== true)
    reasons.push("ec_forbids_ui_only_guard_false");
  if (o["executionContractForbidsModelBasedGuardDecision"] !== true)
    reasons.push("ec_forbids_model_based_guard_decision_false");
  if (o["executionContractRequiresDeterministicLocalDecision"] !== true)
    reasons.push("ec_requires_deterministic_local_decision_false");
  if (o["executionContractRequiresNoExternalServiceDecision"] !== true)
    reasons.push("ec_requires_no_external_service_decision_false");
  if (o["executionContractRequiresBlockedPathNoRunSmartTalk"] !== true)
    reasons.push("ec_requires_blocked_path_no_run_smart_talk_false");
  if (o["executionContractRequiresAllowedPathExistingFlowPreserved"] !== true)
    reasons.push("ec_requires_allowed_path_existing_flow_preserved_false");

  // Execution contract detector flags (must all be true)
  if (o["executionContractDetectorUsesMultiSignalScoring"] !== true)
    reasons.push("ec_detector_uses_multi_signal_scoring_false");
  if (o["executionContractDetectorUsesLengthThresholds"] !== true)
    reasons.push("ec_detector_uses_length_thresholds_false");
  if (o["executionContractDetectorUsesOfficialLetterMarkers"] !== true)
    reasons.push("ec_detector_uses_official_letter_markers_false");
  if (o["executionContractDetectorUsesGermanAuthorityMarkers"] !== true)
    reasons.push("ec_detector_uses_german_authority_markers_false");
  if (o["executionContractDetectorUsesInvoiceMahnungMarkers"] !== true)
    reasons.push("ec_detector_uses_invoice_mahnung_markers_false");
  if (o["executionContractDetectorUsesBescheidWiderspruchMarkers"] !== true)
    reasons.push("ec_detector_uses_bescheid_widerspruch_markers_false");
  if (o["executionContractDetectorUsesDeadlineLegalConsequenceMarkers"] !== true)
    reasons.push("ec_detector_uses_deadline_legal_consequence_markers_false");
  if (o["executionContractDetectorUsesPersonalDataMarkers"] !== true)
    reasons.push("ec_detector_uses_personal_data_markers_false");
  if (o["executionContractDetectorUsesReferenceNumberMarkers"] !== true)
    reasons.push("ec_detector_uses_reference_number_markers_false");
  if (o["executionContractDetectorUsesSalutationAndSignatureMarkers"] !== true)
    reasons.push("ec_detector_uses_salutation_and_signature_markers_false");
  if (o["executionContractDetectorPassesQuestionLikeGeneralText"] !== true)
    reasons.push("ec_detector_passes_question_like_general_text_false");
  if (o["executionContractDetectorBlocksHighRiskDocumentLikeText"] !== true)
    reasons.push("ec_detector_blocks_high_risk_document_like_text_false");
  if (o["executionContractDetectorUsesConservativeHandling"] !== true)
    reasons.push("ec_detector_uses_conservative_handling_false");

  // Execution contract blocked response flags (must all be true)
  if (o["executionContractBlockedResponseStatusNonSuccess"] !== true)
    reasons.push("ec_blocked_response_status_non_success_false");
  if (o["executionContractBlockedResponseOkFalse"] !== true)
    reasons.push("ec_blocked_response_ok_false_false");
  if (o["executionContractBlockedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("ec_blocked_response_code_document_mode_required_false");
  if (o["executionContractBlockedResponseShortUserSafeMessage"] !== true)
    reasons.push("ec_blocked_response_short_user_safe_message_false");
  if (o["executionContractBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime"] !== true)
    reasons.push("ec_blocked_response_points_to_paid_doc_mode_false");
  if (o["executionContractBlockedResponseMaySuggestGeneralQuestionRephrase"] !== true)
    reasons.push("ec_blocked_response_may_suggest_general_question_rephrase_false");
  if (o["executionContractBlockedResponseNoInternalGovernance"] !== true)
    reasons.push("ec_blocked_response_no_internal_governance_false");
  if (o["executionContractBlockedResponseNoTamperOrAuditInternals"] !== true)
    reasons.push("ec_blocked_response_no_tamper_or_audit_internals_false");
  if (o["executionContractBlockedResponseNoRawDocumentEcho"] !== true)
    reasons.push("ec_blocked_response_no_raw_document_echo_false");
  if (o["executionContractBlockedResponseNoTranslation"] !== true)
    reasons.push("ec_blocked_response_no_translation_false");
  if (o["executionContractBlockedResponseNoSummary"] !== true)
    reasons.push("ec_blocked_response_no_summary_false");
  if (o["executionContractBlockedResponseNoExplanation"] !== true)
    reasons.push("ec_blocked_response_no_explanation_false");
  if (o["executionContractBlockedResponseNoLegalAdvice"] !== true)
    reasons.push("ec_blocked_response_no_legal_advice_false");
  if (o["executionContractBlockedResponseNoExactDeadline"] !== true)
    reasons.push("ec_blocked_response_no_exact_deadline_false");
  if (o["executionContractBlockedResponseNoLegalCertainty"] !== true)
    reasons.push("ec_blocked_response_no_legal_certainty_false");
  if (o["executionContractBlockedResponseNoClaimAuthorization"] !== true)
    reasons.push("ec_blocked_response_no_claim_authorization_false");

  // Execution contract boundary flags (must all be true)
  if (o["executionContractDoesNotActivatePaidDocumentMode"] !== true)
    reasons.push("ec_does_not_activate_paid_document_mode_false");
  if (o["executionContractDoesNotImplementPiiRedaction"] !== true)
    reasons.push("ec_does_not_implement_pii_redaction_false");
  if (o["executionContractDoesNotWireEvidenceGates"] !== true)
    reasons.push("ec_does_not_wire_evidence_gates_false");
  if (o["executionContractDoesNotAuthorizeDocumentRuntime"] !== true)
    reasons.push("ec_does_not_authorize_document_runtime_false");
  if (o["executionContractDoesNotAuthorizePublicRuntime"] !== true)
    reasons.push("ec_does_not_authorize_public_runtime_false");
  if (o["executionContractDoesNotAuthorizePersistence"] !== true)
    reasons.push("ec_does_not_authorize_persistence_false");
  if (o["executionContractDoesNotAuthorizeUserVisibleDocumentExplanation"] !== true)
    reasons.push("ec_does_not_authorize_user_visible_document_explanation_false");
  if (o["executionContractDoesNotAuthorizeDeadlineCalculation"] !== true)
    reasons.push("ec_does_not_authorize_deadline_calculation_false");

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

  // TD and containment flags (must all be true or specific values)
  if (o["td001DocumentBypassGuardRoutePatchExecutionContracted"] !== true)
    reasons.push("td001_execution_contracted_false");
  if (o["td001DocumentBypassGuardStillRequiresActualRoutePatch"] !== true)
    reasons.push("td001_still_requires_actual_route_patch_false");
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
    reasons.push("td006_evidence_gate_todo_unresolved_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("td007_trap_claim_namespace_hardening_unresolved_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("td008_in_memory_rate_limiter_serverless_unsafe_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("td010_get_user_state_document_type_todo_open_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree_must_be_false");

  // Prereq actual performed flags (must all be false)
  if (o["prereqActualLiveRouteMutationPerformed"] !== false)
    reasons.push("prereq_actual_live_route_mutation_performed_must_be_false");
  if (o["prereqActualDocumentBypassGuardImplemented"] !== false)
    reasons.push("prereq_actual_document_bypass_guard_implemented_must_be_false");
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

  // 8.5M execution contract confirms (must all be true)
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoOpenAiCall"] !== true)
    reasons.push("ec_confirms_no_openai_call_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoFetchCall"] !== true)
    reasons.push("ec_confirms_no_fetch_call_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoProcessEnvRead"] !== true)
    reasons.push("ec_confirms_no_process_env_read_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoSdkUsage"] !== true)
    reasons.push("ec_confirms_no_sdk_usage_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNo8x3AcRerun"] !== true)
    reasons.push("ec_confirms_no_8x3ac_rerun_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("ec_confirms_no_smart_talk_runtime_call_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoRouteImport"] !== true)
    reasons.push("ec_confirms_no_route_import_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoRouteMutation"] !== true)
    reasons.push("ec_confirms_no_route_mutation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("ec_confirms_no_public_route_mutation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoUiMutation"] !== true)
    reasons.push("ec_confirms_no_ui_mutation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoSupabaseMutation"] !== true)
    reasons.push("ec_confirms_no_supabase_mutation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoStorageMutation"] !== true)
    reasons.push("ec_confirms_no_storage_mutation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoDatabaseWrite"] !== true)
    reasons.push("ec_confirms_no_database_write_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoAuditPersistence"] !== true)
    reasons.push("ec_confirms_no_audit_persistence_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("ec_confirms_no_payment_runtime_call_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("ec_confirms_no_ocr_runtime_call_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("ec_confirms_no_photo_input_processing_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoFileInputProcessing"] !== true)
    reasons.push("ec_confirms_no_file_input_processing_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("ec_confirms_no_document_parsing_runtime_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("ec_confirms_no_raw_document_storage_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoModelOutputStorage"] !== true)
    reasons.push("ec_confirms_no_model_output_storage_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoPromptStorage"] !== true)
    reasons.push("ec_confirms_no_prompt_storage_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("ec_confirms_no_user_visible_document_explanation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("ec_confirms_no_customer_facing_document_analysis_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("ec_confirms_no_evidence_evaluation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoClaimAuthorization"] !== true)
    reasons.push("ec_confirms_no_claim_authorization_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("ec_confirms_no_deadline_calculation_false");
  if (o["textBypassGuardRoutePatchExecutionContractConfirmsNoLegalCertainty"] !== true)
    reasons.push("ec_confirms_no_legal_certainty_false");

  // Pipeline executed flags (must all be false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("execution_sequence_actually_executed_must_be_false");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("runtime_pipeline_actually_executed_must_be_false");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("document_pipeline_actually_executed_must_be_false");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("ocr_pipeline_actually_executed_must_be_false");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("payment_pipeline_actually_executed_must_be_false");
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

  // 8.5M forward readiness
  if (o["readyFor8x5NTextDocumentBypassGuardSurgicalRoutePatch"] !== true)
    reasons.push("ready_for_8x5n_surgical_route_patch_false");

  // 8.5N surgical patch assertions (must all be true)
  if (o["textDocumentBypassGuardSurgicalRoutePatchPerformed"] !== true)
    reasons.push("surgical_route_patch_performed_false");
  if (o["textDocumentBypassGuardSurgicalRoutePatchOnly"] !== true)
    reasons.push("surgical_route_patch_only_false");
  if (o["textDocumentBypassGuardRoutePatchWasMinimal"] !== true)
    reasons.push("route_patch_was_minimal_false");
  if (o["textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment"] !== true)
    reasons.push("runtime_now_implemented_for_free_qa_containment_false");
  if (o["textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk"] !== true)
    reasons.push("blocks_document_like_text_before_run_smart_talk_false");
  if (o["textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow"] !== true)
    reasons.push("allows_general_questions_existing_flow_false");
  if (o["textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime"] !== true)
    reasons.push("does_not_authorize_real_document_runtime_false");

  // Actual performed flags — 8.5N (two are true)
  if (o["actualLiveRouteMutationPerformed"] !== true)
    reasons.push("actual_live_route_mutation_performed_must_be_true");
  if (o["actualDocumentBypassGuardImplemented"] !== true)
    reasons.push("actual_document_bypass_guard_implemented_must_be_true");

  // Surgical patch target flags (must all be true)
  if (o["surgicalPatchModifiedSmartTalkRoute"] !== true)
    reasons.push("surgical_patch_modified_smart_talk_route_false");
  if (o["surgicalPatchDidNotModifyPhotoRoute"] !== true)
    reasons.push("surgical_patch_did_not_modify_photo_route_false");
  if (o["surgicalPatchPreservedPhotoOcrQuarantine"] !== true)
    reasons.push("surgical_patch_preserved_photo_ocr_quarantine_false");
  if (o["surgicalPatchDidNotModifyUi"] !== true)
    reasons.push("surgical_patch_did_not_modify_ui_false");
  if (o["surgicalPatchDidNotModifyEnv"] !== true)
    reasons.push("surgical_patch_did_not_modify_env_false");
  if (o["surgicalPatchDidNotModifyMigrations"] !== true)
    reasons.push("surgical_patch_did_not_modify_migrations_false");
  if (o["surgicalPatchDidNotModifyPayment"] !== true)
    reasons.push("surgical_patch_did_not_modify_payment_false");
  if (o["surgicalPatchDidNotModifyStorage"] !== true)
    reasons.push("surgical_patch_did_not_modify_storage_false");
  if (o["surgicalPatchDidNotModifySupabase"] !== true)
    reasons.push("surgical_patch_did_not_modify_supabase_false");
  if (o["surgicalPatchDidNotModifyDatabase"] !== true)
    reasons.push("surgical_patch_did_not_modify_database_false");
  if (o["surgicalPatchDidNotAddDependency"] !== true)
    reasons.push("surgical_patch_did_not_add_dependency_false");
  if (o["surgicalPatchDidNotRefactorRouteBroadly"] !== true)
    reasons.push("surgical_patch_did_not_refactor_route_broadly_false");

  // Surgical patch insertion flags (must all be true)
  if (o["surgicalPatchInsertedAfterJsonParse"] !== true)
    reasons.push("surgical_patch_inserted_after_json_parse_false");
  if (o["surgicalPatchInsertedBeforeRunSmartTalk"] !== true)
    reasons.push("surgical_patch_inserted_before_run_smart_talk_false");
  if (o["surgicalPatchInsertedBeforePromptBuild"] !== true)
    reasons.push("surgical_patch_inserted_before_prompt_build_false");
  if (o["surgicalPatchInsertedBeforeModelCall"] !== true)
    reasons.push("surgical_patch_inserted_before_model_call_false");
  if (o["surgicalPatchInsertedBeforeFullDocumentAnalysis"] !== true)
    reasons.push("surgical_patch_inserted_before_full_document_analysis_false");
  if (o["surgicalPatchUsesServerSideGuard"] !== true)
    reasons.push("surgical_patch_uses_server_side_guard_false");
  if (o["surgicalPatchDoesNotUseUiOnlyGuard"] !== true)
    reasons.push("surgical_patch_does_not_use_ui_only_guard_false");
  if (o["surgicalPatchDoesNotUseModelBasedGuardDecision"] !== true)
    reasons.push("surgical_patch_does_not_use_model_based_guard_decision_false");
  if (o["surgicalPatchUsesDeterministicLocalDecision"] !== true)
    reasons.push("surgical_patch_uses_deterministic_local_decision_false");
  if (o["surgicalPatchUsesNoExternalServiceDecision"] !== true)
    reasons.push("surgical_patch_uses_no_external_service_decision_false");
  if (o["surgicalPatchBlockedPathDoesNotCallRunSmartTalk"] !== true)
    reasons.push("surgical_patch_blocked_path_does_not_call_run_smart_talk_false");
  if (o["surgicalPatchAllowedPathPreservesExistingFlow"] !== true)
    reasons.push("surgical_patch_allowed_path_preserves_existing_flow_false");

  // Surgical patch detector flags (must all be true)
  if (o["surgicalPatchDetectorUsesMultiSignalScoring"] !== true)
    reasons.push("surgical_patch_detector_uses_multi_signal_scoring_false");
  if (o["surgicalPatchDetectorUsesLengthThresholds"] !== true)
    reasons.push("surgical_patch_detector_uses_length_thresholds_false");
  if (o["surgicalPatchDetectorUsesOfficialLetterMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_official_letter_markers_false");
  if (o["surgicalPatchDetectorUsesGermanAuthorityMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_german_authority_markers_false");
  if (o["surgicalPatchDetectorUsesInvoiceMahnungMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_invoice_mahnung_markers_false");
  if (o["surgicalPatchDetectorUsesBescheidWiderspruchMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_bescheid_widerspruch_markers_false");
  if (o["surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_deadline_legal_consequence_markers_false");
  if (o["surgicalPatchDetectorUsesPersonalDataMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_personal_data_markers_false");
  if (o["surgicalPatchDetectorUsesReferenceNumberMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_reference_number_markers_false");
  if (o["surgicalPatchDetectorUsesSalutationAndSignatureMarkers"] !== true)
    reasons.push("surgical_patch_detector_uses_salutation_and_signature_markers_false");
  if (o["surgicalPatchDetectorPassesQuestionLikeGeneralText"] !== true)
    reasons.push("surgical_patch_detector_passes_question_like_general_text_false");
  if (o["surgicalPatchDetectorBlocksHighRiskDocumentLikeText"] !== true)
    reasons.push("surgical_patch_detector_blocks_high_risk_document_like_text_false");
  if (o["surgicalPatchDetectorUsesConservativeHandling"] !== true)
    reasons.push("surgical_patch_detector_uses_conservative_handling_false");

  // Surgical patch blocked response flags (must all be true)
  if (o["surgicalPatchBlockedResponseStatusNonSuccess"] !== true)
    reasons.push("surgical_patch_blocked_response_status_non_success_false");
  if (o["surgicalPatchBlockedResponseOkFalse"] !== true)
    reasons.push("surgical_patch_blocked_response_ok_false_false");
  if (o["surgicalPatchBlockedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("surgical_patch_blocked_response_code_document_mode_required_false");
  if (o["surgicalPatchBlockedResponseShortUserSafeMessage"] !== true)
    reasons.push("surgical_patch_blocked_response_short_user_safe_message_false");
  if (o["surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime"] !== true)
    reasons.push("surgical_patch_blocked_response_points_to_paid_doc_mode_false");
  if (o["surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase"] !== true)
    reasons.push("surgical_patch_blocked_response_may_suggest_general_question_rephrase_false");
  if (o["surgicalPatchBlockedResponseNoInternalGovernance"] !== true)
    reasons.push("surgical_patch_blocked_response_no_internal_governance_false");
  if (o["surgicalPatchBlockedResponseNoTamperOrAuditInternals"] !== true)
    reasons.push("surgical_patch_blocked_response_no_tamper_or_audit_internals_false");
  if (o["surgicalPatchBlockedResponseNoRawDocumentEcho"] !== true)
    reasons.push("surgical_patch_blocked_response_no_raw_document_echo_false");
  if (o["surgicalPatchBlockedResponseNoTranslation"] !== true)
    reasons.push("surgical_patch_blocked_response_no_translation_false");
  if (o["surgicalPatchBlockedResponseNoSummary"] !== true)
    reasons.push("surgical_patch_blocked_response_no_summary_false");
  if (o["surgicalPatchBlockedResponseNoExplanation"] !== true)
    reasons.push("surgical_patch_blocked_response_no_explanation_false");
  if (o["surgicalPatchBlockedResponseNoLegalAdvice"] !== true)
    reasons.push("surgical_patch_blocked_response_no_legal_advice_false");
  if (o["surgicalPatchBlockedResponseNoExactDeadline"] !== true)
    reasons.push("surgical_patch_blocked_response_no_exact_deadline_false");
  if (o["surgicalPatchBlockedResponseNoLegalCertainty"] !== true)
    reasons.push("surgical_patch_blocked_response_no_legal_certainty_false");
  if (o["surgicalPatchBlockedResponseNoClaimAuthorization"] !== true)
    reasons.push("surgical_patch_blocked_response_no_claim_authorization_false");

  // TD containment 8.5N
  if (o["td001DocumentBypassGuardSurgicallyPatched"] !== true)
    reasons.push("td001_surgically_patched_false");
  if (o["td001DocumentBypassGuardStillRequiresPostPatchAudit"] !== true)
    reasons.push("td001_still_requires_post_patch_audit_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_in_result_false");
  if (o["td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign"] !== true)
    reasons.push("td003_still_requires_future_authorized_runtime_design_in_result_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_in_result_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_in_result_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_in_result_false");

  // 8.5N audit confirms no prohibited side effects (must all be true)
  if (o["textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard"] !== true)
    reasons.push("sp_confirms_no_openai_call_in_guard_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard"] !== true)
    reasons.push("sp_confirms_no_fetch_call_in_guard_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard"] !== true)
    reasons.push("sp_confirms_no_process_env_read_in_guard_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard"] !== true)
    reasons.push("sp_confirms_no_sdk_usage_in_guard_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun"] !== true)
    reasons.push("sp_confirms_no_8x3ac_rerun_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation"] !== true)
    reasons.push("sp_confirms_no_photo_route_mutation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement"] !== true)
    reasons.push("sp_confirms_no_public_runtime_enablement_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoUiMutation"] !== true)
    reasons.push("sp_confirms_no_ui_mutation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation"] !== true)
    reasons.push("sp_confirms_no_supabase_mutation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoStorageMutation"] !== true)
    reasons.push("sp_confirms_no_storage_mutation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite"] !== true)
    reasons.push("sp_confirms_no_database_write_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoAuditPersistence"] !== true)
    reasons.push("sp_confirms_no_audit_persistence_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("sp_confirms_no_payment_runtime_call_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("sp_confirms_no_ocr_runtime_call_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("sp_confirms_no_photo_input_processing_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing"] !== true)
    reasons.push("sp_confirms_no_file_input_processing_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime"] !== true)
    reasons.push("sp_confirms_no_document_parsing_runtime_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("sp_confirms_no_raw_document_storage_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage"] !== true)
    reasons.push("sp_confirms_no_model_output_storage_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath"] !== true)
    reasons.push("sp_confirms_no_prompt_storage_on_blocked_path_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation"] !== true)
    reasons.push("sp_confirms_no_user_visible_document_explanation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis"] !== true)
    reasons.push("sp_confirms_no_customer_facing_document_analysis_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("sp_confirms_no_evidence_evaluation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization"] !== true)
    reasons.push("sp_confirms_no_claim_authorization_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("sp_confirms_no_deadline_calculation_false");
  if (o["textBypassGuardSurgicalPatchConfirmsNoLegalCertainty"] !== true)
    reasons.push("sp_confirms_no_legal_certainty_false");

  // Forward readiness
  if (o["readyFor8x5OPostPatchContainmentAudit"] !== true)
    reasons.push("ready_for_8x5o_post_patch_containment_audit_false");
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

// ── Canonical 8.5N input ──────────────────────────────────────────────────────

function buildCanonical8x5NInput(): ControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchInput {
  const planResult = runControlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContract();
  return {
    // 8.5M prerequisite gates
    prereqCheckId: planResult.checkId,
    prereqAllPassed: planResult.allPassed,
    controlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContractAccepted:
      planResult.controlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContractAccepted,
    textDocumentBypassGuardRoutePatchExecutionContractOnly:
      planResult.textDocumentBypassGuardRoutePatchExecutionContractOnly,
    textDocumentBypassGuardRoutePatchExecutionContractDefined:
      planResult.textDocumentBypassGuardRoutePatchExecutionContractDefined,
    textDocumentBypassGuardRuntimeStillNotImplemented:
      planResult.textDocumentBypassGuardRuntimeStillNotImplemented,
    textDocumentBypassGuardRoutePatchStillNotPerformed:
      planResult.textDocumentBypassGuardRoutePatchStillNotPerformed,
    textDocumentBypassGuardRoutePatchExecutionContractAllowsNextSurgicalPatch:
      planResult.textDocumentBypassGuardRoutePatchExecutionContractAllowsNextSurgicalPatch,
    textDocumentBypassGuardRoutePatchExecutionContractDoesNotPerformPatch:
      planResult.textDocumentBypassGuardRoutePatchExecutionContractDoesNotPerformPatch,

    // Execution contract target flags
    executionContractTargetsSmartTalkRouteOnly:
      planResult.executionContractTargetsSmartTalkRouteOnly,
    executionContractForbidsPhotoRouteModification:
      planResult.executionContractForbidsPhotoRouteModification,
    executionContractRequiresPhotoOcrQuarantinePreserved:
      planResult.executionContractRequiresPhotoOcrQuarantinePreserved,
    executionContractRequiresMinimalSurgicalRoutePatch:
      planResult.executionContractRequiresMinimalSurgicalRoutePatch,
    executionContractForbidsBroadRouteRefactor:
      planResult.executionContractForbidsBroadRouteRefactor,
    executionContractForbidsUiChanges: planResult.executionContractForbidsUiChanges,
    executionContractForbidsEnvChanges: planResult.executionContractForbidsEnvChanges,
    executionContractForbidsMigrationChanges:
      planResult.executionContractForbidsMigrationChanges,
    executionContractForbidsPaymentChanges:
      planResult.executionContractForbidsPaymentChanges,
    executionContractForbidsStorageChanges:
      planResult.executionContractForbidsStorageChanges,
    executionContractForbidsSupabaseChanges:
      planResult.executionContractForbidsSupabaseChanges,
    executionContractForbidsDatabaseWrites:
      planResult.executionContractForbidsDatabaseWrites,

    // Execution contract insertion flags
    executionContractRequiresPostJsonParseInsertion:
      planResult.executionContractRequiresPostJsonParseInsertion,
    executionContractRequiresPreRunSmartTalkInsertion:
      planResult.executionContractRequiresPreRunSmartTalkInsertion,
    executionContractRequiresPrePromptBuildInsertion:
      planResult.executionContractRequiresPrePromptBuildInsertion,
    executionContractRequiresPreModelCallInsertion:
      planResult.executionContractRequiresPreModelCallInsertion,
    executionContractRequiresPreFullDocumentAnalysisInsertion:
      planResult.executionContractRequiresPreFullDocumentAnalysisInsertion,
    executionContractRequiresServerSideGuard:
      planResult.executionContractRequiresServerSideGuard,
    executionContractForbidsUiOnlyGuard: planResult.executionContractForbidsUiOnlyGuard,
    executionContractForbidsModelBasedGuardDecision:
      planResult.executionContractForbidsModelBasedGuardDecision,
    executionContractRequiresDeterministicLocalDecision:
      planResult.executionContractRequiresDeterministicLocalDecision,
    executionContractRequiresNoExternalServiceDecision:
      planResult.executionContractRequiresNoExternalServiceDecision,
    executionContractRequiresBlockedPathNoRunSmartTalk:
      planResult.executionContractRequiresBlockedPathNoRunSmartTalk,
    executionContractRequiresAllowedPathExistingFlowPreserved:
      planResult.executionContractRequiresAllowedPathExistingFlowPreserved,

    // Execution contract detector flags
    executionContractDetectorUsesMultiSignalScoring:
      planResult.executionContractDetectorUsesMultiSignalScoring,
    executionContractDetectorUsesLengthThresholds:
      planResult.executionContractDetectorUsesLengthThresholds,
    executionContractDetectorUsesOfficialLetterMarkers:
      planResult.executionContractDetectorUsesOfficialLetterMarkers,
    executionContractDetectorUsesGermanAuthorityMarkers:
      planResult.executionContractDetectorUsesGermanAuthorityMarkers,
    executionContractDetectorUsesInvoiceMahnungMarkers:
      planResult.executionContractDetectorUsesInvoiceMahnungMarkers,
    executionContractDetectorUsesBescheidWiderspruchMarkers:
      planResult.executionContractDetectorUsesBescheidWiderspruchMarkers,
    executionContractDetectorUsesDeadlineLegalConsequenceMarkers:
      planResult.executionContractDetectorUsesDeadlineLegalConsequenceMarkers,
    executionContractDetectorUsesPersonalDataMarkers:
      planResult.executionContractDetectorUsesPersonalDataMarkers,
    executionContractDetectorUsesReferenceNumberMarkers:
      planResult.executionContractDetectorUsesReferenceNumberMarkers,
    executionContractDetectorUsesSalutationAndSignatureMarkers:
      planResult.executionContractDetectorUsesSalutationAndSignatureMarkers,
    executionContractDetectorPassesQuestionLikeGeneralText:
      planResult.executionContractDetectorPassesQuestionLikeGeneralText,
    executionContractDetectorBlocksHighRiskDocumentLikeText:
      planResult.executionContractDetectorBlocksHighRiskDocumentLikeText,
    executionContractDetectorUsesConservativeHandling:
      planResult.executionContractDetectorUsesConservativeHandling,

    // Execution contract blocked response flags
    executionContractBlockedResponseStatusNonSuccess:
      planResult.executionContractBlockedResponseStatusNonSuccess,
    executionContractBlockedResponseOkFalse:
      planResult.executionContractBlockedResponseOkFalse,
    executionContractBlockedResponseCodeDocumentModeRequired:
      planResult.executionContractBlockedResponseCodeDocumentModeRequired,
    executionContractBlockedResponseShortUserSafeMessage:
      planResult.executionContractBlockedResponseShortUserSafeMessage,
    executionContractBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime:
      planResult.executionContractBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime,
    executionContractBlockedResponseMaySuggestGeneralQuestionRephrase:
      planResult.executionContractBlockedResponseMaySuggestGeneralQuestionRephrase,
    executionContractBlockedResponseNoInternalGovernance:
      planResult.executionContractBlockedResponseNoInternalGovernance,
    executionContractBlockedResponseNoTamperOrAuditInternals:
      planResult.executionContractBlockedResponseNoTamperOrAuditInternals,
    executionContractBlockedResponseNoRawDocumentEcho:
      planResult.executionContractBlockedResponseNoRawDocumentEcho,
    executionContractBlockedResponseNoTranslation:
      planResult.executionContractBlockedResponseNoTranslation,
    executionContractBlockedResponseNoSummary:
      planResult.executionContractBlockedResponseNoSummary,
    executionContractBlockedResponseNoExplanation:
      planResult.executionContractBlockedResponseNoExplanation,
    executionContractBlockedResponseNoLegalAdvice:
      planResult.executionContractBlockedResponseNoLegalAdvice,
    executionContractBlockedResponseNoExactDeadline:
      planResult.executionContractBlockedResponseNoExactDeadline,
    executionContractBlockedResponseNoLegalCertainty:
      planResult.executionContractBlockedResponseNoLegalCertainty,
    executionContractBlockedResponseNoClaimAuthorization:
      planResult.executionContractBlockedResponseNoClaimAuthorization,

    // Execution contract boundary flags
    executionContractDoesNotActivatePaidDocumentMode:
      planResult.executionContractDoesNotActivatePaidDocumentMode,
    executionContractDoesNotImplementPiiRedaction:
      planResult.executionContractDoesNotImplementPiiRedaction,
    executionContractDoesNotWireEvidenceGates:
      planResult.executionContractDoesNotWireEvidenceGates,
    executionContractDoesNotAuthorizeDocumentRuntime:
      planResult.executionContractDoesNotAuthorizeDocumentRuntime,
    executionContractDoesNotAuthorizePublicRuntime:
      planResult.executionContractDoesNotAuthorizePublicRuntime,
    executionContractDoesNotAuthorizePersistence:
      planResult.executionContractDoesNotAuthorizePersistence,
    executionContractDoesNotAuthorizeUserVisibleDocumentExplanation:
      planResult.executionContractDoesNotAuthorizeUserVisibleDocumentExplanation,
    executionContractDoesNotAuthorizeDeadlineCalculation:
      planResult.executionContractDoesNotAuthorizeDeadlineCalculation,

    // Authorization grants (all false)
    runtimeAuthorizationGranted: planResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: planResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: planResult.productionAuthorizationGranted,
    finalAuthorizationGranted: planResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: planResult.goLiveAuthorizationGranted,

    // TD and containment flags
    td001DocumentBypassGuardRoutePatchExecutionContracted:
      planResult.td001DocumentBypassGuardRoutePatchExecutionContracted,
    td001DocumentBypassGuardStillRequiresActualRoutePatch:
      planResult.td001DocumentBypassGuardStillRequiresActualRoutePatch,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      planResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      planResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td004PreModelPiiRedactionMissing: planResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      planResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      planResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      planResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      planResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe:
      planResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen:
      planResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: planResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: planResult.tmpFilesPresentInWorkingTree,

    // Prereq actual performed flags (all false from 8.5M)
    prereqActualLiveRouteMutationPerformed: planResult.actualLiveRouteMutationPerformed,
    prereqActualDocumentBypassGuardImplemented: planResult.actualDocumentBypassGuardImplemented,
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
    actualEvidenceEvaluationPerformed: planResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: planResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: planResult.actualDeadlineCalculationPerformed,
    actualPhotoRouteQuarantinePerformed: planResult.actualPhotoRouteQuarantinePerformed,
    actualPaidDocumentModeImplemented: planResult.actualPaidDocumentModeImplemented,
    actualPiiRedactionImplemented: planResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed:
      planResult.actualEvidenceGateRuntimeWiringPerformed,

    // 8.5M execution contract confirms
    textBypassGuardRoutePatchExecutionContractConfirmsNoOpenAiCall:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoOpenAiCall,
    textBypassGuardRoutePatchExecutionContractConfirmsNoFetchCall:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoFetchCall,
    textBypassGuardRoutePatchExecutionContractConfirmsNoProcessEnvRead:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoProcessEnvRead,
    textBypassGuardRoutePatchExecutionContractConfirmsNoSdkUsage:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoSdkUsage,
    textBypassGuardRoutePatchExecutionContractConfirmsNo8x3AcRerun:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNo8x3AcRerun,
    textBypassGuardRoutePatchExecutionContractConfirmsNoSmartTalkRuntimeCall:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoSmartTalkRuntimeCall,
    textBypassGuardRoutePatchExecutionContractConfirmsNoRouteImport:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoRouteImport,
    textBypassGuardRoutePatchExecutionContractConfirmsNoRouteMutation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoRouteMutation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoPublicRouteMutation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoPublicRouteMutation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoUiMutation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoUiMutation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoSupabaseMutation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoSupabaseMutation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoStorageMutation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoStorageMutation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoDatabaseWrite:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoDatabaseWrite,
    textBypassGuardRoutePatchExecutionContractConfirmsNoAuditPersistence:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoAuditPersistence,
    textBypassGuardRoutePatchExecutionContractConfirmsNoPaymentRuntimeCall:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoPaymentRuntimeCall,
    textBypassGuardRoutePatchExecutionContractConfirmsNoOcrRuntimeCall:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoOcrRuntimeCall,
    textBypassGuardRoutePatchExecutionContractConfirmsNoPhotoInputProcessing:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoPhotoInputProcessing,
    textBypassGuardRoutePatchExecutionContractConfirmsNoFileInputProcessing:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoFileInputProcessing,
    textBypassGuardRoutePatchExecutionContractConfirmsNoDocumentParsingRuntime:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoDocumentParsingRuntime,
    textBypassGuardRoutePatchExecutionContractConfirmsNoRawDocumentStorage:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoRawDocumentStorage,
    textBypassGuardRoutePatchExecutionContractConfirmsNoModelOutputStorage:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoModelOutputStorage,
    textBypassGuardRoutePatchExecutionContractConfirmsNoPromptStorage:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoPromptStorage,
    textBypassGuardRoutePatchExecutionContractConfirmsNoUserVisibleDocumentExplanation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoUserVisibleDocumentExplanation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoCustomerFacingDocumentAnalysis:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoCustomerFacingDocumentAnalysis,
    textBypassGuardRoutePatchExecutionContractConfirmsNoEvidenceEvaluation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoEvidenceEvaluation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoClaimAuthorization:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoClaimAuthorization,
    textBypassGuardRoutePatchExecutionContractConfirmsNoDeadlineCalculation:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoDeadlineCalculation,
    textBypassGuardRoutePatchExecutionContractConfirmsNoLegalCertainty:
      planResult.textBypassGuardRoutePatchExecutionContractConfirmsNoLegalCertainty,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: planResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: planResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: planResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: planResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: planResult.paymentPipelineActuallyExecuted,
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
    userVisibleLegalDeadlineOutputAuthorizedNow:
      planResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: planResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: planResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: planResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: planResult.productionRuntimeAuthorizedNow,

    // Legal safety flags
    exactDeadlineCalculationAuthorized: planResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: planResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: planResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: planResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: planResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: planResult.deliveryDateRequiredForExactDeadline,

    // 8.5M forward readiness
    readyFor8x5NTextDocumentBypassGuardSurgicalRoutePatch:
      planResult.readyFor8x5NTextDocumentBypassGuardSurgicalRoutePatch,

    // 8.5N surgical patch assertions
    textDocumentBypassGuardSurgicalRoutePatchPerformed: true,
    textDocumentBypassGuardSurgicalRoutePatchOnly: true,
    textDocumentBypassGuardRoutePatchWasMinimal: true,
    textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: true,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: true,
    textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: true,
    textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: true,

    // 8.5N actual performed flags (two true)
    actualLiveRouteMutationPerformed: true,
    actualDocumentBypassGuardImplemented: true,

    // Surgical patch target flags
    surgicalPatchModifiedSmartTalkRoute: true,
    surgicalPatchDidNotModifyPhotoRoute: true,
    surgicalPatchPreservedPhotoOcrQuarantine: true,
    surgicalPatchDidNotModifyUi: true,
    surgicalPatchDidNotModifyEnv: true,
    surgicalPatchDidNotModifyMigrations: true,
    surgicalPatchDidNotModifyPayment: true,
    surgicalPatchDidNotModifyStorage: true,
    surgicalPatchDidNotModifySupabase: true,
    surgicalPatchDidNotModifyDatabase: true,
    surgicalPatchDidNotAddDependency: true,
    surgicalPatchDidNotRefactorRouteBroadly: true,

    // Surgical patch insertion flags
    surgicalPatchInsertedAfterJsonParse: true,
    surgicalPatchInsertedBeforeRunSmartTalk: true,
    surgicalPatchInsertedBeforePromptBuild: true,
    surgicalPatchInsertedBeforeModelCall: true,
    surgicalPatchInsertedBeforeFullDocumentAnalysis: true,
    surgicalPatchUsesServerSideGuard: true,
    surgicalPatchDoesNotUseUiOnlyGuard: true,
    surgicalPatchDoesNotUseModelBasedGuardDecision: true,
    surgicalPatchUsesDeterministicLocalDecision: true,
    surgicalPatchUsesNoExternalServiceDecision: true,
    surgicalPatchBlockedPathDoesNotCallRunSmartTalk: true,
    surgicalPatchAllowedPathPreservesExistingFlow: true,

    // Surgical patch detector flags
    surgicalPatchDetectorUsesMultiSignalScoring: true,
    surgicalPatchDetectorUsesLengthThresholds: true,
    surgicalPatchDetectorUsesOfficialLetterMarkers: true,
    surgicalPatchDetectorUsesGermanAuthorityMarkers: true,
    surgicalPatchDetectorUsesInvoiceMahnungMarkers: true,
    surgicalPatchDetectorUsesBescheidWiderspruchMarkers: true,
    surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers: true,
    surgicalPatchDetectorUsesPersonalDataMarkers: true,
    surgicalPatchDetectorUsesReferenceNumberMarkers: true,
    surgicalPatchDetectorUsesSalutationAndSignatureMarkers: true,
    surgicalPatchDetectorPassesQuestionLikeGeneralText: true,
    surgicalPatchDetectorBlocksHighRiskDocumentLikeText: true,
    surgicalPatchDetectorUsesConservativeHandling: true,

    // Surgical patch blocked response flags
    surgicalPatchBlockedResponseStatusNonSuccess: true,
    surgicalPatchBlockedResponseOkFalse: true,
    surgicalPatchBlockedResponseCodeDocumentModeRequired: true,
    surgicalPatchBlockedResponseShortUserSafeMessage: true,
    surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true,
    surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase: true,
    surgicalPatchBlockedResponseNoInternalGovernance: true,
    surgicalPatchBlockedResponseNoTamperOrAuditInternals: true,
    surgicalPatchBlockedResponseNoRawDocumentEcho: true,
    surgicalPatchBlockedResponseNoTranslation: true,
    surgicalPatchBlockedResponseNoSummary: true,
    surgicalPatchBlockedResponseNoExplanation: true,
    surgicalPatchBlockedResponseNoLegalAdvice: true,
    surgicalPatchBlockedResponseNoExactDeadline: true,
    surgicalPatchBlockedResponseNoLegalCertainty: true,
    surgicalPatchBlockedResponseNoClaimAuthorization: true,

    // TD containment 8.5N update
    td001DocumentBypassGuardSurgicallyPatched: true,
    td001DocumentBypassGuardStillRequiresPostPatchAudit: true,

    // 8.5N audit confirms no prohibited side effects
    textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun: true,
    textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement: true,
    textBypassGuardSurgicalPatchConfirmsNoUiMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoStorageMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite: true,
    textBypassGuardSurgicalPatchConfirmsNoAuditPersistence: true,
    textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall: true,
    textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing: true,
    textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing: true,
    textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage: true,
    textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage: true,
    textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath: true,
    textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation: true,
    textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization: true,
    textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation: true,
    textBypassGuardSurgicalPatchConfirmsNoLegalCertainty: true,

    // Forward readiness
    readyFor8x5OPostPatchContainmentAudit: true,
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
  const base = buildCanonical8x5NInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validateSurgicalRoutePatchInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5M prereq gate tampers
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5L" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("execution_contract_not_accepted",
    { controlledRealDocumentTextDocumentBypassGuardRoutePatchExecutionContractAccepted: false });
  expect_rejected("execution_contract_only_false",
    { textDocumentBypassGuardRoutePatchExecutionContractOnly: false });
  expect_rejected("execution_contract_defined_false",
    { textDocumentBypassGuardRoutePatchExecutionContractDefined: false });
  expect_rejected("runtime_still_not_implemented_false",
    { textDocumentBypassGuardRuntimeStillNotImplemented: false });
  expect_rejected("route_patch_still_not_performed_false",
    { textDocumentBypassGuardRoutePatchStillNotPerformed: false });
  expect_rejected("execution_contract_allows_next_surgical_patch_false",
    { textDocumentBypassGuardRoutePatchExecutionContractAllowsNextSurgicalPatch: false });
  expect_rejected("execution_contract_does_not_perform_patch_false",
    { textDocumentBypassGuardRoutePatchExecutionContractDoesNotPerformPatch: false });

  // Execution contract target flags
  expect_rejected("ec_targets_smart_talk_route_only_false",
    { executionContractTargetsSmartTalkRouteOnly: false });
  expect_rejected("ec_forbids_photo_route_modification_false",
    { executionContractForbidsPhotoRouteModification: false });
  expect_rejected("ec_requires_photo_ocr_quarantine_preserved_false",
    { executionContractRequiresPhotoOcrQuarantinePreserved: false });
  expect_rejected("ec_requires_minimal_surgical_route_patch_false",
    { executionContractRequiresMinimalSurgicalRoutePatch: false });
  expect_rejected("ec_forbids_broad_route_refactor_false",
    { executionContractForbidsBroadRouteRefactor: false });
  expect_rejected("ec_forbids_ui_changes_false",
    { executionContractForbidsUiChanges: false });
  expect_rejected("ec_forbids_env_changes_false",
    { executionContractForbidsEnvChanges: false });
  expect_rejected("ec_forbids_migration_changes_false",
    { executionContractForbidsMigrationChanges: false });
  expect_rejected("ec_forbids_payment_changes_false",
    { executionContractForbidsPaymentChanges: false });
  expect_rejected("ec_forbids_storage_changes_false",
    { executionContractForbidsStorageChanges: false });
  expect_rejected("ec_forbids_supabase_changes_false",
    { executionContractForbidsSupabaseChanges: false });
  expect_rejected("ec_forbids_database_writes_false",
    { executionContractForbidsDatabaseWrites: false });

  // Execution contract insertion flags
  expect_rejected("ec_requires_post_json_parse_insertion_false",
    { executionContractRequiresPostJsonParseInsertion: false });
  expect_rejected("ec_requires_pre_run_smart_talk_insertion_false",
    { executionContractRequiresPreRunSmartTalkInsertion: false });
  expect_rejected("ec_requires_pre_prompt_build_insertion_false",
    { executionContractRequiresPrePromptBuildInsertion: false });
  expect_rejected("ec_requires_pre_model_call_insertion_false",
    { executionContractRequiresPreModelCallInsertion: false });
  expect_rejected("ec_requires_pre_full_document_analysis_insertion_false",
    { executionContractRequiresPreFullDocumentAnalysisInsertion: false });
  expect_rejected("ec_requires_server_side_guard_false",
    { executionContractRequiresServerSideGuard: false });
  expect_rejected("ec_forbids_ui_only_guard_false",
    { executionContractForbidsUiOnlyGuard: false });
  expect_rejected("ec_forbids_model_based_guard_decision_false",
    { executionContractForbidsModelBasedGuardDecision: false });
  expect_rejected("ec_requires_deterministic_local_decision_false",
    { executionContractRequiresDeterministicLocalDecision: false });
  expect_rejected("ec_requires_no_external_service_decision_false",
    { executionContractRequiresNoExternalServiceDecision: false });
  expect_rejected("ec_requires_blocked_path_no_run_smart_talk_false",
    { executionContractRequiresBlockedPathNoRunSmartTalk: false });
  expect_rejected("ec_requires_allowed_path_existing_flow_preserved_false",
    { executionContractRequiresAllowedPathExistingFlowPreserved: false });

  // Execution contract detector flags
  expect_rejected("ec_detector_uses_multi_signal_scoring_false",
    { executionContractDetectorUsesMultiSignalScoring: false });
  expect_rejected("ec_detector_uses_length_thresholds_false",
    { executionContractDetectorUsesLengthThresholds: false });
  expect_rejected("ec_detector_uses_official_letter_markers_false",
    { executionContractDetectorUsesOfficialLetterMarkers: false });
  expect_rejected("ec_detector_uses_german_authority_markers_false",
    { executionContractDetectorUsesGermanAuthorityMarkers: false });
  expect_rejected("ec_detector_uses_invoice_mahnung_markers_false",
    { executionContractDetectorUsesInvoiceMahnungMarkers: false });
  expect_rejected("ec_detector_uses_bescheid_widerspruch_markers_false",
    { executionContractDetectorUsesBescheidWiderspruchMarkers: false });
  expect_rejected("ec_detector_uses_deadline_legal_consequence_markers_false",
    { executionContractDetectorUsesDeadlineLegalConsequenceMarkers: false });
  expect_rejected("ec_detector_uses_personal_data_markers_false",
    { executionContractDetectorUsesPersonalDataMarkers: false });
  expect_rejected("ec_detector_uses_reference_number_markers_false",
    { executionContractDetectorUsesReferenceNumberMarkers: false });
  expect_rejected("ec_detector_uses_salutation_and_signature_markers_false",
    { executionContractDetectorUsesSalutationAndSignatureMarkers: false });
  expect_rejected("ec_detector_passes_question_like_general_text_false",
    { executionContractDetectorPassesQuestionLikeGeneralText: false });
  expect_rejected("ec_detector_blocks_high_risk_document_like_text_false",
    { executionContractDetectorBlocksHighRiskDocumentLikeText: false });
  expect_rejected("ec_detector_uses_conservative_handling_false",
    { executionContractDetectorUsesConservativeHandling: false });

  // Execution contract blocked response flags
  expect_rejected("ec_blocked_response_status_non_success_false",
    { executionContractBlockedResponseStatusNonSuccess: false });
  expect_rejected("ec_blocked_response_ok_false_false",
    { executionContractBlockedResponseOkFalse: false });
  expect_rejected("ec_blocked_response_code_document_mode_required_false",
    { executionContractBlockedResponseCodeDocumentModeRequired: false });
  expect_rejected("ec_blocked_response_short_user_safe_message_false",
    { executionContractBlockedResponseShortUserSafeMessage: false });
  expect_rejected("ec_blocked_response_points_to_paid_doc_mode_false",
    { executionContractBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: false });
  expect_rejected("ec_blocked_response_may_suggest_general_question_rephrase_false",
    { executionContractBlockedResponseMaySuggestGeneralQuestionRephrase: false });
  expect_rejected("ec_blocked_response_no_internal_governance_false",
    { executionContractBlockedResponseNoInternalGovernance: false });
  expect_rejected("ec_blocked_response_no_tamper_or_audit_internals_false",
    { executionContractBlockedResponseNoTamperOrAuditInternals: false });
  expect_rejected("ec_blocked_response_no_raw_document_echo_false",
    { executionContractBlockedResponseNoRawDocumentEcho: false });
  expect_rejected("ec_blocked_response_no_translation_false",
    { executionContractBlockedResponseNoTranslation: false });
  expect_rejected("ec_blocked_response_no_summary_false",
    { executionContractBlockedResponseNoSummary: false });
  expect_rejected("ec_blocked_response_no_explanation_false",
    { executionContractBlockedResponseNoExplanation: false });
  expect_rejected("ec_blocked_response_no_legal_advice_false",
    { executionContractBlockedResponseNoLegalAdvice: false });
  expect_rejected("ec_blocked_response_no_exact_deadline_false",
    { executionContractBlockedResponseNoExactDeadline: false });
  expect_rejected("ec_blocked_response_no_legal_certainty_false",
    { executionContractBlockedResponseNoLegalCertainty: false });
  expect_rejected("ec_blocked_response_no_claim_authorization_false",
    { executionContractBlockedResponseNoClaimAuthorization: false });

  // Execution contract boundary flags
  expect_rejected("ec_does_not_activate_paid_document_mode_false",
    { executionContractDoesNotActivatePaidDocumentMode: false });
  expect_rejected("ec_does_not_implement_pii_redaction_false",
    { executionContractDoesNotImplementPiiRedaction: false });
  expect_rejected("ec_does_not_wire_evidence_gates_false",
    { executionContractDoesNotWireEvidenceGates: false });
  expect_rejected("ec_does_not_authorize_document_runtime_false",
    { executionContractDoesNotAuthorizeDocumentRuntime: false });
  expect_rejected("ec_does_not_authorize_public_runtime_false",
    { executionContractDoesNotAuthorizePublicRuntime: false });
  expect_rejected("ec_does_not_authorize_persistence_false",
    { executionContractDoesNotAuthorizePersistence: false });
  expect_rejected("ec_does_not_authorize_user_visible_document_explanation_false",
    { executionContractDoesNotAuthorizeUserVisibleDocumentExplanation: false });
  expect_rejected("ec_does_not_authorize_deadline_calculation_false",
    { executionContractDoesNotAuthorizeDeadlineCalculation: false });

  // Authorization grants tampers
  expect_rejected("runtime_authorization_granted_true",
    { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true",
    { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true",
    { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true",
    { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true",
    { goLiveAuthorizationGranted: true });

  // TD flags
  expect_rejected("td001_execution_contracted_false",
    { td001DocumentBypassGuardRoutePatchExecutionContracted: false });
  expect_rejected("td001_still_requires_actual_route_patch_false",
    { td001DocumentBypassGuardStillRequiresActualRoutePatch: false });
  expect_rejected("td003_photo_ocr_route_contained_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td004_pre_model_pii_redaction_missing_false",
    { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td005_paid_document_mode_not_server_side_enforced_false",
    { td005PaidDocumentModeNotServerSideEnforced: false });
  expect_rejected("td002_evidence_gates_not_wired_false",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });
  expect_rejected("td009_tmp_debug_runner_debt_closed_false",
    { td009TmpDebugRunnerDebtClosed: false });
  expect_rejected("tmp_files_present_in_working_tree_true",
    { tmpFilesPresentInWorkingTree: true });

  // Prereq actual performed flags
  expect_rejected("prereq_actual_live_route_mutation_performed_true",
    { prereqActualLiveRouteMutationPerformed: true });
  expect_rejected("prereq_actual_document_bypass_guard_implemented_true",
    { prereqActualDocumentBypassGuardImplemented: true });
  expect_rejected("actual_real_document_input_performed_true",
    { actualRealDocumentInputPerformed: true });
  expect_rejected("actual_real_document_processing_performed_true",
    { actualRealDocumentProcessingPerformed: true });
  expect_rejected("actual_ocr_performed_true",
    { actualOcrPerformed: true });
  expect_rejected("actual_photo_input_processed_true",
    { actualPhotoInputProcessed: true });
  expect_rejected("actual_file_input_processed_true",
    { actualFileInputProcessed: true });
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
  expect_rejected("actual_pii_redaction_implemented_true",
    { actualPiiRedactionImplemented: true });
  expect_rejected("actual_evidence_gate_runtime_wiring_performed_true",
    { actualEvidenceGateRuntimeWiringPerformed: true });

  // EC confirms tampers (sample — one per confirm group)
  expect_rejected("ec_confirms_no_openai_call_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoOpenAiCall: false });
  expect_rejected("ec_confirms_no_fetch_call_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoFetchCall: false });
  expect_rejected("ec_confirms_no_process_env_read_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoProcessEnvRead: false });
  expect_rejected("ec_confirms_no_sdk_usage_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoSdkUsage: false });
  expect_rejected("ec_confirms_no_8x3ac_rerun_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNo8x3AcRerun: false });
  expect_rejected("ec_confirms_no_smart_talk_runtime_call_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoSmartTalkRuntimeCall: false });
  expect_rejected("ec_confirms_no_route_import_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoRouteImport: false });
  expect_rejected("ec_confirms_no_route_mutation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoRouteMutation: false });
  expect_rejected("ec_confirms_no_public_route_mutation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoPublicRouteMutation: false });
  expect_rejected("ec_confirms_no_ui_mutation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoUiMutation: false });
  expect_rejected("ec_confirms_no_supabase_mutation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoSupabaseMutation: false });
  expect_rejected("ec_confirms_no_storage_mutation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoStorageMutation: false });
  expect_rejected("ec_confirms_no_database_write_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoDatabaseWrite: false });
  expect_rejected("ec_confirms_no_audit_persistence_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoAuditPersistence: false });
  expect_rejected("ec_confirms_no_payment_runtime_call_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("ec_confirms_no_ocr_runtime_call_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoOcrRuntimeCall: false });
  expect_rejected("ec_confirms_no_photo_input_processing_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoPhotoInputProcessing: false });
  expect_rejected("ec_confirms_no_file_input_processing_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoFileInputProcessing: false });
  expect_rejected("ec_confirms_no_document_parsing_runtime_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoDocumentParsingRuntime: false });
  expect_rejected("ec_confirms_no_raw_document_storage_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoRawDocumentStorage: false });
  expect_rejected("ec_confirms_no_model_output_storage_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoModelOutputStorage: false });
  expect_rejected("ec_confirms_no_prompt_storage_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoPromptStorage: false });
  expect_rejected("ec_confirms_no_user_visible_document_explanation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("ec_confirms_no_customer_facing_document_analysis_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoCustomerFacingDocumentAnalysis: false });
  expect_rejected("ec_confirms_no_evidence_evaluation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoEvidenceEvaluation: false });
  expect_rejected("ec_confirms_no_claim_authorization_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoClaimAuthorization: false });
  expect_rejected("ec_confirms_no_deadline_calculation_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoDeadlineCalculation: false });
  expect_rejected("ec_confirms_no_legal_certainty_false",
    { textBypassGuardRoutePatchExecutionContractConfirmsNoLegalCertainty: false });

  // Pipeline executed flags
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true",
    { runtimePipelineActuallyExecuted: true });
  expect_rejected("document_pipeline_actually_executed_true",
    { documentPipelineActuallyExecuted: true });
  expect_rejected("ocr_pipeline_actually_executed_true",
    { ocrPipelineActuallyExecuted: true });
  expect_rejected("payment_pipeline_actually_executed_true",
    { paymentPipelineActuallyExecuted: true });
  expect_rejected("user_visible_pipeline_actually_executed_true",
    { userVisiblePipelineActuallyExecuted: true });

  // Runtime authorization flags
  expect_rejected("real_document_input_authorized_now_true",
    { realDocumentInputAuthorizedNow: true });
  expect_rejected("real_document_processing_authorized_now_true",
    { realDocumentProcessingAuthorizedNow: true });
  expect_rejected("real_user_document_upload_authorized_now_true",
    { realUserDocumentUploadAuthorizedNow: true });
  expect_rejected("ocr_runtime_authorized_now_true",
    { ocrRuntimeAuthorizedNow: true });
  expect_rejected("photo_input_authorized_now_true",
    { photoInputAuthorizedNow: true });
  expect_rejected("file_input_authorized_now_true",
    { fileInputAuthorizedNow: true });
  expect_rejected("document_storage_authorized_now_true",
    { documentStorageAuthorizedNow: true });
  expect_rejected("persistence_authorized_now_true",
    { persistenceAuthorizedNow: true });
  expect_rejected("public_runtime_authorized_now_true",
    { publicRuntimeAuthorizedNow: true });
  expect_rejected("user_visible_legal_deadline_output_authorized_now_true",
    { userVisibleLegalDeadlineOutputAuthorizedNow: true });
  expect_rejected("live_llm_runtime_authorized_now_true",
    { liveLLMRuntimeAuthorizedNow: true });
  expect_rejected("connected_ai_runtime_authorized_now_true",
    { connectedAiRuntimeAuthorizedNow: true });
  expect_rejected("pilot_runtime_authorized_now_true",
    { pilotRuntimeAuthorizedNow: true });
  expect_rejected("production_runtime_authorized_now_true",
    { productionRuntimeAuthorizedNow: true });

  // Legal safety flags
  expect_rejected("exact_deadline_calculation_authorized_true",
    { exactDeadlineCalculationAuthorized: true });
  expect_rejected("delivery_date_invention_authorized_true",
    { deliveryDateInventionAuthorized: true });
  expect_rejected("final_date_invention_authorized_true",
    { finalDateInventionAuthorized: true });
  expect_rejected("legal_certainty_authorized_true",
    { legalCertaintyAuthorized: true });
  expect_rejected("coercive_legal_instruction_authorized_true",
    { coerciveLegalInstructionAuthorized: true });
  expect_rejected("delivery_date_required_for_exact_deadline_false",
    { deliveryDateRequiredForExactDeadline: false });

  // 8.5M forward readiness
  expect_rejected("ready_for_8x5n_surgical_route_patch_false",
    { readyFor8x5NTextDocumentBypassGuardSurgicalRoutePatch: false });

  // 8.5N surgical patch assertions
  expect_rejected("surgical_route_patch_performed_false",
    { textDocumentBypassGuardSurgicalRoutePatchPerformed: false });
  expect_rejected("surgical_route_patch_only_false",
    { textDocumentBypassGuardSurgicalRoutePatchOnly: false });
  expect_rejected("route_patch_was_minimal_false",
    { textDocumentBypassGuardRoutePatchWasMinimal: false });
  expect_rejected("runtime_now_implemented_for_free_qa_containment_false",
    { textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: false });
  expect_rejected("blocks_document_like_text_before_run_smart_talk_false",
    { textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: false });
  expect_rejected("allows_general_questions_existing_flow_false",
    { textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: false });
  expect_rejected("does_not_authorize_real_document_runtime_false",
    { textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: false });

  // 8.5N actual performed flags
  expect_rejected("actual_live_route_mutation_performed_false",
    { actualLiveRouteMutationPerformed: false });
  expect_rejected("actual_document_bypass_guard_implemented_false",
    { actualDocumentBypassGuardImplemented: false });

  // Surgical patch target flags
  expect_rejected("surgical_patch_modified_smart_talk_route_false",
    { surgicalPatchModifiedSmartTalkRoute: false });
  expect_rejected("surgical_patch_did_not_modify_photo_route_false",
    { surgicalPatchDidNotModifyPhotoRoute: false });
  expect_rejected("surgical_patch_preserved_photo_ocr_quarantine_false",
    { surgicalPatchPreservedPhotoOcrQuarantine: false });
  expect_rejected("surgical_patch_did_not_modify_ui_false",
    { surgicalPatchDidNotModifyUi: false });
  expect_rejected("surgical_patch_did_not_modify_env_false",
    { surgicalPatchDidNotModifyEnv: false });
  expect_rejected("surgical_patch_did_not_modify_migrations_false",
    { surgicalPatchDidNotModifyMigrations: false });
  expect_rejected("surgical_patch_did_not_modify_payment_false",
    { surgicalPatchDidNotModifyPayment: false });
  expect_rejected("surgical_patch_did_not_modify_storage_false",
    { surgicalPatchDidNotModifyStorage: false });
  expect_rejected("surgical_patch_did_not_modify_supabase_false",
    { surgicalPatchDidNotModifySupabase: false });
  expect_rejected("surgical_patch_did_not_modify_database_false",
    { surgicalPatchDidNotModifyDatabase: false });
  expect_rejected("surgical_patch_did_not_add_dependency_false",
    { surgicalPatchDidNotAddDependency: false });
  expect_rejected("surgical_patch_did_not_refactor_route_broadly_false",
    { surgicalPatchDidNotRefactorRouteBroadly: false });

  // Surgical patch insertion flags
  expect_rejected("surgical_patch_inserted_after_json_parse_false",
    { surgicalPatchInsertedAfterJsonParse: false });
  expect_rejected("surgical_patch_inserted_before_run_smart_talk_false",
    { surgicalPatchInsertedBeforeRunSmartTalk: false });
  expect_rejected("surgical_patch_inserted_before_prompt_build_false",
    { surgicalPatchInsertedBeforePromptBuild: false });
  expect_rejected("surgical_patch_inserted_before_model_call_false",
    { surgicalPatchInsertedBeforeModelCall: false });
  expect_rejected("surgical_patch_inserted_before_full_document_analysis_false",
    { surgicalPatchInsertedBeforeFullDocumentAnalysis: false });
  expect_rejected("surgical_patch_uses_server_side_guard_false",
    { surgicalPatchUsesServerSideGuard: false });
  expect_rejected("surgical_patch_does_not_use_ui_only_guard_false",
    { surgicalPatchDoesNotUseUiOnlyGuard: false });
  expect_rejected("surgical_patch_does_not_use_model_based_guard_decision_false",
    { surgicalPatchDoesNotUseModelBasedGuardDecision: false });
  expect_rejected("surgical_patch_uses_deterministic_local_decision_false",
    { surgicalPatchUsesDeterministicLocalDecision: false });
  expect_rejected("surgical_patch_uses_no_external_service_decision_false",
    { surgicalPatchUsesNoExternalServiceDecision: false });
  expect_rejected("surgical_patch_blocked_path_does_not_call_run_smart_talk_false",
    { surgicalPatchBlockedPathDoesNotCallRunSmartTalk: false });
  expect_rejected("surgical_patch_allowed_path_preserves_existing_flow_false",
    { surgicalPatchAllowedPathPreservesExistingFlow: false });

  // Surgical patch detector flags
  expect_rejected("surgical_patch_detector_uses_multi_signal_scoring_false",
    { surgicalPatchDetectorUsesMultiSignalScoring: false });
  expect_rejected("surgical_patch_detector_uses_length_thresholds_false",
    { surgicalPatchDetectorUsesLengthThresholds: false });
  expect_rejected("surgical_patch_detector_uses_official_letter_markers_false",
    { surgicalPatchDetectorUsesOfficialLetterMarkers: false });
  expect_rejected("surgical_patch_detector_uses_german_authority_markers_false",
    { surgicalPatchDetectorUsesGermanAuthorityMarkers: false });
  expect_rejected("surgical_patch_detector_uses_invoice_mahnung_markers_false",
    { surgicalPatchDetectorUsesInvoiceMahnungMarkers: false });
  expect_rejected("surgical_patch_detector_uses_bescheid_widerspruch_markers_false",
    { surgicalPatchDetectorUsesBescheidWiderspruchMarkers: false });
  expect_rejected("surgical_patch_detector_uses_deadline_legal_consequence_markers_false",
    { surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers: false });
  expect_rejected("surgical_patch_detector_uses_personal_data_markers_false",
    { surgicalPatchDetectorUsesPersonalDataMarkers: false });
  expect_rejected("surgical_patch_detector_uses_reference_number_markers_false",
    { surgicalPatchDetectorUsesReferenceNumberMarkers: false });
  expect_rejected("surgical_patch_detector_uses_salutation_and_signature_markers_false",
    { surgicalPatchDetectorUsesSalutationAndSignatureMarkers: false });
  expect_rejected("surgical_patch_detector_passes_question_like_general_text_false",
    { surgicalPatchDetectorPassesQuestionLikeGeneralText: false });
  expect_rejected("surgical_patch_detector_blocks_high_risk_document_like_text_false",
    { surgicalPatchDetectorBlocksHighRiskDocumentLikeText: false });
  expect_rejected("surgical_patch_detector_uses_conservative_handling_false",
    { surgicalPatchDetectorUsesConservativeHandling: false });

  // Surgical patch blocked response flags
  expect_rejected("surgical_patch_blocked_response_status_non_success_false",
    { surgicalPatchBlockedResponseStatusNonSuccess: false });
  expect_rejected("surgical_patch_blocked_response_ok_false_false",
    { surgicalPatchBlockedResponseOkFalse: false });
  expect_rejected("surgical_patch_blocked_response_code_document_mode_required_false",
    { surgicalPatchBlockedResponseCodeDocumentModeRequired: false });
  expect_rejected("surgical_patch_blocked_response_short_user_safe_message_false",
    { surgicalPatchBlockedResponseShortUserSafeMessage: false });
  expect_rejected("surgical_patch_blocked_response_points_to_paid_doc_mode_false",
    { surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: false });
  expect_rejected("surgical_patch_blocked_response_may_suggest_general_question_rephrase_false",
    { surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase: false });
  expect_rejected("surgical_patch_blocked_response_no_internal_governance_false",
    { surgicalPatchBlockedResponseNoInternalGovernance: false });
  expect_rejected("surgical_patch_blocked_response_no_tamper_or_audit_internals_false",
    { surgicalPatchBlockedResponseNoTamperOrAuditInternals: false });
  expect_rejected("surgical_patch_blocked_response_no_raw_document_echo_false",
    { surgicalPatchBlockedResponseNoRawDocumentEcho: false });
  expect_rejected("surgical_patch_blocked_response_no_translation_false",
    { surgicalPatchBlockedResponseNoTranslation: false });
  expect_rejected("surgical_patch_blocked_response_no_summary_false",
    { surgicalPatchBlockedResponseNoSummary: false });
  expect_rejected("surgical_patch_blocked_response_no_explanation_false",
    { surgicalPatchBlockedResponseNoExplanation: false });
  expect_rejected("surgical_patch_blocked_response_no_legal_advice_false",
    { surgicalPatchBlockedResponseNoLegalAdvice: false });
  expect_rejected("surgical_patch_blocked_response_no_exact_deadline_false",
    { surgicalPatchBlockedResponseNoExactDeadline: false });
  expect_rejected("surgical_patch_blocked_response_no_legal_certainty_false",
    { surgicalPatchBlockedResponseNoLegalCertainty: false });
  expect_rejected("surgical_patch_blocked_response_no_claim_authorization_false",
    { surgicalPatchBlockedResponseNoClaimAuthorization: false });

  // TD containment 8.5N result
  expect_rejected("td001_surgically_patched_false",
    { td001DocumentBypassGuardSurgicallyPatched: false });
  expect_rejected("td001_still_requires_post_patch_audit_false",
    { td001DocumentBypassGuardStillRequiresPostPatchAudit: false });
  expect_rejected("td003_photo_ocr_route_contained_in_result_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td004_pre_model_pii_redaction_missing_in_result_false",
    { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td005_paid_document_mode_not_server_side_enforced_in_result_false",
    { td005PaidDocumentModeNotServerSideEnforced: false });
  expect_rejected("td002_evidence_gates_not_wired_in_result_false",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // SP confirms
  expect_rejected("sp_confirms_no_openai_call_in_guard_false",
    { textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard: false });
  expect_rejected("sp_confirms_no_fetch_call_in_guard_false",
    { textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard: false });
  expect_rejected("sp_confirms_no_process_env_read_in_guard_false",
    { textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard: false });
  expect_rejected("sp_confirms_no_sdk_usage_in_guard_false",
    { textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard: false });
  expect_rejected("sp_confirms_no_8x3ac_rerun_false",
    { textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun: false });
  expect_rejected("sp_confirms_no_photo_route_mutation_false",
    { textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation: false });
  expect_rejected("sp_confirms_no_public_runtime_enablement_false",
    { textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement: false });
  expect_rejected("sp_confirms_no_ui_mutation_false",
    { textBypassGuardSurgicalPatchConfirmsNoUiMutation: false });
  expect_rejected("sp_confirms_no_supabase_mutation_false",
    { textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation: false });
  expect_rejected("sp_confirms_no_storage_mutation_false",
    { textBypassGuardSurgicalPatchConfirmsNoStorageMutation: false });
  expect_rejected("sp_confirms_no_database_write_false",
    { textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite: false });
  expect_rejected("sp_confirms_no_audit_persistence_false",
    { textBypassGuardSurgicalPatchConfirmsNoAuditPersistence: false });
  expect_rejected("sp_confirms_no_payment_runtime_call_false",
    { textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall: false });
  expect_rejected("sp_confirms_no_ocr_runtime_call_false",
    { textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall: false });
  expect_rejected("sp_confirms_no_photo_input_processing_false",
    { textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing: false });
  expect_rejected("sp_confirms_no_file_input_processing_false",
    { textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing: false });
  expect_rejected("sp_confirms_no_document_parsing_runtime_false",
    { textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime: false });
  expect_rejected("sp_confirms_no_raw_document_storage_false",
    { textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage: false });
  expect_rejected("sp_confirms_no_model_output_storage_false",
    { textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage: false });
  expect_rejected("sp_confirms_no_prompt_storage_on_blocked_path_false",
    { textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath: false });
  expect_rejected("sp_confirms_no_user_visible_document_explanation_false",
    { textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation: false });
  expect_rejected("sp_confirms_no_customer_facing_document_analysis_false",
    { textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis: false });
  expect_rejected("sp_confirms_no_evidence_evaluation_false",
    { textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation: false });
  expect_rejected("sp_confirms_no_claim_authorization_false",
    { textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization: false });
  expect_rejected("sp_confirms_no_deadline_calculation_false",
    { textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation: false });
  expect_rejected("sp_confirms_no_legal_certainty_false",
    { textBypassGuardSurgicalPatchConfirmsNoLegalCertainty: false });

  // Forward readiness
  expect_rejected("ready_for_8x5o_post_patch_containment_audit_false",
    { readyFor8x5OPostPatchContainmentAudit: false });
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
  expect_rejected("public_runtime_enabled_true",
    { publicRuntimeEnabled: true });
  expect_rejected("persistence_used_true",
    { persistenceUsed: true });
  expect_rejected("never_user_visible_false",
    { neverUserVisible: false });

  return { allRejected: failures.length === 0, count, failures };
}

// ── Public export ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatch(): ControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchResult {
  const canonical = buildCanonical8x5NInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validateSurgicalRoutePatchInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5N",
    allPassed,
    textDocumentBypassGuardRoutePatchExecutionContractReadyForSurgicalPatch: true,
    controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted: allPassed,
    textDocumentBypassGuardSurgicalRoutePatchPerformed: true,
    textDocumentBypassGuardSurgicalRoutePatchOnly: true,
    textDocumentBypassGuardRoutePatchWasMinimal: true,
    textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: true,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: true,
    textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: true,
    textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: true,
    tamperCasesRejected: tamperResult.allRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    actualLiveRouteMutationPerformed: true,
    actualDocumentBypassGuardImplemented: true,
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
    actualPaidDocumentModeImplemented: false,
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    surgicalPatchModifiedSmartTalkRoute: true,
    surgicalPatchDidNotModifyPhotoRoute: true,
    surgicalPatchPreservedPhotoOcrQuarantine: true,
    surgicalPatchDidNotModifyUi: true,
    surgicalPatchDidNotModifyEnv: true,
    surgicalPatchDidNotModifyMigrations: true,
    surgicalPatchDidNotModifyPayment: true,
    surgicalPatchDidNotModifyStorage: true,
    surgicalPatchDidNotModifySupabase: true,
    surgicalPatchDidNotModifyDatabase: true,
    surgicalPatchDidNotAddDependency: true,
    surgicalPatchDidNotRefactorRouteBroadly: true,

    surgicalPatchInsertedAfterJsonParse: true,
    surgicalPatchInsertedBeforeRunSmartTalk: true,
    surgicalPatchInsertedBeforePromptBuild: true,
    surgicalPatchInsertedBeforeModelCall: true,
    surgicalPatchInsertedBeforeFullDocumentAnalysis: true,
    surgicalPatchUsesServerSideGuard: true,
    surgicalPatchDoesNotUseUiOnlyGuard: true,
    surgicalPatchDoesNotUseModelBasedGuardDecision: true,
    surgicalPatchUsesDeterministicLocalDecision: true,
    surgicalPatchUsesNoExternalServiceDecision: true,
    surgicalPatchBlockedPathDoesNotCallRunSmartTalk: true,
    surgicalPatchAllowedPathPreservesExistingFlow: true,

    surgicalPatchDetectorUsesMultiSignalScoring: true,
    surgicalPatchDetectorUsesLengthThresholds: true,
    surgicalPatchDetectorUsesOfficialLetterMarkers: true,
    surgicalPatchDetectorUsesGermanAuthorityMarkers: true,
    surgicalPatchDetectorUsesInvoiceMahnungMarkers: true,
    surgicalPatchDetectorUsesBescheidWiderspruchMarkers: true,
    surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers: true,
    surgicalPatchDetectorUsesPersonalDataMarkers: true,
    surgicalPatchDetectorUsesReferenceNumberMarkers: true,
    surgicalPatchDetectorUsesSalutationAndSignatureMarkers: true,
    surgicalPatchDetectorPassesQuestionLikeGeneralText: true,
    surgicalPatchDetectorBlocksHighRiskDocumentLikeText: true,
    surgicalPatchDetectorUsesConservativeHandling: true,

    surgicalPatchBlockedResponseStatusNonSuccess: true,
    surgicalPatchBlockedResponseOkFalse: true,
    surgicalPatchBlockedResponseCodeDocumentModeRequired: true,
    surgicalPatchBlockedResponseShortUserSafeMessage: true,
    surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true,
    surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase: true,
    surgicalPatchBlockedResponseNoInternalGovernance: true,
    surgicalPatchBlockedResponseNoTamperOrAuditInternals: true,
    surgicalPatchBlockedResponseNoRawDocumentEcho: true,
    surgicalPatchBlockedResponseNoTranslation: true,
    surgicalPatchBlockedResponseNoSummary: true,
    surgicalPatchBlockedResponseNoExplanation: true,
    surgicalPatchBlockedResponseNoLegalAdvice: true,
    surgicalPatchBlockedResponseNoExactDeadline: true,
    surgicalPatchBlockedResponseNoLegalCertainty: true,
    surgicalPatchBlockedResponseNoClaimAuthorization: true,

    td001DocumentBypassGuardSurgicallyPatched: true,
    td001DocumentBypassGuardStillRequiresPostPatchAudit: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign: true,

    td004PreModelPiiRedactionMissing: true,
    td005PaidDocumentModeNotServerSideEnforced: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,

    td006EvidenceGateTodoAndOrSemanticsUnresolved: true,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: true,
    td008InMemoryRateLimiterServerlessUnsafe: true,
    td010GetUserStateDocumentTypeTodoOpen: true,
    td009TmpDebugRunnerDebtClosed: true,
    tmpFilesPresentInWorkingTree: false,

    textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard: true,
    textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun: true,
    textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement: true,
    textBypassGuardSurgicalPatchConfirmsNoUiMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoStorageMutation: true,
    textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite: true,
    textBypassGuardSurgicalPatchConfirmsNoAuditPersistence: true,
    textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall: true,
    textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing: true,
    textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing: true,
    textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage: true,
    textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage: true,
    textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath: true,
    textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation: true,
    textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization: true,
    textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation: true,
    textBypassGuardSurgicalPatchConfirmsNoLegalCertainty: true,

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

    readyFor8x5OPostPatchContainmentAudit: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5N is a controlled real-document Text Document Bypass Guard surgical route patch.",
      "8.5N depends on completed 8.5M Text Document Bypass Guard route patch execution contract.",
      "8.5N modified /api/smart-talk only.",
      "/api/smart-talk-photo was not modified.",
      "The 8.5H photo OCR route quarantine remains preserved.",
      "The guard is deterministic, server-side, and local.",
      "The guard runs after JSON body parsing and before runSmartTalk, model call, prompt build, and full document analysis.",
      "Document-like pasted text in Free Q&A now short-circuits before any model call.",
      "Blocked document-like text returns safe document_mode_required response (HTTP 402).",
      "Ordinary general questions still pass through to the existing Smart Talk flow unchanged.",
      "Full document translation, explanation, or summary is still not provided in Free Q&A.",
      "Paid Document Mode server boundary remains unresolved (TD-005).",
      "Pre-model PII redaction remains unresolved (TD-004).",
      "Evidence Gate runtime wiring remains unresolved (TD-002).",
      "TD-001 is surgically patched but still requires post-patch containment audit.",
      "TD-003 photo OCR route remains contained by the 8.5H quarantine.",
      "No runtime authorization was granted.",
      "No pilot or production authorization was granted.",
      "No final go-live authorization was granted.",
      "No real document processing was authorized.",
      "No OCR, photo, file, storage, or persistence was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No evidence evaluation, claim authorization, or deadline calculation was performed.",
      "No live LLM call was performed by the governance/audit file.",
      "8.3AC was not re-run.",
      "The next phase is 8.5O Post-Patch Containment Audit.",
      "readyFor8x5OPostPatchContainmentAudit is audit readiness only, not runtime authorization.",
    ],
  };
}
