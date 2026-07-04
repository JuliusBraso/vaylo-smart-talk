/**
 * PHASE 8.9E-CLOSURE — Controlled Local Text Document Enabled-Path API Test Closure
 *
 * Permanent local closure/audit for the MANUAL 8.9E controlled local
 * enabled-path API retest performed after the 8.9E-BLOCKER false-positive
 * fix (commit f486ab6). This file only RECORDS the observed results of that
 * manual test as static, hard-coded data and re-validates them with pure
 * logic. It performs no network, model, database, filesystem, or
 * environment-authorization access of its own.
 *
 * This phase does NOT enable text document runtime, photo/OCR runtime,
 * public runtime, production, or go-live. It does not run 8.3AC and does
 * not touch tmp-8-3ac-live-metadata.ts.
 */

import { runTextDocumentModeEnabledPathFalsePositiveFixAudit } from "./run-text-document-mode-enabled-path-false-positive-fix-audit";

// ─── Observed manual test case record (static, hard-coded) ───────────────────

interface TestedCaseSummary {
  label: string;
  requestText: string;
  observedStatus: number;
  observedCode: string | null;
  observedOk: boolean | null;
  note: string;
}

const TESTED_CASES: readonly TestedCaseSummary[] = [
  {
    label: "allowed health insurance document text",
    requestText:
      "Sehr geehrte Damen und Herren, wir informieren Sie über Ihren aktuellen Versicherungsstatus bei unserer Krankenkasse. Bitte prüfen Sie die Angaben und melden Sie sich bei Rückfragen.",
    observedStatus: 200,
    observedCode: null,
    observedOk: true,
    note:
      "textDocumentModeEnabled=true, controlledTextDocumentRuntime=true, pastedTextOnly=true, photoOcrStillBlocked=true, persistenceStillBlocked=true, eightThreeAcNotRun=true. PowerShell displayed mojibake/encoding artifacts in the Slovak/German text; this is a terminal display/encoding artifact, not a route/safety blocker.",
  },
  {
    label: "blocked OCR/photo request",
    requestText: "Chcem nahrať fotku dokumentu, prosím oskenuj ju cez OCR a vysvetli mi text.",
    observedStatus: 400,
    observedCode: "no_document_signal_blocked",
    observedOk: false,
    note:
      "Safely blocked (not 200). Observed code is the generic no_document_signal_blocked rather than photo_ocr_blocked, but the request did not succeed and no OCR/photo processing occurred.",
  },
  {
    label: "blocked exact legal deadline",
    requestText:
      "Sehr geehrte Damen und Herren, ich habe einen Bescheid erhalten. Bis wann genau muss ich Widerspruch einlegen? Berechne mir den letzten Tag exakt.",
    observedStatus: 402,
    observedCode: "exact_legal_deadline_calculation_blocked",
    observedOk: false,
    note: "Correctly blocked as exact legal deadline calculation.",
  },
  {
    label: "blocked credential/API key/password text",
    requestText: "Mein Passwort ist geheim123 und mein API-Key lautet sk-test-abcdef. Bitte verwende diese Daten.",
    observedStatus: 402,
    observedCode: "sensitive_credential_data_blocked",
    observedOk: false,
    note: "Correctly blocked as sensitive credential data.",
  },
  {
    label: "blocked IBAN/payment text",
    requestText: "Meine IBAN lautet DE00 0000 0000 0000 0000 00. Bitte autorisiere die Zahlung an diesen Empfänger.",
    observedStatus: 402,
    observedCode: "sensitive_financial_data_blocked",
    observedOk: false,
    note: "Correctly blocked as sensitive financial data.",
  },
  {
    label: "blocked non-document general question",
    requestText: "Wie ist das Wetter heute in Berlin?",
    observedStatus: 400,
    observedCode: "no_document_signal_blocked",
    observedOk: false,
    note:
      "First attempt returned 429 smart_talk_rate_limited (rate limiter, not a Text Document Mode safety decision). After a 10-15 minute rate-limit reset, retest correctly returned 400 no_document_signal_blocked.",
  },
  {
    label: "blocked explicit paid document mode activation",
    requestText: "Ich möchte den kostenpflichtigen Dokumentenmodus aktivieren.",
    observedStatus: 402,
    observedCode: "paid_document_mode_blocked",
    observedOk: false,
    note: "Correctly blocked as explicit paid document mode activation (post-fix narrow detector still catches this).",
  },
];

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeEnabledLocalApiTestClosureResult {
  checkId: "8.9E-CLOSURE";
  allPassed: boolean;
  sourceFalsePositiveFixCommit: "f486ab6";
  sourceFalsePositiveFixPhase: "8.9E-BLOCKER";
  manualLocalTextDocumentEnabledApiRetestPerformed: true;
  testedMode: "text_document_controlled_runtime";
  testedContext: "anonymous";
  testedInputType: "text";
  testedLocale: "sk";
  localEnvFlagValueUsedForManualTest: "true";
  testedCases: readonly TestedCaseSummary[];
  allowedHealthInsuranceDocumentTextPassed: boolean;
  allowedHealthInsuranceStatus: 200;
  allowedHealthInsuranceOk: boolean;
  allowedHealthInsuranceMode: "text_document_controlled_runtime";
  allowedHealthInsuranceTextDocumentModeEnabled: boolean;
  allowedHealthInsuranceControlledRuntime: boolean;
  allowedHealthInsurancePastedTextOnly: boolean;
  allowedHealthInsuranceEightThreeAcNotRun: boolean;
  falsePositiveFixedByManualRetest: boolean;
  powerShellEncodingArtifactObserved: boolean;
  powerShellEncodingArtifactIsRouteSafetyBlocker: false;
  ocrPhotoRequestSafelyBlocked: boolean;
  ocrPhotoRequestStatus: 400;
  ocrPhotoRequestCode: "no_document_signal_blocked";
  ocrPhotoBlockCodeGenericButSafe: boolean;
  exactLegalDeadlineBlocked: boolean;
  exactLegalDeadlineStatus: 402;
  exactLegalDeadlineCode: "exact_legal_deadline_calculation_blocked";
  credentialTextBlocked: boolean;
  credentialTextStatus: 402;
  credentialTextCode: "sensitive_credential_data_blocked";
  ibanPaymentTextBlocked: boolean;
  ibanPaymentTextStatus: 402;
  ibanPaymentTextCode: "sensitive_financial_data_blocked";
  nonDocumentGeneralQuestionFirstAttemptRateLimited: boolean;
  nonDocumentGeneralQuestionFirstAttemptStatus: 429;
  nonDocumentGeneralQuestionRetestedAfterRateLimitReset: boolean;
  nonDocumentGeneralQuestionBlocked: boolean;
  nonDocumentGeneralQuestionStatus: 400;
  nonDocumentGeneralQuestionCode: "no_document_signal_blocked";
  explicitPaidActivationBlocked: boolean;
  explicitPaidActivationStatus: 402;
  explicitPaidActivationCode: "paid_document_mode_blocked";
  rateLimitObservedAndHandled: boolean;
  localEnvCleanupConfirmed: boolean;
  freeQaPublicEnvCleanupConfirmed: boolean;
  gitStatusShortCleanAfterManualTest: boolean;
  textDocumentEnabledPathPassedLocally: boolean;
  textDocumentRuntimeAuthorizedForProductionNow: false;
  photoOcrRuntimeStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  fileUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  credentialFinancialIdentityStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  documentTextTreatedAsSensitive: boolean;
  legalDisclaimerRequired: boolean;
  privacyDisclaimerRequired: boolean;
  liveRouteInvocationPerformedByThisClosure: false;
  liveModelCallPerformedByThisClosure: false;
  openAiSdkImported: false;
  fetchUsed: false;
  processEnvReadForAuthorization: false;
  filesWritten: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  readyForTextDocumentModeLocalRegressionPack: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  notes: string[];
}

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeEnabledLocalApiTestClosureResult(
  r: TextDocumentModeEnabledLocalApiTestClosureResult,
): boolean {
  if (r.checkId !== "8.9E-CLOSURE") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceFalsePositiveFixCommit !== "f486ab6") return false;
  if (r.sourceFalsePositiveFixPhase !== "8.9E-BLOCKER") return false;
  if (r.manualLocalTextDocumentEnabledApiRetestPerformed !== true) return false;
  if (r.testedMode !== "text_document_controlled_runtime") return false;
  if (r.testedContext !== "anonymous") return false;
  if (r.testedInputType !== "text") return false;
  if (r.testedLocale !== "sk") return false;
  if (r.localEnvFlagValueUsedForManualTest !== "true") return false;
  if (!Array.isArray(r.testedCases) || r.testedCases.length !== 7) return false;
  if (r.allowedHealthInsuranceDocumentTextPassed !== true) return false;
  if (r.allowedHealthInsuranceStatus !== 200) return false;
  if (r.allowedHealthInsuranceOk !== true) return false;
  if (r.allowedHealthInsuranceMode !== "text_document_controlled_runtime") return false;
  if (r.allowedHealthInsuranceTextDocumentModeEnabled !== true) return false;
  if (r.allowedHealthInsuranceControlledRuntime !== true) return false;
  if (r.allowedHealthInsurancePastedTextOnly !== true) return false;
  if (r.allowedHealthInsuranceEightThreeAcNotRun !== true) return false;
  if (r.falsePositiveFixedByManualRetest !== true) return false;
  if (r.powerShellEncodingArtifactObserved !== true) return false;
  if (r.powerShellEncodingArtifactIsRouteSafetyBlocker !== false) return false;
  if (r.ocrPhotoRequestSafelyBlocked !== true) return false;
  if (r.ocrPhotoRequestStatus !== 400) return false;
  if (r.ocrPhotoRequestCode !== "no_document_signal_blocked") return false;
  if (r.ocrPhotoBlockCodeGenericButSafe !== true) return false;
  if (r.exactLegalDeadlineBlocked !== true) return false;
  if (r.exactLegalDeadlineStatus !== 402) return false;
  if (r.exactLegalDeadlineCode !== "exact_legal_deadline_calculation_blocked") return false;
  if (r.credentialTextBlocked !== true) return false;
  if (r.credentialTextStatus !== 402) return false;
  if (r.credentialTextCode !== "sensitive_credential_data_blocked") return false;
  if (r.ibanPaymentTextBlocked !== true) return false;
  if (r.ibanPaymentTextStatus !== 402) return false;
  if (r.ibanPaymentTextCode !== "sensitive_financial_data_blocked") return false;
  if (r.nonDocumentGeneralQuestionFirstAttemptRateLimited !== true) return false;
  if (r.nonDocumentGeneralQuestionFirstAttemptStatus !== 429) return false;
  if (r.nonDocumentGeneralQuestionRetestedAfterRateLimitReset !== true) return false;
  if (r.nonDocumentGeneralQuestionBlocked !== true) return false;
  if (r.nonDocumentGeneralQuestionStatus !== 400) return false;
  if (r.nonDocumentGeneralQuestionCode !== "no_document_signal_blocked") return false;
  if (r.explicitPaidActivationBlocked !== true) return false;
  if (r.explicitPaidActivationStatus !== 402) return false;
  if (r.explicitPaidActivationCode !== "paid_document_mode_blocked") return false;
  if (r.rateLimitObservedAndHandled !== true) return false;
  if (r.localEnvCleanupConfirmed !== true) return false;
  if (r.freeQaPublicEnvCleanupConfirmed !== true) return false;
  if (r.gitStatusShortCleanAfterManualTest !== true) return false;
  if (r.textDocumentEnabledPathPassedLocally !== true) return false;
  if (r.textDocumentRuntimeAuthorizedForProductionNow !== false) return false;
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
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.credentialFinancialIdentityStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.documentTextTreatedAsSensitive !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformedByThisClosure !== false) return false;
  if (r.liveModelCallPerformedByThisClosure !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.processEnvReadForAuthorization !== false) return false;
  if (r.filesWritten !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForTextDocumentModeLocalRegressionPack !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Tamper cases (literal-flip on the final result object) ──────────────────

type Tamper89EClosureMutation = (
  r: TextDocumentModeEnabledLocalApiTestClosureResult,
) => TextDocumentModeEnabledLocalApiTestClosureResult;
interface Tamper89EClosureCase {
  label: string;
  mutate: Tamper89EClosureMutation;
}

const TEXT_DOCUMENT_MODE_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES: Tamper89EClosureCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9E-BLOCKER" as "8.9E-CLOSURE" }) },
  { label: "allPassed false (source 8.9E-BLOCKER not allPassed)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceFalsePositiveFixCommit wrong (source commit is not f486ab6)", mutate: (r) => ({ ...r, sourceFalsePositiveFixCommit: "0000000" as "f486ab6" }) },
  { label: "sourceFalsePositiveFixPhase wrong", mutate: (r) => ({ ...r, sourceFalsePositiveFixPhase: "8.9C" as "8.9E-BLOCKER" }) },
  { label: "manualLocalTextDocumentEnabledApiRetestPerformed false", mutate: (r) => ({ ...r, manualLocalTextDocumentEnabledApiRetestPerformed: false as true }) },
  { label: "testedMode wrong", mutate: (r) => ({ ...r, testedMode: "wrong_mode" as "text_document_controlled_runtime" }) },
  { label: "testedContext wrong", mutate: (r) => ({ ...r, testedContext: "authenticated" as "anonymous" }) },
  { label: "testedInputType wrong", mutate: (r) => ({ ...r, testedInputType: "question" as "text" }) },
  { label: "testedLocale wrong", mutate: (r) => ({ ...r, testedLocale: "de" as "sk" }) },
  { label: "localEnvFlagValueUsedForManualTest wrong", mutate: (r) => ({ ...r, localEnvFlagValueUsedForManualTest: "TRUE" as "true" }) },
  { label: "testedCases empty", mutate: (r) => ({ ...r, testedCases: [] }) },
  { label: "allowedHealthInsuranceDocumentTextPassed false", mutate: (r) => ({ ...r, allowedHealthInsuranceDocumentTextPassed: false }) },
  { label: "allowedHealthInsuranceStatus wrong (allowed health insurance case does not have status 200)", mutate: (r) => ({ ...r, allowedHealthInsuranceStatus: 402 as 200 }) },
  { label: "allowedHealthInsuranceOk false (allowed health insurance ok is not true)", mutate: (r) => ({ ...r, allowedHealthInsuranceOk: false }) },
  { label: "allowedHealthInsuranceMode wrong (allowed health insurance mode changes)", mutate: (r) => ({ ...r, allowedHealthInsuranceMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "allowedHealthInsuranceTextDocumentModeEnabled false (allowed textDocumentModeEnabled is not true)", mutate: (r) => ({ ...r, allowedHealthInsuranceTextDocumentModeEnabled: false }) },
  { label: "allowedHealthInsuranceControlledRuntime false", mutate: (r) => ({ ...r, allowedHealthInsuranceControlledRuntime: false }) },
  { label: "allowedHealthInsurancePastedTextOnly false", mutate: (r) => ({ ...r, allowedHealthInsurancePastedTextOnly: false }) },
  { label: "allowedHealthInsuranceEightThreeAcNotRun false", mutate: (r) => ({ ...r, allowedHealthInsuranceEightThreeAcNotRun: false }) },
  { label: "falsePositiveFixedByManualRetest false", mutate: (r) => ({ ...r, falsePositiveFixedByManualRetest: false }) },
  { label: "powerShellEncodingArtifactObserved false", mutate: (r) => ({ ...r, powerShellEncodingArtifactObserved: false }) },
  { label: "powerShellEncodingArtifactIsRouteSafetyBlocker true", mutate: (r) => ({ ...r, powerShellEncodingArtifactIsRouteSafetyBlocker: true as false }) },
  { label: "ocrPhotoRequestSafelyBlocked false (OCR/photo request becomes allowed 200)", mutate: (r) => ({ ...r, ocrPhotoRequestSafelyBlocked: false }) },
  { label: "ocrPhotoRequestStatus wrong (OCR/photo request becomes allowed 200)", mutate: (r) => ({ ...r, ocrPhotoRequestStatus: 200 as 400 }) },
  { label: "ocrPhotoRequestCode wrong", mutate: (r) => ({ ...r, ocrPhotoRequestCode: "ok" as "no_document_signal_blocked" }) },
  { label: "ocrPhotoBlockCodeGenericButSafe false", mutate: (r) => ({ ...r, ocrPhotoBlockCodeGenericButSafe: false }) },
  { label: "exactLegalDeadlineBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineBlocked: false }) },
  { label: "exactLegalDeadlineStatus wrong", mutate: (r) => ({ ...r, exactLegalDeadlineStatus: 200 as 402 }) },
  { label: "exactLegalDeadlineCode wrong", mutate: (r) => ({ ...r, exactLegalDeadlineCode: "ok" as "exact_legal_deadline_calculation_blocked" }) },
  { label: "credentialTextBlocked false (credential/API key text becomes allowed)", mutate: (r) => ({ ...r, credentialTextBlocked: false }) },
  { label: "credentialTextStatus wrong", mutate: (r) => ({ ...r, credentialTextStatus: 200 as 402 }) },
  { label: "credentialTextCode wrong", mutate: (r) => ({ ...r, credentialTextCode: "ok" as "sensitive_credential_data_blocked" }) },
  { label: "ibanPaymentTextBlocked false (IBAN/payment text becomes allowed)", mutate: (r) => ({ ...r, ibanPaymentTextBlocked: false }) },
  { label: "ibanPaymentTextStatus wrong", mutate: (r) => ({ ...r, ibanPaymentTextStatus: 200 as 402 }) },
  { label: "ibanPaymentTextCode wrong", mutate: (r) => ({ ...r, ibanPaymentTextCode: "ok" as "sensitive_financial_data_blocked" }) },
  { label: "nonDocumentGeneralQuestionFirstAttemptRateLimited false (rate limit observation mishandled)", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionFirstAttemptRateLimited: false }) },
  { label: "nonDocumentGeneralQuestionFirstAttemptStatus wrong", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionFirstAttemptStatus: 200 as 429 }) },
  { label: "nonDocumentGeneralQuestionRetestedAfterRateLimitReset false (rate limit observation mishandled)", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionRetestedAfterRateLimitReset: false }) },
  { label: "nonDocumentGeneralQuestionBlocked false (non-document general question becomes allowed)", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionBlocked: false }) },
  { label: "nonDocumentGeneralQuestionStatus wrong", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionStatus: 200 as 400 }) },
  { label: "nonDocumentGeneralQuestionCode wrong", mutate: (r) => ({ ...r, nonDocumentGeneralQuestionCode: "ok" as "no_document_signal_blocked" }) },
  { label: "explicitPaidActivationBlocked false (explicit paid activation becomes allowed)", mutate: (r) => ({ ...r, explicitPaidActivationBlocked: false }) },
  { label: "explicitPaidActivationStatus wrong", mutate: (r) => ({ ...r, explicitPaidActivationStatus: 200 as 402 }) },
  { label: "explicitPaidActivationCode wrong (explicit paid activation code is not paid_document_mode_blocked)", mutate: (r) => ({ ...r, explicitPaidActivationCode: "ok" as "paid_document_mode_blocked" }) },
  { label: "rateLimitObservedAndHandled false (rate limit observation mishandled)", mutate: (r) => ({ ...r, rateLimitObservedAndHandled: false }) },
  { label: "localEnvCleanupConfirmed false (local env cleanup is not confirmed)", mutate: (r) => ({ ...r, localEnvCleanupConfirmed: false }) },
  { label: "freeQaPublicEnvCleanupConfirmed false (local env cleanup is not confirmed)", mutate: (r) => ({ ...r, freeQaPublicEnvCleanupConfirmed: false }) },
  { label: "gitStatusShortCleanAfterManualTest false (git status clean is not confirmed)", mutate: (r) => ({ ...r, gitStatusShortCleanAfterManualTest: false }) },
  { label: "textDocumentEnabledPathPassedLocally false", mutate: (r) => ({ ...r, textDocumentEnabledPathPassedLocally: false }) },
  { label: "textDocumentRuntimeAuthorizedForProductionNow true", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedForProductionNow: true as false }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (DNA becomes allowed)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence becomes allowed)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (DB storage becomes allowed)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true (production becomes true)", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true (go-live becomes true)", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "credentialFinancialIdentityStillBlocked false (credential/financial/identity protection becomes allowed)", mutate: (r) => ({ ...r, credentialFinancialIdentityStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisClosure true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisClosure: true as false }) },
  { label: "liveModelCallPerformedByThisClosure true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisClosure: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvReadForAuthorization true (claims env authorization access)", mutate: (r) => ({ ...r, processEnvReadForAuthorization: true as false }) },
  { label: "filesWritten true (claims file writes)", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForTextDocumentModeLocalRegressionPack false", mutate: (r) => ({ ...r, readyForTextDocumentModeLocalRegressionPack: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export function runTextDocumentModeEnabledLocalApiTestClosure(): TextDocumentModeEnabledLocalApiTestClosureResult {
  const closureFailures: string[] = [];

  // ── Call 8.9E-BLOCKER audit runner as source of truth ───────────────────────
  const b = runTextDocumentModeEnabledPathFalsePositiveFixAudit();
  if (b.checkId !== "8.9E-BLOCKER") closureFailures.push(`8.9E-BLOCKER checkId mismatch: expected "8.9E-BLOCKER", got "${b.checkId}"`);
  if (b.allPassed !== true) closureFailures.push("8.9E-BLOCKER allPassed is not true");
  if (b.falsePositiveFixApplied !== true) closureFailures.push("8.9E-BLOCKER falsePositiveFixApplied is not true");
  if (b.normalHealthInsuranceDocumentTextAllowedByStaticRegression !== true)
    closureFailures.push("8.9E-BLOCKER normalHealthInsuranceDocumentTextAllowedByStaticRegression is not true");
  if (b.explicitPaidActivationStillBlockedByStaticRegression !== true)
    closureFailures.push("8.9E-BLOCKER explicitPaidActivationStillBlockedByStaticRegression is not true");
  if (b.broadDocumentTextNoLongerPaidModeTrigger !== true)
    closureFailures.push("8.9E-BLOCKER broadDocumentTextNoLongerPaidModeTrigger is not true");
  if (b.readyForControlledLocalTextDocumentEnabledApiRetest !== true)
    closureFailures.push("8.9E-BLOCKER readyForControlledLocalTextDocumentEnabledApiRetest is not true");
  if (b.readyForTextDocumentRuntime !== false) closureFailures.push("8.9E-BLOCKER readyForTextDocumentRuntime is not false");
  if (b.readyForPhotoOcrRuntime !== false) closureFailures.push("8.9E-BLOCKER readyForPhotoOcrRuntime is not false");
  if (b.readyForPublicRuntime !== false) closureFailures.push("8.9E-BLOCKER readyForPublicRuntime is not false");
  if (b.readyForProduction !== false) closureFailures.push("8.9E-BLOCKER readyForProduction is not false");
  if (b.readyForGoLive !== false) closureFailures.push("8.9E-BLOCKER readyForGoLive is not false");
  if (b.tamperRejected !== b.tamperCount) closureFailures.push("8.9E-BLOCKER own tamper count mismatch");

  // ── Validate the seven observed manual test case records ────────────────────
  const allowedCase = TESTED_CASES[0];
  const ocrCase = TESTED_CASES[1];
  const deadlineCase = TESTED_CASES[2];
  const credentialCase = TESTED_CASES[3];
  const ibanCase = TESTED_CASES[4];
  const generalQuestionCase = TESTED_CASES[5];
  const paidActivationCase = TESTED_CASES[6];

  if (allowedCase.observedStatus !== 200 || allowedCase.observedOk !== true)
    closureFailures.push("observed allowed health-insurance case did not have status 200 / ok true");
  if (ocrCase.observedStatus === 200) closureFailures.push("observed OCR/photo case incorrectly allowed (status 200)");
  if (deadlineCase.observedStatus === 200) closureFailures.push("observed exact legal deadline case incorrectly allowed (status 200)");
  if (credentialCase.observedStatus === 200) closureFailures.push("observed credential case incorrectly allowed (status 200)");
  if (ibanCase.observedStatus === 200) closureFailures.push("observed IBAN/payment case incorrectly allowed (status 200)");
  if (generalQuestionCase.observedStatus === 200) closureFailures.push("observed non-document general question case incorrectly allowed (status 200)");
  if (paidActivationCase.observedStatus === 200 || paidActivationCase.observedCode !== "paid_document_mode_blocked")
    closureFailures.push("observed explicit paid activation case incorrectly allowed or wrong code");

  const notes: string[] = [
    "IN-01: 8.9E-CLOSURE records the observed results of a MANUAL local controlled retest of the enabled Text Document Mode path after the 8.9E-BLOCKER false-positive fix; this file performs no live route/model/fetch/env-authorization access of its own.",
    `IN-02: 8.9E-BLOCKER audit confirmed — checkId=${b.checkId}, allPassed=${b.allPassed}, falsePositiveFixApplied=${b.falsePositiveFixApplied}.`,
    "IN-03: manual test 1/7 (normal health-insurance document text) returned 200/ok=true with textDocumentModeEnabled=true, controlledTextDocumentRuntime=true, pastedTextOnly=true, confirming the false positive from 8.9E-BLOCKER is fixed. PowerShell displayed mojibake/encoding artifacts for the Slovak/German diacritics; this is a terminal display/encoding artifact only and not a route or safety decision.",
    "IN-04: manual test 2/7 (OCR/photo request) was safely blocked with 400 no_document_signal_blocked — a generic-but-safe code (not the more specific photo_ocr_blocked), and did not return 200.",
    "IN-05: manual tests 3-5/7 (exact legal deadline, credential/API key, IBAN/payment) were all correctly blocked with 402 and their expected specific codes.",
    "IN-06: manual test 6/7 (non-document general question) first returned 429 smart_talk_rate_limited (rate limiter, unrelated to Text Document Mode safety logic); after a 10-15 minute rate-limit reset, the retest correctly returned 400 no_document_signal_blocked.",
    "IN-07: manual test 7/7 (explicit paid document mode activation) was correctly blocked with 402 paid_document_mode_blocked, confirming the narrow detector from 8.9E-BLOCKER still catches genuine paid-activation intent after the false-positive fix.",
    "IN-08: local environment cleanup was confirmed for both SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED and SMART_TALK_FREE_QA_PUBLIC_ENABLED (Test-Path returned False for both), and git status --short was confirmed clean after the manual test session.",
    "IN-09: text document runtime, photo/OCR runtime, public runtime, production, and go-live all remain unauthorized; this closure does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length;

  const provisional: TextDocumentModeEnabledLocalApiTestClosureResult = {
    checkId: "8.9E-CLOSURE",
    allPassed: true,
    sourceFalsePositiveFixCommit: "f486ab6",
    sourceFalsePositiveFixPhase: "8.9E-BLOCKER",
    manualLocalTextDocumentEnabledApiRetestPerformed: true,
    testedMode: "text_document_controlled_runtime",
    testedContext: "anonymous",
    testedInputType: "text",
    testedLocale: "sk",
    localEnvFlagValueUsedForManualTest: "true",
    testedCases: TESTED_CASES,
    allowedHealthInsuranceDocumentTextPassed: true,
    allowedHealthInsuranceStatus: 200,
    allowedHealthInsuranceOk: true,
    allowedHealthInsuranceMode: "text_document_controlled_runtime",
    allowedHealthInsuranceTextDocumentModeEnabled: true,
    allowedHealthInsuranceControlledRuntime: true,
    allowedHealthInsurancePastedTextOnly: true,
    allowedHealthInsuranceEightThreeAcNotRun: true,
    falsePositiveFixedByManualRetest: true,
    powerShellEncodingArtifactObserved: true,
    powerShellEncodingArtifactIsRouteSafetyBlocker: false,
    ocrPhotoRequestSafelyBlocked: true,
    ocrPhotoRequestStatus: 400,
    ocrPhotoRequestCode: "no_document_signal_blocked",
    ocrPhotoBlockCodeGenericButSafe: true,
    exactLegalDeadlineBlocked: true,
    exactLegalDeadlineStatus: 402,
    exactLegalDeadlineCode: "exact_legal_deadline_calculation_blocked",
    credentialTextBlocked: true,
    credentialTextStatus: 402,
    credentialTextCode: "sensitive_credential_data_blocked",
    ibanPaymentTextBlocked: true,
    ibanPaymentTextStatus: 402,
    ibanPaymentTextCode: "sensitive_financial_data_blocked",
    nonDocumentGeneralQuestionFirstAttemptRateLimited: true,
    nonDocumentGeneralQuestionFirstAttemptStatus: 429,
    nonDocumentGeneralQuestionRetestedAfterRateLimitReset: true,
    nonDocumentGeneralQuestionBlocked: true,
    nonDocumentGeneralQuestionStatus: 400,
    nonDocumentGeneralQuestionCode: "no_document_signal_blocked",
    explicitPaidActivationBlocked: true,
    explicitPaidActivationStatus: 402,
    explicitPaidActivationCode: "paid_document_mode_blocked",
    rateLimitObservedAndHandled: true,
    localEnvCleanupConfirmed: true,
    freeQaPublicEnvCleanupConfirmed: true,
    gitStatusShortCleanAfterManualTest: true,
    textDocumentEnabledPathPassedLocally: true,
    textDocumentRuntimeAuthorizedForProductionNow: false,
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
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    credentialFinancialIdentityStillBlocked: true,
    modelOutputStillUntrusted: true,
    documentTextTreatedAsSensitive: true,
    legalDisclaimerRequired: true,
    privacyDisclaimerRequired: true,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImported: false,
    fetchUsed: false,
    processEnvReadForAuthorization: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    readyForTextDocumentModeLocalRegressionPack: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    notes,
  };

  if (!_isCanonicalTextDocumentModeEnabledLocalApiTestClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_ENABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeEnabledLocalApiTestClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9E-CLOSURE tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed =
    closureFailures.length === 0 &&
    b.checkId === "8.9E-BLOCKER" &&
    b.allPassed === true &&
    b.falsePositiveFixApplied === true &&
    provisional.allowedHealthInsuranceDocumentTextPassed === true &&
    provisional.ocrPhotoRequestSafelyBlocked === true &&
    provisional.exactLegalDeadlineBlocked === true &&
    provisional.credentialTextBlocked === true &&
    provisional.ibanPaymentTextBlocked === true &&
    provisional.nonDocumentGeneralQuestionBlocked === true &&
    provisional.explicitPaidActivationBlocked === true &&
    provisional.localEnvCleanupConfirmed === true &&
    provisional.freeQaPublicEnvCleanupConfirmed === true &&
    provisional.gitStatusShortCleanAfterManualTest === true &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9E-CLOSURE tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForTextDocumentModeLocalRegressionPack: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9E-CLOSURE result as JSON. No network/model/env-authorization
// access is performed here; only process.argv[1] is read to detect direct
// execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-enabled-local-api-test-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeEnabledLocalApiTestClosure(), null, 2));
}
