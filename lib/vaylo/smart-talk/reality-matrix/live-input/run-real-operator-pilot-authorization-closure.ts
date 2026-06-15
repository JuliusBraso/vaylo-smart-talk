/**
 * Real Operator Pilot Authorization Closure (Phase 8.2M-7).
 *
 * Formally closes the 8.2M epoch by verifying that all authorization
 * prerequisite contracts (8.2M-1 through 8.2M-6) have passed and producing
 * a typed closure result with open items for future epochs.
 *
 * Sub-steps:
 *   1. Call runPostRunAuditPlanningContractCheck() and verify all
 *      prerequisite invariants from 8.2M-6.
 *   2. Build a synthetic safe closure input and validate it.
 *   3. Return the final closure check result.
 *
 * This module does NOT:
 * - read process.env
 * - execute a real operator pilot
 * - authorize pilotRunNow
 * - authorize live LLM runtime
 * - authorize persistence
 * - authorize public launch
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema or API routes
 * - process actual user input or forward raw input
 * - call any live LLM or make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runRealOperatorPilotAuthorizationClosure()` explicitly.
 */

import { runPostRunAuditPlanningContractCheck } from "./run-post-run-audit-planning-contract-check";
import {
  FORBIDDEN_REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_STRINGS,
  REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_OPEN_ITEMS,
  REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_REQUIRED_NOTES,
} from "./real-operator-pilot-authorization-closure-types";
import type {
  RealOperatorPilotAuthorizationClosureBlocker,
  RealOperatorPilotAuthorizationClosureCheckResult,
  RealOperatorPilotAuthorizationClosureInput,
  RealOperatorPilotAuthorizationClosureResult,
} from "./real-operator-pilot-authorization-closure-types";

// ── Helpers ──────────────────────────────────────────────────────────────────

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
  return FORBIDDEN_REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_STRINGS.some(
    (f) => value.includes(f),
  );
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsSensitivePersonalMarker(value: string): boolean {
  return SENSITIVE_PERSONAL_MARKERS.some((m) => value.includes(m));
}

function containsHighRiskLegalMarker(value: string): boolean {
  return HIGH_RISK_LEGAL_MARKERS.some((m) => value.includes(m));
}

function containsAuthorityDocumentMarker(value: string): boolean {
  return AUTHORITY_DOCUMENT_MARKERS.some((m) => value.includes(m));
}

function addBlocker(
  list: RealOperatorPilotAuthorizationClosureBlocker[],
  blocker: RealOperatorPilotAuthorizationClosureBlocker,
): void {
  if (!list.includes(blocker)) list.push(blocker);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `RealOperatorPilotAuthorizationClosureInput` for
 * use in the harness check. Contains no pilot execution, no user content, no
 * env values, no secrets, and no sensitive content.
 */
export function buildSyntheticRealOperatorPilotAuthorizationClosureInput(): RealOperatorPilotAuthorizationClosureInput {
  return {
    closureId: "real-operator-pilot-authorization-closure-8-2m-7",
    epochId: "8.2M",
    previousEpochId: "8.2L",

    previousEpochClosed: true,
    authorizationPlanReady: true,
    operatorReviewerIdentityReady: true,
    realEnvironmentAttestationReady: true,
    abortProtocolReady: true,
    realInputPolicyReady: true,
    evidencePolicyReady: true,
    postRunAuditPlanningReady: true,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawInputForwarded: false,
    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    userContentStored: false,
    userContentAuditStored: false,
    userContentEvidenceStored: false,

    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    notes: [...REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_REQUIRED_NOTES],
    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `RealOperatorPilotAuthorizationClosureInput` and returns a
 * typed `RealOperatorPilotAuthorizationClosureResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateRealOperatorPilotAuthorizationClosureInput(
  input: RealOperatorPilotAuthorizationClosureInput,
): RealOperatorPilotAuthorizationClosureResult {
  const blockers: RealOperatorPilotAuthorizationClosureBlocker[] = [];
  const inputRec = asRec(input);

  // ── Rules 1–8: prerequisite readiness ────────────────────────────────────

  if (!input.previousEpochClosed) {
    addBlocker(blockers, "previous_epoch_not_closed");
  }
  if (!input.authorizationPlanReady) {
    addBlocker(blockers, "authorization_plan_not_ready");
  }
  if (!input.operatorReviewerIdentityReady) {
    addBlocker(blockers, "operator_reviewer_identity_not_ready");
  }
  if (!input.realEnvironmentAttestationReady) {
    addBlocker(blockers, "real_environment_attestation_not_ready");
  }
  if (!input.abortProtocolReady) {
    addBlocker(blockers, "abort_protocol_not_ready");
  }
  if (!input.realInputPolicyReady) {
    addBlocker(blockers, "real_input_policy_not_ready");
  }
  if (!input.evidencePolicyReady) {
    addBlocker(blockers, "evidence_policy_not_ready");
  }
  if (!input.postRunAuditPlanningReady) {
    addBlocker(blockers, "post_run_audit_planning_not_ready");
  }

  // ── Rule 9: runtime / content safety flags ────────────────────────────────

  if (inputRec["realPilotRunExecuted"] === true) {
    addBlocker(blockers, "real_pilot_run_already_executed");
  }
  if (inputRec["realUserInputProcessed"] === true) {
    addBlocker(blockers, "real_input_processed");
  }
  if (inputRec["rawInputForwarded"] === true) {
    addBlocker(blockers, "raw_input_forwarded");
  }
  if (
    inputRec["auditExecutionPerformed"] === true ||
    inputRec["auditPersistencePerformed"] === true ||
    inputRec["evidencePersistencePerformed"] === true
  ) {
    addBlocker(blockers, "audit_or_evidence_persisted");
  }
  if (
    inputRec["userContentStored"] === true ||
    inputRec["userContentAuditStored"] === true ||
    inputRec["userContentEvidenceStored"] === true
  ) {
    addBlocker(blockers, "user_content_stored");
  }
  if (inputRec["liveLLMCalled"] === true) {
    addBlocker(blockers, "live_llm_called");
  }
  if (inputRec["persistenceUsed"] === true) {
    addBlocker(blockers, "persistence_used");
  }
  if (inputRec["dnaSavePerformed"] === true) {
    addBlocker(blockers, "dna_save_performed");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addBlocker(blockers, "offline_save_performed");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addBlocker(blockers, "public_runtime_enabled");
  }
  if (inputRec["emittedToUserNow"] === true) {
    addBlocker(blockers, "user_visible_output_emitted");
  }

  // ── Rule 10: required notes ───────────────────────────────────────────────

  for (const required of REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_REQUIRED_NOTES) {
    const found = input.notes.some((n) => n.includes(required));
    if (!found) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
      break;
    }
  }

  // ── Rules 11–13: scan notes for forbidden content ─────────────────────────

  for (const note of input.notes) {
    if (containsForbiddenString(note)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
    if (containsPiiPattern(note)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
    if (
      containsAuthorityDocumentMarker(note) ||
      containsSensitivePersonalMarker(note) ||
      containsHighRiskLegalMarker(note)
    ) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
  }

  // Also scan non-notes string fields
  const stringFields = [input.closureId];
  for (const s of stringFields) {
    if (containsForbiddenString(s) || containsPiiPattern(s)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
  }

  // ── Derive verdict ────────────────────────────────────────────────────────

  const isStructurallyInvalid =
    !input.closureId ||
    input.closureId.trim() === "" ||
    input.epochId !== "8.2M" ||
    input.previousEpochId !== "8.2L";

  const verdict = isStructurallyInvalid
    ? ("invalid" as const)
    : blockers.length === 0
      ? ("closed_with_warnings" as const)
      : ("blocked" as const);

  const closedWithWarnings = verdict === "closed_with_warnings";

  const allAuthorizationContractsReady =
    input.previousEpochClosed &&
    input.authorizationPlanReady &&
    input.operatorReviewerIdentityReady &&
    input.realEnvironmentAttestationReady &&
    input.abortProtocolReady &&
    input.realInputPolicyReady &&
    input.evidencePolicyReady &&
    input.postRunAuditPlanningReady;

  return {
    closureId: input.closureId,
    epochId: "8.2M",
    verdict,
    blockers,
    openItems: REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_OPEN_ITEMS,

    closedWithWarnings,
    readyForNextEpochPlanning: closedWithWarnings,
    readyForConnectedAiRuntimeAuthorizationPlanning: closedWithWarnings,
    readyForRealOperatorPilotRuntimeExecutionPlanning: closedWithWarnings,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawInputForwarded: false,
    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    userContentStored: false,
    userContentAuditStored: false,
    userContentEvidenceStored: false,

    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByClosure: false,
    uiTouched: false,
    databaseOrStorageModifiedByClosure: false,

    neverUserVisible: true,

    safetySummary: {
      previousEpochClosed: input.previousEpochClosed,
      authorizationPlanReady: input.authorizationPlanReady,
      operatorReviewerIdentityReady: input.operatorReviewerIdentityReady,
      realEnvironmentAttestationReady: input.realEnvironmentAttestationReady,
      abortProtocolReady: input.abortProtocolReady,
      realInputPolicyReady: input.realInputPolicyReady,
      evidencePolicyReady: input.evidencePolicyReady,
      postRunAuditPlanningReady: input.postRunAuditPlanningReady,
      allAuthorizationContractsReady,
    },
  };
}

// ── Closure check ─────────────────────────────────────────────────────────────

/**
 * Runs the full Real Operator Pilot Authorization Closure check for Phase 8.2M-7.
 *
 * Calls `runPostRunAuditPlanningContractCheck()` (8.2M-6), validates a
 * synthetic safe closure input, and returns the final closure check result.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT execute or authorize a real pilot. Does NOT authorize live LLM,
 * persistence, or public launch. Does NOT store user content or modify
 * DB/storage.
 */
export function runRealOperatorPilotAuthorizationClosure(): RealOperatorPilotAuthorizationClosureCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.2M-6 post-run audit planning ────────────────────────

  const auditPlanningCheck = runPostRunAuditPlanningContractCheck();
  const apRec = asRec(auditPlanningCheck);

  const postRunAuditPlanningReady =
    auditPlanningCheck.allPassed === true &&
    apRec["readyForRealOperatorPilotAuthorizationClosure"] === true &&
    apRec["readyForRealOperatorPilotRun"] !== true &&
    apRec["readyForPilotRunNow"] !== true &&
    apRec["readyForPublicLaunch"] !== true &&
    apRec["readyForLiveLLMRuntime"] !== true &&
    apRec["readyForPersistence"] !== true &&
    apRec["realPilotRunExecuted"] !== true &&
    apRec["realUserInputProcessed"] !== true &&
    apRec["auditExecutionPerformed"] !== true &&
    apRec["auditPersistencePerformed"] !== true &&
    apRec["evidencePersistencePerformed"] !== true &&
    apRec["userContentAuditStored"] !== true &&
    apRec["auditRuntimeModifiedByPlanning"] !== true &&
    apRec["databaseOrStorageModifiedByPlanning"] !== true &&
    apRec["liveLLMCalled"] !== true &&
    apRec["persistenceUsed"] !== true &&
    apRec["dnaSavePerformed"] !== true &&
    apRec["offlineSavePerformed"] !== true &&
    apRec["emittedToUserNow"] !== true &&
    apRec["neverUserVisible"] === true;

  notes.push(`postRunAuditPlanningReady: ${String(postRunAuditPlanningReady)}`);
  notes.push(
    `auditPlanningCheck.allPassed: ${String(auditPlanningCheck.allPassed)}`,
  );
  notes.push(
    `readyForRealOperatorPilotAuthorizationClosure: ${String(apRec["readyForRealOperatorPilotAuthorizationClosure"])}`,
  );

  // ── Step 2: Build and validate the synthetic closure input ────────────────

  const syntheticInput = buildSyntheticRealOperatorPilotAuthorizationClosureInput();
  const closureResult =
    validateRealOperatorPilotAuthorizationClosureInput(syntheticInput);

  notes.push(`closureResult.verdict: ${closureResult.verdict}`);
  notes.push(`closureResult.blockers.length: ${String(closureResult.blockers.length)}`);
  notes.push(
    `closureResult.openItems.length: ${String(closureResult.openItems.length)}`,
  );
  notes.push(
    `closureResult.readyForNextEpochPlanning: ${String(closureResult.readyForNextEpochPlanning)}`,
  );
  notes.push(
    `closureResult.readyForConnectedAiRuntimeAuthorizationPlanning: ${String(closureResult.readyForConnectedAiRuntimeAuthorizationPlanning)}`,
  );
  notes.push(
    `closureResult.readyForRealOperatorPilotRuntimeExecutionPlanning: ${String(closureResult.readyForRealOperatorPilotRuntimeExecutionPlanning)}`,
  );

  // ── Step 3: Determine allPassed ───────────────────────────────────────────

  const allPassed =
    postRunAuditPlanningReady &&
    closureResult.verdict === "closed_with_warnings" &&
    closureResult.blockers.length === 0 &&
    closureResult.readyForNextEpochPlanning === true &&
    closureResult.readyForConnectedAiRuntimeAuthorizationPlanning === true &&
    closureResult.readyForRealOperatorPilotRuntimeExecutionPlanning === true &&
    closureResult.readyForRealOperatorPilotRun === false &&
    closureResult.readyForPilotRunNow === false &&
    closureResult.readyForPublicLaunch === false &&
    closureResult.readyForLiveLLMRuntime === false &&
    closureResult.readyForPersistence === false &&
    closureResult.neverUserVisible === true;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-7",
    allPassed,
    closureResult,

    previousEpochClosed:
      postRunAuditPlanningReady && syntheticInput.previousEpochClosed,
    postRunAuditPlanningReady,

    readyForNextEpochPlanning: allPassed,
    readyForConnectedAiRuntimeAuthorizationPlanning: allPassed,
    readyForRealOperatorPilotRuntimeExecutionPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawInputForwarded: false,
    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    userContentStored: false,

    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
