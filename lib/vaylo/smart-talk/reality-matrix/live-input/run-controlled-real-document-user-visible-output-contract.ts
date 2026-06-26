/**
 * Phase 8.4G — Controlled Real Document User-Visible Output Contract.
 *
 * PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4F.
 *
 * This file defines what a future customer-facing Smart Talk document
 * explanation may and may not say, after real-document processing becomes
 * separately authorized. It is:
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
 *   - Persist anything.
 *   - Emit user-visible output.
 *   - Generate any actual customer-facing explanation.
 */

import { runControlledRealDocumentOcrAndStorageIsolationPlan } from "./run-controlled-real-document-ocr-and-storage-isolation-plan";

// ── Local user-visible output contract input type ─────────────────────────────

interface ControlledRealDocumentUserVisibleOutputContractInput {
  // 8.4F prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly evidenceGateMappingReadyForOcrAndStorageIsolationPlan: boolean;
  readonly controlledRealDocumentOcrAndStorageIsolationPlanAccepted: boolean;
  readonly ocrAndStorageIsolationPlanOnly: boolean;
  readonly readyFor8x4GControlledRealDocumentUserVisibleOutputContract: boolean;

  // 8.4F actual* performed flags (must be false)
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

  // 8.4F OCR isolation requirements (must be true)
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

  // 8.4F storage isolation requirements (must be true)
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

  // 8.4F input isolation requirements (must be true)
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

  // 8.4F commercial boundary requirements (must be true)
  readonly commercialBoundaryRequiresFreeQuestionModeSeparation: boolean;
  readonly commercialBoundaryRequiresPaidDocumentModeSeparation: boolean;
  readonly commercialBoundaryRequiresDocumentBypassGuard: boolean;
  readonly commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa: boolean;
  readonly commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation: boolean;
  readonly commercialBoundaryRequiresSuccessfulProcessingDefinition: boolean;
  readonly commercialBoundaryRequiresFailureNoChargePolicy: boolean;

  // 8.4F runtime authorization flags (must be false)
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

  // 8.4F runtime/public invariants
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4G assertions
  readonly userVisibleOutputContractOnly: boolean;

  // 8.4G output contract requirements
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

  // Legal/safety wording requirements
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

  // Commercial boundary requirements (8.4G layer)
  readonly outputContractRequiresFreeQuestionModeSeparation: boolean;
  readonly outputContractRequiresPaidDocumentModeSeparation: boolean;
  readonly outputContractRequiresDocumentBypassGuard: boolean;
  readonly outputContractRequiresNoFullDocumentExplanationInFreeQa: boolean;
  readonly outputContractRequiresPaymentBeforeFullDocumentExplanation: boolean;
  readonly outputContractRequiresSuccessfulProcessingDefinition: boolean;
  readonly outputContractRequiresFailureNoChargePolicy: boolean;
  readonly outputContractRequiresClearDocumentModeConsent: boolean;

  // Allowed future section labels (labels only, not generated content)
  readonly allowedFutureSectionSummaryLabel: string;
  readonly allowedFutureSectionTranslationLabel: string;
  readonly allowedFutureSectionMeaningLabel: string;
  readonly allowedFutureSectionUrgencyLabel: string;
  readonly allowedFutureSectionNextStepsLabel: string;
  readonly allowedFutureSectionWarningsLabel: string;
  readonly allowedFutureSectionUncertaintyLabel: string;
  readonly allowedFutureSectionEvidenceNotesLabel: string;

  readonly readyFor8x4HControlledRealDocumentFinalReadinessAudit: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentUserVisibleOutputContractResult {
  readonly checkId: "8.4G";
  readonly allPassed: boolean;
  readonly ocrAndStorageIsolationReadyForUserVisibleOutputContract: boolean;
  readonly controlledRealDocumentUserVisibleOutputContractAccepted: boolean;
  readonly userVisibleOutputContractOnly: true;
  readonly tamperCasesRejected: boolean;

  readonly actualUserVisibleOutputPerformed: false;
  readonly actualPublicRuntimeEnabled: false;
  readonly actualOcrPerformed: false;
  readonly actualPhotoInputProcessed: false;
  readonly actualFileInputProcessed: false;
  readonly actualDocumentStoragePerformed: false;
  readonly actualDatabasePersistencePerformed: false;
  readonly actualAuditPersistencePerformed: false;
  readonly actualEvidenceEvaluationPerformed: false;
  readonly actualClaimAuthorizationPerformed: false;
  readonly actualDeadlineCalculationPerformed: false;

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

  readonly allowedFutureSectionSummaryLabel: "summary";
  readonly allowedFutureSectionTranslationLabel: "translation";
  readonly allowedFutureSectionMeaningLabel: "meaning";
  readonly allowedFutureSectionUrgencyLabel: "urgency";
  readonly allowedFutureSectionNextStepsLabel: "next_steps";
  readonly allowedFutureSectionWarningsLabel: "warnings";
  readonly allowedFutureSectionUncertaintyLabel: "uncertainty";
  readonly allowedFutureSectionEvidenceNotesLabel: "evidence_notes";

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

  readonly readyFor8x4HControlledRealDocumentFinalReadinessAudit: boolean;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── User-visible output contract input validator ───────────────────────────────

function validateOutputContractInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4F prerequisite gates
  if (o["prereqCheckId"] !== "8.4F")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentOcrAndStorageIsolationPlanAccepted"] !== true)
    reasons.push("ocr_and_storage_isolation_plan_not_accepted");
  if (o["ocrAndStorageIsolationPlanOnly"] !== true)
    reasons.push("ocr_and_storage_isolation_plan_only_false");
  if (o["readyFor8x4GControlledRealDocumentUserVisibleOutputContract"] !== true)
    reasons.push("not_ready_for_8_4g_user_visible_output_contract");

  // 8.4F actual* performed flags (must be false)
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

  // 8.4F OCR isolation requirements (must be true)
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

  // 8.4F storage isolation requirements (must be true)
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

  // 8.4F input isolation requirements (must be true)
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

  // 8.4F commercial boundary requirements (must be true)
  if (o["commercialBoundaryRequiresFreeQuestionModeSeparation"] !== true)
    reasons.push("commercial_boundary_requires_free_question_mode_separation_false");
  if (o["commercialBoundaryRequiresPaidDocumentModeSeparation"] !== true)
    reasons.push("commercial_boundary_requires_paid_document_mode_separation_false");
  if (o["commercialBoundaryRequiresDocumentBypassGuard"] !== true)
    reasons.push("commercial_boundary_requires_document_bypass_guard_false");
  if (o["commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa"] !== true)
    reasons.push("commercial_boundary_requires_no_full_doc_explanation_in_free_qa_false");
  if (o["commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation"] !== true)
    reasons.push("commercial_boundary_requires_payment_before_full_doc_explanation_false");
  if (o["commercialBoundaryRequiresSuccessfulProcessingDefinition"] !== true)
    reasons.push("commercial_boundary_requires_successful_processing_definition_false");
  if (o["commercialBoundaryRequiresFailureNoChargePolicy"] !== true)
    reasons.push("commercial_boundary_requires_failure_no_charge_policy_false");

  // 8.4F runtime authorization flags (must be false)
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

  // 8.4F runtime/public invariants
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

  // 8.4G derived assertion
  if (o["userVisibleOutputContractOnly"] !== true)
    reasons.push("user_visible_output_contract_only_false");

  // 8.4G output contract requirements
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

  // Legal/safety wording requirements
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

  // Commercial boundary requirements (8.4G)
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

  // Allowed future section labels
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

  if (o["readyFor8x4HControlledRealDocumentFinalReadinessAudit"] !== true)
    reasons.push("not_ready_for_8_4h_final_readiness_audit");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentUserVisibleOutputContract(): ControlledRealDocumentUserVisibleOutputContractResult {
  // ── Step 1: Obtain 8.4F OCR/storage isolation plan result ─────────────────
  const ocrResult = runControlledRealDocumentOcrAndStorageIsolationPlan();

  const prereqAllPassed = ocrResult.allPassed;
  const prereqReady =
    ocrResult.readyFor8x4GControlledRealDocumentUserVisibleOutputContract;

  // ── Step 2: Build canonical output contract input ─────────────────────────
  const canonicalInput: ControlledRealDocumentUserVisibleOutputContractInput = {
    prereqCheckId: ocrResult.checkId,
    prereqAllPassed,
    evidenceGateMappingReadyForOcrAndStorageIsolationPlan:
      ocrResult.evidenceGateMappingReadyForOcrAndStorageIsolationPlan,
    controlledRealDocumentOcrAndStorageIsolationPlanAccepted:
      ocrResult.controlledRealDocumentOcrAndStorageIsolationPlanAccepted,
    ocrAndStorageIsolationPlanOnly: ocrResult.ocrAndStorageIsolationPlanOnly,
    readyFor8x4GControlledRealDocumentUserVisibleOutputContract: prereqReady,

    actualOcrPerformed: ocrResult.actualOcrPerformed,
    actualPhotoInputProcessed: ocrResult.actualPhotoInputProcessed,
    actualFileInputProcessed: ocrResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: ocrResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed:
      ocrResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: ocrResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: ocrResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: ocrResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed:
      ocrResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed:
      ocrResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed:
      ocrResult.actualDeadlineCalculationPerformed,

    ocrIsolationRequiresSeparateRuntimeBoundary:
      ocrResult.ocrIsolationRequiresSeparateRuntimeBoundary,
    ocrIsolationRequiresUntrustedOcrOutput:
      ocrResult.ocrIsolationRequiresUntrustedOcrOutput,
    ocrIsolationRequiresNoRawImageToModel:
      ocrResult.ocrIsolationRequiresNoRawImageToModel,
    ocrIsolationRequiresNoRawOcrToUserVisibleOutput:
      ocrResult.ocrIsolationRequiresNoRawOcrToUserVisibleOutput,
    ocrIsolationRequiresRedactionBeforeModelUse:
      ocrResult.ocrIsolationRequiresRedactionBeforeModelUse,
    ocrIsolationRequiresEvidenceGateBeforeInterpretation:
      ocrResult.ocrIsolationRequiresEvidenceGateBeforeInterpretation,
    ocrIsolationRequiresConfidenceLabels:
      ocrResult.ocrIsolationRequiresConfidenceLabels,
    ocrIsolationRequiresUnknownWhenUnreadable:
      ocrResult.ocrIsolationRequiresUnknownWhenUnreadable,
    ocrIsolationRequiresNoInferenceFromUnreadableText:
      ocrResult.ocrIsolationRequiresNoInferenceFromUnreadableText,
    ocrIsolationRequiresHumanReviewForLowConfidence:
      ocrResult.ocrIsolationRequiresHumanReviewForLowConfidence,
    ocrIsolationRequiresTamperCoverage:
      ocrResult.ocrIsolationRequiresTamperCoverage,
    ocrIsolationRequiresAuditTrace: ocrResult.ocrIsolationRequiresAuditTrace,

    storageIsolationRequiresNoDefaultPersistence:
      ocrResult.storageIsolationRequiresNoDefaultPersistence,
    storageIsolationRequiresEphemeralProcessingByDefault:
      ocrResult.storageIsolationRequiresEphemeralProcessingByDefault,
    storageIsolationRequiresExplicitConsentBeforeStorage:
      ocrResult.storageIsolationRequiresExplicitConsentBeforeStorage,
    storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence:
      ocrResult.storageIsolationRequiresSeparateStoragePolicyBeforeAnyPersistence,
    storageIsolationRequiresRawDocumentStorageBlockedByDefault:
      ocrResult.storageIsolationRequiresRawDocumentStorageBlockedByDefault,
    storageIsolationRequiresRedactedArtifactOnlyIfAuthorized:
      ocrResult.storageIsolationRequiresRedactedArtifactOnlyIfAuthorized,
    storageIsolationRequiresAuditMetadataOnlyByDefault:
      ocrResult.storageIsolationRequiresAuditMetadataOnlyByDefault,
    storageIsolationRequiresNoPromptOrModelOutputStorage:
      ocrResult.storageIsolationRequiresNoPromptOrModelOutputStorage,
    storageIsolationRequiresNoApiKeyStorage:
      ocrResult.storageIsolationRequiresNoApiKeyStorage,
    storageIsolationRequiresDeletionPolicy:
      ocrResult.storageIsolationRequiresDeletionPolicy,
    storageIsolationRequiresRetentionPolicy:
      ocrResult.storageIsolationRequiresRetentionPolicy,
    storageIsolationRequiresAccessControlPolicy:
      ocrResult.storageIsolationRequiresAccessControlPolicy,
    storageIsolationRequiresEncryptionPolicy:
      ocrResult.storageIsolationRequiresEncryptionPolicy,
    storageIsolationRequiresUserExportPolicy:
      ocrResult.storageIsolationRequiresUserExportPolicy,
    storageIsolationRequiresUserDeletionRequestPolicy:
      ocrResult.storageIsolationRequiresUserDeletionRequestPolicy,
    storageIsolationRequiresTamperCoverage:
      ocrResult.storageIsolationRequiresTamperCoverage,
    storageIsolationRequiresAuditTrace: ocrResult.storageIsolationRequiresAuditTrace,

    inputIsolationRequiresExplicitDocumentMode:
      ocrResult.inputIsolationRequiresExplicitDocumentMode,
    inputIsolationRequiresPaidDocumentModeBoundary:
      ocrResult.inputIsolationRequiresPaidDocumentModeBoundary,
    inputIsolationRequiresFreeQaBypassGuard:
      ocrResult.inputIsolationRequiresFreeQaBypassGuard,
    inputIsolationRequiresUploadNotAvailableInFreeQa:
      ocrResult.inputIsolationRequiresUploadNotAvailableInFreeQa,
    inputIsolationRequiresFileTypeAllowlist:
      ocrResult.inputIsolationRequiresFileTypeAllowlist,
    inputIsolationRequiresSizeLimit: ocrResult.inputIsolationRequiresSizeLimit,
    inputIsolationRequiresMalwareSafetyBoundary:
      ocrResult.inputIsolationRequiresMalwareSafetyBoundary,
    inputIsolationRequiresNoDirectPublicUrlExposure:
      ocrResult.inputIsolationRequiresNoDirectPublicUrlExposure,
    inputIsolationRequiresNoCrossUserAccess:
      ocrResult.inputIsolationRequiresNoCrossUserAccess,
    inputIsolationRequiresNoTrainingUse:
      ocrResult.inputIsolationRequiresNoTrainingUse,
    inputIsolationRequiresUserLanguageSelection:
      ocrResult.inputIsolationRequiresUserLanguageSelection,
    inputIsolationRequiresClearPrivacyNotice:
      ocrResult.inputIsolationRequiresClearPrivacyNotice,

    commercialBoundaryRequiresFreeQuestionModeSeparation:
      ocrResult.commercialBoundaryRequiresFreeQuestionModeSeparation,
    commercialBoundaryRequiresPaidDocumentModeSeparation:
      ocrResult.commercialBoundaryRequiresPaidDocumentModeSeparation,
    commercialBoundaryRequiresDocumentBypassGuard:
      ocrResult.commercialBoundaryRequiresDocumentBypassGuard,
    commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa:
      ocrResult.commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa,
    commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation:
      ocrResult.commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation,
    commercialBoundaryRequiresSuccessfulProcessingDefinition:
      ocrResult.commercialBoundaryRequiresSuccessfulProcessingDefinition,
    commercialBoundaryRequiresFailureNoChargePolicy:
      ocrResult.commercialBoundaryRequiresFailureNoChargePolicy,

    realDocumentInputAuthorizedNow: ocrResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      ocrResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      ocrResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: ocrResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: ocrResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: ocrResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: ocrResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: ocrResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: ocrResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      ocrResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: ocrResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: ocrResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: ocrResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: ocrResult.productionRuntimeAuthorizedNow,

    exactDeadlineCalculationAuthorized:
      ocrResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: ocrResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: ocrResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: ocrResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      ocrResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      ocrResult.deliveryDateRequiredForExactDeadline,

    readyForRealDocumentInput: ocrResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: ocrResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: ocrResult.publicRuntimeEnabled,
    persistenceUsed: ocrResult.persistenceUsed,
    neverUserVisible: ocrResult.neverUserVisible,

    userVisibleOutputContractOnly: true,

    outputContractRequiresPlainLanguageExplanation: prereqAllPassed && prereqReady,
    outputContractRequiresUserSelectedLanguage: prereqAllPassed && prereqReady,
    outputContractRequiresOriginalMeaningSummary: prereqAllPassed && prereqReady,
    outputContractRequiresDocumentTypeLabel: prereqAllPassed && prereqReady,
    outputContractRequiresAuthorityOrSenderLabel: prereqAllPassed && prereqReady,
    outputContractRequiresUrgencyLabel: prereqAllPassed && prereqReady,
    outputContractRequiresNextStepsSection: prereqAllPassed && prereqReady,
    outputContractRequiresWarningsSection: prereqAllPassed && prereqReady,
    outputContractRequiresUncertaintySection: prereqAllPassed && prereqReady,
    outputContractRequiresMissingEvidenceDisclosure: prereqAllPassed && prereqReady,
    outputContractRequiresOcrConfidenceDisclosure: prereqAllPassed && prereqReady,
    outputContractRequiresSourceAnchorsWhereAvailable:
      prereqAllPassed && prereqReady,
    outputContractRequiresNoHiddenReasoning: prereqAllPassed && prereqReady,
    outputContractRequiresNoRawDocumentLeakage: prereqAllPassed && prereqReady,
    outputContractRequiresNoPromptLeakage: prereqAllPassed && prereqReady,
    outputContractRequiresNoModelOutputLeakage: prereqAllPassed && prereqReady,
    outputContractRequiresNoApiKeyLeakage: prereqAllPassed && prereqReady,

    outputContractRequiresNoLegalAdviceClaim: prereqAllPassed && prereqReady,
    outputContractRequiresNoLegalCertainty: prereqAllPassed && prereqReady,
    outputContractRequiresNoDeadlineInvention: prereqAllPassed && prereqReady,
    outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized:
      prereqAllPassed && prereqReady,
    outputContractRequiresDeliveryOrBekanntgabeDateExplicitness:
      prereqAllPassed && prereqReady,
    outputContractRequiresNoCoerciveLegalInstruction: prereqAllPassed && prereqReady,
    outputContractRequiresHumanReviewForHighRisk: prereqAllPassed && prereqReady,
    outputContractRequiresEmergencyEscalationForHighRisk:
      prereqAllPassed && prereqReady,
    outputContractRequiresUnknownWhenEvidenceMissing: prereqAllPassed && prereqReady,
    outputContractRequiresAmbiguousEvidenceBlocksCertainty:
      prereqAllPassed && prereqReady,
    outputContractRequiresMissingEvidenceBlocksClaims:
      prereqAllPassed && prereqReady,

    outputContractRequiresFreeQuestionModeSeparation:
      prereqAllPassed && prereqReady,
    outputContractRequiresPaidDocumentModeSeparation:
      prereqAllPassed && prereqReady,
    outputContractRequiresDocumentBypassGuard: prereqAllPassed && prereqReady,
    outputContractRequiresNoFullDocumentExplanationInFreeQa:
      prereqAllPassed && prereqReady,
    outputContractRequiresPaymentBeforeFullDocumentExplanation:
      prereqAllPassed && prereqReady,
    outputContractRequiresSuccessfulProcessingDefinition:
      prereqAllPassed && prereqReady,
    outputContractRequiresFailureNoChargePolicy: prereqAllPassed && prereqReady,
    outputContractRequiresClearDocumentModeConsent: prereqAllPassed && prereqReady,

    allowedFutureSectionSummaryLabel: "summary",
    allowedFutureSectionTranslationLabel: "translation",
    allowedFutureSectionMeaningLabel: "meaning",
    allowedFutureSectionUrgencyLabel: "urgency",
    allowedFutureSectionNextStepsLabel: "next_steps",
    allowedFutureSectionWarningsLabel: "warnings",
    allowedFutureSectionUncertaintyLabel: "uncertainty",
    allowedFutureSectionEvidenceNotesLabel: "evidence_notes",

    readyFor8x4HControlledRealDocumentFinalReadinessAudit:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical output contract input ──────────────────────
  const contractValidation = validateOutputContractInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const contractAccepted = contractValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4F checkId wrong", override: { prereqCheckId: "8.4E" } },
    { label: "8.4F allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentOcrAndStorageIsolationPlanAccepted false", override: { controlledRealDocumentOcrAndStorageIsolationPlanAccepted: false } },
    { label: "ocrAndStorageIsolationPlanOnly false", override: { ocrAndStorageIsolationPlanOnly: false } },
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
    { label: "ocrIsolationRequiresUntrustedOcrOutput false", override: { ocrIsolationRequiresUntrustedOcrOutput: false } },
    { label: "ocrIsolationRequiresNoRawImageToModel false", override: { ocrIsolationRequiresNoRawImageToModel: false } },
    { label: "ocrIsolationRequiresNoRawOcrToUserVisibleOutput false", override: { ocrIsolationRequiresNoRawOcrToUserVisibleOutput: false } },
    { label: "ocrIsolationRequiresRedactionBeforeModelUse false", override: { ocrIsolationRequiresRedactionBeforeModelUse: false } },
    { label: "ocrIsolationRequiresEvidenceGateBeforeInterpretation false", override: { ocrIsolationRequiresEvidenceGateBeforeInterpretation: false } },
    { label: "storageIsolationRequiresNoDefaultPersistence false", override: { storageIsolationRequiresNoDefaultPersistence: false } },
    { label: "storageIsolationRequiresEphemeralProcessingByDefault false", override: { storageIsolationRequiresEphemeralProcessingByDefault: false } },
    { label: "storageIsolationRequiresRawDocumentStorageBlockedByDefault false", override: { storageIsolationRequiresRawDocumentStorageBlockedByDefault: false } },
    { label: "inputIsolationRequiresPaidDocumentModeBoundary false", override: { inputIsolationRequiresPaidDocumentModeBoundary: false } },
    { label: "inputIsolationRequiresFreeQaBypassGuard false", override: { inputIsolationRequiresFreeQaBypassGuard: false } },
    { label: "inputIsolationRequiresUploadNotAvailableInFreeQa false", override: { inputIsolationRequiresUploadNotAvailableInFreeQa: false } },
    { label: "inputIsolationRequiresNoTrainingUse false", override: { inputIsolationRequiresNoTrainingUse: false } },
    { label: "commercialBoundaryRequiresFreeQuestionModeSeparation false", override: { commercialBoundaryRequiresFreeQuestionModeSeparation: false } },
    { label: "commercialBoundaryRequiresPaidDocumentModeSeparation false", override: { commercialBoundaryRequiresPaidDocumentModeSeparation: false } },
    { label: "commercialBoundaryRequiresDocumentBypassGuard false", override: { commercialBoundaryRequiresDocumentBypassGuard: false } },
    { label: "commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa false", override: { commercialBoundaryRequiresNoFullDocumentExplanationInFreeQa: false } },
    { label: "commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation false", override: { commercialBoundaryRequiresPaymentBeforeFullDocumentExplanation: false } },
    { label: "readyFor8x4GControlledRealDocumentUserVisibleOutputContract false", override: { readyFor8x4GControlledRealDocumentUserVisibleOutputContract: false } },
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
    { label: "userVisibleOutputContractOnly false", override: { userVisibleOutputContractOnly: false } },
    { label: "actualUserVisibleOutputPerformed true (8.4G check)", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true (8.4G check)", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualOcrPerformed true (8.4G check)", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true (8.4G check)", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true (8.4G check)", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true (8.4G check)", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true (8.4G check)", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true (8.4G check)", override: { actualAuditPersistencePerformed: true } },
    { label: "actualEvidenceEvaluationPerformed true (8.4G check)", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true (8.4G check)", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true (8.4G check)", override: { actualDeadlineCalculationPerformed: true } },
    { label: "outputContractRequiresPlainLanguageExplanation false", override: { outputContractRequiresPlainLanguageExplanation: false } },
    { label: "outputContractRequiresUserSelectedLanguage false", override: { outputContractRequiresUserSelectedLanguage: false } },
    { label: "outputContractRequiresOriginalMeaningSummary false", override: { outputContractRequiresOriginalMeaningSummary: false } },
    { label: "outputContractRequiresDocumentTypeLabel false", override: { outputContractRequiresDocumentTypeLabel: false } },
    { label: "outputContractRequiresAuthorityOrSenderLabel false", override: { outputContractRequiresAuthorityOrSenderLabel: false } },
    { label: "outputContractRequiresUrgencyLabel false", override: { outputContractRequiresUrgencyLabel: false } },
    { label: "outputContractRequiresNextStepsSection false", override: { outputContractRequiresNextStepsSection: false } },
    { label: "outputContractRequiresWarningsSection false", override: { outputContractRequiresWarningsSection: false } },
    { label: "outputContractRequiresUncertaintySection false", override: { outputContractRequiresUncertaintySection: false } },
    { label: "outputContractRequiresMissingEvidenceDisclosure false", override: { outputContractRequiresMissingEvidenceDisclosure: false } },
    { label: "outputContractRequiresOcrConfidenceDisclosure false", override: { outputContractRequiresOcrConfidenceDisclosure: false } },
    { label: "outputContractRequiresSourceAnchorsWhereAvailable false", override: { outputContractRequiresSourceAnchorsWhereAvailable: false } },
    { label: "outputContractRequiresNoHiddenReasoning false", override: { outputContractRequiresNoHiddenReasoning: false } },
    { label: "outputContractRequiresNoRawDocumentLeakage false", override: { outputContractRequiresNoRawDocumentLeakage: false } },
    { label: "outputContractRequiresNoPromptLeakage false", override: { outputContractRequiresNoPromptLeakage: false } },
    { label: "outputContractRequiresNoModelOutputLeakage false", override: { outputContractRequiresNoModelOutputLeakage: false } },
    { label: "outputContractRequiresNoApiKeyLeakage false", override: { outputContractRequiresNoApiKeyLeakage: false } },
    { label: "outputContractRequiresNoLegalAdviceClaim false", override: { outputContractRequiresNoLegalAdviceClaim: false } },
    { label: "outputContractRequiresNoLegalCertainty false", override: { outputContractRequiresNoLegalCertainty: false } },
    { label: "outputContractRequiresNoDeadlineInvention false", override: { outputContractRequiresNoDeadlineInvention: false } },
    { label: "outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized false", override: { outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized: false } },
    { label: "outputContractRequiresDeliveryOrBekanntgabeDateExplicitness false", override: { outputContractRequiresDeliveryOrBekanntgabeDateExplicitness: false } },
    { label: "outputContractRequiresNoCoerciveLegalInstruction false", override: { outputContractRequiresNoCoerciveLegalInstruction: false } },
    { label: "outputContractRequiresHumanReviewForHighRisk false", override: { outputContractRequiresHumanReviewForHighRisk: false } },
    { label: "outputContractRequiresEmergencyEscalationForHighRisk false", override: { outputContractRequiresEmergencyEscalationForHighRisk: false } },
    { label: "outputContractRequiresUnknownWhenEvidenceMissing false", override: { outputContractRequiresUnknownWhenEvidenceMissing: false } },
    { label: "outputContractRequiresAmbiguousEvidenceBlocksCertainty false", override: { outputContractRequiresAmbiguousEvidenceBlocksCertainty: false } },
    { label: "outputContractRequiresMissingEvidenceBlocksClaims false", override: { outputContractRequiresMissingEvidenceBlocksClaims: false } },
    { label: "outputContractRequiresFreeQuestionModeSeparation false", override: { outputContractRequiresFreeQuestionModeSeparation: false } },
    { label: "outputContractRequiresPaidDocumentModeSeparation false", override: { outputContractRequiresPaidDocumentModeSeparation: false } },
    { label: "outputContractRequiresDocumentBypassGuard false", override: { outputContractRequiresDocumentBypassGuard: false } },
    { label: "outputContractRequiresNoFullDocumentExplanationInFreeQa false", override: { outputContractRequiresNoFullDocumentExplanationInFreeQa: false } },
    { label: "outputContractRequiresPaymentBeforeFullDocumentExplanation false", override: { outputContractRequiresPaymentBeforeFullDocumentExplanation: false } },
    { label: "outputContractRequiresSuccessfulProcessingDefinition false", override: { outputContractRequiresSuccessfulProcessingDefinition: false } },
    { label: "outputContractRequiresFailureNoChargePolicy false", override: { outputContractRequiresFailureNoChargePolicy: false } },
    { label: "outputContractRequiresClearDocumentModeConsent false", override: { outputContractRequiresClearDocumentModeConsent: false } },
    { label: "allowedFutureSectionSummaryLabel wrong value", override: { allowedFutureSectionSummaryLabel: "WRONG" } },
    { label: "allowedFutureSectionTranslationLabel wrong value", override: { allowedFutureSectionTranslationLabel: "WRONG" } },
    { label: "allowedFutureSectionMeaningLabel wrong value", override: { allowedFutureSectionMeaningLabel: "WRONG" } },
    { label: "allowedFutureSectionUrgencyLabel wrong value", override: { allowedFutureSectionUrgencyLabel: "WRONG" } },
    { label: "allowedFutureSectionNextStepsLabel wrong value", override: { allowedFutureSectionNextStepsLabel: "WRONG" } },
    { label: "allowedFutureSectionWarningsLabel wrong value", override: { allowedFutureSectionWarningsLabel: "WRONG" } },
    { label: "allowedFutureSectionUncertaintyLabel wrong value", override: { allowedFutureSectionUncertaintyLabel: "WRONG" } },
    { label: "allowedFutureSectionEvidenceNotesLabel wrong value", override: { allowedFutureSectionEvidenceNotesLabel: "WRONG" } },
    { label: "readyFor8x4HControlledRealDocumentFinalReadinessAudit false", override: { readyFor8x4HControlledRealDocumentFinalReadinessAudit: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateOutputContractInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    contractAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4G: controlled real-document user-visible output contract layer — depends on completed 8.4F controlled real-document OCR and storage isolation plan",
    "8.4G is planning only — not real document input or processing",
    "no user-visible output was performed",
    "no public runtime was enabled",
    "no OCR, photo, file, storage, or persistence was performed",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.4G",
    "8.3AC was not re-run",
    "any future output must be plain-language and in the user-selected language",
    "any future output must disclose uncertainty, missing evidence, and OCR confidence when relevant",
    "any future output must not claim legal advice or legal certainty",
    "exact deadline calculation remains blocked without explicit delivery or Bekanntgabe date",
    "Free Q&A and Paid Document Mode must remain separated",
    "full document explanation requires Paid Document Mode",
    "the next phase is 8.4H controlled real-document final readiness audit",
    "8.4H is still planning/audit only unless explicitly authorized later",
    `8.4F prerequisite: allPassed=${ocrResult.allPassed}, readyFor8x4G=${ocrResult.readyFor8x4GControlledRealDocumentUserVisibleOutputContract}`,
    `output contract input validation: ${contractAccepted ? "accepted" : "REJECTED"} — reasons: ${contractValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4G allPassed: true — controlled real-document user-visible output contract accepted"
    );
    notes.push(
      "readyFor8x4HControlledRealDocumentFinalReadinessAudit: true — planning only"
    );
  }

  return {
    checkId: "8.4G",
    allPassed,
    ocrAndStorageIsolationReadyForUserVisibleOutputContract:
      canonicalInput.controlledRealDocumentOcrAndStorageIsolationPlanAccepted,
    controlledRealDocumentUserVisibleOutputContractAccepted: allPassed,
    userVisibleOutputContractOnly: true,
    tamperCasesRejected: allTamperRejected,

    actualUserVisibleOutputPerformed: false,
    actualPublicRuntimeEnabled: false,
    actualOcrPerformed: false,
    actualPhotoInputProcessed: false,
    actualFileInputProcessed: false,
    actualDocumentStoragePerformed: false,
    actualDatabasePersistencePerformed: false,
    actualAuditPersistencePerformed: false,
    actualEvidenceEvaluationPerformed: false,
    actualClaimAuthorizationPerformed: false,
    actualDeadlineCalculationPerformed: false,

    outputContractRequiresPlainLanguageExplanation:
      canonicalInput.outputContractRequiresPlainLanguageExplanation,
    outputContractRequiresUserSelectedLanguage:
      canonicalInput.outputContractRequiresUserSelectedLanguage,
    outputContractRequiresOriginalMeaningSummary:
      canonicalInput.outputContractRequiresOriginalMeaningSummary,
    outputContractRequiresDocumentTypeLabel:
      canonicalInput.outputContractRequiresDocumentTypeLabel,
    outputContractRequiresAuthorityOrSenderLabel:
      canonicalInput.outputContractRequiresAuthorityOrSenderLabel,
    outputContractRequiresUrgencyLabel:
      canonicalInput.outputContractRequiresUrgencyLabel,
    outputContractRequiresNextStepsSection:
      canonicalInput.outputContractRequiresNextStepsSection,
    outputContractRequiresWarningsSection:
      canonicalInput.outputContractRequiresWarningsSection,
    outputContractRequiresUncertaintySection:
      canonicalInput.outputContractRequiresUncertaintySection,
    outputContractRequiresMissingEvidenceDisclosure:
      canonicalInput.outputContractRequiresMissingEvidenceDisclosure,
    outputContractRequiresOcrConfidenceDisclosure:
      canonicalInput.outputContractRequiresOcrConfidenceDisclosure,
    outputContractRequiresSourceAnchorsWhereAvailable:
      canonicalInput.outputContractRequiresSourceAnchorsWhereAvailable,
    outputContractRequiresNoHiddenReasoning:
      canonicalInput.outputContractRequiresNoHiddenReasoning,
    outputContractRequiresNoRawDocumentLeakage:
      canonicalInput.outputContractRequiresNoRawDocumentLeakage,
    outputContractRequiresNoPromptLeakage:
      canonicalInput.outputContractRequiresNoPromptLeakage,
    outputContractRequiresNoModelOutputLeakage:
      canonicalInput.outputContractRequiresNoModelOutputLeakage,
    outputContractRequiresNoApiKeyLeakage:
      canonicalInput.outputContractRequiresNoApiKeyLeakage,

    outputContractRequiresNoLegalAdviceClaim:
      canonicalInput.outputContractRequiresNoLegalAdviceClaim,
    outputContractRequiresNoLegalCertainty:
      canonicalInput.outputContractRequiresNoLegalCertainty,
    outputContractRequiresNoDeadlineInvention:
      canonicalInput.outputContractRequiresNoDeadlineInvention,
    outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized:
      canonicalInput.outputContractRequiresNoFinalDeadlineUnlessEvidenceAuthorized,
    outputContractRequiresDeliveryOrBekanntgabeDateExplicitness:
      canonicalInput.outputContractRequiresDeliveryOrBekanntgabeDateExplicitness,
    outputContractRequiresNoCoerciveLegalInstruction:
      canonicalInput.outputContractRequiresNoCoerciveLegalInstruction,
    outputContractRequiresHumanReviewForHighRisk:
      canonicalInput.outputContractRequiresHumanReviewForHighRisk,
    outputContractRequiresEmergencyEscalationForHighRisk:
      canonicalInput.outputContractRequiresEmergencyEscalationForHighRisk,
    outputContractRequiresUnknownWhenEvidenceMissing:
      canonicalInput.outputContractRequiresUnknownWhenEvidenceMissing,
    outputContractRequiresAmbiguousEvidenceBlocksCertainty:
      canonicalInput.outputContractRequiresAmbiguousEvidenceBlocksCertainty,
    outputContractRequiresMissingEvidenceBlocksClaims:
      canonicalInput.outputContractRequiresMissingEvidenceBlocksClaims,

    outputContractRequiresFreeQuestionModeSeparation:
      canonicalInput.outputContractRequiresFreeQuestionModeSeparation,
    outputContractRequiresPaidDocumentModeSeparation:
      canonicalInput.outputContractRequiresPaidDocumentModeSeparation,
    outputContractRequiresDocumentBypassGuard:
      canonicalInput.outputContractRequiresDocumentBypassGuard,
    outputContractRequiresNoFullDocumentExplanationInFreeQa:
      canonicalInput.outputContractRequiresNoFullDocumentExplanationInFreeQa,
    outputContractRequiresPaymentBeforeFullDocumentExplanation:
      canonicalInput.outputContractRequiresPaymentBeforeFullDocumentExplanation,
    outputContractRequiresSuccessfulProcessingDefinition:
      canonicalInput.outputContractRequiresSuccessfulProcessingDefinition,
    outputContractRequiresFailureNoChargePolicy:
      canonicalInput.outputContractRequiresFailureNoChargePolicy,
    outputContractRequiresClearDocumentModeConsent:
      canonicalInput.outputContractRequiresClearDocumentModeConsent,

    allowedFutureSectionSummaryLabel: "summary",
    allowedFutureSectionTranslationLabel: "translation",
    allowedFutureSectionMeaningLabel: "meaning",
    allowedFutureSectionUrgencyLabel: "urgency",
    allowedFutureSectionNextStepsLabel: "next_steps",
    allowedFutureSectionWarningsLabel: "warnings",
    allowedFutureSectionUncertaintyLabel: "uncertainty",
    allowedFutureSectionEvidenceNotesLabel: "evidence_notes",

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

    readyFor8x4HControlledRealDocumentFinalReadinessAudit:
      canonicalInput.readyFor8x4HControlledRealDocumentFinalReadinessAudit,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,
    notes,
  };
}
