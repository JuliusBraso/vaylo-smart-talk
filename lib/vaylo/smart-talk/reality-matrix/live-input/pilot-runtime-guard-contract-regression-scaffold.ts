/**
 * Pilot Runtime Guard Contract static regression scaffold (Phase 8.2K-1).
 *
 * Verifies the shape, literal-type invariants, and constant set sizes of the
 * pilot runtime guard contracts defined in pilot-runtime-guard-contract-types.ts.
 *
 * No Jest / Vitest / CI hooks.
 * No API calls or API route modification.
 * No live LLM calls.
 * No persistence or DB writes.
 * No actual user input processed.
 * No side effects.
 *
 * All checks are pure static / in-memory assertions on typed sample objects.
 */

import {
  PILOT_RUNTIME_ALLOWED_MODE,
  PILOT_RUNTIME_BLOCKED_CAPABILITIES,
  PILOT_RUNTIME_REQUIRED_GUARD_PHRASE,
  PILOT_RUNTIME_REQUIRED_GUARDS,
  type PilotNoPersistenceResult,
  type PilotRuntimeClosureAuditResult,
  type PilotRuntimeFailureResult,
  type PilotRuntimeGuardInput,
  type PilotRuntimeGuardSuccess,
  type PilotRuntimeRequest,
  type PilotRuntimeResponse,
} from "./pilot-runtime-guard-contract-types";

// ── Scaffold types ────────────────────────────────────────────────────────────

interface ScaffoldCaseResult {
  readonly caseId: number;
  readonly label: string;
  readonly passed: boolean;
  readonly notes: string[];
}

interface ScaffoldResult {
  readonly scaffoldVersion: "8.2K-1-v1";
  readonly allPassed: boolean;
  readonly caseResults: readonly ScaffoldCaseResult[];
  readonly notes: readonly string[];
  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Sample objects ────────────────────────────────────────────────────────────

const SAMPLE_REQUEST: PilotRuntimeRequest = {
  internalRuntimeMode: "controlled_text_pilot_guarded",
  internalRuntimeGuard: PILOT_RUNTIME_REQUIRED_GUARD_PHRASE,
  pilotScenarioId: "S01-invoice-explanation",
  pilotInputMode: "real_text_guarded",
  pilotReviewerId: "reviewer-001",
  pilotRunId: "run-k1-scaffold-001",
  text: "Synthetic invoice text (no real PII).",
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

const SAMPLE_GUARD_INPUT: PilotRuntimeGuardInput = {
  request: SAMPLE_REQUEST,
  expectedInternalSecretConfigured: true,
  providedInternalSecretPresent: true,
  providedInternalSecretMatches: true,
  featureFlagEnabled: true,
  controlledTextPilotFlagEnabled: true,
  killSwitchEnabled: false,
  allowedAccountIds: ["reviewer-001"],
  requesterAccountId: "reviewer-001",
  allowedScenarioIds: ["S01-invoice-explanation"],
  neverUserVisible: true,
};

const SAMPLE_GUARD_SUCCESS: PilotRuntimeGuardSuccess = {
  authorised: true,
  mode: "controlled_text_pilot_guarded",
  pilotScenarioId: "S01-invoice-explanation",
  pilotInputMode: "real_text_guarded",
  pilotReviewerId: "reviewer-001",
  pilotRunId: "run-k1-scaffold-001",
  guardsPassed: [...PILOT_RUNTIME_REQUIRED_GUARDS],
  diagnostics: ["pilot_runtime_all_guards_passed"],
  liveLLMCalled: false,
  apiRouteModified: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  emittedToUserNow: false,
  neverUserVisible: true,
};

const SAMPLE_FAILURE: PilotRuntimeFailureResult = {
  authorised: false,
  verdict: "rejected_kill_switch_enabled",
  diagnostics: ["pilot_runtime_rejected_kill_switch_enabled"],
  failedGuard: "kill_switch_disabled",
  httpStatus: 403,
  publicMessage: "Internal pilot runtime request rejected.",
  internalReason: "Kill switch active.",
  liveLLMCalled: false,
  apiRouteModified: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  emittedToUserNow: false,
  neverUserVisible: true,
};

const SAMPLE_NO_PERSISTENCE: PilotNoPersistenceResult = {
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

const SAMPLE_RESPONSE_BLOCKED: PilotRuntimeResponse = {
  mode: "controlled_text_pilot_guarded",
  pilotRunId: "run-k1-scaffold-001",
  pilotScenarioId: "S01-invoice-explanation",
  pilotInputMode: "real_text_guarded",
  responseKind: "blocked",
  emittedToUserNow: false,
  userVisibleOutputAllowed: false,
  publicRuntimeEnabled: false,
  readyForPublicLaunch: false,
  noPersistence: SAMPLE_NO_PERSISTENCE,
  liveLLMCalled: false,
  apiRouteModified: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  neverUserVisible: true,
};

const SAMPLE_CLOSURE_AUDIT: PilotRuntimeClosureAuditResult = {
  auditId: "8.2K-1-scaffold-closure-audit",
  guardContractsPresent: true,
  requestContractPresent: true,
  responseContractPresent: true,
  failureContractPresent: true,
  noPersistenceContractPresent: true,
  readyForApiBranchImplementation: true,
  readyForRuntimeExecution: false,
  readyForPublicLaunch: false,
  liveLLMCalled: false,
  apiRouteModifiedByAudit: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  emittedToUserNow: false,
  neverUserVisible: true,
};

// ── Case runner ───────────────────────────────────────────────────────────────

function makeCase(
  caseId: number,
  label: string,
  checks: () => string[],
): ScaffoldCaseResult {
  const notes = checks();
  return { caseId, label, passed: notes.length === 0, notes };
}

// ── Main scaffold function ────────────────────────────────────────────────────

export function runPilotRuntimeGuardContractRegressionScaffold(): ScaffoldResult {
  const cases: ScaffoldCaseResult[] = [];

  // Case 1 — valid PilotRuntimeRequest shape
  cases.push(makeCase(1, "valid PilotRuntimeRequest shape", () => {
    const notes: string[] = [];
    if (SAMPLE_REQUEST.internalRuntimeMode !== PILOT_RUNTIME_ALLOWED_MODE)
      notes.push("internalRuntimeMode mismatch");
    if (SAMPLE_REQUEST.internalRuntimeGuard !== PILOT_RUNTIME_REQUIRED_GUARD_PHRASE)
      notes.push("internalRuntimeGuard mismatch");
    if (SAMPLE_REQUEST.requestedOcr !== false) notes.push("requestedOcr not false");
    if (SAMPLE_REQUEST.requestedFileUpload !== false) notes.push("requestedFileUpload not false");
    if (SAMPLE_REQUEST.requestedPayment !== false) notes.push("requestedPayment not false");
    if (SAMPLE_REQUEST.requestedPersistence !== false) notes.push("requestedPersistence not false");
    if (SAMPLE_REQUEST.requestedDnaSave !== false) notes.push("requestedDnaSave not false");
    if (SAMPLE_REQUEST.requestedOfflineSave !== false) notes.push("requestedOfflineSave not false");
    if (SAMPLE_REQUEST.requestedPublicRuntime !== false) notes.push("requestedPublicRuntime not false");
    if (SAMPLE_REQUEST.requestedLiveLLM !== false) notes.push("requestedLiveLLM not false");
    if (SAMPLE_REQUEST.neverUserVisible !== true) notes.push("neverUserVisible not true");
    return notes;
  }));

  // Case 2 — valid PilotRuntimeGuardSuccess shape
  cases.push(makeCase(2, "valid PilotRuntimeGuardSuccess shape", () => {
    const notes: string[] = [];
    if (SAMPLE_GUARD_SUCCESS.authorised !== true) notes.push("authorised not true");
    if (SAMPLE_GUARD_SUCCESS.mode !== "controlled_text_pilot_guarded") notes.push("mode mismatch");
    if (SAMPLE_GUARD_SUCCESS.liveLLMCalled !== false) notes.push("liveLLMCalled not false");
    if (SAMPLE_GUARD_SUCCESS.persistenceUsed !== false) notes.push("persistenceUsed not false");
    if (SAMPLE_GUARD_SUCCESS.dnaSavePerformed !== false) notes.push("dnaSavePerformed not false");
    if (SAMPLE_GUARD_SUCCESS.offlineSavePerformed !== false) notes.push("offlineSavePerformed not false");
    if (SAMPLE_GUARD_SUCCESS.emittedToUserNow !== false) notes.push("emittedToUserNow not false");
    if (SAMPLE_GUARD_SUCCESS.neverUserVisible !== true) notes.push("neverUserVisible not true");
    if (SAMPLE_GUARD_SUCCESS.guardsPassed.length !== PILOT_RUNTIME_REQUIRED_GUARDS.length)
      notes.push(`guardsPassed count ${SAMPLE_GUARD_SUCCESS.guardsPassed.length} !== expected ${PILOT_RUNTIME_REQUIRED_GUARDS.length}`);
    return notes;
  }));

  // Case 3 — valid PilotRuntimeFailureResult shape
  cases.push(makeCase(3, "valid PilotRuntimeFailureResult shape", () => {
    const notes: string[] = [];
    if (SAMPLE_FAILURE.authorised !== false) notes.push("authorised not false");
    if (SAMPLE_FAILURE.publicMessage !== "Internal pilot runtime request rejected.")
      notes.push("publicMessage mismatch");
    if (SAMPLE_FAILURE.httpStatus !== 403 && SAMPLE_FAILURE.httpStatus !== 400)
      notes.push("httpStatus must be 403 or 400");
    if (SAMPLE_FAILURE.liveLLMCalled !== false) notes.push("liveLLMCalled not false");
    if (SAMPLE_FAILURE.emittedToUserNow !== false) notes.push("emittedToUserNow not false");
    if (SAMPLE_FAILURE.neverUserVisible !== true) notes.push("neverUserVisible not true");
    return notes;
  }));

  // Case 4 — valid PilotNoPersistenceResult shape
  cases.push(makeCase(4, "valid PilotNoPersistenceResult shape", () => {
    const notes: string[] = [];
    if (SAMPLE_NO_PERSISTENCE.persistenceAllowed !== false) notes.push("persistenceAllowed not false");
    if (SAMPLE_NO_PERSISTENCE.persistenceUsed !== false) notes.push("persistenceUsed not false");
    if (SAMPLE_NO_PERSISTENCE.dnaSaveAllowed !== false) notes.push("dnaSaveAllowed not false");
    if (SAMPLE_NO_PERSISTENCE.dnaSavePerformed !== false) notes.push("dnaSavePerformed not false");
    if (SAMPLE_NO_PERSISTENCE.offlineSaveAllowed !== false) notes.push("offlineSaveAllowed not false");
    if (SAMPLE_NO_PERSISTENCE.offlineSavePerformed !== false) notes.push("offlineSavePerformed not false");
    if (SAMPLE_NO_PERSISTENCE.evidencePersistenceAllowed !== false) notes.push("evidencePersistenceAllowed not false");
    if (SAMPLE_NO_PERSISTENCE.evidencePersistencePerformed !== false) notes.push("evidencePersistencePerformed not false");
    if (SAMPLE_NO_PERSISTENCE.neverUserVisible !== true) notes.push("neverUserVisible not true");
    return notes;
  }));

  // Case 5 — valid PilotRuntimeResponse blocked shape
  cases.push(makeCase(5, "valid PilotRuntimeResponse blocked shape", () => {
    const notes: string[] = [];
    if (SAMPLE_RESPONSE_BLOCKED.mode !== "controlled_text_pilot_guarded") notes.push("mode mismatch");
    if (SAMPLE_RESPONSE_BLOCKED.responseKind !== "blocked") notes.push("responseKind not blocked");
    if (SAMPLE_RESPONSE_BLOCKED.emittedToUserNow !== false) notes.push("emittedToUserNow not false");
    if (SAMPLE_RESPONSE_BLOCKED.userVisibleOutputAllowed !== false) notes.push("userVisibleOutputAllowed not false");
    if (SAMPLE_RESPONSE_BLOCKED.publicRuntimeEnabled !== false) notes.push("publicRuntimeEnabled not false");
    if (SAMPLE_RESPONSE_BLOCKED.readyForPublicLaunch !== false) notes.push("readyForPublicLaunch not false");
    if (SAMPLE_RESPONSE_BLOCKED.liveLLMCalled !== false) notes.push("liveLLMCalled not false");
    if (SAMPLE_RESPONSE_BLOCKED.persistenceUsed !== false) notes.push("persistenceUsed not false");
    if (SAMPLE_RESPONSE_BLOCKED.noPersistence.persistenceUsed !== false) notes.push("noPersistence.persistenceUsed not false");
    if (SAMPLE_RESPONSE_BLOCKED.noPersistence.evidencePersistenceAllowed !== false) notes.push("evidencePersistenceAllowed not false");
    if (SAMPLE_RESPONSE_BLOCKED.neverUserVisible !== true) notes.push("neverUserVisible not true");
    return notes;
  }));

  // Case 6 — valid PilotRuntimeClosureAuditResult shape
  cases.push(makeCase(6, "valid PilotRuntimeClosureAuditResult shape", () => {
    const notes: string[] = [];
    if (SAMPLE_CLOSURE_AUDIT.guardContractsPresent !== true) notes.push("guardContractsPresent not true");
    if (SAMPLE_CLOSURE_AUDIT.requestContractPresent !== true) notes.push("requestContractPresent not true");
    if (SAMPLE_CLOSURE_AUDIT.responseContractPresent !== true) notes.push("responseContractPresent not true");
    if (SAMPLE_CLOSURE_AUDIT.failureContractPresent !== true) notes.push("failureContractPresent not true");
    if (SAMPLE_CLOSURE_AUDIT.noPersistenceContractPresent !== true) notes.push("noPersistenceContractPresent not true");
    if (SAMPLE_CLOSURE_AUDIT.readyForRuntimeExecution !== false) notes.push("readyForRuntimeExecution not false");
    if (SAMPLE_CLOSURE_AUDIT.readyForPublicLaunch !== false) notes.push("readyForPublicLaunch not false");
    if (SAMPLE_CLOSURE_AUDIT.liveLLMCalled !== false) notes.push("liveLLMCalled not false");
    if (SAMPLE_CLOSURE_AUDIT.apiRouteModifiedByAudit !== false) notes.push("apiRouteModifiedByAudit not false");
    if (SAMPLE_CLOSURE_AUDIT.emittedToUserNow !== false) notes.push("emittedToUserNow not false");
    if (SAMPLE_CLOSURE_AUDIT.neverUserVisible !== true) notes.push("neverUserVisible not true");
    return notes;
  }));

  // Case 7 — required guards count matches exported list (16)
  cases.push(makeCase(7, "required guards count === 16", () => {
    const notes: string[] = [];
    if (PILOT_RUNTIME_REQUIRED_GUARDS.length !== 16)
      notes.push(`Expected 16 required guards, got ${PILOT_RUNTIME_REQUIRED_GUARDS.length}`);
    return notes;
  }));

  // Case 8 — blocked capabilities count matches exported list (11)
  cases.push(makeCase(8, "blocked capabilities count === 11", () => {
    const notes: string[] = [];
    if (PILOT_RUNTIME_BLOCKED_CAPABILITIES.length !== 11)
      notes.push(`Expected 11 blocked capabilities, got ${PILOT_RUNTIME_BLOCKED_CAPABILITIES.length}`);
    return notes;
  }));

  // Case 9 — guard phrase constant matches required phrase exactly
  cases.push(makeCase(9, "guard phrase constant matches required value", () => {
    const notes: string[] = [];
    if (PILOT_RUNTIME_REQUIRED_GUARD_PHRASE !== "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY")
      notes.push("Guard phrase constant value mismatch");
    return notes;
  }));

  // Case 10 — all safety invariants on sample objects
  cases.push(makeCase(10, "all safety invariants false/true on sample objects", () => {
    const notes: string[] = [];
    // Guard input
    if (SAMPLE_GUARD_INPUT.neverUserVisible !== true) notes.push("guard input neverUserVisible not true");
    // Guard success invariants already checked in case 2
    // Failure result invariants already checked in case 3
    // Response invariants already checked in case 5
    // No-persistence invariants already checked in case 4
    // Closure audit invariants already checked in case 6
    // Verify allowed mode constant
    if (PILOT_RUNTIME_ALLOWED_MODE !== "controlled_text_pilot_guarded")
      notes.push("PILOT_RUNTIME_ALLOWED_MODE value mismatch");
    // Verify kill_switch guard is in required guards
    if (!PILOT_RUNTIME_REQUIRED_GUARDS.includes("kill_switch_disabled"))
      notes.push("kill_switch_disabled missing from required guards");
    // Verify live_llm capability is blocked
    if (!PILOT_RUNTIME_BLOCKED_CAPABILITIES.includes("live_llm_runtime"))
      notes.push("live_llm_runtime missing from blocked capabilities");
    // Verify evidence_persistence is blocked
    if (!PILOT_RUNTIME_BLOCKED_CAPABILITIES.includes("evidence_persistence"))
      notes.push("evidence_persistence missing from blocked capabilities");
    // Verify public_anonymous_runtime is blocked
    if (!PILOT_RUNTIME_BLOCKED_CAPABILITIES.includes("public_anonymous_runtime"))
      notes.push("public_anonymous_runtime missing from blocked capabilities");
    return notes;
  }));

  const allPassed = cases.every(c => c.passed);

  return {
    scaffoldVersion: "8.2K-1-v1",
    allPassed,
    caseResults: cases,
    notes: allPassed
      ? ["All 10 regression cases passed. Guard contract types validated."]
      : [`${cases.filter(c => !c.passed).length} case(s) failed.`],
    liveLLMCalled: false,
    apiRouteModified: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}
