/**
 * Phase 8.5B — Controlled Real Document Runtime Authorization Contract.
 *
 * CONTRACT/PLANNING ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5A.
 *
 * This file defines the exact contract that must be satisfied before any
 * future runtime authorization can be considered. It is:
 *   - NOT runtime authorization.
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

import { runControlledRealDocumentRuntimeImplementationPlan } from "./run-controlled-real-document-runtime-implementation-plan";

// ── Local runtime authorization contract input type ───────────────────────────

interface ControlledRealDocumentRuntimeAuthorizationContractInput {
  // 8.5A prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly planningClosureReadyForRuntimeImplementationPlan: boolean;
  readonly controlledRealDocumentRuntimeImplementationPlanAccepted: boolean;
  readonly runtimeImplementationPlanOnly: boolean;
  readonly readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: boolean;

  // 8.5A authorization flags (must be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // 8.5A actual* performed flags (must be false)
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

  // 8.5A runtime plan gates (must be true)
  readonly runtimePlanRequiresSeparateExplicitAuthorization: boolean;
  readonly runtimePlanRequiresFreshRiskReview: boolean;
  readonly runtimePlanRequiresRuntimeKillSwitch: boolean;
  readonly runtimePlanRequiresFeatureFlagDefaultOff: boolean;
  readonly runtimePlanRequiresServerSideOnlyProcessingBoundary: boolean;
  readonly runtimePlanRequiresNoClientSideSecretExposure: boolean;
  readonly runtimePlanRequiresNoPromptLeakage: boolean;
  readonly runtimePlanRequiresNoModelOutputPersistenceByDefault: boolean;
  readonly runtimePlanRequiresNoRawDocumentPersistenceByDefault: boolean;
  readonly runtimePlanRequiresEphemeralProcessingByDefault: boolean;
  readonly runtimePlanRequiresRedactionBeforeModelUse: boolean;
  readonly runtimePlanRequiresOcrOutputTreatedAsUntrusted: boolean;
  readonly runtimePlanRequiresEvidenceGatesBeforeInterpretation: boolean;
  readonly runtimePlanRequiresUserVisibleOutputContractBeforeDisplay: boolean;
  readonly runtimePlanRequiresDocumentBypassGuardBeforeFreeQa: boolean;
  readonly runtimePlanRequiresPaidDocumentModeBeforeFullExplanation: boolean;
  readonly runtimePlanRequiresPaymentBoundaryBeforeFullExplanation: boolean;
  readonly runtimePlanRequiresFailureNoChargePolicy: boolean;
  readonly runtimePlanRequiresStoragePolicyBeforeAnyPersistence: boolean;
  readonly runtimePlanRequiresHumanReviewPolicyForHighRisk: boolean;
  readonly runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate: boolean;
  readonly runtimePlanRequiresNoLegalAdviceOrCertainty: boolean;
  readonly runtimePlanRequiresAuditTraceBeforeRuntime: boolean;
  readonly runtimePlanRequiresTamperTestsBeforeRuntime: boolean;
  readonly runtimePlanRequiresRateLimitBeforePublicExposure: boolean;
  readonly runtimePlanRequiresAbuseDetectionBeforePublicExposure: boolean;
  readonly runtimePlanRequiresPrivacyNoticeBeforeUpload: boolean;
  readonly runtimePlanRequiresUserLanguageSelectionBeforeOutput: boolean;
  readonly runtimePlanRequiresRollbackPlanBeforePilot: boolean;
  readonly runtimePlanRequiresMonitoringPlanBeforePilot: boolean;

  // 8.5A commercial/runtime confirmations (must be true)
  readonly runtimePlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly runtimePlanConfirmsDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode: boolean;
  readonly runtimePlanConfirmsDocumentBypassGuardIsMandatory: boolean;
  readonly runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract: boolean;

  // 8.5A runtime authorization flags (must be false)
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

  // 8.5A runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5B assertions
  readonly runtimeAuthorizationContractOnly: boolean;

  // Authorization contract gates
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

  // Commercial authorization gates
  readonly authorizationContractRequiresFreeQuestionModeRemainsFree: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForFullExplanation: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForPhotoExplanation: boolean;
  readonly authorizationContractRequiresDocumentBypassGuardForFreeQa: boolean;
  readonly authorizationContractRequiresRedirectOfFullDocumentFromFreeQa: boolean;
  readonly authorizationContractRequiresPaymentBoundaryBeforeFullExplanation: boolean;
  readonly authorizationContractRequiresFailureNoChargePolicy: boolean;
  readonly authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid: boolean;

  readonly readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeAuthorizationContractResult {
  readonly checkId: "8.5B";
  readonly allPassed: boolean;
  readonly runtimeImplementationPlanReadyForAuthorizationContract: boolean;
  readonly controlledRealDocumentRuntimeAuthorizationContractAccepted: boolean;
  readonly runtimeAuthorizationContractOnly: true;
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

  readonly authorizationContractRequiresFreeQuestionModeRemainsFree: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForFullExplanation: boolean;
  readonly authorizationContractRequiresPaidDocumentModeForPhotoExplanation: boolean;
  readonly authorizationContractRequiresDocumentBypassGuardForFreeQa: boolean;
  readonly authorizationContractRequiresRedirectOfFullDocumentFromFreeQa: boolean;
  readonly authorizationContractRequiresPaymentBoundaryBeforeFullExplanation: boolean;
  readonly authorizationContractRequiresFailureNoChargePolicy: boolean;
  readonly authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid: boolean;

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

  readonly readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Runtime authorization contract input validator ────────────────────────────

function validateAuthorizationContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5A prerequisite gates
  if (o["prereqCheckId"] !== "8.5A")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentRuntimeImplementationPlanAccepted"] !== true)
    reasons.push("runtime_implementation_plan_not_accepted");
  if (o["runtimeImplementationPlanOnly"] !== true)
    reasons.push("runtime_implementation_plan_only_false");
  if (o["readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract"] !== true)
    reasons.push("not_ready_for_8_5b_runtime_authorization_contract");

  // 8.5A authorization flags (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // 8.5A actual* performed flags (must be false)
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

  // 8.5A runtime plan gates (must be true)
  if (o["runtimePlanRequiresSeparateExplicitAuthorization"] !== true)
    reasons.push("runtime_plan_requires_separate_explicit_authorization_false");
  if (o["runtimePlanRequiresFreshRiskReview"] !== true)
    reasons.push("runtime_plan_requires_fresh_risk_review_false");
  if (o["runtimePlanRequiresRuntimeKillSwitch"] !== true)
    reasons.push("runtime_plan_requires_runtime_kill_switch_false");
  if (o["runtimePlanRequiresFeatureFlagDefaultOff"] !== true)
    reasons.push("runtime_plan_requires_feature_flag_default_off_false");
  if (o["runtimePlanRequiresServerSideOnlyProcessingBoundary"] !== true)
    reasons.push("runtime_plan_requires_server_side_only_processing_boundary_false");
  if (o["runtimePlanRequiresNoClientSideSecretExposure"] !== true)
    reasons.push("runtime_plan_requires_no_client_side_secret_exposure_false");
  if (o["runtimePlanRequiresNoPromptLeakage"] !== true)
    reasons.push("runtime_plan_requires_no_prompt_leakage_false");
  if (o["runtimePlanRequiresNoModelOutputPersistenceByDefault"] !== true)
    reasons.push("runtime_plan_requires_no_model_output_persistence_by_default_false");
  if (o["runtimePlanRequiresNoRawDocumentPersistenceByDefault"] !== true)
    reasons.push("runtime_plan_requires_no_raw_document_persistence_by_default_false");
  if (o["runtimePlanRequiresEphemeralProcessingByDefault"] !== true)
    reasons.push("runtime_plan_requires_ephemeral_processing_by_default_false");
  if (o["runtimePlanRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("runtime_plan_requires_redaction_before_model_use_false");
  if (o["runtimePlanRequiresOcrOutputTreatedAsUntrusted"] !== true)
    reasons.push("runtime_plan_requires_ocr_output_treated_as_untrusted_false");
  if (o["runtimePlanRequiresEvidenceGatesBeforeInterpretation"] !== true)
    reasons.push("runtime_plan_requires_evidence_gates_before_interpretation_false");
  if (o["runtimePlanRequiresUserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("runtime_plan_requires_user_visible_output_contract_before_display_false");
  if (o["runtimePlanRequiresDocumentBypassGuardBeforeFreeQa"] !== true)
    reasons.push("runtime_plan_requires_document_bypass_guard_before_free_qa_false");
  if (o["runtimePlanRequiresPaidDocumentModeBeforeFullExplanation"] !== true)
    reasons.push("runtime_plan_requires_paid_document_mode_before_full_explanation_false");
  if (o["runtimePlanRequiresPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("runtime_plan_requires_payment_boundary_before_full_explanation_false");
  if (o["runtimePlanRequiresFailureNoChargePolicy"] !== true)
    reasons.push("runtime_plan_requires_failure_no_charge_policy_false");
  if (o["runtimePlanRequiresStoragePolicyBeforeAnyPersistence"] !== true)
    reasons.push("runtime_plan_requires_storage_policy_before_any_persistence_false");
  if (o["runtimePlanRequiresHumanReviewPolicyForHighRisk"] !== true)
    reasons.push("runtime_plan_requires_human_review_policy_for_high_risk_false");
  if (o["runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("runtime_plan_requires_no_exact_deadline_without_delivery_date_false");
  if (o["runtimePlanRequiresNoLegalAdviceOrCertainty"] !== true)
    reasons.push("runtime_plan_requires_no_legal_advice_or_certainty_false");
  if (o["runtimePlanRequiresAuditTraceBeforeRuntime"] !== true)
    reasons.push("runtime_plan_requires_audit_trace_before_runtime_false");
  if (o["runtimePlanRequiresTamperTestsBeforeRuntime"] !== true)
    reasons.push("runtime_plan_requires_tamper_tests_before_runtime_false");
  if (o["runtimePlanRequiresRateLimitBeforePublicExposure"] !== true)
    reasons.push("runtime_plan_requires_rate_limit_before_public_exposure_false");
  if (o["runtimePlanRequiresAbuseDetectionBeforePublicExposure"] !== true)
    reasons.push("runtime_plan_requires_abuse_detection_before_public_exposure_false");
  if (o["runtimePlanRequiresPrivacyNoticeBeforeUpload"] !== true)
    reasons.push("runtime_plan_requires_privacy_notice_before_upload_false");
  if (o["runtimePlanRequiresUserLanguageSelectionBeforeOutput"] !== true)
    reasons.push("runtime_plan_requires_user_language_selection_before_output_false");
  if (o["runtimePlanRequiresRollbackPlanBeforePilot"] !== true)
    reasons.push("runtime_plan_requires_rollback_plan_before_pilot_false");
  if (o["runtimePlanRequiresMonitoringPlanBeforePilot"] !== true)
    reasons.push("runtime_plan_requires_monitoring_plan_before_pilot_false");

  // 8.5A commercial/runtime confirmations (must be true)
  if (o["runtimePlanConfirmsFreeQuestionModeRemainsFree"] !== true)
    reasons.push("runtime_plan_confirms_free_question_mode_remains_free_false");
  if (o["runtimePlanConfirmsDocumentExplanationRequiresPaidMode"] !== true)
    reasons.push("runtime_plan_confirms_document_explanation_requires_paid_mode_false");
  if (o["runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode"] !== true)
    reasons.push("runtime_plan_confirms_photo_document_explanation_requires_paid_mode_false");
  if (o["runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode"] !== true)
    reasons.push("runtime_plan_confirms_pasted_full_document_redirects_to_paid_mode_false");
  if (o["runtimePlanConfirmsDocumentBypassGuardIsMandatory"] !== true)
    reasons.push("runtime_plan_confirms_document_bypass_guard_is_mandatory_false");
  if (o["runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks"] !== true)
    reasons.push("runtime_plan_confirms_payment_does_not_override_safety_blocks_false");
  if (o["runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract"] !== true)
    reasons.push("runtime_plan_confirms_high_risk_output_still_requires_safety_contract_false");

  // 8.5A runtime authorization flags (must be false)
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

  // 8.5A runtime/public invariants
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

  // Derived 8.5B assertion
  if (o["runtimeAuthorizationContractOnly"] !== true)
    reasons.push("runtime_authorization_contract_only_false");

  // Authorization contract gates
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

  // Commercial authorization gates
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

  if (o["readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization"] !== true)
    reasons.push("not_ready_for_8_5c_runtime_dry_run_authorization");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeAuthorizationContract(): ControlledRealDocumentRuntimeAuthorizationContractResult {
  // ── Step 1: Obtain 8.5A runtime implementation plan result ────────────────
  const planResult = runControlledRealDocumentRuntimeImplementationPlan();

  const prereqAllPassed = planResult.allPassed;
  const prereqReady =
    planResult.readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract;

  // ── Step 2: Build canonical runtime authorization contract input ──────────
  const canonicalInput: ControlledRealDocumentRuntimeAuthorizationContractInput = {
    prereqCheckId: planResult.checkId,
    prereqAllPassed,
    planningClosureReadyForRuntimeImplementationPlan:
      planResult.planningClosureReadyForRuntimeImplementationPlan,
    controlledRealDocumentRuntimeImplementationPlanAccepted:
      planResult.controlledRealDocumentRuntimeImplementationPlanAccepted,
    runtimeImplementationPlanOnly: planResult.runtimeImplementationPlanOnly,
    readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: prereqReady,

    runtimeAuthorizationGranted: planResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: planResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: planResult.productionAuthorizationGranted,
    finalAuthorizationGranted: planResult.finalAuthorizationGranted,

    actualRealDocumentInputPerformed: planResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      planResult.actualRealDocumentProcessingPerformed,
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

    runtimePlanRequiresSeparateExplicitAuthorization:
      planResult.runtimePlanRequiresSeparateExplicitAuthorization,
    runtimePlanRequiresFreshRiskReview: planResult.runtimePlanRequiresFreshRiskReview,
    runtimePlanRequiresRuntimeKillSwitch: planResult.runtimePlanRequiresRuntimeKillSwitch,
    runtimePlanRequiresFeatureFlagDefaultOff:
      planResult.runtimePlanRequiresFeatureFlagDefaultOff,
    runtimePlanRequiresServerSideOnlyProcessingBoundary:
      planResult.runtimePlanRequiresServerSideOnlyProcessingBoundary,
    runtimePlanRequiresNoClientSideSecretExposure:
      planResult.runtimePlanRequiresNoClientSideSecretExposure,
    runtimePlanRequiresNoPromptLeakage: planResult.runtimePlanRequiresNoPromptLeakage,
    runtimePlanRequiresNoModelOutputPersistenceByDefault:
      planResult.runtimePlanRequiresNoModelOutputPersistenceByDefault,
    runtimePlanRequiresNoRawDocumentPersistenceByDefault:
      planResult.runtimePlanRequiresNoRawDocumentPersistenceByDefault,
    runtimePlanRequiresEphemeralProcessingByDefault:
      planResult.runtimePlanRequiresEphemeralProcessingByDefault,
    runtimePlanRequiresRedactionBeforeModelUse:
      planResult.runtimePlanRequiresRedactionBeforeModelUse,
    runtimePlanRequiresOcrOutputTreatedAsUntrusted:
      planResult.runtimePlanRequiresOcrOutputTreatedAsUntrusted,
    runtimePlanRequiresEvidenceGatesBeforeInterpretation:
      planResult.runtimePlanRequiresEvidenceGatesBeforeInterpretation,
    runtimePlanRequiresUserVisibleOutputContractBeforeDisplay:
      planResult.runtimePlanRequiresUserVisibleOutputContractBeforeDisplay,
    runtimePlanRequiresDocumentBypassGuardBeforeFreeQa:
      planResult.runtimePlanRequiresDocumentBypassGuardBeforeFreeQa,
    runtimePlanRequiresPaidDocumentModeBeforeFullExplanation:
      planResult.runtimePlanRequiresPaidDocumentModeBeforeFullExplanation,
    runtimePlanRequiresPaymentBoundaryBeforeFullExplanation:
      planResult.runtimePlanRequiresPaymentBoundaryBeforeFullExplanation,
    runtimePlanRequiresFailureNoChargePolicy:
      planResult.runtimePlanRequiresFailureNoChargePolicy,
    runtimePlanRequiresStoragePolicyBeforeAnyPersistence:
      planResult.runtimePlanRequiresStoragePolicyBeforeAnyPersistence,
    runtimePlanRequiresHumanReviewPolicyForHighRisk:
      planResult.runtimePlanRequiresHumanReviewPolicyForHighRisk,
    runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate:
      planResult.runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate,
    runtimePlanRequiresNoLegalAdviceOrCertainty:
      planResult.runtimePlanRequiresNoLegalAdviceOrCertainty,
    runtimePlanRequiresAuditTraceBeforeRuntime:
      planResult.runtimePlanRequiresAuditTraceBeforeRuntime,
    runtimePlanRequiresTamperTestsBeforeRuntime:
      planResult.runtimePlanRequiresTamperTestsBeforeRuntime,
    runtimePlanRequiresRateLimitBeforePublicExposure:
      planResult.runtimePlanRequiresRateLimitBeforePublicExposure,
    runtimePlanRequiresAbuseDetectionBeforePublicExposure:
      planResult.runtimePlanRequiresAbuseDetectionBeforePublicExposure,
    runtimePlanRequiresPrivacyNoticeBeforeUpload:
      planResult.runtimePlanRequiresPrivacyNoticeBeforeUpload,
    runtimePlanRequiresUserLanguageSelectionBeforeOutput:
      planResult.runtimePlanRequiresUserLanguageSelectionBeforeOutput,
    runtimePlanRequiresRollbackPlanBeforePilot:
      planResult.runtimePlanRequiresRollbackPlanBeforePilot,
    runtimePlanRequiresMonitoringPlanBeforePilot:
      planResult.runtimePlanRequiresMonitoringPlanBeforePilot,

    runtimePlanConfirmsFreeQuestionModeRemainsFree:
      planResult.runtimePlanConfirmsFreeQuestionModeRemainsFree,
    runtimePlanConfirmsDocumentExplanationRequiresPaidMode:
      planResult.runtimePlanConfirmsDocumentExplanationRequiresPaidMode,
    runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode:
      planResult.runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode,
    runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode:
      planResult.runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode,
    runtimePlanConfirmsDocumentBypassGuardIsMandatory:
      planResult.runtimePlanConfirmsDocumentBypassGuardIsMandatory,
    runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks:
      planResult.runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks,
    runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract:
      planResult.runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract,

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

    runtimeAuthorizationContractOnly: true,

    authorizationContractRequiresSeparateExplicitApproval: prereqAllPassed && prereqReady,
    authorizationContractRequiresFreshRiskReview: prereqAllPassed && prereqReady,
    authorizationContractRequiresRuntimeKillSwitchEnabled: prereqAllPassed && prereqReady,
    authorizationContractRequiresFeatureFlagDefaultOff: prereqAllPassed && prereqReady,
    authorizationContractRequiresServerSideOnlyProcessing: prereqAllPassed && prereqReady,
    authorizationContractRequiresNoClientSideSecrets: prereqAllPassed && prereqReady,
    authorizationContractRequiresNoPublicRuntimeByDefault: prereqAllPassed && prereqReady,
    authorizationContractRequiresNoPersistenceByDefault: prereqAllPassed && prereqReady,
    authorizationContractRequiresNoRawDocumentStorageByDefault:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresNoModelOutputStorageByDefault:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresNoPromptStorage: prereqAllPassed && prereqReady,
    authorizationContractRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
    authorizationContractRequiresOcrOutputUntrusted: prereqAllPassed && prereqReady,
    authorizationContractRequiresEvidenceGatePassBeforeInterpretation:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresUserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresPrivacyNoticeBeforeUpload: prereqAllPassed && prereqReady,
    authorizationContractRequiresUserLanguageSelectionBeforeOutput:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresRateLimitBeforePublicExposure:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresAbuseDetectionBeforePublicExposure:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresMonitoringBeforePilot: prereqAllPassed && prereqReady,
    authorizationContractRequiresRollbackBeforePilot: prereqAllPassed && prereqReady,
    authorizationContractRequiresAuditTraceBeforeRuntime: prereqAllPassed && prereqReady,
    authorizationContractRequiresTamperTestsBeforeRuntime: prereqAllPassed && prereqReady,
    authorizationContractRequiresHumanReviewForHighRisk: prereqAllPassed && prereqReady,
    authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresNoLegalAdviceOrCertainty: prereqAllPassed && prereqReady,

    authorizationContractRequiresFreeQuestionModeRemainsFree:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresPaidDocumentModeForFullExplanation:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresPaidDocumentModeForPhotoExplanation:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresDocumentBypassGuardForFreeQa:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresRedirectOfFullDocumentFromFreeQa:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresPaymentBoundaryBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresFailureNoChargePolicy: prereqAllPassed && prereqReady,
    authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks:
      prereqAllPassed && prereqReady,
    authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid:
      prereqAllPassed && prereqReady,

    readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical runtime authorization contract input ────────
  const contractValidation = validateAuthorizationContractInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const contractAccepted = contractValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.5A checkId wrong", override: { prereqCheckId: "8.4I" } },
    { label: "8.5A allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRuntimeImplementationPlanAccepted false", override: { controlledRealDocumentRuntimeImplementationPlanAccepted: false } },
    { label: "runtimeImplementationPlanOnly false", override: { runtimeImplementationPlanOnly: false } },
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
    { label: "runtimePlanRequiresSeparateExplicitAuthorization false", override: { runtimePlanRequiresSeparateExplicitAuthorization: false } },
    { label: "runtimePlanRequiresFreshRiskReview false", override: { runtimePlanRequiresFreshRiskReview: false } },
    { label: "runtimePlanRequiresRuntimeKillSwitch false", override: { runtimePlanRequiresRuntimeKillSwitch: false } },
    { label: "runtimePlanRequiresFeatureFlagDefaultOff false", override: { runtimePlanRequiresFeatureFlagDefaultOff: false } },
    { label: "runtimePlanRequiresServerSideOnlyProcessingBoundary false", override: { runtimePlanRequiresServerSideOnlyProcessingBoundary: false } },
    { label: "runtimePlanRequiresNoClientSideSecretExposure false", override: { runtimePlanRequiresNoClientSideSecretExposure: false } },
    { label: "runtimePlanRequiresNoPromptLeakage false", override: { runtimePlanRequiresNoPromptLeakage: false } },
    { label: "runtimePlanRequiresNoModelOutputPersistenceByDefault false", override: { runtimePlanRequiresNoModelOutputPersistenceByDefault: false } },
    { label: "runtimePlanRequiresNoRawDocumentPersistenceByDefault false", override: { runtimePlanRequiresNoRawDocumentPersistenceByDefault: false } },
    { label: "runtimePlanRequiresEphemeralProcessingByDefault false", override: { runtimePlanRequiresEphemeralProcessingByDefault: false } },
    { label: "runtimePlanRequiresRedactionBeforeModelUse false", override: { runtimePlanRequiresRedactionBeforeModelUse: false } },
    { label: "runtimePlanRequiresOcrOutputTreatedAsUntrusted false", override: { runtimePlanRequiresOcrOutputTreatedAsUntrusted: false } },
    { label: "runtimePlanRequiresEvidenceGatesBeforeInterpretation false", override: { runtimePlanRequiresEvidenceGatesBeforeInterpretation: false } },
    { label: "runtimePlanRequiresUserVisibleOutputContractBeforeDisplay false", override: { runtimePlanRequiresUserVisibleOutputContractBeforeDisplay: false } },
    { label: "runtimePlanRequiresDocumentBypassGuardBeforeFreeQa false", override: { runtimePlanRequiresDocumentBypassGuardBeforeFreeQa: false } },
    { label: "runtimePlanRequiresPaidDocumentModeBeforeFullExplanation false", override: { runtimePlanRequiresPaidDocumentModeBeforeFullExplanation: false } },
    { label: "runtimePlanRequiresPaymentBoundaryBeforeFullExplanation false", override: { runtimePlanRequiresPaymentBoundaryBeforeFullExplanation: false } },
    { label: "runtimePlanRequiresFailureNoChargePolicy false", override: { runtimePlanRequiresFailureNoChargePolicy: false } },
    { label: "runtimePlanRequiresStoragePolicyBeforeAnyPersistence false", override: { runtimePlanRequiresStoragePolicyBeforeAnyPersistence: false } },
    { label: "runtimePlanRequiresHumanReviewPolicyForHighRisk false", override: { runtimePlanRequiresHumanReviewPolicyForHighRisk: false } },
    { label: "runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate false", override: { runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate: false } },
    { label: "runtimePlanRequiresNoLegalAdviceOrCertainty false", override: { runtimePlanRequiresNoLegalAdviceOrCertainty: false } },
    { label: "runtimePlanRequiresAuditTraceBeforeRuntime false", override: { runtimePlanRequiresAuditTraceBeforeRuntime: false } },
    { label: "runtimePlanRequiresTamperTestsBeforeRuntime false", override: { runtimePlanRequiresTamperTestsBeforeRuntime: false } },
    { label: "runtimePlanRequiresRateLimitBeforePublicExposure false", override: { runtimePlanRequiresRateLimitBeforePublicExposure: false } },
    { label: "runtimePlanRequiresAbuseDetectionBeforePublicExposure false", override: { runtimePlanRequiresAbuseDetectionBeforePublicExposure: false } },
    { label: "runtimePlanRequiresPrivacyNoticeBeforeUpload false", override: { runtimePlanRequiresPrivacyNoticeBeforeUpload: false } },
    { label: "runtimePlanRequiresUserLanguageSelectionBeforeOutput false", override: { runtimePlanRequiresUserLanguageSelectionBeforeOutput: false } },
    { label: "runtimePlanRequiresRollbackPlanBeforePilot false", override: { runtimePlanRequiresRollbackPlanBeforePilot: false } },
    { label: "runtimePlanRequiresMonitoringPlanBeforePilot false", override: { runtimePlanRequiresMonitoringPlanBeforePilot: false } },
    { label: "runtimePlanConfirmsFreeQuestionModeRemainsFree false", override: { runtimePlanConfirmsFreeQuestionModeRemainsFree: false } },
    { label: "runtimePlanConfirmsDocumentExplanationRequiresPaidMode false", override: { runtimePlanConfirmsDocumentExplanationRequiresPaidMode: false } },
    { label: "runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode false", override: { runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode: false } },
    { label: "runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode false", override: { runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode: false } },
    { label: "runtimePlanConfirmsDocumentBypassGuardIsMandatory false", override: { runtimePlanConfirmsDocumentBypassGuardIsMandatory: false } },
    { label: "runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks false", override: { runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks: false } },
    { label: "runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract false", override: { runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract: false } },
    { label: "readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract false", override: { readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: false } },
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
    { label: "runtimeAuthorizationContractOnly false", override: { runtimeAuthorizationContractOnly: false } },
    { label: "runtimeAuthorizationGranted true (8.5B check)", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true (8.5B check)", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true (8.5B check)", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5B check)", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateAuthorizationContractInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    contractAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5B: controlled real-document runtime authorization contract layer — depends on completed 8.5A controlled real-document runtime implementation plan",
    "8.5B is contract/planning only — not runtime authorization",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5B",
    "8.3AC was not re-run",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "high-risk safety contract still applies even when paid",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.5C controlled real-document runtime dry-run authorization",
    "8.5C is still dry-run/planning only unless explicitly authorized later",
    `8.5A prerequisite: allPassed=${planResult.allPassed}, readyFor8x5B=${planResult.readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract}`,
    `runtime authorization contract input validation: ${contractAccepted ? "accepted" : "REJECTED"} — reasons: ${contractValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5B allPassed: true — controlled real-document runtime authorization contract accepted"
    );
    notes.push(
      "readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.5B",
    allPassed,
    runtimeImplementationPlanReadyForAuthorizationContract:
      canonicalInput.controlledRealDocumentRuntimeImplementationPlanAccepted,
    controlledRealDocumentRuntimeAuthorizationContractAccepted: allPassed,
    runtimeAuthorizationContractOnly: true,
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

    authorizationContractRequiresSeparateExplicitApproval:
      canonicalInput.authorizationContractRequiresSeparateExplicitApproval,
    authorizationContractRequiresFreshRiskReview:
      canonicalInput.authorizationContractRequiresFreshRiskReview,
    authorizationContractRequiresRuntimeKillSwitchEnabled:
      canonicalInput.authorizationContractRequiresRuntimeKillSwitchEnabled,
    authorizationContractRequiresFeatureFlagDefaultOff:
      canonicalInput.authorizationContractRequiresFeatureFlagDefaultOff,
    authorizationContractRequiresServerSideOnlyProcessing:
      canonicalInput.authorizationContractRequiresServerSideOnlyProcessing,
    authorizationContractRequiresNoClientSideSecrets:
      canonicalInput.authorizationContractRequiresNoClientSideSecrets,
    authorizationContractRequiresNoPublicRuntimeByDefault:
      canonicalInput.authorizationContractRequiresNoPublicRuntimeByDefault,
    authorizationContractRequiresNoPersistenceByDefault:
      canonicalInput.authorizationContractRequiresNoPersistenceByDefault,
    authorizationContractRequiresNoRawDocumentStorageByDefault:
      canonicalInput.authorizationContractRequiresNoRawDocumentStorageByDefault,
    authorizationContractRequiresNoModelOutputStorageByDefault:
      canonicalInput.authorizationContractRequiresNoModelOutputStorageByDefault,
    authorizationContractRequiresNoPromptStorage:
      canonicalInput.authorizationContractRequiresNoPromptStorage,
    authorizationContractRequiresRedactionBeforeModelUse:
      canonicalInput.authorizationContractRequiresRedactionBeforeModelUse,
    authorizationContractRequiresOcrOutputUntrusted:
      canonicalInput.authorizationContractRequiresOcrOutputUntrusted,
    authorizationContractRequiresEvidenceGatePassBeforeInterpretation:
      canonicalInput.authorizationContractRequiresEvidenceGatePassBeforeInterpretation,
    authorizationContractRequiresUserVisibleOutputContractBeforeDisplay:
      canonicalInput.authorizationContractRequiresUserVisibleOutputContractBeforeDisplay,
    authorizationContractRequiresPrivacyNoticeBeforeUpload:
      canonicalInput.authorizationContractRequiresPrivacyNoticeBeforeUpload,
    authorizationContractRequiresUserLanguageSelectionBeforeOutput:
      canonicalInput.authorizationContractRequiresUserLanguageSelectionBeforeOutput,
    authorizationContractRequiresRateLimitBeforePublicExposure:
      canonicalInput.authorizationContractRequiresRateLimitBeforePublicExposure,
    authorizationContractRequiresAbuseDetectionBeforePublicExposure:
      canonicalInput.authorizationContractRequiresAbuseDetectionBeforePublicExposure,
    authorizationContractRequiresMonitoringBeforePilot:
      canonicalInput.authorizationContractRequiresMonitoringBeforePilot,
    authorizationContractRequiresRollbackBeforePilot:
      canonicalInput.authorizationContractRequiresRollbackBeforePilot,
    authorizationContractRequiresAuditTraceBeforeRuntime:
      canonicalInput.authorizationContractRequiresAuditTraceBeforeRuntime,
    authorizationContractRequiresTamperTestsBeforeRuntime:
      canonicalInput.authorizationContractRequiresTamperTestsBeforeRuntime,
    authorizationContractRequiresHumanReviewForHighRisk:
      canonicalInput.authorizationContractRequiresHumanReviewForHighRisk,
    authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate:
      canonicalInput.authorizationContractRequiresNoExactDeadlineWithoutDeliveryDate,
    authorizationContractRequiresNoLegalAdviceOrCertainty:
      canonicalInput.authorizationContractRequiresNoLegalAdviceOrCertainty,

    authorizationContractRequiresFreeQuestionModeRemainsFree:
      canonicalInput.authorizationContractRequiresFreeQuestionModeRemainsFree,
    authorizationContractRequiresPaidDocumentModeForFullExplanation:
      canonicalInput.authorizationContractRequiresPaidDocumentModeForFullExplanation,
    authorizationContractRequiresPaidDocumentModeForPhotoExplanation:
      canonicalInput.authorizationContractRequiresPaidDocumentModeForPhotoExplanation,
    authorizationContractRequiresDocumentBypassGuardForFreeQa:
      canonicalInput.authorizationContractRequiresDocumentBypassGuardForFreeQa,
    authorizationContractRequiresRedirectOfFullDocumentFromFreeQa:
      canonicalInput.authorizationContractRequiresRedirectOfFullDocumentFromFreeQa,
    authorizationContractRequiresPaymentBoundaryBeforeFullExplanation:
      canonicalInput.authorizationContractRequiresPaymentBoundaryBeforeFullExplanation,
    authorizationContractRequiresFailureNoChargePolicy:
      canonicalInput.authorizationContractRequiresFailureNoChargePolicy,
    authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.authorizationContractRequiresPaymentDoesNotOverrideSafetyBlocks,
    authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid:
      canonicalInput.authorizationContractRequiresHighRiskSafetyContractEvenWhenPaid,

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

    readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization:
      canonicalInput.readyFor8x5CControlledRealDocumentRuntimeDryRunAuthorization,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
