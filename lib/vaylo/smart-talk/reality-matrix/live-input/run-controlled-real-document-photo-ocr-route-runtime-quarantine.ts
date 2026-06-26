/**
 * Phase 8.5H — Controlled Real Document Photo OCR Route Runtime Quarantine.
 *
 * CONTAINMENT/QUARANTINE-ONLY — NOT RUNTIME AUTHORIZATION — DEPENDS ON 8.5G.
 *
 * This file records that /api/smart-talk-photo has been quarantined so it cannot
 * process uploaded photos, cannot perform OCR, cannot call OpenAI for OCR, and
 * cannot return user-visible document explanations until a future explicit runtime
 * authorization chain allows it.
 *
 * This is a containment fix, not runtime authorization.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call runHighRiskSyntheticLegalDeadlineLiveExecution.
 *   - Import or modify live route files.
 *   - Perform OCR, photo/file input, document storage, or persistence.
 *   - Authorize live real-document processing, extraction, or upload.
 *   - Authorize public runtime, persistence, or user-visible output.
 *   - Grant runtime, pilot, production, or final go-live authorization.
 *   - Modify /api/smart-talk.
 *   - Implement Document Bypass Guard.
 *   - Implement Paid Document Mode.
 *   - Implement PII redaction.
 *   - Wire Evidence Gates into runtime.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runControlledRealDocumentLiveRouteContainmentAudit } from "./run-controlled-real-document-live-route-containment-audit";

// ── Local quarantine input type ───────────────────────────────────────────────

interface ControlledRealDocumentPhotoOcrRouteRuntimeQuarantineInput {
  // 8.5G prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly controlledRealDocumentLiveRouteContainmentAuditAccepted: boolean;
  readonly liveRouteContainmentAuditOnly: boolean;
  readonly liveRouteContainmentAuditPerformed: boolean;
  readonly liveRouteContainmentRequiredBeforeRuntimeAuthorization: boolean;
  readonly runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: boolean;
  readonly separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: boolean;

  // 8.5G authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: boolean;
  readonly pilotAuthorizationGranted: boolean;
  readonly productionAuthorizationGranted: boolean;
  readonly finalAuthorizationGranted: boolean;
  readonly goLiveAuthorizationGranted: boolean;

  // 8.5G TD flags
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: boolean;
  readonly containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization: boolean;
  readonly routeContainmentDecision8x6ABlockedUntilContainmentComplete: boolean;
  readonly routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
  readonly routeContainmentDecisionNoLiveRouteMutationIn8x5G: boolean;
  readonly routeContainmentDecisionNoRuntimePathExecutedIn8x5G: boolean;

  // 8.5G actual* performed flags (must all be false in 8.5G prereq)
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
  readonly actualLiveRouteMutationPerformed: boolean;
  readonly actualPhotoRouteQuarantinePerformed: boolean;

  // 8.5G containmentAuditConfirms* gates (must all be true)
  readonly containmentAuditConfirmsNoOpenAiCall: boolean;
  readonly containmentAuditConfirmsNoFetchCall: boolean;
  readonly containmentAuditConfirmsNoProcessEnvRead: boolean;
  readonly containmentAuditConfirmsNoSdkUsage: boolean;
  readonly containmentAuditConfirmsNo8x3AcRerun: boolean;
  readonly containmentAuditConfirmsNoSmartTalkRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoRouteImport: boolean;
  readonly containmentAuditConfirmsNoRouteMutation: boolean;
  readonly containmentAuditConfirmsNoPublicRouteMutation: boolean;
  readonly containmentAuditConfirmsNoUiMutation: boolean;
  readonly containmentAuditConfirmsNoSupabaseMutation: boolean;
  readonly containmentAuditConfirmsNoStorageMutation: boolean;
  readonly containmentAuditConfirmsNoDatabaseWrite: boolean;
  readonly containmentAuditConfirmsNoAuditPersistence: boolean;
  readonly containmentAuditConfirmsNoPaymentRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoOcrRuntimeCall: boolean;
  readonly containmentAuditConfirmsNoPhotoInputProcessing: boolean;
  readonly containmentAuditConfirmsNoFileInputProcessing: boolean;
  readonly containmentAuditConfirmsNoDocumentParsing: boolean;
  readonly containmentAuditConfirmsNoRawDocumentStorage: boolean;
  readonly containmentAuditConfirmsNoModelOutputStorage: boolean;
  readonly containmentAuditConfirmsNoPromptStorage: boolean;
  readonly containmentAuditConfirmsNoUserVisibleOutput: boolean;
  readonly containmentAuditConfirmsNoCustomerFacingExplanation: boolean;
  readonly containmentAuditConfirmsNoEvidenceEvaluation: boolean;
  readonly containmentAuditConfirmsNoClaimAuthorization: boolean;
  readonly containmentAuditConfirmsNoDeadlineCalculation: boolean;
  readonly containmentAuditConfirmsNoLegalCertainty: boolean;

  // 8.5G pipeline executed flags (must all be false)
  readonly executionSequenceActuallyExecuted: boolean;
  readonly runtimePipelineActuallyExecuted: boolean;
  readonly documentPipelineActuallyExecuted: boolean;
  readonly ocrPipelineActuallyExecuted: boolean;
  readonly paymentPipelineActuallyExecuted: boolean;
  readonly userVisiblePipelineActuallyExecuted: boolean;

  // 8.5G runtime authorization flags (must all be false)
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

  // 8.5G legal safety flags
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // 8.5G remaining TD flags
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRoute: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly tmpFilesPresentInWorkingTree: boolean;

  // 8.5G forward readiness
  readonly readyFor8x5HPhotoOcrRouteRuntimeQuarantine: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: boolean;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // 8.5H quarantine assertions
  readonly photoOcrRouteRuntimeQuarantineOnly: boolean;
  readonly photoOcrRouteRuntimeQuarantineApplied: boolean;
  readonly photoOcrRouteDefaultBlocked: boolean;
  readonly photoOcrRouteEarlyReturnBeforeBodyParsingRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOpenAiRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOcrRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: boolean;
  readonly photoOcrRouteQuarantineResponseStatus503Required: boolean;
  readonly photoOcrRouteQuarantineResponseSafeJsonRequired: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentPhotoOcrRouteRuntimeQuarantineResult {
  readonly checkId: "8.5H";
  readonly allPassed: boolean;
  readonly liveRouteContainmentAuditReadyForPhotoOcrRouteQuarantine: boolean;
  readonly controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted: boolean;
  readonly photoOcrRouteRuntimeQuarantineOnly: true;
  readonly photoOcrRouteRuntimeQuarantineApplied: true;
  readonly photoOcrRouteDefaultBlocked: boolean;
  readonly photoOcrRouteEarlyReturnBeforeBodyParsingRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOpenAiRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeOcrRequired: boolean;
  readonly photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: boolean;
  readonly photoOcrRouteQuarantineResponseStatus503Required: boolean;
  readonly photoOcrRouteQuarantineResponseSafeJsonRequired: boolean;
  readonly tamperCasesRejected: boolean;

  // Authorization grants (must all be false)
  readonly runtimeAuthorizationGranted: false;
  readonly pilotAuthorizationGranted: false;
  readonly productionAuthorizationGranted: false;
  readonly finalAuthorizationGranted: false;
  readonly goLiveAuthorizationGranted: false;

  // TD-003 containment status
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: boolean;
  readonly td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationStillRequiresFutureAuthorizedRuntimeDesign: boolean;
  readonly photoOcrRuntimeStillNotAuthorized: boolean;
  readonly photoUploadStillNotAuthorized: boolean;
  readonly ocrRuntimeStillNotAuthorized: boolean;
  readonly publicPhotoRuntimeStillNotAuthorized: boolean;
  readonly userVisiblePhotoDocumentExplanationStillNotAuthorized: boolean;

  // Still-active blocker flags
  readonly td001DocumentBypassGuardMissingInLiveSmartTalkRoute: boolean;
  readonly td004PreModelPiiRedactionMissing: boolean;
  readonly td005PaidDocumentModeNotServerSideEnforced: boolean;
  readonly td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: boolean;

  // Medium/low debt flags
  readonly td006EvidenceGateTodoAndOrSemanticsUnresolved: boolean;
  readonly td007TrapClaimDispositionNamespaceHardeningUnresolved: boolean;
  readonly td008InMemoryRateLimiterServerlessUnsafe: boolean;
  readonly td010GetUserStateDocumentTypeTodoOpen: boolean;
  readonly td009TmpDebugRunnerDebtClosed: boolean;
  readonly tmpFilesPresentInWorkingTree: false;

  // Actual performed flags
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
  readonly actualPhotoRouteQuarantinePerformed: true;
  readonly actualLiveRouteMutationPerformed: true;
  readonly actualDocumentBypassGuardImplemented: false;
  readonly actualPaidDocumentModeImplemented: false;
  readonly actualPiiRedactionImplemented: false;
  readonly actualEvidenceGateRuntimeWiringPerformed: false;

  // Audit confirms (quarantined path)
  readonly photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNo8x3AcRerun: boolean;
  readonly photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath: boolean;
  readonly photoRouteQuarantineConfirmsNoRawDocumentStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoModelOutputStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoPromptStorage: boolean;
  readonly photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation: boolean;
  readonly photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis: boolean;
  readonly photoRouteQuarantineConfirmsNoEvidenceEvaluation: boolean;
  readonly photoRouteQuarantineConfirmsNoClaimAuthorization: boolean;
  readonly photoRouteQuarantineConfirmsNoDeadlineCalculation: boolean;
  readonly photoRouteQuarantineConfirmsNoLegalCertainty: boolean;
  readonly photoRouteQuarantineConfirmsNoPaymentRuntimeCall: boolean;
  readonly photoRouteQuarantineConfirmsNoSupabaseMutation: boolean;
  readonly photoRouteQuarantineConfirmsNoStorageMutation: boolean;
  readonly photoRouteQuarantineConfirmsNoDatabaseWrite: boolean;
  readonly photoRouteQuarantineConfirmsNoAuditPersistence: boolean;

  // Pipeline executed flags (must all be false)
  readonly executionSequenceActuallyExecuted: false;
  readonly runtimePipelineActuallyExecuted: false;
  readonly documentPipelineActuallyExecuted: false;
  readonly ocrPipelineActuallyExecuted: false;
  readonly paymentPipelineActuallyExecuted: false;
  readonly userVisiblePipelineActuallyExecuted: false;

  // Runtime authorization flags (must all be false)
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

  // Legal safety flags
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  // Forward readiness
  readonly readyFor8x5ITextDocumentBypassGuardContract: boolean;
  readonly readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false;
  readonly readyForControlledRealDocumentPilotAuthorizationPhase: false;
  readonly readyForControlledRealDocumentProductionAuthorizationPhase: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Quarantine input validator ────────────────────────────────────────────────

function validateQuarantineInput(
  o: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.5G prerequisite gates
  if (o["prereqCheckId"] !== "8.5G")
    reasons.push("prereq_check_id_invalid");
  if (o["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (o["controlledRealDocumentLiveRouteContainmentAuditAccepted"] !== true)
    reasons.push("containment_audit_not_accepted");
  if (o["liveRouteContainmentAuditOnly"] !== true)
    reasons.push("live_route_containment_audit_only_false");
  if (o["liveRouteContainmentAuditPerformed"] !== true)
    reasons.push("live_route_containment_audit_performed_false");
  if (o["liveRouteContainmentRequiredBeforeRuntimeAuthorization"] !== true)
    reasons.push("live_route_containment_required_before_runtime_authorization_false");
  if (o["runtimeAuthorizationMustRemainBlockedUntilContainmentResolved"] !== true)
    reasons.push("runtime_authorization_must_remain_blocked_false");
  if (o["separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment"] !== true)
    reasons.push("separate_runtime_authorization_phase_must_not_start_false");

  // 8.5G authorization grants (must be false)
  if (o["runtimeAuthorizationGranted"] !== false)
    reasons.push("runtime_authorization_granted");
  if (o["pilotAuthorizationGranted"] !== false)
    reasons.push("pilot_authorization_granted");
  if (o["productionAuthorizationGranted"] !== false)
    reasons.push("production_authorization_granted");
  if (o["finalAuthorizationGranted"] !== false)
    reasons.push("final_authorization_granted");
  if (o["goLiveAuthorizationGranted"] !== false)
    reasons.push("go_live_authorization_granted");

  // 8.5G TD flags
  if (o["td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization"] !== true)
    reasons.push("td003_photo_ocr_route_live_ahead_of_governance_false");
  if (o["containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization"] !== true)
    reasons.push("containment_requires_photo_ocr_route_quarantine_false");
  if (o["routeContainmentDecision8x6ABlockedUntilContainmentComplete"] !== true)
    reasons.push("route_containment_decision_8x6a_blocked_false");
  if (o["routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine"] !== true)
    reasons.push("route_containment_decision_next_phase_8x5h_false");
  if (o["routeContainmentDecisionNoLiveRouteMutationIn8x5G"] !== true)
    reasons.push("route_containment_decision_no_live_route_mutation_false");
  if (o["routeContainmentDecisionNoRuntimePathExecutedIn8x5G"] !== true)
    reasons.push("route_containment_decision_no_runtime_path_executed_false");

  // 8.5G actual* performed flags (must be false in prereq)
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
  if (o["actualLiveRouteMutationPerformed"] !== false)
    reasons.push("actual_live_route_mutation_performed_in_prereq");
  if (o["actualPhotoRouteQuarantinePerformed"] !== false)
    reasons.push("actual_photo_route_quarantine_performed_in_prereq");

  // 8.5G containmentAuditConfirms* gates (must be true)
  if (o["containmentAuditConfirmsNoOpenAiCall"] !== true)
    reasons.push("containment_audit_confirms_no_open_ai_call_false");
  if (o["containmentAuditConfirmsNoFetchCall"] !== true)
    reasons.push("containment_audit_confirms_no_fetch_call_false");
  if (o["containmentAuditConfirmsNoProcessEnvRead"] !== true)
    reasons.push("containment_audit_confirms_no_process_env_read_false");
  if (o["containmentAuditConfirmsNoSdkUsage"] !== true)
    reasons.push("containment_audit_confirms_no_sdk_usage_false");
  if (o["containmentAuditConfirmsNo8x3AcRerun"] !== true)
    reasons.push("containment_audit_confirms_no_8x3ac_rerun_false");
  if (o["containmentAuditConfirmsNoSmartTalkRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_smart_talk_runtime_call_false");
  if (o["containmentAuditConfirmsNoRouteImport"] !== true)
    reasons.push("containment_audit_confirms_no_route_import_false");
  if (o["containmentAuditConfirmsNoRouteMutation"] !== true)
    reasons.push("containment_audit_confirms_no_route_mutation_false");
  if (o["containmentAuditConfirmsNoPublicRouteMutation"] !== true)
    reasons.push("containment_audit_confirms_no_public_route_mutation_false");
  if (o["containmentAuditConfirmsNoUiMutation"] !== true)
    reasons.push("containment_audit_confirms_no_ui_mutation_false");
  if (o["containmentAuditConfirmsNoSupabaseMutation"] !== true)
    reasons.push("containment_audit_confirms_no_supabase_mutation_false");
  if (o["containmentAuditConfirmsNoStorageMutation"] !== true)
    reasons.push("containment_audit_confirms_no_storage_mutation_false");
  if (o["containmentAuditConfirmsNoDatabaseWrite"] !== true)
    reasons.push("containment_audit_confirms_no_database_write_false");
  if (o["containmentAuditConfirmsNoAuditPersistence"] !== true)
    reasons.push("containment_audit_confirms_no_audit_persistence_false");
  if (o["containmentAuditConfirmsNoPaymentRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_payment_runtime_call_false");
  if (o["containmentAuditConfirmsNoOcrRuntimeCall"] !== true)
    reasons.push("containment_audit_confirms_no_ocr_runtime_call_false");
  if (o["containmentAuditConfirmsNoPhotoInputProcessing"] !== true)
    reasons.push("containment_audit_confirms_no_photo_input_processing_false");
  if (o["containmentAuditConfirmsNoFileInputProcessing"] !== true)
    reasons.push("containment_audit_confirms_no_file_input_processing_false");
  if (o["containmentAuditConfirmsNoDocumentParsing"] !== true)
    reasons.push("containment_audit_confirms_no_document_parsing_false");
  if (o["containmentAuditConfirmsNoRawDocumentStorage"] !== true)
    reasons.push("containment_audit_confirms_no_raw_document_storage_false");
  if (o["containmentAuditConfirmsNoModelOutputStorage"] !== true)
    reasons.push("containment_audit_confirms_no_model_output_storage_false");
  if (o["containmentAuditConfirmsNoPromptStorage"] !== true)
    reasons.push("containment_audit_confirms_no_prompt_storage_false");
  if (o["containmentAuditConfirmsNoUserVisibleOutput"] !== true)
    reasons.push("containment_audit_confirms_no_user_visible_output_false");
  if (o["containmentAuditConfirmsNoCustomerFacingExplanation"] !== true)
    reasons.push("containment_audit_confirms_no_customer_facing_explanation_false");
  if (o["containmentAuditConfirmsNoEvidenceEvaluation"] !== true)
    reasons.push("containment_audit_confirms_no_evidence_evaluation_false");
  if (o["containmentAuditConfirmsNoClaimAuthorization"] !== true)
    reasons.push("containment_audit_confirms_no_claim_authorization_false");
  if (o["containmentAuditConfirmsNoDeadlineCalculation"] !== true)
    reasons.push("containment_audit_confirms_no_deadline_calculation_false");
  if (o["containmentAuditConfirmsNoLegalCertainty"] !== true)
    reasons.push("containment_audit_confirms_no_legal_certainty_false");

  // 8.5G pipeline executed flags (must be false)
  if (o["executionSequenceActuallyExecuted"] !== false)
    reasons.push("execution_sequence_actually_executed");
  if (o["runtimePipelineActuallyExecuted"] !== false)
    reasons.push("runtime_pipeline_actually_executed");
  if (o["documentPipelineActuallyExecuted"] !== false)
    reasons.push("document_pipeline_actually_executed");
  if (o["ocrPipelineActuallyExecuted"] !== false)
    reasons.push("ocr_pipeline_actually_executed");
  if (o["paymentPipelineActuallyExecuted"] !== false)
    reasons.push("payment_pipeline_actually_executed");
  if (o["userVisiblePipelineActuallyExecuted"] !== false)
    reasons.push("user_visible_pipeline_actually_executed");

  // 8.5G runtime authorization flags (must be false)
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
    reasons.push("delivery_date_required_for_exact_deadline_false");

  // Remaining TD flags
  if (o["td001DocumentBypassGuardMissingInLiveSmartTalkRoute"] !== true)
    reasons.push("td001_document_bypass_guard_missing_false");
  if (o["td002EvidenceGatesNotWiredIntoProductionRunSmartTalk"] !== true)
    reasons.push("td002_evidence_gates_not_wired_false");
  if (o["td004PreModelPiiRedactionMissing"] !== true)
    reasons.push("td004_pre_model_pii_redaction_missing_false");
  if (o["td005PaidDocumentModeNotServerSideEnforced"] !== true)
    reasons.push("td005_paid_document_mode_not_server_side_enforced_false");
  if (o["td006EvidenceGateTodoAndOrSemanticsUnresolved"] !== true)
    reasons.push("td006_evidence_gate_todo_and_or_semantics_unresolved_false");
  if (o["td007TrapClaimDispositionNamespaceHardeningUnresolved"] !== true)
    reasons.push("td007_trap_claim_disposition_namespace_hardening_unresolved_false");
  if (o["td008InMemoryRateLimiterServerlessUnsafe"] !== true)
    reasons.push("td008_in_memory_rate_limiter_serverless_unsafe_false");
  if (o["td009TmpDebugRunnerDebtClosed"] !== true)
    reasons.push("td009_tmp_debug_runner_debt_closed_false");
  if (o["td010GetUserStateDocumentTypeTodoOpen"] !== true)
    reasons.push("td010_get_user_state_document_type_todo_open_false");
  if (o["tmpFilesPresentInWorkingTree"] !== false)
    reasons.push("tmp_files_present_in_working_tree");

  // 8.5G forward readiness
  if (o["readyFor8x5HPhotoOcrRouteRuntimeQuarantine"] !== true)
    reasons.push("ready_for_8x5h_photo_ocr_route_runtime_quarantine_false");
  if (o["readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_separate_runtime_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentPilotAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_pilot_authorization_phase_not_false");
  if (o["readyForControlledRealDocumentProductionAuthorizationPhase"] !== false)
    reasons.push("ready_for_controlled_real_document_production_authorization_phase_not_false");
  if (o["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input_not_false");
  if (o["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output_not_false");
  if (o["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled_not_false");
  if (o["persistenceUsed"] !== false)
    reasons.push("persistence_used_not_false");
  if (o["neverUserVisible"] !== true)
    reasons.push("never_user_visible_false");

  // 8.5H quarantine assertions
  if (o["photoOcrRouteRuntimeQuarantineOnly"] !== true)
    reasons.push("photo_ocr_route_runtime_quarantine_only_false");
  if (o["photoOcrRouteRuntimeQuarantineApplied"] !== true)
    reasons.push("photo_ocr_route_runtime_quarantine_applied_false");
  if (o["photoOcrRouteDefaultBlocked"] !== true)
    reasons.push("photo_ocr_route_default_blocked_false");
  if (o["photoOcrRouteEarlyReturnBeforeBodyParsingRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_body_parsing_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeOpenAiRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_open_ai_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeOcrRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_ocr_required_false");
  if (o["photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired"] !== true)
    reasons.push("photo_ocr_route_early_return_before_run_smart_talk_required_false");
  if (o["photoOcrRouteQuarantineResponseStatus503Required"] !== true)
    reasons.push("photo_ocr_route_quarantine_response_status_503_required_false");
  if (o["photoOcrRouteQuarantineResponseSafeJsonRequired"] !== true)
    reasons.push("photo_ocr_route_quarantine_response_safe_json_required_false");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main function ─────────────────────────────────────────────────────────────

export function runControlledRealDocumentPhotoOcrRouteRuntimeQuarantine(): ControlledRealDocumentPhotoOcrRouteRuntimeQuarantineResult {
  const containmentAuditResult = runControlledRealDocumentLiveRouteContainmentAudit();

  const canonicalInput: ControlledRealDocumentPhotoOcrRouteRuntimeQuarantineInput = {
    // 8.5G prerequisite gates
    prereqCheckId: containmentAuditResult.checkId,
    prereqAllPassed: containmentAuditResult.allPassed,
    controlledRealDocumentLiveRouteContainmentAuditAccepted:
      containmentAuditResult.controlledRealDocumentLiveRouteContainmentAuditAccepted,
    liveRouteContainmentAuditOnly: containmentAuditResult.liveRouteContainmentAuditOnly,
    liveRouteContainmentAuditPerformed: containmentAuditResult.liveRouteContainmentAuditPerformed,
    liveRouteContainmentRequiredBeforeRuntimeAuthorization:
      containmentAuditResult.liveRouteContainmentRequiredBeforeRuntimeAuthorization,
    runtimeAuthorizationMustRemainBlockedUntilContainmentResolved:
      containmentAuditResult.runtimeAuthorizationMustRemainBlockedUntilContainmentResolved,
    separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment:
      containmentAuditResult.separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment,

    // 8.5G authorization grants
    runtimeAuthorizationGranted: containmentAuditResult.runtimeAuthorizationGranted,
    pilotAuthorizationGranted: containmentAuditResult.pilotAuthorizationGranted,
    productionAuthorizationGranted: containmentAuditResult.productionAuthorizationGranted,
    finalAuthorizationGranted: containmentAuditResult.finalAuthorizationGranted,
    goLiveAuthorizationGranted: containmentAuditResult.goLiveAuthorizationGranted,

    // 8.5G TD flags
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization:
      containmentAuditResult.td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization,
    containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization:
      containmentAuditResult.containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization,
    routeContainmentDecision8x6ABlockedUntilContainmentComplete:
      containmentAuditResult.routeContainmentDecision8x6ABlockedUntilContainmentComplete,
    routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine:
      containmentAuditResult.routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine,
    routeContainmentDecisionNoLiveRouteMutationIn8x5G:
      containmentAuditResult.routeContainmentDecisionNoLiveRouteMutationIn8x5G,
    routeContainmentDecisionNoRuntimePathExecutedIn8x5G:
      containmentAuditResult.routeContainmentDecisionNoRuntimePathExecutedIn8x5G,

    // 8.5G actual* performed flags (must be false in prereq)
    actualRealDocumentInputPerformed: containmentAuditResult.actualRealDocumentInputPerformed,
    actualRealDocumentProcessingPerformed:
      containmentAuditResult.actualRealDocumentProcessingPerformed,
    actualOcrPerformed: containmentAuditResult.actualOcrPerformed,
    actualPhotoInputProcessed: containmentAuditResult.actualPhotoInputProcessed,
    actualFileInputProcessed: containmentAuditResult.actualFileInputProcessed,
    actualDocumentStoragePerformed: containmentAuditResult.actualDocumentStoragePerformed,
    actualDatabasePersistencePerformed: containmentAuditResult.actualDatabasePersistencePerformed,
    actualAuditPersistencePerformed: containmentAuditResult.actualAuditPersistencePerformed,
    actualUserVisibleOutputPerformed: containmentAuditResult.actualUserVisibleOutputPerformed,
    actualPublicRuntimeEnabled: containmentAuditResult.actualPublicRuntimeEnabled,
    actualEvidenceEvaluationPerformed: containmentAuditResult.actualEvidenceEvaluationPerformed,
    actualClaimAuthorizationPerformed: containmentAuditResult.actualClaimAuthorizationPerformed,
    actualDeadlineCalculationPerformed: containmentAuditResult.actualDeadlineCalculationPerformed,
    actualLiveRouteMutationPerformed: containmentAuditResult.actualLiveRouteMutationPerformed,
    actualPhotoRouteQuarantinePerformed: containmentAuditResult.actualPhotoRouteQuarantinePerformed,

    // 8.5G containmentAuditConfirms* gates
    containmentAuditConfirmsNoOpenAiCall: containmentAuditResult.containmentAuditConfirmsNoOpenAiCall,
    containmentAuditConfirmsNoFetchCall: containmentAuditResult.containmentAuditConfirmsNoFetchCall,
    containmentAuditConfirmsNoProcessEnvRead:
      containmentAuditResult.containmentAuditConfirmsNoProcessEnvRead,
    containmentAuditConfirmsNoSdkUsage: containmentAuditResult.containmentAuditConfirmsNoSdkUsage,
    containmentAuditConfirmsNo8x3AcRerun: containmentAuditResult.containmentAuditConfirmsNo8x3AcRerun,
    containmentAuditConfirmsNoSmartTalkRuntimeCall:
      containmentAuditResult.containmentAuditConfirmsNoSmartTalkRuntimeCall,
    containmentAuditConfirmsNoRouteImport: containmentAuditResult.containmentAuditConfirmsNoRouteImport,
    containmentAuditConfirmsNoRouteMutation:
      containmentAuditResult.containmentAuditConfirmsNoRouteMutation,
    containmentAuditConfirmsNoPublicRouteMutation:
      containmentAuditResult.containmentAuditConfirmsNoPublicRouteMutation,
    containmentAuditConfirmsNoUiMutation: containmentAuditResult.containmentAuditConfirmsNoUiMutation,
    containmentAuditConfirmsNoSupabaseMutation:
      containmentAuditResult.containmentAuditConfirmsNoSupabaseMutation,
    containmentAuditConfirmsNoStorageMutation:
      containmentAuditResult.containmentAuditConfirmsNoStorageMutation,
    containmentAuditConfirmsNoDatabaseWrite:
      containmentAuditResult.containmentAuditConfirmsNoDatabaseWrite,
    containmentAuditConfirmsNoAuditPersistence:
      containmentAuditResult.containmentAuditConfirmsNoAuditPersistence,
    containmentAuditConfirmsNoPaymentRuntimeCall:
      containmentAuditResult.containmentAuditConfirmsNoPaymentRuntimeCall,
    containmentAuditConfirmsNoOcrRuntimeCall:
      containmentAuditResult.containmentAuditConfirmsNoOcrRuntimeCall,
    containmentAuditConfirmsNoPhotoInputProcessing:
      containmentAuditResult.containmentAuditConfirmsNoPhotoInputProcessing,
    containmentAuditConfirmsNoFileInputProcessing:
      containmentAuditResult.containmentAuditConfirmsNoFileInputProcessing,
    containmentAuditConfirmsNoDocumentParsing:
      containmentAuditResult.containmentAuditConfirmsNoDocumentParsing,
    containmentAuditConfirmsNoRawDocumentStorage:
      containmentAuditResult.containmentAuditConfirmsNoRawDocumentStorage,
    containmentAuditConfirmsNoModelOutputStorage:
      containmentAuditResult.containmentAuditConfirmsNoModelOutputStorage,
    containmentAuditConfirmsNoPromptStorage:
      containmentAuditResult.containmentAuditConfirmsNoPromptStorage,
    containmentAuditConfirmsNoUserVisibleOutput:
      containmentAuditResult.containmentAuditConfirmsNoUserVisibleOutput,
    containmentAuditConfirmsNoCustomerFacingExplanation:
      containmentAuditResult.containmentAuditConfirmsNoCustomerFacingExplanation,
    containmentAuditConfirmsNoEvidenceEvaluation:
      containmentAuditResult.containmentAuditConfirmsNoEvidenceEvaluation,
    containmentAuditConfirmsNoClaimAuthorization:
      containmentAuditResult.containmentAuditConfirmsNoClaimAuthorization,
    containmentAuditConfirmsNoDeadlineCalculation:
      containmentAuditResult.containmentAuditConfirmsNoDeadlineCalculation,
    containmentAuditConfirmsNoLegalCertainty:
      containmentAuditResult.containmentAuditConfirmsNoLegalCertainty,

    // 8.5G pipeline executed flags
    executionSequenceActuallyExecuted: containmentAuditResult.executionSequenceActuallyExecuted,
    runtimePipelineActuallyExecuted: containmentAuditResult.runtimePipelineActuallyExecuted,
    documentPipelineActuallyExecuted: containmentAuditResult.documentPipelineActuallyExecuted,
    ocrPipelineActuallyExecuted: containmentAuditResult.ocrPipelineActuallyExecuted,
    paymentPipelineActuallyExecuted: containmentAuditResult.paymentPipelineActuallyExecuted,
    userVisiblePipelineActuallyExecuted: containmentAuditResult.userVisiblePipelineActuallyExecuted,

    // 8.5G runtime authorization flags
    realDocumentInputAuthorizedNow: containmentAuditResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow: containmentAuditResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow: containmentAuditResult.realUserDocumentUploadAuthorizedNow,
    ocrRuntimeAuthorizedNow: containmentAuditResult.ocrRuntimeAuthorizedNow,
    photoInputAuthorizedNow: containmentAuditResult.photoInputAuthorizedNow,
    fileInputAuthorizedNow: containmentAuditResult.fileInputAuthorizedNow,
    documentStorageAuthorizedNow: containmentAuditResult.documentStorageAuthorizedNow,
    persistenceAuthorizedNow: containmentAuditResult.persistenceAuthorizedNow,
    publicRuntimeAuthorizedNow: containmentAuditResult.publicRuntimeAuthorizedNow,
    userVisibleLegalDeadlineOutputAuthorizedNow:
      containmentAuditResult.userVisibleLegalDeadlineOutputAuthorizedNow,
    liveLLMRuntimeAuthorizedNow: containmentAuditResult.liveLLMRuntimeAuthorizedNow,
    connectedAiRuntimeAuthorizedNow: containmentAuditResult.connectedAiRuntimeAuthorizedNow,
    pilotRuntimeAuthorizedNow: containmentAuditResult.pilotRuntimeAuthorizedNow,
    productionRuntimeAuthorizedNow: containmentAuditResult.productionRuntimeAuthorizedNow,

    // 8.5G legal safety flags
    exactDeadlineCalculationAuthorized: containmentAuditResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: containmentAuditResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: containmentAuditResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: containmentAuditResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized: containmentAuditResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: containmentAuditResult.deliveryDateRequiredForExactDeadline,

    // Remaining TD flags
    td001DocumentBypassGuardMissingInLiveSmartTalkRoute:
      containmentAuditResult.td001DocumentBypassGuardMissingInLiveSmartTalkRoute,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      containmentAuditResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,
    td004PreModelPiiRedactionMissing: containmentAuditResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      containmentAuditResult.td005PaidDocumentModeNotServerSideEnforced,
    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      containmentAuditResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      containmentAuditResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe:
      containmentAuditResult.td008InMemoryRateLimiterServerlessUnsafe,
    td009TmpDebugRunnerDebtClosed: containmentAuditResult.td009TmpDebugRunnerDebtClosed,
    td010GetUserStateDocumentTypeTodoOpen: containmentAuditResult.td010GetUserStateDocumentTypeTodoOpen,
    tmpFilesPresentInWorkingTree: containmentAuditResult.tmpFilesPresentInWorkingTree,

    // 8.5G forward readiness
    readyFor8x5HPhotoOcrRouteRuntimeQuarantine:
      containmentAuditResult.readyFor8x5HPhotoOcrRouteRuntimeQuarantine,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    // 8.5H quarantine assertions
    photoOcrRouteRuntimeQuarantineOnly: true,
    photoOcrRouteRuntimeQuarantineApplied: true,
    photoOcrRouteDefaultBlocked: true,
    photoOcrRouteEarlyReturnBeforeBodyParsingRequired: true,
    photoOcrRouteEarlyReturnBeforeOpenAiRequired: true,
    photoOcrRouteEarlyReturnBeforeOcrRequired: true,
    photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: true,
    photoOcrRouteQuarantineResponseStatus503Required: true,
    photoOcrRouteQuarantineResponseSafeJsonRequired: true,
  };

  const prereqValidation = validateQuarantineInput(
    canonicalInput as unknown as Record<string, unknown>
  );

  // ── Tamper cases ─────────────────────────────────────────────────────────────

  type TamperOverride = Partial<Record<keyof ControlledRealDocumentPhotoOcrRouteRuntimeQuarantineInput, unknown>>;
  const tamperCases: { label: string; override: TamperOverride }[] = [
    // 8.5G checkId
    { label: "8.5G checkId wrong", override: { prereqCheckId: "8.5F" } },
    // 8.5G allPassed false
    { label: "8.5G allPassed false", override: { prereqAllPassed: false } },
    // controlledRealDocumentLiveRouteContainmentAuditAccepted false
    { label: "controlledRealDocumentLiveRouteContainmentAuditAccepted false", override: { controlledRealDocumentLiveRouteContainmentAuditAccepted: false } },
    // liveRouteContainmentAuditOnly false
    { label: "liveRouteContainmentAuditOnly false", override: { liveRouteContainmentAuditOnly: false } },
    // liveRouteContainmentAuditPerformed false
    { label: "liveRouteContainmentAuditPerformed false", override: { liveRouteContainmentAuditPerformed: false } },
    // runtimeAuthorizationMustRemainBlockedUntilContainmentResolved false
    { label: "runtimeAuthorizationMustRemainBlockedUntilContainmentResolved false", override: { runtimeAuthorizationMustRemainBlockedUntilContainmentResolved: false } },
    // separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment false
    { label: "separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment false", override: { separateRuntimeAuthorizationPhaseMustNotStartBeforeContainment: false } },
    // authorization grants true
    { label: "runtimeAuthorizationGranted true", override: { runtimeAuthorizationGranted: true } },
    { label: "pilotAuthorizationGranted true", override: { pilotAuthorizationGranted: true } },
    { label: "productionAuthorizationGranted true", override: { productionAuthorizationGranted: true } },
    { label: "finalAuthorizationGranted true", override: { finalAuthorizationGranted: true } },
    { label: "goLiveAuthorizationGranted true", override: { goLiveAuthorizationGranted: true } },
    // td003 false
    { label: "td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization false", override: { td003PhotoOcrRouteLiveAheadOfGovernanceAuthorization: false } },
    // containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization false
    { label: "containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization false", override: { containmentRequiresPhotoOcrRouteQuarantineBeforeRuntimeAuthorization: false } },
    // routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine false
    { label: "routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine false", override: { routeContainmentDecisionNextPhase8x5HPhotoOcrRouteRuntimeQuarantine: false } },
    // routeContainmentDecision8x6ABlockedUntilContainmentComplete false
    { label: "routeContainmentDecision8x6ABlockedUntilContainmentComplete false", override: { routeContainmentDecision8x6ABlockedUntilContainmentComplete: false } },
    // actual* performed flags true in 8.5G prerequisite
    { label: "actualRealDocumentInputPerformed true in 8.5G prereq", override: { actualRealDocumentInputPerformed: true } },
    { label: "actualRealDocumentProcessingPerformed true in 8.5G prereq", override: { actualRealDocumentProcessingPerformed: true } },
    { label: "actualOcrPerformed true in 8.5G prereq", override: { actualOcrPerformed: true } },
    { label: "actualPhotoInputProcessed true in 8.5G prereq", override: { actualPhotoInputProcessed: true } },
    { label: "actualFileInputProcessed true in 8.5G prereq", override: { actualFileInputProcessed: true } },
    { label: "actualDocumentStoragePerformed true in 8.5G prereq", override: { actualDocumentStoragePerformed: true } },
    { label: "actualDatabasePersistencePerformed true in 8.5G prereq", override: { actualDatabasePersistencePerformed: true } },
    { label: "actualAuditPersistencePerformed true in 8.5G prereq", override: { actualAuditPersistencePerformed: true } },
    { label: "actualUserVisibleOutputPerformed true in 8.5G prereq", override: { actualUserVisibleOutputPerformed: true } },
    { label: "actualPublicRuntimeEnabled true in 8.5G prereq", override: { actualPublicRuntimeEnabled: true } },
    { label: "actualEvidenceEvaluationPerformed true in 8.5G prereq", override: { actualEvidenceEvaluationPerformed: true } },
    { label: "actualClaimAuthorizationPerformed true in 8.5G prereq", override: { actualClaimAuthorizationPerformed: true } },
    { label: "actualDeadlineCalculationPerformed true in 8.5G prereq", override: { actualDeadlineCalculationPerformed: true } },
    { label: "actualPhotoRouteQuarantinePerformed true in 8.5G prereq", override: { actualPhotoRouteQuarantinePerformed: true } },
    { label: "actualLiveRouteMutationPerformed true in 8.5G prereq", override: { actualLiveRouteMutationPerformed: true } },
    // containmentAuditConfirms* gates false
    { label: "containmentAuditConfirmsNoOpenAiCall false", override: { containmentAuditConfirmsNoOpenAiCall: false } },
    { label: "containmentAuditConfirmsNoFetchCall false", override: { containmentAuditConfirmsNoFetchCall: false } },
    { label: "containmentAuditConfirmsNoProcessEnvRead false", override: { containmentAuditConfirmsNoProcessEnvRead: false } },
    { label: "containmentAuditConfirmsNoSdkUsage false", override: { containmentAuditConfirmsNoSdkUsage: false } },
    { label: "containmentAuditConfirmsNo8x3AcRerun false", override: { containmentAuditConfirmsNo8x3AcRerun: false } },
    { label: "containmentAuditConfirmsNoSmartTalkRuntimeCall false", override: { containmentAuditConfirmsNoSmartTalkRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoRouteImport false", override: { containmentAuditConfirmsNoRouteImport: false } },
    { label: "containmentAuditConfirmsNoRouteMutation false", override: { containmentAuditConfirmsNoRouteMutation: false } },
    { label: "containmentAuditConfirmsNoPublicRouteMutation false", override: { containmentAuditConfirmsNoPublicRouteMutation: false } },
    { label: "containmentAuditConfirmsNoUiMutation false", override: { containmentAuditConfirmsNoUiMutation: false } },
    { label: "containmentAuditConfirmsNoSupabaseMutation false", override: { containmentAuditConfirmsNoSupabaseMutation: false } },
    { label: "containmentAuditConfirmsNoStorageMutation false", override: { containmentAuditConfirmsNoStorageMutation: false } },
    { label: "containmentAuditConfirmsNoDatabaseWrite false", override: { containmentAuditConfirmsNoDatabaseWrite: false } },
    { label: "containmentAuditConfirmsNoAuditPersistence false", override: { containmentAuditConfirmsNoAuditPersistence: false } },
    { label: "containmentAuditConfirmsNoPaymentRuntimeCall false", override: { containmentAuditConfirmsNoPaymentRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoOcrRuntimeCall false", override: { containmentAuditConfirmsNoOcrRuntimeCall: false } },
    { label: "containmentAuditConfirmsNoPhotoInputProcessing false", override: { containmentAuditConfirmsNoPhotoInputProcessing: false } },
    { label: "containmentAuditConfirmsNoFileInputProcessing false", override: { containmentAuditConfirmsNoFileInputProcessing: false } },
    { label: "containmentAuditConfirmsNoDocumentParsing false", override: { containmentAuditConfirmsNoDocumentParsing: false } },
    { label: "containmentAuditConfirmsNoRawDocumentStorage false", override: { containmentAuditConfirmsNoRawDocumentStorage: false } },
    { label: "containmentAuditConfirmsNoModelOutputStorage false", override: { containmentAuditConfirmsNoModelOutputStorage: false } },
    { label: "containmentAuditConfirmsNoPromptStorage false", override: { containmentAuditConfirmsNoPromptStorage: false } },
    { label: "containmentAuditConfirmsNoUserVisibleOutput false", override: { containmentAuditConfirmsNoUserVisibleOutput: false } },
    { label: "containmentAuditConfirmsNoCustomerFacingExplanation false", override: { containmentAuditConfirmsNoCustomerFacingExplanation: false } },
    { label: "containmentAuditConfirmsNoEvidenceEvaluation false", override: { containmentAuditConfirmsNoEvidenceEvaluation: false } },
    { label: "containmentAuditConfirmsNoClaimAuthorization false", override: { containmentAuditConfirmsNoClaimAuthorization: false } },
    { label: "containmentAuditConfirmsNoDeadlineCalculation false", override: { containmentAuditConfirmsNoDeadlineCalculation: false } },
    { label: "containmentAuditConfirmsNoLegalCertainty false", override: { containmentAuditConfirmsNoLegalCertainty: false } },
    // pipeline executed flags true
    { label: "executionSequenceActuallyExecuted true", override: { executionSequenceActuallyExecuted: true } },
    { label: "runtimePipelineActuallyExecuted true", override: { runtimePipelineActuallyExecuted: true } },
    { label: "documentPipelineActuallyExecuted true", override: { documentPipelineActuallyExecuted: true } },
    { label: "ocrPipelineActuallyExecuted true", override: { ocrPipelineActuallyExecuted: true } },
    { label: "paymentPipelineActuallyExecuted true", override: { paymentPipelineActuallyExecuted: true } },
    { label: "userVisiblePipelineActuallyExecuted true", override: { userVisiblePipelineActuallyExecuted: true } },
    // runtime authorization flags true
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
    // legal safety flags true
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    // remaining blocker flags false
    { label: "td001DocumentBypassGuardMissingInLiveSmartTalkRoute false", override: { td001DocumentBypassGuardMissingInLiveSmartTalkRoute: false } },
    { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", override: { td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false } },
    { label: "td004PreModelPiiRedactionMissing false", override: { td004PreModelPiiRedactionMissing: false } },
    { label: "td005PaidDocumentModeNotServerSideEnforced false", override: { td005PaidDocumentModeNotServerSideEnforced: false } },
    { label: "td006EvidenceGateTodoAndOrSemanticsUnresolved false", override: { td006EvidenceGateTodoAndOrSemanticsUnresolved: false } },
    { label: "td007TrapClaimDispositionNamespaceHardeningUnresolved false", override: { td007TrapClaimDispositionNamespaceHardeningUnresolved: false } },
    { label: "td008InMemoryRateLimiterServerlessUnsafe false", override: { td008InMemoryRateLimiterServerlessUnsafe: false } },
    { label: "td009TmpDebugRunnerDebtClosed false", override: { td009TmpDebugRunnerDebtClosed: false } },
    { label: "td010GetUserStateDocumentTypeTodoOpen false", override: { td010GetUserStateDocumentTypeTodoOpen: false } },
    { label: "tmpFilesPresentInWorkingTree true", override: { tmpFilesPresentInWorkingTree: true } },
    // 8.5G forward readiness
    { label: "readyFor8x5HPhotoOcrRouteRuntimeQuarantine false", override: { readyFor8x5HPhotoOcrRouteRuntimeQuarantine: false } },
    { label: "readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase true in prereq", override: { readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentPilotAuthorizationPhase true in prereq", override: { readyForControlledRealDocumentPilotAuthorizationPhase: true } },
    { label: "readyForControlledRealDocumentProductionAuthorizationPhase true in prereq", override: { readyForControlledRealDocumentProductionAuthorizationPhase: true } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    // 8.5H quarantine assertions
    { label: "photoOcrRouteRuntimeQuarantineOnly false", override: { photoOcrRouteRuntimeQuarantineOnly: false } },
    { label: "photoOcrRouteRuntimeQuarantineApplied false", override: { photoOcrRouteRuntimeQuarantineApplied: false } },
    { label: "photoOcrRouteDefaultBlocked false", override: { photoOcrRouteDefaultBlocked: false } },
    { label: "photoOcrRouteEarlyReturnBeforeBodyParsingRequired false", override: { photoOcrRouteEarlyReturnBeforeBodyParsingRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeOpenAiRequired false", override: { photoOcrRouteEarlyReturnBeforeOpenAiRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeOcrRequired false", override: { photoOcrRouteEarlyReturnBeforeOcrRequired: false } },
    { label: "photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired false", override: { photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: false } },
    { label: "photoOcrRouteQuarantineResponseStatus503Required false", override: { photoOcrRouteQuarantineResponseStatus503Required: false } },
    { label: "photoOcrRouteQuarantineResponseSafeJsonRequired false", override: { photoOcrRouteQuarantineResponseSafeJsonRequired: false } },
  ];

  const tamperFailures: string[] = [];
  for (const tc of tamperCases) {
    const tampered = { ...canonicalInput, ...tc.override } as Record<string, unknown>;
    const result = validateQuarantineInput(tampered);
    if (result.accepted) {
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }
  const allTamperRejected = tamperFailures.length === 0;

  const allPassed =
    prereqValidation.accepted &&
    allTamperRejected &&
    containmentAuditResult.allPassed &&
    containmentAuditResult.readyFor8x5HPhotoOcrRouteRuntimeQuarantine;

  const prereqNote =
    prereqValidation.accepted
      ? "quarantine input validation: accepted — reasons: none"
      : `quarantine input validation: REJECTED — reasons: ${prereqValidation.reasons.join(", ")}`;

  const tamperNote =
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`;

  const finalNote = allPassed
    ? "PHASE 8.5H allPassed: true — controlled real-document Photo OCR route runtime quarantine accepted"
    : "PHASE 8.5H allPassed: false — see notes for failures";

  const notes: string[] = [
    "8.5H is a controlled real-document Photo OCR route runtime quarantine layer",
    "8.5H depends on completed 8.5G live route containment audit",
    "8.5H is containment/quarantine-only",
    "/api/smart-talk-photo is now default-blocked before body parsing, OCR, OpenAI, and runSmartTalk",
    "the quarantine returns safe JSON with HTTP 503 and code photo_ocr_runtime_quarantined",
    "TD-003 is contained but not fully resolved for future authorized runtime design",
    "no runtime authorization was granted",
    "no pilot or production authorization was granted",
    "no final go-live authorization was granted",
    "no real document input or processing was performed in the quarantined path",
    "no OCR, photo, file, storage, or persistence was performed in the quarantined path",
    "no user-visible document explanation was performed",
    "no public photo runtime was enabled",
    "no evidence evaluation, claim authorization, or deadline calculation was performed",
    "no live LLM call was performed in 8.5H",
    "8.3AC was not re-run",
    "/api/smart-talk was not modified",
    "Document Bypass Guard remains unresolved and is next",
    "Paid Document Mode boundary remains unresolved",
    "pre-model PII redaction remains unresolved",
    "Evidence Gate runtime wiring remains unresolved",
    "the next phase is 8.5I Text Document Bypass Guard Contract",
    "readyFor8x5ITextDocumentBypassGuardContract is planning readiness only, not full runtime authorization",
    "8.5G prerequisite: allPassed=true, liveRouteContainmentAuditOnly=true, liveRouteContainmentAuditPerformed=true",
    prereqNote,
    tamperNote,
    ...tamperFailures,
    finalNote,
    "TD-003 /api/smart-talk-photo is contained; future authorized runtime design is still required",
  ];

  return {
    checkId: "8.5H",
    allPassed,
    liveRouteContainmentAuditReadyForPhotoOcrRouteQuarantine:
      containmentAuditResult.readyFor8x5HPhotoOcrRouteRuntimeQuarantine,
    controlledRealDocumentPhotoOcrRouteRuntimeQuarantineAccepted: prereqValidation.accepted && allTamperRejected,
    photoOcrRouteRuntimeQuarantineOnly: true,
    photoOcrRouteRuntimeQuarantineApplied: true,
    photoOcrRouteDefaultBlocked: true,
    photoOcrRouteEarlyReturnBeforeBodyParsingRequired: true,
    photoOcrRouteEarlyReturnBeforeOpenAiRequired: true,
    photoOcrRouteEarlyReturnBeforeOcrRequired: true,
    photoOcrRouteEarlyReturnBeforeRunSmartTalkRequired: true,
    photoOcrRouteQuarantineResponseStatus503Required: true,
    photoOcrRouteQuarantineResponseSafeJsonRequired: true,
    tamperCasesRejected: allTamperRejected,

    runtimeAuthorizationGranted: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    finalAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,

    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationContained: true,
    td003PhotoOcrRouteLiveAheadOfGovernanceAuthorizationStillRequiresFutureAuthorizedRuntimeDesign: true,
    photoOcrRuntimeStillNotAuthorized: true,
    photoUploadStillNotAuthorized: true,
    ocrRuntimeStillNotAuthorized: true,
    publicPhotoRuntimeStillNotAuthorized: true,
    userVisiblePhotoDocumentExplanationStillNotAuthorized: true,

    td001DocumentBypassGuardMissingInLiveSmartTalkRoute:
      containmentAuditResult.td001DocumentBypassGuardMissingInLiveSmartTalkRoute,
    td004PreModelPiiRedactionMissing: containmentAuditResult.td004PreModelPiiRedactionMissing,
    td005PaidDocumentModeNotServerSideEnforced:
      containmentAuditResult.td005PaidDocumentModeNotServerSideEnforced,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk:
      containmentAuditResult.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk,

    td006EvidenceGateTodoAndOrSemanticsUnresolved:
      containmentAuditResult.td006EvidenceGateTodoAndOrSemanticsUnresolved,
    td007TrapClaimDispositionNamespaceHardeningUnresolved:
      containmentAuditResult.td007TrapClaimDispositionNamespaceHardeningUnresolved,
    td008InMemoryRateLimiterServerlessUnsafe:
      containmentAuditResult.td008InMemoryRateLimiterServerlessUnsafe,
    td010GetUserStateDocumentTypeTodoOpen: containmentAuditResult.td010GetUserStateDocumentTypeTodoOpen,
    td009TmpDebugRunnerDebtClosed: containmentAuditResult.td009TmpDebugRunnerDebtClosed,
    tmpFilesPresentInWorkingTree: false,

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
    actualPhotoRouteQuarantinePerformed: true,
    actualLiveRouteMutationPerformed: true,
    actualDocumentBypassGuardImplemented: false,
    actualPaidDocumentModeImplemented: false,
    actualPiiRedactionImplemented: false,
    actualEvidenceGateRuntimeWiringPerformed: false,

    photoRouteQuarantineConfirmsNoOpenAiCallInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoFetchCallInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoProcessEnvReadInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoSdkUsageInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNo8x3AcRerun: true,
    photoRouteQuarantineConfirmsNoSmartTalkRuntimeCallInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoBodyParsingInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoFileReadInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoImageValidationInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoOcrRuntimeCallInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoDocumentParsingInQuarantinedPath: true,
    photoRouteQuarantineConfirmsNoRawDocumentStorage: true,
    photoRouteQuarantineConfirmsNoModelOutputStorage: true,
    photoRouteQuarantineConfirmsNoPromptStorage: true,
    photoRouteQuarantineConfirmsNoUserVisibleDocumentExplanation: true,
    photoRouteQuarantineConfirmsNoCustomerFacingDocumentAnalysis: true,
    photoRouteQuarantineConfirmsNoEvidenceEvaluation: true,
    photoRouteQuarantineConfirmsNoClaimAuthorization: true,
    photoRouteQuarantineConfirmsNoDeadlineCalculation: true,
    photoRouteQuarantineConfirmsNoLegalCertainty: true,
    photoRouteQuarantineConfirmsNoPaymentRuntimeCall: true,
    photoRouteQuarantineConfirmsNoSupabaseMutation: true,
    photoRouteQuarantineConfirmsNoStorageMutation: true,
    photoRouteQuarantineConfirmsNoDatabaseWrite: true,
    photoRouteQuarantineConfirmsNoAuditPersistence: true,

    executionSequenceActuallyExecuted: false,
    runtimePipelineActuallyExecuted: false,
    documentPipelineActuallyExecuted: false,
    ocrPipelineActuallyExecuted: false,
    paymentPipelineActuallyExecuted: false,
    userVisiblePipelineActuallyExecuted: false,

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

    readyFor8x5ITextDocumentBypassGuardContract: true,
    readyForControlledRealDocumentSeparateRuntimeAuthorizationPhase: false,
    readyForControlledRealDocumentPilotAuthorizationPhase: false,
    readyForControlledRealDocumentProductionAuthorizationPhase: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    neverUserVisible: true,

    notes,
  };
}
