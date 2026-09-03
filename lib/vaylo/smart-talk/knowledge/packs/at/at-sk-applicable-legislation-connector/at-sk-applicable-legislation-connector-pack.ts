/**
 * AT-SK-0D AT↔SK applicable-legislation connector.
 * Links Shared EU core, Austrian routing and the existing Slovak adapter.
 * Does not copy Articles 11 / 12 / 13 / 16 into Austrian or corridor law.
 */
import {
  EU_SHARED_ARTICLE_12_CLAIM_KEY,
  EU_SHARED_ONE_LEGISLATION_CLAIM_KEY,
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_AL_PRIMARY_PROCESS_KEY,
  AT_AL_UNITS,
} from "../applicable-legislation-routing/at-applicable-legislation-routing-pack";
import { SK_AL_PRIMARY_PROCESS_KEY, SK_AL_UNITS } from "../../sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
} from "../../../source-registry/cross-border-connector-contracts";

export const AT_SK_CONNECTOR_PACK_ID = "at_sk_applicable_legislation" as const;
export const AT_SK_CONNECTOR_PROCESS_GROUP = "at_sk_applicable_legislation_connector" as const;
export const AT_SK_CONNECTOR_STATUS = "prepared" as const;

export type AtOriginStableReference = Readonly<{
  entityClass: "claims" | "processes";
  key: string;
  sourceJurisdiction: "AT";
  trustDomain: "at";
  temporalClass: "CURRENT";
}>;

function euRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const, temporalClass: "CURRENT" as const,
  });
}
function atRef(key: string): AtOriginStableReference {
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

export const AT_SK_EU_CLAIM_KEYS = Object.freeze([
  EU_SHARED_ONE_LEGISLATION_CLAIM_KEY,
  "art-11-employed-lex-loci-laboris",
  EU_SHARED_ARTICLE_12_CLAIM_KEY,
  "art-12-2-self-employed-posting",
  "art-13-1-multi-state-habitual",
  "art-13-2-self-employed-multi-state",
  "art-13-3-employed-plus-self-employed",
  "substantial-activity-indicator-25",
  "cjeu-c-203-24-hakamp",
  "employed-time-25-satisfies",
  "employed-pay-25-satisfies",
  "employed-both-below-25-not-substantial",
  "twelve-month-prospective",
  "art-16-exception-agreement",
  "art-16-987-notify-residence",
  "provisional-then-definitive",
  "pd-a1-purpose",
  "a1-binding-while-valid",
  "a1-not-immune-from-review",
  "framework-agreement-is-art-16-not-art-13",
  "ss-not-tax-residence",
  "a1-not-work-permit",
  "a1-not-tax-certificate",
  "nationality-not-applicable-legislation",
  "locale-not-jurisdiction",
  "residence-not-automatic-employment-legislation",
  "isolated-trip-not-multi-state",
  "one-employer-branch",
  "several-employers-incl-residence",
  "remote-work-not-posting-automatically",
  "art-16-not-user-entitlement",
  "material-change-re-examine",
  "a1-not-host-labour-exemption",
  "a1-not-ehic",
  "a1-not-s1",
]);

export const AT_SK_AT_CLAIM_KEYS = Object.freeze(AT_AL_UNITS.map((unit) => unit.key));
export const AT_SK_SK_CLAIM_KEYS = Object.freeze(SK_AL_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;
type AnyRef = StableKnowledgeReference | ForeignNationalStableReference | AtOriginStableReference;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly AnyRef[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`AT_SK_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length) as CorridorProcessBinding["claimRefs"],
  });
}

export const AT_SK_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("at-sk-situation-classify", "AT-SK anwendbare Rechtsvorschriften einordnen", "Wohnsitz, Arbeit oder Entsendung berührt Österreich und die Slowakei", "EU-Kern nutzen; Staatsangehörigkeit, Marktpack und bureaucracyCountry nicht als Gesetzgebung wählen.", [euRef(EU_SHARED_ONE_LEGISLATION_CLAIM_KEY), euRef("nationality-not-applicable-legislation"), euRef("pd-a1-purpose"), euRef("locale-not-jurisdiction"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("isolated-trip-not-multi-state"), euRef("material-change-re-examine"), atRef("at-residence-state-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-bureaucracy-not-competence")]),
  binding("at-sk-sk-to-at-employee-posting", "SK nach AT Arbeitnehmerentsendung", "Slowakischer Arbeitgeber entsendet vorübergehend nach Österreich", "Artikel 12 Absatz 1 im EU-Kern belassen und den slowakischen PD-A1-Weg führen.", [euRef(EU_SHARED_ARTICLE_12_CLAIM_KEY), skRef("sk-sp-posting-from-slovakia"), euRef("pd-a1-purpose"), skRef("sk-employer-efiling-effective-2026-09-01"), skRef("sk-application-not-entitlement"), skRef("sk-45-day-posting-not-universal"), skRef("sk-24h-not-guarantee"), skRef("sk-change-reporting"), skRef("sk-sp-posting-from-slovakia"), euRef("a1-not-host-labour-exemption"), atRef("at-a1-not-work-permit-or-dla"), skRef("sk-application-not-entitlement")]),
  binding("at-sk-at-to-sk-employee-posting", "AT nach SK Arbeitnehmerentsendung", "Österreichischer Arbeitgeber entsendet vorübergehend in die Slowakei", "Artikel 12 Absatz 1 im EU-Kern belassen; ÖGK-Kandidat nicht universell setzen.", [euRef(EU_SHARED_ARTICLE_12_CLAIM_KEY), atRef("at-ordinary-employee-oegk-candidate"), euRef("pd-a1-purpose"), atRef("at-e1-employee-posting-form"), atRef("at-elda-is-channel-not-authority"), atRef("at-forms-cache-and-revalidate"), atRef("at-employee-not-always-oegk"), euRef("material-change-re-examine"), atRef("at-unknown-carrier-unresolved"), euRef("a1-not-host-labour-exemption"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-elda-is-channel-not-authority")]),
  binding("at-sk-sk-to-at-self-employed-posting", "SK nach AT SZČO vorübergehende Tätigkeit", "SZČO mit gewöhnlicher Tätigkeit in der Slowakei arbeitet vorübergehend in Österreich", "SZČO-Kanal von der Arbeitgeberpflicht trennen; A1 nicht als Gewerbe werten.", [euRef("art-12-2-self-employed-posting"), skRef("sk-szco-individual-other-channels"), euRef("pd-a1-purpose"), skRef("sk-szco-individual-other-channels"), skRef("sk-application-not-entitlement"), skRef("sk-45-day-posting-not-universal"), skRef("sk-efiling-employers-not-all-persons"), skRef("sk-change-reporting"), skRef("sk-sp-posting-from-slovakia"), euRef("ss-not-tax-residence"), atRef("at-business-authorization-handoff"), skRef("sk-efiling-employers-not-all-persons")]),
  binding("at-sk-at-to-sk-self-employed-posting", "AT nach SK selbständige vorübergehende Tätigkeit", "In Österreich gewöhnlich Selbständige übt vorübergehend ähnliche Tätigkeit in der Slowakei aus", "Artikel 12 Absatz 2 im EU-Kern belassen; SVS nur bei verifizierter Kategorie.", [euRef("art-12-2-self-employed-posting"), atRef("at-svs-self-employed-a1-route"), euRef("pd-a1-purpose"), atRef("at-svs-self-employed-a1-route"), euRef("provisional-then-definitive"), atRef("at-forms-cache-and-revalidate"), atRef("at-svs-not-automatic-from-status"), euRef("material-change-re-examine"), atRef("at-svs-self-employed-a1-route"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-membership-not-merits")]),
  binding("at-sk-sk-resident-employee-multi-state", "Wohnsitz SK Mehrstaatenbeschäftigung AT+SK", "Wohnsitz SK, Beschäftigung in AT und SK", "Sociálna poisťovňa als Wohnstaatstelle; Hakamp bleibt im EU-Kern.", [euRef("art-13-1-multi-state-habitual"), euRef("cjeu-c-203-24-hakamp"), euRef("substantial-activity-indicator-25"), skRef("sk-employee-multi-state-application"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("employed-both-below-25-not-substantial"), euRef("material-change-re-examine"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), skRef("sk-citizenship-not-first-institution")]),
  binding("at-sk-at-resident-employee-multi-state", "Wohnsitz AT Mehrstaatenbeschäftigung AT+SK", "Wohnsitz AT, Beschäftigung in AT und SK", "Österreichische E2/E3-Route nur als Verfahren; Artikel 13 im EU-Kern.", [euRef("art-13-1-multi-state-habitual"), euRef("cjeu-c-203-24-hakamp"), euRef("substantial-activity-indicator-25"), atRef("at-e2-one-employer-form"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), atRef("at-e3-multiple-employers-form"), euRef("material-change-re-examine"), atRef("at-residence-state-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-bureaucracy-not-competence")]),
  binding("at-sk-sk-resident-self-employed-multi-state", "Wohnsitz SK selbständige Mehrstaatentätigkeit AT+SK", "Wohnsitz SK, SZČO in AT und SK", "Sociálna poisťovňa-Wohnstaatweg; Tätigkeit AT nicht als österreichische Gesetzgebung.", [euRef("art-13-2-self-employed-multi-state"), skRef("sk-szco-multi-state-application"), euRef("pd-a1-purpose"), skRef("sk-szco-individual-other-channels"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), atRef("at-activity-not-automatic-legislation"), skRef("sk-change-reporting"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), skRef("sk-citizenship-not-first-institution")]),
  binding("at-sk-at-resident-self-employed-multi-state", "Wohnsitz AT selbständige Mehrstaatentätigkeit AT+SK", "Wohnsitz AT, Selbständigkeit in AT und SK", "EU-Merits zuerst; SVS nur bei verifizierter Kategorie.", [euRef("art-13-2-self-employed-multi-state"), atRef("at-svs-self-employed-a1-route"), euRef("pd-a1-purpose"), atRef("at-svs-not-automatic-from-status"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), atRef("at-svs-not-automatic-from-status"), euRef("material-change-re-examine"), atRef("at-residence-state-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-membership-not-merits")]),
  binding("at-sk-mixed-activity", "Gemischte Beschäftigung und Selbständigkeit AT-SK", "Gleichzeitige Beschäftigung und Selbständigkeit in AT und SK", "Artikel 13 Absatz 3 im EU-Kern; nicht zwei Sozialversicherungssysteme.", [euRef("art-13-3-employed-plus-self-employed"), skRef("sk-mixed-multi-state-application"), euRef("pd-a1-purpose"), atRef("at-e4-mixed-form"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), atRef("at-framework-employee-only"), euRef("material-change-re-examine"), atRef("at-residence-state-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), euRef("nationality-not-applicable-legislation")]),
  binding("at-sk-telework-framework", "AT↔SK Telearbeitsrahmen Artikel 16", "Wohnsitz ein Signatar, Arbeitgeber der andere, Telearbeit 25 bis unter 50 Prozent", "Rahmen ist nicht Artikel 13; Dachverband ist österreichische Anfangsstelle.", [euRef("framework-agreement-is-art-16-not-art-13"), atRef("at-dachverband-framework-route"), atRef("at-framework-employee-only"), atRef("at-telework-at-signatory-current"), atRef("at-framework-processor-not-issuer"), atRef("at-telework-sk-signatory-current"), atRef("at-framework-two-state-only"), euRef("material-change-re-examine"), atRef("at-dachverband-framework-route"), euRef("ss-not-tax-residence"), atRef("at-framework-not-general-art16"), atRef("at-dachverband-not-universal-issuer")]),
  binding("at-sk-general-article16", "Allgemeine Artikel-16-Ausnahme AT-SK", "Rahmenvereinbarung scheitert oder sonstige Ausnahme wird gesucht", "Nicht alle Artikel-16-Wege verneinen; aktuelles Bundesministerium 2026 führen.", [euRef("art-16-exception-agreement"), euRef("art-16-not-user-entitlement"), atRef("at-general-art16-bmasgpk"), atRef("at-framework-not-general-art16"), euRef("provisional-then-definitive"), atRef("at-forms-cache-and-revalidate"), atRef("at-framework-not-general-art16"), euRef("material-change-re-examine"), atRef("at-general-art16-bmasgpk"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), euRef("art-16-not-user-entitlement")]),
  binding("at-sk-activity-change-reevaluation", "Tätigkeitsstaatswechsel und A1-Neuwertung AT-SK", "Bestehende AT-bezogene A1 und neuer DE- oder SK-Sachverhalt", "Alte Urkunde nicht fortschreiben; Timeline und A1-Status erhalten.", [euRef("material-change-re-examine"), atRef("at-old-a1-not-current-proof"), atRef("at-material-change-reevaluation"), atRef("at-a1-evidence-not-source-of-law"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("isolated-trip-not-multi-state"), euRef("a1-not-immune-from-review"), atRef("at-residence-state-institution"), euRef("a1-not-work-permit"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-old-a1-not-current-proof")]),
  binding("at-sk-sk-at-de-multi-state-handoff", "SK+AT+DE als ein EU-Koordinationsfall", "Wohnsitz SK und gleichzeitige oder zeitlich offene Tätigkeit in AT und DE", "Einen EU-Artikel-13-Fall führen; kein AT-DE-Sozialversicherungsabkommen erfinden.", [euRef("art-13-2-self-employed-multi-state"), skRef("sk-residence-makes-sp-residence-institution"), euRef("pd-a1-purpose"), skRef("sk-szco-multi-state-application"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), atRef("at-framework-two-state-only"), euRef("material-change-re-examine"), skRef("sk-non-residence-not-first-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-bureaucracy-not-competence")]),
  binding("at-sk-a1-vs-business-authorization", "A1 gegen österreichische Gewerbegrenze", "Person hält A1 für Dienstleistungsanzeige oder Gewerbe", "BUSINESS_AUTHORIZATION_REVIEW_REQUIRED; Gewerbemerits nicht in diesem Pack entscheiden.", [atRef("at-business-authorization-handoff"), atRef("at-a1-not-work-permit-or-dla"), euRef("a1-not-work-permit"), euRef("a1-not-host-labour-exemption"), euRef("a1-not-ehic"), euRef("a1-not-s1"), euRef("ss-not-tax-residence"), atRef("at-health-family-unemp-tax-handoff"), atRef("at-client-not-a1-issuer"), euRef("a1-not-tax-certificate"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-a1-not-work-permit-or-dla")]),
  binding("at-sk-residence-state-institution", "Wohnstaatliche Bestimmung AT-SK", "Gewöhnliche Mehrstaatenarbeit, Bestimmung noch offen", "Wohnsitz SK zur Sociálna poisťovňa; bureaucracyCountry AT nicht als Kompetenz.", [euRef("art-16-987-notify-residence"), skRef("sk-residence-makes-sp-residence-institution"), atRef("at-residence-state-institution"), skRef("sk-non-residence-not-first-institution"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), skRef("sk-citizenship-not-first-institution"), euRef("material-change-re-examine"), atRef("at-bureaucracy-not-competence"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-application-not-austrian-outcome")]),
  binding("at-sk-sequential-at-de-szco", "SK-SZČO AT dann DE ohne Autoklassifikation", "Wohnsitz SK, Selbständigkeit AT Januar–Juli, danach DE August–Dezember", "Weder Artikel 12 noch Artikel 13 automatisch; Timeline und Neuwertung erhalten.", [euRef("isolated-trip-not-multi-state"), atRef("at-material-change-reevaluation"), euRef("art-12-2-self-employed-posting"), euRef("art-13-2-self-employed-multi-state"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("remote-work-not-posting-automatically"), atRef("at-old-a1-not-current-proof"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), atRef("at-routing-does-not-copy-eu-law"), atRef("at-bureaucracy-not-competence")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const AT_SK_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "sk-employee-posted-at", label: "SK-Arbeitnehmer vorübergehend nach AT entsandt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "sk-sp-posting-from-slovakia"], requiredProcessKeys: ["at-sk-sk-to-at-employee-posting"] },
  { id: "at-employee-posted-sk", label: "AT-Arbeitnehmer vorübergehend nach SK entsandt", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "at-ordinary-employee-oegk-candidate"], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "sk-szco-temp-at", label: "SK SZČO vorübergehend ähnliche Tätigkeit AT", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "sk-szco-individual-other-channels"], requiredProcessKeys: ["at-sk-sk-to-at-self-employed-posting"] },
  { id: "at-self-employed-temp-sk", label: "AT selbständig vorübergehend ähnliche Tätigkeit SK", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "at-svs-self-employed-a1-route"], requiredProcessKeys: ["at-sk-at-to-sk-self-employed-posting"] },
  { id: "posting-within-art12", label: "Entsendung innerhalb der gewöhnlichen Artikel-12-Grenze", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "posting-exceeds-art12", label: "Entsendung überschreitet die gewöhnliche Artikel-12-Grenze", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "art-16-exception-agreement"], requiredProcessKeys: ["at-sk-general-article16"] },
  { id: "employee-replacement-problem", label: "Arbeitnehmer-Ersetzungsproblem", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY], requiredProcessKeys: ["at-sk-sk-to-at-employee-posting"] },
  { id: "self-employed-sending-facts-missing", label: "Selbständige Versandstaatstätigkeit fehlt", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "sk-application-not-entitlement"], requiredProcessKeys: ["at-sk-sk-to-at-self-employed-posting"] },
  { id: "self-employed-similarity-missing", label: "Ähnlichkeits Tatsachen fehlen", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting"], requiredProcessKeys: ["at-sk-at-to-sk-self-employed-posting"] },
  { id: "a1-requested-posting-merits-fail", label: "A1 verlangt, Entsendungsmerits scheitern", coverage: "COVERED", requiredClaimKeys: ["sk-application-not-entitlement", "at-a1-evidence-not-source-of-law"], requiredProcessKeys: ["at-sk-sk-to-at-employee-posting"] },
  { id: "a1-requested-after-change", label: "A1 nach bereits geänderter Tätigkeit", coverage: "COVERED", requiredClaimKeys: ["material-change-re-examine", "at-old-a1-not-current-proof"], requiredProcessKeys: ["at-sk-activity-change-reevaluation"] },
  { id: "a1-assumed-work-authorization", label: "A1 als Arbeitserlaubnis angenommen", coverage: "COVERED", requiredClaimKeys: ["a1-not-work-permit", "at-a1-not-work-permit-or-dla"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "sk-res-at-employer-at-sk-work", label: "Wohnsitz SK, Arbeitgeber AT, Arbeit AT+SK", coverage: "COVERED", requiredClaimKeys: ["art-13-1-multi-state-habitual", "sk-residence-makes-sp-residence-institution"], requiredProcessKeys: ["at-sk-sk-resident-employee-multi-state"] },
  { id: "at-res-sk-employer-at-sk-work", label: "Wohnsitz AT, Arbeitgeber SK, Arbeit AT+SK", coverage: "COVERED", requiredClaimKeys: ["art-13-1-multi-state-habitual", "at-residence-state-institution"], requiredProcessKeys: ["at-sk-at-resident-employee-multi-state"] },
  { id: "one-employer-multi-state", label: "Ein Arbeitgeber, mehrere Staaten", coverage: "COVERED", requiredClaimKeys: ["one-employer-branch", "at-e2-one-employer-form"], requiredProcessKeys: ["at-sk-at-resident-employee-multi-state"] },
  { id: "multiple-employers-multi-state", label: "Mehrere Arbeitgeber, mehrere Staaten", coverage: "COVERED", requiredClaimKeys: ["several-employers-incl-residence", "at-e3-multiple-employers-form"], requiredProcessKeys: ["at-sk-at-resident-employee-multi-state"] },
  { id: "residence-missing", label: "Wohnsitz fehlt", coverage: "COVERED", requiredClaimKeys: ["art-16-987-notify-residence"], requiredProcessKeys: ["at-sk-residence-state-institution"] },
  { id: "work-distribution-missing", label: "Arbeitsverteilung fehlt", coverage: "COVERED", requiredClaimKeys: ["twelve-month-prospective", "substantial-activity-indicator-25"], requiredProcessKeys: ["at-sk-sk-resident-employee-multi-state"] },
  { id: "employer-country-used-as-applicable", label: "Arbeitgeberstaat unrichtig als Anwendungsstaat", coverage: "COVERED", requiredClaimKeys: ["sk-employer-not-automatic-sk-law", "at-activity-not-automatic-legislation"], requiredProcessKeys: ["at-sk-situation-classify"] },
  { id: "bureaucracy-at-used-as-applicable", label: "bureaucracyCountry AT unrichtig als Anwendungsstaat", coverage: "COVERED", requiredClaimKeys: ["at-bureaucracy-not-competence"], requiredProcessKeys: ["at-sk-situation-classify"] },
  { id: "sk-res-self-employed-sk-at", label: "Wohnsitz SK, selbständig SK+AT", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state", "sk-szco-multi-state-application"], requiredProcessKeys: ["at-sk-sk-resident-self-employed-multi-state"] },
  { id: "at-res-self-employed-at-sk", label: "Wohnsitz AT, selbständig AT+SK", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state", "at-svs-self-employed-a1-route"], requiredProcessKeys: ["at-sk-at-resident-self-employed-multi-state"] },
  { id: "sk-res-self-employed-at-de", label: "Wohnsitz SK, selbständig AT+DE", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state", "sk-residence-makes-sp-residence-institution"], requiredProcessKeys: ["at-sk-sk-at-de-multi-state-handoff"] },
  { id: "sk-res-self-employed-sk-at-de", label: "Wohnsitz SK, selbständig SK+AT+DE", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state", "at-framework-two-state-only"], requiredProcessKeys: ["at-sk-sk-at-de-multi-state-handoff"] },
  { id: "simultaneous-at-de-self-employed", label: "Gleichzeitige AT+DE-Selbständigkeit", coverage: "COVERED", requiredClaimKeys: ["art-13-2-self-employed-multi-state"], requiredProcessKeys: ["at-sk-sk-at-de-multi-state-handoff"] },
  { id: "at-activity-assumed-at-law", label: "AT-Tätigkeit allein als AT-Gesetzgebung", coverage: "COVERED", requiredClaimKeys: ["at-activity-not-automatic-legislation"], requiredProcessKeys: ["at-sk-sk-resident-self-employed-multi-state"] },
  { id: "svs-membership-as-merits", label: "SVS-Mitgliedschaft als Merits", coverage: "COVERED", requiredClaimKeys: ["at-membership-not-merits"], requiredProcessKeys: ["at-sk-at-resident-self-employed-multi-state"] },
  { id: "sp-membership-as-merits", label: "Sociálna-poisťovňa-Mitgliedschaft als Merits", coverage: "COVERED", requiredClaimKeys: ["sk-application-not-entitlement", "sk-citizenship-not-first-institution"], requiredProcessKeys: ["at-sk-residence-state-institution"] },
  { id: "employed-at-self-employed-sk", label: "Beschäftigt AT + selbständig SK", coverage: "COVERED", requiredClaimKeys: ["art-13-3-employed-plus-self-employed"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "employed-sk-self-employed-at", label: "Beschäftigt SK + selbständig AT", coverage: "COVERED", requiredClaimKeys: ["art-13-3-employed-plus-self-employed", "at-e4-mixed-form"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "employed-de-self-employed-at-res-sk", label: "Beschäftigt DE + selbständig AT, Wohnsitz SK", coverage: "COVERED", requiredClaimKeys: ["art-13-3-employed-plus-self-employed", "sk-residence-makes-sp-residence-institution"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "mixed-forced-into-telework", label: "Gemischte Tätigkeit unrichtig in den Telearbeitsrahmen", coverage: "COVERED", requiredClaimKeys: ["at-framework-employee-only"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "mixed-as-two-systems", label: "Gemischte Tätigkeit als zwei Systeme", coverage: "COVERED", requiredClaimKeys: ["art-13-3-employed-plus-self-employed"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "telework-24-9", label: "SK-Wohnsitz, AT-Arbeitgeber, 24,9% Telearbeit SK", coverage: "COVERED", requiredClaimKeys: ["framework-agreement-is-art-16-not-art-13", "at-framework-not-general-art16"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-25", label: "dieselbe Lage, genau 25%", coverage: "COVERED", requiredClaimKeys: ["at-dachverband-framework-route"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-49-9", label: "dieselbe Lage, 49,9%", coverage: "COVERED", requiredClaimKeys: ["at-telework-at-signatory-current"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-50", label: "dieselbe Lage, genau 50%", coverage: "COVERED", requiredClaimKeys: ["at-framework-not-general-art16", "art-16-exception-agreement"], requiredProcessKeys: ["at-sk-general-article16"] },
  { id: "telework-at-res-sk-employer", label: "AT-Wohnsitz, SK-Arbeitgeber, qualifizierte Telearbeit", coverage: "COVERED", requiredClaimKeys: ["at-telework-sk-signatory-current", "sk-mpsvr-framework-exception-authority"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-self-employed-30", label: "Selbständig mit 30% Heimarbeit", coverage: "COVERED", requiredClaimKeys: ["at-framework-employee-only", "sk-framework-not-self-employed"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-mixed-30", label: "Gemischt beschäftigt/selbständig mit 30% Telearbeit", coverage: "COVERED", requiredClaimKeys: ["at-framework-employee-only"], requiredProcessKeys: ["at-sk-mixed-activity"] },
  { id: "telework-both-signatories", label: "AT und SK beide Signatare", coverage: "COVERED", requiredClaimKeys: ["at-telework-at-signatory-current", "at-telework-sk-signatory-current"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-third-nonsignatory", label: "Dritter Nicht-Signatar hinzugefügt", coverage: "COVERED", requiredClaimKeys: ["at-framework-two-state-only", "sk-framework-not-third-state"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "telework-three-state", label: "Drei-Staaten AT+SK+DE Telearbeit", coverage: "COVERED", requiredClaimKeys: ["at-framework-two-state-only"], requiredProcessKeys: ["at-sk-sk-at-de-multi-state-handoff"] },
  { id: "dachverband-as-universal-issuer", label: "Dachverband unrichtig als universeller A1-Träger", coverage: "COVERED", requiredClaimKeys: ["at-dachverband-not-universal-issuer"], requiredProcessKeys: ["at-sk-telework-framework"] },
  { id: "framework-fail-general-art16-remains", label: "Rahmen scheitert, allgemeine Artikel-16-Prüfung bleibt", coverage: "COVERED", requiredClaimKeys: ["at-framework-not-general-art16", "art-16-exception-agreement"], requiredProcessKeys: ["at-sk-general-article16"] },
  { id: "ordinary-employee-oegk", label: "Ordentliche österreichische Arbeitnehmerkategorie → ÖGK", coverage: "COVERED", requiredClaimKeys: ["at-ordinary-employee-oegk-candidate"], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "bvaeb-special-route", label: "BVAEB-Gruppe → BVAEB-Weg", coverage: "COVERED", requiredClaimKeys: ["at-bvaeb-special-employee-route"], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "unknown-carrier-fail-closed", label: "Unbekannter österreichischer Träger fail-closed", coverage: "COVERED", requiredClaimKeys: ["at-unknown-carrier-unresolved"], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "svs-covered-self-employed", label: "AT-Selbständige von SVS erfasst → SVS-Weg", coverage: "COVERED", requiredClaimKeys: ["at-svs-self-employed-a1-route"], requiredProcessKeys: ["at-sk-at-to-sk-self-employed-posting"] },
  { id: "at-application-foreign-legislation", label: "AT-Antrag, ausländische Gesetzgebung bestimmt", coverage: "COVERED", requiredClaimKeys: ["at-application-not-austrian-outcome", "at-foreign-result-foreign-issuer"], requiredProcessKeys: ["at-sk-residence-state-institution"] },
  { id: "foreign-carrier-issues-a1", label: "Ausländischer Träger muss A1 nach Fremdrecht ausstellen", coverage: "COVERED", requiredClaimKeys: ["at-foreign-result-foreign-issuer"], requiredProcessKeys: ["at-sk-residence-state-institution"] },
  { id: "elda-treated-as-authority", label: "ELDA unrichtig als Behörde", coverage: "COVERED", requiredClaimKeys: ["at-elda-is-channel-not-authority"], requiredProcessKeys: ["at-sk-at-to-sk-employee-posting"] },
  { id: "a1-treated-as-s1", label: "A1 unrichtig als S1", coverage: "COVERED", requiredClaimKeys: ["a1-not-s1", "at-health-family-unemp-tax-handoff"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "a1-treated-as-dla", label: "A1 unrichtig als Dienstleistungsanzeige", coverage: "COVERED", requiredClaimKeys: ["at-a1-not-work-permit-or-dla"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "sk-szco-at-then-de", label: "SK SZČO AT Jan–Jul → DE Aug–Dec", coverage: "COVERED", requiredClaimKeys: ["isolated-trip-not-multi-state", "at-material-change-reevaluation"], requiredProcessKeys: ["at-sk-sequential-at-de-szco"] },
  { id: "sequence-not-auto-art13", label: "dieselbe Folge nicht automatisch Artikel 13", coverage: "COVERED", requiredClaimKeys: ["isolated-trip-not-multi-state", "art-13-2-self-employed-multi-state"], requiredProcessKeys: ["at-sk-sequential-at-de-szco"] },
  { id: "sequence-not-auto-two-art12", label: "dieselbe Folge nicht automatisch zwei Artikel-12-Entsendungen", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "isolated-trip-not-multi-state"], requiredProcessKeys: ["at-sk-sequential-at-de-szco"] },
  { id: "old-at-a1-into-de-without-reassessment", label: "alte AT-A1 ohne Neuwertung nach DE", coverage: "COVERED", requiredClaimKeys: ["at-old-a1-not-current-proof"], requiredProcessKeys: ["at-sk-activity-change-reevaluation"] },
  { id: "selector-switch-preserves-history", label: "AT→DE-Selektor erhält Historie und löst Neuwertung aus", coverage: "COVERED", requiredClaimKeys: ["at-material-change-reevaluation", "at-bureaucracy-not-competence"], requiredProcessKeys: ["at-sk-activity-change-reevaluation"] },
  { id: "s1-ehic-s2-out-of-scope", label: "S1/EHIC/S2 Merits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["a1-not-s1", "a1-not-ehic"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "family-art68-out-of-scope", label: "Familienartikel 68 Merits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-family-unemp-tax-handoff"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "unemployment-art65-out-of-scope", label: "Arbeitslosenartikel 65 Merits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-health-family-unemp-tax-handoff"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "tax-residence-treaty-out-of-scope", label: "Steueransässigkeit und AT-SK-DBA", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["ss-not-tax-residence", "a1-not-tax-certificate"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
  { id: "full-gewerbe-out-of-scope", label: "Vollständige österreichische Gewerbemerits", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["at-business-authorization-handoff"], requiredProcessKeys: ["at-sk-a1-vs-business-authorization"] },
]);

export const AT_SK_NEGATIVE_CONTROLS = Object.freeze([
  "a1-not-work-permit",
  "at-a1-not-work-permit-or-dla",
  "a1-not-s1",
  "ss-not-tax-residence",
  "at-health-family-unemp-tax-handoff",
  "at-a1-evidence-not-source-of-law",
  "at-activity-not-automatic-legislation",
  "nationality-not-applicable-legislation",
  "at-bureaucracy-not-competence",
  "at-client-not-a1-issuer",
  "at-membership-not-merits",
  "at-employee-not-always-oegk",
  "at-svs-not-automatic-from-status",
  "at-elda-is-channel-not-authority",
  "at-application-not-austrian-outcome",
  "at-old-a1-not-current-proof",
  "at-framework-employee-only",
  "at-framework-two-state-only",
  "at-dachverband-not-universal-issuer",
  "isolated-trip-not-multi-state",
]);

export function evaluateAtSkProcessCompleteness() {
  const processKeys = new Set(AT_SK_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...AT_SK_EU_CLAIM_KEYS,
    ...AT_SK_AT_CLAIM_KEYS,
    ...AT_SK_SK_CLAIM_KEYS,
  ]);
  const incomplete = AT_SK_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = AT_SK_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = AT_SK_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = AT_SK_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = AT_SK_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && missingClaims.length === 0 && uncoveredRequired.length === 0;
  return Object.freeze({
    processCount: AT_SK_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: AT_SK_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
  });
}

export type AtSkApplicableLegislationConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: typeof AT_SK_CONNECTOR_PACK_ID;
  originMarket: "AT";
  connectedCountry: "SK";
  status: typeof AT_SK_CONNECTOR_STATUS;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: "applicable-legislation-posting-a1";
  topicFamily: "SOCIAL_SECURITY_COORDINATION";
  germanProcessRef: AtOriginStableReference;
  germanClaimRefs: readonly AtOriginStableReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly ForeignNationalStableReference[];
  foreignProcessReference: typeof SK_AL_PRIMARY_PROCESS_KEY;
  actorRule: Readonly<{
    actorState: "AT_SK_APPLICABLE_LEGISLATION";
    userMustAct: true;
    germanAuthorityMustAct: true;
    foreignAuthorityMustAct: true;
    institutionExchangeExpected: true;
  }>;
  requiredCaseRoles: readonly ["WORKER"];
  requiredCaseStates: readonly ["residenceState", "employmentState", "activityState"];
  handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "EVENT_DRIVEN";
  corridorProcesses: readonly CorridorProcessBinding[];
}>;

export function validateAtSkApplicableLegislationConnectorPack(
  pack: AtSkApplicableLegislationConnectorPack,
): Readonly<{ valid: boolean; issues: readonly string[]; productionEligible: false }> {
  const issues: string[] = [];
  if (pack.packId !== AT_SK_CONNECTOR_PACK_ID) issues.push("AT_SK_PACK_ID_INVALID");
  if (pack.originMarket !== "AT" || pack.connectedCountry !== "SK") issues.push("AT_SK_CORRIDOR_INVALID");
  if (pack.status !== "prepared") issues.push("AT_SK_CONNECTOR_NOT_PREPARED");
  if ((pack.status as string) === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  if (pack.topicFamily !== "SOCIAL_SECURITY_COORDINATION") issues.push("UNSUPPORTED_TOPIC_FAMILY");
  if (pack.euClaimRefs.length === 0) issues.push("MISSING_EU_REFERENCE");
  if (pack.germanClaimRefs.length === 0) issues.push("MISSING_AT_REFERENCE");
  if (pack.foreignClaimRefs.length === 0) issues.push("MISSING_SK_REFERENCE");
  if (pack.germanProcessRef.sourceJurisdiction !== "AT" || pack.germanProcessRef.trustDomain !== "at") {
    issues.push("AT_PROCESS_JURISDICTION_INVALID");
  }
  for (const ref of pack.germanClaimRefs) {
    if (ref.sourceJurisdiction !== "AT" || ref.trustDomain !== "at") issues.push(`AT_CLAIM_TRUST_INVALID:${ref.key}`);
    if ("id" in (ref as object)) issues.push(`AUTHORING_DATABASE_UUID_FORBIDDEN:${ref.key}`);
  }
  for (const ref of pack.euClaimRefs) {
    if (ref.sourceJurisdiction !== "EU" || ref.trustDomain !== "eu") issues.push(`EU_CLAIM_TRUST_INVALID:${ref.key}`);
  }
  for (const ref of pack.foreignClaimRefs) {
    if (ref.sourceJurisdiction !== "SK" || ref.trustDomain !== "sk") issues.push(`SK_CLAIM_TRUST_INVALID:${ref.key}`);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function buildAtSkApplicableLegislationConnectorPack(): AtSkApplicableLegislationConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: AT_SK_CONNECTOR_PACK_ID,
    originMarket: "AT",
    connectedCountry: "SK",
    status: AT_SK_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "applicable-legislation-posting-a1",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: AT_AL_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "AT" as const,
      trustDomain: "at" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: AT_SK_AT_CLAIM_KEYS.map(atRef),
    euClaimRefs: AT_SK_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: AT_SK_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_AL_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "AT_SK_APPLICABLE_LEGISLATION" as const,
      userMustAct: true as const,
      germanAuthorityMustAct: true as const,
      foreignAuthorityMustAct: true as const,
      institutionExchangeExpected: true as const,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "employmentState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: AT_SK_PROCESSES,
  });
}
