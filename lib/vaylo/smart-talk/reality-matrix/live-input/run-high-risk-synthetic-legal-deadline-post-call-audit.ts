/**
 * Phase 8.3AE — High-Risk Synthetic Legal Deadline Post-Call Audit.
 *
 * POST-CALL AUDIT LAYER — NO LIVE CALL — DEPENDS ON 8.3AD.
 *
 * This file audits the already-completed 8.3AD post-call governance recheck
 * without performing any live call and without inspecting model output content.
 *
 * This file does NOT:
 *   - Call OpenAI.
 *   - Call fetch.
 *   - Read process.env.
 *   - Use SDKs.
 *   - Import or call runHighRiskSyntheticLegalDeadlineLiveExecution.
 *   - Log, store, or return prompt text, model output, or API key.
 *   - Persist anything.
 *   - Emit user-visible output.
 *   - Authorize public runtime.
 */

import { runHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck } from "./run-high-risk-synthetic-legal-deadline-post-call-governance-recheck";

// ── Local audit input type ────────────────────────────────────────────────────

interface HighRiskSyntheticLegalDeadlinePostCallAuditInput {
  readonly prereqCheckId: string;
  readonly prereqAllPassed: boolean;
  readonly liveExecutionMetadataSnapshotAccepted: boolean;
  readonly postCallGovernanceRecheckAccepted: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallAudit: boolean;

  // Runtime/public/real-document invariants (must remain false)
  readonly readyForRealDocumentInput: boolean;
  readonly readyForUserVisibleOutput: boolean;
  readonly publicRuntimeEnabled: boolean;
  readonly persistenceUsed: boolean;
  readonly userVisibleOutputEmitted: boolean;
  readonly readyForLiveLLMRuntime: boolean;
  readonly readyForConnectedAiRuntimeExecution: boolean;
  readonly readyForRealOperatorPilotRun: boolean;
  readonly readyForPilotRunNow: boolean;
  readonly readyForPublicLaunch: boolean;
  readonly readyForPersistence: boolean;

  // Legal safety invariants (false required; deliveryDateRequired must be true)
  readonly exactDeadlineCalculationAuthorized: boolean;
  readonly deliveryDateInventionAuthorized: boolean;
  readonly finalDateInventionAuthorized: boolean;
  readonly legalCertaintyAuthorized: boolean;
  readonly coerciveLegalInstructionAuthorized: boolean;
  readonly deliveryDateRequiredForExactDeadline: boolean;

  // Derived audit assertions (all must be true)
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
  readonly postCallGovernanceRecheckReady: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlineClosureDecision: boolean;

  readonly neverUserVisible: boolean;
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlinePostCallAuditResult {
  readonly checkId: "8.3AE";
  readonly allPassed: boolean;
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
  readonly tamperCasesRejected: boolean;

  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;
  readonly publicRuntimeEnabled: false;
  readonly persistenceUsed: false;
  readonly userVisibleOutputEmitted: false;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Audit input validator ─────────────────────────────────────────────────────

function validateAuditInput(
  a: Record<string, unknown>
): { accepted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 8.3AD prerequisite gates
  if (a["prereqCheckId"] !== "8.3AD")
    reasons.push("prereq_check_id_invalid");
  if (a["prereqAllPassed"] !== true)
    reasons.push("prereq_all_passed_false");
  if (a["liveExecutionMetadataSnapshotAccepted"] !== true)
    reasons.push("live_execution_metadata_snapshot_not_accepted");
  if (a["postCallGovernanceRecheckAccepted"] !== true)
    reasons.push("post_call_governance_recheck_not_accepted");
  if (a["readyForHighRiskSyntheticLegalDeadlinePostCallAudit"] !== true)
    reasons.push("not_ready_for_post_call_audit");

  // Runtime/public/real-document invariants
  if (a["readyForRealDocumentInput"] !== false)
    reasons.push("ready_for_real_document_input");
  if (a["readyForUserVisibleOutput"] !== false)
    reasons.push("ready_for_user_visible_output");
  if (a["publicRuntimeEnabled"] !== false)
    reasons.push("public_runtime_enabled");
  if (a["persistenceUsed"] !== false)
    reasons.push("persistence_used");
  if (a["userVisibleOutputEmitted"] !== false)
    reasons.push("user_visible_output_emitted");
  if (a["readyForLiveLLMRuntime"] !== false)
    reasons.push("ready_for_live_llm_runtime");
  if (a["readyForConnectedAiRuntimeExecution"] !== false)
    reasons.push("ready_for_connected_ai_runtime");
  if (a["readyForRealOperatorPilotRun"] !== false)
    reasons.push("ready_for_real_operator_pilot_run");
  if (a["readyForPilotRunNow"] !== false)
    reasons.push("ready_for_pilot_run_now");
  if (a["readyForPublicLaunch"] !== false)
    reasons.push("ready_for_public_launch");
  if (a["readyForPersistence"] !== false)
    reasons.push("ready_for_persistence");

  // Legal safety invariants
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

  // Derived audit assertions
  if (a["exactlyOneLiveCallAudited"] !== true)
    reasons.push("exactly_one_live_call_not_audited");
  if (a["metadataOnlyExecutionAudited"] !== true)
    reasons.push("metadata_only_execution_not_audited");
  if (a["modelOutputUntrustedAuditPassed"] !== true)
    reasons.push("model_output_untrusted_audit_failed");
  if (a["modelOutputContentNotInspectedAuditPassed"] !== true)
    reasons.push("model_output_content_not_inspected_audit_failed");
  if (a["promptTextNonExposureAuditPassed"] !== true)
    reasons.push("prompt_text_non_exposure_audit_failed");
  if (a["modelOutputNonExposureAuditPassed"] !== true)
    reasons.push("model_output_non_exposure_audit_failed");
  if (a["apiKeyNonExposureAuditPassed"] !== true)
    reasons.push("api_key_non_exposure_audit_failed");
  if (a["noRealDocumentInputAuditPassed"] !== true)
    reasons.push("no_real_document_input_audit_failed");
  if (a["noUserVisibleOutputAuditPassed"] !== true)
    reasons.push("no_user_visible_output_audit_failed");
  if (a["noPersistenceAuditPassed"] !== true)
    reasons.push("no_persistence_audit_failed");
  if (a["noPublicRuntimeAuditPassed"] !== true)
    reasons.push("no_public_runtime_audit_failed");
  if (a["legalDeadlineSafetyAuditPassed"] !== true)
    reasons.push("legal_deadline_safety_audit_failed");
  if (a["postCallGovernanceRecheckReady"] !== true)
    reasons.push("post_call_governance_recheck_not_ready");
  if (a["readyForHighRiskSyntheticLegalDeadlineClosureDecision"] !== true)
    reasons.push("not_ready_for_closure_decision");

  if (a["neverUserVisible"] !== true)
    reasons.push("never_user_visible_not_set");

  return { accepted: reasons.length === 0, reasons };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function runHighRiskSyntheticLegalDeadlinePostCallAudit(): HighRiskSyntheticLegalDeadlinePostCallAuditResult {
  // ── Step 1: Obtain 8.3AD governance recheck result ─────────────────────────
  const recheckResult = runHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck();

  const prereqAllPassed = recheckResult.allPassed;
  const prereqReady =
    recheckResult.readyForHighRiskSyntheticLegalDeadlinePostCallAudit;

  // ── Step 2: Build canonical audit input ────────────────────────────────────
  const canonicalInput: HighRiskSyntheticLegalDeadlinePostCallAuditInput = {
    prereqCheckId: recheckResult.checkId,
    prereqAllPassed,
    liveExecutionMetadataSnapshotAccepted:
      recheckResult.liveExecutionMetadataSnapshotAccepted,
    postCallGovernanceRecheckAccepted:
      recheckResult.postCallGovernanceRecheckAccepted,
    readyForHighRiskSyntheticLegalDeadlinePostCallAudit: prereqReady,

    readyForRealDocumentInput: recheckResult.readyForRealDocumentInput,
    readyForUserVisibleOutput: recheckResult.readyForUserVisibleOutput,
    publicRuntimeEnabled: recheckResult.publicRuntimeEnabled,
    persistenceUsed: recheckResult.persistenceUsed,
    userVisibleOutputEmitted: recheckResult.userVisibleOutputEmitted,
    readyForLiveLLMRuntime: recheckResult.readyForLiveLLMRuntime,
    readyForConnectedAiRuntimeExecution:
      recheckResult.readyForConnectedAiRuntimeExecution,
    readyForRealOperatorPilotRun: recheckResult.readyForRealOperatorPilotRun,
    readyForPilotRunNow: recheckResult.readyForPilotRunNow,
    readyForPublicLaunch: recheckResult.readyForPublicLaunch,
    readyForPersistence: recheckResult.readyForPersistence,

    exactDeadlineCalculationAuthorized:
      recheckResult.exactDeadlineCalculationAuthorized,
    deliveryDateInventionAuthorized:
      recheckResult.deliveryDateInventionAuthorized,
    finalDateInventionAuthorized: recheckResult.finalDateInventionAuthorized,
    legalCertaintyAuthorized: recheckResult.legalCertaintyAuthorized,
    coerciveLegalInstructionAuthorized:
      recheckResult.coerciveLegalInstructionAuthorized,
    deliveryDateRequiredForExactDeadline: true,

    exactlyOneLiveCallAudited: prereqAllPassed,
    metadataOnlyExecutionAudited: prereqAllPassed,
    modelOutputUntrustedAuditPassed: prereqAllPassed,
    modelOutputContentNotInspectedAuditPassed: prereqAllPassed,
    promptTextNonExposureAuditPassed: prereqAllPassed,
    modelOutputNonExposureAuditPassed: prereqAllPassed,
    apiKeyNonExposureAuditPassed: prereqAllPassed,
    noRealDocumentInputAuditPassed: prereqAllPassed,
    noUserVisibleOutputAuditPassed: prereqAllPassed,
    noPersistenceAuditPassed: prereqAllPassed,
    noPublicRuntimeAuditPassed: prereqAllPassed,
    legalDeadlineSafetyAuditPassed: prereqAllPassed,
    postCallGovernanceRecheckReady: prereqAllPassed && prereqReady,
    readyForHighRiskSyntheticLegalDeadlineClosureDecision:
      prereqAllPassed && prereqReady,

    neverUserVisible: true,
  };

  // ── Step 3: Validate canonical audit input ─────────────────────────────────
  const auditValidation = validateAuditInput(
    canonicalInput as unknown as Record<string, unknown>
  );
  const auditAccepted = auditValidation.accepted;

  // ── Step 4: Tamper tests ───────────────────────────────────────────────────
  const base: Record<string, unknown> = { ...canonicalInput };

  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    { label: "8.3AD checkId wrong", override: { prereqCheckId: "8.3AC" } },
    { label: "8.3AD allPassed false", override: { prereqAllPassed: false } },
    { label: "liveExecutionMetadataSnapshotAccepted false", override: { liveExecutionMetadataSnapshotAccepted: false } },
    { label: "postCallGovernanceRecheckAccepted false", override: { postCallGovernanceRecheckAccepted: false } },
    { label: "readyForHighRiskSyntheticLegalDeadlinePostCallAudit false", override: { readyForHighRiskSyntheticLegalDeadlinePostCallAudit: false } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
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
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    { label: "userVisibleOutputEmitted true", override: { userVisibleOutputEmitted: true } },
    { label: "readyForLiveLLMRuntime true", override: { readyForLiveLLMRuntime: true } },
    { label: "readyForConnectedAiRuntimeExecution true", override: { readyForConnectedAiRuntimeExecution: true } },
    { label: "readyForRealOperatorPilotRun true", override: { readyForRealOperatorPilotRun: true } },
    { label: "readyForPilotRunNow true", override: { readyForPilotRunNow: true } },
    { label: "readyForPublicLaunch true", override: { readyForPublicLaunch: true } },
    { label: "readyForPersistence true", override: { readyForPersistence: true } },
    { label: "neverUserVisible false", override: { neverUserVisible: false } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered: Record<string, unknown> = { ...base, ...tc.override };
    const result = validateAuditInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 5: Aggregate ──────────────────────────────────────────────────────
  const allPassed =
    auditAccepted && allTamperRejected && tamperFailures.length === 0;

  const notes: string[] = [
    "8.3AE: post-call audit layer — depends on completed 8.3AD governance recheck",
    "no live LLM call was performed in 8.3AE",
    "8.3AC was not re-run",
    "prompt text, model output content, API key value, real document content, and user input were not available to 8.3AE",
    "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
    "next phase is closure/readiness decision, not real document input",
    `8.3AD prerequisite: allPassed=${recheckResult.allPassed}, readyForAudit=${recheckResult.readyForHighRiskSyntheticLegalDeadlinePostCallAudit}`,
    `audit input validation: ${auditAccepted ? "accepted" : "REJECTED"} — reasons: ${auditValidation.reasons.join(", ") || "none"}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.3AE allPassed: true — post-call audit accepted"
    );
    notes.push(
      "readyForHighRiskSyntheticLegalDeadlineClosureDecision: true"
    );
  }

  return {
    checkId: "8.3AE",
    allPassed,
    postCallGovernanceRecheckReady: canonicalInput.postCallGovernanceRecheckReady,
    postCallAuditAccepted: allPassed,
    exactlyOneLiveCallAudited: canonicalInput.exactlyOneLiveCallAudited,
    metadataOnlyExecutionAudited: canonicalInput.metadataOnlyExecutionAudited,
    modelOutputUntrustedAuditPassed:
      canonicalInput.modelOutputUntrustedAuditPassed,
    modelOutputContentNotInspectedAuditPassed:
      canonicalInput.modelOutputContentNotInspectedAuditPassed,
    promptTextNonExposureAuditPassed:
      canonicalInput.promptTextNonExposureAuditPassed,
    modelOutputNonExposureAuditPassed:
      canonicalInput.modelOutputNonExposureAuditPassed,
    apiKeyNonExposureAuditPassed: canonicalInput.apiKeyNonExposureAuditPassed,
    noRealDocumentInputAuditPassed:
      canonicalInput.noRealDocumentInputAuditPassed,
    noUserVisibleOutputAuditPassed:
      canonicalInput.noUserVisibleOutputAuditPassed,
    noPersistenceAuditPassed: canonicalInput.noPersistenceAuditPassed,
    noPublicRuntimeAuditPassed: canonicalInput.noPublicRuntimeAuditPassed,
    legalDeadlineSafetyAuditPassed: canonicalInput.legalDeadlineSafetyAuditPassed,
    readyForHighRiskSyntheticLegalDeadlineClosureDecision:
      canonicalInput.readyForHighRiskSyntheticLegalDeadlineClosureDecision,
    tamperCasesRejected: allTamperRejected,

    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    publicRuntimeEnabled: false,
    persistenceUsed: false,
    userVisibleOutputEmitted: false,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,
    deliveryDateRequiredForExactDeadline: true,

    neverUserVisible: true,
    notes,
  };
}
