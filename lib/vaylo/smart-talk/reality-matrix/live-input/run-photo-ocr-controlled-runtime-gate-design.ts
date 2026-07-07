/**
 * PHASE 8.10A — Photo/OCR Controlled Runtime Gate Design
 *
 * DESIGN ONLY. Defines the controlled runtime gate for a future Photo/OCR
 * capability: safety requirements, blockers, environment flag rules, allowed
 * inputs, forbidden paths, and tamper requirements for later implementation
 * phases. Does not implement or enable Photo/OCR in any way.
 *
 * This file does NOT call fetch, runSmartTalk, OpenAI, or any OCR library. It
 * does not read files/images from disk, does not use camera/gallery, does not
 * read process.env for runtime authorization, does not touch DB/storage, does
 * not run 8.3AC, and does not touch tmp-8-3ac-live-metadata.ts. It imports
 * runTextDocumentModeInternalReadinessClosure from 8.9N as source of truth
 * only and hardcodes the future gate design as static data.
 */

import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrControlledRuntimeGateDesignResult {
  checkId: "8.10A";
  allPassed: boolean;
  designOnly: true;
  gateDesignOnly: true;
  implementationPerformed: false;
  routeModified: false;
  uiModified: false;
  ocrRuntimeEnabledNow: false;
  photoRuntimeEnabledNow: false;
  uploadRuntimeEnabledNow: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  sourceTextDocumentInternalReadinessPhase: "8.9N";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceTextDocumentInternalReadinessAccepted: boolean;
  gateName: "photo_ocr_controlled_runtime_gate";
  futureModeName: "photo_ocr_controlled_runtime";
  futureRuntimeScope: "controlled_internal_only";
  currentPhaseScope: "design_only";
  futureAllowedInputKind: "operator_selected_image_pages_only";
  maxFuturePageCount: 3;
  futureAllowedImageTypes: ["image/jpeg", "image/png", "image/webp"];
  futureMaxRawImageMbPerPage: 8;
  futureMaxProcessedPayloadMbTotal: 4;
  futureNoBackgroundUpload: true;
  futureNoPersistence: true;
  futureNoDbStorage: true;
  futureNoSupabaseStorage: true;
  futureNoVayloDnaWrite: true;
  futureNoPaidMode: true;
  futureNoPublicRuntime: true;
  futureNoProductionRuntime: true;
  requiredFutureEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED";
  requiredFutureEnvFlagExactValue: "true";
  futureEnvAbsentBehavior: "fail_closed";
  futureEnvFalseBehavior: "fail_closed";
  futureEnvUppercaseTrueBehavior: "fail_closed";
  futureEnvOneBehavior: "fail_closed";
  futureEnvYesBehavior: "fail_closed";
  futureEnvWhitespaceTrueBehavior: "fail_closed";
  futureOnlyExactLowercaseTrueEnablesControlledInternalPath: true;
  photoOcrStillBlocked: true;
  scannerUploadStillBlocked: true;
  fileUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  dbStorageStillBlocked: true;
  publicRuntimeStillBlocked: true;
  modelOutputStillUntrusted: true;
  documentImagesTextStillSensitive: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingGenerationStillBlocked: true;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;
  readyForNextPhase: "8.10B";
  recommendedNextPhase: "Photo/OCR Controlled Runtime Implementation Plan";
  readyForPhotoOcrImplementationPlanning: true;
  readyForPhotoOcrRuntime: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  liveRouteInvocationPerformedByThisDesign: false;
  liveModelCallPerformedByThisDesign: false;
  openAiSdkImportedByDesign: false;
  ocrLibraryImportedByDesign: false;
  fetchUsedAsRuntimeByDesign: false;
  processEnvReadForAuthorizationByDesign: false;
  realImagesReadByDesign: false;
  filesReadFromDiskByDesign: false;
  cameraGalleryUsedByDesign: false;
  filesWrittenByDesign: false;
  dbStorageTouchedByDesign: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  sourceEvidence: string[];
  gateDesignEvidence: string[];
  futureEnvGateRules: string[];
  futureRouteContractRules: string[];
  futureOcrContractRules: string[];
  futureUiContractRules: string[];
  explicitCurrentNonAuthorizations: string[];
  futureAllowedInputs: string[];
  futureForbiddenInputs: string[];
  futureBlockedScenarios: string[];
  futureTamperRequirements: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.9N internal readiness closure accepted",
  "Text Document Mode internal readiness closed",
  "Photo/OCR not yet implemented",
  "Photo/OCR not yet authorized",
  "Current phase is design-only",
];

const REQUIRED_EXPLICIT_CURRENT_NON_AUTHORIZATIONS: string[] = [
  "OCR runtime not enabled",
  "photo runtime not enabled",
  "scanner/upload runtime not enabled",
  "file upload not enabled",
  "public runtime not enabled",
  "production not authorized",
  "go-live not authorized",
  "paid document mode not enabled",
  "Vaylo DNA not enabled",
  "persistence not enabled",
  "DB/storage not enabled",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Photo/OCR implementation not created",
  "Photo/OCR route branch not created",
  "Photo/OCR UI wiring not created",
  "OCR quality evaluator not created",
  "OCR extraction trust boundary not created",
  "image payload sanitizer not created",
  "image size/type validator not created",
  "no browser Photo/OCR manual test yet",
  "no API Photo/OCR closure yet",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This is a design-only gate specification for a future capability.",
  "No Photo/OCR implementation, route branch, or UI wiring is created by this phase.",
  "No image, OCR library, or file is read by this phase.",
  "This phase relies on committed 8.9N evidence as its source of truth.",
  "This phase does not authorize public runtime, production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.",
  "Model output and OCR output remain untrusted for any future implementation.",
  "Image content and extracted text remain sensitive for any future implementation.",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledRuntimeGateDesignResult(
  r: PhotoOcrControlledRuntimeGateDesignResult,
): boolean {
  if (r.checkId !== "8.10A") return false;
  if (r.allPassed !== true) return false;
  if (r.designOnly !== true) return false;
  if (r.gateDesignOnly !== true) return false;
  if (r.implementationPerformed !== false) return false;
  if (r.routeModified !== false) return false;
  if (r.uiModified !== false) return false;
  if (r.ocrRuntimeEnabledNow !== false) return false;
  if (r.photoRuntimeEnabledNow !== false) return false;
  if (r.uploadRuntimeEnabledNow !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.sourceTextDocumentInternalReadinessPhase !== "8.9N") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;
  if (r.gateName !== "photo_ocr_controlled_runtime_gate") return false;
  if (r.futureModeName !== "photo_ocr_controlled_runtime") return false;
  if (r.futureRuntimeScope !== "controlled_internal_only") return false;
  if (r.currentPhaseScope !== "design_only") return false;
  if (r.futureAllowedInputKind !== "operator_selected_image_pages_only") return false;
  if (r.maxFuturePageCount !== 3) return false;
  if (
    r.futureAllowedImageTypes.length !== 3 ||
    r.futureAllowedImageTypes[0] !== "image/jpeg" ||
    r.futureAllowedImageTypes[1] !== "image/png" ||
    r.futureAllowedImageTypes[2] !== "image/webp"
  )
    return false;
  if (r.futureMaxRawImageMbPerPage !== 8) return false;
  if (r.futureMaxProcessedPayloadMbTotal !== 4) return false;
  if (r.futureNoBackgroundUpload !== true) return false;
  if (r.futureNoPersistence !== true) return false;
  if (r.futureNoDbStorage !== true) return false;
  if (r.futureNoSupabaseStorage !== true) return false;
  if (r.futureNoVayloDnaWrite !== true) return false;
  if (r.futureNoPaidMode !== true) return false;
  if (r.futureNoPublicRuntime !== true) return false;
  if (r.futureNoProductionRuntime !== true) return false;
  if (r.requiredFutureEnvFlag !== "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED") return false;
  if (r.requiredFutureEnvFlagExactValue !== "true") return false;
  if (r.futureEnvAbsentBehavior !== "fail_closed") return false;
  if (r.futureEnvFalseBehavior !== "fail_closed") return false;
  if (r.futureEnvUppercaseTrueBehavior !== "fail_closed") return false;
  if (r.futureEnvOneBehavior !== "fail_closed") return false;
  if (r.futureEnvYesBehavior !== "fail_closed") return false;
  if (r.futureEnvWhitespaceTrueBehavior !== "fail_closed") return false;
  if (r.futureOnlyExactLowercaseTrueEnablesControlledInternalPath !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentImagesTextStillSensitive !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;
  if (r.readyForNextPhase !== "8.10B") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Runtime Implementation Plan") return false;
  if (r.readyForPhotoOcrImplementationPlanning !== true) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.liveRouteInvocationPerformedByThisDesign !== false) return false;
  if (r.liveModelCallPerformedByThisDesign !== false) return false;
  if (r.openAiSdkImportedByDesign !== false) return false;
  if (r.ocrLibraryImportedByDesign !== false) return false;
  if (r.fetchUsedAsRuntimeByDesign !== false) return false;
  if (r.processEnvReadForAuthorizationByDesign !== false) return false;
  if (r.realImagesReadByDesign !== false) return false;
  if (r.filesReadFromDiskByDesign !== false) return false;
  if (r.cameraGalleryUsedByDesign !== false) return false;
  if (r.filesWrittenByDesign !== false) return false;
  if (r.dbStorageTouchedByDesign !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.gateDesignEvidence) || r.gateDesignEvidence.length === 0) return false;
  if (!Array.isArray(r.futureEnvGateRules) || r.futureEnvGateRules.length === 0) return false;
  if (!Array.isArray(r.futureRouteContractRules) || r.futureRouteContractRules.length === 0) return false;
  if (!Array.isArray(r.futureOcrContractRules) || r.futureOcrContractRules.length === 0) return false;
  if (!Array.isArray(r.futureUiContractRules) || r.futureUiContractRules.length === 0) return false;
  if (r.explicitCurrentNonAuthorizations.length !== REQUIRED_EXPLICIT_CURRENT_NON_AUTHORIZATIONS.length) return false;
  for (const item of REQUIRED_EXPLICIT_CURRENT_NON_AUTHORIZATIONS) {
    if (!r.explicitCurrentNonAuthorizations.includes(item)) return false;
  }
  if (!Array.isArray(r.futureAllowedInputs) || r.futureAllowedInputs.length === 0) return false;
  if (!Array.isArray(r.futureForbiddenInputs) || r.futureForbiddenInputs.length === 0) return false;
  if (!Array.isArray(r.futureBlockedScenarios) || r.futureBlockedScenarios.length === 0) return false;
  if (!Array.isArray(r.futureTamperRequirements) || r.futureTamperRequirements.length === 0) return false;
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

type Tamper810AMutation = (
  r: PhotoOcrControlledRuntimeGateDesignResult,
) => PhotoOcrControlledRuntimeGateDesignResult;
interface Tamper810ACase {
  label: string;
  mutate: Tamper810AMutation;
}

const PHOTO_OCR_CONTROLLED_RUNTIME_GATE_DESIGN_TAMPER_CASES: Tamper810ACase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9N" as "8.10A" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (8.9N source evidence missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit is not 3cf81c1)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "designOnly false", mutate: (r) => ({ ...r, designOnly: false as true }) },
  { label: "implementationPerformed true", mutate: (r) => ({ ...r, implementationPerformed: true as false }) },
  { label: "routeModified true", mutate: (r) => ({ ...r, routeModified: true as false }) },
  { label: "uiModified true", mutate: (r) => ({ ...r, uiModified: true as false }) },
  { label: "ocrRuntimeEnabledNow true (OCR runtime is enabled now)", mutate: (r) => ({ ...r, ocrRuntimeEnabledNow: true as false }) },
  { label: "photoRuntimeEnabledNow true (photo runtime is enabled now)", mutate: (r) => ({ ...r, photoRuntimeEnabledNow: true as false }) },
  { label: "uploadRuntimeEnabledNow true (upload runtime is enabled now)", mutate: (r) => ({ ...r, uploadRuntimeEnabledNow: true as false }) },
  { label: "fileUploadStillBlocked false (file upload is enabled now)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false as true }) },
  { label: "publicRuntimeEnabledNow true (public runtime is enabled now)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode becomes enabled)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA becomes enabled)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false (persistence/DB/storage becomes enabled)", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "dbStorageStillBlocked false (persistence/DB/storage becomes enabled)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false as true }) },
  { label: "requiredFutureEnvFlag wrong (required env flag is not SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED)", mutate: (r) => ({ ...r, requiredFutureEnvFlag: "SMART_TALK_FREE_QA_PUBLIC_ENABLED" as "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED" }) },
  { label: "requiredFutureEnvFlagExactValue wrong (required env value is not exact lowercase true)", mutate: (r) => ({ ...r, requiredFutureEnvFlagExactValue: "1" as "true" }) },
  { label: "futureEnvUppercaseTrueBehavior not fail_closed (uppercase TRUE is accepted)", mutate: (r) => ({ ...r, futureEnvUppercaseTrueBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureEnvOneBehavior not fail_closed (\"1\" is accepted)", mutate: (r) => ({ ...r, futureEnvOneBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureEnvYesBehavior not fail_closed (\"yes\" is accepted)", mutate: (r) => ({ ...r, futureEnvYesBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureEnvWhitespaceTrueBehavior not fail_closed (whitespace true is accepted)", mutate: (r) => ({ ...r, futureEnvWhitespaceTrueBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureEnvAbsentBehavior not fail_closed (env absent does not fail closed)", mutate: (r) => ({ ...r, futureEnvAbsentBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureEnvFalseBehavior not fail_closed", mutate: (r) => ({ ...r, futureEnvFalseBehavior: "fail_open" as "fail_closed" }) },
  { label: "futureModeName wrong (future mode name is not photo_ocr_controlled_runtime)", mutate: (r) => ({ ...r, futureModeName: "text_document_controlled_runtime" as "photo_ocr_controlled_runtime" }) },
  { label: "futureAllowedInputKind wrong (future context is not anonymous / input contract altered)", mutate: (r) => ({ ...r, futureAllowedInputKind: "any_uploaded_file" as "operator_selected_image_pages_only" }) },
  { label: "maxFuturePageCount exceeds 3 (future page count exceeds 3)", mutate: (r) => ({ ...r, maxFuturePageCount: 10 as 3 }) },
  { label: "futureAllowedImageTypes includes unsupported types", mutate: (r) => ({ ...r, futureAllowedImageTypes: ["image/jpeg", "image/png", "application/pdf"] as unknown as ["image/jpeg", "image/png", "image/webp"] }) },
  { label: "futureMaxRawImageMbPerPage exceeds 8 MB per page", mutate: (r) => ({ ...r, futureMaxRawImageMbPerPage: 50 as 8 }) },
  { label: "futureMaxProcessedPayloadMbTotal exceeds 4 MB", mutate: (r) => ({ ...r, futureMaxProcessedPayloadMbTotal: 20 as 4 }) },
  { label: "futureNoBackgroundUpload false (background upload is allowed)", mutate: (r) => ({ ...r, futureNoBackgroundUpload: false as true }) },
  { label: "futureNoPersistence false (persistence of raw image is allowed)", mutate: (r) => ({ ...r, futureNoPersistence: false as true }) },
  { label: "futureNoDbStorage false (DB/storage/DNA write is allowed)", mutate: (r) => ({ ...r, futureNoDbStorage: false as true }) },
  { label: "futureNoSupabaseStorage false (DB/storage/DNA write is allowed)", mutate: (r) => ({ ...r, futureNoSupabaseStorage: false as true }) },
  { label: "futureNoVayloDnaWrite false (DB/storage/DNA write is allowed)", mutate: (r) => ({ ...r, futureNoVayloDnaWrite: false as true }) },
  { label: "futureNoPaidMode false (paid mode becomes enabled)", mutate: (r) => ({ ...r, futureNoPaidMode: false as true }) },
  { label: "futureNoPublicRuntime false (public runtime becomes ready)", mutate: (r) => ({ ...r, futureNoPublicRuntime: false as true }) },
  { label: "futureNoProductionRuntime false (production becomes true)", mutate: (r) => ({ ...r, futureNoProductionRuntime: false as true }) },
  { label: "futureOnlyExactLowercaseTrueEnablesControlledInternalPath false", mutate: (r) => ({ ...r, futureOnlyExactLowercaseTrueEnablesControlledInternalPath: false as true }) },
  { label: "photoOcrStillBlocked false (OCR/photo remains blocked violated)", mutate: (r) => ({ ...r, photoOcrStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "documentImagesTextStillSensitive false (image/text sensitivity is not preserved)", mutate: (r) => ({ ...r, documentImagesTextStillSensitive: false as true }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline calculation is allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice is allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation is allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false as true }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata is touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (recommended next phase is not 8.10B)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10C" as "8.10B" }) },
  { label: "recommendedNextPhase wrong (recommended next phase is not 8.10B)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Controlled Runtime Implementation Plan" }) },
  { label: "liveRouteInvocationPerformedByThisDesign true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisDesign: true as false }) },
  { label: "openAiSdkImportedByDesign true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImportedByDesign: true as false }) },
  { label: "ocrLibraryImportedByDesign true (claims OCR library import)", mutate: (r) => ({ ...r, ocrLibraryImportedByDesign: true as false }) },
  { label: "fetchUsedAsRuntimeByDesign true (claims fetch runtime access)", mutate: (r) => ({ ...r, fetchUsedAsRuntimeByDesign: true as false }) },
  { label: "processEnvReadForAuthorizationByDesign true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorizationByDesign: true as false }) },
  { label: "realImagesReadByDesign true (claims real image reads)", mutate: (r) => ({ ...r, realImagesReadByDesign: true as false }) },
  { label: "filesReadFromDiskByDesign true (claims disk file reads)", mutate: (r) => ({ ...r, filesReadFromDiskByDesign: true as false }) },
  { label: "cameraGalleryUsedByDesign true (claims camera/gallery use)", mutate: (r) => ({ ...r, cameraGalleryUsedByDesign: true as false }) },
  { label: "filesWrittenByDesign true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByDesign: true as false }) },
  { label: "dbStorageTouchedByDesign true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouchedByDesign: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length (all forbidden inputs not fully listed / source evidence altered)", mutate: (r) => ({ ...r, sourceEvidence: r.sourceEvidence.slice(0, 2) }) },
  { label: "gateDesignEvidence emptied", mutate: (r) => ({ ...r, gateDesignEvidence: [] }) },
  { label: "futureEnvGateRules emptied", mutate: (r) => ({ ...r, futureEnvGateRules: [] }) },
  { label: "futureRouteContractRules emptied", mutate: (r) => ({ ...r, futureRouteContractRules: [] }) },
  { label: "futureOcrContractRules emptied", mutate: (r) => ({ ...r, futureOcrContractRules: [] }) },
  { label: "futureUiContractRules emptied", mutate: (r) => ({ ...r, futureUiContractRules: [] }) },
  { label: "explicitCurrentNonAuthorizations wrong length (current non-authorizations do not remain false)", mutate: (r) => ({ ...r, explicitCurrentNonAuthorizations: r.explicitCurrentNonAuthorizations.slice(0, 3) }) },
  { label: "futureAllowedInputs emptied", mutate: (r) => ({ ...r, futureAllowedInputs: [] }) },
  { label: "futureForbiddenInputs emptied (all forbidden inputs not fully listed)", mutate: (r) => ({ ...r, futureForbiddenInputs: [] }) },
  { label: "futureBlockedScenarios emptied", mutate: (r) => ({ ...r, futureBlockedScenarios: [] }) },
  { label: "futureTamperRequirements emptied", mutate: (r) => ({ ...r, futureTamperRequirements: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported design runner ─────────────────────────────────────────────────

export function runPhotoOcrControlledRuntimeGateDesign(): PhotoOcrControlledRuntimeGateDesignResult {
  const designFailures: string[] = [];

  // ── Call 8.9N internal readiness closure as source of truth ──────────────
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") designFailures.push(`8.9N checkId mismatch: expected "8.9N", got "${n.checkId}"`);
  if (n.allPassed !== true) designFailures.push("8.9N allPassed is not true");
  if (n.sourceUiPatchCommit !== "e7d47c5") designFailures.push("8.9N sourceUiPatchCommit mismatch");
  if (n.sourcePlanningCommit !== "d22dc64") designFailures.push("8.9N sourcePlanningCommit mismatch");
  if (n.sourceExecutionClosureCommit !== "5451c5f") designFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.textDocumentModeInternalReadinessClosed !== true)
    designFailures.push("8.9N textDocumentModeInternalReadinessClosed is not true");
  if (n.readyForTextDocumentModeInternalUse !== true)
    designFailures.push("8.9N readyForTextDocumentModeInternalUse is not true");
  if (n.readyForTextDocumentRuntime !== false) designFailures.push("8.9N readyForTextDocumentRuntime is not false");
  if (n.readyForPhotoOcrRuntime !== false) designFailures.push("8.9N readyForPhotoOcrRuntime is not false");
  if (n.readyForPublicRuntime !== false) designFailures.push("8.9N readyForPublicRuntime is not false");
  if (n.readyForProduction !== false) designFailures.push("8.9N readyForProduction is not false");
  if (n.readyForGoLive !== false) designFailures.push("8.9N readyForGoLive is not false");
  if (n.photoOcrRuntimeStillBlocked !== true) designFailures.push("8.9N photoOcrRuntimeStillBlocked is not true");
  if (n.publicRuntimeStillBlocked !== true) designFailures.push("8.9N publicRuntimeStillBlocked is not true");
  if (n.tamperRejected !== n.tamperCount) designFailures.push("8.9N own tamper count mismatch");

  const sourceTextDocumentInternalReadinessAccepted = designFailures.length === 0;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const gateDesignEvidence: string[] = [
    "Gate name: photo_ocr_controlled_runtime_gate; future mode name: photo_ocr_controlled_runtime.",
    "Future runtime scope is controlled_internal_only; current phase scope is design_only.",
    "Future allowed input kind is operator_selected_image_pages_only (no background/automatic capture or ingestion).",
    "Max future page count is 3; allowed image types are image/jpeg, image/png, image/webp only.",
    "Max raw image size is 8 MB per page; max processed payload total is 4 MB.",
    "No background upload, no persistence, no DB/storage, no Supabase storage, no Vaylo DNA write, no paid mode, no public runtime, no production runtime is designed into the future gate.",
    "This design mirrors the fail-closed, env-gated, minimal-diff pattern already validated for Text Document Mode (8.9C/8.9G/8.9K).",
  ];

  const futureEnvGateRules: string[] = [
    "Required future env flag: SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED.",
    "Required exact value: the string \"true\" (lowercase, no surrounding whitespace).",
    "Env flag absent → fail closed (controlled runtime path rejected).",
    "Env flag exactly \"false\" → fail closed.",
    "Env flag \"TRUE\" (uppercase) → fail closed (not accepted as enabling).",
    "Env flag \"1\" → fail closed (not accepted as enabling).",
    "Env flag \"yes\" → fail closed (not accepted as enabling).",
    "Env flag \" true \" (whitespace-padded) → fail closed (not accepted as enabling).",
    "Only the exact lowercase string \"true\" may enable the controlled internal Photo/OCR path.",
  ];

  const futureRouteContractRules: string[] = [
    "Accept photo_ocr_controlled_runtime only if ALL of the following hold simultaneously:",
    "- mode exactly equals \"photo_ocr_controlled_runtime\".",
    "- context exactly equals \"anonymous\".",
    "- inputType exactly equals \"photo\".",
    "- locale is one of the allowed locales.",
    "- env flag SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED exactly equals \"true\".",
    "- request is multipart/FormData or an explicitly approved image payload format.",
    "- page count is between 1 and 3 inclusive.",
    "- each image MIME type is one of image/jpeg, image/png, image/webp.",
    "- raw size per page is within the 8 MB per-page limit.",
    "- processed total payload is within the 4 MB total limit.",
    "- no paid mode marker is present in the request.",
    "- no DNA/auth/profile marker is present in the request.",
    "- no persistence marker is present in the request.",
    "- no storage marker is present in the request.",
    "- no external URL/image URL ingestion is present.",
    "- no remote fetch instruction is present.",
    "- no background upload marker is present.",
    "- no auto-save marker is present.",
    "- no exact legal deadline request is detected.",
    "- no binding legal advice request is detected.",
    "- no official filing generation request is detected.",
    "- no credential/API key/password content is detected.",
    "- no IBAN/payment authorization content is detected.",
    "- no public/production/go-live marker is present.",
    "Reject the request (fail closed) if any single one of the above conditions is not met.",
  ];

  const futureOcrContractRules: string[] = [
    "Treat OCR output as untrusted at all times.",
    "Treat image content as sensitive at all times.",
    "Treat extracted text as sensitive at all times.",
    "Do not persist raw images.",
    "Do not persist processed images.",
    "Do not persist OCR text.",
    "Do not write to DB/storage/DNA.",
    "Do not auto-submit official forms.",
    "Do not calculate exact legal deadlines.",
    "Do not generate binding legal advice.",
    "Do not generate official filing content.",
    "Do not silently reuse image contents outside the originating request.",
    "Attach a privacy disclaimer to every response.",
    "Attach a legal disclaimer to every response.",
    "Include OCR quality/confidence state in every response.",
    "Fail safely on low-quality OCR (do not fabricate or guess missing content).",
    "Require user-visible uncertainty messaging if OCR is unclear.",
    "Keep model output untrusted at all times.",
  ];

  const futureUiContractRules: string[] = [
    "A controlled internal photo/OCR test path may be exposed only when the photo tab is active.",
    "The controlled internal feature flag must be enforced through the server-side route only — no client-side public authorization.",
    "Internal test wording must be explicit (e.g. \"Interný test\") and no public launch wording may be used.",
    "No production wording may be used.",
    "No automatic upload may start on tab click.",
    "The user must explicitly choose a camera/gallery image before any processing begins.",
    "No upload may occur before explicit user action.",
    "No file may be persisted client-side or server-side.",
    "No Vaylo DNA write may occur.",
    "No paid mode may be presented as active.",
    "Result output must include a privacy/legal disclaimer.",
    "An OCR confidence/quality warning must be visible whenever relevant.",
  ];

  const futureAllowedInputs: string[] = [
    "Operator-selected image pages only (camera capture or gallery selection triggered by explicit user action).",
    "Up to 3 image pages per request.",
    "Image MIME types limited to image/jpeg, image/png, image/webp.",
    "Raw image size up to 8 MB per page.",
    "Total processed payload up to 4 MB.",
    "mode exactly \"photo_ocr_controlled_runtime\", context exactly \"anonymous\", inputType exactly \"photo\".",
  ];

  const futureForbiddenInputs: string[] = [
    "Missing env flag.",
    "False env flag.",
    "Uppercase TRUE env flag.",
    "Mode mismatch (anything other than exactly \"photo_ocr_controlled_runtime\").",
    "inputType mismatch (anything other than exactly \"photo\").",
    "Context mismatch (anything other than exactly \"anonymous\").",
    "text_document_controlled_runtime mixed with photo payload.",
    "photo_ocr_controlled_runtime mixed with text-only payload.",
    "URL-based images (remote image URL ingestion).",
    "Remote fetch instruction.",
    "File paths (local filesystem path ingestion).",
    "PDF upload.",
    "Document storage request.",
    "Paid activation request.",
    "DNA/profile/user identity write.",
    "Supabase storage request.",
    "DB write request.",
    "Exact legal deadline calculation request.",
    "Binding legal advice request.",
    "Official filing generation request.",
    "Credential/API key/password content.",
    "IBAN/payment authorization content.",
    "Public runtime marker.",
    "Production marker.",
    "Go-live marker.",
    "8.3AC invocation marker.",
  ];

  const futureBlockedScenarios: string[] = [
    "Missing/false/uppercase/whitespace/'1'/'yes' env flag values → fail closed, controlled path rejected.",
    "Page count 0 or greater than 3 → rejected.",
    "Unsupported MIME type (e.g. application/pdf, image/gif) → rejected.",
    "Raw image exceeding 8 MB per page or processed payload exceeding 4 MB total → rejected.",
    "Remote image URL or fetch-based image ingestion → rejected.",
    "Local file path ingestion → rejected.",
    "Paid document mode activation attempt → rejected.",
    "Vaylo DNA save/write attempt → rejected.",
    "Persistence/DB/Supabase storage attempt → rejected.",
    "Exact legal deadline calculation request via image/OCR text → rejected.",
    "Binding legal advice request via image/OCR text → rejected.",
    "Official filing generation request via image/OCR text → rejected.",
    "Credential/API key/password-like content in image/OCR text → rejected.",
    "IBAN/payment authorization content in image/OCR text → rejected.",
    "Public/production/go-live wording or markers → rejected.",
    "Photo mode UI must never expose the internal Text Document Mode button, and text mode UI must never expose a future internal Photo/OCR button unless explicitly wired in a later phase.",
  ];

  const futureTamperRequirements: string[] = [
    "A future implementation's own tamper suite must fail if: env flag is anything other than exact lowercase \"true\".",
    "Must fail if: mode is anything other than exactly \"photo_ocr_controlled_runtime\".",
    "Must fail if: context is anything other than exactly \"anonymous\", or inputType is anything other than exactly \"photo\".",
    "Must fail if: page count validation accepts 0 or more than 3 pages.",
    "Must fail if: MIME type validation accepts anything outside image/jpeg, image/png, image/webp.",
    "Must fail if: size validation accepts more than 8 MB per page or more than 4 MB total processed payload.",
    "Must fail if: remote URL, file path, or PDF ingestion is accepted.",
    "Must fail if: persistence, DB, storage, or DNA write is permitted anywhere in the path.",
    "Must fail if: paid mode, public runtime, production, or go-live markers are accepted.",
    "Must fail if: exact legal deadline, binding legal advice, or official filing generation requests are permitted.",
    "Must fail if: credential/API key/password or IBAN/payment content is permitted through.",
    "Must fail if: OCR output or model output is treated as trusted, or image/text sensitivity is not preserved.",
    "Must fail if: 8.3AC is marked as run or tmp-8-3ac-live-metadata.ts is touched.",
  ];

  const notes: string[] = [
    "GD-01: 8.10A is a design-only phase. No Photo/OCR implementation, route branch, or UI wiring is created.",
    `GD-02: 8.9N confirmed as source of truth — checkId=${n.checkId}, allPassed=${n.allPassed}, textDocumentModeInternalReadinessClosed=${n.textDocumentModeInternalReadinessClosed}, readyForPhotoOcrRuntime=${n.readyForPhotoOcrRuntime}.`,
    "GD-03: this design mirrors the validated Text Document Mode gate pattern (exact env-flag string match, fail-closed on any deviation, strict allow-list contract, explicit forbidden-input enumeration).",
    "GD-04: no image, OCR library, or file was read by this phase; no camera/gallery was used; no fetch/route/model call was made.",
    "GD-05: this design does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "GD-06: ready for Phase 8.10B — Photo/OCR Controlled Runtime Implementation Plan (planning only; still no runtime activation).",
  ];

  const tamperCount = PHOTO_OCR_CONTROLLED_RUNTIME_GATE_DESIGN_TAMPER_CASES.length;

  const provisional: PhotoOcrControlledRuntimeGateDesignResult = {
    checkId: "8.10A",
    allPassed: true,
    designOnly: true,
    gateDesignOnly: true,
    implementationPerformed: false,
    routeModified: false,
    uiModified: false,
    ocrRuntimeEnabledNow: false,
    photoRuntimeEnabledNow: false,
    uploadRuntimeEnabledNow: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    sourceTextDocumentInternalReadinessPhase: "8.9N",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceTextDocumentInternalReadinessAccepted,
    gateName: "photo_ocr_controlled_runtime_gate",
    futureModeName: "photo_ocr_controlled_runtime",
    futureRuntimeScope: "controlled_internal_only",
    currentPhaseScope: "design_only",
    futureAllowedInputKind: "operator_selected_image_pages_only",
    maxFuturePageCount: 3,
    futureAllowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    futureMaxRawImageMbPerPage: 8,
    futureMaxProcessedPayloadMbTotal: 4,
    futureNoBackgroundUpload: true,
    futureNoPersistence: true,
    futureNoDbStorage: true,
    futureNoSupabaseStorage: true,
    futureNoVayloDnaWrite: true,
    futureNoPaidMode: true,
    futureNoPublicRuntime: true,
    futureNoProductionRuntime: true,
    requiredFutureEnvFlag: "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED",
    requiredFutureEnvFlagExactValue: "true",
    futureEnvAbsentBehavior: "fail_closed",
    futureEnvFalseBehavior: "fail_closed",
    futureEnvUppercaseTrueBehavior: "fail_closed",
    futureEnvOneBehavior: "fail_closed",
    futureEnvYesBehavior: "fail_closed",
    futureEnvWhitespaceTrueBehavior: "fail_closed",
    futureOnlyExactLowercaseTrueEnablesControlledInternalPath: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    publicRuntimeStillBlocked: true,
    modelOutputStillUntrusted: true,
    documentImagesTextStillSensitive: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,
    readyForNextPhase: "8.10B",
    recommendedNextPhase: "Photo/OCR Controlled Runtime Implementation Plan",
    readyForPhotoOcrImplementationPlanning: true,
    readyForPhotoOcrRuntime: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    liveRouteInvocationPerformedByThisDesign: false,
    liveModelCallPerformedByThisDesign: false,
    openAiSdkImportedByDesign: false,
    ocrLibraryImportedByDesign: false,
    fetchUsedAsRuntimeByDesign: false,
    processEnvReadForAuthorizationByDesign: false,
    realImagesReadByDesign: false,
    filesReadFromDiskByDesign: false,
    cameraGalleryUsedByDesign: false,
    filesWrittenByDesign: false,
    dbStorageTouchedByDesign: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    sourceEvidence,
    gateDesignEvidence,
    futureEnvGateRules,
    futureRouteContractRules,
    futureOcrContractRules,
    futureUiContractRules,
    explicitCurrentNonAuthorizations: REQUIRED_EXPLICIT_CURRENT_NON_AUTHORIZATIONS,
    futureAllowedInputs,
    futureForbiddenInputs,
    futureBlockedScenarios,
    futureTamperRequirements,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10B: Photo/OCR Controlled Runtime Implementation Plan — define the minimal, safe route-branch implementation plan for photo_ocr_controlled_runtime using this gate design as source of truth (planning only, still no runtime activation).",
      "Only after 8.10B planning and its own audit/decision phases: a scoped, env-flag-gated Photo/OCR route patch may be considered, mirroring the Text Document Mode phase sequence (8.9C-style minimal patch → 8.9G-style hardening audit → 8.9H-style internal review → 8.9I/J/K-style UI wiring → 8.9L/M-style manual test → 8.9N-style internal readiness closure).",
      "Public runtime, production, and go-live remain out of scope for all Photo/OCR phases until a separate, explicitly authorized public-launch gate is designed and approved.",
    ],
    notes,
  };

  if (designFailures.length === 0 && !_isCanonicalPhotoOcrControlledRuntimeGateDesignResult(provisional)) {
    designFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_RUNTIME_GATE_DESIGN_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledRuntimeGateDesignResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10A tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) designFailures.push(...tamperFailures);

  const allPassed = designFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10A tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-runtime-gate-design");

if (invokedDirectly) {
  console.log(JSON.stringify(runPhotoOcrControlledRuntimeGateDesign(), null, 2));
}
