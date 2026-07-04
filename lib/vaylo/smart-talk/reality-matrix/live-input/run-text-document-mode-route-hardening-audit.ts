/**
 * PHASE 8.9G — Text Document Mode Route Hardening Audit
 *
 * Static, local, read-only source-text hardening audit for the real
 * Text Document Mode implementation in app/api/smart-talk/route.ts.
 *
 * This file reads route.ts as STATIC TEXT via fs.readFileSync (the only
 * permitted I/O in this phase) and validates markers, safety-gate ordering,
 * and forbidden-marker absence using pure string/regex analysis. It does
 * NOT import or invoke route.ts, does not call runSmartTalk, does not call
 * any model/OpenAI/fetch, does not read process.env for authorization, does
 * not write files (other than this audit file itself, created once by the
 * developer/agent — the audit function performs no writes at runtime), and
 * does not touch DB/storage.
 *
 * This phase does NOT enable text document runtime, photo/OCR runtime,
 * public runtime, production, or go-live. It does not run 8.3AC and does
 * not touch tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runTextDocumentModeControlledLocalRegressionPack } from "./run-text-document-mode-controlled-local-regression-pack";

// ─── Static route markers/anchors ─────────────────────────────────────────────

const TEXT_DOC_BRANCH_START = "if (o.mode === TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE)";
const TEXT_DOC_BRANCH_END = "// ── End Phase 8.9C Text Document Mode controlled runtime branch";
const NARROW_DETECTOR_NAME = "detectExplicitPaidDocumentModeActivationForTextDocumentMode";
const BROAD_DETECTOR_NAME = "detectClientPaidDocumentModeActivation";

const INTERNAL_BRANCH_MARKERS: readonly string[] = [
  "FREE_QA_INTERNAL_RUNTIME_MODE",
  "free_qa_internal_scoped_patch",
  "FREE_QA_INTERNAL_RUNTIME_GUARD",
  "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY",
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

const NORMAL_DOCUMENT_WORDS: readonly string[] = [
  "Dokument",
  "Schreiben",
  "Krankenkasse",
  "Versicherungsstatus",
  "Bescheid",
  "Sehr geehrte",
  "Bitte prüfen",
];

const EXPLICIT_PAID_ACTIVATION_PHRASES: readonly string[] = [
  "kostenpflichtigen Dokumentenmodus aktivieren",
  "paid document mode",
  "Chcem zaplatiť za dokumentový režim",
  "Aktivovať platený dokumentový režim",
  "I want to pay for document mode",
];

const DANGEROUS_READINESS_PATTERN =
  /readyForProduction\s*:\s*true|readyForGoLive\s*:\s*true|readyForTextDocumentRuntime\s*:\s*true|readyForPhotoOcrRuntime\s*:\s*true|readyForPublicRuntime\s*:\s*true|productionEnabled\s*:\s*true|goLiveEnabled\s*:\s*true|publicReleaseEnabled\s*:\s*true|textDocumentRuntimeEnabled\s*:\s*true|photoOcrRuntimeEnabled\s*:\s*true|publicReleaseAuthorized\s*:\s*true/i;

const DANGEROUS_DB_STORAGE_PATTERN =
  /supabase|fs\.writeFile|\.from\(["'`][\w-]+["'`]\)\.(insert|update|upsert|delete)\(|persistenceEnabled\s*:\s*true|dbWriteEnabled\s*:\s*true/i;

const OCR_UPLOAD_HANDLER_PATTERN =
  /tesseract|google\.cloud\.vision|createReadStream|multer|formidable|busboy|\.readAsDataURL|new FileReader\(/i;

const PAID_ENTITLEMENT_ACTIVATION_PATTERN =
  /activateEntitlement|grantEntitlement|entitlementActivated\s*=\s*true|paidEntitlementGranted/i;

const VAYLO_DNA_WRITE_READ_PATTERN = /vaylo[_-]?dna[_-]?(write|save|read|fetch)\(/i;

const EIGHT_THREE_AC_RUN_MARKER_PATTERN = /8\.3AC[_-]?(run|executed|invoked)\s*[:=]\s*true/i;

// ─── Static analysis (pure — operates only on a source string argument) ───────

interface CheckResult {
  label: string;
  passed: boolean;
}

interface RouteSourceAnalysis {
  textDocumentBranchDetected: boolean;
  modeDetected: boolean;
  envFlagDetected: boolean;
  exactEnvFlagOnlyDetected: boolean;
  disabledPathFailClosedDetected: boolean;
  disabledPathStatus403Detected: boolean;
  disabledPathBeforeModelCallDetected: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  internalSecretHeaderStillPresent: boolean;
  internalGuardPhraseStillPresent: boolean;
  freeQaPublicEnvFlagStillPresent: boolean;
  contextValidationDetected: boolean;
  inputTypeValidationDetected: boolean;
  textStringValidationDetected: boolean;
  minMaxTextLengthValidationDetected: boolean;
  localeValidationDetected: boolean;
  slovakLocaleAllowedDetected: boolean;
  documentClassificationBeforeModelCallDetected: boolean;
  narrowPaidActivationDetectorDetected: boolean;
  broadPaidDetectorNotUsedInTextDocumentBranch: boolean;
  normalDocumentWordsNotPaidTriggers: boolean;
  explicitPaidActivationPhrasesDetected: boolean;
  runSmartTalkPresentInBranch: boolean;
  textDocumentInputTypeTextPassedDetected: boolean;
  successModeDetected: boolean;
  successTextDocumentMetaDetected: boolean;
  successMetadataKeysDetected: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  paidEntitlementActivationAdded: boolean;
  vayloDnaAccessAdded: boolean;
  dangerousReadinessDetected: boolean;
  eightThreeAcRunMarkerDetected: boolean;
  noOpenAiSdkImportInRoute: boolean;
  noFetchCallInRoute: boolean;
  orderingChecks: CheckResult[];
  forbiddenMarkerChecks: CheckResult[];
  routeMarkers: CheckResult[];
}

function extractSlice(source: string, startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  if (start === -1) return "";
  const end = source.indexOf(endMarker, start);
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

function extractNarrowDetectorRegexTest(source: string): ((sample: string) => boolean) | null {
  const fnIdx = source.indexOf(`function ${NARROW_DETECTOR_NAME}(`);
  if (fnIdx === -1) return null;
  const bodyStart = source.indexOf("return /", fnIdx);
  if (bodyStart === -1) return null;
  const regexStart = bodyStart + "return ".length;
  const regexEnd = source.indexOf(".test(", regexStart);
  if (regexEnd === -1) return null;
  const pattern = source.slice(regexStart, regexEnd).trim();
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

function orderedBefore(slice: string, marker: string, pivot: string): boolean {
  const mi = slice.indexOf(marker);
  const pi = slice.indexOf(pivot);
  return mi !== -1 && pi !== -1 && mi < pi;
}

function analyzeRouteSource(source: string): RouteSourceAnalysis {
  const slice = extractSlice(source, TEXT_DOC_BRANCH_START, TEXT_DOC_BRANCH_END);
  const runSmartTalkPivot = "runSmartTalk(";

  const textDocumentBranchDetected = slice.length > 0;
  const modeDetected =
    source.includes("TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE") &&
    source.includes('"text_document_controlled_runtime"');
  const envFlagDetected =
    source.includes("TEXT_DOCUMENT_MODE_ENV_FLAG") &&
    source.includes('"SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED"');
  const exactEnvFlagOnlyDetected = /process\.env\[TEXT_DOCUMENT_MODE_ENV_FLAG\]\s*===\s*"true"/.test(
    slice,
  );

  const disabledPathFailClosedDetected = slice.includes('"text_document_mode_disabled"');
  const disabledPathStatus403Detected = /"text_document_mode_disabled"\s*,\s*403\)/.test(slice);
  const disabledPathBeforeModelCallDetected = orderedBefore(
    slice,
    '"text_document_mode_disabled"',
    runSmartTalkPivot,
  );

  const publicFreeQaBranchStillPresent =
    source.includes("FREE_QA_PUBLIC_BETA_MODE") && source.includes('"free_qa_public_beta"');
  const internalGuardedBranchStillPresent = INTERNAL_BRANCH_MARKERS.every((m) => source.includes(m));
  const internalSecretHeaderStillPresent = source.includes("x-vaylo-internal-runtime-secret");
  const internalGuardPhraseStillPresent = source.includes(
    "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY",
  );
  const freeQaPublicEnvFlagStillPresent =
    source.includes("FREE_QA_PUBLIC_RUNTIME_ENV_FLAG") &&
    source.includes('"SMART_TALK_FREE_QA_PUBLIC_ENABLED"');

  const contextValidationDetected = slice.includes(
    'o.context !== "anonymous" && o.context !== "controlled_test"',
  );
  const inputTypeValidationDetected = slice.includes('o.inputType !== "text"');
  const textStringValidationDetected = slice.includes('typeof o.text !== "string"');
  const minMaxTextLengthValidationDetected =
    slice.includes("text.length < MIN_TEXT") && slice.includes("text.length > MAX_TEXT");
  const localeValidationDetected =
    slice.includes("ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)") &&
    slice.includes('typeof o.locale !== "string"');
  const slovakLocaleAllowedDetected = /ALLOWED_LOCALES\s*=\s*new Set<SmartTalkLocale>\(\[[^\]]*"sk"[^\]]*\]\)/.test(
    source,
  );

  const documentClassificationBeforeModelCallDetected = orderedBefore(
    slice,
    "isDocumentLikeSignalPresent(text)",
    runSmartTalkPivot,
  );

  const narrowPaidActivationDetectorDetected = source.includes(
    `function ${NARROW_DETECTOR_NAME}(text: string): boolean`,
  );
  // Only treat an actual `if (detectClientPaidDocumentModeActivation(o))` guard
  // call as "used" — a documentation comment that merely mentions the broad
  // detector's name (e.g. explaining why it is NOT used here) must not count.
  const broadPaidDetectorCallPattern = new RegExp(
    `if\\s*\\(\\s*${BROAD_DETECTOR_NAME}\\(o\\)\\s*\\)`,
  );
  const broadPaidDetectorNotUsedInTextDocumentBranch = !broadPaidDetectorCallPattern.test(slice);

  const narrowTest = extractNarrowDetectorRegexTest(source);
  const normalDocumentWordsNotPaidTriggers =
    narrowTest !== null && NORMAL_DOCUMENT_WORDS.every((w) => narrowTest(w) === false);
  const explicitPaidActivationPhrasesDetected =
    narrowTest !== null && EXPLICIT_PAID_ACTIVATION_PHRASES.every((p) => narrowTest(p) === true);

  const runSmartTalkPresentInBranch = slice.includes(runSmartTalkPivot);
  const textDocumentInputTypeTextPassedDetected = /runSmartTalk\(\{\s*text,\s*locale,\s*inputType:\s*"text"\s*\}\)/.test(
    slice,
  );
  const successModeDetected = slice.includes("mode: TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE");
  const successTextDocumentMetaDetected = slice.includes(
    "textDocumentMeta: buildTextDocumentModeSafetyFlags(true)",
  );

  const safetyFlagsFnIdx = source.indexOf("function buildTextDocumentModeSafetyFlags(");
  const safetyFlagsFnBody =
    safetyFlagsFnIdx === -1 ? "" : source.slice(safetyFlagsFnIdx, source.indexOf("}", source.indexOf("as const", safetyFlagsFnIdx)) + 1);
  const successMetadataKeysDetected = SUCCESS_METADATA_KEYS.every((k) => safetyFlagsFnBody.includes(k));

  const dbStorageWriteAdded = DANGEROUS_DB_STORAGE_PATTERN.test(source);
  const ocrUploadHandlerAdded = OCR_UPLOAD_HANDLER_PATTERN.test(source);
  const paidEntitlementActivationAdded = PAID_ENTITLEMENT_ACTIVATION_PATTERN.test(source);
  const vayloDnaAccessAdded = VAYLO_DNA_WRITE_READ_PATTERN.test(source);
  const dangerousReadinessDetected = DANGEROUS_READINESS_PATTERN.test(source);
  const eightThreeAcRunMarkerDetected = EIGHT_THREE_AC_RUN_MARKER_PATTERN.test(source);
  const noOpenAiSdkImportInRoute = !/from\s+["']openai["']/i.test(source);
  const noFetchCallInRoute = !/[^.\w]fetch\(/i.test(source);

  const orderingBlockers: readonly { label: string; marker: string }[] = [
    { label: "OCR/photo block before model call", marker: "detectOcrPhotoRequest(o)" },
    { label: "scanner upload block before model call", marker: "detectScannerUploadRequest(o)" },
    { label: "file upload block before model call", marker: "detectFileUploadRequest(o)" },
    {
      label: "explicit paid activation block before model call",
      marker: `${NARROW_DETECTOR_NAME}(text)`,
    },
    { label: "Vaylo DNA block before model call", marker: "detectVayloDnaSaveRequest(o)" },
    { label: "persistence/storage block before model call", marker: "detectPersistenceStorageRequest(o)" },
    { label: "credential/API key/password block before model call", marker: "detectCredentialSecretText(text)" },
    {
      label: "financial/IBAN/payment block before model call",
      marker: "detectFinancialAccountOrPaymentAuthorizationText(text)",
    },
    { label: "identity document number block before model call", marker: "detectIdentityDocumentNumberText(text)" },
    { label: "exact legal deadline block before model call", marker: "detectExactLegalDeadlineRequest(text)" },
    { label: "binding legal advice block before model call", marker: "detectBindingLegalAdviceRequest(text)" },
    {
      label: "official filing/Widerspruch/Einspruch generation block before model call",
      marker: "detectOfficialFilingGenerationRequest(text)",
    },
    {
      label: "high-risk legal/court/police/medical/tax block before model call",
      marker: "detectHighRiskCourtPoliceMedicalTaxSignal(text)",
    },
    { label: "non-document/no document signal block before model call", marker: "isDocumentLikeSignalPresent(text)" },
    { label: "disabled path before model call", marker: '"text_document_mode_disabled"' },
  ];
  const orderingChecks: CheckResult[] = orderingBlockers.map((b) => ({
    label: b.label,
    passed: orderedBefore(slice, b.marker, runSmartTalkPivot),
  }));

  const forbiddenMarkerChecks: CheckResult[] = [
    { label: "no Supabase/DB insert-update-upsert-delete added", passed: !dbStorageWriteAdded },
    { label: "no OCR/photo handler added", passed: !ocrUploadHandlerAdded },
    { label: "no scanner/upload handler added", passed: !ocrUploadHandlerAdded },
    { label: "no file upload parser added", passed: !ocrUploadHandlerAdded },
    { label: "no paid entitlement activation added", passed: !paidEntitlementActivationAdded },
    { label: "no Vaylo DNA write/read added", passed: !vayloDnaAccessAdded },
    { label: "no public release authorization added", passed: !dangerousReadinessDetected },
    { label: "no production/go-live authorization added", passed: !dangerousReadinessDetected },
    { label: "no 8.3AC run marker added", passed: !eightThreeAcRunMarkerDetected },
  ];

  const routeMarkers: CheckResult[] = [
    { label: "mode text_document_controlled_runtime", passed: modeDetected },
    { label: "env flag SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED", passed: envFlagDetected },
    { label: "exact env flag true gate", passed: exactEnvFlagOnlyDetected },
    { label: "disabled path 403 text_document_mode_disabled", passed: disabledPathFailClosedDetected && disabledPathStatus403Detected },
    { label: "public Free Q&A branch present", passed: publicFreeQaBranchStillPresent },
    { label: "internal guarded branch present", passed: internalGuardedBranchStillPresent },
    { label: "internal secret header present", passed: internalSecretHeaderStillPresent },
    { label: "internal guard phrase present", passed: internalGuardPhraseStillPresent },
    { label: "narrow paid activation detector present", passed: narrowPaidActivationDetectorDetected },
    { label: "broad paid detector not used in Text Document Mode branch", passed: broadPaidDetectorNotUsedInTextDocumentBranch },
    { label: "success metadata keys present", passed: successMetadataKeysDetected },
    { label: "runSmartTalk present in branch", passed: runSmartTalkPresentInBranch },
  ];

  return {
    textDocumentBranchDetected,
    modeDetected,
    envFlagDetected,
    exactEnvFlagOnlyDetected,
    disabledPathFailClosedDetected,
    disabledPathStatus403Detected,
    disabledPathBeforeModelCallDetected,
    publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent,
    internalSecretHeaderStillPresent,
    internalGuardPhraseStillPresent,
    freeQaPublicEnvFlagStillPresent,
    contextValidationDetected,
    inputTypeValidationDetected,
    textStringValidationDetected,
    minMaxTextLengthValidationDetected,
    localeValidationDetected,
    slovakLocaleAllowedDetected,
    documentClassificationBeforeModelCallDetected,
    narrowPaidActivationDetectorDetected,
    broadPaidDetectorNotUsedInTextDocumentBranch,
    normalDocumentWordsNotPaidTriggers,
    explicitPaidActivationPhrasesDetected,
    runSmartTalkPresentInBranch,
    textDocumentInputTypeTextPassedDetected,
    successModeDetected,
    successTextDocumentMetaDetected,
    successMetadataKeysDetected,
    dbStorageWriteAdded,
    ocrUploadHandlerAdded,
    paidEntitlementActivationAdded,
    vayloDnaAccessAdded,
    dangerousReadinessDetected,
    eightThreeAcRunMarkerDetected,
    noOpenAiSdkImportInRoute,
    noFetchCallInRoute,
    orderingChecks,
    forbiddenMarkerChecks,
    routeMarkers,
  };
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeRouteHardeningAuditResult {
  checkId: "8.9G";
  allPassed: boolean;
  sourceRegressionCommit: "3019ee6";
  sourceRegressionPhase: "8.9F";
  routeHardeningAuditOnly: true;
  routeFile: "app/api/smart-talk/route.ts";
  textDocumentBranchDetected: boolean;
  modeDetected: boolean;
  envFlagDetected: boolean;
  exactEnvFlagOnlyDetected: boolean;
  disabledPathFailClosedDetected: boolean;
  disabledPathStatus403Detected: boolean;
  disabledPathBeforeModelCallDetected: boolean;
  publicFreeQaBranchStillPresent: boolean;
  internalGuardedBranchStillPresent: boolean;
  internalSecretHeaderStillPresent: boolean;
  internalGuardPhraseStillPresent: boolean;
  inputValidationDetected: boolean;
  localeValidationDetected: boolean;
  documentClassificationBeforeModelCallDetected: boolean;
  allRequiredBlockersBeforeModelCallDetected: boolean;
  ocrPhotoBlockBeforeModelCallDetected: boolean;
  scannerUploadFileUploadBlockBeforeModelCallDetected: boolean;
  paidActivationBlockBeforeModelCallDetected: boolean;
  dnaPersistenceStorageBlocksBeforeModelCallDetected: boolean;
  exactLegalDeadlineBlockBeforeModelCallDetected: boolean;
  bindingLegalAdviceBlockBeforeModelCallDetected: boolean;
  officialFilingGenerationBlockBeforeModelCallDetected: boolean;
  credentialFinancialIdentityBlocksBeforeModelCallDetected: boolean;
  highRiskLegalMedicalTaxBlockBeforeModelCallDetected: boolean;
  nonDocumentSignalBlockBeforeModelCallDetected: boolean;
  narrowPaidActivationDetectorDetected: boolean;
  broadPaidDetectorNotUsedInTextDocumentBranch: boolean;
  normalDocumentWordsNotPaidTriggers: boolean;
  explicitPaidActivationPhrasesDetected: boolean;
  textDocumentRunSmartTalkAfterBlocksDetected: boolean;
  textDocumentSuccessMetadataDetected: boolean;
  dbStorageWriteAdded: boolean;
  ocrUploadHandlerAdded: boolean;
  paidEntitlementActivationAdded: boolean;
  vayloDnaAccessAdded: boolean;
  publicReleaseAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  openAiSdkImportedByAudit: false;
  fetchUsedByAudit: false;
  processEnvReadForAuthorizationByAudit: false;
  filesWrittenByAudit: false;
  dbStorageTouchedByAudit: false;
  eightThreeAcNotRun: true;
  readyForTextDocumentModeControlledInternalRuntimeReview: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  routeMarkers: CheckResult[];
  orderingChecks: CheckResult[];
  forbiddenMarkerChecks: CheckResult[];
  notes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeRouteHardeningAuditResult(
  r: TextDocumentModeRouteHardeningAuditResult,
): boolean {
  if (r.checkId !== "8.9G") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceRegressionCommit !== "3019ee6") return false;
  if (r.sourceRegressionPhase !== "8.9F") return false;
  if (r.routeHardeningAuditOnly !== true) return false;
  if (r.routeFile !== "app/api/smart-talk/route.ts") return false;
  if (r.textDocumentBranchDetected !== true) return false;
  if (r.modeDetected !== true) return false;
  if (r.envFlagDetected !== true) return false;
  if (r.exactEnvFlagOnlyDetected !== true) return false;
  if (r.disabledPathFailClosedDetected !== true) return false;
  if (r.disabledPathStatus403Detected !== true) return false;
  if (r.disabledPathBeforeModelCallDetected !== true) return false;
  if (r.publicFreeQaBranchStillPresent !== true) return false;
  if (r.internalGuardedBranchStillPresent !== true) return false;
  if (r.internalSecretHeaderStillPresent !== true) return false;
  if (r.internalGuardPhraseStillPresent !== true) return false;
  if (r.inputValidationDetected !== true) return false;
  if (r.localeValidationDetected !== true) return false;
  if (r.documentClassificationBeforeModelCallDetected !== true) return false;
  if (r.allRequiredBlockersBeforeModelCallDetected !== true) return false;
  if (r.ocrPhotoBlockBeforeModelCallDetected !== true) return false;
  if (r.scannerUploadFileUploadBlockBeforeModelCallDetected !== true) return false;
  if (r.paidActivationBlockBeforeModelCallDetected !== true) return false;
  if (r.dnaPersistenceStorageBlocksBeforeModelCallDetected !== true) return false;
  if (r.exactLegalDeadlineBlockBeforeModelCallDetected !== true) return false;
  if (r.bindingLegalAdviceBlockBeforeModelCallDetected !== true) return false;
  if (r.officialFilingGenerationBlockBeforeModelCallDetected !== true) return false;
  if (r.credentialFinancialIdentityBlocksBeforeModelCallDetected !== true) return false;
  if (r.highRiskLegalMedicalTaxBlockBeforeModelCallDetected !== true) return false;
  if (r.nonDocumentSignalBlockBeforeModelCallDetected !== true) return false;
  if (r.narrowPaidActivationDetectorDetected !== true) return false;
  if (r.broadPaidDetectorNotUsedInTextDocumentBranch !== true) return false;
  if (r.normalDocumentWordsNotPaidTriggers !== true) return false;
  if (r.explicitPaidActivationPhrasesDetected !== true) return false;
  if (r.textDocumentRunSmartTalkAfterBlocksDetected !== true) return false;
  if (r.textDocumentSuccessMetadataDetected !== true) return false;
  if (r.dbStorageWriteAdded !== false) return false;
  if (r.ocrUploadHandlerAdded !== false) return false;
  if (r.paidEntitlementActivationAdded !== false) return false;
  if (r.vayloDnaAccessAdded !== false) return false;
  if (r.publicReleaseAuthorizedNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.openAiSdkImportedByAudit !== false) return false;
  if (r.fetchUsedByAudit !== false) return false;
  if (r.processEnvReadForAuthorizationByAudit !== false) return false;
  if (r.filesWrittenByAudit !== false) return false;
  if (r.dbStorageTouchedByAudit !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForTextDocumentModeControlledInternalRuntimeReview !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.routeMarkers) || r.routeMarkers.length === 0) return false;
  if (!Array.isArray(r.orderingChecks) || r.orderingChecks.length === 0) return false;
  if (!Array.isArray(r.forbiddenMarkerChecks) || r.forbiddenMarkerChecks.length === 0) return false;
  if (r.routeMarkers.some((c) => c.passed !== true)) return false;
  if (r.orderingChecks.some((c) => c.passed !== true)) return false;
  if (r.forbiddenMarkerChecks.some((c) => c.passed !== true)) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89GMutation = (
  r: TextDocumentModeRouteHardeningAuditResult,
) => TextDocumentModeRouteHardeningAuditResult;
interface Tamper89GCase {
  label: string;
  mutate: Tamper89GMutation;
}

const TEXT_DOCUMENT_MODE_ROUTE_HARDENING_AUDIT_TAMPER_CASES: Tamper89GCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9F" as "8.9G" }) },
  { label: "allPassed false (source 8.9F not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceRegressionCommit wrong (source commit is not 3019ee6)", mutate: (r) => ({ ...r, sourceRegressionCommit: "0000000" as "3019ee6" }) },
  { label: "sourceRegressionPhase wrong", mutate: (r) => ({ ...r, sourceRegressionPhase: "8.9E-CLOSURE" as "8.9F" }) },
  { label: "routeHardeningAuditOnly false", mutate: (r) => ({ ...r, routeHardeningAuditOnly: false as true }) },
  { label: "routeFile wrong", mutate: (r) => ({ ...r, routeFile: "app/api/other/route.ts" as "app/api/smart-talk/route.ts" }) },
  { label: "textDocumentBranchDetected false (text document branch disappears)", mutate: (r) => ({ ...r, textDocumentBranchDetected: false }) },
  { label: "modeDetected false (mode string changes)", mutate: (r) => ({ ...r, modeDetected: false }) },
  { label: "envFlagDetected false (env flag changes)", mutate: (r) => ({ ...r, envFlagDetected: false }) },
  { label: "exactEnvFlagOnlyDetected false (exact env true gate disappears)", mutate: (r) => ({ ...r, exactEnvFlagOnlyDetected: false }) },
  { label: "disabledPathFailClosedDetected false (disabled path code changes)", mutate: (r) => ({ ...r, disabledPathFailClosedDetected: false }) },
  { label: "disabledPathStatus403Detected false (disabled path status changes)", mutate: (r) => ({ ...r, disabledPathStatus403Detected: false }) },
  { label: "disabledPathBeforeModelCallDetected false (disabled path can happen after model call)", mutate: (r) => ({ ...r, disabledPathBeforeModelCallDetected: false }) },
  { label: "publicFreeQaBranchStillPresent false (public Free Q&A branch disappears)", mutate: (r) => ({ ...r, publicFreeQaBranchStillPresent: false }) },
  { label: "internalGuardedBranchStillPresent false (internal guarded branch disappears)", mutate: (r) => ({ ...r, internalGuardedBranchStillPresent: false }) },
  { label: "internalSecretHeaderStillPresent false (internal secret header disappears)", mutate: (r) => ({ ...r, internalSecretHeaderStillPresent: false }) },
  { label: "internalGuardPhraseStillPresent false (internal guard phrase disappears)", mutate: (r) => ({ ...r, internalGuardPhraseStillPresent: false }) },
  { label: "inputValidationDetected false (context/inputType/text validation disappears)", mutate: (r) => ({ ...r, inputValidationDetected: false }) },
  { label: "localeValidationDetected false (locale validation disappears)", mutate: (r) => ({ ...r, localeValidationDetected: false }) },
  { label: "documentClassificationBeforeModelCallDetected false (document classification disappears)", mutate: (r) => ({ ...r, documentClassificationBeforeModelCallDetected: false }) },
  { label: "allRequiredBlockersBeforeModelCallDetected false (a required blocker disappears)", mutate: (r) => ({ ...r, allRequiredBlockersBeforeModelCallDetected: false }) },
  { label: "ocrPhotoBlockBeforeModelCallDetected false (a required blocker is after runSmartTalk)", mutate: (r) => ({ ...r, ocrPhotoBlockBeforeModelCallDetected: false }) },
  { label: "scannerUploadFileUploadBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, scannerUploadFileUploadBlockBeforeModelCallDetected: false }) },
  { label: "paidActivationBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, paidActivationBlockBeforeModelCallDetected: false }) },
  { label: "dnaPersistenceStorageBlocksBeforeModelCallDetected false", mutate: (r) => ({ ...r, dnaPersistenceStorageBlocksBeforeModelCallDetected: false }) },
  { label: "exactLegalDeadlineBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, exactLegalDeadlineBlockBeforeModelCallDetected: false }) },
  { label: "bindingLegalAdviceBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, bindingLegalAdviceBlockBeforeModelCallDetected: false }) },
  { label: "officialFilingGenerationBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, officialFilingGenerationBlockBeforeModelCallDetected: false }) },
  { label: "credentialFinancialIdentityBlocksBeforeModelCallDetected false", mutate: (r) => ({ ...r, credentialFinancialIdentityBlocksBeforeModelCallDetected: false }) },
  { label: "highRiskLegalMedicalTaxBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, highRiskLegalMedicalTaxBlockBeforeModelCallDetected: false }) },
  { label: "nonDocumentSignalBlockBeforeModelCallDetected false", mutate: (r) => ({ ...r, nonDocumentSignalBlockBeforeModelCallDetected: false }) },
  { label: "narrowPaidActivationDetectorDetected false (narrow paid detector disappears)", mutate: (r) => ({ ...r, narrowPaidActivationDetectorDetected: false }) },
  { label: "broadPaidDetectorNotUsedInTextDocumentBranch false (broad paid detector is used in the branch)", mutate: (r) => ({ ...r, broadPaidDetectorNotUsedInTextDocumentBranch: false }) },
  { label: "normalDocumentWordsNotPaidTriggers false (normal document words become paid triggers)", mutate: (r) => ({ ...r, normalDocumentWordsNotPaidTriggers: false }) },
  { label: "explicitPaidActivationPhrasesDetected false (explicit paid activation phrases disappear)", mutate: (r) => ({ ...r, explicitPaidActivationPhrasesDetected: false }) },
  { label: "textDocumentRunSmartTalkAfterBlocksDetected false", mutate: (r) => ({ ...r, textDocumentRunSmartTalkAfterBlocksDetected: false }) },
  { label: "textDocumentSuccessMetadataDetected false (success metadata disappears)", mutate: (r) => ({ ...r, textDocumentSuccessMetadataDetected: false }) },
  { label: "dbStorageWriteAdded true (DB/storage writes are added)", mutate: (r) => ({ ...r, dbStorageWriteAdded: true }) },
  { label: "ocrUploadHandlerAdded true (OCR/upload handlers are added)", mutate: (r) => ({ ...r, ocrUploadHandlerAdded: true }) },
  { label: "paidEntitlementActivationAdded true (paid entitlement activation is added)", mutate: (r) => ({ ...r, paidEntitlementActivationAdded: true }) },
  { label: "vayloDnaAccessAdded true (Vaylo DNA access is added)", mutate: (r) => ({ ...r, vayloDnaAccessAdded: true }) },
  { label: "publicReleaseAuthorizedNow true (public release becomes authorized)", mutate: (r) => ({ ...r, publicReleaseAuthorizedNow: true as false }) },
  { label: "productionAuthorizedNow true (production becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "liveRouteInvocationPerformed true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "openAiSdkImportedByAudit true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByAudit: true as false }) },
  { label: "fetchUsedByAudit true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsedByAudit: true as false }) },
  { label: "processEnvReadForAuthorizationByAudit true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByAudit: true as false }) },
  { label: "filesWrittenByAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByAudit: true as false }) },
  { label: "dbStorageTouchedByAudit true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByAudit: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForTextDocumentModeControlledInternalRuntimeReview false when should be true", mutate: (r) => ({ ...r, readyForTextDocumentModeControlledInternalRuntimeReview: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "routeMarkers emptied", mutate: (r) => ({ ...r, routeMarkers: [] }) },
  { label: "orderingChecks emptied", mutate: (r) => ({ ...r, orderingChecks: [] }) },
  { label: "forbiddenMarkerChecks emptied", mutate: (r) => ({ ...r, forbiddenMarkerChecks: [] }) },
  {
    label: "routeMarkers tampered to show a failing marker as passed",
    mutate: (r) => ({
      ...r,
      routeMarkers: r.routeMarkers.map((c, i) => (i === 0 ? { ...c, passed: false } : c)),
    }),
  },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported route hardening audit runner ──────────────────────────────────

export function runTextDocumentModeRouteHardeningAudit(): TextDocumentModeRouteHardeningAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.9F runner as source of truth ─────────────────────────────────────
  const f = runTextDocumentModeControlledLocalRegressionPack();
  if (f.checkId !== "8.9F") auditFailures.push(`8.9F checkId mismatch: expected "8.9F", got "${f.checkId}"`);
  if (f.allPassed !== true) auditFailures.push("8.9F allPassed is not true");
  if (f.sourceEnabledClosureCommit !== "9f231e2") auditFailures.push("8.9F sourceEnabledClosureCommit mismatch");
  if (f.sourceEnabledClosurePhase !== "8.9E-CLOSURE") auditFailures.push("8.9F sourceEnabledClosurePhase mismatch");
  if (f.allowedRegressionCaseCount < 12) auditFailures.push("8.9F allowedRegressionCaseCount below 12");
  if (f.blockedRegressionCaseCount < 28) auditFailures.push("8.9F blockedRegressionCaseCount below 28");
  if (f.readyForTextDocumentModeRouteHardeningAudit !== true)
    auditFailures.push("8.9F readyForTextDocumentModeRouteHardeningAudit is not true");
  if (f.readyForTextDocumentRuntime !== false) auditFailures.push("8.9F readyForTextDocumentRuntime is not false");
  if (f.readyForPhotoOcrRuntime !== false) auditFailures.push("8.9F readyForPhotoOcrRuntime is not false");
  if (f.readyForPublicRuntime !== false) auditFailures.push("8.9F readyForPublicRuntime is not false");
  if (f.readyForProduction !== false) auditFailures.push("8.9F readyForProduction is not false");
  if (f.readyForGoLive !== false) auditFailures.push("8.9F readyForGoLive is not false");
  if (f.tamperRejected !== f.tamperCount) auditFailures.push("8.9F own tamper count mismatch");

  // ── Read app/api/smart-talk/route.ts as static source text (only I/O here) ──
  let source = "";
  try {
    const routePath = path.join(process.cwd(), "app", "api", "smart-talk", "route.ts");
    source = fs.readFileSync(routePath, "utf8");
  } catch (err) {
    auditFailures.push(`failed to read app/api/smart-talk/route.ts: ${String(err)}`);
  }

  const analysis = analyzeRouteSource(source);

  if (!analysis.textDocumentBranchDetected) auditFailures.push("text document branch not detected");
  if (!analysis.modeDetected) auditFailures.push("mode marker missing or changed");
  if (!analysis.envFlagDetected) auditFailures.push("env flag marker missing or changed");
  if (!analysis.exactEnvFlagOnlyDetected) auditFailures.push("exact env true gate missing");
  if (!analysis.disabledPathFailClosedDetected) auditFailures.push("disabled path fail-closed code missing");
  if (!analysis.disabledPathStatus403Detected) auditFailures.push("disabled path status 403 missing");
  if (!analysis.disabledPathBeforeModelCallDetected) auditFailures.push("disabled path not confirmed before model call");
  if (!analysis.publicFreeQaBranchStillPresent) auditFailures.push("public Free Q&A branch markers missing");
  if (!analysis.internalGuardedBranchStillPresent) auditFailures.push("internal guarded branch markers missing");
  if (!analysis.internalSecretHeaderStillPresent) auditFailures.push("internal secret header marker missing");
  if (!analysis.internalGuardPhraseStillPresent) auditFailures.push("internal guard phrase marker missing");
  if (!analysis.freeQaPublicEnvFlagStillPresent) auditFailures.push("Free Q&A public env flag marker missing");
  if (!analysis.contextValidationDetected) auditFailures.push("context validation missing");
  if (!analysis.inputTypeValidationDetected) auditFailures.push("inputType validation missing");
  if (!analysis.textStringValidationDetected) auditFailures.push("text string validation missing");
  if (!analysis.minMaxTextLengthValidationDetected) auditFailures.push("min/max text length validation missing");
  if (!analysis.localeValidationDetected) auditFailures.push("locale validation missing");
  if (!analysis.slovakLocaleAllowedDetected) auditFailures.push("Slovak sk locale no longer allowed");
  if (!analysis.documentClassificationBeforeModelCallDetected) auditFailures.push("document classification not confirmed before model call");
  if (!analysis.narrowPaidActivationDetectorDetected) auditFailures.push("narrow paid activation detector missing");
  if (!analysis.broadPaidDetectorNotUsedInTextDocumentBranch) auditFailures.push("broad paid detector used in text document branch");
  if (!analysis.normalDocumentWordsNotPaidTriggers) auditFailures.push("normal document words trigger paid activation");
  if (!analysis.explicitPaidActivationPhrasesDetected) auditFailures.push("explicit paid activation phrases not detected");
  if (!analysis.runSmartTalkPresentInBranch) auditFailures.push("runSmartTalk not present in text document branch");
  if (!analysis.textDocumentInputTypeTextPassedDetected) auditFailures.push("inputType text not confirmed passed to runSmartTalk");
  if (!analysis.successModeDetected) auditFailures.push("success response mode marker missing");
  if (!analysis.successTextDocumentMetaDetected) auditFailures.push("success response textDocumentMeta marker missing");
  if (!analysis.successMetadataKeysDetected) auditFailures.push("success metadata keys incomplete");
  if (analysis.dbStorageWriteAdded) auditFailures.push("DB/storage write markers detected");
  if (analysis.ocrUploadHandlerAdded) auditFailures.push("OCR/upload handler markers detected");
  if (analysis.paidEntitlementActivationAdded) auditFailures.push("paid entitlement activation markers detected");
  if (analysis.vayloDnaAccessAdded) auditFailures.push("Vaylo DNA access markers detected");
  if (analysis.dangerousReadinessDetected) auditFailures.push("dangerous production/go-live/public-release readiness markers detected");
  if (analysis.eightThreeAcRunMarkerDetected) auditFailures.push("8.3AC run marker detected");
  if (!analysis.noOpenAiSdkImportInRoute) auditFailures.push("direct OpenAI SDK import detected in route");
  if (!analysis.noFetchCallInRoute) auditFailures.push("fetch() call detected in route");
  if (analysis.orderingChecks.some((c) => !c.passed))
    auditFailures.push(
      `ordering check(s) failed: ${analysis.orderingChecks.filter((c) => !c.passed).map((c) => c.label).join(", ")}`,
    );
  if (analysis.forbiddenMarkerChecks.some((c) => !c.passed))
    auditFailures.push(
      `forbidden marker check(s) failed: ${analysis.forbiddenMarkerChecks.filter((c) => !c.passed).map((c) => c.label).join(", ")}`,
    );
  if (analysis.routeMarkers.some((c) => !c.passed))
    auditFailures.push(
      `route marker check(s) failed: ${analysis.routeMarkers.filter((c) => !c.passed).map((c) => c.label).join(", ")}`,
    );

  const allRequiredBlockersBeforeModelCallDetected = analysis.orderingChecks.every((c) => c.passed);

  const findOrdering = (label: string): boolean =>
    analysis.orderingChecks.find((c) => c.label === label)?.passed === true;

  const notes: string[] = [
    "IN-01: 8.9G statically audits the real app/api/smart-talk/route.ts Text Document Mode implementation via fs.readFileSync source-text analysis only; no live route/model/fetch/env-authorization/DB call is performed.",
    `IN-02: 8.9F confirmed — checkId=${f.checkId}, allPassed=${f.allPassed}, allowedRegressionCaseCount=${f.allowedRegressionCaseCount}, blockedRegressionCaseCount=${f.blockedRegressionCaseCount}, readyForTextDocumentModeRouteHardeningAudit=${f.readyForTextDocumentModeRouteHardeningAudit}.`,
    `IN-03: all ${analysis.orderingChecks.length} pre-model-call safety gates (disabled path + 14 content blockers) were confirmed to occur before the runSmartTalk() call within the text_document_controlled_runtime branch.`,
    "IN-04: the narrow explicit-paid-activation detector (detectExplicitPaidDocumentModeActivationForTextDocumentMode) is confirmed present and used in place of the broad body-field detector (detectClientPaidDocumentModeActivation) for paid-mode blocking in this branch; normal document words (Dokument, Schreiben, Krankenkasse, Versicherungsstatus, Bescheid, Sehr geehrte, Bitte prüfen) do not trigger it, while the 5 required explicit paid-activation phrases do.",
    "IN-05: the public Free Q&A beta branch, the internal guarded Free Q&A branch (including its internal secret header and guard phrase), and the Free Q&A public env flag all remain present and unmodified by this audit.",
    "IN-06: the success response for this branch confirmed to include mode=text_document_controlled_runtime, textDocumentMeta, and all 18 required safety metadata keys (via buildTextDocumentModeSafetyFlags).",
    "IN-07: no DB/storage writes, OCR/upload handlers, paid entitlement activation, Vaylo DNA access, or production/go-live/public-release readiness markers were detected anywhere in the route source.",
    "IN-08: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_ROUTE_HARDENING_AUDIT_TAMPER_CASES.length;

  const provisional: TextDocumentModeRouteHardeningAuditResult = {
    checkId: "8.9G",
    allPassed: true,
    sourceRegressionCommit: "3019ee6",
    sourceRegressionPhase: "8.9F",
    routeHardeningAuditOnly: true,
    routeFile: "app/api/smart-talk/route.ts",
    textDocumentBranchDetected: analysis.textDocumentBranchDetected,
    modeDetected: analysis.modeDetected,
    envFlagDetected: analysis.envFlagDetected,
    exactEnvFlagOnlyDetected: analysis.exactEnvFlagOnlyDetected,
    disabledPathFailClosedDetected: analysis.disabledPathFailClosedDetected,
    disabledPathStatus403Detected: analysis.disabledPathStatus403Detected,
    disabledPathBeforeModelCallDetected: analysis.disabledPathBeforeModelCallDetected,
    publicFreeQaBranchStillPresent: analysis.publicFreeQaBranchStillPresent,
    internalGuardedBranchStillPresent: analysis.internalGuardedBranchStillPresent,
    internalSecretHeaderStillPresent: analysis.internalSecretHeaderStillPresent,
    internalGuardPhraseStillPresent: analysis.internalGuardPhraseStillPresent,
    inputValidationDetected:
      analysis.contextValidationDetected &&
      analysis.inputTypeValidationDetected &&
      analysis.textStringValidationDetected &&
      analysis.minMaxTextLengthValidationDetected,
    localeValidationDetected: analysis.localeValidationDetected && analysis.slovakLocaleAllowedDetected,
    documentClassificationBeforeModelCallDetected: analysis.documentClassificationBeforeModelCallDetected,
    allRequiredBlockersBeforeModelCallDetected,
    ocrPhotoBlockBeforeModelCallDetected: findOrdering("OCR/photo block before model call"),
    scannerUploadFileUploadBlockBeforeModelCallDetected:
      findOrdering("scanner upload block before model call") && findOrdering("file upload block before model call"),
    paidActivationBlockBeforeModelCallDetected: findOrdering("explicit paid activation block before model call"),
    dnaPersistenceStorageBlocksBeforeModelCallDetected:
      findOrdering("Vaylo DNA block before model call") &&
      findOrdering("persistence/storage block before model call"),
    exactLegalDeadlineBlockBeforeModelCallDetected: findOrdering("exact legal deadline block before model call"),
    bindingLegalAdviceBlockBeforeModelCallDetected: findOrdering("binding legal advice block before model call"),
    officialFilingGenerationBlockBeforeModelCallDetected: findOrdering(
      "official filing/Widerspruch/Einspruch generation block before model call",
    ),
    credentialFinancialIdentityBlocksBeforeModelCallDetected:
      findOrdering("credential/API key/password block before model call") &&
      findOrdering("financial/IBAN/payment block before model call") &&
      findOrdering("identity document number block before model call"),
    highRiskLegalMedicalTaxBlockBeforeModelCallDetected: findOrdering(
      "high-risk legal/court/police/medical/tax block before model call",
    ),
    nonDocumentSignalBlockBeforeModelCallDetected: findOrdering(
      "non-document/no document signal block before model call",
    ),
    narrowPaidActivationDetectorDetected: analysis.narrowPaidActivationDetectorDetected,
    broadPaidDetectorNotUsedInTextDocumentBranch: analysis.broadPaidDetectorNotUsedInTextDocumentBranch,
    normalDocumentWordsNotPaidTriggers: analysis.normalDocumentWordsNotPaidTriggers,
    explicitPaidActivationPhrasesDetected: analysis.explicitPaidActivationPhrasesDetected,
    textDocumentRunSmartTalkAfterBlocksDetected:
      analysis.runSmartTalkPresentInBranch && allRequiredBlockersBeforeModelCallDetected,
    textDocumentSuccessMetadataDetected:
      analysis.successModeDetected && analysis.successTextDocumentMetaDetected && analysis.successMetadataKeysDetected,
    dbStorageWriteAdded: analysis.dbStorageWriteAdded,
    ocrUploadHandlerAdded: analysis.ocrUploadHandlerAdded,
    paidEntitlementActivationAdded: analysis.paidEntitlementActivationAdded,
    vayloDnaAccessAdded: analysis.vayloDnaAccessAdded,
    publicReleaseAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    openAiSdkImportedByAudit: false,
    fetchUsedByAudit: false,
    processEnvReadForAuthorizationByAudit: false,
    filesWrittenByAudit: false,
    dbStorageTouchedByAudit: false,
    eightThreeAcNotRun: true,
    readyForTextDocumentModeControlledInternalRuntimeReview: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    routeMarkers: analysis.routeMarkers,
    orderingChecks: analysis.orderingChecks,
    forbiddenMarkerChecks: analysis.forbiddenMarkerChecks,
    notes,
  };

  if (!_isCanonicalTextDocumentModeRouteHardeningAuditResult(provisional)) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_ROUTE_HARDENING_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeRouteHardeningAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9G tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed =
    auditFailures.length === 0 &&
    f.checkId === "8.9F" &&
    f.allPassed === true &&
    provisional.textDocumentBranchDetected === true &&
    provisional.modeDetected === true &&
    provisional.envFlagDetected === true &&
    provisional.exactEnvFlagOnlyDetected === true &&
    provisional.disabledPathFailClosedDetected === true &&
    provisional.disabledPathStatus403Detected === true &&
    provisional.disabledPathBeforeModelCallDetected === true &&
    provisional.publicFreeQaBranchStillPresent === true &&
    provisional.internalGuardedBranchStillPresent === true &&
    provisional.internalSecretHeaderStillPresent === true &&
    provisional.internalGuardPhraseStillPresent === true &&
    provisional.inputValidationDetected === true &&
    provisional.localeValidationDetected === true &&
    provisional.documentClassificationBeforeModelCallDetected === true &&
    provisional.allRequiredBlockersBeforeModelCallDetected === true &&
    provisional.narrowPaidActivationDetectorDetected === true &&
    provisional.broadPaidDetectorNotUsedInTextDocumentBranch === true &&
    provisional.normalDocumentWordsNotPaidTriggers === true &&
    provisional.explicitPaidActivationPhrasesDetected === true &&
    provisional.textDocumentRunSmartTalkAfterBlocksDetected === true &&
    provisional.textDocumentSuccessMetadataDetected === true &&
    provisional.dbStorageWriteAdded === false &&
    provisional.ocrUploadHandlerAdded === false &&
    provisional.paidEntitlementActivationAdded === false &&
    provisional.vayloDnaAccessAdded === false &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9G tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    `8.9G ordering checks: ${analysis.orderingChecks.filter((c) => c.passed).length}/${analysis.orderingChecks.length} passed`,
    `8.9G forbidden marker checks: ${analysis.forbiddenMarkerChecks.filter((c) => c.passed).length}/${analysis.forbiddenMarkerChecks.length} passed`,
    `8.9G route marker checks: ${analysis.routeMarkers.filter((c) => c.passed).length}/${analysis.routeMarkers.length} passed`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForTextDocumentModeControlledInternalRuntimeReview: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9G result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-route-hardening-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeRouteHardeningAudit(), null, 2));
}
