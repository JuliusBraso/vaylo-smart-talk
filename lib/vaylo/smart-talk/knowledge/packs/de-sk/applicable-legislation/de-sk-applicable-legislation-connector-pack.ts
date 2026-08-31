/**
 * CB-0D DE↔SK applicable-legislation connector.
 * Links EU shared core, German routing and Slovak adapter. Does not copy EU law.
 */
import {
  EU_SHARED_ARTICLE_12_CLAIM_KEY,
  EU_SHARED_ONE_LEGISLATION_CLAIM_KEY,
  PROCESS_COMPLETE_DIMENSIONS,
  type ScenarioCoverage,
} from "../../eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { DE_AL_PRIMARY_PROCESS_KEY, DE_AL_UNITS } from "../../de/applicable-legislation-routing/de-applicable-legislation-routing-pack";
import { SK_AL_PRIMARY_PROCESS_KEY, SK_AL_UNITS } from "../../sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import {
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  type CorridorProcessBinding,
  type CuratedCrossBorderConnectorPack,
  type ForeignNationalStableReference,
  type StableKnowledgeReference,
  validateCuratedCrossBorderConnectorPack,
} from "../../../source-registry/cross-border-connector-contracts";

export const DE_SK_CONNECTOR_PACK_ID = "de_sk_applicable_legislation" as const;
export const DE_SK_CONNECTOR_STATUS = "prepared" as const;

function euRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "EU" as const,
    trustDomain: "eu" as const, temporalClass: "CURRENT" as const,
  });
}
function deRef(key: string): StableKnowledgeReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "DE" as const,
    trustDomain: "de" as const, temporalClass: "CURRENT" as const,
  });
}
function skRef(key: string): ForeignNationalStableReference {
  return Object.freeze({
    entityClass: "claims" as const, key, sourceJurisdiction: "SK" as const,
    trustDomain: "sk" as const, temporalClass: "CURRENT" as const,
  });
}

export const DE_SK_EU_CLAIM_KEYS = Object.freeze([
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

export const DE_SK_DE_CLAIM_KEYS = Object.freeze(DE_AL_UNITS.map((unit) => unit.key));
export const DE_SK_SK_CLAIM_KEYS = Object.freeze(SK_AL_UNITS.map((unit) => unit.key));

const DIM = PROCESS_COMPLETE_DIMENSIONS;

function binding(
  key: string,
  title: string,
  trigger: string,
  safeFirstStep: string,
  refs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[],
): CorridorProcessBinding {
  if (refs.length < DIM.length) {
    throw new Error(`DE_SK_PROCESS_INCOMPLETE:${key}:${refs.length}`);
  }
  return Object.freeze({
    key, title, trigger, safeFirstStep, riskLevel: "high" as const,
    claimRefs: refs.slice(0, DIM.length),
  });
}

export const DE_SK_PROCESSES: readonly CorridorProcessBinding[] = Object.freeze([
  binding("de-sk-situation-classify", "DE-SK anwendbare Rechtsvorschriften einordnen", "Wohnsitz, Arbeit oder Entsendung berührt Deutschland und die Slowakei", "EU-Kern nutzen und Staatsangehörigkeit nicht als Korridor wählen.", [euRef(EU_SHARED_ONE_LEGISLATION_CLAIM_KEY), euRef("nationality-not-applicable-legislation"), euRef("pd-a1-purpose"), euRef("locale-not-jurisdiction"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("isolated-trip-not-multi-state"), euRef("material-change-re-examine"), deRef("de-dvka-residence-multi-state"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("locale-not-jurisdiction")]),
  binding("de-sk-residence-state-determine", "Wohnsitzstaat DE oder SK bestimmen", "Wohnsitz ist unklar oder wird mit Staatsangehörigkeit verwechselt", "Ohne geklärten Wohnsitz fail-closed bleiben.", [euRef("art-16-987-notify-residence"), euRef("nationality-not-applicable-legislation"), euRef("pd-a1-purpose"), skRef("sk-citizenship-not-first-institution"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("locale-not-jurisdiction"), euRef("material-change-re-examine"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-krankenkasse-not-art13-first")]),
  binding("de-sk-single-state-de-work", "Nur Deutschland arbeiten, Wohnsitz Slowakei", "Wohnsitz SK und ausschließliche Beschäftigung DE", "Lex loci laboris aus dem EU-Kern anwenden; das ist nicht Artikel 13.", [euRef("art-11-employed-lex-loci-laboris"), euRef("residence-not-automatic-employment-legislation"), euRef("pd-a1-purpose"), deRef("de-single-state-work-may-need-a1-proof"), euRef("provisional-then-definitive"), deRef("de-electronic-sv-meldeportal"), euRef("isolated-trip-not-multi-state"), euRef("material-change-re-examine"), deRef("de-issuer-unknown-without-category"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("isolated-trip-not-multi-state")]),
  binding("de-sk-single-state-sk-work", "Nur Slowakei arbeiten, Wohnsitz Deutschland", "Wohnsitz DE und ausschließliche Tätigkeit SK", "Slowakische Rechtsvorschriften nach Lex loci laboris; A1 kann Nachweis sein.", [euRef("art-11-employed-lex-loci-laboris"), euRef("residence-not-automatic-employment-legislation"), euRef("pd-a1-purpose"), skRef("sk-ordinary-sk-activity-may-need-a1"), euRef("provisional-then-definitive"), skRef("sk-45-day-posting-not-universal"), euRef("isolated-trip-not-multi-state"), skRef("sk-change-reporting"), skRef("sk-sp-posting-from-slovakia"), euRef("ss-not-tax-residence"), skRef("sk-source-not-german-law"), euRef("isolated-trip-not-multi-state")]),
  binding("de-sk-de-to-sk-employee-posting", "DE nach SK Arbeitnehmerentsendung", "Deutscher Arbeitgeber entsendet vorübergehend in die Slowakei", "Artikel 12 Absatz 1 im EU-Kern belassen und nur den deutschen Ausstellerweg führen.", [euRef(EU_SHARED_ARTICLE_12_CLAIM_KEY), deRef("de-posting-issuer-krankenkasse"), euRef("pd-a1-purpose"), deRef("de-electronic-sv-meldeportal"), deRef("de-posting-issuer-drv"), deRef("de-electronic-sv-meldeportal"), deRef("de-dvka-not-ordinary-posting-issuer"), euRef("material-change-re-examine"), deRef("de-issuer-unknown-without-category"), euRef("a1-not-host-labour-exemption"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-dvka-not-ordinary-posting-issuer")]),
  binding("de-sk-sk-to-de-employee-posting", "SK nach DE Arbeitnehmerentsendung", "Slowakischer Arbeitgeber entsendet vorübergehend nach Deutschland", "Artikel 12 Absatz 1 im EU-Kern belassen und das slowakische PD-A1-Verfahren führen.", [euRef(EU_SHARED_ARTICLE_12_CLAIM_KEY), skRef("sk-sp-posting-from-slovakia"), euRef("pd-a1-purpose"), skRef("sk-employer-efiling-effective-2026-09-01"), skRef("sk-application-not-entitlement"), skRef("sk-45-day-posting-not-universal"), skRef("sk-24h-not-guarantee"), skRef("sk-change-reporting"), skRef("sk-sp-posting-from-slovakia"), euRef("a1-not-host-labour-exemption"), skRef("sk-source-not-german-law"), skRef("sk-application-not-entitlement")]),
  binding("de-sk-de-to-sk-self-employed", "DE nach SK selbständige vorübergehende Tätigkeit", "In Deutschland gewöhnlich Selbständige übt vorübergehend ähnliche Tätigkeit in der Slowakei aus", "Artikel 12 Absatz 2 im EU-Kern belassen.", [euRef("art-12-2-self-employed-posting"), deRef("de-issuer-unknown-without-category"), euRef("pd-a1-purpose"), deRef("de-electronic-sv-meldeportal"), euRef("provisional-then-definitive"), deRef("de-electronic-sv-meldeportal"), euRef("remote-work-not-posting-automatically"), euRef("material-change-re-examine"), deRef("de-art16-not-art12-issuer"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("remote-work-not-posting-automatically")]),
  binding("de-sk-sk-to-de-self-employed", "SK nach DE SZČO vorübergehende Tätigkeit", "SZČO mit gewöhnlicher Tätigkeit in der Slowakei arbeitet vorübergehend in Deutschland", "SZČO-Kanal von der Arbeitgeberpflicht trennen.", [euRef("art-12-2-self-employed-posting"), skRef("sk-szco-individual-other-channels"), euRef("pd-a1-purpose"), skRef("sk-szco-individual-other-channels"), skRef("sk-application-not-entitlement"), skRef("sk-45-day-posting-not-universal"), skRef("sk-efiling-employers-not-all-persons"), skRef("sk-change-reporting"), skRef("sk-sp-posting-from-slovakia"), euRef("ss-not-tax-residence"), skRef("sk-source-not-german-law"), skRef("sk-efiling-employers-not-all-persons")]),
  binding("de-sk-sk-resident-multi-state-employee", "Wohnsitz SK Mehrstaatenbeschäftigung DE+SK", "Wohnsitz SK, Beschäftigung in DE und SK", "Sociálna poisťovňa als Wohnstaatstelle; Hakamp 25 Prozent aus dem EU-Kern verknüpfen.", [euRef("art-13-1-multi-state-habitual"), euRef("cjeu-c-203-24-hakamp"), euRef("substantial-activity-indicator-25"), skRef("sk-employee-multi-state-application"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("employed-both-below-25-not-substantial"), euRef("material-change-re-examine"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), skRef("sk-citizenship-not-first-institution")]),
  binding("de-sk-de-resident-multi-state-employee", "Wohnsitz DE Mehrstaatenbeschäftigung DE+SK", "Wohnsitz DE, Beschäftigung in DE und SK", "DVKA als Wohnstaatstelle; Krankenkasse nicht als erste Bestimmungsstelle.", [euRef("art-13-1-multi-state-habitual"), euRef("cjeu-c-203-24-hakamp"), euRef("substantial-activity-indicator-25"), deRef("de-dvka-residence-multi-state"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), deRef("de-krankenkasse-not-art13-first"), euRef("material-change-re-examine"), deRef("de-dvka-residence-multi-state"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-employer-not-why-dvka")]),
  binding("de-sk-sk-resident-self-employed-multi", "Wohnsitz SK selbständige Mehrstaatentätigkeit", "Wohnsitz SK, SZČO in DE und SK", "SZČO-Antragstype; Hakamp-Beschäftigtenformel nicht automatisch übertragen.", [euRef("art-13-2-self-employed-multi-state"), skRef("sk-szco-multi-state-application"), euRef("pd-a1-purpose"), skRef("sk-szco-individual-other-channels"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), skRef("sk-employer-not-automatic-sk-law"), skRef("sk-change-reporting"), skRef("sk-residence-makes-sp-residence-institution"), euRef("ss-not-tax-residence"), skRef("sk-source-not-german-law"), skRef("sk-citizenship-not-first-institution")]),
  binding("de-sk-de-resident-self-employed-multi", "Wohnsitz DE selbständige Mehrstaatentätigkeit", "Wohnsitz DE, Selbständigkeit in DE und SK", "DVKA-Wohnstaatweg; Selbständigen-Test bleibt im EU-Kern.", [euRef("art-13-2-self-employed-multi-state"), deRef("de-dvka-residence-multi-state"), euRef("pd-a1-purpose"), deRef("de-electronic-sv-meldeportal"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), deRef("de-krankenkasse-not-art13-first"), euRef("material-change-re-examine"), deRef("de-dvka-residence-multi-state"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-employer-not-why-dvka")]),
  binding("de-sk-employed-plus-self-employed", "Beschäftigung plus Selbständigkeit DE-SK", "Gleichzeitige Beschäftigung und Selbständigkeit in DE und SK", "Artikel 13 Absatz 3 im EU-Kern; gemischte slowakische Antragstype nur bei Wohnsitz SK.", [euRef("art-13-3-employed-plus-self-employed"), skRef("sk-mixed-multi-state-application"), euRef("pd-a1-purpose"), euRef("art-16-987-notify-residence"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), skRef("sk-employer-not-automatic-sk-law"), euRef("material-change-re-examine"), deRef("de-dvka-residence-multi-state"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("nationality-not-applicable-legislation")]),
  binding("de-sk-german-a1-issuer-select", "Deutsche A1-Ausstellerin im DE-SK-Korridor wählen", "Deutsche Entsendung oder Nachweis-A1, Versicherungskategorie offen", "Krankenkasse, DRV und ABV unterscheiden.", [deRef("de-posting-issuer-krankenkasse"), deRef("de-posting-issuer-drv"), deRef("de-posting-issuer-abv"), deRef("de-issuer-unknown-without-category"), deRef("de-electronic-sv-meldeportal"), deRef("de-electronic-sv-meldeportal"), deRef("de-dvka-not-ordinary-posting-issuer"), euRef("material-change-re-examine"), deRef("de-posting-issuer-krankenkasse"), euRef("a1-not-work-permit"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-dvka-not-ordinary-posting-issuer")]),
  binding("de-sk-slovak-a1-process-select", "Slowakischen PD-A1-Prozess im DE-SK-Korridor wählen", "Slowakische Entsendung, Mehrstaatenbestimmung oder Nachweis", "Antragstype, Antragstellerrolle und elektronische Pflicht trennen.", [skRef("sk-sp-posting-from-slovakia"), skRef("sk-employee-multi-state-application"), skRef("sk-szco-multi-state-application"), skRef("sk-employer-efiling-effective-2026-09-01"), skRef("sk-application-not-entitlement"), skRef("sk-45-day-posting-not-universal"), skRef("sk-24h-not-guarantee"), skRef("sk-change-reporting"), skRef("sk-branch-contact-fetch-live"), euRef("a1-not-work-permit"), skRef("sk-source-not-german-law"), skRef("sk-efiling-employers-not-all-persons")]),
  binding("de-sk-residence-state-determination", "Wohnstaatliches Bestimmungsverfahren DE-SK", "Gewöhnliche Mehrstaatenarbeit, Bestimmung noch offen", "Wohnsitz SK zur Sociálna poisťovňa, Wohnsitz DE zur DVKA.", [euRef("art-16-987-notify-residence"), skRef("sk-residence-makes-sp-residence-institution"), deRef("de-dvka-residence-multi-state"), skRef("sk-non-residence-not-first-institution"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), skRef("sk-citizenship-not-first-institution"), euRef("material-change-re-examine"), deRef("de-krankenkasse-not-art13-first"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-employer-not-why-dvka")]),
  binding("de-sk-de-employer-sk-resident-telework-fa", "DE-Arbeitgeber SK-Wohnsitz Telearbeitsrahmen", "Wohnsitz SK, Arbeitgeber nur DE, Telearbeit SK 25 bis unter 50 Prozent", "Ohne Antrag kann Artikel 13 zur SK-Gesetzgebung führen; Rahmenweg zur DVKA ist Antrag, nicht Automatik.", [euRef("framework-agreement-is-art-16-not-art-13"), deRef("de-framework-request-to-dvka"), deRef("de-framework-not-automatic"), deRef("de-electronic-sv-meldeportal"), deRef("de-art16-dvka"), deRef("de-framework-max-three-years"), deRef("de-framework-retro-three-months"), euRef("material-change-re-examine"), deRef("de-framework-request-to-dvka"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), deRef("de-framework-not-automatic")]),
  binding("de-sk-sk-employer-de-resident-telework-fa", "SK-Arbeitgeber DE-Wohnsitz Telearbeitsrahmen", "Wohnsitz DE, Arbeitgeber nur SK, Telearbeit DE 25 bis unter 50 Prozent", "Antrag im Arbeitgeberstaat Slowakei an MPSVR SR; Sociálna poisťovňa stellt danach A1 aus.", [euRef("framework-agreement-is-art-16-not-art-13"), skRef("sk-mpsvr-framework-exception-authority"), skRef("sk-sp-issues-a1-after-exception"), skRef("sk-mpsvr-not-sp"), skRef("sk-application-not-entitlement"), skRef("sk-framework-max-three-years"), skRef("sk-framework-not-self-employed"), skRef("sk-change-reporting"), skRef("sk-mpsvr-not-sp"), euRef("ss-not-tax-residence"), skRef("sk-at-bilateral-not-this-corridor"), skRef("sk-framework-not-third-state")]),
  binding("de-sk-ordinary-art-16-boundary", "Ordentliche Artikel-16-Ausnahme DE-SK abgrenzen", "Rahmenvereinbarung scheitert oder mehr als 50 Prozent Telearbeit", "Ordentliches Ermessen nicht als Anspruch und nicht als Rahmenvereinbarung behandeln.", [euRef("art-16-exception-agreement"), euRef("art-16-not-user-entitlement"), deRef("de-art16-dvka"), deRef("de-art16-not-art12-issuer"), euRef("provisional-then-definitive"), deRef("de-framework-retro-three-months"), deRef("de-framework-not-automatic"), euRef("material-change-re-examine"), deRef("de-art16-dvka"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("art-16-not-user-entitlement")]),
  binding("de-sk-a1-change-reexam", "A1 Änderung und Überprüfung DE-SK", "A1 bereits ausgestellt, Sachverhalt ändert sich oder Aufnahmestelle zweifelt", "EU-Bindung und Überprüfung trennen; nationale Meldewege führen.", [euRef("a1-binding-while-valid"), euRef("a1-not-immune-from-review"), euRef("material-change-re-examine"), skRef("sk-change-reporting"), euRef("provisional-then-definitive"), euRef("twelve-month-prospective"), euRef("a1-not-immune-from-review"), euRef("material-change-re-examine"), deRef("de-dvka-residence-multi-state"), euRef("a1-not-work-permit"), deRef("de-routing-does-not-copy-eu-law"), euRef("a1-not-immune-from-review")]),
  binding("de-sk-authority-authenticity-current-process", "Aktuellen DE-SK-Kanal und Authentizität prüfen", "Nutzer verlangt heutige URL, Filiale oder stützt sich auf überholte Amtsseite", "Kontakt live holen; 1. Juli und 1. August 2026 nicht als operative Starts nutzen.", [skRef("sk-branch-contact-fetch-live"), skRef("sk-july-2026-announcement-superseded"), skRef("sk-august-2026-announcement-superseded"), deRef("de-electronic-sv-meldeportal"), skRef("sk-employer-efiling-effective-2026-09-01"), skRef("sk-employer-efiling-effective-2026-09-01"), skRef("sk-24h-not-guarantee"), skRef("sk-change-reporting"), skRef("sk-branch-contact-fetch-live"), euRef("a1-not-work-permit"), skRef("sk-source-not-german-law"), skRef("sk-locale-not-jurisdiction")]),
  binding("de-sk-tax-employment-immigration-boundary", "Steuer-, Arbeits- und Aufenthaltsgrenzen DE-SK", "Nutzer hält A1 für Steuer, Arbeitserlaubnis oder Visum", "Die drei Rechtskreise trennen.", [euRef("ss-not-tax-residence"), euRef("a1-not-work-permit"), euRef("a1-not-tax-certificate"), euRef("a1-not-host-labour-exemption"), euRef("a1-not-ehic"), euRef("a1-not-s1"), euRef("a1-not-work-permit"), euRef("material-change-re-examine"), deRef("de-dvka-not-ordinary-posting-issuer"), euRef("ss-not-tax-residence"), deRef("de-routing-does-not-copy-eu-law"), euRef("a1-not-tax-certificate")]),
]);

type ScenarioSpec = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
}>;

export const DE_SK_SCENARIOS: readonly ScenarioSpec[] = Object.freeze([
  { id: "lives-sk-works-only-de", label: "Wohnt SK, arbeitet nur DE", coverage: "COVERED", requiredClaimKeys: ["art-11-employed-lex-loci-laboris", "residence-not-automatic-employment-legislation"], requiredProcessKeys: ["de-sk-single-state-de-work"] },
  { id: "lives-de-works-only-sk", label: "Wohnt DE, arbeitet nur SK", coverage: "COVERED", requiredClaimKeys: ["art-11-employed-lex-loci-laboris"], requiredProcessKeys: ["de-sk-single-state-sk-work"] },
  { id: "slovak-citizen-lives-sk-works-de", label: "Slowakische Staatsangehörigkeit, wohnt SK, arbeitet DE", coverage: "COVERED", requiredClaimKeys: ["nationality-not-applicable-legislation", "sk-citizenship-not-first-institution"], requiredProcessKeys: ["de-sk-situation-classify"] },
  { id: "german-citizen-lives-sk-works-de", label: "Deutsche Staatsangehörigkeit, wohnt SK, arbeitet DE", coverage: "COVERED", requiredClaimKeys: ["nationality-not-applicable-legislation"], requiredProcessKeys: ["de-sk-single-state-de-work"] },
  { id: "hungarian-citizen-lives-sk-works-de", label: "Ungarische Staatsangehörigkeit, wohnt SK, arbeitet DE", coverage: "COVERED", requiredClaimKeys: ["nationality-not-applicable-legislation", "locale-not-jurisdiction"], requiredProcessKeys: ["de-sk-situation-classify"] },
  { id: "de-employer-posts-sk-3-months", label: "DE-Arbeitgeber entsendet 3 Monate nach SK", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "de-posting-issuer-krankenkasse"], requiredProcessKeys: ["de-sk-de-to-sk-employee-posting"] },
  { id: "de-employer-posts-sk-23-months", label: "DE-Arbeitgeber entsendet 23 Monate nach SK", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY], requiredProcessKeys: ["de-sk-de-to-sk-employee-posting"] },
  { id: "sk-employer-posts-de", label: "SK-Arbeitgeber entsendet nach DE", coverage: "COVERED", requiredClaimKeys: [EU_SHARED_ARTICLE_12_CLAIM_KEY, "sk-sp-posting-from-slovakia"], requiredProcessKeys: ["de-sk-sk-to-de-employee-posting"] },
  { id: "de-self-employed-temp-sk", label: "DE selbständig vorübergehend SK", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting"], requiredProcessKeys: ["de-sk-de-to-sk-self-employed"] },
  { id: "sk-szco-temp-de", label: "SK SZČO vorübergehend DE", coverage: "COVERED", requiredClaimKeys: ["art-12-2-self-employed-posting", "sk-szco-individual-other-channels"], requiredProcessKeys: ["de-sk-sk-to-de-self-employed"] },
  { id: "sk-res-30-time-20-pay", label: "Wohnsitz SK, 30% Zeit 20% Entgelt SK", coverage: "COVERED", requiredClaimKeys: ["employed-time-25-satisfies", "cjeu-c-203-24-hakamp"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "sk-res-20-time-30-pay", label: "Wohnsitz SK, 20% Zeit 30% Entgelt SK", coverage: "COVERED", requiredClaimKeys: ["employed-pay-25-satisfies"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "sk-res-both-24", label: "Wohnsitz SK, Zeit und Entgelt je 24%", coverage: "COVERED", requiredClaimKeys: ["employed-both-below-25-not-substantial"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "de-res-ge-25", label: "Wohnsitz DE, >=25% DE", coverage: "COVERED", requiredClaimKeys: ["substantial-activity-indicator-25", "de-dvka-residence-multi-state"], requiredProcessKeys: ["de-sk-de-resident-multi-state-employee"] },
  { id: "de-res-lt-25-one-sk-employer", label: "Wohnsitz DE, <25% DE, ein SK-Arbeitgeber", coverage: "COVERED", requiredClaimKeys: ["one-employer-branch", "de-dvka-residence-multi-state"], requiredProcessKeys: ["de-sk-de-resident-multi-state-employee"] },
  { id: "sk-res-one-de-employer-no-substantial", label: "Wohnsitz SK, ein DE-Arbeitgeber, kein wesentlicher SK-Anteil", coverage: "COVERED", requiredClaimKeys: ["one-employer-branch", "sk-residence-makes-sp-residence-institution"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "sk-res-several-employers", label: "Wohnsitz SK, mehrere Arbeitgeber", coverage: "COVERED", requiredClaimKeys: ["several-employers-incl-residence"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "residence-unclear", label: "Wohnsitzstaat unklar", coverage: "COVERED", requiredClaimKeys: ["art-16-987-notify-residence"], requiredProcessKeys: ["de-sk-residence-state-determine"] },
  { id: "percentages-unclear", label: "Prognoseanteile unklar", coverage: "COVERED", requiredClaimKeys: ["twelve-month-prospective", "substantial-activity-indicator-25"], requiredProcessKeys: ["de-sk-sk-resident-multi-state-employee"] },
  { id: "nationality-used-as-basis", label: "Nutzer nutzt Staatsangehörigkeit als Basis", coverage: "COVERED", requiredClaimKeys: ["nationality-not-applicable-legislation"], requiredProcessKeys: ["de-sk-situation-classify"] },
  { id: "sk-resident-contacts-sp", label: "SK-Wohnsitz kontaktiert Sociálna poisťovňa", coverage: "COVERED", requiredClaimKeys: ["sk-residence-makes-sp-residence-institution"], requiredProcessKeys: ["de-sk-residence-state-determination"] },
  { id: "sk-employer-residence-de-not-first", label: "SK-Arbeitgeber, Wohnsitz DE: SK nicht erste Stelle", coverage: "COVERED", requiredClaimKeys: ["sk-non-residence-not-first-institution", "sk-employer-not-automatic-sk-law"], requiredProcessKeys: ["de-sk-residence-state-determination"] },
  { id: "de-resident-multi-state-dvka", label: "DE-Wohnsitz Mehrstaaten DVKA", coverage: "COVERED", requiredClaimKeys: ["de-dvka-residence-multi-state", "de-krankenkasse-not-art13-first"], requiredProcessKeys: ["de-sk-de-resident-multi-state-employee"] },
  { id: "de-posting-gkv", label: "DE-SK Entsendung gesetzliche Krankenkasse", coverage: "COVERED", requiredClaimKeys: ["de-posting-issuer-krankenkasse"], requiredProcessKeys: ["de-sk-german-a1-issuer-select"] },
  { id: "de-posting-private", label: "DE-SK Entsendung nicht GKV", coverage: "COVERED", requiredClaimKeys: ["de-posting-issuer-drv"], requiredProcessKeys: ["de-sk-german-a1-issuer-select"] },
  { id: "de-posting-abv", label: "DE-SK Entsendung Versorgungswerk", coverage: "COVERED", requiredClaimKeys: ["de-posting-issuer-abv"], requiredProcessKeys: ["de-sk-german-a1-issuer-select"] },
  { id: "sk-to-de-employer-a1", label: "SK-Arbeitgeber A1-Antrag", coverage: "COVERED", requiredClaimKeys: ["sk-sp-posting-from-slovakia", "sk-application-not-entitlement"], requiredProcessKeys: ["de-sk-slovak-a1-process-select"] },
  { id: "sk-employer-31-aug-2026", label: "SK-Arbeitgeber Antrag 31.08.2026", coverage: "COVERED", requiredClaimKeys: ["sk-employer-efiling-effective-2026-09-01"], requiredProcessKeys: ["de-sk-authority-authenticity-current-process"] },
  { id: "sk-employer-from-1-sep-2026", label: "SK-Arbeitgeber Antrag ab 01.09.2026", coverage: "COVERED", requiredClaimKeys: ["sk-employer-efiling-effective-2026-09-01"], requiredProcessKeys: ["de-sk-slovak-a1-process-select"] },
  { id: "stale-sk-1-july-page", label: "Überholte SK-Seite nennt 1. Juli 2026", coverage: "COVERED", requiredClaimKeys: ["sk-july-2026-announcement-superseded"], requiredProcessKeys: ["de-sk-authority-authenticity-current-process"] },
  { id: "expects-24h-a1", label: "Antragsteller erwartet garantierte 24-Stunden-A1", coverage: "COVERED", requiredClaimKeys: ["sk-24h-not-guarantee"], requiredProcessKeys: ["de-sk-slovak-a1-process-select"] },
  { id: "de-employer-sk-res-30-telework", label: "DE-Arbeitgeber, SK-Wohnsitz, 30% Telework", coverage: "COVERED", requiredClaimKeys: ["de-framework-request-to-dvka", "de-framework-not-automatic"], requiredProcessKeys: ["de-sk-de-employer-sk-resident-telework-fa"] },
  { id: "de-employer-sk-res-49-telework", label: "DE-Arbeitgeber, SK-Wohnsitz, 49% Telework", coverage: "COVERED", requiredClaimKeys: ["framework-agreement-is-art-16-not-art-13"], requiredProcessKeys: ["de-sk-de-employer-sk-resident-telework-fa"] },
  { id: "de-employer-sk-res-50-telework", label: "DE-Arbeitgeber, SK-Wohnsitz, 50% Telework", coverage: "COVERED", requiredClaimKeys: ["de-framework-not-automatic", "art-16-exception-agreement"], requiredProcessKeys: ["de-sk-ordinary-art-16-boundary"] },
  { id: "sk-employer-de-res-30-telework", label: "SK-Arbeitgeber, DE-Wohnsitz, 30% Telework", coverage: "COVERED", requiredClaimKeys: ["sk-mpsvr-framework-exception-authority", "sk-mpsvr-not-sp"], requiredProcessKeys: ["de-sk-sk-employer-de-resident-telework-fa"] },
  { id: "telework-third-state", label: "Telework plus regelmäßige Drittstaatstätigkeit", coverage: "COVERED", requiredClaimKeys: ["sk-framework-not-third-state"], requiredProcessKeys: ["de-sk-sk-employer-de-resident-telework-fa"] },
  { id: "teleworker-also-self-employed", label: "Telearbeitende Person zusätzlich selbständig", coverage: "COVERED", requiredClaimKeys: ["sk-framework-not-self-employed"], requiredProcessKeys: ["de-sk-ordinary-art-16-boundary"] },
  { id: "framework-requested-wrong-state", label: "Rahmenantrag im falschen Staat", coverage: "COVERED", requiredClaimKeys: ["de-framework-request-to-dvka", "sk-mpsvr-framework-exception-authority"], requiredProcessKeys: ["de-sk-de-employer-sk-resident-telework-fa"] },
  { id: "no-framework-request-assumes-employer-state", label: "Kein Antrag, Nutzer unterstellt Arbeitgeberstaatsrecht", coverage: "COVERED", requiredClaimKeys: ["de-framework-not-automatic"], requiredProcessKeys: ["de-sk-de-employer-sk-resident-telework-fa"] },
  { id: "ordinary-art-16-request", label: "Ordentlicher Artikel-16-Antrag", coverage: "COVERED", requiredClaimKeys: ["art-16-exception-agreement", "art-16-not-user-entitlement"], requiredProcessKeys: ["de-sk-ordinary-art-16-boundary"] },
  { id: "a1-issued-facts-change", label: "A1 ausgestellt, Sachverhalt ändert sich", coverage: "COVERED", requiredClaimKeys: ["material-change-re-examine", "a1-not-immune-from-review"], requiredProcessKeys: ["de-sk-a1-change-reexam"] },
  { id: "host-questions-a1", label: "Aufnahmestelle stellt A1 in Frage", coverage: "COVERED", requiredClaimKeys: ["a1-binding-while-valid", "a1-not-immune-from-review"], requiredProcessKeys: ["de-sk-a1-change-reexam"] },
  { id: "user-thinks-a1-is-tax", label: "Nutzer hält A1 für Steuer", coverage: "COVERED", requiredClaimKeys: ["a1-not-tax-certificate", "ss-not-tax-residence"], requiredProcessKeys: ["de-sk-tax-employment-immigration-boundary"] },
  { id: "user-thinks-a1-is-work-permit", label: "Nutzer hält A1 für Arbeitserlaubnis", coverage: "COVERED", requiredClaimKeys: ["a1-not-work-permit"], requiredProcessKeys: ["de-sk-tax-employment-immigration-boundary"] },
  { id: "locale-sk-factual-de-cz", label: "Locale SK, Sachverhalt DE-CZ", coverage: "EXPLICITLY_OUT_OF_SCOPE", requiredClaimKeys: ["locale-not-jurisdiction"], requiredProcessKeys: ["de-sk-situation-classify"] },
  { id: "factual-de-sk-locale-hu", label: "Sachverhalt DE-SK, Locale HU", coverage: "COVERED", requiredClaimKeys: ["locale-not-jurisdiction"], requiredProcessKeys: ["de-sk-situation-classify"] },
]);

export function evaluateDeSkProcessCompleteness() {
  const processKeys = new Set(DE_SK_PROCESSES.map((process) => process.key));
  const claimKeys = new Set([
    ...DE_SK_EU_CLAIM_KEYS,
    ...DE_SK_DE_CLAIM_KEYS,
    ...DE_SK_SK_CLAIM_KEYS,
  ]);
  const incomplete = DE_SK_PROCESSES.filter((process) => process.claimRefs.length < DIM.length);
  const missingClaims = DE_SK_PROCESSES.flatMap((process) => (
    process.claimRefs.filter((ref) => !claimKeys.has(ref.key)).map((ref) => `${process.key}:${ref.key}`)
  ));
  const blocked = DE_SK_SCENARIOS.filter((scenario) => scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const covered = DE_SK_SCENARIOS.filter((scenario) => scenario.coverage === "COVERED");
  const outOfScope = DE_SK_SCENARIOS.filter((scenario) => scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const uncoveredRequired = covered.flatMap((scenario) => [
    ...scenario.requiredProcessKeys.filter((key) => !processKeys.has(key)).map((key) => `process:${scenario.id}:${key}`),
    ...scenario.requiredClaimKeys.filter((key) => !claimKeys.has(key)).map((key) => `claim:${scenario.id}:${key}`),
  ]);
  const processComplete = incomplete.length === 0 && missingClaims.length === 0 && uncoveredRequired.length === 0;
  return Object.freeze({
    processCount: DE_SK_PROCESSES.length,
    processComplete,
    processCompletenessPercent: processComplete ? 100 : 0,
    blockedScenarioCount: blocked.length,
    coveredScenarioCount: covered.length,
    outOfScopeScenarioCount: outOfScope.length,
    totalScenarios: DE_SK_SCENARIOS.length,
    incompleteProcessKeys: incomplete.map((process) => process.key),
    missingClaims,
    uncoveredRequired,
  });
}

export function buildDeSkApplicableLegislationConnectorPack(): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    schemaVersion: CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
    packId: DE_SK_CONNECTOR_PACK_ID,
    originMarket: "DE",
    connectedCountry: "SK",
    status: DE_SK_CONNECTOR_STATUS,
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "applicable-legislation-posting-a1",
    topicFamily: "SOCIAL_SECURITY_COORDINATION",
    germanProcessRef: Object.freeze({
      entityClass: "processes" as const,
      key: DE_AL_PRIMARY_PROCESS_KEY,
      sourceJurisdiction: "DE" as const,
      trustDomain: "de" as const,
      temporalClass: "CURRENT" as const,
    }),
    germanClaimRefs: DE_SK_DE_CLAIM_KEYS.map(deRef),
    euClaimRefs: DE_SK_EU_CLAIM_KEYS.map(euRef),
    foreignClaimRefs: DE_SK_SK_CLAIM_KEYS.map(skRef),
    foreignProcessReference: SK_AL_PRIMARY_PROCESS_KEY,
    actorRule: Object.freeze({
      actorState: "DE_SK_APPLICABLE_LEGISLATION",
      userMustAct: true,
      germanAuthorityMustAct: true,
      foreignAuthorityMustAct: true,
      institutionExchangeExpected: true,
    }),
    requiredCaseRoles: Object.freeze(["WORKER"] as const),
    requiredCaseStates: Object.freeze(["residenceState", "employmentState", "activityState"] as const),
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
    corridorProcesses: DE_SK_PROCESSES,
  });
}

export function deSkConnectorSummary(
  pack: CuratedCrossBorderConnectorPack = buildDeSkApplicableLegislationConnectorPack(),
) {
  return Object.freeze({
    packId: pack.packId,
    status: pack.status,
    euRefCount: pack.euClaimRefs.length,
    deRefCount: pack.germanClaimRefs.length,
    skRefCount: pack.foreignClaimRefs.length,
    processCount: pack.corridorProcesses?.length ?? 0,
    completeness: evaluateDeSkProcessCompleteness(),
    validation: validateCuratedCrossBorderConnectorPack(pack),
  });
}
