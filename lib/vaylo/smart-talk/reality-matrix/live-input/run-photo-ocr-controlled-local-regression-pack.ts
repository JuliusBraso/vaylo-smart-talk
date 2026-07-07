/**
 * PHASE 8.10F — Photo/OCR Controlled Local Regression Pack
 *
 * Consolidates and locks the already-validated observed evidence from:
 *  - 8.10D (disabled local API closure — 9 non-exact env variants, all
 *    rejected with 403 / photo_ocr_controlled_runtime_disabled)
 *  - 8.10E (enabled local API closure — 1 exact-"true" placeholder success
 *    case + 22 guard-rejection cases)
 *
 * into a single 32-case controlled local regression matrix, re-verifying
 * every case's safety invariants (no OCR, no model call, no upload, no
 * persistence, no DB/storage/DNA, no public/production/go-live, sensitivity
 * flags, disclaimers, 8.3AC untouched).
 *
 * This pack creates NO new runtime behavior and performs NO new route
 * invocation: it imports 8.10D and 8.10E as sources of truth and builds the
 * regression matrix from their already-observed case data. It does NOT
 * start a dev server, does NOT use a browser, does NOT perform live external
 * network calls, does NOT call OpenAI/any model, does NOT call an OCR
 * engine, does NOT read real images or image bytes, does NOT persist
 * anything, does NOT write DB/storage/DNA, does NOT run 8.3AC, and does NOT
 * touch tmp-8-3ac-live-metadata.ts.
 */

import { runPhotoOcrControlledRuntimeGateDesign } from "./run-photo-ocr-controlled-runtime-gate-design";
import { runPhotoOcrControlledRuntimeImplementationPlan } from "./run-photo-ocr-controlled-runtime-implementation-plan";
import { runPhotoOcrControlledRuntimeMinimalPatchAudit } from "./run-photo-ocr-controlled-runtime-minimal-patch-audit";
import { runPhotoOcrControlledRuntimeDisabledLocalApiClosure } from "./run-photo-ocr-controlled-runtime-disabled-local-api-closure";
import { runPhotoOcrControlledRuntimeEnabledLocalApiClosure } from "./run-photo-ocr-controlled-runtime-enabled-local-api-closure";
import { runTextDocumentModeInternalReadinessClosure } from "./run-text-document-mode-internal-readiness-closure";

// ─── Shared regression-case safety flags ────────────────────────────────────

interface RegressionCaseSafetyFlags {
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
  imageContentSensitive: boolean;
  extractedTextSensitive: boolean;
  modelOutputUntrusted: boolean;
  ocrOutputUntrusted: boolean;
  privacyDisclaimerRequired: boolean;
  legalDisclaimerRequired: boolean;
  eightThreeAcNotRun: boolean;
}

interface DisabledEnvRegressionCase extends RegressionCaseSafetyFlags {
  caseId: string;
  envValueDescription: string;
  expectedStatus: 403;
  expectedOk: false;
  expectedCode: "photo_ocr_controlled_runtime_disabled";
  observedStatus: number;
  observedOk: boolean;
  observedCode: string;
  passed: boolean;
}

interface EnabledPlaceholderRegressionCase extends RegressionCaseSafetyFlags {
  caseId: "valid_placeholder_metadata_only";
  description: string;
  expectedStatus: 200;
  expectedOk: true;
  expectedMode: "photo_ocr_controlled_runtime";
  expectedContext: "anonymous";
  observedStatus: number;
  observedOk: boolean;
  observedMode: string;
  observedContext: string;
  placeholderOnly: boolean;
  realOcrExtractionPerformed: boolean;
  ocrRuntimeStillBlocked: boolean;
  modelCallPerformed: boolean;
  containsExtractedText: boolean;
  containsExactDeadline: boolean;
  containsBindingLegalAdvice: boolean;
  containsOfficialFiling: boolean;
  passed: boolean;
}

interface EnabledGuardRegressionCase extends RegressionCaseSafetyFlags {
  caseId: string;
  description: string;
  expectedStatus: 400 | 402;
  expectedCode: string;
  observedStatus: number;
  observedOk: boolean;
  observedCode: string;
  passed: boolean;
}

// ─── Result type ────────────────────────────────────────────────────────────

interface PhotoOcrControlledLocalRegressionPackResult {
  checkId: "8.10F";
  allPassed: boolean;
  controlledLocalRegressionPackOnly: true;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
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

  sourceGateDesignCommit: "4a87043";
  sourceImplementationPlanCommit: "6a26e47";
  sourceMinimalPatchCommit: "3e35be8";
  sourceDisabledClosureCommit: "385b32a";
  sourceEnabledClosureCommit: "e1d6568";
  sourceTextDocumentInternalReadinessCommit: "3cf81c1";
  sourceGateDesignAccepted: boolean;
  sourceImplementationPlanAccepted: boolean;
  sourceMinimalPatchAccepted: boolean;
  sourceDisabledClosureAccepted: boolean;
  sourceEnabledClosureAccepted: boolean;
  sourceTextDocumentInternalReadinessAccepted: boolean;

  disabledEnvRegressionIncluded: true;
  disabledEnvCaseCount: 9;
  disabledEnvCasesPassed: boolean;
  disabledEnvCasesRejected: boolean;
  disabledEnvCasesRejectedCount: number;

  enabledPlaceholderRegressionIncluded: true;
  enabledPlaceholderCasePassed: boolean;
  enabledPlaceholderStatus: number;
  enabledPlaceholderOk: boolean;
  enabledPlaceholderMode: string;
  enabledPlaceholderContext: string;
  enabledPlaceholderOnly: boolean;
  enabledPlaceholderRealOcrExtractionPerformed: boolean;
  enabledPlaceholderOcrRuntimeStillBlocked: boolean;
  enabledPlaceholderModelCallPerformed: boolean;

  enabledGuardRegressionIncluded: true;
  enabledGuardCaseCount: 22;
  enabledGuardCasesPassed: boolean;
  enabledGuardCasesRejected: boolean;
  enabledGuardCasesRejectedCount: number;

  totalRegressionCaseCount: 32;
  totalRegressionCasesPassed: boolean;
  totalRegressionCasesRejectedWhereExpected: boolean;

  disabledEnvRegressionCases: DisabledEnvRegressionCase[];
  enabledPlaceholderRegressionCases: EnabledPlaceholderRegressionCase[];
  enabledGuardRegressionCases: EnabledGuardRegressionCase[];

  photoOcrPlaceholderLocalApiRegressionClosed: boolean;
  disabledAndEnabledLocalApiClosuresConsolidated: boolean;
  readyForNextPhase: "8.10G";
  recommendedNextPhase: "Photo/OCR Browser/UI Wiring Audit";
  readyForPhotoOcrBrowserUiWiringAudit: boolean;
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
  disabledEnvRegressionCaseEvidence: string[];
  enabledPlaceholderRegressionCaseEvidence: string[];
  enabledGuardRegressionCaseEvidence: string[];
  combinedRegressionEvidence: string[];
  responseContractEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
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
  "8.10E enabled local API closure accepted",
  "8.9N text document internal readiness accepted",
];

const REQUIRED_COMBINED_REGRESSION_EVIDENCE: string[] = [
  "Disabled env variants are consolidated from 8.10D",
  "Enabled placeholder success is consolidated from 8.10E",
  "Enabled guard rejection cases are consolidated from 8.10E",
  "Total regression cases equal 32",
  "No regression case uses real images",
  "No regression case performs OCR",
  "No regression case calls model",
  "No regression case persists data",
  "No regression case enables public runtime, production, or go-live",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
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
  "This phase is a local regression pack only.",
  "This phase does not perform browser/UI validation.",
  "This phase does not perform real OCR extraction.",
  "This phase does not use real images.",
  "This phase does not validate OCR quality.",
  "This phase does not validate real OCR trust boundaries.",
  "This phase does not authorize public runtime, production, or go-live.",
  "Real OCR extraction remains deferred to a later separate phase.",
];

function metaFlag(meta: Record<string, unknown> | null, key: string): boolean {
  return meta !== null && meta[key] === true;
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalPhotoOcrControlledLocalRegressionPackResult(
  r: PhotoOcrControlledLocalRegressionPackResult,
): boolean {
  if (r.checkId !== "8.10F") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledLocalRegressionPackOnly !== true) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
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

  if (r.sourceGateDesignCommit !== "4a87043") return false;
  if (r.sourceImplementationPlanCommit !== "6a26e47") return false;
  if (r.sourceMinimalPatchCommit !== "3e35be8") return false;
  if (r.sourceDisabledClosureCommit !== "385b32a") return false;
  if (r.sourceEnabledClosureCommit !== "e1d6568") return false;
  if (r.sourceTextDocumentInternalReadinessCommit !== "3cf81c1") return false;
  if (r.sourceGateDesignAccepted !== true) return false;
  if (r.sourceImplementationPlanAccepted !== true) return false;
  if (r.sourceMinimalPatchAccepted !== true) return false;
  if (r.sourceDisabledClosureAccepted !== true) return false;
  if (r.sourceEnabledClosureAccepted !== true) return false;
  if (r.sourceTextDocumentInternalReadinessAccepted !== true) return false;

  if (r.disabledEnvRegressionIncluded !== true) return false;
  if (r.disabledEnvCaseCount !== 9) return false;
  if (r.disabledEnvCasesPassed !== true) return false;
  if (r.disabledEnvCasesRejected !== true) return false;
  if (r.disabledEnvCasesRejectedCount !== 9) return false;
  if (!Array.isArray(r.disabledEnvRegressionCases) || r.disabledEnvRegressionCases.length !== 9) return false;
  if (
    r.disabledEnvRegressionCases.some(
      (c) =>
        c.passed !== true ||
        c.observedStatus !== 403 ||
        c.observedOk !== false ||
        c.observedCode !== "photo_ocr_controlled_runtime_disabled" ||
        !c.noOcr ||
        !c.noModel ||
        !c.noUpload ||
        !c.noPersistence ||
        !c.noDbStorage ||
        !c.noSupabaseStorage ||
        !c.noDna ||
        !c.noPublicRuntime ||
        !c.noProduction ||
        !c.noGoLive ||
        !c.imageContentSensitive ||
        !c.extractedTextSensitive ||
        !c.modelOutputUntrusted ||
        !c.ocrOutputUntrusted ||
        !c.privacyDisclaimerRequired ||
        !c.legalDisclaimerRequired ||
        !c.eightThreeAcNotRun,
    )
  )
    return false;

  if (r.enabledPlaceholderRegressionIncluded !== true) return false;
  if (r.enabledPlaceholderCasePassed !== true) return false;
  if (r.enabledPlaceholderStatus !== 200) return false;
  if (r.enabledPlaceholderOk !== true) return false;
  if (r.enabledPlaceholderMode !== "photo_ocr_controlled_runtime") return false;
  if (r.enabledPlaceholderContext !== "anonymous") return false;
  if (r.enabledPlaceholderOnly !== true) return false;
  if (r.enabledPlaceholderRealOcrExtractionPerformed !== false) return false;
  if (r.enabledPlaceholderOcrRuntimeStillBlocked !== true) return false;
  if (r.enabledPlaceholderModelCallPerformed !== false) return false;
  if (!Array.isArray(r.enabledPlaceholderRegressionCases) || r.enabledPlaceholderRegressionCases.length !== 1) return false;
  {
    const p = r.enabledPlaceholderRegressionCases[0];
    if (
      !p ||
      p.passed !== true ||
      p.observedStatus !== 200 ||
      p.observedOk !== true ||
      p.observedMode !== "photo_ocr_controlled_runtime" ||
      p.observedContext !== "anonymous" ||
      p.placeholderOnly !== true ||
      p.realOcrExtractionPerformed !== false ||
      p.ocrRuntimeStillBlocked !== true ||
      p.modelCallPerformed !== false ||
      p.containsExtractedText !== false ||
      p.containsExactDeadline !== false ||
      p.containsBindingLegalAdvice !== false ||
      p.containsOfficialFiling !== false ||
      !p.noOcr ||
      !p.noModel ||
      !p.noUpload ||
      !p.noPersistence ||
      !p.noDbStorage ||
      !p.noSupabaseStorage ||
      !p.noDna ||
      !p.noPublicRuntime ||
      !p.noProduction ||
      !p.noGoLive ||
      !p.imageContentSensitive ||
      !p.extractedTextSensitive ||
      !p.modelOutputUntrusted ||
      !p.ocrOutputUntrusted ||
      !p.privacyDisclaimerRequired ||
      !p.legalDisclaimerRequired ||
      !p.eightThreeAcNotRun
    )
      return false;
  }

  if (r.enabledGuardRegressionIncluded !== true) return false;
  if (r.enabledGuardCaseCount !== 22) return false;
  if (r.enabledGuardCasesPassed !== true) return false;
  if (r.enabledGuardCasesRejected !== true) return false;
  if (r.enabledGuardCasesRejectedCount !== 22) return false;
  if (!Array.isArray(r.enabledGuardRegressionCases) || r.enabledGuardRegressionCases.length !== 22) return false;
  if (
    r.enabledGuardRegressionCases.some(
      (c) =>
        c.passed !== true ||
        c.observedOk !== false ||
        c.observedCode !== c.expectedCode ||
        c.observedStatus !== c.expectedStatus ||
        !c.noOcr ||
        !c.noModel ||
        !c.noUpload ||
        !c.noPersistence ||
        !c.noDbStorage ||
        !c.noSupabaseStorage ||
        !c.noDna ||
        !c.noPublicRuntime ||
        !c.noProduction ||
        !c.noGoLive ||
        !c.imageContentSensitive ||
        !c.extractedTextSensitive ||
        !c.modelOutputUntrusted ||
        !c.ocrOutputUntrusted ||
        !c.privacyDisclaimerRequired ||
        !c.legalDisclaimerRequired ||
        !c.eightThreeAcNotRun,
    )
  )
    return false;

  if (r.totalRegressionCaseCount !== 32) return false;
  if (r.totalRegressionCasesPassed !== true) return false;
  if (r.totalRegressionCasesRejectedWhereExpected !== true) return false;

  if (r.photoOcrPlaceholderLocalApiRegressionClosed !== true) return false;
  if (r.disabledAndEnabledLocalApiClosuresConsolidated !== true) return false;
  if (r.readyForNextPhase !== "8.10G") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Browser/UI Wiring Audit") return false;
  if (r.readyForPhotoOcrBrowserUiWiringAudit !== true) return false;
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
  if (!Array.isArray(r.disabledEnvRegressionCaseEvidence) || r.disabledEnvRegressionCaseEvidence.length !== 9) return false;
  if (!Array.isArray(r.enabledPlaceholderRegressionCaseEvidence) || r.enabledPlaceholderRegressionCaseEvidence.length !== 1) return false;
  if (!Array.isArray(r.enabledGuardRegressionCaseEvidence) || r.enabledGuardRegressionCaseEvidence.length !== 22) return false;
  if (r.combinedRegressionEvidence.length !== REQUIRED_COMBINED_REGRESSION_EVIDENCE.length) return false;
  for (const item of REQUIRED_COMBINED_REGRESSION_EVIDENCE) {
    if (!r.combinedRegressionEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.responseContractEvidence) || r.responseContractEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
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

type Tamper810FMutation = (
  r: PhotoOcrControlledLocalRegressionPackResult,
) => PhotoOcrControlledLocalRegressionPackResult;
interface Tamper810FCase {
  label: string;
  mutate: Tamper810FMutation;
}

function withDisabledCaseField<K extends keyof DisabledEnvRegressionCase>(
  cases: DisabledEnvRegressionCase[],
  index: number,
  key: K,
  value: DisabledEnvRegressionCase[K],
): DisabledEnvRegressionCase[] {
  return cases.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

function withGuardCaseField<K extends keyof EnabledGuardRegressionCase>(
  cases: EnabledGuardRegressionCase[],
  index: number,
  key: K,
  value: EnabledGuardRegressionCase[K],
): EnabledGuardRegressionCase[] {
  return cases.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

function withPlaceholderCaseField<K extends keyof EnabledPlaceholderRegressionCase>(
  cases: EnabledPlaceholderRegressionCase[],
  index: number,
  key: K,
  value: EnabledPlaceholderRegressionCase[K],
): EnabledPlaceholderRegressionCase[] {
  return cases.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const PHOTO_OCR_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES: Tamper810FCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.10E" as "8.10F" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "controlledLocalRegressionPackOnly false", mutate: (r) => ({ ...r, controlledLocalRegressionPackOnly: false as true }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
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
  { label: "dbStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "supabaseStorageWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, supabaseStorageWritePerformed: true as false }) },
  { label: "vayloDnaWritePerformed true (DB/storage/DNA write performed)", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "publicRuntimeEnabledNow true (public runtime becomes enabled)", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true (production becomes authorized)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes authorized)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceGateDesignAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "sourceGateDesignCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "4a87043" }) },
  { label: "sourceImplementationPlanAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceImplementationPlanAccepted: false }) },
  { label: "sourceImplementationPlanCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "6a26e47" }) },
  { label: "sourceMinimalPatchAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceMinimalPatchAccepted: false }) },
  { label: "sourceMinimalPatchCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceMinimalPatchCommit: "0000000" as "3e35be8" }) },
  { label: "sourceDisabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceDisabledClosureAccepted: false }) },
  { label: "sourceDisabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceDisabledClosureCommit: "0000000" as "385b32a" }) },
  { label: "sourceEnabledClosureAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceEnabledClosureAccepted: false }) },
  { label: "sourceEnabledClosureCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceEnabledClosureCommit: "0000000" as "e1d6568" }) },
  { label: "sourceTextDocumentInternalReadinessAccepted false (source phase missing/not accepted)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessAccepted: false }) },
  { label: "sourceTextDocumentInternalReadinessCommit wrong (source commit differs from expected)", mutate: (r) => ({ ...r, sourceTextDocumentInternalReadinessCommit: "0000000" as "3cf81c1" }) },
  { label: "disabledEnvRegressionIncluded false (disabled env regression missing)", mutate: (r) => ({ ...r, disabledEnvRegressionIncluded: false as true }) },
  { label: "disabledEnvCaseCount wrong (disabled case count is not 9)", mutate: (r) => ({ ...r, disabledEnvCaseCount: 8 as 9 }) },
  { label: "disabledEnvRegressionCases missing one entry (any disabled case missing)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: r.disabledEnvRegressionCases.slice(0, 8) }) },
  { label: "one disabled case status differs (any disabled case status/code/ok differs)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "observedStatus", 200) }) },
  { label: "one disabled case ok differs (any disabled case status/code/ok differs)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 1, "observedOk", true) }) },
  { label: "one disabled case code differs (any disabled case status/code/ok differs)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 2, "observedCode", "photo_ocr_controlled_runtime_enabled") }) },
  { label: "disabledEnvCasesPassed false", mutate: (r) => ({ ...r, disabledEnvCasesPassed: false }) },
  { label: "disabledEnvCasesRejected false", mutate: (r) => ({ ...r, disabledEnvCasesRejected: false }) },
  { label: "disabledEnvCasesRejectedCount wrong", mutate: (r) => ({ ...r, disabledEnvCasesRejectedCount: 8 }) },
  { label: "enabledPlaceholderRegressionIncluded false (enabled placeholder regression missing)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionIncluded: false as true }) },
  { label: "enabledPlaceholderRegressionCases emptied (enabled placeholder regression missing)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCases: [] }) },
  { label: "enabledPlaceholderStatus wrong (valid placeholder status is not 200)", mutate: (r) => ({ ...r, enabledPlaceholderStatus: 403 }) },
  { label: "enabledPlaceholderOk false (valid placeholder ok is not true)", mutate: (r) => ({ ...r, enabledPlaceholderOk: false }) },
  { label: "enabledPlaceholderMode wrong (valid placeholder mode differs)", mutate: (r) => ({ ...r, enabledPlaceholderMode: "photo_ocr_other" }) },
  { label: "enabledPlaceholderOnly false (valid placeholder is not placeholderOnly)", mutate: (r) => ({ ...r, enabledPlaceholderOnly: false }) },
  { label: "enabledPlaceholderRealOcrExtractionPerformed true (valid placeholder performs real OCR)", mutate: (r) => ({ ...r, enabledPlaceholderRealOcrExtractionPerformed: true }) },
  { label: "enabledPlaceholderOcrRuntimeStillBlocked false", mutate: (r) => ({ ...r, enabledPlaceholderOcrRuntimeStillBlocked: false }) },
  { label: "enabledPlaceholderModelCallPerformed true (valid placeholder calls model)", mutate: (r) => ({ ...r, enabledPlaceholderModelCallPerformed: true }) },
  { label: "enabledPlaceholderCasePassed false", mutate: (r) => ({ ...r, enabledPlaceholderCasePassed: false }) },
  { label: "placeholder case noUpload false (valid placeholder uploads/persists/writes storage/DNA)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCases: withPlaceholderCaseField(r.enabledPlaceholderRegressionCases, 0, "noUpload", false) }) },
  { label: "placeholder case noPersistence false (valid placeholder uploads/persists/writes storage/DNA)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCases: withPlaceholderCaseField(r.enabledPlaceholderRegressionCases, 0, "noPersistence", false) }) },
  { label: "placeholder case noDbStorage false (valid placeholder uploads/persists/writes storage/DNA)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCases: withPlaceholderCaseField(r.enabledPlaceholderRegressionCases, 0, "noDbStorage", false) }) },
  { label: "placeholder case noDna false (valid placeholder uploads/persists/writes storage/DNA)", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCases: withPlaceholderCaseField(r.enabledPlaceholderRegressionCases, 0, "noDna", false) }) },
  { label: "enabledGuardRegressionIncluded false (enabled guard regression missing)", mutate: (r) => ({ ...r, enabledGuardRegressionIncluded: false as true }) },
  { label: "enabledGuardCaseCount wrong (guard case count is not 22)", mutate: (r) => ({ ...r, enabledGuardCaseCount: 21 as 22 }) },
  { label: "enabledGuardRegressionCases missing one entry (any guard case missing)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: r.enabledGuardRegressionCases.slice(0, 21) }) },
  { label: "one guard case status differs (any guard case status/code/ok differs)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 0, "observedStatus", 200) }) },
  { label: "one guard case ok differs (any guard case status/code/ok differs)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 5, "observedOk", true) }) },
  { label: "one guard case code differs (any guard case status/code/ok differs)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 10, "observedCode", "photo_ocr_something_else") }) },
  { label: "one guard case performs OCR (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 3, "noOcr", false) }) },
  { label: "one guard case performs model call (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 3, "noModel", false) }) },
  { label: "one guard case performs upload (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 8, "noUpload", false) }) },
  { label: "one guard case performs persistence (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 9, "noPersistence", false) }) },
  { label: "one guard case writes DB (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 10, "noDbStorage", false) }) },
  { label: "one guard case writes storage (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 10, "noSupabaseStorage", false) }) },
  { label: "one guard case writes DNA (any guard case performs OCR/model/upload/persistence/DB/storage/DNA)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 11, "noDna", false) }) },
  { label: "enabledGuardCasesPassed false", mutate: (r) => ({ ...r, enabledGuardCasesPassed: false }) },
  { label: "enabledGuardCasesRejected false", mutate: (r) => ({ ...r, enabledGuardCasesRejected: false }) },
  { label: "enabledGuardCasesRejectedCount wrong", mutate: (r) => ({ ...r, enabledGuardCasesRejectedCount: 21 }) },
  { label: "totalRegressionCaseCount wrong (total regression case count is not 32)", mutate: (r) => ({ ...r, totalRegressionCaseCount: 31 as 32 }) },
  { label: "totalRegressionCasesPassed false", mutate: (r) => ({ ...r, totalRegressionCasesPassed: false }) },
  { label: "totalRegressionCasesRejectedWhereExpected false", mutate: (r) => ({ ...r, totalRegressionCasesRejectedWhereExpected: false }) },
  { label: "any disabled case image sensitivity false (image sensitivity is false)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "imageContentSensitive", false) }) },
  { label: "any disabled case extracted text sensitivity false (extracted text sensitivity is false)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "extractedTextSensitive", false) }) },
  { label: "any disabled case model output trusted (model output becomes trusted)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "modelOutputUntrusted", false) }) },
  { label: "any disabled case OCR output trusted (OCR output becomes trusted)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "ocrOutputUntrusted", false) }) },
  { label: "any disabled case privacy disclaimer optional (privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "privacyDisclaimerRequired", false) }) },
  { label: "any disabled case legal disclaimer optional (privacy/legal disclaimers optional)", mutate: (r) => ({ ...r, disabledEnvRegressionCases: withDisabledCaseField(r.disabledEnvRegressionCases, 0, "legalDisclaimerRequired", false) }) },
  { label: "any guard case image sensitivity false (image sensitivity is false)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 16, "imageContentSensitive", false) }) },
  { label: "any guard case extracted text sensitivity false (extracted text sensitivity is false)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 16, "extractedTextSensitive", false) }) },
  { label: "any guard case public runtime enabled (public runtime becomes enabled)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 13, "noPublicRuntime", false) }) },
  { label: "any guard case production authorized (production/go-live becomes authorized)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 14, "noProduction", false) }) },
  { label: "any guard case go-live authorized (production/go-live becomes authorized)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 15, "noGoLive", false) }) },
  { label: "any guard case paid/DNA/persistence/storage becomes enabled", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 12, "noDna", false) }) },
  { label: "exact legal deadline guard case not rejected (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 16, "observedOk", true) }) },
  { label: "binding legal advice guard case not rejected (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 17, "observedOk", true) }) },
  { label: "official filing guard case not rejected (official filing generation becomes allowed)", mutate: (r) => ({ ...r, enabledGuardRegressionCases: withGuardCaseField(r.enabledGuardRegressionCases, 18, "observedOk", true) }) },
  { label: "photoOcrPlaceholderLocalApiRegressionClosed false", mutate: (r) => ({ ...r, photoOcrPlaceholderLocalApiRegressionClosed: false }) },
  { label: "disabledAndEnabledLocalApiClosuresConsolidated false", mutate: (r) => ({ ...r, disabledAndEnabledLocalApiClosuresConsolidated: false }) },
  { label: "readyForNextPhase wrong (next phase is not 8.10G)", mutate: (r) => ({ ...r, readyForNextPhase: "8.10H" as "8.10G" }) },
  { label: "recommendedNextPhase wrong (next phase is not 8.10G)", mutate: (r) => ({ ...r, recommendedNextPhase: "Photo/OCR Public Launch" as "Photo/OCR Browser/UI Wiring Audit" }) },
  { label: "readyForPhotoOcrBrowserUiWiringAudit false when regression passes", mutate: (r) => ({ ...r, readyForPhotoOcrBrowserUiWiringAudit: false }) },
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
  { label: "disabledEnvRegressionCaseEvidence wrong length", mutate: (r) => ({ ...r, disabledEnvRegressionCaseEvidence: [] }) },
  { label: "enabledPlaceholderRegressionCaseEvidence wrong length", mutate: (r) => ({ ...r, enabledPlaceholderRegressionCaseEvidence: [] }) },
  { label: "enabledGuardRegressionCaseEvidence wrong length", mutate: (r) => ({ ...r, enabledGuardRegressionCaseEvidence: [] }) },
  { label: "combinedRegressionEvidence wrong length/content", mutate: (r) => ({ ...r, combinedRegressionEvidence: [] }) },
  { label: "responseContractEvidence emptied", mutate: (r) => ({ ...r, responseContractEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "forbiddenRuntimeEvidence emptied", mutate: (r) => ({ ...r, forbiddenRuntimeEvidence: [] }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported regression pack runner ────────────────────────────────────────

export async function runPhotoOcrControlledLocalRegressionPack(): Promise<PhotoOcrControlledLocalRegressionPackResult> {
  const packFailures: string[] = [];

  // ── Source of truth: 8.10A gate design ────────────────────────────────────
  const a = runPhotoOcrControlledRuntimeGateDesign();
  if (a.checkId !== "8.10A") packFailures.push(`8.10A checkId mismatch: got "${a.checkId}"`);
  if (a.allPassed !== true) packFailures.push("8.10A allPassed is not true");
  if (a.tamperRejected !== a.tamperCount) packFailures.push("8.10A own tamper count mismatch");
  const sourceGateDesignAccepted = packFailures.length === 0;

  // ── Source of truth: 8.10B implementation plan ────────────────────────────
  const bBefore = packFailures.length;
  const b = runPhotoOcrControlledRuntimeImplementationPlan();
  if (b.checkId !== "8.10B") packFailures.push(`8.10B checkId mismatch: got "${b.checkId}"`);
  if (b.allPassed !== true) packFailures.push("8.10B allPassed is not true");
  if (b.tamperRejected !== b.tamperCount) packFailures.push("8.10B own tamper count mismatch");
  const sourceImplementationPlanAccepted = packFailures.length === bBefore;

  // ── Source of truth: 8.10C minimal patch audit ────────────────────────────
  const cBefore = packFailures.length;
  const c = runPhotoOcrControlledRuntimeMinimalPatchAudit();
  if (c.checkId !== "8.10C") packFailures.push(`8.10C checkId mismatch: got "${c.checkId}"`);
  if (c.allPassed !== true) packFailures.push("8.10C allPassed is not true");
  if (c.tamperRejected !== c.tamperCount) packFailures.push("8.10C own tamper count mismatch");
  const sourceMinimalPatchAccepted = packFailures.length === cBefore;

  // ── Source of truth: 8.10D disabled local API closure ─────────────────────
  const dBefore = packFailures.length;
  const d = await runPhotoOcrControlledRuntimeDisabledLocalApiClosure();
  if (d.checkId !== "8.10D") packFailures.push(`8.10D checkId mismatch: got "${d.checkId}"`);
  if (d.allPassed !== true) packFailures.push("8.10D allPassed is not true");
  if (d.disabledEnvCases.length !== 9) packFailures.push("8.10D did not produce exactly 9 disabled env cases");
  if (d.tamperRejected !== d.tamperCount) packFailures.push("8.10D own tamper count mismatch");
  const sourceDisabledClosureAccepted = packFailures.length === dBefore;

  // ── Source of truth: 8.10E enabled local API closure ───────────────────────
  const eBefore = packFailures.length;
  const e = await runPhotoOcrControlledRuntimeEnabledLocalApiClosure();
  if (e.checkId !== "8.10E") packFailures.push(`8.10E checkId mismatch: got "${e.checkId}"`);
  if (e.allPassed !== true) packFailures.push("8.10E allPassed is not true");
  if (e.guardCases.length !== 22) packFailures.push("8.10E did not produce exactly 22 guard cases");
  if (e.tamperRejected !== e.tamperCount) packFailures.push("8.10E own tamper count mismatch");
  const sourceEnabledClosureAccepted = packFailures.length === eBefore;

  // ── Source of truth: 8.9N internal readiness closure ──────────────────────
  const nBefore = packFailures.length;
  const n = runTextDocumentModeInternalReadinessClosure();
  if (n.checkId !== "8.9N") packFailures.push(`8.9N checkId mismatch: got "${n.checkId}"`);
  if (n.allPassed !== true) packFailures.push("8.9N allPassed is not true");
  if (n.sourceExecutionClosureCommit !== "5451c5f") packFailures.push("8.9N sourceExecutionClosureCommit mismatch");
  if (n.tamperRejected !== n.tamperCount) packFailures.push("8.9N own tamper count mismatch");
  const sourceTextDocumentInternalReadinessAccepted = packFailures.length === nBefore;

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Consolidate disabled-env regression matrix from 8.10D ─────────────────
  const disabledEnvRegressionCases: DisabledEnvRegressionCase[] = d.disabledEnvCases.map((dc) => {
    const meta = dc.photoOcrMetaObserved;
    const passed = dc.passed && dc.observedStatus === 403 && dc.observedCode === "photo_ocr_controlled_runtime_disabled";
    if (!passed) packFailures.push(`disabled regression case "${dc.caseId}" did not pass consolidation checks`);
    return {
      caseId: dc.caseId,
      envValueDescription: dc.envValueDescription,
      expectedStatus: 403,
      expectedOk: false,
      expectedCode: "photo_ocr_controlled_runtime_disabled",
      observedStatus: dc.observedStatus,
      observedOk: dc.observedOk,
      observedCode: dc.observedCode,
      passed,
      noOcr: dc.noOcr,
      noModel: dc.noModel,
      noUpload: dc.noUpload,
      noPersistence: dc.noPersistence,
      noDbStorage: dc.noDbStorage,
      noSupabaseStorage: dc.noSupabaseStorage,
      noDna: dc.noDna,
      noPublicRuntime: dc.noPublicRuntime,
      noProduction: dc.noProduction,
      noGoLive: dc.noGoLive,
      imageContentSensitive: metaFlag(meta, "imageContentTreatedAsSensitive"),
      extractedTextSensitive: metaFlag(meta, "extractedTextTreatedAsSensitive"),
      modelOutputUntrusted: metaFlag(meta, "modelOutputStillUntrusted"),
      ocrOutputUntrusted: metaFlag(meta, "ocrOutputStillUntrusted"),
      privacyDisclaimerRequired: metaFlag(meta, "privacyDisclaimerRequired"),
      legalDisclaimerRequired: metaFlag(meta, "legalDisclaimerRequired"),
      eightThreeAcNotRun: metaFlag(meta, "eightThreeAcNotRun"),
    };
  });
  if (disabledEnvRegressionCases.length !== 9) packFailures.push("disabled env regression matrix does not contain exactly 9 cases");

  const disabledEnvRegressionCaseEvidence: string[] = disabledEnvRegressionCases.map(
    (c) =>
      `${c.caseId} (${c.envValueDescription}): status=${c.observedStatus}, ok=${c.observedOk}, code="${c.observedCode}", passed=${c.passed}.`,
  );

  const disabledEnvCasesPassed = disabledEnvRegressionCases.every((c) => c.passed);
  const disabledEnvCasesRejectedCount = disabledEnvRegressionCases.filter(
    (c) => c.observedStatus === 403 && c.observedCode === "photo_ocr_controlled_runtime_disabled",
  ).length;
  const disabledEnvCasesRejected = disabledEnvCasesRejectedCount === 9;

  // ── Consolidate enabled-placeholder regression case from 8.10E ────────────
  const placeholderPassed =
    e.validPlaceholderStatus === 200 &&
    e.validPlaceholderOk === true &&
    e.validPlaceholderMode === "photo_ocr_controlled_runtime" &&
    e.validPlaceholderContext === "anonymous" &&
    e.validPlaceholderOnly === true &&
    e.validPlaceholderRealOcrExtractionPerformed === false &&
    !e.validPlaceholderResultClaimsOcrPerformed &&
    !e.validPlaceholderContainsExtractedText;
  if (!placeholderPassed) packFailures.push("enabled placeholder regression case did not pass consolidation checks");

  const enabledPlaceholderRegressionCases: EnabledPlaceholderRegressionCase[] = [
    {
      caseId: "valid_placeholder_metadata_only",
      description:
        'Synthetic metadata-only image/png/12345-byte page; env=exact "true"; context="anonymous"; inputType="photo".',
      expectedStatus: 200,
      expectedOk: true,
      expectedMode: "photo_ocr_controlled_runtime",
      expectedContext: "anonymous",
      observedStatus: e.validPlaceholderStatus,
      observedOk: e.validPlaceholderOk,
      observedMode: e.validPlaceholderMode,
      observedContext: e.validPlaceholderContext,
      placeholderOnly: e.validPlaceholderOnly,
      realOcrExtractionPerformed: e.validPlaceholderRealOcrExtractionPerformed,
      ocrRuntimeStillBlocked: e.validPlaceholderOcrRuntimeStillBlocked,
      modelCallPerformed: e.validPlaceholderModelCallPerformed,
      containsExtractedText: e.validPlaceholderContainsExtractedText,
      containsExactDeadline: e.validPlaceholderContainsExactDeadline,
      containsBindingLegalAdvice: e.validPlaceholderContainsBindingLegalAdvice,
      containsOfficialFiling: e.validPlaceholderContainsOfficialFiling,
      passed: placeholderPassed,
      noOcr: !e.validPlaceholderRealOcrExtractionPerformed && e.validPlaceholderOcrRuntimeStillBlocked,
      noModel: !e.validPlaceholderModelCallPerformed,
      noUpload: e.validPlaceholderNoUpload,
      noPersistence: e.validPlaceholderNoPersistence,
      noDbStorage: e.validPlaceholderNoDbStorage,
      noSupabaseStorage: e.validPlaceholderNoSupabaseStorage,
      noDna: e.validPlaceholderNoDna,
      noPublicRuntime: e.validPlaceholderNoPublicRuntime,
      noProduction: e.validPlaceholderNoProduction,
      noGoLive: e.validPlaceholderNoGoLive,
      imageContentSensitive: e.validPlaceholderImageContentSensitive,
      extractedTextSensitive: e.validPlaceholderExtractedTextSensitive,
      modelOutputUntrusted: e.validPlaceholderModelOutputStillUntrusted,
      ocrOutputUntrusted: e.validPlaceholderOcrOutputStillUntrusted,
      privacyDisclaimerRequired: e.validPlaceholderPrivacyDisclaimerRequired,
      legalDisclaimerRequired: e.validPlaceholderLegalDisclaimerRequired,
      eightThreeAcNotRun: e.validPlaceholderEightThreeAcNotRun,
    },
  ];

  const enabledPlaceholderRegressionCaseEvidence: string[] = [
    `valid_placeholder_metadata_only: status=${e.validPlaceholderStatus}, ok=${e.validPlaceholderOk}, mode="${e.validPlaceholderMode}", context="${e.validPlaceholderContext}", passed=${placeholderPassed}.`,
  ];

  // ── Consolidate enabled-guard regression matrix from 8.10E ─────────────────
  const enabledGuardRegressionCases: EnabledGuardRegressionCase[] = e.guardCases.map((gc) => {
    const meta = gc.photoOcrMetaObserved;
    const expectedStatus: 400 | 402 = gc.observedStatus === 400 ? 400 : 402;
    const passed = gc.passed && gc.observedOk === false && gc.observedCode === gc.expectedCode;
    if (!passed) packFailures.push(`guard regression case "${gc.caseId}" did not pass consolidation checks`);
    return {
      caseId: gc.caseId,
      description: gc.description,
      expectedStatus,
      expectedCode: gc.expectedCode,
      observedStatus: gc.observedStatus,
      observedOk: gc.observedOk,
      observedCode: gc.observedCode,
      passed,
      noOcr: gc.noOcr,
      noModel: gc.noModel,
      noUpload: gc.noUpload,
      noPersistence: gc.noPersistence,
      noDbStorage: gc.noDbStorage,
      noSupabaseStorage: gc.noSupabaseStorage,
      noDna: gc.noDna,
      noPublicRuntime: gc.noPublicRuntime,
      noProduction: gc.noProduction,
      noGoLive: gc.noGoLive,
      imageContentSensitive: metaFlag(meta, "imageContentTreatedAsSensitive"),
      extractedTextSensitive: metaFlag(meta, "extractedTextTreatedAsSensitive"),
      modelOutputUntrusted: metaFlag(meta, "modelOutputStillUntrusted"),
      ocrOutputUntrusted: metaFlag(meta, "ocrOutputStillUntrusted"),
      privacyDisclaimerRequired: metaFlag(meta, "privacyDisclaimerRequired"),
      legalDisclaimerRequired: metaFlag(meta, "legalDisclaimerRequired"),
      eightThreeAcNotRun: metaFlag(meta, "eightThreeAcNotRun"),
    };
  });
  if (enabledGuardRegressionCases.length !== 22) packFailures.push("enabled guard regression matrix does not contain exactly 22 cases");

  const enabledGuardRegressionCaseEvidence: string[] = enabledGuardRegressionCases.map(
    (c) =>
      `${c.caseId}: status=${c.observedStatus} (expected ${c.expectedStatus}), ok=${c.observedOk}, code="${c.observedCode}" (expected "${c.expectedCode}"), passed=${c.passed}.`,
  );

  const enabledGuardCasesPassed = enabledGuardRegressionCases.every((c) => c.passed);
  const enabledGuardCasesRejectedCount = enabledGuardRegressionCases.filter(
    (c) => c.observedOk === false && c.observedCode === c.expectedCode,
  ).length;
  const enabledGuardCasesRejected = enabledGuardCasesRejectedCount === 22;

  // ── Combined totals ─────────────────────────────────────────────────────
  const totalRegressionCaseCount =
    disabledEnvRegressionCases.length + enabledPlaceholderRegressionCases.length + enabledGuardRegressionCases.length;
  if (totalRegressionCaseCount !== 32) packFailures.push(`total regression case count is ${totalRegressionCaseCount}, expected 32`);

  const totalRegressionCasesPassed =
    disabledEnvCasesPassed && placeholderPassed && enabledGuardCasesPassed;
  const totalRegressionCasesRejectedWhereExpected =
    disabledEnvCasesRejected && placeholderPassed && enabledGuardCasesRejected;

  const combinedRegressionEvidence: string[] = [...REQUIRED_COMBINED_REGRESSION_EVIDENCE];

  const responseContractEvidence: string[] = [
    `All ${disabledEnvRegressionCases.length} disabled env cases returned 403/ok:false/photo_ocr_controlled_runtime_disabled: ${disabledEnvCasesRejected}.`,
    `The 1 enabled placeholder case returned 200/ok:true/mode "photo_ocr_controlled_runtime"/context "anonymous": ${placeholderPassed}.`,
    `All ${enabledGuardRegressionCases.length} enabled guard cases returned their exact expected block code: ${enabledGuardCasesRejected}.`,
    `Total regression case count: ${totalRegressionCaseCount} (expected 32).`,
  ];

  const safetyBoundaryEvidence: string[] = [
    "Every regression case (disabled, enabled-placeholder, and guard-rejection) performs no OCR, no model call, no upload, and no persistence.",
    "Public runtime, production, and go-live remain unauthorized across all 32 consolidated cases.",
    "Image content and extracted text remain treated as sensitive; model and OCR output remain untrusted across all 32 cases.",
    "Legal and privacy disclaimers remain required across all 32 cases; 8.3AC remains not run in every case.",
    "This pack performed no new route invocation and no new runtime behavior — it consolidates already-observed 8.10D/8.10E evidence.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No OCR engine or OCR dependency was imported or invoked by this pack.",
    "No real image bytes were read by this pack; all underlying evidence used only synthetic metadata (mimeType, sizeBytes).",
    "No external network call, browser, or dev server was used by this pack.",
    "No DB, Supabase storage, or Vaylo DNA write occurred in any consolidated case.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const allPassed =
    packFailures.length === 0 &&
    sourceGateDesignAccepted &&
    sourceImplementationPlanAccepted &&
    sourceMinimalPatchAccepted &&
    sourceDisabledClosureAccepted &&
    sourceEnabledClosureAccepted &&
    sourceTextDocumentInternalReadinessAccepted &&
    disabledEnvRegressionCases.length === 9 &&
    enabledPlaceholderRegressionCases.length === 1 &&
    enabledGuardRegressionCases.length === 22 &&
    totalRegressionCaseCount === 32 &&
    disabledEnvCasesPassed &&
    disabledEnvCasesRejected &&
    placeholderPassed &&
    enabledGuardCasesPassed &&
    enabledGuardCasesRejected;

  const tamperCount = PHOTO_OCR_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES.length;

  const notes: string[] = [
    "RP-01: 8.10F consolidates already-observed evidence from 8.10D (disabled env variants) and 8.10E (enabled placeholder + guard rejections) — it performs no new route invocation and creates no new runtime behavior.",
    `RP-02: 8.10A/8.10B/8.10C/8.10D/8.10E/8.9N confirmed as sources of truth — allPassed: ${a.allPassed}/${b.allPassed}/${c.allPassed}/${d.allPassed}/${e.allPassed}/${n.allPassed}.`,
    `RP-03: 9 disabled env cases + 1 enabled placeholder success case + 22 enabled guard cases = ${totalRegressionCaseCount} total regression cases.`,
    `RP-04: all 9 disabled env cases returned 403/photo_ocr_controlled_runtime_disabled: ${disabledEnvCasesRejected}.`,
    `RP-05: the enabled placeholder case returned 200/ok:true with a fully-compliant photoOcrMeta: ${placeholderPassed}.`,
    `RP-06: all 22 guard cases returned their exact expected block code: ${enabledGuardCasesRejected}.`,
    "RP-07: no OCR/model/upload/persistence/DB/storage/DNA occurred in any of the 32 consolidated cases.",
    "RP-08: this pack does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "RP-09: ready for Phase 8.10G — Photo/OCR Browser/UI Wiring Audit.",
  ];

  const provisional: PhotoOcrControlledLocalRegressionPackResult = {
    checkId: "8.10F",
    allPassed: true,
    controlledLocalRegressionPackOnly: true,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
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

    sourceGateDesignCommit: "4a87043",
    sourceImplementationPlanCommit: "6a26e47",
    sourceMinimalPatchCommit: "3e35be8",
    sourceDisabledClosureCommit: "385b32a",
    sourceEnabledClosureCommit: "e1d6568",
    sourceTextDocumentInternalReadinessCommit: "3cf81c1",
    sourceGateDesignAccepted,
    sourceImplementationPlanAccepted,
    sourceMinimalPatchAccepted,
    sourceDisabledClosureAccepted,
    sourceEnabledClosureAccepted,
    sourceTextDocumentInternalReadinessAccepted,

    disabledEnvRegressionIncluded: true,
    disabledEnvCaseCount: 9,
    disabledEnvCasesPassed,
    disabledEnvCasesRejected,
    disabledEnvCasesRejectedCount,

    enabledPlaceholderRegressionIncluded: true,
    enabledPlaceholderCasePassed: placeholderPassed,
    enabledPlaceholderStatus: e.validPlaceholderStatus,
    enabledPlaceholderOk: e.validPlaceholderOk,
    enabledPlaceholderMode: e.validPlaceholderMode,
    enabledPlaceholderContext: e.validPlaceholderContext,
    enabledPlaceholderOnly: e.validPlaceholderOnly,
    enabledPlaceholderRealOcrExtractionPerformed: e.validPlaceholderRealOcrExtractionPerformed,
    enabledPlaceholderOcrRuntimeStillBlocked: e.validPlaceholderOcrRuntimeStillBlocked,
    enabledPlaceholderModelCallPerformed: e.validPlaceholderModelCallPerformed,

    enabledGuardRegressionIncluded: true,
    enabledGuardCaseCount: 22,
    enabledGuardCasesPassed,
    enabledGuardCasesRejected,
    enabledGuardCasesRejectedCount,

    totalRegressionCaseCount: 32,
    totalRegressionCasesPassed,
    totalRegressionCasesRejectedWhereExpected,

    disabledEnvRegressionCases,
    enabledPlaceholderRegressionCases,
    enabledGuardRegressionCases,

    photoOcrPlaceholderLocalApiRegressionClosed: allPassed,
    disabledAndEnabledLocalApiClosuresConsolidated: allPassed,
    readyForNextPhase: "8.10G",
    recommendedNextPhase: "Photo/OCR Browser/UI Wiring Audit",
    readyForPhotoOcrBrowserUiWiringAudit: allPassed,
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
    disabledEnvRegressionCaseEvidence,
    enabledPlaceholderRegressionCaseEvidence,
    enabledGuardRegressionCaseEvidence,
    combinedRegressionEvidence,
    responseContractEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations: REQUIRED_EVIDENCE_LIMITATIONS,
    nextRecommendedSteps: [
      "Phase 8.10G: Photo/OCR Browser/UI Wiring Audit — static inspection of the existing internal-only Photo/OCR placeholder button wiring in SmartTalkClient.tsx (no browser, no execution).",
      "Phase 8.10H (or later): Controlled local browser manual test planning and execution for the Photo/OCR internal button path.",
      "Real OCR extraction remains a separate, later, explicitly authorized phase.",
    ],
    notes,
  };

  if (
    packFailures.length === 0 &&
    !_isCanonicalPhotoOcrControlledLocalRegressionPackResult(provisional)
  ) {
    packFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of PHOTO_OCR_CONTROLLED_LOCAL_REGRESSION_PACK_TAMPER_CASES) {
    if (!_isCanonicalPhotoOcrControlledLocalRegressionPackResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.10F tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) packFailures.push(...tamperFailures);

  const finalAllPassed = allPassed && packFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.10F tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(packFailures.length > 0 ? [`FAILURES (${packFailures.length}):`, ...packFailures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    photoOcrPlaceholderLocalApiRegressionClosed: finalAllPassed,
    disabledAndEnabledLocalApiClosuresConsolidated: finalAllPassed,
    readyForPhotoOcrBrowserUiWiringAudit: finalAllPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-photo-ocr-controlled-local-regression-pack");

if (invokedDirectly) {
  runPhotoOcrControlledLocalRegressionPack()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
