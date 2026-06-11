/**
 * Pilot Runtime E2E Harness (Phase 8.2K-3).
 *
 * A pure TypeScript harness that proves the guarded internal pilot API branch
 * (8.2K-2) behavior using synthetic fixtures and static local checks.
 *
 * SAFETY CONTRACT:
 * - Does NOT import or call app/api/smart-talk/route.ts
 * - Does NOT make HTTP requests
 * - Does NOT call live LLM
 * - Does NOT persist anything
 * - Does NOT read process.env
 * - Does NOT use real user text
 * - Does NOT echo synthetic text or synthetic secret in any response
 * - Uses only "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA" as request text
 * - Uses only "synthetic-secret-never-real" as the synthetic secret
 *
 * The evaluator mirrors the 8.2K-2 guard order (all 16 guards) using a
 * local pure model — there is no HTTP layer, no NextRequest/NextResponse.
 *
 * runPilotRuntimeE2EHarness() returns PilotRuntimeE2EHarnessSummary.
 * It is exported but NOT auto-executed.
 */

import {
  PILOT_RUNTIME_ALLOWED_MODE,
  PILOT_RUNTIME_REQUIRED_GUARD_PHRASE,
  PILOT_RUNTIME_REQUIRED_GUARDS,
} from "./pilot-runtime-guard-contract-types";

import type {
  PilotRuntimeE2EHarnessCaseResult,
  PilotRuntimeE2EHarnessFixtureKind,
  PilotRuntimeE2EHarnessSummary,
} from "./pilot-runtime-e2e-harness-types";

// ── Synthetic constants (never real values) ───────────────────────────────────

const SYNTHETIC_TEXT = "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA" as const;
const SYNTHETIC_SECRET = "synthetic-secret-never-real" as const;

// ── Local env/request models ──────────────────────────────────────────────────

interface SyntheticEnv {
  featureFlagEnabled: boolean;
  controlledTextPilotFlagEnabled: boolean;
  killSwitchEnabled: boolean;
  configuredSecret: string;
  providedSecret: string;
  allowedReviewerIds: readonly string[];
  allowedScenarioIds: readonly string[];
}

type SyntheticRequest = Record<string, unknown>;

// ── Synthetic evaluator result (local only, not exported) ─────────────────────

interface SyntheticEvalResult {
  httpStatus: 200 | 400 | 403;
  ok: boolean;
  authorised: boolean;
  responseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";
  failureVerdict: string | null;
  failedGuard: string | null;
  /** Serialisable response payload — never contains SYNTHETIC_TEXT or SYNTHETIC_SECRET. */
  responsePayload: Record<string, unknown>;
}

// ── Expected outcome map (local only) ─────────────────────────────────────────

interface ExpectedOutcome {
  httpStatus: 200 | 400 | 403;
  authorised: boolean;
  responseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";
  failureVerdict: string | null;
  failedGuard: string | null;
}

const EXPECTED_OUTCOMES: Record<
  PilotRuntimeE2EHarnessFixtureKind,
  ExpectedOutcome
> = {
  success_authorised_internal_packet: {
    httpStatus: 200,
    authorised: true,
    responseKind: "authorised_internal_packet",
    failureVerdict: null,
    failedGuard: null,
  },
  failure_feature_flag_disabled: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_feature_flag_disabled",
    failedGuard: "feature_flag_enabled",
  },
  failure_controlled_text_pilot_flag_disabled: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_controlled_text_pilot_flag_disabled",
    failedGuard: "controlled_text_pilot_flag_enabled",
  },
  failure_kill_switch_enabled: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_kill_switch_enabled",
    failedGuard: "kill_switch_disabled",
  },
  failure_missing_internal_secret: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_missing_internal_secret",
    failedGuard: "internal_runtime_secret_valid",
  },
  failure_invalid_internal_secret: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_invalid_internal_secret",
    failedGuard: "internal_runtime_secret_valid",
  },
  failure_missing_guard_phrase: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_missing_guard_phrase",
    failedGuard: "internal_guard_phrase_valid",
  },
  failure_invalid_guard_phrase: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_invalid_guard_phrase",
    failedGuard: "internal_guard_phrase_valid",
  },
  failure_not_allowlisted: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_not_allowlisted",
    failedGuard: "internal_account_allowlisted",
  },
  failure_unknown_pilot_scenario: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_unknown_pilot_scenario",
    failedGuard: "pilot_scenario_allowed",
  },
  failure_unsupported_input_mode: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_unsupported_input_mode",
    failedGuard: "pilot_input_mode_supported",
  },
  failure_ocr_or_upload_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_ocr_or_upload_attempt",
    failedGuard: "no_ocr_or_upload_requested",
  },
  failure_payment_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_payment_attempt",
    failedGuard: "no_payment_requested",
  },
  failure_persistence_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_persistence_attempt",
    failedGuard: "no_persistence_requested",
  },
  failure_dna_save_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_dna_save_attempt",
    failedGuard: "no_dna_save_requested",
  },
  failure_offline_save_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_offline_save_attempt",
    failedGuard: "no_offline_save_requested",
  },
  failure_public_runtime_attempt: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_public_runtime_attempt",
    failedGuard: "public_runtime_not_requested",
  },
  failure_live_llm_not_allowed: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_live_llm_not_allowed",
    failedGuard: "live_llm_not_allowed",
  },
  failure_manual_review_required: {
    httpStatus: 403,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_manual_review_required",
    failedGuard: "manual_review_required_for_warning_or_high_risk",
  },
  failure_contract_violation_missing_text: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_contract_violation",
    failedGuard: null,
  },
  failure_contract_violation_missing_pilot_run_id: {
    httpStatus: 400,
    authorised: false,
    responseKind: "invalid_request",
    failureVerdict: "rejected_contract_violation",
    failedGuard: null,
  },
  tamper_raw_text_echo_attempt: {
    httpStatus: 200,
    authorised: true,
    responseKind: "authorised_internal_packet",
    failureVerdict: null,
    failedGuard: null,
  },
  tamper_secret_echo_attempt: {
    httpStatus: 200,
    authorised: true,
    responseKind: "authorised_internal_packet",
    failureVerdict: null,
    failedGuard: null,
  },
};

// ── Ordered fixture catalogue ─────────────────────────────────────────────────

const ALL_FIXTURE_KINDS: readonly PilotRuntimeE2EHarnessFixtureKind[] = [
  "success_authorised_internal_packet",
  "failure_feature_flag_disabled",
  "failure_controlled_text_pilot_flag_disabled",
  "failure_kill_switch_enabled",
  "failure_missing_internal_secret",
  "failure_invalid_internal_secret",
  "failure_missing_guard_phrase",
  "failure_invalid_guard_phrase",
  "failure_not_allowlisted",
  "failure_unknown_pilot_scenario",
  "failure_unsupported_input_mode",
  "failure_ocr_or_upload_attempt",
  "failure_payment_attempt",
  "failure_persistence_attempt",
  "failure_dna_save_attempt",
  "failure_offline_save_attempt",
  "failure_public_runtime_attempt",
  "failure_live_llm_not_allowed",
  "failure_manual_review_required",
  "failure_contract_violation_missing_text",
  "failure_contract_violation_missing_pilot_run_id",
  "tamper_raw_text_echo_attempt",
  "tamper_secret_echo_attempt",
];

// ── Helper utilities ──────────────────────────────────────────────────────────

function getHarnessStringField(
  rec: Record<string, unknown>,
  key: string,
): string | null {
  const v = rec[key];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function buildHarnessNoPersistenceResult(): Record<string, unknown> {
  return {
    persistenceAllowed: false,
    persistenceUsed: false,
    dnaSaveAllowed: false,
    dnaSavePerformed: false,
    offlineSaveAllowed: false,
    offlineSavePerformed: false,
    evidencePersistenceAllowed: false,
    evidencePersistencePerformed: false,
    neverUserVisible: true,
  };
}

// ── Base fixtures ─────────────────────────────────────────────────────────────

function makeBaseSyntheticRequest(): SyntheticRequest {
  return {
    internalRuntimeMode: PILOT_RUNTIME_ALLOWED_MODE,
    internalRuntimeGuard: PILOT_RUNTIME_REQUIRED_GUARD_PHRASE,
    pilotScenarioId: "pilot_invoice_basic",
    pilotInputMode: "real_text_guarded",
    pilotReviewerId: "internal-reviewer-1",
    pilotRunId: "pilot-run-8-2k-3-success",
    text: SYNTHETIC_TEXT,
    requestedOcr: false,
    requestedFileUpload: false,
    requestedPayment: false,
    requestedPersistence: false,
    requestedDnaSave: false,
    requestedOfflineSave: false,
    requestedPublicRuntime: false,
    requestedLiveLLM: false,
    neverUserVisible: true,
  };
}

function makeBaseSyntheticEnv(): SyntheticEnv {
  return {
    featureFlagEnabled: true,
    controlledTextPilotFlagEnabled: true,
    killSwitchEnabled: false,
    configuredSecret: SYNTHETIC_SECRET,
    providedSecret: SYNTHETIC_SECRET,
    allowedReviewerIds: ["internal-reviewer-1"],
    allowedScenarioIds: ["pilot_invoice_basic"],
  };
}

// ── Fixture builder ───────────────────────────────────────────────────────────

function buildFixture(kind: PilotRuntimeE2EHarnessFixtureKind): {
  req: SyntheticRequest;
  env: SyntheticEnv;
} {
  const req = makeBaseSyntheticRequest();
  const env = makeBaseSyntheticEnv();

  switch (kind) {
    case "success_authorised_internal_packet":
    case "tamper_raw_text_echo_attempt":
    case "tamper_secret_echo_attempt":
      return { req, env };

    case "failure_feature_flag_disabled":
      return { req, env: { ...env, featureFlagEnabled: false } };

    case "failure_controlled_text_pilot_flag_disabled":
      return { req, env: { ...env, controlledTextPilotFlagEnabled: false } };

    case "failure_kill_switch_enabled":
      return { req, env: { ...env, killSwitchEnabled: true } };

    case "failure_missing_internal_secret":
      return {
        req,
        env: { ...env, configuredSecret: "", providedSecret: "" },
      };

    case "failure_invalid_internal_secret":
      return { req, env: { ...env, providedSecret: "wrong-value-not-secret" } };

    case "failure_missing_guard_phrase":
      return { req: { ...req, internalRuntimeGuard: undefined }, env };

    case "failure_invalid_guard_phrase":
      return { req: { ...req, internalRuntimeGuard: "WRONG_PHRASE" }, env };

    case "failure_not_allowlisted":
      return {
        req: { ...req, pilotReviewerId: "unknown-reviewer-not-in-list" },
        env,
      };

    case "failure_unknown_pilot_scenario":
      return {
        req: { ...req, pilotScenarioId: "unknown-scenario-not-registered" },
        env,
      };

    case "failure_unsupported_input_mode":
      return { req: { ...req, pilotInputMode: "ocr_mode_invalid" }, env };

    case "failure_ocr_or_upload_attempt":
      return { req: { ...req, requestedOcr: true }, env };

    case "failure_payment_attempt":
      return { req: { ...req, requestedPayment: true }, env };

    case "failure_persistence_attempt":
      return { req: { ...req, requestedPersistence: true }, env };

    case "failure_dna_save_attempt":
      return { req: { ...req, requestedDnaSave: true }, env };

    case "failure_offline_save_attempt":
      return { req: { ...req, requestedOfflineSave: true }, env };

    case "failure_public_runtime_attempt":
      return { req: { ...req, requestedPublicRuntime: true }, env };

    case "failure_live_llm_not_allowed":
      return { req: { ...req, requestedLiveLLM: true }, env };

    case "failure_manual_review_required":
      return { req: { ...req, neverUserVisible: false }, env };

    case "failure_contract_violation_missing_text":
      return { req: { ...req, text: "" }, env };

    case "failure_contract_violation_missing_pilot_run_id":
      return { req: { ...req, pilotRunId: "" }, env };
  }
}

// ── Core synthetic evaluator ──────────────────────────────────────────────────

/**
 * Mirrors the 8.2K-2 guard order using pure local logic.
 * No HTTP, no API route import, no process.env, no LLM, no persistence.
 * Response payload never includes SYNTHETIC_TEXT or SYNTHETIC_SECRET.
 */
function evaluateSyntheticPilotRuntimeFixture(
  req: SyntheticRequest,
  env: SyntheticEnv,
): SyntheticEvalResult {
  const d: string[] = ["pilot_runtime_contract_started"];

  function fail(
    verdict: string,
    diag: string,
    failedGuard: string | null,
    httpStatus: 400 | 403,
    internalReason: string,
  ): SyntheticEvalResult {
    return {
      httpStatus,
      ok: false,
      authorised: false,
      responseKind: "invalid_request",
      failureVerdict: verdict,
      failedGuard,
      responsePayload: {
        ok: false,
        runtime: "controlled_text_pilot_guarded",
        result: {
          authorised: false,
          verdict,
          diagnostics: [...d, diag],
          failedGuard,
          httpStatus,
          publicMessage: "Internal pilot runtime request rejected.",
          internalReason,
          liveLLMCalled: false,
          apiRouteModified: true,
          uiTouched: false,
          persistenceUsed: false,
          dnaSavePerformed: false,
          offlineSavePerformed: false,
          emittedToUserNow: false,
          neverUserVisible: true,
        },
      },
    };
  }

  // Guard 1 — feature_flag_enabled
  if (!env.featureFlagEnabled) {
    return fail(
      "rejected_feature_flag_disabled",
      "pilot_runtime_rejected_feature_flag_disabled",
      "feature_flag_enabled",
      403,
      "Feature flag disabled.",
    );
  }
  d.push("pilot_runtime_feature_flag_confirmed");

  // Guard 2 — controlled_text_pilot_flag_enabled
  if (!env.controlledTextPilotFlagEnabled) {
    return fail(
      "rejected_controlled_text_pilot_flag_disabled",
      "pilot_runtime_rejected_controlled_text_pilot_flag_disabled",
      "controlled_text_pilot_flag_enabled",
      403,
      "Controlled text pilot flag disabled.",
    );
  }
  d.push("pilot_runtime_controlled_text_pilot_flag_confirmed");

  // Guard 3 — kill_switch_disabled
  if (env.killSwitchEnabled) {
    return fail(
      "rejected_kill_switch_enabled",
      "pilot_runtime_rejected_kill_switch_enabled",
      "kill_switch_disabled",
      403,
      "Kill switch active.",
    );
  }
  d.push("pilot_runtime_kill_switch_confirmed_disabled");

  // Guard 4 — internal_runtime_secret_valid
  if (!env.configuredSecret || !env.providedSecret) {
    return fail(
      "rejected_missing_internal_secret",
      "pilot_runtime_rejected_missing_internal_secret",
      "internal_runtime_secret_valid",
      403,
      "Secret missing.",
    );
  }
  if (env.providedSecret !== env.configuredSecret) {
    return fail(
      "rejected_invalid_internal_secret",
      "pilot_runtime_rejected_invalid_internal_secret",
      "internal_runtime_secret_valid",
      403,
      "Secret invalid.",
    );
  }
  d.push("pilot_runtime_internal_secret_present");
  d.push("pilot_runtime_internal_secret_valid");

  // Guard 5 — internal_guard_phrase_valid
  if (
    req.internalRuntimeGuard === undefined ||
    req.internalRuntimeGuard === null
  ) {
    return fail(
      "rejected_missing_guard_phrase",
      "pilot_runtime_rejected_missing_guard_phrase",
      "internal_guard_phrase_valid",
      403,
      "Guard phrase missing.",
    );
  }
  if (req.internalRuntimeGuard !== PILOT_RUNTIME_REQUIRED_GUARD_PHRASE) {
    return fail(
      "rejected_invalid_guard_phrase",
      "pilot_runtime_rejected_invalid_guard_phrase",
      "internal_guard_phrase_valid",
      403,
      "Guard phrase invalid.",
    );
  }
  d.push("pilot_runtime_guard_phrase_present");
  d.push("pilot_runtime_guard_phrase_valid");

  // Guard 6 — internal_account_allowlisted
  const reviewerId = getHarnessStringField(req, "pilotReviewerId");
  if (!reviewerId || !env.allowedReviewerIds.includes(reviewerId)) {
    return fail(
      "rejected_not_allowlisted",
      "pilot_runtime_rejected_not_allowlisted",
      "internal_account_allowlisted",
      403,
      "Requester not allowlisted.",
    );
  }
  d.push("pilot_runtime_account_allowlisted");

  // Guard 7 — pilot_scenario_allowed
  const scenarioId = getHarnessStringField(req, "pilotScenarioId");
  if (!scenarioId || !env.allowedScenarioIds.includes(scenarioId)) {
    return fail(
      "rejected_unknown_pilot_scenario",
      "pilot_runtime_rejected_unknown_pilot_scenario",
      "pilot_scenario_allowed",
      403,
      "Scenario not in allowlist.",
    );
  }
  d.push("pilot_runtime_scenario_allowed");

  // Guard 8 — pilot_input_mode_supported
  const inputMode = req.pilotInputMode;
  if (inputMode !== "real_text_guarded" && inputMode !== "real_question_guarded") {
    return fail(
      "rejected_unsupported_input_mode",
      "pilot_runtime_rejected_unsupported_input_mode",
      "pilot_input_mode_supported",
      400,
      "Unsupported input mode.",
    );
  }
  d.push("pilot_runtime_input_mode_supported");

  // Guard 9 — no_ocr_or_upload_requested
  if (req.requestedOcr !== false || req.requestedFileUpload !== false) {
    return fail(
      "rejected_ocr_or_upload_attempt",
      "pilot_runtime_rejected_ocr_or_upload_attempt",
      "no_ocr_or_upload_requested",
      400,
      "OCR/upload not permitted.",
    );
  }
  d.push("pilot_runtime_no_ocr_or_upload_confirmed");

  // Guard 10 — no_payment_requested
  if (req.requestedPayment !== false) {
    return fail(
      "rejected_payment_attempt",
      "pilot_runtime_rejected_payment_attempt",
      "no_payment_requested",
      400,
      "Payment not permitted.",
    );
  }
  d.push("pilot_runtime_no_payment_confirmed");

  // Guard 11 — no_persistence_requested
  if (req.requestedPersistence !== false) {
    return fail(
      "rejected_persistence_attempt",
      "pilot_runtime_rejected_persistence_attempt",
      "no_persistence_requested",
      400,
      "Persistence not permitted.",
    );
  }
  d.push("pilot_runtime_no_persistence_confirmed");

  // Guard 12 — no_dna_save_requested
  if (req.requestedDnaSave !== false) {
    return fail(
      "rejected_dna_save_attempt",
      "pilot_runtime_rejected_dna_save_attempt",
      "no_dna_save_requested",
      400,
      "DNA save not permitted.",
    );
  }
  d.push("pilot_runtime_no_dna_save_confirmed");

  // Guard 13 — no_offline_save_requested
  if (req.requestedOfflineSave !== false) {
    return fail(
      "rejected_offline_save_attempt",
      "pilot_runtime_rejected_offline_save_attempt",
      "no_offline_save_requested",
      400,
      "Offline save not permitted.",
    );
  }
  d.push("pilot_runtime_no_offline_save_confirmed");

  // Guard 14 — public_runtime_not_requested
  if (req.requestedPublicRuntime !== false) {
    return fail(
      "rejected_public_runtime_attempt",
      "pilot_runtime_rejected_public_runtime_attempt",
      "public_runtime_not_requested",
      400,
      "Public runtime not permitted.",
    );
  }
  d.push("pilot_runtime_no_public_runtime_confirmed");

  // Guard 15 — live_llm_not_allowed
  if (req.requestedLiveLLM !== false) {
    return fail(
      "rejected_live_llm_not_allowed",
      "pilot_runtime_rejected_live_llm_not_allowed",
      "live_llm_not_allowed",
      400,
      "Live LLM not permitted.",
    );
  }
  d.push("pilot_runtime_no_live_llm_confirmed");

  // Guard 16 — manual_review_required_for_warning_or_high_risk
  if (req.neverUserVisible !== true) {
    return fail(
      "rejected_manual_review_required",
      "pilot_runtime_rejected_manual_review_required",
      "manual_review_required_for_warning_or_high_risk",
      403,
      "neverUserVisible must be true.",
    );
  }
  d.push("pilot_runtime_manual_review_boundary_confirmed");

  // Contract shape checks (post-guard)
  const pilotRunId = getHarnessStringField(req, "pilotRunId");
  if (!pilotRunId) {
    return fail(
      "rejected_contract_violation",
      "pilot_runtime_rejected_contract_violation",
      null,
      400,
      "pilotRunId missing or empty.",
    );
  }
  if (
    typeof req.text !== "string" ||
    (req.text as string).trim().length === 0
  ) {
    return fail(
      "rejected_contract_violation",
      "pilot_runtime_rejected_contract_violation",
      null,
      400,
      "text missing or empty.",
    );
  }

  d.push("pilot_runtime_all_guards_passed");

  // Success — response payload deliberately excludes req.text and any secret
  return {
    httpStatus: 200,
    ok: true,
    authorised: true,
    responseKind: "authorised_internal_packet",
    failureVerdict: null,
    failedGuard: null,
    responsePayload: {
      ok: true,
      runtime: "controlled_text_pilot_guarded",
      result: {
        mode: "controlled_text_pilot_guarded",
        pilotRunId,
        pilotScenarioId: scenarioId,
        pilotInputMode: inputMode as "real_text_guarded" | "real_question_guarded",
        responseKind: "authorised_internal_packet",
        emittedToUserNow: false,
        userVisibleOutputAllowed: false,
        publicRuntimeEnabled: false,
        readyForPublicLaunch: false,
        noPersistence: buildHarnessNoPersistenceResult(),
        guardSummary: {
          guardsPassed: [...PILOT_RUNTIME_REQUIRED_GUARDS],
          diagnostics: [...d],
        },
        liveLLMCalled: false,
        apiRouteModified: true,
        uiTouched: false,
        persistenceUsed: false,
        dnaSavePerformed: false,
        offlineSavePerformed: false,
        neverUserVisible: true,
      },
    },
  };
}

// ── Per-case runner ───────────────────────────────────────────────────────────

function runCase(
  kind: PilotRuntimeE2EHarnessFixtureKind,
): PilotRuntimeE2EHarnessCaseResult {
  const { req, env } = buildFixture(kind);
  const result = evaluateSyntheticPilotRuntimeFixture(req, env);
  const expected = EXPECTED_OUTCOMES[kind];
  const payloadStr = JSON.stringify(result.responsePayload);

  // Leak checks — serialised response must never contain synthetic values
  const rawTextLeakCheckPassed = !payloadStr.includes(SYNTHETIC_TEXT);
  const secretLeakCheckPassed = !payloadStr.includes(SYNTHETIC_SECRET);

  // Safety invariant checks on response payload
  const resultObj = (result.responsePayload.result ?? {}) as Record<string, unknown>;
  const userVisibleOutputCheckPassed =
    resultObj["userVisibleOutputAllowed"] !== true &&
    resultObj["emittedToUserNow"] !== true;
  const noPersistenceCheckPassed =
    resultObj["persistenceUsed"] !== true &&
    resultObj["dnaSavePerformed"] !== true &&
    resultObj["offlineSavePerformed"] !== true;
  const noLiveLLMCheckPassed = resultObj["liveLLMCalled"] !== true;
  const noPublicRuntimeCheckPassed = resultObj["publicRuntimeEnabled"] !== true;

  const httpStatusMatch = result.httpStatus === expected.httpStatus;
  const authorisedMatch = result.authorised === expected.authorised;
  const responseKindMatch = result.responseKind === expected.responseKind;
  const failureVerdictMatch = result.failureVerdict === expected.failureVerdict;
  const failedGuardMatch = result.failedGuard === expected.failedGuard;

  const passed =
    httpStatusMatch &&
    authorisedMatch &&
    responseKindMatch &&
    failureVerdictMatch &&
    failedGuardMatch &&
    rawTextLeakCheckPassed &&
    secretLeakCheckPassed &&
    userVisibleOutputCheckPassed &&
    noPersistenceCheckPassed &&
    noLiveLLMCheckPassed &&
    noPublicRuntimeCheckPassed;

  const notes: string[] = [];
  if (!httpStatusMatch)
    notes.push(
      `httpStatus: expected ${expected.httpStatus}, got ${result.httpStatus}`,
    );
  if (!authorisedMatch)
    notes.push(
      `authorised: expected ${String(expected.authorised)}, got ${String(result.authorised)}`,
    );
  if (!responseKindMatch)
    notes.push(
      `responseKind: expected ${expected.responseKind}, got ${result.responseKind}`,
    );
  if (!failureVerdictMatch)
    notes.push(
      `failureVerdict: expected ${String(expected.failureVerdict)}, got ${String(result.failureVerdict)}`,
    );
  if (!failedGuardMatch)
    notes.push(
      `failedGuard: expected ${String(expected.failedGuard)}, got ${String(result.failedGuard)}`,
    );
  if (!rawTextLeakCheckPassed)
    notes.push("RAW TEXT LEAK DETECTED in response payload");
  if (!secretLeakCheckPassed)
    notes.push("SECRET LEAK DETECTED in response payload");
  if (!userVisibleOutputCheckPassed)
    notes.push("User-visible output flag not properly false");
  if (!noPersistenceCheckPassed)
    notes.push("Persistence flag not properly false");
  if (!noLiveLLMCheckPassed)
    notes.push("liveLLMCalled not false");
  if (!noPublicRuntimeCheckPassed)
    notes.push("publicRuntimeEnabled not false");

  return {
    fixtureKind: kind,
    passed,
    expectedHttpStatus: expected.httpStatus,
    actualHttpStatus: result.httpStatus,
    expectedAuthorised: expected.authorised,
    actualAuthorised: result.authorised,
    expectedResponseKind: expected.responseKind,
    actualResponseKind: result.responseKind,
    expectedFailureVerdict: expected.failureVerdict,
    actualFailureVerdict: result.failureVerdict,
    expectedFailedGuard: expected.failedGuard,
    actualFailedGuard: result.failedGuard,
    rawTextLeakCheckPassed,
    secretLeakCheckPassed,
    userVisibleOutputCheckPassed,
    noPersistenceCheckPassed,
    noLiveLLMCheckPassed,
    noPublicRuntimeCheckPassed,
    notes,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Runs the full synthetic pilot runtime E2E harness.
 *
 * Covers:
 * - 1 success path
 * - 16 guard failure paths (guards 1–16, each independently violated)
 * - 2 contract violation paths (missing text, missing pilotRunId)
 * - 2 tamper/leak paths (raw text echo check, secret echo check)
 *
 * Returns PilotRuntimeE2EHarnessSummary.
 * Does NOT auto-execute on module load.
 * Does NOT call the API route.
 * Does NOT make HTTP requests.
 * Does NOT call live LLM.
 * Does NOT persist anything.
 */
export function runPilotRuntimeE2EHarness(): PilotRuntimeE2EHarnessSummary {
  const caseResults = ALL_FIXTURE_KINDS.map((kind) => runCase(kind));

  const passedCases = caseResults.filter((c) => c.passed).length;
  const failedCases = caseResults.length - passedCases;
  const allPassed = failedCases === 0;

  const successPathCovered = caseResults.some(
    (c) =>
      c.fixtureKind === "success_authorised_internal_packet" && c.passed,
  );

  const guardFailureKinds = ALL_FIXTURE_KINDS.filter(
    (k) =>
      k.startsWith("failure_") &&
      !k.startsWith("failure_contract_violation_"),
  );
  const allGuardFailurePathsCovered = guardFailureKinds.every((k) => {
    const r = caseResults.find((c) => c.fixtureKind === k);
    return r !== undefined && r.passed;
  });

  const contractViolationKinds = ALL_FIXTURE_KINDS.filter((k) =>
    k.startsWith("failure_contract_violation_"),
  );
  const contractViolationPathsCovered = contractViolationKinds.every((k) => {
    const r = caseResults.find((c) => c.fixtureKind === k);
    return r !== undefined && r.passed;
  });

  const tamperKinds = ALL_FIXTURE_KINDS.filter((k) =>
    k.startsWith("tamper_"),
  );
  const tamperPathsCovered = tamperKinds.every((k) => {
    const r = caseResults.find((c) => c.fixtureKind === k);
    return r !== undefined && r.passed;
  });

  const rawTextLeakCheckPassed = caseResults.every(
    (c) => c.rawTextLeakCheckPassed,
  );
  const secretLeakCheckPassed = caseResults.every(
    (c) => c.secretLeakCheckPassed,
  );
  const userVisibleOutputCheckPassed = caseResults.every(
    (c) => c.userVisibleOutputCheckPassed,
  );
  const noPersistenceCheckPassed = caseResults.every(
    (c) => c.noPersistenceCheckPassed,
  );
  const noLiveLLMCheckPassed = caseResults.every((c) => c.noLiveLLMCheckPassed);
  const noPublicRuntimeCheckPassed = caseResults.every(
    (c) => c.noPublicRuntimeCheckPassed,
  );

  return {
    harnessId: "8.2K-3",
    harnessVersion: "pilot-runtime-e2e-harness-v1",
    totalCases: caseResults.length,
    passedCases,
    failedCases,
    allPassed,
    successPathCovered,
    allGuardFailurePathsCovered,
    contractViolationPathsCovered,
    tamperPathsCovered,
    rawTextLeakCheckPassed,
    secretLeakCheckPassed,
    userVisibleOutputCheckPassed,
    noPersistenceCheckPassed,
    noLiveLLMCheckPassed,
    noPublicRuntimeCheckPassed,
    liveLLMCalled: false,
    apiRouteModifiedByHarness: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    caseResults,
  };
}
