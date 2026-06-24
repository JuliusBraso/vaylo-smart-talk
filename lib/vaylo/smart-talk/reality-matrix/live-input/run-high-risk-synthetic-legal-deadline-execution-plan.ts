/**
 * Phase 8.3AA — High-Risk Synthetic Legal Deadline Execution Plan.
 *
 * EXECUTION PLAN ONLY. This file does NOT:
 *   - Call OpenAI or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Finalize or send the API prompt
 *   - Inspect model output
 *   - Process real user input (OCR/photo/file)
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Calculate an exact legal deadline
 *   - Invent a delivery date or final Widerspruch date
 *   - Authorize legal certainty or coercive legal instructions
 */

import { runHighRiskSyntheticLegalDeadlineContract } from "./run-high-risk-synthetic-legal-deadline-contract";
import {
  FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_STRINGS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_BLOCKERS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_CHECKLIST,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_DEBT_NOTES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_EXPECTED_BEHAVIORS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_FORBIDDEN_COMPONENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_REQUIREMENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_RISK_CLASSES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SCOPES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SYNTHETIC_COMPONENTS,
} from "./high-risk-synthetic-legal-deadline-execution-plan-types";
import type {
  HighRiskSyntheticLegalDeadlineExecutionPlanCheckResult,
  HighRiskSyntheticLegalDeadlineExecutionPlanInput,
  HighRiskSyntheticLegalDeadlineExecutionPlanResult,
} from "./high-risk-synthetic-legal-deadline-execution-plan-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  for (const forbidden of FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_STRINGS) {
    if (lower.includes(forbidden.toLowerCase())) return true;
  }
  return false;
}

function containsPiiPattern(text: string): boolean {
  if (/\bsk-[A-Za-z0-9]{10,}\b/.test(text)) return true;
  if (/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(text)) return true;
  if (/\+\d{10,}/.test(text)) return true;
  if (/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/.test(text)) return true;
  // German formal salutation → real-person content signal (8.3AA-PATCH)
  if (/\bSehr\s+geehrte/i.test(text)) return true;
  // Telephone label → real contact-data signal (8.3AA-PATCH, aligns with 8.3Z)
  if (/\bTelefon\b/i.test(text)) return true;
  return false;
}

function containsSecretLike(text: string): boolean {
  if (/OPENAI_API_KEY\s*=/.test(text)) return true;
  if (/sk-[A-Za-z0-9]{10,}/.test(text)) return true;
  if (/Bearer\s+[A-Za-z0-9\-._~+/]+=*/.test(text)) return true;
  if (/apiKey\s*:\s*['"]/.test(text)) return true;
  if (/process\.env\.[A-Z_]{4,}/.test(text)) return true;
  return false;
}

/**
 * Checks text for unsafe execution-plan markers. Deliberately avoids matching
 * legitimate governance-statement phrases in required acknowledgments, notes,
 * and debt notes for this phase.
 */
function containsUnsafeMarker(text: string): boolean {
  const lower = text.toLowerCase();
  const unsafeMarkers = [
    "model output logged",
    "prompt text logged",
    "prompt stored",
    "completion stored",
    "real user input stored",
    "live llm executed",
    "real model output returned",
    "production runtime enabled",
    "branch c executed",
    "run smart talk executed",
    "ocr runtime executed",
    "persistence completed",
    "user visible output displayed",
    "public runtime activated",
    "real operator pilot ran",
    "exact widerspruch deadline calculated",
    "legal deadline guaranteed",
    "you must file widerspruch by",
    "widerspruch legally certain",
    "real bescheid processed",
    "real legal deadline authorized",
    "public legal deadline runtime ready",
    "user-visible legal advice ready",
    "production legal advice enabled",
    "rechtsbehelfsbelehrung vollständig geprüft",
    "genauer fristablauf berechnet",
    "delivery date inferred",
    "final widerspruch date inferred",
    "execution prompt sent",
    "live legal deadline call executed",
  ];
  for (const marker of unsafeMarkers) {
    if (lower.includes(marker)) return true;
  }
  return false;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildHighRiskSyntheticLegalDeadlineExecutionPlanInput(params?: {
  readonly contractReady?: boolean;
  readonly contractAllPassed?: boolean;
}): HighRiskSyntheticLegalDeadlineExecutionPlanInput {
  const contractReadyForExecutionPlan = params?.contractReady ?? true;
  const contractAllPassed = params?.contractAllPassed ?? true;
  const accepted = contractReadyForExecutionPlan && contractAllPassed;

  const allAcks =
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS.join(
      " | "
    );

  return {
    executionPlanId: "high-risk-synthetic-legal-deadline-execution-plan-8-3aa",
    epochId: "8.3AA",
    previousPhaseId: "8.3Z",

    contractReadyForExecutionPlan,
    contractAllPassed,

    selectedCase: "synthetic_high_risk_widerspruch_deadline",
    provider: "openai",
    model: "gpt_4o_mini",
    apiModel: "gpt-4o-mini",
    sourceKind: "synthetic_high_risk_legal_deadline_never_user_visible",

    scopes: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SCOPES,
    ],
    riskClasses: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_RISK_CLASSES,
    ],
    syntheticComponents: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SYNTHETIC_COMPONENTS,
    ],
    forbiddenComponents: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_FORBIDDEN_COMPONENTS,
    ],
    expectedBehaviors: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_EXPECTED_BEHAVIORS,
    ],
    requirements: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_REQUIREMENTS,
    ],
    blockers: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_BLOCKERS,
    ],
    checklistConfirmed: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_CHECKLIST,
    ],

    executionPlanOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,
    futureGovernanceRecheckRequired: true,
    futurePostCallAuditRequired: true,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInExecutionPlan: false,
    directOpenAiCallMadeByExecutionPlan: false,
    promptTextFinalizedForCall: false,
    modelOutputAvailableInExecutionPlan: false,

    readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: accepted,
    highRiskSyntheticLegalDeadlineExecutionPlanAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,
    technicalDebtNotes: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_DEBT_NOTES,
    ],

    operatorHighRiskExecutionPlanAcknowledgment: allAcks,
    reviewerHighRiskExecutionPlanAcknowledgment: allAcks,

    notes: [
      "high-risk synthetic Widerspruch deadline execution plan completed without live call",
      "dry-run authorization is required before any future live call",
      "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
      "ready for high-risk synthetic legal deadline dry-run authorization only",
    ],

    containsRealUserInput: false,
    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsModelOutput: false,
    containsSecret: false,
    containsEnvValue: false,
    containsApiKey: false,
    containsUserPii: false,
    containsDocumentContent: false,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

export function validateHighRiskSyntheticLegalDeadlineExecutionPlanInput(
  input: HighRiskSyntheticLegalDeadlineExecutionPlanInput
): HighRiskSyntheticLegalDeadlineExecutionPlanResult {
  const r = asRec(input);
  const rejectionReasons: HighRiskSyntheticLegalDeadlineExecutionPlanResult["rejectionReasons"][number][] =
    [];

  // 1–2. Contract readiness gates
  if (r["contractReadyForExecutionPlan"] !== true) {
    return buildResult(input, "blocked", ["contract_not_ready"], false);
  }
  if (r["contractAllPassed"] !== true) {
    return buildResult(input, "blocked", ["contract_not_passed"], false);
  }

  // 3–7. Identity fields
  if (r["selectedCase"] !== "synthetic_high_risk_widerspruch_deadline") {
    rejectionReasons.push("selected_case_invalid");
  }
  if (r["provider"] !== "openai") {
    rejectionReasons.push("provider_invalid");
  }
  if (r["model"] !== "gpt_4o_mini") {
    rejectionReasons.push("model_invalid");
  }
  if (r["apiModel"] !== "gpt-4o-mini") {
    rejectionReasons.push("api_model_invalid");
  }
  if (r["sourceKind"] !== "synthetic_high_risk_legal_deadline_never_user_visible") {
    rejectionReasons.push("source_kind_invalid");
  }

  // 8. Arrays
  const scopes = Array.isArray(r["scopes"]) ? (r["scopes"] as string[]) : [];
  const riskClasses = Array.isArray(r["riskClasses"])
    ? (r["riskClasses"] as string[])
    : [];
  const syntheticComponents = Array.isArray(r["syntheticComponents"])
    ? (r["syntheticComponents"] as string[])
    : [];
  const forbiddenComponents = Array.isArray(r["forbiddenComponents"])
    ? (r["forbiddenComponents"] as string[])
    : [];
  const expectedBehaviors = Array.isArray(r["expectedBehaviors"])
    ? (r["expectedBehaviors"] as string[])
    : [];
  const requirements = Array.isArray(r["requirements"])
    ? (r["requirements"] as string[])
    : [];
  const blockers = Array.isArray(r["blockers"])
    ? (r["blockers"] as string[])
    : [];
  const checklist = Array.isArray(r["checklistConfirmed"])
    ? (r["checklistConfirmed"] as string[])
    : [];

  for (const s of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SCOPES) {
    if (!scopes.includes(s)) {
      rejectionReasons.push("missing_scope");
      break;
    }
  }
  for (const rc of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_RISK_CLASSES) {
    if (!riskClasses.includes(rc)) {
      rejectionReasons.push("missing_risk_class");
      break;
    }
  }
  for (const sc of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SYNTHETIC_COMPONENTS) {
    if (!syntheticComponents.includes(sc)) {
      rejectionReasons.push("missing_synthetic_component");
      break;
    }
  }
  for (const fc of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_FORBIDDEN_COMPONENTS) {
    if (!forbiddenComponents.includes(fc)) {
      rejectionReasons.push("missing_forbidden_component");
      break;
    }
  }
  for (const eb of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_EXPECTED_BEHAVIORS) {
    if (!expectedBehaviors.includes(eb)) {
      rejectionReasons.push("missing_expected_behavior");
      break;
    }
  }
  for (const req of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_REQUIREMENTS) {
    if (!requirements.includes(req)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }
  for (const bl of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_BLOCKERS) {
    if (!blockers.includes(bl)) {
      rejectionReasons.push("missing_blocker");
      break;
    }
  }
  for (const cl of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_CHECKLIST) {
    if (!checklist.includes(cl)) {
      rejectionReasons.push("missing_checklist_item");
      break;
    }
  }

  // 9–12. Core execution-plan literals (must be true)
  if (r["executionPlanOnly"] !== true)
    rejectionReasons.push("execution_plan_attempted_live_call");
  if (r["highRiskSyntheticCase"] !== true)
    rejectionReasons.push("missing_requirement");
  if (r["legalDeadlineCase"] !== true)
    rejectionReasons.push("missing_requirement");
  if (r["deliveryDateRequiredForExactDeadline"] !== true)
    rejectionReasons.push("exact_deadline_authorized_without_delivery_date");

  // 13–18. Future gate literals (must be true)
  if (r["futureDryRunAuthorizationRequired"] !== true)
    rejectionReasons.push("dry_run_authorization_missing");
  if (r["oneFutureLiveLlmCallOnly"] !== true)
    rejectionReasons.push("future_call_limit_missing");
  if (r["killSwitchRequiredForFutureCall"] !== true)
    rejectionReasons.push("kill_switch_missing");
  if (r["singleCallCounterRequiredForFutureCall"] !== true)
    rejectionReasons.push("single_call_counter_missing");
  if (r["futureGovernanceRecheckRequired"] !== true)
    rejectionReasons.push("future_governance_recheck_missing");
  if (r["futurePostCallAuditRequired"] !== true)
    rejectionReasons.push("future_post_call_audit_missing");

  // 19–23. Legal safety literals (must be false)
  if (r["exactDeadlineCalculationAuthorized"] !== false)
    rejectionReasons.push("exact_deadline_authorized_without_delivery_date");
  if (r["deliveryDateInventionAuthorized"] !== false)
    rejectionReasons.push("delivery_date_invention_authorized");
  if (r["finalDateInventionAuthorized"] !== false)
    rejectionReasons.push("final_date_invention_authorized");
  if (r["legalCertaintyAuthorized"] !== false)
    rejectionReasons.push("legal_certainty_authorized");
  if (r["coerciveLegalInstructionAuthorized"] !== false)
    rejectionReasons.push("coercive_legal_instruction_authorized");

  // 24–27. No live-call literals (must be false)
  if (r["liveLLMCalledInExecutionPlan"] !== false)
    rejectionReasons.push("execution_plan_attempted_live_call");
  if (r["directOpenAiCallMadeByExecutionPlan"] !== false)
    rejectionReasons.push("direct_openai_call_attempted");
  if (r["promptTextFinalizedForCall"] !== false)
    rejectionReasons.push("prompt_finalized_for_call");
  if (r["modelOutputAvailableInExecutionPlan"] !== false)
    rejectionReasons.push("model_output_available");

  // 28. Readiness / accepted flags (must be true)
  if (r["readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization"] !== true)
    rejectionReasons.push("dry_run_authorization_missing");
  if (r["highRiskSyntheticLegalDeadlineExecutionPlanAccepted"] !== true)
    rejectionReasons.push("missing_requirement");

  // 29. Dangerous readiness flags (all must be false)
  const dangerousReadiness = [
    "readyForLiveLLMRuntime",
    "readyForConnectedAiRuntimeExecution",
    "readyForRealOperatorPilotRun",
    "readyForPilotRunNow",
    "readyForPublicLaunch",
    "readyForPersistence",
    "readyForRealDocumentInput",
    "readyForUserVisibleOutput",
  ] as const;
  for (const flag of dangerousReadiness) {
    if (r[flag] !== false) {
      rejectionReasons.push("general_live_llm_runtime_authorized");
      break;
    }
  }

  // 30. syntheticInputOnly
  if (r["syntheticInputOnly"] !== true)
    rejectionReasons.push("real_input_detected");

  // 31. Input isolation flags (all must be false)
  const inputIsolationFlags = [
    ["realUserInputAllowed", "real_input_detected"],
    ["rawInputAllowed", "raw_input_detected"],
    ["realRedactedInputAllowed", "redacted_real_input_detected"],
    ["photoOrOcrInputAllowed", "ocr_photo_file_input_detected"],
    ["fileUploadInputAllowed", "ocr_photo_file_input_detected"],
    ["publicAnonymousInputAllowed", "public_request_detected"],
    ["realDocumentInputAllowed", "real_document_input_authorized"],
  ] as const;
  for (const [flag, reason] of inputIsolationFlags) {
    if (r[flag] !== false) {
      rejectionReasons.push(reason);
    }
  }

  // 32. Runtime isolation flags (all must be false)
  const runtimeIsolationFlags = [
    ["branchCDependencyAllowed", "branch_c_dependency_detected"],
    ["runSmartTalkDependencyAllowed", "run_smart_talk_dependency_detected"],
    ["ocrRuntimeDependencyAllowed", "ocr_runtime_dependency_detected"],
    ["branchCCalled", "branch_c_dependency_detected"],
    ["runSmartTalkCalledOrImported", "run_smart_talk_dependency_detected"],
    ["extractTextFromImageCalledOrImported", "ocr_runtime_dependency_detected"],
  ] as const;
  for (const [flag, reason] of runtimeIsolationFlags) {
    if (r[flag] !== false) {
      rejectionReasons.push(reason);
    }
  }

  // 33. userVisibleOutputEmitted
  if (r["userVisibleOutputEmitted"] !== false)
    rejectionReasons.push("user_visible_output_detected");

  // 34. Persistence/public/pilot flags (all must be false)
  const persistenceFlags = [
    ["persistenceUsed", "persistence_detected"],
    ["dnaSavePerformed", "persistence_detected"],
    ["offlineSavePerformed", "persistence_detected"],
    ["publicRuntimeEnabled", "public_runtime_detected"],
    ["realOperatorPilotExecuted", "general_live_llm_runtime_authorized"],
  ] as const;
  for (const [flag, reason] of persistenceFlags) {
    if (r[flag] !== false) {
      rejectionReasons.push(reason);
    }
  }

  // 35–36. Debt tracking
  if (r["broadEslintDebtTracked"] !== true)
    rejectionReasons.push("technical_debt_not_tracked");
  if (r["postCallCachedMetadataDebtTracked"] !== true)
    rejectionReasons.push("technical_debt_not_tracked");

  // 37. Debt notes content
  const debtNotes = Array.isArray(r["technicalDebtNotes"])
    ? (r["technicalDebtNotes"] as unknown[])
    : [];
  const debtStrings = debtNotes.map((n) => String(n));
  for (const required of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_DEBT_NOTES) {
    if (!debtStrings.some((d) => d.includes(required.substring(0, 40)))) {
      rejectionReasons.push("technical_debt_not_tracked");
      break;
    }
  }

  // 38. Acknowledgments — each field must contain all required statements
  const opAck =
    typeof r["operatorHighRiskExecutionPlanAcknowledgment"] === "string"
      ? (r["operatorHighRiskExecutionPlanAcknowledgment"] as string)
      : "";
  const revAck =
    typeof r["reviewerHighRiskExecutionPlanAcknowledgment"] === "string"
      ? (r["reviewerHighRiskExecutionPlanAcknowledgment"] as string)
      : "";
  for (const stmt of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS) {
    if (!opAck.includes(stmt)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }
  for (const stmt of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS) {
    if (!revAck.includes(stmt)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }

  // 39. contains* flags (all must be false)
  const containsFlags = [
    "containsRealUserInput",
    "containsRawInputText",
    "containsRedactedText",
    "containsFullDraftText",
    "containsModelOutput",
    "containsSecret",
    "containsEnvValue",
    "containsApiKey",
    "containsUserPii",
    "containsDocumentContent",
  ] as const;
  for (const flag of containsFlags) {
    if (r[flag] !== false) {
      rejectionReasons.push("forbidden_document_content_detected");
      break;
    }
  }

  // 40–41. String safety across all text fields
  const textFields = [
    ...debtStrings,
    opAck,
    revAck,
    ...(Array.isArray(r["notes"]) ? (r["notes"] as unknown[]).map(String) : []),
  ];
  for (const text of textFields) {
    if (containsForbiddenString(text)) {
      rejectionReasons.push("unsafe_execution_plan_note_detected");
      break;
    }
    if (containsPiiPattern(text)) {
      rejectionReasons.push("forbidden_pii_detected");
      break;
    }
    if (containsSecretLike(text)) {
      rejectionReasons.push("forbidden_secret_detected");
      break;
    }
    if (containsUnsafeMarker(text)) {
      rejectionReasons.push("unsafe_execution_plan_note_detected");
      break;
    }
  }

  if (rejectionReasons.length > 0) {
    return buildResult(
      input,
      "rejected",
      rejectionReasons as HighRiskSyntheticLegalDeadlineExecutionPlanResult["rejectionReasons"][number][],
      false
    );
  }

  return buildResult(input, "accepted", [], true);
}

function buildResult(
  input: HighRiskSyntheticLegalDeadlineExecutionPlanInput,
  status: HighRiskSyntheticLegalDeadlineExecutionPlanResult["status"],
  rejectionReasons: HighRiskSyntheticLegalDeadlineExecutionPlanResult["rejectionReasons"][number][],
  accepted: boolean
): HighRiskSyntheticLegalDeadlineExecutionPlanResult {
  return {
    executionPlanId: input.executionPlanId,
    epochId: "8.3AA",
    status,
    accepted,
    rejectionReasons,

    safeExecutionPlanMetadata: {
      selectedCase: "synthetic_high_risk_widerspruch_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      apiModel: "gpt-4o-mini",
      sourceKind: "synthetic_high_risk_legal_deadline_never_user_visible",
      scopeCount: input.scopes.length,
      riskClassCount: input.riskClasses.length,
      syntheticComponentCount: input.syntheticComponents.length,
      forbiddenComponentCount: input.forbiddenComponents.length,
      expectedBehaviorCount: input.expectedBehaviors.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      executionPlanOnly: true,
      highRiskSyntheticCase: true,
      legalDeadlineCase: true,
      deliveryDateRequiredForExactDeadline: true,
      exactDeadlineCalculationAuthorized: false,
      deliveryDateInventionAuthorized: false,
      finalDateInventionAuthorized: false,
      legalCertaintyAuthorized: false,
      coerciveLegalInstructionAuthorized: false,
      broadEslintDebtTracked: true,
      postCallCachedMetadataDebtTracked: true,
    },

    readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: accepted,
    highRiskSyntheticLegalDeadlineExecutionPlanAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    executionPlanOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,
    futureGovernanceRecheckRequired: true,
    futurePostCallAuditRequired: true,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInExecutionPlan: false,
    directOpenAiCallMadeByExecutionPlan: false,
    promptTextFinalizedForCall: false,
    modelOutputAvailableInExecutionPlan: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    apiRouteModifiedByExecutionPlan: false,
    existingRuntimeModifiedByExecutionPlan: false,
    uiTouched: false,
    databaseOrStorageModifiedByExecutionPlan: false,

    neverUserVisible: true,
  };
}

// ── Tamper helper ─────────────────────────────────────────────────────────────

function withOverride(
  base: HighRiskSyntheticLegalDeadlineExecutionPlanInput,
  overrides: Record<string, unknown>
): HighRiskSyntheticLegalDeadlineExecutionPlanInput {
  return {
    ...base,
    ...overrides,
  } as HighRiskSyntheticLegalDeadlineExecutionPlanInput;
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function runHighRiskSyntheticLegalDeadlineExecutionPlan(): Promise<HighRiskSyntheticLegalDeadlineExecutionPlanCheckResult> {
  // ── Step 1: Verify 8.3Z contract dependency ───────────────────────────────
  const contract = await runHighRiskSyntheticLegalDeadlineContract();

  const prereqPassed =
    contract.allPassed === true &&
    contract.planningReadyForContract === true &&
    contract.highRiskSyntheticLegalDeadlineContractAccepted === true &&
    contract.readyForHighRiskSyntheticLegalDeadlineExecutionPlan === true &&
    contract.readyForLiveLLMRuntime === false &&
    contract.readyForConnectedAiRuntimeExecution === false &&
    contract.readyForRealOperatorPilotRun === false &&
    contract.readyForPilotRunNow === false &&
    contract.readyForPublicLaunch === false &&
    contract.readyForPersistence === false &&
    contract.readyForRealDocumentInput === false &&
    contract.readyForUserVisibleOutput === false &&
    contract.contractOnly === true &&
    contract.highRiskSyntheticCase === true &&
    contract.legalDeadlineCase === true &&
    contract.deliveryDateRequiredForExactDeadline === true &&
    contract.futureExecutionPlanRequired === true &&
    contract.futureDryRunAuthorizationRequired === true &&
    contract.oneFutureLiveLlmCallOnly === true &&
    contract.killSwitchRequiredForFutureCall === true &&
    contract.singleCallCounterRequiredForFutureCall === true &&
    contract.futureGovernanceRecheckRequired === true &&
    contract.futurePostCallAuditRequired === true &&
    contract.exactDeadlineCalculationAuthorized === false &&
    contract.deliveryDateInventionAuthorized === false &&
    contract.finalDateInventionAuthorized === false &&
    contract.legalCertaintyAuthorized === false &&
    contract.coerciveLegalInstructionAuthorized === false &&
    contract.liveLLMCalledInContract === false &&
    contract.directOpenAiCallMadeByContract === false &&
    contract.promptTextConstructedNow === false &&
    contract.modelOutputAvailableInContract === false &&
    contract.syntheticInputOnly === true &&
    contract.realUserInputAllowed === false &&
    contract.rawInputAllowed === false &&
    contract.realRedactedInputAllowed === false &&
    contract.photoOrOcrInputAllowed === false &&
    contract.fileUploadInputAllowed === false &&
    contract.publicAnonymousInputAllowed === false &&
    contract.realDocumentInputAllowed === false &&
    contract.branchCDependencyAllowed === false &&
    contract.runSmartTalkDependencyAllowed === false &&
    contract.ocrRuntimeDependencyAllowed === false &&
    contract.branchCCalled === false &&
    contract.runSmartTalkCalledOrImported === false &&
    contract.extractTextFromImageCalledOrImported === false &&
    contract.userVisibleOutputEmitted === false &&
    contract.persistenceUsed === false &&
    contract.publicRuntimeEnabled === false &&
    contract.broadEslintDebtTracked === true &&
    contract.postCallCachedMetadataDebtTracked === true &&
    contract.neverUserVisible === true;

  // ── Step 2: Build canonical input ────────────────────────────────────────
  const canonicalInput = buildHighRiskSyntheticLegalDeadlineExecutionPlanInput({
    contractReady: prereqPassed,
    contractAllPassed: prereqPassed,
  });

  const canonicalResult =
    validateHighRiskSyntheticLegalDeadlineExecutionPlanInput(canonicalInput);

  // ── Step 3: Tamper tests (local validator only, no live LLM calls) ────────
  const tamperCases: Array<{
    label: string;
    override: Record<string, unknown>;
  }> = [
    // Contract prerequisite state
    { label: "contractReady false", override: { contractReadyForExecutionPlan: false } },
    { label: "contractAllPassed false", override: { contractAllPassed: false } },
    // Identity fields
    { label: "wrong selectedCase", override: { selectedCase: "synthetic_explicit_payment_deadline" } },
    { label: "wrong provider", override: { provider: "anthropic" } },
    { label: "wrong model", override: { model: "gpt_3_5_turbo" } },
    { label: "wrong apiModel", override: { apiModel: "gpt-3.5-turbo" } },
    { label: "wrong sourceKind", override: { sourceKind: "real_document_source" } },
    // Array emptiness
    { label: "missing scope", override: { scopes: [] } },
    { label: "missing riskClass", override: { riskClasses: [] } },
    { label: "missing syntheticComponent", override: { syntheticComponents: [] } },
    { label: "missing forbiddenComponent", override: { forbiddenComponents: [] } },
    { label: "missing expectedBehavior", override: { expectedBehaviors: [] } },
    { label: "missing requirement", override: { requirements: [] } },
    { label: "missing blocker", override: { blockers: [] } },
    { label: "missing checklist", override: { checklistConfirmed: [] } },
    // Core literals
    { label: "executionPlanOnly false", override: { executionPlanOnly: false } },
    { label: "highRiskSyntheticCase false", override: { highRiskSyntheticCase: false } },
    { label: "legalDeadlineCase false", override: { legalDeadlineCase: false } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    // Future gate literals
    { label: "futureDryRunAuthorizationRequired false", override: { futureDryRunAuthorizationRequired: false } },
    { label: "oneFutureLiveLlmCallOnly false", override: { oneFutureLiveLlmCallOnly: false } },
    { label: "killSwitchRequiredForFutureCall false", override: { killSwitchRequiredForFutureCall: false } },
    { label: "singleCallCounterRequiredForFutureCall false", override: { singleCallCounterRequiredForFutureCall: false } },
    { label: "futureGovernanceRecheckRequired false", override: { futureGovernanceRecheckRequired: false } },
    { label: "futurePostCallAuditRequired false", override: { futurePostCallAuditRequired: false } },
    // Legal safety (must NOT be true)
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    // No live-call literals
    { label: "liveLLMCalledInExecutionPlan true", override: { liveLLMCalledInExecutionPlan: true } },
    { label: "directOpenAiCallMadeByExecutionPlan true", override: { directOpenAiCallMadeByExecutionPlan: true } },
    { label: "promptTextFinalizedForCall true", override: { promptTextFinalizedForCall: true } },
    { label: "modelOutputAvailableInExecutionPlan true", override: { modelOutputAvailableInExecutionPlan: true } },
    // Readiness flags
    { label: "readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization false", override: { readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: false } },
    { label: "highRiskSyntheticLegalDeadlineExecutionPlanAccepted false", override: { highRiskSyntheticLegalDeadlineExecutionPlanAccepted: false } },
    // Dangerous readiness (each individually)
    { label: "readyForLiveLLMRuntime true", override: { readyForLiveLLMRuntime: true } },
    { label: "readyForConnectedAiRuntimeExecution true", override: { readyForConnectedAiRuntimeExecution: true } },
    { label: "readyForRealOperatorPilotRun true", override: { readyForRealOperatorPilotRun: true } },
    { label: "readyForPilotRunNow true", override: { readyForPilotRunNow: true } },
    { label: "readyForPublicLaunch true", override: { readyForPublicLaunch: true } },
    { label: "readyForPersistence true", override: { readyForPersistence: true } },
    { label: "readyForRealDocumentInput true", override: { readyForRealDocumentInput: true } },
    { label: "readyForUserVisibleOutput true", override: { readyForUserVisibleOutput: true } },
    // Input isolation (each individually)
    { label: "syntheticInputOnly false", override: { syntheticInputOnly: false } },
    { label: "realUserInputAllowed true", override: { realUserInputAllowed: true } },
    { label: "rawInputAllowed true", override: { rawInputAllowed: true } },
    { label: "realRedactedInputAllowed true", override: { realRedactedInputAllowed: true } },
    { label: "photoOrOcrInputAllowed true", override: { photoOrOcrInputAllowed: true } },
    { label: "fileUploadInputAllowed true", override: { fileUploadInputAllowed: true } },
    { label: "publicAnonymousInputAllowed true", override: { publicAnonymousInputAllowed: true } },
    { label: "realDocumentInputAllowed true", override: { realDocumentInputAllowed: true } },
    // Runtime isolation (each individually)
    { label: "branchCDependencyAllowed true", override: { branchCDependencyAllowed: true } },
    { label: "runSmartTalkDependencyAllowed true", override: { runSmartTalkDependencyAllowed: true } },
    { label: "ocrRuntimeDependencyAllowed true", override: { ocrRuntimeDependencyAllowed: true } },
    { label: "branchCCalled true", override: { branchCCalled: true } },
    { label: "runSmartTalkCalledOrImported true", override: { runSmartTalkCalledOrImported: true } },
    { label: "extractTextFromImageCalledOrImported true", override: { extractTextFromImageCalledOrImported: true } },
    // Persistence / output
    { label: "userVisibleOutputEmitted true", override: { userVisibleOutputEmitted: true } },
    { label: "persistenceUsed true", override: { persistenceUsed: true } },
    { label: "dnaSavePerformed true", override: { dnaSavePerformed: true } },
    { label: "offlineSavePerformed true", override: { offlineSavePerformed: true } },
    { label: "publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
    { label: "realOperatorPilotExecuted true", override: { realOperatorPilotExecuted: true } },
    // Debt tracking
    { label: "broadEslintDebtTracked false", override: { broadEslintDebtTracked: false } },
    { label: "postCallCachedMetadataDebtTracked false", override: { postCallCachedMetadataDebtTracked: false } },
    { label: "technicalDebtNotes missing broad ESLint note", override: { technicalDebtNotes: ["Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration."] } },
    { label: "technicalDebtNotes missing cached metadata note", override: { technicalDebtNotes: ["Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts."] } },
    // Acknowledgments
    { label: "missing operator acknowledgment", override: { operatorHighRiskExecutionPlanAcknowledgment: "" } },
    { label: "missing reviewer acknowledgment", override: { reviewerHighRiskExecutionPlanAcknowledgment: "" } },
    // contains* flags
    { label: "containsRealUserInput true", override: { containsRealUserInput: true } },
    { label: "containsRawInputText true", override: { containsRawInputText: true } },
    { label: "containsRedactedText true", override: { containsRedactedText: true } },
    { label: "containsFullDraftText true", override: { containsFullDraftText: true } },
    { label: "containsModelOutput true", override: { containsModelOutput: true } },
    { label: "containsSecret true", override: { containsSecret: true } },
    { label: "containsEnvValue true", override: { containsEnvValue: true } },
    { label: "containsApiKey true", override: { containsApiKey: true } },
    { label: "containsUserPii true", override: { containsUserPii: true } },
    { label: "containsDocumentContent true", override: { containsDocumentContent: true } },
    // Forbidden string injection
    { label: "notes include forbidden string (exact Widerspruch deadline calculated)", override: { notes: ["exact Widerspruch deadline calculated"] } },
    { label: "notes include OPENAI_API_KEY=", override: { notes: ["OPENAI_API_KEY=sk-test123"] } },
    { label: "notes include sk-", override: { notes: ["sk-abc123verylongsecretkey"] } },
    { label: "notes include Sehr geehrte", override: { notes: ["Sehr geehrte Frau Mustermann"] } },
    { label: "notes include IBAN", override: { notes: ["IBAN DE89370400440532013000"] } },
    { label: "notes include Telefon", override: { notes: ["Telefon: +49 123 4567890"] } },
    { label: "notes include Rechtsbehelfsbelehrung vollständig geprüft", override: { notes: ["Rechtsbehelfsbelehrung vollständig geprüft"] } },
    { label: "notes include genauer Fristablauf berechnet", override: { notes: ["genauer Fristablauf berechnet"] } },
    { label: "notes include delivery date inferred", override: { notes: ["delivery date inferred from document"] } },
    { label: "notes include final Widerspruch date inferred", override: { notes: ["final Widerspruch date inferred"] } },
    { label: "notes include execution prompt sent", override: { notes: ["execution prompt sent to openai"] } },
    { label: "notes include live legal deadline call executed", override: { notes: ["live legal deadline call executed"] } },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered = withOverride(canonicalInput, tc.override);
    const result = validateHighRiskSyntheticLegalDeadlineExecutionPlanInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${tc.label}`);
    }
  }

  // ── Step 4: Aggregate result ──────────────────────────────────────────────
  const allPassed =
    prereqPassed &&
    canonicalResult.accepted &&
    allTamperRejected &&
    tamperFailures.length === 0;

  const notes: string[] = [
    `8.3Z contract dependency: allPassed=${contract.allPassed}`,
    `prerequisite check: ${prereqPassed ? "passed" : "FAILED"}`,
    `canonical execution plan validation: ${canonicalResult.status}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push(
      "PHASE 8.3AA allPassed: true — high-risk synthetic legal deadline execution plan accepted"
    );
    notes.push(
      "readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: true"
    );
    notes.push(
      "dry-run authorization is required before any future live call"
    );
    notes.push(
      "exact deadline calculation remains blocked without delivery or Bekanntgabe date"
    );
    notes.push(
      "no live LLM call, no fetch, no process.env, no SDK, no Branch C in this phase"
    );
  }

  return {
    checkId: "8.3AA",
    allPassed,
    contractReadyForExecutionPlan: prereqPassed,
    highRiskSyntheticLegalDeadlineExecutionPlanAccepted: allPassed,
    tamperCasesRejected: allTamperRejected,

    readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    executionPlanOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,
    futureGovernanceRecheckRequired: true,
    futurePostCallAuditRequired: true,

    exactDeadlineCalculationAuthorized: false,
    deliveryDateInventionAuthorized: false,
    finalDateInventionAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInExecutionPlan: false,
    directOpenAiCallMadeByExecutionPlan: false,
    promptTextFinalizedForCall: false,
    modelOutputAvailableInExecutionPlan: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    neverUserVisible: true,

    notes,
  };
}
