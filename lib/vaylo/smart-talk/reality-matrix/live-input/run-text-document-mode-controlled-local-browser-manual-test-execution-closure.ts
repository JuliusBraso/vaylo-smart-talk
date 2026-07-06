/**
 * PHASE 8.9M — Text Document Mode Controlled Local Browser Manual Test Execution Closure
 *
 * Static manual-observation record of the controlled local browser manual test
 * executed by the operator with Chrome DevTools Network response body inspection.
 *
 * This file does NOT invoke browser/API/model itself. It does not call fetch,
 * runSmartTalk, OpenAI, route handlers, or read process.env for authorization.
 * It does not touch DB/storage, does not run 8.3AC, and does not touch
 * tmp-8-3ac-live-metadata.ts. It imports the 8.9L planning file only as
 * source evidence and hardcodes the operator-observed manual test results.
 */

import { runTextDocumentModeControlledLocalBrowserManualTestPlanning } from "./run-text-document-mode-controlled-local-browser-manual-test-planning";

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult {
  checkId: "8.9M";
  allPassed: boolean;
  executionClosureOnly: true;
  sourceManualTestPlanningCommit: "d22dc64";
  sourceManualTestPlanningPhase: "8.9L";
  sourceManualTestPlanningAllPassed: boolean;
  sourceMinimalUiWiringCommit: "e7d47c5";
  manualBrowserTestPerformed: true;
  repeatedNetworkResponseInspectionPerformed: true;
  networkResponseBodiesDirectlyObserved: true;
  localOnly: true;
  browserPathUsed: "http://localhost:3000/smart-talk";
  devServerStarted: true;
  devServerStopped: true;
  oldDevServerLockObservedAndCleared: true;
  automationStallObservedEarlier: true;
  automationStallHandledByManualBrowserExecution: true;
  onScenarioPerformed: true;
  onAllowedDocumentScenarioPassed: true;
  onScenarioStatus: 200;
  onScenarioOk: true;
  onScenarioMode: "text_document_controlled_runtime";
  onScenarioContext: "anonymous";
  onScenarioResultRenderedInUi: true;
  onScenarioTextDocumentMetaPresent: true;
  onScenarioTextDocumentMetaFlagsConfirmed: true;
  onScenarioTextDocumentModeEnabled: true;
  onScenarioControlledTextDocumentRuntime: true;
  onScenarioPastedTextOnly: true;
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
  blockedRiskScenariosPerformed: true;
  blockedRiskNetworkResponseCodesDirectlyObserved: true;
  exactLegalDeadlineBlocked: true;
  exactLegalDeadlineBlockedStatus: 402;
  exactLegalDeadlineBlockedOk: false;
  exactLegalDeadlineBlockedCode: "exact_legal_deadline_calculation_blocked";
  exactLegalDeadlineBlockedCodeDirectlyObserved: true;
  credentialApiKeyBlocked: true;
  credentialApiKeyBlockedStatus: 402;
  credentialApiKeyBlockedOk: false;
  credentialApiKeyBlockedCode: "sensitive_credential_data_blocked";
  credentialApiKeyBlockedCodeDirectlyObserved: true;
  credentialApiKeySyntheticFakeSecretOnly: true;
  noRealSecretUsed: true;
  ibanPaymentBlocked: true;
  ibanPaymentBlockedStatus: 402;
  ibanPaymentBlockedOk: false;
  ibanPaymentBlockedCode: "sensitive_financial_data_blocked";
  ibanPaymentBlockedCodeDirectlyObserved: true;
  ibanPaymentSyntheticPlaceholderOnly: true;
  noRealFinancialCredentialUsed: true;
  nonDocumentQuestionBlocked: true;
  nonDocumentQuestionBlockedStatus: 400;
  nonDocumentQuestionBlockedOk: false;
  nonDocumentQuestionBlockedCode: "no_document_signal_blocked";
  nonDocumentQuestionBlockedCodeDirectlyObserved: true;
  paidActivationFirstAttemptRateLimited: true;
  paidActivationFirstAttemptError: "smart_talk_rate_limited";
  paidActivationRateLimitNotCountedAsFailure: true;
  explicitPaidActivationBlockedAfterRetry: true;
  explicitPaidActivationBlockedStatus: 402;
  explicitPaidActivationBlockedOk: false;
  explicitPaidActivationBlockedCode: "paid_document_mode_blocked";
  explicitPaidActivationBlockedCodeDirectlyObserved: true;
  photoModeSeparationConfirmed: true;
  photoTabClicked: true;
  internalButtonAbsentInPhotoMode: true;
  cameraGalleryUiVisible: true;
  analyzeButtonDisabledWithoutUpload: true;
  noUploadOcrPhotoPayloadEnteredTextDocumentMode: true;
  noOcrRuntimeActivated: true;
  noFileUploadPerformed: true;
  cleanupPerformed: true;
  envTextDocumentFlagRemovedAfterTest: true;
  envFreeQaPublicFlagRemovedAfterTest: true;
  gitStatusCleanAfterCleanup: true;
  textDocumentModeReadyForInternalReadinessClosure: boolean;
  readyForTextDocumentModeInternalReadinessClosure: boolean;
  browserManualTestCompleted: true;
  textDocumentModeBrowserPathValidated: true;
  textDocumentRuntimeAuthorizedForProductionNow: false;
  textDocumentRuntimeStillControlledLocalOnly: true;
  photoOcrRuntimeStillBlocked: true;
  scannerUploadStillBlocked: true;
  fileUploadStillBlocked: true;
  paidDocumentModeStillBlocked: true;
  vayloDnaStillBlocked: true;
  persistenceStillBlocked: true;
  dbStorageStillBlocked: true;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  modelOutputStillUntrusted: true;
  documentTextTreatedAsSensitive: true;
  legalDisclaimerRequired: true;
  privacyDisclaimerRequired: true;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;
  liveRouteInvocationPerformedByThisClosure: false;
  liveModelCallPerformedByThisClosure: false;
  openAiSdkImportedByClosure: false;
  fetchUsedAsRuntimeByClosure: false;
  processEnvReadForAuthorizationByClosure: false;
  filesWrittenByClosure: false;
  dbStorageTouchedByClosure: false;
  readyForNextPhase: "8.9N";
  recommendedNextPhase: "Text Document Mode Internal Readiness Closure";
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  preTestEvidence: string[];
  environmentAndToolingEvidence: string[];
  networkInspectionEvidence: string[];
  allowedOnScenarioEvidence: string[];
  blockedRiskScenarioEvidence: string[];
  rateLimitEvidence: string[];
  photoModeSeparationEvidence: string[];
  cleanupEvidence: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

const REQUIRED_REMAINING_BLOCKERS: string[] = [
  "Text Document Mode internal readiness closure not completed yet",
  "OCR/photo still blocked",
  "scanner/upload still blocked",
  "file upload still blocked",
  "paid document mode still blocked",
  "Vaylo DNA still blocked",
  "persistence/DB/storage still blocked",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

const REQUIRED_EVIDENCE_LIMITATIONS: string[] = [
  "Manual browser execution was operator-observed, not automated by code.",
  "Network response bodies were directly observed in Chrome DevTools for the repeated run.",
  "The paid activation first attempt hit smart_talk_rate_limited and was retried; the retry produced paid_document_mode_blocked.",
  "Blocked pre-runtime scenarios may include textDocumentMeta with successful runtime flags false because they were rejected before controlled Text Document runtime completion.",
  "This closure does not authorize public runtime, production, go-live, OCR, upload, paid mode, DNA, persistence, DB, or storage.",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult(
  r: TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult,
): boolean {
  if (r.checkId !== "8.9M") return false;
  if (r.allPassed !== true) return false;
  if (r.executionClosureOnly !== true) return false;
  if (r.sourceManualTestPlanningCommit !== "d22dc64") return false;
  if (r.sourceManualTestPlanningPhase !== "8.9L") return false;
  if (r.sourceManualTestPlanningAllPassed !== true) return false;
  if (r.sourceMinimalUiWiringCommit !== "e7d47c5") return false;
  if (r.manualBrowserTestPerformed !== true) return false;
  if (r.repeatedNetworkResponseInspectionPerformed !== true) return false;
  if (r.networkResponseBodiesDirectlyObserved !== true) return false;
  if (r.localOnly !== true) return false;
  if (r.browserPathUsed !== "http://localhost:3000/smart-talk") return false;
  if (r.devServerStarted !== true) return false;
  if (r.devServerStopped !== true) return false;
  if (r.oldDevServerLockObservedAndCleared !== true) return false;
  if (r.automationStallObservedEarlier !== true) return false;
  if (r.automationStallHandledByManualBrowserExecution !== true) return false;
  if (r.onScenarioPerformed !== true) return false;
  if (r.onAllowedDocumentScenarioPassed !== true) return false;
  if (r.onScenarioStatus !== 200) return false;
  if (r.onScenarioOk !== true) return false;
  if (r.onScenarioMode !== "text_document_controlled_runtime") return false;
  if (r.onScenarioContext !== "anonymous") return false;
  if (r.onScenarioResultRenderedInUi !== true) return false;
  if (r.onScenarioTextDocumentMetaPresent !== true) return false;
  if (r.onScenarioTextDocumentMetaFlagsConfirmed !== true) return false;
  if (r.onScenarioTextDocumentModeEnabled !== true) return false;
  if (r.onScenarioControlledTextDocumentRuntime !== true) return false;
  if (r.onScenarioPastedTextOnly !== true) return false;
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
  if (r.blockedRiskScenariosPerformed !== true) return false;
  if (r.blockedRiskNetworkResponseCodesDirectlyObserved !== true) return false;
  if (r.exactLegalDeadlineBlocked !== true) return false;
  if (r.exactLegalDeadlineBlockedStatus !== 402) return false;
  if (r.exactLegalDeadlineBlockedOk !== false) return false;
  if (r.exactLegalDeadlineBlockedCode !== "exact_legal_deadline_calculation_blocked") return false;
  if (r.exactLegalDeadlineBlockedCodeDirectlyObserved !== true) return false;
  if (r.credentialApiKeyBlocked !== true) return false;
  if (r.credentialApiKeyBlockedStatus !== 402) return false;
  if (r.credentialApiKeyBlockedOk !== false) return false;
  if (r.credentialApiKeyBlockedCode !== "sensitive_credential_data_blocked") return false;
  if (r.credentialApiKeyBlockedCodeDirectlyObserved !== true) return false;
  if (r.credentialApiKeySyntheticFakeSecretOnly !== true) return false;
  if (r.noRealSecretUsed !== true) return false;
  if (r.ibanPaymentBlocked !== true) return false;
  if (r.ibanPaymentBlockedStatus !== 402) return false;
  if (r.ibanPaymentBlockedOk !== false) return false;
  if (r.ibanPaymentBlockedCode !== "sensitive_financial_data_blocked") return false;
  if (r.ibanPaymentBlockedCodeDirectlyObserved !== true) return false;
  if (r.ibanPaymentSyntheticPlaceholderOnly !== true) return false;
  if (r.noRealFinancialCredentialUsed !== true) return false;
  if (r.nonDocumentQuestionBlocked !== true) return false;
  if (r.nonDocumentQuestionBlockedStatus !== 400) return false;
  if (r.nonDocumentQuestionBlockedOk !== false) return false;
  if (r.nonDocumentQuestionBlockedCode !== "no_document_signal_blocked") return false;
  if (r.nonDocumentQuestionBlockedCodeDirectlyObserved !== true) return false;
  if (r.paidActivationFirstAttemptRateLimited !== true) return false;
  if (r.paidActivationFirstAttemptError !== "smart_talk_rate_limited") return false;
  if (r.paidActivationRateLimitNotCountedAsFailure !== true) return false;
  if (r.explicitPaidActivationBlockedAfterRetry !== true) return false;
  if (r.explicitPaidActivationBlockedStatus !== 402) return false;
  if (r.explicitPaidActivationBlockedOk !== false) return false;
  if (r.explicitPaidActivationBlockedCode !== "paid_document_mode_blocked") return false;
  if (r.explicitPaidActivationBlockedCodeDirectlyObserved !== true) return false;
  if (r.photoModeSeparationConfirmed !== true) return false;
  if (r.photoTabClicked !== true) return false;
  if (r.internalButtonAbsentInPhotoMode !== true) return false;
  if (r.cameraGalleryUiVisible !== true) return false;
  if (r.analyzeButtonDisabledWithoutUpload !== true) return false;
  if (r.noUploadOcrPhotoPayloadEnteredTextDocumentMode !== true) return false;
  if (r.noOcrRuntimeActivated !== true) return false;
  if (r.noFileUploadPerformed !== true) return false;
  if (r.cleanupPerformed !== true) return false;
  if (r.envTextDocumentFlagRemovedAfterTest !== true) return false;
  if (r.envFreeQaPublicFlagRemovedAfterTest !== true) return false;
  if (r.gitStatusCleanAfterCleanup !== true) return false;
  if (r.textDocumentModeReadyForInternalReadinessClosure !== true) return false;
  if (r.readyForTextDocumentModeInternalReadinessClosure !== true) return false;
  if (r.browserManualTestCompleted !== true) return false;
  if (r.textDocumentModeBrowserPathValidated !== true) return false;
  if (r.textDocumentRuntimeAuthorizedForProductionNow !== false) return false;
  if (r.textDocumentRuntimeStillControlledLocalOnly !== true) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;
  if (r.liveRouteInvocationPerformedByThisClosure !== false) return false;
  if (r.liveModelCallPerformedByThisClosure !== false) return false;
  if (r.openAiSdkImportedByClosure !== false) return false;
  if (r.fetchUsedAsRuntimeByClosure !== false) return false;
  if (r.processEnvReadForAuthorizationByClosure !== false) return false;
  if (r.filesWrittenByClosure !== false) return false;
  if (r.dbStorageTouchedByClosure !== false) return false;
  if (r.readyForNextPhase !== "8.9N") return false;
  if (r.recommendedNextPhase !== "Text Document Mode Internal Readiness Closure") return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!Array.isArray(r.preTestEvidence) || r.preTestEvidence.length === 0) return false;
  if (!Array.isArray(r.environmentAndToolingEvidence) || r.environmentAndToolingEvidence.length === 0) return false;
  if (!Array.isArray(r.networkInspectionEvidence) || r.networkInspectionEvidence.length === 0) return false;
  if (!Array.isArray(r.allowedOnScenarioEvidence) || r.allowedOnScenarioEvidence.length === 0) return false;
  if (!Array.isArray(r.blockedRiskScenarioEvidence) || r.blockedRiskScenarioEvidence.length === 0) return false;
  if (!Array.isArray(r.rateLimitEvidence) || r.rateLimitEvidence.length === 0) return false;
  if (!Array.isArray(r.photoModeSeparationEvidence) || r.photoModeSeparationEvidence.length === 0) return false;
  if (!Array.isArray(r.cleanupEvidence) || r.cleanupEvidence.length === 0) return false;
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

type Tamper89MMutation = (
  r: TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult,
) => TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult;
interface Tamper89MCase {
  label: string;
  mutate: Tamper89MMutation;
}

const TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES: Tamper89MCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9L" as "8.9M" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "executionClosureOnly false", mutate: (r) => ({ ...r, executionClosureOnly: false as true }) },
  { label: "sourceManualTestPlanningCommit wrong (source commit is not d22dc64)", mutate: (r) => ({ ...r, sourceManualTestPlanningCommit: "0000000" as "d22dc64" }) },
  { label: "sourceManualTestPlanningPhase wrong", mutate: (r) => ({ ...r, sourceManualTestPlanningPhase: "8.9K" as "8.9L" }) },
  { label: "sourceManualTestPlanningAllPassed false (8.9L source is not allPassed)", mutate: (r) => ({ ...r, sourceManualTestPlanningAllPassed: false }) },
  { label: "manualBrowserTestPerformed false (manual browser test not marked performed)", mutate: (r) => ({ ...r, manualBrowserTestPerformed: false as true }) },
  { label: "repeatedNetworkResponseInspectionPerformed false (Network response body inspection not marked performed)", mutate: (r) => ({ ...r, repeatedNetworkResponseInspectionPerformed: false as true }) },
  { label: "networkResponseBodiesDirectlyObserved false (Network response body codes not marked directly observed)", mutate: (r) => ({ ...r, networkResponseBodiesDirectlyObserved: false as true }) },
  { label: "onScenarioPerformed false (ON scenario not performed)", mutate: (r) => ({ ...r, onScenarioPerformed: false as true }) },
  { label: "onAllowedDocumentScenarioPassed false (ON scenario not passed)", mutate: (r) => ({ ...r, onAllowedDocumentScenarioPassed: false as true }) },
  { label: "onScenarioStatus wrong (ON scenario does not return status 200)", mutate: (r) => ({ ...r, onScenarioStatus: 403 as 200 }) },
  { label: "onScenarioOk false (ON scenario does not return ok true)", mutate: (r) => ({ ...r, onScenarioOk: false as true }) },
  { label: "onScenarioMode wrong (ON scenario does not return mode text_document_controlled_runtime)", mutate: (r) => ({ ...r, onScenarioMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "onScenarioTextDocumentMetaPresent false (textDocumentMeta missing in ON scenario)", mutate: (r) => ({ ...r, onScenarioTextDocumentMetaPresent: false as true }) },
  { label: "onScenarioTextDocumentMetaFlagsConfirmed false (required ON textDocumentMeta flag missing/false)", mutate: (r) => ({ ...r, onScenarioTextDocumentMetaFlagsConfirmed: false as true }) },
  { label: "onScenarioTextDocumentModeEnabled false (required ON textDocumentMeta flag false)", mutate: (r) => ({ ...r, onScenarioTextDocumentModeEnabled: false as true }) },
  { label: "exactLegalDeadlineBlocked false (exact legal deadline not blocked)", mutate: (r) => ({ ...r, exactLegalDeadlineBlocked: false as true }) },
  { label: "exactLegalDeadlineBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, exactLegalDeadlineBlockedStatus: 200 as 402 }) },
  { label: "exactLegalDeadlineBlockedCode wrong (not exact_legal_deadline_calculation_blocked)", mutate: (r) => ({ ...r, exactLegalDeadlineBlockedCode: "ok" as "exact_legal_deadline_calculation_blocked" }) },
  { label: "exactLegalDeadlineBlockedCodeDirectlyObserved false", mutate: (r) => ({ ...r, exactLegalDeadlineBlockedCodeDirectlyObserved: false as true }) },
  { label: "credentialApiKeyBlocked false (credential/API key not blocked)", mutate: (r) => ({ ...r, credentialApiKeyBlocked: false as true }) },
  { label: "credentialApiKeyBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, credentialApiKeyBlockedStatus: 200 as 402 }) },
  { label: "credentialApiKeyBlockedCode wrong (not sensitive_credential_data_blocked)", mutate: (r) => ({ ...r, credentialApiKeyBlockedCode: "ok" as "sensitive_credential_data_blocked" }) },
  { label: "ibanPaymentBlocked false (IBAN/payment not blocked)", mutate: (r) => ({ ...r, ibanPaymentBlocked: false as true }) },
  { label: "ibanPaymentBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, ibanPaymentBlockedStatus: 200 as 402 }) },
  { label: "ibanPaymentBlockedCode wrong (not sensitive_financial_data_blocked)", mutate: (r) => ({ ...r, ibanPaymentBlockedCode: "ok" as "sensitive_financial_data_blocked" }) },
  { label: "nonDocumentQuestionBlocked false (non-document question not blocked)", mutate: (r) => ({ ...r, nonDocumentQuestionBlocked: false as true }) },
  { label: "nonDocumentQuestionBlockedStatus wrong (not status 400)", mutate: (r) => ({ ...r, nonDocumentQuestionBlockedStatus: 200 as 400 }) },
  { label: "nonDocumentQuestionBlockedCode wrong (not no_document_signal_blocked)", mutate: (r) => ({ ...r, nonDocumentQuestionBlockedCode: "ok" as "no_document_signal_blocked" }) },
  { label: "paidActivationRateLimitNotCountedAsFailure false (rate-limit counted as Text Document Mode failure)", mutate: (r) => ({ ...r, paidActivationRateLimitNotCountedAsFailure: false as true }) },
  { label: "explicitPaidActivationBlockedAfterRetry false (paid activation retry not blocked)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedAfterRetry: false as true }) },
  { label: "explicitPaidActivationBlockedStatus wrong (not status 402)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedStatus: 200 as 402 }) },
  { label: "explicitPaidActivationBlockedCode wrong (not paid_document_mode_blocked)", mutate: (r) => ({ ...r, explicitPaidActivationBlockedCode: "ok" as "paid_document_mode_blocked" }) },
  { label: "photoModeSeparationConfirmed false (photo mode separation not confirmed)", mutate: (r) => ({ ...r, photoModeSeparationConfirmed: false as true }) },
  { label: "internalButtonAbsentInPhotoMode false (internal button visible in photo mode)", mutate: (r) => ({ ...r, internalButtonAbsentInPhotoMode: false as true }) },
  { label: "noUploadOcrPhotoPayloadEnteredTextDocumentMode false (upload/OCR/photo payload enters text_document_controlled_runtime)", mutate: (r) => ({ ...r, noUploadOcrPhotoPayloadEnteredTextDocumentMode: false as true }) },
  { label: "noOcrRuntimeActivated false (OCR runtime is activated)", mutate: (r) => ({ ...r, noOcrRuntimeActivated: false as true }) },
  { label: "noFileUploadPerformed false (file upload is performed)", mutate: (r) => ({ ...r, noFileUploadPerformed: false as true }) },
  { label: "cleanupPerformed false (cleanup not performed)", mutate: (r) => ({ ...r, cleanupPerformed: false as true }) },
  { label: "envTextDocumentFlagRemovedAfterTest false (env flags not removed after test)", mutate: (r) => ({ ...r, envTextDocumentFlagRemovedAfterTest: false as true }) },
  { label: "gitStatusCleanAfterCleanup false (git status after cleanup not clean)", mutate: (r) => ({ ...r, gitStatusCleanAfterCleanup: false as true }) },
  { label: "browserManualTestCompleted false (browser manual test completion is false)", mutate: (r) => ({ ...r, browserManualTestCompleted: false as true }) },
  { label: "readyForTextDocumentModeInternalReadinessClosure true when scenario failed", mutate: (r) => ({ ...r, onAllowedDocumentScenarioPassed: false as true, readyForTextDocumentModeInternalReadinessClosure: true }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "productionAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (production/go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false as true }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes ready)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false as true }) },
  { label: "fileUploadStillBlocked false (file upload becomes ready)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false as true }) },
  { label: "paidDocumentModeStillBlocked false (paid/DNA/persistence/DB storage becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false as true }) },
  { label: "vayloDnaStillBlocked false", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false as true }) },
  { label: "persistenceStillBlocked false", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "dbStorageStillBlocked false", mutate: (r) => ({ ...r, dbStorageStillBlocked: false as true }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false as true }) },
  { label: "documentTextTreatedAsSensitive false (document text is not treated as sensitive)", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false as true }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false as true }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false as true }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true (tmp 8.3AC metadata touched)", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "readyForNextPhase wrong", mutate: (r) => ({ ...r, readyForNextPhase: "8.9M" as "8.9N" }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "preTestEvidence emptied", mutate: (r) => ({ ...r, preTestEvidence: [] }) },
  { label: "environmentAndToolingEvidence emptied", mutate: (r) => ({ ...r, environmentAndToolingEvidence: [] }) },
  { label: "networkInspectionEvidence emptied", mutate: (r) => ({ ...r, networkInspectionEvidence: [] }) },
  { label: "allowedOnScenarioEvidence emptied", mutate: (r) => ({ ...r, allowedOnScenarioEvidence: [] }) },
  { label: "blockedRiskScenarioEvidence emptied", mutate: (r) => ({ ...r, blockedRiskScenarioEvidence: [] }) },
  { label: "rateLimitEvidence emptied", mutate: (r) => ({ ...r, rateLimitEvidence: [] }) },
  { label: "photoModeSeparationEvidence emptied", mutate: (r) => ({ ...r, photoModeSeparationEvidence: [] }) },
  { label: "cleanupEvidence emptied", mutate: (r) => ({ ...r, cleanupEvidence: [] }) },
  { label: "evidenceLimitations wrong length", mutate: (r) => ({ ...r, evidenceLimitations: r.evidenceLimitations.slice(0, 2) }) },
  { label: "remainingBlockers wrong length", mutate: (r) => ({ ...r, remainingBlockers: r.remainingBlockers.slice(0, 3) }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export function runTextDocumentModeControlledLocalBrowserManualTestExecutionClosure(): TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult {
  const closureFailures: string[] = [];

  // ── Call 8.9L planning as source evidence ────────────────────────────────
  const l = runTextDocumentModeControlledLocalBrowserManualTestPlanning();
  if (l.checkId !== "8.9L") closureFailures.push(`8.9L checkId mismatch: expected "8.9L", got "${l.checkId}"`);
  if (l.allPassed !== true) closureFailures.push("8.9L allPassed is not true");
  if (l.sourceMinimalUiWiringCommit !== "e7d47c5") closureFailures.push("8.9L sourceMinimalUiWiringCommit mismatch");
  if (l.readyForControlledLocalBrowserManualTestExecution !== true)
    closureFailures.push("8.9L readyForControlledLocalBrowserManualTestExecution is not true");
  if (l.browserManualTestPhase !== "8.9M") closureFailures.push("8.9L browserManualTestPhase mismatch");
  if (l.publicRuntimeStillBlocked !== true) closureFailures.push("8.9L publicRuntimeStillBlocked is not true");
  if (l.productionAuthorizedNow !== false) closureFailures.push("8.9L productionAuthorizedNow is not false");
  if (l.goLiveAuthorizedNow !== false) closureFailures.push("8.9L goLiveAuthorizedNow is not false");
  if (l.tamperRejected !== l.tamperCount) closureFailures.push("8.9L own tamper count mismatch");
  const sourceManualTestPlanningAllPassed = closureFailures.length === 0;

  const preTestEvidence: string[] = [
    "git status was clean before manual test execution (commit d22dc64 — add text document mode controlled local browser manual test planning).",
    "8.9L planning allPassed: true confirmed as source evidence.",
    "8.9K patch audit allPassed: true confirmed via 8.9L source chain.",
    "Browser path: http://localhost:3000/smart-talk.",
    "Local only — no public runtime, production, go-live, OCR, upload, paid mode, DNA, or persistence authorization.",
    "8.3AC was not run; tmp-8-3ac-live-metadata.ts was not touched.",
  ];

  const environmentAndToolingEvidence: string[] = [
    "Earlier in the 8.9M session, Cursor/MCP browser automation became slow/stalled during a fill action.",
    "Operator stopped relying on automation and continued manually in the browser.",
    "An old Next dev process / lock affected port 3000 earlier in the session.",
    "The stale process was terminated and .next/dev/lock was removed.",
    "Dev server was restarted cleanly on http://localhost:3000.",
    "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED was set exactly to \"true\" for ON and blocked-risk scenarios.",
    "These were environment/tooling observations, not Text Document Mode failures.",
  ];

  const networkInspectionEvidence: string[] = [
    "Chrome DevTools Network tab was used with Preserve log enabled.",
    "Fetch/XHR filtering was applied to smart-talk requests.",
    "Network response bodies were directly inspected for each scenario.",
    "Repeated manual browser test run performed with Network response evidence capture.",
  ];

  const allowedOnScenarioEvidence: string[] = [
    "Input: safe synthetic German insurance-status document-like text (Versicherungsstatus/Krankenkasse).",
    "Action: selected text mode, pasted text, clicked \"Interný test: Text Document Mode\".",
    "Network observed: HTTP status 200, ok true, mode \"text_document_controlled_runtime\", context \"anonymous\".",
    "textDocumentMeta present with textDocumentModeEnabled true, controlledTextDocumentRuntime true, pastedTextOnly true.",
    "All StillBlocked flags true: photoOcrStillBlocked, scannerUploadStillBlocked, fileUploadStillBlocked, paidDocumentModeStillBlocked, vayloDnaStillBlocked, persistenceStillBlocked, dbStorageStillBlocked, exactLegalDeadlineStillBlocked, bindingLegalAdviceStillBlocked, officialFilingGenerationStillBlocked.",
    "Safety flags true: modelOutputStillUntrusted, documentTextTreatedAsSensitive, privacyDisclaimerRequired, legalDisclaimerRequired, eightThreeAcNotRun.",
    "UI rendered structured result without crash (Zhrnutie, Čo to znamená, Čo urobiť ďalej sections visible).",
  ];

  const blockedRiskScenarioEvidence: string[] = [
    "Exact legal deadline: ok false, HTTP 402, code exact_legal_deadline_calculation_blocked — directly observed in Network response body.",
    "Credential/API key: ok false, HTTP 402, code sensitive_credential_data_blocked — synthetic fake credential placeholder only (geheim123, sk-test-abcdef), no real secret used.",
    "IBAN/payment: ok false, HTTP 402, code sensitive_financial_data_blocked — synthetic fake IBAN-like placeholder (DE00 0000 0000 0000 0000 00), no real financial credential used.",
    "Non-document question: ok false, HTTP 400, code no_document_signal_blocked — directly observed in Network response body.",
    "Paid activation retry: ok false, HTTP 402, code paid_document_mode_blocked — directly observed in Network response body after rate-limit retry.",
    "Blocked pre-runtime scenarios included textDocumentMeta with textDocumentModeEnabled/controlledTextDocumentRuntime false — expected and safe (rejected before successful controlled Text Document runtime completion).",
  ];

  const rateLimitEvidence: string[] = [
    "Paid activation first attempt: ok false, error smart_talk_rate_limited — rate-limit observed.",
    "Rate-limit was not counted as a Text Document Mode logic failure.",
    "Dev server was reset / case was retried.",
    "Retry produced ok false, HTTP 402, code paid_document_mode_blocked — directly observed in Network response body.",
  ];

  const photoModeSeparationEvidence: string[] = [
    "Operator clicked \"Odfotiť dokument\" (photo mode tab).",
    "Photo/document capture tab became active; camera/gallery UI became visible.",
    "Internal button \"Interný test: Text Document Mode\" was absent from the UI.",
    "Analyze button was disabled because no page was uploaded.",
    "No upload/OCR/photo/file payload was submitted to text_document_controlled_runtime.",
    "No OCR runtime was activated; no file upload was performed.",
  ];

  const cleanupEvidence: string[] = [
    "Dev server was stopped after manual test completion.",
    "Remove-Item Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED executed.",
    "Remove-Item Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED executed.",
    "Test-Path Env:SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED returned False.",
    "Test-Path Env:SMART_TALK_FREE_QA_PUBLIC_ENABLED returned False.",
    "git status --short returned clean after cleanup.",
  ];

  const evidenceLimitations = [...REQUIRED_EVIDENCE_LIMITATIONS];

  const notes: string[] = [
    "EC-01: 8.9M is an execution closure only. This file hardcodes operator-observed manual test results; it does not invoke browser/API/model itself.",
    `EC-02: 8.9L confirmed as source evidence — checkId=${l.checkId}, allPassed=${l.allPassed}, sourceMinimalUiWiringCommit=${l.sourceMinimalUiWiringCommit}, readyForControlledLocalBrowserManualTestExecution=${l.readyForControlledLocalBrowserManualTestExecution}, browserManualTestPhase=${l.browserManualTestPhase}.`,
    "EC-03: all manual scenarios passed with Network response body codes directly observed in Chrome DevTools for the repeated run.",
    "EC-04: paid activation first attempt hit smart_talk_rate_limited (environmental limiter); retry produced paid_document_mode_blocked — rate-limit was not counted as a Text Document Mode failure.",
    "EC-05: photo mode separation confirmed — internal Text Document Mode button absent in photo mode; no OCR/upload runtime activated.",
    "EC-06: cleanup confirmed — env flags removed, dev server stopped, git status clean.",
    "EC-07: this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "EC-08: ready for Phase 8.9N — Text Document Mode Internal Readiness Closure.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES.length;

  const provisional: TextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult = {
    checkId: "8.9M",
    allPassed: true,
    executionClosureOnly: true,
    sourceManualTestPlanningCommit: "d22dc64",
    sourceManualTestPlanningPhase: "8.9L",
    sourceManualTestPlanningAllPassed,
    sourceMinimalUiWiringCommit: "e7d47c5",
    manualBrowserTestPerformed: true,
    repeatedNetworkResponseInspectionPerformed: true,
    networkResponseBodiesDirectlyObserved: true,
    localOnly: true,
    browserPathUsed: "http://localhost:3000/smart-talk",
    devServerStarted: true,
    devServerStopped: true,
    oldDevServerLockObservedAndCleared: true,
    automationStallObservedEarlier: true,
    automationStallHandledByManualBrowserExecution: true,
    onScenarioPerformed: true,
    onAllowedDocumentScenarioPassed: true,
    onScenarioStatus: 200,
    onScenarioOk: true,
    onScenarioMode: "text_document_controlled_runtime",
    onScenarioContext: "anonymous",
    onScenarioResultRenderedInUi: true,
    onScenarioTextDocumentMetaPresent: true,
    onScenarioTextDocumentMetaFlagsConfirmed: true,
    onScenarioTextDocumentModeEnabled: true,
    onScenarioControlledTextDocumentRuntime: true,
    onScenarioPastedTextOnly: true,
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
    blockedRiskScenariosPerformed: true,
    blockedRiskNetworkResponseCodesDirectlyObserved: true,
    exactLegalDeadlineBlocked: true,
    exactLegalDeadlineBlockedStatus: 402,
    exactLegalDeadlineBlockedOk: false,
    exactLegalDeadlineBlockedCode: "exact_legal_deadline_calculation_blocked",
    exactLegalDeadlineBlockedCodeDirectlyObserved: true,
    credentialApiKeyBlocked: true,
    credentialApiKeyBlockedStatus: 402,
    credentialApiKeyBlockedOk: false,
    credentialApiKeyBlockedCode: "sensitive_credential_data_blocked",
    credentialApiKeyBlockedCodeDirectlyObserved: true,
    credentialApiKeySyntheticFakeSecretOnly: true,
    noRealSecretUsed: true,
    ibanPaymentBlocked: true,
    ibanPaymentBlockedStatus: 402,
    ibanPaymentBlockedOk: false,
    ibanPaymentBlockedCode: "sensitive_financial_data_blocked",
    ibanPaymentBlockedCodeDirectlyObserved: true,
    ibanPaymentSyntheticPlaceholderOnly: true,
    noRealFinancialCredentialUsed: true,
    nonDocumentQuestionBlocked: true,
    nonDocumentQuestionBlockedStatus: 400,
    nonDocumentQuestionBlockedOk: false,
    nonDocumentQuestionBlockedCode: "no_document_signal_blocked",
    nonDocumentQuestionBlockedCodeDirectlyObserved: true,
    paidActivationFirstAttemptRateLimited: true,
    paidActivationFirstAttemptError: "smart_talk_rate_limited",
    paidActivationRateLimitNotCountedAsFailure: true,
    explicitPaidActivationBlockedAfterRetry: true,
    explicitPaidActivationBlockedStatus: 402,
    explicitPaidActivationBlockedOk: false,
    explicitPaidActivationBlockedCode: "paid_document_mode_blocked",
    explicitPaidActivationBlockedCodeDirectlyObserved: true,
    photoModeSeparationConfirmed: true,
    photoTabClicked: true,
    internalButtonAbsentInPhotoMode: true,
    cameraGalleryUiVisible: true,
    analyzeButtonDisabledWithoutUpload: true,
    noUploadOcrPhotoPayloadEnteredTextDocumentMode: true,
    noOcrRuntimeActivated: true,
    noFileUploadPerformed: true,
    cleanupPerformed: true,
    envTextDocumentFlagRemovedAfterTest: true,
    envFreeQaPublicFlagRemovedAfterTest: true,
    gitStatusCleanAfterCleanup: true,
    textDocumentModeReadyForInternalReadinessClosure: true,
    readyForTextDocumentModeInternalReadinessClosure: true,
    browserManualTestCompleted: true,
    textDocumentModeBrowserPathValidated: true,
    textDocumentRuntimeAuthorizedForProductionNow: false,
    textDocumentRuntimeStillControlledLocalOnly: true,
    photoOcrRuntimeStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImportedByClosure: false,
    fetchUsedAsRuntimeByClosure: false,
    processEnvReadForAuthorizationByClosure: false,
    filesWrittenByClosure: false,
    dbStorageTouchedByClosure: false,
    readyForNextPhase: "8.9N",
    recommendedNextPhase: "Text Document Mode Internal Readiness Closure",
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    preTestEvidence,
    environmentAndToolingEvidence,
    networkInspectionEvidence,
    allowedOnScenarioEvidence,
    blockedRiskScenarioEvidence,
    rateLimitEvidence,
    photoModeSeparationEvidence,
    cleanupEvidence,
    evidenceLimitations,
    remainingBlockers: REQUIRED_REMAINING_BLOCKERS,
    nextRecommendedSteps: [
      "Phase 8.9N: Text Document Mode Internal Readiness Closure — consolidate all Text Document Mode evidence (8.9K UI patch, 8.9L planning, 8.9M manual execution closure) into a formal internal readiness verdict.",
      "Phase 8.10A: Photo/OCR Controlled Runtime Gate remains explicitly deferred until after 8.9N.",
    ],
    notes,
  };

  if (
    closureFailures.length === 0 &&
    !_isCanonicalTextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult(provisional)
  ) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_CONTROLLED_LOCAL_BROWSER_MANUAL_TEST_EXECUTION_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeControlledLocalBrowserManualTestExecutionClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9M tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed = closureFailures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9M tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
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
  process.argv[1]
    .replace(/\\/g, "/")
    .includes("run-text-document-mode-controlled-local-browser-manual-test-execution-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeControlledLocalBrowserManualTestExecutionClosure(), null, 2));
}
