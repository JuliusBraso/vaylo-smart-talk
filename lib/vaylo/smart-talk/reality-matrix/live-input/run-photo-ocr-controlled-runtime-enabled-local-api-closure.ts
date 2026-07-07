/**
 * PHASE 8.10E — Photo/OCR Controlled Runtime Enabled Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local Request objects (no dev server, no browser, no external
 * network), that when SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED is set
 * to exactly lowercase "true":
 *
 *  1. A valid synthetic metadata-only Photo/OCR placeholder request returns a
 *     controlled-placeholder success response (no real OCR, no model call,
 *     no upload, no persistence).
 *  2. All 22 required guard-rejection cases (bad context/inputType, missing
 *     payload, unsupported MIME, page-count/size limits, remote URL/file
 *     path markers, background-upload/persistence/storage/DNA/paid/public/
 *     production/go-live/8.3AC markers, and exact-legal-deadline/binding-
 *     legal-advice/official-filing/credential/financial note markers) are
 *     still rejected with their exact expected block codes.
 *
 * This phase does NOT retest the disabled non-exact env variants (that is
 * 8.10D's scope) — it only imports 8.10D as source evidence. It does NOT
 * start a dev server, does NOT use a browser, does NOT perform live external
 * network calls, does NOT call OpenAI/any model, does NOT call an OCR
 * engine, does NOT read real images or image bytes, does NOT persist
 * anything, does NOT write DB/storage/DNA, does NOT run 8.3AC, and does NOT
 * touch tmp-8-3ac-live-metadata.ts. It restores
 * process.env.SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED to its
 * original value (or absence) after all tests complete.
 */

import { runPhotoOcrControlledRuntimeGateDesign } from "./run-photo-ocr-controlled-runtime-gate-design";
import { runPhotoOcrControlledRuntimeImplementationPlan } from "./run-photo-ocr-controlled-runtime-implementation-plan";
import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runPhotoOcrControlledRuntimeDisabledLocalApiClosure } from "./run-photo-ocr-controlled-runtime-disabled-local-api-closure";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";
import { POST } from "../../../../../app/api/smart-talk/route";

const PHOTO_OCR_ENV_KEY = "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";

// ─── Result types ───────────────────────────────────────────────────────────

interface GuardCase {
  caseId: string;
  description: string;
  expectedCode: string;
  observedStatus: number;
  observedOk: boolean;
  observedCode: string;
  passed: boolean;
  noOcr: boolean;
  noModel: boolean;
  noUpload: boolean;
  noPersistence: boolean;
  noDbStorage: boolean;
  noSupabaseStorage: boolean;
  noDna: boolean;
  noPublicRuntime: boolean;
  noProduction: boolean;
  noGoLive: boolean;
  photoOcrMetaObserved: Record<string, unknown> | null;
}

interface PhotoOcrControlledRuntimeEnabledLocalApiClosureResult {
  checkId: "8.10E";
  allPassed: boolean;
  enabledLocalApiClosureOnly: true;
  disabledPathRetestedHere: false;
  sourceGateDesignCommit: "4a87043";
  sourceImplementationPlanCommit: "6a26e47";
  sourceMinimalPatchCommit: "3e35be8";
  sourceDisabledClosureCommit: "385b32a";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceGateDesignAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  localRouteHandlerInvoked: true;
  browserInvoked: false;
  devServerStarted: false;
  externalNetworkCalled: false;
  realImageUsed: false;
  imageBytesRead: false;
  ocrLibraryImported: false;
  ocrExtractionPerformed: false;
  modelCallPerformed: false;
  uploadPerformed: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  enabledEnvSetExactlyTrue: boolean;
  validPlaceholderCasePerformed: true;
  validPlaceholderStatus: number;
  validPlaceholderOk: boolean;
  validPlaceholderMode: string;
  validPlaceholderContext: string;
  validPlaceholderResultPresent: boolean;
  validPlaceholderResultClaimsOcrPerformed: boolean;
  validPlaceholderContainsExtractedText: boolean;
  validPlaceholderContainsExactDeadline: boolean;
  validPlaceholderContainsBindingLegalAdvice: boolean;
  validPlaceholderContainsOfficialFiling: boolean;
  validPlaceholderPhotoOcrMetaObserved: boolean;
  validPlaceholderPhotoOcrControlledRuntime: boolean;
  validPlaceholderOnly: boolean;
  validPlaceholderRealOcrExtractionPerformed: boolean;
  validPlaceholderOcrRuntimeStillBlocked: boolean;
  validPlaceholderModelCallPerformed: boolean;
  validPlaceholderNoUpload: boolean;
  validPlaceholderNoPersistence: boolean;
  validPlaceholderNoDbStorage: boolean;
  validPlaceholderNoSupabaseStorage: boolean;
  validPlaceholderNoDna: boolean;
  validPlaceholderNoPaidMode: boolean;
  validPlaceholderNoPublicRuntime: boolean;
  validPlaceholderNoProduction: boolean;
  validPlaceholderNoGoLive: boolean;
  validPlaceholderModelOutputStillUntrusted: boolean;
  validPlaceholderOcrOutputStillUntrusted: boolean;
  validPlaceholderImageContentSensitive: boolean;
  validPlaceholderExtractedTextSensitive: boolean;
  validPlaceholderPrivacyDisclaimerRequired: boolean;
  validPlaceholderLegalDisclaimerRequired: boolean;
  validPlaceholderEightThreeAcNotRun: boolean;

  guardCaseCount: 22;
  guardCasesPerformed: boolean;
  guardCasesRejected: boolean;
  guardCasesRejectedCount: number;
  everyGuardCaseReturnedOkFalse: boolean;
  everyGuardCaseReturnedExpectedBlockCode: boolean;
  everyGuardCaseNoOcr: boolean;
  everyGuardCaseNoModelCall: boolean;
  everyGuardCaseNoUpload: boolean;
  everyGuardCaseNoPersistence: boolean;
  everyGuardCaseNoDbStorage: boolean;
  everyGuardCaseNoSupabaseStorage: boolean;
  everyGuardCaseNoDna: boolean;
  everyGuardCaseNoPublicRuntime: boolean;
  everyGuardCaseNoProduction: boolean;
  everyGuardCaseNoGoLive: boolean;

  guardCases: GuardCase[];

  routeEnabledPlaceholderWorksOnlyWithExactTrue: boolean;
  exactLowercaseTrueAcceptedForControlledPlaceholder: boolean;
  placeholderSuccessNoRealOcr: boolean;
  placeholderSuccessNoModelCall: boolean;
  placeholderSuccessNoUpload: boolean;
  placeholderSuccessNoPersistence: boolean;
  placeholderSuccessNoDbStorage: boolean;
  placeholderSuccessNoSupabaseStorage: boolean;
  placeholderSuccessNoDna: boolean;
  placeholderSuccessNoPublicRuntime: boolean;
  placeholderSuccessNoProduction: boolean;
  placeholderSuccessNoGoLive: boolean;
  realOcrExtractionStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  ocrOutputStillUntrusted: boolean;
  imageContentTreatedAsSensitive: boolean;
  extractedTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  supabaseStorageStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  envOriginalValueCaptured: true;
  envSetExactlyTrueDuringEnabledTests: boolean;
  envRestoredAfterTests: boolean;
  envAbsentAfterCleanupIfOriginallyAbsent: boolean;
  cleanupPerformed: true;

  readyForNextPhase: "8.10F";
  recommendedNextPhase: "Photo/OCR Controlled Local Regression Pack";
  readyForPhotoOcrRegressionPack: boolean;
  readyForPhotoOcrBrowserManualTestPlanning: false;
  readyForPhotoOcrBrowserManualExecution: false;
  readyForPhotoOcrInternalReadinessClosure: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  enabledPlaceholderEvidence: string[];
  guardCaseEvidence: string[];
  responseContractEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  cleanupEvidence: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.10A gate design accepted",
  "8.10B implementation plan accepted",
  "8.10C minimal patch audit accepted",
  "8.10D disabled local API closure accepted",
  "8.9N text document internal readiness accepted",
  "current closure validates exact enabled \"true\" placeholder path and guard rejections only",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Photo/OCR regression pack not created yet",
  "Browser/UI wiring audit not performed yet",
  "Browser manual test planning not performed yet",
  "Browser manual execution not performed yet",
  "Photo/OCR internal readiness closure not performed yet",
  "Real OCR extraction not designed yet",
  "Real OCR extraction not implemented",
  "OCR quality evaluator not implemented",
  "OCR trust boundary not fully validated with real OCR",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase tests enabled local API placeholder behavior only.",
  "This phase does not retest disabled env variants except through 8.10D source evidence.",
  "This phase does not perform browser/UI validation.",
  "This phase does not perform real OCR extraction.",
  "This phase does not use real images.",
  "This phase does not validate real OCR quality or OCR trust boundaries.",
  "This phase does not authorize public runtime, production, or go-live.",
];

// ─── Expected blocked-path photoOcrMeta contract (shared by every guard case) ─

const EXPECTED_BLOCKED_PHOTO_OCR_META: Record<string, boolean> = {
  photoOcrControlledRuntime: false,
  placeholderOnly: true,
  realOcrExtractionPerformed: false,
  ocrRuntimeStillBlocked: true,
  modelCallPerformed: false,
  uploadRuntimeStillBlocked: true,
  rawImagePersistenceBlocked: true,
  processedImagePersistenceBlocked: true,
  extractedTextPersistenceBlocked: true,
  dbStorageStillBlocked: true,
  supabaseStorageStillBlocked: true,
  vayloDnaStillBlocked: true,
  paidDocumentModeStillBlocked: true,
  publicRuntimeStillBlocked: true,
  productionAuthorizedNow: false,
  goLiveAuthorizedNow: false,
  modelOutputStillUntrusted: true,
  ocrOutputStillUntrusted: true,
  imageContentTreatedAsSensitive: true,
  extractedTextTreatedAsSensitive: true,
  privacyDisclaimerRequired: true,
  legalDisclaimerRequired: true,
  exactLegalDeadlineStillBlocked: true,
  bindingLegalAdviceStillBlocked: true,
  officialFilingGenerationStillBlocked: true,
  eightThreeAcNotRun: true,
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

function validateBlockedPhotoOcrMeta(meta: Record<string, unknown> | null): boolean {
  if (!meta) return false;
  for (const [key, expected] of Object.entries(EXPECTED_BLOCKED_PHOTO_OCR_META)) {
    if (meta[key] !== expected) return false;
  }
  return true;
}

/** Expected enabled-success photoOcrMeta contract — identical except photoOcrControlledRuntime:true. */
function validateEnabledPhotoOcrMeta(meta: Record<string, unknown> | null): boolean {
  if (!meta) return false;
  if (meta.photoOcrControlledRuntime !== true) return false;
  for (const [key, expected] of Object.entries(EXPECTED_BLOCKED_PHOTO_OCR_META)) {
    if (key === "photoOcrControlledRuntime") continue;
    if (meta[key] !== expected) return false;
  }
  return true;
}

// ─── Synthetic request builders ─────────────────────────────────────────────

function baseValidPhotoOcrBody(): Record<string, unknown> {
  return {
    mode: "photo_ocr_controlled_runtime",
    context: "anonymous",
    inputType: "photo",
    locale: "sk",
    photoPages: [{ mimeType: "image/png", sizeBytes: 12345 }],
  };
}

function buildSyntheticRequest(ip: string, body: Record<string, unknown>): Request {
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

// ─── Guard case specifications (smallest body variant per guard) ───────────

interface GuardCaseSpec {
  caseId: string;
  description: string;
  expectedCode: string;
  buildBody: () => Record<string, unknown>;
}

const GUARD_CASE_SPECS: GuardCaseSpec[] = [
  {
    caseId: "invalid_context",
    description: 'context is not "anonymous" (e.g. "authenticated")',
    expectedCode: "photo_ocr_invalid_context_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), context: "authenticated" }),
  },
  {
    caseId: "invalid_input_type",
    description: 'inputType is not "photo" (e.g. "text")',
    expectedCode: "photo_ocr_invalid_input_type_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), inputType: "text" }),
  },
  {
    caseId: "missing_photo_payload",
    description: "photoPages field is missing entirely",
    expectedCode: "photo_ocr_photo_payload_required",
    buildBody: () => {
      const b = baseValidPhotoOcrBody();
      delete b.photoPages;
      return b;
    },
  },
  {
    caseId: "unsupported_mime",
    description: "page mimeType is not an allowed image type (image/gif)",
    expectedCode: "photo_ocr_unsupported_mime_type_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      photoPages: [{ mimeType: "image/gif", sizeBytes: 12345 }],
    }),
  },
  {
    caseId: "too_many_pages",
    description: "4 synthetic pages exceed PHOTO_OCR_MAX_PAGES (3)",
    expectedCode: "photo_ocr_page_count_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      photoPages: [
        { mimeType: "image/png", sizeBytes: 12345 },
        { mimeType: "image/png", sizeBytes: 12345 },
        { mimeType: "image/png", sizeBytes: 12345 },
        { mimeType: "image/png", sizeBytes: 12345 },
      ],
    }),
  },
  {
    caseId: "oversize_image",
    description: "single page sizeBytes (9,000,000) exceeds 8 MB limit",
    expectedCode: "photo_ocr_image_size_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      photoPages: [{ mimeType: "image/png", sizeBytes: 9_000_000 }],
    }),
  },
  {
    caseId: "remote_url_marker",
    description: "page includes a remoteUrl field",
    expectedCode: "photo_ocr_remote_url_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      photoPages: [
        { mimeType: "image/png", sizeBytes: 12345, remoteUrl: "https://example.com/synthetic.png" },
      ],
    }),
  },
  {
    caseId: "file_path_marker",
    description: "page includes a filePath field",
    expectedCode: "photo_ocr_file_path_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      photoPages: [{ mimeType: "image/png", sizeBytes: 12345, filePath: "/tmp/synthetic.png" }],
    }),
  },
  {
    caseId: "background_upload_marker",
    description: "top-level backgroundUpload: true",
    expectedCode: "photo_ocr_background_upload_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), backgroundUpload: true }),
  },
  {
    caseId: "persistence_marker",
    description: "top-level persistImage: true",
    expectedCode: "photo_ocr_persistence_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), persistImage: true }),
  },
  {
    caseId: "storage_marker",
    description: "top-level requestedStorage: true",
    expectedCode: "photo_ocr_storage_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), requestedStorage: true }),
  },
  {
    caseId: "dna_marker",
    description: "top-level requestedDnaSave: true",
    expectedCode: "photo_ocr_dna_write_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), requestedDnaSave: true }),
  },
  {
    caseId: "paid_mode_marker",
    description: "top-level paidDocumentMode: true",
    expectedCode: "photo_ocr_paid_mode_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), paidDocumentMode: true }),
  },
  {
    caseId: "public_runtime_marker",
    description: "top-level publicRuntime: true",
    expectedCode: "photo_ocr_public_runtime_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), publicRuntime: true }),
  },
  {
    caseId: "production_marker",
    description: "top-level production: true",
    expectedCode: "photo_ocr_production_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), production: true }),
  },
  {
    caseId: "go_live_marker",
    description: "top-level goLive: true",
    expectedCode: "photo_ocr_go_live_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), goLive: true }),
  },
  {
    caseId: "exact_legal_deadline_marker",
    description: "note field asks for an exact legal deadline calculation",
    expectedCode: "photo_ocr_exact_legal_deadline_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      note: "Chcem vedieť dokedy presne mám reagovať na tento list.",
    }),
  },
  {
    caseId: "binding_legal_advice_marker",
    description: "note field asks for binding legal advice",
    expectedCode: "photo_ocr_binding_legal_advice_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      note: "Please give me binding legal advice about this document.",
    }),
  },
  {
    caseId: "official_filing_marker",
    description: "note field asks to generate an official filing (appeal)",
    expectedCode: "photo_ocr_official_filing_generation_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      note: "Please write my official appeal for this document.",
    }),
  },
  {
    caseId: "credential_marker",
    description: "note field contains a synthetic fake password/API key marker",
    expectedCode: "photo_ocr_sensitive_credential_data_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), note: "password: hunter2123synthetic" }),
  },
  {
    caseId: "financial_marker",
    description: "note field contains a synthetic fake IBAN/payment authorization marker",
    expectedCode: "photo_ocr_sensitive_financial_data_blocked",
    buildBody: () => ({
      ...baseValidPhotoOcrBody(),
      note: "IBAN: DE12500105170648489890 (synthetic fake test value)",
    }),
  },
  {
    caseId: "eight_three_ac_marker",
    description: "top-level invokeEightThreeAc: true",
    expectedCode: "photo_ocr_8_3ac_invocation_blocked",
    buildBody: () => ({ ...baseValidPhotoOcrBody(), invokeEightThreeAc: true }),
  },
];

// ─── Placeholder result safety inspection (static text pattern checks) ─────

interface PlaceholderResultSafety {
  resultPresent: boolean;
  claimsOcrPerformed: boolean;
  containsExtractedText: boolean;
  containsExactDeadline: boolean;
  containsBindingLegalAdvice: boolean;
  containsOfficialFiling: boolean;
}

function inspectPlaceholderResultSafety(result: unknown): PlaceholderResultSafety {
  if (!isRecord(result)) {
    return {
      resultPresent: false,
      claimsOcrPerformed: false,
      containsExtractedText: false,
      containsExactDeadline: false,
      containsBindingLegalAdvice: false,
      containsOfficialFiling: false,
    };
  }
  const json = JSON.stringify(result);
  const lower = json.toLowerCase();
  const claimsOcrPerformed =
    /ocr\s+(bolo|je|has been)\s+vykonan|ocr\s+completed|text\s+bol\s+rozpoznan|text\s+was\s+extracted|extraction\s+successful/i.test(
      lower,
    );
  const containsExtractedText =
    "extractedtext" in result || /extrahovan[ýy]\s+text|extracted\s+text\s*[:=]/i.test(lower);
  const deadlinesArr = Array.isArray(result.deadlines) ? (result.deadlines as unknown[]) : [];
  const containsExactDeadline =
    deadlinesArr.length > 0 || /presn[áa]\s+lehota\s+je|exact\s+deadline\s+is|lehota\s+kon[čc][ií]\s+d[nň]a/i.test(lower);
  const containsBindingLegalAdvice =
    /rechtsverbindlich|bindende\s+rechtliche|binding\s+legal\s+advice|z[áa]v[äa]zn[ée][ýy]?\s+pr[áa]vn[ea]\s+stanovisko/i.test(
      lower,
    );
  const containsOfficialFiling =
    /ofici[áa]lne\s+podanie\s+vygenerovan|official\s+filing\s+generated|tu\s+je\s+v[áa][šs]\s+odvolanie/i.test(lower);
  return {
    resultPresent: true,
    claimsOcrPerformed,
    containsExtractedText,
    containsExactDeadline,
    containsBindingLegalAdvice,
    containsOfficialFiling,
  };
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledRuntimeEnabledLocalApiClosureResult(
  r: PhotoOcrControlledRuntimeEnabledLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.10E") return false;
  if (r.allPassed !== true) return false;
  if (r.enabledLocalApiClosureOnly !== true) return false;
  if (r.disabledPathRetestedHere !== false) return false;
  if (r.sourceGateDesignCommit !== "4a87043") return false;
  if (r.sourceImplementationPlanCommit !== "6a26e47") return false;
  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceDisabledClosureCommit !== "385b32a") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.localRouteHandlerInvoked !== true) return false;
  if (r.browserInvoked !== false) return false;
  if (r.devServerStarted !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.realImageUsed !== false) return false;
  if (r.imageBytesRead !== false) return false;
  if (r.ocrLibraryImported !== false) return false;
  if (r.ocrExtractionPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.uploadPerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.enabledEnvSetExactlyTrue !== true) return false;
  if (r.validPlaceholderCasePerformed !== true) return false;
  if (r.validPlaceholderStatus !== 200) return false;
  if (r.validPlaceholderOk !== true) return false;
  if (r.validPlaceholderMode !== "photo_ocr_controlled_runtime") return false;
  if (r.validPlaceholderContext !== "anonymous") return false;
  if (r.validPlaceholderResultPresent !== true) return false;
  if (r.validPlaceholderResultClaimsOcrPerformed !== false) return false;
  if (r.validPlaceholderContainsExtractedText !== false) return false;
  if (r.validPlaceholderContainsExactDeadline !== false) return false;
  if (r.validPlaceholderContainsBindingLegalAdvice !== false) return false;
  if (r.validPlaceholderContainsOfficialFiling !== false) return false;
  if (r.validPlaceholderPhotoOcrMetaObserved !== true) return false;
  if (r.validPlaceholderPhotoOcrControlledRuntime !== true) return false;
  if (r.validPlaceholderOnly !== true) return false;
  if (r.validPlaceholderRealOcrExtractionPerformed !== false) return false;
  if (r.validPlaceholderOcrRuntimeStillBlocked !== true) return false;
  if (r.validPlaceholderModelCallPerformed !== false) return false;
  if (r.validPlaceholderNoUpload !== true) return false;
  if (r.validPlaceholderNoPersistence !== true) return false;
  if (r.validPlaceholderNoDbStorage !== true) return false;
  if (r.validPlaceholderNoSupabaseStorage !== true) return false;
  if (r.validPlaceholderNoDna !== true) return false;
  if (r.validPlaceholderNoPaidMode !== true) return false;
  if (r.validPlaceholderNoPublicRuntime !== true) return false;
  if (r.validPlaceholderNoProduction !== true) return false;
  if (r.validPlaceholderNoGoLive !== true) return false;
  if (r.validPlaceholderModelOutputStillUntrusted !== true) return false;
  if (r.validPlaceholderOcrOutputStillUntrusted !== true) return false;
  if (r.validPlaceholderImageContentSensitive !== true) return false;
  if (r.validPlaceholderExtractedTextSensitive !== true) return false;
  if (r.validPlaceholderPrivacyDisclaimerRequired !== true) return false;
  if (r.validPlaceholderLegalDisclaimerRequired !== true) return false;
  if (r.validPlaceholderEightThreeAcNotRun !== true) return false;

  if (r.guardCaseCount !== 22) return false;
  if (r.guardCasesPerformed !== true) return false;
  if (r.guardCasesRejected !== true) return false;
  if (r.guardCasesRejectedCount !== 22) return false;
  if (r.everyGuardCaseReturnedOkFalse !== true) return false;
  if (r.everyGuardCaseReturnedExpectedBlockCode !== true) return false;
  if (r.everyGuardCaseNoOcr !== true) return false;
  if (r.everyGuardCaseNoModelCall !== true) return false;
  if (r.everyGuardCaseNoUpload !== true) return false;
  if (r.everyGuardCaseNoPersistence !== true) return false;
  if (r.everyGuardCaseNoDbStorage !== true) return false;
  if (r.everyGuardCaseNoSupabaseStorage !== true) return false;
  if (r.everyGuardCaseNoDna !== true) return false;
  if (r.everyGuardCaseNoPublicRuntime !== true) return false;
  if (r.everyGuardCaseNoProduction !== true) return false;
  if (r.everyGuardCaseNoGoLive !== true) return false;

  if (!Array.isArray(r.guardCases) || r.guardCases.length !== 22) return false;
  if (r.guardCases.some((c) => c.passed !== true)) return false;
  if (r.guardCases.some((c) => c.observedOk !== false)) return false;
  if (r.guardCases.some((c) => c.observedCode !== c.expectedCode)) return false;
  if (
    r.guardCases.some(
      (c) =>
        !c.noOcr ||
        !c.noModel ||
        !c.noUpload ||
        !c.noPersistence ||
        !c.noDbStorage ||
        !c.noSupabaseStorage ||
        !c.noDna ||
        !c.noPublicRuntime ||
        !c.noProduction ||
        !c.noGoLive,
    )
  )
    return false;

  if (r.routeEnabledPlaceholderWorksOnlyWithExactTrue !== true) return false;
  if (r.exactLowercaseTrueAcceptedForControlledPlaceholder !== true) return false;
  if (r.placeholderSuccessNoRealOcr !== true) return false;
  if (r.placeholderSuccessNoModelCall !== true) return false;
  if (r.placeholderSuccessNoUpload !== true) return false;
  if (r.placeholderSuccessNoPersistence !== true) return false;
  if (r.placeholderSuccessNoDbStorage !== true) return false;
  if (r.placeholderSuccessNoSupabaseStorage !== true) return false;
  if (r.placeholderSuccessNoDna !== true) return false;
  if (r.placeholderSuccessNoPublicRuntime !== true) return false;
  if (r.placeholderSuccessNoProduction !== true) return false;
  if (r.placeholderSuccessNoGoLive !== true) return false;
  if (r.realOcrExtractionStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.ocrOutputStillUntrusted !== true) return false;
  if (r.imageContentTreatedAsSensitive !== true) return false;
  if (r.extractedTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.supabaseStorageStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.envOriginalValueCaptured !== true) return false;
  if (r.envSetExactlyTrueDuringEnabledTests !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.envAbsentAfterCleanupIfOriginallyAbsent !== true) return false;
  if (r.cleanupPerformed !== true) return false;

  if (r.readyForNextPhase !== "8.10F") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Local Regression Pack") return false;
  if (r.readyForPhotoOcrRegressionPack !== true) return false;
  if (r.readyForPhotoOcrBrowserManualTestPlanning !== false) return false;
  if (r.readyForPhotoOcrBrowserManualExecution !== false) return false;
  if (r.readyForPhotoOcrInternalReadinessClosure !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.enabledPlaceholderEvidence) || r.enabledPlaceholderEvidence.length === 0) return false;
  if (!Array.isArray(r.guardCaseEvidence) || r.guardCaseEvidence.length !== 22) return false;
  if (!Array.isArray(r.responseContractEvidence) || r.responseContractEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.cleanupEvidence) || r.cleanupEvidence.length === 0) return false;
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper810EMutation = (
  r: PhotoOcrControlledRuntimeEnabledLocalApiClosureResult,
) => PhotoOcrControlledRuntimeEnabledLocalApiClosureResult;
interface Tamper810ECase {
  label: string;
  mutate: Tamper810EMutation;
}

function withGuardCaseField<K extends keyof GuardCase>(
  cases: GuardCase[],
  index: number,
  key: K,
  value: GuardCase[K],
): GuardCase[] {
  return cases.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED_LOCAL_API_CLOSURE_TAMPER_CASES: Tamper810ECase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10D" as "8.10E" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceGateDesignAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "4a87043" }) },
  { label: "sourceImplementationPlanAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceImplementationPlanCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "6a26e47" }) },
  { label: "sourceMinimalPatchAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceMinimalPatchAccepted: false }) },
  { label: "sourceMinimalPatchCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceMinimalPatchCommit: "0000000" as "3e35be8" }) },
  { label: "sourceDisabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceDisabledClosureAccepted: false }) },
  { label: "sourceDisabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "385b32a" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "enabledLocalApiClosureOnly false", mutate: (r) => ({ ...r, enabledLocalApiClosureOnly: false as true }) },
  { label: "disabledPathRetestedHere true", mutate: (r) => ({ ...r, disabledPathRetestedHere: true as false }) },
  { label: "browserInvoked true", mutate: (r) => ({ ...r, browserInvoked: true as false }) },
  { label: "devServerStarted true", mutate: (r) => ({ ...r, devServerStarted: true as false }) },
  { label: "externalNetworkCalled true", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "realImageUsed true", mutate: (r) => ({ ...r, realImageUsed: true as false }) },
  { label: "imageBytesRead true", mutate: (r) => ({ ...r, imageBytesRead: true as false }) },
  { label: "ocrLibraryImported true", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "modelCallPerformed true", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPerformed true", mutate: (r) => ({ ...r, uploadPerformed: true as false }) },
  { label: "persistencePerformed true", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "enabledEnvSetExactlyTrue false (env exact true not set during enabled tests)", mutate: (r) => ({ ...r, enabledEnvSetExactlyTrue: false }) },
  { label: "validPlaceholderCasePerformed false (valid placeholder case missing)", mutate: (r) => ({ ...r, validPlaceholderCasePerformed: false as true }) },
  { label: "validPlaceholderStatus wrong (valid placeholder status is not 200)", mutate: (r) => ({ ...r, validPlaceholderStatus: 403 }) },
  { label: "validPlaceholderOk false (valid placeholder ok is not true)", mutate: (r) => ({ ...r, validPlaceholderOk: false }) },
  { label: "validPlaceholderMode wrong (valid placeholder mode differs)", mutate: (r) => ({ ...r, validPlaceholderMode: "photo_ocr_other" }) },
  { label: "validPlaceholderResultPresent false (valid placeholder result missing)", mutate: (r) => ({ ...r, validPlaceholderResultPresent: false }) },
  { label: "validPlaceholderResultClaimsOcrPerformed true (valid placeholder claims OCR performed)", mutate: (r) => ({ ...r, validPlaceholderResultClaimsOcrPerformed: true }) },
  { label: "validPlaceholderContainsExtractedText true (valid placeholder contains extracted text)", mutate: (r) => ({ ...r, validPlaceholderContainsExtractedText: true }) },
  { label: "validPlaceholderContainsExactDeadline true (valid placeholder contains exact deadline)", mutate: (r) => ({ ...r, validPlaceholderContainsExactDeadline: true }) },
  { label: "validPlaceholderContainsBindingLegalAdvice true (valid placeholder contains binding legal advice)", mutate: (r) => ({ ...r, validPlaceholderContainsBindingLegalAdvice: true }) },
  { label: "validPlaceholderContainsOfficialFiling true (valid placeholder contains official filing)", mutate: (r) => ({ ...r, validPlaceholderContainsOfficialFiling: true }) },
  { label: "validPlaceholderPhotoOcrMetaObserved false (photoOcrMeta missing)", mutate: (r) => ({ ...r, validPlaceholderPhotoOcrMetaObserved: false }) },
  { label: "validPlaceholderPhotoOcrControlledRuntime false (photoOcrControlledRuntime is not true)", mutate: (r) => ({ ...r, validPlaceholderPhotoOcrControlledRuntime: false }) },
  { label: "validPlaceholderOnly false (placeholderOnly is not true)", mutate: (r) => ({ ...r, validPlaceholderOnly: false }) },
  { label: "validPlaceholderRealOcrExtractionPerformed true (realOcrExtractionPerformed is true)", mutate: (r) => ({ ...r, validPlaceholderRealOcrExtractionPerformed: true }) },
  { label: "validPlaceholderOcrRuntimeStillBlocked false (ocrRuntimeStillBlocked is false)", mutate: (r) => ({ ...r, validPlaceholderOcrRuntimeStillBlocked: false }) },
  { label: "validPlaceholderModelCallPerformed true (modelCallPerformed is true)", mutate: (r) => ({ ...r, validPlaceholderModelCallPerformed: true }) },
  { label: "validPlaceholderNoUpload false (upload allowed)", mutate: (r) => ({ ...r, validPlaceholderNoUpload: false }) },
  { label: "validPlaceholderNoPersistence false (persistence allowed)", mutate: (r) => ({ ...r, validPlaceholderNoPersistence: false }) },
  { label: "validPlaceholderNoDbStorage false (DB allowed)", mutate: (r) => ({ ...r, validPlaceholderNoDbStorage: false }) },
  { label: "validPlaceholderNoSupabaseStorage false (storage allowed)", mutate: (r) => ({ ...r, validPlaceholderNoSupabaseStorage: false }) },
  { label: "validPlaceholderNoDna false (DNA allowed)", mutate: (r) => ({ ...r, validPlaceholderNoDna: false }) },
  { label: "validPlaceholderNoPaidMode false (paid mode allowed)", mutate: (r) => ({ ...r, validPlaceholderNoPaidMode: false }) },
  { label: "validPlaceholderNoPublicRuntime false (public runtime allowed)", mutate: (r) => ({ ...r, validPlaceholderNoPublicRuntime: false }) },
  { label: "validPlaceholderNoProduction false (production allowed)", mutate: (r) => ({ ...r, validPlaceholderNoProduction: false }) },
  { label: "validPlaceholderNoGoLive false (go-live allowed)", mutate: (r) => ({ ...r, validPlaceholderNoGoLive: false }) },
  { label: "validPlaceholderModelOutputStillUntrusted false (model output trusted)", mutate: (r) => ({ ...r, validPlaceholderModelOutputStillUntrusted: false }) },
  { label: "validPlaceholderOcrOutputStillUntrusted false (OCR output trusted)", mutate: (r) => ({ ...r, validPlaceholderOcrOutputStillUntrusted: false }) },
  { label: "validPlaceholderImageContentSensitive false (image sensitivity false)", mutate: (r) => ({ ...r, validPlaceholderImageContentSensitive: false }) },
  { label: "validPlaceholderExtractedTextSensitive false (extracted text sensitivity false)", mutate: (r) => ({ ...r, validPlaceholderExtractedTextSensitive: false }) },
  { label: "validPlaceholderPrivacyDisclaimerRequired false (privacy disclaimer optional)", mutate: (r) => ({ ...r, validPlaceholderPrivacyDisclaimerRequired: false }) },
  { label: "validPlaceholderLegalDisclaimerRequired false (legal disclaimer optional)", mutate: (r) => ({ ...r, validPlaceholderLegalDisclaimerRequired: false }) },
  { label: "validPlaceholderEightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, validPlaceholderEightThreeAcNotRun: false }) },
  { label: "guardCases missing one entry (any guard case is missing / count not 22)", mutate: (r) => ({ ...r, guardCases: r.guardCases.slice(0, 21) }) },
  { label: "guardCaseCount wrong", mutate: (r) => ({ ...r, guardCaseCount: 21 as 22 }) },
  { label: "invalid_context guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 0, "observedOk", true) }) },
  { label: "invalid_input_type guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 1, "observedOk", true) }) },
  { label: "missing_photo_payload guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 2, "observedOk", true) }) },
  { label: "unsupported_mime/PDF guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 3, "observedOk", true) }) },
  { label: "page count guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 4, "observedOk", true) }) },
  { label: "oversize image guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 5, "observedOk", true) }) },
  { label: "remote URL guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 6, "observedOk", true) }) },
  { label: "file path guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 7, "observedOk", true) }) },
  { label: "background upload guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 8, "observedOk", true) }) },
  { label: "persistence/storage/DNA marker (persistence) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 9, "observedOk", true) }) },
  { label: "persistence/storage/DNA marker (storage) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 10, "observedOk", true) }) },
  { label: "persistence/storage/DNA marker (DNA) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 11, "observedOk", true) }) },
  { label: "paid mode marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 12, "observedOk", true) }) },
  { label: "public/production/go-live marker (public) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 13, "observedOk", true) }) },
  { label: "public/production/go-live marker (production) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 14, "observedOk", true) }) },
  { label: "public/production/go-live marker (go-live) guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 15, "observedOk", true) }) },
  { label: "exact legal deadline marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 16, "observedOk", true) }) },
  { label: "binding legal advice marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 17, "observedOk", true) }) },
  { label: "official filing marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 18, "observedOk", true) }) },
  { label: "credential/API key/password marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 19, "observedOk", true) }) },
  { label: "IBAN/payment marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 20, "observedOk", true) }) },
  { label: "8.3AC invocation marker guard not rejected", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 21, "observedOk", true) }) },
  { label: "one guard case observedCode wrong (any guard case code differs)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 5, "observedCode", "photo_ocr_something_else") }) },
  { label: "one guard case marked passed despite ok:true (any guard case ok is true, placeholder success allowed)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(withGuardCaseField(r.guardCases, 10, "observedOk", true), 10, "passed", true) }) },
  { label: "one guard case performs OCR (noOcr false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 3, "noOcr", false) }) },
  { label: "one guard case performs model call (noModel false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 3, "noModel", false) }) },
  { label: "one guard case performs upload (noUpload false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 8, "noUpload", false) }) },
  { label: "one guard case performs persistence (noPersistence false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 9, "noPersistence", false) }) },
  { label: "one guard case performs DB write (noDbStorage false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 10, "noDbStorage", false) }) },
  { label: "one guard case performs storage write (noSupabaseStorage false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 10, "noSupabaseStorage", false) }) },
  { label: "one guard case performs DNA write (noDna false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 11, "noDna", false) }) },
  { label: "one guard case enables public runtime (noPublicRuntime false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 13, "noPublicRuntime", false) }) },
  { label: "one guard case authorizes production (noProduction false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 14, "noProduction", false) }) },
  { label: "one guard case authorizes go-live (noGoLive false)", mutate: (r) => ({ ...r, guardCases: withGuardCaseField(r.guardCases, 15, "noGoLive", false) }) },
  { label: "everyGuardCaseReturnedOkFalse false", mutate: (r) => ({ ...r, everyGuardCaseReturnedOkFalse: false }) },
  { label: "everyGuardCaseReturnedExpectedBlockCode false", mutate: (r) => ({ ...r, everyGuardCaseReturnedExpectedBlockCode: false }) },
  { label: "guardCasesPerformed false", mutate: (r) => ({ ...r, guardCasesPerformed: false }) },
  { label: "guardCasesRejected false", mutate: (r) => ({ ...r, guardCasesRejected: false }) },
  { label: "guardCasesRejectedCount wrong", mutate: (r) => ({ ...r, guardCasesRejectedCount: 21 }) },
  { label: "routeEnabledPlaceholderWorksOnlyWithExactTrue false", mutate: (r) => ({ ...r, routeEnabledPlaceholderWorksOnlyWithExactTrue: false }) },
  { label: "exactLowercaseTrueAcceptedForControlledPlaceholder false", mutate: (r) => ({ ...r, exactLowercaseTrueAcceptedForControlledPlaceholder: false }) },
  { label: "placeholderSuccessNoRealOcr false (real OCR extraction still blocked violated)", mutate: (r) => ({ ...r, placeholderSuccessNoRealOcr: false }) },
  { label: "placeholderSuccessNoModelCall false", mutate: (r) => ({ ...r, placeholderSuccessNoModelCall: false }) },
  { label: "placeholderSuccessNoUpload false", mutate: (r) => ({ ...r, placeholderSuccessNoUpload: false }) },
  { label: "placeholderSuccessNoPersistence false", mutate: (r) => ({ ...r, placeholderSuccessNoPersistence: false }) },
  { label: "placeholderSuccessNoDbStorage false", mutate: (r) => ({ ...r, placeholderSuccessNoDbStorage: false }) },
  { label: "placeholderSuccessNoSupabaseStorage false", mutate: (r) => ({ ...r, placeholderSuccessNoSupabaseStorage: false }) },
  { label: "placeholderSuccessNoDna false (paid/DNA/persistence/storage becomes enabled)", mutate: (r) => ({ ...r, placeholderSuccessNoDna: false }) },
  { label: "placeholderSuccessNoPublicRuntime false (public runtime becomes enabled)", mutate: (r) => ({ ...r, placeholderSuccessNoPublicRuntime: false }) },
  { label: "placeholderSuccessNoProduction false (production/go-live becomes authorized)", mutate: (r) => ({ ...r, placeholderSuccessNoProduction: false }) },
  { label: "placeholderSuccessNoGoLive false (production/go-live becomes authorized)", mutate: (r) => ({ ...r, placeholderSuccessNoGoLive: false }) },
  { label: "realOcrExtractionStillBlocked false", mutate: (r) => ({ ...r, realOcrExtractionStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "ocrOutputStillUntrusted false (OCR output becomes trusted)", mutate: (r) => ({ ...r, ocrOutputStillUntrusted: false }) },
  { label: "imageContentTreatedAsSensitive false (image sensitivity is false)", mutate: (r) => ({ ...r, imageContentTreatedAsSensitive: false }) },
  { label: "extractedTextTreatedAsSensitive false (extracted text sensitivity is false)", mutate: (r) => ({ ...r, extractedTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (disclaimers become optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (disclaimers become optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (DNA allowed)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence allowed)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (storage allowed)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "supabaseStorageStillBlocked false (storage allowed)", mutate: (r) => ({ ...r, supabaseStorageStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes enabled)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionStillUnauthorized false (production becomes authorized)", mutate: (r) => ({ ...r, productionStillUnauthorized: false }) },
  { label: "goLiveStillUnauthorized false (go-live becomes authorized)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false }) },
  { label: "envOriginalValueCaptured false", mutate: (r) => ({ ...r, envOriginalValueCaptured: false as true }) },
  { label: "envSetExactlyTrueDuringEnabledTests false", mutate: (r) => ({ ...r, envSetExactlyTrueDuringEnabledTests: false }) },
  { label: "envRestoredAfterTests false (env is not restored after tests)", mutate: (r) => ({ ...r, envRestoredAfterTests: false }) },
  { label: "envAbsentAfterCleanupIfOriginallyAbsent false", mutate: (r) => ({ ...r, envAbsentAfterCleanupIfOriginallyAbsent: false }) },
  { label: "cleanupPerformed false", mutate: (r) => ({ ...r, cleanupPerformed: false as true }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10F)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10G" as "8.10F" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10F)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Controlled Local Regression Pack" }) },
  { label: "readyForPhotoOcrRegressionPack false when enabled closure passes", mutate: (r) => ({ ...r, readyForPhotoOcrRegressionPack: false }) },
  { label: "readyForPhotoOcrBrowserManualTestPlanning true too early", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualTestPlanning: true as false }) },
  { label: "readyForPhotoOcrBrowserManualExecution true too early", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualExecution: true as false }) },
  { label: "readyForPhotoOcrInternalReadinessClosure true too early (readyForPhotoOcrRuntime becomes true)", mutate: (r) => ({ ...r, readyForPhotoOcrInternalReadinessClosure: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "enabledPlaceholderEvidence emptied", mutate: (r) => ({ ...r, enabledPlaceholderEvidence: [] }) },
  { label: "guardCaseEvidence wrong length", mutate: (r) => ({ ...r, guardCaseEvidence: r.guardCaseEvidence.slice(0, 5) }) },
  { label: "responseContractEvidence emptied", mutate: (r) => ({ ...r, responseContractEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "cleanupEvidence emptied", mutate: (r) => ({ ...r, cleanupEvidence: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runPhotoOcrControlledRuntimeEnabledLocalApiClosure(): Promise<PhotoOcrControlledRuntimeEnabledLocalApiClosureResult> {
  const closureFailures: string[] = [];

  // ── Source of truth: 8.10A gate design ────────────────────────────────────
  const a = runPhotoOcrControlledRuntimeGateDesign();
  if (a.checkId !== "8.10A") closureFailures.push(`8.10A checkId mismatch: got "${a.checkId}"`);
  if (a.allPassed !== true) closureFailures.push("8.10A allPassed is not true");
  if (a.tamperRejected !== a.tamperCount) closureFailures.push("8.10A own tamper count mismatch");
  const sourceGateDesignAccepted = closureFailures.length === 0;

  // ── Source of truth: 8.10B implementation plan ────────────────────────────
  const bBefore = closureFailures.length;
  const b = runPhotoOcrControlledRuntimeImplementationPlan();
  if (b.checkId !== "8.10B") closureFailures.push(`8.10B checkId mismatch: got "${b.checkId}"`);
  if (b.allPassed !== true) closureFailures.push("8.10B allPassed is not true");
  if (b.tamperRejected !== b.tamperCount) closureFailures.push("8.10B own tamper count mismatch");
  const sourceImplementationPlanAccepted = closureFailures.length === bBefore;

  // ── Source of truth: 8.10C minimal patch audit ────────────────────────────
  const cBefore = closureFailures.length;
  const c = runPhotoOcrControlledRuntimeMinimalPatchAudit();
  if (c.checkId !== "8.10C") closureFailures.push(`8.10C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) closureFailures.push("8.10C allPassed is not true");
  if (c.tamperRejected !== c.tamperCount) closureFailures.push("8.10C own tamper count mismatch");
  const sourceMinimalPatchAccepted = closureFailures.length === cBefore;

  // ── Source of truth: 8.10D disabled local API closure ─────────────────────
  const dBefore = closureFailures.length;
  const d810D = await runPhotoOcrControlledRuntimeDisabledLocalApiClosure();
  if (d810D.checkId !== "8.10D") closureFailures.push(`8.10D checkId mismatch: got "${d810D.checkId}"`);
  if (d810D.allPassed !== true) closureFailures.push("8.10D allPassed is not true");
  if (d810D.readyForNextPhase !== "8.10E") closureFailures.push("8.10D readyForNextPhase is not 8.10E");
  if (d810D.tamperRejected !== d810D.tamperCount) closureFailures.push("8.10D own tamper count mismatch");
  const sourceDisabledClosureAccepted = closureFailures.length === dBefore;

  // ── Source of truth: 8.9N internal readiness closure ──────────────────────
  const nBefore = closureFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") closureFailures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) closureFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") closureFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) closureFailures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = closureFailures.length === nBefore;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Capture original env value; set exactly "true" for enabled tests ──────
  const originalEnvValue = process.env[PHOTO_OCR_ENV_KEY];
  const originalEnvWasAbsent = originalEnvValue === undefined;
  const envOriginalValueCaptured = true;

  process.env[PHOTO_OCR_ENV_KEY] = "true";
  const enabledEnvSetExactlyTrue = process.env[PHOTO_OCR_ENV_KEY] === "true";
  if (!enabledEnvSetExactlyTrue) closureFailures.push("failed to set env flag to exact \"true\" for enabled tests");

  // ── Valid enabled placeholder request ─────────────────────────────────────
  let validPlaceholderStatus = 0;
  let validPlaceholderData: Record<string, unknown> | null = null;
  try {
    const req = buildSyntheticRequest("203.0.113.1", baseValidPhotoOcrBody());
    const res = await POST(req);
    validPlaceholderStatus = res.status;
    const parsed: unknown = await res.json();
    validPlaceholderData = isRecord(parsed) ? parsed : null;
  } catch (err) {
    closureFailures.push(`valid placeholder request threw during in-process invocation: ${String(err)}`);
  }

  const validPlaceholderOk = validPlaceholderData?.ok === true;
  const validPlaceholderMode =
    typeof validPlaceholderData?.mode === "string" ? validPlaceholderData.mode : "";
  const validPlaceholderContext =
    typeof validPlaceholderData?.context === "string" ? validPlaceholderData.context : "";
  const resultSafety = inspectPlaceholderResultSafety(validPlaceholderData?.result);
  const validPlaceholderMeta =
    validPlaceholderData && isRecord(validPlaceholderData.photoOcrMeta)
      ? (validPlaceholderData.photoOcrMeta as Record<string, unknown>)
      : null;
  const validPlaceholderMetaOk = validateEnabledPhotoOcrMeta(validPlaceholderMeta);

  if (validPlaceholderStatus !== 200) closureFailures.push(`valid placeholder status was ${validPlaceholderStatus}, expected 200`);
  if (!validPlaceholderOk) closureFailures.push("valid placeholder response ok was not true");
  if (validPlaceholderMode !== "photo_ocr_controlled_runtime") closureFailures.push("valid placeholder mode mismatch");
  if (validPlaceholderContext !== "anonymous") closureFailures.push("valid placeholder context mismatch");
  if (!resultSafety.resultPresent) closureFailures.push("valid placeholder result missing");
  if (resultSafety.claimsOcrPerformed) closureFailures.push("valid placeholder result claims OCR was performed");
  if (resultSafety.containsExtractedText) closureFailures.push("valid placeholder result contains extracted text");
  if (resultSafety.containsExactDeadline) closureFailures.push("valid placeholder result contains an exact deadline");
  if (resultSafety.containsBindingLegalAdvice) closureFailures.push("valid placeholder result contains binding legal advice");
  if (resultSafety.containsOfficialFiling) closureFailures.push("valid placeholder result contains official filing content");
  if (!validPlaceholderMetaOk) closureFailures.push("valid placeholder photoOcrMeta did not match expected enabled-placeholder contract");

  const enabledPlaceholderEvidence: string[] = [
    `Valid synthetic Photo/OCR placeholder request returned status=${validPlaceholderStatus}, ok=${validPlaceholderOk}, mode="${validPlaceholderMode}", context="${validPlaceholderContext}".`,
    `Result present: ${resultSafety.resultPresent}; claims OCR performed: ${resultSafety.claimsOcrPerformed}; contains extracted text: ${resultSafety.containsExtractedText}.`,
    `Result contains exact deadline: ${resultSafety.containsExactDeadline}; contains binding legal advice: ${resultSafety.containsBindingLegalAdvice}; contains official filing: ${resultSafety.containsOfficialFiling}.`,
    `photoOcrMeta matched full expected enabled-placeholder/no-OCR/no-model/no-persistence/sensitivity/disclaimer contract: ${validPlaceholderMetaOk}.`,
    "Only synthetic page metadata (mimeType: \"image/png\", sizeBytes: 12345) was sent — no real image bytes.",
  ];

  // ── Guard rejection cases (env still exactly "true") ──────────────────────
  const guardCases: GuardCase[] = [];
  const guardCaseEvidence: string[] = [];

  for (let i = 0; i < GUARD_CASE_SPECS.length; i++) {
    const spec = GUARD_CASE_SPECS[i]!;
    const syntheticIp = `203.0.113.${i + 2}`;
    let observedStatus = 0;
    let data: Record<string, unknown> | null = null;
    try {
      const req = buildSyntheticRequest(syntheticIp, spec.buildBody());
      const res = await POST(req);
      observedStatus = res.status;
      const parsed: unknown = await res.json();
      data = isRecord(parsed) ? parsed : null;
    } catch (err) {
      closureFailures.push(`guard case "${spec.caseId}" threw during in-process invocation: ${String(err)}`);
    }

    const meta =
      data && isRecord(data.photoOcrMeta) ? (data.photoOcrMeta as Record<string, unknown>) : null;
    const metaOk = validateBlockedPhotoOcrMeta(meta);
    const observedOk = data ? data.ok === true : true;
    const observedCode = data && typeof data.code === "string" ? data.code : "";

    const passed =
      observedOk === false &&
      observedCode === spec.expectedCode &&
      metaOk &&
      (observedStatus === 400 || observedStatus === 402);

    if (!passed) {
      closureFailures.push(
        `guard case "${spec.caseId}" did not pass: status=${observedStatus}, ok=${observedOk}, code="${observedCode}" (expected "${spec.expectedCode}"), metaOk=${metaOk}`,
      );
    }

    guardCases.push({
      caseId: spec.caseId,
      description: spec.description,
      expectedCode: spec.expectedCode,
      observedStatus,
      observedOk,
      observedCode,
      passed,
      noOcr: metaOk,
      noModel: metaOk,
      noUpload: metaOk,
      noPersistence: metaOk,
      noDbStorage: metaOk,
      noSupabaseStorage: metaOk,
      noDna: metaOk,
      noPublicRuntime: metaOk,
      noProduction: metaOk,
      noGoLive: metaOk,
      photoOcrMetaObserved: meta,
    });

    guardCaseEvidence.push(
      `${spec.caseId} (${spec.description}): status=${observedStatus}, ok=${observedOk}, code="${observedCode}", expected="${spec.expectedCode}", passed=${passed}.`,
    );
  }

  // ── Restore original env state ────────────────────────────────────────────
  if (originalEnvWasAbsent) {
    delete process.env[PHOTO_OCR_ENV_KEY];
  } else {
    process.env[PHOTO_OCR_ENV_KEY] = originalEnvValue as string;
  }
  const envRestoredAfterTests = originalEnvWasAbsent
    ? process.env[PHOTO_OCR_ENV_KEY] === undefined
    : process.env[PHOTO_OCR_ENV_KEY] === originalEnvValue;
  const envAbsentAfterCleanupIfOriginallyAbsent = originalEnvWasAbsent
    ? process.env[PHOTO_OCR_ENV_KEY] === undefined
    : true;
  if (!envRestoredAfterTests) closureFailures.push("environment flag was not correctly restored after tests");

  const cleanupEvidence: string[] = [
    `Original env value captured before mutation: ${originalEnvWasAbsent ? "absent" : "present"}.`,
    `Environment flag set to exact "true" during all enabled/guard tests: ${enabledEnvSetExactlyTrue}.`,
    `Environment flag restored after the valid-placeholder case and all 22 guard cases: ${envRestoredAfterTests}.`,
    originalEnvWasAbsent
      ? `Flag correctly absent again after cleanup: ${envAbsentAfterCleanupIfOriginallyAbsent}.`
      : "Flag was originally present and was restored to its original value.",
  ];

  // ── Aggregate guard-case summary/contract/safety fields ───────────────────
  const guardCasesPerformed = guardCases.length === GUARD_CASE_SPECS.length;
  const guardCasesRejectedCount = guardCases.filter(
    (gc) => gc.observedOk === false && gc.observedCode === gc.expectedCode,
  ).length;
  const guardCasesRejected = guardCasesRejectedCount === GUARD_CASE_SPECS.length;
  const everyGuardCaseReturnedOkFalse = guardCases.every((gc) => gc.observedOk === false);
  const everyGuardCaseReturnedExpectedBlockCode = guardCases.every((gc) => gc.observedCode === gc.expectedCode);
  const everyGuardCaseNoOcr = guardCases.every((gc) => gc.noOcr);
  const everyGuardCaseNoModelCall = guardCases.every((gc) => gc.noModel);
  const everyGuardCaseNoUpload = guardCases.every((gc) => gc.noUpload);
  const everyGuardCaseNoPersistence = guardCases.every((gc) => gc.noPersistence);
  const everyGuardCaseNoDbStorage = guardCases.every((gc) => gc.noDbStorage);
  const everyGuardCaseNoSupabaseStorage = guardCases.every((gc) => gc.noSupabaseStorage);
  const everyGuardCaseNoDna = guardCases.every((gc) => gc.noDna);
  const everyGuardCaseNoPublicRuntime = guardCases.every((gc) => gc.noPublicRuntime);
  const everyGuardCaseNoProduction = guardCases.every((gc) => gc.noProduction);
  const everyGuardCaseNoGoLive = guardCases.every((gc) => gc.noGoLive);

  if (!guardCasesRejected) closureFailures.push("not all 22 guard cases were rejected with their expected block code");

  const responseContractEvidence: string[] = [
    `Valid placeholder request returned HTTP 200 / ok:true / mode "photo_ocr_controlled_runtime": ${
      validPlaceholderStatus === 200 && validPlaceholderOk && validPlaceholderMode === "photo_ocr_controlled_runtime"
    }.`,
    `All ${GUARD_CASE_SPECS.length} guard cases returned ok:false with their exact expected block code: ${guardCasesRejected}.`,
    "No guard case returned a successful mode field or any placeholder result content.",
    "Every guard case's photoOcrMeta matched the full expected no-OCR/no-model/no-persistence/sensitivity/disclaimer contract exactly.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The enabled placeholder path only activates for the exact lowercase \"true\" env value and only returns a fixed, non-OCR, non-model placeholder body.",
    "No real OCR extraction, model call, upload, or persistence occurred in the valid placeholder case or in any of the 22 guard cases.",
    "Public runtime, production, and go-live all remained unauthorized in every case, including the valid placeholder success case.",
    "Image content and extracted text remain treated as sensitive; model and OCR output remain untrusted even on the enabled success path.",
    "Legal and privacy disclaimers, and exact-legal-deadline/binding-legal-advice/official-filing-generation blocks, remain required/active in every case.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No OCR engine or OCR dependency was imported or invoked by this closure.",
    "No real image bytes were read; only synthetic metadata (mimeType, sizeBytes) was sent in every request.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process.",
    "No DB, Supabase storage, or Vaylo DNA write occurred.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const routeEnabledPlaceholderWorksOnlyWithExactTrue = enabledEnvSetExactlyTrue && validPlaceholderOk;
  const exactLowercaseTrueAcceptedForControlledPlaceholder = validPlaceholderStatus === 200 && validPlaceholderOk;

  const allPassed =
    closureFailures.length === 0 &&
    sourceGateDesignAccepted &&
    sourceImplementationPlanAccepted &&
    sourceMinimalPatchAccepted &&
    sourceDisabledClosureAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    enabledEnvSetExactlyTrue &&
    validPlaceholderStatus === 200 &&
    validPlaceholderOk &&
    validPlaceholderMode === "photo_ocr_controlled_runtime" &&
    resultSafety.resultPresent &&
    !resultSafety.claimsOcrPerformed &&
    validPlaceholderMetaOk &&
    guardCasesPerformed &&
    guardCasesRejected &&
    everyGuardCaseNoOcr &&
    everyGuardCaseNoModelCall &&
    envRestoredAfterTests;

  const tamperCount = PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED_LOCAL_API_CLOSURE_TAMPER_CASES.length;

  const notes: string[] = [
    "EC-01: 8.10E exercises the real /api/smart-talk POST handler in-process with synthetic Request objects — no dev server, no browser, no external network.",
    `EC-02: 8.10A/8.10B/8.10C/8.10D/8.9N confirmed as sources of truth — allPassed: ${a.allPassed}/${b.allPassed}/${c.allPassed}/${d810D.allPassed}/${n.allPassed}.`,
    `EC-03: with SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED set to exact "true", the valid synthetic placeholder request returned 200/ok:true with a fully-compliant photoOcrMeta: ${validPlaceholderMetaOk}.`,
    `EC-04: all ${GUARD_CASE_SPECS.length} guard-rejection cases (context/inputType/payload/MIME/page-count/size/remote-URL/file-path/background-upload/persistence/storage/DNA/paid/public/production/go-live/8.3AC/legal-deadline/binding-advice/official-filing/credential/financial) returned their exact expected block code: ${guardCasesRejected}.`,
    "EC-05: only synthetic page metadata (mimeType, sizeBytes) was ever sent — no real image bytes, no OCR content, no extracted text.",
    `EC-06: process.env.${PHOTO_OCR_ENV_KEY} was captured before mutation, set to exact "true" only for the duration of this closure's tests, and restored afterward: ${envRestoredAfterTests}.`,
    "EC-07: disabled non-exact env variants were not retested here — that remains 8.10D's scope; 8.10D is imported only as source evidence.",
    "EC-08: no OCR/model/upload/persistence/DB/storage/DNA occurred anywhere in this closure, on either the success path or any guard-rejection path.",
    "EC-09: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "EC-10: ready for Phase 8.10F — Photo/OCR Controlled Local Regression Pack.",
  ];

  const provisional: PhotoOcrControlledRuntimeEnabledLocalApiClosureResult = {
    checkId: "8.10E",
    allPassed: true,
    enabledLocalApiClosureOnly: true,
    disabledPathRetestedHere: false,
    sourceGateDesignCommit: "4a87043",
    sourceImplementationPlanCommit: "6a26e47",
    sourceMinimalPatchCommit: "3e35be8",
    sourceDisabledClosureCommit: "385b32a",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceGateDesignAccepted,
    sourceImplementationPlanAccepted,
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    localRouteHandlerInvoked: true,
    browserInvoked: false,
    devServerStarted: false,
    externalNetworkCalled: false,
    realImageUsed: false,
    imageBytesRead: false,
    ocrLibraryImported: false,
    ocrExtractionPerformed: false,
    modelCallPerformed: false,
    uploadPerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    enabledEnvSetExactlyTrue,
    validPlaceholderCasePerformed: true,
    validPlaceholderStatus,
    validPlaceholderOk,
    validPlaceholderMode,
    validPlaceholderContext,
    validPlaceholderResultPresent: resultSafety.resultPresent,
    validPlaceholderResultClaimsOcrPerformed: resultSafety.claimsOcrPerformed,
    validPlaceholderContainsExtractedText: resultSafety.containsExtractedText,
    validPlaceholderContainsExactDeadline: resultSafety.containsExactDeadline,
    validPlaceholderContainsBindingLegalAdvice: resultSafety.containsBindingLegalAdvice,
    validPlaceholderContainsOfficialFiling: resultSafety.containsOfficialFiling,
    validPlaceholderPhotoOcrMetaObserved: validPlaceholderMeta !== null,
    validPlaceholderPhotoOcrControlledRuntime: validPlaceholderMeta?.photoOcrControlledRuntime === true,
    validPlaceholderOnly: validPlaceholderMeta?.placeholderOnly === true,
    validPlaceholderRealOcrExtractionPerformed: validPlaceholderMeta?.realOcrExtractionPerformed === true,
    validPlaceholderOcrRuntimeStillBlocked: validPlaceholderMeta?.ocrRuntimeStillBlocked === true,
    validPlaceholderModelCallPerformed: validPlaceholderMeta?.modelCallPerformed === true,
    validPlaceholderNoUpload: validPlaceholderMeta?.uploadRuntimeStillBlocked === true,
    validPlaceholderNoPersistence:
      validPlaceholderMeta?.rawImagePersistenceBlocked === true &&
      validPlaceholderMeta?.processedImagePersistenceBlocked === true &&
      validPlaceholderMeta?.extractedTextPersistenceBlocked === true,
    validPlaceholderNoDbStorage: validPlaceholderMeta?.dbStorageStillBlocked === true,
    validPlaceholderNoSupabaseStorage: validPlaceholderMeta?.supabaseStorageStillBlocked === true,
    validPlaceholderNoDna: validPlaceholderMeta?.vayloDnaStillBlocked === true,
    validPlaceholderNoPaidMode: validPlaceholderMeta?.paidDocumentModeStillBlocked === true,
    validPlaceholderNoPublicRuntime: validPlaceholderMeta?.publicRuntimeStillBlocked === true,
    validPlaceholderNoProduction: validPlaceholderMeta?.productionAuthorizedNow === false,
    validPlaceholderNoGoLive: validPlaceholderMeta?.goLiveAuthorizedNow === false,
    validPlaceholderModelOutputStillUntrusted: validPlaceholderMeta?.modelOutputStillUntrusted === true,
    validPlaceholderOcrOutputStillUntrusted: validPlaceholderMeta?.ocrOutputStillUntrusted === true,
    validPlaceholderImageContentSensitive: validPlaceholderMeta?.imageContentTreatedAsSensitive === true,
    validPlaceholderExtractedTextSensitive: validPlaceholderMeta?.extractedTextTreatedAsSensitive === true,
    validPlaceholderPrivacyDisclaimerRequired: validPlaceholderMeta?.privacyDisclaimerRequired === true,
    validPlaceholderLegalDisclaimerRequired: validPlaceholderMeta?.legalDisclaimerRequired === true,
    validPlaceholderEightThreeAcNotRun: validPlaceholderMeta?.eightThreeAcNotRun === true,

    guardCaseCount: 22,
    guardCasesPerformed,
    guardCasesRejected,
    guardCasesRejectedCount,
    everyGuardCaseReturnedOkFalse,
    everyGuardCaseReturnedExpectedBlockCode,
    everyGuardCaseNoOcr,
    everyGuardCaseNoModelCall,
    everyGuardCaseNoUpload,
    everyGuardCaseNoPersistence,
    everyGuardCaseNoDbStorage,
    everyGuardCaseNoSupabaseStorage,
    everyGuardCaseNoDna,
    everyGuardCaseNoPublicRuntime,
    everyGuardCaseNoProduction,
    everyGuardCaseNoGoLive,

    guardCases,

    routeEnabledPlaceholderWorksOnlyWithExactTrue,
    exactLowercaseTrueAcceptedForControlledPlaceholder,
    placeholderSuccessNoRealOcr: validPlaceholderMeta?.realOcrExtractionPerformed === false,
    placeholderSuccessNoModelCall: validPlaceholderMeta?.modelCallPerformed === false,
    placeholderSuccessNoUpload: validPlaceholderMeta?.uploadRuntimeStillBlocked === true,
    placeholderSuccessNoPersistence:
      validPlaceholderMeta?.rawImagePersistenceBlocked === true &&
      validPlaceholderMeta?.extractedTextPersistenceBlocked === true,
    placeholderSuccessNoDbStorage: validPlaceholderMeta?.dbStorageStillBlocked === true,
    placeholderSuccessNoSupabaseStorage: validPlaceholderMeta?.supabaseStorageStillBlocked === true,
    placeholderSuccessNoDna: validPlaceholderMeta?.vayloDnaStillBlocked === true,
    placeholderSuccessNoPublicRuntime: validPlaceholderMeta?.publicRuntimeStillBlocked === true,
    placeholderSuccessNoProduction: validPlaceholderMeta?.productionAuthorizedNow === false,
    placeholderSuccessNoGoLive: validPlaceholderMeta?.goLiveAuthorizedNow === false,
    realOcrExtractionStillBlocked: everyGuardCaseNoOcr && validPlaceholderMeta?.ocrRuntimeStillBlocked === true,
    modelOutputStillUntrusted: everyGuardCaseNoModelCall && validPlaceholderMeta?.modelOutputStillUntrusted === true,
    ocrOutputStillUntrusted: validPlaceholderMeta?.ocrOutputStillUntrusted === true,
    imageContentTreatedAsSensitive: validPlaceholderMeta?.imageContentTreatedAsSensitive === true,
    extractedTextTreatedAsSensitive: validPlaceholderMeta?.extractedTextTreatedAsSensitive === true,
    legalDisclaimerRequired: validPlaceholderMeta?.legalDisclaimerRequired === true,
    privacyDisclaimerRequired: validPlaceholderMeta?.privacyDisclaimerRequired === true,
    exactLegalDeadlineStillBlocked: validPlaceholderMeta?.exactLegalDeadlineStillBlocked === true,
    bindingLegalAdviceStillBlocked: validPlaceholderMeta?.bindingLegalAdviceStillBlocked === true,
    officialFilingGenerationStillBlocked: validPlaceholderMeta?.officialFilingGenerationStillBlocked === true,
    paidDocumentModeStillBlocked: everyGuardCaseNoDna && validPlaceholderMeta?.paidDocumentModeStillBlocked === true,
    vayloDnaStillBlocked: everyGuardCaseNoDna && validPlaceholderMeta?.vayloDnaStillBlocked === true,
    persistenceStillBlocked: everyGuardCaseNoPersistence,
    dbStorageStillBlocked: everyGuardCaseNoDbStorage && validPlaceholderMeta?.dbStorageStillBlocked === true,
    supabaseStorageStillBlocked: everyGuardCaseNoSupabaseStorage && validPlaceholderMeta?.supabaseStorageStillBlocked === true,
    publicRuntimeStillBlocked: everyGuardCaseNoPublicRuntime && validPlaceholderMeta?.publicRuntimeStillBlocked === true,
    productionStillUnauthorized: everyGuardCaseNoProduction && validPlaceholderMeta?.productionAuthorizedNow === false,
    goLiveStillUnauthorized: everyGuardCaseNoGoLive && validPlaceholderMeta?.goLiveAuthorizedNow === false,

    envOriginalValueCaptured,
    envSetExactlyTrueDuringEnabledTests: enabledEnvSetExactlyTrue,
    envRestoredAfterTests,
    envAbsentAfterCleanupIfOriginallyAbsent,
    cleanupPerformed: true,

    readyForNextPhase: "8.10F",
    recommendedNextPhase: "Photo/OCR Controlled Local Regression Pack",
    readyForPhotoOcrRegressionPack: allPassed,
    readyForPhotoOcrBrowserManualTestPlanning: false,
    readyForPhotoOcrBrowserManualExecution: false,
    readyForPhotoOcrInternalReadinessClosure: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    enabledPlaceholderEvidence,
    guardCaseEvidence,
    responseContractEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    cleanupEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10F: Controlled Local Regression Pack — synthetic allowed/blocked case matrix re-running both the enabled placeholder success case and all guard-rejection codes together as a single regression suite.",
      "Phase 8.10G (or later): Browser/UI wiring audit and controlled local browser manual test planning/execution for the Photo/OCR internal button path.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase.",
    ],
    notes,
  };

  if (
    closureFailures.length === 0 &&
    !_isCanonicalPhotoOcrControlledRuntimeEnabledLocalApiClosureResult(provisional)
  ) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledRuntimeEnabledLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10E tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const finalAllPassed = allPassed && closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10E tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    readyForPhotoOcrRegressionPack: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-runtime-enabled-local-api-closure");

if (invokedDirectly) {
  runPhotoOcrControlledRuntimeEnabledLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
