/**
 * Phase 8.4F — Controlled Real Document OCR and Storage Isolation Plan.
 *
 * PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4E.
 *
 * This file defines how future OCR, photo/file input, transient processing,
 * storage, audit persistence, and deletion boundaries must be isolated before
 * any real document runtime can be considered. It is:
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR runtime.
 *   - NOT photo/file upload.
 *   - NOT document storage.
 *   - NOT database persistence.
 *   - NOT audit persistence.
 *   - NOT public runtime.
 *   - NOT user-visible legal deadline output.
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
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentEvidenceGateMappingPlan } from "./run-controlled-real-document-evidence-gate-mapping-plan";

// ── Local OCR/storage isolation input type ────────────────────────────────────

interface ControlledRealDocumentOcrAndStorageIsolationPlanInput {
  // 8.4E prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly structuredExtractionReadyForEvidenceGateMappingPlan: boolean;
  readonly controlledRealDocumentEvidenceGateMappingPlanAccepted: boolean;
  readonly evidenceGateMappingPlanOnly: boolean;
  readonly readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: boolean;

  // 8.4E performed-flags (must be false)
  readonly actualEvidenceEvaluationPerformed: boolean;
  readonly actualClaimAuthorizationPerformed: boolean;
  readonly actualRealityAuthorizationPerformed: boolean;
  readonly actualTrapActivationPerformed: boolean;
  readonly actualDeadlineCalculationPerformed: boolean;

  // 8.4E evidence gate mapping requirements (must remain true)
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
  readonly evidenceGateMappingRequiresMissingEvidenceBlocksClaim: boolean;
  readonly evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty: boolean;
  readonly evidenceGateMappingRequiresNoDeadlineInvention: boolean;
  readonly evidenceGateMappingRequiresNoLegalCertainty: boolean;
  readonly evidenceGateMappingRequiresNoCoerciveLegalInstruction: boolean;
  readonly evidenceGateMappingRequiresHumanReviewPolicy: boolean;
  readonly evidenceGateMappingRequiresAuditTrace: boolean;
  readonly evidenceGateMappingRequiresTamperCoverage: boolean;

  // 8.4E runtime "AuthorizedNow" passthrough (must be false)
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

  // 8.4E runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4F assertions
  readonly ocrAndStorageIsolationPlanOnly: boolean;
  readonly actualOcrPerformed: boolean;
  readonly actualPhotoInputProcessed: boolean;
  readonly actualFileInputProcessed: boolean;
  readonly actualDocumentStoragePerformed: boolean;
  readonly actualDatabasePersistencePerformed: boolean;
  readonly actualAuditPersistencePerformed: boolean;
  readonly actualUserVisibleOutputPerformed: boolean;
  readonly actualPublicRuntimeEnabled: boolean;

  // OCR isolation requirements
  readonly ocrIsolationRequiresSeparateRuntimeBoundary: boolean;
  readonly ocrIsolationRequiresUntrustedOcrOutput: boolean;
  readonly ocrIsolationRequiresNoRawImageToModel: boolean;
  readonly ocrIsolationRequiresNoRawOcrToUserVisibleOutput: boolean;
  readonly ocrIsolationRequiresRedactionBeforeModelUse: boolean;
  readonly ocrIsolationRequiresEvidenceGateBeforeInterpretation: boolean;
  readonly ocrIsolationRequiresConfidenceLabels: boolean;
  readonly ocrIsolationRequiresUnknownWhenUnreadable: boolean;
  readonly ocrIsolationRequiresNoInferenceFromUnreadableText: boolean;
  readonly ocrIsolationRequiresHumanReviewForLowConfidence: boolean;
  readonly ocrIsolationRequiresTamperCoverage: boolean;
  readonly ocrIsolationRequiresAuditTrace: boolean;

  // Storage isolation requirements
  readonly storageIsolationRequiresNoDefaultPersistence: boolean;
  readonly storageIsolationRequiresEphemeralProcessingByDefault: boolean;
  readonly storageIsolationRequiresExplicitConsentBeforeStorage: boolean;
  readonly storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence: boolean;
  readonly storageIsolationRequiresRawDocumentStorageBlockedByDefault: boolean;
  readonly storageIsolationRequiresRedactedArtifactOnlyIfAuthorized: boolean;
  readonly storageIsolationRequiresAuditMetadataOnlyByDefault: boolean;
  readonly storageIsolationRequiresNoPromptOrModelOutputStorage: boolean;
  readonly storageIsolationRequiresNoApiKeyStorage: boolean;
  readonly storageIsolationRequiresDeletionPolicy: boolean;
  readonly storageIsolationRequiresRetentionPolicy: boolean;
  readonly storageIsolationRequiresAccessControlPolicy: boolean;
  readonly storageIsolationRequiresEncryptionPolicy: boolean;
  readonly storageIsolationRequiresUserExportPolicy: boolean;
  readonly storageIsolationRequiresUserDeletionRequestPolicy: boolean;
  readonly storageIsolationRequiresTamperCoverage: boolean;
  readonly storageIsolationRequiresAuditTrace: boolean;

  // Photo/file input isolation requirements
  readonly inputIsolationRequiresExplicitDocumentMode: boolean;
  readonly inputIsolationRequiresPaidDocumentModeBoundary: boolean;
  readonly inputIsolationRequiresFreeQaBypassGuard: boolean;
  readonly inputIsolationRequiresUploadNotAvailableInFreeQa: boolean;
  readonly inputIsolationRequiresFileTypeAllowlist: boolean;
  readonly inputIsolationRequiresSizeLimit: boolean;
  readonly inputIsolationRequiresMalwareSafetyBoundary: boolean;
  readonly inputIsolationRequiresNoDirectPublicUrlExposure: boolean;
  readonly inputIsolationRequiresNoCrossUserAccess: boolean;
  readonly inputIsolationRequiresNoTrainingUse: boolean;
  readonly inputIsolationRequiresUserLanguageSelection: boolean;
  readonly inputIsolationRequiresClearPrivacyNotice: boolean;

  // Commercial boundary requirements
  readonly commercialBoundaryRequiresFreeQuestionModeSeparation: boolean;
  readonly commercialBoundaryRequiresPaidDocumentModeSeparation: boolean;
  readonly commercialBoundaryRequiresDocumentBypassGuard: boolean;
  readonly commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa: boolean;
  readonly commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation: boolean;
  readonly commercialBoundaryRequiresSuccessfulProcessingDefinition: boolean;
  readonly commercialBoundaryRequiresFailureNoChargePolicy: boolean;

  readonly readyFor8x4GControlledRealDocumentUserVisibleOutputContract: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentOcrAndStorageIsolationPlanResult {
  readonly checkId: "8.4F";
  readonly allPassed: boolean;
  readonly evidenceGateMappingReadyForOcrAndStorageIsolationPlan: boolean;
  readonly controlledRealDocumentOcrAndStorageIsolationPlanAccepted: boolean;
  readonly ocrAndStorageIsolationPlanOnly: true;
  readonly tamperCasesRejected: boolean;

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

  readonly ocrIsolationRequiresSeparateRuntimeBoundary: boolean;
  readonly ocrIsolationRequiresUntrustedOcrOutput: boolean;
  readonly ocrIsolationRequiresNoRawImageToModel: boolean;
  readonly ocrIsolationRequiresNoRawOcrToUserVisibleOutput: boolean;
  readonly ocrIsolationRequiresRedactionBeforeModelUse: boolean;
  readonly ocrIsolationRequiresEvidenceGateBeforeInterpretation: boolean;
  readonly ocrIsolationRequiresConfidenceLabels: boolean;
  readonly ocrIsolationRequiresUnknownWhenUnreadable: boolean;
  readonly ocrIsolationRequiresNoInferenceFromUnreadableText: boolean;
  readonly ocrIsolationRequiresHumanReviewForLowConfidence: boolean;
  readonly ocrIsolationRequiresTamperCoverage: boolean;
  readonly ocrIsolationRequiresAuditTrace: boolean;

  readonly storageIsolationRequiresNoDefaultPersistence: boolean;
  readonly storageIsolationRequiresEphemeralProcessingByDefault: boolean;
  readonly storageIsolationRequiresExplicitConsentBeforeStorage: boolean;
  readonly storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence: boolean;
  readonly storageIsolationRequiresRawDocumentStorageBlockedByDefault: boolean;
  readonly storageIsolationRequiresRedactedArtifactOnlyIfAuthorized: boolean;
  readonly storageIsolationRequiresAuditMetadataOnlyByDefault: boolean;
  readonly storageIsolationRequiresNoPromptOrModelOutputStorage: boolean;
  readonly storageIsolationRequiresNoApiKeyStorage: boolean;
  readonly storageIsolationRequiresDeletionPolicy: boolean;
  readonly storageIsolationRequiresRetentionPolicy: boolean;
  readonly storageIsolationRequiresAccessControlPolicy: boolean;
  readonly storageIsolationRequiresEncryptionPolicy: boolean;
  readonly storageIsolationRequiresUserExportPolicy: boolean;
  readonly storageIsolationRequiresUserDeletionRequestPolicy: boolean;
  readonly storageIsolationRequiresTamperCoverage: boolean;
  readonly storageIsolationRequiresAuditTrace: boolean;

  readonly inputIsolationRequiresExplicitDocumentMode: boolean;
  readonly inputIsolationRequiresPaidDocumentModeBoundary: boolean;
  readonly inputIsolationRequiresFreeQaBypassGuard: boolean;
  readonly inputIsolationRequiresUploadNotAvailableInFreeQa: boolean;
  readonly inputIsolationRequiresFileTypeAllowlist: boolean;
  readonly inputIsolationRequiresSizeLimit: boolean;
  readonly inputIsolationRequiresMalwareSafetyBoundary: boolean;
  readonly inputIsolationRequiresNoDirectPublicUrlExposure: boolean;
  readonly inputIsolationRequiresNoCrossUserAccess: boolean;
  readonly inputIsolationRequiresNoTrainingUse: boolean;
  readonly inputIsolationRequiresUserLanguageSelection: boolean;
  readonly inputIsolationRequiresClearPrivacyNotice: boolean;

  readonly commercialBoundaryRequiresFreeQuestionModeSeparation: boolean;
  readonly commercialBoundaryRequiresPaidDocumentModeSeparation: boolean;
  readonly commercialBoundaryRequiresDocumentBypassGuard: boolean;
  readonly commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa: boolean;
  readonly commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation: boolean;
  readonly commercialBoundaryRequiresSuccessfulProcessingDefinition: boolean;
  readonly commercialBoundaryRequiresFailureNoChargePolicy: boolean;

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

  readonly readyFor8x4GControlledRealDocumentUserVisibleOutputContract: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── OCR/storage isolation input validator ─────────────────────────────────────

function validateOcrStorageInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4E prerequisite gates
  if (o["prereqCheckId"] !== "8.4E")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentEvidenceGateMappingPlanAccepted"] !== true)
    reasons.push("evidence_gate_mapping_plan_not_accepted");
  if (o["evidenceGateMappingPlanOnly"] !== true)
    reasons.push("evidence_gate_mapping_plan_only_false");
  if (o["readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan"] !== true)
    reasons.push("not_ready_for_8_4f_ocr_and_storage_isolation_plan");

  // 8.4E performed flags (must be false)
  if (o["actualEvidenceEvaluationPerformed"] !== false)
    reasons.push("actual_evidence_evaluation_performed");
  if (o["actualClaimAuthorizationPerformed"] !== false)
    reasons.push("actual_claim_authorization_performed");
  if (o["actualRealityAuthorizationPerformed"] !== false)
    reasons.push("actual_reality_authorization_performed");
  if (o["actualTrapActivationPerformed"] !== false)
    reasons.push("actual_trap_activation_performed");
  if (o["actualDeadlineCalculationPerformed"] !== false)
    reasons.push("actual_deadline_calculation_performed");

  // 8.4E evidence gate mapping requirements (must remain true)
  if (o["evidenceGateMappingRequiresPriorRedaction"] !== true)
    reasons.push("evidence_gate_mapping_requires_prior_redaction_false");
  if (o["evidenceGateMappingRequiresStructuredExtraction"] !== true)
    reasons.push("evidence_gate_mapping_requires_structured_extraction_false");
  if (o["evidenceGateMappingRequiresPlaceholderMap"] !== true)
    reasons.push("evidence_gate_mapping_requires_placeholder_map_false");
  if (o["evidenceGateMappingRequiresFieldAllowlist"] !== true)
    reasons.push("evidence_gate_mapping_requires_field_allowlist_false");
  if (o["evidenceGateMappingRequiresSourceAnchors"] !== true)
    reasons.push("evidence_gate_mapping_requires_source_anchors_false");
  if (o["evidenceGateMappingRequiresConfidenceLabels"] !== true)
    reasons.push("evidence_gate_mapping_requires_confidence_labels_false");
  if (o["evidenceGateMappingRequiresUnknownWhenMissing"] !== true)
    reasons.push("evidence_gate_mapping_requires_unknown_when_missing_false");
  if (o["evidenceGateMappingRequiresNoInferenceFromAbsence"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_inference_from_absence_false");
  if (o["evidenceGateMappingRequiresCueToClaimSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_cue_to_claim_separation_false");
  if (o["evidenceGateMappingRequiresClaimToEvidenceSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_claim_to_evidence_separation_false");
  if (o["evidenceGateMappingRequiresDateRoleSeparation"] !== true)
    reasons.push("evidence_gate_mapping_requires_date_role_separation_false");
  if (o["evidenceGateMappingRequiresBekanntgabeExplicitness"] !== true)
    reasons.push("evidence_gate_mapping_requires_bekanntgabe_explicitness_false");
  if (o["evidenceGateMappingRequiresDeliveryDateExplicitness"] !== true)
    reasons.push("evidence_gate_mapping_requires_delivery_date_explicitness_false");
  if (o["evidenceGateMappingRequiresMissingEvidenceBlocksClaim"] !== true)
    reasons.push("evidence_gate_mapping_requires_missing_evidence_blocks_claim_false");
  if (o["evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty"] !== true)
    reasons.push("evidence_gate_mapping_requires_ambiguous_evidence_blocks_certainty_false");
  if (o["evidenceGateMappingRequiresNoDeadlineInvention"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_deadline_invention_false");
  if (o["evidenceGateMappingRequiresNoLegalCertainty"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_legal_certainty_false");
  if (o["evidenceGateMappingRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("evidence_gate_mapping_requires_no_coercive_legal_instruction_false");
  if (o["evidenceGateMappingRequiresHumanReviewPolicy"] !== true)
    reasons.push("evidence_gate_mapping_requires_human_review_policy_false");
  if (o["evidenceGateMappingRequiresAuditTrace"] !== true)
    reasons.push("evidence_gate_mapping_requires_audit_trace_false");
  if (o["evidenceGateMappingRequiresTamperCoverage"] !== true)
    reasons.push("evidence_gate_mapping_requires_tamper_coverage_false");

  // 8.4E runtime "AuthorizedNow" passthrough (must be false)
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

  // 8.4E runtime/public invariants
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

  // Derived 8.4F assertions
  if (o["ocrAndStorageIsolationPlanOnly"] !== true)
    reasons.push("ocr_and_storage_isolation_plan_only_false");
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

  // OCR isolation requirements
  if (o["ocrIsolationRequiresSeparateRuntimeBoundary"] !== true)
    reasons.push("ocr_isolation_requires_separate_runtime_boundary_false");
  if (o["ocrIsolationRequiresUntrustedOcrOutput"] !== true)
    reasons.push("ocr_isolation_requires_untrusted_ocr_output_false");
  if (o["ocrIsolationRequiresNoRawImageToModel"] !== true)
    reasons.push("ocr_isolation_requires_no_raw_image_to_model_false");
  if (o["ocrIsolationRequiresNoRawOcrToUserVisibleOutput"] !== true)
    reasons.push("ocr_isolation_requires_no_raw_ocr_to_user_visible_output_false");
  if (o["ocrIsolationRequiresRedactionBeforeModelUse"] !== true)
    reasons.push("ocr_isolation_requires_redaction_before_model_use_false");
  if (o["ocrIsolationRequiresEvidenceGateBeforeInterpretation"] !== true)
    reasons.push("ocr_isolation_requires_evidence_gate_before_interpretation_false");
  if (o["ocrIsolationRequiresConfidenceLabels"] !== true)
    reasons.push("ocr_isolation_requires_confidence_labels_false");
  if (o["ocrIsolationRequiresUnknownWhenUnreadable"] !== true)
    reasons.push("ocr_isolation_requires_unknown_when_unreadable_false");
  if (o["ocrIsolationRequiresNoInferenceFromUnreadableText"] !== true)
    reasons.push("ocr_isolation_requires_no_inference_from_unreadable_text_false");
  if (o["ocrIsolationRequiresHumanReviewForLowConfidence"] !== true)
    reasons.push("ocr_isolation_requires_human_review_for_low_confidence_false");
  if (o["ocrIsolationRequiresTamperCoverage"] !== true)
    reasons.push("ocr_isolation_requires_tamper_coverage_false");
  if (o["ocrIsolationRequiresAuditTrace"] !== true)
    reasons.push("ocr_isolation_requires_audit_trace_false");

  // Storage isolation requirements
  if (o["storageIsolationRequiresNoDefaultPersistence"] !== true)
    reasons.push("storage_isolation_requires_no_default_persistence_false");
  if (o["storageIsolationRequiresEphemeralProcessingByDefault"] !== true)
    reasons.push("storage_isolation_requires_ephemeral_processing_by_default_false");
  if (o["storageIsolationRequiresExplicitConsentBeforeStorage"] !== true)
    reasons.push("storage_isolation_requires_explicit_consent_before_storage_false");
  if (o["storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence"] !== true)
    reasons.push("storage_isolation_requires_separate_storage_policy_false");
  if (o["storageIsolationRequiresRawDocumentStorageBlockedByDefault"] !== true)
    reasons.push("storage_isolation_requires_raw_document_storage_blocked_by_default_false");
  if (o["storageIsolationRequiresRedactedArtifactOnlyIfAuthorized"] !== true)
    reasons.push("storage_isolation_requires_redacted_artifact_only_if_authorized_false");
  if (o["storageIsolationRequiresAuditMetadataOnlyByDefault"] !== true)
    reasons.push("storage_isolation_requires_audit_metadata_only_by_default_false");
  if (o["storageIsolationRequiresNoPromptOrModelOutputStorage"] !== true)
    reasons.push("storage_isolation_requires_no_prompt_or_model_output_storage_false");
  if (o["storageIsolationRequiresNoApiKeyStorage"] !== true)
    reasons.push("storage_isolation_requires_no_api_key_storage_false");
  if (o["storageIsolationRequiresDeletionPolicy"] !== true)
    reasons.push("storage_isolation_requires_deletion_policy_false");
  if (o["storageIsolationRequiresRetentionPolicy"] !== true)
    reasons.push("storage_isolation_requires_retention_policy_false");
  if (o["storageIsolationRequiresAccessControlPolicy"] !== true)
    reasons.push("storage_isolation_requires_access_control_policy_false");
  if (o["storageIsolationRequiresEncryptionPolicy"] !== true)
    reasons.push("storage_isolation_requires_encryption_policy_false");
  if (o["storageIsolationRequiresUserExportPolicy"] !== true)
    reasons.push("storage_isolation_requires_user_export_policy_false");
  if (o["storageIsolationRequiresUserDeletionRequestPolicy"] !== true)
    reasons.push("storage_isolation_requires_user_deletion_request_policy_false");
  if (o["storageIsolationRequiresTamperCoverage"] !== true)
    reasons.push("storage_isolation_requires_tamper_coverage_false");
  if (o["storageIsolationRequiresAuditTrace"] !== true)
    reasons.push("storage_isolation_requires_audit_trace_false");

  // Photo/file input isolation requirements
  if (o["inputIsolationRequiresExplicitDocumentMode"] !== true)
    reasons.push("input_isolation_requires_explicit_document_mode_false");
  if (o["inputIsolationRequiresPaidDocumentModeBoundary"] !== true)
    reasons.push("input_isolation_requires_paid_document_mode_boundary_false");
  if (o["inputIsolationRequiresFreeQaBypassGuard"] !== true)
    reasons.push("input_isolation_requires_free_qa_bypass_guard_false");
  if (o["inputIsolationRequiresUploadNotAvailableInFreeQa"] !== true)
    reasons.push("input_isolation_requires_upload_not_available_in_free_qa_false");
  if (o["inputIsolationRequiresFileTypeAllowlist"] !== true)
    reasons.push("input_isolation_requires_file_type_allowlist_false");
  if (o["inputIsolationRequiresSizeLimit"] !== true)
    reasons.push("input_isolation_requires_size_limit_false");
  if (o["inputIsolationRequiresMalwareSafetyBoundary"] !== true)
    reasons.push("input_isolation_requires_malware_safety_boundary_false");
  if (o["inputIsolationRequiresNoDirectPublicUrlExposure"] !== true)
    reasons.push("input_isolation_requires_no_direct_public_url_exposure_false");
  if (o["inputIsolationRequiresNoCrossUserAccess"] !== true)
    reasons.push("input_isolation_requires_no_cross_user_access_false");
  if (o["inputIsolationRequiresNoTrainingUse"] !== true)
    reasons.push("input_isolation_requires_no_training_use_false");
  if (o["inputIsolationRequiresUserLanguageSelection"] !== true)
    reasons.push("input_isolation_requires_user_language_selection_false");
  if (o["inputIsolationRequiresClearPrivacyNotice"] !== true)
    reasons.push("input_isolation_requires_clear_privacy_notice_false");

  // Commercial boundary requirements
  if (o["commercialBoundaryRequiresFreeQuestionModeSeparation"] !== true)
    reasons.push("commercial_boundary_requires_free_question_mode_separation_false");
  if (o["commercialBoundaryRequiresPaidDocumentModeSeparation"] !== true)
    reasons.push("commercial_boundary_requires_paid_document_mode_separation_false");
  if (o["commercialBoundaryRequiresDocumentBypassGuard"] !== true)
    reasons.push("commercial_boundary_requires_document_bypass_guard_false");
  if (o["commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("commercial_boundary_requires_no_full_document_explanation_in_free_qa_false");
  if (o["commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation"] !== true)
    reasons.push("commercial_boundary_requires_payment_before_full_document_explanation_false");
  if (o["commercialBoundaryRequiresSuccessfulProcessingDefinition"] !== true)
    reasons.push("commercial_boundary_requires_successful_processing_definition_false");
  if (o["commercialBoundaryRequiresFailureNoChargePolicy"] !== true)
    reasons.push("commercial_boundary_requires_failure_no_charge_policy_false");

  if (o["readyFor8x4GControlledRealDocumentUserVisibleOutputContract"] !== true)
    reasons.push("not_ready_for_8_4g_user_visible_output_contract");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentOcrAndStorageIsolationPlan(): ControlledRealDocumentOcrAndStorageIsolationPlanResult {
  // ── Step 1: Obtain 8.4E evidence gate mapping plan result ──────────────────
  const gateResult = runControlledRealDocumentEvidenceGateMappingPlan();

  const prereqAllPassed = gateResult.allPassed;
  const prereqReady =
    gateResult.readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan;

  // ── Step 2: Build canonical OCR/storage isolation input ───────────────────
  const canonicalInput: ControlledRealDocumentOcrAndStorageIsolationPlanInput =
    {
      prereqCheckId: gateResult.checkId,
      prereqAllPassed,
      structuredExtractionReadyForEvidenceGateMappingPlan:
        gateResult.structuredExtractionReadyForEvidenceGateMappingPlan,
      controlledRealDocumentEvidenceGateMappingPlanAccepted:
        gateResult.controlledRealDocumentEvidenceGateMappingPlanAccepted,
      evidenceGateMappingPlanOnly: gateResult.evidenceGateMappingPlanOnly,
      readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: prereqReady,

      actualEvidenceEvaluationPerformed:
        gateResult.actualEvidenceEvaluationPerformed,
      actualClaimAuthorizationPerformed:
        gateResult.actualClaimAuthorizationPerformed,
      actualRealityAuthorizationPerformed:
        gateResult.actualRealityAuthorizationPerformed,
      actualTrapActivationPerformed: gateResult.actualTrapActivationPerformed,
      actualDeadlineCalculationPerformed:
        gateResult.actualDeadlineCalculationPerformed,

      evidenceGateMappingRequiresPriorRedaction:
        gateResult.evidenceGateMappingRequiresPriorRedaction,
      evidenceGateMappingRequiresStructuredExtraction:
        gateResult.evidenceGateMappingRequiresStructuredExtraction,
      evidenceGateMappingRequiresPlaceholderMap:
        gateResult.evidenceGateMappingRequiresPlaceholderMap,
      evidenceGateMappingRequiresFieldAllowlist:
        gateResult.evidenceGateMappingRequiresFieldAllowlist,
      evidenceGateMappingRequiresSourceAnchors:
        gateResult.evidenceGateMappingRequiresSourceAnchors,
      evidenceGateMappingRequiresConfidenceLabels:
        gateResult.evidenceGateMappingRequiresConfidenceLabels,
      evidenceGateMappingRequiresUnknownWhenMissing:
        gateResult.evidenceGateMappingRequiresUnknownWhenMissing,
      evidenceGateMappingRequiresNoInferenceFromAbsence:
        gateResult.evidenceGateMappingRequiresNoInferenceFromAbsence,
      evidenceGateMappingRequiresCueToClaimSeparation:
        gateResult.evidenceGateMappingRequiresCueToClaimSeparation,
      evidenceGateMappingRequiresClaimToEvidenceSeparation:
        gateResult.evidenceGateMappingRequiresClaimToEvidenceSeparation,
      evidenceGateMappingRequiresDateRoleSeparation:
        gateResult.evidenceGateMappingRequiresDateRoleSeparation,
      evidenceGateMappingRequiresBekanntgabeExplicitness:
        gateResult.evidenceGateMappingRequiresBekanntgabeExplicitness,
      evidenceGateMappingRequiresDeliveryDateExplicitness:
        gateResult.evidenceGateMappingRequiresDeliveryDateExplicitness,
      evidenceGateMappingRequiresMissingEvidenceBlocksClaim:
        gateResult.evidenceGateMappingRequiresMissingEvidenceBlocksClaim,
      evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty:
        gateResult.evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty,
      evidenceGateMappingRequiresNoDeadlineInvention:
        gateResult.evidenceGateMappingRequiresNoDeadlineInvention,
      evidenceGateMappingRequiresNoLegalCertainty:
        gateResult.evidenceGateMappingRequiresNoLegalCertainty,
      evidenceGateMappingRequiresNoCoerciveLegalInstruction:
        gateResult.evidenceGateMappingRequiresNoCoerciveLegalInstruction,
      evidenceGateMappingRequiresHumanReviewPolicy:
        gateResult.evidenceGateMappingRequiresHumanReviewPolicy,
      evidenceGateMappingRequiresAuditTrace:
        gateResult.evidenceGateMappingRequiresAuditTrace,
      evidenceGateMappingRequiresTamperCoverage:
        gateResult.evidenceGateMappingRequiresTamperCoverage,

      realDocumentInputAuthorizedNow: gateResult.realDocumentInputAuthorizedNow,
      realDocumentProcessingAuthorizedNow:
        gateResult.realDocumentProcessingAuthorizedNow,
      realUserDocumentUploadAuthorizedNow:
        gateResult.realUserDocumentUploadAuthorizedNow,
      ocrRuntimeAuthorizedNow: gateResult.ocrRuntimeAuthorizedNow,
      photoInputAuthorizedNow: gateResult.photoInputAuthorizedNow,
      fileInputAuthorizedNow: gateResult.fileInputAuthorizedNow,
      documentStorageAuthorizedNow: gateResult.documentStorageAuthorizedNow,
      persistenceAuthorizedNow: gateResult.persistenceAuthorizedNow,
      publicRuntimeAuthorizedNow: gateResult.publicRuntimeAuthorizedNow,
      userVisibleLegalDeadlineOutputAuthorizedNow:
        gateResult.userVisibleLegalDeadlineOutputAuthorizedNow,
      liveLLMRuntimeAuthorizedNow: gateResult.liveLLMRuntimeAuthorizedNow,
      connectedAiRuntimeAuthorizedNow:
        gateResult.connectedAiRuntimeAuthorizedNow,
      pilotRuntimeAuthorizedNow: gateResult.pilotRuntimeAuthorizedNow,
      productionRuntimeAuthorizedNow: gateResult.productionRuntimeAuthorizedNow,

      exactDeadlineCalculationAuthorized:
        gateResult.exactDeadlineCalculationAuthorized,
      deliveryDateInventionAuthorized:
        gateResult.deliveryDateInventionAuthorized,
      finalDateInventionAuthorized: gateResult.finalDateInventionAuthorized,
      legalCertaintyAuthorized: gateResult.legalCertaintyAuthorized,
      coerciveLegalInstructionAuthorized:
        gateResult.coerciveLegalInstructionAuthorized,
      deliveryDateRequiredForExactDeadline:
        gateResult.deliveryDateRequiredForExactDeadline,

      readyForRealDocumentInput: gateResult.readyForRealDocumentInput,
      readyForUserVisibleOutput: gateResult.readyForUserVisibleOutput,
      publicRuntimeEnabled: gateResult.publicRuntimeEnabled,
      persistenceUsed: gateResult.persistenceUsed,
      neverUserVisible: gateResult.neverUserVisible,

      ocrAndStorageIsolationPlanOnly: true,
      actualOcrPerformed: false,
      actualPhotoInputProcessed: false,
      actualFileInputProcessed: false,
      actualDocumentStoragePerformed: false,
      actualDatabasePersistencePerformed: false,
      actualAuditPersistencePerformed: false,
      actualUserVisibleOutputPerformed: false,
      actualPublicRuntimeEnabled: false,

      ocrIsolationRequiresSeparateRuntimeBoundary: prereqAllPassed && prereqReady,
      ocrIsolationRequiresUntrustedOcrOutput: prereqAllPassed && prereqReady,
      ocrIsolationRequiresNoRawImageToModel: prereqAllPassed && prereqReady,
      ocrIsolationRequiresNoRawOcrToUserVisibleOutput:
        prereqAllPassed && prereqReady,
      ocrIsolationRequiresRedactionBeforeModelUse: prereqAllPassed && prereqReady,
      ocrIsolationRequiresEvidenceGateBeforeInterpretation:
        prereqAllPassed && prereqReady,
      ocrIsolationRequiresConfidenceLabels: prereqAllPassed && prereqReady,
      ocrIsolationRequiresUnknownWhenUnreadable: prereqAllPassed && prereqReady,
      ocrIsolationRequiresNoInferenceFromUnreadableText:
        prereqAllPassed && prereqReady,
      ocrIsolationRequiresHumanReviewForLowConfidence:
        prereqAllPassed && prereqReady,
      ocrIsolationRequiresTamperCoverage: prereqAllPassed && prereqReady,
      ocrIsolationRequiresAuditTrace: prereqAllPassed && prereqReady,

      storageIsolationRequiresNoDefaultPersistence:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresEphemeralProcessingByDefault:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresExplicitConsentBeforeStorage:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresRawDocumentStorageBlockedByDefault:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresRedactedArtifactOnlyIfAuthorized:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresAuditMetadataOnlyByDefault:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresNoPromptOrModelOutputStorage:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresNoApiKeyStorage: prereqAllPassed && prereqReady,
      storageIsolationRequiresDeletionPolicy: prereqAllPassed && prereqReady,
      storageIsolationRequiresRetentionPolicy: prereqAllPassed && prereqReady,
      storageIsolationRequiresAccessControlPolicy: prereqAllPassed && prereqReady,
      storageIsolationRequiresEncryptionPolicy: prereqAllPassed && prereqReady,
      storageIsolationRequiresUserExportPolicy: prereqAllPassed && prereqReady,
      storageIsolationRequiresUserDeletionRequestPolicy:
        prereqAllPassed && prereqReady,
      storageIsolationRequiresTamperCoverage: prereqAllPassed && prereqReady,
      storageIsolationRequiresAuditTrace: prereqAllPassed && prereqReady,

      inputIsolationRequiresExplicitDocumentMode: prereqAllPassed && prereqReady,
      inputIsolationRequiresPaidDocumentModeBoundary:
        prereqAllPassed && prereqReady,
      inputIsolationRequiresFreeQaBypassGuard: prereqAllPassed && prereqReady,
      inputIsolationRequiresUploadNotAvailableInFreeQa:
        prereqAllPassed && prereqReady,
      inputIsolationRequiresFileTypeAllowlist: prereqAllPassed && prereqReady,
      inputIsolationRequiresSizeLimit: prereqAllPassed && prereqReady,
      inputIsolationRequiresMalwareSafetyBoundary: prereqAllPassed && prereqReady,
      inputIsolationRequiresNoDirectPublicUrlExposure:
        prereqAllPassed && prereqReady,
      inputIsolationRequiresNoCrossUserAccess: prereqAllPassed && prereqReady,
      inputIsolationRequiresNoTrainingUse: prereqAllPassed && prereqReady,
      inputIsolationRequiresUserLanguageSelection: prereqAllPassed && prereqReady,
      inputIsolationRequiresClearPrivacyNotice: prereqAllPassed && prereqReady,

      commercialBoundaryRequiresFreeQuestionModeSeparation:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresPaidDocumentModeSeparation:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresDocumentBypassGuard:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresSuccessfulProcessingDefinition:
        prereqAllPassed && prereqReady,
      commercialBoundaryRequiresFailureNoChargePolicy:
        prereqAllPassed && prereqReady,

      readyFor8x4GControlledRealDocumentUserVisibleOutputContract:
        prereqAllPassed && prereqReady,
    };

  // ── Step 3: Validate canonical OCR/storage isolation input ────────────────
  const ocrStorageValidation = validateOcrStorageInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const ocrStorageAccepted = ocrStorageValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4E checkId wrong", override: { prereqCheckId: "8.4D" } },
    { label: "8.4E allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentEvidenceGateMappingPlanAccepted false", override: { controlledRealDocumentEvidenceGateMappingPlanAccepted: false } },
    { label: "evidenceGateMappingPlanOnly false", override: { evidenceGateMappingPlanOnly: false } },
    { label: "actualEvidenceEvaluationPerformed true", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualRealityAuthorizationPerformed true", override: { actualRealityAuthorizationPerformed: true } },
    { label: "actualTrapActivationPerformed true", override: { actualTrapActivationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true", override: { actualDeadlineCalculationPerformed: true } },
    { label: "readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan false", override: { readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan: false } },
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
    { label: "evidenceGateMappingRequiresMissingEvidenceBlocksClaim false", override: { evidenceGateMappingRequiresMissingEvidenceBlocksClaim: false } },
    { label: "evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty false", override: { evidenceGateMappingRequiresAmbiguousEvidenceBlocksCertainty: false } },
    { label: "evidenceGateMappingRequiresNoDeadlineInvention false", override: { evidenceGateMappingRequiresNoDeadlineInvention: false } },
    { label: "evidenceGateMappingRequiresNoLegalCertainty false", override: { evidenceGateMappingRequiresNoLegalCertainty: false } },
    { label: "evidenceGateMappingRequiresNoCoerciveLegalInstruction false", override: { evidenceGateMappingRequiresNoCoerciveLegalInstruction: false } },
    { label: "evidenceGateMappingRequiresHumanReviewPolicy false", override: { evidenceGateMappingRequiresHumanReviewPolicy: false } },
    { label: "evidenceGateMappingRequiresAuditTrace false", override: { evidenceGateMappingRequiresAuditTrace: false } },
    { label: "evidenceGateMappingRequiresTamperCoverage false", override: { evidenceGateMappingRequiresTamperCoverage: false } },
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
    { label: "ocrAndStorageIsolationPlanOnly false", override: { ocrAndStorageIsolationPlanOnly: false } },
    { label: "actualOcrPerformed true", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true", override: { actualAuditPersistencePerformed: true } },
    { label: "actualUserVisibleOutputPerformed true", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualEvidenceEvaluationPerformed true (8.4F check)", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true (8.4F check)", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true (8.4F check)", override: { actualDeadlineCalculationPerformed: true } },
    { label: "ocrIsolationRequiresSeparateRuntimeBoundary false", override: { ocrIsolationRequiresSeparateRuntimeBoundary: false } },
    { label: "ocrIsolationRequiresUntrustedOcrOutput false", override: { ocrIsolationRequiresUntrustedOcrOutput: false } },
    { label: "ocrIsolationRequiresNoRawImageToModel false", override: { ocrIsolationRequiresNoRawImageToModel: false } },
    { label: "ocrIsolationRequiresNoRawOcrToUserVisibleOutput false", override: { ocrIsolationRequiresNoRawOcrToUserVisibleOutput: false } },
    { label: "ocrIsolationRequiresRedactionBeforeModelUse false", override: { ocrIsolationRequiresRedactionBeforeModelUse: false } },
    { label: "ocrIsolationRequiresEvidenceGateBeforeInterpretation false", override: { ocrIsolationRequiresEvidenceGateBeforeInterpretation: false } },
    { label: "ocrIsolationRequiresConfidenceLabels false", override: { ocrIsolationRequiresConfidenceLabels: false } },
    { label: "ocrIsolationRequiresUnknownWhenUnreadable false", override: { ocrIsolationRequiresUnknownWhenUnreadable: false } },
    { label: "ocrIsolationRequiresNoInferenceFromUnreadableText false", override: { ocrIsolationRequiresNoInferenceFromUnreadableText: false } },
    { label: "ocrIsolationRequiresHumanReviewForLowConfidence false", override: { ocrIsolationRequiresHumanReviewForLowConfidence: false } },
    { label: "ocrIsolationRequiresTamperCoverage false", override: { ocrIsolationRequiresTamperCoverage: false } },
    { label: "ocrIsolationRequiresAuditTrace false", override: { ocrIsolationRequiresAuditTrace: false } },
    { label: "storageIsolationRequiresNoDefaultPersistence false", override: { storageIsolationRequiresNoDefaultPersistence: false } },
    { label: "storageIsolationRequiresEphemeralProcessingByDefault false", override: { storageIsolationRequiresEphemeralProcessingByDefault: false } },
    { label: "storageIsolationRequiresExplicitConsentBeforeStorage false", override: { storageIsolationRequiresExplicitConsentBeforeStorage: false } },
    { label: "storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence false", override: { storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence: false } },
    { label: "storageIsolationRequiresRawDocumentStorageBlockedByDefault false", override: { storageIsolationRequiresRawDocumentStorageBlockedByDefault: false } },
    { label: "storageIsolationRequiresRedactedArtifactOnlyIfAuthorized false", override: { storageIsolationRequiresRedactedArtifactOnlyIfAuthorized: false } },
    { label: "storageIsolationRequiresAuditMetadataOnlyByDefault false", override: { storageIsolationRequiresAuditMetadataOnlyByDefault: false } },
    { label: "storageIsolationRequiresNoPromptOrModelOutputStorage false", override: { storageIsolationRequiresNoPromptOrModelOutputStorage: false } },
    { label: "storageIsolationRequiresNoApiKeyStorage false", override: { storageIsolationRequiresNoApiKeyStorage: false } },
    { label: "storageIsolationRequiresDeletionPolicy false", override: { storageIsolationRequiresDeletionPolicy: false } },
    { label: "storageIsolationRequiresRetentionPolicy false", override: { storageIsolationRequiresRetentionPolicy: false } },
    { label: "storageIsolationRequiresAccessControlPolicy false", override: { storageIsolationRequiresAccessControlPolicy: false } },
    { label: "storageIsolationRequiresEncryptionPolicy false", override: { storageIsolationRequiresEncryptionPolicy: false } },
    { label: "storageIsolationRequiresUserExportPolicy false", override: { storageIsolationRequiresUserExportPolicy: false } },
    { label: "storageIsolationRequiresUserDeletionRequestPolicy false", override: { storageIsolationRequiresUserDeletionRequestPolicy: false } },
    { label: "storageIsolationRequiresTamperCoverage false", override: { storageIsolationRequiresTamperCoverage: false } },
    { label: "storageIsolationRequiresAuditTrace false", override: { storageIsolationRequiresAuditTrace: false } },
    { label: "inputIsolationRequiresExplicitDocumentMode false", override: { inputIsolationRequiresExplicitDocumentMode: false } },
    { label: "inputIsolationRequiresPaidDocumentModeBoundary false", override: { inputIsolationRequiresPaidDocumentModeBoundary: false } },
    { label: "inputIsolationRequiresFreeQaBypassGuard false", override: { inputIsolationRequiresFreeQaBypassGuard: false } },
    { label: "inputIsolationRequiresUploadNotAvailableInFreeQa false", override: { inputIsolationRequiresUploadNotAvailableInFreeQa: false } },
    { label: "inputIsolationRequiresFileTypeAllowlist false", override: { inputIsolationRequiresFileTypeAllowlist: false } },
    { label: "inputIsolationRequiresSizeLimit false", override: { inputIsolationRequiresSizeLimit: false } },
    { label: "inputIsolationRequiresMalwareSafetyBoundary false", override: { inputIsolationRequiresMalwareSafetyBoundary: false } },
    { label: "inputIsolationRequiresNoDirectPublicUrlExposure false", override: { inputIsolationRequiresNoDirectPublicUrlExposure: false } },
    { label: "inputIsolationRequiresNoCrossUserAccess false", override: { inputIsolationRequiresNoCrossUserAccess: false } },
    { label: "inputIsolationRequiresNoTrainingUse false", override: { inputIsolationRequiresNoTrainingUse: false } },
    { label: "inputIsolationRequiresUserLanguageSelection false", override: { inputIsolationRequiresUserLanguageSelection: false } },
    { label: "inputIsolationRequiresClearPrivacyNotice false", override: { inputIsolationRequiresClearPrivacyNotice: false } },
    { label: "commercialBoundaryRequiresFreeQuestionModeSeparation false", override: { commercialBoundaryRequiresFreeQuestionModeSeparation: false } },
    { label: "commercialBoundaryRequiresPaidDocumentModeSeparation false", override: { commercialBoundaryRequiresPaidDocumentModeSeparation: false } },
    { label: "commercialBoundaryRequiresDocumentBypassGuard false", override: { commercialBoundaryRequiresDocumentBypassGuard: false } },
    { label: "commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa false", override: { commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa: false } },
    { label: "commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation false", override: { commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation: false } },
    { label: "commercialBoundaryRequiresSuccessfulProcessingDefinition false", override: { commercialBoundaryRequiresSuccessfulProcessingDefinition: false } },
    { label: "commercialBoundaryRequiresFailureNoChargePolicy false", override: { commercialBoundaryRequiresFailureNoChargePolicy: false } },
    { label: "readyFor8x4GControlledRealDocumentUserVisibleOutputContract false", override: { readyFor8x4GControlledRealDocumentUserVisibleOutputContract: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateOcrStorageInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    ocrStorageAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4F: controlled real-document OCR and storage isolation plan layer — depends on completed 8.4E controlled real-document evidence gate mapping plan",
    "8.4F is planning only — not real document input or processing",
    "no OCR was performed",
    "no photo or file input was processed",
    "no document storage was performed",
    "no database persistence was performed",
    "no audit persistence was performed",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no live LLM call was performed in 8.4F",
    "8.3AC was not re-run",
    "OCR output must be treated as untrusted",
    "raw images and raw OCR must not go directly to the model or user-visible output",
    "storage must be ephemeral by default unless separately authorized",
    "raw document storage is blocked by default",
    "Free Q&A and Paid Document Mode must remain separated",
    "free Q&A must include a document bypass guard",
    "full document explanation requires Paid Document Mode",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "the next phase is 8.4G controlled real-document user-visible output contract",
    "8.4G is still planning only unless explicitly authorized later",
    `8.4E prerequisite: allPassed=${gateResult.allPassed}, readyFor8x4F=${gateResult.readyFor8x4FControlledRealDocumentOcrAndStorageIsolationPlan}`,
    `OCR/storage isolation input validation: ${ocrStorageAccepted ? "accepted" : "REJECTED"} — reasons: ${ocrStorageValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4F allPassed: true — controlled real-document OCR and storage isolation plan accepted"
    );
    notes.push(
      "readyFor8x4GControlledRealDocumentUserVisibleOutputContract: true — planning only"
    );
  }

  return {
    checkId: "8.4F",
    allPassed,
    evidenceGateMappingReadyForOcrAndStorageIsolationPlan:
      canonicalInput.controlledRealDocumentEvidenceGateMappingPlanAccepted,
    controlledRealDocumentOcrAndStorageIsolationPlanAccepted: allPassed,
    ocrAndStorageIsolationPlanOnly: true,
    tamperCasesRejected: allTamperRejected,

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

    ocrIsolationRequiresSeparateRuntimeBoundary:
      canonicalInput.ocrIsolationRequiresSeparateRuntimeBoundary,
    ocrIsolationRequiresUntrustedOcrOutput:
      canonicalInput.ocrIsolationRequiresUntrustedOcrOutput,
    ocrIsolationRequiresNoRawImageToModel:
      canonicalInput.ocrIsolationRequiresNoRawImageToModel,
    ocrIsolationRequiresNoRawOcrToUserVisibleOutput:
      canonicalInput.ocrIsolationRequiresNoRawOcrToUserVisibleOutput,
    ocrIsolationRequiresRedactionBeforeModelUse:
      canonicalInput.ocrIsolationRequiresRedactionBeforeModelUse,
    ocrIsolationRequiresEvidenceGateBeforeInterpretation:
      canonicalInput.ocrIsolationRequiresEvidenceGateBeforeInterpretation,
    ocrIsolationRequiresConfidenceLabels:
      canonicalInput.ocrIsolationRequiresConfidenceLabels,
    ocrIsolationRequiresUnknownWhenUnreadable:
      canonicalInput.ocrIsolationRequiresUnknownWhenUnreadable,
    ocrIsolationRequiresNoInferenceFromUnreadableText:
      canonicalInput.ocrIsolationRequiresNoInferenceFromUnreadableText,
    ocrIsolationRequiresHumanReviewForLowConfidence:
      canonicalInput.ocrIsolationRequiresHumanReviewForLowConfidence,
    ocrIsolationRequiresTamperCoverage:
      canonicalInput.ocrIsolationRequiresTamperCoverage,
    ocrIsolationRequiresAuditTrace: canonicalInput.ocrIsolationRequiresAuditTrace,

    storageIsolationRequiresNoDefaultPersistence:
      canonicalInput.storageIsolationRequiresNoDefaultPersistence,
    storageIsolationRequiresEphemeralProcessingByDefault:
      canonicalInput.storageIsolationRequiresEphemeralProcessingByDefault,
    storageIsolationRequiresExplicitConsentBeforeStorage:
      canonicalInput.storageIsolationRequiresExplicitConsentBeforeStorage,
    storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence:
      canonicalInput.storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence,
    storageIsolationRequiresRawDocumentStorageBlockedByDefault:
      canonicalInput.storageIsolationRequiresRawDocumentStorageBlockedByDefault,
    storageIsolationRequiresRedactedArtifactOnlyIfAuthorized:
      canonicalInput.storageIsolationRequiresRedactedArtifactOnlyIfAuthorized,
    storageIsolationRequiresAuditMetadataOnlyByDefault:
      canonicalInput.storageIsolationRequiresAuditMetadataOnlyByDefault,
    storageIsolationRequiresNoPromptOrModelOutputStorage:
      canonicalInput.storageIsolationRequiresNoPromptOrModelOutputStorage,
    storageIsolationRequiresNoApiKeyStorage:
      canonicalInput.storageIsolationRequiresNoApiKeyStorage,
    storageIsolationRequiresDeletionPolicy:
      canonicalInput.storageIsolationRequiresDeletionPolicy,
    storageIsolationRequiresRetentionPolicy:
      canonicalInput.storageIsolationRequiresRetentionPolicy,
    storageIsolationRequiresAccessControlPolicy:
      canonicalInput.storageIsolationRequiresAccessControlPolicy,
    storageIsolationRequiresEncryptionPolicy:
      canonicalInput.storageIsolationRequiresEncryptionPolicy,
    storageIsolationRequiresUserExportPolicy:
      canonicalInput.storageIsolationRequiresUserExportPolicy,
    storageIsolationRequiresUserDeletionRequestPolicy:
      canonicalInput.storageIsolationRequiresUserDeletionRequestPolicy,
    storageIsolationRequiresTamperCoverage:
      canonicalInput.storageIsolationRequiresTamperCoverage,
    storageIsolationRequiresAuditTrace:
      canonicalInput.storageIsolationRequiresAuditTrace,

    inputIsolationRequiresExplicitDocumentMode:
      canonicalInput.inputIsolationRequiresExplicitDocumentMode,
    inputIsolationRequiresPaidDocumentModeBoundary:
      canonicalInput.inputIsolationRequiresPaidDocumentModeBoundary,
    inputIsolationRequiresFreeQaBypassGuard:
      canonicalInput.inputIsolationRequiresFreeQaBypassGuard,
    inputIsolationRequiresUploadNotAvailableInFreeQa:
      canonicalInput.inputIsolationRequiresUploadNotAvailableInFreeQa,
    inputIsolationRequiresFileTypeAllowlist:
      canonicalInput.inputIsolationRequiresFileTypeAllowlist,
    inputIsolationRequiresSizeLimit: canonicalInput.inputIsolationRequiresSizeLimit,
    inputIsolationRequiresMalwareSafetyBoundary:
      canonicalInput.inputIsolationRequiresMalwareSafetyBoundary,
    inputIsolationRequiresNoDirectPublicUrlExposure:
      canonicalInput.inputIsolationRequiresNoDirectPublicUrlExposure,
    inputIsolationRequiresNoCrossUserAccess:
      canonicalInput.inputIsolationRequiresNoCrossUserAccess,
    inputIsolationRequiresNoTrainingUse:
      canonicalInput.inputIsolationRequiresNoTrainingUse,
    inputIsolationRequiresUserLanguageSelection:
      canonicalInput.inputIsolationRequiresUserLanguageSelection,
    inputIsolationRequiresClearPrivacyNotice:
      canonicalInput.inputIsolationRequiresClearPrivacyNotice,

    commercialBoundaryRequiresFreeQuestionModeSeparation:
      canonicalInput.commercialBoundaryRequiresFreeQuestionModeSeparation,
    commercialBoundaryRequiresPaidDocumentModeSeparation:
      canonicalInput.commercialBoundaryRequiresPaidDocumentModeSeparation,
    commercialBoundaryRequiresDocumentBypassGuard:
      canonicalInput.commercialBoundaryRequiresDocumentBypassGuard,
    commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa:
      canonicalInput.commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa,
    commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation:
      canonicalInput.commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation,
    commercialBoundaryRequiresSuccessfulProcessingDefinition:
      canonicalInput.commercialBoundaryRequiresSuccessfulProcessingDefinition,
    commercialBoundaryRequiresFailureNoChargePolicy:
      canonicalInput.commercialBoundaryRequiresFailureNoChargePolicy,

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

    readyFor8x4GControlledRealDocumentUserVisibleOutputContract:
      canonicalInput.readyFor8x4GControlledRealDocumentUserVisibleOutputContract,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
