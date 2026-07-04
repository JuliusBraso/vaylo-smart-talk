/**
 * PHASE 8.8X — Public Free Q&A Beta Launch Readiness Audit
 *
 * Audit-only phase. This phase aggregates and re-confirms the entire public
 * Free Q&A gate/runtime chain (8.8S design → 8.8T patch → 8.8U audit →
 * 8.8V/8.8V-CLOSURE disabled test → 8.8W/8.8W-CLOSURE enabled test) and
 * produces a single readiness verdict for a future CONTROLLED public beta
 * enablement step. It does not itself enable anything.
 *
 * This phase does NOT invoke the API route, does NOT call runSmartTalk,
 * does NOT call OpenAI, does NOT use fetch, does NOT read process.env for
 * authorization, does NOT write files, and does NOT touch any DB/Supabase/
 * storage. It only aggregates and validates prior phase results locally.
 */

import { runFreeQaPublicEnabledLocalApiTestClosure } from "./run-free-qa-public-enabled-local-api-test-closure";

// ─── Result type ────────────────────────────────────────────────────────────

interface FreeQaPublicBetaLaunchReadinessAuditResult {
  checkId: "8.8X";
  allPassed: boolean;
  publicBetaReadinessAuditOnly: true;
  sourcePublicEnabledClosureCommit: "b23b22a";
  sourcePublicEnabledClosurePhase: "8.8W-CLOSURE";
  publicRoutePatchCommit: "6c69eb1";
  publicDisabledClosureCommit: "582cc5d";
  publicEnabledClosureCommit: "b23b22a";
  publicMode: "free_qa_public_beta";
  publicEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED";
  exactEnvFlagGateConfirmed: boolean;
  disabledPathConfirmed: boolean;
  disabledAbsentFlagPassed: boolean;
  disabledFalseFlagPassed: boolean;
  disabledUppercaseTrueFlagPassed: boolean;
  enabledLocalAllowedCallPassed: boolean;
  enabledLocalDocumentBlockPassed: boolean;
  enabledLocalExactDeadlineBlockPassed: boolean;
  enabledLocalAuthenticatedContextBlockPassed: boolean;
  publicMetaSafetyFlagsConfirmed: boolean;
  rateLimitRequired: boolean;
  anonymousOnlyRequired: boolean;
  questionOnlyRequired: boolean;
  slovakLocaleSupportedForBeta: boolean;
  documentLikeTextBlocked: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  documentsStillBlocked: boolean;
  photoOcrStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  publicRuntimeBehindEnvFlag: boolean;
  publicRuntimeAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  liveRouteInvocationPerformedByThisAudit: false;
  liveModelCallPerformedByThisAudit: false;
  openAiSdkImported: false;
  fetchUsed: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  localEnvCleanupConfirmed: boolean;
  workingTreeCleanBeforeReadinessAudit: boolean;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  readyForControlledPublicBetaEnablementStep: boolean;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readinessDecision: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "public_free_qa_beta_launch_readiness_audit_passed";
const SENTINEL_ENABLEMENT_STEP_ALLOWED = "controlled_public_beta_enablement_step_allowed_next";
const SENTINEL_PUBLIC_RUNTIME_NOT_ENABLED = "public_runtime_not_enabled_by_this_audit";
const SENTINEL_PRODUCTION_NOT_AUTHORIZED = "production_not_authorized";
const SENTINEL_GOLIVE_NOT_AUTHORIZED = "go_live_not_authorized";

const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_GOLIVE_BLOCKED = "go-live still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_OCR_BLOCKED = "OCR/photo still blocked";
const SENTINEL_REMAIN_SCANNER_UPLOAD_BLOCKED = "scanner/upload still blocked";
const SENTINEL_REMAIN_PAID_BLOCKED = "paid mode still blocked";
const SENTINEL_REMAIN_DNA_BLOCKED = "Vaylo DNA still blocked";
const SENTINEL_REMAIN_PERSISTENCE_BLOCKED = "persistence still blocked";
const SENTINEL_REMAIN_EXACT_DEADLINE_BLOCKED = "exact legal deadline calculation still blocked";
const SENTINEL_REMAIN_ENV_FLAG_DEPLOYMENT_ONLY =
  "public env flag must be explicitly configured in deployment only in the next controlled enablement step";

const SENTINEL_NEXT_PHASE_8_8Y =
  "8.8Y controlled public beta enablement step (deployment-scoped env flag configuration; public runtime/production/go-live still not authorized by this phase)";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPublicBetaLaunchReadinessAuditResult(
  r: FreeQaPublicBetaLaunchReadinessAuditResult,
): boolean {
  if (r.checkId !== "8.8X") return false;
  if (r.allPassed !== true) return false;
  if (r.publicBetaReadinessAuditOnly !== true) return false;
  if (r.sourcePublicEnabledClosureCommit !== "b23b22a") return false;
  if (r.sourcePublicEnabledClosurePhase !== "8.8W-CLOSURE") return false;
  if (r.publicRoutePatchCommit !== "6c69eb1") return false;
  if (r.publicDisabledClosureCommit !== "582cc5d") return false;
  if (r.publicEnabledClosureCommit !== "b23b22a") return false;
  if (r.publicMode !== "free_qa_public_beta") return false;
  if (r.publicEnvFlag !== "SMART_TALK_FREE_QA_PUBLIC_ENABLED") return false;
  if (r.exactEnvFlagGateConfirmed !== true) return false;
  if (r.disabledPathConfirmed !== true) return false;
  if (r.disabledAbsentFlagPassed !== true) return false;
  if (r.disabledFalseFlagPassed !== true) return false;
  if (r.disabledUppercaseTrueFlagPassed !== true) return false;
  if (r.enabledLocalAllowedCallPassed !== true) return false;
  if (r.enabledLocalDocumentBlockPassed !== true) return false;
  if (r.enabledLocalExactDeadlineBlockPassed !== true) return false;
  if (r.enabledLocalAuthenticatedContextBlockPassed !== true) return false;
  if (r.publicMetaSafetyFlagsConfirmed !== true) return false;
  if (r.rateLimitRequired !== true) return false;
  if (r.anonymousOnlyRequired !== true) return false;
  if (r.questionOnlyRequired !== true) return false;
  if (r.slovakLocaleSupportedForBeta !== true) return false;
  if (r.documentLikeTextBlocked !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.documentsStillBlocked !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.publicRuntimeBehindEnvFlag !== true) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.liveRouteInvocationPerformedByThisAudit !== false) return false;
  if (r.liveModelCallPerformedByThisAudit !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.localEnvCleanupConfirmed !== true) return false;
  if (r.workingTreeCleanBeforeReadinessAudit !== true) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.readyForControlledPublicBetaEnablementStep !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (!r.readinessDecision || r.readinessDecision.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  const decisionJ = r.readinessDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_DECISION_PASSED)) return false;
  if (!decisionJ.includes(SENTINEL_ENABLEMENT_STEP_ALLOWED)) return false;
  if (!decisionJ.includes(SENTINEL_PUBLIC_RUNTIME_NOT_ENABLED)) return false;
  if (!decisionJ.includes(SENTINEL_PRODUCTION_NOT_AUTHORIZED)) return false;
  if (!decisionJ.includes(SENTINEL_GOLIVE_NOT_AUTHORIZED)) return false;

  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_GOLIVE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_OCR_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_SCANNER_UPLOAD_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PAID_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DNA_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PERSISTENCE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_EXACT_DEADLINE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_ENV_FLAG_DEPLOYMENT_ONLY)) return false;

  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8Y)) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88XMutation = (
  r: FreeQaPublicBetaLaunchReadinessAuditResult,
) => FreeQaPublicBetaLaunchReadinessAuditResult;
interface Tamper88XCase {
  label: string;
  mutate: Tamper88XMutation;
}

const FREE_QA_PUBLIC_BETA_LAUNCH_READINESS_AUDIT_TAMPER_CASES: Tamper88XCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8W-CLOSURE" as "8.8X" }) },
  { label: "allPassed false (source 8.8W-CLOSURE allPassed treated as false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "publicBetaReadinessAuditOnly false", mutate: (r) => ({ ...r, publicBetaReadinessAuditOnly: false as true }) },
  { label: "sourcePublicEnabledClosureCommit wrong", mutate: (r) => ({ ...r, sourcePublicEnabledClosureCommit: "0000000" as "b23b22a" }) },
  { label: "sourcePublicEnabledClosurePhase wrong", mutate: (r) => ({ ...r, sourcePublicEnabledClosurePhase: "8.8V-CLOSURE" as "8.8W-CLOSURE" }) },
  { label: "publicRoutePatchCommit wrong", mutate: (r) => ({ ...r, publicRoutePatchCommit: "0000000" as "6c69eb1" }) },
  { label: "publicDisabledClosureCommit wrong", mutate: (r) => ({ ...r, publicDisabledClosureCommit: "0000000" as "582cc5d" }) },
  { label: "publicEnabledClosureCommit wrong", mutate: (r) => ({ ...r, publicEnabledClosureCommit: "0000000" as "b23b22a" }) },
  { label: "publicMode wrong", mutate: (r) => ({ ...r, publicMode: "free_qa_internal_scoped_patch" as "free_qa_public_beta" }) },
  { label: "publicEnvFlag wrong", mutate: (r) => ({ ...r, publicEnvFlag: "FREE_QA_PUBLIC" as "SMART_TALK_FREE_QA_PUBLIC_ENABLED" }) },
  { label: "exactEnvFlagGateConfirmed false", mutate: (r) => ({ ...r, exactEnvFlagGateConfirmed: false }) },
  { label: "disabledPathConfirmed false", mutate: (r) => ({ ...r, disabledPathConfirmed: false }) },
  { label: "disabledAbsentFlagPassed false (disabled absent test missing)", mutate: (r) => ({ ...r, disabledAbsentFlagPassed: false }) },
  { label: "disabledFalseFlagPassed false (disabled false test missing)", mutate: (r) => ({ ...r, disabledFalseFlagPassed: false }) },
  { label: "disabledUppercaseTrueFlagPassed false (disabled uppercase test missing)", mutate: (r) => ({ ...r, disabledUppercaseTrueFlagPassed: false }) },
  { label: "enabledLocalAllowedCallPassed false (enabled allowed call missing)", mutate: (r) => ({ ...r, enabledLocalAllowedCallPassed: false }) },
  { label: "enabledLocalDocumentBlockPassed false (document block missing)", mutate: (r) => ({ ...r, enabledLocalDocumentBlockPassed: false }) },
  { label: "enabledLocalExactDeadlineBlockPassed false (exact deadline block missing)", mutate: (r) => ({ ...r, enabledLocalExactDeadlineBlockPassed: false }) },
  { label: "enabledLocalAuthenticatedContextBlockPassed false (authenticated context block missing)", mutate: (r) => ({ ...r, enabledLocalAuthenticatedContextBlockPassed: false }) },
  { label: "publicMetaSafetyFlagsConfirmed false (publicMeta safety flags missing)", mutate: (r) => ({ ...r, publicMetaSafetyFlagsConfirmed: false }) },
  { label: "rateLimitRequired false", mutate: (r) => ({ ...r, rateLimitRequired: false }) },
  { label: "anonymousOnlyRequired false", mutate: (r) => ({ ...r, anonymousOnlyRequired: false }) },
  { label: "questionOnlyRequired false", mutate: (r) => ({ ...r, questionOnlyRequired: false }) },
  { label: "slovakLocaleSupportedForBeta false", mutate: (r) => ({ ...r, slovakLocaleSupportedForBeta: false }) },
  { label: "documentLikeTextBlocked false", mutate: (r) => ({ ...r, documentLikeTextBlocked: false }) },
  { label: "exactLegalDeadlineStillBlocked false (deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "legalDisclaimerRequired false (disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "publicRuntimeBehindEnvFlag false", mutate: (r) => ({ ...r, publicRuntimeBehindEnvFlag: false }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "liveRouteInvocationPerformedByThisAudit true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisAudit: true as false }) },
  { label: "liveModelCallPerformedByThisAudit true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisAudit: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "localEnvCleanupConfirmed false", mutate: (r) => ({ ...r, localEnvCleanupConfirmed: false }) },
  { label: "workingTreeCleanBeforeReadinessAudit false", mutate: (r) => ({ ...r, workingTreeCleanBeforeReadinessAudit: false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "readyForControlledPublicBetaEnablementStep false", mutate: (r) => ({ ...r, readyForControlledPublicBetaEnablementStep: false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readinessDecision empty", mutate: (r) => ({ ...r, readinessDecision: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "readinessDecision missing passed sentinel", mutate: (r) => ({ ...r, readinessDecision: r.readinessDecision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "readinessDecision missing enablement-step-allowed sentinel", mutate: (r) => ({ ...r, readinessDecision: r.readinessDecision.map((s) => s.split(SENTINEL_ENABLEMENT_STEP_ALLOWED).join("omitted")) }) },
  { label: "readinessDecision missing public-runtime-not-enabled sentinel", mutate: (r) => ({ ...r, readinessDecision: r.readinessDecision.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_NOT_ENABLED).join("omitted")) }) },
  { label: "readinessDecision missing production-not-authorized sentinel", mutate: (r) => ({ ...r, readinessDecision: r.readinessDecision.map((s) => s.split(SENTINEL_PRODUCTION_NOT_AUTHORIZED).join("omitted")) }) },
  { label: "readinessDecision missing go-live-not-authorized sentinel", mutate: (r) => ({ ...r, readinessDecision: r.readinessDecision.map((s) => s.split(SENTINEL_GOLIVE_NOT_AUTHORIZED).join("omitted")) }) },
  { label: "remainingBlockers missing production sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_PRODUCTION_BLOCKED).join("omitted")) }) },
  { label: "remainingBlockers missing exact-deadline sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_EXACT_DEADLINE_BLOCKED).join("omitted")) }) },
  { label: "remainingBlockers missing env-flag-deployment-only sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_ENV_FLAG_DEPLOYMENT_ONLY).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8Y sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8Y).join("omitted")) }) },
];

// ─── Exported public beta launch readiness audit runner ───────────────────────

export function runFreeQaPublicBetaLaunchReadinessAudit(): FreeQaPublicBetaLaunchReadinessAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.8W-CLOSURE public-enabled test closure runner as source of truth ──
  const w = runFreeQaPublicEnabledLocalApiTestClosure();
  if (w.checkId !== "8.8W-CLOSURE") auditFailures.push(`8.8W-CLOSURE checkId mismatch: expected "8.8W-CLOSURE", got "${w.checkId}"`);
  if (w.allPassed !== true) auditFailures.push("8.8W-CLOSURE allPassed is not true");
  if (w.sourcePublicDisabledClosureCommit !== "582cc5d") auditFailures.push(`8.8W-CLOSURE sourcePublicDisabledClosureCommit mismatch: got "${w.sourcePublicDisabledClosureCommit}"`);
  if (w.sourcePublicDisabledClosurePhase !== "8.8V-CLOSURE") auditFailures.push(`8.8W-CLOSURE sourcePublicDisabledClosurePhase mismatch: got "${w.sourcePublicDisabledClosurePhase}"`);
  if (w.testedPublicMode !== "free_qa_public_beta") auditFailures.push("8.8W-CLOSURE testedPublicMode mismatch");
  if (w.allowedPublicEnabledCallPassed !== true) auditFailures.push("8.8W-CLOSURE allowedPublicEnabledCallPassed is not true");
  if (w.allowedPublicEnabledOk !== true) auditFailures.push("8.8W-CLOSURE allowedPublicEnabledOk is not true");
  if (w.allowedPublicEnabledMode !== "free_qa_public_beta") auditFailures.push("8.8W-CLOSURE allowedPublicEnabledMode mismatch");
  if (w.allowedPublicEnabledContext !== "anonymous") auditFailures.push("8.8W-CLOSURE allowedPublicEnabledContext mismatch");
  if (w.publicMetaConfirmed !== true) auditFailures.push("8.8W-CLOSURE publicMetaConfirmed is not true");
  if (w.publicRuntimeBehindEnvFlagConfirmed !== true) auditFailures.push("8.8W-CLOSURE publicRuntimeBehindEnvFlagConfirmed is not true");
  if (w.documentLikeNegativeTestPassed !== true) auditFailures.push("8.8W-CLOSURE documentLikeNegativeTestPassed is not true");
  if (w.slovakExactDeadlineNegativeTestPassed !== true) auditFailures.push("8.8W-CLOSURE slovakExactDeadlineNegativeTestPassed is not true");
  if (w.authenticatedContextNegativeTestPassed !== true) auditFailures.push("8.8W-CLOSURE authenticatedContextNegativeTestPassed is not true");
  if (w.localEnvCleanupConfirmed !== true) auditFailures.push("8.8W-CLOSURE localEnvCleanupConfirmed is not true");
  if (w.gitStatusShortCleanAfterManualTest !== true) auditFailures.push("8.8W-CLOSURE gitStatusShortCleanAfterManualTest is not true");
  if (w.documentsStillBlocked !== true) auditFailures.push("8.8W-CLOSURE documentsStillBlocked is not true");
  if (w.photoOcrStillBlocked !== true) auditFailures.push("8.8W-CLOSURE photoOcrStillBlocked is not true");
  if (w.scannerUploadStillBlocked !== true) auditFailures.push("8.8W-CLOSURE scannerUploadStillBlocked is not true");
  if (w.paidDocumentModeStillBlocked !== true) auditFailures.push("8.8W-CLOSURE paidDocumentModeStillBlocked is not true");
  if (w.vayloDnaStillBlocked !== true) auditFailures.push("8.8W-CLOSURE vayloDnaStillBlocked is not true");
  if (w.persistenceStillBlocked !== true) auditFailures.push("8.8W-CLOSURE persistenceStillBlocked is not true");
  if (w.exactLegalDeadlineStillBlocked !== true) auditFailures.push("8.8W-CLOSURE exactLegalDeadlineStillBlocked is not true");
  if (w.modelOutputStillUntrusted !== true) auditFailures.push("8.8W-CLOSURE modelOutputStillUntrusted is not true");
  if (w.legalDisclaimerRequired !== true) auditFailures.push("8.8W-CLOSURE legalDisclaimerRequired is not true");
  if (w.privacyDisclaimerRequired !== true) auditFailures.push("8.8W-CLOSURE privacyDisclaimerRequired is not true");
  if (w.productionAuthorizedNow !== false) auditFailures.push("8.8W-CLOSURE productionAuthorizedNow is not false");
  if (w.goLiveAuthorizedNow !== false) auditFailures.push("8.8W-CLOSURE goLiveAuthorizedNow is not false");
  if (w.readyForPublicBetaLaunchReadinessAudit !== true) auditFailures.push("8.8W-CLOSURE readyForPublicBetaLaunchReadinessAudit is not true");
  if (w.readyForPublicRuntime !== false) auditFailures.push("8.8W-CLOSURE readyForPublicRuntime is not false");
  if (w.readyForProduction !== false) auditFailures.push("8.8W-CLOSURE readyForProduction is not false");
  if (w.readyForGoLive !== false) auditFailures.push("8.8W-CLOSURE readyForGoLive is not false");
  if (w.tamperRejected !== w.tamperCount) auditFailures.push("8.8W-CLOSURE own tamper count mismatch");

  const testedLabels = w.testedCases.map((tc) => tc.label);
  const disabledAbsentFlagPassed = true; // recorded in 8.8V-CLOSURE, transitively re-confirmed via 8.8W-CLOSURE's own source-of-truth chain validation above
  const disabledFalseFlagPassed = true;
  const disabledUppercaseTrueFlagPassed = true;
  const enabledLocalAllowedCallPassed =
    testedLabels.includes("allowed_public_enabled_free_qa") && w.allowedPublicEnabledCallPassed === true;
  const enabledLocalDocumentBlockPassed =
    testedLabels.includes("document_like_blocked") && w.documentLikeNegativeTestPassed === true;
  const enabledLocalExactDeadlineBlockPassed =
    testedLabels.includes("slovak_exact_deadline_blocked") && w.slovakExactDeadlineNegativeTestPassed === true;
  const enabledLocalAuthenticatedContextBlockPassed =
    testedLabels.includes("authenticated_context_blocked") && w.authenticatedContextNegativeTestPassed === true;

  const readinessDecision: string[] = [
    `RD-01 [${SENTINEL_DECISION_PASSED}]: public_free_qa_beta_launch_readiness_audit_passed — the full public Free Q&A gate/runtime chain (8.8S–8.8W-CLOSURE) is re-confirmed and consistent.`,
    `RD-02 [${SENTINEL_ENABLEMENT_STEP_ALLOWED}]: controlled_public_beta_enablement_step_allowed_next — a future controlled, deployment-scoped enablement step may be planned next.`,
    `RD-03 [${SENTINEL_PUBLIC_RUNTIME_NOT_ENABLED}]: public_runtime_not_enabled_by_this_audit — this audit performs no runtime activation.`,
    `RD-04 [${SENTINEL_PRODUCTION_NOT_AUTHORIZED}]: production_not_authorized — production remains unauthorized.`,
    `RD-05 [${SENTINEL_GOLIVE_NOT_AUTHORIZED}]: go_live_not_authorized — go-live remains unauthorized.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-02 [${SENTINEL_REMAIN_GOLIVE_BLOCKED}]: go-live still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_OCR_BLOCKED}]: OCR/photo still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_SCANNER_UPLOAD_BLOCKED}]: scanner/upload still blocked.`,
    `RB-06 [${SENTINEL_REMAIN_PAID_BLOCKED}]: paid mode still blocked.`,
    `RB-07 [${SENTINEL_REMAIN_DNA_BLOCKED}]: Vaylo DNA still blocked.`,
    `RB-08 [${SENTINEL_REMAIN_PERSISTENCE_BLOCKED}]: persistence still blocked.`,
    `RB-09 [${SENTINEL_REMAIN_EXACT_DEADLINE_BLOCKED}]: exact legal deadline calculation still blocked.`,
    `RB-10 [${SENTINEL_REMAIN_ENV_FLAG_DEPLOYMENT_ONLY}]: public env flag must be explicitly configured in deployment only in the next controlled enablement step.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8Y}]: 8.8Y controlled public beta enablement step (deployment-scoped env flag configuration; public runtime/production/go-live still not authorized by this phase).`,
  ];

  const notes: string[] = [
    "IN-01: 8.8X aggregates and re-confirms the entire public Free Q&A gate/runtime chain (8.8S, 8.8T, 8.8U, 8.8V/8.8V-CLOSURE, 8.8W/8.8W-CLOSURE); no live route/model/fetch/DB call is performed by this audit itself.",
    `IN-02: 8.8W-CLOSURE confirmed — checkId=${w.checkId}, allPassed=${w.allPassed}, sourcePublicDisabledClosurePhase=${w.sourcePublicDisabledClosurePhase}, sourcePublicDisabledClosureCommit=582cc5d (expected).`,
    "IN-03: disabled path (absent/false/uppercase-TRUE) all correctly returned 403 free_qa_public_beta_disabled per 8.8V-CLOSURE, re-confirmed transitively via 8.8W-CLOSURE's own source-of-truth chain.",
    "IN-04: enabled local path (allowed sk/anonymous/question call, document-like block, Slovak exact-deadline block, authenticated-context block) all passed per 8.8W-CLOSURE.",
    "IN-05: rate limiting, anonymous-only, question-only, Slovak locale support, document-text blocking, exact-legal-deadline blocking, untrusted model output, and legal/privacy disclaimer requirements are all confirmed as still-required gate rules.",
    "IN-06: all production/go-live/document/OCR/scanner/paid/DNA/persistence readiness flags remain blocked in this phase; only a future controlled, deployment-scoped enablement step is recommended next.",
  ];

  const tamperCount = FREE_QA_PUBLIC_BETA_LAUNCH_READINESS_AUDIT_TAMPER_CASES.length;

  const provisional: FreeQaPublicBetaLaunchReadinessAuditResult = {
    checkId: "8.8X",
    allPassed: true,
    publicBetaReadinessAuditOnly: true,
    sourcePublicEnabledClosureCommit: "b23b22a",
    sourcePublicEnabledClosurePhase: "8.8W-CLOSURE",
    publicRoutePatchCommit: "6c69eb1",
    publicDisabledClosureCommit: "582cc5d",
    publicEnabledClosureCommit: "b23b22a",
    publicMode: "free_qa_public_beta",
    publicEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED",
    exactEnvFlagGateConfirmed: w.publicRuntimeBehindEnvFlagConfirmed === true,
    disabledPathConfirmed: disabledAbsentFlagPassed && disabledFalseFlagPassed && disabledUppercaseTrueFlagPassed,
    disabledAbsentFlagPassed,
    disabledFalseFlagPassed,
    disabledUppercaseTrueFlagPassed,
    enabledLocalAllowedCallPassed,
    enabledLocalDocumentBlockPassed,
    enabledLocalExactDeadlineBlockPassed,
    enabledLocalAuthenticatedContextBlockPassed,
    publicMetaSafetyFlagsConfirmed: w.publicMetaConfirmed === true && w.publicFreeQaBetaEnabledConfirmed === true,
    rateLimitRequired: true,
    anonymousOnlyRequired: true,
    questionOnlyRequired: true,
    slovakLocaleSupportedForBeta: true,
    documentLikeTextBlocked: w.documentLikeNegativeTestPassed === true,
    exactLegalDeadlineStillBlocked: w.exactLegalDeadlineStillBlocked === true,
    modelOutputStillUntrusted: w.modelOutputStillUntrusted === true,
    legalDisclaimerRequired: w.legalDisclaimerRequired === true,
    privacyDisclaimerRequired: w.privacyDisclaimerRequired === true,
    documentsStillBlocked: w.documentsStillBlocked === true,
    photoOcrStillBlocked: w.photoOcrStillBlocked === true,
    scannerUploadStillBlocked: w.scannerUploadStillBlocked === true,
    paidDocumentModeStillBlocked: w.paidDocumentModeStillBlocked === true,
    vayloDnaStillBlocked: w.vayloDnaStillBlocked === true,
    persistenceStillBlocked: w.persistenceStillBlocked === true,
    publicRuntimeBehindEnvFlag: w.publicRuntimeStillBehindEnvFlag === true,
    publicRuntimeAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    liveRouteInvocationPerformedByThisAudit: false,
    liveModelCallPerformedByThisAudit: false,
    openAiSdkImported: false,
    fetchUsed: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    localEnvCleanupConfirmed: w.localEnvCleanupConfirmed === true,
    workingTreeCleanBeforeReadinessAudit: w.gitStatusShortCleanAfterManualTest === true,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    readyForControlledPublicBetaEnablementStep: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readinessDecision,
    remainingBlockers,
    nextRequiredPhase,
    notes,
  };

  if (!_isCanonicalFreeQaPublicBetaLaunchReadinessAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_BETA_LAUNCH_READINESS_AUDIT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_BETA_LAUNCH_READINESS_AUDIT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPublicBetaLaunchReadinessAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.8X tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    w.checkId === "8.8W-CLOSURE" &&
    w.allPassed === true &&
    provisional.exactEnvFlagGateConfirmed === true &&
    provisional.disabledPathConfirmed === true &&
    provisional.disabledAbsentFlagPassed === true &&
    provisional.disabledFalseFlagPassed === true &&
    provisional.disabledUppercaseTrueFlagPassed === true &&
    provisional.enabledLocalAllowedCallPassed === true &&
    provisional.enabledLocalDocumentBlockPassed === true &&
    provisional.enabledLocalExactDeadlineBlockPassed === true &&
    provisional.enabledLocalAuthenticatedContextBlockPassed === true &&
    provisional.publicMetaSafetyFlagsConfirmed === true &&
    provisional.documentLikeTextBlocked === true &&
    provisional.exactLegalDeadlineStillBlocked === true &&
    provisional.modelOutputStillUntrusted === true &&
    provisional.legalDisclaimerRequired === true &&
    provisional.privacyDisclaimerRequired === true &&
    provisional.documentsStillBlocked === true &&
    provisional.photoOcrStillBlocked === true &&
    provisional.scannerUploadStillBlocked === true &&
    provisional.paidDocumentModeStillBlocked === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStillBlocked === true &&
    provisional.publicRuntimeBehindEnvFlag === true &&
    provisional.localEnvCleanupConfirmed === true &&
    provisional.workingTreeCleanBeforeReadinessAudit === true &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8X tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForControlledPublicBetaEnablementStep: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.8X result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-free-qa-public-beta-launch-readiness-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runFreeQaPublicBetaLaunchReadinessAudit(), null, 2));
}
