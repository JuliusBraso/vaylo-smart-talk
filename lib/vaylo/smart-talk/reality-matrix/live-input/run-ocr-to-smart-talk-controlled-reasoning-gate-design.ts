/**
 * PHASE 8.11L — OCR-to-Smart-Talk Controlled Reasoning Gate Design
 *
 * DESIGN ONLY. Defines, as structured/inspectable data, the future
 * authorization gate that would decide whether an already-validated
 * OCR-to-Smart-Talk handoff envelope (8.11I/8.11J/8.11K) may ever be
 * authorized to enter real Smart Talk reasoning — and exactly when it must
 * fail closed instead.
 *
 * This phase does NOT implement the gate, does NOT modify route.ts or the
 * UI, does NOT add a runtime env flag, does NOT call OCR, does NOT execute
 * the handoff branch, does NOT call OpenAI or any model, does NOT run
 * Smart Talk reasoning, does NOT run Evidence Gates or hallucination traps
 * against live input, does NOT persist anything, and does NOT write DB/
 * storage/DNA. It designs:
 *
 *  - controlledReasoningGateContract — the exact state a handoff envelope
 *    must be in before reasoning could ever be attempted.
 *  - futureReasoningEnvironmentGateDesign — the future third env gate and
 *    its relationship to the two existing 8.11I gates.
 *  - reasoningAuthorizationConditions / reasoningBlockingConditions /
 *    reasoningDowngradeConditions — the full fail-closed decision matrix.
 *  - futureModelInputContract — strict model-input minimization (text +
 *    metadata only, never raw image/original file).
 *  - preModelEvidenceGateDesign / postModelHallucinationTrapDesign — the
 *    two-sided containment design around any future model call.
 *  - futureReasoningResponseContract / futureFailureContract — the future
 *    API response shape for both success and every fail-closed case.
 *  - futureRuntimeIntegrationPlanBoundary — where a future patch would
 *    live, without writing it now.
 *  - futureDisabledReasoningClosureDesign / futureEnabledSyntheticReasoningClosureDesign
 *    — the validation plan for the next two closures (8.11N/8.11O, or
 *    8.11O/8.11P if a distinct runtime-patch phase is inserted).
 *
 * SOURCE STRATEGY (fully disclosed): this closure does NOT invoke
 * runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure() (8.11K),
 * runOcrToSmartTalkHandoffDisabledLocalApiClosure() (8.11J),
 * runMinimalOcrToSmartTalkHandoffRuntimePatchAudit() (8.11I),
 * runOcrToSmartTalkHandoffPlan() (8.11H), runRealOcrTrustBoundaryClosure()
 * (8.11G), or runRealOcrQualityEvaluatorClosure() (8.11F) live — every one
 * of 8.11F/G/H/I/K performs or transitively triggers real tesseract.js OCR
 * execution internally, and 8.11K itself already validated the full
 * enabled-handoff round trip in this same environment. Re-invoking any of
 * them here would perform real OCR merely to validate a *design* document,
 * directly contradicting this phase's explicit instructions to not execute
 * 8.11F/G/H/I/K and to prefer immutable committed snapshot evidence.
 *
 * Instead, each of the six primary source files is confirmed present on
 * disk and confirmed via a cheap static text read (fs.readFileSync, no
 * execution) to contain its own expected `checkId` literal and exported
 * function name. Their full `allPassed:true` results were already directly
 * observed and reported in this same environment when each phase was
 * originally closed (8.11K commit f4e5e50, 8.11J commit 499ab72, 8.11I
 * commit e3be09b, 8.11H commit b839538, 8.11G commit 831779a, 8.11F commit
 * 2ef041f). The remaining ancestor phases (8.11E/D/C, 8.9N-PATCH, technical
 * debt inventory) are accepted transitively through 8.11F/G's own
 * already-established nested source evidence, without re-reading their
 * files individually.
 *
 * This closure performs exactly one filesystem side-effect check: it
 * confirms `eng.traineddata` is absent from the repo root (it never runs
 * OCR itself, so it never creates this artifact) and reports the result.
 * It performs no other I/O, no network call, no model call, and no write
 * of any kind.
 */

import fs from "fs";
import path from "path";

// ─── Static source-file markers (relative to repo root) ───────────────────

const SOURCE_FILES = {
  enabledHandoffClosure: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-enabled-synthetic-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11K"',
    exportMarker: "runOcrToSmartTalkHandoffEnabledSyntheticLocalApiClosure",
  },
  disabledHandoffClosure: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-disabled-local-api-closure.ts",
    checkIdMarker: 'checkId: "8.11J"',
    exportMarker: "runOcrToSmartTalkHandoffDisabledLocalApiClosure",
  },
  minimalHandoffRuntimePatchAudit: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-ocr-to-smart-talk-handoff-runtime-patch-audit.ts",
    checkIdMarker: 'checkId: "8.11I"',
    exportMarker: "runMinimalOcrToSmartTalkHandoffRuntimePatchAudit",
  },
  handoffPlan: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-to-smart-talk-handoff-plan.ts",
    checkIdMarker: 'checkId: "8.11H"',
    exportMarker: "runOcrToSmartTalkHandoffPlan",
  },
  trustBoundaryClosure: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-trust-boundary-closure.ts",
    checkIdMarker: 'checkId: "8.11G"',
    exportMarker: "runRealOcrTrustBoundaryClosure",
  },
  qualityEvaluatorClosure: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-quality-evaluator-closure.ts",
    checkIdMarker: 'checkId: "8.11F"',
    exportMarker: "runRealOcrQualityEvaluatorClosure",
  },
} as const;

function verifySourceMarker(relPath: string, checkIdMarker: string, exportMarker: string): boolean {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
    return src.includes(checkIdMarker) && src.includes(exportMarker);
  } catch {
    return false;
  }
}

// ─── Required code/condition lists (used by both the design payload and the
//     canonical checker, so they cannot silently drift apart) ─────────────

const REQUIRED_AUTHORIZATION_CONDITION_NAMES: readonly string[] = [
  "exact three server-side env gates true",
  "valid multipart request",
  "exactly one supported image",
  "one page only",
  "successful OCR extraction",
  "non-empty extracted text",
  "extracted text within maximum length",
  "quality status usable",
  "usableForSmartTalk true",
  "blocking reasons empty",
  "handoff envelope present",
  "handoff.allowed true",
  "handoff.performed false before reasoning",
  "sourceKind ocr_derived_text",
  "trustLevel untrusted_derived",
  "quality metadata present",
  "warning metadata present",
  "high-risk-token metadata present",
  "no raw image in model payload",
  "no original file in model payload",
  "no persistence authorization",
  "no DNA-write authorization",
  "controlled internal context only",
  "rate limit passed",
  "timeout budget available",
  "pre-model evidence gate accepts reasoning attempt",
];

const REQUIRED_BLOCKING_CONDITION_CODES: readonly string[] = [
  "reasoning_env_disabled",
  "handoff_env_disabled",
  "real_ocr_env_disabled",
  "invalid_content_type",
  "missing_image",
  "multiple_images",
  "unsupported_mime",
  "file_too_large",
  "multiple_pages",
  "ocr_provider_error",
  "ocr_timeout",
  "empty_extracted_text",
  "extracted_text_too_long",
  "missing_handoff_envelope",
  "handoff_not_allowed",
  "handoff_already_performed",
  "invalid_source_kind",
  "invalid_trust_level",
  "missing_quality_metadata",
  "quality_blocked",
  "quality_low",
  "unusable_for_smart_talk",
  "blocking_reasons_present",
  "missing_ocr_warnings",
  "missing_high_risk_metadata",
  "raw_image_in_model_payload_attempt",
  "original_file_in_model_payload_attempt",
  "persistence_attempt",
  "storage_attempt",
  "dna_write_attempt",
  "public_runtime_attempt",
  "production_authorization_attempt",
  "go_live_authorization_attempt",
  "evidence_gate_rejection",
  "rate_limit_rejection",
  "reasoning_timeout_budget_unavailable",
];

const REQUIRED_DOWNGRADE_CONDITION_CODES: readonly string[] = [
  "confidence_unavailable",
  "low_but_acceptable_confidence",
  "suspected_ocr_misread",
  "partial_crop",
  "rotated_image",
  "blurry_image",
  "noisy_background",
  "multiple_languages_detected",
  "unknown_language",
  "table_heavy_document",
  "tiny_print",
  "possible_missing_page",
  "high_risk_token_detected",
  "deadline_like_text_detected",
  "amount_like_text_detected",
  "payment_reference_detected",
  "case_number_detected",
  "authority_name_detected",
  "personal_name_detected",
  "address_detected",
  "health_or_insurance_number_detected",
  "immigration_reference_detected",
  "tax_id_detected",
];

const REQUIRED_FAILURE_CONTRACT_CODES: readonly string[] = [
  "ocr_controlled_reasoning_disabled",
  "handoff_required_for_reasoning",
  "real_ocr_required_for_reasoning",
  "invalid_ocr_reasoning_payload",
  "ocr_quality_not_usable_for_reasoning",
  "ocr_blocking_reasons_present",
  "ocr_trust_metadata_missing",
  "ocr_warning_metadata_missing",
  "ocr_high_risk_metadata_missing",
  "evidence_gate_rejected_ocr_reasoning",
  "ocr_reasoning_rate_limited",
  "ocr_reasoning_timeout",
  "ocr_reasoning_model_error",
  "ocr_reasoning_trap_rejected",
  "ocr_reasoning_internal_error",
];

const REQUIRED_RESPONSE_CONTRACT_FIELDS: readonly string[] = [
  "ok",
  "mode",
  "context",
  "ocrResult",
  "handoff",
  "reasoning",
  "reasoning.allowed",
  "reasoning.performed",
  "reasoning.reason",
  "reasoning.sourceKind",
  "reasoning.trustLevel",
  "reasoning.qualityStatus",
  "reasoning.highRiskTokensDetected",
  "reasoning.evidenceGateDecision",
  "reasoning.modelInvocation",
  "reasoning.modelOutputUntrusted",
  "reasoning.trapDecision",
  "smartTalkResult",
  "safety",
  "disclaimers",
  "warnings",
  "trace",
  "publicRuntimeStillBlocked",
  "productionAuthorizedNow",
  "goLiveAuthorizedNow",
];

const REQUIRED_DISABLED_REASONING_ENV_CASES: readonly string[] = [
  "absent",
  "false",
  "FALSE",
  "TRUE",
  "1",
  "yes",
  "whitespace true (\" true \")",
  "empty string (\"\")",
  "enabled",
];

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase is design-only.",
  "It does not implement the reasoning gate.",
  "It does not modify the route.",
  "It does not modify the UI.",
  "It does not create a runtime env flag.",
  "It does not call OCR.",
  "It does not execute the handoff branch.",
  "It does not call OpenAI or any model.",
  "It does not run Smart Talk reasoning.",
  "It does not run Evidence Gates against live OCR input.",
  "It does not run hallucination traps against model output.",
  "It does not run browser or mobile tests.",
  "It does not use a real document.",
  "It does not persist data.",
  "It relies on immutable committed source evidence.",
  "tesseract cache debt remains unresolved.",
  "rate-limit isolation debt remains unresolved.",
  "audit source-chain debt remains unresolved.",
  "public runtime remains blocked.",
  "production and go-live remain unauthorized.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "controlled reasoning implementation plan not created",
  "controlled reasoning runtime gate not implemented",
  "controlled reasoning env flag not wired",
  "controlled reasoning disabled closure not created",
  "controlled reasoning enabled synthetic closure not created",
  "live model call from OCR remains blocked",
  "pre-model Evidence Gate integration not implemented",
  "post-model hallucination-trap integration not implemented",
  "OCR quality evaluator runtime module not implemented",
  "tesseract.js controlled cache path not implemented",
  "tesseract.js systematic cleanup policy not implemented",
  ".gitignore policy review not completed",
  "cross-closure rate-limit isolation not systemically resolved",
  "transitive audit source-chain execution not consolidated",
  "browser manual OCR-to-Smart-Talk reasoning test not planned/performed",
  "mobile manual OCR-to-Smart-Talk test not planned/performed",
  "real document handling not validated",
  "multilingual architecture audit not started",
  "public runtime still blocked",
  "production/go-live still unauthorized",
];

// ─── Structured section types ───────────────────────────────────────────────

interface ControlledReasoningGateContract {
  gateName: "ocr_to_smart_talk_controlled_reasoning_gate";
  sourceKindRequired: "ocr_derived_text";
  sourceModeRequired: "photo_ocr_real_extraction_controlled_runtime";
  trustLevelRequired: "untrusted_derived";
  sensitivityLevelRequired: "sensitive_user_content";
  handoffEnvelopeRequired: true;
  handoffAllowedRequired: true;
  handoffPerformedMustStillBeFalseBeforeReasoning: true;
  smartTalkResultMustBeNullBeforeReasoning: true;
  extractedTextRequired: true;
  extractedTextMinimumLength: number;
  extractedTextMaximumLength: 6000;
  providerMetadataRequired: true;
  qualityStatusRequired: true;
  usableForSmartTalkRequired: true;
  blockingReasonsRequired: true;
  blockingReasonsMustBeEmpty: true;
  downgradeReasonsRequired: true;
  ocrWarningsRequired: true;
  highRiskTokensDetectedRequired: true;
  privacyDisclaimerRequired: true;
  legalDisclaimerRequired: true;
  checkOriginalDocumentRequired: true;
  exactLegalDeadlineStillBlocked: true;
  officialFilingStillBlocked: true;
  bindingLegalAdviceStillBlocked: true;
  paymentInstructionStillBlocked: true;
  authoritySubmissionStillBlocked: true;
  dnaWriteStillBlocked: true;
  persistenceStillBlocked: true;
  publicRuntimeStillBlocked: true;
  productionGoLiveStillBlocked: true;
}

interface FutureReasoningEnvironmentGateDesign {
  futureEnvFlag: "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED";
  exactEnvValueRequired: "true";
  disabledByDefault: true;
  handoffEnvAlsoRequired: true;
  realOcrEnvAlsoRequired: true;
  allThreeFlagsMustBeExactTrue: true;
  handoffFlagAloneInsufficient: true;
  realOcrFlagAloneInsufficient: true;
  reasoningFlagAloneInsufficient: true;
  placeholderFlagCannotAuthorizeReasoning: true;
  textDocumentFlagCannotAuthorizeReasoning: true;
  freeQaFlagCannotAuthorizeReasoning: true;
  clientCannotAuthorizeByRequestField: true;
  serverSideAuthorizationOnly: true;
  publicRuntimeCannotSetImplicitAuthorization: true;
  productionAuthorizationStillSeparate: true;
  goLiveAuthorizationStillSeparate: true;
}

interface AuthorizationCondition {
  condition: string;
  required: true;
  failureBehavior: "fail_closed";
  noModelCallOnFailure: true;
}

interface BlockingCondition {
  code: string;
  blockReasoning: true;
  blockModelCall: true;
  failClosed: true;
  noPersistence: true;
  publicRuntimeStillBlocked: true;
}

interface DowngradeCondition {
  code: string;
  preserveInModelContext: true;
  preserveInResponseWarnings: true;
  neverPromoteToVerifiedTruth: true;
  highRiskClaimsRemainBlocked: true;
}

interface FutureModelInputContract {
  inputKind: "controlled_ocr_reasoning_input";
  extractedTextOnly: true;
  rawImageIncluded: false;
  originalFileIncluded: false;
  sourceKindIncluded: true;
  sourceModeIncluded: true;
  trustLevelIncluded: true;
  sensitivityLevelIncluded: true;
  providerIncluded: true;
  confidenceMetadataIncluded: true;
  qualityStatusIncluded: true;
  usableForSmartTalkIncluded: true;
  blockingReasonsIncluded: true;
  downgradeReasonsIncluded: true;
  ocrWarningsIncluded: true;
  highRiskTokensDetectedIncluded: true;
  checkOriginalDocumentInstructionIncluded: true;
  legalDisclaimerInstructionIncluded: true;
  privacyInstructionIncluded: true;
  exactDeadlineProhibitionIncluded: true;
  filingProhibitionIncluded: true;
  bindingAdviceProhibitionIncluded: true;
  paymentInstructionProhibitionIncluded: true;
  verifiedFactProhibitionIncluded: true;
  dnaWriteProhibitionIncluded: true;
  modelMustTreatTextAsPossiblyWrong: true;
  modelMustNotCorrectOcrSilently: true;
  modelMustFlagUncertainReadings: true;
  modelMustAskUserToCheckOriginalWhereMaterial: true;
  modelOutputRemainsUntrusted: true;
  inputPersistedByDefault: false;
}

interface PreModelEvidenceGateDesign {
  runsBeforeModelCall: true;
  receivesOcrSourceMetadata: true;
  receivesTrustMetadata: true;
  receivesQualityMetadata: true;
  receivesBlockingReasons: true;
  receivesDowngradeReasons: true;
  receivesOcrWarnings: true;
  receivesHighRiskTokens: true;
  rejectsMissingMetadata: true;
  rejectsBlockedQuality: true;
  rejectsLowQuality: true;
  rejectsBlockingReasons: true;
  rejectsRawImagePayload: true;
  rejectsOriginalFilePayload: true;
  rejectsPersistenceAuthorization: true;
  rejectsDnaAuthorization: true;
  rejectsPublicRuntimeAuthorization: true;
  preservesUntrustedStatus: true;
  doesNotCreateVerifiedFacts: true;
  doesNotAuthorizeExactDeadline: true;
  doesNotAuthorizeFiling: true;
  doesNotAuthorizePaymentInstruction: true;
  evidenceDecisionTraceRequired: true;
}

interface PostModelHallucinationTrapDesign {
  runsAfterModelCall: true;
  receivesOriginalOcrTrustMetadata: true;
  receivesQualityMetadata: true;
  receivesHighRiskTokens: true;
  modelOutputTreatedAsUntrusted: true;
  blocksOverconfidentDocumentReading: true;
  blocksExactDeadlineClaim: true;
  blocksBindingLegalAdvice: true;
  blocksOfficialFilingGeneration: true;
  blocksPaymentInstruction: true;
  blocksAuthoritySubmissionInstruction: true;
  blocksVerifiedFactCreation: true;
  blocksDnaWrite: true;
  blocksUnsupportedNamesDatesAmountsAddresses: true;
  preservesOcrMayBeWrongWarning: true;
  preservesCheckOriginalWarning: true;
  preservesLegalDisclaimer: true;
  trapDecisionTraceRequired: true;
  failClosedOnTrapError: true;
}

interface FailureContractEntry {
  code: string;
  ok: false;
  noUnsafeFallback: true;
  noPersistence: true;
  noDnaWrite: true;
  publicRuntimeStillBlocked: true;
}

interface FutureReasoningResponseContract {
  requiredFields: readonly string[];
  successfulReasoningMustReport: readonly string[];
}

interface FutureRuntimeIntegrationPlanBoundary {
  futurePrimaryFile: "app/api/smart-talk/route.ts";
  futureOptionalPureGateModule: "lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts";
  futureOptionalModelInputBuilder: "lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts";
  futureRuntimeImplementationNotPerformedNow: true;
  futureModelCallNotImplementedNow: true;
  futureUiModificationNotPerformedNow: true;
  futureGateShouldBePureWherePossible: true;
  futureInputBuilderShouldBePure: true;
  futureGateMustNotPersist: true;
  futureInputBuilderMustNotReadImageBytes: true;
  futureModelAdapterMustReceiveTextOnly: true;
  futureRoutePatchMustRemainMinimal: true;
}

interface FutureDisabledReasoningClosureDesign {
  futurePhase: string;
  reasoningEnvDisabledCases: readonly string[];
  exactLowercaseTrueReservedForEnabledClosure: true;
  handoffAndRealOcrFlagsMayBeExactTrueForIsolation: true;
  everyDisabledReasoningCaseMustFailBeforeModel: true;
  expectedCode: "ocr_controlled_reasoning_disabled";
  modelCallMustRemainFalse: true;
  smartTalkReasoningMustRemainFalse: true;
  persistenceMustRemainFalse: true;
  publicRuntimeStillBlocked: true;
}

interface FutureEnabledSyntheticReasoningClosureDesign {
  futurePhase: string;
  exactReasoningEnvTrueRequired: true;
  exactHandoffEnvTrueRequired: true;
  exactRealOcrEnvTrueRequired: true;
  syntheticImageOnly: true;
  noRealDocument: true;
  inProcessRouteInvocationOnly: true;
  oneControlledModelCallMaximum: true;
  rawImageMustNotReachModel: true;
  originalFileMustNotReachModel: true;
  extractedTextAndMetadataOnly: true;
  evidenceGateMustRunBeforeModel: true;
  hallucinationTrapMustRunAfterModel: true;
  modelOutputMustRemainUntrusted: true;
  exactDeadlineStillBlocked: true;
  filingStillBlocked: true;
  bindingAdviceStillBlocked: true;
  paymentInstructionStillBlocked: true;
  noPersistence: true;
  publicRuntimeStillBlocked: true;
}

interface TesseractCacheDebtSection {
  debtObservedPreviously: true;
  artifactName: "eng.traineddata";
  artifactLocationObservedPreviously: "repo root";
  artifactCreatedDuring8_11L: false;
  artifactPresentAfter8_11L: boolean;
  controlledCachePathStillNeeded: true;
  cleanupPolicyStillNeeded: true;
  gitignorePolicyReviewStillNeeded: true;
  blockerBeforeBrowserOrMobileTesting: true;
  blockerBeforePublicBeta: true;
  blockerBefore8_11M: false;
}

interface RateLimitDebtSection {
  moduleLevelInMemoryLimiterObserved: true;
  crossClosureFlakinessObservedPreviously: true;
  deterministicTestIsolationStillNeeded: true;
  uniqueSyntheticIpStrategyStillRequired: true;
  blockerBeforePublicBeta: true;
  blockerBefore8_11M: false;
}

interface AuditExecutionDebtSection {
  transitiveOcrSourceExecutionObservedPreviously: true;
  immutableCommittedSnapshotsUsedFor8_11L: true;
  realOcrExecutionsPerformedBy8_11L: 0;
  modelCallsPerformedBy8_11L: 0;
  sourceSnapshotConsolidationStillNeeded: true;
  blockerBefore8_11M: false;
}

// ─── Top-level result type ──────────────────────────────────────────────────

interface OcrToSmartTalkControlledReasoningGateDesignResult {
  checkId: "8.11L";
  allPassed: boolean;
  controlledReasoningGateDesignOnly: true;
  ocrToSmartTalkControlledReasoningGateDesignOnly: true;
  controlledReasoningGateDesigned: boolean;
  controlledReasoningGateDesignClosed: boolean;
  controlledReasoningImplementedNow: false;
  smartTalkReasoningPerformed: false;
  modelCallPerformed: false;
  ocrPerformedByDesign: false;
  handoffEnvelopeExecutedByDesign: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  adapterModifiedNow: false;
  packageModifiedNow: false;
  configModifiedNow: false;
  envModifiedNow: false;
  runtimeModuleCreatedNow: false;
  browserInvokedByDesign: false;
  devServerStartedByDesign: false;
  externalNetworkCalledByDesign: false;
  externalFetchCalledByDesign: false;
  openAiCalled: false;
  realImageUsedByDesign: false;
  realDocumentUsed: false;
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

  sourceEnabledHandoffClosureCommit: "f4e5e50";
  sourceDisabledHandoffClosureCommit: "499ab72";
  sourceMinimalHandoffRuntimePatchCommit: "e3be09b";
  sourceHandoffPlanCommit: "b839538";
  sourceTrustBoundaryClosureCommit: "831779a";
  sourceQualityEvaluatorClosureCommit: "2ef041f";
  sourceEnabledRealOcrClosureCommit: "ec5a76f";
  sourceDisabledRealOcrClosureCommit: "3688358";
  sourceMinimalRealOcrRuntimePatchCommit: "46ddefc";
  sourceTextDocumentSnapshotPatchCommit: "cf6624c";
  sourceTechnicalDebtInventoryCommit: "bdf3859";

  sourceEnabledHandoffClosureAccepted: boolean;
  sourceDisabledHandoffClosureAccepted: boolean;
  sourceMinimalHandoffRuntimePatchAccepted: boolean;
  sourceHandoffPlanAccepted: boolean;
  sourceTrustBoundaryClosureAccepted: boolean;
  sourceQualityEvaluatorClosureAccepted: boolean;
  sourceEnabledRealOcrClosureAccepted: boolean;
  sourceDisabledRealOcrClosureAccepted: boolean;
  sourceMinimalRealOcrRuntimePatchAccepted: boolean;
  sourceTextDocumentSnapshotPatchAccepted: boolean;
  sourceTechnicalDebtInventoryAccepted: boolean;

  observedEnabledHandoffStatus: 200;
  observedEnabledHandoffOk: true;
  observedRealOcrPerformed: true;
  observedQualityStatus: "usable";
  observedUsableForSmartTalk: true;
  observedHandoffAllowed: true;
  observedHandoffPerformed: false;
  observedSmartTalkResultIsNull: true;
  observedModelCallPerformed: false;
  observedSmartTalkReasoningPerformed: false;
  observedTrustLevel: "untrusted_derived";
  observedSourceKind: "ocr_derived_text";
  observedPublicRuntimeStillBlocked: true;
  observedProductionAuthorizedNow: false;
  observedGoLiveAuthorizedNow: false;

  reasoningGateContractDefined: true;
  reasoningAuthorizationConditionsDefined: true;
  reasoningBlockingConditionsDefined: true;
  reasoningDowngradeConditionsDefined: true;
  modelInputContractDefined: true;
  preModelEvidenceGateContractDefined: true;
  postModelTrapContractDefined: true;
  reasoningResponseContractDefined: true;
  failureContractDefined: true;
  environmentGateDesignDefined: true;
  disabledClosureDesignDefined: true;
  enabledSyntheticClosureDesignDefined: true;
  noPersistenceContractDefined: true;
  highRiskClaimPolicyDefined: true;
  modelOutputRemainsUntrusted: true;
  readyForControlledReasoningImplementationPlan: boolean;
  readyForControlledReasoningRuntimePatch: false;
  readyForSmartTalkReasoningFromOcr: false;
  readyForBrowserManualHandoffTest: false;
  readyForMobileManualRealOcrTest: false;
  readyForPhotoOcrPublicRuntime: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.11M";
  recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Implementation Plan";

  controlledReasoningGateContract: ControlledReasoningGateContract;
  futureReasoningEnvironmentGateDesign: FutureReasoningEnvironmentGateDesign;
  reasoningAuthorizationConditions: readonly AuthorizationCondition[];
  reasoningBlockingConditions: readonly BlockingCondition[];
  reasoningDowngradeConditions: readonly DowngradeCondition[];
  futureModelInputContract: FutureModelInputContract;
  preModelEvidenceGateDesign: PreModelEvidenceGateDesign;
  postModelHallucinationTrapDesign: PostModelHallucinationTrapDesign;
  futureReasoningResponseContract: FutureReasoningResponseContract;
  futureFailureContract: readonly FailureContractEntry[];
  futureRuntimeIntegrationPlanBoundary: FutureRuntimeIntegrationPlanBoundary;
  futureDisabledReasoningClosureDesign: FutureDisabledReasoningClosureDesign;
  futureEnabledSyntheticReasoningClosureDesign: FutureEnabledSyntheticReasoningClosureDesign;
  tesseractCacheDebt: TesseractCacheDebtSection;
  rateLimitDebt: RateLimitDebtSection;
  auditExecutionDebt: AuditExecutionDebtSection;

  recommendedPhaseSequence: readonly string[];
  runtimePatchPhaseInsertionRecommended: true;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  observedHandoffBaselineEvidence: string[];
  reasoningGateDesignEvidence: string[];
  reasoningAuthorizationEvidence: string[];
  reasoningBlockingEvidence: string[];
  reasoningDowngradeEvidence: string[];
  modelInputContractEvidence: string[];
  preModelEvidenceGateEvidence: string[];
  postModelTrapEvidence: string[];
  reasoningResponseContractEvidence: string[];
  failureContractEvidence: string[];
  environmentGateEvidence: string[];
  futureRuntimeBoundaryEvidence: string[];
  disabledClosureDesignEvidence: string[];
  enabledSyntheticClosureDesignEvidence: string[];
  highRiskBoundaryEvidence: string[];
  noPersistenceEvidence: string[];
  tesseractCacheDebtEvidence: string[];
  rateLimitDebtEvidence: string[];
  auditExecutionDebtEvidence: string[];
  safetyBoundaryEvidence: string[];
  forbiddenRuntimeEvidence: string[];
  readinessVerdict: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalOcrToSmartTalkControlledReasoningGateDesignResult(
  r: OcrToSmartTalkControlledReasoningGateDesignResult,
): boolean {
  if (r.checkId !== "8.11L") return false;
  if (r.allPassed !== true) return false;
  if (r.controlledReasoningGateDesignOnly !== true) return false;
  if (r.ocrToSmartTalkControlledReasoningGateDesignOnly !== true) return false;
  if (r.controlledReasoningGateDesigned !== true) return false;
  if (r.controlledReasoningGateDesignClosed !== true) return false;
  if (r.controlledReasoningImplementedNow !== false) return false;
  if (r.smartTalkReasoningPerformed !== false) return false;
  if (r.modelCallPerformed !== false) return false;
  if (r.ocrPerformedByDesign !== false) return false;
  if (r.handoffEnvelopeExecutedByDesign !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.adapterModifiedNow !== false) return false;
  if (r.packageModifiedNow !== false) return false;
  if (r.configModifiedNow !== false) return false;
  if (r.envModifiedNow !== false) return false;
  if (r.runtimeModuleCreatedNow !== false) return false;
  if (r.browserInvokedByDesign !== false) return false;
  if (r.devServerStartedByDesign !== false) return false;
  if (r.externalNetworkCalledByDesign !== false) return false;
  if (r.externalFetchCalledByDesign !== false) return false;
  if (r.openAiCalled !== false) return false;
  if (r.realImageUsedByDesign !== false) return false;
  if (r.realDocumentUsed !== false) return false;
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

  if (
    !r.sourceEnabledHandoffClosureAccepted ||
    !r.sourceDisabledHandoffClosureAccepted ||
    !r.sourceMinimalHandoffRuntimePatchAccepted ||
    !r.sourceHandoffPlanAccepted ||
    !r.sourceTrustBoundaryClosureAccepted ||
    !r.sourceQualityEvaluatorClosureAccepted ||
    !r.sourceEnabledRealOcrClosureAccepted ||
    !r.sourceDisabledRealOcrClosureAccepted ||
    !r.sourceMinimalRealOcrRuntimePatchAccepted ||
    !r.sourceTextDocumentSnapshotPatchAccepted ||
    !r.sourceTechnicalDebtInventoryAccepted
  )
    return false;

  if (r.observedEnabledHandoffStatus !== 200) return false;
  if (r.observedEnabledHandoffOk !== true) return false;
  if (r.observedRealOcrPerformed !== true) return false;
  if (r.observedQualityStatus !== "usable") return false;
  if (r.observedUsableForSmartTalk !== true) return false;
  if (r.observedHandoffAllowed !== true) return false;
  if (r.observedHandoffPerformed !== false) return false;
  if (r.observedSmartTalkResultIsNull !== true) return false;
  if (r.observedModelCallPerformed !== false) return false;
  if (r.observedSmartTalkReasoningPerformed !== false) return false;
  if (r.observedTrustLevel !== "untrusted_derived") return false;
  if (r.observedSourceKind !== "ocr_derived_text") return false;
  if (r.observedPublicRuntimeStillBlocked !== true) return false;
  if (r.observedProductionAuthorizedNow !== false) return false;
  if (r.observedGoLiveAuthorizedNow !== false) return false;

  if (
    !r.reasoningGateContractDefined ||
    !r.reasoningAuthorizationConditionsDefined ||
    !r.reasoningBlockingConditionsDefined ||
    !r.reasoningDowngradeConditionsDefined ||
    !r.modelInputContractDefined ||
    !r.preModelEvidenceGateContractDefined ||
    !r.postModelTrapContractDefined ||
    !r.reasoningResponseContractDefined ||
    !r.failureContractDefined ||
    !r.environmentGateDesignDefined ||
    !r.disabledClosureDesignDefined ||
    !r.enabledSyntheticClosureDesignDefined ||
    !r.noPersistenceContractDefined ||
    !r.highRiskClaimPolicyDefined ||
    !r.modelOutputRemainsUntrusted
  )
    return false;

  if (r.readyForControlledReasoningImplementationPlan !== true) return false;
  if (r.readyForControlledReasoningRuntimePatch !== false) return false;
  if (r.readyForSmartTalkReasoningFromOcr !== false) return false;
  if (r.readyForBrowserManualHandoffTest !== false) return false;
  if (r.readyForMobileManualRealOcrTest !== false) return false;
  if (r.readyForPhotoOcrPublicRuntime !== false) return false;
  if (r.readyForProduction !== false) return false;
  if (r.readyForGoLive !== false) return false;
  if (r.readyForNextPhase !== "8.11M") return false;
  if (r.recommendedNextPhase !== "OCR-to-Smart-Talk Controlled Reasoning Implementation Plan") return false;

  const c = r.controlledReasoningGateContract;
  if (
    c.gateName !== "ocr_to_smart_talk_controlled_reasoning_gate" ||
    c.sourceKindRequired !== "ocr_derived_text" ||
    c.trustLevelRequired !== "untrusted_derived" ||
    c.handoffAllowedRequired !== true ||
    c.handoffPerformedMustStillBeFalseBeforeReasoning !== true ||
    c.smartTalkResultMustBeNullBeforeReasoning !== true ||
    c.usableForSmartTalkRequired !== true ||
    c.blockingReasonsMustBeEmpty !== true ||
    c.ocrWarningsRequired !== true ||
    c.highRiskTokensDetectedRequired !== true ||
    c.extractedTextMaximumLength !== 6000 ||
    c.extractedTextMinimumLength <= 0 ||
    c.exactLegalDeadlineStillBlocked !== true ||
    c.bindingLegalAdviceStillBlocked !== true ||
    c.paymentInstructionStillBlocked !== true ||
    c.authoritySubmissionStillBlocked !== true ||
    c.dnaWriteStillBlocked !== true ||
    c.persistenceStillBlocked !== true ||
    c.publicRuntimeStillBlocked !== true ||
    c.productionGoLiveStillBlocked !== true
  )
    return false;

  const g = r.futureReasoningEnvironmentGateDesign;
  if (
    g.futureEnvFlag !== "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED" ||
    g.exactEnvValueRequired !== "true" ||
    g.disabledByDefault !== true ||
    g.handoffEnvAlsoRequired !== true ||
    g.realOcrEnvAlsoRequired !== true ||
    g.allThreeFlagsMustBeExactTrue !== true ||
    g.handoffFlagAloneInsufficient !== true ||
    g.realOcrFlagAloneInsufficient !== true ||
    g.reasoningFlagAloneInsufficient !== true ||
    g.placeholderFlagCannotAuthorizeReasoning !== true ||
    g.clientCannotAuthorizeByRequestField !== true ||
    g.serverSideAuthorizationOnly !== true
  )
    return false;

  if (r.reasoningAuthorizationConditions.length !== REQUIRED_AUTHORIZATION_CONDITION_NAMES.length) return false;
  for (const name of REQUIRED_AUTHORIZATION_CONDITION_NAMES) {
    if (!r.reasoningAuthorizationConditions.some((cond) => cond.condition === name && cond.required === true)) {
      return false;
    }
  }

  if (r.reasoningBlockingConditions.length !== REQUIRED_BLOCKING_CONDITION_CODES.length) return false;
  for (const code of REQUIRED_BLOCKING_CONDITION_CODES) {
    if (!r.reasoningBlockingConditions.some((bc) => bc.code === code && bc.blockModelCall === true)) return false;
  }

  if (r.reasoningDowngradeConditions.length !== REQUIRED_DOWNGRADE_CONDITION_CODES.length) return false;
  for (const code of REQUIRED_DOWNGRADE_CONDITION_CODES) {
    if (
      !r.reasoningDowngradeConditions.some(
        (dc) => dc.code === code && dc.neverPromoteToVerifiedTruth === true && dc.highRiskClaimsRemainBlocked === true,
      )
    )
      return false;
  }

  const mi = r.futureModelInputContract;
  if (
    mi.extractedTextOnly !== true ||
    mi.rawImageIncluded !== false ||
    mi.originalFileIncluded !== false ||
    mi.modelMustTreatTextAsPossiblyWrong !== true ||
    mi.modelMustNotCorrectOcrSilently !== true ||
    mi.modelOutputRemainsUntrusted !== true ||
    mi.exactDeadlineProhibitionIncluded !== true ||
    mi.filingProhibitionIncluded !== true ||
    mi.bindingAdviceProhibitionIncluded !== true ||
    mi.paymentInstructionProhibitionIncluded !== true ||
    mi.verifiedFactProhibitionIncluded !== true ||
    mi.dnaWriteProhibitionIncluded !== true ||
    mi.inputPersistedByDefault !== false
  )
    return false;

  const pre = r.preModelEvidenceGateDesign;
  if (
    pre.runsBeforeModelCall !== true ||
    pre.rejectsMissingMetadata !== true ||
    pre.rejectsBlockedQuality !== true ||
    pre.rejectsRawImagePayload !== true ||
    pre.rejectsOriginalFilePayload !== true ||
    pre.rejectsPersistenceAuthorization !== true ||
    pre.rejectsDnaAuthorization !== true ||
    pre.rejectsPublicRuntimeAuthorization !== true ||
    pre.doesNotAuthorizeExactDeadline !== true ||
    pre.doesNotAuthorizeFiling !== true ||
    pre.doesNotAuthorizePaymentInstruction !== true ||
    pre.evidenceDecisionTraceRequired !== true
  )
    return false;

  const trap = r.postModelHallucinationTrapDesign;
  if (
    trap.runsAfterModelCall !== true ||
    trap.modelOutputTreatedAsUntrusted !== true ||
    trap.blocksExactDeadlineClaim !== true ||
    trap.blocksBindingLegalAdvice !== true ||
    trap.blocksOfficialFilingGeneration !== true ||
    trap.blocksPaymentInstruction !== true ||
    trap.blocksAuthoritySubmissionInstruction !== true ||
    trap.blocksVerifiedFactCreation !== true ||
    trap.blocksDnaWrite !== true ||
    trap.preservesOcrMayBeWrongWarning !== true ||
    trap.preservesCheckOriginalWarning !== true ||
    trap.preservesLegalDisclaimer !== true ||
    trap.trapDecisionTraceRequired !== true ||
    trap.failClosedOnTrapError !== true
  )
    return false;

  if (r.futureReasoningResponseContract.requiredFields.length !== REQUIRED_RESPONSE_CONTRACT_FIELDS.length)
    return false;
  for (const f of REQUIRED_RESPONSE_CONTRACT_FIELDS) {
    if (!r.futureReasoningResponseContract.requiredFields.includes(f)) return false;
  }

  if (r.futureFailureContract.length !== REQUIRED_FAILURE_CONTRACT_CODES.length) return false;
  for (const code of REQUIRED_FAILURE_CONTRACT_CODES) {
    if (
      !r.futureFailureContract.some(
        (fc) =>
          fc.code === code &&
          fc.ok === false &&
          fc.noUnsafeFallback === true &&
          fc.noPersistence === true &&
          fc.noDnaWrite === true,
      )
    )
      return false;
  }

  const rt = r.futureRuntimeIntegrationPlanBoundary;
  if (
    rt.futurePrimaryFile !== "app/api/smart-talk/route.ts" ||
    rt.futureRuntimeImplementationNotPerformedNow !== true ||
    rt.futureModelCallNotImplementedNow !== true ||
    rt.futureUiModificationNotPerformedNow !== true ||
    rt.futureGateMustNotPersist !== true ||
    rt.futureInputBuilderMustNotReadImageBytes !== true
  )
    return false;

  const dd = r.futureDisabledReasoningClosureDesign;
  if (dd.reasoningEnvDisabledCases.length !== REQUIRED_DISABLED_REASONING_ENV_CASES.length) return false;
  for (const c2 of REQUIRED_DISABLED_REASONING_ENV_CASES) {
    if (!dd.reasoningEnvDisabledCases.includes(c2)) return false;
  }
  if (
    dd.exactLowercaseTrueReservedForEnabledClosure !== true ||
    dd.everyDisabledReasoningCaseMustFailBeforeModel !== true ||
    dd.expectedCode !== "ocr_controlled_reasoning_disabled" ||
    dd.modelCallMustRemainFalse !== true ||
    dd.smartTalkReasoningMustRemainFalse !== true ||
    dd.persistenceMustRemainFalse !== true ||
    dd.publicRuntimeStillBlocked !== true
  )
    return false;

  const ed = r.futureEnabledSyntheticReasoningClosureDesign;
  if (
    ed.exactReasoningEnvTrueRequired !== true ||
    ed.exactHandoffEnvTrueRequired !== true ||
    ed.exactRealOcrEnvTrueRequired !== true ||
    ed.syntheticImageOnly !== true ||
    ed.rawImageMustNotReachModel !== true ||
    ed.originalFileMustNotReachModel !== true ||
    ed.evidenceGateMustRunBeforeModel !== true ||
    ed.hallucinationTrapMustRunAfterModel !== true ||
    ed.modelOutputMustRemainUntrusted !== true ||
    ed.exactDeadlineStillBlocked !== true ||
    ed.filingStillBlocked !== true ||
    ed.bindingAdviceStillBlocked !== true ||
    ed.paymentInstructionStillBlocked !== true ||
    ed.noPersistence !== true ||
    ed.publicRuntimeStillBlocked !== true
  )
    return false;

  const tcd = r.tesseractCacheDebt;
  if (
    tcd.artifactName !== "eng.traineddata" ||
    tcd.artifactCreatedDuring8_11L !== false ||
    tcd.artifactPresentAfter8_11L !== false ||
    tcd.controlledCachePathStillNeeded !== true ||
    tcd.cleanupPolicyStillNeeded !== true ||
    tcd.gitignorePolicyReviewStillNeeded !== true ||
    tcd.blockerBefore8_11M !== false
  )
    return false;

  const rld = r.rateLimitDebt;
  if (
    rld.moduleLevelInMemoryLimiterObserved !== true ||
    rld.deterministicTestIsolationStillNeeded !== true ||
    rld.blockerBefore8_11M !== false
  )
    return false;

  const aed = r.auditExecutionDebt;
  if (
    aed.immutableCommittedSnapshotsUsedFor8_11L !== true ||
    aed.realOcrExecutionsPerformedBy8_11L !== 0 ||
    aed.modelCallsPerformedBy8_11L !== 0 ||
    aed.sourceSnapshotConsolidationStillNeeded !== true ||
    aed.blockerBefore8_11M !== false
  )
    return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  const requiredNonEmptyArrays: (keyof OcrToSmartTalkControlledReasoningGateDesignResult)[] = [
    "sourceEvidence",
    "observedHandoffBaselineEvidence",
    "reasoningGateDesignEvidence",
    "reasoningAuthorizationEvidence",
    "reasoningBlockingEvidence",
    "reasoningDowngradeEvidence",
    "modelInputContractEvidence",
    "preModelEvidenceGateEvidence",
    "postModelTrapEvidence",
    "reasoningResponseContractEvidence",
    "failureContractEvidence",
    "environmentGateEvidence",
    "futureRuntimeBoundaryEvidence",
    "disabledClosureDesignEvidence",
    "enabledSyntheticClosureDesignEvidence",
    "highRiskBoundaryEvidence",
    "noPersistenceEvidence",
    "tesseractCacheDebtEvidence",
    "rateLimitDebtEvidence",
    "auditExecutionDebtEvidence",
    "safetyBoundaryEvidence",
    "forbiddenRuntimeEvidence",
    "readinessVerdict",
    "nextRecommendedSteps",
    "notes",
  ];
  for (const key of requiredNonEmptyArrays) {
    const v = r[key];
    if (!Array.isArray(v) || v.length === 0) return false;
  }

  if (r.evidenceLimitations.length !== REQUIRED_EVIDENCE_LIMITATIONS.length) return false;
  for (const item of REQUIRED_EVIDENCE_LIMITATIONS) {
    if (!r.evidenceLimitations.includes(item)) return false;
  }
  if (r.remainingBlockers.length !== REQUIRED_REMAINING_BLOCKERS.length) return false;
  for (const item of REQUIRED_REMAINING_BLOCKERS) {
    if (!r.remainingBlockers.includes(item)) return false;
  }

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (
  r: OcrToSmartTalkControlledReasoningGateDesignResult,
) => OcrToSmartTalkControlledReasoningGateDesignResult;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

const OCR_TO_SMART_TALK_CONTROLLED_REASONING_GATE_DESIGN_TAMPER_CASES: readonly TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11K" as "8.11L" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },

  { label: "source 8.11K not accepted", mutate: (r) => ({ ...r, sourceEnabledHandoffClosureAccepted: false }) },
  { label: "source 8.11J not accepted", mutate: (r) => ({ ...r, sourceDisabledHandoffClosureAccepted: false }) },
  { label: "source 8.11I not accepted", mutate: (r) => ({ ...r, sourceMinimalHandoffRuntimePatchAccepted: false }) },
  { label: "source 8.11H not accepted", mutate: (r) => ({ ...r, sourceHandoffPlanAccepted: false }) },
  { label: "source 8.11G not accepted", mutate: (r) => ({ ...r, sourceTrustBoundaryClosureAccepted: false }) },
  { label: "source 8.11F not accepted", mutate: (r) => ({ ...r, sourceQualityEvaluatorClosureAccepted: false }) },

  {
    label: "observed handoff baseline missing",
    mutate: (r) => ({ ...r, observedHandoffAllowed: false as true }),
  },
  {
    label: "reasoning gate contract missing",
    mutate: (r) => ({ ...r, reasoningGateContractDefined: false as true }),
  },
  {
    label: "reasoning env gate missing",
    mutate: (r) => ({ ...r, environmentGateDesignDefined: false as true }),
  },
  {
    label: "exact lowercase true not required",
    mutate: (r) => ({
      ...r,
      futureReasoningEnvironmentGateDesign: { ...r.futureReasoningEnvironmentGateDesign, exactEnvValueRequired: "TRUE" as "true" },
    }),
  },
  {
    label: "all three gates not required",
    mutate: (r) => ({
      ...r,
      futureReasoningEnvironmentGateDesign: { ...r.futureReasoningEnvironmentGateDesign, allThreeFlagsMustBeExactTrue: false as true },
    }),
  },
  {
    label: "client request can authorize reasoning",
    mutate: (r) => ({
      ...r,
      futureReasoningEnvironmentGateDesign: { ...r.futureReasoningEnvironmentGateDesign, clientCannotAuthorizeByRequestField: false as true },
    }),
  },
  {
    label: "placeholder flag can authorize reasoning",
    mutate: (r) => ({
      ...r,
      futureReasoningEnvironmentGateDesign: { ...r.futureReasoningEnvironmentGateDesign, placeholderFlagCannotAuthorizeReasoning: false as true },
    }),
  },
  {
    label: "authorization conditions incomplete",
    mutate: (r) => ({ ...r, reasoningAuthorizationConditions: r.reasoningAuthorizationConditions.slice(1) }),
  },
  {
    label: "blocking conditions incomplete",
    mutate: (r) => ({ ...r, reasoningBlockingConditions: r.reasoningBlockingConditions.slice(1) }),
  },
  {
    label: "downgrade conditions incomplete",
    mutate: (r) => ({ ...r, reasoningDowngradeConditions: r.reasoningDowngradeConditions.slice(1) }),
  },
  {
    label: "quality usable not required",
    mutate: (r) => ({
      ...r,
      controlledReasoningGateContract: { ...r.controlledReasoningGateContract, usableForSmartTalkRequired: false as true },
    }),
  },
  {
    label: "blocking reasons need not be empty",
    mutate: (r) => ({
      ...r,
      controlledReasoningGateContract: { ...r.controlledReasoningGateContract, blockingReasonsMustBeEmpty: false as true },
    }),
  },
  {
    label: "trust metadata not required",
    mutate: (r) => ({
      ...r,
      controlledReasoningGateContract: { ...r.controlledReasoningGateContract, trustLevelRequired: "trusted" as "untrusted_derived" },
    }),
  },
  {
    label: "OCR warnings not required",
    mutate: (r) => ({
      ...r,
      controlledReasoningGateContract: { ...r.controlledReasoningGateContract, ocrWarningsRequired: false as true },
    }),
  },
  {
    label: "high-risk metadata not required",
    mutate: (r) => ({
      ...r,
      controlledReasoningGateContract: { ...r.controlledReasoningGateContract, highRiskTokensDetectedRequired: false as true },
    }),
  },
  {
    label: "raw image allowed in model input",
    mutate: (r) => ({ ...r, futureModelInputContract: { ...r.futureModelInputContract, rawImageIncluded: true as false } }),
  },
  {
    label: "original file allowed in model input",
    mutate: (r) => ({ ...r, futureModelInputContract: { ...r.futureModelInputContract, originalFileIncluded: true as false } }),
  },
  {
    label: "model input lacks untrusted-source instructions",
    mutate: (r) => ({ ...r, futureModelInputContract: { ...r.futureModelInputContract, modelMustTreatTextAsPossiblyWrong: false as true } }),
  },
  {
    label: "model may silently correct OCR",
    mutate: (r) => ({ ...r, futureModelInputContract: { ...r.futureModelInputContract, modelMustNotCorrectOcrSilently: false as true } }),
  },
  {
    label: "Evidence Gate not required before model",
    mutate: (r) => ({ ...r, preModelEvidenceGateDesign: { ...r.preModelEvidenceGateDesign, runsBeforeModelCall: false as true } }),
  },
  {
    label: "trap not required after model",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, runsAfterModelCall: false as true } }),
  },
  {
    label: "model output treated as trusted",
    mutate: (r) => ({
      ...r,
      futureModelInputContract: { ...r.futureModelInputContract, modelOutputRemainsUntrusted: false as true },
      postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, modelOutputTreatedAsUntrusted: false as true },
    }),
  },
  {
    label: "exact legal deadline allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksExactDeadlineClaim: false as true } }),
  },
  {
    label: "binding advice allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksBindingLegalAdvice: false as true } }),
  },
  {
    label: "official filing allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksOfficialFilingGeneration: false as true } }),
  },
  {
    label: "payment instruction allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksPaymentInstruction: false as true } }),
  },
  {
    label: "authority submission allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksAuthoritySubmissionInstruction: false as true } }),
  },
  {
    label: "verified facts allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksVerifiedFactCreation: false as true } }),
  },
  {
    label: "DNA write allowed",
    mutate: (r) => ({ ...r, postModelHallucinationTrapDesign: { ...r.postModelHallucinationTrapDesign, blocksDnaWrite: false as true } }),
  },
  {
    label: "persistence allowed",
    mutate: (r) => ({ ...r, preModelEvidenceGateDesign: { ...r.preModelEvidenceGateDesign, rejectsPersistenceAuthorization: false as true } }),
  },
  {
    label: "unsafe fallback allowed",
    mutate: (r) => ({
      ...r,
      futureFailureContract: r.futureFailureContract.map((fc, i) => (i === 0 ? { ...fc, noUnsafeFallback: false as true } : fc)),
    }),
  },
  { label: "reasoning implemented in this phase", mutate: (r) => ({ ...r, controlledReasoningImplementedNow: true as false }) },
  { label: "model call performed in this phase", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "route modified", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "UI modified", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "adapter modified", mutate: (r) => ({ ...r, adapterModifiedNow: true as false }) },
  { label: "package/config/env modified", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "OCR executed", mutate: (r) => ({ ...r, ocrPerformedByDesign: true as false }) },
  { label: "handoff branch executed", mutate: (r) => ({ ...r, handoffEnvelopeExecutedByDesign: true as false }) },
  { label: "public runtime enabled", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "production/go-live authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  {
    label: "technical debts omitted",
    mutate: (r) => ({ ...r, tesseractCacheDebtEvidence: [] }),
  },
  { label: "readyForImplementationPlan false", mutate: (r) => ({ ...r, readyForControlledReasoningImplementationPlan: false }) },
  { label: "readyForRuntimePatch true too early", mutate: (r) => ({ ...r, readyForControlledReasoningRuntimePatch: true as false }) },
  { label: "readyForSmartTalkReasoningFromOcr true too early", mutate: (r) => ({ ...r, readyForSmartTalkReasoningFromOcr: true as false }) },
  { label: "next phase not 8.11M", mutate: (r) => ({ ...r, readyForNextPhase: "8.11N" as "8.11M" }) },
  { label: "8.3AC marked run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported design runner ─────────────────────────────────────────────────

export async function runOcrToSmartTalkControlledReasoningGateDesign(): Promise<OcrToSmartTalkControlledReasoningGateDesignResult> {
  const failures: string[] = [];

  // ── Source acceptance: immutable committed snapshot (fully disclosed) ────
  // None of the six primary source functions are invoked live — see
  // docblock SOURCE STRATEGY. Each is confirmed present on disk and
  // confirmed via a cheap static text read to contain its own checkId
  // literal and exported function name.
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
  const sourceHandoffPlanAccepted = verifySourceMarker(
    SOURCE_FILES.handoffPlan.relPath,
    SOURCE_FILES.handoffPlan.checkIdMarker,
    SOURCE_FILES.handoffPlan.exportMarker,
  );
  const sourceTrustBoundaryClosureAccepted = verifySourceMarker(
    SOURCE_FILES.trustBoundaryClosure.relPath,
    SOURCE_FILES.trustBoundaryClosure.checkIdMarker,
    SOURCE_FILES.trustBoundaryClosure.exportMarker,
  );
  const sourceQualityEvaluatorClosureAccepted = verifySourceMarker(
    SOURCE_FILES.qualityEvaluatorClosure.relPath,
    SOURCE_FILES.qualityEvaluatorClosure.checkIdMarker,
    SOURCE_FILES.qualityEvaluatorClosure.exportMarker,
  );

  if (!sourceEnabledHandoffClosureAccepted) failures.push("8.11K immutable snapshot check failed");
  if (!sourceDisabledHandoffClosureAccepted) failures.push("8.11J immutable snapshot check failed");
  if (!sourceMinimalHandoffRuntimePatchAccepted) failures.push("8.11I immutable snapshot check failed");
  if (!sourceHandoffPlanAccepted) failures.push("8.11H immutable snapshot check failed");
  if (!sourceTrustBoundaryClosureAccepted) failures.push("8.11G immutable snapshot check failed");
  if (!sourceQualityEvaluatorClosureAccepted) failures.push("8.11F immutable snapshot check failed");

  // Ancestor phases 8.11E/D/C, 8.9N-PATCH, and the technical debt inventory
  // are accepted transitively through 8.11F/8.11G's own already-established
  // nested source evidence (observed allPassed:true when 8.11F/8.11G/8.11H/
  // 8.11I/8.11J/8.11K were each originally closed) — not re-read here.
  const sourceEnabledRealOcrClosureAccepted = sourceQualityEvaluatorClosureAccepted && sourceTrustBoundaryClosureAccepted;
  const sourceDisabledRealOcrClosureAccepted = sourceEnabledRealOcrClosureAccepted;
  const sourceMinimalRealOcrRuntimePatchAccepted = sourceEnabledRealOcrClosureAccepted;
  const sourceTextDocumentSnapshotPatchAccepted = sourceEnabledRealOcrClosureAccepted;
  const sourceTechnicalDebtInventoryAccepted = sourceEnabledRealOcrClosureAccepted;

  const repoRoot = process.cwd();
  const artifactPresentAfter8_11L = fs.existsSync(path.join(repoRoot, "eng.traineddata"));
  if (artifactPresentAfter8_11L) {
    failures.push("eng.traineddata unexpectedly present — this design-only closure performs no OCR and should never create it");
  }

  const sourceEvidence: string[] = [
    `8.11K enabled handoff closure (commit f4e5e50) immutable snapshot marker present: ${sourceEnabledHandoffClosureAccepted}.`,
    `8.11J disabled handoff closure (commit 499ab72) immutable snapshot marker present: ${sourceDisabledHandoffClosureAccepted}.`,
    `8.11I minimal handoff runtime patch audit (commit e3be09b) immutable snapshot marker present: ${sourceMinimalHandoffRuntimePatchAccepted}.`,
    `8.11H handoff plan (commit b839538) immutable snapshot marker present: ${sourceHandoffPlanAccepted}.`,
    `8.11G real OCR trust boundary closure (commit 831779a) immutable snapshot marker present: ${sourceTrustBoundaryClosureAccepted}.`,
    `8.11F real OCR quality evaluator closure (commit 2ef041f) immutable snapshot marker present: ${sourceQualityEvaluatorClosureAccepted}.`,
    "None of the six primary source functions were invoked live in this closure — see docblock SOURCE STRATEGY. Each was confirmed via a cheap static text read (checkId literal + exported function name) only.",
    "8.11E (ec5a76f), 8.11D (3688358), 8.11C (46ddefc), 8.9N-PATCH (cf6624c), and the technical debt inventory (bdf3859) are accepted transitively through 8.11F/8.11G's own already-established, already-reported nested source evidence — not re-read individually by this closure.",
  ];

  const observedHandoffBaselineEvidence: string[] = [
    "8.11K observed (in this same environment, when originally closed): Case A HTTP 200, ok:true, real OCR performed through the route, quality.status=\"usable\", usableForSmartTalk:true.",
    "8.11K observed: handoff.allowed:true, handoff.performed:false, smartTalkResult:null, modelCallPerformed:false, smartTalkReasoningPerformed:false.",
    "8.11K observed: trustLevel=\"untrusted_derived\", sourceKind=\"ocr_derived_text\", publicRuntimeStillBlocked:true, productionAuthorizedNow:false, goLiveAuthorizedNow:false.",
    "This baseline is recorded from 8.11K's already-reported result and is NOT re-derived by re-invoking 8.11K in this closure.",
  ];

  // ── Structured design payload ───────────────────────────────────────────

  const controlledReasoningGateContract: ControlledReasoningGateContract = {
    gateName: "ocr_to_smart_talk_controlled_reasoning_gate",
    sourceKindRequired: "ocr_derived_text",
    sourceModeRequired: "photo_ocr_real_extraction_controlled_runtime",
    trustLevelRequired: "untrusted_derived",
    sensitivityLevelRequired: "sensitive_user_content",
    handoffEnvelopeRequired: true,
    handoffAllowedRequired: true,
    handoffPerformedMustStillBeFalseBeforeReasoning: true,
    smartTalkResultMustBeNullBeforeReasoning: true,
    extractedTextRequired: true,
    extractedTextMinimumLength: 1,
    extractedTextMaximumLength: 6000,
    providerMetadataRequired: true,
    qualityStatusRequired: true,
    usableForSmartTalkRequired: true,
    blockingReasonsRequired: true,
    blockingReasonsMustBeEmpty: true,
    downgradeReasonsRequired: true,
    ocrWarningsRequired: true,
    highRiskTokensDetectedRequired: true,
    privacyDisclaimerRequired: true,
    legalDisclaimerRequired: true,
    checkOriginalDocumentRequired: true,
    exactLegalDeadlineStillBlocked: true,
    officialFilingStillBlocked: true,
    bindingLegalAdviceStillBlocked: true,
    paymentInstructionStillBlocked: true,
    authoritySubmissionStillBlocked: true,
    dnaWriteStillBlocked: true,
    persistenceStillBlocked: true,
    publicRuntimeStillBlocked: true,
    productionGoLiveStillBlocked: true,
  };

  const futureReasoningEnvironmentGateDesign: FutureReasoningEnvironmentGateDesign = {
    futureEnvFlag: "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED",
    exactEnvValueRequired: "true",
    disabledByDefault: true,
    handoffEnvAlsoRequired: true,
    realOcrEnvAlsoRequired: true,
    allThreeFlagsMustBeExactTrue: true,
    handoffFlagAloneInsufficient: true,
    realOcrFlagAloneInsufficient: true,
    reasoningFlagAloneInsufficient: true,
    placeholderFlagCannotAuthorizeReasoning: true,
    textDocumentFlagCannotAuthorizeReasoning: true,
    freeQaFlagCannotAuthorizeReasoning: true,
    clientCannotAuthorizeByRequestField: true,
    serverSideAuthorizationOnly: true,
    publicRuntimeCannotSetImplicitAuthorization: true,
    productionAuthorizationStillSeparate: true,
    goLiveAuthorizationStillSeparate: true,
  };

  const reasoningAuthorizationConditions: AuthorizationCondition[] = REQUIRED_AUTHORIZATION_CONDITION_NAMES.map(
    (condition) => ({
      condition,
      required: true,
      failureBehavior: "fail_closed",
      noModelCallOnFailure: true,
    }),
  );

  const reasoningBlockingConditions: BlockingCondition[] = REQUIRED_BLOCKING_CONDITION_CODES.map((code) => ({
    code,
    blockReasoning: true,
    blockModelCall: true,
    failClosed: true,
    noPersistence: true,
    publicRuntimeStillBlocked: true,
  }));

  const reasoningDowngradeConditions: DowngradeCondition[] = REQUIRED_DOWNGRADE_CONDITION_CODES.map((code) => ({
    code,
    preserveInModelContext: true,
    preserveInResponseWarnings: true,
    neverPromoteToVerifiedTruth: true,
    highRiskClaimsRemainBlocked: true,
  }));

  const futureModelInputContract: FutureModelInputContract = {
    inputKind: "controlled_ocr_reasoning_input",
    extractedTextOnly: true,
    rawImageIncluded: false,
    originalFileIncluded: false,
    sourceKindIncluded: true,
    sourceModeIncluded: true,
    trustLevelIncluded: true,
    sensitivityLevelIncluded: true,
    providerIncluded: true,
    confidenceMetadataIncluded: true,
    qualityStatusIncluded: true,
    usableForSmartTalkIncluded: true,
    blockingReasonsIncluded: true,
    downgradeReasonsIncluded: true,
    ocrWarningsIncluded: true,
    highRiskTokensDetectedIncluded: true,
    checkOriginalDocumentInstructionIncluded: true,
    legalDisclaimerInstructionIncluded: true,
    privacyInstructionIncluded: true,
    exactDeadlineProhibitionIncluded: true,
    filingProhibitionIncluded: true,
    bindingAdviceProhibitionIncluded: true,
    paymentInstructionProhibitionIncluded: true,
    verifiedFactProhibitionIncluded: true,
    dnaWriteProhibitionIncluded: true,
    modelMustTreatTextAsPossiblyWrong: true,
    modelMustNotCorrectOcrSilently: true,
    modelMustFlagUncertainReadings: true,
    modelMustAskUserToCheckOriginalWhereMaterial: true,
    modelOutputRemainsUntrusted: true,
    inputPersistedByDefault: false,
  };

  const preModelEvidenceGateDesign: PreModelEvidenceGateDesign = {
    runsBeforeModelCall: true,
    receivesOcrSourceMetadata: true,
    receivesTrustMetadata: true,
    receivesQualityMetadata: true,
    receivesBlockingReasons: true,
    receivesDowngradeReasons: true,
    receivesOcrWarnings: true,
    receivesHighRiskTokens: true,
    rejectsMissingMetadata: true,
    rejectsBlockedQuality: true,
    rejectsLowQuality: true,
    rejectsBlockingReasons: true,
    rejectsRawImagePayload: true,
    rejectsOriginalFilePayload: true,
    rejectsPersistenceAuthorization: true,
    rejectsDnaAuthorization: true,
    rejectsPublicRuntimeAuthorization: true,
    preservesUntrustedStatus: true,
    doesNotCreateVerifiedFacts: true,
    doesNotAuthorizeExactDeadline: true,
    doesNotAuthorizeFiling: true,
    doesNotAuthorizePaymentInstruction: true,
    evidenceDecisionTraceRequired: true,
  };

  const postModelHallucinationTrapDesign: PostModelHallucinationTrapDesign = {
    runsAfterModelCall: true,
    receivesOriginalOcrTrustMetadata: true,
    receivesQualityMetadata: true,
    receivesHighRiskTokens: true,
    modelOutputTreatedAsUntrusted: true,
    blocksOverconfidentDocumentReading: true,
    blocksExactDeadlineClaim: true,
    blocksBindingLegalAdvice: true,
    blocksOfficialFilingGeneration: true,
    blocksPaymentInstruction: true,
    blocksAuthoritySubmissionInstruction: true,
    blocksVerifiedFactCreation: true,
    blocksDnaWrite: true,
    blocksUnsupportedNamesDatesAmountsAddresses: true,
    preservesOcrMayBeWrongWarning: true,
    preservesCheckOriginalWarning: true,
    preservesLegalDisclaimer: true,
    trapDecisionTraceRequired: true,
    failClosedOnTrapError: true,
  };

  const futureReasoningResponseContract: FutureReasoningResponseContract = {
    requiredFields: REQUIRED_RESPONSE_CONTRACT_FIELDS,
    successfulReasoningMustReport: [
      "OCR-derived source (sourceKind, sourceMode)",
      "untrusted status (trustLevel, modelOutputUntrusted)",
      "model-output untrusted status",
      "warnings (OCR-may-be-wrong, check-original-document, legal disclaimer)",
      "Evidence Gate decision trace",
      "hallucination-trap decision trace",
      "all high-risk prohibitions (exact deadline, filing, binding advice, payment instruction, verified facts, DNA write)",
    ],
  };

  const futureFailureContract: FailureContractEntry[] = REQUIRED_FAILURE_CONTRACT_CODES.map((code) => ({
    code,
    ok: false,
    noUnsafeFallback: true,
    noPersistence: true,
    noDnaWrite: true,
    publicRuntimeStillBlocked: true,
  }));

  const futureRuntimeIntegrationPlanBoundary: FutureRuntimeIntegrationPlanBoundary = {
    futurePrimaryFile: "app/api/smart-talk/route.ts",
    futureOptionalPureGateModule: "lib/vaylo/smart-talk/ocr/ocr-controlled-reasoning-gate.ts",
    futureOptionalModelInputBuilder: "lib/vaylo/smart-talk/ocr/ocr-reasoning-input.ts",
    futureRuntimeImplementationNotPerformedNow: true,
    futureModelCallNotImplementedNow: true,
    futureUiModificationNotPerformedNow: true,
    futureGateShouldBePureWherePossible: true,
    futureInputBuilderShouldBePure: true,
    futureGateMustNotPersist: true,
    futureInputBuilderMustNotReadImageBytes: true,
    futureModelAdapterMustReceiveTextOnly: true,
    futureRoutePatchMustRemainMinimal: true,
  };

  // ── Phase-sequence decision ──────────────────────────────────────────────
  // A distinct runtime-patch phase is inserted between the implementation
  // plan and the disabled closure, matching established repository
  // convention (8.11B plan -> 8.11C minimal runtime patch -> 8.11D disabled
  // closure -> 8.11E enabled closure; 8.11H plan -> 8.11I minimal runtime
  // patch -> 8.11J disabled closure -> 8.11K enabled closure). readyForNextPhase
  // remains exactly "8.11M" regardless of this recommendation.
  const recommendedPhaseSequence: readonly string[] = [
    "8.11M — OCR-to-Smart-Talk Controlled Reasoning Implementation Plan",
    "8.11N — Minimal Controlled Reasoning Runtime Patch",
    "8.11O — Controlled Reasoning Disabled Local API Closure",
    "8.11P — Controlled Reasoning Enabled Synthetic Local API Closure",
  ];

  const futureDisabledReasoningClosureDesign: FutureDisabledReasoningClosureDesign = {
    futurePhase: "8.11O",
    reasoningEnvDisabledCases: REQUIRED_DISABLED_REASONING_ENV_CASES,
    exactLowercaseTrueReservedForEnabledClosure: true,
    handoffAndRealOcrFlagsMayBeExactTrueForIsolation: true,
    everyDisabledReasoningCaseMustFailBeforeModel: true,
    expectedCode: "ocr_controlled_reasoning_disabled",
    modelCallMustRemainFalse: true,
    smartTalkReasoningMustRemainFalse: true,
    persistenceMustRemainFalse: true,
    publicRuntimeStillBlocked: true,
  };

  const futureEnabledSyntheticReasoningClosureDesign: FutureEnabledSyntheticReasoningClosureDesign = {
    futurePhase: "8.11P",
    exactReasoningEnvTrueRequired: true,
    exactHandoffEnvTrueRequired: true,
    exactRealOcrEnvTrueRequired: true,
    syntheticImageOnly: true,
    noRealDocument: true,
    inProcessRouteInvocationOnly: true,
    oneControlledModelCallMaximum: true,
    rawImageMustNotReachModel: true,
    originalFileMustNotReachModel: true,
    extractedTextAndMetadataOnly: true,
    evidenceGateMustRunBeforeModel: true,
    hallucinationTrapMustRunAfterModel: true,
    modelOutputMustRemainUntrusted: true,
    exactDeadlineStillBlocked: true,
    filingStillBlocked: true,
    bindingAdviceStillBlocked: true,
    paymentInstructionStillBlocked: true,
    noPersistence: true,
    publicRuntimeStillBlocked: true,
  };

  const tesseractCacheDebt: TesseractCacheDebtSection = {
    debtObservedPreviously: true,
    artifactName: "eng.traineddata",
    artifactLocationObservedPreviously: "repo root",
    artifactCreatedDuring8_11L: false,
    artifactPresentAfter8_11L,
    controlledCachePathStillNeeded: true,
    cleanupPolicyStillNeeded: true,
    gitignorePolicyReviewStillNeeded: true,
    blockerBeforeBrowserOrMobileTesting: true,
    blockerBeforePublicBeta: true,
    blockerBefore8_11M: false,
  };

  const rateLimitDebt: RateLimitDebtSection = {
    moduleLevelInMemoryLimiterObserved: true,
    crossClosureFlakinessObservedPreviously: true,
    deterministicTestIsolationStillNeeded: true,
    uniqueSyntheticIpStrategyStillRequired: true,
    blockerBeforePublicBeta: true,
    blockerBefore8_11M: false,
  };

  const auditExecutionDebt: AuditExecutionDebtSection = {
    transitiveOcrSourceExecutionObservedPreviously: true,
    immutableCommittedSnapshotsUsedFor8_11L: true,
    realOcrExecutionsPerformedBy8_11L: 0,
    modelCallsPerformedBy8_11L: 0,
    sourceSnapshotConsolidationStillNeeded: true,
    blockerBefore8_11M: false,
  };

  const allChecksPassed =
    sourceEnabledHandoffClosureAccepted &&
    sourceDisabledHandoffClosureAccepted &&
    sourceMinimalHandoffRuntimePatchAccepted &&
    sourceHandoffPlanAccepted &&
    sourceTrustBoundaryClosureAccepted &&
    sourceQualityEvaluatorClosureAccepted &&
    sourceEnabledRealOcrClosureAccepted &&
    sourceDisabledRealOcrClosureAccepted &&
    sourceMinimalRealOcrRuntimePatchAccepted &&
    sourceTextDocumentSnapshotPatchAccepted &&
    sourceTechnicalDebtInventoryAccepted &&
    !artifactPresentAfter8_11L;

  const reasoningGateDesignEvidence: string[] = [
    `controlledReasoningGateContract fully defined: gateName="${controlledReasoningGateContract.gateName}", sourceKindRequired="${controlledReasoningGateContract.sourceKindRequired}", trustLevelRequired="${controlledReasoningGateContract.trustLevelRequired}".`,
    `extractedTextMaximumLength=${controlledReasoningGateContract.extractedTextMaximumLength} (matches the route's existing REAL_OCR_MAX_TEXT_LENGTH boundary observed in 8.11K).`,
    "handoff.allowed must be true and handoff.performed must still be false immediately before any future reasoning attempt — this gate does not relax 8.11I's hard-coded handoff.performed:false; it defines what a FUTURE, not-yet-implemented gate would additionally require.",
  ];

  const reasoningAuthorizationEvidence: string[] = [
    `${reasoningAuthorizationConditions.length} authorization conditions defined, each with required:true, failureBehavior:"fail_closed", noModelCallOnFailure:true.`,
    "The three server-side env gates (handoff + real-OCR + future reasoning) must all be exact lowercase \"true\" simultaneously; no single gate authorizes reasoning alone.",
  ];

  const reasoningBlockingEvidence: string[] = [
    `${reasoningBlockingConditions.length} blocking conditions defined, each with blockReasoning:true, blockModelCall:true, failClosed:true, noPersistence:true, publicRuntimeStillBlocked:true.`,
    "Blocking conditions cover env-gate failures, malformed/oversized/multi-page input, OCR provider/timeout errors, missing or blocked quality/trust/warning/high-risk metadata, any raw-image/original-file model-payload attempt, any persistence/storage/DNA-write attempt, any public-runtime/production/go-live authorization attempt, Evidence Gate rejection, rate-limit rejection, and reasoning-timeout-budget unavailability.",
  ];

  const reasoningDowngradeEvidence: string[] = [
    `${reasoningDowngradeConditions.length} downgrade conditions defined, each preserved in model context and response warnings, never promoting to verified truth, with high-risk claims remaining blocked regardless.`,
    "Design rule enforced: downgrade conditions never automatically authorize claims — limited explanatory reasoning is only conceivable when quality remains usable, blocking reasons remain empty, the model receives explicit uncertainty instructions, and the response preserves all warnings.",
  ];

  const modelInputContractEvidence: string[] = [
    "futureModelInputContract restricts any future model call to extracted text plus metadata only — rawImageIncluded:false, originalFileIncluded:false, inputPersistedByDefault:false.",
    "The model input must include explicit prohibitions on exact deadlines, filings, binding advice, payment instructions, verified facts, and DNA writes, plus explicit instructions that the model must treat OCR text as possibly wrong and must not silently correct it.",
  ];

  const preModelEvidenceGateEvidence: string[] = [
    "preModelEvidenceGateDesign runs before any future model call, receives full OCR source/trust/quality/warning/high-risk metadata, and rejects missing metadata, blocked/low quality, blocking reasons, raw-image/original-file payloads, and any persistence/DNA/public-runtime authorization attempt.",
    "The Evidence Gate design does not itself create verified facts, authorize exact deadlines, authorize filings, or authorize payment instructions — it can only gate, never grant, those outcomes.",
  ];

  const postModelTrapEvidence: string[] = [
    "postModelHallucinationTrapDesign runs after any future model call and treats model output as untrusted by default, blocking overconfident document reading, exact deadline claims, binding legal advice, official filing generation, payment instructions, authority submission instructions, verified fact creation, and DNA writes.",
    "The trap design preserves the OCR-may-be-wrong warning, the check-original-document warning, and the legal disclaimer in every future response, and fails closed on its own internal error.",
  ];

  const reasoningResponseContractEvidence: string[] = [
    `futureReasoningResponseContract defines ${REQUIRED_RESPONSE_CONTRACT_FIELDS.length} required response fields/paths, including reasoning.evidenceGateDecision and reasoning.trapDecision traces.`,
    "A successful future controlled-reasoning response must still report OCR-derived source, untrusted status, model-output-untrusted status, warnings, both decision traces, and all high-risk prohibitions.",
  ];

  const failureContractEvidence: string[] = [
    `${futureFailureContract.length} fail-closed codes defined for the future reasoning gate, each with ok:false, noUnsafeFallback:true, noPersistence:true, noDnaWrite:true, publicRuntimeStillBlocked:true.`,
  ];

  const environmentGateEvidence: string[] = [
    `Future env flag designed: "${futureReasoningEnvironmentGateDesign.futureEnvFlag}", exact value required: "${futureReasoningEnvironmentGateDesign.exactEnvValueRequired}", disabled by default.`,
    "All three flags (handoff, real-OCR, future reasoning) must be exact lowercase \"true\" simultaneously; the client cannot authorize reasoning via any request field; authorization is server-side-only and remains separate from production/go-live authorization.",
  ];

  const futureRuntimeBoundaryEvidence: string[] = [
    `Future primary integration file: "${futureRuntimeIntegrationPlanBoundary.futurePrimaryFile}"; optional pure gate module: "${futureRuntimeIntegrationPlanBoundary.futureOptionalPureGateModule}"; optional model-input builder: "${futureRuntimeIntegrationPlanBoundary.futureOptionalModelInputBuilder}".`,
    "No runtime file is created or modified now — this section is a design boundary only, explicitly deferring implementation to 8.11M (plan) and the subsequent runtime-patch phase.",
  ];

  const disabledClosureDesignEvidence: string[] = [
    `Future disabled-reasoning closure (${futureDisabledReasoningClosureDesign.futurePhase}) will test ${futureDisabledReasoningClosureDesign.reasoningEnvDisabledCases.length} non-exact reasoning-env variants, expecting code "${futureDisabledReasoningClosureDesign.expectedCode}" for every case, with model call and Smart Talk reasoning remaining false.`,
  ];

  const enabledSyntheticClosureDesignEvidence: string[] = [
    `Future enabled-synthetic-reasoning closure (${futureEnabledSyntheticReasoningClosureDesign.futurePhase}) will require all three env flags exact "true", a synthetic image only, at most one controlled model call, the Evidence Gate running before and the hallucination trap running after that call, and every high-risk authorization (exact deadline, filing, binding advice, payment instruction) remaining blocked.`,
  ];

  const highRiskBoundaryEvidence: string[] = [
    "Every downgrade condition explicitly preserves highRiskClaimsRemainBlocked:true — no downgrade condition, confidence level, or model output can ever authorize an exact deadline, official filing, binding legal advice, payment instruction, authority submission, verified fact, or DNA write.",
    "This design-only closure introduces no high-risk-token detector changes and performs no OCR, so no high-risk tokens are observed or suppressed by this closure itself.",
  ];

  const noPersistenceEvidence: string[] = [
    "Every structured section (gate contract, blocking conditions, Evidence Gate, hallucination trap, failure contract, both future closure designs) explicitly requires noPersistence/persistenceStillBlocked/noDnaWrite:true.",
    "This closure itself performs no persistence, no DB/storage write, and no DNA write — it only reads existing source files and checks for eng.traineddata absence.",
  ];

  const tesseractCacheDebtEvidence: string[] = [
    `eng.traineddata created during 8.11L: false (this closure never runs OCR); present after 8.11L: ${artifactPresentAfter8_11L}.`,
    "Controlled cache path, systematic cleanup policy, and .gitignore policy review remain unresolved technical debt, explicitly carried forward and not a blocker before 8.11M.",
  ];

  const rateLimitDebtEvidence: string[] = [
    "Module-level in-memory rate limiter debt in route.ts is unchanged by this design-only phase; deterministic closure-level test isolation and a unique-synthetic-IP strategy remain required for future runtime-invoking closures (8.11O/8.11P), but are not a blocker before 8.11M.",
  ];

  const auditExecutionDebtEvidence: string[] = [
    "This closure performed 0 real OCR executions and 0 model calls — it relied entirely on immutable committed snapshot evidence for source acceptance.",
    "Consolidating ancestor-phase source-acceptance evidence into a single lightweight, non-executing snapshot artifact remains needed for future phases, but is not a blocker before 8.11M.",
  ];

  const safetyBoundaryEvidence: string[] = [
    "modelCallPerformed:false, smartTalkReasoningPerformed:false, ocrPerformedByDesign:false, handoffEnvelopeExecutedByDesign:false — this closure performs none of the runtime actions it designs a future gate for.",
    "publicRuntimeEnabledNow:false, productionAuthorizedNow:false, goLiveAuthorizedNow:false — all three remain blocked by this design.",
  ];

  const forbiddenRuntimeEvidence: string[] = [
    "No browser launched, no dev server started, no external network call, no OpenAI call, no OCR execution, no handoff-branch execution, no route/UI/adapter/package/config/env file modification.",
    "No real image or real document used by this closure — it performs no image-based operation at all.",
    "No localStorage/sessionStorage access; no commit; no push performed by this closure.",
  ];

  const readinessVerdict: string[] = [
    "controlledReasoningGateDesignClosed: true — every required structured section (gate contract, environment gate, authorization/blocking/downgrade conditions, model-input contract, pre-model Evidence Gate, post-model hallucination trap, response contract, failure contract, runtime boundary, both future closure designs) is fully defined.",
    "readyForControlledReasoningImplementationPlan: true — this design is complete enough to draft a concrete implementation plan.",
    "readyForControlledReasoningRuntimePatch: false, readyForSmartTalkReasoningFromOcr: false — no runtime code has been written or authorized.",
    "readyForNextPhase: \"8.11M\" — recommended: OCR-to-Smart-Talk Controlled Reasoning Implementation Plan.",
    "Recommended phase sequence explicitly inserts a distinct minimal-runtime-patch phase between the implementation plan and the disabled closure, matching established repository convention (8.11B->C->D->E and 8.11H->I->J->K): 8.11M plan, 8.11N minimal runtime patch, 8.11O disabled closure, 8.11P enabled synthetic closure.",
  ];

  const provisional: OcrToSmartTalkControlledReasoningGateDesignResult = {
    checkId: "8.11L",
    allPassed: true,
    controlledReasoningGateDesignOnly: true,
    ocrToSmartTalkControlledReasoningGateDesignOnly: true,
    controlledReasoningGateDesigned: allChecksPassed,
    controlledReasoningGateDesignClosed: allChecksPassed,
    controlledReasoningImplementedNow: false,
    smartTalkReasoningPerformed: false,
    modelCallPerformed: false,
    ocrPerformedByDesign: false,
    handoffEnvelopeExecutedByDesign: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    adapterModifiedNow: false,
    packageModifiedNow: false,
    configModifiedNow: false,
    envModifiedNow: false,
    runtimeModuleCreatedNow: false,
    browserInvokedByDesign: false,
    devServerStartedByDesign: false,
    externalNetworkCalledByDesign: false,
    externalFetchCalledByDesign: false,
    openAiCalled: false,
    realImageUsedByDesign: false,
    realDocumentUsed: false,
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

    sourceEnabledHandoffClosureCommit: "f4e5e50",
    sourceDisabledHandoffClosureCommit: "499ab72",
    sourceMinimalHandoffRuntimePatchCommit: "e3be09b",
    sourceHandoffPlanCommit: "b839538",
    sourceTrustBoundaryClosureCommit: "831779a",
    sourceQualityEvaluatorClosureCommit: "2ef041f",
    sourceEnabledRealOcrClosureCommit: "ec5a76f",
    sourceDisabledRealOcrClosureCommit: "3688358",
    sourceMinimalRealOcrRuntimePatchCommit: "46ddefc",
    sourceTextDocumentSnapshotPatchCommit: "cf6624c",
    sourceTechnicalDebtInventoryCommit: "bdf3859",

    sourceEnabledHandoffClosureAccepted,
    sourceDisabledHandoffClosureAccepted,
    sourceMinimalHandoffRuntimePatchAccepted,
    sourceHandoffPlanAccepted,
    sourceTrustBoundaryClosureAccepted,
    sourceQualityEvaluatorClosureAccepted,
    sourceEnabledRealOcrClosureAccepted,
    sourceDisabledRealOcrClosureAccepted,
    sourceMinimalRealOcrRuntimePatchAccepted,
    sourceTextDocumentSnapshotPatchAccepted,
    sourceTechnicalDebtInventoryAccepted,

    observedEnabledHandoffStatus: 200,
    observedEnabledHandoffOk: true,
    observedRealOcrPerformed: true,
    observedQualityStatus: "usable",
    observedUsableForSmartTalk: true,
    observedHandoffAllowed: true,
    observedHandoffPerformed: false,
    observedSmartTalkResultIsNull: true,
    observedModelCallPerformed: false,
    observedSmartTalkReasoningPerformed: false,
    observedTrustLevel: "untrusted_derived",
    observedSourceKind: "ocr_derived_text",
    observedPublicRuntimeStillBlocked: true,
    observedProductionAuthorizedNow: false,
    observedGoLiveAuthorizedNow: false,

    reasoningGateContractDefined: true,
    reasoningAuthorizationConditionsDefined: true,
    reasoningBlockingConditionsDefined: true,
    reasoningDowngradeConditionsDefined: true,
    modelInputContractDefined: true,
    preModelEvidenceGateContractDefined: true,
    postModelTrapContractDefined: true,
    reasoningResponseContractDefined: true,
    failureContractDefined: true,
    environmentGateDesignDefined: true,
    disabledClosureDesignDefined: true,
    enabledSyntheticClosureDesignDefined: true,
    noPersistenceContractDefined: true,
    highRiskClaimPolicyDefined: true,
    modelOutputRemainsUntrusted: true,
    readyForControlledReasoningImplementationPlan: allChecksPassed,
    readyForControlledReasoningRuntimePatch: false,
    readyForSmartTalkReasoningFromOcr: false,
    readyForBrowserManualHandoffTest: false,
    readyForMobileManualRealOcrTest: false,
    readyForPhotoOcrPublicRuntime: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.11M",
    recommendedNextPhase: "OCR-to-Smart-Talk Controlled Reasoning Implementation Plan",

    controlledReasoningGateContract,
    futureReasoningEnvironmentGateDesign,
    reasoningAuthorizationConditions,
    reasoningBlockingConditions,
    reasoningDowngradeConditions,
    futureModelInputContract,
    preModelEvidenceGateDesign,
    postModelHallucinationTrapDesign,
    futureReasoningResponseContract,
    futureFailureContract,
    futureRuntimeIntegrationPlanBoundary,
    futureDisabledReasoningClosureDesign,
    futureEnabledSyntheticReasoningClosureDesign,
    tesseractCacheDebt,
    rateLimitDebt,
    auditExecutionDebt,

    recommendedPhaseSequence,
    runtimePatchPhaseInsertionRecommended: true,

    tamperCount: OCR_TO_SMART_TALK_CONTROLLED_REASONING_GATE_DESIGN_TAMPER_CASES.length,
    tamperRejected: OCR_TO_SMART_TALK_CONTROLLED_REASONING_GATE_DESIGN_TAMPER_CASES.length,
    tamperPassing: true,

    sourceEvidence,
    observedHandoffBaselineEvidence,
    reasoningGateDesignEvidence,
    reasoningAuthorizationEvidence,
    reasoningBlockingEvidence,
    reasoningDowngradeEvidence,
    modelInputContractEvidence,
    preModelEvidenceGateEvidence,
    postModelTrapEvidence,
    reasoningResponseContractEvidence,
    failureContractEvidence,
    environmentGateEvidence,
    futureRuntimeBoundaryEvidence,
    disabledClosureDesignEvidence,
    enabledSyntheticClosureDesignEvidence,
    highRiskBoundaryEvidence,
    noPersistenceEvidence,
    tesseractCacheDebtEvidence,
    rateLimitDebtEvidence,
    auditExecutionDebtEvidence,
    safetyBoundaryEvidence,
    forbiddenRuntimeEvidence,
    readinessVerdict,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    nextRecommendedSteps: [
      "Draft the OCR-to-Smart-Talk Controlled Reasoning Implementation Plan (8.11M) using this design's structured sections as its direct contract.",
      "Insert a distinct minimal controlled-reasoning runtime patch phase (recommended 8.11N) between the implementation plan and the disabled closure, matching established repository convention.",
      "Create the controlled-reasoning disabled local API closure (recommended 8.11O) testing all 9 non-exact reasoning-env variants.",
      "Create the controlled-reasoning enabled synthetic local API closure (recommended 8.11P) with at most one controlled model call.",
      "Continue to preserve tesseract cache-path, rate-limit isolation, and audit-execution-chain technical debt for later, dedicated resolution.",
    ],
    notes: [
      "PHASE 8.11L is design-only: it defines the future controlled-reasoning gate contract as structured, inspectable data and performs zero OCR, zero model calls, zero runtime modification, and zero persistence.",
      "SOURCE STRATEGY DISCLOSURE: none of the six primary source functions (8.11K/J/I/H/G/F) were invoked live. Each was confirmed present on disk and confirmed via a cheap static text read to contain its own checkId literal and exported function name; their full allPassed:true results were already directly observed and reported when each phase was originally closed in this same environment. Ancestor phases 8.11E/D/C, 8.9N-PATCH, and the technical debt inventory are accepted transitively through 8.11F/8.11G's own already-established nested evidence.",
      "The observed 8.11K handoff baseline recorded in this closure (HTTP 200, ok:true, handoff.allowed:true, handoff.performed:false, smartTalkResult:null) is taken directly from 8.11K's already-reported result, not re-derived by re-invoking 8.11K.",
      `eng.traineddata presence check: ${artifactPresentAfter8_11L} (this closure performs no OCR, so it should always be absent).`,
      "The recommended phase sequence inserts a distinct minimal runtime-patch phase (8.11N) between the implementation plan (8.11M) and the disabled closure (8.11O), matching the established 8.11B->C->D->E and 8.11H->I->J->K convention. readyForNextPhase remains exactly \"8.11M\" regardless of this recommendation.",
    ],
  };

  const allPassed = allChecksPassed && failures.length === 0;

  if (allPassed && !_isCanonicalOcrToSmartTalkControlledReasoningGateDesignResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of OCR_TO_SMART_TALK_CONTROLLED_REASONING_GATE_DESIGN_TAMPER_CASES) {
    if (!_isCanonicalOcrToSmartTalkControlledReasoningGateDesignResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11L tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const tamperCount = OCR_TO_SMART_TALK_CONTROLLED_REASONING_GATE_DESIGN_TAMPER_CASES.length;
  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...provisional.notes,
    `8.11L tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    controlledReasoningGateDesigned: finalAllPassed,
    controlledReasoningGateDesignClosed: finalAllPassed,
    readyForControlledReasoningImplementationPlan: finalAllPassed,
    tamperRejected,
    tamperCount,
    tamperPassing: tamperRejected === tamperCount,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-ocr-to-smart-talk-controlled-reasoning-gate-design");

if (invokedDirectly) {
  runOcrToSmartTalkControlledReasoningGateDesign()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runOcrToSmartTalkControlledReasoningGateDesign failed:", err);
      process.exitCode = 1;
    });
}
