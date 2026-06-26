/**
 * Phase 8.5G — Controlled Real Document Live Route Containment Audit.
 *
 * CONTAINMENT-AUDIT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5F.
 *
 * This file records the live-route technical debt discovered after the 8.5F
 * runtime planning chain. It is:
 *   - containment-audit-only — NOT runtime authorization.
 *   - NOT pilot authorization.
 *   - NOT production authorization.
 *   - NOT final go-live authorization.
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR runtime.
 *   - NOT photo/file upload.
 *   - NOT document storage.
 *   - NOT database persistence.
 *   - NOT audit persistence.
 *   - NOT public runtime.
 *   - NOT actual user-visible output.
 *   - NOT actual evidence evaluation.
 *   - NOT actual claim authorization.
 *   - NOT actual deadline calculation.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call runHighRiskSyntheticLegalDeadlineLiveExecution.
 *   - Import or modify live route files.
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Modify /api/smart-talk or /api/smart-talk-photo.
 *   - Implement Document Bypass Guard.
 *   - Implement Paid Document Mode.
 *   - Implement PII redaction.
 *   - Wire Evidence Gates into runtime.
 *   - Quarantine the photo route.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentRuntimeFinalAuthorizationDecision } from "./run-controlled-real-document-runtime-final-authorization-decision";

// ── Local containment audit input type ───────────────────────────────────────

interface ControlledRealDocumentLiveRouteContainmentAuditInput {
  // 8.5F prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly runtimeIsolationAuditReadyForFinalAuthorizationDecision: boolean;
  readonly controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted: boolean;
  readonly finalAuthorizationDecisionOnly: boolean;
  readonly finalAuthorizationDecisionMade: boolean;
  readonly controlledRealDocumentRuntimePlanningChainClosed: boolean;
  readonly controlledRealDocumentRuntimePlanningChainPassed: boolean;

  // 8.5F authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // 8.5F decision outcome flags (must all be true)
  readonly finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionProductionBlockedUntilSeparateProductionReadinessReview: boolean;
  readonly finalDecisionExplicitGoLiveApprovalStillRequired: boolean;
  readonly finalDecisionManualOperatorConfirmationStillRequired: boolean;
  readonly finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: boolean;
  readonly finalDecisionFeatureFlagMustRemainDefaultOff: boolean;
  readonly finalDecisionKillSwitchMustExistBeforeRuntime: boolean;

  // 8.5F actual* performed flags (must all be false)
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

  // 8.5F finalDecisionConfirmsNo* isolation gates (must all be true)
  readonly finalDecisionConfirmsNoOpenAiCall: boolean;
  readonly finalDecisionConfirmsNoFetchCall: boolean;
  readonly finalDecisionConfirmsNoProcessEnvRead: boolean;
  readonly finalDecisionConfirmsNoSdkUsage: boolean;
  readonly finalDecisionConfirmsNo8x3AcRerun: boolean;
  readonly finalDecisionConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly finalDecisionConfirmsNoBranchCMutation: boolean;
  readonly finalDecisionConfirmsNoPublicRouteMutation: boolean;
  readonly finalDecisionConfirmsNoUiMutation: boolean;
  readonly finalDecisionConfirmsNoSupabaseMutation: boolean;
  readonly finalDecisionConfirmsNoStorageMutation: boolean;
  readonly finalDecisionConfirmsNoDatabaseWrite: boolean;
  readonly finalDecisionConfirmsNoAuditPersistence: boolean;
  readonly finalDecisionConfirmsNoPaymentRuntimeCall: boolean;
  readonly finalDecisionConfirmsNoOcrRuntimeCall: boolean;
  readonly finalDecisionConfirmsNoPhotoInputProcessing: boolean;
  readonly finalDecisionConfirmsNoFileInputProcessing: boolean;
  readonly finalDecisionConfirmsNoDocumentParsing: boolean;
  readonly finalDecisionConfirmsNoRawDocumentStorage: boolean;
  readonly finalDecisionConfirmsNoModelOutputStorage: boolean;
  readonly finalDecisionConfirmsNoPromptStorage: boolean;
  readonly finalDecisionConfirmsNoUserVisibleOutput: boolean;
  readonly finalDecisionConfirmsNoCustomerFacingExplanation: boolean;
  readonly finalDecisionConfirmsNoEvidenceEvaluation: boolean;
  readonly finalDecisionConfirmsNoClaimAuthorization: boolean;
  readonly finalDecisionConfirmsNoDeadlineCalculation: boolean;
  readonly finalDecisionConfirmsNoLegalCertainty: boolean;

  // 8.5F finalDecisionConfirms* boundary gates (must all be true)
  readonly finalDecisionConfirmsFeatureFlagDefaultOffRequired: boolean;
  readonly finalDecisionConfirmsKillSwitchRequiredBeforeRuntime: boolean;
  readonly finalDecisionConfirmsServerSideOnlyProcessingRequired: boolean;
  readonly finalDecisionConfirmsNoClientSideSecretsAllowed: boolean;
  readonly finalDecisionConfirmsNoPersistenceByDefault: boolean;
  readonly finalDecisionConfirmsEphemeralProcessingByDefault: boolean;
  readonly finalDecisionConfirmsRedactionBeforeModelUseRequired: boolean;
  readonly finalDecisionConfirmsOcrOutputUntrusted: boolean;
  readonly finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation: boolean;
  readonly finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay: boolean;
  readonly finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload: boolean;
  readonly finalDecisionConfirmsRateLimitRequiredBeforePublicExposure: boolean;
  readonly finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure: boolean;
  readonly finalDecisionConfirmsAuditTraceNoRawContentRequired: boolean;
  readonly finalDecisionConfirmsFailureNoChargePolicyRequired: boolean;
  readonly finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired: boolean;
  readonly finalDecisionConfirmsExplicitGoLiveApprovalRequired: boolean;
  readonly finalDecisionConfirmsSeparateProductionReadinessReviewRequired: boolean;

  // 8.5F finalDecisionConfirms* commercial gates (must all be true)
  readonly finalDecisionConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly finalDecisionConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly finalDecisionConfirmsFailureNoChargePolicy: boolean;
  readonly finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // 8.5F pipeline executed flags (must all be false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // 8.5F runtime authorization flags (must all be false)
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

  // 8.5F legal safety invariants
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // 8.5F forward readiness
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5G containment audit assertions
  readonly liveRouteContainmentAuditOnly: boolean;
  readonly liveRouteContainmentAuditPerformed: boolean;
  readonly liveRouteContainmentRequiredBeforeRuntimeAuthorization: boolean;
  readonly runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: boolean;
  readonly separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: boolean;

  // Active blocking debt flags (must all be true)
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRoute: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;

  // Active medium debt flags (must all be true)
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;

  // Active low debt flags (must all be true)
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;

  // Closed debt flags
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // Containment requirement flags (must all be true)
  readonly containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime: boolean;
  readonly containmentRequiresTrapDispositionHardeningBeforePilot: boolean;
  readonly containmentRequiresDistributedRateLimitBeforeProduction: boolean;

  // Route containment decision flags
  readonly routeContainmentDecisionRuntimeAuthorizationDeferred: boolean;
  readonly routeContainmentDecision8x6ABlockedUntilContainmentComplete: boolean;
  readonly routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
  readonly routeContainmentDecisionNoLiveRouteMutationIn8x5G: boolean;
  readonly routeContainmentDecisionNoRuntimePathExecutedIn8x5G: boolean;

  // 8.5G actual* implementation/performed flags (must all be false)
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualPhotoRouteQuarantinePerformed: boolean;
  readonly actualDocumentBypassGuardImplemented: boolean;
  readonly actualPaidDocumentModeImplemented: boolean;
  readonly actualPiiRedactionImplemented: boolean;
  readonly actualEvidenceGateRuntimeWiringPerformed: boolean;

  // containmentAuditConfirms* gates (must all be true)
  readonly containmentAuditConfirmsNoOpenAiCall: boolean;
  readonly containmentAuditConfirmsNoFetchCall: boolean;
  readonly containmentAuditConfirmsNoProcessEnvRead: boolean;
  readonly containmentAuditConfirmsNoSdkUsage: boolean;
  readonly containmentAuditConfirmsNo8x3AcRerun: boolean;
  readonly containmentAuditConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoRouteImport: boolean;
  readonly containmentAuditConfirmsNoRouteMutation: boolean;
  readonly containmentAuditConfirmsNoPublicRouteMutation: boolean;
  readonly containmentAuditConfirmsNoUiMutation: boolean;
  readonly containmentAuditConfirmsNoSupabaseMutation: boolean;
  readonly containmentAuditConfirmsNoStorageMutation: boolean;
  readonly containmentAuditConfirmsNoDatabaseWrite: boolean;
  readonly containmentAuditConfirmsNoAuditPersistence: boolean;
  readonly containmentAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoPhotoInputProcessing: boolean;
  readonly containmentAuditConfirmsNoFileInputProcessing: boolean;
  readonly containmentAuditConfirmsNoDocumentParsing: boolean;
  readonly containmentAuditConfirmsNoRawDocumentStorage: boolean;
  readonly containmentAuditConfirmsNoModelOutputStorage: boolean;
  readonly containmentAuditConfirmsNoPromptStorage: boolean;
  readonly containmentAuditConfirmsNoUserVisibleOutput: boolean;
  readonly containmentAuditConfirmsNoCustomerFacingExplanation: boolean;
  readonly containmentAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly containmentAuditConfirmsNoClaimAuthorization: boolean;
  readonly containmentAuditConfirmsNoDeadlineCalculation: boolean;
  readonly containmentAuditConfirmsNoLegalCertainty: boolean;

  // Forward readiness
  readonly readyFor8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentLiveRouteContainmentAuditResult {
  readonly checkId: "8.5G";
  readonly allPassed: boolean;
  readonly runtimeFinalAuthorizationDecisionReadyForLiveRouteContainmentAudit: boolean;
  readonly controlledRealDocumentLiveRouteContainmentAuditAccepted: boolean;
  readonly liveRouteContainmentAuditOnly: true;
  readonly liveRouteContainmentAuditPerformed: true;
  readonly liveRouteContainmentRequiredBeforeRuntimeAuthorization: boolean;
  readonly runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: boolean;
  readonly separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: boolean;
  readonly tamperCasesRejected: boolean;

  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // Active blocking debt flags
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRoute: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;

  // Active medium debt flags
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;

  // Active low debt flags
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;

  // Closed debt flags
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: false;

  // Containment requirement flags
  readonly containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization: boolean;
  readonly containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime: boolean;
  readonly containmentRequiresTrapDispositionHardeningBeforePilot: boolean;
  readonly containmentRequiresDistributedRateLimitBeforeProduction: boolean;

  // Route containment decision flags
  readonly routeContainmentDecisionRuntimeAuthorizationDeferred: boolean;
  readonly routeContainmentDecision8x6ABlockedUntilContainmentComplete: boolean;
  readonly routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
  readonly routeContainmentDecisionNoLiveRouteMutationIn8x5G: boolean;
  readonly routeContainmentDecisionNoRuntimePathExecutedIn8x5G: boolean;

  // Actual performed flags
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
  readonly actualLiveRouteMutationPerformed: false;
  readonly actualPhotoRouteQuarantinePerformed: false;
  readonly actualDocumentBypassGuardImplemented: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;

  // containmentAuditConfirms* gates
  readonly containmentAuditConfirmsNoOpenAiCall: boolean;
  readonly containmentAuditConfirmsNoFetchCall: boolean;
  readonly containmentAuditConfirmsNoProcessEnvRead: boolean;
  readonly containmentAuditConfirmsNoSdkUsage: boolean;
  readonly containmentAuditConfirmsNo8x3AcRerun: boolean;
  readonly containmentAuditConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoRouteImport: boolean;
  readonly containmentAuditConfirmsNoRouteMutation: boolean;
  readonly containmentAuditConfirmsNoPublicRouteMutation: boolean;
  readonly containmentAuditConfirmsNoUiMutation: boolean;
  readonly containmentAuditConfirmsNoSupabaseMutation: boolean;
  readonly containmentAuditConfirmsNoStorageMutation: boolean;
  readonly containmentAuditConfirmsNoDatabaseWrite: boolean;
  readonly containmentAuditConfirmsNoAuditPersistence: boolean;
  readonly containmentAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoPhotoInputProcessing: boolean;
  readonly containmentAuditConfirmsNoFileInputProcessing: boolean;
  readonly containmentAuditConfirmsNoDocumentParsing: boolean;
  readonly containmentAuditConfirmsNoRawDocumentStorage: boolean;
  readonly containmentAuditConfirmsNoModelOutputStorage: boolean;
  readonly containmentAuditConfirmsNoPromptStorage: boolean;
  readonly containmentAuditConfirmsNoUserVisibleOutput: boolean;
  readonly containmentAuditConfirmsNoCustomerFacingExplanation: boolean;
  readonly containmentAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly containmentAuditConfirmsNoClaimAuthorization: boolean;
  readonly containmentAuditConfirmsNoDeadlineCalculation: boolean;
  readonly containmentAuditConfirmsNoLegalCertainty: boolean;

  // Pipeline executed flags
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags
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
  readonly readyFor8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
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

// ── Containment audit input validator ────────────────────────────────────────

function validateContainmentAuditInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5F prerequisite gates
  if (o["prereqCheckId"] !== "8.5F")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted"] !== true)
    reasons.push("final_authorization_decision_not_accepted");
  if (o["finalAuthorizationDecisionOnly"] !== true)
    reasons.push("final_authorization_decision_only_false");
  if (o["finalAuthorizationDecisionMade"] !== true)
    reasons.push("final_authorization_decision_made_false");
  if (o["controlledRealDocumentRuntimePlanningChainClosed"] !== true)
    reasons.push("planning_chain_closed_false");
  if (o["controlledRealDocumentRuntimePlanningChainPassed"] !== true)
    reasons.push("planning_chain_passed_false");

  // 8.5F authorization grants (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");
  if (o["goLiveAuthorizationGranted"] !== false)
    reasons.push("go_live_authorization_granted");

  // 8.5F decision outcome flags (must be true)
  if (o["finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization"] !== true)
    reasons.push("final_decision_runtime_may_proceed_only_after_separate_explicit_authorization_false");
  if (o["finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization"] !== true)
    reasons.push("final_decision_pilot_may_proceed_only_after_separate_explicit_authorization_false");
  if (o["finalDecisionProductionBlockedUntilSeparateProductionReadinessReview"] !== true)
    reasons.push("final_decision_production_blocked_false");
  if (o["finalDecisionExplicitGoLiveApprovalStillRequired"] !== true)
    reasons.push("final_decision_explicit_go_live_approval_still_required_false");
  if (o["finalDecisionManualOperatorConfirmationStillRequired"] !== true)
    reasons.push("final_decision_manual_operator_confirmation_still_required_false");
  if (o["finalDecisionFreshRiskReviewStillRequiredBeforeRuntime"] !== true)
    reasons.push("final_decision_fresh_risk_review_still_required_false");
  if (o["finalDecisionFeatureFlagMustRemainDefaultOff"] !== true)
    reasons.push("final_decision_feature_flag_must_remain_default_off_false");
  if (o["finalDecisionKillSwitchMustExistBeforeRuntime"] !== true)
    reasons.push("final_decision_kill_switch_must_exist_false");

  // 8.5F actual* performed flags (must be false)
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("actual_real_document_input_performed");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("actual_real_document_processing_performed");
  if (o["actualOcrPerformed"] !== false)
    reasons.push("actual_ocr_performed");
  if (o["actualPhotoInputProcessed"] !== false)
    reasons.push("actual_photo_input_processed");
  if (o["actualFileInputProcessed"] !== false)
    reasons.push("actual_file_input_processed");
  if (o["actualDocumentStoragePerformed"] !== false)
    reasons.push("actual_document_storage_performed");
  if (o["actualDatabasePersistencePerformed"] !== false)
    reasons.push("actual_database_persistence_performed");
  if (o["actualAuditPersistencePerformed"] !== false)
    reasons.push("actual_audit_persistence_performed");
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("actual_user_visible_output_performed");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("actual_public_runtime_enabled");
  if (o["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed");

  // 8.5F finalDecisionConfirmsNo* isolation gates (must be true)
  if (o["finalDecisionConfirmsNoOpenAiCall"] !== true)
    reasons.push("final_decision_confirms_no_open_ai_call_false");
  if (o["finalDecisionConfirmsNoFetchCall"] !== true)
    reasons.push("final_decision_confirms_no_fetch_call_false");
  if (o["finalDecisionConfirmsNoProcessEnvRead"] !== true)
    reasons.push("final_decision_confirms_no_process_env_read_false");
  if (o["finalDecisionConfirmsNoSdkUsage"] !== true)
    reasons.push("final_decision_confirms_no_sdk_usage_false");
  if (o["finalDecisionConfirmsNo8x3AcRerun"] !== true)
    reasons.push("final_decision_confirms_no_8x3ac_rerun_false");
  if (o["finalDecisionConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("final_decision_confirms_no_smart_talk_runtime_call_false");
  if (o["finalDecisionConfirmsNoBranchCMutation"] !== true)
    reasons.push("final_decision_confirms_no_branch_c_mutation_false");
  if (o["finalDecisionConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("final_decision_confirms_no_public_route_mutation_false");
  if (o["finalDecisionConfirmsNoUiMutation"] !== true)
    reasons.push("final_decision_confirms_no_ui_mutation_false");
  if (o["finalDecisionConfirmsNoSupabaseMutation"] !== true)
    reasons.push("final_decision_confirms_no_supabase_mutation_false");
  if (o["finalDecisionConfirmsNoStorageMutation"] !== true)
    reasons.push("final_decision_confirms_no_storage_mutation_false");
  if (o["finalDecisionConfirmsNoDatabaseWrite"] !== true)
    reasons.push("final_decision_confirms_no_database_write_false");
  if (o["finalDecisionConfirmsNoAuditPersistence"] !== true)
    reasons.push("final_decision_confirms_no_audit_persistence_false");
  if (o["finalDecisionConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("final_decision_confirms_no_payment_runtime_call_false");
  if (o["finalDecisionConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("final_decision_confirms_no_ocr_runtime_call_false");
  if (o["finalDecisionConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("final_decision_confirms_no_photo_input_processing_false");
  if (o["finalDecisionConfirmsNoFileInputProcessing"] !== true)
    reasons.push("final_decision_confirms_no_file_input_processing_false");
  if (o["finalDecisionConfirmsNoDocumentParsing"] !== true)
    reasons.push("final_decision_confirms_no_document_parsing_false");
  if (o["finalDecisionConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("final_decision_confirms_no_raw_document_storage_false");
  if (o["finalDecisionConfirmsNoModelOutputStorage"] !== true)
    reasons.push("final_decision_confirms_no_model_output_storage_false");
  if (o["finalDecisionConfirmsNoPromptStorage"] !== true)
    reasons.push("final_decision_confirms_no_prompt_storage_false");
  if (o["finalDecisionConfirmsNoUserVisibleOutput"] !== true)
    reasons.push("final_decision_confirms_no_user_visible_output_false");
  if (o["finalDecisionConfirmsNoCustomerFacingExplanation"] !== true)
    reasons.push("final_decision_confirms_no_customer_facing_explanation_false");
  if (o["finalDecisionConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("final_decision_confirms_no_evidence_evaluation_false");
  if (o["finalDecisionConfirmsNoClaimAuthorization"] !== true)
    reasons.push("final_decision_confirms_no_claim_authorization_false");
  if (o["finalDecisionConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("final_decision_confirms_no_deadline_calculation_false");
  if (o["finalDecisionConfirmsNoLegalCertainty"] !== true)
    reasons.push("final_decision_confirms_no_legal_certainty_false");

  // 8.5F finalDecisionConfirms* boundary gates (must be true)
  if (o["finalDecisionConfirmsFeatureFlagDefaultOffRequired"] !== true)
    reasons.push("final_decision_confirms_feature_flag_default_off_required_false");
  if (o["finalDecisionConfirmsKillSwitchRequiredBeforeRuntime"] !== true)
    reasons.push("final_decision_confirms_kill_switch_required_false");
  if (o["finalDecisionConfirmsServerSideOnlyProcessingRequired"] !== true)
    reasons.push("final_decision_confirms_server_side_only_processing_required_false");
  if (o["finalDecisionConfirmsNoClientSideSecretsAllowed"] !== true)
    reasons.push("final_decision_confirms_no_client_side_secrets_allowed_false");
  if (o["finalDecisionConfirmsNoPersistenceByDefault"] !== true)
    reasons.push("final_decision_confirms_no_persistence_by_default_false");
  if (o["finalDecisionConfirmsEphemeralProcessingByDefault"] !== true)
    reasons.push("final_decision_confirms_ephemeral_processing_by_default_false");
  if (o["finalDecisionConfirmsRedactionBeforeModelUseRequired"] !== true)
    reasons.push("final_decision_confirms_redaction_before_model_use_required_false");
  if (o["finalDecisionConfirmsOcrOutputUntrusted"] !== true)
    reasons.push("final_decision_confirms_ocr_output_untrusted_false");
  if (o["finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation"] !== true)
    reasons.push("final_decision_confirms_evidence_gates_required_false");
  if (o["finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay"] !== true)
    reasons.push("final_decision_confirms_user_visible_output_contract_required_false");
  if (o["finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload"] !== true)
    reasons.push("final_decision_confirms_privacy_notice_required_false");
  if (o["finalDecisionConfirmsRateLimitRequiredBeforePublicExposure"] !== true)
    reasons.push("final_decision_confirms_rate_limit_required_false");
  if (o["finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure"] !== true)
    reasons.push("final_decision_confirms_abuse_detection_required_false");
  if (o["finalDecisionConfirmsAuditTraceNoRawContentRequired"] !== true)
    reasons.push("final_decision_confirms_audit_trace_no_raw_content_required_false");
  if (o["finalDecisionConfirmsFailureNoChargePolicyRequired"] !== true)
    reasons.push("final_decision_confirms_failure_no_charge_policy_required_false");
  if (o["finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired"] !== true)
    reasons.push("final_decision_confirms_manual_operator_confirmation_required_false");
  if (o["finalDecisionConfirmsExplicitGoLiveApprovalRequired"] !== true)
    reasons.push("final_decision_confirms_explicit_go_live_approval_required_false");
  if (o["finalDecisionConfirmsSeparateProductionReadinessReviewRequired"] !== true)
    reasons.push("final_decision_confirms_separate_production_readiness_review_required_false");

  // 8.5F finalDecisionConfirms* commercial gates (must be true)
  if (o["finalDecisionConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("final_decision_confirms_free_question_mode_remains_free_false");
  if (o["finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("final_decision_confirms_paid_document_mode_required_for_full_explanation_false");
  if (o["finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation"] !== true)
    reasons.push("final_decision_confirms_paid_document_mode_required_for_photo_explanation_false");
  if (o["finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa"] !== true)
    reasons.push("final_decision_confirms_document_bypass_guard_required_false");
  if (o["finalDecisionConfirmsFullDocumentRedirectFromFreeQa"] !== true)
    reasons.push("final_decision_confirms_full_document_redirect_from_free_qa_false");
  if (o["finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("final_decision_confirms_payment_boundary_before_full_explanation_false");
  if (o["finalDecisionConfirmsFailureNoChargePolicy"] !== true)
    reasons.push("final_decision_confirms_failure_no_charge_policy_false");
  if (o["finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("final_decision_confirms_payment_does_not_override_safety_blocks_false");
  if (o["finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid"] !== true)
    reasons.push("final_decision_confirms_high_risk_safety_contract_even_when_paid_false");

  // 8.5F pipeline executed flags (must be false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("execution_sequence_actually_executed");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("runtime_pipeline_actually_executed");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("document_pipeline_actually_executed");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("ocr_pipeline_actually_executed");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("payment_pipeline_actually_executed");
  if (o["userVisiblePipelineActuallyExecuted"] !== false)
    reasons.push("user_visible_pipeline_actually_executed");

  // 8.5F runtime authorization flags (must be false)
  if (o["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (o["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (o["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (o["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (o["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (o["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (o["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (o["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (o["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (o["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (o["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (o["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (o["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (o["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety invariants
  if (o["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (o["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (o["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (o["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (o["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (o["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_required_for_exact_deadline_false");

  // 8.5F forward readiness
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_separate_runtime_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_pilot_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_production_authorization_phase_not_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input_not_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output_not_false");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled_not_false");
  if (o["persistenceUsed"] !== false)
    reasons.push("persistence_used_not_false");
  if (o["neverUserVisible"] !== true)
    reasons.push("never_user_visible_false");

  // 8.5G containment audit assertions
  if (o["liveRouteContainmentAuditOnly"] !== true)
    reasons.push("live_route_containment_audit_only_false");
  if (o["liveRouteContainmentAuditPerformed"] !== true)
    reasons.push("live_route_containment_audit_performed_false");
  if (o["liveRouteContainmentRequiredBeforeRuntimeAuthorization"] !== true)
    reasons.push("live_route_containment_required_before_runtime_authorization_false");
  if (o["runtimeAuthorizationMustRemainBlockedUntilContainmentResolved"] !== true)
    reasons.push("runtime_authorization_must_remain_blocked_false");
  if (o["separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment"] !== true)
    reasons.push("separate_runtime_authorization_phase_must_not_start_false");

  // Active blocking debt flags (must be true)
  if (o["td001DocumentBypassGuardMissingInLiveSmartTalkRoute"] !== true)
    reasons.push("td001_document_bypass_guard_missing_false");
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization"] !== true)
    reasons.push("td003_photo_ocr_route_live_ahead_of_governance_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");

  // Active medium debt flags (must be true)
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true)
    reasons.push("td006_evidence_gate_todo_and_or_semantics_unresolved_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("td007_trap_claim_disposition_namespace_hardening_unresolved_false");

  // Active low debt flags (must be true)
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("td008_in_memory_rate_limiter_serverless_unsafe_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("td010_get_user_state_document_type_todo_open_false");

  // Closed debt flags
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree");

  // Containment requirement flags (must be true)
  if (o["containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization"] !== true)
    reasons.push("containment_requires_photo_ocr_route_quarantine_false");
  if (o["containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization"] !== true)
    reasons.push("containment_requires_document_bypass_guard_false");
  if (o["containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization"] !== true)
    reasons.push("containment_requires_paid_document_mode_boundary_false");
  if (o["containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization"] !== true)
    reasons.push("containment_requires_pre_model_pii_redaction_false");
  if (o["containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime"] !== true)
    reasons.push("containment_requires_evidence_gate_runtime_wiring_false");
  if (o["containmentRequiresTrapDispositionHardeningBeforePilot"] !== true)
    reasons.push("containment_requires_trap_disposition_hardening_false");
  if (o["containmentRequiresDistributedRateLimitBeforeProduction"] !== true)
    reasons.push("containment_requires_distributed_rate_limit_false");

  // Route containment decision flags (must be true)
  if (o["routeContainmentDecisionRuntimeAuthorizationDeferred"] !== true)
    reasons.push("route_containment_decision_runtime_authorization_deferred_false");
  if (o["routeContainmentDecision8x6ABlockedUntilContainmentComplete"] !== true)
    reasons.push("route_containment_decision_8x6a_blocked_false");
  if (o["routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine"] !== true)
    reasons.push("route_containment_decision_next_phase_8x5h_false");
  if (o["routeContainmentDecisionNoLiveRouteMutationIn8x5G"] !== true)
    reasons.push("route_containment_decision_no_live_route_mutation_false");
  if (o["routeContainmentDecisionNoRuntimePathExecutedIn8x5G"] !== true)
    reasons.push("route_containment_decision_no_runtime_path_executed_false");

  // 8.5G actual* implementation/performed flags (must be false)
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed");
  if (o["actualPhotoRouteQuarantinePerformed"] !== false)
    reasons.push("actual_photo_route_quarantine_performed");
  if (o["actualDocumentBypassGuardImplemented"] !== false)
    reasons.push("actual_document_bypass_guard_implemented");
  if (o["actualPaidDocumentModeImplemented"] !== false)
    reasons.push("actual_paid_document_mode_implemented");
  if (o["actualPiiRedactionImplemented"] !== false)
    reasons.push("actual_pii_redaction_implemented");
  if (o["actualEvidenceGateRuntimeWiringPerformed"] !== false)
    reasons.push("actual_evidence_gate_runtime_wiring_performed");

  // containmentAuditConfirms* gates (must be true)
  if (o["containmentAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("containment_audit_confirms_no_open_ai_call_false");
  if (o["containmentAuditConfirmsNoFetchCall"] !== true)
    reasons.push("containment_audit_confirms_no_fetch_call_false");
  if (o["containmentAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("containment_audit_confirms_no_process_env_read_false");
  if (o["containmentAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("containment_audit_confirms_no_sdk_usage_false");
  if (o["containmentAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("containment_audit_confirms_no_8x3ac_rerun_false");
  if (o["containmentAuditConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_smart_talk_runtime_call_false");
  if (o["containmentAuditConfirmsNoRouteImport"] !== true)
    reasons.push("containment_audit_confirms_no_route_import_false");
  if (o["containmentAuditConfirmsNoRouteMutation"] !== true)
    reasons.push("containment_audit_confirms_no_route_mutation_false");
  if (o["containmentAuditConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("containment_audit_confirms_no_public_route_mutation_false");
  if (o["containmentAuditConfirmsNoUiMutation"] !== true)
    reasons.push("containment_audit_confirms_no_ui_mutation_false");
  if (o["containmentAuditConfirmsNoSupabaseMutation"] !== true)
    reasons.push("containment_audit_confirms_no_supabase_mutation_false");
  if (o["containmentAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("containment_audit_confirms_no_storage_mutation_false");
  if (o["containmentAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("containment_audit_confirms_no_database_write_false");
  if (o["containmentAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("containment_audit_confirms_no_audit_persistence_false");
  if (o["containmentAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_payment_runtime_call_false");
  if (o["containmentAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_ocr_runtime_call_false");
  if (o["containmentAuditConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("containment_audit_confirms_no_photo_input_processing_false");
  if (o["containmentAuditConfirmsNoFileInputProcessing"] !== true)
    reasons.push("containment_audit_confirms_no_file_input_processing_false");
  if (o["containmentAuditConfirmsNoDocumentParsing"] !== true)
    reasons.push("containment_audit_confirms_no_document_parsing_false");
  if (o["containmentAuditConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("containment_audit_confirms_no_raw_document_storage_false");
  if (o["containmentAuditConfirmsNoModelOutputStorage"] !== true)
    reasons.push("containment_audit_confirms_no_model_output_storage_false");
  if (o["containmentAuditConfirmsNoPromptStorage"] !== true)
    reasons.push("containment_audit_confirms_no_prompt_storage_false");
  if (o["containmentAuditConfirmsNoUserVisibleOutput"] !== true)
    reasons.push("containment_audit_confirms_no_user_visible_output_false");
  if (o["containmentAuditConfirmsNoCustomerFacingExplanation"] !== true)
    reasons.push("containment_audit_confirms_no_customer_facing_explanation_false");
  if (o["containmentAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("containment_audit_confirms_no_evidence_evaluation_false");
  if (o["containmentAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("containment_audit_confirms_no_claim_authorization_false");
  if (o["containmentAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("containment_audit_confirms_no_deadline_calculation_false");
  if (o["containmentAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("containment_audit_confirms_no_legal_certainty_false");

  // Forward readiness
  if (o["readyFor8x5HPhotoOcrRouteRuntimeQuarantine"] !== true)
    reasons.push("ready_for_8x5h_photo_ocr_route_runtime_quarantine_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main function ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentLiveRouteContainmentAudit(): ControlledRealDocumentLiveRouteContainmentAuditResult {

  // ── Step 1: Consume 8.5F result ───────────────────────────────────────────
  const finalDecisionResult = runControlledRealDocumentRuntimeFinalAuthorizationDecision();

  const prereqAllPassed = finalDecisionResult.allPassed;
  const prereqReady =
    finalDecisionResult.controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted &&
    finalDecisionResult.controlledRealDocumentRuntimePlanningChainClosed &&
    finalDecisionResult.controlledRealDocumentRuntimePlanningChainPassed &&
    finalDecisionResult.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase;

  // ── Step 2: Build canonical containment audit input ───────────────────────
  const canonicalInput: ControlledRealDocumentLiveRouteContainmentAuditInput = {
    prereqCheckId: finalDecisionResult.checkId,
    prereqAllPassed,
    runtimeIsolationAuditReadyForFinalAuthorizationDecision:
      finalDecisionResult.runtimeIsolationAuditReadyForFinalAuthorizationDecision,
    controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted:
      finalDecisionResult.controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted,
    finalAuthorizationDecisionOnly: finalDecisionResult.finalAuthorizationDecisionOnly,
    finalAuthorizationDecisionMade: finalDecisionResult.finalAuthorizationDecisionMade,
    controlledRealDocumentRuntimePlanningChainClosed:
      finalDecisionResult.controlledRealDocumentRuntimePlanningChainClosed,
    controlledRealDocumentRuntimePlanningChainPassed:
      finalDecisionResult.controlledRealDocumentRuntimePlanningChainPassed,

    runtimeAuthorizationGranted: finalDecisionResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: finalDecisionResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: finalDecisionResult.productionAuthorizationGranted,
    finalAuthorizationGranted: finalDecisionResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: finalDecisionResult.goLiveAuthorizationGranted,

    finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization:
      finalDecisionResult.finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization,
    finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization:
      finalDecisionResult.finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization,
    finalDecisionProductionBlockedUntilSeparateProductionReadinessReview:
      finalDecisionResult.finalDecisionProductionBlockedUntilSeparateProductionReadinessReview,
    finalDecisionExplicitGoLiveApprovalStillRequired:
      finalDecisionResult.finalDecisionExplicitGoLiveApprovalStillRequired,
    finalDecisionManualOperatorConfirmationStillRequired:
      finalDecisionResult.finalDecisionManualOperatorConfirmationStillRequired,
    finalDecisionFreshRiskReviewStillRequiredBeforeRuntime:
      finalDecisionResult.finalDecisionFreshRiskReviewStillRequiredBeforeRuntime,
    finalDecisionFeatureFlagMustRemainDefaultOff:
      finalDecisionResult.finalDecisionFeatureFlagMustRemainDefaultOff,
    finalDecisionKillSwitchMustExistBeforeRuntime:
      finalDecisionResult.finalDecisionKillSwitchMustExistBeforeRuntime,

    actualRealDocumentInputPerformed: finalDecisionResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed: finalDecisionResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: finalDecisionResult.actualOcrPerformed,
    actualPhotoInputProcessed: finalDecisionResult.actualPhotoInputProcessed,
    actualFileInputProcessed: finalDecisionResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: finalDecisionResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: finalDecisionResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: finalDecisionResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: finalDecisionResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: finalDecisionResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: finalDecisionResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: finalDecisionResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: finalDecisionResult.actualDeadlineCalculationPerformed,

    finalDecisionConfirmsNoOpenAiCall: finalDecisionResult.finalDecisionConfirmsNoOpenAiCall,
    finalDecisionConfirmsNoFetchCall: finalDecisionResult.finalDecisionConfirmsNoFetchCall,
    finalDecisionConfirmsNoProcessEnvRead: finalDecisionResult.finalDecisionConfirmsNoProcessEnvRead,
    finalDecisionConfirmsNoSdkUsage: finalDecisionResult.finalDecisionConfirmsNoSdkUsage,
    finalDecisionConfirmsNo8x3AcRerun: finalDecisionResult.finalDecisionConfirmsNo8x3AcRerun,
    finalDecisionConfirmsNoSmartTalkRuntimeCall:
      finalDecisionResult.finalDecisionConfirmsNoSmartTalkRuntimeCall,
    finalDecisionConfirmsNoBranchCMutation:
      finalDecisionResult.finalDecisionConfirmsNoBranchCMutation,
    finalDecisionConfirmsNoPublicRouteMutation:
      finalDecisionResult.finalDecisionConfirmsNoPublicRouteMutation,
    finalDecisionConfirmsNoUiMutation: finalDecisionResult.finalDecisionConfirmsNoUiMutation,
    finalDecisionConfirmsNoSupabaseMutation:
      finalDecisionResult.finalDecisionConfirmsNoSupabaseMutation,
    finalDecisionConfirmsNoStorageMutation:
      finalDecisionResult.finalDecisionConfirmsNoStorageMutation,
    finalDecisionConfirmsNoDatabaseWrite: finalDecisionResult.finalDecisionConfirmsNoDatabaseWrite,
    finalDecisionConfirmsNoAuditPersistence:
      finalDecisionResult.finalDecisionConfirmsNoAuditPersistence,
    finalDecisionConfirmsNoPaymentRuntimeCall:
      finalDecisionResult.finalDecisionConfirmsNoPaymentRuntimeCall,
    finalDecisionConfirmsNoOcrRuntimeCall: finalDecisionResult.finalDecisionConfirmsNoOcrRuntimeCall,
    finalDecisionConfirmsNoPhotoInputProcessing:
      finalDecisionResult.finalDecisionConfirmsNoPhotoInputProcessing,
    finalDecisionConfirmsNoFileInputProcessing:
      finalDecisionResult.finalDecisionConfirmsNoFileInputProcessing,
    finalDecisionConfirmsNoDocumentParsing:
      finalDecisionResult.finalDecisionConfirmsNoDocumentParsing,
    finalDecisionConfirmsNoRawDocumentStorage:
      finalDecisionResult.finalDecisionConfirmsNoRawDocumentStorage,
    finalDecisionConfirmsNoModelOutputStorage:
      finalDecisionResult.finalDecisionConfirmsNoModelOutputStorage,
    finalDecisionConfirmsNoPromptStorage: finalDecisionResult.finalDecisionConfirmsNoPromptStorage,
    finalDecisionConfirmsNoUserVisibleOutput:
      finalDecisionResult.finalDecisionConfirmsNoUserVisibleOutput,
    finalDecisionConfirmsNoCustomerFacingExplanation:
      finalDecisionResult.finalDecisionConfirmsNoCustomerFacingExplanation,
    finalDecisionConfirmsNoEvidenceEvaluation:
      finalDecisionResult.finalDecisionConfirmsNoEvidenceEvaluation,
    finalDecisionConfirmsNoClaimAuthorization:
      finalDecisionResult.finalDecisionConfirmsNoClaimAuthorization,
    finalDecisionConfirmsNoDeadlineCalculation:
      finalDecisionResult.finalDecisionConfirmsNoDeadlineCalculation,
    finalDecisionConfirmsNoLegalCertainty: finalDecisionResult.finalDecisionConfirmsNoLegalCertainty,

    finalDecisionConfirmsFeatureFlagDefaultOffRequired:
      finalDecisionResult.finalDecisionConfirmsFeatureFlagDefaultOffRequired,
    finalDecisionConfirmsKillSwitchRequiredBeforeRuntime:
      finalDecisionResult.finalDecisionConfirmsKillSwitchRequiredBeforeRuntime,
    finalDecisionConfirmsServerSideOnlyProcessingRequired:
      finalDecisionResult.finalDecisionConfirmsServerSideOnlyProcessingRequired,
    finalDecisionConfirmsNoClientSideSecretsAllowed:
      finalDecisionResult.finalDecisionConfirmsNoClientSideSecretsAllowed,
    finalDecisionConfirmsNoPersistenceByDefault:
      finalDecisionResult.finalDecisionConfirmsNoPersistenceByDefault,
    finalDecisionConfirmsEphemeralProcessingByDefault:
      finalDecisionResult.finalDecisionConfirmsEphemeralProcessingByDefault,
    finalDecisionConfirmsRedactionBeforeModelUseRequired:
      finalDecisionResult.finalDecisionConfirmsRedactionBeforeModelUseRequired,
    finalDecisionConfirmsOcrOutputUntrusted:
      finalDecisionResult.finalDecisionConfirmsOcrOutputUntrusted,
    finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation:
      finalDecisionResult.finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation,
    finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      finalDecisionResult.finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay,
    finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload:
      finalDecisionResult.finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload,
    finalDecisionConfirmsRateLimitRequiredBeforePublicExposure:
      finalDecisionResult.finalDecisionConfirmsRateLimitRequiredBeforePublicExposure,
    finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure:
      finalDecisionResult.finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure,
    finalDecisionConfirmsAuditTraceNoRawContentRequired:
      finalDecisionResult.finalDecisionConfirmsAuditTraceNoRawContentRequired,
    finalDecisionConfirmsFailureNoChargePolicyRequired:
      finalDecisionResult.finalDecisionConfirmsFailureNoChargePolicyRequired,
    finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired:
      finalDecisionResult.finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired,
    finalDecisionConfirmsExplicitGoLiveApprovalRequired:
      finalDecisionResult.finalDecisionConfirmsExplicitGoLiveApprovalRequired,
    finalDecisionConfirmsSeparateProductionReadinessReviewRequired:
      finalDecisionResult.finalDecisionConfirmsSeparateProductionReadinessReviewRequired,

    finalDecisionConfirmsFreeQuestionModeRemainsFree:
      finalDecisionResult.finalDecisionConfirmsFreeQuestionModeRemainsFree,
    finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation:
      finalDecisionResult.finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation,
    finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      finalDecisionResult.finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa:
      finalDecisionResult.finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa,
    finalDecisionConfirmsFullDocumentRedirectFromFreeQa:
      finalDecisionResult.finalDecisionConfirmsFullDocumentRedirectFromFreeQa,
    finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation:
      finalDecisionResult.finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation,
    finalDecisionConfirmsFailureNoChargePolicy:
      finalDecisionResult.finalDecisionConfirmsFailureNoChargePolicy,
    finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks:
      finalDecisionResult.finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks,
    finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid:
      finalDecisionResult.finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid,

    executionSequenceActuallyExecuted: finalDecisionResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: finalDecisionResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: finalDecisionResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: finalDecisionResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: finalDecisionResult.paymentPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: finalDecisionResult.userVisiblePipelineActuallyExecuted,

    realDocumentInputAuthorizedNow: finalDecisionResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: finalDecisionResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: finalDecisionResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: finalDecisionResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: finalDecisionResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: finalDecisionResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: finalDecisionResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: finalDecisionResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: finalDecisionResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      finalDecisionResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: finalDecisionResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: finalDecisionResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: finalDecisionResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: finalDecisionResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized: finalDecisionResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: finalDecisionResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: finalDecisionResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: finalDecisionResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: finalDecisionResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: finalDecisionResult.deliveryDateRequiredForExactDeadline,

    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase:
      finalDecisionResult.readyForControlledRealDocumentPilotAuthorizationPhase,
    readyForControlledRealDocumentProductionAuthorizationPhase:
      finalDecisionResult.readyForControlledRealDocumentProductionAuthorizationPhase,
    readyForRealDocumentInput: finalDecisionResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: finalDecisionResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: finalDecisionResult.publicRuntimeEnabled,
    persistenceUsed: finalDecisionResult.persistenceUsed,
    neverUserVisible: finalDecisionResult.neverUserVisible,

    // 8.5G containment assertions (derived from prerequisite passing)
    liveRouteContainmentAuditOnly: true,
    liveRouteContainmentAuditPerformed: true,
    liveRouteContainmentRequiredBeforeRuntimeAuthorization: prereqAllPassed && prereqReady,
    runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: prereqAllPassed && prereqReady,
    separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: prereqAllPassed && prereqReady,

    // Active blocking debt flags
    td001DocumentBypassGuardMissingInLiveSmartTalkRoute: prereqAllPassed && prereqReady,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: prereqAllPassed && prereqReady,
    td004PreModelPiiRedactionMissing: prereqAllPassed && prereqReady,
    td005PaidDocumentModeNotServerSideEnforced: prereqAllPassed && prereqReady,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: prereqAllPassed && prereqReady,

    // Active medium debt flags
    td006EvidenceGateTodoAndOrSemanticsUnresolved: prereqAllPassed && prereqReady,
    td007TrapClaimDispositionNamespaceHardeningUnresolved: prereqAllPassed && prereqReady,

    // Active low debt flags
    td008InMemoryRateLimiterServerlessUnsafe: prereqAllPassed && prereqReady,
    td010GetUserStateDocumentTypeTodoOpen: prereqAllPassed && prereqReady,

    // Closed debt flags
    td009TmpDebugRunnerDebtClosed: true,
    tmpFilesPresentInWorkingTree: false,

    // Containment requirement flags
    containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization:
      prereqAllPassed && prereqReady,
    containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization: prereqAllPassed && prereqReady,
    containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization:
      prereqAllPassed && prereqReady,
    containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization: prereqAllPassed && prereqReady,
    containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime: prereqAllPassed && prereqReady,
    containmentRequiresTrapDispositionHardeningBeforePilot: prereqAllPassed && prereqReady,
    containmentRequiresDistributedRateLimitBeforeProduction: prereqAllPassed && prereqReady,

    // Route containment decision flags
    routeContainmentDecisionRuntimeAuthorizationDeferred: prereqAllPassed && prereqReady,
    routeContainmentDecision8x6ABlockedUntilContainmentComplete: prereqAllPassed && prereqReady,
    routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine:
      prereqAllPassed && prereqReady,
    routeContainmentDecisionNoLiveRouteMutationIn8x5G: true,
    routeContainmentDecisionNoRuntimePathExecutedIn8x5G: true,

    // 8.5G actual* implementation/performed flags (always false — never implemented here)
    actualLiveRouteMutationPerformed: false,
    actualPhotoRouteQuarantinePerformed: false,
    actualDocumentBypassGuardImplemented: false,
    actualPaidDocumentModeImplemented: false,
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    // containmentAuditConfirms* gates
    containmentAuditConfirmsNoOpenAiCall: true,
    containmentAuditConfirmsNoFetchCall: true,
    containmentAuditConfirmsNoProcessEnvRead: true,
    containmentAuditConfirmsNoSdkUsage: true,
    containmentAuditConfirmsNo8x3AcRerun: true,
    containmentAuditConfirmsNoSmartTalkRuntimeCall: true,
    containmentAuditConfirmsNoRouteImport: true,
    containmentAuditConfirmsNoRouteMutation: true,
    containmentAuditConfirmsNoPublicRouteMutation: true,
    containmentAuditConfirmsNoUiMutation: true,
    containmentAuditConfirmsNoSupabaseMutation: true,
    containmentAuditConfirmsNoStorageMutation: true,
    containmentAuditConfirmsNoDatabaseWrite: true,
    containmentAuditConfirmsNoAuditPersistence: true,
    containmentAuditConfirmsNoPaymentRuntimeCall: true,
    containmentAuditConfirmsNoOcrRuntimeCall: true,
    containmentAuditConfirmsNoPhotoInputProcessing: true,
    containmentAuditConfirmsNoFileInputProcessing: true,
    containmentAuditConfirmsNoDocumentParsing: true,
    containmentAuditConfirmsNoRawDocumentStorage: true,
    containmentAuditConfirmsNoModelOutputStorage: true,
    containmentAuditConfirmsNoPromptStorage: true,
    containmentAuditConfirmsNoUserVisibleOutput: true,
    containmentAuditConfirmsNoCustomerFacingExplanation: true,
    containmentAuditConfirmsNoEvidenceEvaluation: true,
    containmentAuditConfirmsNoClaimAuthorization: true,
    containmentAuditConfirmsNoDeadlineCalculation: true,
    containmentAuditConfirmsNoLegalCertainty: true,

    readyFor8x5HPhotoOcrRouteRuntimeQuarantine: prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical containment audit input ────────────────────
  const auditValidation = validateContainmentAuditInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const auditAccepted = auditValidation.accepted;

  // ── Step 4: Tamper tests ──────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5F checkId wrong", override: { prereqCheckId: "8.5E" } },
    { label: "8.5F allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted false", override: { controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted: false } },
    { label: "finalAuthorizationDecisionOnly false", override: { finalAuthorizationDecisionOnly: false } },
    { label: "finalAuthorizationDecisionMade false", override: { finalAuthorizationDecisionMade: false } },
    { label: "controlledRealDocumentRuntimePlanningChainClosed false", override: { controlledRealDocumentRuntimePlanningChainClosed: false } },
    { label: "controlledRealDocumentRuntimePlanningChainPassed false", override: { controlledRealDocumentRuntimePlanningChainPassed: false } },
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
    { label: "goLiveAuthorizationGranted true", override: { goLiveAuthorizationGranted: true } },
    { label: "finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization false", override: { finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization: false } },
    { label: "finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization false", override: { finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization: false } },
    { label: "finalDecisionProductionBlockedUntilSeparateProductionReadinessReview false", override: { finalDecisionProductionBlockedUntilSeparateProductionReadinessReview: false } },
    { label: "finalDecisionExplicitGoLiveApprovalStillRequired false", override: { finalDecisionExplicitGoLiveApprovalStillRequired: false } },
    { label: "finalDecisionManualOperatorConfirmationStillRequired false", override: { finalDecisionManualOperatorConfirmationStillRequired: false } },
    { label: "finalDecisionFreshRiskReviewStillRequiredBeforeRuntime false", override: { finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: false } },
    { label: "finalDecisionFeatureFlagMustRemainDefaultOff false", override: { finalDecisionFeatureFlagMustRemainDefaultOff: false } },
    { label: "finalDecisionKillSwitchMustExistBeforeRuntime false", override: { finalDecisionKillSwitchMustExistBeforeRuntime: false } },
    { label: "actualRealDocumentInputPerformed true", override: { actualRealDocumentInputPerformed: true } },
    { label: "actualRealDocumentProcessingPerformed true", override: { actualRealDocumentProcessingPerformed: true } },
    { label: "actualOcrPerformed true", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true", override: { actualAuditPersistencePerformed: true } },
    { label: "actualUserVisibleOutputPerformed true", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualEvidenceEvaluationPerformed true", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true", override: { actualDeadlineCalculationPerformed: true } },
    { label: "finalDecisionConfirmsNoOpenAiCall false", override: { finalDecisionConfirmsNoOpenAiCall: false } },
    { label: "finalDecisionConfirmsNoFetchCall false", override: { finalDecisionConfirmsNoFetchCall: false } },
    { label: "finalDecisionConfirmsNoProcessEnvRead false", override: { finalDecisionConfirmsNoProcessEnvRead: false } },
    { label: "finalDecisionConfirmsNoSdkUsage false", override: { finalDecisionConfirmsNoSdkUsage: false } },
    { label: "finalDecisionConfirmsNo8x3AcRerun false", override: { finalDecisionConfirmsNo8x3AcRerun: false } },
    { label: "finalDecisionConfirmsNoSmartTalkRuntimeCall false", override: { finalDecisionConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "finalDecisionConfirmsNoBranchCMutation false", override: { finalDecisionConfirmsNoBranchCMutation: false } },
    { label: "finalDecisionConfirmsNoPublicRouteMutation false", override: { finalDecisionConfirmsNoPublicRouteMutation: false } },
    { label: "finalDecisionConfirmsNoUiMutation false", override: { finalDecisionConfirmsNoUiMutation: false } },
    { label: "finalDecisionConfirmsNoSupabaseMutation false", override: { finalDecisionConfirmsNoSupabaseMutation: false } },
    { label: "finalDecisionConfirmsNoStorageMutation false", override: { finalDecisionConfirmsNoStorageMutation: false } },
    { label: "finalDecisionConfirmsNoDatabaseWrite false", override: { finalDecisionConfirmsNoDatabaseWrite: false } },
    { label: "finalDecisionConfirmsNoAuditPersistence false", override: { finalDecisionConfirmsNoAuditPersistence: false } },
    { label: "finalDecisionConfirmsNoPaymentRuntimeCall false", override: { finalDecisionConfirmsNoPaymentRuntimeCall: false } },
    { label: "finalDecisionConfirmsNoOcrRuntimeCall false", override: { finalDecisionConfirmsNoOcrRuntimeCall: false } },
    { label: "finalDecisionConfirmsNoPhotoInputProcessing false", override: { finalDecisionConfirmsNoPhotoInputProcessing: false } },
    { label: "finalDecisionConfirmsNoFileInputProcessing false", override: { finalDecisionConfirmsNoFileInputProcessing: false } },
    { label: "finalDecisionConfirmsNoDocumentParsing false", override: { finalDecisionConfirmsNoDocumentParsing: false } },
    { label: "finalDecisionConfirmsNoRawDocumentStorage false", override: { finalDecisionConfirmsNoRawDocumentStorage: false } },
    { label: "finalDecisionConfirmsNoModelOutputStorage false", override: { finalDecisionConfirmsNoModelOutputStorage: false } },
    { label: "finalDecisionConfirmsNoPromptStorage false", override: { finalDecisionConfirmsNoPromptStorage: false } },
    { label: "finalDecisionConfirmsNoUserVisibleOutput false", override: { finalDecisionConfirmsNoUserVisibleOutput: false } },
    { label: "finalDecisionConfirmsNoCustomerFacingExplanation false", override: { finalDecisionConfirmsNoCustomerFacingExplanation: false } },
    { label: "finalDecisionConfirmsNoEvidenceEvaluation false", override: { finalDecisionConfirmsNoEvidenceEvaluation: false } },
    { label: "finalDecisionConfirmsNoClaimAuthorization false", override: { finalDecisionConfirmsNoClaimAuthorization: false } },
    { label: "finalDecisionConfirmsNoDeadlineCalculation false", override: { finalDecisionConfirmsNoDeadlineCalculation: false } },
    { label: "finalDecisionConfirmsNoLegalCertainty false", override: { finalDecisionConfirmsNoLegalCertainty: false } },
    { label: "finalDecisionConfirmsFeatureFlagDefaultOffRequired false", override: { finalDecisionConfirmsFeatureFlagDefaultOffRequired: false } },
    { label: "finalDecisionConfirmsKillSwitchRequiredBeforeRuntime false", override: { finalDecisionConfirmsKillSwitchRequiredBeforeRuntime: false } },
    { label: "finalDecisionConfirmsServerSideOnlyProcessingRequired false", override: { finalDecisionConfirmsServerSideOnlyProcessingRequired: false } },
    { label: "finalDecisionConfirmsNoClientSideSecretsAllowed false", override: { finalDecisionConfirmsNoClientSideSecretsAllowed: false } },
    { label: "finalDecisionConfirmsNoPersistenceByDefault false", override: { finalDecisionConfirmsNoPersistenceByDefault: false } },
    { label: "finalDecisionConfirmsEphemeralProcessingByDefault false", override: { finalDecisionConfirmsEphemeralProcessingByDefault: false } },
    { label: "finalDecisionConfirmsRedactionBeforeModelUseRequired false", override: { finalDecisionConfirmsRedactionBeforeModelUseRequired: false } },
    { label: "finalDecisionConfirmsOcrOutputUntrusted false", override: { finalDecisionConfirmsOcrOutputUntrusted: false } },
    { label: "finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation false", override: { finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation: false } },
    { label: "finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay false", override: { finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay: false } },
    { label: "finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload false", override: { finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload: false } },
    { label: "finalDecisionConfirmsRateLimitRequiredBeforePublicExposure false", override: { finalDecisionConfirmsRateLimitRequiredBeforePublicExposure: false } },
    { label: "finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure false", override: { finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure: false } },
    { label: "finalDecisionConfirmsAuditTraceNoRawContentRequired false", override: { finalDecisionConfirmsAuditTraceNoRawContentRequired: false } },
    { label: "finalDecisionConfirmsFailureNoChargePolicyRequired false", override: { finalDecisionConfirmsFailureNoChargePolicyRequired: false } },
    { label: "finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired false", override: { finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired: false } },
    { label: "finalDecisionConfirmsExplicitGoLiveApprovalRequired false", override: { finalDecisionConfirmsExplicitGoLiveApprovalRequired: false } },
    { label: "finalDecisionConfirmsSeparateProductionReadinessReviewRequired false", override: { finalDecisionConfirmsSeparateProductionReadinessReviewRequired: false } },
    { label: "finalDecisionConfirmsFreeQuestionModeRemainsFree false", override: { finalDecisionConfirmsFreeQuestionModeRemainsFree: false } },
    { label: "finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation false", override: { finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation: false } },
    { label: "finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation false", override: { finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation: false } },
    { label: "finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa false", override: { finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa: false } },
    { label: "finalDecisionConfirmsFullDocumentRedirectFromFreeQa false", override: { finalDecisionConfirmsFullDocumentRedirectFromFreeQa: false } },
    { label: "finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation false", override: { finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation: false } },
    { label: "finalDecisionConfirmsFailureNoChargePolicy false", override: { finalDecisionConfirmsFailureNoChargePolicy: false } },
    { label: "finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks false", override: { finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid false", override: { finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid: false } },
    { label: "executionSequenceActuallyExecuted true", override: { executionSequenceActuallyExecuted: true } },
    { label: "runtimePipelineActuallyExecuted true", override: { runtimePipelineActuallyExecuted: true } },
    { label: "documentPipelineActuallyExecuted true", override: { documentPipelineActuallyExecuted: true } },
    { label: "ocrPipelineActuallyExecuted true", override: { ocrPipelineActuallyExecuted: true } },
    { label: "paymentPipelineActuallyExecuted true", override: { paymentPipelineActuallyExecuted: true } },
    { label: "userVisiblePipelineActuallyExecuted true", override: { userVisiblePipelineActuallyExecuted: true } },
    { label: "realDocumentInputAuthorizedNow true", override: { realDocumentInputAuthorizedNow: true } },
    { label: "realDocumentProcessingAuthorizedNow true", override: { realDocumentProcessingAuthorizedNow: true } },
    { label: "realUserDocumentUploadAuthorizedNow true", override: { realUserDocumentUploadAuthorizedNow: true } },
    { label: "ocrRuntimeAuthorizedNow true", override: { ocrRuntimeAuthorizedNow: true } },
    { label: "photoInputAuthorizedNow true", override: { photoInputAuthorizedNow: true } },
    { label: "fileInputAuthorizedNow true", override: { fileInputAuthorizedNow: true } },
    { label: "documentStorageAuthorizedNow true", override: { documentStorageAuthorizedNow: true } },
    { label: "persistenceAuthorizedNow true", override: { persistenceAuthorizedNow: true } },
    { label: "publicRuntimeAuthorizedNow true", override: { publicRuntimeAuthorizedNow: true } },
    { label: "userVisibleLegalDeadlineOutputAuthorizedNow true", override: { userVisibleLegalDeadlineOutputAuthorizedNow: true } },
    { label: "liveLLMRuntimeAuthorizedNow true", override: { liveLLMRuntimeAuthorizedNow: true } },
    { label: "connectedAiRuntimeAuthorizedNow true", override: { connectedAiRuntimeAuthorizedNow: true } },
    { label: "pilotRuntimeAuthorizedNow true", override: { pilotRuntimeAuthorizedNow: true } },
    { label: "productionRuntimeAuthorizedNow true", override: { productionRuntimeAuthorizedNow: true } },
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true (forward-readiness blocked)", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "liveRouteContainmentAuditOnly false", override: { liveRouteContainmentAuditOnly: false } },
    { label: "liveRouteContainmentAuditPerformed false", override: { liveRouteContainmentAuditPerformed: false } },
    { label: "liveRouteContainmentRequiredBeforeRuntimeAuthorization false", override: { liveRouteContainmentRequiredBeforeRuntimeAuthorization: false } },
    { label: "runtimeAuthorizationMustRemainBlockedUntilContainmentResolved false", override: { runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: false } },
    { label: "separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment false", override: { separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: false } },
    { label: "td001DocumentBypassGuardMissingInLiveSmartTalkRoute false", override: { td001DocumentBypassGuardMissingInLiveSmartTalkRoute: false } },
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization false", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: false } },
    { label: "td004PreModelPiiRedactionMissing false", override: { td004PreModelPiiRedactionMissing: false } },
    { label: "td005PaidDocumentModeNotServerSideEnforced false", override: { td005PaidDocumentModeNotServerSideEnforced: false } },
    { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", override: { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false } },
    { label: "td006EvidenceGateTodoAndOrSemanticsUnresolved false", override: { td006EvidenceGateTodoAndOrSemanticsUnresolved: false } },
    { label: "td007TrapClaimDispositionNamespaceHardeningUnresolved false", override: { td007TrapClaimDispositionNamespaceHardeningUnresolved: false } },
    { label: "td008InMemoryRateLimiterServerlessUnsafe false", override: { td008InMemoryRateLimiterServerlessUnsafe: false } },
    { label: "td010GetUserStateDocumentTypeTodoOpen false", override: { td010GetUserStateDocumentTypeTodoOpen: false } },
    { label: "td009TmpDebugRunnerDebtClosed false", override: { td009TmpDebugRunnerDebtClosed: false } },
    { label: "tmpFilesPresentInWorkingTree true", override: { tmpFilesPresentInWorkingTree: true } },
    { label: "containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization false", override: { containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization: false } },
    { label: "containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization false", override: { containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization: false } },
    { label: "containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization false", override: { containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization: false } },
    { label: "containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization false", override: { containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization: false } },
    { label: "containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime false", override: { containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime: false } },
    { label: "containmentRequiresTrapDispositionHardeningBeforePilot false", override: { containmentRequiresTrapDispositionHardeningBeforePilot: false } },
    { label: "containmentRequiresDistributedRateLimitBeforeProduction false", override: { containmentRequiresDistributedRateLimitBeforeProduction: false } },
    { label: "routeContainmentDecisionRuntimeAuthorizationDeferred false", override: { routeContainmentDecisionRuntimeAuthorizationDeferred: false } },
    { label: "routeContainmentDecision8x6ABlockedUntilContainmentComplete false", override: { routeContainmentDecision8x6ABlockedUntilContainmentComplete: false } },
    { label: "routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine false", override: { routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine: false } },
    { label: "routeContainmentDecisionNoLiveRouteMutationIn8x5G false", override: { routeContainmentDecisionNoLiveRouteMutationIn8x5G: false } },
    { label: "routeContainmentDecisionNoRuntimePathExecutedIn8x5G false", override: { routeContainmentDecisionNoRuntimePathExecutedIn8x5G: false } },
    { label: "actualLiveRouteMutationPerformed true", override: { actualLiveRouteMutationPerformed: true } },
    { label: "actualPhotoRouteQuarantinePerformed true", override: { actualPhotoRouteQuarantinePerformed: true } },
    { label: "actualDocumentBypassGuardImplemented true", override: { actualDocumentBypassGuardImplemented: true } },
    { label: "actualPaidDocumentModeImplemented true", override: { actualPaidDocumentModeImplemented: true } },
    { label: "actualPiiRedactionImplemented true", override: { actualPiiRedactionImplemented: true } },
    { label: "actualEvidenceGateRuntimeWiringPerformed true", override: { actualEvidenceGateRuntimeWiringPerformed: true } },
    { label: "containmentAuditConfirmsNoOpenAiCall false", override: { containmentAuditConfirmsNoOpenAiCall: false } },
    { label: "containmentAuditConfirmsNoFetchCall false", override: { containmentAuditConfirmsNoFetchCall: false } },
    { label: "containmentAuditConfirmsNoProcessEnvRead false", override: { containmentAuditConfirmsNoProcessEnvRead: false } },
    { label: "containmentAuditConfirmsNoSdkUsage false", override: { containmentAuditConfirmsNoSdkUsage: false } },
    { label: "containmentAuditConfirmsNo8x3AcRerun false", override: { containmentAuditConfirmsNo8x3AcRerun: false } },
    { label: "containmentAuditConfirmsNoSmartTalkRuntimeCall false", override: { containmentAuditConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoRouteImport false", override: { containmentAuditConfirmsNoRouteImport: false } },
    { label: "containmentAuditConfirmsNoRouteMutation false", override: { containmentAuditConfirmsNoRouteMutation: false } },
    { label: "containmentAuditConfirmsNoPublicRouteMutation false", override: { containmentAuditConfirmsNoPublicRouteMutation: false } },
    { label: "containmentAuditConfirmsNoUiMutation false", override: { containmentAuditConfirmsNoUiMutation: false } },
    { label: "containmentAuditConfirmsNoSupabaseMutation false", override: { containmentAuditConfirmsNoSupabaseMutation: false } },
    { label: "containmentAuditConfirmsNoStorageMutation false", override: { containmentAuditConfirmsNoStorageMutation: false } },
    { label: "containmentAuditConfirmsNoDatabaseWrite false", override: { containmentAuditConfirmsNoDatabaseWrite: false } },
    { label: "containmentAuditConfirmsNoAuditPersistence false", override: { containmentAuditConfirmsNoAuditPersistence: false } },
    { label: "containmentAuditConfirmsNoPaymentRuntimeCall false", override: { containmentAuditConfirmsNoPaymentRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoOcrRuntimeCall false", override: { containmentAuditConfirmsNoOcrRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoPhotoInputProcessing false", override: { containmentAuditConfirmsNoPhotoInputProcessing: false } },
    { label: "containmentAuditConfirmsNoFileInputProcessing false", override: { containmentAuditConfirmsNoFileInputProcessing: false } },
    { label: "containmentAuditConfirmsNoDocumentParsing false", override: { containmentAuditConfirmsNoDocumentParsing: false } },
    { label: "containmentAuditConfirmsNoRawDocumentStorage false", override: { containmentAuditConfirmsNoRawDocumentStorage: false } },
    { label: "containmentAuditConfirmsNoModelOutputStorage false", override: { containmentAuditConfirmsNoModelOutputStorage: false } },
    { label: "containmentAuditConfirmsNoPromptStorage false", override: { containmentAuditConfirmsNoPromptStorage: false } },
    { label: "containmentAuditConfirmsNoUserVisibleOutput false", override: { containmentAuditConfirmsNoUserVisibleOutput: false } },
    { label: "containmentAuditConfirmsNoCustomerFacingExplanation false", override: { containmentAuditConfirmsNoCustomerFacingExplanation: false } },
    { label: "containmentAuditConfirmsNoEvidenceEvaluation false", override: { containmentAuditConfirmsNoEvidenceEvaluation: false } },
    { label: "containmentAuditConfirmsNoClaimAuthorization false", override: { containmentAuditConfirmsNoClaimAuthorization: false } },
    { label: "containmentAuditConfirmsNoDeadlineCalculation false", override: { containmentAuditConfirmsNoDeadlineCalculation: false } },
    { label: "containmentAuditConfirmsNoLegalCertainty false", override: { containmentAuditConfirmsNoLegalCertainty: false } },
    { label: "readyFor8x5HPhotoOcrRouteRuntimeQuarantine false", override: { readyFor8x5HPhotoOcrRouteRuntimeQuarantine: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in 8.5G result", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true in 8.5G result", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true in 8.5G result", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
  ];

  const tamperFailures: string[] = [];
  for (const tc of tamperCases) {
    const tampered = { ...base, ...tc.override };
    const result = validateContainmentAuditInput(tampered);
    if (result.accepted) {
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }
  const allTamperRejected = tamperFailures.length === 0;

  // ── Step 5: Compute allPassed ─────────────────────────────────────────────
  const allPassed = prereqAllPassed && prereqReady && auditAccepted && allTamperRejected;

  // ── Step 6: Build notes ───────────────────────────────────────────────────
  const notes: string[] = [
    "8.5G is a controlled real-document live route containment audit layer",
    "8.5G depends on completed 8.5F controlled real-document runtime final authorization decision",
    "8.5G is containment-audit-only",
    "8.5G was created because the technical-debt audit found live-route boundary mismatch after 8.5F",
    "TD-001: Document Bypass Guard is missing in live /api/smart-talk — any anonymous user can paste full documents in text mode and receive free document analysis",
    "TD-003: /api/smart-talk-photo is a live public anonymous OCR route ahead of governance authorization — photo uploads go directly to OpenAI without guard, authorization, redaction, or feature flag",
    "TD-004: pre-model PII redaction is missing — user text and OCR transcripts are forwarded to OpenAI unredacted",
    "TD-005: Paid Document Mode is not server-side enforced — full document analysis is free and anonymous on both routes",
    "TD-002: Evidence Gates are not wired into production runSmartTalk — all claim/reality/trap evaluations are dry-run trace-only with no effect on user-visible output",
    "TD-006 and TD-007 remain medium debts — Evidence Gate AND/OR semantics and ClaimDisposition namespace hardening are unresolved",
    "TD-008 and TD-010 remain low debts — in-memory serverless rate limiter and get-user-state.ts TODO are open",
    "TD-009 tmp/debug runner debt is closed — no tmp- files present in working tree",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no final go-live authorization was granted",
    "runtime authorization must remain blocked until containment is resolved",
    "8.6A must not start until containment is complete",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5G",
    "8.3AC was not re-run",
    "live routes were not imported or modified",
    "runtime execution sequence remains defined but not executed",
    "all runtime, document, OCR, payment, and user-visible pipelines remain unexecuted",
    "the next phase is 8.5H Photo OCR Route Runtime Quarantine",
    "readyFor8x5HPhotoOcrRouteRuntimeQuarantine is planning readiness only, not route mutation",
    `8.5F prerequisite: allPassed=${finalDecisionResult.allPassed}, planningChainClosed=${finalDecisionResult.controlledRealDocumentRuntimePlanningChainClosed}, planningChainPassed=${finalDecisionResult.controlledRealDocumentRuntimePlanningChainPassed}`,
    `containment audit input validation: ${auditAccepted ? "accepted" : "REJECTED"} — reasons: ${auditValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5G allPassed: true — controlled real-document live route containment audit accepted"
    );
    notes.push(
      "live-route containment debt is formally recorded; runtime authorization remains blocked until resolved"
    );
  }

  return {
    checkId: "8.5G",
    allPassed,
    runtimeFinalAuthorizationDecisionReadyForLiveRouteContainmentAudit:
      canonicalInput.controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted,
    controlledRealDocumentLiveRouteContainmentAuditAccepted: allPassed,
    liveRouteContainmentAuditOnly: true,
    liveRouteContainmentAuditPerformed: true,
    liveRouteContainmentRequiredBeforeRuntimeAuthorization:
      canonicalInput.liveRouteContainmentRequiredBeforeRuntimeAuthorization,
    runtimeAuthorizationMustRemainBlockedUntilContainmentResolved:
      canonicalInput.runtimeAuthorizationMustRemainBlockedUntilContainmentResolved,
    separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment:
      canonicalInput.separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td001DocumentBypassGuardMissingInLiveSmartTalkRoute:
      canonicalInput.td001DocumentBypassGuardMissingInLiveSmartTalkRoute,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization:
      canonicalInput.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization,
    td004PreModelPiiRedactionMissing: canonicalInput.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      canonicalInput.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      canonicalInput.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,

    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      canonicalInput.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      canonicalInput.td007TrapClaimDispositionNamespaceHardeningUnresolved,

    td008InMemoryRateLimiterServerlessUnsafe: canonicalInput.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: canonicalInput.td010GetUserStateDocumentTypeTodoOpen,

    td009TmpDebugRunnerDebtClosed: canonicalInput.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: false,

    containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization:
      canonicalInput.containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization,
    containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization:
      canonicalInput.containmentRequiresDocumentBypassGuardBeforeRuntimeAuthorization,
    containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization:
      canonicalInput.containmentRequiresPaidDocumentModeBoundaryBeforeRuntimeAuthorization,
    containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization:
      canonicalInput.containmentRequiresPreModelPiiRedactionBeforeRuntimeAuthorization,
    containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime:
      canonicalInput.containmentRequiresEvidenceGateRuntimeWiringBeforeDocumentRuntime,
    containmentRequiresTrapDispositionHardeningBeforePilot:
      canonicalInput.containmentRequiresTrapDispositionHardeningBeforePilot,
    containmentRequiresDistributedRateLimitBeforeProduction:
      canonicalInput.containmentRequiresDistributedRateLimitBeforeProduction,

    routeContainmentDecisionRuntimeAuthorizationDeferred:
      canonicalInput.routeContainmentDecisionRuntimeAuthorizationDeferred,
    routeContainmentDecision8x6ABlockedUntilContainmentComplete:
      canonicalInput.routeContainmentDecision8x6ABlockedUntilContainmentComplete,
    routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine:
      canonicalInput.routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine,
    routeContainmentDecisionNoLiveRouteMutationIn8x5G:
      canonicalInput.routeContainmentDecisionNoLiveRouteMutationIn8x5G,
    routeContainmentDecisionNoRuntimePathExecutedIn8x5G:
      canonicalInput.routeContainmentDecisionNoRuntimePathExecutedIn8x5G,

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
    actualLiveRouteMutationPerformed: false,
    actualPhotoRouteQuarantinePerformed: false,
    actualDocumentBypassGuardImplemented: false,
    actualPaidDocumentModeImplemented: false,
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    containmentAuditConfirmsNoOpenAiCall: canonicalInput.containmentAuditConfirmsNoOpenAiCall,
    containmentAuditConfirmsNoFetchCall: canonicalInput.containmentAuditConfirmsNoFetchCall,
    containmentAuditConfirmsNoProcessEnvRead: canonicalInput.containmentAuditConfirmsNoProcessEnvRead,
    containmentAuditConfirmsNoSdkUsage: canonicalInput.containmentAuditConfirmsNoSdkUsage,
    containmentAuditConfirmsNo8x3AcRerun: canonicalInput.containmentAuditConfirmsNo8x3AcRerun,
    containmentAuditConfirmsNoSmartTalkRuntimeCall:
      canonicalInput.containmentAuditConfirmsNoSmartTalkRuntimeCall,
    containmentAuditConfirmsNoRouteImport: canonicalInput.containmentAuditConfirmsNoRouteImport,
    containmentAuditConfirmsNoRouteMutation: canonicalInput.containmentAuditConfirmsNoRouteMutation,
    containmentAuditConfirmsNoPublicRouteMutation:
      canonicalInput.containmentAuditConfirmsNoPublicRouteMutation,
    containmentAuditConfirmsNoUiMutation: canonicalInput.containmentAuditConfirmsNoUiMutation,
    containmentAuditConfirmsNoSupabaseMutation:
      canonicalInput.containmentAuditConfirmsNoSupabaseMutation,
    containmentAuditConfirmsNoStorageMutation: canonicalInput.containmentAuditConfirmsNoStorageMutation,
    containmentAuditConfirmsNoDatabaseWrite: canonicalInput.containmentAuditConfirmsNoDatabaseWrite,
    containmentAuditConfirmsNoAuditPersistence:
      canonicalInput.containmentAuditConfirmsNoAuditPersistence,
    containmentAuditConfirmsNoPaymentRuntimeCall:
      canonicalInput.containmentAuditConfirmsNoPaymentRuntimeCall,
    containmentAuditConfirmsNoOcrRuntimeCall: canonicalInput.containmentAuditConfirmsNoOcrRuntimeCall,
    containmentAuditConfirmsNoPhotoInputProcessing:
      canonicalInput.containmentAuditConfirmsNoPhotoInputProcessing,
    containmentAuditConfirmsNoFileInputProcessing:
      canonicalInput.containmentAuditConfirmsNoFileInputProcessing,
    containmentAuditConfirmsNoDocumentParsing: canonicalInput.containmentAuditConfirmsNoDocumentParsing,
    containmentAuditConfirmsNoRawDocumentStorage:
      canonicalInput.containmentAuditConfirmsNoRawDocumentStorage,
    containmentAuditConfirmsNoModelOutputStorage:
      canonicalInput.containmentAuditConfirmsNoModelOutputStorage,
    containmentAuditConfirmsNoPromptStorage: canonicalInput.containmentAuditConfirmsNoPromptStorage,
    containmentAuditConfirmsNoUserVisibleOutput:
      canonicalInput.containmentAuditConfirmsNoUserVisibleOutput,
    containmentAuditConfirmsNoCustomerFacingExplanation:
      canonicalInput.containmentAuditConfirmsNoCustomerFacingExplanation,
    containmentAuditConfirmsNoEvidenceEvaluation:
      canonicalInput.containmentAuditConfirmsNoEvidenceEvaluation,
    containmentAuditConfirmsNoClaimAuthorization:
      canonicalInput.containmentAuditConfirmsNoClaimAuthorization,
    containmentAuditConfirmsNoDeadlineCalculation:
      canonicalInput.containmentAuditConfirmsNoDeadlineCalculation,
    containmentAuditConfirmsNoLegalCertainty: canonicalInput.containmentAuditConfirmsNoLegalCertainty,

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

    readyFor8x5HPhotoOcrRouteRuntimeQuarantine:
      canonicalInput.readyFor8x5HPhotoOcrRouteRuntimeQuarantine,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
