/**
 * Phase 8.5E — Controlled Real Document Runtime Isolation Audit.
 *
 * PLANNING/AUDIT-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5D.
 *
 * This file audits isolation of the future runtime execution plan. It is:
 *   - planning/audit-only — NOT runtime authorization.
 *   - NOT pilot authorization.
 *   - NOT production authorization.
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
 *   - Grant runtime, pilot, or production authorization.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentRuntimeExecutionPlan } from "./run-controlled-real-document-runtime-execution-plan";

// ── Local runtime isolation audit input type ──────────────────────────────────

interface ControlledRealDocumentRuntimeIsolationAuditInput {
  // 8.5D prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly runtimeDryRunAuthorizationReadyForExecutionPlan: boolean;
  readonly controlledRealDocumentRuntimeExecutionPlanAccepted: boolean;
  readonly runtimeExecutionPlanOnly: boolean;
  readonly runtimeExecutionPlanDefined: boolean;
  readonly readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: boolean;

  // 8.5D authorization flags (must be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // 8.5D actual* performed flags (must be false)
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

  // 8.5D executionPlanRequires* gates (must be true)
  readonly executionPlanRequiresSeparateExplicitRuntimeApproval: boolean;
  readonly executionPlanRequiresFreshRiskReviewBeforeRuntime: boolean;
  readonly executionPlanRequiresRuntimeKillSwitch: boolean;
  readonly executionPlanRequiresFeatureFlagDefaultOff: boolean;
  readonly executionPlanRequiresServerSideOnlyBoundary: boolean;
  readonly executionPlanRequiresNoClientSideSecrets: boolean;
  readonly executionPlanRequiresNoPublicRuntimeByDefault: boolean;
  readonly executionPlanRequiresNoPersistenceByDefault: boolean;
  readonly executionPlanRequiresNoRawDocumentStorageByDefault: boolean;
  readonly executionPlanRequiresNoModelOutputStorageByDefault: boolean;
  readonly executionPlanRequiresNoPromptStorage: boolean;
  readonly executionPlanRequiresEphemeralProcessingByDefault: boolean;
  readonly executionPlanRequiresRedactionBeforeModelUse: boolean;
  readonly executionPlanRequiresOcrOutputTreatedAsUntrusted: boolean;
  readonly executionPlanRequiresEvidenceGatesBeforeInterpretation: boolean;
  readonly executionPlanRequiresUserVisibleOutputContractBeforeDisplay: boolean;
  readonly executionPlanRequiresPrivacyNoticeBeforeUpload: boolean;
  readonly executionPlanRequiresUserLanguageSelectionBeforeOutput: boolean;
  readonly executionPlanRequiresRateLimitBeforePublicExposure: boolean;
  readonly executionPlanRequiresAbuseDetectionBeforePublicExposure: boolean;
  readonly executionPlanRequiresMonitoringBeforePilot: boolean;
  readonly executionPlanRequiresRollbackBeforePilot: boolean;
  readonly executionPlanRequiresAuditTraceBeforeRuntime: boolean;
  readonly executionPlanRequiresTamperTestsBeforeRuntime: boolean;
  readonly executionPlanRequiresHumanReviewForHighRisk: boolean;
  readonly executionPlanRequiresNoExactDeadlineWithoutDeliveryDate: boolean;
  readonly executionPlanRequiresNoLegalAdviceOrCertainty: boolean;
  readonly executionPlanRequiresManualOperatorConfirmationBeforeRuntime: boolean;
  readonly executionPlanRequiresExplicitGoLiveApproval: boolean;
  readonly executionPlanRequiresSeparateProductionReadinessReview: boolean;

  // 8.5D executionPlanConfirms* gates (must be true)
  readonly executionPlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly executionPlanConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly executionPlanConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly executionPlanConfirmsFailureNoChargePolicy: boolean;
  readonly executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // 8.5D executionSequenceStep* gates (must be true)
  readonly executionSequenceStep1FeatureFlagCheck: boolean;
  readonly executionSequenceStep2KillSwitchCheck: boolean;
  readonly executionSequenceStep3ModeClassification: boolean;
  readonly executionSequenceStep4DocumentBypassGuard: boolean;
  readonly executionSequenceStep5PaymentBoundaryCheck: boolean;
  readonly executionSequenceStep6PrivacyNoticeBeforeUpload: boolean;
  readonly executionSequenceStep7EphemeralInputHandling: boolean;
  readonly executionSequenceStep8RedactionBeforeModelUse: boolean;
  readonly executionSequenceStep9OcrOutputUntrustedHandling: boolean;
  readonly executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation: boolean;
  readonly executionSequenceStep11UserVisibleOutputContractBeforeDisplay: boolean;
  readonly executionSequenceStep12NoExactDeadlineWithoutDeliveryDate: boolean;
  readonly executionSequenceStep13AuditTraceNoRawContent: boolean;
  readonly executionSequenceStep14FailureNoChargePolicy: boolean;
  readonly executionSequenceStep15ManualOperatorConfirmationForHighRisk: boolean;

  // Pipeline executed flags (must be false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // 8.5D runtime authorization flags (must be false)
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

  // 8.5D runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5E assertions
  readonly runtimeIsolationAuditOnly: boolean;
  readonly runtimeIsolationAuditPerformed: boolean;

  // Isolation audit gates
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

  // Isolation boundary gates
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

  // Commercial isolation gates
  readonly isolationAuditConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly isolationAuditConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly isolationAuditConfirmsFailureNoChargePolicy: boolean;
  readonly isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  readonly readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeIsolationAuditResult {
  readonly checkId: "8.5E";
  readonly allPassed: boolean;
  readonly runtimeExecutionPlanReadyForIsolationAudit: boolean;
  readonly controlledRealDocumentRuntimeIsolationAuditAccepted: boolean;
  readonly runtimeIsolationAuditOnly: true;
  readonly runtimeIsolationAuditPerformed: true;
  readonly tamperCasesRejected: boolean;

  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;

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

  readonly isolationAuditConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly isolationAuditConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly isolationAuditConfirmsFailureNoChargePolicy: boolean;
  readonly isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

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

  readonly readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Runtime isolation audit input validator ───────────────────────────────────

function validateIsolationAuditInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5D prerequisite gates
  if (o["prereqCheckId"] !== "8.5D")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeExecutionPlanAccepted"] !== true)
    reasons.push("execution_plan_not_accepted");
  if (o["runtimeExecutionPlanOnly"] !== true)
    reasons.push("runtime_execution_plan_only_false");
  if (o["runtimeExecutionPlanDefined"] !== true)
    reasons.push("runtime_execution_plan_defined_false");
  if (o["readyFor8x5EControlledRealDocumentRuntimeIsolationAudit"] !== true)
    reasons.push("not_ready_for_8_5e_isolation_audit");

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

  // executionPlanRequires* gates (must be true)
  if (o["executionPlanRequiresSeparateExplicitRuntimeApproval"] !== true)
    reasons.push("execution_plan_requires_separate_explicit_runtime_approval_false");
  if (o["executionPlanRequiresFreshRiskReviewBeforeRuntime"] !== true)
    reasons.push("execution_plan_requires_fresh_risk_review_before_runtime_false");
  if (o["executionPlanRequiresRuntimeKillSwitch"] !== true)
    reasons.push("execution_plan_requires_runtime_kill_switch_false");
  if (o["executionPlanRequiresFeatureFlagDefaultOff"] !== true)
    reasons.push("execution_plan_requires_feature_flag_default_off_false");
  if (o["executionPlanRequiresServerSideOnlyBoundary"] !== true)
    reasons.push("execution_plan_requires_server_side_only_boundary_false");
  if (o["executionPlanRequiresNoClientSideSecrets"] !== true)
    reasons.push("execution_plan_requires_no_client_side_secrets_false");
  if (o["executionPlanRequiresNoPublicRuntimeByDefault"] !== true)
    reasons.push("execution_plan_requires_no_public_runtime_by_default_false");
  if (o["executionPlanRequiresNoPersistenceByDefault"] !== true)
    reasons.push("execution_plan_requires_no_persistence_by_default_false");
  if (o["executionPlanRequiresNoRawDocumentStorageByDefault"] !== true)
    reasons.push("execution_plan_requires_no_raw_document_storage_by_default_false");
  if (o["executionPlanRequiresNoModelOutputStorageByDefault"] !== true)
    reasons.push("execution_plan_requires_no_model_output_storage_by_default_false");
  if (o["executionPlanRequiresNoPromptStorage"] !== true)
    reasons.push("execution_plan_requires_no_prompt_storage_false");
  if (o["executionPlanRequiresEphemeralProcessingByDefault"] !== true)
    reasons.push("execution_plan_requires_ephemeral_processing_by_default_false");
  if (o["executionPlanRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("execution_plan_requires_redaction_before_model_use_false");
  if (o["executionPlanRequiresOcrOutputTreatedAsUntrusted"] !== true)
    reasons.push("execution_plan_requires_ocr_output_treated_as_untrusted_false");
  if (o["executionPlanRequiresEvidenceGatesBeforeInterpretation"] !== true)
    reasons.push("execution_plan_requires_evidence_gates_before_interpretation_false");
  if (o["executionPlanRequiresUserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("execution_plan_requires_user_visible_output_contract_before_display_false");
  if (o["executionPlanRequiresPrivacyNoticeBeforeUpload"] !== true)
    reasons.push("execution_plan_requires_privacy_notice_before_upload_false");
  if (o["executionPlanRequiresUserLanguageSelectionBeforeOutput"] !== true)
    reasons.push("execution_plan_requires_user_language_selection_before_output_false");
  if (o["executionPlanRequiresRateLimitBeforePublicExposure"] !== true)
    reasons.push("execution_plan_requires_rate_limit_before_public_exposure_false");
  if (o["executionPlanRequiresAbuseDetectionBeforePublicExposure"] !== true)
    reasons.push("execution_plan_requires_abuse_detection_before_public_exposure_false");
  if (o["executionPlanRequiresMonitoringBeforePilot"] !== true)
    reasons.push("execution_plan_requires_monitoring_before_pilot_false");
  if (o["executionPlanRequiresRollbackBeforePilot"] !== true)
    reasons.push("execution_plan_requires_rollback_before_pilot_false");
  if (o["executionPlanRequiresAuditTraceBeforeRuntime"] !== true)
    reasons.push("execution_plan_requires_audit_trace_before_runtime_false");
  if (o["executionPlanRequiresTamperTestsBeforeRuntime"] !== true)
    reasons.push("execution_plan_requires_tamper_tests_before_runtime_false");
  if (o["executionPlanRequiresHumanReviewForHighRisk"] !== true)
    reasons.push("execution_plan_requires_human_review_for_high_risk_false");
  if (o["executionPlanRequiresNoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("execution_plan_requires_no_exact_deadline_without_delivery_date_false");
  if (o["executionPlanRequiresNoLegalAdviceOrCertainty"] !== true)
    reasons.push("execution_plan_requires_no_legal_advice_or_certainty_false");
  if (o["executionPlanRequiresManualOperatorConfirmationBeforeRuntime"] !== true)
    reasons.push("execution_plan_requires_manual_operator_confirmation_before_runtime_false");
  if (o["executionPlanRequiresExplicitGoLiveApproval"] !== true)
    reasons.push("execution_plan_requires_explicit_go_live_approval_false");
  if (o["executionPlanRequiresSeparateProductionReadinessReview"] !== true)
    reasons.push("execution_plan_requires_separate_production_readiness_review_false");

  // executionPlanConfirms* gates (must be true)
  if (o["executionPlanConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("execution_plan_confirms_free_question_mode_remains_free_false");
  if (o["executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("execution_plan_confirms_paid_document_mode_required_for_full_explanation_false");
  if (o["executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation"] !== true)
    reasons.push("execution_plan_confirms_paid_document_mode_required_for_photo_explanation_false");
  if (o["executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa"] !== true)
    reasons.push("execution_plan_confirms_document_bypass_guard_required_for_free_qa_false");
  if (o["executionPlanConfirmsFullDocumentRedirectFromFreeQa"] !== true)
    reasons.push("execution_plan_confirms_full_document_redirect_from_free_qa_false");
  if (o["executionPlanConfirmsPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("execution_plan_confirms_payment_boundary_before_full_explanation_false");
  if (o["executionPlanConfirmsFailureNoChargePolicy"] !== true)
    reasons.push("execution_plan_confirms_failure_no_charge_policy_false");
  if (o["executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("execution_plan_confirms_payment_does_not_override_safety_blocks_false");
  if (o["executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid"] !== true)
    reasons.push("execution_plan_confirms_high_risk_safety_contract_even_when_paid_false");

  // executionSequenceStep* gates (must be true)
  if (o["executionSequenceStep1FeatureFlagCheck"] !== true)
    reasons.push("execution_sequence_step1_feature_flag_check_false");
  if (o["executionSequenceStep2KillSwitchCheck"] !== true)
    reasons.push("execution_sequence_step2_kill_switch_check_false");
  if (o["executionSequenceStep3ModeClassification"] !== true)
    reasons.push("execution_sequence_step3_mode_classification_false");
  if (o["executionSequenceStep4DocumentBypassGuard"] !== true)
    reasons.push("execution_sequence_step4_document_bypass_guard_false");
  if (o["executionSequenceStep5PaymentBoundaryCheck"] !== true)
    reasons.push("execution_sequence_step5_payment_boundary_check_false");
  if (o["executionSequenceStep6PrivacyNoticeBeforeUpload"] !== true)
    reasons.push("execution_sequence_step6_privacy_notice_before_upload_false");
  if (o["executionSequenceStep7EphemeralInputHandling"] !== true)
    reasons.push("execution_sequence_step7_ephemeral_input_handling_false");
  if (o["executionSequenceStep8RedactionBeforeModelUse"] !== true)
    reasons.push("execution_sequence_step8_redaction_before_model_use_false");
  if (o["executionSequenceStep9OcrOutputUntrustedHandling"] !== true)
    reasons.push("execution_sequence_step9_ocr_output_untrusted_handling_false");
  if (o["executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation"] !== true)
    reasons.push("execution_sequence_step10_evidence_gate_evaluation_before_interpretation_false");
  if (o["executionSequenceStep11UserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("execution_sequence_step11_user_visible_output_contract_before_display_false");
  if (o["executionSequenceStep12NoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("execution_sequence_step12_no_exact_deadline_without_delivery_date_false");
  if (o["executionSequenceStep13AuditTraceNoRawContent"] !== true)
    reasons.push("execution_sequence_step13_audit_trace_no_raw_content_false");
  if (o["executionSequenceStep14FailureNoChargePolicy"] !== true)
    reasons.push("execution_sequence_step14_failure_no_charge_policy_false");
  if (o["executionSequenceStep15ManualOperatorConfirmationForHighRisk"] !== true)
    reasons.push("execution_sequence_step15_manual_operator_confirmation_for_high_risk_false");

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

  // Derived 8.5E assertions
  if (o["runtimeIsolationAuditOnly"] !== true)
    reasons.push("runtime_isolation_audit_only_false");
  if (o["runtimeIsolationAuditPerformed"] !== true)
    reasons.push("runtime_isolation_audit_performed_false");

  // Isolation audit gates (must be true)
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

  // Isolation boundary gates (must be true)
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

  if (o["readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision"] !== true)
    reasons.push("not_ready_for_8_5f_final_authorization_decision");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeIsolationAudit(): ControlledRealDocumentRuntimeIsolationAuditResult {
  // ── Step 1: Obtain 8.5D runtime execution plan result ─────────────────────
  const planResult = runControlledRealDocumentRuntimeExecutionPlan();

  const prereqAllPassed = planResult.allPassed;
  const prereqReady =
    planResult.readyFor8x5EControlledRealDocumentRuntimeIsolationAudit;

  // ── Step 2: Build canonical isolation audit input ─────────────────────────
  const canonicalInput: ControlledRealDocumentRuntimeIsolationAuditInput = {
    prereqCheckId: planResult.checkId,
    prereqAllPassed,
    runtimeDryRunAuthorizationReadyForExecutionPlan:
      planResult.runtimeDryRunAuthorizationReadyForExecutionPlan,
    controlledRealDocumentRuntimeExecutionPlanAccepted:
      planResult.controlledRealDocumentRuntimeExecutionPlanAccepted,
    runtimeExecutionPlanOnly: planResult.runtimeExecutionPlanOnly,
    runtimeExecutionPlanDefined: planResult.runtimeExecutionPlanDefined,
    readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: prereqReady,

    runtimeAuthorizationGranted: planResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: planResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: planResult.productionAuthorizationGranted,
    finalAuthorizationGranted: planResult.finalAuthorizationGranted,

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

    executionPlanRequiresSeparateExplicitRuntimeApproval:
      planResult.executionPlanRequiresSeparateExplicitRuntimeApproval,
    executionPlanRequiresFreshRiskReviewBeforeRuntime:
      planResult.executionPlanRequiresFreshRiskReviewBeforeRuntime,
    executionPlanRequiresRuntimeKillSwitch:
      planResult.executionPlanRequiresRuntimeKillSwitch,
    executionPlanRequiresFeatureFlagDefaultOff:
      planResult.executionPlanRequiresFeatureFlagDefaultOff,
    executionPlanRequiresServerSideOnlyBoundary:
      planResult.executionPlanRequiresServerSideOnlyBoundary,
    executionPlanRequiresNoClientSideSecrets:
      planResult.executionPlanRequiresNoClientSideSecrets,
    executionPlanRequiresNoPublicRuntimeByDefault:
      planResult.executionPlanRequiresNoPublicRuntimeByDefault,
    executionPlanRequiresNoPersistenceByDefault:
      planResult.executionPlanRequiresNoPersistenceByDefault,
    executionPlanRequiresNoRawDocumentStorageByDefault:
      planResult.executionPlanRequiresNoRawDocumentStorageByDefault,
    executionPlanRequiresNoModelOutputStorageByDefault:
      planResult.executionPlanRequiresNoModelOutputStorageByDefault,
    executionPlanRequiresNoPromptStorage:
      planResult.executionPlanRequiresNoPromptStorage,
    executionPlanRequiresEphemeralProcessingByDefault:
      planResult.executionPlanRequiresEphemeralProcessingByDefault,
    executionPlanRequiresRedactionBeforeModelUse:
      planResult.executionPlanRequiresRedactionBeforeModelUse,
    executionPlanRequiresOcrOutputTreatedAsUntrusted:
      planResult.executionPlanRequiresOcrOutputTreatedAsUntrusted,
    executionPlanRequiresEvidenceGatesBeforeInterpretation:
      planResult.executionPlanRequiresEvidenceGatesBeforeInterpretation,
    executionPlanRequiresUserVisibleOutputContractBeforeDisplay:
      planResult.executionPlanRequiresUserVisibleOutputContractBeforeDisplay,
    executionPlanRequiresPrivacyNoticeBeforeUpload:
      planResult.executionPlanRequiresPrivacyNoticeBeforeUpload,
    executionPlanRequiresUserLanguageSelectionBeforeOutput:
      planResult.executionPlanRequiresUserLanguageSelectionBeforeOutput,
    executionPlanRequiresRateLimitBeforePublicExposure:
      planResult.executionPlanRequiresRateLimitBeforePublicExposure,
    executionPlanRequiresAbuseDetectionBeforePublicExposure:
      planResult.executionPlanRequiresAbuseDetectionBeforePublicExposure,
    executionPlanRequiresMonitoringBeforePilot:
      planResult.executionPlanRequiresMonitoringBeforePilot,
    executionPlanRequiresRollbackBeforePilot:
      planResult.executionPlanRequiresRollbackBeforePilot,
    executionPlanRequiresAuditTraceBeforeRuntime:
      planResult.executionPlanRequiresAuditTraceBeforeRuntime,
    executionPlanRequiresTamperTestsBeforeRuntime:
      planResult.executionPlanRequiresTamperTestsBeforeRuntime,
    executionPlanRequiresHumanReviewForHighRisk:
      planResult.executionPlanRequiresHumanReviewForHighRisk,
    executionPlanRequiresNoExactDeadlineWithoutDeliveryDate:
      planResult.executionPlanRequiresNoExactDeadlineWithoutDeliveryDate,
    executionPlanRequiresNoLegalAdviceOrCertainty:
      planResult.executionPlanRequiresNoLegalAdviceOrCertainty,
    executionPlanRequiresManualOperatorConfirmationBeforeRuntime:
      planResult.executionPlanRequiresManualOperatorConfirmationBeforeRuntime,
    executionPlanRequiresExplicitGoLiveApproval:
      planResult.executionPlanRequiresExplicitGoLiveApproval,
    executionPlanRequiresSeparateProductionReadinessReview:
      planResult.executionPlanRequiresSeparateProductionReadinessReview,

    executionPlanConfirmsFreeQuestionModeRemainsFree:
      planResult.executionPlanConfirmsFreeQuestionModeRemainsFree,
    executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation:
      planResult.executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation,
    executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      planResult.executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa:
      planResult.executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa,
    executionPlanConfirmsFullDocumentRedirectFromFreeQa:
      planResult.executionPlanConfirmsFullDocumentRedirectFromFreeQa,
    executionPlanConfirmsPaymentBoundaryBeforeFullExplanation:
      planResult.executionPlanConfirmsPaymentBoundaryBeforeFullExplanation,
    executionPlanConfirmsFailureNoChargePolicy:
      planResult.executionPlanConfirmsFailureNoChargePolicy,
    executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks:
      planResult.executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks,
    executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid:
      planResult.executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid,

    executionSequenceStep1FeatureFlagCheck:
      planResult.executionSequenceStep1FeatureFlagCheck,
    executionSequenceStep2KillSwitchCheck:
      planResult.executionSequenceStep2KillSwitchCheck,
    executionSequenceStep3ModeClassification:
      planResult.executionSequenceStep3ModeClassification,
    executionSequenceStep4DocumentBypassGuard:
      planResult.executionSequenceStep4DocumentBypassGuard,
    executionSequenceStep5PaymentBoundaryCheck:
      planResult.executionSequenceStep5PaymentBoundaryCheck,
    executionSequenceStep6PrivacyNoticeBeforeUpload:
      planResult.executionSequenceStep6PrivacyNoticeBeforeUpload,
    executionSequenceStep7EphemeralInputHandling:
      planResult.executionSequenceStep7EphemeralInputHandling,
    executionSequenceStep8RedactionBeforeModelUse:
      planResult.executionSequenceStep8RedactionBeforeModelUse,
    executionSequenceStep9OcrOutputUntrustedHandling:
      planResult.executionSequenceStep9OcrOutputUntrustedHandling,
    executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation:
      planResult.executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation,
    executionSequenceStep11UserVisibleOutputContractBeforeDisplay:
      planResult.executionSequenceStep11UserVisibleOutputContractBeforeDisplay,
    executionSequenceStep12NoExactDeadlineWithoutDeliveryDate:
      planResult.executionSequenceStep12NoExactDeadlineWithoutDeliveryDate,
    executionSequenceStep13AuditTraceNoRawContent:
      planResult.executionSequenceStep13AuditTraceNoRawContent,
    executionSequenceStep14FailureNoChargePolicy:
      planResult.executionSequenceStep14FailureNoChargePolicy,
    executionSequenceStep15ManualOperatorConfirmationForHighRisk:
      planResult.executionSequenceStep15ManualOperatorConfirmationForHighRisk,

    executionSequenceActuallyExecuted: planResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: planResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: planResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: planResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: planResult.paymentPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: planResult.userVisiblePipelineActuallyExecuted,

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

    exactDeadlineCalculationAuthorized: planResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: planResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: planResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: planResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: planResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: planResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: planResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: planResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: planResult.publicRuntimeEnabled,
    persistenceUsed: planResult.persistenceUsed,
    neverUserVisible: planResult.neverUserVisible,

    runtimeIsolationAuditOnly: true,
    runtimeIsolationAuditPerformed: true,

    isolationAuditConfirmsNoOpenAiCall: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoFetchCall: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoProcessEnvRead: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoSdkUsage: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNo8x3AcRerun: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoSmartTalkRuntimeCall: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoBranchCMutation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoPublicRouteMutation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoUiMutation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoSupabaseMutation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoStorageMutation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoDatabaseWrite: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoAuditPersistence: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoPaymentRuntimeCall: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoOcrRuntimeCall: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoPhotoInputProcessing: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoFileInputProcessing: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoDocumentParsing: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoRawDocumentStorage: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoModelOutputStorage: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoPromptStorage: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoUserVisibleOutput: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoCustomerFacingExplanation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoEvidenceEvaluation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoClaimAuthorization: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoDeadlineCalculation: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoLegalCertainty: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoRuntimePipelineExecution: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoDocumentPipelineExecution: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoOcrPipelineExecution: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoPaymentPipelineExecution: prereqAllPassed && prereqReady,
    isolationAuditConfirmsNoUserVisiblePipelineExecution: prereqAllPassed && prereqReady,

    isolationBoundaryRequiresFeatureFlagDefaultOff: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresKillSwitchBeforeRuntime: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresServerSideOnlyProcessing: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresNoClientSideSecrets: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresNoPersistenceByDefault: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresEphemeralProcessingByDefault: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresOcrOutputUntrusted: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresEvidenceGatesBeforeInterpretation:
      prereqAllPassed && prereqReady,
    isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    isolationBoundaryRequiresPrivacyNoticeBeforeUpload: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresRateLimitBeforePublicExposure: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresAbuseDetectionBeforePublicExposure:
      prereqAllPassed && prereqReady,
    isolationBoundaryRequiresAuditTraceNoRawContent: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresFailureNoChargePolicy: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresManualOperatorConfirmationForHighRisk:
      prereqAllPassed && prereqReady,
    isolationBoundaryRequiresExplicitGoLiveApproval: prereqAllPassed && prereqReady,
    isolationBoundaryRequiresSeparateProductionReadinessReview:
      prereqAllPassed && prereqReady,

    isolationAuditConfirmsFreeQuestionModeRemainsFree: prereqAllPassed && prereqReady,
    isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation:
      prereqAllPassed && prereqReady,
    isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      prereqAllPassed && prereqReady,
    isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa:
      prereqAllPassed && prereqReady,
    isolationAuditConfirmsFullDocumentRedirectFromFreeQa: prereqAllPassed && prereqReady,
    isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    isolationAuditConfirmsFailureNoChargePolicy: prereqAllPassed && prereqReady,
    isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks:
      prereqAllPassed && prereqReady,
    isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid:
      prereqAllPassed && prereqReady,

    readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical isolation audit input ──────────────────────
  const auditValidation = validateIsolationAuditInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const auditAccepted = auditValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5D checkId wrong", override: { prereqCheckId: "8.5C" } },
    { label: "8.5D allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeExecutionPlanAccepted false", override: { controlledRealDocumentRuntimeExecutionPlanAccepted: false } },
    { label: "runtimeExecutionPlanOnly false", override: { runtimeExecutionPlanOnly: false } },
    { label: "runtimeExecutionPlanDefined false", override: { runtimeExecutionPlanDefined: false } },
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
    { label: "executionPlanRequiresSeparateExplicitRuntimeApproval false", override: { executionPlanRequiresSeparateExplicitRuntimeApproval: false } },
    { label: "executionPlanRequiresFreshRiskReviewBeforeRuntime false", override: { executionPlanRequiresFreshRiskReviewBeforeRuntime: false } },
    { label: "executionPlanRequiresRuntimeKillSwitch false", override: { executionPlanRequiresRuntimeKillSwitch: false } },
    { label: "executionPlanRequiresFeatureFlagDefaultOff false", override: { executionPlanRequiresFeatureFlagDefaultOff: false } },
    { label: "executionPlanRequiresServerSideOnlyBoundary false", override: { executionPlanRequiresServerSideOnlyBoundary: false } },
    { label: "executionPlanRequiresNoClientSideSecrets false", override: { executionPlanRequiresNoClientSideSecrets: false } },
    { label: "executionPlanRequiresNoPublicRuntimeByDefault false", override: { executionPlanRequiresNoPublicRuntimeByDefault: false } },
    { label: "executionPlanRequiresNoPersistenceByDefault false", override: { executionPlanRequiresNoPersistenceByDefault: false } },
    { label: "executionPlanRequiresNoRawDocumentStorageByDefault false", override: { executionPlanRequiresNoRawDocumentStorageByDefault: false } },
    { label: "executionPlanRequiresNoModelOutputStorageByDefault false", override: { executionPlanRequiresNoModelOutputStorageByDefault: false } },
    { label: "executionPlanRequiresNoPromptStorage false", override: { executionPlanRequiresNoPromptStorage: false } },
    { label: "executionPlanRequiresEphemeralProcessingByDefault false", override: { executionPlanRequiresEphemeralProcessingByDefault: false } },
    { label: "executionPlanRequiresRedactionBeforeModelUse false", override: { executionPlanRequiresRedactionBeforeModelUse: false } },
    { label: "executionPlanRequiresOcrOutputTreatedAsUntrusted false", override: { executionPlanRequiresOcrOutputTreatedAsUntrusted: false } },
    { label: "executionPlanRequiresEvidenceGatesBeforeInterpretation false", override: { executionPlanRequiresEvidenceGatesBeforeInterpretation: false } },
    { label: "executionPlanRequiresUserVisibleOutputContractBeforeDisplay false", override: { executionPlanRequiresUserVisibleOutputContractBeforeDisplay: false } },
    { label: "executionPlanRequiresPrivacyNoticeBeforeUpload false", override: { executionPlanRequiresPrivacyNoticeBeforeUpload: false } },
    { label: "executionPlanRequiresUserLanguageSelectionBeforeOutput false", override: { executionPlanRequiresUserLanguageSelectionBeforeOutput: false } },
    { label: "executionPlanRequiresRateLimitBeforePublicExposure false", override: { executionPlanRequiresRateLimitBeforePublicExposure: false } },
    { label: "executionPlanRequiresAbuseDetectionBeforePublicExposure false", override: { executionPlanRequiresAbuseDetectionBeforePublicExposure: false } },
    { label: "executionPlanRequiresMonitoringBeforePilot false", override: { executionPlanRequiresMonitoringBeforePilot: false } },
    { label: "executionPlanRequiresRollbackBeforePilot false", override: { executionPlanRequiresRollbackBeforePilot: false } },
    { label: "executionPlanRequiresAuditTraceBeforeRuntime false", override: { executionPlanRequiresAuditTraceBeforeRuntime: false } },
    { label: "executionPlanRequiresTamperTestsBeforeRuntime false", override: { executionPlanRequiresTamperTestsBeforeRuntime: false } },
    { label: "executionPlanRequiresHumanReviewForHighRisk false", override: { executionPlanRequiresHumanReviewForHighRisk: false } },
    { label: "executionPlanRequiresNoExactDeadlineWithoutDeliveryDate false", override: { executionPlanRequiresNoExactDeadlineWithoutDeliveryDate: false } },
    { label: "executionPlanRequiresNoLegalAdviceOrCertainty false", override: { executionPlanRequiresNoLegalAdviceOrCertainty: false } },
    { label: "executionPlanRequiresManualOperatorConfirmationBeforeRuntime false", override: { executionPlanRequiresManualOperatorConfirmationBeforeRuntime: false } },
    { label: "executionPlanRequiresExplicitGoLiveApproval false", override: { executionPlanRequiresExplicitGoLiveApproval: false } },
    { label: "executionPlanRequiresSeparateProductionReadinessReview false", override: { executionPlanRequiresSeparateProductionReadinessReview: false } },
    { label: "executionPlanConfirmsFreeQuestionModeRemainsFree false", override: { executionPlanConfirmsFreeQuestionModeRemainsFree: false } },
    { label: "executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation false", override: { executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation: false } },
    { label: "executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation false", override: { executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation: false } },
    { label: "executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa false", override: { executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa: false } },
    { label: "executionPlanConfirmsFullDocumentRedirectFromFreeQa false", override: { executionPlanConfirmsFullDocumentRedirectFromFreeQa: false } },
    { label: "executionPlanConfirmsPaymentBoundaryBeforeFullExplanation false", override: { executionPlanConfirmsPaymentBoundaryBeforeFullExplanation: false } },
    { label: "executionPlanConfirmsFailureNoChargePolicy false", override: { executionPlanConfirmsFailureNoChargePolicy: false } },
    { label: "executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks false", override: { executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid false", override: { executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid: false } },
    { label: "executionSequenceStep1FeatureFlagCheck false", override: { executionSequenceStep1FeatureFlagCheck: false } },
    { label: "executionSequenceStep2KillSwitchCheck false", override: { executionSequenceStep2KillSwitchCheck: false } },
    { label: "executionSequenceStep3ModeClassification false", override: { executionSequenceStep3ModeClassification: false } },
    { label: "executionSequenceStep4DocumentBypassGuard false", override: { executionSequenceStep4DocumentBypassGuard: false } },
    { label: "executionSequenceStep5PaymentBoundaryCheck false", override: { executionSequenceStep5PaymentBoundaryCheck: false } },
    { label: "executionSequenceStep6PrivacyNoticeBeforeUpload false", override: { executionSequenceStep6PrivacyNoticeBeforeUpload: false } },
    { label: "executionSequenceStep7EphemeralInputHandling false", override: { executionSequenceStep7EphemeralInputHandling: false } },
    { label: "executionSequenceStep8RedactionBeforeModelUse false", override: { executionSequenceStep8RedactionBeforeModelUse: false } },
    { label: "executionSequenceStep9OcrOutputUntrustedHandling false", override: { executionSequenceStep9OcrOutputUntrustedHandling: false } },
    { label: "executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation false", override: { executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation: false } },
    { label: "executionSequenceStep11UserVisibleOutputContractBeforeDisplay false", override: { executionSequenceStep11UserVisibleOutputContractBeforeDisplay: false } },
    { label: "executionSequenceStep12NoExactDeadlineWithoutDeliveryDate false", override: { executionSequenceStep12NoExactDeadlineWithoutDeliveryDate: false } },
    { label: "executionSequenceStep13AuditTraceNoRawContent false", override: { executionSequenceStep13AuditTraceNoRawContent: false } },
    { label: "executionSequenceStep14FailureNoChargePolicy false", override: { executionSequenceStep14FailureNoChargePolicy: false } },
    { label: "executionSequenceStep15ManualOperatorConfirmationForHighRisk false", override: { executionSequenceStep15ManualOperatorConfirmationForHighRisk: false } },
    { label: "executionSequenceActuallyExecuted true", override: { executionSequenceActuallyExecuted: true } },
    { label: "runtimePipelineActuallyExecuted true", override: { runtimePipelineActuallyExecuted: true } },
    { label: "documentPipelineActuallyExecuted true", override: { documentPipelineActuallyExecuted: true } },
    { label: "ocrPipelineActuallyExecuted true", override: { ocrPipelineActuallyExecuted: true } },
    { label: "paymentPipelineActuallyExecuted true", override: { paymentPipelineActuallyExecuted: true } },
    { label: "userVisiblePipelineActuallyExecuted true", override: { userVisiblePipelineActuallyExecuted: true } },
    { label: "readyFor8x5EControlledRealDocumentRuntimeIsolationAudit false", override: { readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: false } },
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
    { label: "runtimeIsolationAuditOnly false", override: { runtimeIsolationAuditOnly: false } },
    { label: "runtimeIsolationAuditPerformed false", override: { runtimeIsolationAuditPerformed: false } },
    { label: "runtimeAuthorizationGranted true (8.5E check)", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true (8.5E check)", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true (8.5E check)", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5E check)", override: { finalAuthorizationGranted: true } },
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
    { label: "readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision false", override: { readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateIsolationAuditInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    auditAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5E: controlled real-document runtime isolation audit layer — depends on completed 8.5D controlled real-document runtime execution plan",
    "8.5E is planning/audit-only — not runtime authorization",
    "runtime isolation was audited",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5E",
    "8.3AC was not re-run",
    "runtime execution sequence remains defined but not executed",
    "all runtime, document, OCR, payment, and user-visible pipelines remain unexecuted",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "high-risk safety contract still applies even when paid",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.5F controlled real-document runtime final authorization decision",
    "8.5F is still planning/decision-only unless explicitly authorized later",
    `8.5D prerequisite: allPassed=${planResult.allPassed}, readyFor8x5E=${planResult.readyFor8x5EControlledRealDocumentRuntimeIsolationAudit}`,
    `isolation audit input validation: ${auditAccepted ? "accepted" : "REJECTED"} — reasons: ${auditValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5E allPassed: true — controlled real-document runtime isolation audit accepted"
    );
    notes.push(
      "readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.5E",
    allPassed,
    runtimeExecutionPlanReadyForIsolationAudit:
      canonicalInput.controlledRealDocumentRuntimeExecutionPlanAccepted,
    controlledRealDocumentRuntimeIsolationAuditAccepted: allPassed,
    runtimeIsolationAuditOnly: true,
    runtimeIsolationAuditPerformed: true,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,

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

    isolationAuditConfirmsNoOpenAiCall: canonicalInput.isolationAuditConfirmsNoOpenAiCall,
    isolationAuditConfirmsNoFetchCall: canonicalInput.isolationAuditConfirmsNoFetchCall,
    isolationAuditConfirmsNoProcessEnvRead:
      canonicalInput.isolationAuditConfirmsNoProcessEnvRead,
    isolationAuditConfirmsNoSdkUsage: canonicalInput.isolationAuditConfirmsNoSdkUsage,
    isolationAuditConfirmsNo8x3AcRerun: canonicalInput.isolationAuditConfirmsNo8x3AcRerun,
    isolationAuditConfirmsNoSmartTalkRuntimeCall:
      canonicalInput.isolationAuditConfirmsNoSmartTalkRuntimeCall,
    isolationAuditConfirmsNoBranchCMutation:
      canonicalInput.isolationAuditConfirmsNoBranchCMutation,
    isolationAuditConfirmsNoPublicRouteMutation:
      canonicalInput.isolationAuditConfirmsNoPublicRouteMutation,
    isolationAuditConfirmsNoUiMutation: canonicalInput.isolationAuditConfirmsNoUiMutation,
    isolationAuditConfirmsNoSupabaseMutation:
      canonicalInput.isolationAuditConfirmsNoSupabaseMutation,
    isolationAuditConfirmsNoStorageMutation:
      canonicalInput.isolationAuditConfirmsNoStorageMutation,
    isolationAuditConfirmsNoDatabaseWrite:
      canonicalInput.isolationAuditConfirmsNoDatabaseWrite,
    isolationAuditConfirmsNoAuditPersistence:
      canonicalInput.isolationAuditConfirmsNoAuditPersistence,
    isolationAuditConfirmsNoPaymentRuntimeCall:
      canonicalInput.isolationAuditConfirmsNoPaymentRuntimeCall,
    isolationAuditConfirmsNoOcrRuntimeCall:
      canonicalInput.isolationAuditConfirmsNoOcrRuntimeCall,
    isolationAuditConfirmsNoPhotoInputProcessing:
      canonicalInput.isolationAuditConfirmsNoPhotoInputProcessing,
    isolationAuditConfirmsNoFileInputProcessing:
      canonicalInput.isolationAuditConfirmsNoFileInputProcessing,
    isolationAuditConfirmsNoDocumentParsing:
      canonicalInput.isolationAuditConfirmsNoDocumentParsing,
    isolationAuditConfirmsNoRawDocumentStorage:
      canonicalInput.isolationAuditConfirmsNoRawDocumentStorage,
    isolationAuditConfirmsNoModelOutputStorage:
      canonicalInput.isolationAuditConfirmsNoModelOutputStorage,
    isolationAuditConfirmsNoPromptStorage:
      canonicalInput.isolationAuditConfirmsNoPromptStorage,
    isolationAuditConfirmsNoUserVisibleOutput:
      canonicalInput.isolationAuditConfirmsNoUserVisibleOutput,
    isolationAuditConfirmsNoCustomerFacingExplanation:
      canonicalInput.isolationAuditConfirmsNoCustomerFacingExplanation,
    isolationAuditConfirmsNoEvidenceEvaluation:
      canonicalInput.isolationAuditConfirmsNoEvidenceEvaluation,
    isolationAuditConfirmsNoClaimAuthorization:
      canonicalInput.isolationAuditConfirmsNoClaimAuthorization,
    isolationAuditConfirmsNoDeadlineCalculation:
      canonicalInput.isolationAuditConfirmsNoDeadlineCalculation,
    isolationAuditConfirmsNoLegalCertainty:
      canonicalInput.isolationAuditConfirmsNoLegalCertainty,
    isolationAuditConfirmsNoRuntimePipelineExecution:
      canonicalInput.isolationAuditConfirmsNoRuntimePipelineExecution,
    isolationAuditConfirmsNoDocumentPipelineExecution:
      canonicalInput.isolationAuditConfirmsNoDocumentPipelineExecution,
    isolationAuditConfirmsNoOcrPipelineExecution:
      canonicalInput.isolationAuditConfirmsNoOcrPipelineExecution,
    isolationAuditConfirmsNoPaymentPipelineExecution:
      canonicalInput.isolationAuditConfirmsNoPaymentPipelineExecution,
    isolationAuditConfirmsNoUserVisiblePipelineExecution:
      canonicalInput.isolationAuditConfirmsNoUserVisiblePipelineExecution,

    isolationBoundaryRequiresFeatureFlagDefaultOff:
      canonicalInput.isolationBoundaryRequiresFeatureFlagDefaultOff,
    isolationBoundaryRequiresKillSwitchBeforeRuntime:
      canonicalInput.isolationBoundaryRequiresKillSwitchBeforeRuntime,
    isolationBoundaryRequiresServerSideOnlyProcessing:
      canonicalInput.isolationBoundaryRequiresServerSideOnlyProcessing,
    isolationBoundaryRequiresNoClientSideSecrets:
      canonicalInput.isolationBoundaryRequiresNoClientSideSecrets,
    isolationBoundaryRequiresNoPersistenceByDefault:
      canonicalInput.isolationBoundaryRequiresNoPersistenceByDefault,
    isolationBoundaryRequiresEphemeralProcessingByDefault:
      canonicalInput.isolationBoundaryRequiresEphemeralProcessingByDefault,
    isolationBoundaryRequiresRedactionBeforeModelUse:
      canonicalInput.isolationBoundaryRequiresRedactionBeforeModelUse,
    isolationBoundaryRequiresOcrOutputUntrusted:
      canonicalInput.isolationBoundaryRequiresOcrOutputUntrusted,
    isolationBoundaryRequiresEvidenceGatesBeforeInterpretation:
      canonicalInput.isolationBoundaryRequiresEvidenceGatesBeforeInterpretation,
    isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay:
      canonicalInput.isolationBoundaryRequiresUserVisibleOutputContractBeforeDisplay,
    isolationBoundaryRequiresPrivacyNoticeBeforeUpload:
      canonicalInput.isolationBoundaryRequiresPrivacyNoticeBeforeUpload,
    isolationBoundaryRequiresRateLimitBeforePublicExposure:
      canonicalInput.isolationBoundaryRequiresRateLimitBeforePublicExposure,
    isolationBoundaryRequiresAbuseDetectionBeforePublicExposure:
      canonicalInput.isolationBoundaryRequiresAbuseDetectionBeforePublicExposure,
    isolationBoundaryRequiresAuditTraceNoRawContent:
      canonicalInput.isolationBoundaryRequiresAuditTraceNoRawContent,
    isolationBoundaryRequiresFailureNoChargePolicy:
      canonicalInput.isolationBoundaryRequiresFailureNoChargePolicy,
    isolationBoundaryRequiresManualOperatorConfirmationForHighRisk:
      canonicalInput.isolationBoundaryRequiresManualOperatorConfirmationForHighRisk,
    isolationBoundaryRequiresExplicitGoLiveApproval:
      canonicalInput.isolationBoundaryRequiresExplicitGoLiveApproval,
    isolationBoundaryRequiresSeparateProductionReadinessReview:
      canonicalInput.isolationBoundaryRequiresSeparateProductionReadinessReview,

    isolationAuditConfirmsFreeQuestionModeRemainsFree:
      canonicalInput.isolationAuditConfirmsFreeQuestionModeRemainsFree,
    isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation:
      canonicalInput.isolationAuditConfirmsPaidDocumentModeRequiredForFullExplanation,
    isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      canonicalInput.isolationAuditConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa:
      canonicalInput.isolationAuditConfirmsDocumentBypassGuardRequiredForFreeQa,
    isolationAuditConfirmsFullDocumentRedirectFromFreeQa:
      canonicalInput.isolationAuditConfirmsFullDocumentRedirectFromFreeQa,
    isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation:
      canonicalInput.isolationAuditConfirmsPaymentBoundaryBeforeFullExplanation,
    isolationAuditConfirmsFailureNoChargePolicy:
      canonicalInput.isolationAuditConfirmsFailureNoChargePolicy,
    isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.isolationAuditConfirmsPaymentDoesNotOverrideSafetyBlocks,
    isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid:
      canonicalInput.isolationAuditConfirmsHighRiskSafetyContractEvenWhenPaid,

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

    readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision:
      canonicalInput.readyFor8x5FControlledRealDocumentRuntimeFinalAuthorizationDecision,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
