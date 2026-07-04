/**
 * PHASE 8.9B — Text Document Mode Controlled Runtime Implementation Plan
 *
 * Plan-only phase. This phase defines a short, practical implementation
 * plan for the future 8.9C route patch to app/api/smart-talk/route.ts,
 * building on the Text Document Mode gate design audited in 8.9A.
 *
 * This phase does NOT modify app/api/smart-talk/route.ts, does NOT enable
 * Text Document Mode, does NOT call the route/model/OpenAI/fetch, does NOT
 * start a dev server, does NOT enable OCR/photo/upload/storage/paid/DNA/
 * persistence/public runtime/production/go-live, and does NOT run 8.3AC.
 * It only declares a plan and checklist locally and purely.
 */

import { runTextDocumentModeControlledRuntimeGate } from "./run-text-document-mode-controlled-runtime-gate";

// ─── Result type ────────────────────────────────────────────────────────────

interface TextDocumentModeControlledRuntimeImplementationPlanResult {
  checkId: "8.9B";
  allPassed: boolean;
  sourceGateCommit: "4ea8828";
  sourceGatePhase: "8.9A";
  implementationPlanOnly: true;
  targetPatchPhase: "8.9C";
  targetPatchFile: "app/api/smart-talk/route.ts";
  plannedMode: "text_document_controlled_runtime";
  plannedEnvFlag: "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED";
  plannedEnvDefault: false;
  exactEnvFlagOnlyRequired: boolean;
  disabledPathFailClosedRequired: boolean;
  disabledPathStatus: 403;
  disabledPathCode: "text_document_mode_disabled";
  pastedTextOnlyRequired: boolean;
  deterministicDocumentClassificationRequired: boolean;
  highRiskEscalationRequired: boolean;
  modelCallOnlyAfterAllBlocks: boolean;
  photoOcrStillBlocked: boolean;
  scannerUploadStillBlocked: boolean;
  fileUploadStillBlocked: boolean;
  paidDocumentModeStillBlocked: boolean;
  vayloDnaStillBlocked: boolean;
  persistenceStillBlocked: boolean;
  dbStorageStillBlocked: boolean;
  exactLegalDeadlineStillBlocked: boolean;
  bindingLegalAdviceStillBlocked: boolean;
  officialFilingGenerationStillBlocked: boolean;
  modelOutputStillUntrusted: boolean;
  privacyDisclaimerRequired: boolean;
  legalDisclaimerRequired: boolean;
  liveRouteInvocationPerformed: false;
  liveModelCallPerformed: false;
  openAiSdkImported: false;
  fetchUsed: false;
  processEnvReadForAuthorization: false;
  filesWritten: false;
  dbStorageTouched: false;
  eightThreeAcNotRun: true;
  readyForTextDocumentModeRoutePatch: boolean;
  readyForTextDocumentRuntime: false;
  readyForPhotoOcrRuntime: false;
  readyForPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
  routePatchChecklist: string[];
  notes: string[];
}

// ─── 8.9C route patch checklist (10-15 items) ──────────────────────────────

const ROUTE_PATCH_CHECKLIST_8_9C: string[] = [
  "RPC-01: add a new branch guarded by o.mode === \"text_document_controlled_runtime\" placed before the 8.8M internal branch, mirroring the 8.8T public-branch pattern.",
  "RPC-02: read process.env.SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED and require it to be the exact string \"true\"; any other value (absent, \"false\", \"TRUE\", \"1\", \"yes\") must fail closed.",
  "RPC-03: on disabled flag, return NextResponse.json({ ok: false, code: \"text_document_mode_disabled\", ... }, { status: 403 }) without calling runSmartTalk, without calling the model, and without leaking env/secret/internal diagnostics.",
  "RPC-04: validate context is exactly \"anonymous\" or \"controlled_test\"; reject any other context with a fail-closed 400.",
  "RPC-05: validate inputType === \"text\" and typeof text === \"string\"; reject non-text input.",
  "RPC-06: validate text length against existing min/max bounds; reuse existing text-length validators from the route where available.",
  "RPC-07: validate locale against the allowed-locale list, keeping Slovak (\"sk\") allowed, consistent with 8.8T/8.8S.",
  "RPC-08: reuse existing detectors (detectTextDocumentBypassRequired, detectOfficialLetterStyleQuestionText, detectClientPaidDocumentModeActivation, detectExactLegalDeadlineRequest) before adding any new ones.",
  "RPC-09: add only minimal new route-local helpers if strictly necessary for: OCR/photo/scanner/upload request detection, credential/IBAN/identity-number detection, and deterministic document-like classification; do not modify runSmartTalk unless absolutely required.",
  "RPC-10: run deterministic document-like classification before any model call; if no document-like signal is present, fail closed rather than forwarding to the model as document mode.",
  "RPC-11: apply high-risk escalation/blocking for legal/deadline/court/police/medical/tax-risk signals before the model call, reusing 8.9A's blocked-case taxonomy as the reference list.",
  "RPC-12: block OCR/photo, scanner/upload, file upload, paid mode, Vaylo DNA save, and persistence/storage requests before any model call, returning distinct fail-closed codes for each.",
  "RPC-13: on success, call runSmartTalk only after all blocking checks pass, and return response metadata including all required flags (textDocumentModeEnabled, controlledTextDocumentRuntime, pastedTextOnly, and all *StillBlocked/*Required/eightThreeAcNotRun flags).",
  "RPC-14: leave the existing 8.8M internal branch and 8.8T public branch fully untouched and functionally unaffected by this addition.",
  "RPC-15: do not add any DB/Supabase/storage writes and do not add OCR/upload handlers as part of this patch.",
];

// ─── Canonical checker ────────────────────────────────────────────────────────

function _isCanonicalTextDocumentModeControlledRuntimeImplementationPlanResult(
  r: TextDocumentModeControlledRuntimeImplementationPlanResult,
): boolean {
  if (r.checkId !== "8.9B") return false;
  if (r.allPassed !== true) return false;
  if (r.sourceGateCommit !== "4ea8828") return false;
  if (r.sourceGatePhase !== "8.9A") return false;
  if (r.implementationPlanOnly !== true) return false;
  if (r.targetPatchPhase !== "8.9C") return false;
  if (r.targetPatchFile !== "app/api/smart-talk/route.ts") return false;
  if (r.plannedMode !== "text_document_controlled_runtime") return false;
  if (r.plannedEnvFlag !== "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED") return false;
  if (r.plannedEnvDefault !== false) return false;
  if (r.exactEnvFlagOnlyRequired !== true) return false;
  if (r.disabledPathFailClosedRequired !== true) return false;
  if (r.disabledPathStatus !== 403) return false;
  if (r.disabledPathCode !== "text_document_mode_disabled") return false;
  if (r.pastedTextOnlyRequired !== true) return false;
  if (r.deterministicDocumentClassificationRequired !== true) return false;
  if (r.highRiskEscalationRequired !== true) return false;
  if (r.modelCallOnlyAfterAllBlocks !== true) return false;
  if (r.photoOcrStillBlocked !== true) return false;
  if (r.scannerUploadStillBlocked !== true) return false;
  if (r.fileUploadStillBlocked !== true) return false;
  if (r.paidDocumentModeStillBlocked !== true) return false;
  if (r.vayloDnaStillBlocked !== true) return false;
  if (r.persistenceStillBlocked !== true) return false;
  if (r.dbStorageStillBlocked !== true) return false;
  if (r.exactLegalDeadlineStillBlocked !== true) return false;
  if (r.bindingLegalAdviceStillBlocked !== true) return false;
  if (r.officialFilingGenerationStillBlocked !== true) return false;
  if (r.modelOutputStillUntrusted !== true) return false;
  if (r.privacyDisclaimerRequired !== true) return false;
  if (r.legalDisclaimerRequired !== true) return false;
  if (r.liveRouteInvocationPerformed !== false) return false;
  if (r.liveModelCallPerformed !== false) return false;
  if (r.openAiSdkImported !== false) return false;
  if (r.fetchUsed !== false) return false;
  if (r.processEnvReadForAuthorization !== false) return false;
  if (r.filesWritten !== false) return false;
  if (r.dbStorageTouched !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.readyForTextDocumentModeRoutePatch !== true) return false;
  if (r.readyForTextDocumentRuntime !== false) return false;
  if (r.readyForPhotoOcrRuntime !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;
  if (!r.routePatchChecklist || r.routePatchChecklist.length < 10 || r.routePatchChecklist.length > 15) return false;
  if (!r.notes || r.notes.length === 0) return false;

  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type Tamper89BMutation = (
  r: TextDocumentModeControlledRuntimeImplementationPlanResult,
) => TextDocumentModeControlledRuntimeImplementationPlanResult;
interface Tamper89BCase {
  label: string;
  mutate: Tamper89BMutation;
}

const TEXT_DOCUMENT_MODE_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES: Tamper89BCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.9C" as "8.9B" }) },
  { label: "allPassed false (source 8.9A allPassed treated as false)", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "sourceGateCommit wrong", mutate: (r) => ({ ...r, sourceGateCommit: "0000000" as "4ea8828" }) },
  { label: "sourceGatePhase wrong", mutate: (r) => ({ ...r, sourceGatePhase: "8.8X" as "8.9A" }) },
  { label: "implementationPlanOnly false", mutate: (r) => ({ ...r, implementationPlanOnly: false as true }) },
  { label: "targetPatchPhase wrong", mutate: (r) => ({ ...r, targetPatchPhase: "8.9D" as "8.9C" }) },
  { label: "targetPatchFile wrong", mutate: (r) => ({ ...r, targetPatchFile: "app/api/other/route.ts" as "app/api/smart-talk/route.ts" }) },
  { label: "plannedMode changes", mutate: (r) => ({ ...r, plannedMode: "text_document_public_runtime" as "text_document_controlled_runtime" }) },
  { label: "plannedEnvFlag changes", mutate: (r) => ({ ...r, plannedEnvFlag: "TEXT_DOC_ENABLED" as "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED" }) },
  { label: "plannedEnvDefault becomes true", mutate: (r) => ({ ...r, plannedEnvDefault: true as false }) },
  { label: "exactEnvFlagOnlyRequired false", mutate: (r) => ({ ...r, exactEnvFlagOnlyRequired: false }) },
  { label: "disabledPathFailClosedRequired false (disabled path is not fail-closed)", mutate: (r) => ({ ...r, disabledPathFailClosedRequired: false }) },
  { label: "disabledPathStatus wrong", mutate: (r) => ({ ...r, disabledPathStatus: 200 as 403 }) },
  { label: "disabledPathCode wrong", mutate: (r) => ({ ...r, disabledPathCode: "ok" as "text_document_mode_disabled" }) },
  { label: "pastedTextOnlyRequired false", mutate: (r) => ({ ...r, pastedTextOnlyRequired: false }) },
  { label: "deterministicDocumentClassificationRequired false (document classification is not required)", mutate: (r) => ({ ...r, deterministicDocumentClassificationRequired: false }) },
  { label: "highRiskEscalationRequired false (high-risk escalation is not required)", mutate: (r) => ({ ...r, highRiskEscalationRequired: false }) },
  { label: "modelCallOnlyAfterAllBlocks false (model call can happen before blocks)", mutate: (r) => ({ ...r, modelCallOnlyAfterAllBlocks: false }) },
  { label: "photoOcrStillBlocked false (OCR/photo becomes allowed)", mutate: (r) => ({ ...r, photoOcrStillBlocked: false }) },
  { label: "scannerUploadStillBlocked false (scanner/upload becomes allowed)", mutate: (r) => ({ ...r, scannerUploadStillBlocked: false }) },
  { label: "fileUploadStillBlocked false (upload becomes allowed)", mutate: (r) => ({ ...r, fileUploadStillBlocked: false }) },
  { label: "paidDocumentModeStillBlocked false (paid mode becomes allowed)", mutate: (r) => ({ ...r, paidDocumentModeStillBlocked: false }) },
  { label: "vayloDnaStillBlocked false (Vaylo DNA becomes allowed)", mutate: (r) => ({ ...r, vayloDnaStillBlocked: false }) },
  { label: "persistenceStillBlocked false (persistence becomes allowed)", mutate: (r) => ({ ...r, persistenceStillBlocked: false }) },
  { label: "dbStorageStillBlocked false (storage becomes allowed)", mutate: (r) => ({ ...r, dbStorageStillBlocked: false }) },
  { label: "exactLegalDeadlineStillBlocked false (exact legal deadline becomes allowed)", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false }) },
  { label: "bindingLegalAdviceStillBlocked false (binding legal advice becomes allowed)", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false }) },
  { label: "officialFilingGenerationStillBlocked false (official filing generation becomes allowed)", mutate: (r) => ({ ...r, officialFilingGenerationStillBlocked: false }) },
  { label: "modelOutputStillUntrusted false", mutate: (r) => ({ ...r, modelOutputStillUntrusted: false }) },
  { label: "privacyDisclaimerRequired false", mutate: (r) => ({ ...r, privacyDisclaimerRequired: false }) },
  { label: "legalDisclaimerRequired false", mutate: (r) => ({ ...r, legalDisclaimerRequired: false }) },
  { label: "liveRouteInvocationPerformed true (claims route access)", mutate: (r) => ({ ...r, liveRouteInvocationPerformed: true as false }) },
  { label: "liveModelCallPerformed true (claims model access)", mutate: (r) => ({ ...r, liveModelCallPerformed: true as false }) },
  { label: "openAiSdkImported true (claims OpenAI access)", mutate: (r) => ({ ...r, openAiSdkImported: true as false }) },
  { label: "fetchUsed true (claims fetch access)", mutate: (r) => ({ ...r, fetchUsed: true as false }) },
  { label: "processEnvReadForAuthorization true (claims env read for authorization)", mutate: (r) => ({ ...r, processEnvReadForAuthorization: true as false }) },
  { label: "filesWritten true (claims file writes)", mutate: (r) => ({ ...r, filesWritten: true as false }) },
  { label: "dbStorageTouched true (claims DB access)", mutate: (r) => ({ ...r, dbStorageTouched: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC is marked as run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "readyForTextDocumentModeRoutePatch false", mutate: (r) => ({ ...r, readyForTextDocumentModeRoutePatch: false }) },
  { label: "readyForTextDocumentRuntime true", mutate: (r) => ({ ...r, readyForTextDocumentRuntime: true as false }) },
  { label: "readyForPhotoOcrRuntime true", mutate: (r) => ({ ...r, readyForPhotoOcrRuntime: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  { label: "readyForProduction true", mutate: (r) => ({ ...r, readyForProduction: true as false }) },
  { label: "readyForGoLive true", mutate: (r) => ({ ...r, readyForGoLive: true as false }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "routePatchChecklist empty", mutate: (r) => ({ ...r, routePatchChecklist: [] }) },
  { label: "routePatchChecklist too long (>15)", mutate: (r) => ({ ...r, routePatchChecklist: [...r.routePatchChecklist, "extra-1", "extra-2", "extra-3", "extra-4"] }) },
  { label: "notes empty", mutate: (r) => ({ ...r, notes: [] }) },
];

// ─── Exported implementation plan runner ───────────────────────────────────────

export function runTextDocumentModeControlledRuntimeImplementationPlan(): TextDocumentModeControlledRuntimeImplementationPlanResult {
  const planFailures: string[] = [];

  // ── Call 8.9A text document mode controlled runtime gate runner as source of truth ──
  const a = runTextDocumentModeControlledRuntimeGate();
  if (a.checkId !== "8.9A") planFailures.push(`8.9A checkId mismatch: expected "8.9A", got "${a.checkId}"`);
  if (a.allPassed !== true) planFailures.push("8.9A allPassed is not true");
  if (a.proposedMode !== "text_document_controlled_runtime") planFailures.push("8.9A proposedMode mismatch");
  if (a.proposedEnvFlag !== "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED") planFailures.push("8.9A proposedEnvFlag mismatch");
  if (a.proposedEnvDefault !== false) planFailures.push("8.9A proposedEnvDefault is not false");
  if (a.readyForTextDocumentModeRoutePatchPlanning !== true)
    planFailures.push("8.9A readyForTextDocumentModeRoutePatchPlanning is not true");
  if (a.readyForTextDocumentRuntime !== false) planFailures.push("8.9A readyForTextDocumentRuntime is not false");
  if (a.readyForPhotoOcrRuntime !== false) planFailures.push("8.9A readyForPhotoOcrRuntime is not false");
  if (a.readyForPublicRuntime !== false) planFailures.push("8.9A readyForPublicRuntime is not false");
  if (a.readyForProduction !== false) planFailures.push("8.9A readyForProduction is not false");
  if (a.readyForGoLive !== false) planFailures.push("8.9A readyForGoLive is not false");
  if (a.photoOcrStillBlocked !== true) planFailures.push("8.9A photoOcrStillBlocked is not true");
  if (a.scannerUploadStillBlocked !== true) planFailures.push("8.9A scannerUploadStillBlocked is not true");
  if (a.fileUploadStillBlocked !== true) planFailures.push("8.9A fileUploadStillBlocked is not true");
  if (a.paidDocumentModeStillBlocked !== true) planFailures.push("8.9A paidDocumentModeStillBlocked is not true");
  if (a.vayloDnaStillBlocked !== true) planFailures.push("8.9A vayloDnaStillBlocked is not true");
  if (a.persistenceStillBlocked !== true) planFailures.push("8.9A persistenceStillBlocked is not true");
  if (a.dbStorageStillBlocked !== true) planFailures.push("8.9A dbStorageStillBlocked is not true");
  if (a.exactLegalDeadlineStillBlocked !== true) planFailures.push("8.9A exactLegalDeadlineStillBlocked is not true");
  if (a.bindingLegalAdviceStillBlocked !== true) planFailures.push("8.9A bindingLegalAdviceStillBlocked is not true");
  if (a.officialFilingGenerationStillBlocked !== true)
    planFailures.push("8.9A officialFilingGenerationStillBlocked is not true");
  if (a.modelOutputStillUntrusted !== true) planFailures.push("8.9A modelOutputStillUntrusted is not true");
  if (a.documentClassificationBeforeModelCallRequired !== true)
    planFailures.push("8.9A documentClassificationBeforeModelCallRequired is not true");
  if (a.highRiskEscalationRequired !== true) planFailures.push("8.9A highRiskEscalationRequired is not true");
  if (a.privacyDisclaimerRequired !== true) planFailures.push("8.9A privacyDisclaimerRequired is not true");
  if (a.legalDisclaimerRequired !== true) planFailures.push("8.9A legalDisclaimerRequired is not true");
  if (a.eightThreeAcNotRun !== true) planFailures.push("8.9A eightThreeAcNotRun is not true");
  if (a.tamperRejected !== a.tamperCount) planFailures.push("8.9A own tamper count mismatch");

  const notes: string[] = [
    "IN-01: 8.9B is a plan-only phase; it defines exactly how the future 8.9C route patch should be structured but performs no route/model/OpenAI/fetch access itself.",
    `IN-02: 8.9A confirmed — checkId=${a.checkId}, allPassed=${a.allPassed}, proposedMode=${a.proposedMode}, proposedEnvFlag=${a.proposedEnvFlag}, proposedEnvDefault=${a.proposedEnvDefault}.`,
    "IN-03: the 8.9C patch target is app/api/smart-talk/route.ts, adding one new controlled branch guarded by an exact env-flag string check (\"true\" only), fail-closed for absent/false/TRUE/1/yes.",
    "IN-04: the plan requires deterministic document-like classification and high-risk escalation for legal/deadline/court/police/medical/tax-risk signals before any model call, mirroring the 8.9A blocked-case taxonomy.",
    "IN-05: the plan reuses existing route helpers where possible and restricts new route-local helpers to the minimum necessary; it explicitly forbids DB/Supabase/storage writes and OCR/upload handlers.",
    "IN-06: this plan itself performs no live route/model/fetch/OpenAI/DB access and does not run 8.3AC; text document runtime, photo/OCR runtime, public runtime, production, and go-live all remain unauthorized by this phase.",
  ];

  const tamperCount = TEXT_DOCUMENT_MODE_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES.length;

  const provisional: TextDocumentModeControlledRuntimeImplementationPlanResult = {
    checkId: "8.9B",
    allPassed: true,
    sourceGateCommit: "4ea8828",
    sourceGatePhase: "8.9A",
    implementationPlanOnly: true,
    targetPatchPhase: "8.9C",
    targetPatchFile: "app/api/smart-talk/route.ts",
    plannedMode: "text_document_controlled_runtime",
    plannedEnvFlag: "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED",
    plannedEnvDefault: false,
    exactEnvFlagOnlyRequired: true,
    disabledPathFailClosedRequired: true,
    disabledPathStatus: 403,
    disabledPathCode: "text_document_mode_disabled",
    pastedTextOnlyRequired: true,
    deterministicDocumentClassificationRequired: true,
    highRiskEscalationRequired: true,
    modelCallOnlyAfterAllBlocks: true,
    photoOcrStillBlocked: true,
    scannerUploadStillBlocked: true,
    fileUploadStillBlocked: true,
    paidDocumentModeStillBlocked: true,
    vayloDnaStillBlocked: true,
    persistenceStillBlocked: true,
    dbStorageStillBlocked: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingGenerationStillBlocked: true,
    modelOutputStillUntrusted: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    liveRouteInvocationPerformed: false,
    liveModelCallPerformed: false,
    openAiSdkImported: false,
    fetchUsed: false,
    processEnvReadForAuthorization: false,
    filesWritten: false,
    dbStorageTouched: false,
    eightThreeAcNotRun: true,
    readyForTextDocumentModeRoutePatch: true,
    readyForTextDocumentRuntime: false,
    readyForPhotoOcrRuntime: false,
    readyForPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,
    routePatchChecklist: ROUTE_PATCH_CHECKLIST_8_9C,
    notes,
  };

  if (!_isCanonicalTextDocumentModeControlledRuntimeImplementationPlanResult(provisional)) {
    planFailures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TEXT_DOCUMENT_MODE_CONTROLLED_RUNTIME_IMPLEMENTATION_PLAN_TAMPER_CASES) {
    if (!_isCanonicalTextDocumentModeControlledRuntimeImplementationPlanResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.9B tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) planFailures.push(...tamperFailures);

  const allPassed =
    planFailures.length === 0 &&
    a.checkId === "8.9A" &&
    a.allPassed === true &&
    a.readyForTextDocumentModeRoutePatchPlanning === true &&
    a.readyForTextDocumentRuntime === false &&
    a.readyForPhotoOcrRuntime === false &&
    a.readyForPublicRuntime === false &&
    a.readyForProduction === false &&
    a.readyForGoLive === false &&
    provisional.routePatchChecklist.length >= 10 &&
    provisional.routePatchChecklist.length <= 15 &&
    tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.9B tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(planFailures.length > 0 ? [`FAILURES (${planFailures.length}):`, ...planFailures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    readyForTextDocumentModeRoutePatch: allPassed,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
// When this file is executed directly (e.g. `npx -y tsx@4.19.2 <this-file>`),
// print the 8.9B result as JSON. No network/model/env-authorization access is
// performed here; only process.argv[1] is read to detect direct execution.
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-text-document-mode-controlled-runtime-implementation-plan");

if (invokedDirectly) {
  console.log(JSON.stringify(runTextDocumentModeControlledRuntimeImplementationPlan(), null, 2));
}
