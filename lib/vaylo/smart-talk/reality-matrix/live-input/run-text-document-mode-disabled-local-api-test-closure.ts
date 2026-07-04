/**
 * PHASE 8.9D-CLOSURE — Controlled Local Text Document Disabled-Path API Test Closure
 *
 * Permanent local closure/audit for the MANUAL 8.9D controlled local API test,
 * which exercised the disabled path of the text_document_controlled_runtime
 * branch (5 non-exact env flag variants) that was observed to complete
 * externally to this file. This closure records those observed results and
 * re-confirms the 8.9C safety audit as source of truth.
 *
 * This phase does NOT call /api/smart-talk, does NOT start a dev server,
 * does NOT call the model/OpenAI/fetch, does NOT read process.env for
 * authorization, does NOT write files, does NOT touch DB/storage, and does
 * NOT run 8.3AC. It is pure/local/static only.
 */

import { runTextDocumentModeMinimalRoutePatchSafetyAudit } from "./run-text-document-mode-minimal-route-patch-safety-audit";

// ─── Result type ────────────────────────────────────────────────────────────

interface TestedDisabledFlagCase {
  label: string;
  flagValue: string | "absent";
  status: 403;
  code: "text_document_mode_disabled";
  textDocumentModeEnabled: false;
  controlledTextDocumentRuntime: false;
  passed: boolean;
}

interface TextDocumentModeDisabledLocalApiTestClosureResult {
  checkId: "8.9D-CLOSURE";
  allPassed: boolean;
  sourceRoutePatchCommit: "483ed41";
  sourceRoutePatchPhase: "8.9C";
  manualLocalTextDocumentDisabledApiTestPerformed: true;
  testedMode: "text_document_controlled_runtime";
  testedContext: "anonymous";
  testedInputType: "text";
  testedLocale: "sk";
  testedSyntheticTextKind: "health_insurance_letter_text";
  absentFlagTestPassed: boolean;
  absentFlagStatus: 403;
  absentFlagCode: "text_document_mode_disabled";
  falseFlagTestPassed: boolean;
  falseFlagStatus: 403;
  falseFlagCode: "text_document_mode_disabled";
  uppercaseTrueFlagTestPassed: boolean;
  uppercaseTrueFlagStatus: 403;
  uppercaseTrueFlagCode: "text_document_mode_disabled";
  numericOneFlagTestPassed: boolean;
  numericOneFlagStatus: 403;
  numericOneFlagCode: "text_document_mode_disabled";
  yesFlagTestPassed: boolean;
  yesFlagStatus: 403;
  yesFlagCode: "text_document_mode_disabled";
  exactEnvFlagGateConfirmed: boolean;
  nonExactEnvValuesRejected: boolean;
  disabledPathFailClosedConfirmed: boolean;
  disabledPathBeforeModelCallConfirmed: boolean;
  textDocumentRuntimeStillBlocked: boolean;
  textDocumentRuntimeAuthorizedNow: false;
  photoOcrRuntimeStillBlocked: boolean;
  publicRuntimeStillBlocked: boolean;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
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
  localEnvCleanupConfirmed: boolean;
  freeQaPublicEnvCleanupConfirmed: boolean;
  gitStatusShortCleanAfterManualTest: boolean;
  readyForControlledLocalTextDocumentEnabledApiTestPlanning: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  testedCases: TestedDisabledFlagCase[];
  notes: string[];
}

// ─── Observed manual 8.9D test cases (recorded, not executed here) ─────────────

const TESTED_DISABLED_FLAG_CASES: TestedDisabledFlagCase[] = [
  {
    label: "absent_flag",
    flagValue: "absent",
    status: 403,
    code: "text_document_mode_disabled",
    textDocumentModeEnabled: false,
    controlledTextDocumentRuntime: false,
    passed: true,
  },
  {
    label: "false_flag",
    flagValue: "false",
    status: 403,
    code: "text_document_mode_disabled",
    textDocumentModeEnabled: false,
    controlledTextDocumentRuntime: false,
    passed: true,
  },
  {
    label: "uppercase_true_flag",
    flagValue: "TRUE",
    status: 403,
    code: "text_document_mode_disabled",
    textDocumentModeEnabled: false,
    controlledTextDocumentRuntime: false,
    passed: true,
  },
  {
    label: "numeric_one_flag",
    flagValue: "1",
    status: 403,
    code: "text_document_mode_disabled",
    textDocumentModeEnabled: false,
    controlledTextDocumentRuntime: false,
    passed: true,
  },
  {
    label: "yes_flag",
    flagValue: "yes",
    status: 403,
    code: "text_document_mode_disabled",
    textDocumentModeEnabled: false,
    controlledTextDocumentRuntime: false,
    passed: true,
  },
];

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeDisabledLocalApiTestClosureResult(
  r: TextDocumentModeDisabledLocalApiTestClosureResult,
): boolean {
  if (r.checkId !== "8.9D-CLOSURE") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceRoutePatchCommit !== "483ed41") return false;
  if (r.sourceRoutePatchPhase !== "8.9C") return false;
  if (r.manualLocalTextDocumentDisabledApiTestPerformed !== true) return false;
  if (r.testedMode !== "text_document_controlled_runtime") return false;
  if (r.testedContext !== "anonymous") return false;
  if (r.testedInputType !== "text") return false;
  if (r.testedLocale !== "sk") return false;
  if (r.testedSyntheticTextKind !== "health_insurance_letter_text") return false;
  if (r.absentFlagTestPassed !== true) return false;
  if (r.absentFlagStatus !== 403) return false;
  if (r.absentFlagCode !== "text_document_mode_disabled") return false;
  if (r.falseFlagTestPassed !== true) return false;
  if (r.falseFlagStatus !== 403) return false;
  if (r.falseFlagCode !== "text_document_mode_disabled") return false;
  if (r.uppercaseTrueFlagTestPassed !== true) return false;
  if (r.uppercaseTrueFlagStatus !== 403) return false;
  if (r.uppercaseTrueFlagCode !== "text_document_mode_disabled") return false;
  if (r.numericOneFlagTestPassed !== true) return false;
  if (r.numericOneFlagStatus !== 403) return false;
  if (r.numericOneFlagCode !== "text_document_mode_disabled") return false;
  if (r.yesFlagTestPassed !== true) return false;
  if (r.yesFlagStatus !== 403) return false;
  if (r.yesFlagCode !== "text_document_mode_disabled") return false;
  if (r.exactEnvFlagGateConfirmed !== true) return false;
  if (r.nonExactEnvValuesRejected !== true) return false;
  if (r.disabledPathFailClosedConfirmed !== true) return false;
  if (r.disabledPathBeforeModelCallConfirmed !== true) return false;
  if (r.textDocumentRuntimeStillBlocked !== true) return false;
  if (r.textDocumentRuntimeAuthorizedNow !== false) return false;
  if (r.photoOcrRuntimeStillBlocked !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
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
  if (r.localEnvCleanupConfirmed !== true) return false;
  if (r.freeQaPublicEnvCleanupConfirmed !== true) return false;
  if (r.gitStatusShortCleanAfterManualTest !== true) return false;
  if (r.readyForControlledLocalTextDocumentEnabledApiTestPlanning !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!r.testedCases || r.testedCases.length !== 5) return false;
  if (r.testedCases.some((c) => c.passed !== true || c.status !== 403 || c.code !== "text_document_mode_disabled"))
    return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper89DClosureMutation = (
  r: TextDocumentModeDisabledLocalApiTestClosureResult,
) => TextDocumentModeDisabledLocalApiTestClosureResult;
interface Tamper89DClosureCase {
  label: string;
  mutate: Tamper89DClosureMutation;
}

const TEXT_DOCUMENT_MODE_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES: Tamper89DClosureCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9C" as "8.9D-CLOSURE" }) },
  { label: "allPassed false (source 8.9C allPassed treated as false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceRoutePatchCommit wrong", mutate: (r) => ({ ...r, sourceRoutePatchCommit: "0000000" as "483ed41" }) },
  { label: "sourceRoutePatchPhase wrong", mutate: (r) => ({ ...r, sourceRoutePatchPhase: "8.9B" as "8.9C" }) },
  { label: "manualLocalTextDocumentDisabledApiTestPerformed false", mutate: (r) => ({ ...r, manualLocalTextDocumentDisabledApiTestPerformed: false as true }) },
  { label: "testedMode wrong", mutate: (r) => ({ ...r, testedMode: "free_qa_public_beta" as "text_document_controlled_runtime" }) },
  { label: "testedContext wrong", mutate: (r) => ({ ...r, testedContext: "controlled_test" as "anonymous" }) },
  { label: "testedInputType wrong", mutate: (r) => ({ ...r, testedInputType: "question" as "text" }) },
  { label: "testedLocale wrong", mutate: (r) => ({ ...r, testedLocale: "de" as "sk" }) },
  { label: "testedSyntheticTextKind wrong", mutate: (r) => ({ ...r, testedSyntheticTextKind: "generic_question_text" as "health_insurance_letter_text" }) },
  { label: "absentFlagTestPassed false (absent-flag test status/code changes)", mutate: (r) => ({ ...r, absentFlagTestPassed: false }) },
  { label: "absentFlagStatus wrong", mutate: (r) => ({ ...r, absentFlagStatus: 200 as 403 }) },
  { label: "absentFlagCode wrong", mutate: (r) => ({ ...r, absentFlagCode: "ok" as "text_document_mode_disabled" }) },
  { label: "falseFlagTestPassed false (false-flag test status/code changes)", mutate: (r) => ({ ...r, falseFlagTestPassed: false }) },
  { label: "falseFlagStatus wrong", mutate: (r) => ({ ...r, falseFlagStatus: 200 as 403 }) },
  { label: "falseFlagCode wrong", mutate: (r) => ({ ...r, falseFlagCode: "ok" as "text_document_mode_disabled" }) },
  { label: "uppercaseTrueFlagTestPassed false (uppercase-TRUE-flag test status/code changes)", mutate: (r) => ({ ...r, uppercaseTrueFlagTestPassed: false }) },
  { label: "uppercaseTrueFlagStatus wrong", mutate: (r) => ({ ...r, uppercaseTrueFlagStatus: 200 as 403 }) },
  { label: "uppercaseTrueFlagCode wrong", mutate: (r) => ({ ...r, uppercaseTrueFlagCode: "ok" as "text_document_mode_disabled" }) },
  { label: "numericOneFlagTestPassed false (numeric-1-flag test status/code changes)", mutate: (r) => ({ ...r, numericOneFlagTestPassed: false }) },
  { label: "numericOneFlagStatus wrong", mutate: (r) => ({ ...r, numericOneFlagStatus: 200 as 403 }) },
  { label: "numericOneFlagCode wrong", mutate: (r) => ({ ...r, numericOneFlagCode: "ok" as "text_document_mode_disabled" }) },
  { label: "yesFlagTestPassed false (yes-flag test status/code changes)", mutate: (r) => ({ ...r, yesFlagTestPassed: false }) },
  { label: "yesFlagStatus wrong", mutate: (r) => ({ ...r, yesFlagStatus: 200 as 403 }) },
  { label: "yesFlagCode wrong", mutate: (r) => ({ ...r, yesFlagCode: "ok" as "text_document_mode_disabled" }) },
  { label: "exactEnvFlagGateConfirmed false (exact env flag gate is not confirmed)", mutate: (r) => ({ ...r, exactEnvFlagGateConfirmed: false }) },
  { label: "nonExactEnvValuesRejected false (non-exact env values are not rejected)", mutate: (r) => ({ ...r, nonExactEnvValuesRejected: false }) },
  { label: "disabledPathFailClosedConfirmed false (disabled path is not fail-closed)", mutate: (r) => ({ ...r, disabledPathFailClosedConfirmed: false }) },
  { label: "disabledPathBeforeModelCallConfirmed false", mutate: (r) => ({ ...r, disabledPathBeforeModelCallConfirmed: false }) },
  { label: "textDocumentRuntimeStillBlocked false", mutate: (r) => ({ ...r, textDocumentRuntimeStillBlocked: false }) },
  { label: "textDocumentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, textDocumentRuntimeAuthorizedNow: true as false }) },
  { label: "photoOcrRuntimeStillBlocked false (photo/OCR runtime becomes ready)", mutate: (r) => ({ ...r, photoOcrRuntimeStillBlocked: false }) },
  { label: "publicRuntimeStillBlocked false (public runtime becomes ready)", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA becomes allowed)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence becomes allowed)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (DB storage becomes allowed)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false (model output becomes trusted)", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "documentTextTreatedAsSensitive false", mutate: (r) => ({ ...r, documentTextTreatedAsSensitive: false }) },
  { label: "legalDisclaimerRequired false (legal disclaimer becomes optional)", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "privacyDisclaimerRequired false (privacy disclaimer becomes optional)", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformedByThisClosure true (claims live route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformedByThisClosure: true as false }) },
  { label: "liveModelCallPerformedByThisClosure true (claims live model access)", mutate: (r) => ({ ...r, liveModelCallPerformedByThisClosure: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvReadForAuthorization true (claims env read for authorization)", mutate: (r) => ({ ...r, processEnvReadForAuthorization: true as false }) },
  { label: "filesWritten true (claims file writes)", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "localEnvCleanupConfirmed false (local env cleanup is not confirmed)", mutate: (r) => ({ ...r, localEnvCleanupConfirmed: false }) },
  { label: "freeQaPublicEnvCleanupConfirmed false", mutate: (r) => ({ ...r, freeQaPublicEnvCleanupConfirmed: false }) },
  { label: "gitStatusShortCleanAfterManualTest false (git status clean is not confirmed)", mutate: (r) => ({ ...r, gitStatusShortCleanAfterManualTest: false }) },
  { label: "readyForControlledLocalTextDocumentEnabledApiTestPlanning false", mutate: (r) => ({ ...r, readyForControlledLocalTextDocumentEnabledApiTestPlanning: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "testedCases empty", mutate: (r) => ({ ...r, testedCases: [] }) },
  {
    label: "one testedCase flipped to not passed",
    mutate: (r) => ({
      ...r,
      testedCases: r.testedCases.map((c, idx) => (idx === 0 ? { ...c, passed: false } : c)),
    }),
  },
  {
    label: "one testedCase status changed",
    mutate: (r) => ({
      ...r,
      testedCases: r.testedCases.map((c, idx) => (idx === 1 ? { ...c, status: 200 as 403 } : c)),
    }),
  },
  {
    label: "one testedCase code changed",
    mutate: (r) => ({
      ...r,
      testedCases: r.testedCases.map((c, idx) => (idx === 2 ? { ...c, code: "ok" as "text_document_mode_disabled" } : c)),
    }),
  },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export function runTextDocumentModeDisabledLocalApiTestClosure(): TextDocumentModeDisabledLocalApiTestClosureResult {
  const closureFailures: string[] = [];

  // ── Call 8.9C minimal route patch safety audit runner as source of truth ───
  const c = runTextDocumentModeMinimalRoutePatchSafetyAudit();
  if (c.checkId !== "8.9C") closureFailures.push(`8.9C checkId mismatch: expected "8.9C", got "${c.checkId}"`);
  if (c.allPassed !== true) closureFailures.push("8.9C allPassed is not true");
  if (c.sourcePlanCommit !== "29e91c6") closureFailures.push("8.9C sourcePlanCommit mismatch");
  if (c.sourcePlanPhase !== "8.9B") closureFailures.push("8.9C sourcePlanPhase mismatch");
  if (c.modeDetected !== true) closureFailures.push("8.9C modeDetected is not true");
  if (c.envFlagDetected !== true) closureFailures.push("8.9C envFlagDetected is not true");
  if (c.exactEnvFlagOnlyDetected !== true) closureFailures.push("8.9C exactEnvFlagOnlyDetected is not true");
  if (c.disabledPathFailClosedDetected !== true) closureFailures.push("8.9C disabledPathFailClosedDetected is not true");
  if (c.disabledPathStatus403Detected !== true) closureFailures.push("8.9C disabledPathStatus403Detected is not true");
  if (c.disabledPathBeforeModelCallDetected !== true) closureFailures.push("8.9C disabledPathBeforeModelCallDetected is not true");
  if (c.paidDnaPersistenceStorageBlocksDetected !== true) closureFailures.push("8.9C paidDnaPersistenceStorageBlocksDetected is not true");
  if (c.exactLegalDeadlineBlockBeforeModelCallDetected !== true) closureFailures.push("8.9C exactLegalDeadlineBlockBeforeModelCallDetected is not true");
  if (c.highRiskEscalationBlocksDetected !== true) closureFailures.push("8.9C highRiskEscalationBlocksDetected is not true");
  if (c.successMetadataDetected !== true) closureFailures.push("8.9C successMetadataDetected is not true");
  if (c.dbStorageWriteAdded !== false) closureFailures.push("8.9C dbStorageWriteAdded is not false");
  if (c.ocrUploadHandlerAdded !== false) closureFailures.push("8.9C ocrUploadHandlerAdded is not false");
  if (c.readyForControlledLocalTextDocumentDisabledApiTest !== true)
    closureFailures.push("8.9C readyForControlledLocalTextDocumentDisabledApiTest is not true");
  if (c.readyForTextDocumentRuntime !== false) closureFailures.push("8.9C readyForTextDocumentRuntime is not false");
  if (c.readyForPhotoOcrRuntime !== false) closureFailures.push("8.9C readyForPhotoOcrRuntime is not false");
  if (c.readyForPublicRuntime !== false) closureFailures.push("8.9C readyForPublicRuntime is not false");
  if (c.readyForProduction !== false) closureFailures.push("8.9C readyForProduction is not false");
  if (c.readyForGoLive !== false) closureFailures.push("8.9C readyForGoLive is not false");
  if (c.tamperRejected !== c.tamperCount) closureFailures.push("8.9C own tamper count mismatch");

  const allFiveTestedCasesPassed = TESTED_DISABLED_FLAG_CASES.every(
    (t) => t.passed === true && t.status === 403 && t.code === "text_document_mode_disabled",
  );
  if (!allFiveTestedCasesPassed) closureFailures.push("one or more of the five observed disabled-path tests did not pass with status 403 / code text_document_mode_disabled");

  const notes: string[] = [
    "IN-01: 8.9D-CLOSURE records the OBSERVED results of the manual 8.9D controlled local API test; it does not itself invoke the route, model, or fetch.",
    `IN-02: 8.9C confirmed — checkId=${c.checkId}, allPassed=${c.allPassed}, sourcePlanCommit=29e91c6 (expected), modeDetected=${c.modeDetected}, envFlagDetected=${c.envFlagDetected}.`,
    "IN-03: five non-exact SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED values (absent, \"false\", \"TRUE\", \"1\", \"yes\") were manually tested against the text_document_controlled_runtime mode and all correctly returned 403 text_document_mode_disabled with textDocumentModeEnabled=false and controlledTextDocumentRuntime=false.",
    "IN-04: local environment cleanup was manually confirmed for both SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED and SMART_TALK_FREE_QA_PUBLIC_ENABLED, and git status --short was confirmed clean after the manual test.",
    "IN-05: text document runtime, photo/OCR runtime, public runtime, production, and go-live all remain unauthorized by this closure.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES.length;

  const provisional: TextDocumentModeDisabledLocalApiTestClosureResult = {
    checkId: "8.9D-CLOSURE",
    allPassed: true,
    sourceRoutePatchCommit: "483ed41",
    sourceRoutePatchPhase: "8.9C",
    manualLocalTextDocumentDisabledApiTestPerformed: true,
    testedMode: "text_document_controlled_runtime",
    testedContext: "anonymous",
    testedInputType: "text",
    testedLocale: "sk",
    testedSyntheticTextKind: "health_insurance_letter_text",
    absentFlagTestPassed: true,
    absentFlagStatus: 403,
    absentFlagCode: "text_document_mode_disabled",
    falseFlagTestPassed: true,
    falseFlagStatus: 403,
    falseFlagCode: "text_document_mode_disabled",
    uppercaseTrueFlagTestPassed: true,
    uppercaseTrueFlagStatus: 403,
    uppercaseTrueFlagCode: "text_document_mode_disabled",
    numericOneFlagTestPassed: true,
    numericOneFlagStatus: 403,
    numericOneFlagCode: "text_document_mode_disabled",
    yesFlagTestPassed: true,
    yesFlagStatus: 403,
    yesFlagCode: "text_document_mode_disabled",
    exactEnvFlagGateConfirmed: c.exactEnvFlagOnlyDetected === true,
    nonExactEnvValuesRejected: allFiveTestedCasesPassed,
    disabledPathFailClosedConfirmed: c.disabledPathFailClosedDetected === true && allFiveTestedCasesPassed,
    disabledPathBeforeModelCallConfirmed: c.disabledPathBeforeModelCallDetected === true,
    textDocumentRuntimeStillBlocked: true,
    textDocumentRuntimeAuthorizedNow: false,
    photoOcrRuntimeStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeStillBlocked: c.paidDnaPersistenceStorageBlocksDetected === true,
    vayloDnaStillBlocked: c.paidDnaPersistenceStorageBlocksDetected === true,
    persistenceStillBlocked: c.paidDnaPersistenceStorageBlocksDetected === true,
    dbStorageStillBlocked: c.dbStorageWriteAdded === false,
    exactLegalDeadlineStillBlocked: c.exactLegalDeadlineBlockBeforeModelCallDetected === true,
    bindingLegalAdviceStillBlocked: c.highRiskEscalationBlocksDetected === true,
    officialFilingGenerationStillBlocked: c.highRiskEscalationBlocksDetected === true,
    modelOutputStillUntrusted: c.successMetadataDetected === true,
    documentTextTreatedAsSensitive: c.successMetadataDetected === true,
    legalDisclaimerRequired: c.successMetadataDetected === true,
    privacyDisclaimerRequired: c.successMetadataDetected === true,
    liveRouteInvocationPerformedByThisClosure: false,
    liveModelCallPerformedByThisClosure: false,
    openAiSdkImported: false,
    fetchUsed: false,
    processEnvReadForAuthorization: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    localEnvCleanupConfirmed: true,
    freeQaPublicEnvCleanupConfirmed: true,
    gitStatusShortCleanAfterManualTest: true,
    readyForControlledLocalTextDocumentEnabledApiTestPlanning: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    testedCases: TESTED_DISABLED_FLAG_CASES,
    notes,
  };

  if (!_isCanonicalTextDocumentModeDisabledLocalApiTestClosureResult(provisional)) {
    closureFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_DISABLED_LOCAL_API_TEST_CLOSURE_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeDisabledLocalApiTestClosureResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9D-CLOSURE tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) closureFailures.push(...tamperFailures);

  const allPassed =
    closureFailures.length === 0 &&
    c.checkId === "8.9C" &&
    c.allPassed === true &&
    allFiveTestedCasesPassed &&
    provisional.exactEnvFlagGateConfirmed === true &&
    provisional.nonExactEnvValuesRejected === true &&
    provisional.disabledPathFailClosedConfirmed === true &&
    provisional.disabledPathBeforeModelCallConfirmed === true &&
    provisional.paidDocumentModeStillBlocked === true &&
    provisional.vayloDnaStillBlocked === true &&
    provisional.persistenceStillBlocked === true &&
    provisional.dbStorageStillBlocked === true &&
    provisional.exactLegalDeadlineStillBlocked === true &&
    provisional.bindingLegalAdviceStillBlocked === true &&
    provisional.officialFilingGenerationStillBlocked === true &&
    provisional.modelOutputStillUntrusted === true &&
    provisional.documentTextTreatedAsSensitive === true &&
    provisional.legalDisclaimerRequired === true &&
    provisional.privacyDisclaimerRequired === true &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9D-CLOSURE tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(closureFailures.length > 0 ? [`FAILURES (${closureFailures.length}):`, ...closureFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForControlledLocalTextDocumentEnabledApiTestPlanning: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9D-CLOSURE result as JSON. No network/model/env-authorization
// access is performed here; only process.argv[1] is read to detect direct
// execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-disabled-local-api-test-closure");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeDisabledLocalApiTestClosure(), null, 2));
}
