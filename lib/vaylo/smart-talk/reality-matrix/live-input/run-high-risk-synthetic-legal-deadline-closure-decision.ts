/**
 * Phase 8.3AF — High-Risk Synthetic Legal Deadline Closure / Readiness Decision.
 *
 * CLOSURE LAYER — NO LIVE CALL — DEPENDS ON 8.3AE.
 *
 * This file closes the high-risk synthetic legal deadline chain by consuming
 * the completed 8.3AE post-call audit result. It decides that:
 *   - The synthetic chain is closed.
 *   - The one metadata-only live call must not be repeated.
 *   - 8.4A may begin only as controlled real-document authorization planning.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call runHighRiskSyntheticLegalDeadlineLiveExecution.
 *   - Log, store, or return prompt text, model output, or API key.
 *   - Authorize real document input, user-visible output, public runtime, or persistence.
 *   - Persist anything.
 *   - Emit user-visible output.
 */

import { runHighRiskSyntheticLegalDeadlinePostCallAudit } from "./run-high-risk-synthetic-legal-deadline-post-call-audit";

// ── Local closure input type ──────────────────────────────────────────────────

interface HighRiskSyntheticLegalDeadlineClosureInput {
  // 8.3AE prerequisite gates
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly postCallGovernanceRecheckReady: boolean;
  readonly postCallAuditAccepted: boolean;
  readonly exactlyOneLiveCallAudited: boolean;
  readonly metadataOnlyExecutionAudited: boolean;
  readonly modelOutputUntrustedAuditPassed: boolean;
  readonly modelOutputContentNotInspectedAuditPassed: boolean;
  readonly promptTextNonExposureAuditPassed: boolean;
  readonly modelOutputNonExposureAuditPassed: boolean;
  readonly apiKeyNonExposureAuditPassed: boolean;
  readonly noRealDocumentInputAuditPassed: boolean;
  readonly noUserVisibleOutputAuditPassed: boolean;
  readonly noPersistenceAuditPassed: boolean;
  readonly noPublicRuntimeAuditPassed: boolean;
  readonly legalDeadlineSafetyAuditPassed: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlineClosureDecision: boolean;

  // 8.3AE passthrough invariants (must be false)
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;

  // Closure assertions (must match expected values)
  readonly syntheticHighRiskLegalDeadlineChainClosed: boolean;
  readonly metadataOnlyLiveCallFinalized: boolean;
  readonly liveCallMayBeRepeated: boolean;
  readonly readyForControlledRealDocumentAuthorizationPlan: boolean;
  readonly readyFor8x4AControlledAuthorizationPlan: boolean;

  // Runtime/public invariants (must remain false)
  readonly readyForPublicLaunch: boolean;
  readonly readyForPilotRunNow: boolean;
  readonly readyForRealOperatorPilotRun: boolean;
  readonly readyForLiveLLMRuntime: boolean;
  readonly readyForConnectedAiRuntimeExecution: boolean;
  readonly readyForPersistence: boolean;

  // Prohibited authorizations (must be false)
  readonly realDocumentProcessingAuthorized: boolean;
  readonly userVisibleLegalDeadlineAnswerAuthorized: boolean;
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // Closure scope flags
  readonly closureAllowsOnlyPlanning: boolean;
  readonly closureAllowsRuntimeExecution: boolean;
  readonly closureAllowsPublicLaunch: boolean;
  readonly closureAllowsPersistence: boolean;
  readonly closureAllowsRealDocumentInput: boolean;
  readonly closureAllowsUserVisibleOutput: boolean;

  readonly neverUserVisible: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineClosureDecisionResult {
  readonly checkId: "8.3AF";
  readonly allPassed: boolean;
  readonly postCallAuditReadyForClosure: boolean;
  readonly closureDecisionAccepted: boolean;
  readonly syntheticHighRiskLegalDeadlineChainClosed: boolean;
  readonly metadataOnlyLiveCallFinalized: boolean;
  readonly liveCallMayBeRepeated: false;
  readonly readyForControlledRealDocumentAuthorizationPlan: boolean;
  readonly readyFor8x4AControlledAuthorizationPlan: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPilotRunNow: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForPersistence: false;

  readonly realDocumentProcessingAuthorized: false;
  readonly userVisibleLegalDeadlineAnswerAuthorized: false;
  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly closureAllowsOnlyPlanning: boolean;
  readonly closureAllowsRuntimeExecution: false;
  readonly closureAllowsPublicLaunch: false;
  readonly closureAllowsPersistence: false;
  readonly closureAllowsRealDocumentInput: false;
  readonly closureAllowsUserVisibleOutput: false;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Closure input validator ───────────────────────────────────────────────────

function validateClosureInput(
  c: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.3AE prerequisite gates
  if (c["prereqCheckId"] !== "8.3AE")
    reasons.push("prereq_check_id_invalid");
  if (c["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (c["postCallGovernanceRecheckReady"] !== true)
    reasons.push("post_call_governance_recheck_not_ready");
  if (c["postCallAuditAccepted"] !== true)
    reasons.push("post_call_audit_not_accepted");
  if (c["exactlyOneLiveCallAudited"] !== true)
    reasons.push("exactly_one_live_call_not_audited");
  if (c["metadataOnlyExecutionAudited"] !== true)
    reasons.push("metadata_only_execution_not_audited");
  if (c["modelOutputUntrustedAuditPassed"] !== true)
    reasons.push("model_output_untrusted_audit_failed");
  if (c["modelOutputContentNotInspectedAuditPassed"] !== true)
    reasons.push("model_output_content_not_inspected_audit_failed");
  if (c["promptTextNonExposureAuditPassed"] !== true)
    reasons.push("prompt_text_non_exposure_audit_failed");
  if (c["modelOutputNonExposureAuditPassed"] !== true)
    reasons.push("model_output_non_exposure_audit_failed");
  if (c["apiKeyNonExposureAuditPassed"] !== true)
    reasons.push("api_key_non_exposure_audit_failed");
  if (c["noRealDocumentInputAuditPassed"] !== true)
    reasons.push("no_real_document_input_audit_failed");
  if (c["noUserVisibleOutputAuditPassed"] !== true)
    reasons.push("no_user_visible_output_audit_failed");
  if (c["noPersistenceAuditPassed"] !== true)
    reasons.push("no_persistence_audit_failed");
  if (c["noPublicRuntimeAuditPassed"] !== true)
    reasons.push("no_public_runtime_audit_failed");
  if (c["legalDeadlineSafetyAuditPassed"] !== true)
    reasons.push("legal_deadline_safety_audit_failed");
  if (c["readyForHighRiskSyntheticLegalDeadlineClosureDecision"] !== true)
    reasons.push("not_ready_for_closure_decision");

  // 8.3AE passthrough invariants
  if (c["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (c["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (c["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (c["persistenceUsed"] !== false)
    reasons.push("persistence_used");

  // Closure assertions
  if (c["syntheticHighRiskLegalDeadlineChainClosed"] !== true)
    reasons.push("chain_not_closed");
  if (c["metadataOnlyLiveCallFinalized"] !== true)
    reasons.push("metadata_only_live_call_not_finalized");
  if (c["liveCallMayBeRepeated"] !== false)
    reasons.push("live_call_may_be_repeated");
  if (c["readyForControlledRealDocumentAuthorizationPlan"] !== true)
    reasons.push("not_ready_for_controlled_authorization_plan");
  if (c["readyFor8x4AControlledAuthorizationPlan"] !== true)
    reasons.push("not_ready_for_8_4a_controlled_authorization_plan");

  // Runtime/public invariants
  if (c["readyForPublicLaunch"] !== false)
    reasons.push("ready_for_public_launch");
  if (c["readyForPilotRunNow"] !== false)
    reasons.push("ready_for_pilot_run_now");
  if (c["readyForRealOperatorPilotRun"] !== false)
    reasons.push("ready_for_real_operator_pilot_run");
  if (c["readyForLiveLLMRuntime"] !== false)
    reasons.push("ready_for_live_llm_runtime");
  if (c["readyForConnectedAiRuntimeExecution"] !== false)
    reasons.push("ready_for_connected_ai_runtime");
  if (c["readyForPersistence"] !== false)
    reasons.push("ready_for_persistence");

  // Prohibited authorizations
  if (c["realDocumentProcessingAuthorized"] !== false)
    reasons.push("real_document_processing_authorized");
  if (c["userVisibleLegalDeadlineAnswerAuthorized"] !== false)
    reasons.push("user_visible_legal_deadline_answer_authorized");
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

  // Closure scope flags
  if (c["closureAllowsOnlyPlanning"] !== true)
    reasons.push("closure_does_not_allow_only_planning");
  if (c["closureAllowsRuntimeExecution"] !== false)
    reasons.push("closure_allows_runtime_execution");
  if (c["closureAllowsPublicLaunch"] !== false)
    reasons.push("closure_allows_public_launch");
  if (c["closureAllowsPersistence"] !== false)
    reasons.push("closure_allows_persistence");
  if (c["closureAllowsRealDocumentInput"] !== false)
    reasons.push("closure_allows_real_document_input");
  if (c["closureAllowsUserVisibleOutput"] !== false)
    reasons.push("closure_allows_user_visible_output");

  if (c["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runHighRiskSyntheticLegalDeadlineClosureDecision(): HighRiskSyntheticLegalDeadlineClosureDecisionResult {
  // ── Step 1: Obtain 8.3AE post-call audit result ────────────────────────────
  const auditResult = runHighRiskSyntheticLegalDeadlinePostCallAudit();

  const prereqAllPassed = auditResult.allPassed;
  const prereqReady =
    auditResult.readyForHighRiskSyntheticLegalDeadlineClosureDecision;

  // ── Step 2: Build canonical closure input ──────────────────────────────────
  const canonicalInput: HighRiskSyntheticLegalDeadlineClosureInput = {
    prereqCheckId: auditResult.checkId,
    prereqAllPassed,
    postCallGovernanceRecheckReady: auditResult.postCallGovernanceRecheckReady,
    postCallAuditAccepted: auditResult.postCallAuditAccepted,
    exactlyOneLiveCallAudited: auditResult.exactlyOneLiveCallAudited,
    metadataOnlyExecutionAudited: auditResult.metadataOnlyExecutionAudited,
    modelOutputUntrustedAuditPassed:
      auditResult.modelOutputUntrustedAuditPassed,
    modelOutputContentNotInspectedAuditPassed:
      auditResult.modelOutputContentNotInspectedAuditPassed,
    promptTextNonExposureAuditPassed:
      auditResult.promptTextNonExposureAuditPassed,
    modelOutputNonExposureAuditPassed:
      auditResult.modelOutputNonExposureAuditPassed,
    apiKeyNonExposureAuditPassed: auditResult.apiKeyNonExposureAuditPassed,
    noRealDocumentInputAuditPassed:
      auditResult.noRealDocumentInputAuditPassed,
    noUserVisibleOutputAuditPassed:
      auditResult.noUserVisibleOutputAuditPassed,
    noPersistenceAuditPassed: auditResult.noPersistenceAuditPassed,
    noPublicRuntimeAuditPassed: auditResult.noPublicRuntimeAuditPassed,
    legalDeadlineSafetyAuditPassed: auditResult.legalDeadlineSafetyAuditPassed,
    readyForHighRiskSyntheticLegalDeadlineClosureDecision: prereqReady,

    readyForRealDocumentInput: auditResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: auditResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: auditResult.publicRuntimeEnabled,
    persistenceUsed: auditResult.persistenceUsed,

    syntheticHighRiskLegalDeadlineChainClosed: prereqAllPassed && prereqReady,
    metadataOnlyLiveCallFinalized: prereqAllPassed && prereqReady,
    liveCallMayBeRepeated: false,
    readyForControlledRealDocumentAuthorizationPlan:
      prereqAllPassed && prereqReady,
    readyFor8x4AControlledAuthorizationPlan: prereqAllPassed && prereqReady,

    readyForPublicLaunch: false,
    readyForPilotRunNow: false,
    readyForRealOperatorPilotRun: false,
    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForPersistence: false,

    realDocumentProcessingAuthorized: false,
    userVisibleLegalDeadlineAnswerAuthorized: false,
    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    closureAllowsOnlyPlanning: prereqAllPassed && prereqReady,
    closureAllowsRuntimeExecution: false,
    closureAllowsPublicLaunch: false,
    closureAllowsPersistence: false,
    closureAllowsRealDocumentInput: false,
    closureAllowsUserVisibleOutput: false,

    neverUserVisible: true,
  };

  // ── Step 3: Validate canonical closure input ───────────────────────────────
  const closureValidation = validateClosureInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const closureAccepted = closureValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.3AE checkId wrong", override: { prereqCheckId: "8.3AD" } },
    { label: "8.3AE allPassed false", override: { prereqAllPassed: false } },
    { label: "postCallGovernanceRecheckReady false", override: { postCallGovernanceRecheckReady: false } },
    { label: "postCallAuditAccepted false", override: { postCallAuditAccepted: false } },
    { label: "exactlyOneLiveCallAudited false", override: { exactlyOneLiveCallAudited: false } },
    { label: "metadataOnlyExecutionAudited false", override: { metadataOnlyExecutionAudited: false } },
    { label: "modelOutputUntrustedAuditPassed false", override: { modelOutputUntrustedAuditPassed: false } },
    { label: "modelOutputContentNotInspectedAuditPassed false", override: { modelOutputContentNotInspectedAuditPassed: false } },
    { label: "promptTextNonExposureAuditPassed false", override: { promptTextNonExposureAuditPassed: false } },
    { label: "modelOutputNonExposureAuditPassed false", override: { modelOutputNonExposureAuditPassed: false } },
    { label: "apiKeyNonExposureAuditPassed false", override: { apiKeyNonExposureAuditPassed: false } },
    { label: "noRealDocumentInputAuditPassed false", override: { noRealDocumentInputAuditPassed: false } },
    { label: "noUserVisibleOutputAuditPassed false", override: { noUserVisibleOutputAuditPassed: false } },
    { label: "noPersistenceAuditPassed false", override: { noPersistenceAuditPassed: false } },
    { label: "noPublicRuntimeAuditPassed false", override: { noPublicRuntimeAuditPassed: false } },
    { label: "legalDeadlineSafetyAuditPassed false", override: { legalDeadlineSafetyAuditPassed: false } },
    { label: "readyForHighRiskSyntheticLegalDeadlineClosureDecision false", override: { readyForHighRiskSyntheticLegalDeadlineClosureDecision: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "syntheticHighRiskLegalDeadlineChainClosed false", override: { syntheticHighRiskLegalDeadlineChainClosed: false } },
    { label: "metadataOnlyLiveCallFinalized false", override: { metadataOnlyLiveCallFinalized: false } },
    { label: "liveCallMayBeRepeated true", override: { liveCallMayBeRepeated: true } },
    { label: "readyForControlledRealDocumentAuthorizationPlan false", override: { readyForControlledRealDocumentAuthorizationPlan: false } },
    { label: "readyFor8x4AControlledAuthorizationPlan false", override: { readyFor8x4AControlledAuthorizationPlan: false } },
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateClosureInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    closureAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.3AF: closure/readiness decision layer — depends on completed 8.3AE post-call audit",
    "the high-risk synthetic legal deadline chain is closed",
    "the 8.3AC live call must not be repeated",
    "no live LLM call was performed in 8.3AF",
    "8.3AC was not re-run",
    "prompt text, model output content, API key value, real document content, and user input were not available to 8.3AF",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "8.4A may begin only as controlled real-document authorization planning, not as real document processing",
    "this does not authorize real document input, user-visible output, public launch, persistence, or pilot runtime",
    `8.3AE prerequisite: allPassed=${auditResult.allPassed}, readyForClosure=${auditResult.readyForHighRiskSyntheticLegalDeadlineClosureDecision}`,
    `closure input validation: ${closureAccepted ? "accepted" : "REJECTED"} — reasons: ${closureValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.3AF allPassed: true — closure/readiness decision accepted"
    );
    notes.push("syntheticHighRiskLegalDeadlineChainClosed: true");
    notes.push(
      "readyForControlledRealDocumentAuthorizationPlan: true — 8.4A controlled planning only"
    );
  }

  return {
    checkId: "8.3AF",
    allPassed,
    postCallAuditReadyForClosure: canonicalInput.postCallAuditAccepted,
    closureDecisionAccepted: allPassed,
    syntheticHighRiskLegalDeadlineChainClosed:
      canonicalInput.syntheticHighRiskLegalDeadlineChainClosed,
    metadataOnlyLiveCallFinalized: canonicalInput.metadataOnlyLiveCallFinalized,
    liveCallMayBeRepeated: false,
    readyForControlledRealDocumentAuthorizationPlan:
      canonicalInput.readyForControlledRealDocumentAuthorizationPlan,
    readyFor8x4AControlledAuthorizationPlan:
      canonicalInput.readyFor8x4AControlledAuthorizationPlan,
    tamperCasesRejected: allTamperRejected,

    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    readyForPublicLaunch: false,
    readyForPilotRunNow: false,
    readyForRealOperatorPilotRun: false,
    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForPersistence: false,

    realDocumentProcessingAuthorized: false,
    userVisibleLegalDeadlineAnswerAuthorized: false,
    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    closureAllowsOnlyPlanning: canonicalInput.closureAllowsOnlyPlanning,
    closureAllowsRuntimeExecution: false,
    closureAllowsPublicLaunch: false,
    closureAllowsPersistence: false,
    closureAllowsRealDocumentInput: false,
    closureAllowsUserVisibleOutput: false,

    neverUserVisible: true,
    notes,
  };
}
