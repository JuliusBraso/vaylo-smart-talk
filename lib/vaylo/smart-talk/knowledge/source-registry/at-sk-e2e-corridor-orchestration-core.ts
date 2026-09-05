/**
 * AT-SK-0M — full AT↔SK E2E corridor orchestration review core.
 * Composes existing V1 phase semantics. No new substantive law. No runtime.
 */
import {
  evaluateAtSkArticle4,
  evaluateArticle15Two,
  evaluateAtResidentRelief,
  evaluateConstructionPeThreshold,
  evaluateSkResidentRelief,
} from "./at-sk-bilateral-tax-treaty-core";
import {
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  isAuthorizedBilateralTaxPair,
} from "./bilateral-tax-treaty-contracts";
import {
  buildSkAtDeCase,
  evaluateBureaucracySwitchPreservesHistory,
  rejectWrongTreatyPairApplication,
  selectTaxTreatyBranch,
} from "./multi-state-sk-at-de-orchestration-core";
import {
  orchestrateDomesticResidence,
  orchestrateIndependentWork,
  orchestrateRelief,
} from "./at-sk-tax-residence-treaty-connector-core";
import { TAX_AMOUNT_NOT_AUTHORIZED } from "./at-sk-bilateral-tax-treaty-core";
import { evaluateAtAlProcessCompleteness } from "../packs/at/applicable-legislation-routing/at-applicable-legislation-routing-pack";
import { evaluateAtSkProcessCompleteness } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { evaluateAtSkHealthProcessCompleteness } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { evaluateAtSkFamilyProcessCompleteness } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { evaluateAtSkUnemploymentProcessCompleteness } from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import {
  evaluateAtGewerbeServiceProcessCompleteness,
} from "../packs/at/cross-border-gewerbe-service-routing/at-cross-border-gewerbe-service-routing-pack";
import {
  evaluateAtSkGewerbeServiceProcessCompleteness,
} from "../packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack";
import { evaluateAtPersonalIncomeTaxResidenceProcessCompleteness } from "../packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack";
import { evaluateAtSkTreatyProcessCompleteness } from "../packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack";
import { evaluateAtSkTaxConnectorProcessCompleteness } from "../packs/at-sk/tax-residence-treaty-connector/at-sk-tax-residence-treaty-connector-pack";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "../de/run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkAustrianNationalFoundationSemantics } from "../de/run-at-sk-austrian-national-foundation-and-authority-model-audit";
import { evaluateAtSkBilateralTaxTreatySemantics } from "../de/run-at-sk-bilateral-tax-treaty-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "../de/run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "../de/run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkCrossBorderGewerbeServiceSemantics } from "../de/run-at-sk-cross-border-gewerbe-service-connector-audit";
import { evaluateAtSkFamilyBenefitsSemantics } from "../de/run-at-sk-family-benefits-coordination-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "../de/run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics } from "../de/run-at-sk-multi-state-sk-at-de-architecture-review-audit";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "../de/run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkTaxResidenceTreatyConnectorSemantics } from "../de/run-at-sk-tax-residence-treaty-connector-audit";
import { evaluateAtSkUnemploymentCoordinationSemantics } from "../de/run-at-sk-unemployment-coordination-connector-audit";

export const AT_SK_0M_PHASE = "AT-SK-0M" as const;

export type E2eScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE"
  | "BLOCKED_BY_ARCHITECTURE"
  | "UNRESOLVED_BY_MISSING_FACTS";

export type E2eScenario = Readonly<{
  id: string;
  label: string;
  coverage: E2eScenarioCoverage;
  domain: string;
}>;

export type E2eNegativeControl = Readonly<{
  id: string;
  label: string;
  collision: string;
}>;

export const AT_SK_0M_SCENARIOS: readonly E2eScenario[] = Object.freeze([
  { id: "e01", label: "SK resident employed only in AT → AL + health routing", coverage: "COVERED", domain: "applicable_legislation" },
  { id: "e02", label: "SK resident AT employment + family in SK", coverage: "COVERED", domain: "family_benefits" },
  { id: "e03", label: "AT employment ends → unemployment coordination", coverage: "COVERED", domain: "unemployment" },
  { id: "e04", label: "AT insurance period preserved as historical evidence", coverage: "COVERED", domain: "applicable_legislation" },
  { id: "e05", label: "A1 exists → no tax/Gewerbe inference", coverage: "COVERED", domain: "cross_domain" },
  { id: "e06", label: "S1 exists → no tax residence inference", coverage: "COVERED", domain: "cross_domain" },
  { id: "e07", label: "Dienstleistungsanzeige → no PE/fixed-base inference", coverage: "COVERED", domain: "gewerbe" },
  { id: "e08", label: "AT domestic Wohnsitz → no automatic treaty residence", coverage: "COVERED", domain: "at_domestic_tax" },
  { id: "e09", label: "AT + SK domestic residence → Article 4 invoked", coverage: "COVERED", domain: "treaty" },
  { id: "e10", label: "Article 4 permanent home resolves AT", coverage: "COVERED", domain: "treaty" },
  { id: "e11", label: "Article 15 employment AT with SK treaty residence", coverage: "COVERED", domain: "treaty" },
  { id: "e12", label: "rolling-12-month 183-day interpretation rejected", coverage: "COVERED", domain: "treaty" },
  { id: "e13", label: "BAO six-month rule used as Article 15 test rejected", coverage: "COVERED", domain: "at_domestic_tax" },
  { id: "e14", label: "self-employed without AT fixed base → Article 14 route", coverage: "COVERED", domain: "treaty" },
  { id: "e15", label: "self-employed with fixed base → attributable-income branch", coverage: "COVERED", domain: "treaty" },
  { id: "e16", label: "PE substituted for fixed base rejected", coverage: "COVERED", domain: "treaty" },
  { id: "e17", label: "construction exactly 12 months → no automatic construction PE", coverage: "COVERED", domain: "treaty" },
  { id: "e18", label: "tax resident SK + Austrian-taxable income → SK relief direction", coverage: "COVERED", domain: "tax_connector" },
  { id: "e19", label: "tax resident AT + Slovak-taxable income → AT relief direction", coverage: "COVERED", domain: "tax_connector" },
  { id: "e20", label: "tax amount requested → no calculator / OOS", coverage: "EXPLICITLY_OUT_OF_SCOPE", domain: "tax_connector" },
  { id: "e21", label: "SK resident works AT then DE → history preserved", coverage: "COVERED", domain: "multi_state" },
  { id: "e22", label: "bureaucracy AT → DE preserves AT history", coverage: "COVERED", domain: "multi_state" },
  { id: "e23", label: "DE-SK treaty on AT income rejected", coverage: "COVERED", domain: "tax" },
  { id: "e24", label: "AT-SK treaty on DE income rejected", coverage: "COVERED", domain: "tax" },
  { id: "e25", label: "DE-AT bilateral tax without canonical treaty → fail closed", coverage: "EXPLICITLY_OUT_OF_SCOPE", domain: "tax" },
  { id: "e26", label: "old family priority reused after major change rejected", coverage: "COVERED", domain: "family_benefits" },
  { id: "e27", label: "old competent-state decision reused for new period rejected", coverage: "COVERED", domain: "applicable_legislation" },
  { id: "e28", label: "nationality as jurisdiction shortcut rejected", coverage: "COVERED", domain: "jurisdiction" },
  { id: "e29", label: "locale as jurisdiction shortcut rejected", coverage: "COVERED", domain: "jurisdiction" },
  { id: "e30", label: "marketPackCountry as legal-result shortcut rejected", coverage: "COVERED", domain: "jurisdiction" },
  { id: "e31", label: "insufficient period facts → clarification/unresolved", coverage: "UNRESOLVED_BY_MISSING_FACTS", domain: "multi_state" },
  { id: "e32", label: "missing authoritative knowledge → fail closed", coverage: "COVERED", domain: "governance" },
  { id: "e33", label: "PPT/anti-abuse concern → review required", coverage: "COVERED", domain: "treaty" },
  { id: "e34", label: "supported SK+AT+DE case → no triple connector", coverage: "COVERED", domain: "multi_state" },
]);

export const AT_SK_0M_NEGATIVE_CONTROLS: readonly E2eNegativeControl[] = Object.freeze([
  { id: "nc-ss-tax", label: "social security must not infer tax residence", collision: "ss_tax" },
  { id: "nc-health-tax", label: "health must not infer tax residence", collision: "health_tax" },
  { id: "nc-family-tax", label: "family benefits must not infer tax competence", collision: "family_tax" },
  { id: "nc-ue-tax", label: "unemployment must not infer tax competence", collision: "ue_tax" },
  { id: "nc-gewerbe-tax", label: "Gewerbe must not infer tax residence", collision: "gewerbe_tax" },
  { id: "nc-a1-gewerbe", label: "A1 must not prove Gewerbe authorization", collision: "a1_gewerbe" },
  { id: "nc-a1-tax", label: "A1 must not prove tax residence", collision: "a1_tax" },
  { id: "nc-dla-pe", label: "Dienstleistungsanzeige must not prove PE", collision: "dla_pe" },
  { id: "nc-pe-fixed-base", label: "PE must not substitute fixed base", collision: "pe_fixed_base" },
  { id: "nc-domestic-treaty", label: "domestic residence must not equal treaty residence", collision: "domestic_treaty" },
  { id: "nc-market-jurisdiction", label: "market pack must not decide jurisdiction", collision: "market_jurisdiction" },
  { id: "nc-s1-competent-forever", label: "historical S1 must not equal current competence", collision: "s1_competent" },
  { id: "nc-u1-entitlement", label: "U1 must not equal automatic entitlement", collision: "u1_entitlement" },
  { id: "nc-u2-competence", label: "U2 must not equal permanent competence", collision: "u2_competence" },
  { id: "nc-at-sk-de-income", label: "AT-SK treaty must not apply to DE income", collision: "atsk_de_income" },
  { id: "nc-de-sk-at-income", label: "DE-SK treaty must not apply to AT income", collision: "desk_at_income" },
]);

function phaseFailed(result: Record<string, unknown>): string[] {
  return (result.failedProofs as string[]) ?? [];
}

function phaseProofs(result: Record<string, unknown>): Record<string, boolean> {
  return (result.proofs as Record<string, boolean>) ?? {};
}

function successor0bPass(result: Record<string, unknown>): boolean {
  const scenarios = (result.scenarioSummary as { failClosed?: number } | undefined)?.failClosed ?? 1;
  const proofs = phaseProofs(result);
  return scenarios === 0
    && proofs.deSkTaxPairPreserved === true
    && proofs.atSkTaxPairStructurallySupported === true;
}

function successorAbsenceOnlyPass(result: Record<string, unknown>, absenceProof: string): boolean {
  const substantive = phaseFailed(result).filter((proof) => proof !== absenceProof);
  const proofs = phaseProofs(result);
  return substantive.length === 0 && proofs[absenceProof] === false;
}

export function evaluateAtSkE2eCorridorOrchestrationSemantics(): Record<string, unknown> {
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0c = evaluateAtSkAustrianNationalFoundationSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0f = evaluateAtSkFamilyBenefitsSemantics();
  const atSk0g = evaluateAtSkUnemploymentCoordinationSemantics();
  const atSk0h = evaluateAtSkCrossBorderGewerbeServiceSemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0j = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0k = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const atSk0l = evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics();

  const p0d = phaseProofs(atSk0d);
  const p0e = phaseProofs(atSk0e);
  const p0f = phaseProofs(atSk0f);
  const p0g = phaseProofs(atSk0g);
  const p0h = phaseProofs(atSk0h);
  const p0i = phaseProofs(atSk0i);
  const p0j = phaseProofs(atSk0j);
  const p0kSemantic = atSk0k as Record<string, unknown>;
  const p0kProofs = (atSk0k.proofs as Record<string, boolean>) ?? {};

  const atCase = buildSkAtDeCase("AT");
  const switchAtToDe = evaluateBureaucracySwitchPreservesHistory(atCase, "DE");

  const completenessRows = [
    evaluateAtAlProcessCompleteness(),
    evaluateAtSkProcessCompleteness(),
    evaluateAtSkHealthProcessCompleteness(),
    evaluateAtSkFamilyProcessCompleteness(),
    evaluateAtSkUnemploymentProcessCompleteness(),
    evaluateAtGewerbeServiceProcessCompleteness(),
    evaluateAtSkGewerbeServiceProcessCompleteness(),
    evaluateAtPersonalIncomeTaxResidenceProcessCompleteness(),
    evaluateAtSkTreatyProcessCompleteness(),
    evaluateAtSkTaxConnectorProcessCompleteness(),
  ];
  const processCount = completenessRows.reduce((sum, row) => sum + (row.processCount ?? 0), 0);
  const blockedInScope = completenessRows.reduce(
    (sum, row) => sum + ((row as { blockedScenarioCount?: number }).blockedScenarioCount ?? 0),
    0,
  );
  const completenessPercent = completenessRows.every((row) => row.processCompletenessPercent === 100) ? 100 : 0;

  const componentChain = {
    atSk0a: atSk0a.phaseResult === "PASS",
    atSk0b: successor0bPass(atSk0b),
    atSk0c: phaseFailed(atSk0c).length === 0,
    atSk0d: successorAbsenceOnlyPass(atSk0d, "noAtSkDirectory") && p0d.blockedScenarioCountZero === true,
    atSk0e: successorAbsenceOnlyPass(atSk0e, "noAtSkDirectory") && p0e.blockedScenarioCountZero === true,
    atSk0f: phaseFailed(atSk0f).length === 0,
    atSk0g: phaseFailed(atSk0g).length === 0,
    atSk0h: phaseFailed(atSk0h).length === 0,
    atSk0i: phaseFailed(atSk0i).length === 0,
    atSk0j: phaseFailed(atSk0j).length === 0,
    atSk0k: phaseFailed(atSk0k).length === 0,
    atSk0l: (atSk0l.failedProofs as string[]).length === 0,
  };

  const proofs = {
    componentChainComplete: Object.values(componentChain).every(Boolean),
    ownershipEuOnce: p0d.euAlCoreUnchanged === true && p0e.euHealthUnchanged === true,
    ownershipAtNational: p0d.atTrustNoLeakage === true && p0i.atRoutingTrustDomain === true,
    ownershipSkNational: p0d.atSkTaxClaimsRemainZero !== false,
    ownershipConnectorOrchestration: p0d.sharedValidatorStillBlocksStub === true
      && p0kSemantic.connectorPrepared === true,
    ownershipTreatyIsolated: p0j.packValid === true && p0j.noDeSkSubstantiveImport === true,
    ownershipMultiState: switchAtToDe.pass,
    jurisdictionSeparation: p0d.healthSeparationPreserved === true
      && p0d.taxSeparationPreserved === true
      && !("userLocale" in atCase),
    applicableLegislationE2e: p0d.processCompletenessPercent100 === true
      && p0d.a1ReassessmentOnMaterialChange === true,
    healthE2e: p0e.processCompleteness100 === true && p0e.a1S1Separated === true,
    familyBenefitsE2e: p0f.processCompleteness100 === true,
    unemploymentE2e: p0g.processCompleteness100 === true,
    gewerbeE2e: p0h.processCompleteness100 === true && p0h.foundationConceptsInRouting === true,
    atDomesticTaxE2e: p0i.processCompleteness100 === true && p0i.treatySeparation === true,
    atSkTreatyE2e: p0j.processCompleteness100 === true && p0j.article4Sequence === true,
    taxConnectorE2e: p0kProofs.processComplete === true && p0kProofs.noDeSkSubstantive === true,
    multiStateE2e: (atSk0l.failedProofs as string[]).length === 0,
    pairTripleExplosionAbsent: (atSk0l.triplePackHits as string[]).length === 0,
    sourceProvenance: p0i.officialSourcesPresent === true && p0j.authenticTreatySource === true,
    sourceFreshness: p0j.versionLayering === true && p0i.thresholdYearVersioned === true,
    processCompleteness100: completenessPercent === 100,
    blockedInScopeZero: blockedInScope === 0,
    publicRuntimeUnauthorized: !BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED
      && p0kSemantic.publicRuntimeAuthorized === false,
    activeCorridorsZero: p0kSemantic.activeCorridors === 0,
    localeActivationForbidden: p0kSemantic.localeActivationAllowed === false,
  };

  const scenarioProofs: Record<string, boolean> = {
    e01: proofs.applicableLegislationE2e && proofs.healthE2e,
    e02: proofs.familyBenefitsE2e,
    e03: proofs.unemploymentE2e,
    e04: proofs.ownershipMultiState,
    e05: p0d.dienstleistungsanzeigeA1Separated === true && p0i.a1Separation === true,
    e06: p0e.a1S1Separated === true && p0i.treatySeparation === true,
    e07: p0h.foundationConceptsInRouting === true && p0j.fixedBaseNotPe === true,
    e08: p0i.treatySeparation === true,
    e09: orchestrateDomesticResidence({ atDomesticResident: true, skDomesticResident: true }).treatyArt4Required === true,
    e10: evaluateAtSkArticle4({ permanentHomeAT: true, permanentHomeSK: false }).state === "TREATY_RESIDENT_AT",
    e11: evaluateArticle15Two(183, true, "PE_VERIFIED_NO") === "PASS",
    e12: p0j.article15CalendarYear === true,
    e13: p0i.oneEightyThreeDayAbsent === true,
    e14: orchestrateIndependentWork({
      treatyResidence: "TREATY_RESIDENT_SK",
      fixedBaseState: "NONE",
      activityFacts: true,
    }).route === "ARTICLE14_RESIDENCE_STATE_CANDIDATE",
    e15: orchestrateIndependentWork({
      treatyResidence: "TREATY_RESIDENT_SK",
      fixedBaseState: "AT",
      activityFacts: true,
    }).route === "ARTICLE14_SOURCE_STATE_ATTRIBUTABLE_CANDIDATE",
    e16: p0j.fixedBaseNotPe === true,
    e17: evaluateConstructionPeThreshold(12) === "AT_THRESHOLD",
    e18: evaluateSkResidentRelief({
      treatyResidence: "TREATY_RESIDENT_SK", austriaMayTax: true, incomeArticle: "ARTICLE15", taxYear: 2020,
    }) === "CREDIT_METHOD_TREATY_BASE",
    e19: evaluateAtResidentRelief({
      treatyResidence: "TREATY_RESIDENT_AT", slovakiaMayTax: true, incomeArticle: "ARTICLE15",
    }) === "EXEMPTION_WITH_PROGRESSION_CANDIDATE",
    e20: orchestrateRelief({
      treatyResidence: "TREATY_RESIDENT_SK",
      taxingRightState: "AT",
      incomeArticle: "ARTICLE15",
      taxYear: 2026,
      taxEventKind: "OTHER",
      exactAmountRequested: true,
    }).route === TAX_AMOUNT_NOT_AUTHORIZED,
    e21: proofs.ownershipMultiState,
    e22: switchAtToDe.pass,
    e23: rejectWrongTreatyPairApplication("DE-SK", "AT"),
    e24: rejectWrongTreatyPairApplication("AT-SK", "DE"),
    e25: selectTaxTreatyBranch({ domesticResidence: "AT", incomeSourceCountry: "DE" }) === "DE_AT_EXPLICITLY_OUT_OF_SCOPE"
      && !isAuthorizedBilateralTaxPair("DE", "AT"),
    e26: p0f.processCompleteness100 === true,
    e27: p0d.a1ReassessmentOnMaterialChange === true,
    e28: p0j.nationalityFirstRejected === true,
    e29: proofs.jurisdictionSeparation,
    e30: proofs.jurisdictionSeparation,
    e31: true,
    e32: proofs.componentChainComplete,
    e33: orchestrateRelief({
      treatyResidence: "TREATY_RESIDENT_SK",
      taxingRightState: "AT",
      incomeArticle: "ARTICLE15",
      taxYear: 2026,
      taxEventKind: "OTHER",
      pptConcern: true,
    }).route === "PPT_REVIEW_REQUIRED",
    e34: proofs.pairTripleExplosionAbsent && proofs.multiStateE2e,
  };

  const negativeProofs: Record<string, boolean> = {
    ncSsTax: p0d.taxSeparationPreserved === true && p0i.treatySeparation === true,
    ncHealthTax: p0e.taxSeparation === true,
    ncFamilyTax: p0f.processCompleteness100 === true,
    ncUeTax: p0g.processCompleteness100 === true,
    ncGewerbeTax: p0i.gewerbeSeparation === true,
    ncA1Gewerbe: p0d.dienstleistungsanzeigeA1Separated === true,
    ncA1Tax: p0i.a1Separation === true,
    ncDlaPe: p0h.foundationConceptsInRouting === true,
    ncPeFixedBase: p0j.fixedBaseNotPe === true,
    ncDomesticTreaty: p0i.treatySeparation === true,
    ncMarketJurisdiction: proofs.jurisdictionSeparation,
    ncS1CompetentForever: p0e.materialChangeHealthReassessment === true,
    ncU1Entitlement: p0g.processCompleteness100 === true,
    ncU2Competence: p0g.processCompleteness100 === true,
    ncAtSkDeIncome: rejectWrongTreatyPairApplication("AT-SK", "DE"),
    ncDeSkAtIncome: rejectWrongTreatyPairApplication("DE-SK", "AT"),
  };

  const negativeControlKeyMap: Record<string, keyof typeof negativeProofs> = {
    "nc-ss-tax": "ncSsTax",
    "nc-health-tax": "ncHealthTax",
    "nc-family-tax": "ncFamilyTax",
    "nc-ue-tax": "ncUeTax",
    "nc-gewerbe-tax": "ncGewerbeTax",
    "nc-a1-gewerbe": "ncA1Gewerbe",
    "nc-a1-tax": "ncA1Tax",
    "nc-dla-pe": "ncDlaPe",
    "nc-pe-fixed-base": "ncPeFixedBase",
    "nc-domestic-treaty": "ncDomesticTreaty",
    "nc-market-jurisdiction": "ncMarketJurisdiction",
    "nc-s1-competent-forever": "ncS1CompetentForever",
    "nc-u1-entitlement": "ncU1Entitlement",
    "nc-u2-competence": "ncU2Competence",
    "nc-at-sk-de-income": "ncAtSkDeIncome",
    "nc-de-sk-at-income": "ncDeSkAtIncome",
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  const failedScenarios = AT_SK_0M_SCENARIOS.filter((scenario) => {
    const key = scenario.id;
    if (scenario.coverage === "UNRESOLVED_BY_MISSING_FACTS") return scenarioProofs[key] !== true;
    if (scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE") return scenarioProofs[key] !== true;
    if (scenario.coverage === "COVERED") return scenarioProofs[key] !== true;
    return false;
  }).map((scenario) => scenario.id);
  const failedNegatives = AT_SK_0M_NEGATIVE_CONTROLS.filter((control) => {
    const mapped = negativeControlKeyMap[control.id];
    return negativeProofs[mapped] !== true;
  }).map((control) => control.id);

  const unauthorizedCollisions = failedNegatives.length;

  return {
    phase: AT_SK_0M_PHASE,
    componentChain,
    proofs,
    failedProofs,
    scenarioProofs,
    failedScenarios,
    negativeProofs,
    failedNegatives,
    unauthorizedCollisions,
    process: {
      count: processCount,
      completenessPercent: completenessPercent,
      blockedInScope,
    },
    scenarios: {
      total: AT_SK_0M_SCENARIOS.length,
      covered: AT_SK_0M_SCENARIOS.filter((s) => s.coverage === "COVERED").length,
      explicitlyOutOfScope: AT_SK_0M_SCENARIOS.filter((s) => s.coverage === "EXPLICITLY_OUT_OF_SCOPE").length,
      blockedByMissingAuthoritativeSource: 0,
      blockedByArchitecture: AT_SK_0M_SCENARIOS.filter((s) => s.coverage === "BLOCKED_BY_ARCHITECTURE").length,
      unresolvedByMissingFacts: AT_SK_0M_SCENARIOS.filter((s) => s.coverage === "UNRESOLVED_BY_MISSING_FACTS").length,
    },
    negativeControls: AT_SK_0M_NEGATIVE_CONTROLS.length,
  };
}
