/**
 * AI-Connected Synthetic Test Harness Execution Plan Check (Phase 8.3H).
 *
 * Validates the AI-Connected Synthetic Test Harness Execution Plan input and
 * produces an `AiConnectedSyntheticHarnessExecutionPlanCheckResult`.
 *
 * Sub-steps:
 *   1. Call runAiConnectedSyntheticTestHarnessContractCheck() (8.3G) and
 *      verify all prerequisite invariants.
 *   2. Build a synthetic safe execution plan input and validate it (must be
 *      accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * ISOLATION NOTE:
 *   This module does NOT import, call, or wrap:
 *   - lib/vaylo/smart-talk/run-smart-talk.ts
 *   - lib/vaylo/smart-talk/extract-text-from-image.ts
 *   - app/api/smart-talk/route.ts
 *   - fetch() / any HTTP client
 *   - any live LLM SDK (OpenAI, Anthropic, Gemini, etc.)
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output or store model output
 * - emit user-visible output
 * - execute the synthetic test harness
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runAiConnectedSyntheticHarnessExecutionPlanCheck()` explicitly.
 */

import { runAiConnectedSyntheticTestHarnessContractCheck } from "./run-ai-connected-synthetic-test-harness-contract-check";
import {
  FORBIDDEN_SYNTHETIC_HARNESS_EXECUTION_PLAN_STRINGS,
  REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES,
  REQUIRED_SYNTHETIC_HARNESS_EXECUTION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS,
  REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES,
  REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST,
  REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS,
  REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS,
  REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES,
} from "./ai-connected-synthetic-test-harness-execution-plan-types";
import type {
  AiConnectedSyntheticHarnessExecutionPlanCheckResult,
  AiConnectedSyntheticHarnessExecutionPlanInput,
  AiConnectedSyntheticHarnessExecutionPlanRejectionReason,
  AiConnectedSyntheticHarnessExecutionPlanResult,
  SyntheticHarnessAdapterInterfacePolicy,
  SyntheticHarnessCaseId,
  SyntheticHarnessCaseRiskClass,
  SyntheticHarnessExecutionBlocker,
  SyntheticHarnessExecutionChecklistItem,
  SyntheticHarnessGovernanceStep,
  SyntheticHarnessMetadataOnlyObservation,
} from "./ai-connected-synthetic-test-harness-execution-plan-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SENSITIVE_PERSONAL_MARKERS = [
  "Name:",
  "Adresse:",
  "Geburtsdatum:",
  "Kind:",
];
const HIGH_RISK_LEGAL_MARKERS = ["Abschiebung", "Kündigung", "Mietvertrag"];
const AUTHORITY_DOCUMENT_MARKERS = [
  "Sehr geehrter",
  "Aktenzeichen",
  "IBAN",
  "Steuer-ID",
  "BG-Nr",
];
const UNSAFE_CERTAINTY_PHRASES = [
  "Sie müssen",
  "garantiert",
  "fristlos sicher",
  "rechtlich sicher",
];
const UNSAFE_GLOBAL_AUTH_PHRASES = [
  "public launch enabled",
  "all outputs authorized",
  "global approval",
  "branch c authorized",
  "approved for user display",
  "auto-approved",
  "show to user now",
];
const UNSAFE_REAL_INPUT_PHRASES = [
  "real user document",
  "real OCR text",
  "production runtime enabled",
];
const UNSAFE_HARNESS_EXEC_PHRASES = [
  "harness executed",
  "live llm executed",
  "real operator pilot executed",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_SYNTHETIC_HARNESS_EXECUTION_PLAN_STRINGS.some((f) =>
    value.includes(f),
  );
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsUnsafeMarker(value: string): boolean {
  return (
    SENSITIVE_PERSONAL_MARKERS.some((m) => value.includes(m)) ||
    HIGH_RISK_LEGAL_MARKERS.some((m) => value.includes(m)) ||
    AUTHORITY_DOCUMENT_MARKERS.some((m) => value.includes(m))
  );
}

function containsUnsafeCertaintyPhrase(value: string): boolean {
  return UNSAFE_CERTAINTY_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeGlobalAuthPhrase(value: string): boolean {
  return UNSAFE_GLOBAL_AUTH_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeRealInputPhrase(value: string): boolean {
  return UNSAFE_REAL_INPUT_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeHarnessExecPhrase(value: string): boolean {
  return UNSAFE_HARNESS_EXEC_PHRASES.some((p) => value.includes(p));
}

function containsSecretLike(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    value.includes("sk-") ||
    value.includes("apiKey") ||
    value.includes("internalSecret") ||
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.includes("password")
  );
}

function containsEnvAssignmentLike(value: string): boolean {
  return (
    value.includes("process.env") ||
    value.includes("OPENAI_API_KEY=") ||
    value.includes("VAYLO_INTERNAL_RUNTIME_SECRET=")
  );
}

function containsRawTextMarker(value: string): boolean {
  return value.includes("rawInputText") || value.includes("fullDraftText");
}

function containsRedactedTextMarker(value: string): boolean {
  return value.includes("redactedText");
}

function containsModelOutputMarker(value: string): boolean {
  return value.includes("modelOutput");
}

function addReason(
  list: AiConnectedSyntheticHarnessExecutionPlanRejectionReason[],
  reason: AiConnectedSyntheticHarnessExecutionPlanRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `AiConnectedSyntheticHarnessExecutionPlanInput`
 * for use in the plan check. No harness is executed. No LLM is called. No
 * existing runtime path is touched. No real input is processed.
 */
export function buildSyntheticAiConnectedSyntheticHarnessExecutionPlanInput(): AiConnectedSyntheticHarnessExecutionPlanInput {
  const ackStatements =
    REQUIRED_SYNTHETIC_HARNESS_EXECUTION_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    planId: "ai-connected-synthetic-test-harness-execution-plan-8-3h",
    epochId: "8.3H",
    previousPhaseId: "8.3G",

    syntheticHarnessContractReady: true,

    executionMode: "planned_only",
    syntheticCaseCatalog: [...REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES],
    riskClasses: [...REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES],
    adapterInterfacePolicies: [
      ...REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES,
    ],
    governanceSteps: [...REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS],
    metadataOnlyObservations: [
      ...REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS,
    ],
    executionBlockers: [...REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS],
    checklistConfirmed: [...REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST],

    harnessExecutionPerformedNow: false,
    dryExecutionDeferredToNextPhase: true,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCallPerformed: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByPlan: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorExecutionPlanAcknowledgment: ackStatements,
    reviewerExecutionPlanAcknowledgment: ackStatements,
    notes: [
      "synthetic safe ai-connected synthetic harness execution plan without harness execution",
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

const VALID_EXECUTION_MODES = new Set<string>([
  "planned_only",
  "dry_execution_allowed_next_phase",
]);

/**
 * Validates an `AiConnectedSyntheticHarnessExecutionPlanInput` and returns a
 * typed `AiConnectedSyntheticHarnessExecutionPlanResult`.
 */
export function validateAiConnectedSyntheticHarnessExecutionPlanInput(
  input: AiConnectedSyntheticHarnessExecutionPlanInput,
): AiConnectedSyntheticHarnessExecutionPlanResult {
  const reasons: AiConnectedSyntheticHarnessExecutionPlanRejectionReason[] =
    [];
  const inputRec = asRec(input);

  // ── Rule 1: syntheticHarnessContractReady ─────────────────────────────────
  if (!input.syntheticHarnessContractReady) {
    addReason(reasons, "synthetic_harness_contract_not_ready");
  }

  // ── Rule 2: executionMode ─────────────────────────────────────────────────
  if (!VALID_EXECUTION_MODES.has(input.executionMode)) {
    addReason(reasons, "invalid_execution_mode");
  }

  // ── Rule 3: synthetic case catalog ───────────────────────────────────────
  for (const c of REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES) {
    if (!input.syntheticCaseCatalog.includes(c)) {
      addReason(reasons, "missing_synthetic_case");
      break;
    }
  }

  // ── Rule 4: risk classes ──────────────────────────────────────────────────
  for (const r of REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES) {
    if (!input.riskClasses.includes(r)) {
      addReason(reasons, "missing_risk_class");
      break;
    }
  }

  // ── Rule 5: adapter interface policies ───────────────────────────────────
  for (const p of REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES) {
    if (!input.adapterInterfacePolicies.includes(p)) {
      addReason(reasons, "missing_adapter_interface_policy");
      break;
    }
  }

  // ── Rule 6: governance steps ──────────────────────────────────────────────
  for (const s of REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS) {
    if (!input.governanceSteps.includes(s)) {
      addReason(reasons, "missing_governance_step");
      break;
    }
  }

  // ── Rule 7: metadata-only observations ───────────────────────────────────
  for (const o of REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS) {
    if (!input.metadataOnlyObservations.includes(o)) {
      addReason(reasons, "missing_metadata_only_observation");
      break;
    }
  }

  // ── Rule 8: execution blockers ────────────────────────────────────────────
  for (const b of REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS) {
    if (!input.executionBlockers.includes(b)) {
      addReason(reasons, "missing_execution_blocker");
      break;
    }
  }

  // ── Rule 9: checklist ─────────────────────────────────────────────────────
  for (const item of REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 10: harnessExecutionPerformedNow ─────────────────────────────────
  if (inputRec["harnessExecutionPerformedNow"] === true) {
    addReason(reasons, "harness_execution_claim_detected");
  }

  // ── Rule 11: dryExecutionDeferredToNextPhase ──────────────────────────────
  if (inputRec["dryExecutionDeferredToNextPhase"] !== true) {
    addReason(reasons, "dry_execution_not_deferred");
  }

  // ── Rule 12: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "real_input_allowed_or_detected");
  }

  // ── Rule 13: real/raw/OCR/file/public input blocked ──────────────────────
  if (
    inputRec["realUserInputAllowed"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_allowed_or_detected");
  }
  if (
    inputRec["rawInputAllowed"] === true ||
    inputRec["containsRawInputText"] === true
  ) {
    addReason(reasons, "raw_input_allowed_or_detected");
  }
  if (
    inputRec["realRedactedInputAllowed"] === true ||
    inputRec["containsRedactedText"] === true
  ) {
    addReason(reasons, "real_redacted_input_allowed_or_detected");
  }
  if (
    inputRec["photoOrOcrInputAllowed"] === true ||
    inputRec["fileUploadInputAllowed"] === true
  ) {
    addReason(reasons, "ocr_photo_file_input_allowed_or_detected");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "public_request_allowed_or_detected");
  }

  // ── Rule 14: runtime dependency flags ────────────────────────────────────
  if (
    inputRec["branchCDependencyAllowed"] === true ||
    inputRec["branchCCalled"] === true
  ) {
    addReason(reasons, "branch_c_dependency_claim_detected");
  }
  if (
    inputRec["runSmartTalkDependencyAllowed"] === true ||
    inputRec["runSmartTalkCalledOrImported"] === true
  ) {
    addReason(reasons, "run_smart_talk_dependency_claim_detected");
  }
  if (
    inputRec["ocrRuntimeDependencyAllowed"] === true ||
    inputRec["extractTextFromImageCalledOrImported"] === true
  ) {
    addReason(reasons, "ocr_runtime_dependency_claim_detected");
  }

  // ── Rule 15: LLM / AI-output / model flags ────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_claim_detected");
  }
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }

  // ── Rule 16: user-visible output flags ───────────────────────────────────
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByPlan"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rule 17: persistence flags ────────────────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "persistence_claim_detected");
  }

  // ── Rule 17b: public / pilot flags ────────────────────────────────────────
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "real_operator_pilot_claim_detected");
  }

  // ── Rule 18: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_SYNTHETIC_HARNESS_EXECUTION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorExecutionPlanAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_SYNTHETIC_HARNESS_EXECUTION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerExecutionPlanAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 19: contains* content flags ─────────────────────────────────────
  if (inputRec["containsSecret"] === true) {
    addReason(reasons, "forbidden_secret_detected");
  }
  if (inputRec["containsEnvValue"] === true) {
    addReason(reasons, "forbidden_env_value_detected");
  }
  if (inputRec["containsApiKey"] === true) {
    addReason(reasons, "forbidden_api_key_detected");
  }
  if (inputRec["containsUserPii"] === true) {
    addReason(reasons, "forbidden_pii_detected");
  }
  if (
    inputRec["containsFullDraftText"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 20–22: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.planId,
    input.operatorExecutionPlanAcknowledgment,
    input.reviewerExecutionPlanAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s))
        addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s))
        addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s))
        addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s))
        addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s))
        addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s))
        addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s))
        addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeRealInputPhrase(s))
        addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeHarnessExecPhrase(s))
        addReason(reasons, "unsafe_execution_plan_note_detected");
      const hasUncategorised =
        FORBIDDEN_SYNTHETIC_HARNESS_EXECUTION_PLAN_STRINGS.some(
          (f) =>
            s.includes(f) &&
            !containsSecretLike(s) &&
            !containsEnvAssignmentLike(s) &&
            !containsRawTextMarker(s) &&
            !containsRedactedTextMarker(s) &&
            !containsModelOutputMarker(s) &&
            !containsUnsafeCertaintyPhrase(s) &&
            !containsUnsafeGlobalAuthPhrase(s) &&
            !containsUnsafeRealInputPhrase(s) &&
            !containsUnsafeHarnessExecPhrase(s) &&
            !containsUnsafeMarker(s),
        );
      if (hasUncategorised)
        addReason(reasons, "unsafe_execution_plan_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s))
      addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s))
      addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s))
      addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeRealInputPhrase(s))
      addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeHarnessExecPhrase(s))
      addReason(reasons, "unsafe_execution_plan_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    planId: input.planId,
    epochId: "8.3H",
    status,
    accepted,
    rejectionReasons: reasons,

    safeExecutionPlanMetadata: {
      syntheticCaseCount: input.syntheticCaseCatalog.length,
      riskClassCount: input.riskClasses.length,
      adapterPolicyCount: input.adapterInterfacePolicies.length,
      governanceStepCount: input.governanceSteps.length,
      metadataObservationCount: input.metadataOnlyObservations.length,
      executionBlockerCount: input.executionBlockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      executionMode: input.executionMode,
    },

    readyForAiConnectedSyntheticHarnessDryExecution: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    harnessExecutionPerformedNow: false,
    dryExecutionDeferredToNextPhase: true,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCalled: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByPlan: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByExecutionPlan: false,
    existingRuntimeModifiedByExecutionPlan: false,
    uiTouched: false,
    databaseOrStorageModifiedByExecutionPlan: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the AI-Connected Synthetic Test Harness Execution Plan check for Phase
 * 8.3H.
 *
 * Calls `runAiConnectedSyntheticTestHarnessContractCheck()` (8.3G), validates
 * a synthetic safe execution plan input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT generate AI output.
 * Does NOT emit user-visible output. Does NOT execute the harness.
 * Does NOT modify DB/storage.
 */
export function runAiConnectedSyntheticHarnessExecutionPlanCheck(): AiConnectedSyntheticHarnessExecutionPlanCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3G synthetic harness contract ────────────────────────

  const harnessContractResult =
    runAiConnectedSyntheticTestHarnessContractCheck();
  const hcRec = asRec(harnessContractResult);

  const syntheticHarnessContractReady =
    harnessContractResult.allPassed === true &&
    hcRec["readyForAiConnectedSyntheticTestHarnessExecutionPlan"] === true &&
    hcRec["readyForLiveLLMRuntime"] !== true &&
    hcRec["readyForConnectedAiRuntimeExecution"] !== true &&
    hcRec["readyForRealOperatorPilotRun"] !== true &&
    hcRec["readyForPilotRunNow"] !== true &&
    hcRec["readyForPublicLaunch"] !== true &&
    hcRec["readyForPersistence"] !== true &&
    hcRec["syntheticInputOnly"] === true &&
    hcRec["realUserInputAllowed"] !== true &&
    hcRec["rawInputAllowed"] !== true &&
    hcRec["realRedactedInputAllowed"] !== true &&
    hcRec["photoOrOcrInputAllowed"] !== true &&
    hcRec["fileUploadInputAllowed"] !== true &&
    hcRec["publicAnonymousInputAllowed"] !== true &&
    hcRec["adapterExecutionPerformedNow"] !== true &&
    hcRec["branchCAuthorized"] !== true &&
    hcRec["runSmartTalkAuthorized"] !== true &&
    hcRec["ocrRuntimeAuthorized"] !== true &&
    hcRec["branchCCalled"] !== true &&
    hcRec["runSmartTalkCalledOrImported"] !== true &&
    hcRec["extractTextFromImageCalledOrImported"] !== true &&
    hcRec["liveLLMCalled"] !== true &&
    hcRec["aiOutputGenerated"] !== true &&
    hcRec["modelOutputStored"] !== true &&
    hcRec["userVisibleOutputEmitted"] !== true &&
    hcRec["persistenceUsed"] !== true &&
    hcRec["publicRuntimeEnabled"] !== true &&
    hcRec["realOperatorPilotExecuted"] !== true &&
    hcRec["neverUserVisible"] === true;

  notes.push(
    `syntheticHarnessContractReady: ${String(syntheticHarnessContractReady)}`,
  );
  notes.push(
    `harnessContractResult.allPassed: ${String(harnessContractResult.allPassed)}`,
  );
  notes.push(
    `readyForAiConnectedSyntheticTestHarnessExecutionPlan: ${String(hcRec["readyForAiConnectedSyntheticTestHarnessExecutionPlan"])}`,
  );

  // ── Step 2: Validate the synthetic execution plan input ───────────────────

  const syntheticInput =
    buildSyntheticAiConnectedSyntheticHarnessExecutionPlanInput();
  const syntheticResult =
    validateAiConnectedSyntheticHarnessExecutionPlanInput(syntheticInput);
  const syntheticHarnessExecutionPlanAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticHarnessExecutionPlanAccepted: ${String(syntheticHarnessExecutionPlanAccepted)}`,
  );
  if (!syntheticHarnessExecutionPlanAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof AiConnectedSyntheticHarnessExecutionPlanInput]: AiConnectedSyntheticHarnessExecutionPlanInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AiConnectedSyntheticHarnessExecutionPlanResult {
    return validateAiConnectedSyntheticHarnessExecutionPlanInput({
      ...syntheticInput,
      ...overrides,
    } as AiConnectedSyntheticHarnessExecutionPlanInput);
  }

  const partialCases = REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES.slice(
    0,
    REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES.length - 1,
  ) as unknown as SyntheticHarnessCaseId[];
  const partialRisk = REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES.slice(
    0,
    REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES.length - 1,
  ) as unknown as SyntheticHarnessCaseRiskClass[];
  const partialAdapterPolicies =
    REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES.slice(
      0,
      REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES.length - 1,
    ) as unknown as SyntheticHarnessAdapterInterfacePolicy[];
  const partialGovSteps = REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS.slice(
    0,
    REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS.length - 1,
  ) as unknown as SyntheticHarnessGovernanceStep[];
  const partialObs =
    REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS.slice(
      0,
      REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS.length - 1,
    ) as unknown as SyntheticHarnessMetadataOnlyObservation[];
  const partialBlockers = REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS.slice(
    0,
    REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS.length - 1,
  ) as unknown as SyntheticHarnessExecutionBlocker[];
  const partialChecklist =
    REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST.slice(
      0,
      REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST.length - 1,
    ) as unknown as SyntheticHarnessExecutionChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: AiConnectedSyntheticHarnessExecutionPlanResult;
  }> = [
    // 1. syntheticHarnessContractReady false
    { label: "syntheticHarnessContractReady=false", result: tamper({ syntheticHarnessContractReady: false }) },
    // 2. executionMode invalid
    { label: "executionMode invalid", result: tamper({ executionMode: "unknown_mode" as unknown as "planned_only" }) },
    // 3. missing synthetic case
    { label: "missing synthetic case", result: tamper({ syntheticCaseCatalog: partialCases }) },
    // 4. missing risk class
    { label: "missing risk class", result: tamper({ riskClasses: partialRisk }) },
    // 5. missing adapter policy
    { label: "missing adapter policy", result: tamper({ adapterInterfacePolicies: partialAdapterPolicies }) },
    // 6. missing governance step
    { label: "missing governance step", result: tamper({ governanceSteps: partialGovSteps }) },
    // 7. missing metadata-only observation
    { label: "missing metadata observation", result: tamper({ metadataOnlyObservations: partialObs }) },
    // 8. missing execution blocker
    { label: "missing execution blocker", result: tamper({ executionBlockers: partialBlockers }) },
    // 9. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 10. harnessExecutionPerformedNow true
    { label: "harnessExecutionPerformedNow=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, harnessExecutionPerformedNow: true as unknown as false }) },
    // 11. dryExecutionDeferredToNextPhase false
    { label: "dryExecutionDeferredToNextPhase=false", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, dryExecutionDeferredToNextPhase: false as unknown as true }) },
    // 12. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, syntheticInputOnly: false as unknown as true }) },
    // 13. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, realUserInputAllowed: true as unknown as false }) },
    // 14. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, rawInputAllowed: true as unknown as false }) },
    // 15. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, realRedactedInputAllowed: true as unknown as false }) },
    // 16. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 17. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, fileUploadInputAllowed: true as unknown as false }) },
    // 18. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 19. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, branchCDependencyAllowed: true as unknown as false }) },
    // 20. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 21. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 22. branchCCalled true
    { label: "branchCCalled=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, branchCCalled: true as unknown as false }) },
    // 23. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 24. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 25. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 26. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 27. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 28. modelOutputStored true
    { label: "modelOutputStored=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 29. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 30. userVisibleOutputAuthorizedByPlan true
    { label: "userVisibleOutputAuthorizedByPlan=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, userVisibleOutputAuthorizedByPlan: true as unknown as false }) },
    // 31. persistenceUsed true
    { label: "persistenceUsed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 32. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 33. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 34. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 35. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 36. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorExecutionPlanAcknowledgment: "partial only" }) },
    // 37. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerExecutionPlanAcknowledgment: "partial only" }) },
    // 38. containsSecret true
    { label: "containsSecret=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 39. containsEnvValue true
    { label: "containsEnvValue=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 40. containsApiKey true
    { label: "containsApiKey=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 41. containsRawInputText true
    { label: "containsRawInputText=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 42. containsRedactedText true
    { label: "containsRedactedText=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 43. containsModelOutput true
    { label: "containsModelOutput=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 44. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 45. containsUserPii true
    { label: "containsUserPii=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 46. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateAiConnectedSyntheticHarnessExecutionPlanInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 47. notes: "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 48. notes: "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 49. notes: "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 50. notes: "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 51. notes: "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 52. notes: "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 53. notes: email
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 54. notes: phone
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 55. notes: "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 56. notes: "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 57. notes: "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 58. notes: "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 59. notes: "public launch enabled"
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    // 60. notes: "all outputs authorized"
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    // 61. notes: "global approval"
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    // 62. notes: "branch c authorized"
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    // 63. notes: "real user document"
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    // 64. notes: "real OCR text"
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    // 65. notes: "production runtime enabled"
    { label: 'notes: "production runtime enabled"', result: tamper({ notes: ["production runtime enabled"] }) },
    // 66. notes: "harness executed"
    { label: 'notes: "harness executed"', result: tamper({ notes: ["harness executed"] }) },
    // 67. notes: "live llm executed"
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    // 68. notes: "real operator pilot executed"
    { label: 'notes: "real operator pilot executed"', result: tamper({ notes: ["real operator pilot executed"] }) },
  ];

  let allTamperRejected = true;
  for (const tc of tamperCases) {
    if (tc.result.accepted) {
      notes.push(`TAMPER CASE NOT REJECTED: ${tc.label}`);
      allTamperRejected = false;
    }
  }
  const tamperCasesRejected = allTamperRejected;
  notes.push(
    `tamperCasesRejected: ${String(tamperCasesRejected)} (${String(tamperCases.length)} cases)`,
  );

  // ── Final result ──────────────────────────────────────────────────────────

  const allPassed =
    syntheticHarnessContractReady &&
    syntheticHarnessExecutionPlanAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3H",
    allPassed,
    syntheticHarnessContractReady,
    syntheticHarnessExecutionPlanAccepted,
    tamperCasesRejected,

    readyForAiConnectedSyntheticHarnessDryExecution: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    harnessExecutionPerformedNow: false,
    dryExecutionDeferredToNextPhase: true,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,
    neverUserVisible: true,

    notes,
  };
}
