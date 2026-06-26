/**
 * Phase 8.5F — Controlled Real Document Runtime Final Authorization Decision.
 *
 * FINAL-AUTHORIZATION-DECISION-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5E.
 *
 * This file makes a final planning/decision outcome for the 8.5A–8.5F controlled
 * real-document runtime planning chain. It is:
 *   - final-authorization-decision-only — NOT runtime authorization.
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
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentRuntimeIsolationAudit } from "./run-controlled-real-document-runtime-isolation-audit";

// ── Local final authorization decision input type ─────────────────────────────

interface ControlledRealDocumentRuntimeFinalAuthorizationDecisionInput {
  // 8.5E prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly runtimeExecutionPlanReadyForIsolationAudit: boolean;
  readonly controlledRealDocumentRuntimeIsolationAuditAccepted: boolean;
  readonly runtimeIsolationAuditOnly: boolean;
  readonly runtimeIsolationAuditPerformed: boolean;
  readonly readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: boolean;

  // Authorization flags (must be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // actual* performed flags (must be false)
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

  // isolationAuditConfirms* gates from 8.5E (must be true)
  readonly isolationAuditConfirmsNoOpenAiCall: boolean;
  readonly isolationAuditConfirmsNoFetchCall: boolean;
  readonly isolationAuditConfirmsNoProcessEnvRead: boolean;
  readonly isolationAuditConfirmsNoSdkUsage: boolean;
  readonly isolationAuditConfirmsNo8x3AcRerun: boolean;
  readonly isolationAuditConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly isolationAuditConfirmsNoBranchCMutation: boolean;
  readonly isolationAuditConfirmsNoPublicRouteMutation: boolean;
  readonly isolationAuditConfirmsNoUiMutation: boolean;
  readonly isolationAuditConfirmsNoSupabaseMutation: boolean;
  readonly isolationAuditConfirmsNoStorageMutation: boolean;
  readonly isolationAuditConfirmsNoDatabaseWrite: boolean;
  readonly isolationAuditConfirmsNoAuditPersistence: boolean;
  readonly isolationAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly isolationAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly isolationAuditConfirmsNoPhotoInputProcessing: boolean;
  readonly isolationAuditConfirmsNoFileInputProcessing: boolean;
  readonly isolationAuditConfirmsNoDocumentParsing: boolean;
  readonly isolationAuditConfirmsNoRawDocumentStorage: boolean;
  readonly isolationAuditConfirmsNoModelOutputStorage: boolean;
  readonly isolationAuditConfirmsNoPromptStorage: boolean;
  readonly isolationAuditConfirmsNoUserVisibleOutput: boolean;
  readonly isolationAuditConfirmsNoCustomerFacingExplanation: boolean;
  readonly isolationAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly isolationAuditConfirmsNoClaimAuthorization: boolean;
  readonly isolationAuditConfirmsNoDeadlineCalculation: boolean;
  readonly isolationAuditConfirmsNoLegalCertainty: boolean;
  readonly isolationAuditConfirmsNoRuntimePipelineExecution: boolean;
  readonly isolationAuditConfirmsNoDocumentPipelineExecution: boolean;
  readonly isolationAuditConfirmsNoOcrPipelineExecution: boolean;
  readonly isolationAuditConfirmsNoPaymentPipelineExecution: boolean;
  readonly isolationAuditConfirmsNoUserVisiblePipelineExecution: boolean;

  // isolationBoundaryRequires* gates from 8.5E (must be true)
  readonly isolationBoundaryRequiresFeatureFlagDefaultOff: boolean;
  readonly isolationBoundaryRequiresKillSwitchBeforeRuntime: boolean;
  readonly isolationBoundaryRequiresServerSideOnlyProcessing: boolean;
  readonly isolationBoundaryRequiresNoClientSideSecrets: boolean;
  readonly isolationBoundaryRequiresNoPersistenceByDefault: boolean;
  readonly isolationBoundaryRequiresEphemeralProcessingByDefault: boolean;
  readonly isolationBoundaryRequiresRedactionBeforeModelUse: boolean;
  readonly isolationBoundaryRequiresOcrOutputUntrusted: boolean;
  readonly isolationBoundaryRequiresEvidenceGatesBeforeInterpretation: boolean;
  readonly isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay: boolean;
  readonly isolationBoundaryRequiresPrivacyNoticeBeforeUpload: boolean;
  readonly isolationBoundaryRequiresRateLimitBeforePublicExposure: boolean;
  readonly isolationBoundaryRequiresAbuseDetectionBeforePublicExposure: boolean;
  readonly isolationBoundaryRequiresAuditTraceNoRawContent: boolean;
  readonly isolationBoundaryRequiresFailureNoChargePolicy: boolean;
  readonly isolationBoundaryRequiresManualOperatorConfirmationForHighRisk: boolean;
  readonly isolationBoundaryRequiresExplicitGoLiveApproval: boolean;
  readonly isolationBoundaryRequiresSeparateProductionReadinessReview: boolean;

  // Commercial isolation gates from 8.5E (must be true)
  readonly isolationAuditConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly isolationAuditConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly isolationAuditConfirmsFailureNoChargePolicy: boolean;
  readonly isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // Pipeline executed flags (must be false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // Runtime authorization flags (must be false)
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

  // Legal safety invariants
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // Runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5F assertions
  readonly finalAuthorizationDecisionOnly: boolean;
  readonly finalAuthorizationDecisionMade: boolean;
  readonly controlledRealDocumentRuntimePlanningChainClosed: boolean;
  readonly controlledRealDocumentRuntimePlanningChainPassed: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // Decision outcome
  readonly finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionProductionBlockedUntilSeparateProductionReadinessReview: boolean;
  readonly finalDecisionExplicitGoLiveApprovalStillRequired: boolean;
  readonly finalDecisionManualOperatorConfirmationStillRequired: boolean;
  readonly finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: boolean;
  readonly finalDecisionFeatureFlagMustRemainDefaultOff: boolean;
  readonly finalDecisionKillSwitchMustExistBeforeRuntime: boolean;

  // finalDecisionConfirmsNo* isolation gates
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

  // finalDecisionConfirms* boundary gates
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

  // finalDecisionConfirms* commercial gates
  readonly finalDecisionConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly finalDecisionConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly finalDecisionConfirmsFailureNoChargePolicy: boolean;
  readonly finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeFinalAuthorizationDecisionResult {
  readonly checkId: "8.5F";
  readonly allPassed: boolean;
  readonly runtimeIsolationAuditReadyForFinalAuthorizationDecision: boolean;
  readonly controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted: boolean;
  readonly finalAuthorizationDecisionOnly: true;
  readonly finalAuthorizationDecisionMade: true;
  readonly controlledRealDocumentRuntimePlanningChainClosed: boolean;
  readonly controlledRealDocumentRuntimePlanningChainPassed: boolean;
  readonly tamperCasesRejected: boolean;

  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  readonly finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization: boolean;
  readonly finalDecisionProductionBlockedUntilSeparateProductionReadinessReview: boolean;
  readonly finalDecisionExplicitGoLiveApprovalStillRequired: boolean;
  readonly finalDecisionManualOperatorConfirmationStillRequired: boolean;
  readonly finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: boolean;
  readonly finalDecisionFeatureFlagMustRemainDefaultOff: boolean;
  readonly finalDecisionKillSwitchMustExistBeforeRuntime: boolean;

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

  readonly finalDecisionConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly finalDecisionConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly finalDecisionConfirmsFailureNoChargePolicy: boolean;
  readonly finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

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

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: false;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Final authorization decision input validator ──────────────────────────────

function validateFinalAuthorizationDecisionInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5E prerequisite gates
  if (o["prereqCheckId"] !== "8.5E")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeIsolationAuditAccepted"] !== true)
    reasons.push("isolation_audit_not_accepted");
  if (o["runtimeIsolationAuditOnly"] !== true)
    reasons.push("runtime_isolation_audit_only_false");
  if (o["runtimeIsolationAuditPerformed"] !== true)
    reasons.push("runtime_isolation_audit_performed_false");
  if (o["readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision"] !== true)
    reasons.push("not_ready_for_8_5f_final_authorization_decision");

  // Authorization flags (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // actual* performed flags (must be false)
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

  // isolationAuditConfirms* gates (must be true)
  if (o["isolationAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("isolation_audit_confirms_no_open_ai_call_false");
  if (o["isolationAuditConfirmsNoFetchCall"] !== true)
    reasons.push("isolation_audit_confirms_no_fetch_call_false");
  if (o["isolationAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("isolation_audit_confirms_no_process_env_read_false");
  if (o["isolationAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("isolation_audit_confirms_no_sdk_usage_false");
  if (o["isolationAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("isolation_audit_confirms_no_8x3ac_rerun_false");
  if (o["isolationAuditConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("isolation_audit_confirms_no_smart_talk_runtime_call_false");
  if (o["isolationAuditConfirmsNoBranchCMutation"] !== true)
    reasons.push("isolation_audit_confirms_no_branch_c_mutation_false");
  if (o["isolationAuditConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("isolation_audit_confirms_no_public_route_mutation_false");
  if (o["isolationAuditConfirmsNoUiMutation"] !== true)
    reasons.push("isolation_audit_confirms_no_ui_mutation_false");
  if (o["isolationAuditConfirmsNoSupabaseMutation"] !== true)
    reasons.push("isolation_audit_confirms_no_supabase_mutation_false");
  if (o["isolationAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("isolation_audit_confirms_no_storage_mutation_false");
  if (o["isolationAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("isolation_audit_confirms_no_database_write_false");
  if (o["isolationAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("isolation_audit_confirms_no_audit_persistence_false");
  if (o["isolationAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("isolation_audit_confirms_no_payment_runtime_call_false");
  if (o["isolationAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("isolation_audit_confirms_no_ocr_runtime_call_false");
  if (o["isolationAuditConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("isolation_audit_confirms_no_photo_input_processing_false");
  if (o["isolationAuditConfirmsNoFileInputProcessing"] !== true)
    reasons.push("isolation_audit_confirms_no_file_input_processing_false");
  if (o["isolationAuditConfirmsNoDocumentParsing"] !== true)
    reasons.push("isolation_audit_confirms_no_document_parsing_false");
  if (o["isolationAuditConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("isolation_audit_confirms_no_raw_document_storage_false");
  if (o["isolationAuditConfirmsNoModelOutputStorage"] !== true)
    reasons.push("isolation_audit_confirms_no_model_output_storage_false");
  if (o["isolationAuditConfirmsNoPromptStorage"] !== true)
    reasons.push("isolation_audit_confirms_no_prompt_storage_false");
  if (o["isolationAuditConfirmsNoUserVisibleOutput"] !== true)
    reasons.push("isolation_audit_confirms_no_user_visible_output_false");
  if (o["isolationAuditConfirmsNoCustomerFacingExplanation"] !== true)
    reasons.push("isolation_audit_confirms_no_customer_facing_explanation_false");
  if (o["isolationAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("isolation_audit_confirms_no_evidence_evaluation_false");
  if (o["isolationAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("isolation_audit_confirms_no_claim_authorization_false");
  if (o["isolationAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("isolation_audit_confirms_no_deadline_calculation_false");
  if (o["isolationAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("isolation_audit_confirms_no_legal_certainty_false");
  if (o["isolationAuditConfirmsNoRuntimePipelineExecution"] !== true)
    reasons.push("isolation_audit_confirms_no_runtime_pipeline_execution_false");
  if (o["isolationAuditConfirmsNoDocumentPipelineExecution"] !== true)
    reasons.push("isolation_audit_confirms_no_document_pipeline_execution_false");
  if (o["isolationAuditConfirmsNoOcrPipelineExecution"] !== true)
    reasons.push("isolation_audit_confirms_no_ocr_pipeline_execution_false");
  if (o["isolationAuditConfirmsNoPaymentPipelineExecution"] !== true)
    reasons.push("isolation_audit_confirms_no_payment_pipeline_execution_false");
  if (o["isolationAuditConfirmsNoUserVisiblePipelineExecution"] !== true)
    reasons.push("isolation_audit_confirms_no_user_visible_pipeline_execution_false");

  // isolationBoundaryRequires* gates (must be true)
  if (o["isolationBoundaryRequiresFeatureFlagDefaultOff"] !== true)
    reasons.push("isolation_boundary_requires_feature_flag_default_off_false");
  if (o["isolationBoundaryRequiresKillSwitchBeforeRuntime"] !== true)
    reasons.push("isolation_boundary_requires_kill_switch_before_runtime_false");
  if (o["isolationBoundaryRequiresServerSideOnlyProcessing"] !== true)
    reasons.push("isolation_boundary_requires_server_side_only_processing_false");
  if (o["isolationBoundaryRequiresNoClientSideSecrets"] !== true)
    reasons.push("isolation_boundary_requires_no_client_side_secrets_false");
  if (o["isolationBoundaryRequiresNoPersistenceByDefault"] !== true)
    reasons.push("isolation_boundary_requires_no_persistence_by_default_false");
  if (o["isolationBoundaryRequiresEphemeralProcessingByDefault"] !== true)
    reasons.push("isolation_boundary_requires_ephemeral_processing_by_default_false");
  if (o["isolationBoundaryRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("isolation_boundary_requires_redaction_before_model_use_false");
  if (o["isolationBoundaryRequiresOcrOutputUntrusted"] !== true)
    reasons.push("isolation_boundary_requires_ocr_output_untrusted_false");
  if (o["isolationBoundaryRequiresEvidenceGatesBeforeInterpretation"] !== true)
    reasons.push("isolation_boundary_requires_evidence_gates_before_interpretation_false");
  if (o["isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("isolation_boundary_requires_user_visible_output_contract_before_display_false");
  if (o["isolationBoundaryRequiresPrivacyNoticeBeforeUpload"] !== true)
    reasons.push("isolation_boundary_requires_privacy_notice_before_upload_false");
  if (o["isolationBoundaryRequiresRateLimitBeforePublicExposure"] !== true)
    reasons.push("isolation_boundary_requires_rate_limit_before_public_exposure_false");
  if (o["isolationBoundaryRequiresAbuseDetectionBeforePublicExposure"] !== true)
    reasons.push("isolation_boundary_requires_abuse_detection_before_public_exposure_false");
  if (o["isolationBoundaryRequiresAuditTraceNoRawContent"] !== true)
    reasons.push("isolation_boundary_requires_audit_trace_no_raw_content_false");
  if (o["isolationBoundaryRequiresFailureNoChargePolicy"] !== true)
    reasons.push("isolation_boundary_requires_failure_no_charge_policy_false");
  if (o["isolationBoundaryRequiresManualOperatorConfirmationForHighRisk"] !== true)
    reasons.push("isolation_boundary_requires_manual_operator_confirmation_for_high_risk_false");
  if (o["isolationBoundaryRequiresExplicitGoLiveApproval"] !== true)
    reasons.push("isolation_boundary_requires_explicit_go_live_approval_false");
  if (o["isolationBoundaryRequiresSeparateProductionReadinessReview"] !== true)
    reasons.push("isolation_boundary_requires_separate_production_readiness_review_false");

  // Commercial isolation gates (must be true)
  if (o["isolationAuditConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("isolation_audit_confirms_free_question_mode_remains_free_false");
  if (o["isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("isolation_audit_confirms_paid_document_mode_required_for_full_explanation_false");
  if (o["isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation"] !== true)
    reasons.push("isolation_audit_confirms_paid_document_mode_required_for_photo_explanation_false");
  if (o["isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa"] !== true)
    reasons.push("isolation_audit_confirms_document_bypass_guard_required_for_free_qa_false");
  if (o["isolationAuditConfirmsFullDocumentRedirectFromFreeQa"] !== true)
    reasons.push("isolation_audit_confirms_full_document_redirect_from_free_qa_false");
  if (o["isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("isolation_audit_confirms_payment_boundary_before_full_explanation_false");
  if (o["isolationAuditConfirmsFailureNoChargePolicy"] !== true)
    reasons.push("isolation_audit_confirms_failure_no_charge_policy_false");
  if (o["isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("isolation_audit_confirms_payment_does_not_override_safety_blocks_false");
  if (o["isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid"] !== true)
    reasons.push("isolation_audit_confirms_high_risk_safety_contract_even_when_paid_false");

  // Pipeline executed flags (must be false)
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

  // Runtime authorization flags (must be false)
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
    reasons.push("delivery_date_not_required");

  // Runtime/public invariants
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (o["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (o["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.5F assertions
  if (o["finalAuthorizationDecisionOnly"] !== true)
    reasons.push("final_authorization_decision_only_false");
  if (o["finalAuthorizationDecisionMade"] !== true)
    reasons.push("final_authorization_decision_made_false");
  if (o["controlledRealDocumentRuntimePlanningChainClosed"] !== true)
    reasons.push("controlled_real_document_runtime_planning_chain_closed_false");
  if (o["controlledRealDocumentRuntimePlanningChainPassed"] !== true)
    reasons.push("controlled_real_document_runtime_planning_chain_passed_false");
  if (o["goLiveAuthorizationGranted"] !== false)
    reasons.push("go_live_authorization_granted");

  // Decision outcome (must be true)
  if (o["finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization"] !== true)
    reasons.push("final_decision_runtime_may_proceed_only_after_separate_explicit_authorization_false");
  if (o["finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization"] !== true)
    reasons.push("final_decision_pilot_may_proceed_only_after_separate_explicit_authorization_false");
  if (o["finalDecisionProductionBlockedUntilSeparateProductionReadinessReview"] !== true)
    reasons.push("final_decision_production_blocked_until_separate_production_readiness_review_false");
  if (o["finalDecisionExplicitGoLiveApprovalStillRequired"] !== true)
    reasons.push("final_decision_explicit_go_live_approval_still_required_false");
  if (o["finalDecisionManualOperatorConfirmationStillRequired"] !== true)
    reasons.push("final_decision_manual_operator_confirmation_still_required_false");
  if (o["finalDecisionFreshRiskReviewStillRequiredBeforeRuntime"] !== true)
    reasons.push("final_decision_fresh_risk_review_still_required_before_runtime_false");
  if (o["finalDecisionFeatureFlagMustRemainDefaultOff"] !== true)
    reasons.push("final_decision_feature_flag_must_remain_default_off_false");
  if (o["finalDecisionKillSwitchMustExistBeforeRuntime"] !== true)
    reasons.push("final_decision_kill_switch_must_exist_before_runtime_false");

  // finalDecisionConfirmsNo* isolation gates (must be true)
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

  // finalDecisionConfirms* boundary gates (must be true)
  if (o["finalDecisionConfirmsFeatureFlagDefaultOffRequired"] !== true)
    reasons.push("final_decision_confirms_feature_flag_default_off_required_false");
  if (o["finalDecisionConfirmsKillSwitchRequiredBeforeRuntime"] !== true)
    reasons.push("final_decision_confirms_kill_switch_required_before_runtime_false");
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
    reasons.push("final_decision_confirms_evidence_gates_required_before_interpretation_false");
  if (o["finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay"] !== true)
    reasons.push("final_decision_confirms_user_visible_output_contract_required_before_display_false");
  if (o["finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload"] !== true)
    reasons.push("final_decision_confirms_privacy_notice_required_before_upload_false");
  if (o["finalDecisionConfirmsRateLimitRequiredBeforePublicExposure"] !== true)
    reasons.push("final_decision_confirms_rate_limit_required_before_public_exposure_false");
  if (o["finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure"] !== true)
    reasons.push("final_decision_confirms_abuse_detection_required_before_public_exposure_false");
  if (o["finalDecisionConfirmsAuditTraceNoRawContentRequired"] !== true)
    reasons.push("final_decision_confirms_audit_trace_no_raw_content_required_false");
  if (o["finalDecisionConfirmsFailureNoChargePolicyRequired"] !== true)
    reasons.push("final_decision_confirms_failure_no_charge_policy_required_false");
  if (o["finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired"] !== true)
    reasons.push("final_decision_confirms_manual_operator_confirmation_for_high_risk_required_false");
  if (o["finalDecisionConfirmsExplicitGoLiveApprovalRequired"] !== true)
    reasons.push("final_decision_confirms_explicit_go_live_approval_required_false");
  if (o["finalDecisionConfirmsSeparateProductionReadinessReviewRequired"] !== true)
    reasons.push("final_decision_confirms_separate_production_readiness_review_required_false");

  // finalDecisionConfirms* commercial gates (must be true)
  if (o["finalDecisionConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("final_decision_confirms_free_question_mode_remains_free_false");
  if (o["finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("final_decision_confirms_paid_document_mode_required_for_full_explanation_false");
  if (o["finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation"] !== true)
    reasons.push("final_decision_confirms_paid_document_mode_required_for_photo_explanation_false");
  if (o["finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa"] !== true)
    reasons.push("final_decision_confirms_document_bypass_guard_required_for_free_qa_false");
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

  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== true)
    reasons.push("not_ready_for_controlled_real_document_separate_runtime_authorization_phase");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("ready_for_pilot_authorization_phase_should_be_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("ready_for_production_authorization_phase_should_be_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeFinalAuthorizationDecision(): ControlledRealDocumentRuntimeFinalAuthorizationDecisionResult {
  // ── Step 1: Obtain 8.5E isolation audit result ────────────────────────────
  const auditResult = runControlledRealDocumentRuntimeIsolationAudit();

  const prereqAllPassed = auditResult.allPassed;
  const prereqReady =
    auditResult.readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision;

  // ── Step 2: Build canonical final authorization decision input ────────────
  const canonicalInput: ControlledRealDocumentRuntimeFinalAuthorizationDecisionInput = {
    prereqCheckId: auditResult.checkId,
    prereqAllPassed,
    runtimeExecutionPlanReadyForIsolationAudit:
      auditResult.runtimeExecutionPlanReadyForIsolationAudit,
    controlledRealDocumentRuntimeIsolationAuditAccepted:
      auditResult.controlledRealDocumentRuntimeIsolationAuditAccepted,
    runtimeIsolationAuditOnly: auditResult.runtimeIsolationAuditOnly,
    runtimeIsolationAuditPerformed: auditResult.runtimeIsolationAuditPerformed,
    readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: prereqReady,

    runtimeAuthorizationGranted: auditResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: auditResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: auditResult.productionAuthorizationGranted,
    finalAuthorizationGranted: auditResult.finalAuthorizationGranted,

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
    actualEvidenceEvaluationPerformed: auditResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: auditResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: auditResult.actualDeadlineCalculationPerformed,

    isolationAuditConfirmsNoOpenAiCall: auditResult.isolationAuditConfirmsNoOpenAiCall,
    isolationAuditConfirmsNoFetchCall: auditResult.isolationAuditConfirmsNoFetchCall,
    isolationAuditConfirmsNoProcessEnvRead: auditResult.isolationAuditConfirmsNoProcessEnvRead,
    isolationAuditConfirmsNoSdkUsage: auditResult.isolationAuditConfirmsNoSdkUsage,
    isolationAuditConfirmsNo8x3AcRerun: auditResult.isolationAuditConfirmsNo8x3AcRerun,
    isolationAuditConfirmsNoSmartTalkRuntimeCall:
      auditResult.isolationAuditConfirmsNoSmartTalkRuntimeCall,
    isolationAuditConfirmsNoBranchCMutation: auditResult.isolationAuditConfirmsNoBranchCMutation,
    isolationAuditConfirmsNoPublicRouteMutation:
      auditResult.isolationAuditConfirmsNoPublicRouteMutation,
    isolationAuditConfirmsNoUiMutation: auditResult.isolationAuditConfirmsNoUiMutation,
    isolationAuditConfirmsNoSupabaseMutation: auditResult.isolationAuditConfirmsNoSupabaseMutation,
    isolationAuditConfirmsNoStorageMutation: auditResult.isolationAuditConfirmsNoStorageMutation,
    isolationAuditConfirmsNoDatabaseWrite: auditResult.isolationAuditConfirmsNoDatabaseWrite,
    isolationAuditConfirmsNoAuditPersistence: auditResult.isolationAuditConfirmsNoAuditPersistence,
    isolationAuditConfirmsNoPaymentRuntimeCall:
      auditResult.isolationAuditConfirmsNoPaymentRuntimeCall,
    isolationAuditConfirmsNoOcrRuntimeCall: auditResult.isolationAuditConfirmsNoOcrRuntimeCall,
    isolationAuditConfirmsNoPhotoInputProcessing:
      auditResult.isolationAuditConfirmsNoPhotoInputProcessing,
    isolationAuditConfirmsNoFileInputProcessing:
      auditResult.isolationAuditConfirmsNoFileInputProcessing,
    isolationAuditConfirmsNoDocumentParsing: auditResult.isolationAuditConfirmsNoDocumentParsing,
    isolationAuditConfirmsNoRawDocumentStorage:
      auditResult.isolationAuditConfirmsNoRawDocumentStorage,
    isolationAuditConfirmsNoModelOutputStorage:
      auditResult.isolationAuditConfirmsNoModelOutputStorage,
    isolationAuditConfirmsNoPromptStorage: auditResult.isolationAuditConfirmsNoPromptStorage,
    isolationAuditConfirmsNoUserVisibleOutput:
      auditResult.isolationAuditConfirmsNoUserVisibleOutput,
    isolationAuditConfirmsNoCustomerFacingExplanation:
      auditResult.isolationAuditConfirmsNoCustomerFacingExplanation,
    isolationAuditConfirmsNoEvidenceEvaluation:
      auditResult.isolationAuditConfirmsNoEvidenceEvaluation,
    isolationAuditConfirmsNoClaimAuthorization:
      auditResult.isolationAuditConfirmsNoClaimAuthorization,
    isolationAuditConfirmsNoDeadlineCalculation:
      auditResult.isolationAuditConfirmsNoDeadlineCalculation,
    isolationAuditConfirmsNoLegalCertainty: auditResult.isolationAuditConfirmsNoLegalCertainty,
    isolationAuditConfirmsNoRuntimePipelineExecution:
      auditResult.isolationAuditConfirmsNoRuntimePipelineExecution,
    isolationAuditConfirmsNoDocumentPipelineExecution:
      auditResult.isolationAuditConfirmsNoDocumentPipelineExecution,
    isolationAuditConfirmsNoOcrPipelineExecution:
      auditResult.isolationAuditConfirmsNoOcrPipelineExecution,
    isolationAuditConfirmsNoPaymentPipelineExecution:
      auditResult.isolationAuditConfirmsNoPaymentPipelineExecution,
    isolationAuditConfirmsNoUserVisiblePipelineExecution:
      auditResult.isolationAuditConfirmsNoUserVisiblePipelineExecution,

    isolationBoundaryRequiresFeatureFlagDefaultOff:
      auditResult.isolationBoundaryRequiresFeatureFlagDefaultOff,
    isolationBoundaryRequiresKillSwitchBeforeRuntime:
      auditResult.isolationBoundaryRequiresKillSwitchBeforeRuntime,
    isolationBoundaryRequiresServerSideOnlyProcessing:
      auditResult.isolationBoundaryRequiresServerSideOnlyProcessing,
    isolationBoundaryRequiresNoClientSideSecrets:
      auditResult.isolationBoundaryRequiresNoClientSideSecrets,
    isolationBoundaryRequiresNoPersistenceByDefault:
      auditResult.isolationBoundaryRequiresNoPersistenceByDefault,
    isolationBoundaryRequiresEphemeralProcessingByDefault:
      auditResult.isolationBoundaryRequiresEphemeralProcessingByDefault,
    isolationBoundaryRequiresRedactionBeforeModelUse:
      auditResult.isolationBoundaryRequiresRedactionBeforeModelUse,
    isolationBoundaryRequiresOcrOutputUntrusted:
      auditResult.isolationBoundaryRequiresOcrOutputUntrusted,
    isolationBoundaryRequiresEvidenceGatesBeforeInterpretation:
      auditResult.isolationBoundaryRequiresEvidenceGatesBeforeInterpretation,
    isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay:
      auditResult.isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay,
    isolationBoundaryRequiresPrivacyNoticeBeforeUpload:
      auditResult.isolationBoundaryRequiresPrivacyNoticeBeforeUpload,
    isolationBoundaryRequiresRateLimitBeforePublicExposure:
      auditResult.isolationBoundaryRequiresRateLimitBeforePublicExposure,
    isolationBoundaryRequiresAbuseDetectionBeforePublicExposure:
      auditResult.isolationBoundaryRequiresAbuseDetectionBeforePublicExposure,
    isolationBoundaryRequiresAuditTraceNoRawContent:
      auditResult.isolationBoundaryRequiresAuditTraceNoRawContent,
    isolationBoundaryRequiresFailureNoChargePolicy:
      auditResult.isolationBoundaryRequiresFailureNoChargePolicy,
    isolationBoundaryRequiresManualOperatorConfirmationForHighRisk:
      auditResult.isolationBoundaryRequiresManualOperatorConfirmationForHighRisk,
    isolationBoundaryRequiresExplicitGoLiveApproval:
      auditResult.isolationBoundaryRequiresExplicitGoLiveApproval,
    isolationBoundaryRequiresSeparateProductionReadinessReview:
      auditResult.isolationBoundaryRequiresSeparateProductionReadinessReview,

    isolationAuditConfirmsFreeQuestionModeRemainsFree:
      auditResult.isolationAuditConfirmsFreeQuestionModeRemainsFree,
    isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation:
      auditResult.isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation,
    isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      auditResult.isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa:
      auditResult.isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa,
    isolationAuditConfirmsFullDocumentRedirectFromFreeQa:
      auditResult.isolationAuditConfirmsFullDocumentRedirectFromFreeQa,
    isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation:
      auditResult.isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation,
    isolationAuditConfirmsFailureNoChargePolicy:
      auditResult.isolationAuditConfirmsFailureNoChargePolicy,
    isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks:
      auditResult.isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks,
    isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid:
      auditResult.isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid,

    executionSequenceActuallyExecuted: auditResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: auditResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: auditResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: auditResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: auditResult.paymentPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: auditResult.userVisiblePipelineActuallyExecuted,

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

    exactDeadlineCalculationAuthorized: auditResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: auditResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: auditResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: auditResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: auditResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: auditResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: auditResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: auditResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: auditResult.publicRuntimeEnabled,
    persistenceUsed: auditResult.persistenceUsed,
    neverUserVisible: auditResult.neverUserVisible,

    finalAuthorizationDecisionOnly: true,
    finalAuthorizationDecisionMade: true,
    controlledRealDocumentRuntimePlanningChainClosed: prereqAllPassed && prereqReady,
    controlledRealDocumentRuntimePlanningChainPassed: prereqAllPassed && prereqReady,
    goLiveAuthorizationGranted: false,

    finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization:
      prereqAllPassed && prereqReady,
    finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization:
      prereqAllPassed && prereqReady,
    finalDecisionProductionBlockedUntilSeparateProductionReadinessReview:
      prereqAllPassed && prereqReady,
    finalDecisionExplicitGoLiveApprovalStillRequired: prereqAllPassed && prereqReady,
    finalDecisionManualOperatorConfirmationStillRequired: prereqAllPassed && prereqReady,
    finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: prereqAllPassed && prereqReady,
    finalDecisionFeatureFlagMustRemainDefaultOff: prereqAllPassed && prereqReady,
    finalDecisionKillSwitchMustExistBeforeRuntime: prereqAllPassed && prereqReady,

    finalDecisionConfirmsNoOpenAiCall: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoFetchCall: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoProcessEnvRead: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoSdkUsage: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNo8x3AcRerun: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoSmartTalkRuntimeCall: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoBranchCMutation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoPublicRouteMutation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoUiMutation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoSupabaseMutation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoStorageMutation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoDatabaseWrite: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoAuditPersistence: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoPaymentRuntimeCall: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoOcrRuntimeCall: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoPhotoInputProcessing: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoFileInputProcessing: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoDocumentParsing: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoRawDocumentStorage: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoModelOutputStorage: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoPromptStorage: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoUserVisibleOutput: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoCustomerFacingExplanation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoEvidenceEvaluation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoClaimAuthorization: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoDeadlineCalculation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoLegalCertainty: prereqAllPassed && prereqReady,

    finalDecisionConfirmsFeatureFlagDefaultOffRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsKillSwitchRequiredBeforeRuntime: prereqAllPassed && prereqReady,
    finalDecisionConfirmsServerSideOnlyProcessingRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoClientSideSecretsAllowed: prereqAllPassed && prereqReady,
    finalDecisionConfirmsNoPersistenceByDefault: prereqAllPassed && prereqReady,
    finalDecisionConfirmsEphemeralProcessingByDefault: prereqAllPassed && prereqReady,
    finalDecisionConfirmsRedactionBeforeModelUseRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsOcrOutputUntrusted: prereqAllPassed && prereqReady,
    finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload: prereqAllPassed && prereqReady,
    finalDecisionConfirmsRateLimitRequiredBeforePublicExposure: prereqAllPassed && prereqReady,
    finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsAuditTraceNoRawContentRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsFailureNoChargePolicyRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsExplicitGoLiveApprovalRequired: prereqAllPassed && prereqReady,
    finalDecisionConfirmsSeparateProductionReadinessReviewRequired:
      prereqAllPassed && prereqReady,

    finalDecisionConfirmsFreeQuestionModeRemainsFree: prereqAllPassed && prereqReady,
    finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      prereqAllPassed && prereqReady,
    finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa: prereqAllPassed && prereqReady,
    finalDecisionConfirmsFullDocumentRedirectFromFreeQa: prereqAllPassed && prereqReady,
    finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation: prereqAllPassed && prereqReady,
    finalDecisionConfirmsFailureNoChargePolicy: prereqAllPassed && prereqReady,
    finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks: prereqAllPassed && prereqReady,
    finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid: prereqAllPassed && prereqReady,

    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase:
      prereqAllPassed && prereqReady,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
  };

  // ── Step 3: Validate canonical final authorization decision input ──────────
  const decisionValidation = validateFinalAuthorizationDecisionInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const decisionAccepted = decisionValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5E checkId wrong", override: { prereqCheckId: "8.5D" } },
    { label: "8.5E allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeIsolationAuditAccepted false", override: { controlledRealDocumentRuntimeIsolationAuditAccepted: false } },
    { label: "runtimeIsolationAuditOnly false", override: { runtimeIsolationAuditOnly: false } },
    { label: "runtimeIsolationAuditPerformed false", override: { runtimeIsolationAuditPerformed: false } },
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
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
    { label: "isolationAuditConfirmsNoOpenAiCall false", override: { isolationAuditConfirmsNoOpenAiCall: false } },
    { label: "isolationAuditConfirmsNoFetchCall false", override: { isolationAuditConfirmsNoFetchCall: false } },
    { label: "isolationAuditConfirmsNoProcessEnvRead false", override: { isolationAuditConfirmsNoProcessEnvRead: false } },
    { label: "isolationAuditConfirmsNoSdkUsage false", override: { isolationAuditConfirmsNoSdkUsage: false } },
    { label: "isolationAuditConfirmsNo8x3AcRerun false", override: { isolationAuditConfirmsNo8x3AcRerun: false } },
    { label: "isolationAuditConfirmsNoSmartTalkRuntimeCall false", override: { isolationAuditConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "isolationAuditConfirmsNoBranchCMutation false", override: { isolationAuditConfirmsNoBranchCMutation: false } },
    { label: "isolationAuditConfirmsNoPublicRouteMutation false", override: { isolationAuditConfirmsNoPublicRouteMutation: false } },
    { label: "isolationAuditConfirmsNoUiMutation false", override: { isolationAuditConfirmsNoUiMutation: false } },
    { label: "isolationAuditConfirmsNoSupabaseMutation false", override: { isolationAuditConfirmsNoSupabaseMutation: false } },
    { label: "isolationAuditConfirmsNoStorageMutation false", override: { isolationAuditConfirmsNoStorageMutation: false } },
    { label: "isolationAuditConfirmsNoDatabaseWrite false", override: { isolationAuditConfirmsNoDatabaseWrite: false } },
    { label: "isolationAuditConfirmsNoAuditPersistence false", override: { isolationAuditConfirmsNoAuditPersistence: false } },
    { label: "isolationAuditConfirmsNoPaymentRuntimeCall false", override: { isolationAuditConfirmsNoPaymentRuntimeCall: false } },
    { label: "isolationAuditConfirmsNoOcrRuntimeCall false", override: { isolationAuditConfirmsNoOcrRuntimeCall: false } },
    { label: "isolationAuditConfirmsNoPhotoInputProcessing false", override: { isolationAuditConfirmsNoPhotoInputProcessing: false } },
    { label: "isolationAuditConfirmsNoFileInputProcessing false", override: { isolationAuditConfirmsNoFileInputProcessing: false } },
    { label: "isolationAuditConfirmsNoDocumentParsing false", override: { isolationAuditConfirmsNoDocumentParsing: false } },
    { label: "isolationAuditConfirmsNoRawDocumentStorage false", override: { isolationAuditConfirmsNoRawDocumentStorage: false } },
    { label: "isolationAuditConfirmsNoModelOutputStorage false", override: { isolationAuditConfirmsNoModelOutputStorage: false } },
    { label: "isolationAuditConfirmsNoPromptStorage false", override: { isolationAuditConfirmsNoPromptStorage: false } },
    { label: "isolationAuditConfirmsNoUserVisibleOutput false", override: { isolationAuditConfirmsNoUserVisibleOutput: false } },
    { label: "isolationAuditConfirmsNoCustomerFacingExplanation false", override: { isolationAuditConfirmsNoCustomerFacingExplanation: false } },
    { label: "isolationAuditConfirmsNoEvidenceEvaluation false", override: { isolationAuditConfirmsNoEvidenceEvaluation: false } },
    { label: "isolationAuditConfirmsNoClaimAuthorization false", override: { isolationAuditConfirmsNoClaimAuthorization: false } },
    { label: "isolationAuditConfirmsNoDeadlineCalculation false", override: { isolationAuditConfirmsNoDeadlineCalculation: false } },
    { label: "isolationAuditConfirmsNoLegalCertainty false", override: { isolationAuditConfirmsNoLegalCertainty: false } },
    { label: "isolationAuditConfirmsNoRuntimePipelineExecution false", override: { isolationAuditConfirmsNoRuntimePipelineExecution: false } },
    { label: "isolationAuditConfirmsNoDocumentPipelineExecution false", override: { isolationAuditConfirmsNoDocumentPipelineExecution: false } },
    { label: "isolationAuditConfirmsNoOcrPipelineExecution false", override: { isolationAuditConfirmsNoOcrPipelineExecution: false } },
    { label: "isolationAuditConfirmsNoPaymentPipelineExecution false", override: { isolationAuditConfirmsNoPaymentPipelineExecution: false } },
    { label: "isolationAuditConfirmsNoUserVisiblePipelineExecution false", override: { isolationAuditConfirmsNoUserVisiblePipelineExecution: false } },
    { label: "isolationBoundaryRequiresFeatureFlagDefaultOff false", override: { isolationBoundaryRequiresFeatureFlagDefaultOff: false } },
    { label: "isolationBoundaryRequiresKillSwitchBeforeRuntime false", override: { isolationBoundaryRequiresKillSwitchBeforeRuntime: false } },
    { label: "isolationBoundaryRequiresServerSideOnlyProcessing false", override: { isolationBoundaryRequiresServerSideOnlyProcessing: false } },
    { label: "isolationBoundaryRequiresNoClientSideSecrets false", override: { isolationBoundaryRequiresNoClientSideSecrets: false } },
    { label: "isolationBoundaryRequiresNoPersistenceByDefault false", override: { isolationBoundaryRequiresNoPersistenceByDefault: false } },
    { label: "isolationBoundaryRequiresEphemeralProcessingByDefault false", override: { isolationBoundaryRequiresEphemeralProcessingByDefault: false } },
    { label: "isolationBoundaryRequiresRedactionBeforeModelUse false", override: { isolationBoundaryRequiresRedactionBeforeModelUse: false } },
    { label: "isolationBoundaryRequiresOcrOutputUntrusted false", override: { isolationBoundaryRequiresOcrOutputUntrusted: false } },
    { label: "isolationBoundaryRequiresEvidenceGatesBeforeInterpretation false", override: { isolationBoundaryRequiresEvidenceGatesBeforeInterpretation: false } },
    { label: "isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay false", override: { isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay: false } },
    { label: "isolationBoundaryRequiresPrivacyNoticeBeforeUpload false", override: { isolationBoundaryRequiresPrivacyNoticeBeforeUpload: false } },
    { label: "isolationBoundaryRequiresRateLimitBeforePublicExposure false", override: { isolationBoundaryRequiresRateLimitBeforePublicExposure: false } },
    { label: "isolationBoundaryRequiresAbuseDetectionBeforePublicExposure false", override: { isolationBoundaryRequiresAbuseDetectionBeforePublicExposure: false } },
    { label: "isolationBoundaryRequiresAuditTraceNoRawContent false", override: { isolationBoundaryRequiresAuditTraceNoRawContent: false } },
    { label: "isolationBoundaryRequiresFailureNoChargePolicy false", override: { isolationBoundaryRequiresFailureNoChargePolicy: false } },
    { label: "isolationBoundaryRequiresManualOperatorConfirmationForHighRisk false", override: { isolationBoundaryRequiresManualOperatorConfirmationForHighRisk: false } },
    { label: "isolationBoundaryRequiresExplicitGoLiveApproval false", override: { isolationBoundaryRequiresExplicitGoLiveApproval: false } },
    { label: "isolationBoundaryRequiresSeparateProductionReadinessReview false", override: { isolationBoundaryRequiresSeparateProductionReadinessReview: false } },
    { label: "isolationAuditConfirmsFreeQuestionModeRemainsFree false", override: { isolationAuditConfirmsFreeQuestionModeRemainsFree: false } },
    { label: "isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation false", override: { isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation: false } },
    { label: "isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation false", override: { isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation: false } },
    { label: "isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa false", override: { isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa: false } },
    { label: "isolationAuditConfirmsFullDocumentRedirectFromFreeQa false", override: { isolationAuditConfirmsFullDocumentRedirectFromFreeQa: false } },
    { label: "isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation false", override: { isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation: false } },
    { label: "isolationAuditConfirmsFailureNoChargePolicy false", override: { isolationAuditConfirmsFailureNoChargePolicy: false } },
    { label: "isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks false", override: { isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid false", override: { isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid: false } },
    { label: "executionSequenceActuallyExecuted true", override: { executionSequenceActuallyExecuted: true } },
    { label: "runtimePipelineActuallyExecuted true", override: { runtimePipelineActuallyExecuted: true } },
    { label: "documentPipelineActuallyExecuted true", override: { documentPipelineActuallyExecuted: true } },
    { label: "ocrPipelineActuallyExecuted true", override: { ocrPipelineActuallyExecuted: true } },
    { label: "paymentPipelineActuallyExecuted true", override: { paymentPipelineActuallyExecuted: true } },
    { label: "userVisiblePipelineActuallyExecuted true", override: { userVisiblePipelineActuallyExecuted: true } },
    { label: "readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision false", override: { readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: false } },
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
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "finalAuthorizationDecisionOnly false", override: { finalAuthorizationDecisionOnly: false } },
    { label: "finalAuthorizationDecisionMade false", override: { finalAuthorizationDecisionMade: false } },
    { label: "controlledRealDocumentRuntimePlanningChainClosed false", override: { controlledRealDocumentRuntimePlanningChainClosed: false } },
    { label: "controlledRealDocumentRuntimePlanningChainPassed false", override: { controlledRealDocumentRuntimePlanningChainPassed: false } },
    { label: "runtimeAuthorizationGranted true (8.5F check)", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true (8.5F check)", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true (8.5F check)", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5F check)", override: { finalAuthorizationGranted: true } },
    { label: "goLiveAuthorizationGranted true", override: { goLiveAuthorizationGranted: true } },
    { label: "finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization false", override: { finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization: false } },
    { label: "finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization false", override: { finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization: false } },
    { label: "finalDecisionProductionBlockedUntilSeparateProductionReadinessReview false", override: { finalDecisionProductionBlockedUntilSeparateProductionReadinessReview: false } },
    { label: "finalDecisionExplicitGoLiveApprovalStillRequired false", override: { finalDecisionExplicitGoLiveApprovalStillRequired: false } },
    { label: "finalDecisionManualOperatorConfirmationStillRequired false", override: { finalDecisionManualOperatorConfirmationStillRequired: false } },
    { label: "finalDecisionFreshRiskReviewStillRequiredBeforeRuntime false", override: { finalDecisionFreshRiskReviewStillRequiredBeforeRuntime: false } },
    { label: "finalDecisionFeatureFlagMustRemainDefaultOff false", override: { finalDecisionFeatureFlagMustRemainDefaultOff: false } },
    { label: "finalDecisionKillSwitchMustExistBeforeRuntime false", override: { finalDecisionKillSwitchMustExistBeforeRuntime: false } },
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
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase false", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateFinalAuthorizationDecisionInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    decisionAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5F: controlled real-document runtime final authorization decision layer — depends on completed 8.5E controlled real-document runtime isolation audit",
    "8.5F is final-decision-only",
    "controlled real-document runtime planning chain 8.5A–8.5F is closed and passed",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no final go-live authorization was granted",
    "runtime may proceed only after a separate explicit runtime authorization phase",
    "pilot may proceed only after a separate explicit pilot authorization phase",
    "production remains blocked until a separate production readiness review",
    "explicit go-live approval remains required",
    "manual operator confirmation remains required before runtime",
    "fresh risk review remains required before runtime",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5F",
    "8.3AC was not re-run",
    "runtime execution sequence remains defined but not executed",
    "all runtime, document, OCR, payment, and user-visible pipelines remain unexecuted",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "high-risk safety contract still applies even when paid",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true — planning readiness only, not runtime authorization",
    `8.5E prerequisite: allPassed=${auditResult.allPassed}, readyFor8x5F=${auditResult.readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision}`,
    `final authorization decision input validation: ${decisionAccepted ? "accepted" : "REJECTED"} — reasons: ${decisionValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5F allPassed: true — controlled real-document runtime final authorization decision accepted"
    );
    notes.push(
      "controlled real-document runtime planning chain 8.5A–8.5F is fully closed and passed"
    );
  }

  return {
    checkId: "8.5F",
    allPassed,
    runtimeIsolationAuditReadyForFinalAuthorizationDecision:
      canonicalInput.controlledRealDocumentRuntimeIsolationAuditAccepted,
    controlledRealDocumentRuntimeFinalAuthorizationDecisionAccepted: allPassed,
    finalAuthorizationDecisionOnly: true,
    finalAuthorizationDecisionMade: true,
    controlledRealDocumentRuntimePlanningChainClosed:
      canonicalInput.controlledRealDocumentRuntimePlanningChainClosed,
    controlledRealDocumentRuntimePlanningChainPassed:
      canonicalInput.controlledRealDocumentRuntimePlanningChainPassed,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization:
      canonicalInput.finalDecisionRuntimeMayProceedOnlyAfterSeparateExplicitAuthorization,
    finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization:
      canonicalInput.finalDecisionPilotMayProceedOnlyAfterSeparateExplicitAuthorization,
    finalDecisionProductionBlockedUntilSeparateProductionReadinessReview:
      canonicalInput.finalDecisionProductionBlockedUntilSeparateProductionReadinessReview,
    finalDecisionExplicitGoLiveApprovalStillRequired:
      canonicalInput.finalDecisionExplicitGoLiveApprovalStillRequired,
    finalDecisionManualOperatorConfirmationStillRequired:
      canonicalInput.finalDecisionManualOperatorConfirmationStillRequired,
    finalDecisionFreshRiskReviewStillRequiredBeforeRuntime:
      canonicalInput.finalDecisionFreshRiskReviewStillRequiredBeforeRuntime,
    finalDecisionFeatureFlagMustRemainDefaultOff:
      canonicalInput.finalDecisionFeatureFlagMustRemainDefaultOff,
    finalDecisionKillSwitchMustExistBeforeRuntime:
      canonicalInput.finalDecisionKillSwitchMustExistBeforeRuntime,

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

    finalDecisionConfirmsNoOpenAiCall: canonicalInput.finalDecisionConfirmsNoOpenAiCall,
    finalDecisionConfirmsNoFetchCall: canonicalInput.finalDecisionConfirmsNoFetchCall,
    finalDecisionConfirmsNoProcessEnvRead: canonicalInput.finalDecisionConfirmsNoProcessEnvRead,
    finalDecisionConfirmsNoSdkUsage: canonicalInput.finalDecisionConfirmsNoSdkUsage,
    finalDecisionConfirmsNo8x3AcRerun: canonicalInput.finalDecisionConfirmsNo8x3AcRerun,
    finalDecisionConfirmsNoSmartTalkRuntimeCall:
      canonicalInput.finalDecisionConfirmsNoSmartTalkRuntimeCall,
    finalDecisionConfirmsNoBranchCMutation: canonicalInput.finalDecisionConfirmsNoBranchCMutation,
    finalDecisionConfirmsNoPublicRouteMutation:
      canonicalInput.finalDecisionConfirmsNoPublicRouteMutation,
    finalDecisionConfirmsNoUiMutation: canonicalInput.finalDecisionConfirmsNoUiMutation,
    finalDecisionConfirmsNoSupabaseMutation: canonicalInput.finalDecisionConfirmsNoSupabaseMutation,
    finalDecisionConfirmsNoStorageMutation: canonicalInput.finalDecisionConfirmsNoStorageMutation,
    finalDecisionConfirmsNoDatabaseWrite: canonicalInput.finalDecisionConfirmsNoDatabaseWrite,
    finalDecisionConfirmsNoAuditPersistence: canonicalInput.finalDecisionConfirmsNoAuditPersistence,
    finalDecisionConfirmsNoPaymentRuntimeCall:
      canonicalInput.finalDecisionConfirmsNoPaymentRuntimeCall,
    finalDecisionConfirmsNoOcrRuntimeCall: canonicalInput.finalDecisionConfirmsNoOcrRuntimeCall,
    finalDecisionConfirmsNoPhotoInputProcessing:
      canonicalInput.finalDecisionConfirmsNoPhotoInputProcessing,
    finalDecisionConfirmsNoFileInputProcessing:
      canonicalInput.finalDecisionConfirmsNoFileInputProcessing,
    finalDecisionConfirmsNoDocumentParsing: canonicalInput.finalDecisionConfirmsNoDocumentParsing,
    finalDecisionConfirmsNoRawDocumentStorage:
      canonicalInput.finalDecisionConfirmsNoRawDocumentStorage,
    finalDecisionConfirmsNoModelOutputStorage:
      canonicalInput.finalDecisionConfirmsNoModelOutputStorage,
    finalDecisionConfirmsNoPromptStorage: canonicalInput.finalDecisionConfirmsNoPromptStorage,
    finalDecisionConfirmsNoUserVisibleOutput:
      canonicalInput.finalDecisionConfirmsNoUserVisibleOutput,
    finalDecisionConfirmsNoCustomerFacingExplanation:
      canonicalInput.finalDecisionConfirmsNoCustomerFacingExplanation,
    finalDecisionConfirmsNoEvidenceEvaluation:
      canonicalInput.finalDecisionConfirmsNoEvidenceEvaluation,
    finalDecisionConfirmsNoClaimAuthorization:
      canonicalInput.finalDecisionConfirmsNoClaimAuthorization,
    finalDecisionConfirmsNoDeadlineCalculation:
      canonicalInput.finalDecisionConfirmsNoDeadlineCalculation,
    finalDecisionConfirmsNoLegalCertainty: canonicalInput.finalDecisionConfirmsNoLegalCertainty,

    finalDecisionConfirmsFeatureFlagDefaultOffRequired:
      canonicalInput.finalDecisionConfirmsFeatureFlagDefaultOffRequired,
    finalDecisionConfirmsKillSwitchRequiredBeforeRuntime:
      canonicalInput.finalDecisionConfirmsKillSwitchRequiredBeforeRuntime,
    finalDecisionConfirmsServerSideOnlyProcessingRequired:
      canonicalInput.finalDecisionConfirmsServerSideOnlyProcessingRequired,
    finalDecisionConfirmsNoClientSideSecretsAllowed:
      canonicalInput.finalDecisionConfirmsNoClientSideSecretsAllowed,
    finalDecisionConfirmsNoPersistenceByDefault:
      canonicalInput.finalDecisionConfirmsNoPersistenceByDefault,
    finalDecisionConfirmsEphemeralProcessingByDefault:
      canonicalInput.finalDecisionConfirmsEphemeralProcessingByDefault,
    finalDecisionConfirmsRedactionBeforeModelUseRequired:
      canonicalInput.finalDecisionConfirmsRedactionBeforeModelUseRequired,
    finalDecisionConfirmsOcrOutputUntrusted: canonicalInput.finalDecisionConfirmsOcrOutputUntrusted,
    finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation:
      canonicalInput.finalDecisionConfirmsEvidenceGatesRequiredBeforeInterpretation,
    finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      canonicalInput.finalDecisionConfirmsUserVisibleOutputContractRequiredBeforeDisplay,
    finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload:
      canonicalInput.finalDecisionConfirmsPrivacyNoticeRequiredBeforeUpload,
    finalDecisionConfirmsRateLimitRequiredBeforePublicExposure:
      canonicalInput.finalDecisionConfirmsRateLimitRequiredBeforePublicExposure,
    finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure:
      canonicalInput.finalDecisionConfirmsAbuseDetectionRequiredBeforePublicExposure,
    finalDecisionConfirmsAuditTraceNoRawContentRequired:
      canonicalInput.finalDecisionConfirmsAuditTraceNoRawContentRequired,
    finalDecisionConfirmsFailureNoChargePolicyRequired:
      canonicalInput.finalDecisionConfirmsFailureNoChargePolicyRequired,
    finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired:
      canonicalInput.finalDecisionConfirmsManualOperatorConfirmationForHighRiskRequired,
    finalDecisionConfirmsExplicitGoLiveApprovalRequired:
      canonicalInput.finalDecisionConfirmsExplicitGoLiveApprovalRequired,
    finalDecisionConfirmsSeparateProductionReadinessReviewRequired:
      canonicalInput.finalDecisionConfirmsSeparateProductionReadinessReviewRequired,

    finalDecisionConfirmsFreeQuestionModeRemainsFree:
      canonicalInput.finalDecisionConfirmsFreeQuestionModeRemainsFree,
    finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation:
      canonicalInput.finalDecisionConfirmsPaidDocumentModeRequiredForFullExplanation,
    finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      canonicalInput.finalDecisionConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa:
      canonicalInput.finalDecisionConfirmsDocumentBypassGuardRequiredForFreeQa,
    finalDecisionConfirmsFullDocumentRedirectFromFreeQa:
      canonicalInput.finalDecisionConfirmsFullDocumentRedirectFromFreeQa,
    finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation:
      canonicalInput.finalDecisionConfirmsPaymentBoundaryBeforeFullExplanation,
    finalDecisionConfirmsFailureNoChargePolicy:
      canonicalInput.finalDecisionConfirmsFailureNoChargePolicy,
    finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.finalDecisionConfirmsPaymentDoesNotOverrideSafetyBlocks,
    finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid:
      canonicalInput.finalDecisionConfirmsHighRiskSafetyContractEvenWhenPaid,

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

    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase:
      canonicalInput.readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase,
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
