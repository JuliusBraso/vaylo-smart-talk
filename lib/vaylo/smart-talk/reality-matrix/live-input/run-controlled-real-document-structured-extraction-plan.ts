/**
 * Phase 8.4D — Controlled Real Document Structured Extraction Plan.
 *
 * PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4C.
 *
 * This file defines the mandatory structured extraction plan for any future
 * controlled real-document path after redaction. It is:
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR, photo, or file upload.
 *   - NOT document storage.
 *   - NOT public runtime.
 *   - NOT user-visible legal deadline output.
 *   - NOT persistence.
 *   - NOT actual extraction from a real document.
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

import { runControlledRealDocumentRedactionPlan } from "./run-controlled-real-document-redaction-plan";

// ── Local structured extraction input type ────────────────────────────────────

interface ControlledRealDocumentStructuredExtractionPlanInput {
  // 8.4C prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly contractReadyForRedactionPlan: boolean;
  readonly controlledRealDocumentRedactionPlanAccepted: boolean;
  readonly redactionPlanOnly: boolean;
  readonly readyFor8x4DControlledRealDocumentStructuredExtractionPlan: boolean;

  // 8.4C redaction readiness flags (must remain true)
  readonly redactionRequiredBeforeAnyModelUse: boolean;
  readonly redactionRequiredBeforeAnyLLMCall: boolean;
  readonly redactionRequiredBeforeAnyStorage: boolean;
  readonly redactionRequiredBeforeAnyUserVisibleOutput: boolean;
  readonly redactionRequiredBeforeAnyAuditExport: boolean;
  readonly rawDocumentMustRemainUnavailableToModel: boolean;
  readonly rawDocumentMustRemainUnavailableToUserVisibleOutput: boolean;
  readonly rawDocumentMustRemainUnavailableToPersistence: boolean;

  // 8.4C passthrough: all "AuthorizedNow" must be false
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

  // 8.4C redaction requirements (must remain true)
  readonly redactionRequiresNameRemoval: boolean;
  readonly redactionRequiresAddressRemoval: boolean;
  readonly redactionRequiresPhoneRemoval: boolean;
  readonly redactionRequiresEmailRemoval: boolean;
  readonly redactionRequiresAktenzeichenRemovalOrTokenization: boolean;
  readonly redactionRequiresVersicherungsnummerRemovalOrTokenization: boolean;
  readonly redactionRequiresKundennummerRemovalOrTokenization: boolean;
  readonly redactionRequiresSteuernummerRemovalOrTokenization: boolean;
  readonly redactionRequiresIBANRemovalOrTokenization: boolean;
  readonly redactionRequiresQrCodeRemoval: boolean;
  readonly redactionRequiresSignatureRemoval: boolean;
  readonly redactionRequiresBarcodeRemoval: boolean;
  readonly redactionRequiresOfficialSealHandling: boolean;
  readonly redactionRequiresDocumentDatePreservationPolicy: boolean;
  readonly redactionRequiresDeadlineDateSourceSeparation: boolean;
  readonly redactionRequiresBekanntgabeDateExplicitness: boolean;
  readonly redactionRequiresNoDeadlineInvention: boolean;
  readonly redactionRequiresNoLegalCertainty: boolean;
  readonly redactionRequiresNoCoerciveLegalInstruction: boolean;
  readonly redactionRequiresStructuredPlaceholderMap: boolean;
  readonly redactionRequiresReversibilityPolicy: boolean;
  readonly redactionRequiresAuditTrace: boolean;
  readonly redactionRequiresTamperCoverage: boolean;
  readonly redactionRequiresHumanReviewPolicy: boolean;

  // 8.4C runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4D structured extraction assertions
  readonly structuredExtractionPlanOnly: boolean;
  readonly actualExtractionPerformed: boolean;
  readonly extractionFromRealDocumentAuthorizedNow: boolean;
  readonly rawDocumentExtractionAuthorizedNow: boolean;
  readonly redactedDocumentExtractionAuthorizedNow: boolean;
  readonly modelExtractionAuthorizedNow: boolean;
  readonly ocrExtractionAuthorizedNow: boolean;
  readonly storageExtractionAuthorizedNow: boolean;
  readonly userVisibleExtractionAuthorizedNow: boolean;
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
  readonly readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentStructuredExtractionPlanResult {
  readonly checkId: "8.4D";
  readonly allPassed: boolean;
  readonly redactionPlanReadyForStructuredExtractionPlan: boolean;
  readonly controlledRealDocumentStructuredExtractionPlanAccepted: boolean;
  readonly structuredExtractionPlanOnly: true;
  readonly tamperCasesRejected: boolean;

  readonly actualExtractionPerformed: false;
  readonly extractionFromRealDocumentAuthorizedNow: false;
  readonly rawDocumentExtractionAuthorizedNow: false;
  readonly redactedDocumentExtractionAuthorizedNow: false;
  readonly modelExtractionAuthorizedNow: false;
  readonly ocrExtractionAuthorizedNow: false;
  readonly storageExtractionAuthorizedNow: false;
  readonly userVisibleExtractionAuthorizedNow: false;

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

  readonly readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Structured extraction input validator ─────────────────────────────────────

function validateExtractionInput(
  e: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4C prerequisite gates
  if (e["prereqCheckId"] !== "8.4C")
    reasons.push("prereq_check_id_invalid");
  if (e["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (e["controlledRealDocumentRedactionPlanAccepted"] !== true)
    reasons.push("redaction_plan_not_accepted");
  if (e["redactionPlanOnly"] !== true)
    reasons.push("redaction_plan_only_false");
  if (e["readyFor8x4DControlledRealDocumentStructuredExtractionPlan"] !== true)
    reasons.push("not_ready_for_8_4d_structured_extraction_plan");

  // 8.4C redaction readiness flags
  if (e["redactionRequiredBeforeAnyModelUse"] !== true)
    reasons.push("redaction_required_before_any_model_use_false");
  if (e["redactionRequiredBeforeAnyLLMCall"] !== true)
    reasons.push("redaction_required_before_any_llm_call_false");
  if (e["redactionRequiredBeforeAnyStorage"] !== true)
    reasons.push("redaction_required_before_any_storage_false");
  if (e["redactionRequiredBeforeAnyUserVisibleOutput"] !== true)
    reasons.push("redaction_required_before_any_user_visible_output_false");
  if (e["redactionRequiredBeforeAnyAuditExport"] !== true)
    reasons.push("redaction_required_before_any_audit_export_false");
  if (e["rawDocumentMustRemainUnavailableToModel"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_model_false");
  if (e["rawDocumentMustRemainUnavailableToUserVisibleOutput"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_user_visible_output_false");
  if (e["rawDocumentMustRemainUnavailableToPersistence"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_persistence_false");

  // 8.4C passthrough: all "AuthorizedNow" must be false
  if (e["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (e["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (e["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (e["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (e["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (e["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (e["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (e["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (e["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (e["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (e["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (e["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (e["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (e["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety invariants
  if (e["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (e["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (e["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (e["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (e["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (e["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_not_required");

  // 8.4C redaction requirements
  if (e["redactionRequiresNameRemoval"] !== true)
    reasons.push("redaction_requires_name_removal_false");
  if (e["redactionRequiresAddressRemoval"] !== true)
    reasons.push("redaction_requires_address_removal_false");
  if (e["redactionRequiresPhoneRemoval"] !== true)
    reasons.push("redaction_requires_phone_removal_false");
  if (e["redactionRequiresEmailRemoval"] !== true)
    reasons.push("redaction_requires_email_removal_false");
  if (e["redactionRequiresAktenzeichenRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_aktenzeichen_false");
  if (e["redactionRequiresVersicherungsnummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_versicherungsnummer_false");
  if (e["redactionRequiresKundennummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_kundennummer_false");
  if (e["redactionRequiresSteuernummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_steuernummer_false");
  if (e["redactionRequiresIBANRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_iban_false");
  if (e["redactionRequiresQrCodeRemoval"] !== true)
    reasons.push("redaction_requires_qr_code_removal_false");
  if (e["redactionRequiresSignatureRemoval"] !== true)
    reasons.push("redaction_requires_signature_removal_false");
  if (e["redactionRequiresBarcodeRemoval"] !== true)
    reasons.push("redaction_requires_barcode_removal_false");
  if (e["redactionRequiresOfficialSealHandling"] !== true)
    reasons.push("redaction_requires_official_seal_handling_false");
  if (e["redactionRequiresDocumentDatePreservationPolicy"] !== true)
    reasons.push("redaction_requires_document_date_preservation_policy_false");
  if (e["redactionRequiresDeadlineDateSourceSeparation"] !== true)
    reasons.push("redaction_requires_deadline_date_source_separation_false");
  if (e["redactionRequiresBekanntgabeDateExplicitness"] !== true)
    reasons.push("redaction_requires_bekanntgabe_date_explicitness_false");
  if (e["redactionRequiresNoDeadlineInvention"] !== true)
    reasons.push("redaction_requires_no_deadline_invention_false");
  if (e["redactionRequiresNoLegalCertainty"] !== true)
    reasons.push("redaction_requires_no_legal_certainty_false");
  if (e["redactionRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("redaction_requires_no_coercive_legal_instruction_false");
  if (e["redactionRequiresStructuredPlaceholderMap"] !== true)
    reasons.push("redaction_requires_structured_placeholder_map_false");
  if (e["redactionRequiresReversibilityPolicy"] !== true)
    reasons.push("redaction_requires_reversibility_policy_false");
  if (e["redactionRequiresAuditTrace"] !== true)
    reasons.push("redaction_requires_audit_trace_false");
  if (e["redactionRequiresTamperCoverage"] !== true)
    reasons.push("redaction_requires_tamper_coverage_false");
  if (e["redactionRequiresHumanReviewPolicy"] !== true)
    reasons.push("redaction_requires_human_review_policy_false");

  // 8.4C runtime/public invariants
  if (e["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (e["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (e["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (e["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (e["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.4D assertions
  if (e["structuredExtractionPlanOnly"] !== true)
    reasons.push("structured_extraction_plan_only_false");
  if (e["actualExtractionPerformed"] !== false)
    reasons.push("actual_extraction_performed");
  if (e["extractionFromRealDocumentAuthorizedNow"] !== false)
    reasons.push("extraction_from_real_document_authorized_now");
  if (e["rawDocumentExtractionAuthorizedNow"] !== false)
    reasons.push("raw_document_extraction_authorized_now");
  if (e["redactedDocumentExtractionAuthorizedNow"] !== false)
    reasons.push("redacted_document_extraction_authorized_now");
  if (e["modelExtractionAuthorizedNow"] !== false)
    reasons.push("model_extraction_authorized_now");
  if (e["ocrExtractionAuthorizedNow"] !== false)
    reasons.push("ocr_extraction_authorized_now");
  if (e["storageExtractionAuthorizedNow"] !== false)
    reasons.push("storage_extraction_authorized_now");
  if (e["userVisibleExtractionAuthorizedNow"] !== false)
    reasons.push("user_visible_extraction_authorized_now");
  if (e["structuredExtractionRequiresPriorRedaction"] !== true)
    reasons.push("structured_extraction_requires_prior_redaction_false");
  if (e["structuredExtractionRequiresPlaceholderMap"] !== true)
    reasons.push("structured_extraction_requires_placeholder_map_false");
  if (e["structuredExtractionRequiresFieldAllowlist"] !== true)
    reasons.push("structured_extraction_requires_field_allowlist_false");
  if (e["structuredExtractionRequiresSourceAnchors"] !== true)
    reasons.push("structured_extraction_requires_source_anchors_false");
  if (e["structuredExtractionRequiresConfidenceLabels"] !== true)
    reasons.push("structured_extraction_requires_confidence_labels_false");
  if (e["structuredExtractionRequiresUnknownWhenMissing"] !== true)
    reasons.push("structured_extraction_requires_unknown_when_missing_false");
  if (e["structuredExtractionRequiresNoInferenceFromAbsence"] !== true)
    reasons.push("structured_extraction_requires_no_inference_from_absence_false");
  if (e["structuredExtractionRequiresNoDeadlineCalculation"] !== true)
    reasons.push("structured_extraction_requires_no_deadline_calculation_false");
  if (e["structuredExtractionRequiresNoDeadlineInvention"] !== true)
    reasons.push("structured_extraction_requires_no_deadline_invention_false");
  if (e["structuredExtractionRequiresNoLegalCertainty"] !== true)
    reasons.push("structured_extraction_requires_no_legal_certainty_false");
  if (e["structuredExtractionRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("structured_extraction_requires_no_coercive_legal_instruction_false");
  if (e["structuredExtractionRequiresDateRoleSeparation"] !== true)
    reasons.push("structured_extraction_requires_date_role_separation_false");
  if (e["structuredExtractionRequiresBekanntgabeExplicitness"] !== true)
    reasons.push("structured_extraction_requires_bekanntgabe_explicitness_false");
  if (e["structuredExtractionRequiresDocumentTypeClassification"] !== true)
    reasons.push("structured_extraction_requires_document_type_classification_false");
  if (e["structuredExtractionRequiresAuthorityNameHandling"] !== true)
    reasons.push("structured_extraction_requires_authority_name_handling_false");
  if (e["structuredExtractionRequiresDecisionDateHandling"] !== true)
    reasons.push("structured_extraction_requires_decision_date_handling_false");
  if (e["structuredExtractionRequiresResponseDeadlineCandidateHandling"] !== true)
    reasons.push("structured_extraction_requires_response_deadline_candidate_handling_false");
  if (e["structuredExtractionRequiresPaymentDeadlineCandidateHandling"] !== true)
    reasons.push("structured_extraction_requires_payment_deadline_candidate_handling_false");
  if (e["structuredExtractionRequiresAppealInstructionDetection"] !== true)
    reasons.push("structured_extraction_requires_appeal_instruction_detection_false");
  if (e["structuredExtractionRequiresObligationDetection"] !== true)
    reasons.push("structured_extraction_requires_obligation_detection_false");
  if (e["structuredExtractionRequiresAmountDetection"] !== true)
    reasons.push("structured_extraction_requires_amount_detection_false");
  if (e["structuredExtractionRequiresReferenceIdTokenHandling"] !== true)
    reasons.push("structured_extraction_requires_reference_id_token_handling_false");
  if (e["structuredExtractionRequiresHumanReviewPolicy"] !== true)
    reasons.push("structured_extraction_requires_human_review_policy_false");
  if (e["structuredExtractionRequiresAuditTrace"] !== true)
    reasons.push("structured_extraction_requires_audit_trace_false");
  if (e["structuredExtractionRequiresTamperCoverage"] !== true)
    reasons.push("structured_extraction_requires_tamper_coverage_false");
  if (e["readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan"] !== true)
    reasons.push("not_ready_for_8_4e_evidence_gate_mapping_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentStructuredExtractionPlan(): ControlledRealDocumentStructuredExtractionPlanResult {
  // ── Step 1: Obtain 8.4C redaction plan result ──────────────────────────────
  const redactionResult = runControlledRealDocumentRedactionPlan();

  const prereqAllPassed = redactionResult.allPassed;
  const prereqReady =
    redactionResult.readyFor8x4DControlledRealDocumentStructuredExtractionPlan;

  // ── Step 2: Build canonical structured extraction input ────────────────────
  const canonicalInput: ControlledRealDocumentStructuredExtractionPlanInput = {
    prereqCheckId: redactionResult.checkId,
    prereqAllPassed,
    contractReadyForRedactionPlan: redactionResult.contractReadyForRedactionPlan,
    controlledRealDocumentRedactionPlanAccepted:
      redactionResult.controlledRealDocumentRedactionPlanAccepted,
    redactionPlanOnly: redactionResult.redactionPlanOnly,
    readyFor8x4DControlledRealDocumentStructuredExtractionPlan: prereqReady,

    redactionRequiredBeforeAnyModelUse:
      redactionResult.redactionRequiredBeforeAnyModelUse,
    redactionRequiredBeforeAnyLLMCall:
      redactionResult.redactionRequiredBeforeAnyLLMCall,
    redactionRequiredBeforeAnyStorage:
      redactionResult.redactionRequiredBeforeAnyStorage,
    redactionRequiredBeforeAnyUserVisibleOutput:
      redactionResult.redactionRequiredBeforeAnyUserVisibleOutput,
    redactionRequiredBeforeAnyAuditExport:
      redactionResult.redactionRequiredBeforeAnyAuditExport,
    rawDocumentMustRemainUnavailableToModel:
      redactionResult.rawDocumentMustRemainUnavailableToModel,
    rawDocumentMustRemainUnavailableToUserVisibleOutput:
      redactionResult.rawDocumentMustRemainUnavailableToUserVisibleOutput,
    rawDocumentMustRemainUnavailableToPersistence:
      redactionResult.rawDocumentMustRemainUnavailableToPersistence,

    realDocumentInputAuthorizedNow:
      redactionResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      redactionResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      redactionResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: redactionResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: redactionResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: redactionResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: redactionResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: redactionResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: redactionResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      redactionResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: redactionResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow:
      redactionResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: redactionResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow:
      redactionResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized:
      redactionResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized:
      redactionResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: redactionResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: redactionResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      redactionResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      redactionResult.deliveryDateRequiredForExactDeadline,

    redactionRequiresNameRemoval: redactionResult.redactionRequiresNameRemoval,
    redactionRequiresAddressRemoval:
      redactionResult.redactionRequiresAddressRemoval,
    redactionRequiresPhoneRemoval: redactionResult.redactionRequiresPhoneRemoval,
    redactionRequiresEmailRemoval: redactionResult.redactionRequiresEmailRemoval,
    redactionRequiresAktenzeichenRemovalOrTokenization:
      redactionResult.redactionRequiresAktenzeichenRemovalOrTokenization,
    redactionRequiresVersicherungsnummerRemovalOrTokenization:
      redactionResult.redactionRequiresVersicherungsnummerRemovalOrTokenization,
    redactionRequiresKundennummerRemovalOrTokenization:
      redactionResult.redactionRequiresKundennummerRemovalOrTokenization,
    redactionRequiresSteuernummerRemovalOrTokenization:
      redactionResult.redactionRequiresSteuernummerRemovalOrTokenization,
    redactionRequiresIBANRemovalOrTokenization:
      redactionResult.redactionRequiresIBANRemovalOrTokenization,
    redactionRequiresQrCodeRemoval:
      redactionResult.redactionRequiresQrCodeRemoval,
    redactionRequiresSignatureRemoval:
      redactionResult.redactionRequiresSignatureRemoval,
    redactionRequiresBarcodeRemoval:
      redactionResult.redactionRequiresBarcodeRemoval,
    redactionRequiresOfficialSealHandling:
      redactionResult.redactionRequiresOfficialSealHandling,
    redactionRequiresDocumentDatePreservationPolicy:
      redactionResult.redactionRequiresDocumentDatePreservationPolicy,
    redactionRequiresDeadlineDateSourceSeparation:
      redactionResult.redactionRequiresDeadlineDateSourceSeparation,
    redactionRequiresBekanntgabeDateExplicitness:
      redactionResult.redactionRequiresBekanntgabeDateExplicitness,
    redactionRequiresNoDeadlineInvention:
      redactionResult.redactionRequiresNoDeadlineInvention,
    redactionRequiresNoLegalCertainty:
      redactionResult.redactionRequiresNoLegalCertainty,
    redactionRequiresNoCoerciveLegalInstruction:
      redactionResult.redactionRequiresNoCoerciveLegalInstruction,
    redactionRequiresStructuredPlaceholderMap:
      redactionResult.redactionRequiresStructuredPlaceholderMap,
    redactionRequiresReversibilityPolicy:
      redactionResult.redactionRequiresReversibilityPolicy,
    redactionRequiresAuditTrace: redactionResult.redactionRequiresAuditTrace,
    redactionRequiresTamperCoverage:
      redactionResult.redactionRequiresTamperCoverage,
    redactionRequiresHumanReviewPolicy:
      redactionResult.redactionRequiresHumanReviewPolicy,

    readyForRealDocumentInput: redactionResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: redactionResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: redactionResult.publicRuntimeEnabled,
    persistenceUsed: redactionResult.persistenceUsed,
    neverUserVisible: redactionResult.neverUserVisible,

    structuredExtractionPlanOnly: true,
    actualExtractionPerformed: false,
    extractionFromRealDocumentAuthorizedNow: false,
    rawDocumentExtractionAuthorizedNow: false,
    redactedDocumentExtractionAuthorizedNow: false,
    modelExtractionAuthorizedNow: false,
    ocrExtractionAuthorizedNow: false,
    storageExtractionAuthorizedNow: false,
    userVisibleExtractionAuthorizedNow: false,
    structuredExtractionRequiresPriorRedaction: prereqAllPassed && prereqReady,
    structuredExtractionRequiresPlaceholderMap: prereqAllPassed && prereqReady,
    structuredExtractionRequiresFieldAllowlist: prereqAllPassed && prereqReady,
    structuredExtractionRequiresSourceAnchors: prereqAllPassed && prereqReady,
    structuredExtractionRequiresConfidenceLabels: prereqAllPassed && prereqReady,
    structuredExtractionRequiresUnknownWhenMissing:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresNoInferenceFromAbsence:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresNoDeadlineCalculation:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresNoDeadlineInvention:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresNoLegalCertainty: prereqAllPassed && prereqReady,
    structuredExtractionRequiresNoCoerciveLegalInstruction:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresDateRoleSeparation:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresBekanntgabeExplicitness:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresDocumentTypeClassification:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresAuthorityNameHandling:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresDecisionDateHandling:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresResponseDeadlineCandidateHandling:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresPaymentDeadlineCandidateHandling:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresAppealInstructionDetection:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresObligationDetection:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresAmountDetection: prereqAllPassed && prereqReady,
    structuredExtractionRequiresReferenceIdTokenHandling:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresHumanReviewPolicy:
      prereqAllPassed && prereqReady,
    structuredExtractionRequiresAuditTrace: prereqAllPassed && prereqReady,
    structuredExtractionRequiresTamperCoverage: prereqAllPassed && prereqReady,
    readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical structured extraction input ─────────────────
  const extractionValidation = validateExtractionInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const extractionAccepted = extractionValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4C checkId wrong", override: { prereqCheckId: "8.4B" } },
    { label: "8.4C allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentRedactionPlanAccepted false", override: { controlledRealDocumentRedactionPlanAccepted: false } },
    { label: "redactionPlanOnly false", override: { redactionPlanOnly: false } },
    { label: "redactionRequiredBeforeAnyModelUse false", override: { redactionRequiredBeforeAnyModelUse: false } },
    { label: "redactionRequiredBeforeAnyLLMCall false", override: { redactionRequiredBeforeAnyLLMCall: false } },
    { label: "redactionRequiredBeforeAnyStorage false", override: { redactionRequiredBeforeAnyStorage: false } },
    { label: "redactionRequiredBeforeAnyUserVisibleOutput false", override: { redactionRequiredBeforeAnyUserVisibleOutput: false } },
    { label: "redactionRequiredBeforeAnyAuditExport false", override: { redactionRequiredBeforeAnyAuditExport: false } },
    { label: "rawDocumentMustRemainUnavailableToModel false", override: { rawDocumentMustRemainUnavailableToModel: false } },
    { label: "rawDocumentMustRemainUnavailableToUserVisibleOutput false", override: { rawDocumentMustRemainUnavailableToUserVisibleOutput: false } },
    { label: "rawDocumentMustRemainUnavailableToPersistence false", override: { rawDocumentMustRemainUnavailableToPersistence: false } },
    { label: "readyFor8x4DControlledRealDocumentStructuredExtractionPlan false", override: { readyFor8x4DControlledRealDocumentStructuredExtractionPlan: false } },
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
    { label: "redactionRequiresNameRemoval false", override: { redactionRequiresNameRemoval: false } },
    { label: "redactionRequiresAddressRemoval false", override: { redactionRequiresAddressRemoval: false } },
    { label: "redactionRequiresPhoneRemoval false", override: { redactionRequiresPhoneRemoval: false } },
    { label: "redactionRequiresEmailRemoval false", override: { redactionRequiresEmailRemoval: false } },
    { label: "redactionRequiresAktenzeichenRemovalOrTokenization false", override: { redactionRequiresAktenzeichenRemovalOrTokenization: false } },
    { label: "redactionRequiresVersicherungsnummerRemovalOrTokenization false", override: { redactionRequiresVersicherungsnummerRemovalOrTokenization: false } },
    { label: "redactionRequiresKundennummerRemovalOrTokenization false", override: { redactionRequiresKundennummerRemovalOrTokenization: false } },
    { label: "redactionRequiresSteuernummerRemovalOrTokenization false", override: { redactionRequiresSteuernummerRemovalOrTokenization: false } },
    { label: "redactionRequiresIBANRemovalOrTokenization false", override: { redactionRequiresIBANRemovalOrTokenization: false } },
    { label: "redactionRequiresQrCodeRemoval false", override: { redactionRequiresQrCodeRemoval: false } },
    { label: "redactionRequiresSignatureRemoval false", override: { redactionRequiresSignatureRemoval: false } },
    { label: "redactionRequiresBarcodeRemoval false", override: { redactionRequiresBarcodeRemoval: false } },
    { label: "redactionRequiresOfficialSealHandling false", override: { redactionRequiresOfficialSealHandling: false } },
    { label: "redactionRequiresDocumentDatePreservationPolicy false", override: { redactionRequiresDocumentDatePreservationPolicy: false } },
    { label: "redactionRequiresDeadlineDateSourceSeparation false", override: { redactionRequiresDeadlineDateSourceSeparation: false } },
    { label: "redactionRequiresBekanntgabeDateExplicitness false", override: { redactionRequiresBekanntgabeDateExplicitness: false } },
    { label: "redactionRequiresNoDeadlineInvention false", override: { redactionRequiresNoDeadlineInvention: false } },
    { label: "redactionRequiresNoLegalCertainty false", override: { redactionRequiresNoLegalCertainty: false } },
    { label: "redactionRequiresNoCoerciveLegalInstruction false", override: { redactionRequiresNoCoerciveLegalInstruction: false } },
    { label: "redactionRequiresStructuredPlaceholderMap false", override: { redactionRequiresStructuredPlaceholderMap: false } },
    { label: "redactionRequiresReversibilityPolicy false", override: { redactionRequiresReversibilityPolicy: false } },
    { label: "redactionRequiresAuditTrace false", override: { redactionRequiresAuditTrace: false } },
    { label: "redactionRequiresTamperCoverage false", override: { redactionRequiresTamperCoverage: false } },
    { label: "redactionRequiresHumanReviewPolicy false", override: { redactionRequiresHumanReviewPolicy: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
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
    { label: "readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan false", override: { readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateExtractionInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    extractionAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4D: controlled real-document structured extraction plan layer — depends on completed 8.4C controlled real-document redaction plan",
    "8.4D is planning only — not real document input or processing",
    "no actual extraction was performed",
    "no live LLM call was performed in 8.4D",
    "8.3AC was not re-run",
    "no real document, OCR, photo, file upload, document storage, persistence, public runtime, or user-visible output was authorized",
    "structured extraction requires prior redaction and a structured placeholder map",
    "extracted fields must use allowlists, source anchors, confidence labels, and unknown when missing",
    "no inference from absence is allowed",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "deadline and date role separation remains mandatory",
    "the next phase is 8.4E controlled real-document evidence gate mapping plan",
    "8.4E is still planning only unless explicitly authorized later",
    `8.4C prerequisite: allPassed=${redactionResult.allPassed}, readyFor8x4D=${redactionResult.readyFor8x4DControlledRealDocumentStructuredExtractionPlan}`,
    `structured extraction input validation: ${extractionAccepted ? "accepted" : "REJECTED"} — reasons: ${extractionValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4D allPassed: true — controlled real-document structured extraction plan accepted"
    );
    notes.push(
      "readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan: true — planning only"
    );
  }

  return {
    checkId: "8.4D",
    allPassed,
    redactionPlanReadyForStructuredExtractionPlan:
      canonicalInput.controlledRealDocumentRedactionPlanAccepted,
    controlledRealDocumentStructuredExtractionPlanAccepted: allPassed,
    structuredExtractionPlanOnly: true,
    tamperCasesRejected: allTamperRejected,

    actualExtractionPerformed: false,
    extractionFromRealDocumentAuthorizedNow: false,
    rawDocumentExtractionAuthorizedNow: false,
    redactedDocumentExtractionAuthorizedNow: false,
    modelExtractionAuthorizedNow: false,
    ocrExtractionAuthorizedNow: false,
    storageExtractionAuthorizedNow: false,
    userVisibleExtractionAuthorizedNow: false,

    structuredExtractionRequiresPriorRedaction:
      canonicalInput.structuredExtractionRequiresPriorRedaction,
    structuredExtractionRequiresPlaceholderMap:
      canonicalInput.structuredExtractionRequiresPlaceholderMap,
    structuredExtractionRequiresFieldAllowlist:
      canonicalInput.structuredExtractionRequiresFieldAllowlist,
    structuredExtractionRequiresSourceAnchors:
      canonicalInput.structuredExtractionRequiresSourceAnchors,
    structuredExtractionRequiresConfidenceLabels:
      canonicalInput.structuredExtractionRequiresConfidenceLabels,
    structuredExtractionRequiresUnknownWhenMissing:
      canonicalInput.structuredExtractionRequiresUnknownWhenMissing,
    structuredExtractionRequiresNoInferenceFromAbsence:
      canonicalInput.structuredExtractionRequiresNoInferenceFromAbsence,
    structuredExtractionRequiresNoDeadlineCalculation:
      canonicalInput.structuredExtractionRequiresNoDeadlineCalculation,
    structuredExtractionRequiresNoDeadlineInvention:
      canonicalInput.structuredExtractionRequiresNoDeadlineInvention,
    structuredExtractionRequiresNoLegalCertainty:
      canonicalInput.structuredExtractionRequiresNoLegalCertainty,
    structuredExtractionRequiresNoCoerciveLegalInstruction:
      canonicalInput.structuredExtractionRequiresNoCoerciveLegalInstruction,
    structuredExtractionRequiresDateRoleSeparation:
      canonicalInput.structuredExtractionRequiresDateRoleSeparation,
    structuredExtractionRequiresBekanntgabeExplicitness:
      canonicalInput.structuredExtractionRequiresBekanntgabeExplicitness,
    structuredExtractionRequiresDocumentTypeClassification:
      canonicalInput.structuredExtractionRequiresDocumentTypeClassification,
    structuredExtractionRequiresAuthorityNameHandling:
      canonicalInput.structuredExtractionRequiresAuthorityNameHandling,
    structuredExtractionRequiresDecisionDateHandling:
      canonicalInput.structuredExtractionRequiresDecisionDateHandling,
    structuredExtractionRequiresResponseDeadlineCandidateHandling:
      canonicalInput.structuredExtractionRequiresResponseDeadlineCandidateHandling,
    structuredExtractionRequiresPaymentDeadlineCandidateHandling:
      canonicalInput.structuredExtractionRequiresPaymentDeadlineCandidateHandling,
    structuredExtractionRequiresAppealInstructionDetection:
      canonicalInput.structuredExtractionRequiresAppealInstructionDetection,
    structuredExtractionRequiresObligationDetection:
      canonicalInput.structuredExtractionRequiresObligationDetection,
    structuredExtractionRequiresAmountDetection:
      canonicalInput.structuredExtractionRequiresAmountDetection,
    structuredExtractionRequiresReferenceIdTokenHandling:
      canonicalInput.structuredExtractionRequiresReferenceIdTokenHandling,
    structuredExtractionRequiresHumanReviewPolicy:
      canonicalInput.structuredExtractionRequiresHumanReviewPolicy,
    structuredExtractionRequiresAuditTrace:
      canonicalInput.structuredExtractionRequiresAuditTrace,
    structuredExtractionRequiresTamperCoverage:
      canonicalInput.structuredExtractionRequiresTamperCoverage,

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

    readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan:
      canonicalInput.readyFor8x4EControlledRealDocumentEvidenceGateMappingPlan,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
