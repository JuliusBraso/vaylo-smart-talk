/**
 * KNOWLEDGE-EXPANSION — German federal Jobcenter / Grundsicherungsgeld
 * process-complete pack.
 * Official-source G3 CuratedDomainPack for domain
 * jobcenter_buergergeld (existing taxonomy identifier reused).
 * Canonical language is German only. Not a runtime route.
 *
 * Current public term: Grundsicherungsgeld (SGB II, from 1 July 2026).
 * Legacy / transitional document term: Bürgergeld.
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

export const JOBCENTER_DOMAIN = "jobcenter_buergergeld" as const;
export const JOBCENTER_PACK_ID = JOBCENTER_DOMAIN;
export const JOBCENTER_CANONICAL_LANGUAGE = "de" as const;

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

export type JobcenterUnitCategory =
  | "orientation"
  | "eligibility"
  | "application"
  | "calculation"
  | "housing"
  | "decision_payment"
  | "change_report"
  | "cooperation"
  | "minderung"
  | "bescheid"
  | "widerspruch"
  | "overpayment"
  | "emergency"
  | "health_interface"
  | "cross_border"
  | "competence";

export type JobcenterContextKey =
  | "EVENT_DATE"
  | "PROCESS_VARIANT"
  | "BUNDESLAND"
  | "RESIDENCE_STATE"
  | "WORK_STATE"
  | "COUNTRY";
export type JobcenterHandlingMode =
  | "STORE_CANONICALLY"
  | "CACHE_AND_REVALIDATE"
  | "FETCH_LIVE"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
export type JobcenterFreshnessClass = "LEGAL_CHANGE_MONITORED" | "MONTHLY" | "EVENT_DRIVEN";
export type JobcenterStaleBehavior = "DO_NOT_USE_STALE" | "REVALIDATE_BEFORE_USE";
export type JobcenterInformationClass =
  | "LEGAL_BASELINE"
  | "PROCESS_IDENTITY"
  | "AUTHORITY_COMPETENCE"
  | "ELIGIBILITY"
  | "DEADLINE"
  | "REQUIRED_EVIDENCE"
  | "FORM_URL"
  | "ONLINE_SERVICE_URL";
export type JobcenterProcessRole =
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
export type JobcenterScenarioCoverage =
  | "COVERED"
  | "OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export const JOBCENTER_G3_PROCESS_STEP_LIMITATION =
  "G3 CuratedDomainPack and knowledge_ingest_curated_domain_pack persist processes and process_claim_links with process_step_id null; knowledge_process_steps are not ingestible without a later factory extension.";

export type JobcenterTemporalClass = "current_2026";

export type JobcenterFutureChangeWatchItem = Readonly<{
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
  authorityKey: "jobcenter" | "ba" | "bmas";
  url: string;
  officialDomain: string;
  title: string;
  sourceClass: "FEDERAL_LAW" | "FEDERAL_ADMINISTRATIVE_GUIDANCE" | "FEDERAL_SERVICE_PORTAL" | "OFFICIAL_FORM" | "OFFICIAL_ONLINE_SERVICE";
  sourceType: "federal_statute" | "federal_guidance" | "authority_portal";
  retrievalMethod: "HTML_DOCUMENT" | "PDF_DOCUMENT";
  informationClass: JobcenterInformationClass;
  handlingMode: JobcenterHandlingMode;
  freshnessClass: JobcenterFreshnessClass;
  staleBehavior: JobcenterStaleBehavior;
  requiredContextKeys: readonly JobcenterContextKey[];
  passages: readonly Readonly<{ key: string; locator: string; text: string }>[];
}>;

type UnitSpec = Readonly<{
  key: string;
  category: JobcenterUnitCategory;
  temporal: JobcenterTemporalClass;
  type: "duty" | "deadline" | "definition" | "procedure" | "exception";
  text: string;
  sourceKey: string;
  passageKey: string;
  riskLevel: "low" | "medium" | "high";
  requiresEffectiveDate?: true;
  requiresAuthorityResolution?: true;
  requiredContextKeys?: readonly JobcenterContextKey[];
}>;

export const JOBCENTER_FUTURE_WATCH_SOURCE = Object.freeze({
  url: "https://www.gesetze-im-internet.de/sgb_2/__20.html",
  officialDomain: "www.gesetze-im-internet.de",
  title: "SGB II § 20 Regelbedarf zur Sicherung des Lebensunterhalts",
});

export const JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS: readonly JobcenterFutureChangeWatchItem[] = Object.freeze([
  {
    id: "jobcenter-future-watch-regelbedarf-2027",
    key: "regelbedarf-2027-euro-amounts",
    officialSourceUrl: JOBCENTER_FUTURE_WATCH_SOURCE.url,
    officialDomain: JOBCENTER_FUTURE_WATCH_SOURCE.officialDomain,
    officialSourceTitle: JOBCENTER_FUTURE_WATCH_SOURCE.title,
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Künftige Regelbedarfsstufen-Eurobeträge für 2027 sind keine aktuelle kanonische Wahrheit und dürfen nicht als zeitloses Recht ingestiert werden.",
  },
  {
    id: "jobcenter-future-watch-altersrente-vorrang-2027",
    key: "altersrente-vorrang-ab-2027",
    officialSourceUrl: "https://www.gesetze-im-internet.de/sgb_2/__12a.html",
    officialDomain: "www.gesetze-im-internet.de",
    officialSourceTitle: "SGB II § 12a Vorrangige Leistungen",
    targetYear: 2027,
    status: "future_change_watch_not_ingestible",
    currentGuidance: false,
    description: "Die bis 31. Dezember 2026 geltende Maßgabe, vorzeitige Altersrente nicht in Anspruch nehmen zu müssen, ist keine unbefristete Regel für 2027.",
  },
]);

export const JOBCENTER_OFFICIAL_SOURCES: readonly OfficialSourceSpec[] = Object.freeze([
  {
    key: "sgb2-3a",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__3a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 3a Vorrang der Vermittlung",
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
        key: "sgb2-3a-all",
        locator: "SGB II § 3a",
        text: "Die Vermittlung von erwerbsfähigen Leistungsberechtigten in Ausbildung oder Arbeit hat Vorrang vor den Leistungen zur Sicherung des Lebensunterhalts. Der Vermittlungsvorrang gilt auch gegenüber sonstigen Eingliederungsleistungen. Eine Ausnahme kann bestehen, wenn eine Eingliederungsleistung für eine dauerhafte Eingliederung erfolgversprechender ist, insbesondere bei Personen unter 30 Jahren.",
      },
    ],
  },
  {
    key: "sgb2-7",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__7.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 7 Leistungsberechtigte",
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
        key: "sgb2-7-1",
        locator: "SGB II § 7 Abs. 1 Satz 1",
        text: "Leistungen nach dem SGB II erhalten Personen, die das 15. Lebensjahr vollendet und die Altersgrenze nach § 7a noch nicht erreicht haben, erwerbsfähig und hilfebedürftig sind und ihren gewöhnlichen Aufenthalt in der Bundesrepublik Deutschland haben. Arbeitslosigkeit allein begründet keinen Anspruch. Erwerbstätigkeit schließt den Anspruch nicht automatisch aus.",
      },
      {
        key: "sgb2-7-foreign",
        locator: "SGB II § 7 Abs. 1 Satz 2 bis 6",
        text: "Ausländerinnen und Ausländer können nach näherer Maßgabe des § 7 Absatz 1 Satz 2 vom Leistungsbezug ausgenommen sein, etwa in den ersten drei Monaten, bei fehlendem Aufenthaltsrecht, bei einem Aufenthaltsrecht allein zur Arbeitsuche oder als Leistungsberechtigte nach dem Asylbewerberleistungsgesetz. Unionsbürgerschaft, Staatsangehörigkeit oder Wohnsitz allein entscheiden den Anspruch nicht. Die aufenthaltsrechtlichen Bestimmungen bleiben unberührt.",
      },
      {
        key: "sgb2-7-bg",
        locator: "SGB II § 7 Abs. 2, 3 und 3a",
        text: "Leistungen erhalten auch Personen, die mit erwerbsfähigen Leistungsberechtigten in einer Bedarfsgemeinschaft leben. Zur Bedarfsgemeinschaft gehören insbesondere die erwerbsfähigen Leistungsberechtigten, Partnerinnen und Partner sowie unverheiratete Kinder unter 25 Jahren unter den gesetzlichen Voraussetzungen. Ehe oder dieselbe Anschrift allein klassifiziert nicht automatisch jede Haushaltsbeziehung.",
      },
    ],
  },
  {
    key: "sgb2-7b",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__7b.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 7b Erreichbarkeit",
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
        key: "sgb2-7b-all",
        locator: "SGB II § 7b",
        text: "Erwerbsfähige Leistungsberechtigte erhalten Leistungen, wenn sie erreichbar sind. Erreichbar sind sie, wenn sie sich im näheren Bereich des zuständigen Jobcenters aufhalten und werktäglich dessen Mitteilungen zur Kenntnis nehmen können. Abwesenheit außerhalb des näheren Bereichs braucht in der Regel einen wichtigen Grund und die Zustimmung des Jobcenters. Wer drei aufeinanderfolgenden Meldeaufforderungen ohne wichtigen Grund nicht nachkommt, gilt als nicht erreichbar; der Leistungsanspruch entfällt mit Beginn des folgenden Kalendermonats, mit einer einmonatigen Restzahlung ohne Regelbedarf und der Möglichkeit, sich persönlich wieder zu melden.",
      },
    ],
  },
  {
    key: "sgb2-8",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__8.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 8 Erwerbsfähigkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb2-8-all",
        locator: "SGB II § 8",
        text: "Erwerbsfähig ist, wer nicht wegen Krankheit oder Behinderung auf absehbare Zeit außerstande ist, unter den üblichen Bedingungen des allgemeinen Arbeitsmarktes mindestens drei Stunden täglich erwerbstätig zu sein. Ausländerinnen und Ausländer können im Sinne dieser Vorschrift nur erwerbstätig sein, wenn ihnen die Aufnahme einer Beschäftigung erlaubt ist oder erlaubt werden könnte.",
      },
    ],
  },
  {
    key: "sgb2-9",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__9.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 9 Hilfebedürftigkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ELIGIBILITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb2-9-all",
        locator: "SGB II § 9",
        text: "Hilfebedürftig ist, wer seinen Lebensunterhalt nicht oder nicht ausreichend aus dem zu berücksichtigenden Einkommen oder Vermögen sichern kann und die erforderliche Hilfe nicht von anderen erhält. In einer Bedarfsgemeinschaft sind auch Einkommen und Vermögen der Partnerin oder des Partners zu berücksichtigen. Einkommen allein bedeutet nicht automatisch, dass kein Anspruch auf Grundsicherungsgeld besteht.",
      },
    ],
  },
  {
    key: "sgb2-12",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__12.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 12 Zu berücksichtigendes Vermögen",
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
        key: "sgb2-12-all",
        locator: "SGB II § 12",
        text: "Verwertbare Vermögensgegenstände sind grundsätzlich zu berücksichtigen. Nicht zu berücksichtigen sind unter anderem angemessener Hausrat, ein angemessenes Kraftfahrzeug je erwerbsfähiger Person, bestimmte Altersvorsorge und selbst genutztes Wohneigentum in den gesetzlichen Wohnflächengrenzen. Vom Vermögen ist für jede Person der Bedarfsgemeinschaft ein vom Lebensalter abhängiger Freibetrag abzusetzen. Eine Vermögenskarenzzeit besteht nach der Neufassung nicht mehr; die individuelle Vermögenslage darf ohne die konkreten Vermögensangaben nicht entschieden werden.",
      },
    ],
  },
  {
    key: "sgb2-12a",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__12a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 12a Vorrangige Leistungen",
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
        key: "sgb2-12a-all",
        locator: "SGB II § 12a",
        text: "Leistungsberechtigte sind verpflichtet, Sozialleistungen anderer Träger in Anspruch zu nehmen, soweit dies Hilfebedürftigkeit vermeidet oder vermindert. Wohngeld oder Kinderzuschlag müssen nicht in Anspruch genommen werden, wenn dadurch die Hilfebedürftigkeit aller Mitglieder der Bedarfsgemeinschaft nicht für mindestens drei Monate beseitigt würde. Bis zum 31. Dezember 2026 müssen Leistungsberechtigte eine vorzeitige Altersrente nicht in Anspruch nehmen.",
      },
    ],
  },
  {
    key: "sgb2-15",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__15.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 15 Potenzialanalyse und Kooperationsplan",
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
        key: "sgb2-15-all",
        locator: "SGB II § 15",
        text: "Nach der Potenzialanalyse soll unverzüglich gemeinsam ein Kooperationsplan erstellt werden. Er enthält ein persönliches Angebot der Beratung, Unterstützung oder Vermittlung und hält das Eingliederungsziel sowie die wesentlichen Schritte fest. Das erste Gespräch zur Erstellung der Potenzialanalyse und des Kooperationsplans findet persönlich im Jobcenter statt; hiervon kann nur in begründeten Ausnahmefällen abgewichen werden.",
      },
    ],
  },
  {
    key: "sgb2-15a",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__15a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 15a Verpflichtung",
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
        key: "sgb2-15a-all",
        locator: "SGB II § 15a",
        text: "Erbringt die erwerbsfähige leistungsberechtigte Person die Schritte aus dem Kooperationsplan nicht oder kommt ein Kooperationsplan nicht zustande, verpflichtet die Agentur für Arbeit sie durch schriftlichen Verwaltungsakt zur Mitwirkung. Liegt ein Kooperationsplan vor, ist er bei dem Verwaltungsakt zu berücksichtigen.",
      },
    ],
  },
  {
    key: "sgb2-19",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__19.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 19 Grundsicherungsgeld und Leistungen für Bildung und Teilhabe",
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
        key: "sgb2-19-all",
        locator: "SGB II § 19",
        text: "Erwerbsfähige Leistungsberechtigte erhalten Grundsicherungsgeld. Nichterwerbsfähige Leistungsberechtigte in einer Bedarfsgemeinschaft erhalten Grundsicherungsgeld, soweit sie keinen Anspruch auf Leistungen nach dem Vierten Kapitel SGB XII haben. Die Leistungen umfassen den Regelbedarf, Mehrbedarfe und den Bedarf für Unterkunft und Heizung, soweit diese nicht durch zu berücksichtigendes Einkommen und Vermögen gedeckt sind.",
      },
    ],
  },
  {
    key: "sgb2-20",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__20.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 20 Regelbedarf zur Sicherung des Lebensunterhalts",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb2-20-all",
        locator: "SGB II § 20 Abs. 1 und 1a",
        text: "Der Regelbedarf umfasst insbesondere Ernährung, Kleidung, Körperpflege, Hausrat, Haushaltsenergie ohne Heizung und Warmwasser sowie persönliche Bedürfnisse des täglichen Lebens und wird als monatlicher Pauschalbetrag berücksichtigt. Die Höhe richtet sich nach der jeweiligen Regelbedarfsstufe nach SGB XII in Verbindung mit dem Regelbedarfs-Ermittlungsgesetz und der für das jeweilige Jahr geltenden Fortschreibungsverordnung. Ein Eurobetrag des Regelbedarfs ist keine zeitlose Rechtsgröße.",
      },
    ],
  },
  {
    key: "sgb2-22",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__22.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 22 Bedarfe für Unterkunft und Heizung",
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
        key: "sgb2-22-karenz",
        locator: "SGB II § 22 Abs. 1",
        text: "Bedarfe für Unterkunft und Heizung werden in Höhe der tatsächlichen Aufwendungen anerkannt, soweit diese angemessen sind. Für die Unterkunft gilt eine Karenzzeit von einem Jahr; innerhalb der Karenzzeit werden die tatsächlichen Unterkunftsaufwendungen anerkannt, jedoch nicht, soweit sie mehr als eineinhalbmal so hoch sind wie die abstrakt angemessenen Aufwendungen. Die örtlichen Angemessenheitsgrenzen sind keine bundesweit einheitliche Eurokonstante.",
      },
      {
        key: "sgb2-22-move",
        locator: "SGB II § 22 Abs. 4 bis 8",
        text: "Vor Abschluss eines Vertrages über eine neue Unterkunft soll die Zusicherung des örtlich zuständigen kommunalen Trägers eingeholt werden. Ein Umzug bedeutet nicht automatisch die Anerkennung der neuen Unterkunftskosten. Aufwendungen für eine Mietkaution sollen als Darlehen erbracht werden. Schulden können übernommen werden, soweit dies zur Sicherung der Unterkunft gerechtfertigt ist, und sollen übernommen werden, wenn sonst Wohnungslosigkeit droht.",
      },
      {
        key: "sgb2-22-credit",
        locator: "SGB II § 22 Abs. 3",
        text: "Rückzahlungen und Guthaben, die dem Bedarf für Unterkunft und Heizung zuzuordnen sind, mindern die Aufwendungen nach dem Monat der Rückzahlung oder Gutschrift. Eine hohe Miete bedeutet nicht automatisch den sofortigen vollständigen Wegfall der Unterkunftsleistung.",
      },
    ],
  },
  {
    key: "sgb2-24",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__24.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 24 Abweichende Erbringung von Leistungen",
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
        key: "sgb2-24-all",
        locator: "SGB II § 24 Abs. 1 und 3",
        text: "Kann ein vom Regelbedarf umfasster und unabweisbarer Bedarf nicht gedeckt werden, erbringt die Agentur für Arbeit den Bedarf als Sach- oder Geldleistung und gewährt ein entsprechendes Darlehen. Erstausstattungen für Wohnung, Bekleidung sowie Schwangerschaft und Geburt werden gesondert erbracht und sind gesondert zu beantragen.",
      },
    ],
  },
  {
    key: "sgb2-31",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__31.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 31 Pflichtverletzungen",
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
        key: "sgb2-31-all",
        locator: "SGB II § 31",
        text: "Erwerbsfähige Leistungsberechtigte verletzen ihre Pflichten, wenn sie trotz Rechtsfolgenbelehrung oder deren Kenntnis Eigenbemühungen nicht nachweisen, eine zumutbare Arbeit oder Ausbildung nicht aufnehmen oder eine zumutbare Eingliederungsmaßnahme nicht antreten oder abbrechen. Dies gilt nicht, wenn sie einen wichtigen Grund darlegen und nachweisen. Ein Jobcenter-Schreiben oder ein versäumter Termin ist nicht automatisch eine festgestellte Pflichtverletzung.",
      },
    ],
  },
  {
    key: "sgb2-31a",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__31a.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 31a Rechtsfolgen bei Pflichtverletzungen",
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
        key: "sgb2-31a-all",
        locator: "SGB II § 31a",
        text: "Bei einer Pflichtverletzung nach § 31 mindert sich das Grundsicherungsgeld um 30 Prozent des maßgebenden Regelbedarfs. Minderungen sind aufzuheben, sobald die Pflichten erfüllt oder ernsthaft und nachhaltig die Bereitschaft dazu erklärt wird. Vor der Feststellung soll auf Verlangen persönlich angehört werden. Eine Leistungsminderung erfolgt nicht, wenn sie eine außergewöhnliche Härte bedeuten würde. Nimmt die Person eine tatsächlich und unmittelbar mögliche zumutbare Arbeit willentlich nicht auf, entfällt der Leistungsanspruch in Höhe des Regelbedarfs.",
      },
    ],
  },
  {
    key: "sgb2-31b",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__31b.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 31b Beginn und Dauer der Minderung",
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
        key: "sgb2-31b-all",
        locator: "SGB II § 31b",
        text: "Der Auszahlungsanspruch mindert sich mit Beginn des Kalendermonats nach Wirksamwerden des feststellenden Verwaltungsakts. Der Minderungszeitraum beträgt drei Monate. Bei Arbeitsverweigerung nach § 31a Absatz 7 wird die Minderung nach einem Monat aufgehoben, wenn die Arbeitsaufnahme nicht mehr möglich ist, spätestens nach zwei Monaten. Eine individuelle Sanktionsfolge darf ohne den Minderungsbescheid und die konkreten Tatsachen nicht erfunden werden.",
      },
    ],
  },
  {
    key: "sgb2-32",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__32.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 32 Meldeversäumnisse",
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
        key: "sgb2-32-all",
        locator: "SGB II § 32",
        text: "Kommen Leistungsberechtigte einer Meldeaufforderung oder einem Untersuchungs termin wiederholt nicht nach, mindert sich das Grundsicherungsgeld um 30 Prozent des Regelbedarfs für einen Monat, sofern kein wichtiger Grund nachgewiesen wird. Das erste Meldeversäumnis löst diese wiederholte Minderung nicht aus. Ein einmalig versäumter Termin bedeutet nicht automatisch den sofortigen vollständigen Wegfall aller Leistungen.",
      },
    ],
  },
  {
    key: "sgb2-36",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__36.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 36 Örtliche Zuständigkeit",
    sourceClass: "FEDERAL_LAW",
    sourceType: "federal_statute",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "AUTHORITY_COMPETENCE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "sgb2-36-all",
        locator: "SGB II § 36 Abs. 1",
        text: "Örtlich zuständig ist die Agentur für Arbeit beziehungsweise der kommunale Träger, in deren Bezirk oder Gebiet die erwerbsfähige leistungsberechtigte Person ihren gewöhnlichen Aufenthalt hat. Kann ein gewöhnlicher Aufenthalt nicht festgestellt werden, ist der tatsächliche Aufenthalt maßgebend. Weder userLocale noch die deutsche Sprache noch das Bundesland allein bestimmen das zuständige Jobcenter.",
      },
    ],
  },
  {
    key: "sgb2-37",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__37.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 37 Antragserfordernis",
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
        key: "sgb2-37-all",
        locator: "SGB II § 37",
        text: "Leistungen nach dem SGB II werden auf Antrag erbracht. Sie werden nicht für Zeiten vor der Antragstellung erbracht; der Antrag auf Leistungen zur Sicherung des Lebensunterhalts wirkt auf den Ersten des Monats zurück. Leistungen nach § 24 Absatz 1 und 3 sind gesondert zu beantragen.",
      },
    ],
  },
  {
    key: "sgb2-39",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__39.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 39 Sofortige Vollziehbarkeit",
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
        key: "sgb2-39-all",
        locator: "SGB II § 39",
        text: "Widerspruch und Anfechtungsklage haben keine aufschiebende Wirkung gegen Verwaltungsakte, die Leistungen aufheben, zurücknehmen, widerrufen oder entziehen, die Pflichtverletzung und die Minderung feststellen oder Pflichten bei der Eingliederung regeln, sowie gegen Aufforderungen zur Beantragung vorrangiger Leistungen oder zur persönlichen Meldung. Ein Widerspruch hat daher nicht automatisch aufschiebende Wirkung für jede Jobcenter-Entscheidung.",
      },
    ],
  },
  {
    key: "sgb2-40",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__40.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 40 Anwendung von Verfahrensvorschriften",
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
        key: "sgb2-40-all",
        locator: "SGB II § 40 Abs. 1",
        text: "Für das Verfahren nach dem SGB II gilt das SGB X. Rechtswidrige Verwaltungsakte können nach den dortigen Maßgaben zurückgenommen oder aufgehoben werden; daraus können Erstattungsforderungen entstehen. Nicht jede Zahlungsaufforderung ist deshalb richtig, und nicht jede Überzahlung muss automatisch mit Widerspruch angegriffen werden.",
      },
    ],
  },
  {
    key: "sgb2-41",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__41.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 41 Berechnung der Leistungen und Bewilligungszeitraum",
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
        key: "sgb2-41-all",
        locator: "SGB II § 41 Abs. 3",
        text: "Über den Anspruch auf Leistungen zur Sicherung des Lebensunterhalts ist in der Regel für ein Jahr zu entscheiden. Der Bewilligungszeitraum soll insbesondere bei vorläufiger Entscheidung oder unangemessenen Unterkunftskosten regelmäßig auf sechs Monate verkürzt werden. Die konkrete Dauer ergibt sich aus dem Bescheid und ist fallbezogen.",
      },
    ],
  },
  {
    key: "sgb2-42",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
    url: "https://www.gesetze-im-internet.de/sgb_2/__42.html",
    officialDomain: "www.gesetze-im-internet.de",
    title: "SGB II § 42 Fälligkeit, Auszahlung und Unpfändbarkeit der Leistungen",
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
        key: "sgb2-42-all",
        locator: "SGB II § 42 Abs. 1",
        text: "Leistungen sollen monatlich im Voraus erbracht werden. Ein individueller Auszahlungstag oder -betrag darf ohne den Bewilligungsbescheid nicht erfunden werden.",
      },
    ],
  },
  {
    key: "sgb1-60",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
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
        text: "Wer Sozialleistungen beantragt oder erhält, hat alle leistungserheblichen Tatsachen anzugeben, Änderungen unverzüglich mitzuteilen und auf Verlangen Beweisurkunden vorzulegen. Die Aufnahme einer Arbeit beendet das Grundsicherungsgeld nicht automatisch sofort, muss aber unverzüglich mitgeteilt werden.",
      },
    ],
  },
  {
    key: "sgb10-24",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
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
        text: "Bevor ein Verwaltungsakt erlassen wird, der in Rechte eines Beteiligten eingreift, ist Gelegenheit zur Äußerung zu den erheblichen Tatsachen zu geben. Eine Anhörung ist nicht derselbe Verwaltungsakt wie ein Minderungsbescheid.",
      },
    ],
  },
  {
    key: "sgb10-31",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
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
        text: "Verwaltungsakt ist jede Verfügung, Entscheidung oder andere hoheitliche Maßnahme, die eine Behörde zur Regelung eines Einzelfalles auf dem Gebiet des öffentlichen Rechts trifft und die auf unmittelbare Rechtswirkung nach außen gerichtet ist. Ein gewöhnliches Informationsschreiben des Jobcenters ist nicht automatisch ein Verwaltungsakt.",
      },
    ],
  },
  {
    key: "sgb10-37",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
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
        text: "Ein schriftlicher Verwaltungsakt, der im Inland durch die Post übermittelt wird, gilt am vierten Tag nach der Aufgabe zur Post als bekannt gegeben. Das auf dem Schreiben gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe und nicht automatisch der Beginn der Widerspruchsfrist.",
      },
    ],
  },
  {
    key: "sgg-84",
    publisherKey: "bmj",
    authorityKey: "jobcenter",
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
    authorityKey: "jobcenter",
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
        key: "sgb5-5-2a",
        locator: "SGB V § 5 Abs. 1 Nr. 2a und Abs. 5a",
        text: "Versicherungspflichtig in der gesetzlichen Krankenversicherung sind Personen in der Zeit, für die sie Grundsicherungsgeld nach § 19 Absatz 1 Satz 1 SGB II beziehen, es sei denn, die Leistung wird nur darlehensweise oder nur als bestimmte einmalige Leistung erbracht. Wer zuletzt privat krankenversichert war, ist nach Absatz 5a von dieser Versicherungspflicht ausgenommen. Die nähere Krankenversicherungslaufbahn gehört in das gesonderte Krankenversicherungspaket.",
      },
    ],
  },
  {
    key: "ba-gsg-replace",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/grundsicherung-loest-buergergeld-ab",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Grundsicherungsgeld löst Bürgergeld ab",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-gsg-term",
        locator: "BA-Seite Grundsicherungsgeld löst Bürgergeld ab",
        text: "Das Grundsicherungsgeld löst das Bürgergeld ab. Die Änderungen gelten ab dem 01.07.2026. Wer bereits Leistungen bezieht, muss keinen neuen Antrag stellen; bisher erlassene Bescheide gelten inhaltlich weiter. Anträge, Bescheide und Schreiben können vorübergehend noch den Begriff Bürgergeld verwenden und sind dennoch gültig.",
      },
      {
        key: "ba-gsg-reform",
        locator: "BA-Seite zu Minderungen, Terminen und Vermögen",
        text: "Bei Pflichtverletzungen kann das Jobcenter den Regelbedarf direkt um 30 Prozent für drei Monate kürzen. Ab dem zweiten grundlos verpassten Termin kann der Regelbedarf um 30 Prozent für einen Monat gekürzt werden. Die Vermögenskarenzzeit wird abgeschafft. Im ersten Jahr des Leistungsbezugs werden Wohnkosten bis zum Eineinhalbfachen der ortsüblichen Angemessenheitsgrenze gezahlt.",
      },
    ],
  },
  {
    key: "ba-antrag",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/antrag-bescheid",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Grundsicherungsgeld Antrag und Bescheid",
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
        key: "ba-antrag-form",
        locator: "BA Antrag und Bescheid, Antragswege",
        text: "Der Antrag auf Grundsicherungsgeld ist an keine Form gebunden. Er kann online, persönlich, telefonisch oder schriftlich gestellt werden. Leben Personen in einer Bedarfsgemeinschaft, wird der Antrag für alle diese Personen gestellt. Alle Angaben sind durch Nachweise zu belegen; Originale sollen nicht eingereicht werden.",
      },
      {
        key: "ba-antrag-evidence",
        locator: "BA Antrag und Bescheid, Nachweise",
        text: "Typische Nachweise sind Personalausweis, Reisepass mit Meldebescheinigung oder Aufenthaltstitel, Kontoauszüge, Lohnbescheinigung, Mietvertrag sowie Heiz- und Nebenkostenabrechnung. Nachweise zum Vermögen sind vorzulegen, wenn das Jobcenter dazu auffordert. Das Jobcenter antwortet mit einem Bescheid über Bewilligung, Teilbewilligung, Ablehnung oder Änderung.",
      },
    ],
  },
  {
    key: "ba-kooperationsplan",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/grundsicherung/kooperationsplan",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Kooperationsplan mit dem Jobcenter",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "PROCESS_IDENTITY",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-koop-all",
        locator: "BA Kooperationsplan",
        text: "Im Kooperationsplan werden gemeinsam Ziele und wesentliche Schritte der beruflichen Eingliederung festgehalten. Er enthält ein persönliches Angebot der Beratung, Unterstützung oder Vermittlung und enthält keine Rechtsfolgenbelehrungen. Sobald ein Termin ohne wichtigen Grund versäumt wird oder die wesentlichen Schritte nicht erbracht werden, kann das Jobcenter unmittelbar durch Verwaltungsakt zur Mitwirkung verpflichten. Das frühere Schlichtungsverfahren für Kooperationspläne gibt es nicht mehr.",
      },
    ],
  },
  {
    key: "ba-veraenderung",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/grundsicherung/pflichten-verstehen-und-beachten/aenderungen-nachweise",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Veränderungsmitteilung",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "ONLINE_SERVICE_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-change-all",
        locator: "BA Veränderungsmitteilung",
        text: "Veränderungen der persönlichen oder finanziellen Verhältnisse sind unverzüglich mitzuteilen. Dazu gehören unter anderem Arbeitseinkommen, Familienstand, Anschrift, Miete, Bankverbindung und Wechsel der Krankenkasse. Unterbleibt die Mitteilung, kann Grundsicherungsgeld in falscher Höhe entstehen und grundsätzlich zurückzuzahlen sein. Die Mitteilung kann online, schriftlich oder persönlich erfolgen.",
      },
    ],
  },
  {
    key: "ba-wba",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/grundsicherung/weiterbewilligungsantrag",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Grundsicherungsgeld online verlängern",
    sourceClass: "OFFICIAL_ONLINE_SERVICE",
    sourceType: "authority_portal",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "FORM_URL",
    handlingMode: "CACHE_AND_REVALIDATE",
    freshnessClass: "MONTHLY",
    staleBehavior: "REVALIDATE_BEFORE_USE",
    requiredContextKeys: [],
    passages: [
      {
        key: "ba-wba-all",
        locator: "BA Weiterbewilligungsantrag",
        text: "Endet der Bewilligungszeitraum, ist ein Weiterbewilligungsantrag zu stellen. Der Antrag ist an keine Form gebunden und kann online, persönlich, telefonisch oder schriftlich gestellt werden. Das Jobcenter prüft anhand der Angaben und Nachweise, ob und in welcher Höhe Grundsicherungsgeld weitergezahlt werden kann.",
      },
    ],
  },
  {
    key: "ba-jobcenter-finder",
    publisherKey: "ba",
    authorityKey: "ba",
    url: "https://www.arbeitsagentur.de/vor-ort/jobcenter",
    officialDomain: "www.arbeitsagentur.de",
    title: "Bundesagentur für Arbeit: Jobcenter vor Ort",
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
        locator: "BA Dienststellensuche Jobcenter",
        text: "Das zuständige Jobcenter ergibt sich aus dem gewöhnlichen Aufenthalt und ist über die Dienststellensuche der Bundesagentur für Arbeit zu ermitteln. Aktuelle Öffnungszeiten und lokale Kontaktdaten sind live zu prüfen und keine bundesweit festgeschriebenen Konstanten. Ein bestimmtes Jobcenter darf nicht aus der Sprache oder einem zufälligen Ortsnamen erfunden werden.",
      },
    ],
  },
  {
    key: "bmas-overview",
    publisherKey: "bmas",
    authorityKey: "bmas",
    url: "https://www.bmas.de/DE/Arbeit/Grundsicherung-fuer-Arbeitsuchende/Ziele-Regeln-Aenderungen/ziele-regeln-aenderungen-art.html",
    officialDomain: "www.bmas.de",
    title: "BMAS: Die Grundsicherung für Arbeitsuchende auf einen Blick",
    sourceClass: "FEDERAL_ADMINISTRATIVE_GUIDANCE",
    sourceType: "federal_guidance",
    retrievalMethod: "HTML_DOCUMENT",
    informationClass: "LEGAL_BASELINE",
    handlingMode: "STORE_CANONICALLY",
    freshnessClass: "LEGAL_CHANGE_MONITORED",
    staleBehavior: "DO_NOT_USE_STALE",
    requiredContextKeys: [],
    passages: [
      {
        key: "bmas-overview-all",
        locator: "BMAS Ziele, Regeln, Änderungen",
        text: "Die neue Grundsicherung für Arbeitsuchende gilt seit dem 1. Juli 2026 und löst das Bürgergeld ab. Das erste Gespräch muss persönlich im Jobcenter stattfinden. Bei Pflichtverletzungen kann der Regelbedarf unmittelbar um 30 Prozent für drei Monate gemindert werden. Auf einen einmalig verpassten Termin folgt noch keine Leistungsminderung; ab dem zweiten grundlos verpassten Termin greift eine Minderung von 30 Prozent für einen Monat.",
      },
    ],
  },
]);

export const JOBCENTER_UNITS: readonly UnitSpec[] = Object.freeze([
  { key: "gsg-is-current-term", category: "orientation", temporal: "current_2026", type: "definition", text: "Die aktuelle Geldleistung der Grundsicherung für Arbeitsuchende nach dem SGB II heißt Grundsicherungsgeld. Sie hat das Bürgergeld zum 1. Juli 2026 abgelöst.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "low" },
  { key: "gsg-is-sgb2-leistung", category: "orientation", temporal: "current_2026", type: "definition", text: "Grundsicherungsgeld ist die Leistung zur Sicherung des Lebensunterhalts erwerbsfähiger Leistungsberechtigter und bestimmter nicht erwerbsfähiger Mitglieder der Bedarfsgemeinschaft nach § 19 SGB II.", sourceKey: "sgb2-19", passageKey: "sgb2-19-all", riskLevel: "low" },
  { key: "buergergeld-is-legacy-term", category: "orientation", temporal: "current_2026", type: "definition", text: "Bürgergeld ist der frühere und in Übergangsschreiben noch vorkommende Name derselben Grundsicherung für Arbeitsuchende. Der Begriff bezeichnet nicht automatisch eine andere Rechtsleistung.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "medium" },
  { key: "buergergeld-wording-not-invalid", category: "orientation", temporal: "current_2026", type: "exception", text: "Steht auf einem Antrag, Bescheid oder Schreiben des Jobcenters noch Bürgergeld, ist das Dokument nicht automatisch ungültig, veraltet oder gefälscht.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "high" },
  { key: "existing-bescheid-remains-valid", category: "orientation", temporal: "current_2026", type: "definition", text: "Bisher erlassene Jobcenter-Bescheide gelten inhaltlich weiter, auch wenn sie noch Bürgergeld nennen. Ein neuer Erstantrag ist deshalb nicht allein wegen der Umbenennung erforderlich.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "medium" },
  { key: "no-new-application-for-existing-recipients", category: "orientation", temporal: "current_2026", type: "procedure", text: "Wer am 1. Juli 2026 bereits Leistungen der Grundsicherung für Arbeitsuchende bezieht, muss wegen der Umbenennung in Grundsicherungsgeld keinen neuen Erstantrag stellen.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "medium" },
  { key: "eligibility-four-conditions", category: "eligibility", temporal: "current_2026", type: "definition", text: "Anspruch auf Grundsicherungsgeld setzt voraus, dass die Person die Altersgrenzen erfüllt, erwerbsfähig und hilfebedürftig ist und ihren gewöhnlichen Aufenthalt in Deutschland hat.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high" },
  { key: "erwerbsfaehigkeit-three-hours", category: "eligibility", temporal: "current_2026", type: "definition", text: "Erwerbsfähig im Sinne des Grundsicherungsgeldes ist, wer nicht wegen Krankheit oder Behinderung außerstande ist, mindestens drei Stunden täglich auf dem allgemeinen Arbeitsmarkt tätig zu sein.", sourceKey: "sgb2-8", passageKey: "sgb2-8-all", riskLevel: "high" },
  { key: "hilfebeduerftigkeit-definition", category: "eligibility", temporal: "current_2026", type: "definition", text: "Hilfebedürftig ist, wer den Lebensunterhalt nicht ausreichend aus zu berücksichtigendem Einkommen oder Vermögen sichern kann und die Hilfe nicht von anderen erhält. Das Jobcenter prüft dies für die Bedarfsgemeinschaft.", sourceKey: "sgb2-9", passageKey: "sgb2-9-all", riskLevel: "high" },
  { key: "gewoehnlicher-aufenthalt-required", category: "eligibility", temporal: "current_2026", type: "definition", text: "Leistungen der Grundsicherung für Arbeitsuchende setzen den gewöhnlichen Aufenthalt in der Bundesrepublik Deutschland voraus. Ein bloßer kurzfristiger Aufenthalt ersetzt diese Voraussetzung nicht.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high" },
  { key: "unemployed-not-automatically-entitled", category: "eligibility", temporal: "current_2026", type: "exception", text: "Wer arbeitslos ist, hat nicht automatisch einen Anspruch auf Grundsicherungsgeld. Es müssen Erwerbsfähigkeit, Hilfebedürftigkeit, Alter und gewöhnlicher Aufenthalt erfüllt sein.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high" },
  { key: "employed-not-automatically-excluded", category: "eligibility", temporal: "current_2026", type: "exception", text: "Wer arbeitet, ist nicht automatisch vom Grundsicherungsgeld ausgeschlossen. Reicht das zu berücksichtigende Einkommen nicht, kann ergänzend ein Anspruch bestehen.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high" },
  { key: "residence-not-automatic-entitlement", category: "eligibility", temporal: "current_2026", type: "exception", text: "Ein Wohnsitz oder Aufenthalt in Deutschland begründet nicht allein wegen des Wohnsitzes in Deutschland einen Anspruch auf Grundsicherungsgeld.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high" },
  { key: "foreign-nationality-not-automatic-exclusion", category: "cross_border", temporal: "current_2026", type: "exception", text: "Eine ausländische Staatsangehörigkeit schließt nicht automatisch vom Grundsicherungsgeld aus. Ob eine gesetzliche Ausnahme greift, hängt vom Aufenthaltsrecht und weiteren Statusmerkmalen ab.", sourceKey: "sgb2-7", passageKey: "sgb2-7-foreign", riskLevel: "high" },
  { key: "eu-citizenship-not-automatic-entitlement", category: "cross_border", temporal: "current_2026", type: "exception", text: "Unionsbürgerschaft begründet nicht automatisch einen Anspruch auf Grundsicherungsgeld. Insbesondere ein Aufenthaltsrecht allein zur Arbeitsuche kann vom Bezug ausnehmen.", sourceKey: "sgb2-7", passageKey: "sgb2-7-foreign", riskLevel: "high" },
  { key: "bedarfsgemeinschaft-structure", category: "eligibility", temporal: "current_2026", type: "definition", text: "Die Bedarfsgemeinschaft umfasst die erwerbsfähigen Leistungsberechtigten, ihre Partnerinnen oder Partner und unverheiratete Kinder unter 25 Jahren unter den Voraussetzungen des § 7 Absatz 3 SGB II.", sourceKey: "sgb2-7", passageKey: "sgb2-7-bg", riskLevel: "high" },
  { key: "married-not-automatic-result", category: "eligibility", temporal: "current_2026", type: "exception", text: "Ehe allein ergibt nicht automatisch ein bestimmtes Leistungsergebnis beim Grundsicherungsgeld. Es kommt auf die gesetzliche Bedarfsgemeinschaft und die tatsächlichen Einkommens- und Vermögensverhältnisse an.", sourceKey: "sgb2-7", passageKey: "sgb2-7-bg", riskLevel: "high" },
  { key: "same-address-not-enough-for-household", category: "eligibility", temporal: "current_2026", type: "exception", text: "Dieselbe Anschrift begründet nicht automatisch eine Bedarfsgemeinschaft. Für Partnerinnen und Partner gelten die gesetzlichen Merkmale des Zusammenlebens und der Einstandsgemeinschaft.", sourceKey: "sgb2-7", passageKey: "sgb2-7-bg", riskLevel: "high" },
  { key: "income-not-automatic-exclusion", category: "eligibility", temporal: "current_2026", type: "exception", text: "Einkommen bedeutet nicht automatisch, dass kein Anspruch auf Grundsicherungsgeld besteht. Zu berücksichtigen ist nur das gesetzlich anzurechnende Einkommen der Bedarfsgemeinschaft.", sourceKey: "sgb2-9", passageKey: "sgb2-9-all", riskLevel: "high" },
  { key: "vorrangige-leistungen-duty", category: "eligibility", temporal: "current_2026", type: "duty", text: "Leistungsberechtigte müssen vorrangige Sozialleistungen anderer Träger in Anspruch nehmen, soweit dies Hilfebedürftigkeit vermeidet oder vermindert. Wohngeld und Kinderzuschlag sind nur unter den gesetzlichen Voraussetzungen zwingend.", sourceKey: "sgb2-12a", passageKey: "sgb2-12a-all", riskLevel: "high" },
  { key: "alg-transition-possible", category: "eligibility", temporal: "current_2026", type: "definition", text: "Nach dem Ende oder bei zu geringem Arbeitslosengeld kann Grundsicherungsgeld in Betracht kommen, wenn Hilfebedürftigkeit und die übrigen Voraussetzungen vorliegen. Der Übergang ist kein Automatismus.", sourceKey: "ba-gsg-replace", passageKey: "ba-gsg-term", riskLevel: "medium" },
  { key: "individual-entitlement-needs-facts", category: "eligibility", temporal: "current_2026", type: "exception", text: "Ob eine bestimmte Person Grundsicherungsgeld erhält, darf ohne die konkreten Tatsachen zu Erwerbsfähigkeit, Hilfebedürftigkeit, Bedarfsgemeinschaft und Aufenthalt nicht entschieden werden.", sourceKey: "sgb2-7", passageKey: "sgb2-7-1", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "application-required", category: "application", temporal: "current_2026", type: "duty", text: "Grundsicherungsgeld wird nur auf Antrag erbracht. Ohne Antrag entsteht kein Leistungsanspruch für Zeiten vor der Antragstellung, abgesehen von der Rückwirkung auf den Ersten des Antragsmonats.", sourceKey: "sgb2-37", passageKey: "sgb2-37-all", riskLevel: "high" },
  { key: "application-not-form-bound", category: "application", temporal: "current_2026", type: "procedure", text: "Der Antrag auf Grundsicherungsgeld ist an keine Form gebunden. Ein bestimmtes Formular ist hilfreich, aber nicht die einzige wirksame Antragstellung.", sourceKey: "ba-antrag", passageKey: "ba-antrag-form", riskLevel: "medium" },
  { key: "application-channels", category: "application", temporal: "current_2026", type: "procedure", text: "Der Antrag auf Grundsicherungsgeld kann online, persönlich, telefonisch oder schriftlich beim zuständigen Jobcenter gestellt werden. Online ist der bevorzugte Weg der Bundesagentur für Arbeit.", sourceKey: "ba-antrag", passageKey: "ba-antrag-form", riskLevel: "medium" },
  { key: "application-backdates-to-month-start", category: "application", temporal: "current_2026", type: "deadline", text: "Der Antrag auf Leistungen zur Sicherung des Lebensunterhalts wirkt auf den Ersten des Monats der Antragstellung zurück. Eine individuelle Leistungsaufnahme vor diesem Monat darf nicht erfunden werden.", sourceKey: "sgb2-37", passageKey: "sgb2-37-all", riskLevel: "high" },
  { key: "apply-for-bedarfsgemeinschaft", category: "application", temporal: "current_2026", type: "procedure", text: "Leben Personen in einer Bedarfsgemeinschaft, wird der Antrag auf Grundsicherungsgeld für alle diese Personen gestellt. Angaben und Nachweise betreffen dann die gesamte Bedarfsgemeinschaft.", sourceKey: "ba-antrag", passageKey: "ba-antrag-form", riskLevel: "high" },
  { key: "identity-evidence", category: "application", temporal: "current_2026", type: "duty", text: "Für den Antrag auf Grundsicherungsgeld sind Identitäts- und Statusnachweise vorzulegen, insbesondere Personalausweis, Reisepass mit Meldebescheinigung oder Aufenthaltstitel.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "income-evidence", category: "application", temporal: "current_2026", type: "duty", text: "Einkommen der Bedarfsgemeinschaft ist nachzuweisen, etwa durch Lohnbescheinigung, Kontoauszüge und Nachweise über Renten, Krankengeld, Kindergeld oder Unterhalt.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "asset-evidence-on-request", category: "application", temporal: "current_2026", type: "duty", text: "Nachweise zum Vermögen sind vorzulegen, wenn das Jobcenter dazu auffordert. Eine Vermögenskarenzzeit gibt es nach der Reform 2026 nicht mehr.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "high" },
  { key: "housing-evidence", category: "application", temporal: "current_2026", type: "duty", text: "Für Unterkunft und Heizung sind insbesondere Mietvertrag, Mietquittungen sowie Heiz- und Nebenkostenabrechnung vorzulegen.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "never-submit-originals", category: "application", temporal: "current_2026", type: "procedure", text: "Beim Jobcenter sollen keine Originalunterlagen als Nachweise eingereicht werden, weil abgegebene Unterlagen digitalisiert und nach acht Wochen vernichtet werden.", sourceKey: "ba-antrag", passageKey: "ba-antrag-form", riskLevel: "medium" },
  { key: "missing-evidence-not-rejection", category: "application", temporal: "current_2026", type: "exception", text: "Eine Nachforderung fehlender Unterlagen durch das Jobcenter ist nicht automatisch eine Ablehnung des Antrags auf Grundsicherungsgeld.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "after-application-comes-bescheid", category: "application", temporal: "current_2026", type: "procedure", text: "Nach der Antragstellung entscheidet das Jobcenter schriftlich durch Bescheid über Bewilligung, Teilbewilligung, Ablehnung oder spätere Änderung.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "gsg-covers-regel-mehr-kdu", category: "calculation", temporal: "current_2026", type: "definition", text: "Das Grundsicherungsgeld umfasst den Regelbedarf, Mehrbedarfe und den Bedarf für Unterkunft und Heizung, soweit sie nicht durch anzurechnendes Einkommen und Vermögen gedeckt sind.", sourceKey: "sgb2-19", passageKey: "sgb2-19-all", riskLevel: "medium" },
  { key: "regelbedarf-is-annual-not-timeless", category: "calculation", temporal: "current_2026", type: "definition", text: "Die Höhe des Regelbedarfs richtet sich nach der für das jeweilige Jahr geltenden Regelbedarfsstufe. Ein Eurobetrag des Regelbedarfs ist keine zeitlose Rechtsgröße und darf nicht als dauerhafte Konstante gespeichert werden.", sourceKey: "sgb2-20", passageKey: "sgb2-20-all", riskLevel: "high" },
  { key: "mehrbedarf-is-case-specific", category: "calculation", temporal: "current_2026", type: "definition", text: "Mehrbedarfe sind gesetzlich bestimmte Zusatzbedarfe und hängen von der konkreten Lebenssituation ab. Ein individueller Mehrbedarf darf ohne diese Tatsachen nicht angenommen werden.", sourceKey: "sgb2-19", passageKey: "sgb2-19-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "income-and-assets-reduce", category: "calculation", temporal: "current_2026", type: "definition", text: "Zu berücksichtigendes Einkommen und Vermögen mindern das Grundsicherungsgeld. Zuerst werden Regelbedarf und Mehrbedarfe gedeckt, danach der Bedarf für Unterkunft und Heizung.", sourceKey: "sgb2-19", passageKey: "sgb2-19-all", riskLevel: "high" },
  { key: "vermoegen-age-allowance-exists", category: "calculation", temporal: "current_2026", type: "definition", text: "Vom Vermögen ist für jede Person der Bedarfsgemeinschaft ein vom Lebensalter abhängiger gesetzlicher Freibetrag abzusetzen. Die konkrete Vermögensanrechnung bleibt fallbezogen.", sourceKey: "sgb2-12", passageKey: "sgb2-12-all", riskLevel: "high" },
  { key: "no-individual-amount", category: "calculation", temporal: "current_2026", type: "exception", text: "Ein individueller Zahlbetrag des Grundsicherungsgeldes darf ohne Bewilligungsbescheid, Bedarfsgemeinschaft, Einkommen, Vermögen und Unterkunftstatsachen nicht berechnet werden.", sourceKey: "sgb2-19", passageKey: "sgb2-19-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "kdu-actual-if-appropriate", category: "housing", temporal: "current_2026", type: "definition", text: "Bedarfe für Unterkunft und Heizung werden in Höhe der tatsächlichen Aufwendungen anerkannt, soweit sie angemessen sind.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high" },
  { key: "karenzzeit-one-year-housing", category: "housing", temporal: "current_2026", type: "definition", text: "Für die Anerkennung der Unterkunftskosten gilt eine Karenzzeit von einem Jahr ab Beginn des ersten Leistungsmonats. Innerhalb dieser Zeit werden die tatsächlichen Unterkunftskosten grundsätzlich anerkannt.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high" },
  { key: "karenz-cap-one-and-half", category: "housing", temporal: "current_2026", type: "definition", text: "Auch in der Karenzzeit werden tatsächliche Unterkunftskosten nicht anerkannt, soweit sie mehr als eineinhalbmal so hoch sind wie die abstrakt angemessenen Aufwendungen. Ausnahmen können unabweisbar oder in Bedarfsgemeinschaften mit Kindern möglich sein.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high" },
  { key: "appropriateness-is-local", category: "housing", temporal: "current_2026", type: "definition", text: "Die Angemessenheit der Unterkunftskosten bestimmt der kommunale Träger nach örtlichen Maßstäben. Eine bundesweit einheitliche Eurogrenze für die Kosten der Unterkunft gibt es nicht.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high" },
  { key: "no-federal-kdu-euro", category: "housing", temporal: "current_2026", type: "exception", text: "Örtliche Angemessenheitsgrenzen der Kosten der Unterkunft sind keine zeitlose bundesrechtliche Eurokonstante und dürfen im Bundeskern nicht als fester Betrag gespeichert werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "zusicherung-before-new-lease", category: "housing", temporal: "current_2026", type: "duty", text: "Vor Abschluss eines neuen Mietvertrags soll die Zusicherung des für die neue Unterkunft zuständigen kommunalen Trägers eingeholt werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-move", riskLevel: "high" },
  { key: "moving-not-automatic-approval", category: "housing", temporal: "current_2026", type: "exception", text: "Ein Umzug bedeutet nicht automatisch die Anerkennung der neuen Unterkunftskosten. Höhere als angemessene Aufwendungen werden nach einem Umzug nur bei vorheriger schriftlicher Zusicherung anerkannt.", sourceKey: "sgb2-22", passageKey: "sgb2-22-move", riskLevel: "high" },
  { key: "high-rent-not-automatic-total-loss", category: "housing", temporal: "current_2026", type: "exception", text: "Eine hohe Miete bedeutet nicht automatisch den sofortigen vollständigen Wegfall der Unterkunftsleistung. Unangemessene Kosten können vorübergehend weiter anerkannt werden, solange eine Senkung nicht möglich oder nicht zumutbar ist.", sourceKey: "sgb2-22", passageKey: "sgb2-22-credit", riskLevel: "high" },
  { key: "kaution-as-loan", category: "housing", temporal: "current_2026", type: "procedure", text: "Aufwendungen für eine Mietkaution und Genossenschaftsanteile können bei vorheriger Zusicherung als Bedarf anerkannt werden und sollen als Darlehen erbracht werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-move", riskLevel: "medium" },
  { key: "guthaben-reduces-kdu", category: "housing", temporal: "current_2026", type: "duty", text: "Betriebskosten- oder Heizguthaben, die dem Unterkunftsbedarf zuzuordnen sind, mindern die Kosten der Unterkunft nach dem Monat der Gutschrift und sind dem Jobcenter mitzuteilen.", sourceKey: "sgb2-22", passageKey: "sgb2-22-credit", riskLevel: "medium" },
  { key: "rent-arrears-orientation", category: "housing", temporal: "current_2026", type: "procedure", text: "Mietschulden können übernommen werden, soweit dies zur Sicherung der Unterkunft gerechtfertigt ist, und sollen übernommen werden, wenn sonst Wohnungslosigkeit droht. Geldleistungen sollen als Darlehen erbracht werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-move", riskLevel: "high" },
  { key: "local-kdu-needs-locality", category: "housing", temporal: "current_2026", type: "exception", text: "Eine konkrete örtliche Angemessenheitsgrenze der Kosten der Unterkunft darf ohne den zuständigen kommunalen Träger und dessen aktuelle Übersicht nicht genannt werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-karenz", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
  { key: "bewilligungsbescheid-is-va", category: "decision_payment", temporal: "current_2026", type: "definition", text: "Der Bewilligungsbescheid des Jobcenters ist die Entscheidung über den Antrag und damit ein Verwaltungsakt über das Grundsicherungsgeld.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "bewilligungszeitraum-typically-one-year", category: "decision_payment", temporal: "current_2026", type: "definition", text: "Über das Grundsicherungsgeld ist in der Regel für ein Jahr zu entscheiden. Der Bewilligungszeitraum kann insbesondere bei vorläufiger Entscheidung oder unangemessenen Wohnkosten sechs Monate betragen.", sourceKey: "sgb2-41", passageKey: "sgb2-41-all", riskLevel: "medium" },
  { key: "duration-is-case-specific", category: "decision_payment", temporal: "current_2026", type: "exception", text: "Die konkrete Dauer des Bewilligungszeitraums ergibt sich aus dem Bescheid des Jobcenters und ist fallbezogen. Ein typisches Jahr ersetzt nicht den im Bescheid genannten Zeitraum.", sourceKey: "sgb2-41", passageKey: "sgb2-41-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "payment-monthly-in-advance", category: "decision_payment", temporal: "current_2026", type: "procedure", text: "Das Grundsicherungsgeld soll monatlich im Voraus ausgezahlt werden. Ein individueller Auszahlungstag darf ohne den Bescheid nicht bestimmt werden.", sourceKey: "sgb2-42", passageKey: "sgb2-42-all", riskLevel: "medium" },
  { key: "weiterbewilligung-required", category: "decision_payment", temporal: "current_2026", type: "duty", text: "Endet der Bewilligungszeitraum, muss ein Weiterbewilligungsantrag gestellt werden. Ohne diesen Antrag wird das Grundsicherungsgeld nicht automatisch weitergezahlt.", sourceKey: "ba-wba", passageKey: "ba-wba-all", riskLevel: "high" },
  { key: "change-during-period-report", category: "decision_payment", temporal: "current_2026", type: "duty", text: "Ändern sich die Verhältnisse während des Bewilligungszeitraums, muss dies unverzüglich mitgeteilt werden. Das Jobcenter entscheidet dann durch Änderungs- oder Aufhebungsbescheid.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "high" },
  { key: "provisional-decision-exists", category: "decision_payment", temporal: "current_2026", type: "definition", text: "Das Jobcenter kann vorläufig entscheiden, insbesondere wenn Tatsachen noch unsicher sind. Eine vorläufige Entscheidung ist nicht dasselbe wie die abschließende Bewilligung.", sourceKey: "sgb2-41", passageKey: "sgb2-41-all", riskLevel: "medium" },
  { key: "inspect-bescheid-parts", category: "bescheid", temporal: "current_2026", type: "procedure", text: "Ein Jobcenter-Bescheid ist auf Tenor, Begründung, Leistungszeitraum, Betrag und Rechtsbehelfsbelehrung zu prüfen. Unklare Berechnungen sollen zuerst mit dem Jobcenter geklärt werden.", sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence", riskLevel: "medium" },
  { key: "veraenderung-unverzueglich", category: "change_report", temporal: "current_2026", type: "duty", text: "Wer Grundsicherungsgeld erhält, muss Änderungen der leistungserheblichen Verhältnisse unverzüglich als Veränderungsmitteilung an das Jobcenter geben.", sourceKey: "ba-veraenderung", passageKey: "ba-change-all", riskLevel: "high" },
  { key: "start-job-report", category: "change_report", temporal: "current_2026", type: "duty", text: "Die Aufnahme einer Arbeit, der erste Lohn und ein Arbeitgeberwechsel sind dem Jobcenter unverzüglich mitzuteilen.", sourceKey: "ba-veraenderung", passageKey: "ba-change-all", riskLevel: "high" },
  { key: "start-job-not-automatic-end", category: "change_report", temporal: "current_2026", type: "exception", text: "Die Aufnahme einer Arbeit bedeutet nicht automatisch das sofortige Ende des Grundsicherungsgeldes. Es kommt auf das anzurechnende Einkommen und die Hilfebedürftigkeit an.", sourceKey: "sgb1-60", passageKey: "sgb1-60-all", riskLevel: "high" },
  { key: "material-changes-include-income-household-housing-bank", category: "change_report", temporal: "current_2026", type: "duty", text: "Mitzuteilen sind insbesondere Änderungen von Einkommen, Familienstand, Haushaltszusammensetzung, Anschrift, Miete, Bankverbindung und Krankenkasse.", sourceKey: "ba-veraenderung", passageKey: "ba-change-all", riskLevel: "high" },
  { key: "non-report-can-cause-repayment", category: "change_report", temporal: "current_2026", type: "duty", text: "Unterbleibt die Veränderungsmitteilung, kann Grundsicherungsgeld in falscher Höhe entstehen und grundsätzlich zurückzuzahlen sein.", sourceKey: "ba-veraenderung", passageKey: "ba-change-all", riskLevel: "high" },
  { key: "first-meeting-in-person", category: "cooperation", temporal: "current_2026", type: "duty", text: "Das erste Gespräch zur Potenzialanalyse und zum Kooperationsplan findet persönlich im Jobcenter statt. Nur in begründeten Ausnahmefällen kann davon abgewichen werden.", sourceKey: "sgb2-15", passageKey: "sgb2-15-all", riskLevel: "medium" },
  { key: "kooperationsplan-is-orientation", category: "cooperation", temporal: "current_2026", type: "definition", text: "Der Kooperationsplan hält gemeinsam mit dem Jobcenter das Eingliederungsziel und die wesentlichen Schritte fest und enthält ein persönliches Angebot der Beratung, Unterstützung oder Vermittlung.", sourceKey: "sgb2-15", passageKey: "sgb2-15-all", riskLevel: "medium" },
  { key: "kooperationsplan-not-rechtsfolgen", category: "cooperation", temporal: "current_2026", type: "definition", text: "Der Kooperationsplan enthält keine Rechtsfolgenbelehrungen. Er ist der rote Faden der Zusammenarbeit, nicht selbst der minderungsbewehrte Verwaltungsakt.", sourceKey: "ba-kooperationsplan", passageKey: "ba-koop-all", riskLevel: "medium" },
  { key: "verbindliche-verpflichtung-via-va", category: "cooperation", temporal: "current_2026", type: "procedure", text: "Werden die Schritte aus dem Kooperationsplan nicht erbracht oder kommt kein Plan zustande, verpflichtet das Jobcenter durch schriftlichen Verwaltungsakt zur Mitwirkung.", sourceKey: "sgb2-15a", passageKey: "sgb2-15a-all", riskLevel: "high" },
  { key: "vermittlungsvorrang", category: "cooperation", temporal: "current_2026", type: "definition", text: "Die Vermittlung in Ausbildung oder Arbeit hat Vorrang vor den Leistungen zur Sicherung des Lebensunterhalts und vor sonstigen Eingliederungsleistungen. Eine Qualifizierung kann Vorrang haben, wenn sie für eine dauerhafte Eingliederung erfolgversprechender ist, insbesondere bei Personen unter 30 Jahren.", sourceKey: "sgb2-3a", passageKey: "sgb2-3a-all", riskLevel: "high" },
  { key: "appointments-duty", category: "cooperation", temporal: "current_2026", type: "duty", text: "Leistungsberechtigte müssen Meldeaufforderungen des Jobcenters wahrnehmen. Ein wichtiger Grund ist darzulegen und nachzuweisen.", sourceKey: "sgb2-32", passageKey: "sgb2-32-all", riskLevel: "high" },
  { key: "erreichbarkeit-required", category: "cooperation", temporal: "current_2026", type: "duty", text: "Erwerbsfähige Leistungsberechtigte müssen im näheren Bereich des zuständigen Jobcenters erreichbar sein und werktäglich dessen Mitteilungen zur Kenntnis nehmen können.", sourceKey: "sgb2-7b", passageKey: "sgb2-7b-all", riskLevel: "high" },
  { key: "absence-needs-consent", category: "cooperation", temporal: "current_2026", type: "duty", text: "Eine Abwesenheit außerhalb des näheren Bereichs des Jobcenters braucht in der Regel einen wichtigen Grund und die Zustimmung des Jobcenters. Ohne wichtigen Grund soll die Zustimmung in der Regel für höchstens drei Wochen im Kalenderjahr erteilt werden.", sourceKey: "sgb2-7b", passageKey: "sgb2-7b-all", riskLevel: "high" },
  { key: "missed-appointment-not-automatic-total-loss", category: "cooperation", temporal: "current_2026", type: "exception", text: "Ein versäumter Termin bedeutet nicht automatisch den sofortigen vollständigen Wegfall aller Leistungen des Grundsicherungsgeldes.", sourceKey: "sgb2-32", passageKey: "sgb2-32-all", riskLevel: "high" },
  { key: "evidence-request-not-sanction", category: "cooperation", temporal: "current_2026", type: "exception", text: "Eine Unterlagenanforderung des Jobcenters ist nicht automatisch ein Minderungsbescheid und kein automatischer Verlust des Grundsicherungsgeldes.", sourceKey: "sgb2-31", passageKey: "sgb2-31-all", riskLevel: "medium" },
  { key: "pflichtverletzung-30-percent-3-months", category: "minderung", temporal: "current_2026", type: "definition", text: "Bei einer Pflichtverletzung nach § 31 SGB II mindert sich das Grundsicherungsgeld um 30 Prozent des maßgebenden Regelbedarfs. Der Minderungszeitraum beträgt drei Monate.", sourceKey: "sgb2-31a", passageKey: "sgb2-31a-all", riskLevel: "high" },
  { key: "first-missed-appointment-no-minderung", category: "minderung", temporal: "current_2026", type: "definition", text: "Auf ein einmalig ohne wichtigen Grund versäumtes Meldetermin folgt noch keine Leistungsminderung nach § 32 SGB II. Die wiederholte Minderung greift erst ab dem weiteren Versäumnis.", sourceKey: "bmas-overview", passageKey: "bmas-overview-all", riskLevel: "high" },
  { key: "second-missed-30-percent-1-month", category: "minderung", temporal: "current_2026", type: "definition", text: "Kommt die Person einer Meldeaufforderung wiederholt nicht nach, mindert sich das Grundsicherungsgeld um 30 Prozent des Regelbedarfs für einen Monat, sofern kein wichtiger Grund nachgewiesen wird.", sourceKey: "sgb2-32", passageKey: "sgb2-32-all", riskLevel: "high" },
  { key: "third-consecutive-nichterreichbarkeit", category: "minderung", temporal: "current_2026", type: "definition", text: "Wer drei aufeinanderfolgenden Meldeaufforderungen ohne wichtigen Grund nicht nachkommt, gilt als nicht erreichbar. Der Leistungsanspruch entfällt mit Beginn des folgenden Kalendermonats; für einen Monat wird Grundsicherungsgeld ohne Regelbedarf weitergezahlt, und eine persönliche Meldung kann die Erreichbarkeit wiederherstellen.", sourceKey: "sgb2-7b", passageKey: "sgb2-7b-all", riskLevel: "high" },
  { key: "wichtiger-grund-blocks", category: "minderung", temporal: "current_2026", type: "exception", text: "Eine Leistungsminderung wegen Pflichtverletzung oder Meldeversäumnis unterbleibt, wenn ein wichtiger Grund dargelegt und nachgewiesen wird.", sourceKey: "sgb2-31", passageKey: "sgb2-31-all", riskLevel: "high" },
  { key: "anhoerung-before-minderung", category: "minderung", temporal: "current_2026", type: "procedure", text: "Vor der Feststellung einer Minderung soll auf Verlangen persönlich angehört werden. Bei Anhaltspunkten für eine psychische Erkrankung oder vor einem dritten aufeinanderfolgenden Meldeversäumnis soll eine persönliche Anhörung erfolgen.", sourceKey: "sgb2-31a", passageKey: "sgb2-31a-all", riskLevel: "high" },
  { key: "anhoerung-not-minderungsbescheid", category: "minderung", temporal: "current_2026", type: "exception", text: "Eine Anhörung ist nicht derselbe Verwaltungsakt wie ein Minderungsbescheid. Aus einem Anhörungsschreiben darf keine feststehende Minderung abgeleitet werden.", sourceKey: "sgb10-24", passageKey: "sgb10-24-all", riskLevel: "high" },
  { key: "minderungsbescheid-is-va", category: "minderung", temporal: "current_2026", type: "definition", text: "Die Feststellung der Pflichtverletzung und der Minderung erfolgt durch Verwaltungsakt. Ein Minderungsbescheid ist kein gewöhnliches Informationsschreiben des Jobcenters.", sourceKey: "sgb2-31b", passageKey: "sgb2-31b-all", riskLevel: "high" },
  { key: "hardship-can-block", category: "minderung", temporal: "current_2026", type: "exception", text: "Eine Leistungsminderung erfolgt nicht, wenn sie im Einzelfall eine außergewöhnliche Härte bedeuten würde.", sourceKey: "sgb2-31a", passageKey: "sgb2-31a-all", riskLevel: "high" },
  { key: "job-refusal-regelbedarf-entfaellt", category: "minderung", temporal: "current_2026", type: "definition", text: "Nimmt eine erwerbsfähige leistungsberechtigte Person eine tatsächlich und unmittelbar mögliche zumutbare Arbeit willentlich nicht auf, entfällt der Leistungsanspruch in Höhe des Regelbedarfs. Die Unterkunftskosten sollen dann an den Vermieter gezahlt werden.", sourceKey: "sgb2-31a", passageKey: "sgb2-31a-all", riskLevel: "high" },
  { key: "minderung-ends-after-compliance", category: "minderung", temporal: "current_2026", type: "procedure", text: "Minderungen sind aufzuheben, sobald die Pflichten erfüllt oder ernsthaft und nachhaltig die Bereitschaft dazu erklärt wird, soweit der Minderungszeitraum mindestens einen Monat betragen hat.", sourceKey: "sgb2-31a", passageKey: "sgb2-31a-all", riskLevel: "high" },
  { key: "letter-not-automatic-sanction", category: "minderung", temporal: "current_2026", type: "exception", text: "Ein Schreiben des Jobcenters ist kein automatischer Minderungsbescheid. Eine Sanktion darf nicht allein aus einem Brief oder einem versäumten Termin abgeleitet werden.", sourceKey: "sgb2-31", passageKey: "sgb2-31-all", riskLevel: "high" },
  { key: "no-individual-sanction-without-facts", category: "minderung", temporal: "current_2026", type: "exception", text: "Eine individuelle Sanktionsfolge des Grundsicherungsgeldes darf ohne den feststellenden Verwaltungsakt, die Rechtsfolgenbelehrung und die konkreten Tatsachen nicht erfunden werden.", sourceKey: "sgb2-31b", passageKey: "sgb2-31b-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["PROCESS_VARIANT"] },
  { key: "letter-not-automatically-bescheid", category: "bescheid", temporal: "current_2026", type: "exception", text: "Ein gewöhnliches Schreiben des Jobcenters ist nicht automatisch ein Verwaltungsakt. Maßgebend ist, ob eine Regelung eines Einzelfalls mit unmittelbarer Rechtswirkung nach außen vorliegt.", sourceKey: "sgb10-31", passageKey: "sgb10-31-all", riskLevel: "high" },
  { key: "rechtsbehelfsbelehrung-required", category: "bescheid", temporal: "current_2026", type: "definition", text: "Ein Verwaltungsakt des Jobcenters muss eine Rechtsbehelfsbelehrung enthalten. Fehlt sie oder ist sie unrichtig, verlängert sich die Widerspruchsfrist nach den Regeln des SGG.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "bekanntgabe-not-document-date", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Das auf einem Jobcenter-Schreiben gedruckte Datum ist nicht ohne weiteres der Tag der Bekanntgabe. Im Inland gilt die Bekanntgabe durch die Post in der Regel am vierten Tag nach der Aufgabe zur Post.", sourceKey: "sgb10-37", passageKey: "sgb10-37-all", riskLevel: "high" },
  { key: "widerspruch-one-month", category: "widerspruch", temporal: "current_2026", type: "deadline", text: "Der Widerspruch gegen einen Verwaltungsakt des Jobcenters ist binnen eines Monats nach Bekanntgabe schriftlich, elektronisch oder zur Niederschrift einzulegen. Bei Bekanntgabe im Ausland beträgt die Frist drei Monate.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "do-not-auto-recommend-widerspruch", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Die gesetzliche Widerspruchsmöglichkeit ist keine Empfehlung, Widerspruch einzulegen. Ob ein Rechtsbehelf sinnvoll ist, hängt vom konkreten Verwaltungsakt und seinen Gründen ab.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "high" },
  { key: "widerspruch-not-automatic-suspension", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Ein Widerspruch hat nicht automatisch aufschiebende Wirkung für jede Entscheidung des Jobcenters. Insbesondere Aufhebung, Entziehung und Feststellung einer Minderung sind sofort vollziehbar.", sourceKey: "sgb2-39", passageKey: "sgb2-39-all", riskLevel: "high" },
  { key: "sgb2-39-no-suspensive-for-many", category: "widerspruch", temporal: "current_2026", type: "definition", text: "Nach § 39 SGB II haben Widerspruch und Anfechtungsklage keine aufschiebende Wirkung gegen Verwaltungsakte, die Leistungen aufheben, entziehen oder eine Minderung feststellen, sowie gegen bestimmte Mitwirkungsaufforderungen.", sourceKey: "sgb2-39", passageKey: "sgb2-39-all", riskLevel: "high" },
  { key: "individualized-deadline-needs-facts", category: "widerspruch", temporal: "current_2026", type: "exception", text: "Eine individuelle Widerspruchsfrist darf ohne Bekanntgabeart, Zugangsvermutung und den konkreten Verwaltungsakt nicht aus dem Dokumentdatum allein berechnet werden.", sourceKey: "sgb10-37", passageKey: "sgb10-37-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] },
  { key: "widerspruchsbescheid-then-court", category: "widerspruch", temporal: "current_2026", type: "procedure", text: "Bleibt der Widerspruch erfolglos, entscheidet das Jobcenter durch Widerspruchsbescheid. Dagegen ist die Klage zum Sozialgericht der nächste gesetzliche Rechtsbehelf.", sourceKey: "sgg-84", passageKey: "sgg-84-1", riskLevel: "medium" },
  { key: "overpayment-can-arise", category: "overpayment", temporal: "current_2026", type: "definition", text: "Eine Überzahlung kann entstehen, wenn sich Verhältnisse ändern, Angaben unvollständig waren oder ein Verwaltungsakt aufgehoben wird. Das Jobcenter kann dann Erstattung verlangen.", sourceKey: "sgb2-40", passageKey: "sgb2-40-all", riskLevel: "high" },
  { key: "not-every-demand-is-correct", category: "overpayment", temporal: "current_2026", type: "exception", text: "Nicht jede Zahlungsaufforderung des Jobcenters ist deshalb richtig. Zuerst sind Anhörung, Aufhebungsbescheid und die genannten Tatsachen zu prüfen.", sourceKey: "sgb2-40", passageKey: "sgb2-40-all", riskLevel: "high" },
  { key: "not-every-overpayment-must-be-appealed", category: "overpayment", temporal: "current_2026", type: "exception", text: "Nicht jede Überzahlung muss automatisch mit Widerspruch angegriffen werden. Ob ein Rechtsbehelf in Betracht kommt, hängt vom konkreten Verwaltungsakt ab.", sourceKey: "sgb2-40", passageKey: "sgb2-40-all", riskLevel: "high" },
  { key: "repayment-is-va", category: "overpayment", temporal: "current_2026", type: "definition", text: "Die Aufhebung und die Erstattungsforderung sind Verwaltungsakte. Ein bloßes Informationsschreiben über eine mögliche Überzahlung ist noch keine bestandskräftige Rückzahlungsentscheidung.", sourceKey: "sgb10-31", passageKey: "sgb10-31-all", riskLevel: "high" },
  { key: "anhoerung-before-adverse-repayment", category: "overpayment", temporal: "current_2026", type: "procedure", text: "Bevor das Jobcenter belastend aufhebt oder Erstattung festsetzt, ist in der Regel anzuhören. Die Anhörung ist nicht bereits der Erstattungsbescheid.", sourceKey: "sgb10-24", passageKey: "sgb10-24-all", riskLevel: "high" },
  { key: "unabweisbarer-bedarf-loan", category: "emergency", temporal: "current_2026", type: "procedure", text: "Kann ein vom Regelbedarf umfasster unabweisbarer Bedarf nicht gedeckt werden, erbringt das Jobcenter ihn als Sach- oder Geldleistung und gewährt ein Darlehen. Der Bedarf ist gesondert zu beantragen.", sourceKey: "sgb2-24", passageKey: "sgb2-24-all", riskLevel: "high" },
  { key: "rent-arrears-to-prevent-homelessness", category: "emergency", temporal: "current_2026", type: "procedure", text: "Zur Abwendung drohender Wohnungslosigkeit sollen Mietschulden übernommen werden, soweit dies gerechtfertigt und notwendig ist. Die Leistung soll als Darlehen erbracht werden.", sourceKey: "sgb2-22", passageKey: "sgb2-22-move", riskLevel: "high" },
  { key: "gsg-can-trigger-gkv", category: "health_interface", temporal: "current_2026", type: "definition", text: "Der Bezug von Grundsicherungsgeld nach § 19 Absatz 1 Satz 1 SGB II kann die Versicherungspflicht in der gesetzlichen Krankenversicherung auslösen. Die nähere Krankenversicherungslaufbahn gehört nicht in dieses Paket.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2a", riskLevel: "high" },
  { key: "jobcenter-pays-contributions-interface", category: "health_interface", temporal: "current_2026", type: "definition", text: "Während des Bezugs von Grundsicherungsgeld trägt das Jobcenter in der Regel die Beiträge zur gesetzlichen Kranken- und Pflegeversicherung. Ein früherer privater Versicherungsschutz kann diese Pflichtmitgliedschaft ausschließen.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2a", riskLevel: "high" },
  { key: "health-domain-is-separate", category: "health_interface", temporal: "current_2026", type: "exception", text: "Dieses Paket modelliert nur die Schnittstelle vom Grundsicherungsgeld in die Krankenversicherung. Wahl der Krankenkasse, eGK, Zusatzbeitrag und Krankengeld gehören in das gesonderte Krankenversicherungspaket.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2a", riskLevel: "medium" },
  { key: "previous-pkv-may-exclude-gkv-pflicht", category: "health_interface", temporal: "current_2026", type: "exception", text: "Wer zuletzt vor dem Bezug von Grundsicherungsgeld privat krankenversichert war, ist nach § 5 Absatz 5a SGB V von der Versicherungspflicht nach Nummer 2a ausgenommen.", sourceKey: "sgb5-5", passageKey: "sgb5-5-2a", riskLevel: "high" },
  { key: "sgb2-7-exclusions-need-status", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ob eine ausländerrechtliche Ausnahme nach § 7 Absatz 1 Satz 2 SGB II greift, darf ohne Aufenthaltsrecht, Aufenthaltszweck und Dauer nicht entschieden werden.", sourceKey: "sgb2-7", passageKey: "sgb2-7-foreign", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "COUNTRY"] },
  { key: "asylblg-exclusion", category: "cross_border", temporal: "current_2026", type: "definition", text: "Leistungsberechtigte nach § 1 des Asylbewerberleistungsgesetzes sind vom Grundsicherungsgeld nach § 7 Absatz 1 Satz 2 Nummer 3 SGB II ausgenommen.", sourceKey: "sgb2-7", passageKey: "sgb2-7-foreign", riskLevel: "high" },
  { key: "cross-border-fail-closed", category: "cross_border", temporal: "current_2026", type: "exception", text: "Ein grenzüberschreitender oder aufenthaltsrechtlich ungeklärter Fall darf nicht vereinfacht entschieden werden. Wohnsitz oder Staatsangehörigkeit allein ersetzen nicht die erforderlichen Statusmerkmale.", sourceKey: "sgb2-7", passageKey: "sgb2-7-foreign", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["RESIDENCE_STATE", "WORK_STATE", "COUNTRY"] },
  { key: "language-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "Die Dokumentsprache bestimmt nicht das zuständige Jobcenter und nicht den Anspruch auf Grundsicherungsgeld.", sourceKey: "sgb2-36", passageKey: "sgb2-36-all", riskLevel: "high" },
  { key: "userlocale-not-jurisdiction", category: "competence", temporal: "current_2026", type: "exception", text: "userLocale, die Sprache der Oberfläche oder die Sprache eines Schreibens bestimmen weder die Zuständigkeit des Jobcenters noch den Leistungsanspruch.", sourceKey: "sgb2-36", passageKey: "sgb2-36-all", riskLevel: "high" },
  { key: "foreign-erwerbsfaehigkeit-needs-work-permit-facts", category: "cross_border", temporal: "current_2026", type: "exception", text: "Für Ausländerinnen und Ausländer hängt die Erwerbsfähigkeit auch davon ab, ob eine Beschäftigung erlaubt ist oder erlaubt werden könnte. Ohne diese Tatsachen darf der Anspruch nicht entschieden werden.", sourceKey: "sgb2-8", passageKey: "sgb2-8-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["COUNTRY"] },
  { key: "competence-by-gewoehnlicher-aufenthalt", category: "competence", temporal: "current_2026", type: "definition", text: "Zuständig ist das Jobcenter am gewöhnlichen Aufenthalt der erwerbsfähigen leistungsberechtigten Person. Fehlt ein gewöhnlicher Aufenthalt, entscheidet der tatsächliche Aufenthalt.", sourceKey: "sgb2-36", passageKey: "sgb2-36-all", riskLevel: "high" },
  { key: "find-jobcenter-via-dienststellensuche", category: "competence", temporal: "current_2026", type: "procedure", text: "Das zuständige Jobcenter ist über die Dienststellensuche der Bundesagentur für Arbeit anhand des tatsächlichen Wohnorts zu ermitteln, nicht anhand der Sprache.", sourceKey: "ba-jobcenter-finder", passageKey: "ba-finder-all", riskLevel: "medium" },
  { key: "land-alone-not-enough", category: "competence", temporal: "current_2026", type: "exception", text: "Das Bundesland allein bestimmt nicht das zuständige Jobcenter. Erforderlich ist der gewöhnliche Aufenthalt in einem konkreten örtlichen Zuständigkeitsbereich.", sourceKey: "sgb2-36", passageKey: "sgb2-36-all", riskLevel: "high" },
  { key: "no-hardcoded-local-jobcenter", category: "competence", temporal: "current_2026", type: "exception", text: "Im Bundeskern darf kein bestimmtes örtliches Jobcenter als bundesweit zuständige Stelle festgeschrieben werden.", sourceKey: "ba-jobcenter-finder", passageKey: "ba-finder-all", riskLevel: "high" },
  { key: "opening-hours-are-live", category: "competence", temporal: "current_2026", type: "procedure", text: "Öffnungszeiten und aktuelle Kontaktdaten des örtlichen Jobcenters sind live zu prüfen und keine kanonische Bundeskonstante.", sourceKey: "ba-jobcenter-finder", passageKey: "ba-finder-all", riskLevel: "medium" },
  { key: "insufficient-facts-no-jobcenter", category: "competence", temporal: "current_2026", type: "exception", text: "Ohne gewöhnlichen Aufenthalt oder tatsächlichen Aufenthalt darf kein bestimmtes Jobcenter benannt werden.", sourceKey: "sgb2-36", passageKey: "sgb2-36-all", riskLevel: "high", requiresAuthorityResolution: true, requiredContextKeys: ["BUNDESLAND"] },
]);

export type JobcenterProcessSpec = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "low" | "medium" | "high";
}>;

export type JobcenterFormSpec = Readonly<{
  key: string;
  name: string;
  identifier: string;
  purpose: string;
  submissionChannels: readonly string[];
  sourceKey: string;
  passageKey: string;
}>;

export type JobcenterBindingSpec = Readonly<{
  processKey: string;
  role: JobcenterProcessRole;
  sequenceContext: string;
  claimKeys: readonly string[];
  required?: boolean;
  qualificationRequired?: boolean;
}>;

export type JobcenterProcessScenario = Readonly<{
  id: string;
  label: string;
  coverage: JobcenterScenarioCoverage;
  requiredClaimKeys: readonly string[];
  requiredProcessKeys: readonly string[];
  requiredFormIdentifiers?: readonly string[];
  note?: string;
}>;

export const JOBCENTER_PROCESSES: readonly JobcenterProcessSpec[] = Object.freeze([
  { key: "orientation-eligibility", title: "Grundsicherungsgeld einordnen 2026", trigger: "Eine Person fragt, was Grundsicherungsgeld ist oder ob sie Anspruch haben könnte", safeFirstStep: "Die vier gesetzlichen Voraussetzungen erklären und Arbeitslosigkeit nicht mit einem Automatikanspruch verwechseln.", riskLevel: "high" },
  { key: "initial-application", title: "Erstantrag auf Grundsicherungsgeld 2026", trigger: "Grundsicherungsgeld soll erstmals beantragt werden", safeFirstStep: "Den formfreien Antrag beim zuständigen Jobcenter stellen, die Bedarfsgemeinschaft angeben und Nachweise vorbereiten, ohne Originale abzugeben.", riskLevel: "high" },
  { key: "benefit-calculation-orientation", title: "Leistungsbestandteile ohne Einzelbetrag 2026", trigger: "Die Höhe oder Zusammensetzung des Grundsicherungsgeldes ist gefragt", safeFirstStep: "Regelbedarf, Mehrbedarf, Unterkunft, Einkommen und Vermögen als Struktur erklären und keinen individuellen Betrag erfinden.", riskLevel: "high" },
  { key: "housing-kdu", title: "Unterkunft und Heizung im SGB II 2026", trigger: "Miete, Heizung, Umzug, Kaution oder Angemessenheit sind angesprochen", safeFirstStep: "Karenzzeit und Eineinhalbfach-Grenze erklären; örtliche Eurogrenzen nicht als Bundeskonstante nennen und vor einem neuen Mietvertrag die Zusicherung einholen.", riskLevel: "high" },
  { key: "decision-payment-continuation", title: "Bewilligung, Zahlung und Weiterbewilligung 2026", trigger: "Ein Bewilligungsbescheid, die Auszahlung oder das Ende des Bewilligungszeitraums ist angesprochen", safeFirstStep: "Den Bescheid lesen, den Bewilligungszeitraum feststellen und rechtzeitig den Weiterbewilligungsantrag vorbereiten.", riskLevel: "medium" },
  { key: "change-report", title: "Veränderungsmitteilung während des Bezugs 2026", trigger: "Arbeit, Einkommen, Haushalt, Anschrift, Miete oder Bankverbindung ändern sich", safeFirstStep: "Die Änderung unverzüglich dem Jobcenter mitteilen und nicht annehmen, dass Arbeit das Grundsicherungsgeld sofort beendet.", riskLevel: "high" },
  { key: "jobcenter-cooperation", title: "Zusammenarbeit, Kooperationsplan und Erreichbarkeit 2026", trigger: "Termine, Kooperationsplan, Vermittlung oder Abwesenheit sind angesprochen", safeFirstStep: "Den persönlichen Ersttermin wahrnehmen, den Kooperationsplan als Orientierung verstehen und Abwesenheit vorher abstimmen.", riskLevel: "high" },
  { key: "leistungsminderung", title: "Leistungsminderung und Meldeversäumnis 2026", trigger: "Ein Anhörungsschreiben, ein versäumter Termin oder eine mögliche Minderung liegt vor", safeFirstStep: "Anhörung und Minderungsbescheid trennen; wichtigen Grund prüfen und aus einem Brief keine automatische Sanktion ableiten.", riskLevel: "high" },
  { key: "bescheid-inspect", title: "Jobcenter-Bescheid sicher lesen 2026", trigger: "Ein Bewilligungs-, Ablehnungs-, Änderungs- oder Minderungsbescheid liegt vor", safeFirstStep: "Prüfen, ob ein Verwaltungsakt vorliegt, Begründung und Rechtsbehelfsbelehrung lesen und daraus keine automatische Widerspruchsempfehlung ableiten.", riskLevel: "high" },
  { key: "widerspruch-foundation", title: "Widerspruch gegen einen Jobcenter-Verwaltungsakt 2026", trigger: "Gegen eine Entscheidung des Jobcenters soll ein Widerspruch geprüft werden", safeFirstStep: "Nur bei Verwaltungsakt und Bekanntgabe fortfahren; das Briefdatum nicht als Fristbeginn verwenden und die fehlende aufschiebende Wirkung bei vielen Entscheidungen beachten.", riskLevel: "high" },
  { key: "overpayment-repayment", title: "Überzahlung und Erstattung 2026", trigger: "Eine Rückzahlung, Aufhebung oder Erstattungsforderung des Jobcenters ist angesprochen", safeFirstStep: "Anhörung und Erstattungsbescheid unterscheiden; nicht jede Forderung als richtig und nicht jede Überzahlung als Widerspruchsfall behandeln.", riskLevel: "high" },
  { key: "emergency-special-need", title: "Unabweisbarer Bedarf und Wohnungsnot 2026", trigger: "Ein akuter Bedarf, eine Erstausstattung oder Mietrückstände mit drohender Wohnungslosigkeit sind angesprochen", safeFirstStep: "Den gesonderten Antrag oder die Schuldenübernahme als Darlehen prüfen und spezialisierte Randfälle nicht im Bundeskern entscheiden.", riskLevel: "high" },
  { key: "health-insurance-interface", title: "Schnittstelle Grundsicherungsgeld und Krankenversicherung 2026", trigger: "Krankenversicherung während des Grundsicherungsgeldes ist angesprochen", safeFirstStep: "Nur die gesetzliche Schnittstelle erklären und in das gesonderte Krankenversicherungspaket verweisen.", riskLevel: "high" },
  { key: "foreign-status-gate", title: "Ausländer-, Unions- und Grenzfall als Statusgate 2026", trigger: "Staatsangehörigkeit, Aufenthalt, Asyl oder ein grenzüberschreitender Sachverhalt ist angesprochen", safeFirstStep: "Keine vereinfachte Regel bilden; ohne Aufenthaltsstatus, Zweck und Dauer fail-closed bleiben.", riskLevel: "high" },
  { key: "competent-jobcenter-resolution", title: "Zuständiges Jobcenter klären 2026", trigger: "Das zuständige Jobcenter, eine lokale Hotline oder Öffnungszeiten sollen benannt werden", safeFirstStep: "Den gewöhnlichen Aufenthalt feststellen und die Dienststellensuche nutzen; Sprache, userLocale oder Bundesland allein nicht als Zuständigkeit behandeln.", riskLevel: "high" },
]);

export const JOBCENTER_FORMS: readonly JobcenterFormSpec[] = Object.freeze([
  { key: "sgb2-hauptantrag", name: "Antrag auf Grundsicherungsgeld", identifier: "SGB2-Hauptantrag", purpose: "Formfreier, aber dokumentierter Erstantrag auf Grundsicherungsgeld für die Bedarfsgemeinschaft", submissionChannels: ["online", "in_person", "phone", "written"], sourceKey: "ba-antrag", passageKey: "ba-antrag-form" },
  { key: "sgb2-wba", name: "Weiterbewilligungsantrag Grundsicherungsgeld", identifier: "SGB2-WBA", purpose: "Fortsetzung des Grundsicherungsgeldes nach Ende des Bewilligungszeitraums", submissionChannels: ["online", "in_person", "phone", "written"], sourceKey: "ba-wba", passageKey: "ba-wba-all" },
  { key: "sgb2-change", name: "Veränderungsmitteilung", identifier: "SGB2-Veraenderungsmitteilung", purpose: "Unverzügliche Mitteilung leistungserheblicher Änderungen während des Bezugs", submissionChannels: ["online", "in_person", "written"], sourceKey: "ba-veraenderung", passageKey: "ba-change-all" },
  { key: "sgb2-kdu", name: "Anlage Kosten der Unterkunft und Heizung", identifier: "SGB2-KdU-Anlage", purpose: "Angaben und Nachweise zu Miete, Heizung und Nebenkosten", submissionChannels: ["online", "in_person", "written"], sourceKey: "ba-antrag", passageKey: "ba-antrag-evidence" },
  { key: "sgg-widerspruch", name: "Widerspruch gegen einen Verwaltungsakt des Jobcenters", identifier: "SGG-Widerspruch", purpose: "Einlegung des Widerspruchs bei der erlassenden Stelle in der gesetzlich zulässigen Form", submissionChannels: ["written_or_electronic_or_niederschrift"], sourceKey: "sgg-84", passageKey: "sgg-84-1" },
]);

export const JOBCENTER_PROCESS_BINDINGS: readonly JobcenterBindingSpec[] = Object.freeze([
  { processKey: "orientation-eligibility", role: "orientation_basis", sequenceContext: "what", claimKeys: ["gsg-is-current-term", "gsg-is-sgb2-leistung", "buergergeld-is-legacy-term", "eligibility-four-conditions", "erwerbsfaehigkeit-three-hours", "hilfebeduerftigkeit-definition", "gewoehnlicher-aufenthalt-required", "bedarfsgemeinschaft-structure", "vorrangige-leistungen-duty", "alg-transition-possible"] },
  { processKey: "orientation-eligibility", role: "negative_control", sequenceContext: "not", claimKeys: ["unemployed-not-automatically-entitled", "employed-not-automatically-excluded", "residence-not-automatic-entitlement", "married-not-automatic-result", "same-address-not-enough-for-household", "income-not-automatic-exclusion", "buergergeld-wording-not-invalid", "existing-bescheid-remains-valid", "no-new-application-for-existing-recipients", "individual-entitlement-needs-facts"] },
  { processKey: "initial-application", role: "application_route", sequenceContext: "how", claimKeys: ["application-required", "application-not-form-bound", "application-channels", "application-backdates-to-month-start", "apply-for-bedarfsgemeinschaft", "never-submit-originals"] },
  { processKey: "initial-application", role: "evidence_requirement", sequenceContext: "docs", claimKeys: ["identity-evidence", "income-evidence", "asset-evidence-on-request", "housing-evidence"] },
  { processKey: "initial-application", role: "next_state", sequenceContext: "next", claimKeys: ["after-application-comes-bescheid"] },
  { processKey: "initial-application", role: "negative_control", sequenceContext: "not", claimKeys: ["missing-evidence-not-rejection"] },
  { processKey: "benefit-calculation-orientation", role: "orientation_basis", sequenceContext: "structure", claimKeys: ["gsg-covers-regel-mehr-kdu", "regelbedarf-is-annual-not-timeless", "mehrbedarf-is-case-specific", "income-and-assets-reduce", "vermoegen-age-allowance-exists"] },
  { processKey: "benefit-calculation-orientation", role: "negative_control", sequenceContext: "not", claimKeys: ["no-individual-amount"] },
  { processKey: "housing-kdu", role: "orientation_basis", sequenceContext: "kdu", claimKeys: ["kdu-actual-if-appropriate", "karenzzeit-one-year-housing", "karenz-cap-one-and-half", "appropriateness-is-local", "zusicherung-before-new-lease", "kaution-as-loan", "guthaben-reduces-kdu", "rent-arrears-orientation"] },
  { processKey: "housing-kdu", role: "negative_control", sequenceContext: "kdu_not", claimKeys: ["no-federal-kdu-euro", "moving-not-automatic-approval", "high-rent-not-automatic-total-loss", "local-kdu-needs-locality"] },
  { processKey: "decision-payment-continuation", role: "decision", sequenceContext: "bescheid", claimKeys: ["bewilligungsbescheid-is-va", "bewilligungszeitraum-typically-one-year", "inspect-bescheid-parts", "provisional-decision-exists"] },
  { processKey: "decision-payment-continuation", role: "payment", sequenceContext: "zahlung", claimKeys: ["payment-monthly-in-advance", "weiterbewilligung-required", "change-during-period-report"] },
  { processKey: "decision-payment-continuation", role: "negative_control", sequenceContext: "dauer_not", claimKeys: ["duration-is-case-specific"] },
  { processKey: "change-report", role: "application_route", sequenceContext: "melden", claimKeys: ["veraenderung-unverzueglich", "start-job-report", "material-changes-include-income-household-housing-bank", "non-report-can-cause-repayment"] },
  { processKey: "change-report", role: "negative_control", sequenceContext: "arbeit_not", claimKeys: ["start-job-not-automatic-end"] },
  { processKey: "jobcenter-cooperation", role: "orientation_basis", sequenceContext: "koop", claimKeys: ["first-meeting-in-person", "kooperationsplan-is-orientation", "kooperationsplan-not-rechtsfolgen", "verbindliche-verpflichtung-via-va", "vermittlungsvorrang", "appointments-duty", "erreichbarkeit-required", "absence-needs-consent"] },
  { processKey: "jobcenter-cooperation", role: "negative_control", sequenceContext: "koop_not", claimKeys: ["missed-appointment-not-automatic-total-loss", "evidence-request-not-sanction"] },
  { processKey: "leistungsminderung", role: "orientation_basis", sequenceContext: "minderung", claimKeys: ["pflichtverletzung-30-percent-3-months", "first-missed-appointment-no-minderung", "second-missed-30-percent-1-month", "third-consecutive-nichterreichbarkeit", "wichtiger-grund-blocks", "anhoerung-before-minderung", "hardship-can-block", "job-refusal-regelbedarf-entfaellt", "minderung-ends-after-compliance"] },
  { processKey: "leistungsminderung", role: "negative_control", sequenceContext: "minderung_not", claimKeys: ["anhoerung-not-minderungsbescheid", "minderungsbescheid-is-va", "letter-not-automatic-sanction", "no-individual-sanction-without-facts"] },
  { processKey: "bescheid-inspect", role: "orientation_basis", sequenceContext: "lesen", claimKeys: ["bewilligungsbescheid-is-va", "inspect-bescheid-parts", "rechtsbehelfsbelehrung-required"] },
  { processKey: "bescheid-inspect", role: "negative_control", sequenceContext: "lesen_not", claimKeys: ["letter-not-automatically-bescheid", "do-not-auto-recommend-widerspruch"] },
  { processKey: "widerspruch-foundation", role: "legal_remedy_gate", sequenceContext: "widerspruch_gate", qualificationRequired: true, claimKeys: ["widerspruch-one-month", "do-not-auto-recommend-widerspruch", "widerspruch-not-automatic-suspension", "sgb2-39-no-suspensive-for-many"] },
  { processKey: "widerspruch-foundation", role: "deadline_gate", sequenceContext: "frist", qualificationRequired: true, claimKeys: ["bekanntgabe-not-document-date", "individualized-deadline-needs-facts", "widerspruchsbescheid-then-court"] },
  { processKey: "overpayment-repayment", role: "orientation_basis", sequenceContext: "erstattung", claimKeys: ["overpayment-can-arise", "repayment-is-va", "anhoerung-before-adverse-repayment"] },
  { processKey: "overpayment-repayment", role: "negative_control", sequenceContext: "erstattung_not", claimKeys: ["not-every-demand-is-correct", "not-every-overpayment-must-be-appealed"] },
  { processKey: "emergency-special-need", role: "application_route", sequenceContext: "notfall", claimKeys: ["unabweisbarer-bedarf-loan", "rent-arrears-to-prevent-homelessness"] },
  { processKey: "health-insurance-interface", role: "orientation_basis", sequenceContext: "kv", claimKeys: ["gsg-can-trigger-gkv", "jobcenter-pays-contributions-interface", "previous-pkv-may-exclude-gkv-pflicht"] },
  { processKey: "health-insurance-interface", role: "negative_control", sequenceContext: "kv_not", claimKeys: ["health-domain-is-separate"] },
  { processKey: "foreign-status-gate", role: "context_gate", sequenceContext: "status", qualificationRequired: true, claimKeys: ["foreign-nationality-not-automatic-exclusion", "eu-citizenship-not-automatic-entitlement", "sgb2-7-exclusions-need-status", "asylblg-exclusion", "cross-border-fail-closed", "foreign-erwerbsfaehigkeit-needs-work-permit-facts"] },
  { processKey: "competent-jobcenter-resolution", role: "orientation_basis", sequenceContext: "zustaendigkeit", claimKeys: ["competence-by-gewoehnlicher-aufenthalt", "find-jobcenter-via-dienststellensuche"] },
  { processKey: "competent-jobcenter-resolution", role: "negative_control", sequenceContext: "zustaendigkeit_not", qualificationRequired: true, claimKeys: ["language-not-jurisdiction", "userlocale-not-jurisdiction", "land-alone-not-enough", "no-hardcoded-local-jobcenter", "opening-hours-are-live", "insufficient-facts-no-jobcenter"] },
]);

export const JOBCENTER_PROCESS_SCENARIOS: readonly JobcenterProcessScenario[] = Object.freeze([
  { id: "what-is-gsg", label: "Was Grundsicherungsgeld ist", coverage: "COVERED", requiredClaimKeys: ["gsg-is-current-term", "gsg-is-sgb2-leistung"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "legacy-buergergeld-term", label: "Bürgergeld als Übergangsbegriff", coverage: "COVERED", requiredClaimKeys: ["buergergeld-is-legacy-term", "buergergeld-wording-not-invalid"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "existing-recipient-no-new-application", label: "Bestandsbeziehende ohne neuen Erstantrag", coverage: "COVERED", requiredClaimKeys: ["existing-bescheid-remains-valid", "no-new-application-for-existing-recipients"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "eligibility-structure", label: "Vier Anspruchsvoraussetzungen", coverage: "COVERED", requiredClaimKeys: ["eligibility-four-conditions", "erwerbsfaehigkeit-three-hours", "hilfebeduerftigkeit-definition"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "unemployed-not-automatic", label: "Arbeitslosigkeit nicht automatisch Anspruch", coverage: "COVERED", requiredClaimKeys: ["unemployed-not-automatically-entitled"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "employed-aufstocker", label: "Erwerbstätigkeit nicht automatisch Ausschluss", coverage: "COVERED", requiredClaimKeys: ["employed-not-automatically-excluded", "income-not-automatic-exclusion"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "bedarfsgemeinschaft", label: "Bedarfsgemeinschaft", coverage: "COVERED", requiredClaimKeys: ["bedarfsgemeinschaft-structure", "married-not-automatic-result", "same-address-not-enough-for-household"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "vorrangige-leistungen", label: "Vorrangige Leistungen", coverage: "COVERED", requiredClaimKeys: ["vorrangige-leistungen-duty"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "alg-transition", label: "Übergang vom Arbeitslosengeld", coverage: "COVERED", requiredClaimKeys: ["alg-transition-possible"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "individual-entitlement-gate", label: "Individueller Anspruch fail-closed", coverage: "COVERED", requiredClaimKeys: ["individual-entitlement-needs-facts"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "first-application", label: "Erstantrag", coverage: "COVERED", requiredClaimKeys: ["application-required", "application-not-form-bound", "application-channels"], requiredProcessKeys: ["initial-application"], requiredFormIdentifiers: ["SGB2-Hauptantrag"] },
  { id: "application-timing", label: "Antragsrückwirkung auf Monatsbeginn", coverage: "COVERED", requiredClaimKeys: ["application-backdates-to-month-start"], requiredProcessKeys: ["initial-application"] },
  { id: "application-evidence", label: "Nachweise zum Antrag", coverage: "COVERED", requiredClaimKeys: ["identity-evidence", "income-evidence", "asset-evidence-on-request", "housing-evidence"], requiredProcessKeys: ["initial-application"] },
  { id: "missing-evidence", label: "Nachforderung ist keine Ablehnung", coverage: "COVERED", requiredClaimKeys: ["missing-evidence-not-rejection"], requiredProcessKeys: ["initial-application"] },
  { id: "calculation-orientation", label: "Leistungsbestandteile", coverage: "COVERED", requiredClaimKeys: ["gsg-covers-regel-mehr-kdu", "regelbedarf-is-annual-not-timeless", "no-individual-amount"], requiredProcessKeys: ["benefit-calculation-orientation"] },
  { id: "vermoegen-orientation", label: "Vermögen und altersgestaffelte Freibeträge", coverage: "COVERED", requiredClaimKeys: ["vermoegen-age-allowance-exists"], requiredProcessKeys: ["benefit-calculation-orientation"] },
  { id: "housing-karenz", label: "Wohn-Karenzzeit und Eineinhalbfach-Grenze", coverage: "COVERED", requiredClaimKeys: ["karenzzeit-one-year-housing", "karenz-cap-one-and-half"], requiredProcessKeys: ["housing-kdu"] },
  { id: "local-appropriateness", label: "Örtliche Angemessenheit", coverage: "COVERED", requiredClaimKeys: ["appropriateness-is-local", "no-federal-kdu-euro"], requiredProcessKeys: ["housing-kdu"] },
  { id: "move-zusicherung", label: "Umzug und Zusicherung", coverage: "COVERED", requiredClaimKeys: ["zusicherung-before-new-lease", "moving-not-automatic-approval"], requiredProcessKeys: ["housing-kdu"] },
  { id: "kaution-and-guthaben", label: "Kaution und Betriebskostenguthaben", coverage: "COVERED", requiredClaimKeys: ["kaution-as-loan", "guthaben-reduces-kdu"], requiredProcessKeys: ["housing-kdu"], requiredFormIdentifiers: ["SGB2-KdU-Anlage"] },
  { id: "high-rent-not-total-loss", label: "Hohe Miete nicht sofortiger Totalverlust", coverage: "COVERED", requiredClaimKeys: ["high-rent-not-automatic-total-loss"], requiredProcessKeys: ["housing-kdu"] },
  { id: "bewilligung-and-payment", label: "Bewilligung und Auszahlung", coverage: "COVERED", requiredClaimKeys: ["bewilligungsbescheid-is-va", "payment-monthly-in-advance"], requiredProcessKeys: ["decision-payment-continuation"] },
  { id: "weiterbewilligung", label: "Weiterbewilligung", coverage: "COVERED", requiredClaimKeys: ["weiterbewilligung-required", "duration-is-case-specific"], requiredProcessKeys: ["decision-payment-continuation"], requiredFormIdentifiers: ["SGB2-WBA"] },
  { id: "change-report-process", label: "Veränderungsmitteilung", coverage: "COVERED", requiredClaimKeys: ["veraenderung-unverzueglich", "material-changes-include-income-household-housing-bank"], requiredProcessKeys: ["change-report"], requiredFormIdentifiers: ["SGB2-Veraenderungsmitteilung"] },
  { id: "start-job-not-end", label: "Arbeitsaufnahme nicht sofortiges Leistungsende", coverage: "COVERED", requiredClaimKeys: ["start-job-report", "start-job-not-automatic-end"], requiredProcessKeys: ["change-report"] },
  { id: "first-personal-meeting", label: "Persönlicher Ersttermin", coverage: "COVERED", requiredClaimKeys: ["first-meeting-in-person", "kooperationsplan-is-orientation"], requiredProcessKeys: ["jobcenter-cooperation"] },
  { id: "kooperationsplan", label: "Kooperationsplan und verbindliche Verpflichtung", coverage: "COVERED", requiredClaimKeys: ["kooperationsplan-not-rechtsfolgen", "verbindliche-verpflichtung-via-va"], requiredProcessKeys: ["jobcenter-cooperation"] },
  { id: "vermittlungsvorrang-journey", label: "Vermittlungsvorrang", coverage: "COVERED", requiredClaimKeys: ["vermittlungsvorrang"], requiredProcessKeys: ["jobcenter-cooperation"] },
  { id: "erreichbarkeit", label: "Erreichbarkeit und Abwesenheit", coverage: "COVERED", requiredClaimKeys: ["erreichbarkeit-required", "absence-needs-consent"], requiredProcessKeys: ["jobcenter-cooperation"] },
  { id: "missed-appointment-not-total-loss", label: "Versäumter Termin nicht Totalverlust", coverage: "COVERED", requiredClaimKeys: ["missed-appointment-not-automatic-total-loss"], requiredProcessKeys: ["jobcenter-cooperation"] },
  { id: "pflichtverletzung-minderung", label: "Pflichtverletzung 30 Prozent drei Monate", coverage: "COVERED", requiredClaimKeys: ["pflichtverletzung-30-percent-3-months"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "meldeversaeumnis-stufen", label: "Gestufte Meldeversäumnisse", coverage: "COVERED", requiredClaimKeys: ["first-missed-appointment-no-minderung", "second-missed-30-percent-1-month", "third-consecutive-nichterreichbarkeit"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "anhoerung-vs-minderung", label: "Anhörung ist kein Minderungsbescheid", coverage: "COVERED", requiredClaimKeys: ["anhoerung-before-minderung", "anhoerung-not-minderungsbescheid"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "wichtiger-grund-and-hardship", label: "Wichtiger Grund und Härte", coverage: "COVERED", requiredClaimKeys: ["wichtiger-grund-blocks", "hardship-can-block"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "job-refusal", label: "Ablehnung einer tatsächlich verfügbaren Arbeit", coverage: "COVERED", requiredClaimKeys: ["job-refusal-regelbedarf-entfaellt"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "minderung-ends", label: "Aufhebung nach Pflichterfüllung", coverage: "COVERED", requiredClaimKeys: ["minderung-ends-after-compliance"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "letter-not-sanction", label: "Schreiben ist keine automatische Sanktion", coverage: "COVERED", requiredClaimKeys: ["letter-not-automatic-sanction", "no-individual-sanction-without-facts"], requiredProcessKeys: ["leistungsminderung"] },
  { id: "letter-not-va", label: "Schreiben ist nicht automatisch Bescheid", coverage: "COVERED", requiredClaimKeys: ["letter-not-automatically-bescheid", "inspect-bescheid-parts"], requiredProcessKeys: ["bescheid-inspect"] },
  { id: "widerspruch-gate", label: "Widerspruch nur mit Verwaltungsakt und Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["widerspruch-one-month", "do-not-auto-recommend-widerspruch"], requiredProcessKeys: ["widerspruch-foundation"], requiredFormIdentifiers: ["SGG-Widerspruch"] },
  { id: "widerspruch-deadline-context", label: "Widerspruchsfrist braucht Bekanntgabe", coverage: "COVERED", requiredClaimKeys: ["bekanntgabe-not-document-date", "individualized-deadline-needs-facts"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "widerspruch-no-auto-suspension", label: "Widerspruch ohne automatische aufschiebende Wirkung", coverage: "COVERED", requiredClaimKeys: ["widerspruch-not-automatic-suspension", "sgb2-39-no-suspensive-for-many"], requiredProcessKeys: ["widerspruch-foundation"] },
  { id: "overpayment", label: "Überzahlung und Erstattung", coverage: "COVERED", requiredClaimKeys: ["overpayment-can-arise", "not-every-demand-is-correct", "not-every-overpayment-must-be-appealed"], requiredProcessKeys: ["overpayment-repayment"] },
  { id: "emergency-loan", label: "Unabweisbarer Bedarf", coverage: "COVERED", requiredClaimKeys: ["unabweisbarer-bedarf-loan"], requiredProcessKeys: ["emergency-special-need"] },
  { id: "rent-arrears-homelessness", label: "Mietschulden und drohende Wohnungslosigkeit", coverage: "COVERED", requiredClaimKeys: ["rent-arrears-to-prevent-homelessness", "rent-arrears-orientation"], requiredProcessKeys: ["emergency-special-need", "housing-kdu"] },
  { id: "health-interface", label: "Krankenversicherungsschnittstelle", coverage: "COVERED", requiredClaimKeys: ["gsg-can-trigger-gkv", "health-domain-is-separate"], requiredProcessKeys: ["health-insurance-interface"] },
  { id: "foreign-status-gate", label: "Ausländer- und Unionsstatus fail-closed", coverage: "COVERED", requiredClaimKeys: ["foreign-nationality-not-automatic-exclusion", "eu-citizenship-not-automatic-entitlement", "cross-border-fail-closed"], requiredProcessKeys: ["foreign-status-gate"] },
  { id: "asylblg-boundary", label: "AsylbLG-Grenze", coverage: "COVERED", requiredClaimKeys: ["asylblg-exclusion"], requiredProcessKeys: ["foreign-status-gate"] },
  { id: "user-locale-not-jurisdiction", label: "userLocale bestimmt keine Zuständigkeit", coverage: "COVERED", requiredClaimKeys: ["userlocale-not-jurisdiction", "language-not-jurisdiction"], requiredProcessKeys: ["competent-jobcenter-resolution"] },
  { id: "competence-by-residence", label: "Zuständigkeit nach gewöhnlichem Aufenthalt", coverage: "COVERED", requiredClaimKeys: ["competence-by-gewoehnlicher-aufenthalt", "find-jobcenter-via-dienststellensuche"], requiredProcessKeys: ["competent-jobcenter-resolution"] },
  { id: "land-not-enough", label: "Bundesland allein genügt nicht", coverage: "COVERED", requiredClaimKeys: ["land-alone-not-enough", "insufficient-facts-no-jobcenter"], requiredProcessKeys: ["competent-jobcenter-resolution"] },
  { id: "opening-hours-live", label: "Öffnungszeiten live", coverage: "COVERED", requiredClaimKeys: ["opening-hours-are-live", "no-hardcoded-local-jobcenter"], requiredProcessKeys: ["competent-jobcenter-resolution"] },
  { id: "residence-not-automatic", label: "Wohnsitz nicht automatisch Anspruch", coverage: "COVERED", requiredClaimKeys: ["residence-not-automatic-entitlement", "gewoehnlicher-aufenthalt-required"], requiredProcessKeys: ["orientation-eligibility"] },
  { id: "individual-amount-calculation", label: "Individuelle Betragsberechnung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Struktur; kein fallbezogener Zahlbetrag." },
  { id: "local-kdu-euro-tables", label: "Örtliche KdU-Eurotabellen als Bundeskonstante", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Lokale Angemessenheitsgrenzen gehören in Live-/Ortsauflösung." },
  { id: "full-immigration-asylum", label: "Vollständige Aufenthalts- und Asylenzyklopädie", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur gesetzliche Grenze und Fail-closed-Gate." },
  { id: "full-health-insurance-domain", label: "Vollständige Krankenversicherung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur Schnittstelle; Rest im health_insurance_orientation-Paket." },
  { id: "specialized-sgb12-asylblg-deep", label: "SGB-XII- und AsylbLG-Vertiefung", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Spezialisierte Randfälle bleiben außerhalb." },
  { id: "individual-sanction-amount", label: "Individueller Sanktionsbetrag", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Nur gesetzliche Struktur; keine fallbezogene Kürzung." },
  { id: "hardcoded-named-local-jobcenter", label: "Festgeschriebenes örtliches Jobcenter", coverage: "OUT_OF_SCOPE", requiredClaimKeys: [], requiredProcessKeys: [], note: "Zuständigkeit wird über gewöhnlichen Aufenthalt und Dienststellensuche ermittelt." },
]);

const CONTEXT_GATE_POLICIES = Object.freeze([
  { sourceKey: "sgg-84", informationClass: "DEADLINE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb10-37", informationClass: "PROCESS_IDENTITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["EVENT_DATE", "PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb2-7", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb2-19", informationClass: "ELIGIBILITY" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["PROCESS_VARIANT"] as const, riskClass: "HIGH" },
  { sourceKey: "sgb2-22", informationClass: "AUTHORITY_COMPETENCE" as const, handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT" as const, freshnessClass: "EVENT_DRIVEN" as const, staleBehavior: "DO_NOT_USE_STALE" as const, requiredContextKeys: ["BUNDESLAND"] as const, riskClass: "HIGH" },
]);

export function evaluateJobcenterProcessCompleteness(
  pack: CuratedDomainPack,
  units: readonly UnitSpec[] = JOBCENTER_UNITS,
) {
  const claimByKey = new Map(pack.claims.map((claim) => [String(claim.key), claim]));
  const processByKey = new Map(pack.processes.map((process) => [String(process.key), process]));
  const formIds = new Set(pack.forms.map((form) => String(form.identifier)));
  const rows = JOBCENTER_PROCESS_SCENARIOS.map((scenario) => {
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

export function buildJobcenterFederalCorePack(): CuratedDomainPack {
  const item = factory(JOBCENTER_PACK_ID);
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
    jobcenter: item("authorities", "jobcenter-grundsicherungstraeger", {
      publisherId: publishers.ba.id,
      name: "Jobcenter als Träger des Grundsicherungsgeldes",
      type: "jobcenter",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/grundsicherung",
    }),
    ba: item("authorities", "bundesagentur-fuer-arbeit", {
      publisherId: publishers.ba.id,
      name: "Bundesagentur für Arbeit",
      type: "federal_employment_agency",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.arbeitsagentur.de/grundsicherung",
    }),
    bmas: item("authorities", "bundesministerium-arbeit-soziales", {
      publisherId: publishers.bmas.id,
      name: "Bundesministerium für Arbeit und Soziales",
      type: "federal_ministry",
      jurisdictionId: jurisdiction.id,
      territorialScopeId: scope.id,
      officialPortalUrl: "https://www.bmas.de/DE/Arbeit/Grundsicherung-fuer-Arbeitsuchende/grundsicherung-fuer-arbeitsuchende.html",
    }),
  };

  const sources = JOBCENTER_OFFICIAL_SOURCES.map((spec) => {
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

  const claims = JOBCENTER_UNITS.map((unit) => {
    const source = sourceByKey.get(unit.sourceKey);
    const passage = passageByKey.get(unit.passageKey);
    if (!source || !passage) throw new Error(`JOBCENTER_UNIT_SOURCE_MISSING:${unit.key}`);
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
    if (!source) throw new Error(`JOBCENTER_CONTEXT_POLICY_SOURCE_MISSING:${spec.sourceKey}`);
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

  const processes = JOBCENTER_PROCESSES.map((spec) => item("processes", spec.key, {
    processGroupId: JOBCENTER_DOMAIN,
    title: spec.title,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
    riskLevel: spec.riskLevel,
    trigger: spec.trigger,
    safeFirstStep: spec.safeFirstStep,
    regionalVariationExpected: spec.key === "competent-jobcenter-resolution" || spec.key === "housing-kdu",
  }));
  const processByKey = new Map(processes.map((process) => [String(process.key), process]));
  const claimByKey = new Map(claims.map(({ claim }) => [String(claim.key), claim]));
  const processClaimLinks = JOBCENTER_PROCESS_BINDINGS.flatMap((binding) => {
    const process = processByKey.get(binding.processKey);
    if (!process) throw new Error(`JOBCENTER_PROCESS_MISSING:${binding.processKey}`);
    return binding.claimKeys.map((claimKey) => {
      const claim = claimByKey.get(claimKey);
      if (!claim) throw new Error(`JOBCENTER_PROCESS_CLAIM_MISSING:${binding.processKey}:${claimKey}`);
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

  const inspectBescheidRule = item("actorRules", "inspect-jobcenter-bescheid-before-widerspruch", {
    actorState: "inspect_jobcenter_bescheid_before_widerspruch",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const competenceRule = item("actorRules", "competent-jobcenter-undetermined", {
    actorState: "competent_jobcenter_undetermined_without_locality",
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
  const foreignRule = item("actorRules", "foreign-status-undetermined", {
    actorState: "foreign_status_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const amountRule = item("actorRules", "individual-amount-undetermined", {
    actorState: "individual_amount_undetermined",
    userMustAct: false,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });
  const changeRule = item("actorRules", "user-must-report-change", {
    actorState: "user_must_report_change",
    userMustAct: true,
    authorityMustAct: false,
    jurisdictionId: jurisdiction.id,
    territorialScopeId: scope.id,
  });

  const forms = JOBCENTER_FORMS.map((spec) => {
    const source = sourceByKey.get(spec.sourceKey);
    const passage = passageByKey.get(spec.passageKey);
    if (!source || !passage) throw new Error(`JOBCENTER_FORM_SOURCE_MISSING:${spec.key}`);
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
    packId: JOBCENTER_PACK_ID,
    domain: JOBCENTER_DOMAIN,
    canonicalLanguage: JOBCENTER_CANONICAL_LANGUAGE,
    trustDomain,
    jurisdictions: [jurisdiction],
    territorialScopes: [scope],
    publishers: [publishers.bmj, publishers.bmas, publishers.ba],
    authorities: [authorities.jobcenter, authorities.ba, authorities.bmas],
    sources: sources.map(({ source }) => source),
    sourceVersions: sources.map(({ version }) => version),
    passages: sources.flatMap(({ passages }) => passages),
    claims: claims.map(({ claim }) => claim),
    evidenceLinks: claims.map(({ evidence }) => evidence),
    citations: claims.map(({ citation }) => citation),
    actorRules: [inspectBescheidRule, competenceRule, deadlineRule, foreignRule, amountRule, changeRule],
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

export function jobcenterPackSummary(pack: CuratedDomainPack = buildJobcenterFederalCorePack()) {
  const categories = Object.fromEntries(
    JOBCENTER_UNITS.reduce((counts, unit) => {
      counts.set(unit.category, (counts.get(unit.category) ?? 0) + 1);
      return counts;
    }, new Map<JobcenterUnitCategory, number>()),
  );
  const completeness = evaluateJobcenterProcessCompleteness(pack);
  return Object.freeze({
    domain: pack.domain,
    packId: pack.packId,
    canonicalLanguage: pack.canonicalLanguage,
    claimCount: pack.claims.length,
    sourceCount: pack.sources.length,
    processCount: pack.processes.length,
    processClaimLinkCount: pack.processClaimLinks.length,
    formCount: pack.forms.length,
    current2026Count: JOBCENTER_UNITS.length,
    futureWatchCount: JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.length,
    g3ProcessStepLimitation: JOBCENTER_G3_PROCESS_STEP_LIMITATION,
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
