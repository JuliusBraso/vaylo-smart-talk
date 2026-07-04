/**
 * PHASE 8.8Q — Post-Invocation Audit / Internal Test Closure
 *
 * Audit-only phase. This phase audits the completed 8.8P manual local
 * internal Free Q&A API invocation (observed results supplied as literal
 * constants below) and closes out the first controlled internal test cycle.
 * It re-confirms the 8.8O first controlled internal test run readiness chain
 * as source of truth.
 *
 * This phase does NOT perform a live API call, does NOT perform a model
 * call, does NOT execute the route handler, does NOT modify route behavior,
 * and does NOT modify runSmartTalk.
 */

import { runFreeQaFirstControlledInternalTestRun } from "./run-free-qa-first-controlled-internal-test-run";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaPostInvocationAuditResult {
  checkId: "8.8Q";
  allPassed: boolean;
  postInvocationAuditOnly: true;
  internalTestClosureOnly: true;
  sourceAuthorizationPhase: "8.8O";
  sourceAuthorizationCommit: "d865f7d";
  sourceAuditPhase: "8.8N";
  sourceAuditCommit: "3698e12";
  sourcePatchPhase: "8.8M";
  sourcePatchCommit: "ffaef73";
  manualLocalInternalApiInvocationPerformed: true;
  allowedInternalFreeQaCallPassed: true;
  allowedInternalFreeQaStatus: 200;
  allowedInternalFreeQaOk: true;
  allowedInternalFreeQaMode: "free_qa_internal_scoped_patch";
  allowedInternalFreeQaContext: "anonymous";
  allowedInternalFreeQaResultExists: true;
  documentLikeNegativeTestPassed: true;
  documentLikeNegativeTestStatus: 402;
  documentLikeNegativeTestCode: "document_mode_required";
  badAuthNegativeTestPassed: true;
  badAuthNegativeTestStatus: 403;
  badAuthNegativeTestCode: "free_qa_patch_internal_auth_failed";
  publicRuntimeAuthorizedNow: false;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  documentsStillBlocked: true;
  documentLikeTextBlockedBeforeModelCall: true;
  photoOcrStillBlocked: true;
  scannerUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  exactLegalDeadlineCalculationStillBlocked: true;
  modelOutputStillUntrusted: true;
  eightEightLAuthorizationConfirmed: true;
  eightThreeAcNotRun: true;
  powershellMojibakeObserved: true;
  powershellMojibakeBlocking: false;
  futureEncodingCheckRecommended: true;
  internalFreeQaManualLocalInvocationClosed: true;
  readyForControlledInternalRegressionPack: true;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForDocuments: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPaidDocumentMode: false;
  readyForVayloDna: false;
  readyForPersistence: false;
  decision: string[];
  confirmedInvocationResults: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
  freeQaPostInvocationAuditTamperCaseCount: number;
  freeQaPostInvocationAuditTamperCasesRejected: number;
  freeQaPostInvocationAuditTamperCoveragePassing: true;
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED =
  "post_invocation_audit_passed_for_manual_local_internal_free_qa_only";
const SENTINEL_ALLOWED_CALL_PASSED = "allowed internal Free Q&A call passed";
const SENTINEL_DOC_LIKE_BLOCKED =
  "document-like negative test blocked with document_mode_required";
const SENTINEL_BAD_AUTH_BLOCKED =
  "bad-auth negative test blocked with free_qa_patch_internal_auth_failed";
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
const SENTINEL_REMAIN_PUBLIC_STILL_BLOCKED = "public runtime still blocked";
const SENTINEL_REMAIN_PRODUCTION_STILL_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_DOCUMENTS_STILL_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_OCR_STILL_BLOCKED = "OCR/photo still blocked";
const SENTINEL_REMAIN_PAID_STILL_BLOCKED = "paid mode still blocked";
const SENTINEL_REMAIN_DNA_STILL_BLOCKED = "Vaylo DNA still blocked";
const SENTINEL_REMAIN_PERSISTENCE_STILL_BLOCKED = "persistence still blocked";
const SENTINEL_REMAIN_LOCALIZATION_PENDING = "localization hardening still pending";
const SENTINEL_REMAIN_UX_PENDING = "UX/public beta still pending";
const SENTINEL_REMAIN_REGRESSION_REQUIRED =
  "regression pack still required before broader testing";
const SENTINEL_NEXT_PHASE_8_8R = "8.8R controlled internal Free Q&A regression pack";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPostInvocationAuditResult(
  r: FreeQaPostInvocationAuditResult,
): boolean {
  if (r.checkId !== "8.8Q") return false;
  if (r.allPassed !== true) return false;
  if (r.postInvocationAuditOnly !== true) return false;
  if (r.internalTestClosureOnly !== true) return false;
  if (r.sourceAuthorizationPhase !== "8.8O") return false;
  if (r.sourceAuthorizationCommit !== "d865f7d") return false;
  if (r.sourceAuditPhase !== "8.8N") return false;
  if (r.sourceAuditCommit !== "3698e12") return false;
  if (r.sourcePatchPhase !== "8.8M") return false;
  if (r.sourcePatchCommit !== "ffaef73") return false;
  if (r.manualLocalInternalApiInvocationPerformed !== true) return false;
  if (r.allowedInternalFreeQaCallPassed !== true) return false;
  if (r.allowedInternalFreeQaStatus !== 200) return false;
  if (r.allowedInternalFreeQaOk !== true) return false;
  if (r.allowedInternalFreeQaMode !== "free_qa_internal_scoped_patch") return false;
  if (r.allowedInternalFreeQaContext !== "anonymous") return false;
  if (r.allowedInternalFreeQaResultExists !== true) return false;
  if (r.documentLikeNegativeTestPassed !== true) return false;
  if (r.documentLikeNegativeTestStatus !== 402) return false;
  if (r.documentLikeNegativeTestCode !== "document_mode_required") return false;
  if (r.badAuthNegativeTestPassed !== true) return false;
  if (r.badAuthNegativeTestStatus !== 403) return false;
  if (r.badAuthNegativeTestCode !== "free_qa_patch_internal_auth_failed") return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.documentsStillBlocked !== true) return false;
  if (r.documentLikeTextBlockedBeforeModelCall !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.exactLegalDeadlineCalculationStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.eightEightLAuthorizationConfirmed !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.powershellMojibakeObserved !== true) return false;
  if (r.powershellMojibakeBlocking !== false) return false;
  if (r.futureEncodingCheckRecommended !== true) return false;
  if (r.internalFreeQaManualLocalInvocationClosed !== true) return false;
  if (r.readyForControlledInternalRegressionPack !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForDocuments !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPaidDocumentMode !== false) return false;
  if (r.readyForVayloDna !== false) return false;
  if (r.readyForPersistence !== false) return false;
  if (!r.decision || r.decision.length === 0) return false;
  if (!r.confirmedInvocationResults || r.confirmedInvocationResults.length === 0) return false;
  if (!r.confirmedSafetyBoundaries || r.confirmedSafetyBoundaries.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  const decisionJ = r.decision.join(" ");
  if (!decisionJ.includes(SENTINEL_DECISION_PASSED)) return false;
  const invocJ = r.confirmedInvocationResults.join(" ");
  if (!invocJ.includes(SENTINEL_ALLOWED_CALL_PASSED)) return false;
  if (!invocJ.includes(SENTINEL_DOC_LIKE_BLOCKED)) return false;
  if (!invocJ.includes(SENTINEL_BAD_AUTH_BLOCKED)) return false;
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
  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_OCR_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PAID_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DNA_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PERSISTENCE_STILL_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_LOCALIZATION_PENDING)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_UX_PENDING)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_REGRESSION_REQUIRED)) return false;
  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8R)) return false;
  if (
    r.freeQaPostInvocationAuditTamperCasesRejected !==
    r.freeQaPostInvocationAuditTamperCaseCount
  ) {
    return false;
  }
  if (r.freeQaPostInvocationAuditTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88QMutation = (
  r: FreeQaPostInvocationAuditResult,
) => FreeQaPostInvocationAuditResult;
interface Tamper88QCase {
  label: string;
  mutate: Tamper88QMutation;
}

const FREE_QA_POST_INVOCATION_AUDIT_TAMPER_CASES: Tamper88QCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8O" as "8.8Q" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "postInvocationAuditOnly false", mutate: (r) => ({ ...r, postInvocationAuditOnly: false as true }) },
  { label: "internalTestClosureOnly false", mutate: (r) => ({ ...r, internalTestClosureOnly: false as true }) },
  { label: "sourceAuthorizationPhase wrong", mutate: (r) => ({ ...r, sourceAuthorizationPhase: "8.8N" as "8.8O" }) },
  { label: "sourceAuthorizationCommit wrong", mutate: (r) => ({ ...r, sourceAuthorizationCommit: "0000000" as "d865f7d" }) },
  { label: "sourceAuditCommit wrong", mutate: (r) => ({ ...r, sourceAuditCommit: "0000000" as "3698e12" }) },
  { label: "sourcePatchCommit wrong", mutate: (r) => ({ ...r, sourcePatchCommit: "0000000" as "ffaef73" }) },
  { label: "manualLocalInternalApiInvocationPerformed false", mutate: (r) => ({ ...r, manualLocalInternalApiInvocationPerformed: false as true }) },
  { label: "allowedInternalFreeQaCallPassed false", mutate: (r) => ({ ...r, allowedInternalFreeQaCallPassed: false as true }) },
  { label: "allowedInternalFreeQaStatus wrong", mutate: (r) => ({ ...r, allowedInternalFreeQaStatus: 500 as 200 }) },
  { label: "allowedInternalFreeQaOk false", mutate: (r) => ({ ...r, allowedInternalFreeQaOk: false as true }) },
  { label: "allowedInternalFreeQaMode wrong", mutate: (r) => ({ ...r, allowedInternalFreeQaMode: "public_smart_talk" as "free_qa_internal_scoped_patch" }) },
  { label: "allowedInternalFreeQaContext wrong", mutate: (r) => ({ ...r, allowedInternalFreeQaContext: "public" as "anonymous" }) },
  { label: "allowedInternalFreeQaResultExists false", mutate: (r) => ({ ...r, allowedInternalFreeQaResultExists: false as true }) },
  { label: "documentLikeNegativeTestPassed false", mutate: (r) => ({ ...r, documentLikeNegativeTestPassed: false as true }) },
  { label: "documentLikeNegativeTestStatus wrong", mutate: (r) => ({ ...r, documentLikeNegativeTestStatus: 200 as 402 }) },
  { label: "documentLikeNegativeTestCode wrong", mutate: (r) => ({ ...r, documentLikeNegativeTestCode: "ok" as "document_mode_required" }) },
  { label: "badAuthNegativeTestPassed false", mutate: (r) => ({ ...r, badAuthNegativeTestPassed: false as true }) },
  { label: "badAuthNegativeTestStatus wrong", mutate: (r) => ({ ...r, badAuthNegativeTestStatus: 200 as 403 }) },
  { label: "badAuthNegativeTestCode wrong", mutate: (r) => ({ ...r, badAuthNegativeTestCode: "ok" as "free_qa_patch_internal_auth_failed" }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false as true }) },
  { label: "documentLikeTextBlockedBeforeModelCall false", mutate: (r) => ({ ...r, documentLikeTextBlockedBeforeModelCall: false as true }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "exactLegalDeadlineCalculationStillBlocked false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationStillBlocked: false as true }) },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "eightEightLAuthorizationConfirmed false", mutate: (r) => ({ ...r, eightEightLAuthorizationConfirmed: false as true }) },
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "powershellMojibakeBlocking true", mutate: (r) => ({ ...r, powershellMojibakeBlocking: true as false }) },
  { label: "internalFreeQaManualLocalInvocationClosed false", mutate: (r) => ({ ...r, internalFreeQaManualLocalInvocationClosed: false as true }) },
  { label: "readyForControlledInternalRegressionPack false", mutate: (r) => ({ ...r, readyForControlledInternalRegressionPack: false as true }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForDocuments true", mutate: (r) => ({ ...r, readyForDocuments: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPaidDocumentMode true", mutate: (r) => ({ ...r, readyForPaidDocumentMode: true as false }) },
  { label: "readyForVayloDna true", mutate: (r) => ({ ...r, readyForVayloDna: true as false }) },
  { label: "readyForPersistence true", mutate: (r) => ({ ...r, readyForPersistence: true as false }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedInvocationResults empty", mutate: (r) => ({ ...r, confirmedInvocationResults: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "confirmedInvocationResults missing allowed-call sentinel", mutate: (r) => ({ ...r, confirmedInvocationResults: r.confirmedInvocationResults.map((s) => s.split(SENTINEL_ALLOWED_CALL_PASSED).join("omitted")) }) },
  { label: "confirmedInvocationResults missing doc-like sentinel", mutate: (r) => ({ ...r, confirmedInvocationResults: r.confirmedInvocationResults.map((s) => s.split(SENTINEL_DOC_LIKE_BLOCKED).join("omitted")) }) },
  { label: "confirmedInvocationResults missing bad-auth sentinel", mutate: (r) => ({ ...r, confirmedInvocationResults: r.confirmedInvocationResults.map((s) => s.split(SENTINEL_BAD_AUTH_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public runtime blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_BLOCK_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing model output untrusted sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_MODEL_OUTPUT_UNTRUSTED).join("omitted")) }) },
  { label: "remainingBlockers missing regression pack sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_REGRESSION_REQUIRED).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8R sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8R).join("omitted")) }) },
  { label: "freeQaPostInvocationAuditTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaPostInvocationAuditTamperCoveragePassing: false as true }) },
  { label: "freeQaPostInvocationAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaPostInvocationAuditTamperCasesRejected: r.freeQaPostInvocationAuditTamperCasesRejected - 1 }) },
];

// ─── Exported post-invocation audit runner ────────────────────────────────────

/**
 * Free Smart Talk Q&A Post-Invocation Audit / Internal Test Closure runner
 * for 8.8Q.
 *
 * Calls the 8.8O first controlled internal test run readiness runner to
 * re-confirm the authorization chain, then audits the observed results of
 * the completed 8.8P manual local internal API invocation (allowed call,
 * document-like negative test, bad-auth negative test) and closes the
 * first controlled internal test cycle. Does not perform any live route
 * or model call itself.
 */
export function runFreeQaPostInvocationAudit(): FreeQaPostInvocationAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.8O readiness runner as source of truth ──────────────────────
  const o = runFreeQaFirstControlledInternalTestRun();
  if (o.checkId !== "8.8O") auditFailures.push(`8.8O checkId mismatch: expected "8.8O", got "${o.checkId}"`);
  if (o.allPassed !== true) auditFailures.push("8.8O allPassed is not true");
  if (o.sourceAuditCommit !== "3698e12") auditFailures.push(`8.8O sourceAuditCommit mismatch: got "${o.sourceAuditCommit}"`);
  if (o.sourcePatchCommit !== "ffaef73") auditFailures.push(`8.8O sourcePatchCommit mismatch: got "${o.sourcePatchCommit}"`);
  if (o.liveRouteInvocationPerformed !== false) auditFailures.push("8.8O liveRouteInvocationPerformed is not false");
  if (o.liveModelCallPerformed !== false) auditFailures.push("8.8O liveModelCallPerformed is not false");
  if (o.publicRuntimeStillBlocked !== true) auditFailures.push("8.8O publicRuntimeStillBlocked is not true");
  if (o.productionAuthorizedNow !== false) auditFailures.push("8.8O productionAuthorizedNow is not false");
  if (o.goLiveAuthorizedNow !== false) auditFailures.push("8.8O goLiveAuthorizedNow is not false");
  if (o.documentsStillBlocked !== true) auditFailures.push("8.8O documentsStillBlocked is not true");
  if (o.photoOcrStillBlocked !== true) auditFailures.push("8.8O photoOcrStillBlocked is not true");
  if (o.scannerUploadStillBlocked !== true) auditFailures.push("8.8O scannerUploadStillBlocked is not true");
  if (o.paidDocumentModeStillBlocked !== true) auditFailures.push("8.8O paidDocumentModeStillBlocked is not true");
  if (o.vayloDnaStillBlocked !== true) auditFailures.push("8.8O vayloDnaStillBlocked is not true");
  if (o.persistenceStillBlocked !== true) auditFailures.push("8.8O persistenceStillBlocked is not true");
  if (o.allowedSyntheticCaseAcceptedForFutureInternalInvocation !== true) auditFailures.push("8.8O allowedSyntheticCaseAcceptedForFutureInternalInvocation is not true");
  if (o.blockedSyntheticCasesRejected !== true) auditFailures.push("8.8O blockedSyntheticCasesRejected is not true");
  if (
    o.freeQaFirstControlledInternalTestRunTamperCasesRejected !==
    o.freeQaFirstControlledInternalTestRunTamperCaseCount
  ) {
    auditFailures.push("8.8O own tamper count mismatch");
  }

  const eightEightOSourceConfirmed = auditFailures.length === 0;

  // ── Arrays ────────────────────────────────────────────────────────────

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: post_invocation_audit_passed_for_manual_local_internal_free_qa_only — the completed 8.8P manual local internal API invocation is audited and the first controlled internal test cycle is closed.`,
    "DS-02: This audit does not perform any live route call, model call, or route handler execution.",
    "DS-03: This audit does not authorize public runtime, production, go-live, documents, OCR/photo/scanner, paid mode, Vaylo DNA, or persistence.",
    "DS-04: A controlled internal regression pack (8.8R) is required before any broader testing.",
  ];

  const confirmedInvocationResults: string[] = [
    `CI-01 [${SENTINEL_ALLOWED_CALL_PASSED}]: allowed internal Free Q&A call passed — status 200, ok true, mode "free_qa_internal_scoped_patch", context "anonymous", result exists, all patchMeta safety flags confirmed true.`,
    `CI-02 [${SENTINEL_DOC_LIKE_BLOCKED}]: document-like negative test blocked with document_mode_required — status 402, all safety flags confirmed true.`,
    `CI-03 [${SENTINEL_BAD_AUTH_BLOCKED}]: bad-auth negative test blocked with free_qa_patch_internal_auth_failed — status 403, actualMinimalScopedRuntimePatchImplemented false, all other safety flags confirmed true.`,
    "CI-04: PowerShell Slovak-character mojibake observed in terminal display only; treated as non-blocking terminal/display encoding issue, not a functional failure.",
  ];

  const confirmedSafetyBoundaries: string[] = [
    `SB-01 [${SENTINEL_BLOCK_PUBLIC_RUNTIME}]: public runtime blocked — no public exposure occurred during the 8.8P invocation.`,
    `SB-02 [${SENTINEL_BLOCK_PRODUCTION}]: production blocked — no production authorization exists.`,
    `SB-03 [${SENTINEL_BLOCK_GOLIVE}]: go-live blocked — no go-live authorization exists.`,
    `SB-04 [${SENTINEL_BLOCK_DOCUMENTS}]: documents blocked — document-like text was rejected before any model call.`,
    `SB-05 [${SENTINEL_BLOCK_OCR_PHOTO}]: OCR/photo blocked — no OCR/photo path was exercised or enabled.`,
    `SB-06 [${SENTINEL_BLOCK_SCANNER_UPLOAD}]: scanner/upload blocked — no scanner/upload path was exercised or enabled.`,
    `SB-07 [${SENTINEL_BLOCK_PAID_MODE}]: paid mode blocked — no Paid Document Mode was exercised or enabled.`,
    `SB-08 [${SENTINEL_BLOCK_DNA}]: Vaylo DNA blocked — no Vaylo DNA runtime was exercised or enabled.`,
    `SB-09 [${SENTINEL_BLOCK_PERSISTENCE}]: persistence blocked — no DB/storage write occurred during the 8.8P invocation.`,
    `SB-10 [${SENTINEL_BLOCK_EXACT_DEADLINE}]: exact legal deadline calculation blocked — no exact legal deadline was calculated.`,
    `SB-11 [${SENTINEL_MODEL_OUTPUT_UNTRUSTED}]: model output remains untrusted — the allowed call's model output is not treated as trusted legal advice.`,
    "SB-12: the 8.8L authorization chain remains confirmed; 8.3AC was not run.",
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_PUBLIC_STILL_BLOCKED}]: public runtime still blocked.`,
    `RB-02 [${SENTINEL_REMAIN_PRODUCTION_STILL_BLOCKED}]: production still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_DOCUMENTS_STILL_BLOCKED}]: documents still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_OCR_STILL_BLOCKED}]: OCR/photo still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_PAID_STILL_BLOCKED}]: paid mode still blocked.`,
    `RB-06 [${SENTINEL_REMAIN_DNA_STILL_BLOCKED}]: Vaylo DNA still blocked.`,
    `RB-07 [${SENTINEL_REMAIN_PERSISTENCE_STILL_BLOCKED}]: persistence still blocked.`,
    `RB-08 [${SENTINEL_REMAIN_LOCALIZATION_PENDING}]: localization hardening still pending (PowerShell mojibake noted as future UX/output encoding check).`,
    `RB-09 [${SENTINEL_REMAIN_UX_PENDING}]: UX/public beta still pending.`,
    `RB-10 [${SENTINEL_REMAIN_REGRESSION_REQUIRED}]: regression pack still required before broader testing.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8R}]: 8.8R controlled internal Free Q&A regression pack — a broader synthetic/local regression pack is required before any further expansion.`,
  ];

  const notes: string[] = [
    "IN-01: 8.8Q post-invocation audit and internal test closure rendered for the completed 8.8P manual local internal Free Q&A API invocation only.",
    `IN-02: 8.8O confirmed — checkId=${o.checkId}, allPassed=${o.allPassed}, sourceAuditCommit=${o.sourceAuditCommit}, sourcePatchCommit=${o.sourcePatchCommit}.`,
    "IN-03: observed 8.8P results (allowed call 200, document-like negative 402, bad-auth negative 403) are recorded as literal audit facts; this file performs no live call itself.",
    "IN-04: PowerShell Slovak-character mojibake is a terminal/display encoding issue only; it does not block this audit and is queued as a future encoding check.",
    "IN-05: this is an audit-only phase; only 8.8R may expand testing via a controlled internal regression pack.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_POST_INVOCATION_AUDIT_TAMPER_CASES.length;

  const provisional: FreeQaPostInvocationAuditResult = {
    checkId: "8.8Q",
    allPassed: true,
    postInvocationAuditOnly: true,
    internalTestClosureOnly: true,
    sourceAuthorizationPhase: "8.8O",
    sourceAuthorizationCommit: "d865f7d",
    sourceAuditPhase: "8.8N",
    sourceAuditCommit: "3698e12",
    sourcePatchPhase: "8.8M",
    sourcePatchCommit: "ffaef73",
    manualLocalInternalApiInvocationPerformed: true,
    allowedInternalFreeQaCallPassed: true,
    allowedInternalFreeQaStatus: 200,
    allowedInternalFreeQaOk: true,
    allowedInternalFreeQaMode: "free_qa_internal_scoped_patch",
    allowedInternalFreeQaContext: "anonymous",
    allowedInternalFreeQaResultExists: true,
    documentLikeNegativeTestPassed: true,
    documentLikeNegativeTestStatus: 402,
    documentLikeNegativeTestCode: "document_mode_required",
    badAuthNegativeTestPassed: true,
    badAuthNegativeTestStatus: 403,
    badAuthNegativeTestCode: "free_qa_patch_internal_auth_failed",
    publicRuntimeAuthorizedNow: false,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    documentsStillBlocked: true,
    documentLikeTextBlockedBeforeModelCall: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    exactLegalDeadlineCalculationStillBlocked: true,
    modelOutputStillUntrusted: true,
    eightEightLAuthorizationConfirmed: true,
    eightThreeAcNotRun: true,
    powershellMojibakeObserved: true,
    powershellMojibakeBlocking: false,
    futureEncodingCheckRecommended: true,
    internalFreeQaManualLocalInvocationClosed: true,
    readyForControlledInternalRegressionPack: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForDocuments: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPaidDocumentMode: false,
    readyForVayloDna: false,
    readyForPersistence: false,
    decision,
    confirmedInvocationResults,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
    freeQaPostInvocationAuditTamperCaseCount: tamperCaseCount,
    freeQaPostInvocationAuditTamperCasesRejected: tamperCaseCount,
    freeQaPostInvocationAuditTamperCoveragePassing: true,
  };

  if (!eightEightOSourceConfirmed) {
    auditFailures.push("8.8Q: 8.8O source authorization chain not confirmed");
  }

  if (!_isCanonicalFreeQaPostInvocationAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8Q tamper cases ─────────────────────────────────────────────
  let freeQaPostInvocationAuditTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_POST_INVOCATION_AUDIT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_POST_INVOCATION_AUDIT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPostInvocationAuditResult(tc.mutate(provisional))) {
      freeQaPostInvocationAuditTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8Q tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    freeQaPostInvocationAuditTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8Q tamper cases: ${freeQaPostInvocationAuditTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaPostInvocationAuditTamperCasesRejected,
    notes: finalNotes,
  };
}
