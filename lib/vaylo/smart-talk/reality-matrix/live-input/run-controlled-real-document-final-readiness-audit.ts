/**
 * Phase 8.4H — Controlled Real Document Final Readiness Audit.
 *
 * AUDIT/PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4G.
 *
 * This file audits the complete 8.4A–8.4G planning chain before any later
 * closure/readiness decision. It is:
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
 *   - NOT final authorization.
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
 *   - Grant final authorization.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentUserVisibleOutputContract } from "./run-controlled-real-document-user-visible-output-contract";

// ── Local final readiness audit input type ────────────────────────────────────

interface ControlledRealDocumentFinalReadinessAuditInput {
  // 8.4G prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly ocrAndStorageIsolationReadyForUserVisibleOutputContract: boolean;
  readonly controlledRealDocumentUserVisibleOutputContractAccepted: boolean;
  readonly userVisibleOutputContractOnly: boolean;
  readonly readyFor8x4HControlledRealDocumentFinalReadinessAudit: boolean;

  // 8.4G actual* performed flags (must be false)
  readonly actualUserVisibleOutputPerformed: boolean;
  readonly actualPublicRuntimeEnabled: boolean;
  readonly actualOcrPerformed: boolean;
  readonly actualPhotoInputProcessed: boolean;
  readonly actualFileInputProcessed: boolean;
  readonly actualDocumentStoragePerformed: boolean;
  readonly actualDatabasePersistencePerformed: boolean;
  readonly actualAuditPersistencePerformed: boolean;
  readonly actualEvidenceEvaluationPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;

  // 8.4G output contract requirements (must be true)
  readonly outputContractRequiresPlainLanguageExplanation: boolean;
  readonly outputContractRequiresUserSelectedLanguage: boolean;
  readonly outputContractRequiresOriginalMeaningSummary: boolean;
  readonly outputContractRequiresDocumentTypeLabel: boolean;
  readonly outputContractRequiresAuthorityOrSenderLabel: boolean;
  readonly outputContractRequiresUrgencyLabel: boolean;
  readonly outputContractRequiresNextStepsSection: boolean;
  readonly outputContractRequiresWarningsSection: boolean;
  readonly outputContractRequiresUncertaintySection: boolean;
  readonly outputContractRequiresMissingEvidenceDisclosure: boolean;
  readonly outputContractRequiresOcrConfidenceDisclosure: boolean;
  readonly outputContractRequiresSourceAnchorsWhereAvailable: boolean;
  readonly outputContractRequiresNoHiddenReasoning: boolean;
  readonly outputContractRequiresNoRawDocumentLeakage: boolean;
  readonly outputContractRequiresNoPromptLeakage: boolean;
  readonly outputContractRequiresNoModelOutputLeakage: boolean;
  readonly outputContractRequiresNoApiKeyLeakage: boolean;
  readonly outputContractRequiresNoLegalAdviceClaim: boolean;
  readonly outputContractRequiresNoLegalCertainty: boolean;
  readonly outputContractRequiresNoDeadlineInvention: boolean;
  readonly outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized: boolean;
  readonly outputContractRequiresDeliveryOrBekanntgabeDateExplicitness: boolean;
  readonly outputContractRequiresNoCoerciveLegalInstruction: boolean;
  readonly outputContractRequiresHumanReviewForHighRisk: boolean;
  readonly outputContractRequiresEmergencyEscalationForHighRisk: boolean;
  readonly outputContractRequiresUnknownWhenEvidenceMissing: boolean;
  readonly outputContractRequiresAmbiguousEvidenceBlocksCertainty: boolean;
  readonly outputContractRequiresMissingEvidenceBlocksClaims: boolean;
  readonly outputContractRequiresFreeQuestionModeSeparation: boolean;
  readonly outputContractRequiresPaidDocumentModeSeparation: boolean;
  readonly outputContractRequiresDocumentBypassGuard: boolean;
  readonly outputContractRequiresNoFullDocumentExplanationInFreeQa: boolean;
  readonly outputContractRequiresPaymentBeforeFullDocumentExplanation: boolean;
  readonly outputContractRequiresSuccessfulProcessingDefinition: boolean;
  readonly outputContractRequiresFailureNoChargePolicy: boolean;
  readonly outputContractRequiresClearDocumentModeConsent: boolean;

  // 8.4G allowed future section labels
  readonly allowedFutureSectionSummaryLabel: string;
  readonly allowedFutureSectionTranslationLabel: string;
  readonly allowedFutureSectionMeaningLabel: string;
  readonly allowedFutureSectionUrgencyLabel: string;
  readonly allowedFutureSectionNextStepsLabel: string;
  readonly allowedFutureSectionWarningsLabel: string;
  readonly allowedFutureSectionUncertaintyLabel: string;
  readonly allowedFutureSectionEvidenceNotesLabel: string;

  // 8.4G runtime authorization flags (must be false)
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

  // 8.4G runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4H assertions
  readonly finalReadinessAuditOnly: boolean;
  readonly actualRealDocumentInputPerformed: boolean;
  readonly actualRealDocumentProcessingPerformed: boolean;
  readonly finalAuthorizationGranted: boolean;

  // Audit coverage requirements
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

  // Final readiness requirements
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

  readonly readyFor8x4IControlledRealDocumentPlanningClosureDecision: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentFinalReadinessAuditResult {
  readonly checkId: "8.4H";
  readonly allPassed: boolean;
  readonly userVisibleOutputContractReadyForFinalReadinessAudit: boolean;
  readonly controlledRealDocumentFinalReadinessAuditAccepted: boolean;
  readonly finalReadinessAuditOnly: true;
  readonly tamperCasesRejected: boolean;

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
  readonly finalAuthorizationGranted: false;

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

  readonly readyFor8x4IControlledRealDocumentPlanningClosureDecision: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Final readiness audit input validator ─────────────────────────────────────

function validateFinalReadinessAuditInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4G prerequisite gates
  if (o["prereqCheckId"] !== "8.4G")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentUserVisibleOutputContractAccepted"] !== true)
    reasons.push("user_visible_output_contract_not_accepted");
  if (o["userVisibleOutputContractOnly"] !== true)
    reasons.push("user_visible_output_contract_only_false");
  if (o["readyFor8x4HControlledRealDocumentFinalReadinessAudit"] !== true)
    reasons.push("not_ready_for_8_4h_final_readiness_audit");

  // 8.4G actual* performed flags (must be false)
  if (o["actualUserVisibleOutputPerformed"] !== false)
    reasons.push("actual_user_visible_output_performed");
  if (o["actualPublicRuntimeEnabled"] !== false)
    reasons.push("actual_public_runtime_enabled");
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
  if (o["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed");

  // 8.4G output contract requirements (must be true)
  if (o["outputContractRequiresPlainLanguageExplanation"] !== true)
    reasons.push("output_contract_requires_plain_language_explanation_false");
  if (o["outputContractRequiresUserSelectedLanguage"] !== true)
    reasons.push("output_contract_requires_user_selected_language_false");
  if (o["outputContractRequiresOriginalMeaningSummary"] !== true)
    reasons.push("output_contract_requires_original_meaning_summary_false");
  if (o["outputContractRequiresDocumentTypeLabel"] !== true)
    reasons.push("output_contract_requires_document_type_label_false");
  if (o["outputContractRequiresAuthorityOrSenderLabel"] !== true)
    reasons.push("output_contract_requires_authority_or_sender_label_false");
  if (o["outputContractRequiresUrgencyLabel"] !== true)
    reasons.push("output_contract_requires_urgency_label_false");
  if (o["outputContractRequiresNextStepsSection"] !== true)
    reasons.push("output_contract_requires_next_steps_section_false");
  if (o["outputContractRequiresWarningsSection"] !== true)
    reasons.push("output_contract_requires_warnings_section_false");
  if (o["outputContractRequiresUncertaintySection"] !== true)
    reasons.push("output_contract_requires_uncertainty_section_false");
  if (o["outputContractRequiresMissingEvidenceDisclosure"] !== true)
    reasons.push("output_contract_requires_missing_evidence_disclosure_false");
  if (o["outputContractRequiresOcrConfidenceDisclosure"] !== true)
    reasons.push("output_contract_requires_ocr_confidence_disclosure_false");
  if (o["outputContractRequiresSourceAnchorsWhereAvailable"] !== true)
    reasons.push("output_contract_requires_source_anchors_where_available_false");
  if (o["outputContractRequiresNoHiddenReasoning"] !== true)
    reasons.push("output_contract_requires_no_hidden_reasoning_false");
  if (o["outputContractRequiresNoRawDocumentLeakage"] !== true)
    reasons.push("output_contract_requires_no_raw_document_leakage_false");
  if (o["outputContractRequiresNoPromptLeakage"] !== true)
    reasons.push("output_contract_requires_no_prompt_leakage_false");
  if (o["outputContractRequiresNoModelOutputLeakage"] !== true)
    reasons.push("output_contract_requires_no_model_output_leakage_false");
  if (o["outputContractRequiresNoApiKeyLeakage"] !== true)
    reasons.push("output_contract_requires_no_api_key_leakage_false");
  if (o["outputContractRequiresNoLegalAdviceClaim"] !== true)
    reasons.push("output_contract_requires_no_legal_advice_claim_false");
  if (o["outputContractRequiresNoLegalCertainty"] !== true)
    reasons.push("output_contract_requires_no_legal_certainty_false");
  if (o["outputContractRequiresNoDeadlineInvention"] !== true)
    reasons.push("output_contract_requires_no_deadline_invention_false");
  if (o["outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized"] !== true)
    reasons.push("output_contract_requires_no_final_deadline_unless_evidence_authorized_false");
  if (o["outputContractRequiresDeliveryOrBekanntgabeDateExplicitness"] !== true)
    reasons.push("output_contract_requires_delivery_or_bekanntgabe_date_explicitness_false");
  if (o["outputContractRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("output_contract_requires_no_coercive_legal_instruction_false");
  if (o["outputContractRequiresHumanReviewForHighRisk"] !== true)
    reasons.push("output_contract_requires_human_review_for_high_risk_false");
  if (o["outputContractRequiresEmergencyEscalationForHighRisk"] !== true)
    reasons.push("output_contract_requires_emergency_escalation_for_high_risk_false");
  if (o["outputContractRequiresUnknownWhenEvidenceMissing"] !== true)
    reasons.push("output_contract_requires_unknown_when_evidence_missing_false");
  if (o["outputContractRequiresAmbiguousEvidenceBlocksCertainty"] !== true)
    reasons.push("output_contract_requires_ambiguous_evidence_blocks_certainty_false");
  if (o["outputContractRequiresMissingEvidenceBlocksClaims"] !== true)
    reasons.push("output_contract_requires_missing_evidence_blocks_claims_false");
  if (o["outputContractRequiresFreeQuestionModeSeparation"] !== true)
    reasons.push("output_contract_requires_free_question_mode_separation_false");
  if (o["outputContractRequiresPaidDocumentModeSeparation"] !== true)
    reasons.push("output_contract_requires_paid_document_mode_separation_false");
  if (o["outputContractRequiresDocumentBypassGuard"] !== true)
    reasons.push("output_contract_requires_document_bypass_guard_false");
  if (o["outputContractRequiresNoFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("output_contract_requires_no_full_document_explanation_in_free_qa_false");
  if (o["outputContractRequiresPaymentBeforeFullDocumentExplanation"] !== true)
    reasons.push("output_contract_requires_payment_before_full_document_explanation_false");
  if (o["outputContractRequiresSuccessfulProcessingDefinition"] !== true)
    reasons.push("output_contract_requires_successful_processing_definition_false");
  if (o["outputContractRequiresFailureNoChargePolicy"] !== true)
    reasons.push("output_contract_requires_failure_no_charge_policy_false");
  if (o["outputContractRequiresClearDocumentModeConsent"] !== true)
    reasons.push("output_contract_requires_clear_document_mode_consent_false");

  // 8.4G allowed future section labels
  if (o["allowedFutureSectionSummaryLabel"] !== "summary")
    reasons.push("allowed_future_section_summary_label_invalid");
  if (o["allowedFutureSectionTranslationLabel"] !== "translation")
    reasons.push("allowed_future_section_translation_label_invalid");
  if (o["allowedFutureSectionMeaningLabel"] !== "meaning")
    reasons.push("allowed_future_section_meaning_label_invalid");
  if (o["allowedFutureSectionUrgencyLabel"] !== "urgency")
    reasons.push("allowed_future_section_urgency_label_invalid");
  if (o["allowedFutureSectionNextStepsLabel"] !== "next_steps")
    reasons.push("allowed_future_section_next_steps_label_invalid");
  if (o["allowedFutureSectionWarningsLabel"] !== "warnings")
    reasons.push("allowed_future_section_warnings_label_invalid");
  if (o["allowedFutureSectionUncertaintyLabel"] !== "uncertainty")
    reasons.push("allowed_future_section_uncertainty_label_invalid");
  if (o["allowedFutureSectionEvidenceNotesLabel"] !== "evidence_notes")
    reasons.push("allowed_future_section_evidence_notes_label_invalid");

  // 8.4G runtime authorization flags (must be false)
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

  // 8.4G runtime/public invariants
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

  // Derived 8.4H assertions
  if (o["finalReadinessAuditOnly"] !== true)
    reasons.push("final_readiness_audit_only_false");
  if (o["actualRealDocumentInputPerformed"] !== false)
    reasons.push("actual_real_document_input_performed");
  if (o["actualRealDocumentProcessingPerformed"] !== false)
    reasons.push("actual_real_document_processing_performed");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");

  // Audit coverage requirements
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

  // Final readiness requirements
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
    reasons.push("final_readiness_requires_paid_document_mode_for_full_document_explanation_false");
  if (o["finalReadinessRequiresFailureNoChargePolicy"] !== true)
    reasons.push("final_readiness_requires_failure_no_charge_policy_false");

  if (o["readyFor8x4IControlledRealDocumentPlanningClosureDecision"] !== true)
    reasons.push("not_ready_for_8_4i_planning_closure_decision");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentFinalReadinessAudit(): ControlledRealDocumentFinalReadinessAuditResult {
  // ── Step 1: Obtain 8.4G user-visible output contract result ───────────────
  const contractResult = runControlledRealDocumentUserVisibleOutputContract();

  const prereqAllPassed = contractResult.allPassed;
  const prereqReady =
    contractResult.readyFor8x4HControlledRealDocumentFinalReadinessAudit;

  // ── Step 2: Build canonical final readiness audit input ───────────────────
  const canonicalInput: ControlledRealDocumentFinalReadinessAuditInput = {
    prereqCheckId: contractResult.checkId,
    prereqAllPassed,
    ocrAndStorageIsolationReadyForUserVisibleOutputContract:
      contractResult.ocrAndStorageIsolationReadyForUserVisibleOutputContract,
    controlledRealDocumentUserVisibleOutputContractAccepted:
      contractResult.controlledRealDocumentUserVisibleOutputContractAccepted,
    userVisibleOutputContractOnly: contractResult.userVisibleOutputContractOnly,
    readyFor8x4HControlledRealDocumentFinalReadinessAudit: prereqReady,

    actualUserVisibleOutputPerformed:
      contractResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: contractResult.actualPublicRuntimeEnabled,
    actualOcrPerformed: contractResult.actualOcrPerformed,
    actualPhotoInputProcessed: contractResult.actualPhotoInputProcessed,
    actualFileInputProcessed: contractResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: contractResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed:
      contractResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: contractResult.actualAuditPersistencePerformed,
    actualEvidenceEvaluationPerformed:
      contractResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed:
      contractResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed:
      contractResult.actualDeadlineCalculationPerformed,

    outputContractRequiresPlainLanguageExplanation:
      contractResult.outputContractRequiresPlainLanguageExplanation,
    outputContractRequiresUserSelectedLanguage:
      contractResult.outputContractRequiresUserSelectedLanguage,
    outputContractRequiresOriginalMeaningSummary:
      contractResult.outputContractRequiresOriginalMeaningSummary,
    outputContractRequiresDocumentTypeLabel:
      contractResult.outputContractRequiresDocumentTypeLabel,
    outputContractRequiresAuthorityOrSenderLabel:
      contractResult.outputContractRequiresAuthorityOrSenderLabel,
    outputContractRequiresUrgencyLabel:
      contractResult.outputContractRequiresUrgencyLabel,
    outputContractRequiresNextStepsSection:
      contractResult.outputContractRequiresNextStepsSection,
    outputContractRequiresWarningsSection:
      contractResult.outputContractRequiresWarningsSection,
    outputContractRequiresUncertaintySection:
      contractResult.outputContractRequiresUncertaintySection,
    outputContractRequiresMissingEvidenceDisclosure:
      contractResult.outputContractRequiresMissingEvidenceDisclosure,
    outputContractRequiresOcrConfidenceDisclosure:
      contractResult.outputContractRequiresOcrConfidenceDisclosure,
    outputContractRequiresSourceAnchorsWhereAvailable:
      contractResult.outputContractRequiresSourceAnchorsWhereAvailable,
    outputContractRequiresNoHiddenReasoning:
      contractResult.outputContractRequiresNoHiddenReasoning,
    outputContractRequiresNoRawDocumentLeakage:
      contractResult.outputContractRequiresNoRawDocumentLeakage,
    outputContractRequiresNoPromptLeakage:
      contractResult.outputContractRequiresNoPromptLeakage,
    outputContractRequiresNoModelOutputLeakage:
      contractResult.outputContractRequiresNoModelOutputLeakage,
    outputContractRequiresNoApiKeyLeakage:
      contractResult.outputContractRequiresNoApiKeyLeakage,
    outputContractRequiresNoLegalAdviceClaim:
      contractResult.outputContractRequiresNoLegalAdviceClaim,
    outputContractRequiresNoLegalCertainty:
      contractResult.outputContractRequiresNoLegalCertainty,
    outputContractRequiresNoDeadlineInvention:
      contractResult.outputContractRequiresNoDeadlineInvention,
    outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized:
      contractResult.outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized,
    outputContractRequiresDeliveryOrBekanntgabeDateExplicitness:
      contractResult.outputContractRequiresDeliveryOrBekanntgabeDateExplicitness,
    outputContractRequiresNoCoerciveLegalInstruction:
      contractResult.outputContractRequiresNoCoerciveLegalInstruction,
    outputContractRequiresHumanReviewForHighRisk:
      contractResult.outputContractRequiresHumanReviewForHighRisk,
    outputContractRequiresEmergencyEscalationForHighRisk:
      contractResult.outputContractRequiresEmergencyEscalationForHighRisk,
    outputContractRequiresUnknownWhenEvidenceMissing:
      contractResult.outputContractRequiresUnknownWhenEvidenceMissing,
    outputContractRequiresAmbiguousEvidenceBlocksCertainty:
      contractResult.outputContractRequiresAmbiguousEvidenceBlocksCertainty,
    outputContractRequiresMissingEvidenceBlocksClaims:
      contractResult.outputContractRequiresMissingEvidenceBlocksClaims,
    outputContractRequiresFreeQuestionModeSeparation:
      contractResult.outputContractRequiresFreeQuestionModeSeparation,
    outputContractRequiresPaidDocumentModeSeparation:
      contractResult.outputContractRequiresPaidDocumentModeSeparation,
    outputContractRequiresDocumentBypassGuard:
      contractResult.outputContractRequiresDocumentBypassGuard,
    outputContractRequiresNoFullDocumentExplanationInFreeQa:
      contractResult.outputContractRequiresNoFullDocumentExplanationInFreeQa,
    outputContractRequiresPaymentBeforeFullDocumentExplanation:
      contractResult.outputContractRequiresPaymentBeforeFullDocumentExplanation,
    outputContractRequiresSuccessfulProcessingDefinition:
      contractResult.outputContractRequiresSuccessfulProcessingDefinition,
    outputContractRequiresFailureNoChargePolicy:
      contractResult.outputContractRequiresFailureNoChargePolicy,
    outputContractRequiresClearDocumentModeConsent:
      contractResult.outputContractRequiresClearDocumentModeConsent,

    allowedFutureSectionSummaryLabel:
      contractResult.allowedFutureSectionSummaryLabel,
    allowedFutureSectionTranslationLabel:
      contractResult.allowedFutureSectionTranslationLabel,
    allowedFutureSectionMeaningLabel:
      contractResult.allowedFutureSectionMeaningLabel,
    allowedFutureSectionUrgencyLabel:
      contractResult.allowedFutureSectionUrgencyLabel,
    allowedFutureSectionNextStepsLabel:
      contractResult.allowedFutureSectionNextStepsLabel,
    allowedFutureSectionWarningsLabel:
      contractResult.allowedFutureSectionWarningsLabel,
    allowedFutureSectionUncertaintyLabel:
      contractResult.allowedFutureSectionUncertaintyLabel,
    allowedFutureSectionEvidenceNotesLabel:
      contractResult.allowedFutureSectionEvidenceNotesLabel,

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

    exactDeadlineCalculationAuthorized:
      contractResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: contractResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: contractResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: contractResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      contractResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      contractResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: contractResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: contractResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: contractResult.publicRuntimeEnabled,
    persistenceUsed: contractResult.persistenceUsed,
    neverUserVisible: contractResult.neverUserVisible,

    finalReadinessAuditOnly: true,
    actualRealDocumentInputPerformed: false,
    actualRealDocumentProcessingPerformed: false,
    finalAuthorizationGranted: false,

    finalAuditCoversAuthorizationPlan: prereqAllPassed && prereqReady,
    finalAuditCoversContract: prereqAllPassed && prereqReady,
    finalAuditCoversRedactionPlan: prereqAllPassed && prereqReady,
    finalAuditCoversStructuredExtractionPlan: prereqAllPassed && prereqReady,
    finalAuditCoversEvidenceGateMappingPlan: prereqAllPassed && prereqReady,
    finalAuditCoversOcrAndStorageIsolationPlan: prereqAllPassed && prereqReady,
    finalAuditCoversUserVisibleOutputContract: prereqAllPassed && prereqReady,
    finalAuditCoversCommercialBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversFreeQaBypassGuard: prereqAllPassed && prereqReady,
    finalAuditCoversPaidDocumentModeBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversPrivacyAndStorageBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversLegalSafetyBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversNoPublicRuntimeBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversNoPersistenceBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversNoRealDocumentInputBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversNoUserVisibleOutputBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversNoLiveLlmRuntimeBoundary: prereqAllPassed && prereqReady,
    finalAuditCoversTamperCoverage: prereqAllPassed && prereqReady,

    finalReadinessRequiresAllPriorPhasesPassed: prereqAllPassed && prereqReady,
    finalReadinessRequiresSingleImportChain: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoExistingFileModification: prereqAllPassed && prereqReady,
    finalReadinessRequiresNo8x3AcRerun: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoOpenAiFetchEnvSdk: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoRuntimeSmartTalkPath: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoOcrRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoUploadRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoStorageRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoPersistenceRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoPublicRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoUserVisibleOutputRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoLegalDeadlineOutputRuntime: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoActualEvidenceEvaluation: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoActualClaimAuthorization: prereqAllPassed && prereqReady,
    finalReadinessRequiresNoActualDeadlineCalculation: prereqAllPassed && prereqReady,
    finalReadinessRequiresDeliveryDateForExactDeadline: prereqAllPassed && prereqReady,
    finalReadinessRequiresHumanReviewForHighRisk: prereqAllPassed && prereqReady,
    finalReadinessRequiresUncertaintyDisclosure: prereqAllPassed && prereqReady,
    finalReadinessRequiresMissingEvidenceDisclosure: prereqAllPassed && prereqReady,
    finalReadinessRequiresOcrConfidenceDisclosure: prereqAllPassed && prereqReady,
    finalReadinessRequiresPlainLanguageOutputContract: prereqAllPassed && prereqReady,
    finalReadinessRequiresUserSelectedLanguageOutputContract:
      prereqAllPassed && prereqReady,
    finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation:
      prereqAllPassed && prereqReady,
    finalReadinessRequiresFailureNoChargePolicy: prereqAllPassed && prereqReady,

    readyFor8x4IControlledRealDocumentPlanningClosureDecision:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical final readiness audit input ────────────────
  const auditValidation = validateFinalReadinessAuditInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const auditAccepted = auditValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4G checkId wrong", override: { prereqCheckId: "8.4F" } },
    { label: "8.4G allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentUserVisibleOutputContractAccepted false", override: { controlledRealDocumentUserVisibleOutputContractAccepted: false } },
    { label: "userVisibleOutputContractOnly false", override: { userVisibleOutputContractOnly: false } },
    { label: "actualUserVisibleOutputPerformed true", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualOcrPerformed true", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true", override: { actualAuditPersistencePerformed: true } },
    { label: "actualEvidenceEvaluationPerformed true", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true", override: { actualDeadlineCalculationPerformed: true } },
    { label: "outputContractRequiresPlainLanguageExplanation false", override: { outputContractRequiresPlainLanguageExplanation: false } },
    { label: "outputContractRequiresUserSelectedLanguage false", override: { outputContractRequiresUserSelectedLanguage: false } },
    { label: "outputContractRequiresUncertaintySection false", override: { outputContractRequiresUncertaintySection: false } },
    { label: "outputContractRequiresMissingEvidenceDisclosure false", override: { outputContractRequiresMissingEvidenceDisclosure: false } },
    { label: "outputContractRequiresOcrConfidenceDisclosure false", override: { outputContractRequiresOcrConfidenceDisclosure: false } },
    { label: "outputContractRequiresNoLegalAdviceClaim false", override: { outputContractRequiresNoLegalAdviceClaim: false } },
    { label: "outputContractRequiresNoLegalCertainty false", override: { outputContractRequiresNoLegalCertainty: false } },
    { label: "outputContractRequiresNoDeadlineInvention false", override: { outputContractRequiresNoDeadlineInvention: false } },
    { label: "outputContractRequiresDeliveryOrBekanntgabeDateExplicitness false", override: { outputContractRequiresDeliveryOrBekanntgabeDateExplicitness: false } },
    { label: "outputContractRequiresHumanReviewForHighRisk false", override: { outputContractRequiresHumanReviewForHighRisk: false } },
    { label: "outputContractRequiresFreeQuestionModeSeparation false", override: { outputContractRequiresFreeQuestionModeSeparation: false } },
    { label: "outputContractRequiresPaidDocumentModeSeparation false", override: { outputContractRequiresPaidDocumentModeSeparation: false } },
    { label: "outputContractRequiresDocumentBypassGuard false", override: { outputContractRequiresDocumentBypassGuard: false } },
    { label: "outputContractRequiresNoFullDocumentExplanationInFreeQa false", override: { outputContractRequiresNoFullDocumentExplanationInFreeQa: false } },
    { label: "outputContractRequiresPaymentBeforeFullDocumentExplanation false", override: { outputContractRequiresPaymentBeforeFullDocumentExplanation: false } },
    { label: "outputContractRequiresFailureNoChargePolicy false", override: { outputContractRequiresFailureNoChargePolicy: false } },
    { label: "allowedFutureSectionSummaryLabel wrong value", override: { allowedFutureSectionSummaryLabel: "WRONG" } },
    { label: "allowedFutureSectionTranslationLabel wrong value", override: { allowedFutureSectionTranslationLabel: "WRONG" } },
    { label: "allowedFutureSectionMeaningLabel wrong value", override: { allowedFutureSectionMeaningLabel: "WRONG" } },
    { label: "allowedFutureSectionUrgencyLabel wrong value", override: { allowedFutureSectionUrgencyLabel: "WRONG" } },
    { label: "allowedFutureSectionNextStepsLabel wrong value", override: { allowedFutureSectionNextStepsLabel: "WRONG" } },
    { label: "allowedFutureSectionWarningsLabel wrong value", override: { allowedFutureSectionWarningsLabel: "WRONG" } },
    { label: "allowedFutureSectionUncertaintyLabel wrong value", override: { allowedFutureSectionUncertaintyLabel: "WRONG" } },
    { label: "allowedFutureSectionEvidenceNotesLabel wrong value", override: { allowedFutureSectionEvidenceNotesLabel: "WRONG" } },
    { label: "readyFor8x4HControlledRealDocumentFinalReadinessAudit false", override: { readyFor8x4HControlledRealDocumentFinalReadinessAudit: false } },
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
    { label: "finalReadinessAuditOnly false", override: { finalReadinessAuditOnly: false } },
    { label: "actualRealDocumentInputPerformed true", override: { actualRealDocumentInputPerformed: true } },
    { label: "actualRealDocumentProcessingPerformed true", override: { actualRealDocumentProcessingPerformed: true } },
    { label: "actualOcrPerformed true (8.4H check)", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true (8.4H check)", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true (8.4H check)", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true (8.4H check)", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true (8.4H check)", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true (8.4H check)", override: { actualAuditPersistencePerformed: true } },
    { label: "actualUserVisibleOutputPerformed true (8.4H check)", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true (8.4H check)", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualEvidenceEvaluationPerformed true (8.4H check)", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true (8.4H check)", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true (8.4H check)", override: { actualDeadlineCalculationPerformed: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateFinalReadinessAuditInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    auditAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4H: controlled real-document final readiness audit layer — depends on completed 8.4G controlled real-document user-visible output contract",
    "8.4H audits the complete 8.4A–8.4G planning chain",
    "8.4H is audit/planning only — not final authorization",
    "no final authorization was granted",
    "no real document input or processing was performed",
    "no OCR, photo, file, storage, or persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.4H",
    "8.3AC was not re-run",
    "the commercial boundary Free Q&A vs Paid Document Mode remains required",
    "full document explanation requires Paid Document Mode",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.4I controlled real-document planning closure decision",
    "8.4I is still planning/closure only unless explicitly authorized later",
    `8.4G prerequisite: allPassed=${contractResult.allPassed}, readyFor8x4H=${contractResult.readyFor8x4HControlledRealDocumentFinalReadinessAudit}`,
    `final readiness audit input validation: ${auditAccepted ? "accepted" : "REJECTED"} — reasons: ${auditValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4H allPassed: true — controlled real-document final readiness audit accepted"
    );
    notes.push(
      "readyFor8x4IControlledRealDocumentPlanningClosureDecision: true — planning/audit only"
    );
  }

  return {
    checkId: "8.4H",
    allPassed,
    userVisibleOutputContractReadyForFinalReadinessAudit:
      canonicalInput.controlledRealDocumentUserVisibleOutputContractAccepted,
    controlledRealDocumentFinalReadinessAuditAccepted: allPassed,
    finalReadinessAuditOnly: true,
    tamperCasesRejected: allTamperRejected,

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
    finalAuthorizationGranted: false,

    finalAuditCoversAuthorizationPlan:
      canonicalInput.finalAuditCoversAuthorizationPlan,
    finalAuditCoversContract: canonicalInput.finalAuditCoversContract,
    finalAuditCoversRedactionPlan: canonicalInput.finalAuditCoversRedactionPlan,
    finalAuditCoversStructuredExtractionPlan:
      canonicalInput.finalAuditCoversStructuredExtractionPlan,
    finalAuditCoversEvidenceGateMappingPlan:
      canonicalInput.finalAuditCoversEvidenceGateMappingPlan,
    finalAuditCoversOcrAndStorageIsolationPlan:
      canonicalInput.finalAuditCoversOcrAndStorageIsolationPlan,
    finalAuditCoversUserVisibleOutputContract:
      canonicalInput.finalAuditCoversUserVisibleOutputContract,
    finalAuditCoversCommercialBoundary:
      canonicalInput.finalAuditCoversCommercialBoundary,
    finalAuditCoversFreeQaBypassGuard:
      canonicalInput.finalAuditCoversFreeQaBypassGuard,
    finalAuditCoversPaidDocumentModeBoundary:
      canonicalInput.finalAuditCoversPaidDocumentModeBoundary,
    finalAuditCoversPrivacyAndStorageBoundary:
      canonicalInput.finalAuditCoversPrivacyAndStorageBoundary,
    finalAuditCoversLegalSafetyBoundary:
      canonicalInput.finalAuditCoversLegalSafetyBoundary,
    finalAuditCoversNoPublicRuntimeBoundary:
      canonicalInput.finalAuditCoversNoPublicRuntimeBoundary,
    finalAuditCoversNoPersistenceBoundary:
      canonicalInput.finalAuditCoversNoPersistenceBoundary,
    finalAuditCoversNoRealDocumentInputBoundary:
      canonicalInput.finalAuditCoversNoRealDocumentInputBoundary,
    finalAuditCoversNoUserVisibleOutputBoundary:
      canonicalInput.finalAuditCoversNoUserVisibleOutputBoundary,
    finalAuditCoversNoLiveLlmRuntimeBoundary:
      canonicalInput.finalAuditCoversNoLiveLlmRuntimeBoundary,
    finalAuditCoversTamperCoverage: canonicalInput.finalAuditCoversTamperCoverage,

    finalReadinessRequiresAllPriorPhasesPassed:
      canonicalInput.finalReadinessRequiresAllPriorPhasesPassed,
    finalReadinessRequiresSingleImportChain:
      canonicalInput.finalReadinessRequiresSingleImportChain,
    finalReadinessRequiresNoExistingFileModification:
      canonicalInput.finalReadinessRequiresNoExistingFileModification,
    finalReadinessRequiresNo8x3AcRerun:
      canonicalInput.finalReadinessRequiresNo8x3AcRerun,
    finalReadinessRequiresNoOpenAiFetchEnvSdk:
      canonicalInput.finalReadinessRequiresNoOpenAiFetchEnvSdk,
    finalReadinessRequiresNoRuntimeSmartTalkPath:
      canonicalInput.finalReadinessRequiresNoRuntimeSmartTalkPath,
    finalReadinessRequiresNoOcrRuntime:
      canonicalInput.finalReadinessRequiresNoOcrRuntime,
    finalReadinessRequiresNoUploadRuntime:
      canonicalInput.finalReadinessRequiresNoUploadRuntime,
    finalReadinessRequiresNoStorageRuntime:
      canonicalInput.finalReadinessRequiresNoStorageRuntime,
    finalReadinessRequiresNoPersistenceRuntime:
      canonicalInput.finalReadinessRequiresNoPersistenceRuntime,
    finalReadinessRequiresNoPublicRuntime:
      canonicalInput.finalReadinessRequiresNoPublicRuntime,
    finalReadinessRequiresNoUserVisibleOutputRuntime:
      canonicalInput.finalReadinessRequiresNoUserVisibleOutputRuntime,
    finalReadinessRequiresNoLegalDeadlineOutputRuntime:
      canonicalInput.finalReadinessRequiresNoLegalDeadlineOutputRuntime,
    finalReadinessRequiresNoActualEvidenceEvaluation:
      canonicalInput.finalReadinessRequiresNoActualEvidenceEvaluation,
    finalReadinessRequiresNoActualClaimAuthorization:
      canonicalInput.finalReadinessRequiresNoActualClaimAuthorization,
    finalReadinessRequiresNoActualDeadlineCalculation:
      canonicalInput.finalReadinessRequiresNoActualDeadlineCalculation,
    finalReadinessRequiresDeliveryDateForExactDeadline:
      canonicalInput.finalReadinessRequiresDeliveryDateForExactDeadline,
    finalReadinessRequiresHumanReviewForHighRisk:
      canonicalInput.finalReadinessRequiresHumanReviewForHighRisk,
    finalReadinessRequiresUncertaintyDisclosure:
      canonicalInput.finalReadinessRequiresUncertaintyDisclosure,
    finalReadinessRequiresMissingEvidenceDisclosure:
      canonicalInput.finalReadinessRequiresMissingEvidenceDisclosure,
    finalReadinessRequiresOcrConfidenceDisclosure:
      canonicalInput.finalReadinessRequiresOcrConfidenceDisclosure,
    finalReadinessRequiresPlainLanguageOutputContract:
      canonicalInput.finalReadinessRequiresPlainLanguageOutputContract,
    finalReadinessRequiresUserSelectedLanguageOutputContract:
      canonicalInput.finalReadinessRequiresUserSelectedLanguageOutputContract,
    finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation:
      canonicalInput.finalReadinessRequiresPaidDocumentModeForFullDocumentExplanation,
    finalReadinessRequiresFailureNoChargePolicy:
      canonicalInput.finalReadinessRequiresFailureNoChargePolicy,

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

    readyFor8x4IControlledRealDocumentPlanningClosureDecision:
      canonicalInput.readyFor8x4IControlledRealDocumentPlanningClosureDecision,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
