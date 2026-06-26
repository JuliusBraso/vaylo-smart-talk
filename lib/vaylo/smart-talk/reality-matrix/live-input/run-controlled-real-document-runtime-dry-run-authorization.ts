/**
 * Phase 8.5C — Controlled Real Document Runtime Dry-Run Authorization.
 *
 * DRY-RUN/PLANNING ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5B.
 *
 * This file simulates a future runtime authorization decision based on the
 * completed 8.5B runtime authorization contract. It is:
 *   - dry-run/planning only — NOT runtime authorization.
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

import { runControlledRealDocumentRuntimeAuthorizationContract } from "./run-controlled-real-document-runtime-authorization-contract";

// ── Local dry-run authorization input type ────────────────────────────────────

interface ControlledRealDocumentRuntimeDryRunAuthorizationInput {
  // 8.5B prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly runtimeImplementationPlanReadyForAuthorizationContract: boolean;
  readonly controlledRealDocumentRuntimeAuthorizationContractAccepted: boolean;
  readonly runtimeAuthorizationContractOnly: boolean;
  readonly readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: boolean;

  // 8.5B authorization flags (must be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // 8.5B actual* performed flags (must be false)
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

  // 8.5B authorization contract gates (must be true)
  readonly authorizationContractRequiresSeparateExplicitApproval: boolean;
  readonly authorizationContractRequiresFreshRiskReview: boolean;
  readonly authorizationContractRequiresRuntimeKillSwitchEnabled: boolean;
  readonly authorizationContractRequiresFeatureFlagDefaultOff: boolean;
  readonly authorizationContractRequiresServerSideOnlyProcessing: boolean;
  readonly authorizationContractRequiresNoClientSideSecrets: boolean;
  readonly authorizationContractRequiresNoPublicRuntimeByDefault: boolean;
  readonly authorizationContractRequiresNoPersistenceByDefault: boolean;
  readonly authorizationContractRequiresNoRawDocumentStorageByDefault: boolean;
  readonly authorizationContractRequiresNoModelOutputStorageByDefault: boolean;
  readonly authorizationContractRequiresNoPromptStorage: boolean;
  readonly authorizationContractRequiresRedactionBeforeModelUse: boolean;
  readonly authorizationContractRequiresOcrOutputUntrusted: boolean;
  readonly authorizationContractRequiresEvidenceGatePassBeforeInterpretation: boolean;
  readonly authorizationContractRequiresUserVisibleOutputContractBeforeDisplay: boolean;
  readonly authorizationContractRequiresPrivacyNoticeBeforeUpload: boolean;
  readonly authorizationContractRequiresUserLanguageSelectionBeforeOutput: boolean;
  readonly authorizationContractRequiresRateLimitBeforePublicExposure: boolean;
  readonly authorizationContractRequiresAbuseDetectionBeforePublicExposure: boolean;
  readonly authorizationContractRequiresMonitoringBeforePilot: boolean;
  readonly authorizationContractRequiresRollbackBeforePilot: boolean;
  readonly authorizationContractRequiresAuditTraceBeforeRuntime: boolean;
  readonly authorizationContractRequiresTamperTestsBeforeRuntime: boolean;
  readonly authorizationContractRequiresHumanReviewForHighRisk: boolean;
  readonly authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate: boolean;
  readonly authorizationContractRequiresNoLegalAdviceOrCertainty: boolean;

  // 8.5B commercial authorization gates (must be true)
  readonly authorizationContractRequiresFreeQuestionModeRemainsFree: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForFullExplanation: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForPhotoExplanation: boolean;
  readonly authorizationContractRequiresDocumentBypassGuardForFreeQa: boolean;
  readonly authorizationContractRequiresRedirectOfFullDocumentFromFreeQa: boolean;
  readonly authorizationContractRequiresPaymentBoundaryBeforeFullExplanation: boolean;
  readonly authorizationContractRequiresFailureNoChargePolicy: boolean;
  readonly authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid: boolean;

  // 8.5B runtime authorization flags (must be false)
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

  // 8.5B runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5C assertions
  readonly runtimeDryRunAuthorizationOnly: boolean;
  readonly dryRunAuthorizationSimulated: boolean;

  // Dry-run authorization decision gates
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

  // Commercial dry-run gates
  readonly dryRunConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly dryRunConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation: boolean;
  readonly dryRunConfirmsDocumentBypassGuardRequiredForFreeQa: boolean;
  readonly dryRunConfirmsFullDocumentRedirectFromFreeQa: boolean;
  readonly dryRunConfirmsPaymentBoundaryBeforeFullExplanation: boolean;
  readonly dryRunConfirmsFailureNoChargePolicy: boolean;
  readonly dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly dryRunConfirmsHighRiskSafetyContractEvenWhenPaid: boolean;

  // Dry-run decision outcome
  readonly dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowPilotIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunRequiresSeparateProductionReadinessReview: boolean;
  readonly dryRunRequiresExplicitGoLiveApproval: boolean;
  readonly dryRunRequiresManualOperatorConfirmationBeforeRuntime: boolean;

  readonly readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeDryRunAuthorizationResult {
  readonly checkId: "8.5C";
  readonly allPassed: boolean;
  readonly runtimeAuthorizationContractReadyForDryRunAuthorization: boolean;
  readonly controlledRealDocumentRuntimeDryRunAuthorizationAccepted: boolean;
  readonly runtimeDryRunAuthorizationOnly: true;
  readonly dryRunAuthorizationSimulated: true;
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

  readonly dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowPilotIfSeparatelyAuthorizedLater: boolean;
  readonly dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: false;
  readonly dryRunRequiresSeparateProductionReadinessReview: boolean;
  readonly dryRunRequiresExplicitGoLiveApproval: boolean;
  readonly dryRunRequiresManualOperatorConfirmationBeforeRuntime: boolean;

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

  readonly readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Dry-run authorization input validator ─────────────────────────────────────

function validateDryRunAuthorizationInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5B prerequisite gates
  if (o["prereqCheckId"] !== "8.5B")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeAuthorizationContractAccepted"] !== true)
    reasons.push("runtime_authorization_contract_not_accepted");
  if (o["runtimeAuthorizationContractOnly"] !== true)
    reasons.push("runtime_authorization_contract_only_false");
  if (o["readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization"] !== true)
    reasons.push("not_ready_for_8_5c_dry_run_authorization");

  // 8.5B authorization flags (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // 8.5B actual* performed flags (must be false)
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

  // 8.5B authorization contract gates (must be true)
  if (o["authorizationContractRequiresSeparateExplicitApproval"] !== true)
    reasons.push("authorization_contract_requires_separate_explicit_approval_false");
  if (o["authorizationContractRequiresFreshRiskReview"] !== true)
    reasons.push("authorization_contract_requires_fresh_risk_review_false");
  if (o["authorizationContractRequiresRuntimeKillSwitchEnabled"] !== true)
    reasons.push("authorization_contract_requires_runtime_kill_switch_enabled_false");
  if (o["authorizationContractRequiresFeatureFlagDefaultOff"] !== true)
    reasons.push("authorization_contract_requires_feature_flag_default_off_false");
  if (o["authorizationContractRequiresServerSideOnlyProcessing"] !== true)
    reasons.push("authorization_contract_requires_server_side_only_processing_false");
  if (o["authorizationContractRequiresNoClientSideSecrets"] !== true)
    reasons.push("authorization_contract_requires_no_client_side_secrets_false");
  if (o["authorizationContractRequiresNoPublicRuntimeByDefault"] !== true)
    reasons.push("authorization_contract_requires_no_public_runtime_by_default_false");
  if (o["authorizationContractRequiresNoPersistenceByDefault"] !== true)
    reasons.push("authorization_contract_requires_no_persistence_by_default_false");
  if (o["authorizationContractRequiresNoRawDocumentStorageByDefault"] !== true)
    reasons.push("authorization_contract_requires_no_raw_document_storage_by_default_false");
  if (o["authorizationContractRequiresNoModelOutputStorageByDefault"] !== true)
    reasons.push("authorization_contract_requires_no_model_output_storage_by_default_false");
  if (o["authorizationContractRequiresNoPromptStorage"] !== true)
    reasons.push("authorization_contract_requires_no_prompt_storage_false");
  if (o["authorizationContractRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("authorization_contract_requires_redaction_before_model_use_false");
  if (o["authorizationContractRequiresOcrOutputUntrusted"] !== true)
    reasons.push("authorization_contract_requires_ocr_output_untrusted_false");
  if (o["authorizationContractRequiresEvidenceGatePassBeforeInterpretation"] !== true)
    reasons.push("authorization_contract_requires_evidence_gate_pass_before_interpretation_false");
  if (o["authorizationContractRequiresUserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("authorization_contract_requires_user_visible_output_contract_before_display_false");
  if (o["authorizationContractRequiresPrivacyNoticeBeforeUpload"] !== true)
    reasons.push("authorization_contract_requires_privacy_notice_before_upload_false");
  if (o["authorizationContractRequiresUserLanguageSelectionBeforeOutput"] !== true)
    reasons.push("authorization_contract_requires_user_language_selection_before_output_false");
  if (o["authorizationContractRequiresRateLimitBeforePublicExposure"] !== true)
    reasons.push("authorization_contract_requires_rate_limit_before_public_exposure_false");
  if (o["authorizationContractRequiresAbuseDetectionBeforePublicExposure"] !== true)
    reasons.push("authorization_contract_requires_abuse_detection_before_public_exposure_false");
  if (o["authorizationContractRequiresMonitoringBeforePilot"] !== true)
    reasons.push("authorization_contract_requires_monitoring_before_pilot_false");
  if (o["authorizationContractRequiresRollbackBeforePilot"] !== true)
    reasons.push("authorization_contract_requires_rollback_before_pilot_false");
  if (o["authorizationContractRequiresAuditTraceBeforeRuntime"] !== true)
    reasons.push("authorization_contract_requires_audit_trace_before_runtime_false");
  if (o["authorizationContractRequiresTamperTestsBeforeRuntime"] !== true)
    reasons.push("authorization_contract_requires_tamper_tests_before_runtime_false");
  if (o["authorizationContractRequiresHumanReviewForHighRisk"] !== true)
    reasons.push("authorization_contract_requires_human_review_for_high_risk_false");
  if (o["authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("authorization_contract_requires_no_exact_deadline_without_delivery_date_false");
  if (o["authorizationContractRequiresNoLegalAdviceOrCertainty"] !== true)
    reasons.push("authorization_contract_requires_no_legal_advice_or_certainty_false");

  // 8.5B commercial authorization gates (must be true)
  if (o["authorizationContractRequiresFreeQuestionModeRemainsFree"] !== true)
    reasons.push("authorization_contract_requires_free_question_mode_remains_free_false");
  if (o["authorizationContractRequiresPaidDocumentModeForFullExplanation"] !== true)
    reasons.push("authorization_contract_requires_paid_document_mode_for_full_explanation_false");
  if (o["authorizationContractRequiresPaidDocumentModeForPhotoExplanation"] !== true)
    reasons.push("authorization_contract_requires_paid_document_mode_for_photo_explanation_false");
  if (o["authorizationContractRequiresDocumentBypassGuardForFreeQa"] !== true)
    reasons.push("authorization_contract_requires_document_bypass_guard_for_free_qa_false");
  if (o["authorizationContractRequiresRedirectOfFullDocumentFromFreeQa"] !== true)
    reasons.push("authorization_contract_requires_redirect_of_full_document_from_free_qa_false");
  if (o["authorizationContractRequiresPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("authorization_contract_requires_payment_boundary_before_full_explanation_false");
  if (o["authorizationContractRequiresFailureNoChargePolicy"] !== true)
    reasons.push("authorization_contract_requires_failure_no_charge_policy_false");
  if (o["authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("authorization_contract_requires_payment_does_not_override_safety_blocks_false");
  if (o["authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid"] !== true)
    reasons.push("authorization_contract_requires_high_risk_safety_contract_even_when_paid_false");

  // 8.5B runtime authorization flags (must be false)
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

  // 8.5B runtime/public invariants
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

  // Derived 8.5C assertions
  if (o["runtimeDryRunAuthorizationOnly"] !== true)
    reasons.push("runtime_dry_run_authorization_only_false");
  if (o["dryRunAuthorizationSimulated"] !== true)
    reasons.push("dry_run_authorization_simulated_false");

  // Dry-run authorization decision gates (must be true)
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

  // Commercial dry-run gates (must be true)
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

  // Dry-run decision outcome
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

  if (o["readyFor8x5DControlledRealDocumentRuntimeExecutionPlan"] !== true)
    reasons.push("not_ready_for_8_5d_runtime_execution_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeDryRunAuthorization(): ControlledRealDocumentRuntimeDryRunAuthorizationResult {
  // ── Step 1: Obtain 8.5B runtime authorization contract result ─────────────
  const contractResult = runControlledRealDocumentRuntimeAuthorizationContract();

  const prereqAllPassed = contractResult.allPassed;
  const prereqReady =
    contractResult.readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization;

  // ── Step 2: Build canonical dry-run authorization input ───────────────────
  const canonicalInput: ControlledRealDocumentRuntimeDryRunAuthorizationInput = {
    prereqCheckId: contractResult.checkId,
    prereqAllPassed,
    runtimeImplementationPlanReadyForAuthorizationContract:
      contractResult.runtimeImplementationPlanReadyForAuthorizationContract,
    controlledRealDocumentRuntimeAuthorizationContractAccepted:
      contractResult.controlledRealDocumentRuntimeAuthorizationContractAccepted,
    runtimeAuthorizationContractOnly: contractResult.runtimeAuthorizationContractOnly,
    readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: prereqReady,

    runtimeAuthorizationGranted: contractResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: contractResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: contractResult.productionAuthorizationGranted,
    finalAuthorizationGranted: contractResult.finalAuthorizationGranted,

    actualRealDocumentInputPerformed: contractResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      contractResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: contractResult.actualOcrPerformed,
    actualPhotoInputProcessed: contractResult.actualPhotoInputProcessed,
    actualFileInputProcessed: contractResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: contractResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed:
      contractResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: contractResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: contractResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: contractResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: contractResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: contractResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed:
      contractResult.actualDeadlineCalculationPerformed,

    authorizationContractRequiresSeparateExplicitApproval:
      contractResult.authorizationContractRequiresSeparateExplicitApproval,
    authorizationContractRequiresFreshRiskReview:
      contractResult.authorizationContractRequiresFreshRiskReview,
    authorizationContractRequiresRuntimeKillSwitchEnabled:
      contractResult.authorizationContractRequiresRuntimeKillSwitchEnabled,
    authorizationContractRequiresFeatureFlagDefaultOff:
      contractResult.authorizationContractRequiresFeatureFlagDefaultOff,
    authorizationContractRequiresServerSideOnlyProcessing:
      contractResult.authorizationContractRequiresServerSideOnlyProcessing,
    authorizationContractRequiresNoClientSideSecrets:
      contractResult.authorizationContractRequiresNoClientSideSecrets,
    authorizationContractRequiresNoPublicRuntimeByDefault:
      contractResult.authorizationContractRequiresNoPublicRuntimeByDefault,
    authorizationContractRequiresNoPersistenceByDefault:
      contractResult.authorizationContractRequiresNoPersistenceByDefault,
    authorizationContractRequiresNoRawDocumentStorageByDefault:
      contractResult.authorizationContractRequiresNoRawDocumentStorageByDefault,
    authorizationContractRequiresNoModelOutputStorageByDefault:
      contractResult.authorizationContractRequiresNoModelOutputStorageByDefault,
    authorizationContractRequiresNoPromptStorage:
      contractResult.authorizationContractRequiresNoPromptStorage,
    authorizationContractRequiresRedactionBeforeModelUse:
      contractResult.authorizationContractRequiresRedactionBeforeModelUse,
    authorizationContractRequiresOcrOutputUntrusted:
      contractResult.authorizationContractRequiresOcrOutputUntrusted,
    authorizationContractRequiresEvidenceGatePassBeforeInterpretation:
      contractResult.authorizationContractRequiresEvidenceGatePassBeforeInterpretation,
    authorizationContractRequiresUserVisibleOutputContractBeforeDisplay:
      contractResult.authorizationContractRequiresUserVisibleOutputContractBeforeDisplay,
    authorizationContractRequiresPrivacyNoticeBeforeUpload:
      contractResult.authorizationContractRequiresPrivacyNoticeBeforeUpload,
    authorizationContractRequiresUserLanguageSelectionBeforeOutput:
      contractResult.authorizationContractRequiresUserLanguageSelectionBeforeOutput,
    authorizationContractRequiresRateLimitBeforePublicExposure:
      contractResult.authorizationContractRequiresRateLimitBeforePublicExposure,
    authorizationContractRequiresAbuseDetectionBeforePublicExposure:
      contractResult.authorizationContractRequiresAbuseDetectionBeforePublicExposure,
    authorizationContractRequiresMonitoringBeforePilot:
      contractResult.authorizationContractRequiresMonitoringBeforePilot,
    authorizationContractRequiresRollbackBeforePilot:
      contractResult.authorizationContractRequiresRollbackBeforePilot,
    authorizationContractRequiresAuditTraceBeforeRuntime:
      contractResult.authorizationContractRequiresAuditTraceBeforeRuntime,
    authorizationContractRequiresTamperTestsBeforeRuntime:
      contractResult.authorizationContractRequiresTamperTestsBeforeRuntime,
    authorizationContractRequiresHumanReviewForHighRisk:
      contractResult.authorizationContractRequiresHumanReviewForHighRisk,
    authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate:
      contractResult.authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate,
    authorizationContractRequiresNoLegalAdviceOrCertainty:
      contractResult.authorizationContractRequiresNoLegalAdviceOrCertainty,

    authorizationContractRequiresFreeQuestionModeRemainsFree:
      contractResult.authorizationContractRequiresFreeQuestionModeRemainsFree,
    authorizationContractRequiresPaidDocumentModeForFullExplanation:
      contractResult.authorizationContractRequiresPaidDocumentModeForFullExplanation,
    authorizationContractRequiresPaidDocumentModeForPhotoExplanation:
      contractResult.authorizationContractRequiresPaidDocumentModeForPhotoExplanation,
    authorizationContractRequiresDocumentBypassGuardForFreeQa:
      contractResult.authorizationContractRequiresDocumentBypassGuardForFreeQa,
    authorizationContractRequiresRedirectOfFullDocumentFromFreeQa:
      contractResult.authorizationContractRequiresRedirectOfFullDocumentFromFreeQa,
    authorizationContractRequiresPaymentBoundaryBeforeFullExplanation:
      contractResult.authorizationContractRequiresPaymentBoundaryBeforeFullExplanation,
    authorizationContractRequiresFailureNoChargePolicy:
      contractResult.authorizationContractRequiresFailureNoChargePolicy,
    authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks:
      contractResult.authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks,
    authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid:
      contractResult.authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid,

    realDocumentInputAuthorizedNow: contractResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      contractResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      contractResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: contractResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: contractResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: contractResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: contractResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: contractResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: contractResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      contractResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: contractResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: contractResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: contractResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: contractResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized: contractResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: contractResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: contractResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: contractResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: contractResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      contractResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: contractResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: contractResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: contractResult.publicRuntimeEnabled,
    persistenceUsed: contractResult.persistenceUsed,
    neverUserVisible: contractResult.neverUserVisible,

    runtimeDryRunAuthorizationOnly: true,
    dryRunAuthorizationSimulated: true,

    dryRunConfirmsSeparateExplicitApprovalStillRequired: prereqAllPassed && prereqReady,
    dryRunConfirmsFreshRiskReviewStillRequired: prereqAllPassed && prereqReady,
    dryRunConfirmsRuntimeKillSwitchRequired: prereqAllPassed && prereqReady,
    dryRunConfirmsFeatureFlagMustDefaultOff: prereqAllPassed && prereqReady,
    dryRunConfirmsServerSideOnlyProcessingRequired: prereqAllPassed && prereqReady,
    dryRunConfirmsNoClientSideSecretsAllowed: prereqAllPassed && prereqReady,
    dryRunConfirmsNoPublicRuntimeByDefault: prereqAllPassed && prereqReady,
    dryRunConfirmsNoPersistenceByDefault: prereqAllPassed && prereqReady,
    dryRunConfirmsNoRawDocumentStorageByDefault: prereqAllPassed && prereqReady,
    dryRunConfirmsNoModelOutputStorageByDefault: prereqAllPassed && prereqReady,
    dryRunConfirmsNoPromptStorage: prereqAllPassed && prereqReady,
    dryRunConfirmsEphemeralProcessingByDefault: prereqAllPassed && prereqReady,
    dryRunConfirmsRedactionBeforeModelUseRequired: prereqAllPassed && prereqReady,
    dryRunConfirmsOcrOutputUntrusted: prereqAllPassed && prereqReady,
    dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation:
      prereqAllPassed && prereqReady,
    dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      prereqAllPassed && prereqReady,
    dryRunConfirmsPrivacyNoticeRequiredBeforeUpload: prereqAllPassed && prereqReady,
    dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput:
      prereqAllPassed && prereqReady,
    dryRunConfirmsRateLimitRequiredBeforePublicExposure: prereqAllPassed && prereqReady,
    dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure:
      prereqAllPassed && prereqReady,
    dryRunConfirmsMonitoringRequiredBeforePilot: prereqAllPassed && prereqReady,
    dryRunConfirmsRollbackRequiredBeforePilot: prereqAllPassed && prereqReady,
    dryRunConfirmsAuditTraceRequiredBeforeRuntime: prereqAllPassed && prereqReady,
    dryRunConfirmsTamperTestsRequiredBeforeRuntime: prereqAllPassed && prereqReady,
    dryRunConfirmsHumanReviewRequiredForHighRisk: prereqAllPassed && prereqReady,
    dryRunConfirmsNoExactDeadlineWithoutDeliveryDate: prereqAllPassed && prereqReady,
    dryRunConfirmsNoLegalAdviceOrCertainty: prereqAllPassed && prereqReady,

    dryRunConfirmsFreeQuestionModeRemainsFree: prereqAllPassed && prereqReady,
    dryRunConfirmsPaidDocumentModeRequiredForFullExplanation:
      prereqAllPassed && prereqReady,
    dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      prereqAllPassed && prereqReady,
    dryRunConfirmsDocumentBypassGuardRequiredForFreeQa: prereqAllPassed && prereqReady,
    dryRunConfirmsFullDocumentRedirectFromFreeQa: prereqAllPassed && prereqReady,
    dryRunConfirmsPaymentBoundaryBeforeFullExplanation: prereqAllPassed && prereqReady,
    dryRunConfirmsFailureNoChargePolicy: prereqAllPassed && prereqReady,
    dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks: prereqAllPassed && prereqReady,
    dryRunConfirmsHighRiskSafetyContractEvenWhenPaid: prereqAllPassed && prereqReady,

    dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater:
      prereqAllPassed && prereqReady,
    dryRunWouldAllowPilotIfSeparatelyAuthorizedLater:
      prereqAllPassed && prereqReady,
    dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: false,
    dryRunRequiresSeparateProductionReadinessReview: prereqAllPassed && prereqReady,
    dryRunRequiresExplicitGoLiveApproval: prereqAllPassed && prereqReady,
    dryRunRequiresManualOperatorConfirmationBeforeRuntime:
      prereqAllPassed && prereqReady,

    readyFor8x5DControlledRealDocumentRuntimeExecutionPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical dry-run authorization input ────────────────
  const dryRunValidation = validateDryRunAuthorizationInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const dryRunAccepted = dryRunValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5B checkId wrong", override: { prereqCheckId: "8.5A" } },
    { label: "8.5B allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeAuthorizationContractAccepted false", override: { controlledRealDocumentRuntimeAuthorizationContractAccepted: false } },
    { label: "runtimeAuthorizationContractOnly false", override: { runtimeAuthorizationContractOnly: false } },
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
    { label: "authorizationContractRequiresSeparateExplicitApproval false", override: { authorizationContractRequiresSeparateExplicitApproval: false } },
    { label: "authorizationContractRequiresFreshRiskReview false", override: { authorizationContractRequiresFreshRiskReview: false } },
    { label: "authorizationContractRequiresRuntimeKillSwitchEnabled false", override: { authorizationContractRequiresRuntimeKillSwitchEnabled: false } },
    { label: "authorizationContractRequiresFeatureFlagDefaultOff false", override: { authorizationContractRequiresFeatureFlagDefaultOff: false } },
    { label: "authorizationContractRequiresServerSideOnlyProcessing false", override: { authorizationContractRequiresServerSideOnlyProcessing: false } },
    { label: "authorizationContractRequiresNoClientSideSecrets false", override: { authorizationContractRequiresNoClientSideSecrets: false } },
    { label: "authorizationContractRequiresNoPublicRuntimeByDefault false", override: { authorizationContractRequiresNoPublicRuntimeByDefault: false } },
    { label: "authorizationContractRequiresNoPersistenceByDefault false", override: { authorizationContractRequiresNoPersistenceByDefault: false } },
    { label: "authorizationContractRequiresNoRawDocumentStorageByDefault false", override: { authorizationContractRequiresNoRawDocumentStorageByDefault: false } },
    { label: "authorizationContractRequiresNoModelOutputStorageByDefault false", override: { authorizationContractRequiresNoModelOutputStorageByDefault: false } },
    { label: "authorizationContractRequiresNoPromptStorage false", override: { authorizationContractRequiresNoPromptStorage: false } },
    { label: "authorizationContractRequiresRedactionBeforeModelUse false", override: { authorizationContractRequiresRedactionBeforeModelUse: false } },
    { label: "authorizationContractRequiresOcrOutputUntrusted false", override: { authorizationContractRequiresOcrOutputUntrusted: false } },
    { label: "authorizationContractRequiresEvidenceGatePassBeforeInterpretation false", override: { authorizationContractRequiresEvidenceGatePassBeforeInterpretation: false } },
    { label: "authorizationContractRequiresUserVisibleOutputContractBeforeDisplay false", override: { authorizationContractRequiresUserVisibleOutputContractBeforeDisplay: false } },
    { label: "authorizationContractRequiresPrivacyNoticeBeforeUpload false", override: { authorizationContractRequiresPrivacyNoticeBeforeUpload: false } },
    { label: "authorizationContractRequiresUserLanguageSelectionBeforeOutput false", override: { authorizationContractRequiresUserLanguageSelectionBeforeOutput: false } },
    { label: "authorizationContractRequiresRateLimitBeforePublicExposure false", override: { authorizationContractRequiresRateLimitBeforePublicExposure: false } },
    { label: "authorizationContractRequiresAbuseDetectionBeforePublicExposure false", override: { authorizationContractRequiresAbuseDetectionBeforePublicExposure: false } },
    { label: "authorizationContractRequiresMonitoringBeforePilot false", override: { authorizationContractRequiresMonitoringBeforePilot: false } },
    { label: "authorizationContractRequiresRollbackBeforePilot false", override: { authorizationContractRequiresRollbackBeforePilot: false } },
    { label: "authorizationContractRequiresAuditTraceBeforeRuntime false", override: { authorizationContractRequiresAuditTraceBeforeRuntime: false } },
    { label: "authorizationContractRequiresTamperTestsBeforeRuntime false", override: { authorizationContractRequiresTamperTestsBeforeRuntime: false } },
    { label: "authorizationContractRequiresHumanReviewForHighRisk false", override: { authorizationContractRequiresHumanReviewForHighRisk: false } },
    { label: "authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate false", override: { authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate: false } },
    { label: "authorizationContractRequiresNoLegalAdviceOrCertainty false", override: { authorizationContractRequiresNoLegalAdviceOrCertainty: false } },
    { label: "authorizationContractRequiresFreeQuestionModeRemainsFree false", override: { authorizationContractRequiresFreeQuestionModeRemainsFree: false } },
    { label: "authorizationContractRequiresPaidDocumentModeForFullExplanation false", override: { authorizationContractRequiresPaidDocumentModeForFullExplanation: false } },
    { label: "authorizationContractRequiresPaidDocumentModeForPhotoExplanation false", override: { authorizationContractRequiresPaidDocumentModeForPhotoExplanation: false } },
    { label: "authorizationContractRequiresDocumentBypassGuardForFreeQa false", override: { authorizationContractRequiresDocumentBypassGuardForFreeQa: false } },
    { label: "authorizationContractRequiresRedirectOfFullDocumentFromFreeQa false", override: { authorizationContractRequiresRedirectOfFullDocumentFromFreeQa: false } },
    { label: "authorizationContractRequiresPaymentBoundaryBeforeFullExplanation false", override: { authorizationContractRequiresPaymentBoundaryBeforeFullExplanation: false } },
    { label: "authorizationContractRequiresFailureNoChargePolicy false", override: { authorizationContractRequiresFailureNoChargePolicy: false } },
    { label: "authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks false", override: { authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid false", override: { authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid: false } },
    { label: "readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization false", override: { readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: false } },
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
    { label: "runtimeDryRunAuthorizationOnly false", override: { runtimeDryRunAuthorizationOnly: false } },
    { label: "dryRunAuthorizationSimulated false", override: { dryRunAuthorizationSimulated: false } },
    { label: "runtimeAuthorizationGranted true (8.5C check)", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true (8.5C check)", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true (8.5C check)", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5C check)", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateDryRunAuthorizationInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    dryRunAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5C: controlled real-document runtime dry-run authorization layer — depends on completed 8.5B controlled real-document runtime authorization contract",
    "8.5C is dry-run/planning only — not runtime authorization",
    "dry-run authorization was simulated",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "dry-run would allow runtime only if separately authorized later",
    "dry-run would allow pilot only if separately authorized later",
    "dry-run would not allow production without separate production readiness review",
    "explicit go-live approval remains required",
    "manual operator confirmation remains required before runtime",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5C",
    "8.3AC was not re-run",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "high-risk safety contract still applies even when paid",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.5D controlled real-document runtime execution plan",
    "8.5D is still planning-only unless explicitly authorized later",
    `8.5B prerequisite: allPassed=${contractResult.allPassed}, readyFor8x5C=${contractResult.readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization}`,
    `dry-run authorization input validation: ${dryRunAccepted ? "accepted" : "REJECTED"} — reasons: ${dryRunValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5C allPassed: true — controlled real-document runtime dry-run authorization accepted"
    );
    notes.push(
      "readyFor8x5DControlledRealDocumentRuntimeExecutionPlan: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.5C",
    allPassed,
    runtimeAuthorizationContractReadyForDryRunAuthorization:
      canonicalInput.controlledRealDocumentRuntimeAuthorizationContractAccepted,
    controlledRealDocumentRuntimeDryRunAuthorizationAccepted: allPassed,
    runtimeDryRunAuthorizationOnly: true,
    dryRunAuthorizationSimulated: true,
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

    dryRunConfirmsSeparateExplicitApprovalStillRequired:
      canonicalInput.dryRunConfirmsSeparateExplicitApprovalStillRequired,
    dryRunConfirmsFreshRiskReviewStillRequired:
      canonicalInput.dryRunConfirmsFreshRiskReviewStillRequired,
    dryRunConfirmsRuntimeKillSwitchRequired:
      canonicalInput.dryRunConfirmsRuntimeKillSwitchRequired,
    dryRunConfirmsFeatureFlagMustDefaultOff:
      canonicalInput.dryRunConfirmsFeatureFlagMustDefaultOff,
    dryRunConfirmsServerSideOnlyProcessingRequired:
      canonicalInput.dryRunConfirmsServerSideOnlyProcessingRequired,
    dryRunConfirmsNoClientSideSecretsAllowed:
      canonicalInput.dryRunConfirmsNoClientSideSecretsAllowed,
    dryRunConfirmsNoPublicRuntimeByDefault:
      canonicalInput.dryRunConfirmsNoPublicRuntimeByDefault,
    dryRunConfirmsNoPersistenceByDefault:
      canonicalInput.dryRunConfirmsNoPersistenceByDefault,
    dryRunConfirmsNoRawDocumentStorageByDefault:
      canonicalInput.dryRunConfirmsNoRawDocumentStorageByDefault,
    dryRunConfirmsNoModelOutputStorageByDefault:
      canonicalInput.dryRunConfirmsNoModelOutputStorageByDefault,
    dryRunConfirmsNoPromptStorage: canonicalInput.dryRunConfirmsNoPromptStorage,
    dryRunConfirmsEphemeralProcessingByDefault:
      canonicalInput.dryRunConfirmsEphemeralProcessingByDefault,
    dryRunConfirmsRedactionBeforeModelUseRequired:
      canonicalInput.dryRunConfirmsRedactionBeforeModelUseRequired,
    dryRunConfirmsOcrOutputUntrusted: canonicalInput.dryRunConfirmsOcrOutputUntrusted,
    dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation:
      canonicalInput.dryRunConfirmsEvidenceGatesRequiredBeforeInterpretation,
    dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay:
      canonicalInput.dryRunConfirmsUserVisibleOutputContractRequiredBeforeDisplay,
    dryRunConfirmsPrivacyNoticeRequiredBeforeUpload:
      canonicalInput.dryRunConfirmsPrivacyNoticeRequiredBeforeUpload,
    dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput:
      canonicalInput.dryRunConfirmsUserLanguageSelectionRequiredBeforeOutput,
    dryRunConfirmsRateLimitRequiredBeforePublicExposure:
      canonicalInput.dryRunConfirmsRateLimitRequiredBeforePublicExposure,
    dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure:
      canonicalInput.dryRunConfirmsAbuseDetectionRequiredBeforePublicExposure,
    dryRunConfirmsMonitoringRequiredBeforePilot:
      canonicalInput.dryRunConfirmsMonitoringRequiredBeforePilot,
    dryRunConfirmsRollbackRequiredBeforePilot:
      canonicalInput.dryRunConfirmsRollbackRequiredBeforePilot,
    dryRunConfirmsAuditTraceRequiredBeforeRuntime:
      canonicalInput.dryRunConfirmsAuditTraceRequiredBeforeRuntime,
    dryRunConfirmsTamperTestsRequiredBeforeRuntime:
      canonicalInput.dryRunConfirmsTamperTestsRequiredBeforeRuntime,
    dryRunConfirmsHumanReviewRequiredForHighRisk:
      canonicalInput.dryRunConfirmsHumanReviewRequiredForHighRisk,
    dryRunConfirmsNoExactDeadlineWithoutDeliveryDate:
      canonicalInput.dryRunConfirmsNoExactDeadlineWithoutDeliveryDate,
    dryRunConfirmsNoLegalAdviceOrCertainty:
      canonicalInput.dryRunConfirmsNoLegalAdviceOrCertainty,

    dryRunConfirmsFreeQuestionModeRemainsFree:
      canonicalInput.dryRunConfirmsFreeQuestionModeRemainsFree,
    dryRunConfirmsPaidDocumentModeRequiredForFullExplanation:
      canonicalInput.dryRunConfirmsPaidDocumentModeRequiredForFullExplanation,
    dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation:
      canonicalInput.dryRunConfirmsPaidDocumentModeRequiredForPhotoExplanation,
    dryRunConfirmsDocumentBypassGuardRequiredForFreeQa:
      canonicalInput.dryRunConfirmsDocumentBypassGuardRequiredForFreeQa,
    dryRunConfirmsFullDocumentRedirectFromFreeQa:
      canonicalInput.dryRunConfirmsFullDocumentRedirectFromFreeQa,
    dryRunConfirmsPaymentBoundaryBeforeFullExplanation:
      canonicalInput.dryRunConfirmsPaymentBoundaryBeforeFullExplanation,
    dryRunConfirmsFailureNoChargePolicy:
      canonicalInput.dryRunConfirmsFailureNoChargePolicy,
    dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.dryRunConfirmsPaymentDoesNotOverrideSafetyBlocks,
    dryRunConfirmsHighRiskSafetyContractEvenWhenPaid:
      canonicalInput.dryRunConfirmsHighRiskSafetyContractEvenWhenPaid,

    dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater:
      canonicalInput.dryRunWouldAllowRuntimeIfSeparatelyAuthorizedLater,
    dryRunWouldAllowPilotIfSeparatelyAuthorizedLater:
      canonicalInput.dryRunWouldAllowPilotIfSeparatelyAuthorizedLater,
    dryRunWouldAllowProductionIfSeparatelyAuthorizedLater: false,
    dryRunRequiresSeparateProductionReadinessReview:
      canonicalInput.dryRunRequiresSeparateProductionReadinessReview,
    dryRunRequiresExplicitGoLiveApproval:
      canonicalInput.dryRunRequiresExplicitGoLiveApproval,
    dryRunRequiresManualOperatorConfirmationBeforeRuntime:
      canonicalInput.dryRunRequiresManualOperatorConfirmationBeforeRuntime,

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

    readyFor8x5DControlledRealDocumentRuntimeExecutionPlan:
      canonicalInput.readyFor8x5DControlledRealDocumentRuntimeExecutionPlan,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
