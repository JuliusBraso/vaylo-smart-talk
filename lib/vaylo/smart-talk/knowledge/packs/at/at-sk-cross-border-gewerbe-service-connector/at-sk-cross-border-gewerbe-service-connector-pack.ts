/**
 * AT-SK-0H AT↔SK cross-border Gewerbe / service authorization connector.
 * Links Austrian § 373a routing and Slovak home-state applicable-legislation adapter keys.
 * Does not copy EU Services Directive into a shared EU pack. euClaimRefs intentionally empty.
 * MUST NOT import from packs/de-sk/ or use DE_SK_* constants.
 */
import {
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_GEWERBE_PRIMARY_PROCESS_KEY,
  AT_GEWERBE_UNITS,
} from "../cross-border-gewerbe-service-routing/at-cross-border-gewerbe-service-routing-pack";
import {
  SK_AL_PRIMARY_PROCESS_KEY,
  SK_AL_UNITS,
} from "../../sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
} from "../../../source-registry/cross-border-connector-contracts";

export const AT_SK_GEWERBE_CONNECTOR_PACK_ID = "at_sk_cross_border_gewerbe_service" as const;
export const AT_SK_GEWERBE_CONNECTOR_STATUS = "prepared" as const;
export const AT_SK_GEWERBE_CONNECTOR_PROCESS_GROUP = "at_sk_cross_border_gewerbe_service_connector" as const;

export type AtOriginGewerbeStableReference = Readonly<{
  entityClass: "claims" | "processes";
  key: string;
  sourceJurisdiction: "AT";
  trustDomain: "at";
  temporalClass: "CURRENT";
}>;

export const AT_SK_GEWERBE_COPIED_EU_CLAIM_COUNT = 0 as const;

function atRef(key: string): AtOriginGewerbeStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "AT" as const,
    trustDomain: "at" as const, temporalClass: "CURRENT" as const,
  });
}
function skRef(key: string): ForeignNationalStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "SK" as const,
    trustDomain: "sk" as const, temporalClass: "CURRENT" as const,
  });
}

export const AT_SK_GEWERBE_EU_CLAIM_KEYS = Object.freeze([] as const);
export const AT_SK_GEWERBE_AT_CLAIM_KEYS = Object.freeze(AT_GEWERBE_UNITS.map((unit) => unit.key));
export const AT_SK_GEWERBE_SK_CLAIM_KEYS = Object.freeze(SK_AL_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;
type AnyRef = StableKnowledgeReference | ForeignNationalStableReference | AtOriginGewerbeStableReference;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly AnyRef[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`AT_SK_GEWERBE_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length) as CorridorProcessBinding["claimRefs"],
  });
}

export const AT_SK_GEWERBE_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("at-sk-gewerbe-case-classify", "AT-SK Gewerbe-Dienstleistungsweg einordnen", "Grenzüberschreitende Gewerbetätigkeit berührt Österreich und die Slowakei", "§ 373a, DLA und A1 trennen; Staatsangehörigkeit nicht als Niederlassungsnachweis setzen.", [atRef("at-373a-temporary-cross-border-framework"), atRef("at-gewerbe-establishment-home-state-required"), atRef("at-gewerbe-does-not-determine-a1"), skRef("sk-source-not-german-law"), skRef("sk-locale-not-jurisdiction"), atRef("at-gewerbe-does-not-copy-eu-directives"), atRef("at-373a-dienstleistungsanzeige-authority"), skRef("sk-application-not-entitlement"), atRef("at-dienstleistungsanzeige-not-a1"), atRef("at-a1-not-dienstleistungsanzeige"), skRef("sk-sp-posting-from-slovakia"), atRef("at-gewerbe-application-not-approval")]),
  binding("at-sk-gewerbe-sk-home-to-at-service", "SK-Heimatstaat Dienstleistung nach Österreich", "Slowakische Niederlassung erbringt reglementierte Dienstleistung in Österreich", "Heimatstaat-Niederlassung verlangen; BMWET-DLA bei § 94, nicht Gewerbebehörde pauschal.", [atRef("at-gewerbe-regulated-94-dla-required"), atRef("at-373a-dienstleistungsanzeige-authority"), atRef("at-gewerbebehoerde-not-universal-373a"), atRef("at-dienstleistungsanzeige-annual-renewal"), skRef("sk-szco-individual-other-channels"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-no-arbitrary-duration-thresholds"), atRef("at-gewerbe-temporary-not-pe"), atRef("at-dienstleistungsanzeige-not-tax"), skRef("sk-change-reporting"), atRef("at-gewerbe-bmwet-channel-fetch-live"), atRef("at-gewerbe-dla-not-entitlement")]),
  binding("at-sk-gewerbe-sk-szco-home-state", "SK SZČO Heimatstaat und AT-Dienstleistung", "SZČO mit slowakischer Niederlassung will in Österreich Dienstleistungen erbringen", "SZČO-Kanal von Arbeitgeberposting trennen; A1 nicht als DLA setzen.", [skRef("sk-szco-individual-other-channels"), skRef("sk-szco-multi-state-application"), skRef("sk-efiling-employers-not-all-persons"), atRef("at-a1-not-dienstleistungsanzeige"), atRef("at-dienstleistungsanzeige-not-a1"), atRef("at-gewerbe-zko-posting-not-dla-handoff"), atRef("at-gewerbe-posting-not-automatic-dla"), skRef("sk-application-not-entitlement"), atRef("at-373a-dienstleistungsanzeige-authority"), atRef("at-gewerbe-regulated-94-dla-required"), skRef("sk-change-reporting"), atRef("at-gewerbe-a1-handoff-applicable-legislation")]),
  binding("at-sk-gewerbe-at-home-to-sk-service", "AT-Heimatstaat Dienstleistung in die Slowakei", "Österreichische Niederlassung erbringt Dienstleistung in der Slowakei", "Österreichisches §-373a-Routing nicht auf slowakisches Gewerberecht übertragen.", [atRef("at-373a-temporary-cross-border-framework"), atRef("at-gewerbe-local-gewerbe-not-373a-route"), skRef("sk-source-not-german-law"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-does-not-determine-a1"), skRef("sk-sp-posting-from-slovakia"), atRef("at-bmwet-not-all-gewerbe"), skRef("sk-branch-contact-fetch-live"), atRef("at-gewerbe-permanent-not-373a"), skRef("sk-45-day-posting-not-universal"), atRef("at-gewerbe-forms-cache-and-revalidate"), atRef("at-gewerbe-application-not-approval")]),
  binding("at-sk-gewerbe-regulated-94-dla", "Reglementiertes Gewerbe § 94 DLA AT-SK", "Reglementiertes Gewerbe aus SK nach AT oder umgekehrt verwechselt", "§ 94 DLA BMWET in AT; slowakische Heimatstaatnachweise getrennt führen.", [atRef("at-gewerbe-regulated-94-dla-required"), atRef("at-373a-dienstleistungsanzeige-authority"), atRef("at-gewerbe-non-regulated-373a-scope"), atRef("at-dienstleistungsanzeige-annual-renewal"), atRef("at-gewerbe-annual-renewal-not-permanent"), atRef("at-gewerbebehoerde-not-universal-373a"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-dla-not-entitlement"), atRef("at-gewerbe-usp-not-statute"), skRef("sk-source-not-german-law"), atRef("at-bmwet-current-ministry"), atRef("at-gewerbe-bmwet-channel-fetch-live")]),
  binding("at-sk-gewerbe-a1-dla-separation", "A1 und Dienstleistungsanzeige AT-SK trennen", "A1 oder PD-A1 soll österreichische DLA ersetzen", "A1 an Sociálna poisťovňa-Route; DLA an BMWET bei § 94.", [atRef("at-dienstleistungsanzeige-not-a1"), atRef("at-a1-not-dienstleistungsanzeige"), skRef("sk-application-not-entitlement"), skRef("sk-sp-posting-from-slovakia"), atRef("at-gewerbe-zko-posting-not-dla-handoff"), atRef("at-gewerbe-posting-not-automatic-dla"), atRef("at-gewerbe-a1-handoff-applicable-legislation"), atRef("at-gewerbe-does-not-determine-a1"), skRef("sk-ordinary-sk-activity-may-need-a1"), atRef("at-gewerbe-application-not-approval"), skRef("sk-change-reporting"), atRef("at-373a-dienstleistungsanzeige-authority")]),
  binding("at-sk-gewerbe-zko-posting-handoff", "ZKO-Entsendung ersetzt DLA nicht", "Slowakische Entsendung oder A1 als alleiniger AT-Gewerbeweg", "Posting-Handoff an anwendbare Rechtsvorschriften; DLA separat prüfen.", [atRef("at-gewerbe-zko-posting-not-dla-handoff"), atRef("at-gewerbe-posting-not-automatic-dla"), skRef("sk-sp-posting-from-slovakia"), skRef("sk-45-day-posting-not-universal"), skRef("sk-application-not-entitlement"), atRef("at-a1-not-dienstleistungsanzeige"), atRef("at-dienstleistungsanzeige-not-a1"), skRef("sk-employer-efiling-effective-2026-09-01"), atRef("at-gewerbe-a1-handoff-applicable-legislation"), skRef("sk-24h-not-guarantee"), atRef("at-373a-dienstleistungsanzeige-authority"), skRef("sk-change-reporting")]),
  binding("at-sk-gewerbe-applicable-legislation-delegate", "Anwendbare Rechtsvorschriften delegieren", "Unklares anzuwendbares Recht bei gleichzeitiger Dienstleistung", "Artikel 11–13 nicht neu entscheiden; Mehrstaaten-SK-Anträge nutzen.", [atRef("at-gewerbe-does-not-determine-a1"), atRef("at-gewerbe-a1-handoff-applicable-legislation"), skRef("sk-residence-makes-sp-residence-institution"), skRef("sk-employee-multi-state-application"), skRef("sk-szco-multi-state-application"), skRef("sk-mixed-multi-state-application"), skRef("sk-citizenship-not-first-institution"), skRef("sk-employer-not-automatic-sk-law"), atRef("at-gewerbe-does-not-copy-eu-directives"), skRef("sk-non-residence-not-first-institution"), skRef("sk-branch-contact-fetch-live"), skRef("sk-change-reporting")]),
  binding("at-sk-gewerbe-tax-pe-boundary", "DLA, Steuer und Betriebsstätte AT-SK", "Dienstleistungsanzeige soll Steuer- oder PE-Wirkung begründen", "DLA gewerberechtlich; inländische Steuer und PE getrennt.", [atRef("at-dienstleistungsanzeige-not-tax"), atRef("at-gewerbe-temporary-not-pe"), atRef("at-gewerbe-annual-renewal-not-permanent"), atRef("at-gewerbe-permanent-not-373a"), skRef("sk-source-not-german-law"), atRef("at-gewerbe-finanzamt-not-dla"), atRef("at-gewerbe-application-not-approval"), atRef("at-gewerbe-dla-not-entitlement"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-no-arbitrary-duration-thresholds"), atRef("at-gewerbe-occasional-not-frequency-formula"), atRef("at-gewerbe-usp-not-statute")]),
  binding("at-sk-gewerbe-swiss-negative-control", "Schweizer 90-Tage-Regel nicht verallgemeinern", "CH-Regel auf EU/EWR-§-373a-Fall angewendet", "Schweizer bilateral getrennt; § 373a ohne CH-Schwelle.", [atRef("at-gewerbe-swiss-90-day-not-eu-ewr"), atRef("at-gewerbe-ch-bilateral-not-373a"), atRef("at-gewerbe-no-arbitrary-duration-thresholds"), atRef("at-gewerbe-ewr-not-third-country"), atRef("at-gewerbe-uk-out-of-scope"), atRef("at-373a-temporary-cross-border-framework"), skRef("sk-framework-not-third-state"), atRef("at-gewerbe-occasional-not-frequency-formula"), skRef("sk-source-not-german-law"), atRef("at-gewerbe-temporary-not-pe"), atRef("at-gewerbe-establishment-home-state-required"), atRef("at-gewerbe-ch-bilateral-not-373a")]),
  binding("at-sk-gewerbe-duration-no-threshold", "Keine erfundenen Dauerschwellen", "Feste Tages- oder Monatsgrenze für vorübergehend/gelegentlich", "§-373a-Qualifikatoren ohne willkürliche Schwellen; SK-Fristen nicht vermengen.", [atRef("at-gewerbe-no-arbitrary-duration-thresholds"), atRef("at-gewerbe-occasional-not-frequency-formula"), skRef("sk-45-day-posting-not-universal"), skRef("sk-60-day-hq-not-universal"), skRef("sk-7-day-not-universal"), skRef("sk-24h-not-guarantee"), atRef("at-373a-temporary-cross-border-framework"), atRef("at-gewerbe-swiss-90-day-not-eu-ewr"), atRef("at-gewerbe-temporary-not-pe"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-application-not-approval"), atRef("at-gewerbe-forms-cache-and-revalidate")]),
  binding("at-sk-gewerbe-annual-renewal", "Jährliche DLA-Erneuerung AT-SK", "Dienstleistung im Folgejahr aus SK nach AT fortgesetzt", "Jahresabsicht und BMWET-Erneuerung; nicht mit Niederlassung verwechseln.", [atRef("at-dienstleistungsanzeige-annual-renewal"), atRef("at-gewerbe-annual-renewal-not-permanent"), atRef("at-373a-dienstleistungsanzeige-authority"), atRef("at-gewerbe-bmwet-channel-fetch-live"), atRef("at-gewerbe-forms-cache-and-revalidate"), atRef("at-gewerbe-dla-not-entitlement"), skRef("sk-change-reporting"), atRef("at-gewerbe-temporary-not-pe"), atRef("at-gewerbe-application-not-approval"), skRef("sk-application-not-entitlement"), atRef("at-bmwet-current-ministry"), atRef("at-gewerbe-usp-not-statute")]),
  binding("at-sk-gewerbe-authority-split", "BMWET, Gewerbebehörde, SP trennen", "Falsche Behörde für DLA oder A1 genannt", "BMWET für §-373a-DLA; Sociálna poisťovňa für A1; AMS/Finanzamt nicht DLA.", [atRef("at-373a-dienstleistungsanzeige-authority"), atRef("at-gewerbebehoerde-not-universal-373a"), atRef("at-gewerbe-finanzamt-not-dla"), atRef("at-gewerbe-ams-not-dla"), atRef("at-gewerbe-svs-not-dla"), skRef("sk-sp-posting-from-slovakia"), skRef("sk-mpsvr-not-sp"), skRef("sk-branch-contact-fetch-live"), atRef("at-bmwet-not-all-gewerbe"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-bmwet-channel-fetch-live"), atRef("at-gewerbe-local-gewerbe-not-373a-route")]),
  binding("at-sk-gewerbe-non-regulated-scope", "Nicht reglementiertes Gewerbe AT-SK", "Freies Gewerbe mit §-373a verwechselt", "§-373a-Rahmen ohne §-94-DLA; inländische Verfahren separat.", [atRef("at-gewerbe-non-regulated-373a-scope"), atRef("at-373a-temporary-cross-border-framework"), atRef("at-gewerbe-regulated-94-dla-required"), atRef("at-gewerbe-local-gewerbe-not-373a-route"), atRef("at-gewerbe-permanent-not-373a"), skRef("sk-source-not-german-law"), atRef("at-gewerbe-establishment-home-state-required"), atRef("at-gewerbe-temporary-not-pe"), skRef("sk-application-not-entitlement"), atRef("at-gewerbe-application-not-approval"), atRef("at-gewerbe-no-arbitrary-duration-thresholds"), atRef("at-gewerbe-forms-cache-and-revalidate")]),
  binding("at-sk-gewerbe-supporting-eu-background", "EU-Richtlinien nur unterstützend", "RL 2005/36 oder 2006/123 ersetzt § 373a", "Unterstützende Hintergrundquellen; österreichisches Gewerberecht führt.", [atRef("at-gewerbe-supporting-dir-2005-36"), atRef("at-gewerbe-supporting-dir-2006-123"), atRef("at-gewerbe-does-not-copy-eu-directives"), atRef("at-373a-temporary-cross-border-framework"), atRef("at-373a-dienstleistungsanzeige-authority"), skRef("sk-source-not-german-law"), atRef("at-gewerbe-usp-not-statute"), atRef("at-gewerbe-application-not-approval"), atRef("at-dienstleistungsanzeige-not-a1"), atRef("at-a1-not-dienstleistungsanzeige"), skRef("sk-locale-not-jurisdiction"), atRef("at-gewerbe-does-not-determine-a1")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

function sc(
  id: string,
  label: string,
  coverage: ScenarioCoverage,
  requiredClaimKeys: readonly string[],
  requiredProcessKeys: readonly string[],
): ScenarioSpec {
  return Object.freeze({ id, label, coverage, requiredClaimKeys, requiredProcessKeys });
}

export const AT_SK_GEWERBE_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  sc("s01-sk-regulated-service-to-at", "SK reglementierte Dienstleistung nach AT", "COVERED", ["at-gewerbe-regulated-94-dla-required", "at-373a-dienstleistungsanzeige-authority"], ["at-sk-gewerbe-sk-home-to-at-service"]),
  sc("s02-sk-szco-to-at", "SK SZČO Dienstleistung nach AT", "COVERED", ["sk-szco-individual-other-channels", "at-a1-not-dienstleistungsanzeige"], ["at-sk-gewerbe-sk-szco-home-state"]),
  sc("s03-at-service-to-sk", "AT Dienstleistung in die Slowakei", "COVERED", ["at-373a-temporary-cross-border-framework", "sk-source-not-german-law"], ["at-sk-gewerbe-at-home-to-sk-service"]),
  sc("s04-a1-mistaken-for-dla", "A1 fälschlich als DLA", "COVERED", ["at-dienstleistungsanzeige-not-a1", "at-a1-not-dienstleistungsanzeige"], ["at-sk-gewerbe-a1-dla-separation"]),
  sc("s05-posting-not-dla", "Entsendung ersetzt DLA nicht", "COVERED", ["at-gewerbe-zko-posting-not-dla-handoff", "sk-sp-posting-from-slovakia"], ["at-sk-gewerbe-zko-posting-handoff"]),
  sc("s06-dla-not-tax", "DLA nicht Steuer/PE", "COVERED", ["at-dienstleistungsanzeige-not-tax", "at-gewerbe-temporary-not-pe"], ["at-sk-gewerbe-tax-pe-boundary"]),
  sc("s07-swiss-90-day-rejected", "CH-90-Tage auf EU/EWR abgelehnt", "COVERED", ["at-gewerbe-swiss-90-day-not-eu-ewr"], ["at-sk-gewerbe-swiss-negative-control"]),
  sc("s08-no-arbitrary-threshold", "Keine erfundene Dauerschwelle", "COVERED", ["at-gewerbe-no-arbitrary-duration-thresholds"], ["at-sk-gewerbe-duration-no-threshold"]),
  sc("s09-annual-renewal", "Jährliche DLA-Erneuerung", "COVERED", ["at-dienstleistungsanzeige-annual-renewal"], ["at-sk-gewerbe-annual-renewal"]),
  sc("s10-bmwet-not-gewerbebehoerde", "BMWET nicht örtliche Gewerbebehörde für § 373a", "COVERED", ["at-gewerbebehoerde-not-universal-373a"], ["at-sk-gewerbe-regulated-94-dla"]),
  sc("s11-applicable-legislation-unresolved", "Anwendbares Recht ungelöst", "COVERED", ["at-gewerbe-does-not-determine-a1", "sk-szco-multi-state-application"], ["at-sk-gewerbe-applicable-legislation-delegate"]),
  sc("s12-non-regulated-373a", "Nicht reglementiertes Gewerbe", "COVERED", ["at-gewerbe-non-regulated-373a-scope"], ["at-sk-gewerbe-non-regulated-scope"]),
  sc("s13-application-not-approval", "Anzeige nicht Genehmigung", "COVERED", ["at-gewerbe-application-not-approval", "sk-application-not-entitlement"], ["at-sk-gewerbe-case-classify"]),
  sc("s14-uk-out-of-scope", "UK-Fall", "EXPLICITLY_OUT_OF_SCOPE", ["at-gewerbe-uk-out-of-scope"], ["at-sk-gewerbe-case-classify"]),
  sc("s15-ch-bilateral-out", "Schweiz bilateral", "EXPLICITLY_OUT_OF_SCOPE", ["at-gewerbe-ch-bilateral-not-373a"], ["at-sk-gewerbe-swiss-negative-control"]),
]);

export const AT_SK_GEWERBE_NEGATIVE_CONTROLS = Object.freeze([
  "at-gewerbebehoerde-not-universal-373a",
  "at-bmwet-not-all-gewerbe",
  "at-dienstleistungsanzeige-not-a1",
  "at-a1-not-dienstleistungsanzeige",
  "at-dienstleistungsanzeige-not-tax",
  "at-gewerbe-swiss-90-day-not-eu-ewr",
  "at-gewerbe-no-arbitrary-duration-thresholds",
  "at-gewerbe-temporary-not-pe",
  "at-gewerbe-zko-posting-not-dla-handoff",
  "at-gewerbe-posting-not-automatic-dla",
  "at-gewerbe-permanent-not-373a",
  "at-gewerbe-local-gewerbe-not-373a-route",
  "at-gewerbe-application-not-approval",
  "at-gewerbe-dla-not-entitlement",
  "at-gewerbe-finanzamt-not-dla",
  "at-gewerbe-ams-not-dla",
  "at-gewerbe-svs-not-dla",
  "at-gewerbe-does-not-copy-eu-directives",
  "at-gewerbe-does-not-determine-a1",
  "sk-application-not-entitlement",
  "sk-szco-individual-other-channels",
  "sk-45-day-posting-not-universal",
  "sk-24h-not-guarantee",
  "sk-60-day-hq-not-universal",
  "sk-7-day-not-universal",
  "sk-mpsvr-not-sp",
  "sk-framework-not-third-state",
  "sk-source-not-german-law",
  "sk-locale-not-jurisdiction",
  "sk-citizenship-not-first-institution",
  "sk-employer-not-automatic-sk-law",
  "sk-efiling-employers-not-all-persons",
  "sk-july-2026-announcement-superseded",
  "sk-august-2026-announcement-superseded",
  "at-gewerbe-ch-bilateral-not-373a",
  "at-gewerbe-uk-out-of-scope",
  "at-gewerbe-usp-not-statute",
]);

export function evaluateAtSkGewerbeServiceProcessCompleteness() {
  const processKeys = new Set(AT_SK_GEWERBE_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...AT_SK_GEWERBE_AT_CLAIM_KEYS,
    ...AT_SK_GEWERBE_SK_CLAIM_KEYS,
  ]);
  const incomplete = AT_SK_GEWERBE_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = AT_SK_GEWERBE_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = AT_SK_GEWERBE_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_GEWERBE_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_GEWERBE_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const outOfScopeMissing = outOfScope.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && missingClaims.length === 0
    && uncoveredRequired.length === 0 && outOfScopeMissing.length === 0 && blocked.length === 0;
  return Object.freeze({
    processCount: AT_SK_GEWERBE_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_GEWERBE_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
    outOfScopeMissing,
    copiedEuClaimCount: AT_SK_GEWERBE_COPIED_EU_CLAIM_COUNT,
    negativeControlCount: AT_SK_GEWERBE_NEGATIVE_CONTROLS.length,
  });
}

export type AtSkCrossBorderGewerbeServiceConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: typeof AT_SK_GEWERBE_CONNECTOR_PACK_ID;
  originMarket: "AT";
  connectedCountry: "SK";
  status: typeof AT_SK_GEWERBE_CONNECTOR_STATUS;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: "cross-border-gewerbe-service-dienstleistungsanzeige";
  topicFamily: "TRADE_SERVICE_AUTHORIZATION";
  germanProcessRef: AtOriginGewerbeStableReference;
  germanClaimRefs: readonly AtOriginGewerbeStableReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly ForeignNationalStableReference[];
  foreignProcessReference: typeof SK_AL_PRIMARY_PROCESS_KEY;
  actorRule: Readonly<{
    actorState: "AT_SK_TRADE_SERVICE_AUTHORIZATION";
    userMustAct: true;
    germanAuthorityMustAct: true;
    foreignAuthorityMustAct: true;
    institutionExchangeExpected: false;
  }>;
  requiredCaseRoles: readonly ["WORKER"];
  requiredCaseStates: readonly ["residenceState", "activityState"];
  handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "EVENT_DRIVEN";
  corridorProcesses: readonly CorridorProcessBinding[];
}>;

export function validateAtSkCrossBorderGewerbeServiceConnectorPack(
  pack: AtSkCrossBorderGewerbeServiceConnectorPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.packId !== AT_SK_GEWERBE_CONNECTOR_PACK_ID) issues.push("AT_SK_GEWERBE_PACK_ID_INVALID");
  if (pack.originMarket !== "AT" || pack.connectedCountry !== "SK") issues.push("AT_SK_CORRIDOR_INVALID");
  if (pack.status !== "prepared") issues.push("AT_SK_GEWERBE_CONNECTOR_NOT_PREPARED");
  if ((pack.status as string) === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  if (pack.topicFamily !== "TRADE_SERVICE_AUTHORIZATION") issues.push("UNSUPPORTED_TOPIC_FAMILY");
  if (pack.topicKey !== "cross-border-gewerbe-service-dienstleistungsanzeige") issues.push("AT_SK_GEWERBE_TOPIC_INVALID");
  if (pack.euClaimRefs.length !== 0) issues.push("EU_REFS_MUST_BE_EMPTY");
  if (pack.germanClaimRefs.length === 0) issues.push("MISSING_AT_REFERENCE");
  if (pack.foreignClaimRefs.length === 0) issues.push("MISSING_SK_REFERENCE");
  if (pack.germanProcessRef.sourceJurisdiction !== "AT" || pack.germanProcessRef.trustDomain !== "at") {
    issues.push("AT_PROCESS_JURISDICTION_INVALID");
  }
  for (const ref of pack.germanClaimRefs) {
    if (ref.sourceJurisdiction !== "AT" || ref.trustDomain !== "at") issues.push(`AT_CLAIM_TRUST_INVALID:${ref.key}`);
    if ("id" in (ref as object)) issues.push(`AUTHORING_DATABASE_UUID_FORBIDDEN:${ref.key}`);
  }
  for (const ref of pack.foreignClaimRefs) {
    if (ref.sourceJurisdiction !== "SK" || ref.trustDomain !== "sk") issues.push(`SK_CLAIM_TRUST_INVALID:${ref.key}`);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), productionEligible: false });
}

export function buildAtSkCrossBorderGewerbeServiceConnectorPack(): AtSkCrossBorderGewerbeServiceConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: AT_SK_GEWERBE_CONNECTOR_PACK_ID,
    originMarket: "AT",
    connectedCountry: "SK",
    status: AT_SK_GEWERBE_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "cross-border-gewerbe-service-dienstleistungsanzeige",
    topicFamily: "TRADE_SERVICE_AUTHORIZATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: AT_GEWERBE_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "AT" as const,
      trustDomain: "at" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: AT_SK_GEWERBE_AT_CLAIM_KEYS.map(atRef),
    euClaimRefs: Object.freeze([] as const),
    foreignClaimRefs: AT_SK_GEWERBE_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_AL_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "AT_SK_TRADE_SERVICE_AUTHORIZATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: false,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: AT_SK_GEWERBE_PROCESSES,
  });
}

export function atSkGewerbeServiceConnectorSummary(
  pack: AtSkCrossBorderGewerbeServiceConnectorPack = buildAtSkCrossBorderGewerbeServiceConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    atRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateAtSkGewerbeServiceProcessCompleteness(),
    validation: validateAtSkCrossBorderGewerbeServiceConnectorPack(pack),
  });
}
