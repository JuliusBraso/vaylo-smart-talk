/**
 * Phase 8.4B — Controlled Real Document Contract.
 *
 * CONTRACT/PLANNING ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.4A.
 *
 * This file defines the contract requirements for a future controlled
 * real-document handling path. It is:
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

import { runControlledRealDocumentAuthorizationPlan } from "./run-controlled-real-document-authorization-plan";

// ── Local contract input type ─────────────────────────────────────────────────

interface ControlledRealDocumentContractInput {
  // 8.4A prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly closureReadyForControlledAuthorizationPlan: boolean;
  readonly controlledRealDocumentAuthorizationPlanAccepted: boolean;
  readonly authorizationPlanOnly: boolean;
  readonly readyFor8x4BControlledRealDocumentContract: boolean;

  // 8.4A passthrough invariants (must be false/true)
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
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;
  readonly authorizationRequiresSeparateRealDocumentContract: boolean;
  readonly authorizationRequiresRedactionPlan: boolean;
  readonly authorizationRequiresEvidenceGateMapping: boolean;
  readonly authorizationRequiresOCRIsolationPlan: boolean;
  readonly authorizationRequiresStoragePolicyPlan: boolean;
  readonly authorizationRequiresUserVisibleOutputContract: boolean;
  readonly authorizationRequiresHumanReviewPolicy: boolean;
  readonly authorizationRequiresFreshRiskReview: boolean;
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4B contract assertions
  readonly contractOnly: boolean;
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
  readonly readyFor8x4CControlledRealDocumentRedactionPlan: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentContractResult {
  readonly checkId: "8.4B";
  readonly allPassed: boolean;
  readonly authorizationPlanReadyForContract: boolean;
  readonly controlledRealDocumentContractAccepted: boolean;
  readonly contractOnly: true;
  readonly tamperCasesRejected: boolean;

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
  readonly readyFor8x4CControlledRealDocumentRedactionPlan: boolean;

  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Contract input validator ──────────────────────────────────────────────────

function validateContractInput(
  c: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.4A prerequisite gates
  if (c["prereqCheckId"] !== "8.4A")
    reasons.push("prereq_check_id_invalid");
  if (c["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (c["controlledRealDocumentAuthorizationPlanAccepted"] !== true)
    reasons.push("authorization_plan_not_accepted");
  if (c["authorizationPlanOnly"] !== true)
    reasons.push("authorization_plan_only_false");
  if (c["readyFor8x4BControlledRealDocumentContract"] !== true)
    reasons.push("not_ready_for_8_4b_contract");

  // 8.4A passthrough: all "AuthorizedNow" must be false
  if (c["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (c["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (c["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (c["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (c["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (c["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (c["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (c["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (c["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (c["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (c["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (c["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (c["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (c["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");

  // Legal safety invariants
  if (c["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (c["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (c["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (c["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (c["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (c["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_not_required");

  // 8.4A authorization requirements (must remain true)
  if (c["authorizationRequiresSeparateRealDocumentContract"] !== true)
    reasons.push("authorization_requires_separate_real_document_contract_false");
  if (c["authorizationRequiresRedactionPlan"] !== true)
    reasons.push("authorization_requires_redaction_plan_false");
  if (c["authorizationRequiresEvidenceGateMapping"] !== true)
    reasons.push("authorization_requires_evidence_gate_mapping_false");
  if (c["authorizationRequiresOCRIsolationPlan"] !== true)
    reasons.push("authorization_requires_ocr_isolation_plan_false");
  if (c["authorizationRequiresStoragePolicyPlan"] !== true)
    reasons.push("authorization_requires_storage_policy_plan_false");
  if (c["authorizationRequiresUserVisibleOutputContract"] !== true)
    reasons.push("authorization_requires_user_visible_output_contract_false");
  if (c["authorizationRequiresHumanReviewPolicy"] !== true)
    reasons.push("authorization_requires_human_review_policy_false");
  if (c["authorizationRequiresFreshRiskReview"] !== true)
    reasons.push("authorization_requires_fresh_risk_review_false");

  // 8.4A passthrough runtime/public invariants
  if (c["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (c["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (c["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (c["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (c["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.4B contract assertions
  if (c["contractOnly"] !== true)
    reasons.push("contract_only_false");
  if (c["contractRequiresRedactionBeforeAnyModelUse"] !== true)
    reasons.push("contract_requires_redaction_before_any_model_use_false");
  if (c["contractRequiresStructuredExtractionPlan"] !== true)
    reasons.push("contract_requires_structured_extraction_plan_false");
  if (c["contractRequiresEvidenceGateMapping"] !== true)
    reasons.push("contract_requires_evidence_gate_mapping_false");
  if (c["contractRequiresOCRIsolationPlan"] !== true)
    reasons.push("contract_requires_ocr_isolation_plan_false");
  if (c["contractRequiresStoragePolicyPlan"] !== true)
    reasons.push("contract_requires_storage_policy_plan_false");
  if (c["contractRequiresUserVisibleOutputContract"] !== true)
    reasons.push("contract_requires_user_visible_output_contract_false");
  if (c["contractRequiresHumanReviewPolicy"] !== true)
    reasons.push("contract_requires_human_review_policy_false");
  if (c["contractRequiresFreshRiskReview"] !== true)
    reasons.push("contract_requires_fresh_risk_review_false");
  if (c["contractRequiresExplicitUserConsentPlan"] !== true)
    reasons.push("contract_requires_explicit_user_consent_plan_false");
  if (c["contractRequiresDocumentTypeClassification"] !== true)
    reasons.push("contract_requires_document_type_classification_false");
  if (c["contractRequiresDeadlineDateSourceSeparation"] !== true)
    reasons.push("contract_requires_deadline_date_source_separation_false");
  if (c["contractRequiresNoDeadlineInvention"] !== true)
    reasons.push("contract_requires_no_deadline_invention_false");
  if (c["contractRequiresNoLegalCertainty"] !== true)
    reasons.push("contract_requires_no_legal_certainty_false");
  if (c["contractRequiresNoCoerciveLegalInstruction"] !== true)
    reasons.push("contract_requires_no_coercive_legal_instruction_false");
  if (c["contractRequiresAuditTrace"] !== true)
    reasons.push("contract_requires_audit_trace_false");
  if (c["contractRequiresTamperCoverage"] !== true)
    reasons.push("contract_requires_tamper_coverage_false");
  if (c["readyFor8x4CControlledRealDocumentRedactionPlan"] !== true)
    reasons.push("not_ready_for_8_4c_redaction_plan");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentContract(): ControlledRealDocumentContractResult {
  // ── Step 1: Obtain 8.4A authorization plan result ──────────────────────────
  const planResult = runControlledRealDocumentAuthorizationPlan();

  const prereqAllPassed = planResult.allPassed;
  const prereqReady = planResult.readyFor8x4BControlledRealDocumentContract;

  // ── Step 2: Build canonical contract input ─────────────────────────────────
  const canonicalInput: ControlledRealDocumentContractInput = {
    prereqCheckId: planResult.checkId,
    prereqAllPassed,
    closureReadyForControlledAuthorizationPlan:
      planResult.closureReadyForControlledAuthorizationPlan,
    controlledRealDocumentAuthorizationPlanAccepted:
      planResult.controlledRealDocumentAuthorizationPlanAccepted,
    authorizationPlanOnly: planResult.authorizationPlanOnly,
    readyFor8x4BControlledRealDocumentContract: prereqReady,

    realDocumentInputAuthorizedNow: planResult.realDocumentInputAuthorizedNow,
    realDocumentProcessingAuthorizedNow:
      planResult.realDocumentProcessingAuthorizedNow,
    realUserDocumentUploadAuthorizedNow:
      planResult.realUserDocumentUploadAuthorizedNow,
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
    exactDeadlineCalculationAuthorized:
      planResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized: planResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: planResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: planResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      planResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      planResult.deliveryDateRequiredForExactDeadline,
    authorizationRequiresSeparateRealDocumentContract:
      planResult.authorizationRequiresSeparateRealDocumentContract,
    authorizationRequiresRedactionPlan:
      planResult.authorizationRequiresRedactionPlan,
    authorizationRequiresEvidenceGateMapping:
      planResult.authorizationRequiresEvidenceGateMapping,
    authorizationRequiresOCRIsolationPlan:
      planResult.authorizationRequiresOCRIsolationPlan,
    authorizationRequiresStoragePolicyPlan:
      planResult.authorizationRequiresStoragePolicyPlan,
    authorizationRequiresUserVisibleOutputContract:
      planResult.authorizationRequiresUserVisibleOutputContract,
    authorizationRequiresHumanReviewPolicy:
      planResult.authorizationRequiresHumanReviewPolicy,
    authorizationRequiresFreshRiskReview:
      planResult.authorizationRequiresFreshRiskReview,
    readyForRealDocumentInput: planResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: planResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: planResult.publicRuntimeEnabled,
    persistenceUsed: planResult.persistenceUsed,
    neverUserVisible: planResult.neverUserVisible,

    contractOnly: true,
    contractRequiresRedactionBeforeAnyModelUse: prereqAllPassed && prereqReady,
    contractRequiresStructuredExtractionPlan: prereqAllPassed && prereqReady,
    contractRequiresEvidenceGateMapping: prereqAllPassed && prereqReady,
    contractRequiresOCRIsolationPlan: prereqAllPassed && prereqReady,
    contractRequiresStoragePolicyPlan: prereqAllPassed && prereqReady,
    contractRequiresUserVisibleOutputContract: prereqAllPassed && prereqReady,
    contractRequiresHumanReviewPolicy: prereqAllPassed && prereqReady,
    contractRequiresFreshRiskReview: prereqAllPassed && prereqReady,
    contractRequiresExplicitUserConsentPlan: prereqAllPassed && prereqReady,
    contractRequiresDocumentTypeClassification: prereqAllPassed && prereqReady,
    contractRequiresDeadlineDateSourceSeparation:
      prereqAllPassed && prereqReady,
    contractRequiresNoDeadlineInvention: prereqAllPassed && prereqReady,
    contractRequiresNoLegalCertainty: prereqAllPassed && prereqReady,
    contractRequiresNoCoerciveLegalInstruction: prereqAllPassed && prereqReady,
    contractRequiresAuditTrace: prereqAllPassed && prereqReady,
    contractRequiresTamperCoverage: prereqAllPassed && prereqReady,
    readyFor8x4CControlledRealDocumentRedactionPlan:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical contract input ──────────────────────────────
  const contractValidation = validateContractInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const contractAccepted = contractValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.4A checkId wrong", override: { prereqCheckId: "8.4B" } },
    { label: "8.4A allPassed false", override: { prereqAllPassed: false } },
    { label: "controlledRealDocumentAuthorizationPlanAccepted false", override: { controlledRealDocumentAuthorizationPlanAccepted: false } },
    { label: "authorizationPlanOnly false", override: { authorizationPlanOnly: false } },
    { label: "readyFor8x4BControlledRealDocumentContract false", override: { readyFor8x4BControlledRealDocumentContract: false } },
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
    { label: "authorizationRequiresSeparateRealDocumentContract false", override: { authorizationRequiresSeparateRealDocumentContract: false } },
    { label: "authorizationRequiresRedactionPlan false", override: { authorizationRequiresRedactionPlan: false } },
    { label: "authorizationRequiresEvidenceGateMapping false", override: { authorizationRequiresEvidenceGateMapping: false } },
    { label: "authorizationRequiresOCRIsolationPlan false", override: { authorizationRequiresOCRIsolationPlan: false } },
    { label: "authorizationRequiresStoragePolicyPlan false", override: { authorizationRequiresStoragePolicyPlan: false } },
    { label: "authorizationRequiresUserVisibleOutputContract false", override: { authorizationRequiresUserVisibleOutputContract: false } },
    { label: "authorizationRequiresHumanReviewPolicy false", override: { authorizationRequiresHumanReviewPolicy: false } },
    { label: "authorizationRequiresFreshRiskReview false", override: { authorizationRequiresFreshRiskReview: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "contractOnly false", override: { contractOnly: false } },
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
    { label: "readyFor8x4CControlledRealDocumentRedactionPlan false", override: { readyFor8x4CControlledRealDocumentRedactionPlan: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateContractInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    contractAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4B: controlled real-document contract layer — depends on completed 8.4A authorization plan",
    "8.4B is contract/planning only — not real document input or processing",
    "no live LLM call was performed in 8.4B",
    "8.3AC was not re-run",
    "no real document, OCR, photo, file upload, document storage, persistence, public runtime, or user-visible output was authorized",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "any future real-document path requires redaction before any model use",
    "any future real-document path requires structured extraction and evidence gate mapping",
    "any future real-document path requires separate user-visible output contract",
    "the next phase is 8.4C controlled real-document redaction plan",
    "8.4C is still planning only unless explicitly authorized later",
    `8.4A prerequisite: allPassed=${planResult.allPassed}, readyFor8x4B=${planResult.readyFor8x4BControlledRealDocumentContract}`,
    `contract input validation: ${contractAccepted ? "accepted" : "REJECTED"} — reasons: ${contractValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4B allPassed: true — controlled real-document contract accepted"
    );
    notes.push(
      "readyFor8x4CControlledRealDocumentRedactionPlan: true — planning only"
    );
  }

  return {
    checkId: "8.4B",
    allPassed,
    authorizationPlanReadyForContract:
      canonicalInput.controlledRealDocumentAuthorizationPlanAccepted,
    controlledRealDocumentContractAccepted: allPassed,
    contractOnly: true,
    tamperCasesRejected: allTamperRejected,

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

    contractRequiresRedactionBeforeAnyModelUse:
      canonicalInput.contractRequiresRedactionBeforeAnyModelUse,
    contractRequiresStructuredExtractionPlan:
      canonicalInput.contractRequiresStructuredExtractionPlan,
    contractRequiresEvidenceGateMapping:
      canonicalInput.contractRequiresEvidenceGateMapping,
    contractRequiresOCRIsolationPlan:
      canonicalInput.contractRequiresOCRIsolationPlan,
    contractRequiresStoragePolicyPlan:
      canonicalInput.contractRequiresStoragePolicyPlan,
    contractRequiresUserVisibleOutputContract:
      canonicalInput.contractRequiresUserVisibleOutputContract,
    contractRequiresHumanReviewPolicy:
      canonicalInput.contractRequiresHumanReviewPolicy,
    contractRequiresFreshRiskReview:
      canonicalInput.contractRequiresFreshRiskReview,
    contractRequiresExplicitUserConsentPlan:
      canonicalInput.contractRequiresExplicitUserConsentPlan,
    contractRequiresDocumentTypeClassification:
      canonicalInput.contractRequiresDocumentTypeClassification,
    contractRequiresDeadlineDateSourceSeparation:
      canonicalInput.contractRequiresDeadlineDateSourceSeparation,
    contractRequiresNoDeadlineInvention:
      canonicalInput.contractRequiresNoDeadlineInvention,
    contractRequiresNoLegalCertainty:
      canonicalInput.contractRequiresNoLegalCertainty,
    contractRequiresNoCoerciveLegalInstruction:
      canonicalInput.contractRequiresNoCoerciveLegalInstruction,
    contractRequiresAuditTrace: canonicalInput.contractRequiresAuditTrace,
    contractRequiresTamperCoverage:
      canonicalInput.contractRequiresTamperCoverage,
    readyFor8x4CControlledRealDocumentRedactionPlan:
      canonicalInput.readyFor8x4CControlledRealDocumentRedactionPlan,

    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,

    neverUserVisible: true,
    notes,
  };
}
