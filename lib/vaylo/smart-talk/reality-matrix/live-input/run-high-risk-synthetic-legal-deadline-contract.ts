/**
 * Phase 8.3Z — High-Risk Synthetic Legal Deadline Contract.
 *
 * CONTRACT ONLY. This file does NOT:
 *   - Call OpenAI or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Construct the final API prompt text
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

import { runHighRiskSyntheticLegalDeadlinePlanning } from "./run-high-risk-synthetic-legal-deadline-planning";
import {
  FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_STRINGS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_BLOCKERS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_CHECKLIST,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_DEBT_NOTES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_EXPECTED_BEHAVIORS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_PROMPT_POLICIES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_REQUIREMENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_RISK_CLASSES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_SCOPES,
} from "./high-risk-synthetic-legal-deadline-contract-types";
import type {
  HighRiskSyntheticLegalDeadlineContractCheckResult,
  HighRiskSyntheticLegalDeadlineContractInput,
  HighRiskSyntheticLegalDeadlineContractResult,
} from "./high-risk-synthetic-legal-deadline-contract-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  for (const forbidden of FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_STRINGS) {
    if (lower.includes(forbidden.toLowerCase())) return true;
  }
  return false;
}

function containsPiiPattern(text: string): boolean {
  if (/\bsk-[A-Za-z0-9]{10,}\b/.test(text)) return true;
  if (/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(text)) return true;
  if (/\+\d{10,}/.test(text)) return true;
  if (/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/.test(text)) return true;
  // German formal salutation → real-person content signal (8.3Z-PATCH)
  if (/\bSehr\s+geehrte/i.test(text)) return true;
  // Telephone label → real contact-data signal (8.3Z-PATCH, aligns with 8.3Y)
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
 * Checks text for unsafe markers. Deliberately avoids matching legitimate
 * governance-statement phrases that appear in required acknowledgments, notes,
 * or debt notes for this phase.
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
  ];
  for (const marker of unsafeMarkers) {
    if (lower.includes(marker)) return true;
  }
  return false;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildHighRiskSyntheticLegalDeadlineContractInput(params?: {
  readonly planningReady?: boolean;
  readonly planningAllPassed?: boolean;
}): HighRiskSyntheticLegalDeadlineContractInput {
  const planningReadyForContract = params?.planningReady ?? true;
  const planningAllPassed = params?.planningAllPassed ?? true;
  const accepted = planningReadyForContract && planningAllPassed;

  const allAcks =
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_ACKNOWLEDGMENT_STATEMENTS.join(
      " | "
    );

  return {
    contractId: "high-risk-synthetic-legal-deadline-contract-8-3z",
    epochId: "8.3Z",
    previousPhaseId: "8.3Y",

    planningReadyForContract,
    planningAllPassed,

    selectedCase: "synthetic_high_risk_widerspruch_deadline",
    provider: "openai",
    model: "gpt_4o_mini",

    scopes: [...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_SCOPES],
    riskClasses: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_RISK_CLASSES,
    ],
    promptPolicies: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_PROMPT_POLICIES,
    ],
    expectedBehaviors: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_EXPECTED_BEHAVIORS,
    ],
    requirements: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_REQUIREMENTS,
    ],
    blockers: [...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_BLOCKERS],
    checklistConfirmed: [
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_CHECKLIST,
    ],

    contractOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureExecutionPlanRequired: true,
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

    liveLLMCalledInContract: false,
    directOpenAiCallMadeByContract: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInContract: false,

    readyForHighRiskSyntheticLegalDeadlineExecutionPlan: accepted,
    highRiskSyntheticLegalDeadlineContractAccepted: accepted,

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
      ...REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_DEBT_NOTES,
    ],

    operatorHighRiskContractAcknowledgment: allAcks,
    reviewerHighRiskContractAcknowledgment: allAcks,

    notes: [
      "high-risk synthetic Widerspruch deadline contract completed without live call",
      "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
      "ready for high-risk synthetic legal deadline execution plan only",
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

export function validateHighRiskSyntheticLegalDeadlineContractInput(
  input: HighRiskSyntheticLegalDeadlineContractInput
): HighRiskSyntheticLegalDeadlineContractResult {
  const r = asRec(input);
  const rejectionReasons: HighRiskSyntheticLegalDeadlineContractResult["rejectionReasons"][number][] =
    [];

  // 1. Planning readiness
  if (r["planningReadyForContract"] !== true) {
    return buildResult(input, "blocked", ["planning_not_ready"], false);
  }
  // 2. Planning passed
  if (r["planningAllPassed"] !== true) {
    return buildResult(input, "blocked", ["planning_not_passed"], false);
  }

  // 3–5. Case / provider / model
  if (r["selectedCase"] !== "synthetic_high_risk_widerspruch_deadline") {
    rejectionReasons.push("selected_case_invalid");
  }
  if (r["provider"] !== "openai") {
    rejectionReasons.push("provider_invalid");
  }
  if (r["model"] !== "gpt_4o_mini") {
    rejectionReasons.push("model_invalid");
  }

  // 6. Arrays
  const scopes = Array.isArray(r["scopes"]) ? (r["scopes"] as string[]) : [];
  const riskClasses = Array.isArray(r["riskClasses"])
    ? (r["riskClasses"] as string[])
    : [];
  const promptPolicies = Array.isArray(r["promptPolicies"])
    ? (r["promptPolicies"] as string[])
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

  for (const s of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_SCOPES) {
    if (!scopes.includes(s)) {
      rejectionReasons.push("missing_scope");
      break;
    }
  }
  for (const rc of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_RISK_CLASSES) {
    if (!riskClasses.includes(rc)) {
      rejectionReasons.push("missing_risk_class");
      break;
    }
  }
  for (const pp of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_PROMPT_POLICIES) {
    if (!promptPolicies.includes(pp)) {
      rejectionReasons.push("missing_prompt_policy");
      break;
    }
  }
  for (const eb of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_EXPECTED_BEHAVIORS) {
    if (!expectedBehaviors.includes(eb)) {
      rejectionReasons.push("missing_expected_behavior");
      break;
    }
  }
  for (const req of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_REQUIREMENTS) {
    if (!requirements.includes(req)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }
  for (const bl of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_BLOCKERS) {
    if (!blockers.includes(bl)) {
      rejectionReasons.push("missing_blocker");
      break;
    }
  }
  for (const cl of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_CHECKLIST) {
    if (!checklist.includes(cl)) {
      rejectionReasons.push("missing_checklist_item");
      break;
    }
  }

  // 7–10. Mandatory true literals
  if (r["contractOnly"] !== true) rejectionReasons.push("contract_attempted_live_call");
  if (r["highRiskSyntheticCase"] !== true) rejectionReasons.push("missing_requirement");
  if (r["legalDeadlineCase"] !== true) rejectionReasons.push("missing_requirement");
  if (r["deliveryDateRequiredForExactDeadline"] !== true)
    rejectionReasons.push("exact_deadline_authorized_without_delivery_date");

  // 11–17. Future plan literals (true required)
  if (r["futureExecutionPlanRequired"] !== true)
    rejectionReasons.push("future_execution_plan_missing");
  if (r["futureDryRunAuthorizationRequired"] !== true)
    rejectionReasons.push("future_dry_run_authorization_missing");
  if (r["oneFutureLiveLlmCallOnly"] !== true)
    rejectionReasons.push("future_call_limit_missing");
  if (r["killSwitchRequiredForFutureCall"] !== true)
    rejectionReasons.push("future_kill_switch_missing");
  if (r["singleCallCounterRequiredForFutureCall"] !== true)
    rejectionReasons.push("future_single_call_counter_missing");
  if (r["futureGovernanceRecheckRequired"] !== true)
    rejectionReasons.push("missing_requirement");
  if (r["futurePostCallAuditRequired"] !== true)
    rejectionReasons.push("missing_requirement");

  // 18–22. Legal safety literals (must be false)
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

  // 23–26. No live-call literals (must be false)
  if (r["liveLLMCalledInContract"] !== false)
    rejectionReasons.push("contract_attempted_live_call");
  if (r["directOpenAiCallMadeByContract"] !== false)
    rejectionReasons.push("direct_openai_call_attempted");
  if (r["promptTextConstructedNow"] !== false)
    rejectionReasons.push("prompt_text_constructed_now");
  if (r["modelOutputAvailableInContract"] !== false)
    rejectionReasons.push("model_output_available");

  // 27. Readiness flags
  if (r["readyForHighRiskSyntheticLegalDeadlineExecutionPlan"] !== true)
    rejectionReasons.push("future_execution_plan_missing");
  if (r["highRiskSyntheticLegalDeadlineContractAccepted"] !== true)
    rejectionReasons.push("missing_requirement");

  // 28. Dangerous readiness (all must be false)
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

  // 29. syntheticInputOnly
  if (r["syntheticInputOnly"] !== true) rejectionReasons.push("real_input_detected");

  // 30. Real/raw/redacted/OCR/file/public/document flags (all must be false)
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

  // 31. Branch C / OCR flags (all must be false)
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

  // 32. userVisibleOutputEmitted
  if (r["userVisibleOutputEmitted"] !== false)
    rejectionReasons.push("user_visible_output_detected");

  // 33. Persistence / public / pilot flags (all must be false)
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

  // 34–35. Debt tracking
  if (r["broadEslintDebtTracked"] !== true)
    rejectionReasons.push("technical_debt_not_tracked");
  if (r["postCallCachedMetadataDebtTracked"] !== true)
    rejectionReasons.push("technical_debt_not_tracked");

  // 36. Debt notes content
  const debtNotes = Array.isArray(r["technicalDebtNotes"])
    ? (r["technicalDebtNotes"] as unknown[])
    : [];
  const debtStrings = debtNotes.map((n) => String(n));
  for (const required of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_DEBT_NOTES) {
    if (!debtStrings.some((d) => d.includes(required.substring(0, 40)))) {
      rejectionReasons.push("technical_debt_not_tracked");
      break;
    }
  }

  // 37. Acknowledgments
  const opAck = typeof r["operatorHighRiskContractAcknowledgment"] === "string"
    ? (r["operatorHighRiskContractAcknowledgment"] as string)
    : "";
  const revAck = typeof r["reviewerHighRiskContractAcknowledgment"] === "string"
    ? (r["reviewerHighRiskContractAcknowledgment"] as string)
    : "";
  for (const stmt of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!opAck.includes(stmt)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }
  for (const stmt of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!revAck.includes(stmt)) {
      rejectionReasons.push("missing_requirement");
      break;
    }
  }

  // 38. contains* flags
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

  // 39–40. String safety checks across text fields
  const textFields = [
    ...debtStrings,
    opAck,
    revAck,
    ...(Array.isArray(r["notes"]) ? (r["notes"] as unknown[]).map(String) : []),
  ];
  for (const text of textFields) {
    if (containsForbiddenString(text)) {
      rejectionReasons.push("unsafe_contract_note_detected");
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
      rejectionReasons.push("unsafe_contract_note_detected");
      break;
    }
  }

  if (rejectionReasons.length > 0) {
    return buildResult(
      input,
      "rejected",
      rejectionReasons as HighRiskSyntheticLegalDeadlineContractResult["rejectionReasons"][number][],
      false
    );
  }

  return buildResult(input, "accepted", [], true);
}

function buildResult(
  input: HighRiskSyntheticLegalDeadlineContractInput,
  status: HighRiskSyntheticLegalDeadlineContractResult["status"],
  rejectionReasons: HighRiskSyntheticLegalDeadlineContractResult["rejectionReasons"][number][],
  accepted: boolean
): HighRiskSyntheticLegalDeadlineContractResult {
  return {
    contractId: input.contractId,
    epochId: "8.3Z",
    status,
    accepted,
    rejectionReasons,

    safeContractMetadata: {
      selectedCase: "synthetic_high_risk_widerspruch_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      scopeCount: input.scopes.length,
      riskClassCount: input.riskClasses.length,
      promptPolicyCount: input.promptPolicies.length,
      expectedBehaviorCount: input.expectedBehaviors.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      contractOnly: true,
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

    readyForHighRiskSyntheticLegalDeadlineExecutionPlan: accepted,
    highRiskSyntheticLegalDeadlineContractAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    contractOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureExecutionPlanRequired: true,
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

    liveLLMCalledInContract: false,
    directOpenAiCallMadeByContract: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInContract: false,

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

    apiRouteModifiedByContract: false,
    existingRuntimeModifiedByContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByContract: false,

    neverUserVisible: true,
  };
}

// ── Tamper helpers ────────────────────────────────────────────────────────────

function withOverride(
  base: HighRiskSyntheticLegalDeadlineContractInput,
  overrides: Record<string, unknown>
): HighRiskSyntheticLegalDeadlineContractInput {
  return { ...base, ...overrides } as HighRiskSyntheticLegalDeadlineContractInput;
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function runHighRiskSyntheticLegalDeadlineContract(): Promise<HighRiskSyntheticLegalDeadlineContractCheckResult> {
  // ── Step 1: Verify 8.3Y planning dependency ──────────────────────────────
  const planning = await runHighRiskSyntheticLegalDeadlinePlanning();

  const prereqPassed =
    planning.allPassed === true &&
    planning.previousAuditReadyForHighRiskPlanning === true &&
    planning.highRiskSyntheticLegalDeadlinePlanningAccepted === true &&
    planning.readyForHighRiskSyntheticLegalDeadlineContract === true &&
    planning.readyForLiveLLMRuntime === false &&
    planning.readyForConnectedAiRuntimeExecution === false &&
    planning.readyForRealOperatorPilotRun === false &&
    planning.readyForPilotRunNow === false &&
    planning.readyForPublicLaunch === false &&
    planning.readyForPersistence === false &&
    planning.readyForRealDocumentInput === false &&
    planning.readyForUserVisibleOutput === false &&
    planning.planningOnly === true &&
    planning.highRiskSyntheticCase === true &&
    planning.legalDeadlineCase === true &&
    planning.deliveryDateRequiredForExactDeadline === true &&
    planning.exactDeadlineCalculationAuthorized === false &&
    planning.legalCertaintyAuthorized === false &&
    planning.coerciveLegalInstructionAuthorized === false &&
    planning.liveLLMCalledInPlanning === false &&
    planning.directOpenAiCallMadeByPlanning === false &&
    planning.promptTextConstructedNow === false &&
    planning.modelOutputAvailableInPlanning === false &&
    planning.syntheticInputOnly === true &&
    planning.realUserInputAllowed === false &&
    planning.rawInputAllowed === false &&
    planning.realRedactedInputAllowed === false &&
    planning.photoOrOcrInputAllowed === false &&
    planning.fileUploadInputAllowed === false &&
    planning.publicAnonymousInputAllowed === false &&
    planning.realDocumentInputAllowed === false &&
    planning.branchCDependencyAllowed === false &&
    planning.runSmartTalkDependencyAllowed === false &&
    planning.ocrRuntimeDependencyAllowed === false &&
    planning.branchCCalled === false &&
    planning.runSmartTalkCalledOrImported === false &&
    planning.extractTextFromImageCalledOrImported === false &&
    planning.userVisibleOutputEmitted === false &&
    planning.persistenceUsed === false &&
    planning.publicRuntimeEnabled === false &&
    planning.broadEslintDebtTracked === true &&
    planning.postCallCachedMetadataDebtTracked === true &&
    planning.neverUserVisible === true;

  // ── Step 2: Build canonical input ────────────────────────────────────────
  const canonicalInput = prereqPassed
    ? buildHighRiskSyntheticLegalDeadlineContractInput({
        planningReady: true,
        planningAllPassed: true,
      })
    : buildHighRiskSyntheticLegalDeadlineContractInput({
        planningReady: prereqPassed,
        planningAllPassed: prereqPassed,
      });

  const canonicalResult =
    validateHighRiskSyntheticLegalDeadlineContractInput(canonicalInput);

  // ── Step 3: Tamper tests (local validator only, no live LLM calls) ────────
  const tamperCases: Array<{ label: string; override: Record<string, unknown> }> = [
    // Planning state tampers
    { label: "planningReadyForContract false", override: { planningReadyForContract: false } },
    { label: "planningAllPassed false", override: { planningAllPassed: false } },
    // Identity tampers
    { label: "wrong selectedCase", override: { selectedCase: "synthetic_explicit_payment_deadline" } },
    { label: "wrong provider", override: { provider: "anthropic" } },
    { label: "wrong model", override: { model: "gpt_3_5_turbo" } },
    // Array tampers
    { label: "missing scope", override: { scopes: [] } },
    { label: "missing riskClass", override: { riskClasses: [] } },
    { label: "missing promptPolicy", override: { promptPolicies: [] } },
    { label: "missing expectedBehavior", override: { expectedBehaviors: [] } },
    { label: "missing requirement", override: { requirements: [] } },
    { label: "missing blocker", override: { blockers: [] } },
    { label: "missing checklist", override: { checklistConfirmed: [] } },
    // Core contract literals
    { label: "contractOnly false", override: { contractOnly: false } },
    { label: "highRiskSyntheticCase false", override: { highRiskSyntheticCase: false } },
    { label: "legalDeadlineCase false", override: { legalDeadlineCase: false } },
    { label: "deliveryDateRequiredForExactDeadline false", override: { deliveryDateRequiredForExactDeadline: false } },
    // Future plan literals
    { label: "futureExecutionPlanRequired false", override: { futureExecutionPlanRequired: false } },
    { label: "futureDryRunAuthorizationRequired false", override: { futureDryRunAuthorizationRequired: false } },
    { label: "oneFutureLiveLlmCallOnly false", override: { oneFutureLiveLlmCallOnly: false } },
    { label: "killSwitchRequiredForFutureCall false", override: { killSwitchRequiredForFutureCall: false } },
    { label: "singleCallCounterRequiredForFutureCall false", override: { singleCallCounterRequiredForFutureCall: false } },
    { label: "futureGovernanceRecheckRequired false", override: { futureGovernanceRecheckRequired: false } },
    { label: "futurePostCallAuditRequired false", override: { futurePostCallAuditRequired: false } },
    // Legal safety literals (must NOT be true)
    { label: "exactDeadlineCalculationAuthorized true", override: { exactDeadlineCalculationAuthorized: true } },
    { label: "deliveryDateInventionAuthorized true", override: { deliveryDateInventionAuthorized: true } },
    { label: "finalDateInventionAuthorized true", override: { finalDateInventionAuthorized: true } },
    { label: "legalCertaintyAuthorized true", override: { legalCertaintyAuthorized: true } },
    { label: "coerciveLegalInstructionAuthorized true", override: { coerciveLegalInstructionAuthorized: true } },
    // No live-call literals
    { label: "liveLLMCalledInContract true", override: { liveLLMCalledInContract: true } },
    { label: "directOpenAiCallMadeByContract true", override: { directOpenAiCallMadeByContract: true } },
    { label: "promptTextConstructedNow true", override: { promptTextConstructedNow: true } },
    { label: "modelOutputAvailableInContract true", override: { modelOutputAvailableInContract: true } },
    // Readiness flags
    { label: "readyForHighRiskSyntheticLegalDeadlineExecutionPlan false", override: { readyForHighRiskSyntheticLegalDeadlineExecutionPlan: false } },
    { label: "highRiskSyntheticLegalDeadlineContractAccepted false", override: { highRiskSyntheticLegalDeadlineContractAccepted: false } },
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
    // Missing acknowledgments
    { label: "missing operator acknowledgment", override: { operatorHighRiskContractAcknowledgment: "" } },
    { label: "missing reviewer acknowledgment", override: { reviewerHighRiskContractAcknowledgment: "" } },
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
    // Forbidden string injection in notes
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
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const tc of tamperCases) {
    const tampered = withOverride(canonicalInput, tc.override);
    const result = validateHighRiskSyntheticLegalDeadlineContractInput(tampered);
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
    `8.3Y planning dependency: allPassed=${planning.allPassed}`,
    `prerequisite check: ${prereqPassed ? "passed" : "FAILED"}`,
    `canonical contract validation: ${canonicalResult.status}`,
    `tamper cases: ${tamperCases.length} defined, all rejected: ${allTamperRejected}`,
    ...tamperFailures,
  ];

  if (allPassed) {
    notes.push("PHASE 8.3Z allPassed: true — high-risk synthetic legal deadline contract accepted");
    notes.push("readyForHighRiskSyntheticLegalDeadlineExecutionPlan: true");
    notes.push("exact deadline calculation remains blocked without delivery or Bekanntgabe date");
    notes.push("delivery-date invention, final-date invention, legal certainty, coercive instructions: all blocked");
    notes.push("no live LLM call, no fetch, no process.env, no SDK, no Branch C in this phase");
  }

  return {
    checkId: "8.3Z",
    allPassed,
    planningReadyForContract: prereqPassed,
    highRiskSyntheticLegalDeadlineContractAccepted: allPassed,
    tamperCasesRejected: allTamperRejected,

    readyForHighRiskSyntheticLegalDeadlineExecutionPlan: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    contractOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    futureExecutionPlanRequired: true,
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

    liveLLMCalledInContract: false,
    directOpenAiCallMadeByContract: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInContract: false,

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
