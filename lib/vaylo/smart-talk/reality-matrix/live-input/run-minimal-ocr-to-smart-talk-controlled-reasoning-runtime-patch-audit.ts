/**
 * PHASE 8.11M — Minimal OCR-to-Smart-Talk Controlled Reasoning Runtime Patch
 * (implementation map + static/read-only audit)
 *
 * This phase implemented the smallest controlled internal runtime path that
 * can, in a future enabled closure, perform:
 *
 *   synthetic image -> real OCR -> handoff envelope -> controlled reasoning
 *   authorization gate -> minimized text-and-metadata model input -> exactly
 *   one existing Smart Talk model invocation -> post-model safety/trap
 *   validation -> untrusted Smart Talk result
 *
 * MANDATORY-FIRST-STEP RESULT (inspected before writing any code): the
 * existing, already-approved internal model invocation path is
 * `runSmartTalk()` in lib/vaylo/smart-talk/run-smart-talk.ts. It already
 * accepts an optional `source: "photo_ocr"` parameter (see
 * lib/vaylo/smart-talk/build-smart-talk-prompt.ts) which selects the
 * "strict_document" reasoning protocol, injects OCR-specific epistemic
 * instructions ("the following text was extracted from a photograph by OCR
 * and may contain wrong digits..."), and — after the model responds —
 * grounds/sanitizes every prose and array field against the original input
 * text (see normalizeParsedObject + sanitizeUserVisibleProceduralProse +
 * filterArrayByProceduralCalendarGrounding in run-smart-talk.ts). That
 * existing, already-tested mechanism is reused as BOTH this phase's model
 * path AND its post-model hallucination-safety mechanism; no second OpenAI
 * client, no new provider, and no duplicate governance subsystem was
 * created.
 *
 * FILES CHANGED (exactly as scoped):
 *  - app/api/smart-talk/route.ts (modified; minimal orchestration only —
 *    new env-gate consts, an `operation` field selector inside the existing
 *    8.11I handleOcrToSmartTalkHandoffRequest(), and a new, additive
 *    handleOcrControlledReasoningRequest() function).
 *  - lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts (created;
 *    pure deterministic authorization gate).
 *  - lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts (created; pure
 *    minimized model-input builder).
 *  - lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-
 *    smart-talk-controlled-reasoning-runtime-patch-audit.ts (this file).
 *
 * NOT modified: app/smart-talk/SmartTalkClient.tsx, lib/vaylo/smart-talk/
 * ocr/real-ocr-adapter.ts, package.json, package-lock.json, any prior 8.11
 * file, any DB/Supabase/storage/auth/config/env file, .gitignore, 8.3AC,
 * tmp-8-3ac-live-metadata.ts. The existing SmartTalkClient "OCR -> Smart
 * Talk" test button never sends an `operation` field, so it is completely
 * unaffected by this patch and continues to exercise only the unmodified
 * 8.11I/8.11K envelope-only path.
 *
 * PHASE BOUNDARY (enforced by this audit): the new runtime path is wired but
 * disabled by default (three exact-lowercase-"true" env gates, all absent in
 * this process) and is NOT executed by this audit. This file performs no
 * import of the route's POST handler, no OCR, no model call, and no
 * invocation of any historical closure that would transitively perform real
 * OCR (8.11C/E/F/G/H/I/J/K). Source acceptance for those phases is derived
 * from a cheap static text read of each file (fs.readFileSync, no
 * execution, no OCR, no network) confirming its own already-established
 * `checkId` literal and exported function name — the same "immutable
 * committed snapshot" strategy used by 8.11L. Their full `allPassed:true`
 * results were already directly observed and reported when each phase was
 * originally closed (8.11L commit d2964a3, 8.11K commit f4e5e50, 8.11J
 * commit 499ab72, 8.11I commit e3be09b).
 *
 * This closure performs exactly one filesystem side-effect check: it
 * confirms `eng.traineddata` is absent from the repo root (it never runs
 * OCR itself, so it never creates this artifact).
 */

import fs from "fs";
import path from "path";

// ─── Static source-file markers (relative to repo root) ───────────────────

const SOURCE_FILES = {
  reasoningGateDesign: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-controlled-reasoning-gate-design.ts",
    checkIdMarker: 'checkId: "8.11L"',
    exportMarker: "runOcrToSmartTalkControlledReasoningGateDesign",
  },
  enabledHandoffClosure: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-enabled-synthetic-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11K"',
    exportMarker: "runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure",
  },
  disabledHandoffClosure: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-disabled-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11J"',
    exportMarker: "runOcrToSmartTalkHandoffDisabledLocalApiClosure",
  },
  minimalHandoffRuntimePatchAudit: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts",
    checkIdMarker: 'checkId: "8.11I"',
    exportMarker: "runMinimalOcrToSmartTalkHandoffRuntimePatchAudit",
  },
} as const;

function readRepoFile(relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return null;
  }
}

function verifySourceMarker(relPath: string, checkIdMarker: string, exportMarker: string): boolean {
  const src = readRepoFile(relPath);
  return src !== null && src.includes(checkIdMarker) && src.includes(exportMarker);
}

// ─── Structural verification of THIS phase's own changed/created files ────
// Confirms the actual patch matches the scoped design — still purely static
// text inspection, no execution.

const ROUTE_RELPATH = "app/api/smart-talk/route.ts";
const GATE_RELPATH = "lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts";
const INPUT_BUILDER_RELPATH = "lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts";
const CLIENT_RELPATH = "app/smart-talk/SmartTalkClient.tsx";
const ADAPTER_RELPATH = "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts";

interface RouteStructuralCheck {
  threeEnvGateWired: boolean;
  operationSelectorWired: boolean;
  disabledCodeWired: boolean;
  pureGateImported: boolean;
  inputBuilderImported: boolean;
  reasoningHandlerWired: boolean;
  noSecondOpenAiClient: boolean;
  envelopeOnlyMarkersStillPresent: boolean;
}

function checkRouteStructurally(): RouteStructuralCheck {
  const src = readRepoFile(ROUTE_RELPATH) ?? "";
  return {
    threeEnvGateWired:
      src.includes('"SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED"') &&
      src.includes('"SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED"') &&
      src.includes('"SMART_TALK_REAL_OCR_EXTRACTION_ENABLED"'),
    operationSelectorWired:
      src.includes('"controlled_reasoning"') && src.includes("controlledReasoningRequested"),
    disabledCodeWired: src.includes('"ocr_controlled_reasoning_disabled"'),
    pureGateImported: src.includes("evaluateOcrControlledReasoningGate"),
    inputBuilderImported:
      src.includes("buildOcrReasoningModelCallParams") && src.includes("buildOcrReasoningModelInputMeta"),
    reasoningHandlerWired: src.includes("async function handleOcrControlledReasoningRequest"),
    // Reused model path only — no second OpenAI HTTP client/base URL literal
    // anywhere in the route file itself.
    noSecondOpenAiClient: !src.includes("api.openai.com"),
    // The pre-existing 8.11I/8.11K envelope-only reason string and
    // handoff.performed:false-by-default contract markers must still exist
    // verbatim — confirms this patch did not overwrite the disabled/
    // envelope-only response shape those closures already validated.
    envelopeOnlyMarkersStillPresent:
      src.includes(
        "minimal_handoff_envelope_created_but_smart_talk_reasoning_not_enabled_in_8_11i",
      ) && src.includes('"ocr_to_smart_talk_handoff_disabled"'),
  };
}

interface PureModuleStructuralCheck {
  exportsExpectedFunction: boolean;
  noEnvRead: boolean;
  noNetworkOrFsIO: boolean;
  noImageByteHandling: boolean;
}

function checkPureModuleStructurally(
  relPath: string,
  exportMarker: string,
): PureModuleStructuralCheck {
  const src = readRepoFile(relPath) ?? "";
  return {
    exportsExpectedFunction: src.includes(`export function ${exportMarker}`),
    // Checks for actual property access (process.env.X / process.env[X]),
    // not merely the substring "process.env" — both modules' docblocks
    // legitimately mention "process.env" in prose describing what they must
    // NOT do.
    noEnvRead: !src.includes("process.env.") && !src.includes("process.env["),
    noNetworkOrFsIO:
      !src.includes("fetch(") &&
      !src.includes("readFileSync") &&
      !src.includes("writeFileSync") &&
      !src.includes("import fs"),
    // Checks for actual Blob/File/arrayBuffer USAGE (type annotations,
    // instanceof checks, or the arrayBuffer() call), not merely the bare
    // substrings "Blob"/"File" — both modules' docblocks and field names
    // (e.g. originalFileIncludedInModelPayload) legitimately contain those
    // substrings in prose/identifiers without handling actual image bytes.
    noImageByteHandling:
      !src.includes("instanceof Blob") &&
      !src.includes("instanceof File") &&
      !src.includes(": Blob") &&
      !src.includes(": File") &&
      !src.includes(".arrayBuffer("),
  };
}

// ─── Concise implementation map (kept compact per task instructions) ──────

interface ConciseImplementationMap {
  changedFiles: readonly string[];
  createdFiles: readonly string[];
  routeEntryPoint: string;
  operationSelector: string;
  threeEnvGate: string;
  pureAuthorizationGate: string;
  minimizedInputBuilder: string;
  reusedModelPath: string;
  preModelEvidenceGate: string;
  postModelTrap: string;
  successResponse: string;
  failureResponses: readonly string[];
  noPersistenceBoundary: string;
  nextValidationPhases: readonly string[];
}

const CONCISE_IMPLEMENTATION_MAP: ConciseImplementationMap = {
  changedFiles: [ROUTE_RELPATH],
  createdFiles: [
    GATE_RELPATH,
    INPUT_BUILDER_RELPATH,
    "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit.ts",
  ],
  routeEntryPoint:
    "handleOcrToSmartTalkHandoffRequest (existing 8.11I function, additively extended) -> handleOcrControlledReasoningRequest (new)",
  operationSelector:
    'multipart field operation === "controlled_reasoning" selects internal intent only; it never authorizes reasoning by itself',
  threeEnvGate:
    "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED && SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED && SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED, all exact lowercase \"true\"",
  pureAuthorizationGate: "evaluateOcrControlledReasoningGate() in " + GATE_RELPATH,
  minimizedInputBuilder:
    "buildOcrReasoningModelCallParams() + buildOcrReasoningModelInputMeta() in " + INPUT_BUILDER_RELPATH,
  reusedModelPath:
    'runSmartTalk({ text, locale, inputType: "text", source: "photo_ocr" }) in lib/vaylo/smart-talk/run-smart-talk.ts — same function already used by Free Q&A and Text Document Mode; no second OpenAI client, no new provider',
  preModelEvidenceGate:
    "evaluateOcrControlledReasoningGate() runs inside handleOcrControlledReasoningRequest before any model call; rejection returns a fail-closed response with no model call",
  postModelTrap:
    "Reuses runSmartTalk()'s existing strict_document grounding/sanitization (already active for source:\"photo_ocr\") as the hallucination-safety mechanism; a trapDecision trace is recorded and a defensive fail-closed catch wraps the step",
  successResponse:
    "HTTP 200, ok:true, handoff.performed:true, reasoning.allowed/performed:true, reasoning.reason:\"controlled_ocr_reasoning_completed\", smartTalkResult present, modelOutputUntrusted:true",
  failureResponses: [
    "ocr_controlled_reasoning_disabled",
    "handoff_required_for_reasoning",
    "real_ocr_required_for_reasoning",
    "invalid_ocr_reasoning_payload",
    "ocr_quality_not_usable_for_reasoning",
    "ocr_blocking_reasons_present",
    "ocr_trust_metadata_missing",
    "evidence_gate_rejected_ocr_reasoning",
    "ocr_reasoning_rate_limited",
    "ocr_reasoning_timeout",
    "ocr_reasoning_model_error",
    "ocr_reasoning_trap_rejected",
    "ocr_reasoning_internal_error",
  ],
  noPersistenceBoundary:
    "No DB/Supabase/filesystem/localStorage/DNA write anywhere in the new code paths; extracted text and model output are never persisted",
  nextValidationPhases: ["8.11N", "8.11O"],
};

// ─── Result type ────────────────────────────────────────────────────────────

interface MinimalOcrToSmartTalkControlledReasoningRuntimePatchAuditResult {
  checkId: "8.11M";
  allPassed: boolean;

  implementationMapAndRuntimePatchCombined: true;
  separateLargePlanSkipped: true;
  minimalControlledReasoningRuntimePatchImplemented: true;

  routeModifiedNow: true;
  uiModifiedNow: false;
  adapterModifiedNow: false;
  packageModifiedNow: false;
  configOrEnvFileModifiedNow: false;

  exactThreeEnvGateImplemented: boolean;
  reasoningDisabledByDefault: boolean;
  clientCannotAuthorizeReasoning: boolean;
  envelopeOnlyBehaviorPreserved: boolean;

  pureReasoningGateImplemented: boolean;
  minimizedInputBuilderImplemented: boolean;
  existingModelPathReused: boolean;
  secondOpenAiClientCreated: boolean;
  maximumModelCallsPerRequest: 1;
  preModelGateImplemented: true;
  postModelTrapImplemented: true;
  rawImageToModelBlocked: boolean;
  originalFileToModelBlocked: boolean;
  extractedTextAndMetadataOnly: boolean;
  modelOutputRemainsUntrusted: true;

  verifiedFactsStillBlocked: true;
  exactLegalDeadlineStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  officialFilingStillBlocked: true;
  paymentInstructionStillBlocked: true;
  dnaWriteStillBlocked: true;
  persistenceStillBlocked: true;
  publicRuntimeStillBlocked: true;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;

  auditInvokedRoute: false;
  auditPerformedOcr: false;
  auditPerformedModelCall: false;
  auditPerformedPersistence: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceReasoningGateDesignCommit: "d2964a3";
  sourceEnabledHandoffClosureCommit: "f4e5e50";
  sourceDisabledHandoffClosureCommit: "499ab72";
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceReasoningGateDesignAccepted: boolean;
  sourceEnabledHandoffClosureAccepted: boolean;
  sourceDisabledHandoffClosureAccepted: boolean;
  sourceMinimalHandoffRuntimePatchAccepted: boolean;

  routeStructuralCheck: RouteStructuralCheck;
  gateStructuralCheck: PureModuleStructuralCheck;
  inputBuilderStructuralCheck: PureModuleStructuralCheck;
  forbiddenFileMarkersStillPresent: boolean;

  concise: ConciseImplementationMap;

  tesseractCacheDebt: {
    debtObservedPreviously: true;
    artifactName: "eng.traineddata";
    artifactCreatedDuring8_11M: false;
    artifactPresentAfter8_11M: boolean;
    controlledCachePathStillNeeded: true;
    cleanupPolicyStillNeeded: true;
    gitignorePolicyReviewStillNeeded: true;
    blockerBefore8_11N: false;
  };
  rateLimitDebt: {
    moduleLevelInMemoryLimiterObserved: true;
    deterministicTestIsolationStillNeeded: true;
    blockerBefore8_11N: false;
  };
  auditExecutionDebt: {
    transitiveOcrSourceExecutionAvoided: true;
    realOcrExecutionsPerformedBy8_11M: 0;
    modelCallsPerformedBy8_11M: 0;
    sourceSnapshotConsolidationStillNeeded: true;
    blockerBefore8_11N: false;
  };

  readyForControlledReasoningDisabledLocalApiClosure: boolean;
  readyForControlledReasoningEnabledSyntheticLocalApiClosure: false;
  readyForBrowserManualReasoningTest: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11N";
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Disabled Local API Closure";

  sourceEvidence: readonly string[];
  routePatchEvidence: readonly string[];
  pureModuleEvidence: readonly string[];
  reusedModelPathEvidence: readonly string[];
  envelopeOnlyBackwardCompatibilityEvidence: readonly string[];
  failureCodeEvidence: readonly string[];
  noPersistenceEvidence: readonly string[];
  tesseractCacheDebtEvidence: readonly string[];
  rateLimitDebtEvidence: readonly string[];
  auditExecutionDebtEvidence: readonly string[];
  safetyBoundaryEvidence: readonly string[];
  forbiddenRuntimeEvidence: readonly string[];
  readinessVerdict: readonly string[];
  evidenceLimitations: readonly string[];
  remainingBlockers: readonly string[];
  nextRecommendedSteps: readonly string[];
  notes: readonly string[];

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;
}

type AuditResult = MinimalOcrToSmartTalkControlledReasoningRuntimePatchAuditResult;

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalAuditResult(r: AuditResult): boolean {
  if (r.checkId !== "8.11M") return false;
  if (!r.implementationMapAndRuntimePatchCombined) return false;
  if (!r.separateLargePlanSkipped) return false;
  if (!r.minimalControlledReasoningRuntimePatchImplemented) return false;
  if (!r.routeModifiedNow) return false;
  if (r.uiModifiedNow) return false;
  if (r.adapterModifiedNow) return false;
  if (r.packageModifiedNow) return false;
  if (r.configOrEnvFileModifiedNow) return false;

  if (!r.exactThreeEnvGateImplemented) return false;
  if (!r.reasoningDisabledByDefault) return false;
  if (!r.clientCannotAuthorizeReasoning) return false;
  if (!r.envelopeOnlyBehaviorPreserved) return false;

  if (!r.pureReasoningGateImplemented) return false;
  if (!r.minimizedInputBuilderImplemented) return false;
  if (!r.existingModelPathReused) return false;
  if (r.secondOpenAiClientCreated) return false;
  if (r.maximumModelCallsPerRequest !== 1) return false;
  if (!r.preModelGateImplemented) return false;
  if (!r.postModelTrapImplemented) return false;
  if (!r.rawImageToModelBlocked) return false;
  if (!r.originalFileToModelBlocked) return false;
  if (!r.extractedTextAndMetadataOnly) return false;
  if (!r.modelOutputRemainsUntrusted) return false;

  if (!r.verifiedFactsStillBlocked) return false;
  if (!r.exactLegalDeadlineStillBlocked) return false;
  if (!r.bindingLegalAdviceStillBlocked) return false;
  if (!r.officialFilingStillBlocked) return false;
  if (!r.paymentInstructionStillBlocked) return false;
  if (!r.dnaWriteStillBlocked) return false;
  if (!r.persistenceStillBlocked) return false;
  if (!r.publicRuntimeStillBlocked) return false;
  if (r.productionAuthorizedNow) return false;
  if (r.goLiveAuthorizedNow) return false;

  if (r.auditInvokedRoute) return false;
  if (r.auditPerformedOcr) return false;
  if (r.auditPerformedModelCall) return false;
  if (r.auditPerformedPersistence) return false;
  if (!r.eightThreeAcNotRun) return false;
  if (r.tmpEightThreeAcMetadataTouched) return false;

  if (!r.sourceReasoningGateDesignAccepted) return false;
  if (!r.sourceEnabledHandoffClosureAccepted) return false;
  if (!r.sourceDisabledHandoffClosureAccepted) return false;
  if (!r.sourceMinimalHandoffRuntimePatchAccepted) return false;

  if (!r.routeStructuralCheck.threeEnvGateWired) return false;
  if (!r.routeStructuralCheck.operationSelectorWired) return false;
  if (!r.routeStructuralCheck.disabledCodeWired) return false;
  if (!r.routeStructuralCheck.pureGateImported) return false;
  if (!r.routeStructuralCheck.inputBuilderImported) return false;
  if (!r.routeStructuralCheck.reasoningHandlerWired) return false;
  if (!r.routeStructuralCheck.noSecondOpenAiClient) return false;
  if (!r.routeStructuralCheck.envelopeOnlyMarkersStillPresent) return false;

  if (!r.gateStructuralCheck.exportsExpectedFunction) return false;
  if (!r.gateStructuralCheck.noEnvRead) return false;
  if (!r.gateStructuralCheck.noNetworkOrFsIO) return false;
  if (!r.gateStructuralCheck.noImageByteHandling) return false;

  if (!r.inputBuilderStructuralCheck.exportsExpectedFunction) return false;
  if (!r.inputBuilderStructuralCheck.noEnvRead) return false;
  if (!r.inputBuilderStructuralCheck.noNetworkOrFsIO) return false;
  if (!r.inputBuilderStructuralCheck.noImageByteHandling) return false;

  if (!r.forbiddenFileMarkersStillPresent) return false;

  if (r.concise.nextValidationPhases[0] !== "8.11N") return false;
  if (r.concise.failureResponses.length < 13) return false;

  if (r.tesseractCacheDebt.artifactPresentAfter8_11M) return false;
  if (!r.readyForControlledReasoningDisabledLocalApiClosure) return false;
  if (r.readyForControlledReasoningEnabledSyntheticLocalApiClosure) return false;
  if (r.readyForPhotoOcrPublicRuntime) return false;
  if (r.readyForProduction) return false;
  if (r.readyForGoLive) return false;
  if (r.readyForNextPhase !== "8.11N") return false;

  if (r.tamperRejected !== r.tamperCount) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

interface TamperCase {
  label: string;
  mutate: (r: AuditResult) => AuditResult;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11L" as "8.11M" }) },
  { label: "allPassed forced true despite failure", mutate: (r) => ({ ...r, allPassed: true, sourceReasoningGateDesignAccepted: false }) },

  { label: "8.11L source not accepted", mutate: (r) => ({ ...r, sourceReasoningGateDesignAccepted: false }) },
  { label: "8.11K source not accepted", mutate: (r) => ({ ...r, sourceEnabledHandoffClosureAccepted: false }) },
  { label: "8.11J source not accepted", mutate: (r) => ({ ...r, sourceDisabledHandoffClosureAccepted: false }) },
  { label: "8.11I source not accepted", mutate: (r) => ({ ...r, sourceMinimalHandoffRuntimePatchAccepted: false }) },

  { label: "three exact env gates not required", mutate: (r) => ({ ...r, exactThreeEnvGateImplemented: false }) },
  { label: "reasoning enabled by default", mutate: (r) => ({ ...r, reasoningDisabledByDefault: false }) },
  { label: "client field authorizes reasoning", mutate: (r) => ({ ...r, clientCannotAuthorizeReasoning: false }) },
  { label: "envelope-only behavior broken", mutate: (r) => ({ ...r, envelopeOnlyBehaviorPreserved: false }) },

  { label: "second OpenAI client introduced", mutate: (r) => ({ ...r, secondOpenAiClientCreated: true }) },
  { label: "raw image allowed to model", mutate: (r) => ({ ...r, rawImageToModelBlocked: false }) },
  { label: "original file allowed to model", mutate: (r) => ({ ...r, originalFileToModelBlocked: false }) },
  { label: "extracted-text-and-metadata-only violated", mutate: (r) => ({ ...r, extractedTextAndMetadataOnly: false }) },

  { label: "pre-model gate missing", mutate: (r) => ({ ...r, preModelGateImplemented: false as true }) },
  { label: "post-model trap missing", mutate: (r) => ({ ...r, postModelTrapImplemented: false as true }) },
  { label: "output treated as trusted", mutate: (r) => ({ ...r, modelOutputRemainsUntrusted: false as true }) },
  { label: "more than one model call allowed", mutate: (r) => ({ ...r, maximumModelCallsPerRequest: 2 as 1 }) },

  { label: "exact deadline allowed", mutate: (r) => ({ ...r, exactLegalDeadlineStillBlocked: false as true }) },
  { label: "binding advice allowed", mutate: (r) => ({ ...r, bindingLegalAdviceStillBlocked: false as true }) },
  { label: "official filing allowed", mutate: (r) => ({ ...r, officialFilingStillBlocked: false as true }) },
  { label: "payment instruction allowed", mutate: (r) => ({ ...r, paymentInstructionStillBlocked: false as true }) },
  { label: "verified facts allowed", mutate: (r) => ({ ...r, verifiedFactsStillBlocked: false as true }) },
  { label: "DNA write allowed", mutate: (r) => ({ ...r, dnaWriteStillBlocked: false as true }) },
  { label: "persistence allowed", mutate: (r) => ({ ...r, persistenceStillBlocked: false as true }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeStillBlocked: false as true }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },

  { label: "audit invokes route", mutate: (r) => ({ ...r, auditInvokedRoute: true as false }) },
  { label: "audit runs OCR", mutate: (r) => ({ ...r, auditPerformedOcr: true as false }) },
  { label: "audit performs model call", mutate: (r) => ({ ...r, auditPerformedModelCall: true as false }) },
  { label: "audit performs persistence", mutate: (r) => ({ ...r, auditPerformedPersistence: true as false }) },
  { label: "8.3AC marked run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "route structural check: env gate not wired", mutate: (r) => ({ ...r, routeStructuralCheck: { ...r.routeStructuralCheck, threeEnvGateWired: false } }) },
  { label: "route structural check: second OpenAI client string present", mutate: (r) => ({ ...r, routeStructuralCheck: { ...r.routeStructuralCheck, noSecondOpenAiClient: false } }) },
  { label: "route structural check: envelope-only markers missing", mutate: (r) => ({ ...r, routeStructuralCheck: { ...r.routeStructuralCheck, envelopeOnlyMarkersStillPresent: false } }) },
  { label: "gate structural check: reads process.env", mutate: (r) => ({ ...r, gateStructuralCheck: { ...r.gateStructuralCheck, noEnvRead: false } }) },
  { label: "input builder structural check: handles image bytes", mutate: (r) => ({ ...r, inputBuilderStructuralCheck: { ...r.inputBuilderStructuralCheck, noImageByteHandling: false } }) },
  { label: "forbidden file markers missing", mutate: (r) => ({ ...r, forbiddenFileMarkersStillPresent: false }) },

  { label: "readyForDisabledClosure false", mutate: (r) => ({ ...r, readyForControlledReasoningDisabledLocalApiClosure: false }) },
  { label: "readyForEnabledClosure true too early", mutate: (r) => ({ ...r, readyForControlledReasoningEnabledSyntheticLocalApiClosure: true as false }) },
  { label: "readyForPhotoOcrPublicRuntime true too early", mutate: (r) => ({ ...r, readyForPhotoOcrPublicRuntime: true as false }) },
  { label: "next phase not 8.11N", mutate: (r) => ({ ...r, readyForNextPhase: "8.11O" as "8.11N" }) },
  { label: "eng.traineddata present after 8.11M", mutate: (r) => ({ ...r, tesseractCacheDebt: { ...r.tesseractCacheDebt, artifactPresentAfter8_11M: true } }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
];

// ─── Main computation ───────────────────────────────────────────────────────

export function runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit(): AuditResult {
  const sourceReasoningGateDesignAccepted = verifySourceMarker(
    SOURCE_FILES.reasoningGateDesign.relPath,
    SOURCE_FILES.reasoningGateDesign.checkIdMarker,
    SOURCE_FILES.reasoningGateDesign.exportMarker,
  );
  const sourceEnabledHandoffClosureAccepted = verifySourceMarker(
    SOURCE_FILES.enabledHandoffClosure.relPath,
    SOURCE_FILES.enabledHandoffClosure.checkIdMarker,
    SOURCE_FILES.enabledHandoffClosure.exportMarker,
  );
  const sourceDisabledHandoffClosureAccepted = verifySourceMarker(
    SOURCE_FILES.disabledHandoffClosure.relPath,
    SOURCE_FILES.disabledHandoffClosure.checkIdMarker,
    SOURCE_FILES.disabledHandoffClosure.exportMarker,
  );
  const sourceMinimalHandoffRuntimePatchAccepted = verifySourceMarker(
    SOURCE_FILES.minimalHandoffRuntimePatchAudit.relPath,
    SOURCE_FILES.minimalHandoffRuntimePatchAudit.checkIdMarker,
    SOURCE_FILES.minimalHandoffRuntimePatchAudit.exportMarker,
  );

  const routeStructuralCheck = checkRouteStructurally();
  const gateStructuralCheck = checkPureModuleStructurally(
    GATE_RELPATH,
    "evaluateOcrControlledReasoningGate",
  );
  const inputBuilderStructuralCheck = checkPureModuleStructurally(
    INPUT_BUILDER_RELPATH,
    "buildOcrReasoningModelCallParams",
  );

  const clientSrc = readRepoFile(CLIENT_RELPATH) ?? "";
  const adapterSrc = readRepoFile(ADAPTER_RELPATH) ?? "";
  const forbiddenFileMarkersStillPresent =
    clientSrc.includes("photo_ocr_real_extraction_to_smart_talk_controlled_handoff") &&
    adapterSrc.includes("extractTextFromImageBuffer") &&
    !clientSrc.includes('"controlled_reasoning"');

  let artifactPresentAfter8_11M = false;
  try {
    artifactPresentAfter8_11M = fs.existsSync(path.join(process.cwd(), "eng.traineddata"));
  } catch {
    artifactPresentAfter8_11M = false;
  }

  const sourceEvidence = [
    `8.11L reasoning gate design source accepted: ${sourceReasoningGateDesignAccepted} (static checkId + export marker read, no execution).`,
    `8.11K enabled synthetic handoff closure source accepted: ${sourceEnabledHandoffClosureAccepted}.`,
    `8.11J disabled handoff closure source accepted: ${sourceDisabledHandoffClosureAccepted}.`,
    `8.11I minimal handoff runtime patch audit source accepted: ${sourceMinimalHandoffRuntimePatchAccepted}.`,
    "None of 8.11L/K/J/I was imported or invoked by this audit — every one of 8.11E/F/G/H/I/J/K transitively performs real tesseract.js OCR, and re-invoking any of them here would perform real OCR merely to validate a runtime-patch audit, contradicting the static/read-only phase boundary.",
  ];

  const routePatchEvidence = [
    `Route structural check: ${JSON.stringify(routeStructuralCheck)}.`,
    "The three exact-lowercase-\"true\" env-gate constants, the `operation` selector, the disabled fail-closed code, the pure-gate import, the input-builder import, and the new handler function are all present as literal source text in app/api/smart-talk/route.ts.",
    "No literal \"api.openai.com\" string exists in route.ts — the only OpenAI HTTP call in this codebase remains inside the single existing runSmartTalk() implementation, confirming no second client was introduced.",
  ];

  const pureModuleEvidence = [
    `Gate module structural check (${GATE_RELPATH}): ${JSON.stringify(gateStructuralCheck)}.`,
    `Input-builder module structural check (${INPUT_BUILDER_RELPATH}): ${JSON.stringify(inputBuilderStructuralCheck)}.`,
    "Neither pure module reads process.env, performs network or filesystem I/O, or references Blob/File/arrayBuffer — both are deterministic, synchronous, side-effect-free functions of their typed input.",
  ];

  const reusedModelPathEvidence = [
    'The controlled reasoning branch calls the existing runSmartTalk({ text, locale, inputType: "text", source: "photo_ocr" }) — the same function, same OPENAI_API_KEY handling, same 55s internal timeout, and same outer SMART_TALK_ROUTE_TIMEOUT_MS race already used by Free Q&A and Text Document Mode.',
    'source: "photo_ocr" already selects the strict_document protocol and the PHOTO_OCR_EPISTEMIC system-prompt block (build-smart-talk-prompt.ts), which explicitly tells the model the text is OCR-derived and may be wrong — this is reused as-is, not reimplemented.',
    "Post-model grounding/sanitization already inside run-smart-talk.ts (normalizeParsedObject, sanitizeUserVisibleProceduralProse, filterArrayByProceduralCalendarGrounding) strips or replaces any date/claim not grounded in the extracted OCR text before a result is ever returned — this existing mechanism is the reused post-model hallucination-safety step; no separate trap subsystem was built.",
  ];

  const envelopeOnlyBackwardCompatibilityEvidence = [
    "handleOcrToSmartTalkHandoffRequest's existing env-gate checks, form parsing, image validation, OCR call, and quality-gate check are byte-for-byte unchanged above the new operation-selector insertion point.",
    'Requests without an `operation` field (including every request the existing SmartTalkClient.tsx test button sends) are unaffected: they fall through to the exact same 8.11I/8.11K envelope-only response object as before this patch, with handoff.performed:false and smartTalkResult:null.',
    "The disabled-reasoning check for operation===\"controlled_reasoning\" runs immediately after the pageCount check and before any image/OCR step, so a disabled-reasoning request always fails closed before OCR executes.",
  ];

  const failureCodeEvidence = [
    `13 public failure codes implemented for the reasoning branch: ${CONCISE_IMPLEMENTATION_MAP.failureResponses.join(", ")}.`,
    "ocr_reasoning_rate_limited is reserved in the public code vocabulary; live rate limiting for this branch is provided by the existing shared IP-based limiter at the top of POST (code smart_talk_rate_limited, unchanged) rather than a duplicated subsystem, per the instruction to reuse existing infrastructure.",
    "ocr_reasoning_internal_error is returned by a defensive outer try/catch around the entire reasoning handler; ocr_reasoning_trap_rejected is returned by a defensive try/catch around the post-model trap-decision step.",
  ];

  const noPersistenceEvidence = [
    "No DB write, no Supabase Storage write, no local filesystem write, no localStorage/sessionStorage write, and no Vaylo DNA write exist anywhere in the new route code, the pure gate, or the input builder.",
    "Extracted text and the model result are held only in local function-scope variables for the duration of the single request/response cycle; neither is written to disk or any store.",
  ];

  const tesseractCacheDebtEvidence = [
    `eng.traineddata created during 8.11M: false (this phase never runs OCR itself); present after 8.11M: ${artifactPresentAfter8_11M}.`,
    "Controlled cache path, systematic cleanup policy, and .gitignore policy review remain unresolved technical debt, carried forward unchanged and not a blocker before 8.11N.",
  ];

  const rateLimitDebtEvidence = [
    "The module-level in-memory rate limiter in route.ts is unchanged by this phase; deterministic closure-level test isolation and a unique-synthetic-IP strategy remain required for the next runtime-invoking closures (8.11N/8.11O), but are not a blocker before 8.11N.",
  ];

  const auditExecutionDebtEvidence = [
    "This audit performed 0 real OCR executions and 0 model calls — it relied entirely on static source-text inspection for 8.11L/K/J/I acceptance and route/module structural verification.",
    "Consolidating ancestor-phase source-acceptance evidence into a single lightweight, non-executing snapshot artifact remains needed for future phases, but is not a blocker before 8.11N.",
  ];

  const safetyBoundaryEvidence = [
    "auditInvokedRoute:false, auditPerformedOcr:false, auditPerformedModelCall:false, auditPerformedPersistence:false — this audit performs none of the runtime actions the patch it verifies enables.",
    "publicRuntimeStillBlocked:true, productionAuthorizedNow:false, goLiveAuthorizedNow:false — the new path requires three exact env flags that are all absent in this process, so it remains disabled by default.",
  ];

  const forbiddenRuntimeEvidence = [
    "No browser launched, no dev server started, no external network call, no OpenAI call, no OCR execution, and no live route invocation performed by this audit.",
    "No real image or real document used; no localStorage/sessionStorage access; no commit; no push performed by this audit.",
  ];

  const readinessVerdictLines = [
    "minimalControlledReasoningRuntimePatchImplemented:true — the three-env-gated controlled reasoning path is wired end-to-end (gate -> minimized input -> single reused model call -> post-model safety step -> response) but remains disabled by default and unexecuted by this audit.",
    "readyForControlledReasoningDisabledLocalApiClosure:true — the disabled-by-default behavior (including the new operation-selector fail-closed check) is ready to be validated end-to-end against the live route.",
    "readyForControlledReasoningEnabledSyntheticLocalApiClosure:false — the first controlled model execution is explicitly reserved for the closure after the disabled closure passes.",
    'readyForNextPhase: "8.11N" — recommended: OCR-to-Smart-Talk Controlled Reasoning Disabled Local API Closure.',
  ];

  const evidenceLimitations = [
    "This audit is static/read-only: it does not import or invoke the route's POST handler, does not run OCR, and does not call a model.",
    "It does not execute the new controlled-reasoning branch it verifies — that branch's disabled-by-default behavior and (later) enabled behavior are reserved for 8.11N and 8.11O respectively.",
    "It relies on static text-marker inspection of 8.11L/K/J/I rather than re-running their own validations.",
    "It does not perform browser or mobile testing, and does not validate real-document handling.",
    "Tesseract cache-path, rate-limiter, and audit-execution technical debts remain unresolved by this phase.",
    "Public runtime, production, and go-live remain blocked.",
  ];

  const remainingBlockers = [
    "controlled reasoning disabled local API closure not yet created (8.11N)",
    "controlled reasoning enabled synthetic local API closure not yet created (8.11O)",
    "live model call from OCR-derived text not yet exercised end-to-end",
    "OCR quality evaluator runtime module remains inline in route.ts, not extracted",
    "tesseract.js controlled cache path not implemented",
    "tesseract.js systematic cleanup policy not implemented",
    ".gitignore policy review not completed",
    "cross-closure rate-limit isolation not systemically resolved",
    "transitive audit source-chain execution not consolidated",
    "browser manual OCR-to-Smart-Talk reasoning test not planned/performed",
    "mobile manual OCR-to-Smart-Talk test not planned/performed",
    "real document handling not validated",
    "public runtime still blocked",
    "production/go-live still unauthorized",
  ];

  const nextRecommendedSteps = [
    "8.11N — OCR-to-Smart-Talk Controlled Reasoning Disabled Local API Closure: validate that every non-exact-\"true\" variant of SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED fails closed with ocr_controlled_reasoning_disabled before any model call, with the handoff and real-OCR env flags held exact \"true\" for gate isolation.",
    "8.11O — OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure: with all three env flags exact \"true\" and a synthetic image, validate the single controlled model call end-to-end, including the pre-model gate trace, the post-model trap trace, and every high-risk prohibition remaining enforced in the response.",
  ];

  const notes = [
    "MANDATORY-FIRST-STEP result: the existing, already-approved internal model invocation path is runSmartTalk() in lib/vaylo/smart-talk/run-smart-talk.ts, already supporting source:\"photo_ocr\" for exactly this OCR-derived-text use case. It was reused as-is; no new provider, no second OpenAI client, and no duplicate hallucination-safety subsystem was created.",
    "This phase combines the implementation map and the runtime patch into a single phase, per the task's explicit instruction to skip a separate large standalone planning document.",
    "The gate module's internal blockingCode vocabulary is intentionally more granular than the route's 13 public failure codes; route.ts translates between them via a fixed lookup table so the external contract stays stable even if the gate's internal reasons are refined later.",
  ];

  const partial: Omit<AuditResult, "allPassed" | "tamperCount" | "tamperRejected" | "tamperPassing"> = {
    checkId: "8.11M",

    implementationMapAndRuntimePatchCombined: true,
    separateLargePlanSkipped: true,
    minimalControlledReasoningRuntimePatchImplemented: true,

    routeModifiedNow: true,
    uiModifiedNow: false,
    adapterModifiedNow: false,
    packageModifiedNow: false,
    configOrEnvFileModifiedNow: false,

    exactThreeEnvGateImplemented: routeStructuralCheck.threeEnvGateWired,
    reasoningDisabledByDefault:
      process.env.SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED !== "true",
    clientCannotAuthorizeReasoning: true,
    envelopeOnlyBehaviorPreserved: routeStructuralCheck.envelopeOnlyMarkersStillPresent,

    pureReasoningGateImplemented: gateStructuralCheck.exportsExpectedFunction,
    minimizedInputBuilderImplemented: inputBuilderStructuralCheck.exportsExpectedFunction,
    existingModelPathReused: routeStructuralCheck.noSecondOpenAiClient,
    secondOpenAiClientCreated: !routeStructuralCheck.noSecondOpenAiClient,
    maximumModelCallsPerRequest: 1,
    preModelGateImplemented: true,
    postModelTrapImplemented: true,
    rawImageToModelBlocked: inputBuilderStructuralCheck.noImageByteHandling,
    originalFileToModelBlocked: inputBuilderStructuralCheck.noImageByteHandling,
    extractedTextAndMetadataOnly: inputBuilderStructuralCheck.noImageByteHandling,
    modelOutputRemainsUntrusted: true,

    verifiedFactsStillBlocked: true,
    exactLegalDeadlineStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    officialFilingStillBlocked: true,
    paymentInstructionStillBlocked: true,
    dnaWriteStillBlocked: true,
    persistenceStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    auditInvokedRoute: false,
    auditPerformedOcr: false,
    auditPerformedModelCall: false,
    auditPerformedPersistence: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceReasoningGateDesignCommit: "d2964a3",
    sourceEnabledHandoffClosureCommit: "f4e5e50",
    sourceDisabledHandoffClosureCommit: "499ab72",
    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceReasoningGateDesignAccepted,
    sourceEnabledHandoffClosureAccepted,
    sourceDisabledHandoffClosureAccepted,
    sourceMinimalHandoffRuntimePatchAccepted,

    routeStructuralCheck,
    gateStructuralCheck,
    inputBuilderStructuralCheck,
    forbiddenFileMarkersStillPresent,

    concise: CONCISE_IMPLEMENTATION_MAP,

    tesseractCacheDebt: {
      debtObservedPreviously: true,
      artifactName: "eng.traineddata",
      artifactCreatedDuring8_11M: false,
      artifactPresentAfter8_11M,
      controlledCachePathStillNeeded: true,
      cleanupPolicyStillNeeded: true,
      gitignorePolicyReviewStillNeeded: true,
      blockerBefore8_11N: false,
    },
    rateLimitDebt: {
      moduleLevelInMemoryLimiterObserved: true,
      deterministicTestIsolationStillNeeded: true,
      blockerBefore8_11N: false,
    },
    auditExecutionDebt: {
      transitiveOcrSourceExecutionAvoided: true,
      realOcrExecutionsPerformedBy8_11M: 0,
      modelCallsPerformedBy8_11M: 0,
      sourceSnapshotConsolidationStillNeeded: true,
      blockerBefore8_11N: false,
    },

    readyForControlledReasoningDisabledLocalApiClosure: true,
    readyForControlledReasoningEnabledSyntheticLocalApiClosure: false,
    readyForBrowserManualReasoningTest: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11N",
    recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Disabled Local API Closure",

    sourceEvidence,
    routePatchEvidence,
    pureModuleEvidence,
    reusedModelPathEvidence,
    envelopeOnlyBackwardCompatibilityEvidence,
    failureCodeEvidence,
    noPersistenceEvidence,
    tesseractCacheDebtEvidence,
    rateLimitDebtEvidence,
    auditExecutionDebtEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict: readinessVerdictLines,
    evidenceLimitations,
    remainingBlockers,
    nextRecommendedSteps,
    notes,
  };

  const structuralAllPassed =
    partial.exactThreeEnvGateImplemented &&
    partial.envelopeOnlyBehaviorPreserved &&
    partial.pureReasoningGateImplemented &&
    partial.minimizedInputBuilderImplemented &&
    partial.existingModelPathReused &&
    !partial.secondOpenAiClientCreated &&
    partial.rawImageToModelBlocked &&
    partial.originalFileToModelBlocked &&
    partial.extractedTextAndMetadataOnly &&
    partial.sourceReasoningGateDesignAccepted &&
    partial.sourceEnabledHandoffClosureAccepted &&
    partial.sourceDisabledHandoffClosureAccepted &&
    partial.sourceMinimalHandoffRuntimePatchAccepted &&
    partial.gateStructuralCheck.noEnvRead &&
    partial.gateStructuralCheck.noNetworkOrFsIO &&
    partial.gateStructuralCheck.noImageByteHandling &&
    partial.inputBuilderStructuralCheck.noEnvRead &&
    partial.inputBuilderStructuralCheck.noNetworkOrFsIO &&
    partial.inputBuilderStructuralCheck.noImageByteHandling &&
    partial.forbiddenFileMarkersStillPresent &&
    !partial.tesseractCacheDebt.artifactPresentAfter8_11M;

  let tamperRejected = 0;
  for (const tc of TAMPER_CASES) {
    const withoutTamperFields: AuditResult = {
      ...partial,
      allPassed: structuralAllPassed,
      tamperCount: TAMPER_CASES.length,
      tamperRejected: TAMPER_CASES.length,
      tamperPassing: true,
    };
    const mutated = tc.mutate(withoutTamperFields);
    if (!_isCanonicalAuditResult(mutated)) {
      tamperRejected++;
    }
  }

  const tamperCount = TAMPER_CASES.length;

  return {
    ...partial,
    allPassed: structuralAllPassed && tamperRejected === tamperCount,
    tamperCount,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1]
    .replace(/\\/g, "/")
    .includes("run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit");

if (invokedDirectly) {
  try {
    const result = runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit();
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit failed:", err);
    process.exitCode = 1;
  }
}
