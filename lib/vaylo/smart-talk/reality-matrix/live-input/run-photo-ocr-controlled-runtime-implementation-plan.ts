/**
 * PHASE 8.10B — Photo/OCR Controlled Runtime Implementation Plan
 *
 * IMPLEMENTATION PLAN ONLY. Converts the 8.10A gate design into a precise,
 * scoped implementation plan for a future 8.10C minimal patch. Does not
 * implement, patch, or enable Photo/OCR in any way.
 *
 * This file does NOT call fetch, runSmartTalk, OpenAI, or any OCR library. It
 * does not read files/images from disk, does not use camera/gallery, does not
 * read process.env for runtime authorization, does not touch DB/storage, does
 * not run 8.3AC, and does not touch tmp-8-3ac-live-metadata.ts. It imports
 * runPhotoOcrControlledRuntimeGateDesign (8.10A) and
 * runTextDocumentModeInternalReadinessClosure (8.9N) as sources of truth only
 * and hardcodes the future implementation plan as static data.
 */

import { runPhotoOcrControlledRuntimeGateDesign } from "./run-photo-ocr-controlled-runtime-gate-design";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrControlledRuntimeImplementationPlanResult {
  checkId: "8.10B";
  allPassed: boolean;
  implementationPlanOnly: true;
  implementationPerformed: false;
  sourceGateDesignPhase: "8.10A";
  sourceGateDesignCommit: "4a87043";
  sourceGateDesignAccepted: boolean;
  sourceTextDocumentInternalReadinessPhase: "8.9N";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceTextDocumentInternalReadinessAccepted: boolean;

  routeModifiedNow: false;
  uiModifiedNow: false;
  ocrModifiedNow: false;
  uploadModifiedNow: false;
  packageModifiedNow: false;
  configModifiedNow: false;
  envModifiedNow: false;
  apiModifiedNow: false;
  dbModifiedNow: false;
  storageModifiedNow: false;
  implementationPatchCreatedNow: false;
  runtimeEnabledNow: false;
  photoRuntimeEnabledNow: false;
  ocrRuntimeEnabledNow: false;
  uploadRuntimeEnabledNow: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;

  planName: "photo_ocr_controlled_runtime_implementation_plan";
  targetFuturePatchPhase: "8.10C";
  targetFuturePatchName: "Photo/OCR Controlled Runtime Minimal Patch";
  futureModeName: "photo_ocr_controlled_runtime";
  futureEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";
  futureEnvExactValue: "true";
  futureScope: "controlled_internal_only";
  currentPhaseScope: "planning_only";

  eightTenCIsFirstAllowedPatch: true;
  eightTenCMustBeMinimal: true;
  eightTenCMustBeFailClosed: true;
  eightTenCMayAddOcrDependency: false;
  eightTenCMayPersistRawImages: false;
  eightTenCMayPersistOcrText: false;
  eightTenCMayWriteDbStorageDna: false;
  eightTenCMayEnablePublicRuntime: false;
  eightTenCMayAuthorizeProductionOrGoLive: false;
  eightTenCMayModifyPackageConfigEnv: false;
  realOcrExtractionIsLaterSeparatePhase: true;
  realOcrExtractionDesignedNow: false;
  realOcrExtractionImplementedNow: false;

  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  readyForNextPhase: "8.10C";
  recommendedNextPhase: "Photo/OCR Controlled Runtime Minimal Patch";
  readyForPhotoOcrMinimalPatch: true;
  readyForPhotoOcrRuntime: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  liveRouteInvocationPerformedByThisPlan: false;
  liveModelCallPerformedByThisPlan: false;
  openAiSdkImportedByPlan: false;
  ocrLibraryImportedByPlan: false;
  fetchUsedAsRuntimeByPlan: false;
  processEnvReadForAuthorizationByPlan: false;
  realImagesReadByPlan: false;
  filesReadFromDiskByPlan: false;
  cameraGalleryUsedByPlan: false;
  filesWrittenByPlan: false;
  dbStorageTouchedByPlan: false;
  dependenciesAddedByPlan: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  implementationPlanEvidence: string[];
  allowedFutureFiles: string[];
  forbiddenFutureFiles: string[];
  futureRoutePatchPlan: string[];
  futureUiPatchPlan: string[];
  futureNoOcrYetPlan: string[];
  futureResponseContract: string[];
  futureBlockedResponseCodes: string[];
  futureValidationPlan: string[];
  futureManualBrowserPlan: string[];
  futureRegressionPlan: string[];
  explicitNonAuthorizationsNow: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Static required content ────────────────────────────────────────────────

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.10A gate design accepted",
  "8.10A was design-only",
  "8.10A confirmed Photo/OCR remained blocked",
  "8.10A confirmed public runtime/production/go-live remained blocked",
  "8.9N internal readiness closure accepted",
  "Text Document Mode internal readiness closed",
];

const REQUIRED_IMPLEMENTATION_PLAN_EVIDENCE: string[] = [
  "8.10B is plan-only",
  "no patch performed",
  "8.10C is the first allowed patch phase",
  "8.10C must be minimal",
  "8.10C must be fail-closed",
  "8.10C must not add OCR dependencies",
  "8.10C must not persist images or OCR text",
  "8.10C must not authorize public runtime",
  "real OCR extraction must be a later separate phase",
];

const REQUIRED_EXPLICIT_NON_AUTHORIZATIONS_NOW: string[] = [
  "route not modified now",
  "UI not modified now",
  "OCR not modified now",
  "upload not modified now",
  "runtime not enabled now",
  "public runtime not enabled now",
  "production not authorized now",
  "go-live not authorized now",
  "paid mode not enabled now",
  "DNA not enabled now",
  "persistence/DB/storage not enabled now",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "8.10C implementation patch not created yet",
  "disabled local API closure not performed",
  "enabled controlled local API closure not performed",
  "Photo/OCR regression pack not created",
  "Photo/OCR browser manual planning not created",
  "Photo/OCR browser manual execution not performed",
  "Photo/OCR internal readiness closure not performed",
  "real OCR extraction not designed yet",
  "real OCR extraction not implemented",
  "image quality evaluator not implemented",
  "OCR trust boundary not implemented",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This is an implementation-plan-only specification for a future 8.10C patch.",
  "No route, UI, OCR, upload, package, config, or env file is modified by this phase.",
  "No image, OCR library, or file is read by this phase.",
  "This phase relies on committed 8.10A and 8.9N evidence as its sources of truth.",
  "This phase does not authorize public runtime, production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.",
  "Real OCR extraction is explicitly deferred to a later, separate, explicitly approved phase.",
  "Model output and OCR output remain untrusted for any future implementation.",
];

const REQUIRED_BLOCKED_RESPONSE_CODES: string[] = [
  "photo_ocr_controlled_runtime_disabled",
  "photo_ocr_invalid_mode_blocked",
  "photo_ocr_invalid_input_type_blocked",
  "photo_ocr_invalid_context_blocked",
  "photo_ocr_text_payload_mismatch_blocked",
  "photo_ocr_photo_payload_required",
  "photo_ocr_remote_url_blocked",
  "photo_ocr_file_path_blocked",
  "photo_ocr_pdf_upload_blocked",
  "photo_ocr_unsupported_mime_type_blocked",
  "photo_ocr_page_count_blocked",
  "photo_ocr_image_size_blocked",
  "photo_ocr_processed_payload_size_blocked",
  "photo_ocr_background_upload_blocked",
  "photo_ocr_persistence_blocked",
  "photo_ocr_storage_blocked",
  "photo_ocr_dna_write_blocked",
  "photo_ocr_paid_mode_blocked",
  "photo_ocr_public_runtime_blocked",
  "photo_ocr_production_blocked",
  "photo_ocr_go_live_blocked",
  "photo_ocr_exact_legal_deadline_blocked",
  "photo_ocr_binding_legal_advice_blocked",
  "photo_ocr_official_filing_generation_blocked",
  "photo_ocr_sensitive_credential_data_blocked",
  "photo_ocr_sensitive_financial_data_blocked",
  "photo_ocr_8_3ac_invocation_blocked",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledRuntimeImplementationPlanResult(
  r: PhotoOcrControlledRuntimeImplementationPlanResult,
): boolean {
  if (r.checkId !== "8.10B") return false;
  if (r.allPassed !== true) return false;
  if (r.implementationPlanOnly !== true) return false;
  if (r.implementationPerformed !== false) return false;
  if (r.sourceGateDesignPhase !== "8.10A") return false;
  if (r.sourceGateDesignCommit !== "4a87043") return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessPhase !== "8.9N") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.ocrModifiedNow !== false) return false;
  if (r.uploadModifiedNow !== false) return false;
  if (r.packageModifiedNow !== false) return false;
  if (r.configModifiedNow !== false) return false;
  if (r.envModifiedNow !== false) return false;
  if (r.apiModifiedNow !== false) return false;
  if (r.dbModifiedNow !== false) return false;
  if (r.storageModifiedNow !== false) return false;
  if (r.implementationPatchCreatedNow !== false) return false;
  if (r.runtimeEnabledNow !== false) return false;
  if (r.photoRuntimeEnabledNow !== false) return false;
  if (r.ocrRuntimeEnabledNow !== false) return false;
  if (r.uploadRuntimeEnabledNow !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;

  if (r.planName !== "photo_ocr_controlled_runtime_implementation_plan") return false;
  if (r.targetFuturePatchPhase !== "8.10C") return false;
  if (r.targetFuturePatchName !== "Photo/OCR Controlled Runtime Minimal Patch") return false;
  if (r.futureModeName !== "photo_ocr_controlled_runtime") return false;
  if (r.futureEnvFlag !== "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED") return false;
  if (r.futureEnvExactValue !== "true") return false;
  if (r.futureScope !== "controlled_internal_only") return false;
  if (r.currentPhaseScope !== "planning_only") return false;

  if (r.eightTenCIsFirstAllowedPatch !== true) return false;
  if (r.eightTenCMustBeMinimal !== true) return false;
  if (r.eightTenCMustBeFailClosed !== true) return false;
  if (r.eightTenCMayAddOcrDependency !== false) return false;
  if (r.eightTenCMayPersistRawImages !== false) return false;
  if (r.eightTenCMayPersistOcrText !== false) return false;
  if (r.eightTenCMayWriteDbStorageDna !== false) return false;
  if (r.eightTenCMayEnablePublicRuntime !== false) return false;
  if (r.eightTenCMayAuthorizeProductionOrGoLive !== false) return false;
  if (r.eightTenCMayModifyPackageConfigEnv !== false) return false;
  if (r.realOcrExtractionIsLaterSeparatePhase !== true) return false;
  if (r.realOcrExtractionDesignedNow !== false) return false;
  if (r.realOcrExtractionImplementedNow !== false) return false;

  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.readyForNextPhase !== "8.10C") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Runtime Minimal Patch") return false;
  if (r.readyForPhotoOcrMinimalPatch !== true) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  if (r.liveRouteInvocationPerformedByThisPlan !== false) return false;
  if (r.liveModelCallPerformedByThisPlan !== false) return false;
  if (r.openAiSdkImportedByPlan !== false) return false;
  if (r.ocrLibraryImportedByPlan !== false) return false;
  if (r.fetchUsedAsRuntimeByPlan !== false) return false;
  if (r.processEnvReadForAuthorizationByPlan !== false) return false;
  if (r.realImagesReadByPlan !== false) return false;
  if (r.filesReadFromDiskByPlan !== false) return false;
  if (r.cameraGalleryUsedByPlan !== false) return false;
  if (r.filesWrittenByPlan !== false) return false;
  if (r.dbStorageTouchedByPlan !== false) return false;
  if (r.dependenciesAddedByPlan !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (r.implementationPlanEvidence.length !== REQUIRED_IMPLEMENTATION_PLAN_EVIDENCE.length) return false;
  for (const item of REQUIRED_IMPLEMENTATION_PLAN_EVIDENCE) {
    if (!r.implementationPlanEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.allowedFutureFiles) || r.allowedFutureFiles.length === 0) return false;
  if (!Array.isArray(r.forbiddenFutureFiles) || r.forbiddenFutureFiles.length === 0) return false;
  if (!Array.isArray(r.futureRoutePatchPlan) || r.futureRoutePatchPlan.length === 0) return false;
  if (!Array.isArray(r.futureUiPatchPlan) || r.futureUiPatchPlan.length === 0) return false;
  if (!Array.isArray(r.futureNoOcrYetPlan) || r.futureNoOcrYetPlan.length === 0) return false;
  if (!Array.isArray(r.futureResponseContract) || r.futureResponseContract.length === 0) return false;
  if (r.futureBlockedResponseCodes.length !== REQUIRED_BLOCKED_RESPONSE_CODES.length) return false;
  for (const code of REQUIRED_BLOCKED_RESPONSE_CODES) {
    if (!r.futureBlockedResponseCodes.includes(code)) return false;
  }
  if (!Array.isArray(r.futureValidationPlan) || r.futureValidationPlan.length === 0) return false;
  if (!Array.isArray(r.futureManualBrowserPlan) || r.futureManualBrowserPlan.length === 0) return false;
  if (!Array.isArray(r.futureRegressionPlan) || r.futureRegressionPlan.length === 0) return false;
  if (r.explicitNonAuthorizationsNow.length !== REQUIRED_EXPLICIT_NON_AUTHORIZATIONS_NOW.length) return false;
  for (const item of REQUIRED_EXPLICIT_NON_AUTHORIZATIONS_NOW) {
    if (!r.explicitNonAuthorizationsNow.includes(item)) return false;
  }
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

type Tamper810BMutation = (
  r: PhotoOcrControlledRuntimeImplementationPlanResult,
) => PhotoOcrControlledRuntimeImplementationPlanResult;
interface Tamper810BCase {
  label: string;
  mutate: Tamper810BMutation;
}

const PHOTO_OCR_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper810BCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10A" as "8.10B" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceGateDesignAccepted false (8.10A source evidence missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong (8.10A commit is not 4a87043)", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "4a87043" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (8.9N source evidence missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (8.9N commit is not 3cf81c1)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "implementationPlanOnly false", mutate: (r) => ({ ...r, implementationPlanOnly: false as true }) },
  { label: "implementationPerformed true", mutate: (r) => ({ ...r, implementationPerformed: true as false }) },
  { label: "routeModifiedNow true (existing file modified now)", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "ocrModifiedNow true", mutate: (r) => ({ ...r, ocrModifiedNow: true as false }) },
  { label: "uploadModifiedNow true", mutate: (r) => ({ ...r, uploadModifiedNow: true as false }) },
  { label: "packageModifiedNow true (package/config/env/API/DB/storage modified now)", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "configModifiedNow true", mutate: (r) => ({ ...r, configModifiedNow: true as false }) },
  { label: "envModifiedNow true", mutate: (r) => ({ ...r, envModifiedNow: true as false }) },
  { label: "apiModifiedNow true", mutate: (r) => ({ ...r, apiModifiedNow: true as false }) },
  { label: "dbModifiedNow true", mutate: (r) => ({ ...r, dbModifiedNow: true as false }) },
  { label: "storageModifiedNow true", mutate: (r) => ({ ...r, storageModifiedNow: true as false }) },
  { label: "implementationPatchCreatedNow true", mutate: (r) => ({ ...r, implementationPatchCreatedNow: true as false }) },
  { label: "runtimeEnabledNow true", mutate: (r) => ({ ...r, runtimeEnabledNow: true as false }) },
  { label: "photoRuntimeEnabledNow true (photo runtime is enabled now)", mutate: (r) => ({ ...r, photoRuntimeEnabledNow: true as false }) },
  { label: "ocrRuntimeEnabledNow true (OCR runtime is enabled now)", mutate: (r) => ({ ...r, ocrRuntimeEnabledNow: true as false }) },
  { label: "uploadRuntimeEnabledNow true (upload runtime is enabled now)", mutate: (r) => ({ ...r, uploadRuntimeEnabledNow: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime enabled now)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live authorized now)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live authorized now)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "targetFuturePatchPhase wrong (target future patch phase is not 8.10C)", mutate: (r) => ({ ...r, targetFuturePatchPhase: "8.10D" as "8.10C" }) },
  { label: "eightTenCIsFirstAllowedPatch false (8.10C is not the first allowed patch phase)", mutate: (r) => ({ ...r, eightTenCIsFirstAllowedPatch: false as true }) },
  { label: "eightTenCMustBeMinimal false", mutate: (r) => ({ ...r, eightTenCMustBeMinimal: false as true }) },
  { label: "eightTenCMustBeFailClosed false", mutate: (r) => ({ ...r, eightTenCMustBeFailClosed: false as true }) },
  { label: "eightTenCMayAddOcrDependency true (8.10C can add OCR dependency)", mutate: (r) => ({ ...r, eightTenCMayAddOcrDependency: true as false }) },
  { label: "eightTenCMayPersistRawImages true (8.10C can persist raw images)", mutate: (r) => ({ ...r, eightTenCMayPersistRawImages: true as false }) },
  { label: "eightTenCMayPersistOcrText true (8.10C can persist OCR text)", mutate: (r) => ({ ...r, eightTenCMayPersistOcrText: true as false }) },
  { label: "eightTenCMayWriteDbStorageDna true (8.10C can write DB/storage/DNA)", mutate: (r) => ({ ...r, eightTenCMayWriteDbStorageDna: true as false }) },
  { label: "eightTenCMayEnablePublicRuntime true (8.10C can enable public runtime)", mutate: (r) => ({ ...r, eightTenCMayEnablePublicRuntime: true as false }) },
  { label: "eightTenCMayAuthorizeProductionOrGoLive true (8.10C can authorize production/go-live)", mutate: (r) => ({ ...r, eightTenCMayAuthorizeProductionOrGoLive: true as false }) },
  { label: "eightTenCMayModifyPackageConfigEnv true (8.10C can modify package/config/env files)", mutate: (r) => ({ ...r, eightTenCMayModifyPackageConfigEnv: true as false }) },
  { label: "futureEnvFlag wrong (future env flag is not SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED)", mutate: (r) => ({ ...r, futureEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED" as "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED" }) },
  { label: "futureEnvExactValue wrong (future env exact value is not lowercase true)", mutate: (r) => ({ ...r, futureEnvExactValue: "1" as "true" }) },
  { label: "futureModeName wrong (future mode name is not photo_ocr_controlled_runtime)", mutate: (r) => ({ ...r, futureModeName: "text_document_controlled_runtime" as "photo_ocr_controlled_runtime" }) },
  { label: "realOcrExtractionIsLaterSeparatePhase false (real OCR extraction is marked ready now)", mutate: (r) => ({ ...r, realOcrExtractionIsLaterSeparatePhase: false as true }) },
  { label: "realOcrExtractionDesignedNow true (real OCR extraction is marked ready now)", mutate: (r) => ({ ...r, realOcrExtractionDesignedNow: true as false }) },
  { label: "realOcrExtractionImplementedNow true (real OCR extraction is marked ready now)", mutate: (r) => ({ ...r, realOcrExtractionImplementedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10C)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10D" as "8.10C" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10C)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Controlled Runtime Minimal Patch" }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForRealOcrExtraction true (real OCR extraction is marked ready now)", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "liveRouteInvocationPerformedByThisPlan true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisPlan: true as false }) },
  { label: "openAiSdkImportedByPlan true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByPlan: true as false }) },
  { label: "ocrLibraryImportedByPlan true (claims OCR library import)", mutate: (r) => ({ ...r, ocrLibraryImportedByPlan: true as false }) },
  { label: "fetchUsedAsRuntimeByPlan true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByPlan: true as false }) },
  { label: "processEnvReadForAuthorizationByPlan true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByPlan: true as false }) },
  { label: "realImagesReadByPlan true (claims real image reads)", mutate: (r) => ({ ...r, realImagesReadByPlan: true as false }) },
  { label: "filesReadFromDiskByPlan true (claims disk file reads)", mutate: (r) => ({ ...r, filesReadFromDiskByPlan: true as false }) },
  { label: "cameraGalleryUsedByPlan true (claims camera/gallery use)", mutate: (r) => ({ ...r, cameraGalleryUsedByPlan: true as false }) },
  { label: "filesWrittenByPlan true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByPlan: true as false }) },
  { label: "dbStorageTouchedByPlan true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByPlan: true as false }) },
  { label: "dependenciesAddedByPlan true (claims dependencies added)", mutate: (r) => ({ ...r, dependenciesAddedByPlan: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length", mutate: (r) => ({ ...r, sourceEvidence: r.sourceEvidence.slice(0, 2) }) },
  { label: "implementationPlanEvidence wrong length", mutate: (r) => ({ ...r, implementationPlanEvidence: r.implementationPlanEvidence.slice(0, 2) }) },
  { label: "allowedFutureFiles emptied", mutate: (r) => ({ ...r, allowedFutureFiles: [] }) },
  { label: "forbiddenFutureFiles emptied", mutate: (r) => ({ ...r, forbiddenFutureFiles: [] }) },
  { label: "futureRoutePatchPlan emptied", mutate: (r) => ({ ...r, futureRoutePatchPlan: [] }) },
  { label: "futureUiPatchPlan emptied", mutate: (r) => ({ ...r, futureUiPatchPlan: [] }) },
  { label: "futureNoOcrYetPlan emptied", mutate: (r) => ({ ...r, futureNoOcrYetPlan: [] }) },
  { label: "futureResponseContract emptied (allowed placeholder response contract lacks photoOcrMeta)", mutate: (r) => ({ ...r, futureResponseContract: [] }) },
  { label: "futureBlockedResponseCodes wrong length (blocked response code list misses a required code)", mutate: (r) => ({ ...r, futureBlockedResponseCodes: r.futureBlockedResponseCodes.slice(0, 3) }) },
  { label: "futureBlockedResponseCodes missing disabled code (disabled response code missing)", mutate: (r) => ({ ...r, futureBlockedResponseCodes: r.futureBlockedResponseCodes.filter((c) => c !== "photo_ocr_controlled_runtime_disabled") }) },
  { label: "futureValidationPlan emptied", mutate: (r) => ({ ...r, futureValidationPlan: [] }) },
  { label: "futureManualBrowserPlan emptied", mutate: (r) => ({ ...r, futureManualBrowserPlan: [] }) },
  { label: "futureRegressionPlan emptied", mutate: (r) => ({ ...r, futureRegressionPlan: [] }) },
  { label: "explicitNonAuthorizationsNow wrong length", mutate: (r) => ({ ...r, explicitNonAuthorizationsNow: r.explicitNonAuthorizationsNow.slice(0, 3) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported plan runner ───────────────────────────────────────────────────

export function runPhotoOcrControlledRuntimeImplementationPlan(): PhotoOcrControlledRuntimeImplementationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.10A gate design as source of truth ────────────────────────────
  const a = runPhotoOcrControlledRuntimeGateDesign();
  if (a.checkId !== "8.10A") planFailures.push(`8.10A checkId mismatch: expected "8.10A", got "${a.checkId}"`);
  if (a.allPassed !== true) planFailures.push("8.10A allPassed is not true");
  if (a.designOnly !== true) planFailures.push("8.10A designOnly is not true");
  if (a.implementationPerformed !== false) planFailures.push("8.10A implementationPerformed is not false");
  if (a.photoOcrStillBlocked !== true) planFailures.push("8.10A photoOcrStillBlocked is not true");
  if (a.publicRuntimeStillBlocked !== true) planFailures.push("8.10A publicRuntimeStillBlocked is not true");
  if (a.readyForPhotoOcrRuntime !== false) planFailures.push("8.10A readyForPhotoOcrRuntime is not false");
  if (a.readyForProduction !== false) planFailures.push("8.10A readyForProduction is not false");
  if (a.readyForGoLive !== false) planFailures.push("8.10A readyForGoLive is not false");
  if (a.requiredFutureEnvFlag !== "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED")
    planFailures.push("8.10A requiredFutureEnvFlag mismatch");
  if (a.requiredFutureEnvFlagExactValue !== "true") planFailures.push("8.10A requiredFutureEnvFlagExactValue mismatch");
  if (a.futureModeName !== "photo_ocr_controlled_runtime") planFailures.push("8.10A futureModeName mismatch");
  if (a.eightThreeAcNotRun !== true) planFailures.push("8.10A eightThreeAcNotRun is not true");
  if (a.tmpEightThreeAcMetadataTouched !== false) planFailures.push("8.10A tmpEightThreeAcMetadataTouched is not false");
  if (a.tamperRejected !== a.tamperCount) planFailures.push("8.10A own tamper count mismatch");

  const sourceGateDesignAccepted = planFailures.length === 0;

  // ── Call 8.9N internal readiness closure as secondary source of truth ────
  const nFailuresBefore = planFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") planFailures.push(`8.9N checkId mismatch: expected "8.9N", got "${n.checkId}"`);
  if (n.allPassed !== true) planFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") planFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.textDocumentModeInternalReadinessClosed !== true)
    planFailures.push("8.9N textDocumentModeInternalReadinessClosed is not true");
  if (n.readyForPhotoOcrRuntime !== false) planFailures.push("8.9N readyForPhotoOcrRuntime is not false");
  if (n.publicRuntimeStillBlocked !== true) planFailures.push("8.9N publicRuntimeStillBlocked is not true");
  if (n.tamperRejected !== n.tamperCount) planFailures.push("8.9N own tamper count mismatch");

  const sourceTextDocumentInternalReadinessAccepted = planFailures.length === nFailuresBefore;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];
  const implementationPlanEvidence: string[] = [...REQUIRED_IMPLEMENTATION_PLAN_EVIDENCE];

  const allowedFutureFiles: string[] = [
    "app/api/smart-talk/route.ts — add a single gated branch for mode === \"photo_ocr_controlled_runtime\" (server-side env flag authority, fail-closed on any deviation).",
    "app/smart-talk/SmartTalkClient.tsx — optionally add an internal-only Photo/OCR test control visible only in the photo tab, mirroring the Text Document Mode Option-B pattern (8.9K).",
  ];

  const forbiddenFutureFiles: string[] = [
    "package.json / package-lock.json / any dependency manifest (no OCR library installation in 8.10C).",
    "Any tsconfig, eslint, next.config, or other build/config file.",
    "Any .env / .env.local / environment file.",
    "Any DB, Supabase, or storage client/config file.",
    "Any Vaylo DNA persistence file.",
    "tmp-8-3ac-live-metadata.ts.",
    "Any 8.3AC live runner file.",
    "Any test-runner, debug-only, or temporary helper file placed outside the governance chain.",
  ];

  const futureRoutePatchPlan: string[] = [
    "Add a gated branch to app/api/smart-talk/route.ts for mode === \"photo_ocr_controlled_runtime\" only.",
    "Read the env flag SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED server-side only; the client must never be treated as an authorization source.",
    "The env flag must exactly equal the lowercase string \"true\" to proceed; every other value (missing, \"false\", \"TRUE\", \"1\", \"yes\", whitespace-padded) fails closed with photo_ocr_controlled_runtime_disabled (403).",
    "Reject unless context exactly equals \"anonymous\" and inputType exactly equals \"photo\".",
    "Reject if the payload mixes text_document_controlled_runtime mode markers with a photo payload (photo_ocr_text_payload_mismatch_blocked).",
    "Reject if the payload claims photo_ocr_controlled_runtime but supplies only text with no image content (photo_ocr_photo_payload_required).",
    "Reject any public/production/go-live marker in the request (photo_ocr_public_runtime_blocked / photo_ocr_production_blocked / photo_ocr_go_live_blocked).",
    "Reject any paid-mode, DNA, persistence, or storage marker in the request (photo_ocr_paid_mode_blocked / photo_ocr_dna_write_blocked / photo_ocr_persistence_blocked / photo_ocr_storage_blocked).",
    "Reject exact legal deadline calculation, binding legal advice, and official filing generation requests, mirroring the Text Document Mode blocking logic (photo_ocr_exact_legal_deadline_blocked / photo_ocr_binding_legal_advice_blocked / photo_ocr_official_filing_generation_blocked).",
    "Reject credential/API key/password content and IBAN/payment authorization content, reusing the Text Document Mode detectors where applicable (photo_ocr_sensitive_credential_data_blocked / photo_ocr_sensitive_financial_data_blocked).",
    "The branch must not persist any request data, must not write to DB/storage/DNA, and must not call any external service beyond what is explicitly authorized in 8.10C's own scope decision.",
    "The branch must not call real OCR unless 8.10C explicitly and narrowly authorizes a synthetic/no-OCR placeholder path; if OCR is not implemented in 8.10C, the branch must return only a controlled placeholder or a blocked response.",
    "8.10C must validate image page count (1-3), MIME type allow-list (image/jpeg, image/png, image/webp), per-page raw size (<= 8 MB), and total processed payload size (<= 4 MB), rejecting violations with the corresponding blocked codes.",
    "8.10C must reject remote image URL ingestion, file path ingestion, PDF upload, and background/automatic upload attempts.",
    "8.10C must reject any 8.3AC invocation marker (photo_ocr_8_3ac_invocation_blocked).",
  ];

  const futureUiPatchPlan: string[] = [
    "Optionally add an internal-only Photo/OCR test button in SmartTalkClient.tsx, rendered only when the photo tab is active (mirroring the 8.9K Text Document Mode Option-B pattern).",
    "The button/control must carry explicit internal-test wording (e.g. \"Interný test\") and must not use public-launch, production, or go-live wording.",
    "No automatic upload may occur on tab click; the user must explicitly select a camera/gallery image before any request is sent.",
    "No image may be persisted client-side; no DNA write may occur from the client.",
    "The client must never use a client-side environment flag as authorization — the server-side route branch remains the sole authority.",
    "The existing photo tab's default (non-controlled) flow must remain completely separate and untouched by the new internal control.",
    "The Text Document Mode internal button must remain absent outside text mode, and the new Photo/OCR internal button (if added) must remain absent outside photo mode.",
    "Any result rendered from the controlled path must surface the privacy/legal disclaimer and OCR confidence/quality warning (when applicable) returned by the route.",
  ];

  const futureNoOcrYetPlan: string[] = [
    "8.10C may choose to implement the route branch as fully synthetic/no-OCR: it validates and rejects per the contract, and only returns a controlled placeholder success response (no OCR call at all) when the env flag is enabled and all guards pass.",
    "If 8.10C remains no-OCR, the placeholder response's photoOcrMeta must set ocrRuntimeStillBlocked: true (no ocrExtractionPerformed field, or ocrExtractionPerformed: false) to make the absence of real OCR explicit.",
    "Real OCR extraction (actual text extraction from image bytes) must not be added in 8.10C under any circumstance.",
    "Real OCR extraction requires a separate, later, explicitly authorized phase that will define its own OCR library selection, dependency addition, quality/confidence evaluation, and trust-boundary design — none of which are approved by this plan.",
    "Until that separate OCR phase is authorized, every enabled-path response must either be a controlled placeholder (no OCR) or a blocked response — there is no third option.",
  ];

  const futureResponseContract: string[] = [
    "Disabled path: HTTP 403, ok: false, code: \"photo_ocr_controlled_runtime_disabled\"; no model call, no OCR call, no upload, no persistence.",
    "Allowed controlled placeholder/synthetic path (only if 8.10C intentionally supports it, env enabled, and all guards pass): HTTP 200, ok: true, mode: \"photo_ocr_controlled_runtime\", context: \"anonymous\".",
    "The allowed path response must include a photoOcrMeta object.",
    "photoOcrMeta.photoOcrControlledRuntime must be true.",
    "photoOcrMeta.photoInputOnly must be true.",
    "photoOcrMeta must include ocrRuntimeStillBlocked (true if 8.10C is no-OCR) or ocrExtractionPerformed (only if 8.10C's own scope decision explicitly authorizes a narrow synthetic extraction step — not real OCR).",
    "photoOcrMeta.rawImagePersistenceBlocked must be true.",
    "photoOcrMeta.processedImagePersistenceBlocked must be true.",
    "photoOcrMeta.extractedTextPersistenceBlocked must be true.",
    "photoOcrMeta.dbStorageStillBlocked must be true.",
    "photoOcrMeta.supabaseStorageStillBlocked must be true.",
    "photoOcrMeta.vayloDnaStillBlocked must be true.",
    "photoOcrMeta.paidDocumentModeStillBlocked must be true.",
    "photoOcrMeta.publicRuntimeStillBlocked must be true.",
    "photoOcrMeta.productionAuthorizedNow must be false.",
    "photoOcrMeta.goLiveAuthorizedNow must be false.",
    "photoOcrMeta.modelOutputStillUntrusted must be true.",
    "photoOcrMeta.ocrOutputStillUntrusted must be true.",
    "photoOcrMeta.imageContentTreatedAsSensitive must be true.",
    "photoOcrMeta.extractedTextTreatedAsSensitive must be true.",
    "photoOcrMeta.privacyDisclaimerRequired must be true.",
    "photoOcrMeta.legalDisclaimerRequired must be true.",
    "photoOcrMeta.exactLegalDeadlineStillBlocked must be true.",
    "photoOcrMeta.bindingLegalAdviceStillBlocked must be true.",
    "photoOcrMeta.officialFilingGenerationStillBlocked must be true.",
    "photoOcrMeta.eightThreeAcNotRun must be true.",
  ];

  const futureValidationPlan: string[] = [
    "8.10C: Photo/OCR Controlled Runtime Minimal Patch — the first and only allowed patch phase from this plan; implements the gated route branch (and optionally the internal UI control) per this plan.",
    "8.10D: Disabled Local API Closure — manual local test confirming the disabled path (env flag absent) returns photo_ocr_controlled_runtime_disabled / 403 with no side effects.",
    "8.10E: Enabled Controlled Local API Closure — manual local test confirming the enabled path (env flag exactly \"true\") returns the controlled placeholder/synthetic response with the full photoOcrMeta contract, and confirming all guard rejections fire correctly.",
    "8.10F: Controlled Local Regression Pack — synthetic allowed/blocked case matrix mirroring the 8.9F Text Document Mode regression pack, covering every blocked response code.",
    "8.10G: Browser/UI Wiring Audit or Patch (scope depends on whether 8.10C included the UI control) — static audit or minimal patch for the internal Photo/OCR test control.",
    "8.10H: Controlled Local Browser Manual Test Planning — defines the manual browser test protocol for the new control (mirrors 8.9L).",
    "8.10I: Controlled Local Browser Manual Execution Closure — records operator-observed manual test results with network response evidence (mirrors 8.9M).",
    "8.10J: Internal Readiness Closure for Photo/OCR placeholder/synthetic path — consolidates 8.10C-8.10I evidence into a formal internal readiness verdict for the no-OCR placeholder path only (mirrors 8.9N).",
    "Real OCR extraction phase: a separate, later, explicitly authorized phase (numbered after 8.10J) that designs and implements actual OCR text extraction, quality/confidence evaluation, and trust-boundary handling — out of scope for this plan.",
  ];

  const futureManualBrowserPlan: string[] = [
    "Mirrors the 8.9L/8.9M Text Document Mode manual browser test structure: pre-test verification, OFF scenario (env flag absent → 403), ON scenario (env flag exactly \"true\" → 200 controlled placeholder with full photoOcrMeta), blocked-risk scenarios (one per major blocked response code), text-mode separation check (photo control absent in text tab), and cleanup.",
    "All manual browser testing must occur only after 8.10C-8.10G are complete and only in a local/controlled environment — never against a public or production deployment.",
    "No real photo/document images containing genuine personal data may be used in manual testing; only synthetic/test images are permitted, consistent with the sensitivity requirements carried over from 8.10A.",
  ];

  const futureRegressionPlan: string[] = [
    "The 8.10F regression pack must include at least one allowed (controlled placeholder) case and one case per blocked response code listed in futureBlockedResponseCodes.",
    "The regression pack must assert, for every allowed case, that photoOcrMeta preserves every blocked/persistence/sensitivity flag defined in futureResponseContract.",
    "The regression pack must assert, for every blocked case, that no model call, no OCR call, no upload, and no persistence occurred.",
    "The regression pack must be a static, synthetic test matrix (no live route invocation, no live browser), mirroring the 8.9F approach.",
  ];

  const notes: string[] = [
    "IP-01: 8.10B is an implementation-plan-only phase. No route, UI, OCR, upload, package, config, or env file is modified.",
    `IP-02: 8.10A confirmed as source of truth — checkId=${a.checkId}, allPassed=${a.allPassed}, designOnly=${a.designOnly}, readyForPhotoOcrRuntime=${a.readyForPhotoOcrRuntime}.`,
    `IP-03: 8.9N confirmed as secondary source of truth — checkId=${n.checkId}, allPassed=${n.allPassed}, textDocumentModeInternalReadinessClosed=${n.textDocumentModeInternalReadinessClosed}.`,
    "IP-04: 8.10C is identified as the one and only allowed future patch phase from this plan; it must remain minimal and fail-closed.",
    "IP-05: real OCR extraction is explicitly and permanently deferred to a later, separate, not-yet-authorized phase; it is never in scope for 8.10C.",
    "IP-06: no image, OCR library, or file was read by this phase; no camera/gallery was used; no fetch/route/model call was made; no dependency was added.",
    "IP-07: this plan does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "IP-08: ready for Phase 8.10C — Photo/OCR Controlled Runtime Minimal Patch (implementation, still fail-closed and env-gated; no public/production/go-live).",
  ];

  const tamperCount = PHOTO_OCR_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: PhotoOcrControlledRuntimeImplementationPlanResult = {
    checkId: "8.10B",
    allPassed: true,
    implementationPlanOnly: true,
    implementationPerformed: false,
    sourceGateDesignPhase: "8.10A",
    sourceGateDesignCommit: "4a87043",
    sourceGateDesignAccepted,
    sourceTextDocumentInternalReadinessPhase: "8.9N",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceTextDocumentInternalReadinessAccepted,

    routeModifiedNow: false,
    uiModifiedNow: false,
    ocrModifiedNow: false,
    uploadModifiedNow: false,
    packageModifiedNow: false,
    configModifiedNow: false,
    envModifiedNow: false,
    apiModifiedNow: false,
    dbModifiedNow: false,
    storageModifiedNow: false,
    implementationPatchCreatedNow: false,
    runtimeEnabledNow: false,
    photoRuntimeEnabledNow: false,
    ocrRuntimeEnabledNow: false,
    uploadRuntimeEnabledNow: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    planName: "photo_ocr_controlled_runtime_implementation_plan",
    targetFuturePatchPhase: "8.10C",
    targetFuturePatchName: "Photo/OCR Controlled Runtime Minimal Patch",
    futureModeName: "photo_ocr_controlled_runtime",
    futureEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED",
    futureEnvExactValue: "true",
    futureScope: "controlled_internal_only",
    currentPhaseScope: "planning_only",

    eightTenCIsFirstAllowedPatch: true,
    eightTenCMustBeMinimal: true,
    eightTenCMustBeFailClosed: true,
    eightTenCMayAddOcrDependency: false,
    eightTenCMayPersistRawImages: false,
    eightTenCMayPersistOcrText: false,
    eightTenCMayWriteDbStorageDna: false,
    eightTenCMayEnablePublicRuntime: false,
    eightTenCMayAuthorizeProductionOrGoLive: false,
    eightTenCMayModifyPackageConfigEnv: false,
    realOcrExtractionIsLaterSeparatePhase: true,
    realOcrExtractionDesignedNow: false,
    realOcrExtractionImplementedNow: false,

    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    readyForNextPhase: "8.10C",
    recommendedNextPhase: "Photo/OCR Controlled Runtime Minimal Patch",
    readyForPhotoOcrMinimalPatch: true,
    readyForPhotoOcrRuntime: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    liveRouteInvocationPerformedByThisPlan: false,
    liveModelCallPerformedByThisPlan: false,
    openAiSdkImportedByPlan: false,
    ocrLibraryImportedByPlan: false,
    fetchUsedAsRuntimeByPlan: false,
    processEnvReadForAuthorizationByPlan: false,
    realImagesReadByPlan: false,
    filesReadFromDiskByPlan: false,
    cameraGalleryUsedByPlan: false,
    filesWrittenByPlan: false,
    dbStorageTouchedByPlan: false,
    dependenciesAddedByPlan: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    implementationPlanEvidence,
    allowedFutureFiles,
    forbiddenFutureFiles,
    futureRoutePatchPlan,
    futureUiPatchPlan,
    futureNoOcrYetPlan,
    futureResponseContract,
    futureBlockedResponseCodes: REQUIRED_BLOCKED_RESPONSE_CODES,
    futureValidationPlan,
    futureManualBrowserPlan,
    futureRegressionPlan,
    explicitNonAuthorizationsNow: REQUIRED_EXPLICIT_NON_AUTHORIZATIONS_NOW,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10C: Photo/OCR Controlled Runtime Minimal Patch — implement the single gated route branch (and optionally the internal UI control) exactly per futureRoutePatchPlan/futureUiPatchPlan, remaining fail-closed and no-OCR (or explicitly-scoped narrow synthetic-only) as decided in 8.10C's own scope statement.",
      "Phase 8.10D: Disabled Local API Closure — manual local confirmation of the disabled path.",
      "Phase 8.10E: Enabled Controlled Local API Closure — manual local confirmation of the enabled controlled placeholder path and all guard rejections.",
      "Public runtime, production, go-live, and real OCR extraction remain out of scope until their own separate, explicitly authorized phases.",
    ],
    notes,
  };

  if (
    planFailures.length === 0 &&
    !_isCanonicalPhotoOcrControlledRuntimeImplementationPlanResult(provisional)
  ) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledRuntimeImplementationPlanResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10B tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed = planFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10B tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-runtime-implementation-plan");

if (invokedDirectly) {
  console.log(JSON.stringify(runPhotoOcrControlledRuntimeImplementationPlan(), null, 2));
}
