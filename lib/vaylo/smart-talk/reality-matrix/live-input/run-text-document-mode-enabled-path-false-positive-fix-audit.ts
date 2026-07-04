/**
 * PHASE 8.9E-BLOCKER — Text Document Mode Enabled-Path False-Positive Fix Audit
 *
 * Audit-only phase for the uncommitted 8.9E-BLOCKER route patch in
 * app/api/smart-talk/route.ts, which fixes a false positive where normal
 * pasted document text was incorrectly classified as "paid_document_mode_
 * blocked" (because the branch's own mode value "text_document_controlled_
 * runtime" contains the substring "document", and the previously-used
 * generic detector treated any body field containing that substring as a
 * paid-mode activation signal).
 *
 * This audit reads app/api/smart-talk/route.ts as STATIC TEXT (the only
 * permitted I/O in this phase) and validates required markers, ordering,
 * and boundaries with pure string/regex analysis. It does not invoke the
 * route, does not import the route module, does not call runSmartTalk,
 * does not call OpenAI, and does not use fetch.
 *
 * This phase does NOT enable text document runtime, photo/OCR runtime,
 * public runtime, production, or go-live.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeDisabledLocalApiTestClosure } from "./run-text-document-mode-disabled-local-api-test-closure";

// ─── Static analysis (pure — operates only on a source string argument) ───────

interface RouteSourceAnalysis {
  textDocumentModeDetected: boolean;
  envFlagDetected: boolean;
  exactEnvFlagOnlyDetected: boolean;
  disabledPathFailClosedDetected: boolean;
  disabledPathStatus403Detected: boolean;
  disabledPathCodeDetected: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  narrowExplicitPaidActivationDetectorPresent: boolean;
  broadDetectorNoLongerUsedForPaidModeInBranch: boolean;
  ocrPhotoBlockPresent: boolean;
  scannerUploadFileUploadBlockPresent: boolean;
  vayloDnaPersistenceStorageBlockPresent: boolean;
  exactLegalDeadlineBlockPresent: boolean;
  credentialFinancialIdentityBlockPresent: boolean;
  highRiskEscalationBlockPresent: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  dangerousReadinessDetected: boolean;
  noOpenAiSdkImportInRoute: boolean;
  noFetchCallInRoute: boolean;
  allowedHealthInsuranceSampleAllowedByStaticRegression: boolean;
  explicitPaidActivationSamplesBlockedByStaticRegression: boolean;
}

const TEXT_DOC_BRANCH_ANCHOR = "if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE)";
const TEXT_DOC_BRANCH_END_MARKER =
  "// ── End Phase 8.9C Text Document Mode controlled runtime branch";
const NARROW_DETECTOR_NAME = "detectExplicitPaidDocumentModeActivationForTextDocumentMode";
const BROAD_DETECTOR_NAME = "detectClientPaidDocumentModeActivation";

const INTERNAL_BRANCH_MARKERS: readonly string[] = [
  "FREE_QA_INTERNAL_RUNTIME_MODE",
  "free_qa_internal_scoped_patch",
  "FREE_QA_INTERNAL_RUNTIME_GUARD",
  "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY",
];

const DANGEROUS_READINESS_PATTERN =
  /readyForProduction\s*:\s*true|readyForGoLive\s*:\s*true|readyForTextDocumentRuntime\s*:\s*true|readyForPhotoOcrRuntime\s*:\s*true|readyForPublicRuntime\s*:\s*true|productionEnabled\s*:\s*true|goLiveEnabled\s*:\s*true|publicReleaseEnabled\s*:\s*true|textDocumentRuntimeEnabled\s*:\s*true|photoOcrRuntimeEnabled\s*:\s*true/i;

const DANGEROUS_DB_STORAGE_PATTERN =
  /supabase|fs\.writeFile|\.from\(["'`][\w-]+["'`]\)\.insert\(|persistenceEnabled\s*:\s*true|dbWriteEnabled\s*:\s*true/i;

const OCR_UPLOAD_HANDLER_PATTERN =
  /tesseract|google\.cloud\.vision|createReadStream|multer|formidable|busboy|\.readAsDataURL|new FileReader\(/i;

// ─── Regression samples (used only as inline strings against the extracted
// narrow-detector regex; no live route call, no model call) ──────────────────

const ALLOWED_HEALTH_INSURANCE_SAMPLE =
  "Sehr geehrte Damen und Herren, wir informieren Sie über Ihren aktuellen Versicherungsstatus bei unserer Krankenkasse. Bitte prüfen Sie die Angaben und melden Sie sich bei Rückfragen.";

const EXPLICIT_PAID_ACTIVATION_SAMPLES: readonly string[] = [
  "Ich möchte den kostenpflichtigen Dokumentenmodus aktivieren.",
  "Please activate paid document mode.",
  "Chcem zaplatiť za dokumentový režim.",
  "Aktivovať platený dokumentový režim.",
  "I want to pay for document mode.",
];

function extractSlice(source: string, startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  if (start === -1) return "";
  const end = source.indexOf(endMarker, start);
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

/**
 * Extracts the narrow detector's regex body from the route source text and
 * evaluates it against a sample string. Returns null if the detector
 * function cannot be located (treated as a failure by callers).
 */
function extractNarrowDetectorRegexTest(source: string): ((sample: string) => boolean) | null {
  const fnIdx = source.indexOf(`function ${NARROW_DETECTOR_NAME}(`);
  if (fnIdx === -1) return null;
  const bodyStart = source.indexOf("return /", fnIdx);
  if (bodyStart === -1) return null;
  const regexStart = bodyStart + "return ".length;
  const regexEnd = source.indexOf(".test(", regexStart);
  if (regexEnd === -1) return null;
  const pattern = source.slice(regexStart, regexEnd).trim();
  // Strip a trailing slash+flags block, e.g. "/.../i" possibly spanning lines.
  const lastSlash = pattern.lastIndexOf("/");
  if (lastSlash <= 0) return null;
  const flags = pattern.slice(lastSlash + 1).trim();
  const body = pattern.slice(1, lastSlash);
  try {
    const re = new RegExp(body, flags || "i");
    return (sample: string) => re.test(sample);
  } catch {
    return null;
  }
}

function analyzeRouteSource(source: string): RouteSourceAnalysis {
  const slice = extractSlice(source, TEXT_DOC_BRANCH_ANCHOR, TEXT_DOC_BRANCH_END_MARKER);

  const textDocumentModeDetected =
    source.includes("TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE") &&
    source.includes('"text_document_controlled_runtime"');
  const envFlagDetected =
    source.includes("TEXT_DOCUMENT_MODE_ENV_FLAG") &&
    source.includes('"SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED"');
  const exactEnvFlagOnlyDetected = /process\.env\[TEXT_DOCUMENT_MODE_ENV_FLAG\]\s*===\s*"true"/.test(
    source,
  );

  const disabledCodeIdx = source.indexOf('"text_document_mode_disabled"');
  const disabledPathFailClosedDetected = disabledCodeIdx !== -1;
  const disabledPathCodeDetected = disabledCodeIdx !== -1;
  const disabledPathStatus403Detected =
    disabledCodeIdx !== -1 && /"text_document_mode_disabled"\s*,\s*403\)/.test(source);

  const publicFreeQaBranchStillPresent =
    source.includes("FREE_QA_PUBLIC_BETA_MODE") && source.includes('"free_qa_public_beta"');
  const internalGuardedBranchStillPresent = INTERNAL_BRANCH_MARKERS.every((m) => source.includes(m));

  const narrowExplicitPaidActivationDetectorPresent =
    source.includes(`function ${NARROW_DETECTOR_NAME}(`) && slice.includes(`${NARROW_DETECTOR_NAME}(text)`);
  const broadDetectorPaidCallIdx = slice.indexOf(`${BROAD_DETECTOR_NAME}(o)`);
  const paidBlockCodeIdxInSlice = slice.indexOf('"paid_document_mode_blocked"');
  const broadDetectorNoLongerUsedForPaidModeInBranch =
    narrowExplicitPaidActivationDetectorPresent &&
    paidBlockCodeIdxInSlice !== -1 &&
    (broadDetectorPaidCallIdx === -1 ||
      // If the broad detector still appears anywhere in the slice, it must not
      // be the one immediately guarding the paid_document_mode_blocked return.
      slice.slice(Math.max(0, paidBlockCodeIdxInSlice - 400), paidBlockCodeIdxInSlice).includes(NARROW_DETECTOR_NAME));

  const ocrPhotoBlockPresent =
    slice.includes("detectOcrPhotoRequest(o)") && slice.includes('"photo_ocr_blocked"');
  const scannerUploadFileUploadBlockPresent =
    slice.includes("detectScannerUploadRequest(o)") &&
    slice.includes('"scanner_upload_blocked"') &&
    slice.includes("detectFileUploadRequest(o)") &&
    slice.includes('"file_upload_blocked"');
  const vayloDnaPersistenceStorageBlockPresent =
    slice.includes("detectVayloDnaSaveRequest(o)") &&
    slice.includes('"vaylo_dna_blocked"') &&
    slice.includes("detectPersistenceStorageRequest(o)") &&
    slice.includes('"persistence_storage_blocked"');
  const exactLegalDeadlineBlockPresent =
    slice.includes("detectExactLegalDeadlineRequest(text)") &&
    slice.includes('"exact_legal_deadline_calculation_blocked"');
  const credentialFinancialIdentityBlockPresent =
    slice.includes("detectCredentialSecretText(text)") &&
    slice.includes("detectFinancialAccountOrPaymentAuthorizationText(text)") &&
    slice.includes("detectIdentityDocumentNumberText(text)");
  const highRiskEscalationBlockPresent =
    slice.includes("detectHighRiskCourtPoliceMedicalTaxSignal(text)") &&
    slice.includes("detectBindingLegalAdviceRequest(text)") &&
    slice.includes("detectOfficialFilingGenerationRequest(text)");

  const dbStorageWriteAdded = DANGEROUS_DB_STORAGE_PATTERN.test(source);
  const ocrUploadHandlerAdded = OCR_UPLOAD_HANDLER_PATTERN.test(source);
  const dangerousReadinessDetected = DANGEROUS_READINESS_PATTERN.test(source);
  const noOpenAiSdkImportInRoute = !/from\s+["']openai["']/i.test(source);
  const noFetchCallInRoute = !/[^.\w]fetch\(/i.test(source);

  const narrowTest = extractNarrowDetectorRegexTest(source);
  const allowedHealthInsuranceSampleAllowedByStaticRegression =
    narrowTest !== null && narrowTest(ALLOWED_HEALTH_INSURANCE_SAMPLE) === false;
  const explicitPaidActivationSamplesBlockedByStaticRegression =
    narrowTest !== null && EXPLICIT_PAID_ACTIVATION_SAMPLES.every((s) => narrowTest(s) === true);

  return {
    textDocumentModeDetected,
    envFlagDetected,
    exactEnvFlagOnlyDetected,
    disabledPathFailClosedDetected,
    disabledPathStatus403Detected,
    disabledPathCodeDetected,
    publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent,
    narrowExplicitPaidActivationDetectorPresent,
    broadDetectorNoLongerUsedForPaidModeInBranch,
    ocrPhotoBlockPresent,
    scannerUploadFileUploadBlockPresent,
    vayloDnaPersistenceStorageBlockPresent,
    exactLegalDeadlineBlockPresent,
    credentialFinancialIdentityBlockPresent,
    highRiskEscalationBlockPresent,
    dbStorageWriteAdded,
    ocrUploadHandlerAdded,
    dangerousReadinessDetected,
    noOpenAiSdkImportInRoute,
    noFetchCallInRoute,
    allowedHealthInsuranceSampleAllowedByStaticRegression,
    explicitPaidActivationSamplesBlockedByStaticRegression,
  };
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeEnabledPathFalsePositiveFixAuditResult {
  checkId: "8.9E-BLOCKER";
  allPassed: boolean;
  sourceDisabledClosureCommit: "f1c5ef3";
  sourceDisabledClosurePhase: "8.9D-CLOSURE";
  blockerObserved: true;
  blockerObservedStatus: 402;
  blockerObservedCode: "paid_document_mode_blocked";
  patchedRouteFile: "app/api/smart-talk/route.ts";
  auditFile: "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-enabled-path-false-positive-fix-audit.ts";
  falsePositiveFixApplied: boolean;
  textDocumentModeStillDetected: boolean;
  envFlagStillDetected: boolean;
  exactEnvFlagOnlyStillDetected: boolean;
  disabledPathStillFailClosed: boolean;
  disabledPathStatus403StillDetected: boolean;
  disabledPathCodeStillDetected: boolean;
  normalHealthInsuranceDocumentTextAllowedByStaticRegression: boolean;
  explicitPaidActivationStillBlockedByStaticRegression: boolean;
  broadDocumentTextNoLongerPaidModeTrigger: boolean;
  ocrPhotoStillBlocked: boolean;
  scannerUploadFileUploadStillBlocked: boolean;
  paidModeStillBlockedForExplicitActivation: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStorageStillBlocked: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  credentialFinancialIdentityStillBlocked: boolean;
  highRiskEscalationStillBlocked: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  textDocumentRuntimeAuthorizedNow: false;
  photoOcrRuntimeAuthorizedNow: false;
  publicRuntimeAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  liveRouteInvocationPerformedByAudit: false;
  liveModelCallPerformedByAudit: false;
  openAiSdkImportedByAudit: false;
  fetchUsedByAudit: false;
  processEnvReadForAuthorizationByAudit: false;
  filesWrittenByAudit: false;
  dbStorageTouchedByAudit: false;
  eightThreeAcNotRun: true;
  readyForControlledLocalTextDocumentEnabledApiRetest: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  notes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeEnabledPathFalsePositiveFixAuditResult(
  r: TextDocumentModeEnabledPathFalsePositiveFixAuditResult,
): boolean {
  if (r.checkId !== "8.9E-BLOCKER") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceDisabledClosureCommit !== "f1c5ef3") return false;
  if (r.sourceDisabledClosurePhase !== "8.9D-CLOSURE") return false;
  if (r.blockerObserved !== true) return false;
  if (r.blockerObservedStatus !== 402) return false;
  if (r.blockerObservedCode !== "paid_document_mode_blocked") return false;
  if (r.patchedRouteFile !== "app/api/smart-talk/route.ts") return false;
  if (
    r.auditFile !==
    "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-enabled-path-false-positive-fix-audit.ts"
  )
    return false;
  if (r.falsePositiveFixApplied !== true) return false;
  if (r.textDocumentModeStillDetected !== true) return false;
  if (r.envFlagStillDetected !== true) return false;
  if (r.exactEnvFlagOnlyStillDetected !== true) return false;
  if (r.disabledPathStillFailClosed !== true) return false;
  if (r.disabledPathStatus403StillDetected !== true) return false;
  if (r.disabledPathCodeStillDetected !== true) return false;
  if (r.normalHealthInsuranceDocumentTextAllowedByStaticRegression !== true) return false;
  if (r.explicitPaidActivationStillBlockedByStaticRegression !== true) return false;
  if (r.broadDocumentTextNoLongerPaidModeTrigger !== true) return false;
  if (r.ocrPhotoStillBlocked !== true) return false;
  if (r.scannerUploadFileUploadStillBlocked !== true) return false;
  if (r.paidModeStillBlockedForExplicitActivation !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStorageStillBlocked !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.credentialFinancialIdentityStillBlocked !== true) return false;
  if (r.highRiskEscalationStillBlocked !== true) return false;
  if (r.publicFreeQaBranchStillPresent !== true) return false;
  if (r.internalGuardedBranchStillPresent !== true) return false;
  if (r.dbStorageWriteAdded !== false) return false;
  if (r.ocrUploadHandlerAdded !== false) return false;
  if (r.textDocumentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeAuthorizedNow !== false) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.liveRouteInvocationPerformedByAudit !== false) return false;
  if (r.liveModelCallPerformedByAudit !== false) return false;
  if (r.openAiSdkImportedByAudit !== false) return false;
  if (r.fetchUsedByAudit !== false) return false;
  if (r.processEnvReadForAuthorizationByAudit !== false) return false;
  if (r.filesWrittenByAudit !== false) return false;
  if (r.dbStorageTouchedByAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForControlledLocalTextDocumentEnabledApiRetest !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Category A — literal-flip tamper cases on the final result object ───────

type Tamper89EBlockerMutation = (
  r: TextDocumentModeEnabledPathFalsePositiveFixAuditResult,
) => TextDocumentModeEnabledPathFalsePositiveFixAuditResult;
interface Tamper89EBlockerCase {
  label: string;
  mutate: Tamper89EBlockerMutation;
}

const TEXT_DOCUMENT_MODE_ENABLED_PATH_FALSE_POSITIVE_FIX_AUDIT_TAMPER_CASES: Tamper89EBlockerCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9C" as "8.9E-BLOCKER" }) },
  { label: "allPassed false (source 8.9D-CLOSURE allPassed treated as false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceDisabledClosureCommit wrong", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "f1c5ef3" }) },
  { label: "sourceDisabledClosurePhase wrong", mutate: (r) => ({ ...r, sourceDisabledClosurePhase: "8.9C" as "8.9D-CLOSURE" }) },
  { label: "blockerObservedStatus wrong (observed blocker status changes)", mutate: (r) => ({ ...r, blockerObservedStatus: 200 as 402 }) },
  { label: "blockerObservedCode wrong (observed blocker code changes)", mutate: (r) => ({ ...r, blockerObservedCode: "ok" as "paid_document_mode_blocked" }) },
  { label: "patchedRouteFile wrong", mutate: (r) => ({ ...r, patchedRouteFile: "app/api/other/route.ts" as "app/api/smart-talk/route.ts" }) },
  {
    label: "auditFile wrong",
    mutate: (r) => ({
      ...r,
      auditFile:
        "lib/vaylo/smart-talk/reality-matrix/live-input/wrong-file.ts" as "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-enabled-path-false-positive-fix-audit.ts",
    }),
  },
  { label: "falsePositiveFixApplied false", mutate: (r) => ({ ...r, falsePositiveFixApplied: false }) },
  { label: "textDocumentModeStillDetected false (route mode string changes)", mutate: (r) => ({ ...r, textDocumentModeStillDetected: false }) },
  { label: "envFlagStillDetected false (env flag changes)", mutate: (r) => ({ ...r, envFlagStillDetected: false }) },
  { label: "exactEnvFlagOnlyStillDetected false (exact env flag gate disappears)", mutate: (r) => ({ ...r, exactEnvFlagOnlyStillDetected: false }) },
  { label: "disabledPathStillFailClosed false (disabled path code changes)", mutate: (r) => ({ ...r, disabledPathStillFailClosed: false }) },
  { label: "disabledPathStatus403StillDetected false (disabled path status changes)", mutate: (r) => ({ ...r, disabledPathStatus403StillDetected: false }) },
  { label: "disabledPathCodeStillDetected false (disabled path code changes)", mutate: (r) => ({ ...r, disabledPathCodeStillDetected: false }) },
  { label: "normalHealthInsuranceDocumentTextAllowedByStaticRegression false (allowed sample not treated as allowed)", mutate: (r) => ({ ...r, normalHealthInsuranceDocumentTextAllowedByStaticRegression: false }) },
  { label: "explicitPaidActivationStillBlockedByStaticRegression false (explicit paid samples not treated as blocked)", mutate: (r) => ({ ...r, explicitPaidActivationStillBlockedByStaticRegression: false }) },
  { label: "broadDocumentTextNoLongerPaidModeTrigger false (broad document-like text still triggers paid mode)", mutate: (r) => ({ ...r, broadDocumentTextNoLongerPaidModeTrigger: false }) },
  { label: "ocrPhotoStillBlocked false (OCR/photo block disappears)", mutate: (r) => ({ ...r, ocrPhotoStillBlocked: false }) },
  { label: "scannerUploadFileUploadStillBlocked false (scanner/upload blocks disappear)", mutate: (r) => ({ ...r, scannerUploadFileUploadStillBlocked: false }) },
  { label: "paidModeStillBlockedForExplicitActivation false (paid explicit activation block disappears)", mutate: (r) => ({ ...r, paidModeStillBlockedForExplicitActivation: false }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA block disappears)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStorageStillBlocked false (persistence/storage block disappears)", mutate: (r) => ({ ...r, persistenceStorageStillBlocked: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline block disappears)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "credentialFinancialIdentityStillBlocked false (credential/financial/identity blocks disappear)", mutate: (r) => ({ ...r, credentialFinancialIdentityStillBlocked: false }) },
  { label: "highRiskEscalationStillBlocked false (high-risk escalation blocks disappear)", mutate: (r) => ({ ...r, highRiskEscalationStillBlocked: false }) },
  { label: "publicFreeQaBranchStillPresent false (public Free Q&A branch disappears)", mutate: (r) => ({ ...r, publicFreeQaBranchStillPresent: false }) },
  { label: "internalGuardedBranchStillPresent false (internal guarded branch disappears)", mutate: (r) => ({ ...r, internalGuardedBranchStillPresent: false }) },
  { label: "dbStorageWriteAdded true (DB/storage writes are added)", mutate: (r) => ({ ...r, dbStorageWriteAdded: true }) },
  { label: "ocrUploadHandlerAdded true (OCR/upload handlers are added)", mutate: (r) => ({ ...r, ocrUploadHandlerAdded: true }) },
  { label: "textDocumentRuntimeAuthorizedNow true (text document runtime becomes authorized now)", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, photoOcrRuntimeAuthorizedNow: true as false }) },
  { label: "publicRuntimeAuthorizedNow true (public runtime becomes authorized now)", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "productionAuthorizedNow true (production becomes authorized now)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes authorized now)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "liveRouteInvocationPerformedByAudit true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByAudit: true as false }) },
  { label: "liveModelCallPerformedByAudit true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByAudit: true as false }) },
  { label: "openAiSdkImportedByAudit true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByAudit: true as false }) },
  { label: "fetchUsedByAudit true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsedByAudit: true as false }) },
  { label: "processEnvReadForAuthorizationByAudit true (claims env read for authorization)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByAudit: true as false }) },
  { label: "filesWrittenByAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByAudit: true as false }) },
  { label: "dbStorageTouchedByAudit true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByAudit: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForControlledLocalTextDocumentEnabledApiRetest false", mutate: (r) => ({ ...r, readyForControlledLocalTextDocumentEnabledApiRetest: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Category B — regression-detection tamper cases (pure, synthetic source) ──

interface Tamper89EBlockerRegressionCase {
  label: string;
  check: () => boolean; // true = detector correctly caught the regression
}

const TEXT_DOCUMENT_MODE_FALSE_POSITIVE_FIX_REGRESSION_TAMPER_CASES: Tamper89EBlockerRegressionCase[] = [
  {
    label: "mode string missing",
    check: () => {
      const bad = `if (o.mode === "some_other_mode") { doWork(); }`;
      return analyzeRouteSource(bad).textDocumentModeDetected === false;
    },
  },
  {
    label: "env flag missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { const enabled = Boolean(o.forceEnable); }`;
      return analyzeRouteSource(bad).envFlagDetected === false;
    },
  },
  {
    label: "exact env flag gate removed",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { const enabled = Boolean(process.env[TEXT_DOCUMENT_MODE_ENV_FLAG]); }`;
      return analyzeRouteSource(bad).exactEnvFlagOnlyDetected === false;
    },
  },
  {
    label: "disabled path code/status changed",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { if (!enabled) { return NextResponse.json({ ok: false, code: "text_document_off" }, { status: 200 }); } }`;
      const a = analyzeRouteSource(bad);
      return a.disabledPathFailClosedDetected === false && a.disabledPathStatus403Detected === false;
    },
  },
  {
    label: "allowed health-insurance sample no longer allowed (narrow detector broadened)",
    check: () => {
      const bad =
        `function detectExplicitPaidDocumentModeActivationForTextDocumentMode(text) { return /dokument|krankenkasse/i.test(text); }`;
      return analyzeRouteSource(bad).allowedHealthInsuranceSampleAllowedByStaticRegression === false;
    },
  },
  {
    label: "explicit paid activation samples no longer blocked (narrow detector too narrow)",
    check: () => {
      const bad =
        `function detectExplicitPaidDocumentModeActivationForTextDocumentMode(text) { return /this-never-matches-anything-xyz/i.test(text); }`;
      return analyzeRouteSource(bad).explicitPaidActivationSamplesBlockedByStaticRegression === false;
    },
  },
  {
    label: "broad document-like text still triggers paid mode (regression to old bug)",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `if (detectClientPaidDocumentModeActivation(o)) { return textDocumentModeBlockedResponse("paid_document_mode_blocked", 402); } ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).broadDetectorNoLongerUsedForPaidModeInBranch === false;
    },
  },
  {
    label: "OCR/photo block missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).ocrPhotoBlockPresent === false;
    },
  },
  {
    label: "scanner/upload/file upload blocks missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).scannerUploadFileUploadBlockPresent === false;
    },
  },
  {
    label: "Vaylo DNA/persistence/storage blocks missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).vayloDnaPersistenceStorageBlockPresent === false;
    },
  },
  {
    label: "exact legal deadline block missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).exactLegalDeadlineBlockPresent === false;
    },
  },
  {
    label: "credential/financial/identity blocks missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).credentialFinancialIdentityBlockPresent === false;
    },
  },
  {
    label: "high-risk escalation blocks missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { } // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).highRiskEscalationBlockPresent === false;
    },
  },
  {
    label: "public Free Q&A branch disappears",
    check: () => {
      const bad = `const TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE = "text_document_controlled_runtime";`;
      return analyzeRouteSource(bad).publicFreeQaBranchStillPresent === false;
    },
  },
  {
    label: "internal guarded branch disappears",
    check: () => {
      const bad = `const TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE = "text_document_controlled_runtime";`;
      return analyzeRouteSource(bad).internalGuardedBranchStillPresent === false;
    },
  },
  {
    label: "DB/storage writes added",
    check: () => {
      const bad = `await supabase.from("text_document_answers").insert({ text });`;
      return analyzeRouteSource(bad).dbStorageWriteAdded === true;
    },
  },
  {
    label: "OCR/upload handlers added",
    check: () => {
      const bad = `const worker = tesseract.createWorker();`;
      return analyzeRouteSource(bad).ocrUploadHandlerAdded === true;
    },
  },
  {
    label: "production/go-live/public release become true",
    check: () => {
      const bad = `const meta = { readyForProduction: true, readyForGoLive: true, publicReleaseEnabled: true };`;
      return analyzeRouteSource(bad).dangerousReadinessDetected === true;
    },
  },
];

// ─── Exported false-positive fix audit runner ──────────────────────────────────

export function runTextDocumentModeEnabledPathFalsePositiveFixAudit(): TextDocumentModeEnabledPathFalsePositiveFixAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.9D-CLOSURE runner as source of truth ─────────────────────────────
  const d = runTextDocumentModeDisabledLocalApiTestClosure();
  if (d.checkId !== "8.9D-CLOSURE") auditFailures.push(`8.9D-CLOSURE checkId mismatch: expected "8.9D-CLOSURE", got "${d.checkId}"`);
  if (d.allPassed !== true) auditFailures.push("8.9D-CLOSURE allPassed is not true");
  if (d.sourceRoutePatchCommit !== "483ed41") auditFailures.push("8.9D-CLOSURE sourceRoutePatchCommit mismatch");
  if (d.sourceRoutePatchPhase !== "8.9C") auditFailures.push("8.9D-CLOSURE sourceRoutePatchPhase mismatch");
  if (d.exactEnvFlagGateConfirmed !== true) auditFailures.push("8.9D-CLOSURE exactEnvFlagGateConfirmed is not true");
  if (d.nonExactEnvValuesRejected !== true) auditFailures.push("8.9D-CLOSURE nonExactEnvValuesRejected is not true");
  if (d.disabledPathFailClosedConfirmed !== true) auditFailures.push("8.9D-CLOSURE disabledPathFailClosedConfirmed is not true");
  if (d.readyForControlledLocalTextDocumentEnabledApiTestPlanning !== true)
    auditFailures.push("8.9D-CLOSURE readyForControlledLocalTextDocumentEnabledApiTestPlanning is not true");
  if (d.readyForTextDocumentRuntime !== false) auditFailures.push("8.9D-CLOSURE readyForTextDocumentRuntime is not false");
  if (d.readyForPhotoOcrRuntime !== false) auditFailures.push("8.9D-CLOSURE readyForPhotoOcrRuntime is not false");
  if (d.readyForPublicRuntime !== false) auditFailures.push("8.9D-CLOSURE readyForPublicRuntime is not false");
  if (d.readyForProduction !== false) auditFailures.push("8.9D-CLOSURE readyForProduction is not false");
  if (d.readyForGoLive !== false) auditFailures.push("8.9D-CLOSURE readyForGoLive is not false");
  if (d.tamperRejected !== d.tamperCount) auditFailures.push("8.9D-CLOSURE own tamper count mismatch");

  // ── Read app/api/smart-talk/route.ts as static source text (only I/O here) ──
  let source = "";
  try {
    const routePath = path.join(process.cwd(), "app", "api", "smart-talk", "route.ts");
    source = fs.readFileSync(routePath, "utf8");
  } catch (err) {
    auditFailures.push(`failed to read app/api/smart-talk/route.ts: ${String(err)}`);
  }

  const analysis = analyzeRouteSource(source);

  if (!analysis.textDocumentModeDetected) auditFailures.push("text_document_controlled_runtime mode marker missing");
  if (!analysis.envFlagDetected) auditFailures.push("SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED env flag marker missing");
  if (!analysis.exactEnvFlagOnlyDetected) auditFailures.push("exact env flag check missing or non-exact");
  if (!analysis.disabledPathFailClosedDetected) auditFailures.push("fail-closed disabled code missing");
  if (!analysis.disabledPathStatus403Detected) auditFailures.push("disabled path status 403 missing");
  if (!analysis.disabledPathCodeDetected) auditFailures.push("disabled path code text_document_mode_disabled missing");
  if (!analysis.publicFreeQaBranchStillPresent) auditFailures.push("existing public Free Q&A branch markers missing");
  if (!analysis.internalGuardedBranchStillPresent) auditFailures.push("existing internal guarded branch markers missing");
  if (!analysis.narrowExplicitPaidActivationDetectorPresent) auditFailures.push("narrow explicit paid activation detector missing or not used in branch");
  if (!analysis.broadDetectorNoLongerUsedForPaidModeInBranch) auditFailures.push("broad document-like detector still used for paid-mode blocking in Text Document Mode branch");
  if (!analysis.ocrPhotoBlockPresent) auditFailures.push("OCR/photo block missing");
  if (!analysis.scannerUploadFileUploadBlockPresent) auditFailures.push("scanner/upload/file upload blocks missing");
  if (!analysis.vayloDnaPersistenceStorageBlockPresent) auditFailures.push("Vaylo DNA/persistence/storage blocks missing");
  if (!analysis.exactLegalDeadlineBlockPresent) auditFailures.push("exact legal deadline block missing");
  if (!analysis.credentialFinancialIdentityBlockPresent) auditFailures.push("credential/financial/identity blocks missing");
  if (!analysis.highRiskEscalationBlockPresent) auditFailures.push("high-risk escalation blocks missing");
  if (analysis.dbStorageWriteAdded) auditFailures.push("DB/storage write markers detected");
  if (analysis.ocrUploadHandlerAdded) auditFailures.push("OCR/upload handler markers detected");
  if (analysis.dangerousReadinessDetected) auditFailures.push("dangerous production/go-live/public-release/runtime readiness markers detected");
  if (!analysis.noOpenAiSdkImportInRoute) auditFailures.push("direct OpenAI SDK import detected in route");
  if (!analysis.noFetchCallInRoute) auditFailures.push("fetch() call detected in route");
  if (!analysis.allowedHealthInsuranceSampleAllowedByStaticRegression)
    auditFailures.push("allowed health-insurance regression sample is not treated as allowed by the narrowed detector logic");
  if (!analysis.explicitPaidActivationSamplesBlockedByStaticRegression)
    auditFailures.push("explicit paid activation regression samples are not all treated as blocked by the narrowed detector logic");

  const notes: string[] = [
    "IN-01: 8.9E-BLOCKER statically audits the uncommitted false-positive fix patch only; no live route/model/fetch call is performed.",
    `IN-02: 8.9D-CLOSURE confirmed — checkId=${d.checkId}, allPassed=${d.allPassed}, sourceRoutePatchCommit=483ed41 (expected), exactEnvFlagGateConfirmed=${d.exactEnvFlagGateConfirmed}.`,
    "IN-03: the observed 8.9E blocker (402 paid_document_mode_blocked on normal pasted health-insurance text) was caused by detectClientPaidDocumentModeActivation(o) inspecting the body's own \"mode\" field, which always contains the substring \"document\" for this branch.",
    "IN-04: the fix introduces detectExplicitPaidDocumentModeActivationForTextDocumentMode(text), a narrow text-based detector matching only explicit paid-activation/payment phrases, and uses it in place of the broad body-field detector for paid-mode blocking in this branch only.",
    "IN-05: static regression checks confirm the allowed health-insurance sample is no longer blocked, all 5 explicit paid-activation phrase samples are still blocked, and the broad detector is no longer the guard for paid-mode blocking in this branch.",
    "IN-06: all other blocks (OCR/photo, scanner/upload, file upload, Vaylo DNA, persistence/storage, exact legal deadline, binding legal advice, official filing generation, credential/financial/identity, high-risk escalation) remain present and unweakened; the existing public Free Q&A and internal guarded branches remain untouched.",
    "IN-07: no production/go-live/public-release/text-document-runtime/photo-OCR-runtime enablement markers, DB/storage writes, or OCR/upload handler code were detected in the patch.",
  ];

  const tamperCountA = TEXT_DOCUMENT_MODE_ENABLED_PATH_FALSE_POSITIVE_FIX_AUDIT_TAMPER_CASES.length;
  const tamperCountB = TEXT_DOCUMENT_MODE_FALSE_POSITIVE_FIX_REGRESSION_TAMPER_CASES.length;
  const tamperCount = tamperCountA + tamperCountB;

  const provisional: TextDocumentModeEnabledPathFalsePositiveFixAuditResult = {
    checkId: "8.9E-BLOCKER",
    allPassed: true,
    sourceDisabledClosureCommit: "f1c5ef3",
    sourceDisabledClosurePhase: "8.9D-CLOSURE",
    blockerObserved: true,
    blockerObservedStatus: 402,
    blockerObservedCode: "paid_document_mode_blocked",
    patchedRouteFile: "app/api/smart-talk/route.ts",
    auditFile:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-enabled-path-false-positive-fix-audit.ts",
    falsePositiveFixApplied: analysis.narrowExplicitPaidActivationDetectorPresent && analysis.broadDetectorNoLongerUsedForPaidModeInBranch,
    textDocumentModeStillDetected: analysis.textDocumentModeDetected,
    envFlagStillDetected: analysis.envFlagDetected,
    exactEnvFlagOnlyStillDetected: analysis.exactEnvFlagOnlyDetected,
    disabledPathStillFailClosed: analysis.disabledPathFailClosedDetected,
    disabledPathStatus403StillDetected: analysis.disabledPathStatus403Detected,
    disabledPathCodeStillDetected: analysis.disabledPathCodeDetected,
    normalHealthInsuranceDocumentTextAllowedByStaticRegression:
      analysis.allowedHealthInsuranceSampleAllowedByStaticRegression,
    explicitPaidActivationStillBlockedByStaticRegression:
      analysis.explicitPaidActivationSamplesBlockedByStaticRegression,
    broadDocumentTextNoLongerPaidModeTrigger: analysis.broadDetectorNoLongerUsedForPaidModeInBranch,
    ocrPhotoStillBlocked: analysis.ocrPhotoBlockPresent,
    scannerUploadFileUploadStillBlocked: analysis.scannerUploadFileUploadBlockPresent,
    paidModeStillBlockedForExplicitActivation: analysis.explicitPaidActivationSamplesBlockedByStaticRegression,
    vayloDnaStillBlocked: analysis.vayloDnaPersistenceStorageBlockPresent,
    persistenceStorageStillBlocked: analysis.vayloDnaPersistenceStorageBlockPresent,
    exactLegalDeadlineStillBlocked: analysis.exactLegalDeadlineBlockPresent,
    bindingLegalAdviceStillBlocked: analysis.highRiskEscalationBlockPresent,
    officialFilingGenerationStillBlocked: analysis.highRiskEscalationBlockPresent,
    credentialFinancialIdentityStillBlocked: analysis.credentialFinancialIdentityBlockPresent,
    highRiskEscalationStillBlocked: analysis.highRiskEscalationBlockPresent,
    publicFreeQaBranchStillPresent: analysis.publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent: analysis.internalGuardedBranchStillPresent,
    dbStorageWriteAdded: analysis.dbStorageWriteAdded,
    ocrUploadHandlerAdded: analysis.ocrUploadHandlerAdded,
    textDocumentRuntimeAuthorizedNow: false,
    photoOcrRuntimeAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    liveRouteInvocationPerformedByAudit: false,
    liveModelCallPerformedByAudit: false,
    openAiSdkImportedByAudit: false,
    fetchUsedByAudit: false,
    processEnvReadForAuthorizationByAudit: false,
    filesWrittenByAudit: false,
    dbStorageTouchedByAudit: false,
    eightThreeAcNotRun: true,
    readyForControlledLocalTextDocumentEnabledApiRetest: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    notes,
  };

  if (!_isCanonicalTextDocumentModeEnabledPathFalsePositiveFixAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejectedA = 0;
  const tamperFailuresA: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_ENABLED_PATH_FALSE_POSITIVE_FIX_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeEnabledPathFalsePositiveFixAuditResult(tc.mutate(provisional))) {
      tamperRejectedA++;
    } else {
      tamperFailuresA.push(`8.9E-BLOCKER tamper case (A) not rejected: "${tc.label}"`);
    }
  }

  let tamperRejectedB = 0;
  const tamperFailuresB: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_FALSE_POSITIVE_FIX_REGRESSION_TAMPER_CASES) {
    if (tc.check()) {
      tamperRejectedB++;
    } else {
      tamperFailuresB.push(`8.9E-BLOCKER tamper case (B) not detected: "${tc.label}"`);
    }
  }

  const tamperRejected = tamperRejectedA + tamperRejectedB;
  if (tamperFailuresA.length > 0) auditFailures.push(...tamperFailuresA);
  if (tamperFailuresB.length > 0) auditFailures.push(...tamperFailuresB);

  const allPassed =
    auditFailures.length === 0 &&
    d.checkId === "8.9D-CLOSURE" &&
    d.allPassed === true &&
    provisional.falsePositiveFixApplied === true &&
    provisional.textDocumentModeStillDetected === true &&
    provisional.envFlagStillDetected === true &&
    provisional.exactEnvFlagOnlyStillDetected === true &&
    provisional.disabledPathStillFailClosed === true &&
    provisional.disabledPathStatus403StillDetected === true &&
    provisional.disabledPathCodeStillDetected === true &&
    provisional.normalHealthInsuranceDocumentTextAllowedByStaticRegression === true &&
    provisional.explicitPaidActivationStillBlockedByStaticRegression === true &&
    provisional.broadDocumentTextNoLongerPaidModeTrigger === true &&
    provisional.ocrPhotoStillBlocked === true &&
    provisional.scannerUploadFileUploadStillBlocked === true &&
    provisional.paidModeStillBlockedForExplicitActivation === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStorageStillBlocked === true &&
    provisional.exactLegalDeadlineStillBlocked === true &&
    provisional.bindingLegalAdviceStillBlocked === true &&
    provisional.officialFilingGenerationStillBlocked === true &&
    provisional.credentialFinancialIdentityStillBlocked === true &&
    provisional.highRiskEscalationStillBlocked === true &&
    provisional.publicFreeQaBranchStillPresent === true &&
    provisional.internalGuardedBranchStillPresent === true &&
    provisional.dbStorageWriteAdded === false &&
    provisional.ocrUploadHandlerAdded === false &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9E-BLOCKER tamper cases: ${tamperRejected}/${tamperCount} correctly rejected (A=${tamperRejectedA}/${tamperCountA}, B=${tamperRejectedB}/${tamperCountB})`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForControlledLocalTextDocumentEnabledApiRetest: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9E-BLOCKER result as JSON. No network/model/env-authorization
// access is performed here; only process.argv[1] is read to detect direct
// execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-enabled-path-false-positive-fix-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeEnabledPathFalsePositiveFixAudit(), null, 2));
}
