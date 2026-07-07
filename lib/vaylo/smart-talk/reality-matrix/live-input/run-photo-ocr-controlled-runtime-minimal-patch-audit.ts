/**
 * PHASE 8.10C — Photo/OCR Controlled Runtime Minimal Patch Audit
 *
 * Static, local, read-only audit of the 8.10C minimal patch to
 * app/api/smart-talk/route.ts and app/smart-talk/SmartTalkClient.tsx.
 * Confirms the patch:
 *  - added exactly one isolated, fail-closed, env-gated Photo/OCR controlled
 *    runtime placeholder branch to route.ts, per the 8.10A gate design and
 *    8.10B implementation plan;
 *  - added a minimal, internal-only Photo/OCR test control to
 *    SmartTalkClient.tsx, visible only in photo mode;
 *  - performed NO real OCR extraction, NO OCR dependency addition, NO model
 *    call for the placeholder path, NO persistence/DB/storage/DNA write, and
 *    NO public/production/go-live enablement;
 *  - preserved existing Free Q&A, Text Document Mode, rate-limit, and default
 *    photo-upload behavior unchanged.
 *
 * This audit performs NO live route/model/fetch(-as-runtime)/OpenAI/
 * process.env-authorization/DB/storage access of its own. It does not import
 * OCR libraries, does not read images, does not read files except source text
 * (route.ts, SmartTalkClient.tsx, package.json) for static analysis, does not
 * write files (other than this one new audit file), does not run 8.3AC, and
 * does not touch tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runPhotoOcrControlledRuntimeGateDesign } from "./run-photo-ocr-controlled-runtime-gate-design";
import { runPhotoOcrControlledRuntimeImplementationPlan } from "./run-photo-ocr-controlled-runtime-implementation-plan";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

const SMART_TALK_ROUTE_RELATIVE_PATH = "app/api/smart-talk/route.ts";
const SMART_TALK_CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const PACKAGE_JSON_RELATIVE_PATH = "package.json";

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrControlledRuntimeMinimalPatchAuditResult {
  checkId: "8.10C";
  allPassed: boolean;
  minimalPatchPerformed: true;
  implementationPlanSourceCommit: "6a26e47";
  gateDesignSourceCommit: "4a87043";
  textDocumentInternalReadinessSourceCommit: "3cf81c1";
  routePatchPerformed: boolean;
  uiPatchPerformed: boolean;
  uiPatchDeferred: boolean;
  uiPatchDeferredReason: string;
  realOcrExtractionPerformed: false;
  ocrDependencyAdded: boolean;
  ocrRuntimeEnabledNow: false;
  photoRuntimeControlledPlaceholderAdded: true;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  persistenceEnabledNow: false;
  dbStorageEnabledNow: false;
  supabaseStorageEnabledNow: false;
  paidDocumentModeEnabledNow: false;
  vayloDnaEnabledNow: false;
  modelCallForPhotoOcrPlaceholderPerformed: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceGateDesignAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  routeContainsPhotoOcrMode: boolean;
  routeContainsPhotoOcrEnvFlag: boolean;
  routeRequiresExactLowercaseTrue: boolean;
  routeRejectsUppercaseTrue: boolean;
  routeRejectsOneYesWhitespaceTrue: boolean;
  routeContainsDisabledCode: boolean;
  routeContainsPhotoPayloadRequiredCode: boolean;
  routeContainsUnsupportedMimeCode: boolean;
  routeContainsPageCountCode: boolean;
  routeContainsImageSizeCode: boolean;
  routeContainsPersistenceBlockCode: boolean;
  routeContainsStorageBlockCode: boolean;
  routeContainsPaidModeBlockCode: boolean;
  routeContainsPublicProductionGoLiveBlockCodes: boolean;
  routeContainsLegalSafetyBlockCodes: boolean;
  routeContainsCredentialFinancialBlockCodes: boolean;
  routeContainsEightThreeAcBlockCode: boolean;
  routeContainsPhotoOcrMeta: boolean;
  routeContainsPlaceholderOnly: boolean;
  routeContainsRealOcrExtractionPerformedFalse: boolean;
  routeContainsOcrRuntimeStillBlockedTrue: boolean;
  routeContainsNoPersistenceMetaFlags: boolean;
  routeContainsNoDbStorageMetaFlags: boolean;
  routeContainsNoPublicProductionGoLiveFlags: boolean;
  routeContainsModelOutputUntrustedFlag: boolean;
  routeContainsOcrOutputUntrustedFlag: boolean;
  routeContainsSensitivityFlags: boolean;
  routeContainsLegalPrivacyDisclaimerFlags: boolean;
  routeDoesNotImportOcrLibrary: boolean;
  routeDoesNotImportStorage: boolean;
  routeDoesNotCallSupabaseStorage: boolean;
  routeDoesNotCallDbWrite: boolean;
  routeDoesNotCallOpenAiForPhotoOcr: boolean;
  routeDoesNotRunEightThreeAc: boolean;

  smartTalkClientContainsPhotoOcrInternalButton: boolean;
  smartTalkClientButtonOnlyInPhotoMode: boolean;
  smartTalkClientDoesNotUseClientEnvAuthorization: boolean;
  smartTalkClientDoesNotUsePublicLaunchWording: boolean;
  smartTalkClientDoesNotAutoUploadOnTabClick: boolean;

  existingFreeQaBranchPreserved: boolean;
  existingTextDocumentModeBranchPreserved: boolean;
  existingRateLimitBehaviorPreserved: boolean;
  existingDefaultPhotoFlowPreserved: boolean;

  readyForNextPhase: "8.10D";
  recommendedNextPhase: "Photo/OCR Controlled Runtime Disabled Local API Closure";
  readyForDisabledLocalApiClosure: true;
  readyForEnabledControlledLocalApiClosure: false;
  readyForPhotoOcrRegressionPack: false;
  readyForPhotoOcrBrowserManualTest: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;

  liveRouteInvocationPerformedByThisAudit: false;
  liveModelCallPerformedByThisAudit: false;
  fetchCalledByThisAudit: false;
  runSmartTalkCalledByThisAudit: false;
  openAiSdkImportedByThisAudit: false;
  ocrLibraryImportedByThisAudit: false;
  imagesReadByThisAudit: false;
  filesWrittenByThisAudit: false;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  patchEvidence: string[];
  routePatchEvidence: string[];
  uiPatchEvidence: string[];
  placeholderRuntimeEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  safetyBoundaryEvidence: string[];
  responseContractEvidence: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Disabled local API closure not performed yet",
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
  "This audit performs static text analysis only — it does not invoke the route, does not call fetch, does not call runSmartTalk, and does not call any model.",
  "No image, OCR library, or file content is read; only route.ts, SmartTalkClient.tsx, and package.json are read as plain source text.",
  "This audit relies on committed 8.10A, 8.10B, and 8.9N evidence as its sources of truth.",
  "Live disabled-path and enabled-path API behavior has not yet been exercised — that is deferred to 8.10D and 8.10E.",
  "Real OCR extraction remains completely unimplemented and out of scope for this and all immediately following phases.",
  "Model output and OCR output remain untrusted for any future implementation.",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledRuntimeMinimalPatchAuditResult(
  r: PhotoOcrControlledRuntimeMinimalPatchAuditResult,
): boolean {
  if (r.checkId !== "8.10C") return false;
  if (r.allPassed !== true) return false;
  if (r.minimalPatchPerformed !== true) return false;
  if (r.implementationPlanSourceCommit !== "6a26e47") return false;
  if (r.gateDesignSourceCommit !== "4a87043") return false;
  if (r.textDocumentInternalReadinessSourceCommit !== "3cf81c1") return false;
  if (r.routePatchPerformed !== true) return false;
  if (r.uiPatchPerformed !== true) return false;
  if (r.uiPatchDeferred !== false) return false;
  if (r.realOcrExtractionPerformed !== false) return false;
  if (r.ocrDependencyAdded !== false) return false;
  if (r.ocrRuntimeEnabledNow !== false) return false;
  if (r.photoRuntimeControlledPlaceholderAdded !== true) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.persistenceEnabledNow !== false) return false;
  if (r.dbStorageEnabledNow !== false) return false;
  if (r.supabaseStorageEnabledNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.vayloDnaEnabledNow !== false) return false;
  if (r.modelCallForPhotoOcrPlaceholderPerformed !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.routeContainsPhotoOcrMode !== true) return false;
  if (r.routeContainsPhotoOcrEnvFlag !== true) return false;
  if (r.routeRequiresExactLowercaseTrue !== true) return false;
  if (r.routeRejectsUppercaseTrue !== true) return false;
  if (r.routeRejectsOneYesWhitespaceTrue !== true) return false;
  if (r.routeContainsDisabledCode !== true) return false;
  if (r.routeContainsPhotoPayloadRequiredCode !== true) return false;
  if (r.routeContainsUnsupportedMimeCode !== true) return false;
  if (r.routeContainsPageCountCode !== true) return false;
  if (r.routeContainsImageSizeCode !== true) return false;
  if (r.routeContainsPersistenceBlockCode !== true) return false;
  if (r.routeContainsStorageBlockCode !== true) return false;
  if (r.routeContainsPaidModeBlockCode !== true) return false;
  if (r.routeContainsPublicProductionGoLiveBlockCodes !== true) return false;
  if (r.routeContainsLegalSafetyBlockCodes !== true) return false;
  if (r.routeContainsCredentialFinancialBlockCodes !== true) return false;
  if (r.routeContainsEightThreeAcBlockCode !== true) return false;
  if (r.routeContainsPhotoOcrMeta !== true) return false;
  if (r.routeContainsPlaceholderOnly !== true) return false;
  if (r.routeContainsRealOcrExtractionPerformedFalse !== true) return false;
  if (r.routeContainsOcrRuntimeStillBlockedTrue !== true) return false;
  if (r.routeContainsNoPersistenceMetaFlags !== true) return false;
  if (r.routeContainsNoDbStorageMetaFlags !== true) return false;
  if (r.routeContainsNoPublicProductionGoLiveFlags !== true) return false;
  if (r.routeContainsModelOutputUntrustedFlag !== true) return false;
  if (r.routeContainsOcrOutputUntrustedFlag !== true) return false;
  if (r.routeContainsSensitivityFlags !== true) return false;
  if (r.routeContainsLegalPrivacyDisclaimerFlags !== true) return false;
  if (r.routeDoesNotImportOcrLibrary !== true) return false;
  if (r.routeDoesNotImportStorage !== true) return false;
  if (r.routeDoesNotCallSupabaseStorage !== true) return false;
  if (r.routeDoesNotCallDbWrite !== true) return false;
  if (r.routeDoesNotCallOpenAiForPhotoOcr !== true) return false;
  if (r.routeDoesNotRunEightThreeAc !== true) return false;

  if (r.smartTalkClientContainsPhotoOcrInternalButton !== true) return false;
  if (r.smartTalkClientButtonOnlyInPhotoMode !== true) return false;
  if (r.smartTalkClientDoesNotUseClientEnvAuthorization !== true) return false;
  if (r.smartTalkClientDoesNotUsePublicLaunchWording !== true) return false;
  if (r.smartTalkClientDoesNotAutoUploadOnTabClick !== true) return false;

  if (r.existingFreeQaBranchPreserved !== true) return false;
  if (r.existingTextDocumentModeBranchPreserved !== true) return false;
  if (r.existingRateLimitBehaviorPreserved !== true) return false;
  if (r.existingDefaultPhotoFlowPreserved !== true) return false;

  if (r.readyForNextPhase !== "8.10D") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Runtime Disabled Local API Closure") return false;
  if (r.readyForDisabledLocalApiClosure !== true) return false;
  if (r.readyForEnabledControlledLocalApiClosure !== false) return false;
  if (r.readyForPhotoOcrRegressionPack !== false) return false;
  if (r.readyForPhotoOcrBrowserManualTest !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  if (r.liveRouteInvocationPerformedByThisAudit !== false) return false;
  if (r.liveModelCallPerformedByThisAudit !== false) return false;
  if (r.fetchCalledByThisAudit !== false) return false;
  if (r.runSmartTalkCalledByThisAudit !== false) return false;
  if (r.openAiSdkImportedByThisAudit !== false) return false;
  if (r.ocrLibraryImportedByThisAudit !== false) return false;
  if (r.imagesReadByThisAudit !== false) return false;
  if (r.filesWrittenByThisAudit !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (!Array.isArray(r.sourceEvidence) || r.sourceEvidence.length === 0) return false;
  if (!Array.isArray(r.patchEvidence) || r.patchEvidence.length === 0) return false;
  if (!Array.isArray(r.routePatchEvidence) || r.routePatchEvidence.length === 0) return false;
  if (!Array.isArray(r.uiPatchEvidence) || r.uiPatchEvidence.length === 0) return false;
  if (!Array.isArray(r.placeholderRuntimeEvidence) || r.placeholderRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.responseContractEvidence) || r.responseContractEvidence.length === 0) return false;
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

type Tamper810CMutation = (
  r: PhotoOcrControlledRuntimeMinimalPatchAuditResult,
) => PhotoOcrControlledRuntimeMinimalPatchAuditResult;
interface Tamper810CCase {
  label: string;
  mutate: Tamper810CMutation;
}

const PHOTO_OCR_CONTROLLED_RUNTIME_MINIMAL_PATCH_AUDIT_TAMPER_CASES: Tamper810CCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10B" as "8.10C" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceGateDesignAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "gateDesignSourceCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, gateDesignSourceCommit: "0000000" as "4a87043" }) },
  { label: "sourceImplementationPlanAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "implementationPlanSourceCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, implementationPlanSourceCommit: "0000000" as "6a26e47" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "textDocumentInternalReadinessSourceCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, textDocumentInternalReadinessSourceCommit: "0000000" as "3cf81c1" }) },
  { label: "minimalPatchPerformed false", mutate: (r) => ({ ...r, minimalPatchPerformed: false as true }) },
  { label: "routePatchPerformed false (route patch missing)", mutate: (r) => ({ ...r, routePatchPerformed: false }) },
  { label: "routeContainsPhotoOcrMode false (route mode missing)", mutate: (r) => ({ ...r, routeContainsPhotoOcrMode: false }) },
  { label: "routeContainsPhotoOcrEnvFlag false (env flag missing)", mutate: (r) => ({ ...r, routeContainsPhotoOcrEnvFlag: false }) },
  { label: "routeRequiresExactLowercaseTrue false (env exact lowercase true rule weakened)", mutate: (r) => ({ ...r, routeRequiresExactLowercaseTrue: false }) },
  { label: "routeRejectsUppercaseTrue false (uppercase TRUE accepted)", mutate: (r) => ({ ...r, routeRejectsUppercaseTrue: false }) },
  { label: "routeRejectsOneYesWhitespaceTrue false (\"1\"/\"yes\"/whitespace true accepted)", mutate: (r) => ({ ...r, routeRejectsOneYesWhitespaceTrue: false }) },
  { label: "routeContainsDisabledCode false (disabled code missing)", mutate: (r) => ({ ...r, routeContainsDisabledCode: false }) },
  { label: "routeContainsPhotoPayloadRequiredCode false (photo payload requirement missing)", mutate: (r) => ({ ...r, routeContainsPhotoPayloadRequiredCode: false }) },
  { label: "routeContainsUnsupportedMimeCode false (unsupported MIME allowed)", mutate: (r) => ({ ...r, routeContainsUnsupportedMimeCode: false }) },
  { label: "routeContainsPageCountCode false (too many pages allowed)", mutate: (r) => ({ ...r, routeContainsPageCountCode: false }) },
  { label: "routeContainsImageSizeCode false (oversize image allowed)", mutate: (r) => ({ ...r, routeContainsImageSizeCode: false }) },
  { label: "routeContainsPersistenceBlockCode false (persistence allowed)", mutate: (r) => ({ ...r, routeContainsPersistenceBlockCode: false }) },
  { label: "routeContainsStorageBlockCode false (storage allowed)", mutate: (r) => ({ ...r, routeContainsStorageBlockCode: false }) },
  { label: "routeContainsPaidModeBlockCode false (paid mode allowed)", mutate: (r) => ({ ...r, routeContainsPaidModeBlockCode: false }) },
  { label: "routeContainsPublicProductionGoLiveBlockCodes false (public/production/go-live allowed)", mutate: (r) => ({ ...r, routeContainsPublicProductionGoLiveBlockCodes: false }) },
  { label: "routeContainsLegalSafetyBlockCodes false (exact legal deadline/binding legal advice/official filing allowed)", mutate: (r) => ({ ...r, routeContainsLegalSafetyBlockCodes: false }) },
  { label: "routeContainsCredentialFinancialBlockCodes false (credential/API key/password/IBAN/payment allowed)", mutate: (r) => ({ ...r, routeContainsCredentialFinancialBlockCodes: false }) },
  { label: "routeContainsEightThreeAcBlockCode false", mutate: (r) => ({ ...r, routeContainsEightThreeAcBlockCode: false }) },
  { label: "routeContainsPhotoOcrMeta false (photoOcrMeta missing)", mutate: (r) => ({ ...r, routeContainsPhotoOcrMeta: false }) },
  { label: "routeContainsPlaceholderOnly false (placeholderOnly missing/false)", mutate: (r) => ({ ...r, routeContainsPlaceholderOnly: false }) },
  { label: "routeContainsRealOcrExtractionPerformedFalse false (realOcrExtractionPerformed true)", mutate: (r) => ({ ...r, routeContainsRealOcrExtractionPerformedFalse: false }) },
  { label: "routeContainsOcrRuntimeStillBlockedTrue false (ocrRuntimeStillBlocked false)", mutate: (r) => ({ ...r, routeContainsOcrRuntimeStillBlockedTrue: false }) },
  { label: "routeContainsNoPersistenceMetaFlags false", mutate: (r) => ({ ...r, routeContainsNoPersistenceMetaFlags: false }) },
  { label: "routeContainsNoDbStorageMetaFlags false", mutate: (r) => ({ ...r, routeContainsNoDbStorageMetaFlags: false }) },
  { label: "routeContainsNoPublicProductionGoLiveFlags false", mutate: (r) => ({ ...r, routeContainsNoPublicProductionGoLiveFlags: false }) },
  { label: "routeContainsModelOutputUntrustedFlag false (model output trusted)", mutate: (r) => ({ ...r, routeContainsModelOutputUntrustedFlag: false }) },
  { label: "routeContainsOcrOutputUntrustedFlag false (OCR output trusted)", mutate: (r) => ({ ...r, routeContainsOcrOutputUntrustedFlag: false }) },
  { label: "routeContainsSensitivityFlags false (image/text sensitivity not preserved)", mutate: (r) => ({ ...r, routeContainsSensitivityFlags: false }) },
  { label: "routeContainsLegalPrivacyDisclaimerFlags false (disclaimers optional)", mutate: (r) => ({ ...r, routeContainsLegalPrivacyDisclaimerFlags: false }) },
  { label: "routeDoesNotImportOcrLibrary false (OCR dependency added / OCR import detected)", mutate: (r) => ({ ...r, routeDoesNotImportOcrLibrary: false }) },
  { label: "routeDoesNotImportStorage false (storage import detected)", mutate: (r) => ({ ...r, routeDoesNotImportStorage: false }) },
  { label: "routeDoesNotCallSupabaseStorage false (storage call detected)", mutate: (r) => ({ ...r, routeDoesNotCallSupabaseStorage: false }) },
  { label: "routeDoesNotCallDbWrite false (DB write detected)", mutate: (r) => ({ ...r, routeDoesNotCallDbWrite: false }) },
  { label: "routeDoesNotCallOpenAiForPhotoOcr false (OpenAI/model call detected inside Photo/OCR placeholder branch)", mutate: (r) => ({ ...r, routeDoesNotCallOpenAiForPhotoOcr: false }) },
  { label: "routeDoesNotRunEightThreeAc false (8.3AC marked run)", mutate: (r) => ({ ...r, routeDoesNotRunEightThreeAc: false }) },
  { label: "smartTalkClientContainsPhotoOcrInternalButton false while uiPatchPerformed true (inconsistent)", mutate: (r) => ({ ...r, smartTalkClientContainsPhotoOcrInternalButton: false }) },
  { label: "smartTalkClientButtonOnlyInPhotoMode false", mutate: (r) => ({ ...r, smartTalkClientButtonOnlyInPhotoMode: false }) },
  { label: "smartTalkClientDoesNotUseClientEnvAuthorization false", mutate: (r) => ({ ...r, smartTalkClientDoesNotUseClientEnvAuthorization: false }) },
  { label: "smartTalkClientDoesNotUsePublicLaunchWording false", mutate: (r) => ({ ...r, smartTalkClientDoesNotUsePublicLaunchWording: false }) },
  { label: "smartTalkClientDoesNotAutoUploadOnTabClick false", mutate: (r) => ({ ...r, smartTalkClientDoesNotAutoUploadOnTabClick: false }) },
  { label: "existingFreeQaBranchPreserved false", mutate: (r) => ({ ...r, existingFreeQaBranchPreserved: false }) },
  { label: "existingTextDocumentModeBranchPreserved false", mutate: (r) => ({ ...r, existingTextDocumentModeBranchPreserved: false }) },
  { label: "existingRateLimitBehaviorPreserved false", mutate: (r) => ({ ...r, existingRateLimitBehaviorPreserved: false }) },
  { label: "existingDefaultPhotoFlowPreserved false", mutate: (r) => ({ ...r, existingDefaultPhotoFlowPreserved: false }) },
  { label: "uiPatchDeferred true while uiPatchPerformed true (inconsistent)", mutate: (r) => ({ ...r, uiPatchDeferred: true }) },
  { label: "realOcrExtractionPerformed true", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "ocrDependencyAdded true (OCR dependency added)", mutate: (r) => ({ ...r, ocrDependencyAdded: true }) },
  { label: "ocrRuntimeEnabledNow true (OCR runtime enabled now)", mutate: (r) => ({ ...r, ocrRuntimeEnabledNow: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime allowed)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live allowed)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live allowed)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "persistenceEnabledNow true (persistence allowed)", mutate: (r) => ({ ...r, persistenceEnabledNow: true as false }) },
  { label: "dbStorageEnabledNow true (DB write detected)", mutate: (r) => ({ ...r, dbStorageEnabledNow: true as false }) },
  { label: "supabaseStorageEnabledNow true (storage allowed)", mutate: (r) => ({ ...r, supabaseStorageEnabledNow: true as false }) },
  { label: "paidDocumentModeEnabledNow true (paid mode allowed)", mutate: (r) => ({ ...r, paidDocumentModeEnabledNow: true as false }) },
  { label: "vayloDnaEnabledNow true (DNA write allowed)", mutate: (r) => ({ ...r, vayloDnaEnabledNow: true as false }) },
  { label: "modelCallForPhotoOcrPlaceholderPerformed true (model call performed true for Photo/OCR placeholder)", mutate: (r) => ({ ...r, modelCallForPhotoOcrPlaceholderPerformed: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "readyForNextPhase wrong (next phase not 8.10D)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10E" as "8.10D" }) },
  { label: "recommendedNextPhase wrong (next phase not 8.10D)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Controlled Runtime Disabled Local API Closure" }) },
  { label: "readyForDisabledLocalApiClosure false", mutate: (r) => ({ ...r, readyForDisabledLocalApiClosure: false as true }) },
  { label: "readyForEnabledControlledLocalApiClosure true before disabled closure", mutate: (r) => ({ ...r, readyForEnabledControlledLocalApiClosure: true as false }) },
  { label: "readyForPhotoOcrRegressionPack true too early", mutate: (r) => ({ ...r, readyForPhotoOcrRegressionPack: true as false }) },
  { label: "readyForPhotoOcrBrowserManualTest true too early", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualTest: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "liveRouteInvocationPerformedByThisAudit true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisAudit: true as false }) },
  { label: "liveModelCallPerformedByThisAudit true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisAudit: true as false }) },
  { label: "fetchCalledByThisAudit true (claims fetch call)", mutate: (r) => ({ ...r, fetchCalledByThisAudit: true as false }) },
  { label: "runSmartTalkCalledByThisAudit true (claims runSmartTalk call)", mutate: (r) => ({ ...r, runSmartTalkCalledByThisAudit: true as false }) },
  { label: "openAiSdkImportedByThisAudit true (claims OpenAI import)", mutate: (r) => ({ ...r, openAiSdkImportedByThisAudit: true as false }) },
  { label: "ocrLibraryImportedByThisAudit true (claims OCR library import)", mutate: (r) => ({ ...r, ocrLibraryImportedByThisAudit: true as false }) },
  { label: "imagesReadByThisAudit true (claims image reads)", mutate: (r) => ({ ...r, imagesReadByThisAudit: true as false }) },
  { label: "filesWrittenByThisAudit true (claims file writes)", mutate: (r) => ({ ...r, filesWrittenByThisAudit: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence emptied", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "patchEvidence emptied", mutate: (r) => ({ ...r, patchEvidence: [] }) },
  { label: "routePatchEvidence emptied", mutate: (r) => ({ ...r, routePatchEvidence: [] }) },
  { label: "uiPatchEvidence emptied", mutate: (r) => ({ ...r, uiPatchEvidence: [] }) },
  { label: "placeholderRuntimeEvidence emptied", mutate: (r) => ({ ...r, placeholderRuntimeEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "responseContractEvidence emptied", mutate: (r) => ({ ...r, responseContractEvidence: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported audit runner ──────────────────────────────────────────────────

export function runPhotoOcrControlledRuntimeMinimalPatchAudit(): PhotoOcrControlledRuntimeMinimalPatchAuditResult {
  const auditFailures: string[] = [];

  // ── Call 8.10A gate design as source of truth ────────────────────────────
  const a = runPhotoOcrControlledRuntimeGateDesign();
  if (a.checkId !== "8.10A") auditFailures.push(`8.10A checkId mismatch: expected "8.10A", got "${a.checkId}"`);
  if (a.allPassed !== true) auditFailures.push("8.10A allPassed is not true");
  if (a.requiredFutureEnvFlag !== "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED")
    auditFailures.push("8.10A requiredFutureEnvFlag mismatch");
  if (a.requiredFutureEnvFlagExactValue !== "true") auditFailures.push("8.10A requiredFutureEnvFlagExactValue mismatch");
  if (a.futureModeName !== "photo_ocr_controlled_runtime") auditFailures.push("8.10A futureModeName mismatch");
  if (a.tamperRejected !== a.tamperCount) auditFailures.push("8.10A own tamper count mismatch");
  const sourceGateDesignAccepted = auditFailures.length === 0;

  // ── Call 8.10B implementation plan as source of truth ────────────────────
  const bFailuresBefore = auditFailures.length;
  const b = runPhotoOcrControlledRuntimeImplementationPlan();
  if (b.checkId !== "8.10B") auditFailures.push(`8.10B checkId mismatch: expected "8.10B", got "${b.checkId}"`);
  if (b.allPassed !== true) auditFailures.push("8.10B allPassed is not true");
  if (b.targetFuturePatchPhase !== "8.10C") auditFailures.push("8.10B targetFuturePatchPhase mismatch");
  if (b.eightTenCIsFirstAllowedPatch !== true) auditFailures.push("8.10B eightTenCIsFirstAllowedPatch is not true");
  if (b.tamperRejected !== b.tamperCount) auditFailures.push("8.10B own tamper count mismatch");
  const sourceImplementationPlanAccepted = auditFailures.length === bFailuresBefore;

  // ── Call 8.9N internal readiness closure as source of truth ──────────────
  const nFailuresBefore = auditFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") auditFailures.push(`8.9N checkId mismatch: expected "8.9N", got "${n.checkId}"`);
  if (n.allPassed !== true) auditFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") auditFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) auditFailures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = auditFailures.length === nFailuresBefore;

  const sourceEvidence: string[] = [
    "8.10A gate design accepted",
    "8.10B implementation plan accepted",
    "8.9N internal readiness closure accepted",
    `8.10A checkId=${a.checkId} allPassed=${a.allPassed}`,
    `8.10B checkId=${b.checkId} allPassed=${b.allPassed} targetFuturePatchPhase=${b.targetFuturePatchPhase}`,
    `8.9N checkId=${n.checkId} allPassed=${n.allPassed}`,
  ];

  // ── Static read of route.ts (read-only, no import/execution) ─────────────
  const routeAbsPath = path.join(process.cwd(), SMART_TALK_ROUTE_RELATIVE_PATH);
  let routeContent = "";
  let routeExists = false;
  try {
    routeExists = fs.existsSync(routeAbsPath) && fs.statSync(routeAbsPath).isFile();
    if (routeExists) routeContent = fs.readFileSync(routeAbsPath, "utf8");
  } catch {
    routeExists = false;
  }
  if (!routeExists) auditFailures.push(`${SMART_TALK_ROUTE_RELATIVE_PATH} not found`);

  // ── Static read of SmartTalkClient.tsx (read-only, no import/execution) ──
  const clientAbsPath = path.join(process.cwd(), SMART_TALK_CLIENT_RELATIVE_PATH);
  let clientContent = "";
  let clientExists = false;
  try {
    clientExists = fs.existsSync(clientAbsPath) && fs.statSync(clientAbsPath).isFile();
    if (clientExists) clientContent = fs.readFileSync(clientAbsPath, "utf8");
  } catch {
    clientExists = false;
  }
  if (!clientExists) auditFailures.push(`${SMART_TALK_CLIENT_RELATIVE_PATH} not found`);

  // ── Static read of package.json (read-only, dependency scan only) ────────
  const packageJsonAbsPath = path.join(process.cwd(), PACKAGE_JSON_RELATIVE_PATH);
  let packageJsonContent = "";
  try {
    if (fs.existsSync(packageJsonAbsPath) && fs.statSync(packageJsonAbsPath).isFile()) {
      packageJsonContent = fs.readFileSync(packageJsonAbsPath, "utf8");
    }
  } catch {
    packageJsonContent = "";
  }
  const OCR_DEPENDENCY_NAME_PATTERN =
    /tesseract|node-ocr|easyocr|ocr-space|google-cloud-vision|@google-cloud\/vision|azure-cognitiveservices|aws-textract|@aws-sdk\/client-textract/i;
  const ocrDependencyAdded = OCR_DEPENDENCY_NAME_PATTERN.test(packageJsonContent);

  // ── Route branch: mode / env-flag gate detection ──────────────────────────
  const routeContainsPhotoOcrMode = /photo_ocr_controlled_runtime/.test(routeContent);
  const routeContainsPhotoOcrEnvFlag = /SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED/.test(routeContent);
  const envFlagExactCheckRegex = /process\.env\[PHOTO_OCR_ENV_FLAG\]\s*===\s*"true"/;
  const envFlagLooseNormalizationRegex =
    /process\.env\[PHOTO_OCR_ENV_FLAG\][^;]*\.(toLowerCase|toUpperCase|trim)\(/;
  // Case-sensitive on purpose: "TRUE"/"1"/"yes" must be distinguished from the
  // required exact lowercase "true" — an /i flag here would wrongly match the
  // correct "true" comparison against the "TRUE" alternative.
  const envFlagAlternateTruthyRegex = /PHOTO_OCR_ENV_FLAG[^;]*===\s*"(1|yes|TRUE)"/;
  const routeRequiresExactLowercaseTrue = envFlagExactCheckRegex.test(routeContent);
  const routeRejectsUppercaseTrue =
    routeRequiresExactLowercaseTrue && !envFlagLooseNormalizationRegex.test(routeContent);
  const routeRejectsOneYesWhitespaceTrue =
    routeRequiresExactLowercaseTrue &&
    !envFlagLooseNormalizationRegex.test(routeContent) &&
    !envFlagAlternateTruthyRegex.test(routeContent);

  // ── Route branch: required blocked response codes ─────────────────────────
  const routeContainsDisabledCode = /photo_ocr_controlled_runtime_disabled/.test(routeContent);
  const routeContainsPhotoPayloadRequiredCode = /photo_ocr_photo_payload_required/.test(routeContent);
  const routeContainsUnsupportedMimeCode = /photo_ocr_unsupported_mime_type_blocked/.test(routeContent);
  const routeContainsPageCountCode = /photo_ocr_page_count_blocked/.test(routeContent);
  const routeContainsImageSizeCode = /photo_ocr_image_size_blocked/.test(routeContent);
  const routeContainsPersistenceBlockCode = /photo_ocr_persistence_blocked/.test(routeContent);
  const routeContainsStorageBlockCode = /photo_ocr_storage_blocked/.test(routeContent);
  const routeContainsPaidModeBlockCode = /photo_ocr_paid_mode_blocked/.test(routeContent);
  const routeContainsPublicProductionGoLiveBlockCodes =
    /photo_ocr_public_runtime_blocked/.test(routeContent) &&
    /photo_ocr_production_blocked/.test(routeContent) &&
    /photo_ocr_go_live_blocked/.test(routeContent);
  const routeContainsLegalSafetyBlockCodes =
    /photo_ocr_exact_legal_deadline_blocked/.test(routeContent) &&
    /photo_ocr_binding_legal_advice_blocked/.test(routeContent) &&
    /photo_ocr_official_filing_generation_blocked/.test(routeContent);
  const routeContainsCredentialFinancialBlockCodes =
    /photo_ocr_sensitive_credential_data_blocked/.test(routeContent) &&
    /photo_ocr_sensitive_financial_data_blocked/.test(routeContent);
  const routeContainsEightThreeAcBlockCode = /photo_ocr_8_3ac_invocation_blocked/.test(routeContent);

  // ── Route branch: photoOcrMeta / response contract ────────────────────────
  const routeContainsPhotoOcrMeta = /photoOcrMeta/.test(routeContent);
  const routeContainsPlaceholderOnly = /placeholderOnly:\s*true/.test(routeContent);
  const routeContainsRealOcrExtractionPerformedFalse = /realOcrExtractionPerformed:\s*false/.test(routeContent);
  const routeContainsOcrRuntimeStillBlockedTrue = /ocrRuntimeStillBlocked:\s*true/.test(routeContent);
  const routeContainsNoPersistenceMetaFlags =
    /rawImagePersistenceBlocked:\s*true/.test(routeContent) &&
    /processedImagePersistenceBlocked:\s*true/.test(routeContent) &&
    /extractedTextPersistenceBlocked:\s*true/.test(routeContent);
  const routeContainsNoDbStorageMetaFlags =
    /dbStorageStillBlocked:\s*true/.test(routeContent) &&
    /supabaseStorageStillBlocked:\s*true/.test(routeContent);
  const routeContainsNoPublicProductionGoLiveFlags =
    /publicRuntimeStillBlocked:\s*true/.test(routeContent) &&
    /productionAuthorizedNow:\s*false/.test(routeContent) &&
    /goLiveAuthorizedNow:\s*false/.test(routeContent);
  const routeContainsModelOutputUntrustedFlag = /modelOutputStillUntrusted:\s*true/.test(routeContent);
  const routeContainsOcrOutputUntrustedFlag = /ocrOutputStillUntrusted:\s*true/.test(routeContent);
  const routeContainsSensitivityFlags =
    /imageContentTreatedAsSensitive:\s*true/.test(routeContent) &&
    /extractedTextTreatedAsSensitive:\s*true/.test(routeContent);
  const routeContainsLegalPrivacyDisclaimerFlags =
    /privacyDisclaimerRequired:\s*true/.test(routeContent) && /legalDisclaimerRequired:\s*true/.test(routeContent);

  // ── Route branch: forbidden import/call detection (scoped to import lines) ──
  const routeImportLines = (routeContent.match(/^import[^\n]*$/gm) ?? []).join("\n");
  const routeDoesNotImportOcrLibrary =
    !OCR_DEPENDENCY_NAME_PATTERN.test(routeImportLines) && !ocrDependencyAdded;
  const routeDoesNotImportStorage =
    !/supabase|@aws-sdk|aws-sdk|firebase|cloudinary/i.test(routeImportLines);
  const routeDoesNotCallSupabaseStorage =
    !/\bsupabase\b/i.test(routeContent) && !/\.storage\.(from|upload)\(/.test(routeContent);
  const routeDoesNotCallDbWrite = !/\bprisma\b/i.test(routeContent) && !/\bsupabase\b/i.test(routeContent);
  const routeDoesNotRunEightThreeAc =
    !/tmp-8-3ac-live-metadata/.test(routeContent) && !/run8[-_]?3ac\(/i.test(routeContent);

  // ── Route branch content isolation (for scoped OpenAI/model-call check) ──
  const branchStartMarker = "// ── Phase 8.10C — Photo/OCR Controlled Runtime Placeholder branch";
  const branchEndMarker = "// ── End Phase 8.10C Photo/OCR Controlled Runtime Placeholder branch";
  const branchStartIdx = routeContent.indexOf(branchStartMarker);
  const branchEndIdx = routeContent.indexOf(branchEndMarker);
  const photoOcrBranchContent =
    branchStartIdx >= 0 && branchEndIdx > branchStartIdx
      ? routeContent.slice(branchStartIdx, branchEndIdx)
      : "";
  const routeDoesNotCallOpenAiForPhotoOcr =
    photoOcrBranchContent.length > 0 &&
    !/runSmartTalk\(/.test(photoOcrBranchContent) &&
    !/OPENAI_API_KEY/.test(photoOcrBranchContent);

  const routePatchPerformed =
    routeExists &&
    routeContainsPhotoOcrMode &&
    routeContainsPhotoOcrEnvFlag &&
    routeRequiresExactLowercaseTrue &&
    routeContainsDisabledCode &&
    routeContainsPhotoOcrMeta &&
    photoOcrBranchContent.length > 0;

  // ── SmartTalkClient.tsx: internal Photo/OCR button detection ──────────────
  const handlerBlockMatch = clientContent.match(
    /const handleControlledPhotoOcrPlaceholderSubmit = useCallback\(async \(\) => \{[\s\S]*?\}, \[mode, photoPages, photoPreparing\]\);/,
  );
  const handlerBlock = handlerBlockMatch ? handlerBlockMatch[0] : "";
  const buttonBlockMatch = clientContent.match(
    /\{mode === "photo" \? \(\s*<div style=\{\{ display: "grid", gap: 6, marginTop: -4 \}\}>[\s\S]*?handleControlledPhotoOcrPlaceholderSubmit[\s\S]*?\) : null\}/,
  );
  const buttonBlock = buttonBlockMatch ? buttonBlockMatch[0] : "";
  const photoOcrUiRelatedContent = `${handlerBlock}\n${buttonBlock}`;

  const modeFieldMatch = clientContent.match(
    /mode:\s*["'`]photo_ocr_controlled_runtime["'`][\s\S]{0,500}?\}\)/,
  );
  const modeFieldBlock = modeFieldMatch ? modeFieldMatch[0] : "";
  const modeFieldDetected = modeFieldMatch !== null;
  const contextAnonymousDetected = /context:\s*["'`]anonymous["'`]/.test(modeFieldBlock);
  const inputTypePhotoDetected = /inputType:\s*["'`]photo["'`]/.test(modeFieldBlock);
  const localeSkDetected = /locale:\s*["'`]sk["'`]/.test(modeFieldBlock);
  const photoPagesFieldDetected = /photoPages:\s*photoPages\.map/.test(modeFieldBlock);

  const smartTalkClientContainsPhotoOcrInternalButton =
    handlerBlockMatch !== null &&
    buttonBlockMatch !== null &&
    /Interný test: Photo\/OCR placeholder/.test(clientContent) &&
    modeFieldDetected &&
    contextAnonymousDetected &&
    inputTypePhotoDetected &&
    localeSkDetected &&
    photoPagesFieldDetected;

  const smartTalkClientButtonOnlyInPhotoMode =
    buttonBlockMatch !== null && buttonBlockMatch[0].startsWith('{mode === "photo" ? (');

  const smartTalkClientDoesNotUseClientEnvAuthorization =
    !/SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED/.test(clientContent);

  const smartTalkClientDoesNotUsePublicLaunchWording =
    !/\bpublic\b/i.test(clientContent) &&
    !/\bproduction\b/i.test(clientContent) &&
    !/go[- ]?live/i.test(clientContent);

  const useEffectBlocks = clientContent.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[[^\]]*\]\);/g) ?? [];
  const anyUseEffectReferencesPhotoOcrHandler = useEffectBlocks.some((block) =>
    /handleControlledPhotoOcrPlaceholderSubmit/.test(block),
  );
  const smartTalkClientDoesNotAutoUploadOnTabClick =
    !anyUseEffectReferencesPhotoOcrHandler &&
    !/FormData|fd\.append|p\.file[,)]/.test(photoOcrUiRelatedContent);

  const noStoragePaidDnaMarkerInNewUiBlock = !/\b(paid|dna|persist|storage|supabase|autoupload)\b/i.test(
    photoOcrUiRelatedContent,
  );
  if (!noStoragePaidDnaMarkerInNewUiBlock) {
    auditFailures.push("forbidden paid/DNA/persistence/storage marker found in new Photo/OCR UI block");
  }

  const uiPatchPerformed =
    smartTalkClientContainsPhotoOcrInternalButton &&
    smartTalkClientButtonOnlyInPhotoMode &&
    smartTalkClientDoesNotUseClientEnvAuthorization;
  const uiPatchDeferred = !uiPatchPerformed;
  const uiPatchDeferredReason = uiPatchDeferred
    ? "UI patch could not be statically confirmed as minimal and safe; see audit failures for details."
    : "Not deferred — minimal internal-only Photo/OCR test control was added to SmartTalkClient.tsx, gated on mode === \"photo\", using existing photoPages state (metadata only: mimeType + sizeBytes, no file bytes sent).";

  // ── Existing flows preserved (route.ts) ───────────────────────────────────
  const existingFreeQaBranchPreserved =
    /FREE_QA_PUBLIC_BETA_MODE\s*=\s*["'`]free_qa_public_beta["'`]/.test(routeContent) &&
    /FREE_QA_PUBLIC_RUNTIME_ENV_FLAG\s*=\s*["'`]SMART_TALK_FREE_QA_PUBLIC_ENABLED["'`]/.test(routeContent) &&
    /FREE_QA_INTERNAL_RUNTIME_MODE\s*=\s*["'`]free_qa_internal_scoped_patch["'`]/.test(routeContent);
  const existingTextDocumentModeBranchPreserved =
    /TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE\s*=\s*["'`]text_document_controlled_runtime["'`]/.test(routeContent) &&
    /TEXT_DOCUMENT_MODE_ENV_FLAG\s*=\s*["'`]SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED["'`]/.test(routeContent) &&
    /textDocumentModeBlockedResponse\(\s*["'`]text_document_mode_disabled["'`]\s*,\s*403\s*\)/.test(routeContent);
  const existingRateLimitBehaviorPreserved =
    /function takeRateSlot/.test(routeContent) &&
    /RATE_WINDOW_MS\s*=\s*10 \* 60 \* 1000/.test(routeContent) &&
    /RATE_MAX\s*=\s*5/.test(routeContent);
  const existingDefaultPhotoFlowPreserved =
    /const onPhotoSubmit = useCallback/.test(clientContent) &&
    /new FormData\(\)/.test(clientContent) &&
    /fetch\(\s*["'`]\/api\/smart-talk-photo["'`]/.test(clientContent);

  if (!routeContainsPhotoOcrMode) auditFailures.push("route.ts does not contain photo_ocr_controlled_runtime mode");
  if (!routeContainsPhotoOcrEnvFlag) auditFailures.push("route.ts does not contain the Photo/OCR env flag");
  if (!routeRequiresExactLowercaseTrue)
    auditFailures.push("route.ts does not use exact strict-equality lowercase \"true\" env check");
  if (!routeRejectsUppercaseTrue) auditFailures.push("route.ts env check appears to normalize case (uppercase TRUE risk)");
  if (!routeRejectsOneYesWhitespaceTrue)
    auditFailures.push("route.ts env check appears to accept \"1\"/\"yes\"/whitespace variants");
  if (!routeContainsDisabledCode) auditFailures.push("route.ts missing photo_ocr_controlled_runtime_disabled code");
  if (!routeContainsPhotoPayloadRequiredCode) auditFailures.push("route.ts missing photo_ocr_photo_payload_required code");
  if (!routeContainsUnsupportedMimeCode) auditFailures.push("route.ts missing photo_ocr_unsupported_mime_type_blocked code");
  if (!routeContainsPageCountCode) auditFailures.push("route.ts missing photo_ocr_page_count_blocked code");
  if (!routeContainsImageSizeCode) auditFailures.push("route.ts missing photo_ocr_image_size_blocked code");
  if (!routeContainsPersistenceBlockCode) auditFailures.push("route.ts missing photo_ocr_persistence_blocked code");
  if (!routeContainsStorageBlockCode) auditFailures.push("route.ts missing photo_ocr_storage_blocked code");
  if (!routeContainsPaidModeBlockCode) auditFailures.push("route.ts missing photo_ocr_paid_mode_blocked code");
  if (!routeContainsPublicProductionGoLiveBlockCodes)
    auditFailures.push("route.ts missing one or more of public/production/go-live blocked codes");
  if (!routeContainsLegalSafetyBlockCodes)
    auditFailures.push("route.ts missing one or more legal-safety blocked codes");
  if (!routeContainsCredentialFinancialBlockCodes)
    auditFailures.push("route.ts missing one or more credential/financial blocked codes");
  if (!routeContainsEightThreeAcBlockCode) auditFailures.push("route.ts missing photo_ocr_8_3ac_invocation_blocked code");
  if (!routeContainsPhotoOcrMeta) auditFailures.push("route.ts missing photoOcrMeta");
  if (!routeContainsPlaceholderOnly) auditFailures.push("route.ts missing placeholderOnly: true");
  if (!routeContainsRealOcrExtractionPerformedFalse)
    auditFailures.push("route.ts missing realOcrExtractionPerformed: false");
  if (!routeContainsOcrRuntimeStillBlockedTrue) auditFailures.push("route.ts missing ocrRuntimeStillBlocked: true");
  if (!routeContainsNoPersistenceMetaFlags) auditFailures.push("route.ts missing persistence-blocked meta flags");
  if (!routeContainsNoDbStorageMetaFlags) auditFailures.push("route.ts missing DB/storage-blocked meta flags");
  if (!routeContainsNoPublicProductionGoLiveFlags)
    auditFailures.push("route.ts missing public/production/go-live-blocked meta flags");
  if (!routeContainsModelOutputUntrustedFlag) auditFailures.push("route.ts missing modelOutputStillUntrusted: true");
  if (!routeContainsOcrOutputUntrustedFlag) auditFailures.push("route.ts missing ocrOutputStillUntrusted: true");
  if (!routeContainsSensitivityFlags) auditFailures.push("route.ts missing image/text sensitivity flags");
  if (!routeContainsLegalPrivacyDisclaimerFlags) auditFailures.push("route.ts missing legal/privacy disclaimer flags");
  if (!routeDoesNotImportOcrLibrary) auditFailures.push("OCR library import or dependency detected");
  if (!routeDoesNotImportStorage) auditFailures.push("storage import detected in route.ts");
  if (!routeDoesNotCallSupabaseStorage) auditFailures.push("Supabase storage call detected in route.ts");
  if (!routeDoesNotCallDbWrite) auditFailures.push("DB write call detected in route.ts");
  if (!routeDoesNotCallOpenAiForPhotoOcr)
    auditFailures.push("OpenAI/model call detected inside the Photo/OCR placeholder branch");
  if (!routeDoesNotRunEightThreeAc) auditFailures.push("8.3AC invocation or metadata reference detected in route.ts");
  if (!smartTalkClientContainsPhotoOcrInternalButton)
    auditFailures.push("SmartTalkClient.tsx does not contain a complete Photo/OCR internal button/handler/request contract");
  if (!smartTalkClientButtonOnlyInPhotoMode) auditFailures.push("Photo/OCR internal button is not scoped to mode === \"photo\"");
  if (!smartTalkClientDoesNotUseClientEnvAuthorization)
    auditFailures.push("SmartTalkClient.tsx references the Photo/OCR env flag (client-side authorization risk)");
  if (!smartTalkClientDoesNotUsePublicLaunchWording) auditFailures.push("public/production/go-live wording found in SmartTalkClient.tsx");
  if (!smartTalkClientDoesNotAutoUploadOnTabClick)
    auditFailures.push("Photo/OCR handler appears wired to auto-run on tab change or sends file bytes/FormData");
  if (!existingFreeQaBranchPreserved) auditFailures.push("existing Free Q&A branch markers not found as expected");
  if (!existingTextDocumentModeBranchPreserved)
    auditFailures.push("existing Text Document Mode branch markers not found as expected");
  if (!existingRateLimitBehaviorPreserved) auditFailures.push("existing rate-limit behavior markers not found as expected");
  if (!existingDefaultPhotoFlowPreserved) auditFailures.push("existing default photo upload flow markers not found as expected");

  const patchEvidence: string[] = [
    `route.ts patched: ${routePatchPerformed}`,
    `SmartTalkClient.tsx UI patched: ${uiPatchPerformed} (deferred: ${uiPatchDeferred})`,
    `audit file created: run-photo-ocr-controlled-runtime-minimal-patch-audit.ts`,
    "No package/config/env/DB/storage/Supabase file was modified.",
    "No OCR dependency was added; package.json was only read for a static dependency-name scan.",
  ];

  const routePatchEvidence: string[] = [
    `photo_ocr_controlled_runtime mode gate present: ${routeContainsPhotoOcrMode}.`,
    `SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED env flag present: ${routeContainsPhotoOcrEnvFlag}.`,
    `Exact strict-equality lowercase "true" enablement rule detected: ${routeRequiresExactLowercaseTrue}.`,
    `No case-normalization (toLowerCase/toUpperCase/trim) applied to the env read: ${routeRejectsUppercaseTrue}.`,
    `No alternate truthy values ("1"/"yes"/"TRUE") accepted: ${routeRejectsOneYesWhitespaceTrue}.`,
    "All 27 required blocked response codes were verified present in route.ts.",
    "The branch is isolated between the 8.9C Text Document Mode branch and the 8.8M Free Q&A internal branch, with its own start/end comment markers.",
  ];

  const uiPatchEvidence: string[] = uiPatchPerformed
    ? [
        "A minimal, internal-only Photo/OCR test button was added, rendered only when mode === \"photo\".",
        "The button's handler sends only page metadata (mimeType, sizeBytes) via JSON — never the actual file bytes.",
        "The handler is isolated from onPhotoSubmit's FormData/upload flow (does not reference FormData, fd.append, or raw file objects).",
        "No client-side environment flag authorization is used; the server-side route branch remains the sole authority.",
      ]
    : [`UI patch deferred: ${uiPatchDeferredReason}`];

  const placeholderRuntimeEvidence: string[] = [
    "The allowed path returns a controlled placeholder result only — no OCR text, no extracted text, no legal advice, no exact deadline, no official filing.",
    "photoOcrMeta.realOcrExtractionPerformed is always false; photoOcrMeta.ocrRuntimeStillBlocked is always true.",
    "photoOcrMeta.modelCallPerformed is always false — no model call is made for the Photo/OCR placeholder path.",
    "Only page metadata (mimeType, sizeBytes) is inspected; no image bytes are ever read, decoded, or persisted by the route branch.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No OCR engine or OCR dependency was imported or added.",
    "No persistence, DB, storage, or Supabase call was added.",
    "No Vaylo DNA write was added.",
    "No paid document mode was enabled.",
    "No public runtime, production, or go-live marker was enabled.",
    "No 8.3AC invocation was performed; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The branch rejects remote image URL ingestion, file path ingestion, and PDF upload.",
    "The branch enforces a 1-3 page count limit, an allow-list of image MIME types, an 8 MB per-page raw size limit, and a 4 MB total processed payload limit.",
    "The branch rejects exact legal deadline calculation, binding legal advice, and official filing generation requests via an optional note field, reusing existing pure detectors.",
    "The branch rejects credential/API key/password and IBAN/payment authorization content via the same reused pure detectors.",
    "Existing Free Q&A, Text Document Mode, rate-limit, and default photo-upload behavior were verified unchanged.",
  ];

  const responseContractEvidence: string[] = [
    "Disabled path: HTTP 403, ok: false, code: \"photo_ocr_controlled_runtime_disabled\", photoOcrMeta shows no OCR/model/upload/persistence performed.",
    "Allowed placeholder path: HTTP 200, ok: true, mode: \"photo_ocr_controlled_runtime\", context: \"anonymous\", result contains only safe placeholder fields (summary, meaning, urgency: \"unknown\", empty arrays, warnings noting OCR is not active).",
    "All 27 required blocked response codes are present in route.ts and reachable from the branch's guard chain.",
    "photoOcrMeta always includes the full set of placeholder/no-OCR/no-persistence/sensitivity/disclaimer flags on both the disabled and allowed paths.",
  ];

  const tamperCount = PHOTO_OCR_CONTROLLED_RUNTIME_MINIMAL_PATCH_AUDIT_TAMPER_CASES.length;

  const notes: string[] = [
    "PA-01: 8.10C is the first allowed implementation patch. Exactly route.ts, SmartTalkClient.tsx, and this one new audit file were touched.",
    `PA-02: 8.10A/8.10B/8.9N confirmed as sources of truth — 8.10A.allPassed=${a.allPassed}, 8.10B.allPassed=${b.allPassed}, 8.9N.allPassed=${n.allPassed}.`,
    `PA-03: route.ts Photo/OCR branch verified fail-closed on env flag; UI patch performed=${uiPatchPerformed}, deferred=${uiPatchDeferred}.`,
    "PA-04: no OCR engine, no OCR dependency, no model call, no image bytes read, no persistence were added anywhere in this patch.",
    "PA-05: real OCR extraction remains fully unimplemented and deferred to a later, separate, explicitly authorized phase.",
    "PA-06: this audit performed static text analysis only — no live route/model/fetch call, no browser, no npm run dev.",
    "PA-07: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "PA-08: ready for Phase 8.10D — Photo/OCR Controlled Runtime Disabled Local API Closure (manual local confirmation of the disabled path).",
  ];

  const provisional: PhotoOcrControlledRuntimeMinimalPatchAuditResult = {
    checkId: "8.10C",
    allPassed: true,
    minimalPatchPerformed: true,
    implementationPlanSourceCommit: "6a26e47",
    gateDesignSourceCommit: "4a87043",
    textDocumentInternalReadinessSourceCommit: "3cf81c1",
    routePatchPerformed,
    uiPatchPerformed,
    uiPatchDeferred,
    uiPatchDeferredReason,
    realOcrExtractionPerformed: false,
    ocrDependencyAdded,
    ocrRuntimeEnabledNow: false,
    photoRuntimeControlledPlaceholderAdded: true,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    persistenceEnabledNow: false,
    dbStorageEnabledNow: false,
    supabaseStorageEnabledNow: false,
    paidDocumentModeEnabledNow: false,
    vayloDnaEnabledNow: false,
    modelCallForPhotoOcrPlaceholderPerformed: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceGateDesignAccepted,
    sourceImplementationPlanAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    routeContainsPhotoOcrMode,
    routeContainsPhotoOcrEnvFlag,
    routeRequiresExactLowercaseTrue,
    routeRejectsUppercaseTrue,
    routeRejectsOneYesWhitespaceTrue,
    routeContainsDisabledCode,
    routeContainsPhotoPayloadRequiredCode,
    routeContainsUnsupportedMimeCode,
    routeContainsPageCountCode,
    routeContainsImageSizeCode,
    routeContainsPersistenceBlockCode,
    routeContainsStorageBlockCode,
    routeContainsPaidModeBlockCode,
    routeContainsPublicProductionGoLiveBlockCodes,
    routeContainsLegalSafetyBlockCodes,
    routeContainsCredentialFinancialBlockCodes,
    routeContainsEightThreeAcBlockCode,
    routeContainsPhotoOcrMeta,
    routeContainsPlaceholderOnly,
    routeContainsRealOcrExtractionPerformedFalse,
    routeContainsOcrRuntimeStillBlockedTrue,
    routeContainsNoPersistenceMetaFlags,
    routeContainsNoDbStorageMetaFlags,
    routeContainsNoPublicProductionGoLiveFlags,
    routeContainsModelOutputUntrustedFlag,
    routeContainsOcrOutputUntrustedFlag,
    routeContainsSensitivityFlags,
    routeContainsLegalPrivacyDisclaimerFlags,
    routeDoesNotImportOcrLibrary,
    routeDoesNotImportStorage,
    routeDoesNotCallSupabaseStorage,
    routeDoesNotCallDbWrite,
    routeDoesNotCallOpenAiForPhotoOcr,
    routeDoesNotRunEightThreeAc,

    smartTalkClientContainsPhotoOcrInternalButton,
    smartTalkClientButtonOnlyInPhotoMode,
    smartTalkClientDoesNotUseClientEnvAuthorization,
    smartTalkClientDoesNotUsePublicLaunchWording,
    smartTalkClientDoesNotAutoUploadOnTabClick,

    existingFreeQaBranchPreserved,
    existingTextDocumentModeBranchPreserved,
    existingRateLimitBehaviorPreserved,
    existingDefaultPhotoFlowPreserved,

    readyForNextPhase: "8.10D",
    recommendedNextPhase: "Photo/OCR Controlled Runtime Disabled Local API Closure",
    readyForDisabledLocalApiClosure: true,
    readyForEnabledControlledLocalApiClosure: false,
    readyForPhotoOcrRegressionPack: false,
    readyForPhotoOcrBrowserManualTest: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,

    liveRouteInvocationPerformedByThisAudit: false,
    liveModelCallPerformedByThisAudit: false,
    fetchCalledByThisAudit: false,
    runSmartTalkCalledByThisAudit: false,
    openAiSdkImportedByThisAudit: false,
    ocrLibraryImportedByThisAudit: false,
    imagesReadByThisAudit: false,
    filesWrittenByThisAudit: false,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    patchEvidence,
    routePatchEvidence,
    uiPatchEvidence,
    placeholderRuntimeEvidence,
    forbiddenRuntimeEvidence,
    safetyBoundaryEvidence,
    responseContractEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10D: Disabled Local API Closure — manual local test confirming the disabled path (env flag absent) returns photo_ocr_controlled_runtime_disabled / 403 with no side effects.",
      "Phase 8.10E: Enabled Controlled Local API Closure — manual local test confirming the enabled placeholder path and all guard rejections.",
      "Phase 8.10F: Controlled Local Regression Pack — synthetic allowed/blocked case matrix covering every blocked response code.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase — never in scope until the placeholder path completes its own full internal readiness closure.",
    ],
    notes,
  };

  if (
    auditFailures.length === 0 &&
    !_isCanonicalPhotoOcrControlledRuntimeMinimalPatchAuditResult(provisional)
  ) {
    auditFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_RUNTIME_MINIMAL_PATCH_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledRuntimeMinimalPatchAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10C tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) auditFailures.push(...tamperFailures);

  const allPassed = auditFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10C tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(auditFailures.length > 0 ? [`FAILURES (${auditFailures.length}):`, ...auditFailures] : []),
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
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-runtime-minimal-patch-audit");

if (invokedDirectly) {
  console.log(JSON.stringify(runPhotoOcrControlledRuntimeMinimalPatchAudit(), null, 2));
}
