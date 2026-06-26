/**
 * Phase 8.5D — Controlled Real Document Runtime Execution Plan.
 *
 * EXECUTION-PLAN-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5C.
 *
 * This file defines the safe execution plan required before any future
 * controlled runtime can be separately authorized. It is:
 *   - execution-plan-only — NOT runtime authorization.
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

import { runControlledRealDocumentRuntimeDryRunAuthorization } from "./run-controlled-real-document-runtime-dry-run-authorization";

// ── Local runtime execution plan input type ───────────────────────────────────

interface ControlledRealDocumentRuntimeExecutionPlanInput {
  // 8.5C prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly runtimeAuthorizationContractReadyForDryRunAuthorization: boolean;
  readonly controlledRealDocumentRuntimeDryRunAuthorizationAccepted: boolean;
  readonly runtimeDryRunAuthorizationOnly: boolean;
  readonly dryRunAuthorizationSimulated: boolean;
  readonly readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: boolean;

  // 8.5C authorization flags (must be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // 8.5C actual* performed flags (must be false)
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

  // 8.5C dry-run confirms (must be true)
  readonly dryRunConfirmsSeparateExplicitApprovalStillRequired: boolean;
  readonly dryRunConfirmsFreshRiskReviewStillRequired: boolean;
  readonly dryRunConfirmsRuntimeKillSwitchRequired: boolean;
  readonly dryRunConfirmsFeatureFlagMustDefaultOff: boolean;
  readonly dryRunConfirmsServerSideOnlyProcessingRequired: boolean;
  readonly dryRunConfirmsNoClientSideSecretsAllowed: boolean;
  readonly dryRunConfirmsNoPublicRuntimeByDefault: boolean;
  readonly dryRunConfirmsNoPersistenceByDefault: boolean;
  readonly dryRunConfirmsNoRawDocumentStorageByDefault: boolean;
  readonly dryRunConfirmsNoModelOutputStorageByDefault: boolean;
  readonly dryRunConfirmsNoPromptStorage: boolean;
  readonly dryRunConfirmsEphemeralProcessingByDefault: boolean;
  readonly dryRunConfirmsRedactionBeforeModelUseRequired: boolean;
  readonly dryRunConfirmsOcrOutputUntrusted: boolean;
  readonly dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation: boolean;
  readonly dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay: boolean;
  readonly dryRunConfirmsPrivacyNoticeRequiredBeforeUpload: boolean;
  readonly dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput: boolean;
  readonly dryRunConfirmsRateLimitRequiredBeforePublicExposure: boolean;
  readonly dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure: boolean;
  readonly dryRunConfirmsMonitoringRequiredBeforePilot: boolean;
  readonly dryRunConfirmsRollbackRequiredBeforePilot: boolean;
  readonly dryRunConfirmsAuditTraceRequiredBeforeRuntime: boolean;
  readonly dryRunConfirmsTamperTestsRequiredBeforeRuntime: boolean;
  readonly dryRunConfirmsHumanReviewRequiredForHighRisk: boolean;
  readonly dryRunConfirmsNoExactDeadlineWithoutDeliveryDate: boolean;
  readonly dryRunConfirmsNoLegalAdviceOrCertainty: boolean;
  readonly dryRunConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly dryRunConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly dryRunConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly dryRunConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly dryRunConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly dryRunConfirmsFailureNoChargePolicy: boolean;
  readonly dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly dryRunConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // 8.5C dry-run decision outcome
  readonly dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowPilotIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunRequiresSeparateProductionReadinessReview: boolean;
  readonly dryRunRequiresExplicitGoLiveApproval: boolean;
  readonly dryRunRequiresManualOperatorConfirmationBeforeRuntime: boolean;

  // 8.5C runtime authorization flags (must be false)
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

  // 8.5C runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5D assertions
  readonly runtimeExecutionPlanOnly: boolean;
  readonly runtimeExecutionPlanDefined: boolean;

  // Execution plan gates
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

  // Commercial execution plan gates
  readonly executionPlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly executionPlanConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly executionPlanConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly executionPlanConfirmsFailureNoChargePolicy: boolean;
  readonly executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // Execution sequence gates (defined but not executed)
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

  // Execution sequence must NOT be executed
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  readonly readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeExecutionPlanResult {
  readonly checkId: "8.5D";
  readonly allPassed: boolean;
  readonly runtimeDryRunAuthorizationReadyForExecutionPlan: boolean;
  readonly controlledRealDocumentRuntimeExecutionPlanAccepted: boolean;
  readonly runtimeExecutionPlanOnly: true;
  readonly runtimeExecutionPlanDefined: true;
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

  readonly executionPlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly executionPlanConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly executionPlanConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly executionPlanConfirmsFailureNoChargePolicy: boolean;
  readonly executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

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

  readonly readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Runtime execution plan input validator ────────────────────────────────────

function validateExecutionPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5C prerequisite gates
  if (o["prereqCheckId"] !== "8.5C")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeDryRunAuthorizationAccepted"] !== true)
    reasons.push("dry_run_authorization_not_accepted");
  if (o["runtimeDryRunAuthorizationOnly"] !== true)
    reasons.push("runtime_dry_run_authorization_only_false");
  if (o["dryRunAuthorizationSimulated"] !== true)
    reasons.push("dry_run_authorization_simulated_false");
  if (o["readyFor8x5DControlledRealDocumentRuntimeExecutionPlan"] !== true)
    reasons.push("not_ready_for_8_5d_execution_plan");

  // Authorization flags (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // Actual* performed flags (must be false)
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

  // 8.5C dry-run confirms (must be true)
  if (o["dryRunConfirmsSeparateExplicitApprovalStillRequired"] !== true)
    reasons.push("dry_run_confirms_separate_explicit_approval_still_required_false");
  if (o["dryRunConfirmsFreshRiskReviewStillRequired"] !== true)
    reasons.push("dry_run_confirms_fresh_risk_review_still_required_false");
  if (o["dryRunConfirmsRuntimeKillSwitchRequired"] !== true)
    reasons.push("dry_run_confirms_runtime_kill_switch_required_false");
  if (o["dryRunConfirmsFeatureFlagMustDefaultOff"] !== true)
    reasons.push("dry_run_confirms_feature_flag_must_default_off_false");
  if (o["dryRunConfirmsServerSideOnlyProcessingRequired"] !== true)
    reasons.push("dry_run_confirms_server_side_only_processing_required_false");
  if (o["dryRunConfirmsNoClientSideSecretsAllowed"] !== true)
    reasons.push("dry_run_confirms_no_client_side_secrets_allowed_false");
  if (o["dryRunConfirmsNoPublicRuntimeByDefault"] !== true)
    reasons.push("dry_run_confirms_no_public_runtime_by_default_false");
  if (o["dryRunConfirmsNoPersistenceByDefault"] !== true)
    reasons.push("dry_run_confirms_no_persistence_by_default_false");
  if (o["dryRunConfirmsNoRawDocumentStorageByDefault"] !== true)
    reasons.push("dry_run_confirms_no_raw_document_storage_by_default_false");
  if (o["dryRunConfirmsNoModelOutputStorageByDefault"] !== true)
    reasons.push("dry_run_confirms_no_model_output_storage_by_default_false");
  if (o["dryRunConfirmsNoPromptStorage"] !== true)
    reasons.push("dry_run_confirms_no_prompt_storage_false");
  if (o["dryRunConfirmsEphemeralProcessingByDefault"] !== true)
    reasons.push("dry_run_confirms_ephemeral_processing_by_default_false");
  if (o["dryRunConfirmsRedactionBeforeModelUseRequired"] !== true)
    reasons.push("dry_run_confirms_redaction_before_model_use_required_false");
  if (o["dryRunConfirmsOcrOutputUntrusted"] !== true)
    reasons.push("dry_run_confirms_ocr_output_untrusted_false");
  if (o["dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation"] !== true)
    reasons.push("dry_run_confirms_evidence_gates_required_before_interpretation_false");
  if (o["dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay"] !== true)
    reasons.push("dry_run_confirms_user_visible_output_contract_required_before_display_false");
  if (o["dryRunConfirmsPrivacyNoticeRequiredBeforeUpload"] !== true)
    reasons.push("dry_run_confirms_privacy_notice_required_before_upload_false");
  if (o["dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput"] !== true)
    reasons.push("dry_run_confirms_user_language_selection_required_before_output_false");
  if (o["dryRunConfirmsRateLimitRequiredBeforePublicExposure"] !== true)
    reasons.push("dry_run_confirms_rate_limit_required_before_public_exposure_false");
  if (o["dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure"] !== true)
    reasons.push("dry_run_confirms_abuse_detection_required_before_public_exposure_false");
  if (o["dryRunConfirmsMonitoringRequiredBeforePilot"] !== true)
    reasons.push("dry_run_confirms_monitoring_required_before_pilot_false");
  if (o["dryRunConfirmsRollbackRequiredBeforePilot"] !== true)
    reasons.push("dry_run_confirms_rollback_required_before_pilot_false");
  if (o["dryRunConfirmsAuditTraceRequiredBeforeRuntime"] !== true)
    reasons.push("dry_run_confirms_audit_trace_required_before_runtime_false");
  if (o["dryRunConfirmsTamperTestsRequiredBeforeRuntime"] !== true)
    reasons.push("dry_run_confirms_tamper_tests_required_before_runtime_false");
  if (o["dryRunConfirmsHumanReviewRequiredForHighRisk"] !== true)
    reasons.push("dry_run_confirms_human_review_required_for_high_risk_false");
  if (o["dryRunConfirmsNoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("dry_run_confirms_no_exact_deadline_without_delivery_date_false");
  if (o["dryRunConfirmsNoLegalAdviceOrCertainty"] !== true)
    reasons.push("dry_run_confirms_no_legal_advice_or_certainty_false");
  if (o["dryRunConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("dry_run_confirms_free_question_mode_remains_free_false");
  if (o["dryRunConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("dry_run_confirms_paid_document_mode_required_for_full_explanation_false");
  if (o["dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation"] !== true)
    reasons.push("dry_run_confirms_paid_document_mode_required_for_photo_explanation_false");
  if (o["dryRunConfirmsDocumentBypassGuardRequiredForFreeQa"] !== true)
    reasons.push("dry_run_confirms_document_bypass_guard_required_for_free_qa_false");
  if (o["dryRunConfirmsFullDocumentRedirectFromFreeQa"] !== true)
    reasons.push("dry_run_confirms_full_document_redirect_from_free_qa_false");
  if (o["dryRunConfirmsPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("dry_run_confirms_payment_boundary_before_full_explanation_false");
  if (o["dryRunConfirmsFailureNoChargePolicy"] !== true)
    reasons.push("dry_run_confirms_failure_no_charge_policy_false");
  if (o["dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("dry_run_confirms_payment_does_not_override_safety_blocks_false");
  if (o["dryRunConfirmsHighRiskSafetyContractEvenWhenPaid"] !== true)
    reasons.push("dry_run_confirms_high_risk_safety_contract_even_when_paid_false");

  // 8.5C dry-run decision outcome
  if (o["dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater"] !== true)
    reasons.push("dry_run_would_allow_runtime_if_separately_authorized_later_false");
  if (o["dryRunWouldAllowPilotIfSeparatelyAuthorizedLater"] !== true)
    reasons.push("dry_run_would_allow_pilot_if_separately_authorized_later_false");
  if (o["dryRunWouldAllowProductionIfSeparatelyAuthorizedLater"] !== false)
    reasons.push("dry_run_would_allow_production_if_separately_authorized_later_true");
  if (o["dryRunRequiresSeparateProductionReadinessReview"] !== true)
    reasons.push("dry_run_requires_separate_production_readiness_review_false");
  if (o["dryRunRequiresExplicitGoLiveApproval"] !== true)
    reasons.push("dry_run_requires_explicit_go_live_approval_false");
  if (o["dryRunRequiresManualOperatorConfirmationBeforeRuntime"] !== true)
    reasons.push("dry_run_requires_manual_operator_confirmation_before_runtime_false");

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

  // Derived 8.5D assertions
  if (o["runtimeExecutionPlanOnly"] !== true)
    reasons.push("runtime_execution_plan_only_false");
  if (o["runtimeExecutionPlanDefined"] !== true)
    reasons.push("runtime_execution_plan_defined_false");

  // Execution plan gates (must be true)
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

  // Commercial execution plan gates (must be true)
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

  // Execution sequence gates (must be true — defined)
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

  // Execution sequence must NOT be executed (must be false)
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

  if (o["readyFor8x5EControlledRealDocumentRuntimeIsolationAudit"] !== true)
    reasons.push("not_ready_for_8_5e_isolation_audit");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeExecutionPlan(): ControlledRealDocumentRuntimeExecutionPlanResult {
  // ── Step 1: Obtain 8.5C dry-run authorization result ─────────────────────
  const dryRunResult = runControlledRealDocumentRuntimeDryRunAuthorization();

  const prereqAllPassed = dryRunResult.allPassed;
  const prereqReady =
    dryRunResult.readyFor8x5DControlledRealDocumentRuntimeExecutionPlan;

  // ── Step 2: Build canonical execution plan input ──────────────────────────
  const canonicalInput: ControlledRealDocumentRuntimeExecutionPlanInput = {
    prereqCheckId: dryRunResult.checkId,
    prereqAllPassed,
    runtimeAuthorizationContractReadyForDryRunAuthorization:
      dryRunResult.runtimeAuthorizationContractReadyForDryRunAuthorization,
    controlledRealDocumentRuntimeDryRunAuthorizationAccepted:
      dryRunResult.controlledRealDocumentRuntimeDryRunAuthorizationAccepted,
    runtimeDryRunAuthorizationOnly: dryRunResult.runtimeDryRunAuthorizationOnly,
    dryRunAuthorizationSimulated: dryRunResult.dryRunAuthorizationSimulated,
    readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: prereqReady,

    runtimeAuthorizationGranted: dryRunResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: dryRunResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: dryRunResult.productionAuthorizationGranted,
    finalAuthorizationGranted: dryRunResult.finalAuthorizationGranted,

    actualRealDocumentInputPerformed: dryRunResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      dryRunResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: dryRunResult.actualOcrPerformed,
    actualPhotoInputProcessed: dryRunResult.actualPhotoInputProcessed,
    actualFileInputProcessed: dryRunResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: dryRunResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: dryRunResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: dryRunResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: dryRunResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: dryRunResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: dryRunResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: dryRunResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: dryRunResult.actualDeadlineCalculationPerformed,

    dryRunConfirmsSeparateExplicitApprovalStillRequired:
      dryRunResult.dryRunConfirmsSeparateExplicitApprovalStillRequired,
    dryRunConfirmsFreshRiskReviewStillRequired:
      dryRunResult.dryRunConfirmsFreshRiskReviewStillRequired,
    dryRunConfirmsRuntimeKillSwitchRequired:
      dryRunResult.dryRunConfirmsRuntimeKillSwitchRequired,
    dryRunConfirmsFeatureFlagMustDefaultOff:
      dryRunResult.dryRunConfirmsFeatureFlagMustDefaultOff,
    dryRunConfirmsServerSideOnlyProcessingRequired:
      dryRunResult.dryRunConfirmsServerSideOnlyProcessingRequired,
    dryRunConfirmsNoClientSideSecretsAllowed:
      dryRunResult.dryRunConfirmsNoClientSideSecretsAllowed,
    dryRunConfirmsNoPublicRuntimeByDefault:
      dryRunResult.dryRunConfirmsNoPublicRuntimeByDefault,
    dryRunConfirmsNoPersistenceByDefault:
      dryRunResult.dryRunConfirmsNoPersistenceByDefault,
    dryRunConfirmsNoRawDocumentStorageByDefault:
      dryRunResult.dryRunConfirmsNoRawDocumentStorageByDefault,
    dryRunConfirmsNoModelOutputStorageByDefault:
      dryRunResult.dryRunConfirmsNoModelOutputStorageByDefault,
    dryRunConfirmsNoPromptStorage: dryRunResult.dryRunConfirmsNoPromptStorage,
    dryRunConfirmsEphemeralProcessingByDefault:
      dryRunResult.dryRunConfirmsEphemeralProcessingByDefault,
    dryRunConfirmsRedactionBeforeModelUseRequired:
      dryRunResult.dryRunConfirmsRedactionBeforeModelUseRequired,
    dryRunConfirmsOcrOutputUntrusted: dryRunResult.dryRunConfirmsOcrOutputUntrusted,
    dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation:
      dryRunResult.dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation,
    dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      dryRunResult.dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay,
    dryRunConfirmsPrivacyNoticeRequiredBeforeUpload:
      dryRunResult.dryRunConfirmsPrivacyNoticeRequiredBeforeUpload,
    dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput:
      dryRunResult.dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput,
    dryRunConfirmsRateLimitRequiredBeforePublicExposure:
      dryRunResult.dryRunConfirmsRateLimitRequiredBeforePublicExposure,
    dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure:
      dryRunResult.dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure,
    dryRunConfirmsMonitoringRequiredBeforePilot:
      dryRunResult.dryRunConfirmsMonitoringRequiredBeforePilot,
    dryRunConfirmsRollbackRequiredBeforePilot:
      dryRunResult.dryRunConfirmsRollbackRequiredBeforePilot,
    dryRunConfirmsAuditTraceRequiredBeforeRuntime:
      dryRunResult.dryRunConfirmsAuditTraceRequiredBeforeRuntime,
    dryRunConfirmsTamperTestsRequiredBeforeRuntime:
      dryRunResult.dryRunConfirmsTamperTestsRequiredBeforeRuntime,
    dryRunConfirmsHumanReviewRequiredForHighRisk:
      dryRunResult.dryRunConfirmsHumanReviewRequiredForHighRisk,
    dryRunConfirmsNoExactDeadlineWithoutDeliveryDate:
      dryRunResult.dryRunConfirmsNoExactDeadlineWithoutDeliveryDate,
    dryRunConfirmsNoLegalAdviceOrCertainty:
      dryRunResult.dryRunConfirmsNoLegalAdviceOrCertainty,
    dryRunConfirmsFreeQuestionModeRemainsFree:
      dryRunResult.dryRunConfirmsFreeQuestionModeRemainsFree,
    dryRunConfirmsPaidDocumentModeRequiredForFullExplanation:
      dryRunResult.dryRunConfirmsPaidDocumentModeRequiredForFullExplanation,
    dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      dryRunResult.dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    dryRunConfirmsDocumentBypassGuardRequiredForFreeQa:
      dryRunResult.dryRunConfirmsDocumentBypassGuardRequiredForFreeQa,
    dryRunConfirmsFullDocumentRedirectFromFreeQa:
      dryRunResult.dryRunConfirmsFullDocumentRedirectFromFreeQa,
    dryRunConfirmsPaymentBoundaryBeforeFullExplanation:
      dryRunResult.dryRunConfirmsPaymentBoundaryBeforeFullExplanation,
    dryRunConfirmsFailureNoChargePolicy: dryRunResult.dryRunConfirmsFailureNoChargePolicy,
    dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks:
      dryRunResult.dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks,
    dryRunConfirmsHighRiskSafetyContractEvenWhenPaid:
      dryRunResult.dryRunConfirmsHighRiskSafetyContractEvenWhenPaid,

    dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater:
      dryRunResult.dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater,
    dryRunWouldAllowPilotIfSeparatelyAuthorizedLater:
      dryRunResult.dryRunWouldAllowPilotIfSeparatelyAuthorizedLater,
    dryRunWouldAllowProductionIfSeparatelyAuthorizedLater:
      dryRunResult.dryRunWouldAllowProductionIfSeparatelyAuthorizedLater,
    dryRunRequiresSeparateProductionReadinessReview:
      dryRunResult.dryRunRequiresSeparateProductionReadinessReview,
    dryRunRequiresExplicitGoLiveApproval: dryRunResult.dryRunRequiresExplicitGoLiveApproval,
    dryRunRequiresManualOperatorConfirmationBeforeRuntime:
      dryRunResult.dryRunRequiresManualOperatorConfirmationBeforeRuntime,

    realDocumentInputAuthorizedNow: dryRunResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: dryRunResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: dryRunResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: dryRunResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: dryRunResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: dryRunResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: dryRunResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: dryRunResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: dryRunResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      dryRunResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: dryRunResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: dryRunResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: dryRunResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: dryRunResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized: dryRunResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: dryRunResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: dryRunResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: dryRunResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: dryRunResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: dryRunResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: dryRunResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: dryRunResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: dryRunResult.publicRuntimeEnabled,
    persistenceUsed: dryRunResult.persistenceUsed,
    neverUserVisible: dryRunResult.neverUserVisible,

    runtimeExecutionPlanOnly: true,
    runtimeExecutionPlanDefined: true,

    executionPlanRequiresSeparateExplicitRuntimeApproval: prereqAllPassed && prereqReady,
    executionPlanRequiresFreshRiskReviewBeforeRuntime: prereqAllPassed && prereqReady,
    executionPlanRequiresRuntimeKillSwitch: prereqAllPassed && prereqReady,
    executionPlanRequiresFeatureFlagDefaultOff: prereqAllPassed && prereqReady,
    executionPlanRequiresServerSideOnlyBoundary: prereqAllPassed && prereqReady,
    executionPlanRequiresNoClientSideSecrets: prereqAllPassed && prereqReady,
    executionPlanRequiresNoPublicRuntimeByDefault: prereqAllPassed && prereqReady,
    executionPlanRequiresNoPersistenceByDefault: prereqAllPassed && prereqReady,
    executionPlanRequiresNoRawDocumentStorageByDefault: prereqAllPassed && prereqReady,
    executionPlanRequiresNoModelOutputStorageByDefault: prereqAllPassed && prereqReady,
    executionPlanRequiresNoPromptStorage: prereqAllPassed && prereqReady,
    executionPlanRequiresEphemeralProcessingByDefault: prereqAllPassed && prereqReady,
    executionPlanRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
    executionPlanRequiresOcrOutputTreatedAsUntrusted: prereqAllPassed && prereqReady,
    executionPlanRequiresEvidenceGatesBeforeInterpretation: prereqAllPassed && prereqReady,
    executionPlanRequiresUserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    executionPlanRequiresPrivacyNoticeBeforeUpload: prereqAllPassed && prereqReady,
    executionPlanRequiresUserLanguageSelectionBeforeOutput: prereqAllPassed && prereqReady,
    executionPlanRequiresRateLimitBeforePublicExposure: prereqAllPassed && prereqReady,
    executionPlanRequiresAbuseDetectionBeforePublicExposure: prereqAllPassed && prereqReady,
    executionPlanRequiresMonitoringBeforePilot: prereqAllPassed && prereqReady,
    executionPlanRequiresRollbackBeforePilot: prereqAllPassed && prereqReady,
    executionPlanRequiresAuditTraceBeforeRuntime: prereqAllPassed && prereqReady,
    executionPlanRequiresTamperTestsBeforeRuntime: prereqAllPassed && prereqReady,
    executionPlanRequiresHumanReviewForHighRisk: prereqAllPassed && prereqReady,
    executionPlanRequiresNoExactDeadlineWithoutDeliveryDate: prereqAllPassed && prereqReady,
    executionPlanRequiresNoLegalAdviceOrCertainty: prereqAllPassed && prereqReady,
    executionPlanRequiresManualOperatorConfirmationBeforeRuntime:
      prereqAllPassed && prereqReady,
    executionPlanRequiresExplicitGoLiveApproval: prereqAllPassed && prereqReady,
    executionPlanRequiresSeparateProductionReadinessReview: prereqAllPassed && prereqReady,

    executionPlanConfirmsFreeQuestionModeRemainsFree: prereqAllPassed && prereqReady,
    executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation:
      prereqAllPassed && prereqReady,
    executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      prereqAllPassed && prereqReady,
    executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa:
      prereqAllPassed && prereqReady,
    executionPlanConfirmsFullDocumentRedirectFromFreeQa: prereqAllPassed && prereqReady,
    executionPlanConfirmsPaymentBoundaryBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    executionPlanConfirmsFailureNoChargePolicy: prereqAllPassed && prereqReady,
    executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks: prereqAllPassed && prereqReady,
    executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid: prereqAllPassed && prereqReady,

    executionSequenceStep1FeatureFlagCheck: prereqAllPassed && prereqReady,
    executionSequenceStep2KillSwitchCheck: prereqAllPassed && prereqReady,
    executionSequenceStep3ModeClassification: prereqAllPassed && prereqReady,
    executionSequenceStep4DocumentBypassGuard: prereqAllPassed && prereqReady,
    executionSequenceStep5PaymentBoundaryCheck: prereqAllPassed && prereqReady,
    executionSequenceStep6PrivacyNoticeBeforeUpload: prereqAllPassed && prereqReady,
    executionSequenceStep7EphemeralInputHandling: prereqAllPassed && prereqReady,
    executionSequenceStep8RedactionBeforeModelUse: prereqAllPassed && prereqReady,
    executionSequenceStep9OcrOutputUntrustedHandling: prereqAllPassed && prereqReady,
    executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation:
      prereqAllPassed && prereqReady,
    executionSequenceStep11UserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    executionSequenceStep12NoExactDeadlineWithoutDeliveryDate:
      prereqAllPassed && prereqReady,
    executionSequenceStep13AuditTraceNoRawContent: prereqAllPassed && prereqReady,
    executionSequenceStep14FailureNoChargePolicy: prereqAllPassed && prereqReady,
    executionSequenceStep15ManualOperatorConfirmationForHighRisk:
      prereqAllPassed && prereqReady,

    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: false,
    paymentPipelineActuallyExecuted: false,
    userVisiblePipelineActuallyExecuted: false,

    readyFor8x5EControlledRealDocumentRuntimeIsolationAudit:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical execution plan input ───────────────────────
  const planValidation = validateExecutionPlanInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const planAccepted = planValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5C checkId wrong", override: { prereqCheckId: "8.5B" } },
    { label: "8.5C allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeDryRunAuthorizationAccepted false", override: { controlledRealDocumentRuntimeDryRunAuthorizationAccepted: false } },
    { label: "runtimeDryRunAuthorizationOnly false", override: { runtimeDryRunAuthorizationOnly: false } },
    { label: "dryRunAuthorizationSimulated false", override: { dryRunAuthorizationSimulated: false } },
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
    { label: "dryRunConfirmsSeparateExplicitApprovalStillRequired false", override: { dryRunConfirmsSeparateExplicitApprovalStillRequired: false } },
    { label: "dryRunConfirmsFreshRiskReviewStillRequired false", override: { dryRunConfirmsFreshRiskReviewStillRequired: false } },
    { label: "dryRunConfirmsRuntimeKillSwitchRequired false", override: { dryRunConfirmsRuntimeKillSwitchRequired: false } },
    { label: "dryRunConfirmsFeatureFlagMustDefaultOff false", override: { dryRunConfirmsFeatureFlagMustDefaultOff: false } },
    { label: "dryRunConfirmsServerSideOnlyProcessingRequired false", override: { dryRunConfirmsServerSideOnlyProcessingRequired: false } },
    { label: "dryRunConfirmsNoClientSideSecretsAllowed false", override: { dryRunConfirmsNoClientSideSecretsAllowed: false } },
    { label: "dryRunConfirmsNoPublicRuntimeByDefault false", override: { dryRunConfirmsNoPublicRuntimeByDefault: false } },
    { label: "dryRunConfirmsNoPersistenceByDefault false", override: { dryRunConfirmsNoPersistenceByDefault: false } },
    { label: "dryRunConfirmsNoRawDocumentStorageByDefault false", override: { dryRunConfirmsNoRawDocumentStorageByDefault: false } },
    { label: "dryRunConfirmsNoModelOutputStorageByDefault false", override: { dryRunConfirmsNoModelOutputStorageByDefault: false } },
    { label: "dryRunConfirmsNoPromptStorage false", override: { dryRunConfirmsNoPromptStorage: false } },
    { label: "dryRunConfirmsEphemeralProcessingByDefault false", override: { dryRunConfirmsEphemeralProcessingByDefault: false } },
    { label: "dryRunConfirmsRedactionBeforeModelUseRequired false", override: { dryRunConfirmsRedactionBeforeModelUseRequired: false } },
    { label: "dryRunConfirmsOcrOutputUntrusted false", override: { dryRunConfirmsOcrOutputUntrusted: false } },
    { label: "dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation false", override: { dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation: false } },
    { label: "dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay false", override: { dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay: false } },
    { label: "dryRunConfirmsPrivacyNoticeRequiredBeforeUpload false", override: { dryRunConfirmsPrivacyNoticeRequiredBeforeUpload: false } },
    { label: "dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput false", override: { dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput: false } },
    { label: "dryRunConfirmsRateLimitRequiredBeforePublicExposure false", override: { dryRunConfirmsRateLimitRequiredBeforePublicExposure: false } },
    { label: "dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure false", override: { dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure: false } },
    { label: "dryRunConfirmsMonitoringRequiredBeforePilot false", override: { dryRunConfirmsMonitoringRequiredBeforePilot: false } },
    { label: "dryRunConfirmsRollbackRequiredBeforePilot false", override: { dryRunConfirmsRollbackRequiredBeforePilot: false } },
    { label: "dryRunConfirmsAuditTraceRequiredBeforeRuntime false", override: { dryRunConfirmsAuditTraceRequiredBeforeRuntime: false } },
    { label: "dryRunConfirmsTamperTestsRequiredBeforeRuntime false", override: { dryRunConfirmsTamperTestsRequiredBeforeRuntime: false } },
    { label: "dryRunConfirmsHumanReviewRequiredForHighRisk false", override: { dryRunConfirmsHumanReviewRequiredForHighRisk: false } },
    { label: "dryRunConfirmsNoExactDeadlineWithoutDeliveryDate false", override: { dryRunConfirmsNoExactDeadlineWithoutDeliveryDate: false } },
    { label: "dryRunConfirmsNoLegalAdviceOrCertainty false", override: { dryRunConfirmsNoLegalAdviceOrCertainty: false } },
    { label: "dryRunConfirmsFreeQuestionModeRemainsFree false", override: { dryRunConfirmsFreeQuestionModeRemainsFree: false } },
    { label: "dryRunConfirmsPaidDocumentModeRequiredForFullExplanation false", override: { dryRunConfirmsPaidDocumentModeRequiredForFullExplanation: false } },
    { label: "dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation false", override: { dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation: false } },
    { label: "dryRunConfirmsDocumentBypassGuardRequiredForFreeQa false", override: { dryRunConfirmsDocumentBypassGuardRequiredForFreeQa: false } },
    { label: "dryRunConfirmsFullDocumentRedirectFromFreeQa false", override: { dryRunConfirmsFullDocumentRedirectFromFreeQa: false } },
    { label: "dryRunConfirmsPaymentBoundaryBeforeFullExplanation false", override: { dryRunConfirmsPaymentBoundaryBeforeFullExplanation: false } },
    { label: "dryRunConfirmsFailureNoChargePolicy false", override: { dryRunConfirmsFailureNoChargePolicy: false } },
    { label: "dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks false", override: { dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "dryRunConfirmsHighRiskSafetyContractEvenWhenPaid false", override: { dryRunConfirmsHighRiskSafetyContractEvenWhenPaid: false } },
    { label: "dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater false", override: { dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater: false } },
    { label: "dryRunWouldAllowPilotIfSeparatelyAuthorizedLater false", override: { dryRunWouldAllowPilotIfSeparatelyAuthorizedLater: false } },
    { label: "dryRunWouldAllowProductionIfSeparatelyAuthorizedLater true", override: { dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: true } },
    { label: "dryRunRequiresSeparateProductionReadinessReview false", override: { dryRunRequiresSeparateProductionReadinessReview: false } },
    { label: "dryRunRequiresExplicitGoLiveApproval false", override: { dryRunRequiresExplicitGoLiveApproval: false } },
    { label: "dryRunRequiresManualOperatorConfirmationBeforeRuntime false", override: { dryRunRequiresManualOperatorConfirmationBeforeRuntime: false } },
    { label: "readyFor8x5DControlledRealDocumentRuntimeExecutionPlan false", override: { readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: false } },
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
    { label: "runtimeExecutionPlanOnly false", override: { runtimeExecutionPlanOnly: false } },
    { label: "runtimeExecutionPlanDefined false", override: { runtimeExecutionPlanDefined: false } },
    { label: "runtimeAuthorizationGranted true (8.5D check)", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true (8.5D check)", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true (8.5D check)", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5D check)", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateExecutionPlanInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    planAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5D: controlled real-document runtime execution plan layer — depends on completed 8.5C controlled real-document runtime dry-run authorization",
    "8.5D is execution-plan-only — not runtime authorization",
    "the execution sequence was defined but not executed",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5D",
    "8.3AC was not re-run",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "high-risk safety contract still applies even when paid",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.5E controlled real-document runtime isolation audit",
    "8.5E is still planning/audit-only unless explicitly authorized later",
    `8.5C prerequisite: allPassed=${dryRunResult.allPassed}, readyFor8x5D=${dryRunResult.readyFor8x5DControlledRealDocumentRuntimeExecutionPlan}`,
    `execution plan input validation: ${planAccepted ? "accepted" : "REJECTED"} — reasons: ${planValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5D allPassed: true — controlled real-document runtime execution plan accepted"
    );
    notes.push(
      "readyFor8x5EControlledRealDocumentRuntimeIsolationAudit: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.5D",
    allPassed,
    runtimeDryRunAuthorizationReadyForExecutionPlan:
      canonicalInput.controlledRealDocumentRuntimeDryRunAuthorizationAccepted,
    controlledRealDocumentRuntimeExecutionPlanAccepted: allPassed,
    runtimeExecutionPlanOnly: true,
    runtimeExecutionPlanDefined: true,
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

    executionPlanRequiresSeparateExplicitRuntimeApproval:
      canonicalInput.executionPlanRequiresSeparateExplicitRuntimeApproval,
    executionPlanRequiresFreshRiskReviewBeforeRuntime:
      canonicalInput.executionPlanRequiresFreshRiskReviewBeforeRuntime,
    executionPlanRequiresRuntimeKillSwitch:
      canonicalInput.executionPlanRequiresRuntimeKillSwitch,
    executionPlanRequiresFeatureFlagDefaultOff:
      canonicalInput.executionPlanRequiresFeatureFlagDefaultOff,
    executionPlanRequiresServerSideOnlyBoundary:
      canonicalInput.executionPlanRequiresServerSideOnlyBoundary,
    executionPlanRequiresNoClientSideSecrets:
      canonicalInput.executionPlanRequiresNoClientSideSecrets,
    executionPlanRequiresNoPublicRuntimeByDefault:
      canonicalInput.executionPlanRequiresNoPublicRuntimeByDefault,
    executionPlanRequiresNoPersistenceByDefault:
      canonicalInput.executionPlanRequiresNoPersistenceByDefault,
    executionPlanRequiresNoRawDocumentStorageByDefault:
      canonicalInput.executionPlanRequiresNoRawDocumentStorageByDefault,
    executionPlanRequiresNoModelOutputStorageByDefault:
      canonicalInput.executionPlanRequiresNoModelOutputStorageByDefault,
    executionPlanRequiresNoPromptStorage:
      canonicalInput.executionPlanRequiresNoPromptStorage,
    executionPlanRequiresEphemeralProcessingByDefault:
      canonicalInput.executionPlanRequiresEphemeralProcessingByDefault,
    executionPlanRequiresRedactionBeforeModelUse:
      canonicalInput.executionPlanRequiresRedactionBeforeModelUse,
    executionPlanRequiresOcrOutputTreatedAsUntrusted:
      canonicalInput.executionPlanRequiresOcrOutputTreatedAsUntrusted,
    executionPlanRequiresEvidenceGatesBeforeInterpretation:
      canonicalInput.executionPlanRequiresEvidenceGatesBeforeInterpretation,
    executionPlanRequiresUserVisibleOutputContractBeforeDisplay:
      canonicalInput.executionPlanRequiresUserVisibleOutputContractBeforeDisplay,
    executionPlanRequiresPrivacyNoticeBeforeUpload:
      canonicalInput.executionPlanRequiresPrivacyNoticeBeforeUpload,
    executionPlanRequiresUserLanguageSelectionBeforeOutput:
      canonicalInput.executionPlanRequiresUserLanguageSelectionBeforeOutput,
    executionPlanRequiresRateLimitBeforePublicExposure:
      canonicalInput.executionPlanRequiresRateLimitBeforePublicExposure,
    executionPlanRequiresAbuseDetectionBeforePublicExposure:
      canonicalInput.executionPlanRequiresAbuseDetectionBeforePublicExposure,
    executionPlanRequiresMonitoringBeforePilot:
      canonicalInput.executionPlanRequiresMonitoringBeforePilot,
    executionPlanRequiresRollbackBeforePilot:
      canonicalInput.executionPlanRequiresRollbackBeforePilot,
    executionPlanRequiresAuditTraceBeforeRuntime:
      canonicalInput.executionPlanRequiresAuditTraceBeforeRuntime,
    executionPlanRequiresTamperTestsBeforeRuntime:
      canonicalInput.executionPlanRequiresTamperTestsBeforeRuntime,
    executionPlanRequiresHumanReviewForHighRisk:
      canonicalInput.executionPlanRequiresHumanReviewForHighRisk,
    executionPlanRequiresNoExactDeadlineWithoutDeliveryDate:
      canonicalInput.executionPlanRequiresNoExactDeadlineWithoutDeliveryDate,
    executionPlanRequiresNoLegalAdviceOrCertainty:
      canonicalInput.executionPlanRequiresNoLegalAdviceOrCertainty,
    executionPlanRequiresManualOperatorConfirmationBeforeRuntime:
      canonicalInput.executionPlanRequiresManualOperatorConfirmationBeforeRuntime,
    executionPlanRequiresExplicitGoLiveApproval:
      canonicalInput.executionPlanRequiresExplicitGoLiveApproval,
    executionPlanRequiresSeparateProductionReadinessReview:
      canonicalInput.executionPlanRequiresSeparateProductionReadinessReview,

    executionPlanConfirmsFreeQuestionModeRemainsFree:
      canonicalInput.executionPlanConfirmsFreeQuestionModeRemainsFree,
    executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation:
      canonicalInput.executionPlanConfirmsPaidDocumentModeRequiredForFullExplanation,
    executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      canonicalInput.executionPlanConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa:
      canonicalInput.executionPlanConfirmsDocumentBypassGuardRequiredForFreeQa,
    executionPlanConfirmsFullDocumentRedirectFromFreeQa:
      canonicalInput.executionPlanConfirmsFullDocumentRedirectFromFreeQa,
    executionPlanConfirmsPaymentBoundaryBeforeFullExplanation:
      canonicalInput.executionPlanConfirmsPaymentBoundaryBeforeFullExplanation,
    executionPlanConfirmsFailureNoChargePolicy:
      canonicalInput.executionPlanConfirmsFailureNoChargePolicy,
    executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.executionPlanConfirmsPaymentDoesNotOverrideSafetyBlocks,
    executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid:
      canonicalInput.executionPlanConfirmsHighRiskSafetyContractEvenWhenPaid,

    executionSequenceStep1FeatureFlagCheck:
      canonicalInput.executionSequenceStep1FeatureFlagCheck,
    executionSequenceStep2KillSwitchCheck:
      canonicalInput.executionSequenceStep2KillSwitchCheck,
    executionSequenceStep3ModeClassification:
      canonicalInput.executionSequenceStep3ModeClassification,
    executionSequenceStep4DocumentBypassGuard:
      canonicalInput.executionSequenceStep4DocumentBypassGuard,
    executionSequenceStep5PaymentBoundaryCheck:
      canonicalInput.executionSequenceStep5PaymentBoundaryCheck,
    executionSequenceStep6PrivacyNoticeBeforeUpload:
      canonicalInput.executionSequenceStep6PrivacyNoticeBeforeUpload,
    executionSequenceStep7EphemeralInputHandling:
      canonicalInput.executionSequenceStep7EphemeralInputHandling,
    executionSequenceStep8RedactionBeforeModelUse:
      canonicalInput.executionSequenceStep8RedactionBeforeModelUse,
    executionSequenceStep9OcrOutputUntrustedHandling:
      canonicalInput.executionSequenceStep9OcrOutputUntrustedHandling,
    executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation:
      canonicalInput.executionSequenceStep10EvidenceGateEvaluationBeforeInterpretation,
    executionSequenceStep11UserVisibleOutputContractBeforeDisplay:
      canonicalInput.executionSequenceStep11UserVisibleOutputContractBeforeDisplay,
    executionSequenceStep12NoExactDeadlineWithoutDeliveryDate:
      canonicalInput.executionSequenceStep12NoExactDeadlineWithoutDeliveryDate,
    executionSequenceStep13AuditTraceNoRawContent:
      canonicalInput.executionSequenceStep13AuditTraceNoRawContent,
    executionSequenceStep14FailureNoChargePolicy:
      canonicalInput.executionSequenceStep14FailureNoChargePolicy,
    executionSequenceStep15ManualOperatorConfirmationForHighRisk:
      canonicalInput.executionSequenceStep15ManualOperatorConfirmationForHighRisk,

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

    readyFor8x5EControlledRealDocumentRuntimeIsolationAudit:
      canonicalInput.readyFor8x5EControlledRealDocumentRuntimeIsolationAudit,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
