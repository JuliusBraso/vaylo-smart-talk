/**
 * Phase 8.4E — Controlled Real Document Evidence Gate Mapping Plan.
 *
 * PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4D.
 *
 * This file defines how future structured extraction fields must map into
 * Evidence Gates before any interpretation, urgency, deadline, warning, or
 * next-step output. It is:
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR, photo, or file upload.
 *   - NOT document storage.
 *   - NOT public runtime.
 *   - NOT user-visible legal deadline output.
 *   - NOT persistence.
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
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize OCR/photo/file input.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentStructuredExtractionPlan } from "./run-controlled-real-document-structured-extraction-plan";

// ── Local evidence gate mapping input type ────────────────────────────────────

interface ControlledRealDocumentEvidenceGateMappingPlanInput {
  // 8.4D prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly redactionPlanReadyForStructuredExtractionPlan: boolean;
  readonly controlledRealDocumentStructuredExtractionPlanAccepted: boolean;
  readonly structuredExtractionPlanOnly: boolean;
  readonly readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: boolean;

  // 8.4D extraction-performed/authorized flags (must be false)
  readonly actualExtractionPerformed: boolean;
  readonly extractionFromRealDocumentAuthorizedNow: boolean;
  readonly rawDocumentExtractionAuthorizedNow: boolean;
  readonly redactedDocumentExtractionAuthorizedNow: boolean;
  readonly modelExtractionAuthorizedNow: boolean;
  readonly ocrExtractionAuthorizedNow: boolean;
  readonly storageExtractionAuthorizedNow: boolean;
  readonly userVisibleExtractionAuthorizedNow: boolean;

  // 8.4D structured extraction requirements (must remain true)
  readonly structuredExtractionRequiresPriorRedaction: boolean;
  readonly structuredExtractionRequiresPlaceholderMap: boolean;
  readonly structuredExtractionRequiresFieldAllowlist: boolean;
  readonly structuredExtractionRequiresSourceAnchors: boolean;
  readonly structuredExtractionRequiresConfidenceLabels: boolean;
  readonly structuredExtractionRequiresUnknownWhenMissing: boolean;
  readonly structuredExtractionRequiresNoInferenceFromAbsence: boolean;
  readonly structuredExtractionRequiresNoDeadlineCalculation: boolean;
  readonly structuredExtractionRequiresNoDeadlineInvention: boolean;
  readonly structuredExtractionRequiresNoLegalCertainty: boolean;
  readonly structuredExtractionRequiresNoCoerciveLegalInstruction: boolean;
  readonly structuredExtractionRequiresDateRoleSeparation: boolean;
  readonly structuredExtractionRequiresBekanntgabeExplicitness: boolean;
  readonly structuredExtractionRequiresDocumentTypeClassification: boolean;
  readonly structuredExtractionRequiresAuthorityNameHandling: boolean;
  readonly structuredExtractionRequiresDecisionDateHandling: boolean;
  readonly structuredExtractionRequiresResponseDeadlineCandidateHandling: boolean;
  readonly structuredExtractionRequiresPaymentDeadlineCandidateHandling: boolean;
  readonly structuredExtractionRequiresAppealInstructionDetection: boolean;
  readonly structuredExtractionRequiresObligationDetection: boolean;
  readonly structuredExtractionRequiresAmountDetection: boolean;
  readonly structuredExtractionRequiresReferenceIdTokenHandling: boolean;
  readonly structuredExtractionRequiresHumanReviewPolicy: boolean;
  readonly structuredExtractionRequiresAuditTrace: boolean;
  readonly structuredExtractionRequiresTamperCoverage: boolean;

  // 8.4D passthrough: all runtime "AuthorizedNow" must be false
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

  // 8.4D runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4E evidence gate mapping assertions
  readonly evidenceGateMappingPlanOnly: boolean;
  readonly actualEvidenceEvaluationPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualRealityAuthorizationPerformed: boolean;
  readonly actualTrapActivationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;
  readonly evidenceGateMappingRequiresPriorRedaction: boolean;
  readonly evidenceGateMappingRequiresStructuredExtraction: boolean;
  readonly evidenceGateMappingRequiresPlaceholderMap: boolean;
  readonly evidenceGateMappingRequiresFieldAllowlist: boolean;
  readonly evidenceGateMappingRequiresSourceAnchors: boolean;
  readonly evidenceGateMappingRequiresConfidenceLabels: boolean;
  readonly evidenceGateMappingRequiresUnknownWhenMissing: boolean;
  readonly evidenceGateMappingRequiresNoInferenceFromAbsence: boolean;
  readonly evidenceGateMappingRequiresCueToClaimSeparation: boolean;
  readonly evidenceGateMappingRequiresClaimToEvidenceSeparation: boolean;
  readonly evidenceGateMappingRequiresDateRoleSeparation: boolean;
  readonly evidenceGateMappingRequiresBekanntgabeExplicitness: boolean;
  readonly evidenceGateMappingRequiresDeliveryDateExplicitness: boolean;
  readonly evidenceGateMappingRequiresDecisionDateSeparation: boolean;
  readonly evidenceGateMappingRequiresResponseDeadlineCandidateSeparation: boolean;
  readonly evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation: boolean;
  readonly evidenceGateMappingRequiresAppealInstructionEvidence: boolean;
  readonly evidenceGateMappingRequiresObligationEvidence: boolean;
  readonly evidenceGateMappingRequiresAmountEvidence: boolean;
  readonly evidenceGateMappingRequiresAuthorityEvidence: boolean;
  readonly evidenceGateMappingRequiresReferenceIdTokenEvidence: boolean;
  readonly evidenceGateMappingRequiresDocumentTypeEvidence: boolean;
  readonly evidenceGateMappingRequiresMinimumEvidenceLevel: boolean;
  readonly evidenceGateMappingRequiresMissingEvidenceBlocksClaim: boolean;
  readonly evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty: boolean;
  readonly evidenceGateMappingRequiresNoDeadlineInvention: boolean;
  readonly evidenceGateMappingRequiresNoLegalCertainty: boolean;
  readonly evidenceGateMappingRequiresNoCoerciveLegalInstruction: boolean;
  readonly evidenceGateMappingRequiresHumanReviewPolicy: boolean;
  readonly evidenceGateMappingRequiresAuditTrace: boolean;
  readonly evidenceGateMappingRequiresTamperCoverage: boolean;
  readonly readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentEvidenceGateMappingPlanResult {
  readonly checkId: "8.4E";
  readonly allPassed: boolean;
  readonly structuredExtractionReadyForEvidenceGateMappingPlan: boolean;
  readonly controlledRealDocumentEvidenceGateMappingPlanAccepted: boolean;
  readonly evidenceGateMappingPlanOnly: true;
  readonly tamperCasesRejected: boolean;

  readonly actualEvidenceEvaluationPerformed: false;
  readonly actualClaimAuthorizationPerformed: false;
  readonly actualRealityAuthorizationPerformed: false;
  readonly actualTrapActivationPerformed: false;
  readonly actualDeadlineCalculationPerformed: false;

  readonly evidenceGateMappingRequiresPriorRedaction: boolean;
  readonly evidenceGateMappingRequiresStructuredExtraction: boolean;
  readonly evidenceGateMappingRequiresPlaceholderMap: boolean;
  readonly evidenceGateMappingRequiresFieldAllowlist: boolean;
  readonly evidenceGateMappingRequiresSourceAnchors: boolean;
  readonly evidenceGateMappingRequiresConfidenceLabels: boolean;
  readonly evidenceGateMappingRequiresUnknownWhenMissing: boolean;
  readonly evidenceGateMappingRequiresNoInferenceFromAbsence: boolean;
  readonly evidenceGateMappingRequiresCueToClaimSeparation: boolean;
  readonly evidenceGateMappingRequiresClaimToEvidenceSeparation: boolean;
  readonly evidenceGateMappingRequiresDateRoleSeparation: boolean;
  readonly evidenceGateMappingRequiresBekanntgabeExplicitness: boolean;
  readonly evidenceGateMappingRequiresDeliveryDateExplicitness: boolean;
  readonly evidenceGateMappingRequiresDecisionDateSeparation: boolean;
  readonly evidenceGateMappingRequiresResponseDeadlineCandidateSeparation: boolean;
  readonly evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation: boolean;
  readonly evidenceGateMappingRequiresAppealInstructionEvidence: boolean;
  readonly evidenceGateMappingRequiresObligationEvidence: boolean;
  readonly evidenceGateMappingRequiresAmountEvidence: boolean;
  readonly evidenceGateMappingRequiresAuthorityEvidence: boolean;
  readonly evidenceGateMappingRequiresReferenceIdTokenEvidence: boolean;
  readonly evidenceGateMappingRequiresDocumentTypeEvidence: boolean;
  readonly evidenceGateMappingRequiresMinimumEvidenceLevel: boolean;
  readonly evidenceGateMappingRequiresMissingEvidenceBlocksClaim: boolean;
  readonly evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty: boolean;
  readonly evidenceGateMappingRequiresNoDeadlineInvention: boolean;
  readonly evidenceGateMappingRequiresNoLegalCertainty: boolean;
  readonly evidenceGateMappingRequiresNoCoerciveLegalInstruction: boolean;
  readonly evidenceGateMappingRequiresHumanReviewPolicy: boolean;
  readonly evidenceGateMappingRequiresAuditTrace: boolean;
  readonly evidenceGateMappingRequiresTamperCoverage: boolean;

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

  readonly readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Evidence gate mapping input validator ─────────────────────────────────────

function validateEvidenceGateInput(
  g: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4D prerequisite gates
  if (g["prereqCheckId"] !== "8.4D")
    reasons.push("prereq_check_id_invalid");
  if (g["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (g["controlledRealDocumentStructuredExtractionPlanAccepted"] !== true)
    reasons.push("structured_extraction_plan_not_accepted");
  if (g["structuredExtractionPlanOnly"] !== true)
    reasons.push("structured_extraction_plan_only_false");
  if (g["readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan"] !== true)
    reasons.push("not_ready_for_8_4e_evidence_gate_mapping_plan");

  // 8.4D extraction-performed/authorized flags (must be false)
  if (g["actualExtractionPerformed"] !== false)
    reasons.push("actual_extraction_performed");
  if (g["extractionFromRealDocumentAuthorizedNow"] !== false)
    reasons.push("extraction_from_real_document_authorized_now");
  if (g["rawDocumentExtractionAuthorizedNow"] !== false)
    reasons.push("raw_document_extraction_authorized_now");
  if (g["redactedDocumentExtractionAuthorizedNow"] !== false)
    reasons.push("redacted_document_extraction_authorized_now");
  if (g["modelExtractionAuthorizedNow"] !== false)
    reasons.push("model_extraction_authorized_now");
  if (g["ocrExtractionAuthorizedNow"] !== false)
    reasons.push("ocr_extraction_authorized_now");
  if (g["storageExtractionAuthorizedNow"] !== false)
    reasons.push("storage_extraction_authorized_now");
  if (g["userVisibleExtractionAuthorizedNow"] !== false)
    reasons.push("user_visible_extraction_authorized_now");

  // 8.4D structured extraction requirements (must remain true)
  if (g["structuredExtractionRequiresPriorRedaction"] !== true)
    reasons.push("structured_extraction_requires_prior_redaction_false");
  if (g["structuredExtractionRequiresPlaceholderMap"] !== true)
    reasons.push("structured_extraction_requires_placeholder_map_false");
  if (g["structuredExtractionRequiresFieldAllowlist"] !== true)
    reasons.push("structured_extraction_requires_field_allowlist_false");
  if (g["structuredExtractionRequiresSourceAnchors"] !== true)
    reasons.push("structured_extraction_requires_source_anchors_false");
  if (g["structuredExtractionRequiresConfidenceLabels"] !== true)
    reasons.push("structured_extraction_requires_confidence_labels_false");
  if (g["structuredExtractionRequiresUnknownWhenMissing"] !== true)
    reasons.push("structured_extraction_requires_unknown_when_missing_false");
  if (g["structuredExtractionRequiresNoInferenceFromAbsence"] !== true)
    reasons.push("structured_extraction_requires_no_inference_from_absence_false");
  if (g["structuredExtractionRequiresNoDeadlineCalculation"] !== true)
    reasons.push("structured_extraction_requires_no_deadline_calculation_false");
  if (g["structuredExtractionRequiresNoDeadlineInvention"] !== true)
    reasons.push("structured_extraction_requires_no_deadline_invention_false");
  if (g["structuredExtractionRequiresNoLegalCertainty"] !== true)
    reasons.push("structured_extraction_requires_no_legal_certainty_false");
  if (g["structuredExtractionRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("structured_extraction_requires_no_coercive_legal_instruction_false");
  if (g["structuredExtractionRequiresDateRoleSeparation"] !== true)
    reasons.push("structured_extraction_requires_date_role_separation_false");
  if (g["structuredExtractionRequiresBekanntgabeExplicitness"] !== true)
    reasons.push("structured_extraction_requires_bekanntgabe_explicitness_false");
  if (g["structuredExtractionRequiresDocumentTypeClassification"] !== true)
    reasons.push("structured_extraction_requires_document_type_classification_false");
  if (g["structuredExtractionRequiresAuthorityNameHandling"] !== true)
    reasons.push("structured_extraction_requires_authority_name_handling_false");
  if (g["structuredExtractionRequiresDecisionDateHandling"] !== true)
    reasons.push("structured_extraction_requires_decision_date_handling_false");
  if (g["structuredExtractionRequiresResponseDeadlineCandidateHandling"] !== true)
    reasons.push("structured_extraction_requires_response_deadline_candidate_handling_false");
  if (g["structuredExtractionRequiresPaymentDeadlineCandidateHandling"] !== true)
    reasons.push("structured_extraction_requires_payment_deadline_candidate_handling_false");
  if (g["structuredExtractionRequiresAppealInstructionDetection"] !== true)
    reasons.push("structured_extraction_requires_appeal_instruction_detection_false");
  if (g["structuredExtractionRequiresObligationDetection"] !== true)
    reasons.push("structured_extraction_requires_obligation_detection_false");
  if (g["structuredExtractionRequiresAmountDetection"] !== true)
    reasons.push("structured_extraction_requires_amount_detection_false");
  if (g["structuredExtractionRequiresReferenceIdTokenHandling"] !== true)
    reasons.push("structured_extraction_requires_reference_id_token_handling_false");
  if (g["structuredExtractionRequiresHumanReviewPolicy"] !== true)
    reasons.push("structured_extraction_requires_human_review_policy_false");
  if (g["structuredExtractionRequiresAuditTrace"] !== true)
    reasons.push("structured_extraction_requires_audit_trace_false");
  if (g["structuredExtractionRequiresTamperCoverage"] !== true)
    reasons.push("structured_extraction_requires_tamper_coverage_false");

  // 8.4D passthrough: all runtime "AuthorizedNow" must be false
  if (g["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (g["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (g["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (g["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (g["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (g["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (g["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (g["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (g["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (g["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (g["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (g["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (g["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (g["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety invariants
  if (g["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (g["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (g["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (g["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (g["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (g["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_not_required");

  // 8.4D runtime/public invariants
  if (g["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (g["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (g["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (g["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (g["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.4E evidence gate mapping assertions
  if (g["evidenceGateMappingPlanOnly"] !== true)
    reasons.push("evidence_gate_mapping_plan_only_false");
  if (g["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed");
  if (g["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed");
  if (g["actualRealityAuthorizationPerformed"] !== false)
    reasons.push("actual_reality_authorization_performed");
  if (g["actualTrapActivationPerformed"] !== false)
    reasons.push("actual_trap_activation_performed");
  if (g["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed");
  if (g["evidenceGateMappingRequiresPriorRedaction"] !== true)
    reasons.push("evidence_gate_mapping_requires_prior_redaction_false");
  if (g["evidenceGateMappingRequiresStructuredExtraction"] !== true)
    reasons.push("evidence_gate_mapping_requires_structured_extraction_false");
  if (g["evidenceGateMappingRequiresPlaceholderMap"] !== true)
    reasons.push("evidence_gate_mapping_requires_placeholder_map_false");
  if (g["evidenceGateMappingRequiresFieldAllowlist"] !== true)
    reasons.push("evidence_gate_mapping_requires_field_allowlist_false");
  if (g["evidenceGateMappingRequiresSourceAnchors"] !== true)
    reasons.push("evidence_gate_mapping_requires_source_anchors_false");
  if (g["evidenceGateMappingRequiresConfidenceLabels"] !== true)
    reasons.push("evidence_gate_mapping_requires_confidence_labels_false");
  if (g["evidenceGateMappingRequiresUnknownWhenMissing"] !== true)
    reasons.push("evidence_gate_mapping_requires_unknown_when_missing_false");
  if (g["evidenceGateMappingRequiresNoInferenceFromAbsence"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_inference_from_absence_false");
  if (g["evidenceGateMappingRequiresCueToClaimSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_cue_to_claim_separation_false");
  if (g["evidenceGateMappingRequiresClaimToEvidenceSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_claim_to_evidence_separation_false");
  if (g["evidenceGateMappingRequiresDateRoleSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_date_role_separation_false");
  if (g["evidenceGateMappingRequiresBekanntgabeExplicitness"] !== true)
    reasons.push("evidence_gate_mapping_requires_bekanntgabe_explicitness_false");
  if (g["evidenceGateMappingRequiresDeliveryDateExplicitness"] !== true)
    reasons.push("evidence_gate_mapping_requires_delivery_date_explicitness_false");
  if (g["evidenceGateMappingRequiresDecisionDateSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_decision_date_separation_false");
  if (g["evidenceGateMappingRequiresResponseDeadlineCandidateSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_response_deadline_candidate_separation_false");
  if (g["evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_payment_deadline_candidate_separation_false");
  if (g["evidenceGateMappingRequiresAppealInstructionEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_appeal_instruction_evidence_false");
  if (g["evidenceGateMappingRequiresObligationEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_obligation_evidence_false");
  if (g["evidenceGateMappingRequiresAmountEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_amount_evidence_false");
  if (g["evidenceGateMappingRequiresAuthorityEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_authority_evidence_false");
  if (g["evidenceGateMappingRequiresReferenceIdTokenEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_reference_id_token_evidence_false");
  if (g["evidenceGateMappingRequiresDocumentTypeEvidence"] !== true)
    reasons.push("evidence_gate_mapping_requires_document_type_evidence_false");
  if (g["evidenceGateMappingRequiresMinimumEvidenceLevel"] !== true)
    reasons.push("evidence_gate_mapping_requires_minimum_evidence_level_false");
  if (g["evidenceGateMappingRequiresMissingEvidenceBlocksClaim"] !== true)
    reasons.push("evidence_gate_mapping_requires_missing_evidence_blocks_claim_false");
  if (g["evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty"] !== true)
    reasons.push("evidence_gate_mapping_requires_ambiguous_evidence_blocks_certainty_false");
  if (g["evidenceGateMappingRequiresNoDeadlineInvention"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_deadline_invention_false");
  if (g["evidenceGateMappingRequiresNoLegalCertainty"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_legal_certainty_false");
  if (g["evidenceGateMappingRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_coercive_legal_instruction_false");
  if (g["evidenceGateMappingRequiresHumanReviewPolicy"] !== true)
    reasons.push("evidence_gate_mapping_requires_human_review_policy_false");
  if (g["evidenceGateMappingRequiresAuditTrace"] !== true)
    reasons.push("evidence_gate_mapping_requires_audit_trace_false");
  if (g["evidenceGateMappingRequiresTamperCoverage"] !== true)
    reasons.push("evidence_gate_mapping_requires_tamper_coverage_false");
  if (g["readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan"] !== true)
    reasons.push("not_ready_for_8_4f_ocr_and_storage_isolation_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentEvidenceGateMappingPlan(): ControlledRealDocumentEvidenceGateMappingPlanResult {
  // ── Step 1: Obtain 8.4D structured extraction plan result ──────────────────
  const extractionResult = runControlledRealDocumentStructuredExtractionPlan();

  const prereqAllPassed = extractionResult.allPassed;
  const prereqReady =
    extractionResult.readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan;

  // ── Step 2: Build canonical evidence gate mapping input ────────────────────
  const canonicalInput: ControlledRealDocumentEvidenceGateMappingPlanInput = {
    prereqCheckId: extractionResult.checkId,
    prereqAllPassed,
    redactionPlanReadyForStructuredExtractionPlan:
      extractionResult.redactionPlanReadyForStructuredExtractionPlan,
    controlledRealDocumentStructuredExtractionPlanAccepted:
      extractionResult.controlledRealDocumentStructuredExtractionPlanAccepted,
    structuredExtractionPlanOnly: extractionResult.structuredExtractionPlanOnly,
    readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: prereqReady,

    actualExtractionPerformed: extractionResult.actualExtractionPerformed,
    extractionFromRealDocumentAuthorizedNow:
      extractionResult.extractionFromRealDocumentAuthorizedNow,
    rawDocumentExtractionAuthorizedNow:
      extractionResult.rawDocumentExtractionAuthorizedNow,
    redactedDocumentExtractionAuthorizedNow:
      extractionResult.redactedDocumentExtractionAuthorizedNow,
    modelExtractionAuthorizedNow: extractionResult.modelExtractionAuthorizedNow,
    ocrExtractionAuthorizedNow: extractionResult.ocrExtractionAuthorizedNow,
    storageExtractionAuthorizedNow:
      extractionResult.storageExtractionAuthorizedNow,
    userVisibleExtractionAuthorizedNow:
      extractionResult.userVisibleExtractionAuthorizedNow,

    structuredExtractionRequiresPriorRedaction:
      extractionResult.structuredExtractionRequiresPriorRedaction,
    structuredExtractionRequiresPlaceholderMap:
      extractionResult.structuredExtractionRequiresPlaceholderMap,
    structuredExtractionRequiresFieldAllowlist:
      extractionResult.structuredExtractionRequiresFieldAllowlist,
    structuredExtractionRequiresSourceAnchors:
      extractionResult.structuredExtractionRequiresSourceAnchors,
    structuredExtractionRequiresConfidenceLabels:
      extractionResult.structuredExtractionRequiresConfidenceLabels,
    structuredExtractionRequiresUnknownWhenMissing:
      extractionResult.structuredExtractionRequiresUnknownWhenMissing,
    structuredExtractionRequiresNoInferenceFromAbsence:
      extractionResult.structuredExtractionRequiresNoInferenceFromAbsence,
    structuredExtractionRequiresNoDeadlineCalculation:
      extractionResult.structuredExtractionRequiresNoDeadlineCalculation,
    structuredExtractionRequiresNoDeadlineInvention:
      extractionResult.structuredExtractionRequiresNoDeadlineInvention,
    structuredExtractionRequiresNoLegalCertainty:
      extractionResult.structuredExtractionRequiresNoLegalCertainty,
    structuredExtractionRequiresNoCoerciveLegalInstruction:
      extractionResult.structuredExtractionRequiresNoCoerciveLegalInstruction,
    structuredExtractionRequiresDateRoleSeparation:
      extractionResult.structuredExtractionRequiresDateRoleSeparation,
    structuredExtractionRequiresBekanntgabeExplicitness:
      extractionResult.structuredExtractionRequiresBekanntgabeExplicitness,
    structuredExtractionRequiresDocumentTypeClassification:
      extractionResult.structuredExtractionRequiresDocumentTypeClassification,
    structuredExtractionRequiresAuthorityNameHandling:
      extractionResult.structuredExtractionRequiresAuthorityNameHandling,
    structuredExtractionRequiresDecisionDateHandling:
      extractionResult.structuredExtractionRequiresDecisionDateHandling,
    structuredExtractionRequiresResponseDeadlineCandidateHandling:
      extractionResult.structuredExtractionRequiresResponseDeadlineCandidateHandling,
    structuredExtractionRequiresPaymentDeadlineCandidateHandling:
      extractionResult.structuredExtractionRequiresPaymentDeadlineCandidateHandling,
    structuredExtractionRequiresAppealInstructionDetection:
      extractionResult.structuredExtractionRequiresAppealInstructionDetection,
    structuredExtractionRequiresObligationDetection:
      extractionResult.structuredExtractionRequiresObligationDetection,
    structuredExtractionRequiresAmountDetection:
      extractionResult.structuredExtractionRequiresAmountDetection,
    structuredExtractionRequiresReferenceIdTokenHandling:
      extractionResult.structuredExtractionRequiresReferenceIdTokenHandling,
    structuredExtractionRequiresHumanReviewPolicy:
      extractionResult.structuredExtractionRequiresHumanReviewPolicy,
    structuredExtractionRequiresAuditTrace:
      extractionResult.structuredExtractionRequiresAuditTrace,
    structuredExtractionRequiresTamperCoverage:
      extractionResult.structuredExtractionRequiresTamperCoverage,

    realDocumentInputAuthorizedNow:
      extractionResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      extractionResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      extractionResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: extractionResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: extractionResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: extractionResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: extractionResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: extractionResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: extractionResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      extractionResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: extractionResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow:
      extractionResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: extractionResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow:
      extractionResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized:
      extractionResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized:
      extractionResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: extractionResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: extractionResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      extractionResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      extractionResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: extractionResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: extractionResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: extractionResult.publicRuntimeEnabled,
    persistenceUsed: extractionResult.persistenceUsed,
    neverUserVisible: extractionResult.neverUserVisible,

    evidenceGateMappingPlanOnly: true,
    actualEvidenceEvaluationPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualRealityAuthorizationPerformed: false,
    actualTrapActivationPerformed: false,
    actualDeadlineCalculationPerformed: false,
    evidenceGateMappingRequiresPriorRedaction: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresStructuredExtraction:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresPlaceholderMap: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresFieldAllowlist: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresSourceAnchors: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresConfidenceLabels: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresUnknownWhenMissing:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresNoInferenceFromAbsence:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresCueToClaimSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresClaimToEvidenceSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresDateRoleSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresBekanntgabeExplicitness:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresDeliveryDateExplicitness:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresDecisionDateSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresResponseDeadlineCandidateSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresAppealInstructionEvidence:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresObligationEvidence: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresAmountEvidence: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresAuthorityEvidence: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresReferenceIdTokenEvidence:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresDocumentTypeEvidence:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresMinimumEvidenceLevel:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresMissingEvidenceBlocksClaim:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresNoDeadlineInvention:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresNoLegalCertainty: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresNoCoerciveLegalInstruction:
      prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresHumanReviewPolicy: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresAuditTrace: prereqAllPassed && prereqReady,
    evidenceGateMappingRequiresTamperCoverage: prereqAllPassed && prereqReady,
    readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical evidence gate mapping input ─────────────────
  const gateValidation = validateEvidenceGateInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const gateAccepted = gateValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4D checkId wrong", override: { prereqCheckId: "8.4C" } },
    { label: "8.4D allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentStructuredExtractionPlanAccepted false", override: { controlledRealDocumentStructuredExtractionPlanAccepted: false } },
    { label: "structuredExtractionPlanOnly false", override: { structuredExtractionPlanOnly: false } },
    { label: "actualExtractionPerformed true", override: { actualExtractionPerformed: true } },
    { label: "extractionFromRealDocumentAuthorizedNow true", override: { extractionFromRealDocumentAuthorizedNow: true } },
    { label: "rawDocumentExtractionAuthorizedNow true", override: { rawDocumentExtractionAuthorizedNow: true } },
    { label: "redactedDocumentExtractionAuthorizedNow true", override: { redactedDocumentExtractionAuthorizedNow: true } },
    { label: "modelExtractionAuthorizedNow true", override: { modelExtractionAuthorizedNow: true } },
    { label: "ocrExtractionAuthorizedNow true", override: { ocrExtractionAuthorizedNow: true } },
    { label: "storageExtractionAuthorizedNow true", override: { storageExtractionAuthorizedNow: true } },
    { label: "userVisibleExtractionAuthorizedNow true", override: { userVisibleExtractionAuthorizedNow: true } },
    { label: "structuredExtractionRequiresPriorRedaction false", override: { structuredExtractionRequiresPriorRedaction: false } },
    { label: "structuredExtractionRequiresPlaceholderMap false", override: { structuredExtractionRequiresPlaceholderMap: false } },
    { label: "structuredExtractionRequiresFieldAllowlist false", override: { structuredExtractionRequiresFieldAllowlist: false } },
    { label: "structuredExtractionRequiresSourceAnchors false", override: { structuredExtractionRequiresSourceAnchors: false } },
    { label: "structuredExtractionRequiresConfidenceLabels false", override: { structuredExtractionRequiresConfidenceLabels: false } },
    { label: "structuredExtractionRequiresUnknownWhenMissing false", override: { structuredExtractionRequiresUnknownWhenMissing: false } },
    { label: "structuredExtractionRequiresNoInferenceFromAbsence false", override: { structuredExtractionRequiresNoInferenceFromAbsence: false } },
    { label: "structuredExtractionRequiresNoDeadlineCalculation false", override: { structuredExtractionRequiresNoDeadlineCalculation: false } },
    { label: "structuredExtractionRequiresNoDeadlineInvention false", override: { structuredExtractionRequiresNoDeadlineInvention: false } },
    { label: "structuredExtractionRequiresNoLegalCertainty false", override: { structuredExtractionRequiresNoLegalCertainty: false } },
    { label: "structuredExtractionRequiresNoCoerciveLegalInstruction false", override: { structuredExtractionRequiresNoCoerciveLegalInstruction: false } },
    { label: "structuredExtractionRequiresDateRoleSeparation false", override: { structuredExtractionRequiresDateRoleSeparation: false } },
    { label: "structuredExtractionRequiresBekanntgabeExplicitness false", override: { structuredExtractionRequiresBekanntgabeExplicitness: false } },
    { label: "structuredExtractionRequiresDocumentTypeClassification false", override: { structuredExtractionRequiresDocumentTypeClassification: false } },
    { label: "structuredExtractionRequiresAuthorityNameHandling false", override: { structuredExtractionRequiresAuthorityNameHandling: false } },
    { label: "structuredExtractionRequiresDecisionDateHandling false", override: { structuredExtractionRequiresDecisionDateHandling: false } },
    { label: "structuredExtractionRequiresResponseDeadlineCandidateHandling false", override: { structuredExtractionRequiresResponseDeadlineCandidateHandling: false } },
    { label: "structuredExtractionRequiresPaymentDeadlineCandidateHandling false", override: { structuredExtractionRequiresPaymentDeadlineCandidateHandling: false } },
    { label: "structuredExtractionRequiresAppealInstructionDetection false", override: { structuredExtractionRequiresAppealInstructionDetection: false } },
    { label: "structuredExtractionRequiresObligationDetection false", override: { structuredExtractionRequiresObligationDetection: false } },
    { label: "structuredExtractionRequiresAmountDetection false", override: { structuredExtractionRequiresAmountDetection: false } },
    { label: "structuredExtractionRequiresReferenceIdTokenHandling false", override: { structuredExtractionRequiresReferenceIdTokenHandling: false } },
    { label: "structuredExtractionRequiresHumanReviewPolicy false", override: { structuredExtractionRequiresHumanReviewPolicy: false } },
    { label: "structuredExtractionRequiresAuditTrace false", override: { structuredExtractionRequiresAuditTrace: false } },
    { label: "structuredExtractionRequiresTamperCoverage false", override: { structuredExtractionRequiresTamperCoverage: false } },
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
    { label: "readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan false", override: { readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "evidenceGateMappingPlanOnly false", override: { evidenceGateMappingPlanOnly: false } },
    { label: "actualEvidenceEvaluationPerformed true", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualRealityAuthorizationPerformed true", override: { actualRealityAuthorizationPerformed: true } },
    { label: "actualTrapActivationPerformed true", override: { actualTrapActivationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true", override: { actualDeadlineCalculationPerformed: true } },
    { label: "evidenceGateMappingRequiresPriorRedaction false", override: { evidenceGateMappingRequiresPriorRedaction: false } },
    { label: "evidenceGateMappingRequiresStructuredExtraction false", override: { evidenceGateMappingRequiresStructuredExtraction: false } },
    { label: "evidenceGateMappingRequiresPlaceholderMap false", override: { evidenceGateMappingRequiresPlaceholderMap: false } },
    { label: "evidenceGateMappingRequiresFieldAllowlist false", override: { evidenceGateMappingRequiresFieldAllowlist: false } },
    { label: "evidenceGateMappingRequiresSourceAnchors false", override: { evidenceGateMappingRequiresSourceAnchors: false } },
    { label: "evidenceGateMappingRequiresConfidenceLabels false", override: { evidenceGateMappingRequiresConfidenceLabels: false } },
    { label: "evidenceGateMappingRequiresUnknownWhenMissing false", override: { evidenceGateMappingRequiresUnknownWhenMissing: false } },
    { label: "evidenceGateMappingRequiresNoInferenceFromAbsence false", override: { evidenceGateMappingRequiresNoInferenceFromAbsence: false } },
    { label: "evidenceGateMappingRequiresCueToClaimSeparation false", override: { evidenceGateMappingRequiresCueToClaimSeparation: false } },
    { label: "evidenceGateMappingRequiresClaimToEvidenceSeparation false", override: { evidenceGateMappingRequiresClaimToEvidenceSeparation: false } },
    { label: "evidenceGateMappingRequiresDateRoleSeparation false", override: { evidenceGateMappingRequiresDateRoleSeparation: false } },
    { label: "evidenceGateMappingRequiresBekanntgabeExplicitness false", override: { evidenceGateMappingRequiresBekanntgabeExplicitness: false } },
    { label: "evidenceGateMappingRequiresDeliveryDateExplicitness false", override: { evidenceGateMappingRequiresDeliveryDateExplicitness: false } },
    { label: "evidenceGateMappingRequiresDecisionDateSeparation false", override: { evidenceGateMappingRequiresDecisionDateSeparation: false } },
    { label: "evidenceGateMappingRequiresResponseDeadlineCandidateSeparation false", override: { evidenceGateMappingRequiresResponseDeadlineCandidateSeparation: false } },
    { label: "evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation false", override: { evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation: false } },
    { label: "evidenceGateMappingRequiresAppealInstructionEvidence false", override: { evidenceGateMappingRequiresAppealInstructionEvidence: false } },
    { label: "evidenceGateMappingRequiresObligationEvidence false", override: { evidenceGateMappingRequiresObligationEvidence: false } },
    { label: "evidenceGateMappingRequiresAmountEvidence false", override: { evidenceGateMappingRequiresAmountEvidence: false } },
    { label: "evidenceGateMappingRequiresAuthorityEvidence false", override: { evidenceGateMappingRequiresAuthorityEvidence: false } },
    { label: "evidenceGateMappingRequiresReferenceIdTokenEvidence false", override: { evidenceGateMappingRequiresReferenceIdTokenEvidence: false } },
    { label: "evidenceGateMappingRequiresDocumentTypeEvidence false", override: { evidenceGateMappingRequiresDocumentTypeEvidence: false } },
    { label: "evidenceGateMappingRequiresMinimumEvidenceLevel false", override: { evidenceGateMappingRequiresMinimumEvidenceLevel: false } },
    { label: "evidenceGateMappingRequiresMissingEvidenceBlocksClaim false", override: { evidenceGateMappingRequiresMissingEvidenceBlocksClaim: false } },
    { label: "evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty false", override: { evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty: false } },
    { label: "evidenceGateMappingRequiresNoDeadlineInvention false", override: { evidenceGateMappingRequiresNoDeadlineInvention: false } },
    { label: "evidenceGateMappingRequiresNoLegalCertainty false", override: { evidenceGateMappingRequiresNoLegalCertainty: false } },
    { label: "evidenceGateMappingRequiresNoCoerciveLegalInstruction false", override: { evidenceGateMappingRequiresNoCoerciveLegalInstruction: false } },
    { label: "evidenceGateMappingRequiresHumanReviewPolicy false", override: { evidenceGateMappingRequiresHumanReviewPolicy: false } },
    { label: "evidenceGateMappingRequiresAuditTrace false", override: { evidenceGateMappingRequiresAuditTrace: false } },
    { label: "evidenceGateMappingRequiresTamperCoverage false", override: { evidenceGateMappingRequiresTamperCoverage: false } },
    { label: "readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan false", override: { readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateEvidenceGateInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    gateAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4E: controlled real-document evidence gate mapping plan layer — depends on completed 8.4D controlled real-document structured extraction plan",
    "8.4E is planning only — not real document input or processing",
    "no actual evidence evaluation was performed",
    "no claim authorization was performed",
    "no reality authorization was performed",
    "no trap activation was performed",
    "no deadline calculation was performed",
    "no live LLM call was performed in 8.4E",
    "8.3AC was not re-run",
    "no real document, OCR, photo, file upload, document storage, persistence, public runtime, or user-visible output was authorized",
    "evidence mapping requires prior redaction and structured extraction",
    "cue hits, claims, and evidence gates must remain separated",
    "missing evidence must block claims",
    "ambiguous evidence must block certainty",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.4F controlled real-document OCR and storage isolation plan",
    "8.4F is still planning only unless explicitly authorized later",
    `8.4D prerequisite: allPassed=${extractionResult.allPassed}, readyFor8x4E=${extractionResult.readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan}`,
    `evidence gate mapping input validation: ${gateAccepted ? "accepted" : "REJECTED"} — reasons: ${gateValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4E allPassed: true — controlled real-document evidence gate mapping plan accepted"
    );
    notes.push(
      "readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: true — planning only"
    );
  }

  return {
    checkId: "8.4E",
    allPassed,
    structuredExtractionReadyForEvidenceGateMappingPlan:
      canonicalInput.controlledRealDocumentStructuredExtractionPlanAccepted,
    controlledRealDocumentEvidenceGateMappingPlanAccepted: allPassed,
    evidenceGateMappingPlanOnly: true,
    tamperCasesRejected: allTamperRejected,

    actualEvidenceEvaluationPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualRealityAuthorizationPerformed: false,
    actualTrapActivationPerformed: false,
    actualDeadlineCalculationPerformed: false,

    evidenceGateMappingRequiresPriorRedaction:
      canonicalInput.evidenceGateMappingRequiresPriorRedaction,
    evidenceGateMappingRequiresStructuredExtraction:
      canonicalInput.evidenceGateMappingRequiresStructuredExtraction,
    evidenceGateMappingRequiresPlaceholderMap:
      canonicalInput.evidenceGateMappingRequiresPlaceholderMap,
    evidenceGateMappingRequiresFieldAllowlist:
      canonicalInput.evidenceGateMappingRequiresFieldAllowlist,
    evidenceGateMappingRequiresSourceAnchors:
      canonicalInput.evidenceGateMappingRequiresSourceAnchors,
    evidenceGateMappingRequiresConfidenceLabels:
      canonicalInput.evidenceGateMappingRequiresConfidenceLabels,
    evidenceGateMappingRequiresUnknownWhenMissing:
      canonicalInput.evidenceGateMappingRequiresUnknownWhenMissing,
    evidenceGateMappingRequiresNoInferenceFromAbsence:
      canonicalInput.evidenceGateMappingRequiresNoInferenceFromAbsence,
    evidenceGateMappingRequiresCueToClaimSeparation:
      canonicalInput.evidenceGateMappingRequiresCueToClaimSeparation,
    evidenceGateMappingRequiresClaimToEvidenceSeparation:
      canonicalInput.evidenceGateMappingRequiresClaimToEvidenceSeparation,
    evidenceGateMappingRequiresDateRoleSeparation:
      canonicalInput.evidenceGateMappingRequiresDateRoleSeparation,
    evidenceGateMappingRequiresBekanntgabeExplicitness:
      canonicalInput.evidenceGateMappingRequiresBekanntgabeExplicitness,
    evidenceGateMappingRequiresDeliveryDateExplicitness:
      canonicalInput.evidenceGateMappingRequiresDeliveryDateExplicitness,
    evidenceGateMappingRequiresDecisionDateSeparation:
      canonicalInput.evidenceGateMappingRequiresDecisionDateSeparation,
    evidenceGateMappingRequiresResponseDeadlineCandidateSeparation:
      canonicalInput.evidenceGateMappingRequiresResponseDeadlineCandidateSeparation,
    evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation:
      canonicalInput.evidenceGateMappingRequiresPaymentDeadlineCandidateSeparation,
    evidenceGateMappingRequiresAppealInstructionEvidence:
      canonicalInput.evidenceGateMappingRequiresAppealInstructionEvidence,
    evidenceGateMappingRequiresObligationEvidence:
      canonicalInput.evidenceGateMappingRequiresObligationEvidence,
    evidenceGateMappingRequiresAmountEvidence:
      canonicalInput.evidenceGateMappingRequiresAmountEvidence,
    evidenceGateMappingRequiresAuthorityEvidence:
      canonicalInput.evidenceGateMappingRequiresAuthorityEvidence,
    evidenceGateMappingRequiresReferenceIdTokenEvidence:
      canonicalInput.evidenceGateMappingRequiresReferenceIdTokenEvidence,
    evidenceGateMappingRequiresDocumentTypeEvidence:
      canonicalInput.evidenceGateMappingRequiresDocumentTypeEvidence,
    evidenceGateMappingRequiresMinimumEvidenceLevel:
      canonicalInput.evidenceGateMappingRequiresMinimumEvidenceLevel,
    evidenceGateMappingRequiresMissingEvidenceBlocksClaim:
      canonicalInput.evidenceGateMappingRequiresMissingEvidenceBlocksClaim,
    evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty:
      canonicalInput.evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty,
    evidenceGateMappingRequiresNoDeadlineInvention:
      canonicalInput.evidenceGateMappingRequiresNoDeadlineInvention,
    evidenceGateMappingRequiresNoLegalCertainty:
      canonicalInput.evidenceGateMappingRequiresNoLegalCertainty,
    evidenceGateMappingRequiresNoCoerciveLegalInstruction:
      canonicalInput.evidenceGateMappingRequiresNoCoerciveLegalInstruction,
    evidenceGateMappingRequiresHumanReviewPolicy:
      canonicalInput.evidenceGateMappingRequiresHumanReviewPolicy,
    evidenceGateMappingRequiresAuditTrace:
      canonicalInput.evidenceGateMappingRequiresAuditTrace,
    evidenceGateMappingRequiresTamperCoverage:
      canonicalInput.evidenceGateMappingRequiresTamperCoverage,

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

    readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan:
      canonicalInput.readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
