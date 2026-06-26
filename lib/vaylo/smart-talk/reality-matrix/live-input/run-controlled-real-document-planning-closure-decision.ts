/**
 * Phase 8.4I — Controlled Real Document Planning Closure Decision.
 *
 * CLOSURE/PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4H.
 *
 * This file closes the 8.4 controlled real-document planning chain without
 * authorizing runtime real-document input, OCR, upload, storage, persistence,
 * public runtime, or user-visible output. It is:
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
 *   - NOT production authorization.
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
 *   - Grant final, pilot, or production authorization.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentFinalReadinessAudit } from "./run-controlled-real-document-final-readiness-audit";

// ── Local planning closure decision input type ────────────────────────────────

interface ControlledRealDocumentPlanningClosureDecisionInput {
  // 8.4H prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly userVisibleOutputContractReadyForFinalReadinessAudit: boolean;
  readonly controlledRealDocumentFinalReadinessAuditAccepted: boolean;
  readonly finalReadinessAuditOnly: boolean;
  readonly readyFor8x4IControlledRealDocumentPlanningClosureDecision: boolean;

  // 8.4H actual* performed flags (must be false)
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
  readonly finalAuthorizationGranted: boolean;

  // 8.4H audit coverage gates (must be true)
  readonly finalAuditCoversAuthorizationPlan: boolean;
  readonly finalAuditCoversContract: boolean;
  readonly finalAuditCoversRedactionPlan: boolean;
  readonly finalAuditCoversStructuredExtractionPlan: boolean;
  readonly finalAuditCoversEvidenceGateMappingPlan: boolean;
  readonly finalAuditCoversOcrAndStorageIsolationPlan: boolean;
  readonly finalAuditCoversUserVisibleOutputContract: boolean;
  readonly finalAuditCoversCommercialBoundary: boolean;
  readonly finalAuditCoversFreeQaBypassGuard: boolean;
  readonly finalAuditCoversPaidDocumentModeBoundary: boolean;
  readonly finalAuditCoversPrivacyAndStorageBoundary: boolean;
  readonly finalAuditCoversLegalSafetyBoundary: boolean;
  readonly finalAuditCoversNoPublicRuntimeBoundary: boolean;
  readonly finalAuditCoversNoPersistenceBoundary: boolean;
  readonly finalAuditCoversNoRealDocumentInputBoundary: boolean;
  readonly finalAuditCoversNoUserVisibleOutputBoundary: boolean;
  readonly finalAuditCoversNoLiveLlmRuntimeBoundary: boolean;
  readonly finalAuditCoversTamperCoverage: boolean;

  // 8.4H final readiness requirements (must be true)
  readonly finalReadinessRequiresAllPriorPhasesPassed: boolean;
  readonly finalReadinessRequiresSingleImportChain: boolean;
  readonly finalReadinessRequiresNoExistingFileModification: boolean;
  readonly finalReadinessRequiresNo8x3AcRerun: boolean;
  readonly finalReadinessRequiresNoOpenAiFetchEnvSdk: boolean;
  readonly finalReadinessRequiresNoRuntimeSmartTalkPath: boolean;
  readonly finalReadinessRequiresNoOcrRuntime: boolean;
  readonly finalReadinessRequiresNoUploadRuntime: boolean;
  readonly finalReadinessRequiresNoStorageRuntime: boolean;
  readonly finalReadinessRequiresNoPersistenceRuntime: boolean;
  readonly finalReadinessRequiresNoPublicRuntime: boolean;
  readonly finalReadinessRequiresNoUserVisibleOutputRuntime: boolean;
  readonly finalReadinessRequiresNoLegalDeadlineOutputRuntime: boolean;
  readonly finalReadinessRequiresNoActualEvidenceEvaluation: boolean;
  readonly finalReadinessRequiresNoActualClaimAuthorization: boolean;
  readonly finalReadinessRequiresNoActualDeadlineCalculation: boolean;
  readonly finalReadinessRequiresDeliveryDateForExactDeadline: boolean;
  readonly finalReadinessRequiresHumanReviewForHighRisk: boolean;
  readonly finalReadinessRequiresUncertaintyDisclosure: boolean;
  readonly finalReadinessRequiresMissingEvidenceDisclosure: boolean;
  readonly finalReadinessRequiresOcrConfidenceDisclosure: boolean;
  readonly finalReadinessRequiresPlainLanguageOutputContract: boolean;
  readonly finalReadinessRequiresUserSelectedLanguageOutputContract: boolean;
  readonly finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation: boolean;
  readonly finalReadinessRequiresFailureNoChargePolicy: boolean;

  // 8.4H runtime authorization flags (must be false)
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

  // 8.4H runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4I assertions
  readonly planningClosureDecisionOnly: boolean;
  readonly controlledRealDocumentPlanningChainClosed: boolean;
  readonly controlledRealDocumentPlanningChainPassed: boolean;
  readonly controlledRealDocumentRuntimeAuthorizationGranted: boolean;
  readonly controlledRealDocumentProductionAuthorizationGranted: boolean;
  readonly controlledRealDocumentPilotAuthorizationGranted: boolean;

  // Closure coverage requirements
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

  // Future implementation guard requirements
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

  readonly readyForControlledRealDocumentRuntimeImplementationPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPlanningClosureDecisionResult {
  readonly checkId: "8.4I";
  readonly allPassed: boolean;
  readonly finalReadinessAuditReadyForPlanningClosureDecision: boolean;
  readonly controlledRealDocumentPlanningClosureDecisionAccepted: boolean;
  readonly planningClosureDecisionOnly: true;
  readonly controlledRealDocumentPlanningChainClosed: boolean;
  readonly controlledRealDocumentPlanningChainPassed: boolean;
  readonly tamperCasesRejected: boolean;

  readonly controlledRealDocumentRuntimeAuthorizationGranted: false;
  readonly controlledRealDocumentProductionAuthorizationGranted: false;
  readonly controlledRealDocumentPilotAuthorizationGranted: false;
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

  readonly readyForControlledRealDocumentRuntimeImplementationPlan: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Planning closure input validator ──────────────────────────────────────────

function validatePlanningClosureInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4H prerequisite gates
  if (o["prereqCheckId"] !== "8.4H")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentFinalReadinessAuditAccepted"] !== true)
    reasons.push("final_readiness_audit_not_accepted");
  if (o["finalReadinessAuditOnly"] !== true)
    reasons.push("final_readiness_audit_only_false");
  if (o["readyFor8x4IControlledRealDocumentPlanningClosureDecision"] !== true)
    reasons.push("not_ready_for_8_4i_planning_closure_decision");

  // 8.4H actual* performed flags (must be false)
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
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // 8.4H audit coverage gates (must be true)
  if (o["finalAuditCoversAuthorizationPlan"] !== true)
    reasons.push("final_audit_covers_authorization_plan_false");
  if (o["finalAuditCoversContract"] !== true)
    reasons.push("final_audit_covers_contract_false");
  if (o["finalAuditCoversRedactionPlan"] !== true)
    reasons.push("final_audit_covers_redaction_plan_false");
  if (o["finalAuditCoversStructuredExtractionPlan"] !== true)
    reasons.push("final_audit_covers_structured_extraction_plan_false");
  if (o["finalAuditCoversEvidenceGateMappingPlan"] !== true)
    reasons.push("final_audit_covers_evidence_gate_mapping_plan_false");
  if (o["finalAuditCoversOcrAndStorageIsolationPlan"] !== true)
    reasons.push("final_audit_covers_ocr_and_storage_isolation_plan_false");
  if (o["finalAuditCoversUserVisibleOutputContract"] !== true)
    reasons.push("final_audit_covers_user_visible_output_contract_false");
  if (o["finalAuditCoversCommercialBoundary"] !== true)
    reasons.push("final_audit_covers_commercial_boundary_false");
  if (o["finalAuditCoversFreeQaBypassGuard"] !== true)
    reasons.push("final_audit_covers_free_qa_bypass_guard_false");
  if (o["finalAuditCoversPaidDocumentModeBoundary"] !== true)
    reasons.push("final_audit_covers_paid_document_mode_boundary_false");
  if (o["finalAuditCoversPrivacyAndStorageBoundary"] !== true)
    reasons.push("final_audit_covers_privacy_and_storage_boundary_false");
  if (o["finalAuditCoversLegalSafetyBoundary"] !== true)
    reasons.push("final_audit_covers_legal_safety_boundary_false");
  if (o["finalAuditCoversNoPublicRuntimeBoundary"] !== true)
    reasons.push("final_audit_covers_no_public_runtime_boundary_false");
  if (o["finalAuditCoversNoPersistenceBoundary"] !== true)
    reasons.push("final_audit_covers_no_persistence_boundary_false");
  if (o["finalAuditCoversNoRealDocumentInputBoundary"] !== true)
    reasons.push("final_audit_covers_no_real_document_input_boundary_false");
  if (o["finalAuditCoversNoUserVisibleOutputBoundary"] !== true)
    reasons.push("final_audit_covers_no_user_visible_output_boundary_false");
  if (o["finalAuditCoversNoLiveLlmRuntimeBoundary"] !== true)
    reasons.push("final_audit_covers_no_live_llm_runtime_boundary_false");
  if (o["finalAuditCoversTamperCoverage"] !== true)
    reasons.push("final_audit_covers_tamper_coverage_false");

  // 8.4H final readiness requirements (must be true)
  if (o["finalReadinessRequiresAllPriorPhasesPassed"] !== true)
    reasons.push("final_readiness_requires_all_prior_phases_passed_false");
  if (o["finalReadinessRequiresSingleImportChain"] !== true)
    reasons.push("final_readiness_requires_single_import_chain_false");
  if (o["finalReadinessRequiresNoExistingFileModification"] !== true)
    reasons.push("final_readiness_requires_no_existing_file_modification_false");
  if (o["finalReadinessRequiresNo8x3AcRerun"] !== true)
    reasons.push("final_readiness_requires_no_8_3ac_rerun_false");
  if (o["finalReadinessRequiresNoOpenAiFetchEnvSdk"] !== true)
    reasons.push("final_readiness_requires_no_openai_fetch_env_sdk_false");
  if (o["finalReadinessRequiresNoRuntimeSmartTalkPath"] !== true)
    reasons.push("final_readiness_requires_no_runtime_smart_talk_path_false");
  if (o["finalReadinessRequiresNoOcrRuntime"] !== true)
    reasons.push("final_readiness_requires_no_ocr_runtime_false");
  if (o["finalReadinessRequiresNoUploadRuntime"] !== true)
    reasons.push("final_readiness_requires_no_upload_runtime_false");
  if (o["finalReadinessRequiresNoStorageRuntime"] !== true)
    reasons.push("final_readiness_requires_no_storage_runtime_false");
  if (o["finalReadinessRequiresNoPersistenceRuntime"] !== true)
    reasons.push("final_readiness_requires_no_persistence_runtime_false");
  if (o["finalReadinessRequiresNoPublicRuntime"] !== true)
    reasons.push("final_readiness_requires_no_public_runtime_false");
  if (o["finalReadinessRequiresNoUserVisibleOutputRuntime"] !== true)
    reasons.push("final_readiness_requires_no_user_visible_output_runtime_false");
  if (o["finalReadinessRequiresNoLegalDeadlineOutputRuntime"] !== true)
    reasons.push("final_readiness_requires_no_legal_deadline_output_runtime_false");
  if (o["finalReadinessRequiresNoActualEvidenceEvaluation"] !== true)
    reasons.push("final_readiness_requires_no_actual_evidence_evaluation_false");
  if (o["finalReadinessRequiresNoActualClaimAuthorization"] !== true)
    reasons.push("final_readiness_requires_no_actual_claim_authorization_false");
  if (o["finalReadinessRequiresNoActualDeadlineCalculation"] !== true)
    reasons.push("final_readiness_requires_no_actual_deadline_calculation_false");
  if (o["finalReadinessRequiresDeliveryDateForExactDeadline"] !== true)
    reasons.push("final_readiness_requires_delivery_date_for_exact_deadline_false");
  if (o["finalReadinessRequiresHumanReviewForHighRisk"] !== true)
    reasons.push("final_readiness_requires_human_review_for_high_risk_false");
  if (o["finalReadinessRequiresUncertaintyDisclosure"] !== true)
    reasons.push("final_readiness_requires_uncertainty_disclosure_false");
  if (o["finalReadinessRequiresMissingEvidenceDisclosure"] !== true)
    reasons.push("final_readiness_requires_missing_evidence_disclosure_false");
  if (o["finalReadinessRequiresOcrConfidenceDisclosure"] !== true)
    reasons.push("final_readiness_requires_ocr_confidence_disclosure_false");
  if (o["finalReadinessRequiresPlainLanguageOutputContract"] !== true)
    reasons.push("final_readiness_requires_plain_language_output_contract_false");
  if (o["finalReadinessRequiresUserSelectedLanguageOutputContract"] !== true)
    reasons.push("final_readiness_requires_user_selected_language_output_contract_false");
  if (o["finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation"] !== true)
    reasons.push("final_readiness_requires_paid_document_mode_for_full_doc_explanation_false");
  if (o["finalReadinessRequiresFailureNoChargePolicy"] !== true)
    reasons.push("final_readiness_requires_failure_no_charge_policy_false");

  // 8.4H runtime authorization flags (must be false)
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

  // 8.4H runtime/public invariants
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

  // Derived 8.4I assertions
  if (o["planningClosureDecisionOnly"] !== true)
    reasons.push("planning_closure_decision_only_false");
  if (o["controlledRealDocumentPlanningChainClosed"] !== true)
    reasons.push("controlled_real_document_planning_chain_closed_false");
  if (o["controlledRealDocumentPlanningChainPassed"] !== true)
    reasons.push("controlled_real_document_planning_chain_passed_false");
  if (o["controlledRealDocumentRuntimeAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_runtime_authorization_granted");
  if (o["controlledRealDocumentProductionAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_production_authorization_granted");
  if (o["controlledRealDocumentPilotAuthorizationGranted"] !== false)
    reasons.push("controlled_real_document_pilot_authorization_granted");

  // Closure coverage requirements
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

  // Future implementation guard requirements
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

  if (o["readyForControlledRealDocumentRuntimeImplementationPlan"] !== true)
    reasons.push("not_ready_for_controlled_real_document_runtime_implementation_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentPlanningClosureDecision(): ControlledRealDocumentPlanningClosureDecisionResult {
  // ── Step 1: Obtain 8.4H final readiness audit result ──────────────────────
  const auditResult = runControlledRealDocumentFinalReadinessAudit();

  const prereqAllPassed = auditResult.allPassed;
  const prereqReady =
    auditResult.readyFor8x4IControlledRealDocumentPlanningClosureDecision;

  // ── Step 2: Build canonical planning closure input ────────────────────────
  const canonicalInput: ControlledRealDocumentPlanningClosureDecisionInput = {
    prereqCheckId: auditResult.checkId,
    prereqAllPassed,
    userVisibleOutputContractReadyForFinalReadinessAudit:
      auditResult.userVisibleOutputContractReadyForFinalReadinessAudit,
    controlledRealDocumentFinalReadinessAuditAccepted:
      auditResult.controlledRealDocumentFinalReadinessAuditAccepted,
    finalReadinessAuditOnly: auditResult.finalReadinessAuditOnly,
    readyFor8x4IControlledRealDocumentPlanningClosureDecision: prereqReady,

    actualRealDocumentInputPerformed: auditResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      auditResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: auditResult.actualOcrPerformed,
    actualPhotoInputProcessed: auditResult.actualPhotoInputProcessed,
    actualFileInputProcessed: auditResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: auditResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed:
      auditResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: auditResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: auditResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: auditResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: auditResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: auditResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: auditResult.actualDeadlineCalculationPerformed,
    finalAuthorizationGranted: auditResult.finalAuthorizationGranted,

    finalAuditCoversAuthorizationPlan: auditResult.finalAuditCoversAuthorizationPlan,
    finalAuditCoversContract: auditResult.finalAuditCoversContract,
    finalAuditCoversRedactionPlan: auditResult.finalAuditCoversRedactionPlan,
    finalAuditCoversStructuredExtractionPlan:
      auditResult.finalAuditCoversStructuredExtractionPlan,
    finalAuditCoversEvidenceGateMappingPlan:
      auditResult.finalAuditCoversEvidenceGateMappingPlan,
    finalAuditCoversOcrAndStorageIsolationPlan:
      auditResult.finalAuditCoversOcrAndStorageIsolationPlan,
    finalAuditCoversUserVisibleOutputContract:
      auditResult.finalAuditCoversUserVisibleOutputContract,
    finalAuditCoversCommercialBoundary: auditResult.finalAuditCoversCommercialBoundary,
    finalAuditCoversFreeQaBypassGuard: auditResult.finalAuditCoversFreeQaBypassGuard,
    finalAuditCoversPaidDocumentModeBoundary:
      auditResult.finalAuditCoversPaidDocumentModeBoundary,
    finalAuditCoversPrivacyAndStorageBoundary:
      auditResult.finalAuditCoversPrivacyAndStorageBoundary,
    finalAuditCoversLegalSafetyBoundary: auditResult.finalAuditCoversLegalSafetyBoundary,
    finalAuditCoversNoPublicRuntimeBoundary:
      auditResult.finalAuditCoversNoPublicRuntimeBoundary,
    finalAuditCoversNoPersistenceBoundary:
      auditResult.finalAuditCoversNoPersistenceBoundary,
    finalAuditCoversNoRealDocumentInputBoundary:
      auditResult.finalAuditCoversNoRealDocumentInputBoundary,
    finalAuditCoversNoUserVisibleOutputBoundary:
      auditResult.finalAuditCoversNoUserVisibleOutputBoundary,
    finalAuditCoversNoLiveLlmRuntimeBoundary:
      auditResult.finalAuditCoversNoLiveLlmRuntimeBoundary,
    finalAuditCoversTamperCoverage: auditResult.finalAuditCoversTamperCoverage,

    finalReadinessRequiresAllPriorPhasesPassed:
      auditResult.finalReadinessRequiresAllPriorPhasesPassed,
    finalReadinessRequiresSingleImportChain:
      auditResult.finalReadinessRequiresSingleImportChain,
    finalReadinessRequiresNoExistingFileModification:
      auditResult.finalReadinessRequiresNoExistingFileModification,
    finalReadinessRequiresNo8x3AcRerun: auditResult.finalReadinessRequiresNo8x3AcRerun,
    finalReadinessRequiresNoOpenAiFetchEnvSdk:
      auditResult.finalReadinessRequiresNoOpenAiFetchEnvSdk,
    finalReadinessRequiresNoRuntimeSmartTalkPath:
      auditResult.finalReadinessRequiresNoRuntimeSmartTalkPath,
    finalReadinessRequiresNoOcrRuntime: auditResult.finalReadinessRequiresNoOcrRuntime,
    finalReadinessRequiresNoUploadRuntime:
      auditResult.finalReadinessRequiresNoUploadRuntime,
    finalReadinessRequiresNoStorageRuntime:
      auditResult.finalReadinessRequiresNoStorageRuntime,
    finalReadinessRequiresNoPersistenceRuntime:
      auditResult.finalReadinessRequiresNoPersistenceRuntime,
    finalReadinessRequiresNoPublicRuntime:
      auditResult.finalReadinessRequiresNoPublicRuntime,
    finalReadinessRequiresNoUserVisibleOutputRuntime:
      auditResult.finalReadinessRequiresNoUserVisibleOutputRuntime,
    finalReadinessRequiresNoLegalDeadlineOutputRuntime:
      auditResult.finalReadinessRequiresNoLegalDeadlineOutputRuntime,
    finalReadinessRequiresNoActualEvidenceEvaluation:
      auditResult.finalReadinessRequiresNoActualEvidenceEvaluation,
    finalReadinessRequiresNoActualClaimAuthorization:
      auditResult.finalReadinessRequiresNoActualClaimAuthorization,
    finalReadinessRequiresNoActualDeadlineCalculation:
      auditResult.finalReadinessRequiresNoActualDeadlineCalculation,
    finalReadinessRequiresDeliveryDateForExactDeadline:
      auditResult.finalReadinessRequiresDeliveryDateForExactDeadline,
    finalReadinessRequiresHumanReviewForHighRisk:
      auditResult.finalReadinessRequiresHumanReviewForHighRisk,
    finalReadinessRequiresUncertaintyDisclosure:
      auditResult.finalReadinessRequiresUncertaintyDisclosure,
    finalReadinessRequiresMissingEvidenceDisclosure:
      auditResult.finalReadinessRequiresMissingEvidenceDisclosure,
    finalReadinessRequiresOcrConfidenceDisclosure:
      auditResult.finalReadinessRequiresOcrConfidenceDisclosure,
    finalReadinessRequiresPlainLanguageOutputContract:
      auditResult.finalReadinessRequiresPlainLanguageOutputContract,
    finalReadinessRequiresUserSelectedLanguageOutputContract:
      auditResult.finalReadinessRequiresUserSelectedLanguageOutputContract,
    finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation:
      auditResult.finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation,
    finalReadinessRequiresFailureNoChargePolicy:
      auditResult.finalReadinessRequiresFailureNoChargePolicy,

    realDocumentInputAuthorizedNow: auditResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      auditResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      auditResult.realUserDocumentUploadAuthorizedNow,
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
    deliveryDateRequiredForExactDeadline:
      auditResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: auditResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: auditResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: auditResult.publicRuntimeEnabled,
    persistenceUsed: auditResult.persistenceUsed,
    neverUserVisible: auditResult.neverUserVisible,

    planningClosureDecisionOnly: true,
    controlledRealDocumentPlanningChainClosed: prereqAllPassed && prereqReady,
    controlledRealDocumentPlanningChainPassed: prereqAllPassed && prereqReady,
    controlledRealDocumentRuntimeAuthorizationGranted: false,
    controlledRealDocumentProductionAuthorizationGranted: false,
    controlledRealDocumentPilotAuthorizationGranted: false,

    closureConfirmsAuthorizationPlanCompleted: prereqAllPassed && prereqReady,
    closureConfirmsContractCompleted: prereqAllPassed && prereqReady,
    closureConfirmsRedactionPlanCompleted: prereqAllPassed && prereqReady,
    closureConfirmsStructuredExtractionPlanCompleted: prereqAllPassed && prereqReady,
    closureConfirmsEvidenceGateMappingPlanCompleted: prereqAllPassed && prereqReady,
    closureConfirmsOcrAndStorageIsolationPlanCompleted: prereqAllPassed && prereqReady,
    closureConfirmsUserVisibleOutputContractCompleted: prereqAllPassed && prereqReady,
    closureConfirmsFinalReadinessAuditCompleted: prereqAllPassed && prereqReady,
    closureConfirmsCommercialBoundaryRetained: prereqAllPassed && prereqReady,
    closureConfirmsFreeQaBypassGuardRequired: prereqAllPassed && prereqReady,
    closureConfirmsPaidDocumentModeRequiredForFullExplanation:
      prereqAllPassed && prereqReady,
    closureConfirmsNoPublicRuntimeAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNoPersistenceAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNoRealDocumentInputAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNoUserVisibleOutputAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNoLegalDeadlineOutputAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNoLiveLlmRuntimeAuthorized: prereqAllPassed && prereqReady,
    closureConfirmsNo8x3AcRerun: prereqAllPassed && prereqReady,
    closureConfirmsNoOpenAiFetchEnvSdk: prereqAllPassed && prereqReady,
    closureConfirmsTamperCoverage: prereqAllPassed && prereqReady,

    futureImplementationRequiresSeparateExplicitAuthorization:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresFreshRiskReview: prereqAllPassed && prereqReady,
    futureImplementationRequiresRuntimeKillSwitch: prereqAllPassed && prereqReady,
    futureImplementationRequiresDocumentBypassGuardBeforePaidMode:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresPaymentBoundaryBeforeFullExplanation:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresOcrIsolationBeforeRuntime:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresStoragePolicyBeforePersistence:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
    futureImplementationRequiresEvidenceGatesBeforeInterpretation:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresUserVisibleOutputContractBeforeDisplay:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresHumanReviewPolicyForHighRisk:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresNoLegalAdviceOrCertainty:
      prereqAllPassed && prereqReady,
    futureImplementationRequiresAuditTraceBeforeRuntime: prereqAllPassed && prereqReady,
    futureImplementationRequiresTamperTestsBeforeRuntime:
      prereqAllPassed && prereqReady,

    readyForControlledRealDocumentRuntimeImplementationPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical planning closure input ─────────────────────
  const closureValidation = validatePlanningClosureInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const closureAccepted = closureValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4H checkId wrong", override: { prereqCheckId: "8.4G" } },
    { label: "8.4H allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentFinalReadinessAuditAccepted false", override: { controlledRealDocumentFinalReadinessAuditAccepted: false } },
    { label: "finalReadinessAuditOnly false", override: { finalReadinessAuditOnly: false } },
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
    { label: "finalAuditCoversAuthorizationPlan false", override: { finalAuditCoversAuthorizationPlan: false } },
    { label: "finalAuditCoversContract false", override: { finalAuditCoversContract: false } },
    { label: "finalAuditCoversRedactionPlan false", override: { finalAuditCoversRedactionPlan: false } },
    { label: "finalAuditCoversStructuredExtractionPlan false", override: { finalAuditCoversStructuredExtractionPlan: false } },
    { label: "finalAuditCoversEvidenceGateMappingPlan false", override: { finalAuditCoversEvidenceGateMappingPlan: false } },
    { label: "finalAuditCoversOcrAndStorageIsolationPlan false", override: { finalAuditCoversOcrAndStorageIsolationPlan: false } },
    { label: "finalAuditCoversUserVisibleOutputContract false", override: { finalAuditCoversUserVisibleOutputContract: false } },
    { label: "finalAuditCoversCommercialBoundary false", override: { finalAuditCoversCommercialBoundary: false } },
    { label: "finalAuditCoversFreeQaBypassGuard false", override: { finalAuditCoversFreeQaBypassGuard: false } },
    { label: "finalAuditCoversPaidDocumentModeBoundary false", override: { finalAuditCoversPaidDocumentModeBoundary: false } },
    { label: "finalAuditCoversPrivacyAndStorageBoundary false", override: { finalAuditCoversPrivacyAndStorageBoundary: false } },
    { label: "finalAuditCoversLegalSafetyBoundary false", override: { finalAuditCoversLegalSafetyBoundary: false } },
    { label: "finalAuditCoversNoPublicRuntimeBoundary false", override: { finalAuditCoversNoPublicRuntimeBoundary: false } },
    { label: "finalAuditCoversNoPersistenceBoundary false", override: { finalAuditCoversNoPersistenceBoundary: false } },
    { label: "finalAuditCoversNoRealDocumentInputBoundary false", override: { finalAuditCoversNoRealDocumentInputBoundary: false } },
    { label: "finalAuditCoversNoUserVisibleOutputBoundary false", override: { finalAuditCoversNoUserVisibleOutputBoundary: false } },
    { label: "finalAuditCoversNoLiveLlmRuntimeBoundary false", override: { finalAuditCoversNoLiveLlmRuntimeBoundary: false } },
    { label: "finalAuditCoversTamperCoverage false", override: { finalAuditCoversTamperCoverage: false } },
    { label: "finalReadinessRequiresAllPriorPhasesPassed false", override: { finalReadinessRequiresAllPriorPhasesPassed: false } },
    { label: "finalReadinessRequiresSingleImportChain false", override: { finalReadinessRequiresSingleImportChain: false } },
    { label: "finalReadinessRequiresNoExistingFileModification false", override: { finalReadinessRequiresNoExistingFileModification: false } },
    { label: "finalReadinessRequiresNo8x3AcRerun false", override: { finalReadinessRequiresNo8x3AcRerun: false } },
    { label: "finalReadinessRequiresNoOpenAiFetchEnvSdk false", override: { finalReadinessRequiresNoOpenAiFetchEnvSdk: false } },
    { label: "finalReadinessRequiresNoRuntimeSmartTalkPath false", override: { finalReadinessRequiresNoRuntimeSmartTalkPath: false } },
    { label: "finalReadinessRequiresNoOcrRuntime false", override: { finalReadinessRequiresNoOcrRuntime: false } },
    { label: "finalReadinessRequiresNoUploadRuntime false", override: { finalReadinessRequiresNoUploadRuntime: false } },
    { label: "finalReadinessRequiresNoStorageRuntime false", override: { finalReadinessRequiresNoStorageRuntime: false } },
    { label: "finalReadinessRequiresNoPersistenceRuntime false", override: { finalReadinessRequiresNoPersistenceRuntime: false } },
    { label: "finalReadinessRequiresNoPublicRuntime false", override: { finalReadinessRequiresNoPublicRuntime: false } },
    { label: "finalReadinessRequiresNoUserVisibleOutputRuntime false", override: { finalReadinessRequiresNoUserVisibleOutputRuntime: false } },
    { label: "finalReadinessRequiresNoLegalDeadlineOutputRuntime false", override: { finalReadinessRequiresNoLegalDeadlineOutputRuntime: false } },
    { label: "finalReadinessRequiresNoActualEvidenceEvaluation false", override: { finalReadinessRequiresNoActualEvidenceEvaluation: false } },
    { label: "finalReadinessRequiresNoActualClaimAuthorization false", override: { finalReadinessRequiresNoActualClaimAuthorization: false } },
    { label: "finalReadinessRequiresNoActualDeadlineCalculation false", override: { finalReadinessRequiresNoActualDeadlineCalculation: false } },
    { label: "finalReadinessRequiresDeliveryDateForExactDeadline false", override: { finalReadinessRequiresDeliveryDateForExactDeadline: false } },
    { label: "finalReadinessRequiresHumanReviewForHighRisk false", override: { finalReadinessRequiresHumanReviewForHighRisk: false } },
    { label: "finalReadinessRequiresUncertaintyDisclosure false", override: { finalReadinessRequiresUncertaintyDisclosure: false } },
    { label: "finalReadinessRequiresMissingEvidenceDisclosure false", override: { finalReadinessRequiresMissingEvidenceDisclosure: false } },
    { label: "finalReadinessRequiresOcrConfidenceDisclosure false", override: { finalReadinessRequiresOcrConfidenceDisclosure: false } },
    { label: "finalReadinessRequiresPlainLanguageOutputContract false", override: { finalReadinessRequiresPlainLanguageOutputContract: false } },
    { label: "finalReadinessRequiresUserSelectedLanguageOutputContract false", override: { finalReadinessRequiresUserSelectedLanguageOutputContract: false } },
    { label: "finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation false", override: { finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation: false } },
    { label: "finalReadinessRequiresFailureNoChargePolicy false", override: { finalReadinessRequiresFailureNoChargePolicy: false } },
    { label: "readyFor8x4IControlledRealDocumentPlanningClosureDecision false", override: { readyFor8x4IControlledRealDocumentPlanningClosureDecision: false } },
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
    { label: "planningClosureDecisionOnly false", override: { planningClosureDecisionOnly: false } },
    { label: "controlledRealDocumentPlanningChainClosed false", override: { controlledRealDocumentPlanningChainClosed: false } },
    { label: "controlledRealDocumentPlanningChainPassed false", override: { controlledRealDocumentPlanningChainPassed: false } },
    { label: "controlledRealDocumentRuntimeAuthorizationGranted true", override: { controlledRealDocumentRuntimeAuthorizationGranted: true } },
    { label: "controlledRealDocumentProductionAuthorizationGranted true", override: { controlledRealDocumentProductionAuthorizationGranted: true } },
    { label: "controlledRealDocumentPilotAuthorizationGranted true", override: { controlledRealDocumentPilotAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true (8.4I check)", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validatePlanningClosureInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    closureAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4I: controlled real-document planning closure decision layer — depends on completed 8.4H controlled real-document final readiness audit",
    "8.4I closes the complete 8.4A–8.4H planning chain",
    "8.4I is closure/planning only — not production authorization",
    "the controlled real-document planning chain is closed and passed",
    "no final runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.4I",
    "8.3AC was not re-run",
    "Free Q&A vs Paid Document Mode boundary remains mandatory",
    "full document explanation requires Paid Document Mode",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "any future real-document runtime implementation requires a separate explicit authorization and fresh risk review",
    "readyForControlledRealDocumentRuntimeImplementationPlan is planning readiness only — not runtime authorization",
    `8.4H prerequisite: allPassed=${auditResult.allPassed}, readyFor8x4I=${auditResult.readyFor8x4IControlledRealDocumentPlanningClosureDecision}`,
    `planning closure input validation: ${closureAccepted ? "accepted" : "REJECTED"} — reasons: ${closureValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4I allPassed: true — controlled real-document planning closure decision accepted"
    );
    notes.push(
      "readyForControlledRealDocumentRuntimeImplementationPlan: true — planning readiness only, not runtime authorization"
    );
  }

  return {
    checkId: "8.4I",
    allPassed,
    finalReadinessAuditReadyForPlanningClosureDecision:
      canonicalInput.controlledRealDocumentFinalReadinessAuditAccepted,
    controlledRealDocumentPlanningClosureDecisionAccepted: allPassed,
    planningClosureDecisionOnly: true,
    controlledRealDocumentPlanningChainClosed:
      canonicalInput.controlledRealDocumentPlanningChainClosed,
    controlledRealDocumentPlanningChainPassed:
      canonicalInput.controlledRealDocumentPlanningChainPassed,
    tamperCasesRejected: allTamperRejected,

    controlledRealDocumentRuntimeAuthorizationGranted: false,
    controlledRealDocumentProductionAuthorizationGranted: false,
    controlledRealDocumentPilotAuthorizationGranted: false,
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

    closureConfirmsAuthorizationPlanCompleted:
      canonicalInput.closureConfirmsAuthorizationPlanCompleted,
    closureConfirmsContractCompleted: canonicalInput.closureConfirmsContractCompleted,
    closureConfirmsRedactionPlanCompleted:
      canonicalInput.closureConfirmsRedactionPlanCompleted,
    closureConfirmsStructuredExtractionPlanCompleted:
      canonicalInput.closureConfirmsStructuredExtractionPlanCompleted,
    closureConfirmsEvidenceGateMappingPlanCompleted:
      canonicalInput.closureConfirmsEvidenceGateMappingPlanCompleted,
    closureConfirmsOcrAndStorageIsolationPlanCompleted:
      canonicalInput.closureConfirmsOcrAndStorageIsolationPlanCompleted,
    closureConfirmsUserVisibleOutputContractCompleted:
      canonicalInput.closureConfirmsUserVisibleOutputContractCompleted,
    closureConfirmsFinalReadinessAuditCompleted:
      canonicalInput.closureConfirmsFinalReadinessAuditCompleted,
    closureConfirmsCommercialBoundaryRetained:
      canonicalInput.closureConfirmsCommercialBoundaryRetained,
    closureConfirmsFreeQaBypassGuardRequired:
      canonicalInput.closureConfirmsFreeQaBypassGuardRequired,
    closureConfirmsPaidDocumentModeRequiredForFullExplanation:
      canonicalInput.closureConfirmsPaidDocumentModeRequiredForFullExplanation,
    closureConfirmsNoPublicRuntimeAuthorized:
      canonicalInput.closureConfirmsNoPublicRuntimeAuthorized,
    closureConfirmsNoPersistenceAuthorized:
      canonicalInput.closureConfirmsNoPersistenceAuthorized,
    closureConfirmsNoRealDocumentInputAuthorized:
      canonicalInput.closureConfirmsNoRealDocumentInputAuthorized,
    closureConfirmsNoUserVisibleOutputAuthorized:
      canonicalInput.closureConfirmsNoUserVisibleOutputAuthorized,
    closureConfirmsNoLegalDeadlineOutputAuthorized:
      canonicalInput.closureConfirmsNoLegalDeadlineOutputAuthorized,
    closureConfirmsNoLiveLlmRuntimeAuthorized:
      canonicalInput.closureConfirmsNoLiveLlmRuntimeAuthorized,
    closureConfirmsNo8x3AcRerun: canonicalInput.closureConfirmsNo8x3AcRerun,
    closureConfirmsNoOpenAiFetchEnvSdk: canonicalInput.closureConfirmsNoOpenAiFetchEnvSdk,
    closureConfirmsTamperCoverage: canonicalInput.closureConfirmsTamperCoverage,

    futureImplementationRequiresSeparateExplicitAuthorization:
      canonicalInput.futureImplementationRequiresSeparateExplicitAuthorization,
    futureImplementationRequiresFreshRiskReview:
      canonicalInput.futureImplementationRequiresFreshRiskReview,
    futureImplementationRequiresRuntimeKillSwitch:
      canonicalInput.futureImplementationRequiresRuntimeKillSwitch,
    futureImplementationRequiresDocumentBypassGuardBeforePaidMode:
      canonicalInput.futureImplementationRequiresDocumentBypassGuardBeforePaidMode,
    futureImplementationRequiresPaymentBoundaryBeforeFullExplanation:
      canonicalInput.futureImplementationRequiresPaymentBoundaryBeforeFullExplanation,
    futureImplementationRequiresOcrIsolationBeforeRuntime:
      canonicalInput.futureImplementationRequiresOcrIsolationBeforeRuntime,
    futureImplementationRequiresStoragePolicyBeforePersistence:
      canonicalInput.futureImplementationRequiresStoragePolicyBeforePersistence,
    futureImplementationRequiresRedactionBeforeModelUse:
      canonicalInput.futureImplementationRequiresRedactionBeforeModelUse,
    futureImplementationRequiresEvidenceGatesBeforeInterpretation:
      canonicalInput.futureImplementationRequiresEvidenceGatesBeforeInterpretation,
    futureImplementationRequiresUserVisibleOutputContractBeforeDisplay:
      canonicalInput.futureImplementationRequiresUserVisibleOutputContractBeforeDisplay,
    futureImplementationRequiresHumanReviewPolicyForHighRisk:
      canonicalInput.futureImplementationRequiresHumanReviewPolicyForHighRisk,
    futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate:
      canonicalInput.futureImplementationRequiresNoExactDeadlineWithoutDeliveryDate,
    futureImplementationRequiresNoLegalAdviceOrCertainty:
      canonicalInput.futureImplementationRequiresNoLegalAdviceOrCertainty,
    futureImplementationRequiresAuditTraceBeforeRuntime:
      canonicalInput.futureImplementationRequiresAuditTraceBeforeRuntime,
    futureImplementationRequiresTamperTestsBeforeRuntime:
      canonicalInput.futureImplementationRequiresTamperTestsBeforeRuntime,

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

    readyForControlledRealDocumentRuntimeImplementationPlan:
      canonicalInput.readyForControlledRealDocumentRuntimeImplementationPlan,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
