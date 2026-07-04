/**
 * PHASE 8.8S — Public Free Q&A Runtime Gate Design
 *
 * Design/contract-only phase. This phase defines the local governance
 * contract for a FUTURE public Free Q&A runtime gate, after the completed
 * 8.8R controlled internal regression pack.
 *
 * This phase does NOT enable public runtime, production, or go-live.
 * This phase does NOT call the live route, does NOT call OpenAI, does NOT
 * use fetch, does NOT read process.env, and does NOT write files or touch
 * any DB/Supabase/storage. It only defines and locally validates the
 * proposed public gate model (env flag, mode, rules, and design cases).
 */

import { runFreeQaControlledInternalRegressionPack } from "./run-free-qa-controlled-internal-regression-pack";

// ─── Internal types ───────────────────────────────────────────────────────────

type AllowedPublicBetaDesignCase = {
  locale: "sk";
  context: "anonymous";
  inputType: "question";
  text: string;
  expectedClassification: "allowed_public_beta_free_qa_question";
  syntheticOnly: true;
  nonPersistent: true;
  routeInvocationPlannedHere: false;
  modelCallPlannedHere: false;
};

type BlockedPublicBetaDesignCase = {
  label: string;
  textOrFlag: string;
  expectedBlockedReason: string;
};

interface FreeQaPublicRuntimeGateDesignResult {
  checkId: "8.8S";
  allPassed: boolean;
  publicRuntimeGateDesignOnly: true;
  sourceRegressionPhase: "8.8R";
  sourceRegressionCommit: "b20edfe";
  sourcePatchCommit: "ffaef73";
  proposedPublicEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED";
  proposedPublicEnvDefault: false;
  proposedPublicMode: "free_qa_public_beta";
  publicRuntimeAuthorizedNow: false;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  documentsStillBlocked: true;
  photoOcrStillBlocked: true;
  scannerUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  exactLegalDeadlineStillBlocked: true;
  modelOutputStillUntrusted: true;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
  rateLimitRequired: true;
  anonymousOnlyRequired: true;
  questionOnlyRequired: true;
  slovakAllowedForBeta: true;
  safeFailClosedErrorHandlingRequired: true;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  fetchUsed: false;
  processEnvRead: false;
  openAiSdkImported: false;
  filesWritten: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  allowedDesignCaseCount: 8;
  blockedDesignCaseCount: 15;
  blockedDesignCasesRejected: true;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: true;
  readyForPublicFreeQaRoutePatchBehindEnvFlag: true;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForDocuments: false;
  readyForPhotoOcr: false;
  readyForScannerUpload: false;
  readyForPaidDocumentMode: false;
  readyForVayloDna: false;
  readyForPersistence: false;
  publicGateRules: string[];
  allowedDesignCases: AllowedPublicBetaDesignCase[];
  blockedDesignCases: BlockedPublicBetaDesignCase[];
  decision: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "public_free_qa_runtime_gate_design_passed";
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
const SENTINEL_PRIVACY_DISCLAIMER = "privacy disclaimer required";
const SENTINEL_LEGAL_DISCLAIMER = "legal disclaimer required";
const SENTINEL_RATE_LIMIT = "rate limit required";
const SENTINEL_FAIL_CLOSED = "safe fail-closed error handling required";
const SENTINEL_PUBLIC_FLAG_DEFAULT_FALSE = "public flag false by default";
const SENTINEL_ANONYMOUS_ONLY = "anonymous only";
const SENTINEL_QUESTION_ONLY = "inputType question only";
const SENTINEL_ALLOWED_LOCALES_ONLY = "allowed locales only";
const SENTINEL_SLOVAK_ALLOWED_BETA = "Slovak must be allowed for beta";
const SENTINEL_DOC_TEXT_BLOCKED_BEFORE_MODEL = "document-like text blocked before model call";

const SENTINEL_REMAIN_ROUTE_PATCH_REQUIRED = "public Free Q&A route patch behind env flag still required";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_GOLIVE_BLOCKED = "go-live still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";
const SENTINEL_REMAIN_OCR_BLOCKED = "OCR/photo still blocked";
const SENTINEL_REMAIN_PAID_BLOCKED = "paid mode still blocked";
const SENTINEL_REMAIN_DNA_BLOCKED = "Vaylo DNA still blocked";
const SENTINEL_REMAIN_PERSISTENCE_BLOCKED = "persistence still blocked";
const SENTINEL_REMAIN_ENV_FLAG_OFF = "env flag must remain false by default";
const SENTINEL_REMAIN_UI_TESTING_REQUIRED = "UI/browser testing still required";

const SENTINEL_NEXT_PHASE_8_8T =
  "8.8T public Free Q&A route patch behind env flag (not authorized yet)";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPublicRuntimeGateDesignResult(
  r: FreeQaPublicRuntimeGateDesignResult,
): boolean {
  if (r.checkId !== "8.8S") return false;
  if (r.allPassed !== true) return false;
  if (r.publicRuntimeGateDesignOnly !== true) return false;
  if (r.sourceRegressionPhase !== "8.8R") return false;
  if (r.sourceRegressionCommit !== "b20edfe") return false;
  if (r.sourcePatchCommit !== "ffaef73") return false;
  if (r.proposedPublicEnvFlag !== "SMART_TALK_FREE_QA_PUBLIC_ENABLED") return false;
  if (r.proposedPublicEnvDefault !== false) return false;
  if (r.proposedPublicMode !== "free_qa_public_beta") return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
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
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.rateLimitRequired !== true) return false;
  if (r.anonymousOnlyRequired !== true) return false;
  if (r.questionOnlyRequired !== true) return false;
  if (r.slovakAllowedForBeta !== true) return false;
  if (r.safeFailClosedErrorHandlingRequired !== true) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.processEnvRead !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.filesWritten !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.allowedDesignCaseCount !== 8) return false;
  if (r.blockedDesignCaseCount !== 15) return false;
  if (r.blockedDesignCasesRejected !== true) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.readyForPublicFreeQaRoutePatchBehindEnvFlag !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForDocuments !== false) return false;
  if (r.readyForPhotoOcr !== false) return false;
  if (r.readyForScannerUpload !== false) return false;
  if (r.readyForPaidDocumentMode !== false) return false;
  if (r.readyForVayloDna !== false) return false;
  if (r.readyForPersistence !== false) return false;
  if (!Array.isArray(r.publicGateRules) || r.publicGateRules.length !== 17) return false;
  if (!Array.isArray(r.allowedDesignCases) || r.allowedDesignCases.length !== 8) return false;
  if (!Array.isArray(r.blockedDesignCases) || r.blockedDesignCases.length !== 15) return false;
  if (!r.decision || r.decision.length === 0) return false;
  if (!r.confirmedSafetyBoundaries || r.confirmedSafetyBoundaries.length === 0) return false;
  if (!r.remainingBlockers || r.remainingBlockers.length === 0) return false;
  if (!r.nextRequiredPhase || r.nextRequiredPhase.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  const decisionJ = r.decision.join(" ");
  if (!decisionJ.includes(SENTINEL_DECISION_PASSED)) return false;

  const rulesJ = r.publicGateRules.join(" ");
  if (!rulesJ.includes(SENTINEL_ANONYMOUS_ONLY)) return false;
  if (!rulesJ.includes(SENTINEL_QUESTION_ONLY)) return false;
  if (!rulesJ.includes(SENTINEL_ALLOWED_LOCALES_ONLY)) return false;
  if (!rulesJ.includes(SENTINEL_SLOVAK_ALLOWED_BETA)) return false;
  if (!rulesJ.includes(SENTINEL_DOC_TEXT_BLOCKED_BEFORE_MODEL)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_OCR_PHOTO)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_SCANNER_UPLOAD)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_PAID_MODE)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_DNA)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_PERSISTENCE)) return false;
  if (!rulesJ.includes(SENTINEL_BLOCK_EXACT_DEADLINE)) return false;
  if (!rulesJ.includes(SENTINEL_RATE_LIMIT)) return false;
  if (!rulesJ.includes(SENTINEL_MODEL_OUTPUT_UNTRUSTED)) return false;
  if (!rulesJ.includes(SENTINEL_PRIVACY_DISCLAIMER)) return false;
  if (!rulesJ.includes(SENTINEL_LEGAL_DISCLAIMER)) return false;
  if (!rulesJ.includes(SENTINEL_FAIL_CLOSED)) return false;
  if (!rulesJ.includes(SENTINEL_PUBLIC_FLAG_DEFAULT_FALSE)) return false;

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
  if (!boundariesJ.includes(SENTINEL_PRIVACY_DISCLAIMER)) return false;
  if (!boundariesJ.includes(SENTINEL_LEGAL_DISCLAIMER)) return false;

  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_ROUTE_PATCH_REQUIRED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_GOLIVE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_OCR_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PAID_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DNA_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PERSISTENCE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_ENV_FLAG_OFF)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_UI_TESTING_REQUIRED)) return false;

  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8T)) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper88SMutation = (
  r: FreeQaPublicRuntimeGateDesignResult,
) => FreeQaPublicRuntimeGateDesignResult;
interface Tamper88SCase {
  label: string;
  mutate: Tamper88SMutation;
}

const FREE_QA_PUBLIC_RUNTIME_GATE_DESIGN_TAMPER_CASES: Tamper88SCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8R" as "8.8S" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "publicRuntimeGateDesignOnly false", mutate: (r) => ({ ...r, publicRuntimeGateDesignOnly: false as true }) },
  { label: "sourceRegressionPhase wrong", mutate: (r) => ({ ...r, sourceRegressionPhase: "8.8Q" as "8.8R" }) },
  { label: "sourceRegressionCommit wrong", mutate: (r) => ({ ...r, sourceRegressionCommit: "0000000" as "b20edfe" }) },
  { label: "sourcePatchCommit wrong", mutate: (r) => ({ ...r, sourcePatchCommit: "0000000" as "ffaef73" }) },
  { label: "proposedPublicEnvFlag wrong", mutate: (r) => ({ ...r, proposedPublicEnvFlag: "FREE_QA_PUBLIC" as "SMART_TALK_FREE_QA_PUBLIC_ENABLED" }) },
  { label: "proposedPublicEnvDefault true", mutate: (r) => ({ ...r, proposedPublicEnvDefault: true as false }) },
  { label: "proposedPublicMode wrong", mutate: (r) => ({ ...r, proposedPublicMode: "free_qa_public_ga" as "free_qa_public_beta" }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "publicRuntimeStillBlocked false", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false as true }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "exactLegalDeadlineStillBlocked false", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "privacyDisclaimerRequired false", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false as true }) },
  { label: "legalDisclaimerRequired false", mutate: (r) => ({ ...r, legalDisclaimerRequired: false as true }) },
  { label: "rateLimitRequired false", mutate: (r) => ({ ...r, rateLimitRequired: false as true }) },
  { label: "anonymousOnlyRequired false", mutate: (r) => ({ ...r, anonymousOnlyRequired: false as true }) },
  { label: "questionOnlyRequired false", mutate: (r) => ({ ...r, questionOnlyRequired: false as true }) },
  { label: "slovakAllowedForBeta false", mutate: (r) => ({ ...r, slovakAllowedForBeta: false as true }) },
  { label: "safeFailClosedErrorHandlingRequired false", mutate: (r) => ({ ...r, safeFailClosedErrorHandlingRequired: false as true }) },
  { label: "liveRouteInvocationPerformed true", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "fetchUsed true", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvRead true", mutate: (r) => ({ ...r, processEnvRead: true as false }) },
  { label: "openAiSdkImported true", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "filesWritten true", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "allowedDesignCaseCount wrong", mutate: (r) => ({ ...r, allowedDesignCaseCount: 7 as 8 }) },
  { label: "blockedDesignCaseCount wrong", mutate: (r) => ({ ...r, blockedDesignCaseCount: 14 as 15 }) },
  { label: "blockedDesignCasesRejected false", mutate: (r) => ({ ...r, blockedDesignCasesRejected: false as true }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false as true }) },
  { label: "readyForPublicFreeQaRoutePatchBehindEnvFlag false", mutate: (r) => ({ ...r, readyForPublicFreeQaRoutePatchBehindEnvFlag: false as true }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForDocuments true", mutate: (r) => ({ ...r, readyForDocuments: true as false }) },
  { label: "readyForPhotoOcr true", mutate: (r) => ({ ...r, readyForPhotoOcr: true as false }) },
  { label: "readyForScannerUpload true", mutate: (r) => ({ ...r, readyForScannerUpload: true as false }) },
  { label: "readyForPaidDocumentMode true", mutate: (r) => ({ ...r, readyForPaidDocumentMode: true as false }) },
  { label: "readyForVayloDna true", mutate: (r) => ({ ...r, readyForVayloDna: true as false }) },
  { label: "readyForPersistence true", mutate: (r) => ({ ...r, readyForPersistence: true as false }) },
  { label: "publicGateRules empty", mutate: (r) => ({ ...r, publicGateRules: [] }) },
  { label: "publicGateRules wrong length", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.slice(0, 5) }) },
  { label: "allowedDesignCases empty", mutate: (r) => ({ ...r, allowedDesignCases: [] }) },
  { label: "blockedDesignCases empty", mutate: (r) => ({ ...r, blockedDesignCases: [] }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "publicGateRules missing anonymous-only sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_ANONYMOUS_ONLY).join("omitted")) }) },
  { label: "publicGateRules missing question-only sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_QUESTION_ONLY).join("omitted")) }) },
  { label: "publicGateRules missing allowed-locales sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_ALLOWED_LOCALES_ONLY).join("omitted")) }) },
  { label: "publicGateRules missing Slovak-allowed sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_SLOVAK_ALLOWED_BETA).join("omitted")) }) },
  { label: "publicGateRules missing document-text-blocked sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_DOC_TEXT_BLOCKED_BEFORE_MODEL).join("omitted")) }) },
  { label: "publicGateRules missing rate-limit sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_RATE_LIMIT).join("omitted")) }) },
  { label: "publicGateRules missing privacy-disclaimer sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_PRIVACY_DISCLAIMER).join("omitted")) }) },
  { label: "publicGateRules missing legal-disclaimer sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_LEGAL_DISCLAIMER).join("omitted")) }) },
  { label: "publicGateRules missing fail-closed sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_FAIL_CLOSED).join("omitted")) }) },
  { label: "publicGateRules missing default-false sentinel", mutate: (r) => ({ ...r, publicGateRules: r.publicGateRules.map((s) => s.split(SENTINEL_PUBLIC_FLAG_DEFAULT_FALSE).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public runtime blocked sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_BLOCK_PUBLIC_RUNTIME).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing model-output-untrusted sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_MODEL_OUTPUT_UNTRUSTED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing privacy-disclaimer sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PRIVACY_DISCLAIMER).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing legal-disclaimer sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_LEGAL_DISCLAIMER).join("omitted")) }) },
  { label: "remainingBlockers missing route-patch-required sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_ROUTE_PATCH_REQUIRED).join("omitted")) }) },
  { label: "remainingBlockers missing env-flag-off sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_ENV_FLAG_OFF).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8T sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8T).join("omitted")) }) },
];

// ─── Exported public runtime gate design runner ────────────────────────────────

export function runFreeQaPublicRuntimeGateDesign(): FreeQaPublicRuntimeGateDesignResult {
  const designFailures: string[] = [];

  // ── Call 8.8R controlled internal regression pack runner as source of truth ──
  const r = runFreeQaControlledInternalRegressionPack();
  if (r.checkId !== "8.8R") designFailures.push(`8.8R checkId mismatch: expected "8.8R", got "${r.checkId}"`);
  if (r.allPassed !== true) designFailures.push("8.8R allPassed is not true");
  if (r.sourceClosureCommit !== "7ff919e") designFailures.push(`8.8R sourceClosureCommit mismatch: got "${r.sourceClosureCommit}"`);
  if (r.sourceAuthorizationCommit !== "d865f7d") designFailures.push(`8.8R sourceAuthorizationCommit mismatch: got "${r.sourceAuthorizationCommit}"`);
  if (r.sourcePatchCommit !== "ffaef73") designFailures.push(`8.8R sourcePatchCommit mismatch: got "${r.sourcePatchCommit}"`);
  if (r.allowedRegressionCaseCount !== 8) designFailures.push("8.8R allowedRegressionCaseCount is not 8");
  if (r.blockedRegressionCaseCount !== 15) designFailures.push("8.8R blockedRegressionCaseCount is not 15");
  if (r.liveRouteInvocationPerformed !== false) designFailures.push("8.8R liveRouteInvocationPerformed is not false");
  if (r.liveModelCallPerformed !== false) designFailures.push("8.8R liveModelCallPerformed is not false");
  if (r.publicRuntimeStillBlocked !== true) designFailures.push("8.8R publicRuntimeStillBlocked is not true");
  if (r.productionAuthorizedNow !== false) designFailures.push("8.8R productionAuthorizedNow is not false");
  if (r.goLiveAuthorizedNow !== false) designFailures.push("8.8R goLiveAuthorizedNow is not false");
  if (r.documentsStillBlocked !== true) designFailures.push("8.8R documentsStillBlocked is not true");
  if (r.photoOcrStillBlocked !== true) designFailures.push("8.8R photoOcrStillBlocked is not true");
  if (r.scannerUploadStillBlocked !== true) designFailures.push("8.8R scannerUploadStillBlocked is not true");
  if (r.paidDocumentModeStillBlocked !== true) designFailures.push("8.8R paidDocumentModeStillBlocked is not true");
  if (r.vayloDnaStillBlocked !== true) designFailures.push("8.8R vayloDnaStillBlocked is not true");
  if (r.persistenceStillBlocked !== true) designFailures.push("8.8R persistenceStillBlocked is not true");
  if (r.exactLegalDeadlineCalculationStillBlocked !== true) designFailures.push("8.8R exactLegalDeadlineCalculationStillBlocked is not true");
  if (r.modelOutputStillUntrusted !== true) designFailures.push("8.8R modelOutputStillUntrusted is not true");
  if (r.readyForPublicRuntimeGateDesign !== true) designFailures.push("8.8R readyForPublicRuntimeGateDesign is not true");
  if (
    r.freeQaControlledInternalRegressionPackTamperCasesRejected !==
    r.freeQaControlledInternalRegressionPackTamperCaseCount
  ) {
    designFailures.push("8.8R own tamper count mismatch");
  }

  const allowedDesignCases: AllowedPublicBetaDesignCase[] = [
    {
      locale: "sk",
      context: "anonymous",
      inputType: "question",
      text: "Ako si vybavím zdravotné poistenie v Nemecku?",
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
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
      expectedClassification: "allowed_public_beta_free_qa_question",
      syntheticOnly: true,
      nonPersistent: true,
      routeInvocationPlannedHere: false,
      modelCallPlannedHere: false,
    },
  ];

  const blockedDesignCases: BlockedPublicBetaDesignCase[] = [
    {
      label: "official_letter",
      textOrFlag: "Sehr geehrte Damen und Herren, Aktenzeichen 789, Bescheid liegt bei.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "rechnung",
      textOrFlag: "Rechnung Nr. 456, Betrag fällig binnen 14 Tagen.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "mahnung",
      textOrFlag: "Mahnung: letzte Zahlungserinnerung vor Inkasso.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "bescheid_rechtsbehelf",
      textOrFlag: "Bescheid mit Rechtsbehelfsbelehrung, Aktenzeichen 321.",
      expectedBlockedReason: "document_mode_required",
    },
    {
      label: "exact_legal_deadline_request",
      textOrFlag: "Bis wann genau muss ich Widerspruch einlegen laut Bescheid vom 01.04.2026?",
      expectedBlockedReason: "exact_legal_deadline_calculation_blocked",
    },
    {
      label: "ocr_photo_request",
      textOrFlag: "requestedOcr=true/requestedPhoto=true",
      expectedBlockedReason: "ocr_photo_blocked",
    },
    {
      label: "scanner_upload_request",
      textOrFlag: "requestedScannerUpload=true/requestedFileUpload=true",
      expectedBlockedReason: "scanner_upload_blocked",
    },
    {
      label: "paid_mode_request",
      textOrFlag: "requestedPaidMode=true/requestedPayment=true",
      expectedBlockedReason: "paid_mode_blocked",
    },
    {
      label: "dna_save_request",
      textOrFlag: "requestedDnaSave=true",
      expectedBlockedReason: "vaylo_dna_blocked",
    },
    {
      label: "persistence_request",
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
      label: "document_like_slovak_official_letter",
      textOrFlag:
        "Vážený pán/pani, Vaše evidenčné číslo je 789, toto je úradné rozhodnutie s poučením o odvolaní.",
      expectedBlockedReason: "document_mode_required",
    },
  ];

  const publicGateRules: string[] = [
    `PG-01 [${SENTINEL_ANONYMOUS_ONLY}]: anonymous only.`,
    `PG-02 [${SENTINEL_QUESTION_ONLY}]: inputType question only.`,
    `PG-03 [${SENTINEL_ALLOWED_LOCALES_ONLY}]: allowed locales only.`,
    `PG-04 [${SENTINEL_SLOVAK_ALLOWED_BETA}]: Slovak must be allowed for beta.`,
    `PG-05 [${SENTINEL_DOC_TEXT_BLOCKED_BEFORE_MODEL}]: document-like text blocked before model call.`,
    `PG-06 [${SENTINEL_BLOCK_OCR_PHOTO}]: OCR/photo blocked.`,
    `PG-07 [${SENTINEL_BLOCK_SCANNER_UPLOAD}]: scanner/upload blocked.`,
    `PG-08 [${SENTINEL_BLOCK_PAID_MODE}]: paid document mode blocked.`,
    `PG-09 [${SENTINEL_BLOCK_DNA}]: Vaylo DNA blocked.`,
    `PG-10: persistence/DB/storage blocked. [${SENTINEL_BLOCK_PERSISTENCE}]`,
    `PG-11 [${SENTINEL_BLOCK_EXACT_DEADLINE}]: exact legal deadline calculation blocked.`,
    `PG-12 [${SENTINEL_RATE_LIMIT}]: rate limit required.`,
    `PG-13 [${SENTINEL_MODEL_OUTPUT_UNTRUSTED}]: model output untrusted.`,
    `PG-14 [${SENTINEL_PRIVACY_DISCLAIMER}]: privacy disclaimer required.`,
    `PG-15 [${SENTINEL_LEGAL_DISCLAIMER}]: legal disclaimer required.`,
    `PG-16 [${SENTINEL_FAIL_CLOSED}]: safe fail-closed error handling required.`,
    `PG-17 [${SENTINEL_PUBLIC_FLAG_DEFAULT_FALSE}]: public flag false by default.`,
  ];

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: public_free_qa_runtime_gate_design_passed — the public Free Q&A runtime gate model is defined and passes local synthetic checks.`,
    "DS-02: This phase is design/contract-only and performs no live route/model/fetch/env/file/DB access.",
    "DS-03: This phase keeps public runtime, production, and go-live blocked.",
    `DS-04: proposed env flag "${"SMART_TALK_FREE_QA_PUBLIC_ENABLED"}" defaults to false; proposed mode is "${"free_qa_public_beta"}".`,
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
    `SB-12 [${SENTINEL_PRIVACY_DISCLAIMER}]: privacy disclaimer required.`,
    `SB-13 [${SENTINEL_LEGAL_DISCLAIMER}]: legal disclaimer required.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_ROUTE_PATCH_REQUIRED}]: public Free Q&A route patch behind env flag still required.`,
    `RB-02 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-03 [${SENTINEL_REMAIN_GOLIVE_BLOCKED}]: go-live still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_OCR_BLOCKED}]: OCR/photo still blocked.`,
    `RB-06 [${SENTINEL_REMAIN_PAID_BLOCKED}]: paid mode still blocked.`,
    `RB-07 [${SENTINEL_REMAIN_DNA_BLOCKED}]: Vaylo DNA still blocked.`,
    `RB-08 [${SENTINEL_REMAIN_PERSISTENCE_BLOCKED}]: persistence still blocked.`,
    `RB-09 [${SENTINEL_REMAIN_ENV_FLAG_OFF}]: env flag must remain false by default until explicitly authorized.`,
    `RB-10 [${SENTINEL_REMAIN_UI_TESTING_REQUIRED}]: UI/browser testing still required.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8T}]: 8.8T public Free Q&A route patch behind env flag (not authorized yet).`,
  ];

  const notes: string[] = [
    "IN-01: 8.8S defines a local governance contract for a future public Free Q&A runtime gate only; no live route/model/fetch/env/file/DB access is performed.",
    `IN-02: 8.8R confirmed — checkId=${r.checkId}, allPassed=${r.allPassed}, sourceRegressionCommit=b20edfe (expected), sourcePatchCommit=${r.sourcePatchCommit}.`,
    "IN-03: 8 allowed sk/anonymous/question public-beta design cases are defined for future public route patch design only.",
    "IN-04: 15 blocked design cases are defined (documents, letters/invoices/dunning notices, exact legal deadlines, OCR/photo, scanner/upload, paid mode, DNA, persistence, text mode, non-anonymous, short/URL inputs).",
    "IN-05: 17 public gate rules are defined, including anonymous-only, question-only, allowed locales with Slovak required for beta, document-text blocking before any model call, rate limiting, untrusted model output, privacy/legal disclaimers, fail-closed error handling, and env flag false by default.",
    "IN-06: all public/production/go-live/document/OCR/scanner/paid/DNA/persistence readiness flags remain blocked in this phase.",
  ];

  const tamperCount = FREE_QA_PUBLIC_RUNTIME_GATE_DESIGN_TAMPER_CASES.length;

  const provisional: FreeQaPublicRuntimeGateDesignResult = {
    checkId: "8.8S",
    allPassed: true,
    publicRuntimeGateDesignOnly: true,
    sourceRegressionPhase: "8.8R",
    sourceRegressionCommit: "b20edfe",
    sourcePatchCommit: "ffaef73",
    proposedPublicEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED",
    proposedPublicEnvDefault: false,
    proposedPublicMode: "free_qa_public_beta",
    publicRuntimeAuthorizedNow: false,
    publicRuntimeStillBlocked: true,
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
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    rateLimitRequired: true,
    anonymousOnlyRequired: true,
    questionOnlyRequired: true,
    slovakAllowedForBeta: true,
    safeFailClosedErrorHandlingRequired: true,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    fetchUsed: false,
    processEnvRead: false,
    openAiSdkImported: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    allowedDesignCaseCount: 8,
    blockedDesignCaseCount: 15,
    blockedDesignCasesRejected: true,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    readyForPublicFreeQaRoutePatchBehindEnvFlag: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForDocuments: false,
    readyForPhotoOcr: false,
    readyForScannerUpload: false,
    readyForPaidDocumentMode: false,
    readyForVayloDna: false,
    readyForPersistence: false,
    publicGateRules,
    allowedDesignCases,
    blockedDesignCases,
    decision,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
  };

  if (!_isCanonicalFreeQaPublicRuntimeGateDesignResult(provisional)) {
    designFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_RUNTIME_GATE_DESIGN_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_RUNTIME_GATE_DESIGN_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPublicRuntimeGateDesignResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.8S tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) designFailures.push(...tamperFailures);

  const allPassed =
    designFailures.length === 0 &&
    r.checkId === "8.8R" &&
    r.allPassed === true &&
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
    provisional.privacyDisclaimerRequired === true &&
    provisional.legalDisclaimerRequired === true &&
    provisional.rateLimitRequired === true &&
    provisional.liveRouteInvocationPerformed === false &&
    provisional.liveModelCallPerformed === false &&
    provisional.fetchUsed === false &&
    provisional.processEnvRead === false &&
    provisional.openAiSdkImported === false &&
    provisional.filesWritten === false &&
    provisional.dbStorageTouched === false &&
    provisional.allowedDesignCases.length === 8 &&
    provisional.blockedDesignCases.length === 15 &&
    provisional.publicGateRules.length === 17 &&
    provisional.decision.length > 0 &&
    provisional.confirmedSafetyBoundaries.length > 0 &&
    provisional.remainingBlockers.length > 0 &&
    provisional.nextRequiredPhase.length > 0 &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8S tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(designFailures.length > 0 ? [`FAILURES (${designFailures.length}):`, ...designFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.8S result as JSON. No file/network/env access is performed here;
// this only reads process.argv[1] to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-free-qa-public-runtime-gate-design");

if (invokedDirectly) {
  console.log(JSON.stringify(runFreeQaPublicRuntimeGateDesign(), null, 2));
}
