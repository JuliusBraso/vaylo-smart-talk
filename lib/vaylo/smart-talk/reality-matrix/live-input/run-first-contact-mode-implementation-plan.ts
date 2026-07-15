/**
 * PHASE 8.12B — Smart Talk First Contact Mode Implementation Plan
 *
 * IMPLEMENTATION-PLANNING ONLY. Converts the accepted First Contact gate
 * design (8.12A, commit bd6a89e) into a precise, bounded, implementation-
 * ready plan for the smallest safe First Contact runtime and UI patch —
 * WITHOUT implementing the runtime, modifying the route, modifying the
 * UI, modifying prompts, adding an environment flag, adding translations,
 * calling a model, invoking OCR, or authorizing controlled beta, public
 * beta, production, or go-live.
 *
 * SOURCE STRATEGY (fully disclosed): this closure does NOT invoke
 * runFirstContactModeGateDesign() (8.12A),
 * runUnifiedSmartTalkCrossModeRegressionClosure() (8.11S), or
 * runOcrRuntimeTechnicalDebtHardeningAudit() (8.11R) live. Each is
 * confirmed present on disk and confirmed via a cheap static text read
 * (fs.readFileSync, no execution, no git subprocess) to contain its own
 * expected `checkId` literal and exported function name. Their full
 * `allPassed:true` results were already directly observed and reported
 * in this same environment when each phase was originally closed
 * (8.12A commit bd6a89e, 8.11S commit 477ab17, 8.11R commit b731c2c).
 *
 * This closure never shells out to `git` at all — there is no
 * self-referential working-tree check here. HEAD-at-bd6a89e and a clean
 * working tree were verified by the agent via `git status --short` /
 * `git log --oneline -5` immediately before this file was created (see
 * the final report), as a one-time procedural precondition — not as a
 * value re-derived by this closure at run time.
 *
 * This closure performs zero filesystem writes, zero network calls, zero
 * model calls, zero OCR, and zero persistence. It only reads a handful of
 * already-committed source files on disk to ground its architecture
 * findings (route.ts, SmartTalkClient.tsx, run-smart-talk.ts,
 * build-smart-talk-prompt.ts, the rate limiter, and the three source
 * closures) in real, current, inspectable text — not assumption.
 */

import fs from "fs";
import path from "path";

// ─── Static source-file markers (relative to repo root) ───────────────────

const SOURCE_FILES = {
  gateDesign: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-mode-gate-design.ts",
    checkIdMarker: 'checkId: "8.12A"',
    exportMarker: "runFirstContactModeGateDesign",
  },
  unifiedRegressionClosure: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-unified-smart-talk-cross-mode-regression-closure.ts",
    checkIdMarker: 'checkId: "8.11S"',
    exportMarker: "runUnifiedSmartTalkCrossModeRegressionClosure",
  },
  technicalHardeningAudit: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-ocr-runtime-technical-debt-hardening-audit.ts",
    checkIdMarker: 'checkId: "8.11R"',
    exportMarker: "runOcrRuntimeTechnicalDebtHardeningAudit",
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

// ─── Live static architecture-grounding checks (read-only, no execution) ──
// These confirm the "current architecture" claims below against the real,
// currently-committed source text rather than relying on memory.

const ARCHITECTURE_GROUND_TRUTHS = {
  route: {
    relPath: "app/api/smart-talk/route.ts",
    minTextMarker: "const MIN_TEXT = 8",
    maxTextMarker: "const MAX_TEXT = 12_000",
    localeAllowlistMarker: 'new Set<SmartTalkLocale>(["sk", "de", "en"])',
    rateLimiterMarker: "getRuntimeSmartTalkRateLimiter",
    exactTrueGateMarker: '=== "true"',
    bypassGuardMarker: "detectTextDocumentBypassRequired",
    paidModeGuardMarker: "detectClientPaidDocumentModeActivation",
    textDocumentDisabledMarker: "text_document_mode_disabled",
  },
  promptBuilder: {
    relPath: "lib/vaylo/smart-talk/build-smart-talk-prompt.ts",
    localeMarker: 'export type SmartTalkLocale = "sk" | "de" | "en"',
    inputTypeMarker: 'export type SmartTalkInputType = "text" | "question"',
    textSourceMarker: 'export type SmartTalkTextSource = "photo_ocr"',
  },
  runSmartTalk: {
    relPath: "lib/vaylo/smart-talk/run-smart-talk.ts",
    resultTypeMarker: "export type SmartTalkResult = {",
    urgencyMarker: 'export type SmartTalkUrgency = "low" | "medium" | "high" | "unknown"',
    entryPointMarker: "export async function runSmartTalk(",
  },
  rateLimiter: {
    relPath: "lib/vaylo/smart-talk/rate-limit/smart-talk-rate-limiter.ts",
    windowMarker: "SMART_TALK_RATE_WINDOW_MS",
  },
  uiClient: {
    relPath: "app/smart-talk/SmartTalkClient.tsx",
    modeTypeMarker: 'type SmartTalkUiMode = "question" | "text" | "photo"',
  },
} as const;

function fileContainsAllMarkers(relPath: string, markers: readonly string[]): boolean {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
    return markers.every((m) => src.includes(m));
  } catch {
    return false;
  }
}

// ─── Required conceptual catalogs ──────────────────────────────────────────

const REQUIRED_EVIDENCE_LIMITATIONS: readonly string[] = [
  "This phase is implementation-planning only.",
  "No First Contact runtime was implemented.",
  "No route mode was added.",
  "No environment flag was added.",
  "No prompt was modified.",
  "No response schema was modified.",
  "No UI menu item or scenario card was implemented.",
  "No model or OCR call was performed.",
  "No browser or mobile device was tested.",
  "No German-market First Contact result was dynamically tested.",
  "No Slovak or German First Contact output was validated.",
  "No multilingual output was validated.",
  "No Austrian market logic was implemented.",
  "No DNA or billing integration was implemented.",
  "No controlled beta, public beta, production, or go-live authorization was granted.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "minimal controlled runtime patch not implemented",
  "runtime gate not implemented",
  "route mode not implemented",
  "environment flag not implemented",
  "source discriminator not implemented if selected",
  "prompt changes not implemented",
  "presentation mapper not implemented",
  "final presentation validator not implemented",
  "disabled API closure not executed",
  "enabled API closure not executed",
  "cross-mode regression not rerun with First Contact",
  "high-risk scenarios not dynamically validated",
  "document-mode boundary not dynamically validated",
  "paid-mode boundary not dynamically validated",
  "prompt-injection cases not dynamically validated",
  "UI menu item not implemented",
  "scenario cards not implemented",
  "Android Chrome validation pending",
  "iOS Safari validation pending",
  "multilingual architecture validation pending",
  "Germany market knowledge validation pending",
  "Austria implementation not started",
  "DNA integration not implemented",
  "public beta unauthorized",
  "production unauthorized",
  "go-live unauthorized",
];

const EXACT_EXISTING_FILES_RECOMMENDED: readonly string[] = [
  "app/api/smart-talk/route.ts",
  "lib/vaylo/smart-talk/build-smart-talk-prompt.ts",
];

const EXACT_NEW_FILES_RECOMMENDED: readonly string[] = [
  "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts",
  "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts",
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-minimal-controlled-runtime-patch-audit.ts",
];

const CURRENT_LOCALE_VALUES: readonly string[] = ["sk", "de", "en"];

// ─── Top-level result type ──────────────────────────────────────────────────

interface Result {
  checkId: "8.12B";
  allPassed: boolean;

  implementationPlanOnly: true;
  runtimeImplementedNow: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  promptModifiedNow: false;
  resultSchemaModifiedNow: false;
  environmentFlagAddedNow: false;
  translationAddedNow: false;
  marketRuntimeAddedNow: false;
  modelCallPerformed: false;
  ocrPerformed: false;
  browserInvoked: false;
  mobileDeviceInvoked: false;
  devServerStarted: false;
  persistencePerformed: false;
  dbStorageWritePerformed: false;
  dnaReadPerformed: false;
  dnaWritePerformed: false;
  billingModifiedNow: false;
  controlledBetaAuthorizedNow: false;
  publicBetaAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceGateDesignCommit: "bd6a89e";
  sourceUnifiedRegressionCommit: "477ab17";
  sourceTechnicalHardeningCommit: "b731c2c";
  sourceGateDesignAccepted: boolean;
  sourceUnifiedRegressionAccepted: boolean;
  sourceTechnicalHardeningAccepted: boolean;

  currentAcceptedModesInspected: true;
  currentModeCount: 5;
  currentSmartTalkResultInspected: true;
  currentRunSmartTalkEntryPointInspected: true;
  currentPromptBuilderInspected: true;
  currentLocaleTypeInspected: true;
  currentLocaleValues: readonly string[];
  currentMarketRuntimeExists: false;
  currentJurisdictionRuntimeExists: false;
  currentRegionRuntimeExists: false;
  currentDnaIntegrationExistsForStandalone: false;

  plannedModeConcept: "first_contact";
  plannedRouteMode: "first_contact_controlled_runtime";
  explicitModeSelectionRequired: true;
  plannedEnvironmentFlag: "SMART_TALK_FIRST_CONTACT_MODE_ENABLED";
  exactTrueGateRequired: true;
  fallbackToOtherModeAllowed: false;
  clientBypassAllowed: false;
  automaticYouthDetectionAllowed: false;
  automaticModeSwitchingAllowed: false;

  requestContractDesigned: true;
  requestContentType: "application/json";
  meaningfulTextRequired: true;
  scenarioOptional: true;
  scenarioAloneSufficient: false;
  scenarioServerAllowlistRequired: true;
  scenarioIsEvidence: false;
  localeRequired: true;
  marketRequiredOrServerBounded: "client_provided_server_allowlist_validated";
  unsupportedMarketRejected: true;
  jurisdictionClientClaimTrusted: false;
  regionClientClaimTrusted: false;
  inputLimitsReuseCurrentContract: true;
  promptInjectionHandledAsUntrustedText: true;

  initialSupportedMarket: "DE";
  optionAReviewed: true;
  optionBReviewed: true;
  optionCReviewed: true;
  selectedMarketIntegrationOption: "A" | "B" | "C";
  localeSeparatedFromMarket: true;
  marketServerAllowlistRequired: true;
  jurisdictionMayNotBeInferredFromLocale: true;
  marketInferredFromLocaleAllowed: false;
  regionMayNotBeFabricated: true;
  AustriaImplementedNow: false;
  futureAustriaLayerRequired: true;
  germanAustrianRuleMixingForbidden: true;

  runtimeGateModulePlanned: true;
  runtimeGatePure: true;
  runSmartTalkReusePlanned: true;
  separateDirectOpenAiPathPlanned: false;
  maximumModelCallsPerRequest: 1;
  secondModelCallPlanned: false;
  ocrUsedByFirstContact: false;
  documentExtractionUsedByFirstContact: false;
  deterministicPresentationMappingPlanned: true;
  finalPresentationValidatorPlanned: true;
  noPersistencePreserved: true;

  currentInputTypeOptionsInspected: true;
  currentSourceOptionsInspected: true;
  dedicatedFirstContactSourceEvaluated: true;
  selectedSourceStrategy: "dedicated_source_discriminator_reusing_question_input_type";
  newInputTypeRequired: false;
  globalPromptChangeRequired: false;
  modeConditionalPromptChangeRequired: true;

  existingSmartTalkResultPreserved: true;
  globalSmartTalkResultMigrationPlanned: false;
  routeLevelFirstContactWrapperPlanned: true;
  firstContactMetaDesigned: true;
  situationSummaryPlanned: true;
  firstStepPlanned: true;
  preparationItemsPlanned: true;
  canWaitOptionalAndRiskControlled: true;
  helpBoundaryPlanned: true;
  evidenceLimitationsPlanned: true;
  trustLevelUntrustedRequired: true;
  boundedArraySizesRequired: true;
  boundedTextLengthsRequired: true;

  factsFirstPipelinePlanned: true;
  urgencyPreservationRequired: true;
  warningPreservationRequired: true;
  deadlinePreservationRequired: true;
  uncertaintyPreservationRequired: true;
  highRiskCanWaitSuppressed: true;
  unknownRiskCanWaitSuppressed: true;
  filingInstructionForbidden: true;
  paymentInstructionForbidden: true;
  signingInstructionForbidden: true;
  rightsWaiverInstructionForbidden: true;
  verifiedClaimForbidden: true;
  processCompleteClaimForbidden: true;
  applicationSubmittedClaimForbidden: true;
  documentAnalyzedWithoutContentClaimForbidden: true;
  presentationMayInventFacts: false;

  documentModeBoundaryReusePlanned: true;
  photoOcrBoundaryReusePlanned: true;
  paidDocumentBoundaryReusePlanned: true;
  paidModeBypassAllowed: false;
  highRiskGovernanceReusePlanned: true;
  freeDocumentInterpretationBypassBlocked: true;
  firstContactMayRecommendOtherMode: true;
  firstContactMaySilentlySwitchMode: false;

  anonymousStandalonePreserved: true;
  ephemeralStandalonePreserved: true;
  authenticationRequired: false;
  dbWritePlanned: false;
  storageWritePlanned: false;
  localStorageWritePlanned: false;
  sessionStorageWritePlanned: false;
  dnaReadPlanned: false;
  dnaWritePlanned: false;
  profileMutationPlanned: false;
  longTermMemoryPlanned: false;
  futureDnaAdapterRequiresSeparateGate: true;
  billingIntegrationPlannedNow: false;

  mobileFirstUiPlanDefined: true;
  menuOrderDefined: true;
  scenarioCardsOptional: true;
  meaningfulTextStillRequired: true;
  largeTapTargetsRequired: true;
  onePrimaryActionRequired: true;
  noHoverDependencyRequired: true;
  warningsVisibleByDefaultRequired: true;
  criticalContentCollapsibleByDefault: false;
  screenReaderSemanticsRequired: true;
  desktopMadePrimary: false;
  uiImplementedNow: false;

  minimalPatchFileBoundaryDefined: true;
  maximumExistingFilesToModify: number;
  maximumNewFilesToCreate: number;
  maximumTotalFilesChanged: number;
  exactExistingFilesRecommended: readonly string[];
  exactNewFilesRecommended: readonly string[];
  runtimeOnlyPatchRecommended: true;
  uiDeferredToLaterPhase: true;
  SmartTalkResultGlobalModificationAvoided: true;

  staticPatchAuditPlanned: true;
  disabledApiClosurePlanned: true;
  enabledSyntheticApiClosurePlanned: true;
  crossModeRegressionPlanned: true;
  highRiskRegressionPlanned: true;
  documentBoundaryRegressionPlanned: true;
  paidBoundaryRegressionPlanned: true;
  promptInjectionRegressionPlanned: true;
  androidValidationDeferred: true;
  iosValidationDeferred: true;

  nextPatchPhase: "8.12C";
  disabledEnabledClosurePhase: "8.12D";
  uiPatchPhase: "8.12E";
  browserMobileValidationPhase: "8.12F";
  readinessClosurePhase: "8.12G";
  phaseSequenceMinimized: true;
  unsafePhaseCollapseAllowed: false;

  firstContactImplementationArchitecturePlanned: boolean;
  firstContactRuntimeGatePlanned: boolean;
  firstContactRequestContractPlanned: boolean;
  firstContactResponseContractPlanned: boolean;
  firstContactPresentationSafetyPlanned: boolean;
  firstContactMarketIntegrationPlanned: boolean;
  firstContactValidationPlanPrepared: boolean;
  firstContactImplementationPlanAccepted: boolean;
  readyForMinimalFirstContactRuntimePatch: boolean;
  readyForFirstContactUiPatch: false;
  readyForFirstContactApiValidation: false;
  readyForAndroidValidation: false;
  readyForIosValidation: false;
  readyForControlledBetaAuthorization: false;
  readyForPublicBetaAuthorization: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.12C";
  recommendedNextPhase: "Smart Talk First Contact Minimal Controlled Runtime Patch";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  inspectedFiles: string[];
  currentArchitectureFindings: string[];
  implementationAlternatives: string[];
  selectedArchitecture: string[];
  routeContractPlan: string[];
  requestContractPlan: string[];
  marketIntegrationAnalysis: string[];
  scenarioContractPlan: string[];
  runtimeGatePlan: string[];
  runSmartTalkReusePlan: string[];
  sourceDiscriminatorPlan: string[];
  promptChangePlan: string[];
  responseWrapperPlan: string[];
  presentationMapperPlan: string[];
  presentationValidatorPlan: string[];
  documentBoundaryPlan: string[];
  paidBoundaryPlan: string[];
  highRiskPlan: string[];
  privacyPlan: string[];
  mobileUiPlan: string[];
  localizationPlan: string[];
  GermanyAustriaSeparationPlan: string[];
  fileModificationPlan: string[];
  validationPlan: string[];
  phaseSequence: string[];
  implementationRisks: string[];
  riskMitigations: string[];
  evidenceLimitations: string[];
  remainingBlockers: string[];
  readinessVerdict: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function isNonEmptyArray(v: unknown): boolean {
  return Array.isArray(v) && v.length > 0;
}

function _isCanonicalResult(r: Result): boolean {
  if (r.checkId !== "8.12B") return false;
  if (r.allPassed !== true) return false;

  if (
    r.implementationPlanOnly !== true ||
    r.runtimeImplementedNow !== false ||
    r.routeModifiedNow !== false ||
    r.uiModifiedNow !== false ||
    r.promptModifiedNow !== false ||
    r.resultSchemaModifiedNow !== false ||
    r.environmentFlagAddedNow !== false ||
    r.translationAddedNow !== false ||
    r.marketRuntimeAddedNow !== false ||
    r.modelCallPerformed !== false ||
    r.ocrPerformed !== false ||
    r.browserInvoked !== false ||
    r.mobileDeviceInvoked !== false ||
    r.devServerStarted !== false ||
    r.persistencePerformed !== false ||
    r.dbStorageWritePerformed !== false ||
    r.dnaReadPerformed !== false ||
    r.dnaWritePerformed !== false ||
    r.billingModifiedNow !== false ||
    r.controlledBetaAuthorizedNow !== false ||
    r.publicBetaAuthorizedNow !== false ||
    r.productionAuthorizedNow !== false ||
    r.goLiveAuthorizedNow !== false ||
    r.eightThreeAcNotRun !== true ||
    r.tmpEightThreeAcMetadataTouched !== false
  )
    return false;

  if (r.sourceGateDesignCommit !== "bd6a89e") return false;
  if (r.sourceUnifiedRegressionCommit !== "477ab17") return false;
  if (r.sourceTechnicalHardeningCommit !== "b731c2c") return false;
  if (!r.sourceGateDesignAccepted) return false;
  if (!r.sourceUnifiedRegressionAccepted) return false;
  if (!r.sourceTechnicalHardeningAccepted) return false;

  if (
    r.currentAcceptedModesInspected !== true ||
    r.currentModeCount !== 5 ||
    r.currentSmartTalkResultInspected !== true ||
    r.currentRunSmartTalkEntryPointInspected !== true ||
    r.currentPromptBuilderInspected !== true ||
    r.currentLocaleTypeInspected !== true ||
    r.currentMarketRuntimeExists !== false ||
    r.currentJurisdictionRuntimeExists !== false ||
    r.currentRegionRuntimeExists !== false ||
    r.currentDnaIntegrationExistsForStandalone !== false
  )
    return false;
  if (r.currentLocaleValues.length !== CURRENT_LOCALE_VALUES.length) return false;
  for (const l of CURRENT_LOCALE_VALUES) {
    if (!r.currentLocaleValues.includes(l)) return false;
  }

  if (
    r.plannedModeConcept !== "first_contact" ||
    r.plannedRouteMode !== "first_contact_controlled_runtime" ||
    r.explicitModeSelectionRequired !== true ||
    r.plannedEnvironmentFlag !== "SMART_TALK_FIRST_CONTACT_MODE_ENABLED" ||
    r.exactTrueGateRequired !== true ||
    r.fallbackToOtherModeAllowed !== false ||
    r.clientBypassAllowed !== false ||
    r.automaticYouthDetectionAllowed !== false ||
    r.automaticModeSwitchingAllowed !== false
  )
    return false;

  if (
    r.requestContractDesigned !== true ||
    r.requestContentType !== "application/json" ||
    r.meaningfulTextRequired !== true ||
    r.scenarioOptional !== true ||
    r.scenarioAloneSufficient !== false ||
    r.scenarioServerAllowlistRequired !== true ||
    r.scenarioIsEvidence !== false ||
    r.localeRequired !== true ||
    r.unsupportedMarketRejected !== true ||
    r.jurisdictionClientClaimTrusted !== false ||
    r.regionClientClaimTrusted !== false ||
    r.inputLimitsReuseCurrentContract !== true ||
    r.promptInjectionHandledAsUntrustedText !== true
  )
    return false;

  if (
    r.initialSupportedMarket !== "DE" ||
    r.optionAReviewed !== true ||
    r.optionBReviewed !== true ||
    r.optionCReviewed !== true ||
    r.selectedMarketIntegrationOption !== "B" ||
    r.localeSeparatedFromMarket !== true ||
    r.marketServerAllowlistRequired !== true ||
    r.jurisdictionMayNotBeInferredFromLocale !== true ||
    r.marketInferredFromLocaleAllowed !== false ||
    r.regionMayNotBeFabricated !== true ||
    r.AustriaImplementedNow !== false ||
    r.futureAustriaLayerRequired !== true ||
    r.germanAustrianRuleMixingForbidden !== true
  )
    return false;

  if (
    r.runtimeGateModulePlanned !== true ||
    r.runtimeGatePure !== true ||
    r.runSmartTalkReusePlanned !== true ||
    r.separateDirectOpenAiPathPlanned !== false ||
    r.maximumModelCallsPerRequest !== 1 ||
    r.secondModelCallPlanned !== false ||
    r.ocrUsedByFirstContact !== false ||
    r.documentExtractionUsedByFirstContact !== false ||
    r.deterministicPresentationMappingPlanned !== true ||
    r.finalPresentationValidatorPlanned !== true ||
    r.noPersistencePreserved !== true
  )
    return false;

  if (
    r.currentInputTypeOptionsInspected !== true ||
    r.currentSourceOptionsInspected !== true ||
    r.dedicatedFirstContactSourceEvaluated !== true ||
    r.selectedSourceStrategy !== "dedicated_source_discriminator_reusing_question_input_type" ||
    r.newInputTypeRequired !== false ||
    r.globalPromptChangeRequired !== false ||
    r.modeConditionalPromptChangeRequired !== true
  )
    return false;

  if (
    r.existingSmartTalkResultPreserved !== true ||
    r.globalSmartTalkResultMigrationPlanned !== false ||
    r.routeLevelFirstContactWrapperPlanned !== true ||
    r.firstContactMetaDesigned !== true ||
    r.situationSummaryPlanned !== true ||
    r.firstStepPlanned !== true ||
    r.preparationItemsPlanned !== true ||
    r.canWaitOptionalAndRiskControlled !== true ||
    r.helpBoundaryPlanned !== true ||
    r.evidenceLimitationsPlanned !== true ||
    r.trustLevelUntrustedRequired !== true ||
    r.boundedArraySizesRequired !== true ||
    r.boundedTextLengthsRequired !== true
  )
    return false;

  if (
    r.factsFirstPipelinePlanned !== true ||
    r.urgencyPreservationRequired !== true ||
    r.warningPreservationRequired !== true ||
    r.deadlinePreservationRequired !== true ||
    r.uncertaintyPreservationRequired !== true ||
    r.highRiskCanWaitSuppressed !== true ||
    r.unknownRiskCanWaitSuppressed !== true ||
    r.filingInstructionForbidden !== true ||
    r.paymentInstructionForbidden !== true ||
    r.signingInstructionForbidden !== true ||
    r.rightsWaiverInstructionForbidden !== true ||
    r.verifiedClaimForbidden !== true ||
    r.processCompleteClaimForbidden !== true ||
    r.applicationSubmittedClaimForbidden !== true ||
    r.documentAnalyzedWithoutContentClaimForbidden !== true ||
    r.presentationMayInventFacts !== false
  )
    return false;

  if (
    r.documentModeBoundaryReusePlanned !== true ||
    r.photoOcrBoundaryReusePlanned !== true ||
    r.paidDocumentBoundaryReusePlanned !== true ||
    r.paidModeBypassAllowed !== false ||
    r.highRiskGovernanceReusePlanned !== true ||
    r.freeDocumentInterpretationBypassBlocked !== true ||
    r.firstContactMayRecommendOtherMode !== true ||
    r.firstContactMaySilentlySwitchMode !== false
  )
    return false;

  if (
    r.anonymousStandalonePreserved !== true ||
    r.ephemeralStandalonePreserved !== true ||
    r.authenticationRequired !== false ||
    r.dbWritePlanned !== false ||
    r.storageWritePlanned !== false ||
    r.localStorageWritePlanned !== false ||
    r.sessionStorageWritePlanned !== false ||
    r.dnaReadPlanned !== false ||
    r.dnaWritePlanned !== false ||
    r.profileMutationPlanned !== false ||
    r.longTermMemoryPlanned !== false ||
    r.futureDnaAdapterRequiresSeparateGate !== true ||
    r.billingIntegrationPlannedNow !== false
  )
    return false;

  if (
    r.mobileFirstUiPlanDefined !== true ||
    r.menuOrderDefined !== true ||
    r.scenarioCardsOptional !== true ||
    r.meaningfulTextStillRequired !== true ||
    r.largeTapTargetsRequired !== true ||
    r.onePrimaryActionRequired !== true ||
    r.noHoverDependencyRequired !== true ||
    r.warningsVisibleByDefaultRequired !== true ||
    r.criticalContentCollapsibleByDefault !== false ||
    r.screenReaderSemanticsRequired !== true ||
    r.desktopMadePrimary !== false ||
    r.uiImplementedNow !== false
  )
    return false;

  if (r.minimalPatchFileBoundaryDefined !== true) return false;
  if (r.maximumExistingFilesToModify > 3) return false;
  if (r.maximumNewFilesToCreate > 3) return false;
  if (r.maximumTotalFilesChanged > 6) return false;
  if (r.maximumTotalFilesChanged !== r.maximumExistingFilesToModify + r.maximumNewFilesToCreate) return false;
  if (r.exactExistingFilesRecommended.length !== EXACT_EXISTING_FILES_RECOMMENDED.length) return false;
  for (const f of EXACT_EXISTING_FILES_RECOMMENDED) {
    if (!r.exactExistingFilesRecommended.includes(f)) return false;
  }
  if (r.exactNewFilesRecommended.length !== EXACT_NEW_FILES_RECOMMENDED.length) return false;
  for (const f of EXACT_NEW_FILES_RECOMMENDED) {
    if (!r.exactNewFilesRecommended.includes(f)) return false;
  }
  if (
    r.runtimeOnlyPatchRecommended !== true ||
    r.uiDeferredToLaterPhase !== true ||
    r.SmartTalkResultGlobalModificationAvoided !== true
  )
    return false;

  if (
    r.staticPatchAuditPlanned !== true ||
    r.disabledApiClosurePlanned !== true ||
    r.enabledSyntheticApiClosurePlanned !== true ||
    r.crossModeRegressionPlanned !== true ||
    r.highRiskRegressionPlanned !== true ||
    r.documentBoundaryRegressionPlanned !== true ||
    r.paidBoundaryRegressionPlanned !== true ||
    r.promptInjectionRegressionPlanned !== true ||
    r.androidValidationDeferred !== true ||
    r.iosValidationDeferred !== true
  )
    return false;

  if (
    r.nextPatchPhase !== "8.12C" ||
    r.disabledEnabledClosurePhase !== "8.12D" ||
    r.uiPatchPhase !== "8.12E" ||
    r.browserMobileValidationPhase !== "8.12F" ||
    r.readinessClosurePhase !== "8.12G" ||
    r.phaseSequenceMinimized !== true ||
    r.unsafePhaseCollapseAllowed !== false
  )
    return false;

  if (
    !r.firstContactImplementationArchitecturePlanned ||
    !r.firstContactRuntimeGatePlanned ||
    !r.firstContactRequestContractPlanned ||
    !r.firstContactResponseContractPlanned ||
    !r.firstContactPresentationSafetyPlanned ||
    !r.firstContactMarketIntegrationPlanned ||
    !r.firstContactValidationPlanPrepared ||
    !r.firstContactImplementationPlanAccepted ||
    r.readyForMinimalFirstContactRuntimePatch !== true ||
    r.readyForFirstContactUiPatch !== false ||
    r.readyForFirstContactApiValidation !== false ||
    r.readyForAndroidValidation !== false ||
    r.readyForIosValidation !== false ||
    r.readyForControlledBetaAuthorization !== false ||
    r.readyForPublicBetaAuthorization !== false ||
    r.readyForProduction !== false ||
    r.readyForGoLive !== false ||
    r.readyForNextPhase !== "8.12C" ||
    r.recommendedNextPhase !== "Smart Talk First Contact Minimal Controlled Runtime Patch"
  )
    return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  const requiredNonEmptyStringArrays: (keyof Result)[] = [
    "sourceEvidence",
    "inspectedFiles",
    "currentArchitectureFindings",
    "implementationAlternatives",
    "selectedArchitecture",
    "routeContractPlan",
    "requestContractPlan",
    "marketIntegrationAnalysis",
    "scenarioContractPlan",
    "runtimeGatePlan",
    "runSmartTalkReusePlan",
    "sourceDiscriminatorPlan",
    "promptChangePlan",
    "responseWrapperPlan",
    "presentationMapperPlan",
    "presentationValidatorPlan",
    "documentBoundaryPlan",
    "paidBoundaryPlan",
    "highRiskPlan",
    "privacyPlan",
    "mobileUiPlan",
    "localizationPlan",
    "GermanyAustriaSeparationPlan",
    "fileModificationPlan",
    "validationPlan",
    "phaseSequence",
    "readinessVerdict",
    "nextRecommendedSteps",
    "notes",
  ];
  for (const key of requiredNonEmptyStringArrays) {
    if (!isNonEmptyArray(r[key])) return false;
  }

  if (r.implementationRisks.length < 15) return false;
  if (r.riskMitigations.length !== r.implementationRisks.length) return false;

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

type TamperMutation = (r: Result) => Result;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "1. gate-design commit mismatch", mutate: (r) => ({ ...r, sourceGateDesignCommit: "0000000" as "bd6a89e" }) },
  { label: "2. gate design not accepted", mutate: (r) => ({ ...r, sourceGateDesignAccepted: false }) },
  { label: "3. current market runtime falsely claimed to exist", mutate: (r) => ({ ...r, currentMarketRuntimeExists: true as false }) },
  { label: "4. locale and market coupled", mutate: (r) => ({ ...r, localeSeparatedFromMarket: false as true }) },
  { label: "5. Austria implemented now", mutate: (r) => ({ ...r, AustriaImplementedNow: true as false }) },
  { label: "6. implicit First Contact selection allowed", mutate: (r) => ({ ...r, explicitModeSelectionRequired: false as true }) },
  { label: "7. environment flag uses truthy coercion", mutate: (r) => ({ ...r, exactTrueGateRequired: false as true }) },
  { label: "8. client bypass allowed", mutate: (r) => ({ ...r, clientBypassAllowed: true as false }) },
  { label: "9. fallback to another mode allowed", mutate: (r) => ({ ...r, fallbackToOtherModeAllowed: true as false }) },
  { label: "10. scenario alone sufficient", mutate: (r) => ({ ...r, scenarioAloneSufficient: true as false }) },
  { label: "11. scenario treated as evidence", mutate: (r) => ({ ...r, scenarioIsEvidence: true as false }) },
  { label: "12. unsupported market accepted", mutate: (r) => ({ ...r, unsupportedMarketRejected: false as true }) },
  { label: "13. jurisdiction client claim trusted", mutate: (r) => ({ ...r, jurisdictionClientClaimTrusted: true as false }) },
  { label: "14. market inferred from locale", mutate: (r) => ({ ...r, marketInferredFromLocaleAllowed: true as false }) },
  { label: "15. two model calls planned", mutate: (r) => ({ ...r, secondModelCallPlanned: true as false }) },
  { label: "16. direct OpenAI path planned", mutate: (r) => ({ ...r, separateDirectOpenAiPathPlanned: true as false }) },
  { label: "17. OCR used by First Contact", mutate: (r) => ({ ...r, ocrUsedByFirstContact: true as false }) },
  { label: "18. document extraction used by First Contact", mutate: (r) => ({ ...r, documentExtractionUsedByFirstContact: true as false }) },
  { label: "19. global SmartTalkResult migration planned", mutate: (r) => ({ ...r, globalSmartTalkResultMigrationPlanned: true as false }) },
  { label: "20. existing SmartTalkResult discarded", mutate: (r) => ({ ...r, existingSmartTalkResultPreserved: false as true }) },
  { label: "21. presentation allowed to invent facts", mutate: (r) => ({ ...r, presentationMayInventFacts: true as false }) },
  { label: "22. urgency preservation disabled", mutate: (r) => ({ ...r, urgencyPreservationRequired: false as true }) },
  { label: "23. warnings may be hidden", mutate: (r) => ({ ...r, warningPreservationRequired: false as true }) },
  { label: "24. deadline may be altered", mutate: (r) => ({ ...r, deadlinePreservationRequired: false as true }) },
  { label: "25. canWait allowed in high risk", mutate: (r) => ({ ...r, highRiskCanWaitSuppressed: false as true }) },
  { label: "26. filing instruction allowed", mutate: (r) => ({ ...r, filingInstructionForbidden: false as true }) },
  { label: "27. payment instruction allowed", mutate: (r) => ({ ...r, paymentInstructionForbidden: false as true }) },
  { label: "28. output may be verified/trusted", mutate: (r) => ({ ...r, verifiedClaimForbidden: false as true }) },
  { label: "29. document analyzed without content allowed", mutate: (r) => ({ ...r, documentAnalyzedWithoutContentClaimForbidden: false as true }) },
  { label: "30. document-mode bypass allowed", mutate: (r) => ({ ...r, freeDocumentInterpretationBypassBlocked: false as true }) },
  { label: "31. paid-mode bypass allowed", mutate: (r) => ({ ...r, paidModeBypassAllowed: true as false }) },
  { label: "32. persistence planned", mutate: (r) => ({ ...r, noPersistencePreserved: false as true }) },
  { label: "33. DNA read/write planned", mutate: (r) => ({ ...r, dnaReadPlanned: true as false }) },
  { label: "34. long-term memory planned", mutate: (r) => ({ ...r, longTermMemoryPlanned: true as false }) },
  { label: "35. desktop made primary", mutate: (r) => ({ ...r, desktopMadePrimary: true as false }) },
  { label: "36. mobile accessibility omitted", mutate: (r) => ({ ...r, screenReaderSemanticsRequired: false as true }) },
  { label: "37. global prompt change required", mutate: (r) => ({ ...r, globalPromptChangeRequired: true as false }) },
  { label: "38. unlimited arrays allowed", mutate: (r) => ({ ...r, boundedArraySizesRequired: false as true }) },
  { label: "39. unlimited text fields allowed", mutate: (r) => ({ ...r, boundedTextLengthsRequired: false as true }) },
  { label: "40. runtime and UI collapsed unsafely", mutate: (r) => ({ ...r, uiDeferredToLaterPhase: false as true }) },
  { label: "41. runtime implemented now", mutate: (r) => ({ ...r, runtimeImplementedNow: true as false }) },
  { label: "42. route modified now", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "43. prompt modified now", mutate: (r) => ({ ...r, promptModifiedNow: true as false }) },
  { label: "44. env flag added now", mutate: (r) => ({ ...r, environmentFlagAddedNow: true as false }) },
  { label: "45. UI modified now", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "46. model call performed", mutate: (r) => ({ ...r, modelCallPerformed: true as false }) },
  { label: "47. browser/mobile test falsely claimed", mutate: (r) => ({ ...r, mobileDeviceInvoked: true as false }) },
  { label: "48. controlled beta authorized", mutate: (r) => ({ ...r, controlledBetaAuthorizedNow: true as false }) },
  { label: "49. public beta authorized", mutate: (r) => ({ ...r, publicBetaAuthorizedNow: true as false }) },
  { label: "50. production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "51. go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "52. next phase not 8.12C", mutate: (r) => ({ ...r, readyForNextPhase: "8.13A" as "8.12C" }) },
  { label: "53. 8.3AC run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "54. tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },

  // Additional structural tamper cases hardening the checker against drift.
  { label: "allPassed forced true on incomplete result", mutate: (r) => ({ ...r, allPassed: true, firstContactImplementationPlanAccepted: false }) },
  { label: "existing files list incomplete", mutate: (r) => ({ ...r, exactExistingFilesRecommended: r.exactExistingFilesRecommended.slice(1) }) },
  { label: "new files list incomplete", mutate: (r) => ({ ...r, exactNewFilesRecommended: r.exactNewFilesRecommended.slice(1) }) },
  { label: "total files budget exceeds six", mutate: (r) => ({ ...r, maximumExistingFilesToModify: 4, maximumNewFilesToCreate: 4, maximumTotalFilesChanged: 8 }) },
  { label: "market option not B", mutate: (r) => ({ ...r, selectedMarketIntegrationOption: "C" }) },
  { label: "risk/mitigation length mismatch", mutate: (r) => ({ ...r, riskMitigations: r.riskMitigations.slice(1) }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
];

// ─── Exported plan runner ────────────────────────────────────────────────────

export async function runFirstContactModeImplementationPlan(): Promise<Result> {
  const failures: string[] = [];

  // ── Source acceptance: immutable committed snapshot (fully disclosed) ────
  const sourceGateDesignAccepted = verifySourceMarker(
    SOURCE_FILES.gateDesign.relPath,
    SOURCE_FILES.gateDesign.checkIdMarker,
    SOURCE_FILES.gateDesign.exportMarker,
  );
  const sourceUnifiedRegressionAccepted = verifySourceMarker(
    SOURCE_FILES.unifiedRegressionClosure.relPath,
    SOURCE_FILES.unifiedRegressionClosure.checkIdMarker,
    SOURCE_FILES.unifiedRegressionClosure.exportMarker,
  );
  const sourceTechnicalHardeningAccepted = verifySourceMarker(
    SOURCE_FILES.technicalHardeningAudit.relPath,
    SOURCE_FILES.technicalHardeningAudit.checkIdMarker,
    SOURCE_FILES.technicalHardeningAudit.exportMarker,
  );

  if (!sourceGateDesignAccepted) failures.push("8.12A immutable snapshot check failed");
  if (!sourceUnifiedRegressionAccepted) failures.push("8.11S immutable snapshot check failed");
  if (!sourceTechnicalHardeningAccepted) failures.push("8.11R immutable snapshot check failed");

  // ── Live architecture-grounding checks (static text reads only) ─────────
  const routeGroundTruthConfirmed = fileContainsAllMarkers(ARCHITECTURE_GROUND_TRUTHS.route.relPath, [
    ARCHITECTURE_GROUND_TRUTHS.route.minTextMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.maxTextMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.localeAllowlistMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.rateLimiterMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.exactTrueGateMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.bypassGuardMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.paidModeGuardMarker,
    ARCHITECTURE_GROUND_TRUTHS.route.textDocumentDisabledMarker,
  ]);
  const promptBuilderGroundTruthConfirmed = fileContainsAllMarkers(ARCHITECTURE_GROUND_TRUTHS.promptBuilder.relPath, [
    ARCHITECTURE_GROUND_TRUTHS.promptBuilder.localeMarker,
    ARCHITECTURE_GROUND_TRUTHS.promptBuilder.inputTypeMarker,
    ARCHITECTURE_GROUND_TRUTHS.promptBuilder.textSourceMarker,
  ]);
  const runSmartTalkGroundTruthConfirmed = fileContainsAllMarkers(ARCHITECTURE_GROUND_TRUTHS.runSmartTalk.relPath, [
    ARCHITECTURE_GROUND_TRUTHS.runSmartTalk.resultTypeMarker,
    ARCHITECTURE_GROUND_TRUTHS.runSmartTalk.urgencyMarker,
    ARCHITECTURE_GROUND_TRUTHS.runSmartTalk.entryPointMarker,
  ]);
  const rateLimiterGroundTruthConfirmed = fileContainsAllMarkers(ARCHITECTURE_GROUND_TRUTHS.rateLimiter.relPath, [
    ARCHITECTURE_GROUND_TRUTHS.rateLimiter.windowMarker,
  ]);
  const uiClientGroundTruthConfirmed = fileContainsAllMarkers(ARCHITECTURE_GROUND_TRUTHS.uiClient.relPath, [
    ARCHITECTURE_GROUND_TRUTHS.uiClient.modeTypeMarker,
  ]);

  if (!routeGroundTruthConfirmed) failures.push("route.ts architecture ground-truth markers not found");
  if (!promptBuilderGroundTruthConfirmed) failures.push("build-smart-talk-prompt.ts architecture ground-truth markers not found");
  if (!runSmartTalkGroundTruthConfirmed) failures.push("run-smart-talk.ts architecture ground-truth markers not found");
  if (!rateLimiterGroundTruthConfirmed) failures.push("smart-talk-rate-limiter.ts architecture ground-truth markers not found");
  if (!uiClientGroundTruthConfirmed) failures.push("SmartTalkClient.tsx architecture ground-truth markers not found");

  const allChecksPassed =
    sourceGateDesignAccepted &&
    sourceUnifiedRegressionAccepted &&
    sourceTechnicalHardeningAccepted &&
    routeGroundTruthConfirmed &&
    promptBuilderGroundTruthConfirmed &&
    runSmartTalkGroundTruthConfirmed &&
    rateLimiterGroundTruthConfirmed &&
    uiClientGroundTruthConfirmed;

  const sourceEvidence: string[] = [
    'PHASE 8.12A (commit bd6a89e, checkId "8.12A", export runFirstContactModeGateDesign) immutable snapshot marker present on disk: ' +
      `${sourceGateDesignAccepted}.`,
    'PHASE 8.11S (commit 477ab17, checkId "8.11S", export runUnifiedSmartTalkCrossModeRegressionClosure) immutable snapshot marker present on disk: ' +
      `${sourceUnifiedRegressionAccepted}.`,
    'PHASE 8.11R (commit b731c2c, checkId "8.11R", export runOcrRuntimeTechnicalDebtHardeningAudit) immutable snapshot marker present on disk: ' +
      `${sourceTechnicalHardeningAccepted}.`,
    "None of the three primary source functions were invoked live in this closure — see docblock SOURCE STRATEGY. Each was confirmed via a cheap static text read (checkId literal + exported function name) only. No `git` subprocess is invoked anywhere in this file.",
    `Live architecture ground-truth text reads (not memory) confirmed: route.ts=${routeGroundTruthConfirmed}, build-smart-talk-prompt.ts=${promptBuilderGroundTruthConfirmed}, run-smart-talk.ts=${runSmartTalkGroundTruthConfirmed}, smart-talk-rate-limiter.ts=${rateLimiterGroundTruthConfirmed}, SmartTalkClient.tsx=${uiClientGroundTruthConfirmed}.`,
  ];

  const inspectedFiles: string[] = [
    "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-mode-gate-design.ts (8.12A — accepted gate design; commit bd6a89e).",
    "app/api/smart-talk/route.ts (5 distinct `o.mode` dispatch branches: REAL_OCR_CONTROLLED_RUNTIME_MODE, OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE, FREE_QA_PUBLIC_BETA_MODE, TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE, and a `photo_ocr`-prefixed catch-all covering PHOTO_OCR_CONTROLLED_RUNTIME_MODE; plus one internal-guard-gated default path with no client-supplied mode field; MIN_TEXT=8, MAX_TEXT=12000; ALLOWED_LOCALES=[sk,de,en]; env-flag pattern `process.env[FLAG] === \"true\"` exact match; rate limiting runs first, before body parsing, at the very top of POST()).",
    "app/smart-talk/SmartTalkClient.tsx (SmartTalkUiMode = \"question\"|\"text\"|\"photo\"; mode selector is a `role=\"tablist\"` of button chips calling `setMode(m)`; current labels \"Mám otázku\"/\"Mám text listu\"/\"Odfotiť dokument\").",
    "lib/vaylo/smart-talk/run-smart-talk.ts (SmartTalkResult type; runSmartTalk({text, locale, inputType, source?}) already accepts an optional `source` param of type SmartTalkTextSource — no signature change needed to pass a new source value once the type union is extended).",
    "lib/vaylo/smart-talk/build-smart-talk-prompt.ts (SmartTalkLocale=\"sk\"|\"de\"|\"en\"; SmartTalkInputType=\"text\"|\"question\"; SmartTalkTextSource=\"photo_ocr\" — single-value union; deriveSmartTalkReasoningProtocol maps inputType=\"question\" to \"bureaucratic_guide\" or \"educational_explainer\", inputType=\"text\" to \"strict_document\").",
    "Smart Talk request/input types: SmartTalkInputType, SmartTalkTextSource (both in build-smart-talk-prompt.ts).",
    "Smart Talk response/result types: SmartTalkResult, SmartTalkUrgency, SmartTalkConfidenceLevel, SmartTalkConsequencePhase, SmartTalkDocumentQuality, SmartTalkDocumentKind, SmartTalkDomain, SmartTalkPaymentChannel, SmartTalkProceduralState, SmartTalkLegalSeverity (all in run-smart-talk.ts).",
    "Current urgency type: SmartTalkUrgency = \"low\"|\"medium\"|\"high\"|\"unknown\".",
    "Current warning structure: `warnings: string[]` on SmartTalkResult, sanitized/bounded via parseStringArray + sanitizeStringArrayFields.",
    "Current deadline structure: `deadlines: string[]` on SmartTalkResult, filtered via filterArrayByProceduralCalendarGrounding + calendar-token/cue-proximity checks.",
    "Current confidence/procedural-state structures: confidenceLevel (low/medium/high), proceduralState (informational/action_required/response_possible/decision_issued/payment_required/deadline_active/unknown).",
    "Current disclaimer structures: route-level `disclaimers`/`publicMeta`/`textDocumentMeta` objects with `legalDisclaimerRequired`, `privacyDisclaimerRequired`, and literal disclaimer strings (e.g. FREE_QA_PUBLIC_BETA_MODE branch).",
    "Current locale types and allowlists: SmartTalkLocale (\"sk\"|\"de\"|\"en\") + route-level `ALLOWED_LOCALES` Set.",
    "Current mode constants: FREE_QA_INTERNAL_RUNTIME_MODE, FREE_QA_PUBLIC_BETA_MODE, TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE, PHOTO_OCR_CONTROLLED_RUNTIME_MODE, REAL_OCR_CONTROLLED_RUNTIME_MODE, OCR_TO_SMART_TALK_HANDOFF_CONTROLLED_RUNTIME_MODE.",
    "Current operation constant precedent: OCR_CONTROLLED_REASONING_OPERATION_VALUE = \"controlled_reasoning\" — an internal `operation` field that only SELECTS an intent inside an already-enabled branch; it can never authorize by itself. Direct precedent for how First Contact's own mode selection must work: selection is not authorization.",
    "Current public metadata contract: FREE_QA_PUBLIC_BETA_MODE branch response shape `{ ok, mode, context: \"anonymous\", result, publicMeta: {...disclaimers...} }`.",
    "Current Text Document metadata contract: TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE branch — disabled-flag response is `textDocumentModeBlockedResponse(\"text_document_mode_disabled\", 403)`; enabled branch validates context/inputType/text length before calling runSmartTalk.",
    "Current Photo/OCR metadata contract: `sourceKind: \"ocr_derived_text\"`, `trustLevel: \"untrusted_derived\"`, quality/warning/high-risk-token metadata, `disclaimers: buildOcrToSmartTalkHandoffDisclaimers()`.",
    "Existing gate modules used before route execution: `getRuntimeSmartTalkRateLimiter()` + `resolveSmartTalkRateLimitClientIp(req)` (rate limiting, runs first in POST()); `evaluateOcrControlledReasoningGate` (OCR reasoning gate precedent).",
    "Existing pure transformation/presentation utilities: `detectTextDocumentBypassRequired(text)` (pure, deterministic multi-signal score ≥3 heuristic — the existing document-bypass guard); `detectClientPaidDocumentModeActivation(body)` (pure, field-based, deny-by-default — the existing paid-document-mode boundary detector); `buildOcrReasoningModelInputMeta` (existing input-metadata builder precedent).",
    "Current mobile UI structure: mode selector rendered as `role=\"tablist\"` of 44px-min-height button chips; no First Contact entry exists yet.",
    "Current mode selector implementation: `modeChip(m, label)` closure calling `setMode(m)` on click; `SmartTalkUiMode` is a plain string union with no server round-trip for mode switching itself.",
    "Current server/client type-sharing pattern: types are defined once in `build-smart-talk-prompt.ts` / `run-smart-talk.ts` and imported by both `route.ts` (server) and (indirectly, via fetch/JSON) `SmartTalkClient.tsx` (client) — no duplicate parallel type definitions.",
    "Current environment-flag naming pattern: `SMART_TALK_<FEATURE>[_MODE]_ENABLED`, checked via exact `process.env[FLAG] === \"true\"` (e.g. SMART_TALK_FREE_QA_PUBLIC_ENABLED, SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED, SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED, SMART_TALK_REAL_OCR_EXTRACTION_ENABLED, SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED, SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED).",
    "Current no-persistence enforcement: no DB/Storage/DNA write call exists anywhere in the Smart Talk request path; every mode's response metadata explicitly states `persistenceStillBlocked: true` / equivalent.",
    "Current paid-document-mode boundary: `detectClientPaidDocumentModeActivation` + `PAID_DOC_MODE_FIELDS`/`ENTITLEMENT_FIELDS`/`PAID_DOC_ACTIVATING_STRINGS` — deny-by-default, inspects only request-body control fields, never user text content.",
    "PHASE 8.11S unified regression closure (commit 477ab17) — accepted via immutable snapshot marker, not re-executed live.",
    "Current repository status: `git status --short` clean (only this closure's own new file after creation); HEAD confirmed at bd6a89e before any edit.",
  ];

  const currentArchitectureFindings: string[] = [
    "No market, jurisdiction, or region type or field exists anywhere in the current Smart Talk runtime — confirmed live via static text read of build-smart-talk-prompt.ts and route.ts (no match for any such identifier).",
    "SmartTalkTextSource is currently a single-value union (`\"photo_ocr\"`), making it a bounded, additive type to extend rather than a general-purpose open string — extending it to `\"photo_ocr\" | \"first_contact\"` is a small, type-checked, backward-compatible change.",
    "`runSmartTalk()` already accepts an optional `source?: SmartTalkTextSource` parameter in its public signature — no function-signature change is required to pass a First Contact source discriminator once the union is extended; only build-smart-talk-prompt.ts's type and its (currently source-unaware) prompt-construction logic need a small, mode-conditional addition.",
    "`deriveSmartTalkReasoningProtocol` currently ignores `source` entirely for protocol selection (it only inspects `inputType`) — First Contact reusing `inputType: \"question\"` will map to the existing \"bureaucratic_guide\"/\"educational_explainer\" protocols without any protocol-selection code change; only the prompt text itself needs a mode-conditional block analogous to the existing `PHOTO_OCR_EPISTEMIC` injection.",
    "Rate limiting in the current route runs unconditionally at the very top of `POST()`, before any body parsing or mode dispatch — this is a load-bearing existing convention that the First Contact gate ordering must preserve rather than the abstract 10-step order suggested generically; this plan documents and preserves that deviation explicitly.",
    "The disabled-flag response convention is consistent across modes: HTTP 403 with a `<mode>_disabled`-shaped code (e.g. `text_document_mode_disabled`) — First Contact's future disabled response (`first_contact_mode_disabled`) should follow the identical convention.",
  ];

  const implementationAlternatives: string[] = [
    "Request-contract Option A (mode+text+locale only, server-fixed market=\"DE\"): safest, smallest patch, zero client market input; but does not exercise the future multi-market client-input path at all, deferring that testing surface entirely to a later phase.",
    "Request-contract Option B (mode+text+locale+market, market validated against a strict server-owned allowlist of exactly [\"DE\"]): only marginally larger than Option A, but exercises the real future client-input shape (client MAY send market) while the server retains full authority — client never controls jurisdictional truth merely by sending a string, since only \"DE\" is accepted and jurisdiction/region are not yet accepted fields at all in this patch.",
    "Request-contract Option C (mode+text+locale+market+jurisdiction+region as complete new runtime axes): forces an uncontrolled, premature cross-system migration (three brand-new runtime axes touching types, validation, prompt, and response schema simultaneously) for a first minimal patch — rejected as unsafe scope creep.",
    "Source-strategy Option 1 (dedicated `\"first_contact\"` source discriminator, extending SmartTalkTextSource): bounded additive type change, gives the prompt builder a precise, type-safe hook for a mode-conditional instruction block, and gives the response layer a precise signal for which presentation mapper to run — selected.",
    "Source-strategy Option 2 (reuse an existing source value and carry First Contact only in route/presentation metadata): avoids any build-smart-talk-prompt.ts change at all, but leaves the model prompt with zero First Contact-specific instructions (no first-time-orientation framing, no terminology-explanation instruction) unless a parallel, harder-to-trace mechanism is invented — rejected as under-specifying the prompt.",
    "Source-strategy Option 3 (add a new SmartTalkInputType): incorrectly conflates \"how the text arrived\" (source) with \"what kind of input this is\" (inputType, which already correctly distinguishes text vs question) — rejected as a type-modeling error.",
    "Presentation-generation Option A (model returns new structured First Contact fields directly): risks silent schema inflation of the governed model contract and duplicates governance logic inside the model call — rejected.",
    "Presentation-generation Option B (model returns only the existing SmartTalkResult; deterministic code maps it into First Contact fields): safest for invariants, but some First Contact concepts (e.g. a bounded first-step action, help-boundary level) may not be cleanly derivable from existing fields alone without fragile prose parsing.",
    "Presentation-generation Option C (hybrid: model returns existing SmartTalkResult; deterministic mapper fills what it safely can; unmappable fields remain absent or are derived only from already-governed text, never from fragile regex parsing of prose) — selected as the only option that avoids both schema inflation and fragile parsing while still producing a useful presentation.",
    "Validator-file Option (separate final-validator file vs combined with the mapper): combining validateFirstContactPresentation() into the same file as buildFirstContactPresentation() keeps both pure functions independently unit-testable while holding the next patch to exactly 3 new files instead of 4 — selected to preserve the 6-file total budget.",
  ];

  const selectedArchitecture: string[] = [
    "Route mode: `first_contact_controlled_runtime` (new `o.mode` dispatch branch, following the exact same pattern as TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE/FREE_QA_PUBLIC_BETA_MODE).",
    "Environment flag: `SMART_TALK_FIRST_CONTACT_MODE_ENABLED`, gated by exact `process.env[FLAG] === \"true\"`, matching every existing Smart Talk env-flag convention.",
    "Request contract: Option B — {mode, text, locale, market} in the first patch; jurisdiction and region are NOT accepted as request fields yet and are computed server-side only.",
    "Market integration: server-owned allowlist `Set([\"DE\"])`; client MAY send `market: \"DE\"` but the server independently validates it — the client's string never becomes jurisdictional truth by itself.",
    "Source strategy: extend `SmartTalkTextSource` with `\"first_contact\"`; reuse existing `inputType: \"question\"`; no new `SmartTalkInputType` value; no new model-call function.",
    "Model call budget: exactly one `runSmartTalk()` call per request, reusing the existing entry point verbatim; no direct OpenAI path; no second model call.",
    "Presentation generation: Option C (hybrid) — governed SmartTalkResult is the primary semantic result; a pure, deterministic `build-first-contact-presentation.ts` module derives a bounded `FirstContactPresentation` object from it; a combined `validateFirstContactPresentation()` in the same file performs the final safety check before the response is returned.",
    "Response shape: `{ ok, mode: \"first_contact_controlled_runtime\", context: {...}, result: SmartTalkResult, firstContactMeta: FirstContactPresentation, disclaimers/publicMeta-style flags }` — the original governed SmartTalkResult is never discarded or migrated.",
  ];

  const routeContractPlan: string[] = [
    "New branch: `if (o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE) { ... }`, inserted alongside the existing 5 mode branches, following the same structural template as TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE.",
    "Disabled-flag response: HTTP 403, `{ ok: false, code: \"first_contact_mode_disabled\" }`, matching the existing `text_document_mode_disabled` convention exactly (status code and shape).",
    "Malformed-request responses (invalid JSON, missing/short/long text, invalid locale/market) reuse the existing `badRequest(code)` helper pattern at HTTP 400, exactly like every other mode.",
    "Gate-denial responses that are policy routing decisions rather than malformed requests (document-mode-required, photo-ocr-mode-required, paid-boundary, high-risk-requires-escalation, insufficient-context) return HTTP 200 with `{ ok: false, code, reason, recommendedMode? }` — informational routing, not a client error — mirroring how the OCR handoff branch reports structured blocked outcomes rather than HTTP error codes for valid-but-not-actionable requests.",
    "Rate-limit response is unchanged and untouched: the existing top-of-`POST()` rate limiter continues to run before any mode dispatch, including before the First Contact branch is ever reached — this preserves the current, load-bearing route ordering exactly.",
  ];

  const requestContractPlan: string[] = [
    "Fields in the first patch: `mode` (required, exact string), `text` (required, meaningful free text), `locale` (required, one of the existing ALLOWED_LOCALES), `market` (required in the request but server-validated against a one-element allowlist), `scenario` (optional, server-validated against a fixed allowlist).",
    "Fields explicitly deferred: `jurisdiction`, `region` — not accepted as request fields in the first patch; `context.jurisdictionStatus` in the response is computed as `\"server_bounded\"` (since market=\"DE\" is the only supported market) rather than accepted from the client.",
    "Input limits: reuse existing `MIN_TEXT = 8` / `MAX_TEXT = 12_000` verbatim — no new numeric limit is invented. A mobile-friendly *soft* UI-side recommendation (not a hard server rejection) of roughly 1,500–2,000 characters may be recorded for the later UI phase, but the server continues to accept up to MAX_TEXT.",
    "Whitespace-only input is rejected via the same `.trim()` + length-check pattern already used by every other mode; control characters are handled by the same normalization the existing modes rely on (no new sanitizer required).",
    "Scenario-only submission (no meaningful free text) must be rejected with `first_contact_insufficient_context` — a scenario identifier alone never satisfies `meaningfulTextRequired`.",
    "Prompt-injection content in `text` is handled exactly like every other mode: treated as untrusted user text passed to the model inside the existing prompt-construction boundary, never interpreted as a control instruction by the route or the gate.",
    "Unsupported locale behavior: reuse the existing `badRequest(\"invalid_locale\")` code and HTTP 400 status. Unsupported market behavior: new `badRequest(\"first_contact_market_unsupported\")` at HTTP 400, following the identical existing pattern.",
  ];

  const marketIntegrationAnalysis: string[] = [
    "OPTION A (mode+text+locale only, server-fixed market): safest and smallest, but does not exercise any client-supplied market input, deferring even the simplest multi-market request-shape testing.",
    "OPTION B (mode+text+locale+market, market validated against a strict server-owned allowlist of [\"DE\"]) — SELECTED. It is only marginally larger than Option A, exercises the real future client-input shape safely, and the server retains full authority: the client may request `market: \"DE\"`, but any other value is rejected, and jurisdiction/region remain out of the request contract entirely (so they cannot be claimed by the client at all in this patch).",
    "OPTION C (market+jurisdiction+region as three complete new runtime axes): rejected for the first patch — this would force an uncontrolled cross-system migration (types, validation, prompt, response schema all touched simultaneously) with a testing burden far beyond a minimal patch, and materially raises the risk of premature locale/market coupling.",
    "Safety comparison: A ≈ B > C. Future-migration-cost comparison: B < C (B's allowlist can grow to include \"AT\" later without any request-shape change; C would require redesigning three axes at once). Client-trust-boundary comparison: A and B are equivalent (server always validates); C is materially riskier if jurisdiction/region were ever trusted from the client without independent verification — which this plan explicitly forbids regardless of option.",
    "Patch-size and testing-burden comparison: A < B < C. B remains small enough to fit inside the 6-file total budget; C would not.",
    "Final decision: OPTION B. If jurisdiction is not independently validated (which it is not, in the first patch), it remains `\"server_bounded\"` to the single supported market (\"DE\") rather than accepted, inferred, or fabricated from any client-supplied string.",
  ];

  const scenarioContractPlan: string[] = [
    "Scenario is OPTIONAL in the request contract.",
    "Scenario is server-validated against a fixed allowlist (10 candidate identifiers: first_job, first_housing, first_official_letter, health_insurance, taxes_or_tax_id, education_or_training, moving_or_registration, family_administration, residence_or_work, other) — any other value is rejected or normalized to \"other\", never silently accepted as free-form.",
    "Scenario is a presentation/routing hint ONLY — it may influence which preparation-item category hints are offered, but it never becomes factual evidence.",
    "Scenario alone (without meaningful free text) never authorizes model execution — `first_contact_insufficient_context` is returned instead.",
    "Scenario never determines exact authority, exact deadline, legal eligibility, required form, required payment, or verified jurisdiction — those remain governed exclusively by the existing SmartTalkResult produced from the user's actual text.",
  ];

  const runtimeGatePlan: string[] = [
    "Future file: `lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts` — a pure, deterministic, synchronous function with no I/O.",
    "Conceptual input: {enabled, explicitlySelected, text, locale, market, scenario, documentInterpretationRequested, photoOrFilePresent, paidDocumentBoundaryTriggered, persistenceRequested}.",
    "Conceptual output: {allowed, code, reason, normalizedIntent, normalizedLocale, normalizedMarket, normalizedScenario, requiredWarnings, recommendedMode, trustLevel, evidenceLimitations} — matching the conceptual gate output fields already defined in 8.12A.",
    "The gate must not call a model, call OCR, access DB/Storage/DNA, inspect identity, infer market from language, authorize public runtime, or mutate environment — it is a pure classification/validation function only.",
    "Gate ordering, preserving the existing route's load-bearing convention (rate limiting first, before body parsing): (1) existing top-of-POST rate limit [unchanged, already runs before any mode dispatch], (2) parse and bound the JSON body, (3) exact `SMART_TALK_FIRST_CONTACT_MODE_ENABLED === \"true\"` feature-flag check, (4) explicit `o.mode === \"first_contact_controlled_runtime\"` validation, (5) document/paid-mode boundary validation (reusing `detectTextDocumentBypassRequired` + `detectClientPaidDocumentModeActivation`), (6) normalize server-owned context (locale from ALLOWED_LOCALES, market from the DE-only allowlist, scenario from its own allowlist), (7) invoke `runSmartTalk()` exactly once, (8) deterministic presentation mapping, (9) final safety validator, (10) return response.",
    "This ordering deliberately differs from a naive \"rate-limit after body parsing\" ordering: the current route already rate-limits unconditionally at the very top of `POST()`, before touching the body at all, and this plan preserves that exact existing behavior rather than reordering it.",
  ];

  const runSmartTalkReusePlan: string[] = [
    "`runSmartTalk({ text, locale, inputType: \"question\", source: \"first_contact\" })` — the exact same entry point every other question-shaped mode already uses, with only the new `source` value added.",
    "No change to `runSmartTalk()`'s function signature, return type, or internal normalization logic (`normalizeParsedObject`, `fallbackInvalidJson`) is required — `source` is already an accepted optional parameter.",
    "Maximum one model call per First Contact request — identical budget to every existing mode.",
  ];

  const sourceDiscriminatorPlan: string[] = [
    "Extend `SmartTalkTextSource` in `build-smart-talk-prompt.ts` from `\"photo_ocr\"` to `\"photo_ocr\" | \"first_contact\"` — a small, additive, type-checked change.",
    "`deriveSmartTalkReasoningProtocol` requires no change: it already ignores `source` and derives protocol from `inputType` alone; First Contact's `inputType: \"question\"` will correctly map to the existing bureaucratic_guide/educational_explainer protocols.",
    "The only prompt-construction change required is a small, mode-conditional instruction block (analogous to the existing `PHOTO_OCR_EPISTEMIC` block), injected only when `source === \"first_contact\"` — it must never alter the system/user prompt for any other source or absent-source call.",
  ];

  const promptChangePlan: string[] = [
    "The First Contact prompt addition must specify: first-time orientation framing; that the user may not know the official process name; strict preservation of facts/urgency/warnings from the underlying reasoning; a first actionable orientation step; preparation items with uncertainty categories (likely helpful / may be required / requires verification); a \"what can wait\" concept only when demonstrably safe; a help-escalation boundary; no document interpretation without provided contents; no market/jurisdiction fabrication; no youth slang/persona; no exact-deadline invention; no paid-mode bypass.",
    "The prompt addition is strictly mode-conditional (gated on `source === \"first_contact\"`) and must not alter Free Q&A, Text Document, or Photo/OCR prompt behavior in any way — `globalPromptChangeRequired: false`.",
    "Exact prompt wording is deferred to the implementation patch itself (8.12C); this plan defines only the required semantic content and the mode-conditional injection boundary, not the final prompt string.",
  ];

  const responseWrapperPlan: string[] = [
    "Route-level response shape: `{ ok: true, mode: \"first_contact_controlled_runtime\", context: { locale, market, jurisdictionStatus: \"server_bounded\"|\"unresolved\", scenario: string|null }, result: SmartTalkResult, firstContactMeta: FirstContactPresentation, disclaimers: {...} }` — modeled directly on the existing FREE_QA_PUBLIC_BETA_MODE/TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE wrapper convention.",
    "The original governed `SmartTalkResult` (`result`) is always present and unmodified — it is never discarded, migrated, or replaced by `firstContactMeta`.",
    "`firstContactMeta` is a bounded, additive object; no field of the existing `SmartTalkResult` type is renamed, removed, or reinterpreted.",
  ];

  const presentationMapperPlan: string[] = [
    "Future file: `lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts`, exporting a pure function `buildFirstContactPresentation(result: SmartTalkResult, context: NormalizedFirstContactContext): FirstContactPresentation`.",
    "It must enforce: warnings preserved verbatim from `result.warnings`; urgency preserved verbatim from `result.urgency`; deadlines preserved verbatim in the core `result.deadlines` (never rewritten inside `firstContactMeta`); `canWait` suppressed (set to `null`) whenever urgency is `\"high\"` or `\"unknown\"`; preparation-item count bounded (e.g. max 8); `firstStep.action` never empty; no verified/trusted-output claim; no unsupported jurisdiction claim beyond the server-bounded market context; no official-action, payment, or filing claim ever placed in `firstStep` or `preparationItems`; `evidenceLimitations` always retained/non-empty.",
    "Bounded types (proposed, to be finalized in 8.12C): `FirstContactPreparationItem { label: string (<=160 chars); requirementLevel: \"likely_helpful\"|\"may_be_required\"|\"requires_verification\" }`; `FirstContactFirstStep { action: string (<=240 chars); boundary: \"orientation\"|\"verification\"|\"official_contact\"|\"professional_help\"|\"emergency_help\" }`; `FirstContactHelpBoundary { level: \"none\"|\"official\"|\"professional\"|\"emergency\"; reason: string|null }`; `FirstContactPresentation { situationSummary: string (<=1200 chars); firstStep: FirstContactFirstStep; preparationItems: FirstContactPreparationItem[] (<=8 items); canWait: string[]|null (<=6 items); helpBoundary: FirstContactHelpBoundary; evidenceLimitations: string[] (<=10 items); trustLevel: \"untrusted\" }`.",
    "When safe mapping is impossible (e.g. the governed result is too sparse to derive a non-empty `firstStep.action`), the module fails closed and the route returns a stable `first_contact_presentation_safety_failure` response rather than fabricating any missing content — content is never invented to fill a gap.",
  ];

  const presentationValidatorPlan: string[] = [
    "Combined into the same file as the mapper (`build-first-contact-presentation.ts`), exporting a second pure function `validateFirstContactPresentation(original: SmartTalkResult, presentation: FirstContactPresentation): { valid: boolean; violations: string[] }` — kept in one file (not a separate module) to preserve the 6-file total patch budget while remaining independently unit-testable.",
    "It must reject: trusted/verified output; changed urgency (any mismatch vs `original.urgency`); hidden warnings (any `original.warnings` entry not represented); changed deadline content (any mismatch vs `original.deadlines`); `canWait` present under high/unknown risk; unsupported market/jurisdiction claim; exact-authority claim without evidence; filing/payment/signing instruction; a claim that a document was analyzed when no document content was provided; any persistence/DNA claim; process-complete claim; application-submitted claim.",
    "On any violation, the route must fail closed (never return the unsafe presentation) — this validator is the final safety layer, run strictly after the deterministic mapper and before the response is serialized.",
  ];

  const documentBoundaryPlan: string[] = [
    "Reuses the existing `detectTextDocumentBypassRequired(text)` heuristic (pure, deterministic, already used by the Text Document branch) to detect pasted authority letters / copied document text — no duplicate detection logic is written.",
    "Explicit \"explain this document\" requests, or any request accompanied by photo/file data, are routed to Text Document or Photo/OCR mode respectively via `recommendedMode` in the gate output — First Contact never processes document content directly.",
    "When the user claims a document exists but its contents were not provided, First Contact may explain what information to look for (e.g. sender name, reference number, a date) but must never claim the document was analyzed (`documentAnalyzedWithoutContentClaimForbidden: true`, enforced by the final validator).",
    "General life-situation orientation (no specific document referenced) may remain in First Contact; specific pasted or photographed document interpretation must not.",
  ];

  const paidBoundaryPlan: string[] = [
    "Reuses the existing `detectClientPaidDocumentModeActivation(body)` function (pure, field-based, deny-by-default, already used for the paid-document boundary) — no duplicate security logic is written.",
    "First Contact must never be usable as a free path to a full specific-document explanation; any paid-document-mode-activation signal in the request body causes the First Contact branch to defer to the existing paid-document boundary response, unchanged.",
    "General orientation about a life situation (no specific document) remains free and available in First Contact; a specific document's full interpretation remains behind the existing paid boundary regardless of which mode the client requests.",
  ];

  const highRiskPlan: string[] = [
    "High-risk suppression is planned across three layers, matching 8.12A's preferred design: (A) the mode-conditional prompt establishes the semantic requirement (preserve urgency, no invented safe delay, escalate for high/unknown risk); (B) the deterministic presentation mapper suppresses unsafe presentation fields mechanically (sets `canWait: null` whenever `result.urgency` is `\"high\"` or `\"unknown\"`, bounds `firstStep.boundary` to non-action values); (C) the final validator rejects any invariant violation that slipped through (e.g. `canWait` present despite high/unknown urgency) as a last-resort mechanical check — the plan does not rely on prompt compliance alone.",
    "For high or unknown risk: urgency remains high/unknown (never downgraded by presentation); warning prominence increases (warnings surfaced first in `firstContactMeta`); `canWait` is absent; `firstStep` remains a bounded orientation/verification/escalation action only; official/professional/emergency help-boundary is explicit; no exact deadline is invented; no legal advice is generated; no filing/payment/action is authorized.",
  ];

  const privacyPlan: string[] = [
    "Standalone First Contact remains anonymous and ephemeral: no authentication, no DB write, no Storage write, no local/session storage, no DNA read, no DNA write, no profile mutation, no long-term conversation memory — identical to every other current Smart Talk mode.",
    "Future DNA embedding must use a separate adapter/gate, designed in a later, dedicated phase — this plan does not make the standalone runtime aware of subscription billing and does not implement bundled DNA behavior now.",
  ];

  const mobileUiPlan: string[] = [
    "Future menu order (not implemented now): 1. Opýtať sa, 2. Prvý kontakt, 3. Vysvetliť text, 4. Odfotiť dokument — inserted into the existing `role=\"tablist\"` chip row alongside the current \"Mám otázku\"/\"Mám text listu\"/\"Odfotiť dokument\" chips, following the exact same `modeChip()` pattern (44px min height, no hover dependency).",
    "Entry question (conceptual, not translated/implemented now): \"Čo riešiš prvýkrát?\".",
    "Scenario cards: optional, compact-grid or vertical arrangement, large touch targets, no hover dependency, no scenario-only submission; a selected scenario may prefill context but meaningful text remains required regardless.",
    "Input: mobile-keyboard-safe, one primary submit action, visible privacy/legal disclaimers, visible mode-boundary messaging when document interpretation is required.",
    "Response: progressive but never safety-hiding sections; critical warnings visible by default (never collapsed); no horizontal scrolling; screen-reader-semantic headings.",
    "This entire UI plan is recorded for a later, dedicated phase (8.12E) — `uiImplementedNow: false`.",
  ];

  const localizationPlan: string[] = [
    "Semantic fields, UI labels, prompt instructions, and model output language are kept as four separate concerns — none hardcoded together.",
    "Initial validation targets remain Slovak and German only, matching the existing `SmartTalkLocale = \"sk\"|\"de\"|\"en\"` type — this patch does not expand locale support.",
    "Future locale set (de, sk, hu, pl, cs, ro, bg, uk, tr, ru) is recorded as a later, separate multilingual-architecture branch, not implemented now; First Contact must not hardcode Slovak-only semantic keys anywhere in its future implementation.",
  ];

  const GermanyAustriaSeparationPlan: string[] = [
    "First implementation target market is Germany (`DE`) only; a future `SmartTalkMarket` type (e.g. `type SmartTalkMarket = \"DE\"`) should live alongside the existing locale/input-type types (in or near build-smart-talk-prompt.ts / a small dedicated market-types module), never mixed into `SmartTalkLocale` itself.",
    "Austria (`AT`) is explicitly future-only and NOT implemented now; when it is implemented, it must receive its own separate authority knowledge, process rules, regional rules, and regression pack — German process assumptions must never be applied to Austria and Austrian assumptions must never be applied to Germany.",
    "Market-specific knowledge must not be placed inside presentation/UI modules — it belongs in a future, dedicated market-knowledge layer, kept out of `build-first-contact-presentation.ts` entirely.",
  ];

  const fileModificationPlan: string[] = [
    `Existing files recommended for modification in 8.12C (${EXACT_EXISTING_FILES_RECOMMENDED.length} files, ≤3): ${EXACT_EXISTING_FILES_RECOMMENDED.join(", ")}.`,
    `New files recommended for creation in 8.12C (${EXACT_NEW_FILES_RECOMMENDED.length} files, ≤3): ${EXACT_NEW_FILES_RECOMMENDED.join(", ")}.`,
    "Total recommended changed files for 8.12C: 5 (2 existing + 3 new), within the 6-file total budget with one file of margin.",
    "`lib/vaylo/smart-talk/run-smart-talk.ts` is explicitly NOT recommended for modification: `runSmartTalk()` already accepts an optional `source` parameter, so no signature or normalization change is needed there — this avoids any global `SmartTalkResult` schema migration.",
    "`app/smart-talk/SmartTalkClient.tsx` is explicitly deferred to a later phase (8.12E) — PLAN A (runtime-only patch first) is selected over PLAN B (runtime+UI combined), per the explicit preference and to keep 8.12C's file count minimal and independently reviewable.",
  ];

  const validationPlan: string[] = [
    "Static patch audit (8.12C's own audit file) must verify: the new route mode is added only behind the exact `SMART_TALK_FIRST_CONTACT_MODE_ENABLED === \"true\"` flag; at most one `runSmartTalk()` call exists on the First Contact path; no direct OpenAI fetch exists on that path; no persistence call exists; no other mode's branch, response shape, or prompt text was altered; market/locale separation is preserved in the new types; document/paid boundaries are reused, not duplicated; presentation invariants (urgency/warnings/deadlines preserved, canWait suppressed for high/unknown risk) hold statically.",
    "Disabled API closure (8.12D) must test at least: flag absent, false, FALSE, TRUE, 1, yes, whitespace-wrapped \" true \", empty string, and \"enabled\" — every case expects HTTP 403, code `first_contact_mode_disabled`, zero model calls, zero OCR, zero persistence.",
    "Enabled synthetic API closure (8.12D) must test at least: (1) normal low-risk first-time situation, (2) medium-risk unfamiliar authority process, (3) high/unknown-risk situation, (4) document-mode-required request, (5) paid-document-bypass attempt, (6) unsupported market, (7) unsupported locale, (8) prompt-injection attempt, (9) scenario-only input, (10) missing meaningful text — asserting exact mode selected, at most one model call, zero OCR/document extraction, untrusted result, preserved core urgency/warnings, First Contact metadata present only in this mode, canWait suppressed for high/unknown risk, no filing/payment/advice, no persistence, no cross-mode pollution.",
    "Cross-mode regression after the patch must confirm: Free Q&A unchanged, Text Document unchanged, Photo/OCR unchanged, First Contact metadata absent from all other modes' responses, and other modes' metadata absent from First Contact's response.",
    "Android Chrome and iOS Safari validation are explicitly deferred to a later phase (8.12F) — not performed now and not claimed to have been performed.",
  ];

  const phaseSequence: string[] = [
    "8.12C — Minimal First Contact Controlled Runtime Patch (route + prompt-builder change; new first-contact/ gate + presentation modules; static patch audit).",
    "8.12D — Disabled + Enabled Synthetic API Closure (flag-variant matrix; 10 synthetic enabled-path scenarios; cross-mode regression rerun).",
    "8.12E — Minimal Mobile-First UI Patch (menu entry, scenario cards, entry question — SmartTalkClient.tsx only).",
    "8.12F — Browser + Android/iOS Validation (real device/browser validation, deferred from all prior phases).",
    "8.12G — First Contact Internal Readiness Closure (final internal go/no-go before any beta authorization).",
    "This compact 5-phase sequence was assessed against the longer 6-phase alternative (separate 8.12C plan/patch, separate disabled/enabled closures, separate UI/validation/readiness phases) and found unnecessarily long for the actual risk surface — the disabled and enabled closures share the same fixture setup and are safely combinable into one phase (8.12D), matching the compaction already reasoned about for the OCR branch's own closures where safe. No further consolidation is proposed beyond this 5-phase sequence: combining the runtime patch with either the closures or the UI phase would violate PLAN A (runtime-only first) and the explicit unsafe-phase-collapse prohibition.",
  ];

  const implementationRisks: string[] = [
    "1. Accidental global prompt drift affecting Free Q&A/Text Document/Photo-OCR.",
    "2. SmartTalkResult schema inflation (adding First Contact fields directly onto the core type).",
    "3. First Contact metadata leaking into other modes' responses.",
    "4. Locale/market coupling (treating locale as market or inferring market from language).",
    "5. Client-controlled jurisdiction claims (trusting a client-supplied jurisdiction/region string).",
    "6. Document-mode paid bypass (First Contact used as a free path to a paid document explanation).",
    "7. Unsafe canWait generation (inventing a safe delay period, or allowing canWait under high/unknown risk).",
    "8. Hidden high-risk warnings (presentation mapper dropping or de-prioritizing warnings).",
    "9. Second model-call temptation (splitting presentation generation into a second call for convenience).",
    "10. Scenario labels treated as factual evidence (authority, deadline, eligibility, form, payment, jurisdiction).",
    "11. Route complexity growth (First Contact branch becoming entangled with existing branches).",
    "12. Mobile UI overload (too many scenario cards, too much text, hidden critical content).",
    "13. Premature multilingual expansion (implementing all 10 future locales instead of validating sk/de first).",
    "14. Future DE/AT rule mixing (applying German process assumptions to Austria or vice versa).",
    "15. Accidental DNA/persistence coupling (any implicit write path introduced during the runtime patch).",
  ];

  const riskMitigations: string[] = [
    "1. Mitigation: the First Contact prompt addition is strictly gated on `source === \"first_contact\"` and reviewed in 8.12C's static patch audit to confirm zero prompt-text diff for any other source/mode.",
    "2. Mitigation: `SmartTalkResultGlobalModificationAvoided: true` is enforced — First Contact fields live exclusively in a new, additive `firstContactMeta` wrapper object, never inside `SmartTalkResult` itself.",
    "3. Mitigation: `firstContactMeta` is only ever constructed and attached inside the First Contact branch; the cross-mode regression suite (8.12D) explicitly asserts its absence from every other mode's response.",
    "4. Mitigation: `locale` and `market` remain two independent request fields validated against two independent allowlists (`ALLOWED_LOCALES`, DE-only market set); no code path derives one from the other.",
    "5. Mitigation: jurisdiction/region are not accepted as request fields in the first patch at all; `context.jurisdictionStatus` is always computed server-side as `\"server_bounded\"` from the validated market, never from client input.",
    "6. Mitigation: `detectClientPaidDocumentModeActivation` is reused unchanged on the First Contact path exactly as on every other mode; any activation signal defers to the existing paid-boundary response.",
    "7. Mitigation: the deterministic mapper mechanically sets `canWait: null` whenever `result.urgency` is `\"high\"` or `\"unknown\"`, and the final validator rejects any presentation where this invariant does not hold — two independent enforcement points, not prompt compliance alone.",
    "8. Mitigation: the mapper copies `result.warnings` verbatim into the response's core `result` field (never removed) and the final validator explicitly checks every warning is still represented.",
    "9. Mitigation: `secondModelCallPlanned: false` and `separateDirectOpenAiPathPlanned: false` are hard-coded plan invariants, checked by this closure's own tamper suite; 8.12C's static audit must count model-call sites on the First Contact path.",
    "10. Mitigation: the scenario allowlist is documented as presentation/routing-hint-only; the gate's conceptual output never includes an authority/deadline/eligibility/form/payment/jurisdiction field derived from scenario alone.",
    "11. Mitigation: the First Contact branch is a self-contained `if (o.mode === ...)` block following the exact existing structural template, with no shared mutable state introduced between branches beyond the already-shared rate limiter.",
    "12. Mitigation: the UI plan bounds preparation items (≤8), scenario cards to a fixed allowlist, and defers all UI work to a dedicated, separately reviewed phase (8.12E) rather than rushing it alongside the runtime patch.",
    "13. Mitigation: only sk/de are validated in the near term; the 10-locale future set is explicitly recorded as a separate, later multilingual-architecture branch, not touched by 8.12C-8.12G.",
    "14. Mitigation: Austria is explicitly `AustriaImplementedNow: false` with `futureAustriaLayerRequired: true`; any future AT work must land in its own separate market-knowledge layer with its own regression pack.",
    "15. Mitigation: `noPersistencePreserved: true`, `dbWritePlanned: false`, `dnaReadPlanned: false`, `dnaWritePlanned: false` are hard-coded plan invariants; 8.12C's static audit must grep the new files for any DB/Storage/DNA import and fail if found.",
  ];

  const readinessVerdict: string[] = [
    "firstContactImplementationPlanAccepted: true — every required plan section (architecture, request/response contracts, market integration, runtime gate, source discriminator, prompt-change boundary, presentation mapper/validator, document/paid/high-risk boundaries, privacy, mobile UI, localization, Germany/Austria separation, file-modification plan, validation plan, phase sequence, risks+mitigations) is fully defined and grounded in live static reads of the current architecture.",
    "readyForMinimalFirstContactRuntimePatch: true — this plan is complete and bounded enough (5 total changed files, well within the 6-file budget) to authorize drafting 8.12C.",
    "readyForFirstContactUiPatch: false, readyForFirstContactApiValidation: false, readyForAndroidValidation: false, readyForIosValidation: false — none of these have been performed or authorized by this planning phase.",
    "readyForControlledBetaAuthorization: false, readyForPublicBetaAuthorization: false, readyForProduction: false, readyForGoLive: false — all four remain blocked.",
    "readyForNextPhase: \"8.12C\" — recommended: Smart Talk First Contact Minimal Controlled Runtime Patch. Runtime implementation is authorized to be PLANNED next, not performed in this phase.",
  ];

  const nextRecommendedSteps: string[] = [
    "Draft PHASE 8.12C — Smart Talk First Contact Minimal Controlled Runtime Patch, modifying exactly `app/api/smart-talk/route.ts` and `lib/vaylo/smart-talk/build-smart-talk-prompt.ts`, and creating exactly `first-contact-runtime-gate.ts`, `build-first-contact-presentation.ts`, and one 8.12C static patch-audit file.",
    "In 8.12C, finalize the exact bounded `FirstContactPresentation` type shapes and array/text-length limits proposed in this plan, and wire the new `SMART_TALK_FIRST_CONTACT_MODE_ENABLED` flag with exact-`\"true\"` gating identical to every existing Smart Talk flag.",
    "Plan 8.12D (disabled+enabled synthetic API closure) and 8.12E (minimal mobile-first UI patch) only after 8.12C is accepted — do not collapse them into 8.12C.",
    "Plan real Android Chrome / iOS Safari validation (8.12F) and the First Contact internal readiness closure (8.12G) as later, dedicated phases.",
  ];

  const notes: string[] = [
    "PHASE 8.12B is implementation-planning only: it converts the accepted 8.12A gate design into a bounded, file-scoped, safety-preserving plan and performs zero route/UI/prompt/env/schema changes, zero model calls, zero OCR, zero browser/mobile/dev-server execution, and zero persistence.",
    "SOURCE STRATEGY DISCLOSURE: none of the three primary source functions (8.12A/8.11S/8.11R) were invoked live. Each was confirmed present on disk and confirmed via a cheap static text read to contain its own checkId literal and exported function name. This closure additionally performs five live static text reads against the CURRENT route/prompt-builder/run-smart-talk/rate-limiter/UI-client source files to ground its architecture findings in real, current text rather than memory of a prior phase.",
    "HEAD-at-bd6a89e and a clean working tree were verified by the agent via `git status --short` / `git log --oneline -5` immediately before this file was created (see the final report) — disclosed as a one-time procedural precondition, not a value dynamically re-derived by this closure.",
    "The recommended 8.12C file set (5 total changed files) is deliberately smaller than the 6-file ceiling stated in the phase instructions, leaving one file of margin; `run-smart-talk.ts` was deliberately excluded from the modification list because its existing `source?: SmartTalkTextSource` parameter already supports the plan without any change.",
  ];

  const provisional: Result = {
    checkId: "8.12B",
    allPassed: true,

    implementationPlanOnly: true,
    runtimeImplementedNow: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    promptModifiedNow: false,
    resultSchemaModifiedNow: false,
    environmentFlagAddedNow: false,
    translationAddedNow: false,
    marketRuntimeAddedNow: false,
    modelCallPerformed: false,
    ocrPerformed: false,
    browserInvoked: false,
    mobileDeviceInvoked: false,
    devServerStarted: false,
    persistencePerformed: false,
    dbStorageWritePerformed: false,
    dnaReadPerformed: false,
    dnaWritePerformed: false,
    billingModifiedNow: false,
    controlledBetaAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceGateDesignCommit: "bd6a89e",
    sourceUnifiedRegressionCommit: "477ab17",
    sourceTechnicalHardeningCommit: "b731c2c",
    sourceGateDesignAccepted,
    sourceUnifiedRegressionAccepted,
    sourceTechnicalHardeningAccepted,

    currentAcceptedModesInspected: true,
    currentModeCount: 5,
    currentSmartTalkResultInspected: true,
    currentRunSmartTalkEntryPointInspected: true,
    currentPromptBuilderInspected: true,
    currentLocaleTypeInspected: true,
    currentLocaleValues: CURRENT_LOCALE_VALUES,
    currentMarketRuntimeExists: false,
    currentJurisdictionRuntimeExists: false,
    currentRegionRuntimeExists: false,
    currentDnaIntegrationExistsForStandalone: false,

    plannedModeConcept: "first_contact",
    plannedRouteMode: "first_contact_controlled_runtime",
    explicitModeSelectionRequired: true,
    plannedEnvironmentFlag: "SMART_TALK_FIRST_CONTACT_MODE_ENABLED",
    exactTrueGateRequired: true,
    fallbackToOtherModeAllowed: false,
    clientBypassAllowed: false,
    automaticYouthDetectionAllowed: false,
    automaticModeSwitchingAllowed: false,

    requestContractDesigned: true,
    requestContentType: "application/json",
    meaningfulTextRequired: true,
    scenarioOptional: true,
    scenarioAloneSufficient: false,
    scenarioServerAllowlistRequired: true,
    scenarioIsEvidence: false,
    localeRequired: true,
    marketRequiredOrServerBounded: "client_provided_server_allowlist_validated",
    unsupportedMarketRejected: true,
    jurisdictionClientClaimTrusted: false,
    regionClientClaimTrusted: false,
    inputLimitsReuseCurrentContract: true,
    promptInjectionHandledAsUntrustedText: true,

    initialSupportedMarket: "DE",
    optionAReviewed: true,
    optionBReviewed: true,
    optionCReviewed: true,
    selectedMarketIntegrationOption: "B",
    localeSeparatedFromMarket: true,
    marketServerAllowlistRequired: true,
    jurisdictionMayNotBeInferredFromLocale: true,
    marketInferredFromLocaleAllowed: false,
    regionMayNotBeFabricated: true,
    AustriaImplementedNow: false,
    futureAustriaLayerRequired: true,
    germanAustrianRuleMixingForbidden: true,

    runtimeGateModulePlanned: true,
    runtimeGatePure: true,
    runSmartTalkReusePlanned: true,
    separateDirectOpenAiPathPlanned: false,
    maximumModelCallsPerRequest: 1,
    secondModelCallPlanned: false,
    ocrUsedByFirstContact: false,
    documentExtractionUsedByFirstContact: false,
    deterministicPresentationMappingPlanned: true,
    finalPresentationValidatorPlanned: true,
    noPersistencePreserved: true,

    currentInputTypeOptionsInspected: true,
    currentSourceOptionsInspected: true,
    dedicatedFirstContactSourceEvaluated: true,
    selectedSourceStrategy: "dedicated_source_discriminator_reusing_question_input_type",
    newInputTypeRequired: false,
    globalPromptChangeRequired: false,
    modeConditionalPromptChangeRequired: true,

    existingSmartTalkResultPreserved: true,
    globalSmartTalkResultMigrationPlanned: false,
    routeLevelFirstContactWrapperPlanned: true,
    firstContactMetaDesigned: true,
    situationSummaryPlanned: true,
    firstStepPlanned: true,
    preparationItemsPlanned: true,
    canWaitOptionalAndRiskControlled: true,
    helpBoundaryPlanned: true,
    evidenceLimitationsPlanned: true,
    trustLevelUntrustedRequired: true,
    boundedArraySizesRequired: true,
    boundedTextLengthsRequired: true,

    factsFirstPipelinePlanned: true,
    urgencyPreservationRequired: true,
    warningPreservationRequired: true,
    deadlinePreservationRequired: true,
    uncertaintyPreservationRequired: true,
    highRiskCanWaitSuppressed: true,
    unknownRiskCanWaitSuppressed: true,
    filingInstructionForbidden: true,
    paymentInstructionForbidden: true,
    signingInstructionForbidden: true,
    rightsWaiverInstructionForbidden: true,
    verifiedClaimForbidden: true,
    processCompleteClaimForbidden: true,
    applicationSubmittedClaimForbidden: true,
    documentAnalyzedWithoutContentClaimForbidden: true,
    presentationMayInventFacts: false,

    documentModeBoundaryReusePlanned: true,
    photoOcrBoundaryReusePlanned: true,
    paidDocumentBoundaryReusePlanned: true,
    paidModeBypassAllowed: false,
    highRiskGovernanceReusePlanned: true,
    freeDocumentInterpretationBypassBlocked: true,
    firstContactMayRecommendOtherMode: true,
    firstContactMaySilentlySwitchMode: false,

    anonymousStandalonePreserved: true,
    ephemeralStandalonePreserved: true,
    authenticationRequired: false,
    dbWritePlanned: false,
    storageWritePlanned: false,
    localStorageWritePlanned: false,
    sessionStorageWritePlanned: false,
    dnaReadPlanned: false,
    dnaWritePlanned: false,
    profileMutationPlanned: false,
    longTermMemoryPlanned: false,
    futureDnaAdapterRequiresSeparateGate: true,
    billingIntegrationPlannedNow: false,

    mobileFirstUiPlanDefined: true,
    menuOrderDefined: true,
    scenarioCardsOptional: true,
    meaningfulTextStillRequired: true,
    largeTapTargetsRequired: true,
    onePrimaryActionRequired: true,
    noHoverDependencyRequired: true,
    warningsVisibleByDefaultRequired: true,
    criticalContentCollapsibleByDefault: false,
    screenReaderSemanticsRequired: true,
    desktopMadePrimary: false,
    uiImplementedNow: false,

    minimalPatchFileBoundaryDefined: true,
    maximumExistingFilesToModify: EXACT_EXISTING_FILES_RECOMMENDED.length,
    maximumNewFilesToCreate: EXACT_NEW_FILES_RECOMMENDED.length,
    maximumTotalFilesChanged: EXACT_EXISTING_FILES_RECOMMENDED.length + EXACT_NEW_FILES_RECOMMENDED.length,
    exactExistingFilesRecommended: EXACT_EXISTING_FILES_RECOMMENDED,
    exactNewFilesRecommended: EXACT_NEW_FILES_RECOMMENDED,
    runtimeOnlyPatchRecommended: true,
    uiDeferredToLaterPhase: true,
    SmartTalkResultGlobalModificationAvoided: true,

    staticPatchAuditPlanned: true,
    disabledApiClosurePlanned: true,
    enabledSyntheticApiClosurePlanned: true,
    crossModeRegressionPlanned: true,
    highRiskRegressionPlanned: true,
    documentBoundaryRegressionPlanned: true,
    paidBoundaryRegressionPlanned: true,
    promptInjectionRegressionPlanned: true,
    androidValidationDeferred: true,
    iosValidationDeferred: true,

    nextPatchPhase: "8.12C",
    disabledEnabledClosurePhase: "8.12D",
    uiPatchPhase: "8.12E",
    browserMobileValidationPhase: "8.12F",
    readinessClosurePhase: "8.12G",
    phaseSequenceMinimized: true,
    unsafePhaseCollapseAllowed: false,

    firstContactImplementationArchitecturePlanned: allChecksPassed,
    firstContactRuntimeGatePlanned: allChecksPassed,
    firstContactRequestContractPlanned: allChecksPassed,
    firstContactResponseContractPlanned: allChecksPassed,
    firstContactPresentationSafetyPlanned: allChecksPassed,
    firstContactMarketIntegrationPlanned: allChecksPassed,
    firstContactValidationPlanPrepared: allChecksPassed,
    firstContactImplementationPlanAccepted: allChecksPassed,
    readyForMinimalFirstContactRuntimePatch: allChecksPassed,
    readyForFirstContactUiPatch: false,
    readyForFirstContactApiValidation: false,
    readyForAndroidValidation: false,
    readyForIosValidation: false,
    readyForControlledBetaAuthorization: false,
    readyForPublicBetaAuthorization: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.12C",
    recommendedNextPhase: "Smart Talk First Contact Minimal Controlled Runtime Patch",

    tamperCount: TAMPER_CASES.length,
    tamperRejected: TAMPER_CASES.length,
    tamperPassing: true,

    sourceEvidence,
    inspectedFiles,
    currentArchitectureFindings,
    implementationAlternatives,
    selectedArchitecture,
    routeContractPlan,
    requestContractPlan,
    marketIntegrationAnalysis,
    scenarioContractPlan,
    runtimeGatePlan,
    runSmartTalkReusePlan,
    sourceDiscriminatorPlan,
    promptChangePlan,
    responseWrapperPlan,
    presentationMapperPlan,
    presentationValidatorPlan,
    documentBoundaryPlan,
    paidBoundaryPlan,
    highRiskPlan,
    privacyPlan,
    mobileUiPlan,
    localizationPlan,
    GermanyAustriaSeparationPlan,
    fileModificationPlan,
    validationPlan,
    phaseSequence,
    implementationRisks,
    riskMitigations,
    evidenceLimitations: [...REQUIRED_EVIDENCE_LIMITATIONS],
    remainingBlockers: [...REQUIRED_REMAINING_BLOCKERS],
    readinessVerdict,
    nextRecommendedSteps,
    notes,
  };

  const allPassed = allChecksPassed && failures.length === 0;

  if (allPassed && !_isCanonicalResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TAMPER_CASES) {
    if (!_isCanonicalResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.12B tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const tamperCount = TAMPER_CASES.length;
  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...provisional.notes,
    `8.12B tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    firstContactImplementationArchitecturePlanned: finalAllPassed,
    firstContactRuntimeGatePlanned: finalAllPassed,
    firstContactRequestContractPlanned: finalAllPassed,
    firstContactResponseContractPlanned: finalAllPassed,
    firstContactPresentationSafetyPlanned: finalAllPassed,
    firstContactMarketIntegrationPlanned: finalAllPassed,
    firstContactValidationPlanPrepared: finalAllPassed,
    firstContactImplementationPlanAccepted: finalAllPassed,
    readyForMinimalFirstContactRuntimePatch: finalAllPassed,
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
  process.argv[1].replace(/\\/g, "/").includes("run-first-contact-mode-implementation-plan");

if (invokedDirectly) {
  runFirstContactModeImplementationPlan()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runFirstContactModeImplementationPlan failed:", err);
      process.exitCode = 1;
    });
}
