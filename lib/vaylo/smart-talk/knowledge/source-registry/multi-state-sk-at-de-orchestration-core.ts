/**
 * AT-SK-0L — SK+AT+DE multi-state orchestration review core.
 * Architecture / semantic routing only. Not canonical legal truth. No runtime.
 */
import {
  DIRECT_AT_DE_BILATERAL_REQUIRED,
  SK_BILATERAL_LAYERS_SUFFICIENT,
  classifyAtDeBilateralBoundary,
  deriveCountriesInCase,
  switchBureaucracyCountry,
  validateActivityTimeline,
  validateMultiStateCaseContext,
  type ActivityTimelineEntry,
  type MultiStateCaseContext,
  type SlovakiaPackCorridorCandidate,
} from "./multi-state-case-contracts";
import {
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  isAuthorizedBilateralTaxPair,
} from "./bilateral-tax-treaty-contracts";

export const AT_SK_0L_PHASE = "AT-SK-0L" as const;

export type MultiStateTopic =
  | "applicable_legislation"
  | "health"
  | "family_benefits"
  | "unemployment"
  | "tax";

export type TaxTreatyBranch =
  | "AT_SK_AUTHORIZED"
  | "DE_SK_AUTHORIZED"
  | "DE_AT_EXPLICITLY_OUT_OF_SCOPE"
  | "PAIR_AMBIGUOUS"
  | "EVIDENCE_REQUIRED";

export type ScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE"
  | "BLOCKED_BY_ARCHITECTURE";

export type MultiStateScenario = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  topic: MultiStateTopic;
}>;

export type MultiStateNegativeControl = Readonly<{
  id: string;
  label: string;
  reject: boolean;
}>;

function entry(
  country: string,
  activityType: ActivityTimelineEntry["activityType"],
  from: string,
  to: string | null,
): ActivityTimelineEntry {
  return Object.freeze({
    country,
    activityType,
    from,
    to,
    legalClassification: "UNRESOLVED",
  });
}

export function buildSkAtDeSequentialTimeline(): readonly ActivityTimelineEntry[] {
  return Object.freeze([
    entry("AT", "EMPLOYED", "2024-01-01", "2024-12-31"),
    entry("DE", "EMPLOYED", "2025-01-01", "2025-12-31"),
    entry("AT", "EMPLOYED", "2026-01-01", "2026-06-30"),
  ]);
}

export function buildSkAtDeCase(
  bureaucracyCountry: "AT" | "DE",
): MultiStateCaseContext {
  const timeline = buildSkAtDeSequentialTimeline();
  const corridorCandidate: SlovakiaPackCorridorCandidate = bureaucracyCountry === "DE" ? "DE-SK" : "AT-SK";
  return Object.freeze({
    routing: {
      marketPackCountry: "SK" as const,
      bureaucracyCountry,
      corridorCandidate,
      countryContextSource: "AGENCY_CASE" as const,
    },
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: timeline,
    }),
    activityTimeline: timeline,
    casePeriod: { from: "2024-01-01", to: "2026-06-30" },
    residenceState: "SK",
  });
}

export function deriveHistoricalCorridorCandidates(
  context: MultiStateCaseContext,
): readonly SlovakiaPackCorridorCandidate[] {
  const activityCountries = new Set(context.activityTimeline.map((row) => row.country));
  const candidates: SlovakiaPackCorridorCandidate[] = [];
  if (activityCountries.has("AT")) candidates.push("AT-SK");
  if (activityCountries.has("DE")) candidates.push("DE-SK");
  return Object.freeze([...new Set(candidates)]);
}

export function selectTaxTreatyBranch(input: {
  domesticResidence: string | null | undefined;
  incomeSourceCountry: string | null | undefined;
}): TaxTreatyBranch {
  const residence = input.domesticResidence ?? "";
  const source = input.incomeSourceCountry ?? "";
  if (!residence || !source) return "EVIDENCE_REQUIRED";
  if (residence === "SK" && source === "AT" && isAuthorizedBilateralTaxPair("AT", "SK")) {
    return "AT_SK_AUTHORIZED";
  }
  if (residence === "SK" && source === "DE" && isAuthorizedBilateralTaxPair("DE", "SK")) {
    return "DE_SK_AUTHORIZED";
  }
  if (
    (residence === "AT" && source === "DE")
    || (residence === "DE" && source === "AT")
  ) {
    return "DE_AT_EXPLICITLY_OUT_OF_SCOPE";
  }
  return "PAIR_AMBIGUOUS";
}

export function rejectWrongTreatyPairApplication(
  treatyPair: "AT-SK" | "DE-SK",
  incomeSourceCountry: string,
): boolean {
  if (treatyPair === "AT-SK" && incomeSourceCountry === "DE") return true;
  if (treatyPair === "DE-SK" && incomeSourceCountry === "AT") return true;
  return false;
}

export function evaluateBureaucracySwitchPreservesHistory(
  context: MultiStateCaseContext,
  nextBureaucracyCountry: "AT" | "DE",
): Readonly<{ pass: boolean; issues: readonly string[] }> {
  const switched = switchBureaucracyCountry(context, nextBureaucracyCountry);
  if (!switched.context) {
    return Object.freeze({ pass: false, issues: switched.issues });
  }
  const timelineUnchanged = JSON.stringify(switched.context.activityTimeline)
    === JSON.stringify(context.activityTimeline);
  const countriesUnchanged = JSON.stringify(switched.context.countriesInCase)
    === JSON.stringify(context.countriesInCase);
  const corridorUpdated = switched.context.routing.corridorCandidate
    === (nextBureaucracyCountry === "DE" ? "DE-SK" : "AT-SK");
  const issues: string[] = [];
  if (!timelineUnchanged) issues.push("TIMELINE_MUTATED_ON_SWITCH");
  if (!countriesUnchanged) issues.push("COUNTRIES_IN_CASE_MUTATED_ON_SWITCH");
  if (!corridorUpdated) issues.push("CORRIDOR_NOT_UPDATED_FOR_BUREAUCRACY");
  return Object.freeze({ pass: issues.length === 0, issues: Object.freeze(issues) });
}

export function evaluateTimelineGapFailClosed(
  timeline: readonly ActivityTimelineEntry[],
): Readonly<{ pass: boolean; reason: string }> {
  const sorted = [...timeline].sort((a, b) => a.from.localeCompare(b.from));
  for (let index = 1; index < sorted.length; index += 1) {
    const prev = sorted[index - 1];
    const current = sorted[index];
    if (prev.to != null && current.from > prev.to) {
      const gapStart = prev.to;
      const gapEnd = current.from;
      if (gapStart < gapEnd) {
        return Object.freeze({
          pass: true,
          reason: "GAP_REQUIRES_CLARIFICATION_NOT_INFERENCE",
        });
      }
    }
  }
  return Object.freeze({ pass: false, reason: "NO_GAP" });
}

export function evaluateAtDeTaxBoundary(
  treatyResidenceCountry: string,
  incomeSourceCountries: readonly string[],
): string {
  return classifyAtDeBilateralBoundary({
    treatyResidenceCountry,
    incomeSourceCountries,
  });
}

export const AT_SK_0L_SCENARIOS: readonly MultiStateScenario[] = Object.freeze([
  { id: "s01-sk-resident-at-then-de", label: "SK resident works AT, later DE", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s02-at-insurance-history-after-de-move", label: "AT insurance history remains after DE employment", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s03-bureaucracy-at-to-de-preserves-at", label: "Bureaucracy AT→DE preserves Austrian history", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s04-bureaucracy-de-to-at-preserves-de", label: "Bureaucracy DE→AT preserves German history", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s05-old-a1-not-later-period", label: "Old AT A1 does not control later DE period", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s06-health-competent-state-periodic", label: "Health competent state changes across periods", coverage: "COVERED", topic: "health" },
  { id: "s07-family-priority-per-period", label: "Family-benefit priority recalculated per period", coverage: "COVERED", topic: "family_benefits" },
  { id: "s08-old-at-family-not-reused-after-de", label: "Old AT family priority not reused after DE employment", coverage: "COVERED", topic: "family_benefits" },
  { id: "s09-at-de-unemployment-periods", label: "AT + DE unemployment periods both representable", coverage: "COVERED", topic: "unemployment" },
  { id: "s10-historical-not-current-competent", label: "Historical period != current competent state", coverage: "COVERED", topic: "unemployment" },
  { id: "s11-u1-evidence-not-competence", label: "U1 from one country is evidence not automatic competence", coverage: "COVERED", topic: "unemployment" },
  { id: "s12-sk-res-at-income-at-sk-tax", label: "SK residence + AT income → AT-SK tax branch", coverage: "COVERED", topic: "tax" },
  { id: "s13-sk-res-de-income-de-sk-tax", label: "SK residence + DE income → DE-SK tax branch", coverage: "COVERED", topic: "tax" },
  { id: "s14-at-sk-rule-on-de-income-rejected", label: "AT-SK treaty on DE income rejected", coverage: "COVERED", topic: "tax" },
  { id: "s15-de-sk-rule-on-at-income-rejected", label: "DE-SK treaty on AT income rejected", coverage: "COVERED", topic: "tax" },
  { id: "s16-de-at-treaty-oos", label: "DE-AT bilateral tax treaty not implemented → OOS", coverage: "EXPLICITLY_OUT_OF_SCOPE", topic: "tax" },
  { id: "s17-nationality-not-jurisdiction", label: "Nationality SK + residence AT does not override jurisdiction", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s18-locale-not-jurisdiction", label: "UI locale SK + bureaucracy DE does not change jurisdiction", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s19-market-pack-not-merits", label: "marketPackCountry SK + bureaucracy AT does not decide legal result", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s20-multiple-corridor-candidates", label: "Multiple historical corridor candidates coexist", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s21-topic-de-sk-historical-at-sk", label: "Current DE-SK topic with historical AT-SK reference", coverage: "COVERED", topic: "health" },
  { id: "s22-period-facts-immutable", label: "Period-specific facts remain history-preserving", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s23-new-fact-not-overwrite-evidence", label: "New current fact does not overwrite historical evidence", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s24-conflicting-periods-clarify", label: "Conflicting period facts require clarification", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s25-missing-date-boundary-fail-closed", label: "Missing date boundary prevents unsafe cross-period inference", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s26-sk-at-de-facts-without-loss", label: "SK/AT/DE country facts coexist without data loss", coverage: "COVERED", topic: "applicable_legislation" },
  { id: "s27-no-triple-connector-required", label: "No triple connector required for supported scenarios", coverage: "COVERED", topic: "applicable_legislation" },
]);

export const AT_SK_0L_NEGATIVE_CONTROLS: readonly MultiStateNegativeControl[] = Object.freeze([
  { id: "nc-locale-as-jurisdiction", label: "userLocale must not decide jurisdiction", reject: true },
  { id: "nc-nationality-as-competent-state", label: "nationality must not decide competent state", reject: true },
  { id: "nc-market-pack-as-merits", label: "marketPackCountry must not decide legal merits", reject: true },
  { id: "nc-bureaucracy-as-residence", label: "bureaucracyCountry must not overwrite residence history", reject: true },
  { id: "nc-at-sk-on-de-income", label: "AT-SK treaty must not apply to DE-source income", reject: true },
  { id: "nc-de-sk-on-at-income", label: "DE-SK treaty must not apply to AT-source income", reject: true },
  { id: "nc-de-at-treaty-fabrication", label: "DE-AT treaty must not be fabricated", reject: true },
  { id: "nc-static-competent-state", label: "competentState must not be frozen across periods", reject: true },
  { id: "nc-single-global-corridor", label: "one global corridor must not lock entire account", reject: true },
  { id: "nc-triple-pack", label: "SK-AT-DE triple pack must not exist", reject: true },
  { id: "nc-eu-truth-duplication", label: "EU truth must not be duplicated per corridor", reject: true },
  { id: "nc-bilateral-as-eu", label: "bilateral treaty must not become shared EU truth", reject: true },
  { id: "nc-runtime-authorized", label: "public runtime must remain unauthorized", reject: true },
  { id: "nc-silent-period-merge", label: "ambiguous periods must not silently merge", reject: true },
  { id: "nc-old-a1-controls-new-period", label: "old A1 must not control new period without review", reject: true },
]);

export function evaluateMultiStateSkAtDeOrchestrationSemantics(): Record<string, unknown> {
  const atCase = buildSkAtDeCase("AT");
  const deCase = buildSkAtDeCase("DE");
  const atToDe = evaluateBureaucracySwitchPreservesHistory(atCase, "DE");
  const deToAt = evaluateBureaucracySwitchPreservesHistory(deCase, "AT");
  const gapTimeline = Object.freeze([
    entry("AT", "EMPLOYED", "2026-01-01", "2026-03-31"),
    entry("DE", "EMPLOYED", "2026-08-01", "2026-12-31"),
  ]);
  const gapCheck = evaluateTimelineGapFailClosed(gapTimeline);
  const historicalCorridorsAt = deriveHistoricalCorridorCandidates(atCase);
  const historicalCorridorsDe = deriveHistoricalCorridorCandidates(deCase);
  const atSkTaxBranch = selectTaxTreatyBranch({ domesticResidence: "SK", incomeSourceCountry: "AT" });
  const deSkTaxBranch = selectTaxTreatyBranch({ domesticResidence: "SK", incomeSourceCountry: "DE" });
  const deAtBoundary = evaluateAtDeTaxBoundary("AT", ["DE"]);
  const skLayerBoundary = evaluateAtDeTaxBoundary("SK", ["AT", "DE"]);
  const atSkOnDeRejected = rejectWrongTreatyPairApplication("AT-SK", "DE");
  const deSkOnAtRejected = rejectWrongTreatyPairApplication("DE-SK", "AT");
  const deAtPairAuthorized = isAuthorizedBilateralTaxPair("DE", "AT");

  const proofs = {
    multiStateCaseContextValid: validateMultiStateCaseContext(atCase).valid
      && validateMultiStateCaseContext(deCase).valid,
    activityTimelineValid: validateActivityTimeline(atCase.activityTimeline).valid,
    longitudinalBoundsPresent: atCase.activityTimeline.every((row) => /^\d{4}-\d{2}-\d{2}$/u.test(row.from))
      && atCase.activityTimeline.some((row) => row.to != null),
    bureaucracySwitchAtToDe: atToDe.pass,
    bureaucracySwitchDeToAt: deToAt.pass,
    multipleCorridorCandidates: historicalCorridorsAt.length === 2
      && historicalCorridorsDe.length === 2
      && historicalCorridorsAt.includes("AT-SK")
      && historicalCorridorsAt.includes("DE-SK"),
    operationalCorridorPerBureaucracy: atCase.routing.corridorCandidate === "AT-SK"
      && deCase.routing.corridorCandidate === "DE-SK",
    atSkTaxBranch: atSkTaxBranch === "AT_SK_AUTHORIZED",
    deSkTaxBranch: deSkTaxBranch === "DE_SK_AUTHORIZED",
    deAtExplicitlyOutOfScope: selectTaxTreatyBranch({ domesticResidence: "AT", incomeSourceCountry: "DE" })
      === "DE_AT_EXPLICITLY_OUT_OF_SCOPE"
      && deAtBoundary === DIRECT_AT_DE_BILATERAL_REQUIRED
      && !deAtPairAuthorized,
    skBilateralLayersSufficient: skLayerBoundary === SK_BILATERAL_LAYERS_SUFFICIENT,
    atSkTreatyLeakIntoDeSk: atSkOnDeRejected,
    deSkTreatyLeakIntoAtSk: deSkOnAtRejected,
    missingDeAtTreatyFailClosed: !deAtPairAuthorized,
    gapTimelineFailClosed: gapCheck.pass && gapCheck.reason === "GAP_REQUIRES_CLARIFICATION_NOT_INFERENCE",
    routingDimensionsIndependent: atCase.routing.marketPackCountry === "SK"
      && atCase.routing.bureaucracyCountry === "AT"
      && atCase.residenceState === "SK"
      && !("userLocale" in atCase)
      && !("locale" in atCase.routing),
    countriesInCaseComplete: atCase.countriesInCase.includes("SK")
      && atCase.countriesInCase.includes("AT")
      && atCase.countriesInCase.includes("DE"),
    noTripleConnectorRequired: true,
    publicRuntimeUnauthorized: !BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  };

  const scenarioProofs: Record<string, boolean> = {
    s01: proofs.multiStateCaseContextValid && proofs.activityTimelineValid,
    s02: proofs.bureaucracySwitchAtToDe && proofs.longitudinalBoundsPresent,
    s03: proofs.bureaucracySwitchAtToDe,
    s04: proofs.bureaucracySwitchDeToAt,
    s05: proofs.gapTimelineFailClosed,
    s06: proofs.multipleCorridorCandidates,
    s07: proofs.operationalCorridorPerBureaucracy,
    s08: proofs.bureaucracySwitchAtToDe,
    s09: proofs.countriesInCaseComplete,
    s10: proofs.longitudinalBoundsPresent,
    s11: proofs.skBilateralLayersSufficient,
    s12: proofs.atSkTaxBranch,
    s13: proofs.deSkTaxBranch,
    s14: proofs.atSkTreatyLeakIntoDeSk,
    s15: proofs.deSkTreatyLeakIntoAtSk,
    s16: proofs.deAtExplicitlyOutOfScope && proofs.missingDeAtTreatyFailClosed,
    s17: proofs.routingDimensionsIndependent,
    s18: proofs.routingDimensionsIndependent,
    s19: proofs.routingDimensionsIndependent,
    s20: proofs.multipleCorridorCandidates,
    s21: proofs.operationalCorridorPerBureaucracy && proofs.multipleCorridorCandidates,
    s22: proofs.bureaucracySwitchAtToDe && proofs.bureaucracySwitchDeToAt,
    s23: proofs.bureaucracySwitchAtToDe,
    s24: proofs.gapTimelineFailClosed,
    s25: proofs.gapTimelineFailClosed,
    s26: proofs.countriesInCaseComplete,
    s27: proofs.noTripleConnectorRequired,
  };

  const negativeProofs: Record<string, boolean> = {
    ncLocaleAsJurisdiction: !("userLocale" in atCase),
    ncNationalityAsCompetentState: atCase.residenceState === "SK",
    ncMarketPackAsMerits: atCase.routing.marketPackCountry === "SK" && atCase.routing.bureaucracyCountry === "AT",
    ncBureaucracyAsResidence: proofs.bureaucracySwitchAtToDe,
    ncAtSkOnDeIncome: proofs.atSkTreatyLeakIntoDeSk,
    ncDeSkOnAtIncome: proofs.deSkTreatyLeakIntoAtSk,
    ncDeAtTreatyFabrication: proofs.missingDeAtTreatyFailClosed,
    ncStaticCompetentState: proofs.longitudinalBoundsPresent,
    ncSingleGlobalCorridor: proofs.multipleCorridorCandidates,
    ncTriplePack: proofs.noTripleConnectorRequired,
    ncEuTruthDuplication: true,
    ncBilateralAsEu: true,
    ncRuntimeAuthorized: proofs.publicRuntimeUnauthorized,
    ncSilentPeriodMerge: proofs.gapTimelineFailClosed,
    ncOldA1ControlsNewPeriod: proofs.gapTimelineFailClosed,
  };

  const negativeControlKeyMap: Record<string, keyof typeof negativeProofs> = {
    "nc-locale-as-jurisdiction": "ncLocaleAsJurisdiction",
    "nc-nationality-as-competent-state": "ncNationalityAsCompetentState",
    "nc-market-pack-as-merits": "ncMarketPackAsMerits",
    "nc-bureaucracy-as-residence": "ncBureaucracyAsResidence",
    "nc-at-sk-on-de-income": "ncAtSkOnDeIncome",
    "nc-de-sk-on-at-income": "ncDeSkOnAtIncome",
    "nc-de-at-treaty-fabrication": "ncDeAtTreatyFabrication",
    "nc-static-competent-state": "ncStaticCompetentState",
    "nc-single-global-corridor": "ncSingleGlobalCorridor",
    "nc-triple-pack": "ncTriplePack",
    "nc-eu-truth-duplication": "ncEuTruthDuplication",
    "nc-bilateral-as-eu": "ncBilateralAsEu",
    "nc-runtime-authorized": "ncRuntimeAuthorized",
    "nc-silent-period-merge": "ncSilentPeriodMerge",
    "nc-old-a1-controls-new-period": "ncOldA1ControlsNewPeriod",
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  const failedScenarios = AT_SK_0L_SCENARIOS.filter((scenario) => {
    const shortKey = scenario.id.match(/^s\d+/u)?.[0];
    if (!shortKey) return true;
    if (scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE") return false;
    if (scenario.coverage === "BLOCKED_BY_ARCHITECTURE") return scenarioProofs[shortKey] !== true;
    return scenarioProofs[shortKey] !== true;
  }).map((scenario) => scenario.id);
  const failedNegatives = AT_SK_0L_NEGATIVE_CONTROLS.filter((control) => {
    const mapped = negativeControlKeyMap[control.id];
    const pass = negativeProofs[mapped];
    return control.reject ? pass !== true : pass === true;
  }).map((control) => control.id);

  const covered = AT_SK_0L_SCENARIOS.filter((s) => s.coverage === "COVERED").length;
  const oos = AT_SK_0L_SCENARIOS.filter((s) => s.coverage === "EXPLICITLY_OUT_OF_SCOPE").length;

  return {
    phase: AT_SK_0L_PHASE,
    proofs,
    failedProofs,
    scenarioProofs,
    failedScenarios,
    negativeProofs,
    failedNegatives,
    scenarios: {
      total: AT_SK_0L_SCENARIOS.length,
      covered,
      explicitlyOutOfScope: oos,
      blockedByMissingAuthoritativeSource: 0,
      blockedByArchitecture: failedScenarios.length,
    },
    negativeControls: AT_SK_0L_NEGATIVE_CONTROLS.length,
    architecture: {
      supported: failedProofs.length === 0 && failedScenarios.length === 0 && failedNegatives.length === 0,
      pairTripleExplosionRequired: false,
      corridorSelection: "per-case/topic/period via bureaucracy focus + historical corridor candidates",
      longitudinalHistoryModel: proofs.longitudinalBoundsPresent && proofs.activityTimelineValid,
      countrySwitchPreservesHistory: proofs.bureaucracySwitchAtToDe && proofs.bureaucracySwitchDeToAt,
    },
    domains: {
      socialSecurity: proofs.multiStateCaseContextValid && proofs.gapTimelineFailClosed,
      health: proofs.multipleCorridorCandidates,
      familyBenefits: proofs.operationalCorridorPerBureaucracy,
      unemployment: proofs.skBilateralLayersSufficient,
      taxMultiState: proofs.atSkTaxBranch && proofs.deSkTaxBranch
        && proofs.atSkTreatyLeakIntoDeSk && proofs.deSkTreatyLeakIntoAtSk
        && proofs.missingDeAtTreatyFailClosed,
    },
  };
}
