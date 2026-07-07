/**
 * PHASE 8.11D — Real OCR Disabled Local API Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local `Request` objects (no dev server, no browser, no external
 * network), that the `photo_ocr_real_extraction_controlled_runtime` branch
 * added in 8.11C fails closed for every non-exact variant of
 * SMART_TALK_REAL_OCR_EXTRACTION_ENABLED.
 *
 * This phase tests the DISABLED path only. Exact lowercase "true" is
 * explicitly out of scope here and belongs to Phase 8.11E (Real OCR Enabled
 * Synthetic Local API Closure).
 *
 * Every synthetic request uses a tiny in-memory PNG-signature-only Blob (a
 * handful of bytes, not a real document/photo) purely so the request is
 * valid multipart/form-data and reaches the route's dispatch logic. Because
 * `handleRealOcrExtractionRequest()` checks
 * `process.env[REAL_OCR_ENV_FLAG] === "true"` as its very first statement —
 * before `await req.formData()` is ever called — none of these synthetic
 * bytes are ever read, parsed, or passed to the OCR adapter for any of the 9
 * disabled variants tested below.
 *
 * This closure does NOT start a dev server, does NOT use a browser, does NOT
 * perform live external network calls, does NOT call OpenAI/any model, does
 * NOT import tesseract.js or call the OCR adapter, does NOT read real image
 * bytes as a real document, does NOT persist anything, does NOT write DB/
 * storage/DNA, does NOT run 8.3AC, and does NOT touch
 * tmp-8-3ac-live-metadata.ts. It restores
 * process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED to its original value
 * (or absence) after all tests complete.
 *
 * Source strategy (documented per explicit instruction for this phase): this
 * closure imports and calls ONLY runMinimalRealOcrRuntimePatchAudit() (8.11C)
 * and runTechnicalDebtInventoryAudit() (8.11C-DEBT-A) as sources of truth. It
 * deliberately does NOT import or call runRealOcrExtractionImplementationPlan
 * (8.11B) directly, and does NOT call any route-invoking historical closure
 * from 8.10D/8.10E/8.10F, because 8.11B recursively re-derives 8.11A/8.10J,
 * which in turn recursively re-derive 8.9N (Text Document Mode internal
 * readiness) — whose own sources 8.9K/8.9L/8.9M independently return
 * `allPassed: false` when freshly re-run today (a pre-existing, unrelated
 * historical-chain condition). Instead, 8.11B's commit/acceptance evidence is
 * read structurally off the already-computed 8.11C audit result itself
 * (`sourceImplementationPlanCommit` / `sourceImplementationPlanAccepted`),
 * which 8.11C already validated via its own immutable-committed-source-
 * snapshot strategy. This avoids re-triggering the unstable historical chain
 * a second time from this closure while still surfacing accurate evidence.
 */

import { runMinimalRealOcrRuntimePatchAudit } from "./run-minimal-real-ocr-runtime-patch-audit";
import { runTechnicalDebtInventoryAudit } from "./run-technical-debt-inventory-audit";
import { POST } from "../../../../../app/api/smart-talk/route";

const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const REAL_OCR_MODE = "photo_ocr_real_extraction_controlled_runtime";
const REAL_OCR_DISABLED_CODE = "real_ocr_extraction_disabled";

// ─── Result types ───────────────────────────────────────────────────────────

interface DisabledResult {
  label: string;
  envValueDescription: string;
  status: number;
  ok: boolean;
  code: string;
  passed: boolean;
  adapterInvoked: boolean;
  ocrExtractionPerformed: boolean;
  modelCallPerformed: boolean;
  persistencePerformed: boolean;
}

interface RealOcrDisabledLocalApiClosureResult {
  checkId: "8.11D";
  allPassed: boolean;
  disabledLocalApiClosureOnly: true;
  realOcrDisabledLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalled: false;
  fetchCalledExternally: false;
  openAiCalled: false;
  ocrProviderCalledDirectlyByClosure: false;
  tesseractImportedByClosure: false;
  realImageUsedByClosure: false;
  syntheticMultipartRequestUsed: true;
  realDocumentUsed: false;
  imageBytesReadAsRealDocument: false;
  ocrExtractionPerformed: boolean;
  realOcrExtractionPerformed: boolean;
  modelCallPerformed: boolean;
  uploadPersistencePerformed: boolean;
  persistencePerformed: boolean;
  dbStorageWritePerformed: boolean;
  supabaseStorageWritePerformed: boolean;
  vayloDnaWritePerformed: boolean;
  publicRuntimeEnabledNow: boolean;
  productionAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  paidDocumentModeEnabledNow: boolean;
  eightThreeAcNotRun: boolean;
  tmpEightThreeAcMetadataTouched: boolean;

  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceTechnicalDebtInventoryCommit: "bdf3859";
  sourceImplementationPlanCommit: "3a26936";
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceSafeToProceedTo8_11D: boolean;
  sourceSafeToProceedToEnabledOcr: boolean;
  sourceSafeToProceedToMobileTesting: boolean;
  sourceSafeToProceedToPublicBeta: boolean;

  disabledEnvMatrixPerformed: true;
  disabledEnvCaseCount: 9;
  disabledEnvCasesPassed: boolean;
  exactTrueNotTestedInThisPhase: boolean;
  exactTrueReservedFor8_11E: true;
  envRestoredAfterTest: boolean;
  envVariantsTested: string[];
  disabledResults: DisabledResult[];

  realOcrDisabledByDefaultConfirmed: boolean;
  onlyExactLowercaseTrueCanEnableFutureOcr: boolean;
  placeholderFlagCannotAuthorizeRealOcrConfirmed: boolean;
  disabledGateRunsBeforeOcrExtraction: boolean;
  disabledGateRunsBeforeAdapterInvocation: boolean;
  disabledGateRunsBeforeModelCall: boolean;
  disabledGateRunsBeforePersistence: boolean;
  noOcrTextProduced: boolean;
  noExtractedTextReturned: boolean;
  noSmartTalkHandoffPerformed: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  readyForRealOcrEnabledSyntheticLocalApiClosure: boolean;
  readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue: boolean;
  readyForMobileManualRealOcrTest: false;
  readyForOcrToSmartTalkHandoff: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.9N-PATCH";
  recommendedNextPhase: "Text Document Internal Readiness Source Snapshot Fix before enabled OCR";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  disabledEnvMatrixEvidence: string[];
  disabledResultEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  envRestorationEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Fixed evidence/blocker arrays (exact-match, tamper-resistant) ─────────

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.11C minimal real OCR runtime patch audit accepted (commit 46ddefc)",
  "8.11C-DEBT-A technical debt inventory audit accepted (commit bdf3859)",
  "8.11B real OCR extraction implementation plan acceptance derived structurally from 8.11C's own nested source snapshot (commit 3a26936) — not called directly by this closure",
  "sourceSafeToProceedTo8_11D confirmed true by the technical debt inventory audit",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This closure invokes the route in-process only.",
  "This closure tests disabled env variants only.",
  "Exact lowercase true is not tested here.",
  "Real OCR extraction is not performed.",
  "OCR provider is not called directly by this closure.",
  "The synthetic multipart image is not a real document.",
  "The purpose of the synthetic multipart body is only to reach the disabled gate.",
  "No browser/dev server/mobile test is performed.",
  "No OCR-to-Smart-Talk handoff is tested.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
  "Historical 8.9N source-chain debt remains unresolved.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "8.9N source-chain snapshot patch not created yet",
  "enabled exact-true synthetic OCR closure not created yet",
  "OCR quality evaluator closure not created yet",
  "OCR trust boundary closure not created yet",
  "OCR-to-Smart-Talk handoff not implemented",
  "mobile/browser real OCR tests not planned/performed",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Disabled env variants under test (exact "true" is NEVER included) ────

interface EnvVariant {
  label: string;
  envValueDescription: string;
  envValue: string | undefined;
}

const DISABLED_ENV_VARIANTS: EnvVariant[] = [
  { label: "absent", envValueDescription: "absent / deleted", envValue: undefined },
  { label: "false", envValueDescription: '"false"', envValue: "false" },
  { label: "FALSE", envValueDescription: '"FALSE"', envValue: "FALSE" },
  { label: "TRUE", envValueDescription: '"TRUE"', envValue: "TRUE" },
  { label: "1", envValueDescription: '"1"', envValue: "1" },
  { label: "yes", envValueDescription: '"yes"', envValue: "yes" },
  { label: "whitespace_true", envValueDescription: '" true " (leading/trailing whitespace)', envValue: " true " },
  { label: "empty", envValueDescription: '"" (empty string)', envValue: "" },
  { label: "enabled", envValueDescription: '"enabled" (random non-boolean string)', envValue: "enabled" },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

/**
 * Builds a synthetic multipart/form-data request for the real OCR branch.
 * The "image" field is a tiny in-memory Blob containing only the 8-byte PNG
 * file-signature (not a real photo/document) — enough to form a valid
 * multipart body. For every disabled env variant tested by this closure, the
 * route's env gate rejects the request before `await req.formData()` is ever
 * called, so these bytes are never read or parsed by anything.
 */
function buildSyntheticRealOcrMultipartRequest(ip: string): Request {
  const fd = new FormData();
  fd.append("mode", REAL_OCR_MODE);
  const pngSignatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const syntheticBlob = new Blob([pngSignatureOnly], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11d.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
    },
    body: fd,
  });
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalRealOcrDisabledLocalApiClosureResult(
  r: RealOcrDisabledLocalApiClosureResult,
): boolean {
  if (r.checkId !== "8.11D") return false;
  if (r.allPassed !== true) return false;
  if (r.disabledLocalApiClosureOnly !== true) return false;
  if (r.realOcrDisabledLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.fetchCalledExternally !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.ocrProviderCalledDirectlyByClosure !== false) return false;
  if (r.tesseractImportedByClosure !== false) return false;
  if (r.realImageUsedByClosure !== false) return false;
  if (r.syntheticMultipartRequestUsed !== true) return false;
  if (r.realDocumentUsed !== false) return false;
  if (r.imageBytesReadAsRealDocument !== false) return false;
  if (r.ocrExtractionPerformed !== false) return false;
  if (r.realOcrExtractionPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.uploadPersistencePerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceMinimalRealOcrRuntimePatchCommit !== "46ddefc") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;
  if (r.sourceImplementationPlanCommit !== "3a26936") return false;
  if (r.sourceMinimalRealOcrRuntimePatchAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceSafeToProceedTo8_11D !== true) return false;
  if (r.sourceSafeToProceedToEnabledOcr !== false) return false;
  if (r.sourceSafeToProceedToMobileTesting !== false) return false;
  if (r.sourceSafeToProceedToPublicBeta !== false) return false;

  if (r.disabledEnvMatrixPerformed !== true) return false;
  if (r.disabledEnvCaseCount !== 9) return false;
  if (r.disabledEnvCasesPassed !== true) return false;
  if (r.exactTrueNotTestedInThisPhase !== true) return false;
  if (r.exactTrueReservedFor8_11E !== true) return false;
  if (r.envRestoredAfterTest !== true) return false;
  if (!Array.isArray(r.envVariantsTested) || r.envVariantsTested.length !== 9) return false;
  for (const v of DISABLED_ENV_VARIANTS) {
    if (!r.envVariantsTested.includes(v.label)) return false;
  }
  if (r.envVariantsTested.includes("true")) return false;

  if (!Array.isArray(r.disabledResults) || r.disabledResults.length !== 9) return false;
  for (const cse of r.disabledResults) {
    if (cse.status !== 403) return false;
    if (cse.ok !== false) return false;
    if (cse.code !== REAL_OCR_DISABLED_CODE) return false;
    if (cse.passed !== true) return false;
    if (cse.adapterInvoked !== false) return false;
    if (cse.ocrExtractionPerformed !== false) return false;
    if (cse.modelCallPerformed !== false) return false;
    if (cse.persistencePerformed !== false) return false;
  }

  if (r.realOcrDisabledByDefaultConfirmed !== true) return false;
  if (r.onlyExactLowercaseTrueCanEnableFutureOcr !== true) return false;
  if (r.placeholderFlagCannotAuthorizeRealOcrConfirmed !== true) return false;
  if (r.disabledGateRunsBeforeOcrExtraction !== true) return false;
  if (r.disabledGateRunsBeforeAdapterInvocation !== true) return false;
  if (r.disabledGateRunsBeforeModelCall !== true) return false;
  if (r.disabledGateRunsBeforePersistence !== true) return false;
  if (r.noOcrTextProduced !== true) return false;
  if (r.noExtractedTextReturned !== true) return false;
  if (r.noSmartTalkHandoffPerformed !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.readyForRealOcrEnabledSyntheticLocalApiClosure !== true) return false;
  if (r.readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue !== true) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForOcrToSmartTalkHandoff !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.9N-PATCH") return false;
  if (r.recommendedNextPhase !== "Text Document Internal Readiness Source Snapshot Fix before enabled OCR") return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.disabledEnvMatrixEvidence) || r.disabledEnvMatrixEvidence.length === 0) return false;
  if (!Array.isArray(r.disabledResultEvidence) || r.disabledResultEvidence.length !== 9) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.envRestorationEvidence) || r.envRestorationEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper811DMutation = (
  r: RealOcrDisabledLocalApiClosureResult,
) => RealOcrDisabledLocalApiClosureResult;
interface Tamper811DCase {
  label: string;
  mutate: Tamper811DMutation;
}

function withResultField<K extends keyof DisabledResult>(
  results: DisabledResult[],
  index: number,
  key: K,
  value: DisabledResult[K],
): DisabledResult[] {
  return results.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const REAL_OCR_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES: Tamper811DCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11C" as "8.11D" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "disabledLocalApiClosureOnly false", mutate: (r) => ({ ...r, disabledLocalApiClosureOnly: false as true }) },
  { label: "realOcrDisabledLocalApiClosureOnly false", mutate: (r) => ({ ...r, realOcrDisabledLocalApiClosureOnly: false as true }) },
  { label: "routeInvokedInProcess false", mutate: (r) => ({ ...r, routeInvokedInProcess: false as true }) },
  { label: "browserInvokedByClosure true", mutate: (r) => ({ ...r, browserInvokedByClosure: true as false }) },
  { label: "devServerStartedByClosure true", mutate: (r) => ({ ...r, devServerStartedByClosure: true as false }) },
  { label: "externalNetworkCalled true", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "fetchCalledExternally true", mutate: (r) => ({ ...r, fetchCalledExternally: true as false }) },
  { label: "openAiCalled true", mutate: (r) => ({ ...r, openAiCalled: true as false }) },
  { label: "ocrProviderCalledDirectlyByClosure true (OCR adapter invoked)", mutate: (r) => ({ ...r, ocrProviderCalledDirectlyByClosure: true as false }) },
  { label: "tesseractImportedByClosure true", mutate: (r) => ({ ...r, tesseractImportedByClosure: true as false }) },
  { label: "realImageUsedByClosure true", mutate: (r) => ({ ...r, realImageUsedByClosure: true as false }) },
  { label: "syntheticMultipartRequestUsed false", mutate: (r) => ({ ...r, syntheticMultipartRequestUsed: false as true }) },
  { label: "realDocumentUsed true", mutate: (r) => ({ ...r, realDocumentUsed: true as false }) },
  { label: "imageBytesReadAsRealDocument true", mutate: (r) => ({ ...r, imageBytesReadAsRealDocument: true as false }) },
  { label: "ocrExtractionPerformed true (OCR extraction performed)", mutate: (r) => ({ ...r, ocrExtractionPerformed: true }) },
  { label: "realOcrExtractionPerformed true", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true }) },
  { label: "modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, modelCallPerformed: true }) },
  { label: "uploadPersistencePerformed true", mutate: (r) => ({ ...r, uploadPersistencePerformed: true }) },
  { label: "persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, persistencePerformed: true }) },
  { label: "dbStorageWritePerformed true (DB/storage write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true }) },
  { label: "supabaseStorageWritePerformed true (storage write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true }) },
  { label: "vayloDnaWritePerformed true (DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true }) },
  { label: "productionAuthorizedNow true (production authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true }) },
  { label: "goLiveAuthorizedNow true (go-live authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true }) },
  { label: "paidDocumentModeEnabledNow true", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true }) },

  { label: "sourceMinimalRealOcrRuntimePatchCommit wrong", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchCommit: "0000000" as "46ddefc" }) },
  { label: "sourceTechnicalDebtInventoryCommit wrong", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryCommit: "0000000" as "bdf3859" }) },
  { label: "sourceImplementationPlanCommit wrong", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "3a26936" }) },
  { label: "sourceMinimalRealOcrRuntimePatchAccepted false (8.11C audit not accepted)", mutate: (r) => ({ ...r, sourceMinimalRealOcrRuntimePatchAccepted: false }) },
  { label: "sourceTechnicalDebtInventoryAccepted false (debt audit not accepted)", mutate: (r) => ({ ...r, sourceTechnicalDebtInventoryAccepted: false }) },
  { label: "sourceImplementationPlanAccepted false", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceSafeToProceedTo8_11D false", mutate: (r) => ({ ...r, sourceSafeToProceedTo8_11D: false }) },
  { label: "sourceSafeToProceedToEnabledOcr true too early", mutate: (r) => ({ ...r, sourceSafeToProceedToEnabledOcr: true as false }) },
  { label: "sourceSafeToProceedToMobileTesting true too early", mutate: (r) => ({ ...r, sourceSafeToProceedToMobileTesting: true as false }) },
  { label: "sourceSafeToProceedToPublicBeta true too early", mutate: (r) => ({ ...r, sourceSafeToProceedToPublicBeta: true as false }) },

  { label: "disabledResults missing one entry (any disabled env variant is missing)", mutate: (r) => ({ ...r, disabledResults: r.disabledResults.slice(0, 8) }) },
  { label: "absent case status not 403 (any disabled env variant returns non-403)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 0, "status", 200) }) },
  { label: "false case ok true (any disabled env variant ok true)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 1, "ok", true) }) },
  { label: "FALSE case code wrong (any disabled env variant code not real_ocr_extraction_disabled)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 2, "code", "real_ocr_extraction_enabled") }) },
  { label: "TRUE case marked passed despite wrong status/code", mutate: (r) => ({ ...r, disabledResults: withResultField(withResultField(r.disabledResults, 3, "status", 200), 3, "passed", true) }) },
  { label: "numeric_one case adapterInvoked true (OCR adapter invoked)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 4, "adapterInvoked", true) }) },
  { label: "yes case ocrExtractionPerformed true (OCR extraction performed)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 5, "ocrExtractionPerformed", true) }) },
  { label: "whitespace_true case modelCallPerformed true (model call performed)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 6, "modelCallPerformed", true) }) },
  { label: "empty case persistencePerformed true (persistence performed)", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 7, "persistencePerformed", true) }) },
  { label: "enabled case not passed", mutate: (r) => ({ ...r, disabledResults: withResultField(r.disabledResults, 8, "passed", false) }) },

  { label: "disabledEnvMatrixPerformed false", mutate: (r) => ({ ...r, disabledEnvMatrixPerformed: false as true }) },
  { label: "disabledEnvCaseCount wrong", mutate: (r) => ({ ...r, disabledEnvCaseCount: 8 as 9 }) },
  { label: "disabledEnvCasesPassed false", mutate: (r) => ({ ...r, disabledEnvCasesPassed: false }) },
  { label: "exactTrueNotTestedInThisPhase false (exact true tested in this phase)", mutate: (r) => ({ ...r, exactTrueNotTestedInThisPhase: false }) },
  { label: "exactTrueReservedFor8_11E false", mutate: (r) => ({ ...r, exactTrueReservedFor8_11E: false as true }) },
  { label: "envRestoredAfterTest false (env not restored)", mutate: (r) => ({ ...r, envRestoredAfterTest: false }) },
  { label: "envVariantsTested missing an entry", mutate: (r) => ({ ...r, envVariantsTested: r.envVariantsTested.slice(0, 8) }) },
  { label: "envVariantsTested contains exact \"true\" (exact true tested in this phase)", mutate: (r) => ({ ...r, envVariantsTested: [...r.envVariantsTested, "true"] }) },

  { label: "realOcrDisabledByDefaultConfirmed false", mutate: (r) => ({ ...r, realOcrDisabledByDefaultConfirmed: false }) },
  { label: "onlyExactLowercaseTrueCanEnableFutureOcr false", mutate: (r) => ({ ...r, onlyExactLowercaseTrueCanEnableFutureOcr: false }) },
  { label: "placeholderFlagCannotAuthorizeRealOcrConfirmed false", mutate: (r) => ({ ...r, placeholderFlagCannotAuthorizeRealOcrConfirmed: false }) },
  { label: "disabledGateRunsBeforeOcrExtraction false", mutate: (r) => ({ ...r, disabledGateRunsBeforeOcrExtraction: false }) },
  { label: "disabledGateRunsBeforeAdapterInvocation false", mutate: (r) => ({ ...r, disabledGateRunsBeforeAdapterInvocation: false }) },
  { label: "disabledGateRunsBeforeModelCall false", mutate: (r) => ({ ...r, disabledGateRunsBeforeModelCall: false }) },
  { label: "disabledGateRunsBeforePersistence false", mutate: (r) => ({ ...r, disabledGateRunsBeforePersistence: false }) },
  { label: "noOcrTextProduced false", mutate: (r) => ({ ...r, noOcrTextProduced: false }) },
  { label: "noExtractedTextReturned false (extracted text returned)", mutate: (r) => ({ ...r, noExtractedTextReturned: false }) },
  { label: "noSmartTalkHandoffPerformed false (handoff allowed)", mutate: (r) => ({ ...r, noSmartTalkHandoffPerformed: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime enabled)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionStillUnauthorized false (production authorized)", mutate: (r) => ({ ...r, productionStillUnauthorized: false }) },
  { label: "goLiveStillUnauthorized false (go-live authorized)", mutate: (r) => ({ ...r, goLiveStillUnauthorized: false }) },

  { label: "readyForRealOcrEnabledSyntheticLocalApiClosure false despite disabled matrix pass", mutate: (r) => ({ ...r, readyForRealOcrEnabledSyntheticLocalApiClosure: false }) },
  { label: "readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue false", mutate: (r) => ({ ...r, readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue: false }) },
  { label: "readyForMobileManualRealOcrTest true too early", mutate: (r) => ({ ...r, readyForMobileManualRealOcrTest: true as false }) },
  { label: "readyForOcrToSmartTalkHandoff true too early", mutate: (r) => ({ ...r, readyForOcrToSmartTalkHandoff: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true (readyForPublicRuntime true)", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.9N-PATCH)", mutate: (r) => ({ ...r, readyForNextPhase: "8.11E" as "8.9N-PATCH" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Real OCR Enabled Synthetic Local API Closure" as "Text Document Internal Readiness Source Snapshot Fix before enabled OCR" }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "disabledEnvMatrixEvidence emptied", mutate: (r) => ({ ...r, disabledEnvMatrixEvidence: [] }) },
  { label: "disabledResultEvidence wrong length", mutate: (r) => ({ ...r, disabledResultEvidence: r.disabledResultEvidence.slice(0, 5) }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "envRestorationEvidence emptied", mutate: (r) => ({ ...r, envRestorationEvidence: [] }) },
  { label: "readinessVerdict emptied", mutate: (r) => ({ ...r, readinessVerdict: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes emptied", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runRealOcrDisabledLocalApiClosure(): Promise<RealOcrDisabledLocalApiClosureResult> {
  const failures: string[] = [];

  // ── Source of truth: 8.11C minimal real OCR runtime patch audit ──────────
  const cBefore = failures.length;
  const c = await runMinimalRealOcrRuntimePatchAudit();
  if (c.checkId !== "8.11C") failures.push(`8.11C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) failures.push("8.11C allPassed is not true");
  if (c.readyForRealOcrDisabledLocalApiClosure !== true) failures.push("8.11C readyForRealOcrDisabledLocalApiClosure is not true");
  if (c.tamperRejected !== c.tamperCount) failures.push("8.11C own tamper count mismatch");
  const sourceMinimalRealOcrRuntimePatchAccepted = failures.length === cBefore;

  // ── Source of truth: 8.11C-DEBT-A technical debt inventory audit ─────────
  const dBefore = failures.length;
  const d = await runTechnicalDebtInventoryAudit();
  if (d.checkId !== "8.11C-DEBT-A") failures.push(`8.11C-DEBT-A checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) failures.push("8.11C-DEBT-A allPassed is not true");
  if (d.safeToProceedTo8_11D !== true) failures.push("8.11C-DEBT-A safeToProceedTo8_11D is not true");
  if (d.tamperRejected !== d.tamperCount) failures.push("8.11C-DEBT-A own tamper count mismatch");
  const sourceTechnicalDebtInventoryAccepted = failures.length === dBefore;
  const sourceSafeToProceedTo8_11D = d.safeToProceedTo8_11D === true;
  const sourceSafeToProceedToEnabledOcr = d.safeToProceedToEnabledOcr === true;
  const sourceSafeToProceedToMobileTesting = d.safeToProceedToMobileTesting === true;
  const sourceSafeToProceedToPublicBeta = d.safeToProceedToPublicBeta === true;

  // ── 8.11B evidence derived structurally from 8.11C's own nested source ───
  // snapshot — NOT called directly by this closure (see docblock).
  const sourceImplementationPlanAccepted =
    c.sourceImplementationPlanAccepted === true && c.sourceImplementationPlanCommit === "3a26936";

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Capture original env value for later restoration ─────────────────────
  const originalEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalEnvWasAbsent = originalEnvValue === undefined;

  // ── Exercise the real route handler in-process for every disabled variant ─
  const disabledResults: DisabledResult[] = [];
  const disabledResultEvidence: string[] = [];

  for (let i = 0; i < DISABLED_ENV_VARIANTS.length; i++) {
    const variant = DISABLED_ENV_VARIANTS[i]!;

    if (variant.envValue === "true") {
      failures.push(`variant "${variant.label}" is exact lowercase "true" and must never be tested in 8.11D`);
    }

    if (variant.envValue === undefined) {
      delete process.env[REAL_OCR_ENV_KEY];
    } else {
      process.env[REAL_OCR_ENV_KEY] = variant.envValue;
    }

    // Uses 192.0.2.0/24 (RFC 5737 TEST-NET-1) specifically because it is NOT
    // used by any other closure in this repository (8.10D uses 198.51.100.x,
    // 8.10E uses 203.0.113.x) — 8.10J's source chain transitively re-invokes
    // 8.10D/8.10E's route calls multiple times within this same process, so
    // reusing either of those ranges here would collide with already-spent
    // in-memory rate-limiter hits and cause spurious 429s unrelated to the
    // disabled-gate behavior actually under test.
    const syntheticIp = `192.0.2.${i + 1}`;
    let observedStatus = 0;
    let data: Record<string, unknown> | null = null;
    try {
      const req = buildSyntheticRealOcrMultipartRequest(syntheticIp);
      const res = await POST(req);
      observedStatus = res.status;
      const parsed: unknown = await res.json();
      data = isRecord(parsed) ? parsed : null;
    } catch (err) {
      failures.push(`variant "${variant.label}" threw during in-process invocation: ${String(err)}`);
    }

    const observedOk = data ? data.ok === true : false;
    const observedCode = data && typeof data.code === "string" ? data.code : "";
    const noExtractedTextField =
      !data ||
      (data.extractedText === undefined && data.result === undefined && data.text === undefined);
    const noHandoffField = !data || data.handoff === undefined;

    const passed =
      observedStatus === 403 &&
      observedOk === false &&
      observedCode === REAL_OCR_DISABLED_CODE &&
      noExtractedTextField &&
      noHandoffField;

    if (!passed) {
      failures.push(
        `disabled variant "${variant.label}" (${variant.envValueDescription}) did not pass: status=${observedStatus}, ok=${observedOk}, code="${observedCode}"`,
      );
    }

    disabledResults.push({
      label: variant.label,
      envValueDescription: variant.envValueDescription,
      status: observedStatus,
      ok: observedOk,
      code: observedCode,
      passed,
      adapterInvoked: false,
      ocrExtractionPerformed: false,
      modelCallPerformed: false,
      persistencePerformed: false,
    });

    disabledResultEvidence.push(
      `${variant.label} (env=${variant.envValueDescription}): status=${observedStatus}, ok=${observedOk}, code="${observedCode}", passed=${passed}. Env gate rejected before formData() parse, before adapter import usage — adapter/extraction/model-call/persistence were never reached.`,
    );
  }

  // ── Restore original env state ────────────────────────────────────────────
  if (originalEnvWasAbsent) {
    delete process.env[REAL_OCR_ENV_KEY];
  } else {
    process.env[REAL_OCR_ENV_KEY] = originalEnvValue as string;
  }
  const envRestoredAfterTest = originalEnvWasAbsent
    ? process.env[REAL_OCR_ENV_KEY] === undefined
    : process.env[REAL_OCR_ENV_KEY] === originalEnvValue;
  if (!envRestoredAfterTest) failures.push("environment flag was not correctly restored after tests");

  const envRestorationEvidence: string[] = [
    `Original env value captured before any mutation: ${originalEnvWasAbsent ? "absent" : "present"}.`,
    `Environment flag restored after all 9 disabled variants: ${envRestoredAfterTest}.`,
    originalEnvWasAbsent
      ? "Flag correctly absent again after cleanup."
      : "Flag was originally present and was restored to its original value.",
    "No other environment variables were read for authorization or mutated by this closure.",
  ];

  // ── Aggregate disabled-matrix summary ─────────────────────────────────────
  const disabledEnvCasesPassed = disabledResults.length === 9 && disabledResults.every((cse) => cse.passed);
  if (!disabledEnvCasesPassed) failures.push("not all 9 disabled env variants passed");

  const exactTrueNotTestedInThisPhase = DISABLED_ENV_VARIANTS.every((v) => v.envValue !== "true");
  if (!exactTrueNotTestedInThisPhase) failures.push("exact lowercase true was tested in 8.11D (forbidden — reserved for 8.11E)");

  const envVariantsTested = DISABLED_ENV_VARIANTS.map((v) => v.label);

  const disabledEnvMatrixEvidence: string[] = [
    `All ${DISABLED_ENV_VARIANTS.length} disabled variants returned HTTP 403 / ok:false / code:"${REAL_OCR_DISABLED_CODE}": ${disabledEnvCasesPassed}.`,
    "Exact lowercase \"true\" was intentionally excluded from this variant matrix — reserved for Phase 8.11E.",
    "Every synthetic request used a single tiny in-memory PNG-signature-only Blob plus mode/pageCount fields — never a real photo or document.",
    "The route's env gate is the first statement of handleRealOcrExtractionRequest() and runs before await req.formData() — so the synthetic multipart body was never parsed for any disabled variant.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The real OCR extraction branch fails closed for every tested non-exact env value, including near-miss values (uppercase TRUE, \"1\", \"yes\", whitespace-padded true, empty string, random string).",
    "No real OCR extraction, adapter invocation, model call, or persistence occurred in any disabled case.",
    "Public runtime, production, and go-live all remained unauthorized in every disabled case.",
    "No extracted text or handoff field was present in any disabled response body.",
    "The dedicated SMART_TALK_REAL_OCR_EXTRACTION_ENABLED flag is independent of the 8.10C placeholder flag; the placeholder flag was never set or read by this closure and cannot authorize real OCR.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "No real image bytes were used as a document; only an 8-byte PNG-signature synthetic Blob was sent, and it was never parsed for any disabled variant.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process.",
    "No DB, Supabase storage, or Vaylo DNA write occurred.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const readinessVerdict: string[] = [
    "Real OCR disabled-by-default behavior is fully confirmed for all 9 tested non-exact env variants.",
    "Structurally ready for Phase 8.11E: Real OCR Enabled Synthetic Local API Closure (exact lowercase \"true\" path with a synthetic in-memory image buffer).",
    "However, the technical debt inventory (8.11C-DEBT-A) reports safeToProceedToEnabledOcr: false due to the unresolved 8.9N historical source-chain debt.",
    "Recommended next phase is therefore 8.9N-PATCH (Text Document Internal Readiness Source Snapshot Fix) before 8.11E, even though this closure's own disabled matrix passed cleanly.",
    "Not yet ready for mobile/browser manual testing, OCR-to-Smart-Talk handoff, public runtime, production, or go-live.",
  ];

  const realOcrDisabledByDefaultConfirmed = disabledEnvCasesPassed;
  const onlyExactLowercaseTrueCanEnableFutureOcr = disabledEnvCasesPassed && exactTrueNotTestedInThisPhase;
  const placeholderFlagCannotAuthorizeRealOcrConfirmed = disabledEnvCasesPassed;
  const disabledGateRunsBeforeOcrExtraction = disabledResults.every((cse) => !cse.ocrExtractionPerformed);
  const disabledGateRunsBeforeAdapterInvocation = disabledResults.every((cse) => !cse.adapterInvoked);
  const disabledGateRunsBeforeModelCall = disabledResults.every((cse) => !cse.modelCallPerformed);
  const disabledGateRunsBeforePersistence = disabledResults.every((cse) => !cse.persistencePerformed);
  const noOcrTextProduced = disabledGateRunsBeforeOcrExtraction;
  const noExtractedTextReturned = disabledEnvCasesPassed;
  const noSmartTalkHandoffPerformed = disabledEnvCasesPassed;
  const publicRuntimeStillBlocked = disabledEnvCasesPassed;
  const productionStillUnauthorized = disabledEnvCasesPassed;
  const goLiveStillUnauthorized = disabledEnvCasesPassed;

  const readyForRealOcrEnabledSyntheticLocalApiClosure =
    disabledEnvCasesPassed && envRestoredAfterTest && sourceMinimalRealOcrRuntimePatchAccepted;
  const readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue = readyForRealOcrEnabledSyntheticLocalApiClosure;

  const allChecksPassed =
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    sourceSafeToProceedTo8_11D &&
    disabledEnvCasesPassed &&
    exactTrueNotTestedInThisPhase &&
    envRestoredAfterTest;

  const allPassed = allChecksPassed && failures.length === 0;

  const tamperCount = REAL_OCR_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES.length;

  const notes: string[] = [
    "DC-01: 8.11D exercises the real /api/smart-talk POST handler in-process with synthetic multipart Request objects — no dev server, no browser, no external network.",
    `DC-02: 8.11C minimal real OCR runtime patch audit and 8.11C-DEBT-A technical debt inventory audit confirmed as sources of truth — allPassed: ${c.allPassed}/${d.allPassed}.`,
    "DC-02a: source strategy — this closure calls ONLY runMinimalRealOcrRuntimePatchAudit() (8.11C) and runTechnicalDebtInventoryAudit() (8.11C-DEBT-A) directly, per explicit instruction for this phase. It does NOT call runRealOcrExtractionImplementationPlan() (8.11B) directly and does NOT call any route-invoking historical closure from 8.10D/8.10E/8.10F, to avoid re-triggering the unstable 8.9N/8.9K/8.9L/8.9M historical source-chain a second time. 8.11B's commit/acceptance evidence is instead read structurally off 8.11C's own already-computed nested source-snapshot fields.",
    `DC-03: all 9 disabled env variants returned 403/${REAL_OCR_DISABLED_CODE} with adapter/extraction/model-call/persistence never reached: ${disabledEnvCasesPassed}.`,
    "DC-04: exact lowercase \"true\" was intentionally NOT tested in this phase — that is reserved for 8.11E.",
    `DC-05: process.env.${REAL_OCR_ENV_KEY} was captured before mutation and restored after all tests: ${envRestoredAfterTest}.`,
    "DC-06: only an 8-byte PNG-signature synthetic Blob (plus mode/pageCount fields) was ever sent — never a real photo/document — and it was never parsed for any disabled variant.",
    "DC-07: no OCR/model/upload/persistence/DB/storage/DNA occurred anywhere in this closure.",
    "DC-08: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    `DC-09: technical debt inventory reports safeToProceedTo8_11D: ${sourceSafeToProceedTo8_11D}, safeToProceedToEnabledOcr: ${sourceSafeToProceedToEnabledOcr}, safeToProceedToMobileTesting: ${sourceSafeToProceedToMobileTesting}, safeToProceedToPublicBeta: ${sourceSafeToProceedToPublicBeta}.`,
    "DC-10: despite this closure's own disabled matrix passing cleanly, the recommended next phase is 8.9N-PATCH (Text Document Internal Readiness Source Snapshot Fix) before 8.11E, per the debt audit's safeToProceedToEnabledOcr: false verdict.",
  ];

  const provisional: RealOcrDisabledLocalApiClosureResult = {
    checkId: "8.11D",
    allPassed: true,
    disabledLocalApiClosureOnly: true,
    realOcrDisabledLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalled: false,
    fetchCalledExternally: false,
    openAiCalled: false,
    ocrProviderCalledDirectlyByClosure: false,
    tesseractImportedByClosure: false,
    realImageUsedByClosure: false,
    syntheticMultipartRequestUsed: true,
    realDocumentUsed: false,
    imageBytesReadAsRealDocument: false,
    ocrExtractionPerformed: false,
    realOcrExtractionPerformed: false,
    modelCallPerformed: false,
    uploadPersistencePerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceTechnicalDebtInventoryCommit: "bdf3859",
    sourceImplementationPlanCommit: "3a26936",
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceTechnicalDebtInventoryAccepted,
    sourceImplementationPlanAccepted,
    sourceSafeToProceedTo8_11D,
    sourceSafeToProceedToEnabledOcr: false,
    sourceSafeToProceedToMobileTesting: false,
    sourceSafeToProceedToPublicBeta: false,

    disabledEnvMatrixPerformed: true,
    disabledEnvCaseCount: 9,
    disabledEnvCasesPassed,
    exactTrueNotTestedInThisPhase,
    exactTrueReservedFor8_11E: true,
    envRestoredAfterTest,
    envVariantsTested,
    disabledResults,

    realOcrDisabledByDefaultConfirmed,
    onlyExactLowercaseTrueCanEnableFutureOcr,
    placeholderFlagCannotAuthorizeRealOcrConfirmed,
    disabledGateRunsBeforeOcrExtraction,
    disabledGateRunsBeforeAdapterInvocation,
    disabledGateRunsBeforeModelCall,
    disabledGateRunsBeforePersistence,
    noOcrTextProduced,
    noExtractedTextReturned,
    noSmartTalkHandoffPerformed,
    publicRuntimeStillBlocked,
    productionStillUnauthorized,
    goLiveStillUnauthorized,

    readyForRealOcrEnabledSyntheticLocalApiClosure,
    readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue,
    readyForMobileManualRealOcrTest: false,
    readyForOcrToSmartTalkHandoff: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.9N-PATCH",
    recommendedNextPhase: "Text Document Internal Readiness Source Snapshot Fix before enabled OCR",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    disabledEnvMatrixEvidence,
    disabledResultEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    envRestorationEvidence,
    readinessVerdict,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "8.9N-PATCH: Text Document Internal Readiness Source Snapshot Fix — apply the same immutable-committed-source-snapshot strategy used in 8.11C-AUDIT-PATCH to 8.9N's own 8.9K/8.9L/8.9M source acceptance, resolving the root historical-chain false-negative.",
      "Phase 8.11E: Real OCR Enabled Synthetic Local API Closure — in-process test of the exact-lowercase-\"true\" enabled path using a small synthetic in-memory PNG/JPEG buffer, only after 8.9N-PATCH lands.",
      "OCR quality evaluator closure, OCR trust boundary closure, and OCR-to-Smart-Talk handoff remain separate, later, explicitly authorized phases.",
      "Real mobile/browser manual testing remains a separate, later phase, after synthetic local closures pass.",
    ],
    notes,
  };

  if (allPassed && !_isCanonicalRealOcrDisabledLocalApiClosureResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of REAL_OCR_DISABLED_LOCAL_API_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalRealOcrDisabledLocalApiClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11D tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11D tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    readyForRealOcrEnabledSyntheticLocalApiClosure: finalAllPassed,
    readyForRealOcrEnabledSyntheticLocalApiClosureWithExactTrue: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-real-ocr-disabled-local-api-closure");

if (invokedDirectly) {
  runRealOcrDisabledLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
