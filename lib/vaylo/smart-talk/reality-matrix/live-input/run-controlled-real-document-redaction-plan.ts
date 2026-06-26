/**
 * Phase 8.4C — Controlled Real Document Redaction Plan.
 *
 * PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4B.
 *
 * This file defines the mandatory redaction plan for any future controlled
 * real-document path before any model use. It is:
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR, photo, or file upload.
 *   - NOT document storage.
 *   - NOT public runtime.
 *   - NOT user-visible legal deadline output.
 *   - NOT persistence.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call runHighRiskSyntheticLegalDeadlineLiveExecution.
 *   - Authorize live real-document processing or upload.
 *   - Authorize OCR/photo/file input.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentContract } from "./run-controlled-real-document-contract";

// ── Local redaction input type ────────────────────────────────────────────────

interface ControlledRealDocumentRedactionPlanInput {
  // 8.4B prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly authorizationPlanReadyForContract: boolean;
  readonly controlledRealDocumentContractAccepted: boolean;
  readonly contractOnly: boolean;
  readonly readyFor8x4CControlledRealDocumentRedactionPlan: boolean;

  // 8.4B passthrough: all "AuthorizedNow" must be false
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

  // 8.4B contract requirements (must remain true)
  readonly contractRequiresRedactionBeforeAnyModelUse: boolean;
  readonly contractRequiresStructuredExtractionPlan: boolean;
  readonly contractRequiresEvidenceGateMapping: boolean;
  readonly contractRequiresOCRIsolationPlan: boolean;
  readonly contractRequiresStoragePolicyPlan: boolean;
  readonly contractRequiresUserVisibleOutputContract: boolean;
  readonly contractRequiresHumanReviewPolicy: boolean;
  readonly contractRequiresFreshRiskReview: boolean;
  readonly contractRequiresExplicitUserConsentPlan: boolean;
  readonly contractRequiresDocumentTypeClassification: boolean;
  readonly contractRequiresDeadlineDateSourceSeparation: boolean;
  readonly contractRequiresNoDeadlineInvention: boolean;
  readonly contractRequiresNoLegalCertainty: boolean;
  readonly contractRequiresNoCoerciveLegalInstruction: boolean;
  readonly contractRequiresAuditTrace: boolean;
  readonly contractRequiresTamperCoverage: boolean;

  // 8.4B runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4C redaction assertions
  readonly redactionPlanOnly: boolean;
  readonly redactionRequiredBeforeAnyModelUse: boolean;
  readonly redactionRequiredBeforeAnyLLMCall: boolean;
  readonly redactionRequiredBeforeAnyStorage: boolean;
  readonly redactionRequiredBeforeAnyUserVisibleOutput: boolean;
  readonly redactionRequiredBeforeAnyAuditExport: boolean;
  readonly rawDocumentMustRemainUnavailableToModel: boolean;
  readonly rawDocumentMustRemainUnavailableToUserVisibleOutput: boolean;
  readonly rawDocumentMustRemainUnavailableToPersistence: boolean;
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
  readonly readyFor8x4DControlledRealDocumentStructuredExtractionPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentRedactionPlanResult {
  readonly checkId: "8.4C";
  readonly allPassed: boolean;
  readonly contractReadyForRedactionPlan: boolean;
  readonly controlledRealDocumentRedactionPlanAccepted: boolean;
  readonly redactionPlanOnly: true;
  readonly tamperCasesRejected: boolean;

  readonly redactionRequiredBeforeAnyModelUse: boolean;
  readonly redactionRequiredBeforeAnyLLMCall: boolean;
  readonly redactionRequiredBeforeAnyStorage: boolean;
  readonly redactionRequiredBeforeAnyUserVisibleOutput: boolean;
  readonly redactionRequiredBeforeAnyAuditExport: boolean;
  readonly rawDocumentMustRemainUnavailableToModel: boolean;
  readonly rawDocumentMustRemainUnavailableToUserVisibleOutput: boolean;
  readonly rawDocumentMustRemainUnavailableToPersistence: boolean;

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

  readonly readyFor8x4DControlledRealDocumentStructuredExtractionPlan: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Redaction input validator ─────────────────────────────────────────────────

function validateRedactionInput(
  r: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4B prerequisite gates
  if (r["prereqCheckId"] !== "8.4B")
    reasons.push("prereq_check_id_invalid");
  if (r["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (r["controlledRealDocumentContractAccepted"] !== true)
    reasons.push("contract_not_accepted");
  if (r["contractOnly"] !== true)
    reasons.push("contract_only_false");
  if (r["readyFor8x4CControlledRealDocumentRedactionPlan"] !== true)
    reasons.push("not_ready_for_8_4c_redaction_plan");

  // 8.4B passthrough: all "AuthorizedNow" must be false
  if (r["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (r["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (r["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (r["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (r["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (r["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (r["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (r["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (r["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (r["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (r["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (r["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (r["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (r["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety invariants
  if (r["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (r["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (r["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (r["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (r["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (r["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_not_required");

  // 8.4B contract requirements (must remain true)
  if (r["contractRequiresRedactionBeforeAnyModelUse"] !== true)
    reasons.push("contract_requires_redaction_before_any_model_use_false");
  if (r["contractRequiresStructuredExtractionPlan"] !== true)
    reasons.push("contract_requires_structured_extraction_plan_false");
  if (r["contractRequiresEvidenceGateMapping"] !== true)
    reasons.push("contract_requires_evidence_gate_mapping_false");
  if (r["contractRequiresOCRIsolationPlan"] !== true)
    reasons.push("contract_requires_ocr_isolation_plan_false");
  if (r["contractRequiresStoragePolicyPlan"] !== true)
    reasons.push("contract_requires_storage_policy_plan_false");
  if (r["contractRequiresUserVisibleOutputContract"] !== true)
    reasons.push("contract_requires_user_visible_output_contract_false");
  if (r["contractRequiresHumanReviewPolicy"] !== true)
    reasons.push("contract_requires_human_review_policy_false");
  if (r["contractRequiresFreshRiskReview"] !== true)
    reasons.push("contract_requires_fresh_risk_review_false");
  if (r["contractRequiresExplicitUserConsentPlan"] !== true)
    reasons.push("contract_requires_explicit_user_consent_plan_false");
  if (r["contractRequiresDocumentTypeClassification"] !== true)
    reasons.push("contract_requires_document_type_classification_false");
  if (r["contractRequiresDeadlineDateSourceSeparation"] !== true)
    reasons.push("contract_requires_deadline_date_source_separation_false");
  if (r["contractRequiresNoDeadlineInvention"] !== true)
    reasons.push("contract_requires_no_deadline_invention_false");
  if (r["contractRequiresNoLegalCertainty"] !== true)
    reasons.push("contract_requires_no_legal_certainty_false");
  if (r["contractRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("contract_requires_no_coercive_legal_instruction_false");
  if (r["contractRequiresAuditTrace"] !== true)
    reasons.push("contract_requires_audit_trace_false");
  if (r["contractRequiresTamperCoverage"] !== true)
    reasons.push("contract_requires_tamper_coverage_false");

  // 8.4B runtime/public invariants
  if (r["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (r["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (r["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (r["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (r["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.4C redaction assertions
  if (r["redactionPlanOnly"] !== true)
    reasons.push("redaction_plan_only_false");
  if (r["redactionRequiredBeforeAnyModelUse"] !== true)
    reasons.push("redaction_required_before_any_model_use_false");
  if (r["redactionRequiredBeforeAnyLLMCall"] !== true)
    reasons.push("redaction_required_before_any_llm_call_false");
  if (r["redactionRequiredBeforeAnyStorage"] !== true)
    reasons.push("redaction_required_before_any_storage_false");
  if (r["redactionRequiredBeforeAnyUserVisibleOutput"] !== true)
    reasons.push("redaction_required_before_any_user_visible_output_false");
  if (r["redactionRequiredBeforeAnyAuditExport"] !== true)
    reasons.push("redaction_required_before_any_audit_export_false");
  if (r["rawDocumentMustRemainUnavailableToModel"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_model_false");
  if (r["rawDocumentMustRemainUnavailableToUserVisibleOutput"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_user_visible_output_false");
  if (r["rawDocumentMustRemainUnavailableToPersistence"] !== true)
    reasons.push("raw_document_must_remain_unavailable_to_persistence_false");
  if (r["redactionRequiresNameRemoval"] !== true)
    reasons.push("redaction_requires_name_removal_false");
  if (r["redactionRequiresAddressRemoval"] !== true)
    reasons.push("redaction_requires_address_removal_false");
  if (r["redactionRequiresPhoneRemoval"] !== true)
    reasons.push("redaction_requires_phone_removal_false");
  if (r["redactionRequiresEmailRemoval"] !== true)
    reasons.push("redaction_requires_email_removal_false");
  if (r["redactionRequiresAktenzeichenRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_aktenzeichen_removal_or_tokenization_false");
  if (r["redactionRequiresVersicherungsnummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_versicherungsnummer_removal_or_tokenization_false");
  if (r["redactionRequiresKundennummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_kundennummer_removal_or_tokenization_false");
  if (r["redactionRequiresSteuernummerRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_steuernummer_removal_or_tokenization_false");
  if (r["redactionRequiresIBANRemovalOrTokenization"] !== true)
    reasons.push("redaction_requires_iban_removal_or_tokenization_false");
  if (r["redactionRequiresQrCodeRemoval"] !== true)
    reasons.push("redaction_requires_qr_code_removal_false");
  if (r["redactionRequiresSignatureRemoval"] !== true)
    reasons.push("redaction_requires_signature_removal_false");
  if (r["redactionRequiresBarcodeRemoval"] !== true)
    reasons.push("redaction_requires_barcode_removal_false");
  if (r["redactionRequiresOfficialSealHandling"] !== true)
    reasons.push("redaction_requires_official_seal_handling_false");
  if (r["redactionRequiresDocumentDatePreservationPolicy"] !== true)
    reasons.push("redaction_requires_document_date_preservation_policy_false");
  if (r["redactionRequiresDeadlineDateSourceSeparation"] !== true)
    reasons.push("redaction_requires_deadline_date_source_separation_false");
  if (r["redactionRequiresBekanntgabeDateExplicitness"] !== true)
    reasons.push("redaction_requires_bekanntgabe_date_explicitness_false");
  if (r["redactionRequiresNoDeadlineInvention"] !== true)
    reasons.push("redaction_requires_no_deadline_invention_false");
  if (r["redactionRequiresNoLegalCertainty"] !== true)
    reasons.push("redaction_requires_no_legal_certainty_false");
  if (r["redactionRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("redaction_requires_no_coercive_legal_instruction_false");
  if (r["redactionRequiresStructuredPlaceholderMap"] !== true)
    reasons.push("redaction_requires_structured_placeholder_map_false");
  if (r["redactionRequiresReversibilityPolicy"] !== true)
    reasons.push("redaction_requires_reversibility_policy_false");
  if (r["redactionRequiresAuditTrace"] !== true)
    reasons.push("redaction_requires_audit_trace_false");
  if (r["redactionRequiresTamperCoverage"] !== true)
    reasons.push("redaction_requires_tamper_coverage_false");
  if (r["redactionRequiresHumanReviewPolicy"] !== true)
    reasons.push("redaction_requires_human_review_policy_false");
  if (r["readyFor8x4DControlledRealDocumentStructuredExtractionPlan"] !== true)
    reasons.push("not_ready_for_8_4d_structured_extraction_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentRedactionPlan(): ControlledRealDocumentRedactionPlanResult {
  // ── Step 1: Obtain 8.4B contract result ────────────────────────────────────
  const contractResult = runControlledRealDocumentContract();

  const prereqAllPassed = contractResult.allPassed;
  const prereqReady =
    contractResult.readyFor8x4CControlledRealDocumentRedactionPlan;

  // ── Step 2: Build canonical redaction input ────────────────────────────────
  const canonicalInput: ControlledRealDocumentRedactionPlanInput = {
    prereqCheckId: contractResult.checkId,
    prereqAllPassed,
    authorizationPlanReadyForContract:
      contractResult.authorizationPlanReadyForContract,
    controlledRealDocumentContractAccepted:
      contractResult.controlledRealDocumentContractAccepted,
    contractOnly: contractResult.contractOnly,
    readyFor8x4CControlledRealDocumentRedactionPlan: prereqReady,

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
    connectedAiRuntimeAuthorizedNow:
      contractResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: contractResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: contractResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized:
      contractResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized:
      contractResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: contractResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: contractResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      contractResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      contractResult.deliveryDateRequiredForExactDeadline,

    contractRequiresRedactionBeforeAnyModelUse:
      contractResult.contractRequiresRedactionBeforeAnyModelUse,
    contractRequiresStructuredExtractionPlan:
      contractResult.contractRequiresStructuredExtractionPlan,
    contractRequiresEvidenceGateMapping:
      contractResult.contractRequiresEvidenceGateMapping,
    contractRequiresOCRIsolationPlan:
      contractResult.contractRequiresOCRIsolationPlan,
    contractRequiresStoragePolicyPlan:
      contractResult.contractRequiresStoragePolicyPlan,
    contractRequiresUserVisibleOutputContract:
      contractResult.contractRequiresUserVisibleOutputContract,
    contractRequiresHumanReviewPolicy:
      contractResult.contractRequiresHumanReviewPolicy,
    contractRequiresFreshRiskReview:
      contractResult.contractRequiresFreshRiskReview,
    contractRequiresExplicitUserConsentPlan:
      contractResult.contractRequiresExplicitUserConsentPlan,
    contractRequiresDocumentTypeClassification:
      contractResult.contractRequiresDocumentTypeClassification,
    contractRequiresDeadlineDateSourceSeparation:
      contractResult.contractRequiresDeadlineDateSourceSeparation,
    contractRequiresNoDeadlineInvention:
      contractResult.contractRequiresNoDeadlineInvention,
    contractRequiresNoLegalCertainty:
      contractResult.contractRequiresNoLegalCertainty,
    contractRequiresNoCoerciveLegalInstruction:
      contractResult.contractRequiresNoCoerciveLegalInstruction,
    contractRequiresAuditTrace: contractResult.contractRequiresAuditTrace,
    contractRequiresTamperCoverage: contractResult.contractRequiresTamperCoverage,

    readyForRealDocumentInput: contractResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: contractResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: contractResult.publicRuntimeEnabled,
    persistenceUsed: contractResult.persistenceUsed,
    neverUserVisible: contractResult.neverUserVisible,

    redactionPlanOnly: true,
    redactionRequiredBeforeAnyModelUse: prereqAllPassed && prereqReady,
    redactionRequiredBeforeAnyLLMCall: prereqAllPassed && prereqReady,
    redactionRequiredBeforeAnyStorage: prereqAllPassed && prereqReady,
    redactionRequiredBeforeAnyUserVisibleOutput: prereqAllPassed && prereqReady,
    redactionRequiredBeforeAnyAuditExport: prereqAllPassed && prereqReady,
    rawDocumentMustRemainUnavailableToModel: prereqAllPassed && prereqReady,
    rawDocumentMustRemainUnavailableToUserVisibleOutput:
      prereqAllPassed && prereqReady,
    rawDocumentMustRemainUnavailableToPersistence:
      prereqAllPassed && prereqReady,
    redactionRequiresNameRemoval: prereqAllPassed && prereqReady,
    redactionRequiresAddressRemoval: prereqAllPassed && prereqReady,
    redactionRequiresPhoneRemoval: prereqAllPassed && prereqReady,
    redactionRequiresEmailRemoval: prereqAllPassed && prereqReady,
    redactionRequiresAktenzeichenRemovalOrTokenization:
      prereqAllPassed && prereqReady,
    redactionRequiresVersicherungsnummerRemovalOrTokenization:
      prereqAllPassed && prereqReady,
    redactionRequiresKundennummerRemovalOrTokenization:
      prereqAllPassed && prereqReady,
    redactionRequiresSteuernummerRemovalOrTokenization:
      prereqAllPassed && prereqReady,
    redactionRequiresIBANRemovalOrTokenization: prereqAllPassed && prereqReady,
    redactionRequiresQrCodeRemoval: prereqAllPassed && prereqReady,
    redactionRequiresSignatureRemoval: prereqAllPassed && prereqReady,
    redactionRequiresBarcodeRemoval: prereqAllPassed && prereqReady,
    redactionRequiresOfficialSealHandling: prereqAllPassed && prereqReady,
    redactionRequiresDocumentDatePreservationPolicy:
      prereqAllPassed && prereqReady,
    redactionRequiresDeadlineDateSourceSeparation:
      prereqAllPassed && prereqReady,
    redactionRequiresBekanntgabeDateExplicitness: prereqAllPassed && prereqReady,
    redactionRequiresNoDeadlineInvention: prereqAllPassed && prereqReady,
    redactionRequiresNoLegalCertainty: prereqAllPassed && prereqReady,
    redactionRequiresNoCoerciveLegalInstruction: prereqAllPassed && prereqReady,
    redactionRequiresStructuredPlaceholderMap: prereqAllPassed && prereqReady,
    redactionRequiresReversibilityPolicy: prereqAllPassed && prereqReady,
    redactionRequiresAuditTrace: prereqAllPassed && prereqReady,
    redactionRequiresTamperCoverage: prereqAllPassed && prereqReady,
    redactionRequiresHumanReviewPolicy: prereqAllPassed && prereqReady,
    readyFor8x4DControlledRealDocumentStructuredExtractionPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical redaction input ─────────────────────────────
  const redactionValidation = validateRedactionInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const redactionAccepted = redactionValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4B checkId wrong", override: { prereqCheckId: "8.4A" } },
    { label: "8.4B allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentContractAccepted false", override: { controlledRealDocumentContractAccepted: false } },
    { label: "contractOnly false", override: { contractOnly: false } },
    { label: "readyFor8x4CControlledRealDocumentRedactionPlan false", override: { readyFor8x4CControlledRealDocumentRedactionPlan: false } },
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
    { label: "contractRequiresRedactionBeforeAnyModelUse false", override: { contractRequiresRedactionBeforeAnyModelUse: false } },
    { label: "contractRequiresStructuredExtractionPlan false", override: { contractRequiresStructuredExtractionPlan: false } },
    { label: "contractRequiresEvidenceGateMapping false", override: { contractRequiresEvidenceGateMapping: false } },
    { label: "contractRequiresOCRIsolationPlan false", override: { contractRequiresOCRIsolationPlan: false } },
    { label: "contractRequiresStoragePolicyPlan false", override: { contractRequiresStoragePolicyPlan: false } },
    { label: "contractRequiresUserVisibleOutputContract false", override: { contractRequiresUserVisibleOutputContract: false } },
    { label: "contractRequiresHumanReviewPolicy false", override: { contractRequiresHumanReviewPolicy: false } },
    { label: "contractRequiresFreshRiskReview false", override: { contractRequiresFreshRiskReview: false } },
    { label: "contractRequiresExplicitUserConsentPlan false", override: { contractRequiresExplicitUserConsentPlan: false } },
    { label: "contractRequiresDocumentTypeClassification false", override: { contractRequiresDocumentTypeClassification: false } },
    { label: "contractRequiresDeadlineDateSourceSeparation false", override: { contractRequiresDeadlineDateSourceSeparation: false } },
    { label: "contractRequiresNoDeadlineInvention false", override: { contractRequiresNoDeadlineInvention: false } },
    { label: "contractRequiresNoLegalCertainty false", override: { contractRequiresNoLegalCertainty: false } },
    { label: "contractRequiresNoCoerciveLegalInstruction false", override: { contractRequiresNoCoerciveLegalInstruction: false } },
    { label: "contractRequiresAuditTrace false", override: { contractRequiresAuditTrace: false } },
    { label: "contractRequiresTamperCoverage false", override: { contractRequiresTamperCoverage: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "redactionPlanOnly false", override: { redactionPlanOnly: false } },
    { label: "redactionRequiredBeforeAnyModelUse false", override: { redactionRequiredBeforeAnyModelUse: false } },
    { label: "redactionRequiredBeforeAnyLLMCall false", override: { redactionRequiredBeforeAnyLLMCall: false } },
    { label: "redactionRequiredBeforeAnyStorage false", override: { redactionRequiredBeforeAnyStorage: false } },
    { label: "redactionRequiredBeforeAnyUserVisibleOutput false", override: { redactionRequiredBeforeAnyUserVisibleOutput: false } },
    { label: "redactionRequiredBeforeAnyAuditExport false", override: { redactionRequiredBeforeAnyAuditExport: false } },
    { label: "rawDocumentMustRemainUnavailableToModel false", override: { rawDocumentMustRemainUnavailableToModel: false } },
    { label: "rawDocumentMustRemainUnavailableToUserVisibleOutput false", override: { rawDocumentMustRemainUnavailableToUserVisibleOutput: false } },
    { label: "rawDocumentMustRemainUnavailableToPersistence false", override: { rawDocumentMustRemainUnavailableToPersistence: false } },
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
    { label: "readyFor8x4DControlledRealDocumentStructuredExtractionPlan false", override: { readyFor8x4DControlledRealDocumentStructuredExtractionPlan: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateRedactionInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    redactionAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4C: controlled real-document redaction plan layer — depends on completed 8.4B controlled real-document contract",
    "8.4C is planning only — not real document input or processing",
    "no live LLM call was performed in 8.4C",
    "8.3AC was not re-run",
    "no real document, OCR, photo, file upload, document storage, persistence, public runtime, or user-visible output was authorized",
    "raw documents must remain unavailable to model, persistence, and user-visible output",
    "redaction is required before any model use",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "deadline source separation remains mandatory",
    "the next phase is 8.4D controlled real-document structured extraction plan",
    "8.4D is still planning only unless explicitly authorized later",
    `8.4B prerequisite: allPassed=${contractResult.allPassed}, readyFor8x4C=${contractResult.readyFor8x4CControlledRealDocumentRedactionPlan}`,
    `redaction input validation: ${redactionAccepted ? "accepted" : "REJECTED"} — reasons: ${redactionValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4C allPassed: true — controlled real-document redaction plan accepted"
    );
    notes.push(
      "readyFor8x4DControlledRealDocumentStructuredExtractionPlan: true — planning only"
    );
  }

  return {
    checkId: "8.4C",
    allPassed,
    contractReadyForRedactionPlan:
      canonicalInput.controlledRealDocumentContractAccepted,
    controlledRealDocumentRedactionPlanAccepted: allPassed,
    redactionPlanOnly: true,
    tamperCasesRejected: allTamperRejected,

    redactionRequiredBeforeAnyModelUse:
      canonicalInput.redactionRequiredBeforeAnyModelUse,
    redactionRequiredBeforeAnyLLMCall:
      canonicalInput.redactionRequiredBeforeAnyLLMCall,
    redactionRequiredBeforeAnyStorage:
      canonicalInput.redactionRequiredBeforeAnyStorage,
    redactionRequiredBeforeAnyUserVisibleOutput:
      canonicalInput.redactionRequiredBeforeAnyUserVisibleOutput,
    redactionRequiredBeforeAnyAuditExport:
      canonicalInput.redactionRequiredBeforeAnyAuditExport,
    rawDocumentMustRemainUnavailableToModel:
      canonicalInput.rawDocumentMustRemainUnavailableToModel,
    rawDocumentMustRemainUnavailableToUserVisibleOutput:
      canonicalInput.rawDocumentMustRemainUnavailableToUserVisibleOutput,
    rawDocumentMustRemainUnavailableToPersistence:
      canonicalInput.rawDocumentMustRemainUnavailableToPersistence,

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

    redactionRequiresNameRemoval: canonicalInput.redactionRequiresNameRemoval,
    redactionRequiresAddressRemoval:
      canonicalInput.redactionRequiresAddressRemoval,
    redactionRequiresPhoneRemoval: canonicalInput.redactionRequiresPhoneRemoval,
    redactionRequiresEmailRemoval: canonicalInput.redactionRequiresEmailRemoval,
    redactionRequiresAktenzeichenRemovalOrTokenization:
      canonicalInput.redactionRequiresAktenzeichenRemovalOrTokenization,
    redactionRequiresVersicherungsnummerRemovalOrTokenization:
      canonicalInput.redactionRequiresVersicherungsnummerRemovalOrTokenization,
    redactionRequiresKundennummerRemovalOrTokenization:
      canonicalInput.redactionRequiresKundennummerRemovalOrTokenization,
    redactionRequiresSteuernummerRemovalOrTokenization:
      canonicalInput.redactionRequiresSteuernummerRemovalOrTokenization,
    redactionRequiresIBANRemovalOrTokenization:
      canonicalInput.redactionRequiresIBANRemovalOrTokenization,
    redactionRequiresQrCodeRemoval: canonicalInput.redactionRequiresQrCodeRemoval,
    redactionRequiresSignatureRemoval:
      canonicalInput.redactionRequiresSignatureRemoval,
    redactionRequiresBarcodeRemoval:
      canonicalInput.redactionRequiresBarcodeRemoval,
    redactionRequiresOfficialSealHandling:
      canonicalInput.redactionRequiresOfficialSealHandling,
    redactionRequiresDocumentDatePreservationPolicy:
      canonicalInput.redactionRequiresDocumentDatePreservationPolicy,
    redactionRequiresDeadlineDateSourceSeparation:
      canonicalInput.redactionRequiresDeadlineDateSourceSeparation,
    redactionRequiresBekanntgabeDateExplicitness:
      canonicalInput.redactionRequiresBekanntgabeDateExplicitness,
    redactionRequiresNoDeadlineInvention:
      canonicalInput.redactionRequiresNoDeadlineInvention,
    redactionRequiresNoLegalCertainty:
      canonicalInput.redactionRequiresNoLegalCertainty,
    redactionRequiresNoCoerciveLegalInstruction:
      canonicalInput.redactionRequiresNoCoerciveLegalInstruction,
    redactionRequiresStructuredPlaceholderMap:
      canonicalInput.redactionRequiresStructuredPlaceholderMap,
    redactionRequiresReversibilityPolicy:
      canonicalInput.redactionRequiresReversibilityPolicy,
    redactionRequiresAuditTrace: canonicalInput.redactionRequiresAuditTrace,
    redactionRequiresTamperCoverage:
      canonicalInput.redactionRequiresTamperCoverage,
    redactionRequiresHumanReviewPolicy:
      canonicalInput.redactionRequiresHumanReviewPolicy,

    readyFor8x4DControlledRealDocumentStructuredExtractionPlan:
      canonicalInput.readyFor8x4DControlledRealDocumentStructuredExtractionPlan,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
