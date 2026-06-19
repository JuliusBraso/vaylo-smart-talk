/**
 * Real Environment Attestation Contract Check (Phase 8.2M-2).
 *
 * Validates attestation-only real environment readiness inputs and produces a
 * `RealEnvironmentAttestationCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-1 operator/reviewer identity contract is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run 26 tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - read process.env
 * - inspect, print, or store real environment values or secrets
 * - authorize or execute a real pilot run
 * - persist attestation records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runRealEnvironmentAttestationContractCheck()` explicitly.
 */

import { runOperatorReviewerIdentityContractCheck } from "./run-operator-reviewer-identity-contract-check";
import {
  FORBIDDEN_REAL_ENVIRONMENT_ATTESTATION_STRINGS,
  REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST,
  REQUIRED_REAL_ENVIRONMENT_ATTESTATION_STATEMENTS,
  REQUIRED_REAL_PILOT_ENV_VAR_NAMES,
} from "./real-environment-attestation-contract-types";
import type {
  RealEnvironmentAttestationCheckResult,
  RealEnvironmentAttestationInput,
  RealEnvironmentAttestationRejectionReason,
  RealEnvironmentAttestationResult,
  RealEnvironmentName,
  RequiredRealPilotEnvironmentVariableName,
} from "./real-environment-attestation-contract-types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_ENV_NAMES: readonly RealEnvironmentName[] = [
  "local_development",
  "vercel_preview",
  "vercel_production",
  "internal_test_environment",
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
// Require 7+ consecutive digit characters (spaces allowed but not hyphens).
// This avoids false positives on ISO 8601 date strings like "2026-06-12" where
// digits are separated by hyphens, while still catching real phone numbers.
const PHONE_PATTERN = /\+?\d[ \d]{6,}/;

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_REAL_ENVIRONMENT_ATTESTATION_STRINGS.some((f) =>
    value.includes(f),
  );
}

function containsEnvAssignment(value: string): boolean {
  // Detect VAR_NAME= patterns for any required env var name (assignment form only).
  const hasAssignment = REQUIRED_REAL_PILOT_ENV_VAR_NAMES.some((name) =>
    value.includes(`${name}=`),
  );
  // Detect sk- prefix (OpenAI key prefix).
  const hasSkPrefix = value.includes("sk-");
  // Detect secret/token/password only in assignment context (e.g. "secret=abc"),
  // NOT as standalone English words in governance statements.
  const hasSecretAssignment =
    value.includes("secret=") ||
    value.includes("token=") ||
    value.includes("password=");
  return hasAssignment || hasSkPrefix || hasSecretAssignment;
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

const DOCUMENT_MARKERS = [
  "Aktenzeichen",
  "BG-Nr",
  "Steuer-ID",
  "IBAN",
  "Sehr geehrter",
];

function containsDocumentMarker(value: string): boolean {
  return DOCUMENT_MARKERS.some((m) => value.includes(m));
}

function isValidIso(value: string): boolean {
  if (!value || value.trim() === "") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function addReason(
  list: RealEnvironmentAttestationRejectionReason[],
  reason: RealEnvironmentAttestationRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ───────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `RealEnvironmentAttestationInput` for use in the
 * harness check. Contains no real env values, secrets, or sensitive content.
 */
export function buildSyntheticRealEnvironmentAttestationInput(): RealEnvironmentAttestationInput {
  const operatorStatement =
    "I confirm the required environment variable names were reviewed without exposing values. " +
    "I understand this does not authorize real pilot execution. " +
    "I understand public launch, live LLM runtime, and persistence remain blocked.";

  const reviewerStatement =
    "I confirm no environment values or secrets were read, printed, or stored by this contract. " +
    "I understand this does not authorize real pilot execution. " +
    "I understand public launch, live LLM runtime, and persistence remain blocked.";

  return {
    attestationId: "real-environment-attestation-8-2m-2",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",
    environmentName: "internal_test_environment",

    identityContractReady: true,
    operatorHumanId: "operator-internal-001",
    reviewerHumanId: "reviewer-internal-001",

    attestedEnvVarNames: [...REQUIRED_REAL_PILOT_ENV_VAR_NAMES],
    checklistConfirmed: [...REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST],
    operatorAttestationStatement: operatorStatement,
    reviewerAttestationStatement: reviewerStatement,
    attestedAtIso: "2026-06-12T00:00:00.000Z",
    notes: ["synthetic safe environment attestation without values"],

    envValuesReadByCode: false,
    envValuesPrinted: false,
    envValuesStored: false,
    secretValuesPrinted: false,
    secretValuesStored: false,
    containsEnvValue: false,
    containsSecret: false,
    containsApiKey: false,

    containsRealUserInput: false,
    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsModelOutput: false,
    containsUserPii: false,
    containsDocumentContent: false,

    persistenceUsed: false,
    publicRuntimeEnabled: false,
    liveLLMCalled: false,
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,

    neverUserVisible: true,
  };
}

// ── Validator ──────────────────────────────────────────────────────────────────

/**
 * Validates a `RealEnvironmentAttestationInput` and returns a typed
 * `RealEnvironmentAttestationResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateRealEnvironmentAttestationInput(
  input: RealEnvironmentAttestationInput,
): RealEnvironmentAttestationResult {
  const reasons: RealEnvironmentAttestationRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: identity contract ready ─────────────────────────────────────────
  if (!input.identityContractReady) {
    addReason(reasons, "identity_contract_not_ready");
  }

  // ── Rule 2: valid environment name ───────────────────────────────────────────
  if (!VALID_ENV_NAMES.includes(input.environmentName)) {
    addReason(reasons, "missing_environment_name");
  }

  // ── Rule 3: non-empty pilotSessionId ────────────────────────────────────────
  if (!input.pilotSessionId || input.pilotSessionId.trim() === "") {
    addReason(reasons, "missing_pilot_session_id");
  }

  // ── Rule 4: non-empty operatorHumanId ───────────────────────────────────────
  if (!input.operatorHumanId || input.operatorHumanId.trim() === "") {
    addReason(reasons, "missing_operator_identity_reference");
  }

  // ── Rule 5: non-empty reviewerHumanId ───────────────────────────────────────
  if (!input.reviewerHumanId || input.reviewerHumanId.trim() === "") {
    addReason(reasons, "missing_reviewer_identity_reference");
  }

  // ── Rule 6: all required env var names attested ──────────────────────────────
  for (const name of REQUIRED_REAL_PILOT_ENV_VAR_NAMES) {
    if (!input.attestedEnvVarNames.includes(name)) {
      addReason(reasons, "missing_required_env_name_attestation");
      break;
    }
  }

  // ── Rule 7: all checklist items confirmed ────────────────────────────────────
  for (const item of REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 8: required attestation statements ──────────────────────────────────
  const stmt0 = REQUIRED_REAL_ENVIRONMENT_ATTESTATION_STATEMENTS[0];
  const stmt1 = REQUIRED_REAL_ENVIRONMENT_ATTESTATION_STATEMENTS[1];
  if (stmt0 && !input.operatorAttestationStatement.includes(stmt0)) {
    addReason(reasons, "missing_required_checklist_item");
  }
  if (stmt1 && !input.reviewerAttestationStatement.includes(stmt1)) {
    addReason(reasons, "missing_required_checklist_item");
  }

  // ── Rule 9: valid ISO date ───────────────────────────────────────────────────
  if (!isValidIso(input.attestedAtIso)) {
    addReason(reasons, "identity_contract_not_ready");
  }

  // ── Rule 10: env value / secret literal flags must be false ──────────────────
  if (inputRec["envValuesReadByCode"] === true) {
    addReason(reasons, "env_value_read_claim_detected");
  }
  if (inputRec["envValuesPrinted"] === true) {
    addReason(reasons, "env_value_print_claim_detected");
  }
  if (inputRec["envValuesStored"] === true) {
    addReason(reasons, "env_value_storage_claim_detected");
  }
  if (inputRec["secretValuesPrinted"] === true) {
    addReason(reasons, "secret_print_claim_detected");
  }
  if (inputRec["secretValuesStored"] === true) {
    addReason(reasons, "secret_storage_claim_detected");
  }

  // ── Rule 11: contains* env/secret/key flags ──────────────────────────────────
  if (inputRec["containsEnvValue"] === true) {
    addReason(reasons, "forbidden_env_value_detected");
  }
  if (inputRec["containsSecret"] === true) {
    addReason(reasons, "forbidden_secret_detected");
  }
  if (inputRec["containsApiKey"] === true) {
    addReason(reasons, "forbidden_api_key_detected");
  }

  // ── Rule 12: content/PII/document flags ─────────────────────────────────────
  if (inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "real_user_input_detected");
  }
  if (
    inputRec["containsRawInputText"] === true ||
    inputRec["containsRedactedText"] === true ||
    inputRec["containsFullDraftText"] === true ||
    inputRec["containsModelOutput"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsUserPii"] === true) {
    addReason(reasons, "forbidden_pii_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rule 13: runtime safety flags ───────────────────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["liveLLMCalled"] === true) {
    addReason(reasons, "live_llm_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }
  if (
    inputRec["emittedToUserNow"] === true ||
    inputRec["userVisibleOutputAllowed"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rules 14-17: scan string fields for forbidden content ────────────────────
  const allTextFields = [
    input.attestationId,
    input.pilotSessionId,
    input.operatorHumanId,
    input.reviewerHumanId,
    input.operatorAttestationStatement,
    input.reviewerAttestationStatement,
    input.attestedAtIso,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      // Categorise by which forbidden string matched
      if (s.includes("sk-") || s.includes("internalSecret") || s.includes("apiKey")) {
        addReason(reasons, "forbidden_secret_detected");
      } else if (
        s.includes("process.env") ||
        s.includes("OPENAI_API_KEY=") ||
        s.includes("VAYLO_INTERNAL_RUNTIME_SECRET=") ||
        s.includes("VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST=") ||
        s.includes("VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST=") ||
        s.includes("OPENAI_SMART_TALK_MODEL=")
      ) {
        addReason(reasons, "forbidden_env_value_detected");
      } else if (
        s.includes("rawInputText") ||
        s.includes("redactedText") ||
        s.includes("fullDraftText") ||
        s.includes("modelOutput") ||
        s.includes("SYNTHETIC_TEXT_NEVER_REAL_USER_DATA")
      ) {
        addReason(reasons, "forbidden_raw_text_detected");
      } else if (
        s.includes("IBAN") ||
        s.includes("Steuer-ID") ||
        s.includes("Aktenzeichen") ||
        s.includes("Sehr geehrter") ||
        s.includes("BG-Nr")
      ) {
        addReason(reasons, "forbidden_document_content_detected");
      } else {
        addReason(reasons, "unsafe_attestation_note_detected");
      }
    }

    if (containsEnvAssignment(s)) {
      addReason(reasons, "forbidden_env_value_detected");
    }

    if (containsPiiPattern(s)) {
      addReason(reasons, "forbidden_pii_detected");
    }

    if (containsDocumentMarker(s)) {
      addReason(reasons, "forbidden_document_content_detected");
    }
  }

  // ── Build result ─────────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    attestationId: input.attestationId,
    status,
    accepted,
    rejectionReasons: reasons,

    safeEnvironmentMetadata: {
      pilotSessionId: input.pilotSessionId,
      environmentName: input.environmentName,
      operatorHumanId: input.operatorHumanId,
      reviewerHumanId: input.reviewerHumanId,
      attestedEnvVarNames: input.attestedEnvVarNames,
      checklistPassedCount: input.checklistConfirmed.length,
      attestedAtIso: input.attestedAtIso,
    },

    readyForAbortProtocol: accepted,
    readyForRealInputPolicy: accepted,
    readyForEvidencePolicy: accepted,
    readyForPostRunAuditPlanning: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    envValueStored: false,
    secretStored: false,
    apiKeyStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByEnvironmentAttestation: false,
    uiTouched: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Contract check ─────────────────────────────────────────────────────────────

/**
 * Runs the full Real Environment Attestation Contract check for Phase 8.2M-2.
 *
 * Calls `runOperatorReviewerIdentityContractCheck()` (8.2M-1), validates a
 * synthetic safe attestation input, and runs 26 tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runRealEnvironmentAttestationContractCheck(): RealEnvironmentAttestationCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-1 identity contract ───────────────────────────

  const identityCheck = runOperatorReviewerIdentityContractCheck();
  const idRec = asRec(identityCheck);

  const identityContractReady =
    identityCheck.allPassed === true &&
    identityCheck.readyForRealEnvironmentAttestationContract === true &&
    idRec["readyForRealOperatorPilotRun"] !== true &&
    idRec["readyForPilotRunNow"] !== true &&
    idRec["readyForPublicLaunch"] !== true &&
    idRec["readyForLiveLLMRuntime"] !== true &&
    idRec["readyForPersistence"] !== true &&
    idRec["realPilotRunExecuted"] !== true &&
    idRec["realUserInputProcessed"] !== true &&
    idRec["liveLLMCalled"] !== true &&
    idRec["persistenceUsed"] !== true &&
    idRec["emittedToUserNow"] !== true &&
    idRec["neverUserVisible"] === true;

  notes.push(`identityContractReady: ${String(identityContractReady)}`);
  notes.push(`identityCheck.allPassed: ${String(identityCheck.allPassed)}`);
  notes.push(
    `identityCheck.readyForRealEnvironmentAttestationContract: ${String(identityCheck.readyForRealEnvironmentAttestationContract)}`,
  );

  // ── Step 2: Validate the synthetic safe attestation input ─────────────────

  const syntheticInput = buildSyntheticRealEnvironmentAttestationInput();
  const syntheticResult = validateRealEnvironmentAttestationInput(syntheticInput);
  const syntheticAttestationAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticAttestationAccepted: ${String(syntheticAttestationAccepted)}`,
  );
  if (!syntheticAttestationAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases (26) — all must be rejected ─────────────────────

  type MutableInput = {
    -readonly [K in keyof RealEnvironmentAttestationInput]: RealEnvironmentAttestationInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): RealEnvironmentAttestationResult {
    return validateRealEnvironmentAttestationInput({
      ...syntheticInput,
      ...overrides,
    } as RealEnvironmentAttestationInput);
  }

  // Partial env var name list (missing last item)
  const partialEnvNames = REQUIRED_REAL_PILOT_ENV_VAR_NAMES.slice(
    0,
    REQUIRED_REAL_PILOT_ENV_VAR_NAMES.length - 1,
  ) as unknown as RequiredRealPilotEnvironmentVariableName[];

  // Partial checklist (missing last item)
  const partialChecklist = REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST.slice(
    0,
    REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{
    label: string;
    result: RealEnvironmentAttestationResult;
  }> = [
    // 1. identityContractReady false
    { label: "identityContractReady=false", result: tamper({ identityContractReady: false }) },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operatorHumanId
    { label: "empty operatorHumanId", result: tamper({ operatorHumanId: "" }) },
    // 4. empty reviewerHumanId
    { label: "empty reviewerHumanId", result: tamper({ reviewerHumanId: "" }) },
    // 5. missing one required env var name
    { label: "missing env var name", result: tamper({ attestedEnvVarNames: partialEnvNames }) },
    // 6. missing one checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 7. invalid attestedAtIso
    { label: "invalid ISO", result: tamper({ attestedAtIso: "not-a-date" }) },
    // 8. envValuesReadByCode true
    {
      label: "envValuesReadByCode=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        envValuesReadByCode: true as unknown as false,
      }),
    },
    // 9. envValuesPrinted true
    {
      label: "envValuesPrinted=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        envValuesPrinted: true as unknown as false,
      }),
    },
    // 10. envValuesStored true
    {
      label: "envValuesStored=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        envValuesStored: true as unknown as false,
      }),
    },
    // 11. secretValuesPrinted true
    {
      label: "secretValuesPrinted=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        secretValuesPrinted: true as unknown as false,
      }),
    },
    // 12. secretValuesStored true
    {
      label: "secretValuesStored=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        secretValuesStored: true as unknown as false,
      }),
    },
    // 13. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 14. containsSecret true
    {
      label: "containsSecret=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 15. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 16. notes includes "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 17. notes includes "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc123"] }) },
    // 18. notes includes "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 19. notes includes "john@example.com"
    { label: 'notes: email', result: tamper({ notes: ["contact john@example.com"] }) },
    // 20. notes includes "+49 170 1234567"
    { label: 'notes: phone', result: tamper({ notes: ["call +49 170 1234567"] }) },
    // 21. notes includes "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 22. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 23. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 24. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 25. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 26. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validateRealEnvironmentAttestationInput({
        ...syntheticInput,
        emittedToUserNow: true as unknown as false,
      }),
    },
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
    identityContractReady && syntheticAttestationAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-2",
    allPassed,
    identityContractReady,
    syntheticAttestationAccepted,
    tamperCasesRejected,

    readyForAbortProtocol: allPassed,
    readyForRealInputPolicy: allPassed,
    readyForEvidencePolicy: allPassed,
    readyForPostRunAuditPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    envValuesReadByCode: false,
    envValuesPrinted: false,
    envValuesStored: false,
    secretValuesPrinted: false,
    secretValuesStored: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
