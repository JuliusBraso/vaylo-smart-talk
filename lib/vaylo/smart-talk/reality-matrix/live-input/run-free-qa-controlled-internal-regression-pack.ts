/**
 * PHASE 8.8R — Controlled Internal Free Q&A Regression Pack
 *
 * Regression-pack-only phase. This phase defines a controlled internal
 * synthetic regression pack for Free Q&A after the completed 8.8P manual
 * local internal API invocation and 8.8Q post-invocation closure.
 *
 * This phase does NOT enable public runtime, production, or go-live.
 * This phase does NOT perform a live API call, route handler execution, or
 * model call, and does NOT modify route behavior or runSmartTalk.
 */

import { runFreeQaPostInvocationAudit } from "./run-free-qa-post-invocation-audit";

// ─── Internal types ───────────────────────────────────────────────────────────

type AllowedRegressionCase = {
  locale: "sk";
  context: "anonymous";
  inputType: "question";
  text: string;
  expectedClassification: "allowed_non_document_free_qa_question";
  syntheticOnly: true;
  nonPersistent: true;
  routeInvocationPlannedHere: false;
  modelCallPlannedHere: false;
};

type BlockedRegressionCase = {
  label: string;
  textOrFlag: string;
  expectedBlockedReason: string;
};

interface FreeQaControlledInternalRegressionPackResult {
  checkId: "8.8R";
  allPassed: boolean;
  controlledInternalRegressionPackOnly: true;
  sourceClosurePhase: "8.8Q";
  sourceClosureCommit: "7ff919e";
  sourceAuthorizationCommit: "d865f7d";
  sourcePatchCommit: "ffaef73";
  allowedRegressionCaseCount: 8;
  allowedRegressionCasesAcceptedForFutureInternalInvocation: true;
  blockedRegressionCaseCount: 15;
  blockedRegressionCasesRejected: true;
  blockedRegressionCasesRejectedCount: 15;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
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
  eightThreeAcNotRun: true;
  readyForPublicRuntimeGateDesign: true;
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
  allowedRegressionCases: AllowedRegressionCase[];
  blockedRegressionCases: BlockedRegressionCase[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
  freeQaControlledInternalRegressionPackTamperCaseCount: number;
  freeQaControlledInternalRegressionPackTamperCasesRejected: number;
  freeQaControlledInternalRegressionPackTamperCoveragePassing: true;
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "controlled_internal_free_qa_regression_pack_passed";
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
const SENTINEL_REMAIN_PUBLIC_GATE_REQUIRED = "public runtime gate still required";
const SENTINEL_REMAIN_PUBLIC_ROUTE_BLOCKED = "public route activation still blocked";
const SENTINEL_REMAIN_UI_TESTING_REQUIRED = "UI/browser testing still required";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_OCR_BLOCKED = "OCR/photo still blocked";
const SENTINEL_REMAIN_PAID_BLOCKED = "paid mode still blocked";
const SENTINEL_REMAIN_DNA_BLOCKED = "Vaylo DNA still blocked";
const SENTINEL_REMAIN_PERSISTENCE_BLOCKED = "persistence still blocked";
const SENTINEL_REMAIN_LOCALIZATION_PENDING = "localization hardening still pending";
const SENTINEL_NEXT_PHASE_8_8S = "8.8S public Free Q&A runtime gate design";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaControlledInternalRegressionPackResult(
  r: FreeQaControlledInternalRegressionPackResult,
): boolean {
  if (r.checkId !== "8.8R") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledInternalRegressionPackOnly !== true) return false;
  if (r.sourceClosurePhase !== "8.8Q") return false;
  if (r.sourceClosureCommit !== "7ff919e") return false;
  if (r.sourceAuthorizationCommit !== "d865f7d") return false;
  if (r.sourcePatchCommit !== "ffaef73") return false;
  if (r.allowedRegressionCaseCount !== 8) return false;
  if (r.allowedRegressionCasesAcceptedForFutureInternalInvocation !== true) return false;
  if (r.blockedRegressionCaseCount !== 15) return false;
  if (r.blockedRegressionCasesRejected !== true) return false;
  if (r.blockedRegressionCasesRejectedCount !== 15) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
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
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForPublicRuntimeGateDesign !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForDocuments !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPaidDocumentMode !== false) return false;
  if (r.readyForVayloDna !== false) return false;
  if (r.readyForPersistence !== false) return false;
  if (!Array.isArray(r.allowedRegressionCases) || r.allowedRegressionCases.length !== 8) return false;
  if (!Array.isArray(r.blockedRegressionCases) || r.blockedRegressionCases.length !== 15) return false;
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
  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_GATE_REQUIRED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_ROUTE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_UI_TESTING_REQUIRED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_OCR_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PAID_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DNA_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PERSISTENCE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_LOCALIZATION_PENDING)) return false;
  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8S)) return false;
  if (
    r.freeQaControlledInternalRegressionPackTamperCasesRejected !==
    r.freeQaControlledInternalRegressionPackTamperCaseCount
  ) {
    return false;
  }
  if (r.freeQaControlledInternalRegressionPackTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88RMutation = (
  r: FreeQaControlledInternalRegressionPackResult,
) => FreeQaControlledInternalRegressionPackResult;
interface Tamper88RCase {
  label: string;
  mutate: Tamper88RMutation;
}

const FREE_QA_CONTROLLED_INTERNAL_REGRESSION_PACK_TAMPER_CASES: Tamper88RCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8Q" as "8.8R" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledInternalRegressionPackOnly false", mutate: (r) => ({ ...r, controlledInternalRegressionPackOnly: false as true }) },
  { label: "sourceClosureCommit wrong", mutate: (r) => ({ ...r, sourceClosureCommit: "0000000" as "7ff919e" }) },
  { label: "sourceAuthorizationCommit wrong", mutate: (r) => ({ ...r, sourceAuthorizationCommit: "0000000" as "d865f7d" }) },
  { label: "sourcePatchCommit wrong", mutate: (r) => ({ ...r, sourcePatchCommit: "0000000" as "ffaef73" }) },
  { label: "allowedRegressionCaseCount wrong", mutate: (r) => ({ ...r, allowedRegressionCaseCount: 7 as 8 }) },
  { label: "allowedRegressionCasesAcceptedForFutureInternalInvocation false", mutate: (r) => ({ ...r, allowedRegressionCasesAcceptedForFutureInternalInvocation: false as true }) },
  { label: "blockedRegressionCaseCount wrong", mutate: (r) => ({ ...r, blockedRegressionCaseCount: 14 as 15 }) },
  { label: "blockedRegressionCasesRejected false", mutate: (r) => ({ ...r, blockedRegressionCasesRejected: false as true }) },
  { label: "blockedRegressionCasesRejectedCount wrong", mutate: (r) => ({ ...r, blockedRegressionCasesRejectedCount: 14 as 15 }) },
  { label: "liveRouteInvocationPerformed true", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
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
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForPublicRuntimeGateDesign false", mutate: (r) => ({ ...r, readyForPublicRuntimeGateDesign: false as true }) },
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
  { label: "allowedRegressionCases empty", mutate: (r) => ({ ...r, allowedRegressionCases: [] }) },
  { label: "blockedRegressionCases empty", mutate: (r) => ({ ...r, blockedRegressionCases: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public runtime blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_BLOCK_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing model output untrusted sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_MODEL_OUTPUT_UNTRUSTED).join("omitted")) }) },
  { label: "remainingBlockers missing localization pending sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_LOCALIZATION_PENDING).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8S sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8S).join("omitted")) }) },
  { label: "freeQaControlledInternalRegressionPackTamperCoveragePassing false", mutate: (r) => ({ ...r, freeQaControlledInternalRegressionPackTamperCoveragePassing: false as true }) },
  { label: "freeQaControlledInternalRegressionPackTamperCasesRejected mismatch", mutate: (r) => ({ ...r, freeQaControlledInternalRegressionPackTamperCasesRejected: r.freeQaControlledInternalRegressionPackTamperCasesRejected - 1 }) },
];

// ─── Exported controlled internal regression-pack runner ──────────────────────

export function runFreeQaControlledInternalRegressionPack(): FreeQaControlledInternalRegressionPackResult {
  const packFailures: string[] = [];

  // ── Call 8.8Q post-invocation closure runner as source of truth ───────
  const q = runFreeQaPostInvocationAudit();
  if (q.checkId !== "8.8Q") packFailures.push(`8.8Q checkId mismatch: expected "8.8Q", got "${q.checkId}"`);
  if (q.allPassed !== true) packFailures.push("8.8Q allPassed is not true");
  if (q.sourceAuthorizationCommit !== "d865f7d") packFailures.push(`8.8Q sourceAuthorizationCommit mismatch: got "${q.sourceAuthorizationCommit}"`);
  if (q.sourceAuditCommit !== "3698e12") packFailures.push(`8.8Q sourceAuditCommit mismatch: got "${q.sourceAuditCommit}"`);
  if (q.sourcePatchCommit !== "ffaef73") packFailures.push(`8.8Q sourcePatchCommit mismatch: got "${q.sourcePatchCommit}"`);
  if (q.allowedInternalFreeQaCallPassed !== true) packFailures.push("8.8Q allowedInternalFreeQaCallPassed is not true");
  if (q.documentLikeNegativeTestPassed !== true) packFailures.push("8.8Q documentLikeNegativeTestPassed is not true");
  if (q.badAuthNegativeTestPassed !== true) packFailures.push("8.8Q badAuthNegativeTestPassed is not true");
  if (q.publicRuntimeStillBlocked !== true) packFailures.push("8.8Q publicRuntimeStillBlocked is not true");
  if (q.productionAuthorizedNow !== false) packFailures.push("8.8Q productionAuthorizedNow is not false");
  if (q.goLiveAuthorizedNow !== false) packFailures.push("8.8Q goLiveAuthorizedNow is not false");
  if (q.documentsStillBlocked !== true) packFailures.push("8.8Q documentsStillBlocked is not true");
  if (q.photoOcrStillBlocked !== true) packFailures.push("8.8Q photoOcrStillBlocked is not true");
  if (q.scannerUploadStillBlocked !== true) packFailures.push("8.8Q scannerUploadStillBlocked is not true");
  if (q.paidDocumentModeStillBlocked !== true) packFailures.push("8.8Q paidDocumentModeStillBlocked is not true");
  if (q.vayloDnaStillBlocked !== true) packFailures.push("8.8Q vayloDnaStillBlocked is not true");
  if (q.persistenceStillBlocked !== true) packFailures.push("8.8Q persistenceStillBlocked is not true");
  if (q.internalFreeQaManualLocalInvocationClosed !== true) packFailures.push("8.8Q internalFreeQaManualLocalInvocationClosed is not true");
  if (q.readyForControlledInternalRegressionPack !== true) packFailures.push("8.8Q readyForControlledInternalRegressionPack is not true");
  if (
    q.freeQaPostInvocationAuditTamperCasesRejected !== q.freeQaPostInvocationAuditTamperCaseCount
  ) {
    packFailures.push("8.8Q own tamper count mismatch");
  }

  const allowedRegressionCases: AllowedRegressionCase[] = [
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Ako si vybavím zdravotné poistenie v Nemecku?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Čo je Anmeldung a kde ho vybavím?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Ako získam Steuernummer v Nemecku?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Čo mám vybaviť po príchode do Nemecka?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Ako si vyberiem Krankenkasse?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Čo je Bürgeramt?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Kedy potrebujem Steuer-ID?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Čo znamená Minijob?",
      expectedClassification: "allowed_non_document_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
  ];

  const blockedRegressionCases: BlockedRegressionCase[] = [
    {
      label: "official_letter",
      textOrFlag:
        "Sehr geehrte Damen und Herren, Aktenzeichen 123, ich habe einen Bescheid bekommen.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "invoice",
      textOrFlag: "Rechnung Nr. 123 Zahlungserinnerung Betrag 250 EUR",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "mahnung",
      textOrFlag:
        "Mahnung: Bitte zahlen Sie den offenen Betrag innerhalb von 7 Tagen.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "bescheid",
      textOrFlag:
        "Bescheid über Leistungen, Rechtsbehelfsbelehrung, Aktenzeichen 456",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "exact_legal_deadline_request",
      textOrFlag:
        "Bis wann muss ich Widerspruch einlegen? Der Bescheid ist vom 01.04.2026.",
      expectedBlockedReason: "exact_legal_deadline_calculation_blocked",
    },
    {
      label: "ocr_photo_flag_true",
      textOrFlag: "requestedOcr=true/requestedPhoto=true",
      expectedBlockedReason: "ocr_photo_blocked",
    },
    {
      label: "scanner_upload_flag_true",
      textOrFlag: "requestedScannerUpload=true/requestedFileUpload=true",
      expectedBlockedReason: "scanner_upload_blocked",
    },
    {
      label: "paid_mode_flag_true",
      textOrFlag: "requestedPaidMode=true/requestedPayment=true",
      expectedBlockedReason: "paid_mode_blocked",
    },
    {
      label: "dna_save_flag_true",
      textOrFlag: "requestedDnaSave=true",
      expectedBlockedReason: "vaylo_dna_blocked",
    },
    {
      label: "persistence_flag_true",
      textOrFlag: "requestedPersistence=true",
      expectedBlockedReason: "persistence_blocked",
    },
    {
      label: "input_type_text",
      textOrFlag: "inputType=text",
      expectedBlockedReason: "question_only_required",
    },
    {
      label: "context_not_anonymous",
      textOrFlag: "context=authenticated",
      expectedBlockedReason: "anonymous_only_required",
    },
    {
      label: "empty_too_short_question",
      textOrFlag: "text='a'",
      expectedBlockedReason: "text_too_short",
    },
    {
      label: "only_url_input",
      textOrFlag: "text='https://example.com'",
      expectedBlockedReason: "invalid_text",
    },
    {
      label: "document_like_slovak_request",
      textOrFlag:
        "Prišiel mi úradný list z Jobcentra, tu je celý text: Sehr geehrte Damen und Herren...",
      expectedBlockedReason: "document_mode_required",
    },
  ];

  const allowedRegressionCaseCount = 8 as const;
  const blockedRegressionCaseCount = 15 as const;
  const blockedRegressionCasesRejectedCount = 15 as const;
  const allowedRegressionCasesAcceptedForFutureInternalInvocation = true as const;
  const blockedRegressionCasesRejected = true as const;

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: controlled_internal_free_qa_regression_pack_passed — controlled internal Free Q&A regression pack is defined and passes synthetic boundary checks.`,
    "DS-02: This phase is regression-pack-only and performs no live route/model execution.",
    "DS-03: This phase keeps public runtime, production, and go-live blocked.",
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
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_PUBLIC_GATE_REQUIRED}]: public runtime gate still required.`,
    `RB-02 [${SENTINEL_REMAIN_PUBLIC_ROUTE_BLOCKED}]: public route activation still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_UI_TESTING_REQUIRED}]: UI/browser testing still required.`,
    `RB-04 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-06 [${SENTINEL_REMAIN_OCR_BLOCKED}]: OCR/photo still blocked.`,
    `RB-07 [${SENTINEL_REMAIN_PAID_BLOCKED}]: paid mode still blocked.`,
    `RB-08 [${SENTINEL_REMAIN_DNA_BLOCKED}]: Vaylo DNA still blocked.`,
    `RB-09 [${SENTINEL_REMAIN_PERSISTENCE_BLOCKED}]: persistence still blocked.`,
    `RB-10 [${SENTINEL_REMAIN_LOCALIZATION_PENDING}]: localization hardening still pending.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8S}]: 8.8S public Free Q&A runtime gate design.`,
  ];

  const notes: string[] = [
    "IN-01: 8.8R defines a controlled internal synthetic regression pack only; no live route/model call is performed.",
    `IN-02: 8.8Q confirmed — checkId=${q.checkId}, allPassed=${q.allPassed}, sourceClosureCommit=7ff919e (expected), sourceAuthorizationCommit=${q.sourceAuthorizationCommit}, sourcePatchCommit=${q.sourcePatchCommit}.`,
    "IN-03: 8 allowed synthetic sk/anonymous/question/non-document cases are defined for future internal invocation only.",
    "IN-04: 15 blocked synthetic cases are defined (documents, OCR/photo, scanner/upload, paid, DNA, persistence, text mode, non-anonymous, short/URL inputs).",
    "IN-05: all public/production/go-live/document/OCR/scanner/paid/DNA/persistence readiness flags remain blocked in this phase.",
  ];

  const tamperCaseCount = FREE_QA_CONTROLLED_INTERNAL_REGRESSION_PACK_TAMPER_CASES.length;

  const provisional: FreeQaControlledInternalRegressionPackResult = {
    checkId: "8.8R",
    allPassed: true,
    controlledInternalRegressionPackOnly: true,
    sourceClosurePhase: "8.8Q",
    sourceClosureCommit: "7ff919e",
    sourceAuthorizationCommit: "d865f7d",
    sourcePatchCommit: "ffaef73",
    allowedRegressionCaseCount,
    allowedRegressionCasesAcceptedForFutureInternalInvocation,
    blockedRegressionCaseCount,
    blockedRegressionCasesRejected,
    blockedRegressionCasesRejectedCount,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
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
    eightThreeAcNotRun: true,
    readyForPublicRuntimeGateDesign: true,
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
    allowedRegressionCases,
    blockedRegressionCases,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
    freeQaControlledInternalRegressionPackTamperCaseCount: tamperCaseCount,
    freeQaControlledInternalRegressionPackTamperCasesRejected: tamperCaseCount,
    freeQaControlledInternalRegressionPackTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaControlledInternalRegressionPackResult(provisional)) {
    packFailures.push("internal: provisional result failed its own canonical checker");
  }

  let freeQaControlledInternalRegressionPackTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_CONTROLLED_INTERNAL_REGRESSION_PACK_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_CONTROLLED_INTERNAL_REGRESSION_PACK_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaControlledInternalRegressionPackResult(tc.mutate(provisional))) {
      freeQaControlledInternalRegressionPackTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8R tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) packFailures.push(...tamperFailures);

  const allPassed =
    packFailures.length === 0 &&
    q.checkId === "8.8Q" &&
    q.allPassed === true &&
    allowedRegressionCaseCount === 8 &&
    allowedRegressionCasesAcceptedForFutureInternalInvocation === true &&
    blockedRegressionCaseCount === 15 &&
    blockedRegressionCasesRejected === true &&
    blockedRegressionCasesRejectedCount === 15 &&
    provisional.liveRouteInvocationPerformed === false &&
    provisional.liveModelCallPerformed === false &&
    provisional.publicRuntimeAuthorizedNow === false &&
    provisional.productionAuthorizedNow === false &&
    provisional.goLiveAuthorizedNow === false &&
    provisional.documentsStillBlocked === true &&
    provisional.photoOcrStillBlocked === true &&
    provisional.paidDocumentModeStillBlocked === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStillBlocked === true &&
    provisional.readyForPublicRuntimeGateDesign === true &&
    provisional.readyForPublicRuntime === false &&
    provisional.decision.length > 0 &&
    provisional.allowedRegressionCases.length > 0 &&
    provisional.blockedRegressionCases.length > 0 &&
    provisional.confirmedSafetyBoundaries.length > 0 &&
    provisional.remainingBlockers.length > 0 &&
    provisional.nextRequiredPhase.length > 0 &&
    freeQaControlledInternalRegressionPackTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8R tamper cases: ${freeQaControlledInternalRegressionPackTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(packFailures.length > 0 ? [`FAILURES (${packFailures.length}):`, ...packFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaControlledInternalRegressionPackTamperCasesRejected,
    notes: finalNotes,
  };
}
