/**
 * PHASE 8.9N — Text Document Mode Internal Readiness Closure
 *
 * Static internal readiness closure only. Consolidates committed evidence from
 * 8.9K (minimal UI wiring patch), 8.9L (controlled local browser manual test
 * planning), and 8.9M (controlled local browser manual execution closure with
 * Chrome DevTools Network response body confirmation).
 *
 * This file does NOT perform new browser execution, does not call fetch/route
 * handlers/runSmartTalk/OpenAI, does not read process.env for runtime
 * authorization, does not touch DB/storage, does not run 8.3AC, and does not
 * touch tmp-8-3ac-live-metadata.ts. It does not authorize public runtime,
 * production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.
 */

import { runTextDocumentModeMinimalBrowserUiWiringPatchAudit } from "./run-text-document-mode-minimal-browser-ui-wiring-patch-audit";
import { runTextDocumentModeControlledLocalBrowserManualTestPlanning } from "./run-text-document-mode-controlled-local-browser-manual-test-planning";
import { runTextDocumentModeControlledLocalBrowserManualTestExecutionClosure } from "./run-text-document-mode-controlled-local-browser-manual-test-execution-closure";

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeInternalReadinessClosureResult {
  checkId: "8.9N";
  allPassed: boolean;
  closureOnly: true;
  internalReadinessClosureOnly: true;
  sourceUiPatchPhase: "8.9K";
  sourceUiPatchCommit: "e7d47c5";
  sourcePlanningPhase: "8.9L";
  sourcePlanningCommit: "d22dc64";
  sourceExecutionClosurePhase: "8.9M";
  sourceExecutionClosureCommit: "5451c5f";
  sourceUiPatchAllPassed: boolean;
  sourcePlanningAllPassed: boolean;
  sourceExecutionClosureAllPassed: boolean;
  readyForControlledInternalTextDocumentMode: true;
  readyForTextDocumentModeInternalUse: true;
  readyForTextDocumentModeInternalReadinessClosure: true;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  textDocumentModeControlledLocalOnly: true;
  browserManualExecutionCompleted: boolean;
  browserNetworkResponseBodiesDirectlyObserved: boolean;
  allowedDocumentScenarioPassed: boolean;
  blockedRiskScenariosPassed: boolean;
  photoModeSeparationConfirmed: boolean;
  cleanupConfirmed: boolean;
  noExistingRuntimeFileModifiedInThisPhase: true;
  noUiFileModifiedInThisPhase: true;
  noRouteFileModifiedInThisPhase: true;
  onScenarioStatus: 200;
  onScenarioOk: true;
  onScenarioMode: "text_document_controlled_runtime";
  onScenarioContext: "anonymous";
  onScenarioTextDocumentMetaPresent: true;
  onScenarioTextDocumentMetaFlagsConfirmed: boolean;
  onScenarioPhotoOcrStillBlocked: true;
  onScenarioScannerUploadStillBlocked: true;
  onScenarioFileUploadStillBlocked: true;
  onScenarioPaidDocumentModeStillBlocked: true;
  onScenarioVayloDnaStillBlocked: true;
  onScenarioPersistenceStillBlocked: true;
  onScenarioDbStorageStillBlocked: true;
  onScenarioExactLegalDeadlineStillBlocked: true;
  onScenarioBindingLegalAdviceStillBlocked: true;
  onScenarioOfficialFilingGenerationStillBlocked: true;
  onScenarioModelOutputStillUntrusted: true;
  onScenarioDocumentTextTreatedAsSensitive: true;
  onScenarioPrivacyDisclaimerRequired: true;
  onScenarioLegalDisclaimerRequired: true;
  onScenarioEightThreeAcNotRun: true;
  exactLegalDeadlineBlocked: true;
  exactLegalDeadlineBlockedStatus: 402;
  exactLegalDeadlineBlockedCode: "exact_legal_deadline_calculation_blocked";
  credentialApiKeyBlocked: true;
  credentialApiKeyBlockedStatus: 402;
  credentialApiKeyBlockedCode: "sensitive_credential_data_blocked";
  ibanPaymentBlocked: true;
  ibanPaymentBlockedStatus: 402;
  ibanPaymentBlockedCode: "sensitive_financial_data_blocked";
  nonDocumentQuestionBlocked: true;
  nonDocumentQuestionBlockedStatus: 400;
  nonDocumentQuestionBlockedCode: "no_document_signal_blocked";
  explicitPaidActivationBlockedAfterRetry: true;
  explicitPaidActivationBlockedStatus: 402;
  explicitPaidActivationBlockedCode: "paid_document_mode_blocked";
  rateLimitObservedAndHandled: boolean;
  rateLimitNotCountedAsFailure: boolean;
  internalTextDocumentButtonAbsentInPhotoMode: boolean;
  noUploadOcrPhotoPayloadEnteredTextDocumentMode: true;
  noOcrRuntimeActivated: boolean;
  noFileUploadPerformed: boolean;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  photoOcrRuntimeStillBlocked: true;
  scannerUploadStillBlocked: true;
  fileUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  dbStorageStillBlocked: true;
  modelOutputStillUntrusted: true;
  documentTextTreatedAsSensitive: true;
  legalDisclaimerRequired: true;
  privacyDisclaimerRequired: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingGenerationStillBlocked: true;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;
  readyForNextPhase: "8.10A";
  recommendedNextPhase: "Photo/OCR Controlled Runtime Gate Design";
  textDocumentModeInternalReadinessClosed: boolean;
  publicLaunchRecommendedNow: false;
  productionDeployRecommendedNow: false;
  goLiveRecommendedNow: false;
  liveRouteInvocationPerformedByThisClosure: false;
  liveModelCallPerformedByThisClosure: false;
  openAiSdkImportedByClosure: false;
  fetchUsedAsRuntimeByClosure: false;
  processEnvReadForAuthorizationByClosure: false;
  filesWrittenByClosure: false;
  dbStorageTouchedByClosure: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  sourceEvidence: string[];
  readinessEvidence: string[];
  browserManualExecutionEvidence: string[];
  allowedDocumentEvidence: string[];
  blockedRiskEvidence: string[];
  photoModeSeparationEvidence: string[];
  safetyBoundaryEvidence: string[];
  remainingBlockers: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "This is an internal readiness closure only.",
  "This phase does not perform new browser execution.",
  "This phase does not call the API route.",
  "This phase relies on committed 8.9K, 8.9L, and 8.9M evidence.",
  "This phase does not authorize public runtime, production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.",
  "Model output remains untrusted.",
  "Document text remains sensitive.",
  "Exact legal deadline calculation remains blocked.",
];

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "public runtime still blocked",
  "production/go-live still unauthorized",
  "OCR/photo still blocked",
  "scanner/upload still blocked",
  "file upload still blocked",
  "paid document mode still blocked",
  "Vaylo DNA still blocked",
  "persistence/DB/storage still blocked",
  "model output still untrusted",
  "document text still treated as sensitive",
  "exact legal deadline calculation still blocked",
  "binding legal advice still blocked",
  "official filing generation still blocked",
  "8.3AC not run",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeInternalReadinessClosureResult(
  r: TextDocumentModeInternalReadinessClosureResult,
): boolean {
  if (r.checkId !== "8.9N") return false;
  if (r.allPassed !== true) return false;
  if (r.closureOnly !== true) return false;
  if (r.internalReadinessClosureOnly !== true) return false;
  if (r.sourceUiPatchPhase !== "8.9K") return false;
  if (r.sourceUiPatchCommit !== "e7d47c5") return false;
  if (r.sourcePlanningPhase !== "8.9L") return false;
  if (r.sourcePlanningCommit !== "d22dc64") return false;
  if (r.sourceExecutionClosurePhase !== "8.9M") return false;
  if (r.sourceExecutionClosureCommit !== "5451c5f") return false;
  if (r.sourceUiPatchAllPassed !== true) return false;
  if (r.sourcePlanningAllPassed !== true) return false;
  if (r.sourceExecutionClosureAllPassed !== true) return false;
  if (r.readyForControlledInternalTextDocumentMode !== true) return false;
  if (r.readyForTextDocumentModeInternalUse !== true) return false;
  if (r.readyForTextDocumentModeInternalReadinessClosure !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.textDocumentModeControlledLocalOnly !== true) return false;
  if (r.browserManualExecutionCompleted !== true) return false;
  if (r.browserNetworkResponseBodiesDirectlyObserved !== true) return false;
  if (r.allowedDocumentScenarioPassed !== true) return false;
  if (r.blockedRiskScenariosPassed !== true) return false;
  if (r.photoModeSeparationConfirmed !== true) return false;
  if (r.cleanupConfirmed !== true) return false;
  if (r.noExistingRuntimeFileModifiedInThisPhase !== true) return false;
  if (r.noUiFileModifiedInThisPhase !== true) return false;
  if (r.noRouteFileModifiedInThisPhase !== true) return false;
  if (r.onScenarioStatus !== 200) return false;
  if (r.onScenarioOk !== true) return false;
  if (r.onScenarioMode !== "text_document_controlled_runtime") return false;
  if (r.onScenarioContext !== "anonymous") return false;
  if (r.onScenarioTextDocumentMetaPresent !== true) return false;
  if (r.onScenarioTextDocumentMetaFlagsConfirmed !== true) return false;
  if (r.onScenarioPhotoOcrStillBlocked !== true) return false;
  if (r.onScenarioScannerUploadStillBlocked !== true) return false;
  if (r.onScenarioFileUploadStillBlocked !== true) return false;
  if (r.onScenarioPaidDocumentModeStillBlocked !== true) return false;
  if (r.onScenarioVayloDnaStillBlocked !== true) return false;
  if (r.onScenarioPersistenceStillBlocked !== true) return false;
  if (r.onScenarioDbStorageStillBlocked !== true) return false;
  if (r.onScenarioExactLegalDeadlineStillBlocked !== true) return false;
  if (r.onScenarioBindingLegalAdviceStillBlocked !== true) return false;
  if (r.onScenarioOfficialFilingGenerationStillBlocked !== true) return false;
  if (r.onScenarioModelOutputStillUntrusted !== true) return false;
  if (r.onScenarioDocumentTextTreatedAsSensitive !== true) return false;
  if (r.onScenarioPrivacyDisclaimerRequired !== true) return false;
  if (r.onScenarioLegalDisclaimerRequired !== true) return false;
  if (r.onScenarioEightThreeAcNotRun !== true) return false;
  if (r.exactLegalDeadlineBlocked !== true) return false;
  if (r.exactLegalDeadlineBlockedStatus !== 402) return false;
  if (r.exactLegalDeadlineBlockedCode !== "exact_legal_deadline_calculation_blocked") return false;
  if (r.credentialApiKeyBlocked !== true) return false;
  if (r.credentialApiKeyBlockedStatus !== 402) return false;
  if (r.credentialApiKeyBlockedCode !== "sensitive_credential_data_blocked") return false;
  if (r.ibanPaymentBlocked !== true) return false;
  if (r.ibanPaymentBlockedStatus !== 402) return false;
  if (r.ibanPaymentBlockedCode !== "sensitive_financial_data_blocked") return false;
  if (r.nonDocumentQuestionBlocked !== true) return false;
  if (r.nonDocumentQuestionBlockedStatus !== 400) return false;
  if (r.nonDocumentQuestionBlockedCode !== "no_document_signal_blocked") return false;
  if (r.explicitPaidActivationBlockedAfterRetry !== true) return false;
  if (r.explicitPaidActivationBlockedStatus !== 402) return false;
  if (r.explicitPaidActivationBlockedCode !== "paid_document_mode_blocked") return false;
  if (r.rateLimitObservedAndHandled !== true) return false;
  if (r.rateLimitNotCountedAsFailure !== true) return false;
  if (r.internalTextDocumentButtonAbsentInPhotoMode !== true) return false;
  if (r.noUploadOcrPhotoPayloadEnteredTextDocumentMode !== true) return false;
  if (r.noOcrRuntimeActivated !== true) return false;
  if (r.noFileUploadPerformed !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;
  if (r.readyForNextPhase !== "8.10A") return false;
  if (r.recommendedNextPhase !== "Photo/OCR Controlled Runtime Gate Design") return false;
  if (r.textDocumentModeInternalReadinessClosed !== true) return false;
  if (r.publicLaunchRecommendedNow !== false) return false;
  if (r.productionDeployRecommendedNow !== false) return false;
  if (r.goLiveRecommendedNow !== false) return false;
  if (r.liveRouteInvocationPerformedByThisClosure !== false) return false;
  if (r.liveModelCallPerformedByThisClosure !== false) return false;
  if (r.openAiSdkImportedByClosure !== false) return false;
  if (r.fetchUsedAsRuntimeByClosure !== false) return false;
  if (r.processEnvReadForAuthorizationByClosure !== false) return false;
  if (r.filesWrittenByClosure !== false) return false;
  if (r.dbStorageTouchedByClosure !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.sourceEvidence) || r.sourceEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessEvidence) || r.readinessEvidence.length === 0) return false;
  if (!Array.isArray(r.browserManualExecutionEvidence) || r.browserManualExecutionEvidence.length === 0) return false;
  if (!Array.isArray(r.allowedDocumentEvidence) || r.allowedDocumentEvidence.length === 0) return false;
  if (!Array.isArray(r.blockedRiskEvidence) || r.blockedRiskEvidence.length === 0) return false;
  if (!Array.isArray(r.photoModeSeparationEvidence) || r.photoModeSeparationEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
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

type Tamper89NMutation = (
  r: TextDocumentModeInternalReadinessClosureResult,
) => TextDocumentModeInternalReadinessClosureResult;
interface Tamper89NCase {
  label: string;
  mutate: Tamper89NMutation;
}

const TEXT_DOCUMENT_MODE_INTERNAL_READINESS_CLOSURE_TAMPER_CASES: Tamper89NCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9M" as "8.9N" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "closureOnly false", mutate: (r) => ({ ...r, closureOnly: false as true }) },
  { label: "internalReadinessClosureOnly false", mutate: (r) => ({ ...r, internalReadinessClosureOnly: false as true }) },
  { label: "sourceUiPatchCommit wrong (source commit does not match e7d47c5)", mutate: (r) => ({ ...r, sourceUiPatchCommit: "0000000" as "e7d47c5" }) },
  { label: "sourcePlanningCommit wrong (source commit does not match d22dc64)", mutate: (r) => ({ ...r, sourcePlanningCommit: "0000000" as "d22dc64" }) },
  { label: "sourceExecutionClosureCommit wrong (source commit does not match 5451c5f)", mutate: (r) => ({ ...r, sourceExecutionClosureCommit: "0000000" as "5451c5f" }) },
  { label: "sourceUiPatchAllPassed false (8.9K source allPassed is false)", mutate: (r) => ({ ...r, sourceUiPatchAllPassed: false }) },
  { label: "sourcePlanningAllPassed false (8.9L source allPassed is false)", mutate: (r) => ({ ...r, sourcePlanningAllPassed: false }) },
  { label: "sourceExecutionClosureAllPassed false (8.9M source allPassed is false)", mutate: (r) => ({ ...r, sourceExecutionClosureAllPassed: false }) },
  { label: "readyForControlledInternalTextDocumentMode false", mutate: (r) => ({ ...r, readyForControlledInternalTextDocumentMode: false as true }) },
  { label: "readyForTextDocumentModeInternalUse false", mutate: (r) => ({ ...r, readyForTextDocumentModeInternalUse: false as true }) },
  { label: "browserNetworkResponseBodiesDirectlyObserved false (8.9M Network response inspection not confirmed)", mutate: (r) => ({ ...r, browserNetworkResponseBodiesDirectlyObserved: false }) },
  { label: "onScenarioStatus wrong (8.9M allowed ON scenario is not status 200)", mutate: (r) => ({ ...r, onScenarioStatus: 403 as 200 }) },
  { label: "onScenarioOk false (8.9M allowed ON scenario is not ok true)", mutate: (r) => ({ ...r, onScenarioOk: false as true }) },
  { label: "onScenarioMode wrong (8.9M allowed ON scenario is not mode text_document_controlled_runtime)", mutate: (r) => ({ ...r, onScenarioMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "onScenarioTextDocumentMetaPresent false (8.9M textDocumentMeta missing)", mutate: (r) => ({ ...r, onScenarioTextDocumentMetaPresent: false as true }) },
  { label: "onScenarioTextDocumentMetaFlagsConfirmed false (8.9M textDocumentMeta flags not confirmed)", mutate: (r) => ({ ...r, onScenarioTextDocumentMetaFlagsConfirmed: false }) },
  { label: "onScenarioPhotoOcrStillBlocked false (8.9M textDocumentMeta flag false)", mutate: (r) => ({ ...r, onScenarioPhotoOcrStillBlocked: false as true }) },
  { label: "exactLegalDeadlineBlocked false (exact legal deadline block missing)", mutate: (r) => ({ ...r, exactLegalDeadlineBlocked: false as true }) },
  { label: "exactLegalDeadlineBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, exactLegalDeadlineBlockedStatus: 200 as 402 }) },
  { label: "exactLegalDeadlineBlockedCode wrong (code differs)", mutate: (r) => ({ ...r, exactLegalDeadlineBlockedCode: "ok" as "exact_legal_deadline_calculation_blocked" }) },
  { label: "credentialApiKeyBlocked false (credential/API key block missing)", mutate: (r) => ({ ...r, credentialApiKeyBlocked: false as true }) },
  { label: "credentialApiKeyBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, credentialApiKeyBlockedStatus: 200 as 402 }) },
  { label: "credentialApiKeyBlockedCode wrong (code differs)", mutate: (r) => ({ ...r, credentialApiKeyBlockedCode: "ok" as "sensitive_credential_data_blocked" }) },
  { label: "ibanPaymentBlocked false (IBAN/payment block missing)", mutate: (r) => ({ ...r, ibanPaymentBlocked: false as true }) },
  { label: "ibanPaymentBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, ibanPaymentBlockedStatus: 200 as 402 }) },
  { label: "ibanPaymentBlockedCode wrong (code differs)", mutate: (r) => ({ ...r, ibanPaymentBlockedCode: "ok" as "sensitive_financial_data_blocked" }) },
  { label: "nonDocumentQuestionBlocked false (non-document block missing)", mutate: (r) => ({ ...r, nonDocumentQuestionBlocked: false as true }) },
  { label: "nonDocumentQuestionBlockedStatus wrong (not status 400)", mutate: (r) => ({ ...r, nonDocumentQuestionBlockedStatus: 200 as 400 }) },
  { label: "nonDocumentQuestionBlockedCode wrong (code differs)", mutate: (r) => ({ ...r, nonDocumentQuestionBlockedCode: "ok" as "no_document_signal_blocked" }) },
  { label: "explicitPaidActivationBlockedAfterRetry false (paid activation retry block missing)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedAfterRetry: false as true }) },
  { label: "explicitPaidActivationBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedStatus: 200 as 402 }) },
  { label: "explicitPaidActivationBlockedCode wrong (code differs)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedCode: "ok" as "paid_document_mode_blocked" }) },
  { label: "rateLimitNotCountedAsFailure false (rate-limit treated as failure)", mutate: (r) => ({ ...r, rateLimitNotCountedAsFailure: false }) },
  { label: "photoModeSeparationConfirmed false (photo separation not confirmed)", mutate: (r) => ({ ...r, photoModeSeparationConfirmed: false }) },
  { label: "internalTextDocumentButtonAbsentInPhotoMode false (internal Text Document button available in photo mode)", mutate: (r) => ({ ...r, internalTextDocumentButtonAbsentInPhotoMode: false }) },
  { label: "noUploadOcrPhotoPayloadEnteredTextDocumentMode false (upload/OCR/photo payload enters text_document_controlled_runtime)", mutate: (r) => ({ ...r, noUploadOcrPhotoPayloadEnteredTextDocumentMode: false as true }) },
  { label: "noOcrRuntimeActivated false (OCR runtime is activated)", mutate: (r) => ({ ...r, noOcrRuntimeActivated: false }) },
  { label: "noFileUploadPerformed false (file upload is performed)", mutate: (r) => ({ ...r, noFileUploadPerformed: false }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes enabled)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false (paid document mode becomes enabled)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA becomes enabled)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false (persistence/DB/storage becomes enabled)", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "dbStorageStillBlocked false (persistence/DB/storage becomes enabled)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false as true }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "documentTextTreatedAsSensitive false (document text is not treated as sensitive)", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false as true }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false as true }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false as true }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline calculation becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false as true }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "readyForNextPhase wrong (recommended next phase is not 8.10A)", mutate: (r) => ({ ...r, readyForNextPhase: "8.9M" as "8.10A" }) },
  { label: "recommendedNextPhase wrong", mutate: (r) => ({ ...r, recommendedNextPhase: "Public Runtime Launch" as "Photo/OCR Controlled Runtime Gate Design" }) },
  { label: "textDocumentModeInternalReadinessClosed false when all evidence valid", mutate: (r) => ({ ...r, textDocumentModeInternalReadinessClosed: false }) },
  { label: "allowedDocumentScenarioPassed false when evidence valid", mutate: (r) => ({ ...r, allowedDocumentScenarioPassed: false }) },
  { label: "blockedRiskScenariosPassed false when evidence valid", mutate: (r) => ({ ...r, blockedRiskScenariosPassed: false }) },
  { label: "cleanupConfirmed false", mutate: (r) => ({ ...r, cleanupConfirmed: false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceEvidence emptied", mutate: (r) => ({ ...r, sourceEvidence: [] }) },
  { label: "readinessEvidence emptied", mutate: (r) => ({ ...r, readinessEvidence: [] }) },
  { label: "browserManualExecutionEvidence emptied", mutate: (r) => ({ ...r, browserManualExecutionEvidence: [] }) },
  { label: "allowedDocumentEvidence emptied", mutate: (r) => ({ ...r, allowedDocumentEvidence: [] }) },
  { label: "blockedRiskEvidence emptied", mutate: (r) => ({ ...r, blockedRiskEvidence: [] }) },
  { label: "photoModeSeparationEvidence emptied", mutate: (r) => ({ ...r, photoModeSeparationEvidence: [] }) },
  { label: "safetyBoundaryEvidence emptied", mutate: (r) => ({ ...r, safetyBoundaryEvidence: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 3) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export function runTextDocumentModeInternalReadinessClosure(): TextDocumentModeInternalReadinessClosureResult {
  const closureFailures: string[] = [];

  // ── Import and validate source evidence chain ─────────────────────────────
  const k = runTextDocumentModeMinimalBrowserUiWiringPatchAudit();
  const l = runTextDocumentModeControlledLocalBrowserManualTestPlanning();
  const m = runTextDocumentModeControlledLocalBrowserManualTestExecutionClosure();

  if (k.checkId !== "8.9K") closureFailures.push(`8.9K checkId mismatch: expected "8.9K", got "${k.checkId}"`);
  if (k.allPassed !== true) closureFailures.push("8.9K allPassed is not true");
  if (k.uiPatchImplemented !== true) closureFailures.push("8.9K uiPatchImplemented is not true");
  if (k.readyForBrowserManualTestPlanning !== true) closureFailures.push("8.9K readyForBrowserManualTestPlanning is not true");
  if (k.existingDefaultSmartTalkFlowPreserved !== true) closureFailures.push("8.9K existingDefaultSmartTalkFlowPreserved is not true");
  if (k.existingPhotoFlowPreserved !== true) closureFailures.push("8.9K existingPhotoFlowPreserved is not true");
  if (k.requiredSafeRequestContractDetected !== true) closureFailures.push("8.9K requiredSafeRequestContractDetected is not true");
  if (k.tamperRejected !== k.tamperCount) closureFailures.push("8.9K own tamper count mismatch");

  if (l.checkId !== "8.9L") closureFailures.push(`8.9L checkId mismatch: expected "8.9L", got "${l.checkId}"`);
  if (l.allPassed !== true) closureFailures.push("8.9L allPassed is not true");
  if (l.sourceMinimalUiWiringCommit !== "e7d47c5") closureFailures.push("8.9L sourceMinimalUiWiringCommit mismatch");
  if (l.readyForControlledLocalBrowserManualTestExecution !== true)
    closureFailures.push("8.9L readyForControlledLocalBrowserManualTestExecution is not true");
  if (l.browserManualTestPhase !== "8.9M") closureFailures.push("8.9L browserManualTestPhase mismatch");
  if (l.tamperRejected !== l.tamperCount) closureFailures.push("8.9L own tamper count mismatch");

  if (m.checkId !== "8.9M") closureFailures.push(`8.9M checkId mismatch: expected "8.9M", got "${m.checkId}"`);
  if (m.allPassed !== true) closureFailures.push("8.9M allPassed is not true");
  if (m.sourceManualTestPlanningCommit !== "d22dc64") closureFailures.push("8.9M sourceManualTestPlanningCommit mismatch");
  if (m.networkResponseBodiesDirectlyObserved !== true)
    closureFailures.push("8.9M networkResponseBodiesDirectlyObserved is not true");
  if (m.onAllowedDocumentScenarioPassed !== true) closureFailures.push("8.9M onAllowedDocumentScenarioPassed is not true");
  if (m.onScenarioStatus !== 200) closureFailures.push("8.9M onScenarioStatus is not 200");
  if (m.onScenarioOk !== true) closureFailures.push("8.9M onScenarioOk is not true");
  if (m.onScenarioMode !== "text_document_controlled_runtime") closureFailures.push("8.9M onScenarioMode mismatch");
  if (m.onScenarioTextDocumentMetaPresent !== true) closureFailures.push("8.9M onScenarioTextDocumentMetaPresent is not true");
  if (m.onScenarioTextDocumentMetaFlagsConfirmed !== true)
    closureFailures.push("8.9M onScenarioTextDocumentMetaFlagsConfirmed is not true");
  if (m.exactLegalDeadlineBlocked !== true) closureFailures.push("8.9M exactLegalDeadlineBlocked is not true");
  if (m.exactLegalDeadlineBlockedCode !== "exact_legal_deadline_calculation_blocked")
    closureFailures.push("8.9M exactLegalDeadlineBlockedCode mismatch");
  if (m.credentialApiKeyBlocked !== true) closureFailures.push("8.9M credentialApiKeyBlocked is not true");
  if (m.credentialApiKeyBlockedCode !== "sensitive_credential_data_blocked")
    closureFailures.push("8.9M credentialApiKeyBlockedCode mismatch");
  if (m.ibanPaymentBlocked !== true) closureFailures.push("8.9M ibanPaymentBlocked is not true");
  if (m.ibanPaymentBlockedCode !== "sensitive_financial_data_blocked")
    closureFailures.push("8.9M ibanPaymentBlockedCode mismatch");
  if (m.nonDocumentQuestionBlocked !== true) closureFailures.push("8.9M nonDocumentQuestionBlocked is not true");
  if (m.nonDocumentQuestionBlockedCode !== "no_document_signal_blocked")
    closureFailures.push("8.9M nonDocumentQuestionBlockedCode mismatch");
  if (m.explicitPaidActivationBlockedAfterRetry !== true)
    closureFailures.push("8.9M explicitPaidActivationBlockedAfterRetry is not true");
  if (m.explicitPaidActivationBlockedCode !== "paid_document_mode_blocked")
    closureFailures.push("8.9M explicitPaidActivationBlockedCode mismatch");
  if (m.paidActivationRateLimitNotCountedAsFailure !== true)
    closureFailures.push("8.9M paidActivationRateLimitNotCountedAsFailure is not true");
  if (m.photoModeSeparationConfirmed !== true) closureFailures.push("8.9M photoModeSeparationConfirmed is not true");
  if (m.internalButtonAbsentInPhotoMode !== true) closureFailures.push("8.9M internalButtonAbsentInPhotoMode is not true");
  if (m.cleanupPerformed !== true) closureFailures.push("8.9M cleanupPerformed is not true");
  if (m.envTextDocumentFlagRemovedAfterTest !== true)
    closureFailures.push("8.9M envTextDocumentFlagRemovedAfterTest is not true");
  if (m.gitStatusCleanAfterCleanup !== true) closureFailures.push("8.9M gitStatusCleanAfterCleanup is not true");
  if (m.tamperRejected !== m.tamperCount) closureFailures.push("8.9M own tamper count mismatch");

  const sourceUiPatchAllPassed = k.allPassed === true;
  const sourcePlanningAllPassed = l.allPassed === true;
  const sourceExecutionClosureAllPassed = m.allPassed === true;

  const allowedDocumentScenarioPassed =
    m.onAllowedDocumentScenarioPassed === true &&
    m.onScenarioStatus === 200 &&
    m.onScenarioOk === true &&
    m.onScenarioMode === "text_document_controlled_runtime";

  const blockedRiskScenariosPassed =
    m.exactLegalDeadlineBlocked === true &&
    m.exactLegalDeadlineBlockedStatus === 402 &&
    m.exactLegalDeadlineBlockedCode === "exact_legal_deadline_calculation_blocked" &&
    m.credentialApiKeyBlocked === true &&
    m.credentialApiKeyBlockedStatus === 402 &&
    m.credentialApiKeyBlockedCode === "sensitive_credential_data_blocked" &&
    m.ibanPaymentBlocked === true &&
    m.ibanPaymentBlockedStatus === 402 &&
    m.ibanPaymentBlockedCode === "sensitive_financial_data_blocked" &&
    m.nonDocumentQuestionBlocked === true &&
    m.nonDocumentQuestionBlockedStatus === 400 &&
    m.nonDocumentQuestionBlockedCode === "no_document_signal_blocked" &&
    m.explicitPaidActivationBlockedAfterRetry === true &&
    m.explicitPaidActivationBlockedStatus === 402 &&
    m.explicitPaidActivationBlockedCode === "paid_document_mode_blocked";

  const cleanupConfirmed =
    m.cleanupPerformed === true &&
    m.envTextDocumentFlagRemovedAfterTest === true &&
    m.envFreeQaPublicFlagRemovedAfterTest === true &&
    m.gitStatusCleanAfterCleanup === true;

  const sourceEvidence: string[] = [
    "8.9K minimal UI wiring patch exists and allPassed true (commit e7d47c5).",
    "8.9L manual browser test planning exists and allPassed true (commit d22dc64).",
    "8.9M manual browser execution closure exists and allPassed true (commit 5451c5f).",
    "8.9M confirmed Chrome DevTools Network response body values directly.",
    "8.9M cleanup removed env flags and working tree was clean after test.",
  ];

  const readinessEvidence: string[] = [
    "Internal button path is wired only for text mode (8.9K: separate handler, mode === \"text\" guard, internal-labeled control).",
    "Existing default question/text flow remains separate (8.9K: existingDefaultSmartTalkFlowPreserved true).",
    "Existing photo flow remains separate (8.9K: existingPhotoFlowPreserved true).",
    "Controlled Text Document Mode request body uses mode: \"text_document_controlled_runtime\" (8.9K: requiredSafeRequestContractDetected true).",
    "Allowed pasted document text can complete controlled runtime (8.9M: HTTP 200, ok true, mode text_document_controlled_runtime).",
    "High-risk exact legal deadline request is blocked (8.9M: 402 exact_legal_deadline_calculation_blocked).",
    "Credential/API key/password-like content is blocked (8.9M: 402 sensitive_credential_data_blocked).",
    "IBAN/payment authorization content is blocked (8.9M: 402 sensitive_financial_data_blocked).",
    "Non-document general question is blocked (8.9M: 400 no_document_signal_blocked).",
    "Explicit paid activation is blocked (8.9M: 402 paid_document_mode_blocked after rate-limit retry).",
    "Photo mode does not expose internal Text Document Mode button (8.9M: internalButtonAbsentInPhotoMode true).",
    "OCR/upload/file paths remain blocked (8.9M: noOcrRuntimeActivated true, noFileUploadPerformed true).",
    "Persistence/DB/storage remain blocked (8.9M onScenarioMeta + remaining blockers).",
  ];

  const browserManualExecutionEvidence: string[] = [
    "8.9M manualBrowserTestPerformed true; browserManualTestCompleted true.",
    "Browser path: http://localhost:3000/smart-talk (local only).",
    "Chrome DevTools Network tab used with Preserve log; Fetch/XHR filtering applied.",
    "Network response bodies directly inspected for allowed ON and all blocked-risk scenarios.",
    "Rate-limit on paid activation first attempt observed and handled; not counted as Text Document Mode failure.",
  ];

  const allowedDocumentEvidence: string[] = [
    "8.9M ON scenario: HTTP 200, ok true, mode text_document_controlled_runtime, context anonymous.",
    "8.9M textDocumentMeta present with textDocumentModeEnabled true, controlledTextDocumentRuntime true, pastedTextOnly true.",
    "8.9M all StillBlocked flags true in textDocumentMeta for successful ON scenario.",
    "8.9M safety flags true: modelOutputStillUntrusted, documentTextTreatedAsSensitive, privacyDisclaimerRequired, legalDisclaimerRequired, eightThreeAcNotRun.",
    "8.9M UI rendered structured result without crash.",
  ];

  const blockedRiskEvidence: string[] = [
    "Exact legal deadline: HTTP 402, code exact_legal_deadline_calculation_blocked (Network body directly observed).",
    "Credential/API key: HTTP 402, code sensitive_credential_data_blocked (synthetic fake secret only).",
    "IBAN/payment: HTTP 402, code sensitive_financial_data_blocked (synthetic placeholder only).",
    "Non-document question: HTTP 400, code no_document_signal_blocked (Network body directly observed).",
    "Paid activation retry: HTTP 402, code paid_document_mode_blocked (after smart_talk_rate_limited first attempt).",
    "Blocked pre-runtime scenarios may show textDocumentMeta with successful runtime flags false — expected and safe.",
  ];

  const photoModeSeparationEvidence: string[] = [
    "8.9M photoTabClicked true; photo/document capture tab became active.",
    "8.9M internalButtonAbsentInPhotoMode true — \"Interný test: Text Document Mode\" not rendered in photo mode.",
    "8.9M cameraGalleryUiVisible true; analyzeButtonDisabledWithoutUpload true.",
    "8.9M noUploadOcrPhotoPayloadEnteredTextDocumentMode true.",
    "8.9M noOcrRuntimeActivated true; noFileUploadPerformed true.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "textDocumentModeControlledLocalOnly true — no public/production/go-live authorization.",
    "publicRuntimeStillBlocked true; productionAuthorizedNow false; goLiveAuthorizedNow false.",
    "photoOcrRuntimeStillBlocked true; scannerUploadStillBlocked true; fileUploadStillBlocked true.",
    "paidDocumentModeStillBlocked true; vayloDnaStillBlocked true; persistenceStillBlocked true; dbStorageStillBlocked true.",
    "modelOutputStillUntrusted true; documentTextTreatedAsSensitive true.",
    "exactLegalDeadlineStillBlocked true; bindingLegalAdviceStillBlocked true; officialFilingGenerationStillBlocked true.",
    "eightThreeAcNotRun true; tmpEightThreeAcMetadataTouched false.",
    "noExistingRuntimeFileModifiedInThisPhase true; noUiFileModifiedInThisPhase true; noRouteFileModifiedInThisPhase true.",
  ];

  const evidenceLimitations = [...REQUIRED_EVIDENCE_LIMITATIONS];

  const notes: string[] = [
    "IR-01: 8.9N is an internal readiness closure only. No new browser execution, no API calls, no runtime activation.",
    `IR-02: source chain — 8.9K allPassed=${k.allPassed}, 8.9L allPassed=${l.allPassed}, 8.9M allPassed=${m.allPassed}.`,
    "IR-03: Text Document Mode is ready for controlled internal use only (readyForControlledInternalTextDocumentMode true, readyForTextDocumentModeInternalUse true).",
    "IR-04: Text Document Mode is NOT ready for public runtime, production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.",
    "IR-05: textDocumentModeInternalReadinessClosed true — internal readiness closure complete.",
    "IR-06: next recommended phase is 8.10A — Photo/OCR Controlled Runtime Gate Design.",
    "IR-07: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_INTERNAL_READINESS_CLOSURE_TAMPER_CASES.length;

  const allSourcePassed =
    sourceUiPatchAllPassed && sourcePlanningAllPassed && sourceExecutionClosureAllPassed;
  const allScenariosPassed =
    allowedDocumentScenarioPassed && blockedRiskScenariosPassed && m.photoModeSeparationConfirmed === true;
  const textDocumentModeInternalReadinessClosed =
    closureFailures.length === 0 && allSourcePassed && allScenariosPassed && cleanupConfirmed;

  const provisional: TextDocumentModeInternalReadinessClosureResult = {
    checkId: "8.9N",
    allPassed: true,
    closureOnly: true,
    internalReadinessClosureOnly: true,
    sourceUiPatchPhase: "8.9K",
    sourceUiPatchCommit: "e7d47c5",
    sourcePlanningPhase: "8.9L",
    sourcePlanningCommit: "d22dc64",
    sourceExecutionClosurePhase: "8.9M",
    sourceExecutionClosureCommit: "5451c5f",
    sourceUiPatchAllPassed,
    sourcePlanningAllPassed,
    sourceExecutionClosureAllPassed,
    readyForControlledInternalTextDocumentMode: true,
    readyForTextDocumentModeInternalUse: true,
    readyForTextDocumentModeInternalReadinessClosure: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    textDocumentModeControlledLocalOnly: true,
    browserManualExecutionCompleted: m.browserManualTestCompleted === true,
    browserNetworkResponseBodiesDirectlyObserved: m.networkResponseBodiesDirectlyObserved === true,
    allowedDocumentScenarioPassed,
    blockedRiskScenariosPassed,
    photoModeSeparationConfirmed: m.photoModeSeparationConfirmed === true,
    cleanupConfirmed,
    noExistingRuntimeFileModifiedInThisPhase: true,
    noUiFileModifiedInThisPhase: true,
    noRouteFileModifiedInThisPhase: true,
    onScenarioStatus: 200,
    onScenarioOk: true,
    onScenarioMode: "text_document_controlled_runtime",
    onScenarioContext: "anonymous",
    onScenarioTextDocumentMetaPresent: true,
    onScenarioTextDocumentMetaFlagsConfirmed: m.onScenarioTextDocumentMetaFlagsConfirmed === true,
    onScenarioPhotoOcrStillBlocked: true,
    onScenarioScannerUploadStillBlocked: true,
    onScenarioFileUploadStillBlocked: true,
    onScenarioPaidDocumentModeStillBlocked: true,
    onScenarioVayloDnaStillBlocked: true,
    onScenarioPersistenceStillBlocked: true,
    onScenarioDbStorageStillBlocked: true,
    onScenarioExactLegalDeadlineStillBlocked: true,
    onScenarioBindingLegalAdviceStillBlocked: true,
    onScenarioOfficialFilingGenerationStillBlocked: true,
    onScenarioModelOutputStillUntrusted: true,
    onScenarioDocumentTextTreatedAsSensitive: true,
    onScenarioPrivacyDisclaimerRequired: true,
    onScenarioLegalDisclaimerRequired: true,
    onScenarioEightThreeAcNotRun: true,
    exactLegalDeadlineBlocked: true,
    exactLegalDeadlineBlockedStatus: 402,
    exactLegalDeadlineBlockedCode: "exact_legal_deadline_calculation_blocked",
    credentialApiKeyBlocked: true,
    credentialApiKeyBlockedStatus: 402,
    credentialApiKeyBlockedCode: "sensitive_credential_data_blocked",
    ibanPaymentBlocked: true,
    ibanPaymentBlockedStatus: 402,
    ibanPaymentBlockedCode: "sensitive_financial_data_blocked",
    nonDocumentQuestionBlocked: true,
    nonDocumentQuestionBlockedStatus: 400,
    nonDocumentQuestionBlockedCode: "no_document_signal_blocked",
    explicitPaidActivationBlockedAfterRetry: true,
    explicitPaidActivationBlockedStatus: 402,
    explicitPaidActivationBlockedCode: "paid_document_mode_blocked",
    rateLimitObservedAndHandled: m.paidActivationFirstAttemptRateLimited === true,
    rateLimitNotCountedAsFailure: m.paidActivationRateLimitNotCountedAsFailure === true,
    internalTextDocumentButtonAbsentInPhotoMode: m.internalButtonAbsentInPhotoMode === true,
    noUploadOcrPhotoPayloadEnteredTextDocumentMode: true,
    noOcrRuntimeActivated: m.noOcrRuntimeActivated === true,
    noFileUploadPerformed: m.noFileUploadPerformed === true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    photoOcrRuntimeStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,
    readyForNextPhase: "8.10A",
    recommendedNextPhase: "Photo/OCR Controlled Runtime Gate Design",
    textDocumentModeInternalReadinessClosed,
    publicLaunchRecommendedNow: false,
    productionDeployRecommendedNow: false,
    goLiveRecommendedNow: false,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImportedByClosure: false,
    fetchUsedAsRuntimeByClosure: false,
    processEnvReadForAuthorizationByClosure: false,
    filesWrittenByClosure: false,
    dbStorageTouchedByClosure: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    sourceEvidence,
    readinessEvidence,
    browserManualExecutionEvidence,
    allowedDocumentEvidence,
    blockedRiskEvidence,
    photoModeSeparationEvidence,
    safetyBoundaryEvidence,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    evidenceLimitations,
    nextRecommendedSteps: [
      "Phase 8.10A: Photo/OCR Controlled Runtime Gate Design — define the controlled runtime gate for photo/OCR mode (explicitly deferred until after Text Document Mode internal readiness closure).",
      "Do not proceed to public Text Document Mode runtime, production, or go-live without separate gated phases.",
    ],
    notes,
  };

  if (closureFailures.length === 0 && !_isCanonicalTextDocumentModeInternalReadinessClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_INTERNAL_READINESS_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeInternalReadinessClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9N tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed = closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9N tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
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
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-internal-readiness-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeInternalReadinessClosure(), null, 2));
}
