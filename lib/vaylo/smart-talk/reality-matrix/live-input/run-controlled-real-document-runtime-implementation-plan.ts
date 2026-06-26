/**
 * Phase 8.5A — Controlled Real Document Runtime Implementation Plan.
 *
 * IMPLEMENTATION PLANNING ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.4I.
 *
 * This file defines the minimum runtime implementation gates required before
 * any future real-document runtime can be separately authorized. It is:
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

import { runControlledRealDocumentPlanningClosureDecision } from "./run-controlled-real-document-planning-closure-decision";

// ── Local runtime implementation plan input type ──────────────────────────────

interface ControlledRealDocumentRuntimeImplementationPlanInput {
  // 8.4I prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly finalReadinessAuditReadyForPlanningClosureDecision: boolean;
  readonly controlledRealDocumentPlanningClosureDecisionAccepted: boolean;
  readonly planningClosureDecisionOnly: boolean;
  readonly controlledRealDocumentPlanningChainClosed: boolean;
  readonly controlledRealDocumentPlanningChainPassed: boolean;
  readonly readyForControlledRealDocumentRuntimeImplementationPlan: boolean;

  // 8.4I authorization flags (must be false)
  readonly controlledRealDocumentRuntimeAuthorizationGranted: boolean;
  readonly controlledRealDocumentPilotAuthorizationGranted: boolean;
  readonly controlledRealDocumentProductionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;

  // 8.4I actual* performed flags (must be false)
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

  // 8.4I closure confirmation gates (must be true)
  readonly closureConfirmsAuthorizationPlanCompleted: boolean;
  readonly closureConfirmsContractCompleted: boolean;
  readonly closureConfirmsRedactionPlanCompleted: boolean;
  readonly closureConfirmsStructuredExtractionPlanCompleted: boolean;
  readonly closureConfirmsEvidenceGateMappingPlanCompleted: boolean;
  readonly closureConfirmsOcrAndStorageIsolationPlanCompleted: boolean;
  readonly closureConfirmsUserVisibleOutputContractCompleted: boolean;
  readonly closureConfirmsFinalReadinessAuditCompleted: boolean;
  readonly closureConfirmsCommercialBoundaryRetained: boolean;
  readonly closureConfirmsFreeQaBypassGuardRequired: boolean;
  readonly closureConfirmsPaidDocumentModeRequiredForFullExplanation: boolean;
  readonly closureConfirmsNoPublicRuntimeAuthorized: boolean;
  readonly closureConfirmsNoPersistenceAuthorized: boolean;
  readonly closureConfirmsNoRealDocumentInputAuthorized: boolean;
  readonly closureConfirmsNoUserVisibleOutputAuthorized: boolean;
  readonly closureConfirmsNoLegalDeadlineOutputAuthorized: boolean;
  readonly closureConfirmsNoLiveLlmRuntimeAuthorized: boolean;
  readonly closureConfirmsNo8x3AcRerun: boolean;
  readonly closureConfirmsNoOpenAiFetchEnvSdk: boolean;
  readonly closureConfirmsTamperCoverage: boolean;

  // 8.4I future implementation guards (must be true)
  readonly futureImplementationRequiresSeparateExplicitAuthorization: boolean;
  readonly futureImplementationRequiresFreshRiskReview: boolean;
  readonly futureImplementationRequiresRuntimeKillSwitch: boolean;
  readonly futureImplementationRequiresDocumentBypassGuardBeforePaidMode: boolean;
  readonly futureImplementationRequiresPaymentBoundaryBeforeFullExplanation: boolean;
  readonly futureImplementationRequiresOcrIsolationBeforeRuntime: boolean;
  readonly futureImplementationRequiresStoragePolicyBeforePersistence: boolean;
  readonly futureImplementationRequiresRedactionBeforeModelUse: boolean;
  readonly futureImplementationRequiresEvidenceGatesBeforeInterpretation: boolean;
  readonly futureImplementationRequiresUserVisibleOutputContractBeforeDisplay: boolean;
  readonly futureImplementationRequiresHumanReviewPolicyForHighRisk: boolean;
  readonly futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate: boolean;
  readonly futureImplementationRequiresNoLegalAdviceOrCertainty: boolean;
  readonly futureImplementationRequiresAuditTraceBeforeRuntime: boolean;
  readonly futureImplementationRequiresTamperTestsBeforeRuntime: boolean;

  // 8.4I runtime authorization flags (must be false)
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

  // 8.4I runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.5A assertions
  readonly runtimeImplementationPlanOnly: boolean;
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;

  // Runtime implementation plan gates
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

  // Commercial/runtime boundary confirmations
  readonly runtimePlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly runtimePlanConfirmsDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode: boolean;
  readonly runtimePlanConfirmsDocumentBypassGuardIsMandatory: boolean;
  readonly runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract: boolean;

  readonly readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRuntimeImplementationPlanResult {
  readonly checkId: "8.5A";
  readonly allPassed: boolean;
  readonly planningClosureReadyForRuntimeImplementationPlan: boolean;
  readonly controlledRealDocumentRuntimeImplementationPlanAccepted: boolean;
  readonly runtimeImplementationPlanOnly: true;
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

  readonly runtimePlanConfirmsFreeQuestionModeRemainsFree: boolean;
  readonly runtimePlanConfirmsDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode: boolean;
  readonly runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode: boolean;
  readonly runtimePlanConfirmsDocumentBypassGuardIsMandatory: boolean;
  readonly runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks: boolean;
  readonly runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract: boolean;

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

  readonly readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Runtime implementation plan input validator ───────────────────────────────

function validateRuntimeImplementationPlanInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4I prerequisite gates
  if (o["prereqCheckId"] !== "8.4I")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentPlanningClosureDecisionAccepted"] !== true)
    reasons.push("planning_closure_decision_not_accepted");
  if (o["planningClosureDecisionOnly"] !== true)
    reasons.push("planning_closure_decision_only_false");
  if (o["controlledRealDocumentPlanningChainClosed"] !== true)
    reasons.push("planning_chain_closed_false");
  if (o["controlledRealDocumentPlanningChainPassed"] !== true)
    reasons.push("planning_chain_passed_false");
  if (o["readyForControlledRealDocumentRuntimeImplementationPlan"] !== true)
    reasons.push("not_ready_for_runtime_implementation_plan");

  // 8.4I authorization flags (must be false)
  if (o["controlledRealDocumentRuntimeAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_runtime_authorization_granted");
  if (o["controlledRealDocumentPilotAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_pilot_authorization_granted");
  if (o["controlledRealDocumentProductionAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // 8.4I actual* performed flags (must be false)
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

  // 8.4I closure confirmation gates (must be true)
  if (o["closureConfirmsAuthorizationPlanCompleted"] !== true)
    reasons.push("closure_confirms_authorization_plan_completed_false");
  if (o["closureConfirmsContractCompleted"] !== true)
    reasons.push("closure_confirms_contract_completed_false");
  if (o["closureConfirmsRedactionPlanCompleted"] !== true)
    reasons.push("closure_confirms_redaction_plan_completed_false");
  if (o["closureConfirmsStructuredExtractionPlanCompleted"] !== true)
    reasons.push("closure_confirms_structured_extraction_plan_completed_false");
  if (o["closureConfirmsEvidenceGateMappingPlanCompleted"] !== true)
    reasons.push("closure_confirms_evidence_gate_mapping_plan_completed_false");
  if (o["closureConfirmsOcrAndStorageIsolationPlanCompleted"] !== true)
    reasons.push("closure_confirms_ocr_and_storage_isolation_plan_completed_false");
  if (o["closureConfirmsUserVisibleOutputContractCompleted"] !== true)
    reasons.push("closure_confirms_user_visible_output_contract_completed_false");
  if (o["closureConfirmsFinalReadinessAuditCompleted"] !== true)
    reasons.push("closure_confirms_final_readiness_audit_completed_false");
  if (o["closureConfirmsCommercialBoundaryRetained"] !== true)
    reasons.push("closure_confirms_commercial_boundary_retained_false");
  if (o["closureConfirmsFreeQaBypassGuardRequired"] !== true)
    reasons.push("closure_confirms_free_qa_bypass_guard_required_false");
  if (o["closureConfirmsPaidDocumentModeRequiredForFullExplanation"] !== true)
    reasons.push("closure_confirms_paid_document_mode_required_false");
  if (o["closureConfirmsNoPublicRuntimeAuthorized"] !== true)
    reasons.push("closure_confirms_no_public_runtime_authorized_false");
  if (o["closureConfirmsNoPersistenceAuthorized"] !== true)
    reasons.push("closure_confirms_no_persistence_authorized_false");
  if (o["closureConfirmsNoRealDocumentInputAuthorized"] !== true)
    reasons.push("closure_confirms_no_real_document_input_authorized_false");
  if (o["closureConfirmsNoUserVisibleOutputAuthorized"] !== true)
    reasons.push("closure_confirms_no_user_visible_output_authorized_false");
  if (o["closureConfirmsNoLegalDeadlineOutputAuthorized"] !== true)
    reasons.push("closure_confirms_no_legal_deadline_output_authorized_false");
  if (o["closureConfirmsNoLiveLlmRuntimeAuthorized"] !== true)
    reasons.push("closure_confirms_no_live_llm_runtime_authorized_false");
  if (o["closureConfirmsNo8x3AcRerun"] !== true)
    reasons.push("closure_confirms_no_8_3ac_rerun_false");
  if (o["closureConfirmsNoOpenAiFetchEnvSdk"] !== true)
    reasons.push("closure_confirms_no_openai_fetch_env_sdk_false");
  if (o["closureConfirmsTamperCoverage"] !== true)
    reasons.push("closure_confirms_tamper_coverage_false");

  // 8.4I future implementation guards (must be true)
  if (o["futureImplementationRequiresSeparateExplicitAuthorization"] !== true)
    reasons.push("future_impl_requires_separate_explicit_authorization_false");
  if (o["futureImplementationRequiresFreshRiskReview"] !== true)
    reasons.push("future_impl_requires_fresh_risk_review_false");
  if (o["futureImplementationRequiresRuntimeKillSwitch"] !== true)
    reasons.push("future_impl_requires_runtime_kill_switch_false");
  if (o["futureImplementationRequiresDocumentBypassGuardBeforePaidMode"] !== true)
    reasons.push("future_impl_requires_document_bypass_guard_before_paid_mode_false");
  if (o["futureImplementationRequiresPaymentBoundaryBeforeFullExplanation"] !== true)
    reasons.push("future_impl_requires_payment_boundary_before_full_explanation_false");
  if (o["futureImplementationRequiresOcrIsolationBeforeRuntime"] !== true)
    reasons.push("future_impl_requires_ocr_isolation_before_runtime_false");
  if (o["futureImplementationRequiresStoragePolicyBeforePersistence"] !== true)
    reasons.push("future_impl_requires_storage_policy_before_persistence_false");
  if (o["futureImplementationRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("future_impl_requires_redaction_before_model_use_false");
  if (o["futureImplementationRequiresEvidenceGatesBeforeInterpretation"] !== true)
    reasons.push("future_impl_requires_evidence_gates_before_interpretation_false");
  if (o["futureImplementationRequiresUserVisibleOutputContractBeforeDisplay"] !== true)
    reasons.push("future_impl_requires_user_visible_output_contract_before_display_false");
  if (o["futureImplementationRequiresHumanReviewPolicyForHighRisk"] !== true)
    reasons.push("future_impl_requires_human_review_policy_for_high_risk_false");
  if (o["futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate"] !== true)
    reasons.push("future_impl_requires_no_exact_deadline_without_delivery_date_false");
  if (o["futureImplementationRequiresNoLegalAdviceOrCertainty"] !== true)
    reasons.push("future_impl_requires_no_legal_advice_or_certainty_false");
  if (o["futureImplementationRequiresAuditTraceBeforeRuntime"] !== true)
    reasons.push("future_impl_requires_audit_trace_before_runtime_false");
  if (o["futureImplementationRequiresTamperTestsBeforeRuntime"] !== true)
    reasons.push("future_impl_requires_tamper_tests_before_runtime_false");

  // 8.4I runtime authorization flags (must be false)
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

  // 8.4I runtime/public invariants
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

  // Derived 8.5A assertions
  if (o["runtimeImplementationPlanOnly"] !== true)
    reasons.push("runtime_implementation_plan_only_false");
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");

  // Runtime implementation plan gates
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

  // Commercial/runtime boundary confirmations
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

  if (o["readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract"] !== true)
    reasons.push("not_ready_for_8_5b_runtime_authorization_contract");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRuntimeImplementationPlan(): ControlledRealDocumentRuntimeImplementationPlanResult {
  // ── Step 1: Obtain 8.4I planning closure decision result ──────────────────
  const closureResult = runControlledRealDocumentPlanningClosureDecision();

  const prereqAllPassed = closureResult.allPassed;
  const prereqReady =
    closureResult.readyForControlledRealDocumentRuntimeImplementationPlan;

  // ── Step 2: Build canonical runtime implementation plan input ─────────────
  const canonicalInput: ControlledRealDocumentRuntimeImplementationPlanInput = {
    prereqCheckId: closureResult.checkId,
    prereqAllPassed,
    finalReadinessAuditReadyForPlanningClosureDecision:
      closureResult.finalReadinessAuditReadyForPlanningClosureDecision,
    controlledRealDocumentPlanningClosureDecisionAccepted:
      closureResult.controlledRealDocumentPlanningClosureDecisionAccepted,
    planningClosureDecisionOnly: closureResult.planningClosureDecisionOnly,
    controlledRealDocumentPlanningChainClosed:
      closureResult.controlledRealDocumentPlanningChainClosed,
    controlledRealDocumentPlanningChainPassed:
      closureResult.controlledRealDocumentPlanningChainPassed,
    readyForControlledRealDocumentRuntimeImplementationPlan: prereqReady,

    controlledRealDocumentRuntimeAuthorizationGranted:
      closureResult.controlledRealDocumentRuntimeAuthorizationGranted,
    controlledRealDocumentPilotAuthorizationGranted:
      closureResult.controlledRealDocumentPilotAuthorizationGranted,
    controlledRealDocumentProductionAuthorizationGranted:
      closureResult.controlledRealDocumentProductionAuthorizationGranted,
    finalAuthorizationGranted: closureResult.finalAuthorizationGranted,

    actualRealDocumentInputPerformed: closureResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      closureResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: closureResult.actualOcrPerformed,
    actualPhotoInputProcessed: closureResult.actualPhotoInputProcessed,
    actualFileInputProcessed: closureResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: closureResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed:
      closureResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: closureResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: closureResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: closureResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: closureResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: closureResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: closureResult.actualDeadlineCalculationPerformed,

    closureConfirmsAuthorizationPlanCompleted:
      closureResult.closureConfirmsAuthorizationPlanCompleted,
    closureConfirmsContractCompleted: closureResult.closureConfirmsContractCompleted,
    closureConfirmsRedactionPlanCompleted:
      closureResult.closureConfirmsRedactionPlanCompleted,
    closureConfirmsStructuredExtractionPlanCompleted:
      closureResult.closureConfirmsStructuredExtractionPlanCompleted,
    closureConfirmsEvidenceGateMappingPlanCompleted:
      closureResult.closureConfirmsEvidenceGateMappingPlanCompleted,
    closureConfirmsOcrAndStorageIsolationPlanCompleted:
      closureResult.closureConfirmsOcrAndStorageIsolationPlanCompleted,
    closureConfirmsUserVisibleOutputContractCompleted:
      closureResult.closureConfirmsUserVisibleOutputContractCompleted,
    closureConfirmsFinalReadinessAuditCompleted:
      closureResult.closureConfirmsFinalReadinessAuditCompleted,
    closureConfirmsCommercialBoundaryRetained:
      closureResult.closureConfirmsCommercialBoundaryRetained,
    closureConfirmsFreeQaBypassGuardRequired:
      closureResult.closureConfirmsFreeQaBypassGuardRequired,
    closureConfirmsPaidDocumentModeRequiredForFullExplanation:
      closureResult.closureConfirmsPaidDocumentModeRequiredForFullExplanation,
    closureConfirmsNoPublicRuntimeAuthorized:
      closureResult.closureConfirmsNoPublicRuntimeAuthorized,
    closureConfirmsNoPersistenceAuthorized:
      closureResult.closureConfirmsNoPersistenceAuthorized,
    closureConfirmsNoRealDocumentInputAuthorized:
      closureResult.closureConfirmsNoRealDocumentInputAuthorized,
    closureConfirmsNoUserVisibleOutputAuthorized:
      closureResult.closureConfirmsNoUserVisibleOutputAuthorized,
    closureConfirmsNoLegalDeadlineOutputAuthorized:
      closureResult.closureConfirmsNoLegalDeadlineOutputAuthorized,
    closureConfirmsNoLiveLlmRuntimeAuthorized:
      closureResult.closureConfirmsNoLiveLlmRuntimeAuthorized,
    closureConfirmsNo8x3AcRerun: closureResult.closureConfirmsNo8x3AcRerun,
    closureConfirmsNoOpenAiFetchEnvSdk: closureResult.closureConfirmsNoOpenAiFetchEnvSdk,
    closureConfirmsTamperCoverage: closureResult.closureConfirmsTamperCoverage,

    futureImplementationRequiresSeparateExplicitAuthorization:
      closureResult.futureImplementationRequiresSeparateExplicitAuthorization,
    futureImplementationRequiresFreshRiskReview:
      closureResult.futureImplementationRequiresFreshRiskReview,
    futureImplementationRequiresRuntimeKillSwitch:
      closureResult.futureImplementationRequiresRuntimeKillSwitch,
    futureImplementationRequiresDocumentBypassGuardBeforePaidMode:
      closureResult.futureImplementationRequiresDocumentBypassGuardBeforePaidMode,
    futureImplementationRequiresPaymentBoundaryBeforeFullExplanation:
      closureResult.futureImplementationRequiresPaymentBoundaryBeforeFullExplanation,
    futureImplementationRequiresOcrIsolationBeforeRuntime:
      closureResult.futureImplementationRequiresOcrIsolationBeforeRuntime,
    futureImplementationRequiresStoragePolicyBeforePersistence:
      closureResult.futureImplementationRequiresStoragePolicyBeforePersistence,
    futureImplementationRequiresRedactionBeforeModelUse:
      closureResult.futureImplementationRequiresRedactionBeforeModelUse,
    futureImplementationRequiresEvidenceGatesBeforeInterpretation:
      closureResult.futureImplementationRequiresEvidenceGatesBeforeInterpretation,
    futureImplementationRequiresUserVisibleOutputContractBeforeDisplay:
      closureResult.futureImplementationRequiresUserVisibleOutputContractBeforeDisplay,
    futureImplementationRequiresHumanReviewPolicyForHighRisk:
      closureResult.futureImplementationRequiresHumanReviewPolicyForHighRisk,
    futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate:
      closureResult.futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate,
    futureImplementationRequiresNoLegalAdviceOrCertainty:
      closureResult.futureImplementationRequiresNoLegalAdviceOrCertainty,
    futureImplementationRequiresAuditTraceBeforeRuntime:
      closureResult.futureImplementationRequiresAuditTraceBeforeRuntime,
    futureImplementationRequiresTamperTestsBeforeRuntime:
      closureResult.futureImplementationRequiresTamperTestsBeforeRuntime,

    realDocumentInputAuthorizedNow: closureResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      closureResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      closureResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: closureResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: closureResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: closureResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: closureResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: closureResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: closureResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      closureResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: closureResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: closureResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: closureResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: closureResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized:
      closureResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: closureResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: closureResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: closureResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: closureResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      closureResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: closureResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: closureResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: closureResult.publicRuntimeEnabled,
    persistenceUsed: closureResult.persistenceUsed,
    neverUserVisible: closureResult.neverUserVisible,

    runtimeImplementationPlanOnly: true,
    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,

    runtimePlanRequiresSeparateExplicitAuthorization: prereqAllPassed && prereqReady,
    runtimePlanRequiresFreshRiskReview: prereqAllPassed && prereqReady,
    runtimePlanRequiresRuntimeKillSwitch: prereqAllPassed && prereqReady,
    runtimePlanRequiresFeatureFlagDefaultOff: prereqAllPassed && prereqReady,
    runtimePlanRequiresServerSideOnlyProcessingBoundary: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoClientSideSecretExposure: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoPromptLeakage: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoModelOutputPersistenceByDefault: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoRawDocumentPersistenceByDefault: prereqAllPassed && prereqReady,
    runtimePlanRequiresEphemeralProcessingByDefault: prereqAllPassed && prereqReady,
    runtimePlanRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
    runtimePlanRequiresOcrOutputTreatedAsUntrusted: prereqAllPassed && prereqReady,
    runtimePlanRequiresEvidenceGatesBeforeInterpretation: prereqAllPassed && prereqReady,
    runtimePlanRequiresUserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    runtimePlanRequiresDocumentBypassGuardBeforeFreeQa: prereqAllPassed && prereqReady,
    runtimePlanRequiresPaidDocumentModeBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    runtimePlanRequiresPaymentBoundaryBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    runtimePlanRequiresFailureNoChargePolicy: prereqAllPassed && prereqReady,
    runtimePlanRequiresStoragePolicyBeforeAnyPersistence: prereqAllPassed && prereqReady,
    runtimePlanRequiresHumanReviewPolicyForHighRisk: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate: prereqAllPassed && prereqReady,
    runtimePlanRequiresNoLegalAdviceOrCertainty: prereqAllPassed && prereqReady,
    runtimePlanRequiresAuditTraceBeforeRuntime: prereqAllPassed && prereqReady,
    runtimePlanRequiresTamperTestsBeforeRuntime: prereqAllPassed && prereqReady,
    runtimePlanRequiresRateLimitBeforePublicExposure: prereqAllPassed && prereqReady,
    runtimePlanRequiresAbuseDetectionBeforePublicExposure: prereqAllPassed && prereqReady,
    runtimePlanRequiresPrivacyNoticeBeforeUpload: prereqAllPassed && prereqReady,
    runtimePlanRequiresUserLanguageSelectionBeforeOutput: prereqAllPassed && prereqReady,
    runtimePlanRequiresRollbackPlanBeforePilot: prereqAllPassed && prereqReady,
    runtimePlanRequiresMonitoringPlanBeforePilot: prereqAllPassed && prereqReady,

    runtimePlanConfirmsFreeQuestionModeRemainsFree: prereqAllPassed && prereqReady,
    runtimePlanConfirmsDocumentExplanationRequiresPaidMode: prereqAllPassed && prereqReady,
    runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode:
      prereqAllPassed && prereqReady,
    runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode:
      prereqAllPassed && prereqReady,
    runtimePlanConfirmsDocumentBypassGuardIsMandatory: prereqAllPassed && prereqReady,
    runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks: prereqAllPassed && prereqReady,
    runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract:
      prereqAllPassed && prereqReady,

    readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical runtime implementation plan input ───────────
  const planValidation = validateRuntimeImplementationPlanInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const planAccepted = planValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4I checkId wrong", override: { prereqCheckId: "8.4H" } },
    { label: "8.4I allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentPlanningClosureDecisionAccepted false", override: { controlledRealDocumentPlanningClosureDecisionAccepted: false } },
    { label: "planningClosureDecisionOnly false", override: { planningClosureDecisionOnly: false } },
    { label: "controlledRealDocumentPlanningChainClosed false", override: { controlledRealDocumentPlanningChainClosed: false } },
    { label: "controlledRealDocumentPlanningChainPassed false", override: { controlledRealDocumentPlanningChainPassed: false } },
    { label: "controlledRealDocumentRuntimeAuthorizationGranted true", override: { controlledRealDocumentRuntimeAuthorizationGranted: true } },
    { label: "controlledRealDocumentPilotAuthorizationGranted true", override: { controlledRealDocumentPilotAuthorizationGranted: true } },
    { label: "controlledRealDocumentProductionAuthorizationGranted true", override: { controlledRealDocumentProductionAuthorizationGranted: true } },
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
    { label: "closureConfirmsAuthorizationPlanCompleted false", override: { closureConfirmsAuthorizationPlanCompleted: false } },
    { label: "closureConfirmsContractCompleted false", override: { closureConfirmsContractCompleted: false } },
    { label: "closureConfirmsRedactionPlanCompleted false", override: { closureConfirmsRedactionPlanCompleted: false } },
    { label: "closureConfirmsStructuredExtractionPlanCompleted false", override: { closureConfirmsStructuredExtractionPlanCompleted: false } },
    { label: "closureConfirmsEvidenceGateMappingPlanCompleted false", override: { closureConfirmsEvidenceGateMappingPlanCompleted: false } },
    { label: "closureConfirmsOcrAndStorageIsolationPlanCompleted false", override: { closureConfirmsOcrAndStorageIsolationPlanCompleted: false } },
    { label: "closureConfirmsUserVisibleOutputContractCompleted false", override: { closureConfirmsUserVisibleOutputContractCompleted: false } },
    { label: "closureConfirmsFinalReadinessAuditCompleted false", override: { closureConfirmsFinalReadinessAuditCompleted: false } },
    { label: "closureConfirmsCommercialBoundaryRetained false", override: { closureConfirmsCommercialBoundaryRetained: false } },
    { label: "closureConfirmsFreeQaBypassGuardRequired false", override: { closureConfirmsFreeQaBypassGuardRequired: false } },
    { label: "closureConfirmsPaidDocumentModeRequiredForFullExplanation false", override: { closureConfirmsPaidDocumentModeRequiredForFullExplanation: false } },
    { label: "closureConfirmsNoPublicRuntimeAuthorized false", override: { closureConfirmsNoPublicRuntimeAuthorized: false } },
    { label: "closureConfirmsNoPersistenceAuthorized false", override: { closureConfirmsNoPersistenceAuthorized: false } },
    { label: "closureConfirmsNoRealDocumentInputAuthorized false", override: { closureConfirmsNoRealDocumentInputAuthorized: false } },
    { label: "closureConfirmsNoUserVisibleOutputAuthorized false", override: { closureConfirmsNoUserVisibleOutputAuthorized: false } },
    { label: "closureConfirmsNoLegalDeadlineOutputAuthorized false", override: { closureConfirmsNoLegalDeadlineOutputAuthorized: false } },
    { label: "closureConfirmsNoLiveLlmRuntimeAuthorized false", override: { closureConfirmsNoLiveLlmRuntimeAuthorized: false } },
    { label: "closureConfirmsNo8x3AcRerun false", override: { closureConfirmsNo8x3AcRerun: false } },
    { label: "closureConfirmsNoOpenAiFetchEnvSdk false", override: { closureConfirmsNoOpenAiFetchEnvSdk: false } },
    { label: "closureConfirmsTamperCoverage false", override: { closureConfirmsTamperCoverage: false } },
    { label: "futureImplementationRequiresSeparateExplicitAuthorization false", override: { futureImplementationRequiresSeparateExplicitAuthorization: false } },
    { label: "futureImplementationRequiresFreshRiskReview false", override: { futureImplementationRequiresFreshRiskReview: false } },
    { label: "futureImplementationRequiresRuntimeKillSwitch false", override: { futureImplementationRequiresRuntimeKillSwitch: false } },
    { label: "futureImplementationRequiresDocumentBypassGuardBeforePaidMode false", override: { futureImplementationRequiresDocumentBypassGuardBeforePaidMode: false } },
    { label: "futureImplementationRequiresPaymentBoundaryBeforeFullExplanation false", override: { futureImplementationRequiresPaymentBoundaryBeforeFullExplanation: false } },
    { label: "futureImplementationRequiresOcrIsolationBeforeRuntime false", override: { futureImplementationRequiresOcrIsolationBeforeRuntime: false } },
    { label: "futureImplementationRequiresStoragePolicyBeforePersistence false", override: { futureImplementationRequiresStoragePolicyBeforePersistence: false } },
    { label: "futureImplementationRequiresRedactionBeforeModelUse false", override: { futureImplementationRequiresRedactionBeforeModelUse: false } },
    { label: "futureImplementationRequiresEvidenceGatesBeforeInterpretation false", override: { futureImplementationRequiresEvidenceGatesBeforeInterpretation: false } },
    { label: "futureImplementationRequiresUserVisibleOutputContractBeforeDisplay false", override: { futureImplementationRequiresUserVisibleOutputContractBeforeDisplay: false } },
    { label: "futureImplementationRequiresHumanReviewPolicyForHighRisk false", override: { futureImplementationRequiresHumanReviewPolicyForHighRisk: false } },
    { label: "futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate false", override: { futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate: false } },
    { label: "futureImplementationRequiresNoLegalAdviceOrCertainty false", override: { futureImplementationRequiresNoLegalAdviceOrCertainty: false } },
    { label: "futureImplementationRequiresAuditTraceBeforeRuntime false", override: { futureImplementationRequiresAuditTraceBeforeRuntime: false } },
    { label: "futureImplementationRequiresTamperTestsBeforeRuntime false", override: { futureImplementationRequiresTamperTestsBeforeRuntime: false } },
    { label: "readyForControlledRealDocumentRuntimeImplementationPlan false", override: { readyForControlledRealDocumentRuntimeImplementationPlan: false } },
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
    { label: "runtimeImplementationPlanOnly false", override: { runtimeImplementationPlanOnly: false } },
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.5A check)", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateRuntimeImplementationPlanInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    planAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.5A: controlled real-document runtime implementation plan layer — depends on completed 8.4I controlled real-document planning closure decision",
    "8.5A is implementation planning only — not runtime authorization",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5A",
    "8.3AC was not re-run",
    "Free Q&A remains free",
    "full document explanation requires Paid Document Mode",
    "pasted full documents in Free Q&A must be redirected to Paid Document Mode",
    "payment does not override safety blocks",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.5B controlled real-document runtime authorization contract",
    "8.5B is still planning/contract only unless explicitly authorized later",
    `8.4I prerequisite: allPassed=${closureResult.allPassed}, readyForRuntimeImplPlan=${closureResult.readyForControlledRealDocumentRuntimeImplementationPlan}`,
    `runtime implementation plan input validation: ${planAccepted ? "accepted" : "REJECTED"} — reasons: ${planValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.5A allPassed: true — controlled real-document runtime implementation plan accepted"
    );
    notes.push(
      "readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.5A",
    allPassed,
    planningClosureReadyForRuntimeImplementationPlan:
      canonicalInput.controlledRealDocumentPlanningClosureDecisionAccepted,
    controlledRealDocumentRuntimeImplementationPlanAccepted: allPassed,
    runtimeImplementationPlanOnly: true,
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

    runtimePlanRequiresSeparateExplicitAuthorization:
      canonicalInput.runtimePlanRequiresSeparateExplicitAuthorization,
    runtimePlanRequiresFreshRiskReview:
      canonicalInput.runtimePlanRequiresFreshRiskReview,
    runtimePlanRequiresRuntimeKillSwitch:
      canonicalInput.runtimePlanRequiresRuntimeKillSwitch,
    runtimePlanRequiresFeatureFlagDefaultOff:
      canonicalInput.runtimePlanRequiresFeatureFlagDefaultOff,
    runtimePlanRequiresServerSideOnlyProcessingBoundary:
      canonicalInput.runtimePlanRequiresServerSideOnlyProcessingBoundary,
    runtimePlanRequiresNoClientSideSecretExposure:
      canonicalInput.runtimePlanRequiresNoClientSideSecretExposure,
    runtimePlanRequiresNoPromptLeakage:
      canonicalInput.runtimePlanRequiresNoPromptLeakage,
    runtimePlanRequiresNoModelOutputPersistenceByDefault:
      canonicalInput.runtimePlanRequiresNoModelOutputPersistenceByDefault,
    runtimePlanRequiresNoRawDocumentPersistenceByDefault:
      canonicalInput.runtimePlanRequiresNoRawDocumentPersistenceByDefault,
    runtimePlanRequiresEphemeralProcessingByDefault:
      canonicalInput.runtimePlanRequiresEphemeralProcessingByDefault,
    runtimePlanRequiresRedactionBeforeModelUse:
      canonicalInput.runtimePlanRequiresRedactionBeforeModelUse,
    runtimePlanRequiresOcrOutputTreatedAsUntrusted:
      canonicalInput.runtimePlanRequiresOcrOutputTreatedAsUntrusted,
    runtimePlanRequiresEvidenceGatesBeforeInterpretation:
      canonicalInput.runtimePlanRequiresEvidenceGatesBeforeInterpretation,
    runtimePlanRequiresUserVisibleOutputContractBeforeDisplay:
      canonicalInput.runtimePlanRequiresUserVisibleOutputContractBeforeDisplay,
    runtimePlanRequiresDocumentBypassGuardBeforeFreeQa:
      canonicalInput.runtimePlanRequiresDocumentBypassGuardBeforeFreeQa,
    runtimePlanRequiresPaidDocumentModeBeforeFullExplanation:
      canonicalInput.runtimePlanRequiresPaidDocumentModeBeforeFullExplanation,
    runtimePlanRequiresPaymentBoundaryBeforeFullExplanation:
      canonicalInput.runtimePlanRequiresPaymentBoundaryBeforeFullExplanation,
    runtimePlanRequiresFailureNoChargePolicy:
      canonicalInput.runtimePlanRequiresFailureNoChargePolicy,
    runtimePlanRequiresStoragePolicyBeforeAnyPersistence:
      canonicalInput.runtimePlanRequiresStoragePolicyBeforeAnyPersistence,
    runtimePlanRequiresHumanReviewPolicyForHighRisk:
      canonicalInput.runtimePlanRequiresHumanReviewPolicyForHighRisk,
    runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate:
      canonicalInput.runtimePlanRequiresNoExactDeadlineWithoutDeliveryDate,
    runtimePlanRequiresNoLegalAdviceOrCertainty:
      canonicalInput.runtimePlanRequiresNoLegalAdviceOrCertainty,
    runtimePlanRequiresAuditTraceBeforeRuntime:
      canonicalInput.runtimePlanRequiresAuditTraceBeforeRuntime,
    runtimePlanRequiresTamperTestsBeforeRuntime:
      canonicalInput.runtimePlanRequiresTamperTestsBeforeRuntime,
    runtimePlanRequiresRateLimitBeforePublicExposure:
      canonicalInput.runtimePlanRequiresRateLimitBeforePublicExposure,
    runtimePlanRequiresAbuseDetectionBeforePublicExposure:
      canonicalInput.runtimePlanRequiresAbuseDetectionBeforePublicExposure,
    runtimePlanRequiresPrivacyNoticeBeforeUpload:
      canonicalInput.runtimePlanRequiresPrivacyNoticeBeforeUpload,
    runtimePlanRequiresUserLanguageSelectionBeforeOutput:
      canonicalInput.runtimePlanRequiresUserLanguageSelectionBeforeOutput,
    runtimePlanRequiresRollbackPlanBeforePilot:
      canonicalInput.runtimePlanRequiresRollbackPlanBeforePilot,
    runtimePlanRequiresMonitoringPlanBeforePilot:
      canonicalInput.runtimePlanRequiresMonitoringPlanBeforePilot,

    runtimePlanConfirmsFreeQuestionModeRemainsFree:
      canonicalInput.runtimePlanConfirmsFreeQuestionModeRemainsFree,
    runtimePlanConfirmsDocumentExplanationRequiresPaidMode:
      canonicalInput.runtimePlanConfirmsDocumentExplanationRequiresPaidMode,
    runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode:
      canonicalInput.runtimePlanConfirmsPhotoDocumentExplanationRequiresPaidMode,
    runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode:
      canonicalInput.runtimePlanConfirmsPastedFullDocumentRedirectsToPaidMode,
    runtimePlanConfirmsDocumentBypassGuardIsMandatory:
      canonicalInput.runtimePlanConfirmsDocumentBypassGuardIsMandatory,
    runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks:
      canonicalInput.runtimePlanConfirmsPaymentDoesNotOverrideSafetyBlocks,
    runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract:
      canonicalInput.runtimePlanConfirmsHighRiskOutputStillRequiresSafetyContract,

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

    readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract:
      canonicalInput.readyFor8x5BControlledRealDocumentRuntimeAuthorizationContract,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
