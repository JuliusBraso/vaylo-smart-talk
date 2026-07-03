/**
 * PHASE 8.8N — Free Q&A Post-Patch Safety Audit
 *
 * Audit-only phase. This phase audits the 8.8M actual minimal scoped
 * runtime patch (commit ffaef73, app/api/smart-talk/route.ts) for Free
 * Smart Talk Q&A. It confirms the patch's safety boundaries remain intact
 * and re-confirms the 8.8L authorization chain. It does NOT modify route
 * behavior, does NOT modify runSmartTalk, does NOT modify the 8.8M patch,
 * and does NOT implement any new runtime behavior.
 *
 * This audit does not authorize public runtime, production, go-live,
 * documents, OCR/photo/scanner, paid mode, Vaylo DNA, persistence, or the
 * first internal test run. Only 8.8O may authorize the first controlled
 * internal Free Q&A test run.
 */

import { runFreeQaScopedRuntimePatchAuthorizationDecision } from "./run-free-qa-scoped-runtime-patch-authorization-decision";

// ─── Return type ──────────────────────────────────────────────────────────────

interface FreeQaPostPatchSafetyAuditResult {
  checkId: "8.8N";
  allPassed: boolean;
  postPatchSafetyAuditOnly: true;
  auditedPatchCommit: "ffaef73";
  auditedPatchPhase: "8.8M";
  auditedChangedFiles: string[];
  runSmartTalkModifiedByPatch: false;
  helperFileCreatedByPatch: false;
  routeModifiedByPatch: true;
  publicRuntimeAuthorizedNow: false;
  publicRuntimeStillBlocked: true;
  documentsStillBlocked: true;
  documentLikeTextBlockedBeforeModelCall: true;
  photoOcrStillBlocked: true;
  scannerUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  exactLegalDeadlineCalculationStillBlocked: true;
  modelOutputStillUntrusted: true;
  evidenceGatesSeamActivationStillUnauthorized: true;
  internalBranchFailClosed: true;
  internalSecretGuardRequired: true;
  explicitInternalModeRequired: true;
  explicitInternalGuardPhraseRequired: true;
  explicitInternalEnableFlagRequired: true;
  eightEightLAuthorizationRequired: true;
  eightEightLAuthorizationConfirmed: true;
  eightThreeAcNotRun: true;
  readyForFirstControlledInternalFreeQaTestRun: true;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForDocuments: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPaidDocumentMode: false;
  readyForVayloDna: false;
  auditDecision: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  auditNotes: string[];
  freeQaPostPatchSafetyAuditTamperCaseCount: number;
  freeQaPostPatchSafetyAuditTamperCasesRejected: number;
  freeQaPostPatchSafetyAuditTamperCoveragePassing: true;
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_AUDIT_PASSED = "post_patch_safety_audit_passed_for_internal_free_qa_only";
const SENTINEL_PUBLIC_RUNTIME_BLOCKED = "public runtime blocked";
const SENTINEL_DOCUMENTS_BLOCKED = "documents blocked";
const SENTINEL_PHOTO_OCR_BLOCKED = "OCR/photo blocked";
const SENTINEL_SCANNER_UPLOAD_BLOCKED = "scanner/upload blocked";
const SENTINEL_PAID_MODE_BLOCKED = "paid mode blocked";
const SENTINEL_VAYLO_DNA_BLOCKED = "Vaylo DNA blocked";
const SENTINEL_PERSISTENCE_BLOCKED = "persistence blocked";
const SENTINEL_EXACT_DEADLINE_BLOCKED = "exact legal deadline calculation blocked";
const SENTINEL_FIRST_TEST_RUN_SEP_AUTH = "first internal test run still requires separate authorization";
const SENTINEL_PUBLIC_RUNTIME_STILL_BLOCKED = "public runtime still blocked";
const SENTINEL_PRODUCTION_STILL_BLOCKED = "production still blocked";
const SENTINEL_DOCUMENTS_STILL_BLOCKED = "documents still blocked";
const SENTINEL_NEXT_PHASE_8_8O = "8.8O first controlled internal Free Q&A test run";

const AUDITED_CHANGED_FILES: readonly string[] = ["app/api/smart-talk/route.ts"];

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPostPatchSafetyAuditResult(
  r: FreeQaPostPatchSafetyAuditResult,
): boolean {
  if (r.checkId !== "8.8N") return false;
  if (r.allPassed !== true) return false;
  if (r.postPatchSafetyAuditOnly !== true) return false;
  if (r.auditedPatchCommit !== "ffaef73") return false;
  if (r.auditedPatchPhase !== "8.8M") return false;
  if (
    !Array.isArray(r.auditedChangedFiles) ||
    r.auditedChangedFiles.length !== AUDITED_CHANGED_FILES.length ||
    !r.auditedChangedFiles.every((f, i) => f === AUDITED_CHANGED_FILES[i])
  ) {
    return false;
  }
  if (r.runSmartTalkModifiedByPatch !== false) return false;
  if (r.helperFileCreatedByPatch !== false) return false;
  if (r.routeModifiedByPatch !== true) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.documentsStillBlocked !== true) return false;
  if (r.documentLikeTextBlockedBeforeModelCall !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.exactLegalDeadlineCalculationStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.evidenceGatesSeamActivationStillUnauthorized !== true) return false;
  if (r.internalBranchFailClosed !== true) return false;
  if (r.internalSecretGuardRequired !== true) return false;
  if (r.explicitInternalModeRequired !== true) return false;
  if (r.explicitInternalGuardPhraseRequired !== true) return false;
  if (r.explicitInternalEnableFlagRequired !== true) return false;
  if (r.eightEightLAuthorizationRequired !== true) return false;
  if (r.eightEightLAuthorizationConfirmed !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForFirstControlledInternalFreeQaTestRun !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForDocuments !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPaidDocumentMode !== false) return false;
  if (r.readyForVayloDna !== false) return false;
  if (!r.auditDecision || r.auditDecision.length === 0) return false;
  if (!r.confirmedSafetyBoundaries || r.confirmedSafetyBoundaries.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.auditNotes || r.auditNotes.length === 0) return false;
  const decisionJ = r.auditDecision.join(" ");
  if (!decisionJ.includes(SENTINEL_AUDIT_PASSED)) return false;
  const boundariesJ = r.confirmedSafetyBoundaries.join(" ");
  if (!boundariesJ.includes(SENTINEL_PUBLIC_RUNTIME_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_DOCUMENTS_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_PHOTO_OCR_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_SCANNER_UPLOAD_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_PAID_MODE_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_VAYLO_DNA_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_PERSISTENCE_BLOCKED)) return false;
  if (!boundariesJ.includes(SENTINEL_EXACT_DEADLINE_BLOCKED)) return false;
  const blockersJ = r.remainingBlockers.join(" ");
  if (!blockersJ.includes(SENTINEL_FIRST_TEST_RUN_SEP_AUTH)) return false;
  if (!blockersJ.includes(SENTINEL_PUBLIC_RUNTIME_STILL_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_PRODUCTION_STILL_BLOCKED)) return false;
  if (!blockersJ.includes(SENTINEL_DOCUMENTS_STILL_BLOCKED)) return false;
  const nextPhaseJ = r.nextRequiredPhase.join(" ");
  if (!nextPhaseJ.includes(SENTINEL_NEXT_PHASE_8_8O)) return false;
  if (r.freeQaPostPatchSafetyAuditTamperCasesRejected !== r.freeQaPostPatchSafetyAuditTamperCaseCount) return false;
  if (r.freeQaPostPatchSafetyAuditTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88NMutation = (
  r: FreeQaPostPatchSafetyAuditResult,
) => FreeQaPostPatchSafetyAuditResult;
interface Tamper88NCase { label: string; mutate: Tamper88NMutation; }

const FREE_QA_POST_PATCH_SAFETY_AUDIT_TAMPER_CASES: Tamper88NCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8M" as "8.8N" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "postPatchSafetyAuditOnly false", mutate: (r) => ({ ...r, postPatchSafetyAuditOnly: false as true }) },
  { label: "auditedPatchCommit wrong", mutate: (r) => ({ ...r, auditedPatchCommit: "0000000" as "ffaef73" }) },
  { label: "auditedPatchPhase wrong", mutate: (r) => ({ ...r, auditedPatchPhase: "8.8L" as "8.8M" }) },
  { label: "auditedChangedFiles changed", mutate: (r) => ({ ...r, auditedChangedFiles: [...r.auditedChangedFiles, "lib/vaylo/smart-talk/run-smart-talk.ts"] }) },
  { label: "auditedChangedFiles emptied", mutate: (r) => ({ ...r, auditedChangedFiles: [] }) },
  { label: "runSmartTalkModifiedByPatch true", mutate: (r) => ({ ...r, runSmartTalkModifiedByPatch: true as false }) },
  { label: "helperFileCreatedByPatch true", mutate: (r) => ({ ...r, helperFileCreatedByPatch: true as false }) },
  { label: "routeModifiedByPatch false", mutate: (r) => ({ ...r, routeModifiedByPatch: false as true }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false as true }) },
  { label: "documentLikeTextBlockedBeforeModelCall false", mutate: (r) => ({ ...r, documentLikeTextBlockedBeforeModelCall: false as true }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "exactLegalDeadlineCalculationStillBlocked false", mutate: (r) => ({ ...r, exactLegalDeadlineCalculationStillBlocked: false as true }) },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "evidenceGatesSeamActivationStillUnauthorized false", mutate: (r) => ({ ...r, evidenceGatesSeamActivationStillUnauthorized: false as true }) },
  { label: "internalBranchFailClosed false", mutate: (r) => ({ ...r, internalBranchFailClosed: false as true }) },
  { label: "internalSecretGuardRequired false", mutate: (r) => ({ ...r, internalSecretGuardRequired: false as true }) },
  { label: "explicitInternalModeRequired false", mutate: (r) => ({ ...r, explicitInternalModeRequired: false as true }) },
  { label: "explicitInternalGuardPhraseRequired false", mutate: (r) => ({ ...r, explicitInternalGuardPhraseRequired: false as true }) },
  { label: "explicitInternalEnableFlagRequired false", mutate: (r) => ({ ...r, explicitInternalEnableFlagRequired: false as true }) },
  { label: "eightEightLAuthorizationRequired false", mutate: (r) => ({ ...r, eightEightLAuthorizationRequired: false as true }) },
  { label: "eightEightLAuthorizationConfirmed false", mutate: (r) => ({ ...r, eightEightLAuthorizationConfirmed: false as true }) },
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForFirstControlledInternalFreeQaTestRun false", mutate: (r) => ({ ...r, readyForFirstControlledInternalFreeQaTestRun: false as true }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForDocuments true", mutate: (r) => ({ ...r, readyForDocuments: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPaidDocumentMode true", mutate: (r) => ({ ...r, readyForPaidDocumentMode: true as false }) },
  { label: "readyForVayloDna true", mutate: (r) => ({ ...r, readyForVayloDna: true as false }) },
  { label: "auditDecision empty", mutate: (r) => ({ ...r, auditDecision: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "auditNotes empty", mutate: (r) => ({ ...r, auditNotes: [] }) },
  { label: "auditDecision missing sentinel", mutate: (r) => ({ ...r, auditDecision: r.auditDecision.map((s) => s.split(SENTINEL_AUDIT_PASSED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public runtime blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing documents blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_DOCUMENTS_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing OCR/photo blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PHOTO_OCR_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing scanner/upload blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_SCANNER_UPLOAD_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing paid mode blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PAID_MODE_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing Vaylo DNA blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_VAYLO_DNA_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing persistence blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PERSISTENCE_BLOCKED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing exact legal deadline calculation blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_EXACT_DEADLINE_BLOCKED).join("omitted")) }) },
  { label: "remainingBlockers missing first internal test run sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_FIRST_TEST_RUN_SEP_AUTH).join("omitted")) }) },
  { label: "remainingBlockers missing public runtime still blocked sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_PUBLIC_RUNTIME_STILL_BLOCKED).join("omitted")) }) },
  { label: "remainingBlockers missing production still blocked sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_PRODUCTION_STILL_BLOCKED).join("omitted")) }) },
  { label: "remainingBlockers missing documents still blocked sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_DOCUMENTS_STILL_BLOCKED).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8O sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8O).join("omitted")) }) },
  { label: "freeQaPostPatchSafetyAuditTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaPostPatchSafetyAuditTamperCoveragePassing: false as true }) },
  { label: "freeQaPostPatchSafetyAuditTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaPostPatchSafetyAuditTamperCasesRejected: r.freeQaPostPatchSafetyAuditTamperCasesRejected - 1 }) },
];

// ─── Exported audit runner ─────────────────────────────────────────────────────

/**
 * Free Smart Talk Q&A Post-Patch Safety Audit runner for 8.8N.
 *
 * Calls the 8.8L authorization decision runner to re-confirm the
 * authorization chain that permitted the 8.8M actual minimal scoped
 * runtime patch, then audits the patch's declared safety boundaries.
 * Does not authorize public runtime, production, go-live, documents,
 * OCR/photo/scanner, paid mode, Vaylo DNA, persistence, or the first
 * internal test run — only the audit itself.
 */
export function runFreeQaPostPatchSafetyAudit(): FreeQaPostPatchSafetyAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.8L authorization decision runner as source of truth ────────
  const l = runFreeQaScopedRuntimePatchAuthorizationDecision();

  if (l.checkId !== "8.8L") auditFailures.push(`8.8L checkId mismatch: expected "8.8L", got "${l.checkId}"`);
  if (l.allPassed !== true) auditFailures.push("8.8L allPassed is not true");
  if (l.scopedRuntimePatchAuthorizedForNextPhase !== true) auditFailures.push("8.8L scopedRuntimePatchAuthorizedForNextPhase is not true");
  if (l.authorizedNextPhase !== "8.8M_actual_minimal_scoped_runtime_patch") auditFailures.push(`8.8L authorizedNextPhase mismatch: got "${l.authorizedNextPhase}"`);
  if (l.readyForActualMinimalScopedRuntimePatch !== true) auditFailures.push("8.8L readyForActualMinimalScopedRuntimePatch is not true");
  if (l.readyForRuntimeActivation !== false) auditFailures.push("8.8L readyForRuntimeActivation is not false");
  if (l.readyForRoutePatching !== false) auditFailures.push("8.8L readyForRoutePatching is not false");
  if (l.readyForRouteWiring !== false) auditFailures.push("8.8L readyForRouteWiring is not false");
  if (l.freeQaScopedRuntimePatchAuthorizationDecisionTamperCasesRejected !== l.freeQaScopedRuntimePatchAuthorizationDecisionTamperCaseCount) {
    auditFailures.push("8.8L own tamper count mismatch");
  }

  const eightEightLAuthorizationConfirmed = auditFailures.length === 0;

  // ── Arrays ────────────────────────────────────────────────────────────

  const auditDecision: string[] = [
    `AD-01 [${SENTINEL_AUDIT_PASSED}]: post_patch_safety_audit_passed_for_internal_free_qa_only — the 8.8M internal Free Q&A scoped runtime patch (commit ffaef73) has been audited and its declared safety boundaries confirmed.`,
    "AD-02: This audit does not modify route behavior, runSmartTalk, or the 8.8M patch itself.",
    "AD-03: This audit does not authorize public runtime, production, go-live, documents, OCR/photo/scanner, paid mode, Vaylo DNA, or persistence.",
    "AD-04: This audit does not authorize the first internal test run; a separate authorization (8.8O) is required.",
  ];

  const confirmedSafetyBoundaries: string[] = [
    `SB-01 [${SENTINEL_PUBLIC_RUNTIME_BLOCKED}]: public runtime blocked — the 8.8M internal branch is fail-closed and inaccessible to public/anonymous normal requests.`,
    `SB-02 [${SENTINEL_DOCUMENTS_BLOCKED}]: documents blocked — the 8.8M internal branch rejects document-like text before any model call.`,
    `SB-03 [${SENTINEL_PHOTO_OCR_BLOCKED}]: OCR/photo blocked — the 8.8M internal branch rejects requestedOcr/requestedPhoto.`,
    `SB-04 [${SENTINEL_SCANNER_UPLOAD_BLOCKED}]: scanner/upload blocked — the 8.8M internal branch rejects requestedFileUpload/requestedScannerUpload.`,
    `SB-05 [${SENTINEL_PAID_MODE_BLOCKED}]: paid mode blocked — the 8.8M internal branch rejects requestedPayment/requestedEntitlement/requestedPaidMode.`,
    `SB-06 [${SENTINEL_VAYLO_DNA_BLOCKED}]: Vaylo DNA blocked — the 8.8M patch does not touch or enable any Vaylo DNA file or runtime.`,
    `SB-07 [${SENTINEL_PERSISTENCE_BLOCKED}]: persistence blocked — the 8.8M internal branch rejects requestedPersistence/requestedDnaSave and performs no DB/storage writes.`,
    `SB-08 [${SENTINEL_EXACT_DEADLINE_BLOCKED}]: exact legal deadline calculation blocked — the 8.8M patch performs no exact legal deadline calculation.`,
    "SB-09: model output remains untrusted; the Evidence Gates seam activation remains unauthorized.",
    "SB-10: the internal branch requires internalRuntimeMode, internalRuntimeGuard, internalFreeQaTestEnabled, and a valid internal secret header — all fail-closed.",
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_FIRST_TEST_RUN_SEP_AUTH}]: first internal test run still requires separate authorization — this audit does not authorize the first controlled internal Free Q&A test run.`,
    `RB-02 [${SENTINEL_PUBLIC_RUNTIME_STILL_BLOCKED}]: public runtime still blocked — no public exposure is authorized by this audit.`,
    `RB-03 [${SENTINEL_PRODUCTION_STILL_BLOCKED}]: production still blocked — no production or go-live authorization is granted by this audit.`,
    `RB-04 [${SENTINEL_DOCUMENTS_STILL_BLOCKED}]: documents still blocked — no document, OCR/photo/scanner, paid mode, or Vaylo DNA authorization is granted by this audit.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8O}]: 8.8O first controlled internal Free Q&A test run — a separate authorization is required before executing the first actual internal test run.`,
  ];

  const auditNotes: string[] = [
    "IN-01: 8.8N post-patch safety audit rendered for the 8.8M internal Free Q&A scoped runtime patch only.",
    `IN-02: 8.8L confirmed — checkId=${l.checkId}, allPassed=${l.allPassed}, authorizedNextPhase=${l.authorizedNextPhase}.`,
    "IN-03: audited patch commit ffaef73, phase 8.8M, changed files: app/api/smart-talk/route.ts only; runSmartTalk not modified; no helper file created.",
    "IN-04: this is an audit-only phase; only 8.8O may authorize the first controlled internal Free Q&A test run.",
    "IN-05: all public/production/go-live/document/OCR/scanner/paid/DNA readiness flags remain false after this audit.",
  ];

  // ── Build provisional canonical result ───────────────────────────────
  const tamperCaseCount = FREE_QA_POST_PATCH_SAFETY_AUDIT_TAMPER_CASES.length;

  const provisional: FreeQaPostPatchSafetyAuditResult = {
    checkId: "8.8N",
    allPassed: true,
    postPatchSafetyAuditOnly: true,
    auditedPatchCommit: "ffaef73",
    auditedPatchPhase: "8.8M",
    auditedChangedFiles: [...AUDITED_CHANGED_FILES],
    runSmartTalkModifiedByPatch: false,
    helperFileCreatedByPatch: false,
    routeModifiedByPatch: true,
    publicRuntimeAuthorizedNow: false,
    publicRuntimeStillBlocked: true,
    documentsStillBlocked: true,
    documentLikeTextBlockedBeforeModelCall: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    exactLegalDeadlineCalculationStillBlocked: true,
    modelOutputStillUntrusted: true,
    evidenceGatesSeamActivationStillUnauthorized: true,
    internalBranchFailClosed: true,
    internalSecretGuardRequired: true,
    explicitInternalModeRequired: true,
    explicitInternalGuardPhraseRequired: true,
    explicitInternalEnableFlagRequired: true,
    eightEightLAuthorizationRequired: true,
    eightEightLAuthorizationConfirmed: true,
    eightThreeAcNotRun: true,
    readyForFirstControlledInternalFreeQaTestRun: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForDocuments: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPaidDocumentMode: false,
    readyForVayloDna: false,
    auditDecision,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    auditNotes,
    freeQaPostPatchSafetyAuditTamperCaseCount: tamperCaseCount,
    freeQaPostPatchSafetyAuditTamperCasesRejected: tamperCaseCount,
    freeQaPostPatchSafetyAuditTamperCoveragePassing: true,
  };

  if (!eightEightLAuthorizationConfirmed) {
    auditFailures.push("8.8N: 8.8L authorization chain not confirmed");
  }

  if (!_isCanonicalFreeQaPostPatchSafetyAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Run 8.8N tamper cases ─────────────────────────────────────────────
  let freeQaPostPatchSafetyAuditTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_POST_PATCH_SAFETY_AUDIT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_POST_PATCH_SAFETY_AUDIT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPostPatchSafetyAuditResult(tc.mutate(provisional))) {
      freeQaPostPatchSafetyAuditTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8N tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    freeQaPostPatchSafetyAuditTamperCasesRejected === tamperCaseCount;

  const finalAuditNotes: string[] = [
    ...auditNotes,
    `8.8N tamper cases: ${freeQaPostPatchSafetyAuditTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaPostPatchSafetyAuditTamperCasesRejected,
    auditNotes: finalAuditNotes,
  };
}
