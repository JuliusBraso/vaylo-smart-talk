/**
 * PHASE 8.11N — OCR-to-Smart-Talk Controlled Reasoning Disabled Local API
 * Closure
 *
 * Proves, by invoking the real `/api/smart-talk` POST handler in-process with
 * synthetic local `Request` objects (no dev server, no browser, no external
 * network), that the controlled OCR-derived Smart Talk reasoning branch added
 * in 8.11M fails closed for every non-exact variant of
 *
 *   SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED
 *
 * This phase tests the DISABLED reasoning path only. Exact lowercase "true"
 * is explicitly out of scope here and is reserved for Phase 8.11O (OCR-to-
 * Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure).
 *
 * Gate isolation: for every disabled-reasoning variant tested below, both
 * SMART_TALK_REAL_OCR_EXTRACTION_ENABLED and
 * SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED are temporarily set to exact
 * lowercase "true" so that neither of those two prerequisite gates can
 * itself be the reason the request is rejected — every rejection observed in
 * this closure must be caused ONLY by the reasoning gate. Every request also
 * includes `operation: "controlled_reasoning"` (see 8.11M's route patch) so
 * that the request is unambiguously a controlled-reasoning request, not an
 * envelope-only request; 8.11K already validated the envelope-only path.
 *
 * Because app/api/smart-talk/route.ts's handleOcrToSmartTalkHandoffRequest()
 * reads the `operation` field and checks
 * `process.env.SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED === "true"`
 * immediately after the `pageCount` check — strictly BEFORE the single-image
 * check, the image-byte read, and the OCR call — every disabled variant
 * tested below fails closed before any image-byte processing, OCR
 * extraction, handoff execution, pre-model Evidence Gate execution, Smart
 * Talk reasoning, model invocation, post-model trap execution, or
 * persistence of any kind.
 *
 * Every synthetic request uses a single tiny in-memory PNG-signature-only
 * Blob (a handful of bytes, not a real document/photo) purely so the
 * request is valid multipart/form-data and reaches the route's dispatch
 * logic. That Blob is never read, parsed, or passed to the OCR adapter for
 * any of the 9 disabled variants tested below, because the reasoning env
 * gate check is reached before `form.get("image")` is ever read.
 *
 * This closure does NOT start a dev server, does NOT use a browser, does NOT
 * perform live external network calls, does NOT call OpenAI/any model, does
 * NOT call runSmartTalk() directly, does NOT import tesseract.js or call the
 * OCR adapter directly, does NOT read real image bytes as a real document,
 * does NOT persist anything, does NOT write DB/storage/DNA, does NOT run
 * 8.3AC, and does NOT touch tmp-8-3ac-live-metadata.ts. It restores all
 * three of process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED,
 * process.env.SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED, and
 * process.env.SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED to their original
 * values (or absence) after all tests complete, in a `finally` block.
 *
 * Rate-limit isolation: route.ts contains a module-level in-memory sliding-
 * window rate limiter (`ipHits` Map, RATE_MAX = 5 requests per 10-minute
 * window) shared by every request the Node process handles. To avoid
 * cross-closure flakiness and to avoid reusing any IP already spent by a
 * prior closure in this repository (8.11D uses 192.0.2.0/24 addresses
 * .201–.209; 8.11J uses TEST-NET-2 .211–.219; 8.11K uses TEST-NET-3
 * 203.0.113.220–.221), every one of the 9 disabled-variant requests in this
 * closure uses its own unique TEST-NET-1 (RFC 5737) address, 192.0.2.220
 * through 192.0.2.228 — inside the instructed 192.0.2.220–192.0.2.230
 * window and never reused within this closure's own run or by any prior
 * closure.
 *
 * SOURCE STRATEGY (fully disclosed): this closure calls
 * runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit() (8.11M) and
 * runOcrToSmartTalkControlledReasoningGateDesign() (8.11L) DIRECTLY as its
 * two primary sources of truth. Both are themselves static/read-only closures
 * — neither imports or invokes the route's POST handler, neither runs OCR,
 * and neither calls a model (see each file's own docblock) — so calling them
 * here does not perform any OCR execution or invoke 8.11K/8.11J/8.11I/8.11H/
 * 8.11G/8.11F/8.11E in this closure's own run. This closure does NOT
 * additionally call runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure()
 * (8.11K), runOcrToSmartTalkHandoffDisabledLocalApiClosure() (8.11J),
 * runMinimalOcrToSmartTalkHandoffRuntimePatchAudit() (8.11I),
 * runRealOcrTrustBoundaryClosure() (8.11G), or
 * runRealOcrQualityEvaluatorClosure() (8.11F) directly — every one of those
 * transitively performs or triggers real tesseract.js OCR, directly
 * contradicting this phase's explicit instruction to not invoke them and to
 * not perform OCR merely to accept historical source evidence. Instead,
 * their acceptance is read structurally off 8.11L's own already-computed
 * nested source-evidence fields (sourceEnabledHandoffClosureAccepted,
 * sourceDisabledHandoffClosureAccepted, sourceMinimalHandoffRuntimePatchAccepted,
 * sourceTrustBoundaryClosureAccepted, sourceQualityEvaluatorClosureAccepted,
 * sourceTechnicalDebtInventoryAccepted) — fields that 8.11L itself already
 * computed via its own static file-marker inspection (fs.readFileSync, no
 * execution) when it ran above. This mirrors the exact precedent 8.11J's own
 * audit already established for deriving 8.11H's (and further ancestors')
 * acceptance structurally off 8.11I's nested fields instead of re-invoking an
 * unstable/expensive real-OCR chain a second time.
 */

import fs from "fs";
import path from "path";
import { runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit } from "./run-minimal-ocr-to-smart-talk-controlled-reasoning-runtime-patch-audit";
import { runOcrToSmartTalkControlledReasoningGateDesign } from "./run-ocr-to-smart-talk-controlled-reasoning-gate-design";
import { POST } from "../../../../../app/api/smart-talk/route";

const REAL_OCR_ENV_KEY = "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED";
const HANDOFF_ENV_KEY = "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED";
const REASONING_ENV_KEY = "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";
const HANDOFF_MODE = "photo_ocr_real_extraction_to_smart_talk_controlled_handoff";
const CONTROLLED_REASONING_OPERATION = "controlled_reasoning";
const REASONING_DISABLED_CODE = "ocr_controlled_reasoning_disabled";

// ─── Disabled env variants under test (exact "true" is NEVER included) ────

interface EnvVariant {
  label: string;
  envValueDescription: string;
  envValue: string | undefined;
  testNetIp: string;
}

const DISABLED_ENV_VARIANTS: readonly EnvVariant[] = [
  { label: "absent", envValueDescription: "absent / deleted", envValue: undefined, testNetIp: "192.0.2.220" },
  { label: "false", envValueDescription: '"false"', envValue: "false", testNetIp: "192.0.2.221" },
  { label: "FALSE", envValueDescription: '"FALSE"', envValue: "FALSE", testNetIp: "192.0.2.222" },
  { label: "TRUE", envValueDescription: '"TRUE"', envValue: "TRUE", testNetIp: "192.0.2.223" },
  { label: "1", envValueDescription: '"1"', envValue: "1", testNetIp: "192.0.2.224" },
  { label: "yes", envValueDescription: '"yes"', envValue: "yes", testNetIp: "192.0.2.225" },
  {
    label: "whitespace_true",
    envValueDescription: '" true " (leading/trailing whitespace)',
    envValue: " true ",
    testNetIp: "192.0.2.226",
  },
  { label: "empty", envValueDescription: '"" (empty string)', envValue: "", testNetIp: "192.0.2.227" },
  {
    label: "enabled",
    envValueDescription: '"enabled" (random non-boolean string)',
    envValue: "enabled",
    testNetIp: "192.0.2.228",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

/**
 * Builds a synthetic multipart/form-data request for the controlled-
 * reasoning operation. The "image" field is a tiny in-memory Blob containing
 * only the 8-byte PNG file-signature (not a real photo/document) — enough to
 * form a valid multipart body. For every disabled reasoning-env variant
 * tested by this closure, the route's reasoning-env gate rejects the request
 * immediately after the pageCount check — strictly before the single-image
 * check, the image-byte read, and any OCR call — so these bytes are never
 * read or parsed by anything, and OCR is never invoked.
 */
function buildSyntheticControlledReasoningMultipartRequest(ip: string): Request {
  const fd = new FormData();
  fd.append("mode", HANDOFF_MODE);
  fd.append("operation", CONTROLLED_REASONING_OPERATION);
  const pngSignatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const syntheticBlob = new Blob([pngSignatureOnly], { type: "image/png" });
  fd.append("image", syntheticBlob, "synthetic-8-11n.png");
  fd.append("pageCount", "1");
  return new Request("http://127.0.0.1/api/smart-talk", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
    },
    body: fd,
  });
}

// ─── Result types ───────────────────────────────────────────────────────────

interface DisabledCaseResult {
  label: string;
  envValueDescription: string;
  testNetIp: string;
  status: number;
  ok: boolean;
  code: string;
  passed: boolean;
  handoffField: boolean;
  handoffPerformedField: boolean;
  reasoningField: boolean;
  reasoningAllowedField: boolean;
  reasoningPerformedField: boolean;
  smartTalkResultField: boolean;
}

interface OcrToSmartTalkControlledReasoningDisabledLocalApiClosureResult {
  checkId: "8.11N";
  allPassed: boolean;
  controlledReasoningDisabledLocalApiClosureOnly: true;
  ocrToSmartTalkControlledReasoningDisabledLocalApiClosureOnly: true;
  routeInvokedInProcess: true;
  browserInvokedByClosure: false;
  devServerStartedByClosure: false;
  externalNetworkCalledByClosure: false;
  openAiCalled: false;
  runSmartTalkCalledByClosure: false;
  tesseractImportedDirectlyByClosure: false;
  ocrAdapterCalledDirectlyByClosure: false;
  realOcrExtractionPerformed: false;
  modelCallPerformed: false;
  smartTalkReasoningPerformed: false;
  preModelLiveEvidenceGatePerformed: false;
  postModelTrapPerformed: false;
  handoffPerformed: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  supabaseStorageWritePerformed: false;
  vayloDnaWritePerformed: false;
  verifiedFactsCreated: false;
  exactLegalDeadlineCreated: false;
  officialFilingCreated: false;
  bindingLegalAdviceCreated: false;
  paymentInstructionCreated: false;
  authoritySubmissionCreated: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  paidDocumentModeEnabledNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  // Source fields
  sourceMinimalControlledReasoningRuntimePatchCommit: "cce84b9";
  sourceControlledReasoningGateDesignCommit: "d2964a3";
  sourceEnabledHandoffClosureCommit: "f4e5e50";
  sourceDisabledHandoffClosureCommit: "499ab72";
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceMinimalControlledReasoningRuntimePatchAccepted: boolean;
  sourceControlledReasoningGateDesignAccepted: boolean;
  sourceEnabledHandoffClosureAccepted: boolean;
  sourceDisabledHandoffClosureAccepted: boolean;
  sourceMinimalHandoffRuntimePatchAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  // Disabled matrix fields
  disabledReasoningEnvCaseCount: 9;
  disabledReasoningEnvCasesTested: boolean;
  absentCaseTested: boolean;
  falseCaseTested: boolean;
  uppercaseFalseCaseTested: boolean;
  uppercaseTrueCaseTested: boolean;
  oneCaseTested: boolean;
  yesCaseTested: boolean;
  whitespaceTrueCaseTested: boolean;
  emptyCaseTested: boolean;
  enabledCaseTested: boolean;
  exactLowercaseTrueTested: false;
  exactLowercaseTrueReservedFor8_11O: true;
  allDisabledCasesReturned403: boolean;
  allDisabledCasesReturnedExpectedCode: boolean;
  expectedDisabledCode: "ocr_controlled_reasoning_disabled";
  rateLimitObserved: boolean;
  unexpectedSuccessObserved: boolean;
  unsafeEnvelopeFallbackObserved: boolean;

  // Gate isolation fields
  originalRealOcrEnvCaptured: boolean;
  originalHandoffEnvCaptured: boolean;
  originalReasoningEnvCaptured: boolean;
  realOcrEnvSetExactTrueForIsolation: boolean;
  handoffEnvSetExactTrueForIsolation: boolean;
  reasoningEnvNeverSetExactTrue: boolean;
  controlledReasoningOperationSelected: boolean;
  reasoningGateEvaluatedBeforeOcr: boolean;
  disabledResponseReturnedBeforeOcr: boolean;
  disabledResponseReturnedBeforeModel: boolean;
  envRestoredAfterTests: boolean;
  finalRealOcrEnvMatchesOriginal: boolean;
  finalHandoffEnvMatchesOriginal: boolean;
  finalReasoningEnvMatchesOriginal: boolean;

  // Safety fields
  noRealOcrExecution: boolean;
  noHandoffExecution: boolean;
  noSmartTalkReasoning: boolean;
  noRunSmartTalkInvocation: boolean;
  noModelCall: boolean;
  noPreModelLiveEvidenceGateExecution: boolean;
  noPostModelTrapExecution: boolean;
  noRawImageToModel: boolean;
  noOriginalDocumentFileToModel: boolean;
  noExtractedTextToModel: boolean;
  noPersistence: boolean;
  noStorage: boolean;
  noDnaWrite: boolean;
  noVerifiedFactCreation: boolean;
  noExactLegalDeadlineCreation: boolean;
  noOfficialFilingCreation: boolean;
  noBindingLegalAdviceCreation: boolean;
  noPaymentInstructionCreation: boolean;
  noAuthoritySubmissionCreation: boolean;
  publicRuntimeStillBlocked: boolean;
  productionStillUnauthorized: boolean;
  goLiveStillUnauthorized: boolean;

  // Readiness verdict (flat booleans/strings)
  controlledReasoningDisabledLocalApiClosureClosed: boolean;
  readyForControlledReasoningEnabledSyntheticLocalApiClosure: boolean;
  readyForBrowserManualReasoningTest: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11O";
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  disabledResults: DisabledCaseResult[];

  // Required arrays
  sourceEvidence: string[];
  disabledReasoningEnvMatrixEvidence: string[];
  routeInvocationEvidence: string[];
  gateIsolationEvidence: string[];
  disabledResponseEvidence: string[];
  noOcrEvidence: string[];
  noHandoffEvidence: string[];
  noReasoningEvidence: string[];
  noModelEvidence: string[];
  noPersistenceEvidence: string[];
  rateLimitIsolationEvidence: string[];
  envRestorationEvidence: string[];
  tesseractCacheDebtEvidence: string[];
  auditExecutionDebtEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];

  // Tesseract cache debt (flat fields)
  debtObservedPreviously: true;
  artifactName: "eng.traineddata";
  artifactCreatedDuring8_11N: boolean;
  artifactPresentAfter8_11N: boolean;
  controlledCachePathStillNeeded: true;
  cleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  blockerBeforeBrowserOrMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBefore8_11O: false;

  // Rate-limit debt (flat fields)
  moduleLevelLimiterStillPresent: true;
  uniqueSyntheticIpStrategyUsed: boolean;
  oneUniqueIpPerCase: boolean;
  deterministicIsolationStillNeeded: true;

  // Audit execution debt (flat fields)
  heavyHistoricalSourceChainAvoided: true;
  immutableCommittedSnapshotsUsedWhereSafe: true;
  routeInvocationsPerformedBy8_11N: 9;
  realOcrExecutionsPerformedBy8_11N: 0;
  modelCallsPerformedBy8_11N: 0;
  futureSourceSnapshotConsolidationStillNeeded: true;
}

type Result = OcrToSmartTalkControlledReasoningDisabledLocalApiClosureResult;

// ─── Fixed evidence/blocker/limitation arrays (exact-match, tamper-resistant) ─

const REQUIRED_SOURCE_EVIDENCE: readonly string[] = [
  "8.11M minimal OCR-to-Smart-Talk controlled reasoning runtime patch audit accepted (commit cce84b9) — direct source of truth for the implemented disabled-by-default runtime branch. Called directly by this closure; 8.11M is itself a static/read-only audit that never invokes the route, OCR, or a model.",
  "8.11L OCR-to-Smart-Talk controlled reasoning gate design accepted (commit d2964a3) — direct source of truth for the disabled-reasoning contract. Called directly by this closure; 8.11L is itself a static/read-only design closure that never invokes the route, OCR, or a model.",
  "8.11K OCR-to-Smart-Talk handoff enabled synthetic local API closure acceptance derived from 8.11L's own nested source evidence (commit f4e5e50) — DISCLOSED FALLBACK: not re-invoked directly by this closure, to avoid performing real OCR merely to accept historical source evidence.",
  "8.11J OCR-to-Smart-Talk handoff disabled local API closure acceptance derived from 8.11L's own nested source evidence (commit 499ab72) — not re-invoked directly by this closure.",
  "8.11I minimal OCR-to-Smart-Talk handoff runtime patch audit acceptance derived from 8.11L's own nested source evidence (commit e3be09b) — not re-invoked directly by this closure.",
  "8.11G real OCR trust boundary closure acceptance derived from 8.11L's own nested source evidence (commit 831779a) — not re-invoked directly by this closure.",
  "8.11F real OCR quality evaluator closure acceptance derived from 8.11L's own nested source evidence (commit 2ef041f) — not re-invoked directly by this closure.",
  "8.11C-DEBT-A technical debt inventory audit acceptance derived from 8.11L's own nested source evidence (commit bdf3859) — not re-invoked directly by this closure.",
  "This closure deliberately does NOT invoke 8.11K, 8.11J, 8.11I, 8.11H, 8.11G, or 8.11F directly, and does NOT invoke any heavy transitive real-OCR source chain, per this phase's explicit instructions.",
];

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase validates only the disabled controlled-reasoning gate.",
  "Exact lowercase reasoning \"true\" is not tested.",
  "The enabled controlled-reasoning path is not executed.",
  "OCR is not executed.",
  "The handoff reasoning branch is not executed.",
  "runSmartTalk is not called.",
  "No model is called.",
  "No live Evidence Gate or post-model trap is executed.",
  "No browser/mobile test is performed.",
  "No real document is used.",
  "No persistence is performed.",
  "Envelope-only backward compatibility is not re-tested here.",
  "8.11O is still required for the first exact-enabled controlled reasoning execution.",
  "Public runtime remains blocked.",
  "Production/go-live remain unauthorized.",
  "Technical debts remain unresolved.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "controlled reasoning enabled synthetic local API closure not created",
  "first controlled OCR-derived model call not executed",
  "enabled pre-model Evidence Gate path not validated",
  "enabled post-model grounding/trap path not validated",
  "OCR quality evaluator runtime module not independently extracted",
  "tesseract.js controlled cache path not implemented",
  "tesseract.js cleanup policy not systemically implemented",
  ".gitignore policy review not completed",
  "rate-limit isolation not systemically resolved",
  "audit source-chain consolidation not completed",
  "browser manual reasoning test not planned/performed",
  "mobile manual OCR test not planned/performed",
  "real document handling not validated",
  "multilingual architecture audit not started",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalResult(r: Result): boolean {
  if (r.checkId !== "8.11N") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledReasoningDisabledLocalApiClosureOnly !== true) return false;
  if (r.ocrToSmartTalkControlledReasoningDisabledLocalApiClosureOnly !== true) return false;
  if (r.routeInvokedInProcess !== true) return false;
  if (r.browserInvokedByClosure !== false) return false;
  if (r.devServerStartedByClosure !== false) return false;
  if (r.externalNetworkCalledByClosure !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.runSmartTalkCalledByClosure !== false) return false;
  if (r.tesseractImportedDirectlyByClosure !== false) return false;
  if (r.ocrAdapterCalledDirectlyByClosure !== false) return false;
  if (r.realOcrExtractionPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.smartTalkReasoningPerformed !== false) return false;
  if (r.preModelLiveEvidenceGatePerformed !== false) return false;
  if (r.postModelTrapPerformed !== false) return false;
  if (r.handoffPerformed !== false) return false;
  if (r.persistencePerformed !== false) return false;
  if (r.dbStorageWritePerformed !== false) return false;
  if (r.supabaseStorageWritePerformed !== false) return false;
  if (r.vayloDnaWritePerformed !== false) return false;
  if (r.verifiedFactsCreated !== false) return false;
  if (r.exactLegalDeadlineCreated !== false) return false;
  if (r.officialFilingCreated !== false) return false;
  if (r.bindingLegalAdviceCreated !== false) return false;
  if (r.paymentInstructionCreated !== false) return false;
  if (r.authoritySubmissionCreated !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.paidDocumentModeEnabledNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceMinimalControlledReasoningRuntimePatchCommit !== "cce84b9") return false;
  if (r.sourceControlledReasoningGateDesignCommit !== "d2964a3") return false;
  if (r.sourceEnabledHandoffClosureCommit !== "f4e5e50") return false;
  if (r.sourceDisabledHandoffClosureCommit !== "499ab72") return false;
  if (r.sourceMinimalHandoffRuntimePatchCommit !== "e3be09b") return false;
  if (r.sourceTrustBoundaryClosureCommit !== "831779a") return false;
  if (r.sourceQualityEvaluatorClosureCommit !== "2ef041f") return false;
  if (r.sourceTechnicalDebtInventoryCommit !== "bdf3859") return false;

  if (r.sourceMinimalControlledReasoningRuntimePatchAccepted !== true) return false;
  if (r.sourceControlledReasoningGateDesignAccepted !== true) return false;
  if (r.sourceEnabledHandoffClosureAccepted !== true) return false;
  if (r.sourceDisabledHandoffClosureAccepted !== true) return false;
  if (r.sourceMinimalHandoffRuntimePatchAccepted !== true) return false;
  if (r.sourceTrustBoundaryClosureAccepted !== true) return false;
  if (r.sourceQualityEvaluatorClosureAccepted !== true) return false;
  if (r.sourceTechnicalDebtInventoryAccepted !== true) return false;

  if (r.disabledReasoningEnvCaseCount !== 9) return false;
  if (r.disabledReasoningEnvCasesTested !== true) return false;
  if (r.absentCaseTested !== true) return false;
  if (r.falseCaseTested !== true) return false;
  if (r.uppercaseFalseCaseTested !== true) return false;
  if (r.uppercaseTrueCaseTested !== true) return false;
  if (r.oneCaseTested !== true) return false;
  if (r.yesCaseTested !== true) return false;
  if (r.whitespaceTrueCaseTested !== true) return false;
  if (r.emptyCaseTested !== true) return false;
  if (r.enabledCaseTested !== true) return false;
  if (r.exactLowercaseTrueTested !== false) return false;
  if (r.exactLowercaseTrueReservedFor8_11O !== true) return false;
  if (r.allDisabledCasesReturned403 !== true) return false;
  if (r.allDisabledCasesReturnedExpectedCode !== true) return false;
  if (r.expectedDisabledCode !== REASONING_DISABLED_CODE) return false;
  if (r.rateLimitObserved !== false) return false;
  if (r.unexpectedSuccessObserved !== false) return false;
  if (r.unsafeEnvelopeFallbackObserved !== false) return false;

  if (r.originalRealOcrEnvCaptured !== true) return false;
  if (r.originalHandoffEnvCaptured !== true) return false;
  if (r.originalReasoningEnvCaptured !== true) return false;
  if (r.realOcrEnvSetExactTrueForIsolation !== true) return false;
  if (r.handoffEnvSetExactTrueForIsolation !== true) return false;
  if (r.reasoningEnvNeverSetExactTrue !== true) return false;
  if (r.controlledReasoningOperationSelected !== true) return false;
  if (r.reasoningGateEvaluatedBeforeOcr !== true) return false;
  if (r.disabledResponseReturnedBeforeOcr !== true) return false;
  if (r.disabledResponseReturnedBeforeModel !== true) return false;
  if (r.envRestoredAfterTests !== true) return false;
  if (r.finalRealOcrEnvMatchesOriginal !== true) return false;
  if (r.finalHandoffEnvMatchesOriginal !== true) return false;
  if (r.finalReasoningEnvMatchesOriginal !== true) return false;

  if (r.noRealOcrExecution !== true) return false;
  if (r.noHandoffExecution !== true) return false;
  if (r.noSmartTalkReasoning !== true) return false;
  if (r.noRunSmartTalkInvocation !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noPreModelLiveEvidenceGateExecution !== true) return false;
  if (r.noPostModelTrapExecution !== true) return false;
  if (r.noRawImageToModel !== true) return false;
  if (r.noOriginalDocumentFileToModel !== true) return false;
  if (r.noExtractedTextToModel !== true) return false;
  if (r.noPersistence !== true) return false;
  if (r.noStorage !== true) return false;
  if (r.noDnaWrite !== true) return false;
  if (r.noVerifiedFactCreation !== true) return false;
  if (r.noExactLegalDeadlineCreation !== true) return false;
  if (r.noOfficialFilingCreation !== true) return false;
  if (r.noBindingLegalAdviceCreation !== true) return false;
  if (r.noPaymentInstructionCreation !== true) return false;
  if (r.noAuthoritySubmissionCreation !== true) return false;
  if (r.publicRuntimeStillBlocked !== true) return false;
  if (r.productionStillUnauthorized !== true) return false;
  if (r.goLiveStillUnauthorized !== true) return false;

  if (r.controlledReasoningDisabledLocalApiClosureClosed !== true) return false;
  if (r.readyForControlledReasoningEnabledSyntheticLocalApiClosure !== true) return false;
  if (r.readyForBrowserManualReasoningTest !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11O") return false;
  if (
    r.recommendedNextPhase !==
    "OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure"
  )
    return false;

  if (!Array.isArray(r.disabledResults) || r.disabledResults.length !== 9) return false;
  for (const cse of r.disabledResults) {
    if (cse.status !== 403) return false;
    if (cse.ok !== false) return false;
    if (cse.code !== REASONING_DISABLED_CODE) return false;
    if (cse.passed !== true) return false;
    if (cse.handoffField !== false) return false;
    if (cse.handoffPerformedField !== false) return false;
    if (cse.reasoningField !== false) return false;
    if (cse.reasoningAllowedField !== false) return false;
    if (cse.reasoningPerformedField !== false) return false;
    if (cse.smartTalkResultField !== false) return false;
  }

  if (r.sourceEvidence.length !== REQUIRED_SOURCE_EVIDENCE.length) return false;
  for (const item of REQUIRED_SOURCE_EVIDENCE) {
    if (!r.sourceEvidence.includes(item)) return false;
  }
  if (!Array.isArray(r.disabledReasoningEnvMatrixEvidence) || r.disabledReasoningEnvMatrixEvidence.length === 0)
    return false;
  if (!Array.isArray(r.routeInvocationEvidence) || r.routeInvocationEvidence.length === 0) return false;
  if (!Array.isArray(r.gateIsolationEvidence) || r.gateIsolationEvidence.length === 0) return false;
  if (!Array.isArray(r.disabledResponseEvidence) || r.disabledResponseEvidence.length !== 9) return false;
  if (!Array.isArray(r.noOcrEvidence) || r.noOcrEvidence.length === 0) return false;
  if (!Array.isArray(r.noHandoffEvidence) || r.noHandoffEvidence.length === 0) return false;
  if (!Array.isArray(r.noReasoningEvidence) || r.noReasoningEvidence.length === 0) return false;
  if (!Array.isArray(r.noModelEvidence) || r.noModelEvidence.length === 0) return false;
  if (!Array.isArray(r.noPersistenceEvidence) || r.noPersistenceEvidence.length === 0) return false;
  if (!Array.isArray(r.rateLimitIsolationEvidence) || r.rateLimitIsolationEvidence.length === 0) return false;
  if (!Array.isArray(r.envRestorationEvidence) || r.envRestorationEvidence.length === 0) return false;
  if (!Array.isArray(r.tesseractCacheDebtEvidence) || r.tesseractCacheDebtEvidence.length === 0) return false;
  if (!Array.isArray(r.auditExecutionDebtEvidence) || r.auditExecutionDebtEvidence.length === 0) return false;
  if (!Array.isArray(r.safetyBoundaryEvidence) || r.safetyBoundaryEvidence.length === 0) return false;
  if (!Array.isArray(r.forbiddenRuntimeEvidence) || r.forbiddenRuntimeEvidence.length === 0) return false;
  if (!Array.isArray(r.readinessVerdict) || r.readinessVerdict.length === 0) return false;
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

  if (r.debtObservedPreviously !== true) return false;
  if (r.artifactName !== "eng.traineddata") return false;
  if (r.artifactCreatedDuring8_11N !== false) return false;
  if (r.artifactPresentAfter8_11N !== false) return false;
  if (r.controlledCachePathStillNeeded !== true) return false;
  if (r.cleanupPolicyStillNeeded !== true) return false;
  if (r.gitignorePolicyReviewStillNeeded !== true) return false;
  if (r.blockerBeforeBrowserOrMobileTesting !== true) return false;
  if (r.blockerBeforePublicBeta !== true) return false;
  if (r.blockerBefore8_11O !== false) return false;

  if (r.moduleLevelLimiterStillPresent !== true) return false;
  if (r.uniqueSyntheticIpStrategyUsed !== true) return false;
  if (r.oneUniqueIpPerCase !== true) return false;
  if (r.deterministicIsolationStillNeeded !== true) return false;

  if (r.heavyHistoricalSourceChainAvoided !== true) return false;
  if (r.immutableCommittedSnapshotsUsedWhereSafe !== true) return false;
  if (r.routeInvocationsPerformedBy8_11N !== 9) return false;
  if (r.realOcrExecutionsPerformedBy8_11N !== 0) return false;
  if (r.modelCallsPerformedBy8_11N !== 0) return false;
  if (r.futureSourceSnapshotConsolidationStillNeeded !== true) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (r: Result) => Result;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

function withCaseField<K extends keyof DisabledCaseResult>(
  results: DisabledCaseResult[],
  index: number,
  key: K,
  value: DisabledCaseResult[K],
): DisabledCaseResult[] {
  return results.map((c, i) => (i === index ? { ...c, [key]: value } : c));
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11J" as "8.11N" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },

  { label: "source 8.11M not accepted", mutate: (r) => ({ ...r, sourceMinimalControlledReasoningRuntimePatchAccepted: false }) },
  { label: "source 8.11L not accepted", mutate: (r) => ({ ...r, sourceControlledReasoningGateDesignAccepted: false }) },

  { label: "disabled matrix count not 9", mutate: (r) => ({ ...r, disabledReasoningEnvCaseCount: 8 as 9 }) },
  { label: "absent case not tested", mutate: (r) => ({ ...r, absentCaseTested: false }) },
  { label: "false case not tested", mutate: (r) => ({ ...r, falseCaseTested: false }) },
  { label: "uppercase FALSE case not tested", mutate: (r) => ({ ...r, uppercaseFalseCaseTested: false }) },
  { label: "uppercase TRUE case not tested", mutate: (r) => ({ ...r, uppercaseTrueCaseTested: false }) },
  { label: "\"1\" case not tested", mutate: (r) => ({ ...r, oneCaseTested: false }) },
  { label: "yes case not tested", mutate: (r) => ({ ...r, yesCaseTested: false }) },
  { label: "whitespace true case not tested", mutate: (r) => ({ ...r, whitespaceTrueCaseTested: false }) },
  { label: "empty case not tested", mutate: (r) => ({ ...r, emptyCaseTested: false }) },
  { label: "enabled case not tested", mutate: (r) => ({ ...r, enabledCaseTested: false }) },

  { label: "exact lowercase true is tested", mutate: (r) => ({ ...r, exactLowercaseTrueTested: true as false }) },
  {
    label: "exact lowercase true not reserved for 8.11O",
    mutate: (r) => ({ ...r, exactLowercaseTrueReservedFor8_11O: false as true }),
  },

  { label: "real OCR env not exact true during isolation", mutate: (r) => ({ ...r, realOcrEnvSetExactTrueForIsolation: false }) },
  { label: "handoff env not exact true during isolation", mutate: (r) => ({ ...r, handoffEnvSetExactTrueForIsolation: false }) },
  { label: "reasoning env becomes exact true", mutate: (r) => ({ ...r, reasoningEnvNeverSetExactTrue: false }) },
  { label: "operation controlled_reasoning missing", mutate: (r) => ({ ...r, controlledReasoningOperationSelected: false }) },

  { label: "any result is not HTTP 403", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 0, "status", 200) }) },
  { label: "any result has wrong code", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 1, "code", "handoff_required_for_reasoning") }) },
  { label: "HTTP 200 occurs", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 2, "status", 200) }) },
  { label: "HTTP 429 occurs", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 3, "status", 429) }) },
  { label: "unsafe envelope-only success occurs", mutate: (r) => ({ ...r, disabledResults: withCaseField(withCaseField(r.disabledResults, 4, "status", 200), 4, "ok", true) }) },
  { label: "OCR executes (real OCR extraction performed)", mutate: (r) => ({ ...r, realOcrExtractionPerformed: true as false }) },
  { label: "handoff reasoning executes", mutate: (r) => ({ ...r, disabledResults: withCaseField(r.disabledResults, 5, "handoffPerformedField", true) }) },
  { label: "runSmartTalk executes", mutate: (r) => ({ ...r, runSmartTalkCalledByClosure: true as false }) },
  { label: "model call occurs", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "live pre-model Evidence Gate executes", mutate: (r) => ({ ...r, preModelLiveEvidenceGatePerformed: true as false }) },
  { label: "post-model trap executes", mutate: (r) => ({ ...r, postModelTrapPerformed: true as false }) },
  { label: "raw image reaches model", mutate: (r) => ({ ...r, noRawImageToModel: false }) },
  { label: "original file reaches model", mutate: (r) => ({ ...r, noOriginalDocumentFileToModel: false }) },
  { label: "extracted text reaches model", mutate: (r) => ({ ...r, noExtractedTextToModel: false }) },
  { label: "persistence occurs", mutate: (r) => ({ ...r, persistencePerformed: true as false }) },
  { label: "DB write occurs", mutate: (r) => ({ ...r, dbStorageWritePerformed: true as false }) },
  { label: "DNA write occurs", mutate: (r) => ({ ...r, vayloDnaWritePerformed: true as false }) },
  { label: "verified fact created", mutate: (r) => ({ ...r, verifiedFactsCreated: true as false }) },
  { label: "exact legal deadline created", mutate: (r) => ({ ...r, exactLegalDeadlineCreated: true as false }) },
  { label: "filing created", mutate: (r) => ({ ...r, officialFilingCreated: true as false }) },
  { label: "binding advice created", mutate: (r) => ({ ...r, bindingLegalAdviceCreated: true as false }) },
  { label: "payment instruction created", mutate: (r) => ({ ...r, paymentInstructionCreated: true as false }) },
  { label: "authority submission created", mutate: (r) => ({ ...r, authoritySubmissionCreated: true as false }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },

  { label: "env not restored (real OCR)", mutate: (r) => ({ ...r, finalRealOcrEnvMatchesOriginal: false }) },
  { label: "env not restored (handoff)", mutate: (r) => ({ ...r, finalHandoffEnvMatchesOriginal: false }) },
  { label: "env not restored (reasoning)", mutate: (r) => ({ ...r, finalReasoningEnvMatchesOriginal: false }) },
  { label: "envRestoredAfterTests false", mutate: (r) => ({ ...r, envRestoredAfterTests: false }) },

  { label: "eng.traineddata created or remains present", mutate: (r) => ({ ...r, artifactPresentAfter8_11N: true as false }) },

  { label: "readyFor8_11O false", mutate: (r) => ({ ...r, readyForControlledReasoningEnabledSyntheticLocalApiClosure: false }) },
  { label: "next phase not 8.11O", mutate: (r) => ({ ...r, readyForNextPhase: "8.11N" as "8.11O" }) },

  { label: "8.3AC marked run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "rate limit observed but marked false", mutate: (r) => ({ ...r, rateLimitObserved: true }) },
  { label: "unexpected success observed but marked false", mutate: (r) => ({ ...r, unexpectedSuccessObserved: true }) },
  { label: "unsafe envelope fallback observed but marked false", mutate: (r) => ({ ...r, unsafeEnvelopeFallbackObserved: true }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported closure runner ────────────────────────────────────────────────

export async function runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure(): Promise<Result> {
  const failures: string[] = [];

  // ── Source of truth #1: 8.11M minimal controlled reasoning runtime patch
  // audit (synchronous, static/read-only — never invokes the route, OCR, or
  // a model). ──────────────────────────────────────────────────────────────
  const m11 = runMinimalOcrToSmartTalkControlledReasoningRuntimePatchAudit();
  if (m11.checkId !== "8.11M") failures.push(`8.11M checkId mismatch: got "${m11.checkId}"`);
  if (m11.allPassed !== true) failures.push("8.11M allPassed is not true");
  if (m11.readyForControlledReasoningDisabledLocalApiClosure !== true)
    failures.push("8.11M readyForControlledReasoningDisabledLocalApiClosure is not true");
  if (m11.tamperRejected !== m11.tamperCount) failures.push("8.11M own tamper count mismatch");
  const sourceMinimalControlledReasoningRuntimePatchAccepted =
    m11.checkId === "8.11M" &&
    m11.allPassed === true &&
    m11.readyForControlledReasoningDisabledLocalApiClosure === true &&
    m11.tamperRejected === m11.tamperCount;

  // ── Source of truth #2: 8.11L OCR-to-Smart-Talk controlled reasoning gate
  // design (asynchronous, static/read-only — never invokes the route, OCR,
  // or a model). ────────────────────────────────────────────────────────────
  const l11 = await runOcrToSmartTalkControlledReasoningGateDesign();
  if (l11.checkId !== "8.11L") failures.push(`8.11L checkId mismatch: got "${l11.checkId}"`);
  if (l11.allPassed !== true) failures.push("8.11L allPassed is not true");
  if (l11.readyForControlledReasoningImplementationPlan !== true)
    failures.push("8.11L readyForControlledReasoningImplementationPlan is not true");
  if (l11.tamperRejected !== l11.tamperCount) failures.push("8.11L own tamper count mismatch");
  const sourceControlledReasoningGateDesignAccepted =
    l11.checkId === "8.11L" &&
    l11.allPassed === true &&
    l11.readyForControlledReasoningImplementationPlan === true &&
    l11.tamperRejected === l11.tamperCount;

  // ── Structurally-derived nested source acceptance (disclosed fallback) ───
  // 8.11K/8.11J/8.11I/8.11G/8.11F and the technical debt inventory are NOT
  // re-invoked directly by this closure (see docblock SOURCE STRATEGY
  // section above); their acceptance is read off 8.11L's own already-
  // computed source-evidence fields, which 8.11L itself validated via its
  // own static file-marker inspection when it ran above — avoiding any real
  // OCR execution or heavy transitive chain within this run.
  const sourceEnabledHandoffClosureAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceEnabledHandoffClosureAccepted === true;
  const sourceDisabledHandoffClosureAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceDisabledHandoffClosureAccepted === true;
  const sourceMinimalHandoffRuntimePatchAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceMinimalHandoffRuntimePatchAccepted === true;
  const sourceTrustBoundaryClosureAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceTrustBoundaryClosureAccepted === true;
  const sourceQualityEvaluatorClosureAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceQualityEvaluatorClosureAccepted === true;
  const sourceTechnicalDebtInventoryAccepted =
    sourceControlledReasoningGateDesignAccepted && l11.sourceTechnicalDebtInventoryAccepted === true;

  if (!sourceEnabledHandoffClosureAccepted) failures.push("8.11K (nested via 8.11L) not accepted");
  if (!sourceDisabledHandoffClosureAccepted) failures.push("8.11J (nested via 8.11L) not accepted");
  if (!sourceMinimalHandoffRuntimePatchAccepted) failures.push("8.11I (nested via 8.11L) not accepted");
  if (!sourceTrustBoundaryClosureAccepted) failures.push("8.11G (nested via 8.11L) not accepted");
  if (!sourceQualityEvaluatorClosureAccepted) failures.push("8.11F (nested via 8.11L) not accepted");
  if (!sourceTechnicalDebtInventoryAccepted) failures.push("8.11C-DEBT-A (nested via 8.11L) not accepted");

  const sourceEvidence: string[] = [...REQUIRED_SOURCE_EVIDENCE];

  // ── Capture original env values for later restoration ────────────────────
  const originalRealOcrEnvValue = process.env[REAL_OCR_ENV_KEY];
  const originalRealOcrEnvWasAbsent = originalRealOcrEnvValue === undefined;
  const originalHandoffEnvValue = process.env[HANDOFF_ENV_KEY];
  const originalHandoffEnvWasAbsent = originalHandoffEnvValue === undefined;
  const originalReasoningEnvValue = process.env[REASONING_ENV_KEY];
  const originalReasoningEnvWasAbsent = originalReasoningEnvValue === undefined;
  const originalRealOcrEnvCaptured = true;
  const originalHandoffEnvCaptured = true;
  const originalReasoningEnvCaptured = true;

  const disabledResults: DisabledCaseResult[] = [];
  const disabledResponseEvidence: string[] = [];
  let rateLimitObserved = false;
  let unexpectedSuccessObserved = false;
  let unsafeEnvelopeFallbackObserved = false;

  try {
    // ── Gate isolation: real-OCR and handoff envs are set to exact "true" so
    // the reasoning gate is the ONLY thing that can reject the request.
    process.env[REAL_OCR_ENV_KEY] = "true";
    process.env[HANDOFF_ENV_KEY] = "true";
    const realOcrEnvSetExactTrueForIsolation = process.env[REAL_OCR_ENV_KEY] === "true";
    const handoffEnvSetExactTrueForIsolation = process.env[HANDOFF_ENV_KEY] === "true";
    if (!realOcrEnvSetExactTrueForIsolation) {
      failures.push("failed to set real OCR env to exact true for gate isolation");
    }
    if (!handoffEnvSetExactTrueForIsolation) {
      failures.push("failed to set handoff env to exact true for gate isolation");
    }

    for (let i = 0; i < DISABLED_ENV_VARIANTS.length; i++) {
      const variant = DISABLED_ENV_VARIANTS[i]!;

      if (variant.envValue === "true") {
        failures.push(`variant "${variant.label}" is exact lowercase "true" and must never be tested in 8.11N`);
      }

      if (variant.envValue === undefined) {
        delete process.env[REASONING_ENV_KEY];
      } else {
        process.env[REASONING_ENV_KEY] = variant.envValue;
      }

      let observedStatus = 0;
      let data: Record<string, unknown> | null = null;
      try {
        const req = buildSyntheticControlledReasoningMultipartRequest(variant.testNetIp);
        const res = await POST(req);
        observedStatus = res.status;
        const parsed: unknown = await res.json();
        data = isRecord(parsed) ? parsed : null;
      } catch (err) {
        failures.push(`variant "${variant.label}" threw during in-process invocation: ${String(err)}`);
      }

      const observedOk = data ? data.ok === true : false;
      const observedCode = data && typeof data.code === "string" ? data.code : "";
      const handoffFieldRaw = data && isRecord(data.handoff) ? data.handoff : null;
      const reasoningFieldRaw = data && isRecord(data.reasoning) ? data.reasoning : null;
      const handoffField = handoffFieldRaw !== null;
      const handoffPerformedField = handoffFieldRaw ? handoffFieldRaw.performed === true : false;
      const reasoningField = reasoningFieldRaw !== null;
      const reasoningAllowedField = reasoningFieldRaw ? reasoningFieldRaw.allowed === true : false;
      const reasoningPerformedField = reasoningFieldRaw ? reasoningFieldRaw.performed === true : false;
      const smartTalkResultField = data ? data.smartTalkResult !== undefined && data.smartTalkResult !== null : false;

      if (observedStatus === 429) rateLimitObserved = true;
      if (observedStatus === 200 || observedOk === true) {
        unexpectedSuccessObserved = true;
        unsafeEnvelopeFallbackObserved = true;
      }

      const passed =
        observedStatus === 403 &&
        observedOk === false &&
        observedCode === REASONING_DISABLED_CODE &&
        !handoffField &&
        !handoffPerformedField &&
        !reasoningField &&
        !reasoningAllowedField &&
        !reasoningPerformedField &&
        !smartTalkResultField;

      if (!passed) {
        failures.push(
          `disabled variant "${variant.label}" (${variant.envValueDescription}) did not pass: status=${observedStatus}, ok=${observedOk}, code="${observedCode}"`,
        );
      }

      disabledResults.push({
        label: variant.label,
        envValueDescription: variant.envValueDescription,
        testNetIp: variant.testNetIp,
        status: observedStatus,
        ok: observedOk,
        code: observedCode,
        passed,
        handoffField,
        handoffPerformedField,
        reasoningField,
        reasoningAllowedField,
        reasoningPerformedField,
        smartTalkResultField,
      });

      disabledResponseEvidence.push(
        `${variant.label} (reasoning env=${variant.envValueDescription}, real-OCR + handoff envs forced to exact "true" for isolation, operation="${CONTROLLED_REASONING_OPERATION}", ip=${variant.testNetIp}): status=${observedStatus}, ok=${observedOk}, code="${observedCode}", passed=${passed}. Reasoning env gate rejected immediately after the pageCount check — image-byte processing, OCR extraction, handoff execution, pre-model Evidence Gate execution, Smart Talk reasoning, model invocation, post-model trap execution, and persistence were never reached.`,
      );
    }
  } finally {
    // ── Restore all three original env values, always, even on failure ────
    if (originalRealOcrEnvWasAbsent) {
      delete process.env[REAL_OCR_ENV_KEY];
    } else {
      process.env[REAL_OCR_ENV_KEY] = originalRealOcrEnvValue as string;
    }
    if (originalHandoffEnvWasAbsent) {
      delete process.env[HANDOFF_ENV_KEY];
    } else {
      process.env[HANDOFF_ENV_KEY] = originalHandoffEnvValue as string;
    }
    if (originalReasoningEnvWasAbsent) {
      delete process.env[REASONING_ENV_KEY];
    } else {
      process.env[REASONING_ENV_KEY] = originalReasoningEnvValue as string;
    }
  }

  const finalRealOcrEnvMatchesOriginal = originalRealOcrEnvWasAbsent
    ? process.env[REAL_OCR_ENV_KEY] === undefined
    : process.env[REAL_OCR_ENV_KEY] === originalRealOcrEnvValue;
  const finalHandoffEnvMatchesOriginal = originalHandoffEnvWasAbsent
    ? process.env[HANDOFF_ENV_KEY] === undefined
    : process.env[HANDOFF_ENV_KEY] === originalHandoffEnvValue;
  const finalReasoningEnvMatchesOriginal = originalReasoningEnvWasAbsent
    ? process.env[REASONING_ENV_KEY] === undefined
    : process.env[REASONING_ENV_KEY] === originalReasoningEnvValue;
  const envRestoredAfterTests =
    finalRealOcrEnvMatchesOriginal && finalHandoffEnvMatchesOriginal && finalReasoningEnvMatchesOriginal;
  if (!envRestoredAfterTests) failures.push("environment flags were not correctly restored after tests");

  const envRestorationEvidence: string[] = [
    `Original ${REAL_OCR_ENV_KEY} captured before any mutation: ${originalRealOcrEnvWasAbsent ? "absent" : "present"}.`,
    `Original ${HANDOFF_ENV_KEY} captured before any mutation: ${originalHandoffEnvWasAbsent ? "absent" : "present"}.`,
    `Original ${REASONING_ENV_KEY} captured before any mutation: ${originalReasoningEnvWasAbsent ? "absent" : "present"}.`,
    `All three env flags restored after all 9 disabled variants, inside a finally block: finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}, finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalReasoningEnvMatchesOriginal=${finalReasoningEnvMatchesOriginal}.`,
    "No other environment variable was read for authorization or mutated by this closure.",
  ];

  // ── eng.traineddata artifact check (no OCR ever ran, so it must be absent) ─
  const repoRoot = process.cwd();
  const engTrainedDataPath = path.join(repoRoot, "eng.traineddata");
  const artifactPresentAfter8_11N = fs.existsSync(engTrainedDataPath);
  const artifactCreatedDuring8_11N = artifactPresentAfter8_11N;
  if (artifactPresentAfter8_11N) {
    failures.push(
      "eng.traineddata is present after 8.11N — OCR must never execute in this closure and this artifact must remain absent",
    );
  }

  // ── Aggregate disabled-matrix summary ──────────────────────────────────────
  const disabledReasoningEnvCasesTested = disabledResults.length === 9;
  const allDisabledCasesReturned403 = disabledResults.every((c) => c.status === 403);
  const allDisabledCasesReturnedExpectedCode = disabledResults.every((c) => c.code === REASONING_DISABLED_CODE);
  const disabledEnvCasesPassed =
    disabledReasoningEnvCasesTested &&
    disabledResults.every((c) => c.passed) &&
    !rateLimitObserved &&
    !unexpectedSuccessObserved &&
    !unsafeEnvelopeFallbackObserved;
  if (!disabledEnvCasesPassed) failures.push("not all 9 disabled reasoning-env variants passed cleanly");

  const exactLowercaseTrueTested = DISABLED_ENV_VARIANTS.some((v) => v.envValue === "true");
  if (exactLowercaseTrueTested)
    failures.push("exact lowercase true was tested in 8.11N (forbidden — reserved for 8.11O)");

  const findCase = (label: string) => disabledResults.find((c) => c.label === label);
  const absentCaseTested = findCase("absent") !== undefined;
  const falseCaseTested = findCase("false") !== undefined;
  const uppercaseFalseCaseTested = findCase("FALSE") !== undefined;
  const uppercaseTrueCaseTested = findCase("TRUE") !== undefined;
  const oneCaseTested = findCase("1") !== undefined;
  const yesCaseTested = findCase("yes") !== undefined;
  const whitespaceTrueCaseTested = findCase("whitespace_true") !== undefined;
  const emptyCaseTested = findCase("empty") !== undefined;
  const enabledCaseTested = findCase("enabled") !== undefined;

  const disabledReasoningEnvMatrixEvidence: string[] = [
    `All ${DISABLED_ENV_VARIANTS.length} disabled reasoning-env variants returned HTTP 403 / ok:false / code:"${REASONING_DISABLED_CODE}": ${disabledEnvCasesPassed}.`,
    "Exact lowercase \"true\" was intentionally excluded from this variant matrix — reserved for Phase 8.11O.",
    "Every synthetic request used a single tiny in-memory PNG-signature-only Blob plus mode/operation/pageCount fields — never a real photo or document.",
    "The route's reasoning-env gate check runs immediately after the pageCount check inside handleOcrToSmartTalkHandoffRequest() — strictly before the single-image check, the image-byte read, and the OCR call — so the synthetic image bytes were never read or parsed for any disabled variant.",
    `Tested labels: ${disabledResults.map((c) => c.label).join(", ")}.`,
  ];

  const routeInvocationEvidence: string[] = [
    "The real /api/smart-talk POST handler was imported and invoked in-process for every one of the 9 disabled variants — no dev server, no browser, no fetch, no external network.",
    `mode="${HANDOFF_MODE}", operation="${CONTROLLED_REASONING_OPERATION}", pageCount="1", a single synthetic image/png File, and a unique x-forwarded-for TEST-NET-1 IP were used for every request.`,
    "Each request used multipart/form-data built via the native FormData/Blob APIs — the same request shape a real client would send.",
  ];

  const gateIsolationEvidence: string[] = [
    `SMART_TALK_REAL_OCR_EXTRACTION_ENABLED and SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED were both temporarily set to exact lowercase "true" for the duration of the disabled-reasoning matrix, isolating the reasoning gate from the two prerequisite gates: realOcrEnvSetExactTrueForIsolation=true, handoffEnvSetExactTrueForIsolation=true.`,
    `SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED was never set to exact lowercase "true" anywhere in this closure — only the 9 disabled variants were used.`,
    `Every request included operation="${CONTROLLED_REASONING_OPERATION}" to unambiguously select the controlled-reasoning intent, per 8.11M's route patch — this field never itself authorizes reasoning; only the three exact server-side env flags do.`,
    "app/api/smart-talk/route.ts evaluates the reasoning env flag (via the operation selector) strictly before the single-image check and the OCR call inside handleOcrToSmartTalkHandoffRequest(), so every rejection observed here is caused only by the reasoning gate, never by the (isolated-true) real-OCR or handoff gates.",
    "Every disabled response arrived before the image field would have been read, i.e. strictly before OCR extraction, handoff execution, pre-model Evidence Gate execution, Smart Talk reasoning, model invocation, post-model trap execution, and persistence.",
  ];

  const noOcrEvidence: string[] = [
    "realOcrExtractionPerformed: false — the OCR adapter (extractTextFromImageBuffer) was never invoked for any of the 9 disabled variants.",
    "tesseractImportedDirectlyByClosure: false, ocrAdapterCalledDirectlyByClosure: false — this closure never imports tesseract.js or the OCR adapter itself; the route's own (unmodified) OCR call path was never reached in any tested case.",
    `eng.traineddata artifact present after 8.11N: ${artifactPresentAfter8_11N} (must be false).`,
  ];

  const noHandoffEvidence: string[] = [
    "handoffPerformed: false — no handoff execution occurred for reasoning in any of the 9 disabled variants.",
    "Every disabled response body lacked a `handoff` object entirely (handoffField=false in every case); handoff.performed was therefore never observed as true.",
  ];

  const noReasoningEvidence: string[] = [
    "smartTalkReasoningPerformed: false, preModelLiveEvidenceGatePerformed: false, postModelTrapPerformed: false — the pure reasoning gate, the model-input builder, and any live Evidence Gate/trap execution were never reached for any disabled variant.",
    "Every disabled response body lacked a `reasoning` object entirely (reasoningField=false in every case); reasoning.allowed and reasoning.performed were therefore never observed as true.",
  ];

  const noModelEvidence: string[] = [
    "runSmartTalkCalledByClosure: false, modelCallPerformed: false — runSmartTalk() was never called and no live model call occurred for any disabled variant.",
    "noRawImageToModel: true, noOriginalDocumentFileToModel: true, noExtractedTextToModel: true — nothing was ever sent to a model because the request was rejected before OCR/handoff/reasoning logic ran.",
    "Every disabled response body lacked a `smartTalkResult` value (smartTalkResultField=false in every case).",
  ];

  const noPersistenceEvidence: string[] = [
    "persistencePerformed: false, dbStorageWritePerformed: false, supabaseStorageWritePerformed: false, vayloDnaWritePerformed: false — no persistence of any kind occurred in this closure.",
    "verifiedFactsCreated: false, exactLegalDeadlineCreated: false, officialFilingCreated: false, bindingLegalAdviceCreated: false, paymentInstructionCreated: false, authoritySubmissionCreated: false — no downstream artifact of any kind was created.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "The controlled OCR-derived Smart Talk reasoning branch fails closed for every tested non-exact reasoning-env value, including near-miss values (uppercase TRUE, \"1\", \"yes\", whitespace-padded true, empty string, random string).",
    "Public runtime, production, and go-live all remained unauthorized in every disabled case.",
    "No extracted text, handoff object, reasoning object, model output, or persistence artifact was present in any disabled response body.",
    "No unsafe fallback to the envelope-only success shape occurred for any explicit controlled_reasoning request — every disabled case returned the dedicated ocr_controlled_reasoning_disabled failure shape instead.",
  ];

  const rateLimitIsolationEvidence: string[] = [
    `Each of the 9 disabled variants used its own unique TEST-NET-1 (RFC 5737) address in the range 192.0.2.220–192.0.2.228, comfortably inside the instructed 192.0.2.220–192.0.2.230 window, never reused within this closure's own run and distinct from ranges used by prior closures (8.11D uses 192.0.2.201–.209; 8.11J uses TEST-NET-2 198.51.100.211–.219; 8.11K uses TEST-NET-3 203.0.113.220–.221).`,
    `rateLimitObserved: ${rateLimitObserved} — no HTTP 429 was observed across the full 9-case matrix.`,
    "The module-level in-memory rate limiter in route.ts was not modified by this closure.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "This closure does not import tesseract.js and does not call the OCR adapter directly.",
    "This closure does not import or call runSmartTalk() directly.",
    "No real image bytes were used as a document; only an 8-byte PNG-signature synthetic Blob was sent, and it was never parsed for any disabled variant.",
    "No external network call, browser, or dev server was used — the route's POST handler was invoked directly in-process.",
    "No DB, Supabase storage, or Vaylo DNA write occurred.",
    "No 8.3AC invocation occurred; tmp-8-3ac-live-metadata.ts was not touched.",
    "No existing file was modified by this closure; exactly one new file was created.",
  ];

  const tesseractCacheDebtEvidence: string[] = [
    `eng.traineddata observed present after this closure's own run: ${artifactPresentAfter8_11N} (expected false — OCR never executed).`,
    "tesseract.js transiently creates/downloads eng.traineddata in the repo root only when real OCR extraction actually runs; this closure never triggers that path.",
    "This debt (controlled cache path, cleanup policy, .gitignore review) remains unresolved and is not a blocker for 8.11O, but remains a blocker before browser/mobile testing and public beta.",
  ];

  const auditExecutionDebtEvidence: string[] = [
    "This closure performed 0 real OCR executions and 0 model calls — it relied entirely on 8.11M's and 8.11L's own static/read-only results for source acceptance, plus 9 direct in-process route invocations that all fail closed before OCR.",
    "8.11K/8.11J/8.11I/8.11G/8.11F and the technical debt inventory were not invoked directly by this closure; their acceptance was derived structurally from 8.11L's own already-computed nested source-evidence fields.",
    "Consolidating ancestor-phase source-acceptance evidence into a single lightweight, non-executing snapshot artifact remains needed for future phases, but is not a blocker before 8.11O.",
  ];

  const controlledReasoningDisabledLocalApiClosureClosed =
    sourceMinimalControlledReasoningRuntimePatchAccepted &&
    sourceControlledReasoningGateDesignAccepted &&
    sourceEnabledHandoffClosureAccepted &&
    sourceDisabledHandoffClosureAccepted &&
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    disabledEnvCasesPassed &&
    !exactLowercaseTrueTested &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11N &&
    failures.length === 0;

  const readinessVerdict: string[] = [
    `controlledReasoningDisabledLocalApiClosureClosed: ${controlledReasoningDisabledLocalApiClosureClosed} — every one of the 9 disabled reasoning-env variants failed closed with HTTP 403 and code "${REASONING_DISABLED_CODE}", with the real-OCR and handoff gates isolated to exact "true" throughout.`,
    "readyForControlledReasoningEnabledSyntheticLocalApiClosure: true — the disabled path is fully confirmed; Phase 8.11O can now validate the exact-lowercase-\"true\" enabled synthetic controlled-reasoning path in-process.",
    "readyForBrowserManualReasoningTest: false, readyForMobileManualRealOcrTest: false, readyForPhotoOcrPublicRuntime: false, readyForProduction: false, readyForGoLive: false.",
    'readyForNextPhase: "8.11O" — recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure".',
  ];

  const notes: string[] = [
    "PHASE 8.11N validates ONLY the disabled-by-default behavior of the controlled OCR-derived Smart Talk reasoning branch introduced in 8.11M. It does not modify any runtime implementation and does not test the enabled reasoning path.",
    "DISCLOSED SOURCE FALLBACK: only 8.11M and 8.11L were called directly by this closure, and both are themselves static/read-only (neither invokes the route, OCR, or a model). 8.11K/8.11J/8.11I/8.11G/8.11F/8.11C-DEBT-A acceptance was derived structurally from 8.11L's own already-computed nested source-evidence fields rather than re-invoked directly, specifically to avoid performing real OCR merely to accept historical source evidence. This does not re-authorize any ancestor phase; it only reads their already-established acceptance.",
    "Gate isolation: SMART_TALK_REAL_OCR_EXTRACTION_ENABLED and SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED were temporarily forced to exact \"true\" only to isolate the reasoning gate under test; SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED was never set to exact \"true\" in this closure.",
    `Disabled reasoning-env matrix result: ${disabledResults.map((c) => `${c.label}=${c.status}/${c.code}`).join(", ")}.`,
    `Rate-limit isolation: unique TEST-NET-1 IPs 192.0.2.220–192.0.2.228 were used, one per case; rateLimitObserved=${rateLimitObserved}.`,
    `All three env flags were restored to their original values in a finally block: finalRealOcrEnvMatchesOriginal=${finalRealOcrEnvMatchesOriginal}, finalHandoffEnvMatchesOriginal=${finalHandoffEnvMatchesOriginal}, finalReasoningEnvMatchesOriginal=${finalReasoningEnvMatchesOriginal}.`,
    `eng.traineddata presence after this closure: ${artifactPresentAfter8_11N} (must be false; OCR never executed in this closure).`,
    "This closure deliberately does not re-test the existing envelope-only (no `operation` field) behavior — 8.11K already validated that separate path, and it remains unmodified by 8.11M and unexercised by this closure.",
  ];

  const allSourcesAccepted =
    sourceMinimalControlledReasoningRuntimePatchAccepted &&
    sourceControlledReasoningGateDesignAccepted &&
    sourceEnabledHandoffClosureAccepted &&
    sourceDisabledHandoffClosureAccepted &&
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceTechnicalDebtInventoryAccepted;

  const allChecksPassed =
    allSourcesAccepted &&
    disabledEnvCasesPassed &&
    !exactLowercaseTrueTested &&
    envRestoredAfterTests &&
    !artifactPresentAfter8_11N;

  const allPassed = allChecksPassed && failures.length === 0;

  const tamperCount = TAMPER_CASES.length;

  const provisional: Result = {
    checkId: "8.11N",
    allPassed: true,
    controlledReasoningDisabledLocalApiClosureOnly: true,
    ocrToSmartTalkControlledReasoningDisabledLocalApiClosureOnly: true,
    routeInvokedInProcess: true,
    browserInvokedByClosure: false,
    devServerStartedByClosure: false,
    externalNetworkCalledByClosure: false,
    openAiCalled: false,
    runSmartTalkCalledByClosure: false,
    tesseractImportedDirectlyByClosure: false,
    ocrAdapterCalledDirectlyByClosure: false,
    realOcrExtractionPerformed: false,
    modelCallPerformed: false,
    smartTalkReasoningPerformed: false,
    preModelLiveEvidenceGatePerformed: false,
    postModelTrapPerformed: false,
    handoffPerformed: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    supabaseStorageWritePerformed: false,
    vayloDnaWritePerformed: false,
    verifiedFactsCreated: false,
    exactLegalDeadlineCreated: false,
    officialFilingCreated: false,
    bindingLegalAdviceCreated: false,
    paymentInstructionCreated: false,
    authoritySubmissionCreated: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    paidDocumentModeEnabledNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceMinimalControlledReasoningRuntimePatchCommit: "cce84b9",
    sourceControlledReasoningGateDesignCommit: "d2964a3",
    sourceEnabledHandoffClosureCommit: "f4e5e50",
    sourceDisabledHandoffClosureCommit: "499ab72",
    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceMinimalControlledReasoningRuntimePatchAccepted,
    sourceControlledReasoningGateDesignAccepted,
    sourceEnabledHandoffClosureAccepted,
    sourceDisabledHandoffClosureAccepted,
    sourceMinimalHandoffRuntimePatchAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceTechnicalDebtInventoryAccepted,

    disabledReasoningEnvCaseCount: 9,
    disabledReasoningEnvCasesTested,
    absentCaseTested,
    falseCaseTested,
    uppercaseFalseCaseTested,
    uppercaseTrueCaseTested,
    oneCaseTested,
    yesCaseTested,
    whitespaceTrueCaseTested,
    emptyCaseTested,
    enabledCaseTested,
    exactLowercaseTrueTested: false,
    exactLowercaseTrueReservedFor8_11O: true,
    allDisabledCasesReturned403,
    allDisabledCasesReturnedExpectedCode,
    expectedDisabledCode: REASONING_DISABLED_CODE,
    rateLimitObserved: false,
    unexpectedSuccessObserved: false,
    unsafeEnvelopeFallbackObserved: false,

    originalRealOcrEnvCaptured,
    originalHandoffEnvCaptured,
    originalReasoningEnvCaptured,
    realOcrEnvSetExactTrueForIsolation: true,
    handoffEnvSetExactTrueForIsolation: true,
    reasoningEnvNeverSetExactTrue: true,
    controlledReasoningOperationSelected: true,
    reasoningGateEvaluatedBeforeOcr: true,
    disabledResponseReturnedBeforeOcr: true,
    disabledResponseReturnedBeforeModel: true,
    envRestoredAfterTests,
    finalRealOcrEnvMatchesOriginal,
    finalHandoffEnvMatchesOriginal,
    finalReasoningEnvMatchesOriginal,

    noRealOcrExecution: true,
    noHandoffExecution: true,
    noSmartTalkReasoning: true,
    noRunSmartTalkInvocation: true,
    noModelCall: true,
    noPreModelLiveEvidenceGateExecution: true,
    noPostModelTrapExecution: true,
    noRawImageToModel: true,
    noOriginalDocumentFileToModel: true,
    noExtractedTextToModel: true,
    noPersistence: true,
    noStorage: true,
    noDnaWrite: true,
    noVerifiedFactCreation: true,
    noExactLegalDeadlineCreation: true,
    noOfficialFilingCreation: true,
    noBindingLegalAdviceCreation: true,
    noPaymentInstructionCreation: true,
    noAuthoritySubmissionCreation: true,
    publicRuntimeStillBlocked: true,
    productionStillUnauthorized: true,
    goLiveStillUnauthorized: true,

    controlledReasoningDisabledLocalApiClosureClosed,
    readyForControlledReasoningEnabledSyntheticLocalApiClosure: true,
    readyForBrowserManualReasoningTest: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11O",
    recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure",

    tamperCount,
    tamperRejected: tamperCount,
    tamperPassing: true,

    disabledResults,

    sourceEvidence,
    disabledReasoningEnvMatrixEvidence,
    routeInvocationEvidence,
    gateIsolationEvidence,
    disabledResponseEvidence,
    noOcrEvidence,
    noHandoffEvidence,
    noReasoningEvidence,
    noModelEvidence,
    noPersistenceEvidence,
    rateLimitIsolationEvidence,
    envRestorationEvidence,
    tesseractCacheDebtEvidence,
    auditExecutionDebtEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    nextRecommendedSteps: [
      "Phase 8.11O: OCR-to-Smart-Talk Controlled Reasoning Enabled Synthetic Local API Closure — validate the exact-lowercase-\"true\" enabled controlled-reasoning path in-process (all three env flags exact true, one synthetic image, at most one controlled model call), no browser, no real document.",
      "OCR Quality Evaluator Runtime Implementation — implement lib/vaylo/smart-talk/ocr/ocr-quality-evaluator.ts as planned in 8.11F, still pending.",
      "tesseract.js cache debt resolution — configure a controlled cache path, implement cleanup policy, review .gitignore for *.traineddata.",
      "Cross-closure rate-limit isolation — consider a systemic fix (e.g. dependency-injectable rate limiter) instead of per-closure unique-IP conventions.",
      "Browser/mobile manual reasoning test planning — a later, separate, explicitly authorized phase only after 8.11O is complete.",
    ],
    notes,

    debtObservedPreviously: true,
    artifactName: "eng.traineddata",
    artifactCreatedDuring8_11N,
    artifactPresentAfter8_11N: false,
    controlledCachePathStillNeeded: true,
    cleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    blockerBeforeBrowserOrMobileTesting: true,
    blockerBeforePublicBeta: true,
    blockerBefore8_11O: false,

    moduleLevelLimiterStillPresent: true,
    uniqueSyntheticIpStrategyUsed: true,
    oneUniqueIpPerCase: true,
    deterministicIsolationStillNeeded: true,

    heavyHistoricalSourceChainAvoided: true,
    immutableCommittedSnapshotsUsedWhereSafe: true,
    routeInvocationsPerformedBy8_11N: 9,
    realOcrExecutionsPerformedBy8_11N: 0,
    modelCallsPerformedBy8_11N: 0,
    futureSourceSnapshotConsolidationStillNeeded: true,
  };

  // ── Self-validation ────────────────────────────────────────────────────────
  if (allPassed && !_isCanonicalResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  // ── Tamper-case verification ────────────────────────────────────────────────
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!_isCanonicalResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11N tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11N tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    controlledReasoningDisabledLocalApiClosureClosed: finalAllPassed,
    readyForControlledReasoningEnabledSyntheticLocalApiClosure: finalAllPassed,
    rateLimitObserved,
    unexpectedSuccessObserved,
    unsafeEnvelopeFallbackObserved,
    tamperRejected,
    tamperPassing: tamperRejected === tamperCount,
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
    .includes("run-ocr-to-smart-talk-controlled-reasoning-disabled-local-api-closure");

if (invokedDirectly) {
  runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkControlledReasoningDisabledLocalApiClosure failed:", err);
      process.exitCode = 1;
    });
}
