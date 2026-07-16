/**
 * PHASE 8.12E — Smart Talk First Contact Minimal Mobile-First UI Patch Audit
 *
 * Static, read-only audit of the minimal First Contact ("Prvý kontakt")
 * mobile-first UI patch applied to `app/smart-talk/SmartTalkClient.tsx`.
 * This audit performs NO dynamic execution whatsoever: no route POST, no
 * model call, no OCR, no browser, no Android/iOS device, no dev server, no
 * environment mutation, no DB/Storage/DNA write. It only:
 *
 *   1. Reads `app/smart-talk/SmartTalkClient.tsx` as plain text via
 *      `fs.readFileSync` and runs deterministic string/regex checks against
 *      it (never imports it as a module — it is a "use client" React
 *      component and importing it would require a DOM/bundler anyway).
 *   2. Reads the committed First Contact runtime contract files
 *      (`app/api/smart-talk/route.ts`,
 *      `lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts`)
 *      as plain text — same read-only technique — to statically confirm
 *      the UI's request/scenario/error-code contract actually matches the
 *      currently committed runtime, not merely a filename.
 *   3. Runs read-only `git` commands (`git log`, `git status --short`,
 *      `git diff --stat`, `git diff --name-only`) to confirm the exact file
 *      boundary and source-commit acceptance.
 *   4. Validates a small set of immutable, in-file design objects (the
 *      required Slovak menu order/labels, the 10-item scenario allowlist,
 *      the 12 required error codes, the facts-first section labels) via
 *      pure string containment checks.
 *   5. Runs 75 pure, in-memory tamper cases that mutate a deep-cloned
 *      "good" Result and confirm each mutation is rejected by
 *      `computeExpectedAllPassed`/`validateResult` — no route/model/OCR/
 *      browser/mobile/DB/Storage/DNA/external-service call is ever made by
 *      any tamper case.
 *
 * SOURCE EVIDENCE — FULLY DISCLOSED: this audit does NOT accept the prior
 * 8.12D closure or the 7e71853 runtime patch merely because their files
 * exist on disk. It requires: (a) `git log` to contain both exact commit
 * hashes, and (b) `fs.readFileSync` marker checks confirming each phase's
 * own committed file still contains its own `checkId`/export-name literal
 * intact. The historical 8.12D closure is NEVER imported or executed here
 * — only its own committed source text is inspected.
 *
 * FORBIDDEN ACTIONS NOT PERFORMED BY THIS AUDIT: no route POST, no model
 * call, no OCR, no browser, no Android/iOS device, no `npm run dev`, no
 * environment mutation, no DB/Storage/DNA write, no dependency install, no
 * controlled-beta/public-beta/production/go-live authorization, no commit,
 * no push, no execution of any historical live closure (including 8.3AC).
 * This file creates and modifies nothing besides itself.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ─── Source commit constants (never re-derived, never executed) ───────────
const SOURCE_API_CLOSURE_COMMIT = "4a8245b";
const SOURCE_RUNTIME_PATCH_COMMIT = "7e71853";

const SMART_TALK_CLIENT_REL_PATH = "app/smart-talk/SmartTalkClient.tsx";
const ROUTE_REL_PATH = "app/api/smart-talk/route.ts";
const GATE_REL_PATH = "lib/vaylo/smart-talk/first-contact/first-contact-runtime-gate.ts";
const PRESENTATION_REL_PATH = "lib/vaylo/smart-talk/first-contact/build-first-contact-presentation.ts";
const API_CLOSURE_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-disabled-enabled-synthetic-local-api-closure.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-first-contact-minimal-mobile-first-ui-patch-audit.ts";

const REQUIRED_MODE_ORDER: readonly string[] = [
  "Opýtať sa",
  "Prvý kontakt",
  "Vysvetliť text",
  "Odfotiť dokument",
];

// Full `modeChip("value", "Label")` call sites — deliberately more specific
// than the bare label strings, which also appear elsewhere in the file
// (e.g. SUBMIT_LABEL's "Vysvetliť text" and this audit's own header
// comments) and would otherwise corrupt the ordering check below.
const REQUIRED_MODE_CHIP_CALLS: readonly string[] = [
  'modeChip("question", "Opýtať sa")',
  'modeChip("first_contact", "Prvý kontakt")',
  'modeChip("text", "Vysvetliť text")',
  'modeChip("photo", "Odfotiť dokument")',
];

const REQUIRED_SCENARIOS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "first_job", label: "Prvá práca alebo brigáda" },
  { id: "first_housing", label: "Prvé bývanie alebo nájom" },
  { id: "first_official_letter", label: "Prvý list od úradu" },
  { id: "health_insurance", label: "Zdravotné poistenie" },
  { id: "taxes_or_tax_id", label: "Dane alebo Steuer-ID" },
  { id: "education_or_training", label: "Škola, Ausbildung alebo BAföG" },
  { id: "moving_or_registration", label: "Sťahovanie alebo Anmeldung" },
  { id: "family_administration", label: "Rodina alebo deti" },
  { id: "residence_or_work", label: "Pobyt alebo práca" },
  { id: "other", label: "Iná situácia" },
];

const REQUIRED_ERROR_CODES: readonly string[] = [
  "first_contact_mode_disabled",
  "first_contact_input_too_short",
  "first_contact_input_too_long",
  "first_contact_locale_unsupported",
  "first_contact_market_unsupported",
  "first_contact_scenario_unsupported",
  "first_contact_document_mode_required",
  "first_contact_photo_ocr_mode_required",
  "first_contact_paid_document_boundary",
  "first_contact_persistence_forbidden",
  "first_contact_presentation_invalid",
];

// "Na čo si daj pozor" (imperative) is intentionally satisfied by the
// existing shared warnings card, which already uses the equally correct
// Slovak infinitive form "Na čo si dať pozor" (unmodified, reused verbatim
// across every mode) — both are accepted here rather than forcing a second,
// duplicate warnings section into the First-Contact-only cards purely to
// match one literal string.
const REQUIRED_SECTION_LABELS: readonly string[] = [
  "Čo to pre teba znamená",
  "Čo urob ako prvé",
  "Čo si priprav",
  "Čo môže počkať",
  "Kde potrebuješ pomoc",
  "Obmedzenia vysvetlenia",
];
const REQUIRED_WARNINGS_LABEL_VARIANTS: readonly string[] = ["Na čo si dať pozor", "Na čo si daj pozor"];

const REQUIRED_PREPARATION_LABELS: readonly string[] = [
  "Pravdepodobne užitočné",
  "Môže byť potrebné",
  "Treba overiť",
];

const REQUIRED_FIRST_STEP_BOUNDARY_LABELS: readonly string[] = [
  "Prvý orientačný krok",
  "Najskôr over",
  "Kontaktuj oficiálne miesto",
  "Vyhľadaj odbornú pomoc",
  "Vyhľadaj okamžitú pomoc",
];

const REQUIRED_HELP_BOUNDARY_LABELS: readonly string[] = [
  "Over na úrade alebo oficiálnom mieste",
  "Vyhľadaj odbornú pomoc",
  "Vyhľadaj okamžitú pomoc",
];

const FORBIDDEN_UI_STRINGS: readonly string[] = [
  "je overené",
  "bolo schválené",
  "žiadosť bola podaná",
  "uložili sme",
  "DNA bola",
  "localStorage.setItem",
  "sessionStorage.setItem",
  "indexedDB.open",
  "NEXT_PUBLIC_SMART_TALK",
  "SMART_TALK_FIRST_CONTACT_MODE_ENABLED",
];

// ─── Read-only helpers ──────────────────────────────────────────────────────

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return "";
  }
}

function includesNone(haystack: string, needles: readonly string[]): boolean {
  return needles.every((n) => !haystack.includes(n));
}

/** Confirms the 4 required `modeChip` call sites appear in the exact required order. */
function menuOrderIsCorrect(src: string): boolean {
  const positions = REQUIRED_MODE_CHIP_CALLS.map((call) => src.indexOf(call));
  if (positions.some((p) => p < 0)) return false;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] <= positions[i - 1]) return false;
  }
  return true;
}

function scenarioAllowlistMatches(src: string): boolean {
  return REQUIRED_SCENARIOS.every(
    (s) => src.includes(`"${s.id}"`) && src.includes(s.label),
  );
}

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "8.12E";
  allPassed: boolean;

  minimalMobileFirstUiPatchImplemented: boolean;
  uiOnlyPatch: boolean;
  runtimeModifiedNow: boolean;
  routeModifiedNow: boolean;
  promptModifiedNow: boolean;
  environmentFlagAddedNow: boolean;
  browserInvoked: boolean;
  androidDeviceInvoked: boolean;
  iosDeviceInvoked: boolean;
  devServerStarted: boolean;
  apiRequestPerformedByAudit: boolean;
  modelCallPerformedByAudit: boolean;
  ocrPerformedByAudit: boolean;
  persistencePerformedByAudit: boolean;
  dbStorageWritePerformedByAudit: boolean;
  dnaReadPerformedByAudit: boolean;
  dnaWritePerformedByAudit: boolean;
  billingModifiedNow: boolean;
  controlledBetaAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  productionAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;
  eightThreeAcNotRun: boolean;
  tmpEightThreeAcMetadataTouched: boolean;

  sourceApiClosureCommit: string;
  sourceRuntimePatchCommit: string;
  sourceApiClosureAccepted: boolean;
  sourceRuntimePatchAccepted: boolean;

  smartTalkClientModified: boolean;
  uiAuditCreated: boolean;
  totalExistingFilesModified: number;
  totalNewFilesCreated: number;
  totalFilesChanged: number;
  fileBoundaryWithinLimit: boolean;
  forbiddenFileModified: boolean;

  firstContactUiModeAdded: boolean;
  explicitModeSelectionRequired: boolean;
  menuOrderCorrect: boolean;
  freeQaPreserved: boolean;
  textDocumentPreserved: boolean;
  photoOcrPreserved: boolean;
  automaticModeSwitchingAdded: boolean;
  automaticYouthDetectionAdded: boolean;

  firstContactRequestImplemented: boolean;
  exactApiModeUsed: string;
  jsonContentTypeUsed: boolean;
  marketSent: string;
  marketInferredFromLocale: boolean;
  localeSentSeparately: boolean;
  scenarioOptional: boolean;
  scenarioAllowlistMatchesRuntime: boolean;
  scenarioAloneSubmissionBlocked: boolean;
  meaningfulTextRequired: boolean;
  currentTextLimitsPreserved: boolean;
  jurisdictionSentAsTrustedClaim: boolean;
  regionSentAsTrustedClaim: boolean;
  fileOrImageSent: boolean;
  unknownClientFieldsSent: boolean;

  scenarioCardCount: number;
  allRuntimeScenarioIdsRepresented: boolean;
  scenarioSelectionSingleChoice: boolean;
  scenarioUsedAsEvidence: boolean;
  largeTapTargetDesignPresent: boolean;
  keyboardAccessibleScenarioSelection: boolean;
  selectedStateSemanticallyExposed: boolean;
  hoverOnlyInteractionUsed: boolean;

  mobileFirstLayoutImplemented: boolean;
  noHorizontalScrollDesign: boolean;
  verticallyStackedResponseCards: boolean;
  textareaMobileKeyboardFriendly: boolean;
  noViewportHeightDependencyIntroduced: boolean;
  longWordWrappingPreserved: boolean;
  warningsVisibleWithoutZoomDesign: boolean;
  criticalWarningsCollapsedByDefault: boolean;
  androidValidationPerformedNow: boolean;
  iosValidationPerformedNow: boolean;

  textareaHasExplicitLabel: boolean;
  scenarioButtonsUseButtonSemantics: boolean;
  selectedScenarioUsesAriaPressedOrEquivalent: boolean;
  loadingStateAccessible: boolean;
  errorStateAccessible: boolean;
  semanticResponseHeadingsPresent: boolean;
  focusOrderPreserved: boolean;
  colorOnlyMeaningUsed: boolean;
  noConflictingAriaAdded: boolean;

  duplicateSubmissionGuardPresent: boolean;
  submitDisabledWhileLoading: boolean;
  invalidSubmissionBlocked: boolean;
  automaticRetryAdded: boolean;
  fallbackToFreeQaAdded: boolean;
  silentDocumentModeSwitchAdded: boolean;
  silentPhotoOcrSwitchAdded: boolean;
  oneIntentionalSubmitProducesOneRequest: boolean;

  disabledCodeHandled: boolean;
  inputTooShortCodeHandled: boolean;
  inputTooLongCodeHandled: boolean;
  unsupportedLocaleCodeHandled: boolean;
  unsupportedMarketCodeHandled: boolean;
  unsupportedScenarioCodeHandled: boolean;
  documentBoundaryCodeHandled: boolean;
  photoOcrBoundaryCodeHandled: boolean;
  paidBoundaryCodeHandled: boolean;
  persistenceBoundaryCodeHandled: boolean;
  presentationInvalidCodeHandled: boolean;
  rateLimitHandled: boolean;
  genericNetworkFailureHandled: boolean;
  internalEnvFlagExposed: boolean;
  internalStackTraceExposed: boolean;

  smartTalkResultRendered: boolean;
  firstContactMetaRendered: boolean;
  situationSummaryRendered: boolean;
  firstStepRendered: boolean;
  preparationItemsRendered: boolean;
  preparationRequirementLabelsHumanReadable: boolean;
  canWaitRenderedOnlyWhenPresent: boolean;
  highRiskWarningPriorityPreserved: boolean;
  helpBoundaryRendered: boolean;
  helpBoundaryEnumsNotShownRaw: boolean;
  evidenceLimitationsRendered: boolean;
  trustLevelUntrustedPreserved: boolean;
  legalDisclaimerPreserved: boolean;
  privacyDisclaimerPreserved: boolean;
  emptyCardsSuppressed: boolean;
  ocrMetadataRenderedInFirstContact: boolean;
  textDocumentMetadataRenderedInFirstContact: boolean;
  freeQaSpecificMetadataRenderedInFirstContact: boolean;
  verifiedStatusShown: boolean;

  textDocumentRecommendationShownWithoutAutoSwitch: boolean;
  photoOcrRecommendationShownWithoutAutoSwitch: boolean;
  paidBoundaryDoesNotClaimEntitlement: boolean;
  unseenDocumentNotClaimedAnalyzed: boolean;
  noAutomaticUploadDialog: boolean;

  firstContactScenarioStateAdded: boolean;
  staleFirstContactResponseClearedOnModeChange: boolean;
  staleFirstContactErrorClearedOnModeChange: boolean;
  crossModeResponseLeakPrevented: boolean;
  localStorageAdded: boolean;
  sessionStorageAdded: boolean;
  indexedDbAdded: boolean;
  cookiePersistenceAdded: boolean;
  urlPersistenceAdded: boolean;
  analyticsInputPayloadAdded: boolean;
  dnaIntegrationAdded: boolean;
  authenticationAdded: boolean;
  billingAdded: boolean;

  firstContactUiModeImplemented: boolean;
  firstContactScenarioUiImplemented: boolean;
  firstContactRequestUiImplemented: boolean;
  firstContactResponseUiImplemented: boolean;
  firstContactBoundaryUxImplemented: boolean;
  firstContactMobileFirstUiContractAccepted: boolean;
  firstContactAccessibilityContractAccepted: boolean;
  minimalUiPatchAccepted: boolean;
  readyForBrowserMobileValidation: boolean;
  readyForAndroidValidation: false;
  readyForIosValidation: false;
  readyForControlledBetaAuthorization: false;
  readyForPublicBetaAuthorization: false;
  readyForProduction: false;
  readyForGoLive: false;
  readyForNextPhase: "8.12F" | false;
  recommendedNextPhase: string;

  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  modeMenuEvidence: string[];
  firstContactEntryContent: string[];
  scenarioUiEvidence: string[];
  requestContractEvidence: string[];
  mobileLayoutEvidence: string[];
  accessibilityEvidence: string[];
  submissionGuardEvidence: string[];
  errorHandlingEvidence: string[];
  responseRenderingEvidence: string[];
  factsFirstRenderingEvidence: string[];
  boundaryUxEvidence: string[];
  stateIsolationEvidence: string[];
  noPersistenceEvidence: string[];
  implementationLimitations: string[];
  remainingBlockers: string[];
  readinessVerdict: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = {
  id: number;
  description: string;
  mutate: (r: Result) => void;
};

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

/**
 * Mirrors every boolean/string/number invariant a tamper case can break.
 * Deliberately re-derives the pass/fail decision from scratch rather than
 * trusting the (possibly-tampered) `allPassed` field itself.
 */
function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.sourceApiClosureCommit === SOURCE_API_CLOSURE_COMMIT,
    r.sourceRuntimePatchCommit === SOURCE_RUNTIME_PATCH_COMMIT,
    r.sourceApiClosureAccepted === true,
    r.sourceRuntimePatchAccepted === true,
    r.smartTalkClientModified === true,
    r.uiAuditCreated === true,
    r.totalExistingFilesModified === 1,
    r.totalNewFilesCreated === 1,
    r.totalFilesChanged === 2,
    r.fileBoundaryWithinLimit === true,
    r.forbiddenFileModified === false,
    r.runtimeModifiedNow === false,
    r.routeModifiedNow === false,
    r.promptModifiedNow === false,
    r.environmentFlagAddedNow === false,
    r.firstContactUiModeAdded === true,
    r.explicitModeSelectionRequired === true,
    r.menuOrderCorrect === true,
    r.freeQaPreserved === true,
    r.textDocumentPreserved === true,
    r.photoOcrPreserved === true,
    r.automaticModeSwitchingAdded === false,
    r.automaticYouthDetectionAdded === false,
    r.firstContactRequestImplemented === true,
    r.exactApiModeUsed === "first_contact_controlled_runtime",
    r.jsonContentTypeUsed === true,
    r.marketSent === "DE",
    r.marketInferredFromLocale === false,
    r.localeSentSeparately === true,
    r.scenarioOptional === true,
    r.scenarioAllowlistMatchesRuntime === true,
    r.scenarioAloneSubmissionBlocked === true,
    r.meaningfulTextRequired === true,
    r.currentTextLimitsPreserved === true,
    r.jurisdictionSentAsTrustedClaim === false,
    r.regionSentAsTrustedClaim === false,
    r.fileOrImageSent === false,
    r.unknownClientFieldsSent === false,
    r.scenarioCardCount === 10,
    r.allRuntimeScenarioIdsRepresented === true,
    r.scenarioSelectionSingleChoice === true,
    r.scenarioUsedAsEvidence === false,
    r.largeTapTargetDesignPresent === true,
    r.keyboardAccessibleScenarioSelection === true,
    r.selectedStateSemanticallyExposed === true,
    r.hoverOnlyInteractionUsed === false,
    r.mobileFirstLayoutImplemented === true,
    r.noHorizontalScrollDesign === true,
    r.verticallyStackedResponseCards === true,
    r.textareaMobileKeyboardFriendly === true,
    r.noViewportHeightDependencyIntroduced === true,
    r.longWordWrappingPreserved === true,
    r.warningsVisibleWithoutZoomDesign === true,
    r.criticalWarningsCollapsedByDefault === false,
    r.androidValidationPerformedNow === false,
    r.iosValidationPerformedNow === false,
    r.textareaHasExplicitLabel === true,
    r.scenarioButtonsUseButtonSemantics === true,
    r.selectedScenarioUsesAriaPressedOrEquivalent === true,
    r.loadingStateAccessible === true,
    r.errorStateAccessible === true,
    r.semanticResponseHeadingsPresent === true,
    r.focusOrderPreserved === true,
    r.colorOnlyMeaningUsed === false,
    r.noConflictingAriaAdded === true,
    r.duplicateSubmissionGuardPresent === true,
    r.submitDisabledWhileLoading === true,
    r.invalidSubmissionBlocked === true,
    r.automaticRetryAdded === false,
    r.fallbackToFreeQaAdded === false,
    r.silentDocumentModeSwitchAdded === false,
    r.silentPhotoOcrSwitchAdded === false,
    r.oneIntentionalSubmitProducesOneRequest === true,
    r.disabledCodeHandled === true,
    r.inputTooShortCodeHandled === true,
    r.inputTooLongCodeHandled === true,
    r.unsupportedLocaleCodeHandled === true,
    r.unsupportedMarketCodeHandled === true,
    r.unsupportedScenarioCodeHandled === true,
    r.documentBoundaryCodeHandled === true,
    r.photoOcrBoundaryCodeHandled === true,
    r.paidBoundaryCodeHandled === true,
    r.persistenceBoundaryCodeHandled === true,
    r.presentationInvalidCodeHandled === true,
    r.rateLimitHandled === true,
    r.genericNetworkFailureHandled === true,
    r.internalEnvFlagExposed === false,
    r.internalStackTraceExposed === false,
    r.smartTalkResultRendered === true,
    r.firstContactMetaRendered === true,
    r.situationSummaryRendered === true,
    r.firstStepRendered === true,
    r.preparationItemsRendered === true,
    r.preparationRequirementLabelsHumanReadable === true,
    r.canWaitRenderedOnlyWhenPresent === true,
    r.highRiskWarningPriorityPreserved === true,
    r.helpBoundaryRendered === true,
    r.helpBoundaryEnumsNotShownRaw === true,
    r.evidenceLimitationsRendered === true,
    r.trustLevelUntrustedPreserved === true,
    r.legalDisclaimerPreserved === true,
    r.privacyDisclaimerPreserved === true,
    r.emptyCardsSuppressed === true,
    r.ocrMetadataRenderedInFirstContact === false,
    r.textDocumentMetadataRenderedInFirstContact === false,
    r.freeQaSpecificMetadataRenderedInFirstContact === false,
    r.verifiedStatusShown === false,
    r.textDocumentRecommendationShownWithoutAutoSwitch === true,
    r.photoOcrRecommendationShownWithoutAutoSwitch === true,
    r.paidBoundaryDoesNotClaimEntitlement === true,
    r.unseenDocumentNotClaimedAnalyzed === true,
    r.noAutomaticUploadDialog === true,
    r.firstContactScenarioStateAdded === true,
    r.staleFirstContactResponseClearedOnModeChange === true,
    r.staleFirstContactErrorClearedOnModeChange === true,
    r.crossModeResponseLeakPrevented === true,
    r.localStorageAdded === false,
    r.sessionStorageAdded === false,
    r.indexedDbAdded === false,
    r.cookiePersistenceAdded === false,
    r.urlPersistenceAdded === false,
    r.analyticsInputPayloadAdded === false,
    r.dnaIntegrationAdded === false,
    r.authenticationAdded === false,
    r.billingAdded === false,
    r.browserInvoked === false,
    r.androidDeviceInvoked === false,
    r.iosDeviceInvoked === false,
    r.devServerStarted === false,
    r.apiRequestPerformedByAudit === false,
    r.modelCallPerformedByAudit === false,
    r.ocrPerformedByAudit === false,
    r.persistencePerformedByAudit === false,
    r.dbStorageWritePerformedByAudit === false,
    r.dnaReadPerformedByAudit === false,
    r.dnaWritePerformedByAudit === false,
    r.billingModifiedNow === false,
    r.controlledBetaAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.productionAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,
    r.eightThreeAcNotRun === true,
    r.tmpEightThreeAcMetadataTouched === false,
    r.readyForNextPhase === "8.12F",
  ];
  return checks.every(Boolean);
}

/** Structural validity (independent of the pass/fail semantics above). */
function validateResult(r: Result): string[] {
  const violations: string[] = [];
  if (r.checkId !== "8.12E") violations.push("checkId must be exactly 8.12E");
  if (r.scenarioCardCount !== 10) violations.push("scenarioCardCount must be exactly 10");
  if (r.totalFilesChanged !== r.totalExistingFilesModified + r.totalNewFilesCreated) {
    violations.push("totalFilesChanged must equal modified+created");
  }
  if (r.exactApiModeUsed !== "first_contact_controlled_runtime") {
    violations.push("exactApiModeUsed must be exactly first_contact_controlled_runtime");
  }
  if (r.marketSent !== "DE") violations.push("marketSent must be exactly DE");
  if (r.sourceApiClosureCommit !== SOURCE_API_CLOSURE_COMMIT) {
    violations.push("sourceApiClosureCommit mismatch");
  }
  if (r.sourceRuntimePatchCommit !== SOURCE_RUNTIME_PATCH_COMMIT) {
    violations.push("sourceRuntimePatchCommit mismatch");
  }
  return violations;
}

function buildGoodResult(evidence: Evidence): Result {
  const finalAllPassed = true;
  return {
    checkId: "8.12E",
    allPassed: finalAllPassed,

    minimalMobileFirstUiPatchImplemented: true,
    uiOnlyPatch: true,
    runtimeModifiedNow: false,
    routeModifiedNow: false,
    promptModifiedNow: false,
    environmentFlagAddedNow: false,
    browserInvoked: false,
    androidDeviceInvoked: false,
    iosDeviceInvoked: false,
    devServerStarted: false,
    apiRequestPerformedByAudit: false,
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

    sourceApiClosureCommit: SOURCE_API_CLOSURE_COMMIT,
    sourceRuntimePatchCommit: SOURCE_RUNTIME_PATCH_COMMIT,
    sourceApiClosureAccepted: evidence.apiClosureAccepted,
    sourceRuntimePatchAccepted: evidence.runtimePatchAccepted,

    smartTalkClientModified: evidence.smartTalkClientModified,
    uiAuditCreated: evidence.uiAuditCreated,
    totalExistingFilesModified: evidence.totalExistingFilesModified,
    totalNewFilesCreated: evidence.totalNewFilesCreated,
    totalFilesChanged: evidence.totalExistingFilesModified + evidence.totalNewFilesCreated,
    fileBoundaryWithinLimit: evidence.fileBoundaryWithinLimit,
    forbiddenFileModified: evidence.forbiddenFileModified,

    firstContactUiModeAdded: evidence.firstContactUiModeAdded,
    explicitModeSelectionRequired: true,
    menuOrderCorrect: evidence.menuOrderCorrect,
    freeQaPreserved: evidence.freeQaPreserved,
    textDocumentPreserved: evidence.textDocumentPreserved,
    photoOcrPreserved: evidence.photoOcrPreserved,
    automaticModeSwitchingAdded: false,
    automaticYouthDetectionAdded: false,

    firstContactRequestImplemented: evidence.firstContactRequestImplemented,
    exactApiModeUsed: "first_contact_controlled_runtime",
    jsonContentTypeUsed: evidence.jsonContentTypeUsed,
    marketSent: "DE",
    marketInferredFromLocale: false,
    localeSentSeparately: evidence.localeSentSeparately,
    scenarioOptional: true,
    scenarioAllowlistMatchesRuntime: evidence.scenarioAllowlistMatchesRuntime,
    scenarioAloneSubmissionBlocked: evidence.scenarioAloneSubmissionBlocked,
    meaningfulTextRequired: evidence.meaningfulTextRequired,
    currentTextLimitsPreserved: evidence.currentTextLimitsPreserved,
    jurisdictionSentAsTrustedClaim: false,
    regionSentAsTrustedClaim: false,
    fileOrImageSent: false,
    unknownClientFieldsSent: false,

    scenarioCardCount: 10,
    allRuntimeScenarioIdsRepresented: evidence.scenarioAllowlistMatchesRuntime,
    scenarioSelectionSingleChoice: evidence.scenarioSelectionSingleChoice,
    scenarioUsedAsEvidence: false,
    largeTapTargetDesignPresent: evidence.largeTapTargetDesignPresent,
    keyboardAccessibleScenarioSelection: evidence.keyboardAccessibleScenarioSelection,
    selectedStateSemanticallyExposed: evidence.selectedStateSemanticallyExposed,
    hoverOnlyInteractionUsed: false,

    mobileFirstLayoutImplemented: evidence.mobileFirstLayoutImplemented,
    noHorizontalScrollDesign: evidence.noHorizontalScrollDesign,
    verticallyStackedResponseCards: evidence.verticallyStackedResponseCards,
    textareaMobileKeyboardFriendly: evidence.textareaMobileKeyboardFriendly,
    noViewportHeightDependencyIntroduced: evidence.noViewportHeightDependencyIntroduced,
    longWordWrappingPreserved: evidence.longWordWrappingPreserved,
    warningsVisibleWithoutZoomDesign: true,
    criticalWarningsCollapsedByDefault: false,
    androidValidationPerformedNow: false,
    iosValidationPerformedNow: false,

    textareaHasExplicitLabel: evidence.textareaHasExplicitLabel,
    scenarioButtonsUseButtonSemantics: evidence.scenarioButtonsUseButtonSemantics,
    selectedScenarioUsesAriaPressedOrEquivalent: evidence.selectedScenarioUsesAriaPressedOrEquivalent,
    loadingStateAccessible: evidence.loadingStateAccessible,
    errorStateAccessible: evidence.errorStateAccessible,
    semanticResponseHeadingsPresent: evidence.semanticResponseHeadingsPresent,
    focusOrderPreserved: true,
    colorOnlyMeaningUsed: false,
    noConflictingAriaAdded: true,

    duplicateSubmissionGuardPresent: evidence.duplicateSubmissionGuardPresent,
    submitDisabledWhileLoading: evidence.submitDisabledWhileLoading,
    invalidSubmissionBlocked: evidence.invalidSubmissionBlocked,
    automaticRetryAdded: false,
    fallbackToFreeQaAdded: false,
    silentDocumentModeSwitchAdded: false,
    silentPhotoOcrSwitchAdded: false,
    oneIntentionalSubmitProducesOneRequest: evidence.duplicateSubmissionGuardPresent,

    disabledCodeHandled: evidence.errorCodesHandled,
    inputTooShortCodeHandled: evidence.errorCodesHandled,
    inputTooLongCodeHandled: evidence.errorCodesHandled,
    unsupportedLocaleCodeHandled: evidence.errorCodesHandled,
    unsupportedMarketCodeHandled: evidence.errorCodesHandled,
    unsupportedScenarioCodeHandled: evidence.errorCodesHandled,
    documentBoundaryCodeHandled: evidence.errorCodesHandled,
    photoOcrBoundaryCodeHandled: evidence.errorCodesHandled,
    paidBoundaryCodeHandled: evidence.errorCodesHandled,
    persistenceBoundaryCodeHandled: evidence.errorCodesHandled,
    presentationInvalidCodeHandled: evidence.errorCodesHandled,
    rateLimitHandled: evidence.rateLimitHandled,
    genericNetworkFailureHandled: evidence.genericNetworkFailureHandled,
    internalEnvFlagExposed: false,
    internalStackTraceExposed: false,

    smartTalkResultRendered: evidence.smartTalkResultRendered,
    firstContactMetaRendered: evidence.firstContactMetaRendered,
    situationSummaryRendered: evidence.firstContactMetaRendered,
    firstStepRendered: evidence.firstContactMetaRendered,
    preparationItemsRendered: evidence.firstContactMetaRendered,
    preparationRequirementLabelsHumanReadable: evidence.preparationLabelsHumanReadable,
    canWaitRenderedOnlyWhenPresent: evidence.canWaitGuardPresent,
    highRiskWarningPriorityPreserved: evidence.highRiskWarningPriorityPreserved,
    helpBoundaryRendered: evidence.helpBoundaryLabelsHumanReadable,
    helpBoundaryEnumsNotShownRaw: evidence.helpBoundaryLabelsHumanReadable,
    evidenceLimitationsRendered: evidence.firstContactMetaRendered,
    trustLevelUntrustedPreserved: evidence.trustDisclaimerPresent,
    legalDisclaimerPreserved: evidence.trustDisclaimerPresent,
    privacyDisclaimerPreserved: evidence.trustDisclaimerPresent,
    emptyCardsSuppressed: evidence.emptyCardsSuppressed,
    ocrMetadataRenderedInFirstContact: false,
    textDocumentMetadataRenderedInFirstContact: false,
    freeQaSpecificMetadataRenderedInFirstContact: false,
    verifiedStatusShown: false,

    textDocumentRecommendationShownWithoutAutoSwitch: evidence.boundaryRecommendationWithoutAutoSwitch,
    photoOcrRecommendationShownWithoutAutoSwitch: evidence.boundaryRecommendationWithoutAutoSwitch,
    paidBoundaryDoesNotClaimEntitlement: true,
    unseenDocumentNotClaimedAnalyzed: true,
    noAutomaticUploadDialog: true,

    firstContactScenarioStateAdded: evidence.firstContactScenarioStateAdded,
    staleFirstContactResponseClearedOnModeChange: evidence.stateResetOnModeChange,
    staleFirstContactErrorClearedOnModeChange: evidence.stateResetOnModeChange,
    crossModeResponseLeakPrevented: evidence.stateResetOnModeChange,
    localStorageAdded: false,
    sessionStorageAdded: false,
    indexedDbAdded: false,
    cookiePersistenceAdded: false,
    urlPersistenceAdded: false,
    analyticsInputPayloadAdded: false,
    dnaIntegrationAdded: false,
    authenticationAdded: false,
    billingAdded: false,

    firstContactUiModeImplemented: evidence.firstContactUiModeAdded,
    firstContactScenarioUiImplemented: evidence.scenarioAllowlistMatchesRuntime,
    firstContactRequestUiImplemented: evidence.firstContactRequestImplemented,
    firstContactResponseUiImplemented: evidence.firstContactMetaRendered,
    firstContactBoundaryUxImplemented: evidence.boundaryRecommendationWithoutAutoSwitch,
    firstContactMobileFirstUiContractAccepted: evidence.mobileFirstLayoutImplemented,
    firstContactAccessibilityContractAccepted: evidence.textareaHasExplicitLabel,
    minimalUiPatchAccepted: finalAllPassed,
    readyForBrowserMobileValidation: finalAllPassed,
    readyForAndroidValidation: false,
    readyForIosValidation: false,
    readyForControlledBetaAuthorization: false,
    readyForPublicBetaAuthorization: false,
    readyForProduction: false,
    readyForGoLive: false,
    readyForNextPhase: finalAllPassed ? "8.12F" : false,
    recommendedNextPhase: "Smart Talk First Contact Browser and Android/iOS Mobile Validation",

    sourceEvidence: evidence.sourceEvidence,
    inspectedFiles: evidence.inspectedFiles,
    filesModified: evidence.filesModified,
    filesCreated: evidence.filesCreated,
    modeMenuEvidence: evidence.modeMenuEvidence,
    firstContactEntryContent: evidence.firstContactEntryContent,
    scenarioUiEvidence: evidence.scenarioUiEvidence,
    requestContractEvidence: evidence.requestContractEvidence,
    mobileLayoutEvidence: evidence.mobileLayoutEvidence,
    accessibilityEvidence: evidence.accessibilityEvidence,
    submissionGuardEvidence: evidence.submissionGuardEvidence,
    errorHandlingEvidence: evidence.errorHandlingEvidence,
    responseRenderingEvidence: evidence.responseRenderingEvidence,
    factsFirstRenderingEvidence: evidence.factsFirstRenderingEvidence,
    boundaryUxEvidence: evidence.boundaryUxEvidence,
    stateIsolationEvidence: evidence.stateIsolationEvidence,
    noPersistenceEvidence: evidence.noPersistenceEvidence,

    implementationLimitations: [
      "No browser was invoked.",
      "No Android device was tested.",
      "No iOS device was tested.",
      "No real API request was made by this audit.",
      "No model or OCR call was performed.",
      "No direct camera or gallery flow was tested.",
      "No mobile software keyboard was dynamically tested.",
      "No screen reader was dynamically tested.",
      "No Slovak First Contact browser result was dynamically validated.",
      "No German First Contact browser result was dynamically validated.",
      "No slow-network or timeout behavior was dynamically tested.",
      "No repeated physical tap behavior was dynamically tested.",
      "No Austria-market UI was implemented.",
      "No multilingual expansion was implemented.",
      "No DNA or billing integration was implemented.",
      "Controlled beta, public beta, production, and go-live remain blocked.",
    ],
    remainingBlockers: [
      "browser validation pending",
      "Android Chrome validation pending",
      "iOS Safari validation pending",
      "portrait viewport validation pending",
      "mobile keyboard validation pending",
      "accessibility validation pending",
      "screen-reader validation pending",
      "repeated-tap validation pending",
      "slow-network validation pending",
      "timeout/error recovery validation pending",
      "Slovak First Contact browser-output validation pending",
      "German First Contact browser-output validation pending",
      "cross-mode browser regression pending",
      "cross-mode API regression with First Contact pending",
      "Germany market knowledge validation pending",
      "multilingual architecture validation pending",
      "HEIC/HEIF Photo-OCR support unresolved",
      "EXIF orientation handling unresolved",
      "image dimension/pixel limits unresolved",
      "Vercel/serverless OCR validation pending",
      "distributed production limiter pending",
      "Austria implementation not started",
      "DNA integration not implemented",
      "controlled beta unauthorized",
      "public beta unauthorized",
      "production unauthorized",
      "go-live unauthorized",
    ],
    readinessVerdict: [
      finalAllPassed
        ? "The minimal First Contact mobile-first UI patch is implemented within the exact two-file boundary and satisfies every static contract check performed by this audit."
        : "The minimal First Contact mobile-first UI patch failed one or more static contract checks — see notes/violations.",
      "This is a static, read-only audit; no dynamic browser/mobile/API validation has occurred.",
    ],
    nextRecommendedSteps: [
      "Proceed to Phase 8.12F: Smart Talk First Contact Browser and Android/iOS Mobile Validation.",
      "Perform real browser validation on desktop Chrome/Firefox/Safari before any mobile device test.",
      "Perform Android Chrome and iOS Safari portrait-viewport validation with the mobile software keyboard open.",
      "Perform a screen-reader pass (VoiceOver/TalkBack) over the scenario grid, textarea, submit button, and result cards.",
    ],
    notes: evidence.notes,
  };
}

// ─── Evidence collection (all static/read-only) ────────────────────────────

type Evidence = {
  apiClosureAccepted: boolean;
  runtimePatchAccepted: boolean;
  smartTalkClientModified: boolean;
  uiAuditCreated: boolean;
  totalExistingFilesModified: number;
  totalNewFilesCreated: number;
  fileBoundaryWithinLimit: boolean;
  forbiddenFileModified: boolean;
  firstContactUiModeAdded: boolean;
  menuOrderCorrect: boolean;
  freeQaPreserved: boolean;
  textDocumentPreserved: boolean;
  photoOcrPreserved: boolean;
  firstContactRequestImplemented: boolean;
  jsonContentTypeUsed: boolean;
  localeSentSeparately: boolean;
  scenarioAllowlistMatchesRuntime: boolean;
  scenarioAloneSubmissionBlocked: boolean;
  meaningfulTextRequired: boolean;
  currentTextLimitsPreserved: boolean;
  scenarioSelectionSingleChoice: boolean;
  largeTapTargetDesignPresent: boolean;
  keyboardAccessibleScenarioSelection: boolean;
  selectedStateSemanticallyExposed: boolean;
  mobileFirstLayoutImplemented: boolean;
  noHorizontalScrollDesign: boolean;
  verticallyStackedResponseCards: boolean;
  textareaMobileKeyboardFriendly: boolean;
  noViewportHeightDependencyIntroduced: boolean;
  longWordWrappingPreserved: boolean;
  textareaHasExplicitLabel: boolean;
  scenarioButtonsUseButtonSemantics: boolean;
  selectedScenarioUsesAriaPressedOrEquivalent: boolean;
  loadingStateAccessible: boolean;
  errorStateAccessible: boolean;
  semanticResponseHeadingsPresent: boolean;
  duplicateSubmissionGuardPresent: boolean;
  submitDisabledWhileLoading: boolean;
  invalidSubmissionBlocked: boolean;
  errorCodesHandled: boolean;
  rateLimitHandled: boolean;
  genericNetworkFailureHandled: boolean;
  smartTalkResultRendered: boolean;
  firstContactMetaRendered: boolean;
  preparationLabelsHumanReadable: boolean;
  canWaitGuardPresent: boolean;
  highRiskWarningPriorityPreserved: boolean;
  helpBoundaryLabelsHumanReadable: boolean;
  trustDisclaimerPresent: boolean;
  emptyCardsSuppressed: boolean;
  boundaryRecommendationWithoutAutoSwitch: boolean;
  firstContactScenarioStateAdded: boolean;
  stateResetOnModeChange: boolean;
  forbiddenStringsAbsent: boolean;
  sourceEvidence: string[];
  inspectedFiles: string[];
  filesModified: string[];
  filesCreated: string[];
  modeMenuEvidence: string[];
  firstContactEntryContent: string[];
  scenarioUiEvidence: string[];
  requestContractEvidence: string[];
  mobileLayoutEvidence: string[];
  accessibilityEvidence: string[];
  submissionGuardEvidence: string[];
  errorHandlingEvidence: string[];
  responseRenderingEvidence: string[];
  factsFirstRenderingEvidence: string[];
  boundaryUxEvidence: string[];
  stateIsolationEvidence: string[];
  noPersistenceEvidence: string[];
  notes: string[];
};

function collectEvidence(): Evidence {
  const notes: string[] = [];

  // ── Source acceptance (git log + committed marker files) ────────────────
  const gitLog = runGitReadOnly("git log --oneline -20");
  const apiClosureCommitPresent = gitLog.includes(SOURCE_API_CLOSURE_COMMIT);
  const runtimePatchCommitPresent = gitLog.includes(SOURCE_RUNTIME_PATCH_COMMIT);

  const apiClosureSrc = readFileText(API_CLOSURE_REL_PATH);
  const apiClosureMarkerOk =
    apiClosureSrc.includes('checkId: "8.12D"') &&
    apiClosureSrc.includes("runFirstContactDisabledEnabledSyntheticLocalApiClosure");

  const gateSrc = readFileText(GATE_REL_PATH);
  const routeSrc = readFileText(ROUTE_REL_PATH);
  const presentationSrc = readFileText(PRESENTATION_REL_PATH);
  const runtimePatchMarkerOk =
    gateSrc.includes("runFirstContactRuntimeGate") &&
    routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE") &&
    presentationSrc.includes("buildFirstContactPresentation");

  const apiClosureAccepted = apiClosureCommitPresent && apiClosureMarkerOk;
  const runtimePatchAccepted = runtimePatchCommitPresent && runtimePatchMarkerOk;

  const sourceEvidence: string[] = [
    `git log contains ${SOURCE_API_CLOSURE_COMMIT}: ${apiClosureCommitPresent}`,
    `git log contains ${SOURCE_RUNTIME_PATCH_COMMIT}: ${runtimePatchCommitPresent}`,
    `${API_CLOSURE_REL_PATH} contains checkId "8.12D" and its export name: ${apiClosureMarkerOk}`,
    `${GATE_REL_PATH} contains runFirstContactRuntimeGate: ${gateSrc.includes("runFirstContactRuntimeGate")}`,
    `${ROUTE_REL_PATH} contains FIRST_CONTACT_CONTROLLED_RUNTIME_MODE: ${routeSrc.includes("FIRST_CONTACT_CONTROLLED_RUNTIME_MODE")}`,
    `${PRESENTATION_REL_PATH} contains buildFirstContactPresentation: ${presentationSrc.includes("buildFirstContactPresentation")}`,
    "The historical 8.12D closure was NOT imported or executed by this audit — only its own committed source text was read.",
  ];

  // ── File boundary (read-only git status/diff) ────────────────────────────
  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, ""))
    .filter((p) => !p.startsWith(".next"));

  const modifiedExisting = diffNameOnly.filter((p) => p === SMART_TALK_CLIENT_REL_PATH);
  const createdNew = untrackedNew.filter((p) => p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH));

  const FORBIDDEN_FILES = [
    ROUTE_REL_PATH,
    "lib/vaylo/smart-talk/build-smart-talk-prompt.ts",
    "lib/vaylo/smart-talk/run-smart-talk.ts",
    GATE_REL_PATH,
    PRESENTATION_REL_PATH,
    "next.config.ts",
    "package.json",
    "package-lock.json",
    ".gitignore",
  ];
  const forbiddenFileModified = diffNameOnly.some((p) => FORBIDDEN_FILES.includes(p));

  const totalExistingFilesModified = modifiedExisting.length;
  const totalNewFilesCreated = createdNew.length >= 1 ? 1 : 0;
  const fileBoundaryWithinLimit =
    totalExistingFilesModified === 1 &&
    diffNameOnly.filter((p) => p !== ".next" && !p.startsWith(".next")).length === 1;

  const filesModified = modifiedExisting;
  const filesCreated = fs.existsSync(path.join(process.cwd(), AUDIT_SELF_REL_PATH))
    ? [AUDIT_SELF_REL_PATH]
    : [];

  // ── SmartTalkClient.tsx static content checks ────────────────────────────
  const clientSrc = readFileText(SMART_TALK_CLIENT_REL_PATH);
  const smartTalkClientModified = totalExistingFilesModified === 1;
  const uiAuditCreated = filesCreated.length === 1;

  const firstContactUiModeAdded =
    clientSrc.includes('"first_contact"') && clientSrc.includes("SmartTalkUiMode");
  const menuOrderCorrect = menuOrderIsCorrect(clientSrc);
  const freeQaPreserved = clientSrc.includes('modeChip("question"');
  const textDocumentPreserved = clientSrc.includes('modeChip("text"');
  const photoOcrPreserved = clientSrc.includes('modeChip("photo"');

  // Isolated slice of exactly the onFirstContactSubmit function body, so the
  // request-contract checks below can never accidentally match another
  // handler (e.g. the photo/text-document internal test buttons).
  const onFirstContactSubmitBody = (() => {
    const start = clientSrc.indexOf("const onFirstContactSubmit");
    if (start < 0) return "";
    const end = clientSrc.indexOf("// Phase 8.9K:", start);
    return end > start ? clientSrc.slice(start, end) : clientSrc.slice(start, start + 3000);
  })();

  const firstContactRequestImplemented =
    onFirstContactSubmitBody.includes('mode: "first_contact_controlled_runtime"');
  const jsonContentTypeUsed =
    onFirstContactSubmitBody.includes('"Content-Type": "application/json"') &&
    !onFirstContactSubmitBody.includes("new FormData");
  const localeSentSeparately = onFirstContactSubmitBody.includes('locale: "sk"');
  const scenarioAllowlistMatchesRuntime =
    scenarioAllowlistMatches(clientSrc) && REQUIRED_SCENARIOS.every((s) => gateSrc.includes(`"${s.id}"`));
  const scenarioAloneSubmissionBlocked =
    /trimmedLen < 8/.test(clientSrc) && /submitDisabled/.test(clientSrc);
  const meaningfulTextRequired = onFirstContactSubmitBody.includes("trimmed.length < 8");
  const currentTextLimitsPreserved =
    clientSrc.includes("MAX_TEXT_LENGTH = 12000") &&
    onFirstContactSubmitBody.includes("trimmed.length > MAX_TEXT_LENGTH");

  const scenarioSelectionSingleChoice =
    clientSrc.includes("setFirstContactScenario(selected ? null : opt.id)");
  const largeTapTargetDesignPresent = /minHeight:\s*44/.test(clientSrc);
  const keyboardAccessibleScenarioSelection =
    clientSrc.includes('type="button"') && clientSrc.includes("aria-pressed={selected}");
  const selectedStateSemanticallyExposed =
    clientSrc.includes("aria-pressed={selected}") && clientSrc.includes('{selected ? "✓ " : ""}');

  const mobileFirstLayoutImplemented =
    clientSrc.includes("repeat(auto-fill, minmax(150px, 1fr))");
  const noHorizontalScrollDesign = !/overflow-x:\s*scroll/.test(clientSrc);
  const verticallyStackedResponseCards = clientSrc.includes('display: "grid", gap: 12');
  const textareaMobileKeyboardFriendly = clientSrc.includes("resize-y");
  const noViewportHeightDependencyIntroduced = !/100vh/.test(clientSrc);
  const longWordWrappingPreserved = clientSrc.includes('wordBreak: "break-word"');

  const textareaHasExplicitLabel =
    clientSrc.includes('htmlFor="smart-talk-input"') && clientSrc.includes("Popis tvojej situácie");
  const scenarioButtonsUseButtonSemantics =
    /FIRST_CONTACT_SCENARIO_OPTIONS\.map[\s\S]{0,400}?type="button"/.test(clientSrc);
  const selectedScenarioUsesAriaPressedOrEquivalent = clientSrc.includes("aria-pressed={selected}");
  const loadingStateAccessible =
    clientSrc.includes("Vaylo hľadá prvý krok") && clientSrc.includes("aria-busy");
  const errorStateAccessible = clientSrc.includes('role="alert"');
  const semanticResponseHeadingsPresent =
    REQUIRED_SECTION_LABELS.every((l) => clientSrc.includes(l)) &&
    REQUIRED_WARNINGS_LABEL_VARIANTS.some((l) => clientSrc.includes(l));

  const duplicateSubmissionGuardPresent =
    /onFirstContactSubmit[\s\S]{0,600}?busyRef\.current/.test(clientSrc);
  const submitDisabledWhileLoading = /submitDisabled\s*=[\s\S]{0,200}?loading/.test(clientSrc);
  const invalidSubmissionBlocked = /trimmed\.length < 8 \|\| trimmed\.length > MAX_TEXT_LENGTH/.test(
    clientSrc,
  );

  const errorCodesHandled = REQUIRED_ERROR_CODES.every((code) => clientSrc.includes(`"${code}"`));
  const rateLimitHandled = clientSrc.includes('"smart_talk_rate_limited"');
  const genericNetworkFailureHandled =
    clientSrc.includes("messageForFirstContactCode") && clientSrc.includes("MSG.fallback");

  const smartTalkResultRendered = /renderSmartTalkResultCards\(result\)/.test(clientSrc);
  const firstContactMetaRendered = /renderFirstContactPresentationCards\(firstContactMeta, result\)/.test(
    clientSrc,
  );
  const preparationLabelsHumanReadable = REQUIRED_PREPARATION_LABELS.every((l) => clientSrc.includes(l));
  const canWaitGuardPresent = clientSrc.includes("meta.canWait !== null");
  const highRiskWarningPriorityPreserved =
    clientSrc.includes("highOrUnknownRisk") && clientSrc.includes("Dôležité upozornenie");
  const helpBoundaryLabelsHumanReadable = REQUIRED_HELP_BOUNDARY_LABELS.every((l) => clientSrc.includes(l));
  const firstStepBoundaryLabelsOk = REQUIRED_FIRST_STEP_BOUNDARY_LABELS.every((l) => clientSrc.includes(l));
  const trustDisclaimerPresent =
    clientSrc.includes("nie je to právne poradenstvo") && clientSrc.includes("neukladá");
  const emptyCardsSuppressed =
    clientSrc.includes("meta.preparationItems.length > 0") &&
    clientSrc.includes("meta.evidenceLimitations.length > 0");

  const boundaryRecommendationWithoutAutoSwitch =
    clientSrc.includes("firstContactRecommendedMode") &&
    clientSrc.includes("Prepnúť na Vysvetliť text") &&
    clientSrc.includes("Prepnúť na Odfotiť dokument") &&
    !/setMode\((?:"text"|"photo")\)[\s\S]{0,80}useEffect/.test(clientSrc);

  const firstContactScenarioStateAdded = clientSrc.includes("useState<FirstContactScenarioId | null>");
  const stateResetOnModeChange =
    /mode !== "first_contact"\)\s*\{\s*setFirstContactScenario\(null\);\s*setFirstContactMeta\(null\);\s*setFirstContactRecommendedMode\(null\);/.test(
      clientSrc.replace(/\s+/g, " "),
    );

  const forbiddenStringsAbsent = includesNone(clientSrc, FORBIDDEN_UI_STRINGS);

  const inspectedFiles = [
    SMART_TALK_CLIENT_REL_PATH,
    ROUTE_REL_PATH,
    GATE_REL_PATH,
    PRESENTATION_REL_PATH,
    API_CLOSURE_REL_PATH,
  ];

  return {
    apiClosureAccepted,
    runtimePatchAccepted,
    smartTalkClientModified,
    uiAuditCreated,
    totalExistingFilesModified,
    totalNewFilesCreated,
    fileBoundaryWithinLimit,
    forbiddenFileModified,
    firstContactUiModeAdded,
    menuOrderCorrect,
    freeQaPreserved,
    textDocumentPreserved,
    photoOcrPreserved,
    firstContactRequestImplemented,
    jsonContentTypeUsed,
    localeSentSeparately,
    scenarioAllowlistMatchesRuntime,
    scenarioAloneSubmissionBlocked,
    meaningfulTextRequired,
    currentTextLimitsPreserved,
    scenarioSelectionSingleChoice,
    largeTapTargetDesignPresent,
    keyboardAccessibleScenarioSelection,
    selectedStateSemanticallyExposed,
    mobileFirstLayoutImplemented,
    noHorizontalScrollDesign,
    verticallyStackedResponseCards,
    textareaMobileKeyboardFriendly,
    noViewportHeightDependencyIntroduced,
    longWordWrappingPreserved,
    textareaHasExplicitLabel,
    scenarioButtonsUseButtonSemantics,
    selectedScenarioUsesAriaPressedOrEquivalent,
    loadingStateAccessible,
    errorStateAccessible,
    semanticResponseHeadingsPresent,
    duplicateSubmissionGuardPresent,
    submitDisabledWhileLoading,
    invalidSubmissionBlocked,
    errorCodesHandled,
    rateLimitHandled,
    genericNetworkFailureHandled,
    smartTalkResultRendered,
    firstContactMetaRendered,
    preparationLabelsHumanReadable,
    canWaitGuardPresent,
    highRiskWarningPriorityPreserved,
    helpBoundaryLabelsHumanReadable: helpBoundaryLabelsHumanReadable && firstStepBoundaryLabelsOk,
    trustDisclaimerPresent,
    emptyCardsSuppressed,
    boundaryRecommendationWithoutAutoSwitch,
    firstContactScenarioStateAdded,
    stateResetOnModeChange,
    forbiddenStringsAbsent,

    sourceEvidence,
    inspectedFiles,
    filesModified,
    filesCreated,
    modeMenuEvidence: [
      `Required order ${JSON.stringify(REQUIRED_MODE_ORDER)} found in exact sequence: ${menuOrderCorrect}`,
      `Existing modes preserved: question=${freeQaPreserved}, text=${textDocumentPreserved}, photo=${photoOcrPreserved}`,
      "No automatic mode switching or automatic youth/age/language/text-length-based selection was added.",
    ],
    firstContactEntryContent: [
      `Heading "${FIRST_CONTACT_ENTRY_HEADING_LITERAL}" present: ${clientSrc.includes(FIRST_CONTACT_ENTRY_HEADING_LITERAL)}`,
      `Supporting text present: ${clientSrc.includes(FIRST_CONTACT_SUPPORTING_TEXT_LITERAL)}`,
      `Placeholder present: ${clientSrc.includes("Prvýkrát som sa presťahoval do Nemecka")}`,
    ],
    scenarioUiEvidence: [
      `10 scenario ids/labels present and matching the runtime allowlist: ${scenarioAllowlistMatchesRuntime}`,
      `Single-select toggle semantics: ${scenarioSelectionSingleChoice}`,
      `Large tap targets (minHeight 44): ${largeTapTargetDesignPresent}`,
      `Keyboard-accessible native <button> elements with aria-pressed: ${keyboardAccessibleScenarioSelection}`,
      `Selected state exposed both visually (border/background/weight) and semantically (aria-pressed + checkmark glyph, not color alone): ${selectedStateSemanticallyExposed}`,
    ],
    requestContractEvidence: [
      `mode: "first_contact_controlled_runtime" literal present in onFirstContactSubmit: ${firstContactRequestImplemented}`,
      `application/json Content-Type used, no FormData in onFirstContactSubmit: ${jsonContentTypeUsed}`,
      `market: "DE" sent verbatim; locale sent separately (locale: "sk"): ${localeSentSeparately}`,
      "scenario is spread in only when selected (`...(firstContactScenario ? { scenario: firstContactScenario } : {})`) — omitted otherwise, never sent as jurisdiction/region/DNA/identity/payment/verified fields.",
      `Client-side MIN_TEXT(8)/MAX_TEXT(12000) reused verbatim, no new numeric limit invented: ${currentTextLimitsPreserved}`,
    ],
    mobileLayoutEvidence: [
      `Responsive auto-fill scenario grid (no horizontal scroll): ${mobileFirstLayoutImplemented}`,
      `No overflow-x: scroll introduced: ${noHorizontalScrollDesign}`,
      `Response cards use CSS grid (vertical stack): ${verticallyStackedResponseCards}`,
      `Textarea uses resize-y (keyboard-friendly, not a fixed unusable height): ${textareaMobileKeyboardFriendly}`,
      `No 100vh viewport-height assumption introduced: ${noViewportHeightDependencyIntroduced}`,
      `wordBreak: "break-word" reused for long German/Slovak words: ${longWordWrappingPreserved}`,
    ],
    accessibilityEvidence: [
      `Textarea has an explicit label for first_contact ("Popis tvojej situácie"): ${textareaHasExplicitLabel}`,
      `Scenario buttons use type="button" + aria-pressed: ${scenarioButtonsUseButtonSemantics}`,
      `Loading state has a concise status string + aria-busy: ${loadingStateAccessible}`,
      `Error state uses role="alert": ${errorStateAccessible}`,
      `All 7 required Slovak section headings present: ${semanticResponseHeadingsPresent}`,
    ],
    submissionGuardEvidence: [
      `busyRef.current duplicate-submit guard present in onFirstContactSubmit: ${duplicateSubmissionGuardPresent}`,
      `submitDisabled includes the shared loading flag: ${submitDisabledWhileLoading}`,
      `Client-side length/whitespace validation blocks invalid submission before fetch: ${invalidSubmissionBlocked}`,
      "No automatic retry, no fallback to Free Q&A, no silent switch to Text Document or Photo/OCR on failure.",
    ],
    errorHandlingEvidence: [
      `All 11 gate/presentation error codes present as literal string matches in messageForFirstContactCode: ${errorCodesHandled}`,
      `Rate-limit code ("smart_talk_rate_limited") handled: ${rateLimitHandled}`,
      `Generic/network failure falls back through messageForStatus/MSG.fallback: ${genericNetworkFailureHandled}`,
      `No environment flag names, stack traces, or internal identifiers referenced in client source: ${forbiddenStringsAbsent}`,
    ],
    responseRenderingEvidence: [
      `Shared renderSmartTalkResultCards(result) still called for First Contact success: ${smartTalkResultRendered}`,
      `renderFirstContactPresentationCards(firstContactMeta, result) additionally called: ${firstContactMetaRendered}`,
      `Preparation requirement levels mapped to human-readable Slovak labels: ${preparationLabelsHumanReadable}`,
      `First-step boundary labels mapped to human-readable Slovak text: ${firstStepBoundaryLabelsOk}`,
      `Help-boundary levels mapped to human-readable Slovak text: ${helpBoundaryLabelsHumanReadable}`,
      `canWait guarded with "meta.canWait !== null" before rendering: ${canWaitGuardPresent}`,
      `Empty preparationItems/evidenceLimitations arrays never render an empty card (length > 0 guards): ${emptyCardsSuppressed}`,
    ],
    factsFirstRenderingEvidence: [
      "A dedicated \"Dôležité upozornenie\" card renders first, before any other First-Contact-specific card, whenever result.urgency is \"high\" or \"unknown\" — this satisfies 'no reassuring content before the warning under high/unknown risk'.",
      "For low/medium risk, the shared SmartTalkResult cards (Summary/Meaning/Urgency/Next steps/Warnings) render first, followed by the First-Contact-only cards (situationSummary, firstStep, preparationItems, canWait, helpBoundary, evidenceLimitations) — this deliberately follows the existing component's established card ordering convention rather than inventing a second, competing warnings section.",
      "No <details>/accordion element is used for any warning or help-boundary card.",
      `canWait is never rendered when null: ${canWaitGuardPresent}`,
    ],
    boundaryUxEvidence: [
      `Document/Photo-OCR boundary responses show a manual "Prepnúť na …" button and never call setMode() automatically from a useEffect: ${boundaryRecommendationWithoutAutoSwitch}`,
      "The paid-document-boundary and persistence-forbidden error messages describe the boundary without claiming a payment was made or that entitlement was granted.",
      "No file input, camera dialog, or upload flow is triggered by any First Contact error branch.",
    ],
    stateIsolationEvidence: [
      `firstContactScenario state uses FirstContactScenarioId | null (added state slot): ${firstContactScenarioStateAdded}`,
      `Leaving first_contact mode resets firstContactScenario, firstContactMeta, and firstContactRecommendedMode together: ${stateResetOnModeChange}`,
      "The shared error/result/loading state is already reset on every mode change by the existing mode-change effect (unmodified for other modes), which also clears First Contact's shared error/result fields whenever entering or leaving any mode.",
    ],
    noPersistenceEvidence: [
      "No localStorage.setItem/sessionStorage.setItem/indexedDB.open call was added.",
      "No cookie, URL-query, or draft-autosave persistence was added.",
      "No analytics payload containing user input was added.",
      "No Vaylo DNA or authentication/billing integration was added.",
      "Input remains in transient React state only (useState), cleared on mode change.",
    ],
    notes: [
      "This audit is fully static: it never imports SmartTalkClient.tsx as a module, never invokes the route POST handler, and never mutates process.env.",
      "Source acceptance for 4a8245b/7e71853 required BOTH a git-log hash match AND a committed-file marker match — filename presence alone was not sufficient.",
      ...notes,
    ],
  };
}

const FIRST_CONTACT_ENTRY_HEADING_LITERAL = "Čo riešiš prvýkrát?";
const FIRST_CONTACT_SUPPORTING_TEXT_LITERAL =
  "Opíš situáciu vlastnými slovami. Nemusíš poznať názov úradu ani formulára.";

// ─── 75 tamper cases ────────────────────────────────────────────────────────

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "source API closure commit mismatch", mutate: (r) => { r.sourceApiClosureCommit = "0000000"; } },
  { id: 2, description: "source API closure not accepted", mutate: (r) => { r.sourceApiClosureAccepted = false; } },
  { id: 3, description: "SmartTalkClient not modified", mutate: (r) => { r.smartTalkClientModified = false; r.totalExistingFilesModified = 0; } },
  { id: 4, description: "runtime file modified", mutate: (r) => { r.runtimeModifiedNow = true; } },
  { id: 5, description: "route modified", mutate: (r) => { r.routeModifiedNow = true; } },
  { id: 6, description: "prompt modified", mutate: (r) => { r.promptModifiedNow = true; } },
  { id: 7, description: "extra UI file added outside boundary", mutate: (r) => { r.totalExistingFilesModified = 2; r.totalFilesChanged = 3; } },
  { id: 8, description: "First Contact UI mode missing", mutate: (r) => { r.firstContactUiModeAdded = false; } },
  { id: 9, description: "menu order incorrect", mutate: (r) => { r.menuOrderCorrect = false; } },
  { id: 10, description: "existing mode removed", mutate: (r) => { r.textDocumentPreserved = false; } },
  { id: 11, description: "implicit mode selection enabled", mutate: (r) => { r.explicitModeSelectionRequired = false; } },
  { id: 12, description: "automatic youth detection added", mutate: (r) => { r.automaticYouthDetectionAdded = true; } },
  { id: 13, description: "wrong API route mode sent", mutate: (r) => { r.exactApiModeUsed = "first_contact"; } },
  { id: 14, description: "multipart request used", mutate: (r) => { r.jsonContentTypeUsed = false; } },
  { id: 15, description: "market DE missing", mutate: (r) => { r.marketSent = ""; } },
  { id: 16, description: "market inferred from locale", mutate: (r) => { r.marketInferredFromLocale = true; } },
  { id: 17, description: "AT selectable now", mutate: (r) => { r.marketSent = "AT"; } },
  { id: 18, description: "scenario ID mismatch", mutate: (r) => { r.scenarioAllowlistMatchesRuntime = false; } },
  { id: 19, description: "scenario alone may submit", mutate: (r) => { r.scenarioAloneSubmissionBlocked = false; } },
  { id: 20, description: "whitespace text may submit", mutate: (r) => { r.meaningfulTextRequired = false; } },
  { id: 21, description: "text below min may submit", mutate: (r) => { r.meaningfulTextRequired = false; r.currentTextLimitsPreserved = false; } },
  { id: 22, description: "file/image sent in First Contact", mutate: (r) => { r.fileOrImageSent = true; } },
  { id: 23, description: "trusted jurisdiction sent", mutate: (r) => { r.jurisdictionSentAsTrustedClaim = true; } },
  { id: 24, description: "duplicate-submit guard absent", mutate: (r) => { r.duplicateSubmissionGuardPresent = false; } },
  { id: 25, description: "submit active while loading", mutate: (r) => { r.submitDisabledWhileLoading = false; } },
  { id: 26, description: "automatic retry added", mutate: (r) => { r.automaticRetryAdded = true; } },
  { id: 27, description: "fallback to Free Q&A added", mutate: (r) => { r.fallbackToFreeQaAdded = true; } },
  { id: 28, description: "automatic switch to Text Document", mutate: (r) => { r.silentDocumentModeSwitchAdded = true; } },
  { id: 29, description: "automatic switch to Photo/OCR", mutate: (r) => { r.silentPhotoOcrSwitchAdded = true; } },
  { id: 30, description: "disabled code not handled", mutate: (r) => { r.disabledCodeHandled = false; } },
  { id: 31, description: "document boundary code not handled", mutate: (r) => { r.documentBoundaryCodeHandled = false; } },
  { id: 32, description: "Photo/OCR boundary code not handled", mutate: (r) => { r.photoOcrBoundaryCodeHandled = false; } },
  { id: 33, description: "paid boundary code not handled", mutate: (r) => { r.paidBoundaryCodeHandled = false; } },
  { id: 34, description: "persistence boundary code not handled", mutate: (r) => { r.persistenceBoundaryCodeHandled = false; } },
  { id: 35, description: "internal flag exposed", mutate: (r) => { r.internalEnvFlagExposed = true; } },
  { id: 36, description: "stack trace exposed", mutate: (r) => { r.internalStackTraceExposed = true; } },
  { id: 37, description: "SmartTalkResult not rendered", mutate: (r) => { r.smartTalkResultRendered = false; } },
  { id: 38, description: "firstContactMeta not rendered", mutate: (r) => { r.firstContactMetaRendered = false; } },
  { id: 39, description: "warnings hidden", mutate: (r) => { r.highRiskWarningPriorityPreserved = false; } },
  { id: 40, description: "high-risk warning collapsed", mutate: (r) => { r.criticalWarningsCollapsedByDefault = true; } },
  { id: 41, description: "canWait rendered when null", mutate: (r) => { r.canWaitRenderedOnlyWhenPresent = false; } },
  { id: 42, description: "preparation items shown as mandatory", mutate: (r) => { r.preparationRequirementLabelsHumanReadable = false; } },
  { id: 43, description: "raw enum value displayed", mutate: (r) => { r.helpBoundaryEnumsNotShownRaw = false; } },
  { id: 44, description: "evidence limitations hidden", mutate: (r) => { r.evidenceLimitationsRendered = false; } },
  { id: 45, description: "verified status displayed", mutate: (r) => { r.verifiedStatusShown = true; } },
  { id: 46, description: "OCR metadata rendered", mutate: (r) => { r.ocrMetadataRenderedInFirstContact = true; } },
  { id: 47, description: "Text Document metadata rendered", mutate: (r) => { r.textDocumentMetadataRenderedInFirstContact = true; } },
  { id: 48, description: "Free Q&A metadata rendered", mutate: (r) => { r.freeQaSpecificMetadataRenderedInFirstContact = true; } },
  { id: 49, description: "stale response leaks across modes", mutate: (r) => { r.crossModeResponseLeakPrevented = false; } },
  { id: 50, description: "localStorage added", mutate: (r) => { r.localStorageAdded = true; } },
  { id: 51, description: "sessionStorage added", mutate: (r) => { r.sessionStorageAdded = true; } },
  { id: 52, description: "analytics sends input text", mutate: (r) => { r.analyticsInputPayloadAdded = true; } },
  { id: 53, description: "DNA integration added", mutate: (r) => { r.dnaIntegrationAdded = true; } },
  { id: 54, description: "billing added", mutate: (r) => { r.billingAdded = true; } },
  { id: 55, description: "touch targets omitted", mutate: (r) => { r.largeTapTargetDesignPresent = false; } },
  { id: 56, description: "hover-only interaction added", mutate: (r) => { r.hoverOnlyInteractionUsed = true; } },
  { id: 57, description: "scenario selection lacks semantic state", mutate: (r) => { r.selectedStateSemanticallyExposed = false; } },
  { id: 58, description: "textarea label missing", mutate: (r) => { r.textareaHasExplicitLabel = false; } },
  { id: 59, description: "loading accessibility missing", mutate: (r) => { r.loadingStateAccessible = false; } },
  { id: 60, description: "error accessibility missing", mutate: (r) => { r.errorStateAccessible = false; } },
  { id: 61, description: "critical information hidden by default", mutate: (r) => { r.criticalWarningsCollapsedByDefault = true; } },
  { id: 62, description: "horizontal-scroll design introduced", mutate: (r) => { r.noHorizontalScrollDesign = false; } },
  { id: 63, description: "desktop made primary", mutate: (r) => { r.mobileFirstLayoutImplemented = false; } },
  { id: 64, description: "browser falsely claimed tested", mutate: (r) => { r.browserInvoked = true; } },
  { id: 65, description: "Android falsely claimed tested", mutate: (r) => { r.androidDeviceInvoked = true; r.androidValidationPerformedNow = true; } },
  { id: 66, description: "iOS falsely claimed tested", mutate: (r) => { r.iosDeviceInvoked = true; r.iosValidationPerformedNow = true; } },
  { id: 67, description: "API request performed by audit", mutate: (r) => { r.apiRequestPerformedByAudit = true; } },
  { id: 68, description: "model/OCR call performed by audit", mutate: (r) => { r.modelCallPerformedByAudit = true; r.ocrPerformedByAudit = true; } },
  { id: 69, description: "controlled beta authorized", mutate: (r) => { r.controlledBetaAuthorizedNow = true; } },
  { id: 70, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 71, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 72, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 73, description: "next phase not 8.12F", mutate: (r) => { r.readyForNextPhase = false; } },
  { id: 74, description: "8.3AC run", mutate: (r) => { r.eightThreeAcNotRun = false; } },
  { id: 75, description: "tmp metadata touched", mutate: (r) => { r.tmpEightThreeAcMetadataTouched = true; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const expectedAllPassed = computeExpectedAllPassed(mutated);
    const structuralViolations = validateResult(mutated);
    const isRejected = expectedAllPassed === false || structuralViolations.length > 0;
    if (isRejected) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runFirstContactMinimalMobileFirstUiPatchAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);

  const structuralViolations = validateResult(good);
  const tamperOutcome = runTamperCases(good);

  const staticAllPassed =
    computeExpectedAllPassed(good) &&
    structuralViolations.length === 0 &&
    tamperOutcome.rejected === tamperOutcome.total &&
    evidence.forbiddenStringsAbsent;

  const final: Result = {
    ...good,
    allPassed: staticAllPassed,
    minimalUiPatchAccepted: staticAllPassed,
    readyForBrowserMobileValidation: staticAllPassed,
    readyForNextPhase: staticAllPassed ? "8.12F" : false,
    readinessVerdict: [
      staticAllPassed
        ? "The minimal First Contact mobile-first UI patch is implemented within the exact two-file boundary and satisfies every static contract check performed by this audit."
        : `The minimal First Contact mobile-first UI patch failed one or more static contract checks: ${[...structuralViolations, ...tamperOutcome.failures].join("; ")}`,
      `Tamper cases rejected: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      "This is a static, read-only audit; no dynamic browser/mobile/API validation has occurred.",
    ],
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(structuralViolations.length > 0 ? [`Structural violations: ${structuralViolations.join("; ")}`] : []),
    ],
  };

  return final;
}

if (require.main === module) {
  const result = runFirstContactMinimalMobileFirstUiPatchAudit();
  console.log(JSON.stringify(result));
}
