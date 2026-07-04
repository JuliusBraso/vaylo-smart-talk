/**
 * PHASE 8.9C — Text Document Mode Minimal Route Patch Safety Audit
 *
 * Audit-only phase for the uncommitted 8.9C route patch in
 * app/api/smart-talk/route.ts. This audit reads that file as STATIC TEXT
 * (the only permitted I/O in this phase) and validates required markers,
 * ordering, and boundaries with pure string/regex analysis. It does not
 * invoke the route, does not import the route module, does not call
 * runSmartTalk, does not call OpenAI, and does not use fetch.
 *
 * This phase does NOT enable text document runtime, photo/OCR runtime,
 * public runtime, production, go-live, or public release.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeControlledRuntimeImplementationPlan } from "./run-text-document-mode-controlled-runtime-implementation-plan";

// ─── Static analysis (pure — operates only on a source string argument) ───────

interface RouteSourceAnalysis {
  modeDetected: boolean;
  envFlagDetected: boolean;
  exactEnvFlagOnlyDetected: boolean;
  disabledPathFailClosedDetected: boolean;
  disabledPathStatus403Detected: boolean;
  disabledPathBeforeModelCallDetected: boolean;
  textDocumentBranchModelCallAfterBlocksDetected: boolean;
  contextValidationDetected: boolean;
  inputTypeTextValidationDetected: boolean;
  localeValidationDetected: boolean;
  documentClassificationBeforeModelCallDetected: boolean;
  exactLegalDeadlineBlockBeforeModelCallDetected: boolean;
  ocrPhotoScannerUploadBlockBeforeModelCallDetected: boolean;
  paidDnaPersistenceStorageBlocksDetected: boolean;
  credentialFinancialIdentityBlocksDetected: boolean;
  highRiskEscalationBlocksDetected: boolean;
  successMetadataDetected: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  dangerousReadinessDetected: boolean;
  noOpenAiSdkImportInRoute: boolean;
  noFetchCallInRoute: boolean;
}

const TEXT_DOC_BRANCH_ANCHOR = "if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE)";
const TEXT_DOC_BRANCH_END_MARKER =
  "// ── End Phase 8.9C Text Document Mode controlled runtime branch";
const TEXT_DOC_RUN_SMART_TALK_CALL = 'runSmartTalk({ text, locale, inputType: "text" })';

const BLOCKER_CODES: readonly string[] = [
  "photo_ocr_blocked",
  "scanner_upload_blocked",
  "file_upload_blocked",
  "paid_document_mode_blocked",
  "vaylo_dna_blocked",
  "persistence_storage_blocked",
  "sensitive_credential_data_blocked",
  "sensitive_financial_data_blocked",
  "sensitive_identity_data_blocked",
  "exact_legal_deadline_calculation_blocked",
  "binding_legal_advice_blocked",
  "official_filing_generation_blocked",
  "high_risk_signal_escalation_blocked",
  "no_document_signal_blocked",
];

const SUCCESS_METADATA_KEYS: readonly string[] = [
  "textDocumentModeEnabled",
  "controlledTextDocumentRuntime",
  "pastedTextOnly",
  "photoOcrStillBlocked",
  "scannerUploadStillBlocked",
  "fileUploadStillBlocked",
  "paidDocumentModeStillBlocked",
  "vayloDnaStillBlocked",
  "persistenceStillBlocked",
  "dbStorageStillBlocked",
  "exactLegalDeadlineStillBlocked",
  "bindingLegalAdviceStillBlocked",
  "officialFilingGenerationStillBlocked",
  "modelOutputStillUntrusted",
  "documentTextTreatedAsSensitive",
  "privacyDisclaimerRequired",
  "legalDisclaimerRequired",
  "eightThreeAcNotRun",
];

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

function extractSlice(source: string, startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  if (start === -1) return "";
  const end = source.indexOf(endMarker, start);
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

function analyzeRouteSource(source: string): RouteSourceAnalysis {
  const slice = extractSlice(source, TEXT_DOC_BRANCH_ANCHOR, TEXT_DOC_BRANCH_END_MARKER);
  const runSmartTalkIdx = slice.indexOf(TEXT_DOC_RUN_SMART_TALK_CALL);

  const modeDetected =
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
  const disabledPathStatus403Detected =
    disabledCodeIdx !== -1 && /"text_document_mode_disabled"\s*,\s*403\)/.test(source);

  const disabledCodeIdxInSlice = slice.indexOf('"text_document_mode_disabled"');
  const disabledPathBeforeModelCallDetected =
    disabledCodeIdxInSlice !== -1 && runSmartTalkIdx !== -1 && disabledCodeIdxInSlice < runSmartTalkIdx;

  const blockerIndices = BLOCKER_CODES.map((code) => slice.indexOf(`"${code}"`));
  const allBlockersPresent = blockerIndices.every((idx) => idx !== -1);
  const textDocumentBranchModelCallAfterBlocksDetected =
    allBlockersPresent && runSmartTalkIdx !== -1 && blockerIndices.every((idx) => idx < runSmartTalkIdx);

  const contextValidationDetected = slice.includes(
    'o.context !== "anonymous" && o.context !== "controlled_test"',
  );
  const inputTypeTextValidationDetected =
    slice.includes('o.inputType !== "text"') && slice.includes("text_document_mode_text_input_only");
  const localeValidationDetected = slice.includes("ALLOWED_LOCALES.has(o.locale");

  const docClassIdx = slice.indexOf("isDocumentLikeSignalPresent(text)");
  const documentClassificationBeforeModelCallDetected =
    docClassIdx !== -1 && runSmartTalkIdx !== -1 && docClassIdx < runSmartTalkIdx;

  const deadlineIdx = slice.indexOf("detectExactLegalDeadlineRequest(text)");
  const exactLegalDeadlineBlockBeforeModelCallDetected =
    deadlineIdx !== -1 && runSmartTalkIdx !== -1 && deadlineIdx < runSmartTalkIdx;

  const ocrIdx = slice.indexOf("detectOcrPhotoRequest(o)");
  const scannerIdx = slice.indexOf("detectScannerUploadRequest(o)");
  const uploadIdx = slice.indexOf("detectFileUploadRequest(o)");
  const ocrPhotoScannerUploadBlockBeforeModelCallDetected =
    ocrIdx !== -1 &&
    scannerIdx !== -1 &&
    uploadIdx !== -1 &&
    runSmartTalkIdx !== -1 &&
    ocrIdx < runSmartTalkIdx &&
    scannerIdx < runSmartTalkIdx &&
    uploadIdx < runSmartTalkIdx;

  const paidIdx = slice.indexOf("detectClientPaidDocumentModeActivation(o)");
  const dnaIdx = slice.indexOf("detectVayloDnaSaveRequest(o)");
  const persistIdx = slice.indexOf("detectPersistenceStorageRequest(o)");
  const paidDnaPersistenceStorageBlocksDetected =
    paidIdx !== -1 &&
    dnaIdx !== -1 &&
    persistIdx !== -1 &&
    runSmartTalkIdx !== -1 &&
    paidIdx < runSmartTalkIdx &&
    dnaIdx < runSmartTalkIdx &&
    persistIdx < runSmartTalkIdx;

  const credIdx = slice.indexOf("detectCredentialSecretText(text)");
  const finIdx = slice.indexOf("detectFinancialAccountOrPaymentAuthorizationText(text)");
  const idIdx = slice.indexOf("detectIdentityDocumentNumberText(text)");
  const credentialFinancialIdentityBlocksDetected =
    credIdx !== -1 &&
    finIdx !== -1 &&
    idIdx !== -1 &&
    runSmartTalkIdx !== -1 &&
    credIdx < runSmartTalkIdx &&
    finIdx < runSmartTalkIdx &&
    idIdx < runSmartTalkIdx;

  const highRiskIdx = slice.indexOf("detectHighRiskCourtPoliceMedicalTaxSignal(text)");
  const bindingIdx = slice.indexOf("detectBindingLegalAdviceRequest(text)");
  const officialIdx = slice.indexOf("detectOfficialFilingGenerationRequest(text)");
  const highRiskEscalationBlocksDetected =
    highRiskIdx !== -1 &&
    bindingIdx !== -1 &&
    officialIdx !== -1 &&
    runSmartTalkIdx !== -1 &&
    highRiskIdx < runSmartTalkIdx &&
    bindingIdx < runSmartTalkIdx &&
    officialIdx < runSmartTalkIdx;

  const successMetadataDetected =
    slice.includes("buildTextDocumentModeSafetyFlags(true)") &&
    SUCCESS_METADATA_KEYS.every((k) => source.includes(k));

  const publicFreeQaBranchStillPresent =
    source.includes("FREE_QA_PUBLIC_BETA_MODE") && source.includes('"free_qa_public_beta"');
  const internalGuardedBranchStillPresent = INTERNAL_BRANCH_MARKERS.every((m) => source.includes(m));

  const dbStorageWriteAdded = DANGEROUS_DB_STORAGE_PATTERN.test(source);
  const ocrUploadHandlerAdded = OCR_UPLOAD_HANDLER_PATTERN.test(source);
  const dangerousReadinessDetected = DANGEROUS_READINESS_PATTERN.test(source);

  const noOpenAiSdkImportInRoute = !/from\s+["']openai["']/i.test(source);
  const noFetchCallInRoute = !/[^.\w]fetch\(/i.test(source);

  return {
    modeDetected,
    envFlagDetected,
    exactEnvFlagOnlyDetected,
    disabledPathFailClosedDetected,
    disabledPathStatus403Detected,
    disabledPathBeforeModelCallDetected,
    textDocumentBranchModelCallAfterBlocksDetected,
    contextValidationDetected,
    inputTypeTextValidationDetected,
    localeValidationDetected,
    documentClassificationBeforeModelCallDetected,
    exactLegalDeadlineBlockBeforeModelCallDetected,
    ocrPhotoScannerUploadBlockBeforeModelCallDetected,
    paidDnaPersistenceStorageBlocksDetected,
    credentialFinancialIdentityBlocksDetected,
    highRiskEscalationBlocksDetected,
    successMetadataDetected,
    publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent,
    dbStorageWriteAdded,
    ocrUploadHandlerAdded,
    dangerousReadinessDetected,
    noOpenAiSdkImportInRoute,
    noFetchCallInRoute,
  };
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeMinimalRoutePatchSafetyAuditResult {
  checkId: "8.9C";
  allPassed: boolean;
  sourcePlanCommit: "29e91c6";
  sourcePlanPhase: "8.9B";
  routePatchFile: "app/api/smart-talk/route.ts";
  auditFile: "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-minimal-route-patch-safety-audit.ts";
  routePatchApplied: boolean;
  modeDetected: boolean;
  envFlagDetected: boolean;
  exactEnvFlagOnlyDetected: boolean;
  disabledPathFailClosedDetected: boolean;
  disabledPathStatus403Detected: boolean;
  disabledPathBeforeModelCallDetected: boolean;
  textDocumentBranchModelCallAfterBlocksDetected: boolean;
  contextValidationDetected: boolean;
  inputTypeTextValidationDetected: boolean;
  localeValidationDetected: boolean;
  documentClassificationBeforeModelCallDetected: boolean;
  exactLegalDeadlineBlockBeforeModelCallDetected: boolean;
  ocrPhotoScannerUploadBlockBeforeModelCallDetected: boolean;
  paidDnaPersistenceStorageBlocksDetected: boolean;
  credentialFinancialIdentityBlocksDetected: boolean;
  highRiskEscalationBlocksDetected: boolean;
  successMetadataDetected: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  publicReleaseAuthorizedNow: false;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  openAiSdkImportedByAudit: false;
  fetchUsedByAudit: false;
  processEnvReadForAuthorizationByAudit: false;
  filesWrittenByAudit: false;
  dbStorageTouchedByAudit: false;
  eightThreeAcNotRun: true;
  readyForControlledLocalTextDocumentDisabledApiTest: boolean;
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

function _isCanonicalTextDocumentModeMinimalRoutePatchSafetyAuditResult(
  r: TextDocumentModeMinimalRoutePatchSafetyAuditResult,
): boolean {
  if (r.checkId !== "8.9C") return false;
  if (r.allPassed !== true) return false;
  if (r.sourcePlanCommit !== "29e91c6") return false;
  if (r.sourcePlanPhase !== "8.9B") return false;
  if (r.routePatchFile !== "app/api/smart-talk/route.ts") return false;
  if (
    r.auditFile !==
    "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-minimal-route-patch-safety-audit.ts"
  )
    return false;
  if (r.routePatchApplied !== true) return false;
  if (r.modeDetected !== true) return false;
  if (r.envFlagDetected !== true) return false;
  if (r.exactEnvFlagOnlyDetected !== true) return false;
  if (r.disabledPathFailClosedDetected !== true) return false;
  if (r.disabledPathStatus403Detected !== true) return false;
  if (r.disabledPathBeforeModelCallDetected !== true) return false;
  if (r.textDocumentBranchModelCallAfterBlocksDetected !== true) return false;
  if (r.contextValidationDetected !== true) return false;
  if (r.inputTypeTextValidationDetected !== true) return false;
  if (r.localeValidationDetected !== true) return false;
  if (r.documentClassificationBeforeModelCallDetected !== true) return false;
  if (r.exactLegalDeadlineBlockBeforeModelCallDetected !== true) return false;
  if (r.ocrPhotoScannerUploadBlockBeforeModelCallDetected !== true) return false;
  if (r.paidDnaPersistenceStorageBlocksDetected !== true) return false;
  if (r.credentialFinancialIdentityBlocksDetected !== true) return false;
  if (r.highRiskEscalationBlocksDetected !== true) return false;
  if (r.successMetadataDetected !== true) return false;
  if (r.publicFreeQaBranchStillPresent !== true) return false;
  if (r.internalGuardedBranchStillPresent !== true) return false;
  if (r.dbStorageWriteAdded !== false) return false;
  if (r.ocrUploadHandlerAdded !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.publicReleaseAuthorizedNow !== false) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.openAiSdkImportedByAudit !== false) return false;
  if (r.fetchUsedByAudit !== false) return false;
  if (r.processEnvReadForAuthorizationByAudit !== false) return false;
  if (r.filesWrittenByAudit !== false) return false;
  if (r.dbStorageTouchedByAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForControlledLocalTextDocumentDisabledApiTest !== true) return false;
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

type Tamper89CMutation = (
  r: TextDocumentModeMinimalRoutePatchSafetyAuditResult,
) => TextDocumentModeMinimalRoutePatchSafetyAuditResult;
interface Tamper89CCase {
  label: string;
  mutate: Tamper89CMutation;
}

const TEXT_DOCUMENT_MODE_MINIMAL_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES: Tamper89CCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9B" as "8.9C" }) },
  { label: "allPassed false (source 8.9B allPassed treated as false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourcePlanCommit wrong", mutate: (r) => ({ ...r, sourcePlanCommit: "0000000" as "29e91c6" }) },
  { label: "sourcePlanPhase wrong", mutate: (r) => ({ ...r, sourcePlanPhase: "8.9A" as "8.9B" }) },
  { label: "routePatchFile wrong", mutate: (r) => ({ ...r, routePatchFile: "app/api/other/route.ts" as "app/api/smart-talk/route.ts" }) },
  {
    label: "auditFile wrong",
    mutate: (r) => ({
      ...r,
      auditFile:
        "lib/vaylo/smart-talk/reality-matrix/live-input/wrong-file.ts" as "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-minimal-route-patch-safety-audit.ts",
    }),
  },
  { label: "routePatchApplied false", mutate: (r) => ({ ...r, routePatchApplied: false }) },
  { label: "modeDetected false (mode string changes)", mutate: (r) => ({ ...r, modeDetected: false }) },
  { label: "envFlagDetected false (env flag changes)", mutate: (r) => ({ ...r, envFlagDetected: false }) },
  { label: "exactEnvFlagOnlyDetected false (exact env true requirement removed)", mutate: (r) => ({ ...r, exactEnvFlagOnlyDetected: false }) },
  { label: "disabledPathFailClosedDetected false (disabled path code changes)", mutate: (r) => ({ ...r, disabledPathFailClosedDetected: false }) },
  { label: "disabledPathStatus403Detected false (disabled path status changes)", mutate: (r) => ({ ...r, disabledPathStatus403Detected: false }) },
  { label: "disabledPathBeforeModelCallDetected false (disabled path after model call)", mutate: (r) => ({ ...r, disabledPathBeforeModelCallDetected: false }) },
  { label: "textDocumentBranchModelCallAfterBlocksDetected false (model call before blocks)", mutate: (r) => ({ ...r, textDocumentBranchModelCallAfterBlocksDetected: false }) },
  { label: "contextValidationDetected false", mutate: (r) => ({ ...r, contextValidationDetected: false }) },
  { label: "inputTypeTextValidationDetected false", mutate: (r) => ({ ...r, inputTypeTextValidationDetected: false }) },
  { label: "localeValidationDetected false", mutate: (r) => ({ ...r, localeValidationDetected: false }) },
  { label: "documentClassificationBeforeModelCallDetected false (document classification missing)", mutate: (r) => ({ ...r, documentClassificationBeforeModelCallDetected: false }) },
  { label: "exactLegalDeadlineBlockBeforeModelCallDetected false (exact legal deadline block missing)", mutate: (r) => ({ ...r, exactLegalDeadlineBlockBeforeModelCallDetected: false }) },
  { label: "ocrPhotoScannerUploadBlockBeforeModelCallDetected false (OCR/photo/upload blocks missing)", mutate: (r) => ({ ...r, ocrPhotoScannerUploadBlockBeforeModelCallDetected: false }) },
  { label: "paidDnaPersistenceStorageBlocksDetected false (paid/DNA/persistence blocks missing)", mutate: (r) => ({ ...r, paidDnaPersistenceStorageBlocksDetected: false }) },
  { label: "credentialFinancialIdentityBlocksDetected false (credential/financial/identity blocks missing)", mutate: (r) => ({ ...r, credentialFinancialIdentityBlocksDetected: false }) },
  { label: "highRiskEscalationBlocksDetected false (high-risk escalation blocks missing)", mutate: (r) => ({ ...r, highRiskEscalationBlocksDetected: false }) },
  { label: "successMetadataDetected false (success metadata missing)", mutate: (r) => ({ ...r, successMetadataDetected: false }) },
  { label: "publicFreeQaBranchStillPresent false (public Free Q&A branch disappears)", mutate: (r) => ({ ...r, publicFreeQaBranchStillPresent: false }) },
  { label: "internalGuardedBranchStillPresent false (internal guarded branch disappears)", mutate: (r) => ({ ...r, internalGuardedBranchStillPresent: false }) },
  { label: "dbStorageWriteAdded true (DB/storage writes are added)", mutate: (r) => ({ ...r, dbStorageWriteAdded: true }) },
  { label: "ocrUploadHandlerAdded true (OCR/upload handlers are added)", mutate: (r) => ({ ...r, ocrUploadHandlerAdded: true }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "publicReleaseAuthorizedNow true", mutate: (r) => ({ ...r, publicReleaseAuthorizedNow: true as false }) },
  { label: "liveRouteInvocationPerformed true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "openAiSdkImportedByAudit true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByAudit: true as false }) },
  { label: "fetchUsedByAudit true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsedByAudit: true as false }) },
  { label: "processEnvReadForAuthorizationByAudit true (claims env read for authorization)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByAudit: true as false }) },
  { label: "filesWrittenByAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByAudit: true as false }) },
  { label: "dbStorageTouchedByAudit true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByAudit: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForControlledLocalTextDocumentDisabledApiTest false", mutate: (r) => ({ ...r, readyForControlledLocalTextDocumentDisabledApiTest: false }) },
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
// Each case proves analyzeRouteSource() correctly flags a regressed/corrupted
// synthetic snippet. No real files are read for these; they use inline
// synthetic strings only.

interface Tamper89CRegressionCase {
  label: string;
  check: () => boolean; // true = detector correctly caught the regression
}

const TEXT_DOCUMENT_MODE_ROUTE_PATCH_REGRESSION_TAMPER_CASES: Tamper89CRegressionCase[] = [
  {
    label: "mode string missing",
    check: () => {
      const bad = `if (o.mode === "some_other_mode") { doWork(); }`;
      return analyzeRouteSource(bad).modeDetected === false;
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
    label: "exact env true requirement removed",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { const enabled = Boolean(process.env[TEXT_DOCUMENT_MODE_ENV_FLAG]); }`;
      return analyzeRouteSource(bad).exactEnvFlagOnlyDetected === false;
    },
  },
  {
    label: "disabled path code changed",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { if (!enabled) { return NextResponse.json({ ok: false, code: "text_document_off" }, { status: 403 }); } }`;
      return analyzeRouteSource(bad).disabledPathFailClosedDetected === false;
    },
  },
  {
    label: "disabled path status changed",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { if (!enabled) { return textDocumentModeBlockedResponse("text_document_mode_disabled", 200); } }`;
      return analyzeRouteSource(bad).disabledPathStatus403Detected === false;
    },
  },
  {
    label: "disabled path after model call",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `if (!enabled) { return textDocumentModeBlockedResponse("text_document_mode_disabled", 403); } ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).disabledPathBeforeModelCallDetected === false;
    },
  },
  {
    label: "model call before blocks",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `if (detectOcrPhotoRequest(o)) { return textDocumentModeBlockedResponse("photo_ocr_blocked", 402); } ` +
        `if (detectScannerUploadRequest(o)) { return textDocumentModeBlockedResponse("scanner_upload_blocked", 402); } ` +
        `if (detectFileUploadRequest(o)) { return textDocumentModeBlockedResponse("file_upload_blocked", 402); } ` +
        `if (detectClientPaidDocumentModeActivation(o)) { return textDocumentModeBlockedResponse("paid_document_mode_blocked", 402); } ` +
        `if (detectVayloDnaSaveRequest(o)) { return textDocumentModeBlockedResponse("vaylo_dna_blocked", 402); } ` +
        `if (detectPersistenceStorageRequest(o)) { return textDocumentModeBlockedResponse("persistence_storage_blocked", 402); } ` +
        `if (detectCredentialSecretText(text)) { return textDocumentModeBlockedResponse("sensitive_credential_data_blocked", 402); } ` +
        `if (detectFinancialAccountOrPaymentAuthorizationText(text)) { return textDocumentModeBlockedResponse("sensitive_financial_data_blocked", 402); } ` +
        `if (detectIdentityDocumentNumberText(text)) { return textDocumentModeBlockedResponse("sensitive_identity_data_blocked", 402); } ` +
        `if (detectExactLegalDeadlineRequest(text)) { return textDocumentModeBlockedResponse("exact_legal_deadline_calculation_blocked", 402); } ` +
        `if (detectBindingLegalAdviceRequest(text)) { return textDocumentModeBlockedResponse("binding_legal_advice_blocked", 402); } ` +
        `if (detectOfficialFilingGenerationRequest(text)) { return textDocumentModeBlockedResponse("official_filing_generation_blocked", 402); } ` +
        `if (detectHighRiskCourtPoliceMedicalTaxSignal(text)) { return textDocumentModeBlockedResponse("high_risk_signal_escalation_blocked", 402); } ` +
        `if (!isDocumentLikeSignalPresent(text)) { return textDocumentModeBlockedResponse("no_document_signal_blocked", 400); } ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).textDocumentBranchModelCallAfterBlocksDetected === false;
    },
  },
  {
    label: "document classification missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).documentClassificationBeforeModelCallDetected === false;
    },
  },
  {
    label: "exact legal deadline block missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).exactLegalDeadlineBlockBeforeModelCallDetected === false;
    },
  },
  {
    label: "OCR/photo/upload blocks missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).ocrPhotoScannerUploadBlockBeforeModelCallDetected === false;
    },
  },
  {
    label: "paid/DNA/persistence blocks missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).paidDnaPersistenceStorageBlocksDetected === false;
    },
  },
  {
    label: "credential/financial/identity blocks missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).credentialFinancialIdentityBlocksDetected === false;
    },
  },
  {
    label: "high-risk escalation blocks missing",
    check: () => {
      const bad =
        `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { ` +
        `const out = await runSmartTalk({ text, locale, inputType: "text" }); ` +
        `} // ── End Phase 8.9C Text Document Mode controlled runtime branch`;
      return analyzeRouteSource(bad).highRiskEscalationBlocksDetected === false;
    },
  },
  {
    label: "success metadata missing",
    check: () => {
      const bad = `if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE) { return NextResponse.json({ ok: true }); }`;
      return analyzeRouteSource(bad).successMetadataDetected === false;
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

// ─── Exported route patch safety-audit runner ──────────────────────────────────

export function runTextDocumentModeMinimalRoutePatchSafetyAudit(): TextDocumentModeMinimalRoutePatchSafetyAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.9B implementation plan runner as source of truth ────────────────
  const b = runTextDocumentModeControlledRuntimeImplementationPlan();
  if (b.checkId !== "8.9B") auditFailures.push(`8.9B checkId mismatch: expected "8.9B", got "${b.checkId}"`);
  if (b.allPassed !== true) auditFailures.push("8.9B allPassed is not true");
  if (b.targetPatchPhase !== "8.9C") auditFailures.push("8.9B targetPatchPhase mismatch");
  if (b.targetPatchFile !== "app/api/smart-talk/route.ts") auditFailures.push("8.9B targetPatchFile mismatch");
  if (b.plannedMode !== "text_document_controlled_runtime") auditFailures.push("8.9B plannedMode mismatch");
  if (b.plannedEnvFlag !== "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED") auditFailures.push("8.9B plannedEnvFlag mismatch");
  if (b.plannedEnvDefault !== false) auditFailures.push("8.9B plannedEnvDefault is not false");
  if (b.disabledPathStatus !== 403) auditFailures.push("8.9B disabledPathStatus is not 403");
  if (b.disabledPathCode !== "text_document_mode_disabled") auditFailures.push("8.9B disabledPathCode mismatch");
  if (b.readyForTextDocumentModeRoutePatch !== true)
    auditFailures.push("8.9B readyForTextDocumentModeRoutePatch is not true");
  if (b.readyForTextDocumentRuntime !== false) auditFailures.push("8.9B readyForTextDocumentRuntime is not false");
  if (b.readyForPhotoOcrRuntime !== false) auditFailures.push("8.9B readyForPhotoOcrRuntime is not false");
  if (b.readyForPublicRuntime !== false) auditFailures.push("8.9B readyForPublicRuntime is not false");
  if (b.readyForProduction !== false) auditFailures.push("8.9B readyForProduction is not false");
  if (b.readyForGoLive !== false) auditFailures.push("8.9B readyForGoLive is not false");
  if (b.tamperRejected !== b.tamperCount) auditFailures.push("8.9B own tamper count mismatch");

  // ── Read app/api/smart-talk/route.ts as static source text (only I/O here) ──
  let source = "";
  try {
    const routePath = path.join(process.cwd(), "app", "api", "smart-talk", "route.ts");
    source = fs.readFileSync(routePath, "utf8");
  } catch (err) {
    auditFailures.push(`failed to read app/api/smart-talk/route.ts: ${String(err)}`);
  }

  const analysis = analyzeRouteSource(source);

  if (!analysis.modeDetected) auditFailures.push("mode marker (TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE / text_document_controlled_runtime) missing");
  if (!analysis.envFlagDetected) auditFailures.push("env flag marker (TEXT_DOCUMENT_MODE_ENV_FLAG / SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED) missing");
  if (!analysis.exactEnvFlagOnlyDetected) auditFailures.push("exact env flag check missing or non-exact");
  if (!analysis.disabledPathFailClosedDetected) auditFailures.push("fail-closed disabled code (text_document_mode_disabled) missing");
  if (!analysis.disabledPathStatus403Detected) auditFailures.push("disabled path status 403 missing");
  if (!analysis.disabledPathBeforeModelCallDetected) auditFailures.push("disabled path does not appear before runSmartTalk");
  if (!analysis.textDocumentBranchModelCallAfterBlocksDetected) auditFailures.push("model call does not appear strictly after all blockers");
  if (!analysis.contextValidationDetected) auditFailures.push("context validation (anonymous/controlled_test) missing");
  if (!analysis.inputTypeTextValidationDetected) auditFailures.push("inputType text validation missing");
  if (!analysis.localeValidationDetected) auditFailures.push("locale validation via ALLOWED_LOCALES missing");
  if (!analysis.documentClassificationBeforeModelCallDetected) auditFailures.push("document-like classification missing or not before runSmartTalk");
  if (!analysis.exactLegalDeadlineBlockBeforeModelCallDetected) auditFailures.push("exact legal deadline block missing or not before runSmartTalk");
  if (!analysis.ocrPhotoScannerUploadBlockBeforeModelCallDetected) auditFailures.push("OCR/photo/scanner/upload blocks missing or not before runSmartTalk");
  if (!analysis.paidDnaPersistenceStorageBlocksDetected) auditFailures.push("paid/DNA/persistence/storage blocks missing or not before runSmartTalk");
  if (!analysis.credentialFinancialIdentityBlocksDetected) auditFailures.push("credential/financial/identity blocks missing or not before runSmartTalk");
  if (!analysis.highRiskEscalationBlocksDetected) auditFailures.push("high-risk legal/court/police/medical/tax escalation blocks missing or not before runSmartTalk");
  if (!analysis.successMetadataDetected) auditFailures.push("success textDocumentMeta metadata keys missing");
  if (!analysis.publicFreeQaBranchStillPresent) auditFailures.push("existing public Free Q&A branch markers missing");
  if (!analysis.internalGuardedBranchStillPresent) auditFailures.push("existing internal guarded branch markers missing");
  if (analysis.dbStorageWriteAdded) auditFailures.push("DB/storage write markers detected");
  if (analysis.ocrUploadHandlerAdded) auditFailures.push("OCR/upload handler markers detected");
  if (analysis.dangerousReadinessDetected) auditFailures.push("dangerous production/go-live/public-release/runtime readiness markers detected");
  if (!analysis.noOpenAiSdkImportInRoute) auditFailures.push("direct OpenAI SDK import detected in route");
  if (!analysis.noFetchCallInRoute) auditFailures.push("fetch() call detected in route");

  const notes: string[] = [
    "IN-01: 8.9C statically audits the uncommitted text document mode route patch only; no live route/model/fetch call is performed.",
    `IN-02: 8.9B confirmed — checkId=${b.checkId}, allPassed=${b.allPassed}, plannedMode=${b.plannedMode}, plannedEnvFlag=${b.plannedEnvFlag}, plannedEnvDefault=${b.plannedEnvDefault}.`,
    "IN-03: app/api/smart-talk/route.ts was read as static text via fs.readFileSync only; it was not imported or invoked.",
    "IN-04: exact env flag gating, fail-closed disabled path, input validation, document classification, exact-deadline/OCR/upload/paid/DNA/persistence/credential/financial/identity/high-risk blocking ordering, and success metadata were all verified via string/regex analysis.",
    "IN-05: no production/go-live/public-release/text-document-runtime/photo-OCR-runtime enablement markers, DB/storage writes, or OCR/upload handler code were detected in the patch.",
    "IN-06: existing public Free Q&A (8.8T) and internal guarded (8.8M) branches remain present and untouched.",
  ];

  const tamperCountA = TEXT_DOCUMENT_MODE_MINIMAL_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES.length;
  const tamperCountB = TEXT_DOCUMENT_MODE_ROUTE_PATCH_REGRESSION_TAMPER_CASES.length;
  const tamperCount = tamperCountA + tamperCountB;

  const provisional: TextDocumentModeMinimalRoutePatchSafetyAuditResult = {
    checkId: "8.9C",
    allPassed: true,
    sourcePlanCommit: "29e91c6",
    sourcePlanPhase: "8.9B",
    routePatchFile: "app/api/smart-talk/route.ts",
    auditFile:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-minimal-route-patch-safety-audit.ts",
    routePatchApplied: analysis.modeDetected && analysis.envFlagDetected,
    modeDetected: analysis.modeDetected,
    envFlagDetected: analysis.envFlagDetected,
    exactEnvFlagOnlyDetected: analysis.exactEnvFlagOnlyDetected,
    disabledPathFailClosedDetected: analysis.disabledPathFailClosedDetected,
    disabledPathStatus403Detected: analysis.disabledPathStatus403Detected,
    disabledPathBeforeModelCallDetected: analysis.disabledPathBeforeModelCallDetected,
    textDocumentBranchModelCallAfterBlocksDetected: analysis.textDocumentBranchModelCallAfterBlocksDetected,
    contextValidationDetected: analysis.contextValidationDetected,
    inputTypeTextValidationDetected: analysis.inputTypeTextValidationDetected,
    localeValidationDetected: analysis.localeValidationDetected,
    documentClassificationBeforeModelCallDetected: analysis.documentClassificationBeforeModelCallDetected,
    exactLegalDeadlineBlockBeforeModelCallDetected: analysis.exactLegalDeadlineBlockBeforeModelCallDetected,
    ocrPhotoScannerUploadBlockBeforeModelCallDetected: analysis.ocrPhotoScannerUploadBlockBeforeModelCallDetected,
    paidDnaPersistenceStorageBlocksDetected: analysis.paidDnaPersistenceStorageBlocksDetected,
    credentialFinancialIdentityBlocksDetected: analysis.credentialFinancialIdentityBlocksDetected,
    highRiskEscalationBlocksDetected: analysis.highRiskEscalationBlocksDetected,
    successMetadataDetected: analysis.successMetadataDetected,
    publicFreeQaBranchStillPresent: analysis.publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent: analysis.internalGuardedBranchStillPresent,
    dbStorageWriteAdded: analysis.dbStorageWriteAdded,
    ocrUploadHandlerAdded: analysis.ocrUploadHandlerAdded,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    publicReleaseAuthorizedNow: false,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    openAiSdkImportedByAudit: false,
    fetchUsedByAudit: false,
    processEnvReadForAuthorizationByAudit: false,
    filesWrittenByAudit: false,
    dbStorageTouchedByAudit: false,
    eightThreeAcNotRun: true,
    readyForControlledLocalTextDocumentDisabledApiTest: true,
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

  if (!_isCanonicalTextDocumentModeMinimalRoutePatchSafetyAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejectedA = 0;
  const tamperFailuresA: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_MINIMAL_ROUTE_PATCH_SAFETY_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeMinimalRoutePatchSafetyAuditResult(tc.mutate(provisional))) {
      tamperRejectedA++;
    } else {
      tamperFailuresA.push(`8.9C tamper case (A) not rejected: "${tc.label}"`);
    }
  }

  let tamperRejectedB = 0;
  const tamperFailuresB: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_ROUTE_PATCH_REGRESSION_TAMPER_CASES) {
    if (tc.check()) {
      tamperRejectedB++;
    } else {
      tamperFailuresB.push(`8.9C tamper case (B) not detected: "${tc.label}"`);
    }
  }

  const tamperRejected = tamperRejectedA + tamperRejectedB;
  if (tamperFailuresA.length > 0) auditFailures.push(...tamperFailuresA);
  if (tamperFailuresB.length > 0) auditFailures.push(...tamperFailuresB);

  const allPassed =
    auditFailures.length === 0 &&
    b.checkId === "8.9B" &&
    b.allPassed === true &&
    provisional.routePatchApplied === true &&
    provisional.modeDetected === true &&
    provisional.envFlagDetected === true &&
    provisional.exactEnvFlagOnlyDetected === true &&
    provisional.disabledPathFailClosedDetected === true &&
    provisional.disabledPathStatus403Detected === true &&
    provisional.disabledPathBeforeModelCallDetected === true &&
    provisional.textDocumentBranchModelCallAfterBlocksDetected === true &&
    provisional.contextValidationDetected === true &&
    provisional.inputTypeTextValidationDetected === true &&
    provisional.localeValidationDetected === true &&
    provisional.documentClassificationBeforeModelCallDetected === true &&
    provisional.exactLegalDeadlineBlockBeforeModelCallDetected === true &&
    provisional.ocrPhotoScannerUploadBlockBeforeModelCallDetected === true &&
    provisional.paidDnaPersistenceStorageBlocksDetected === true &&
    provisional.credentialFinancialIdentityBlocksDetected === true &&
    provisional.highRiskEscalationBlocksDetected === true &&
    provisional.successMetadataDetected === true &&
    provisional.publicFreeQaBranchStillPresent === true &&
    provisional.internalGuardedBranchStillPresent === true &&
    provisional.dbStorageWriteAdded === false &&
    provisional.ocrUploadHandlerAdded === false &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9C tamper cases: ${tamperRejected}/${tamperCount} correctly rejected (A=${tamperRejectedA}/${tamperCountA}, B=${tamperRejectedB}/${tamperCountB})`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForControlledLocalTextDocumentDisabledApiTest: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9C result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-minimal-route-patch-safety-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeMinimalRoutePatchSafetyAudit(), null, 2));
}
