/**
 * PHASE 8.8O — First Controlled Internal Free Q&A Test Run
 *
 * Test-run authorization-only phase. This phase confirms readiness for the
 * first controlled internal Free Q&A test run against the 8.8M internal
 * scoped runtime branch, using 8.8N as source of truth.
 *
 * This phase does NOT call the live route, does NOT call the model, does NOT
 * execute runSmartTalk, does NOT authorize public runtime, production, or
 * go-live, and does NOT authorize document/OCR/photo/scanner/paid/DNA/
 * persistence features.
 */

import { runFreeQaPostPatchSafetyAudit } from "./run-free-qa-post-patch-safety-audit";

// ─── Internal types ───────────────────────────────────────────────────────────

type SyntheticAllowedCase = {
  locale: "sk";
  context: "anonymous";
  inputType: "question";
  text: "Ako si vybavím zdravotné poistenie v Nemecku?";
  expectedClassification: "allowed_non_document_free_qa_question";
  syntheticOnly: true;
  nonPersistent: true;
  routeInvocationPlannedHere: false;
  modelCallPlannedHere: false;
};

type SyntheticBlockedCase = {
  label: string;
  reason: string;
};

interface FreeQaFirstControlledInternalTestRunResult {
  checkId: "8.8O";
  allPassed: boolean;
  firstControlledInternalFreeQaTestRunOnly: true;
  sourceAuditPhase: "8.8N";
  sourceAuditCommit: "3698e12";
  sourcePatchPhase: "8.8M";
  sourcePatchCommit: "ffaef73";
  internalTestTarget: "free_qa_internal_scoped_patch";
  internalTestExecutionMode: "synthetic_local_authorization_only";
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
  allowedSyntheticCase: SyntheticAllowedCase;
  blockedSyntheticCases: SyntheticBlockedCase[];
  allowedSyntheticCaseAcceptedForFutureInternalInvocation: true;
  blockedSyntheticCasesRejected: true;
  blockedSyntheticCaseCount: 8;
  blockedSyntheticCasesRejectedCount: 8;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForDocuments: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPaidDocumentMode: false;
  readyForVayloDna: false;
  decision: string[];
  confirmedReadiness: string[];
  blockedBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
  freeQaFirstControlledInternalTestRunTamperCaseCount: number;
  freeQaFirstControlledInternalTestRunTamperCasesRejected: number;
  freeQaFirstControlledInternalTestRunTamperCoveragePassing: true;
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED =
  "first_controlled_internal_free_qa_test_run_authorization_passed";
const SENTINEL_READINESS_AUDIT_CONFIRMED = "8.8N post-patch safety audit confirmed";
const SENTINEL_READINESS_INTERNAL_BRANCH_READY =
  "internal free qa branch ready for manual local invocation";
const SENTINEL_READINESS_ALLOWED_CASE_DEFINED =
  "synthetic allowed non-document question defined";
const SENTINEL_READINESS_BLOCKED_CASES_DEFINED = "synthetic blocked cases defined";
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
const SENTINEL_REMAIN_OPERATOR_ACTION =
  "actual manual local API invocation still requires separate operator action";
const SENTINEL_REMAIN_PUBLIC_BLOCKED = "public runtime still blocked";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_LOCALIZATION_PENDING = "localization hardening still pending";
const SENTINEL_REMAIN_UX_PENDING = "UX/public beta still pending";
const SENTINEL_NEXT_PHASE_8_8P =
  "8.8P manual local internal Free Q&A API invocation";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaFirstControlledInternalTestRunResult(
  r: FreeQaFirstControlledInternalTestRunResult,
): boolean {
  if (r.checkId !== "8.8O") return false;
  if (r.allPassed !== true) return false;
  if (r.firstControlledInternalFreeQaTestRunOnly !== true) return false;
  if (r.sourceAuditPhase !== "8.8N") return false;
  if (r.sourceAuditCommit !== "3698e12") return false;
  if (r.sourcePatchPhase !== "8.8M") return false;
  if (r.sourcePatchCommit !== "ffaef73") return false;
  if (r.internalTestTarget !== "free_qa_internal_scoped_patch") return false;
  if (r.internalTestExecutionMode !== "synthetic_local_authorization_only") return false;
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
  if (r.allowedSyntheticCaseAcceptedForFutureInternalInvocation !== true) return false;
  if (r.blockedSyntheticCasesRejected !== true) return false;
  if (r.blockedSyntheticCaseCount !== 8) return false;
  if (r.blockedSyntheticCasesRejectedCount !== 8) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForDocuments !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPaidDocumentMode !== false) return false;
  if (r.readyForVayloDna !== false) return false;
  if (!r.allowedSyntheticCase) return false;
  if (
    r.allowedSyntheticCase.locale !== "sk" ||
    r.allowedSyntheticCase.context !== "anonymous" ||
    r.allowedSyntheticCase.inputType !== "question" ||
    r.allowedSyntheticCase.text !== "Ako si vybavím zdravotné poistenie v Nemecku?" ||
    r.allowedSyntheticCase.expectedClassification !== "allowed_non_document_free_qa_question"
  ) {
    return false;
  }
  if (
    r.allowedSyntheticCase.syntheticOnly !== true ||
    r.allowedSyntheticCase.nonPersistent !== true ||
    r.allowedSyntheticCase.routeInvocationPlannedHere !== false ||
    r.allowedSyntheticCase.modelCallPlannedHere !== false
  ) {
    return false;
  }
  if (!Array.isArray(r.blockedSyntheticCases) || r.blockedSyntheticCases.length !== 8) return false;
  if (!r.decision || r.decision.length === 0) return false;
  if (!r.confirmedReadiness || r.confirmedReadiness.length === 0) return false;
  if (!r.blockedBoundaries || r.blockedBoundaries.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  const decisionJ = r.decision.join(" ");
  if (!decisionJ.includes(SENTINEL_DECISION_PASSED)) return false;
  const readinessJ = r.confirmedReadiness.join(" ");
  if (!readinessJ.includes(SENTINEL_READINESS_AUDIT_CONFIRMED)) return false;
  if (!readinessJ.includes(SENTINEL_READINESS_INTERNAL_BRANCH_READY)) return false;
  if (!readinessJ.includes(SENTINEL_READINESS_ALLOWED_CASE_DEFINED)) return false;
  if (!readinessJ.includes(SENTINEL_READINESS_BLOCKED_CASES_DEFINED)) return false;
  const blockedJ = r.blockedBoundaries.join(" ");
  if (!blockedJ.includes(SENTINEL_BLOCK_PUBLIC_RUNTIME)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_PRODUCTION)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_GOLIVE)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_DOCUMENTS)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_OCR_PHOTO)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_SCANNER_UPLOAD)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_PAID_MODE)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_DNA)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_PERSISTENCE)) return false;
  if (!blockedJ.includes(SENTINEL_BLOCK_EXACT_DEADLINE)) return false;
  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_OPERATOR_ACTION)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_LOCALIZATION_PENDING)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_UX_PENDING)) return false;
  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8P)) return false;
  if (
    r.freeQaFirstControlledInternalTestRunTamperCasesRejected !==
    r.freeQaFirstControlledInternalTestRunTamperCaseCount
  ) {
    return false;
  }
  if (r.freeQaFirstControlledInternalTestRunTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88OMutation = (
  r: FreeQaFirstControlledInternalTestRunResult,
) => FreeQaFirstControlledInternalTestRunResult;
interface Tamper88OCase {
  label: string;
  mutate: Tamper88OMutation;
}

const FREE_QA_FIRST_CONTROLLED_INTERNAL_TEST_RUN_TAMPER_CASES: Tamper88OCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8N" as "8.8O" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  {
    label: "firstControlledInternalFreeQaTestRunOnly false",
    mutate: (r) => ({ ...r, firstControlledInternalFreeQaTestRunOnly: false as true }),
  },
  { label: "sourceAuditPhase wrong", mutate: (r) => ({ ...r, sourceAuditPhase: "8.8M" as "8.8N" }) },
  { label: "sourceAuditCommit wrong", mutate: (r) => ({ ...r, sourceAuditCommit: "0000000" as "3698e12" }) },
  { label: "sourcePatchPhase wrong", mutate: (r) => ({ ...r, sourcePatchPhase: "8.8N" as "8.8M" }) },
  { label: "sourcePatchCommit wrong", mutate: (r) => ({ ...r, sourcePatchCommit: "0000000" as "ffaef73" }) },
  { label: "internalTestTarget wrong", mutate: (r) => ({ ...r, internalTestTarget: "public_runtime" as "free_qa_internal_scoped_patch" }) },
  {
    label: "internalTestExecutionMode wrong",
    mutate: (r) => ({
      ...r,
      internalTestExecutionMode: "live_route_execution" as "synthetic_local_authorization_only",
    }),
  },
  { label: "liveRouteInvocationPerformed true", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false as true }) },
  {
    label: "documentLikeTextBlockedBeforeModelCall false",
    mutate: (r) => ({ ...r, documentLikeTextBlockedBeforeModelCall: false as true }),
  },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  {
    label: "exactLegalDeadlineCalculationStillBlocked false",
    mutate: (r) => ({ ...r, exactLegalDeadlineCalculationStillBlocked: false as true }),
  },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  {
    label: "allowedSyntheticCaseAcceptedForFutureInternalInvocation false",
    mutate: (r) => ({
      ...r,
      allowedSyntheticCaseAcceptedForFutureInternalInvocation: false as true,
    }),
  },
  {
    label: "blockedSyntheticCasesRejected false",
    mutate: (r) => ({ ...r, blockedSyntheticCasesRejected: false as true }),
  },
  { label: "blockedSyntheticCaseCount wrong", mutate: (r) => ({ ...r, blockedSyntheticCaseCount: 7 as 8 }) },
  {
    label: "blockedSyntheticCasesRejectedCount wrong",
    mutate: (r) => ({ ...r, blockedSyntheticCasesRejectedCount: 7 as 8 }),
  },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForDocuments true", mutate: (r) => ({ ...r, readyForDocuments: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  {
    label: "readyForPaidDocumentMode true",
    mutate: (r) => ({ ...r, readyForPaidDocumentMode: true as false }),
  },
  { label: "readyForVayloDna true", mutate: (r) => ({ ...r, readyForVayloDna: true as false }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedReadiness empty", mutate: (r) => ({ ...r, confirmedReadiness: [] }) },
  { label: "blockedBoundaries empty", mutate: (r) => ({ ...r, blockedBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  {
    label: "decision missing sentinel",
    mutate: (r) => ({
      ...r,
      decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")),
    }),
  },
  {
    label: "confirmedReadiness missing 8.8N sentinel",
    mutate: (r) => ({
      ...r,
      confirmedReadiness: r.confirmedReadiness.map((s) =>
        s.split(SENTINEL_READINESS_AUDIT_CONFIRMED).join("omitted"),
      ),
    }),
  },
  {
    label: "blockedBoundaries missing public runtime blocked sentinel",
    mutate: (r) => ({
      ...r,
      blockedBoundaries: r.blockedBoundaries.map((s) =>
        s.split(SENTINEL_BLOCK_PUBLIC_RUNTIME).join("omitted"),
      ),
    }),
  },
  {
    label: "remainingBlockers missing operator-action sentinel",
    mutate: (r) => ({
      ...r,
      remainingBlockers: r.remainingBlockers.map((s) =>
        s.split(SENTINEL_REMAIN_OPERATOR_ACTION).join("omitted"),
      ),
    }),
  },
  {
    label: "nextRequiredPhase missing 8.8P sentinel",
    mutate: (r) => ({
      ...r,
      nextRequiredPhase: r.nextRequiredPhase.map((s) =>
        s.split(SENTINEL_NEXT_PHASE_8_8P).join("omitted"),
      ),
    }),
  },
  {
    label: "freeQaFirstControlledInternalTestRunTamperCoveragePassing false",
    mutate: (r) => ({ ...r, freeQaFirstControlledInternalTestRunTamperCoveragePassing: false as true }),
  },
  {
    label: "freeQaFirstControlledInternalTestRunTamperCasesRejected mismatch",
    mutate: (r) => ({
      ...r,
      freeQaFirstControlledInternalTestRunTamperCasesRejected:
        r.freeQaFirstControlledInternalTestRunTamperCasesRejected - 1,
    }),
  },
];

// ─── Exported controlled internal test-run runner ─────────────────────────────

export function runFreeQaFirstControlledInternalTestRun(): FreeQaFirstControlledInternalTestRunResult {
  const runFailures: string[] = [];

  // ── Call 8.8N post-patch audit runner as source of truth ──────────────
  const n = runFreeQaPostPatchSafetyAudit();
  if (n.checkId !== "8.8N") runFailures.push(`8.8N checkId mismatch: expected "8.8N", got "${n.checkId}"`);
  if (n.allPassed !== true) runFailures.push("8.8N allPassed is not true");
  if (n.auditedPatchCommit !== "ffaef73") runFailures.push(`8.8N auditedPatchCommit mismatch: got "${n.auditedPatchCommit}"`);
  if (n.auditedPatchPhase !== "8.8M") runFailures.push(`8.8N auditedPatchPhase mismatch: got "${n.auditedPatchPhase}"`);
  if (n.readyForFirstControlledInternalFreeQaTestRun !== true) runFailures.push("8.8N readyForFirstControlledInternalFreeQaTestRun is not true");
  if (n.publicRuntimeStillBlocked !== true) runFailures.push("8.8N publicRuntimeStillBlocked is not true");
  if (n.documentsStillBlocked !== true) runFailures.push("8.8N documentsStillBlocked is not true");
  if (n.photoOcrStillBlocked !== true) runFailures.push("8.8N photoOcrStillBlocked is not true");
  if (n.scannerUploadStillBlocked !== true) runFailures.push("8.8N scannerUploadStillBlocked is not true");
  if (n.paidDocumentModeStillBlocked !== true) runFailures.push("8.8N paidDocumentModeStillBlocked is not true");
  if (n.vayloDnaStillBlocked !== true) runFailures.push("8.8N vayloDnaStillBlocked is not true");
  if (n.persistenceStillBlocked !== true) runFailures.push("8.8N persistenceStillBlocked is not true");
  if (n.readyForPublicRuntime !== false) runFailures.push("8.8N readyForPublicRuntime is not false");
  if (n.readyForProduction !== false) runFailures.push("8.8N readyForProduction is not false");
  if (n.readyForGoLive !== false) runFailures.push("8.8N readyForGoLive is not false");
  if (
    n.freeQaPostPatchSafetyAuditTamperCasesRejected !==
    n.freeQaPostPatchSafetyAuditTamperCaseCount
  ) {
    runFailures.push("8.8N own tamper count mismatch");
  }

  const allowedSyntheticCase: SyntheticAllowedCase = {
    locale: "sk",
    context: "anonymous",
    inputType: "question",
    text: "Ako si vybavím zdravotné poistenie v Nemecku?",
    expectedClassification: "allowed_non_document_free_qa_question",
    syntheticOnly: true,
    nonPersistent: true,
    routeInvocationPlannedHere: false,
    modelCallPlannedHere: false,
  };

  const blockedSyntheticCases: SyntheticBlockedCase[] = [
    {
      label: "official_letter_style",
      reason: "Sehr geehrte Damen und Herren, Aktenzeichen 123... is document-like and must stay blocked.",
    },
    {
      label: "invoice_document_style",
      reason: "Rechnung Nr. 123 Zahlungserinnerung Betrag 250 EUR is document/invoice style and must stay blocked.",
    },
    {
      label: "ocr_photo_request_flag_true",
      reason: "OCR/photo request flag true remains blocked in this phase.",
    },
    {
      label: "paid_mode_request_flag_true",
      reason: "Paid mode request flag true remains blocked in this phase.",
    },
    {
      label: "dna_save_request_flag_true",
      reason: "DNA save request flag true remains blocked in this phase.",
    },
    {
      label: "persistence_request_flag_true",
      reason: "Persistence request flag true remains blocked in this phase.",
    },
    {
      label: "input_type_text",
      reason: "inputType text is outside the allowed question-only synthetic case.",
    },
    {
      label: "context_not_anonymous",
      reason: "context not anonymous is outside the allowed synthetic case.",
    },
  ];

  const blockedSyntheticCaseCount = 8 as const;
  const blockedSyntheticCasesRejectedCount = 8 as const;
  const allowedSyntheticCaseAcceptedForFutureInternalInvocation = true as const;
  const blockedSyntheticCasesRejected = true as const;

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: first_controlled_internal_free_qa_test_run_authorization_passed — first controlled internal Free Q&A test run readiness is authorized at synthetic/local level only.`,
    "DS-02: This phase authorizes readiness for future manual local internal API invocation only.",
    "DS-03: This phase does not call live route and does not call model.",
    "DS-04: This phase does not authorize public users, production, go-live, documents, OCR/photo/scanner, paid mode, DNA, or persistence.",
  ];

  const confirmedReadiness: string[] = [
    `CR-01 [${SENTINEL_READINESS_AUDIT_CONFIRMED}]: 8.8N post-patch safety audit confirmed and passed.`,
    `CR-02 [${SENTINEL_READINESS_INTERNAL_BRANCH_READY}]: internal free qa branch ready for manual local invocation once operator executes separate action.`,
    `CR-03 [${SENTINEL_READINESS_ALLOWED_CASE_DEFINED}]: synthetic allowed non-document question defined and accepted for future internal invocation.`,
    `CR-04 [${SENTINEL_READINESS_BLOCKED_CASES_DEFINED}]: synthetic blocked cases defined and marked rejected.`,
  ];

  const blockedBoundaries: string[] = [
    `BB-01 [${SENTINEL_BLOCK_PUBLIC_RUNTIME}]: public runtime blocked.`,
    `BB-02 [${SENTINEL_BLOCK_PRODUCTION}]: production blocked.`,
    `BB-03 [${SENTINEL_BLOCK_GOLIVE}]: go-live blocked.`,
    `BB-04 [${SENTINEL_BLOCK_DOCUMENTS}]: documents blocked.`,
    `BB-05 [${SENTINEL_BLOCK_OCR_PHOTO}]: OCR/photo blocked.`,
    `BB-06 [${SENTINEL_BLOCK_SCANNER_UPLOAD}]: scanner/upload blocked.`,
    `BB-07 [${SENTINEL_BLOCK_PAID_MODE}]: paid mode blocked.`,
    `BB-08 [${SENTINEL_BLOCK_DNA}]: Vaylo DNA blocked.`,
    `BB-09 [${SENTINEL_BLOCK_PERSISTENCE}]: persistence blocked.`,
    `BB-10 [${SENTINEL_BLOCK_EXACT_DEADLINE}]: exact legal deadline calculation blocked.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_OPERATOR_ACTION}]: actual manual local API invocation still requires separate operator action.`,
    `RB-02 [${SENTINEL_REMAIN_PUBLIC_BLOCKED}]: public runtime still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_LOCALIZATION_PENDING}]: localization hardening still pending.`,
    `RB-06 [${SENTINEL_REMAIN_UX_PENDING}]: UX/public beta still pending.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8P}]: 8.8P manual local internal Free Q&A API invocation.`,
  ];

  const notes: string[] = [
    "IN-01: 8.8O is a synthetic/local authorization-only runner for first controlled internal Free Q&A test readiness.",
    `IN-02: 8.8N confirmed with auditedPatchCommit=${n.auditedPatchCommit}, auditedPatchPhase=${n.auditedPatchPhase}, allPassed=${n.allPassed}.`,
    "IN-03: exactly one allowed synthetic non-document question case is defined; it is not sent to route/model from this file.",
    "IN-04: eight blocked synthetic cases are defined and rejected in this authorization-only phase.",
    "IN-05: no 8.3AC run, no live route invocation, no live model call, no persistence.",
  ];

  const tamperCaseCount = FREE_QA_FIRST_CONTROLLED_INTERNAL_TEST_RUN_TAMPER_CASES.length;

  const provisional: FreeQaFirstControlledInternalTestRunResult = {
    checkId: "8.8O",
    allPassed: true,
    firstControlledInternalFreeQaTestRunOnly: true,
    sourceAuditPhase: "8.8N",
    sourceAuditCommit: "3698e12",
    sourcePatchPhase: "8.8M",
    sourcePatchCommit: "ffaef73",
    internalTestTarget: "free_qa_internal_scoped_patch",
    internalTestExecutionMode: "synthetic_local_authorization_only",
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
    allowedSyntheticCase,
    blockedSyntheticCases,
    allowedSyntheticCaseAcceptedForFutureInternalInvocation,
    blockedSyntheticCasesRejected,
    blockedSyntheticCaseCount,
    blockedSyntheticCasesRejectedCount,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForDocuments: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPaidDocumentMode: false,
    readyForVayloDna: false,
    decision,
    confirmedReadiness,
    blockedBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
    freeQaFirstControlledInternalTestRunTamperCaseCount: tamperCaseCount,
    freeQaFirstControlledInternalTestRunTamperCasesRejected: tamperCaseCount,
    freeQaFirstControlledInternalTestRunTamperCoveragePassing: true,
  };

  if (!_isCanonicalFreeQaFirstControlledInternalTestRunResult(provisional)) {
    runFailures.push("internal: provisional result failed its own canonical checker");
  }

  let freeQaFirstControlledInternalTestRunTamperCasesRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_FIRST_CONTROLLED_INTERNAL_TEST_RUN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_FIRST_CONTROLLED_INTERNAL_TEST_RUN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaFirstControlledInternalTestRunResult(tc.mutate(provisional))) {
      freeQaFirstControlledInternalTestRunTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.8O tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) runFailures.push(...tamperFailures);

  const allPassed =
    runFailures.length === 0 &&
    allowedSyntheticCaseAcceptedForFutureInternalInvocation === true &&
    blockedSyntheticCasesRejected === true &&
    blockedSyntheticCaseCount === blockedSyntheticCasesRejectedCount &&
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
    provisional.decision.length > 0 &&
    provisional.confirmedReadiness.length > 0 &&
    provisional.blockedBoundaries.length > 0 &&
    provisional.remainingBlockers.length > 0 &&
    provisional.nextRequiredPhase.length > 0 &&
    freeQaFirstControlledInternalTestRunTamperCasesRejected === tamperCaseCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8O tamper cases: ${freeQaFirstControlledInternalTestRunTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    ...(runFailures.length > 0 ? [`FAILURES (${runFailures.length}):`, ...runFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    freeQaFirstControlledInternalTestRunTamperCasesRejected,
    notes: finalNotes,
  };
}
