/**
 * KNOWLEDGE-EXPANSION — Ausländerbehörde / Aufenthalt
 * process-complete federal orientation and lifecycle core.
 * Reuses existing taxonomy identifier
 * auslaenderbehoerde_limited_orientation.
 * Canonical language is German only. Not a runtime route.
 *
 * G3 limitation: knowledge_process_steps are not ingestible via CuratedDomainPack.
 */
import { createHash } from "node:crypto";

import {
  KNOWLEDGE_FACTORY_SCHEMA_VERSION,
  stableKnowledgeFactoryId,
  type CuratedDomainPack,
} from "../../../source-registry/knowledge-factory-contracts";

export const AUFENTHALT_DOMAIN = "auslaenderbehoerde_limited_orientation" as const;
export const AUFENTHALT_PACK_ID = AUFENTHALT_DOMAIN;
export const AUFENTHALT_CANONICAL_LANGUAGE = "de" as const;

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

export const AUFENTHALT_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type AufenthaltUnitCategory =
  | "orientation"
  | "classifier"
  | "gate"
  | "application"
  | "extension"
  | "fiktion"
  | "employment"
  | "study"
  | "skilled"
  | "family"
  | "permanent"
  | "purpose_change"
  | "document"
  | "changes"
  | "absence"
  | "bescheid"
  | "asylum"
  | "visa"
  | "competence"
  | "boundary";

export type AufenthaltContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "COUNTRY";
export type AufenthaltHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type AufenthaltFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type AufenthaltStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type AufenthaltInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE";
export type AufenthaltProcessRole =
  | "orientation_basis"
  | "application_route"
  | "evidence_requirement"
  | "deadline_gate"
  | "next_state"
  | "context_gate"
  | "negative_control";
export type AufenthaltScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export type AufenthaltProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: AufenthaltScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export type AufenthaltFutureChangeWatchItem = Readonly<{
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
  publisherKey: "bmj" | "bmi" | "bund" | "aa" | "bamf";
  authorityKey: "bmi" | "aa" | "bamf";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT";
  informationClass: AufenthaltInformationClass;
  handlingMode: AufenthaltHandlingMode;
  freshnessClass: AufenthaltFreshnessClass;
  staleBehavior: AufenthaltStaleBehavior;
  requiredContextKeys: readonly AufenthaltContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: AufenthaltUnitCategory;
  temporal: "current_2026";
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly AufenthaltContextKey[];
}>;

export const AUFENTHALT_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/aufenthg_2004/__104.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "AufenthG § 104 Übergangsregelungen",
});

export const AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS: readonly AufenthaltFutureChangeWatchItem[] = Object.freeze([
  {
    id: "aufenthalt-future-watch-36a-after-2027",
    key: "family-36a-after-23-july-2027",
    officialSourceUrl: AUFENTHALT_FUTURE_WATCH_SOURCE.url,
    officialDomain: AUFENTHALT_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: AUFENTHALT_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Nach Ablauf des 23. Juli 2027 endet die geltende Aussetzung des Familiennachzugs nach § 36a. Dieser künftige Rechtszustand darf nicht als aktuelle kanonische Wahrheit ingestiert werden.",
  },
  {
    id: "aufenthalt-future-watch-blue-card-salary",
    key: "blue-card-salary-threshold-future",
    officialSourceUrl: "https://www.make-it-in-germany.com/de/visum-aufenthalt/arten/blaue-karte-eu",
    officialDomain: "www.make-it-in-germany.com",
    officialSourceTitle: "Make it in Germany: Blaue Karte EU",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Jahresgehaltsschwellen der Blauen Karte EU sind keine zeitlose kanonische Wahrheit und dürfen nicht als festgeschriebener Eurobetrag ingestiert werden.",
  },
]);

export const AUFENTHALT_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "aufenthg-3", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__3.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 3 Passpflicht",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-3-all", locator: "AufenthG § 3 Abs. 1", text: "Ausländer dürfen nur einreisen oder sich aufhalten, wenn sie einen anerkannten und gültigen Pass oder Passersatz besitzen, soweit sie nicht durch Rechtsverordnung befreit sind. Für den Aufenthalt im Bundesgebiet erfüllen sie die Passpflicht auch durch einen Ausweisersatz." }],
  },
  {
    key: "aufenthg-4", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__4.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 4 Erfordernis eines Aufenthaltstitels",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-4-all", locator: "AufenthG § 4 Abs. 1", text: "Ausländer bedürfen für Einreise und Aufenthalt eines Aufenthaltstitels, sofern nicht durch Recht der Europäischen Union oder durch Rechtsverordnung etwas anderes bestimmt ist oder ein Aufenthaltsrecht nach dem Assoziationsabkommen EWG/Türkei besteht. Die Titel werden als Visum, Aufenthaltserlaubnis, Blaue Karte EU, ICT-Karte, Mobiler-ICT-Karte, Niederlassungserlaubnis oder Erlaubnis zum Daueraufenthalt – EU erteilt. Die Vorschriften der Aufenthaltserlaubnis gelten auch für Blaue Karte EU, ICT-Karte und Mobiler-ICT-Karte, soweit nichts anderes bestimmt ist." }],
  },
  {
    key: "aufenthg-4a", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__4a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 4a Zugang zur Erwerbstätigkeit",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "REQUIRED_EVIDENCE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-4a-all", locator: "AufenthG § 4a", text: "Wer einen Aufenthaltstitel besitzt, darf eine Erwerbstätigkeit ausüben, es sei denn, ein Gesetz bestimmt ein Verbot oder eine Beschränkung. Jeder Aufenthaltstitel muss erkennen lassen, ob Erwerbstätigkeit erlaubt ist und ob Beschränkungen bestehen. Wurde der Titel zum Zweck einer bestimmten Beschäftigung erteilt, ist eine andere Erwerbstätigkeit verboten, solange die zuständige Behörde sie nicht erlaubt hat. Die Zustimmung der Bundesagentur für Arbeit kann vorbehalten sein. Der Arbeitgeber hat der Ausländerbehörde innerhalb von vier Wochen mitzuteilen, wenn eine Beschäftigung, für die ein Titel nach Kapitel 2 Abschnitt 4 erteilt wurde, vorzeitig endet." }],
  },
  {
    key: "aufenthg-5", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__5.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 5 Allgemeine Erteilungsvoraussetzungen",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-5-all", locator: "AufenthG § 5", text: "Die Erteilung eines Aufenthaltstitels setzt in der Regel voraus, dass der Lebensunterhalt gesichert, die Identität geklärt, kein Ausweisungsinteresse gegeben und die Passpflicht erfüllt ist. Für Aufenthaltserlaubnis, Blaue Karte EU, ICT-Karte, Niederlassungserlaubnis und Daueraufenthalt-EU gilt regelmäßig die Einreise mit dem erforderlichen Visum. Von dem Visumerfordernis kann oder muss in gesetzlich bezeichneten Fällen abgesehen werden. Nicht jede Person darf deshalb visumfrei einreisen und im Inland einen Titel beantragen." }],
  },
  {
    key: "aufenthg-6", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__6.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 6 Visum",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-6-all", locator: "AufenthG § 6", text: "Ein Schengen-Visum gilt für Durchreise oder geplante Aufenthalte von bis zu 90 Tagen je Zeitraum von 180 Tagen. Für längerfristige Aufenthalte ist ein nationales Visum erforderlich, das vor der Einreise erteilt wird. Schengen-Visa berechtigen nicht zur Erwerbstätigkeit, es sei denn, sie wurden zum Zweck der Erwerbstätigkeit erteilt. Ein Schengen-Visum ist nicht dasselbe wie ein nationales Visum und nicht dieselbe Rechtsfigur wie eine Aufenthaltserlaubnis." }],
  },
  {
    key: "aufenthg-7", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__7.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 7 Aufenthaltserlaubnis",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-7-all", locator: "AufenthG § 7", text: "Die Aufenthaltserlaubnis ist ein befristeter Aufenthaltstitel. Sie wird zu den im Gesetz bezeichneten Zwecken erteilt. Die Geltungsdauer richtet sich nach dem Aufenthaltszweck. Die Aufenthaltserlaubnis ist nicht die Niederlassungserlaubnis und nicht die Erlaubnis zum Daueraufenthalt – EU." }],
  },
  {
    key: "aufenthg-8", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__8.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 8 Verlängerung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-8-all", locator: "AufenthG § 8", text: "Die Verlängerung der Aufenthaltserlaubnis steht unter denselben Voraussetzungen wie die Erteilung. Vor einer Verlängerung sind die aktuellen Erteilungsvoraussetzungen und der fortbestehende Aufenthaltszweck zu prüfen." }],
  },
  {
    key: "aufenthg-9", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__9.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 9 Niederlassungserlaubnis",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-9-all", locator: "AufenthG § 9", text: "Die Niederlassungserlaubnis ist ein unbefristeter Aufenthaltstitel. Ihre Erteilung setzt gesetzlich bezeichnete Voraussetzungen voraus, darunter in der Regel fünf Jahre Besitz einer Aufenthaltserlaubnis sowie weitere Integrations-, Unterhalts- und Sicherheitsvoraussetzungen. Fünf Jahre Aufenthalt allein begründen sie nicht automatisch. Privilegien und kürzere Fristen gelten nur, soweit das Gesetz sie ausdrücklich vorsieht." }],
  },
  {
    key: "aufenthg-9a", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__9a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 9a Erlaubnis zum Daueraufenthalt – EU",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-9a-all", locator: "AufenthG § 9a", text: "Die Erlaubnis zum Daueraufenthalt – EU ist ein unbefristeter Aufenthaltstitel nach Unionsrecht. Sie ist nicht dieselbe Rechtsfigur wie die Niederlassungserlaubnis und nicht dasselbe wie das Daueraufenthaltsrecht nach dem Freizügigkeitsgesetz/EU." }],
  },
  {
    key: "aufenthg-16b", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__16b.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 16b Studium",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-16b-all", locator: "AufenthG § 16b", text: "Zum Vollzeitstudium an einer staatlichen oder staatlich anerkannten Hochschule kann eine Aufenthaltserlaubnis erteilt werden. Der Zweck umfasst studienvorbereitende Maßnahmen und Pflichtpraktika. Die Erlaubnis berechtigt nach Maßgabe des Gesetzes nur zu Beschäftigungen, die insgesamt 140 Arbeitstage im Jahr nicht überschreiten dürfen; studentische Nebentätigkeiten werden nicht angerechnet. Diese Grenze gilt nicht automatisch für jeden anderen Ausbildungs- oder Aufenthaltstitel." }],
  },
  {
    key: "aufenthg-18", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__18a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 18a Fachkraft mit Berufsausbildung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-18a-all", locator: "AufenthG § 18a", text: "Einer Fachkraft mit Berufsausbildung kann eine Aufenthaltserlaubnis zur Ausübung einer qualifizierten Beschäftigung erteilt werden, wenn die gesetzlichen Voraussetzungen erfüllt sind. Die bloße Stellenanzeige oder ein Arbeitsangebot ersetzt weder den Aufenthaltstitel noch die Prüfung der gesetzlichen Voraussetzungen." }],
  },
  {
    key: "aufenthg-18b", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__18b.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 18b Fachkraft mit akademischer Ausbildung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-18b-all", locator: "AufenthG § 18b", text: "Einer Fachkraft mit akademischer Ausbildung kann eine Aufenthaltserlaubnis zur Ausübung einer qualifizierten Beschäftigung erteilt werden. Dieser Weg ist nicht automatisch die Blaue Karte EU und nicht automatisch eine Niederlassungserlaubnis." }],
  },
  {
    key: "aufenthg-18g", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__18g.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 18g Blaue Karte EU",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-18g-all", locator: "AufenthG § 18g", text: "Die Blaue Karte EU ist ein eigener Aufenthaltstitel für hochqualifizierte Beschäftigung. Sie ist nicht dieselbe Rechtsfigur wie eine gewöhnliche Aufenthaltserlaubnis, auch wenn einzelne Vorschriften der Aufenthaltserlaubnis entsprechend gelten. Gehaltsschwellen sind jährlich festgesetzte aktuelle Werte und keine zeitlosen Bundeskonstanten." }],
  },
  {
    key: "aufenthg-20a", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__20a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 20a Chancenkarte",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-20a-all", locator: "AufenthG § 20a", text: "Die Chancenkarte ist ein eigener Such- und Orientierungsweg und nicht automatisch eine Aufenthaltserlaubnis zur qualifizierten Beschäftigung. Ob sie im Einzelfall eröffnet ist, darf ohne die gesetzlichen Punkte, Qualifikation und Unterhaltstatsachen nicht entschieden werden." }],
  },
  {
    key: "aufenthg-27", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__27.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 27 Grundsatz des Familiennachzugs",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-27-all", locator: "AufenthG § 27", text: "Der Familiennachzug wird zum Schutz von Ehe und Familie gewährt. Er setzt einen Antrag und die gesetzlichen Voraussetzungen voraus. Die Ehe mit einer Deutschen oder einem Deutschen begründet nicht automatisch einen Aufenthaltstitel und nicht automatisch ein unbefristetes Aufenthaltsrecht. Eine Scheinehe oder Zwangsehe darf aus wenigen Angaben nicht entschieden werden." }],
  },
  {
    key: "aufenthg-51", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__51.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 51 Erlöschen des Aufenthaltstitels",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-51-all", locator: "AufenthG § 51", text: "Der Aufenthaltstitel erlischt unter anderem durch Ablauf der Geltungsdauer, auflösende Bedingung, Rücknahme, Widerruf, Ausweisung, nicht nur vorübergehende Ausreise oder Ausreise ohne Wiedereinreise innerhalb von sechs Monaten oder einer von der Ausländerbehörde bestimmten längeren Frist. Sechs Monate sind keine universelle Regel für jeden Status. Für die Blaue Karte EU und bestimmte Familienangehörige beträgt die Frist zwölf Monate. Die Erlaubnis zum Daueraufenthalt – EU erlischt nach eigenen, längeren unionsrechtlichen Fristen." }],
  },
  {
    key: "aufenthg-60a", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__60a.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 60a Duldung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-60a-all", locator: "AufenthG § 60a", text: "Die Duldung ist die vorübergehende Aussetzung der Abschiebung. Die Ausreisepflicht bleibt unberührt. Die Duldung ist kein Aufenthaltstitel und kein rechtmäßiger Aufenthaltstitel. Über die Aussetzung ist eine Bescheinigung auszustellen." }],
  },
  {
    key: "aufenthg-71", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__71.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 71 Zuständigkeit",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-71-all", locator: "AufenthG § 71", text: "Für aufenthalts- und passrechtliche Maßnahmen im Inland sind die Ausländerbehörden zuständig. Die örtliche Organisation bestimmt das Landesrecht. Im Ausland sind für Pass- und Visaangelegenheiten die vom Auswärtigen Amt ermächtigten Auslandsvertretungen zuständig. Sprache, userLocale oder Staatsangehörigkeit bestimmen weder die zuständige Ausländerbehörde noch die Auslandsvertretung." }],
  },
  {
    key: "aufenthg-78", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__78.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 78 Elektronischer Aufenthaltstitel",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-78-all", locator: "AufenthG § 78", text: "Aufenthaltstitel nach § 4 Absatz 1 Satz 2 Nummer 2 bis 4 werden als eigenständige Dokumente mit elektronischem Speicher- und Verarbeitungsmedium ausgestellt. Sichtbar sind unter anderem Art des Titels, Rechtsgrundlage, Gültigkeit, Anmerkungen und Lichtbild. Nebenbestimmungen werden elektronisch gespeichert. Die physische Karte ist nicht in jedem Antragsstadium der gesamte rechtliche Status." }],
  },
  {
    key: "aufenthg-81", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__81.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 81 Beantragung und Fiktionswirkung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-81-all", locator: "AufenthG § 81", text: "Ein Aufenthaltstitel wird nur auf Antrag erteilt, soweit nichts anderes bestimmt ist. Wer sich rechtmäßig ohne Titel im Bundesgebiet aufhält und einen Titel beantragt, gilt bis zur Entscheidung als erlaubt aufhältig; bei verspätetem Antrag gilt die Abschiebung als ausgesetzt. Wer vor Ablauf seines Titels die Verlängerung oder einen anderen Titel beantragt, dessen bisheriger Titel gilt bis zur Entscheidung als fortbestehend. Das gilt nicht für ein Schengen-Visum nach § 6 Absatz 1. Bei verspätetem Antrag kann die Ausländerbehörde die Fortgeltung zur Vermeidung einer unbilligen Härte anordnen. Über die Wirkung der Antragstellung ist eine Fiktionsbescheinigung auszustellen. Die Fiktionsbescheinigung ist nicht selbst ein neuer Aufenthaltstitel." }],
  },
  {
    key: "aufenthg-82", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__82.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 82 Mitwirkung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-82-all", locator: "AufenthG § 82", text: "Der Ausländer muss ihm günstige Umstände unverzüglich geltend machen und Nachweise beibringen. Inhaber einer Blauen Karte EU müssen in den ersten zwölf Monaten jeden Arbeitgeberwechsel und jede Änderung mitteilen, die die Erteilungsvoraussetzungen betrifft. Inhaber einer Aufenthaltserlaubnis nach Kapitel 2 Abschnitt 3 oder 4 müssen der Ausländerbehörde innerhalb von zwei Wochen mitteilen, dass die Ausbildung oder Erwerbstätigkeit, für die der Titel erteilt wurde, vorzeitig beendet wurde. Nicht jede Lebensänderung unterliegt dieser Zwei-Wochen-Pflicht." }],
  },
  {
    key: "aufenthg-84", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__84.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 84 Wirkungen von Widerspruch und Klage",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-84-all", locator: "AufenthG § 84", text: "Widerspruch und Klage haben in den gesetzlich bezeichneten Fällen keine aufschiebende Wirkung, insbesondere gegen die Ablehnung der Erteilung oder Verlängerung eines Aufenthaltstitels und gegen die Änderung einer erwerbsbezogenen Nebenbestimmung. Widerspruch ist deshalb nicht automatisch die Erlaubnis, unter unveränderten Bedingungen zu bleiben oder zu arbeiten. Für die Erwerbstätigkeit gilt der Titel unter engen gesetzlichen Voraussetzungen als fortbestehend. Die Rechtsbehelfsbelehrung und die Bekanntgabe des Bescheids sind zu lesen." }],
  },
  {
    key: "aufenthg-104", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/aufenthg_2004/__104.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AufenthG § 104 Übergangsregelungen",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "aufenthg-104-14", locator: "AufenthG § 104 Abs. 14", text: "Bis zum Ablauf des 23. Juli 2027 wird ein Familiennachzug nach § 36a zu einer Person, der eine Aufenthaltserlaubnis nach § 25 Absatz 2 Satz 1 zweite Alternative erteilt worden ist, nicht gewährt. Die §§ 22 und 23 bleiben unberührt. Das ist geltendes Übergangsrecht und keine künftige Vermutung." }],
  },
  {
    key: "freizueg-2", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/freiz_gg_eu_2004/__2.html",
    officialDomain: "www.gesetze-im-internet.de", title: "FreizügG/EU § 2 Recht auf Einreise und Aufenthalt",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "freizueg-2-all", locator: "FreizügG/EU § 2", text: "Freizügigkeitsberechtigte Unionsbürger und ihre Familienangehörigen haben das Recht auf Einreise und Aufenthalt nach dem Freizügigkeitsgesetz/EU. Unionsbürger sind insbesondere als Arbeitnehmer, Selbständige, Arbeitsuchende, Dienstleistungsempfänger, Nichterwerbstätige unter den Voraussetzungen des § 4, Studierende und als Inhaber eines Daueraufenthaltsrechts berechtigt. Ein Unionsbürger braucht deshalb nicht gewöhnlich eine Aufenthaltserlaubnis nach dem AufenthG. Das Recht ist nicht in jedem Lebenssachverhalt unbeschränkt." }],
  },
  {
    key: "freizueg-5", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/freiz_gg_eu_2004/__5.html",
    officialDomain: "www.gesetze-im-internet.de", title: "FreizügG/EU § 5 Aufenthaltskarten",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "freizueg-5-all", locator: "FreizügG/EU § 5", text: "Freizügigkeitsberechtigten Familienangehörigen, die nicht Unionsbürger sind, wird von Amts wegen eine Aufenthaltskarte für Familienangehörige von Unionsbürgern ausgestellt. Auf Antrag wird Unionsbürgern das Daueraufenthaltsrecht bescheinigt; ihren nicht unionalen Familienangehörigen wird eine Daueraufenthaltskarte ausgestellt. Die Aufenthaltskarte ist nicht eine Aufenthaltserlaubnis nach dem AufenthG." }],
  },
  {
    key: "asylg-55", publisherKey: "bmj", authorityKey: "bmi",
    url: "https://www.gesetze-im-internet.de/asylvfg_1992/__55.html",
    officialDomain: "www.gesetze-im-internet.de", title: "AsylG § 55 Aufenthaltsgestattung",
    sourceClass: "FEDERAL_LAW", sourceType: "federal_statute", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE", handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED", staleBehavior: "DO_NOT_USE_STALE", requiredContextKeys: [],
    passages: [{ key: "asylg-55-all", locator: "AsylG § 55", text: "Einem Ausländer ist der Aufenthalt zur Durchführung des Asylverfahrens gestattet. Die Aufenthaltsgestattung ist kein Aufenthaltstitel nach § 4 AufenthG. Mit der Einreichung eines Asylantrags erlöschen bestimmte kurze Titel und die Fiktionswirkungen des § 81 Absatz 3 und 4 AufenthG; § 81 Absatz 4 bleibt unberührt, wenn ein Titel von mehr als sechs Monaten besessen und dessen Verlängerung beantragt wurde." }],
  },
  {
    key: "bmi-aufenthalt", publisherKey: "bmi", authorityKey: "bmi",
    url: "https://www.bmi.bund.de/DE/themen/migration/aufenthaltsrecht/aufenthaltsrecht-node.html",
    officialDomain: "www.bmi.bund.de", title: "BMI: Aufenthaltsrecht",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
    passages: [{ key: "bmi-aufenthalt-all", locator: "BMI Aufenthaltsrecht", text: "Das Bundesministerium des Innern beschreibt das Aufenthaltsrecht als bundesgesetzlichen Rahmen, den die örtlichen Ausländerbehörden ausführen. Aktuelle örtliche Termine, Checklisten und Bearbeitungszeiten sind keine bundesweit festgeschriebenen Konstanten." }],
  },
  {
    key: "aa-visum", publisherKey: "aa", authorityKey: "aa",
    url: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt/visabestimmungen-node",
    officialDomain: "www.auswaertiges-amt.de", title: "Auswärtiges Amt: Visa und Aufenthalt",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE", handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
    passages: [{ key: "aa-visum-all", locator: "AA Visa", text: "Wer sich außerhalb Deutschlands befindet und ein nationales Visum braucht, wendet sich an die zuständige deutsche Auslandsvertretung. Eine beliebige inländische Ausländerbehörde ist dafür nicht zuständig." }],
  },
  {
    key: "bamf-asyl", publisherKey: "bamf", authorityKey: "bamf",
    url: "https://www.bamf.de/DE/Themen/AsylFluechtlingsschutz/AblaufAsylverfahren/ablaufasylverfahren-node.html",
    officialDomain: "www.bamf.de", title: "BAMF: Ablauf des Asylverfahrens",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE", sourceType: "federal_guidance", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY", handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
    passages: [{ key: "bamf-asyl-all", locator: "BAMF Asylverfahren", text: "Das Asylverfahren und die Schutzentscheidung liegen beim Bundesamt für Migration und Flüchtlinge. Dieses Orientierungspaket entscheidet weder Flüchtlingseigenschaft noch subsidiären Schutz, Dublin-Zuständigkeit oder Abschiebbarkeit." }],
  },
  {
    key: "miig-blue-card", publisherKey: "bmi", authorityKey: "bmi",
    url: "https://www.make-it-in-germany.com/de/visum-aufenthalt/arten/blaue-karte-eu",
    officialDomain: "www.make-it-in-germany.com", title: "Make it in Germany: Blaue Karte EU",
    sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY", handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: [],
    passages: [{ key: "miig-blue-all", locator: "Make it in Germany Blaue Karte", text: "Das Bundesportal Make it in Germany veröffentlicht die jeweils aktuellen Gehaltsschwellen und Verfahrenshinweise zur Blauen Karte EU. Ein festgeschriebener Eurobetrag darf nicht als zeitlose kanonische Wahrheit gespeichert werden." }],
  },
  {
    key: "bund-local-live", publisherKey: "bund", authorityKey: "bmi",
    url: "https://verwaltung.bund.de/leistungsverzeichnis/de",
    officialDomain: "verwaltung.bund.de", title: "Bundesportal: örtliche Leistungsausführung",
    sourceClass: "FEDERAL_SERVICE_PORTAL", sourceType: "authority_portal", retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE", handlingMode: "FETCH_LIVE",
    freshnessClass: "EVENT_DRIVEN", staleBehavior: "REVALIDATE_BEFORE_USE", requiredContextKeys: ["BUNDESLAND"],
    passages: [{ key: "bund-local-live-all", locator: "Bundesportal örtliche Ausführung", text: "Öffnungszeiten, Terminlage, örtliche Online-Dienste und die genaue Ausländerbehörde sind live bei der zuständigen Stelle zu prüfen." }],
  },
]);

export const AUFENTHALT_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "titel-erfordernis", category: "orientation", temporal: "current_2026", type: "definition", text: "Ausländer bedürfen für Einreise und Aufenthalt eines Aufenthaltstitels, soweit nicht Unionsrecht, Rechtsverordnung oder das Assoziationsabkommen EWG/Türkei etwas anderes bestimmt.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "titelarten", category: "classifier", temporal: "current_2026", type: "definition", text: "Aufenthaltstitel werden als Visum, Aufenthaltserlaubnis, Blaue Karte EU, ICT-Karte, Mobiler-ICT-Karte, Niederlassungserlaubnis oder Erlaubnis zum Daueraufenthalt – EU erteilt.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "ae-zweckgebunden", category: "orientation", temporal: "current_2026", type: "definition", text: "Die Aufenthaltserlaubnis ist ein befristeter und zweckgebundener Aufenthaltstitel. Sie ist nicht die Niederlassungserlaubnis.", sourceKey: "aufenthg-7", passageKey: "aufenthg-7-all", riskLevel: "high" },
  { key: "blue-card-not-ordinary-ae", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Blaue Karte EU ist nicht dieselbe Rechtsfigur wie eine gewöhnliche Aufenthaltserlaubnis, auch wenn einzelne Vorschriften entsprechend gelten.", sourceKey: "aufenthg-18g", passageKey: "aufenthg-18g-all", riskLevel: "high" },
  { key: "nationality-not-entitlement", category: "gate", temporal: "current_2026", type: "exception", text: "Die Staatsangehörigkeit allein begründet keinen Anspruch auf einen bestimmten Aufenthaltstitel und bestimmt nicht den richtigen Rechtsrahmen.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "german-citizen-not-aufenthg", category: "gate", temporal: "current_2026", type: "exception", text: "Deutsche Staatsangehörige unterliegen nicht dem Erfordernis eines Aufenthaltstitels nach § 4 AufenthG.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "eu-not-ordinary-titel", category: "gate", temporal: "current_2026", type: "exception", text: "Ein freizügigkeitsberechtigter Unionsbürger braucht nicht gewöhnlich eine Aufenthaltserlaubnis nach dem AufenthG.", sourceKey: "freizueg-2", passageKey: "freizueg-2-all", riskLevel: "high" },
  { key: "eu-not-unconditional", category: "gate", temporal: "current_2026", type: "exception", text: "Unionsbürgerschaft begründet kein unbedingtes unbeschränktes Aufenthaltsrecht in jedem Lebenssachverhalt. Nichterwerbstätigkeit und Arbeitsuche haben eigene Voraussetzungen.", sourceKey: "freizueg-2", passageKey: "freizueg-2-all", riskLevel: "high" },
  { key: "non-eu-family-not-ordinary-ae", category: "gate", temporal: "current_2026", type: "exception", text: "Familienangehörige eines Unionsbürgers, die nicht selbst Unionsbürger sind, gehören zur Aufenthaltskarte nach dem Freizügigkeitsgesetz/EU und nicht automatisch zur gewöhnlichen Aufenthaltserlaubnis.", sourceKey: "freizueg-5", passageKey: "freizueg-5-all", riskLevel: "high" },
  { key: "unclear-status-fail-closed", category: "gate", temporal: "current_2026", type: "exception", text: "Ohne erkennbare Staatsangehörigkeitsgruppe, aktuelles Dokument und Aufenthaltszweck darf kein bestimmter Aufenthaltstitelweg entschieden werden.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["COUNTRY", "PROCESS_VARIANT"] },
  { key: "schengen-not-national", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Schengen-Visum ist nicht dasselbe wie ein nationales Visum für den längerfristigen Aufenthalt.", sourceKey: "aufenthg-6", passageKey: "aufenthg-6-all", riskLevel: "high" },
  { key: "visum-not-ae", category: "classifier", temporal: "current_2026", type: "exception", text: "Ein Visum ist nicht dieselbe Rechtsfigur wie eine Aufenthaltserlaubnis.", sourceKey: "aufenthg-6", passageKey: "aufenthg-6-all", riskLevel: "high" },
  { key: "aufenthaltskarte-not-ae", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Aufenthaltskarte nach dem Freizügigkeitsgesetz/EU ist nicht eine Aufenthaltserlaubnis nach dem AufenthG.", sourceKey: "freizueg-5", passageKey: "freizueg-5-all", riskLevel: "high" },
  { key: "ne-not-daueraufenthalt-eu", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Niederlassungserlaubnis ist nicht dieselbe Rechtsfigur wie die Erlaubnis zum Daueraufenthalt – EU.", sourceKey: "aufenthg-9a", passageKey: "aufenthg-9a-all", riskLevel: "high" },
  { key: "duldung-not-titel", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Duldung ist die Aussetzung der Abschiebung und kein Aufenthaltstitel.", sourceKey: "aufenthg-60a", passageKey: "aufenthg-60a-all", riskLevel: "high" },
  { key: "gestattung-not-titel", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Aufenthaltsgestattung nach dem Asylgesetz ist kein Aufenthaltstitel nach § 4 AufenthG.", sourceKey: "asylg-55", passageKey: "asylg-55-all", riskLevel: "high" },
  { key: "fiktion-not-new-titel", category: "classifier", temporal: "current_2026", type: "exception", text: "Die Fiktionsbescheinigung ist nicht selbst ein neuer Aufenthaltstitel und nicht eine neue Aufenthaltserlaubnis.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "anmeldung-not-titel", category: "boundary", temporal: "current_2026", type: "exception", text: "Die melderechtliche Anmeldung ist nicht der Aufenthaltstitel und ersetzt keine ausländerrechtliche Erlaubnis.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "registered-address-not-status", category: "boundary", temporal: "current_2026", type: "exception", text: "Eine gemeldete Anschrift beweist nicht, dass alle aufenthaltsrechtlichen Voraussetzungen erfüllt sind.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "eat-not-entire-status", category: "document", temporal: "current_2026", type: "exception", text: "Die physische Karte des elektronischen Aufenthaltstitels ist nicht in jedem Antragsstadium der gesamte rechtliche Status.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "high" },
  { key: "process-needs-status-facts", category: "gate", temporal: "current_2026", type: "procedure", text: "Welcher Prozess gilt, richtet sich nach Staatsangehörigkeitsgruppe, aktuellem Dokument, Aufenthaltszweck, Ort und gewünschter künftiger Tätigkeit, nicht nach der Sprache der Oberfläche.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, die Sprache der Oberfläche oder die Dokumentsprache bestimmen weder den Aufenthaltsstatus noch die zuständige Ausländerbehörde.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high" },
  { key: "language-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "Die deutsche Sprache eines Schreibens bestimmt nicht die zuständige Ausländerbehörde.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high" },
  { key: "land-alone-not-enough", category: "competence", temporal: "current_2026", type: "exception", text: "Das Bundesland allein bestimmt nicht notwendig die genaue örtliche Ausländerbehörde.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high" },
  { key: "no-locality-no-authority", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne den tatsächlichen Wohnort darf keine bestimmte Ausländerbehörde benannt werden.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "opening-hours-are-live", category: "competence", temporal: "current_2026", type: "procedure", text: "Öffnungszeiten, Terminlage und die aktuelle örtliche Online-Verfügbarkeit der Ausländerbehörde sind live zu prüfen.", sourceKey: "bund-local-live", passageKey: "bund-local-live-all", riskLevel: "medium" },
  { key: "appointment-not-application", category: "extension", temporal: "current_2026", type: "exception", text: "Die Buchung eines Termins ist nicht automatisch der förmliche Antrag auf Erteilung oder Verlängerung eines Aufenthaltstitels.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "processing-times-live", category: "competence", temporal: "current_2026", type: "exception", text: "Eine bundesweit feste Bearbeitungsdauer der Ausländerbehörde darf nicht als zeitlose Konstante versprochen werden.", sourceKey: "bmi-aufenthalt", passageKey: "bmi-aufenthalt-all", riskLevel: "medium" },
  { key: "application-required", category: "application", temporal: "current_2026", type: "duty", text: "Ein Aufenthaltstitel wird nur auf Antrag erteilt, soweit nichts anderes bestimmt ist.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "visa-procedure-requirement", category: "application", temporal: "current_2026", type: "duty", text: "Die Erteilung der meisten Inlandstitel setzt regelmäßig die Einreise mit dem erforderlichen Visum voraus. Gesetzliche Ausnahmen sind einzelfallabhängig.", sourceKey: "aufenthg-5", passageKey: "aufenthg-5-all", riskLevel: "high" },
  { key: "not-everyone-domestic-apply", category: "application", temporal: "current_2026", type: "exception", text: "Nicht jede Person darf visumfrei einreisen und im Inland einen Aufenthaltstitel beantragen.", sourceKey: "aufenthg-5", passageKey: "aufenthg-5-all", riskLevel: "high" },
  { key: "anmeldung-not-domestic-right", category: "application", temporal: "current_2026", type: "exception", text: "Die Anmeldung einer Wohnung macht die Inlandbeantragung eines Aufenthaltstitels nicht automatisch zulässig.", sourceKey: "aufenthg-5", passageKey: "aufenthg-5-all", riskLevel: "high" },
  { key: "passpflicht", category: "application", temporal: "current_2026", type: "duty", text: "Für Einreise und Aufenthalt gilt die Passpflicht. Ein abgelaufener Pass darf nicht stillschweigend ignoriert werden.", sourceKey: "aufenthg-3", passageKey: "aufenthg-3-all", riskLevel: "high" },
  { key: "livelihood-identity-passport", category: "application", temporal: "current_2026", type: "duty", text: "In der Regel müssen Lebensunterhalt, geklärte Identität und erfüllte Passpflicht nachgewiesen werden. Örtliche Zusatzlisten sind live zu prüfen und nicht zu verallgemeinern.", sourceKey: "aufenthg-5", passageKey: "aufenthg-5-all", riskLevel: "high" },
  { key: "biometrics-for-eat", category: "document", temporal: "current_2026", type: "procedure", text: "Für den elektronischen Aufenthaltstitel sind Lichtbild, Fingerabdrücke und Unterschrift nach den gesetzlichen Vorgaben mitzuwirken.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "medium" },
  { key: "decision-then-document", category: "application", temporal: "current_2026", type: "procedure", text: "Nach der Entscheidung stellt die Ausländerbehörde den elektronischen Aufenthaltstitel aus. Die Kartenherstellung ist nicht dieselbe Handlung wie die Rechtsentscheidung.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "medium" },
  { key: "apply-before-expiry", category: "extension", temporal: "current_2026", type: "duty", text: "Die Verlängerung oder die Erteilung eines anderen Titels ist vor Ablauf des bisherigen Aufenthaltstitels zu beantragen.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "timely-fiction-continues", category: "fiktion", temporal: "current_2026", type: "definition", text: "Wird vor Ablauf des Aufenthaltstitels dessen Verlängerung oder ein anderer Titel beantragt, gilt der bisherige Titel bis zur Entscheidung als fortbestehend.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "schengen-visa-no-81-4", category: "fiktion", temporal: "current_2026", type: "exception", text: "Die Fortgeltungsfiktion des § 81 Absatz 4 gilt nicht für ein Schengen-Visum nach § 6 Absatz 1.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "late-not-automatic-fiction", category: "extension", temporal: "current_2026", type: "exception", text: "Ein verspäteter Antrag führt nicht automatisch zur Fortgeltung des bisherigen Aufenthaltstitels.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "late-hardship-discretion", category: "extension", temporal: "current_2026", type: "procedure", text: "Bei verspätetem Antrag kann die Ausländerbehörde die Fortgeltungswirkung zur Vermeidung einer unbilligen Härte anordnen. Das ist Ermessen und keine Automatik.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "late-81-3-suspension-only", category: "extension", temporal: "current_2026", type: "exception", text: "Wer sich ohne Titel rechtmäßig aufgehalten hat und verspätet beantragt, für den gilt nach § 81 Absatz 3 nur die Aussetzung der Abschiebung, nicht die volle Erlaubnisfiktion.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "expired-card-not-automatically-unlawful", category: "extension", temporal: "current_2026", type: "exception", text: "Das Ablaufdatum der physischen Karte bedeutet nicht automatisch einen unerlaubten Aufenthalt. Maßgebend sind Antrag, Zeitpunkt und gesetzliche Fiktion.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "fiktion-needs-facts", category: "fiktion", temporal: "current_2026", type: "exception", text: "Ob eine Fiktionswirkung besteht, darf ohne bisherigen Status, Antragsart und Antragszeitpunkt nicht entschieden werden.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "fiktion-bescheinigung-issued", category: "fiktion", temporal: "current_2026", type: "procedure", text: "Über die Wirkung der Antragstellung ist eine Fiktionsbescheinigung auszustellen.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "medium" },
  { key: "fiktion-81-3-vs-81-4", category: "fiktion", temporal: "current_2026", type: "definition", text: "§ 81 Absatz 3 fingiert die Erlaubnis des Aufenthalts ohne bisherigen Titel. § 81 Absatz 4 fingiert die Fortgeltung eines bestehenden Titels. Das sind verschiedene Wirkungen.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "fiktion-employment-notation", category: "fiktion", temporal: "current_2026", type: "procedure", text: "In den Fällen der Absätze 3 und 4 kann die künftige Erwerbstätigkeit nach Kapitel 2 Abschnitt 3 und 4 ab Veranlassung der Ausstellung bis zur Ausgabe des elektronischen Aufenthaltstitels als erlaubt gelten; die Erlaubnis ist in die Fiktionsbescheinigung aufzunehmen.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "travel-fiktion-fail-closed", category: "fiktion", temporal: "current_2026", type: "exception", text: "Aus dem Wort Fiktionsbescheinigung allein darf keine sichere internationale Reise- oder Wiedereinreisegarantie abgeleitet werden.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "COUNTRY"] },
  { key: "fiktion-not-travel-document", category: "fiktion", temporal: "current_2026", type: "exception", text: "Die Fiktionsbescheinigung ist nicht automatisch ein sicheres internationales Reisedokument.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "title-must-show-work", category: "employment", temporal: "current_2026", type: "duty", text: "Jeder Aufenthaltstitel muss erkennen lassen, ob die Erwerbstätigkeit erlaubt ist und ob Beschränkungen bestehen.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "title-not-unrestricted-work", category: "employment", temporal: "current_2026", type: "exception", text: "Ein gültiger Aufenthaltstitel bedeutet nicht uneingeschränkte Erlaubnis für jede Beschäftigung.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "job-offer-not-authorization", category: "employment", temporal: "current_2026", type: "exception", text: "Ein Arbeitsangebot ist nicht automatisch die aufenthalts- oder arbeitsrechtliche Erlaubnis.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "other-job-needs-permission", category: "employment", temporal: "current_2026", type: "duty", text: "Wurde der Titel zum Zweck einer bestimmten Beschäftigung erteilt, ist eine andere Erwerbstätigkeit verboten, solange die Behörde sie nicht erlaubt hat.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "ba-consent-boundary", category: "employment", temporal: "current_2026", type: "definition", text: "Die Erlaubnis einer Beschäftigung kann der Zustimmung der Bundesagentur für Arbeit unterliegen. Dieses Paket entscheidet die Zustimmung nicht.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "employer-change-needs-title", category: "employment", temporal: "current_2026", type: "exception", text: "Ob ein Arbeitgeberwechsel erlaubt oder nur anzuzeigen ist, darf ohne genauen Titel, Rechtsgrundlage und Nebenbestimmungen nicht entschieden werden.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "blue-card-notify-12-months", category: "employment", temporal: "current_2026", type: "duty", text: "Inhaber einer Blauen Karte EU müssen in den ersten zwölf Monaten jeden Arbeitgeberwechsel und jede Änderung mitteilen, die die Erteilungsvoraussetzungen betrifft.", sourceKey: "aufenthg-82", passageKey: "aufenthg-82-all", riskLevel: "high" },
  { key: "work-permission-fail-closed", category: "employment", temporal: "current_2026", type: "exception", text: "Ob eine bestimmte Stelle erlaubt ist, darf ohne den genauen Aufenthaltstitel, die Rechtsgrundlage und die Nebenbestimmungen nicht entschieden werden.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "new-employer-not-always-allowed", category: "employment", temporal: "current_2026", type: "exception", text: "Ein neuer Arbeitgeber ist nicht immer automatisch erlaubt.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "new-employer-not-always-forbidden", category: "employment", temporal: "current_2026", type: "exception", text: "Ein neuer Arbeitgeber ist nicht immer automatisch verboten.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "studium-16b-route", category: "study", temporal: "current_2026", type: "definition", text: "Zum Vollzeitstudium kann eine Aufenthaltserlaubnis nach § 16b erteilt werden. Das ist ein eigener Zweckweg und nicht automatisch eine Fachkraftzulassung.", sourceKey: "aufenthg-16b", passageKey: "aufenthg-16b-all", riskLevel: "high" },
  { key: "student-work-not-universal", category: "study", temporal: "current_2026", type: "exception", text: "Nicht jeder studentische oder ausbildungsbezogene Titel erlaubt dieselbe Erwerbstätigkeit.", sourceKey: "aufenthg-16b", passageKey: "aufenthg-16b-all", riskLevel: "high" },
  { key: "student-limit-is-statutory-current", category: "study", temporal: "current_2026", type: "definition", text: "Nach geltendem § 16b darf die Beschäftigung 140 Arbeitstage im Jahr nicht überschreiten; studentische Nebentätigkeiten werden nicht angerechnet. Die Grenze ist gesetzlich und nicht auf jeden anderen Titel zu übertragen.", sourceKey: "aufenthg-16b", passageKey: "aufenthg-16b-all", riskLevel: "high" },
  { key: "fachkraft-18a", category: "skilled", temporal: "current_2026", type: "definition", text: "§ 18a betrifft die Fachkraft mit Berufsausbildung. Das ist ein Orientierungsweg, kein vollständiges Zulassungsautomatikverfahren.", sourceKey: "aufenthg-18", passageKey: "aufenthg-18a-all", riskLevel: "high" },
  { key: "fachkraft-18b", category: "skilled", temporal: "current_2026", type: "definition", text: "§ 18b betrifft die Fachkraft mit akademischer Ausbildung und ist nicht automatisch die Blaue Karte EU.", sourceKey: "aufenthg-18b", passageKey: "aufenthg-18b-all", riskLevel: "high" },
  { key: "blue-card-route", category: "skilled", temporal: "current_2026", type: "definition", text: "Die Blaue Karte EU nach § 18g ist der hochqualifizierte Beschäftigungsweg mit eigenen Voraussetzungen.", sourceKey: "aufenthg-18g", passageKey: "aufenthg-18g-all", riskLevel: "high" },
  { key: "salary-threshold-not-timeless", category: "skilled", temporal: "current_2026", type: "exception", text: "Die Gehaltsschwelle der Blauen Karte EU ist ein aktueller Wert und keine zeitlose kanonische Konstante.", sourceKey: "miig-blue-card", passageKey: "miig-blue-all", riskLevel: "high" },
  { key: "chancenkarte-route-only", category: "skilled", temporal: "current_2026", type: "exception", text: "Die Chancenkarte ist nicht automatisch eine Aufenthaltserlaubnis zur qualifizierten Beschäftigung.", sourceKey: "aufenthg-20a", passageKey: "aufenthg-20a-all", riskLevel: "high" },
  { key: "self-employment-boundary", category: "skilled", temporal: "current_2026", type: "exception", text: "Selbständigkeit folgt eigenen aufenthaltsrechtlichen Vorschriften und darf nicht mit abhängiger Fachkraftbeschäftigung gleichgesetzt werden.", sourceKey: "aufenthg-4a", passageKey: "aufenthg-4a-all", riskLevel: "high" },
  { key: "family-german-not-automatic", category: "family", temporal: "current_2026", type: "exception", text: "Die Ehe mit einer Deutschen oder einem Deutschen begründet nicht automatisch einen Aufenthaltstitel.", sourceKey: "aufenthg-27", passageKey: "aufenthg-27-all", riskLevel: "high" },
  { key: "family-tcn-not-automatic", category: "family", temporal: "current_2026", type: "exception", text: "Der Familiennachzug zu einer drittstaatsangehörigen Person setzt Antrag und gesetzliche Voraussetzungen voraus und ist nicht automatisch eröffnet.", sourceKey: "aufenthg-27", passageKey: "aufenthg-27-all", riskLevel: "high" },
  { key: "marriage-not-permanent", category: "family", temporal: "current_2026", type: "exception", text: "Die Ehe begründet nicht automatisch ein unbefristetes Aufenthaltsrecht.", sourceKey: "aufenthg-27", passageKey: "aufenthg-27-all", riskLevel: "high" },
  { key: "family-eu-citizen-freizug", category: "family", temporal: "current_2026", type: "procedure", text: "Der Familiennachzug zu einem Unionsbürger folgt dem Freizügigkeitsgesetz/EU und der Aufenthaltskarte, nicht automatisch der gewöhnlichen Aufenthaltserlaubnis.", sourceKey: "freizueg-5", passageKey: "freizueg-5-all", riskLevel: "high" },
  { key: "sham-not-decide", category: "family", temporal: "current_2026", type: "exception", text: "Eine Scheinehe oder Zwangsehe darf aus wenigen Angaben nicht entschieden werden.", sourceKey: "aufenthg-27", passageKey: "aufenthg-27-all", riskLevel: "high" },
  { key: "subsidiary-36a-suspended-until-2027", category: "family", temporal: "current_2026", type: "deadline", text: "Bis zum Ablauf des 23. Juli 2027 wird ein Familiennachzug nach § 36a zu subsidiär Schutzberechtigten nach § 25 Absatz 2 Satz 1 zweite Alternative nicht gewährt.", sourceKey: "aufenthg-104", passageKey: "aufenthg-104-14", riskLevel: "high" },
  { key: "ne-is-settlement", category: "permanent", temporal: "current_2026", type: "definition", text: "Die Niederlassungserlaubnis ist der unbefristete Aufenthaltstitel nach § 9 AufenthG.", sourceKey: "aufenthg-9", passageKey: "aufenthg-9-all", riskLevel: "high" },
  { key: "da-eu-is-different", category: "permanent", temporal: "current_2026", type: "definition", text: "Die Erlaubnis zum Daueraufenthalt – EU ist ein eigener unbefristeter Titel nach Unionsrecht.", sourceKey: "aufenthg-9a", passageKey: "aufenthg-9a-all", riskLevel: "high" },
  { key: "freizug-daueraufenthalt-different", category: "permanent", temporal: "current_2026", type: "exception", text: "Das Daueraufenthaltsrecht nach dem Freizügigkeitsgesetz/EU ist nicht dieselbe Rechtsfigur wie die Erlaubnis zum Daueraufenthalt – EU nach dem AufenthG.", sourceKey: "freizueg-5", passageKey: "freizueg-5-all", riskLevel: "high" },
  { key: "five-years-not-automatic", category: "permanent", temporal: "current_2026", type: "exception", text: "Fünf Jahre Aufenthalt in Deutschland begründen nicht automatisch eine Niederlassungserlaubnis.", sourceKey: "aufenthg-9", passageKey: "aufenthg-9-all", riskLevel: "high" },
  { key: "individual-permanent-fail-closed", category: "permanent", temporal: "current_2026", type: "exception", text: "Ob eine bestimmte Person eine Niederlassungserlaubnis oder den Daueraufenthalt-EU erhält, darf ohne die vollständigen gesetzlichen Tatsachen nicht entschieden werden.", sourceKey: "aufenthg-9", passageKey: "aufenthg-9-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT", "EVENT_DATE"] },
  { key: "purpose-change-application", category: "purpose_change", temporal: "current_2026", type: "procedure", text: "Ein anderer Aufenthaltszweck ist als Erteilung eines anderen Titels zu beantragen, regelmäßig vor Ablauf des bisherigen Status.", sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all", riskLevel: "high" },
  { key: "not-every-ae-can-change", category: "purpose_change", temporal: "current_2026", type: "exception", text: "Nicht jede Aufenthaltserlaubnis kann frei in jeden anderen Zweck gewechselt werden.", sourceKey: "aufenthg-7", passageKey: "aufenthg-7-all", riskLevel: "high" },
  { key: "eat-is-document", category: "document", temporal: "current_2026", type: "definition", text: "Der elektronische Aufenthaltstitel ist das eigenständige Dokument über den erteilten Titel und enthält die sichtbare Rechtsgrundlage sowie Anmerkungen.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "medium" },
  { key: "nebenbestimmungen-on-document", category: "document", temporal: "current_2026", type: "definition", text: "Nebenbestimmungen zur Erwerbstätigkeit sind aus dem Aufenthaltstitel und dem Zusatzblatt oder Chip zu lesen, nicht aus der Nutzererzählung allein.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "high" },
  { key: "lost-eat-replace", category: "document", temporal: "current_2026", type: "procedure", text: "Bei Verlust, Diebstahl oder Beschädigung des elektronischen Aufenthaltstitels ist die zuständige Ausländerbehörde um Ersatz zu ersuchen. Örtliche Termine sind live zu prüfen.", sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all", riskLevel: "medium" },
  { key: "new-passport-not-new-status", category: "document", temporal: "current_2026", type: "exception", text: "Ein neuer Pass erzeugt keinen neuen Aufenthaltsstatus.", sourceKey: "aufenthg-3", passageKey: "aufenthg-3-all", riskLevel: "high" },
  { key: "expired-passport-not-ignore", category: "document", temporal: "current_2026", type: "exception", text: "Ein abgelaufener Pass darf nicht als unbeachtlich behandelt werden.", sourceKey: "aufenthg-3", passageKey: "aufenthg-3-all", riskLevel: "high" },
  { key: "pass-change-not-lose-title", category: "document", temporal: "current_2026", type: "exception", text: "Ein neuer Pass bedeutet nicht automatisch den Verlust des Aufenthaltsrechts. Der elektronische Aufenthaltstitel ist bei der zuständigen Behörde an den neuen Pass anzupassen.", sourceKey: "aufenthg-3", passageKey: "aufenthg-3-all", riskLevel: "high" },
  { key: "cooperation-unverzueglich", category: "changes", temporal: "current_2026", type: "duty", text: "Günstige Umstände und erforderliche Nachweise sind der Ausländerbehörde unverzüglich geltend zu machen und beizubringen.", sourceKey: "aufenthg-82", passageKey: "aufenthg-82-all", riskLevel: "high" },
  { key: "two-week-not-every-change", category: "changes", temporal: "current_2026", type: "exception", text: "Nicht jede Lebensänderung muss innerhalb von zwei Wochen gemeldet werden. Die Zwei-Wochen-Pflicht gilt für das vorzeitige Ende bestimmter Ausbildungen und Erwerbstätigkeiten.", sourceKey: "aufenthg-82", passageKey: "aufenthg-82-all", riskLevel: "high" },
  { key: "premature-end-two-weeks", category: "changes", temporal: "current_2026", type: "deadline", text: "Inhaber einer Aufenthaltserlaubnis nach Kapitel 2 Abschnitt 3 oder 4 müssen innerhalb von zwei Wochen mitteilen, dass die Ausbildung oder Erwerbstätigkeit, für die der Titel erteilt wurde, vorzeitig beendet wurde.", sourceKey: "aufenthg-82", passageKey: "aufenthg-82-all", riskLevel: "high" },
  { key: "address-not-always-two-weeks", category: "changes", temporal: "current_2026", type: "exception", text: "Ein Wohnungswechsel ist nicht automatisch dieselbe Zwei-Wochen-Pflicht wie das vorzeitige Ende der titeltragenden Beschäftigung. Die Anschrift kann aber die Zuständigkeit der Ausländerbehörde ändern.", sourceKey: "aufenthg-82", passageKey: "aufenthg-82-all", riskLevel: "high" },
  { key: "expiry-by-validity", category: "absence", temporal: "current_2026", type: "definition", text: "Der Aufenthaltstitel erlischt unter anderem durch Ablauf seiner Geltungsdauer.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "six-months-not-universal", category: "absence", temporal: "current_2026", type: "exception", text: "Sechs Monate Auslandsaufenthalt sind keine universelle Erlöschensregel für jeden Aufenthaltsstatus.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "brief-trip-not-loss", category: "absence", temporal: "current_2026", type: "exception", text: "Eine kurze Auslandsreise führt nicht automatisch zum Erlöschen des Aufenthaltstitels.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "printed-date-not-only-rule", category: "absence", temporal: "current_2026", type: "exception", text: "Das auf der Karte gedruckte Gültigkeitsdatum beweist nicht, dass der Titel nicht schon nach einer anderen gesetzlichen Regel erloschen ist.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "absence-fail-closed", category: "absence", temporal: "current_2026", type: "exception", text: "Ob ein Titel durch Auslandsaufenthalt erloschen ist, darf ohne genauen Titel und Abwesenheitstatsachen nicht entschieden werden.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "da-eu-different-absence", category: "absence", temporal: "current_2026", type: "definition", text: "Die Erlaubnis zum Daueraufenthalt – EU erlischt nach eigenen, längeren unionsrechtlichen Abwesenheitsfristen und nicht nach der allgemeinen Sechs-Monats-Regel.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "blue-card-12-month-absence", category: "absence", temporal: "current_2026", type: "deadline", text: "Für die Blaue Karte EU und bestimmte Familienangehörige beträgt die Wiedereinreisefrist abweichend zwölf Monate.", sourceKey: "aufenthg-51", passageKey: "aufenthg-51-all", riskLevel: "high" },
  { key: "letter-not-automatically-bescheid", category: "bescheid", temporal: "current_2026", type: "exception", text: "Nicht jedes Schreiben der Ausländerbehörde ist automatisch ein Verwaltungsakt mit Rechtsbehelfsbelehrung.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "do-not-auto-recommend-widerspruch", category: "bescheid", temporal: "current_2026", type: "exception", text: "Aus diesem Orientierungspaket folgt keine Empfehlung, Widerspruch einzulegen. Zuerst sind Bescheid, Rechtsgrundlage und Rechtsbehelfsbelehrung zu lesen.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "bekanntgabe-not-document-date", category: "bescheid", temporal: "current_2026", type: "exception", text: "Das Dokumentdatum ist nicht ohne weiteres der Tag der Bekanntgabe.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "widerspruch-no-automatic-suspension", category: "bescheid", temporal: "current_2026", type: "exception", text: "Widerspruch und Klage haben in den gesetzlich bezeichneten Fällen des § 84 keine aufschiebende Wirkung. Widerspruch ist nicht automatisch die Erlaubnis zu bleiben.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "widerspruch-not-automatic-work", category: "bescheid", temporal: "current_2026", type: "exception", text: "Widerspruch bedeutet nicht automatisch fortgesetzte Erwerbstätigkeit unter unveränderten Bedingungen.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "read-rechtsbehelfsbelehrung", category: "bescheid", temporal: "current_2026", type: "duty", text: "Für Fristen und Rechtsbehelf sind die Rechtsbehelfsbelehrung und die Bekanntgabe des konkreten Bescheids maßgebend.", sourceKey: "aufenthg-84", passageKey: "aufenthg-84-all", riskLevel: "high" },
  { key: "gestattung-asylum-procedure", category: "asylum", temporal: "current_2026", type: "definition", text: "Die Aufenthaltsgestattung erlaubt den Aufenthalt zur Durchführung des Asylverfahrens.", sourceKey: "asylg-55", passageKey: "asylg-55-all", riskLevel: "high" },
  { key: "duldung-is-toleration", category: "asylum", temporal: "current_2026", type: "definition", text: "Die Duldung setzt die Abschiebung vorübergehend aus. Die Ausreisepflicht bleibt unberührt.", sourceKey: "aufenthg-60a", passageKey: "aufenthg-60a-all", riskLevel: "high" },
  { key: "do-not-decide-asylum", category: "asylum", temporal: "current_2026", type: "exception", text: "Dieses Paket entscheidet weder Flüchtlingseigenschaft noch subsidiären Schutz, Dublin-Zuständigkeit oder Abschiebbarkeit.", sourceKey: "bamf-asyl", passageKey: "bamf-asyl-all", riskLevel: "high" },
  { key: "asyl-can-end-81-fiction", category: "asylum", temporal: "current_2026", type: "exception", text: "Die Einreichung eines Asylantrags kann bestimmte kurze Titel und Fiktionswirkungen nach § 81 beenden. Ein Asylantrag ist nicht derselbe Weg wie ein gewöhnlicher Titelantrag.", sourceKey: "asylg-55", passageKey: "asylg-55-all", riskLevel: "high" },
  { key: "ab-domestic-competence", category: "visa", temporal: "current_2026", type: "definition", text: "Für aufenthalts- und passrechtliche Maßnahmen im Inland sind die Ausländerbehörden zuständig.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high" },
  { key: "mission-abroad-visa", category: "visa", temporal: "current_2026", type: "definition", text: "Im Ausland sind für Pass- und Visaangelegenheiten die vom Auswärtigen Amt ermächtigten Auslandsvertretungen zuständig.", sourceKey: "aufenthg-71", passageKey: "aufenthg-71-all", riskLevel: "high" },
  { key: "outside-germany-not-random-ab", category: "visa", temporal: "current_2026", type: "exception", text: "Wer sich außerhalb Deutschlands befindet und ein nationales Visum braucht, wendet sich nicht an eine beliebige inländische Ausländerbehörde.", sourceKey: "aa-visum", passageKey: "aa-visum-all", riskLevel: "high" },
  { key: "not-gkv", category: "boundary", temporal: "current_2026", type: "exception", text: "Dieses Aufenthaltspaket ist nicht das Verfahren der gesetzlichen Krankenversicherung. Ein Versicherungsnachweis kann aufenthaltsrechtlich relevant sein, ersetzt aber das Krankenversicherungspaket nicht.", sourceKey: "aufenthg-5", passageKey: "aufenthg-5-all", riskLevel: "medium" },
  { key: "not-jobcenter", category: "boundary", temporal: "current_2026", type: "exception", text: "Dieses Aufenthaltspaket ist nicht das Grundsicherungsgeldverfahren des Jobcenters.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "medium" },
  { key: "not-alg", category: "boundary", temporal: "current_2026", type: "exception", text: "Dieses Aufenthaltspaket ist nicht das Arbeitslosengeldverfahren der Agentur für Arbeit.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "medium" },
  { key: "not-kindergeld", category: "boundary", temporal: "current_2026", type: "exception", text: "Dieses Aufenthaltspaket ist nicht der Kindergeldantrag und ersetzt nicht das Verfahren der Familienkasse.", sourceKey: "aufenthg-4", passageKey: "aufenthg-4-all", riskLevel: "medium" },
]);

export const AUFENTHALT_PROCESSES = Object.freeze([
  { key: "aufenthaltsstatus-einordnen", title: "Aufenthaltsstatus einordnen 2026", trigger: "Gefragt ist, welchen Status oder welches Dokument die Person hat", safeFirstStep: "Dokument, Rechtsgrundlage und Personengruppe trennen; keinen Titel aus der Staatsangehörigkeit erfinden.", riskLevel: "high" as const },
  { key: "rechtsrahmen-bestimmen", title: "Richtigen Rechtsrahmen bestimmen 2026", trigger: "Unklar ist, ob AufenthG, FreizügG/EU, Asyl oder Visum gilt", safeFirstStep: "Unionsbürger, Drittstaatsangehörige, EU-Familienangehörige, Gestattung und Duldung zuerst unterscheiden.", riskLevel: "high" as const },
  { key: "ersten-titel-inland", title: "Ersten Aufenthaltstitel im Inland beantragen 2026", trigger: "Ein erster Inlandtitel soll beantragt werden", safeFirstStep: "Antrag, Visumerfordernis und Nachweise erklären; visumfreie Inlandbeantragung nicht verallgemeinern.", riskLevel: "high" as const },
  { key: "titel-verlaengern", title: "Aufenthaltstitel verlängern 2026", trigger: "Der Titel läuft ab oder ist bereits abgelaufen", safeFirstStep: "Vor Ablauf beantragen; verspäteten Antrag und Kartenablauf nicht gleichsetzen.", riskLevel: "high" as const },
  { key: "fiktion-klaeren", title: "Fiktionswirkung und Fiktionsbescheinigung klären 2026", trigger: "Eine Fiktionsbescheinigung oder die Fortgeltung ist angesprochen", safeFirstStep: "§ 81 Absatz 3 und 4 trennen; Reisen nicht aus dem Wort Fiktion ableiten.", riskLevel: "high" as const },
  { key: "erwerbstaetigkeit-pruefen", title: "Erwerbstätigkeit aus dem Dokument prüfen 2026", trigger: "Gefragt ist, ob gearbeitet werden darf", safeFirstStep: "Titel, Rechtsgrundlage und Nebenbestimmungen lesen; das Arbeitsangebot nicht als Erlaubnis behandeln.", riskLevel: "high" as const },
  { key: "arbeitgeberwechsel", title: "Arbeitgeber- oder Tätigkeitswechsel klären 2026", trigger: "Der Arbeitgeber oder die Tätigkeit soll wechseln", safeFirstStep: "Ohne genauen Titel fail-closed bleiben; bei der Blauen Karte die Zwölf-Monats-Mitteilung prüfen.", riskLevel: "high" as const },
  { key: "studium-ausbildung", title: "Studium und Ausbildung einordnen 2026", trigger: "Studium, Ausbildung oder studienvorbereitende Maßnahmen sind angesprochen", safeFirstStep: "§ 16b als Studienweg erklären und studentische Erwerbstätigkeit nicht auf jeden Titel übertragen.", riskLevel: "high" as const },
  { key: "fachkraft-route", title: "Beschäftigung und Fachkraft einordnen 2026", trigger: "Fachkraft, Blaue Karte, Chancenkarte oder Selbständigkeit ist angesprochen", safeFirstStep: "Den wahrscheinlichen Kategorie-Weg nennen; Gehaltsschwellen nicht als zeitlose Beträge speichern.", riskLevel: "high" as const },
  { key: "familiennachzug", title: "Familiennachzug einordnen 2026", trigger: "Ehe, Kind oder Elternnachzug ist angesprochen", safeFirstStep: "Deutschen, Drittstaats- und Unionsbürger-Sponsor trennen; Ehe nicht als Automatiktitel behandeln.", riskLevel: "high" as const },
  { key: "eu-freizuegigkeit", title: "EU-Freizügigkeit einordnen 2026", trigger: "Unionsbürger oder EU-Familienangehörige sind angesprochen", safeFirstStep: "Keine gewöhnliche Aufenthaltserlaubnis verlangen; das Freizügigkeitsrecht nicht als unbedingtes Dauerrecht darstellen.", riskLevel: "high" as const },
  { key: "daueraufenthalt", title: "Daueraufenthalt einordnen 2026", trigger: "Niederlassungserlaubnis oder Daueraufenthalt ist gefragt", safeFirstStep: "Niederlassungserlaubnis, Daueraufenthalt-EU und Freizügigkeits-Dauerrecht trennen; fünf Jahre nicht automatisch behandeln.", riskLevel: "high" as const },
  { key: "zweckwechsel", title: "Aufenthaltszweck wechseln 2026", trigger: "Ein anderer Aufenthaltszweck soll begründet werden", safeFirstStep: "Einen anderen Titel vor Ablauf beantragen und nicht jeden Zweckwechsel als frei möglich behandeln.", riskLevel: "high" as const },
  { key: "eat-ersetzen", title: "Elektronischen Aufenthaltstitel erhalten oder ersetzen 2026", trigger: "Ausstellung, Verlust oder Beschädigung des eAT ist angesprochen", safeFirstStep: "Die Karte vom rechtlichen Status trennen und Ersatz bei der zuständigen Behörde verlangen.", riskLevel: "medium" as const },
  { key: "passwechsel", title: "Passwechsel behandeln 2026", trigger: "Der Pass ist abgelaufen oder neu ausgestellt", safeFirstStep: "Passpflicht erklären; den neuen Pass weder ignorieren noch als neuen Aufenthaltsstatus behandeln.", riskLevel: "high" as const },
  { key: "aenderungen-melden", title: "Änderungen während des Aufenthalts melden 2026", trigger: "Beschäftigung, Ausbildung, Anschrift oder persönliche Daten ändern sich", safeFirstStep: "Die gesetzliche Pflicht an die Rechtsgrundlage binden und nicht jede Änderung mit zwei Wochen belegen.", riskLevel: "high" as const },
  { key: "auslandsaufenthalt", title: "Auslandsaufenthalt und Erlöschen prüfen 2026", trigger: "Eine längere Abwesenheit oder Rückkehr ist angesprochen", safeFirstStep: "Sechs Monate nicht universell anwenden; ohne Titel- und Abwesenheitstatsachen fail-closed bleiben.", riskLevel: "high" as const },
  { key: "bescheid-verstehen", title: "Bescheid und Ablehnung verstehen 2026", trigger: "Ein Schreiben oder eine Ablehnung der Ausländerbehörde liegt vor", safeFirstStep: "Prüfen, ob ein Verwaltungsakt vorliegt, und nicht automatisch Widerspruch empfehlen.", riskLevel: "high" as const },
  { key: "rechtsbehelf", title: "Rechtsbehelf sicher einordnen 2026", trigger: "Widerspruch oder Klage gegen einen Aufenthaltsbescheid ist angesprochen", safeFirstStep: "§ 84 lesen: keine automatische aufschiebende Wirkung und keine automatische Arbeitserlaubnis.", riskLevel: "high" as const },
  { key: "zustaendige-behoerde", title: "Zuständige Behörde klären 2026", trigger: "Die örtliche Ausländerbehörde oder eine Auslandsvertretung ist gefragt", safeFirstStep: "Wohnort feststellen; Sprache, Land allein oder eine zufällige Behörde nicht als Zuständigkeit behandeln.", riskLevel: "high" as const },
  { key: "asyl-duldung-gate", title: "Asyl- und Duldungsgrenze erkennen 2026", trigger: "Aufenthaltsgestattung, Duldung oder Schutzstatus ist angesprochen", safeFirstStep: "Gestattung und Duldung vom Aufenthaltstitel trennen und keine Asylentscheidung treffen.", riskLevel: "high" as const },
]);

export const AUFENTHALT_FORMS = Object.freeze([
  { key: "titelantrag", name: "Antrag auf Erteilung oder Verlängerung eines Aufenthaltstitels", identifier: "AUFENTH-Antrag", purpose: "Förmlicher Antrag auf Erteilung, Verlängerung oder Zweckwechsel", submissionChannels: ["in_person", "online"], sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all" },
  { key: "fiktionsbescheinigung", name: "Fiktionsbescheinigung", identifier: "AUFENTH-Fiktion", purpose: "Bescheinigung über die Wirkung der Antragstellung nach § 81", submissionChannels: ["in_person"], sourceKey: "aufenthg-81", passageKey: "aufenthg-81-all" },
  { key: "eat", name: "Elektronischer Aufenthaltstitel", identifier: "AUFENTH-eAT", purpose: "Eigenständiges Dokument über den erteilten Aufenthaltstitel", submissionChannels: ["in_person"], sourceKey: "aufenthg-78", passageKey: "aufenthg-78-all" },
  { key: "aufenthaltskarte", name: "Aufenthaltskarte für Familienangehörige von Unionsbürgern", identifier: "FREIZUEG-Karte", purpose: "Nachweis des Freizügigkeitsrechts nicht unionaler Familienangehöriger", submissionChannels: ["in_person"], sourceKey: "freizueg-5", passageKey: "freizueg-5-all" },
]);

type BindingSpec = Readonly<{
  processKey: string;
  role: AufenthaltProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  qualificationRequired?: boolean;
}>;

export const AUFENTHALT_PROCESS_BINDINGS: readonly BindingSpec[] = Object.freeze([
  { processKey: "aufenthaltsstatus-einordnen", role: "orientation_basis", sequenceContext: "what", claimKeys: ["titel-erfordernis", "titelarten", "ae-zweckgebunden"] },
  { processKey: "aufenthaltsstatus-einordnen", role: "negative_control", sequenceContext: "not", claimKeys: ["nationality-not-entitlement", "anmeldung-not-titel", "eat-not-entire-status"] },
  { processKey: "rechtsrahmen-bestimmen", role: "orientation_basis", sequenceContext: "which", claimKeys: ["process-needs-status-facts", "german-citizen-not-aufenthg", "eu-not-ordinary-titel"] },
  { processKey: "rechtsrahmen-bestimmen", role: "negative_control", sequenceContext: "which_not", qualificationRequired: true, claimKeys: ["eu-not-unconditional", "non-eu-family-not-ordinary-ae", "unclear-status-fail-closed"] },
  { processKey: "ersten-titel-inland", role: "application_route", sequenceContext: "apply", claimKeys: ["application-required", "visa-procedure-requirement", "livelihood-identity-passport", "passpflicht"] },
  { processKey: "ersten-titel-inland", role: "negative_control", sequenceContext: "apply_not", claimKeys: ["not-everyone-domestic-apply", "anmeldung-not-domestic-right"] },
  { processKey: "titel-verlaengern", role: "deadline_gate", sequenceContext: "extend", claimKeys: ["apply-before-expiry", "timely-fiction-continues"] },
  { processKey: "titel-verlaengern", role: "negative_control", sequenceContext: "extend_not", qualificationRequired: true, claimKeys: ["late-not-automatic-fiction", "late-hardship-discretion", "late-81-3-suspension-only", "expired-card-not-automatically-unlawful", "appointment-not-application", "schengen-visa-no-81-4"] },
  { processKey: "fiktion-klaeren", role: "orientation_basis", sequenceContext: "fiction", claimKeys: ["timely-fiction-continues", "fiktion-bescheinigung-issued", "fiktion-81-3-vs-81-4", "fiktion-employment-notation"] },
  { processKey: "fiktion-klaeren", role: "negative_control", sequenceContext: "fiction_not", qualificationRequired: true, claimKeys: ["fiktion-not-new-titel", "fiktion-needs-facts", "travel-fiktion-fail-closed", "fiktion-not-travel-document"] },
  { processKey: "erwerbstaetigkeit-pruefen", role: "evidence_requirement", sequenceContext: "work", claimKeys: ["title-must-show-work", "nebenbestimmungen-on-document"] },
  { processKey: "erwerbstaetigkeit-pruefen", role: "negative_control", sequenceContext: "work_not", qualificationRequired: true, claimKeys: ["title-not-unrestricted-work", "job-offer-not-authorization", "work-permission-fail-closed"] },
  { processKey: "arbeitgeberwechsel", role: "application_route", sequenceContext: "change_job", claimKeys: ["other-job-needs-permission", "ba-consent-boundary", "blue-card-notify-12-months"] },
  { processKey: "arbeitgeberwechsel", role: "negative_control", sequenceContext: "change_job_not", qualificationRequired: true, claimKeys: ["employer-change-needs-title", "new-employer-not-always-allowed", "new-employer-not-always-forbidden"] },
  { processKey: "studium-ausbildung", role: "orientation_basis", sequenceContext: "study", claimKeys: ["studium-16b-route", "student-limit-is-statutory-current"] },
  { processKey: "studium-ausbildung", role: "negative_control", sequenceContext: "study_not", claimKeys: ["student-work-not-universal"] },
  { processKey: "fachkraft-route", role: "orientation_basis", sequenceContext: "skilled", claimKeys: ["fachkraft-18a", "fachkraft-18b", "blue-card-route"] },
  { processKey: "fachkraft-route", role: "negative_control", sequenceContext: "skilled_not", claimKeys: ["salary-threshold-not-timeless", "chancenkarte-route-only", "self-employment-boundary"] },
  { processKey: "familiennachzug", role: "orientation_basis", sequenceContext: "family", claimKeys: ["family-eu-citizen-freizug", "subsidiary-36a-suspended-until-2027"] },
  { processKey: "familiennachzug", role: "negative_control", sequenceContext: "family_not", claimKeys: ["family-german-not-automatic", "family-tcn-not-automatic", "marriage-not-permanent", "sham-not-decide"] },
  { processKey: "eu-freizuegigkeit", role: "orientation_basis", sequenceContext: "eu", claimKeys: ["eu-not-ordinary-titel", "aufenthaltskarte-not-ae"] },
  { processKey: "eu-freizuegigkeit", role: "negative_control", sequenceContext: "eu_not", claimKeys: ["eu-not-unconditional", "non-eu-family-not-ordinary-ae"] },
  { processKey: "daueraufenthalt", role: "orientation_basis", sequenceContext: "permanent", claimKeys: ["ne-is-settlement", "da-eu-is-different"] },
  { processKey: "daueraufenthalt", role: "negative_control", sequenceContext: "permanent_not", qualificationRequired: true, claimKeys: ["ne-not-daueraufenthalt-eu", "freizug-daueraufenthalt-different", "five-years-not-automatic", "individual-permanent-fail-closed"] },
  { processKey: "zweckwechsel", role: "application_route", sequenceContext: "purpose", claimKeys: ["purpose-change-application"] },
  { processKey: "zweckwechsel", role: "negative_control", sequenceContext: "purpose_not", claimKeys: ["not-every-ae-can-change"] },
  { processKey: "eat-ersetzen", role: "application_route", sequenceContext: "card", claimKeys: ["eat-is-document", "biometrics-for-eat", "decision-then-document", "lost-eat-replace"] },
  { processKey: "eat-ersetzen", role: "negative_control", sequenceContext: "card_not", claimKeys: ["eat-not-entire-status"] },
  { processKey: "passwechsel", role: "application_route", sequenceContext: "passport", claimKeys: ["passpflicht"] },
  { processKey: "passwechsel", role: "negative_control", sequenceContext: "passport_not", claimKeys: ["new-passport-not-new-status", "expired-passport-not-ignore", "pass-change-not-lose-title"] },
  { processKey: "aenderungen-melden", role: "deadline_gate", sequenceContext: "report", claimKeys: ["cooperation-unverzueglich", "premature-end-two-weeks"] },
  { processKey: "aenderungen-melden", role: "negative_control", sequenceContext: "report_not", claimKeys: ["two-week-not-every-change", "address-not-always-two-weeks"] },
  { processKey: "auslandsaufenthalt", role: "orientation_basis", sequenceContext: "absence", claimKeys: ["expiry-by-validity", "da-eu-different-absence", "blue-card-12-month-absence"] },
  { processKey: "auslandsaufenthalt", role: "negative_control", sequenceContext: "absence_not", qualificationRequired: true, claimKeys: ["six-months-not-universal", "brief-trip-not-loss", "printed-date-not-only-rule", "absence-fail-closed"] },
  { processKey: "bescheid-verstehen", role: "next_state", sequenceContext: "decision", claimKeys: ["read-rechtsbehelfsbelehrung"] },
  { processKey: "bescheid-verstehen", role: "negative_control", sequenceContext: "decision_not", claimKeys: ["letter-not-automatically-bescheid", "do-not-auto-recommend-widerspruch"] },
  { processKey: "rechtsbehelf", role: "context_gate", sequenceContext: "remedy", qualificationRequired: true, claimKeys: ["widerspruch-no-automatic-suspension", "widerspruch-not-automatic-work", "bekanntgabe-not-document-date"] },
  { processKey: "zustaendige-behoerde", role: "orientation_basis", sequenceContext: "where", claimKeys: ["ab-domestic-competence", "mission-abroad-visa"] },
  { processKey: "zustaendige-behoerde", role: "negative_control", sequenceContext: "where_not", qualificationRequired: true, claimKeys: ["userlocale-not-jurisdiction", "language-not-jurisdiction", "land-alone-not-enough", "no-locality-no-authority", "opening-hours-are-live", "processing-times-live", "outside-germany-not-random-ab"] },
  { processKey: "asyl-duldung-gate", role: "orientation_basis", sequenceContext: "asylum", claimKeys: ["gestattung-asylum-procedure", "duldung-is-toleration"] },
  { processKey: "asyl-duldung-gate", role: "negative_control", sequenceContext: "asylum_not", claimKeys: ["gestattung-not-titel", "duldung-not-titel", "do-not-decide-asylum", "asyl-can-end-81-fiction"] },
  { processKey: "aufenthaltsstatus-einordnen", role: "next_state", sequenceContext: "downstream", claimKeys: ["not-gkv", "not-jobcenter", "not-alg", "not-kindergeld", "registered-address-not-status"] },
  { processKey: "aufenthaltsstatus-einordnen", role: "orientation_basis", sequenceContext: "types", claimKeys: ["schengen-not-national", "visum-not-ae", "aufenthaltskarte-not-ae", "blue-card-not-ordinary-ae"] },
]);

export const AUFENTHALT_PROCESS_SCENARIOS: readonly AufenthaltProcessScenario[] = Object.freeze([
  { id: "eu-asks-ae", label: "Unionsbürger fragt nach Aufenthaltserlaubnis", coverage: "COVERED", requiredClaimKeys: ["eu-not-ordinary-titel"], requiredProcessKeys: ["eu-freizuegigkeit"] },
  { id: "tcn-valid-ae", label: "Drittstaatsangehörige mit gültiger Aufenthaltserlaubnis", coverage: "COVERED", requiredClaimKeys: ["ae-zweckgebunden", "titel-erfordernis"], requiredProcessKeys: ["aufenthaltsstatus-einordnen"] },
  { id: "title-expires-soon", label: "Titel läuft bald ab", coverage: "COVERED", requiredClaimKeys: ["apply-before-expiry"], requiredProcessKeys: ["titel-verlaengern"] },
  { id: "title-already-expired", label: "Titel bereits abgelaufen", coverage: "COVERED", requiredClaimKeys: ["expired-card-not-automatically-unlawful", "late-not-automatic-fiction"], requiredProcessKeys: ["titel-verlaengern"] },
  { id: "timely-extension-pending", label: "Rechtzeitige Verlängerung anhängig", coverage: "COVERED", requiredClaimKeys: ["timely-fiction-continues"], requiredProcessKeys: ["fiktion-klaeren"] },
  { id: "late-extension", label: "Verspäteter Verlängerungsantrag", coverage: "COVERED", requiredClaimKeys: ["late-not-automatic-fiction", "late-hardship-discretion"], requiredProcessKeys: ["titel-verlaengern"] },
  { id: "fiktionsbescheinigung", label: "Fiktionsbescheinigung", coverage: "COVERED", requiredClaimKeys: ["fiktion-bescheinigung-issued", "fiktion-not-new-titel"], requiredProcessKeys: ["fiktion-klaeren"], requiredFormIdentifiers: ["AUFENTH-Fiktion"] },
  { id: "uncertain-fiktion", label: "Unklare Fiktionswirkung", coverage: "COVERED", requiredClaimKeys: ["fiktion-needs-facts"], requiredProcessKeys: ["fiktion-klaeren"] },
  { id: "work-restriction-unclear", label: "Erwerbsbeschränkung unklar", coverage: "COVERED", requiredClaimKeys: ["work-permission-fail-closed", "title-must-show-work"], requiredProcessKeys: ["erwerbstaetigkeit-pruefen"] },
  { id: "employer-change", label: "Arbeitgeberwechsel", coverage: "COVERED", requiredClaimKeys: ["employer-change-needs-title", "new-employer-not-always-allowed"], requiredProcessKeys: ["arbeitgeberwechsel"] },
  { id: "employment-ends-early", label: "Beschäftigung endet vorzeitig", coverage: "COVERED", requiredClaimKeys: ["premature-end-two-weeks"], requiredProcessKeys: ["aenderungen-melden"] },
  { id: "student-title", label: "Studentischer Titel", coverage: "COVERED", requiredClaimKeys: ["studium-16b-route", "student-work-not-universal"], requiredProcessKeys: ["studium-ausbildung"] },
  { id: "skilled-title", label: "Fachkrafttitel", coverage: "COVERED", requiredClaimKeys: ["fachkraft-18a", "fachkraft-18b"], requiredProcessKeys: ["fachkraft-route"] },
  { id: "blue-card", label: "Blaue Karte EU", coverage: "COVERED", requiredClaimKeys: ["blue-card-route", "blue-card-not-ordinary-ae"], requiredProcessKeys: ["fachkraft-route"] },
  { id: "family-to-german", label: "Familiennachzug zu Deutschen", coverage: "COVERED", requiredClaimKeys: ["family-german-not-automatic"], requiredProcessKeys: ["familiennachzug"] },
  { id: "family-to-tcn", label: "Familiennachzug zu Drittstaatsangehörigen", coverage: "COVERED", requiredClaimKeys: ["family-tcn-not-automatic"], requiredProcessKeys: ["familiennachzug"] },
  { id: "family-to-eu", label: "Familie eines Unionsbürgers", coverage: "COVERED", requiredClaimKeys: ["family-eu-citizen-freizug", "aufenthaltskarte-not-ae"], requiredProcessKeys: ["eu-freizuegigkeit"] },
  { id: "permanent-question", label: "Frage nach Daueraufenthalt", coverage: "COVERED", requiredClaimKeys: ["five-years-not-automatic", "individual-permanent-fail-closed"], requiredProcessKeys: ["daueraufenthalt"] },
  { id: "ne-vs-da-eu", label: "Niederlassungserlaubnis gegen Daueraufenthalt-EU", coverage: "COVERED", requiredClaimKeys: ["ne-not-daueraufenthalt-eu"], requiredProcessKeys: ["daueraufenthalt"] },
  { id: "new-passport", label: "Neuer Pass", coverage: "COVERED", requiredClaimKeys: ["new-passport-not-new-status", "pass-change-not-lose-title"], requiredProcessKeys: ["passwechsel"] },
  { id: "lost-eat", label: "Verlorener eAT", coverage: "COVERED", requiredClaimKeys: ["lost-eat-replace"], requiredProcessKeys: ["eat-ersetzen"], requiredFormIdentifiers: ["AUFENTH-eAT"] },
  { id: "address-change", label: "Wohnungswechsel", coverage: "COVERED", requiredClaimKeys: ["address-not-always-two-weeks"], requiredProcessKeys: ["aenderungen-melden"] },
  { id: "long-stay-abroad", label: "Langer Auslandsaufenthalt", coverage: "COVERED", requiredClaimKeys: ["six-months-not-universal", "absence-fail-closed"], requiredProcessKeys: ["auslandsaufenthalt"] },
  { id: "return-after-absence", label: "Rückkehr nach langer Abwesenheit", coverage: "COVERED", requiredClaimKeys: ["printed-date-not-only-rule"], requiredProcessKeys: ["auslandsaufenthalt"] },
  { id: "negative-bescheid", label: "Ablehnungsbescheid", coverage: "COVERED", requiredClaimKeys: ["letter-not-automatically-bescheid", "read-rechtsbehelfsbelehrung"], requiredProcessKeys: ["bescheid-verstehen"] },
  { id: "widerspruch-question", label: "Widerspruchsfrage", coverage: "COVERED", requiredClaimKeys: ["widerspruch-no-automatic-suspension", "do-not-auto-recommend-widerspruch"], requiredProcessKeys: ["rechtsbehelf"] },
  { id: "outside-germany-visa", label: "Person außerhalb Deutschlands braucht Visum", coverage: "COVERED", requiredClaimKeys: ["outside-germany-not-random-ab", "mission-abroad-visa"], requiredProcessKeys: ["zustaendige-behoerde"] },
  { id: "duldung", label: "Duldung", coverage: "COVERED", requiredClaimKeys: ["duldung-not-titel", "duldung-is-toleration"], requiredProcessKeys: ["asyl-duldung-gate"] },
  { id: "gestattung", label: "Aufenthaltsgestattung", coverage: "COVERED", requiredClaimKeys: ["gestattung-not-titel", "gestattung-asylum-procedure"], requiredProcessKeys: ["asyl-duldung-gate"] },
  { id: "asylum-protection", label: "Asyl- oder Schutzfrage", coverage: "COVERED", requiredClaimKeys: ["do-not-decide-asylum"], requiredProcessKeys: ["asyl-duldung-gate"] },
  { id: "authority-unknown", label: "Behörde oder Ort unbekannt", coverage: "COVERED", requiredClaimKeys: ["no-locality-no-authority", "userlocale-not-jurisdiction"], requiredProcessKeys: ["zustaendige-behoerde"] },
  { id: "work-from-user-statement", label: "Arbeitserlaubnis nur nach Nutzerangabe", coverage: "COVERED", requiredClaimKeys: ["work-permission-fail-closed"], requiredProcessKeys: ["erwerbstaetigkeit-pruefen"] },
  { id: "travel-with-fiktion", label: "Reise mit Fiktionsbescheinigung", coverage: "COVERED", requiredClaimKeys: ["travel-fiktion-fail-closed", "fiktion-not-travel-document"], requiredProcessKeys: ["fiktion-klaeren"] },
  { id: "anmeldung-confused", label: "Anmeldung mit Aufenthaltsstatus verwechselt", coverage: "COVERED", requiredClaimKeys: ["anmeldung-not-titel", "registered-address-not-status"], requiredProcessKeys: ["aufenthaltsstatus-einordnen"] },
  { id: "schengen-vs-national", label: "Schengen- gegen nationales Visum", coverage: "COVERED", requiredClaimKeys: ["schengen-not-national", "visum-not-ae"], requiredProcessKeys: ["aufenthaltsstatus-einordnen"] },
  { id: "subsidiary-family-2026", label: "Familiennachzug zu subsidiärem Schutz 2026", coverage: "COVERED", requiredClaimKeys: ["subsidiary-36a-suspended-until-2027"], requiredProcessKeys: ["familiennachzug"] },
  { id: "purpose-change", label: "Zweckwechsel", coverage: "COVERED", requiredClaimKeys: ["purpose-change-application", "not-every-ae-can-change"], requiredProcessKeys: ["zweckwechsel"] },
  { id: "full-asylum-merits", label: "Vollständige Asylprüfung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Grenze und Routing." },
  { id: "dublin", label: "Dublin-Zuständigkeit", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Dublin-Prüfung." },
  { id: "deportation-execution", label: "Abschiebungsvollzug", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Keine Vollstreckungsberatung." },
  { id: "citizenship", label: "Einbürgerung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein Staatsangehörigkeitsrecht." },
  { id: "full-visa-catalog", label: "Vollständiger Visakatalog Ausland", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Zuständigkeitsgrenze." },
  { id: "full-skilled-engine", label: "Vollständige Fachkräftezulassung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Kategorie-Routing." },
  { id: "full-family-engine", label: "Vollständige Familienzulasung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Orientierung und aktuelle Übergangssperre." },
  { id: "travel-guarantee", label: "Reise- oder Wiedereinreisegarantie", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Immer fail-closed." },
  { id: "hardship-commission", label: "Härtefallkommission", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Kein Härtefallverfahren." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "aufenthg-81", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "aufenthg-4a", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "aufenthg-51", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "aufenthg-71", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
  { sourceKey: "aufenthg-84", informationClass: "REQUIRED_EVIDENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
]);

export function evaluateAufenthaltProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = AUFENTHALT_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = AUFENTHALT_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildAufenthaltFederalCorePack(): CuratedDomainPack {
  const item = factory(AUFENTHALT_PACK_ID);
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
    bmi: item("publishers", "bmi", {
      name: "Bundesministerium des Innern",
      type: "federal_ministry",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bund: item("publishers", "bundesportal", {
      name: "Bundesportal",
      type: "federal_service_portal",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    aa: item("publishers", "auswaertiges-amt", {
      name: "Auswärtiges Amt",
      type: "federal_ministry",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
    bamf: item("publishers", "bamf", {
      name: "Bundesamt für Migration und Flüchtlinge",
      type: "federal_agency",
      territorialScopeId: scope.id,
      trustDomainId: trustDomain.id,
    }),
  };
  const authorities = {
    bmi: item("authorities", "bundesministerium-inneres", {
      publisherId: publishers.bmi.id,
      name: "Bundesministerium des Innern",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bmi.bund.de/DE/themen/migration/aufenthaltsrecht/aufenthaltsrecht-node.html",
    }),
    aa: item("authorities", "auswaertiges-amt", {
      publisherId: publishers.aa.id,
      name: "Auswärtiges Amt",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt/visabestimmungen-node",
    }),
    bamf: item("authorities", "bundesamt-migration-fluechtlinge", {
      publisherId: publishers.bamf.id,
      name: "Bundesamt für Migration und Flüchtlinge",
      type: "federal_agency",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bamf.de/DE/Themen/AsylFluechtlingsschutz/AblaufAsylverfahren/ablaufasylverfahren-node.html",
    }),
  };

  const sources = AUFENTHALT_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = AUFENTHALT_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`AUFENTHALT_UNIT_SOURCE_MISSING:${unit.key}`);
    const claim = item("claims", unit.key, {
      type: unit.type,
      text: unit.text,
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      authorityId: source.source.authorityId,
      riskLevel: unit.riskLevel,
      requiresEffectiveDate: false,
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
    if (!source) throw new Error(`AUFENTHALT_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = AUFENTHALT_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: AUFENTHALT_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "zustaendige-behoerde",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = AUFENTHALT_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`AUFENTHALT_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`AUFENTHALT_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
      return item("processClaimLinks", `${binding.processKey}:${claimKey}:${binding.role}`, {
        processId: process.id,
        claimId: claim.id,
        role: binding.role,
        required: true,
        sequenceContext: binding.sequenceContext,
        qualificationRequired: binding.qualificationRequired === true,
      });
    });
  });

  const inspectRule = item("actorRules", "inspect-aufenthalt-bescheid-before-widerspruch", {
    actorState: "inspect_aufenthalt_bescheid_before_widerspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-auslaenderbehoerde-undetermined", {
    actorState: "competent_auslaenderbehoerde_undetermined_without_locality",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const statusRule = item("actorRules", "residence-status-undetermined", {
    actorState: "residence_status_undetermined_without_document_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const workRule = item("actorRules", "work-permission-undetermined", {
    actorState: "work_permission_undetermined_without_title_restrictions",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const travelRule = item("actorRules", "travel-reentry-undetermined", {
    actorState: "travel_reentry_undetermined_from_fiktionsbescheinigung_alone",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const absenceRule = item("actorRules", "absence-expiry-undetermined", {
    actorState: "absence_expiry_undetermined_without_title_and_absence_facts",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = AUFENTHALT_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`AUFENTHALT_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: AUFENTHALT_PACK_ID,
    domain: AUFENTHALT_DOMAIN,
    canonicalLanguage: AUFENTHALT_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmi, publishers.bund, publishers.aa, publishers.bamf],
    authorities: [authorities.bmi, authorities.aa, authorities.bamf],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectRule, competenceRule, statusRule, workRule, travelRule, absenceRule],
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

export function aufenthaltPackSummary(pack: CuratedDomainPack = buildAufenthaltFederalCorePack()) {
  const completeness = evaluateAufenthaltProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: AUFENTHALT_UNITS.length,
    futureWatchCount: AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: AUFENTHALT_G3_PROCESS_STEP_LIMITATION,
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
