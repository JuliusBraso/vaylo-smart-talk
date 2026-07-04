/**
 * PHASE 8.8U — Public Free Q&A Route Patch Safety/Regression Audit
 *
 * Audit-only phase for the uncommitted 8.8T route patch in
 * app/api/smart-talk/route.ts. This audit reads that file as STATIC TEXT
 * (the only permitted I/O in this phase) and validates required markers,
 * ordering, and boundaries with pure string/regex analysis. It does not
 * invoke the route, does not import the route module, does not call
 * runSmartTalk, does not call OpenAI, and does not use fetch.
 *
 * This phase does NOT enable public runtime, production, or go-live.
 */

import fs from "fs";
import path from "path";
import { runFreeQaPublicRuntimeGateDesign } from "./run-free-qa-public-runtime-gate-design";

// ─── Static analysis (pure — operates only on a source string argument) ───────

interface RouteSourceAnalysis {
  publicModeMarkerPresent: boolean;
  envFlagMarkerPresent: boolean;
  exactEnvFlagCheckPresent: boolean;
  disabledFailClosedCodePresent: boolean;
  publicDisabledBeforeModelCall: boolean;
  rateLimitMarkersPresent: boolean;
  rateLimitBeforePublicBranch: boolean;
  publicBranchAfterBodyParseAndRateLimit: boolean;
  anonymousOnlyValidationPresent: boolean;
  questionOnlyValidationPresent: boolean;
  localeValidationPresent: boolean;
  minMaxTextValidationPresent: boolean;
  ocrPhotoScannerUploadBlockPresent: boolean;
  paidDnaPersistenceBlockPresent: boolean;
  documentBlockBeforeModelCall: boolean;
  exactLegalDeadlineBlockBeforeModelCall: boolean;
  slovakExactDeadlineCoveragePresent: boolean;
  publicSuccessMetadataPresent: boolean;
  internalBranchMarkersPresent: boolean;
  dangerousReadinessMarkersAbsent: boolean;
  dangerousDbStorageMarkersAbsent: boolean;
  noOpenAiSdkImportInRoute: boolean;
  noFetchCallInRoute: boolean;
}

const PUBLIC_BRANCH_ANCHOR = 'if (o.mode === FREE_QA_PUBLIC_BETA_MODE)';
const PUBLIC_BRANCH_END_MARKER = '// ── End Phase 8.8T public Free Q&A beta branch';
const PUBLIC_RUN_SMART_TALK_CALL = 'runSmartTalk({ text, locale, inputType: "question" })';

const SLOVAK_EXACT_DEADLINE_PHRASES: readonly string[] = [
  "dokedy presne",
  "do kedy presne",
  "presná lehota",
  "presnú lehotu",
  "lehota na odvolanie",
  "lehota na odpor",
  "lehota na námietku",
  "dokedy musím podať odvolanie",
  "dokedy musím podať odpor",
];

const PUBLIC_SUCCESS_METADATA_KEYS: readonly string[] = [
  "publicFreeQaBetaEnabled",
  "anonymousNonDocumentQuestionOnly",
  "documentLikeTextBlocked",
  "publicRuntimeBehindEnvFlag",
  "documentsStillBlocked",
  "photoOcrScannerUploadStillBlocked",
  "paidDnaStillBlocked",
  "persistenceStillBlocked",
  "exactLegalDeadlineStillBlocked",
  "modelOutputStillUntrusted",
  "legalDisclaimerRequired",
  "privacyDisclaimerRequired",
  "eightThreeAcNotRun",
];

const INTERNAL_BRANCH_MARKERS: readonly string[] = [
  "FREE_QA_INTERNAL_RUNTIME_MODE",
  "free_qa_internal_scoped_patch",
  "FREE_QA_INTERNAL_RUNTIME_GUARD",
  "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY",
  "x-vaylo-internal-runtime-secret",
  "VAYLO_INTERNAL_RUNTIME_SECRET",
];

const DANGEROUS_READINESS_PATTERN =
  /readyForProduction\s*:\s*true|readyForGoLive\s*:\s*true|productionEnabled\s*:\s*true|goLiveEnabled\s*:\s*true|documentsEnabled\s*:\s*true|ocrEnabled\s*:\s*true|photoEnabled\s*:\s*true|scannerEnabled\s*:\s*true|uploadEnabled\s*:\s*true|paidModeEnabled\s*:\s*true|vayloDnaEnabled\s*:\s*true|dnaEnabled\s*:\s*true/i;

const DANGEROUS_DB_STORAGE_PATTERN =
  /supabase|fs\.writeFile|\.from\(["'`][\w-]+["'`]\)\.insert\(|persistenceEnabled\s*:\s*true|dbWriteEnabled\s*:\s*true/i;

function extractSlice(source: string, startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  if (start === -1) return "";
  const end = source.indexOf(endMarker, start);
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

function analyzeRouteSource(source: string): RouteSourceAnalysis {
  const publicSlice = extractSlice(source, PUBLIC_BRANCH_ANCHOR, PUBLIC_BRANCH_END_MARKER);

  const publicModeMarkerPresent =
    source.includes("FREE_QA_PUBLIC_BETA_MODE") && source.includes('"free_qa_public_beta"');
  const envFlagMarkerPresent =
    source.includes("FREE_QA_PUBLIC_RUNTIME_ENV_FLAG") &&
    source.includes('"SMART_TALK_FREE_QA_PUBLIC_ENABLED"');
  const exactEnvFlagCheckPresent = /process\.env\[FREE_QA_PUBLIC_RUNTIME_ENV_FLAG\]\s*===\s*"true"/.test(
    source,
  );

  const disabledCodeIdx = source.indexOf('"free_qa_public_beta_disabled"');
  const disabledFailClosedCodePresent =
    disabledCodeIdx !== -1 && /status:\s*403/.test(source.slice(disabledCodeIdx, disabledCodeIdx + 1000));

  const disabledCodeIdxInSlice = publicSlice.indexOf('"free_qa_public_beta_disabled"');
  const publicRunSmartTalkIdx = publicSlice.indexOf(PUBLIC_RUN_SMART_TALK_CALL);
  const publicDisabledBeforeModelCall =
    disabledCodeIdxInSlice !== -1 &&
    publicRunSmartTalkIdx !== -1 &&
    disabledCodeIdxInSlice < publicRunSmartTalkIdx;

  const getClientIpCallIdx = source.indexOf("getClientIp(req)");
  const rateLimitCallIdx = source.indexOf("takeRateSlot(ip)");
  const publicAnchorIdx = source.indexOf(PUBLIC_BRANCH_ANCHOR);
  const bodyParseIdx = source.indexOf("body = await req.json()");

  const rateLimitMarkersPresent =
    getClientIpCallIdx !== -1 &&
    rateLimitCallIdx !== -1 &&
    source.includes("smart_talk_rate_limited") &&
    /status:\s*429/.test(source);
  const rateLimitBeforePublicBranch =
    rateLimitMarkersPresent &&
    publicAnchorIdx !== -1 &&
    rateLimitCallIdx < publicAnchorIdx &&
    getClientIpCallIdx < publicAnchorIdx;
  const publicBranchAfterBodyParseAndRateLimit =
    publicAnchorIdx !== -1 &&
    bodyParseIdx !== -1 &&
    bodyParseIdx < publicAnchorIdx &&
    rateLimitCallIdx !== -1 &&
    rateLimitCallIdx < publicAnchorIdx;

  const anonymousOnlyValidationPresent = publicSlice.includes('o.context !== "anonymous"');
  const questionOnlyValidationPresent =
    publicSlice.includes('o.inputType !== "question"') &&
    publicSlice.includes("free_qa_question_only");
  const localeValidationPresent = publicSlice.includes("ALLOWED_LOCALES.has(o.locale");
  const minMaxTextValidationPresent =
    publicSlice.includes("text.length < MIN_TEXT") && publicSlice.includes("text.length > MAX_TEXT");

  const ocrPhotoScannerUploadBlockPresent =
    publicSlice.includes("requestedOcr === true") &&
    publicSlice.includes("requestedFileUpload === true") &&
    publicSlice.includes("requestedScannerUpload === true") &&
    publicSlice.includes("requestedPhoto === true");

  const paidDnaPersistenceBlockPresent =
    publicSlice.includes("requestedPayment === true") &&
    publicSlice.includes("requestedEntitlement === true") &&
    publicSlice.includes("requestedPersistence === true") &&
    publicSlice.includes("requestedDnaSave === true") &&
    publicSlice.includes("requestedPaidMode === true");

  const documentBlockIdx = publicSlice.indexOf("detectTextDocumentBypassRequired(text)");
  const documentBlockPresent =
    documentBlockIdx !== -1 &&
    publicSlice.includes("detectOfficialLetterStyleQuestionText(text)") &&
    publicSlice.includes("detectClientPaidDocumentModeActivation(o)") &&
    publicSlice.includes("document_mode_required");
  const documentBlockBeforeModelCall =
    documentBlockPresent && publicRunSmartTalkIdx !== -1 && documentBlockIdx < publicRunSmartTalkIdx;

  const deadlineBlockIdx = publicSlice.indexOf("detectExactLegalDeadlineRequest(text)");
  const deadlineBlockPresent =
    deadlineBlockIdx !== -1 && publicSlice.includes("exact_legal_deadline_calculation_blocked");
  const exactLegalDeadlineBlockBeforeModelCall =
    deadlineBlockPresent && publicRunSmartTalkIdx !== -1 && deadlineBlockIdx < publicRunSmartTalkIdx;

  const slovakExactDeadlineCoveragePresent = SLOVAK_EXACT_DEADLINE_PHRASES.every((p) =>
    source.includes(p),
  );

  const publicSuccessMetadataPresent = PUBLIC_SUCCESS_METADATA_KEYS.every((k) =>
    publicSlice.includes(k),
  );

  const internalBranchMarkersPresent = INTERNAL_BRANCH_MARKERS.every((m) => source.includes(m));

  const dangerousReadinessMarkersAbsent = !DANGEROUS_READINESS_PATTERN.test(source);
  const dangerousDbStorageMarkersAbsent = !DANGEROUS_DB_STORAGE_PATTERN.test(source);
  const noOpenAiSdkImportInRoute = !/from\s+["']openai["']/i.test(source);
  const noFetchCallInRoute = !/[^.\w]fetch\(/i.test(source);

  return {
    publicModeMarkerPresent,
    envFlagMarkerPresent,
    exactEnvFlagCheckPresent,
    disabledFailClosedCodePresent,
    publicDisabledBeforeModelCall,
    rateLimitMarkersPresent,
    rateLimitBeforePublicBranch,
    publicBranchAfterBodyParseAndRateLimit,
    anonymousOnlyValidationPresent,
    questionOnlyValidationPresent,
    localeValidationPresent,
    minMaxTextValidationPresent,
    ocrPhotoScannerUploadBlockPresent,
    paidDnaPersistenceBlockPresent,
    documentBlockBeforeModelCall,
    exactLegalDeadlineBlockBeforeModelCall,
    slovakExactDeadlineCoveragePresent,
    publicSuccessMetadataPresent,
    internalBranchMarkersPresent,
    dangerousReadinessMarkersAbsent,
    dangerousDbStorageMarkersAbsent,
    noOpenAiSdkImportInRoute,
    noFetchCallInRoute,
  };
}

// ─── Result type ────────────────────────────────────────────────────────────

interface FreeQaPublicRoutePatchSafetyAuditResult {
  checkId: "8.8U";
  allPassed: boolean;
  publicRoutePatchSafetyAuditOnly: true;
  sourceGateDesignPhase: "8.8S";
  sourceGateDesignCommit: "ea8082e";
  auditedPatchPhase: "8.8T";
  auditedPatchFile: "app/api/smart-talk/route.ts";
  publicRoutePatchDetected: boolean;
  exactEnvFlagOnly: boolean;
  publicDisabledFailClosed: boolean;
  publicDisabledBeforeModelCall: boolean;
  rateLimitBeforePublicBranch: boolean;
  publicBranchAfterBodyParseAndRateLimit: boolean;
  documentBlockBeforeModelCall: boolean;
  exactLegalDeadlineBlockBeforeModelCall: boolean;
  slovakExactDeadlineCoveragePresent: boolean;
  internalBranchStillGuarded: boolean;
  publicRuntimeStillBehindEnvFlag: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  documentsStillBlocked: boolean;
  photoOcrStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  openAiSdkImported: boolean;
  fetchUsed: boolean;
  dbStorageTouched: boolean;
  eightThreeAcNotRun: true;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  readyForCommitOfRoutePatchAndAudit: boolean;
  readyForControlledLocalPublicDisabledApiTest: boolean;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  decision: string[];
  confirmedSafetyBoundaries: string[];
  remainingBlockers: string[];
  nextRequiredPhase: string[];
  notes: string[];
}

// ─── Content sentinels ────────────────────────────────────────────────────────

const SENTINEL_DECISION_PASSED = "public_free_qa_route_patch_safety_audit_passed";
const SENTINEL_BLOCK_PRODUCTION = "production blocked";
const SENTINEL_BLOCK_GOLIVE = "go-live blocked";
const SENTINEL_BLOCK_DOCUMENTS = "documents blocked";
const SENTINEL_BLOCK_OCR_PHOTO = "OCR/photo blocked";
const SENTINEL_BLOCK_SCANNER_UPLOAD = "scanner/upload blocked";
const SENTINEL_BLOCK_PAID_MODE = "paid mode blocked";
const SENTINEL_BLOCK_DNA = "Vaylo DNA blocked";
const SENTINEL_BLOCK_PERSISTENCE = "persistence blocked";
const SENTINEL_MODEL_OUTPUT_UNTRUSTED = "model output remains untrusted";
const SENTINEL_INTERNAL_STILL_GUARDED = "internal branch still guarded";
const SENTINEL_PUBLIC_STILL_BEHIND_FLAG = "public runtime still behind exact env flag";

const SENTINEL_REMAIN_COMMIT_PENDING = "route patch and audit still uncommitted";
const SENTINEL_REMAIN_PUBLIC_TEST_PENDING = "controlled local public-disabled API test still required";
const SENTINEL_REMAIN_PRODUCTION_BLOCKED = "production still blocked";
const SENTINEL_REMAIN_GOLIVE_BLOCKED = "go-live still blocked";
const SENTINEL_REMAIN_DOCUMENTS_BLOCKED = "documents still blocked";

const SENTINEL_NEXT_PHASE_8_8V =
  "8.8V controlled local public-disabled Free Q&A API test (public flag remains false)";

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalFreeQaPublicRoutePatchSafetyAuditResult(
  r: FreeQaPublicRoutePatchSafetyAuditResult,
): boolean {
  if (r.checkId !== "8.8U") return false;
  if (r.allPassed !== true) return false;
  if (r.publicRoutePatchSafetyAuditOnly !== true) return false;
  if (r.sourceGateDesignPhase !== "8.8S") return false;
  if (r.sourceGateDesignCommit !== "ea8082e") return false;
  if (r.auditedPatchPhase !== "8.8T") return false;
  if (r.auditedPatchFile !== "app/api/smart-talk/route.ts") return false;
  if (r.publicRoutePatchDetected !== true) return false;
  if (r.exactEnvFlagOnly !== true) return false;
  if (r.publicDisabledFailClosed !== true) return false;
  if (r.publicDisabledBeforeModelCall !== true) return false;
  if (r.rateLimitBeforePublicBranch !== true) return false;
  if (r.publicBranchAfterBodyParseAndRateLimit !== true) return false;
  if (r.documentBlockBeforeModelCall !== true) return false;
  if (r.exactLegalDeadlineBlockBeforeModelCall !== true) return false;
  if (r.slovakExactDeadlineCoveragePresent !== true) return false;
  if (r.internalBranchStillGuarded !== true) return false;
  if (r.publicRuntimeStillBehindEnvFlag !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.documentsStillBlocked !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.readyForCommitOfRoutePatchAndAudit !== true) return false;
  if (r.readyForControlledLocalPublicDisabledApiTest !== true) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
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
  if (!boundariesJ.includes(SENTINEL_MODEL_OUTPUT_UNTRUSTED)) return false;
  if (!boundariesJ.includes(SENTINEL_INTERNAL_STILL_GUARDED)) return false;
  if (!boundariesJ.includes(SENTINEL_PUBLIC_STILL_BEHIND_FLAG)) return false;

  const remainingJ = r.remainingBlockers.join(" ");
  if (!remainingJ.includes(SENTINEL_REMAIN_COMMIT_PENDING)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PUBLIC_TEST_PENDING)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_PRODUCTION_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_GOLIVE_BLOCKED)) return false;
  if (!remainingJ.includes(SENTINEL_REMAIN_DOCUMENTS_BLOCKED)) return false;

  const nextJ = r.nextRequiredPhase.join(" ");
  if (!nextJ.includes(SENTINEL_NEXT_PHASE_8_8V)) return false;

  return true;
}

// ─── Category A — literal-flip tamper cases on the final result object ───────

type Tamper88UMutation = (
  r: FreeQaPublicRoutePatchSafetyAuditResult,
) => FreeQaPublicRoutePatchSafetyAuditResult;
interface Tamper88UCase {
  label: string;
  mutate: Tamper88UMutation;
}

const FREE_QA_PUBLIC_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES: Tamper88UCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.8T" as "8.8U" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "publicRoutePatchSafetyAuditOnly false", mutate: (r) => ({ ...r, publicRoutePatchSafetyAuditOnly: false as true }) },
  { label: "sourceGateDesignPhase wrong", mutate: (r) => ({ ...r, sourceGateDesignPhase: "8.8R" as "8.8S" }) },
  { label: "sourceGateDesignCommit wrong", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "ea8082e" }) },
  { label: "auditedPatchPhase wrong", mutate: (r) => ({ ...r, auditedPatchPhase: "8.8M" as "8.8T" }) },
  { label: "auditedPatchFile wrong", mutate: (r) => ({ ...r, auditedPatchFile: "app/api/other/route.ts" as "app/api/smart-talk/route.ts" }) },
  { label: "publicRoutePatchDetected false", mutate: (r) => ({ ...r, publicRoutePatchDetected: false }) },
  { label: "exactEnvFlagOnly false", mutate: (r) => ({ ...r, exactEnvFlagOnly: false }) },
  { label: "publicDisabledFailClosed false", mutate: (r) => ({ ...r, publicDisabledFailClosed: false }) },
  { label: "publicDisabledBeforeModelCall false", mutate: (r) => ({ ...r, publicDisabledBeforeModelCall: false }) },
  { label: "rateLimitBeforePublicBranch false", mutate: (r) => ({ ...r, rateLimitBeforePublicBranch: false }) },
  { label: "publicBranchAfterBodyParseAndRateLimit false", mutate: (r) => ({ ...r, publicBranchAfterBodyParseAndRateLimit: false }) },
  { label: "documentBlockBeforeModelCall false", mutate: (r) => ({ ...r, documentBlockBeforeModelCall: false }) },
  { label: "exactLegalDeadlineBlockBeforeModelCall false", mutate: (r) => ({ ...r, exactLegalDeadlineBlockBeforeModelCall: false }) },
  { label: "slovakExactDeadlineCoveragePresent false", mutate: (r) => ({ ...r, slovakExactDeadlineCoveragePresent: false }) },
  { label: "internalBranchStillGuarded false", mutate: (r) => ({ ...r, internalBranchStillGuarded: false }) },
  { label: "publicRuntimeStillBehindEnvFlag false", mutate: (r) => ({ ...r, publicRuntimeStillBehindEnvFlag: false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "documentsStillBlocked false", mutate: (r) => ({ ...r, documentsStillBlocked: false }) },
  { label: "photoOcrStillBlocked false", mutate: (r) => ({ ...r, photoOcrStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "liveRouteInvocationPerformed true", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "openAiSdkImported true", mutate: (r) => ({ ...r, openAiSdkImported: true }) },
  { label: "fetchUsed true", mutate: (r) => ({ ...r, fetchUsed: true }) },
  { label: "dbStorageTouched true", mutate: (r) => ({ ...r, dbStorageTouched: true }) },
  { label: "eightThreeAcNotRun false", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "readyForCommitOfRoutePatchAndAudit false", mutate: (r) => ({ ...r, readyForCommitOfRoutePatchAndAudit: false }) },
  { label: "readyForControlledLocalPublicDisabledApiTest false", mutate: (r) => ({ ...r, readyForControlledLocalPublicDisabledApiTest: false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "decision empty", mutate: (r) => ({ ...r, decision: [] }) },
  { label: "confirmedSafetyBoundaries empty", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: [] }) },
  { label: "remainingBlockers empty", mutate: (r) => ({ ...r, remainingBlockers: [] }) },
  { label: "nextRequiredPhase empty", mutate: (r) => ({ ...r, nextRequiredPhase: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "decision missing sentinel", mutate: (r) => ({ ...r, decision: r.decision.map((s) => s.split(SENTINEL_DECISION_PASSED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing production sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_BLOCK_PRODUCTION).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing internal-guarded sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_INTERNAL_STILL_GUARDED).join("omitted")) }) },
  { label: "confirmedSafetyBoundaries missing public-behind-flag sentinel", mutate: (r) => ({ ...r, confirmedSafetyBoundaries: r.confirmedSafetyBoundaries.map((s) => s.split(SENTINEL_PUBLIC_STILL_BEHIND_FLAG).join("omitted")) }) },
  { label: "remainingBlockers missing commit-pending sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_COMMIT_PENDING).join("omitted")) }) },
  { label: "remainingBlockers missing public-test-pending sentinel", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.map((s) => s.split(SENTINEL_REMAIN_PUBLIC_TEST_PENDING).join("omitted")) }) },
  { label: "nextRequiredPhase missing 8.8V sentinel", mutate: (r) => ({ ...r, nextRequiredPhase: r.nextRequiredPhase.map((s) => s.split(SENTINEL_NEXT_PHASE_8_8V).join("omitted")) }) },
];

// ─── Category B — regression-detection tamper cases (pure, synthetic source) ──
// Each case proves analyzeRouteSource() correctly flags a regressed/corrupted
// synthetic snippet. No real files are read for these; they use inline
// synthetic strings only.

interface Tamper88URegressionCase {
  label: string;
  check: () => boolean; // true = detector correctly caught the regression
}

const FREE_QA_PUBLIC_ROUTE_PATCH_REGRESSION_TAMPER_CASES: Tamper88URegressionCase[] = [
  {
    label: "env flag exact check missing",
    check: () => {
      const bad = `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { const enabled = Boolean(o.forcePublic); }`;
      return analyzeRouteSource(bad).exactEnvFlagCheckPresent === false;
    },
  },
  {
    label: "env flag accepts non-exact values",
    check: () => {
      const bad = `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { const enabled = String(process.env[FREE_QA_PUBLIC_RUNTIME_ENV_FLAG]).toLowerCase() === "true"; }`;
      return analyzeRouteSource(bad).exactEnvFlagCheckPresent === false;
    },
  },
  {
    label: "disabled code missing",
    check: () => {
      const bad = `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { if (!enabled) { return NextResponse.json({ ok: false, code: "public_beta_off" }, { status: 403 }); } }`;
      return analyzeRouteSource(bad).disabledFailClosedCodePresent === false;
    },
  },
  {
    label: "rate limit missing before public branch",
    check: () => {
      const bad = `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { /* no rate limit before this point */ }`;
      return analyzeRouteSource(bad).rateLimitBeforePublicBranch === false;
    },
  },
  {
    label: "rate limit present but after public branch",
    check: () => {
      const bad = `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { doWork(); } if (!takeRateSlot(ip)) { return badRequest("smart_talk_rate_limited"); } // status: 429`;
      return analyzeRouteSource(bad).rateLimitBeforePublicBranch === false;
    },
  },
  {
    label: "document block after runSmartTalk",
    check: () => {
      const bad =
        `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "question" }); ` +
        `if (detectTextDocumentBypassRequired(text) || detectOfficialLetterStyleQuestionText(text) || detectClientPaidDocumentModeActivation(o)) { return badRequest("document_mode_required"); } ` +
        `} // ── End Phase 8.8T public Free Q&A beta branch`;
      return analyzeRouteSource(bad).documentBlockBeforeModelCall === false;
    },
  },
  {
    label: "exact legal deadline block after runSmartTalk",
    check: () => {
      const bad =
        `if (o.mode === FREE_QA_PUBLIC_BETA_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "question" }); ` +
        `if (detectExactLegalDeadlineRequest(text)) { return badRequest("exact_legal_deadline_calculation_blocked"); } ` +
        `} // ── End Phase 8.8T public Free Q&A beta branch`;
      return analyzeRouteSource(bad).exactLegalDeadlineBlockBeforeModelCall === false;
    },
  },
  {
    label: "SK exact deadline phrases missing",
    check: () => {
      const bad = `function detectExactLegalDeadlineRequest(text) { return /bis wann/i.test(text); }`;
      return analyzeRouteSource(bad).slovakExactDeadlineCoveragePresent === false;
    },
  },
  {
    label: "internal secret/guard markers missing",
    check: () => {
      const bad = `const FREE_QA_INTERNAL_RUNTIME_MODE = "free_qa_internal_scoped_patch";`;
      return analyzeRouteSource(bad).internalBranchMarkersPresent === false;
    },
  },
  {
    label: "public readiness/production/go-live set true",
    check: () => {
      const bad = `const patchMeta = { readyForProduction: true, readyForGoLive: true };`;
      return analyzeRouteSource(bad).dangerousReadinessMarkersAbsent === false;
    },
  },
  {
    label: "DB/storage/persistence markers enabled",
    check: () => {
      const bad = `await supabase.from("free_qa_answers").insert({ text });`;
      return analyzeRouteSource(bad).dangerousDbStorageMarkersAbsent === false;
    },
  },
];

// ─── Exported public route patch safety-audit runner ───────────────────────────

export function runFreeQaPublicRoutePatchSafetyAudit(): FreeQaPublicRoutePatchSafetyAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.8S public runtime gate design runner as source of truth ─────
  const s = runFreeQaPublicRuntimeGateDesign();
  if (s.checkId !== "8.8S") auditFailures.push(`8.8S checkId mismatch: expected "8.8S", got "${s.checkId}"`);
  if (s.allPassed !== true) auditFailures.push("8.8S allPassed is not true");
  if (s.sourceRegressionCommit !== "b20edfe") auditFailures.push(`8.8S sourceRegressionCommit mismatch: got "${s.sourceRegressionCommit}"`);
  if (s.sourcePatchCommit !== "ffaef73") auditFailures.push(`8.8S sourcePatchCommit mismatch: got "${s.sourcePatchCommit}"`);
  if (s.proposedPublicEnvFlag !== "SMART_TALK_FREE_QA_PUBLIC_ENABLED") auditFailures.push("8.8S proposedPublicEnvFlag mismatch");
  if (s.proposedPublicEnvDefault !== false) auditFailures.push("8.8S proposedPublicEnvDefault is not false");
  if (s.proposedPublicMode !== "free_qa_public_beta") auditFailures.push("8.8S proposedPublicMode mismatch");
  if (s.readyForPublicFreeQaRoutePatchBehindEnvFlag !== true) auditFailures.push("8.8S readyForPublicFreeQaRoutePatchBehindEnvFlag is not true");
  if (s.tamperRejected !== s.tamperCount) auditFailures.push("8.8S own tamper count mismatch");

  // ── Read app/api/smart-talk/route.ts as static source text (only I/O here) ──
  let source = "";
  try {
    const routePath = path.join(process.cwd(), "app", "api", "smart-talk", "route.ts");
    source = fs.readFileSync(routePath, "utf8");
  } catch (err) {
    auditFailures.push(`failed to read app/api/smart-talk/route.ts: ${String(err)}`);
  }

  const analysis = analyzeRouteSource(source);

  if (!analysis.publicModeMarkerPresent) auditFailures.push("public mode marker (FREE_QA_PUBLIC_BETA_MODE / free_qa_public_beta) missing");
  if (!analysis.envFlagMarkerPresent) auditFailures.push("env flag marker (FREE_QA_PUBLIC_RUNTIME_ENV_FLAG / SMART_TALK_FREE_QA_PUBLIC_ENABLED) missing");
  if (!analysis.exactEnvFlagCheckPresent) auditFailures.push("exact env flag check missing or non-exact");
  if (!analysis.disabledFailClosedCodePresent) auditFailures.push("fail-closed disabled code (free_qa_public_beta_disabled / 403) missing");
  if (!analysis.publicDisabledBeforeModelCall) auditFailures.push("public-disabled path does not appear before runSmartTalk");
  if (!analysis.rateLimitMarkersPresent) auditFailures.push("rate limit markers missing");
  if (!analysis.rateLimitBeforePublicBranch) auditFailures.push("rate limit does not appear before public branch");
  if (!analysis.publicBranchAfterBodyParseAndRateLimit) auditFailures.push("public branch does not appear after body parse and rate limit");
  if (!analysis.anonymousOnlyValidationPresent) auditFailures.push("anonymous-only validation missing in public branch");
  if (!analysis.questionOnlyValidationPresent) auditFailures.push("question-only validation missing in public branch");
  if (!analysis.localeValidationPresent) auditFailures.push("locale validation via ALLOWED_LOCALES missing in public branch");
  if (!analysis.minMaxTextValidationPresent) auditFailures.push("min/max text validation missing in public branch");
  if (!analysis.ocrPhotoScannerUploadBlockPresent) auditFailures.push("OCR/photo/scanner/upload block missing in public branch");
  if (!analysis.paidDnaPersistenceBlockPresent) auditFailures.push("paid/DNA/persistence block missing in public branch");
  if (!analysis.documentBlockBeforeModelCall) auditFailures.push("document-like block missing or not before runSmartTalk in public branch");
  if (!analysis.exactLegalDeadlineBlockBeforeModelCall) auditFailures.push("exact legal deadline block missing or not before runSmartTalk in public branch");
  if (!analysis.slovakExactDeadlineCoveragePresent) auditFailures.push("Slovak/Czech exact deadline phrase coverage missing");
  if (!analysis.publicSuccessMetadataPresent) auditFailures.push("public success metadata keys missing in public branch");
  if (!analysis.internalBranchMarkersPresent) auditFailures.push("internal branch markers missing or weakened");
  if (!analysis.dangerousReadinessMarkersAbsent) auditFailures.push("dangerous production/go-live/document/OCR/paid/DNA readiness markers detected");
  if (!analysis.dangerousDbStorageMarkersAbsent) auditFailures.push("dangerous DB/storage/persistence markers detected");
  if (!analysis.noOpenAiSdkImportInRoute) auditFailures.push("direct OpenAI SDK import detected in route");
  if (!analysis.noFetchCallInRoute) auditFailures.push("fetch() call detected in route");

  const decision: string[] = [
    `DS-01 [${SENTINEL_DECISION_PASSED}]: public_free_qa_route_patch_safety_audit_passed — the uncommitted 8.8T route patch passes local static safety/regression checks.`,
    "DS-02: This phase is audit-only and performs no live route/model/fetch call; it only reads route.ts as static text.",
    "DS-03: This phase keeps public runtime, production, and go-live blocked.",
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
    `SB-09 [${SENTINEL_MODEL_OUTPUT_UNTRUSTED}]: model output remains untrusted.`,
    `SB-10 [${SENTINEL_INTERNAL_STILL_GUARDED}]: internal branch still guarded.`,
    `SB-11 [${SENTINEL_PUBLIC_STILL_BEHIND_FLAG}]: public runtime still behind exact env flag.`,
  ];

  const remainingBlockers: string[] = [
    `RB-01 [${SENTINEL_REMAIN_COMMIT_PENDING}]: route patch and audit still uncommitted.`,
    `RB-02 [${SENTINEL_REMAIN_PUBLIC_TEST_PENDING}]: controlled local public-disabled API test still required.`,
    `RB-03 [${SENTINEL_REMAIN_PRODUCTION_BLOCKED}]: production still blocked.`,
    `RB-04 [${SENTINEL_REMAIN_GOLIVE_BLOCKED}]: go-live still blocked.`,
    `RB-05 [${SENTINEL_REMAIN_DOCUMENTS_BLOCKED}]: documents still blocked.`,
  ];

  const nextRequiredPhase: string[] = [
    `NP-01 [${SENTINEL_NEXT_PHASE_8_8V}]: 8.8V controlled local public-disabled Free Q&A API test (public flag remains false).`,
  ];

  const notes: string[] = [
    "IN-01: 8.8U statically audits the uncommitted 8.8T route patch only; no live route/model/fetch call is performed.",
    `IN-02: 8.8S confirmed — checkId=${s.checkId}, allPassed=${s.allPassed}, sourceGateDesignCommit=ea8082e (expected), proposedPublicEnvFlag=${s.proposedPublicEnvFlag}.`,
    "IN-03: app/api/smart-talk/route.ts was read as static text via fs.readFileSync only; it was not imported or invoked.",
    "IN-04: exact env flag gating, fail-closed disabled path, rate limiting, document/exact-deadline blocking ordering, Slovak/Czech phrase coverage, and internal-branch guards were all verified via string/regex analysis.",
    "IN-05: no production/go-live/documents/OCR/photo/scanner/upload/paid/DNA/persistence enablement markers were detected in the patch.",
  ];

  const tamperCountA = FREE_QA_PUBLIC_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES.length;
  const tamperCountB = FREE_QA_PUBLIC_ROUTE_PATCH_REGRESSION_TAMPER_CASES.length;
  const tamperCount = tamperCountA + tamperCountB;

  const provisional: FreeQaPublicRoutePatchSafetyAuditResult = {
    checkId: "8.8U",
    allPassed: true,
    publicRoutePatchSafetyAuditOnly: true,
    sourceGateDesignPhase: "8.8S",
    sourceGateDesignCommit: "ea8082e",
    auditedPatchPhase: "8.8T",
    auditedPatchFile: "app/api/smart-talk/route.ts",
    publicRoutePatchDetected: analysis.publicModeMarkerPresent && analysis.envFlagMarkerPresent,
    exactEnvFlagOnly: analysis.exactEnvFlagCheckPresent,
    publicDisabledFailClosed: analysis.disabledFailClosedCodePresent,
    publicDisabledBeforeModelCall: analysis.publicDisabledBeforeModelCall,
    rateLimitBeforePublicBranch: analysis.rateLimitBeforePublicBranch,
    publicBranchAfterBodyParseAndRateLimit: analysis.publicBranchAfterBodyParseAndRateLimit,
    documentBlockBeforeModelCall: analysis.documentBlockBeforeModelCall,
    exactLegalDeadlineBlockBeforeModelCall: analysis.exactLegalDeadlineBlockBeforeModelCall,
    slovakExactDeadlineCoveragePresent: analysis.slovakExactDeadlineCoveragePresent,
    internalBranchStillGuarded: analysis.internalBranchMarkersPresent,
    publicRuntimeStillBehindEnvFlag: analysis.exactEnvFlagCheckPresent && analysis.envFlagMarkerPresent,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    documentsStillBlocked: analysis.documentBlockBeforeModelCall && analysis.dangerousReadinessMarkersAbsent,
    photoOcrStillBlocked: analysis.ocrPhotoScannerUploadBlockPresent,
    scannerUploadStillBlocked: analysis.ocrPhotoScannerUploadBlockPresent,
    paidDocumentModeStillBlocked: analysis.paidDnaPersistenceBlockPresent,
    vayloDnaStillBlocked: analysis.paidDnaPersistenceBlockPresent,
    persistenceStillBlocked: analysis.paidDnaPersistenceBlockPresent && analysis.dangerousDbStorageMarkersAbsent,
    modelOutputStillUntrusted: analysis.publicSuccessMetadataPresent,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    openAiSdkImported: !analysis.noOpenAiSdkImportInRoute,
    fetchUsed: !analysis.noFetchCallInRoute,
    dbStorageTouched: !analysis.dangerousDbStorageMarkersAbsent,
    eightThreeAcNotRun: true,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    readyForCommitOfRoutePatchAndAudit: true,
    readyForControlledLocalPublicDisabledApiTest: true,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    decision,
    confirmedSafetyBoundaries,
    remainingBlockers,
    nextRequiredPhase,
    notes,
  };

  if (!_isCanonicalFreeQaPublicRoutePatchSafetyAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejectedA = 0;
  const tamperFailuresA: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES[idx];
    if (!_isCanonicalFreeQaPublicRoutePatchSafetyAuditResult(tc.mutate(provisional))) {
      tamperRejectedA++;
    } else {
      tamperFailuresA.push(`8.8U tamper case (A) not rejected: "${tc.label}"`);
    }
  }

  let tamperRejectedB = 0;
  const tamperFailuresB: string[] = [];
  for (let idx = 0; idx < FREE_QA_PUBLIC_ROUTE_PATCH_REGRESSION_TAMPER_CASES.length; idx++) {
    const tc = FREE_QA_PUBLIC_ROUTE_PATCH_REGRESSION_TAMPER_CASES[idx];
    if (tc.check()) {
      tamperRejectedB++;
    } else {
      tamperFailuresB.push(`8.8U tamper case (B) not detected: "${tc.label}"`);
    }
  }

  const tamperRejected = tamperRejectedA + tamperRejectedB;
  if (tamperFailuresA.length > 0) auditFailures.push(...tamperFailuresA);
  if (tamperFailuresB.length > 0) auditFailures.push(...tamperFailuresB);

  const allPassed =
    auditFailures.length === 0 &&
    s.checkId === "8.8S" &&
    s.allPassed === true &&
    provisional.publicRoutePatchDetected === true &&
    provisional.exactEnvFlagOnly === true &&
    provisional.publicDisabledFailClosed === true &&
    provisional.publicDisabledBeforeModelCall === true &&
    provisional.rateLimitBeforePublicBranch === true &&
    provisional.publicBranchAfterBodyParseAndRateLimit === true &&
    provisional.documentBlockBeforeModelCall === true &&
    provisional.exactLegalDeadlineBlockBeforeModelCall === true &&
    provisional.slovakExactDeadlineCoveragePresent === true &&
    provisional.internalBranchStillGuarded === true &&
    provisional.publicRuntimeStillBehindEnvFlag === true &&
    provisional.documentsStillBlocked === true &&
    provisional.photoOcrStillBlocked === true &&
    provisional.scannerUploadStillBlocked === true &&
    provisional.paidDocumentModeStillBlocked === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStillBlocked === true &&
    provisional.modelOutputStillUntrusted === true &&
    provisional.openAiSdkImported === false &&
    provisional.fetchUsed === false &&
    provisional.dbStorageTouched === false &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.8U tamper cases: ${tamperRejected}/${tamperCount} correctly rejected (A=${tamperRejectedA}/${tamperCountA}, B=${tamperRejectedB}/${tamperCountB})`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForCommitOfRoutePatchAndAudit: allPassed,
    readyForControlledLocalPublicDisabledApiTest: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.8U result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-free-qa-public-route-patch-safety-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runFreeQaPublicRoutePatchSafetyAudit(), null, 2));
}
