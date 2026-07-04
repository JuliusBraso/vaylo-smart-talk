/**
 * PHASE 8.8W-CLOSURE — Public Enabled Local API Test Closure
 *
 * Closure/audit-only phase. This phase records the OBSERVED results of the
 * already-completed manual local 8.8W public-ENABLED API test (run with
 * SMART_TALK_FREE_QA_PUBLIC_ENABLED="true" locally) and confirms that all
 * safety boundaries established through 8.8V-CLOSURE remain intact after
 * the flag was removed again.
 *
 * This phase does NOT invoke the API route, does NOT call runSmartTalk,
 * does NOT call OpenAI, does NOT use fetch, does NOT read process.env for
 * authorization, does NOT write files, and does NOT touch any DB/Supabase/
 * storage. It only records synthetic/manual test observations and validates
 * them locally. It does NOT enable the public flag itself.
 */

import { runFreeQaPublicDisabledLocalApiTestClosure } from "./run-free-qa-public-disabled-local-api-test-closure";

// ─── Internal types ───────────────────────────────────────────────────────────

type ManualPublicEnabledTestCase = {
  label:
    | "allowed_public_enabled_free_qa"
    | "document_like_blocked"
    | "slovak_exact_deadline_blocked"
    | "authenticated_context_blocked";
  requestMode: "free_qa_public_beta";
  expectedStatus: number;
  observedStatus: number;
  expectedOutcome: string;
  observedOutcome: string;
  passed: true;
  liveCallPerformedByThisClosure: false;
};

interface FreeQaPublicEnabledLocalApiTestClosureResult {
  checkId: "8.8W-CLOSURE";
  allPassed: boolean;
  publicEnabledLocalApiTestClosureOnly: true;
  sourcePublicDisabledClosureCommit: "582cc5d";
  sourcePublicDisabledClosurePhase: "8.8V-CLOSURE";
  manualLocalPublicEnabledApiTestPerformed: true;
  testedPublicMode: "free_qa_public_beta";
  localPublicFlagValueUsedForManualTest: "true";
  allowedPublicEnabledCallPassed: boolean;
  allowedPublicEnabledStatus: 200;
  allowedPublicEnabledOk: boolean;
  allowedPublicEnabledMode: "free_qa_public_beta";
  allowedPublicEnabledContext: "anonymous";
  publicMetaConfirmed: boolean;
  publicFreeQaBetaEnabledConfirmed: boolean;
  publicRuntimeBehindEnvFlagConfirmed: boolean;
  documentLikeNegativeTestPassed: boolean;
  documentLikeNegativeStatus: 402;
  documentLikeNegativeCode: "document_mode_required";
  slovakExactDeadlineNegativeTestPassed: boolean;
  slovakExactDeadlineNegativeStatus: 402;
  slovakExactDeadlineNegativeCode: "exact_legal_deadline_calculation_blocked";
  authenticatedContextNegativeTestPassed: boolean;
  authenticatedContextNegativeStatus: 400;
  authenticatedContextNegativeError: "invalid_context";
  localEnvCleanupConfirmed: boolean;
  gitStatusShortCleanAfterManualTest: boolean;
  publicRuntimeStillBehindEnvFlag: boolean;
  publicRuntimeAuthorizedForProductionNow: false;
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
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  liveRouteInvocationPerformedByThisClosure: false;
  liveModelCallPerformedByThisClosure: false;
  openAiSdkImported: false;
  fetchUsed: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  readyForPublicBetaLaunchReadinessAudit: boolean;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  testedCases: ManualPublicEnabledTestCase[];
  decision: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "public_enabled_local_api_test_closure_passed";
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
const SENTINEL_LEGAL_DISCLAIMER = "legal disclaimer required";
const SENTINEL_PRIVACY_DISCLAIMER = "privacy disclaimer required";
const SENTINEL_ENV_CLEANUP_CONFIRMED = "local env cleanup confirmed";
const SENTINEL_GIT_STATUS_CLEAN = "git status clean after manual test";
const SENTINEL_PUBLIC_STILL_BEHIND_FLAG = "public runtime still behind exact env flag";

const SENTINEL_REMAIN_LAUNCH_AUDIT_REQUIRED = "public beta launch readiness audit still required";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_GOLIVE_BLOCKED = "go-live still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED = "public runtime still blocked in production";

const SENTINEL_NEXT_PHASE_8_8X =
  "8.8X public Free Q&A beta launch readiness audit (public runtime still not authorized for production)";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPublicEnabledLocalApiTestClosureResult(
  r: FreeQaPublicEnabledLocalApiTestClosureResult,
): boolean {
  if (r.checkId !== "8.8W-CLOSURE") return false;
  if (r.allPassed !== true) return false;
  if (r.publicEnabledLocalApiTestClosureOnly !== true) return false;
  if (r.sourcePublicDisabledClosureCommit !== "582cc5d") return false;
  if (r.sourcePublicDisabledClosurePhase !== "8.8V-CLOSURE") return false;
  if (r.manualLocalPublicEnabledApiTestPerformed !== true) return false;
  if (r.testedPublicMode !== "free_qa_public_beta") return false;
  if (r.localPublicFlagValueUsedForManualTest !== "true") return false;
  if (r.allowedPublicEnabledCallPassed !== true) return false;
  if (r.allowedPublicEnabledStatus !== 200) return false;
  if (r.allowedPublicEnabledOk !== true) return false;
  if (r.allowedPublicEnabledMode !== "free_qa_public_beta") return false;
  if (r.allowedPublicEnabledContext !== "anonymous") return false;
  if (r.publicMetaConfirmed !== true) return false;
  if (r.publicFreeQaBetaEnabledConfirmed !== true) return false;
  if (r.publicRuntimeBehindEnvFlagConfirmed !== true) return false;
  if (r.documentLikeNegativeTestPassed !== true) return false;
  if (r.documentLikeNegativeStatus !== 402) return false;
  if (r.documentLikeNegativeCode !== "document_mode_required") return false;
  if (r.slovakExactDeadlineNegativeTestPassed !== true) return false;
  if (r.slovakExactDeadlineNegativeStatus !== 402) return false;
  if (r.slovakExactDeadlineNegativeCode !== "exact_legal_deadline_calculation_blocked") return false;
  if (r.authenticatedContextNegativeTestPassed !== true) return false;
  if (r.authenticatedContextNegativeStatus !== 400) return false;
  if (r.authenticatedContextNegativeError !== "invalid_context") return false;
  if (r.localEnvCleanupConfirmed !== true) return false;
  if (r.gitStatusShortCleanAfterManualTest !== true) return false;
  if (r.publicRuntimeStillBehindEnvFlag !== true) return false;
  if (r.publicRuntimeAuthorizedForProductionNow !== false) return false;
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
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformedByThisClosure !== false) return false;
  if (r.liveModelCallPerformedByThisClosure !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.readyForPublicBetaLaunchReadinessAudit !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (!Array.isArray(r.testedCases) || r.testedCases.length !== 4) return false;
  const labels = r.testedCases.map((tc) => tc.label);
  if (!labels.includes("allowed_public_enabled_free_qa")) return false;
  if (!labels.includes("document_like_blocked")) return false;
  if (!labels.includes("slovak_exact_deadline_blocked")) return false;
  if (!labels.includes("authenticated_context_blocked")) return false;
  for (const tc of r.testedCases) {
    if (tc.requestMode !== "free_qa_public_beta") return false;
    if (tc.observedStatus !== tc.expectedStatus) return false;
    if (tc.observedOutcome !== tc.expectedOutcome) return false;
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
  if (!boundariesJ.includes(SENTINEL_LEGAL_DISCLAIMER)) return false;
  if (!boundariesJ.includes(SENTINEL_PRIVACY_DISCLAIMER)) return false;
  if (!boundariesJ.includes(SENTINEL_ENV_CLEANUP_CONFIRMED)) return false;
  if (!boundariesJ.includes(SENTINEL_GIT_STATUS_CLEAN)) return false;
  if (!boundariesJ.includes(SENTINEL_PUBLIC_STILL_BEHIND_FLAG)) return false;

  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_LAUNCH_AUDIT_REQUIRED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_GOLIVE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED)) return false;

  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8X)) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88WClosureMutation = (
  r: FreeQaPublicEnabledLocalApiTestClosureResult,
) => FreeQaPublicEnabledLocalApiTestClosureResult;
interface Tamper88WClosureCase {
  label: string;
  mutate: Tamper88WClosureMutation;
}

const FREE_QA_PUBLIC_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES: Tamper88WClosureCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8V-CLOSURE" as "8.8W-CLOSURE" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "publicEnabledLocalApiTestClosureOnly false", mutate: (r) => ({ ...r, publicEnabledLocalApiTestClosureOnly: false as true }) },
  { label: "sourcePublicDisabledClosureCommit wrong", mutate: (r) => ({ ...r, sourcePublicDisabledClosureCommit: "0000000" as "582cc5d" }) },
  { label: "sourcePublicDisabledClosurePhase wrong", mutate: (r) => ({ ...r, sourcePublicDisabledClosurePhase: "8.8U" as "8.8V-CLOSURE" }) },
  { label: "manualLocalPublicEnabledApiTestPerformed false", mutate: (r) => ({ ...r, manualLocalPublicEnabledApiTestPerformed: false as true }) },
  { label: "testedPublicMode wrong", mutate: (r) => ({ ...r, testedPublicMode: "free_qa_internal_scoped_patch" as "free_qa_public_beta" }) },
  { label: "localPublicFlagValueUsedForManualTest wrong", mutate: (r) => ({ ...r, localPublicFlagValueUsedForManualTest: "TRUE" as "true" }) },
  { label: "allowedPublicEnabledCallPassed false", mutate: (r) => ({ ...r, allowedPublicEnabledCallPassed: false }) },
  { label: "allowedPublicEnabledStatus wrong", mutate: (r) => ({ ...r, allowedPublicEnabledStatus: 403 as 200 }) },
  { label: "allowedPublicEnabledOk false (allowed test not ok)", mutate: (r) => ({ ...r, allowedPublicEnabledOk: false }) },
  { label: "allowedPublicEnabledMode wrong", mutate: (r) => ({ ...r, allowedPublicEnabledMode: "free_qa_internal_scoped_patch" as "free_qa_public_beta" }) },
  { label: "allowedPublicEnabledContext wrong", mutate: (r) => ({ ...r, allowedPublicEnabledContext: "authenticated" as "anonymous" }) },
  { label: "publicMetaConfirmed false", mutate: (r) => ({ ...r, publicMetaConfirmed: false }) },
  { label: "publicFreeQaBetaEnabledConfirmed false", mutate: (r) => ({ ...r, publicFreeQaBetaEnabledConfirmed: false }) },
  { label: "publicRuntimeBehindEnvFlagConfirmed false", mutate: (r) => ({ ...r, publicRuntimeBehindEnvFlagConfirmed: false }) },
  { label: "documentLikeNegativeTestPassed false", mutate: (r) => ({ ...r, documentLikeNegativeTestPassed: false }) },
  { label: "documentLikeNegativeStatus wrong", mutate: (r) => ({ ...r, documentLikeNegativeStatus: 200 as 402 }) },
  { label: "documentLikeNegativeCode wrong", mutate: (r) => ({ ...r, documentLikeNegativeCode: "ok" as "document_mode_required" }) },
  { label: "slovakExactDeadlineNegativeTestPassed false", mutate: (r) => ({ ...r, slovakExactDeadlineNegativeTestPassed: false }) },
  { label: "slovakExactDeadlineNegativeStatus wrong", mutate: (r) => ({ ...r, slovakExactDeadlineNegativeStatus: 200 as 402 }) },
  { label: "slovakExactDeadlineNegativeCode wrong", mutate: (r) => ({ ...r, slovakExactDeadlineNegativeCode: "ok" as "exact_legal_deadline_calculation_blocked" }) },
  { label: "authenticatedContextNegativeTestPassed false", mutate: (r) => ({ ...r, authenticatedContextNegativeTestPassed: false }) },
  { label: "authenticatedContextNegativeStatus wrong", mutate: (r) => ({ ...r, authenticatedContextNegativeStatus: 200 as 400 }) },
  { label: "authenticatedContextNegativeError wrong", mutate: (r) => ({ ...r, authenticatedContextNegativeError: "ok" as "invalid_context" }) },
  { label: "localEnvCleanupConfirmed false", mutate: (r) => ({ ...r, localEnvCleanupConfirmed: false }) },
  { label: "gitStatusShortCleanAfterManualTest false", mutate: (r) => ({ ...r, gitStatusShortCleanAfterManualTest: false }) },
  { label: "publicRuntimeStillBehindEnvFlag false", mutate: (r) => ({ ...r, publicRuntimeStillBehindEnvFlag: false }) },
  { label: "publicRuntimeAuthorizedForProductionNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedForProductionNow: true as false }) },
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
  { label: "legalDisclaimerRequired false", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisClosure true", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisClosure: true as false }) },
  { label: "liveModelCallPerformedByThisClosure true", mutate: (r) => ({ ...r, liveModelCallPerformedByThisClosure: true as false }) },
  { label: "openAiSdkImported true", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "dbStorageTouched true", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "readyForPublicBetaLaunchReadinessAudit false", mutate: (r) => ({ ...r, readyForPublicBetaLaunchReadinessAudit: false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "testedCases empty", mutate: (r) => ({ ...r, testedCases: [] }) },
  { label: "testedCases wrong count", mutate: (r) => ({ ...r, testedCases: r.testedCases.slice(0, 3) }) },
  { label: "testedCases missing allowed_public_enabled_free_qa label", mutate: (r) => ({ ...r, testedCases: r.testedCases.filter((tc) => tc.label !== "allowed_public_enabled_free_qa") }) },
  { label: "testedCases missing document_like_blocked label", mutate: (r) => ({ ...r, testedCases: r.testedCases.filter((tc) => tc.label !== "document_like_blocked") }) },
  { label: "testedCases missing slovak_exact_deadline_blocked label", mutate: (r) => ({ ...r, testedCases: r.testedCases.filter((tc) => tc.label !== "slovak_exact_deadline_blocked") }) },
  { label: "testedCases missing authenticated_context_blocked label", mutate: (r) => ({ ...r, testedCases: r.testedCases.filter((tc) => tc.label !== "authenticated_context_blocked") }) },
  { label: "testedCases observedStatus mismatched", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, observedStatus: tc.expectedStatus + 1 })) }) },
  { label: "testedCases observedOutcome mismatched", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, observedOutcome: `${tc.expectedOutcome}_tampered` })) }) },
  { label: "testedCases passed false", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, passed: false as true })) }) },
  { label: "testedCases liveCallPerformedByThisClosure true", mutate: (r) => ({ ...r, testedCases: r.testedCases.map((tc) => ({ ...tc, liveCallPerformedByThisClosure: true as false })) }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing model-output sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_MODEL_OUTPUT_UNTRUSTED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing legal-disclaimer sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_LEGAL_DISCLAIMER).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing privacy-disclaimer sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PRIVACY_DISCLAIMER).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing env-cleanup sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_ENV_CLEANUP_CONFIRMED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing git-status-clean sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_GIT_STATUS_CLEAN).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public-still-behind-flag sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PUBLIC_STILL_BEHIND_FLAG).join("omitted")) }) },
  { label: "remainingBlockers missing launch-audit-required sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_LAUNCH_AUDIT_REQUIRED).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8X sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8X).join("omitted")) }) },
];

// ─── Exported public-enabled local API test closure runner ───────────────────

export function runFreeQaPublicEnabledLocalApiTestClosure(): FreeQaPublicEnabledLocalApiTestClosureResult {
  const closureFailures: string[] = [];

  // ── Call 8.8V-CLOSURE public-disabled test closure runner as source of truth ──
  const v = runFreeQaPublicDisabledLocalApiTestClosure();
  if (v.checkId !== "8.8V-CLOSURE") closureFailures.push(`8.8V-CLOSURE checkId mismatch: expected "8.8V-CLOSURE", got "${v.checkId}"`);
  if (v.allPassed !== true) closureFailures.push("8.8V-CLOSURE allPassed is not true");
  if (v.sourceRoutePatchAuditCommit !== "6c69eb1") closureFailures.push(`8.8V-CLOSURE sourceRoutePatchAuditCommit mismatch: got "${v.sourceRoutePatchAuditCommit}"`);
  if (v.sourceRoutePatchAuditPhase !== "8.8U") closureFailures.push(`8.8V-CLOSURE sourceRoutePatchAuditPhase mismatch: got "${v.sourceRoutePatchAuditPhase}"`);
  if (v.exactEnvFlagGateConfirmed !== true) closureFailures.push("8.8V-CLOSURE exactEnvFlagGateConfirmed is not true");
  if (v.nonExactEnvValuesRejected !== true) closureFailures.push("8.8V-CLOSURE nonExactEnvValuesRejected is not true");
  if (v.localEnvCleanupConfirmed !== true) closureFailures.push("8.8V-CLOSURE localEnvCleanupConfirmed is not true");
  if (v.gitStatusShortCleanAfterManualTest !== true) closureFailures.push("8.8V-CLOSURE gitStatusShortCleanAfterManualTest is not true");
  if (v.readyForControlledPublicEnabledLocalApiTestPlanning !== true) closureFailures.push("8.8V-CLOSURE readyForControlledPublicEnabledLocalApiTestPlanning is not true");
  if (v.tamperRejected !== v.tamperCount) closureFailures.push("8.8V-CLOSURE own tamper count mismatch");

  const testedCases: ManualPublicEnabledTestCase[] = [
    {
      label: "allowed_public_enabled_free_qa",
      requestMode: "free_qa_public_beta",
      expectedStatus: 200,
      observedStatus: 200,
      expectedOutcome: "ok_true_mode_free_qa_public_beta_context_anonymous_public_meta_confirmed",
      observedOutcome: "ok_true_mode_free_qa_public_beta_context_anonymous_public_meta_confirmed",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
    {
      label: "document_like_blocked",
      requestMode: "free_qa_public_beta",
      expectedStatus: 402,
      observedStatus: 402,
      expectedOutcome: "document_mode_required",
      observedOutcome: "document_mode_required",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
    {
      label: "slovak_exact_deadline_blocked",
      requestMode: "free_qa_public_beta",
      expectedStatus: 402,
      observedStatus: 402,
      expectedOutcome: "exact_legal_deadline_calculation_blocked",
      observedOutcome: "exact_legal_deadline_calculation_blocked",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
    {
      label: "authenticated_context_blocked",
      requestMode: "free_qa_public_beta",
      expectedStatus: 400,
      observedStatus: 400,
      expectedOutcome: "invalid_context",
      observedOutcome: "invalid_context",
      passed: true,
      liveCallPerformedByThisClosure: false,
    },
  ];

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: public_enabled_local_api_test_closure_passed — the manual 8.8W public-enabled local API test is recorded and confirmed closed.`,
    "DS-02: This phase is closure/audit-only and performs no live route/model/fetch/DB call.",
    "DS-03: The allowed public-enabled call returned ok/free_qa_public_beta/anonymous with all safety metadata confirmed; document-like, Slovak exact-deadline, and authenticated-context negative tests all correctly failed closed.",
  ];

  const confirmedSafetyBoundaries: string[] = [
    `SB-01 [${SENTINEL_BLOCK_PRODUCTION}]: production blocked.`,
    `SB-02 [${SENTINEL_BLOCK_GOLIVE}]: go-live blocked.`,
    `SB-03 [${SENTINEL_BLOCK_DOCUMENTS}]: documents blocked.`,
    `SB-04 [${SENTINEL_BLOCK_OCR_PHOTO}]: OCR/photo blocked.`,
    `SB-05 [${SENTINEL_BLOCK_SCANNER_UPLOAD}]: scanner/upload blocked.`,
    `SB-06 [${SENTINEL_BLOCK_PAID_MODE}]: paid mode blocked.`,
    `SB-07 [${SENTINEL_BLOCK_DNA}]: Vaylo DNA blocked.`,
    `SB-08 [${SENTINEL_BLOCK_PERSISTENCE}]: persistence blocked.`,
    `SB-09 [${SENTINEL_BLOCK_EXACT_DEADLINE}]: exact legal deadline calculation blocked.`,
    `SB-10 [${SENTINEL_MODEL_OUTPUT_UNTRUSTED}]: model output remains untrusted.`,
    `SB-11 [${SENTINEL_LEGAL_DISCLAIMER}]: legal disclaimer required.`,
    `SB-12 [${SENTINEL_PRIVACY_DISCLAIMER}]: privacy disclaimer required.`,
    `SB-13 [${SENTINEL_ENV_CLEANUP_CONFIRMED}]: local env cleanup confirmed (SMART_TALK_FREE_QA_PUBLIC_ENABLED removed).`,
    `SB-14 [${SENTINEL_GIT_STATUS_CLEAN}]: git status clean after manual test.`,
    `SB-15 [${SENTINEL_PUBLIC_STILL_BEHIND_FLAG}]: public runtime still behind exact env flag.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_LAUNCH_AUDIT_REQUIRED}]: public beta launch readiness audit still required.`,
    `RB-02 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_GOLIVE_BLOCKED}]: go-live still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_PUBLIC_RUNTIME_BLOCKED}]: public runtime still blocked in production.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8X}]: 8.8X public Free Q&A beta launch readiness audit (public runtime still not authorized for production).`,
  ];

  const notes: string[] = [
    "IN-01: 8.8W-CLOSURE records the observed results of the already-completed manual 8.8W public-enabled local API test; no live route/model/fetch/DB call is performed by this closure file itself.",
    `IN-02: 8.8V-CLOSURE confirmed — checkId=${v.checkId}, allPassed=${v.allPassed}, sourceRoutePatchAuditPhase=${v.sourceRoutePatchAuditPhase}, sourceRoutePatchAuditCommit=582cc5d (expected).`,
    "IN-03: allowed public-enabled call (sk/anonymous/question, SMART_TALK_FREE_QA_PUBLIC_ENABLED=\"true\") returned ok=true, mode=free_qa_public_beta, context=anonymous, with all publicMeta safety flags confirmed true.",
    "IN-04: document-like (402/document_mode_required), Slovak exact-deadline (402/exact_legal_deadline_calculation_blocked), and authenticated-context (400/invalid_context) negative cases all correctly failed closed.",
    "IN-05: SMART_TALK_FREE_QA_PUBLIC_ENABLED was removed from the local environment after testing, and git status --short was confirmed clean.",
    "IN-06: all production/go-live/document/OCR/scanner/paid/DNA/persistence readiness flags remain blocked in this phase.",
  ];

  const tamperCount = FREE_QA_PUBLIC_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length;

  const provisional: FreeQaPublicEnabledLocalApiTestClosureResult = {
    checkId: "8.8W-CLOSURE",
    allPassed: true,
    publicEnabledLocalApiTestClosureOnly: true,
    sourcePublicDisabledClosureCommit: "582cc5d",
    sourcePublicDisabledClosurePhase: "8.8V-CLOSURE",
    manualLocalPublicEnabledApiTestPerformed: true,
    testedPublicMode: "free_qa_public_beta",
    localPublicFlagValueUsedForManualTest: "true",
    allowedPublicEnabledCallPassed: true,
    allowedPublicEnabledStatus: 200,
    allowedPublicEnabledOk: true,
    allowedPublicEnabledMode: "free_qa_public_beta",
    allowedPublicEnabledContext: "anonymous",
    publicMetaConfirmed: true,
    publicFreeQaBetaEnabledConfirmed: true,
    publicRuntimeBehindEnvFlagConfirmed: true,
    documentLikeNegativeTestPassed: true,
    documentLikeNegativeStatus: 402,
    documentLikeNegativeCode: "document_mode_required",
    slovakExactDeadlineNegativeTestPassed: true,
    slovakExactDeadlineNegativeStatus: 402,
    slovakExactDeadlineNegativeCode: "exact_legal_deadline_calculation_blocked",
    authenticatedContextNegativeTestPassed: true,
    authenticatedContextNegativeStatus: 400,
    authenticatedContextNegativeError: "invalid_context",
    localEnvCleanupConfirmed: true,
    gitStatusShortCleanAfterManualTest: true,
    publicRuntimeStillBehindEnvFlag: true,
    publicRuntimeAuthorizedForProductionNow: false,
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
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImported: false,
    fetchUsed: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    readyForPublicBetaLaunchReadinessAudit: true,
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

  if (!_isCanonicalFreeQaPublicEnabledLocalApiTestClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPublicEnabledLocalApiTestClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.8W-CLOSURE tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed =
    closureFailures.length === 0 &&
    v.checkId === "8.8V-CLOSURE" &&
    v.allPassed === true &&
    provisional.allowedPublicEnabledCallPassed === true &&
    provisional.allowedPublicEnabledOk === true &&
    provisional.allowedPublicEnabledMode === "free_qa_public_beta" &&
    provisional.allowedPublicEnabledContext === "anonymous" &&
    provisional.publicMetaConfirmed === true &&
    provisional.publicRuntimeBehindEnvFlagConfirmed === true &&
    provisional.documentLikeNegativeTestPassed === true &&
    provisional.slovakExactDeadlineNegativeTestPassed === true &&
    provisional.authenticatedContextNegativeTestPassed === true &&
    provisional.localEnvCleanupConfirmed === true &&
    provisional.gitStatusShortCleanAfterManualTest === true &&
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
    provisional.legalDisclaimerRequired === true &&
    provisional.privacyDisclaimerRequired === true &&
    provisional.testedCases.length === 4 &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8W-CLOSURE tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForPublicBetaLaunchReadinessAudit: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.8W-CLOSURE result as JSON. No network/model/env-authorization
// access is performed here; only process.argv[1] is read to detect direct
// execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-free-qa-public-enabled-local-api-test-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runFreeQaPublicEnabledLocalApiTestClosure(), null, 2));
}
