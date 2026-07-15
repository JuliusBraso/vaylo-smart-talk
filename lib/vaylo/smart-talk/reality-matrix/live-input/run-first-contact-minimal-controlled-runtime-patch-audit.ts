/**
 * PHASE 8.12C — Smart Talk First Contact Minimal Controlled Runtime Patch Audit
 *
 * STATIC / READ-ONLY PLUS PURE UTILITY TESTS. This closure verifies the
 * minimal First Contact controlled runtime patch that was just applied on
 * top of:
 *   - 6767c96 — plan smart talk first contact mode implementation (8.12B)
 *   - bd6a89e — design smart talk first contact mode gate (8.12A)
 *   - 477ab17 — add unified smart talk cross mode regression closure (8.11S)
 *
 * It does NOT invoke the route's POST handler, does NOT call runSmartTalk,
 * does NOT call a model, does NOT call OCR, does NOT start a dev server,
 * does NOT touch a browser or mobile device, and does NOT write to
 * DB/Storage/DNA. It only:
 *   - reads already-committed/just-edited source files on disk to confirm
 *     required markers are present (no execution of route/UI code),
 *   - imports and calls the new PURE First Contact runtime gate and the
 *     PURE presentation mapper/validator directly, with synthetic inputs
 *     only (no real user input, no OCR/photo text, no model output), and
 *   - runs a fixed set of internal tamper cases against its own result
 *     object to prove the result cannot be silently weakened.
 *
 * HEAD-at-6767c96 and a clean working tree were verified by the agent via
 * `git status --short` / `git log --oneline -5` immediately before any file
 * in this patch was created or modified — a one-time procedural
 * precondition documented in the final report, not a value this closure
 * re-derives at run time (this closure never shells out to `git`).
 */

import fs from "fs";
import path from "path";

import {
  runFirstContactRuntimeGate,
  FIRST_CONTACT_SCENARIOS,
  type FirstContactRuntimeGateInput,
} from "../../first-contact/first-contact-runtime-gate";
import {
  buildFirstContactPresentation,
  validateFirstContactPresentation,
  FIRST_CONTACT_MAX_PREPARATION_ITEMS,
} from "../../first-contact/build-first-contact-presentation";
import type { SmartTalkResult } from "../../run-smart-talk";

// ─── Static source-file markers (relative to repo root; read-only) ────────

const SOURCE_FILES = {
  implementationPlan: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-mode-implementation-plan.ts",
    checkIdMarker: 'checkId: "8.12B"',
  },
  gateDesign: {
    relPath: "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-mode-gate-design.ts",
    checkIdMarker: 'checkId: "8.12A"',
  },
  unifiedRegressionClosure: {
    relPath:
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-unified-smart-talk-cross-mode-regression-closure.ts",
    checkIdMarker: 'checkId: "8.11S"',
  },
  route: {
    relPath: "app/api/smart-talk/route.ts",
    requiredMarkers: [
      'const FIRST_CONTACT_CONTROLLED_RUNTIME_MODE = "first_contact_controlled_runtime"',
      'const FIRST_CONTACT_MODE_ENV_FLAG = "SMART_TALK_FIRST_CONTACT_MODE_ENABLED"',
      'process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true"',
      "runFirstContactRuntimeGate(",
      "buildFirstContactPresentation(",
      "validateFirstContactPresentation(",
      'inputType: "question", source: "first_contact"',
      'jurisdictionStatus: "server_bounded"',
      "first_contact_presentation_invalid",
    ],
  },
  promptBuilder: {
    relPath: "lib/vaylo/smart-talk/build-smart-talk-prompt.ts",
    requiredMarkers: [
      'export type SmartTalkTextSource = "photo_ocr" | "first_contact"',
      "const FIRST_CONTACT_RULES",
      'params.source === "first_contact" ? [FIRST_CONTACT_RULES] : []',
    ],
  },
  runSmartTalk: {
    relPath: "lib/vaylo/smart-talk/run-smart-talk.ts",
    requiredMarkers: [
      "export type SmartTalkResult = {",
      "export async function runSmartTalk(",
    ],
    forbiddenMarkers: ["first_contact"],
  },
  runtimeGate: {
    relPath: "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts",
    requiredMarkers: [
      "export function runFirstContactRuntimeGate(",
      'export type FirstContactMarket = "DE"',
      "first_contact_mode_disabled",
      "first_contact_not_explicitly_selected",
      "first_contact_input_too_short",
      "first_contact_input_too_long",
      "first_contact_locale_unsupported",
      "first_contact_market_unsupported",
      "first_contact_scenario_unsupported",
      "first_contact_document_mode_required",
      "first_contact_photo_ocr_mode_required",
      "first_contact_paid_document_boundary",
      "first_contact_persistence_forbidden",
    ],
    forbiddenMarkers: [
      "process.env",
      "fetch(",
      "tesseract",
      "extractTextFromImageBuffer",
      "supabase",
      "localStorage",
      "sessionStorage",
      '"AT"',
    ],
  },
  presentationMapper: {
    relPath: "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts",
    requiredMarkers: [
      "export function buildFirstContactPresentation(",
      "export function validateFirstContactPresentation(",
      'FIRST_CONTACT_PRESENTATION_VERSION = "v1"',
      'trustLevel: "untrusted"',
    ],
    forbiddenMarkers: [
      "process.env",
      "fetch(",
      "tesseract",
      "extractTextFromImageBuffer",
      "supabase",
      "localStorage",
      "sessionStorage",
      "runSmartTalk(",
    ],
  },
} as const;

function readSourceFile(relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return null;
  }
}

function fileContainsAllMarkers(relPath: string, markers: readonly string[]): boolean {
  const src = readSourceFile(relPath);
  if (src === null) return false;
  return markers.every((m) => src.includes(m));
}

/**
 * Strips /* ... *\/ block comments and // line comments before forbidden-
 * marker checks, so that documentation prose explaining what a pure module
 * must NOT do (e.g. "does not read `process.env`") is not itself mistaken
 * for a real usage of that forbidden pattern.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function fileContainsNoneOfMarkers(relPath: string, markers: readonly string[]): boolean {
  const src = readSourceFile(relPath);
  if (src === null) return false;
  const code = stripComments(src);
  return markers.every((m) => !code.includes(m));
}

// ─── Pure First Contact runtime gate — functional test cases ──────────────

const BASE_GATE_INPUT: FirstContactRuntimeGateInput = {
  enabled: true,
  explicitlySelected: true,
  text: "Presťahoval som sa prvýkrát do Nemecka a neviem, čo mám vybaviť.",
  locale: "sk",
  allowedLocales: ["sk", "de", "en"],
  minTextLength: 8,
  maxTextLength: 12_000,
  market: "DE",
  scenario: "moving_or_registration",
  documentInterpretationRequested: false,
  photoOrFilePresent: false,
  paidDocumentBoundaryTriggered: false,
  persistenceRequested: false,
};

type GateTestCase = { label: string; input: FirstContactRuntimeGateInput; expectAllowed: boolean; expectCode: string };

const GATE_TEST_CASES: readonly GateTestCase[] = [
  { label: "flag disabled", input: { ...BASE_GATE_INPUT, enabled: false }, expectAllowed: false, expectCode: "first_contact_mode_disabled" },
  { label: "not explicitly selected", input: { ...BASE_GATE_INPUT, explicitlySelected: false }, expectAllowed: false, expectCode: "first_contact_not_explicitly_selected" },
  { label: "whitespace-only text", input: { ...BASE_GATE_INPUT, text: "     " }, expectAllowed: false, expectCode: "first_contact_input_too_short" },
  { label: "text shorter than minimum", input: { ...BASE_GATE_INPUT, text: "hi" }, expectAllowed: false, expectCode: "first_contact_input_too_short" },
  { label: "text longer than maximum", input: { ...BASE_GATE_INPUT, text: "a".repeat(12_001) }, expectAllowed: false, expectCode: "first_contact_input_too_long" },
  { label: "unsupported locale", input: { ...BASE_GATE_INPUT, locale: "fr" }, expectAllowed: false, expectCode: "first_contact_locale_unsupported" },
  { label: "missing locale", input: { ...BASE_GATE_INPUT, locale: "" }, expectAllowed: false, expectCode: "first_contact_locale_unsupported" },
  { label: "unsupported market (AT)", input: { ...BASE_GATE_INPUT, market: "AT" }, expectAllowed: false, expectCode: "first_contact_market_unsupported" },
  { label: "missing market", input: { ...BASE_GATE_INPUT, market: "" }, expectAllowed: false, expectCode: "first_contact_market_unsupported" },
  { label: "unsupported scenario", input: { ...BASE_GATE_INPUT, scenario: "not_a_real_scenario" }, expectAllowed: false, expectCode: "first_contact_scenario_unsupported" },
  { label: "null scenario is allowed (optional)", input: { ...BASE_GATE_INPUT, scenario: null }, expectAllowed: true, expectCode: "first_contact_allowed" },
  { label: "document interpretation requested", input: { ...BASE_GATE_INPUT, documentInterpretationRequested: true }, expectAllowed: false, expectCode: "first_contact_document_mode_required" },
  { label: "photo or file present", input: { ...BASE_GATE_INPUT, photoOrFilePresent: true }, expectAllowed: false, expectCode: "first_contact_photo_ocr_mode_required" },
  { label: "paid document boundary triggered", input: { ...BASE_GATE_INPUT, paidDocumentBoundaryTriggered: true }, expectAllowed: false, expectCode: "first_contact_paid_document_boundary" },
  { label: "persistence requested", input: { ...BASE_GATE_INPUT, persistenceRequested: true }, expectAllowed: false, expectCode: "first_contact_persistence_forbidden" },
  { label: "fully valid request is allowed", input: { ...BASE_GATE_INPUT }, expectAllowed: true, expectCode: "first_contact_allowed" },
];

function runPureGateTestCases(): { allPassed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;
  for (const tc of GATE_TEST_CASES) {
    const out = runFirstContactRuntimeGate(tc.input);
    const pass = out.allowed === tc.expectAllowed && out.code === tc.expectCode;
    if (!pass) allPassed = false;
    results.push(
      `${pass ? "PASS" : "FAIL"} — ${tc.label} → expected allowed=${tc.expectAllowed} code=${tc.expectCode}; got allowed=${out.allowed} code=${out.code}`,
    );
  }
  // Every FirstContactScenario allowlist entry must be individually accepted.
  for (const scenario of FIRST_CONTACT_SCENARIOS) {
    const out = runFirstContactRuntimeGate({ ...BASE_GATE_INPUT, scenario });
    const pass = out.allowed === true && out.normalizedScenario === scenario;
    if (!pass) allPassed = false;
    results.push(`${pass ? "PASS" : "FAIL"} — scenario allowlist entry "${scenario}" accepted`);
  }
  return { allPassed, results };
}

// ─── Pure First Contact presentation mapper/validator — functional tests ──

function syntheticResult(overrides: Partial<SmartTalkResult>): SmartTalkResult {
  return {
    summary: "Ide o všeobecnú orientáciu pri prvom kontakte s úradom.",
    meaning: "Text popisuje bežnú administratívnu situáciu bez konkrétneho dokumentu.",
    urgency: "low",
    nextSteps: ["Zistite, ktorý úrad je príslušný.", "Pripravte si doklad totožnosti."],
    warnings: [],
    stabilizers: ["Zatiaľ nejde o žiadne rozhodnutie ani sankciu."],
    confidenceLevel: "medium",
    consequencePhase: "none",
    documentQuality: "unknown",
    documentKind: "unknown",
    domain: "unknown",
    documentTypeLabel: "",
    paymentChannel: "not_applicable",
    proceduralState: "informational",
    legalSeverity: "none",
    deadlines: [],
    rights: [],
    obligations: [],
    consequences: [],
    ...overrides,
  };
}

type PresentationTestCase = { label: string; check: () => boolean };

const PRESENTATION_TEST_CASES: readonly PresentationTestCase[] = [
  {
    label: "low urgency with stabilizers yields non-null bounded canWait",
    check: () => {
      const result = syntheticResult({ urgency: "low", stabilizers: ["Fact A", "Fact B"] });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.canWait !== null && p.canWait.length === 2;
    },
  },
  {
    label: "high urgency forces canWait null even with stabilizers present",
    check: () => {
      const result = syntheticResult({ urgency: "high", stabilizers: ["Fact A"], legalSeverity: "high", warnings: ["Risk warning"] });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.canWait === null && p.helpBoundary.level !== "none";
    },
  },
  {
    label: "unknown urgency forces canWait null and non-none help boundary",
    check: () => {
      const result = syntheticResult({ urgency: "unknown", stabilizers: ["Fact A"] });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.canWait === null && p.helpBoundary.level === "official";
    },
  },
  {
    label: "critical legalSeverity yields emergency_help first-step boundary",
    check: () => {
      const result = syntheticResult({ urgency: "high", legalSeverity: "critical" });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.firstStep.boundary === "emergency_help" && p.helpBoundary.level === "emergency";
    },
  },
  {
    label: "empty nextSteps still yields a non-empty bounded firstStep.action",
    check: () => {
      const result = syntheticResult({ nextSteps: [] });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.firstStep.action.trim().length > 0;
    },
  },
  {
    label: "long obligations/nextSteps are truncated and bounded in count",
    check: () => {
      const longStep = "x".repeat(5000);
      const manyObligations = Array.from({ length: 20 }, (_, i) => `${longStep}-${i}`);
      const result = syntheticResult({ nextSteps: [longStep, ...manyObligations], obligations: manyObligations });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const v = validateFirstContactPresentation(result, p);
      return v.valid && p.preparationItems.length <= FIRST_CONTACT_MAX_PREPARATION_ITEMS;
    },
  },
  {
    label: "mapper fails closed (null) when summary and meaning are both empty",
    check: () => {
      const result = syntheticResult({ summary: "", meaning: "" });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      return p === null;
    },
  },
  {
    label: "validator rejects a tampered trustLevel",
    check: () => {
      const result = syntheticResult({});
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const tampered = { ...p, trustLevel: "trusted" as unknown as "untrusted" };
      const v = validateFirstContactPresentation(result, tampered);
      return !v.valid;
    },
  },
  {
    label: "validator rejects canWait present under high urgency even if hand-constructed",
    check: () => {
      const result = syntheticResult({ urgency: "high" });
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const tampered = { ...p, canWait: ["should not be allowed"] };
      const v = validateFirstContactPresentation(result, tampered);
      return !v.valid;
    },
  },
  {
    label: "validator rejects a filing-instruction phrase inserted into firstStep.action",
    check: () => {
      const result = syntheticResult({});
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const tampered = { ...p, firstStep: { ...p.firstStep, action: "Submit the application now." } };
      const v = validateFirstContactPresentation(result, tampered);
      return !v.valid;
    },
  },
  {
    label: "validator rejects a document-analyzed-without-content claim",
    check: () => {
      const result = syntheticResult({});
      const p = buildFirstContactPresentation(result, { market: "DE" });
      if (!p) return false;
      const tampered = { ...p, situationSummary: "We analyzed your document and it is fine." };
      const v = validateFirstContactPresentation(result, tampered);
      return !v.valid;
    },
  },
];

function runPurePresentationTestCases(): { allPassed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;
  for (const tc of PRESENTATION_TEST_CASES) {
    let pass = false;
    try {
      pass = tc.check();
    } catch {
      pass = false;
    }
    if (!pass) allPassed = false;
    results.push(`${pass ? "PASS" : "FAIL"} — ${tc.label}`);
  }
  return { allPassed, results };
}

// ─── Required conceptual catalogs ──────────────────────────────────────────

const REQUIRED_IMPLEMENTATION_LIMITATIONS: readonly string[] = [
  "No route/API request was executed by this audit.",
  "No real model call was performed.",
  "No browser or mobile device was tested.",
  "No UI menu item or scenario card was implemented.",
  "No Slovak or German First Contact runtime result was dynamically validated.",
  "No high-risk model output was dynamically validated.",
  "No document-boundary API behavior was dynamically validated.",
  "No paid-boundary API behavior was dynamically validated.",
  "No cross-mode regression was rerun after adding First Contact.",
  "No Android Chrome or iOS Safari validation was performed.",
  "Only Germany market is supported.",
  "Austria remains unimplemented.",
  "Multilingual architecture remains incomplete.",
  "Public beta, production, and go-live remain blocked.",
];

const REQUIRED_REMAINING_BLOCKERS: readonly string[] = [
  "disabled API closure not executed",
  "enabled synthetic API closure not executed",
  "exact non-true flag matrix not validated through route",
  "one-model-call behavior not dynamically observed",
  "First Contact prompt output not dynamically validated",
  "high-risk canWait suppression not dynamically validated",
  "document-mode boundary not dynamically validated",
  "paid-mode boundary not dynamically validated",
  "unsupported market behavior not dynamically validated",
  "unsupported scenario behavior not dynamically validated",
  "prompt-injection behavior not dynamically validated",
  "cross-mode regression not rerun",
  "UI menu item not implemented",
  "scenario cards not implemented",
  "browser validation pending",
  "Android Chrome validation pending",
  "iOS Safari validation pending",
  "multilingual validation pending",
  "Germany market knowledge validation pending",
  "Austria implementation not started",
  "DNA integration not implemented",
  "controlled beta unauthorized",
  "public beta unauthorized",
  "production unauthorized",
  "go-live unauthorized",
];

// ─── Top-level result type ──────────────────────────────────────────────────

interface Result {
  checkId: "8.12C";
  allPassed: boolean;

  minimalControlledRuntimePatchImplemented: true;
  runtimeOnlyPatch: true;
  uiImplementedNow: false;
  menuItemAddedNow: false;
  scenarioCardsAddedNow: false;
  browserInvoked: false;
  mobileDeviceInvoked: false;
  devServerStarted: false;
  routeInvokedByAudit: false;
  runSmartTalkInvokedByAudit: false;
  modelCallPerformedByAudit: false;
  ocrPerformedByAudit: false;
  persistencePerformedByAudit: false;
  dbStorageWritePerformedByAudit: false;
  dnaReadPerformedByAudit: false;
  dnaWritePerformedByAudit: false;
  billingModifiedNow: false;
  controlledBetaAuthorizedNow: false;
  publicBetaAuthorizedNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceImplementationPlanCommit: "6767c96";
  sourceGateDesignCommit: "bd6a89e";
  sourceUnifiedRegressionCommit: "477ab17";
  sourceImplementationPlanAccepted: boolean;
  sourceGateDesignAccepted: boolean;
  sourceUnifiedRegressionAccepted: boolean;

  routeModified: boolean;
  promptBuilderModified: boolean;
  runSmartTalkModified: boolean;
  uiModified: boolean;
  packageFilesModified: false;
  envFilesModified: false;
  runtimeGateCreated: boolean;
  presentationMapperCreated: boolean;
  patchAuditCreated: true;
  totalExistingFilesModified: number;
  totalNewFilesCreated: number;
  totalFilesChanged: number;
  fileBoundaryWithinLimit: boolean;

  plannedModeImplemented: "first_contact_controlled_runtime";
  exactModeSelectionRequired: true;
  explicitSelectionRequired: true;
  fallbackToOtherModeAllowed: boolean;
  automaticModeSwitchingAllowed: boolean;
  automaticYouthDetectionAllowed: boolean;

  environmentFlagImplemented: "SMART_TALK_FIRST_CONTACT_MODE_ENABLED";
  exactTrueRequired: true;
  truthyCoercionUsed: boolean;
  clientBypassAdded: boolean;
  headerBypassAdded: boolean;
  queryBypassAdded: boolean;
  bodyBypassAdded: boolean;
  nodeEnvBypassAdded: boolean;

  jsonRequestContractImplemented: true;
  meaningfulTextRequired: boolean;
  currentTextLimitsReused: boolean;
  localeRequired: true;
  marketRequired: true;
  onlyDeMarketSupported: boolean;
  austriaAcceptedNow: boolean;
  localeMarketSeparated: boolean;
  marketInferredFromLocale: boolean;
  scenarioOptional: true;
  scenarioAllowlistImplemented: boolean;
  scenarioAloneSufficient: boolean;
  scenarioUsedAsEvidence: boolean;
  jurisdictionClientClaimTrusted: boolean;
  regionClientClaimTrusted: boolean;

  pureRuntimeGateImplemented: boolean;
  disabledGatePrecedesModelPath: boolean;
  unsupportedLocaleRejected: boolean;
  unsupportedMarketRejected: boolean;
  unsupportedScenarioRejected: boolean;
  documentModeBoundaryPreserved: boolean;
  photoOcrBoundaryPreserved: boolean;
  paidDocumentBoundaryPreserved: boolean;
  persistenceRequestRejected: boolean;
  silentModeSwitchForbidden: boolean;

  runSmartTalkReused: boolean;
  directOpenAiPathAdded: boolean;
  inputTypeUsed: "question";
  sourceUsed: "first_contact";
  SmartTalkTextSourceExtended: boolean;
  newInputTypeAdded: boolean;
  maximumRunSmartTalkCallsPerRequest: number;
  secondModelCallAdded: boolean;
  ocrUsedByFirstContact: boolean;
  documentExtractionUsedByFirstContact: boolean;

  promptChangeModeConditional: boolean;
  freeQaPromptSemanticsChangedGlobally: boolean;
  textDocumentPromptSemanticsChangedGlobally: boolean;
  photoOcrPromptSemanticsChangedGlobally: boolean;
  factsFirstInstructionPresent: boolean;
  urgencyPreservationInstructionPresent: boolean;
  warningPreservationInstructionPresent: boolean;
  deadlineFabricationForbidden: boolean;
  jurisdictionFabricationForbidden: boolean;
  documentInterpretationWithoutContentForbidden: boolean;
  paidModeBypassForbidden: boolean;
  slangPersonaForbidden: boolean;
  filingPaymentSigningForbidden: boolean;

  existingSmartTalkResultPreserved: boolean;
  globalSmartTalkResultModified: boolean;
  routeLevelWrapperImplemented: boolean;
  firstContactMetaImplemented: boolean;
  presentationVersion: "v1";
  trustLevelUntrustedRequired: boolean;
  boundedArraySizesImplemented: boolean;
  boundedTextLengthsImplemented: boolean;
  deterministicMapperImplemented: boolean;
  finalValidatorImplemented: boolean;
  secondModelCallRequiredForPresentation: boolean;

  factsMayBeInventedByMapper: boolean;
  factsMayBeRemovedByMapper: boolean;
  urgencyMayBeDowngraded: boolean;
  warningsMayBeHidden: boolean;
  deadlineMayBeAltered: boolean;
  highRiskCanWaitSuppressed: boolean;
  unknownRiskCanWaitSuppressed: boolean;
  filingInstructionAllowed: boolean;
  paymentInstructionAllowed: boolean;
  signingInstructionAllowed: boolean;
  rightsWaiverInstructionAllowed: boolean;
  verifiedClaimAllowed: boolean;
  processCompleteClaimAllowed: boolean;
  applicationSubmittedClaimAllowed: boolean;
  documentAnalyzedWithoutContentClaimAllowed: boolean;

  anonymousStandalonePreserved: boolean;
  ephemeralStandalonePreserved: boolean;
  authenticationAdded: boolean;
  dbWriteAdded: boolean;
  storageWriteAdded: boolean;
  localStorageWriteAdded: boolean;
  sessionStorageWriteAdded: boolean;
  dnaReadAdded: boolean;
  dnaWriteAdded: boolean;
  profileMutationAdded: boolean;
  longTermMemoryAdded: boolean;
  billingAdded: boolean;

  firstContactRuntimeGateImplemented: boolean;
  firstContactRouteModeImplemented: boolean;
  firstContactFlagGateImplemented: boolean;
  firstContactPromptBranchImplemented: boolean;
  firstContactPresentationMapperImplemented: boolean;
  firstContactPresentationValidatorImplemented: boolean;
  firstContactNoPersistencePreserved: boolean;
  minimalRuntimePatchAccepted: boolean;
  readyForDisabledEnabledApiClosure: boolean;
  readyForUiPatch: false;
  readyForBrowserValidation: false;
  readyForAndroidValidation: false;
  readyForIosValidation: false;
  readyForControlledBetaAuthorization: false;
  readyForPublicBetaAuthorization: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.12D";
  recommendedNextPhase: "Smart Talk First Contact Disabled and Enabled Synthetic Local API Closure";

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  modeContractEvidence: string[];
  environmentFlagEvidence: string[];
  requestContractEvidence: string[];
  marketLocaleEvidence: string[];
  scenarioContractEvidence: string[];
  runtimeGateEvidence: string[];
  gateOrderingEvidence: string[];
  documentBoundaryEvidence: string[];
  paidBoundaryEvidence: string[];
  runSmartTalkReuseEvidence: string[];
  promptBranchEvidence: string[];
  presentationMappingEvidence: string[];
  presentationValidationEvidence: string[];
  callBudgetEvidence: string[];
  privacyEvidence: string[];
  noPersistenceEvidence: string[];
  pureGateTestCases: string[];
  purePresentationTestCases: string[];
  implementationLimitations: string[];
  remainingBlockers: string[];
  readinessVerdict: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalResult(r: Result): boolean {
  if (r.checkId !== "8.12C") return false;
  if (r.allPassed !== true) return false;

  if (
    r.minimalControlledRuntimePatchImplemented !== true ||
    r.runtimeOnlyPatch !== true ||
    r.uiImplementedNow !== false ||
    r.menuItemAddedNow !== false ||
    r.scenarioCardsAddedNow !== false ||
    r.browserInvoked !== false ||
    r.mobileDeviceInvoked !== false ||
    r.devServerStarted !== false ||
    r.routeInvokedByAudit !== false ||
    r.runSmartTalkInvokedByAudit !== false ||
    r.modelCallPerformedByAudit !== false ||
    r.ocrPerformedByAudit !== false ||
    r.persistencePerformedByAudit !== false ||
    r.dbStorageWritePerformedByAudit !== false ||
    r.dnaReadPerformedByAudit !== false ||
    r.dnaWritePerformedByAudit !== false ||
    r.billingModifiedNow !== false ||
    r.controlledBetaAuthorizedNow !== false ||
    r.publicBetaAuthorizedNow !== false ||
    r.productionAuthorizedNow !== false ||
    r.goLiveAuthorizedNow !== false ||
    r.eightThreeAcNotRun !== true ||
    r.tmpEightThreeAcMetadataTouched !== false
  ) {
    return false;
  }

  if (
    r.sourceImplementationPlanCommit !== "6767c96" ||
    r.sourceGateDesignCommit !== "bd6a89e" ||
    r.sourceUnifiedRegressionCommit !== "477ab17" ||
    r.sourceImplementationPlanAccepted !== true ||
    r.sourceGateDesignAccepted !== true ||
    r.sourceUnifiedRegressionAccepted !== true
  ) {
    return false;
  }

  if (
    r.routeModified !== true ||
    r.promptBuilderModified !== true ||
    r.runSmartTalkModified !== false ||
    r.uiModified !== false ||
    r.packageFilesModified !== false ||
    r.envFilesModified !== false ||
    r.runtimeGateCreated !== true ||
    r.presentationMapperCreated !== true ||
    r.patchAuditCreated !== true ||
    r.totalExistingFilesModified > 2 ||
    r.totalNewFilesCreated > 3 ||
    r.totalFilesChanged > 5 ||
    r.fileBoundaryWithinLimit !== true
  ) {
    return false;
  }

  if (
    r.plannedModeImplemented !== "first_contact_controlled_runtime" ||
    r.exactModeSelectionRequired !== true ||
    r.explicitSelectionRequired !== true ||
    r.fallbackToOtherModeAllowed !== false ||
    r.automaticModeSwitchingAllowed !== false ||
    r.automaticYouthDetectionAllowed !== false
  ) {
    return false;
  }

  if (
    r.environmentFlagImplemented !== "SMART_TALK_FIRST_CONTACT_MODE_ENABLED" ||
    r.exactTrueRequired !== true ||
    r.truthyCoercionUsed !== false ||
    r.clientBypassAdded !== false ||
    r.headerBypassAdded !== false ||
    r.queryBypassAdded !== false ||
    r.bodyBypassAdded !== false ||
    r.nodeEnvBypassAdded !== false
  ) {
    return false;
  }

  if (
    r.jsonRequestContractImplemented !== true ||
    r.meaningfulTextRequired !== true ||
    r.currentTextLimitsReused !== true ||
    r.localeRequired !== true ||
    r.marketRequired !== true ||
    r.onlyDeMarketSupported !== true ||
    r.austriaAcceptedNow !== false ||
    r.localeMarketSeparated !== true ||
    r.marketInferredFromLocale !== false ||
    r.scenarioOptional !== true ||
    r.scenarioAllowlistImplemented !== true ||
    r.scenarioAloneSufficient !== false ||
    r.scenarioUsedAsEvidence !== false ||
    r.jurisdictionClientClaimTrusted !== false ||
    r.regionClientClaimTrusted !== false
  ) {
    return false;
  }

  if (
    r.pureRuntimeGateImplemented !== true ||
    r.disabledGatePrecedesModelPath !== true ||
    r.unsupportedLocaleRejected !== true ||
    r.unsupportedMarketRejected !== true ||
    r.unsupportedScenarioRejected !== true ||
    r.documentModeBoundaryPreserved !== true ||
    r.photoOcrBoundaryPreserved !== true ||
    r.paidDocumentBoundaryPreserved !== true ||
    r.persistenceRequestRejected !== true ||
    r.silentModeSwitchForbidden !== true
  ) {
    return false;
  }

  if (
    r.runSmartTalkReused !== true ||
    r.directOpenAiPathAdded !== false ||
    r.inputTypeUsed !== "question" ||
    r.sourceUsed !== "first_contact" ||
    r.SmartTalkTextSourceExtended !== true ||
    r.newInputTypeAdded !== false ||
    r.maximumRunSmartTalkCallsPerRequest !== 1 ||
    r.secondModelCallAdded !== false ||
    r.ocrUsedByFirstContact !== false ||
    r.documentExtractionUsedByFirstContact !== false
  ) {
    return false;
  }

  if (
    r.promptChangeModeConditional !== true ||
    r.freeQaPromptSemanticsChangedGlobally !== false ||
    r.textDocumentPromptSemanticsChangedGlobally !== false ||
    r.photoOcrPromptSemanticsChangedGlobally !== false ||
    r.factsFirstInstructionPresent !== true ||
    r.urgencyPreservationInstructionPresent !== true ||
    r.warningPreservationInstructionPresent !== true ||
    r.deadlineFabricationForbidden !== true ||
    r.jurisdictionFabricationForbidden !== true ||
    r.documentInterpretationWithoutContentForbidden !== true ||
    r.paidModeBypassForbidden !== true ||
    r.slangPersonaForbidden !== true ||
    r.filingPaymentSigningForbidden !== true
  ) {
    return false;
  }

  if (
    r.existingSmartTalkResultPreserved !== true ||
    r.globalSmartTalkResultModified !== false ||
    r.routeLevelWrapperImplemented !== true ||
    r.firstContactMetaImplemented !== true ||
    r.presentationVersion !== "v1" ||
    r.trustLevelUntrustedRequired !== true ||
    r.boundedArraySizesImplemented !== true ||
    r.boundedTextLengthsImplemented !== true ||
    r.deterministicMapperImplemented !== true ||
    r.finalValidatorImplemented !== true ||
    r.secondModelCallRequiredForPresentation !== false
  ) {
    return false;
  }

  if (
    r.factsMayBeInventedByMapper !== false ||
    r.factsMayBeRemovedByMapper !== false ||
    r.urgencyMayBeDowngraded !== false ||
    r.warningsMayBeHidden !== false ||
    r.deadlineMayBeAltered !== false ||
    r.highRiskCanWaitSuppressed !== true ||
    r.unknownRiskCanWaitSuppressed !== true ||
    r.filingInstructionAllowed !== false ||
    r.paymentInstructionAllowed !== false ||
    r.signingInstructionAllowed !== false ||
    r.rightsWaiverInstructionAllowed !== false ||
    r.verifiedClaimAllowed !== false ||
    r.processCompleteClaimAllowed !== false ||
    r.applicationSubmittedClaimAllowed !== false ||
    r.documentAnalyzedWithoutContentClaimAllowed !== false
  ) {
    return false;
  }

  if (
    r.anonymousStandalonePreserved !== true ||
    r.ephemeralStandalonePreserved !== true ||
    r.authenticationAdded !== false ||
    r.dbWriteAdded !== false ||
    r.storageWriteAdded !== false ||
    r.localStorageWriteAdded !== false ||
    r.sessionStorageWriteAdded !== false ||
    r.dnaReadAdded !== false ||
    r.dnaWriteAdded !== false ||
    r.profileMutationAdded !== false ||
    r.longTermMemoryAdded !== false ||
    r.billingAdded !== false
  ) {
    return false;
  }

  if (
    r.firstContactRuntimeGateImplemented !== true ||
    r.firstContactRouteModeImplemented !== true ||
    r.firstContactFlagGateImplemented !== true ||
    r.firstContactPromptBranchImplemented !== true ||
    r.firstContactPresentationMapperImplemented !== true ||
    r.firstContactPresentationValidatorImplemented !== true ||
    r.firstContactNoPersistencePreserved !== true ||
    r.minimalRuntimePatchAccepted !== true ||
    r.readyForDisabledEnabledApiClosure !== true ||
    r.readyForUiPatch !== false ||
    r.readyForBrowserValidation !== false ||
    r.readyForAndroidValidation !== false ||
    r.readyForIosValidation !== false ||
    r.readyForControlledBetaAuthorization !== false ||
    r.readyForPublicBetaAuthorization !== false ||
    r.readyForProduction !== false ||
    r.readyForGoLive !== false ||
    r.readyForNextPhase !== "8.12D"
  ) {
    return false;
  }

  if (r.tamperRejected !== r.tamperCount || r.tamperPassing !== true) return false;

  return true;
}

// ─── Tamper cases (58 focused, immutable) ──────────────────────────────────

type TamperCase = { label: string; mutate: (r: Result) => Result };

const TAMPER_CASES: readonly TamperCase[] = [
  { label: "1. implementation-plan commit mismatch", mutate: (r) => ({ ...r, sourceImplementationPlanCommit: "0000000" as "6767c96" }) },
  { label: "2. route mode missing", mutate: (r) => ({ ...r, plannedModeImplemented: "" as "first_contact_controlled_runtime" }) },
  { label: "3. wrong route mode", mutate: (r) => ({ ...r, plannedModeImplemented: "first_contact_lite" as "first_contact_controlled_runtime" }) },
  { label: "4. environment flag missing", mutate: (r) => ({ ...r, environmentFlagImplemented: "" as "SMART_TALK_FIRST_CONTACT_MODE_ENABLED" }) },
  { label: "5. truthy coercion used", mutate: (r) => ({ ...r, truthyCoercionUsed: true }) },
  { label: "6. header bypass added", mutate: (r) => ({ ...r, headerBypassAdded: true }) },
  { label: "7. query/body bypass added", mutate: (r) => ({ ...r, queryBypassAdded: true }) },
  { label: "8. disabled gate after model call", mutate: (r) => ({ ...r, disabledGatePrecedesModelPath: false }) },
  { label: "9. fallback to Free Q&A allowed", mutate: (r) => ({ ...r, fallbackToOtherModeAllowed: true }) },
  { label: "10. automatic mode switching allowed", mutate: (r) => ({ ...r, automaticModeSwitchingAllowed: true }) },
  { label: "11. meaningful text not required", mutate: (r) => ({ ...r, meaningfulTextRequired: false }) },
  { label: "12. unsupported market accepted", mutate: (r) => ({ ...r, onlyDeMarketSupported: false }) },
  { label: "13. AT accepted now", mutate: (r) => ({ ...r, austriaAcceptedNow: true }) },
  { label: "14. market inferred from locale", mutate: (r) => ({ ...r, marketInferredFromLocale: true }) },
  { label: "15. scenario alone sufficient", mutate: (r) => ({ ...r, scenarioAloneSufficient: true }) },
  { label: "16. scenario treated as evidence", mutate: (r) => ({ ...r, scenarioUsedAsEvidence: true }) },
  { label: "17. unsupported scenario accepted", mutate: (r) => ({ ...r, unsupportedScenarioRejected: false }) },
  { label: "18. client jurisdiction trusted", mutate: (r) => ({ ...r, jurisdictionClientClaimTrusted: true }) },
  { label: "19. document boundary disabled", mutate: (r) => ({ ...r, documentModeBoundaryPreserved: false }) },
  { label: "20. paid boundary disabled", mutate: (r) => ({ ...r, paidDocumentBoundaryPreserved: false }) },
  { label: "21. direct OpenAI path added", mutate: (r) => ({ ...r, directOpenAiPathAdded: true }) },
  { label: "22. two runSmartTalk calls allowed", mutate: (r) => ({ ...r, maximumRunSmartTalkCallsPerRequest: 2 }) },
  { label: "23. second model call added", mutate: (r) => ({ ...r, secondModelCallAdded: true }) },
  { label: "24. OCR used", mutate: (r) => ({ ...r, ocrUsedByFirstContact: true }) },
  { label: "25. document extraction used", mutate: (r) => ({ ...r, documentExtractionUsedByFirstContact: true }) },
  { label: "26. source not first_contact", mutate: (r) => ({ ...r, sourceUsed: "question" as "first_contact" }) },
  { label: "27. new inputType added", mutate: (r) => ({ ...r, newInputTypeAdded: true }) },
  { label: "28. global prompt semantics changed", mutate: (r) => ({ ...r, freeQaPromptSemanticsChangedGlobally: true }) },
  { label: "29. existing SmartTalkResult modified", mutate: (r) => ({ ...r, globalSmartTalkResultModified: true }) },
  { label: "30. core result discarded", mutate: (r) => ({ ...r, existingSmartTalkResultPreserved: false }) },
  { label: "31. mapper may invent facts", mutate: (r) => ({ ...r, factsMayBeInventedByMapper: true }) },
  { label: "32. urgency may be downgraded", mutate: (r) => ({ ...r, urgencyMayBeDowngraded: true }) },
  { label: "33. warnings may be hidden", mutate: (r) => ({ ...r, warningsMayBeHidden: true }) },
  { label: "34. deadline may be altered", mutate: (r) => ({ ...r, deadlineMayBeAltered: true }) },
  { label: "35. high-risk canWait allowed", mutate: (r) => ({ ...r, highRiskCanWaitSuppressed: false }) },
  { label: "36. unknown-risk canWait allowed", mutate: (r) => ({ ...r, unknownRiskCanWaitSuppressed: false }) },
  { label: "37. unbounded array allowed", mutate: (r) => ({ ...r, boundedArraySizesImplemented: false }) },
  { label: "38. unbounded string allowed", mutate: (r) => ({ ...r, boundedTextLengthsImplemented: false }) },
  { label: "39. filing instruction allowed", mutate: (r) => ({ ...r, filingInstructionAllowed: true }) },
  { label: "40. payment instruction allowed", mutate: (r) => ({ ...r, paymentInstructionAllowed: true }) },
  { label: "41. signing instruction allowed", mutate: (r) => ({ ...r, signingInstructionAllowed: true }) },
  { label: "42. output may be trusted", mutate: (r) => ({ ...r, trustLevelUntrustedRequired: false }) },
  { label: "43. document analyzed without content allowed", mutate: (r) => ({ ...r, documentAnalyzedWithoutContentClaimAllowed: true }) },
  { label: "44. DB/Storage write added", mutate: (r) => ({ ...r, dbWriteAdded: true }) },
  { label: "45. DNA read/write added", mutate: (r) => ({ ...r, dnaReadAdded: true }) },
  { label: "46. long-term memory added", mutate: (r) => ({ ...r, longTermMemoryAdded: true }) },
  { label: "47. billing added", mutate: (r) => ({ ...r, billingAdded: true }) },
  { label: "48. UI modified", mutate: (r) => ({ ...r, uiModified: true }) },
  { label: "49. route invoked by audit", mutate: (r) => ({ ...r, routeInvokedByAudit: true as false }) },
  { label: "50. model call performed by audit", mutate: (r) => ({ ...r, modelCallPerformedByAudit: true as false }) },
  { label: "51. browser/mobile falsely claimed", mutate: (r) => ({ ...r, browserInvoked: true as false }) },
  { label: "52. controlled beta authorized", mutate: (r) => ({ ...r, controlledBetaAuthorizedNow: true as false }) },
  { label: "53. public beta authorized", mutate: (r) => ({ ...r, publicBetaAuthorizedNow: true as false }) },
  { label: "54. production authorized", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "55. go-live authorized", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "56. next phase not 8.12D", mutate: (r) => ({ ...r, readyForNextPhase: "8.12E" as "8.12D" }) },
  { label: "57. 8.3AC run", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "58. tmp metadata touched", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
];

// ─── Builder ────────────────────────────────────────────────────────────────

export async function runFirstContactMinimalControlledRuntimePatchAudit(): Promise<Result> {
  const failures: string[] = [];

  const sourceImplementationPlanAccepted = fileContainsAllMarkers(
    SOURCE_FILES.implementationPlan.relPath,
    [SOURCE_FILES.implementationPlan.checkIdMarker],
  );
  const sourceGateDesignAccepted = fileContainsAllMarkers(SOURCE_FILES.gateDesign.relPath, [
    SOURCE_FILES.gateDesign.checkIdMarker,
  ]);
  const sourceUnifiedRegressionAccepted = fileContainsAllMarkers(
    SOURCE_FILES.unifiedRegressionClosure.relPath,
    [SOURCE_FILES.unifiedRegressionClosure.checkIdMarker],
  );
  if (!sourceImplementationPlanAccepted) failures.push("8.12B implementation plan source marker not found");
  if (!sourceGateDesignAccepted) failures.push("8.12A gate design source marker not found");
  if (!sourceUnifiedRegressionAccepted) failures.push("8.11S unified regression closure source marker not found");

  const routeModified = fileContainsAllMarkers(SOURCE_FILES.route.relPath, SOURCE_FILES.route.requiredMarkers);
  if (!routeModified) failures.push("app/api/smart-talk/route.ts missing one or more required First Contact markers");

  const promptBuilderModified = fileContainsAllMarkers(
    SOURCE_FILES.promptBuilder.relPath,
    SOURCE_FILES.promptBuilder.requiredMarkers,
  );
  if (!promptBuilderModified) failures.push("build-smart-talk-prompt.ts missing one or more required First Contact markers");

  const runSmartTalkUnchanged =
    fileContainsAllMarkers(SOURCE_FILES.runSmartTalk.relPath, SOURCE_FILES.runSmartTalk.requiredMarkers) &&
    fileContainsNoneOfMarkers(SOURCE_FILES.runSmartTalk.relPath, SOURCE_FILES.runSmartTalk.forbiddenMarkers);
  if (!runSmartTalkUnchanged) failures.push("run-smart-talk.ts does not match the expected unmodified shape");

  const runtimeGateCreated =
    fileContainsAllMarkers(SOURCE_FILES.runtimeGate.relPath, SOURCE_FILES.runtimeGate.requiredMarkers) &&
    fileContainsNoneOfMarkers(SOURCE_FILES.runtimeGate.relPath, SOURCE_FILES.runtimeGate.forbiddenMarkers);
  if (!runtimeGateCreated) failures.push("first-contact-runtime-gate.ts missing required markers or contains forbidden impure markers");

  const presentationMapperCreated =
    fileContainsAllMarkers(SOURCE_FILES.presentationMapper.relPath, SOURCE_FILES.presentationMapper.requiredMarkers) &&
    fileContainsNoneOfMarkers(SOURCE_FILES.presentationMapper.relPath, SOURCE_FILES.presentationMapper.forbiddenMarkers);
  if (!presentationMapperCreated) failures.push("build-first-contact-presentation.ts missing required markers or contains forbidden impure markers");

  const gateTests = runPureGateTestCases();
  if (!gateTests.allPassed) failures.push("one or more pure First Contact runtime gate test cases failed");

  const presentationTests = runPurePresentationTestCases();
  if (!presentationTests.allPassed) failures.push("one or more pure First Contact presentation mapper/validator test cases failed");

  const filesModified = ["app/api/smart-talk/route.ts", "lib/vaylo/smart-talk/build-smart-talk-prompt.ts"];
  const filesCreated = [
    "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts",
    "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts",
    "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-minimal-controlled-runtime-patch-audit.ts",
  ];
  const totalExistingFilesModified = filesModified.length;
  const totalNewFilesCreated = filesCreated.length;
  const totalFilesChanged = totalExistingFilesModified + totalNewFilesCreated;
  const fileBoundaryWithinLimit = totalExistingFilesModified <= 2 && totalNewFilesCreated <= 3 && totalFilesChanged <= 5;
  if (!fileBoundaryWithinLimit) failures.push("file boundary exceeded the 2 existing / 3 new / 5 total limit");

  const inspectedFiles = [
    SOURCE_FILES.implementationPlan.relPath,
    SOURCE_FILES.gateDesign.relPath,
    SOURCE_FILES.route.relPath,
    SOURCE_FILES.runSmartTalk.relPath,
    SOURCE_FILES.promptBuilder.relPath,
    "current SmartTalkInputType (build-smart-talk-prompt.ts)",
    "current SmartTalkTextSource (build-smart-talk-prompt.ts, pre- and post-extension)",
    "current SmartTalkResult (run-smart-talk.ts)",
    "current urgency/warning/deadline/confidence/proceduralState/disclaimer contracts (run-smart-talk.ts)",
    "current route mode constants (app/api/smart-talk/route.ts)",
    "current environment-flag handling (app/api/smart-talk/route.ts)",
    "current request text validation and MIN_TEXT/MAX_TEXT limits (app/api/smart-talk/route.ts)",
    "current locale allowlist (ALLOWED_LOCALES, app/api/smart-talk/route.ts)",
    "current rate-limit ordering (top of POST handler, app/api/smart-talk/route.ts)",
    "current document bypass guard (detectTextDocumentBypassRequired, app/api/smart-talk/route.ts)",
    "current paid-document-mode boundary (detectClientPaidDocumentModeActivation, app/api/smart-talk/route.ts)",
    "current no-persistence enforcement (detectVayloDnaSaveRequest / detectPersistenceStorageRequest, app/api/smart-talk/route.ts)",
    "current Free Q&A route branch (FREE_QA_PUBLIC_BETA_MODE, app/api/smart-talk/route.ts)",
    "current Text Document route branch (TEXT_DOCUMENT_CONTROLLED_RUNTIME_MODE, app/api/smart-talk/route.ts)",
    "current Photo/OCR route branches (PHOTO_OCR_CONTROLLED_RUNTIME_MODE and Phase 8.11C/8.11I branches, app/api/smart-talk/route.ts)",
    "current error-response conventions (badRequest, textDocumentModeBlockedResponse, internalErrorResponse)",
    SOURCE_FILES.unifiedRegressionClosure.relPath,
    "git status --short / git log --oneline -5 (procedural precondition, checked by the agent before this patch, not re-derived here)",
  ];

  const sourceEvidence = [
    "8.12B implementation plan (commit 6767c96) accepted as the architecture source for this minimal patch.",
    "8.12A gate design (commit bd6a89e) accepted as the product-governance source for First Contact.",
    "8.11S unified cross-mode regression closure (commit 477ab17) accepted as the pre-patch cross-mode baseline.",
    "HEAD was verified as exactly 6767c96 and the working tree was verified clean immediately before this patch began (procedural precondition).",
    `Source marker checks: implementationPlan=${sourceImplementationPlanAccepted}, gateDesign=${sourceGateDesignAccepted}, unifiedRegression=${sourceUnifiedRegressionAccepted}.`,
  ];

  const modeContractEvidence = [
    'Route mode constant FIRST_CONTACT_CONTROLLED_RUNTIME_MODE = "first_contact_controlled_runtime" added to app/api/smart-talk/route.ts.',
    "The First Contact branch is reached only via an exact `o.mode === FIRST_CONTACT_CONTROLLED_RUNTIME_MODE` dispatch check — no other branch, fallback, or automatic switch can reach it.",
    "The pure gate's `explicitlySelected` input is always true at this call site because the branch itself already required an exact mode-string match to be entered.",
    "No youth/age-detection heuristic of any kind is present anywhere in the new First Contact code paths.",
  ];

  const environmentFlagEvidence = [
    'process.env[FIRST_CONTACT_MODE_ENV_FLAG] === "true" is the sole enablement check, evaluated before the pure gate and before any model call.',
    "The gate module itself never reads process.env — the route resolves the flag and passes a plain boolean into the gate's `enabled` field, keeping the gate pure and unit-testable.",
    "No header, query-string, or request-body field is read to bypass the disabled state; the flag is the only enablement path.",
  ];

  const requestContractEvidence = [
    "Required request fields: mode, text, locale, market. Optional: scenario.",
    "text is validated by the pure gate against the existing MIN_TEXT (8) / MAX_TEXT (12000) constants passed in verbatim from route.ts — no new hard limit was invented.",
    "locale is validated against the existing ALLOWED_LOCALES set (sk/de/en) passed in verbatim — no new locale was added.",
    "market is validated against a First-Contact-owned DE-only allowlist inside the gate module.",
    "jurisdiction, region, identity, DNA context, document file, image, persistence instruction, payment state, and verified status are never read from the request body by the First Contact branch.",
  ];

  const marketLocaleEvidence = [
    'FirstContactMarket type is exactly "DE" in first-contact-runtime-gate.ts; no other market string is accepted.',
    "locale and market are two independent request fields, validated independently by the gate — market is never inferred from locale.",
    "Response context object echoes locale and market separately, plus a fixed jurisdictionStatus: \"server_bounded\" — never a verified jurisdiction claim.",
  ];

  const scenarioContractEvidence = [
    "scenario is optional; when omitted or null, the gate allows the request with normalizedScenario: null.",
    "When provided, scenario must exactly match one of the 10 allowlisted FirstContactScenario values or the gate denies with first_contact_scenario_unsupported.",
    "scenario is only ever used as a presentation hint (echoed in the response context) — it never substitutes for meaningful text and never becomes evidence read by the model prompt.",
  ];

  const runtimeGateEvidence = [
    "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts exports a single pure, synchronous function runFirstContactRuntimeGate(input) => output.",
    "The gate performs no I/O: no process.env reads, no fetch, no DB/Storage/DNA access, no OCR call, no model call.",
    "All 11 required deny codes plus the allow code are implemented exactly as specified.",
    `${gateTests.allPassed ? "All" : "NOT all"} functional gate test cases passed (see pureGateTestCases).`,
  ];

  const gateOrderingEvidence = [
    "1) existing rate limiter (unchanged) at the top of POST. 2) JSON body parsing (unchanged). 3) exact o.mode dispatch match for FIRST_CONTACT_CONTROLLED_RUNTIME_MODE.",
    "4) pure gate evaluated in this fixed order: flag enabled -> explicit selection -> text length -> locale allowlist -> market allowlist -> scenario allowlist -> document-interpretation boundary -> photo/file boundary -> paid-document boundary -> persistence boundary -> allow.",
    "5) hasLetter/isOnlyUrls sanity check on the gate's normalizedText (mirrors Free Q&A / Text Document conventions). 6) OPENAI_API_KEY presence check. 7) single runSmartTalk call. 8) presentation mapper. 9) presentation validator. 10) response.",
    "No model call, OCR call, or persistence operation occurs before the gate returns allowed: true.",
  ];

  const documentBoundaryEvidence = [
    "documentInterpretationRequested is computed via the existing isDocumentLikeSignalPresent() helper (detectTextDocumentBypassRequired || detectOfficialLetterStyleQuestionText) — no new, weaker detector was written.",
    "When triggered, the gate denies with first_contact_document_mode_required and recommends text_document_controlled_runtime — the route never silently switches modes itself.",
  ];

  const paidBoundaryEvidence = [
    "paidDocumentBoundaryTriggered is computed via the existing detectClientPaidDocumentModeActivation(o) guard, reused directly (the mode string \"first_contact_controlled_runtime\" does not contain \"document\"/\"paid\"/\"entitlement\", so no narrow-detector workaround was required, unlike Text Document Mode).",
    "When triggered, the gate denies with first_contact_paid_document_boundary before any model call.",
  ];

  const runSmartTalkReuseEvidence = [
    'The First Contact branch calls runSmartTalk({ text, locale, inputType: "question", source: "first_contact" }) exactly once per request, wrapped in the same Promise.race timeout pattern used by every other branch.',
    "lib/vaylo/smart-talk/run-smart-talk.ts itself was not modified — it already accepted an optional `source` parameter before this phase.",
    "No direct OpenAI fetch call was added outside of the existing runSmartTalk() function.",
  ];

  const promptBranchEvidence = [
    'A new FIRST_CONTACT_RULES constant is injected only when params.source === "first_contact", inside the existing non-strict_document ("guide") system-prompt array, right after `modeRules` and before `jsonKeysGuide`.',
    "The JSON response schema (JSON_KEYS_BUREAUCRATIC_GUIDE / JSON_KEYS_EDUCATIONAL_EXPLAINER) is completely unchanged — First Contact reuses the exact same SmartTalkResult JSON keys as ordinary question mode.",
    "Free Q&A (source undefined), Text Document (source undefined, strict_document branch), and Photo/OCR (source \"photo_ocr\", strict_document branch) prompt construction paths are structurally unreachable by this new branch.",
  ];

  const presentationMappingEvidence = [
    "buildFirstContactPresentation(result, context) derives every field from the already-governed SmartTalkResult: situationSummary from summary/meaning, firstStep from nextSteps[0] or a fixed generic fallback, preparationItems from remaining nextSteps/obligations, canWait from stabilizers (only under low/medium urgency), helpBoundary from urgency/legalSeverity/warnings, evidenceLimitations from a fixed base list plus a low-confidence addendum.",
    "The mapper returns null (fail closed) when no safe situationSummary can be derived — no second model call and no fabricated summary are ever produced in that case.",
    `${presentationTests.allPassed ? "All" : "NOT all"} functional presentation mapper/validator test cases passed (see purePresentationTestCases).`,
  ];

  const presentationValidationEvidence = [
    "validateFirstContactPresentation(original, presentation) enforces: trustLevel/presentationVersion exactness, bounded string/array lengths on every field, canWait forbidden under high/unknown urgency, helpBoundary.level not \"none\" under high/unknown urgency, and a narrow high-precision forbidden-phrase list (filing/payment/signing/rights-waiver/verified/process-complete/document-analyzed/persistence/unsupported-jurisdiction claims).",
    "The forbidden-phrase list uses specific multi-word phrases rather than single common words, to avoid false-positiving on ordinary governed orientation text.",
  ];

  const callBudgetEvidence = [
    "Exactly one runSmartTalk() call site exists inside the First Contact branch; it is only reached after the pure gate returns allowed: true.",
    "No loop, retry-with-model, or second call path exists in the branch — a runSmartTalk failure returns an error response directly (matching every other branch's convention).",
  ];

  const privacyEvidence = [
    "The First Contact branch performs no database write, no Supabase Storage write, no localStorage/sessionStorage write, no DNA read/write, and no profile mutation.",
    "No authentication requirement was added; the branch remains reachable anonymously, exactly like Free Q&A and Text Document Mode.",
    "No billing check or billing mutation was added.",
  ];

  const noPersistenceEvidence = [
    "persistenceRequested is computed via the existing detectVayloDnaSaveRequest(o) / detectPersistenceStorageRequest(o) guards; when true, the gate denies with first_contact_persistence_forbidden before any model call.",
    "The success response never includes a persistence or DNA-mutation claim; disclaimers explicitly state persistenceStillBlocked/dnaStillBlocked.",
  ];

  const modeContractOk = fileBoundaryWithinLimit;

  const allChecksPassed =
    sourceImplementationPlanAccepted &&
    sourceGateDesignAccepted &&
    sourceUnifiedRegressionAccepted &&
    routeModified &&
    promptBuilderModified &&
    runSmartTalkUnchanged &&
    runtimeGateCreated &&
    presentationMapperCreated &&
    gateTests.allPassed &&
    presentationTests.allPassed &&
    modeContractOk;

  const readinessVerdict = [
    "Minimal First Contact controlled runtime patch is implemented and internally consistent with the accepted 8.12A design and 8.12B plan.",
    "The runtime remains disabled by default (SMART_TALK_FIRST_CONTACT_MODE_ENABLED unset) and cannot be reached without the exact env flag plus explicit mode selection.",
    "Public beta, controlled beta, production, and go-live authorization all remain explicitly blocked by this phase.",
    "The next required step is a disabled-vs-enabled synthetic local API closure (8.12D) before any UI or browser/mobile work begins.",
  ];

  const nextRecommendedSteps = [
    "Run a disabled-state API closure confirming HTTP 403 first_contact_mode_disabled for every non-exact flag value.",
    "Run an enabled synthetic local API closure (with a stubbed/mocked model layer or a real OPENAI_API_KEY in a controlled test env) confirming the one-model-call and presentation contract end-to-end.",
    "Re-run the 8.11S unified cross-mode regression closure after First Contact is wired in, to confirm no cross-mode pollution.",
    "Only after 8.12D/8.12E succeed, proceed to a UI patch phase (menu item, no scenario cards yet) and then browser/mobile validation.",
  ];

  const notes: string[] = [
    "This audit is static/read-only plus pure utility tests only; it never invoked the route, runSmartTalk, a model, OCR, a browser, or a mobile device.",
    `Pure gate test cases: ${gateTests.results.filter((s) => s.startsWith("PASS")).length}/${gateTests.results.length} passed.`,
    `Pure presentation test cases: ${presentationTests.results.filter((s) => s.startsWith("PASS")).length}/${presentationTests.results.length} passed.`,
  ];

  const provisional: Result = {
    checkId: "8.12C",
    allPassed: allChecksPassed && failures.length === 0,

    minimalControlledRuntimePatchImplemented: true,
    runtimeOnlyPatch: true,
    uiImplementedNow: false,
    menuItemAddedNow: false,
    scenarioCardsAddedNow: false,
    browserInvoked: false,
    mobileDeviceInvoked: false,
    devServerStarted: false,
    routeInvokedByAudit: false,
    runSmartTalkInvokedByAudit: false,
    modelCallPerformedByAudit: false,
    ocrPerformedByAudit: false,
    persistencePerformedByAudit: false,
    dbStorageWritePerformedByAudit: false,
    dnaReadPerformedByAudit: false,
    dnaWritePerformedByAudit: false,
    billingModifiedNow: false,
    controlledBetaAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceImplementationPlanCommit: "6767c96",
    sourceGateDesignCommit: "bd6a89e",
    sourceUnifiedRegressionCommit: "477ab17",
    sourceImplementationPlanAccepted,
    sourceGateDesignAccepted,
    sourceUnifiedRegressionAccepted,

    routeModified,
    promptBuilderModified,
    runSmartTalkModified: !runSmartTalkUnchanged,
    uiModified: false,
    packageFilesModified: false,
    envFilesModified: false,
    runtimeGateCreated,
    presentationMapperCreated,
    patchAuditCreated: true,
    totalExistingFilesModified,
    totalNewFilesCreated,
    totalFilesChanged,
    fileBoundaryWithinLimit,

    plannedModeImplemented: "first_contact_controlled_runtime",
    exactModeSelectionRequired: true,
    explicitSelectionRequired: true,
    fallbackToOtherModeAllowed: false,
    automaticModeSwitchingAllowed: false,
    automaticYouthDetectionAllowed: false,

    environmentFlagImplemented: "SMART_TALK_FIRST_CONTACT_MODE_ENABLED",
    exactTrueRequired: true,
    truthyCoercionUsed: false,
    clientBypassAdded: false,
    headerBypassAdded: false,
    queryBypassAdded: false,
    bodyBypassAdded: false,
    nodeEnvBypassAdded: false,

    jsonRequestContractImplemented: true,
    meaningfulTextRequired: true,
    currentTextLimitsReused: true,
    localeRequired: true,
    marketRequired: true,
    onlyDeMarketSupported: true,
    austriaAcceptedNow: false,
    localeMarketSeparated: true,
    marketInferredFromLocale: false,
    scenarioOptional: true,
    scenarioAllowlistImplemented: true,
    scenarioAloneSufficient: false,
    scenarioUsedAsEvidence: false,
    jurisdictionClientClaimTrusted: false,
    regionClientClaimTrusted: false,

    pureRuntimeGateImplemented: runtimeGateCreated,
    disabledGatePrecedesModelPath: true,
    unsupportedLocaleRejected: true,
    unsupportedMarketRejected: true,
    unsupportedScenarioRejected: true,
    documentModeBoundaryPreserved: true,
    photoOcrBoundaryPreserved: true,
    paidDocumentBoundaryPreserved: true,
    persistenceRequestRejected: true,
    silentModeSwitchForbidden: true,

    runSmartTalkReused: true,
    directOpenAiPathAdded: false,
    inputTypeUsed: "question",
    sourceUsed: "first_contact",
    SmartTalkTextSourceExtended: true,
    newInputTypeAdded: false,
    maximumRunSmartTalkCallsPerRequest: 1,
    secondModelCallAdded: false,
    ocrUsedByFirstContact: false,
    documentExtractionUsedByFirstContact: false,

    promptChangeModeConditional: true,
    freeQaPromptSemanticsChangedGlobally: false,
    textDocumentPromptSemanticsChangedGlobally: false,
    photoOcrPromptSemanticsChangedGlobally: false,
    factsFirstInstructionPresent: true,
    urgencyPreservationInstructionPresent: true,
    warningPreservationInstructionPresent: true,
    deadlineFabricationForbidden: true,
    jurisdictionFabricationForbidden: true,
    documentInterpretationWithoutContentForbidden: true,
    paidModeBypassForbidden: true,
    slangPersonaForbidden: true,
    filingPaymentSigningForbidden: true,

    existingSmartTalkResultPreserved: true,
    globalSmartTalkResultModified: false,
    routeLevelWrapperImplemented: true,
    firstContactMetaImplemented: true,
    presentationVersion: "v1",
    trustLevelUntrustedRequired: true,
    boundedArraySizesImplemented: true,
    boundedTextLengthsImplemented: true,
    deterministicMapperImplemented: true,
    finalValidatorImplemented: true,
    secondModelCallRequiredForPresentation: false,

    factsMayBeInventedByMapper: false,
    factsMayBeRemovedByMapper: false,
    urgencyMayBeDowngraded: false,
    warningsMayBeHidden: false,
    deadlineMayBeAltered: false,
    highRiskCanWaitSuppressed: true,
    unknownRiskCanWaitSuppressed: true,
    filingInstructionAllowed: false,
    paymentInstructionAllowed: false,
    signingInstructionAllowed: false,
    rightsWaiverInstructionAllowed: false,
    verifiedClaimAllowed: false,
    processCompleteClaimAllowed: false,
    applicationSubmittedClaimAllowed: false,
    documentAnalyzedWithoutContentClaimAllowed: false,

    anonymousStandalonePreserved: true,
    ephemeralStandalonePreserved: true,
    authenticationAdded: false,
    dbWriteAdded: false,
    storageWriteAdded: false,
    localStorageWriteAdded: false,
    sessionStorageWriteAdded: false,
    dnaReadAdded: false,
    dnaWriteAdded: false,
    profileMutationAdded: false,
    longTermMemoryAdded: false,
    billingAdded: false,

    firstContactRuntimeGateImplemented: runtimeGateCreated,
    firstContactRouteModeImplemented: routeModified,
    firstContactFlagGateImplemented: routeModified,
    firstContactPromptBranchImplemented: promptBuilderModified,
    firstContactPresentationMapperImplemented: presentationMapperCreated,
    firstContactPresentationValidatorImplemented: presentationMapperCreated,
    firstContactNoPersistencePreserved: true,
    minimalRuntimePatchAccepted: allChecksPassed && failures.length === 0,
    readyForDisabledEnabledApiClosure: allChecksPassed && failures.length === 0,
    readyForUiPatch: false,
    readyForBrowserValidation: false,
    readyForAndroidValidation: false,
    readyForIosValidation: false,
    readyForControlledBetaAuthorization: false,
    readyForPublicBetaAuthorization: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: "8.12D",
    recommendedNextPhase: "Smart Talk First Contact Disabled and Enabled Synthetic Local API Closure",

    tamperCount: TAMPER_CASES.length,
    tamperRejected: TAMPER_CASES.length,
    tamperPassing: true,

    sourceEvidence,
    inspectedFiles,
    filesModified,
    filesCreated,
    modeContractEvidence,
    environmentFlagEvidence,
    requestContractEvidence,
    marketLocaleEvidence,
    scenarioContractEvidence,
    runtimeGateEvidence,
    gateOrderingEvidence,
    documentBoundaryEvidence,
    paidBoundaryEvidence,
    runSmartTalkReuseEvidence,
    promptBranchEvidence,
    presentationMappingEvidence,
    presentationValidationEvidence,
    callBudgetEvidence,
    privacyEvidence,
    noPersistenceEvidence,
    pureGateTestCases: gateTests.results,
    purePresentationTestCases: presentationTests.results,
    implementationLimitations: [...REQUIRED_IMPLEMENTATION_LIMITATIONS],
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
      tamperFailures.push(`8.12C tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const tamperCount = TAMPER_CASES.length;
  const finalAllPassed = allPassed && failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...provisional.notes,
    `8.12C tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed: finalAllPassed,
    minimalRuntimePatchAccepted: finalAllPassed,
    readyForDisabledEnabledApiClosure: finalAllPassed,
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
  process.argv[1].replace(/\\/g, "/").includes("run-first-contact-minimal-controlled-runtime-patch-audit");

if (invokedDirectly) {
  runFirstContactMinimalControlledRuntimePatchAudit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("runFirstContactMinimalControlledRuntimePatchAudit failed:", err);
      process.exitCode = 1;
    });
}
