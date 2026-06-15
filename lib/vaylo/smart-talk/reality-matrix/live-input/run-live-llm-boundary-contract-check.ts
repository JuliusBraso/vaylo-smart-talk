/**
 * Live LLM Boundary Contract Check (Phase 8.3B).
 *
 * Validates the Live LLM Boundary Contract input and produces a
 * `LiveLlmBoundaryContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runConnectedAiRuntimeAuthorizationPlanCheck() and verify all
 *      prerequisite invariants from 8.3A.
 *   2. Build a synthetic safe boundary input and validate it (must be accepted).
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
 *   The existing public Smart Talk Branch C runtime remains completely isolated
 *   from this governance contract. `publicBranchCAuthorizedForGovernanceChain`,
 *   `runSmartTalkAuthorizedForGovernanceChain`, and
 *   `extractTextFromImageAuthorizedForGovernanceChain` are always literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM
 * - make HTTP requests
 * - generate AI output
 * - process actual user input or forward raw input
 * - authorize user-visible output
 * - persist any records
 * - store user content, env values, or secrets
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runLiveLlmBoundaryContractCheck()` explicitly.
 */

import { runConnectedAiRuntimeAuthorizationPlanCheck } from "./run-connected-ai-runtime-authorization-plan-check";
import {
  ALLOWED_LIVE_LLM_PROVIDERS,
  FORBIDDEN_LIVE_LLM_BOUNDARY_STRINGS,
  REQUIRED_LIVE_LLM_BOUNDARY_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST,
  REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS,
  REQUIRED_LIVE_LLM_MODEL_POLICIES,
  REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS,
} from "./live-llm-boundary-contract-types";
import type {
  ExistingSmartTalkRuntimeIsolationStatus,
  LiveLlmBoundaryChecklistItem,
  LiveLlmBoundaryContractCheckResult,
  LiveLlmBoundaryContractInput,
  LiveLlmBoundaryContractResult,
  LiveLlmBoundaryPrecondition,
  LiveLlmBoundaryRejectionReason,
  LiveLlmOutputHandlingRequirement,
  LiveLlmModelPolicy,
} from "./live-llm-boundary-contract-types";

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

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_LIVE_LLM_BOUNDARY_STRINGS.some((f) => value.includes(f));
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
  return (
    value.includes("rawInputText") ||
    value.includes("fullDraftText")
  );
}

function containsRedactedTextMarker(value: string): boolean {
  return value.includes("redactedText");
}

function containsModelOutputMarker(value: string): boolean {
  return value.includes("modelOutput");
}

function addReason(
  list: LiveLlmBoundaryRejectionReason[],
  reason: LiveLlmBoundaryRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `LiveLlmBoundaryContractInput` for use in the
 * harness check. Explicitly documents the existing public Smart Talk runtime
 * isolation. Contains no live LLM calls, no AI output, no user content, no
 * env values, no secrets, and no sensitive content.
 */
export function buildSyntheticLiveLlmBoundaryContractInput(): LiveLlmBoundaryContractInput {
  const ackStatements =
    REQUIRED_LIVE_LLM_BOUNDARY_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "live-llm-boundary-contract-8-3b",
    epochId: "8.3B",
    previousPhaseId: "8.3A",

    connectedAiAuthorizationPlanReady: true,

    existingRuntimeIsolationStatus: "isolated_legacy_current_runtime",
    existingPublicRouteBranchCIdentified: true,
    existingRunSmartTalkLiveRuntimeIdentified: true,
    existingOcrLiveRuntimeIdentified: true,

    publicBranchCAuthorizedForGovernanceChain: false,
    runSmartTalkAuthorizedForGovernanceChain: false,
    extractTextFromImageAuthorizedForGovernanceChain: false,

    allowedProviders: [...ALLOWED_LIVE_LLM_PROVIDERS],
    modelPolicies: [...REQUIRED_LIVE_LLM_MODEL_POLICIES],
    preconditions: [...REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS],
    outputHandlingRequirements: [...REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST],

    envVarNamesAttestedOnly: true,
    envValuesReadByContract: false,
    envValuesPrinted: false,
    envValuesStored: false,
    secretsPrinted: false,
    secretsStored: false,

    liveLLMCallPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    realInputProcessedByContract: false,
    rawInputForwarded: false,
    userVisibleOutputAllowed: false,

    operatorBoundaryAcknowledgment: ackStatements,
    reviewerBoundaryAcknowledgment: ackStatements,
    notes: ["synthetic safe live llm boundary contract without live call"],

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

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `LiveLlmBoundaryContractInput` and returns a typed
 * `LiveLlmBoundaryContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateLiveLlmBoundaryContractInput(
  input: LiveLlmBoundaryContractInput,
): LiveLlmBoundaryContractResult {
  const reasons: LiveLlmBoundaryRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: connectedAiAuthorizationPlanReady ─────────────────────────────
  if (!input.connectedAiAuthorizationPlanReady) {
    addReason(reasons, "connected_ai_authorization_plan_not_ready");
  }

  // ── Rule 2: existingRuntimeIsolationStatus ────────────────────────────────
  if (input.existingRuntimeIsolationStatus !== "isolated_legacy_current_runtime") {
    addReason(reasons, "existing_runtime_not_isolated");
  }

  // ── Rule 3: existing runtime identification flags (literal true) ──────────
  if (inputRec["existingPublicRouteBranchCIdentified"] !== true) {
    addReason(reasons, "existing_runtime_not_isolated");
  }
  if (inputRec["existingRunSmartTalkLiveRuntimeIdentified"] !== true) {
    addReason(reasons, "existing_runtime_not_isolated");
  }
  if (inputRec["existingOcrLiveRuntimeIdentified"] !== true) {
    addReason(reasons, "existing_runtime_not_isolated");
  }

  // ── Rule 4: existing runtime NOT authorized for governance chain ──────────
  if (inputRec["publicBranchCAuthorizedForGovernanceChain"] === true) {
    addReason(reasons, "public_branch_c_authorized_too_early");
  }
  if (inputRec["runSmartTalkAuthorizedForGovernanceChain"] === true) {
    addReason(reasons, "run_smart_talk_authorized_too_early");
  }
  if (inputRec["extractTextFromImageAuthorizedForGovernanceChain"] === true) {
    addReason(reasons, "ocr_runtime_authorized_too_early");
  }

  // ── Rule 5: allowed providers ─────────────────────────────────────────────
  for (const provider of ALLOWED_LIVE_LLM_PROVIDERS) {
    if (!input.allowedProviders.includes(provider)) {
      addReason(reasons, "missing_provider_allowlist");
      break;
    }
  }

  // ── Rule 6: model policies ────────────────────────────────────────────────
  for (const policy of REQUIRED_LIVE_LLM_MODEL_POLICIES) {
    if (!input.modelPolicies.includes(policy)) {
      addReason(reasons, "missing_model_policy");
      break;
    }
  }

  // ── Rule 7: preconditions ─────────────────────────────────────────────────
  for (const pre of REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS) {
    if (!input.preconditions.includes(pre)) {
      addReason(reasons, "missing_precondition");
      break;
    }
  }

  // ── Rule 8: output handling requirements ─────────────────────────────────
  for (const req of REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS) {
    if (!input.outputHandlingRequirements.includes(req)) {
      addReason(reasons, "missing_output_handling_requirement");
      break;
    }
  }

  // ── Rule 9: checklist items ───────────────────────────────────────────────
  for (const item of REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 10: envVarNamesAttestedOnly ──────────────────────────────────────
  if (inputRec["envVarNamesAttestedOnly"] !== true) {
    addReason(reasons, "env_value_read_claim_detected");
  }

  // ── Rule 11: env/secret flags all false ───────────────────────────────────
  if (
    inputRec["envValuesReadByContract"] === true ||
    inputRec["envValuesPrinted"] === true ||
    inputRec["envValuesStored"] === true
  ) {
    addReason(reasons, "env_value_read_claim_detected");
  }
  if (
    inputRec["secretsPrinted"] === true ||
    inputRec["secretsStored"] === true
  ) {
    addReason(reasons, "secret_or_api_key_claim_detected");
  }

  // ── Rule 12: live LLM / AI output / input execution flags ─────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_claim_detected");
  }
  if (inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }
  if (inputRec["rawInputForwarded"] === true) {
    addReason(reasons, "raw_input_forwarding_claim_detected");
  }
  if (
    inputRec["userVisibleOutputAllowed"] === true ||
    inputRec["emittedToUserNow"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }

  // ── Rule 13: operator and reviewer acknowledgments ────────────────────────
  for (const stmt of REQUIRED_LIVE_LLM_BOUNDARY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorBoundaryAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_LIVE_LLM_BOUNDARY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerBoundaryAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 14: contains* content flags ─────────────────────────────────────
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
    inputRec["containsRawInputText"] === true ||
    inputRec["containsFullDraftText"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsRedactedText"] === true) {
    addReason(reasons, "forbidden_redacted_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rule 15: runtime safety flags ────────────────────────────────────────
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }

  // ── Rules 16–18: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorBoundaryAcknowledgment,
    input.reviewerBoundaryAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      // Catch-all for forbidden strings not categorized above
      const uncategorised = FORBIDDEN_LIVE_LLM_BOUNDARY_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsRedactedTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsUnsafeMarker(s),
      );
      if (uncategorised) addReason(reasons, "unsafe_boundary_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3B",
    status,
    accepted,
    rejectionReasons: reasons,

    safeBoundaryMetadata: {
      existingRuntimeIsolationStatus: input.existingRuntimeIsolationStatus,
      allowedProviderCount: input.allowedProviders.length,
      modelPolicyCount: input.modelPolicies.length,
      preconditionCount: input.preconditions.length,
      outputHandlingRequirementCount: input.outputHandlingRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForRedactedInputForwardingContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    publicBranchCAuthorizedForGovernanceChain: false,
    runSmartTalkAuthorizedForGovernanceChain: false,
    extractTextFromImageAuthorizedForGovernanceChain: false,

    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    envValuesReadByContract: false,
    envValuesPrinted: false,
    envValuesStored: false,
    secretsPrinted: false,
    secretsStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByLiveLlmBoundary: false,
    existingRuntimeModifiedByBoundary: false,
    uiTouched: false,
    databaseOrStorageModifiedByBoundary: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the full Live LLM Boundary Contract check for Phase 8.3B.
 *
 * Calls `runConnectedAiRuntimeAuthorizationPlanCheck()` (8.3A), validates a
 * synthetic safe boundary input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts, extract-text-from-image.ts,
 * app/api/smart-talk/route.ts, or fetch(). Does NOT call any live LLM.
 * Does NOT generate AI output. Does NOT store user content or env values.
 * Does NOT modify DB/storage.
 */
export function runLiveLlmBoundaryContractCheck(): LiveLlmBoundaryContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3A connected AI authorization plan ───────────────────

  const planCheck = runConnectedAiRuntimeAuthorizationPlanCheck();
  const pcRec = asRec(planCheck);

  const connectedAiAuthorizationPlanReady =
    planCheck.allPassed === true &&
    pcRec["readyForLiveLLMBoundaryContract"] === true &&
    pcRec["readyForConnectedAiRuntimeExecution"] !== true &&
    pcRec["readyForLiveLLMRuntime"] !== true &&
    pcRec["readyForRealOperatorPilotRun"] !== true &&
    pcRec["readyForPilotRunNow"] !== true &&
    pcRec["readyForPublicLaunch"] !== true &&
    pcRec["readyForPersistence"] !== true &&
    pcRec["liveLLMCalled"] !== true &&
    pcRec["realInputProcessed"] !== true &&
    pcRec["rawInputForwarded"] !== true &&
    pcRec["aiOutputGenerated"] !== true &&
    pcRec["modelOutputStored"] !== true &&
    pcRec["persistenceUsed"] !== true &&
    pcRec["publicRuntimeEnabled"] !== true &&
    pcRec["emittedToUserNow"] !== true &&
    pcRec["neverUserVisible"] === true;

  notes.push(`connectedAiAuthorizationPlanReady: ${String(connectedAiAuthorizationPlanReady)}`);
  notes.push(`planCheck.allPassed: ${String(planCheck.allPassed)}`);
  notes.push(`readyForLiveLLMBoundaryContract: ${String(pcRec["readyForLiveLLMBoundaryContract"])}`);

  // ── Step 2: Validate the synthetic safe boundary input ────────────────────

  const syntheticInput = buildSyntheticLiveLlmBoundaryContractInput();
  const syntheticResult = validateLiveLlmBoundaryContractInput(syntheticInput);
  const syntheticLiveLlmBoundaryAccepted = syntheticResult.accepted;

  notes.push(`syntheticLiveLlmBoundaryAccepted: ${String(syntheticLiveLlmBoundaryAccepted)}`);
  if (!syntheticLiveLlmBoundaryAccepted) {
    notes.push(`syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof LiveLlmBoundaryContractInput]: LiveLlmBoundaryContractInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): LiveLlmBoundaryContractResult {
    return validateLiveLlmBoundaryContractInput({
      ...syntheticInput,
      ...overrides,
    } as LiveLlmBoundaryContractInput);
  }

  const partialModels = REQUIRED_LIVE_LLM_MODEL_POLICIES.slice(
    0,
    REQUIRED_LIVE_LLM_MODEL_POLICIES.length - 1,
  ) as unknown as LiveLlmModelPolicy[];

  const partialPreconditions = REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS.slice(
    0,
    REQUIRED_LIVE_LLM_BOUNDARY_PRECONDITIONS.length - 1,
  ) as unknown as LiveLlmBoundaryPrecondition[];

  const partialOutputHandling = REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS.slice(
    0,
    REQUIRED_LIVE_LLM_OUTPUT_HANDLING_REQUIREMENTS.length - 1,
  ) as unknown as LiveLlmOutputHandlingRequirement[];

  const partialChecklist = REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST.slice(
    0,
    REQUIRED_LIVE_LLM_BOUNDARY_CHECKLIST.length - 1,
  ) as unknown as LiveLlmBoundaryChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: LiveLlmBoundaryContractResult;
  }> = [
    // 1. connectedAiAuthorizationPlanReady false
    { label: "connectedAiAuthorizationPlanReady=false", result: tamper({ connectedAiAuthorizationPlanReady: false }) },
    // 2. existingRuntimeIsolationStatus unsafe
    { label: "existingRuntimeIsolationStatus=unsafe", result: tamper({ existingRuntimeIsolationStatus: "unsafe_overlap_detected" as ExistingSmartTalkRuntimeIsolationStatus }) },
    // 3. existingPublicRouteBranchCIdentified false
    { label: "existingPublicRouteBranchCIdentified=false", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, existingPublicRouteBranchCIdentified: false as unknown as true }) },
    // 4. existingRunSmartTalkLiveRuntimeIdentified false
    { label: "existingRunSmartTalkLiveRuntimeIdentified=false", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, existingRunSmartTalkLiveRuntimeIdentified: false as unknown as true }) },
    // 5. existingOcrLiveRuntimeIdentified false
    { label: "existingOcrLiveRuntimeIdentified=false", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, existingOcrLiveRuntimeIdentified: false as unknown as true }) },
    // 6. publicBranchCAuthorizedForGovernanceChain true
    { label: "publicBranchCAuthorizedForGovernanceChain=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, publicBranchCAuthorizedForGovernanceChain: true as unknown as false }) },
    // 7. runSmartTalkAuthorizedForGovernanceChain true
    { label: "runSmartTalkAuthorizedForGovernanceChain=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, runSmartTalkAuthorizedForGovernanceChain: true as unknown as false }) },
    // 8. extractTextFromImageAuthorizedForGovernanceChain true
    { label: "extractTextFromImageAuthorizedForGovernanceChain=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, extractTextFromImageAuthorizedForGovernanceChain: true as unknown as false }) },
    // 9. missing allowed provider
    { label: "missing allowed provider", result: tamper({ allowedProviders: [] }) },
    // 10. missing model policy
    { label: "missing model policy", result: tamper({ modelPolicies: partialModels }) },
    // 11. missing precondition
    { label: "missing precondition", result: tamper({ preconditions: partialPreconditions }) },
    // 12. missing output handling requirement
    { label: "missing output handling requirement", result: tamper({ outputHandlingRequirements: partialOutputHandling }) },
    // 13. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 14. envVarNamesAttestedOnly false
    { label: "envVarNamesAttestedOnly=false", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, envVarNamesAttestedOnly: false as unknown as true }) },
    // 15. envValuesReadByContract true
    { label: "envValuesReadByContract=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, envValuesReadByContract: true as unknown as false }) },
    // 16. envValuesPrinted true
    { label: "envValuesPrinted=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, envValuesPrinted: true as unknown as false }) },
    // 17. envValuesStored true
    { label: "envValuesStored=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, envValuesStored: true as unknown as false }) },
    // 18. secretsPrinted true
    { label: "secretsPrinted=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, secretsPrinted: true as unknown as false }) },
    // 19. secretsStored true
    { label: "secretsStored=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, secretsStored: true as unknown as false }) },
    // 20. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 21. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 22. modelOutputStored true
    { label: "modelOutputStored=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 23. realInputProcessedByContract true
    { label: "realInputProcessedByContract=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, realInputProcessedByContract: true as unknown as false }) },
    // 24. rawInputForwarded true
    { label: "rawInputForwarded=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, rawInputForwarded: true as unknown as false }) },
    // 25. userVisibleOutputAllowed true
    { label: "userVisibleOutputAllowed=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, userVisibleOutputAllowed: true as unknown as false }) },
    // 26. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorBoundaryAcknowledgment: "partial only" }) },
    // 27. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerBoundaryAcknowledgment: "partial only" }) },
    // 28. containsSecret true
    { label: "containsSecret=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 29. containsEnvValue true
    { label: "containsEnvValue=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 30. containsApiKey true
    { label: "containsApiKey=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 31. containsRawInputText true
    { label: "containsRawInputText=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 32. containsRedactedText true
    { label: "containsRedactedText=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 33. containsModelOutput true
    { label: "containsModelOutput=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 34. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 35. containsUserPii true
    { label: "containsUserPii=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 36. notes includes "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 37. notes includes "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 38. notes includes "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 39. notes includes "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input here"] }) },
    // 40. notes includes "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 41. notes includes "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 42. notes includes "john@example.com"
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 43. notes includes "+49 170 1234567"
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 44. notes includes "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 45. notes includes "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 46. notes includes "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 47. notes includes "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 48. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 49. persistenceUsed true
    { label: "persistenceUsed=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 50. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 51. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 52. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 53. emittedToUserNow true
    { label: "emittedToUserNow=true", result: validateLiveLlmBoundaryContractInput({ ...syntheticInput, emittedToUserNow: true as unknown as false }) },
  ];

  let allTamperRejected = true;
  for (const tc of tamperCases) {
    if (tc.result.accepted) {
      notes.push(`TAMPER CASE NOT REJECTED: ${tc.label}`);
      allTamperRejected = false;
    }
  }
  const tamperCasesRejected = allTamperRejected;
  notes.push(`tamperCasesRejected: ${String(tamperCasesRejected)} (${String(tamperCases.length)} cases)`);

  // ── Final result ──────────────────────────────────────────────────────────

  const allPassed =
    connectedAiAuthorizationPlanReady &&
    syntheticLiveLlmBoundaryAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3B",
    allPassed,
    connectedAiAuthorizationPlanReady,
    syntheticLiveLlmBoundaryAccepted,
    tamperCasesRejected,

    readyForRedactedInputForwardingContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    publicBranchCAuthorizedForGovernanceChain: false,
    runSmartTalkAuthorizedForGovernanceChain: false,
    extractTextFromImageAuthorizedForGovernanceChain: false,

    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
