/**
 * Phase 8.4A — Controlled Real Document Authorization Plan.
 *
 * AUTHORIZATION PLAN ONLY — NOT REAL DOCUMENT INPUT — DEPENDS ON 8.3AF.
 *
 * This file decides whether Vaylo may begin planning for a controlled
 * real-document authorization path. It is:
 *   - NOT real document input.
 *   - NOT real document processing.
 *   - NOT OCR, photo, or file upload.
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

import { runHighRiskSyntheticLegalDeadlineClosureDecision } from "./run-high-risk-synthetic-legal-deadline-closure-decision";

// ── Local authorization input type ───────────────────────────────────────────

interface ControlledRealDocumentAuthorizationPlanInput {
  // 8.3AF prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly postCallAuditReadyForClosure: boolean;
  readonly closureDecisionAccepted: boolean;
  readonly syntheticHighRiskLegalDeadlineChainClosed: boolean;
  readonly metadataOnlyLiveCallFinalized: boolean;
  readonly liveCallMayBeRepeated: boolean;
  readonly readyForControlledRealDocumentAuthorizationPlan: boolean;
  readonly readyFor8x4AControlledAuthorizationPlan: boolean;

  // 8.3AF passthrough invariants (must remain false/true)
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly readyForPublicLaunch: boolean;
  readonly readyForPilotRunNow: boolean;
  readonly readyForRealOperatorPilotRun: boolean;
  readonly readyForLiveLLMRuntime: boolean;
  readonly readyForConnectedAiRuntimeExecution: boolean;
  readonly readyForPersistence: boolean;
  readonly realDocumentProcessingAuthorized: boolean;
  readonly userVisibleLegalDeadlineAnswerAuthorized: boolean;
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;
  readonly closureAllowsOnlyPlanning: boolean;
  readonly closureAllowsRuntimeExecution: boolean;
  readonly closureAllowsPublicLaunch: boolean;
  readonly closureAllowsPersistence: boolean;
  readonly closureAllowsRealDocumentInput: boolean;
  readonly closureAllowsUserVisibleOutput: boolean;
  readonly neverUserVisible: boolean;

  // Derived 8.4A authorization assertions
  readonly authorizationPlanOnly: boolean;
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
  readonly authorizationRequiresSeparateRealDocumentContract: boolean;
  readonly authorizationRequiresRedactionPlan: boolean;
  readonly authorizationRequiresEvidenceGateMapping: boolean;
  readonly authorizationRequiresOCRIsolationPlan: boolean;
  readonly authorizationRequiresStoragePolicyPlan: boolean;
  readonly authorizationRequiresUserVisibleOutputContract: boolean;
  readonly authorizationRequiresHumanReviewPolicy: boolean;
  readonly authorizationRequiresFreshRiskReview: boolean;
  readonly readyFor8x4BControlledRealDocumentContract: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface ControlledRealDocumentAuthorizationPlanResult {
  readonly checkId: "8.4A";
  readonly allPassed: boolean;
  readonly closureReadyForControlledAuthorizationPlan: boolean;
  readonly controlledRealDocumentAuthorizationPlanAccepted: boolean;
  readonly authorizationPlanOnly: true;
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

  readonly authorizationRequiresSeparateRealDocumentContract: boolean;
  readonly authorizationRequiresRedactionPlan: boolean;
  readonly authorizationRequiresEvidenceGateMapping: boolean;
  readonly authorizationRequiresOCRIsolationPlan: boolean;
  readonly authorizationRequiresStoragePolicyPlan: boolean;
  readonly authorizationRequiresUserVisibleOutputContract: boolean;
  readonly authorizationRequiresHumanReviewPolicy: boolean;
  readonly authorizationRequiresFreshRiskReview: boolean;
  readonly readyFor8x4BControlledRealDocumentContract: boolean;

  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Authorization input validator ─────────────────────────────────────────────

function validateAuthorizationInput(
  a: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.3AF prerequisite gates
  if (a["prereqCheckId"] !== "8.3AF")
    reasons.push("prereq_check_id_invalid");
  if (a["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (a["postCallAuditReadyForClosure"] !== true)
    reasons.push("post_call_audit_not_ready_for_closure");
  if (a["closureDecisionAccepted"] !== true)
    reasons.push("closure_decision_not_accepted");
  if (a["syntheticHighRiskLegalDeadlineChainClosed"] !== true)
    reasons.push("chain_not_closed");
  if (a["metadataOnlyLiveCallFinalized"] !== true)
    reasons.push("metadata_only_live_call_not_finalized");
  if (a["liveCallMayBeRepeated"] !== false)
    reasons.push("live_call_may_be_repeated");
  if (a["readyForControlledRealDocumentAuthorizationPlan"] !== true)
    reasons.push("not_ready_for_controlled_authorization_plan");
  if (a["readyFor8x4AControlledAuthorizationPlan"] !== true)
    reasons.push("not_ready_for_8_4a_controlled_authorization_plan");

  // 8.3AF passthrough invariants
  if (a["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (a["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (a["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (a["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (a["readyForPublicLaunch"] !== false)
    reasons.push("ready_for_public_launch");
  if (a["readyForPilotRunNow"] !== false)
    reasons.push("ready_for_pilot_run_now");
  if (a["readyForRealOperatorPilotRun"] !== false)
    reasons.push("ready_for_real_operator_pilot_run");
  if (a["readyForLiveLLMRuntime"] !== false)
    reasons.push("ready_for_live_llm_runtime");
  if (a["readyForConnectedAiRuntimeExecution"] !== false)
    reasons.push("ready_for_connected_ai_runtime");
  if (a["readyForPersistence"] !== false)
    reasons.push("ready_for_persistence");
  if (a["realDocumentProcessingAuthorized"] !== false)
    reasons.push("real_document_processing_authorized");
  if (a["userVisibleLegalDeadlineAnswerAuthorized"] !== false)
    reasons.push("user_visible_legal_deadline_answer_authorized");
  if (a["exactDeadlineCalculationAuthorized"] !== false)
    reasons.push("exact_deadline_calculation_authorized");
  if (a["deliveryDateInventionAuthorized"] !== false)
    reasons.push("delivery_date_invention_authorized");
  if (a["finalDateInventionAuthorized"] !== false)
    reasons.push("final_date_invention_authorized");
  if (a["legalCertaintyAuthorized"] !== false)
    reasons.push("legal_certainty_authorized");
  if (a["coerciveLegalInstructionAuthorized"] !== false)
    reasons.push("coercive_legal_instruction_authorized");
  if (a["deliveryDateRequiredForExactDeadline"] !== true)
    reasons.push("delivery_date_not_required");
  if (a["closureAllowsOnlyPlanning"] !== true)
    reasons.push("closure_does_not_allow_only_planning");
  if (a["closureAllowsRuntimeExecution"] !== false)
    reasons.push("closure_allows_runtime_execution");
  if (a["closureAllowsPublicLaunch"] !== false)
    reasons.push("closure_allows_public_launch");
  if (a["closureAllowsPersistence"] !== false)
    reasons.push("closure_allows_persistence");
  if (a["closureAllowsRealDocumentInput"] !== false)
    reasons.push("closure_allows_real_document_input");
  if (a["closureAllowsUserVisibleOutput"] !== false)
    reasons.push("closure_allows_user_visible_output");
  if (a["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  // Derived 8.4A assertions
  if (a["authorizationPlanOnly"] !== true)
    reasons.push("authorization_plan_only_false");
  if (a["realDocumentInputAuthorizedNow"] !== false)
    reasons.push("real_document_input_authorized_now");
  if (a["realDocumentProcessingAuthorizedNow"] !== false)
    reasons.push("real_document_processing_authorized_now");
  if (a["realUserDocumentUploadAuthorizedNow"] !== false)
    reasons.push("real_user_document_upload_authorized_now");
  if (a["ocrRuntimeAuthorizedNow"] !== false)
    reasons.push("ocr_runtime_authorized_now");
  if (a["photoInputAuthorizedNow"] !== false)
    reasons.push("photo_input_authorized_now");
  if (a["fileInputAuthorizedNow"] !== false)
    reasons.push("file_input_authorized_now");
  if (a["documentStorageAuthorizedNow"] !== false)
    reasons.push("document_storage_authorized_now");
  if (a["persistenceAuthorizedNow"] !== false)
    reasons.push("persistence_authorized_now");
  if (a["publicRuntimeAuthorizedNow"] !== false)
    reasons.push("public_runtime_authorized_now");
  if (a["userVisibleLegalDeadlineOutputAuthorizedNow"] !== false)
    reasons.push("user_visible_legal_deadline_output_authorized_now");
  if (a["liveLLMRuntimeAuthorizedNow"] !== false)
    reasons.push("live_llm_runtime_authorized_now");
  if (a["connectedAiRuntimeAuthorizedNow"] !== false)
    reasons.push("connected_ai_runtime_authorized_now");
  if (a["pilotRuntimeAuthorizedNow"] !== false)
    reasons.push("pilot_runtime_authorized_now");
  if (a["productionRuntimeAuthorizedNow"] !== false)
    reasons.push("production_runtime_authorized_now");
  if (a["authorizationRequiresSeparateRealDocumentContract"] !== true)
    reasons.push("authorization_requires_separate_real_document_contract_false");
  if (a["authorizationRequiresRedactionPlan"] !== true)
    reasons.push("authorization_requires_redaction_plan_false");
  if (a["authorizationRequiresEvidenceGateMapping"] !== true)
    reasons.push("authorization_requires_evidence_gate_mapping_false");
  if (a["authorizationRequiresOCRIsolationPlan"] !== true)
    reasons.push("authorization_requires_ocr_isolation_plan_false");
  if (a["authorizationRequiresStoragePolicyPlan"] !== true)
    reasons.push("authorization_requires_storage_policy_plan_false");
  if (a["authorizationRequiresUserVisibleOutputContract"] !== true)
    reasons.push("authorization_requires_user_visible_output_contract_false");
  if (a["authorizationRequiresHumanReviewPolicy"] !== true)
    reasons.push("authorization_requires_human_review_policy_false");
  if (a["authorizationRequiresFreshRiskReview"] !== true)
    reasons.push("authorization_requires_fresh_risk_review_false");
  if (a["readyFor8x4BControlledRealDocumentContract"] !== true)
    reasons.push("not_ready_for_8_4b_controlled_real_document_contract");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runControlledRealDocumentAuthorizationPlan(): ControlledRealDocumentAuthorizationPlanResult {
  // ── Step 1: Obtain 8.3AF closure decision result ───────────────────────────
  const closureResult = runHighRiskSyntheticLegalDeadlineClosureDecision();

  const prereqAllPassed = closureResult.allPassed;
  const prereqReady =
    closureResult.readyForControlledRealDocumentAuthorizationPlan;

  // ── Step 2: Build canonical authorization input ────────────────────────────
  const canonicalInput: ControlledRealDocumentAuthorizationPlanInput = {
    prereqCheckId: closureResult.checkId,
    prereqAllPassed,
    postCallAuditReadyForClosure: closureResult.postCallAuditReadyForClosure,
    closureDecisionAccepted: closureResult.closureDecisionAccepted,
    syntheticHighRiskLegalDeadlineChainClosed:
      closureResult.syntheticHighRiskLegalDeadlineChainClosed,
    metadataOnlyLiveCallFinalized: closureResult.metadataOnlyLiveCallFinalized,
    liveCallMayBeRepeated: closureResult.liveCallMayBeRepeated,
    readyForControlledRealDocumentAuthorizationPlan: prereqReady,
    readyFor8x4AControlledAuthorizationPlan:
      closureResult.readyFor8x4AControlledAuthorizationPlan,

    readyForRealDocumentInput: closureResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: closureResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: closureResult.publicRuntimeEnabled,
    persistenceUsed: closureResult.persistenceUsed,
    readyForPublicLaunch: closureResult.readyForPublicLaunch,
    readyForPilotRunNow: closureResult.readyForPilotRunNow,
    readyForRealOperatorPilotRun: closureResult.readyForRealOperatorPilotRun,
    readyForLiveLLMRuntime: closureResult.readyForLiveLLMRuntime,
    readyForConnectedAiRuntimeExecution:
      closureResult.readyForConnectedAiRuntimeExecution,
    readyForPersistence: closureResult.readyForPersistence,
    realDocumentProcessingAuthorized:
      closureResult.realDocumentProcessingAuthorized,
    userVisibleLegalDeadlineAnswerAuthorized:
      closureResult.userVisibleLegalDeadlineAnswerAuthorized,
    exactDeadlineCalculationAuthorized:
      closureResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized:
      closureResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: closureResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: closureResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      closureResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline:
      closureResult.deliveryDateRequiredForExactDeadline,
    closureAllowsOnlyPlanning: closureResult.closureAllowsOnlyPlanning,
    closureAllowsRuntimeExecution: closureResult.closureAllowsRuntimeExecution,
    closureAllowsPublicLaunch: closureResult.closureAllowsPublicLaunch,
    closureAllowsPersistence: closureResult.closureAllowsPersistence,
    closureAllowsRealDocumentInput: closureResult.closureAllowsRealDocumentInput,
    closureAllowsUserVisibleOutput: closureResult.closureAllowsUserVisibleOutput,
    neverUserVisible: closureResult.neverUserVisible,

    authorizationPlanOnly: true,
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
    authorizationRequiresSeparateRealDocumentContract:
      prereqAllPassed && prereqReady,
    authorizationRequiresRedactionPlan: prereqAllPassed && prereqReady,
    authorizationRequiresEvidenceGateMapping: prereqAllPassed && prereqReady,
    authorizationRequiresOCRIsolationPlan: prereqAllPassed && prereqReady,
    authorizationRequiresStoragePolicyPlan: prereqAllPassed && prereqReady,
    authorizationRequiresUserVisibleOutputContract:
      prereqAllPassed && prereqReady,
    authorizationRequiresHumanReviewPolicy: prereqAllPassed && prereqReady,
    authorizationRequiresFreshRiskReview: prereqAllPassed && prereqReady,
    readyFor8x4BControlledRealDocumentContract:
      prereqAllPassed && prereqReady,
  };

  // ── Step 3: Validate canonical authorization input ─────────────────────────
  const authValidation = validateAuthorizationInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const authAccepted = authValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.3AF checkId wrong", override: { prereqCheckId: "8.3AE" } },
    { label: "8.3AF allPassed false", override: { prereqAllPassed: false } },
    { label: "closureDecisionAccepted false", override: { closureDecisionAccepted: false } },
    { label: "syntheticHighRiskLegalDeadlineChainClosed false", override: { syntheticHighRiskLegalDeadlineChainClosed: false } },
    { label: "metadataOnlyLiveCallFinalized false", override: { metadataOnlyLiveCallFinalized: false } },
    { label: "liveCallMayBeRepeated true", override: { liveCallMayBeRepeated: true } },
    { label: "readyForControlledRealDocumentAuthorizationPlan false", override: { readyForControlledRealDocumentAuthorizationPlan: false } },
    { label: "readyFor8x4AControlledAuthorizationPlan false", override: { readyFor8x4AControlledAuthorizationPlan: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "readyForPublicLaunch true", override: { readyForPublicLaunch: true } },
    { label: "readyForPilotRunNow true", override: { readyForPilotRunNow: true } },
    { label: "readyForRealOperatorPilotRun true", override: { readyForRealOperatorPilotRun: true } },
    { label: "readyForLiveLLMRuntime true", override: { readyForLiveLLMRuntime: true } },
    { label: "readyForConnectedAiRuntimeExecution true", override: { readyForConnectedAiRuntimeExecution: true } },
    { label: "readyForPersistence true", override: { readyForPersistence: true } },
    { label: "realDocumentProcessingAuthorized true", override: { realDocumentProcessingAuthorized: true } },
    { label: "userVisibleLegalDeadlineAnswerAuthorized true", override: { userVisibleLegalDeadlineAnswerAuthorized: true } },
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    { label: "closureAllowsOnlyPlanning false", override: { closureAllowsOnlyPlanning: false } },
    { label: "closureAllowsRuntimeExecution true", override: { closureAllowsRuntimeExecution: true } },
    { label: "closureAllowsPublicLaunch true", override: { closureAllowsPublicLaunch: true } },
    { label: "closureAllowsPersistence true", override: { closureAllowsPersistence: true } },
    { label: "closureAllowsRealDocumentInput true", override: { closureAllowsRealDocumentInput: true } },
    { label: "closureAllowsUserVisibleOutput true", override: { closureAllowsUserVisibleOutput: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
    { label: "authorizationPlanOnly false", override: { authorizationPlanOnly: false } },
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
    { label: "authorizationRequiresSeparateRealDocumentContract false", override: { authorizationRequiresSeparateRealDocumentContract: false } },
    { label: "authorizationRequiresRedactionPlan false", override: { authorizationRequiresRedactionPlan: false } },
    { label: "authorizationRequiresEvidenceGateMapping false", override: { authorizationRequiresEvidenceGateMapping: false } },
    { label: "authorizationRequiresOCRIsolationPlan false", override: { authorizationRequiresOCRIsolationPlan: false } },
    { label: "authorizationRequiresStoragePolicyPlan false", override: { authorizationRequiresStoragePolicyPlan: false } },
    { label: "authorizationRequiresUserVisibleOutputContract false", override: { authorizationRequiresUserVisibleOutputContract: false } },
    { label: "authorizationRequiresHumanReviewPolicy false", override: { authorizationRequiresHumanReviewPolicy: false } },
    { label: "authorizationRequiresFreshRiskReview false", override: { authorizationRequiresFreshRiskReview: false } },
    { label: "readyFor8x4BControlledRealDocumentContract false", override: { readyFor8x4BControlledRealDocumentContract: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateAuthorizationInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    authAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.4A: controlled real-document authorization plan — depends on completed 8.3AF closure/readiness decision",
    "the high-risk synthetic legal deadline chain remains closed",
    "the 8.3AC live call must not be repeated",
    "no live LLM call was performed in 8.4A",
    "8.3AC was not re-run",
    "no real document, OCR, photo, file upload, persistence, public runtime, or user-visible output was authorized",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "the next phase is 8.4B controlled real-document contract",
    "8.4B is still contract/planning only unless explicitly authorized later",
    "prompt text, model output content, API key value, real document content, and user input were not available to 8.4A",
    `8.3AF prerequisite: allPassed=${closureResult.allPassed}, readyForControlledAuthorizationPlan=${closureResult.readyForControlledRealDocumentAuthorizationPlan}`,
    `authorization input validation: ${authAccepted ? "accepted" : "REJECTED"} — reasons: ${authValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.4A allPassed: true — controlled real-document authorization plan accepted"
    );
    notes.push(
      "readyFor8x4BControlledRealDocumentContract: true — planning only"
    );
  }

  return {
    checkId: "8.4A",
    allPassed,
    closureReadyForControlledAuthorizationPlan:
      canonicalInput.postCallAuditReadyForClosure,
    controlledRealDocumentAuthorizationPlanAccepted: allPassed,
    authorizationPlanOnly: true,
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

    authorizationRequiresSeparateRealDocumentContract:
      canonicalInput.authorizationRequiresSeparateRealDocumentContract,
    authorizationRequiresRedactionPlan:
      canonicalInput.authorizationRequiresRedactionPlan,
    authorizationRequiresEvidenceGateMapping:
      canonicalInput.authorizationRequiresEvidenceGateMapping,
    authorizationRequiresOCRIsolationPlan:
      canonicalInput.authorizationRequiresOCRIsolationPlan,
    authorizationRequiresStoragePolicyPlan:
      canonicalInput.authorizationRequiresStoragePolicyPlan,
    authorizationRequiresUserVisibleOutputContract:
      canonicalInput.authorizationRequiresUserVisibleOutputContract,
    authorizationRequiresHumanReviewPolicy:
      canonicalInput.authorizationRequiresHumanReviewPolicy,
    authorizationRequiresFreshRiskReview:
      canonicalInput.authorizationRequiresFreshRiskReview,
    readyFor8x4BControlledRealDocumentContract:
      canonicalInput.readyFor8x4BControlledRealDocumentContract,

    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,

    neverUserVisible: true,
    notes,
  };
}
