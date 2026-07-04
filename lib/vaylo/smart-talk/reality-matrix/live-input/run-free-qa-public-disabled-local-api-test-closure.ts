/**
 * PHASE 8.8V-CLOSURE — Public Disabled Local API Test Closure
 *
 * Closure/audit-only phase. This phase records the OBSERVED results of the
 * already-completed manual local 8.8V public-disabled API test and confirms
 * that all safety boundaries established through 8.8U remain intact.
 *
 * This phase does NOT invoke the API route, does NOT call runSmartTalk,
 * does NOT call OpenAI, does NOT use fetch, does NOT read process.env for
 * authorization, does NOT write files, and does NOT touch any DB/Supabase/
 * storage. It only records synthetic/manual test observations and validates
 * them locally.
 */

import { runFreeQaPublicRoutePatchSafetyAudit } from "./run-free-qa-public-route-patch-safety-audit";

// ─── Internal types ───────────────────────────────────────────────────────────

type ManualPublicDisabledTestCase = {
  label: string;
  envFlagValue: "absent" | "false" | "TRUE";
  requestMode: "free_qa_public_beta";
  expectedStatus: 403;
  expectedCode: "free_qa_public_beta_disabled";
  observedStatus: 403;
  observedCode: "free_qa_public_beta_disabled";
  passed: true;
  liveCallPerformedByThisClosure: false;
};

interface FreeQaPublicDisabledLocalApiTestClosureResult {
  checkId: "8.8V-CLOSURE";
  allPassed: boolean;
  publicDisabledLocalApiTestClosureOnly: true;
  sourceRoutePatchAuditCommit: "6c69eb1";
  sourceRoutePatchAuditPhase: "8.8U";
  manualLocalPublicDisabledApiTestPerformed: true;
  testedPublicMode: "free_qa_public_beta";
  absentFlagTestPassed: boolean;
  absentFlagStatus: 403;
  absentFlagCode: "free_qa_public_beta_disabled";
  falseFlagTestPassed: boolean;
  falseFlagStatus: 403;
  falseFlagCode: "free_qa_public_beta_disabled";
  uppercaseTrueFlagTestPassed: boolean;
  uppercaseTrueFlagStatus: 403;
  uppercaseTrueFlagCode: "free_qa_public_beta_disabled";
  exactEnvFlagGateConfirmed: boolean;
  nonExactEnvValuesRejected: boolean;
  publicRuntimeStillBlocked: boolean;
  publicRuntimeAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  documentsStillBlocked: boolean;
  photoOcrStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  liveRouteInvocationPerformedByThisClosure: false;
  liveModelCallPerformedByThisClosure: false;
  openAiSdkImported: false;
  fetchUsed: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  localEnvCleanupConfirmed: boolean;
  gitStatusShortCleanAfterManualTest: boolean;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  readyForControlledPublicEnabledLocalApiTestPlanning: boolean;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  testedCases: ManualPublicDisabledTestCase[];
  decision: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "public_disabled_local_api_test_closure_passed";
const SENTINEL_BLOCK_PUBLIC_RUNTIME = "public runtime blocked";
const SENTINEL_BLOCK_PRODUCTION = "production blocked";
const SENTINEL_BLOCK_GOLIVE = "go-live blocked";
const SENTINEL_BLOCK_DOCUMENTS = "documents blocked";
const SENTINEL_BLOCK_OCR_PHOTO = "OCR/photo blocked";
const SENTINEL_BLOCK_SCANNER_UPLOAD = "scanner/upload blocked";
const SENTINEL_BLOCK_PAID_MODE = "paid mode blocked";
const SENTINEL_BLOCK_DNA = "Vaylo DNA blocked";
const SENTINEL_BLOCK_PERSISTENCE = "persistence blocked";
const SENTINEL_BLOCK_EXACT_DEADLINE = "exact legal deadline calculation blocked";
const SENTINEL_MODEL_OUTPUT_UNTRUSTED = "model output remains untrusted";
const SENTINEL_ENV_CLEANUP_CONFIRMED = "local env cleanup confirmed";
const SENTINEL_GIT_STATUS_CLEAN = "git status clean after manual test";

const SENTINEL_REMAIN_ENABLED_PLANNING_REQUIRED = "controlled public-enabled local API test planning still required";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_GOLIVE_BLOCKED = "go-live still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED = "public runtime still blocked";

const SENTINEL_NEXT_PHASE_8_8W =
  "8.8W controlled public-enabled local API test planning (public flag still not authorized for real use)";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPublicDisabledLocalApiTestClosureResult(
  r: FreeQaPublicDisabledLocalApiTestClosureResult,
): boolean {
  if (r.checkId !== "8.8V-CLOSURE") return false;
  if (r.allPassed !== true) return false;
  if (r.publicDisabledLocalApiTestClosureOnly !== true) return false;
  if (r.sourceRoutePatchAuditCommit !== "6c69eb1") return false;
  if (r.sourceRoutePatchAuditPhase !== "8.8U") return false;
  if (r.manualLocalPublicDisabledApiTestPerformed !== true) return false;
  if (r.testedPublicMode !== "free_qa_public_beta") return false;
  if (r.absentFlagTestPassed !== true) return false;
  if (r.absentFlagStatus !== 403) return false;
  if (r.absentFlagCode !== "free_qa_public_beta_disabled") return false;
  if (r.falseFlagTestPassed !== true) return false;
  if (r.falseFlagStatus !== 403) return false;
  if (r.falseFlagCode !== "free_qa_public_beta_disabled") return false;
  if (r.uppercaseTrueFlagTestPassed !== true) return false;
  if (r.uppercaseTrueFlagStatus !== 403) return false;
  if (r.uppercaseTrueFlagCode !== "free_qa_public_beta_disabled") return false;
  if (r.exactEnvFlagGateConfirmed !== true) return false;
  if (r.nonExactEnvValuesRejected !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.documentsStillBlocked !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.liveRouteInvocationPerformedByThisClosure !== false) return false;
  if (r.liveModelCallPerformedByThisClosure !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.localEnvCleanupConfirmed !== true) return false;
  if (r.gitStatusShortCleanAfterManualTest !== true) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.readyForControlledPublicEnabledLocalApiTestPlanning !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (!Array.isArray(r.testedCases) || r.testedCases.length !== 3) return false;
  for (const tc of r.testedCases) {
    if (tc.requestMode !== "free_qa_public_beta") return false;
    if (tc.expectedStatus !== 403 || tc.observedStatus !== 403) return false;
    if (tc.expectedCode !== "free_qa_public_beta_disabled" || tc.observedCode !== "free_qa_public_beta_disabled") return false;
    if (tc.passed !== true) return false;
    if (tc.liveCallPerformedByThisClosure !== false) return false;
  }
  if (!r.decision || r.decision.length === 0) return false;
  if (!r.confirmedSafetyBoundaries || r.confirmedSafetyBoundaries.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  const decisionJ = r.decision.join(" ");
  if (!decisionJ.includes(SENTINEL_DECISION_PASSED)) return false;

  const boundariesJ = r.confirmedSafetyBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_BLOCK_PUBLIC_RUNTIME)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_PRODUCTION)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_GOLIVE)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_DOCUMENTS)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_OCR_PHOTO)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_SCANNER_UPLOAD)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_PAID_MODE)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_DNA)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_PERSISTENCE)) return false;
  if (!boundariesJ.includes(SENTINEL_BLOCK_EXACT_DEADLINE)) return false;
  if (!boundariesJ.includes(SENTINEL_MODEL_OUTPUT_UNTRUSTED)) return false;
  if (!boundariesJ.includes(SENTINEL_ENV_CLEANUP_CONFIRMED)) return false;
  if (!boundariesJ.includes(SENTINEL_GIT_STATUS_CLEAN)) return false;

  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_ENABLED_PLANNING_REQUIRED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_GOLIVE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED)) return false;

  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8W)) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88VClosureMutation = (
  r: FreeQaPublicDisabledLocalApiTestClosureResult,
) => FreeQaPublicDisabledLocalApiTestClosureResult;
interface Tamper88VClosureCase {
  label: string;
  mutate: Tamper88VClosureMutation;
}

const FREE_QA_PUBLIC_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES: Tamper88VClosureCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8U" as "8.8V-CLOSURE" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "publicDisabledLocalApiTestClosureOnly false", mutate: (r) => ({ ...r, publicDisabledLocalApiTestClosureOnly: false as true }) },
  { label: "sourceRoutePatchAuditCommit wrong", mutate: (r) => ({ ...r, sourceRoutePatchAuditCommit: "0000000" as "6c69eb1" }) },
  { label: "sourceRoutePatchAuditPhase wrong", mutate: (r) => ({ ...r, sourceRoutePatchAuditPhase: "8.8T" as "8.8U" }) },
  { label: "manualLocalPublicDisabledApiTestPerformed false", mutate: (r) => ({ ...r, manualLocalPublicDisabledApiTestPerformed: false as true }) },
  { label: "testedPublicMode wrong", mutate: (r) => ({ ...r, testedPublicMode: "free_qa_internal_scoped_patch" as "free_qa_public_beta" }) },
  { label: "absentFlagTestPassed false (absent flag treated as enabled)", mutate: (r) => ({ ...r, absentFlagTestPassed: false }) },
  { label: "absentFlagStatus wrong", mutate: (r) => ({ ...r, absentFlagStatus: 200 as 403 }) },
  { label: "absentFlagCode wrong", mutate: (r) => ({ ...r, absentFlagCode: "ok" as "free_qa_public_beta_disabled" }) },
  { label: "falseFlagTestPassed false (false flag treated as enabled)", mutate: (r) => ({ ...r, falseFlagTestPassed: false }) },
  { label: "falseFlagStatus wrong", mutate: (r) => ({ ...r, falseFlagStatus: 200 as 403 }) },
  { label: "falseFlagCode wrong", mutate: (r) => ({ ...r, falseFlagCode: "ok" as "free_qa_public_beta_disabled" }) },
  { label: "uppercaseTrueFlagTestPassed false (uppercase TRUE treated as enabled)", mutate: (r) => ({ ...r, uppercaseTrueFlagTestPassed: false }) },
  { label: "uppercaseTrueFlagStatus wrong", mutate: (r) => ({ ...r, uppercaseTrueFlagStatus: 200 as 403 }) },
  { label: "uppercaseTrueFlagCode wrong", mutate: (r) => ({ ...r, uppercaseTrueFlagCode: "ok" as "free_qa_public_beta_disabled" }) },
  { label: "exactEnvFlagGateConfirmed false", mutate: (r) => ({ ...r, exactEnvFlagGateConfirmed: false }) },
  { label: "nonExactEnvValuesRejected false", mutate: (r) => ({ ...r, nonExactEnvValuesRejected: false }) },
  { label: "publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "exactLegalDeadlineStillBlocked false (deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "liveRouteInvocationPerformedByThisClosure true", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisClosure: true as false }) },
  { label: "liveModelCallPerformedByThisClosure true", mutate: (r) => ({ ...r, liveModelCallPerformedByThisClosure: true as false }) },
  { label: "openAiSdkImported true", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "dbStorageTouched true", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "localEnvCleanupConfirmed false", mutate: (r) => ({ ...r, localEnvCleanupConfirmed: false }) },
  { label: "gitStatusShortCleanAfterManualTest false", mutate: (r) => ({ ...r, gitStatusShortCleanAfterManualTest: false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "readyForControlledPublicEnabledLocalApiTestPlanning false", mutate: (r) => ({ ...r, readyForControlledPublicEnabledLocalApiTestPlanning: false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "testedCases empty", mutate: (r) => ({ ...r, testedCases: [] }) },
  { label: "testedCases wrong count", mutate: (r) => ({ ...r, testedCases: r.testedCases.slice(0, 2) }) },
  { label: "testedCases observedStatus wrong", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, observedStatus: 200 as 403 })) }) },
  { label: "testedCases observedCode wrong", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, observedCode: "ok" as "free_qa_public_beta_disabled" })) }) },
  { label: "testedCases passed false", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, passed: false as true })) }) },
  { label: "testedCases liveCallPerformedByThisClosure true", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, liveCallPerformedByThisClosure: true as false })) }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public-runtime sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_BLOCK_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing model-output sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_MODEL_OUTPUT_UNTRUSTED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing env-cleanup sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_ENV_CLEANUP_CONFIRMED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing git-status-clean sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_GIT_STATUS_CLEAN).join("omitted")) }) },
  { label: "remainingBlockers missing enabled-planning-required sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_ENABLED_PLANNING_REQUIRED).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8W sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8W).join("omitted")) }) },
];

// ─── Exported public-disabled local API test closure runner ──────────────────

export function runFreeQaPublicDisabledLocalApiTestClosure(): FreeQaPublicDisabledLocalApiTestClosureResult {
  const closureFailures: string[] = [];

  // ── Call 8.8U public route patch safety audit runner as source of truth ──
  const u = runFreeQaPublicRoutePatchSafetyAudit();
  if (u.checkId !== "8.8U") closureFailures.push(`8.8U checkId mismatch: expected "8.8U", got "${u.checkId}"`);
  if (u.allPassed !== true) closureFailures.push("8.8U allPassed is not true");
  if (u.sourceGateDesignCommit !== "ea8082e") closureFailures.push(`8.8U sourceGateDesignCommit mismatch: got "${u.sourceGateDesignCommit}"`);
  if (u.auditedPatchPhase !== "8.8T") closureFailures.push(`8.8U auditedPatchPhase mismatch: got "${u.auditedPatchPhase}"`);
  if (u.auditedPatchFile !== "app/api/smart-talk/route.ts") closureFailures.push("8.8U auditedPatchFile mismatch");
  if (u.exactEnvFlagOnly !== true) closureFailures.push("8.8U exactEnvFlagOnly is not true");
  if (u.publicDisabledFailClosed !== true) closureFailures.push("8.8U publicDisabledFailClosed is not true");
  if (u.internalBranchStillGuarded !== true) closureFailures.push("8.8U internalBranchStillGuarded is not true");
  if (u.readyForControlledLocalPublicDisabledApiTest !== true) closureFailures.push("8.8U readyForControlledLocalPublicDisabledApiTest is not true");
  if (u.tamperRejected !== u.tamperCount) closureFailures.push("8.8U own tamper count mismatch");

  const testedCases: ManualPublicDisabledTestCase[] = [
    {
      label: "env_flag_absent",
      envFlagValue: "absent",
      requestMode: "free_qa_public_beta",
      expectedStatus: 403,
      expectedCode: "free_qa_public_beta_disabled",
      observedStatus: 403,
      observedCode: "free_qa_public_beta_disabled",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
    {
      label: "env_flag_false",
      envFlagValue: "false",
      requestMode: "free_qa_public_beta",
      expectedStatus: 403,
      expectedCode: "free_qa_public_beta_disabled",
      observedStatus: 403,
      observedCode: "free_qa_public_beta_disabled",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
    {
      label: "env_flag_uppercase_true",
      envFlagValue: "TRUE",
      requestMode: "free_qa_public_beta",
      expectedStatus: 403,
      expectedCode: "free_qa_public_beta_disabled",
      observedStatus: 403,
      observedCode: "free_qa_public_beta_disabled",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
  ];

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: public_disabled_local_api_test_closure_passed — the manual 8.8V public-disabled local API test is recorded and confirmed closed.`,
    "DS-02: This phase is closure/audit-only and performs no live route/model/fetch/DB call.",
    "DS-03: All three manual negative test cases (absent, false, uppercase TRUE) correctly failed closed with 403 free_qa_public_beta_disabled.",
  ];

  const confirmedSafetyBoundaries: string[] = [
    `SB-01 [${SENTINEL_BLOCK_PUBLIC_RUNTIME}]: public runtime blocked.`,
    `SB-02 [${SENTINEL_BLOCK_PRODUCTION}]: production blocked.`,
    `SB-03 [${SENTINEL_BLOCK_GOLIVE}]: go-live blocked.`,
    `SB-04 [${SENTINEL_BLOCK_DOCUMENTS}]: documents blocked.`,
    `SB-05 [${SENTINEL_BLOCK_OCR_PHOTO}]: OCR/photo blocked.`,
    `SB-06 [${SENTINEL_BLOCK_SCANNER_UPLOAD}]: scanner/upload blocked.`,
    `SB-07 [${SENTINEL_BLOCK_PAID_MODE}]: paid mode blocked.`,
    `SB-08 [${SENTINEL_BLOCK_DNA}]: Vaylo DNA blocked.`,
    `SB-09 [${SENTINEL_BLOCK_PERSISTENCE}]: persistence blocked.`,
    `SB-10 [${SENTINEL_BLOCK_EXACT_DEADLINE}]: exact legal deadline calculation blocked.`,
    `SB-11 [${SENTINEL_MODEL_OUTPUT_UNTRUSTED}]: model output remains untrusted.`,
    `SB-12 [${SENTINEL_ENV_CLEANUP_CONFIRMED}]: local env cleanup confirmed (SMART_TALK_FREE_QA_PUBLIC_ENABLED removed).`,
    `SB-13 [${SENTINEL_GIT_STATUS_CLEAN}]: git status clean after manual test.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_ENABLED_PLANNING_REQUIRED}]: controlled public-enabled local API test planning still required.`,
    `RB-02 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_GOLIVE_BLOCKED}]: go-live still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED}]: public runtime still blocked.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8W}]: 8.8W controlled public-enabled local API test planning (public flag still not authorized for real use).`,
  ];

  const notes: string[] = [
    "IN-01: 8.8V-CLOSURE records the observed results of the already-completed manual 8.8V public-disabled local API test; no live route/model/fetch/DB call is performed by this closure file itself.",
    `IN-02: 8.8U confirmed — checkId=${u.checkId}, allPassed=${u.allPassed}, auditedPatchPhase=${u.auditedPatchPhase}, auditedPatchFile=${u.auditedPatchFile}.`,
    "IN-03: three manual negative cases were observed — env flag absent, env flag \"false\", and env flag \"TRUE\" (uppercase) — all correctly returned 403 free_qa_public_beta_disabled without calling the model.",
    "IN-04: SMART_TALK_FREE_QA_PUBLIC_ENABLED was removed from the local environment after testing, and git status --short was confirmed clean.",
    "IN-05: all public/production/go-live/document/OCR/scanner/paid/DNA/persistence readiness flags remain blocked in this phase.",
  ];

  const tamperCount = FREE_QA_PUBLIC_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length;

  const provisional: FreeQaPublicDisabledLocalApiTestClosureResult = {
    checkId: "8.8V-CLOSURE",
    allPassed: true,
    publicDisabledLocalApiTestClosureOnly: true,
    sourceRoutePatchAuditCommit: "6c69eb1",
    sourceRoutePatchAuditPhase: "8.8U",
    manualLocalPublicDisabledApiTestPerformed: true,
    testedPublicMode: "free_qa_public_beta",
    absentFlagTestPassed: true,
    absentFlagStatus: 403,
    absentFlagCode: "free_qa_public_beta_disabled",
    falseFlagTestPassed: true,
    falseFlagStatus: 403,
    falseFlagCode: "free_qa_public_beta_disabled",
    uppercaseTrueFlagTestPassed: true,
    uppercaseTrueFlagStatus: 403,
    uppercaseTrueFlagCode: "free_qa_public_beta_disabled",
    exactEnvFlagGateConfirmed: true,
    nonExactEnvValuesRejected: true,
    publicRuntimeStillBlocked: true,
    publicRuntimeAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    documentsStillBlocked: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    exactLegalDeadlineStillBlocked: true,
    modelOutputStillUntrusted: true,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImported: false,
    fetchUsed: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    localEnvCleanupConfirmed: true,
    gitStatusShortCleanAfterManualTest: true,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    readyForControlledPublicEnabledLocalApiTestPlanning: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    testedCases,
    decision,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
  };

  if (!_isCanonicalFreeQaPublicDisabledLocalApiTestClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPublicDisabledLocalApiTestClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.8V-CLOSURE tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed =
    closureFailures.length === 0 &&
    u.checkId === "8.8U" &&
    u.allPassed === true &&
    provisional.absentFlagTestPassed === true &&
    provisional.falseFlagTestPassed === true &&
    provisional.uppercaseTrueFlagTestPassed === true &&
    provisional.exactEnvFlagGateConfirmed === true &&
    provisional.nonExactEnvValuesRejected === true &&
    provisional.publicRuntimeAuthorizedNow === false &&
    provisional.productionAuthorizedNow === false &&
    provisional.goLiveAuthorizedNow === false &&
    provisional.documentsStillBlocked === true &&
    provisional.photoOcrStillBlocked === true &&
    provisional.scannerUploadStillBlocked === true &&
    provisional.paidDocumentModeStillBlocked === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStillBlocked === true &&
    provisional.exactLegalDeadlineStillBlocked === true &&
    provisional.modelOutputStillUntrusted === true &&
    provisional.localEnvCleanupConfirmed === true &&
    provisional.gitStatusShortCleanAfterManualTest === true &&
    provisional.testedCases.length === 3 &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8V-CLOSURE tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForControlledPublicEnabledLocalApiTestPlanning: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.8V-CLOSURE result as JSON. No network/model/env-authorization
// access is performed here; only process.argv[1] is read to detect direct
// execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-free-qa-public-disabled-local-api-test-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runFreeQaPublicDisabledLocalApiTestClosure(), null, 2));
}
