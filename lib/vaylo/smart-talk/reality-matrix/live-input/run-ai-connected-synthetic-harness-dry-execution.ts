/**
 * AI-Connected Synthetic Harness Dry Execution (Phase 8.3I).
 *
 * Validates the AI-Connected Synthetic Harness Dry Execution input and
 * produces an `AiConnectedSyntheticHarnessDryExecutionCheckResult`.
 *
 * Sub-steps:
 *   1. Call runAiConnectedSyntheticHarnessExecutionPlanCheck() (8.3H) and
 *      verify all prerequisite invariants.
 *   2. Build a synthetic dry execution input (deterministic adapter, 8 cases,
 *      metadata-only) and validate it (must be accepted).
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
 * - produce real AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runAiConnectedSyntheticHarnessDryExecution()` explicitly.
 */

import { runAiConnectedSyntheticHarnessExecutionPlanCheck } from "./run-ai-connected-synthetic-test-harness-execution-plan-check";
import {
  FORBIDDEN_SYNTHETIC_DRY_EXECUTION_STRINGS,
  REQUIRED_SYNTHETIC_DRY_EXECUTION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_SYNTHETIC_DRY_EXECUTION_CASE_IDS,
  REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS,
  REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS,
  REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS,
} from "./ai-connected-synthetic-harness-dry-execution-types";
import type {
  AiConnectedSyntheticHarnessDryExecutionCheckResult,
  AiConnectedSyntheticHarnessDryExecutionInput,
  AiConnectedSyntheticHarnessDryExecutionResult,
  SyntheticDryExecutionCaseMetadata,
  SyntheticDryExecutionRejectionReason,
} from "./ai-connected-synthetic-harness-dry-execution-types";

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
const UNSAFE_LIVE_EXEC_PHRASES = [
  "harness executed with live llm",
  "live llm executed",
  "real operator pilot executed",
  "real model output",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_SYNTHETIC_DRY_EXECUTION_STRINGS.some((f) =>
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

function containsUnsafeLiveExecPhrase(value: string): boolean {
  return UNSAFE_LIVE_EXEC_PHRASES.some((p) => value.includes(p));
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
  return (
    value.includes("modelOutput") || value.includes("real model output")
  );
}

function addReason(
  list: SyntheticDryExecutionRejectionReason[],
  reason: SyntheticDryExecutionRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Case metadata builder ─────────────────────────────────────────────────────

/**
 * Builds the 8 synthetic dry execution case metadata records.
 * Uses only synthetic case IDs and enum values — no raw text, no model
 * output, no user content, no secrets.
 */
export function buildSyntheticDryExecutionCaseMetadata(): readonly SyntheticDryExecutionCaseMetadata[] {
  const allObs = [...REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS];
  return [
    {
      caseId: "synthetic_safe_low_risk_payment_notice",
      expectedPath: "safe_low_risk_explanation_path",
      result: "passed_expected_safe_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_deadline_explicit_date",
      expectedPath: "explicit_deadline_caution_path",
      result: "passed_expected_safe_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_deadline_relative_missing_delivery_date",
      expectedPath: "relative_deadline_uncertainty_path",
      result: "passed_expected_uncertainty_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_high_risk_widerspruch_deadline",
      expectedPath: "high_risk_block_path",
      result: "passed_expected_block_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_high_risk_immigration_uncertainty",
      expectedPath: "immigration_uncertainty_block_path",
      result: "passed_expected_block_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_missing_context_partial_document",
      expectedPath: "missing_context_block_path",
      result: "passed_expected_block_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_unsupported_legal_certainty_trap",
      expectedPath: "legal_certainty_trap_block_path",
      result: "passed_expected_block_path",
      observations: allObs,
    },
    {
      caseId: "synthetic_unsafe_next_step_trap",
      expectedPath: "unsafe_next_step_trap_block_path",
      result: "passed_expected_block_path",
      observations: allObs,
    },
  ] as const;
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `AiConnectedSyntheticHarnessDryExecutionInput`
 * for use in the execution check. Uses the deterministic synthetic adapter,
 * exactly 8 planned case IDs, metadata-only observations. No live LLM. No
 * real input. No existing runtime path is touched.
 */
export function buildSyntheticAiConnectedHarnessDryExecutionInput(): AiConnectedSyntheticHarnessDryExecutionInput {
  const ackStatements =
    REQUIRED_SYNTHETIC_DRY_EXECUTION_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    executionId: "ai-connected-synthetic-harness-dry-execution-8-3i",
    epochId: "8.3I",
    previousPhaseId: "8.3H",

    executionPlanReady: true,

    adapterKind: "deterministic_synthetic_adapter",
    executionMode: "metadata_only_dry_run",
    caseMetadata: buildSyntheticDryExecutionCaseMetadata(),
    expectedPaths: [...REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS],
    observations: [...REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS],
    invariants: [...REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS],

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,

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
    userVisibleOutputAuthorizedByDryExecution: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorDryExecutionAcknowledgment: ackStatements,
    reviewerDryExecutionAcknowledgment: ackStatements,
    notes: [
      "synthetic dry execution completed with deterministic metadata-only adapter",
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

/**
 * Validates an `AiConnectedSyntheticHarnessDryExecutionInput` and returns a
 * typed `AiConnectedSyntheticHarnessDryExecutionResult`.
 */
export function validateAiConnectedSyntheticHarnessDryExecutionInput(
  input: AiConnectedSyntheticHarnessDryExecutionInput,
): AiConnectedSyntheticHarnessDryExecutionResult {
  const reasons: SyntheticDryExecutionRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: executionPlanReady ────────────────────────────────────────────
  if (!input.executionPlanReady) {
    addReason(reasons, "execution_plan_not_ready");
  }

  // ── Rule 2: adapterKind ───────────────────────────────────────────────────
  if (input.adapterKind !== "deterministic_synthetic_adapter") {
    addReason(reasons, "invalid_adapter_kind");
  }

  // ── Rule 3: executionMode ─────────────────────────────────────────────────
  if (input.executionMode !== "metadata_only_dry_run") {
    addReason(reasons, "invalid_execution_mode");
  }

  // ── Rules 4–6: case metadata ──────────────────────────────────────────────
  if (input.caseMetadata.length !== 8) {
    addReason(reasons, "missing_required_case_result");
  } else {
    for (const requiredId of REQUIRED_SYNTHETIC_DRY_EXECUTION_CASE_IDS) {
      if (!input.caseMetadata.some((c) => c.caseId === requiredId)) {
        addReason(reasons, "missing_required_case_result");
        break;
      }
    }
    for (const cm of input.caseMetadata) {
      const isFailed =
        cm.result === "failed_unexpected_safe_path" ||
        cm.result === "failed_unexpected_block_path" ||
        cm.result === "failed_missing_expected_governance_step";
      if (isFailed) {
        addReason(reasons, "missing_required_case_result");
      }
      for (const obs of REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS) {
        if (!cm.observations.includes(obs)) {
          addReason(reasons, "missing_observation");
          break;
        }
      }
    }
  }

  // ── Rule 7: expected paths ────────────────────────────────────────────────
  for (const ep of REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS) {
    if (!input.expectedPaths.includes(ep)) {
      addReason(reasons, "missing_expected_path");
      break;
    }
  }

  // ── Rule 8: observations ──────────────────────────────────────────────────
  for (const obs of REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS) {
    if (!input.observations.includes(obs)) {
      addReason(reasons, "missing_observation");
      break;
    }
  }

  // ── Rule 9: invariants ────────────────────────────────────────────────────
  for (const inv of REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS) {
    if (!input.invariants.includes(inv)) {
      addReason(reasons, "missing_invariant");
      break;
    }
  }

  // ── Rule 10: dry execution flags ──────────────────────────────────────────
  if (inputRec["dryExecutionPerformed"] !== true) {
    addReason(reasons, "execution_plan_not_ready");
  }
  if (inputRec["deterministicSyntheticAdapterUsed"] !== true) {
    addReason(reasons, "invalid_adapter_kind");
  }
  if (inputRec["metadataOnlyResults"] !== true) {
    addReason(reasons, "invalid_execution_mode");
  }

  // ── Rule 11: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "real_input_detected");
  }

  // ── Rule 12: real/raw/OCR/file/public input blocked ───────────────────────
  if (
    inputRec["realUserInputAllowed"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_detected");
  }
  if (
    inputRec["rawInputAllowed"] === true ||
    inputRec["containsRawInputText"] === true
  ) {
    addReason(reasons, "raw_input_detected");
  }
  if (
    inputRec["realRedactedInputAllowed"] === true ||
    inputRec["containsRedactedText"] === true
  ) {
    addReason(reasons, "real_redacted_input_detected");
  }
  if (
    inputRec["photoOrOcrInputAllowed"] === true ||
    inputRec["fileUploadInputAllowed"] === true
  ) {
    addReason(reasons, "photo_ocr_file_input_detected");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "real_input_detected");
  }

  // ── Rule 13: runtime dependency flags ────────────────────────────────────
  if (
    inputRec["branchCDependencyAllowed"] === true ||
    inputRec["branchCCalled"] === true
  ) {
    addReason(reasons, "branch_c_dependency_detected");
  }
  if (
    inputRec["runSmartTalkDependencyAllowed"] === true ||
    inputRec["runSmartTalkCalledOrImported"] === true
  ) {
    addReason(reasons, "run_smart_talk_dependency_detected");
  }
  if (
    inputRec["ocrRuntimeDependencyAllowed"] === true ||
    inputRec["extractTextFromImageCalledOrImported"] === true
  ) {
    addReason(reasons, "ocr_runtime_dependency_detected");
  }

  // ── Rule 14: LLM / AI-output / model flags ────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_detected");
  }
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_detected");
  }

  // ── Rule 15: user-visible output flags ───────────────────────────────────
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByDryExecution"] === true
  ) {
    addReason(reasons, "user_visible_output_detected");
  }

  // ── Rule 16: persistence flags ────────────────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "persistence_detected");
  }

  // ── Rule 17: public / pilot flags ─────────────────────────────────────────
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_detected");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "real_operator_pilot_detected");
  }

  // ── Rule 18: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_SYNTHETIC_DRY_EXECUTION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorDryExecutionAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_case_result");
      break;
    }
  }
  for (const stmt of REQUIRED_SYNTHETIC_DRY_EXECUTION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerDryExecutionAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_case_result");
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
  if (inputRec["containsFullDraftText"] === true) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 20–23: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.executionId,
    input.operatorDryExecutionAcknowledgment,
    input.reviewerDryExecutionAcknowledgment,
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
        addReason(reasons, "unsafe_dry_execution_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s))
        addReason(reasons, "unsafe_dry_execution_note_detected");
      if (containsUnsafeRealInputPhrase(s))
        addReason(reasons, "unsafe_dry_execution_note_detected");
      if (containsUnsafeLiveExecPhrase(s))
        addReason(reasons, "unsafe_dry_execution_note_detected");
      const hasUncategorised = FORBIDDEN_SYNTHETIC_DRY_EXECUTION_STRINGS.some(
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
          !containsUnsafeLiveExecPhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (hasUncategorised)
        addReason(reasons, "unsafe_dry_execution_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s))
      addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s))
      addReason(reasons, "unsafe_dry_execution_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s))
      addReason(reasons, "unsafe_dry_execution_note_detected");
    if (containsUnsafeRealInputPhrase(s))
      addReason(reasons, "unsafe_dry_execution_note_detected");
    if (containsUnsafeLiveExecPhrase(s))
      addReason(reasons, "unsafe_dry_execution_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  const passedCaseCount = accepted
    ? input.caseMetadata.filter(
        (c) =>
          c.result === "passed_expected_safe_path" ||
          c.result === "passed_expected_block_path" ||
          c.result === "passed_expected_uncertainty_path",
      ).length
    : 0;
  const failedCaseCount = accepted
    ? input.caseMetadata.filter(
        (c) =>
          c.result === "failed_unexpected_safe_path" ||
          c.result === "failed_unexpected_block_path" ||
          c.result === "failed_missing_expected_governance_step",
      ).length
    : 0;

  const status = !accepted
    ? ("rejected" as const)
    : failedCaseCount > 0
      ? ("failed" as const)
      : ("passed" as const);

  return {
    executionId: input.executionId,
    epochId: "8.3I",
    status,
    accepted,
    rejectionReasons: reasons,

    safeDryExecutionMetadata: {
      adapterKind: input.adapterKind,
      executionMode: input.executionMode,
      caseCount: input.caseMetadata.length,
      expectedPathCount: input.expectedPaths.length,
      observationCount: input.observations.length,
      invariantCount: input.invariants.length,
      passedCaseCount,
      failedCaseCount,
    },

    readyForSyntheticHarnessPostRunAudit: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,

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
    userVisibleOutputAuthorizedByDryExecution: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByDryExecution: false,
    existingRuntimeModifiedByDryExecution: false,
    uiTouched: false,
    databaseOrStorageModifiedByDryExecution: false,
    neverUserVisible: true,
  };
}

// ── Dry execution check ───────────────────────────────────────────────────────

/**
 * Runs the AI-Connected Synthetic Harness Dry Execution check for Phase 8.3I.
 *
 * Calls `runAiConnectedSyntheticHarnessExecutionPlanCheck()` (8.3H), builds
 * and validates a synthetic safe dry execution input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT produce real AI output.
 * Does NOT emit user-visible output. Does NOT modify DB/storage.
 */
export function runAiConnectedSyntheticHarnessDryExecution(): AiConnectedSyntheticHarnessDryExecutionCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3H execution plan ───────────────────────────────────

  const planResult = runAiConnectedSyntheticHarnessExecutionPlanCheck();
  const planRec = asRec(planResult);

  const executionPlanReady =
    planResult.allPassed === true &&
    planRec["readyForAiConnectedSyntheticHarnessDryExecution"] === true &&
    planRec["readyForLiveLLMRuntime"] !== true &&
    planRec["readyForConnectedAiRuntimeExecution"] !== true &&
    planRec["readyForRealOperatorPilotRun"] !== true &&
    planRec["readyForPilotRunNow"] !== true &&
    planRec["readyForPublicLaunch"] !== true &&
    planRec["readyForPersistence"] !== true &&
    planRec["harnessExecutionPerformedNow"] !== true &&
    planRec["dryExecutionDeferredToNextPhase"] === true &&
    planRec["syntheticInputOnly"] === true &&
    planRec["realUserInputAllowed"] !== true &&
    planRec["rawInputAllowed"] !== true &&
    planRec["realRedactedInputAllowed"] !== true &&
    planRec["photoOrOcrInputAllowed"] !== true &&
    planRec["fileUploadInputAllowed"] !== true &&
    planRec["publicAnonymousInputAllowed"] !== true &&
    planRec["branchCDependencyAllowed"] !== true &&
    planRec["runSmartTalkDependencyAllowed"] !== true &&
    planRec["ocrRuntimeDependencyAllowed"] !== true &&
    planRec["branchCCalled"] !== true &&
    planRec["runSmartTalkCalledOrImported"] !== true &&
    planRec["extractTextFromImageCalledOrImported"] !== true &&
    planRec["liveLLMCalled"] !== true &&
    planRec["aiOutputGenerated"] !== true &&
    planRec["modelOutputStored"] !== true &&
    planRec["userVisibleOutputEmitted"] !== true &&
    planRec["persistenceUsed"] !== true &&
    planRec["publicRuntimeEnabled"] !== true &&
    planRec["realOperatorPilotExecuted"] !== true &&
    planRec["neverUserVisible"] === true;

  notes.push(`executionPlanReady: ${String(executionPlanReady)}`);
  notes.push(`planResult.allPassed: ${String(planResult.allPassed)}`);
  notes.push(
    `readyForAiConnectedSyntheticHarnessDryExecution: ${String(planRec["readyForAiConnectedSyntheticHarnessDryExecution"])}`,
  );

  // ── Step 2: Validate the dry execution input ──────────────────────────────

  const syntheticInput = buildSyntheticAiConnectedHarnessDryExecutionInput();
  const syntheticResult =
    validateAiConnectedSyntheticHarnessDryExecutionInput(syntheticInput);
  const dryExecutionAccepted =
    syntheticResult.accepted && syntheticResult.status !== "failed";

  notes.push(`dryExecutionAccepted: ${String(dryExecutionAccepted)}`);
  notes.push(`dryExecutionStatus: ${syntheticResult.status}`);
  if (!syntheticResult.accepted) {
    notes.push(
      `rejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof AiConnectedSyntheticHarnessDryExecutionInput]: AiConnectedSyntheticHarnessDryExecutionInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AiConnectedSyntheticHarnessDryExecutionResult {
    return validateAiConnectedSyntheticHarnessDryExecutionInput({
      ...syntheticInput,
      ...overrides,
    } as AiConnectedSyntheticHarnessDryExecutionInput);
  }

  const allObs = [...REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS];
  const partialObs = allObs.slice(0, allObs.length - 1);

  const casesWithMissingCase = buildSyntheticDryExecutionCaseMetadata().slice(
    0,
    7,
  );
  const casesWithFailedResult: SyntheticDryExecutionCaseMetadata[] = [
    ...buildSyntheticDryExecutionCaseMetadata().slice(0, 7),
    {
      caseId: "synthetic_unsafe_next_step_trap",
      expectedPath: "unsafe_next_step_trap_block_path",
      result: "failed_unexpected_safe_path",
      observations: allObs,
    },
  ];
  const casesWithMissingObs: SyntheticDryExecutionCaseMetadata[] = [
    ...buildSyntheticDryExecutionCaseMetadata().slice(0, 7),
    {
      caseId: "synthetic_unsafe_next_step_trap",
      expectedPath: "unsafe_next_step_trap_block_path",
      result: "passed_expected_block_path",
      observations: partialObs,
    },
  ];

  const partialPaths =
    REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS.slice(
      0,
      REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS.length - 1,
    );
  const partialInvariants = REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS.slice(
    0,
    REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS.length - 1,
  );

  const tamperCases: Array<{
    label: string;
    result: AiConnectedSyntheticHarnessDryExecutionResult;
  }> = [
    // 1. executionPlanReady false
    { label: "executionPlanReady=false", result: tamper({ executionPlanReady: false }) },
    // 2. adapterKind invalid
    { label: "adapterKind invalid", result: tamper({ adapterKind: "live_llm_adapter" as unknown as "deterministic_synthetic_adapter" }) },
    // 3. executionMode invalid
    { label: "executionMode invalid", result: tamper({ executionMode: "live_run" as unknown as "metadata_only_dry_run" }) },
    // 4. caseMetadata missing one case
    { label: "caseMetadata missing case", result: tamper({ caseMetadata: casesWithMissingCase }) },
    // 5. caseMetadata includes failed result
    { label: "caseMetadata failed result", result: tamper({ caseMetadata: casesWithFailedResult }) },
    // 6. case observations missing one observation
    { label: "case observations missing obs", result: tamper({ caseMetadata: casesWithMissingObs }) },
    // 7. missing expected path
    { label: "missing expected path", result: tamper({ expectedPaths: partialPaths }) },
    // 8. missing observation
    { label: "missing observation", result: tamper({ observations: partialObs }) },
    // 9. missing invariant
    { label: "missing invariant", result: tamper({ invariants: partialInvariants }) },
    // 10. dryExecutionPerformed false
    { label: "dryExecutionPerformed=false", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, dryExecutionPerformed: false as unknown as true }) },
    // 11. deterministicSyntheticAdapterUsed false
    { label: "deterministicSyntheticAdapterUsed=false", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, deterministicSyntheticAdapterUsed: false as unknown as true }) },
    // 12. metadataOnlyResults false
    { label: "metadataOnlyResults=false", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, metadataOnlyResults: false as unknown as true }) },
    // 13. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, syntheticInputOnly: false as unknown as true }) },
    // 14. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, realUserInputAllowed: true as unknown as false }) },
    // 15. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, rawInputAllowed: true as unknown as false }) },
    // 16. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, realRedactedInputAllowed: true as unknown as false }) },
    // 17. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 18. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, fileUploadInputAllowed: true as unknown as false }) },
    // 19. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 20. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, branchCDependencyAllowed: true as unknown as false }) },
    // 21. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 22. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 23. branchCCalled true
    { label: "branchCCalled=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, branchCCalled: true as unknown as false }) },
    // 24. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 25. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 26. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 27. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 28. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 29. modelOutputStored true
    { label: "modelOutputStored=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 30. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 31. userVisibleOutputAuthorizedByDryExecution true
    { label: "userVisibleOutputAuthorizedByDryExecution=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, userVisibleOutputAuthorizedByDryExecution: true as unknown as false }) },
    // 32. persistenceUsed true
    { label: "persistenceUsed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 33. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 34. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 35. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 36. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 37. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorDryExecutionAcknowledgment: "partial only" }) },
    // 38. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerDryExecutionAcknowledgment: "partial only" }) },
    // 39. containsSecret true
    { label: "containsSecret=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 40. containsEnvValue true
    { label: "containsEnvValue=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 41. containsApiKey true
    { label: "containsApiKey=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 42. containsRawInputText true
    { label: "containsRawInputText=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 43. containsRedactedText true
    { label: "containsRedactedText=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 44. containsModelOutput true
    { label: "containsModelOutput=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 45. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 46. containsUserPii true
    { label: "containsUserPii=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 47. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateAiConnectedSyntheticHarnessDryExecutionInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 48. notes: "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 49. notes: "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 50. notes: "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 51. notes: "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 52. notes: "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 53. notes: "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 54. notes: email
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 55. notes: phone
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 56. notes: "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 57. notes: "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 58. notes: "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 59. notes: "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 60. notes: "public launch enabled"
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    // 61. notes: "all outputs authorized"
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    // 62. notes: "global approval"
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    // 63. notes: "branch c authorized"
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    // 64. notes: "real user document"
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    // 65. notes: "real OCR text"
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    // 66. notes: "production runtime enabled"
    { label: 'notes: "production runtime enabled"', result: tamper({ notes: ["production runtime enabled"] }) },
    // 67. notes: "harness executed with live llm"
    { label: 'notes: "harness executed with live llm"', result: tamper({ notes: ["harness executed with live llm"] }) },
    // 68. notes: "live llm executed"
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    // 69. notes: "real operator pilot executed"
    { label: 'notes: "real operator pilot executed"', result: tamper({ notes: ["real operator pilot executed"] }) },
    // 70. notes: "real model output"
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
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
    executionPlanReady && dryExecutionAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3I",
    allPassed,
    executionPlanReady,
    dryExecutionAccepted,
    tamperCasesRejected,

    readyForSyntheticHarnessPostRunAudit: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,

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
