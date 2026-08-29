/**
 * KNOWLEDGE-EXPANSION — German federal Arbeitslosengeld (SGB III)
 * process-complete pack.
 * Official-source G3 CuratedDomainPack for domain
 * arbeitslosengeld (new taxonomy identifier).
 * Canonical language is German only. Not a runtime route.
 *
 * G3 limitation: knowledge_process_steps exist in schema 032 but are not part of
 * CuratedDomainPack / knowledge_ingest_curated_domain_pack. Journey structure is
 * therefore represented as named processes + processClaimLinks (role/sequenceContext).
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const ALG_DOMAIN = "arbeitslosengeld" as const;
export const ALG_PACK_ID = ALG_DOMAIN;
export const ALG_CANONICAL_LANGUAGE = "de" as const;

const HASH = (value: string): string => createHash("sha256").update(value).digest("hex");

type FactoryItem = <T extends Readonly<Record<string, unknown>>>(
  entityClass: string,
  key: string,
  values: T,
) => Readonly<{ key: string; id: string } & T>;

function factory(packId: string): FactoryItem {
  return (entityClass, key, values) => Object.freeze({
    key,
    id: stableKnowledgeFactoryId(packId, entityClass, key),
    ...values,
  });
}

export type AlgUnitCategory =
  | "orientation"
  | "eligibility"
  | "application"
  | "calculation"
  | "duration"
  | "nebenjob"
  | "decision_payment"
  | "change_report"
  | "availability"
  | "illness"
  | "sperrzeit"
  | "ruhe"
  | "bescheid"
  | "widerspruch"
  | "overpayment"
  | "health_interface"
  | "cross_border"
  | "competence";

export type AlgContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "WORK_STATE"
  | "COUNTRY";
export type AlgHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type AlgFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type AlgStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type AlgInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type AlgProcessRole =
  | "orientation_basis"
  | "required_information"
  | "identification"
  | "application_route"
  | "form_semantics"
  | "evidence_requirement"
  | "next_state"
  | "deadline_gate"
  | "decision"
  | "payment"
  | "legal_remedy_gate"
  | "context_gate"
  | "negative_control";
export type AlgScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const ALG_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type AlgTemporalClass = "current_2026";

export type AlgFutureChangeWatchItem = Readonly<{
  id: string;
  key: string;
  officialSourceUrl: string;
  officialDomain: string;
  officialSourceTitle: string;
  targetYear: 2026 | 2027;
  status: "future_change_watch_not_ingestible";
  currentGuidance: false;
  description: string;
}>;

type OfficialSourceSpec = Readonly<{
  key: string;
  publisherKey: "bmj" | "bmas" | "ba";
  authorityKey: "ba" | "bmas";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_ONLINE_SERVICE";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: AlgInformationClass;
  handlingMode: AlgHandlingMode;
  freshnessClass: AlgFreshnessClass;
  staleBehavior: AlgStaleBehavior;
  requiredContextKeys: readonly AlgContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: AlgUnitCategory;
  temporal: AlgTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly AlgContextKey[];
}>;

export const ALG_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/sgb_3/__147.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "SGB III § 147 Anspruchsdauer",
});

export const ALG_FUTURE_CHANGE_WATCH_ITEMS: readonly AlgFutureChangeWatchItem[] = Object.freeze([
  {
    id: "alg-future-watch-anspruchsdauer-2027",
    key: "alg-anspruchsdauer-table-2027",
    officialSourceUrl: ALG_FUTURE_WATCH_SOURCE.url,
    officialDomain: ALG_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: ALG_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Tabellenwerte der Anspruchsdauer nach § 147 SGB III für 2027 sind keine aktuelle kanonische Wahrheit und dürfen nicht als zeitloses Recht ingestiert werden.",
  },
  {
    id: "alg-future-watch-nebenjob-freibetrag",
    key: "nebenjob-freibetrag-future",
    officialSourceUrl: "https://www.gesetze-im-internet.de/sgb_3/__155.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "SGB III § 155 Anrechnung von Nebeneinkommen",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Ein künftiger anderer Freibetrag für Nebeneinkommen nach § 155 SGB III ist keine aktuelle kanonische Wahrheit und darf nicht als zeitloser Eurobetrag ingestiert werden.",
  },
]);

export const ALG_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "sgb3-38",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__38.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 38 Frühzeitige Arbeitsuche",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-38-frist",
        locator: "SGB III § 38 Abs. 1",
        text: "Personen, deren Arbeits- oder Ausbildungsverhältnis endet, müssen sich spätestens drei Monate vor dessen Beendigung persönlich arbeitsuchend melden. Erfahren sie erst später von der Beendigung, haben sie die Meldung innerhalb von drei Tagen nach Kenntnis des Beendigungszeitpunktes zu erstatten. Die Pflicht besteht unabhängig davon, ob die Beendigung gerichtlich angegriffen wird.",
      },
      {
        key: "sgb3-38-beratung",
        locator: "SGB III § 38 Abs. 2 und 3",
        text: "Nach der Arbeitsuchendmeldung findet die erste Beratung statt. Sie erfolgt persönlich oder im Einvernehmen per Videokommunikation. Die Arbeitsuchendmeldung ist nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung und ersetzt diese nicht. Eine verspätete Arbeitsuchendmeldung kann eine Sperrzeit von einer Woche nach § 159 Absatz 1 Nummer 9, Absatz 6 SGB III auslösen.",
      },
    ],
  },
  {
    key: "sgb3-137",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__137.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 137 Anspruchsvoraussetzungen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-137-all",
        locator: "SGB III § 137 Abs. 1",
        text: "Anspruch auf Arbeitslosengeld hat, wer arbeitslos ist, sich bei der Agentur für Arbeit arbeitslos gemeldet und die Anwartschaftszeit erfüllt hat. Arbeit in Deutschland allein begründet nicht automatisch einen Anspruch auf Arbeitslosengeld. Alltagssprachliche Arbeitslosigkeit ist nicht automatisch gesetzliche Arbeitslosigkeit.",
      },
    ],
  },
  {
    key: "sgb3-138",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__138.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 138 Arbeitslosigkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-138-all",
        locator: "SGB III § 138",
        text: "Arbeitslos ist, wer nicht in einem Beschäftigungsverhältnis steht (Beschäftigungslosigkeit), sich bemüht, die eigene Beschäftigungslosigkeit zu beenden (Eigenbemühungen), und den Vermittlungsbemühungen der Agentur für Arbeit zur Verfügung steht (Verfügbarkeit). Eine Beschäftigung von weniger als 15 Stunden wöchentlich zerstört die Beschäftigungslosigkeit nicht; mehrere Beschäftigungen werden zusammengerechnet. Die 15-Stunden-Grenze ist kein Einkommensstest. Das Fehlen einer Vollzeitstelle bedeutet nicht automatisch gesetzliche Arbeitslosigkeit.",
      },
    ],
  },
  {
    key: "sgb3-141",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__141.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 141 Arbeitslosmeldung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-141-weg",
        locator: "SGB III § 141 Abs. 1 und 2",
        text: "Wer Arbeitslosengeld beantragen will, muss sich bei der Agentur für Arbeit arbeitslos melden. Die Meldung kann persönlich oder in einem elektronischen Verfahren nach § 36a SGB I erfolgen. Sie kann bereits bis zu drei Monate vor Eintritt der Arbeitslosigkeit erstattet werden. Für den Leistungsbeginn am ersten Tag der Arbeitslosigkeit muss die Meldung spätestens an diesem Tag vorliegen. Ist die Agentur an diesem Tag nicht geöffnet, wirkt die Meldung am nächsten Öffnungstag auf den ersten Tag zurück.",
      },
      {
        key: "sgb3-141-not-replace",
        locator: "SGB III § 141 im Verhältnis zu § 38",
        text: "Die Arbeitsuchendmeldung ersetzt die Arbeitslosmeldung nicht. Die Arbeitslosmeldung ist nicht dieselbe Rechtshandlung wie die Arbeitsuchendmeldung. Allein durch die Arbeitslosmeldung ist Arbeitslosengeld nicht automatisch bewilligt.",
      },
    ],
  },
  {
    key: "sgb3-142",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__142.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 142 Anwartschaftszeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-142-all",
        locator: "SGB III § 142",
        text: "Die Anwartschaftszeit hat erfüllt, wer in der Rahmenfrist mindestens zwölf Monate in einem Versicherungspflichtverhältnis gestanden hat. Für überwiegend kurz befristete Beschäftigungen von jeweils nicht mehr als 14 Wochen kann die Anwartschaftszeit auf sechs Monate verkürzt sein, wenn das Arbeitsentgelt die Eineinhalbfache der Bezugsgröße nicht übersteigt. Zwölf Monate Beschäftigung bedeuten nicht automatisch zwölf Monate Arbeitslosengeld.",
      },
    ],
  },
  {
    key: "sgb3-143",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__143.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 143 Rahmenfrist",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-143-all",
        locator: "SGB III § 143 Abs. 1",
        text: "Die Rahmenfrist beträgt 30 Monate und beginnt mit dem Tag vor der Erfüllung der übrigen Voraussetzungen für den Anspruch auf Arbeitslosengeld. Ob die Anwartschaft erfüllt ist, darf ohne die konkreten Versicherungszeiten nicht entschieden werden.",
      },
    ],
  },
  {
    key: "sgb3-146",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__146.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 146 Minderung der Leistungsfähigkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-146-all",
        locator: "SGB III § 146",
        text: "Wer während des Bezugs von Arbeitslosengeld infolge Krankheit arbeitsunfähig wird, erhält das Arbeitslosengeld längstens für die Dauer von sechs Wochen weiter. Danach kommt die Schnittstelle zum Krankengeld in Betracht. Krankheit bedeutet nicht automatisch das sofortige Ende des Arbeitslosengeldes. Es wird nicht vom ersten Tag an Krankengeld anstelle des Arbeitslosengeldes gezahlt.",
      },
    ],
  },
  {
    key: "sgb3-147",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__147.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 147 Anspruchsdauer",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-147-all",
        locator: "SGB III § 147",
        text: "Die Dauer des Anspruchs auf Arbeitslosengeld richtet sich nach der Dauer der Versicherungspflichtverhältnisse innerhalb der um drei Jahre erweiterten Rahmenfrist und nach dem Lebensalter; sie beträgt zwischen sechs und 24 Monaten. Bei verkürzter Anwartschaftszeit beträgt die Anspruchsdauer drei bis fünf Monate. Die individuelle Anspruchsdauer darf ohne die konkreten Versicherungszeiten und das Lebensalter nicht entschieden werden.",
      },
    ],
  },
  {
    key: "sgb3-149",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__149.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 149 Leistungssatz",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-149-all",
        locator: "SGB III § 149",
        text: "Das Arbeitslosengeld beträgt 67 Prozent des pauschalierten Nettoentgelts (Leistungsentgelt) für Personen mit Kind und 60 Prozent für die übrigen Berechtigten. Bemessungsgrundlage ist das Leistungsentgelt aus dem Bemessungsentgelt, nicht das letzte Nettogehalt. Der Satz ist nicht 60 Prozent oder 67 Prozent des letzten Nettogehalts. Ein individueller Zahlbetrag darf ohne Bescheid und Bemessungsdaten nicht berechnet werden.",
      },
    ],
  },
  {
    key: "sgb3-150",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__150.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 150 Bemessungszeitraum und Bemessungsrahmen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-150-all",
        locator: "SGB III § 150",
        text: "Das Bemessungsentgelt wird aus dem Bemessungszeitraum ermittelt. Der Bemessungszeitraum umfasst grundsätzlich ein Jahr; der Bemessungsrahmen kann auf zwei Jahre erweitert werden, wenn der Bemessungszeitraum weniger als 150 Tage mit Anspruch auf Arbeitsentgelt enthält. Die individuelle Höhe bleibt fallbezogen.",
      },
    ],
  },
  {
    key: "sgb3-155",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__155.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 155 Anrechnung von Nebeneinkommen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-155-all",
        locator: "SGB III § 155",
        text: "Nebeneinkommen aus einer Beschäftigung während des Arbeitslosengeldes bleibt bis 165 Euro monatlich nach Abzug von Steuern, Sozialversicherungsbeiträgen und Werbungskosten anrechnungsfrei. Die Stundengrenze der Beschäftigungslosigkeit ist davon getrennt zu prüfen; geringes Einkommen überschreitet nicht automatisch die Stundengrenze. Eine bereits in zwölf der letzten 18 Monate ausgeübte Nebentätigkeit kann einer besonderen Anrechnungsregel unterliegen. Bei selbstständiger Tätigkeit werden pauschal 30 Prozent der Betriebseinnahmen als Betriebsausgaben berücksichtigt. Ein Nebenjob bedeutet nicht automatisch das Ende des Arbeitslosengeldes.",
      },
    ],
  },
  {
    key: "sgb3-158",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__158.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 158 Ruhen des Anspruchs bei Entlassungsentschädigung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-158-all",
        locator: "SGB III § 158",
        text: "Der Anspruch auf Arbeitslosengeld ruht, wenn die oder der Arbeitslose wegen der Beendigung des Arbeitsverhältnisses eine Abfindung oder vergleichbare Leistung erhalten oder zu beanspruchen hat und das Arbeitsverhältnis ohne Einhaltung der ordentlichen Kündigungsfrist des Arbeitgebers beendet worden ist. Das Ruhen ist nicht dasselbe wie eine Sperrzeit. Es gilt längstens für ein Jahr. Eine Abfindung bedeutet keine automatische Sperrzeit und nicht automatisch den Verlust des Arbeitslosengeldes.",
      },
    ],
  },
  {
    key: "sgb3-159",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__159.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 159 Ruhen bei Sperrzeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-159-1-3",
        locator: "SGB III § 159 Abs. 1 Nr. 1 bis 3, Abs. 3 und 4",
        text: "Eine Sperrzeit tritt ein, wenn die oder der Arbeitslose sich versicherungswidrig verhalten hat, ohne dafür einen wichtigen Grund zu haben. Bei Lösung des Beschäftigungsverhältnisses beträgt die Sperrzeit in der Regel zwölf Wochen und kann auf sechs oder drei Wochen verkürzt werden. Bei Ablehnung einer Arbeit beträgt sie drei, sechs oder zwölf Wochen. Bei unzureichenden Eigenbemühungen beträgt sie zwei Wochen. Eine Eigenkündigung bedeutet nicht automatisch eine Sperrzeit von zwölf Wochen.",
      },
      {
        key: "sgb3-159-4-9",
        locator: "SGB III § 159 Abs. 1 Nr. 4 bis 9, Abs. 5 und 6",
        text: "Bei Ablehnung, Abbruch oder Anlassgeben zum Abbruch einer beruflichen Eingliederungsmaßnahme oder einer zumutbaren Maßnahme zur Heranführung an den Ausbildungs- und Arbeitsmarkt einschließlich Sprachförderung beträgt die Sperrzeit drei, sechs oder zwölf Wochen. Bei Meldeversäumnis beträgt sie eine Woche. Bei verspäteter Arbeitsuchendmeldung beträgt sie eine Woche. Ein versäumter Termin bedeutet nicht automatisch das vollständige Ende des Arbeitslosengeldes.",
      },
      {
        key: "sgb3-159-grund",
        locator: "SGB III § 159 Abs. 1 Satz 1 und Anhörung",
        text: "Eine Sperrzeit unterbleibt, wenn ein wichtiger Grund dargelegt und nachgewiesen wird. Eine Anhörung ist nicht derselbe Verwaltungsakt wie ein Sperrzeitbescheid. Ein Aufhebungsvertrag bedeutet nicht automatisch eine Sperrzeit. Die individuelle Sperrzeit darf ohne Bescheid und die konkreten Tatsachen nicht entschieden werden.",
      },
    ],
  },
  {
    key: "sgb3-161",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__161.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 161 Erlöschen des Anspruchs",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-161-all",
        locator: "SGB III § 161",
        text: "Der Anspruch auf Arbeitslosengeld erlischt unter anderem, wenn die oder der Arbeitslose die Anwartschaftszeit für einen neuen Anspruch erfüllt hat oder wenn Sperrzeiten mit einer Dauer von insgesamt 21 Wochen eingetreten sind. Ein nicht verbrauchter Anspruch kann längstens vier Jahre nach seiner Entstehung geltend gemacht werden. 21 Wochen Sperrzeit bedeuten nicht automatisch jede einzelne Sperrzeit.",
      },
    ],
  },
  {
    key: "sgb3-312",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__312.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 312 Arbeitsbescheinigung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-312-all",
        locator: "SGB III § 312",
        text: "Der Arbeitgeber hat der oder dem Beschäftigten bei Beendigung des Beschäftigungsverhältnisses eine Arbeitsbescheinigung auszustellen. Seit 2023 übermittelt der Arbeitgeber die Arbeitsbescheinigung elektronisch im Verfahren BEA an die Bundesagentur für Arbeit. Die oder der Arbeitslose muss die Bescheinigung nicht als Papierausfertigung beim Arbeitgeber beschaffen, als gäbe es BEA nicht. Eine fehlende Arbeitsbescheinigung kann die Bearbeitung verzögern, beendet den Anspruch aber nicht automatisch.",
      },
    ],
  },
  {
    key: "sgb3-323",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__323.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 323 Antragstellung",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-323-all",
        locator: "SGB III § 323 Abs. 1",
        text: "Arbeitslosengeld gilt mit der Arbeitslosmeldung als beantragt, es sei denn, die oder der Arbeitslose erklärt, Leistungen nicht beantragen zu wollen. Der Antrag ist gleichwohl nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung. Antragsunterlagen und Nachweise bleiben erforderlich. Eine Online-Antragstellung etwa zwei Wochen vor Eintritt der Arbeitslosigkeit ist nach der Verwaltungspraxis der Agentur zulässig.",
      },
    ],
  },
  {
    key: "sgb3-327",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__327.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 327 Zuständige Agentur für Arbeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-327-all",
        locator: "SGB III § 327",
        text: "Für die Leistungen bei Arbeitslosigkeit ist die Agentur für Arbeit zuständig, in deren Bezirk die oder der Arbeitslose bei Eintritt der Arbeitslosigkeit den Wohnsitz hat. Fehlt ein Wohnsitz, ist der gewöhnliche Aufenthalt maßgebend. Weder userLocale noch die Dokumentsprache noch das Bundesland allein bestimmen die zuständige Agentur.",
      },
    ],
  },
  {
    key: "sgb3-336a",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_3/__336a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB III § 336a Sofortige Vollziehbarkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb3-336a-all",
        locator: "SGB III § 336a",
        text: "Widerspruch und Anfechtungsklage haben keine aufschiebende Wirkung gegen Verwaltungsakte, die zur persönlichen Meldung nach § 309 auffordern, sowie in den weiteren in § 336a genannten Fällen. Für die Aufhebung oder Rücknahme laufender Leistungen gilt zudem § 86a Absatz 2 Nummer 2 SGG. Ein Widerspruch hat daher nicht automatisch aufschiebende Wirkung.",
      },
    ],
  },
  {
    key: "sgb1-60",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_1/__60.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB I § 60 Angabe von Tatsachen",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb1-60-all",
        locator: "SGB I § 60 Abs. 1",
        text: "Wer Sozialleistungen beantragt oder erhält, hat alle leistungserheblichen Tatsachen anzugeben, Änderungen unverzüglich mitzuteilen und auf Verlangen Beweisurkunden vorzulegen. Änderungen von Nebenverdienst, Arbeitsstunden, Krankheit, Ortsabwesenheit oder Bankverbindung sind der Agentur für Arbeit unverzüglich zu melden. Unterbleibt die Mitteilung, kann Arbeitslosengeld in falscher Höhe entstehen und grundsätzlich zurückzuzahlen sein.",
      },
    ],
  },
  {
    key: "sgb10-24",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_10/__24.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 24 Anhörung Beteiligter",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb10-24-all",
        locator: "SGB X § 24 Abs. 1",
        text: "Bevor ein Verwaltungsakt erlassen wird, der in Rechte eines Beteiligten eingreift, ist Gelegenheit zur Äußerung zu den erheblichen Tatsachen zu geben. Eine Anhörung der Agentur für Arbeit ist nicht derselbe Verwaltungsakt wie ein Sperrzeitbescheid oder ein Erstattungsbescheid.",
      },
    ],
  },
  {
    key: "sgb10-31",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_10/__31.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 31 Begriff des Verwaltungsaktes",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb10-31-all",
        locator: "SGB X § 31",
        text: "Verwaltungsakt ist jede Verfügung, Entscheidung oder andere hoheitliche Maßnahme, die eine Behörde zur Regelung eines Einzelfalles auf dem Gebiet des öffentlichen Rechts trifft und die auf unmittelbare Rechtswirkung nach außen gerichtet ist. Ein gewöhnliches Informationsschreiben der Agentur für Arbeit ist nicht automatisch ein Verwaltungsakt.",
      },
    ],
  },
  {
    key: "sgb10-37",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_10/__37.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB X § 37 Bekanntgabe des Verwaltungsaktes",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "DEADLINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"],
    passages: [
      {
        key: "sgb10-37-all",
        locator: "SGB X § 37 Abs. 2",
        text: "Ein schriftlicher Verwaltungsakt, der im Inland durch die Post übermittelt wird, gilt am vierten Tag nach der Aufgabe zur Post als bekannt gegeben. Das auf dem Schreiben der Agentur gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe und nicht automatisch der Beginn der Widerspruchsfrist.",
      },
    ],
  },
  {
    key: "sgg-84",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgg/__84.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGG § 84 Widerspruch",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"],
    passages: [
      {
        key: "sgg-84-1",
        locator: "SGG § 84 Abs. 1",
        text: "Der Widerspruch ist binnen eines Monats nach Bekanntgabe des Verwaltungsakts schriftlich, in elektronischer Form oder zur Niederschrift bei der erlassenden Stelle einzureichen. Die Frist beträgt bei Bekanntgabe im Ausland drei Monate. Dies ist keine Empfehlung, Widerspruch einzulegen.",
      },
    ],
  },
  {
    key: "sgb5-5",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://www.gesetze-im-internet.de/sgb_5/__5.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB V § 5 Versicherungspflicht",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb5-5-2",
        locator: "SGB V § 5 Abs. 1 Nr. 2",
        text: "Versicherungspflichtig in der gesetzlichen Krankenversicherung sind Personen in der Zeit, für die sie Arbeitslosengeld nach dem SGB III beziehen. Die Beiträge trägt in der Regel die Bundesagentur für Arbeit. Die nähere Krankenversicherungslaufbahn gehört in das gesonderte Krankenversicherungspaket und darf hier nicht verdoppelt werden.",
      },
    ],
  },
  {
    key: "ba-arbeitsuchend",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/ihre-schritte-wenn-sie-arbeitslos-werden/wie-sie-sich-arbeitsuchend-melden",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Arbeitsuchend melden",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-as-all",
        locator: "BA Arbeitsuchendmeldung",
        text: "Die Arbeitsuchendmeldung bei der Agentur für Arbeit soll möglichst drei Monate vor dem Ende der Beschäftigung erfolgen, spätestens innerhalb von drei Tagen nach Kenntnis eines späteren Endes. Sie kann online oder persönlich erfolgen. Die erste Beratung nach der Registrierung findet persönlich oder im Einvernehmen per Video statt. Die Arbeitsuchendmeldung ist nicht die Arbeitslosmeldung.",
      },
    ],
  },
  {
    key: "ba-arbeitslos",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/ihre-schritte-wenn-sie-arbeitslos-werden/wie-sie-sich-arbeitslos-melden",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Arbeitslos melden",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-al-all",
        locator: "BA Arbeitslosmeldung",
        text: "Die Arbeitslosmeldung ist Voraussetzung für Arbeitslosengeld. Sie kann elektronisch im qualifizierten Verfahren oder persönlich erfolgen und bereits bis zu drei Monate vor der Arbeitslosigkeit erstattet werden. Spätestens am ersten Tag der Arbeitslosigkeit muss sie vorliegen, sonst beginnt die Leistung später. Die Agentur empfiehlt, den Antrag etwa zwei Wochen vorher online vorzubereiten. Die Arbeitsuchendmeldung ersetzt die Arbeitslosmeldung nicht.",
      },
    ],
  },
  {
    key: "ba-anspruch-hoehe-dauer",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/finanzielle-hilfen/arbeitslosengeld-anspruch-hoehe-dauer",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Anspruch, Höhe und Dauer",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-hoehe-all",
        locator: "BA Anspruch Höhe Dauer",
        text: "Arbeitslosengeld setzt Arbeitslosigkeit, Arbeitslosmeldung und erfüllte Anwartschaft voraus. Die Höhe beträgt 60 Prozent oder mit Kind 67 Prozent des pauschalierten Nettoentgelts, nicht des letzten Nettogehalts. Die Dauer richtet sich nach Versicherungszeiten und Alter und liegt in der Regel zwischen sechs und 24 Monaten. Einen individuellen Eurobetrag oder eine individuelle Dauer nennt nur der Bescheid der Agentur.",
      },
    ],
  },
  {
    key: "ba-merkblatt",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/datei/merkblatt-fuer-arbeitslose_ba036520.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Merkblatt für Arbeitslose",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-merkblatt-zahlung",
        locator: "BA Merkblatt, Zahlung",
        text: "Das Arbeitslosengeld wird monatlich nachträglich zum Monatsende gezahlt. Es ist keine Vorschusszahlung wie das Grundsicherungsgeld. Ein individueller Auszahlungstag darf ohne den Bewilligungsbescheid nicht bestimmt werden.",
      },
      {
        key: "ba-merkblatt-pflichten",
        locator: "BA Merkblatt, Pflichten",
        text: "Während des Bezugs von Arbeitslosengeld bestehen Melde-, Mitwirkungs- und Verfügbarkeitspflichten gegenüber der Agentur für Arbeit. Ortsabwesenheit ist vorher abzustimmen. Ein Nebenverdienst und Krankheit sind unverzüglich mitzuteilen.",
      },
    ],
  },
  {
    key: "ba-vor-ort",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/vor-ort",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Agentur vor Ort",
    sourceClass: "FEDERAL_SERVICE_PORTAL",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: ["BUNDESLAND"],
    passages: [
      {
        key: "ba-finder-all",
        locator: "BA Dienststellensuche Agentur",
        text: "Die zuständige Agentur für Arbeit ergibt sich aus dem Wohnsitz oder sonst dem gewöhnlichen Aufenthalt und ist über die Dienststellensuche der Bundesagentur für Arbeit zu ermitteln. Aktuelle Öffnungszeiten und lokale Kontaktdaten sind live zu prüfen und keine bundesweit festgeschriebenen Konstanten. Eine bestimmte Agentur darf nicht aus der Sprache oder einem zufälligen Ortsnamen erfunden werden.",
      },
    ],
  },
  {
    key: "ba-fw-u2",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/datei/fw-internationales-recht-alv-bezug-von-arbeitslosengeld-bei-arbeitsuche-im-ausland_ba147611.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "BA Fachliche Weisung: Arbeitslosengeld bei Arbeitsuche im Ausland",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-fw-u2-all",
        locator: "BA FW Export PD U2",
        text: "Für die Arbeitsuche in einem anderen Mitgliedstaat kann Arbeitslosengeld nach Artikel 64 der Verordnung (EG) Nr. 883/2004 mit dem Portable Document U2 exportiert werden. Der Anspruch besteht zunächst für drei Monate und kann auf sechs Monate verlängert werden. Der Antrag auf PD U2 ist vor der Ausreise bei der zuständigen Agentur zu stellen. Das PD U2 ist nicht dasselbe Dokument wie das PD U1 und nicht dieselbe Genehmigung wie eine inländische Ortsabwesenheit.",
      },
    ],
  },
  {
    key: "ba-fw-ausland",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/datei/fw-intrecht-alv-ausland_ba035880.pdf",
    officialDomain: "www.arbeitsagentur.de",
    title: "BA Fachliche Weisung: Internationales Recht Arbeitslosenversicherung",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "PDF_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-fw-ausland-all",
        locator: "BA FW Internationales Recht ALV",
        text: "Das PD U1 bescheinigt Versicherungszeiten für die Zusammenrechnung. Das PD U2 betrifft den Export bei Arbeitsuche im Ausland. Staatsangehörigkeit, Sprache oder eine deutsche Anschrift allein entscheiden nicht den zuständigen Leistungsstaat. Grenzgängerfälle und Drittstaatsabkommen dürfen nicht vereinfacht entschieden werden.",
      },
    ],
  },
  {
    key: "eurlex-883-2004",
    publisherKey: "bmj",
    authorityKey: "ba",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32004R0883",
    officialDomain: "eur-lex.europa.eu",
    title: "Verordnung (EG) Nr. 883/2004 zur Koordinierung der Systeme der sozialen Sicherheit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "eurlex-u2-art64",
        locator: "VO (EG) 883/2004 Art. 64",
        text: "Artikel 64 der Verordnung (EG) Nr. 883/2004 regelt den Export von Arbeitslosengeld bei Arbeitsuche in einem anderen Mitgliedstaat. Der Leistungsbezug kann für drei Monate aufrechterhalten und auf höchstens sechs Monate verlängert werden. Wohnsitz in Deutschland bestimmt nicht automatisch den zuständigen Leistungsstaat. Wohnsitz im Ausland bedeutet nicht automatisch, dass Deutschland nicht zuständig ist.",
      },
    ],
  },
]);

export const ALG_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "alg-is-sgb3-leistung", category: "orientation", temporal: "current_2026", type: "definition", text: "Arbeitslosengeld ist die Entgeltersatzleistung der Arbeitslosenversicherung nach dem Dritten Buch Sozialgesetzbuch. Zuständig ist die Agentur für Arbeit, nicht das Jobcenter.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "low" },
  { key: "agentur-not-jobcenter", category: "orientation", temporal: "current_2026", type: "exception", text: "Die Agentur für Arbeit ist nicht das Jobcenter. Arbeitslosengeld nach SGB III und Grundsicherungsgeld nach SGB II sind verschiedene Leistungen mit verschiedenen Trägern.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "high" },
  { key: "alg-not-grundsicherungsgeld", category: "orientation", temporal: "current_2026", type: "exception", text: "Arbeitslosengeld ist nicht Grundsicherungsgeld. SGB III ist nicht SGB II; ein Anspruch auf die eine Leistung folgt nicht automatisch aus der anderen.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "high" },
  { key: "sgb3-not-sgb2", category: "orientation", temporal: "current_2026", type: "definition", text: "Das Arbeitslosengeldverfahren richtet sich nach dem SGB III. Vorschriften des SGB II über Grundsicherungsgeld, Bedarfsgemeinschaft oder Leistungsminderung gelten hier nicht.", sourceKey: "ba-anspruch-hoehe-dauer", passageKey: "ba-hoehe-all", riskLevel: "medium" },
  { key: "kuendigung-validity-not-decided", category: "orientation", temporal: "current_2026", type: "exception", text: "Ob eine Kündigung arbeitsrechtlich wirksam ist, entscheidet nicht die Agentur für Arbeit im Arbeitslosengeldverfahren. Die Arbeitsuchendmeldung bleibt unabhängig von einer gerichtlichen Überprüfung der Beendigung.", sourceKey: "sgb3-38", passageKey: "sgb3-38-frist", riskLevel: "high" },
  { key: "arbeitsuchend-three-months-before", category: "application", temporal: "current_2026", type: "deadline", text: "Die Arbeitsuchendmeldung muss spätestens drei Monate vor dem Ende des Arbeits- oder Ausbildungsverhältnisses bei der Agentur für Arbeit erfolgen.", sourceKey: "sgb3-38", passageKey: "sgb3-38-frist", riskLevel: "high" },
  { key: "arbeitsuchend-three-days-if-later", category: "application", temporal: "current_2026", type: "deadline", text: "Wird das Ende des Beschäftigungsverhältnisses erst später bekannt, ist die Arbeitsuchendmeldung innerhalb von drei Tagen nach dieser Kenntnis zu erstatten.", sourceKey: "sgb3-38", passageKey: "sgb3-38-frist", riskLevel: "high" },
  { key: "arbeitsuchend-independent-of-court", category: "application", temporal: "current_2026", type: "duty", text: "Die Pflicht zur Arbeitsuchendmeldung besteht unabhängig davon, ob die Beendigung des Arbeitsverhältnisses gerichtlich angegriffen wird.", sourceKey: "sgb3-38", passageKey: "sgb3-38-frist", riskLevel: "high" },
  { key: "first-counseling-after-registration", category: "application", temporal: "current_2026", type: "procedure", text: "Nach der Arbeitsuchendmeldung findet die erste Beratung bei der Agentur für Arbeit statt. Sie erfolgt persönlich oder im Einvernehmen per Videokommunikation.", sourceKey: "sgb3-38", passageKey: "sgb3-38-beratung", riskLevel: "medium" },
  { key: "arbeitsuchend-not-arbeitslos", category: "application", temporal: "current_2026", type: "exception", text: "Die Arbeitsuchendmeldung ist nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung und ersetzt sie nicht.", sourceKey: "sgb3-38", passageKey: "sgb3-38-beratung", riskLevel: "high" },
  { key: "late-arbeitsuchend-sperrzeit-one-week", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Eine verspätete Arbeitsuchendmeldung kann eine Sperrzeit von einer Woche nach § 159 Absatz 1 Nummer 9, Absatz 6 SGB III auslösen, sofern kein wichtiger Grund vorliegt.", sourceKey: "sgb3-38", passageKey: "sgb3-38-beratung", riskLevel: "high" },
  { key: "arbeitslos-electronic-or-personal", category: "application", temporal: "current_2026", type: "procedure", text: "Die Arbeitslosmeldung bei der Agentur für Arbeit erfolgt persönlich oder in einem elektronischen qualifizierten Verfahren nach § 36a SGB I.", sourceKey: "sgb3-141", passageKey: "sgb3-141-weg", riskLevel: "medium" },
  { key: "arbeitslos-up-to-three-months-before", category: "application", temporal: "current_2026", type: "procedure", text: "Die Arbeitslosmeldung kann bereits bis zu drei Monate vor Eintritt der Arbeitslosigkeit erstattet werden.", sourceKey: "sgb3-141", passageKey: "sgb3-141-weg", riskLevel: "medium" },
  { key: "arbeitslos-latest-first-day", category: "application", temporal: "current_2026", type: "deadline", text: "Für den Leistungsbeginn am ersten Tag der Arbeitslosigkeit muss die Arbeitslosmeldung spätestens an diesem Tag bei der Agentur vorliegen.", sourceKey: "sgb3-141", passageKey: "sgb3-141-weg", riskLevel: "high" },
  { key: "arbeitslos-next-open-day-backdates", category: "application", temporal: "current_2026", type: "deadline", text: "Ist die Agentur für Arbeit am ersten Tag der Arbeitslosigkeit nicht geöffnet, wirkt die Arbeitslosmeldung am nächsten Öffnungstag auf den ersten Tag zurück.", sourceKey: "sgb3-141", passageKey: "sgb3-141-weg", riskLevel: "high" },
  { key: "arbeitsuchend-does-not-replace-arbeitslos", category: "application", temporal: "current_2026", type: "exception", text: "Die Arbeitsuchendmeldung ersetzt die Arbeitslosmeldung nicht. Ohne Arbeitslosmeldung beginnt kein Arbeitslosengeld.", sourceKey: "sgb3-141", passageKey: "sgb3-141-not-replace", riskLevel: "high" },
  { key: "arbeitslos-not-automatic-approval", category: "application", temporal: "current_2026", type: "exception", text: "Allein durch die Arbeitslosmeldung ist Arbeitslosengeld nicht automatisch bewilligt. Die Agentur prüft Anspruch, Höhe und Dauer und erlässt einen Bescheid.", sourceKey: "sgb3-141", passageKey: "sgb3-141-not-replace", riskLevel: "high" },
  { key: "application-not-same-as-meldung", category: "application", temporal: "current_2026", type: "exception", text: "Der Antrag auf Arbeitslosengeld ist nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung, auch wenn die Meldung den Antrag grundsätzlich mitbewirkt.", sourceKey: "sgb3-323", passageKey: "sgb3-323-all", riskLevel: "high" },
  { key: "alg-gilt-mit-meldung-als-beantragt", category: "application", temporal: "current_2026", type: "definition", text: "Arbeitslosengeld gilt mit der Arbeitslosmeldung als beantragt, es sei denn, die oder der Arbeitslose erklärt, Leistungen nicht beantragen zu wollen.", sourceKey: "sgb3-323", passageKey: "sgb3-323-all", riskLevel: "medium" },
  { key: "still-need-application-documents", category: "application", temporal: "current_2026", type: "duty", text: "Trotz der gesetzlichen Antragswirkung der Arbeitslosmeldung bleiben Antragsunterlagen und Nachweise für das Arbeitslosengeld erforderlich.", sourceKey: "sgb3-323", passageKey: "sgb3-323-all", riskLevel: "medium" },
  { key: "application-online-two-weeks-ok", category: "application", temporal: "current_2026", type: "procedure", text: "Eine Online-Antragstellung auf Arbeitslosengeld etwa zwei Wochen vor Eintritt der Arbeitslosigkeit ist nach der Verwaltungspraxis der Agentur für Arbeit zulässig.", sourceKey: "ba-arbeitslos", passageKey: "ba-al-all", riskLevel: "low" },
  { key: "employer-must-certify", category: "application", temporal: "current_2026", type: "duty", text: "Der Arbeitgeber muss bei Beendigung des Beschäftigungsverhältnisses eine Arbeitsbescheinigung nach § 312 SGB III ausstellen.", sourceKey: "sgb3-312", passageKey: "sgb3-312-all", riskLevel: "medium" },
  { key: "bea-electronic-since-2023", category: "application", temporal: "current_2026", type: "procedure", text: "Seit 2023 übermittelt der Arbeitgeber die Arbeitsbescheinigung elektronisch im Verfahren BEA an die Bundesagentur für Arbeit.", sourceKey: "sgb3-312", passageKey: "sgb3-312-all", riskLevel: "medium" },
  { key: "do-not-require-paper-from-employer", category: "application", temporal: "current_2026", type: "exception", text: "Die oder der Arbeitslose muss die Arbeitsbescheinigung nicht als Papierausfertigung beim Arbeitgeber beschaffen, als gäbe es das elektronische BEA-Verfahren nicht.", sourceKey: "sgb3-312", passageKey: "sgb3-312-all", riskLevel: "medium" },
  { key: "missing-certificate-can-delay", category: "application", temporal: "current_2026", type: "exception", text: "Eine fehlende Arbeitsbescheinigung kann die Bearbeitung des Arbeitslosengeldes verzögern, beendet den Anspruch aber nicht automatisch.", sourceKey: "sgb3-312", passageKey: "sgb3-312-all", riskLevel: "medium" },
  { key: "entitlement-three-conditions", category: "eligibility", temporal: "current_2026", type: "definition", text: "Anspruch auf Arbeitslosengeld hat, wer arbeitslos ist, sich bei der Agentur für Arbeit arbeitslos gemeldet und die Anwartschaftszeit erfüllt hat.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "high" },
  { key: "beschaeftigungslosigkeit-definition", category: "eligibility", temporal: "current_2026", type: "definition", text: "Beschäftigungslosigkeit im Sinne des Arbeitslosengeldes liegt vor, wenn keine Beschäftigung von mindestens 15 Stunden wöchentlich ausgeübt wird.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "eigenbemuehungen-required", category: "eligibility", temporal: "current_2026", type: "duty", text: "Wer Arbeitslosengeld bezieht oder beantragt, muss eigene Bemühungen unternehmen, die Beschäftigungslosigkeit zu beenden, und diese der Agentur nachweisen.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "verfuegbarkeit-required", category: "eligibility", temporal: "current_2026", type: "duty", text: "Wer Arbeitslosengeld bezieht, muss den Vermittlungsbemühungen der Agentur für Arbeit zur Verfügung stehen. Ortsabwesenheit und Krankheit können die Verfügbarkeit berühren.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "under-15-hours-not-destroy", category: "eligibility", temporal: "current_2026", type: "exception", text: "Eine Beschäftigung von weniger als 15 Stunden wöchentlich zerstört die Beschäftigungslosigkeit für das Arbeitslosengeld nicht.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "multiple-jobs-aggregated", category: "eligibility", temporal: "current_2026", type: "definition", text: "Mehrere Beschäftigungen werden für die 15-Stunden-Grenze des Arbeitslosengeldes zusammengerechnet.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "fifteen-hours-not-income-test", category: "eligibility", temporal: "current_2026", type: "exception", text: "Die 15-Stunden-Grenze der Beschäftigungslosigkeit ist kein Einkommensstest für das Arbeitslosengeld.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "everyday-unemployed-not-statutory", category: "eligibility", temporal: "current_2026", type: "exception", text: "Alltagssprachliche Arbeitslosigkeit ist nicht automatisch gesetzliche Arbeitslosigkeit im Sinne des § 138 SGB III und begründet nicht automatisch Arbeitslosengeld.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "high" },
  { key: "no-full-time-not-automatic-arbeitslos", category: "eligibility", temporal: "current_2026", type: "exception", text: "Das Fehlen einer Vollzeitstelle bedeutet nicht automatisch gesetzliche Arbeitslosigkeit und nicht automatisch einen Anspruch auf Arbeitslosengeld.", sourceKey: "sgb3-138", passageKey: "sgb3-138-all", riskLevel: "high" },
  { key: "anwartschaft-12-in-30", category: "eligibility", temporal: "current_2026", type: "definition", text: "Die Anwartschaftszeit für Arbeitslosengeld ist erfüllt, wer in der 30-monatigen Rahmenfrist mindestens zwölf Monate in einem Versicherungspflichtverhältnis gestanden hat.", sourceKey: "sgb3-142", passageKey: "sgb3-142-all", riskLevel: "high" },
  { key: "shortened-6-months-short-fixed", category: "eligibility", temporal: "current_2026", type: "exception", text: "Für überwiegend kurz befristete Beschäftigungen von jeweils nicht mehr als 14 Wochen kann die Anwartschaftszeit auf sechs Monate verkürzt sein, wenn das Entgelt die Eineinhalbfache der Bezugsgröße nicht übersteigt.", sourceKey: "sgb3-142", passageKey: "sgb3-142-all", riskLevel: "high" },
  { key: "worked-germany-not-automatic", category: "eligibility", temporal: "current_2026", type: "exception", text: "Wer in Deutschland gearbeitet hat, hat nicht automatisch einen Anspruch auf Arbeitslosengeld. Es müssen Arbeitslosigkeit, Arbeitslosmeldung und Anwartschaft vorliegen.", sourceKey: "sgb3-137", passageKey: "sgb3-137-all", riskLevel: "high" },
  { key: "twelve-months-employed-not-twelve-alg", category: "duration", temporal: "current_2026", type: "exception", text: "Zwölf Monate Beschäftigung bedeuten nicht automatisch zwölf Monate Arbeitslosengeld. Die Anspruchsdauer folgt der gesetzlichen Tabelle nach Versicherungszeiten und Alter.", sourceKey: "sgb3-142", passageKey: "sgb3-142-all", riskLevel: "high" },
  { key: "sixty-percent-general", category: "calculation", temporal: "current_2026", type: "definition", text: "Ohne Kind beträgt das Arbeitslosengeld 60 Prozent des pauschalierten Nettoentgelts (Leistungsentgelt) aus dem Bemessungsentgelt.", sourceKey: "sgb3-149", passageKey: "sgb3-149-all", riskLevel: "medium" },
  { key: "sixty-seven-with-child", category: "calculation", temporal: "current_2026", type: "definition", text: "Mit Kind beträgt das Arbeitslosengeld 67 Prozent des pauschalierten Nettoentgelts (Leistungsentgelt) aus dem Bemessungsentgelt.", sourceKey: "sgb3-149", passageKey: "sgb3-149-all", riskLevel: "medium" },
  { key: "last-salary-not-alg-amount", category: "calculation", temporal: "current_2026", type: "exception", text: "Bemessungsgrundlage des Arbeitslosengeldes ist das Leistungsentgelt aus dem Bemessungsentgelt, nicht das letzte Nettogehalt.", sourceKey: "sgb3-149", passageKey: "sgb3-149-all", riskLevel: "high" },
  { key: "sixty-not-last-net", category: "calculation", temporal: "current_2026", type: "exception", text: "Der Leistungssatz des Arbeitslosengeldes ist nicht 60 Prozent oder 67 Prozent des letzten Nettogehalts, sondern des pauschalierten Leistungsentgelts.", sourceKey: "sgb3-149", passageKey: "sgb3-149-all", riskLevel: "high" },
  { key: "bemessungszeitraum-one-year", category: "calculation", temporal: "current_2026", type: "definition", text: "Der Bemessungszeitraum für das Arbeitslosengeld umfasst grundsätzlich ein Jahr vor der Arbeitslosigkeit.", sourceKey: "sgb3-150", passageKey: "sgb3-150-all", riskLevel: "medium" },
  { key: "bemessungsrahmen-expandable-two", category: "calculation", temporal: "current_2026", type: "definition", text: "Der Bemessungsrahmen kann auf zwei Jahre erweitert werden, wenn der Bemessungszeitraum weniger als 150 Tage mit Anspruch auf Arbeitsentgelt enthält.", sourceKey: "sgb3-150", passageKey: "sgb3-150-all", riskLevel: "medium" },
  { key: "individual-amount-fail-closed", category: "calculation", temporal: "current_2026", type: "exception", text: "Ein individueller Zahlbetrag des Arbeitslosengeldes darf ohne Bewilligungsbescheid, Bemessungsentgelt und Kindermerkmal nicht berechnet werden.", sourceKey: "sgb3-149", passageKey: "sgb3-149-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "duration-table-6-to-24", category: "duration", temporal: "current_2026", type: "definition", text: "Die gesetzliche Anspruchsdauer des Arbeitslosengeldes beträgt nach Versicherungszeiten und Lebensalter zwischen sechs und 24 Monaten.", sourceKey: "sgb3-147", passageKey: "sgb3-147-all", riskLevel: "medium" },
  { key: "shortened-anwartschaft-3-to-5", category: "duration", temporal: "current_2026", type: "definition", text: "Bei verkürzter Anwartschaftszeit beträgt die Anspruchsdauer des Arbeitslosengeldes drei bis fünf Monate.", sourceKey: "sgb3-147", passageKey: "sgb3-147-all", riskLevel: "medium" },
  { key: "individual-duration-fail-closed", category: "duration", temporal: "current_2026", type: "exception", text: "Die individuelle Anspruchsdauer des Arbeitslosengeldes darf ohne die konkreten Versicherungszeiten und das Lebensalter nicht entschieden werden.", sourceKey: "sgb3-147", passageKey: "sgb3-147-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "twenty-one-weeks-extinguish-claim", category: "duration", temporal: "current_2026", type: "definition", text: "Sperrzeiten mit einer Gesamtdauer von 21 Wochen können den Anspruch auf Arbeitslosengeld zum Erlöschen bringen.", sourceKey: "sgb3-161", passageKey: "sgb3-161-all", riskLevel: "high" },
  { key: "four-year-claim-use-boundary", category: "duration", temporal: "current_2026", type: "deadline", text: "Ein nicht verbrauchter Anspruch auf Arbeitslosengeld kann längstens vier Jahre nach seiner Entstehung geltend gemacht werden.", sourceKey: "sgb3-161", passageKey: "sgb3-161-all", riskLevel: "high" },
  { key: "payment-monthly-in-arrears", category: "decision_payment", temporal: "current_2026", type: "procedure", text: "Das Arbeitslosengeld wird monatlich nachträglich zum Monatsende von der Bundesagentur für Arbeit gezahlt. Ein individueller Auszahlungstag darf ohne Bescheid nicht bestimmt werden.", sourceKey: "ba-merkblatt", passageKey: "ba-merkblatt-zahlung", riskLevel: "medium" },
  { key: "inspect-bescheid-parts", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Ein Bescheid der Agentur für Arbeit ist auf Tenor, Begründung, Leistungszeitraum, Betrag und Rechtsbehelfsbelehrung zu prüfen, bevor ein Rechtsbehelf erwogen wird.", sourceKey: "ba-anspruch-hoehe-dauer", passageKey: "ba-hoehe-all", riskLevel: "medium" },
  { key: "nebenjob-165-euro-freibetrag", category: "nebenjob", temporal: "current_2026", type: "definition", text: "Nebeneinkommen beim Arbeitslosengeld bleibt bis 165 Euro monatlich nach Abzug von Steuern, Sozialversicherungsbeiträgen und Werbungskosten anrechnungsfrei.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "high" },
  { key: "nebenjob-hours-test-separate", category: "nebenjob", temporal: "current_2026", type: "definition", text: "Die Stundengrenze der Beschäftigungslosigkeit und der Freibetrag für Nebeneinkommen beim Arbeitslosengeld sind getrennt zu prüfen.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "high" },
  { key: "existing-12-of-18-side-job", category: "nebenjob", temporal: "current_2026", type: "exception", text: "Eine bereits in zwölf der letzten 18 Monate ausgeübte Nebentätigkeit kann beim Arbeitslosengeld einer besonderen Anrechnungsregel unterliegen.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "high" },
  { key: "self-employed-30-percent-expenses", category: "nebenjob", temporal: "current_2026", type: "definition", text: "Bei selbstständiger Nebentätigkeit während des Arbeitslosengeldes werden pauschal 30 Prozent der Betriebseinnahmen als Betriebsausgaben berücksichtigt.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "medium" },
  { key: "nebenjob-not-automatic-end", category: "nebenjob", temporal: "current_2026", type: "exception", text: "Ein Nebenjob bedeutet nicht automatisch das Ende des Arbeitslosengeldes. Es kommt auf Stundengrenze, Anrechnung und Verfügbarkeit an.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "high" },
  { key: "low-income-not-hours", category: "nebenjob", temporal: "current_2026", type: "exception", text: "Geringes Einkommen überschreitet nicht automatisch die Stundengrenze der Beschäftigungslosigkeit beim Arbeitslosengeld.", sourceKey: "sgb3-155", passageKey: "sgb3-155-all", riskLevel: "high" },
  { key: "change-report-unverzueglich", category: "change_report", temporal: "current_2026", type: "duty", text: "Wer Arbeitslosengeld beantragt oder erhält, muss Änderungen der leistungserheblichen Verhältnisse unverzüglich der Agentur für Arbeit mitteilen.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "high" },
  { key: "non-report-can-cause-repayment", category: "change_report", temporal: "current_2026", type: "duty", text: "Unterbleibt die Veränderungsmitteilung, kann Arbeitslosengeld in falscher Höhe entstehen und grundsätzlich zurückzuzahlen sein.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "high" },
  { key: "travel-needs-aa-coordination", category: "availability", temporal: "current_2026", type: "duty", text: "Eine Ortsabwesenheit während des Arbeitslosengeldes braucht die vorherige Abstimmung mit der Agentur für Arbeit, weil die Verfügbarkeit erhalten bleiben muss.", sourceKey: "ba-merkblatt", passageKey: "ba-merkblatt-pflichten", riskLevel: "high" },
  { key: "travel-not-employee-urlaub", category: "availability", temporal: "current_2026", type: "exception", text: "Die Ortsabwesenheit einer oder eines Arbeitslosengeldbeziehenden ist nicht derselbe gesetzliche Erholungsurlaub wie bei einer Arbeitnehmerin oder einem Arbeitnehmer.", sourceKey: "ba-merkblatt", passageKey: "ba-merkblatt-pflichten", riskLevel: "high" },
  { key: "alg-recipient-not-employee-holiday", category: "availability", temporal: "current_2026", type: "exception", text: "Wer Arbeitslosengeld bezieht, ist nicht Arbeitnehmerin oder Arbeitnehmer mit gesetzlichem Erholungsurlaub. Eine Reise ist deshalb keine automatisch zulässige Urlaubsabwesenheit.", sourceKey: "ba-merkblatt", passageKey: "ba-merkblatt-pflichten", riskLevel: "high" },
  { key: "domestic-absence-not-u2", category: "availability", temporal: "current_2026", type: "exception", text: "Eine inländische Ortsabwesenheit ist nicht dasselbe wie ein PD U2 für die Arbeitsuche im Ausland.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "illness-alg-up-to-six-weeks", category: "illness", temporal: "current_2026", type: "definition", text: "Bei Arbeitsunfähigkeit während des Arbeitslosengeldes wird das Arbeitslosengeld längstens sechs Wochen weitergezahlt.", sourceKey: "sgb3-146", passageKey: "sgb3-146-all", riskLevel: "high" },
  { key: "then-krankengeld-interface", category: "illness", temporal: "current_2026", type: "procedure", text: "Nach bis zu sechs Wochen fortgesetztem Arbeitslosengeld bei Krankheit kommt die Schnittstelle zum Krankengeld in Betracht. Die nähere Krankengeldberechnung gehört nicht in dieses Paket.", sourceKey: "sgb3-146", passageKey: "sgb3-146-all", riskLevel: "high" },
  { key: "illness-not-immediate-end", category: "illness", temporal: "current_2026", type: "exception", text: "Krankheit bedeutet nicht automatisch das sofortige Ende des Arbeitslosengeldes.", sourceKey: "sgb3-146", passageKey: "sgb3-146-all", riskLevel: "high" },
  { key: "six-weeks-not-day-one-krankengeld", category: "illness", temporal: "current_2026", type: "exception", text: "Bei Krankheit während des Arbeitslosengeldes wird nicht vom ersten Tag an Krankengeld anstelle des Arbeitslosengeldes gezahlt.", sourceKey: "sgb3-146", passageKey: "sgb3-146-all", riskLevel: "high" },
  { key: "sperrzeit-aufgabe-12-weeks", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei Lösung des Beschäftigungsverhältnisses ohne wichtigen Grund beträgt die Sperrzeit für das Arbeitslosengeld in der Regel zwölf Wochen.", sourceKey: "sgb3-159", passageKey: "sgb3-159-1-3", riskLevel: "high" },
  { key: "sperrzeit-aufgabe-shorten-3-6", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Die Sperrzeit wegen Lösung des Beschäftigungsverhältnisses kann nach den gesetzlichen Maßgaben auf sechs oder drei Wochen verkürzt werden.", sourceKey: "sgb3-159", passageKey: "sgb3-159-1-3", riskLevel: "high" },
  { key: "sperrzeit-ablehnung-3-6-12", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei Ablehnung einer zumutbaren Arbeit ohne wichtigen Grund beträgt die Sperrzeit drei, sechs oder zwölf Wochen.", sourceKey: "sgb3-159", passageKey: "sgb3-159-1-3", riskLevel: "high" },
  { key: "sperrzeit-eigenbemuehungen-2-weeks", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei unzureichenden Eigenbemühungen ohne wichtigen Grund beträgt die Sperrzeit zwei Wochen.", sourceKey: "sgb3-159", passageKey: "sgb3-159-1-3", riskLevel: "high" },
  { key: "sperrzeit-massnahmen-3-6-12", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei Ablehnung, Abbruch oder Anlassgeben zum Abbruch einer Eingliederungs- oder Sprachmaßnahme ohne wichtigen Grund beträgt die Sperrzeit drei, sechs oder zwölf Wochen.", sourceKey: "sgb3-159", passageKey: "sgb3-159-4-9", riskLevel: "high" },
  { key: "sperrzeit-meldeversaeumnis-1-week", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei Meldeversäumnis ohne wichtigen Grund beträgt die Sperrzeit eine Woche.", sourceKey: "sgb3-159", passageKey: "sgb3-159-4-9", riskLevel: "high" },
  { key: "sperrzeit-late-arbeitsuchend-1-week", category: "sperrzeit", temporal: "current_2026", type: "definition", text: "Bei verspäteter Arbeitsuchendmeldung ohne wichtigen Grund beträgt die Sperrzeit eine Woche.", sourceKey: "sgb3-159", passageKey: "sgb3-159-4-9", riskLevel: "high" },
  { key: "wichtiger-grund-blocks-sperrzeit", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Eine Sperrzeit unterbleibt, wenn ein wichtiger Grund für das versicherungswidrige Verhalten dargelegt und nachgewiesen wird.", sourceKey: "sgb3-159", passageKey: "sgb3-159-grund", riskLevel: "high" },
  { key: "anhoerung-not-sperrzeitbescheid", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Eine Anhörung der Agentur für Arbeit ist nicht derselbe Verwaltungsakt wie ein Sperrzeitbescheid. Aus dem Anhörungsschreiben darf keine feststehende Sperrzeit abgeleitet werden.", sourceKey: "sgb10-24", passageKey: "sgb10-24-all", riskLevel: "high" },
  { key: "eigenkuendigung-not-automatic-sperrzeit", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Eine Eigenkündigung bedeutet nicht automatisch eine Sperrzeit. Es kommt auf den wichtigen Grund und den Sperrzeitbescheid an.", sourceKey: "sgb3-159", passageKey: "sgb3-159-1-3", riskLevel: "high" },
  { key: "aufhebung-not-automatic-sperrzeit", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Ein Aufhebungsvertrag bedeutet nicht automatisch eine Sperrzeit. Maßgebend sind wichtiger Grund und der feststellende Verwaltungsakt der Agentur.", sourceKey: "sgb3-159", passageKey: "sgb3-159-grund", riskLevel: "high" },
  { key: "missed-appointment-not-total-loss", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Ein versäumter Meldetermin bedeutet nicht automatisch das vollständige Ende des Arbeitslosengeldes. Die Sperrzeit wegen Meldeversäumnisses beträgt eine Woche.", sourceKey: "sgb3-159", passageKey: "sgb3-159-4-9", riskLevel: "high" },
  { key: "individual-sperrzeit-fail-closed", category: "sperrzeit", temporal: "current_2026", type: "exception", text: "Eine individuelle Sperrzeit darf ohne den Sperrzeitbescheid der Agentur für Arbeit und die konkreten Tatsachen nicht entschieden werden.", sourceKey: "sgb3-159", passageKey: "sgb3-159-grund", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "ruhe-only-if-early-end", category: "ruhe", temporal: "current_2026", type: "definition", text: "Ruhen wegen Abfindung tritt nur ein, wenn das Arbeitsverhältnis ohne Einhaltung der ordentlichen Kündigungsfrist des Arbeitgebers beendet worden ist.", sourceKey: "sgb3-158", passageKey: "sgb3-158-all", riskLevel: "high" },
  { key: "ruhe-max-one-year", category: "ruhe", temporal: "current_2026", type: "definition", text: "Das Ruhen des Arbeitslosengeldes wegen Entlassungsentschädigung gilt längstens für ein Jahr.", sourceKey: "sgb3-158", passageKey: "sgb3-158-all", riskLevel: "medium" },
  { key: "ruhe-not-sperrzeit", category: "ruhe", temporal: "current_2026", type: "exception", text: "Das Ruhen des Arbeitslosengeldes wegen Abfindung ist nicht dasselbe wie eine Sperrzeit. Ruhen verschiebt den Leistungsbeginn, Sperrzeit sanktioniert versicherungswidriges Verhalten.", sourceKey: "sgb3-158", passageKey: "sgb3-158-all", riskLevel: "high" },
  { key: "abfindung-not-automatic-sperrzeit", category: "ruhe", temporal: "current_2026", type: "exception", text: "Eine Abfindung bedeutet keine automatische Sperrzeit. Sie kann unter den Voraussetzungen des § 158 SGB III zum Ruhen führen.", sourceKey: "sgb3-158", passageKey: "sgb3-158-all", riskLevel: "high" },
  { key: "abfindung-not-automatic-loss", category: "ruhe", temporal: "current_2026", type: "exception", text: "Eine Abfindung bedeutet nicht automatisch den Verlust des Arbeitslosengeldes.", sourceKey: "sgb3-158", passageKey: "sgb3-158-all", riskLevel: "high" },
  { key: "letter-not-automatically-bescheid", category: "bescheid", temporal: "current_2026", type: "exception", text: "Ein gewöhnliches Schreiben der Agentur für Arbeit ist nicht automatisch ein Verwaltungsakt. Maßgebend ist, ob eine Regelung eines Einzelfalls mit unmittelbarer Rechtswirkung nach außen vorliegt.", sourceKey: "sgb10-31", passageKey: "sgb10-31-all", riskLevel: "high" },
  { key: "bekanntgabe-not-document-date", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Das auf einem Schreiben der Agentur gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe. Im Inland gilt die Bekanntgabe durch die Post in der Regel am vierten Tag nach der Aufgabe zur Post.", sourceKey: "sgb10-37", passageKey: "sgb10-37-all", riskLevel: "high" },
  { key: "widerspruch-one-month", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Der Widerspruch gegen einen Verwaltungsakt der Agentur für Arbeit ist binnen eines Monats nach Bekanntgabe schriftlich, elektronisch oder zur Niederschrift einzulegen. Bei Bekanntgabe im Ausland beträgt die Frist drei Monate.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "do-not-auto-recommend-widerspruch", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Die gesetzliche Widerspruchsmöglichkeit ist keine Empfehlung, Widerspruch einzulegen. Ob ein Rechtsbehelf sinnvoll ist, hängt vom konkreten Verwaltungsakt und seinen Gründen ab.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "widerspruch-not-automatic-suspension", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Ein Widerspruch hat nicht automatisch aufschiebende Wirkung. Insbesondere Meldeaufforderungen nach § 309 SGB III und die Aufhebung laufender Leistungen sind sofort vollziehbar.", sourceKey: "sgb3-336a", passageKey: "sgb3-336a-all", riskLevel: "high" },
  { key: "sgb336a-no-suspension-summons", category: "widerspruch", temporal: "current_2026", type: "definition", text: "Nach § 336a SGB III haben Widerspruch und Anfechtungsklage keine aufschiebende Wirkung gegen Aufforderungen zur persönlichen Meldung nach § 309. Für die Aufhebung laufender Leistungen gilt § 86a Absatz 2 Nummer 2 SGG.", sourceKey: "sgb3-336a", passageKey: "sgb3-336a-all", riskLevel: "high" },
  { key: "individualized-deadline-needs-facts", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Eine individuelle Widerspruchsfrist darf ohne Bekanntgabeart, Zugangsvermutung und den konkreten Verwaltungsakt der Agentur nicht aus dem Dokumentdatum allein berechnet werden.", sourceKey: "sgb10-37", passageKey: "sgb10-37-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "widerspruchsbescheid-then-court", category: "widerspruch", temporal: "current_2026", type: "procedure", text: "Bleibt der Widerspruch erfolglos, entscheidet die Agentur für Arbeit durch Widerspruchsbescheid. Dagegen ist die Klage zum Sozialgericht der nächste gesetzliche Rechtsbehelf.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "medium" },
  { key: "overpayment-can-arise", category: "overpayment", temporal: "current_2026", type: "definition", text: "Eine Überzahlung von Arbeitslosengeld kann entstehen, wenn sich Verhältnisse ändern, Angaben unvollständig waren oder ein Verwaltungsakt aufgehoben wird. Die Agentur kann dann Erstattung verlangen.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "high" },
  { key: "not-every-demand-is-correct", category: "overpayment", temporal: "current_2026", type: "exception", text: "Nicht jede Zahlungsaufforderung der Agentur für Arbeit ist deshalb richtig. Zuerst sind Anhörung, Aufhebungsbescheid und die genannten Tatsachen zu prüfen.", sourceKey: "sgb10-31", passageKey: "sgb10-31-all", riskLevel: "high" },
  { key: "not-every-overpayment-must-be-appealed", category: "overpayment", temporal: "current_2026", type: "exception", text: "Nicht jede Überzahlung von Arbeitslosengeld muss automatisch mit Widerspruch angegriffen werden. Ob ein Rechtsbehelf in Betracht kommt, hängt vom konkreten Verwaltungsakt ab.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "repayment-is-va", category: "overpayment", temporal: "current_2026", type: "definition", text: "Die Aufhebung und die Erstattungsforderung der Agentur für Arbeit sind Verwaltungsakte. Ein bloßes Informationsschreiben über eine mögliche Überzahlung ist noch keine bestandskräftige Rückzahlungsentscheidung.", sourceKey: "sgb10-31", passageKey: "sgb10-31-all", riskLevel: "high" },
  { key: "anhoerung-before-adverse", category: "overpayment", temporal: "current_2026", type: "procedure", text: "Bevor die Agentur für Arbeit belastend aufhebt oder Erstattung festsetzt, ist in der Regel anzuhören. Die Anhörung ist nicht bereits der Erstattungsbescheid.", sourceKey: "sgb10-24", passageKey: "sgb10-24-all", riskLevel: "high" },
  { key: "alg-generally-pflichtversichert", category: "health_interface", temporal: "current_2026", type: "definition", text: "Wer Arbeitslosengeld nach dem SGB III bezieht, ist in der Regel nach § 5 Absatz 1 Nummer 2 SGB V in der gesetzlichen Krankenversicherung pflichtversichert.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2", riskLevel: "high" },
  { key: "ba-pays-health-contributions", category: "health_interface", temporal: "current_2026", type: "definition", text: "Während des Bezugs von Arbeitslosengeld trägt in der Regel die Bundesagentur für Arbeit die Beiträge zur gesetzlichen Krankenversicherung.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2", riskLevel: "medium" },
  { key: "health-domain-is-separate", category: "health_interface", temporal: "current_2026", type: "exception", text: "Dieses Paket modelliert nur die gesetzliche Schnittstelle vom Arbeitslosengeld in die Krankenversicherung. Wahl der Krankenkasse, eGK und Krankengeld gehören in das gesonderte Krankenversicherungspaket.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2", riskLevel: "medium" },
  { key: "pd-u1-insurance-periods", category: "cross_border", temporal: "current_2026", type: "definition", text: "Das Portable Document U1 bescheinigt Versicherungszeiten für die Zusammenrechnung beim Arbeitslosengeld nach der Verordnung (EG) Nr. 883/2004.", sourceKey: "ba-fw-ausland", passageKey: "ba-fw-ausland-all", riskLevel: "high" },
  { key: "pd-u2-export-job-search", category: "cross_border", temporal: "current_2026", type: "definition", text: "Das Portable Document U2 ermöglicht den Export von Arbeitslosengeld bei Arbeitsuche in einem anderen Mitgliedstaat nach Artikel 64 der Verordnung (EG) Nr. 883/2004.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "u2-three-months-extend-six", category: "cross_border", temporal: "current_2026", type: "deadline", text: "Beim Export mit PD U2 besteht der Anspruch auf Arbeitslosengeld zunächst für drei Monate und kann auf sechs Monate verlängert werden.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "apply-u2-before-leaving", category: "cross_border", temporal: "current_2026", type: "duty", text: "Der Antrag auf das PD U2 ist vor der Ausreise bei der zuständigen Agentur für Arbeit zu stellen.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "u1-not-u2", category: "cross_border", temporal: "current_2026", type: "exception", text: "Das PD U1 und das PD U2 sind nicht dasselbe Dokument. U1 bescheinigt Versicherungszeiten, U2 den Export von Arbeitslosengeld bei Arbeitsuche im Ausland.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "u2-not-ordinary-travel", category: "cross_border", temporal: "current_2026", type: "exception", text: "Das PD U2 ist nicht dieselbe Genehmigung wie eine inländische Ortsabwesenheit.", sourceKey: "ba-fw-u2", passageKey: "ba-fw-u2-all", riskLevel: "high" },
  { key: "nationality-not-automatic", category: "cross_border", temporal: "current_2026", type: "exception", text: "Die Staatsangehörigkeit begründet nicht automatisch einen Anspruch auf Arbeitslosengeld und entscheidet nicht allein den zuständigen Leistungsstaat.", sourceKey: "ba-fw-ausland", passageKey: "ba-fw-ausland-all", riskLevel: "high" },
  { key: "foreign-nationality-not-exclusion", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine ausländische Staatsangehörigkeit ist vom Arbeitslosengeld nicht automatisch ausgeschlossen. Maßgebend sind Versicherungszeiten, Arbeitslosigkeit und die zuständige Rechtsordnung.", sourceKey: "ba-fw-ausland", passageKey: "ba-fw-ausland-all", riskLevel: "high" },
  { key: "german-residence-not-eu-competence", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein Wohnsitz in Deutschland bestimmt nicht automatisch den zuständigen Leistungsstaat für das Arbeitslosengeld.", sourceKey: "eurlex-883-2004", passageKey: "eurlex-u2-art64", riskLevel: "high" },
  { key: "foreign-residence-not-noncompetence", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein Wohnsitz im Ausland bedeutet nicht automatisch, dass Deutschland nicht zuständig für das Arbeitslosengeld ist.", sourceKey: "eurlex-883-2004", passageKey: "eurlex-u2-art64", riskLevel: "high" },
  { key: "cross-border-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein grenzüberschreitender Arbeitslosenfall darf nicht vereinfacht entschieden werden. Wohnsitz, Staatsangehörigkeit oder Sprache allein ersetzen nicht die erforderlichen Zuständigkeits- und Versicherungsmerkmale.", sourceKey: "ba-fw-ausland", passageKey: "ba-fw-ausland-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "COUNTRY"] },
  { key: "grenzgaenger-competence-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Die Zuständigkeit für Grenzgängerinnen und Grenzgänger beim Arbeitslosengeld darf ohne Wohn- und Beschäftigungsstaat nicht vereinfacht entschieden werden.", sourceKey: "ba-fw-ausland", passageKey: "ba-fw-ausland-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE"] },
  { key: "competence-by-wohnsitz", category: "competence", temporal: "current_2026", type: "definition", text: "Zuständig für das Arbeitslosengeld ist die Agentur für Arbeit, in deren Bezirk die oder der Arbeitslose bei Eintritt der Arbeitslosigkeit den Wohnsitz hat.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high" },
  { key: "competence-else-gewoehnlicher-aufenthalt", category: "competence", temporal: "current_2026", type: "definition", text: "Fehlt ein Wohnsitz, ist für das Arbeitslosengeld der gewöhnliche Aufenthalt maßgebend.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, die Sprache der Oberfläche oder die Sprache eines Schreibens bestimmen weder die zuständige Agentur für Arbeit noch den Anspruch auf Arbeitslosengeld.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high" },
  { key: "language-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "Die Dokumentsprache bestimmt nicht die zuständige Agentur für Arbeit und nicht den Anspruch auf Arbeitslosengeld.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high" },
  { key: "find-agentur-via-dienststellensuche", category: "competence", temporal: "current_2026", type: "procedure", text: "Die zuständige Agentur für Arbeit ist über die Dienststellensuche der Bundesagentur für Arbeit anhand des Wohnsitzes oder gewöhnlichen Aufenthalts zu ermitteln, nicht anhand der Sprache.", sourceKey: "ba-vor-ort", passageKey: "ba-finder-all", riskLevel: "medium" },
  { key: "opening-hours-are-live", category: "competence", temporal: "current_2026", type: "procedure", text: "Öffnungszeiten und aktuelle Kontaktdaten der örtlichen Agentur für Arbeit sind live zu prüfen und keine kanonische Bundeskonstante.", sourceKey: "ba-vor-ort", passageKey: "ba-finder-all", riskLevel: "medium" },
  { key: "no-hardcoded-local-agentur", category: "competence", temporal: "current_2026", type: "exception", text: "Im Bundeskern darf keine bestimmte örtliche Agentur für Arbeit als bundesweit zuständige Stelle festgeschrieben werden.", sourceKey: "ba-vor-ort", passageKey: "ba-finder-all", riskLevel: "high" },
  { key: "land-alone-not-enough", category: "competence", temporal: "current_2026", type: "exception", text: "Das Bundesland allein bestimmt nicht die zuständige Agentur für Arbeit. Erforderlich ist der Wohnsitz oder gewöhnliche Aufenthalt in einem konkreten örtlichen Zuständigkeitsbereich.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high" },
  { key: "insufficient-facts-no-agentur", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne Wohnsitz oder gewöhnlichen Aufenthalt darf keine bestimmte Agentur für Arbeit benannt werden.", sourceKey: "sgb3-327", passageKey: "sgb3-327-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
]);

export type AlgProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

export type AlgFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

export type AlgBindingSpec = Readonly<{
  processKey: string;
  role: AlgProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  required?: boolean;
  qualificationRequired?: boolean;
}>;

export type AlgProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: AlgScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const ALG_PROCESSES: readonly AlgProcessSpec[] = Object.freeze([
  { key: "employment-will-end", title: "Arbeitsuchendmeldung vor dem Beschäftigungsende 2026", trigger: "Ein Arbeits- oder Ausbildungsverhältnis endet oder eine Kündigung liegt vor", safeFirstStep: "Die Arbeitsuchendmeldung drei Monate vorher oder innerhalb von drei Tagen nach späterer Kenntnis erstatten und Kündigungswirksamkeit nicht in diesem Paket entscheiden.", riskLevel: "high" },
  { key: "arbeitslosmeldung", title: "Arbeitslosmeldung bei der Agentur 2026", trigger: "Arbeitslosigkeit steht bevor oder ist eingetreten", safeFirstStep: "Sich persönlich oder elektronisch arbeitslos melden, spätestens am ersten Tag der Arbeitslosigkeit, und die Arbeitsuchendmeldung nicht als Ersatz behandeln.", riskLevel: "high" },
  { key: "alg-application", title: "Antrag auf Arbeitslosengeld 2026", trigger: "Arbeitslosengeld soll beantragt oder vorbereitet werden", safeFirstStep: "Die Antragswirkung der Arbeitslosmeldung erklären, Unterlagen vorbereiten und die Arbeitsbescheinigung über BEA nicht als Papierpflicht beim Arbeitgeber darstellen.", riskLevel: "high" },
  { key: "entitlement-orientation", title: "Anspruchsvoraussetzungen Arbeitslosengeld 2026", trigger: "Gefragt ist, ob ein Anspruch auf Arbeitslosengeld besteht", safeFirstStep: "Arbeitslosigkeit, Arbeitslosmeldung und Anwartschaft erklären; Arbeit in Deutschland oder Alltagssprachliche Arbeitslosigkeit nicht als Automatikanspruch behandeln.", riskLevel: "high" },
  { key: "benefit-calculation-duration", title: "Höhe und Dauer ohne Einzelbetrag 2026", trigger: "Höhe oder Dauer des Arbeitslosengeldes ist gefragt", safeFirstStep: "60/67 Prozent des pauschalierten Leistungsentgelts und die Dauertabelle als Struktur erklären; keinen individuellen Betrag oder keine individuelle Dauer erfinden.", riskLevel: "high" },
  { key: "decision-payment", title: "Bescheid und monatliche Nachzahlung 2026", trigger: "Ein Bewilligungsbescheid oder die Auszahlung ist angesprochen", safeFirstStep: "Den Bescheid lesen und erklären, dass Arbeitslosengeld monatlich nachträglich zum Monatsende gezahlt wird.", riskLevel: "medium" },
  { key: "nebenjob", title: "Nebeneinkommen während des Arbeitslosengeldes 2026", trigger: "Ein Nebenjob, Minijob oder eine Selbstständigkeit während des Bezugs ist angesprochen", safeFirstStep: "165-Euro-Freibetrag und Stundengrenze trennen; einen Nebenjob nicht als automatisches Leistungsende behandeln.", riskLevel: "high" },
  { key: "change-report", title: "Veränderungsmitteilung während des Arbeitslosengeldes 2026", trigger: "Nebenverdienst, Stunden, Krankheit, Anschrift oder Bankverbindung ändern sich", safeFirstStep: "Die Änderung unverzüglich der Agentur mitteilen und nicht annehmen, dass jede Änderung das Arbeitslosengeld sofort beendet.", riskLevel: "high" },
  { key: "availability-travel", title: "Verfügbarkeit und Ortsabwesenheit 2026", trigger: "Reise, Urlaub oder Ortsabwesenheit während des Arbeitslosengeldes ist angesprochen", safeFirstStep: "Vorher mit der Agentur abstimmen; Ortsabwesenheit nicht mit gesetzlichem Erholungsurlaub und nicht mit PD U2 verwechseln.", riskLevel: "high" },
  { key: "illness-during-alg", title: "Krankheit während des Arbeitslosengeldes 2026", trigger: "Arbeitsunfähigkeit während des Bezugs ist angesprochen", safeFirstStep: "Die Fortzahlung bis zu sechs Wochen erklären und weder sofortiges Ende noch Krankengeld ab dem ersten Tag annehmen.", riskLevel: "high" },
  { key: "sperrzeit", title: "Sperrzeit nach § 159 SGB III 2026", trigger: "Eigenkündigung, Aufhebungsvertrag, abgelehnte Arbeit, versäumter Termin oder verspätete Arbeitsuchendmeldung ist angesprochen", safeFirstStep: "Kategorien und wichtigen Grund erklären; Anhörung und Sperrzeitbescheid trennen und keine automatische Sperrzeit aus Eigenkündigung oder Aufhebung ableiten.", riskLevel: "high" },
  { key: "ruhe-abfindung", title: "Ruhen wegen Abfindung 2026", trigger: "Eine Abfindung oder Entlassungsentschädigung ist angesprochen", safeFirstStep: "Ruhen und Sperrzeit trennen; Abfindung nicht als automatische Sperrzeit und nicht als automatischen Verlust behandeln.", riskLevel: "high" },
  { key: "widerspruch-foundation", title: "Widerspruch gegen einen Agentur-Verwaltungsakt 2026", trigger: "Gegen eine Entscheidung der Agentur für Arbeit soll ein Widerspruch geprüft werden", safeFirstStep: "Nur bei Verwaltungsakt und Bekanntgabe fortfahren; das Briefdatum nicht als Fristbeginn verwenden und keine automatische Widerspruchsempfehlung geben.", riskLevel: "high" },
  { key: "overpayment-repayment", title: "Überzahlung und Erstattung von Arbeitslosengeld 2026", trigger: "Eine Rückzahlung, Aufhebung oder Erstattungsforderung der Agentur ist angesprochen", safeFirstStep: "Anhörung und Erstattungsbescheid unterscheiden; nicht jede Forderung als richtig und nicht jede Überzahlung als Widerspruchsfall behandeln.", riskLevel: "high" },
  { key: "sgb2-health-interface", title: "Schnittstelle Arbeitslosengeld, Grundsicherung und Krankenversicherung 2026", trigger: "Jobcenter, Grundsicherungsgeld oder Krankenversicherung während des Arbeitslosengeldes ist angesprochen", safeFirstStep: "Agentur und Jobcenter sowie ALG und Grundsicherungsgeld trennen; nur die gesetzliche GKV-Schnittstelle erklären und das Krankenversicherungspaket nicht verdoppeln.", riskLevel: "high" },
  { key: "cross-border-eu", title: "Grenzüberschreitendes Arbeitslosengeld und PD U1/U2 2026", trigger: "Auslandszeiten, Grenzgänger, PD U1, PD U2 oder Arbeitsuche im EU-Ausland sind angesprochen", safeFirstStep: "U1 und U2 trennen, U2 vor der Ausreise beantragen und ohne Wohn- und Beschäftigungsstaat fail-closed bleiben.", riskLevel: "high" },
  { key: "competent-agentur-resolution", title: "Zuständige Agentur für Arbeit klären 2026", trigger: "Die zuständige Agentur, eine lokale Hotline oder Öffnungszeiten sollen benannt werden", safeFirstStep: "Wohnsitz oder gewöhnlichen Aufenthalt feststellen und die Dienststellensuche nutzen; Sprache, userLocale oder Bundesland allein nicht als Zuständigkeit behandeln.", riskLevel: "high" },
]);

export const ALG_FORMS: readonly AlgFormSpec[] = Object.freeze([
  { key: "alg-arbeitsuchendmeldung", name: "Arbeitsuchendmeldung", identifier: "ALG-Arbeitsuchendmeldung", purpose: "Frühzeitige Meldung der Arbeitsuche bei der Agentur für Arbeit vor dem Beschäftigungsende", submissionChannels: ["online", "in_person"], sourceKey: "ba-arbeitsuchend", passageKey: "ba-as-all" },
  { key: "alg-arbeitslosmeldung", name: "Arbeitslosmeldung", identifier: "ALG-Arbeitslosmeldung", purpose: "Persönliche oder elektronische Arbeitslosmeldung als Voraussetzung für Arbeitslosengeld", submissionChannels: ["online", "in_person"], sourceKey: "ba-arbeitslos", passageKey: "ba-al-all" },
  { key: "alg-antrag", name: "Antrag auf Arbeitslosengeld", identifier: "ALG-Antrag", purpose: "Dokumentierter Antrag auf Arbeitslosengeld, der mit der Arbeitslosmeldung grundsätzlich als gestellt gilt", submissionChannels: ["online", "in_person", "written"], sourceKey: "sgb3-323", passageKey: "sgb3-323-all" },
  { key: "alg-change", name: "Veränderungsmitteilung Arbeitslosengeld", identifier: "ALG-Veraenderungsmitteilung", purpose: "Unverzügliche Mitteilung leistungserheblicher Änderungen während des Bezugs", submissionChannels: ["online", "in_person", "written"], sourceKey: "sgb1-60", passageKey: "sgb1-60-all" },
  { key: "sgg-widerspruch", name: "Widerspruch gegen einen Verwaltungsakt der Agentur für Arbeit", identifier: "SGG-Widerspruch", purpose: "Einlegung des Widerspruchs bei der erlassenden Stelle in der gesetzlich zulässigen Form", submissionChannels: ["written_or_electronic_or_niederschrift"], sourceKey: "sgg-84", passageKey: "sgg-84-1" },
]);

export const ALG_PROCESS_BINDINGS: readonly AlgBindingSpec[] = Object.freeze([
  { processKey: "employment-will-end", role: "deadline_gate", sequenceContext: "frist", claimKeys: ["arbeitsuchend-three-months-before", "arbeitsuchend-three-days-if-later", "late-arbeitsuchend-sperrzeit-one-week"] },
  { processKey: "employment-will-end", role: "application_route", sequenceContext: "how", claimKeys: ["arbeitsuchend-independent-of-court", "first-counseling-after-registration"] },
  { processKey: "employment-will-end", role: "negative_control", sequenceContext: "not", claimKeys: ["arbeitsuchend-not-arbeitslos", "kuendigung-validity-not-decided"] },
  { processKey: "arbeitslosmeldung", role: "application_route", sequenceContext: "how", claimKeys: ["arbeitslos-electronic-or-personal", "arbeitslos-up-to-three-months-before", "arbeitslos-latest-first-day", "arbeitslos-next-open-day-backdates"] },
  { processKey: "arbeitslosmeldung", role: "negative_control", sequenceContext: "not", claimKeys: ["arbeitsuchend-does-not-replace-arbeitslos", "arbeitslos-not-automatic-approval", "arbeitsuchend-not-arbeitslos"] },
  { processKey: "alg-application", role: "application_route", sequenceContext: "antrag", claimKeys: ["alg-gilt-mit-meldung-als-beantragt", "still-need-application-documents", "application-online-two-weeks-ok", "application-not-same-as-meldung"] },
  { processKey: "alg-application", role: "evidence_requirement", sequenceContext: "docs", claimKeys: ["employer-must-certify", "bea-electronic-since-2023", "do-not-require-paper-from-employer", "missing-certificate-can-delay"] },
  { processKey: "entitlement-orientation", role: "orientation_basis", sequenceContext: "what", claimKeys: ["alg-is-sgb3-leistung", "sgb3-not-sgb2", "entitlement-three-conditions", "beschaeftigungslosigkeit-definition", "eigenbemuehungen-required", "verfuegbarkeit-required", "under-15-hours-not-destroy", "multiple-jobs-aggregated", "fifteen-hours-not-income-test", "anwartschaft-12-in-30", "shortened-6-months-short-fixed"] },
  { processKey: "entitlement-orientation", role: "negative_control", sequenceContext: "not", claimKeys: ["agentur-not-jobcenter", "alg-not-grundsicherungsgeld", "everyday-unemployed-not-statutory", "no-full-time-not-automatic-arbeitslos", "worked-germany-not-automatic"] },
  { processKey: "benefit-calculation-duration", role: "orientation_basis", sequenceContext: "structure", claimKeys: ["sixty-percent-general", "sixty-seven-with-child", "bemessungszeitraum-one-year", "bemessungsrahmen-expandable-two", "duration-table-6-to-24", "shortened-anwartschaft-3-to-5", "twenty-one-weeks-extinguish-claim", "four-year-claim-use-boundary"] },
  { processKey: "benefit-calculation-duration", role: "negative_control", sequenceContext: "not", claimKeys: ["last-salary-not-alg-amount", "sixty-not-last-net", "twelve-months-employed-not-twelve-alg", "individual-amount-fail-closed", "individual-duration-fail-closed"] },
  { processKey: "decision-payment", role: "payment", sequenceContext: "zahlung", claimKeys: ["payment-monthly-in-arrears"] },
  { processKey: "decision-payment", role: "decision", sequenceContext: "bescheid", claimKeys: ["inspect-bescheid-parts", "letter-not-automatically-bescheid"] },
  { processKey: "nebenjob", role: "orientation_basis", sequenceContext: "neben", claimKeys: ["nebenjob-165-euro-freibetrag", "nebenjob-hours-test-separate", "existing-12-of-18-side-job", "self-employed-30-percent-expenses"] },
  { processKey: "nebenjob", role: "negative_control", sequenceContext: "neben_not", claimKeys: ["nebenjob-not-automatic-end", "low-income-not-hours"] },
  { processKey: "change-report", role: "application_route", sequenceContext: "melden", claimKeys: ["change-report-unverzueglich", "non-report-can-cause-repayment"] },
  { processKey: "change-report", role: "negative_control", sequenceContext: "arbeit_not", claimKeys: ["nebenjob-not-automatic-end"] },
  { processKey: "availability-travel", role: "orientation_basis", sequenceContext: "reise", claimKeys: ["travel-needs-aa-coordination", "verfuegbarkeit-required"] },
  { processKey: "availability-travel", role: "negative_control", sequenceContext: "reise_not", claimKeys: ["travel-not-employee-urlaub", "alg-recipient-not-employee-holiday", "domestic-absence-not-u2"] },
  { processKey: "illness-during-alg", role: "orientation_basis", sequenceContext: "krankheit", claimKeys: ["illness-alg-up-to-six-weeks", "then-krankengeld-interface"] },
  { processKey: "illness-during-alg", role: "negative_control", sequenceContext: "krankheit_not", claimKeys: ["illness-not-immediate-end", "six-weeks-not-day-one-krankengeld"] },
  { processKey: "sperrzeit", role: "orientation_basis", sequenceContext: "sperrzeit", claimKeys: ["sperrzeit-aufgabe-12-weeks", "sperrzeit-aufgabe-shorten-3-6", "sperrzeit-ablehnung-3-6-12", "sperrzeit-eigenbemuehungen-2-weeks", "sperrzeit-massnahmen-3-6-12", "sperrzeit-meldeversaeumnis-1-week", "sperrzeit-late-arbeitsuchend-1-week", "wichtiger-grund-blocks-sperrzeit", "late-arbeitsuchend-sperrzeit-one-week"] },
  { processKey: "sperrzeit", role: "negative_control", sequenceContext: "sperrzeit_not", qualificationRequired: true, claimKeys: ["anhoerung-not-sperrzeitbescheid", "eigenkuendigung-not-automatic-sperrzeit", "aufhebung-not-automatic-sperrzeit", "missed-appointment-not-total-loss", "individual-sperrzeit-fail-closed"] },
  { processKey: "ruhe-abfindung", role: "orientation_basis", sequenceContext: "ruhe", claimKeys: ["ruhe-only-if-early-end", "ruhe-max-one-year"] },
  { processKey: "ruhe-abfindung", role: "negative_control", sequenceContext: "ruhe_not", claimKeys: ["ruhe-not-sperrzeit", "abfindung-not-automatic-sperrzeit", "abfindung-not-automatic-loss"] },
  { processKey: "widerspruch-foundation", role: "legal_remedy_gate", sequenceContext: "widerspruch_gate", qualificationRequired: true, claimKeys: ["widerspruch-one-month", "do-not-auto-recommend-widerspruch", "widerspruch-not-automatic-suspension", "sgb336a-no-suspension-summons"] },
  { processKey: "widerspruch-foundation", role: "deadline_gate", sequenceContext: "frist", qualificationRequired: true, claimKeys: ["bekanntgabe-not-document-date", "individualized-deadline-needs-facts", "widerspruchsbescheid-then-court"] },
  { processKey: "widerspruch-foundation", role: "negative_control", sequenceContext: "lesen_not", claimKeys: ["letter-not-automatically-bescheid", "inspect-bescheid-parts"] },
  { processKey: "overpayment-repayment", role: "orientation_basis", sequenceContext: "erstattung", claimKeys: ["overpayment-can-arise", "repayment-is-va", "anhoerung-before-adverse"] },
  { processKey: "overpayment-repayment", role: "negative_control", sequenceContext: "erstattung_not", claimKeys: ["not-every-demand-is-correct", "not-every-overpayment-must-be-appealed"] },
  { processKey: "sgb2-health-interface", role: "orientation_basis", sequenceContext: "kv", claimKeys: ["alg-generally-pflichtversichert", "ba-pays-health-contributions"] },
  { processKey: "sgb2-health-interface", role: "negative_control", sequenceContext: "kv_not", claimKeys: ["health-domain-is-separate", "agentur-not-jobcenter", "alg-not-grundsicherungsgeld"] },
  { processKey: "cross-border-eu", role: "orientation_basis", sequenceContext: "eu", claimKeys: ["pd-u1-insurance-periods", "pd-u2-export-job-search", "u2-three-months-extend-six", "apply-u2-before-leaving"] },
  { processKey: "cross-border-eu", role: "context_gate", sequenceContext: "status", qualificationRequired: true, claimKeys: ["u1-not-u2", "u2-not-ordinary-travel", "nationality-not-automatic", "foreign-nationality-not-exclusion", "german-residence-not-eu-competence", "foreign-residence-not-noncompetence", "cross-border-fail-closed", "grenzgaenger-competence-fail-closed"] },
  { processKey: "competent-agentur-resolution", role: "orientation_basis", sequenceContext: "zustaendigkeit", claimKeys: ["competence-by-wohnsitz", "competence-else-gewoehnlicher-aufenthalt", "find-agentur-via-dienststellensuche"] },
  { processKey: "competent-agentur-resolution", role: "negative_control", sequenceContext: "zustaendigkeit_not", qualificationRequired: true, claimKeys: ["userlocale-not-jurisdiction", "language-not-jurisdiction", "land-alone-not-enough", "no-hardcoded-local-agentur", "opening-hours-are-live", "insufficient-facts-no-agentur"] },
]);

export const ALG_PROCESS_SCENARIOS: readonly AlgProcessScenario[] = Object.freeze([
  { id: "what-is-alg", label: "Was Arbeitslosengeld ist", coverage: "COVERED", requiredClaimKeys: ["alg-is-sgb3-leistung", "sgb3-not-sgb2"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "agentur-vs-jobcenter", label: "Agentur ist nicht das Jobcenter", coverage: "COVERED", requiredClaimKeys: ["agentur-not-jobcenter"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "alg-vs-gsg", label: "Arbeitslosengeld ist nicht Grundsicherungsgeld", coverage: "COVERED", requiredClaimKeys: ["alg-not-grundsicherungsgeld"], requiredProcessKeys: ["sgb2-health-interface"] },
  { id: "arbeitsuchend-timing", label: "Frist der Arbeitsuchendmeldung", coverage: "COVERED", requiredClaimKeys: ["arbeitsuchend-three-months-before", "arbeitsuchend-three-days-if-later"], requiredProcessKeys: ["employment-will-end"], requiredFormIdentifiers: ["ALG-Arbeitsuchendmeldung"] },
  { id: "arbeitsuchend-not-arbeitslos", label: "Arbeitsuchend ist nicht Arbeitslosmeldung", coverage: "COVERED", requiredClaimKeys: ["arbeitsuchend-not-arbeitslos"], requiredProcessKeys: ["employment-will-end"] },
  { id: "late-arbeitsuchend", label: "Verspätete Arbeitsuchendmeldung", coverage: "COVERED", requiredClaimKeys: ["late-arbeitsuchend-sperrzeit-one-week"], requiredProcessKeys: ["employment-will-end", "sperrzeit"] },
  { id: "arbeitslos-channels", label: "Wege der Arbeitslosmeldung", coverage: "COVERED", requiredClaimKeys: ["arbeitslos-electronic-or-personal", "arbeitslos-up-to-three-months-before"], requiredProcessKeys: ["arbeitslosmeldung"], requiredFormIdentifiers: ["ALG-Arbeitslosmeldung"] },
  { id: "arbeitslos-timing", label: "Spätester Tag der Arbeitslosmeldung", coverage: "COVERED", requiredClaimKeys: ["arbeitslos-latest-first-day", "arbeitslos-next-open-day-backdates"], requiredProcessKeys: ["arbeitslosmeldung"] },
  { id: "arbeitsuchend-does-not-replace", label: "Arbeitsuchend ersetzt Arbeitslosmeldung nicht", coverage: "COVERED", requiredClaimKeys: ["arbeitsuchend-does-not-replace-arbeitslos"], requiredProcessKeys: ["arbeitslosmeldung"] },
  { id: "arbeitslos-not-approval", label: "Arbeitslosmeldung ist keine automatische Bewilligung", coverage: "COVERED", requiredClaimKeys: ["arbeitslos-not-automatic-approval"], requiredProcessKeys: ["arbeitslosmeldung"] },
  { id: "application-vs-meldung", label: "Antrag ist nicht dieselbe Handlung wie die Meldung", coverage: "COVERED", requiredClaimKeys: ["application-not-same-as-meldung", "alg-gilt-mit-meldung-als-beantragt"], requiredProcessKeys: ["alg-application"], requiredFormIdentifiers: ["ALG-Antrag"] },
  { id: "bea-certificate", label: "Elektronische Arbeitsbescheinigung", coverage: "COVERED", requiredClaimKeys: ["employer-must-certify", "bea-electronic-since-2023", "do-not-require-paper-from-employer"], requiredProcessKeys: ["alg-application"] },
  { id: "entitlement-three", label: "Drei Anspruchsvoraussetzungen", coverage: "COVERED", requiredClaimKeys: ["entitlement-three-conditions"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "fifteen-hours", label: "Stundengrenze unter 15 Stunden", coverage: "COVERED", requiredClaimKeys: ["under-15-hours-not-destroy", "fifteen-hours-not-income-test", "multiple-jobs-aggregated"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "everyday-unemployed", label: "Alltagssprachliche Arbeitslosigkeit", coverage: "COVERED", requiredClaimKeys: ["everyday-unemployed-not-statutory", "no-full-time-not-automatic-arbeitslos"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "anwartschaft", label: "Anwartschaft zwölf in dreißig", coverage: "COVERED", requiredClaimKeys: ["anwartschaft-12-in-30", "shortened-6-months-short-fixed"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "worked-germany", label: "Arbeit in Deutschland nicht automatisch Anspruch", coverage: "COVERED", requiredClaimKeys: ["worked-germany-not-automatic"], requiredProcessKeys: ["entitlement-orientation"] },
  { id: "twelve-not-twelve", label: "Zwölf Monate Beschäftigung nicht zwölf Monate ALG", coverage: "COVERED", requiredClaimKeys: ["twelve-months-employed-not-twelve-alg"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "amount-60-67", label: "Leistungssatz 60 oder 67 Prozent", coverage: "COVERED", requiredClaimKeys: ["sixty-percent-general", "sixty-seven-with-child"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "last-salary-not-amount", label: "Letztes Nettogehalt ist nicht der Betrag", coverage: "COVERED", requiredClaimKeys: ["last-salary-not-alg-amount", "sixty-not-last-net"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "individual-amount", label: "Individueller Betrag fail-closed", coverage: "COVERED", requiredClaimKeys: ["individual-amount-fail-closed"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "duration-table", label: "Dauertabelle sechs bis 24 Monate", coverage: "COVERED", requiredClaimKeys: ["duration-table-6-to-24", "shortened-anwartschaft-3-to-5"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "individual-duration", label: "Individuelle Dauer fail-closed", coverage: "COVERED", requiredClaimKeys: ["individual-duration-fail-closed"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "claim-extinguish", label: "Erlöschen nach 21 Wochen und Vierjahresgrenze", coverage: "COVERED", requiredClaimKeys: ["twenty-one-weeks-extinguish-claim", "four-year-claim-use-boundary"], requiredProcessKeys: ["benefit-calculation-duration"] },
  { id: "payment-arrears", label: "Monatliche Nachzahlung zum Monatsende", coverage: "COVERED", requiredClaimKeys: ["payment-monthly-in-arrears"], requiredProcessKeys: ["decision-payment"] },
  { id: "nebenjob-165", label: "Nebeneinkommen 165 Euro", coverage: "COVERED", requiredClaimKeys: ["nebenjob-165-euro-freibetrag", "nebenjob-hours-test-separate"], requiredProcessKeys: ["nebenjob"] },
  { id: "nebenjob-not-end", label: "Nebenjob nicht automatisches Ende", coverage: "COVERED", requiredClaimKeys: ["nebenjob-not-automatic-end", "low-income-not-hours"], requiredProcessKeys: ["nebenjob"] },
  { id: "change-report-process", label: "Veränderungsmitteilung", coverage: "COVERED", requiredClaimKeys: ["change-report-unverzueglich", "non-report-can-cause-repayment"], requiredProcessKeys: ["change-report"], requiredFormIdentifiers: ["ALG-Veraenderungsmitteilung"] },
  { id: "travel-not-urlaub", label: "Ortsabwesenheit ist kein Erholungsurlaub", coverage: "COVERED", requiredClaimKeys: ["travel-not-employee-urlaub", "travel-needs-aa-coordination"], requiredProcessKeys: ["availability-travel"] },
  { id: "domestic-not-u2", label: "Inländische Abwesenheit ist nicht PD U2", coverage: "COVERED", requiredClaimKeys: ["domestic-absence-not-u2"], requiredProcessKeys: ["availability-travel"] },
  { id: "illness-six-weeks", label: "Krankheit bis sechs Wochen ALG", coverage: "COVERED", requiredClaimKeys: ["illness-alg-up-to-six-weeks", "then-krankengeld-interface"], requiredProcessKeys: ["illness-during-alg"] },
  { id: "illness-not-end", label: "Krankheit nicht sofortiges Ende", coverage: "COVERED", requiredClaimKeys: ["illness-not-immediate-end", "six-weeks-not-day-one-krankengeld"], requiredProcessKeys: ["illness-during-alg"] },
  { id: "sperrzeit-categories", label: "Sperrzeitkategorien", coverage: "COVERED", requiredClaimKeys: ["sperrzeit-aufgabe-12-weeks", "sperrzeit-ablehnung-3-6-12", "sperrzeit-meldeversaeumnis-1-week"], requiredProcessKeys: ["sperrzeit"] },
  { id: "eigenkuendigung", label: "Eigenkündigung nicht automatisch Sperrzeit", coverage: "COVERED", requiredClaimKeys: ["eigenkuendigung-not-automatic-sperrzeit"], requiredProcessKeys: ["sperrzeit"] },
  { id: "aufhebung", label: "Aufhebungsvertrag nicht automatisch Sperrzeit", coverage: "COVERED", requiredClaimKeys: ["aufhebung-not-automatic-sperrzeit"], requiredProcessKeys: ["sperrzeit"] },
  { id: "anhoerung-not-bescheid", label: "Anhörung ist kein Sperrzeitbescheid", coverage: "COVERED", requiredClaimKeys: ["anhoerung-not-sperrzeitbescheid"], requiredProcessKeys: ["sperrzeit"] },
  { id: "missed-not-total", label: "Versäumter Termin nicht Totalverlust", coverage: "COVERED", requiredClaimKeys: ["missed-appointment-not-total-loss"], requiredProcessKeys: ["sperrzeit"] },
  { id: "ruhe-not-sperrzeit", label: "Ruhen ist nicht Sperrzeit", coverage: "COVERED", requiredClaimKeys: ["ruhe-not-sperrzeit", "ruhe-only-if-early-end"], requiredProcessKeys: ["ruhe-abfindung"] },
  { id: "abfindung-not-sperrzeit", label: "Abfindung keine automatische Sperrzeit", coverage: "COVERED", requiredClaimKeys: ["abfindung-not-automatic-sperrzeit", "abfindung-not-automatic-loss"], requiredProcessKeys: ["ruhe-abfindung"] },
  { id: "letter-not-va", label: "Schreiben ist nicht automatisch Verwaltungsakt", coverage: "COVERED", requiredClaimKeys: ["letter-not-automatically-bescheid", "inspect-bescheid-parts"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "widerspruch-gate", label: "Widerspruch nur mit Verwaltungsakt und Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["widerspruch-one-month", "do-not-auto-recommend-widerspruch"], requiredProcessKeys: ["widerspruch-foundation"], requiredFormIdentifiers: ["SGG-Widerspruch"] },
  { id: "bekanntgabe", label: "Bekanntgabe nicht Dokumentdatum", coverage: "COVERED", requiredClaimKeys: ["bekanntgabe-not-document-date", "individualized-deadline-needs-facts"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "no-auto-suspension", label: "Widerspruch ohne automatische aufschiebende Wirkung", coverage: "COVERED", requiredClaimKeys: ["widerspruch-not-automatic-suspension", "sgb336a-no-suspension-summons"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "overpayment", label: "Überzahlung und Erstattung", coverage: "COVERED", requiredClaimKeys: ["overpayment-can-arise", "not-every-demand-is-correct", "not-every-overpayment-must-be-appealed"], requiredProcessKeys: ["overpayment-repayment"] },
  { id: "health-interface", label: "Krankenversicherungsschnittstelle", coverage: "COVERED", requiredClaimKeys: ["alg-generally-pflichtversichert", "health-domain-is-separate"], requiredProcessKeys: ["sgb2-health-interface"] },
  { id: "u1-not-u2", label: "PD U1 ist nicht PD U2", coverage: "COVERED", requiredClaimKeys: ["u1-not-u2", "pd-u1-insurance-periods", "pd-u2-export-job-search"], requiredProcessKeys: ["cross-border-eu"] },
  { id: "u2-export", label: "Export mit PD U2", coverage: "COVERED", requiredClaimKeys: ["u2-three-months-extend-six", "apply-u2-before-leaving", "u2-not-ordinary-travel"], requiredProcessKeys: ["cross-border-eu"] },
  { id: "nationality-gate", label: "Staatsangehörigkeit entscheidet nicht automatisch", coverage: "COVERED", requiredClaimKeys: ["nationality-not-automatic", "foreign-nationality-not-exclusion"], requiredProcessKeys: ["cross-border-eu"] },
  { id: "residence-eu", label: "Wohnsitz entscheidet EU-Zuständigkeit nicht automatisch", coverage: "COVERED", requiredClaimKeys: ["german-residence-not-eu-competence", "foreign-residence-not-noncompetence"], requiredProcessKeys: ["cross-border-eu"] },
  { id: "cross-border-fail", label: "Grenzfall fail-closed", coverage: "COVERED", requiredClaimKeys: ["cross-border-fail-closed", "grenzgaenger-competence-fail-closed"], requiredProcessKeys: ["cross-border-eu"] },
  { id: "competence-wohnsitz", label: "Zuständigkeit nach Wohnsitz", coverage: "COVERED", requiredClaimKeys: ["competence-by-wohnsitz", "find-agentur-via-dienststellensuche"], requiredProcessKeys: ["competent-agentur-resolution"] },
  { id: "userlocale-not-jurisdiction", label: "userLocale bestimmt keine Zuständigkeit", coverage: "COVERED", requiredClaimKeys: ["userlocale-not-jurisdiction", "language-not-jurisdiction"], requiredProcessKeys: ["competent-agentur-resolution"] },
  { id: "land-not-enough", label: "Bundesland allein genügt nicht", coverage: "COVERED", requiredClaimKeys: ["land-alone-not-enough", "insufficient-facts-no-agentur"], requiredProcessKeys: ["competent-agentur-resolution"] },
  { id: "opening-hours-live", label: "Öffnungszeiten live", coverage: "COVERED", requiredClaimKeys: ["opening-hours-are-live", "no-hardcoded-local-agentur"], requiredProcessKeys: ["competent-agentur-resolution"] },
  { id: "wichtiger-grund", label: "Wichtiger Grund gegen Sperrzeit", coverage: "COVERED", requiredClaimKeys: ["wichtiger-grund-blocks-sperrzeit", "individual-sperrzeit-fail-closed"], requiredProcessKeys: ["sperrzeit"] },
  { id: "full-kuendigungsschutz-litigation", label: "Vollständiger Kündigungsschutzprozess", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Wirksamkeit einer Kündigung gehört nicht in das Arbeitslosengeldpaket." },
  { id: "insolvenzgeld", label: "Insolvenzgeld", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Insolvenzgeld ist eine andere Leistung der Arbeitslosenversicherung." },
  { id: "kurzarbeitergeld", label: "Kurzarbeitergeld", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kurzarbeitergeld ist nicht Arbeitslosengeld." },
  { id: "full-rehab-pension-nahtlosigkeit", label: "Vollständige Reha- und Renten-Nahtlosigkeit", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur die Krankheitsfortzahlung bis sechs Wochen; keine Nahtlosigkeitsprüfung." },
  { id: "complete-third-country-treaties", label: "Vollständige Drittstaatsabkommen", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur EU-Koordinierung und Fail-closed-Gate." },
  { id: "individual-alg-calculator", label: "Individueller ALG-Rechner", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Struktur von Satz und Dauer; kein fallbezogener Zahlbetrag." },
  { id: "hardcoded-local-agentur", label: "Festgeschriebene örtliche Agentur", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Zuständigkeit wird über Wohnsitz und Dienststellensuche ermittelt." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "sgg-84", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb10-37", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb3-149", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb3-147", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb3-155", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb3-159", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb3-327", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
]);

export function evaluateAlgProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = ALG_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = ALG_PROCESS_SCENARIOS.map((scenario) => {
    if (scenario.coverage === "OUT_OF_SCOPE") {
      return Object.freeze({
        ...scenario,
        derived: "OUT_OF_SCOPE" as const,
        satisfied: scenario.requiredClaimKeys.length === 0 && scenario.requiredProcessKeys.length === 0,
      });
    }
    if (scenario.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE") {
      return Object.freeze({ ...scenario, derived: "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" as const, satisfied: false });
    }
    const claimsPresent = scenario.requiredClaimKeys.every((key) => claimByKey.has(key) && units.some((unit) => unit.key === key));
    const processesPresent = scenario.requiredProcessKeys.every((key) => processByKey.has(key));
    const formsPresent = (scenario.requiredFormIdentifiers ?? []).every((identifier) => formIds.has(identifier));
    const bound = scenario.requiredProcessKeys.every((processKey) => {
      const process = processByKey.get(processKey);
      return scenario.requiredClaimKeys.some((claimKey) => {
        const claim = claimByKey.get(claimKey);
        return Boolean(process && claim && pack.processClaimLinks.some((link) =>
          link.processId === process.id && link.claimId === claim.id));
      });
    });
    const covered = claimsPresent && processesPresent && formsPresent && bound;
    return Object.freeze({
      ...scenario,
      derived: covered ? "COVERED" as const : "GAP" as const,
      satisfied: covered,
    });
  });
  const coveredScenarioCount = rows.filter((row) => row.derived === "COVERED").length;
  const outOfScopeScenarioCount = rows.filter((row) => row.derived === "OUT_OF_SCOPE").length;
  const blockedScenarioCount = rows.filter((row) =>
    row.derived === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE" || row.derived === "GAP").length;
  return Object.freeze({
    rows,
    processScenarioCount: rows.length,
    coveredScenarioCount,
    outOfScopeScenarioCount,
    blockedScenarioCount,
    processCompletenessPercent: rows.length === 0
      ? 0
      : Math.round((coveredScenarioCount / (rows.length - outOfScopeScenarioCount)) * 100),
  });
}

export function buildAlgFederalCorePack(): CuratedDomainPack {
  const item = factory(ALG_PACK_ID);
  const trustDomain = item("trustDomain", "de", { code: "de", name: "Deutschland" });
  const jurisdiction = item("jurisdictions", "de", {
    level: "de_federal",
    code: "DE",
    countryCode: "DE",
    name: "Deutschland",
  });
  const scope = item("territorialScopes", "de", {
    type: "national",
    jurisdictionIds: [jurisdiction.id],
    landCodes: [],
    kreisCodes: [],
    municipalityCodes: [],
  });
  const publishers = {
    bmj: item("publishers", "bmj-bfj", {
      name: "Bundesministerium der Justiz / Bundesamt für Justiz",
      type: "federal_publication",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bmas: item("publishers", "bmas", {
      name: "Bundesministerium für Arbeit und Soziales",
      type: "federal_ministry",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    ba: item("publishers", "bundesagentur-fuer-arbeit", {
      name: "Bundesagentur für Arbeit",
      type: "federal_employment_agency",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    ba: item("authorities", "bundesagentur-fuer-arbeit", {
      publisherId: publishers.ba.id,
      name: "Bundesagentur für Arbeit",
      type: "federal_employment_agency",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld",
    }),
    bmas: item("authorities", "bundesministerium-arbeit-soziales", {
      publisherId: publishers.bmas.id,
      name: "Bundesministerium für Arbeit und Soziales",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bmas.de",
    }),
  };

  const sources = ALG_OFFICIAL_SOURCES.map((spec) => {
    const publisher = publishers[spec.publisherKey];
    const authority = authorities[spec.authorityKey];
    const source = item("sources", spec.key, {
      publisherId: publisher.id,
      authorityId: authority.id,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      sourceType: spec.sourceType,
      purpose: spec.title,
      canonicalUrl: spec.url,
      officialDomain: spec.officialDomain,
      normalizedOrigin: `https://${spec.officialDomain}`,
      sourceClass: spec.sourceClass,
      authorityLevel: "FEDERAL" as const,
      retrievalMethod: spec.retrievalMethod,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      supportsClaimTypes: ["definition", "duty", "procedure", "deadline", "exception"],
      highRiskUseAllowed: false,
      publicationIdentifier: spec.title,
    });
    const versionText = spec.passages.map((passage) => passage.text).join("\n");
    const version = item("sourceVersions", `${spec.key}:v1`, {
      sourceId: source.id,
      versionSequence: 1,
      contentHash: HASH(versionText),
    });
    const passages = spec.passages.map((passage, order) => item("passages", passage.key, {
      sourceVersionId: version.id,
      order,
      headingPath: [spec.title],
      locator: passage.locator,
      text: passage.text,
      textHash: HASH(passage.text),
    }));
    const policy = item("handlingPolicies", `${spec.key}:policy`, {
      sourceId: source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys,
      riskClass: spec.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" ? "HIGH" : "MEDIUM",
    });
    const freshness = item("freshnessRecords", `${spec.key}:freshness`, {
      entityType: "source",
      entityId: source.id,
      status: "fresh",
      effectiveDateKnown: true,
    });
    return { spec, source, version, passages, policy, freshness };
  });

  const passageByKey = new Map(sources.flatMap(({ passages }) => passages.map((passage) => [passage.key, passage])));
  const sourceByKey = new Map(sources.map((entry) => [entry.spec.key, entry]));

  const claims = ALG_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`ALG_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type,
      text: unit.text,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel,
      requiresEffectiveDate: unit.requiresEffectiveDate === true,
      requiresAuthorityResolution: unit.requiresAuthorityResolution === true,
      temporalClass: unit.temporal,
      category: unit.category,
    });
    const evidence = item("evidenceLinks", `${unit.key}:evidence`, {
      claimId: claim.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      role: "official_guidance",
      primary: true,
    });
    const citation = item("citations", `${unit.key}:citation`, {
      claimId: claim.id,
      sourceId: source.source.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      publisherId: source.source.publisherId,
      jurisdictionId: jurisdiction.id,
      label: source.spec.title,
      canonicalUrl: source.spec.url,
    });
    const claimFreshness = item("freshnessRecords", `${unit.key}:freshness`, {
      entityType: "claim",
      entityId: claim.id,
      status: "fresh",
      effectiveDateKnown: false,
    });
    return { unit, claim, evidence, citation, claimFreshness };
  });

  const extraPolicies = CONTEXT_GATE_POLICIES.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    if (!source) throw new Error(`ALG_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
    return item("handlingPolicies", `${spec.sourceKey}:${spec.informationClass}:context`, {
      sourceId: source.source.id,
      informationClass: spec.informationClass,
      handlingMode: spec.handlingMode,
      freshnessClass: spec.freshnessClass,
      staleBehavior: spec.staleBehavior,
      requiredContextKeys: spec.requiredContextKeys,
      riskClass: spec.riskClass,
    });
  });

  const processes = ALG_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: ALG_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "competent-agentur-resolution" || spec.key === "cross-border-eu",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = ALG_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`ALG_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`ALG_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
      return item("processClaimLinks", `${binding.processKey}:${claimKey}:${binding.role}`, {
        processId: process.id,
        claimId: claim.id,
        role: binding.role,
        required: binding.required !== false,
        sequenceContext: binding.sequenceContext,
        qualificationRequired: binding.qualificationRequired === true,
      });
    });
  });

  const inspectBescheidRule = item("actorRules", "inspect-alg-bescheid-before-widerspruch", {
    actorState: "inspect_alg_bescheid_before_widerspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-agentur-undetermined", {
    actorState: "competent_agentur_undetermined_without_locality",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const deadlineRule = item("actorRules", "individualized-widerspruch-undetermined", {
    actorState: "individualized_widerspruch_deadline_undetermined_without_bekanntgabe_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const crossBorderRule = item("actorRules", "cross-border-unemployment-undetermined", {
    actorState: "cross_border_unemployment_state_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const amountRule = item("actorRules", "individual-alg-amount-undetermined", {
    actorState: "individual_alg_amount_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const sperrzeitRule = item("actorRules", "individual-sperrzeit-undetermined", {
    actorState: "individual_sperrzeit_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = ALG_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`ALG_FORM_SOURCE_MISSING:${spec.key}`);
    return item("forms", spec.key, {
      name: spec.name,
      identifier: spec.identifier,
      authorityId: source.source.authorityId,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      sourceVersionId: source.version.id,
      passageId: passage.id,
      purpose: spec.purpose,
      submissionChannels: spec.submissionChannels,
    });
  });

  return Object.freeze({
    schemaVersion: KNOWLEDGE_FACTORY_SCHEMA_VERSION,
    packId: ALG_PACK_ID,
    domain: ALG_DOMAIN,
    canonicalLanguage: ALG_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmas, publishers.ba],
    authorities: [authorities.ba, authorities.bmas],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectBescheidRule, competenceRule, deadlineRule, crossBorderRule, amountRule, sperrzeitRule],
    processes,
    processClaimLinks,
    forms,
    fees: [],
    handlingPolicies: [...sources.map(({ policy }) => policy), ...extraPolicies],
    freshnessRecords: [
      ...sources.map(({ freshness }) => freshness),
      ...claims.map(({ claimFreshness }) => claimFreshness),
    ],
  });
}

export function algPackSummary(pack: CuratedDomainPack = buildAlgFederalCorePack()) {
  const categories = Object.fromEntries(
    ALG_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<AlgUnitCategory, number>()),
  );
  const completeness = evaluateAlgProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: ALG_UNITS.length,
    futureWatchCount: ALG_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: ALG_G3_PROCESS_STEP_LIMITATION,
    categories,
    processScenarioCount: completeness.processScenarioCount,
    coveredScenarioCount: completeness.coveredScenarioCount,
    outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
    blockedScenarioCount: completeness.blockedScenarioCount,
    processCompletenessPercent: completeness.processCompletenessPercent,
    expectedSemanticCreated:
      1
      + pack.jurisdictions.length
      + pack.territorialScopes.length
      + pack.publishers.length
      + pack.authorities.length
      + pack.sources.length
      + pack.sourceVersions.length
      + pack.passages.length
      + pack.claims.length
      + pack.evidenceLinks.length
      + pack.citations.length
      + pack.actorRules.length
      + pack.processes.length
      + pack.processClaimLinks.length
      + pack.forms.length
      + pack.fees.length
      + pack.handlingPolicies.length
      + pack.freshnessRecords.length,
  });
}
