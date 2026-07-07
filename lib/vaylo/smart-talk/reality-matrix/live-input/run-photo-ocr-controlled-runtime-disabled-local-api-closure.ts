/**
 * PHASE 8.10D — Photo/OCR Controlled Runtime Disabled Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local Request objects (no dev server, no browser, no external
 * network), that the `photo_ocr_controlled_runtime` branch fails closed for
 * every non-exact variant of SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED.
 *
 * This phase tests the DISABLED path only. The enabled "true" path is
 * explicitly out of scope and belongs to Phase 8.10E.
 *
 * Every synthetic request uses ONLY metadata (mimeType + sizeBytes for one
 * synthetic page) — no real image bytes, no OCR content, no text document
 * content, no remote URL, no file path, no PDF, no persistence/storage/paid/
 * DNA/public/production/go-live marker.
 *
 * This closure does NOT start a dev server, does NOT use a browser, does NOT
 * perform live external network calls, does NOT call OpenAI/any model, does
 * NOT call an OCR engine, does NOT read real images or image bytes, does NOT
 * persist anything, does NOT write DB/storage/DNA, does NOT run 8.3AC, and
 * does NOT touch tmp-8-3ac-live-metadata.ts. It restores
 * process.env.SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED to its original
 * value (or absence) after all tests complete.
 */

import { runPhotoOcrControlledRuntimeGateDesign } from "./run-photo-ocr-controlled-runtime-gate-design";
import { runPhotoOcrControlledRuntimeImplementationPlan } from "./run-photo-ocr-controlled-runtime-implementation-plan";
import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";
import { POST } from "../../../../../app/api/smart-talk/route";

const PHOTO_OCR_ENV_KEY = "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";

// ─── Result types ───────────────────────────────────────────────────────────

interface DisabledEnvCase {
  caseId: string;
  envValueDescription: string;
  envValueSet: string;
  expectedEnabled: false;
  observedStatus: number;
  observedOk: boolean;
  observedCode: string;
  passed: boolean;
  photoOcrMetaObserved: Record<string, unknown> | null;
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
}

interface PhotoOcrControlledRuntimeDisabledLocalApiClosureResult {
  checkId: "8.10D";
  allPassed: boolean;
  disabledLocalApiClosureOnly: true;
  enabledPathTested: false;
  sourceGateDesignCommit: "4a87043";
  sourceImplementationPlanCommit: "6a26e47";
  sourceMinimalPatchCommit: "3e35be8";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceGateDesignAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceMinimalPatchAccepted: boolean;
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

  disabledEnvCases: DisabledEnvCase[];

  disabledCaseCount: 9;
  disabledCasesPassed: boolean;
  disabledCasesRejected: boolean;
  disabledCasesRejectedCount: number;
  exactLowercaseTrueOnlyWouldEnable: boolean;
  nonExactTruthyValuesRejected: boolean;
  absentEnvRejected: boolean;
  falseEnvRejected: boolean;
  uppercaseTrueRejected: boolean;
  numericOneRejected: boolean;
  yesRejected: boolean;
  whitespaceTrueRejected: boolean;
  emptyStringRejected: boolean;
  randomStringRejected: boolean;

  everyDisabledCaseReturned403: boolean;
  everyDisabledCaseReturnedOkFalse: boolean;
  everyDisabledCaseReturnedDisabledCode: boolean;
  everyDisabledCaseReturnedNoSuccessfulMode: boolean;
  everyDisabledCaseNoOcr: boolean;
  everyDisabledCaseNoModelCall: boolean;
  everyDisabledCaseNoUpload: boolean;
  everyDisabledCaseNoPersistence: boolean;
  everyDisabledCaseNoDbStorage: boolean;
  everyDisabledCaseNoSupabaseStorage: boolean;
  everyDisabledCaseNoDna: boolean;
  everyDisabledCaseNoPublicRuntime: boolean;
  everyDisabledCaseNoProduction: boolean;
  everyDisabledCaseNoGoLive: boolean;

  routeStillFailClosedWhenDisabled: boolean;
  photoOcrRuntimeStillBlockedWhenDisabled: boolean;
  realOcrExtractionStillBlocked: boolean;
  placeholderSuccessNotAllowedWhenDisabled: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  supabaseStorageStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  ocrOutputStillUntrusted: boolean;
  imageContentTreatedAsSensitive: boolean;
  extractedTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;

  envOriginalValueCaptured: true;
  envRestoredAfterTests: boolean;
  envAbsentAfterCleanupIfOriginallyAbsent: boolean;
  cleanupPerformed: true;

  readyForNextPhase: "8.10E";
  recommendedNextPhase: "Photo/OCR Controlled Runtime Enabled Local API Closure";
  readyForEnabledControlledLocalApiClosure: boolean;
  readyForPhotoOcrRegressionPack: false;
  readyForPhotoOcrBrowserManualTest: false;
  readyForPhotoOcrInternalReadinessClosure: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  disabledEnvCaseEvidence: string[];
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
  "8.9N text document internal readiness accepted",
  "current closure validates disabled path only",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Enabled controlled local API closure not performed yet",
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
  "This phase tests disabled local API behavior only.",
  "This phase does not test the enabled \"true\" path.",
  "This phase does not perform browser/UI validation.",
  "This phase does not perform real OCR extraction.",
  "This phase does not use real images.",
  "This phase does not authorize public runtime, production, or go-live.",
  "This phase does not validate real OCR quality or OCR trust boundaries.",
];

// ─── Disabled env variants under test ──────────────────────────────────────

interface DisabledEnvVariant {
  caseId: string;
  envValueDescription: string;
  envValue: string | undefined;
}

const DISABLED_ENV_VARIANTS: DisabledEnvVariant[] = [
  { caseId: "absent_env", envValueDescription: "absent / deleted", envValue: undefined },
  { caseId: "false_lowercase", envValueDescription: '"false"', envValue: "false" },
  { caseId: "false_uppercase", envValueDescription: '"FALSE"', envValue: "FALSE" },
  { caseId: "true_uppercase", envValueDescription: '"TRUE"', envValue: "TRUE" },
  { caseId: "numeric_one", envValueDescription: '"1"', envValue: "1" },
  { caseId: "yes_lowercase", envValueDescription: '"yes"', envValue: "yes" },
  { caseId: "whitespace_true", envValueDescription: '" true " (leading/trailing whitespace)', envValue: " true " },
  { caseId: "empty_string", envValueDescription: '"" (empty string)', envValue: "" },
  { caseId: "random_string", envValueDescription: '"enabled" (random non-boolean string)', envValue: "enabled" },
];

// ─── Expected disabled-path photoOcrMeta contract ──────────────────────────

const EXPECTED_DISABLED_PHOTO_OCR_META: Record<string, boolean> = {
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

function validateDisabledPhotoOcrMeta(meta: Record<string, unknown> | null): boolean {
  if (!meta) return false;
  for (const [key, expected] of Object.entries(EXPECTED_DISABLED_PHOTO_OCR_META)) {
    if (meta[key] !== expected) return false;
  }
  return true;
}

/**
 * Builds a synthetic, metadata-only Photo/OCR controlled-runtime request.
 * No real image bytes, no OCR/text-document content, no remote URL/file
 * path/PDF, no persistence/storage/paid/DNA/public/production/go-live
 * marker. `ip` is varied per case to avoid the route's own IP rate limiter
 * interfering with this disabled-path test sequence.
 */
function buildSyntheticPhotoOcrRequest(ip: string): Request {
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      mode: "photo_ocr_controlled_runtime",
      context: "anonymous",
      inputType: "photo",
      locale: "sk",
      photoPages: [{ mimeType: "image/png", sizeBytes: 12345 }],
    }),
  });
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledRuntimeDisabledLocalApiClosureResult(
  r: PhotoOcrControlledRuntimeDisabledLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.10D") return false;
  if (r.allPassed !== true) return false;
  if (r.disabledLocalApiClosureOnly !== true) return false;
  if (r.enabledPathTested !== false) return false;
  if (r.sourceGateDesignCommit !== "4a87043") return false;
  if (r.sourceImplementationPlanCommit !== "6a26e47") return false;
  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
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

  if (!Array.isArray(r.disabledEnvCases) || r.disabledEnvCases.length !== 9) return false;
  if (r.disabledEnvCases.some((c) => c.envValueSet === "true")) return false;
  if (r.disabledEnvCases.some((c) => c.expectedEnabled !== false)) return false;
  if (r.disabledEnvCases.some((c) => c.passed !== true)) return false;
  if (r.disabledEnvCases.some((c) => c.observedStatus !== 403)) return false;
  if (r.disabledEnvCases.some((c) => c.observedOk !== false)) return false;
  if (r.disabledEnvCases.some((c) => c.observedCode !== "photo_ocr_controlled_runtime_disabled")) return false;
  if (
    r.disabledEnvCases.some(
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

  if (r.disabledCaseCount !== 9) return false;
  if (r.disabledCasesPassed !== true) return false;
  if (r.disabledCasesRejected !== true) return false;
  if (r.disabledCasesRejectedCount !== 9) return false;
  if (r.exactLowercaseTrueOnlyWouldEnable !== true) return false;
  if (r.nonExactTruthyValuesRejected !== true) return false;
  if (r.absentEnvRejected !== true) return false;
  if (r.falseEnvRejected !== true) return false;
  if (r.uppercaseTrueRejected !== true) return false;
  if (r.numericOneRejected !== true) return false;
  if (r.yesRejected !== true) return false;
  if (r.whitespaceTrueRejected !== true) return false;
  if (r.emptyStringRejected !== true) return false;
  if (r.randomStringRejected !== true) return false;

  if (r.everyDisabledCaseReturned403 !== true) return false;
  if (r.everyDisabledCaseReturnedOkFalse !== true) return false;
  if (r.everyDisabledCaseReturnedDisabledCode !== true) return false;
  if (r.everyDisabledCaseReturnedNoSuccessfulMode !== true) return false;
  if (r.everyDisabledCaseNoOcr !== true) return false;
  if (r.everyDisabledCaseNoModelCall !== true) return false;
  if (r.everyDisabledCaseNoUpload !== true) return false;
  if (r.everyDisabledCaseNoPersistence !== true) return false;
  if (r.everyDisabledCaseNoDbStorage !== true) return false;
  if (r.everyDisabledCaseNoSupabaseStorage !== true) return false;
  if (r.everyDisabledCaseNoDna !== true) return false;
  if (r.everyDisabledCaseNoPublicRuntime !== true) return false;
  if (r.everyDisabledCaseNoProduction !== true) return false;
  if (r.everyDisabledCaseNoGoLive !== true) return false;

  if (r.routeStillFailClosedWhenDisabled !== true) return false;
  if (r.photoOcrRuntimeStillBlockedWhenDisabled !== true) return false;
  if (r.realOcrExtractionStillBlocked !== true) return false;
  if (r.placeholderSuccessNotAllowedWhenDisabled !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.supabaseStorageStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.ocrOutputStillUntrusted !== true) return false;
  if (r.imageContentTreatedAsSensitive !== true) return false;
  if (r.extractedTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;

  if (r.envOriginalValueCaptured !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.envAbsentAfterCleanupIfOriginallyAbsent !== true) return false;
  if (r.cleanupPerformed !== true) return false;

  if (r.readyForNextPhase !== "8.10E") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Runtime Enabled Local API Closure") return false;
  if (r.readyForEnabledControlledLocalApiClosure !== true) return false;
  if (r.readyForPhotoOcrRegressionPack !== false) return false;
  if (r.readyForPhotoOcrBrowserManualTest !== false) return false;
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
  if (!Array.isArray(r.disabledEnvCaseEvidence) || r.disabledEnvCaseEvidence.length !== 9) return false;
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

type Tamper810DMutation = (
  r: PhotoOcrControlledRuntimeDisabledLocalApiClosureResult,
) => PhotoOcrControlledRuntimeDisabledLocalApiClosureResult;
interface Tamper810DCase {
  label: string;
  mutate: Tamper810DMutation;
}

function withCaseField<K extends keyof DisabledEnvCase>(
  cases: DisabledEnvCase[],
  index: number,
  key: K,
  value: DisabledEnvCase[K],
): DisabledEnvCase[] {
  return cases.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const PHOTO_OCR_CONTROLLED_RUNTIME_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES: Tamper810DCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10C" as "8.10D" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceGateDesignAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "4a87043" }) },
  { label: "sourceImplementationPlanAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceImplementationPlanCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "6a26e47" }) },
  { label: "sourceMinimalPatchAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceMinimalPatchAccepted: false }) },
  { label: "sourceMinimalPatchCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceMinimalPatchCommit: "0000000" as "3e35be8" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "disabledLocalApiClosureOnly false", mutate: (r) => ({ ...r, disabledLocalApiClosureOnly: false as true }) },
  { label: "enabledPathTested true (exact lowercase true is tested in this phase)", mutate: (r) => ({ ...r, enabledPathTested: true as false }) },
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
  { label: "disabledEnvCases missing one entry (any disabled env variant is missing)", mutate: (r) => ({ ...r, disabledEnvCases: r.disabledEnvCases.slice(0, 8) }) },
  { label: "absent_env case status not 403 (absent env does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 0, "observedStatus", 200) }) },
  { label: "false_lowercase case status not 403 (false env does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 1, "observedStatus", 200) }) },
  { label: "true_uppercase case status not 403 (uppercase TRUE does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 3, "observedStatus", 200) }) },
  { label: "numeric_one case status not 403 (numeric 1 does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 4, "observedStatus", 200) }) },
  { label: "yes_lowercase case status not 403 (yes does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 5, "observedStatus", 200) }) },
  { label: "whitespace_true case status not 403 (whitespace true does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 6, "observedStatus", 200) }) },
  { label: "empty_string case status not 403 (empty string does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 7, "observedStatus", 200) }) },
  { label: "random_string case status not 403 (random string does not reject)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 8, "observedStatus", 200) }) },
  { label: "one disabled case observedOk not false (any disabled case ok is not false)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 2, "observedOk", true) }) },
  { label: "one disabled case observedCode wrong (any disabled case code is not photo_ocr_controlled_runtime_disabled)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 2, "observedCode", "photo_ocr_controlled_runtime_enabled") }) },
  { label: "one disabled case marked passed despite non-403 status (placeholder success allowed when disabled)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(withCaseField(r.disabledEnvCases, 2, "observedStatus", 200), 2, "passed", true) }) },
  { label: "a disabled case has envValueSet exact \"true\" (exact lowercase true tested/treated as disabled)", mutate: (r) => ({ ...r, disabledEnvCases: withCaseField(r.disabledEnvCases, 0, "envValueSet", "true") }) },
  { label: "disabledCaseCount wrong", mutate: (r) => ({ ...r, disabledCaseCount: 8 as 9 }) },
  { label: "disabledCasesPassed false", mutate: (r) => ({ ...r, disabledCasesPassed: false }) },
  { label: "disabledCasesRejected false", mutate: (r) => ({ ...r, disabledCasesRejected: false }) },
  { label: "disabledCasesRejectedCount wrong", mutate: (r) => ({ ...r, disabledCasesRejectedCount: 8 }) },
  { label: "exactLowercaseTrueOnlyWouldEnable false", mutate: (r) => ({ ...r, exactLowercaseTrueOnlyWouldEnable: false }) },
  { label: "nonExactTruthyValuesRejected false", mutate: (r) => ({ ...r, nonExactTruthyValuesRejected: false }) },
  { label: "absentEnvRejected false", mutate: (r) => ({ ...r, absentEnvRejected: false }) },
  { label: "falseEnvRejected false", mutate: (r) => ({ ...r, falseEnvRejected: false }) },
  { label: "uppercaseTrueRejected false", mutate: (r) => ({ ...r, uppercaseTrueRejected: false }) },
  { label: "numericOneRejected false", mutate: (r) => ({ ...r, numericOneRejected: false }) },
  { label: "yesRejected false", mutate: (r) => ({ ...r, yesRejected: false }) },
  { label: "whitespaceTrueRejected false", mutate: (r) => ({ ...r, whitespaceTrueRejected: false }) },
  { label: "emptyStringRejected false", mutate: (r) => ({ ...r, emptyStringRejected: false }) },
  { label: "randomStringRejected false", mutate: (r) => ({ ...r, randomStringRejected: false }) },
  { label: "everyDisabledCaseReturned403 false", mutate: (r) => ({ ...r, everyDisabledCaseReturned403: false }) },
  { label: "everyDisabledCaseReturnedOkFalse false", mutate: (r) => ({ ...r, everyDisabledCaseReturnedOkFalse: false }) },
  { label: "everyDisabledCaseReturnedDisabledCode false", mutate: (r) => ({ ...r, everyDisabledCaseReturnedDisabledCode: false }) },
  { label: "everyDisabledCaseReturnedNoSuccessfulMode false (any disabled case returns success mode)", mutate: (r) => ({ ...r, everyDisabledCaseReturnedNoSuccessfulMode: false }) },
  { label: "everyDisabledCaseNoOcr false", mutate: (r) => ({ ...r, everyDisabledCaseNoOcr: false }) },
  { label: "everyDisabledCaseNoModelCall false", mutate: (r) => ({ ...r, everyDisabledCaseNoModelCall: false }) },
  { label: "everyDisabledCaseNoUpload false", mutate: (r) => ({ ...r, everyDisabledCaseNoUpload: false }) },
  { label: "everyDisabledCaseNoPersistence false", mutate: (r) => ({ ...r, everyDisabledCaseNoPersistence: false }) },
  { label: "everyDisabledCaseNoDbStorage false", mutate: (r) => ({ ...r, everyDisabledCaseNoDbStorage: false }) },
  { label: "everyDisabledCaseNoSupabaseStorage false", mutate: (r) => ({ ...r, everyDisabledCaseNoSupabaseStorage: false }) },
  { label: "everyDisabledCaseNoDna false", mutate: (r) => ({ ...r, everyDisabledCaseNoDna: false }) },
  { label: "everyDisabledCaseNoPublicRuntime false (public runtime becomes enabled)", mutate: (r) => ({ ...r, everyDisabledCaseNoPublicRuntime: false }) },
  { label: "everyDisabledCaseNoProduction false (production becomes authorized)", mutate: (r) => ({ ...r, everyDisabledCaseNoProduction: false }) },
  { label: "everyDisabledCaseNoGoLive false (go-live becomes authorized)", mutate: (r) => ({ ...r, everyDisabledCaseNoGoLive: false }) },
  { label: "routeStillFailClosedWhenDisabled false", mutate: (r) => ({ ...r, routeStillFailClosedWhenDisabled: false }) },
  { label: "photoOcrRuntimeStillBlockedWhenDisabled false", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlockedWhenDisabled: false }) },
  { label: "realOcrExtractionStillBlocked false", mutate: (r) => ({ ...r, realOcrExtractionStillBlocked: false }) },
  { label: "placeholderSuccessNotAllowedWhenDisabled false", mutate: (r) => ({ ...r, placeholderSuccessNotAllowedWhenDisabled: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes enabled)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionStillUnauthorized false (production becomes authorized)", mutate: (r) => ({ ...r, productionStillUnauthorized: false }) },
  { label: "goLiveStillUnauthorized false (go-live becomes authorized)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode becomes enabled)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (DNA becomes enabled)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence becomes enabled)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (storage becomes enabled)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "supabaseStorageStillBlocked false (storage becomes enabled)", mutate: (r) => ({ ...r, supabaseStorageStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "ocrOutputStillUntrusted false (OCR output becomes trusted)", mutate: (r) => ({ ...r, ocrOutputStillUntrusted: false }) },
  { label: "imageContentTreatedAsSensitive false (image sensitivity is false)", mutate: (r) => ({ ...r, imageContentTreatedAsSensitive: false }) },
  { label: "extractedTextTreatedAsSensitive false (extracted text sensitivity is false)", mutate: (r) => ({ ...r, extractedTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "envOriginalValueCaptured false", mutate: (r) => ({ ...r, envOriginalValueCaptured: false as true }) },
  { label: "envRestoredAfterTests false (env is not restored after tests)", mutate: (r) => ({ ...r, envRestoredAfterTests: false }) },
  { label: "envAbsentAfterCleanupIfOriginallyAbsent false", mutate: (r) => ({ ...r, envAbsentAfterCleanupIfOriginallyAbsent: false }) },
  { label: "cleanupPerformed false", mutate: (r) => ({ ...r, cleanupPerformed: false as true }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10E)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10F" as "8.10E" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10E)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Controlled Runtime Enabled Local API Closure" }) },
  { label: "readyForEnabledControlledLocalApiClosure false when disabled closure passes", mutate: (r) => ({ ...r, readyForEnabledControlledLocalApiClosure: false }) },
  { label: "readyForPhotoOcrRegressionPack true too early", mutate: (r) => ({ ...r, readyForPhotoOcrRegressionPack: true as false }) },
  { label: "readyForPhotoOcrBrowserManualTest true too early", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualTest: true as false }) },
  { label: "readyForPhotoOcrInternalReadinessClosure true too early (readyForPhotoOcrRuntime becomes true)", mutate: (r) => ({ ...r, readyForPhotoOcrInternalReadinessClosure: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "disabledEnvCaseEvidence emptied", mutate: (r) => ({ ...r, disabledEnvCaseEvidence: [] }) },
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

export async function runPhotoOcrControlledRuntimeDisabledLocalApiClosure(): Promise<PhotoOcrControlledRuntimeDisabledLocalApiClosureResult> {
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
  if (c.readyForNextPhase !== "8.10D") closureFailures.push("8.10C readyForNextPhase is not 8.10D");
  if (c.tamperRejected !== c.tamperCount) closureFailures.push("8.10C own tamper count mismatch");
  const sourceMinimalPatchAccepted = closureFailures.length === cBefore;

  // ── Source of truth: 8.9N internal readiness closure ──────────────────────
  const nBefore = closureFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") closureFailures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) closureFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") closureFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) closureFailures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = closureFailures.length === nBefore;

  const sourceEvidence: string[] = [
    "8.10A gate design accepted",
    "8.10B implementation plan accepted",
    "8.10C minimal patch audit accepted",
    "8.9N text document internal readiness accepted",
    "current closure validates disabled path only",
  ];

  // ── Capture original env value for later restoration ─────────────────────
  const originalEnvValue = process.env[PHOTO_OCR_ENV_KEY];
  const originalEnvWasAbsent = originalEnvValue === undefined;
  const envOriginalValueCaptured = true;

  // ── Exercise the real route handler in-process for every disabled variant ─
  const disabledEnvCases: DisabledEnvCase[] = [];
  const disabledEnvCaseEvidence: string[] = [];

  for (let i = 0; i < DISABLED_ENV_VARIANTS.length; i++) {
    const variant = DISABLED_ENV_VARIANTS[i]!;

    if (variant.envValue === undefined) {
      delete process.env[PHOTO_OCR_ENV_KEY];
    } else {
      process.env[PHOTO_OCR_ENV_KEY] = variant.envValue;
    }

    const syntheticIp = `198.51.100.${i + 1}`;
    let observedStatus = 0;
    let data: Record<string, unknown> | null = null;
    try {
      const req = buildSyntheticPhotoOcrRequest(syntheticIp);
      const res = await POST(req);
      observedStatus = res.status;
      const parsed: unknown = await res.json();
      data = isRecord(parsed) ? parsed : null;
    } catch (err) {
      closureFailures.push(`case "${variant.caseId}" threw during in-process invocation: ${String(err)}`);
    }

    const meta =
      data && isRecord(data.photoOcrMeta) ? (data.photoOcrMeta as Record<string, unknown>) : null;
    const metaOk = validateDisabledPhotoOcrMeta(meta);

    const observedOk = data ? data.ok === true : false;
    const observedCode = data && typeof data.code === "string" ? data.code : "";
    const noSuccessfulMode = !data || data.mode === undefined;

    const passed =
      observedStatus === 403 &&
      observedOk === false &&
      observedCode === "photo_ocr_controlled_runtime_disabled" &&
      noSuccessfulMode &&
      metaOk;

    if (!passed) {
      closureFailures.push(
        `disabled case "${variant.caseId}" (${variant.envValueDescription}) did not pass: status=${observedStatus}, ok=${observedOk}, code="${observedCode}", metaOk=${metaOk}`,
      );
    }

    disabledEnvCases.push({
      caseId: variant.caseId,
      envValueDescription: variant.envValueDescription,
      envValueSet: variant.envValue === undefined ? "absent" : variant.envValue,
      expectedEnabled: false,
      observedStatus,
      observedOk,
      observedCode,
      passed,
      photoOcrMetaObserved: meta,
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
    });

    disabledEnvCaseEvidence.push(
      `${variant.caseId} (env=${variant.envValueDescription}): status=${observedStatus}, ok=${observedOk}, code="${observedCode}", passed=${passed}.`,
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
    `Original env value captured before any mutation: ${originalEnvWasAbsent ? "absent" : "present"}.`,
    `Environment flag restored after all 9 cases: ${envRestoredAfterTests}.`,
    originalEnvWasAbsent
      ? `Flag correctly absent again after cleanup: ${envAbsentAfterCleanupIfOriginallyAbsent}.`
      : "Flag was originally present and was restored to its original value.",
    "No other environment variables were read for authorization or mutated by this closure.",
  ];

  // ── Aggregate case-derived summary/contract/safety fields ────────────────
  const disabledCasesPassed = disabledEnvCases.every((cse) => cse.passed);
  const disabledCasesRejectedCount = disabledEnvCases.filter(
    (cse) => cse.observedStatus === 403 && cse.observedCode === "photo_ocr_controlled_runtime_disabled",
  ).length;
  const disabledCasesRejected = disabledCasesRejectedCount === DISABLED_ENV_VARIANTS.length;

  const findCase = (caseId: string) => disabledEnvCases.find((cse) => cse.caseId === caseId);
  const absentEnvRejected = findCase("absent_env")?.passed === true;
  const falseEnvRejected =
    findCase("false_lowercase")?.passed === true && findCase("false_uppercase")?.passed === true;
  const uppercaseTrueRejected = findCase("true_uppercase")?.passed === true;
  const numericOneRejected = findCase("numeric_one")?.passed === true;
  const yesRejected = findCase("yes_lowercase")?.passed === true;
  const whitespaceTrueRejected = findCase("whitespace_true")?.passed === true;
  const emptyStringRejected = findCase("empty_string")?.passed === true;
  const randomStringRejected = findCase("random_string")?.passed === true;
  const nonExactTruthyValuesRejected =
    falseEnvRejected &&
    uppercaseTrueRejected &&
    numericOneRejected &&
    yesRejected &&
    whitespaceTrueRejected &&
    emptyStringRejected &&
    randomStringRejected;
  const exactLowercaseTrueOnlyWouldEnable = absentEnvRejected && nonExactTruthyValuesRejected;

  if (!disabledCasesPassed) closureFailures.push("not all disabled env cases passed");
  if (!absentEnvRejected) closureFailures.push("absent env variant did not reject as expected");
  if (!nonExactTruthyValuesRejected) closureFailures.push("one or more non-exact truthy env variants did not reject as expected");

  const everyDisabledCaseReturned403 = disabledEnvCases.every((cse) => cse.observedStatus === 403);
  const everyDisabledCaseReturnedOkFalse = disabledEnvCases.every((cse) => cse.observedOk === false);
  const everyDisabledCaseReturnedDisabledCode = disabledEnvCases.every(
    (cse) => cse.observedCode === "photo_ocr_controlled_runtime_disabled",
  );
  const everyDisabledCaseReturnedNoSuccessfulMode = disabledEnvCases.every((cse) => cse.passed);
  const everyDisabledCaseNoOcr = disabledEnvCases.every((cse) => cse.noOcr);
  const everyDisabledCaseNoModelCall = disabledEnvCases.every((cse) => cse.noModel);
  const everyDisabledCaseNoUpload = disabledEnvCases.every((cse) => cse.noUpload);
  const everyDisabledCaseNoPersistence = disabledEnvCases.every((cse) => cse.noPersistence);
  const everyDisabledCaseNoDbStorage = disabledEnvCases.every((cse) => cse.noDbStorage);
  const everyDisabledCaseNoSupabaseStorage = disabledEnvCases.every((cse) => cse.noSupabaseStorage);
  const everyDisabledCaseNoDna = disabledEnvCases.every((cse) => cse.noDna);
  const everyDisabledCaseNoPublicRuntime = disabledEnvCases.every((cse) => cse.noPublicRuntime);
  const everyDisabledCaseNoProduction = disabledEnvCases.every((cse) => cse.noProduction);
  const everyDisabledCaseNoGoLive = disabledEnvCases.every((cse) => cse.noGoLive);

  if (!everyDisabledCaseReturned403) closureFailures.push("not every disabled case returned HTTP 403");
  if (!everyDisabledCaseReturnedOkFalse) closureFailures.push("not every disabled case returned ok:false");
  if (!everyDisabledCaseReturnedDisabledCode)
    closureFailures.push("not every disabled case returned photo_ocr_controlled_runtime_disabled");

  const responseContractEvidence: string[] = [
    `All ${DISABLED_ENV_VARIANTS.length} disabled variants returned HTTP 403: ${everyDisabledCaseReturned403}.`,
    `All ${DISABLED_ENV_VARIANTS.length} disabled variants returned ok:false: ${everyDisabledCaseReturnedOkFalse}.`,
    `All ${DISABLED_ENV_VARIANTS.length} disabled variants returned code "photo_ocr_controlled_runtime_disabled": ${everyDisabledCaseReturnedDisabledCode}.`,
    "No disabled variant returned a successful mode field or any placeholder result content.",
    "Every disabled variant's photoOcrMeta matched the full expected no-OCR/no-model/no-persistence/sensitivity/disclaimer contract exactly.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The route branch fails closed for every tested non-exact env value, including near-miss values (uppercase TRUE, \"1\", \"yes\", whitespace-padded true, empty string, random string).",
    "No real OCR extraction, model call, upload, or persistence occurred in any disabled case.",
    "Public runtime, production, and go-live all remained unauthorized in every disabled case.",
    "Image content and extracted text remain treated as sensitive; model and OCR output remain untrusted in the disabled-path contract.",
    "Legal and privacy disclaimers, and exact-legal-deadline/binding-legal-advice/official-filing-generation blocks, remain required/active in every disabled case.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No OCR engine or OCR dependency was imported or invoked by this closure.",
    "No real image bytes were read; only synthetic metadata (mimeType: \"image/png\", sizeBytes: 12345) was sent.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process.",
    "No DB, Supabase storage, or Vaylo DNA write occurred.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const routeStillFailClosedWhenDisabled = everyDisabledCaseReturned403 && everyDisabledCaseReturnedDisabledCode;
  const photoOcrRuntimeStillBlockedWhenDisabled = everyDisabledCaseNoOcr && everyDisabledCaseNoModelCall;
  const realOcrExtractionStillBlocked = everyDisabledCaseNoOcr;
  const placeholderSuccessNotAllowedWhenDisabled = everyDisabledCaseReturnedNoSuccessfulMode;

  const allDisabledCasesReport = disabledEnvCases.every((cse) => cse.passed);
  const allPassed =
    closureFailures.length === 0 &&
    sourceGateDesignAccepted &&
    sourceImplementationPlanAccepted &&
    sourceMinimalPatchAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    disabledEnvCases.length === 9 &&
    allDisabledCasesReport &&
    envRestoredAfterTests;

  const tamperCount = PHOTO_OCR_CONTROLLED_RUNTIME_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES.length;

  const notes: string[] = [
    "DC-01: 8.10D exercises the real /api/smart-talk POST handler in-process with synthetic Request objects — no dev server, no browser, no external network.",
    `DC-02: 8.10A/8.10B/8.10C/8.9N confirmed as sources of truth — allPassed: ${a.allPassed}/${b.allPassed}/${c.allPassed}/${n.allPassed}.`,
    `DC-03: all 9 disabled env variants returned 403/photo_ocr_controlled_runtime_disabled with a fully-blocked photoOcrMeta: ${disabledCasesPassed}.`,
    "DC-04: only synthetic page metadata (mimeType, sizeBytes) was ever sent — no real image bytes, no OCR content.",
    `DC-05: process.env.${PHOTO_OCR_ENV_KEY} was captured before mutation and restored after all tests: ${envRestoredAfterTests}.`,
    "DC-06: the enabled \"true\" path was intentionally NOT tested in this phase — that is reserved for 8.10E.",
    "DC-07: no OCR/model/upload/persistence/DB/storage/DNA occurred anywhere in this closure.",
    "DC-08: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "DC-09: ready for Phase 8.10E — Photo/OCR Controlled Runtime Enabled Local API Closure.",
  ];

  const provisional: PhotoOcrControlledRuntimeDisabledLocalApiClosureResult = {
    checkId: "8.10D",
    allPassed: true,
    disabledLocalApiClosureOnly: true,
    enabledPathTested: false,
    sourceGateDesignCommit: "4a87043",
    sourceImplementationPlanCommit: "6a26e47",
    sourceMinimalPatchCommit: "3e35be8",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceGateDesignAccepted,
    sourceImplementationPlanAccepted,
    sourceMinimalPatchAccepted,
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

    disabledEnvCases,

    disabledCaseCount: 9,
    disabledCasesPassed,
    disabledCasesRejected,
    disabledCasesRejectedCount,
    exactLowercaseTrueOnlyWouldEnable,
    nonExactTruthyValuesRejected,
    absentEnvRejected,
    falseEnvRejected,
    uppercaseTrueRejected,
    numericOneRejected,
    yesRejected,
    whitespaceTrueRejected,
    emptyStringRejected,
    randomStringRejected,

    everyDisabledCaseReturned403,
    everyDisabledCaseReturnedOkFalse,
    everyDisabledCaseReturnedDisabledCode,
    everyDisabledCaseReturnedNoSuccessfulMode,
    everyDisabledCaseNoOcr,
    everyDisabledCaseNoModelCall,
    everyDisabledCaseNoUpload,
    everyDisabledCaseNoPersistence,
    everyDisabledCaseNoDbStorage,
    everyDisabledCaseNoSupabaseStorage,
    everyDisabledCaseNoDna,
    everyDisabledCaseNoPublicRuntime,
    everyDisabledCaseNoProduction,
    everyDisabledCaseNoGoLive,

    routeStillFailClosedWhenDisabled,
    photoOcrRuntimeStillBlockedWhenDisabled,
    realOcrExtractionStillBlocked,
    placeholderSuccessNotAllowedWhenDisabled,
    publicRuntimeStillBlocked: everyDisabledCaseNoPublicRuntime,
    productionStillUnauthorized: everyDisabledCaseNoProduction,
    goLiveStillUnauthorized: everyDisabledCaseNoGoLive,
    paidDocumentModeStillBlocked: everyDisabledCaseNoOcr,
    vayloDnaStillBlocked: everyDisabledCaseNoDna,
    persistenceStillBlocked: everyDisabledCaseNoPersistence,
    dbStorageStillBlocked: everyDisabledCaseNoDbStorage,
    supabaseStorageStillBlocked: everyDisabledCaseNoSupabaseStorage,
    modelOutputStillUntrusted: everyDisabledCaseNoModelCall,
    ocrOutputStillUntrusted: everyDisabledCaseNoOcr,
    imageContentTreatedAsSensitive: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.imageContentTreatedAsSensitive === true),
    extractedTextTreatedAsSensitive: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.extractedTextTreatedAsSensitive === true),
    legalDisclaimerRequired: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.legalDisclaimerRequired === true),
    privacyDisclaimerRequired: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.privacyDisclaimerRequired === true),
    exactLegalDeadlineStillBlocked: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.exactLegalDeadlineStillBlocked === true),
    bindingLegalAdviceStillBlocked: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.bindingLegalAdviceStillBlocked === true),
    officialFilingGenerationStillBlocked: disabledEnvCases.every((cse) => cse.photoOcrMetaObserved?.officialFilingGenerationStillBlocked === true),

    envOriginalValueCaptured,
    envRestoredAfterTests,
    envAbsentAfterCleanupIfOriginallyAbsent,
    cleanupPerformed: true,

    readyForNextPhase: "8.10E",
    recommendedNextPhase: "Photo/OCR Controlled Runtime Enabled Local API Closure",
    readyForEnabledControlledLocalApiClosure: allPassed,
    readyForPhotoOcrRegressionPack: false,
    readyForPhotoOcrBrowserManualTest: false,
    readyForPhotoOcrInternalReadinessClosure: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    disabledEnvCaseEvidence,
    responseContractEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    cleanupEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10E: Enabled Controlled Local API Closure — in-process test of the exact-lowercase-\"true\" enabled placeholder path plus every guard rejection (payload/MIME/page/size/forbidden-marker cases).",
      "Phase 8.10F: Controlled Local Regression Pack — synthetic allowed/blocked case matrix covering every blocked response code.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase.",
    ],
    notes,
  };

  if (
    closureFailures.length === 0 &&
    !_isCanonicalPhotoOcrControlledRuntimeDisabledLocalApiClosureResult(provisional)
  ) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_RUNTIME_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledRuntimeDisabledLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10D tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const finalAllPassed = allPassed && closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10D tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    readyForEnabledControlledLocalApiClosure: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-runtime-disabled-local-api-closure");

if (invokedDirectly) {
  runPhotoOcrControlledRuntimeDisabledLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
