/**
 * Controlled Text Pilot Readiness Closure Audit runner (Phase 8.2J-5).
 *
 * Formally closes the 8.2J epoch by verifying:
 * - All six required planning/model/protocol layers are present.
 * - Each plan/protocol constant satisfies its safety invariants.
 * - The pilot evidence record validator accepts valid records and rejects
 *   prohibited fields, suspicious notes, and tampered safety flags.
 * - The regression scaffold (8.2J-4) reports allPassed === true.
 * - readyForRuntimeExecution and readyForPublicLaunch remain false.
 *
 * This function:
 * - Does NOT implement pilot runtime.
 * - Does NOT modify API routes or UI.
 * - Does NOT call any LLM.
 * - Does NOT persist anything.
 * - Does NOT inspect the filesystem dynamically.
 * - Does NOT log raw/redacted/draft text.
 *
 * Expected verdict: closed_with_warnings
 * (runtime implementation and public launch remain blocked/future).
 *
 * nextRecommendedPhase: "8.2K-0 — Guarded Internal Pilot Runtime Implementation Plan"
 */

import { CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1 } from "./controlled-text-pilot-readiness-plan-types";
import { CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1 } from "./controlled-text-pilot-scenarios-types";
import { GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1 } from "./guarded-internal-pilot-runtime-switch-plan-types";
import { MANUAL_SAFETY_TEST_PROTOCOL_V1 } from "./manual-safety-test-protocol-types";
import { runPilotEvidenceRecordModelRegressionScaffold } from "./pilot-evidence-record-model-regression-scaffold";
import { validatePilotEvidenceRecord } from "./validate-pilot-evidence-record";
import type {
  ControlledTextPilotReadinessClosureAuditDiagnosticCode,
  ControlledTextPilotReadinessClosureAuditInput,
  ControlledTextPilotReadinessClosureAuditResult,
  ControlledTextPilotReadinessClosureAuditVerdict,
  ControlledTextPilotReadinessLayerCheck,
  ControlledTextPilotReadinessOpenItem,
  ControlledTextPilotReadinessRequiredLayerId,
} from "./controlled-text-pilot-readiness-closure-audit-types";

// ── Invariant base ────────────────────────────────────────────────────────────

const AUDIT_INVARIANTS = {
  readyForPilotRuntimeImplementation: false,
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
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function unsafeReadField(obj: object, key: string): unknown {
  return (obj as Record<string, unknown>)[key];
}

function makeBlocked(
  auditRunId: string,
  verdict: ControlledTextPilotReadinessClosureAuditVerdict,
  diagnostics: ControlledTextPilotReadinessClosureAuditDiagnosticCode[],
  layerChecks: readonly ControlledTextPilotReadinessLayerCheck[],
  openItems: readonly ControlledTextPilotReadinessOpenItem[],
  partial: {
    readinessPlanVerified: boolean;
    scenarioSetVerified: boolean;
    switchPlanVerified: boolean;
    manualProtocolVerified: boolean;
    evidenceModelVerified: boolean;
    evidenceRegressionPassed: boolean;
  },
  notes?: string[],
): ControlledTextPilotReadinessClosureAuditResult {
  return {
    auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems,
    ...partial,
    readyForControlledTextPilotPlanningClosure: false,
    ...AUDIT_INVARIANTS,
    nextRecommendedPhase: "8.2K-0 — Guarded Internal Pilot Runtime Implementation Plan",
    notes,
  };
}

// ── Open items ────────────────────────────────────────────────────────────────

const OPEN_ITEMS: readonly ControlledTextPilotReadinessOpenItem[] = [
  {
    itemId: "8.2J-OPEN-001",
    severity: "blocker",
    title: "Pilot runtime implementation remains future",
    recommendation:
      "Implement guarded internal pilot runtime only after explicit implementation phase (8.2K).",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-002",
    severity: "blocker",
    title: "Public anonymous runtime remains blocked",
    recommendation:
      "Keep public runtime disabled until pilot evidence and production safety audit pass.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-003",
    severity: "future_epoch",
    title: "Pilot evidence persistence remains future",
    recommendation:
      "Add persistence only after safe evidence record model is proven and reviewed.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-004",
    severity: "future_epoch",
    title: "OCR/photo and file upload remain future",
    recommendation:
      "Keep text-only pilot boundary until later OCR/file upload epoch.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-005",
    severity: "future_epoch",
    title: "Payment/completeness warning remains future",
    recommendation:
      "Implement before monetized document or text explanation.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-006",
    severity: "future_epoch",
    title: "Multilingual runtime remains future",
    recommendation:
      "Keep Slovak-first/manual review pilot boundary until localization epoch.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2J-OPEN-007",
    severity: "future_epoch",
    title: "Production monitoring and abuse controls remain future",
    recommendation: "Add before any public beta.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
];

// ── Layer inventory ───────────────────────────────────────────────────────────

const LAYER_INVENTORY: readonly ControlledTextPilotReadinessLayerCheck[] = [
  {
    layerId: "controlled_text_pilot_readiness_plan" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-0",
    notes: ["CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1 defined and imported."],
    neverUserVisible: true,
  },
  {
    layerId: "pilot_scenario_set" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-1",
    notes: ["CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1 with 12 scenarios defined and imported."],
    neverUserVisible: true,
  },
  {
    layerId: "guarded_internal_pilot_runtime_switch_plan" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-2",
    notes: ["GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1 with 16 activation rules defined and imported."],
    neverUserVisible: true,
  },
  {
    layerId: "manual_safety_test_protocol" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-3",
    notes: ["MANUAL_SAFETY_TEST_PROTOCOL_V1 with 24-item checklist defined and imported."],
    neverUserVisible: true,
  },
  {
    layerId: "pilot_evidence_record_model" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-4",
    notes: ["PilotEvidenceRecord and validatePilotEvidenceRecord defined and imported."],
    neverUserVisible: true,
  },
  {
    layerId: "pilot_evidence_record_regression_scaffold" as ControlledTextPilotReadinessRequiredLayerId,
    status: "present",
    phase: "8.2J-4",
    notes: ["runPilotEvidenceRecordModelRegressionScaffold (18 cases) defined and imported."],
    neverUserVisible: true,
  },
];

// ── Known-good fixture for evidence model check ───────────────────────────────

function makeGoodRecord(): Record<string, unknown> {
  return {
    pilotRunId: "audit-run-evidence-check-001",
    scenarioId: "S01-invoice-explanation",
    reviewerRole: "primary_reviewer",
    reviewVerdict: "pass",
    checklistPassedCount: 24,
    checklistFailedCount: 0,
    escalationReasons: [],
    nonSensitiveReviewerNotes: ["Pipeline produced pass result as expected."],
    signedOffBy: "reviewer-001",
    signedOffAtPhase: "final_signoff",
    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsUserPii: false,
    containsScreenshotWithPii: false,
    containsDocumentImage: false,
    containsApiKey: false,
    containsInternalSecret: false,
    containsRawModelOutput: false,
    readyForPersistence: false,
    readyForClosureAudit: true,
    readyForPublicLaunch: false,
    liveLLMCalled: false,
    apiRouteModified: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Main audit function ───────────────────────────────────────────────────────

/**
 * Runs the 8.2J controlled text pilot readiness closure audit.
 *
 * Pure function — no side effects, no persistence, no LLM calls.
 * Always returns literal-false safety invariants.
 *
 * Expected verdict: closed_with_warnings
 * (runtime implementation and public launch remain blocked/future).
 */
export function runControlledTextPilotReadinessClosureAudit(
  input: ControlledTextPilotReadinessClosureAuditInput,
): ControlledTextPilotReadinessClosureAuditResult {
  const { auditRunId } = input;

  const diagnostics: ControlledTextPilotReadinessClosureAuditDiagnosticCode[] = [
    "controlled_text_pilot_closure_started",
    "controlled_text_pilot_closure_no_live_llm_in_audit",
    "controlled_text_pilot_closure_no_api_ui_changes",
    "controlled_text_pilot_closure_persistence_still_blocked",
    "controlled_text_pilot_closure_no_dna_save",
    "controlled_text_pilot_closure_no_offline_save",
    "controlled_text_pilot_closure_runtime_execution_still_disabled",
    "controlled_text_pilot_closure_public_runtime_still_blocked",
  ];

  const partial = {
    readinessPlanVerified: false,
    scenarioSetVerified: false,
    switchPlanVerified: false,
    manualProtocolVerified: false,
    evidenceModelVerified: false,
    evidenceRegressionPassed: false,
  };

  // ── Layer inventory ───────────────────────────────────────────────────────

  diagnostics.push("controlled_text_pilot_closure_layer_inventory_completed");

  const missingLayers = LAYER_INVENTORY.filter(l => l.status === "missing");
  if (missingLayers.length > 0) {
    diagnostics.push("controlled_text_pilot_closure_blocked_missing_required_layer");
    return makeBlocked(
      auditRunId,
      "blocked_missing_required_layer",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      partial,
      [`Missing layers: ${missingLayers.map(l => l.layerId).join(", ")}`],
    );
  }

  diagnostics.push("controlled_text_pilot_closure_required_layers_present");

  // ── 1. Readiness plan verification ───────────────────────────────────────

  const plan = CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1;

  const planOk =
    plan.planId === "8.2J-0" &&
    unsafeReadField(plan, "readyForInternalPilotImplementation") === false &&
    unsafeReadField(plan, "readyForGuardedManualPilotPlanning") === true &&
    unsafeReadField(plan, "readyForPublicLaunch") === false &&
    unsafeReadField(plan, "liveLLMCalled") === false &&
    unsafeReadField(plan, "persistenceUsed") === false &&
    unsafeReadField(plan, "dnaSavePerformed") === false &&
    unsafeReadField(plan, "offlineSavePerformed") === false;

  if (!planOk) {
    diagnostics.push("controlled_text_pilot_closure_blocked_invariant_failure");
    return makeBlocked(
      auditRunId,
      "blocked_invariant_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      partial,
      ["Readiness plan (8.2J-0) failed invariant checks."],
    );
  }

  partial.readinessPlanVerified = true;
  diagnostics.push("controlled_text_pilot_closure_readiness_plan_verified");

  // ── 2. Scenario set verification ─────────────────────────────────────────

  const ss = CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1;

  const ssOk =
    ss.scenarioSetId === "8.2J-1" &&
    ss.totalScenarios >= 12 &&
    ss.passExpectedCount > 0 &&
    ss.warningExpectedCount > 0 &&
    ss.humanReviewExpectedCount > 0 &&
    ss.blockExpectedCount > 0 &&
    unsafeReadField(ss, "readyForRuntimeExecution") === false &&
    unsafeReadField(ss, "readyForManualReviewProtocol") === true &&
    unsafeReadField(ss, "readyForPublicLaunch") === false &&
    unsafeReadField(ss, "liveLLMCalled") === false &&
    unsafeReadField(ss, "persistenceUsed") === false &&
    unsafeReadField(ss, "dnaSavePerformed") === false &&
    unsafeReadField(ss, "offlineSavePerformed") === false;

  if (!ssOk) {
    diagnostics.push("controlled_text_pilot_closure_blocked_scenario_set_failure");
    return makeBlocked(
      auditRunId,
      "blocked_scenario_set_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      ["Scenario set (8.2J-1) failed invariant checks."],
    );
  }

  partial.scenarioSetVerified = true;
  diagnostics.push("controlled_text_pilot_closure_scenario_set_verified");

  // ── 3. Switch plan verification ───────────────────────────────────────────

  const sw = GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1;
  const swGuards = sw.requiredGuards as readonly string[];

  const swOk =
    sw.planId === "8.2J-2" &&
    sw.allowedMode === "controlled_text_pilot_guarded" &&
    unsafeReadField(sw, "readyForPilotRuntimeImplementation") === false &&
    unsafeReadField(sw, "readyForManualSafetyProtocol") === true &&
    unsafeReadField(sw, "readyForPublicLaunch") === false &&
    swGuards.includes("global_kill_switch") &&
    swGuards.includes("internal_runtime_secret_header") &&
    swGuards.includes("internal_account_allowlist") &&
    swGuards.includes("no_public_runtime_guard") &&
    swGuards.includes("no_live_llm_guard_until_future_phase") &&
    unsafeReadField(sw, "liveLLMCalled") === false &&
    unsafeReadField(sw, "persistenceUsed") === false &&
    unsafeReadField(sw, "dnaSavePerformed") === false &&
    unsafeReadField(sw, "offlineSavePerformed") === false;

  if (!swOk) {
    diagnostics.push("controlled_text_pilot_closure_blocked_switch_plan_failure");
    return makeBlocked(
      auditRunId,
      "blocked_switch_plan_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      ["Switch plan (8.2J-2) failed invariant checks."],
    );
  }

  partial.switchPlanVerified = true;
  diagnostics.push("controlled_text_pilot_closure_switch_plan_verified");

  // ── 4. Manual protocol verification ──────────────────────────────────────

  const mp = MANUAL_SAFETY_TEST_PROTOCOL_V1;
  const mpProhibited = mp.prohibitedEvidenceFields as readonly string[];

  const mpOk =
    mp.protocolId === "8.2J-3" &&
    unsafeReadField(mp, "readyForPilotEvidenceRecordModel") === true &&
    unsafeReadField(mp, "readyForRuntimeExecution") === false &&
    unsafeReadField(mp, "readyForPublicLaunch") === false &&
    mpProhibited.includes("rawInputText") &&
    mpProhibited.includes("redactedText") &&
    mpProhibited.includes("fullDraftText") &&
    mpProhibited.includes("userPii") &&
    mpProhibited.includes("apiKey") &&
    mpProhibited.includes("internalSecret") &&
    mpProhibited.includes("rawModelOutput") &&
    unsafeReadField(mp, "liveLLMCalled") === false &&
    unsafeReadField(mp, "persistenceUsed") === false &&
    unsafeReadField(mp, "dnaSavePerformed") === false &&
    unsafeReadField(mp, "offlineSavePerformed") === false;

  if (!mpOk) {
    diagnostics.push("controlled_text_pilot_closure_blocked_manual_protocol_failure");
    return makeBlocked(
      auditRunId,
      "blocked_manual_protocol_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      ["Manual safety test protocol (8.2J-3) failed invariant checks."],
    );
  }

  partial.manualProtocolVerified = true;
  diagnostics.push("controlled_text_pilot_closure_manual_protocol_verified");

  // ── 5. Evidence model verification ───────────────────────────────────────

  // Known-good record must pass
  const goodResult = validatePilotEvidenceRecord({
    record: makeGoodRecord(),
    validationRunId: `${auditRunId}-evidence-good`,
    neverUserVisible: true,
  });

  const goodOk =
    goodResult.valid === true &&
    goodResult.verdict === "valid_evidence_record" &&
    goodResult.safeEvidenceRecord !== null &&
    unsafeReadField(goodResult.safeEvidenceRecord, "readyForPersistence") === false &&
    unsafeReadField(goodResult.safeEvidenceRecord, "readyForPublicLaunch") === false &&
    unsafeReadField(goodResult.safeEvidenceRecord, "liveLLMCalled") === false &&
    unsafeReadField(goodResult.safeEvidenceRecord, "persistenceUsed") === false &&
    unsafeReadField(goodResult.safeEvidenceRecord, "dnaSavePerformed") === false &&
    unsafeReadField(goodResult.safeEvidenceRecord, "offlineSavePerformed") === false &&
    goodResult.emittedToUserNow === false;

  // Prohibited field record must be rejected
  const badRecord = { ...makeGoodRecord(), rawInputText: "synthetic raw text" };
  const badResult = validatePilotEvidenceRecord({
    record: badRecord,
    validationRunId: `${auditRunId}-evidence-bad`,
    neverUserVisible: true,
  });

  const badOk =
    badResult.valid === false &&
    badResult.verdict === "invalid_prohibited_field_present" &&
    badResult.prohibitedFieldsDetected.includes("rawInputText");

  if (!goodOk || !badOk) {
    diagnostics.push("controlled_text_pilot_closure_blocked_evidence_model_failure");
    return makeBlocked(
      auditRunId,
      "blocked_evidence_model_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      [
        !goodOk ? "Evidence model: known-good record validation failed." : "",
        !badOk ? "Evidence model: prohibited-field record was not rejected." : "",
      ].filter(Boolean),
    );
  }

  partial.evidenceModelVerified = true;
  diagnostics.push("controlled_text_pilot_closure_evidence_model_verified");

  // ── 6. Evidence regression scaffold ──────────────────────────────────────

  const scaffoldResult = runPilotEvidenceRecordModelRegressionScaffold();

  if (!scaffoldResult.allPassed) {
    const failedCases = scaffoldResult.caseResults
      .filter(c => !c.passed)
      .map(c => `case ${c.caseId}: ${c.label}`)
      .join("; ");
    diagnostics.push("controlled_text_pilot_closure_blocked_evidence_regression_failure");
    return makeBlocked(
      auditRunId,
      "blocked_evidence_regression_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      [`Evidence regression scaffold failed: ${failedCases}`],
    );
  }

  // Invariants on scaffold result
  if (
    unsafeReadField(scaffoldResult, "liveLLMCalled") !== false ||
    unsafeReadField(scaffoldResult, "persistenceUsed") !== false ||
    unsafeReadField(scaffoldResult, "dnaSavePerformed") !== false ||
    unsafeReadField(scaffoldResult, "offlineSavePerformed") !== false ||
    unsafeReadField(scaffoldResult, "emittedToUserNow") !== false
  ) {
    diagnostics.push("controlled_text_pilot_closure_blocked_invariant_failure");
    return makeBlocked(
      auditRunId,
      "blocked_invariant_failure",
      diagnostics,
      LAYER_INVENTORY,
      OPEN_ITEMS,
      { ...partial },
      ["Evidence regression scaffold returned unexpected runtime invariant values."],
    );
  }

  partial.evidenceRegressionPassed = true;
  diagnostics.push("controlled_text_pilot_closure_evidence_regression_passed");

  // ── 7. Cross-invariant check ──────────────────────────────────────────────
  //
  // Defensive check: all imported constants must have their key safety flags
  // be false. We already checked individually above; this catch-all covers
  // any unexpected tampered value that slipped through.

  const invariantObjects: object[] = [plan, ss, sw, mp, goodResult];
  for (const obj of invariantObjects) {
    if (
      unsafeReadField(obj, "liveLLMCalled") !== false ||
      unsafeReadField(obj, "persistenceUsed") !== false ||
      unsafeReadField(obj, "dnaSavePerformed") !== false ||
      unsafeReadField(obj, "offlineSavePerformed") !== false
    ) {
      diagnostics.push("controlled_text_pilot_closure_blocked_invariant_failure");
      return makeBlocked(
        auditRunId,
        "blocked_invariant_failure",
        diagnostics,
        LAYER_INVENTORY,
        OPEN_ITEMS,
        { ...partial },
        ["Cross-invariant check: unexpected runtime flag value on imported plan/result."],
      );
    }
  }

  // ── 8. Final verdict ──────────────────────────────────────────────────────

  // All layers verified. Open items include future-epoch blockers for public launch
  // and runtime implementation — these are expected and do not block epoch closure.
  // Verdict is closed_with_warnings because runtime/public-launch remain disabled.

  diagnostics.push("controlled_text_pilot_closure_epoch_closed");

  const readyForControlledTextPilotPlanningClosure =
    partial.readinessPlanVerified &&
    partial.scenarioSetVerified &&
    partial.switchPlanVerified &&
    partial.manualProtocolVerified &&
    partial.evidenceModelVerified &&
    partial.evidenceRegressionPassed;

  return {
    auditRunId,
    verdict: "closed_with_warnings",
    diagnostics,
    layerChecks: LAYER_INVENTORY,
    openItems: OPEN_ITEMS,
    ...partial,
    readyForControlledTextPilotPlanningClosure,
    ...AUDIT_INVARIANTS,
    nextRecommendedPhase: "8.2K-0 — Guarded Internal Pilot Runtime Implementation Plan",
    notes: [
      "8.2J epoch closed at the planning/readiness level.",
      "All six required layers verified.",
      "readyForControlledTextPilotPlanningClosure: true.",
      "Runtime implementation and public launch remain blocked until 8.2K+.",
      "7 open items recorded; none block epoch closure.",
    ],
  };
}
