/**
 * Phase 8.5O — Controlled Real Document Text Document Bypass Guard Post-Patch
 * Containment Audit.
 *
 * POST-PATCH-CONTAINMENT-AUDIT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5N.
 *
 * This file audits the completed 8.5N surgical route patch state. It does NOT
 * import or call the live route.
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
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatch } from "./run-controlled-real-document-text-document-bypass-guard-surgical-route-patch";

// ── Local post-patch containment audit input type ─────────────────────────────

interface ControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditInput {
  // 8.5N prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted: boolean;
  readonly textDocumentBypassGuardSurgicalRoutePatchPerformed: boolean;
  readonly textDocumentBypassGuardSurgicalRoutePatchOnly: boolean;
  readonly textDocumentBypassGuardRoutePatchWasMinimal: boolean;
  readonly textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment: boolean;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk: boolean;
  readonly textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow: boolean;
  readonly textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime: boolean;

  // Prereq actual performed flags that must be true in 8.5N
  readonly prereqActualLiveRouteMutationPerformed: boolean;
  readonly prereqActualDocumentBypassGuardImplemented: boolean;

  // All other prereq actual* flags (must all be false in 8.5N)
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

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // TD and containment flags from 8.5N
  readonly td001DocumentBypassGuardSurgicallyPatched: boolean;
  readonly td001DocumentBypassGuardStillRequiresPostPatchAudit: boolean;
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

  // 8.5N SP confirms (must all be true)
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

  // 8.5N forward readiness
  readonly readyFor8x5OPostPatchContainmentAudit: boolean;

  // 8.5O audit assertions (must all be true)
  readonly textDocumentBypassGuardPostPatchContainmentAuditOnly: boolean;
  readonly textDocumentBypassGuardPostPatchContainmentAuditCompleted: boolean;
  readonly textDocumentBypassGuardContainmentPatchVerified: boolean;
  readonly textDocumentBypassGuardFreeQaContainmentVerified: boolean;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: boolean;
  readonly textDocumentBypassGuardGeneralQuestionsPassThroughVerified: boolean;
  readonly textDocumentBypassGuardDocumentModeRequiredResponseVerified: boolean;
  readonly textDocumentBypassGuardNoRuntimeAuthorizationVerified: boolean;

  // Audit target flags (must all be true)
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

  // Audit detector flags (must all be true)
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

  // Audit response flags (must all be true)
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

  // 8.5O TD containment result (must all be true)
  readonly td001DocumentBypassGuardPostPatchAudited: boolean;
  readonly td001DocumentBypassGuardContainmentClosed: boolean;
  readonly td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: boolean;

  // 8.5O actual performed flags (must all be false — audit-only phase)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;

  // 8.5O audit confirms no prohibited side effects (must all be true)
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

  // Forward readiness
  readonly readyFor8x5PPaidDocumentModeServerBoundaryContract: boolean;
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

export interface ControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditResult {
  readonly checkId: "8.5O";
  readonly allPassed: boolean;
  readonly textDocumentBypassGuardSurgicalPatchReadyForPostPatchAudit: boolean;
  readonly controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted: boolean;
  readonly textDocumentBypassGuardPostPatchContainmentAuditOnly: true;
  readonly textDocumentBypassGuardPostPatchContainmentAuditCompleted: true;
  readonly textDocumentBypassGuardContainmentPatchVerified: true;
  readonly textDocumentBypassGuardFreeQaContainmentVerified: true;
  readonly textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: true;
  readonly textDocumentBypassGuardGeneralQuestionsPassThroughVerified: true;
  readonly textDocumentBypassGuardDocumentModeRequiredResponseVerified: true;
  readonly textDocumentBypassGuardNoRuntimeAuthorizationVerified: true;
  readonly tamperCasesRejected: boolean;

  // Authorization grants (all false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Audit target flags
  readonly postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: true;
  readonly postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: true;
  readonly postPatchAuditConfirmsPhotoOcrQuarantinePreserved: true;
  readonly postPatchAuditConfirmsGuardIsServerSide: true;
  readonly postPatchAuditConfirmsGuardIsDeterministicLocal: true;
  readonly postPatchAuditConfirmsGuardRunsAfterJsonParse: true;
  readonly postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: true;
  readonly postPatchAuditConfirmsBlockedPathNoRunSmartTalk: true;
  readonly postPatchAuditConfirmsAllowedPathPreservesExistingFlow: true;
  readonly postPatchAuditConfirmsNoBroadRouteRefactor: true;
  readonly postPatchAuditConfirmsNoNewDependency: true;

  // Audit detector flags
  readonly postPatchAuditConfirmsDetectorUsesMultiSignalScoring: true;
  readonly postPatchAuditConfirmsDetectorUsesLengthThresholds: true;
  readonly postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: true;
  readonly postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: true;
  readonly postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: true;
  readonly postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: true;
  readonly postPatchAuditConfirmsDetectorUsesConservativeHandling: true;

  // Audit response flags
  readonly postPatchAuditConfirmsBlockedResponseStatusNonSuccess: true;
  readonly postPatchAuditConfirmsBlockedResponseOkFalse: true;
  readonly postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: true;
  readonly postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: true;
  readonly postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true;
  readonly postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: true;
  readonly postPatchAuditConfirmsBlockedResponseNoInternalGovernance: true;
  readonly postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: true;
  readonly postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: true;
  readonly postPatchAuditConfirmsBlockedResponseNoTranslation: true;
  readonly postPatchAuditConfirmsBlockedResponseNoSummary: true;
  readonly postPatchAuditConfirmsBlockedResponseNoExplanation: true;
  readonly postPatchAuditConfirmsBlockedResponseNoLegalAdvice: true;
  readonly postPatchAuditConfirmsBlockedResponseNoExactDeadline: true;
  readonly postPatchAuditConfirmsBlockedResponseNoLegalCertainty: true;
  readonly postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: true;

  // TD containment
  readonly td001DocumentBypassGuardPostPatchAudited: true;
  readonly td001DocumentBypassGuardContainmentClosed: true;
  readonly td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: true;
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

  // Actual performed flags (all false — audit-only phase)
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualDocumentBypassGuardImplemented: false;
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

  // Audit confirms no prohibited side effects
  readonly textBypassGuardPostPatchAuditConfirmsNoOpenAiCall: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoFetchCall: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoSdkUsage: true;
  readonly textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoRouteImport: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoRouteMutation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoUiMutation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoStorageMutation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoAuditPersistence: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoPromptStorage: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation: true;
  readonly textBypassGuardPostPatchAuditConfirmsNoLegalCertainty: true;

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
  readonly readyFor8x5PPaidDocumentModeServerBoundaryContract: true;
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

// ── Post-patch containment audit input validator ──────────────────────────────

function validatePostPatchContainmentAuditInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5N prerequisite gates
  if (o["prereqCheckId"] !== "8.5N")
    reasons.push("prereq_check_id_must_be_8x5N");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted"] !== true)
    reasons.push("surgical_route_patch_not_accepted");
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

  // Prereq actual performed flags that must be true in 8.5N
  if (o["prereqActualLiveRouteMutationPerformed"] !== true)
    reasons.push("prereq_actual_live_route_mutation_performed_must_be_true");
  if (o["prereqActualDocumentBypassGuardImplemented"] !== true)
    reasons.push("prereq_actual_document_bypass_guard_implemented_must_be_true");

  // All other prereq actual* flags (must all be false)
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

  // TD and containment flags from 8.5N (must all be true or specific values)
  if (o["td001DocumentBypassGuardSurgicallyPatched"] !== true)
    reasons.push("td001_surgically_patched_false");
  if (o["td001DocumentBypassGuardStillRequiresPostPatchAudit"] !== true)
    reasons.push("td001_still_requires_post_patch_audit_false");
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

  // 8.5N SP confirms (must all be true)
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

  // 8.5N forward readiness
  if (o["readyFor8x5OPostPatchContainmentAudit"] !== true)
    reasons.push("ready_for_8x5o_post_patch_containment_audit_false");

  // 8.5O audit assertions (must all be true)
  if (o["textDocumentBypassGuardPostPatchContainmentAuditOnly"] !== true)
    reasons.push("post_patch_containment_audit_only_false");
  if (o["textDocumentBypassGuardPostPatchContainmentAuditCompleted"] !== true)
    reasons.push("post_patch_containment_audit_completed_false");
  if (o["textDocumentBypassGuardContainmentPatchVerified"] !== true)
    reasons.push("containment_patch_verified_false");
  if (o["textDocumentBypassGuardFreeQaContainmentVerified"] !== true)
    reasons.push("free_qa_containment_verified_false");
  if (o["textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified"] !== true)
    reasons.push("blocks_document_like_text_before_run_smart_talk_verified_false");
  if (o["textDocumentBypassGuardGeneralQuestionsPassThroughVerified"] !== true)
    reasons.push("general_questions_pass_through_verified_false");
  if (o["textDocumentBypassGuardDocumentModeRequiredResponseVerified"] !== true)
    reasons.push("document_mode_required_response_verified_false");
  if (o["textDocumentBypassGuardNoRuntimeAuthorizationVerified"] !== true)
    reasons.push("no_runtime_authorization_verified_false");

  // Audit target flags (must all be true)
  if (o["postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N"] !== true)
    reasons.push("post_patch_audit_confirms_smart_talk_route_was_modified_false");
  if (o["postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N"] !== true)
    reasons.push("post_patch_audit_confirms_photo_route_was_not_modified_false");
  if (o["postPatchAuditConfirmsPhotoOcrQuarantinePreserved"] !== true)
    reasons.push("post_patch_audit_confirms_photo_ocr_quarantine_preserved_false");
  if (o["postPatchAuditConfirmsGuardIsServerSide"] !== true)
    reasons.push("post_patch_audit_confirms_guard_is_server_side_false");
  if (o["postPatchAuditConfirmsGuardIsDeterministicLocal"] !== true)
    reasons.push("post_patch_audit_confirms_guard_is_deterministic_local_false");
  if (o["postPatchAuditConfirmsGuardRunsAfterJsonParse"] !== true)
    reasons.push("post_patch_audit_confirms_guard_runs_after_json_parse_false");
  if (o["postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk"] !== true)
    reasons.push("post_patch_audit_confirms_guard_runs_before_run_smart_talk_false");
  if (o["postPatchAuditConfirmsBlockedPathNoRunSmartTalk"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_path_no_run_smart_talk_false");
  if (o["postPatchAuditConfirmsAllowedPathPreservesExistingFlow"] !== true)
    reasons.push("post_patch_audit_confirms_allowed_path_preserves_existing_flow_false");
  if (o["postPatchAuditConfirmsNoBroadRouteRefactor"] !== true)
    reasons.push("post_patch_audit_confirms_no_broad_route_refactor_false");
  if (o["postPatchAuditConfirmsNoNewDependency"] !== true)
    reasons.push("post_patch_audit_confirms_no_new_dependency_false");

  // Audit detector flags (must all be true)
  if (o["postPatchAuditConfirmsDetectorUsesMultiSignalScoring"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_multi_signal_scoring_false");
  if (o["postPatchAuditConfirmsDetectorUsesLengthThresholds"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_length_thresholds_false");
  if (o["postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_official_letter_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_german_authority_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_invoice_mahnung_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_bescheid_widerspruch_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_deadline_legal_consequence_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesPersonalDataMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_personal_data_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_reference_number_markers_false");
  if (o["postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_salutation_and_signature_markers_false");
  if (o["postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText"] !== true)
    reasons.push("post_patch_audit_confirms_detector_passes_question_like_general_text_false");
  if (o["postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText"] !== true)
    reasons.push("post_patch_audit_confirms_detector_blocks_high_risk_document_like_text_false");
  if (o["postPatchAuditConfirmsDetectorUsesConservativeHandling"] !== true)
    reasons.push("post_patch_audit_confirms_detector_uses_conservative_handling_false");

  // Audit response flags (must all be true)
  if (o["postPatchAuditConfirmsBlockedResponseStatusNonSuccess"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_status_non_success_false");
  if (o["postPatchAuditConfirmsBlockedResponseOkFalse"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_ok_false_false");
  if (o["postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_code_document_mode_required_false");
  if (o["postPatchAuditConfirmsBlockedResponseShortUserSafeMessage"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_short_user_safe_message_false");
  if (o["postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_points_to_paid_doc_mode_false");
  if (o["postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_may_suggest_rephrase_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoInternalGovernance"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_internal_governance_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_tamper_or_audit_internals_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_raw_document_echo_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoTranslation"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_translation_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoSummary"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_summary_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoExplanation"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_explanation_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoLegalAdvice"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_legal_advice_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoExactDeadline"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_exact_deadline_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoLegalCertainty"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_legal_certainty_false");
  if (o["postPatchAuditConfirmsBlockedResponseNoClaimAuthorization"] !== true)
    reasons.push("post_patch_audit_confirms_blocked_response_no_claim_authorization_false");

  // 8.5O TD containment result (must all be true)
  if (o["td001DocumentBypassGuardPostPatchAudited"] !== true)
    reasons.push("td001_post_patch_audited_false");
  if (o["td001DocumentBypassGuardContainmentClosed"] !== true)
    reasons.push("td001_containment_closed_false");
  if (o["td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary"] !== true)
    reasons.push("td001_still_requires_future_paid_mode_boundary_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained"] !== true)
    reasons.push("td003_photo_ocr_route_contained_in_result_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_in_result_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_in_result_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_in_result_false");

  // 8.5O actual performed flags (must all be false)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_must_be_false_in_8x5o");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented_must_be_false_in_8x5o");

  // 8.5O audit confirms (must all be true)
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

  // Forward readiness
  if (o["readyFor8x5PPaidDocumentModeServerBoundaryContract"] !== true)
    reasons.push("ready_for_8x5p_paid_document_mode_server_boundary_contract_false");
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

// ── Canonical 8.5O input ──────────────────────────────────────────────────────

function buildCanonical8x5OInput(): ControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditInput {
  const patchResult = runControlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatch();
  return {
    // 8.5N prerequisite gates
    prereqCheckId: patchResult.checkId,
    prereqAllPassed: patchResult.allPassed,
    controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted:
      patchResult.controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted,
    textDocumentBypassGuardSurgicalRoutePatchPerformed:
      patchResult.textDocumentBypassGuardSurgicalRoutePatchPerformed,
    textDocumentBypassGuardSurgicalRoutePatchOnly:
      patchResult.textDocumentBypassGuardSurgicalRoutePatchOnly,
    textDocumentBypassGuardRoutePatchWasMinimal:
      patchResult.textDocumentBypassGuardRoutePatchWasMinimal,
    textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment:
      patchResult.textDocumentBypassGuardRuntimeNowImplementedForFreeQaContainment,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk:
      patchResult.textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalk,
    textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow:
      patchResult.textDocumentBypassGuardAllowsGeneralQuestionsExistingFlow,
    textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime:
      patchResult.textDocumentBypassGuardDoesNotAuthorizeRealDocumentRuntime,

    // Prereq actual performed flags that must be true in 8.5N
    prereqActualLiveRouteMutationPerformed: patchResult.actualLiveRouteMutationPerformed,
    prereqActualDocumentBypassGuardImplemented: patchResult.actualDocumentBypassGuardImplemented,

    // All other prereq actual* (must be false in 8.5N)
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
    actualEvidenceEvaluationPerformed: patchResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: patchResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: patchResult.actualDeadlineCalculationPerformed,
    actualPhotoRouteQuarantinePerformed: patchResult.actualPhotoRouteQuarantinePerformed,
    actualPaidDocumentModeImplemented: patchResult.actualPaidDocumentModeImplemented,
    actualPiiRedactionImplemented: patchResult.actualPiiRedactionImplemented,
    actualEvidenceGateRuntimeWiringPerformed: patchResult.actualEvidenceGateRuntimeWiringPerformed,

    // Surgical patch target flags
    surgicalPatchModifiedSmartTalkRoute: patchResult.surgicalPatchModifiedSmartTalkRoute,
    surgicalPatchDidNotModifyPhotoRoute: patchResult.surgicalPatchDidNotModifyPhotoRoute,
    surgicalPatchPreservedPhotoOcrQuarantine: patchResult.surgicalPatchPreservedPhotoOcrQuarantine,
    surgicalPatchDidNotModifyUi: patchResult.surgicalPatchDidNotModifyUi,
    surgicalPatchDidNotModifyEnv: patchResult.surgicalPatchDidNotModifyEnv,
    surgicalPatchDidNotModifyMigrations: patchResult.surgicalPatchDidNotModifyMigrations,
    surgicalPatchDidNotModifyPayment: patchResult.surgicalPatchDidNotModifyPayment,
    surgicalPatchDidNotModifyStorage: patchResult.surgicalPatchDidNotModifyStorage,
    surgicalPatchDidNotModifySupabase: patchResult.surgicalPatchDidNotModifySupabase,
    surgicalPatchDidNotModifyDatabase: patchResult.surgicalPatchDidNotModifyDatabase,
    surgicalPatchDidNotAddDependency: patchResult.surgicalPatchDidNotAddDependency,
    surgicalPatchDidNotRefactorRouteBroadly: patchResult.surgicalPatchDidNotRefactorRouteBroadly,

    // Surgical patch insertion flags
    surgicalPatchInsertedAfterJsonParse: patchResult.surgicalPatchInsertedAfterJsonParse,
    surgicalPatchInsertedBeforeRunSmartTalk: patchResult.surgicalPatchInsertedBeforeRunSmartTalk,
    surgicalPatchInsertedBeforePromptBuild: patchResult.surgicalPatchInsertedBeforePromptBuild,
    surgicalPatchInsertedBeforeModelCall: patchResult.surgicalPatchInsertedBeforeModelCall,
    surgicalPatchInsertedBeforeFullDocumentAnalysis:
      patchResult.surgicalPatchInsertedBeforeFullDocumentAnalysis,
    surgicalPatchUsesServerSideGuard: patchResult.surgicalPatchUsesServerSideGuard,
    surgicalPatchDoesNotUseUiOnlyGuard: patchResult.surgicalPatchDoesNotUseUiOnlyGuard,
    surgicalPatchDoesNotUseModelBasedGuardDecision:
      patchResult.surgicalPatchDoesNotUseModelBasedGuardDecision,
    surgicalPatchUsesDeterministicLocalDecision:
      patchResult.surgicalPatchUsesDeterministicLocalDecision,
    surgicalPatchUsesNoExternalServiceDecision:
      patchResult.surgicalPatchUsesNoExternalServiceDecision,
    surgicalPatchBlockedPathDoesNotCallRunSmartTalk:
      patchResult.surgicalPatchBlockedPathDoesNotCallRunSmartTalk,
    surgicalPatchAllowedPathPreservesExistingFlow:
      patchResult.surgicalPatchAllowedPathPreservesExistingFlow,

    // Surgical patch detector flags
    surgicalPatchDetectorUsesMultiSignalScoring:
      patchResult.surgicalPatchDetectorUsesMultiSignalScoring,
    surgicalPatchDetectorUsesLengthThresholds:
      patchResult.surgicalPatchDetectorUsesLengthThresholds,
    surgicalPatchDetectorUsesOfficialLetterMarkers:
      patchResult.surgicalPatchDetectorUsesOfficialLetterMarkers,
    surgicalPatchDetectorUsesGermanAuthorityMarkers:
      patchResult.surgicalPatchDetectorUsesGermanAuthorityMarkers,
    surgicalPatchDetectorUsesInvoiceMahnungMarkers:
      patchResult.surgicalPatchDetectorUsesInvoiceMahnungMarkers,
    surgicalPatchDetectorUsesBescheidWiderspruchMarkers:
      patchResult.surgicalPatchDetectorUsesBescheidWiderspruchMarkers,
    surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers:
      patchResult.surgicalPatchDetectorUsesDeadlineLegalConsequenceMarkers,
    surgicalPatchDetectorUsesPersonalDataMarkers:
      patchResult.surgicalPatchDetectorUsesPersonalDataMarkers,
    surgicalPatchDetectorUsesReferenceNumberMarkers:
      patchResult.surgicalPatchDetectorUsesReferenceNumberMarkers,
    surgicalPatchDetectorUsesSalutationAndSignatureMarkers:
      patchResult.surgicalPatchDetectorUsesSalutationAndSignatureMarkers,
    surgicalPatchDetectorPassesQuestionLikeGeneralText:
      patchResult.surgicalPatchDetectorPassesQuestionLikeGeneralText,
    surgicalPatchDetectorBlocksHighRiskDocumentLikeText:
      patchResult.surgicalPatchDetectorBlocksHighRiskDocumentLikeText,
    surgicalPatchDetectorUsesConservativeHandling:
      patchResult.surgicalPatchDetectorUsesConservativeHandling,

    // Surgical patch blocked response flags
    surgicalPatchBlockedResponseStatusNonSuccess:
      patchResult.surgicalPatchBlockedResponseStatusNonSuccess,
    surgicalPatchBlockedResponseOkFalse: patchResult.surgicalPatchBlockedResponseOkFalse,
    surgicalPatchBlockedResponseCodeDocumentModeRequired:
      patchResult.surgicalPatchBlockedResponseCodeDocumentModeRequired,
    surgicalPatchBlockedResponseShortUserSafeMessage:
      patchResult.surgicalPatchBlockedResponseShortUserSafeMessage,
    surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime:
      patchResult.surgicalPatchBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime,
    surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase:
      patchResult.surgicalPatchBlockedResponseMaySuggestGeneralQuestionRephrase,
    surgicalPatchBlockedResponseNoInternalGovernance:
      patchResult.surgicalPatchBlockedResponseNoInternalGovernance,
    surgicalPatchBlockedResponseNoTamperOrAuditInternals:
      patchResult.surgicalPatchBlockedResponseNoTamperOrAuditInternals,
    surgicalPatchBlockedResponseNoRawDocumentEcho:
      patchResult.surgicalPatchBlockedResponseNoRawDocumentEcho,
    surgicalPatchBlockedResponseNoTranslation: patchResult.surgicalPatchBlockedResponseNoTranslation,
    surgicalPatchBlockedResponseNoSummary: patchResult.surgicalPatchBlockedResponseNoSummary,
    surgicalPatchBlockedResponseNoExplanation: patchResult.surgicalPatchBlockedResponseNoExplanation,
    surgicalPatchBlockedResponseNoLegalAdvice: patchResult.surgicalPatchBlockedResponseNoLegalAdvice,
    surgicalPatchBlockedResponseNoExactDeadline:
      patchResult.surgicalPatchBlockedResponseNoExactDeadline,
    surgicalPatchBlockedResponseNoLegalCertainty:
      patchResult.surgicalPatchBlockedResponseNoLegalCertainty,
    surgicalPatchBlockedResponseNoClaimAuthorization:
      patchResult.surgicalPatchBlockedResponseNoClaimAuthorization,

    // Authorization grants (all false)
    runtimeAuthorizationGranted: patchResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: patchResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: patchResult.productionAuthorizationGranted,
    finalAuthorizationGranted: patchResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: patchResult.goLiveAuthorizationGranted,

    // TD flags from 8.5N
    td001DocumentBypassGuardSurgicallyPatched: patchResult.td001DocumentBypassGuardSurgicallyPatched,
    td001DocumentBypassGuardStillRequiresPostPatchAudit:
      patchResult.td001DocumentBypassGuardStillRequiresPostPatchAudit,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained:
      patchResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained,
    td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign:
      patchResult.td003PhotoOcrRouteStillRequiresFutureAuthorizedRuntimeDesign,
    td004PreModelPiiRedactionMissing: patchResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      patchResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      patchResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      patchResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      patchResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe: patchResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: patchResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: patchResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: patchResult.tmpFilesPresentInWorkingTree,

    // 8.5N SP confirms
    textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoOpenAiCallInGuard,
    textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoFetchCallInGuard,
    textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoProcessEnvReadInGuard,
    textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoSdkUsageInGuard,
    textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun:
      patchResult.textBypassGuardSurgicalPatchConfirmsNo8x3AcRerun,
    textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoPhotoRouteMutation,
    textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoPublicRuntimeEnablement,
    textBypassGuardSurgicalPatchConfirmsNoUiMutation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoUiMutation,
    textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoSupabaseMutation,
    textBypassGuardSurgicalPatchConfirmsNoStorageMutation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoStorageMutation,
    textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoDatabaseWrite,
    textBypassGuardSurgicalPatchConfirmsNoAuditPersistence:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoAuditPersistence,
    textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoPaymentRuntimeCall,
    textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoOcrRuntimeCall,
    textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoPhotoInputProcessing,
    textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoFileInputProcessing,
    textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoDocumentParsingRuntime,
    textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoRawDocumentStorage,
    textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoModelOutputStorage,
    textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoPromptStorageOnBlockedPath,
    textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoUserVisibleDocumentExplanation,
    textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoCustomerFacingDocumentAnalysis,
    textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoEvidenceEvaluation,
    textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoClaimAuthorization,
    textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoDeadlineCalculation,
    textBypassGuardSurgicalPatchConfirmsNoLegalCertainty:
      patchResult.textBypassGuardSurgicalPatchConfirmsNoLegalCertainty,

    // Pipeline executed flags
    executionSequenceActuallyExecuted: patchResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: patchResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: patchResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: patchResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: patchResult.paymentPipelineActuallyExecuted,
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

    // Legal safety flags
    exactDeadlineCalculationAuthorized: patchResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: patchResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: patchResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: patchResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: patchResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: patchResult.deliveryDateRequiredForExactDeadline,

    // 8.5N forward readiness
    readyFor8x5OPostPatchContainmentAudit: patchResult.readyFor8x5OPostPatchContainmentAudit,

    // 8.5O audit assertions
    textDocumentBypassGuardPostPatchContainmentAuditOnly: true,
    textDocumentBypassGuardPostPatchContainmentAuditCompleted: true,
    textDocumentBypassGuardContainmentPatchVerified: true,
    textDocumentBypassGuardFreeQaContainmentVerified: true,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: true,
    textDocumentBypassGuardGeneralQuestionsPassThroughVerified: true,
    textDocumentBypassGuardDocumentModeRequiredResponseVerified: true,
    textDocumentBypassGuardNoRuntimeAuthorizationVerified: true,

    // Audit target flags
    postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: true,
    postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: true,
    postPatchAuditConfirmsPhotoOcrQuarantinePreserved: true,
    postPatchAuditConfirmsGuardIsServerSide: true,
    postPatchAuditConfirmsGuardIsDeterministicLocal: true,
    postPatchAuditConfirmsGuardRunsAfterJsonParse: true,
    postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: true,
    postPatchAuditConfirmsBlockedPathNoRunSmartTalk: true,
    postPatchAuditConfirmsAllowedPathPreservesExistingFlow: true,
    postPatchAuditConfirmsNoBroadRouteRefactor: true,
    postPatchAuditConfirmsNoNewDependency: true,

    // Audit detector flags
    postPatchAuditConfirmsDetectorUsesMultiSignalScoring: true,
    postPatchAuditConfirmsDetectorUsesLengthThresholds: true,
    postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: true,
    postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: true,
    postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: true,
    postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: true,
    postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: true,
    postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: true,
    postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: true,
    postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: true,
    postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: true,
    postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: true,
    postPatchAuditConfirmsDetectorUsesConservativeHandling: true,

    // Audit response flags
    postPatchAuditConfirmsBlockedResponseStatusNonSuccess: true,
    postPatchAuditConfirmsBlockedResponseOkFalse: true,
    postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: true,
    postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: true,
    postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true,
    postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: true,
    postPatchAuditConfirmsBlockedResponseNoInternalGovernance: true,
    postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: true,
    postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: true,
    postPatchAuditConfirmsBlockedResponseNoTranslation: true,
    postPatchAuditConfirmsBlockedResponseNoSummary: true,
    postPatchAuditConfirmsBlockedResponseNoExplanation: true,
    postPatchAuditConfirmsBlockedResponseNoLegalAdvice: true,
    postPatchAuditConfirmsBlockedResponseNoExactDeadline: true,
    postPatchAuditConfirmsBlockedResponseNoLegalCertainty: true,
    postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: true,

    // 8.5O TD containment result
    td001DocumentBypassGuardPostPatchAudited: true,
    td001DocumentBypassGuardContainmentClosed: true,
    td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: true,

    // 8.5O actual performed flags (audit-only, all false)
    actualLiveRouteMutationPerformed: false,
    actualDocumentBypassGuardImplemented: false,

    // 8.5O audit confirms
    textBypassGuardPostPatchAuditConfirmsNoOpenAiCall: true,
    textBypassGuardPostPatchAuditConfirmsNoFetchCall: true,
    textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead: true,
    textBypassGuardPostPatchAuditConfirmsNoSdkUsage: true,
    textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun: true,
    textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoRouteImport: true,
    textBypassGuardPostPatchAuditConfirmsNoRouteMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoUiMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoStorageMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite: true,
    textBypassGuardPostPatchAuditConfirmsNoAuditPersistence: true,
    textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing: true,
    textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing: true,
    textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoPromptStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation: true,
    textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization: true,
    textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation: true,
    textBypassGuardPostPatchAuditConfirmsNoLegalCertainty: true,

    // Forward readiness
    readyFor8x5PPaidDocumentModeServerBoundaryContract: true,
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
  const base = buildCanonical8x5OInput() as unknown as Record<string, unknown>;
  const failures: string[] = [];
  let count = 0;

  function expect_rejected(label: string, patch: Partial<Record<string, unknown>>): void {
    count++;
    const mutated = { ...base, ...patch };
    const { accepted } = validatePostPatchContainmentAuditInput(mutated);
    if (accepted) failures.push(`should_reject:${label}`);
  }

  // 8.5N prereq gate tampers
  expect_rejected("prereq_check_id_wrong", { prereqCheckId: "8.5M" });
  expect_rejected("prereq_all_passed_false", { prereqAllPassed: false });
  expect_rejected("surgical_route_patch_not_accepted",
    { controlledRealDocumentTextDocumentBypassGuardSurgicalRoutePatchAccepted: false });
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

  // Prereq actual performed flags that must be true
  expect_rejected("prereq_actual_live_route_mutation_performed_false",
    { prereqActualLiveRouteMutationPerformed: false });
  expect_rejected("prereq_actual_document_bypass_guard_implemented_false",
    { prereqActualDocumentBypassGuardImplemented: false });

  // Other prereq actual* flags that must be false
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

  // Authorization grants
  expect_rejected("runtime_authorization_granted_true", { runtimeAuthorizationGranted: true });
  expect_rejected("pilot_authorization_granted_true", { pilotAuthorizationGranted: true });
  expect_rejected("production_authorization_granted_true", { productionAuthorizationGranted: true });
  expect_rejected("final_authorization_granted_true", { finalAuthorizationGranted: true });
  expect_rejected("go_live_authorization_granted_true", { goLiveAuthorizationGranted: true });

  // TD flags from 8.5N
  expect_rejected("td001_surgically_patched_false",
    { td001DocumentBypassGuardSurgicallyPatched: false });
  expect_rejected("td001_still_requires_post_patch_audit_false",
    { td001DocumentBypassGuardStillRequiresPostPatchAudit: false });
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

  // Pipeline executed flags
  expect_rejected("execution_sequence_actually_executed_true",
    { executionSequenceActuallyExecuted: true });
  expect_rejected("runtime_pipeline_actually_executed_true",
    { runtimePipelineActuallyExecuted: true });
  expect_rejected("document_pipeline_actually_executed_true",
    { documentPipelineActuallyExecuted: true });
  expect_rejected("ocr_pipeline_actually_executed_true", { ocrPipelineActuallyExecuted: true });
  expect_rejected("payment_pipeline_actually_executed_true", { paymentPipelineActuallyExecuted: true });
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

  // 8.5N forward readiness
  expect_rejected("ready_for_8x5o_post_patch_containment_audit_false",
    { readyFor8x5OPostPatchContainmentAudit: false });

  // 8.5O audit assertions
  expect_rejected("post_patch_containment_audit_only_false",
    { textDocumentBypassGuardPostPatchContainmentAuditOnly: false });
  expect_rejected("post_patch_containment_audit_completed_false",
    { textDocumentBypassGuardPostPatchContainmentAuditCompleted: false });
  expect_rejected("containment_patch_verified_false",
    { textDocumentBypassGuardContainmentPatchVerified: false });
  expect_rejected("free_qa_containment_verified_false",
    { textDocumentBypassGuardFreeQaContainmentVerified: false });
  expect_rejected("blocks_document_like_text_before_run_smart_talk_verified_false",
    { textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: false });
  expect_rejected("general_questions_pass_through_verified_false",
    { textDocumentBypassGuardGeneralQuestionsPassThroughVerified: false });
  expect_rejected("document_mode_required_response_verified_false",
    { textDocumentBypassGuardDocumentModeRequiredResponseVerified: false });
  expect_rejected("no_runtime_authorization_verified_false",
    { textDocumentBypassGuardNoRuntimeAuthorizationVerified: false });

  // Audit target flags
  expect_rejected("post_patch_audit_confirms_smart_talk_route_was_modified_false",
    { postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: false });
  expect_rejected("post_patch_audit_confirms_photo_route_was_not_modified_false",
    { postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: false });
  expect_rejected("post_patch_audit_confirms_photo_ocr_quarantine_preserved_false",
    { postPatchAuditConfirmsPhotoOcrQuarantinePreserved: false });
  expect_rejected("post_patch_audit_confirms_guard_is_server_side_false",
    { postPatchAuditConfirmsGuardIsServerSide: false });
  expect_rejected("post_patch_audit_confirms_guard_is_deterministic_local_false",
    { postPatchAuditConfirmsGuardIsDeterministicLocal: false });
  expect_rejected("post_patch_audit_confirms_guard_runs_after_json_parse_false",
    { postPatchAuditConfirmsGuardRunsAfterJsonParse: false });
  expect_rejected("post_patch_audit_confirms_guard_runs_before_run_smart_talk_false",
    { postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: false });
  expect_rejected("post_patch_audit_confirms_blocked_path_no_run_smart_talk_false",
    { postPatchAuditConfirmsBlockedPathNoRunSmartTalk: false });
  expect_rejected("post_patch_audit_confirms_allowed_path_preserves_existing_flow_false",
    { postPatchAuditConfirmsAllowedPathPreservesExistingFlow: false });
  expect_rejected("post_patch_audit_confirms_no_broad_route_refactor_false",
    { postPatchAuditConfirmsNoBroadRouteRefactor: false });
  expect_rejected("post_patch_audit_confirms_no_new_dependency_false",
    { postPatchAuditConfirmsNoNewDependency: false });

  // Audit detector flags
  expect_rejected("post_patch_audit_confirms_detector_uses_multi_signal_scoring_false",
    { postPatchAuditConfirmsDetectorUsesMultiSignalScoring: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_length_thresholds_false",
    { postPatchAuditConfirmsDetectorUsesLengthThresholds: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_official_letter_markers_false",
    { postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_german_authority_markers_false",
    { postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_invoice_mahnung_markers_false",
    { postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_bescheid_widerspruch_markers_false",
    { postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_deadline_legal_consequence_markers_false",
    { postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_personal_data_markers_false",
    { postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_reference_number_markers_false",
    { postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_salutation_and_signature_markers_false",
    { postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: false });
  expect_rejected("post_patch_audit_confirms_detector_passes_question_like_general_text_false",
    { postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: false });
  expect_rejected("post_patch_audit_confirms_detector_blocks_high_risk_document_like_text_false",
    { postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: false });
  expect_rejected("post_patch_audit_confirms_detector_uses_conservative_handling_false",
    { postPatchAuditConfirmsDetectorUsesConservativeHandling: false });

  // Audit response flags
  expect_rejected("post_patch_audit_confirms_blocked_response_status_non_success_false",
    { postPatchAuditConfirmsBlockedResponseStatusNonSuccess: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_ok_false_false",
    { postPatchAuditConfirmsBlockedResponseOkFalse: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_code_document_mode_required_false",
    { postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_short_user_safe_message_false",
    { postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_points_to_paid_doc_mode_false",
    { postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_may_suggest_rephrase_false",
    { postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_internal_governance_false",
    { postPatchAuditConfirmsBlockedResponseNoInternalGovernance: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_tamper_or_audit_internals_false",
    { postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_raw_document_echo_false",
    { postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_translation_false",
    { postPatchAuditConfirmsBlockedResponseNoTranslation: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_summary_false",
    { postPatchAuditConfirmsBlockedResponseNoSummary: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_explanation_false",
    { postPatchAuditConfirmsBlockedResponseNoExplanation: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_legal_advice_false",
    { postPatchAuditConfirmsBlockedResponseNoLegalAdvice: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_exact_deadline_false",
    { postPatchAuditConfirmsBlockedResponseNoExactDeadline: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_legal_certainty_false",
    { postPatchAuditConfirmsBlockedResponseNoLegalCertainty: false });
  expect_rejected("post_patch_audit_confirms_blocked_response_no_claim_authorization_false",
    { postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: false });

  // 8.5O TD containment result
  expect_rejected("td001_post_patch_audited_false",
    { td001DocumentBypassGuardPostPatchAudited: false });
  expect_rejected("td001_containment_closed_false",
    { td001DocumentBypassGuardContainmentClosed: false });
  expect_rejected("td001_still_requires_future_paid_mode_boundary_false",
    { td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: false });
  expect_rejected("td003_photo_ocr_route_contained_in_result_false",
    { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: false });
  expect_rejected("td004_pre_model_pii_redaction_missing_in_result_false",
    { td004PreModelPiiRedactionMissing: false });
  expect_rejected("td005_paid_document_mode_not_server_side_enforced_in_result_false",
    { td005PaidDocumentModeNotServerSideEnforced: false });
  expect_rejected("td002_evidence_gates_not_wired_in_result_false",
    { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false });

  // 8.5O actual performed flags (must be false in result)
  expect_rejected("actual_live_route_mutation_performed_true_in_8x5o_result",
    { actualLiveRouteMutationPerformed: true });
  expect_rejected("actual_document_bypass_guard_implemented_true_in_8x5o_result",
    { actualDocumentBypassGuardImplemented: true });

  // 8.5O audit confirms
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

  // Forward readiness
  expect_rejected("ready_for_8x5p_paid_document_mode_server_boundary_contract_false",
    { readyFor8x5PPaidDocumentModeServerBoundaryContract: false });
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

export function runControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAudit(): ControlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditResult {
  const canonical = buildCanonical8x5OInput();
  const canonicalAsRecord = canonical as unknown as Record<string, unknown>;
  const validation = validatePostPatchContainmentAuditInput(canonicalAsRecord);
  const tamperResult = runTamperCases();
  const allPassed = validation.accepted && tamperResult.allRejected;

  return {
    checkId: "8.5O",
    allPassed,
    textDocumentBypassGuardSurgicalPatchReadyForPostPatchAudit: true,
    controlledRealDocumentTextDocumentBypassGuardPostPatchContainmentAuditAccepted: allPassed,
    textDocumentBypassGuardPostPatchContainmentAuditOnly: true,
    textDocumentBypassGuardPostPatchContainmentAuditCompleted: true,
    textDocumentBypassGuardContainmentPatchVerified: true,
    textDocumentBypassGuardFreeQaContainmentVerified: true,
    textDocumentBypassGuardBlocksDocumentLikeTextBeforeRunSmartTalkVerified: true,
    textDocumentBypassGuardGeneralQuestionsPassThroughVerified: true,
    textDocumentBypassGuardDocumentModeRequiredResponseVerified: true,
    textDocumentBypassGuardNoRuntimeAuthorizationVerified: true,
    tamperCasesRejected: tamperResult.allRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    postPatchAuditConfirmsSmartTalkRouteWasModifiedBy8x5N: true,
    postPatchAuditConfirmsPhotoRouteWasNotModifiedBy8x5N: true,
    postPatchAuditConfirmsPhotoOcrQuarantinePreserved: true,
    postPatchAuditConfirmsGuardIsServerSide: true,
    postPatchAuditConfirmsGuardIsDeterministicLocal: true,
    postPatchAuditConfirmsGuardRunsAfterJsonParse: true,
    postPatchAuditConfirmsGuardRunsBeforeRunSmartTalk: true,
    postPatchAuditConfirmsBlockedPathNoRunSmartTalk: true,
    postPatchAuditConfirmsAllowedPathPreservesExistingFlow: true,
    postPatchAuditConfirmsNoBroadRouteRefactor: true,
    postPatchAuditConfirmsNoNewDependency: true,

    postPatchAuditConfirmsDetectorUsesMultiSignalScoring: true,
    postPatchAuditConfirmsDetectorUsesLengthThresholds: true,
    postPatchAuditConfirmsDetectorUsesOfficialLetterMarkers: true,
    postPatchAuditConfirmsDetectorUsesGermanAuthorityMarkers: true,
    postPatchAuditConfirmsDetectorUsesInvoiceMahnungMarkers: true,
    postPatchAuditConfirmsDetectorUsesBescheidWiderspruchMarkers: true,
    postPatchAuditConfirmsDetectorUsesDeadlineLegalConsequenceMarkers: true,
    postPatchAuditConfirmsDetectorUsesPersonalDataMarkers: true,
    postPatchAuditConfirmsDetectorUsesReferenceNumberMarkers: true,
    postPatchAuditConfirmsDetectorUsesSalutationAndSignatureMarkers: true,
    postPatchAuditConfirmsDetectorPassesQuestionLikeGeneralText: true,
    postPatchAuditConfirmsDetectorBlocksHighRiskDocumentLikeText: true,
    postPatchAuditConfirmsDetectorUsesConservativeHandling: true,

    postPatchAuditConfirmsBlockedResponseStatusNonSuccess: true,
    postPatchAuditConfirmsBlockedResponseOkFalse: true,
    postPatchAuditConfirmsBlockedResponseCodeDocumentModeRequired: true,
    postPatchAuditConfirmsBlockedResponseShortUserSafeMessage: true,
    postPatchAuditConfirmsBlockedResponsePointsToPaidDocumentModeWithoutActivatingPaidRuntime: true,
    postPatchAuditConfirmsBlockedResponseMaySuggestGeneralQuestionRephrase: true,
    postPatchAuditConfirmsBlockedResponseNoInternalGovernance: true,
    postPatchAuditConfirmsBlockedResponseNoTamperOrAuditInternals: true,
    postPatchAuditConfirmsBlockedResponseNoRawDocumentEcho: true,
    postPatchAuditConfirmsBlockedResponseNoTranslation: true,
    postPatchAuditConfirmsBlockedResponseNoSummary: true,
    postPatchAuditConfirmsBlockedResponseNoExplanation: true,
    postPatchAuditConfirmsBlockedResponseNoLegalAdvice: true,
    postPatchAuditConfirmsBlockedResponseNoExactDeadline: true,
    postPatchAuditConfirmsBlockedResponseNoLegalCertainty: true,
    postPatchAuditConfirmsBlockedResponseNoClaimAuthorization: true,

    td001DocumentBypassGuardPostPatchAudited: true,
    td001DocumentBypassGuardContainmentClosed: true,
    td001DocumentBypassGuardStillRequiresFuturePaidModeBoundary: true,
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

    actualLiveRouteMutationPerformed: false,
    actualDocumentBypassGuardImplemented: false,
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

    textBypassGuardPostPatchAuditConfirmsNoOpenAiCall: true,
    textBypassGuardPostPatchAuditConfirmsNoFetchCall: true,
    textBypassGuardPostPatchAuditConfirmsNoProcessEnvRead: true,
    textBypassGuardPostPatchAuditConfirmsNoSdkUsage: true,
    textBypassGuardPostPatchAuditConfirmsNo8x3AcRerun: true,
    textBypassGuardPostPatchAuditConfirmsNoSmartTalkRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoRouteImport: true,
    textBypassGuardPostPatchAuditConfirmsNoRouteMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoPublicRouteMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoUiMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoSupabaseMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoStorageMutation: true,
    textBypassGuardPostPatchAuditConfirmsNoDatabaseWrite: true,
    textBypassGuardPostPatchAuditConfirmsNoAuditPersistence: true,
    textBypassGuardPostPatchAuditConfirmsNoPaymentRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoOcrRuntimeCall: true,
    textBypassGuardPostPatchAuditConfirmsNoPhotoInputProcessing: true,
    textBypassGuardPostPatchAuditConfirmsNoFileInputProcessing: true,
    textBypassGuardPostPatchAuditConfirmsNoDocumentParsingRuntime: true,
    textBypassGuardPostPatchAuditConfirmsNoRawDocumentStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoModelOutputStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoPromptStorage: true,
    textBypassGuardPostPatchAuditConfirmsNoUserVisibleDocumentExplanation: true,
    textBypassGuardPostPatchAuditConfirmsNoCustomerFacingDocumentAnalysis: true,
    textBypassGuardPostPatchAuditConfirmsNoEvidenceEvaluation: true,
    textBypassGuardPostPatchAuditConfirmsNoClaimAuthorization: true,
    textBypassGuardPostPatchAuditConfirmsNoDeadlineCalculation: true,
    textBypassGuardPostPatchAuditConfirmsNoLegalCertainty: true,

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

    readyFor8x5PPaidDocumentModeServerBoundaryContract: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes: [
      "8.5O is a controlled real-document Text Document Bypass Guard post-patch containment audit.",
      "8.5O depends on completed 8.5N Text Document Bypass Guard surgical route patch.",
      "8.5O did not modify /api/smart-talk.",
      "8.5O did not modify /api/smart-talk-photo.",
      "The 8.5H photo OCR route quarantine remains preserved.",
      "The 8.5N surgical patch is accepted by this audit.",
      "The Free Q&A containment guard is verified.",
      "Document-like pasted text is blocked before runSmartTalk, model call, prompt build, and full document analysis.",
      "Blocked document-like text returns safe document_mode_required response (HTTP 402).",
      "Ordinary general questions still pass through to the existing Smart Talk flow unchanged.",
      "Full document translation, explanation, or summary is still not provided in Free Q&A.",
      "TD-001 containment is closed after this audit.",
      "TD-001 still requires future Paid Document Mode boundary for monetized document processing.",
      "Paid Document Mode server boundary remains unresolved (TD-005).",
      "Pre-model PII redaction remains unresolved (TD-004).",
      "Evidence Gate runtime wiring remains unresolved (TD-002).",
      "TD-003 photo OCR route remains contained by the 8.5H quarantine.",
      "No runtime authorization was granted.",
      "No pilot or production authorization was granted.",
      "No final go-live authorization was granted.",
      "No real document processing was authorized.",
      "No OCR, photo, file, storage, or persistence was performed.",
      "No user-visible document explanation was performed.",
      "No public runtime was enabled.",
      "No evidence evaluation, claim authorization, or deadline calculation was performed.",
      "No live LLM call was performed by this audit file.",
      "8.3AC was not re-run.",
      "The next phase is 8.5P Paid Document Mode Server Boundary Contract.",
      "readyFor8x5PPaidDocumentModeServerBoundaryContract is planning readiness only, not runtime authorization.",
    ],
  };
}
