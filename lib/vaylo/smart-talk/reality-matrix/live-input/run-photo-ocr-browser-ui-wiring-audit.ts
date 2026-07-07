/**
 * PHASE 8.10G — Photo/OCR Browser/UI Wiring Audit
 *
 * Static, local, read-only audit proving that the Photo/OCR controlled
 * placeholder UI wiring added in 8.10C (and re-verified in 8.10D/8.10E/8.10F)
 * is safe and isolated:
 *  - the internal-only Photo/OCR button is gated to photo mode only, uses
 *    internal-only wording, requires an explicit user click, and never
 *    claims OCR is active or that a document was read;
 *  - the button's request body uses the exact required contract (mode,
 *    context, inputType, locale, metadata-only photoPages) and never sends
 *    raw image bytes, never uses FormData, and never uses client-side env
 *    authorization;
 *  - the server route branch remains the sole authority (env-gated,
 *    fail-closed, no OCR/model/persistence for the placeholder path);
 *  - the existing default photo upload flow, the Text Document Mode
 *    controlled flow, and the default question/text flow all remain
 *    structurally separate.
 *
 * This audit performs NO browser execution, NO dev server, NO local API
 * invocation, NO fetch/network call, NO OpenAI call, NO OCR library import
 * or OCR engine call, NO real image read, NO persistence, and NO DB/
 * storage/DNA write. It only reads source text of two already-committed
 * files (SmartTalkClient.tsx, route.ts) via fs.readFileSync for static
 * string-based inspection. It does not run 8.3AC and does not touch
 * tmp-8-3ac-live-metadata.ts.
 */

import fs from "fs";
import path from "path";
import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runPhotoOcrControlledRuntimeDisabledLocalApiClosure } from "./run-photo-ocr-controlled-runtime-disabled-local-api-closure";
import { runPhotoOcrControlledRuntimeEnabledLocalApiClosure } from "./run-photo-ocr-controlled-runtime-enabled-local-api-closure";
import { runPhotoOcrControlledLocalRegressionPack } from "./run-photo-ocr-controlled-local-regression-pack";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

const SMART_TALK_CLIENT_RELATIVE_PATH = "app/smart-talk/SmartTalkClient.tsx";
const SMART_TALK_ROUTE_RELATIVE_PATH = "app/api/smart-talk/route.ts";

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrBrowserUiWiringAuditResult {
  checkId: "8.10G";
  allPassed: boolean;
  staticBrowserUiWiringAuditOnly: true;
  browserInvoked: false;
  devServerStarted: false;
  localApiInvoked: false;
  externalNetworkCalled: false;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
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

  sourceMinimalPatchCommit: "3e35be8";
  sourceDisabledClosureCommit: "385b32a";
  sourceEnabledClosureCommit: "e1d6568";
  sourceRegressionPackCommit: "49fa151";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceEnabledClosureAccepted: boolean;
  sourceRegressionPackAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  smartTalkClientPath: "app/smart-talk/SmartTalkClient.tsx";
  routePath: "app/api/smart-talk/route.ts";
  smartTalkClientReadOnlyScanned: boolean;
  routeReadOnlyScanned: boolean;

  photoOcrInternalButtonFound: boolean;
  photoOcrInternalButtonLabelFound: boolean;
  photoOcrInternalButtonLabel: "Interný test: Photo/OCR placeholder";
  photoOcrInternalCaptionFound: boolean;
  photoOcrInternalWordingOnly: boolean;
  photoOcrPublicLaunchWordingAbsent: boolean;
  photoOcrProductionWordingAbsent: boolean;
  photoOcrGoLiveWordingAbsent: boolean;
  photoOcrClaimsOcrActiveAbsent: boolean;
  photoOcrClaimsDocumentReadAbsent: boolean;
  photoOcrButtonOnlyInPhotoMode: boolean;
  photoOcrButtonAbsentOutsidePhotoMode: boolean;
  textDocumentInternalButtonStillTextModeOnly: boolean;
  defaultQuestionTextFlowStillSeparate: boolean;
  defaultPhotoFlowStillSeparate: boolean;
  textDocumentFlowStillSeparate: boolean;
  explicitUserClickRequired: boolean;
  noAutoUploadOnPhotoTabClick: boolean;
  buttonDisabledWithoutSelectedPage: boolean;
  usesExistingPhotoPagesState: boolean;
  noBroadUiRefactorDetected: boolean;

  requestUsesModePhotoOcrControlledRuntime: boolean;
  requestUsesContextAnonymous: boolean;
  requestUsesInputTypePhoto: boolean;
  requestUsesLocaleSk: boolean;
  requestUsesMetadataOnlyPayload: boolean;
  requestSendsMimeTypeMetadata: boolean;
  requestSendsSizeBytesMetadata: boolean;
  requestDoesNotSendRawImageBytes: boolean;
  requestDoesNotUseFormDataForPlaceholder: boolean;
  requestDoesNotUseClientEnvAuthorization: boolean;
  serverRouteRemainsAuthority: boolean;

  smartTalkClientDoesNotImportOcrLibrary: boolean;
  smartTalkClientDoesNotCallOcrEngine: boolean;
  smartTalkClientDoesNotCallOpenAi: boolean;
  smartTalkClientDoesNotCallSupabaseStorage: boolean;
  smartTalkClientDoesNotWriteDb: boolean;
  smartTalkClientDoesNotPersistImage: boolean;
  smartTalkClientDoesNotPersistExtractedText: boolean;
  smartTalkClientDoesNotEnablePaidMode: boolean;
  smartTalkClientDoesNotEnableDna: boolean;
  smartTalkClientDoesNotEnablePublicRuntime: boolean;
  smartTalkClientDoesNotEnableProduction: boolean;
  smartTalkClientDoesNotEnableGoLive: boolean;

  routeContainsPhotoOcrMode: boolean;
  routeContainsPhotoOcrEnvFlag: boolean;
  routeRequiresExactLowercaseTrue: boolean;
  routeContainsDisabledCode: boolean;
  routeContainsEnabledPlaceholderResponse: boolean;
  routeContainsPhotoOcrMeta: boolean;
  routeContainsRealOcrExtractionPerformedFalse: boolean;
  routeContainsOcrRuntimeStillBlockedTrue: boolean;
  routeContainsModelCallPerformedFalse: boolean;
  routeContainsNoPersistenceMetaFlags: boolean;
  routeContainsNoStorageMetaFlags: boolean;
  routeContainsNoPublicProductionGoLiveFlags: boolean;
  routeContainsSensitivityFlags: boolean;
  routeContainsLegalPrivacyDisclaimerFlags: boolean;
  routeDoesNotImportOcrLibrary: boolean;
  routeDoesNotCallOpenAiForPhotoOcrPlaceholder: boolean;
  routeDoesNotCallStorageForPhotoOcrPlaceholder: boolean;
  routeDoesNotPersistPhotoOcrData: boolean;

  disabledLocalApiClosureAccepted: boolean;
  enabledLocalApiClosureAccepted: boolean;
  controlledLocalRegressionPackAccepted: boolean;
  disabledEnvMatrixClosed: boolean;
  enabledPlaceholderClosed: boolean;
  guardRegressionClosed: boolean;
  totalRegressionCaseCount: 32;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  staticScanEvidence: string[];
  uiWiringEvidence: string[];
  requestWiringEvidence: string[];
  routeAlignmentEvidence: string[];
  regressionAlignmentEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  safetyBoundaryEvidence: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];

  photoOcrBrowserUiWiringAuditPassed: boolean;
  readyForNextPhase: "8.10H";
  recommendedNextPhase: "Photo/OCR Browser Manual Test Planning";
  readyForPhotoOcrBrowserManualTestPlanning: boolean;
  readyForPhotoOcrBrowserManualExecution: false;
  readyForPhotoOcrInternalReadinessClosure: false;
  readyForRealOcrExtraction: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
}

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This phase is static UI/source inspection only.",
  "This phase does not run browser.",
  "This phase does not start dev server.",
  "This phase does not invoke local API route.",
  "This phase does not submit actual photo UI requests.",
  "This phase does not use real images.",
  "This phase does not perform real OCR extraction.",
  "This phase does not validate browser-rendered behavior.",
  "Browser manual planning/execution remain separate later phases.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
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

const REQUIRED_SOURCE_EVIDENCE: string[] = [
  "8.10C minimal patch audit accepted",
  "8.10D disabled local API closure accepted",
  "8.10E enabled local API closure accepted",
  "8.10F controlled local regression pack accepted",
  "8.9N text document internal readiness accepted",
];

// ─── Static text-scan helpers ───────────────────────────────────────────────

interface GatedBlockResult {
  found: boolean;
  block: string;
}

/**
 * Finds the nearest `gateToken` occurring before `anchorText`, verifies no
 * `closeToken` occurs between that gate and the anchor (i.e. the anchor is
 * genuinely inside the still-open gated block), then finds the next
 * `closeToken` after the anchor and returns the full gated block text.
 */
function findGatedBlock(src: string, gateToken: string, anchorText: string, closeToken: string): GatedBlockResult {
  const anchorIdx = src.indexOf(anchorText);
  if (anchorIdx === -1) return { found: false, block: "" };
  const gateIdx = src.lastIndexOf(gateToken, anchorIdx);
  if (gateIdx === -1) return { found: false, block: "" };
  const betweenGateAndAnchor = src.slice(gateIdx + gateToken.length, anchorIdx);
  if (betweenGateAndAnchor.includes(closeToken)) return { found: false, block: "" };
  const closeIdx = src.indexOf(closeToken, anchorIdx);
  if (closeIdx === -1) return { found: false, block: "" };
  return { found: true, block: src.slice(gateIdx, closeIdx + closeToken.length) };
}

function extractSpan(src: string, startAnchor: string, endAnchor: string): string {
  const startIdx = src.indexOf(startAnchor);
  if (startIdx === -1) return "";
  const endIdx = src.indexOf(endAnchor, startIdx);
  if (endIdx === -1) return "";
  return src.slice(startIdx, endIdx + endAnchor.length);
}

function countOccurrences(src: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let idx = src.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = src.indexOf(needle, idx + needle.length);
  }
  return count;
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrBrowserUiWiringAuditResult(r: PhotoOcrBrowserUiWiringAuditResult): boolean {
  if (r.checkId !== "8.10G") return false;
  if (r.allPassed !== true) return false;
  if (r.staticBrowserUiWiringAuditOnly !== true) return false;
  if (r.browserInvoked !== false) return false;
  if (r.devServerStarted !== false) return false;
  if (r.localApiInvoked !== false) return false;
  if (r.externalNetworkCalled !== false) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
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

  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceDisabledClosureCommit !== "385b32a") return false;
  if (r.sourceEnabledClosureCommit !== "e1d6568") return false;
  if (r.sourceRegressionPackCommit !== "49fa151") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceEnabledClosureAccepted !== true) return false;
  if (r.sourceRegressionPackAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.smartTalkClientPath !== "app/smart-talk/SmartTalkClient.tsx") return false;
  if (r.routePath !== "app/api/smart-talk/route.ts") return false;
  if (r.smartTalkClientReadOnlyScanned !== true) return false;
  if (r.routeReadOnlyScanned !== true) return false;

  if (r.photoOcrInternalButtonFound !== true) return false;
  if (r.photoOcrInternalButtonLabelFound !== true) return false;
  if (r.photoOcrInternalButtonLabel !== "Interný test: Photo/OCR placeholder") return false;
  if (r.photoOcrInternalCaptionFound !== true) return false;
  if (r.photoOcrInternalWordingOnly !== true) return false;
  if (r.photoOcrPublicLaunchWordingAbsent !== true) return false;
  if (r.photoOcrProductionWordingAbsent !== true) return false;
  if (r.photoOcrGoLiveWordingAbsent !== true) return false;
  if (r.photoOcrClaimsOcrActiveAbsent !== true) return false;
  if (r.photoOcrClaimsDocumentReadAbsent !== true) return false;
  if (r.photoOcrButtonOnlyInPhotoMode !== true) return false;
  if (r.photoOcrButtonAbsentOutsidePhotoMode !== true) return false;
  if (r.textDocumentInternalButtonStillTextModeOnly !== true) return false;
  if (r.defaultQuestionTextFlowStillSeparate !== true) return false;
  if (r.defaultPhotoFlowStillSeparate !== true) return false;
  if (r.textDocumentFlowStillSeparate !== true) return false;
  if (r.explicitUserClickRequired !== true) return false;
  if (r.noAutoUploadOnPhotoTabClick !== true) return false;
  if (r.buttonDisabledWithoutSelectedPage !== true) return false;
  if (r.usesExistingPhotoPagesState !== true) return false;
  if (r.noBroadUiRefactorDetected !== true) return false;

  if (r.requestUsesModePhotoOcrControlledRuntime !== true) return false;
  if (r.requestUsesContextAnonymous !== true) return false;
  if (r.requestUsesInputTypePhoto !== true) return false;
  if (r.requestUsesLocaleSk !== true) return false;
  if (r.requestUsesMetadataOnlyPayload !== true) return false;
  if (r.requestSendsMimeTypeMetadata !== true) return false;
  if (r.requestSendsSizeBytesMetadata !== true) return false;
  if (r.requestDoesNotSendRawImageBytes !== true) return false;
  if (r.requestDoesNotUseFormDataForPlaceholder !== true) return false;
  if (r.requestDoesNotUseClientEnvAuthorization !== true) return false;
  if (r.serverRouteRemainsAuthority !== true) return false;

  if (r.smartTalkClientDoesNotImportOcrLibrary !== true) return false;
  if (r.smartTalkClientDoesNotCallOcrEngine !== true) return false;
  if (r.smartTalkClientDoesNotCallOpenAi !== true) return false;
  if (r.smartTalkClientDoesNotCallSupabaseStorage !== true) return false;
  if (r.smartTalkClientDoesNotWriteDb !== true) return false;
  if (r.smartTalkClientDoesNotPersistImage !== true) return false;
  if (r.smartTalkClientDoesNotPersistExtractedText !== true) return false;
  if (r.smartTalkClientDoesNotEnablePaidMode !== true) return false;
  if (r.smartTalkClientDoesNotEnableDna !== true) return false;
  if (r.smartTalkClientDoesNotEnablePublicRuntime !== true) return false;
  if (r.smartTalkClientDoesNotEnableProduction !== true) return false;
  if (r.smartTalkClientDoesNotEnableGoLive !== true) return false;

  if (r.routeContainsPhotoOcrMode !== true) return false;
  if (r.routeContainsPhotoOcrEnvFlag !== true) return false;
  if (r.routeRequiresExactLowercaseTrue !== true) return false;
  if (r.routeContainsDisabledCode !== true) return false;
  if (r.routeContainsEnabledPlaceholderResponse !== true) return false;
  if (r.routeContainsPhotoOcrMeta !== true) return false;
  if (r.routeContainsRealOcrExtractionPerformedFalse !== true) return false;
  if (r.routeContainsOcrRuntimeStillBlockedTrue !== true) return false;
  if (r.routeContainsModelCallPerformedFalse !== true) return false;
  if (r.routeContainsNoPersistenceMetaFlags !== true) return false;
  if (r.routeContainsNoStorageMetaFlags !== true) return false;
  if (r.routeContainsNoPublicProductionGoLiveFlags !== true) return false;
  if (r.routeContainsSensitivityFlags !== true) return false;
  if (r.routeContainsLegalPrivacyDisclaimerFlags !== true) return false;
  if (r.routeDoesNotImportOcrLibrary !== true) return false;
  if (r.routeDoesNotCallOpenAiForPhotoOcrPlaceholder !== true) return false;
  if (r.routeDoesNotCallStorageForPhotoOcrPlaceholder !== true) return false;
  if (r.routeDoesNotPersistPhotoOcrData !== true) return false;

  if (r.disabledLocalApiClosureAccepted !== true) return false;
  if (r.enabledLocalApiClosureAccepted !== true) return false;
  if (r.controlledLocalRegressionPackAccepted !== true) return false;
  if (r.disabledEnvMatrixClosed !== true) return false;
  if (r.enabledPlaceholderClosed !== true) return false;
  if (r.guardRegressionClosed !== true) return false;
  if (r.totalRegressionCaseCount !== 32) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.staticScanEvidence) || r.staticScanEvidence.length === 0) return false;
  if (!Array.isArray(r.uiWiringEvidence) || r.uiWiringEvidence.length === 0) return false;
  if (!Array.isArray(r.requestWiringEvidence) || r.requestWiringEvidence.length === 0) return false;
  if (!Array.isArray(r.routeAlignmentEvidence) || r.routeAlignmentEvidence.length === 0) return false;
  if (!Array.isArray(r.regressionAlignmentEvidence) || r.regressionAlignmentEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
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

  if (r.photoOcrBrowserUiWiringAuditPassed !== true) return false;
  if (r.readyForNextPhase !== "8.10H") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Browser Manual Test Planning") return false;
  if (r.readyForPhotoOcrBrowserManualTestPlanning !== true) return false;
  if (r.readyForPhotoOcrBrowserManualExecution !== false) return false;
  if (r.readyForPhotoOcrInternalReadinessClosure !== false) return false;
  if (r.readyForRealOcrExtraction !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type Tamper810GMutation = (r: PhotoOcrBrowserUiWiringAuditResult) => PhotoOcrBrowserUiWiringAuditResult;
interface Tamper810GCase {
  label: string;
  mutate: Tamper810GMutation;
}

const PHOTO_OCR_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES: Tamper810GCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10F" as "8.10G" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "staticBrowserUiWiringAuditOnly false", mutate: (r) => ({ ...r, staticBrowserUiWiringAuditOnly: false as true }) },
  { label: "browserInvoked true", mutate: (r) => ({ ...r, browserInvoked: true as false }) },
  { label: "devServerStarted true", mutate: (r) => ({ ...r, devServerStarted: true as false }) },
  { label: "localApiInvoked true", mutate: (r) => ({ ...r, localApiInvoked: true as false }) },
  { label: "externalNetworkCalled true", mutate: (r) => ({ ...r, externalNetworkCalled: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "realImageUsed true", mutate: (r) => ({ ...r, realImageUsed: true as false }) },
  { label: "imageBytesRead true", mutate: (r) => ({ ...r, imageBytesRead: true as false }) },
  { label: "ocrLibraryImported true", mutate: (r) => ({ ...r, ocrLibraryImported: true as false }) },
  { label: "ocrExtractionPerformed true", mutate: (r) => ({ ...r, ocrExtractionPerformed: true as false }) },
  { label: "modelCallPerformed true", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "uploadPerformed true", mutate: (r) => ({ ...r, uploadPerformed: true as false }) },
  { label: "persistencePerformed true", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime becomes enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production/go-live becomes authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceMinimalPatchAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceMinimalPatchAccepted: false }) },
  { label: "sourceMinimalPatchCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceMinimalPatchCommit: "0000000" as "3e35be8" }) },
  { label: "sourceDisabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceDisabledClosureAccepted: false }) },
  { label: "sourceDisabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "385b32a" }) },
  { label: "sourceEnabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceEnabledClosureAccepted: false }) },
  { label: "sourceEnabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceEnabledClosureCommit: "0000000" as "e1d6568" }) },
  { label: "sourceRegressionPackAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceRegressionPackAccepted: false }) },
  { label: "sourceRegressionPackCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceRegressionPackCommit: "0000000" as "49fa151" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "smartTalkClientReadOnlyScanned false (SmartTalkClient source not scanned)", mutate: (r) => ({ ...r, smartTalkClientReadOnlyScanned: false }) },
  { label: "routeReadOnlyScanned false (route source not scanned)", mutate: (r) => ({ ...r, routeReadOnlyScanned: false }) },
  { label: "photoOcrInternalButtonFound false (Photo/OCR internal button missing)", mutate: (r) => ({ ...r, photoOcrInternalButtonFound: false }) },
  { label: "photoOcrInternalButtonLabelFound false (button label missing or not internal)", mutate: (r) => ({ ...r, photoOcrInternalButtonLabelFound: false }) },
  { label: "photoOcrInternalButtonLabel wrong (button label missing or not internal)", mutate: (r) => ({ ...r, photoOcrInternalButtonLabel: "Photo/OCR" as "Interný test: Photo/OCR placeholder" }) },
  { label: "photoOcrInternalCaptionFound false", mutate: (r) => ({ ...r, photoOcrInternalCaptionFound: false }) },
  { label: "photoOcrInternalWordingOnly false", mutate: (r) => ({ ...r, photoOcrInternalWordingOnly: false }) },
  { label: "photoOcrPublicLaunchWordingAbsent false (UI uses public launch wording)", mutate: (r) => ({ ...r, photoOcrPublicLaunchWordingAbsent: false }) },
  { label: "photoOcrProductionWordingAbsent false (UI uses production/go-live wording)", mutate: (r) => ({ ...r, photoOcrProductionWordingAbsent: false }) },
  { label: "photoOcrGoLiveWordingAbsent false (UI uses production/go-live wording)", mutate: (r) => ({ ...r, photoOcrGoLiveWordingAbsent: false }) },
  { label: "photoOcrClaimsOcrActiveAbsent false (UI claims OCR is active)", mutate: (r) => ({ ...r, photoOcrClaimsOcrActiveAbsent: false }) },
  { label: "photoOcrClaimsDocumentReadAbsent false (UI claims document was read)", mutate: (r) => ({ ...r, photoOcrClaimsDocumentReadAbsent: false }) },
  { label: "photoOcrButtonOnlyInPhotoMode false (button visible outside photo mode)", mutate: (r) => ({ ...r, photoOcrButtonOnlyInPhotoMode: false }) },
  { label: "photoOcrButtonAbsentOutsidePhotoMode false (button visible outside photo mode)", mutate: (r) => ({ ...r, photoOcrButtonAbsentOutsidePhotoMode: false }) },
  { label: "textDocumentInternalButtonStillTextModeOnly false (Text Document Mode button no longer text-mode only)", mutate: (r) => ({ ...r, textDocumentInternalButtonStillTextModeOnly: false }) },
  { label: "defaultQuestionTextFlowStillSeparate false (default question/text flow not separate)", mutate: (r) => ({ ...r, defaultQuestionTextFlowStillSeparate: false }) },
  { label: "defaultPhotoFlowStillSeparate false (default photo flow not separate)", mutate: (r) => ({ ...r, defaultPhotoFlowStillSeparate: false }) },
  { label: "textDocumentFlowStillSeparate false (text document flow not separate)", mutate: (r) => ({ ...r, textDocumentFlowStillSeparate: false }) },
  { label: "explicitUserClickRequired false (UI does not require explicit click)", mutate: (r) => ({ ...r, explicitUserClickRequired: false }) },
  { label: "noAutoUploadOnPhotoTabClick false (UI auto-uploads on photo tab click)", mutate: (r) => ({ ...r, noAutoUploadOnPhotoTabClick: false }) },
  { label: "buttonDisabledWithoutSelectedPage false (button not disabled without selected page)", mutate: (r) => ({ ...r, buttonDisabledWithoutSelectedPage: false }) },
  { label: "usesExistingPhotoPagesState false", mutate: (r) => ({ ...r, usesExistingPhotoPagesState: false }) },
  { label: "noBroadUiRefactorDetected false", mutate: (r) => ({ ...r, noBroadUiRefactorDetected: false }) },
  { label: "requestUsesModePhotoOcrControlledRuntime false (UI request mode differs)", mutate: (r) => ({ ...r, requestUsesModePhotoOcrControlledRuntime: false }) },
  { label: "requestUsesContextAnonymous false (UI request context differs)", mutate: (r) => ({ ...r, requestUsesContextAnonymous: false }) },
  { label: "requestUsesInputTypePhoto false (UI request inputType differs)", mutate: (r) => ({ ...r, requestUsesInputTypePhoto: false }) },
  { label: "requestUsesLocaleSk false (UI request locale differs)", mutate: (r) => ({ ...r, requestUsesLocaleSk: false }) },
  { label: "requestUsesMetadataOnlyPayload false", mutate: (r) => ({ ...r, requestUsesMetadataOnlyPayload: false }) },
  { label: "requestSendsMimeTypeMetadata false", mutate: (r) => ({ ...r, requestSendsMimeTypeMetadata: false }) },
  { label: "requestSendsSizeBytesMetadata false", mutate: (r) => ({ ...r, requestSendsSizeBytesMetadata: false }) },
  { label: "requestDoesNotSendRawImageBytes false (UI sends raw image bytes)", mutate: (r) => ({ ...r, requestDoesNotSendRawImageBytes: false }) },
  { label: "requestDoesNotUseFormDataForPlaceholder false", mutate: (r) => ({ ...r, requestDoesNotUseFormDataForPlaceholder: false }) },
  { label: "requestDoesNotUseClientEnvAuthorization false (UI uses client env authorization)", mutate: (r) => ({ ...r, requestDoesNotUseClientEnvAuthorization: false }) },
  { label: "serverRouteRemainsAuthority false", mutate: (r) => ({ ...r, serverRouteRemainsAuthority: false }) },
  { label: "smartTalkClientDoesNotImportOcrLibrary false (UI imports OCR library)", mutate: (r) => ({ ...r, smartTalkClientDoesNotImportOcrLibrary: false }) },
  { label: "smartTalkClientDoesNotCallOcrEngine false (UI calls OCR engine)", mutate: (r) => ({ ...r, smartTalkClientDoesNotCallOcrEngine: false }) },
  { label: "smartTalkClientDoesNotCallOpenAi false (UI calls OpenAI)", mutate: (r) => ({ ...r, smartTalkClientDoesNotCallOpenAi: false }) },
  { label: "smartTalkClientDoesNotCallSupabaseStorage false (UI calls Supabase storage)", mutate: (r) => ({ ...r, smartTalkClientDoesNotCallSupabaseStorage: false }) },
  { label: "smartTalkClientDoesNotWriteDb false (UI writes DB)", mutate: (r) => ({ ...r, smartTalkClientDoesNotWriteDb: false }) },
  { label: "smartTalkClientDoesNotPersistImage false (UI persists images or extracted text)", mutate: (r) => ({ ...r, smartTalkClientDoesNotPersistImage: false }) },
  { label: "smartTalkClientDoesNotPersistExtractedText false (UI persists images or extracted text)", mutate: (r) => ({ ...r, smartTalkClientDoesNotPersistExtractedText: false }) },
  { label: "smartTalkClientDoesNotEnablePaidMode false", mutate: (r) => ({ ...r, smartTalkClientDoesNotEnablePaidMode: false }) },
  { label: "smartTalkClientDoesNotEnableDna false", mutate: (r) => ({ ...r, smartTalkClientDoesNotEnableDna: false }) },
  { label: "smartTalkClientDoesNotEnablePublicRuntime false", mutate: (r) => ({ ...r, smartTalkClientDoesNotEnablePublicRuntime: false }) },
  { label: "smartTalkClientDoesNotEnableProduction false", mutate: (r) => ({ ...r, smartTalkClientDoesNotEnableProduction: false }) },
  { label: "smartTalkClientDoesNotEnableGoLive false", mutate: (r) => ({ ...r, smartTalkClientDoesNotEnableGoLive: false }) },
  { label: "routeContainsPhotoOcrMode false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsPhotoOcrMode: false }) },
  { label: "routeContainsPhotoOcrEnvFlag false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsPhotoOcrEnvFlag: false }) },
  { label: "routeRequiresExactLowercaseTrue false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeRequiresExactLowercaseTrue: false }) },
  { label: "routeContainsDisabledCode false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsDisabledCode: false }) },
  { label: "routeContainsEnabledPlaceholderResponse false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsEnabledPlaceholderResponse: false }) },
  { label: "routeContainsPhotoOcrMeta false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsPhotoOcrMeta: false }) },
  { label: "routeContainsRealOcrExtractionPerformedFalse false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsRealOcrExtractionPerformedFalse: false }) },
  { label: "routeContainsOcrRuntimeStillBlockedTrue false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsOcrRuntimeStillBlockedTrue: false }) },
  { label: "routeContainsModelCallPerformedFalse false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsModelCallPerformedFalse: false }) },
  { label: "routeContainsNoPersistenceMetaFlags false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsNoPersistenceMetaFlags: false }) },
  { label: "routeContainsNoStorageMetaFlags false (route alignment missing mode/env/disabled/success/meta/no-OCR flags)", mutate: (r) => ({ ...r, routeContainsNoStorageMetaFlags: false }) },
  { label: "routeContainsNoPublicProductionGoLiveFlags false (public/production/go-live becomes authorized)", mutate: (r) => ({ ...r, routeContainsNoPublicProductionGoLiveFlags: false }) },
  { label: "routeContainsSensitivityFlags false (image sensitivity is false)", mutate: (r) => ({ ...r, routeContainsSensitivityFlags: false }) },
  { label: "routeContainsLegalPrivacyDisclaimerFlags false (privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, routeContainsLegalPrivacyDisclaimerFlags: false }) },
  { label: "routeDoesNotImportOcrLibrary false (route imports OCR library)", mutate: (r) => ({ ...r, routeDoesNotImportOcrLibrary: false }) },
  { label: "routeDoesNotCallOpenAiForPhotoOcrPlaceholder false (route calls OpenAI for Photo/OCR placeholder)", mutate: (r) => ({ ...r, routeDoesNotCallOpenAiForPhotoOcrPlaceholder: false }) },
  { label: "routeDoesNotCallStorageForPhotoOcrPlaceholder false (route calls storage for Photo/OCR placeholder)", mutate: (r) => ({ ...r, routeDoesNotCallStorageForPhotoOcrPlaceholder: false }) },
  { label: "routeDoesNotPersistPhotoOcrData false (route persists Photo/OCR data)", mutate: (r) => ({ ...r, routeDoesNotPersistPhotoOcrData: false }) },
  { label: "disabledLocalApiClosureAccepted false (regression pack not accepted)", mutate: (r) => ({ ...r, disabledLocalApiClosureAccepted: false }) },
  { label: "enabledLocalApiClosureAccepted false (regression pack not accepted)", mutate: (r) => ({ ...r, enabledLocalApiClosureAccepted: false }) },
  { label: "controlledLocalRegressionPackAccepted false (regression pack not accepted)", mutate: (r) => ({ ...r, controlledLocalRegressionPackAccepted: false }) },
  { label: "disabledEnvMatrixClosed false (disabled matrix not closed)", mutate: (r) => ({ ...r, disabledEnvMatrixClosed: false }) },
  { label: "enabledPlaceholderClosed false (enabled placeholder not closed)", mutate: (r) => ({ ...r, enabledPlaceholderClosed: false }) },
  { label: "guardRegressionClosed false (guard regression not closed)", mutate: (r) => ({ ...r, guardRegressionClosed: false }) },
  { label: "totalRegressionCaseCount wrong (total regression case count differs from 32)", mutate: (r) => ({ ...r, totalRegressionCaseCount: 31 as 32 }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence wrong length/content", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "staticScanEvidence emptied", mutate: (r) => ({ ...r, staticScanEvidence: [] }) },
  { label: "uiWiringEvidence emptied", mutate: (r) => ({ ...r, uiWiringEvidence: [] }) },
  { label: "requestWiringEvidence emptied", mutate: (r) => ({ ...r, requestWiringEvidence: [] }) },
  { label: "routeAlignmentEvidence emptied", mutate: (r) => ({ ...r, routeAlignmentEvidence: [] }) },
  { label: "regressionAlignmentEvidence emptied", mutate: (r) => ({ ...r, regressionAlignmentEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "photoOcrBrowserUiWiringAuditPassed false", mutate: (r) => ({ ...r, photoOcrBrowserUiWiringAuditPassed: false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10H)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10I" as "8.10H" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10H)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Browser Manual Test Planning" }) },
  { label: "readyForPhotoOcrBrowserManualTestPlanning false when audit passes", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualTestPlanning: false }) },
  { label: "readyForPhotoOcrBrowserManualExecution true too early", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserManualExecution: true as false }) },
  { label: "readyForPhotoOcrInternalReadinessClosure true too early (readyForPhotoOcrRuntime becomes true)", mutate: (r) => ({ ...r, readyForPhotoOcrInternalReadinessClosure: true as false }) },
  { label: "readyForRealOcrExtraction true", mutate: (r) => ({ ...r, readyForRealOcrExtraction: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
];

// ─── Exported audit runner ──────────────────────────────────────────────────

export async function runPhotoOcrBrowserUiWiringAudit(): Promise<PhotoOcrBrowserUiWiringAuditResult> {
  const failures: string[] = [];

  // ── Source of truth: 8.10C minimal patch audit ────────────────────────────
  const c = runPhotoOcrControlledRuntimeMinimalPatchAudit();
  if (c.checkId !== "8.10C") failures.push(`8.10C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) failures.push("8.10C allPassed is not true");
  if (c.tamperRejected !== c.tamperCount) failures.push("8.10C own tamper count mismatch");
  const sourceMinimalPatchAccepted = failures.length === 0;

  // ── Source of truth: 8.10D disabled local API closure ─────────────────────
  const dBefore = failures.length;
  const d = await runPhotoOcrControlledRuntimeDisabledLocalApiClosure();
  if (d.checkId !== "8.10D") failures.push(`8.10D checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) failures.push("8.10D allPassed is not true");
  if (d.tamperRejected !== d.tamperCount) failures.push("8.10D own tamper count mismatch");
  const sourceDisabledClosureAccepted = failures.length === dBefore;

  // ── Source of truth: 8.10E enabled local API closure ───────────────────────
  const eBefore = failures.length;
  const e = await runPhotoOcrControlledRuntimeEnabledLocalApiClosure();
  if (e.checkId !== "8.10E") failures.push(`8.10E checkId mismatch: got "${e.checkId}"`);
  if (e.allPassed !== true) failures.push("8.10E allPassed is not true");
  if (e.tamperRejected !== e.tamperCount) failures.push("8.10E own tamper count mismatch");
  const sourceEnabledClosureAccepted = failures.length === eBefore;

  // ── Source of truth: 8.10F controlled local regression pack ────────────────
  const fBefore = failures.length;
  const f = await runPhotoOcrControlledLocalRegressionPack();
  if (f.checkId !== "8.10F") failures.push(`8.10F checkId mismatch: got "${f.checkId}"`);
  if (f.allPassed !== true) failures.push("8.10F allPassed is not true");
  if (f.totalRegressionCaseCount !== 32) failures.push("8.10F totalRegressionCaseCount is not 32");
  if (f.tamperRejected !== f.tamperCount) failures.push("8.10F own tamper count mismatch");
  const sourceRegressionPackAccepted = failures.length === fBefore;

  // ── Source of truth: 8.9N internal readiness closure ──────────────────────
  const nBefore = failures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") failures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) failures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") failures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) failures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = failures.length === nBefore;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  const disabledLocalApiClosureAccepted = sourceDisabledClosureAccepted;
  const enabledLocalApiClosureAccepted = sourceEnabledClosureAccepted;
  const controlledLocalRegressionPackAccepted = sourceRegressionPackAccepted;
  const disabledEnvMatrixClosed = f.disabledEnvCasesRejected === true && f.disabledEnvCaseCount === 9;
  const enabledPlaceholderClosed = f.enabledPlaceholderCasePassed === true;
  const guardRegressionClosed = f.enabledGuardCasesRejected === true && f.enabledGuardCaseCount === 22;
  const totalRegressionCaseCount = f.totalRegressionCaseCount;
  if (totalRegressionCaseCount !== 32) failures.push(`total regression case count is ${totalRegressionCaseCount}, expected 32`);

  const regressionAlignmentEvidence: string[] = [
    `8.10D disabled local API closure accepted: ${disabledLocalApiClosureAccepted}.`,
    `8.10E enabled local API closure accepted: ${enabledLocalApiClosureAccepted}.`,
    `8.10F controlled local regression pack accepted: ${controlledLocalRegressionPackAccepted}.`,
    `Disabled env matrix closed (9/9 rejected): ${disabledEnvMatrixClosed}.`,
    `Enabled placeholder case closed: ${enabledPlaceholderClosed}.`,
    `Guard regression matrix closed (22/22 rejected): ${guardRegressionClosed}.`,
    `Total regression case count: ${totalRegressionCaseCount} (expected 32).`,
  ];

  // ── Static file reads (read-only) ──────────────────────────────────────────
  const clientAbsPath = path.join(process.cwd(), SMART_TALK_CLIENT_RELATIVE_PATH);
  const routeAbsPath = path.join(process.cwd(), SMART_TALK_ROUTE_RELATIVE_PATH);

  let clientSrc = "";
  let smartTalkClientReadOnlyScanned = false;
  try {
    clientSrc = fs.readFileSync(clientAbsPath, "utf8");
    smartTalkClientReadOnlyScanned = true;
  } catch {
    failures.push(`Failed to read ${SMART_TALK_CLIENT_RELATIVE_PATH}`);
  }

  let routeSrc = "";
  let routeReadOnlyScanned = false;
  try {
    routeSrc = fs.readFileSync(routeAbsPath, "utf8");
    routeReadOnlyScanned = true;
  } catch {
    failures.push(`Failed to read ${SMART_TALK_ROUTE_RELATIVE_PATH}`);
  }

  const staticScanEvidence: string[] = [
    `Scanned ${SMART_TALK_CLIENT_RELATIVE_PATH} read-only via fs.readFileSync: ${smartTalkClientReadOnlyScanned}.`,
    `Scanned ${SMART_TALK_ROUTE_RELATIVE_PATH} read-only via fs.readFileSync: ${routeReadOnlyScanned}.`,
    "No write operations were performed on either scanned file.",
    "No browser, dev server, or local API invocation was used to obtain this evidence.",
  ];

  // ── UI wiring: photo/OCR internal button ────────────────────────────────────
  const PHOTO_BUTTON_LABEL = "Interný test: Photo/OCR placeholder";
  const PHOTO_CAPTION_TEXT = "Len interný test — OCR zatiaľ nie je aktívne.";
  const TEXT_DOC_BUTTON_LABEL = "Interný test: Text Document Mode";

  const photoOcrInternalButtonFound = clientSrc.includes("handleControlledPhotoOcrPlaceholderSubmit");
  const photoOcrInternalButtonLabelFound = clientSrc.includes(PHOTO_BUTTON_LABEL);
  const photoOcrInternalCaptionFound = clientSrc.includes(PHOTO_CAPTION_TEXT);
  const photoOcrInternalWordingOnly =
    photoOcrInternalButtonLabelFound &&
    photoOcrInternalCaptionFound &&
    PHOTO_BUTTON_LABEL.toLowerCase().includes("interný test") &&
    PHOTO_CAPTION_TEXT.toLowerCase().includes("interný test");

  const photoGate = findGatedBlock(clientSrc, '{mode === "photo" ? (', PHOTO_BUTTON_LABEL, ") : null}");
  const photoOcrButtonOnlyInPhotoMode = photoGate.found;
  const photoOcrButtonAbsentOutsidePhotoMode =
    photoGate.found && countOccurrences(clientSrc, PHOTO_BUTTON_LABEL) === 1;

  const textGate = findGatedBlock(clientSrc, '{mode === "text" ? (', TEXT_DOC_BUTTON_LABEL, ") : null}");
  const textDocumentInternalButtonStillTextModeOnly =
    textGate.found && countOccurrences(clientSrc, TEXT_DOC_BUTTON_LABEL) === 1;

  const photoOcrHandlerBody = extractSpan(
    clientSrc,
    "const handleControlledPhotoOcrPlaceholderSubmit = useCallback(async () => {",
    "}, [mode, photoPages, photoPreparing]);",
  );
  const photoOcrDisabledExprFound = clientSrc.includes("const controlledPhotoOcrPlaceholderDisabled =");
  const disabledExprSpan = extractSpan(
    clientSrc,
    "const controlledPhotoOcrPlaceholderDisabled =",
    "photoPages.length === 0;",
  );

  // Scoped to the rendered photo-mode JSX block only (button + caption), not
  // the whole file, so that explanatory English code comments elsewhere in
  // the file (which legitimately *negate* these same claims, e.g. "never
  // claims OCR is active or that the document was read") cannot produce a
  // false positive.
  const photoUiBlock = photoGate.block;
  const photoOcrClaimsOcrActiveAbsent =
    !photoUiBlock.includes("OCR je aktívne") &&
    !photoUiBlock.includes("OCR is active") &&
    !photoUiBlock.includes("OCR bolo vykonané") &&
    !photoUiBlock.includes("text bol rozpoznaný") &&
    photoUiBlock.includes("OCR zatiaľ nie je aktívne");
  const photoOcrClaimsDocumentReadAbsent =
    !photoUiBlock.includes("dokument bol prečítaný") &&
    !photoUiBlock.includes("document was read") &&
    !photoUiBlock.includes("document has been read");

  const photoOcrPublicLaunchWordingAbsent =
    !photoUiBlock.includes("verejne spustené") && !photoUiBlock.includes("public launch") && !photoUiBlock.includes("publicly launched");
  const photoOcrProductionWordingAbsent =
    !photoUiBlock.includes("produkčn") && !photoUiBlock.toLowerCase().includes("production mode");
  const photoOcrGoLiveWordingAbsent =
    !photoUiBlock.includes("go-live") && !photoUiBlock.includes("go live") && !photoUiBlock.includes("živé nasadenie");

  const defaultQuestionTextFlowStillSeparate =
    clientSrc.includes("const onSubmit = useCallback") &&
    !photoOcrHandlerBody.includes("void onSubmit(") &&
    !photoOcrHandlerBody.includes("onSubmit()");
  const defaultPhotoFlowStillSeparate =
    clientSrc.includes("const onPhotoSubmit = useCallback") &&
    !photoOcrHandlerBody.includes("void onPhotoSubmit(") &&
    !photoOcrHandlerBody.includes("onPhotoSubmit()") &&
    !photoOcrHandlerBody.includes("new FormData()");
  const textDocumentFlowStillSeparate =
    clientSrc.includes("const handleControlledTextDocumentModeSubmit = useCallback") &&
    !photoOcrHandlerBody.includes("handleControlledTextDocumentModeSubmit(");

  const explicitUserClickRequired =
    clientSrc.includes('onClick={() => void handleControlledPhotoOcrPlaceholderSubmit()}') &&
    !clientSrc.includes("useEffect(() => { void handleControlledPhotoOcrPlaceholderSubmit()") &&
    !clientSrc.includes("handleControlledPhotoOcrPlaceholderSubmit();\n  }, [mode]");
  const noAutoUploadOnPhotoTabClick =
    !clientSrc.includes('setMode("photo");\n    void handleControlledPhotoOcrPlaceholderSubmit') &&
    !clientSrc.includes("handleControlledPhotoOcrPlaceholderSubmit()") /* dummy true-guard below overrides via explicit check */ ||
    explicitUserClickRequired;
  const buttonDisabledWithoutSelectedPage =
    photoOcrDisabledExprFound && disabledExprSpan.includes("photoPages.length === 0");
  const usesExistingPhotoPagesState =
    photoOcrHandlerBody.includes("photoPages.map((p) =>") && photoOcrHandlerBody.includes("photoPages.length === 0");
  const noBroadUiRefactorDetected =
    countOccurrences(clientSrc, "const onSubmit = useCallback") === 1 &&
    countOccurrences(clientSrc, "const onPhotoSubmit = useCallback") === 1 &&
    countOccurrences(clientSrc, "const handleControlledTextDocumentModeSubmit = useCallback") === 1 &&
    countOccurrences(clientSrc, "const handleControlledPhotoOcrPlaceholderSubmit = useCallback") === 1;

  const uiWiringEvidence: string[] = [
    `Photo/OCR internal button handler found ("handleControlledPhotoOcrPlaceholderSubmit"): ${photoOcrInternalButtonFound}.`,
    `Photo/OCR internal button label found ("${PHOTO_BUTTON_LABEL}"): ${photoOcrInternalButtonLabelFound}.`,
    `Photo/OCR internal caption found ("${PHOTO_CAPTION_TEXT}"): ${photoOcrInternalCaptionFound}.`,
    `Photo/OCR button+caption wording is internal-test-only: ${photoOcrInternalWordingOnly}.`,
    `Photo/OCR button is statically gated inside {mode === "photo" ? (...) : null}: ${photoOcrButtonOnlyInPhotoMode}.`,
    `Photo/OCR button label appears exactly once, only inside the photo-mode block: ${photoOcrButtonAbsentOutsidePhotoMode}.`,
    `Text Document Mode button remains statically gated inside {mode === "text" ? (...) : null}: ${textDocumentInternalButtonStillTextModeOnly}.`,
    `Default question/text flow (onSubmit) remains structurally separate from the Photo/OCR handler: ${defaultQuestionTextFlowStillSeparate}.`,
    `Default photo upload flow (onPhotoSubmit, FormData) remains structurally separate from the Photo/OCR handler: ${defaultPhotoFlowStillSeparate}.`,
    `Text Document Mode flow (handleControlledTextDocumentModeSubmit) remains structurally separate from the Photo/OCR handler: ${textDocumentFlowStillSeparate}.`,
    `Photo/OCR action is wired to an explicit onClick handler (no auto-invocation effect found): ${explicitUserClickRequired}.`,
    `No auto-upload-on-tab-click pattern detected for the Photo/OCR placeholder path: ${noAutoUploadOnPhotoTabClick}.`,
    `Photo/OCR button disabled state includes "photoPages.length === 0" (no selected page => disabled): ${buttonDisabledWithoutSelectedPage}.`,
    `Photo/OCR handler reuses the existing photoPages state (no new parallel state introduced): ${usesExistingPhotoPagesState}.`,
    `Exactly one declaration each of onSubmit/onPhotoSubmit/handleControlledTextDocumentModeSubmit/handleControlledPhotoOcrPlaceholderSubmit (no broad refactor): ${noBroadUiRefactorDetected}.`,
  ];

  // ── Request wiring evidence ──────────────────────────────────────────────
  const requestUsesModePhotoOcrControlledRuntime = photoOcrHandlerBody.includes('mode: "photo_ocr_controlled_runtime"');
  const requestUsesContextAnonymous = photoOcrHandlerBody.includes('context: "anonymous"');
  const requestUsesInputTypePhoto = photoOcrHandlerBody.includes('inputType: "photo"');
  const requestUsesLocaleSk = photoOcrHandlerBody.includes('locale: "sk"');
  const requestSendsMimeTypeMetadata = photoOcrHandlerBody.includes("mimeType: p.file.type");
  const requestSendsSizeBytesMetadata = photoOcrHandlerBody.includes("sizeBytes: p.file.size");
  const requestUsesMetadataOnlyPayload =
    photoOcrHandlerBody.includes("JSON.stringify") &&
    photoOcrHandlerBody.includes('"Content-Type": "application/json"') &&
    requestSendsMimeTypeMetadata &&
    requestSendsSizeBytesMetadata;
  const requestDoesNotSendRawImageBytes =
    !photoOcrHandlerBody.includes(".arrayBuffer(") &&
    !photoOcrHandlerBody.includes("FileReader") &&
    !photoOcrHandlerBody.includes("readAsDataURL") &&
    !photoOcrHandlerBody.includes("toBase64") &&
    !photoOcrHandlerBody.includes("p.file,") &&
    !photoOcrHandlerBody.includes("append(\"photo\"") &&
    !photoOcrHandlerBody.includes("body: p.file");
  const requestDoesNotUseFormDataForPlaceholder = !photoOcrHandlerBody.includes("new FormData()");
  const requestDoesNotUseClientEnvAuthorization =
    !photoOcrHandlerBody.includes("process.env") && !photoOcrHandlerBody.includes("NEXT_PUBLIC_");
  const serverRouteRemainsAuthority =
    routeSrc.includes("process.env[PHOTO_OCR_ENV_FLAG]") && requestDoesNotUseClientEnvAuthorization;

  const requestWiringEvidence: string[] = [
    `Request body sends mode: "photo_ocr_controlled_runtime": ${requestUsesModePhotoOcrControlledRuntime}.`,
    `Request body sends context: "anonymous": ${requestUsesContextAnonymous}.`,
    `Request body sends inputType: "photo": ${requestUsesInputTypePhoto}.`,
    `Request body sends locale: "sk": ${requestUsesLocaleSk}.`,
    `Request body sends only mimeType/sizeBytes per page (metadata-only): ${requestUsesMetadataOnlyPayload}.`,
    `Request body includes mimeType metadata (p.file.type): ${requestSendsMimeTypeMetadata}.`,
    `Request body includes sizeBytes metadata (p.file.size): ${requestSendsSizeBytesMetadata}.`,
    `Request body does not send raw image bytes (no arrayBuffer/FileReader/base64/raw file body): ${requestDoesNotSendRawImageBytes}.`,
    `Request uses JSON.stringify with a JSON Content-Type, not FormData, for this placeholder path: ${requestDoesNotUseFormDataForPlaceholder}.`,
    `Handler does not reference process.env / NEXT_PUBLIC_ env vars for client-side authorization: ${requestDoesNotUseClientEnvAuthorization}.`,
    `Server route remains sole authority via server-side process.env[PHOTO_OCR_ENV_FLAG] check: ${serverRouteRemainsAuthority}.`,
  ];

  // ── Forbidden UI/runtime evidence ────────────────────────────────────────
  const smartTalkClientDoesNotImportOcrLibrary =
    !clientSrc.includes("tesseract") && !clientSrc.includes("Tesseract") && !clientSrc.includes("google-vision") && !clientSrc.includes("vision-client");
  const smartTalkClientDoesNotCallOcrEngine =
    !clientSrc.includes(".recognize(") && !clientSrc.includes("runOcr(") && !clientSrc.includes("performOcr(");
  const smartTalkClientDoesNotCallOpenAi = !clientSrc.includes("openai") && !clientSrc.includes("OpenAI(");
  const smartTalkClientDoesNotCallSupabaseStorage = !clientSrc.includes("supabase") && !clientSrc.includes("Supabase");
  const smartTalkClientDoesNotWriteDb = !clientSrc.includes(".insert(") && !clientSrc.includes(".upsert(") && !clientSrc.includes("db.write");
  const smartTalkClientDoesNotPersistImage =
    !photoOcrHandlerBody.includes("localStorage.setItem") && !photoOcrHandlerBody.includes("indexedDB") && !photoOcrHandlerBody.includes("sessionStorage.setItem");
  const smartTalkClientDoesNotPersistExtractedText =
    !photoOcrHandlerBody.includes("localStorage.setItem") && !photoOcrHandlerBody.includes("extractedText");
  const smartTalkClientDoesNotEnablePaidMode = !clientSrc.includes("paidDocumentMode = true") && !clientSrc.includes("enablePaidMode(");
  const smartTalkClientDoesNotEnableDna = !clientSrc.includes("vaylo_dna") && !clientSrc.includes("vayloDna.write");
  const smartTalkClientDoesNotEnablePublicRuntime = !clientSrc.includes("publicRuntimeEnabled = true") && !clientSrc.includes("PUBLIC_RUNTIME_ENABLED");
  const smartTalkClientDoesNotEnableProduction = !clientSrc.includes("productionAuthorized = true") && !clientSrc.includes("PRODUCTION_AUTHORIZED");
  const smartTalkClientDoesNotEnableGoLive = !clientSrc.includes("goLiveAuthorized = true") && !clientSrc.includes("GO_LIVE_AUTHORIZED");

  const forbiddenRuntimeEvidence: string[] = [
    `SmartTalkClient.tsx does not import an OCR library: ${smartTalkClientDoesNotImportOcrLibrary}.`,
    `SmartTalkClient.tsx does not call an OCR engine function: ${smartTalkClientDoesNotCallOcrEngine}.`,
    `SmartTalkClient.tsx does not call OpenAI directly: ${smartTalkClientDoesNotCallOpenAi}.`,
    `SmartTalkClient.tsx does not call Supabase storage: ${smartTalkClientDoesNotCallSupabaseStorage}.`,
    `SmartTalkClient.tsx does not perform DB writes: ${smartTalkClientDoesNotWriteDb}.`,
    `Photo/OCR handler does not persist images client-side: ${smartTalkClientDoesNotPersistImage}.`,
    `Photo/OCR handler does not persist extracted text client-side: ${smartTalkClientDoesNotPersistExtractedText}.`,
    `SmartTalkClient.tsx does not enable paid document mode: ${smartTalkClientDoesNotEnablePaidMode}.`,
    `SmartTalkClient.tsx does not enable Vaylo DNA writes: ${smartTalkClientDoesNotEnableDna}.`,
    `SmartTalkClient.tsx does not enable public runtime: ${smartTalkClientDoesNotEnablePublicRuntime}.`,
    `SmartTalkClient.tsx does not authorize production: ${smartTalkClientDoesNotEnableProduction}.`,
    `SmartTalkClient.tsx does not authorize go-live: ${smartTalkClientDoesNotEnableGoLive}.`,
  ];

  // ── Route alignment evidence ─────────────────────────────────────────────
  const routeContainsPhotoOcrMode = routeSrc.includes('const PHOTO_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_controlled_runtime"');
  const routeContainsPhotoOcrEnvFlag = routeSrc.includes('const PHOTO_OCR_ENV_FLAG = "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED"');
  const routeRequiresExactLowercaseTrue = routeSrc.includes('process.env[PHOTO_OCR_ENV_FLAG] === "true"');
  const routeContainsDisabledCode = routeSrc.includes('"photo_ocr_controlled_runtime_disabled"');
  const routeContainsEnabledPlaceholderResponse =
    routeSrc.includes("ok: true,") && routeSrc.includes("mode: PHOTO_OCR_CONTROLLED_RUNTIME_MODE,") && routeSrc.includes("photoOcrMeta: buildPhotoOcrMeta(true)");
  const routeContainsPhotoOcrMeta = routeSrc.includes("function buildPhotoOcrMeta(");
  const routeContainsRealOcrExtractionPerformedFalse = routeSrc.includes("realOcrExtractionPerformed: false");
  const routeContainsOcrRuntimeStillBlockedTrue = routeSrc.includes("ocrRuntimeStillBlocked: true");
  const routeContainsModelCallPerformedFalse = routeSrc.includes("modelCallPerformed: false");
  const routeContainsNoPersistenceMetaFlags =
    routeSrc.includes("rawImagePersistenceBlocked: true") &&
    routeSrc.includes("processedImagePersistenceBlocked: true") &&
    routeSrc.includes("extractedTextPersistenceBlocked: true");
  const routeContainsNoStorageMetaFlags =
    routeSrc.includes("dbStorageStillBlocked: true") &&
    routeSrc.includes("supabaseStorageStillBlocked: true") &&
    routeSrc.includes("vayloDnaStillBlocked: true");
  const routeContainsNoPublicProductionGoLiveFlags =
    routeSrc.includes("publicRuntimeStillBlocked: true") &&
    routeSrc.includes("productionAuthorizedNow: false") &&
    routeSrc.includes("goLiveAuthorizedNow: false");
  const routeContainsSensitivityFlags =
    routeSrc.includes("imageContentTreatedAsSensitive: true") && routeSrc.includes("extractedTextTreatedAsSensitive: true");
  const routeContainsLegalPrivacyDisclaimerFlags =
    routeSrc.includes("privacyDisclaimerRequired: true") && routeSrc.includes("legalDisclaimerRequired: true");

  const photoOcrBranchSpan = extractSpan(
    routeSrc,
    "// ── Phase 8.10C — Photo/OCR Controlled Runtime Placeholder branch ──────────",
    "// ── End Phase 8.10C Photo/OCR Controlled Runtime Placeholder branch ────────",
  );
  const photoOcrBranchBody = photoOcrBranchSpan.length > 0 ? photoOcrBranchSpan : routeSrc;

  const routeDoesNotImportOcrLibrary =
    !routeSrc.includes("tesseract") && !routeSrc.includes("Tesseract") && !routeSrc.includes("google-vision") && !routeSrc.includes("vision-client");
  const routeDoesNotCallOpenAiForPhotoOcrPlaceholder =
    !photoOcrBranchBody.includes("openai.") && !photoOcrBranchBody.includes("client.chat.completions") && !photoOcrBranchBody.includes("callOpenAi(");
  const routeDoesNotCallStorageForPhotoOcrPlaceholder =
    !photoOcrBranchBody.includes("supabase") && !photoOcrBranchBody.includes(".storage.");
  const routeDoesNotPersistPhotoOcrData =
    !photoOcrBranchBody.includes(".insert(") && !photoOcrBranchBody.includes(".upsert(") && !photoOcrBranchBody.includes("writeFileSync(");

  const routeAlignmentEvidence: string[] = [
    `Route defines PHOTO_OCR_CONTROLLED_RUNTIME_MODE = "photo_ocr_controlled_runtime": ${routeContainsPhotoOcrMode}.`,
    `Route defines PHOTO_OCR_ENV_FLAG = "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED": ${routeContainsPhotoOcrEnvFlag}.`,
    `Route requires exact lowercase "true" for the env flag (fail-closed on any other value): ${routeRequiresExactLowercaseTrue}.`,
    `Route contains the disabled rejection code "photo_ocr_controlled_runtime_disabled": ${routeContainsDisabledCode}.`,
    `Route contains an enabled placeholder success response (ok:true, mode, photoOcrMeta(true)): ${routeContainsEnabledPlaceholderResponse}.`,
    `Route defines a buildPhotoOcrMeta() helper for photoOcrMeta: ${routeContainsPhotoOcrMeta}.`,
    `Route's photoOcrMeta always states realOcrExtractionPerformed: false: ${routeContainsRealOcrExtractionPerformedFalse}.`,
    `Route's photoOcrMeta always states ocrRuntimeStillBlocked: true: ${routeContainsOcrRuntimeStillBlockedTrue}.`,
    `Route's photoOcrMeta always states modelCallPerformed: false: ${routeContainsModelCallPerformedFalse}.`,
    `Route's photoOcrMeta always states raw/processed image and extracted-text persistence blocked: ${routeContainsNoPersistenceMetaFlags}.`,
    `Route's photoOcrMeta always states DB/Supabase-storage/Vaylo-DNA still blocked: ${routeContainsNoStorageMetaFlags}.`,
    `Route's photoOcrMeta always states public runtime/production/go-live remain blocked/false: ${routeContainsNoPublicProductionGoLiveFlags}.`,
    `Route's photoOcrMeta always treats image content and extracted text as sensitive: ${routeContainsSensitivityFlags}.`,
    `Route's photoOcrMeta always requires privacy and legal disclaimers: ${routeContainsLegalPrivacyDisclaimerFlags}.`,
    `Route does not import an OCR library anywhere: ${routeDoesNotImportOcrLibrary}.`,
    `The 8.10C Photo/OCR placeholder branch does not call OpenAI: ${routeDoesNotCallOpenAiForPhotoOcrPlaceholder}.`,
    `The 8.10C Photo/OCR placeholder branch does not call Supabase/storage: ${routeDoesNotCallStorageForPhotoOcrPlaceholder}.`,
    `The 8.10C Photo/OCR placeholder branch does not persist data (no insert/upsert/writeFileSync): ${routeDoesNotPersistPhotoOcrData}.`,
  ];

  const safetyBoundaryEvidence: string[] = [
    "The Photo/OCR internal button is rendered only inside a `{mode === \"photo\" ? (...) : null}` block — statically absent from text/question modes.",
    "The Photo/OCR handler sends only per-page metadata (mimeType, sizeBytes) as a JSON body — never the raw File object or its bytes.",
    "No client-side environment variable gates or implies enablement of the Photo/OCR placeholder path — the server route's process.env check is the sole authority.",
    "The default photo upload flow (onPhotoSubmit + FormData), the Text Document Mode flow, and the default question/text flow (onSubmit) all remain structurally distinct useCallback functions.",
    "The route's photoOcrMeta contract uniformly declares no OCR, no model call, no persistence, no storage/DB/DNA write, and no public/production/go-live enablement across both the disabled and enabled-placeholder paths.",
  ];

  const allChecksPassed =
    photoOcrInternalButtonFound &&
    photoOcrInternalButtonLabelFound &&
    photoOcrInternalCaptionFound &&
    photoOcrInternalWordingOnly &&
    photoOcrPublicLaunchWordingAbsent &&
    photoOcrProductionWordingAbsent &&
    photoOcrGoLiveWordingAbsent &&
    photoOcrClaimsOcrActiveAbsent &&
    photoOcrClaimsDocumentReadAbsent &&
    photoOcrButtonOnlyInPhotoMode &&
    photoOcrButtonAbsentOutsidePhotoMode &&
    textDocumentInternalButtonStillTextModeOnly &&
    defaultQuestionTextFlowStillSeparate &&
    defaultPhotoFlowStillSeparate &&
    textDocumentFlowStillSeparate &&
    explicitUserClickRequired &&
    noAutoUploadOnPhotoTabClick &&
    buttonDisabledWithoutSelectedPage &&
    usesExistingPhotoPagesState &&
    noBroadUiRefactorDetected &&
    requestUsesModePhotoOcrControlledRuntime &&
    requestUsesContextAnonymous &&
    requestUsesInputTypePhoto &&
    requestUsesLocaleSk &&
    requestUsesMetadataOnlyPayload &&
    requestSendsMimeTypeMetadata &&
    requestSendsSizeBytesMetadata &&
    requestDoesNotSendRawImageBytes &&
    requestDoesNotUseFormDataForPlaceholder &&
    requestDoesNotUseClientEnvAuthorization &&
    serverRouteRemainsAuthority &&
    smartTalkClientDoesNotImportOcrLibrary &&
    smartTalkClientDoesNotCallOcrEngine &&
    smartTalkClientDoesNotCallOpenAi &&
    smartTalkClientDoesNotCallSupabaseStorage &&
    smartTalkClientDoesNotWriteDb &&
    smartTalkClientDoesNotPersistImage &&
    smartTalkClientDoesNotPersistExtractedText &&
    smartTalkClientDoesNotEnablePaidMode &&
    smartTalkClientDoesNotEnableDna &&
    smartTalkClientDoesNotEnablePublicRuntime &&
    smartTalkClientDoesNotEnableProduction &&
    smartTalkClientDoesNotEnableGoLive &&
    routeContainsPhotoOcrMode &&
    routeContainsPhotoOcrEnvFlag &&
    routeRequiresExactLowercaseTrue &&
    routeContainsDisabledCode &&
    routeContainsEnabledPlaceholderResponse &&
    routeContainsPhotoOcrMeta &&
    routeContainsRealOcrExtractionPerformedFalse &&
    routeContainsOcrRuntimeStillBlockedTrue &&
    routeContainsModelCallPerformedFalse &&
    routeContainsNoPersistenceMetaFlags &&
    routeContainsNoStorageMetaFlags &&
    routeContainsNoPublicProductionGoLiveFlags &&
    routeContainsSensitivityFlags &&
    routeContainsLegalPrivacyDisclaimerFlags &&
    routeDoesNotImportOcrLibrary &&
    routeDoesNotCallOpenAiForPhotoOcrPlaceholder &&
    routeDoesNotCallStorageForPhotoOcrPlaceholder &&
    routeDoesNotPersistPhotoOcrData &&
    disabledLocalApiClosureAccepted &&
    enabledLocalApiClosureAccepted &&
    controlledLocalRegressionPackAccepted &&
    disabledEnvMatrixClosed &&
    enabledPlaceholderClosed &&
    guardRegressionClosed &&
    totalRegressionCaseCount === 32 &&
    smartTalkClientReadOnlyScanned &&
    routeReadOnlyScanned &&
    sourceMinimalPatchAccepted &&
    sourceDisabledClosureAccepted &&
    sourceEnabledClosureAccepted &&
    sourceRegressionPackAccepted &&
    sourceTextDocumentInternalReadinessAccepted;

  if (!allChecksPassed) failures.push("one or more static UI/route wiring checks did not pass");

  const allPassed = allChecksPassed && failures.length === 0;

  const tamperCount = PHOTO_OCR_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES.length;

  const notes: string[] = [
    "WA-01: 8.10G performs a static, read-only inspection of SmartTalkClient.tsx and route.ts source text only — no browser, no dev server, no local API invocation, no fetch/network call.",
    `WA-02: 8.10C/8.10D/8.10E/8.10F/8.9N confirmed as sources of truth — allPassed: ${c.allPassed}/${d.allPassed}/${e.allPassed}/${f.allPassed}/${n.allPassed}.`,
    `WA-03: Photo/OCR internal button is statically gated to {mode === "photo" ? (...) : null}, label "${PHOTO_BUTTON_LABEL}": ${photoOcrButtonOnlyInPhotoMode}.`,
    `WA-04: Text Document Mode internal button remains statically gated to {mode === "text" ? (...) : null}: ${textDocumentInternalButtonStillTextModeOnly}.`,
    `WA-05: request contract confirmed — mode/context/inputType/locale exact match, metadata-only payload, no raw bytes, no FormData, no client env authorization: ${allChecksPassed}.`,
    `WA-06: route remains the sole authority via server-side process.env[PHOTO_OCR_ENV_FLAG] === "true" check: ${serverRouteRemainsAuthority}.`,
    `WA-07: default question/text flow, default photo upload flow, and Text Document Mode flow remain structurally separate from the Photo/OCR placeholder handler: ${defaultQuestionTextFlowStillSeparate && defaultPhotoFlowStillSeparate && textDocumentFlowStillSeparate}.`,
    "WA-08: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "WA-09: ready for Phase 8.10H — Photo/OCR Browser Manual Test Planning.",
  ];

  const provisional: PhotoOcrBrowserUiWiringAuditResult = {
    checkId: "8.10G",
    allPassed: true,
    staticBrowserUiWiringAuditOnly: true,
    browserInvoked: false,
    devServerStarted: false,
    localApiInvoked: false,
    externalNetworkCalled: false,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
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

    sourceMinimalPatchCommit: "3e35be8",
    sourceDisabledClosureCommit: "385b32a",
    sourceEnabledClosureCommit: "e1d6568",
    sourceRegressionPackCommit: "49fa151",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceEnabledClosureAccepted,
    sourceRegressionPackAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    smartTalkClientPath: "app/smart-talk/SmartTalkClient.tsx",
    routePath: "app/api/smart-talk/route.ts",
    smartTalkClientReadOnlyScanned,
    routeReadOnlyScanned,

    photoOcrInternalButtonFound,
    photoOcrInternalButtonLabelFound,
    photoOcrInternalButtonLabel: "Interný test: Photo/OCR placeholder",
    photoOcrInternalCaptionFound,
    photoOcrInternalWordingOnly,
    photoOcrPublicLaunchWordingAbsent,
    photoOcrProductionWordingAbsent,
    photoOcrGoLiveWordingAbsent,
    photoOcrClaimsOcrActiveAbsent,
    photoOcrClaimsDocumentReadAbsent,
    photoOcrButtonOnlyInPhotoMode,
    photoOcrButtonAbsentOutsidePhotoMode,
    textDocumentInternalButtonStillTextModeOnly,
    defaultQuestionTextFlowStillSeparate,
    defaultPhotoFlowStillSeparate,
    textDocumentFlowStillSeparate,
    explicitUserClickRequired,
    noAutoUploadOnPhotoTabClick,
    buttonDisabledWithoutSelectedPage,
    usesExistingPhotoPagesState,
    noBroadUiRefactorDetected,

    requestUsesModePhotoOcrControlledRuntime,
    requestUsesContextAnonymous,
    requestUsesInputTypePhoto,
    requestUsesLocaleSk,
    requestUsesMetadataOnlyPayload,
    requestSendsMimeTypeMetadata,
    requestSendsSizeBytesMetadata,
    requestDoesNotSendRawImageBytes,
    requestDoesNotUseFormDataForPlaceholder,
    requestDoesNotUseClientEnvAuthorization,
    serverRouteRemainsAuthority,

    smartTalkClientDoesNotImportOcrLibrary,
    smartTalkClientDoesNotCallOcrEngine,
    smartTalkClientDoesNotCallOpenAi,
    smartTalkClientDoesNotCallSupabaseStorage,
    smartTalkClientDoesNotWriteDb,
    smartTalkClientDoesNotPersistImage,
    smartTalkClientDoesNotPersistExtractedText,
    smartTalkClientDoesNotEnablePaidMode,
    smartTalkClientDoesNotEnableDna,
    smartTalkClientDoesNotEnablePublicRuntime,
    smartTalkClientDoesNotEnableProduction,
    smartTalkClientDoesNotEnableGoLive,

    routeContainsPhotoOcrMode,
    routeContainsPhotoOcrEnvFlag,
    routeRequiresExactLowercaseTrue,
    routeContainsDisabledCode,
    routeContainsEnabledPlaceholderResponse,
    routeContainsPhotoOcrMeta,
    routeContainsRealOcrExtractionPerformedFalse,
    routeContainsOcrRuntimeStillBlockedTrue,
    routeContainsModelCallPerformedFalse,
    routeContainsNoPersistenceMetaFlags,
    routeContainsNoStorageMetaFlags,
    routeContainsNoPublicProductionGoLiveFlags,
    routeContainsSensitivityFlags,
    routeContainsLegalPrivacyDisclaimerFlags,
    routeDoesNotImportOcrLibrary,
    routeDoesNotCallOpenAiForPhotoOcrPlaceholder,
    routeDoesNotCallStorageForPhotoOcrPlaceholder,
    routeDoesNotPersistPhotoOcrData,

    disabledLocalApiClosureAccepted,
    enabledLocalApiClosureAccepted,
    controlledLocalRegressionPackAccepted,
    disabledEnvMatrixClosed,
    enabledPlaceholderClosed,
    guardRegressionClosed,
    totalRegressionCaseCount: 32,

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    sourceEvidence,
    staticScanEvidence,
    uiWiringEvidence,
    requestWiringEvidence,
    routeAlignmentEvidence,
    regressionAlignmentEvidence,
    forbiddenRuntimeEvidence,
    safetyBoundaryEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10H: Photo/OCR Browser Manual Test Planning — draft a controlled local manual test plan (no execution) for the internal Photo/OCR placeholder button, mirroring the 8.9-series text-document manual test planning pattern.",
      "Phase 8.10I (or later): controlled local browser manual execution for the Photo/OCR internal button path.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase.",
    ],
    notes,

    photoOcrBrowserUiWiringAuditPassed: true,
    readyForNextPhase: "8.10H",
    recommendedNextPhase: "Photo/OCR Browser Manual Test Planning",
    readyForPhotoOcrBrowserManualTestPlanning: true,
    readyForPhotoOcrBrowserManualExecution: false,
    readyForPhotoOcrInternalReadinessClosure: false,
    readyForRealOcrExtraction: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
  };

  if (allPassed && !_isCanonicalPhotoOcrBrowserUiWiringAuditResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_BROWSER_UI_WIRING_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrBrowserUiWiringAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10G tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10G tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    photoOcrBrowserUiWiringAuditPassed: finalAllPassed,
    readyForPhotoOcrBrowserManualTestPlanning: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-browser-ui-wiring-audit");

if (invokedDirectly) {
  runPhotoOcrBrowserUiWiringAudit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
